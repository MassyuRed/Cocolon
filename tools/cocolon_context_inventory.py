#!/usr/bin/env python3
"""Build/verify the exact tracked-file inventory for Cocolon's two-repository workspace."""
from __future__ import annotations

import argparse
import collections
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import tempfile
from typing import Any, Mapping, Sequence

PROFILE_SCHEMA = "cocolon.system_context.workspace_profiles.v1"
LOCK_SCHEMA = "cocolon.system_context.workspace_lock.v1"
ROW_SCHEMA = "cocolon.system_context.inventory.v1"
MANIFEST_SCHEMA = "cocolon.system_context.inventory_manifest.v1"
OUTPUTS = ("workspace_lock.json", "files.jsonl", "classification_summary.json", "unresolved.jsonl", "manifest.json")
SOURCE_EXT = {".c", ".cc", ".cpp", ".cxx", ".h", ".hpp", ".java", ".js", ".jsx", ".kt", ".kts", ".m", ".mm", ".py", ".rb", ".rs", ".sh", ".swift", ".ts", ".tsx"}
DOC_EXT = {".csv", ".md", ".rst", ".txt"}
CONFIG_EXT = {".cfg", ".conf", ".gradle", ".ini", ".json", ".properties", ".toml", ".xml", ".yaml", ".yml"}
ASSET_EXT = {".aac", ".aiff", ".avif", ".bmp", ".gif", ".heic", ".ico", ".jpeg", ".jpg", ".m4a", ".mp3", ".mp4", ".ogg", ".otf", ".pdf", ".png", ".svg", ".ttf", ".wav", ".webm", ".webp", ".woff", ".woff2"}
CONFIG_NAMES = {".babelrc", ".editorconfig", ".env", ".gitattributes", ".gitignore", "dockerfile", "gemfile", "makefile", "package.json", "pyproject.toml", "requirements.txt", "tsconfig.json"}
LOCK_NAMES = {"bun.lock", "bun.lockb", "cargo.lock", "composer.lock", "gemfile.lock", "package-lock.json", "pnpm-lock.yaml", "poetry.lock", "uv.lock", "yarn.lock"}

class InventoryError(RuntimeError):
    pass

