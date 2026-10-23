#!/usr/bin/env python3
"""One inference-only check of the saved pilot adapter against its nine teachers."""
import argparse
import hashlib
import importlib.metadata
import json
import math
import os
from pathlib import Path
import signal
import time
import uuid

from run_pilot import MODEL, REVISION, PINS, SEED, MAX_NEW, EXPECTED_TARGETS, chat_token_ids, encode_training, evaluate, read_jsonl, validate_data, write_json

REFERENCE_SHA256 = "5fb61702d4c5b9e4f1317088b3ef91de53041168fa3313f14086d0c67f09ceb9"
RUNNER_SHA256 = "c0491131cb6fcccadcb94e25d618acd95bcff9b6eeb875403b2d9723ccc613e4"
ADAPTER_HASHES = {
    "README.md": "b24b74667d1eb9c991047b4507c329613ae38707f4450446a94217081af69e96",
    "adapter_model.safetensors": "1115f50162c6f8b67bc162f4e7667b653821229a4a959b21abfdc6ac34a0a6bf",
    "adapter_config.json": "f133d0336298bb13d1a415abdf230783a072b9ae60deb9e127bc6f5dd55be3da",
}


def file_hash(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def locate_saved_run(directory):
    if file_hash(directory / "run_pilot.py") != RUNNER_SHA256:
        raise ValueError("比較元runnerが初回の固定版と異なります。中止します")
    for reference in sorted((directory / "results").glob("*/pilot_results.json")):
        if file_hash(reference) != REFERENCE_SHA256:
            continue
        adapter = reference.parent / "adapter"
        if all((adapter / name).is_file() and file_hash(adapter / name) == sha for name, sha in ADAPTER_HASHES.items()):
            return reference, adapter
    raise FileNotFoundError("初回結果とhash一致するadapter本体がありません。再学習せず、保存先を確認してください")


def teacher_prompts(examples):
    # Expected teacher text is never included in the generation request.
    return [{"case_id": item["id"], "messages": item["messages"][:-1]} for item in examples]


def weighted_nll(rows):
    count = sum(row["loss_tokens"] for row in rows)
    if count <= 0 or any(not math.isfinite(row["nll"]) for row in rows):
        raise ValueError("NLLまたは教師token数が不正です")
    return sum(row["nll"] * row["loss_tokens"] for row in rows) / count


def reuse_cache():
    if not os.environ.get("HF_HOME"):
        for cache in ["/workspace/cocolon9b/hf-cache", "/workspace/hf", "/workspace/hf_cache", "/workspace/.cache/huggingface", "/workspace/hf_home", "/root/.cache/huggingface"]:
            if (Path(cache) / "hub" / "models--Qwen--Qwen3.5-9B" / "snapshots" / REVISION / "config.json").is_file():
                os.environ["HF_HOME"] = cache
                break
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"
    os.environ["TOKENIZERS_PARALLELISM"] = "false"


def measure_nll(model, examples, encoded, path):
    import torch
    model.eval()
    rows = []
    with path.open("x", encoding="utf-8") as stream:
        for example, item in zip(examples, encoded, strict=True):
            ids = torch.tensor([item["input_ids"]], dtype=torch.long, device="cuda:0")
            labels = torch.tensor([item["labels"]], dtype=torch.long, device="cuda:0")
            count = int((labels[:, 1:] != -100).sum().item())
            with torch.inference_mode():
                loss = model(input_ids=ids, attention_mask=torch.ones_like(ids), labels=labels, use_cache=False).loss
            value = float(loss.detach().cpu())
            if not math.isfinite(value) or count <= 0:
                raise ValueError("NLLが非有限、または教師tokenが空です")
            row = {"id": example["id"], "nll": value, "loss_tokens": count}
            rows.append(row)
            stream.write(json.dumps(row) + "\n")
            stream.flush()
            print(f"{path.stem}: {example['id']} NLL={value:.6f}", flush=True)
            del ids, labels, loss
    return rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", type=Path, default=Path("/workspace/cocolon_emlis_free_20261024"))
    args = parser.parse_args()
    directory = args.directory.resolve()
    reference, adapter = locate_saved_run(directory)
    examples, _ = validate_data(directory)
    if {name: importlib.metadata.version(name) for name in PINS} != PINS:
        raise ValueError("初回の固定package版と異なります")
    reuse_cache()
    import torch
    from transformers import AutoTokenizer, Qwen3_5ForConditionalGeneration
    from peft import PeftModel
    if not torch.cuda.is_available() or not torch.cuda.is_bf16_supported():
        raise RuntimeError("BF16対応CUDA GPUが必要です")
    free, total = torch.cuda.mem_get_info()
    if total < 40 * 2**30 or free < 32 * 2**30:
        raise RuntimeError("A40相当の空きVRAMが必要です。既存processは終了しません")
    torch.manual_seed(SEED)
    torch.cuda.manual_seed_all(SEED)
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False, local_files_only=True)
    encoded = [encode_training(tokenizer, item["messages"])[0] for item in examples]
    cases = teacher_prompts(examples)
    for case in cases:
        # Training examples fit 2048 for scoring; generation gets the same 1024 output cap.
        prompt_length = len(chat_token_ids(tokenizer, case["messages"], generation_prompt=True))
        if prompt_length + MAX_NEW > 2048:
            raise ValueError("教師prompt＋出力枠が2048を超えます。切り捨てず中止します")
    out = directory / "diagnostics" / (time.strftime("%Y%m%d-%H%M%S", time.gmtime()) + "-" + uuid.uuid4().hex[:6])
    out.mkdir(parents=True)
    report = {"status": "RUNNING", "scope": "training-example fit only; not generalization or product acceptance",
              "reference": str(reference), "reference_sha256": REFERENCE_SHA256,
              "adapter": str(adapter), "adapter_sha256": ADAPTER_HASHES, "runner_sha256": RUNNER_SHA256,
              "diagnostic_sha256": file_hash(__file__), "model": MODEL, "revision": REVISION,
              "dependencies": PINS, "torch": torch.__version__, "cuda_build": torch.version.cuda,
              "gpu": torch.cuda.get_device_name(0), "started_unix": time.time(),
              "extra_training_performed": False, "seed": SEED, "max_new_tokens": MAX_NEW,
              "thinking": False, "do_sample": False, "prompt_changed": False}
    write_json(out / "run.json", report)
    print(f"診断保存先: {out}", flush=True)
    try:
        model = Qwen3_5ForConditionalGeneration.from_pretrained(MODEL, revision=REVISION, dtype=torch.bfloat16,
                    device_map={"": 0}, attn_implementation="sdpa", trust_remote_code=False, local_files_only=True)
        for parameter in model.parameters():
            parameter.requires_grad_(False)
        before_nll = measure_nll(model, examples, encoded, out / "before_nll.jsonl")
        evaluate(model, tokenizer, cases, out / "before.jsonl", "cuda:0")
        model = PeftModel.from_pretrained(model, adapter, is_trainable=False, local_files_only=True)
        model.eval()
        if any(parameter.requires_grad for parameter in model.parameters()):
            raise RuntimeError("診断中の学習parameterを検出しました")
        if set(model.peft_config["default"].target_modules) != EXPECTED_TARGETS or model.active_adapter != "default":
            raise RuntimeError("adapterの有効化または対象が初回と異なります")
        adapter_stats = [{"name": name, "dtype": str(p.dtype), "finite": bool(torch.isfinite(p).all().item()),
                          "norm": float(p.detach().float().norm().item())} for name, p in model.named_parameters() if "lora_" in name]
        if len(adapter_stats) != 32 or not all(item["finite"] for item in adapter_stats):
            raise RuntimeError("adapter tensor数または値が不正です")
        report["loaded_adapter_tensors"] = adapter_stats
        after_nll = measure_nll(model, examples, encoded, out / "after_nll.jsonl")
        evaluate(model, tokenizer, cases, out / "after.jsonl", "cuda:0")
        report.update(status="DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED", finished_unix=time.time(),
                      before_weighted_nll=weighted_nll(before_nll), after_weighted_nll=weighted_nll(after_nll),
                      adapter_files_unchanged=all(file_hash(adapter / name) == sha for name, sha in ADAPTER_HASHES.items()))
        if not report["adapter_files_unchanged"]:
            raise RuntimeError("元adapterのfileが変化しました")
        combined = {"run": report, "teacher_prompt_requests": cases,
                    "before_nll": before_nll, "after_nll": after_nll,
                    "before": read_jsonl(out / "before.jsonl"), "after": read_jsonl(out / "after.jsonl")}
        write_json(out / "diagnosis_results.json", combined)
        write_json(directory / "latest_diagnosis.json", combined)
        write_json(out / "run.json", report)
        print(f"診断完了: {directory / 'latest_diagnosis.json'}", flush=True)
    except BaseException as exc:
        report.update(status="STOPPED_OR_FAILED", error_type=type(exc).__name__, error=str(exc)[:1500], finished_unix=time.time())
        write_json(out / "run.json", report)
        raise
    finally:
        print("完了・失敗・時間切れのいずれでもRunpodのPodをStopしてください。", flush=True)


def stopped(signum, frame):
    raise TimeoutError("診断を終了します。Podは自動Stopされません")


if __name__ == "__main__":
    signal.signal(signal.SIGTERM, stopped)
    main()
