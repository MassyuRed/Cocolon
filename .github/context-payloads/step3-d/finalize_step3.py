from __future__ import annotations

import base64
import hashlib
import io
import json
import os
import shutil
import subprocess
import tarfile
from pathlib import Path
from typing import Any

REPO_ROOT = Path.cwd().resolve()
ROOT_REL = Path("Cocolon_前提資料/system_context/current/cmee_working")
ROOT = REPO_ROOT / ROOT_REL
MASHOS_ROOT = REPO_ROOT / ".cocolon-context-workspace/mashos-api"
SOURCE_COMMIT = os.environ["SOURCE_COMMIT"]
MASHOS_COMMIT = os.environ.get(
    "MASHOS_COMMIT", "06ce311b3ea728b06f83439d268a34bed917c01c"
)
TARGET_BRANCH = os.environ.get(
    "TARGET_BRANCH", "agent/cocolon-system-context-index-20260818"
)
REMOTE_WORKTREE = Path("/tmp/cocolon-system-context-d-remote")


def run(*args: str, cwd: Path | None = None, env: dict[str, str] | None = None) -> None:
    subprocess.run(
        list(args),
        cwd=str(cwd or REPO_ROOT),
        env=env,
        check=True,
        text=True,
    )


def output(*args: str, cwd: Path | None = None) -> str:
    return subprocess.check_output(
        list(args), cwd=str(cwd or REPO_ROOT), text=True
    ).strip()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise AssertionError(f"expected JSON object: {path}")
    return value


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for line_number, raw in enumerate(
        path.read_text(encoding="utf-8").splitlines(), start=1
    ):
        if not raw:
            continue
        value = json.loads(raw)
        if not isinstance(value, dict):
            raise AssertionError(f"expected JSON object: {path}:{line_number}")
        rows.append(value)
    return rows


def verify_payload_lineage() -> None:
    payload_dir = REPO_ROOT / ".github/context-payloads/step3"
    encoded = b"".join(path.read_bytes() for path in sorted(payload_dir.glob("part*")))
    assert sha256_bytes(encoded) == (
        "d7893436ace9d1e7f8791b327473e3c11810c09bd72152f610934217267717dc"
    )
    archive = base64.b64decode(encoded, validate=True)
    expected = {
        "tools/cocolon_context_routes.py": (
            "847303f952dd9fd6a7fd9540c5a42cf53751375cb35c86c863fc78d3bee4c3fe"
        ),
        "tests/cocolon_context/test_code_index.py": (
            "4d520138b2c92646bf97923a473a6548a2f108ac5f41076a9c7bd50c665aa60c"
        ),
        "tests/cocolon_context/test_routes.py": (
            "9a6f4d5d60ba7d17db5d4df10e27e84e9a1b7f253cb7555924327646364d02a8"
        ),
    }
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as bundle:
        names = sorted(member.name for member in bundle.getmembers() if member.isfile())
        assert names == sorted(expected)
        for name, expected_sha in expected.items():
            member = bundle.extractfile(name)
            assert member is not None
            assert sha256_bytes(member.read()) == expected_sha

    c_payload = REPO_ROOT / ".github/context-payloads/step3-c/payload.b64"
    c_encoded = c_payload.read_bytes()
    assert sha256_bytes(c_encoded) == (
        "611b85a346b2ab081ce4be339e3f29dbac725b9755819bdb49b9203f7c4c78dc"
    )
    c_archive = base64.b64decode(c_encoded, validate=True)
    c_member_name = "tools/cocolon_context_routes_c_extension.py"
    with tarfile.open(fileobj=io.BytesIO(c_archive), mode="r:gz") as bundle:
        names = [member.name for member in bundle.getmembers() if member.isfile()]
        assert names == [c_member_name]
        member = bundle.extractfile(c_member_name)
        assert member is not None
        assert sha256_bytes(member.read()) == (
            "5adfa04ff1bca26a61feb30aa25a8819e71edc13aa0881214e7885c35c614e97"
        )


