#!/usr/bin/env python3
"""One baseline comparison: six fixed development inputs, two pinned models, no training."""
import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import time

MODELS = {
    "4b": ("Qwen/Qwen3.5-4B", "851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a"),
    "9b": ("Qwen/Qwen3.5-9B", "c202236235762e1c871ad0ccb60c8ee5ba337b9a"),
}
PINS = {"transformers": "5.19.0", "accelerate": "1.15.0", "safetensors": "0.8.0"}
CONTEXT = 8192
SEED = 20261024
CASES_SHA256 = "e5600b8b8ddb2d6d44ef22e2e03a254c0e447eb9d745bbf4d9098ee947a0a40f"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write_json(path, value):
    data = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode()
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(data)
    tmp.replace(path)
    return sha(data)


def load_cases(directory):
    data = (directory / "cases.jsonl").read_bytes()
    if sha(data) != CASES_SHA256:
        raise ValueError("固定入力のhashが違います")
    cases = [json.loads(line) for line in data.decode().splitlines() if line.strip()]
    expected = ["E02-0", "E02-B", "P01-N", "A02-P1", "FT-CHAIR-AFTER-CORRECTION", "FT-SHOP-AFTER-ANSWER"]
    if [c["case_id"] for c in cases] != expected:
        raise ValueError("比較する6入力が違います")
    for case in cases:
        if [m["role"] for m in case["messages"]] != ["system", "user"]:
            raise ValueError("生成入力へ教師回答や過去の生成物を混ぜません")
        if case["max_new_tokens"] != (3072 if case["case_id"] == "A02-P1" else 1024):
            raise ValueError("case別の出力枠が違います")
    return cases


def token_ids(tokenizer, case):
    ids = tokenizer.apply_chat_template(case["messages"], tokenize=True, add_generation_prompt=True,
            enable_thinking=False, return_dict=False, return_tensors=None, truncation=False)
    if not isinstance(ids, list) or not ids or any(type(x) is not int for x in ids):
        raise ValueError("tokenizerがflatなtoken列を返していません")
    if len(ids) + case["max_new_tokens"] > CONTEXT:
        raise ValueError("入力と出力枠が8192を超えます。切り捨てず中止します")
    return ids


def environment():
    versions = {name: importlib.metadata.version(name) for name in PINS}
    if versions != PINS:
        raise ValueError("固定package版が違います")
    return versions


def prepare(directory):
    from huggingface_hub import hf_hub_download, try_to_load_from_cache
    from transformers import AutoTokenizer
    cases = load_cases(directory)
    report = {"dependencies": environment(), "runner_sha256": sha(Path(__file__).read_bytes()),
              "cases_sha256": CASES_SHA256, "models": {}, "context": CONTEXT,
              "gpu_inference_performed": False, "fine_tuning_performed": False}
    missing = 0
    for key, (name, revision) in MODELS.items():
        config_path = Path(hf_hub_download(name, "config.json", revision=revision))
        config = json.loads(config_path.read_text())
        if config.get("architectures") != ["Qwen3_5ForConditionalGeneration"] or config.get("model_type") != "qwen3_5":
            raise ValueError("固定モデルのarchitectureが違います")
        index_path = Path(hf_hub_download(name, "model.safetensors.index.json", revision=revision))
        index = json.loads(index_path.read_text())
        total = index["metadata"]["total_size"]
        shards = sorted(set(index["weight_map"].values()))
        cached = [try_to_load_from_cache(name, shard, revision=revision) for shard in shards]
        # Conservative: if any shard is missing, reserve space for the whole model.
        uncached = 0 if all(isinstance(p, str) and Path(p).is_file() for p in cached) else total
        missing += uncached
        tokenizer = AutoTokenizer.from_pretrained(name, revision=revision, trust_remote_code=False)
        lengths = [{"id": c["case_id"], "input_tokens": len(token_ids(tokenizer, c)),
                    "max_new_tokens": c["max_new_tokens"]} for c in cases]
        report["models"][key] = {"model": name, "revision": revision, "weight_bytes": total,
                "reserved_uncached_bytes": uncached, "config_sha256": sha(config_path.read_bytes()),
                "index_sha256": sha(index_path.read_bytes()), "token_lengths": lengths}
    cache = Path(os.environ["HF_HOME"])
    cache.mkdir(parents=True, exist_ok=True)
    report["cache_free_bytes"] = shutil.disk_usage(cache).free
    report["required_cache_free_bytes"] = missing + 4 * 2**30
    if report["cache_free_bytes"] < report["required_cache_free_bytes"]:
        raise RuntimeError("model cacheの空き容量が足りません。容量を増やす操作は行いません")
    write_json(directory / "preflight.json", report)
    print("比較準備OK。続けて4Bの6回答、9Bの6回答を取得します。", flush=True)


