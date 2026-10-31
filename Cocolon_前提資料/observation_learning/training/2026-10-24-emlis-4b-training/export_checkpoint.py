#!/usr/bin/env python3
"""Export one 4B diagnostic, adapter first; excludes base/cache/credentials."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
import time


def export(directory, run_directory, *, allow_missing_adapter=False):
    directory, run_directory = Path(directory).resolve(), Path(run_directory).resolve()
    if run_directory.parent != directory / "results" or run_directory.is_symlink():
        raise ValueError("run_directory_outside_results")
    report = json.loads((run_directory / "run.json").read_text())
    names = {"run_pilot.py", "diagnose_learning.py", "export_checkpoint.py", "verify_cmee.py", "runpod.sh", "dataset_manifest.json",
             "execution_plan.json", "SOURCE_COMMIT", "preflight.json", "run_attempt.json"}
    manifest = json.loads((directory / "dataset_manifest.json").read_text())
    names.update(x["path"] for x in manifest.get("files", {}).values() if type(x) is dict and x.get("path"))
    names = {n for n in names if Path(n).name == n and (directory / n).is_file()}
    names.update(str(p.relative_to(directory)) for p in run_directory.glob("*.json*") if p.is_file())
    adapter_names = ["README.md", "adapter_config.json", "adapter_model.safetensors"]
    has_adapter = all((run_directory / "adapter" / n).is_file() for n in adapter_names)
    if not has_adapter and not allow_missing_adapter:
        raise FileNotFoundError("adapter_three_files_missing_not_backed_up")
    if has_adapter:
        names.update(str((run_directory / "adapter" / n).relative_to(directory)) for n in adapter_names)
    payload = {}
    for name in sorted(names):
        path = directory / name
        if path.is_symlink() or not path.resolve().is_relative_to(directory) or path.stat().st_size > 64 * 1024 * 1024:
            raise ValueError("export_path_or_size_invalid")
        payload[name] = path.read_bytes()
    file_hashes = {n: {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()} for n, data in payload.items()}
    metadata = {"schema": "cocolon.emlis_4b_checkpoint_export.v1", "run_id": report["run_id"],
        "model": report["model"], "revision": report["revision"], "semantic_profile": report["semantic_profile"],
        "adapter_present": has_adapter, "created_unix": time.time(), "files": file_hashes,
        "pod_external_receipt_verified": False, "product_quality_accepted": False}
    payload["checkpoint_manifest.json"] = (json.dumps(metadata, ensure_ascii=False, indent=2) + "\n").encode()
    destination = directory / ("cocolon_4b_checkpoint_" + report["run_id"] + ".tar.gz")
    with tempfile.NamedTemporaryFile(dir=directory, suffix=".tar.gz.tmp", delete=False) as stream:
        tmp = Path(stream.name)
    try:
        with tarfile.open(tmp, "w:gz") as archive:
            for name, data in payload.items():
                info = tarfile.TarInfo(name)
                info.size, info.mode = len(data), 0o600
                archive.addfile(info, io.BytesIO(data))
        with tarfile.open(tmp, "r:gz") as archive:
            if {x.name for x in archive.getmembers()} != set(payload):
                raise ValueError("archive_member_set_mismatch")
            for name, data in payload.items():
                if archive.extractfile(name).read() != data:
                    raise ValueError("archive_readback_mismatch")
        tmp.replace(destination)
    finally:
        tmp.unlink(missing_ok=True)
    sha = hashlib.sha256(destination.read_bytes()).hexdigest()
    destination.with_suffix(destination.suffix + ".sha256").write_text(f"{sha}  {destination.name}\n", encoding="utf-8")
    print(f"退避archive: {destination}\nSHA256: {sha}\nPod外受領確認は別途必要です。", flush=True)
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--run-directory", type=Path, required=True)
    parser.add_argument("--allow-missing-adapter", action="store_true", help="失敗logの退避のみ。重み退避成功とは扱いません")
    args = parser.parse_args()
    export(args.directory, args.run_directory, allow_missing_adapter=args.allow_missing_adapter)