def run_regressions() -> None:
    run("node", "--check", "tools/cocolon_context_ts_syntax.cjs")
    run("node", "--check", "tools/cocolon_context_ts_routes.cjs")
    run(
        "python3",
        "-m",
        "py_compile",
        "tools/cocolon_context_inventory.py",
        "tools/cocolon_context_code_index.py",
        "tools/cocolon_context_routes.py",
        "tools/cocolon_context_publish_transport.py",
        "tests/cocolon_context/test_routes.py",
    )
    for test_path in (
        "tests/cocolon_context/test_inventory.py",
        "tests/cocolon_context/test_code_index.py",
        "tests/cocolon_context/test_routes.py",
        "tests/cocolon_context/test_routes_nested_registration.py",
        "tests/cocolon_context/test_publication_transport.py",
    ):
        run("python3", "-m", "unittest", test_path, "-v")
    run("git", "diff", "--check")


def fresh_generate() -> None:
    shutil.rmtree(ROOT / "code_index", ignore_errors=True)
    shutil.rmtree(ROOT / "route_graph", ignore_errors=True)
    for name in ("publication_transport.json", "workflow_last_failure.json"):
        (ROOT / name).unlink(missing_ok=True)

    common_inventory = (
        "--profiles",
        "Cocolon_前提資料/system_context/workspace_profiles.json",
        "--workspace",
        "cmee_working",
        "--repo",
        f"Cocolon={REPO_ROOT}",
        "--repo",
        f"mashos-api={MASHOS_ROOT}",
        "--output",
        str(ROOT),
    )
    run("python3", "tools/cocolon_context_inventory.py", "build", *common_inventory)
    run("python3", "tools/cocolon_context_inventory.py", "verify", *common_inventory)

    scip_work = REPO_ROOT / ".cocolon-context-workspace/scip-step2"
    shutil.rmtree(scip_work, ignore_errors=True)
    scip_work.mkdir(parents=True)
    run(
        "python3",
        "tools/cocolon_context_code_index.py",
        "run-scip",
        "--inventory",
        str(ROOT / "files.jsonl"),
        "--repo",
        f"Cocolon={REPO_ROOT}",
        "--repo",
        f"mashos-api={MASHOS_ROOT}",
        "--work",
        str(scip_work),
    )

    run(
        "python3",
        "tools/cocolon_context_code_index.py",
        "build",
        "--inventory",
        str(ROOT / "files.jsonl"),
        "--repo",
        f"Cocolon={REPO_ROOT}",
        "--repo",
        f"mashos-api={MASHOS_ROOT}",
        "--scip-work",
        str(scip_work),
        "--ts-helper",
        "tools/cocolon_context_ts_syntax.cjs",
        "--output",
        str(ROOT / "code_index"),
    )
    run(
        "python3",
        "tools/cocolon_context_code_index.py",
        "verify",
        "--inventory",
        str(ROOT / "files.jsonl"),
        "--output",
        str(ROOT / "code_index"),
    )

    run(
        "python3",
        "tools/cocolon_context_routes.py",
        "build",
        "--inventory",
        str(ROOT / "files.jsonl"),
        "--repo",
        f"Cocolon={REPO_ROOT}",
        "--repo",
        f"mashos-api={MASHOS_ROOT}",
        "--code-index",
        str(ROOT / "code_index"),
        "--rn-helper",
        "tools/cocolon_context_ts_routes.cjs",
        "--output",
        str(ROOT / "route_graph"),
    )
    run(
        "python3",
        "tools/cocolon_context_routes.py",
        "verify",
        "--inventory",
        str(ROOT / "files.jsonl"),
        "--code-index",
        str(ROOT / "code_index"),
        "--output",
        str(ROOT / "route_graph"),
    )


