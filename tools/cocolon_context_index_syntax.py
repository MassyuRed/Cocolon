"""Syntax extraction for the Cocolon system-context index."""
from cocolon_context_index_common import *

class PythonSyntaxVisitor(ast.NodeVisitor):
    def __init__(self) -> None:
        self.stack: list[str] = []
        self.symbols: list[dict[str, Any]] = []
        self.references: list[dict[str, Any]] = []

    def _qualified(self, name: str) -> str:
        return ".".join((*self.stack, name)) if self.stack else name

    def _definition(self, node: ast.AST, name: str, kind: str) -> None:
        self.symbols.append(
            {"name": self._qualified(name), "kind": kind, "line": getattr(node, "lineno", 0), "column": getattr(node, "col_offset", 0) + 1}
        )

    def visit_ClassDef(self, node: ast.ClassDef) -> Any:
        self._definition(node, node.name, "CLASS")
        self.stack.append(node.name)
        self.generic_visit(node)
        self.stack.pop()

    def visit_FunctionDef(self, node: ast.FunctionDef) -> Any:
        self._definition(node, node.name, "FUNCTION")
        self.stack.append(node.name)
        self.generic_visit(node)
        self.stack.pop()

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> Any:
        self._definition(node, node.name, "ASYNC_FUNCTION")
        self.stack.append(node.name)
        self.generic_visit(node)
        self.stack.pop()

    def visit_Import(self, node: ast.Import) -> Any:
        for alias in node.names:
            self.references.append(
                {"kind": "IMPORT", "target": alias.name, "module": alias.name, "level": 0, "line": node.lineno, "column": node.col_offset + 1}
            )

    def visit_ImportFrom(self, node: ast.ImportFrom) -> Any:
        module = node.module or ""
        for alias in node.names:
            target = module + ("." if module and alias.name != "*" else "") + ("" if alias.name == "*" else alias.name)
            self.references.append(
                {"kind": "IMPORT_FROM", "target": target or "." * node.level, "module": module, "level": node.level, "line": node.lineno, "column": node.col_offset + 1}
            )


