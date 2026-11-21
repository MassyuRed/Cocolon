#!/usr/bin/env python3
"""Snapshot the local Python import closure as complete, unchanged modules.

This is a local packaging operation. It does not import product modules, load a
model, install a dependency, contact a service, or modify repository source.
"""
from __future__ import annotations

import argparse
import ast
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import zipfile


START_PATHS = (
    "ai/services/ai_inference/analysis_semantic_map.py",
    "ai/services/ai_inference/analysis_cumulative_service.py",
    "ai/services/ai_inference/analysis_model_source.py",
    "ai/services/ai_inference/cocolon_meaning_experience_engine/__init__.py",
    "ai/tools/serve_emlis_natural_reply.py",
)
IMPORT_ROOTS = ("ai/services/ai_inference", "ai/services", "ai/services/analysis_engine", "ai/tools", "ai", "")
RUNTIME_ASSETS = ("ai/data/processed/structure_dictionary.json",)


def canonical(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args], text=True).rstrip("\n")


def build(repo: Path, destination: Path):
    repo = repo.resolve(strict=True)
    destination.mkdir(parents=True, exist_ok=True)
    roots = tuple(repo / name for name in IMPORT_ROOTS)
    known = {}
    module_names = {}
    for path in sorted(repo.rglob("*.py")):
        if any(part in {".git", "__pycache__", ".venv", "node_modules"} for part in path.parts):
            continue
        for root in roots:
            try:
                relative = path.relative_to(root)
            except ValueError:
                continue
            parts = relative.with_suffix("").parts
            if parts[-1] == "__init__":
                parts = parts[:-1]
            if parts and all(part.isidentifier() for part in parts):
                name = ".".join(parts)
                known.setdefault(name, path)
                module_names.setdefault(path, name)
    queued = set()
    pending = []
    snapshots = {}
    reasons = {}
    unresolved = set()
    dynamic = set()

    def add(path, reason):
        if path not in queued:
            queued.add(path)
            pending.append(path)
        reasons.setdefault(path, set()).add(reason)
        parent = path.parent
        while parent != repo and repo in parent.parents:
            initializer = parent / "__init__.py"
            if initializer.is_file() and initializer != path:
                if initializer not in queued:
                    queued.add(initializer)
                    pending.append(initializer)
                reasons.setdefault(initializer, set()).add("package initializer")
            parent = parent.parent

    def resolve(name, importer, line):
        if not name:
            return False
        found = False
        pieces = name.split(".")
        # A dotted import executes every real package initializer along its path.
        for length in range(1, len(pieces) + 1):
            target = known.get(".".join(pieces[:length]))
            if target is not None:
                add(target, f"{importer}:{line}: {name}")
                found = True
        return found

    for relative in START_PATHS:
        target = repo / relative
        if not target.is_file():
            raise FileNotFoundError(relative)
        add(target, "entrypoint")

    while pending:
        path = pending.pop(0)
        relative = path.relative_to(repo).as_posix()
        data = path.read_bytes()
        snapshots[relative] = data
        tree = ast.parse(data, filename=relative)
        module = module_names.get(path, "")
        package = module if path.name == "__init__.py" else module.rpartition(".")[0]
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if not resolve(alias.name, relative, node.lineno):
                        unresolved.add((alias.name, relative, node.lineno))
            elif isinstance(node, ast.ImportFrom):
                if node.level:
                    package_parts = package.split(".") if package else []
                    if node.level > len(package_parts):
                        raise ValueError(f"Unresolved relative import: {relative}:{node.lineno}")
                    base = ".".join(package_parts[:len(package_parts) - node.level + 1])
                    if node.module:
                        base = ".".join(part for part in (base, node.module) if part)
                else:
                    base = node.module or ""
                found = resolve(base, relative, node.lineno)
                for alias in node.names:
                    if alias.name != "*":
                        resolve(".".join(part for part in (base, alias.name) if part), relative, node.lineno)
                if not found and base:
                    unresolved.add((base, relative, node.lineno))
            elif isinstance(node, ast.Call):
                function = node.func
                dynamic_name = (isinstance(function, ast.Name) and function.id == "__import__") or (
                    isinstance(function, ast.Attribute) and function.attr == "import_module")
                if dynamic_name:
                    if node.args and isinstance(node.args[0], ast.Constant) and isinstance(node.args[0].value, str):
                        name = node.args[0].value
                        if name.startswith("."):
                            dynamic.add((relative, node.lineno, "relative dynamic import requires runtime package"))
                        elif not resolve(name, relative, node.lineno):
                            unresolved.add((name, relative, node.lineno))
                    else:
                        dynamic.add((relative, node.lineno, "nonliteral dynamic import"))

    for relative in RUNTIME_ASSETS:
        path = repo / relative
        snapshots[relative] = path.read_bytes()
        reasons[path] = {"explicit existing runtime dependency of structure_dict.load_structure_dict"}
    sources = []
    for relative, data in sorted(snapshots.items()):
        sources.append({"path": relative, "sha256": digest(data), "bytes": len(data),
                        "kind": "python_module" if relative.endswith(".py") else "runtime_asset",
                        "included_by": sorted(reasons[repo / relative])[:3],
                        "inclusion_reason_count": len(reasons[repo / relative])})
    archive = destination / "current_api_sources.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for relative, data in sorted(snapshots.items()):
            info = zipfile.ZipInfo(relative, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            info.create_system = 3
            zf.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    dependency_groups = {}
    for module, importer, line in sorted(unresolved):
        top = module.split(".")[0]
        kind = "standard_library" if top in sys.stdlib_module_names else "external_dependency"
        dependency_groups.setdefault((module, kind), []).append({"path": importer, "line": line})
    changed_after_snapshot = [relative for relative, data in sorted(snapshots.items())
                              if not (repo / relative).is_file() or (repo / relative).read_bytes() != data]
    manifest = {
        "schema": "cocolon.complete_python_import_closure.v1",
        "repository": "MassyuRed/mashos-api",
        "source_git_head": git(repo, "rev-parse", "HEAD"),
        "source_dirty_paths": git(repo, "status", "--porcelain=v1", "--untracked-files=all").splitlines(),
        "source_snapshot_changed_paths_at_completion": changed_after_snapshot,
        "snapshot_is_git_commit": False,
        "snapshot_note": "Complete module bytes captured during this local build; subsequent repository edits are not included.",
        "entrypoints": list(START_PATHS),
        "explicit_runtime_assets": list(RUNTIME_ASSETS),
        "import_roots": list(IMPORT_ROOTS),
        "local_python_modules_found": len(module_names),
        "source_count": len(sources),
        "python_module_count": sum(item["kind"] == "python_module" for item in sources),
        "source_bytes": sum(item["bytes"] for item in sources),
        "sources": sources,
        "nonlocal_imports": [{"module": module, "kind": kind, "imported_by": entries[:3],
                              "import_occurrence_count": len(entries)}
                             for (module, kind), entries in sorted(dependency_groups.items())],
        "unresolved_dynamic_imports": [{"path": path, "line": line, "reason": reason}
                                       for path, line, reason in sorted(dynamic)],
        "archive": {"path": archive.name, "bytes": archive.stat().st_size, "sha256": digest(archive.read_bytes())},
    }
    manifest_path = destination / "source_manifest.json"
    manifest_path.write_bytes(canonical(manifest))
    with zipfile.ZipFile(archive) as zf:
        if zf.testzip() is not None or zf.namelist() != sorted(snapshots):
            raise ValueError("archive CRC/order mismatch")
        for relative, data in snapshots.items():
            if zf.read(relative) != data:
                raise ValueError(f"archive byte mismatch: {relative}")
    return {"source_count": manifest["source_count"], "source_bytes": manifest["source_bytes"],
            "archive": manifest["archive"], "manifest": str(manifest_path),
            "snapshot_changed_paths": changed_after_snapshot,
            "external_dependencies": [module for module, kind in dependency_groups if kind == "external_dependency"],
            "dynamic_imports": manifest["unresolved_dynamic_imports"]}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parent.parent / "mashos-api")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent)
    arguments = parser.parse_args()
    print(json.dumps(build(arguments.repo, arguments.output), ensure_ascii=False, sort_keys=True, indent=2))
