#!/usr/bin/env python3
"""One evidence-table/reference continuation; no raw repair or GPU lifecycle."""
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
import time

sys.dont_write_bytecode = True
INITIAL = "adae463befe9c465fa6d3a465b29bdc66dafcf41f75328277aa90e2149eddf3d"
PARENT_RUNNER = "964a4703570cb7b0a6e72338d7e8ecad914086bb7b2219f81d0868ca281f54df"
LEGACY_RUNNER = "2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"
MANIFEST = "b7299cd182628e0f3547b3eb23f5339c7f5049348b446792876c802d2ae1d107"
EXAMPLES = "4a5ecf184e6a40315b44ae82cf6ec6f6f6168545bef45bbda8634938a894d6e7"
MESSAGES = "fa340592b8b208bca91ce83a3623dcc6b7f96e02b2ccdf9cca0c00e7cf0fcf50"
API = "95d00b907f6d9c42944666269acc457c9af34f37"
OUTPUT = Path("/workspace/cocolon_4b_evidence_end_fit6_20261025")


def require(condition, code):
    if not condition:
        raise ValueError(code)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def evidence_learning_ranges(text):
    """Parse the actual evidence table and every candidate evidence-index array."""
    def unique(pairs):
        result = {}
        for key, value in pairs:
            require(key not in result, "duplicate_json_key")
            result[key] = value
        return result
    def invalid(_value):
        raise ValueError("non_finite_json")
    decoder = json.JSONDecoder(object_pairs_hook=unique, parse_constant=invalid)
    def whitespace(index):
        while index < len(text) and text[index] in " \t\r\n":
            index += 1
        return index
    start = whitespace(0)
    packet, stop = decoder.raw_decode(text, start)
    require(whitespace(stop) == len(text) and type(packet) is dict
            and set(packet) == {"candidate", "evidence"}, "closed_candidate_evidence_json_required")
    evidence, selected = packet["evidence"], []
    require(type(evidence) is list and evidence and type(packet["candidate"]) is dict,
            "nonempty_evidence_and_candidate_required")
    def walk(begin, path, expected):
        value, end = decoder.raw_decode(text, begin)
        require(value == expected, "json_position_value_mismatch")
        if path == ("evidence",):
            selected.append({"path": list(path), "kind": "evidence_table", "char_start": begin, "char_end": end,
                "value_sha256": hashlib.sha256(text[begin:end].encode()).hexdigest(), "evidence_row_count": len(evidence)})
        elif path and path[0] == "candidate" and path[-1] == "evidence_indexes":
            require(type(value) is list and all(type(i) is int and 0 <= i < len(evidence) for i in value),
                    "candidate_evidence_indexes_out_of_bounds")
            selected.append({"path": list(path), "kind": "candidate_evidence_indexes", "char_start": begin,
                "char_end": end, "expected_values": value})
        if type(value) is dict:
            cursor = whitespace(begin + 1)
            for index, (key, child) in enumerate(value.items()):
                actual_key, key_end = decoder.raw_decode(text, cursor)
                require(actual_key == key, "json_object_key_position_mismatch")
                cursor = whitespace(key_end)
                require(text[cursor:cursor + 1] == ":", "json_member_colon_required")
                cursor = walk(whitespace(cursor + 1), (*path, key), child)
                cursor = whitespace(cursor)
                require(text[cursor:cursor + 1] == ("}" if index == len(value) - 1 else ","), "json_object_separator_mismatch")
                cursor = whitespace(cursor + 1)
        elif type(value) is list:
            cursor = whitespace(begin + 1)
            for index, child in enumerate(value):
                cursor = whitespace(walk(cursor, (*path, index), child))
                require(text[cursor:cursor + 1] == ("]" if index == len(value) - 1 else ","), "json_array_separator_mismatch")
                cursor = whitespace(cursor + 1)
        return end
    walk(start, (), packet)
    def count_indexes(value):
        if type(value) is dict:
            return sum((key == "evidence_indexes") + count_indexes(child) for key, child in value.items())
        return sum(count_indexes(child) for child in value) if type(value) is list else 0
    count = count_indexes(packet["candidate"])
    require(sum(s["kind"] == "evidence_table" for s in selected) == 1
            and sum(s["kind"] == "candidate_evidence_indexes" for s in selected) == count and count > 0,
            "selected_evidence_array_count_mismatch")
    return selected


