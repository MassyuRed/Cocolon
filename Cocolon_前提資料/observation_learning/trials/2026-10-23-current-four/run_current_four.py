"""Bounded C0 run for the four approved synthetic fixtures; no external I/O.

Requires exact API source tree specified by the source manifests next to this
file. It uses pure native entry points, never the service/store/public API.
Results are checkpointed after each operation. Existing results prevent rerun.
"""
import dataclasses
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import sys
import time
import traceback

ROOT = Path(__file__).resolve().parent
API = ROOT / "api/ai/services/ai_inference"
FIXTURES = ROOT / "task_inputs.jsonl"
OUTPUT = ROOT / "current_four_results.json"
sys.path.insert(0, str(API))
sys.path.insert(0, str(ROOT))


def encode(obj):
    if dataclasses.is_dataclass(obj):
        return {f.name: getattr(obj, f.name) for f in dataclasses.fields(obj)}
    if isinstance(obj, bytes):
        return {"__bytes_hex__": obj.hex()}
    if isinstance(obj, (set, frozenset)):
        return sorted(obj)
    raise TypeError(type(obj).__name__)


def main():
    if OUTPUT.exists():
        raise SystemExit("Existing C0 results retained; no automatic rerun")
    files = {}
    for name in ("emlis_source_manifest.json", "piece_analysis_source_manifest.json"):
        manifest = json.loads((ROOT / name).read_text())
        entries = manifest if isinstance(manifest, list) else manifest["files"]
        for item in entries:
            path = API / item["path"]
            data = path.read_bytes()
            sha = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
            if sha != item["sha"]:
                raise SystemExit("Source blob mismatch: " + item["path"])
            files[item["path"]] = sha
    rows = {r["case_id"]: r for r in map(json.loads, FIXTURES.read_text().splitlines())}
    ids = ["E02-0", "E02-B", "P01-N", "A02-P1"]
    assert all(i in rows for i in ids)
    from cocolon_meaning_experience_engine.engine import MeaningExperienceEngine
    from emlis_binding import initial_request, answer_request
    from piece_analysis_binding import run_piece_once, run_analysis_once
    engine = MeaningExperienceEngine()
    first_request = initial_request(rows["E02-0"])
    result = dict(api_sha="3084c99e5a08d6e475d8a177e62ebf1548e8a0f9",
                  cocolon_sha="4450b15ff7d5cb21121b723b9d30d97c8e8cad7c",
                  fixture_sha256=hashlib.sha256(FIXTURES.read_bytes()).hexdigest(),
                  source_blobs=files, started_utc=datetime.now(timezone.utc).isoformat(),
                  python=sys.version, external_inference_requests=0,
                  db_or_public_api_calls=0, records=[])

    def save():
        OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2, default=encode))

    def run(case_id, call):
        began = time.perf_counter()
        record = {"case_id": case_id}
        try:
            obj = call()
            record.update(execution_status="COMPLETED", output=obj)
            return_obj = obj
        except Exception as exc:
            record.update(execution_status="ERROR", error_type=type(exc).__name__,
                          error=str(exc), traceback=traceback.format_exc())
            return_obj = None
        record["wall_seconds"] = time.perf_counter()-began
        result["records"].append(record)
        save()
        print(json.dumps({k: v for k, v in record.items() if k not in ("output", "traceback")},
                         ensure_ascii=False), flush=True)
        return return_obj

    save()
    first = run("E02-0", lambda: engine.generate(first_request))
    if first is None:
        result["records"].append(dict(case_id="E02-B", execution_status="N_A_INITIAL_ERROR"))
        save()
    else:
        began = time.perf_counter()
        try:
            req, prep = answer_request(rows["E02-B"], first_request, first, engine,
                                      recorded_at="2026-10-23T00:00:00+00:00")
            if req is None:
                result["records"].append(dict(case_id="E02-B", execution_status=prep,
                                               wall_seconds=time.perf_counter()-began))
                save()
            else:
                run("E02-B", lambda: engine.generate(req))
        except Exception as exc:
            result["records"].append(dict(case_id="E02-B", execution_status="BINDING_ERROR",
                error_type=type(exc).__name__, error=str(exc), traceback=traceback.format_exc()))
            save()
    run("P01-N", lambda: run_piece_once(rows["P01-N"]))
    run("A02-P1", lambda: run_analysis_once(rows["A02-P1"]))
    result["finished_utc"] = datetime.now(timezone.utc).isoformat()
    save()
    print("C0 trial completed; no model/API/DB calls", flush=True)


if __name__ == "__main__":
    main()
