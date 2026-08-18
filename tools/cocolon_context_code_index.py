#!/usr/bin/env python3
"""Build syntax/SCIP coverage and symbol/reference graph over the locked Cocolon workspace."""
from __future__ import annotations

import argparse
import ast
import json
import pathlib
import re
import subprocess
from typing import Any, Sequence

SOURCE_PRECISE_EXT = {".py", ".js", ".jsx", ".ts", ".tsx"}
SYNTAX_EXT = {".java", ".kt", ".kts", ".swift", ".m", ".mm", ".c", ".cc", ".cpp", ".h", ".hpp", ".sh", ".rb", ".rs"}
IMPORT_RE_JS = re.compile(r'''(?:import\s+(?:[^'\"]+\s+from\s+)?|require\()\s*['\"]([^'\"]+)['\"]''')
FUNC_RE_JS = re.compile(r'''(?:function\s+([A-Za-z_$][\w$]*)\s*\(|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>|class\s+([A-Za-z_$][\w$]*))''')


def canon(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def read_inventory(path: pathlib.Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def line_of(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def py_parse(path: str, text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    symbols: list[dict[str, Any]] = []
    refs: list[dict[str, Any]] = []
    try:
        tree = ast.parse(text, filename=path)
    except SyntaxError as exc:
        return [], [{"kind": "parse_error", "target": str(exc), "line": exc.lineno or 0}]
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            symbols.append({"name": node.name, "kind": node.__class__.__name__, "line": node.lineno})
        elif isinstance(node, ast.Import):
            for alias in node.names:
                refs.append({"kind": "import", "target": alias.name, "line": node.lineno})
        elif isinstance(node, ast.ImportFrom):
            module = node.module or ""
            for alias in node.names:
                refs.append({"kind": "import", "target": module + ("." if module else "") + alias.name, "line": node.lineno})
    return symbols, refs


def js_parse(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    symbols: list[dict[str, Any]] = []
    refs: list[dict[str, Any]] = []
    for match in FUNC_RE_JS.finditer(text):
        name = next((group for group in match.groups() if group), None)
        if name:
            symbols.append({"name": name, "kind": "syntax_symbol", "line": line_of(text, match.start())})
    for match in IMPORT_RE_JS.finditer(text):
        refs.append({"kind": "import", "target": match.group(1), "line": line_of(text, match.start())})
    return symbols, refs


def generic_parse(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    symbols: list[dict[str, Any]] = []
    for line_no, line in enumerate(text.splitlines(), 1):
        match = re.search(r"\b(?:class|def|function|func|struct|enum|interface)\s+([A-Za-z_$][\w$]*)", line)
        if match:
            symbols.append({"name": match.group(1), "kind": "syntax_symbol", "line": line_no})
    return symbols, []


def resolve_relative(current: str, target: str, all_paths: set[str]) -> str | None:
    if not target.startswith("."):
        return None
    parts: list[str] = []
    for part in pathlib.PurePosixPath(current).parent.joinpath(target).parts:
        if part == "..":
            if parts:
                parts.pop()
        elif part not in (".", ""):
            parts.append(part)
    base = "/".join(parts)
    candidates = (base, base + ".js", base + ".jsx", base + ".ts", base + ".tsx", base + ".py", base + "/index.js", base + "/index.ts", base + "/index.tsx")
    return next((candidate for candidate in candidates if candidate in all_paths), None)


def scip_rows(path: pathlib.Path, repository_key: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Read `scip print --json` output if present. Missing/invalid output is an explicit fallback, not a silent success."""
    if not path.exists():
        return [], []
    try:
        root = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return [], []
    symbols: list[dict[str, Any]] = []
    refs: list[dict[str, Any]] = []
    for document in root.get("documents", []):
        rel = document.get("relativePath") or document.get("relative_path")
        if not rel:
            continue
        for info in document.get("symbols", []):
            symbol = info.get("symbol")
            if symbol:
                symbols.append({"repository_key": repository_key, "path": rel, "name": symbol, "kind": "SCIP_SYMBOL", "line": None, "source": "SCIP"})
        for occ in document.get("occurrences", []):
            symbol = occ.get("symbol")
            if symbol:
                refs.append({"repository_key": repository_key, "path": rel, "kind": "SCIP_OCCURRENCE", "target": symbol, "line": None, "resolved_path": None, "source": "SCIP"})
    return symbols, refs


def build(args: argparse.Namespace) -> dict[str, Any]:
    rows = read_inventory(pathlib.Path(args.inventory))
    repos = {key: pathlib.Path(value) for key, value in (item.split("=", 1) for item in args.repo)}
    all_by_key: dict[str, set[str]] = {}
    for row in rows:
        all_by_key.setdefault(row["workspace_repository_key"], set()).add(row["path"])

    scip_symbol_map: dict[tuple[str, str], list[dict[str, Any]]] = {}
    scip_ref_map: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for item in args.scip_json or []:
        key, raw = item.split("=", 1)
        srows, rrows = scip_rows(pathlib.Path(raw), key)
        for row in srows:
            scip_symbol_map.setdefault((key, row["path"]), []).append(row)
        for row in rrows:
            scip_ref_map.setdefault((key, row["path"]), []).append(row)

    symbols: list[dict[str, Any]] = []
    refs: list[dict[str, Any]] = []
    coverage: list[dict[str, Any]] = []

    for row in rows:
        key = row["workspace_repository_key"]
        path = row["path"]
        ext = pathlib.PurePosixPath(path).suffix.lower()
        if row["object_type"] != "blob":
            coverage.append({"repository_key": key, "path": path, "index_mode": "INVENTORY_ONLY", "reason": "non_blob"})
            continue
        if row["content_kind"] == "BINARY":
            coverage.append({"repository_key": key, "path": path, "index_mode": "INVENTORY_ONLY", "reason": "binary"})
            continue
        if ext not in SOURCE_PRECISE_EXT | SYNTAX_EXT:
            coverage.append({"repository_key": key, "path": path, "index_mode": "INVENTORY_ONLY", "reason": "non_source_extension"})
            continue

        data = subprocess.check_output(["git", "-C", str(repos[key]), "show", f"{row['source_commit']}:{path}"])
        text = data.decode("utf-8", "replace")
        scip_key = (key, path)
        if scip_key in scip_symbol_map or scip_key in scip_ref_map:
            coverage.append({"repository_key": key, "path": path, "index_mode": "SCIP_PRECISE_INDEXED", "reason": None})
            symbols.extend(scip_symbol_map.get(scip_key, []))
            refs.extend(scip_ref_map.get(scip_key, []))
            continue

        if ext == ".py":
            srows, rrows = py_parse(path, text)
            mode = "SYNTAX_FALLBACK_SCIP_ELIGIBLE"
        elif ext in {".js", ".jsx", ".ts", ".tsx"}:
            srows, rrows = js_parse(text)
            mode = "SYNTAX_FALLBACK_SCIP_ELIGIBLE"
        else:
            srows, rrows = generic_parse(text)
            mode = "SYNTAX_INDEXED"
        coverage.append({"repository_key": key, "path": path, "index_mode": mode, "reason": None})
        for item in srows:
            symbols.append({"repository_key": key, "path": path, **item, "source": "SYNTAX"})
        for item in rrows:
            refs.append({"repository_key": key, "path": path, **item, "resolved_path": resolve_relative(path, item["target"], all_by_key[key]), "source": "SYNTAX"})

    out = pathlib.Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    for name, data in (("symbols.jsonl", symbols), ("references.jsonl", refs), ("coverage.jsonl", coverage)):
        (out / name).write_text("".join(canon(item) + "\n" for item in data), encoding="utf-8")
    summary = {
        "schema_version": "cocolon.system_context.code_index_summary.v1",
        "inventory_total": len(rows),
        "coverage_total": len(coverage),
        "source_candidate_count": sum(1 for item in coverage if item["index_mode"] != "INVENTORY_ONLY"),
        "scip_precise_indexed_count": sum(1 for item in coverage if item["index_mode"] == "SCIP_PRECISE_INDEXED"),
        "syntax_fallback_scip_eligible_count": sum(1 for item in coverage if item["index_mode"] == "SYNTAX_FALLBACK_SCIP_ELIGIBLE"),
        "syntax_indexed_count": sum(1 for item in coverage if item["index_mode"] == "SYNTAX_INDEXED"),
        "inventory_only_count": sum(1 for item in coverage if item["index_mode"] == "INVENTORY_ONLY"),
        "symbol_count": len(symbols),
        "reference_count": len(refs),
        "coverage_gap_count": len(rows) - len(coverage),
        "product_credit": 0,
        "automatic_progression": False,
        "completion_claim": "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED",
    }
    (out / "code_index_summary.json").write_text(canon(summary) + "\n", encoding="utf-8")
    return summary


def cli(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", required=True)
    parser.add_argument("--repo", action="append", required=True)
    parser.add_argument("--scip-json", action="append")
    parser.add_argument("--output", required=True)
    args = parser.parse_args(argv)
    print(canon(build(args)))
    return 0


if __name__ == "__main__":
    raise SystemExit(cli())
