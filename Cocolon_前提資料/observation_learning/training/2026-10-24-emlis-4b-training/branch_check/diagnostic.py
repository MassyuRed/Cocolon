"""Read-only logits at the recorded branch; no generation, optimizer or updates."""
from pathlib import Path
import hashlib
import importlib.metadata
import json
import os
import signal
import sys
import time

ADAPTER = "a8baf0d310283fd0500e86887e64723e4734693ac48b7f2ddfad7cc07e6a3ea6"
RUNNER = "2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d"
MESSAGES = "32cd574649525c1352d870c8f276ed440a2362722e5026fe472254ce3cedea0e"
BASELINE = "670aa754f8ef3f6347a5b72353ab7686111630e8c8f1db0eaa9198a4fd40dd61"


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n")


def timeout(*_):
    raise TimeoutError("branch_check_900_second_deadline")


def main(directory, output):
    started = time.monotonic()
    assert output.is_dir() and output != directory
    with (output / "attempt.json").open("x") as stream:
        json.dump({"started_unix": time.time(), "retry": False}, stream)
    report = dict(status="STARTED", training_updates=0, optimizer_created=False,
        generated_responses=0, forward_calls=0, forward_attempts=0, pod_lifecycle_operations=0,
        baseline_raw_sha256=BASELINE, seed=20261024, max_seconds=900,
        source_commit=(directory / "SOURCE_COMMIT").read_text().strip(),
        script_sha256=sha(__file__), input_prompt_changed=False,
        interpretation="Known FIT diagnostic only; forced scores are not generated responses or CMEE acceptance.")
    signal.signal(signal.SIGALRM, timeout)
    signal.signal(signal.SIGTERM, timeout)
    signal.alarm(900)
    try:
        assert os.environ["HF_HUB_OFFLINE"] == os.environ["TRANSFORMERS_OFFLINE"] == "1"
        assert sha(directory / "run_pilot.py") == RUNNER
        assert sha(directory / "train_messages.jsonl") == MESSAGES
        baseline = directory / "results/20261025-043032-a3fef235/after.jsonl"
        assert sha(baseline) == BASELINE
        sys.path.insert(0, str(directory))
        import run_pilot as r
        assert {k: importlib.metadata.version(k) for k in r.PINS} == r.PINS
        import torch
        from transformers import AutoTokenizer
        assert torch.cuda.device_count() == 1 and "A4500" in torch.cuda.get_device_name(0)
        free, total = torch.cuda.mem_get_info()
        assert free >= 14 * 2**30
        torch.manual_seed(20261024)
        torch.cuda.manual_seed_all(20261024)
        tokenizer = AutoTokenizer.from_pretrained(r.MODEL, revision=r.REVISION,
            trust_remote_code=False, local_files_only=True)
        messages = r.read_jsonl(directory / "train_messages.jsonl")[1]["messages"]
        raw = r.read_jsonl(baseline)[1]
        assert raw["case_id"] == "FIT-FT-CHAIR-AFTER-CORRECTION"
        assert raw["adapter_revision"] == ADAPTER and raw["input_tokens"] == 5018
        prompt = r.chat_token_ids(tokenizer, messages[:-1], generation_prompt=True)
        full = r.chat_token_ids(tokenizer, messages, generation_prompt=False)
        assert full[:len(prompt)] == prompt and len(prompt) == 5018
        teacher_ids = full[len(prompt):]
        actual_ids = raw["output_token_ids"]
        assert tokenizer.decode(actual_ids, skip_special_tokens=True,
            clean_up_tokenization_spaces=False) == raw["raw_text"]
        k = next(i for i, (a, b) in enumerate(zip(actual_ids, teacher_ids)) if a != b)
        common = tokenizer.decode(actual_ids[:k], skip_special_tokens=False,
            clean_up_tokenization_spaces=False)
        teacher_text = messages[-1]["content"].strip()
        assert raw["raw_text"].startswith(common) and teacher_text.startswith(common)
        # Reject a mismatch outside the already observed reception sentence.
        assert common.rfind('"reception":"') > common.rfind('"observation":"')
        char_difference = next(i for i, (x, y) in enumerate(zip(raw["raw_text"], teacher_text)) if x != y)
        assert char_difference == 4225 and 4180 < len(common) <= char_difference
        actual_packet = json.loads(raw["raw_text"])
        teacher_packet = json.loads(teacher_text)
        actual_reception = actual_packet["candidate"]["surface_proposal"]["reception"]
        teacher_reception = teacher_packet["candidate"]["surface_proposal"]["reception"]
        a = raw["raw_text"].index('"reception":"') + len('"reception":"')
        b = a + len(actual_reception)
        assert raw["raw_text"][a:b] == actual_reception
        counterfactual = raw["raw_text"][:a] + teacher_reception + raw["raw_text"][b:]
        assert json.loads(counterfactual) == teacher_packet
        report.update(model=r.MODEL, revision=r.REVISION, gpu=torch.cuda.get_device_name(0),
            free_before=free, total_memory=total, prompt_tokens=len(prompt),
            first_differing_output_token=k, shared_prefix_chars=len(common), first_differing_raw_character=char_difference,
            shared_prefix_tail=common[-150:], actual_reception=actual_reception,
            teacher_reception=teacher_reception, raw_matches_teacher_except_reception=True,
            teacher_token_id=teacher_ids[k], actual_token_id=actual_ids[k],
            teacher_token_text=tokenizer.decode([teacher_ids[k]]),
            actual_token_text=tokenizer.decode([actual_ids[k]]))
        adapter = directory / "results/20261025-043032-a3fef235/adapter"
        hashes = r.adapter_hashes(adapter)
        assert hashes["adapter_model.safetensors"] == ADAPTER
        torch.cuda.reset_peak_memory_stats()
        model, stats = r.load_saved_adapter(adapter, hashes)
        assert not any(p.requires_grad for p in model.parameters())
        report.update(adapter_sha256=hashes, adapter_tensors=stats, trainable_parameters=0)
        ids = torch.tensor([prompt + actual_ids[:k]], device="cuda:0")
        report["forward_attempts"] += 1
        write(output / "result.json", report)
        with torch.inference_mode():
            logits = model(input_ids=ids, attention_mask=torch.ones_like(ids),
                logits_to_keep=1, use_cache=False).logits[0, -1].float()
        report["forward_calls"] += 1
        logp = logits.log_softmax(-1)
        def token_info(tid):
            return dict(id=tid, text=tokenizer.decode([tid]), logit=float(logits[tid]),
                log_probability=float(logp[tid]), probability=float(logp[tid].exp()),
                rank=1 + int((logits > logits[tid]).sum()))
        top = torch.topk(logits, 10).indices.tolist()
        report["branch"] = dict(teacher=token_info(teacher_ids[k]), actual=token_info(actual_ids[k]),
            top10=[token_info(tid) for tid in top],
            recomputed_argmax_matches_recorded=top[0] == actual_ids[k],
            top1_top2_logit_margin=float(logits[top[0]] - logits[top[1]]),
            numerical_limit="Full-prefix BF16/SDPA use_cache=False recomputation; original generation used cache.")
        del ids, logits, logp
        # Canonical-tokenized forced scores for the two unchanged sentence alternatives.
        report["forced_reception_scores"] = []
        for name, text, reception in [("recorded_actual", raw["raw_text"], actual_reception),
                                      ("teacher_counterfactual", counterfactual, teacher_reception)]:
            enc = tokenizer(text, add_special_tokens=False, return_offsets_mapping=True)
            token_ids, offsets = enc["input_ids"], enc["offset_mapping"]
            start_char = text.index('"reception":"') + len('"reception":"')
            end_char = start_char + len(reception)
            indexes = [i for i, (s, e) in enumerate(offsets) if e > start_char and s < end_char]
            start, end = indexes[0], indexes[-1] + 1
            assert end - start == len(indexes) and len(prompt) + end <= 8192
            ids = torch.tensor([prompt + token_ids[:end]], device="cuda:0")
            report["forward_attempts"] += 1
            write(output / "result.json", report)
            with torch.inference_mode():
                scores = model(input_ids=ids, attention_mask=torch.ones_like(ids),
                    logits_to_keep=end-start+1, use_cache=False).logits[0, :-1].float().log_softmax(-1)
            report["forward_calls"] += 1
            targets = torch.tensor(token_ids[start:end], device=scores.device)
            losses = -scores.gather(1, targets[:, None]).squeeze(1)
            suffix_indexes = [j for j, i in enumerate(indexes) if offsets[i][1] > char_difference]
            suffix_losses = losses[suffix_indexes]
            report["forced_reception_scores"].append(dict(name=name, tokens=len(indexes),
                mean_nll=float(losses.mean()), sum_nll=float(losses.sum()),
                suffix_tokens=len(suffix_indexes), suffix_mean_nll=float(suffix_losses.mean()),
                suffix_sum_nll=float(suffix_losses.sum()),
                boundary_crossing=offsets[start][0] < start_char or offsets[end-1][1] > end_char,
                canonical_prefix_through_reception_matches_recorded=(token_ids[:end] == actual_ids[:end]) if name == "recorded_actual" else None,
                canonical_full_text_ids_match_recorded=(token_ids == actual_ids[:len(token_ids)]) if name == "recorded_actual" else None,
                token_details=[dict(id=token_ids[i], text=tokenizer.decode([token_ids[i]]),
                    offsets=offsets[i], nll=float(losses[j])) for j, i in enumerate(indexes)]))
            del ids, scores, targets, losses
        assert r.adapter_hashes(adapter) == hashes and sha(baseline) == BASELINE
        report.update(status="DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED", adapter_files_unchanged=True,
            baseline_unchanged=True, peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error=repr(exc))
        raise
    finally:
        signal.alarm(0)
        report["seconds"] = time.monotonic() - started
        write(output / "result.json", report)
        print(json.dumps({k: report.get(k) for k in ["status", "first_differing_output_token",
            "teacher_token_text", "actual_token_text", "branch", "forward_calls", "seconds", "error"]},
            ensure_ascii=False, indent=2), flush=True)
        print("RESULT_SHA256", sha(output / "result.json"), flush=True)


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(__file__).resolve().parent)
