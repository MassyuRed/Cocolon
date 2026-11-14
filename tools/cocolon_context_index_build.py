"""Build and verify the merged SCIP/syntax graph."""
from cocolon_context_index_common import *
from cocolon_context_index_syntax import *
from cocolon_context_index_scip_consume import *
from cocolon_context_index_scip_run import *

def build_index(
    *,
    profiles: pathlib.Path,
    workspace: str,
    inventory_path: pathlib.Path,
    repos: Mapping[str, pathlib.Path],
    scip_work: pathlib.Path,
    output: pathlib.Path,
) -> dict[str, Any]:
    _profile, config = profile_config(profiles, workspace)
    inventory = read_jsonl(inventory_path)
    grouped = inventory_by_repo(inventory)
    if set(grouped) != set(repos):
        raise CodeIndexError("repository set differs from inventory")
    inventory_meta = {(str(row["workspace_repository_key"]), str(row["path"])): row for row in inventory}
    if len(inventory_meta) != len(inventory):
        raise CodeIndexError("duplicate repository+path in inventory")
    inventory_paths = {key: {str(row["path"]) for row in rows} for key, rows in grouped.items()}
    report = load_json(scip_work / "scip_runs.json")
    required_ok, required_failures = validate_run_report(report, config, inventory_path)

    readers = {key: GitBatchReader(repo) for key, repo in repos.items()}
    try:
        with tempfile.TemporaryDirectory(prefix="cocolon-code-index-") as raw:
            ts_map, ts_version = run_ts_syntax_parser(inventory, readers, pathlib.Path(raw))

        scip_docs, scip_symbols, scip_refs, scip_errors, external_scip_occurrences = load_scip_indexes(
            report, scip_work, inventory_paths, inventory_meta
        )
        symbols: list[dict[str, Any]] = list(scip_symbols)
        references: list[dict[str, Any]] = list(scip_refs)
        errors: list[dict[str, Any]] = list(scip_errors)
        coverage: list[dict[str, Any]] = []
        module_maps = {key: python_module_map(paths) for key, paths in inventory_paths.items()}
        syntax_results: dict[tuple[str, str], tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]], str, str]] = {}

        for row in inventory:
            key = str(row["workspace_repository_key"])
            path = str(row["path"])
            target, reason = target_class(row)
            if target == "INVENTORY_ONLY":
                syntax_results[(key, path)] = ([], [], [], "NOT_APPLICABLE", "NONE")
                coverage.append({
                    "schema_version": COVERAGE_SCHEMA,
                    "repository_key": key,
                    "repository": row["repository"],
                    "source_commit": row["source_commit"],
                    "path": path,
                    "language": "none",
                    "target_class": target,
                    "index_mode": "INVENTORY_ONLY_SUPPORTED_REASON",
                    "scip_runs": [],
                    "syntax_parser": "NONE",
                    "syntax_status": "NOT_APPLICABLE",
                    "symbol_count": 0,
                    "reference_count": 0,
                    "parse_error_count": 0,
                    "reason": reason,
                })
                continue

            data = exact_blob_bytes(row, readers[key])
            text = data.decode("utf-8", "replace")
            if target == "CODE_TYPESCRIPT":
                parsed = ts_map.get((key, path))
                if parsed is None:
                    srows, rrows, erows, status, parser_name = [], [], [{"code": "TYPESCRIPT_DENOMINATOR_MISSING", "message": "TypeScript parser omitted this file", "line": 0, "column": 0}], "ERROR", f"typescript-{ts_version}"
                else:
                    srows = list(parsed.get("symbols", []))
                    rrows = list(parsed.get("references", []))
                    erows = list(parsed.get("diagnostics", []))
                    status = str(parsed.get("parser_status", "ERROR"))
                    parser_name = str(parsed.get("parser", f"typescript-{ts_version}"))
            elif target == "CODE_PYTHON":
                srows, rrows, erows, status = parse_python(path, text)
                parser_name = f"python-ast-{sys.version_info.major}.{sys.version_info.minor}"
            elif target == "CODE_GENERIC":
                srows, rrows, erows, status = parse_generic_code(text)
                parser_name = "generic-code-syntax-v1"
            else:
                srows, rrows, erows, status, parser_name = parse_structured(path, text)
            syntax_results[(key, path)] = (srows, rrows, erows, status, parser_name)

        for row in inventory:
            key = str(row["workspace_repository_key"])
            path = str(row["path"])
            target, reason = target_class(row)
            if target == "INVENTORY_ONLY":
                continue
            srows, rrows, erows, status, parser_name = syntax_results[(key, path)]
            has_scip = (key, path) in scip_docs
            local_symbol_count = 0
            local_reference_count = 0

            if not has_scip:
                for item in srows:
                    symbols.append(symbol_row(
                        repository_key=key,
                        repository=str(row["repository"]),
                        source_commit=str(row["source_commit"]),
                        path=path,
                        name=str(item.get("name", "")),
                        kind=str(item.get("kind", "SYNTAX_SYMBOL")),
                        line=item.get("line"),
                        column=item.get("column"),
                        source=f"SYNTAX:{parser_name}",
                    ))
                    local_symbol_count += 1

            for item in rrows:
                target_value = str(item.get("target", ""))
                resolved: str | None = None
                if target == "CODE_TYPESCRIPT":
                    resolved = resolve_js_reference(path, target_value, inventory_paths[key])
                elif target == "CODE_PYTHON":
                    resolved = resolve_python_reference(
                        path,
                        str(item.get("module", "")),
                        int(item.get("level", 0) or 0),
                        module_maps[key],
                    )
                elif target == "STRUCTURED_TEXT":
                    resolved = resolve_relative_resource(path, target_value, inventory_paths[key])
                references.append(reference_row(
                    repository_key=key,
                    repository=str(row["repository"]),
                    source_commit=str(row["source_commit"]),
                    path=path,
                    kind=str(item.get("kind", "SYNTAX_REFERENCE")),
                    target=target_value,
                    line=item.get("line"),
                    column=item.get("column"),
                    source=f"SYNTAX:{parser_name}",
                    resolved_repository_key=key if resolved else None,
                    resolved_path=resolved,
                ))
                local_reference_count += 1

            for item in erows:
                errors.append(error_row(
                    repository_key=key,
                    repository=str(row["repository"]),
                    source_commit=str(row["source_commit"]),
                    path=path,
                    parser=parser_name,
                    code=str(item.get("code", "PARSE_DIAGNOSTIC")),
                    message=str(item.get("message", "parse diagnostic")),
                    line=item.get("line"),
                    column=item.get("column"),
                ))

            if has_scip:
                index_mode = "SCIP_PRECISE_PLUS_SYNTAX"
            elif status == "ERROR":
                index_mode = "PARSE_ERROR_VISIBLE"
            else:
                index_mode = "SYNTAX_ONLY"
            scip_run_ids = sorted(scip_docs.get((key, path), set()))
            coverage.append({
                "schema_version": COVERAGE_SCHEMA,
                "repository_key": key,
                "repository": row["repository"],
                "source_commit": row["source_comit"],
                "path": path,
                "language": language_for(path, target),
                "target_class": target,
                "index_mode": index_mode,
                "scip_runs": scip_run_ids,
                "syntax_parser": parser_name,
                "syntax_status": status,
                "symbol_count": local_symbol_count,
                "reference_count": local_reference_count,
                "parse_error_count": len(erows),
                "reason": reason,
            })
    finally:
        for reader in readers.values():
            reader.close()

    symbols = unique_rows(symbols, "symbol_id")
    references = unique_rows(references, "reference_id")
    errors = unique_rows(errors, "error_id")

    dependencies_map: dict[tuple[str, str, str, str, str], dict[str, Any]] = {}
    for ref in references:
        target_path = ref.get("resolved_path")
        target_key = ref.get("resolved_repository_key")
        if not target_path or not target_key:
            continue
        key_tuple = (str(ref["repository_key"]), str(ref["path"]), str(target_key), str(target_path), str(ref["kind"]))
        if key_tuple not in dependencies_map:
            base = {
                "source_repository_key": ref["repository_key"],
                "source_path": ref["path"],
                "target_repository_key": target_key,
                "target_path": target_path,
                "kind": ref["kind"],
                "source": ref["source"],
            }
            dependencies_map[key_tuple] = {"schema_version": DEPENDENCY_SCHEMA, "dependency_id": stable_id("dep", base), **base}
    dependencies = list(dependencies_map.values())

    coverage_keys = [(row["repository_key"], row["path"]) for row in coverage]
    coverage_gap = len(inventory) - len(coverage)
    duplicate_coverage = len(coverage_keys) - len(set(coverage_keys))
    mode_counts = dict(sorted(collections.Counter(row["index_mode"] for row in coverage).items()))
    target_counts = dict(sorted(collections.Counter(row["target_class"] for row in coverage).items()))
    repository_counts = dict(sorted(collections.Counter(row["repository_key"] for row in coverage).items()))
    scip_precise_count = mode_counts.get("SCIP_PRECISE_PLUS_SYNTAX", 0)
    source_candidates = sum(1 for row in coverage if str(row["target_class"]).startswith("CODE_"))
    parse_error_files = sum(1 for row in coverage if row["index_mode"] == "PARSE_ERROR_VISIBLE")

    complete = (
        required_ok
        and coverage_gap == 0
        and duplicate_coverage == 0
        and len(coverage) == len(inventory)
        and scip_precise_count > 0
    )
    completion_claim = "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED" if complete else "STEP2_PARTIAL_INDEX_STOP"
    sanitized_report = sanitized_run_report(report)
    sanitized_report["validation"] = {"required_runs_ok": required_ok, "failures": required_failures}
    run_report_bytes = canon(sanitized_report)
    coverage_bytes = sorted_jsonl(coverage, ("repository_key", "path"))
    symbols_bytes = sorted_jsonl(symbols, ("repository_key", "path", "line", "column", "source", "name", "symbol_id"))
    references_bytes = sorted_jsonl(references, ("repository_key", "path", "line", "column", "source", "target", "reference_id"))
    dependencies_bytes = sorted_jsonl(dependencies, ("source_repository_key", "source_path", "target_repository_key", "target_path", "kind"))
    errors_bytes = sorted_jsonl(errors, ("repository_key", "path", "line", "column", "parser", "code", "error_id"))

    summary = {
        "schema_version": SUMMARY_SCHEMA,
        "workspace": workspace,
        "inventory_total": len(inventory),
        "coverage_total": len(coverage),
        "coverage_gap_count": coverage_gap,
        "duplicate_coverage_count": duplicate_coverage,
        "by_repository": repository_counts,
        "by_target_class": target_counts,
        "by_index_mode": mode_counts,
        "source_candidate_count": source_candidates,
        "scip_precise_file_count": scip_precise_count,
        "syntax_only_file_count": mode_counts.get("SYNTAX_ONLY", 0),
        "parse_error_visible_file_count": parse_error_files,
        "inventory_only_count": mode_counts.get("INVENTORY_ONLY_SUPPORTED_REASON", 0),
        "symbol_count": len(symbols),
        "reference_count": len(references),
        "file_dependency_count": len(dependencies),
        "parse_error_count": len(errors),
        "external_scip_occurrence_count": external_scip_occurrences,
        "required_scip_runs_ok": required_ok,
        "required_scip_run_failures": required_failures,
        "typescript_syntax_version": ts_version,
        "completion_claim": completion_claim,
        "product_credit": 0,
        "automatic_progression": False,
    }
    summary_bytes = canon(summary)
    outputs = {
        "indexer_runs.json": run_report_bytes,
        "coverage.jsonl": coverage_bytes,
        "symbols.jsonl": symbols_bytes,
        "references.jsonl": references_bytes,
        "file_dependencies.jsonl": dependencies_bytes,
        "parse_errors.jsonl": errors_bytes,
        "code_index_summary.json": summary_bytes,
    }
    manifest = {
        "schema_version": MANIFEST_SCHEMA,
        "workspace": workspace,
        "inventory_sha256": sha256(inventory_path.read_bytes()),
        "inventory_total": len(inventory),
        "coverage_total": len(coverage),
        "coverage_gap_count": coverage_gap,
        "duplicate_coverage_count": duplicate_coverage,
        "output_sha256": {name: sha256(data) for name, data in outputs.items()},
        "completion_claim": completion_claim,
        "product_credit": 0,
        "automatic_progression": False,
    }
    outputs["manifest.json"] = canon(manifest)
    output.mkdir(parents=True, exist_ok=True)
    for name, data in outputs.items():
        write_atomic(output / name, data)
    return summary


