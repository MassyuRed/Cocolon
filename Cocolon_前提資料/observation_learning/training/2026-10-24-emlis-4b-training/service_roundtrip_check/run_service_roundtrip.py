#!/usr/bin/env python3
"""One-shot real 4B -> explicit offline Emlis service -> isolated SQL roundtrip.

Only the published fictional chair input/correction is used. This is not a
normal application, real account/Auth/HTTP/RN/device or product-quality check.
It never trains, repairs raw IDs/prior/output, resends inference, or controls
the Pod. The existing saved adapter is loaded for inference only.
"""
import argparse
import asyncio
from datetime import datetime, timezone
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import sys
import tarfile
import threading
import time
from unittest.mock import patch
from uuid import uuid4

sys.dont_write_bytecode = True
ADAPTER_REVISION = "9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835"
OUTPUT = Path("/workspace/cocolon_4b_service_roundtrip_20261025")
ORIGINAL_MEMO = "全部一人で直せたことが、うれしかった。"
ORIGINAL_ACTION = "ぐらついていた椅子を修理して、また座れるようになった。"
CORRECTION = ("さっき「全部一人で」と書いたのは訂正します。途中で友人に手順を教えてもらって、一緒に直しました。\n\n"
              "うれしかったのも、一人でできたからではなく、捨てずにまた使えるようになったからです。")
SCOPE = ("Known fictional chair, new real 4B calls through ModelCandidateSource and explicit offline "
         "EmlisThreadService; actual isolated PostgreSQL/WASM RPC, meaning-save interruption, explicit "
         "resume and completed DTO non-generation reads. No normal application, real user DB, "
         "HTTP/Auth/RN/device, general-input quality, training or product acceptance.")


def require(condition, code):
    if not condition:
        raise ValueError(code)


