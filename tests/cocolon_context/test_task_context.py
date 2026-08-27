from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

import pytest

from tools.cocolon_context_task import (
    ContextCompileError,
    _validate_workspace_refs,
    compile_task_context,
    verify_task_context,
)


def canonical(value: object) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        + "\n"
    ).encode()


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n")


def write_jsonl(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(b"".join(canonical(row) for row in rows))


def make_fixture(root: Path) -> dict[str, Path]:
    system = root / "Cocolon_前提資料" / "system_context"
    workspace = system / "current" / "cmee_working"
    code = workspace / "code_index"
    route = workspace / "route_graph"
    c_commit = "c" * 40
    api_commit = "a" * 40
    cycle_c_commit = "d" * 40
    cycle_api_commit = "e" * 40

    paths = [
        ("Cocolon", "Cocolon_前提資料/current_structure/00_three_core_and_cmee_read_first.md", "design"),
        ("Cocolon", "Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md", "design"),
        ("Cocolon", "Cocolon_前提資料/current_structure/02_piece_current_structure.md", "design"),
        ("Cocolon", "Cocolon_前提資料/current_structure/03_analysis_current_structure.md", "design"),
        ("Cocolon", "Cocolon_前提資料/current_structure/04_cmee_current_structure.md", "design"),
        ("Cocolon", "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md", "history"),
        ("mashos-api", "ai/emlis/current_emlis_service.py", "source"),
        ("mashos-api", "ai/cmee/draft_engine.py", "source"),
        ("Cocolon", "lib/piece/piece_generator.dart", "source"),
        ("mashos-api", "ai/analysis/analysis_engine.py", "source"),
        ("mashos-api", "ai/text_generation/shared_surface.py", "source"),
        ("Cocolon", "mobile/screens/EmotionalInputScreen.tsx", "source"),
        ("mashos-api", "api/routes/emlis_endpoint.py", "source"),
        ("mashos-api", "tests/protected/test_cmee_contract.py", "test"),
        ("mashos-api", "opaque/direct_dependency.py", "source"),
        ("mashos-api", "opaque/reverse_consumer.py", "source"),
        ("mashos-api", "opaque/cycle_a.py", "source"),
        ("mashos-api", "opaque/cycle_b.py", "source"),
        ("Cocolon", "archive/CMEE_Predecessor_Design.md", "history"),
    ]
    inventory = []
    identity_by_path = {}
    for index, (repo, path, classification) in enumerate(paths, 1):
        commit = c_commit if repo == "Cocolon" else api_commit
        identity = f"file-{index:03d}"
        identity_by_path[(repo, path)] = identity
        inventory.append(
            {
                "file_identity": identity,
                "repository_key": repo,
                "path": path,
                "source_commit": commit,
                "blob_sha": f"{index:040x}",
                "content_sha256": f"{index:064x}",
                "size_bytes": index * 10,
                "classification": classification,
            }
        )
    write_jsonl(workspace / "files.jsonl", inventory)
    files_sha = sha(workspace / "files.jsonl")
    inventory_manifest = {
        "schema_version": "cocolon.system_context.inventory_manifest.v1",
        "workspace": "cmee_working",
        "repositories": {
            "Cocolon": {"source_commit": c_commit, "source_tree": "1" * 40},
            "mashos-api": {"source_commit": api_commit, "source_tree": "2" * 40},
        },
        "output_sha256": {"files.jsonl": files_sha},
        "product_credit": 0,
        "automatic_progression": False,
    }
    write_json(workspace / "manifest.json", inventory_manifest)

    symbols = [
        {
            "symbol_id": "sym:cmee",
            "repository_key": "mashos-api",
            "path": "ai/cmee/draft_engine.py",
        },
        {
            "symbol_id": "sym:emlis",
            "repository_key": "mashos-api",
            "path": "ai/emlis/current_emlis_service.py",
        },
    ]
    references = [
        {
            "reference_id": "ref-1",
            "repository_key": "mashos-api",
            "source_path": "opaque/reverse_consumer.py",
            "target_symbol": "sym:cmee",
        }
    ]
    imports = [
        {
            "edge_id": "import-direct",
            "repository_key": "mashos-api",
            "source_path": "ai/cmee/draft_engine.py",
            "target_path": "opaque/direct_dependency.py",
        },
        {
            "edge_id": "cycle-a-b",
            "repository_key": "mashos-api",
            "source_path": "opaque/cycle_a.py",
            "target_path": "opaque/cycle_b.py",
        },
        {
            "edge_id": "cycle-b-a",
            "repository_key": "mashos-api",
            "source_path": "opaque/cycle_b.py",
            "target_path": "opaque/cycle_a.py",
        },
        {
            "edge_id": "cmee-cycle",
            "repository_key": "mashos-api",
            "source_path": "ai/cmee/draft_engine.py",
            "target_path": "opaque/cycle_a.py",
        },
    ]
    code_rows = {
        "symbols.jsonl": symbols,
        "references.jsonl": references,
        "import_edges.jsonl": imports,
    }
    code_hashes = {}
    for name, rows in code_rows.items():
        write_jsonl(code / name, rows)
        code_hashes[name] = sha(code / name)
    code_manifest = {
        "schema_version": "cocolon.system_context.code_index_manifest.v3",
        "inventory_sha256": files_sha,
        "output_sha256": code_hashes,
        "product_credit": 0,
        "automatic_progression": False,
    }
    write_json(code / "code_index_manifest.json", code_manifest)
    code_manifest_sha = sha(code / "code_index_manifest.json")

    route_rows = {
        "rn_calls.jsonl": [
            {
                "call_id": "rn-1",
                "source_path": "mobile/screens/EmotionalInputScreen.tsx",
                "target_path": "api/routes/emlis_endpoint.py",
            }
        ],
        "api_routes.jsonl": [
            {
                "route_id": "route-1",
                "source_path": "api/routes/emlis_endpoint.py",
                "target_path": "ai/emlis/current_emlis_service.py",
            }
        ],
        "cross_repository_route_edges.jsonl": [
            {
                "edge_id": "cross-1",
                "source_path": "mobile/screens/EmotionalInputScreen.tsx",
                "target_path": "api/routes/emlis_endpoint.py",
            }
        ],
        "backend_call_edges.jsonl": [
            {
                "edge_id": "backend-1",
                "source_path": "ai/emlis/current_emlis_service.py",
                "target_path": "ai/cmee/draft_engine.py",
            }
        ],
        "route_owner_closures.jsonl": [
            {
                "edge_id": "owner-1",
                "source_path": "ai/cmee/draft_engine.py",
                "target_path": "Cocolon_前提資料/current_structure/04_cmee_current_structure.md",
            },
            {
                "edge_id": "historical-1",
                "source_path": "Cocolon_前提資料/current_structure/04_cmee_current_structure.md",
                "target_path": "archive/CMEE_Predecessor_Design.md",
            },
        ],
        "test_contract_edges.jsonl": [
            {
                "edge_id": "test-1",
                "source_path": "ai/cmee/draft_engine.py",
                "target_path": "tests/protected/test_cmee_contract.py",
            }
        ],
        "api_model_edges.jsonl": [
            {
                "edge_id": "model-1",
                "source_path": "api/routes/emlis_endpoint.py",
                "target_path": "ai/text_generation/shared_surface.py",
            }
        ],
        "file_domain_assignments.jsonl": [
            {
                "repository_key": repo,
                "path": path,
                "domains": ["CMEE"] if "cmee" in path.lower() else [],
            }
            for repo, path, _ in paths
        ],
    }
    route_hashes = {}
    for name, rows in route_rows.items():
        write_jsonl(route / name, rows)
        route_hashes[name] = sha(route / name)
    route_manifest = {
        "schema_version": "cocolon.system_context.route_graph_manifest.v2",
        "inventory_sha256": files_sha,
        "code_index_manifest_sha256": code_manifest_sha,
        "output_sha256": route_hashes,
        "product_credit": 0,
        "automatic_progression": False,
    }
    write_json(route / "route_graph_manifest.json", route_manifest)

    workspace_profiles = {
        "schema_version": "cocolon.system_context.workspace_profiles.v1",
        "profiles": {
            "cmee_working": {
                "repositories": {
                    "Cocolon": {
                        "repository": "MassyuRed/Cocolon",
                        "checkout_ref": "SELF",
                    },
                    "mashos-api": {
                        "repository": "MassyuRed/mashos-api",
                        "checkout_ref": "agent/cmee",
                        "expected_head": api_commit,
                    },
                }
            },
            "cycle001_working": {
                "repositories": {
                    "Cocolon": {
                        "repository": "MassyuRed/Cocolon",
                        "checkout_ref": "agent/cycle001",
                        "expected_head": cycle_c_commit,
                    },
                    "mashos-api": {
                        "repository": "MassyuRed/mashos-api",
                        "checkout_ref": "agent/cycle001-api",
                        "expected_head": cycle_api_commit,
                    },
                }
            },
        },
    }
    write_json(system / "workspace_profiles.json", workspace_profiles)
    fixture_profile = {
        "schema_version": "cocolon.system_context.task_profiles.v1",
        "tasks": {
            "cmee": {
                "purpose": "fixture",
                "required_category_exact": 10,
                "domains": ["CMEE"],
                "seed_rules": [
                    {
                        "id": "all_fixture",
                        "path_globs": [path for _repo, path, _kind in paths],
                        "classification": "MUST_READ_FULL",
                    },
                    {
                        "id": "current_owner",
                        "path_globs": [
                            "Cocolon_前提資料/current_structure/*.md"
                        ],
                        "classification": "CURRENT_OWNER",
                    },
                ],
                "current_owner_rules": [
                    {"path_globs": ["Cocolon_前提資料/current_structure/*.md"]}
                ],
                "historical_rules": [
                    {"path_globs": ["archive/*.md", "*Disposition*.md"]}
                ],
                "required_categories": [
                    {
                        "id": "current_production_emlis_ai",
                        "title": "current production EmlisAI",
                        "path_globs": ["ai/emlis/current_emlis_service.py"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "nlsv3_cycle001",
                        "title": "NLSv3 / Cycle001",
                        "path_globs": [
                            "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md"
                        ],
                        "minimum_source_like": 1,
                        "required_workspace": "cycle001_working",
                        "workspace_gap_code": "NLSV3_CYCLE001_SOURCE_LANE_NOT_INDEXED_IN_CMEE_WORKSPACE",
                        "actual_review": {
                            "finding_id": "CMEE-ACTUAL-001",
                            "title": "body-only visible inverse replay contract",
                            "status": "DESIGN_OWNER_PRESENT_IMPLEMENTATION_ASSET_NOT_MIGRATED",
                            "basis_rules": [
                                {
                                    "path_globs": [
                                        "Cocolon_前提資料/current_structure/04_cmee_current_structure.md",
                                        "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md",
                                    ]
                                }
                            ],
                            "conclusion": "body-only visible inverse replay contract is retained as migration knowledge",
                            "disposition": "RETAIN_AS_SYMBOL_LEVEL_MIGRATION_SOURCE_AND_PROTECTED_TEST_VECTOR",
                            "design_impact": "NONE_CURRENT_DESIGN_ALREADY_OWNS_THE_DUTY",
                            "canonical_owner_paths": [
                                {
                                    "repository_key": "Cocolon",
                                    "path": "Cocolon_前提資料/current_structure/04_cmee_current_structure.md",
                                },
                                {
                                    "repository_key": "Cocolon",
                                    "path": "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md",
                                },
                            ],
                            "required_action": "future symbol-level migration only",
                            "reviewed_workspace_gap_code": "NLSV3_CYCLE001_SOURCE_LANE_EXTERNAL_EXACT_REVIEWED",
                            "external_asset_candidates": [
                                {
                                    "repository_key": "mashos-api",
                                    "required_workspace": "cycle001_working",
                                    "path": "ai/services/ai_inference/emlis_ai_step11_cycle001_product_recovery_v3.py",
                                    "source_commit": cycle_api_commit,
                                    "blob_sha": "b" * 40,
                                    "evidence_kind": "source",
                                    "symbols": ["visible_inverse"],
                                },
                                {
                                    "repository_key": "mashos-api",
                                    "required_workspace": "cycle001_working",
                                    "path": "ai/tests/test_emlis_nls_v3_s11_cycle001_product_recovery_v3.py",
                                    "source_commit": cycle_api_commit,
                                    "blob_sha": "f" * 40,
                                    "evidence_kind": "test",
                                    "symbols": ["_audit_candidate"],
                                },
                            ],
                        },
                    },
                    {
                        "id": "cmee_draft_implementation",
                        "title": "CMEE Draft implementation",
                        "path_globs": ["ai/cmee/draft_engine.py"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "piece_current_future",
                        "title": "Piece current / future",
                        "path_contains_any": ["piece"],
                        "minimum_source_like": 0,
                    },
                    {
                        "id": "analysis_current_future",
                        "title": "Analysis current / future",
                        "path_contains_any": ["analysis"],
                        "minimum_source_like": 0,
                    },
                    {
                        "id": "shared_text_generation_core",
                        "title": "shared text-generation core",
                        "path_contains_any": ["text_generation"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "rn_display_surface",
                        "title": "RN display surface",
                        "path_contains_any": ["mobile/screens"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "api_boundary",
                        "title": "API boundary",
                        "path_contains_any": ["api/routes"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "protected_tests",
                        "title": "protected tests",
                        "path_contains_any": ["tests/protected"],
                        "evidence_kinds": ["test"],
                        "minimum_source_like": 1,
                    },
                    {
                        "id": "relevant_historical_design",
                        "title": "relevant historical design",
                        "path_contains_any": ["archive", "disposition"],
                        "minimum_source_like": 0,
                    },
                ],
            }
        },
    }
    write_json(system / "task_profiles.json", fixture_profile)
    overlay = {
        "schema_version": "cocolon.system_context.manual_overlay.v1",
        "files": [],
        "edges": [],
    }
    write_json(system / "manual_overlay.json", overlay)
    return {
        "root": root,
        "system": system,
        "workspace": workspace,
        "task_profiles": system / "task_profiles.json",
        "overlay": system / "manual_overlay.json",
        "output": workspace / "task_context" / "cmee",
        "identity_by_path": identity_by_path,
    }


def run_compile(paths: dict[str, Path], output: Path | None = None, *, remote_verified: bool = False):
    return compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=paths["overlay"],
        output_dir=output or paths["output"],
        remote_verified=remote_verified,
    )


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text().splitlines() if line]


def test_same_manifests_and_profile_are_byte_exact(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    first = tmp_path / "first"
    second = tmp_path / "second"
    result1 = run_compile(paths, first)
    result2 = run_compile(paths, second)
    assert result1.context_fingerprint == result2.context_fingerprint
    assert sorted(p.name for p in first.iterdir()) == sorted(p.name for p in second.iterdir())
    for item in first.iterdir():
        assert item.read_bytes() == (second / item.name).read_bytes()


@pytest.mark.parametrize(
    "relative",
    [
        "manifest.json",
        "code_index/code_index_manifest.json",
        "route_graph/route_graph_manifest.json",
    ],
)
def test_missing_step_manifest_is_rejected(tmp_path: Path, relative: str) -> None:
    paths = make_fixture(tmp_path / "repo")
    (paths["workspace"] / relative).unlink()
    with pytest.raises(ContextCompileError, match="missing"):
        run_compile(paths)


def test_stale_workspace_ref_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    profile = json.loads((paths["system"] / "workspace_profiles.json").read_text())
    profile["profiles"]["cmee_working"]["repositories"]["mashos-api"]["expected_head"] = "f" * 40
    write_json(paths["system"] / "workspace_profiles.json", profile)
    with pytest.raises(ContextCompileError, match="stale ref"):
        run_compile(paths)


class WorkspaceRefValidationTests(unittest.TestCase):
    def test_expected_ancestor_accepts_checkout_in_arbitrary_directory(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            repo_root = Path(raw) / "step5-incremental-proof"
            repo_root.mkdir()
            subprocess.run(["git", "init", "-q"], cwd=repo_root, check=True)
            subprocess.run(
                ["git", "config", "user.email", "test@example.invalid"],
                cwd=repo_root,
                check=True,
            )
            subprocess.run(
                ["git", "config", "user.name", "test"],
                cwd=repo_root,
                check=True,
            )
            (repo_root / "README.md").write_text("fixture\n", encoding="utf-8")
            subprocess.run(["git", "add", "README.md"], cwd=repo_root, check=True)
            subprocess.run(
                ["git", "commit", "-q", "-m", "fixture"],
                cwd=repo_root,
                check=True,
            )
            source_commit = subprocess.check_output(
                ["git", "rev-parse", "HEAD"], cwd=repo_root, text=True
            ).strip()
            api_commit = "a" * 40
            workspace_profiles = {
                "profiles": {
                    "cmee_working": {
                        "repositories": {
                            "Cocolon": {
                                "repository": "MassyuRed/Cocolon",
                                "expected_ancestor": source_commit,
                            },
                            "mashos-api": {
                                "repository": "MassyuRed/mashos-api",
                                "expected_head": api_commit,
                            },
                        }
                    }
                }
            }
            inventory_manifest = {
                "repositories": {
                    "Cocolon": {"source_commit": source_commit},
                    "mashos-api": {"source_commit": api_commit},
                }
            }

            _validate_workspace_refs(
                "cmee_working", workspace_profiles, inventory_manifest, repo_root
            )


def test_direct_reverse_route_owner_history_and_cycle_are_closed(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    result = run_compile(paths)
    assert result.selected_count == 19
    rows = read_jsonl(paths["output"] / "selected_files.jsonl")
    by_path = {row["path"]: row for row in rows}
    assert "opaque/direct_dependency.py" in by_path
    assert "opaque/reverse_consumer.py" in by_path
    assert "opaque/cycle_a.py" in by_path
    assert "opaque/cycle_b.py" in by_path
    assert by_path["Cocolon_前提資料/current_structure/04_cmee_current_structure.md"]["read_classification"] == "CURRENT_OWNER"
    assert by_path["archive/CMEE_Predecessor_Design.md"]["read_classification"] == "RELEVANT_HISTORICAL"
    edge_types = {row["edge_type"] for row in read_jsonl(paths["output"] / "closure_edges.jsonl")}
    assert {"import", "reference", "rn_call", "api_route", "backend_call", "test_contract"} <= edge_types


def test_exact10_and_external_cycle001_assets_are_reviewed_without_workspace_mixing(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    result = run_compile(paths)
    coverage = json.loads((paths["output"] / "required_category_coverage.json").read_text())
    assert coverage["observed_category_count"] == 10
    assert coverage["all_nonzero"] is True
    assert coverage["all_pass"] is True
    nls = next(row for row in coverage["categories"] if row["category_id"] == "nlsv3_cycle001")
    assert nls["status"] == "PASS"
    assert nls["external_source_like_count"] == 2
    assert nls["review_codes"] == ["EXTERNAL_EXACT_ASSET_REVIEWED_WITH_DISPOSITION"]
    unresolved = read_jsonl(paths["output"] / "unresolved_context.jsonl")
    assert unresolved[0]["code"] == "NLSV3_CYCLE001_SOURCE_LANE_EXTERNAL_EXACT_REVIEWED"
    assert unresolved[0]["blocking"] is False
    assert result.actual_finding_count == 1
    assert result.status == "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    findings = (paths["output"] / "cmee_unincorporated_actual_findings.md").read_text()
    assert "body-only visible inverse replay contract" in findings
    assert "RETAIN_AS_SYMBOL_LEVEL_MIGRATION_SOURCE_AND_PROTECTED_TEST_VECTOR" in findings


def test_every_selected_path_exists_in_inventory(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    run_compile(paths)
    inventory = {
        (row["repository_key"], row["path"])
        for row in read_jsonl(paths["workspace"] / "files.jsonl")
    }
    selected = {
        (row["repository_key"], row["path"])
        for row in read_jsonl(paths["output"] / "selected_files.jsonl")
    }
    assert selected <= inventory


def test_context_fingerprint_tamper_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    run_compile(paths)
    target = paths["output"] / "selected_files.jsonl"
    target.write_bytes(target.read_bytes() + b"{}\n")
    with pytest.raises(ContextCompileError, match="tamper"):
        verify_task_context(paths["output"])


def test_local_run_never_claims_remote_complete(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    run_compile(paths)
    manifest = verify_task_context(paths["output"])
    assert manifest["completion_claim"] is None
    assert manifest["product_credit"] == 0
    assert manifest["automatic_progression"] is False
    assert manifest["completion_gates"]["generated_output_remote_hash_verified"] is False


def test_public_cli_context_command(tmp_path: Path) -> None:
    import os
    import subprocess
    import sys

    paths = make_fixture(tmp_path / "repo")
    output = tmp_path / "cli-output"
    environment = dict(os.environ)
    environment["PYTHONPATH"] = str(Path(__file__).parents[2])
    completed = subprocess.run(
        [
            sys.executable,
            "-m",
            "tools.cocolon_context",
            "context",
            "--workspace",
            "cmee_working",
            "--task",
            "cmee",
            "--repo-root",
            str(paths["root"]),
            "--system-context-root",
            str(paths["system"]),
            "--task-profiles",
            str(paths["task_profiles"]),
            "--manual-overlay",
            str(paths["overlay"]),
            "--output",
            str(output),
        ],
        cwd=Path(__file__).parents[2],
        env=environment,
        text=True,
        capture_output=True,
        check=False,
    )
    assert completed.returncode == 0, completed.stderr
    assert "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION" in completed.stdout
    assert (output / "context_manifest.json").exists()


def _pack_code_index_transport(paths: dict[str, Path]) -> None:
    workspace = paths["workspace"]
    code = workspace / "code_index"
    logical_files = []
    for name in ("symbols.jsonl", "references.jsonl"):
        logical = code / name
        data = logical.read_bytes()
        midpoint = max(1, len(data) // 2)
        # Preserve JSONL row boundaries when splitting.
        split = data.find(b"\n", midpoint) + 1
        if split <= 0 or split >= len(data):
            split = len(data)
        chunks = [data[:split]]
        if split < len(data):
            chunks.append(data[split:])
        part_rows = []
        for index, chunk in enumerate(chunks):
            part = code / f"{name}.part{index:04d}"
            part.write_bytes(chunk)
            part_rows.append(
                {
                    "path": part.relative_to(workspace).as_posix(),
                    "size": len(chunk),
                    "sha256": hashlib.sha256(chunk).hexdigest(),
                }
            )
        logical_files.append(
            {
                "logical_path": f"code_index/{name}",
                "logical_size": len(data),
                "logical_sha256": hashlib.sha256(data).hexdigest(),
                "representation": "ORDERED_BYTE_CONCATENATION",
                "parts": part_rows,
            }
        )
        logical.unlink()
    write_json(
        workspace / "publication_transport.json",
        {
            "schema_version": "cocolon.system_context.publication_transport.v1",
            "logical_file_count": len(logical_files),
            "logical_files": logical_files,
            "product_credit": 0,
            "automatic_progression": False,
        },
    )


def test_publication_transport_logical_symbols_and_references_are_streamed(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _pack_code_index_transport(paths)
    result = run_compile(paths)
    assert result.selected_count == 19
    manifest = verify_task_context(paths["output"])
    assert manifest["input_sha256"]["publication_transport"]


def test_publication_transport_part_tamper_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _pack_code_index_transport(paths)
    part = next((paths["workspace"] / "code_index").glob("references.jsonl.part*"))
    part.write_bytes(part.read_bytes() + b"{}\n")
    with pytest.raises(ContextCompileError, match="publication part"):
        run_compile(paths)


def test_remote_verified_run_closes_step4_without_product_credit(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    result = run_compile(paths, remote_verified=True)
    assert result.status == "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"
    manifest = verify_task_context(paths["output"])
    assert manifest["completion_claim"] == result.status
    assert manifest["completion_gates"]["required_category_exact10_all_pass"] is True
    assert manifest["completion_gates"]["finding_used_for_cmee_review"] is True
    assert manifest["completion_gates"]["generated_output_remote_hash_verified"] is True
    assert manifest["product_credit"] == 0
    assert manifest["automatic_progression"] is False


def test_external_asset_stale_ref_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    profile = json.loads(paths["task_profiles"].read_text())
    review = profile["tasks"]["cmee"]["required_categories"][1]["actual_review"]
    review["external_asset_candidates"][0]["source_commit"] = "9" * 40
    write_json(paths["task_profiles"], profile)
    with pytest.raises(ContextCompileError, match="stale ref"):
        run_compile(paths)


def test_repository_task_profile_has_exact10_and_exact_external_assets() -> None:
    profile_path = (
        Path(__file__).parents[2]
        / "Cocolon_前提資料"
        / "system_context"
        / "task_profiles.json"
    )
    profile = json.loads(profile_path.read_text())
    cmee = profile["tasks"]["cmee"]
    assert cmee["required_category_exact"] == 10
    assert len(cmee["required_categories"]) == 10
    nls = next(row for row in cmee["required_categories"] if row["id"] == "nlsv3_cycle001")
    assets = nls["actual_review"]["external_asset_candidates"]
    assert len(assets) == 2
    assert all(len(row["source_commit"]) == 40 for row in assets)
    assert all(len(row["blob_sha"]) == 40 for row in assets)
    assert nls["actual_review"]["disposition"] == "RETAIN_AS_SYMBOL_LEVEL_MIGRATION_SOURCE_AND_PROTECTED_TEST_VECTOR"
    assert nls["actual_review"]["require_external_asset_git_verification"] is True


def _install_exact_external_cycle_checkout(paths: dict[str, Path]) -> tuple[str, dict[str, str]]:
    checkout = (
        paths["root"]
        / ".cocolon-context-workspace"
        / "cycle001_working"
        / "mashos-api"
    )
    checkout.mkdir(parents=True)
    subprocess = __import__("subprocess")
    subprocess.run(["git", "init", "-q"], cwd=checkout, check=True)
    subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=checkout, check=True)
    subprocess.run(["git", "config", "user.name", "test"], cwd=checkout, check=True)
    contents = {
        "ai/services/ai_inference/emlis_ai_step11_cycle001_product_recovery_v3.py": (
            b"STEP11_CYCLE001_PRODUCT_RECOVERY_SOURCE_SCHEMA = 'x'\n"
            b"class Step11Cycle001ProductRecoverySourceEnvelope: pass\n"
            b"def step11_cycle001_product_recovery_visible_inverse(): pass\n"
            b"_SEMANTIC_COVERAGE_AUTHORITY = 'visible_inverse'\n"
        ),
        "ai/tests/test_emlis_nls_v3_s11_cycle001_product_recovery_v3.py": (
            b"def _audit_candidate(): pass\n"
        ),
    }
    for relative, data in contents.items():
        target = checkout / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    subprocess.run(["git", "add", "."], cwd=checkout, check=True)
    subprocess.run(["git", "commit", "-q", "-m", "fixture"], cwd=checkout, check=True)
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=checkout, text=True).strip()
    blobs = {
        relative: subprocess.check_output(
            ["git", "rev-parse", f"HEAD:{relative}"], cwd=checkout, text=True
        ).strip()
        for relative in contents
    }
    profiles = json.loads((paths["system"] / "workspace_profiles.json").read_text())
    profiles["profiles"]["cycle001_working"]["repositories"]["mashos-api"]["expected_head"] = commit
    write_json(paths["system"] / "workspace_profiles.json", profiles)
    task_profiles = json.loads(paths["task_profiles"].read_text())
    review = task_profiles["tasks"]["cmee"]["required_categories"][1]["actual_review"]
    review["require_external_asset_git_verification"] = True
    for asset in review["external_asset_candidates"]:
        asset["source_commit"] = commit
        asset["blob_sha"] = blobs[asset["path"]]
    write_json(paths["task_profiles"], task_profiles)
    return commit, blobs


def test_strict_external_assets_verify_commit_blob_content_and_symbols(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _install_exact_external_cycle_checkout(paths)
    result = run_compile(paths, remote_verified=True)
    assert result.status == "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"
    coverage = json.loads((paths["output"] / "required_category_coverage.json").read_text())
    nls = next(row for row in coverage["categories"] if row["category_id"] == "nlsv3_cycle001")
    assert {
        row["validation_status"] for row in nls["external_exact_assets"]
    } == {"GIT_COMMIT_BLOB_CONTENT_SYMBOL_VERIFIED"}


def test_strict_external_asset_blob_mismatch_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _install_exact_external_cycle_checkout(paths)
    profile = json.loads(paths["task_profiles"].read_text())
    review = profile["tasks"]["cmee"]["required_categories"][1]["actual_review"]
    review["external_asset_candidates"][0]["blob_sha"] = "0" * 40
    write_json(paths["task_profiles"], profile)
    with pytest.raises(ContextCompileError, match="blob mismatch"):
        run_compile(paths)
