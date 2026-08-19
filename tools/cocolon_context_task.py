"""Task Context Compiler for Cocolon System Context Step 4.

The compiler is deterministic, stdlib-only, and fail-closed.  It binds Step 1,
Step 2, and Step 3 manifests, expands a task graph to a fixed point, preserves
unresolved context, and emits a full-text read order plus an actual CMEE review.

It does **not** change product behavior and it never awards product-quality
credit.  A local run cannot make the Step 4 completion claim; remote byte
verification remains a separate, durable GitHub checkpoint.
"""
from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass
from functools import lru_cache
import fnmatch
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tempfile
from typing import Any, Iterable, Iterator, Mapping, Sequence


SCHEMA_VERSION = "cocolon.system_context.task_context_manifest.v1"
PUBLICATION_TRANSPORT_SCHEMA = "cocolon.system_context.publication_transport.v1"
PUBLICATION_TRANSPORT_NAME = "publication_transport.json"
PROFILE_SCHEMA_VERSION = "cocolon.system_context.task_profiles.v1"
OUTPUT_NAMES = (
    "selected_files.jsonl",
    "closure_edges.jsonl",
    "required_category_coverage.json",
    "unresolved_context.jsonl",
    "full_text_read_order.md",
    "cmee_context_overview.md",
    "cmee_unincorporated_actual_findings.md",
)
CLASSIFICATIONS = (
    "MUST_READ_FULL",
    "REFERENCE_AS_NEEDED",
    "CURRENT_OWNER",
    "RELEVANT_HISTORICAL",
    "UNRESOLVED_CONTEXT",
)
CLASSIFICATION_PRIORITY = {
    "CURRENT_OWNER": 0,
    "MUST_READ_FULL": 1,
    "RELEVANT_HISTORICAL": 2,
    "REFERENCE_AS_NEEDED": 3,
    "UNRESOLVED_CONTEXT": 4,
}
PATH_KEYS = (
    "path",
    "repo_path",
    "file_path",
    "source_path",
    "target_path",
    "from_path",
    "to_path",
    "owner_path",
    "test_path",
    "contract_path",
    "consumer_path",
    "provider_path",
    "caller_path",
    "callee_path",
    "rn_path",
    "api_path",
    "backend_path",
    "resolved_path",
    "resolved_target_path",
    "definition_path",
    "source_file",
    "target_file",
)
REPOSITORY_KEYS = (
    "repository_key",
    "workspace_repository_key",
    "repo_key",
    "repository",
    "repo",
    "resolved_repository_key",
)
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
GIT_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
SOURCE_SUFFIXES = {
    ".py", ".pyi", ".ts", ".tsx", ".js", ".jsx", ".dart", ".java",
    ".kt", ".kts", ".go", ".rs", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".swift", ".rb", ".php", ".scala", ".sh",
}


class ContextCompileError(RuntimeError):
    """Fail-closed compilation or verification error."""


@dataclass(frozen=True)
class CompileResult:
    output_dir: Path
    context_fingerprint: str
    status: str
    selected_count: int
    unresolved_count: int
    actual_finding_count: int


@dataclass(frozen=True)
class FileRecord:
    identity: str
    repository_key: str
    path: str
    source_commit: str
    blob_sha: str
    content_sha256: str
    size_bytes: int | None
    inventory_classification: str
    raw: Mapping[str, Any]

    @property
    def key(self) -> tuple[str, str]:
        return (self.repository_key, self.path)

    @property
    def evidence_kind(self) -> str:
        lower = self.path.lower()
        suffix = PurePosixPath(lower).suffix
        if _is_test_path(lower):
            return "test"
        if "schema" in lower or "contract" in lower or suffix in {".jsonschema"}:
            return "contract"
        if "/current_structure/" in f"/{lower}" or "current_structure" in lower:
            return "current_structure"
        if any(token in lower for token in ("history", "historical", "archive", "deprecated")):
            return "historical"
        if suffix in SOURCE_SUFFIXES:
            return "source"
        if suffix in {".md", ".txt", ".rst", ".adoc"}:
            return "design"
        if suffix in {".json", ".yaml", ".yml", ".toml", ".ini"}:
            return "config"
        return self.inventory_classification or "other"


@dataclass(frozen=True)
class GraphEdge:
    edge_id: str
    edge_type: str
    source_identity: str
    target_identity: str
    origin_file: str
    origin_row: str


def _canonical_json_bytes(value: Any) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        + "\n"
    ).encode("utf-8")


