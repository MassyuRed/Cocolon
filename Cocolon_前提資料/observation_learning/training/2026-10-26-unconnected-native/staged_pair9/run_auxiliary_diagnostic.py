"""One inference-only FIT diagnosis of the four frozen A/B tasks; no CMEE adoption."""
import argparse
import gc
import hashlib
import importlib.metadata
import importlib.util
import json
import os
from pathlib import Path
import signal
import sys
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
PLAN = "prepared_auxiliary_diagnostic.json"
OUTPUT = Path("/workspace/cocolon_auxiliary4_run_20261029")
ADAPTER = {
    "README.md": "7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885",
    "adapter_config.json": "aecf02fe306faa05e11269a1e32a7e344aa80665e7367890989f0b97bcb12b33",
    "adapter_model.safetensors": "2dfd7dbd2613aca8682601a140c1bbcc82e0b22de052dece60c6a60ad1a1cea4",
}
SUPPORT = {
    "run_pilot.py": "2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d",
    "run_native15_expanded30.py": "ca03471329b5f622284cf3abd446cdd2f7831de3f7617da49a558ff7b5259e9d",
    "run_expanded15_recovery.py": "e4be86a2b6fb0581961fc3c619853ba7f419e3239464e969214772b8bc3bfb54",
}
FROZEN = {
    "run/run.json": "e6b532ecf36526897185d91e36de4d4bc9ea7668e7d6be8722585140f9f42334",
    "runtime/train_messages.jsonl": "10ec23b65f253fac6c49dc730725fbcf9c7849867515a2bca96098db036ac2ed",
    "runtime/eval_inputs.json": "0cce7b0601ad579e480f81ccafe211c3596b3b841ff97e45b851dde6bc2b2028",
    "runtime/actual_cpu_check.json": "2d605102cb30fb54c8e36ce7feb4179846e16db45618e7ffc5f61d6ac9045618",
}
CASES = ["AUX-A-FT-BOOK-AFTER-ANSWER", "AUX-B-FT-BOOK-AFTER-ANSWER",
         "AUX-A-FT-SHOP-AFTER-ANSWER", "AUX-B-FT-SHOP-AFTER-ANSWER"]
PROMPT_TOKENS = dict(zip(CASES, [3633, 5207, 3785, 5533]))
CAPS = {cid: 2816 if cid.startswith("AUX-A-") else 1024 for cid in CASES}
FIXED = dict(schema="cocolon.auxiliary4_inference_once.v1", pod_id="vgkm402msgroiu",
             expected_gpu_name="NVIDIA RTX A5000", gpu_hourly_usd=0.28,
             max_processing_seconds=600, max_process_usd=0.047,
             max_preparation_seconds=900, preparation_scope="separate base download/pinned dependency setup; no model calls",
             per_generation_seconds=180, context_tokens=8192, max_new_tokens_by_case=CAPS,
             case_ids=CASES, output_directory=str(OUTPUT), model_loads=1, model_calls=4,
             optimizer_steps=0, adapter_sha256=ADAPTER, support_sha256=SUPPORT,
             frozen_predecessor_sha256=FROZEN,
             auxiliary_sha256="3c80fa6c1c9b47df8efc84aa9f899af4ffb6ef436c0403fdb1bb0646f88f1654",
             model="Qwen/Qwen3.5-4B", model_revision="851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a",
             api_commit="7b9ee073de03940ba71587297d8600b2b6094dd1", retry=False,
             automatic_progression=False, product_credit=0, cmee_adoptions=0,
             sql_operations=0, gpu_lifecycle_operations=0)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, value):
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    temp.replace(path)


def require(ok, message):
    if not ok:
        raise ValueError(message)


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    sys.modules[name] = result
    spec.loader.exec_module(result)
    return result


