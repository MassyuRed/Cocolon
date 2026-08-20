"""Unified standard entry for Cocolon System Context Step 5.

``prepare`` resolves exact workspace refs, verifies same-ref snapshots, derives
changed paths, partially reindexes changed source and reverse dependents, merges
only the affected route/backend/test closure, recompiles the task context, and
writes a machine-readable receipt.  It never changes product/runtime behavior.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from typing import Any, Iterable, Mapping, Sequence

from tools.cocolon_context_inventory import (
    InventoryError,
    build_bytes as build_inventory_bytes,
    verify as verify_inventory,
    write as write_inventory_output,
)
from tools.cocolon_context_publish_transport import (
    DEFAULT_MAX_PART_BYTES,
    PublicationTransportError,
    materialize_outputs,
    pack_outputs,
    sha256_file,
    verify_outputs,
)
from tools.cocolon_context_task import (
    ContextCompileError,
    compile_task_context,
    verify_task_context,
)

SCHEMA_VERSION = "cocolon.system_context.prepare_receipt.v1"
STEP5_CLAIM = "STEP5_COCOLON_STANDARD_ENTRY_CONNECTED"
OVERALL_CLAIM = "COCOLON_SYSTEM_CONTEXT_STEPS1_TO_5_COMPLETE"
STEP4_CLAIM = "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"
GENERATED_PREFIX = "Cocolon_前提資料/system_context/current/"
RECEIPT_NAME = "prepare_summary.json"
REPORT_NAME = "prepare_summary.md"
STATUS_COMPLETE = "COMPLETE"
STATUS_PENDING_REMOTE = "PENDING_REMOTE_VERIFICATION"


class PrepareError(RuntimeError):
    """Fail-closed standard-entry error."""


@dataclass(frozen=True)
class RepositoryRef:
    key: str
    path: Path
    commit: str
    tree: str


@dataclass(frozen=True)
class Change:
    repository_key: str
    status: str
    old_path: str | None
    new_path: str | None

    @property
    def paths(self) -> tuple[str, ...]:
        return tuple(path for path in (self.old_path, self.new_path) if path)


def _canonical_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        + "\n"
    ).encode("utf-8")


def _pretty_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n").encode("utf-8")


def _write_atomic(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(data)
    os.replace(temporary, path)


def _load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PrepareError(f"cannot read JSON {path}: {exc}") from exc


def _run(
    command: Sequence[str], *, cwd: Path | None = None, capture: bool = True
) -> str:
    process = subprocess.run(
        list(command),
        cwd=str(cwd) if cwd else None,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE,
    )
    if process.returncode:
        stderr = process.stderr or ""
        stdout = process.stdout or ""
        raise PrepareError(
            f"command failed ({process.returncode}): {' '.join(command)}\n{stdout}{stderr}"
        )
    return process.stdout or ""


def _git(repo: Path, *args: str) -> str:
    return _run(("git", "-C", str(repo), *args)).strip()


def _assert_repo(repo: Path, key: str) -> None:
    if not (repo / ".git").exists():
        raise PrepareError(f"repository unavailable: {key}={repo}")


def _commit_paths(repo: Path, parent: str, commit: str) -> list[str]:
    raw = _git(repo, "-c", "core.quotepath=false", "diff", "--name-only", parent, commit)
    return [line for line in raw.splitlines() if line]


def effective_material_commit(repo: Path, head: str | None = None) -> str:
    """Ignore only trailing commits whose complete delta is generated context."""
    current = head or _git(repo, "rev-parse", "HEAD")
    while True:
        parent_line = _git(repo, "rev-list", "--parents", "-n", "1", current)
        parts = parent_line.split()
        if len(parts) < 2:
            return current
        parent = parts[1]
        paths = _commit_paths(repo, parent, current)
        if not paths or any(not path.startswith(GENERATED_PREFIX) for path in paths):
            return current
        current = parent


def _resolve_refs(
    *, repo_root: Path, external_workspace_root: Path, workspace_profile: Mapping[str, Any]
) -> dict[str, RepositoryRef]:
    repository_specs = workspace_profile.get("repositories")
    if not isinstance(repository_specs, dict):
        raise PrepareError("workspace profile repositories missing")
    paths = {
        "Cocolon": repo_root,
        "mashos-api": external_workspace_root / "mashos-api",
    }
    if set(repository_specs) != set(paths):
        raise PrepareError(
            f"unsupported workspace repository set: {sorted(repository_specs)}"
        )
    refs: dict[str, RepositoryRef] = {}
    for key in sorted(paths):
        path = paths[key].resolve()
        _assert_repo(path, key)
        checkout_head = _git(path, "rev-parse", "HEAD")
        commit = effective_material_commit(path, checkout_head) if key == "Cocolon" else checkout_head
        spec = repository_specs[key]
        expected_head = spec.get("expected_head")
        expected_ancestor = spec.get("expected_ancestor")
        if expected_head and commit != expected_head:
            raise PrepareError(f"{key} ref mismatch: expected={expected_head} actual={commit}")
        if expected_ancestor:
            rc = subprocess.run(
                ("git", "-C", str(path), "merge-base", "--is-ancestor", str(expected_ancestor), commit),
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            ).returncode
            if rc:
                raise PrepareError(
                    f"{key} material commit {commit} is not a descendant of {expected_ancestor}"
                )
        refs[key] = RepositoryRef(
            key=key,
            path=path,
            commit=commit,
            tree=_git(path, "rev-parse", f"{commit}^{{tree}}"),
        )
    return refs


def _load_saved_refs(workspace_dir: Path) -> dict[str, str]:
    lock_path = workspace_dir / "workspace_lock.json"
    if not lock_path.is_file():
        return {}
    lock = _load_json(lock_path)
    result: dict[str, str] = {}
    for raw in lock.get("repositories", []):
        if isinstance(raw, dict) and raw.get("key") and raw.get("source_commit"):
            result[str(raw["key"])] = str(raw["source_commit"])
    return result


def _diff_changes(repo_ref: RepositoryRef, old_commit: str | None) -> list[Change]:
    if not old_commit or old_commit == repo_ref.commit:
        return []
    try:
        raw = _git(repo_ref.path, "-c", "core.quotepath=false", "diff", "--name-status", "-M", old_commit, repo_ref.commit)
    except PrepareError as exc:
        raise PrepareError(
            f"cannot derive changed paths for {repo_ref.key}: {old_commit}..{repo_ref.commit}: {exc}"
        ) from exc
    changes: list[Change] = []
    for line in raw.splitlines():
        if not line:
            continue
        fields = line.split("\t")
        code = fields[0]
        kind = code[0]
        if kind in {"R", "C"} and len(fields) == 3:
            changes.append(Change(repo_ref.key, "RENAMED" if kind == "R" else "COPIED", fields[1], fields[2]))
        elif len(fields) == 2:
            mapping = {"A": "ADDED", "M": "MODIFIED", "D": "DELETED", "T": "TYPE_CHANGED"}
            changes.append(Change(repo_ref.key, mapping.get(kind, f"GIT_{code}"), fields[1] if kind == "D" else None, None if kind == "D" else fields[1]))
        else:
            raise PrepareError(f"unrecognized git diff row: {line!r}")
    return changes


def _is_source(path: str) -> bool:
    return PurePosixPath(path.lower()).suffix in {
        ".py", ".pyi", ".ts", ".tsx", ".js", ".jsx", ".dart", ".java",
        ".kt", ".kts", ".go", ".rs", ".c", ".cc", ".cpp", ".h", ".hpp",
        ".swift", ".rb", ".php", ".scala", ".sh",
    }


def _global_owner_path(path: str) -> bool:
    lower = path.lower()
    name = PurePosixPath(lower).name
    return bool(
        lower.startswith("tools/cocolon_context")
        or lower.startswith(".github/workflows/cocolon-system-context")
        or lower.endswith("workspace_profiles.json")
        or lower.endswith("task_profiles.json")
        or name in {
            "package.json", "package-lock.json", "pyproject.toml",
            "requirements.txt", "requirements.lock", "tsconfig.json",
            "setup.cfg", "setup.py",
        }
    )


def plan_refresh(
    changes: Sequence[Change], *,
    forced_full_rebuild_reasons: Sequence[str] = (),
) -> dict[str, Any]:
    """Return exact affected layers and the admitted execution path.

    Ordinary modified source files use an affected source/dependent refresh.
    Add/delete/rename/type changes and global provider/registry owners remain an
    explicit bounded full-rebuild fallback; stale semantic rows are never reused.
    """
    affected = {"inventory", "task_context"} if changes else set()
    reasons: set[str] = set(forced_full_rebuild_reasons)
    has_source = False
    global_owner = bool(forced_full_rebuild_reasons)
    all_modified = bool(changes)
    for change in changes:
        all_modified = all_modified and change.status == "MODIFIED"
        for path in change.paths:
            lower = path.lower()
            if _global_owner_path(path):
                affected.update({"code_index", "route_graph"})
                reasons.add("TOOLCHAIN_SCHEMA_OR_PROFILE_CHANGE")
                global_owner = True
            elif _is_source(path):
                has_source = True
                affected.update({"code_index", "route_graph"})
                if (
                    change.repository_key == "mashos-api"
                    or any(token in lower for token in (
                        "api", "route", "router", "screen", "service",
                        "engine", "store", "repository", "test",
                    ))
                ):
                    reasons.add("ROUTE_OR_OWNER_CLOSURE_CHANGE")
                else:
                    reasons.add("SOURCE_GRAPH_CHANGE")
            elif any(token in lower for token in ("route", "contract", "schema", "domain")):
                affected.add("route_graph")
                reasons.add("ROUTE_METADATA_CHANGE")
            else:
                reasons.add("NON_CODE_CHANGE")
    requested_layers = sorted(affected)
    modified_non_code_only = bool(changes) and all_modified and not has_source and not global_owner
    if not changes:
        execution_mode = "SAME_REF_REUSE"
        fallback: list[str] = []
        executed_layers = requested_layers
    elif not all_modified or global_owner:
        execution_mode = "FULL_REBUILD_FALLBACK"
        fallback = sorted({
            "BOUNDED_GLOBAL_OWNER_OR_PATH_IDENTITY_REBUILD_REQUIRED",
            "STALE_INDEX_REUSE_FORBIDDEN",
        } | set(forced_full_rebuild_reasons))
        executed_layers = sorted(set(affected) | {"code_index", "route_graph"})
    elif has_source:
        execution_mode = "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE"
        fallback = []
        executed_layers = ["code_index", "inventory", "route_graph", "task_context"]
    elif modified_non_code_only:
        execution_mode = "INCREMENTAL_NON_CODE_REBIND"
        fallback = []
        executed_layers = ["inventory", "task_context"]
    else:
        execution_mode = "FULL_REBUILD_FALLBACK"
        fallback = ["UNCLASSIFIED_CHANGED_REF_REQUIRES_BOUNDED_FULL_REBUILD"]
        executed_layers = sorted(set(affected) | {"code_index", "route_graph"})
    return {
        "changed_path_count": len(changes),
        "detected_change_kinds": sorted({change.status for change in changes}),
        "requested_affected_layers": requested_layers,
        "executed_layers": executed_layers,
        "execution_mode": execution_mode,
        "fallback_reasons": fallback,
        "classification_reasons": sorted(reasons),
    }


def _forced_full_rebuild_reasons(
    *, refs: Mapping[str, RepositoryRef], saved_refs: Mapping[str, str],
    changes: Sequence[Change],
) -> list[str]:
    """Detect global route/domain owner edits from the actual changed bytes."""
    reasons: set[str] = set()
    pattern = re.compile(
        r"(?:include_router\s*\(|APIRouter\s*\(|route_registry|router_registry|"
        r"domain_owner|DOMAIN_OWNER|mount\s*\()"
    )
    for change in changes:
        if change.status != "MODIFIED":
            continue
        path = change.new_path or change.old_path
        old_commit = saved_refs.get(change.repository_key)
        ref = refs.get(change.repository_key)
        if not path or not old_commit or ref is None or not _is_source(path):
            continue
        if _global_owner_path(path):
            continue
        diff = _git(
            ref.path, "-c", "core.quotepath=false", "diff", "-U0",
            old_commit, ref.commit, "--", path,
        )
        changed_lines = "\n".join(
            line[1:] for line in diff.splitlines()
            if line.startswith(("+", "-")) and not line.startswith(("+++", "---"))
        )
        if pattern.search(changed_lines):
            reasons.add("ROUTE_REGISTRY_INCLUDE_ROUTER_OR_DOMAIN_OWNER_CHANGE")
    return sorted(reasons)



def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        with path.open("r", encoding="utf-8") as handle:
            for number, line in enumerate(handle, 1):
                if not line.strip():
                    continue
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise PrepareError(f"JSONL row is not an object: {path}:{number}")
                rows.append(value)
    except (OSError, json.JSONDecodeError) as exc:
        raise PrepareError(f"cannot read JSONL {path}: {exc}") from exc
    return rows


def _write_jsonl(path: Path, rows: Sequence[Mapping[str, Any]]) -> None:
    _write_atomic(path, b"".join(_canonical_bytes(row) for row in rows))


def _inventory_key(row: Mapping[str, Any]) -> tuple[str, str]:
    repository_key = row.get("workspace_repository_key") or row.get("repository_key")
    path = row.get("path")
    if not repository_key or not path:
        raise PrepareError(f"inventory-bound row lacks repository/path: {row}")
    return str(repository_key), str(path)


def _replace_exact_strings(value: Any, replacements: Mapping[str, str]) -> Any:
    if isinstance(value, str):
        return replacements.get(value, value)
    if isinstance(value, list):
        return [_replace_exact_strings(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: _replace_exact_strings(item, replacements) for key, item in value.items()}
    return value


def _rebind_inventory_rows(
    path: Path, *, new_inventory: Mapping[tuple[str, str], Mapping[str, Any]],
    replacements: Mapping[str, str], required_complete: bool,
) -> None:
    output: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for raw in _read_jsonl(path):
        row = _replace_exact_strings(raw, replacements)
        try:
            key = _inventory_key(row)
        except PrepareError:
            output.append(row)
            continue
        inventory = new_inventory.get(key)
        if inventory is None:
            raise PrepareError(f"stale indexed row after non-code rebind: {key}")
        seen.add(key)
        field_pairs = {
            "file_identity": "file_identity",
            "source_commit": "source_commit",
            "source_tree": "source_tree",
            "object_sha": "object_sha",
            "content_sha256": "content_sha256",
            "object_size": "object_size",
            "file_role": "file_role",
            "lifecycle": "lifecycle",
            "domains": "domains",
            "classification_status": "classification_status",
        }
        for target, source in field_pairs.items():
            if target in row and source in inventory:
                row[target] = inventory[source]
        output.append(row)
    if required_complete and seen != set(new_inventory):
        missing = sorted(set(new_inventory) - seen)[:20]
        raise PrepareError(f"incremental coverage is not exact; missing={missing}")
    _write_jsonl(path, output)


def _rewrite_small_json(path: Path, replacements: Mapping[str, str]) -> None:
    value = _replace_exact_strings(_load_json(path), replacements)
    _write_atomic(path, _pretty_bytes(value))


def _refresh_manifest_outputs(manifest_path: Path, base: Path) -> dict[str, Any]:
    manifest = _load_json(manifest_path)
    outputs = manifest.get("output_sha256")
    if not isinstance(outputs, dict):
        raise PrepareError(f"manifest output_sha256 missing: {manifest_path}")
    manifest["output_sha256"] = {
        str(name): sha256_file(base / str(name)) for name in sorted(outputs)
    }
    _write_atomic(manifest_path, _canonical_bytes(manifest))
    return manifest


def _incremental_non_code_rebind(
    *, repo_root: Path, system_context_root: Path, workspace: str,
    workspace_dir: Path, refs: Mapping[str, RepositoryRef], profiles_path: Path,
    changes: Sequence[Change], work_root: Path, max_part_bytes: int,
) -> dict[str, Any]:
    """Refresh Inventory and task inputs without rerunning semantic providers."""
    verify_outputs(workspace_dir)
    materialized = work_root / "incremental-non-code"
    materialize_outputs(workspace_dir, materialized)
    shutil.rmtree(materialized / "task_context", ignore_errors=True)
    for name in (RECEIPT_NAME, REPORT_NAME):
        (materialized / name).unlink(missing_ok=True)

    old_rows = _read_jsonl(materialized / "files.jsonl")
    old_by_key = {_inventory_key(row): row for row in old_rows}
    old_inventory_sha = sha256_file(materialized / "files.jsonl")
    old_lock = _load_json(materialized / "workspace_lock.json")
    old_refs = {
        str(row["key"]): (str(row["source_commit"]), str(row["source_tree"]))
        for row in old_lock.get("repositories", [])
    }

    outputs = build_inventory_bytes(
        profiles_path, workspace,
        {key: value.path for key, value in refs.items()},
        {key: value.commit for key, value in refs.items()},
    )
    for name, data in outputs.items():
        write_inventory_output(materialized / name, data)
    new_rows = _read_jsonl(materialized / "files.jsonl")
    new_by_key = {_inventory_key(row): row for row in new_rows}
    if set(old_by_key) != set(new_by_key):
        raise PrepareError("non-code rebind cannot admit added/deleted/renamed paths")

    declared = {(change.repository_key, change.new_path or change.old_path or "") for change in changes}
    actual_changed = {
        key for key in new_by_key
        if old_by_key[key].get("content_sha256") != new_by_key[key].get("content_sha256")
        or old_by_key[key].get("object_mode") != new_by_key[key].get("object_mode")
        or old_by_key[key].get("object_type") != new_by_key[key].get("object_type")
    }
    if actual_changed != declared:
        raise PrepareError(
            f"non-code changed-row mismatch: declared={sorted(declared)} actual={sorted(actual_changed)}"
        )
    for key in actual_changed:
        if new_by_key[key].get("file_role") in {"SOURCE", "TEST", "SCHEMA_OR_MIGRATION", "CI_WORKFLOW", "CONFIG"}:
            raise PrepareError(f"non-code rebind received semantic/toolchain row: {key}")

    replacements: dict[str, str] = {old_inventory_sha: sha256_file(materialized / "files.jsonl")}
    for key, old in old_by_key.items():
        new = new_by_key[key]
        if old.get("file_identity") != new.get("file_identity"):
            replacements[str(old["file_identity"])] = str(new["file_identity"])
    for key, (old_commit, old_tree) in old_refs.items():
        replacements[old_commit] = refs[key].commit
        replacements[old_tree] = refs[key].tree

    code_dir = materialized / "code_index"
    route_dir = materialized / "route_graph"
    _rebind_inventory_rows(
        code_dir / "file_coverage.jsonl",
        new_inventory=new_by_key, replacements=replacements, required_complete=True,
    )
    for name in ("provider_runs.json", "code_index_summary.json"):
        _rewrite_small_json(code_dir / name, replacements)
    code_manifest_path = code_dir / "code_index_manifest.json"
    code_manifest = _replace_exact_strings(_load_json(code_manifest_path), replacements)
    code_manifest["inventory_sha256"] = sha256_file(materialized / "files.jsonl")
    _write_atomic(code_manifest_path, _canonical_bytes(code_manifest))
    _refresh_manifest_outputs(code_manifest_path, code_dir)

    _rebind_inventory_rows(
        route_dir / "file_domain_assignments.jsonl",
        new_inventory=new_by_key, replacements=replacements, required_complete=True,
    )
    for path in sorted(route_dir.iterdir()):
        if path.name == "route_graph_manifest.json" or path.name == "file_domain_assignments.jsonl" or not path.is_file():
            continue
        if path.suffix == ".json":
            _rewrite_small_json(path, replacements)
        elif path.suffix == ".jsonl" and path.stat().st_size <= 32_000_000:
            rows = [_replace_exact_strings(row, replacements) for row in _read_jsonl(path)]
            _write_jsonl(path, rows)
    route_manifest_path = route_dir / "route_graph_manifest.json"
    route_manifest = _replace_exact_strings(_load_json(route_manifest_path), replacements)
    route_manifest["inventory_sha256"] = sha256_file(materialized / "files.jsonl")
    route_manifest["code_index_manifest_sha256"] = sha256_file(code_manifest_path)
    _write_atomic(route_manifest_path, _canonical_bytes(route_manifest))
    _refresh_manifest_outputs(route_manifest_path, route_dir)

    verify_inventory(
        profiles_path, workspace,
        {key: value.path for key, value in refs.items()}, materialized,
    )
    _run((sys.executable, str(repo_root / "tools/cocolon_context_code_index.py"), "verify", "--inventory", str(materialized / "files.jsonl"), "--output", str(code_dir)), cwd=repo_root)
    _run((sys.executable, str(repo_root / "tools/cocolon_context_routes.py"), "verify", "--inventory", str(materialized / "files.jsonl"), "--code-index", str(code_dir), "--output", str(route_dir)), cwd=repo_root)

    pack_outputs(materialized, max_part_bytes)
    shutil.rmtree(workspace_dir)
    shutil.copytree(materialized, workspace_dir)
    return verify_outputs(workspace_dir)

def _iter_jsonl(path: Path) -> Iterable[dict[str, Any]]:
    try:
        with path.open("r", encoding="utf-8") as handle:
            for number, line in enumerate(handle, 1):
                if not line.strip():
                    continue
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise PrepareError(f"JSONL row is not an object: {path}:{number}")
                yield value
    except (OSError, json.JSONDecodeError) as exc:
        raise PrepareError(f"cannot stream JSONL {path}: {exc}") from exc


def _row_source_key(
    row: Mapping[str, Any], *, source_field: str = "path"
) -> tuple[str, str] | None:
    repository_key = row.get("repository_key") or row.get("workspace_repository_key")
    path = row.get(source_field)
    if repository_key and path:
        return str(repository_key), str(path)
    return None


def _derive_reverse_dependents(
    *, code_dir: Path, seeds: set[tuple[str, str]], database_path: Path,
) -> tuple[set[tuple[str, str]], dict[str, Any]]:
    """Resolve transitive reverse import/reference dependents with bounded memory."""
    database_path.parent.mkdir(parents=True, exist_ok=True)
    database_path.unlink(missing_ok=True)
    connection = sqlite3.connect(database_path)
    try:
        connection.execute(
            "CREATE TABLE reverse_edges (target_repo TEXT, target_path TEXT, "
            "source_repo TEXT, source_path TEXT, edge_kind TEXT, "
            "PRIMARY KEY(target_repo,target_path,source_repo,source_path,edge_kind))"
        )
        batch: list[tuple[str, str, str, str, str]] = []

        def flush() -> None:
            if batch:
                connection.executemany(
                    "INSERT OR IGNORE INTO reverse_edges VALUES (?,?,?,?,?)", batch
                )
                batch.clear()

        for row in _iter_jsonl(code_dir / "import_edges.jsonl"):
            target = row.get("resolved_target_path")
            repository = row.get("repository_key")
            source = row.get("source_path")
            if target and repository and source:
                batch.append(
                    (str(repository), str(target), str(repository), str(source), "IMPORT")
                )
                if len(batch) >= 20_000:
                    flush()
        for row in _iter_jsonl(code_dir / "references.jsonl"):
            target = row.get("resolved_path")
            source_repo = row.get("repository_key")
            source = row.get("path")
            target_repo = row.get("resolved_repository_key") or source_repo
            if target and source_repo and source and target_repo:
                batch.append(
                    (str(target_repo), str(target), str(source_repo), str(source), "REFERENCE")
                )
                if len(batch) >= 20_000:
                    flush()
        flush()
        connection.commit()
        connection.execute(
            "CREATE INDEX reverse_target ON reverse_edges(target_repo,target_path)"
        )
        affected = set(seeds)
        queue = list(sorted(seeds))
        discovered_by = {"IMPORT": 0, "REFERENCE": 0}
        while queue:
            target_repo, target_path = queue.pop(0)
            rows = connection.execute(
                "SELECT source_repo,source_path,edge_kind FROM reverse_edges "
                "WHERE target_repo=? AND target_path=? "
                "ORDER BY source_repo,source_path,edge_kind",
                (target_repo, target_path),
            )
            for source_repo, source_path, edge_kind in rows:
                key = (str(source_repo), str(source_path))
                if key in affected:
                    continue
                affected.add(key)
                queue.append(key)
                discovered_by[str(edge_kind)] = discovered_by.get(str(edge_kind), 0) + 1
        edge_count = int(
            connection.execute("SELECT COUNT(*) FROM reverse_edges").fetchone()[0]
        )
    finally:
        connection.close()
    evidence = {
        "seed_path_count": len(seeds),
        "reverse_edge_count": edge_count,
        "reverse_import_dependent_count": discovered_by.get("IMPORT", 0),
        "reverse_reference_dependent_count": discovered_by.get("REFERENCE", 0),
        "reindexed_path_count": len(affected),
        "seed_paths": [
            {"repository_key": repository, "path": path}
            for repository, path in sorted(seeds)
        ],
        "reindexed_paths": [
            {"repository_key": repository, "path": path}
            for repository, path in sorted(affected)
        ],
    }
    return affected, evidence


def _git_path_exists(repo: Path, commit: str, path: str) -> bool:
    return subprocess.run(
        ("git", "-C", str(repo), "cat-file", "-e", f"{commit}:{path}"),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    ).returncode == 0


def _provider_context_paths(ref: RepositoryRef, paths: set[str]) -> list[str]:
    result = set(paths)
    metadata = {
        "package.json", "package-lock.json", "tsconfig.json", "jsconfig.json",
        "pyproject.toml", "setup.cfg", "setup.py", "requirements.txt",
        "requirements.lock", "mypy.ini", "pytest.ini",
    }
    for name in metadata:
        if _git_path_exists(ref.path, ref.commit, name):
            result.add(name)
    for path in list(paths):
        parent = PurePosixPath(path).parent
        while str(parent) not in {"", "."}:
            init_path = str(parent / "__init__.py")
            if _git_path_exists(ref.path, ref.commit, init_path):
                result.add(init_path)
            parent = parent.parent
    return sorted(result)


def _create_sparse_worktree(
    *, ref: RepositoryRef, paths: set[str], target: Path,
) -> None:
    shutil.rmtree(target, ignore_errors=True)
    _run(
        ("git", "-C", str(ref.path), "worktree", "add", "--detach", "--no-checkout", str(target), ref.commit)
    )
    _run(("git", "-C", str(target), "sparse-checkout", "init", "--no-cone"))
    selected = _provider_context_paths(ref, paths)
    process = subprocess.run(
        ("git", "-C", str(target), "sparse-checkout", "set", "--no-cone", "--stdin"),
        input="\n".join(selected) + "\n",
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if process.returncode:
        raise PrepareError(f"cannot configure sparse provider project: {process.stderr}")
    _run(("git", "-C", str(target), "checkout", "--force", ref.commit))


def _remove_sparse_worktree(ref: RepositoryRef, target: Path) -> None:
    if target.exists():
        subprocess.run(
            ("git", "-C", str(ref.path), "worktree", "remove", "--force", str(target)),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    subprocess.run(
        ("git", "-C", str(ref.path), "worktree", "prune"),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def _write_partial_inventory(
    *, full_inventory: Path, affected: set[tuple[str, str]], output: Path,
) -> int:
    count = 0
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as handle:
        for row in _iter_jsonl(full_inventory):
            if _inventory_key(row) not in affected:
                continue
            handle.write(_canonical_bytes(row))
            count += 1
    if count != len(affected):
        raise PrepareError(
            f"partial inventory coverage mismatch: expected={len(affected)} actual={count}"
        )
    return count


def _run_partial_code_index(
    *, repo_root: Path, inventory: Path, provider_repos: Mapping[str, Path],
    work_root: Path, output: Path,
) -> Mapping[str, Any]:
    python = sys.executable
    scip_work = work_root / "partial-scip"
    shutil.rmtree(scip_work, ignore_errors=True)
    shutil.rmtree(output, ignore_errors=True)
    scip_work.mkdir(parents=True, exist_ok=True)
    repo_args: list[str] = []
    for key in ("Cocolon", "mashos-api"):
        repo_args.extend(("--repo", f"{key}={provider_repos[key]}"))
    _run(
        (
            python, str(repo_root / "tools/cocolon_context_code_index.py"),
            "run-scip", "--inventory", str(inventory), *repo_args,
            "--work", str(scip_work),
        ),
        cwd=repo_root,
    )
    _run(
        (
            python, str(repo_root / "tools/cocolon_context_code_index.py"),
            "build", "--inventory", str(inventory), *repo_args,
            "--scip-work", str(scip_work),
            "--ts-helper", str(repo_root / "tools/cocolon_context_ts_syntax.cjs"),
            "--output", str(output),
        ),
        cwd=repo_root,
    )
    _run(
        (
            python, str(repo_root / "tools/cocolon_context_code_index.py"),
            "verify", "--inventory", str(inventory), "--output", str(output),
        ),
        cwd=repo_root,
    )
    return _load_json(output / "provider_runs.json")


def _partition_key_for_file(
    name: str, row: Mapping[str, Any]
) -> tuple[str, str] | None:
    source_fields = {
        "import_edges.jsonl": "source_path",
    }
    field = source_fields.get(name, "path")
    key = _row_source_key(row, source_field=field)
    if key is not None:
        return key
    repository = row.get("repository_key") or row.get("workspace_repository_key")
    for candidate in ("document_path", "relative_path", "source_path"):
        if repository and row.get(candidate):
            return str(repository), str(row[candidate])
    return None


def _row_sort_key(name: str, row: Mapping[str, Any]) -> tuple[Any, ...]:
    key = _partition_key_for_file(name, row) or ("", "")
    return (
        key[0], key[1],
        int(row.get("line") or -1),
        int(row.get("column") or -1),
        str(row.get("symbol_id") or row.get("reference_id") or row.get("edge_id") or ""),
        _canonical_bytes(row),
    )


def _merge_code_partition(
    *, target: Path, partial: Path, affected: set[tuple[str, str]], name: str,
) -> tuple[int, int]:
    kept_rows: list[dict[str, Any]] = []
    replaced = 0
    for row in _iter_jsonl(target):
        if _partition_key_for_file(name, row) in affected:
            replaced += 1
        else:
            kept_rows.append(row)
    partial_rows = list(_iter_jsonl(partial)) if partial.is_file() else []
    outside = [
        _partition_key_for_file(name, row)
        for row in partial_rows
        if _partition_key_for_file(name, row) not in affected
    ]
    if outside:
        raise PrepareError(f"partial {name} contains rows outside affected set: {outside[:10]}")
    merged = sorted([*kept_rows, *partial_rows], key=lambda row: _row_sort_key(name, row))
    _write_jsonl(target, merged)
    return len(kept_rows), replaced


def _line_count(path: Path) -> int:
    count = 0
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            count += chunk.count(b"\n")
    return count


def _merge_provider_runs(
    *, target: Path, partial: Path, refs: Mapping[str, RepositoryRef],
    inventory_sha: str, affected: set[tuple[str, str]],
) -> Mapping[str, Any]:
    base = _load_json(target)
    delta = _load_json(partial)
    delta_by_id = {
        str(run.get("run_id")): run
        for run in delta.get("runs", [])
        if isinstance(run, dict) and run.get("run_id")
    }
    affected_by_repo: dict[str, list[str]] = {}
    for repository, path in sorted(affected):
        affected_by_repo.setdefault(repository, []).append(path)
    refreshes = list(base.get("incremental_refreshes", []))
    refreshes.append(
        {
            "execution_mode": "AFFECTED_FILES_AND_REVERSE_DEPENDENTS",
            "affected_paths": [
                {"repository_key": repository, "path": path}
                for repository, path in sorted(affected)
            ],
            "partial_runs": list(delta_by_id.values()),
        }
    )
    for run in base.get("runs", []):
        if not isinstance(run, dict):
            continue
        repository = str(run.get("repository_key") or "")
        old_commit = run.get("source_commit")
        if repository in refs:
            run["source_commit"] = refs[repository].commit
        if repository in affected_by_repo:
            run["execution_mode"] = "INCREMENTAL_SEGMENT_MERGE"
            run["base_source_commit"] = old_commit
            run["affected_path_count"] = len(affected_by_repo[repository])
            run["delta_run"] = delta_by_id.get(str(run.get("run_id")))
    base["inventory_sha256"] = inventory_sha
    base["source_commits"] = {
        key: value.commit for key, value in sorted(refs.items())
    }
    base["incremental_refreshes"] = refreshes[-8:]
    base["failures"] = list(delta.get("failures", []))
    base["required_scip_runs_ok"] = bool(
        base.get("required_scip_runs_ok") and delta.get("required_scip_runs_ok", True)
    )
    _write_atomic(target, _canonical_bytes(base))
    return base


def _recompute_code_summary(
    *, code_dir: Path, inventory: Path, previous: Mapping[str, Any]
) -> Mapping[str, Any]:
    inventory_keys = {_inventory_key(row) for row in _iter_jsonl(inventory)}
    coverage_rows = list(_iter_jsonl(code_dir / "file_coverage.jsonl"))
    coverage_keys = [_inventory_key(row) for row in coverage_rows]
    coverage_set = set(coverage_keys)
    mode_counts: dict[str, int] = {}
    for row in coverage_rows:
        mode = str(row.get("index_mode") or "UNKNOWN")
        mode_counts[mode] = mode_counts.get(mode, 0) + 1
    summary = dict(previous)
    summary.update(
        {
            "inventory_total": len(inventory_keys),
            "coverage_total": len(coverage_rows),
            "coverage_gap_count": len(inventory_keys - coverage_set),
            "duplicate_coverage_count": len(coverage_keys) - len(coverage_set),
            "missing_coverage_count": len(inventory_keys - coverage_set),
            "extra_coverage_count": len(coverage_set - inventory_keys),
            "mode_counts": dict(sorted(mode_counts.items())),
            "parse_error_count": _line_count(code_dir / "parse_errors.jsonl"),
            "reference_count": _line_count(code_dir / "references.jsonl"),
            "symbol_count": _line_count(code_dir / "symbols.jsonl"),
            "import_edge_count": _line_count(code_dir / "import_edges.jsonl"),
            "unmatched_scip_document_count": _line_count(
                code_dir / "unmatched_scip_documents.jsonl"
            ),
            "scip_precise_file_count": mode_counts.get("PRECISE_SCIP", 0),
            "product_credit": 0,
            "automatic_progression": False,
        }
    )
    _write_atomic(code_dir / "code_index_summary.json", _canonical_bytes(summary))
    return summary


def _refresh_code_manifest(*, code_dir: Path, inventory: Path) -> Mapping[str, Any]:
    manifest_path = code_dir / "code_index_manifest.json"
    manifest = _load_json(manifest_path)
    manifest["inventory_sha256"] = sha256_file(inventory)
    outputs = manifest.get("output_sha256")
    if not isinstance(outputs, dict):
        raise PrepareError("code-index manifest output map missing")
    manifest["output_sha256"] = {
        str(name): sha256_file(code_dir / str(name)) for name in sorted(outputs)
    }
    _write_atomic(manifest_path, _canonical_bytes(manifest))
    return manifest


def _route_row_identity(name: str, row: Mapping[str, Any]) -> str:
    fields = {
        "rn_calls.jsonl": ("call_id",),
        "api_routes.jsonl": ("route_id",),
        "cross_repository_route_edges.jsonl": ("edge_id",),
        "api_model_edges.jsonl": ("edge_id",),
        "backend_call_edges.jsonl": ("edge_id",),
        "route_owner_closures.jsonl": ("closure_id", "route_id"),
        "test_contract_edges.jsonl": ("edge_id",),
        "file_domain_assignments.jsonl": ("assignment_id",),
        "unresolved_api_consumers.jsonl": ("subject_id", "route_id"),
        "unresolved_backend_owners.jsonl": ("subject_id", "route_id"),
        "unresolved_rn_calls.jsonl": ("subject_id", "call_id"),
        "unresolved_test_contracts.jsonl": ("subject_id", "route_id"),
        "route_extraction_errors.jsonl": ("error_id", "subject_id"),
    }
    for field in fields.get(name, ()):
        if row.get(field):
            return f"{field}:{row[field]}"
    return "row:" + hashlib.sha256(_canonical_bytes(row)).hexdigest()


def _nested_contains_path(value: Any, affected_paths: set[str]) -> bool:
    if isinstance(value, str):
        return value in affected_paths
    if isinstance(value, list):
        return any(_nested_contains_path(item, affected_paths) for item in value)
    if isinstance(value, dict):
        return any(_nested_contains_path(item, affected_paths) for item in value.values())
    return False


def _rows_by_identity(path: Path, name: str) -> dict[str, dict[str, Any]]:
    if not path.is_file():
        return {}
    result: dict[str, dict[str, Any]] = {}
    for row in _iter_jsonl(path):
        identity = _route_row_identity(name, row)
        if identity in result:
            raise PrepareError(f"duplicate route row identity {name}: {identity}")
        result[identity] = row
    return result


def _merge_route_candidate(
    *, old_route_dir: Path, candidate_dir: Path,
    affected_keys: set[tuple[str, str]], replacements: Mapping[str, str],
) -> dict[str, Any]:
    """Admit only candidate row deltas inside the affected Step 3 closure."""
    affected_cocolon = {path for repo, path in affected_keys if repo == "Cocolon"}
    affected_mashos = {path for repo, path in affected_keys if repo == "mashos-api"}
    all_affected_paths = affected_cocolon | affected_mashos

    def load(name: str, root: Path) -> list[dict[str, Any]]:
        path = root / name
        return list(_iter_jsonl(path)) if path.is_file() else []

    old_calls = load("rn_calls.jsonl", old_route_dir)
    new_calls = load("rn_calls.jsonl", candidate_dir)
    old_routes = load("api_routes.jsonl", old_route_dir)
    new_routes = load("api_routes.jsonl", candidate_dir)
    old_cross = load("cross_repository_route_edges.jsonl", old_route_dir)
    new_cross = load("cross_repository_route_edges.jsonl", candidate_dir)

    affected_calls: set[str] = set()
    affected_routes: set[str] = set()
    for row in [*old_calls, *new_calls]:
        if row.get("path") in affected_cocolon or _nested_contains_path(
            row.get("consumer_files", []), affected_cocolon
        ):
            if row.get("call_id"):
                affected_calls.add(str(row["call_id"]))
            affected_routes.update(str(value) for value in row.get("matched_route_ids", []))
    for row in [*old_routes, *new_routes]:
        if row.get("path") in affected_mashos and row.get("route_id"):
            affected_routes.add(str(row["route_id"]))

    for name in (
        "backend_call_edges.jsonl", "route_owner_closures.jsonl",
        "test_contract_edges.jsonl", "route_extraction_errors.jsonl",
    ):
        for row in [*load(name, old_route_dir), *load(name, candidate_dir)]:
            if _nested_contains_path(row, all_affected_paths) and row.get("route_id"):
                affected_routes.add(str(row["route_id"]))

    changed = True
    while changed:
        changed = False
        for row in [*old_cross, *new_cross]:
            call_id = str(row.get("rn_call_id") or "")
            route_id = str(row.get("api_route_id") or "")
            if call_id in affected_calls and route_id and route_id not in affected_routes:
                affected_routes.add(route_id)
                changed = True
            if route_id in affected_routes and call_id and call_id not in affected_calls:
                affected_calls.add(call_id)
                changed = True

    manifest = _load_json(candidate_dir / "route_graph_manifest.json")
    outputs = manifest.get("output_sha256")
    if not isinstance(outputs, dict):
        raise PrepareError("route candidate manifest output map missing")
    evidence_outputs: dict[str, Any] = {}

    def admitted(name: str, row: Mapping[str, Any]) -> bool:
        if name == "rn_calls.jsonl":
            return str(row.get("call_id") or "") in affected_calls or row.get("path") in affected_cocolon
        if name == "api_routes.jsonl":
            return str(row.get("route_id") or "") in affected_routes or row.get("path") in affected_mashos
        if name == "cross_repository_route_edges.jsonl":
            return (
                str(row.get("rn_call_id") or "") in affected_calls
                or str(row.get("api_route_id") or "") in affected_routes
            )
        if name == "file_domain_assignments.jsonl":
            key = _row_source_key(row)
            return key in affected_keys
        route_id = str(row.get("route_id") or "")
        if route_id:
            return route_id in affected_routes
        call_id = str(row.get("call_id") or row.get("rn_call_id") or "")
        if call_id:
            return call_id in affected_calls
        return _nested_contains_path(row, all_affected_paths)

    for name in sorted(outputs):
        candidate_path = candidate_dir / name
        target_path = old_route_dir / name
        if name.endswith(".json"):
            shutil.copy2(candidate_path, target_path)
            evidence_outputs[name] = {"aggregate_metadata_replaced": True}
            continue
        if not name.endswith(".jsonl"):
            shutil.copy2(candidate_path, target_path)
            evidence_outputs[name] = {"non_jsonl_replaced": True}
            continue
        old_rows = _rows_by_identity(target_path, name)
        candidate_rows = _rows_by_identity(candidate_path, name)
        changed_ids = {
            identity
            for identity in set(old_rows) | set(candidate_rows)
            if old_rows.get(identity) != candidate_rows.get(identity)
        }
        outside = [
            identity
            for identity in sorted(changed_ids)
            if not admitted(name, candidate_rows.get(identity) or old_rows[identity])
        ]
        if outside:
            raise PrepareError(
                f"route candidate changed rows outside affected closure in {name}: {outside[:20]}"
            )
        # Candidate ordering is canonical; unchanged identities were proven byte-equal.
        shutil.copy2(candidate_path, target_path)
        evidence_outputs[name] = {
            "old_row_count": len(old_rows),
            "candidate_row_count": len(candidate_rows),
            "changed_row_count": len(changed_ids),
            "unchanged_row_count": len(set(old_rows) & set(candidate_rows) - changed_ids),
        }

    shutil.copy2(candidate_dir / "route_graph_manifest.json", old_route_dir / "route_graph_manifest.json")
    return {
        "affected_rn_call_count": len(affected_calls),
        "affected_route_count": len(affected_routes),
        "affected_rn_call_ids": sorted(affected_calls),
        "affected_route_ids": sorted(affected_routes),
        "outputs": evidence_outputs,
    }


def _incremental_source_dependent_closure(
    *, repo_root: Path, system_context_root: Path, workspace: str,
    workspace_dir: Path, refs: Mapping[str, RepositoryRef], profiles_path: Path,
    changes: Sequence[Change], work_root: Path, max_part_bytes: int,
) -> tuple[Mapping[str, Any], Mapping[str, Any]]:
    """Refresh Step 1, affected Step 2 rows, and the affected Step 3 closure."""
    verify_outputs(workspace_dir)
    materialized = work_root / "incremental-source"
    materialize_outputs(workspace_dir, materialized)
    shutil.rmtree(materialized / "task_context", ignore_errors=True)
    for name in (RECEIPT_NAME, REPORT_NAME):
        (materialized / name).unlink(missing_ok=True)

    old_inventory_rows = list(_iter_jsonl(materialized / "files.jsonl"))
    old_inventory = {_inventory_key(row): row for row in old_inventory_rows}
    old_lock = _load_json(materialized / "workspace_lock.json")
    old_refs = {
        str(row["key"]): (str(row["source_commit"]), str(row["source_tree"]))
        for row in old_lock.get("repositories", [])
    }

    outputs = build_inventory_bytes(
        profiles_path,
        workspace,
        {key: value.path for key, value in refs.items()},
        {key: value.commit for key, value in refs.items()},
    )
    for name, data in outputs.items():
        write_inventory_output(materialized / name, data)
    new_inventory_rows = list(_iter_jsonl(materialized / "files.jsonl"))
    new_inventory = {_inventory_key(row): row for row in new_inventory_rows}
    if set(old_inventory) != set(new_inventory):
        raise PrepareError("source incremental path cannot admit add/delete/rename")

    seeds = {
        (change.repository_key, str(change.new_path or change.old_path))
        for change in changes
        if change.status == "MODIFIED"
        and change.new_path
        and _is_source(change.new_path)
    }
    if not seeds or len(seeds) != len(changes):
        raise PrepareError("source incremental refresh requires modified source paths only")
    actual_changed = {
        key
        for key in new_inventory
        if old_inventory[key].get("content_sha256") != new_inventory[key].get("content_sha256")
        or old_inventory[key].get("object_mode") != new_inventory[key].get("object_mode")
        or old_inventory[key].get("object_type") != new_inventory[key].get("object_type")
    }
    if actual_changed != seeds:
        raise PrepareError(
            f"source changed-row mismatch: declared={sorted(seeds)} actual={sorted(actual_changed)}"
        )

    code_dir = materialized / "code_index"
    affected, reverse_evidence = _derive_reverse_dependents(
        code_dir=code_dir,
        seeds=seeds,
        database_path=work_root / "reverse-dependents.sqlite3",
    )
    missing = sorted(affected - set(new_inventory))
    if missing:
        raise PrepareError(f"reverse dependent is absent from current inventory: {missing[:20]}")

    partial_inventory = work_root / "partial-files.jsonl"
    _write_partial_inventory(
        full_inventory=materialized / "files.jsonl",
        affected=affected,
        output=partial_inventory,
    )
    provider_repos = {key: value.path for key, value in refs.items()}
    sparse_targets: dict[str, Path] = {}
    try:
        for key, ref in refs.items():
            paths = {path for repository, path in affected if repository == key}
            if not paths:
                continue
            target = work_root / "sparse" / key
            _create_sparse_worktree(ref=ref, paths=paths, target=target)
            provider_repos[key] = target
            sparse_targets[key] = target
        partial_code = work_root / "partial-code-index"
        _run_partial_code_index(
            repo_root=repo_root,
            inventory=partial_inventory,
            provider_repos=provider_repos,
            work_root=work_root,
            output=partial_code,
        )
    finally:
        for key, target in sparse_targets.items():
            _remove_sparse_worktree(refs[key], target)

    partition_evidence: dict[str, Any] = {}
    for name in (
        "file_coverage.jsonl", "symbols.jsonl", "references.jsonl",
        "import_edges.jsonl", "parse_errors.jsonl",
        "unmatched_scip_documents.jsonl",
    ):
        kept, replaced = _merge_code_partition(
            target=code_dir / name,
            partial=partial_code / name,
            affected=affected,
            name=name,
        )
        partition_evidence[name] = {
            "kept_row_count": kept,
            "replaced_old_row_count": replaced,
            "inserted_row_count": _line_count(partial_code / name),
        }

    inventory_sha = sha256_file(materialized / "files.jsonl")
    _merge_provider_runs(
        target=code_dir / "provider_runs.json",
        partial=partial_code / "provider_runs.json",
        refs=refs,
        inventory_sha=inventory_sha,
        affected=affected,
    )
    previous_summary = _load_json(code_dir / "code_index_summary.json")
    _recompute_code_summary(
        code_dir=code_dir,
        inventory=materialized / "files.jsonl",
        previous=previous_summary,
    )
    _refresh_code_manifest(code_dir=code_dir, inventory=materialized / "files.jsonl")
    _run(
        (
            sys.executable, str(repo_root / "tools/cocolon_context_code_index.py"),
            "verify", "--inventory", str(materialized / "files.jsonl"),
            "--output", str(code_dir),
        ),
        cwd=repo_root,
    )

    replacements: dict[str, str] = {}
    for key, (old_commit, old_tree) in old_refs.items():
        replacements[old_commit] = refs[key].commit
        replacements[old_tree] = refs[key].tree
    route_dir = materialized / "route_graph"
    # Rebind commit-only metadata before comparing semantic candidate rows.
    for path in sorted(route_dir.iterdir()):
        if path.name == "route_graph_manifest.json" or not path.is_file():
            continue
        if path.suffix == ".json":
            _rewrite_small_json(path, replacements)
        elif path.suffix == ".jsonl":
            _write_jsonl(
                path,
                [_replace_exact_strings(row, replacements) for row in _iter_jsonl(path)],
            )

    route_candidate = work_root / "route-candidate"
    shutil.rmtree(route_candidate, ignore_errors=True)
    _run(
        (
            sys.executable, str(repo_root / "tools/cocolon_context_routes.py"),
            "build", "--inventory", str(materialized / "files.jsonl"),
            *_repo_args(refs),
            "--code-index", str(code_dir),
            "--rn-helper", str(repo_root / "tools/cocolon_context_ts_routes.cjs"),
            "--output", str(route_candidate),
        ),
        cwd=repo_root,
    )
    _run(
        (
            sys.executable, str(repo_root / "tools/cocolon_context_routes.py"),
            "verify", "--inventory", str(materialized / "files.jsonl"),
            "--code-index", str(code_dir), "--output", str(route_candidate),
        ),
        cwd=repo_root,
    )
    route_evidence = _merge_route_candidate(
        old_route_dir=route_dir,
        candidate_dir=route_candidate,
        affected_keys=affected,
        replacements=replacements,
    )
    _run(
        (
            sys.executable, str(repo_root / "tools/cocolon_context_routes.py"),
            "verify", "--inventory", str(materialized / "files.jsonl"),
            "--code-index", str(code_dir), "--output", str(route_dir),
        ),
        cwd=repo_root,
    )

    verify_inventory(
        profiles_path,
        workspace,
        {key: value.path for key, value in refs.items()},
        materialized,
    )
    pack_outputs(materialized, max_part_bytes)
    shutil.rmtree(workspace_dir)
    shutil.copytree(materialized, workspace_dir)
    transport = verify_outputs(workspace_dir)
    evidence = {
        "execution_mode": "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE",
        "reverse_dependents": reverse_evidence,
        "code_partitions": partition_evidence,
        "route_closure": route_evidence,
        "full_code_index_rebuild": False,
        "partial_code_index_provider_run": True,
        "full_route_graph_candidate_for_closure_admission": True,
        "unaffected_route_row_change_rejected": True,
    }
    return transport, evidence

def _change_json(change: Change) -> dict[str, Any]:
    return {
        "repository_key": change.repository_key,
        "status": change.status,
        "old_path": change.old_path,
        "new_path": change.new_path,
    }


def _repo_args(refs: Mapping[str, RepositoryRef]) -> list[str]:
    result: list[str] = []
    for key in ("Cocolon", "mashos-api"):
        result.extend(("--repo", f"{key}={refs[key].path}"))
    return result


def _run_layer_commands(
    *, repo_root: Path, workspace_dir: Path, refs: Mapping[str, RepositoryRef], work_root: Path
) -> None:
    python = sys.executable
    inventory = workspace_dir / "files.jsonl"
    scip_work = work_root / "scip-step2"
    shutil.rmtree(scip_work, ignore_errors=True)
    scip_work.mkdir(parents=True, exist_ok=True)
    repo_args = _repo_args(refs)
    _run((python, str(repo_root / "tools/cocolon_context_code_index.py"), "run-scip", "--inventory", str(inventory), *repo_args, "--work", str(scip_work)), cwd=repo_root)
    _run((python, str(repo_root / "tools/cocolon_context_code_index.py"), "build", "--inventory", str(inventory), *repo_args, "--scip-work", str(scip_work), "--ts-helper", str(repo_root / "tools/cocolon_context_ts_syntax.cjs"), "--output", str(workspace_dir / "code_index")), cwd=repo_root)
    _run((python, str(repo_root / "tools/cocolon_context_code_index.py"), "verify", "--inventory", str(inventory), "--output", str(workspace_dir / "code_index")), cwd=repo_root)
    _run((python, str(repo_root / "tools/cocolon_context_routes.py"), "build", "--inventory", str(inventory), *repo_args, "--code-index", str(workspace_dir / "code_index"), "--rn-helper", str(repo_root / "tools/cocolon_context_ts_routes.cjs"), "--output", str(workspace_dir / "route_graph")), cwd=repo_root)
    _run((python, str(repo_root / "tools/cocolon_context_routes.py"), "verify", "--inventory", str(inventory), "--code-index", str(workspace_dir / "code_index"), "--output", str(workspace_dir / "route_graph")), cwd=repo_root)


def _build_all(
    *, repo_root: Path, system_context_root: Path, workspace: str,
    workspace_dir: Path, refs: Mapping[str, RepositoryRef], profiles_path: Path,
    work_root: Path, max_part_bytes: int,
) -> dict[str, Any]:
    shutil.rmtree(workspace_dir, ignore_errors=True)
    workspace_dir.mkdir(parents=True, exist_ok=True)
    outputs = build_inventory_bytes(
        profiles_path,
        workspace,
        {key: value.path for key, value in refs.items()},
        {key: value.commit for key, value in refs.items()},
    )
    for name, data in outputs.items():
        write_inventory_output(workspace_dir / name, data)
    verify_inventory(
        profiles_path,
        workspace,
        {key: value.path for key, value in refs.items()},
        workspace_dir,
    )
    _run_layer_commands(
        repo_root=repo_root,
        workspace_dir=workspace_dir,
        refs=refs,
        work_root=work_root,
    )
    return pack_outputs(workspace_dir, max_part_bytes)


def _verify_workspace(
    *, repo_root: Path, workspace: str, workspace_dir: Path,
    refs: Mapping[str, RepositoryRef], profiles_path: Path,
) -> dict[str, Any]:
    verify_inventory(
        profiles_path,
        workspace,
        {key: value.path for key, value in refs.items()},
        workspace_dir,
    )
    _run((sys.executable, str(repo_root / "tools/cocolon_context_code_index.py"), "verify", "--inventory", str(workspace_dir / "files.jsonl"), "--output", str(workspace_dir / "code_index")), cwd=repo_root)
    _run((sys.executable, str(repo_root / "tools/cocolon_context_routes.py"), "verify", "--inventory", str(workspace_dir / "files.jsonl"), "--code-index", str(workspace_dir / "code_index"), "--output", str(workspace_dir / "route_graph")), cwd=repo_root)
    return verify_outputs(workspace_dir)


def _compile_and_pack_task(
    *, repo_root: Path, system_context_root: Path, external_workspace_root: Path,
    workspace: str, task: str, task_profiles_path: Path, task_output: Path,
    remote_verified: bool, max_part_bytes: int,
) -> Mapping[str, Any]:
    compile_task_context(
        repo_root=repo_root,
        system_context_root=system_context_root,
        workspace=workspace,
        task=task,
        task_profiles_path=task_profiles_path,
        manual_overlay_path=None,
        output_dir=task_output,
        external_workspace_root=external_workspace_root,
        remote_verified=remote_verified,
    )
    pack_outputs(task_output, max_part_bytes)
    return _verify_task(task_output)


def _verify_task(task_output: Path) -> Mapping[str, Any]:
    verify_outputs(task_output)
    with tempfile.TemporaryDirectory(prefix="cocolon-task-context-materialized-") as temporary:
        materialized = materialize_outputs(task_output, Path(temporary) / "task")
        return verify_task_context(materialized)


def _receipt_markdown(receipt: Mapping[str, Any]) -> bytes:
    refs = receipt["resolved_refs"]
    lines = [
        "# Cocolon System Context prepare summary",
        "",
        f"- status: `{receipt['status']}`",
        f"- execution_mode: `{receipt['refresh_plan']['execution_mode']}`",
        f"- workspace: `{receipt['workspace']}`",
        f"- task: `{receipt['task']}`",
        f"- Cocolon: `{refs['Cocolon']['commit']}`",
        f"- mashos-api: `{refs['mashos-api']['commit']}`",
        f"- context_fingerprint: `{receipt['task_context']['context_fingerprint']}`",
        f"- task_status: `{receipt['task_context']['status']}`",
        f"- changed_path_count: `{receipt['refresh_plan']['changed_path_count']}`",
        f"- manual_operation_count: `{receipt['manual_operation_count']}`",
        f"- completion_claim: `{receipt.get('completion_claim')}`",
        f"- overall_claim: `{receipt.get('overall_claim')}`",
        "- product_credit: `0`",
        "- automatic_progression: `false`",
        "",
        "The actual full-text confirmation order is `task_context/"
        + str(receipt["task"])
        + "/full_text_read_order.md`.",
        "",
    ]
    return "\n".join(lines).encode("utf-8")


def _write_receipt(workspace_dir: Path, receipt: Mapping[str, Any]) -> None:
    _write_atomic(workspace_dir / RECEIPT_NAME, _pretty_bytes(receipt))
    _write_atomic(workspace_dir / REPORT_NAME, _receipt_markdown(receipt))


def prepare(
    *, repo_root: Path, system_context_root: Path, external_workspace_root: Path,
    workspace: str, task: str, remote_verified: bool = False,
    fresh_clone_verified: bool = False,
    non_code_incremental_verified: bool = False,
    source_incremental_verified: bool = False,
    source_incremental_evidence_path: Path | None = None,
    verify_only: bool = False,
    require_remote_verified: bool = False,
    max_part_bytes: int = DEFAULT_MAX_PART_BYTES,
) -> Mapping[str, Any]:
    repo_root = repo_root.resolve()
    system_context_root = system_context_root.resolve()
    external_workspace_root = external_workspace_root.resolve()
    profiles_path = system_context_root / "workspace_profiles.json"
    task_profiles_path = system_context_root / "task_profiles.json"
    profiles = _load_json(profiles_path)
    workspace_profile = profiles.get("profiles", {}).get(workspace)
    if not isinstance(workspace_profile, dict):
        raise PrepareError(f"workspace profile not found: {workspace}")
    refs = _resolve_refs(
        repo_root=repo_root,
        external_workspace_root=external_workspace_root,
        workspace_profile=workspace_profile,
    )
    workspace_dir = system_context_root / "current" / workspace
    task_output = workspace_dir / "task_context" / task
    previous_receipt_path = workspace_dir / RECEIPT_NAME
    previous_receipt = (
        _load_json(previous_receipt_path) if previous_receipt_path.is_file() else {}
    )
    external_source_incremental_evidence: Mapping[str, Any] | None = None
    if source_incremental_evidence_path is not None:
        loaded_evidence = _load_json(source_incremental_evidence_path.resolve())
        if not isinstance(loaded_evidence, dict):
            raise PrepareError("source incremental evidence must be a JSON object")
        external_source_incremental_evidence = loaded_evidence
    saved_refs = _load_saved_refs(workspace_dir)
    changes: list[Change] = []
    for key, repo_ref in refs.items():
        changes.extend(_diff_changes(repo_ref, saved_refs.get(key)))
    forced_full_rebuild_reasons = _forced_full_rebuild_reasons(
        refs=refs,
        saved_refs=saved_refs,
        changes=changes,
    )
    refresh_plan = plan_refresh(
        changes,
        forced_full_rebuild_reasons=forced_full_rebuild_reasons,
    )
    current_ref_map = {key: ref.commit for key, ref in refs.items()}
    refs_match = saved_refs == current_ref_map

    if verify_only:
        if not refs_match:
            raise PrepareError(f"verify-only ref mismatch: saved={saved_refs} actual={current_ref_map}")
        workspace_transport = _verify_workspace(
            repo_root=repo_root,
            workspace=workspace,
            workspace_dir=workspace_dir,
            refs=refs,
            profiles_path=profiles_path,
        )
        task_manifest = _verify_task(task_output)
        if require_remote_verified and task_manifest.get("status") != STEP4_CLAIM:
            raise PrepareError("remote-verified Step 4 context is required")
        receipt = _load_json(workspace_dir / RECEIPT_NAME)
        if require_remote_verified:
            if receipt.get("completion_claim") != STEP5_CLAIM or receipt.get("overall_claim") != OVERALL_CLAIM:
                raise PrepareError("Step 5 completion receipt is not remotely sealed")
        return receipt

    work_root = external_workspace_root / "prepare" / workspace
    work_root.mkdir(parents=True, exist_ok=True)
    workspace_transport: Mapping[str, Any]
    source_incremental_evidence: Mapping[str, Any] | None = None
    execution_mode = refresh_plan["execution_mode"]
    if refs_match and workspace_dir.is_dir():
        workspace_transport = _verify_workspace(
            repo_root=repo_root,
            workspace=workspace,
            workspace_dir=workspace_dir,
            refs=refs,
            profiles_path=profiles_path,
        )
    elif execution_mode == "INCREMENTAL_NON_CODE_REBIND" and workspace_dir.is_dir():
        workspace_transport = _incremental_non_code_rebind(
            repo_root=repo_root,
            system_context_root=system_context_root,
            workspace=workspace,
            workspace_dir=workspace_dir,
            refs=refs,
            profiles_path=profiles_path,
            changes=changes,
            work_root=work_root,
            max_part_bytes=max_part_bytes,
        )
    elif execution_mode == "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE" and workspace_dir.is_dir():
        workspace_transport, source_incremental_evidence = (
            _incremental_source_dependent_closure(
                repo_root=repo_root,
                system_context_root=system_context_root,
                workspace=workspace,
                workspace_dir=workspace_dir,
                refs=refs,
                profiles_path=profiles_path,
                changes=changes,
                work_root=work_root,
                max_part_bytes=max_part_bytes,
            )
        )
    else:
        workspace_transport = _build_all(
            repo_root=repo_root,
            system_context_root=system_context_root,
            workspace=workspace,
            workspace_dir=workspace_dir,
            refs=refs,
            profiles_path=profiles_path,
            work_root=work_root,
            max_part_bytes=max_part_bytes,
        )

    task_needs_compile = not task_output.is_dir() or not refs_match or remote_verified
    task_manifest: Mapping[str, Any]
    if task_needs_compile:
        task_manifest = _compile_and_pack_task(
            repo_root=repo_root,
            system_context_root=system_context_root,
            external_workspace_root=external_workspace_root,
            workspace=workspace,
            task=task,
            task_profiles_path=task_profiles_path,
            task_output=task_output,
            remote_verified=remote_verified,
            max_part_bytes=max_part_bytes,
        )
        if refs_match and remote_verified:
            execution_mode = "TASK_CONTEXT_REMOTE_SEAL"
    else:
        task_manifest = _verify_task(task_output)

    cumulative_changed_refresh = bool(
        (
            changes
            and execution_mode in {
                "FULL_REBUILD_FALLBACK",
                "INCREMENTAL_NON_CODE_REBIND",
                "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE",
            }
        )
        or previous_receipt.get("changed_ref_refresh_verified")
    )
    cumulative_fallback = bool(
        (changes and refresh_plan["fallback_reasons"])
        or previous_receipt.get("full_rebuild_fallback_verified")
    )
    inherited_remote_seal = bool(
        refs_match
        and previous_receipt.get("remote_verified") is True
        and previous_receipt.get("completion_claim") == STEP5_CLAIM
        and previous_receipt.get("overall_claim") == OVERALL_CLAIM
        and previous_receipt.get("fresh_clone_deterministic_verified") is True
        and task_manifest.get("status") == STEP4_CLAIM
    )
    effective_remote_verified = bool(remote_verified or inherited_remote_seal)
    effective_fresh_clone_verified = bool(
        fresh_clone_verified or inherited_remote_seal
    )
    effective_non_code_incremental_verified = bool(
        non_code_incremental_verified
        or execution_mode == "INCREMENTAL_NON_CODE_REBIND"
        or previous_receipt.get("semantic_reuse", {}).get(
            "non_code_incremental_rebind_verified"
        )
    )
    previous_source_evidence = previous_receipt.get("semantic_reuse", {}).get(
        "source_incremental_evidence"
    )
    source_incremental_proof: Mapping[str, Any] | None
    if source_incremental_evidence is not None:
        source_incremental_proof = source_incremental_evidence
    elif external_source_incremental_evidence is not None:
        source_incremental_proof = external_source_incremental_evidence
    elif isinstance(previous_source_evidence, dict):
        source_incremental_proof = previous_source_evidence
    else:
        source_incremental_proof = None
    effective_source_incremental_verified = bool(
        execution_mode == "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE"
        or (
            source_incremental_verified
            and source_incremental_proof is not None
        )
        or (
            previous_receipt.get("semantic_reuse", {}).get(
                "source_reverse_dependent_and_route_closure_verified"
            )
            and source_incremental_proof is not None
        )
    )
    if changes:
        changed_ref_refresh_evidence: Mapping[str, Any] | None = {
            "previous_refs": dict(sorted(saved_refs.items())),
            "resolved_refs": dict(sorted(current_ref_map.items())),
            "refresh_plan": refresh_plan,
            "changed_paths": [_change_json(change) for change in changes],
            "source_incremental_evidence": (
                dict(source_incremental_evidence)
                if source_incremental_evidence is not None
                else None
            ),
        }
    else:
        previous_evidence = previous_receipt.get("changed_ref_refresh_evidence")
        changed_ref_refresh_evidence = (
            previous_evidence if isinstance(previous_evidence, dict) else None
        )
    complete = bool(
        effective_remote_verified
        and effective_fresh_clone_verified
        and effective_non_code_incremental_verified
        and effective_source_incremental_verified
        and refs_match
        and task_manifest.get("status") == STEP4_CLAIM
        and cumulative_changed_refresh
        and cumulative_fallback
    )
    receipt: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "workspace": workspace,
        "task": task,
        "status": STATUS_COMPLETE if complete else STATUS_PENDING_REMOTE,
        "standard_flow": [
            "00_read_first", "workspace_resolve", "inventory_freshness",
            "task_context", "actual_full_text_read", "judgment",
        ],
        "resolved_refs": {
            key: {"commit": ref.commit, "tree": ref.tree, "path_role": key}
            for key, ref in sorted(refs.items())
        },
        "previous_refs": dict(sorted(saved_refs.items())),
        "refresh_plan": {**refresh_plan, "execution_mode": execution_mode},
        "changed_paths": [_change_json(change) for change in changes],
        "changed_ref_refresh_evidence": changed_ref_refresh_evidence,
        "workspace_transport": dict(workspace_transport),
        "task_context": {
            "status": task_manifest.get("status"),
            "context_fingerprint": task_manifest.get("context_fingerprint"),
            "selected_file_count": task_manifest.get("selected_file_count"),
            "closure_edge_count": task_manifest.get("closure_edge_count"),
            "blocking_unresolved_count": task_manifest.get("blocking_unresolved_count"),
            "actual_unincorporated_finding_count": task_manifest.get("actual_unincorporated_finding_count"),
            "output_sha256": task_manifest.get("output_sha256"),
            "manifest_sha256": sha256_file(task_output / "context_manifest.json"),
            "transport_sha256": sha256_file(task_output / "publication_transport.json"),
            "full_text_read_order": f"task_context/{task}/full_text_read_order.md",
        },
        "same_ref_reuse_verified": bool(refs_match),
        "changed_ref_refresh_verified": cumulative_changed_refresh,
        "full_rebuild_fallback_verified": cumulative_fallback,
        "semantic_reuse": {
            "full_code_index_provider_rerun": execution_mode == "FULL_REBUILD_FALLBACK",
            "partial_code_index_provider_rerun": (
                execution_mode == "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE"
            ),
            "full_route_graph_candidate_for_closure_admission": (
                execution_mode == "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE"
            ),
            "non_code_incremental_rebind_verified": (
                effective_non_code_incremental_verified
            ),
            "source_reverse_dependent_and_route_closure_verified": (
                effective_source_incremental_verified
            ),
            "source_incremental_evidence": (
                dict(source_incremental_proof)
                if source_incremental_proof is not None
                else None
            ),
        },
        "fresh_clone_deterministic_contract": "VERIFY_ONLY_BYTE_EXACT_WITH_SAME_EXACT_REFS",
        "fresh_clone_deterministic_verified": effective_fresh_clone_verified,
        "manual_operation_count": 0,
        "remote_verified": complete,
        "completion_claim": STEP5_CLAIM if complete else None,
        "overall_claim": OVERALL_CLAIM if complete else None,
        "structure_map_delta": "STRUCTURE_MAP_DELTA_NONE",
        "mashos_api_write_count": 0,
        "product_behavior_change_count": 0,
        "product_credit": 0,
        "automatic_progression": False,
    }
    _write_receipt(workspace_dir, receipt)
    return receipt


def cli(argv: Sequence[str] | None = None) -> int:
    import argparse

    parser = argparse.ArgumentParser(prog="python3 -m tools.cocolon_context prepare")
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--task", required=True)
    parser.add_argument("--repo-root", type=Path, default=Path.cwd())
    parser.add_argument("--system-context-root", type=Path)
    parser.add_argument("--external-workspace-root", type=Path)
    parser.add_argument("--remote-verified", action="store_true")
    parser.add_argument("--fresh-clone-verified", action="store_true")
    parser.add_argument("--non-code-incremental-verified", action="store_true")
    parser.add_argument("--source-incremental-verified", action="store_true")
    parser.add_argument("--source-incremental-evidence", type=Path)
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("--require-remote-verified", action="store_true")
    parser.add_argument("--max-part-bytes", type=int, default=DEFAULT_MAX_PART_BYTES)
    args = parser.parse_args(argv)
    repo_root = args.repo_root.resolve()
    system_context_root = (
        args.system_context_root.resolve()
        if args.system_context_root
        else repo_root / "Cocolon_前提資料" / "system_context"
    )
    external_workspace_root = (
        args.external_workspace_root.resolve()
        if args.external_workspace_root
        else repo_root / ".cocolon-context-workspace"
    )
    try:
        result = prepare(
            repo_root=repo_root,
            system_context_root=system_context_root,
            external_workspace_root=external_workspace_root,
            workspace=args.workspace,
            task=args.task,
            remote_verified=args.remote_verified,
            fresh_clone_verified=args.fresh_clone_verified,
            non_code_incremental_verified=args.non_code_incremental_verified,
            source_incremental_verified=args.source_incremental_verified,
            source_incremental_evidence_path=args.source_incremental_evidence,
            verify_only=args.verify_only,
            require_remote_verified=args.require_remote_verified,
            max_part_bytes=args.max_part_bytes,
        )
    except (PrepareError, InventoryError, PublicationTransportError, ContextCompileError, OSError) as exc:
        print(f"COCOLON_CONTEXT_PREPARE_ERROR: {exc}", file=sys.stderr)
        return 2
    print(_canonical_bytes(result).decode("utf-8"), end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(cli())