def select_evidence_tokens(full, prefix, text_ids, offsets, text):
    """Cover complete JSON value spans; crossing token fragments are syntax only."""
    require(full[prefix:prefix + len(text_ids)] == text_ids and len(text_ids) == len(offsets),
            "assistant_token_prefix_or_offsets_mismatch")
    ranges, selected, boundary_syntax = evidence_learning_ranges(text), set(), []
    syntax = set('{}[],:" \t\r\n')
    labels = [-100] * len(full)
    for row in ranges:
        a, b = row["char_start"], row["char_end"]
        indexes = [i for i, (s, e) in enumerate(offsets) if e > a and s < b]
        require(indexes and indexes == list(range(indexes[0], indexes[-1] + 1)), "evidence_value_tokens_not_contiguous")
        covered = a
        for i in indexes:
            s, e = offsets[i]
            require(0 <= s < e <= len(text) and s <= covered, "evidence_token_offset_has_gap")
            extra = text[s:a] if s < a else ""
            extra += text[b:e] if e > b else ""
            require(set(extra) <= syntax, "token_boundary_would_supervise_unselected_semantic_value")
            if extra:
                boundary_syntax.append({"assistant_token_index": i, "offset": [s, e], "extra_syntax": extra,
                    "selected_path": row["path"]})
            covered = max(covered, e)
            selected.add(prefix + i)
            labels[prefix + i] = full[prefix + i]
        require(covered >= b, "evidence_value_token_range_not_complete")
        row["assistant_token_indexes"] = indexes
        row["token_ids"] = [text_ids[i] for i in indexes]
    require(selected and all(label == (full[i] if i in selected else -100) for i, label in enumerate(labels)),
            "unselected_token_received_loss")
    require(labels[:prefix] == [-100] * prefix
            and labels[prefix + len(text_ids):] == [-100] * (len(full) - prefix - len(text_ids)),
            "prompt_or_eos_received_loss")
    start = min(selected) - 1
    require(start >= prefix - 1, "evidence_loss_predecessor_missing")
    return {"input_ids": full, "labels": labels, "loss_start": start,
        "logits_positions": len(full) - start, "selected_evidence_tokens": len(selected),
        "evidence_row_count": next(r["evidence_row_count"] for r in ranges if r["kind"] == "evidence_table"),
        "candidate_reference_array_count": sum(r["kind"] == "candidate_evidence_indexes" for r in ranges),
        "selected_ranges": ranges, "boundary_syntax_rounding": boundary_syntax,
        "prompt_tokens": prefix, "full_context_tokens": len(full),
        "outside_evidence_and_candidate_index_values_only_boundary_syntax_allowed": True,
        "prompt_body_other_candidate_values_and_eos_labels_ignored": True}


def validate_plan(plan):
    fixed = {"schema": "cocolon.4b_evidence_table_reference_fit6.v1", "api_commit": API,
        "model": "Qwen/Qwen3.5-4B", "revision": "851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a",
        "semantic_profile": "emlis_model_proposal.v1", "initial_adapter_sha256": INITIAL,
        "legacy_run_pilot_sha256": LEGACY_RUNNER, "parent_fit_runner_sha256": PARENT_RUNNER,
        "dataset_manifest_sha256": MANIFEST, "training_examples_sha256": EXAMPLES,
        "training_messages_sha256": MESSAGES, "training_rows": 6, "passes": 1,
        "max_optimizer_steps": 6, "learning_rate": 5e-5, "weight_decay": 0, "clip_norm": 1,
        "seed": 20261024, "batch_size": 1, "gradient_accumulation": 1, "optimizer": "AdamW",
        "loss_scope": "ACTUAL_EVIDENCE_TABLE_AND_CANDIDATE_EVIDENCE_REFERENCES", "new_optimizer": True,
        "strict_optimizer_resume": False, "max_seconds": 1800, "gpu_hourly_usd": .26,
        "max_process_usd": .13, "minimum_free_gib": 14, "context_tokens": 8192,
        "max_input_tokens": 5632, "max_new_tokens": 2560, "before_generations": 0,
        "fit_generations": 6, "service_eval_generations": 0, "retry": False,
        "automatic_pod_stop": False, "output_directory": str(OUTPUT)}
    for key, value in fixed.items():
        require(type(plan.get(key)) is type(value) and plan[key] == value, "fixed_plan_mismatch:" + key)
    require(type(plan.get("runner_sha256")) is str and re.fullmatch(r"[0-9a-f]{64}", plan["runner_sha256"]),
            "root_must_freeze_runner_hash")
    require(plan.get("status") == "AUTHORIZED_ONCE_CURRENT_MASH_CONTINUATION"
            and plan.get("gpu_run_authorized") is True, "new_plan_not_authorized")
    require(plan["max_seconds"] * plan["gpu_hourly_usd"] / 3600 <= plan["max_process_usd"], "process_budget_exceeded")
    return plan


