#!/usr/bin/env python3
"""One saved-adapter continuation: nine frozen bindings, eighteen updates.

No optimizer-state restart, before generation, separate service holdout read, provider client,
production DB, dependency installation, retry or Pod lifecycle operation.
"""
import argparse
import gc
import hashlib
import importlib.metadata
import json
import math
import os
from pathlib import Path
import random
import re
import signal
import sys
import tarfile
import time

sys.dont_write_bytecode = True
INITIAL_ADAPTER = "76309b86c6a76ed61cf3600f4beb1f45c658fac3bb3e3add4284ef54259276c5"
LEGACY_RUNNER = "2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"
API_COMMIT = "bd356566d37370911e14dab2819ab25a619c6353"
OUTPUT = Path("/workspace/cocolon_4b_daily_calm_fit18_20261025")
FILES = {"generate_candidates.py", "sft_examples.jsonl", "train_messages.jsonl",
         "source_mapping_candidate.json", "cpu_connection_results.json"}


def require(condition, code):
    if not condition:
        raise ValueError(code)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def validate_plan(plan, *, authorized=True):
    fixed = {"schema": "cocolon.4b_daily_calm_fit18.v1", "api_commit": API_COMMIT,
        "model": "Qwen/Qwen3.5-4B", "revision": "851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a",
        "semantic_profile": "emlis_model_proposal.v1", "initial_adapter_sha256": INITIAL_ADAPTER,
        "legacy_run_pilot_sha256": LEGACY_RUNNER, "training_rows": 9, "identity_groups": 6,
        "unique_language_story_count": 2, "unique_stages": 2, "passes": 2,
        "max_optimizer_steps": 18, "batch_size": 1, "gradient_accumulation": 1,
        "learning_rate": 5e-5, "weight_decay": 0, "clip_norm": 1, "seed": 20261024,
        "optimizer": "AdamW", "loss_scope": "FINAL_ASSISTANT_FULL_JSON_AND_EOS",
        "context_tokens": 8192, "max_input_tokens": 5632, "max_new_tokens": 2560, "max_seconds": 1800,
        "gpu_hourly_usd": .26, "max_process_usd": .13, "minimum_free_gib": 14,
        "before_generations": 0, "fit_generations": 9, "holdout_generations_in_this_runner": 0,
        "strict_optimizer_resume": False, "new_optimizer": True, "retry": False,
        "automatic_pod_stop": False, "output_directory": str(OUTPUT)}
    for key, value in fixed.items():
        require(type(plan.get(key)) is type(value) and plan[key] == value,
                "fixed_plan_mismatch:" + key)
    require(plan["max_seconds"] * plan["gpu_hourly_usd"] / 3600 <= plan["max_process_usd"],
            "process_cost_exceeds_plan")
    for key in ("dataset_manifest_sha256", "training_examples_sha256", "training_messages_sha256", "runner_sha256"):
        require(type(plan.get(key)) is str and re.fullmatch(r"[0-9a-f]{64}", plan[key]),
                "root_must_freeze_hash:" + key)
    if authorized:
        require(plan.get("status") == "AUTHORIZED_ONCE_CURRENT_MASH_CONTINUATION"
                and plan.get("gpu_run_authorized") is True, "plan_not_authorized")
    return plan


def validate_data(directory, legacy, plan, runner):
    require(sha(directory / "dataset_manifest.json") == plan["dataset_manifest_sha256"], "manifest_hash_mismatch")
    require(sha(directory / "sft_examples.jsonl") == plan["training_examples_sha256"], "examples_hash_mismatch")
    require(sha(directory / "train_messages.jsonl") == plan["training_messages_sha256"], "messages_hash_mismatch")
    manifest = runner.strict_json((directory / "dataset_manifest.json").read_text())
    require(manifest["schema"] == "cocolon.daily_calm_training_candidates.v1"
            and manifest["api_commit"] == API_COMMIT and manifest["training_rows"] == 9
            and manifest["daily_rows"] == 3 and manifest["chair_rows"] == 6
            and manifest["independent_language_families"] == 2 and manifest["evaluation_rows"] == 0,
            "dataset_scope_invalid")
    require(set(manifest["files"]) == FILES, "dataset_file_set_changed")
    for name,spec in manifest["files"].items():
        p=directory/name
        require(p.is_file() and not p.is_symlink() and sha(p)==spec["sha256"] and p.stat().st_size==spec["bytes"], "dataset_changed:"+name)
    examples=runner.read_jsonl(directory/"sft_examples.jsonl")
    messages=runner.read_jsonl(directory/"train_messages.jsonl")
    require(len(examples)==len(messages)==9 and len({e["id"] for e in examples})==9, "nine_rows_required")
    require([e["messages"] for e in examples]==[m["messages"] for m in messages], "message_projection_changed")
    canonical=lambda v:json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(",",":"))
    first_six="".join(canonical(e)+"\n" for e in examples[:6]).encode()
    require(hashlib.sha256(first_six).hexdigest()==manifest["old_chair_hashes"]["sft_examples.jsonl"], "old_chair_six_changed")
    require(all("CHAIR" in e["family"] for e in examples[:6])
            and all(e["family"]=="DAILY_MEAL_SLIGHT_CALM_ONE_EXISTING_STORY" and e["stage"]=="INITIAL" for e in examples[6:]), "family_scope_changed")
    for e in examples:
        require([m["role"] for m in e["messages"]]==["system","user","assistant"], "message_roles_changed")
        text=e["messages"][-1]["content"]
        target=runner.strict_json(text)
        require(hashlib.sha256(text.encode()).hexdigest()==e["target_sha256"]
                and target["candidate"]["schema_version"]==runner.CANDIDATE_SCHEMA, "target_changed")
    return examples,manifest,{name:sha(legacy/name) for name in ("run_pilot.py","verify_cmee.py")}


