#!/usr/bin/env python3
"""One bounded, offline-app Emlis experiment; prepare never loads model weights."""
import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import random
import re
import signal
import sys
import time
import uuid

MODEL = "Qwen/Qwen3.5-9B"
REVISION = "c202236235762e1c871ad0ccb60c8ee5ba337b9a"
SEED = 20261024
CONTEXT = 2048
MAX_NEW = 1024
DATA_HASHES = {
    "sft_examples.jsonl": "b3115af6a79bb39467517d49f92c94ee7a1019c168f3cf74e078c9960e18bd82",
    "train_messages.jsonl": "533d4d32156a5cbf52512b63aa00d49e58963e725aa4b508b9c532c79700df71",
    "eval_inputs.jsonl": "300f353c9322c66cdfb2a0ad06e955aeb8176f1aa15fa6185fc3ef99b3559a0b",
    "eval_review.jsonl": "3bd7ddcc6c6bbd8a778ba3ff849be96437e823df60bd652f83b85d9c1cd56282",
}
PINS = {"transformers": "5.19.0", "peft": "0.21.2", "accelerate": "1.15.0", "safetensors": "0.8.0"}
TARGET_PATTERN = re.compile(r"model\.language_model\.layers\.\d+\.self_attn\.(q_proj|v_proj)")
EXPECTED_TARGETS = {f"model.language_model.layers.{i}.self_attn.{p}" for i in range(3, 32, 4) for p in ("q_proj", "v_proj")}


def write_json(path, value):
    path = Path(path)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def read_jsonl(path):
    return [json.loads(line) for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip()]


def validate_data(directory):
    for name, expected in DATA_HASHES.items():
        actual = hashlib.sha256((directory / name).read_bytes()).hexdigest()
        if actual != expected:
            raise ValueError(f"教材hash不一致: {name}; 再編集せず固定版を取得してください")
    examples = read_jsonl(directory / "sft_examples.jsonl")
    train = read_jsonl(directory / "train_messages.jsonl")
    evaluation = read_jsonl(directory / "eval_inputs.jsonl")
    review = read_jsonl(directory / "eval_review.jsonl")
    if len(train) != 9 or len(examples) != 9 or len(evaluation) != 6 or len(review) != 6:
        raise ValueError("9教材・6比較問題の件数が一致しません")
    if [x["messages"] for x in train] != [x["messages"] for x in examples]:
        raise ValueError("出典付き教材と学習messagesが一致しません")
    if len({x["id"] for x in examples}) != 9 or len({x["case_id"] for x in evaluation}) != 6:
        raise ValueError("教材IDが重複しています")
    if [x["case_id"] for x in evaluation] != [x["case_id"] for x in review]:
        raise ValueError("比較入力と確認点のIDが一致しません")
    if {x["family"] for x in examples} & {x["family"] for x in evaluation}:
        raise ValueError("教材と比較問題のfamilyが重なっています")
    for item in examples + evaluation:
        messages = item["messages"]
        expected_roles = ["system", "user", "assistant"] if "id" in item else ["system", "user"]
        if [x["role"] for x in messages] != expected_roles:
            raise ValueError("messagesの役割が不正です")
        request = json.loads(messages[1]["content"])
        source = request["source_bundle"]
        if request["tier"] != "free" or source["question_budget_total"] != 1:
            raise ValueError("Freeの対象範囲と一致しません")
        if source.get("history") or source.get("frame"):
            raise ValueError("Free教材に履歴またはframeが混入しています")
        if "id" in item:
            target = json.loads(messages[-1]["content"])
            if source["question_budget_remaining"] == 0 and target["question"] is not None:
                raise ValueError("回答後の問い残数を超過しています")
    return examples, evaluation


def encode_training(tokenizer, messages):
    prompt = tokenizer.apply_chat_template(messages[:-1], tokenize=True, add_generation_prompt=True, enable_thinking=False)
    full = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=False, enable_thinking=False)
    if not prompt or full[:len(prompt)] != prompt:
        raise ValueError("prompt/fullのtoken prefix不一致。学習は開始しません")
    if len(full) <= len(prompt):
        raise ValueError("学習するassistant tokenが空です")
    if len(full) > CONTEXT:
        raise ValueError(f"教材が{CONTEXT} tokenを超過しました: {len(full)}; 切り捨てず中止")
    return {"input_ids": full, "labels": [-100] * len(prompt) + full[len(prompt):]}, len(prompt)