def parse_python(path: str, text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    try:
        tree = ast.parse(text, filename=path, type_comments=True)
    except (SyntaxError, ValueError) as exc:
        return [], [], [{"code": "PYTHON_PARSE_ERROR", "message": str(exc), "line": getattr(exc, "lineno", 0) or 0, "column": getattr(exc, "offset", 0) or 0}], "ERROR"
    visitor = PythonSyntaxVisitor()
    visitor.visit(tree)
    visitor.symbols.sort(key=lambda row: (row["line"], row["column"], row["name"]))
    visitor.references.sort(key=lambda row: (row["line"], row["column"], row["target"]))
    return visitor.symbols, visitor.references, [], "PARSED"


def parse_markdown(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    symbols: list[dict[str, Any]] = []
    references: list[dict[str, Any]] = []
    for number, line in enumerate(text.splitlines(), 1):
        heading = MD_HEADING_RE.match(line)
        if heading:
            symbols.append({"name": heading.group(2).strip(), "kind": f"HEADING_{len(heading.group(1))}", "line": number, "column": 1})
        for match in MD_LINK_RE.finditer(line):
            references.append({"kind": "MARKDOWN_LINK", "target": match.group(1), "line": number, "column": match.start(1) + 1})
    return symbols, references, [], "PARSED"


def parse_json_text(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    try:
        root = json.loads(text)
    except json.JSONDecodeError as exc:
        return [], [], [{"code": "JSON_PARSE_ERROR", "message": exc.msg, "line": exc.lineno, "column": exc.colno}], "ERROR"
    symbols: list[dict[str, Any]] = []
    references: list[dict[str, Any]] = []

    def walk(value: Any, pointer: str) -> None:
        if isinstance(value, dict):
            for key in sorted(value):
                child = pointer + "/" + str(key).replace("~", "~0").replace("/", "~1")
                symbols.append({"name": child, "kind": "JSON_KEY", "line": None, "column": None})
                if key == "$ref" and isinstance(value[key], str):
                    references.append({"kind": "JSON_REF", "target": value[key], "line": None, "column": None})
                walk(value[key], child)
        elif isinstance(value, list):
            for index, item in enumerate(value):
                walk(item, pointer + f"/{index}")

    walk(root, "")
    return symbols, references, [], "PARSED"


def parse_yaml_text(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    symbols: list[dict[str, Any]] = []
    references: list[dict[str, Any]] = []
    stack: list[tuple[int, str]] = []
    for number, line in enumerate(text.splitlines(), 1):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        match = YAML_KEY_RE.match(line)
        if not match:
            continue
        indent = len(match.group(1).replace("\t", "    "))
        key = match.group(2)
        value = match.group(3).strip().strip("'\"")
        while stack and stack[-1][0] >= indent:
            stack.pop()
        pointer = "/" + "/".join([entry[1] for entry in stack] + [key])
        symbols.append({"name": pointer, "kind": "YAML_KEY", "line": number, "column": indent + 1})
        stack.append((indent, key))
        if key in {"uses", "path", "$ref", "include"} and value:
            references.append({"kind": f"YAML_{key.upper()}", "target": value, "line": number, "column": line.find(value) + 1})
    return symbols, references, [], "PARSED"


def parse_env_text(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    symbols: list[dict[str, Any]] = []
    for number, line in enumerate(text.splitlines(), 1):
        match = ENV_KEY_RE.match(line)
        if match:
            symbols.append({"name": match.group(1), "kind": "ENV_KEY", "line": number, "column": match.start(1) + 1})
    return symbols, [], [], "PARSED"


def parse_sql_text(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    symbols = []
    references = []
    for match in SQL_DEF_RE.finditer(text):
        line, column = line_column(text, match.start(1))
        symbols.append({"name": match.group(1), "kind": "SQL_DEFINITION", "line": line, "column": column})
    for match in SQL_REF_RE.finditer(text):
        line, column = line_column(text, match.start(1))
        references.append({"kind": "SQL_RELATION", "target": match.group(1), "line": line, "column": column})
    return symbols, references, [], "PARSED"


def parse_xml_text(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    try:
        root = ET.fromstring(text)
    except ET.ParseError as exc:
        line, column = getattr(exc, "position", (0, 0))
        return [], [], [{"code": "XML_PARSE_ERROR", "message": str(exc), "line": line, "column": column + 1}], "ERROR"
    counts: collections.Counter[str] = collections.Counter(element.tag for element in root.iter())
    symbols = [{"name": name, "kind": "XML_TAG", "line": None, "column": None} for name in sorted(counts)]
    return symbols, [], [], "PARSED"


def parse_generic_code(text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str]:
    symbols: list[dict[str, Any]] = []
    references: list[dict[str, Any]] = []
    for number, line in enumerate(text.splitlines(), 1):
        for match in GENERIC_DECL_RE.finditer(line):
            symbols.append({"name": match.group(1), "kind": "GENERIC_DECLARATION", "line": number, "column": match.start(1) + 1})
        import_match = GENERIC_IMPORT_RE.search(line)
        if import_match:
            references.append({"kind": "GENERIC_IMPORT", "target": import_match.group(1), "line": number, "column": import_match.start(1) + 1})
    return symbols, references, [], "PARSED"


def parse_structured(path: str, text: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str, str]:
    ext = extension(path)
    name = pathlib.PurePosixPath(path).name.lower()
    if ext in {".md", ".markdown", ".rst"}:
        return (*parse_markdown(text), "MARKDOWN_SYNTAX")
    if ext == ".json" or name == ".babelrc":
        return (*parse_json_text(text), "JSON_SYNTAX")
    if ext in {".yaml", ".yml"}:
        return (*parse_yaml_text(text), "YAML_SYNTAX")
    if ext == ".sql":
        return (*parse_sql_text(text), "SQL_SYNTAX")
    if ext == ".xml":
        return (*parse_xml_text(text), "XML_SYNTAX")
    if name.startswith(".env") or name == ".env" or ext == ".env":
        return (*parse_env_text(text), "DOTENV_SYNTAX")
    return (*parse_generic_code(text), "TEXT_SYNTAX")


def normalize_repo_path(path: str) -> str:
    value = path.replace("\\", "/")
    while value.startswith("./"):
        value = value[2:]
    parts: list[str] = []
    for part in value.split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if parts:
                parts.pop()
            continue
        parts.append(part)
    return "/".join(parts)


def resolve_js_reference(current: str, target: str, all_paths: set[str]) -> str | None:
    candidate_base: str | None = None
    if target.startswith("@/"):
        candidate_base = target[2:]
    elif target.startswith("."):
        candidate_base = normalize_repo_path(str(pathlib.PurePosixPath(current).parent / target))
    if candidate_base is None:
        return None
    candidates = [
        candidate_base,
        *(candidate_base + suffix for suffix in (".js", ".jsx", ".ts", ".tsx", ".json")),
        *(candidate_base + suffix for suffix in ("/index.js", "/index.jsx", "/index.ts", "/index.tsx")),
    ]
    return next((candidate for candidate in candidates if candidate in all_paths), None)


def python_module_map(paths: Iterable[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for path in paths:
        if extension(path) not in PY_EXTENSIONS:
            continue
        pure = pathlib.PurePosixPath(path)
        parts = list(pure.with_suffix("").parts)
        if parts and parts[-1] == "__init__":
            parts.pop()
        if not parts:
            continue
        module = ".".join(parts)
        out.setdefault(module, path)
        # mashos-api frequently imports ai/services/ai_inference modules as top-level
        if "ai_inference" in parts:
            index = parts.index("ai_inference")
            alias = ".".join(parts[index + 1 :])
            if alias:
                out.setdefault(alias, path)
        if parts[:3] == ["ai", "services", "analysis_engine"]:
            alias = ".".join(parts[2:])
            out.setdefault(alias, path)
    return out


def resolve_python_reference(current: str, module: str, level: int, modules: Mapping[str, str]) -> str | None:
    current_parts = list(pathlib.PurePosixPath(current).with_suffix("").parts)
    if current_parts and current_parts[-1] == "__init__":
        current_parts.pop()
    else:
        current_parts = current_parts[:-1]
    if level:
        keep = max(0, len(current_parts) - level + 1)
        prefix = current_parts[:keep]
        target_parts = prefix + ([part for part in module.split(".") if part] if module else [])
        target = ".".join(target_parts)
    else:
        target = module
    candidates = [target]
    while candidates[-1] and "." in candidates[-1]:
        candidates.append(candidates[-1].rsplit(".", 1)[0])
    return next((modules[item] for item in candidates if item in modules), None)


def resolve_relative_resource(current: str, target: str, all_paths: set[str]) -> str | None:
    clean = target.split("#", 1)[0].split("?", 1)[0]
    if not clean or clean.startswith(("http://", "https://", "mailto:", "#")):
        return None
    base = normalize_repo_path(str(pathlib.PurePosixPath(current).parent / clean)) if not clean.startswith("/") else clean.lstrip("/")
    candidates = [base, base + ".md", base + ".json", base + ".yaml", base + ".yml"]
    return next((candidate for candidate in candidates if candidate in all_paths), None)


def materialize_ts_files(
    rows: Sequence[Mapping[str, Any]],
    readers: Mapping[str, GitBatchReader],
    root: pathlib.Path,
) -> list[dict[str, str]]:
    request: list[dict[str, str]] = []
    for row in rows:
        if target_class(row)[0] != "CODE_TYPESCRIPT":
            continue
        key = str(row["workspace_repository_key"])
        data = exact_blob_bytes(row, readers[key])
        target = root / key / str(row["path"])
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        request.append({"repository_key": key, "path": str(row["path"]), "filesystem_path": str(target)})
    return request


def run_ts_syntax_parser(
    rows: Sequence[Mapping[str, Any]],
    readers: Mapping[str, GitBatchReader],
    work: pathlib.Path,
) -> tuple[dict[tuple[str, str], dict[str, Any]], str]:
    script = pathlib.Path(__file__).with_name("cocolon_context_ts_syntax.cjs")
    if not script.exists():
        raise CodeIndexError(f"TypeScript syntax parser is missing: {script}")
    materialized = work / "typescript-sources"
    request_rows = materialize_ts_files(rows, readers, materialized)
    request_path = work / "typescript-request.json"
    result_path = work / "typescript-result.json"
    write_atomic(request_path, canon({"schema_version": "cocolon.system_context.typescript_request.v1", "files": request_rows}))
    result = run_command(["node", str(script), "--input", str(request_path), "--output", str(result_path)], timeout=900)
    if result.returncode:
        raise CodeIndexError(f"TypeScript syntax parser failed: {result.stderr}")
    root = load_json(result_path)
    if root.get("schema_version") != "cocolon.system_context.typescript_syntax.v1":
        raise CodeIndexError("unsupported TypeScript syntax output schema")
    mapping = {(item["repository_key"], item["path"]): item for item in root.get("files", [])}
    if len(mapping) != len(request_rows):
        raise CodeIndexError("TypeScript syntax parser file denominator mismatch")
    return mapping, str(root.get("typescript_version", "unknown"))


