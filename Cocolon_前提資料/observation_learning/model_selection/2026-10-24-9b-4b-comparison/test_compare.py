"""CPU checks for paid-run bounds, result preservation and the price envelope."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import budget
import compare

ROOT = Path(__file__).resolve().parent


class ComparisonChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        shutil.copy(ROOT / "cases.jsonl", self.directory / "cases.jsonl")
        compare.write_json(self.directory / "preflight.json", {"runner_sha256": compare.sha(Path(compare.__file__).read_bytes())})
        (self.directory / "SOURCE_COMMIT").write_text("a" * 40)

    def output(self, key, count=6, complete=True):
        model, revision = compare.MODELS[key]
        compare.write_json(self.directory / (key + ".json"), {
            "status": "SIX_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED" if complete else "STOPPED_OR_FAILED",
            "model": model, "revision": revision, "fine_tuning_performed": False,
            "outputs": [{"case_id": c["case_id"], "raw_text": "CPU fixture"} for c in compare.load_cases(self.directory)[:count]]})

    def test_model_failure_keeps_first_model_and_partial_second(self):
        def child(args, check):
            key = args[args.index("--model") + 1]
            self.output(key, 6 if key == "4b" else 2, key == "4b")
            if key == "9b":
                raise subprocess.CalledProcessError(1, args)
        with patch.object(compare.subprocess, "run", side_effect=child):
            with self.assertRaises(subprocess.CalledProcessError):
                compare.run(self.directory)
        result = json.loads((self.directory / "latest_selection.json").read_text())
        self.assertEqual(result["status"], "STOPPED_OR_FAILED")
        self.assertEqual([len(result["models"][k]["outputs"]) for k in ["4b", "9b"]], [6, 2])
        self.assertIn(hashlib.sha256((self.directory / "latest_selection.json").read_bytes()).hexdigest(),
                      (self.directory / "latest_selection.json.sha256").read_text())
        with patch.object(compare.subprocess, "run") as child:
            with self.assertRaises(FileExistsError):
                compare.run(self.directory)
            child.assert_not_called()

    def test_incomplete_success_is_not_promoted_to_twelve(self):
        with patch.object(compare.subprocess, "run", side_effect=lambda args, check: self.output("4b", 2)):
            with self.assertRaises(ValueError):
                compare.run(self.directory)
        result = json.loads((self.directory / "latest_selection.json").read_text())
        self.assertEqual(result["status"], "STOPPED_OR_FAILED")

    def test_twelve_outputs_complete_and_second_run_is_blocked(self):
        def child(args, check):
            self.output(args[args.index("--model") + 1])
        with patch.object(compare.subprocess, "run", side_effect=child) as invoked:
            compare.run(self.directory)
            self.assertEqual(invoked.call_count, 2)
        self.assertEqual(json.loads((self.directory / "latest_selection.json").read_text())["status"],
                         "TWELVE_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED")
        with self.assertRaises(FileExistsError):
            compare.run(self.directory)

    def test_input_edit_rejected_before_execution(self):
        with (self.directory / "cases.jsonl").open("a") as stream:
            stream.write("\n")
        with patch.object(compare.subprocess, "run") as child:
            with self.assertRaises(ValueError):
                compare.run(self.directory)
            child.assert_not_called()

    def test_price_envelope_does_not_hide_negative_budget(self):
        report = budget.calculate()
        row = next(r for r in report["rows"] if r["paid_users"] == 50 and r["fee_assumption"] == .26 and r["reserve_fraction_proposal"] == .2)
        self.assertEqual(row["remaining_all_inference_storage_etc_jpy"], 10809.45)
        self.assertEqual(row["nominal_monthly_generations_scenario"], 78980)
        self.assertAlmostEqual(row["max_average_flex48_billable_gpu_seconds_per_nominal_generation"], 2.524, places=3)
        small = next(r for r in report["rows"] if r["paid_users"] == 10 and r["fee_assumption"] == .26 and r["reserve_fraction_proposal"] == .2)
        self.assertLess(small["remaining_all_inference_storage_etc_jpy"], 0)
        self.assertTrue(all(v == 0 for v in small["max_gpu_hours_before_storage"].values()))


class WrapperChecks(unittest.TestCase):
    def test_force_kill_salvages_partial_files_and_blocks_repeat(self):
        # Exercise the real outer timeout and cleanup; replace only the paid inner work.
        with tempfile.TemporaryDirectory() as temporary:
            directory = Path(temporary) / "result"
            script = (ROOT / "runpod.sh").read_text()
            script = script.replace("TASK_DIR=/workspace/cocolon_selection_20261024", f"TASK_DIR={directory}")
            script = script.replace("--kill-after=30s 1800s", "--kill-after=0.2s 1s")
            start = script.index('elif [[ "$MODE" == _execute ]]; then')
            end = script.rindex('\nelse\n  echo')
            stub = '''elif [[ "$MODE" == _execute ]]; then
  python - "$TASK_DIR" <<'PY'
import json,sys
from pathlib import Path
d=Path(sys.argv[1])
(d/'latest_selection.json').write_text(json.dumps({'status':'RUNNING','models':{}}))
for key,count in [('4b',6),('9b',2)]:
    (d/(key+'.json')).write_text(json.dumps({'status':'GENERATING','outputs':[{}]*count}))
PY
  trap '' TERM
  sleep 20
'''
            wrapper = Path(temporary) / "wrapper.sh"
            wrapper.write_text(script[:start] + stub + script[end:])
            env = dict(os.environ, COCOLON_SELECTION_COMMIT="a" * 40)
            result = subprocess.run(["bash", str(wrapper), "all"], env=env, capture_output=True, text=True, timeout=8)
            self.assertEqual(result.returncode, 137, result.stdout + result.stderr)
            report = json.loads((directory / "latest_selection.json").read_text())
            self.assertEqual(report["status"], "STOPPED_OR_FAILED")
            self.assertEqual(report["wrapper_exit_code"], 137)
            self.assertEqual([len(report["models"][k]["outputs"]) for k in ["4b", "9b"]], [6, 2])
            self.assertIn(hashlib.sha256((directory / "latest_selection.json").read_bytes()).hexdigest(),
                          (directory / "latest_selection.json.sha256").read_text())
            repeat = subprocess.run(["bash", str(wrapper), "all"], env=env, capture_output=True, text=True, timeout=3)
            self.assertNotEqual(repeat.returncode, 0)
            self.assertIn("比較は開始済み", repeat.stdout + repeat.stderr)


if __name__ == "__main__":
    unittest.main()