def prepare(directory):
    versions = {name: importlib.metadata.version(name) for name in PINS}
    if versions != PINS:
        raise ValueError(f"固定ライブラリ版と不一致: {versions}")
    import torch
    from transformers import AutoConfig, AutoTokenizer, Qwen3_5ForConditionalGeneration  # import check only
    from peft import LoraConfig, get_peft_model  # import check only
    from huggingface_hub import hf_hub_download
    examples, evaluation = validate_data(directory)
    config = AutoConfig.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
    if config.model_type != "qwen3_5" or "Qwen3_5ForConditionalGeneration" not in config.architectures:
        raise ValueError("固定モデルのarchitectureが一致しません")
    index_path = hf_hub_download(MODEL, "model.safetensors.index.json", revision=REVISION)
    index_bytes = Path(index_path).read_bytes()
    index = json.loads(index_bytes)
    weight_targets = {k[:-len(".weight")] for k in index["weight_map"] if k.endswith(".weight") and TARGET_PATTERN.fullmatch(k[:-len(".weight")])}
    if weight_targets != EXPECTED_TARGETS:
        raise ValueError("固定checkpointのtext q/v 16moduleが一致しません")
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
    encoded, training_stats = [], []
    for example in examples:
        item, prefix = encode_training(tokenizer, example["messages"])
        encoded.append(item)
        training_stats.append({"id": example["id"], "total": len(item["input_ids"]), "prompt": prefix, "loss_tokens": len(item["input_ids"]) - prefix})
    eval_stats = []
    for item in evaluation:
        ids = tokenizer.apply_chat_template(item["messages"], tokenize=True, add_generation_prompt=True, enable_thinking=False)
        if len(ids) + MAX_NEW > CONTEXT:
            raise ValueError(f"{item['case_id']}の入力と出力枠が{CONTEXT} tokenを超えます。切り捨てず中止")
        eval_stats.append({"id": item["case_id"], "prompt": len(ids), "output_limit": MAX_NEW})
    source_file = directory / "SOURCE_COMMIT"
    source_commit = source_file.read_text(encoding="utf-8").strip() if source_file.exists() else None
    report = {"status": "CPU_PREPARED_GPU_NOT_TESTED", "model": MODEL, "revision": REVISION,
              "source_commit": source_commit, "runner_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              "dependencies": versions, "torch": torch.__version__, "cuda_build": torch.version.cuda,
              "data_sha256": DATA_HASHES, "weight_index_sha256": hashlib.sha256(index_bytes).hexdigest(),
              "target_modules": sorted(EXPECTED_TARGETS), "training": training_stats, "evaluation": eval_stats,
              "context": CONTEXT, "silent_truncation": False, "gpu_training_performed": False}
    write_json(directory / "preflight.json", report)
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
    print("準備確認OK（モデル重み・GPU学習はまだ読み込んでいません）", flush=True)
    return tokenizer, encoded, evaluation, report


def parse_output(text):
    try:
        return json.loads(text), None
    except json.JSONDecodeError as exc:
        return None, str(exc)


def evaluate(model, tokenizer, cases, path, device):
    import torch
    from transformers import GenerationConfig
    model.eval()
    model.config.use_cache = True
    eos = model.generation_config.eos_token_id or tokenizer.eos_token_id
    eos_ids = {eos} if isinstance(eos, int) else set(eos)
    pad = tokenizer.pad_token_id if tokenizer.pad_token_id is not None else tokenizer.eos_token_id
    settings = GenerationConfig(do_sample=False, num_beams=1, max_new_tokens=MAX_NEW, eos_token_id=eos, pad_token_id=pad, use_cache=True)
    with Path(path).open("x", encoding="utf-8") as stream:
        for case in cases:
            ids = tokenizer.apply_chat_template(case["messages"], tokenize=True, add_generation_prompt=True, enable_thinking=False)
            batch = torch.tensor([ids], dtype=torch.long, device=device)
            started = time.monotonic()
            with torch.inference_mode():
                generated = model.generate(input_ids=batch, attention_mask=torch.ones_like(batch), generation_config=settings)
            torch.cuda.synchronize()
            new_ids = generated[0, len(ids):].tolist()
            text = tokenizer.decode(new_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)
            parsed, parse_error = parse_output(text)
            ended = bool(new_ids) and new_ids[-1] in eos_ids
            result = {"case_id": case["case_id"], "input_tokens": len(ids), "output_tokens": len(new_ids),
                      "seconds": time.monotonic() - started, "finish_reason_inferred": "eos" if ended else "length_or_other",
                      "hit_output_limit": len(new_ids) >= MAX_NEW and not ended,
                      "raw_text": text, "output_token_ids": new_ids, "parsed": parsed, "parse_error": parse_error}
            stream.write(json.dumps(result, ensure_ascii=False) + "\n")
            stream.flush()
            print(f"{Path(path).stem}: {case['case_id']} 保存 ({len(new_ids)} token)", flush=True)


