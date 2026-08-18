#!/usr/bin/env python3
"""Connect React Native API calls to FastAPI routes across Cocolon's two repositories."""
from __future__ import annotations

import argparse
import ast
import collections
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
from typing import Any, Iterable, Mapping, Sequence

RN_CALL_SCHEMA = "cocolon.system_context.rn_api_call.v1"
API_ROUTE_SCHEMA = "cocolon.system_context.api_route.v1"
ROUTE_EDGE_SCHEMA = "cocolon.system_context.cross_repository_route_edge.v1"
MODEL_EDGE_SCHEMA = "cocolon.system_context.api_model_edge.v1"
UNRESOLVED_SCHEMA = "cocolon.system_context.route_unresolved.v1"
SUMMARY_SCHEMA = "cocolon.system_context.route_graph_summary.v1"
MANIFEST_SCHEMA = "cocolon.system_context.route_graph_manifest.v1"

OUTPUT_NAMES = (
    "rn_calls.jsonl",
    "api_routes.jsonl",
    "cross_repository_route_edges.jsonl",
    "api_model_edges.jsonl",
    "unresolved_rn_calls.jsonl",
    "unresolved_api_consumers.jsonl",
    "route_extraction_errors.jsonl",
    "route_graph_summary.json",
    "route_graph_manifest.json",
)

TS_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}
PY_EXTENSIONS = {".py", ".pyi", ".pyw"}
HTTP_METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"}
ROUTE_DECORATORS = {"get", "post", "put", "patch", "delete", "options", "head"}
INFRA_ANNOTATIONS = {
    "Request", "Response", "BackgroundTasks", "WebSocket", "Depends", "Security",
    "str", "int", "float", "bool", "bytes", "dict", "list", "set", "tuple", "Any", "None",
    "Optional", "Union", "Literal", "Annotated", "Sequence", "Mapping", "List", "Dict", "Set", "Tuple",
    "Query", "Header", "Body", "Path", "File", "Form", "Cookie", "UploadFile",
}
PLACEHOLDER_RE = re.compile(r"\{[^{}]+\}")
URL_SCHEME_RE = re.compile(r"^[a-z][a-z0-9+.-]*://", re.IGNORECASE)


class RouteGraphError(RuntimeError):
    pass


