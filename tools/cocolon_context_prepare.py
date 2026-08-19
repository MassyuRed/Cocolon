"""Unified standard entry for Cocolon System Context Step 5.

``prepare`` resolves exact workspace refs, verifies same-ref snapshots, derives
changed paths, performs a bounded full-rebuild fallback when the admitted SCIP
providers cannot safely merge partial indexes, recompiles the task context, and
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
import subprocess
import sys
import tempfile
from typing import Any, Mapping, Sequence

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


def plan_refresh(changes: Sequence[Change]) -> dict[str, Any]:
    """Return exact affected layers and the admitted execution fallback."""
    affected = {"inventory", "task_context"} if changes else set()
    reasons: set[str] = set()
    for change in changes:
        for path in change.paths:
            lower = path.lower()
            name = PurePosixPath(lower).name
            if (
                lower.startswith("tools/cocolon_context")
                or lower.startswith(".github/workflows/cocolon-system-context")
                or lower.endswith("workspace_profiles.json")
                or lower.endswith("task_profiles.json")
                or name in {"package.json", "package-lock.json", "pyproject.toml", "requirements.txt", "tsconfig.json"}
            ):
                affected.update({"code_index", "route_graph"})
                reasons.add("TOOLCHAIN_SCHEMA_OR_PROFILE_CHANGE")
            elif _is_source(path):
                affected.add("code_index")
                if (
                    change.repository_key == "mashos-api"
                    or any(token in lower for token in (
                        "api", "route", "router", "screen", "service", "engine", "store", "test"
                    ))
                ):
                    affected.add("route_graph")
                    reasons.add("ROUTE_OR_OWNER_CLOSURE_CHANGE")
                else:
                    reasons.add("SOURCE_GRAPH_CHANGE")
            elif any(token in lower for token in ("route", "contract", "schema", "domain")):
                affected.add("route_graph")
                reasons.add("ROUTE_METADATA_CHANGE")
            else:
                reasons.add("NON_CODE_CHANGE")
    requested_layers = sorted(affected)
    modified_non_code_only = bool(changes) and all(
        change.status == "MODIFIED"
        and all(not _is_source(path) for path in change.paths)
        and not any(
            token in path.lower()
            for token in (
                "tools/cocolon_context",
                ".github/workflows/cocolon-system-context",
                "workspace_profiles.json",
                "task_profiles.json",
                "package.json",
                "package-lock.json",
                "pyproject.toml",
                "requirements.txt",
                "tsconfig.json",
                "/route",
                "route_",
                "/schema",
                "schema_",
                "/contract",
                "contract_",
                "/domain",
                "domain_",
            )
        )
        for change in changes
        for path in [change.new_path or change.old_path or ""]
    )
    if not changes:
        execution_mode = "SAME_REF_REUSE"
        fallback = []
        executed_layers = requested_layers
    elif modified_non_code_only:
        execution_mode = "INCREMENTAL_NON_CODE_REBIND"
        fallback = []
        executed_layers = ["inventory", "task_context"]
    else:
        # The admitted SCIP exact3 providers generate repository-level snapshots.
        # Code/route/toolchain/add/delete/rename/type changes therefore use the
        # bounded repository-level rebuild rather than retaining stale rows.
        execution_mode = "FULL_REBUILD_FALLBACK"
        fallback = [
            "SCIP_PROVIDER_REPOSITORY_SNAPSHOT_REQUIRES_BOUNDED_FULL_REBUILD",
            "STALE_INDEX_REUSE_FORBIDDEN",
        ]
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
    fresh_clone_verified: bool = False, verify_only: bool = False,
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
    saved_refs = _load_saved_refs(workspace_dir)
    changes: list[Change] = []
    for key, repo_ref in refs.items():
        changes.extend(_diff_changes(repo_ref, saved_refs.get(key)))
    refresh_plan = plan_refresh(changes)
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
        (changes and execution_mode in {"FULL_REBUILD_FALLBACK", "INCREMENTAL_NON_CODE_REBIND"})
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
    complete = bool(
        effective_remote_verified
        and effective_fresh_clone_verified
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
            "code_index_provider_rerun": execution_mode != "INCREMENTAL_NON_CODE_REBIND",
            "route_graph_provider_rerun": execution_mode != "INCREMENTAL_NON_CODE_REBIND",
            "non_code_incremental_rebind_verified": bool(
                execution_mode == "INCREMENTAL_NON_CODE_REBIND"
                or previous_receipt.get("semantic_reuse", {}).get("non_code_incremental_rebind_verified")
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