def archive(output, runner):
    files = []
    for path in sorted(output.rglob("*")):
        require(not path.is_symlink(), "output_symlink_forbidden")
        if not path.is_file() or path.name in {"checkpoint.tar.gz", "file_manifest.json"} or path.suffix == ".tmp":
            continue
        require(path.stat().st_size <= 64 * 2**20, "output_member_too_large")
        files.append(path)
    runner.write_json(output / "file_manifest.json", {str(p.relative_to(output)):
        {"sha256": sha(p), "bytes": p.stat().st_size} for p in files})
    temporary = output / "checkpoint.tar.gz.tmp"
    with tarfile.open(temporary, "w:gz") as stream:
        for path in [*files, output / "file_manifest.json"]:
            stream.add(path, arcname=str(path.relative_to(output)), recursive=False)
    temporary.replace(output / "checkpoint.tar.gz")


def timeout(*_):
    raise TimeoutError("daily_calm_fit18_process_deadline")


def main(args):
    directory, legacy, initial = args.directory.resolve(), args.legacy_pack.resolve(), args.initial_adapter.resolve()
    require(sha(legacy / "run_pilot.py") == LEGACY_RUNNER, "legacy_runner_changed")
    sys.path.insert(0, str(legacy))
    import run_pilot as runner
    plan = validate_plan(runner.strict_json((directory / "plan.json").read_text()))
    require(sha(__file__) == plan["runner_sha256"], "frozen_runner_changed")
    require(re.fullmatch(r"[0-9a-f]{40}", args.source_commit), "fixed_source_commit_required")
    examples, manifest, old_data = validate_data(directory, legacy, plan, runner)
    old_adapter = runner.adapter_hashes(initial)
    require(old_adapter["adapter_model.safetensors"] == INITIAL_ADAPTER, "initial_adapter_changed")
    versions = {name: importlib.metadata.version(name) for name in runner.PINS}
    require(versions == runner.PINS, "fixed_runtime_versions_required")
    require(os.environ.get("HF_HUB_OFFLINE") == os.environ.get("TRANSFORMERS_OFFLINE") == "1", "offline_cache_only_required")
    if args.validate_only:
        from transformers import AutoTokenizer
        tokenizer=AutoTokenizer.from_pretrained(runner.MODEL,revision=runner.REVISION,local_files_only=True,trust_remote_code=False)
        stats=[]
        for e in examples:
            item,prefix=runner.encode_training(tokenizer,e["messages"],context=8192)
            require(prefix<=5632 and prefix+2560<=8192 and len(item["input_ids"])-prefix<=2560,"token_limits_failed_no_truncation")
            stats.append(dict(id=e["id"],prompt_tokens=prefix,assistant_eos_tokens=len(item["input_ids"])-prefix,full_tokens=len(item["input_ids"])))
        report=dict(status="CPU_TOKENIZATION_VERIFIED_NO_MODEL_OR_GPU_CALL",model=runner.MODEL,revision=runner.REVISION,
            manifest_sha256=sha(directory/"dataset_manifest.json"),rows=stats,tokenization_verified=True,
            token_counter_is_stub=False,training_updates=0,model_calls=0)
        target=directory/"cpu_tokenization_results.json"
        require(not target.exists(),"token_report_already_exists_no_duplicate_execution")
        runner.write_json(target,report)
        print(json.dumps(dict(status=report["status"],rows=len(stats),maximum_prompt=max(x["prompt_tokens"] for x in stats),maximum_completion=max(x["assistant_eos_tokens"] for x in stats),sha256=sha(target))))
        return
    tokenized=runner.strict_json((directory/"cpu_tokenization_results.json").read_text())
    require(tokenized["tokenization_verified"] is True and tokenized["token_counter_is_stub"] is False
            and tokenized["manifest_sha256"]==sha(directory/"dataset_manifest.json"),"verified_tokenization_required")
    require(not OUTPUT.exists(), "fixed_output_already_exists_no_retry")
    OUTPUT.mkdir()
    output, started = OUTPUT, time.monotonic()
    report = {"schema": "cocolon.4b_daily_calm_fit18_result.v1", "status": "STARTED",
        "source_commit": args.source_commit, "api_commit": API_COMMIT, "plan": plan,
        "runner_sha256": sha(__file__), "dataset_manifest_sha256": sha(directory / "dataset_manifest.json"),
        "initial_adapter_sha256": old_adapter, "runtime_versions": versions,
        "distinct_targets": 9, "identity_groups": 6, "independent_stories": 2, "unique_stages": 2,
        "new_optimizer": True, "strict_optimizer_resume": False,
        "optimizer_steps_completed": 0, "generation_calls_started": 0, "new_generations": 0,
        "before_generations": 0, "separate_service_holdout_read_or_generated_here": False,
        "raw_repair": False, "product_accepted": False, "automatic_progression": False,
        "gpu_stop_restart_delete_operations": 0, "retry": False}
    for name in ["plan.json", "dataset_manifest.json", *sorted(FILES)]:
        (output / name).write_bytes((directory / name).read_bytes())
    (output / "runner_source.py").write_bytes(Path(__file__).read_bytes())
    (output / "legacy_run_pilot.py").write_bytes((legacy / "run_pilot.py").read_bytes())
    (output / "SOURCE_COMMIT").write_text(args.source_commit + "\n")
    runner.write_json(output / "attempt.json", {"source_commit": args.source_commit, "retry": False,
        "started_unix": time.time(), "optimizer_steps_max": 18, "fit_generation_calls_max": 9})
    def save():
        runner.write_json(output / "run.json", report)
    save()
    signal.signal(signal.SIGALRM, timeout)
    signal.signal(signal.SIGTERM, timeout)
    signal.alarm(plan["max_seconds"])
    try:
        import torch
        from transformers import AutoTokenizer
        from peft import PeftModel
        require(torch.cuda.device_count() == 1, "single_existing_gpu_required")
        report["gpu"] = runner.gpu_profile(torch, plan)
        require("A4500" in report["gpu"]["name"], "existing_a4500_only")
        random.seed(runner.SEED)
        torch.manual_seed(runner.SEED)
        torch.cuda.manual_seed_all(runner.SEED)
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(runner.MODEL, revision=runner.REVISION,
            local_files_only=True, trust_remote_code=False)
        encoded, token_stats = [], []
        for example in examples:
            item, prefix = runner.encode_training(tokenizer, example["messages"], context=8192)
            target_tokens = len(item["input_ids"]) - prefix
            require(prefix <= 5632 and prefix + 2560 <= 8192, "generation_context_exceeded_no_truncation")
            require(target_tokens <= 2560, "complete_teacher_exceeds_fixed_generation_budget")
            encoded.append(item)
            token_stats.append({"id": example["id"], "prompt_tokens": prefix,
                "assistant_eos_tokens": target_tokens, "full_tokens": len(item["input_ids"])})
        require(token_stats == tokenized["rows"], "tokenizer_input_changed_after_preflight")
        report["token_stats"] = token_stats
        order_rng, order = random.Random(runner.SEED), []
        for _pass in range(2):
            indexes = list(range(9))
            order_rng.shuffle(indexes)
            order.extend(indexes)
        report["training_order"] = [examples[i]["id"] for i in order]
        save()
        config = runner.strict_json((initial / "adapter_config.json").read_text())
        require(config.get("base_model_name_or_path") == runner.MODEL
                and set(config.get("target_modules", [])) == runner.EXPECTED_TARGETS
                and config.get("r") == 8 and config.get("lora_alpha") == 16
                and config.get("lora_dropout") == 0 and config.get("bias") == "none", "adapter_configuration_changed")
        model = PeftModel.from_pretrained(runner.load_base(), initial, is_trainable=True, local_files_only=True)
        trainable = [(name, p) for name, p in model.named_parameters() if p.requires_grad]
        require(len(trainable) == 32 and all("lora_" in name and ".self_attn." in name for name, _ in trainable),
                "only_existing_32_text_attention_lora_tensors_may_train")
        require(all(torch.isfinite(p).all().item() for _, p in trainable), "non_finite_initial_adapter")
        report["trainable_parameters"] = [{"name": name, "shape": list(p.shape), "dtype": str(p.dtype)} for name, p in trainable]
        runner.measure_nll(model, examples, encoded, output / "before_nll.jsonl")
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([p for _, p in trainable], lr=5e-5, weight_decay=0.0)
        with (output / "training.jsonl").open("x", encoding="utf-8") as stream:
            for step, index in enumerate(order, 1):
                item = encoded[index]
                ids = torch.tensor([item["input_ids"]], dtype=torch.long, device="cuda:0")
                labels = torch.tensor([item["labels"]], dtype=torch.long, device="cuda:0")
                optimizer.zero_grad(set_to_none=True)
                loss = runner.teacher_loss(model, input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, encoded=item)
                require(torch.isfinite(loss).item(), "non_finite_training_loss")
                loss.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, "non_finite_or_zero_gradient")
                optimizer.step()
                report["optimizer_steps_completed"] = step
                stream.write(json.dumps({"step": step, "pass": (step - 1) // 9 + 1,
                    "id": examples[index]["id"], "loss": float(loss.detach().cpu()), "gradient_norm": norm}) + "\n")
                stream.flush()
                save()
                del ids, labels, loss
        require(report["optimizer_steps_completed"] == 18, "incomplete_training_steps")
        optimizer.zero_grad(set_to_none=True)
        del optimizer
        require(all(torch.isfinite(p).all().item() for _, p in trainable), "non_finite_trained_adapter")
        model.save_pretrained(output / "adapter", safe_serialization=True)
        report.update(stage="ADAPTER_SAVED_BEFORE_GENERATION", adapter_sha256=runner.adapter_hashes(output / "adapter"))
        save()
        archive(output, runner)
        del trainable, model
        gc.collect()
        torch.cuda.empty_cache()
        model, tensor_stats = runner.load_saved_adapter(output / "adapter", report["adapter_sha256"])
        require(len(tensor_stats) == 32 and all(t["finite"] for t in tensor_stats), "reload_tensor_validation_failed")
        report.update(stage="NON_TRAINABLE_RELOAD", reloaded_adapter_tensors=tensor_stats)
        runner.measure_nll(model, examples, encoded, output / "after_nll.jsonl")
        with (output / "after_fit.jsonl").open("x", encoding="utf-8") as stream:
            for example in examples:
                report["generation_calls_started"] += 1
                save()
                temporary = output / "one_fit.jsonl"
                runner.evaluate(model, tokenizer, [{"case_id": example["id"], "messages": example["messages"][:-1]}],
                    temporary, plan, adapter_revision=report["adapter_sha256"]["adapter_model.safetensors"])
                result = runner.read_jsonl(temporary)
                require(len(result) == 1, "one_fit_generation_required")
                stream.write(json.dumps(result[0], ensure_ascii=False, allow_nan=False) + "\n")
                stream.flush()
                report["new_generations"] += 1
                temporary.unlink()
                save()
        require(report["generation_calls_started"] == report["new_generations"] == 9, "fit_call_budget_mismatch")
        require(runner.adapter_hashes(initial) == old_adapter, "initial_adapter_modified")
        require(runner.adapter_hashes(output / "adapter") == report["adapter_sha256"], "new_adapter_changed_during_evaluation")
        require(all(sha(legacy / name) == value for name, value in old_data.items()), "legacy_helper_modified")
        validate_data(directory, legacy, plan, runner)
        report.update(status="FIT18_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED", seconds=time.monotonic() - started,
            initial_adapter_unchanged=True, legacy_helpers_unchanged=True, saved_adapter_unchanged_during_inference=True,
            peak_allocated_gib=torch.cuda.max_memory_allocated() / 2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved() / 2**30)
        save()
        archive(output, runner)
        print(json.dumps({key: report[key] for key in ("status", "optimizer_steps_completed", "new_generations", "seconds")}))
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error_type=type(exc).__name__,
            error_code=str(exc) if isinstance(exc, ValueError) else None, seconds=time.monotonic() - started)
        save()
        archive(output, runner)
        raise
    finally:
        signal.alarm(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--legacy-pack", type=Path, required=True)
    parser.add_argument("--initial-adapter", type=Path, required=True)
    parser.add_argument("--source-commit", required=True)
    parser.add_argument("--validate-only", action="store_true")
    main(parser.parse_args())