def canon(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def stable_id(prefix: str, value: Mapping[str, Any]) -> str:
    return f"{prefix}:{sha256(canon(dict(value)))[:24]}"


def write_atomic(path: pathlib.Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + ".tmp")
    temp.write_bytes(data)
    os.replace(temp, path)


def load_json(path: pathlib.Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise RouteGraphError(f"cannot read JSON {path}: {exc}") from exc


def read_jsonl(path: pathlib.Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    try:
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip():
                continue
            value = json.loads(line)
            if not isinstance(value, dict):
                raise RouteGraphError(f"JSONL row is not an object: {path}:{number}")
            rows.append(value)
    except (OSError, json.JSONDecodeError) as exc:
        raise RouteGraphError(f"cannot read JSONL {path}: {exc}") from exc
    return rows


def sorted_jsonl(rows: Iterable[Mapping[str, Any]], keys: Sequence[str]) -> bytes:
    values = [dict(row) for row in rows]
    values.sort(key=lambda row: tuple((row.get(key) is None, row.get(key)) for key in keys))
    return b"".join(canon(row) for row in values)


def parse_repo_args(values: Sequence[str]) -> dict[str, pathlib.Path]:
    result: dict[str, pathlib.Path] = {}
    for value in values:
        if "=" not in value:
            raise RouteGraphError(f"--repo must be NAME=PATH: {value}")
        key, raw = value.split("=", 1)
        if not key or not raw or key in result:
            raise RouteGraphError(f"invalid or duplicate --repo: {value}")
        path = pathlib.Path(raw).expanduser().resolve()
        if not (path / ".git").exists():
            raise RouteGraphError(f"not a Git repository: {key}={path}")
        result[key] = path
    return result


def run_command(command: Sequence[str], *, timeout: int = 900) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            list(command),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return subprocess.CompletedProcess(list(command), 124, "", str(exc))


def git_head(repo: pathlib.Path) -> str:
    result = run_command(["git", "-C", str(repo), "rev-parse", "HEAD"], timeout=30)
    if result.returncode:
        raise RouteGraphError(f"cannot resolve HEAD in {repo}: {result.stderr}")
    return result.stdout.strip()


def inventory_identity(rows: Sequence[Mapping[str, Any]], repos: Mapping[str, pathlib.Path]) -> dict[str, str]:
    grouped: dict[str, set[str]] = collections.defaultdict(set)
    for row in rows:
        grouped[str(row["workspace_repository_key"])].add(str(row["source_commit"]))
    if set(grouped) != set(repos):
        raise RouteGraphError(f"inventory/repository mismatch: {sorted(grouped)} != {sorted(repos)}")
    result: dict[str, str] = {}
    for key, commits in grouped.items():
        if len(commits) != 1:
            raise RouteGraphError(f"inventory has multiple source commits for {key}")
        commit = next(iter(commits))
        if git_head(repos[key]) != commit:
            raise RouteGraphError(f"checkout HEAD does not match inventory for {key}")
        result[key] = commit
    return dict(sorted(result.items()))


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
            raise RouteGraphError(f"cannot start git cat-file in {repo}")

    def read(self, object_sha: str) -> bytes:
        assert self.proc.stdin is not None and self.proc.stdout is not None
        self.proc.stdin.write(object_sha.encode("ascii") + b"\n")
        self.proc.stdin.flush()
        header = self.proc.stdout.readline()
        parts = header.rstrip(b"\n").split()
        if len(parts) != 3 or parts[1] != b"blob":
            raise RouteGraphError(f"unexpected git object header for {object_sha}: {header!r}")
        size = int(parts[2])
        data = self.proc.stdout.read(size)
        newline = self.proc.stdout.read(1)
        if len(data) != size or newline != b"\n":
            raise RouteGraphError(f"truncated Git object {object_sha}")
        return data

    def close(self) -> None:
        if self.proc.stdin:
            self.proc.stdin.close()
        try:
            self.proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.proc.kill()
            self.proc.wait()
        if self.proc.stdout:
            self.proc.stdout.close()
        if self.proc.stderr:
            self.proc.stderr.close()
        if self.proc.returncode not in (0, None):
            raise RouteGraphError(f"git cat-file failed in {self.repo}")

    def __enter__(self) -> "GitBatchReader":
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()


def exact_blob(row: Mapping[str, Any], reader: GitBatchReader) -> bytes:
    data = reader.read(str(row["object_sha"]))
    expected = row.get("content_sha256")
    if expected and sha256(data) != expected:
        raise RouteGraphError(f"inventory/Git mismatch: {row['workspace_repository_key']}:{row['path']}")
    return data


def normalize_route_path(raw: str) -> tuple[str | None, str | None]:
    value = str(raw or "").strip()
    if not value:
        return None, "EMPTY_PATH"
    value = value.replace("\\", "/")
    if URL_SCHEME_RE.match(value):
        after_scheme = value.split("://", 1)[1]
        value = "/" + after_scheme.split("/", 1)[1] if "/" in after_scheme else "/"
    # Remove common base expressions retained by a partial evaluator.
    first_slash = value.find("/")
    if first_slash > 0 and ("API_BASE" in value[:first_slash].upper() or value.startswith("http")):
        value = value[first_slash:]
    value = value.split("#", 1)[0].split("?", 1)[0]
    value = re.sub(r"\$\{[^}]+\}", "{param}", value)
    value = re.sub(r"\{[^{}]+\}", "{param}", value)
    value = re.sub(r"/+", "/", value)
    if not value.startswith("/"):
        return None, "NON_HTTP_OR_DYNAMIC_PATH"
    if len(value) > 1:
        value = value.rstrip("/")
    return value, None


def route_signature(method: str, path: str) -> tuple[str, tuple[str, ...]]:
    segments = tuple("{}" if PLACEHOLDER_RE.fullmatch(segment) else segment for segment in path.strip("/").split("/") if segment)
    return method.upper(), segments


def path_match(call_path: str, route_path: str) -> str | None:
    call_segments = route_signature("GET", call_path)[1]
    route_segments = route_signature("GET", route_path)[1]
    if call_segments == route_segments:
        return "EXACT"
    if len(call_segments) != len(route_segments):
        return None
    for left, right in zip(call_segments, route_segments):
        if left == right:
            continue
        if left == "{}" or right == "{}":
            continue
        return None
    return "TEMPLATE"


def ast_name(node: ast.AST | None) -> str | None:
    if node is None:
        return None
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        base = ast_name(node.value)
        return f"{base}.{node.attr}" if base else node.attr
    if isinstance(node, ast.Subscript):
        return ast_name(node.value)
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    return None


def annotation_names(node: ast.AST | None) -> list[str]:
    if node is None:
        return []
    names: list[str] = []
    for child in ast.walk(node):
        if isinstance(child, ast.Name):
            names.append(child.id)
        elif isinstance(child, ast.Attribute):
            value = ast_name(child)
            if value:
                names.append(value)
    output: list[str] = []
    for name in names:
        tail = name.rsplit(".", 1)[-1]
        if tail not in INFRA_ANNOTATIONS and tail not in output:
            output.append(tail)
    return output


def literal_string(node: ast.AST | None, constants: Mapping[str, str] | None = None) -> str | None:
    if node is None:
        return None
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.Name) and constants and node.id in constants:
        return constants[node.id]
    if isinstance(node, ast.JoinedStr):
        parts: list[str] = []
        for value in node.values:
            if isinstance(value, ast.Constant) and isinstance(value.value, str):
                parts.append(value.value)
            else:
                parts.append("{param}")
        return "".join(parts)
    if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Add):
        left = literal_string(node.left, constants)
        right = literal_string(node.right, constants)
        if left is not None and right is not None:
            return left + right
    return None


def module_name(path: str) -> str:
    pure = pathlib.PurePosixPath(path)
    parts = list(pure.with_suffix("").parts)
    if parts and parts[-1] == "__init__":
        parts.pop()
    return ".".join(parts)


def resolve_import_module(current_module: str, imported_module: str | None, level: int) -> str:
    current_parts = current_module.split(".") if current_module else []
    if current_parts:
        current_parts = current_parts[:-1]
    if level:
        base = current_parts[: max(0, len(current_parts) - level + 1)]
    else:
        base = []
    suffix = imported_module.split(".") if imported_module else []
    return ".".join([part for part in base + suffix if part])


def parse_python_modules(
    rows: Sequence[Mapping[str, Any]],
    repo: pathlib.Path,
) -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    modules: dict[str, dict[str, Any]] = {}
    errors: list[dict[str, Any]] = []
    with GitBatchReader(repo) as reader:
        for row in rows:
            path = str(row["path"])
            if pathlib.PurePosixPath(path).suffix.lower() not in PY_EXTENSIONS:
                continue
            if row.get("file_role") not in {"SOURCE", "SCHEMA_OR_MIGRATION"} or row.get("content_kind") == "BINARY":
                continue
            data = exact_blob(row, reader)
            text = data.decode("utf-8", "replace")
            try:
                tree = ast.parse(text, filename=path)
            except SyntaxError as exc:
                errors.append({
                    "repository_key": "mashos-api",
                    "path": path,
                    "parser": "python_ast",
                    "code": "PYTHON_SYNTAX_ERROR",
                    "message": str(exc),
                    "line": exc.lineno,
                    "column": exc.offset,
                })
                continue
            name = module_name(path)
            constants: dict[str, str] = {}
            imports: dict[str, tuple[str, str]] = {}
            owners: dict[str, dict[str, Any]] = {}
            functions: list[ast.FunctionDef | ast.AsyncFunctionDef] = []
            includes: list[dict[str, Any]] = []
            for statement in tree.body:
                if isinstance(statement, (ast.Assign, ast.AnnAssign)):
                    targets = statement.targets if isinstance(statement, ast.Assign) else [statement.target]
                    value = statement.value
                    for target in targets:
                        if isinstance(target, ast.Name):
                            string_value = literal_string(value, constants)
                            if string_value is not None:
                                constants[target.id] = string_value
                            if isinstance(value, ast.Call):
                                called = ast_name(value.func) or ""
                                if called.endswith("APIRouter") or called.endswith("FastAPI"):
                                    prefix = None
                                    for keyword in value.keywords:
                                        if keyword.arg == "prefix":
                                            prefix = literal_string(keyword.value, constants)
                                    owners[target.id] = {
                                        "kind": "FASTAPI" if called.endswith("FastAPI") else "API_ROUTER",
                                        "prefix": prefix or "",
                                    }
                elif isinstance(statement, ast.ImportFrom):
                    imported_module = resolve_import_module(name, statement.module, statement.level)
                    for alias in statement.names:
                        imports[alias.asname or alias.name] = (imported_module, alias.name)
                elif isinstance(statement, ast.Import):
                    for alias in statement.names:
                        imports[alias.asname or alias.name.split(".")[0]] = (alias.name, "*")
                elif isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    functions.append(statement)
            for node in ast.walk(tree):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "include_router" and node.args:
                    child_expression = ast_name(node.args[0])
                    prefix = ""
                    for keyword in node.keywords:
                        if keyword.arg == "prefix":
                            prefix = literal_string(keyword.value, constants) or ""
                    includes.append({
                        "parent_owner": ast_name(node.func.value),
                        "child_expression": child_expression,
                        "prefix": prefix,
                        "line": getattr(node, "lineno", None),
                    })
            modules[name] = {
                "module": name,
                "path": path,
                "tree": tree,
                "constants": constants,
                "imports": imports,
                "owners": owners,
                "functions": functions,
                "includes": includes,
            }
    return modules, errors


def resolve_owner_expression(module: Mapping[str, Any], expression: str | None) -> tuple[str, str] | None:
    if not expression:
        return None
    if "." in expression:
        root, attr = expression.split(".", 1)
        imported = module["imports"].get(root)
        if imported:
            imported_module, imported_name = imported
            if imported_name == "*":
                return imported_module, attr
    imported = module["imports"].get(expression)
    if imported:
        return imported[0], imported[1]
    return str(module["module"]), expression


def join_paths(*parts: str) -> str:
    value = "/" + "/".join(part.strip("/") for part in parts if part and part != "/")
    value = re.sub(r"/+", "/", value)
    return value if value == "/" else value.rstrip("/")


def extract_api_routes(
    rows: Sequence[Mapping[str, Any]],
    repo: pathlib.Path,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    modules, errors = parse_python_modules(rows, repo)
    owner_mounts: dict[tuple[str, str], list[tuple[tuple[str, str], str]]] = collections.defaultdict(list)
    fastapi_owners: set[tuple[str, str]] = set()
    for module in modules.values():
        for owner_name, owner in module["owners"].items():
            if owner["kind"] == "FASTAPI":
                fastapi_owners.add((module["module"], owner_name))
        for include in module["includes"]:
            child = resolve_owner_expression(module, include["child_expression"])
            parent = resolve_owner_expression(module, include["parent_owner"])
            if child and parent:
                owner_mounts[child].append((parent, include["prefix"]))

    def owner_prefixes(owner_key: tuple[str, str], trail: set[tuple[str, str]] | None = None) -> list[tuple[str, str]]:
        trail = set(trail or set())
        if owner_key in trail:
            return [("", "MOUNT_CYCLE")]
        trail.add(owner_key)
        module = modules.get(owner_key[0])
        local_prefix = ""
        if module:
            local_prefix = str(module["owners"].get(owner_key[1], {}).get("prefix") or "")
        mounts = owner_mounts.get(owner_key, [])
        if owner_key in fastapi_owners:
            return [(local_prefix, "ROOT_FASTAPI")]
        if not mounts:
            return [(local_prefix, "UNMOUNTED_ROUTER")]
        values: list[tuple[str, str]] = []
        for parent, include_prefix in mounts:
            for parent_prefix, status in owner_prefixes(parent, set(trail)):
                values.append((join_paths(parent_prefix, include_prefix, local_prefix), status))
        return values

    routes: list[dict[str, Any]] = []
    model_edges: list[dict[str, Any]] = []
    for module in modules.values():
        constants = module["constants"]
        for function in module["functions"]:
            for decorator in function.decorator_list:
                if not isinstance(decorator, ast.Call) or not isinstance(decorator.func, ast.Attribute):
                    continue
                decorator_name = decorator.func.attr
                methods: list[str] = []
                if decorator_name in ROUTE_DECORATORS:
                    methods = [decorator_name.upper()]
                elif decorator_name == "api_route":
                    for keyword in decorator.keywords:
                        if keyword.arg == "methods" and isinstance(keyword.value, (ast.List, ast.Tuple, ast.Set)):
                            for item in keyword.value.elts:
                                value = literal_string(item, constants)
                                if value:
                                    methods.append(value.upper())
                if not methods:
                    continue
                local_path = literal_string(decorator.args[0], constants) if decorator.args else None
                if local_path is None:
                    errors.append({
                        "repository_key": "mashos-api",
                        "path": module["path"],
                        "parser": "python_ast",
                        "code": "ROUTE_PATH_UNRESOLVED",
                        "message": f"Cannot resolve route path for {function.name}",
                        "line": function.lineno,
                        "column": function.col_offset + 1,
                    })
                    continue
                owner_expression = ast_name(decorator.func.value)
                owner_key = resolve_owner_expression(module, owner_expression) or (module["module"], owner_expression or "app")
                prefixes = owner_prefixes(owner_key)
                response_models: list[str] = []
                for keyword in decorator.keywords:
                    if keyword.arg == "response_model":
                        name = ast_name(keyword.value)
                        if name:
                            response_models.append(name.rsplit(".", 1)[-1])
                if not response_models:
                    response_models.extend(annotation_names(function.returns))
                request_models: list[str] = []
                all_args = list(function.args.posonlyargs) + list(function.args.args) + list(function.args.kwonlyargs)
                for argument in all_args:
                    if argument.arg in {"self", "cls"}:
                        continue
                    for annotation in annotation_names(argument.annotation):
                        if annotation not in request_models:
                            request_models.append(annotation)
                for method in methods:
                    if method not in HTTP_METHODS:
                        continue
                    for prefix, mount_status in prefixes:
                        full_path = join_paths(prefix, local_path)
                        base = {
                            "repository_key": "mashos-api",
                            "path": module["path"],
                            "module": module["module"],
                            "line": function.lineno,
                            "endpoint_symbol": function.name,
                            "owner_expression": owner_expression,
                            "method": method,
                            "route_path": full_path,
                            "local_route_path": local_path,
                            "mount_status": mount_status,
                            "request_models": sorted(request_models),
                            "response_models": sorted(response_models),
                        }
                        route_id = stable_id("api-route", base)
                        route = {"schema_version": API_ROUTE_SCHEMA, "route_id": route_id, **base}
                        routes.append(route)
                        for model in request_models:
                            edge_base = {"route_id": route_id, "edge_kind": "USES_REQUEST_MODEL", "model": model}
                            model_edges.append({"schema_version": MODEL_EDGE_SCHEMA, "edge_id": stable_id("model-edge", edge_base), **edge_base})
                        for model in response_models:
                            edge_base = {"route_id": route_id, "edge_kind": "RETURNS_RESPONSE_MODEL", "model": model}
                            model_edges.append({"schema_version": MODEL_EDGE_SCHEMA, "edge_id": stable_id("model-edge", edge_base), **edge_base})
    unique_routes: dict[tuple[str, str, str, int, str], dict[str, Any]] = {}
    for route in routes:
        key = (str(route["method"]), str(route["route_path"]), str(route["path"]), int(route["line"]), str(route["endpoint_symbol"]))
        unique_routes.setdefault(key, route)
    routes = sorted(unique_routes.values(), key=lambda row: (row["method"], row["route_path"], row["path"], row["line"]))
    valid_route_ids = {route["route_id"] for route in routes}
    model_edges = [edge for edge in model_edges if edge["route_id"] in valid_route_ids]
    return routes, model_edges, errors


def extract_rn_calls(
    rows: Sequence[Mapping[str, Any]],
    repo: pathlib.Path,
    helper: pathlib.Path,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    files = []
    for row in rows:
        path = str(row["path"])
        if pathlib.PurePosixPath(path).suffix.lower() not in TS_EXTENSIONS:
            continue
        if row.get("file_role") != "SOURCE" or row.get("content_kind") == "BINARY":
            continue
        files.append({"path": path, "absolute_path": str((repo / path).resolve())})
    with tempfile.TemporaryDirectory() as raw:
        manifest = pathlib.Path(raw) / "rn-files.json"
        manifest.write_text(json.dumps({"files": files}, ensure_ascii=False), encoding="utf-8")
        result = run_command(["node", str(helper), str(manifest)], timeout=900)
        if result.returncode:
            raise RouteGraphError(f"RN route helper failed: {result.stderr}")
        root = json.loads(result.stdout)
    calls: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    for diagnostic in root.get("diagnostics", []) or []:
        errors.append({
            "repository_key": "Cocolon",
            "path": diagnostic.get("path"),
            "parser": "typescript",
            "code": diagnostic.get("code"),
            "message": str(diagnostic.get("message") or "TypeScript diagnostic")[:1000],
            "line": diagnostic.get("line"),
            "column": diagnostic.get("column"),
        })
    for raw_call in root.get("calls", []) or []:
        normalized_candidates: list[str] = []
        rejected: list[dict[str, str]] = []
        for candidate in raw_call.get("path_candidates", []) or []:
            normalized, reason = normalize_route_path(candidate)
            if normalized:
                if normalized not in normalized_candidates:
                    normalized_candidates.append(normalized)
            else:
                rejected.append({"candidate": str(candidate), "reason": str(reason)})
        base = {
            "repository_key": "Cocolon",
            "path": raw_call.get("path"),
            "line": raw_call.get("line"),
            "column": raw_call.get("column"),
            "caller_symbol": raw_call.get("caller_symbol"),
            "source_role": raw_call.get("source_role"),
            "call_kind": raw_call.get("call_kind"),
            "method": str(raw_call.get("method") or "UNKNOWN").upper(),
            "path_expression": raw_call.get("path_expression"),
            "raw_path_candidates": raw_call.get("path_candidates", []),
            "normalized_path_candidates": sorted(normalized_candidates),
            "rejected_path_candidates": rejected,
            "extraction_status": "PATH_RESOLVED" if normalized_candidates else "PATH_UNRESOLVED",
            "unresolved_reason": None if normalized_candidates else (raw_call.get("unresolved_reason") or "NO_NORMALIZED_HTTP_PATH"),
        }
        calls.append({"schema_version": RN_CALL_SCHEMA, "call_id": stable_id("rn-call", base), **base})
    calls.sort(key=lambda row: (str(row["path"]), int(row.get("line") or 0), int(row.get("column") or 0), str(row["call_id"])))
    return calls, errors


def visible_consumer(path: str) -> bool:
    low = "/" + path.lower()
    return any(marker in low for marker in ("/screens/", "/components/", "/navigation/", "/hooks/")) or low.endswith("screen.js") or low.endswith("screen.tsx")


def consumer_closure(call_path: str, import_edges: Sequence[Mapping[str, Any]], max_depth: int = 6) -> list[str]:
    reverse: dict[str, set[str]] = collections.defaultdict(set)
    for edge in import_edges:
        if edge.get("repository_key") != "Cocolon":
            continue
        target = edge.get("resolved_target_path")
        source = edge.get("source_path")
        if isinstance(target, str) and isinstance(source, str):
            reverse[target].add(source)
    seen = {call_path}
    queue = collections.deque([(call_path, 0)])
    consumers: set[str] = {call_path} if visible_consumer(call_path) else set()
    while queue:
        current, depth = queue.popleft()
        if depth >= max_depth:
            continue
        for source in sorted(reverse.get(current, set())):
            if source in seen:
                continue
            seen.add(source)
            if visible_consumer(source):
                consumers.add(source)
            queue.append((source, depth + 1))
    return sorted(consumers)


def match_routes(
    calls: list[dict[str, Any]],
    routes: list[dict[str, Any]],
    import_edges: Sequence[Mapping[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    edges: list[dict[str, Any]] = []
    unresolved_calls: list[dict[str, Any]] = []
    consumed_routes: set[str] = set()
    for call in calls:
        consumers = consumer_closure(str(call["path"]), import_edges)
        call["consumer_files"] = consumers
        candidates: list[tuple[int, str, dict[str, Any], str]] = []
        for route in routes:
            method = str(call["method"])
            if method != "UNKNOWN" and method != route["method"]:
                continue
            for call_path in call["normalized_path_candidates"]:
                quality = path_match(str(call_path), str(route["route_path"]))
                if quality:
                    score = 0 if quality == "EXACT" and method != "UNKNOWN" else 1 if quality == "TEMPLATE" and method != "UNKNOWN" else 2
                    candidates.append((score, str(call_path), route, quality))
        if not candidates:
            if str(call["extraction_status"]) == "PATH_UNRESOLVED":
                status = "UNRESOLVED_PATH"
            elif str(call["method"]) == "UNKNOWN":
                status = "METHOD_OR_ROUTE_UNRESOLVED"
            else:
                status = "NO_API_ROUTE_MATCH"
            call["connection_status"] = status
            call["matched_route_ids"] = []
            unresolved_calls.append({
                "schema_version": UNRESOLVED_SCHEMA,
                "subject_kind": "RN_CALL",
                "subject_id": call["call_id"],
                "repository_key": "Cocolon",
                "path": call["path"],
                "reason": status,
                "method": call["method"],
                "path_candidates": call["normalized_path_candidates"],
            })
            continue
        best_score = min(item[0] for item in candidates)
        best = [item for item in candidates if item[0] == best_score]
        unique_route_ids = sorted({item[2]["route_id"] for item in best})
        call["matched_route_ids"] = unique_route_ids
        call["connection_status"] = "AMBIGUOUS" if len(unique_route_ids) > 1 else ("MATCHED_EXACT" if best_score == 0 else "MATCHED_TEMPLATE" if best_score == 1 else "MATCHED_PATH_METHOD_UNKNOWN")
        if len(unique_route_ids) > 1:
            unresolved_calls.append({
                "schema_version": UNRESOLVED_SCHEMA,
                "subject_kind": "RN_CALL",
                "subject_id": call["call_id"],
                "repository_key": "Cocolon",
                "path": call["path"],
                "reason": "AMBIGUOUS_ROUTE_MATCH",
                "method": call["method"],
                "path_candidates": call["normalized_path_candidates"],
                "matched_route_ids": unique_route_ids,
            })
        for _score, matched_path, route, quality in best:
            edge_base = {
                "edge_kind": "RN_CALLS_API_ROUTE",
                "rn_call_id": call["call_id"],
                "api_route_id": route["route_id"],
                "method": call["method"],
                "matched_call_path": matched_path,
                "api_route_path": route["route_path"],
                "match_quality": quality,
                "rn_source_path": call["path"],
                "api_source_path": route["path"],
                "consumer_files": consumers,
            }
            edges.append({"schema_version": ROUTE_EDGE_SCHEMA, "edge_id": stable_id("route-edge", edge_base), **edge_base})
            consumed_routes.add(str(route["route_id"]))

    unresolved_api: list[dict[str, Any]] = []
    for route in routes:
        if route["route_id"] in consumed_routes:
            route["consumer_classification"] = "RN_CONSUMED"
        elif str(route["route_path"]).startswith("/public/"):
            route["consumer_classification"] = "EXTERNAL_PUBLIC_NO_RN_CALL"
        elif str(route["route_path"]) in {"/health", "/healthz", "/ready", "/readiness", "/metrics"}:
            route["consumer_classification"] = "INFRASTRUCTURE"
        else:
            route["consumer_classification"] = "UNRESOLVED_CONSUMER"
            unresolved_api.append({
                "schema_version": UNRESOLVED_SCHEMA,
                "subject_kind": "API_ROUTE",
                "subject_id": route["route_id"],
                "repository_key": "mashos-api",
                "path": route["path"],
                "reason": "NO_RN_CONSUMER_CLASSIFICATION",
                "method": route["method"],
                "route_path": route["route_path"],
            })
    return edges, unresolved_calls, unresolved_api


def build_route_graph(
    inventory: pathlib.Path,
    repos: Mapping[str, pathlib.Path],
    code_index: pathlib.Path,
    rn_helper: pathlib.Path,
    output: pathlib.Path,
) -> dict[str, Any]:
    rows = read_jsonl(inventory)
    commits = inventory_identity(rows, repos)
    code_summary = load_json(code_index / "code_index_summary.json")
    code_manifest = load_json(code_index / "code_index_manifest.json")
    if code_summary.get("completion_claim") != "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED":
        raise RouteGraphError("Step 2 code index is not complete")
    if code_manifest.get("inventory_sha256") != sha256(inventory.read_bytes()):
        raise RouteGraphError("Step 2 code index does not match inventory")
    import_edges = read_jsonl(code_index / "import_edges.jsonl")
    cocolon_rows = [row for row in rows if row["workspace_repository_key"] == "Cocolon"]
    api_rows = [row for row in rows if row["workspace_repository_key"] == "mashos-api"]
    rn_calls, rn_errors = extract_rn_calls(cocolon_rows, repos["Cocolon"], rn_helper)
    api_routes, model_edges, api_errors = extract_api_routes(api_rows, repos["mashos-api"])
    route_edges, unresolved_rn, unresolved_api = match_routes(rn_calls, api_routes, import_edges)
    extraction_errors = rn_errors + api_errors

    call_ids = [str(row["call_id"]) for row in rn_calls]
    route_ids = [str(row["route_id"]) for row in api_routes]
    edge_ids = [str(row["edge_id"]) for row in route_edges]
    if len(call_ids) != len(set(call_ids)) or len(route_ids) != len(set(route_ids)) or len(edge_ids) != len(set(edge_ids)):
        raise RouteGraphError("duplicate route graph identity")

    output.mkdir(parents=True, exist_ok=True)
    output_bytes: dict[str, bytes] = {
        "rn_calls.jsonl": sorted_jsonl(rn_calls, ("path", "line", "column", "call_id")),
        "api_routes.jsonl": sorted_jsonl(api_routes, ("method", "route_path", "path", "line", "route_id")),
        "cross_repository_route_edges.jsonl": sorted_jsonl(route_edges, ("rn_source_path", "method", "matched_call_path", "edge_id")),
        "api_model_edges.jsonl": sorted_jsonl(model_edges, ("route_id", "edge_kind", "model", "edge_id")),
        "unresolved_rn_calls.jsonl": sorted_jsonl(unresolved_rn, ("path", "method", "subject_id")),
        "unresolved_api_consumers.jsonl": sorted_jsonl(unresolved_api, ("route_path", "method", "subject_id")),
        "route_extraction_errors.jsonl": sorted_jsonl(extraction_errors, ("repository_key", "path", "line", "code")),
    }
    connection_counts = dict(sorted(collections.Counter(str(row.get("connection_status")) for row in rn_calls).items()))
    consumer_counts = dict(sorted(collections.Counter(str(row.get("consumer_classification")) for row in api_routes).items()))
    summary = {
        "schema_version": SUMMARY_SCHEMA,
        "workspace_source_commits": commits,
        "inventory_total": len(rows),
        "rn_call_count": len(rn_calls),
        "api_route_count": len(api_routes),
        "cross_repository_edge_count": len(route_edges),
        "api_model_edge_count": len(model_edges),
        "rn_connection_counts": connection_counts,
        "api_consumer_counts": consumer_counts,
        "unresolved_rn_call_count": len(unresolved_rn),
        "unresolved_api_consumer_count": len(unresolved_api),
        "route_extraction_error_count": len(extraction_errors),
        "rn_call_coverage_count": len(rn_calls),
        "api_route_coverage_count": len(api_routes),
        "silent_unresolved_count": 0,
        "step2_completion_claim": code_summary["completion_claim"],
        "completion_claim": "STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED",
        "product_credit": 0,
        "automatic_progression": False,
    }
    output_bytes["route_graph_summary.json"] = canon(summary)
    manifest = {
        "schema_version": MANIFEST_SCHEMA,
        "inventory_sha256": sha256(inventory.read_bytes()),
        "code_index_manifest_sha256": sha256((code_index / "code_index_manifest.json").read_bytes()),
        "output_sha256": {name: sha256(data) for name, data in output_bytes.items()},
        "completion_claim": summary["completion_claim"],
        "product_credit": 0,
        "automatic_progression": False,
    }
    output_bytes["route_graph_manifest.json"] = canon(manifest)
    for name, data in output_bytes.items():
        write_atomic(output / name, data)
    if not rn_calls:
        raise RouteGraphError("no RN API calls detected")
    if not api_routes:
        raise RouteGraphError("no API routes detected")
    if not route_edges:
        raise RouteGraphError("no cross-repository route edges detected")
    return summary


def verify_route_graph(inventory: pathlib.Path, code_index: pathlib.Path, output: pathlib.Path) -> dict[str, Any]:
    manifest = load_json(output / "route_graph_manifest.json")
    if manifest.get("schema_version") != MANIFEST_SCHEMA:
        raise RouteGraphError("unsupported route-graph manifest")
    if manifest.get("inventory_sha256") != sha256(inventory.read_bytes()):
        raise RouteGraphError("route-graph inventory identity mismatch")
    if manifest.get("code_index_manifest_sha256") != sha256((code_index / "code_index_manifest.json").read_bytes()):
        raise RouteGraphError("route-graph Step 2 identity mismatch")
    for name, expected in manifest.get("output_sha256", {}).items():
        path = output / name
        if not path.exists() or sha256(path.read_bytes()) != expected:
            raise RouteGraphError(f"route-graph output verification failed: {name}")
    calls = read_jsonl(output / "rn_calls.jsonl")
    routes = read_jsonl(output / "api_routes.jsonl")
    edges = read_jsonl(output / "cross_repository_route_edges.jsonl")
    unresolved_calls = read_jsonl(output / "unresolved_rn_calls.jsonl")
    unresolved_call_ids = {row["subject_id"] for row in unresolved_calls}
    edge_call_ids = {row["rn_call_id"] for row in edges}
    call_ids = {row["call_id"] for row in calls}
    if not call_ids.issubset(unresolved_call_ids | edge_call_ids):
        raise RouteGraphError("RN call missing matched or unresolved classification")
    route_ids = {row["route_id"] for row in routes}
    if any(edge["api_route_id"] not in route_ids for edge in edges):
        raise RouteGraphError("route edge targets an unknown API route")
    summary = load_json(output / "route_graph_summary.json")
    if summary.get("completion_claim") != "STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED":
        raise RouteGraphError("Step 3 completion claim missing")
    if int(summary.get("cross_repository_edge_count") or 0) <= 0:
        raise RouteGraphError("Step 3 has no cross-repository edge")
    if summary.get("silent_unresolved_count") != 0:
        raise RouteGraphError("silent unresolved route exists")
    return summary


def cli(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    build = sub.add_parser("build")
    build.add_argument("--inventory", required=True, type=pathlib.Path)
    build.add_argument("--repo", action="append", required=True)
    build.add_argument("--code-index", required=True, type=pathlib.Path)
    build.add_argument("--rn-helper", required=True, type=pathlib.Path)
    build.add_argument("--output", required=True, type=pathlib.Path)

    verify = sub.add_parser("verify")
    verify.add_argument("--inventory", required=True, type=pathlib.Path)
    verify.add_argument("--code-index", required=True, type=pathlib.Path)
    verify.add_argument("--output", required=True, type=pathlib.Path)

    args = parser.parse_args(argv)
    try:
        if args.command == "build":
            summary = build_route_graph(
                args.inventory,
                parse_repo_args(args.repo),
                args.code_index,
                args.rn_helper,
                args.output,
            )
        else:
            summary = verify_route_graph(args.inventory, args.code_index, args.output)
        print(canon(summary).decode("utf-8"), end="")
        return 0
    except RouteGraphError as exc:
        print(f"ROUTE_GRAPH_ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(cli())