def run(directory, prepared):
    import torch
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import LoraConfig, get_peft_model
    tokenizer, encoded, cases, preflight = prepared
    if not torch.cuda.is_available() or not torch.cuda.is_bf16_supported():
        raise RuntimeError("BF16対応のCUDA GPUが必要です")
    free, total = torch.cuda.mem_get_info()
    if total < 40 * 2**30 or free < 32 * 2**30:
        raise RuntimeError(f"VRAM不足です (空き{free / 2**30:.1f}GiB/全{total / 2**30:.1f}GiB)。既存vLLM等を勝手には終了しません")
    random.seed(SEED)
    torch.manual_seed(SEED)
    torch.cuda.manual_seed_all(SEED)
    out = directory / "results" / (time.strftime("%Y%m%d-%H%M%S", time.gmtime()) + "-" + uuid.uuid4().hex[:6])
    out.mkdir(parents=True)
    report = {"status": "RUNNING", "model": MODEL, "revision": REVISION, "preflight": preflight,
              "gpu": torch.cuda.get_device_name(0), "seed": SEED, "temperature": 0,
              "thinking": False, "max_new_tokens": MAX_NEW, "started_unix": time.time()}
    def save():
        write_json(out / "run.json", report)
    save()
    print(f"結果保存先: {out}", flush=True)
    try:
        model = Qwen3_5ForConditionalGeneration.from_pretrained(MODEL, revision=REVISION,
                    dtype=torch.bfloat16, device_map={"": 0}, attn_implementation="sdpa", trust_remote_code=False)
        report["stage"] = "baseline"
        save()
        evaluate(model, tokenizer, cases, out / "before.jsonl", "cuda:0")
        for parameter in model.parameters():
            parameter.requires_grad_(False)
        targets = {name for name, module in model.named_modules() if TARGET_PATTERN.fullmatch(name) and isinstance(module, torch.nn.Linear)}
        if targets != EXPECTED_TARGETS:
            raise RuntimeError("実modelのLoRA対象が固定text q/v 16moduleと一致しません")
        config = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.0, bias="none", target_modules=sorted(targets), task_type="CAUSAL_LM")
        model = get_peft_model(model, config)
        trainable = [(name, parameter) for name, parameter in model.named_parameters() if parameter.requires_grad]
        if not trainable or any("lora_" not in name or "language_model.layers." not in name or ".self_attn." not in name for name, _ in trainable):
            raise RuntimeError("text q/v LoRA以外の学習parameterを検出しました")
        model.config.use_cache = False
        model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={"use_reentrant": False})
        model.enable_input_require_grads()
        model.train()
        optimizer = torch.optim.AdamW([parameter for _, parameter in trainable], lr=1e-4, weight_decay=0.0)
        order = list(range(len(encoded)))
        random.Random(SEED).shuffle(order)
        report.update(stage="training", trainable_parameters=sum(p.numel() for _, p in trainable),
                      training_order=order, learning_rate=1e-4, epochs=1, target_modules=sorted(targets))
        save()
        with (out / "training.jsonl").open("x", encoding="utf-8") as log:
            for step, idx in enumerate(order, 1):
                item = encoded[idx]
                input_ids = torch.tensor([item["input_ids"]], dtype=torch.long, device="cuda:0")
                labels = torch.tensor([item["labels"]], dtype=torch.long, device="cuda:0")
                optimizer.zero_grad(set_to_none=True)
                loss = model(input_ids=input_ids, attention_mask=torch.ones_like(input_ids), labels=labels, use_cache=False).loss
                if not torch.isfinite(loss).item():
                    raise RuntimeError("学習lossが非有限です")
                loss.backward()
                torch.nn.utils.clip_grad_norm_([p for _, p in trainable], 1.0)
                optimizer.step()
                value = float(loss.detach().cpu())
                log.write(json.dumps({"step": step, "example_index": idx, "loss": value}) + "\n")
                log.flush()
                print(f"学習 {step}/9 loss={value:.5f}", flush=True)
                del loss, input_ids, labels
        optimizer.zero_grad(set_to_none=True)
        del optimizer
        model.save_pretrained(out / "adapter", safe_serialization=True)
        model.gradient_checkpointing_disable()
        model.disable_input_require_grads()
        torch.cuda.empty_cache()
        report["stage"] = "after"
        save()
        evaluate(model, tokenizer, cases, out / "after.jsonl", "cuda:0")
        report.update(status="EXECUTION_COMPLETE_NOT_QUALITY_ACCEPTED", finished_unix=time.time(),
                      peak_allocated_gib=torch.cuda.max_memory_allocated() / 2**30,
                      adapter_sha256={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in (out / "adapter").iterdir() if p.is_file()})
        save()
        combined = {"run": report, "eval_requests": cases, "before": read_jsonl(out / "before.jsonl"),
                    "after": read_jsonl(out / "after.jsonl"), "training": read_jsonl(out / "training.jsonl")}
        write_json(out / "pilot_results.json", combined)
        write_json(directory / "latest_results.json", combined)
        print(f"試験実行完了。before.jsonl / after.jsonl / training.jsonl / adapter を保存: {out}", flush=True)
        print(f"確認用JSON: {directory / 'latest_results.json'}", flush=True)
        print("品質判定はまだです。RunpodのPodをStopしてください。", flush=True)
    except BaseException as exc:
        report.update(status="STOPPED_OR_FAILED", error_type=type(exc).__name__, error=str(exc)[:1500], finished_unix=time.time())
        save()
        raise


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["prepare", "run"])
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
    def terminated(signum, frame):
        raise TimeoutError("実行時間制限または終了要求により停止しました")
    signal.signal(signal.SIGTERM, terminated)
    prepared = prepare(args.directory)
    if args.mode == "run":
        run(args.directory, prepared)


if __name__ == "__main__":
    main()