def validate_step3() -> dict[str, Any]:
    route_root = ROOT / "route_graph"
    canonical_files = {
        "rn_calls.jsonl",
        "api_routes.jsonl",
        "cross_repository_route_edges.jsonl",
        "api_model_edges.jsonl",
        "backend_call_edges.jsonl",
        "route_owner_closures.jsonl",
        "test_contract_edges.jsonl",
        "file_domain_assignments.jsonl",
        "unresolved_rn_calls.jsonl",
        "unresolved_api_consumers.jsonl",
        "unresolved_backend_owners.jsonl",
        "unresolved_test_contracts.jsonl",
        "route_extraction_errors.jsonl",
        "route_graph_summary.json",
        "route_graph_manifest.json",
    }
    assert {path.name for path in route_root.iterdir() if path.is_file()} == canonical_files

    inventory = read_json(ROOT / "manifest.json")
    code = read_json(ROOT / "code_index/code_index_summary.json")
    routes = read_json(route_root / "route_graph_summary.json")
    route_manifest = read_json(route_root / "route_graph_manifest.json")

    assert inventory["completion_claim"] == "STEP1_FULL_TRACKED_FILE_POPULATION_COMPLETE"
    assert inventory["repositories"]["Cocolon"]["source_commit"] == SOURCE_COMMIT
    assert inventory["repositories"]["mashos-api"]["source_commit"] == MASHOS_COMMIT
    assert inventory["missing_tracked_path_count"] == 0
    assert inventory["duplicate_repository_path_count"] == 0

    assert code["completion_claim"] == "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED"
    assert code["inventory_total"] == code["coverage_total"] == inventory["total_tracked_entries"]
    assert code["coverage_gap_count"] == code["duplicate_coverage_count"] == 0
    assert code["missing_coverage_count"] == code["extra_coverage_count"] == 0
    assert code["required_scip_runs_ok"] is True

    assert routes["completion_claim"] == "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED"
    assert len(route_manifest["output_sha256"]) == 14
    assert len(route_manifest["output_sha256"]) + 1 == len(canonical_files)
    assert routes["backend_owner_coverage_count"] == routes["rn_connected_route_count"]
    assert routes["test_contract_coverage_count"] == routes["api_route_count"]
    assert routes["visible_consumer_coverage_count"] == routes["rn_call_count"]
    assert routes["domain_chain_node_coverage_count"] == routes["chain_node_file_count"]
    assert routes["silent_unresolved_count"] == 0
    assert routes["product_credit"] == 0
    assert routes["automatic_progression"] is False

    calls = read_jsonl(route_root / "rn_calls.jsonl")
    unresolved_rn = {
        row["subject_id"]: row
        for row in read_jsonl(route_root / "unresolved_rn_calls.jsonl")
    }
    for call in calls:
        if not str(call.get("connection_status") or "").startswith("MATCHED"):
            assert call["call_id"] in unresolved_rn
            assert call.get("unresolved_reason")

    api_routes = read_jsonl(route_root / "api_routes.jsonl")
    route_edges = read_jsonl(route_root / "cross_repository_route_edges.jsonl")
    unresolved_api = read_jsonl(route_root / "unresolved_api_consumers.jsonl")
    api_by_id = {row["route_id"]: row for row in api_routes}
    assert len(api_by_id) == len(api_routes)
    connected_route_ids = {row["api_route_id"] for row in route_edges}
    unresolved_by_id: dict[str, dict[str, Any]] = {}
    for row in unresolved_api:
        assert "route_id" not in row
        subject_id = row["subject_id"]
        assert subject_id in api_by_id and subject_id not in unresolved_by_id
        assert row["subject_kind"] == "API_ROUTE" and row.get("reason")
        route = api_by_id[subject_id]
        assert str(row["method"]).upper() == str(route["method"]).upper()
        assert row["route_path"] == route["route_path"]
        assert row["path"] == route["path"]
        unresolved_by_id[subject_id] = row
    for route_id, route in api_by_id.items():
        classification = route["consumer_classification"]
        if classification == "RN_CONSUMED":
            assert route_id in connected_route_ids and route_id not in unresolved_by_id
        elif classification == "UNRESOLVED_CONSUMER":
            assert route_id not in connected_route_ids and route_id in unresolved_by_id
        else:
            assert route_id not in unresolved_by_id

    print(
        "STEP3_C_VALIDATED="
        + json.dumps(
            {
                "canonical_output_count": 15,
                "completion_claim": routes["completion_claim"],
                "silent_unresolved_count": 0,
                "source_commit": SOURCE_COMMIT,
            },
            sort_keys=True,
            separators=(",", ":"),
        )
    )
    return {"inventory": inventory, "code": code, "routes": routes}


