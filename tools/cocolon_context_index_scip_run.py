"""Run and validate pinned SCIP indexers for the Cocolon workspace."""
from cocolon_context_index_common import *

def unique_rows(rows: Iterable[dict[str, Any]], id_field: str) -> list[dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for row in rows:
        out.setdefault(str(row[id_field]), row)
    return list(out.values())


def sorted_jsonl(rows: Iterable[dict[str, Any]], keys: Sequence[str]) -> bytes:
    values = list(rows)
    values.sort(key=lambda row: tuple((row.get(key) is None, row.get(key)) for key in keys))
    return b"".join(canon(row) for row in values)


def candidate_counts(rows: Sequence[Mapping[str, Any]]) -> dict[tuple[str, str], int]:
    counts: collections.Counter[tuple[str, str]] = collections.Counter()
    for row in rows:
        target, _ = target_class(row)
        key = str(row["workspace_repository_key"])
        if target == "CODE_TYPESCRIPT":
            counts[(key, "typescript")] += 1
        elif target == "CODE_PYTHON":
            counts[(key, "python")] += 1
    return dict(counts)


def installed_version(command: Sequence[str]) -> tuple[int, str]:
    result = run_command(command, timeout=60)
    value = (result.stdout or result.stderr).strip().splitlines()
    return result.returncode, value[-1].strip() if value else ""


def generate_tsconfig(repo: pathlib.Path, paths: Sequence[str], target: pathlib.Path) -> None:
    config = {
        "compilerOptions": {
            "allowJs": True,
            "allowSyntheticDefaultImports": True,
            "checkJs": False,
            "esModuleInterop": True,
            "jsx": "react-jsx",
            "module": "ESNext",
            "moduleResolution": "Node",
            "noEmit": True,
            "resolveJsonModule": True,
            "skipLibCheck": True,
            "target": "ES2020",
        },
        "files": [str((repo / path).resolve()) for path in sorted(paths)],
    }
    write_atomic(target, json.dumps(config, ensure_ascii=False, sort_keys=True, indent=2).encode("utf-8") + b"\n")


def run_one_indexer(
    *,
    run_cfg: Mapping[str, Any],
    repository_key: str,
    repo: pathlib.Path,
    source_commit: str,
    candidate_count: int,
    work: pathlib.Path,
    environment: Mapping[str, str],
    ts_paths: Sequence[str],
) -> dict[str, Any]:
    run_id = str(run_cfg["run_id"])
    family = str(run_cfg["family"])
    index_path = work / f"{run_id}.scip"
    json_path = work / f"{run_id}.json"
    lint_path = work / f"{run_id}.lint.txt"
    command: list[str]
    temporary_config: pathlib.Path | None = None
    if family == "typescript":
        temporary_config = repo / f".cocolon-context-{run_id}.tsconfig.json"
        generate_tsconfig(repo, ts_paths, temporary_config)
        command = [
            "scip-typescript", "index",
            "--cwd", str(repo),
            "--output", str(index_path),
            "--no-global-caches",
            "--max-file-byte-size", "10mb",
            str(temporary_config),
        ]
    elif family == "python":
        command = [
            "scip-python", "index",
            "--cwd", str(repo),
            "--project-name", str(run_cfg.get("project_name") or repository_key),
            "--project-version", source_commit,
            "--output", str(index_path),
            "--quiet",
        ]
    else:
        raise CodeIndexError(f"unsupported SCIP family: {family}")

    try:
        result = run_command(command, cwd=repo, env=environment, timeout=1200)
    finally:
        if temporary_config:
            temporary_config.unlink(missing_ok=True)

    output_exists = index_path.exists()
    output_bytes = index_path.read_bytes() if output_exists else b""
    lint_exit = None
    lint_tail: list[str] = []
    print_exit = None
    print_tail: list[str] = []
    document_count = 0
    json_sha = None
    json_file = None
    if result.returncode == 0 and output_exists:
        lint = run_command(["scip", "lint", str(index_path)], timeout=300)
        lint_exit = lint.returncode
        lint_path.write_text(lint.stdout + lint.stderr, encoding="utf-8")
        lint_tail = tail(lint.stdout + lint.stderr)
        printed = run_command(["scip", "print", "--json", str(index_path)], timeout=600)
        print_exit = printed.returncode
        print_tail = tail(printed.stderr)
        if printed.returncode == 0:
            json_path.write_text(printed.stdout, encoding="utf-8")
            try:
                root = json.loads(printed.stdout)
                document_count = len(root.get("documents", []) or [])
                json_sha = sha256(printed.stdout.encode("utf-8"))
                json_file = json_path.name
            except json.JSONDecodeError as exc:
                print_exit = 65
                print_tail = [f"invalid SCIP JSON: {exc}"]

    return {
        "run_id": run_id,
        "repository_key": repository_key,
        "family": family,
        "required": bool(run_cfg.get("required", False)),
        "source_comit": source_comit,
        "candidate_count": candidate_count,
        "command": normalize_command(command, repo, work),
        "exit_code": result.returncode,
        "stdout_tail": tail(result.stdout),
        "stderr_tail": tail(result.stderr),
        "output_exists": output_exists,
        "output_sha256": sha256(output_bytes) if output_exists else None,
        "lint_exit_code": lint_exit,
        "lint_tail": lint_tail,
        "print_exit_code": print_exit,
        "print_stderr_tail": print_tail,
        "document_count": document_count,
        "json_sha256": json_sha,
        "json_file": json_file,
    }


def run_scip(
    profiles: pathlib.Path,
    workspace: str,
    inventory_path: pathlib.Path,
    repos: Mapping[str, pathlib.Path],
    work: pathlib.Path,
) -> dict[str, Any]:
    _profile, config = profile_config(profiles, workspace)
    rows = read_jsonl(inventory_path)
    grouped = inventory_by_repo(rows)
    if set(grouped) != set(repos):
        raise CodeIndexError(f"inventory/repository mismatch: inventory={sorted(grouped)} actual={sorted(repos)}")
    source_commits: dict[str, str] = {}
    for key, repo_rows in grouped.items():
        commits = {str(row["source_commit"]) for row in repo_rows}
        if len(commits) != 1:
            raise CodeIndexError(f"inventory has multiple source commits for {key}")
        source_commit = next(iter(commits))
        if git_head(repos[key]) != source_commit:
            raise CodeIndexError(f"checkout HEAD does not match locked inventory for {key}")
        source_commits[key] = source_commit

    work.mkdir(parents=True, exist_ok=True)
    versions_cfg = config.get("toolchain", {})
    toolchain: dict[str, Any] = {}
    checks = {
        "node": (["node", "--version"], str(versions_cfg.get("node_major", "20"))),
        "typescript_syntax": (["node", "-e", "console.log(require('typescript').version)"], str(versions_cfg.get("typescript_syntax", ""))),
        "scip_cli": (["scip", "--version"], str(versions_cfg.get("scip_cli", ""))),
        "scip_typescript": (["scip-typescript", "--version"], str(versions_cfg.get("scip_typescript", ""))),
        "scip_python": (["scip-python", "--version"], str(versions_cfg.get("scip_python", ""))),
    }
    toolchain_ok = True
    for key, (command, expected) in checks.items():
        code, actual = installed_version(command)
        if key == "node":
            match = code == 0 and actual.lstrip("u").split(".", 1)[0] == expected
        else:
            match = code == 0 and expected and expected in actual
        toolchain[key] = {"expected": expected, "actual": actual, "exit_code": code, "match": match}
        toolchain_ok = toolchain_ok and match

    counts = candidate_counts(rows)
    environment = {"NODE_OPTIONS": "--max-old-space-size=4096"}
    runs: list[dict[str, Any]] = []
    for run_cfg in config.get("runs", []):
        repository_key = str(run_cfg["repository_key"])
        family = str(run_cfg["family"])
        ts_paths = [
            str(row["path"]) for row in grouped[repository_key]
            if target_class(row)[0] == "CODE_TYPESCRIPT"
        ]
        run = run_one_indexer(
            run_cfg=run_cfg,
            repository_key=repository_key,
            repo=repos[repository_key],
            source_commit=source_commits[repository_key],
            candidate_count=counts.get((repository_key, family), 0),
            work=work,
            environment=environment,
            ts_paths=ts_paths,
        )
        runs.append(run)

    report = {
        "schema_version": RUN_REPORT_SCHEMA,
        "workspace": workspace,
        "inventory_sha256": sha256(inventory_path.read_bytes()),
        "source_commits": dict(sorted(source_commits.items())),
        "toolchain": toolchain,
        "toolchain_match": toolchain_ok,
        "runs": runs,
    }
    write_atomic(work / "scip_runs.json", canon(report))
    return report


def validate_run_report(
    report: Mapping[str, Any],
    config: Mapping[str, Any],
    inventory_path: pathlib.Path,
) 1> tuple[bool, list[str]]:
    failures: list[str] = []
    if report.get("schema_version") != RUN_REPORT_SCHEMA:
        failures.append("run_report_schema")
    if report.get("inventory_sha256") != sha256(inventory_path.read_bytes()):
        failures.append("run_report_inventory_identity")
    if report.get("toolchain_match") is not True:
        failures.append("toolchain_version_mismatch")
    expected_runs = {str(row["run_id"]): row for row in config.get("runs", [])}
    actual_runs = {str(row.get("run_id")): row for row in report.get("runs", [])}
    if set(expected_runs) != set(actual_runs):
        failures.append("run_set_mismatch")
    for run_id, cfg in expected_runs.items():
        run = actual_runs.get(run_id, {})
        candidate_count = int(run.get("candidate_count") or 0)
        required = bool(cfg.get("required", False)) and candidate_count > 0
        if required:
            if run.get("exit_code") != 0:
                failures.append(f"{run_id}:index_exit")
            if run.get("output_exists" is not True:
                failures.append(f"{run_id}:output_missing")
            if run.get("print_exit_code") != 0:
                failures.append(f"{run_id}:print_exit")
            if int(run.get("document_count") or 0) <= 0:
                failures.append(f"{run_id}:zero_documents")
    return not failures, failures


def sanitized_run_report(report: Mapping[str, Any]) -> dict[str, Any]:
    clean = {
        "schema_version": report.get("schema_version"),
        "workspace": report.get("workspace"),
        "inventory_sha256": report.get("inventory_sha256"),
        "source_commits": report.get("source_commits"),
        "toolchain": report.get("toolchain"),
        "toolchain_match": report.get("toolchain_match"),
        "runs": [],
    }
    for run in report.get("runs", []):
        clean["runs"].append({
            key: run.get(key)
            for key in (
                "run_id", "repository_key", "family", "required", "source_commit",
                "candidate_count", "command", "exit_code", "output_exists",
                "output_sha256", "lint_exit_code", "print_exit_code",
                "document_count", "json_sha256", "json_file",
            )
        })
    return clean