def infer_model(directory, key):
    import torch
    from transformers import AutoTokenizer, Qwen3_5ForConditionalGeneration
    environment()
    cases = load_cases(directory)
    if not (directory / "attempt.json").is_file():
        raise RuntimeError("runから実行してください")
    with (directory / (key + ".started")).open("x") as stream:
        stream.write(str(time.time()))
    if not torch.cuda.is_available() or not torch.cuda.is_bf16_supported():
        raise RuntimeError("BF16 CUDA GPUが必要です")
    free, total = torch.cuda.mem_get_info()
    if total < 40 * 2**30 or free < 32 * 2**30:
        raise RuntimeError("A40相当の空きVRAMが必要です。既存processは終了しません")
    name, revision = MODELS[key]
    preflight = json.loads((directory / "preflight.json").read_text())
    tokenizer = AutoTokenizer.from_pretrained(name, revision=revision, trust_remote_code=False, local_files_only=True)
    inputs = [token_ids(tokenizer, case) for case in cases]
    torch.manual_seed(SEED)
    torch.cuda.manual_seed_all(SEED)
    torch.cuda.reset_peak_memory_stats()
    model_report = {"status": "LOADING", "model": name, "revision": revision,
            "gpu": torch.cuda.get_device_name(0), "total_vram_bytes": total,
            "dependencies": PINS, "torch": torch.__version__, "cuda_build": torch.version.cuda,
            "dtype": "bfloat16", "attention": "sdpa", "quantization": None,
            "seed": SEED, "thinking": False, "do_sample": False, "context_cap": CONTEXT,
            "concurrency": 1, "warmup_requests": 0, "fine_tuning_performed": False,
            "weight_download_may_be_in_load_time": preflight["models"][key]["reserved_uncached_bytes"] > 0,
            "started_unix": time.time(), "outputs": []}
    output = directory / (key + ".json")
    write_json(output, model_report)
    try:
        started = time.monotonic()
        model = Qwen3_5ForConditionalGeneration.from_pretrained(name, revision=revision,
                dtype=torch.bfloat16, device_map={"": 0}, attn_implementation="sdpa", trust_remote_code=False)
        model.eval()
        for parameter in model.parameters():
            parameter.requires_grad_(False)
        torch.cuda.synchronize()
        model_report.update(status="GENERATING", model_load_seconds=time.monotonic() - started)
        write_json(output, model_report)
        for case, ids in zip(cases, inputs, strict=True):
            tensor = torch.tensor([ids], dtype=torch.long, device="cuda:0")
            torch.cuda.synchronize()
            started = time.monotonic()
            with torch.inference_mode():
                generated = model.generate(input_ids=tensor, attention_mask=torch.ones_like(tensor),
                        do_sample=False, max_new_tokens=case["max_new_tokens"], use_cache=True,
                        pad_token_id=tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id,
                        repetition_penalty=1.0, return_dict_in_generate=False, output_scores=False)
            torch.cuda.synchronize()
            seconds = time.monotonic() - started
            new_ids = generated[0, len(ids):].tolist()
            raw = tokenizer.decode(new_ids, skip_special_tokens=True)
            eos = model.generation_config.eos_token_id
            eos = set(eos if isinstance(eos, list) else [eos]) | {tokenizer.eos_token_id}
            ended = bool(new_ids and new_ids[-1] in eos)
            try:
                parsed = json.loads(raw)
                parse_error = None
            except json.JSONDecodeError as exc:
                parsed, parse_error = None, str(exc)
            row = {"case_id": case["case_id"], "input_tokens": len(ids), "output_tokens": len(new_ids),
                   "generation_seconds": seconds, "first_generated_case": len(model_report["outputs"]) == 0,
                   "max_new_tokens": case["max_new_tokens"], "hit_output_limit": len(new_ids) >= case["max_new_tokens"] and not ended,
                   "eos_reached": ended, "raw_text": raw, "parsed": parsed, "parse_error": parse_error,
                   "input_token_ids": ids, "output_token_ids": new_ids}
            model_report["outputs"].append(row)
            model_report["peak_allocated_bytes"] = torch.cuda.max_memory_allocated()
            model_report["peak_reserved_bytes"] = torch.cuda.max_memory_reserved()
            write_json(output, model_report)
            print(f"{key}: {case['case_id']} {seconds:.2f}秒、保存済み", flush=True)
            del generated, tensor
        model_report.update(status="SIX_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED", finished_unix=time.time())
    except BaseException as exc:
        model_report.update(status="STOPPED_OR_FAILED", error_type=type(exc).__name__, error=str(exc)[:1200], finished_unix=time.time())
        raise
    finally:
        write_json(output, model_report)