def verify_index(inventory_path: pathlib.Path, output: pathlib.Path) -> dict[str, Any]:
    manifest = load_json(output / "manifest.json")
    if manifest.get("schema_version") != MANIFEST_SCHEMA:
        raise CodeIndexError("unsupported code-index manifest schema")
    if manifest.get("inventory_sha256") != sha256(inventory_path.read_bytes()):
        raise CodeIndexError("code-index inventory identity mismatch")
    for name, expected in manifest.get("output_sha256", {}).items():
        actual = sha256((output / name).read_bytes())
        if actual != expected:
            raise CodeIndexError(f"code-index output hash mismatch: {name}")
    coverage = read_jsonl(output / "coverage.jsonl")
    inventory = read_jsonl(inventory_path)
    keys = [(row["repository_key"], row["path"]) for row in coverage]
    if len(coverage) != len(inventory) or len(keys) != len(set(keys)):
        raise CodeIndexError("code-index coverage denominator mismatch")
    summary = load_json(output / "code_index_summary.json")
    if summary.get("coverage_total") != len(coverage) or summary.get("inventory_total") != len(inventory):
        raise CodeIndexError("code-index summary count mismatch")
    if summary.get("completion_claim") != manifest.get("completion_claim"):
        raise CodeIndexError("code-index completion claim mismatch")
    return manifest


