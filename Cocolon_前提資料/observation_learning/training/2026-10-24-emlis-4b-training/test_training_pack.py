"""CPU stdlib checks. Stub tokenizer/GPU are not actual 4B/GPU validation."""
import copy
import hashlib
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

import run_pilot as runner
from export_checkpoint import export


class Tokenizer:
    eos_token_id = 1
    pad_token_id = None

    def apply_chat_template(self, messages, **kwargs):
        assert kwargs["return_dict"] is False and kwargs["truncation"] is False
        assert kwargs["enable_thinking"] is False and kwargs["return_tensors"] is None
        result = [2]
        for message in messages:
            if message["role"] == "assistant":
                result.extend(ord(c) + 3 for c in message["content"].strip() + "<|im_end|>\n")
            else:
                result.extend(ord(c) + 3 for c in message["content"])
        return result

    def decode(self, ids, **kwargs):
        return "".join(chr(x - 3) for x in ids)


def ready_dataset(directory):
    target = {"candidate": {"schema_version": runner.CANDIDATE_SCHEMA, "core": "emlis"},
              "evidence": [{"source_id": "synthetic", "field_path": "memo", "start": 0, "end": 1, "quote": "a"}]}
    messages = [{"role": "system", "content": runner.JSON_INSTRUCTION}, {"role": "user", "content": "{}"},
                {"role": "assistant", "content": json.dumps(target)}]
    example = {"id": "SYNTHETIC-FIT", "family": "chair", "stage": "initial", "status": runner.TARGET_STATUS,
               "source_refs": ["synthetic-only-test"], "fit_generation": True, "messages": messages}
    evaluation = {"case_id": "SYNTHETIC-EVAL", "family": "another", "training_use": False, "messages": messages[:-1]}
    rows = {"examples": [example], "train_messages": [{"messages": messages}],
            "eval_inputs": [evaluation], "eval_review": [{"case_id": evaluation["case_id"]}]}
    manifest = {"schema": "cocolon.emlis_4b_dataset.v1", "semantic_profile": runner.PROFILE,
                "status": runner.TARGET_STATUS, "training_rows": 1, "evaluation_rows": 1, "files": {}}
    for role, values in rows.items():
        path = directory / (role + ".jsonl")
        path.write_text("\n".join(json.dumps(row) for row in values) + "\n")
        manifest["files"][role] = {"path": path.name, "sha256": runner.digest(path)}
    runner.write_json(directory / "dataset_manifest.json", manifest)
    return manifest, rows