def run(repo: pathlib.Path, *args: str, text: bool = True, check: bool = True) -> str | bytes:
    p = subprocess.run(["git", "-C", str(repo), *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=text)
    if check and p.returncode:
        err = p.stderr if text else p.stderr.decode("utf-8", "replace")
        raise InventoryError(f"git {' '.join(args)} failed in {repo}: {err}")
    return p.stdout

def canon(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")

def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def load_json(path: pathlib.Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise InventoryError(f"cannot read JSON {path}: {exc}") from exc

def write(path: pathlib.Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)

def repo_args(values: Sequence[str]) -> dict[str, pathlib.Path]:
    out: dict[str, pathlib.Path] = {}
    for value in values:
        if "=" not in value:
            raise InventoryError(f"--repo must be NAME=PATH: {value}")
        name, raw = value.split("=", 1)
        if not name or not raw or name in out:
            raise InventoryError(f"invalid or duplicate --repo: {value}")
        out[name] = pathlib.Path(raw).expanduser().resolve()
    return out

def profile(path: pathlib.Path, workspace: str, paths: Mapping[str, pathlib.Path]) -> tuple[dict[str, Any], list[tuple[str, pathlib.Path, Mapping[str, Any]]]]:
    root = load_json(path)
    if root.get("schema_version") != PROFILE_SCHEMA:
        raise InventoryError("unsupported workspace profile schema")
    cfg = root.get("profiles", {}).get(workspace)
    if not isinstance(cfg, dict):
        raise InventoryError(f"unknown workspace: {workspace}")
    repos = cfg.get("repositories")
    if not isinstance(repos, dict) or set(repos) != set(paths):
        raise InventoryError(f"repository set mismatch: expected={sorted(repos or {})} actual={sorted(paths)}")
    specs = []
    for key in sorted(repos):
        if not (paths[key] / ".git").exists():
            raise InventoryError(f"not a Git repository: {key}={paths[key]}")
        specs.append((key, paths[key], repos[key]))
    return cfg, specs

def identity(key: str, repo: pathlib.Path, cfg: Mapping[str, Any], locked: str | None = None) -> dict[str, Any]:
    head = str(run(repo, "rev-parse", "HEAD")).strip()
    commit = locked or head
    exists = subprocess.run(["git", "-C", str(repo), "cat-file", "-e", f"{commit}^{{commit}}"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    if not exists:
        raise InventoryError(f"locked commit is unavailable: {key} {commit}")
    expected = cfg.get("expected_head")
    ancestor = cfg.get("expected_ancestor")
    if locked is None and expected and head != expected:
        raise InventoryError(f"{key} head mismatch: expected={expected} actual={head}")
    if locked is None and ancestor:
        rc = subprocess.run(["git", "-C", str(repo), "merge-base", "--is-ancestor", ancestor, head]).returncode
        if rc:
            raise InventoryError(f"{key} HEAD {head} is not a descendant of {ancestor}")
    return {
        "key": key, "repository": cfg.get("repository"), "configured_ref": cfg.get("checkout_ref"),
        "expected_head": expected, "expected_ancestor": ancestor, "source_commit": commit,
        "source_tree": str(run(repo, "rev-parse", f"{commit}^{{tree}}")).strip(),
        "checkout_head_at_build": commit, "commit_time": str(run(repo, "show", "-s", "--format=%cI", commit)).strip(),
        "role": cfg.get("role"),
    }

def tree_entries(repo: pathlib.Path, commit: str) -> list[tuple[str, str, str, int | None, str]]:
    raw = run(repo, "ls-tree", "-r", "-l", "-z", commit, text=False)
    assert isinstance(raw, bytes)
    rows = []
    for item in raw.split(b"\0"):
        if not item:
            continue
        meta, path_b = item.split(b"\t", 1)
        mode, typ, obj, size = meta.split(b" ", 3)
        rows.append((mode.decode(), typ.decode(), obj.decode(), None if size == b"-" else int(size), path_b.decode("utf-8", "surrogateescape")))
    return rows

def blob(repo: pathlib.Path, obj: str) -> bytes:
    data = run(repo, "cat-file", "blob", obj, text=False)
    assert isinstance(data, bytes)
    return data

def classify(path: str, typ: str) -> tuple[str, str, list[str], str]:
    low = "/" + path.lower().replace("\\", "/")
    name = pathlib.PurePosixPath(path).name.lower()
    ext = pathlib.PurePosixPath(path).suffix.lower()
    history = any(x in low for x in ("/history/", "/historical", "/audits/", "/receipts/", "_receipt", "handoff", "result_20"))
    generated = "/cocolon_前提資料/system_context/current/" in low
    test = any(x in low for x in ("/test/", "/tests/", "test_", ".test.", ".spec.", "_test."))
    if typ == "commit": role = "SUBMODULE"
    elif generated: role = "GENERATED_CONTEXT"
    elif test: role = "TEST"
    elif "/.github/workflows/" in low: role = "CI_WORKFLOW"
    elif name in LOCK_NAMES: role = "LOCKFILE"
    elif "/migrations/" in low or "/schema/" in low or ext == ".sql" or "schema" in name: role = "SCHEMA_OR_MIGRATION"
    elif "/cocolon_前提資料/" in low or low.startswith("/cocolon_piece/") or low.startswith("/cocolon_analysis/"): role = "PREMISE_OR_DESIGN"
    elif ext in SOURCE_EXT: role = "SOURCE"
    elif name in CONFIG_NAMES or ext in CONFIG_EXT: role = "CONFIG"
    elif ext in ASSET_EXT: role = "ASSET"
    elif ext in DOC_EXT: role = "DOCUMENT"
    else: role = "UNRESOLVED"
    if generated: lifecycle = "GENERATED_CONTEXT"
    elif history: lifecycle = "HISTORICAL_REFERENCE"
    elif role == "TEST": lifecycle = "ACTIVE_TEST"
    elif role == "SOURCE": lifecycle = "ACTIVE_SOURCE"
    elif role in {"CI_WORKFLOW", "CONFIG", "SCHEMA_OR_MIGRATION"}: lifecycle = "ACTIVE_SUPPORT"
    elif role == "PREMISE_OR_DESIGN": lifecycle = "CURRENT_REFERENCE_REQUIRES_OWNER"
    else: lifecycle = "INVENTORY_ONLY"
    domains = [d for d, keys in {
        "CMEE": ("cmee", "meaning_experience"), "EMLIS_AI": ("emlis", "nls_v"), "PIECE": ("piece",),
        "ANALYSIS": ("analysis", "watashi", "self_structure"), "RN": ("screens/", "components/", "navigation/", "react-native"),
        "API_BACKEND": ("api_", "fastapi", "ai_inference", "services/"), "DB_STORAGE": ("supabase", "migration", ".sql"),
    }.items() if any(k in low for k in keys)]
    return role, lifecycle, domains or ["GLOBAL"], "UNRESOLVED" if role == "UNRESOLVED" else "CLASSIFIED"

def row(key: str, ident: Mapping[str, Any], repo: pathlib.Path, entry: tuple[str, str, str, int | None, str]) -> dict[str, Any]:
    mode, typ, obj, size, path = entry
    data = blob(repo, obj) if typ == "blob" else b""
    binary = typ == "blob" and b"\0" in data[:8192]
    role, lifecycle, domains, status = classify(path, typ)
    return {
        "schema_version": ROW_SCHEMA, "workspace_repository_key": key, "repository": ident["repository"],
        "source_commit": ident["source_commit"], "source_tree": ident["source_tree"], "path": path,
        "object_mode": mode, "object_type": typ, "object_sha": obj, "object_size": size,
        "content_sha256": sha256(data) if typ == "blob" else None,
        "content_kind": "SUBMODULE" if typ == "commit" else ("BINARY" if binary else "TEXT"),
        "line_count": None if typ != "blob" or binary else data.count(b"\n") + (1 if data and not data.endswith(b"\n") else 0),
        "file_role": role, "lifecycle": lifecycle, "domains": domains, "classification_status": status,
    }

def build_bytes(profiles: pathlib.Path, workspace: str, paths: Mapping[str, pathlib.Path], locked: Mapping[str, str] | None = None) -> dict[str, bytes]:
    cfg, specs = profile(profiles, workspace, paths)
    identities, rows = [], []
    for key, repo, rcfg in specs:
        ident = identity(key, repo, rcfg, (locked or {}).get(key))
        identities.append(ident)
        rows.extend(row(key, ident, repo, e) for e in tree_entries(repo, ident["source_commit"]))
    rows.sort(key=lambda r: (r["workspace_repository_key"], r["path"]))
    keys = [(r["workspace_repository_key"], r["path"]) for r in rows]
    if len(keys) != len(set(keys)):
        raise InventoryError("duplicate repository+path in inventory")
    unresolved = [r for r in rows if r["classification_status"] == "UNRESOLVED"]
    counts = lambda field: dict(sorted(collections.Counter(r[field] for r in rows).items()))
    domain_counts = dict(sorted(collections.Counter(d for r in rows for d in r["domains"]).items()))
    repo_counts = dict(sorted(collections.Counter(r["workspace_repository_key"] for r in rows).items()))
    lock = {"schema_version": LOCK_SCHEMA, "workspace": workspace, "profile_purpose": cfg.get("purpose"), "repositories": identities}
    files_b = b"".join(canon(r) for r in rows)
    unresolved_b = b"".join(canon(r) for r in unresolved)
    summary = {"schema_version": "cocolon.system_context.classification_summary.v1", "workspace": workspace, "total": len(rows), "by_repository": repo_counts, "by_role": counts("file_role"), "by_lifecycle": counts("lifecycle"), "by_domain": domain_counts, "by_status": counts("classification_status")}
    outputs = {"workspace_lock.json": canon(lock), "files.jsonl": files_b, "classification_summary.json": canon(summary), "unresolved.jsonl": unresolved_b}
    per_repo = {i["key"]: {"source_commit": i["source_commit"], "source_tree": i["source_tree"], "tracked_entry_count": repo_counts.get(i["key"], 0)} for i in identities}
    manifest = {"schema_version": MANIFEST_SCHEMA, "workspace": workspace, "total_tracked_entries": len(rows), "unique_repository_path_count": len(set(keys)), "missing_tracked_path_count": 0, "duplicate_repository_path_count": 0, "unresolved_count": len(unresolved), "repositories": per_repo, "output_sha256": {name: sha256(data) for name, data in outputs.items()}, "completion_claim": "STEP1_FULL_TRACKED_FILE_POPULATION_COMPLETE", "product_credit": 0, "automatic_progression": False}
    outputs["manifest.json"] = canon(manifest)
    return outputs

def build(profiles: pathlib.Path, workspace: str, paths: Mapping[str, pathlib.Path], output: pathlib.Path) -> dict[str, Any]:
    outputs = build_bytes(profiles, workspace, paths)
    for name, data in outputs.items(): write(output / name, data)
    return json.loads(outputs["manifest.json"])

def verify(profiles: pathlib.Path, workspace: str, paths: Mapping[str, pathlib.Path], output: pathlib.Path) -> dict[str, Any]:
    lock = load_json(output / "workspace_lock.json")
    if lock.get("schema_version") != LOCK_SCHEMA or lock.get("workspace") != workspace:
        raise InventoryError("workspace lock mismatch")
    locked = {r["key"]: r["source_commit"] for r in lock.get("repositories", [])}
    expected = build_bytes(profiles, workspace, paths, locked)
    for name in OUTPUTS:
        actual = (output / name).read_bytes()
        if actual != expected[name]:
            raise InventoryError(f"inventory verification failed: {name}")
    return json.loads(expected["manifest.json"])

def cli(argv: Sequence[str] | None = None) -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="command", required=True)
    for name in ("build", "verify"):
        q = sub.add_parser(name)
        q.add_argument("--profiles", required=True, type=pathlib.Path)
        q.add_argument("--workspace", required=True)
        q.add_argument("--repo", action="append", required=True)
        q.add_argument("--output", required=True, type=pathlib.Path)
    a = p.parse_args(argv)
    try:
        paths = repo_args(a.repo)
        result = build(a.profiles.resolve(), a.workspace, paths, a.output.resolve()) if a.command == "build" else verify(a.profiles.resolve(), a.workspace, paths, a.output.resolve())
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
        return 0
    except (InventoryError, OSError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

if __name__ == "__main__":
    raise SystemExit(cli())
