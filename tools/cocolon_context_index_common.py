#!/usr/bin/env python3
"""Generate and verify Cocolon's locked two-repository SCIP/syntax index."""
from __future__ import annotations

import argparse
import ast
import collections
import hashlib
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from typing import Any, Iterable, Mapping, Sequence

PROFILE_SCHEMA = "cocolon.system_context.workspace_profiles.v1"
RUN_REPORT_SCHEMA = "cocolon.system_context.scip_runs.v1"
COVERAGE_SCHEMA = "cocolon.system_context.code_coverage.v2"
SYMBOL_SCHEMA = "cocolon.system_context.symbol.v2"
REFERENCE_SCHEMA = "cocolon.system_context.reference.v2"
DEPENDENCY_SCHEMA = "cocolon.system_context.file_dependency.v2"
ERROR_SCHEMA = "cocolon.system_context.parse_error.v2"
SUMMARY_SCHEMA = "cocolon.system_context.code_index_summary.v2"
MANIFEST_SCHEMA = "cocolon.system_context.code_index_manifest.v2"

OUTPUT_NAMES = (
    "indexer_runs.json",
    "coverage.jsonl",
    "symbols.jsonl",
    "references.jsonl",
    "file_dependencies.jsonl",
    "parse_errors.jsonl",
    "code_index_summary.json",
    "manifest.json",
)

TS_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}
PY_EXTENSIONS = {".py", ".pyi", ".pyw"}
GENERIC_CODE_EXTENSIONS = {
    ".c", ".cc", ".cpp", ".cxx", ".h", ".hpp", ".java", ".kt", ".kts",
    ".m", ".mm", ".rb", ".rs", ".sh", ".swift",
}
STRUCTURED_EXTENSIONS = {
    ".env", ".json", ".md", ".markdown", ".rst", ".sql", ".toml", ".xml",
    ".yaml", ".yml",
}
STRUCTURED_NAMES = {
    ".babelrc", ".editorconfig", ".env", ".gitattributes", ".gitignore",
    "dockerfile", "gemfile", "makefile", "requirements.txt",
}
SCIP_DEFINITION_ROLE = 1