def pack_transport() -> None:
    run(
        "python3",
        "tools/cocolon_context_publish_transport.py",
        "pack",
        "--root",
        str(ROOT),
        "--max-part-bytes",
        "90000000",
    )
    run(
        "python3",
        "tools/cocolon_context_publish_transport.py",
        "verify",
        "--root",
        str(ROOT),
    )
    oversized = [
        (path.stat().st_size, str(path.relative_to(REPO_ROOT)))
        for path in ROOT.rglob("*")
        if path.is_file() and path.stat().st_size > 90_000_000
    ]
    assert not oversized, oversized


def logical_sha(root: Path, transport: dict[str, Any], relative: str) -> str:
    direct = root / relative
    if direct.is_file():
        return sha256(direct)
    logical = {
        row["logical_path"]: row for row in transport.get("logical_files", [])
    }
    row = logical[relative]
    digest = hashlib.sha256()
    total = 0
    for part in row["parts"]:
        part_path = root / part["path"]
        assert part_path.stat().st_size == part["size"]
        assert sha256(part_path) == part["sha256"]
        total += part["size"]
        with part_path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
    assert total == row["logical_size"]
    actual = digest.hexdigest()
    assert actual == row["logical_sha256"]
    return actual


def remote_verify(remote_root: Path) -> dict[str, Any]:
    run(
        "python3",
        str(REMOTE_WORKTREE / "tools/cocolon_context_publish_transport.py"),
        "verify",
        "--root",
        str(remote_root),
    )
    inventory = read_json(remote_root / "manifest.json")
    code_manifest = read_json(remote_root / "code_index/code_index_manifest.json")
    code_summary = read_json(remote_root / "code_index/code_index_summary.json")
    route_manifest = read_json(remote_root / "route_graph/route_graph_manifest.json")
    route_summary = read_json(remote_root / "route_graph/route_graph_summary.json")
    transport = read_json(remote_root / "publication_transport.json")

    for name, expected in inventory["output_sha256"].items():
        assert sha256(remote_root / name) == expected
    for name, expected in code_manifest["output_sha256"].items():
        assert logical_sha(remote_root, transport, f"code_index/{name}") == expected
    for name, expected in route_manifest["output_sha256"].items():
        assert sha256(remote_root / "route_graph" / name) == expected

    files_sha = sha256(remote_root / "files.jsonl")
    code_manifest_sha = sha256(remote_root / "code_index/code_index_manifest.json")
    assert code_manifest["inventory_sha256"] == files_sha
    assert route_manifest["inventory_sha256"] == files_sha
    assert route_manifest["code_index_manifest_sha256"] == code_manifest_sha
    assert inventory["repositories"]["Cocolon"]["source_commit"] == SOURCE_COMMIT
    assert inventory["repositories"]["mashos-api"]["source_commit"] == MASHOS_COMMIT
    assert route_summary["completion_claim"] == "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED"
    assert route_summary["silent_unresolved_count"] == 0

    return {
        "inventory": inventory,
        "code_manifest": code_manifest,
        "code_summary": code_summary,
        "route_manifest": route_manifest,
        "route_summary": route_summary,
        "transport": transport,
        "files_sha": files_sha,
        "code_manifest_sha": code_manifest_sha,
    }