def timeout(*_):
    raise TimeoutError("evidence_table_reference_fit6_process_deadline")


def main(args):
    directory, parent, legacy, initial = args.directory.resolve(), args.parent_pack.resolve(), args.legacy_pack.resolve(), args.initial_adapter.resolve()
    require(sha(parent / "run_service_binding_fit.py") == PARENT_RUNNER
            and sha(legacy / "run_pilot.py") == LEGACY_RUNNER, "frozen_runner_changed")
    sys.path[:0] = [str(parent), str(legacy)]
    import run_service_binding_fit as shared
    import run_pilot as runner
    plan = validate_plan(runner.strict_json((directory / "plan.json").read_text()))
    require(sha(__file__) == plan["runner_sha256"], "end_runner_changed")
    require(re.fullmatch(r"[0-9a-f]{40}", args.source_commit), "fixed_source_commit_required")
    examples, manifest, old_data = shared.validate_data(parent, legacy, plan, runner)
    old_adapter = runner.adapter_hashes(initial)
    require(old_adapter["adapter_model.safetensors"] == INITIAL, "initial_adapter_changed")
    versions = {name: importlib.metadata.version(name) for name in runner.PINS}
    require(versions == runner.PINS, "runtime_version_mismatch")
    require(os.environ.get("HF_HUB_OFFLINE") == os.environ.get("TRANSFORMERS_OFFLINE") == "1", "offline_cache_required")
    if args.validate_only:
        print(json.dumps({"status": "VALIDATED_WITHOUT_MODEL_OR_GPU", "updates": 6, "fit_generations": 6}))
        return
    require(not OUTPUT.exists(), "output_already_exists_no_retry")
    OUTPUT.mkdir()
    started = time.monotonic()
    report = {"schema": "cocolon.4b_evidence_table_reference_fit6_result.v1", "status": "STARTED",
        "source_commit": args.source_commit, "api_commit": API, "plan": plan,
        "runner_sha256": sha(__file__), "initial_adapter_sha256": old_adapter,
        "dataset_manifest_sha256": MANIFEST, "runtime_versions": versions,
        "optimizer_steps_completed": 0, "generation_calls_started": 0, "new_generations": 0,
        "new_optimizer": True, "strict_optimizer_resume": False, "before_generations": 0,
        "service_eval_read_or_called": False, "raw_repair": False, "teacher_changed": False,
        "independent_stories": 1, "identity_pairs": 3, "unique_stages": 2,
        "product_accepted": False, "automatic_progression": False, "retry": False,
        "gpu_stop_restart_delete_operations": 0}
    for name in ["dataset_manifest.json", *sorted(shared.FILES)]:
        (OUTPUT / name).write_bytes((parent / name).read_bytes())
    for source, name in [(directory / "plan.json", "plan.json"), (Path(__file__), "runner_source.py"),
                         (parent / "run_service_binding_fit.py", "parent_fit_runner_source.py"),
                         (legacy / "run_pilot.py", "legacy_run_pilot.py")]:
        (OUTPUT / name).write_bytes(source.read_bytes())
    (OUTPUT / "SOURCE_COMMIT").write_text(args.source_commit + "\n")
    runner.write_json(OUTPUT / "attempt.json", {"source_commit": args.source_commit, "retry": False,
        "started_unix": time.time(), "optimizer_steps_max": 6, "new_generation_calls_max": 6})
    def save():
        runner.write_json(OUTPUT / "run.json", report)
    save()
    signal.signal(signal.SIGALRM, timeout)
    signal.signal(signal.SIGTERM, timeout)
    signal.alarm(1800)
    try:
        import torch
        from transformers import AutoTokenizer
        from peft import PeftModel
        require(torch.cuda.device_count() == 1, "one_existing_gpu_required")
        report["gpu"] = runner.gpu_profile(torch, plan)
        require("A4500" in report["gpu"]["name"], "existing_a4500_only")
        random.seed(runner.SEED)
        torch.manual_seed(runner.SEED)
        torch.cuda.manual_seed_all(runner.SEED)
        torch.cuda.reset_peak_memory_stats()
        tokenizer = AutoTokenizer.from_pretrained(runner.MODEL, revision=runner.REVISION,
            local_files_only=True, trust_remote_code=False)
        items = []
        for example in examples:
            encoded, prefix = runner.encode_training(tokenizer, example["messages"], context=8192)
            require(prefix <= 5632 and prefix + 2560 <= 8192
                    and len(encoded["input_ids"]) - prefix <= 2560, "complete_target_or_context_budget_exceeded")
            text = example["messages"][-1]["content"].strip()
            mapped = tokenizer(text, add_special_tokens=False, return_offsets_mapping=True)
            item = select_evidence_tokens(encoded["input_ids"], prefix, mapped["input_ids"], mapped["offset_mapping"], text)
            require(item["evidence_row_count"] == (12 if example["stage"] == "CORRECTION" else 6), "unexpected_evidence_row_count")
            items.append(item)
        report["token_masks"] = [{"id": e["id"], **{key: value for key, value in item.items()
            if key not in {"input_ids", "labels"}}} for e, item in zip(examples, items, strict=True)]
        order = list(range(6))
        random.Random(runner.SEED).shuffle(order)
        report["training_order"] = [examples[i]["id"] for i in order]
        save()
        config = runner.strict_json((initial / "adapter_config.json").read_text())
        require(config.get("base_model_name_or_path") == runner.MODEL
                and set(config.get("target_modules", [])) == runner.EXPECTED_TARGETS
                and config.get("r") == 8 and config.get("lora_alpha") == 16
                and config.get("lora_dropout") == 0 and config.get("bias") == "none", "adapter_configuration_changed")
        model = PeftModel.from_pretrained(runner.load_base(), initial, is_trainable=True, local_files_only=True)
        trainable = [(name, p) for name, p in model.named_parameters() if p.requires_grad]
        require(len(trainable) == 32 and all("lora_" in name and ".self_attn." in name for name, _ in trainable)
                and all(torch.isfinite(p).all().item() for _, p in trainable), "trainable_lora_tensors_invalid")
        report["trainable_parameters"] = [{"name": name, "shape": list(p.shape), "dtype": str(p.dtype)} for name, p in trainable]
        def loss(item):
            ids = torch.tensor([item["input_ids"]], dtype=torch.long, device="cuda:0")
            labels = torch.tensor([item["labels"]], dtype=torch.long, device="cuda:0")
            require(int((labels != -100).sum()) == item["selected_evidence_tokens"], "evidence_mask_count_changed")
            return model(input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels[:, item["loss_start"]:],
                logits_to_keep=item["logits_positions"], use_cache=False).loss
        def measure(name):
            model.eval()
            rows = []
            with torch.inference_mode():
                for example, item in zip(examples, items, strict=True):
                    value = float(loss(item).detach().cpu())
                    require(math.isfinite(value), "non_finite_selected_evidence_nll")
                    rows.append({"id": example["id"], "selected_evidence_loss_tokens": item["selected_evidence_tokens"], "nll": value})
            runner.write_json(OUTPUT / name, rows)
        measure("before_selected_evidence_nll.json")
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([p for _, p in trainable], lr=5e-5, weight_decay=0.)
        with (OUTPUT / "training.jsonl").open("x", encoding="utf-8") as stream:
            for step, index in enumerate(order, 1):
                optimizer.zero_grad(set_to_none=True)
                value = loss(items[index])
                require(torch.isfinite(value).item(), "non_finite_selected_evidence_training_loss")
                value.backward()
                norm = float(torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1., error_if_nonfinite=True).cpu())
                require(math.isfinite(norm) and norm > 0, "non_finite_or_zero_gradient")
                optimizer.step()
                report["optimizer_steps_completed"] = step
                stream.write(json.dumps({"step": step, "id": examples[index]["id"],
                    "loss": float(value.detach().cpu()), "gradient_norm": norm}) + "\n")
                stream.flush()
                save()
                del value
        require(report["optimizer_steps_completed"] == 6, "incomplete_update_count")
        optimizer.zero_grad(set_to_none=True)
        del optimizer
        require(all(torch.isfinite(p).all().item() for _, p in trainable), "non_finite_trained_adapter")
        model.save_pretrained(OUTPUT / "adapter", safe_serialization=True)
        report.update(stage="ADAPTER_SAVED_BEFORE_GENERATION", adapter_sha256=runner.adapter_hashes(OUTPUT / "adapter"))
        save()
        shared.archive(OUTPUT, runner)
        del model, trainable
        gc.collect()
        torch.cuda.empty_cache()
        model, stats = runner.load_saved_adapter(OUTPUT / "adapter", report["adapter_sha256"])
        require(len(stats) == 32 and all(t["finite"] for t in stats), "reloaded_tensor_validation_failed")
        report.update(stage="NON_TRAINABLE_RELOAD", reloaded_adapter_tensors=stats)
        measure("after_selected_evidence_nll.json")
        with (OUTPUT / "after_fit.jsonl").open("x", encoding="utf-8") as stream:
            for example in examples:
                report["generation_calls_started"] += 1
                save()
                temporary = OUTPUT / "one_fit.jsonl"
                runner.evaluate(model, tokenizer, [{"case_id": example["id"], "messages": example["messages"][:-1]}],
                    temporary, plan, adapter_revision=report["adapter_sha256"]["adapter_model.safetensors"])
                result = runner.read_jsonl(temporary)
                require(len(result) == 1, "one_generation_required")
                stream.write(json.dumps(result[0], ensure_ascii=False, allow_nan=False) + "\n")
                stream.flush()
                report["new_generations"] += 1
                temporary.unlink()
                save()
        require(report["generation_calls_started"] == report["new_generations"] == 6, "generation_budget_changed")
        require(runner.adapter_hashes(initial) == old_adapter
                and runner.adapter_hashes(OUTPUT / "adapter") == report["adapter_sha256"], "adapter_files_modified")
        require(all(sha(legacy / name) == digest for name, digest in old_data.items()), "legacy_dataset_changed")
        shared.validate_data(parent, legacy, plan, runner)
        report.update(status="EVIDENCE_TABLE_REF_FIT6_COMPLETE_NOT_SERVICE_OR_PRODUCT_ACCEPTED", seconds=time.monotonic() - started,
            initial_adapter_unchanged=True, teacher_unchanged=True, saved_adapter_unchanged_during_inference=True,
            peak_allocated_gib=torch.cuda.max_memory_allocated() / 2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved() / 2**30)
        save()
        shared.archive(OUTPUT, runner)
        print(json.dumps({key: report[key] for key in ("status", "optimizer_steps_completed", "new_generations", "seconds")}))
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error_type=type(exc).__name__,
            error_code=str(exc) if isinstance(exc, ValueError) else None, seconds=time.monotonic() - started)
        save()
        shared.archive(OUTPUT, runner)
        raise
    finally:
        signal.alarm(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--parent-pack", type=Path, required=True)
    parser.add_argument("--legacy-pack", type=Path, required=True)
    parser.add_argument("--initial-adapter", type=Path, required=True)
    parser.add_argument("--source-commit", required=True)
    parser.add_argument("--validate-only", action="store_true")
    main(parser.parse_args())