def validate(archive, support, execution=False):
    plan = json.loads((HERE / PLAN).read_text())
    require(set(plan) == set(FIXED) | {"runner_sha256", "gpu_run_authorized", "approval_basis"}, "plan_keys_changed")
    for key, value in FIXED.items():
        require(type(plan[key]) is type(value) and plan[key] == value, "plan_changed:" + key)
    require(sha(__file__) == plan["runner_sha256"], "runner_changed")
    require(type(plan["gpu_run_authorized"]) is bool, "authorization_type")
    require((plan["gpu_run_authorized"] and isinstance(plan["approval_basis"], str) and plan["approval_basis"].strip())
            or (not plan["gpu_run_authorized"] and plan["approval_basis"] is None), "authorization_basis")
    require(not execution or plan["gpu_run_authorized"], "execution_disabled_until_explicit_authorization")
    bound = {HERE / PLAN: sha(HERE / PLAN), HERE / Path(__file__).name: plan["runner_sha256"],
             HERE / "auxiliary_train_messages.jsonl": plan["auxiliary_sha256"]}
    bound.update({archive / name: digest for name, digest in FROZEN.items()})
    bound.update({archive / "run/adapter" / name: digest for name, digest in ADAPTER.items()})
    bound.update({support / name: digest for name, digest in SUPPORT.items()})
    require(all(path.is_file() and sha(path) == digest for path, digest in bound.items()), "immutable_input_hash_mismatch")
    rows = [json.loads(line) for line in (HERE / "auxiliary_train_messages.jsonl").read_text().splitlines()]
    require([row["id"] for row in rows] == CASES, "four_frozen_tasks_changed")
    original = [json.loads(line) for line in (archive / "runtime/train_messages.jsonl").read_text().splitlines()]
    require(original[-4:] == rows and len(original) == 19, "auxiliary_rows_differ_from_actual_training")
    recorded = {row["case_id"]: row for row in json.loads((archive / "runtime/actual_cpu_check.json").read_text())["cases"]}
    for row in rows:
        cid = row["id"]
        require([message["role"] for message in row["messages"]] == ["system", "user", "assistant"], "message_roles")
        require(recorded[cid]["prompt_tokens"] == PROMPT_TOKENS[cid] and PROMPT_TOKENS[cid] + CAPS[cid] <= 8192, "recorded_context_exceeded")
    predecessor = json.loads((archive / "run/run.json").read_text())
    require(predecessor["adapter_sha256"] == ADAPTER and predecessor["optimizer_steps_completed"] == 9
            and predecessor["model_calls_completed"] == 2, "predecessor_identity")
    return plan, rows, bound


def runtime_check(archive, support):
    plan, rows, bound = validate(archive, support)
    require(os.environ.get("HF_HUB_OFFLINE") == os.environ.get("TRANSFORMERS_OFFLINE") == "1", "offline_required")
    helper = module("auxiliary4_immutable_helper", support / "run_pilot.py")
    require({name: importlib.metadata.version(name) for name in helper.PINS} == helper.PINS, "dependency_pins_changed")
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(helper.MODEL, revision=helper.REVISION, local_files_only=True, trust_remote_code=False)
    for row in rows:
        ids = helper.chat_token_ids(tokenizer, row["messages"][:-1], generation_prompt=True)
        require(len(ids) == PROMPT_TOKENS[row["id"]] and len(ids) + CAPS[row["id"]] <= 8192, "actual_tokenizer_context_changed")
    return plan, rows, bound, helper, tokenizer


def differences(expected, actual, path="$"):
    """Count literal JSON leaf/type differences; a diagnostic, never semantic acceptance."""
    if type(expected) is not type(actual):
        return [path]
    if isinstance(expected, dict):
        missing = [path + "." + key for key in sorted(set(expected) ^ set(actual))]
        return missing + [item for key in sorted(set(expected) & set(actual)) for item in differences(expected[key], actual[key], path + "." + key)]
    if isinstance(expected, list):
        return [path + "[" + str(i) + "]" for i in range(min(len(expected), len(actual)), max(len(expected), len(actual)))] + [item for i in range(min(len(expected), len(actual))) for item in differences(expected[i], actual[i], path + "[" + str(i) + "]")]
    return [] if expected == actual else [path]


