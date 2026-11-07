#!/usr/bin/env python3
"""Reuse the fixed service roundtrip for one untrained identity, known chair.

The evaluation fixture contains no target/prior. Actual service thread/answer
IDs, the initial model's question and its adopted prior are used unchanged.
This script does not train or establish unseen-language/product quality.
"""
import argparse
import asyncio
import threading
import time
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import sys
from unittest.mock import patch
from uuid import UUID

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
API_COMMIT = "95d00b907f6d9c42944666269acc457c9af34f37"
BASE_RUNNER_SHA256 = "ea58009d635f44605177c37479cf2d1135620f21e5fa4d4acedfa04b36c44841"
OUTPUT = Path("/workspace/cocolon_4b_evidence_end_identity_holdout_20261025")
SCOPE = ("Fresh training-excluded identity02 after closed identity01, with already known fictional chair language. "
         "New real 4B max2 calls through existing offline service/isolated SQL; actual initial "
         "question/prior, interruption after meaning save, explicit resume and non-generating reads. "
         "Not unseen language, general quality, normal application/Auth/HTTP/RN/device or product acceptance.")
UUID_PATTERN = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
TIME_PATTERN = re.compile(r"\d{4}-\d{2}-\d{2}T[0-9:.]+(?:Z|[+-]\d{2}:\d{2})")


def require(condition, code):
    if not condition:
        raise ValueError(code)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def utcnow():
    return datetime.now(timezone.utc).isoformat()


