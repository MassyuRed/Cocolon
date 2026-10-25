#!/usr/bin/env python3
"""One-shot CPU check of known 4B raw -> CMEE snapshot -> cold file resume.

This checks the engine's private serialized snapshot, not EmlisThreadService,
SQL/RPC storage, HTTP/Auth, RN/device operation, new model generation or quality.
Only the two already published fictional chair outputs are consumed.
"""
import argparse
import copy
from dataclasses import replace
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time
from unittest.mock import patch

sys.dont_write_bytecode = True
PACK = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PACK))
from run_pilot import PROFILE, digest, read_jsonl, strict_json, write_json
from verify_cmee import consume_raw, json_value, load_api, reconstruct_request

API_COMMIT = "7a4dc32c07f8c8a30609e8345207c6a9c831de23"
ADAPTER_REVISION = "9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835"
TRIAL = PACK.parent.parent / "trials" / "2026-10-24-qwen4b-cmee-diagnostic"
SOURCE = TRIAL / "model_roundtrip_20261025"
OUTPUT = TRIAL / "service_persistence_20261025"
SCOPE = ("Known fictional chair raw replay and CMEE engine-only cold file resume. "
         "No service/SQL/RPC/Auth/HTTP/RN/device validation, no new model or training, "
         "no general-input quality or product acceptance.")


def require(condition, code):
    if not condition:
        raise ValueError(code)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def value_digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def deadline(_signum, _frame):
    raise TimeoutError("bounded_cpu_resume_timeout")


def generated_from_snapshot(example, snapshot, checkpoint_id, *, resume_only):
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine import emlis_semantic_admission as semantic
    from cocolon_meaning_experience_engine.model_candidate_source import ModelCandidateSource
    from cocolon_meaning_experience_engine import preparation

    request, _ = reconstruct_request(example)
    original_prepare = semantic._prepare_model_snapshot
    modes = []

    def only_resume(req, semantic_input):
        modes.append(semantic_input.mode)
        require(semantic_input.mode == "RESUME_ADOPTED", "cold_resume_requested_fresh_adoption")
        return original_prepare(req, semantic_input)

    def forbidden(*_args, **_kwargs):
        raise AssertionError("cold_resume_requested_new_candidate")

    # Snapshot restore validates its original receipt and source bindings. It
    # does not obtain a new receipt or call a model candidate provider.
    with patch.object(semantic, "_prepare_model_snapshot", only_resume), \
            patch.object(preparation, "receive_candidate", forbidden), \
            patch.object(ModelCandidateSource, "__call__", forbidden):
        prepared = semantic.restore_model_snapshot(request, snapshot)
        require(prepared.semantic_snapshot == snapshot, "restored_snapshot_changed")
        require(prepared.checkpoint.checkpoint_id == checkpoint_id, "restored_checkpoint_changed")
        request = replace(request, emlis_thread=replace(request.emlis_thread,
            prepared_meaning_checkpoint_ref=checkpoint_id))
        outcome = MeaningExperienceEngine().generate(request, semantic_input=semantic.SemanticInput(
            "RESUME_ADOPTED", snapshot_json=snapshot, semantic_profile=PROFILE))
    require(bool(modes) and set(modes) == {"RESUME_ADOPTED"}, "cold_resume_mode_invalid")
    require(outcome.artifact is not None, "restored_body_unavailable")
    return {"full_outcome": json_value(outcome), "snapshot_unchanged": True,
            "checkpoint_unchanged": True, "resume_modes": modes,
            "fresh_adoptions": 0, "new_candidate_calls": 0,
            "resume_only": resume_only}


def worker(args):
    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(30)
    load_api(args.api_root, API_COMMIT)
    require(digest(args.saved_input) == args.expected_input_sha256, "saved_input_hash_changed")
    payload = strict_json(args.saved_input.read_text(encoding="utf-8"))
    require(payload["api_commit"] == API_COMMIT, "saved_api_commit_changed")
    result = generated_from_snapshot({"native_case": payload["native_case"]},
        payload["semantic_snapshot"], payload["checkpoint_id"], resume_only=True)
    require(value_digest(result["full_outcome"]) == payload["expected_full_outcome_sha256"],
            "cold_full_outcome_changed")
    result.update(stage=payload["stage"], process_id=os.getpid(),
                  full_outcome_sha256=value_digest(result["full_outcome"]),
                  saved_input_sha256=digest(args.saved_input))
    require(not args.worker_output.exists(), "worker_output_already_exists")
    write_json(args.worker_output, result)
    signal.alarm(0)