def execute(archive, support, source):
    plan, rows, bound = validate(archive, support, execution=True)
    require(len(source) == 40 and all(ch in "0123456789abcdef" for ch in source), "source_commit_required")
    # A fresh output directory is the one-shot lock; closed predecessor locks are never touched.
    OUTPUT.mkdir(exist_ok=False)
    started = time.monotonic()
    deadline = started + 600
    report = dict(status="STARTED_ONCE", source_commit=source, plan=plan, started_unix=time.time(), model_loads_started=0,
                  model_loads_completed=0, model_calls_started=0, model_calls_completed=0,
                  optimizer_steps=0, cmee_adoptions=0, calls=[], retry=False,
                  automatic_progression=False, product_credit=0, sql_operations=0, gpu_lifecycle_operations=0)
    model = None
    original_generate = None
    generate = None

    def checkpoint():
        report["elapsed_seconds"] = time.monotonic() - started
        write(OUTPUT / "run.json", report)

    def stop(*_):
        raise TimeoutError("auxiliary4_deadline_no_retry")

    signal.signal(signal.SIGALRM, stop)
    signal.signal(signal.SIGTERM, stop)
    signal.setitimer(signal.ITIMER_REAL, 600)
    checkpoint()
    try:
        plan, rows, bound, helper, tokenizer = runtime_check(archive, support)
        import torch
        from transformers import StoppingCriteria, StoppingCriteriaList
        require(os.environ.get("RUNPOD_POD_ID") == plan["pod_id"] and torch.cuda.device_count() == 1, "pod_or_gpu_count_changed")
        report["gpu"] = helper.gpu_profile(torch, {"minimum_free_gib": 14})
        require(report["gpu"]["name"] == plan["expected_gpu_name"], "gpu_name_changed")
        torch.cuda.reset_peak_memory_stats()
        recovery = module("auxiliary4_existing_suffix_owner", support / "run_expanded15_recovery.py")
        recovery.OLDPACK = support
        recovery.ORIGIN = archive / "run"
        owner, _, _ = recovery.owner_with_checked_suffixes()
        report["model_loads_started"] = 1
        checkpoint()
        model, tensors = owner.load_expanded_adapter(helper, archive / "run/adapter", ADAPTER, trainable=False)
        require(not any(parameter.requires_grad for parameter in model.parameters()), "inference_only_required")
        report["model_loads_completed"] = 1
        write(OUTPUT / "reloaded_tensors.json", tensors)
        for row in rows:
            require(time.monotonic() < deadline - 5 and report["model_calls_started"] < 4, "deadline_before_call")
            stop_at = min(deadline, time.monotonic() + 180)
            triggered = False
            original_generate = model.generate

            class Bounded(StoppingCriteria):
                def __call__(self, *args, **kwargs):
                    nonlocal triggered
                    triggered = time.monotonic() >= stop_at
                    return triggered

            def generate(*args, **kwargs):
                kwargs["stopping_criteria"] = StoppingCriteriaList([*list(kwargs.get("stopping_criteria") or []), Bounded()])
                return original_generate(*args, **kwargs)

            cid = row["id"]
            case = {"case_id": cid, "messages": row["messages"][:-1]}
            report["model_calls_started"] += 1
            checkpoint()
            path = OUTPUT / (cid + ".jsonl")
            with patch.object(model, "generate", generate):
                helper.evaluate(model, tokenizer, [case], path, {"context_tokens": 8192, "max_new_tokens": CAPS[cid]}, adapter_revision=ADAPTER["adapter_model.safetensors"])
            raw = helper.read_jsonl(path)[0]
            mismatch = None if raw["parsed"] is None else differences(helper.strict_json(row["messages"][-1]["content"]), raw["parsed"])
            result = dict(case_id=cid, raw_sha256=sha(path), eos=raw["eos_reached"], seconds=raw["seconds"], output_tokens=raw["output_tokens"],
                          complete_json=raw["parsed"] is not None, exact_teacher_json=(mismatch == []),
                          field_mismatch_count=None if mismatch is None else len(mismatch), mismatch_paths=mismatch,
                          gold_A_conditioned=cid.startswith("AUX-B-"), timeout_triggered=triggered,
                          cmee_adoption="NOT_APPLICABLE_PARTIAL_OFFLINE_PROJECTION")
            report["calls"].append(result)
            report["model_calls_completed"] += 1
            checkpoint()
            require(not triggered and time.monotonic() < stop_at, "generation_deadline_no_retry")
        report["status"] = "RAW_COMPLETE_PENDING_CONTENT_REVIEW_NOT_ADOPTED"
    except BaseException as exc:
        report.update(status="STOPPED_NO_RETRY", error_type=type(exc).__name__, reason=str(exc), traceback=traceback.format_exc())
    finally:
        if "torch" in sys.modules and sys.modules["torch"].cuda.is_initialized():
            report["peak_allocated_bytes"] = sys.modules["torch"].cuda.max_memory_allocated()
            report["peak_reserved_bytes"] = sys.modules["torch"].cuda.max_memory_reserved()
        original_generate = None
        generate = None
        model = None
        gc.collect()
        if "torch" in sys.modules and sys.modules["torch"].cuda.is_initialized():
            sys.modules["torch"].cuda.empty_cache()
            report["post_release_allocated_bytes"] = sys.modules["torch"].cuda.memory_allocated()
        try:
            require(all(sha(path) == digest for path, digest in bound.items()), "frozen_inputs_changed_after_execution")
            report["all_inputs_unchanged"] = True
        except BaseException as exc:
            report.update(status="STOPPED_IDENTITY_UNVERIFIED_NO_RETRY", identity_error=str(exc))
        signal.setitimer(signal.ITIMER_REAL, 0)
        report["processing_seconds"] = time.monotonic() - started
        report["process_cost_usd"] = report["processing_seconds"] * plan["gpu_hourly_usd"] / 3600
        checkpoint()
    print(json.dumps({key: report.get(key) for key in ("status", "model_calls_completed", "processing_seconds", "process_cost_usd")}), flush=True)
    return 0 if report["status"] == "RAW_COMPLETE_PENDING_CONTENT_REVIEW_NOT_ADOPTED" else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive-root", required=True, type=Path)
    parser.add_argument("--support-root", required=True, type=Path)
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--runtime-check", action="store_true")
    parser.add_argument("--source-commit", default="")
    args = parser.parse_args()
    if args.execute:
        raise SystemExit(execute(args.archive_root.resolve(), args.support_root.resolve(), args.source_commit))
    if args.runtime_check:
        require(os.environ.get("CUDA_VISIBLE_DEVICES") == "", "cpu_runtime_check_requires_cuda_hidden")
        runtime_check(args.archive_root.resolve(), args.support_root.resolve())
        import torch
        require(not torch.cuda.is_initialized(), "cpu_runtime_check_initialized_cuda")
    plan, rows, bound = validate(args.archive_root.resolve(), args.support_root.resolve())
    print(json.dumps(dict(status="CPU_STATIC_READY_NO_MODEL" if not args.runtime_check else "CPU_TOKENIZER_READY_NO_MODEL",
                         frozen_auxiliary_rows=len(rows), bound_files=len(bound), optimizer_steps=0,
                         pretrained_model_loads=0, generations=0, sql_operations=0,
                         adapter_sha256=ADAPTER["adapter_model.safetensors"],
                         reused_tensor_evidence="predecessor112F32/3833856parameters; identical adapter bytes",
                         prompt_tokens=PROMPT_TOKENS, max_new_tokens=CAPS,
                         gpu_run_authorized=plan["gpu_run_authorized"]), ensure_ascii=False))