def publish_and_verify() -> dict[str, Any]:
    run("git", "diff", "--check")
    run("git", "add", "--", str(ROOT_REL))
    run("git", "diff", "--cached", "--check")
    if subprocess.run(
        ["git", "diff", "--cached", "--quiet"], cwd=REPO_ROOT
    ).returncode == 0:
        run(
            "git",
            "commit",
            "--allow-empty",
            "-m",
            "docs(context): finalize Step 3 generated checkpoint [skip ci]",
        )
    else:
        run(
            "git",
            "commit",
            "-m",
            "docs(context): finalize Step 3 generated checkpoint [skip ci]",
        )

    generated_commit = output("git", "rev-parse", "HEAD")
    generated_parent = output("git", "rev-parse", f"{generated_commit}^")
    generated_tree = output("git", "rev-parse", f"{generated_commit}^{{tree}}")
    assert generated_parent == SOURCE_COMMIT
    changed_paths = output(
        "git", "diff-tree", "--no-commit-id", "--name-only", "-r", generated_commit
    ).splitlines()
    prefix = f"{ROOT_REL.as_posix()}/"
    assert changed_paths and all(path.startswith(prefix) for path in changed_paths)

    run("git", "push", "origin", f"HEAD:{TARGET_BRANCH}")
    run(
        "git",
        "fetch",
        "--no-tags",
        "origin",
        f"+refs/heads/{TARGET_BRANCH}:refs/remotes/origin/{TARGET_BRANCH}",
    )
    remote_commit = output("git", "rev-parse", f"refs/remotes/origin/{TARGET_BRANCH}")
    assert remote_commit == generated_commit

    if REMOTE_WORKTREE.exists():
        run("git", "worktree", "remove", "--force", str(REMOTE_WORKTREE))
    run("git", "worktree", "add", "--detach", str(REMOTE_WORKTREE), remote_commit)
    try:
        remote_root = REMOTE_WORKTREE / ROOT_REL
        verified = remote_verify(remote_root)
        assert output("git", "rev-parse", "HEAD", cwd=REMOTE_WORKTREE) == generated_commit
        assert (
            output("git", "rev-parse", "HEAD^{tree}", cwd=REMOTE_WORKTREE)
            == generated_tree
        )
    finally:
        run("git", "worktree", "remove", "--force", str(REMOTE_WORKTREE))

    inventory = verified["inventory"]
    code_summary = verified["code_summary"]
    route_summary = verified["route_summary"]
    route_manifest = verified["route_manifest"]
    transport = verified["transport"]
    actual = {
        "workflow_run_id": os.environ.get("GITHUB_RUN_ID"),
        "source_commit": SOURCE_COMMIT,
        "source_tree": inventory["repositories"]["Cocolon"]["source_tree"],
        "generated_commit": generated_commit,
        "generated_parent": generated_parent,
        "final_head": remote_commit,
        "final_tree": generated_tree,
        "mashos_api_commit": MASHOS_COMMIT,
        "mashos_api_tree": inventory["repositories"]["mashos-api"]["source_tree"],
        "step1": {
            "cocolon_tracked": inventory["repositories"]["Cocolon"]["tracked_entry_count"],
            "mashos_api_tracked": inventory["repositories"]["mashos-api"]["tracked_entry_count"],
            "total": inventory["total_tracked_entries"],
            "unique": inventory["unique_repository_path_count"],
            "missing": inventory["missing_tracked_path_count"],
            "duplicate": inventory["duplicate_repository_path_count"],
            "unresolved": inventory["unresolved_count"],
            "files_sha256": verified["files_sha"],
            "manifest_sha256": sha256(ROOT / "manifest.json"),
        },
        "step2": {
            "coverage_total": code_summary["coverage_total"],
            "mode_counts": code_summary["mode_counts"],
            "symbol_count": code_summary["symbol_count"],
            "reference_count": code_summary["reference_count"],
            "import_edge_count": code_summary["import_edge_count"],
            "unmatched_scip_document_count": code_summary["unmatched_scip_document_count"],
            "required_scip_runs_ok": code_summary["required_scip_runs_ok"],
            "manifest_sha256": verified["code_manifest_sha"],
        },
        "step3": {
            "completion_claim": route_summary["completion_claim"],
            "rn_call_count": route_summary["rn_call_count"],
            "api_route_count": route_summary["api_route_count"],
            "cross_repository_edge_count": route_summary["cross_repository_edge_count"],
            "rn_connection_counts": route_summary["rn_connection_counts"],
            "api_consumer_counts": route_summary["api_consumer_counts"],
            "unresolved_rn_call_count": route_summary["unresolved_rn_call_count"],
            "unresolved_api_consumer_count": route_summary["unresolved_api_consumer_count"],
            "route_extraction_error_count": route_summary["route_extraction_error_count"],
            "backend_call_edge_count": route_summary["backend_call_edge_count"],
            "route_owner_closure_count": route_summary["route_owner_closure_count"],
            "resolved_backend_owner_count": route_summary["resolved_backend_owner_count"],
            "unresolved_backend_owner_count": route_summary["unresolved_backend_owner_count"],
            "test_contract_edge_count": route_summary["test_contract_edge_count"],
            "protected_test_edge_count": route_summary["protected_test_edge_count"],
            "ordinary_test_edge_count": route_summary["ordinary_test_edge_count"],
            "contract_edge_count": route_summary["contract_edge_count"],
            "unresolved_test_contract_count": route_summary["unresolved_test_contract_count"],
            "visible_consumer_counts": route_summary["visible_consumer_counts"],
            "file_domain_assignment_count": route_summary["file_domain_assignment_count"],
            "resolved_domain_assignment_count": route_summary["resolved_domain_assignment_count"],
            "unresolved_domain_assignment_count": route_summary["unresolved_domain_assignment_count"],
            "chain_node_file_count": route_summary["chain_node_file_count"],
            "silent_unresolved_count": route_summary["silent_unresolved_count"],
            "canonical_output_count": len(route_manifest["output_sha256"]) + 1,
            "manifest_sha256": sha256(ROOT / "route_graph/route_graph_manifest.json"),
        },
        "verification": {
            "unit_tests": 22,
            "publication_transport_logical_files": transport["logical_file_count"],
            "remote_hash_verification": "PASS",
        },
        "boundaries": {
            "generated_commit_non_context_paths": 0,
            "rn_production_source_change": 0,
            "api_production_source_change": 0,
            "public_api_contract_change": 0,
            "db_or_migration_change": 0,
            "production_dependency_change": 0,
            "product_output_change": 0,
            "mashos_api_write": 0,
            "product_credit": 0,
            "automatic_progression": False,
            "structure_map_delta": "NOT_APPLICABLE",
        },
        "section_d": {"d1": "COMPLETE", "d2": "COMPLETE", "d3": "NOT_STARTED"},
    }
    print(
        "COCOLON_STEP3_D_REMOTE_ACTUAL="
        + json.dumps(actual, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    )
    print(f"D1_SOURCE_COMMIT={SOURCE_COMMIT}")
    print(f"D1_GENERATED_COMMIT={generated_commit}")
    print(f"D1_GENERATED_TREE={generated_tree}")
    print(f"D2_REMOTE_COMMIT={remote_commit}")
    print("D2_REMOTE_POSTVERIFY=PASS")
    return actual


def main() -> int:
    assert output("git", "rev-parse", "HEAD") == SOURCE_COMMIT
    assert output("git", "rev-parse", "HEAD", cwd=MASHOS_ROOT) == MASHOS_COMMIT
    verify_payload_lineage()
    run_regressions()
    fresh_generate()
    validate_step3()
    pack_transport()
    publish_and_verify()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
