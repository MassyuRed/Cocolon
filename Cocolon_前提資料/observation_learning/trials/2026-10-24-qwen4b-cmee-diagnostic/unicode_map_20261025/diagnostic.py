"""One inference-only comparison on the existing Pod; no training or retry."""
from pathlib import Path
import json
import os
import signal
import sys
import tarfile
import time

d = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(d))
import run_pilot as r


def deadline(*_):
    raise TimeoutError("unicode_inference_process_deadline")


def main():
    p = r.strict_json((d / "unicode_check/plan.json").read_text())
    assert p["status"] == "AUTHORIZED_ONCE_CURRENT_MASH_CONTINUATION"
    assert p["inference_authorized"] is True and p["training_authorized"] is False
    assert p["max_seconds"] == 900 and p["max_new_tokens"] == 2048
    assert p["context_tokens"] == 8192 and not p["retry"] and not p["automatic_pod_stop"]
    assert p["case_ids"] == ["FIT-FT-CHAIR-INITIAL", "FIT-FT-CHAIR-AFTER-CORRECTION"]
    assert p["input_tokens"] == [1995, 5018]
    assert os.environ["HF_HUB_OFFLINE"] == os.environ["TRANSFORMERS_OFFLINE"] == "1"
    source = (d / "SOURCE_COMMIT").read_text().strip()
    assert source == os.environ["COCOLON_SOURCE_COMMIT"] and len(source) == 40
    assert r.digest(d / "dataset_manifest.json") == p["dataset_manifest_sha256"]
    assert r.strict_json((d / "dataset_manifest.json").read_text())["cmee_api_commit"] == p["api_commit"]
    # Exclusive marker: failure or interruption never silently resubmits.
    with (d / "unicode_attempt.json").open("x") as stream:
        json.dump({"source_commit": source, "plan_sha256": r.digest(d / "unicode_check/plan.json")}, stream)
    plan = r.strict_json((d / "execution_plan.json").read_text())
    plan.update(status="AUTHORIZED_INFERENCE_ONLY_CURRENT_MASH_CONTINUATION",
        evaluation_case_ids=p["case_ids"], max_seconds=p["max_seconds"],
        context_tokens=p["context_tokens"], max_new_tokens=p["max_new_tokens"],
        gpu_hourly_usd=p["gpu_hourly_usd"], inference_only=True,
        gpu_run_authorized=False, automatic_pod_stop=False,
        limits="Inference only; no optimizer, update, retry or Pod lifecycle effects. Original training plan remains closed.")
    r.write_json(d / "execution_plan.json", plan)
    report = dict(status="STARTED", cocolon_commit=source, api_commit=p["api_commit"],
        actual_inference_plan=p, training_updates=0, optimizer_created=False,
        model_calls=0, pod_stopped=False, baseline="continued_fit32_20261025/after.jsonl; different messages, same saved adapter")
    started = time.monotonic()
    signal.signal(signal.SIGALRM, deadline)
    signal.signal(signal.SIGTERM, deadline)
    signal.alarm(p["max_seconds"])
    try:
        import torch
        assert torch.cuda.device_count() == 1
        free, total = torch.cuda.mem_get_info()
        assert "A4500" in torch.cuda.get_device_name(0) and free >= 14 * 2**30
        torch.manual_seed(p["seed"])
        torch.cuda.manual_seed_all(p["seed"])
        tokenizer, _, _, cases, preflight = r.prepare(d)
        assert [x["input_tokens"] for x in preflight["generation_inputs"]] == p["input_tokens"]
        adapter = Path(p["adapter_directory"])
        hashes = r.adapter_hashes(adapter)
        assert hashes["adapter_model.safetensors"] == p["adapter_sha256"]
        torch.cuda.reset_peak_memory_stats()
        model, stats = r.load_saved_adapter(adapter, hashes)
        report.update(adapter_sha256=hashes, adapter_tensors=stats,
            trainable_parameters=sum(x.numel() for x in model.parameters() if x.requires_grad),
            gpu=dict(name=torch.cuda.get_device_name(0), free_before=free, total=total))
        r.write_json(d / "inference_report.json", report)
        # On interruption the runner may have started a call without a raw row.
        report["model_calls"] = None
        r.evaluate(model, tokenizer, cases, d / "raw.jsonl", plan,
                   adapter_revision=hashes["adapter_model.safetensors"])
        rows = r.read_jsonl(d / "raw.jsonl")
        assert len(rows) == 2 and r.adapter_hashes(adapter) == hashes
        report.update(status="COMPLETE_NOT_QUALITY_ACCEPTED", model_calls=len(rows),
            adapter_files_unchanged=True, raw_file_sha256=r.digest(d / "raw.jsonl"),
            results=[{k: row[k] for k in ("case_id", "finish_reason", "input_tokens",
                "output_tokens", "parse_error", "raw_utf8_sha256")} for row in rows],
            peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,
            peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30)
    except BaseException as exc:
        report.update(status="FAILED_NO_RETRY", error=repr(exc))
        raise
    finally:
        signal.alarm(0)
        report["completed_raw_rows"] = 0
        if (d / "raw.jsonl").exists():
            for line in (d / "raw.jsonl").read_text().splitlines():
                try:
                    r.strict_json(line)
                except (ValueError, TypeError):
                    report["incomplete_raw_row"] = True
                else:
                    report["completed_raw_rows"] += 1
        report["seconds"] = time.monotonic() - started
        r.write_json(d / "inference_report.json", report)
        names = ["SOURCE_COMMIT", "dataset_manifest.json", "sft_examples.jsonl", "train_messages.jsonl",
            "execution_plan.json", "preflight.json", "unicode_attempt.json", "raw.jsonl",
            "inference_report.json", "run_pilot.py", "unicode_check/diagnostic.py", "unicode_check/plan.json"]
        files = [name for name in names if (d / name).is_file()]
        r.write_json(d / "unicode_file_manifest.json", {name: {"sha256": r.digest(d/name),
            "bytes": (d/name).stat().st_size} for name in files})
        archive = d / "cocolon_4b_unicode_result_20261025.tar.gz"
        with tarfile.open(archive, "x:gz") as tar:
            for name in files + ["unicode_file_manifest.json"]:
                tar.add(d / name, arcname=name, recursive=False)
        print(json.dumps({k: report.get(k) for k in ("status", "seconds", "model_calls",
            "results", "adapter_files_unchanged")}, ensure_ascii=False), flush=True)
        print("ARCHIVE_SHA256", r.digest(archive), flush=True)


if __name__ == "__main__":
    main()