def dump(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def normalized_time(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat(timespec="microseconds")


def identity_tokens(value):
    text = json.dumps(value, ensure_ascii=False, allow_nan=False)
    uuids = {str(UUID(x)) for x in UUID_PATTERN.findall(text)}
    times = {normalized_time(x) for x in TIME_PATTERN.findall(text)}
    return uuids, times


def load_base(path):
    require(sha(path) == BASE_RUNNER_SHA256, "base_service_runner_hash_changed")
    spec = importlib.util.spec_from_file_location("fixed_service_roundtrip_for_identity_eval", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def preflight(args, previous):
    training = args.training_pack.resolve()
    manifest_path = training / "dataset_manifest.json"
    fixture_path = args.fixture.resolve()
    require(sha(manifest_path) == args.expected_training_manifest_sha256, "training_manifest_not_frozen")
    manifest, fixture, plan = read(manifest_path), read(fixture_path), read(args.plan)
    require(manifest["schema"] == "cocolon.emlis_service_binding_training_candidates.v1", "training_manifest_schema_changed")
    files = manifest["files"]
    names = ("train_messages.jsonl", "sft_examples.jsonl", "training_identities.json")
    for name in names:
        require(name in files and sha(training / name) == files[name]["sha256"]
                and (training / name).stat().st_size == files[name]["bytes"], "training_file_hash_changed")
    train = [json.loads(x) for x in (training / names[0]).read_text(encoding="utf-8").splitlines() if x.strip()]
    examples = [json.loads(x) for x in (training / names[1]).read_text(encoding="utf-8").splitlines() if x.strip()]
    identities = read(training / names[2])
    require(len(train) == len(examples) == 6 and len(identities["pairs"]) == 3, "training_count_changed")
    require(len({row["id"] for row in train}) == 6, "duplicate_training_id")
    by_id = {row["id"]: row for row in examples}
    require(set(by_id) == {row["id"] for row in train}, "training_example_identity_mismatch")
    for row in train:
        require(row["messages"] == by_id[row["id"]]["messages"]
                and [x["role"] for x in row["messages"]] == ["system", "user", "assistant"], "training_messages_mismatch")
    for pair in identities["pairs"]:
        require({x["stage"] for x in examples if x["pair_id"] == pair["pair_id"]} == {"INITIAL", "CORRECTION"},
                "training_pair_not_two_stages")
    require(set(fixture) == {"evaluation_id", "scope", "identity", "input", "correction"}
            and set(fixture["identity"]) == {"user_id", "input_id", "created_at"}
            and set(fixture["input"]) == {"memo", "memo_action"}
            and set(fixture["correction"]) == {"answer_text"}, "eval_fixture_contains_target_or_prior")
    require(fixture["input"]["memo"] == previous.ORIGINAL_MEMO
            and fixture["input"]["memo_action"] == previous.ORIGINAL_ACTION
            and fixture["correction"]["answer_text"] == previous.CORRECTION, "known_chair_content_changed")
    train_uuids, train_times = identity_tokens([train, examples, identities])
    previous_eval = read(training / "eval_fixture.json")
    previous_eval_uuids, previous_eval_times = identity_tokens(previous_eval)
    require(fixture["evaluation_id"] != previous_eval["evaluation_id"], "old_eval_identity_reused")
    eval_uuids, eval_times = identity_tokens(fixture)
    require(not train_uuids.intersection(eval_uuids) and not train_times.intersection(eval_times), "train_eval_identity_overlap")
    require(not previous_eval_uuids.intersection(eval_uuids) and not previous_eval_times.intersection(eval_times),
            "previous_eval_identity_overlap")
    require(plan["evaluation_id"] == fixture["evaluation_id"] and plan["previous_closed_evaluation_id"] == previous_eval["evaluation_id"]
            and plan["api_commit"] == API_COMMIT
            and plan["max_model_calls"] == 2 and plan["process_max_seconds"] == 900
            and plan["offline_model_attempt_seconds"] == 180 and plan["source_wait_max_seconds"] == 150
            and plan["training_updates"] == 0 and plan["automatic_inference_retries"] == 0
            and plan["max_input_tokens"] == 5632 and plan["max_new_tokens"] == 2560
            and plan["context_tokens"] == 8192,
            "evaluation_plan_bounds_changed")
    require(plan["status"] == "READY_FOR_SINGLE_IDENTITY_EVALUATION"
            and plan["selected_adapter_sha256"] == args.expected_adapter_sha256
            and plan["training_manifest_sha256"] == args.expected_training_manifest_sha256
            and plan["eval_fixture_sha256"] == sha(fixture_path)
            and plan["base_runner_sha256"] == BASE_RUNNER_SHA256
            and plan["eval_runner_sha256"] == sha(__file__), "evaluation_plan_not_frozen")
    require(re.fullmatch(r"[0-9a-f]{64}", args.expected_adapter_sha256 or ""), "fixed_new_adapter_hash_required")
    require(args.api_commit == API_COMMIT and args.output.resolve() == OUTPUT and not OUTPUT.exists(),
            "evaluation_target_or_output_changed")
    return fixture, train_uuids, train_times, manifest_path


async def exercise_identity(args, report, model, tokenizer, r, db, *, previous, exercise, fixture,
                            train_uuids, train_times):
    import emlis_thread_service as service_module
    from cocolon_meaning_experience_engine.model_candidate_source import ModelCandidateSource
    report.update(schema="cocolon.cmee.known_chair_untrained_service_identity.v1", scope=SCOPE,
                  evaluation_id=fixture["evaluation_id"], held_out_service_identity_only=True,
                  unseen_language_content=False, training_identity_overlap=False, identity_call_checks=[],
                  context_tokens=8192, max_input_tokens=5632, max_new_tokens=2560)

    class FixtureDatabase:
        def query(self, statement, params):
            # Only the synthetic emotion fixture's creation time is fixed.
            # Thread/answer IDs and their clocks remain owned by real service/SQL.
            expected = "insert into public.emotions values ($1,$2,now() at time zone 'UTC',$3,$4,array['生活'],array['喜び'],$5)"
            if statement == expected:
                statement = statement.replace("now() at time zone 'UTC'", "$6::timestamptz at time zone 'UTC'")
                params = [*params, fixture["identity"]["created_at"]]
            return db.query(statement, params)

        def __getattr__(self, name):
            return getattr(db, name)

    original_call = ModelCandidateSource.__call__

    async def guarded_call(source, request, prior_snapshot_json=None):
        request_json = service_module._json(request)
        uuids, times = identity_tokens([request_json, prior_snapshot_json])
        require(not uuids.intersection(train_uuids) and not times.intersection(train_times),
                "runtime_identity_overlaps_training")
        original = request_json["current_input_bundle"]["raw_current_input"]
        require(original["id"] == fixture["identity"]["input_id"]
                and normalized_time(original["created_at"]) == normalized_time(fixture["identity"]["created_at"]),
                "runtime_eval_original_identity_changed")
        stage = "correction" if request.emlis_thread.answers else "initial"
        if stage == "initial":
            require(prior_snapshot_json is None, "initial_eval_received_prior")
        else:
            initial = read(args.output / "initial_snapshot.json")
            meaning = next(e for e in initial["events"] if e["id"] == initial["thread"]["current_meaning_event_id"])
            question = next(e for e in initial["events"] if e["kind"] == "QUESTION")
            require(prior_snapshot_json == meaning["payload"]["semantic_snapshot"], "eval_prior_not_actual_initial")
            require(request_json["emlis_thread"]["question_control_context"]["pending_question"] == question["payload"],
                    "eval_question_not_actual_initial")
            require(len(request.emlis_thread.answers) == 1 and
                    request.emlis_thread.answers[0].answer_text_private == fixture["correction"]["answer_text"],
                    "eval_correction_text_changed")
        report["identity_call_checks"].append({"stage": stage, "uuid_count": len(uuids), "timestamp_count": len(times),
                                               "overlap": False, "actual_prior_used": stage == "correction"})
        return await original_call(source, request, prior_snapshot_json)

    with patch.object(ModelCandidateSource, "__call__", guarded_call):
        await exercise(args, report, model, tokenizer, r, FixtureDatabase())



async def exercise_core(args, report, model, tokenizer, r, db):
    import emlis_thread_service as service_module
    import emlis_thread_store as store_module
    from emlis_thread_service import EmlisThreadService
    from cocolon_meaning_experience_engine.emlis_semantic_admission import MODEL_PROFILE
    from cocolon_meaning_experience_engine.model_candidate_source import (
        ModelCandidateSource, ModelCallLimits, ModelResponse)

    output = args.output.resolve()
    user_id, input_id = args.evaluation_fixture["identity"]["user_id"], args.evaluation_fixture["identity"]["input_id"]
    report.update(fictional_user_id=user_id, fictional_input_id=input_id)

    def sql(statement, params):
        result = db.query(statement, params)
        require("code" not in result, "isolated_fixture_sql_failed")
        return result

    sql("insert into auth.users values ($1)", [user_id])
    sql("insert into public.profiles values ($1,'free')", [user_id])
    sql("insert into public.emotions values ($1,$2,now() at time zone 'UTC',$3,$4,array['生活'],array['喜び'],$5)",
        [input_id, user_id, args.evaluation_fixture["input"]["memo"], args.evaluation_fixture["input"]["memo_action"],
         json.dumps([{"type": "喜び", "strength": "medium"}], ensure_ascii=False)])

    async def rpc(name, payload, **kwargs):
        require(name in {"emlis_thread_read", "emlis_thread_commit"}, "unexpected_rpc")
        report["isolated_rpc_calls"] += 1
        return await db.rpc(name, payload, **kwargs)

    def checkpoint():
        dump(output / "run.json", report)

    async def generator(messages, limits):
        call = report["model_calls_started"] + 1
        require(call <= 2, "two_model_call_limit_exceeded")
        require([row["role"] for row in messages] == ["system", "user"], "assistant_teacher_or_bad_messages")
        require(limits.max_input_tokens == 5632 and limits.max_new_tokens == 2560,
                "model_limits_changed")
        stage = "initial" if call == 1 else "correction"
        path = output / (stage + "_raw.jsonl")
        require(not path.exists(), "raw_output_already_exists")
        dump(output / (stage + "_messages.json"), messages)
        report["model_calls_started"] = call
        report["active_model_stage"] = stage
        checkpoint()
        print("MODEL_CALL_STARTED", stage, flush=True)
        from transformers import StoppingCriteria, StoppingCriteriaList
        stop_event = threading.Event()
        call_deadline = time.monotonic() + limits.deadline_seconds
        original_generate = model.generate

        class BoundedGeneration(StoppingCriteria):
            def __call__(self, _input_ids, _scores, **_kwargs):
                return stop_event.is_set() or time.monotonic() >= call_deadline

        def bounded_generate(*call_args, **call_kwargs):
            existing = list(call_kwargs.get("stopping_criteria") or [])
            call_kwargs["stopping_criteria"] = StoppingCriteriaList([*existing, BoundedGeneration()])
            return original_generate(*call_args, **call_kwargs)

        def evaluate_once():
            # This wrapper stops only this generation's token loop. Sampling,
            # token budget, model precision and the source runner stay unchanged.
            with patch.object(model, "generate", bounded_generate):
                r.evaluate(model, tokenizer,
                    [{"case_id": "SERVICE-CHAIR-" + stage.upper(), "messages": messages,
                      "scope": "KNOWN_CHAIR_UNTRAINED_SERVICE_IDENTITY_ONLY"}], path,
                    {"context_tokens": 8192, "max_new_tokens": 2560}, adapter_revision=args.expected_adapter_sha256)

        worker = asyncio.create_task(asyncio.to_thread(evaluate_once))
        try:
            await asyncio.shield(worker)
        except asyncio.CancelledError:
            stop_event.set()
            report["model_generator_cancelled"] = True
            report["cancelled_worker_joined"] = False
            try:
                await asyncio.wait_for(asyncio.shield(worker), timeout=15)
                report["cancelled_worker_joined"] = True
                report["cancelled_partial_raw_present"] = path.is_file()
            except Exception as exc:
                report["cancelled_worker_error_type"] = type(exc).__name__
            checkpoint()
            raise
        finally:
            stop_event.set()
        rows = r.read_jsonl(path)
        require(len(rows) == 1, "model_raw_cardinality_changed")
        row = rows[0]
        require(row["model"] == r.MODEL and row["revision"] == r.REVISION
                and row["adapter_revision"] == args.expected_adapter_sha256, "actual_model_identity_changed")
        report["model_calls_completed"] += 1
        report["active_model_stage"] = None
        report["model_calls"].append({key: row[key] for key in (
            "case_id", "input_tokens", "output_tokens", "seconds", "finish_reason", "eos_reached", "raw_utf8_sha256")})
        checkpoint()
        print("MODEL_CALL_COMPLETED", stage, row["finish_reason"], flush=True)
        return ModelResponse(raw_output=row["raw_text"], finish_reason=row["finish_reason"],
            provider=row["provider"], model=row["model"], revision=row["revision"],
            adapter_revision=row["adapter_revision"], usage=row["usage"])

    adapter_source = ModelCandidateSource(generator,
        lambda messages: len(r.chat_token_ids(tokenizer, messages, generation_prompt=True)),
        limits=ModelCallLimits(5632, 2560, 150), adapter_revision=args.expected_adapter_sha256)

    async def source(request, prior_snapshot_json):
        report["candidate_source_calls"] += 1
        require(report["candidate_source_calls"] <= 2, "candidate_acquisition_limit_exceeded")
        stage = "initial" if report["candidate_source_calls"] == 1 else "correction"
        dump(output / (stage + "_request.json"), service_module._json(request))
        dump(output / (stage + "_prior.json"), prior_snapshot_json)
        receipt = await adapter_source(request, prior_snapshot_json)
        dump(output / (stage + "_receipt.json"), service_module._json(receipt))
        report["receipts_returned"] += 1
        checkpoint()
        return receipt

    def forbidden_source(*_args, **_kwargs):
        report["forbidden_candidate_calls"] += 1
        raise AssertionError("completed_read_or_retry_requested_new_candidate")

    class NoGeneration:
        def __getattr__(self, _name):
            report["forbidden_generation_calls"] += 1
            raise AssertionError("completed_read_attempted_generation")

    async def snapshot(service, name):
        value = await service.store.read(user_id, input_id=input_id)
        dump(output / (name + "_snapshot.json"), value)
        return value

    async def non_generating_reads(service, dto, stage, *, replay=None):
        before = await snapshot(service, stage + "_before_reads")
        readonly = EmlisThreadService(engine=NoGeneration())
        expected = {**dto, "can_write": False}
        got = await readonly.get(user_id, input_id)
        started = await readonly.start(user_id, input_id)
        require(got == expected and started == expected, "completed_read_dto_changed")
        values = {"get": got, "start": started}
        if replay is not None:
            writable = EmlisThreadService(engine=NoGeneration(), semantic_profile=MODEL_PROFILE,
                offline_candidate_source=forbidden_source, offline_model_attempt_seconds=180)
            resent = await writable.answer(user_id, dto["thread_id"], **replay)
            answered_event = next(e for e in before["events"]
                if e.get("idempotency_key") == replay["idempotency_key"])
            require(resent == {**dto, "requested_attempt_id": answered_event["attempt_id"]},
                    "same_key_answer_replay_dto_changed")
            values["same_key_answer"] = resent
        after = await snapshot(service, stage + "_after_reads")
        # The read RPC returns a fresh clock; compare the persisted thread and events.
        require(before["thread"] == after["thread"] and before["events"] == after["events"],
                "completed_reads_changed_persisted_state")
        dump(output / (stage + "_non_generating_reads.json"), values)
        report[stage + "_non_generating_reads"] = True
        checkpoint()

    with patch.object(store_module, "sb_post_rpc", rpc):
        service = EmlisThreadService(semantic_profile=MODEL_PROFILE, offline_candidate_source=source,
                                    offline_model_attempt_seconds=180)
        initial = await service.start(user_id, input_id)
        dump(output / "initial_dto.json", initial)
        first_snapshot = await snapshot(service, "initial")
        report["isolated_sql_persistence_tested"] = True
        report["initial_actual_state"] = initial["state"]
        report["initial_actual_body_state"] = initial["body_state"]
        checkpoint()
        # Actual END/unavailable is an outcome, never replaced by the training question.
        if not initial.get("pending_question") or initial["state"] != "AWAITING_ANSWER":
            report["status"] = "ACTUAL_INITIAL_NOT_ASK_NO_CORRECTION_OR_RETRY"
            return
        require(initial["current_observation"] is not None and initial["issued_count"] == 1,
                "initial_ask_without_saved_body")
        require(report["model_calls_completed"] == 1, "initial_model_call_count_changed")
        await non_generating_reads(service, initial, "initial")
        initial_meaning = next(e for e in first_snapshot["events"]
            if e["id"] == first_snapshot["thread"]["current_meaning_event_id"])
        actual_initial_snapshot = initial_meaning["payload"]["semantic_snapshot"]
        dump(output / "actual_initial_semantic_snapshot.json", json.loads(actual_initial_snapshot))

        answer_args = {"question_id": initial["pending_question"]["question_id"],
            "expected_revision": initial["revision"], "idempotency_key": "known-chair-correction-1",
            "answer_text": args.evaluation_fixture["correction"]["answer_text"], "authored_at": utcnow()}
        dump(output / "correction_answer_args.json", answer_args)
        actual_generate = service.engine.generate
        interrupted = {"count": 0}

        def interrupt_after_meaning(*_args, **_kwargs):
            interrupted["count"] += 1
            require(interrupted["count"] == 1, "interruption_injected_more_than_once")
            raise asyncio.CancelledError()

        with patch.object(service.engine, "generate", interrupt_after_meaning):
            try:
                unexpected = await service.answer(user_id, initial["thread_id"], **answer_args)
            except asyncio.CancelledError:
                report["meaning_after_save_interruption_observed"] = True
            else:
                # A real second candidate rejection never reaches the author.
                dump(output / "correction_actual_not_interrupted_dto.json", unexpected)
                await snapshot(service, "correction_actual_not_interrupted")
                report["status"] = "ACTUAL_CORRECTION_DID_NOT_REACH_AUTHOR_NO_RESUME"
                checkpoint()
                return
        failed = await service.get(user_id, input_id)
        dump(output / "interrupted_dto.json", failed)
        before_resume = await snapshot(service, "interrupted")
        require(interrupted["count"] == 1 and failed["can_retry"] and failed["meaning_updated"]
                and failed["current_observation"] is None, "saved_meaning_interruption_state_invalid")
        require(report["model_calls_started"] == report["model_calls_completed"] == 2,
                "interruption_model_calls_changed")
        corrected_meaning = next(e for e in before_resume["events"]
            if e["id"] == before_resume["thread"]["current_meaning_event_id"])
        corrected_snapshot = json.loads(corrected_meaning["payload"]["semantic_snapshot"])
        require(corrected_snapshot["prior_snapshot"] == json.loads(actual_initial_snapshot),
                "service_did_not_use_actual_initial_snapshot")
        require(len(corrected_meaning["payload"]["answer_update"]["updates"]) == 3,
                "correction_update_count_changed")
        require(service.engine.generate == actual_generate, "body_author_not_restored")
        report["actual_initial_snapshot_used"] = True
        report["explicit_retry_count"] = 1
        calls_before = (report["candidate_source_calls"], report["receipts_returned"], report["model_calls_started"])
        with patch.object(service, "offline_candidate_source", forbidden_source):
            final = await service.action(user_id, failed["thread_id"], action="retry_response",
                expected_revision=failed["revision"], idempotency_key="known-chair-response-resume-1",
                operation_id=failed["operation_id"])
        dump(output / "final_dto.json", final)
        after_resume = await snapshot(service, "final")
        require((report["candidate_source_calls"], report["receipts_returned"], report["model_calls_started"]) == calls_before,
                "explicit_retry_reacquired_candidate_or_model")
        require(final["body_state"] == "REFINED" and final["meaning_updated"] and final["answer_saved"]
                and final["pending_question"] is None and final["issued_count"] == 1,
                "actual_final_body_not_refined_and_ended")
        require(final["current_observation"] is not None, "actual_final_body_unavailable")
        require(before_resume["thread"]["current_meaning_event_id"] == after_resume["thread"]["current_meaning_event_id"],
                "explicit_retry_changed_meaning_event")
        for kind, expected_count in (("ANSWER", 1), ("MEANING_UPDATE", 2), ("QUESTION", 1), ("OBSERVATION", 2)):
            require(sum(e["kind"] == kind for e in after_resume["events"]) == expected_count,
                    "unexpected_saved_event_count_" + kind)
        received = [e for e in after_resume["events"] if e["kind"] == "OPERATION"
                    and e["payload"].get("stage") == "SEMANTIC_CANDIDATE_RECEIVED"]
        require(len(received) == 2, "saved_receipt_count_changed")
        await non_generating_reads(service, final, "final", replay=answer_args)
        require(report["forbidden_candidate_calls"] == report["forbidden_generation_calls"] == 0,
                "forbidden_generation_attempt_observed")
        report.update(status="KNOWN_REAL_MODEL_OFFLINE_SERVICE_SQL_ROUNDTRIP_COMPLETE_NOT_PRODUCT_ACCEPTED",
            service_saved_roundtrip=True, isolated_sql_persistence_tested=True,
            correction_updates=3, initial_and_final_saved_body_count=2,
            initial_ask=True, final_end=True, source_reacquisitions_during_explicit_retry=0,
            final_meaning_event_id=after_resume["thread"]["current_meaning_event_id"])
        checkpoint()



def main(args):
    previous = load_base(args.base_runner.resolve())
    fixture, train_uuids, train_times, manifest_path = preflight(args, previous)
    args.evaluation_fixture = fixture
    original_exercise, original_hashes = exercise_core, previous.source_hashes
    previous.OUTPUT, previous.ADAPTER_REVISION, previous.SCOPE = OUTPUT, args.expected_adapter_sha256, SCOPE

    def source_hashes(pack, api_root):
        hashes = original_hashes(pack, api_root)
        for name, path in {"identity_eval/runner": Path(__file__).resolve(), "identity_eval/fixture": args.fixture.resolve(),
                           "identity_eval/plan": args.plan.resolve(), "identity_eval/previous_closed_fixture": args.training_pack.resolve() / "eval_fixture.json",
                           "identity_eval/training_manifest": manifest_path,
                           "identity_eval/train_messages": args.training_pack.resolve() / "train_messages.jsonl",
                           "identity_eval/training_identities": args.training_pack.resolve() / "training_identities.json"}.items():
            hashes[name] = sha(path)
        return hashes

    async def run_exercise(*values):
        return await exercise_identity(*values, previous=previous, exercise=original_exercise, fixture=fixture,
                                       train_uuids=train_uuids, train_times=train_times)

    previous.source_hashes, previous.exercise = source_hashes, run_exercise
    previous.main(args)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--training-pack", type=Path, default=HERE.parent)
    parser.add_argument("--fixture", type=Path, default=HERE / "eval_fixture.json")
    parser.add_argument("--plan", type=Path, default=HERE / "eval_plan.json")
    parser.add_argument("--base-runner", type=Path, default=HERE.parent.parent / "2026-10-24-emlis-4b-training/service_roundtrip_check/run_service_roundtrip.py")
    parser.add_argument("--api-root", type=Path, default=Path("/workspace/cocolon_service_api_20261025"))
    parser.add_argument("--api-commit", default=API_COMMIT)
    parser.add_argument("--pack", type=Path, default=Path("/workspace/cocolon_4b_unicode_fit32_20261025"))
    parser.add_argument("--adapter", type=Path, required=True)
    parser.add_argument("--expected-adapter-sha256", required=True)
    parser.add_argument("--expected-training-manifest-sha256", required=True)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    main(parser.parse_args())