def utcnow():
    return datetime.now(timezone.utc).isoformat()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def dump(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    temporary.replace(path)


def git(root, *args):
    return subprocess.run(["git", "-C", str(root), *args], check=True,
                          capture_output=True, text=True).stdout.strip()


def source_hashes(pack, api_root):
    paths = {"runner/run_service_roundtrip.py": Path(__file__).resolve()}
    for name in ("run_pilot.py", "verify_cmee.py", "dataset_manifest.json"):
        paths["pack/" + name] = pack / name
    for name in ("ai/tests/test_emlis_q2_application.py", "ai/tests/helpers/emlis_q2_postgres.cjs",
                 "supabase/migrations/20260911020509_emlis_input_threads_q2.sql"):
        paths["api/" + name] = api_root / name
    for name in (
        "emlis_thread_service.py", "emlis_thread_store.py",
        "cocolon_meaning_experience_engine/model_candidate_source.py",
        "cocolon_meaning_experience_engine/engine.py",
        "cocolon_meaning_experience_engine/emlis_semantic_admission.py"):
        relative = "ai/services/ai_inference/" + name
        paths["api/" + relative] = api_root / relative
    return {name: sha(path) for name, path in paths.items()}


def archive(output):
    """Archive whatever was actually recorded, including incomplete attempts."""
    manifest = {p.name: {"bytes": p.stat().st_size, "sha256": sha(p)}
                for p in sorted(output.iterdir())
                if p.is_file() and p.name not in {"result.tar.gz", "file_manifest.json"}
                and not p.name.endswith(".tmp")}
    dump(output / "file_manifest.json", manifest)
    with tarfile.open(output / "result.tar.gz", "w:gz") as bundle:
        for name in [*manifest, "file_manifest.json"]:
            bundle.add(output / name, arcname=name, recursive=False)
    return sha(output / "result.tar.gz")


async def exercise(args, report, model, tokenizer, r, db):
    import emlis_thread_service as service_module
    import emlis_thread_store as store_module
    from emlis_thread_service import EmlisThreadService
    from cocolon_meaning_experience_engine.emlis_semantic_admission import MODEL_PROFILE
    from cocolon_meaning_experience_engine.model_candidate_source import (
        ModelCandidateSource, ModelCallLimits, ModelResponse)

    output = args.output.resolve()
    user_id, input_id = str(uuid4()), str(uuid4())
    report.update(fictional_user_id=user_id, fictional_input_id=input_id)

    def sql(statement, params):
        result = db.query(statement, params)
        require("code" not in result, "isolated_fixture_sql_failed")
        return result

    sql("insert into auth.users values ($1)", [user_id])
    sql("insert into public.profiles values ($1,'free')", [user_id])
    sql("insert into public.emotions values ($1,$2,now() at time zone 'UTC',$3,$4,array['生活'],array['喜び'],$5)",
        [input_id, user_id, ORIGINAL_MEMO, ORIGINAL_ACTION,
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
        require(limits.max_input_tokens == 6144 and limits.max_new_tokens == 2048,
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
                      "scope": "KNOWN_FICTIONAL_SERVICE_NOT_HELD_OUT"}], path,
                    {"context_tokens": 8192, "max_new_tokens": 2048}, adapter_revision=ADAPTER_REVISION)

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
                and row["adapter_revision"] == ADAPTER_REVISION, "actual_model_identity_changed")
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
        limits=ModelCallLimits(6144, 2048, 150), adapter_revision=ADAPTER_REVISION)

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
            "answer_text": CORRECTION, "authored_at": utcnow()}
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
    started = time.monotonic()
    output = args.output.resolve()
    require(output == OUTPUT, "output_outside_fixed_one_shot_directory")
    require(not output.exists(), "one_shot_output_already_exists_no_retry")
    require(re.fullmatch(r"[0-9a-f]{40}", args.api_commit or ""), "exact_api_commit_required")
    output.mkdir(parents=True)
    report = {"schema": "cocolon.cmee.real_model_offline_service_roundtrip.v1", "scope": SCOPE,
        "status": "STARTED", "started_at": utcnow(), "api_commit": args.api_commit,
        "adapter_revision": ADAPTER_REVISION, "max_seconds": 900, "offline_model_attempt_seconds": 180,
        "service_source_timeout_upper_seconds": 150, "max_model_calls": 2, "automatic_retry": 0,
        "model_calls_started": 0, "model_calls_completed": 0, "candidate_source_calls": 0,
        "receipts_returned": 0, "isolated_rpc_calls": 0, "model_calls": [],
        "forbidden_generation_calls": 0, "forbidden_candidate_calls": 0,
        "new_training_updates": 0, "new_optimizer": False, "service_saved_roundtrip": False,
        "isolated_sql_persistence_tested": False, "production_database_operations": 0,
        "raw_substitution": False, "raw_id_or_prior_repair": False, "teacher_sent": False,
        "normal_application_enabled": False, "product_accepted": False,
        "automatic_progression": False, "gpu_stop_restart_delete_operations": 0}
    dump(output / "attempt.json", report)
    db = None
    r = None
    adapter_before = None
    hashes_before = None

    def deadline(_signum, _frame):
        # asyncio.to_thread may outlive cancellation; hard-stop only this
        # Python process at its authorized wall deadline, never the rental Pod.
        report.update(status="PROCESS_DEADLINE_NO_RETRY", seconds=time.monotonic() - started)
        try:
            dump(output / "run.json", report)
            archive(output)
        finally:
            os._exit(124)

    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(900)
    try:
        pack, api_root, adapter = args.pack.resolve(), args.api_root.resolve(), args.adapter.resolve()
        require(os.environ.get("Q2_PGLITE_MODULE"), "isolated_pglite_module_not_configured")
        sys.path.insert(0, str(pack))
        import run_pilot as r
        from verify_cmee import load_api
        require(Path(r.__file__).resolve() == pack / "run_pilot.py", "different_training_runner_loaded")
        load_api(api_root, args.api_commit)
        require(not git(api_root, "status", "--porcelain"), "api_worktree_not_clean")
        hashes_before = source_hashes(pack, api_root)
        adapter_before = r.adapter_hashes(adapter)
        require(adapter_before["adapter_model.safetensors"] == ADAPTER_REVISION, "selected_adapter_changed")
        report.update(source_hashes_before=hashes_before, adapter_hashes_before=adapter_before,
                      model=r.MODEL, revision=r.REVISION, seed=r.SEED,
                      context_tokens=8192, max_new_tokens=2048, do_sample=False,
                      dtype="bfloat16", attention="sdpa")
        for name, expected in r.PINS.items():
            require(importlib.metadata.version(name) == expected, "dependency_pin_mismatch_" + name)
        import torch
        from transformers import AutoTokenizer, set_seed
        require(torch.cuda.is_available() and torch.cuda.is_bf16_supported(), "bf16_cuda_required")
        set_seed(r.SEED)
        tokenizer = AutoTokenizer.from_pretrained(r.MODEL, revision=r.REVISION,
            trust_remote_code=False, local_files_only=True)
        model, tensor_stats = r.load_saved_adapter(adapter, adapter_before)
        trainable_count = sum(p.numel() for p in model.parameters() if p.requires_grad)
        require(trainable_count == 0, "inference_model_has_trainable_parameters")
        report.update(trainable_parameters=trainable_count, adapter_tensor_count=len(tensor_stats),
                      adapter_tensor_stats=tensor_stats, gpu_name=torch.cuda.get_device_name(0))
        dump(output / "run.json", report)
        print("MODEL_RELOADED_INFERENCE_ONLY", flush=True)
        sys.path.insert(0, str(api_root / "ai/tests"))
        from test_emlis_q2_application import Database
        db = Database()
        asyncio.run(exercise(args, report, model, tokenizer, r, db))
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error_type=type(exc).__name__)
        # Error messages may contain arbitrary source/library payloads. Fixed
        # local assertion identifiers are sufficient; full actual state/raw is saved.
        if isinstance(exc, ValueError) and re.fullmatch(r"[A-Za-z0-9_]+", str(exc)):
            report["error_code"] = str(exc)
        raise
    finally:
        report["seconds"] = time.monotonic() - started
        if r is not None and adapter_before is not None:
            report["adapter_hashes_after"] = r.adapter_hashes(args.adapter.resolve())
            report["adapter_files_unchanged"] = report["adapter_hashes_after"] == adapter_before
        if hashes_before is not None:
            report["source_hashes_after"] = source_hashes(args.pack.resolve(), args.api_root.resolve())
            report["source_files_unchanged"] = report["source_hashes_after"] == hashes_before
            report["api_head_after"] = git(args.api_root.resolve(), "rev-parse", "HEAD")
            report["api_worktree_clean_after"] = not git(args.api_root.resolve(), "status", "--porcelain")
        if report.get("status") == "KNOWN_REAL_MODEL_OFFLINE_SERVICE_SQL_ROUNDTRIP_COMPLETE_NOT_PRODUCT_ACCEPTED":
            if (not report.get("adapter_files_unchanged") or not report.get("source_files_unchanged")
                    or report.get("api_head_after") != args.api_commit or not report.get("api_worktree_clean_after")):
                report.update(status="POSTCHECK_FAILED_NOT_ACCEPTED")
        dump(output / "run.json", report)
        archive_sha = archive(output)
        if db is not None:
            db.proc.stdin.close()
            try:
                db.proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                db.proc.terminate()  # Only the isolated test DB bridge.
        signal.alarm(0)
        print(json.dumps({key: report[key] for key in (
            "status", "model_calls_started", "model_calls_completed", "service_saved_roundtrip", "seconds")}), flush=True)
        print("ARCHIVE_SHA256", archive_sha, flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-commit", required=True)
    parser.add_argument("--api-root", type=Path, default=Path("/workspace/cocolon_service_api_20261025"))
    parser.add_argument("--pack", type=Path, default=Path("/workspace/cocolon_4b_unicode_fit32_20261025"))
    parser.add_argument("--adapter", type=Path, default=Path("/workspace/cocolon_4b_reception_fit4_lr5_20261025/adapter"))
    parser.add_argument("--output", type=Path, default=OUTPUT)
    main(parser.parse_args())