def main(args):
    started = time.monotonic()
    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(120)
    api_root = args.api_root.resolve()
    load_api(api_root, API_COMMIT)
    output = args.output_directory.resolve()
    require(output == OUTPUT.resolve(), "output_outside_fixed_trial")
    require(not output.exists(), "one_shot_output_already_exists")
    tracked_inputs = [PACK / "sft_examples.jsonl", PACK / "verify_cmee.py", PACK / "run_pilot.py",
                      PACK / "dataset_manifest.json", SOURCE / "file_manifest.json", SOURCE / "run.json"]
    tracked_inputs += [SOURCE / f"{stage}_{kind}" for stage in ("initial", "correction")
                       for kind in ("raw.jsonl", "cmee.json", "messages.json")]
    before = {str(path.relative_to(PACK.parent.parent)): digest(path) for path in tracked_inputs}
    manifest = strict_json((SOURCE / "file_manifest.json").read_text(encoding="utf-8"))
    for path in tracked_inputs:
        if path.parent == SOURCE and path.name in manifest:
            require(digest(path) == manifest[path.name]["sha256"]
                    and path.stat().st_size == manifest[path.name]["bytes"], "source_manifest_mismatch")
    run = strict_json((SOURCE / "run.json").read_text(encoding="utf-8"))
    require(run["api_commit"] == API_COMMIT and run["adapter_sha256"]["adapter_model.safetensors"] == ADAPTER_REVISION,
            "source_run_identity_changed")
    require(run["status"] == "OFFLINE_KNOWN_ROUNDTRIP_COMPLETE_NOT_PRODUCT_ACCEPTED",
            "source_roundtrip_not_complete")
    examples = {row["id"]: row for row in read_jsonl(PACK / "sft_examples.jsonl")}
    initial_example = copy.deepcopy(examples["FT-CHAIR-INITIAL"])
    correction_example = copy.deepcopy(examples["FT-CHAIR-AFTER-CORRECTION"])
    require(initial_example["scenario_persons_fictitious"] is True
            and correction_example["scenario_persons_fictitious"] is True, "not_known_fictional_cases")
    output.mkdir()
    report = {"schema": "cocolon.cmee.known_engine_cold_file_resume.v1", "scope": SCOPE,
              "status": "STARTED", "api_commit": API_COMMIT, "adapter_revision": ADAPTER_REVISION,
              "source_hashes": before, "new_model_calls": 0, "new_training_updates": 0,
              "database_operations": 0, "service_saved_roundtrip": False,
              "sql_persistence_tested": False, "pglite_available": False,
              "product_accepted": False, "automatic_progression": False,
              "raw_modified": False, "parent_process_id": os.getpid(), "stages": []}
    write_json(output / "attempt.json", {"process_id": os.getpid(), "max_seconds": 120,
                                         "child_max_seconds": 30, "retry": 0, "scope": SCOPE})
    try:
        actual_initial = None
        for stage, example in (("initial", initial_example), ("correction", correction_example)):
            if stage == "correction":
                require(actual_initial is not None, "initial_result_missing")
                require(actual_initial["question"] == example["native_case"]["question_control"]["pending_question"],
                        "actual_question_does_not_match_scenario")
                example["native_case"]["prior_snapshot_json"] = actual_initial["semantic_snapshot"]
            records = read_jsonl(SOURCE / f"{stage}_raw.jsonl")
            require(len(records) == 1, "source_raw_cardinality_changed")
            actual = consume_raw(example, records[0], expected_adapter_revision=ADAPTER_REVISION)
            require(actual["status"] == "MEANING_AND_BODY_AVAILABLE", "saved_raw_not_adopted")
            baseline = strict_json((SOURCE / f"{stage}_cmee.json").read_text(encoding="utf-8"))
            for key in ("semantic_snapshot", "meaning_checkpoint", "outcome", "body", "question"):
                require(actual[key] == baseline[key], "saved_raw_replay_differs_from_prior_run_" + key)
            if stage == "initial":
                actual_initial = actual
                require(actual["outcome"]["status"] == "QUESTION_PENDING" and actual["question"] is not None,
                        "initial_question_not_pending")
            else:
                require(actual["outcome"]["body_state"] == "REFINED" and actual["question"] is None
                        and actual["outcome"]["question_decision"]["disposition"] == "END", "correction_not_final")
                require(len(actual["meaning_checkpoint"]["answer_update"]["updates"]) == 3, "correction_update_count_changed")
                require(strict_json(actual["semantic_snapshot"])["prior_snapshot"] ==
                        strict_json(actual_initial["semantic_snapshot"]), "actual_initial_prior_not_retained")
            checkpoint_id = actual["meaning_checkpoint"]["checkpoint_id"]
            warm = generated_from_snapshot(example, actual["semantic_snapshot"], checkpoint_id, resume_only=True)
            saved = {"schema": "cocolon.cmee.engine_only_saved_native_snapshot.v1", "stage": stage,
                     "api_commit": API_COMMIT, "native_case": example["native_case"],
                     "semantic_snapshot": actual["semantic_snapshot"], "checkpoint_id": checkpoint_id,
                     "source_raw_sha256": digest(SOURCE / f"{stage}_raw.jsonl"),
                     "expected_full_outcome_sha256": value_digest(warm["full_outcome"])}
            saved_path = output / f"{stage}_saved_input.json"
            write_json(saved_path, saved)
            child_path = output / f"{stage}_cold_outcome.json"
            command = [sys.executable, "-B", str(Path(__file__).resolve()), "--worker", "--api-root", str(api_root),
                       "--saved-input", str(saved_path), "--expected-input-sha256", digest(saved_path),
                       "--worker-output", str(child_path)]
            child = subprocess.run(command, check=True, capture_output=True, text=True,
                                   timeout=min(30, max(1, 120 - (time.monotonic() - started))))
            require(not child.stdout.strip(), "unexpected_worker_stdout")
            cold = strict_json(child_path.read_text(encoding="utf-8"))
            require(cold["process_id"] != os.getpid(), "cold_restore_not_separate_process")
            require(cold["full_outcome"] == warm["full_outcome"], "full_cold_outcome_not_equal")
            require(cold["saved_input_sha256"] == digest(saved_path), "saved_input_changed_during_restore")
            report["stages"].append({"stage": stage, "status": actual["outcome"]["status"],
                "body_state": actual["outcome"]["body_state"], "question": actual["question"],
                "body": actual["body"], "updates": len((actual["meaning_checkpoint"]["answer_update"] or {}).get("updates", [])),
                "saved_input_sha256": digest(saved_path), "cold_outcome_sha256": digest(child_path),
                "full_outcome_sha256": cold["full_outcome_sha256"], "full_outcome_equal": True,
                "child_process_id": cold["process_id"], "snapshot_unchanged": cold["snapshot_unchanged"],
                "checkpoint_unchanged": cold["checkpoint_unchanged"], "resume_modes": cold["resume_modes"],
                "new_candidate_calls": cold["new_candidate_calls"], "fresh_adoptions_during_resume": cold["fresh_adoptions"],
                "worker_stderr": child.stderr})
        after = {str(path.relative_to(PACK.parent.parent)): digest(path) for path in tracked_inputs}
        require(after == before, "raw_or_fixture_changed")
        load_api(api_root, API_COMMIT)
        report.update(status="KNOWN_ENGINE_COLD_FILE_RESUME_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED",
                      source_files_unchanged=True, actual_initial_snapshot_used=True,
                      full_outcome_equal_count=2, meaning_count=2, body_count=2, correction_updates=3,
                      seconds=time.monotonic() - started)
        write_json(output / "result.json", report)
        print(json.dumps({key: report[key] for key in ("status", "full_outcome_equal_count", "correction_updates", "seconds")}))
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error_type=type(exc).__name__, seconds=time.monotonic() - started)
        write_json(output / "result.json", report)
        raise
    finally:
        signal.alarm(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-root", type=Path, required=True)
    parser.add_argument("--output-directory", type=Path, default=OUTPUT)
    parser.add_argument("--worker", action="store_true")
    parser.add_argument("--saved-input", type=Path)
    parser.add_argument("--expected-input-sha256")
    parser.add_argument("--worker-output", type=Path)
    arguments = parser.parse_args()
    if arguments.worker:
        require(arguments.saved_input is not None and arguments.worker_output is not None
                and arguments.expected_input_sha256 is not None, "worker_arguments_incomplete")
        worker(arguments)
    else:
        main(arguments)