class TrainingPackTests(unittest.TestCase):
    def test_unfinished_real_manifest_never_becomes_training_data(self):
        # Root may later finish the formal dataset; this test uses an isolated pending copy.
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            runner.write_json(p / "dataset_manifest.json", {"schema": "cocolon.emlis_4b_dataset.v1", "status": "PENDING"})
            with self.assertRaisesRegex(ValueError, "dataset_not_ready"):
                runner.validate_data(p)

    def test_hash_identity_and_family_leakage(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            manifest, rows = ready_dataset(p)
            examples, evaluation, _, _ = runner.validate_data(p)
            self.assertEqual(len(examples), 1)
            self.assertEqual(len(runner.teacher_fit_cases(examples)), 1)
            self.assertNotIn("assistant", [x["role"] for x in runner.teacher_fit_cases(examples)[0]["messages"]])
            (p / "examples.jsonl").write_text("{}\n")
            with self.assertRaisesRegex(ValueError, "dataset_hash_mismatch"):
                runner.validate_data(p)
            ready_dataset(p)
            rows["eval_inputs"][0]["family"] = "chair"
            path = p / "eval_inputs.jsonl"
            path.write_text(json.dumps(rows["eval_inputs"][0]) + "\n")
            manifest["files"]["eval_inputs"]["sha256"] = runner.digest(path)
            runner.write_json(p / "dataset_manifest.json", manifest)
            with self.assertRaisesRegex(ValueError, "train_eval_family_overlap"):
                runner.validate_data(p)

    def test_explanatory_examples_and_symbolic_prior_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            with self.assertRaises(ValueError):
                runner.local_file(p, "contract_examples.json")
            with self.assertRaises(ValueError):
                runner.local_file(p, "../outside.jsonl")
            manifest, rows = ready_dataset(p)
            rows["examples"][0]["messages"][-1]["content"] += "$actual_prior_snapshot_ref"
            for role in ["examples", "train_messages"]:
                path = p / (role + ".jsonl")
                if role == "train_messages":
                    rows[role][0]["messages"] = rows["examples"][0]["messages"]
                path.write_text(json.dumps(rows[role][0]) + "\n")
                manifest["files"][role]["sha256"] = runner.digest(path)
            runner.write_json(p / "dataset_manifest.json", manifest)
            with self.assertRaisesRegex(ValueError, "symbolic_contract_example"):
                runner.validate_data(p)

    def test_final_assistant_only_eos_prefix_and_no_truncation(self):
        messages = [{"role": "system", "content": "s"}, {"role": "user", "content": "u"}, {"role": "assistant", "content": "{}"}]
        encoded, prefix = runner.encode_training(Tokenizer(), messages)
        self.assertEqual(encoded["labels"][:prefix], [-100] * prefix)
        self.assertEqual(encoded["labels"][prefix:], encoded["input_ids"][prefix:])
        with self.assertRaisesRegex(ValueError, "no_truncation"):
            runner.encode_training(Tokenizer(), messages, context=2)
        class WrongTokenizer(Tokenizer):
            def apply_chat_template(self, messages, **kwargs):
                return {"input_ids": [1, 2]}
        with self.assertRaisesRegex(ValueError, "flat_token_ids"):
            runner.chat_token_ids(WrongTokenizer(), messages, generation_prompt=False)

    def test_unknown_budget_blocks_run_but_lengths_can_be_measured(self):
        plan = json.loads((Path(__file__).parent / "execution_plan.json").read_text())
        runner.validate_plan(plan, paid_run=False)
        with self.assertRaisesRegex(ValueError, "gpu_plan_unresolved"):
            runner.validate_plan(plan, paid_run=True)
        plan.update(context_tokens=4096, max_new_tokens=2048, max_seconds=60, gpu_hourly_usd=1, max_total_usd=1,
                    minimum_free_gib=12, gpu_run_authorized=True, pod_billing_scope_confirmed=True, storage_mount_verified=True,
                    storage_mount_description="synthetic mount", pod_external_receipt_destination="synthetic target")
        runner.validate_plan(plan, paid_run=True)
        class CUDA:
            is_available = staticmethod(lambda: True)
            is_bf16_supported = staticmethod(lambda: True)
            mem_get_info = staticmethod(lambda: (15 * 2**30, 16 * 2**30))
            get_device_name = staticmethod(lambda x: "synthetic 16GB")
        class Torch:
            cuda = CUDA
            __version__ = "synthetic"
            class version:
                cuda = "synthetic"
        self.assertEqual(runner.gpu_profile(Torch, plan)["total_bytes"], 16 * 2**30)
        CUDA.mem_get_info = staticmethod(lambda: (10 * 2**30, 16 * 2**30))
        with self.assertRaisesRegex(RuntimeError, "below_recorded_plan"):
            runner.gpu_profile(Torch, plan)

    def test_export_excludes_credentials_and_marks_missing_adapter(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            ready_dataset(p)
            run = p / "results" / "synthetic-run"
            run.mkdir(parents=True)
            runner.write_json(run / "run.json", {"run_id": run.name, "model": runner.MODEL, "revision": runner.REVISION,
                                                "semantic_profile": runner.PROFILE})
            (p / "credentials.txt").write_text("must not export")
            with self.assertRaises(FileNotFoundError):
                export(p, run)
            archive_path = export(p, run, allow_missing_adapter=True)
            with tarfile.open(archive_path) as archive:
                names = archive.getnames()
                self.assertNotIn("credentials.txt", names)
                meta = json.load(archive.extractfile("checkpoint_manifest.json"))
                self.assertFalse(meta["adapter_present"])
            adapter = run / "adapter"
            adapter.mkdir()
            for n in ["README.md", "adapter_config.json", "adapter_model.safetensors"]:
                (adapter / n).write_text("synthetic-only-not-model-weights")
            archive_path = export(p, run)
            with tarfile.open(archive_path) as archive:
                meta = json.load(archive.extractfile("checkpoint_manifest.json"))
                self.assertTrue(meta["adapter_present"])
                self.assertFalse(meta["pod_external_receipt_verified"])
            self.assertTrue(archive_path.with_suffix(archive_path.suffix + ".sha256").exists())

    def test_inconsistent_deadline_cost_and_boolean_training_counts_are_rejected(self):
        plan = json.loads((Path(__file__).parent / "execution_plan.json").read_text())
        plan.update(context_tokens=4096, max_new_tokens=2048, max_seconds=3600, gpu_hourly_usd=1,
                    max_total_usd=1, minimum_free_gib=12, gpu_run_authorized=True,
                    pod_billing_scope_confirmed=True, storage_mount_verified=True,
                    storage_mount_description="synthetic mount", pod_external_receipt_destination="synthetic target")
        runner.validate_plan(plan, paid_run=True)
        plan["max_total_usd"] = 0.99
        with self.assertRaisesRegex(ValueError, "cost_exceeds_recorded_total_budget"):
            runner.validate_plan(plan, paid_run=True)
        plan["max_total_usd"] = 1
        for key in ("epochs", "batch_size", "gradient_accumulation"):
            changed = dict(plan, **{key: True})
            with self.subTest(key=key), self.assertRaisesRegex(ValueError, "one_epoch_batch1_accumulation1"):
                runner.validate_plan(changed, paid_run=True)

    def test_strict_json_rejects_duplicate_nonfinite_and_unicode(self):
        for value in ['{"a":1,"a":2}', '{"a":NaN}', '{"a":1e999}', '{"a":"\\ud800"}']:
            with self.subTest(value=value), self.assertRaises((ValueError, UnicodeError)):
                runner.strict_json(value)


if __name__ == "__main__":
    unittest.main(verbosity=2)
