#!/usr/bin/env python3
"""Export this experiment's small results and adapter files; never the base model/cache."""
import argparse
import hashlib
import json
from pathlib import Path
import tarfile
import tempfile
import time


def digest(data):
    return hashlib.sha256(data).hexdigest()


def export(directory):
    directory = Path(directory).resolve()
    names = set()
    # Explicit allowlist: no environment, cache, credentials or base model.
    for name in ["run_pilot.py", "diagnose_learning.py", "export_checkpoint.py", "recreate_pilot.sh",
                 "SOURCE_COMMIT", "RECREATION_SOURCE_COMMIT", "preflight.json", "resolved-packages.txt",
                 "recreation_attempt.json", "recreation_execution_started.json",
                 "prepare.log", "latest-run.log", "recreation-diagnosis.log",
                 "sft_examples.jsonl", "train_messages.jsonl", "eval_inputs.jsonl", "eval_review.jsonl",
                 "latest_results.json", "latest_diagnosis.json"]:
        if (directory / name).is_file():
            names.add(name)
    for group in ["results", "diagnostics"]:
        for folder in (directory / group).glob("*"):
            if not folder.is_dir():
                continue
            for path in folder.glob("*.json*"):
                if path.is_file():
                    names.add(str(path.relative_to(directory)))
            if group == "results":
                for name in ["README.md", "adapter_config.json", "adapter_model.safetensors"]:
                    path = folder / "adapter" / name
                    if path.is_file():
                        names.add(str(path.relative_to(directory)))
    if not any(name.endswith("/adapter/adapter_model.safetensors") for name in names):
        raise FileNotFoundError("学習済みadapter本体がまだありません。退避完了とは扱いません")
    for name in sorted(names):
        if name.endswith("/adapter/adapter_model.safetensors"):
            parent = str(Path(name).parent)
            if not {parent + "/README.md", parent + "/adapter_config.json"} <= names:
                raise FileNotFoundError("adapter3fileが揃っていません。退避完了とは扱いません")
    payload = {}
    for name in sorted(names):
        path = directory / name
        if path.is_symlink() or not path.resolve().is_relative_to(directory):
            raise ValueError("退避対象にsymlinkまたは作業先外のfileがあります")
        if path.stat().st_size > 64 * 1024 * 1024:
            raise ValueError("この小規模adapter用の退避上限を超えています")
        payload[name] = path.read_bytes()
    manifest = {"schema": "cocolon_recreated_pilot_export.v1", "created_unix": time.time(),
                "recipe_source_commit": "d53f9ef0a906624acaeb519f8c4c6eb153e60e51",
                "recreated_from_recipe": True, "original_weights_recovered": False,
                "bitwise_reproduction_guaranteed": False,
                "files": {name: {"sha256": digest(data), "bytes": len(data)} for name, data in payload.items()}}
    payload["checkpoint_manifest.json"] = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode()
    destination = directory / "cocolon_recreated_checkpoint.tar.gz"
    import io
    with tempfile.NamedTemporaryFile(dir=directory, suffix=".tar.gz.tmp", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        with tarfile.open(tmp_path, "w:gz") as archive:
            for name, data in payload.items():
                info = tarfile.TarInfo(name)
                info.size = len(data)
                info.mode = 0o600
                archive.addfile(info, io.BytesIO(data))
        with tarfile.open(tmp_path, "r:gz") as archive:
            for name, data in payload.items():
                if archive.extractfile(name).read() != data:
                    raise ValueError("退避archiveの読戻しが一致しません")
        tmp_path.replace(destination)
    finally:
        tmp_path.unlink(missing_ok=True)
    sha = digest(destination.read_bytes())
    destination.with_suffix(destination.suffix + ".sha256").write_text(f"{sha}  {destination.name}\n", encoding="utf-8")
    print(f"重み入り退避ファイル作成: {destination}\nSHA256: {sha}", flush=True)
    print("Stop前にこのtar.gzをダウンロードし、手元に保存されたことを確認してください。", flush=True)
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", type=Path, default=Path("/workspace/cocolon_emlis_free_20261024"))
    export(parser.parse_args().directory)