def save_combined(directory, status, error=None):
    models = {}
    for key in MODELS:
        path = directory / (key + ".json")
        if path.is_file():
            models[key] = json.loads(path.read_text())
    report = {"schema": "cocolon_9b_4b_baseline_comparison.v1", "status": status,
            "source_commit": (directory / "SOURCE_COMMIT").read_text().strip(),
            "runner_sha256": sha(Path(__file__).read_bytes()), "cases_sha256": CASES_SHA256,
            "cases": load_cases(directory), "preflight": json.loads((directory / "preflight.json").read_text()),
            "attempt": json.loads((directory / "attempt.json").read_text()), "models": models,
            "fine_tuning_performed": False, "cmee_integration_performed": False,
            "production_serving_cost_measured": False, "serverless_cold_start_measured": False,
            "limits": "Six development cases; serial base-model proxy. Not trained-model economics, concurrency, long-history capacity, p95 or product acceptance.",
            "updated_unix": time.time(), "error": error}
    path = directory / "latest_selection.json"
    digest = write_json(path, report)
    (directory / "latest_selection.json.sha256").write_text(f"{digest}  latest_selection.json\n")


def run(directory):
    load_cases(directory)
    if not (directory / "preflight.json").is_file():
        raise RuntimeError("prepareが完了していません")
    preflight = json.loads((directory / "preflight.json").read_text())
    if preflight["runner_sha256"] != sha(Path(__file__).read_bytes()):
        raise ValueError("prepare後にrunnerが変わっています")
    if any((directory / (key + ".json")).exists() for key in MODELS):
        raise FileExistsError("前の結果があります。自動再試行しません")
    with (directory / "attempt.json").open("x") as stream:
        json.dump({"started_unix": time.time()}, stream)
    save_combined(directory, "RUNNING")
    try:
        for key in MODELS:
            subprocess.run([sys.executable, str(Path(__file__).resolve()), "_model", "--model", key,
                            "--directory", str(directory)], check=True)
            saved = json.loads((directory / (key + ".json")).read_text())
            expected = [case["case_id"] for case in load_cases(directory)]
            if (saved["status"] != "SIX_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED"
                    or [row["case_id"] for row in saved["outputs"]] != expected
                    or (saved["model"], saved["revision"]) != MODELS[key]
                    or saved["fine_tuning_performed"] is not False):
                raise ValueError("model側の全6回答完了を確認できません")
            save_combined(directory, "RUNNING")
        save_combined(directory, "TWELVE_OUTPUTS_COMPLETE_NOT_QUALITY_ACCEPTED")
    except BaseException as exc:
        save_combined(directory, "STOPPED_OR_FAILED", {"type": type(exc).__name__, "message": str(exc)[:1200]})
        raise


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["prepare", "run", "_model"])
    parser.add_argument("--model", choices=list(MODELS))
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    def terminate(signum, frame):
        raise TimeoutError("比較の実行期限または終了要求で停止しました")
    signal.signal(signal.SIGTERM, terminate)
    directory = args.directory.resolve()
    if args.mode == "prepare":
        prepare(directory)
    elif args.mode == "run":
        run(directory)
    else:
        if args.model is None:
            parser.error("_model requires --model")
        infer_model(directory, args.model)


if __name__ == "__main__":
    main()