MD_HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
MD_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)\s]+)(?:\s+['\"][^'\"]*['\"])?\)")
YAML_KEY_RE = re.compile(r"^(\s*)([A-Za-z0-9_.-]+)\s*:\s*(.*)$")
ENV_KEY_RE = re.compile(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=")
GENERIC_DECL_RE = re.compile(
    r"\b(?:class|def|function|func|struct|enum|interface|protocol|trait|module)\s+([A-Za-z_$][\w$]*)"
)
GENERIC_IMPORT_RE = re.compile(
    r"^\s*(?:#\s*)?(?:include|import|use|require|source|\.)\s*[<(\"']?([^>)\"';\s]+)"
)
SQL_DEF_RE = re.compile(
    r"\bCREATE\s+(?:OR\s+REPLACE\s+)?(?:TABLE|VIEW|FUNCTION|PROCEDURE|TRIGGER)\s+(?:IF\s+NOT\s+EXISTS\s+)?([A-Za-z_][\w$.]*)",
    re.IGNORECASE,
)
SQL_REF_RE = re.compile(
    r"\b(?:FROM|JOIN|INTO|UPDATE|REFERENCES|DELETE\s+FROM)\s+([A-Za-z_][\w$.]*)",
    re.IGNORECASE,
)


class CodeIndexError(RuntimeError):
    pass


def canon(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def stable_id(prefix: str, value: Mapping[str, Any]) -> str:
    return f"{prefix}:{sha256(canon(dict(value)))[:24]}"


def write_atomic(path: pathlib.Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def load_json(path: pathlib.Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise CodeIndexError(f"cannot read JSON {path}: {exc}") from exc


def read_jsonl(path: pathlib.Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise CodeIndexError(f"JSONL row is not an object: {path}:{number}")
            rows.append(value)
    except (OSError, json.JSONDecodeError) as exc:
        raise CodeIndexError(f"cannot read JSONL {path}: {exc}") from exc
    return rows


def repo_args(values: Sequence[str]) -> dict[str, pathlib.Path]:
    out: dict[str, pathlib.Path] = {}
    for value in values:
        if "=" not in value:
            raise CodeIndexError(f"--repo must be NAME=PATH: {value}")
        key, raw = value.split("=", 1)
        if not key or not raw or key in out:
            raise CodeIndexError(f"invalid or duplicate --repo: {value}")
        path = pathlib.Path(raw).expanduser().resolve()
        if not (path / ".git").exists():
            raise CodeIndexError(f"not a Git repository: {key}={path}")
        out[key] = path
    return out


def run_command(
    command: Sequence[str],
    *,
    cwd: pathlib.Path | None = None,
    env: Mapping[str, str] | None = None,
    timeout: int = 900,
) -> subprocess.CompletedProcess[str]:
    merged = os.environ.copy()
    if env:
        merged.update(env)
    try:
        return subprocess.run(
            list(command),
            cwd=str(cwd) if cwd else None,
            env=merged,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return subprocess.CompletedProcess(list(command), 124, "", str(exc))


def normalize_command(command: Sequence[str], repo: pathlib.Path, work: pathlib.Path) -> list[str]:
    repo_s = str(repo)
    work_s = str(work)
    return [str(part).replace(repo_s, "$REPO").replace(work_s, "$WORK") for part in command]


def tail(text: str, limit: int = 20) -> list[str]:
    return text.replace("\r\n", "\n").splitlines()[-limit:]


def git_head(repo: pathlib.Path) -> str:
    result = run_command(["git", "-C", str(repo), "rev-parse", "HEAD"], timeout=30)
    if result.returncode:
        raise CodeIndexError(f"cannot resolve HEAD in {repo}: {result.stderr}")
    return result.stdout.strip()


def profile_config(path: pathlib.Path, workspace: str) -> tuple[dict[str, Any], dict[str, Any]]:
    root = load_json(path)
    if root.get("schema_version") != PROFILE_SCHEMA:
        raise CodeIndexError("unsupported workspace profile schema")
    profile = root.get("profiles", {}).get(workspace)
    if not isinstance(profile, dict):
        raise CodeIndexError(f"unknown workspace: {workspace}")
    code_index = root.get("code_index")
    if not isinstance(code_index, dict):
        raise CodeIndexError("workspace_profiles.json lacks code_index configuration")
    return profile, code_index


def inventory_by_repo(rows: Sequence[Mapping[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    out: dict[str, list[dict[str, Any]]] = collections.defaultdict(list)
    for row in rows:
        key = row.get("workspace_repository_key")
        if not isinstance(key, str):
            raise CodeIndexError("inventory row lacks workspace_repository_key")
        out[key].append(dict(row))
    return dict(out)


class GitBatchReader:
    def __init__(self, repo: pathlib.Path) -> None:
        self.repo = repo
        self.proc = subprocess.Popen(
            ["git", "-C", str(repo), "cat-file", "--batch"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if self.proc.stdin is None or self.proc.stdout is None:
            raise CodeIndexError(f"cannot start git cat-file in {repo}")

    def read(self, object_sha: str) -> bytes:
        assert self.proc.stdin is not None and self.proc.stdout is not None
        self.proc.stdin.write(object_sha.encode("ascii") + b"\n")
        self.proc.stdin.flush()
        header = self.proc.stdout.readline()
        if not header:
            raise CodeIndexError(f"git cat-file ended while reading {object_sha}")
        parts = header.rstrip(b"\n").split()
        if len(parts) == 2 and parts[1] == b"missing":
            raise CodeIndexError(f"missing Git object {object_sha} in {self.repo}")
        if len(parts) != 3 or parts[1] != b"blob":
            raise CodeIndexError(f"unexpected git cat-file header for {object_sha}: {header!r}")
        size = int(parts[2])
        data = self.proc.stdout.read(size)
        newline = self.proc.stdout.read(1)
        if len(data) != size or newline != b"\n":
            raise CodeIndexError(f"truncated Git object {object_sha}")
        return data

    def close(self) -> None:
        if self.proc.stdin:
            self.proc.stdin.close()
        try:
            self.proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.proc.kill()
            self.proc.wait()
        stderr = self.proc.stderr.read().decode("utf-8", "replace") if self.proc.stderr else ""
        if self.proc.stdout:
            self.proc.stdout.close()
        if self.proc.stderr:
            self.proc.stderr.close()
        if self.proc.returncode not in (0, None):
            raise CodeIndexError(f"git cat-file failed in {self.repo}: {stderr}")

    def __enter__(self) -> "GitBatchReader":
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()


def exact_blob_bytes(row: Mapping[str, Any], reader: GitBatchReader) -> bytes:
    data = reader.read(str(row["object_sha"]))
    expected = row.get("content_sha256")
    if expected and sha256(data) != expected:
        raise CodeIndexError(
            f"inventory/Git content mismatch: {row['workspace_repository_key']}:{row['path']}"
        )
    return data


def extension(path: str) -> str:
    return pathlib.PurePosixPath(path).suffix.lower()


def target_class(row: Mapping[str, Any]) -> tuple[str, str | None]:
    if row.get("object_type") != "blob":
        return "INVENTORY_ONLY", "non_blob"
    if row.get("content_kind") == "BINARY":
        return "INVENTORY_ONLY", "binary"
    path = str(row["path"])
    low = path.lower()
    ext = extension(path)
    role = row.get("file_role")
    if "/system_context/current/" in f"/{low}" or role == "GENERATED_CONTEXT":
        return "INVENTORY_ONLY", "generated_projection"
    if role == "LOCKFILE":
        return "INVENTORY_ONLY", "lockfile"
    if ext in TS_EXTENSIONS:
        return "CODE_TYPESCRIPT", None
    if ext in PY_EXTENSIONS:
        return "CODE_PYTHON", None
    if ext in GENERIC_CODE_EXTENSIONS:
        return "CODE_GENERIC", None
    name = pathlib.PurePosixPath(path).name.lower()
    if name.startswith(".env") or ext in STRUCTURED_EXTENSIONS or name in STRUCTURED_NAMES:
        return "STRUCTURED_TEXT", None
    return "INVENTORY_ONLY", "unsupported_extension"


def language_for(path: str, target: str) -> str:
    ext = extension(path)
    if target == "CODE_TYPESCRIPT":
        return {".js": "javascript", ".jsx": "javascriptreact", ".ts": "typescript", ".tsx": "typescriptreact"}[ext]
    if target == "CODE_PYTHON":
        return "python"
    if target == "CODE_GENERIC":
        return ext.lstrip(".") or "generic"
    if target == "STRUCTURED_TEXT":
        name = pathlib.PurePosixPath(path).name.lower()
        if name.startswith(".env") or name == ".env":
            return "dotenv"
        return ext.lstrip(".") or name
    return "none"


def line_column(text: str, offset: int) -> tuple[int, int]:
    before = text[:offset]
    line = before.count("\n") + 1
    last = before.rfind("\n")
    return line, offset - last


def symbol_row(
    *,
    repository_key: str,
    repository: str,
    source_commit: str,
    path: str,
    name: str,
    kind: str,
    line: int | None,
    column: int | None,
    source: str,
    scip_symbol: str | None = None,
) -> dict[str, Any]:
    base = {
        "repository_key": repository_key,
        "repository": repository,
        "source_commit": source_commit,
        "path": path,
        "name": name,
        "kind": kind,
        "line": line,
        "column": column,
        "source": source,
        "scip_symbol": scip_symbol,
    }
    return {"schema_version": SYMBOL_SCHEMA, "symbol_id": stable_id("sym", base), **base}


def reference_row(
    *,
    repository_key: str,
    repository: str,
    source_commit: str,
    path: str,
    kind: str,
    target: str,
    line: int | None,
    column: int | None,
    source: str,
    resolved_repository_key: str | None = None,
    resolved_path: str | None = None,
    scip_symbol: str | None = None,
) -> dict[str, Any]:
    base = {
        "repository_key": repository_key,
        "repository": repository,
        "source_commit": source_commit,
        "path": path,
        "kind": kind,
        "target": target,
        "line": line,
        "column": column,
        "source": source,
        "resolved_repository_key": resolved_repository_key,
        "resolved_path": resolved_path,
        "scip_symbol": scip_symbol,
    }
    return {"schema_version": REFERENCE_SCHEMA, "reference_id": stable_id("ref", base), **base}


def error_row(
    *,
    repository_key: str,
    repository: str,
    source_commit: str,
    path: str,
    parser: str,
    code: str,
    message: str,
    line: int | None = None,
    column: int | None = None,
) -> dict[str, Any]:
    base = {
        "repository_key": repository_key,
        "repository": repository,
        "source_commit": source_commit,
        "path": path,
        "parser": parser,
        "code": code,
        "message": message[:1000],
        "line": line,
        "column": column,
    }
    return {"schema_version": ERROR_SCHEMA, "error_id": stable_id("err", base), **base}