def _pretty_json_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    ).encode("utf-8")


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ContextCompileError(f"required file is missing: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ContextCompileError(f"invalid JSON: {path}: {exc}") from exc


@dataclass(frozen=True)
class LogicalInput:
    logical_path: Path
    parts: tuple[Path, ...]
    logical_sha256: str
    logical_size: int
    transported: bool
    transport_manifest_sha256: str | None


def _safe_relative_path(raw: str) -> PurePosixPath:
    value = PurePosixPath(str(raw))
    if value.is_absolute() or not value.parts or any(
        part in {"", ".", ".."} for part in value.parts
    ):
        raise ContextCompileError(f"unsafe publication transport path: {raw!r}")
    return value


def _transport_root_for(path: Path) -> Path | None:
    path = path.resolve()
    for candidate in (path.parent, *path.parents):
        manifest = candidate / PUBLICATION_TRANSPORT_NAME
        if manifest.is_file():
            try:
                path.relative_to(candidate)
            except ValueError:
                continue
            return candidate
    return None


@lru_cache(maxsize=64)
def _logical_input_cached(path_text: str) -> LogicalInput:
    path = Path(path_text).resolve()
    if path.is_file():
        return LogicalInput(
            logical_path=path,
            parts=(path,),
            logical_sha256=_sha256_file(path),
            logical_size=path.stat().st_size,
            transported=False,
            transport_manifest_sha256=None,
        )

    root = _transport_root_for(path)
    if root is None:
        raise ContextCompileError(f"required logical file is missing: {path}")
    manifest_path = root / PUBLICATION_TRANSPORT_NAME
    manifest = _read_json(manifest_path)
    if not isinstance(manifest, dict) or manifest.get("schema_version") != PUBLICATION_TRANSPORT_SCHEMA:
        raise ContextCompileError(
            f"unsupported publication transport schema: {manifest_path}"
        )
    try:
        logical_relative = path.relative_to(root).as_posix()
    except ValueError as exc:  # pragma: no cover - guarded by root discovery
        raise ContextCompileError(f"logical path escapes transport root: {path}") from exc
    records = manifest.get("logical_files")
    if not isinstance(records, list):
        raise ContextCompileError(f"publication transport logical_files is invalid: {manifest_path}")
    matches = [
        row for row in records
        if isinstance(row, dict) and str(row.get("logical_path") or "") == logical_relative
    ]
    if len(matches) != 1:
        raise ContextCompileError(
            f"logical file is not declared exactly once by publication transport: {logical_relative}"
        )
    record = matches[0]
    if record.get("representation") != "ORDERED_BYTE_CONCATENATION":
        raise ContextCompileError(
            f"unsupported publication representation: {logical_relative}"
        )
    expected_sha = str(record.get("logical_sha256") or "")
    expected_size = record.get("logical_size")
    if not SHA256_RE.fullmatch(expected_sha) or not isinstance(expected_size, int):
        raise ContextCompileError(
            f"invalid logical identity in publication transport: {logical_relative}"
        )
    raw_parts = record.get("parts")
    if not isinstance(raw_parts, list) or not raw_parts:
        raise ContextCompileError(
            f"publication transport parts are missing: {logical_relative}"
        )

    logical_digest = hashlib.sha256()
    logical_size = 0
    part_paths: list[Path] = []
    seen: set[str] = set()
    for raw_part in raw_parts:
        if not isinstance(raw_part, dict):
            raise ContextCompileError(
                f"publication transport part is not an object: {logical_relative}"
            )
        relative = _safe_relative_path(str(raw_part.get("path") or ""))
        relative_text = relative.as_posix()
        if relative_text in seen:
            raise ContextCompileError(f"duplicate publication part: {relative_text}")
        seen.add(relative_text)
        part_path = root.joinpath(*relative.parts)
        if not part_path.is_file():
            raise ContextCompileError(f"publication part is missing: {part_path}")
        expected_part_size = raw_part.get("size")
        expected_part_sha = str(raw_part.get("sha256") or "")
        if not isinstance(expected_part_size, int) or not SHA256_RE.fullmatch(expected_part_sha):
            raise ContextCompileError(f"invalid publication part identity: {relative_text}")
        part_digest = hashlib.sha256()
        part_size = 0
        with part_path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                part_digest.update(chunk)
                logical_digest.update(chunk)
                part_size += len(chunk)
                logical_size += len(chunk)
        if part_size != expected_part_size:
            raise ContextCompileError(f"publication part size mismatch: {relative_text}")
        if part_digest.hexdigest() != expected_part_sha:
            raise ContextCompileError(f"publication part SHA-256 mismatch: {relative_text}")
        part_paths.append(part_path)

    if logical_size != expected_size:
        raise ContextCompileError(f"logical file size mismatch: {logical_relative}")
    actual_sha = logical_digest.hexdigest()
    if actual_sha != expected_sha:
        raise ContextCompileError(f"logical file SHA-256 mismatch: {logical_relative}")
    return LogicalInput(
        logical_path=path,
        parts=tuple(part_paths),
        logical_sha256=actual_sha,
        logical_size=logical_size,
        transported=True,
        transport_manifest_sha256=_sha256_file(manifest_path),
    )


def _logical_input(path: Path) -> LogicalInput:
    return _logical_input_cached(str(path.resolve()))


def _logical_sha256(path: Path) -> str:
    return _logical_input(path).logical_sha256


def _iter_jsonl(path: Path) -> Iterator[Mapping[str, Any]]:
    logical = _logical_input(path)
    line_number = 0
    for source_path in logical.parts:
        try:
            stream = source_path.open("r", encoding="utf-8")
        except FileNotFoundError as exc:  # pragma: no cover - logical validation guards this
            raise ContextCompileError(f"required JSONL part is missing: {source_path}") from exc
        with stream:
            for line in stream:
                line_number += 1
                if not line.strip():
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError as exc:
                    raise ContextCompileError(
                        f"invalid JSONL: {path}:{line_number}: {exc}"
                    ) from exc
                if not isinstance(row, dict):
                    raise ContextCompileError(
                        f"JSONL row must be an object: {path}:{line_number}"
                    )
                yield row


def _write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def _write_jsonl(path: Path, rows: Iterable[Mapping[str, Any]]) -> None:
    data = b"".join(_canonical_json_bytes(row) for row in rows)
    _write_bytes(path, data)


def _first_string(row: Mapping[str, Any], keys: Sequence[str]) -> str:
    for key in keys:
        value = row.get(key)
        if isinstance(value, str) and value:
            return value
    return ""


def _normalize_repository(value: str) -> str:
    if not value:
        return ""
    return value.rsplit("/", 1)[-1]


def _normalize_path(value: str) -> str:
    value = value.replace("\\", "/").strip()
    while value.startswith("./"):
        value = value[2:]
    return str(PurePosixPath(value)) if value else ""


def _is_test_path(path: str) -> bool:
    parts = PurePosixPath(path).parts
    name = PurePosixPath(path).name
    return (
        any(part in {"test", "tests", "__tests__", "spec", "specs"} for part in parts)
        or name.startswith("test_")
        or ".test." in name
        or ".spec." in name
    )


def _inventory_record(row: Mapping[str, Any]) -> FileRecord:
    repository_key = _normalize_repository(_first_string(row, REPOSITORY_KEYS))
    path = _normalize_path(_first_string(row, PATH_KEYS))
    if not repository_key or not path:
        raise ContextCompileError(
            "inventory row lacks canonical repository/path identity: "
            + json.dumps(row, ensure_ascii=False, sort_keys=True)[:500]
        )
    source_commit = _first_string(
        row, ("source_commit", "commit", "repository_commit", "commit_sha")
    )
    blob_sha = _first_string(row, ("blob_sha", "git_blob_sha", "oid", "object_sha"))
    content_sha256 = _first_string(
        row, ("content_sha256", "sha256", "content_hash", "hash")
    )
    identity = _first_string(row, ("file_identity", "identity", "file_id"))
    if not identity:
        identity_payload = {
            "repository_key": repository_key,
            "path": path,
            "source_commit": source_commit,
            "blob_sha": blob_sha,
            "content_sha256": content_sha256,
        }
        identity = "file:" + _sha256_bytes(_canonical_json_bytes(identity_payload))
    size_value = row.get("size_bytes", row.get("size", row.get("object_size")))
    size_bytes = size_value if isinstance(size_value, int) else None
    classification = _first_string(
        row, ("classification", "initial_classification", "file_role", "kind", "file_type")
    )
    return FileRecord(
        identity=identity,
        repository_key=repository_key,
        path=path,
        source_commit=source_commit,
        blob_sha=blob_sha,
        content_sha256=content_sha256,
        size_bytes=size_bytes,
        inventory_classification=classification,
        raw=row,
    )


def _match_path(path: str, rule: Mapping[str, Any]) -> bool:
    globs = [str(item) for item in rule.get("path_globs", [])]
    contains = [str(item).lower() for item in rule.get("path_contains_any", [])]
    excludes = [str(item) for item in rule.get("exclude_path_globs", [])]
    if excludes and any(fnmatch.fnmatchcase(path, pattern) for pattern in excludes):
        return False
    if globs and any(fnmatch.fnmatchcase(path, pattern) for pattern in globs):
        return True
    lower = path.lower()
    if contains and any(token in lower for token in contains):
        return True
    return not globs and not contains


def _match_record(record: FileRecord, rule: Mapping[str, Any]) -> bool:
    repos = {
        _normalize_repository(str(item))
        for item in rule.get("repository_keys", [])
    }
    if repos and record.repository_key not in repos:
        return False
    evidence = {str(item) for item in rule.get("evidence_kinds", [])}
    if evidence and record.evidence_kind not in evidence:
        return False
    return _match_path(record.path, rule)


def _json_strings(value: Any) -> Iterator[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, Mapping):
        for item in value.values():
            yield from _json_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from _json_strings(item)


def _resolve_string_to_identities(
    value: str,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
    repository_hint: str,
) -> list[str]:
    candidate = _normalize_path(value)
    if not candidate or candidate in {".", "/"}:
        return []
    if repository_hint:
        record = by_key.get((_normalize_repository(repository_hint), candidate))
        if record:
            return [record.identity]
    exact = by_path.get(candidate)
    if exact:
        return sorted(record.identity for record in exact)
    # Some index formats prefix a repository key in the path.
    if ":" in candidate:
        prefix, rest = candidate.split(":", 1)
        record = by_key.get((_normalize_repository(prefix), _normalize_path(rest)))
        if record:
            return [record.identity]
    return []


def _row_id(row: Mapping[str, Any], origin_file: str, ordinal: int) -> str:
    explicit = _first_string(
        row,
        (
            "edge_id",
            "reference_id",
            "route_id",
            "call_id",
            "symbol_id",
            "subject_id",
            "id",
        ),
    )
    return explicit or f"{origin_file}:{ordinal}"


def _edge(
    edge_type: str,
    source_identity: str,
    target_identity: str,
    origin_file: str,
    origin_row: str,
) -> GraphEdge:
    body = {
        "edge_type": edge_type,
        "source_identity": source_identity,
        "target_identity": target_identity,
        "origin_file": origin_file,
        "origin_row": origin_row,
    }
    return GraphEdge(
        edge_id="edge:" + _sha256_bytes(_canonical_json_bytes(body)),
        **body,
    )


def _extract_edges_from_rows(
    path: Path,
    edge_type: str,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
    symbol_owner: Mapping[str, str],
    route_owner: Mapping[str, str],
    known_identities: set[str],
) -> list[GraphEdge]:
    edges: dict[str, GraphEdge] = {}
    for ordinal, row in enumerate(_iter_jsonl(path), 1):
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        identities: list[str] = []
        for key in PATH_KEYS:
            value = row.get(key)
            if isinstance(value, str):
                path_repository_hint = repository_hint
                if key in {
                    "target_path",
                    "to_path",
                    "callee_path",
                    "api_path",
                    "backend_path",
                    "resolved_path",
                    "resolved_target_path",
                    "definition_path",
                    "target_file",
                }:
                    path_repository_hint = _first_string(
                        row,
                        (
                            "resolved_repository_key",
                            "target_repository_key",
                            "to_repository_key",
                        ),
                    ) or repository_hint
                identities.extend(
                    _resolve_string_to_identities(
                        value, by_key, by_path, path_repository_hint
                    )
                )
        for key in (
            "source_file_identity",
            "target_file_identity",
            "file_identity",
            "owner_file_identity",
            "test_file_identity",
            "contract_file_identity",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in known_identities:
                identities.append(value)
        for key, value in row.items():
            if key.endswith("_files") and isinstance(value, list):
                for item_value in value:
                    if isinstance(item_value, str):
                        identities.extend(
                            _resolve_string_to_identities(
                                item_value, by_key, by_path, repository_hint
                            )
                        )
        for key in (
            "route_id",
            "api_route_id",
            "source_route_id",
            "target_route_id",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in route_owner:
                identities.append(route_owner[value])
        for key in ("matched_route_ids", "route_ids"):
            value = row.get(key)
            if isinstance(value, list):
                identities.extend(
                    route_owner[item_value]
                    for item_value in value
                    if isinstance(item_value, str) and item_value in route_owner
                )
        for key in (
            "symbol",
            "symbol_id",
            "source_symbol",
            "target_symbol",
            "definition_symbol",
            "callee_symbol",
            "caller_symbol",
            "scip_symbol",
            "target",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in symbol_owner:
                identities.append(symbol_owner[value])
        # Fall back to any exact inventory path embedded in a structured row.
        if len(set(identities)) < 2:
            for value in _json_strings(row):
                identities.extend(
                    _resolve_string_to_identities(
                        value, by_key, by_path, repository_hint
                    )
                )
        unique = list(dict.fromkeys(identities))
        if len(unique) < 2:
            continue
        origin_row = _row_id(row, path.name, ordinal)
        # Preserve the first identity as the row's source and each remaining one
        # as a target.  Closure is traversed both forward and reverse.
        source = unique[0]
        for target in unique[1:]:
            if source == target:
                continue
            item = _edge(edge_type, source, target, path.name, origin_row)
            edges[item.edge_id] = item
    return sorted(edges.values(), key=lambda item: item.edge_id)


def _validate_manifest_chain(workspace_dir: Path) -> dict[str, Any]:
    inventory_path = workspace_dir / "manifest.json"
    files_path = workspace_dir / "files.jsonl"
    code_path = workspace_dir / "code_index" / "code_index_manifest.json"
    route_path = workspace_dir / "route_graph" / "route_graph_manifest.json"
    inventory = _read_json(inventory_path)
    code = _read_json(code_path)
    route = _read_json(route_path)
    if not all(isinstance(item, dict) for item in (inventory, code, route)):
        raise ContextCompileError("Step 1/2/3 manifests must be JSON objects")

    workspace = workspace_dir.name
    if inventory.get("workspace") != workspace:
        raise ContextCompileError(
            f"stale workspace manifest: expected {workspace!r}, "
            f"got {inventory.get('workspace')!r}"
        )
    files_sha = _sha256_file(files_path)
    expected_files_sha = inventory.get("output_sha256", {}).get("files.jsonl")
    if expected_files_sha != files_sha:
        raise ContextCompileError(
            "Step 1 files.jsonl fingerprint mismatch; fresh regeneration required"
        )
    if code.get("inventory_sha256") != files_sha:
        raise ContextCompileError(
            "Step 2 is not bound to the current Step 1 inventory; "
            "fresh regeneration required"
        )
    code_sha = _sha256_file(code_path)
    if route.get("inventory_sha256") != files_sha:
        raise ContextCompileError(
            "Step 3 is not bound to the current Step 1 inventory; "
            "fresh regeneration required"
        )
    if route.get("code_index_manifest_sha256") != code_sha:
        raise ContextCompileError(
            "Step 3 is not bound to the current Step 2 manifest; "
            "fresh regeneration required"
        )

    for base, manifest in (
        (workspace_dir / "code_index", code),
        (workspace_dir / "route_graph", route),
    ):
        outputs = manifest.get("output_sha256", {})
        if not isinstance(outputs, dict):
            raise ContextCompileError(f"invalid output_sha256 in {base}")
        for relative, expected in outputs.items():
            target = base / relative
            actual = _logical_sha256(target)
            if actual != expected:
                raise ContextCompileError(
                    f"manifest-bound logical output fingerprint mismatch: {target}"
                )

    transport_path = workspace_dir / PUBLICATION_TRANSPORT_NAME
    transport_sha256 = _sha256_file(transport_path) if transport_path.is_file() else None

    return {
        "inventory": inventory,
        "inventory_sha256": _sha256_file(inventory_path),
        "files_sha256": files_sha,
        "code_index": code,
        "code_index_manifest_sha256": code_sha,
        "route_graph": route,
        "route_graph_manifest_sha256": _sha256_file(route_path),
        "publication_transport_sha256": transport_sha256,
    }


def _validate_workspace_refs(
    workspace: str,
    workspace_profiles: Mapping[str, Any],
    inventory_manifest: Mapping[str, Any],
    repo_root: Path,
) -> None:
    profiles = workspace_profiles.get("profiles")
    if not isinstance(profiles, dict) or workspace not in profiles:
        raise ContextCompileError(f"workspace profile not found: {workspace}")
    profile = profiles[workspace]
    repositories = profile.get("repositories", {})
    actual_repositories = inventory_manifest.get("repositories", {})
    for repository_key, expected in repositories.items():
        actual = actual_repositories.get(repository_key)
        if not isinstance(actual, dict):
            raise ContextCompileError(
                f"inventory lacks workspace repository: {repository_key}"
            )
        source_commit = actual.get("source_commit")
        expected_head = expected.get("expected_head")
        if expected_head and source_commit != expected_head:
            raise ContextCompileError(
                f"stale ref for {repository_key}: expected {expected_head}, "
                f"got {source_commit}; fresh regeneration required"
            )
        if not source_commit:
            raise ContextCompileError(
                f"inventory lacks exact source commit for {repository_key}"
            )
        expected_ancestor = expected.get("expected_ancestor")
        if expected_ancestor:
            repository_name = str(expected.get("repository", "")).rsplit("/", 1)[-1]
            if repo_root.name != repository_name or not (repo_root / ".git").exists():
                raise ContextCompileError(
                    f"cannot verify expected_ancestor for {repository_key}; "
                    f"repository checkout is required at {repo_root}"
                )
            probe = subprocess.run(
                [
                    "git",
                    "-C",
                    str(repo_root),
                    "merge-base",
                    "--is-ancestor",
                    str(expected_ancestor),
                    str(source_commit),
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
                check=False,
            )
            if probe.returncode != 0:
                detail = probe.stderr.strip() or "not an ancestor"
                raise ContextCompileError(
                    f"stale ancestor lock for {repository_key}: "
                    f"{expected_ancestor} is not an ancestor of {source_commit}: {detail}"
                )


def _load_inventory(
    files_path: Path,
) -> tuple[
    dict[str, FileRecord],
    dict[tuple[str, str], FileRecord],
    dict[str, list[FileRecord]],
]:
    by_identity: dict[str, FileRecord] = {}
    by_key: dict[tuple[str, str], FileRecord] = {}
    by_path: dict[str, list[FileRecord]] = defaultdict(list)
    for row in _iter_jsonl(files_path):
        record = _inventory_record(row)
        if record.identity in by_identity:
            raise ContextCompileError(f"duplicate file identity: {record.identity}")
        if record.key in by_key:
            raise ContextCompileError(
                f"duplicate repository/path identity: {record.repository_key}:{record.path}"
            )
        by_identity[record.identity] = record
        by_key[record.key] = record
        by_path[record.path].append(record)
    if not by_identity:
        raise ContextCompileError("inventory is empty")
    return by_identity, by_key, by_path


def _load_symbol_owners(
    symbols_path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, str]:
    owners: dict[str, str] = {}
    for row in _iter_jsonl(symbols_path):
        symbol = _first_string(row, ("symbol", "symbol_id", "id", "scip_symbol"))
        if not symbol:
            continue
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        identity = _first_string(row, ("file_identity", "owner_file_identity"))
        if not identity:
            path = _first_string(row, PATH_KEYS)
            resolved = _resolve_string_to_identities(
                path, by_key, by_path, repository_hint
            )
            identity = resolved[0] if len(resolved) == 1 else ""
        if identity:
            owners[symbol] = identity
    return owners



def _load_route_owners(
    api_routes_path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, str]:
    owners: dict[str, str] = {}
    for row in _iter_jsonl(api_routes_path):
        route_id = _first_string(row, ("route_id", "id"))
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        path = _first_string(row, ("path", "file_path", "owner_path"))
        resolved = _resolve_string_to_identities(path, by_key, by_path, repository_hint)
        if route_id and len(resolved) == 1:
            owners[route_id] = resolved[0]
    return owners


def _load_domain_assignments(
    path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, set[str]]:
    result: dict[str, set[str]] = defaultdict(set)
    for row in _iter_jsonl(path):
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        file_path = _first_string(row, PATH_KEYS)
        resolved = _resolve_string_to_identities(
            file_path, by_key, by_path, repository_hint
        )
        domains: list[str] = []
        for key in ("domains", "domain_tags", "assigned_domains"):
            value = row.get(key)
            if isinstance(value, list):
                domains.extend(str(item) for item in value)
        value = row.get("domain")
        if isinstance(value, str):
            domains.append(value)
        for identity in resolved:
            result[identity].update(domains)
    return result

def _profile_seed_selection(
    records: Mapping[str, FileRecord],
    task_profile: Mapping[str, Any],
    domain_assignments: Mapping[str, set[str]],
) -> tuple[dict[str, set[str]], dict[str, str]]:
    reasons: dict[str, set[str]] = defaultdict(set)
    requested_classification: dict[str, str] = {}
    for rule in task_profile.get("seed_rules", []):
        if not isinstance(rule, dict):
            continue
        rule_id = str(rule.get("id", "unnamed_seed"))
        classification = str(rule.get("classification", "MUST_READ_FULL"))
        if classification not in CLASSIFICATIONS:
            raise ContextCompileError(
                f"unknown classification in task profile: {classification}"
            )
        for record in records.values():
            if _match_record(record, rule):
                reasons[record.identity].add(f"task_profile:{rule_id}")
                old = requested_classification.get(record.identity)
                if old is None or CLASSIFICATION_PRIORITY[classification] < CLASSIFICATION_PRIORITY[old]:
                    requested_classification[record.identity] = classification
    wanted_domains = {str(item) for item in task_profile.get("domains", [])}
    if bool(task_profile.get("seed_all_matching_domains", False)):
        for identity, assigned in domain_assignments.items():
            overlap = wanted_domains.intersection(assigned)
            if overlap:
                reasons[identity].add("domain:" + ",".join(sorted(overlap)))
                requested_classification.setdefault(identity, "REFERENCE_AS_NEEDED")
    else:
        # Domain assignment is evidence attached to the selected closure, not an
        # instruction to select every historical or generated file sharing a
        # broad domain label.  Explicit task seeds remain the admission owner.
        for identity in tuple(reasons):
            overlap = wanted_domains.intersection(domain_assignments.get(identity, set()))
            if overlap:
                reasons[identity].add("domain:" + ",".join(sorted(overlap)))
    if not reasons:
        raise ContextCompileError("task profile selected no seed files")
    return reasons, requested_classification


def _apply_manual_overlay(
    overlay: Mapping[str, Any],
    by_key: Mapping[tuple[str, str], FileRecord],
    reasons: dict[str, set[str]],
    requested_classification: dict[str, str],
) -> list[GraphEdge]:
    edges: list[GraphEdge] = []
    for item in overlay.get("files", []):
        if not isinstance(item, dict):
            continue
        key = (
            _normalize_repository(str(item.get("repository_key", ""))),
            _normalize_path(str(item.get("path", ""))),
        )
        record = by_key.get(key)
        if record is None:
            raise ContextCompileError(
                f"manual overlay file is absent from Inventory: {key[0]}:{key[1]}"
            )
        classification = str(item.get("classification", "MUST_READ_FULL"))
        if classification not in CLASSIFICATIONS:
            raise ContextCompileError(
                f"unknown manual classification: {classification}"
            )
        reasons[record.identity].add(
            "manual_overlay:" + str(item.get("reason", "explicit"))
        )
        requested_classification[record.identity] = classification
    for ordinal, item in enumerate(overlay.get("edges", []), 1):
        if not isinstance(item, dict):
            continue
        source_key = (
            _normalize_repository(str(item.get("source_repository_key", ""))),
            _normalize_path(str(item.get("source_path", ""))),
        )
        target_key = (
            _normalize_repository(str(item.get("target_repository_key", ""))),
            _normalize_path(str(item.get("target_path", ""))),
        )
        source = by_key.get(source_key)
        target = by_key.get(target_key)
        if source is None or target is None:
            raise ContextCompileError(
                "manual overlay edge endpoint is absent from Inventory: "
                f"{source_key!r} -> {target_key!r}"
            )
        edges.append(
            _edge(
                str(item.get("edge_type", "manual_owner")),
                source.identity,
                target.identity,
                "manual_overlay",
                str(item.get("id", ordinal)),
            )
        )
    return edges


def _classify_selected(
    record: FileRecord,
    requested: str | None,
    task_profile: Mapping[str, Any],
    distance: int,
) -> str:
    current_owner_rules = task_profile.get("current_owner_rules", [])
    historical_rules = task_profile.get("historical_rules", [])
    if any(_match_record(record, rule) for rule in current_owner_rules):
        return "CURRENT_OWNER"
    if any(_match_record(record, rule) for rule in historical_rules):
        return "RELEVANT_HISTORICAL"
    if requested:
        return requested
    # Graph closure discovers dependencies and reverse consumers, but does not
    # automatically promote an entire connected component to a full-text read.
    # Full reads are owned by the explicit task profile and current owners.
    return "REFERENCE_AS_NEEDED"


def _expand_fixed_point(
    seeds: Mapping[str, set[str]],
    edges: Sequence[GraphEdge],
) -> tuple[set[str], dict[str, int], dict[str, set[str]], set[str]]:
    adjacency: dict[str, list[tuple[str, GraphEdge]]] = defaultdict(list)
    for item in edges:
        adjacency[item.source_identity].append((item.target_identity, item))
        adjacency[item.target_identity].append((item.source_identity, item))
    selected = set(seeds)
    distance = {identity: 0 for identity in seeds}
    reasons = {identity: set(value) for identity, value in seeds.items()}
    used_edge_ids: set[str] = set()
    queue = deque(sorted(seeds))
    while queue:
        current = queue.popleft()
        for neighbor, item in sorted(
            adjacency.get(current, []), key=lambda pair: (pair[0], pair[1].edge_id)
        ):
            used_edge_ids.add(item.edge_id)
            candidate_distance = distance[current] + 1
            reasons.setdefault(neighbor, set()).add(
                f"closure:{item.edge_type}:{current}"
            )
            if neighbor not in selected:
                selected.add(neighbor)
                distance[neighbor] = candidate_distance
                queue.append(neighbor)
            elif candidate_distance < distance[neighbor]:
                distance[neighbor] = candidate_distance
    return selected, distance, reasons, used_edge_ids


def _validated_external_assets(
    review: Mapping[str, Any],
    required_workspace: str,
    workspace_profiles: Mapping[str, Any],
    external_workspace_root: Path,
) -> list[dict[str, Any]]:
    raw_assets = review.get("external_asset_candidates", [])
    if not isinstance(raw_assets, list):
        raise ContextCompileError("external_asset_candidates must be a list")
    profiles = workspace_profiles.get("profiles", {})
    required_profile = profiles.get(required_workspace, {})
    repositories = required_profile.get("repositories", {})
    result: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for raw in raw_assets:
        if not isinstance(raw, dict):
            raise ContextCompileError("external asset must be an object")
        repository_key = _normalize_repository(str(raw.get("repository_key") or ""))
        asset_workspace = str(raw.get("required_workspace") or "")
        path = _normalize_path(str(raw.get("path") or ""))
        source_commit = str(raw.get("source_commit") or "")
        blob_sha = str(raw.get("blob_sha") or "")
        content_sha256 = str(raw.get("content_sha256") or "")
        evidence_kind = str(raw.get("evidence_kind") or "source")
        symbols = raw.get("symbols", [])
        if (
            not repository_key
            or asset_workspace != required_workspace
            or not path
            or not GIT_SHA_RE.fullmatch(source_commit)
            or not GIT_SHA_RE.fullmatch(blob_sha)
            or (content_sha256 and not SHA256_RE.fullmatch(content_sha256))
            or evidence_kind not in {"source", "test", "contract", "design"}
            or not isinstance(symbols, list)
            or not all(isinstance(value, str) and value for value in symbols)
        ):
            raise ContextCompileError(
                "external asset lacks exact workspace/commit/blob/path identity: "
                + json.dumps(raw, ensure_ascii=False, sort_keys=True)
            )
        repository_profile = repositories.get(repository_key)
        if not isinstance(repository_profile, dict):
            raise ContextCompileError(
                f"external asset repository is absent from {required_workspace}: {repository_key}"
            )
        expected_head = repository_profile.get("expected_head")
        if expected_head and source_commit != expected_head:
            raise ContextCompileError(
                f"external asset stale ref for {repository_key}: "
                f"expected {expected_head}, got {source_commit}"
            )
        key = (repository_key, path)
        if key in seen:
            raise ContextCompileError(f"duplicate external asset: {repository_key}:{path}")
        seen.add(key)

        require_git_verification = bool(review.get("require_external_asset_git_verification", False))
        validation_status = "PROFILE_LOCK_ONLY"
        actual_content_sha256: str | None = None
        checkout = external_workspace_root / required_workspace / repository_key
        if require_git_verification or checkout.exists():
            if not (checkout / ".git").exists():
                raise ContextCompileError(
                    f"external asset checkout is required: {checkout}"
                )
            actual_head = subprocess.check_output(
                ["git", "-C", str(checkout), "rev-parse", "HEAD"], text=True
            ).strip()
            if actual_head != source_commit:
                raise ContextCompileError(
                    f"external asset checkout HEAD mismatch: {repository_key}:"
                    f"{actual_head}!={source_commit}"
                )
            tree_row = subprocess.check_output(
                ["git", "-C", str(checkout), "ls-tree", source_commit, "--", path],
                text=True,
            ).strip()
            if not tree_row:
                raise ContextCompileError(
                    f"external asset path is absent at exact commit: {repository_key}:{path}"
                )
            metadata, separator, tree_path = tree_row.partition("\t")
            fields = metadata.split()
            if not separator or tree_path != path or len(fields) != 3 or fields[1] != "blob":
                raise ContextCompileError(
                    f"external asset tree identity is invalid: {repository_key}:{path}"
                )
            actual_blob_sha = fields[2]
            if actual_blob_sha != blob_sha:
                raise ContextCompileError(
                    f"external asset blob mismatch: {repository_key}:{path}:"
                    f"{actual_blob_sha}!={blob_sha}"
                )
            bytes_value = subprocess.check_output(
                ["git", "-C", str(checkout), "show", f"{source_commit}:{path}"]
            )
            actual_content_sha256 = _sha256_bytes(bytes_value)
            if content_sha256 and actual_content_sha256 != content_sha256:
                raise ContextCompileError(
                    f"external asset content SHA-256 mismatch: {repository_key}:{path}"
                )
            text_value = bytes_value.decode("utf-8", "strict")
            missing_symbols = [value for value in symbols if value not in text_value]
            if missing_symbols:
                raise ContextCompileError(
                    f"external asset symbols are absent: {repository_key}:{path}:"
                    + ",".join(missing_symbols)
                )
            validation_status = "GIT_COMMIT_BLOB_CONTENT_SYMBOL_VERIFIED"

        result.append(
            {
                "repository_key": repository_key,
                "required_workspace": required_workspace,
                "path": path,
                "source_commit": source_commit,
                "blob_sha": blob_sha,
                "content_sha256": actual_content_sha256 or content_sha256 or None,
                "evidence_kind": evidence_kind,
                "symbols": list(symbols),
                "validation_status": validation_status,
            }
        )
    return sorted(result, key=lambda row: (row["repository_key"], row["path"]))


def _review_disposition_complete(
    review: Mapping[str, Any],
    external_assets: Sequence[Mapping[str, Any]],
    selected_paths: set[tuple[str, str]],
) -> bool:
    disposition = str(review.get("disposition") or "")
    design_impact = str(review.get("design_impact") or "")
    owner_paths = review.get("canonical_owner_paths", [])
    if (
        not disposition
        or not design_impact
        or not external_assets
        or not isinstance(owner_paths, list)
        or not owner_paths
    ):
        return False
    for raw in owner_paths:
        if not isinstance(raw, dict):
            return False
        repository_key = _normalize_repository(str(raw.get("repository_key") or ""))
        path = _normalize_path(str(raw.get("path") or ""))
        if not repository_key or not path or (repository_key, path) not in selected_paths:
            return False
    return True


def _category_coverage(
    task_profile: Mapping[str, Any],
    records: Mapping[str, FileRecord],
    selected: set[str],
    workspace: str,
    workspace_profiles: Mapping[str, Any],
    external_workspace_root: Path,
) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
    categories = task_profile.get("required_categories", [])
    expected_exact = int(task_profile.get("required_category_exact", 10))
    if len(categories) != expected_exact:
        raise ContextCompileError(
            f"task profile must define required category exact{expected_exact}; "
            f"got {len(categories)}"
        )
    coverage_rows: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    profiles = workspace_profiles.get("profiles", {})
    selected_records = [records[identity] for identity in selected]
    selected_paths = {(record.repository_key, record.path) for record in selected_records}

    for category in categories:
        if not isinstance(category, dict):
            raise ContextCompileError("required category must be an object")
        category_id = str(category.get("id", ""))
        if not category_id or category_id in seen_ids:
            raise ContextCompileError(f"duplicate/empty required category id: {category_id!r}")
        seen_ids.add(category_id)
        matches = [record for record in selected_records if _match_record(record, category)]
        source_like = [
            record for record in matches
            if record.evidence_kind in {"source", "test", "contract"}
        ]
        required_workspace = str(category.get("required_workspace") or "") or None
        review = category.get("actual_review", {})
        review = review if isinstance(review, dict) else {}
        external_assets: list[dict[str, Any]] = []
        if required_workspace and required_workspace != workspace:
            external_assets = _validated_external_assets(
                review,
                required_workspace,
                workspace_profiles,
                external_workspace_root,
            )
        disposition_complete = _review_disposition_complete(
            review, external_assets, selected_paths
        )
        if bool(review.get("require_external_asset_git_verification", False)):
            disposition_complete = disposition_complete and all(
                row.get("validation_status")
                == "GIT_COMMIT_BLOB_CONTENT_SYMBOL_VERIFIED"
                for row in external_assets
            )
        external_source_like_count = sum(
            asset["evidence_kind"] in {"source", "test", "contract"}
            for asset in external_assets
        )
        effective_source_like_count = len(source_like) + external_source_like_count
        min_source = int(category.get("minimum_source_like", 0))

        status = "PASS"
        blocking_codes: list[str] = []
        review_codes: list[str] = []
        if not matches:
            status = "BLOCKED"
            blocking_codes.append("REQUIRED_CATEGORY_EMPTY")
        if effective_source_like_count < min_source:
            status = "BLOCKED" if not matches else "PARTIAL_BLOCKED"
            blocking_codes.append("SOURCE_LEVEL_EVIDENCE_INSUFFICIENT")

        if required_workspace and required_workspace != workspace:
            required_profile = profiles.get(required_workspace, {})
            current_profile = profiles.get(workspace, {})
            raw_gap_code = str(
                category.get(
                    "workspace_gap_code",
                    "REQUIRED_SOURCE_WORKSPACE_NOT_INDEXED",
                )
            )
            if disposition_complete and matches and effective_source_like_count >= min_source:
                status = "PASS"
                review_codes.append("EXTERNAL_EXACT_ASSET_REVIEWED_WITH_DISPOSITION")
                unresolved_code = str(
                    review.get(
                        "reviewed_workspace_gap_code",
                        raw_gap_code + "_EXTERNAL_EXACT_REVIEWED",
                    )
                )
                blocking = False
                reason = (
                    "The implementation/test lane is outside the current Inventory, "
                    "but exact external commit/blob identities were reviewed and a "
                    "canonical CMEE disposition was recorded without mixing workspaces."
                )
            else:
                status = "PARTIAL_BLOCKED" if matches else "BLOCKED"
                blocking_codes.append("REQUIRED_WORKSPACE_NOT_INDEXED")
                unresolved_code = raw_gap_code
                blocking = True
                reason = (
                    "The current task context can see documentary references, "
                    "but the required implementation/test source lane is locked "
                    "to a different workspace profile without an exact reviewed disposition."
                )
            unresolved_id = "unresolved:" + _sha256_bytes(
                _canonical_json_bytes(
                    {
                        "code": unresolved_code,
                        "category_id": category_id,
                        "workspace": workspace,
                        "required_workspace": required_workspace,
                        "external_assets": [
                            {
                                "repository_key": row["repository_key"],
                                "path": row["path"],
                                "source_commit": row["source_commit"],
                                "blob_sha": row["blob_sha"],
                            }
                            for row in external_assets
                        ],
                    }
                )
            )
            unresolved.append(
                {
                    "unresolved_id": unresolved_id,
                    "classification": "UNRESOLVED_CONTEXT",
                    "blocking": blocking,
                    "code": unresolved_code,
                    "category_id": category_id,
                    "current_workspace": workspace,
                    "required_workspace": required_workspace,
                    "current_workspace_repositories": current_profile.get("repositories", {}),
                    "required_workspace_repositories": required_profile.get("repositories", {}),
                    "external_exact_assets": external_assets,
                    "reason": reason,
                    "disposition": review.get("disposition"),
                    "product_credit": 0,
                }
            )

            review_rules = review.get("basis_rules", [])
            review_rules = review_rules if isinstance(review_rules, list) else []
            basis = [
                record
                for record in selected_records
                if (
                    any(
                        isinstance(rule, dict) and _match_record(record, rule)
                        for rule in review_rules
                    )
                    if review_rules
                    else record in matches
                )
            ]
            findings.append(
                {
                    "finding_id": str(review.get("finding_id", f"ACTUAL-{category_id}")),
                    "title": str(
                        review.get(
                            "title",
                            f"{category_id} source lane is outside {workspace}",
                        )
                    ),
                    "category_id": category_id,
                    "status": str(
                        review.get(
                            "status",
                            "DESIGN_OWNER_PRESENT_IMPLEMENTATION_ASSET_NOT_MIGRATED",
                        )
                    ),
                    "current_workspace": workspace,
                    "required_workspace": required_workspace,
                    "current_workspace_repositories": current_profile.get("repositories", {}),
                    "required_workspace_repositories": required_profile.get("repositories", {}),
                    "selected_documentary_evidence": [
                        {
                            "repository_key": record.repository_key,
                            "path": record.path,
                            "source_commit": record.source_commit,
                            "identity": record.identity,
                            "evidence_kind": record.evidence_kind,
                        }
                        for record in sorted(basis, key=lambda item: (item.repository_key, item.path))
                    ],
                    "cmee_review_conclusion": str(
                        review.get(
                            "conclusion",
                            "The required source/test lane is not proven by the current workspace.",
                        )
                    ),
                    "disposition": str(review.get("disposition") or ""),
                    "design_impact": str(review.get("design_impact") or ""),
                    "canonical_owner_paths": review.get("canonical_owner_paths", []),
                    "required_action": str(
                        review.get(
                            "required_action",
                            f"Admit or separately bind {required_workspace} before resolving this context gap.",
                        )
                    ),
                    "external_exact_assets": external_assets,
                    "review_disposition_complete": disposition_complete,
                    "structure_map_delta": str(
                        review.get("structure_map_delta") or "STRUCTURE_MAP_DELTA_NONE"
                    ),
                    "product_credit": 0,
                }
            )

        coverage_rows.append(
            {
                "category_id": category_id,
                "title": str(category.get("title", category_id)),
                "status": status,
                "selected_count": len(matches),
                "source_like_count": len(source_like),
                "external_source_like_count": external_source_like_count,
                "effective_source_like_count": effective_source_like_count,
                "minimum_source_like": min_source,
                "required_workspace": required_workspace,
                "blocking_codes": sorted(set(blocking_codes)),
                "review_codes": sorted(set(review_codes)),
                "files": [
                    {
                        "repository_key": record.repository_key,
                        "path": record.path,
                        "source_commit": record.source_commit,
                        "identity": record.identity,
                        "evidence_kind": record.evidence_kind,
                    }
                    for record in sorted(matches, key=lambda item: (item.repository_key, item.path))
                ],
                "external_exact_assets": external_assets,
            }
        )

    coverage = {
        "schema_version": "cocolon.system_context.required_category_coverage.v1",
        "required_category_exact": expected_exact,
        "observed_category_count": len(coverage_rows),
        "all_nonzero": all(row["selected_count"] > 0 for row in coverage_rows),
        "all_pass": all(row["status"] == "PASS" for row in coverage_rows),
        "categories": coverage_rows,
        "product_credit": 0,
    }
    return coverage, unresolved, findings

def _selected_row(
    record: FileRecord,
    classification: str,
    reasons: Iterable[str],
    distance: int,
) -> dict[str, Any]:
    return {
        "identity": record.identity,
        "repository_key": record.repository_key,
        "path": record.path,
        "source_commit": record.source_commit,
        "blob_sha": record.blob_sha,
        "content_sha256": record.content_sha256,
        "size_bytes": record.size_bytes,
        "inventory_classification": record.inventory_classification,
        "evidence_kind": record.evidence_kind,
        "read_classification": classification,
        "graph_distance": distance,
        "selection_reasons": sorted(set(reasons)),
    }


def _read_order_markdown(rows: Sequence[Mapping[str, Any]], workspace: str, task: str) -> str:
    lines = [
        f"# {task} 全文確認順",
        "",
        f"workspace: `{workspace}`",
        "",
        "この順序はexact selected-file identityとgraph closureから生成したもので、更新日時順ではありません。",
        "",
    ]
    for index, row in enumerate(rows, 1):
        lines.extend(
            [
                f"## {index}. `{row['repository_key']}:{row['path']}`",
                "",
                f"- classification: `{row['read_classification']}`",
                f"- source commit: `{row['source_commit']}`",
                f"- file identity: `{row['identity']}`",
                f"- graph distance: `{row['graph_distance']}`",
                "- 選択理由:",
            ]
        )
        lines.extend(f"  - `{reason}`" for reason in row["selection_reasons"])
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _overview_markdown(
    workspace: str,
    task: str,
    selected_rows: Sequence[Mapping[str, Any]],
    coverage: Mapping[str, Any],
    unresolved: Sequence[Mapping[str, Any]],
    findings: Sequence[Mapping[str, Any]],
    status: str,
) -> str:
    class_counts: dict[str, int] = defaultdict(int)
    for row in selected_rows:
        class_counts[str(row["read_classification"])] += 1
    lines = [
        f"# {task.upper()} task context 概要",
        "",
        f"- workspace: `{workspace}`",
        f"- status: `{status}`",
        f"- selected files: `{len(selected_rows)}`",
        f"- required categories: `{coverage['observed_category_count']}` / `{coverage['required_category_exact']}`",
        f"- required categories all nonzero: `{str(coverage['all_nonzero']).lower()}`",
        f"- required categories all PASS: `{str(coverage['all_pass']).lower()}`",
        f"- blocking unresolved: `{sum(bool(row.get('blocking')) for row in unresolved)}`",
        f"- actual unincorporated findings: `{len(findings)}`",
        "- product_credit: `0`",
        "- automatic_progression: `false`",
        "",
        "## classification別件数",
        "",
    ]
    for classification in CLASSIFICATIONS[:-1]:
        lines.append(f"- `{classification}`: `{class_counts.get(classification, 0)}`")
    lines.extend(
        [
            "",
            "## 境界",
            "",
            "この成果物はcontext／review checkpointです。RN／API／backend behavior、public contract、DB、production dependency、product outputは変更しません。",
            "",
        ]
    )
    return "\n".join(lines)


def _findings_markdown(
    findings: Sequence[Mapping[str, Any]],
    unresolved: Sequence[Mapping[str, Any]],
) -> str:
    lines = [
        "# CMEE未取込actual finding",
        "",
        "以下はmanifest-lockされたworkspace identityから導出したcontext findingです。商品品質creditではありません。",
        "",
    ]
    if not findings:
        lines.extend(
            [
                "actual未取込findingを導出できませんでした。",
                "",
                "required category exact10のmanual cross-checkが終わるまでStep 4 completionを保留します。",
                "",
            ]
        )
    for finding in findings:
        lines.extend(
            [
                f"## {finding['finding_id']} — {finding['title']}",
                "",
                f"- status: `{finding['status']}`",
                f"- current workspace: `{finding['current_workspace']}`",
                f"- required workspace: `{finding['required_workspace']}`",
                "- product_credit: `0`",
                "",
                "### exact workspace identity",
                "",
                "```json",
                json.dumps(
                    {
                        "current_workspace_repositories": finding[
                            "current_workspace_repositories"
                        ],
                        "required_workspace_repositories": finding[
                            "required_workspace_repositories"
                        ],
                    },
                    ensure_ascii=False,
                    sort_keys=True,
                    indent=2,
                ),
                "```",
                "",
                "### CMEE再確認結論",
                "",
                str(finding["cmee_review_conclusion"]),
                "",
                "### 必要な次処理",
                "",
                str(finding["required_action"]),
                "",
                "### 選択された文書evidence",
                "",
            ]
        )
        evidence = finding.get("selected_documentary_evidence", [])
        if evidence:
            for row in evidence:
                lines.append(
                    f"- `{row['repository_key']}:{row['path']}` @ `{row['source_commit']}` "
                    f"(`{row['identity']}`, `{row['evidence_kind']}`)"
                )
        else:
            lines.append("- none")
        lines.append("")
        lines.extend(
            [
                "### Disposition",
                "",
                f"- disposition: `{finding.get('disposition')}`",
                f"- design impact: `{finding.get('design_impact')}`",
                f"- structure map: `{finding.get('structure_map_delta')}`",
                "",
                "### canonical owner",
                "",
            ]
        )
        owner_paths = finding.get("canonical_owner_paths", [])
        if owner_paths:
            for owner in owner_paths:
                lines.append(
                    f"- `{owner.get('repository_key')}:{owner.get('path')}`"
                )
        else:
            lines.append("- none")
        lines.append("")
        external_assets = finding.get("external_exact_assets", [])
        if external_assets:
            lines.extend(["### secondary workspace actual asset exact identity", ""])
            for asset in external_assets:
                symbols = ", ".join(f"`{value}`" for value in asset.get("symbols", []))
                lines.append(
                    f"- `{asset.get('repository_key')}:{asset.get('path')}` "
                    f"@ `{asset.get('source_commit')}` / blob `{asset.get('blob_sha')}` "
                    f"(workspace `{asset.get('required_workspace')}`, `{asset.get('evidence_kind')}`): {symbols}"
                )
            lines.append("")
    if unresolved:
        lines.extend(["## blocking unresolved context", ""])
        for row in unresolved:
            if row.get("blocking"):
                lines.append(
                    f"- `{row['code']}` — category `{row['category_id']}`: {row['reason']}"
                )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _context_fingerprint_payload(
    workspace: str,
    task: str,
    manifests: Mapping[str, Any],
    workspace_profiles_sha256: str,
    task_profile_sha256: str,
    manual_overlay_sha256: str | None,
    selected_rows: Sequence[Mapping[str, Any]],
    output_sha256: Mapping[str, str],
) -> dict[str, Any]:
    return {
        "workspace": workspace,
        "task": task,
        "step1_manifest_sha256": manifests["inventory_sha256"],
        "step1_files_sha256": manifests["files_sha256"],
        "step2_manifest_sha256": manifests["code_index_manifest_sha256"],
        "step3_manifest_sha256": manifests["route_graph_manifest_sha256"],
        "publication_transport_sha256": manifests.get("publication_transport_sha256"),
        "workspace_profiles_sha256": workspace_profiles_sha256,
        "task_profile_sha256": task_profile_sha256,
        "manual_overlay_sha256": manual_overlay_sha256,
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(output_sha256.items())),
    }


def compile_task_context(
    *,
    repo_root: Path,
    system_context_root: Path,
    workspace: str,
    task: str,
    task_profiles_path: Path,
    manual_overlay_path: Path | None,
    output_dir: Path,
    external_workspace_root: Path | None = None,
    remote_verified: bool = False,
) -> CompileResult:
    """Compile and atomically publish one task context.

    ``remote_verified`` is accepted only for a distinct post-push verifier.  The
    public CLI always leaves it false, so local generation cannot self-award the
    durable completion claim.
    """
    workspace_dir = system_context_root / "current" / workspace
    external_workspace_root = (
        external_workspace_root.resolve()
        if external_workspace_root is not None
        else repo_root / ".cocolon-context-workspace"
    )
    manifests = _validate_manifest_chain(workspace_dir)
    workspace_profiles_path = system_context_root / "workspace_profiles.json"
    workspace_profiles = _read_json(workspace_profiles_path)
    task_profiles = _read_json(task_profiles_path)
    if task_profiles.get("schema_version") != PROFILE_SCHEMA_VERSION:
        raise ContextCompileError(
            f"unsupported task profile schema: {task_profiles.get('schema_version')!r}"
        )
    tasks = task_profiles.get("tasks", {})
    if task not in tasks:
        raise ContextCompileError(f"task profile not found: {task}")
    task_profile = tasks[task]
    _validate_workspace_refs(
        workspace, workspace_profiles, manifests["inventory"], repo_root
    )

    by_identity, by_key, by_path = _load_inventory(workspace_dir / "files.jsonl")
    symbol_owner = _load_symbol_owners(
        workspace_dir / "code_index" / "symbols.jsonl", by_key, by_path
    )
    route_owner = _load_route_owners(
        workspace_dir / "route_graph" / "api_routes.jsonl", by_key, by_path
    )
    domain_assignments = _load_domain_assignments(
        workspace_dir / "route_graph" / "file_domain_assignments.jsonl",
        by_key,
        by_path,
    )
    edge_specs = [
        (workspace_dir / "code_index" / "import_edges.jsonl", "import"),
        (workspace_dir / "code_index" / "references.jsonl", "reference"),
        (workspace_dir / "route_graph" / "rn_calls.jsonl", "rn_call"),
        (workspace_dir / "route_graph" / "api_routes.jsonl", "api_route"),
        (
            workspace_dir / "route_graph" / "cross_repository_route_edges.jsonl",
            "cross_repository_route",
        ),
        (
            workspace_dir / "route_graph" / "backend_call_edges.jsonl",
            "backend_call",
        ),
        (
            workspace_dir / "route_graph" / "route_owner_closures.jsonl",
            "route_owner",
        ),
        (
            workspace_dir / "route_graph" / "test_contract_edges.jsonl",
            "test_contract",
        ),
        (
            workspace_dir / "route_graph" / "api_model_edges.jsonl",
            "api_model",
        ),
    ]
    all_edges: dict[str, GraphEdge] = {}
    known_identities = set(by_identity)
    for path, edge_type in edge_specs:
        for item in _extract_edges_from_rows(
            path,
            edge_type,
            by_key,
            by_path,
            symbol_owner,
            route_owner,
            known_identities,
        ):
            all_edges[item.edge_id] = item

    reasons, requested_classification = _profile_seed_selection(
        by_identity, task_profile, domain_assignments
    )
    manual_overlay_sha256: str | None = None
    if manual_overlay_path is not None:
        overlay = _read_json(manual_overlay_path)
        manual_overlay_sha256 = _sha256_file(manual_overlay_path)
        for item in _apply_manual_overlay(
            overlay, by_key, reasons, requested_classification
        ):
            all_edges[item.edge_id] = item

    selected, distances, closure_reasons, used_edge_ids = _expand_fixed_point(
        reasons, list(all_edges.values())
    )
    for identity, values in closure_reasons.items():
        reasons.setdefault(identity, set()).update(values)
    missing = sorted(selected - set(by_identity))
    if missing:
        raise ContextCompileError(
            "selected identity is absent from Inventory: " + ", ".join(missing[:5])
        )

    selected_rows = [
        _selected_row(
            by_identity[identity],
            _classify_selected(
                by_identity[identity],
                requested_classification.get(identity),
                task_profile,
                distances.get(identity, 0),
            ),
            reasons.get(identity, set()),
            distances.get(identity, 0),
        )
        for identity in selected
    ]
    selected_rows.sort(
        key=lambda row: (
            CLASSIFICATION_PRIORITY[row["read_classification"]],
            row["graph_distance"],
            row["repository_key"],
            row["path"],
            row["identity"],
        )
    )

    coverage, unresolved, findings = _category_coverage(
        task_profile,
        by_identity,
        selected,
        workspace,
        workspace_profiles,
        external_workspace_root,
    )
    used_edges = [
        {
            "edge_id": item.edge_id,
            "edge_type": item.edge_type,
            "source_identity": item.source_identity,
            "target_identity": item.target_identity,
            "origin_file": item.origin_file,
            "origin_row": item.origin_row,
        }
        for item in sorted(all_edges.values(), key=lambda edge: edge.edge_id)
        if item.edge_id in used_edge_ids
        and item.source_identity in selected
        and item.target_identity in selected
    ]
    blocking_unresolved = sum(bool(row.get("blocking")) for row in unresolved)
    finding_review_complete = bool(findings) and all(
        bool(row.get("review_disposition_complete")) for row in findings
    )
    completion_gates = {
        "required_category_exact10_recovered": bool(
            coverage["observed_category_count"] == 10 and coverage["all_nonzero"]
        ),
        "required_category_exact10_all_pass": bool(coverage["all_pass"]),
        "full_text_read_order_generated": bool(selected_rows),
        "selected_file_identity_verified": not missing,
        "unresolved_visible": True,
        "actual_unincorporated_finding_extracted": bool(findings),
        "finding_used_for_cmee_review": finding_review_complete,
        "generated_output_remote_hash_verified": bool(remote_verified),
    }
    complete = all(completion_gates.values())
    status = (
        "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"
        if complete
        else "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    )

    output_dir.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(
        prefix=f"cocolon-{workspace}-{task}-", dir=str(output_dir.parent)
    ) as temporary:
        staging = Path(temporary)
        _write_jsonl(staging / "selected_files.jsonl", selected_rows)
        _write_jsonl(staging / "closure_edges.jsonl", used_edges)
        _write_bytes(
            staging / "required_category_coverage.json",
            _pretty_json_bytes(coverage),
        )
        _write_jsonl(staging / "unresolved_context.jsonl", unresolved)
        _write_bytes(
            staging / "full_text_read_order.md",
            _read_order_markdown(selected_rows, workspace, task).encode("utf-8"),
        )
        _write_bytes(
            staging / "cmee_context_overview.md",
            _overview_markdown(
                workspace,
                task,
                selected_rows,
                coverage,
                unresolved,
                findings,
                status,
            ).encode("utf-8"),
        )
        _write_bytes(
            staging / "cmee_unincorporated_actual_findings.md",
            _findings_markdown(findings, unresolved).encode("utf-8"),
        )
        output_sha256 = {
            name: _sha256_file(staging / name) for name in OUTPUT_NAMES
        }
        profile_document = {
            "schema_version": task_profiles["schema_version"],
            "task": task,
            "profile": task_profile,
        }
        profile_sha = _sha256_bytes(_canonical_json_bytes(profile_document))
        fingerprint_payload = _context_fingerprint_payload(
            workspace,
            task,
            manifests,
            _sha256_file(workspace_profiles_path),
            profile_sha,
            manual_overlay_sha256,
            selected_rows,
            output_sha256,
        )
        context_fingerprint = _sha256_bytes(
            _canonical_json_bytes(fingerprint_payload)
        )
        manifest = {
            "schema_version": SCHEMA_VERSION,
            "workspace": workspace,
            "task": task,
            "status": status,
            "completion_claim": status if complete else None,
            "context_fingerprint": context_fingerprint,
            "workspace_exact_refs": manifests["inventory"].get("repositories", {}),
            "input_sha256": {
                "step1_manifest": manifests["inventory_sha256"],
                "step1_files": manifests["files_sha256"],
                "step2_manifest": manifests["code_index_manifest_sha256"],
                "step3_manifest": manifests["route_graph_manifest_sha256"],
                "publication_transport": manifests.get("publication_transport_sha256"),
                "workspace_profiles": _sha256_file(workspace_profiles_path),
                "task_profile": profile_sha,
                "manual_overlay": manual_overlay_sha256,
            },
            "selected_file_count": len(selected_rows),
            "closure_edge_count": len(used_edges),
            "blocking_unresolved_count": blocking_unresolved,
            "actual_unincorporated_finding_count": len(findings),
            "required_category_coverage": {
                "expected_exact": coverage["required_category_exact"],
                "observed": coverage["observed_category_count"],
                "all_nonzero": coverage["all_nonzero"],
                "all_pass": coverage["all_pass"],
            },
            "completion_gates": completion_gates,
            "output_sha256": output_sha256,
            "product_credit": 0,
            "automatic_progression": False,
        }
        _write_bytes(staging / "context_manifest.json", _pretty_json_bytes(manifest))
        if output_dir.exists():
            shutil.rmtree(output_dir)
        shutil.move(str(staging), str(output_dir))

    verify_task_context(output_dir)
    return CompileResult(
        output_dir=output_dir,
        context_fingerprint=context_fingerprint,
        status=status,
        selected_count=len(selected_rows),
        unresolved_count=len(unresolved),
        actual_finding_count=len(findings),
    )


def verify_task_context(output_dir: Path) -> Mapping[str, Any]:
    """Verify output hashes and the context fingerprint; reject tampering."""
    manifest_path = output_dir / "context_manifest.json"
    manifest = _read_json(manifest_path)
    if manifest.get("schema_version") != SCHEMA_VERSION:
        raise ContextCompileError(
            f"unsupported context manifest schema: {manifest.get('schema_version')!r}"
        )
    output_sha = manifest.get("output_sha256", {})
    if set(output_sha) != set(OUTPUT_NAMES):
        raise ContextCompileError("context manifest output set is not canonical exact7")
    for name, expected in output_sha.items():
        actual = _sha256_file(output_dir / name)
        if actual != expected:
            raise ContextCompileError(f"context output tamper detected: {name}")
    selected_rows = list(_iter_jsonl(output_dir / "selected_files.jsonl"))
    payload = {
        "workspace": manifest["workspace"],
        "task": manifest["task"],
        "step1_manifest_sha256": manifest["input_sha256"]["step1_manifest"],
        "step1_files_sha256": manifest["input_sha256"]["step1_files"],
        "step2_manifest_sha256": manifest["input_sha256"]["step2_manifest"],
        "step3_manifest_sha256": manifest["input_sha256"]["step3_manifest"],
        "publication_transport_sha256": manifest["input_sha256"].get("publication_transport"),
        "workspace_profiles_sha256": manifest["input_sha256"]["workspace_profiles"],
        "task_profile_sha256": manifest["input_sha256"]["task_profile"],
        "manual_overlay_sha256": manifest["input_sha256"]["manual_overlay"],
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(output_sha.items())),
    }
    actual_fingerprint = _sha256_bytes(_canonical_json_bytes(payload))
    if actual_fingerprint != manifest.get("context_fingerprint"):
        raise ContextCompileError("context fingerprint tamper detected")
    return manifest
