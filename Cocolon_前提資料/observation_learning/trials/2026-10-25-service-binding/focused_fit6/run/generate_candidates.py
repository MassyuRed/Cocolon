#!/usr/bin/env python3
"""CPU-only source binding of the existing fictional chair teacher pair.

Three real isolated service threads produce six training CANDIDATES, not six
independent language examples. No model, optimizer, GPU, network client or
production DB is used. Existing teachers/evaluation/weights remain untouched.
"""
import argparse
import asyncio
from dataclasses import replace
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import sys
import time
from types import SimpleNamespace
from unittest.mock import patch
from uuid import uuid4

sys.dont_write_bytecode = True
API_COMMIT = "95d00b907f6d9c42944666269acc457c9af34f37"
MEMO = "全部一人で直せたことが、うれしかった。"
ACTION = "ぐらついていた椅子を修理して、また座れるようになった。"
SCOPE = ("CPU-generated training candidates for one existing fictional chair story, "
         "initial/correction stages under three isolated service identities. "
         "Not model outputs, independent language examples, held-out evaluation, "
         "training execution, production DB/application or product acceptance.")


def require(condition, code):
    if not condition:
        raise ValueError(code)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def sha_value(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def dump(path, value):
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def dump_jsonl(path, rows):
    with path.open("x", encoding="utf-8") as stream:
        for row in rows:
            stream.write(canonical(row) + "\n")


def semantic_fingerprint(packet):
    """Compare unchanged teacher meaning/text; strip only binding identities."""
    def visit(value):
        if isinstance(value, dict):
            return {key: ("$SOURCE" if key in {"source_id", "anchor_source_id"} else
                          "$PRIOR" if key == "prior_snapshot_ref" else visit(item))
                    for key, item in value.items()}
        if isinstance(value, list):
            return [visit(item) for item in value]
        return value
    return sha_value(visit(packet))


def validate_target(request, packet, prepare_emlis):
    require(set(packet) == {"candidate", "evidence"}, "teacher_top_level_shape")
    candidate = packet["candidate"]
    require(set(candidate) == {"schema_version", "core", "claims", "relations", "unknowns", "conflicts", "updates",
                                "surface_proposal", "question_proposal"}, "teacher_candidate_shape")
    material = prepare_emlis(request).payload()
    fields = {source["source_id"]: source["text_fields"] for source in material["sources"]}
    for evidence in packet["evidence"]:
        text = fields[evidence["source_id"]][evidence["field_path"]]
        require(type(evidence["start"]) is int and type(evidence["end"]) is int
                and 0 <= evidence["start"] < evidence["end"] <= len(text)
                and text[evidence["start"]:evidence["end"]] == evidence["quote"], "teacher_evidence_mismatch")
    claim_ids = {claim["claim_id"] for claim in candidate["claims"]}
    relation_ids = {relation["relation_id"] for relation in candidate["relations"]}
    for binding in candidate["surface_proposal"]["bindings"]:
        require(all(type(ref) is str and ref in claim_ids for ref in binding["claim_refs"]), "teacher_claim_refs")
        require(all(type(ref) is str and ref in relation_ids for ref in binding["relation_refs"]), "teacher_relation_refs")
    corrected = bool(request.emlis_thread.answers)
    require(len(candidate["claims"]) == (6 if corrected else 4)
            and len(candidate["updates"]) == (3 if corrected else 0)
            and len(candidate["unknowns"]) == (0 if corrected else 1), "teacher_stage_counts")
    require((candidate["question_proposal"] is None) == corrected, "teacher_question_budget")
    # Serialize/strict-load without repair. Newlines inside answer source stay data.
    require(json.loads(canonical(packet)) == packet, "teacher_json_roundtrip")
    return {"top_level_candidate_evidence": True, "all_evidence_exact": True,
            "string_claim_relation_refs": True, "claim_count": len(claim_ids),
            "update_count": len(candidate["updates"]), "meaning_and_text_fingerprint": semantic_fingerprint(packet)}


def native_case(request, prior, serialize):
    control = request.emlis_thread
    return {"original": dict(request.current_input_bundle.raw_current_input), "request_id": request.request_id,
            "thread_id": control.thread_id, "capability_snapshot": control.capability_snapshot,
            "question_control": serialize(control.question_control_context), "answers": serialize(control.answers),
            "current_round": control.current_round, "prior_snapshot_json": prior}


def postcheck_existing(output, legacy):
    """No new teacher/service execution: compare frozen rows and measured lengths."""
    rows = [json.loads(line) for line in (output / "sft_examples.jsonl").read_text().splitlines() if line]
    old = [json.loads(line) for line in (legacy / "sft_examples.jsonl").read_text().splitlines() if line]
    fingerprints = {"CORRECTION" if row["native_case"]["answers"] else "INITIAL":
                    semantic_fingerprint(json.loads(row["messages"][-1]["content"])) for row in old}
    require(set(fingerprints) == {"INITIAL", "CORRECTION"}, "legacy_teacher_stages_invalid")
    for row in rows:
        require(semantic_fingerprint(json.loads(row["messages"][-1]["content"])) == fingerprints[row["stage"]],
                "bound_target_changed_legacy_meaning_or_text")
    token_report = json.loads((output / "cpu_tokenization_results.json").read_text())
    token_rows = token_report["rows"]
    require(len(rows) == len(token_rows) == 6, "postcheck_six_targets_required")
    legacy_exceeded = [row["id"] for row in token_rows if row["assistant_including_eos_tokens"] > 2048]
    proposed_fits = all(row["assistant_including_eos_tokens"] <= 2560 and row["prompt_tokens"] <= 5632
                        and row["prompt_tokens"] + 2560 <= 8192 and row["full_training_tokens"] <= 8192
                        for row in token_rows)
    post = {"schema": "cocolon.emlis_service_binding_postcheck.v1", "new_service_or_teacher_generations": 0,
        "old_teacher_semantic_and_text_fingerprints": fingerprints,
        "old_teacher_semantic_and_text_match_count": 6,
        "observed_legacy_generation_budget": 2048, "observed_legacy2048_exceeded": legacy_exceeded,
        "legacy2048_all_completions_fit": not legacy_exceeded,
        "proposed_generation_budget": 2560, "proposed_max_prompt_tokens": 5632,
        "proposed2560_fits": proposed_fits, "context_limit": 8192,
        "targets_truncated_or_shortened": False, "training_performed": False,
        "actual_inference_budget_changed_by_this_cpu_check": False,
        "note": "Original measured generation_budget=2048 rows remain unchanged; 2560 is a separate plan feasibility check."}
    require(proposed_fits, "proposed2560_still_cannot_fit_full_targets")
    token_report["post_check"] = post
    dump(output / "cpu_tokenization_results.json", token_report)
    report = json.loads((output / "cpu_connection_results.json").read_text())
    report["post_check"] = post
    report["post_check_generator_sha256"] = sha_file(Path(__file__))
    dump(output / "cpu_connection_results.json", report)
    manifest = json.loads((output / "dataset_manifest.json").read_text())
    manifest.update(post_check=post, observed_legacy2048_exceeded=legacy_exceeded,
                    proposed2560_fits=proposed_fits)
    for name in manifest["files"]:
        manifest["files"][name] = {"sha256": sha_file(output / name), "bytes": (output / name).stat().st_size}
    dump(output / "dataset_manifest.json", manifest)
    print("POSTCHECK_ONLY", len(legacy_exceeded), "legacy_oversize", "proposed2560_fits", proposed_fits)


async def generate(args, output, report, token_counter):
    import emlis_thread_service as sm
    import emlis_thread_store as store_module
    from emlis_thread_service import EmlisThreadService
    from test_emlis_q2_application import Database
    from test_cmee_emlis_model_proposal import natural_packet, CORRECTION
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.emlis_semantic_admission import MODEL_PROFILE, SemanticInput
    from cocolon_meaning_experience_engine.model_candidate_source import (
        ModelCandidateSource, ModelCallLimits, ModelResponse, MODEL, REVISION, build_model_messages)
    from cocolon_meaning_experience_engine.preparation import prepare_emlis
    from verify_cmee import reconstruct_request

    rows, pairs, stage_fingerprints = [], [], {}
    db = Database()
    def query(sql, params=()):
        result = db.query(sql, params)
        require("code" not in result, "isolated_fixture_sql_failed")
        return result

    async def rpc(name, payload, **kwargs):
        require(name in {"emlis_thread_read", "emlis_thread_commit"}, "unexpected_rpc")
        report["isolated_rpc_calls"] += 1
        return await db.rpc(name, payload, **kwargs)

    class NoGeneration:
        def __getattr__(self, _name):
            raise AssertionError("completed_read_requested_generation")

    def forbidden(*_args, **_kwargs):
        raise AssertionError("completed_read_requested_candidate")

    try:
        with patch.object(store_module, "sb_post_rpc", rpc):
            for index, age_days in enumerate((0, 1, 7), 1):
                pair_id = f"TRAIN-SERVICE-CHAIR-{index:02d}"
                user, parent = str(uuid4()), str(uuid4())
                created_at = (datetime.now(timezone.utc) - timedelta(days=age_days)).isoformat()
                query("insert into auth.users values ($1)", [user])
                query("insert into public.profiles values ($1,'free')", [user])
                query("insert into public.emotions values ($1,$2,$3,$4,$5,array['生活'],array['喜び'],$6)",
                    [parent, user, created_at, MEMO, ACTION,
                     json.dumps([{"type": "喜び", "strength": "medium"}], ensure_ascii=False)])
                pair_rows, pending = [], {}

                async def synthetic_generator(messages, limits):
                    require(messages == pending["messages"], "source_rebuilt_different_messages")
                    require([m["role"] for m in messages] == ["system", "user"], "inference_messages_contain_teacher")
                    report["synthetic_generator_calls"] += 1
                    return ModelResponse(pending["raw"], "stop", "synthetic_existing_chair_teacher_not_model",
                                         MODEL, REVISION, usage=None)

                boundary = ModelCandidateSource(synthetic_generator, token_counter,
                    limits=ModelCallLimits(6144, 2048, 150))

                async def source(request, prior_snapshot_json):
                    stage = "CORRECTION" if request.emlis_thread.answers else "INITIAL"
                    prior = (SimpleNamespace(checkpoint=SimpleNamespace(
                        snapshot_ref=json.loads(prior_snapshot_json)["snapshot_ref"])) if prior_snapshot_json else None)
                    # Existing reviewed hand-authored helper; never read failed/successful model raw as gold.
                    target = natural_packet(request, prior)
                    checks = validate_target(request, target, prepare_emlis)
                    fingerprint = checks["meaning_and_text_fingerprint"]
                    if report.get("old_teacher_semantic_fingerprints"):
                        require(fingerprint == report["old_teacher_semantic_fingerprints"][stage],
                                "teacher_changed_legacy_meaning_or_text")
                    if stage in stage_fingerprints:
                        require(stage_fingerprints[stage] == fingerprint, "teacher_meaning_or_text_changed_between_identities")
                    stage_fingerprints[stage] = fingerprint
                    messages = build_model_messages(request, prior_snapshot_json)
                    pending.update(raw=canonical(target), messages=messages)
                    receipt = await boundary(request, prior_snapshot_json)
                    require(receipt.status == "CANDIDATE_UNREVIEWED", "synthetic_teacher_receipt_invalid")
                    engine = MeaningExperienceEngine()
                    checkpoint = engine.prepare_emlis_update(request, semantic_input=SemanticInput(
                        "FRESH_CANDIDATE", receipt, prior_snapshot_json=prior_snapshot_json, semantic_profile=MODEL_PROFILE))
                    resumed_request = replace(request, emlis_thread=replace(request.emlis_thread,
                        prepared_meaning_checkpoint_ref=checkpoint.checkpoint_id))
                    outcome = engine.generate(resumed_request, semantic_input=SemanticInput(
                        "RESUME_ADOPTED", snapshot_json=checkpoint.semantic_snapshot, semantic_profile=MODEL_PROFILE))
                    require(outcome.artifact is not None, "teacher_body_not_validated_by_existing_reader")
                    if stage == "INITIAL":
                        require(outcome.question is not None and outcome.question_decision.disposition == "ASK",
                                "teacher_initial_actual_question_missing")
                    else:
                        require(outcome.question is None and outcome.question_decision.disposition == "END"
                                and len(checkpoint.answer_update.updates) == 3, "teacher_correction_not_three_updates_end")
                    case = native_case(request, prior_snapshot_json, sm._json)
                    rebuilt, rebuilt_prior = reconstruct_request({"native_case": case})
                    require(build_model_messages(rebuilt, rebuilt_prior) == messages, "saved_native_case_cannot_rebuild_messages")
                    row = {"id": pair_id + "-" + stage, "pair_id": pair_id,
                           "family": "CHAIR_REPAIR_REUSE_ONE_EXISTING_STORY", "stage": stage,
                           "split": "train_candidate", "scenario_persons_fictitious": True,
                           "provenance": "existing_hand_authored_natural_packet_rebound_by_actual_service_request",
                           "source_refs": ["ai/tests/test_cmee_emlis_model_meaning.py:model_packet",
                                           "ai/tests/test_cmee_emlis_model_proposal.py:natural_packet"],
                           "messages": [*messages, {"role": "assistant", "content": canonical(target)}],
                           "native_case": case, "target_checks": checks,
                           "target_sha256": hashlib.sha256(canonical(target).encode()).hexdigest(),
                           "expected_snapshot_ref": checkpoint.snapshot_ref,
                           "expected_checkpoint_id": checkpoint.checkpoint_id,
                           "expected_question": sm._json(outcome.question),
                           "expected_body": sm._json(outcome.artifact)}
                    pair_rows.append(row)
                    report["cases"].append({"id": row["id"], "checks": checks,
                        "receipt_status": receipt.status, "engine_status": sm._json(outcome.status),
                        "body_state": outcome.body_state, "question_disposition": outcome.question_decision.disposition,
                        "snapshot_ref": checkpoint.snapshot_ref, "checkpoint_id": checkpoint.checkpoint_id,
                        "body": sm._json(outcome.artifact), "real_model_called": False})
                    dump(output / "cpu_connection_results.json", report)
                    return receipt

                service = EmlisThreadService(semantic_profile=MODEL_PROFILE, offline_candidate_source=source,
                                            offline_model_attempt_seconds=180)
                first = await service.start(user, parent)
                require(first["state"] == "AWAITING_ANSWER" and first["current_observation"], "service_initial_failed")
                first_saved = await service.store.read(user, input_id=parent)
                first_meaning = next(e for e in first_saved["events"]
                    if e["id"] == first_saved["thread"]["current_meaning_event_id"])
                reader = EmlisThreadService(engine=NoGeneration())
                require(await reader.get(user, parent) == {**first, "can_write": False}
                        and await reader.start(user, parent) == {**first, "can_write": False}, "initial_saved_read_changed")
                answer_kwargs = {"question_id": first["pending_question"]["question_id"],
                    "expected_revision": first["revision"], "idempotency_key": pair_id + "-answer",
                    "answer_text": CORRECTION, "authored_at": datetime.now(timezone.utc).isoformat()}
                final = await service.answer(user, first["thread_id"], **answer_kwargs)
                require(final["body_state"] == "REFINED" and final["pending_question"] is None
                        and final["meaning_updated"] and final["answer_saved"], "service_correction_failed")
                after = await service.store.read(user, input_id=parent)
                second_meaning = next(e for e in after["events"] if e["id"] == after["thread"]["current_meaning_event_id"])
                require(json.loads(second_meaning["payload"]["semantic_snapshot"])["prior_snapshot"]
                        == json.loads(first_meaning["payload"]["semantic_snapshot"]), "actual_prior_not_used")
                require(pair_rows[1]["native_case"]["question_control"]["pending_question"]["question_id"]
                        == first["pending_question"]["question_id"], "actual_pending_not_used")
                require(await reader.get(user, parent) == {**final, "can_write": False}
                        and await reader.start(user, parent) == {**final, "can_write": False}, "final_saved_read_changed")
                never = EmlisThreadService(engine=NoGeneration(), semantic_profile=MODEL_PROFILE,
                    offline_candidate_source=forbidden, offline_model_attempt_seconds=180)
                replay = await never.answer(user, first["thread_id"], **answer_kwargs)
                answer_event = next(e for e in after["events"] if e["kind"] == "ANSWER")
                require(replay == {**final, "requested_attempt_id": answer_event["attempt_id"]}, "same_key_replay_changed")
                read_after = await service.store.read(user, input_id=parent)
                require(read_after["thread"] == after["thread"] and read_after["events"] == after["events"],
                        "saved_reads_modified_sql_state")
                require(len(pair_rows) == 2, "pair_target_count_changed")
                for row in pair_rows:
                    event = first_meaning if row["stage"] == "INITIAL" else second_meaning
                    require(event["payload"]["checkpoint_id"] == row["expected_checkpoint_id"], "service_engine_meaning_mismatch")
                rows.extend(pair_rows)
                pairs.append({"pair_id": pair_id, "user_id": user, "input_id": parent,
                    "thread_id": first["thread_id"], "created_at": created_at,
                    "initial_question_id": first["pending_question"]["question_id"],
                    "answer_id": answer_event["id"], "actual_initial_snapshot_used": True,
                    "initial_and_final_non_generating_reads": True, "same_key_replay_no_generation": True,
                    "event_counts": {kind: sum(e["kind"] == kind for e in after["events"])
                                     for kind in ("MEANING_UPDATE", "QUESTION", "ANSWER", "OBSERVATION")},
                    "initial_dto": first, "final_dto": final,
                    "initial_snapshot_sha256": sha_value(first_saved), "final_snapshot_sha256": sha_value(after)})
                report["pairs"] = pairs
                dump(output / "cpu_connection_results.json", report)
                print("PAIR_CPU_VERIFIED", pair_id, flush=True)
    finally:
        db.proc.stdin.close()
        db.proc.wait(timeout=10)
    return rows, pairs


def main(args):
    started = time.monotonic()
    api, legacy, output = args.api_root.resolve(), args.legacy_pack.resolve(), Path(__file__).resolve().parent
    require(args.api_commit == API_COMMIT, "unexpected_api_commit")
    if args.postcheck_existing:
        postcheck_existing(output, legacy)
        return
    require(os.environ.get("Q2_PGLITE_MODULE"), "isolated_pglite_module_required")
    require(not (output / "sft_examples.jsonl").exists(), "generated_training_candidates_already_frozen")
    sys.path[:0] = [str(api / "ai/services/ai_inference"), str(api / "ai/tests"), str(legacy)]
    from test_cmee_emlis_model_proposal import CORRECTION
    old_files = [legacy / name for name in ("sft_examples.jsonl", "train_messages.jsonl", "eval_inputs.jsonl", "dataset_manifest.json")]
    old_hashes = {p.name: sha_file(p) for p in old_files}
    api_files = ["ai/services/ai_inference/emlis_thread_service.py",
        "ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py",
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py",
        "ai/tests/test_cmee_emlis_model_meaning.py", "ai/tests/test_cmee_emlis_model_proposal.py",
        "ai/tests/test_emlis_q2_application.py", "ai/tests/helpers/emlis_q2_postgres.cjs",
        "supabase/migrations/20260911020509_emlis_input_threads_q2.sql"]
    api_hashes = {name: sha_file(api / name) for name in api_files}
    old_rows = [json.loads(line) for line in (legacy / "sft_examples.jsonl").read_text().splitlines() if line]
    old_teacher_fingerprints = {"CORRECTION" if row["native_case"]["answers"] else "INITIAL":
        semantic_fingerprint(json.loads(row["messages"][-1]["content"])) for row in old_rows}
    report = {"schema": "cocolon.emlis_service_binding_cpu_candidates.v1", "scope": SCOPE,
        "status": "STARTED", "api_commit": API_COMMIT,
        "api_commit_check": "materialized_source_hashes_recorded_remote_identity_owned_by_root",
        "identity_pair_count": 3, "unique_language_story_count": 1, "unique_stage_count": 2,
        "target_count": 6, "synthetic_generator_calls": 0, "real_model_calls": 0,
        "isolated_rpc_calls": 0, "production_database_operations": 0, "training_updates": 0,
        "product_credit": 0, "product_accepted": False, "automatic_progression": False,
        "old_dataset_hashes_before": old_hashes, "api_source_hashes_before": api_hashes,
        "old_teacher_semantic_fingerprints": old_teacher_fingerprints,
        "generator_sha256": sha_file(Path(__file__)), "cases": [], "pairs": [],
        "tokenization_verified": False, "token_counter_is_stub": True}
    if args.tokenizer_python_path:
        sys.path.insert(0, str(args.tokenizer_python_path.resolve()))
        from transformers import AutoTokenizer
        from run_pilot import MODEL, REVISION, chat_token_ids, encode_training
        tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
        token_counter = lambda messages: len(chat_token_ids(tokenizer, messages, generation_prompt=True))
        report.update(tokenization_verified=True, token_counter_is_stub=False,
            tokenizer_model=MODEL, tokenizer_revision=REVISION,
            transformers_version=importlib.metadata.version("transformers"),
            chat_template_sha256=hashlib.sha256(str(tokenizer.chat_template).encode()).hexdigest())
    else:
        # Explicit test double only for synthetic source orchestration. No
        # usage/token measurements are fabricated; real tokenizer check remains pending.
        require(args.allow_token_count_test_double, "pinned_tokenizer_or_explicit_test_double_required")
        token_counter = lambda _messages: 1
    dump(output / "cpu_connection_results.json", report)
    try:
        rows, pairs = asyncio.run(generate(args, output, report, token_counter))
        require(len(rows) == 6 and len(pairs) == 3, "six_targets_required")
        require(len({row["native_case"]["original"]["id"] for row in rows}) == 3, "training_identity_overlap")
        if report["tokenization_verified"]:
            token_rows = []
            for row in rows:
                encoded, prompt_count = encode_training(tokenizer, row["messages"], context=8192)
                require(prompt_count + 2048 <= 8192, "inference_generation_budget_exceeded")
                token_rows.append({"id": row["id"], "prompt_tokens": prompt_count,
                    "full_training_tokens": len(encoded["input_ids"]),
                    "assistant_including_eos_tokens": len(encoded["input_ids"]) - prompt_count,
                    "generation_budget": 2048, "context_limit": 8192, "truncation": False,
                    "eos_and_prefix_verified_by_existing_encode_training": True})
            dump(output / "cpu_tokenization_results.json", {
                "schema": "cocolon.emlis_service_binding_tokenization.v1", "rows": token_rows,
                "model": MODEL, "revision": REVISION, "real_tokenizer": True,
                "weights_loaded": False, "gpu_used": False})
            report["training_tokenization_verified"] = True
        require({p.name: sha_file(p) for p in old_files} == old_hashes, "legacy_dataset_modified")
        require({name: sha_file(api / name) for name in api_files} == api_hashes, "api_source_modified")
        dump_jsonl(output / "sft_examples.jsonl", rows)
        dump_jsonl(output / "train_messages.jsonl", [{"id": row["id"], "pair_id": row["pair_id"],
            "messages": row["messages"], "split": "train_candidate"} for row in rows])
        dump(output / "training_identities.json", {"scope": "TRAIN_ONLY_CANDIDATE_IDENTITIES_NOT_EVAL",
            "pairs": [{k: pair[k] for k in ("pair_id", "user_id", "input_id", "thread_id", "answer_id", "created_at")}
                      for pair in pairs]})
        report.update(status="SIX_BOUND_TRAINING_CANDIDATES_CPU_VERIFIED_NOT_MODEL_OR_PRODUCT_SUCCESS",
                      old_datasets_unchanged=True, api_source_unchanged=True, seconds=time.monotonic() - started)
        dump(output / "cpu_connection_results.json", report)
        files = {name: {"sha256": sha_file(output / name), "bytes": (output / name).stat().st_size}
                 for name in ("generate_candidates.py", "sft_examples.jsonl", "train_messages.jsonl",
                              "training_identities.json", "cpu_connection_results.json")}
        if report["tokenization_verified"]:
            files["cpu_tokenization_results.json"] = {
                "sha256": sha_file(output / "cpu_tokenization_results.json"),
                "bytes": (output / "cpu_tokenization_results.json").stat().st_size}
        manifest = {"schema": "cocolon.emlis_service_binding_training_candidates.v1", "scope": SCOPE,
            "status": "CPU_VERIFIED_CANDIDATE_NOT_TRAINING_AUTHORIZATION", "api_commit": API_COMMIT,
            "semantic_profile": "emlis_model_proposal.v1", "training_rows": 6,
            "identity_pairs": 3, "unique_language_story_count": 1, "unique_stages": 2,
            "evaluation_rows": 0, "evaluation_owner": "root_separate_untrained_identity_pair",
            "source_texts": {"memo": MEMO, "memo_action": ACTION, "correction": CORRECTION},
            "tokenization_verified": report["tokenization_verified"],
            "token_counter_is_stub": report["token_counter_is_stub"], "files": files,
            "original_dataset_hashes": old_hashes, "api_source_hashes": api_hashes,
            "training_performed": False, "real_model_called": False, "product_accepted": False}
        dump(output / "dataset_manifest.json", manifest)
        if report["tokenization_verified"]:
            postcheck_existing(output, legacy)
        print(json.dumps({key: report[key] for key in ("status", "target_count", "synthetic_generator_calls", "isolated_rpc_calls", "seconds")}))
    except BaseException as exc:
        report.update(status="FAILED_NOT_TRAINING_READY", error_type=type(exc).__name__, seconds=time.monotonic() - started)
        if isinstance(exc, ValueError):
            report["error_code"] = str(exc)
        dump(output / "cpu_connection_results.json", report)
        raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-root", type=Path, required=True)
    parser.add_argument("--api-commit", required=True)
    parser.add_argument("--legacy-pack", type=Path, default=Path(__file__).resolve().parent.parent / "2026-10-24-emlis-4b-training")
    parser.add_argument("--tokenizer-python-path", type=Path)
    parser.add_argument("--allow-token-count-test-double", action="store_true")
    parser.add_argument("--postcheck-existing", action="store_true")
    main(parser.parse_args())
