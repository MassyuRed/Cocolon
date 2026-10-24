#!/usr/bin/env python3
"""Separate explicitly authorized saved-adapter inference; never trains."""
import argparse
import json
from pathlib import Path
import signal
import time

from run_pilot import (MODEL, REVISION, PROFILE, adapter_hashes, digest, gpu_profile, load_saved_adapter,
                       measure_nll, prepare, strict_json, validate_plan, write_json)


def diagnose(directory, run_directory):
    plan = validate_plan(strict_json((directory / "execution_plan.json").read_text()), paid_run=True)
    if plan.get("additional_diagnostic_authorized") is not True:
        raise ValueError("additional_diagnostic_not_authorized: 通常runは保存reload後のafterを既に含みます")
    if run_directory.resolve().parent != directory.resolve() / "results":
        raise ValueError("run_directory_invalid")
    report = strict_json((run_directory / "run.json").read_text())
    if (report.get("model"), report.get("revision"), report.get("semantic_profile")) != (MODEL, REVISION, PROFILE):
        raise ValueError("saved_run_identity_mismatch")
    tokenizer, encoded, examples, cases, preflight = prepare(directory)
    if (report["preflight"]["runner_sha256"] != digest(directory / "run_pilot.py")
            or report["preflight"]["data_sha256"] != preflight["data_sha256"]
            or report["dataset_manifest_sha256"] != digest(directory / "dataset_manifest.json")):
        raise ValueError("saved_run_source_or_dataset_changed")
    adapter = run_directory / "adapter"
    hashes = adapter_hashes(adapter)
    if hashes != report.get("adapter_sha256"):
        raise ValueError("saved_adapter_binding_mismatch")
    import torch
    gpu = gpu_profile(torch, plan)
    path = run_directory / "reload_diagnostic.json"
    if path.exists() or (run_directory / "reload_nll.jsonl").exists():
        raise ValueError("diagnostic_already_attempted_no_automatic_retry")
    write_json(path, {"status": "STARTED", "started_unix": time.time(), "adapter_sha256": hashes, "extra_training_performed": False})
    signal.alarm(int(plan["max_seconds"]))
    try:
        model, tensors = load_saved_adapter(adapter, hashes)
        rows = measure_nll(model, examples, encoded, run_directory / "reload_nll.jsonl")
        if adapter_hashes(adapter) != hashes:
            raise ValueError("adapter_changed_during_diagnostic")
        result = {"status": "RELOAD_DIAGNOSTIC_COMPLETE_NOT_QUALITY_ACCEPTED", "model": MODEL, "revision": REVISION,
            "gpu": gpu, "run_id": report["run_id"], "adapter_sha256": hashes, "adapter_files_unchanged": True,
            "loaded_adapter_tensors": tensors, "teacher_nll": rows, "extra_training_performed": False,
            "additional_generation_requests": 0, "finished_unix": time.time()}
        write_json(path, result)
        return result
    finally:
        signal.alarm(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--run-directory", type=Path, required=True)
    args = parser.parse_args()
    def terminated(signum, frame):
        raise TimeoutError("diagnostic_deadline_or_termination")
    signal.signal(signal.SIGTERM, terminated)
    signal.signal(signal.SIGALRM, terminated)
    print(json.dumps(diagnose(args.directory.resolve(), args.run_directory.resolve()), ensure_ascii=False, indent=2))
