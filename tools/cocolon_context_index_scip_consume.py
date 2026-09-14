"""Consume normalized SCIP JSON for the Cocolon system-context index."""
from cocolon_context_index_common import *
from cocolon_context_index_syntax import normalize_repo_path

def scip_range(value: Any) -> tuple[int | None, int | None]:
    if not isinstance(value, list) or len(value) < 3:
        return None, None
    try:
        return int(value[0]) + 1, int(value[1]) + 1
    except (TypeError, ValueError):
        return None, None


def scip_display_name(symbol: str, info: Mapping[str, Any] | None) -> str:
    if info:
        display = info.get("displayName") or info.get("display_name")
        if isinstance(display, str) and display:
            return display
    tail_value = symbol.rstrip("./#)")
    for separator in ("/", " "):
        if separator in tail_value:
            tail_value = tail_value.rsplit(separator, 1)[-1]
    return tail_value or symbol


def load_scip_indexes(
    report: Mapping[str, Any],
    work: pathlib.Path,
    inventory_paths: Mapping[str, set[str]],
    inventory_meta: Mapping[tuple[str, str], Mapping[str, Any]],
) -> tuple[
    dict[tuple[str, str], set[str]],
    list[dict[str, Any]],
    list[dict[str, Any]],
    list[dict[str, Any]],
    int,
]:
    documents_by_file: dict[tuple[str, str], set[str]] = collections.defaultdict(set)
    definitions_raw: list[dict[str, Any]] = []
    references_raw: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    external_occurrences = 0
    info_by_symbol: dict[str, Mapping[str, Any]] = {}

    for run in report.get("runs", []):
        if run.get("exit_code") != 0 or run.get("print_exit_code") != 0:
            continue
        relative = run.get("json_file")
        if not isinstance(relative, str):
            continue
        json_path = work / relative
        try:
            root = load_json(json_path)
        except CodeIndexError as exc:
            key = str(run.get("repository_key"))
            meta = next((value for (repo_key, _), value in inventory_meta.items() if repo_key == key), None)
            if meta:
                errors.append(error_row(
                    repository_key=key,
                    repository=str(meta["repository"]),
                    source_commit=str(meta["source_commit"]),
                    path="<scip-index>",
                    parser=str(run.get("run_id")),
                    code="SCIP_JSON_READ_ERROR",
                    message=str(exc),
                ))
            continue
        key = str(run["repository_key"])
        run_id = str(run["run_id"])
        for info in root.get("externalSymbols", root.get("external_symbols", [])) or []:
            if isinstance(info, dict) and isinstance(info.get("symbol"), str):
                info_by_symbol[info["symbol"]] = info
        for document in root.get("documents", []) or []:
            if not isinstance(document, dict):
                continue
            raw_path = document.get("relativePath") or document.get("relative_path")
            if not isinstance(raw_path, str):
                continue
            path = normalize_repo_path(raw_path)
            if path not in inventory_paths.get(key, set()):
                meta = next((value for (repo_key, _), value in inventory_meta.items() if repo_key == key), None)
                if meta:
                    errors.append(error_row(
                        repository_key=key,
                        repository=str(meta["repository"]),
                        source_commit=str(meta["source_commit"]),
                        path=path or "<unknown>",
                        parser=run_id,
                        code="SCIP_DOCUMENT_OUTSIDE_INVENTORY",
                        message=f"SCIP document is not in the locked inventory: {raw_path}",
                    ))
                continue
            documents_by_file[(key, path)].add(run_id)
            for info in document.get("symbols", []) or []:
                if isinstance(info, dict) and isinstance(info.get("symbol"), str):
                    info_by_symbol[info["symbol"]] = info
            for occurrence in document.get("occurrences", []) or []:
                if not isinstance(occurrence, dict):
                    continue
                symbol = occurrence.get("symbol")
                if not isinstance(symbol, str) or not symbol:
                    continue
                roles = occurrence.get("symbolRoles", occurrence.get("symbol_roles", 0))
                try:
                    roles_i = int(roles or 0)
                except (TypeError, ValueError):
                    roles_i = 0
                line, column = scip_range(occurrence.get("range"))
                item = {
                    "repository_key": key,
                    "path": path,
                    "run_id": run_id,
                    "symbol": symbol,
                    "roles": roles_i,
                    "line": line,
                    "column": column,
                }
                if roles_i & SCIP_DEFINITION_ROLE:
                    definitions_raw.append(item)
                else:
                    references_raw.append(item)

    definition_locations: dict[str, list[tuple[str, str]]] = collections.defaultdict(list)
    for item in definitions_raw:
        location = (item["repository_key"], item["path"])
        if location not in definition_locations[item["symbol"]]:
            definition_locations[item["symbol"]].append(location)

    symbols: list[dict[str, Any]] = []
    references: list[dict[str, Any]] = []
    for item in definitions_raw:
        meta = inventory_meta[(item["repository_key"], item["path"])]
        info = info_by_symbol.get(item["symbol"])
        kind = "SCIP_DEFINITION"
        if info:
            raw_kind = info.get("kind")
            if raw_kind is not None:
                kind = f"SCIP_KIND_{raw_kind}"
        symbols.append(symbol_row(
            repository_key=item["repository_key"],
            repository=str(meta["repository"]),
            source_commit=str(meta["source_commit"]),
            path=item["path"],
            name=scip_display_name(item["symbol"], info),
            kind=kind,
            line=item["line"],
            column=item["column"],
            source=f"SCIP:{item['run_id']}",
            scip_symbol=item["symbol"],
        ))

    for item in references_raw:
        locations = definition_locations.get(item["symbol"], [])
        if not locations:
            external_occurrences += 1
            continue
        meta = inventory_meta[(item["repository_key"], item["path"])]
        for target_key, target_path in locations:
            references.append(reference_row(
                repository_key=item["repository_key"],
                repository=str(meta["repository"]),
                source_commit=str(meta["source_commit"]),
                path=item["path"],
                kind="SCIP_REFERENCE",
                target=item["symbol"],
                line=item["line"],
                column=item["column"],
                source=f"SCIP:{item['run_id']}",
                resolved_repository_key=target_key,
                resolved_path=target_path,
                scip_symbol=item["symbol"],
            ))
    return documents_by_file, symbols, references, errors, external_occurrences


