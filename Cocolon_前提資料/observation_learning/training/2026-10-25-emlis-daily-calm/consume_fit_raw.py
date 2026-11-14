#!/usr/bin/env python3
"""CPU-only nine-case TRAINING_FIT_FIXED_PRIOR_NOT_DYNAMIC raw consumption.

Each correction uses its frozen teacher-adopted initial prior. This is not a
dynamic model/service roundtrip, held-out language evaluation or product test.
Raw text, source IDs, quotes and prior are never repaired or replaced.
"""
import argparse
from dataclasses import replace
import hashlib
import json
from pathlib import Path
import re
import sys
import time

sys.dont_write_bytecode = True
SCOPE = "TRAINING_FIT_FIXED_PRIOR_NOT_DYNAMIC"


def require(condition, code):
    if not condition:
        raise ValueError(code)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main(args):
    started = time.monotonic()
    pack, api = args.pack.resolve(), args.api_root.resolve()
    legacy = args.legacy_pack.resolve() if args.legacy_pack else pack.parent / "2026-10-24-emlis-4b-training"
    require(not args.output.exists(), "consumer_output_already_exists")
    require(re.fullmatch(r"[0-9a-f]{64}", args.expected_adapter_sha256 or ""), "adapter_sha256_required")
    sys.path[:0] = [str(api / "ai/services/ai_inference"), str(legacy)]
    from run_pilot import MODEL, REVISION, strict_json, read_jsonl, write_json
    from verify_cmee import reconstruct_request
    import emlis_thread_service as service_module
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages
    from cocolon_meaning_experience_engine.preparation import prepare_emlis, receive_candidate
    from cocolon_meaning_experience_engine.emlis_semantic_admission import SemanticInput, SemanticNotAdopted, MODEL_PROFILE
    require(Path(service_module.__file__).resolve().is_relative_to(api), "foreign_api_package_loaded")
    manifest = strict_json((pack / "dataset_manifest.json").read_text())
    for name, spec in manifest["files"].items():
        require(sha(pack / name) == spec["sha256"], "pack_file_hash_mismatch_" + name)
    for name, expected in manifest["api_source_hashes"].items():
        require(sha(api / name) == expected, "api_source_hash_mismatch")
    raw_hash = sha(args.raw_file)
    if args.expected_raw_sha256:
        require(raw_hash == args.expected_raw_sha256, "raw_file_hash_mismatch")
    examples, records = read_jsonl(pack / "sft_examples.jsonl"), read_jsonl(args.raw_file)
    by_id = {row["id"]: row for row in examples}
    require(len(examples) == len(by_id) == len(records) == 9, "exact_nine_fit_rows_required")
    require(len({row["case_id"] for row in records}) == 9 and {row["case_id"] for row in records} == set(by_id),
            "raw_case_ids_not_exact_frozen_training_ids")
    for raw in records:
        require(raw.get("model") == MODEL and raw.get("revision") == REVISION
                and raw.get("adapter_revision") == args.expected_adapter_sha256, "raw_model_identity_mismatch")
        require(type(raw.get("raw_text")) is str and hashlib.sha256(raw["raw_text"].encode()).hexdigest()
                == raw.get("raw_utf8_sha256"), "raw_text_checksum_mismatch")
    result = {"schema": "cocolon.emlis_service_binding_fixed_fit_consumer.v1", "scope": SCOPE,
        "api_commit": manifest["api_commit"], "api_source_hashes_verified": True,
        "dataset_manifest_sha256": sha(pack / "dataset_manifest.json"), "source_raw_sha256": raw_hash,
        "expected_adapter_revision": args.expected_adapter_sha256, "consumer_sha256": sha(Path(__file__)),
        "new_model_calls": 0, "training_updates": 0, "database_operations": 0,
        "dynamic_roundtrip": False, "service_saved_roundtrip": False,
        "product_accepted": False, "automatic_progression": False, "raw_modified": False, "cases": []}
    for raw in records:
        example = by_id[raw["case_id"]]
        row = {"case_id": raw["case_id"], "stage": example["stage"], "scope": SCOPE,
            "raw_record": raw, "meaning_adopted": False, "body_available": False,
            "receipt": None, "checkpoint": None, "body": None, "question": None, "updates": 0}
        try:
            request, prior = reconstruct_request(example)
            require(build_model_messages(request, prior) == example["messages"][:-1], "frozen_messages_mismatch")
            material = prepare_emlis(request)
            receipt = receive_candidate(material, request_id=material.request_id, raw_output=raw["raw_text"],
                finish_reason=raw.get("finish_reason"), provider=raw.get("provider"), model=raw["model"],
                revision=raw["revision"], adapter_revision=raw["adapter_revision"], usage=raw.get("usage"),
                elapsed_seconds=raw.get("seconds"))
            row["receipt"] = service_module._json(receipt)
            row["status"] = "CANDIDATE_NOT_ELIGIBLE"
            if receipt.status == "CANDIDATE_UNREVIEWED":
                engine = MeaningExperienceEngine()
                checkpoint = engine.prepare_emlis_update(request, semantic_input=SemanticInput(
                    "FRESH_CANDIDATE", receipt, prior_snapshot_json=prior, semantic_profile=MODEL_PROFILE))
                row.update(meaning_adopted=True, checkpoint=service_module._json(checkpoint),
                    updates=len(checkpoint.answer_update.updates) if checkpoint.answer_update else 0)
                resumed = replace(request, emlis_thread=replace(request.emlis_thread,
                    prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
                outcome = engine.generate(resumed, semantic_input=SemanticInput(
                    "RESUME_ADOPTED", snapshot_json=checkpoint.semantic_snapshot, semantic_profile=MODEL_PROFILE))
                row.update(outcome=service_module._json(outcome), question=service_module._json(outcome.question),
                    body=service_module._json(outcome.artifact), body_available=outcome.artifact is not None,
                    status="MEANING_AND_BODY_AVAILABLE" if outcome.artifact else "MEANING_ADOPTED_BODY_UNAVAILABLE")
        except SemanticNotAdopted as exc:
            row.update(status="SEMANTIC_NOT_ADOPTED", decision=exc.decision, reason_code=exc.reason_code)
        except (ValueError, TypeError, KeyError, AttributeError, IndexError, UnicodeError) as exc:
            row.update(status="CONSUMER_REJECTED", reason_code="consumer_" + type(exc).__name__)
        result["cases"].append(row)
    require(sha(args.raw_file) == raw_hash, "source_raw_changed_during_consumption")
    result.update(meaning_count=sum(row["meaning_adopted"] for row in result["cases"]),
        body_count=sum(row["body_available"] for row in result["cases"]),
        source_raw_unchanged=True, seconds=time.monotonic() - started)
    write_json(args.output, result)
    print(json.dumps({key: result[key] for key in ("scope", "meaning_count", "body_count", "seconds")}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw-file", type=Path, required=True)
    parser.add_argument("--expected-adapter-sha256", required=True)
    parser.add_argument("--expected-raw-sha256")
    parser.add_argument("--pack", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--api-root", type=Path, required=True)
    parser.add_argument("--legacy-pack", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    main(parser.parse_args())
