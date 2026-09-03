from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

import pytest

from tools.cocolon_context_prepare import _classify_owner_relation
from tools.cocolon_context_task import (
    ContextCompileError,
    FileRecord,
    _build_account_profile_actual_proof,
    _expected_owner_namespace,
    _operator_model_fingerprint,
    _render_collaboration_packets,
    _render_pro_context,
    _render_ultra_context,
    _task_profile,
    _validate_account_profile_actual_proof,
    _validate_workspace_refs,
    build_premise_management_model,
    build_work_context_model,
    canonical_owner_bundle_fingerprint,
    compile_task_context,
    extract_restricted_metadata,
    parse_restricted_json_pointer_assertions,
    parse_restricted_front_matter,
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


def resign_unit_a_manifest(output: Path, manifest: dict) -> None:
    model = manifest["unit_a_premise_management"]
    identity_model = dict(model)
    for count_key in (
        "required_premise_count",
        "required_premise_resolved_count",
        "responsibility_count",
        "conflict_count",
    ):
        identity_model.pop(count_key)
    model_sha = hashlib.sha256(canonical(identity_model)).hexdigest()
    manifest["input_sha256"]["unit_a_model"] = model_sha
    selected_rows = read_jsonl(output / "selected_files.jsonl")
    inputs = manifest["input_sha256"]
    payload = {
        "workspace": manifest["workspace"],
        "task": manifest["task"],
        "step1_manifest_sha256": inputs["step1_manifest"],
        "step1_files_sha256": inputs["step1_files"],
        "step2_manifest_sha256": inputs["step2_manifest"],
        "step3_manifest_sha256": inputs["step3_manifest"],
        "publication_transport_sha256": inputs.get("publication_transport"),
        "workspace_profiles_sha256": inputs["workspace_profiles"],
        "task_profile_sha256": inputs["task_profile"],
        "manual_overlay_sha256": inputs["manual_overlay"],
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(manifest["output_sha256"].items())),
        "owner_bundle_fingerprint": inputs["owner_bundle"],
        "unit_a_model_sha256": model_sha,
        "workspace_exact_refs": manifest["workspace_exact_refs"],
        "unit_a_completion_gates": manifest["completion_gates"],
    }
    manifest["context_fingerprint"] = hashlib.sha256(canonical(payload)).hexdigest()


def resign_unit_b_artifacts(output: Path, model: dict, manifest: dict) -> None:
    model["operator_model_fingerprint"] = _operator_model_fingerprint(model)
    operator_path = output / "operator_context.json"
    write_json(operator_path, model)
    operator_sha = sha(operator_path)
    (output / "pro_context.md").write_bytes(
        _render_pro_context(model, operator_sha)
    )
    (output / "ultra_context.md").write_bytes(
        _render_ultra_context(model, operator_sha)
    )
    inputs = manifest["input_sha256"]
    summary = manifest["unit_b_work_context"]
    inputs["operator_model"] = model["operator_model_fingerprint"]
    inputs["operator_context"] = operator_sha
    summary["operator_context_sha256"] = operator_sha
    summary["projection_source_sha256"] = operator_sha
    summary["operator_model_fingerprint"] = model["operator_model_fingerprint"]
    summary["projection_model_fingerprint"] = model["operator_model_fingerprint"]
    for name in ("operator_context.json", "pro_context.md", "ultra_context.md"):
        manifest["output_sha256"][name] = sha(output / name)
    summary["pro_context_sha256"] = manifest["output_sha256"]["pro_context.md"]
    summary["ultra_context_sha256"] = manifest["output_sha256"]["ultra_context.md"]
    selected_rows = read_jsonl(output / "selected_files.jsonl")
    payload = {
        "workspace": manifest["workspace"],
        "task": manifest["task"],
        "step1_manifest_sha256": inputs["step1_manifest"],
        "step1_files_sha256": inputs["step1_files"],
        "step2_manifest_sha256": inputs["step2_manifest"],
        "step3_manifest_sha256": inputs["step3_manifest"],
        "publication_transport_sha256": inputs.get("publication_transport"),
        "workspace_profiles_sha256": inputs["workspace_profiles"],
        "task_profile_sha256": inputs["task_profile"],
        "manual_overlay_sha256": inputs["manual_overlay"],
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(manifest["output_sha256"].items())),
        "owner_bundle_fingerprint": inputs["owner_bundle"],
        "unit_a_model_sha256": inputs["unit_a_model"],
        "workspace_exact_refs": manifest["workspace_exact_refs"],
        "unit_a_completion_gates": manifest["completion_gates"],
        "operator_model_fingerprint": model["operator_model_fingerprint"],
        "operator_context_sha256": operator_sha,
        "unit_b_work_context": summary,
    }
    manifest["context_fingerprint"] = hashlib.sha256(canonical(payload)).hexdigest()
    write_json(output / "context_manifest.json", manifest)


def make_unit_a_v2_profile(paths: dict[str, Path]) -> tuple[dict, dict]:
    document = json.loads(paths["task_profiles"].read_text())
    profile = document["tasks"]["cmee"]
    profile["publication_mode"] = "PERSISTENT_PRIMARY"
    profile["task_orientation"] = profile.pop("purpose")
    owner_id = "OWNER.CMEE.TEST"
    premise_path = "Cocolon_前提資料/current_structure/04_cmee_current_structure.md"
    premise_target = paths["root"] / premise_path
    premise_target.parent.mkdir(parents=True, exist_ok=True)
    premise_target.write_text(
        "---\ndocument_id: DOC.CMEE.TEST\n"
        "normative_status: CURRENT\n"
        "design_authority: true\n"
        "automatic_progression: false\n---\nfixture\n",
        encoding="utf-8",
    )
    subprocess.run(["git", "init", "-q"], cwd=paths["root"], check=True)
    subprocess.run(
        ["git", "config", "user.email", "test@example.invalid"],
        cwd=paths["root"],
        check=True,
    )
    subprocess.run(
        ["git", "config", "user.name", "test"], cwd=paths["root"], check=True
    )
    subprocess.run(["git", "add", "."], cwd=paths["root"], check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "unit-a fixture"],
        cwd=paths["root"],
        check=True,
    )
    owner_head = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=paths["root"], text=True
    ).strip()
    owner_blob = subprocess.check_output(
        ["git", "rev-parse", f"HEAD:{premise_path}"],
        cwd=paths["root"],
        text=True,
    ).strip()
    owner_tree = subprocess.check_output(
        ["git", "rev-parse", "HEAD^{tree}"], cwd=paths["root"], text=True
    ).strip()
    files_path = paths["workspace"] / "files.jsonl"
    inventory_rows = read_jsonl(files_path)
    for row in inventory_rows:
        if row["repository_key"] == "Cocolon":
            row["source_commit"] = owner_head
        if row["repository_key"] == "Cocolon" and row["path"] == premise_path:
            row["blob_sha"] = owner_blob
            row["content_sha256"] = hashlib.sha256(
                premise_target.read_bytes()
            ).hexdigest()
            row["size_bytes"] = premise_target.stat().st_size
    write_jsonl(files_path, inventory_rows)
    inventory_sha = sha(files_path)
    inventory_manifest_path = paths["workspace"] / "manifest.json"
    inventory_manifest = json.loads(inventory_manifest_path.read_text())
    inventory_manifest["repositories"]["Cocolon"] = {
        "source_commit": owner_head,
        "source_tree": owner_tree,
    }
    inventory_manifest["output_sha256"]["files.jsonl"] = inventory_sha
    write_json(inventory_manifest_path, inventory_manifest)
    code_manifest_path = paths["workspace"] / "code_index" / "code_index_manifest.json"
    code_manifest = json.loads(code_manifest_path.read_text())
    code_manifest["inventory_sha256"] = inventory_sha
    write_json(code_manifest_path, code_manifest)
    route_manifest_path = paths["workspace"] / "route_graph" / "route_graph_manifest.json"
    route_manifest = json.loads(route_manifest_path.read_text())
    route_manifest["inventory_sha256"] = inventory_sha
    route_manifest["code_index_manifest_sha256"] = sha(code_manifest_path)
    write_json(route_manifest_path, route_manifest)
    namespace = (
        "refs/cocolon-context/owners/"
        f"cmee-{hashlib.sha256(b'cmee').hexdigest()[:12]}/"
        "OWNER.CMEE.TEST-"
        f"{hashlib.sha256(owner_id.encode('utf-8')).hexdigest()[:16]}"
    )
    subprocess.run(
        ["git", "update-ref", namespace, owner_head],
        cwd=paths["root"],
        check=True,
    )
    premise_ids = [f"PREMISE.CMEE.TEST.{index:02d}" for index in range(1, 8)]
    responsibility_ids = [
        f"RESP.CMEE.TEST.{index:02d}" for index in range(1, 22)
    ]
    profile["operator_contract"] = {
        "canonical_owner_refs": [
            {
                "owner_id": owner_id,
                "responsibility": "FIXTURE_READ_ONLY_OWNER",
                "repository_key": "Cocolon",
                "remote_ref": "refs/heads/fixture-owner",
                "public_pr_number_or_locator": "PR FIXTURE",
                "required": True,
                "freshness_policy": "READ_ONLY_EXACT_REF",
                "claim_boundary": "READ_ONLY_NO_WRITE_AUTHORITY",
                "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
                "source_locator": {
                    "locator_id": "LOC.OWNER.CMEE.TEST",
                    "privacy": "PUBLIC",
                    "repository_key": "Cocolon",
                    "path": "Cocolon_前提資料/system_context/Cocolon_SystemContext_Step6_FinalTechnicalBody_20260821.md",
                },
            }
        ],
        "required_premises": [
            {
                "premise_id": premise_id,
                "responsibility": responsibility_ids[index - 1],
                "repository_key": "Cocolon",
                "path": premise_path,
                "owner_id": owner_id,
                "required": True,
                "entry_chain_order": index,
                "read_tier": "MUST_READ_FULL",
                "expected_identity_policy": "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
                "expected_identity_locator_id": None,
                "required_roles": ["PRO_KAREN", "ULTRA_KAREN"],
                "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
                "source_locator": {
                    "locator_id": f"LOC.PREMISE.CMEE.TEST.{index:02d}",
                    "privacy": "PUBLIC",
                    "repository_key": "Cocolon",
                    "path": "Cocolon_前提資料/current_structure/00_three_core_and_cmee_read_first.md",
                },
            }
            for index, premise_id in enumerate(premise_ids, 1)
        ],
        "document_responsibilities": [
            {
                "responsibility_id": responsibility_id,
                "subject_locator": {
                    "repository_key": "Cocolon",
                    "owner_id": owner_id,
                    "path": premise_path,
                },
                "responsibility_kind": "CURRENT_STRUCTURE_OWNER",
                "lifecycle": "CURRENT" if index == 1 else "HISTORICAL",
                "publication_state": (
                    "FIXTURE_CURRENT" if index == 1 else "FIXTURE_HISTORICAL"
                ),
                "authority_kind": (
                    "NORMATIVE_AUTHORITY" if index == 1 else "NO_AUTHORITY_CLAIM"
                ),
                "effective_condition": "FIXTURE_ONLY",
                "supersedes": [],
                "superseded_by": [],
                "metadata_assertions": [],
                "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
                "source_locator": {
                    "locator_id": f"LOC.RESP.CMEE.TEST.{index:02d}",
                    "privacy": "PUBLIC",
                    "repository_key": "Cocolon",
                    "path": premise_path,
                },
            }
            for index, responsibility_id in enumerate(responsibility_ids, 1)
        ],
    }
    document["schema_version"] = "cocolon.system_context.task_profiles.v2"
    document["persistent_primary_task"] = "cmee"
    write_json(paths["task_profiles"], document)
    bundle = {
        "schema_version": "cocolon.system_context.canonical_owner_bundle.v1",
        "workspace": "cmee_working",
        "task": "cmee",
        "phase": "PRE_PUBLISH_FINALIZED",
        "owners": [
            {
                "owner_id": owner_id,
                "repository_key": "Cocolon",
                "repository": "MassyuRed/Cocolon",
                "canonical_url": "https://github.com/MassyuRed/Cocolon.git",
                "ref": "refs/heads/fixture-owner",
                "required": True,
                "access_mode": "READ_ONLY_EXACT_REF",
                "workspace_material_commit": owner_head,
                "namespace": namespace,
                "first_resolved_head": owner_head,
                "fetched_namespace_head": owner_head,
                "pre_publish_resolved_head": owner_head,
                "relation": "SAME_REF",
                "merge_base": owner_head,
                "owner_side_unique_commit_count": 0,
                "workspace_side_unique_commit_count": 0,
                "owner_side_changes": [],
                "workspace_side_changes": [],
                "owner_side_changed_paths": [],
                "workspace_side_changed_paths": [],
                "workspace_incorporation_claim": False,
                "write_authority": False,
                "merge_required": False,
                "rebase_required": False,
                "integration_required": False,
            }
        ],
        "premises": [
            {
                "premise_id": premise_id,
                "owner_id": owner_id,
                "repository_key": "Cocolon",
                "path": premise_path,
                "required": True,
                "entry_chain_order": index,
                "expected_identity_policy": "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
                "resolved_commit": owner_head,
                "resolved_blob_sha": owner_blob,
                "status": "RESOLVED",
                "reason_code": "PREMISE_EXACT_OWNER_BLOB_RESOLVED",
                "fresh": True,
                "selected": True,
                "metadata": extract_restricted_metadata(premise_target.read_bytes()),
            }
            for index, premise_id in enumerate(premise_ids, 1)
        ],
        "responsibility_subjects": [
            {
                "responsibility_id": responsibility_id,
                "owner_id": owner_id,
                "repository_key": "Cocolon",
                "path": premise_path,
                "resolved_commit": owner_head,
                "resolved_blob_sha": owner_blob,
                "status": "RESOLVED",
                "reason_code": "RESPONSIBILITY_SUBJECT_EXACT_OWNER_BLOB_RESOLVED",
                "fresh": True,
                "metadata": extract_restricted_metadata(premise_target.read_bytes()),
            }
            for responsibility_id in responsibility_ids
        ],
        "blocking_codes": [],
        "workspace_incorporation_claim": False,
        "write_authority": False,
        "integration_required": False,
        "automatic_progression": False,
    }
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(bundle)
    return document, bundle


def make_unit_b_v2_profile(paths: dict[str, Path]) -> tuple[dict, dict]:
    document, bundle = make_unit_a_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    owner_ref = "refs/heads/fixture-owner"
    owner_path = "Cocolon_前提資料/current_structure/04_cmee_current_structure.md"

    def locator(locator_id: str, repository_key: str, path: str, *, durable: bool = False):
        value = {
            "locator_id": locator_id,
            "privacy": "PUBLIC",
            "repository_key": repository_key,
            "path": path,
        }
        if durable:
            value["remote_ref"] = owner_ref
        return value

    claim_specs = [
        (
            "CLAIM.CMEE.TEST.PRODUCT_PURPOSE",
            "PRODUCT_PURPOSE",
            "FIXTURE_PRODUCT_PURPOSE",
            "Mash",
            "MANUAL_PROFILE_ASSERTION",
            "ACCEPTED_CURRENT",
        ),
        (
            "CLAIM.CMEE.TEST.MASH_FIXED_CONDITION",
            "MASH_FIXED_CONDITION",
            "FIXTURE_BOUNDED_IMPLEMENTATION_ONLY",
            "Mash",
            "MASH_EXPLICIT_DECISION",
            "ACCEPTED_CURRENT",
        ),
        (
            "CLAIM.CMEE.TEST.PRODUCT_ROUTE",
            "PRODUCT_ROUTE",
            "FIXTURE_PRODUCT_ROUTE",
            "Karen",
            "KAREN_PROPOSAL_NOT_MASH_DECISION",
            "KAREN_PROPOSAL_NOT_MASH_DECISION",
        ),
        (
            "CLAIM.CMEE.TEST.CURRENT_PRODUCT_OWNER",
            "CURRENT_PRODUCT_OWNER",
            "FIXTURE_CURRENT_PRODUCT_OWNER",
            "Karen",
            "MANUAL_PROFILE_ASSERTION",
            "DESIGN_REFLECTED_NOT_IMPLEMENTED",
        ),
        (
            "CLAIM.CMEE.TEST.ZERO_EFFECT_BOUNDARY",
            "ZERO_EFFECT_BOUNDARY",
            "FIXTURE_ZERO_EFFECT_BOUNDARY",
            "Mash",
            "MASH_EXPLICIT_DECISION",
            "ACCEPTED_CURRENT",
        ),
    ]
    contract["claim_nodes"] = [
        {
            "claim_id": claim_id,
            "claim_kind": claim_kind,
            "asserted_value_code": value_code,
            "asserted_by": asserted_by,
            "decision_owner": "Mash",
            "assertion_provenance": provenance,
            "source_locator": locator(
                f"LOC.{claim_id}", "Cocolon", owner_path, durable=claim_kind in {
                    "MASH_FIXED_CONDITION",
                    "ZERO_EFFECT_BOUNDARY",
                }
            ),
            "adoption_state": adoption,
            "claim_boundary": "FIXTURE_SOURCE_BOUND_NO_SEMANTIC_INFERENCE",
            "verification_status": "DECLARED_SOURCE_LOCATOR",
            "verified_scope": [
                "DURABLE_PUBLIC_DECISION_LOCATOR"
                if claim_kind in {"MASH_FIXED_CONDITION", "ZERO_EFFECT_BOUNDARY"}
                else "PUBLIC_SOURCE_LOCATOR"
            ],
        }
        for claim_id, claim_kind, value_code, asserted_by, provenance, adoption in claim_specs
    ]
    connection_specs = [
        (
            "CONNECTION.CMEE.TEST.DESIGN",
            "REFLECTED_BY_DESIGN",
            "Cocolon",
            owner_path,
        ),
        (
            "CONNECTION.CMEE.TEST.ACTUAL",
            "IMPLEMENTED_BY_ACTUAL",
            "mashos-api",
            "ai/cmee/draft_engine.py",
        ),
        (
            "CONNECTION.CMEE.TEST.CONTRACT",
            "COVERED_BY_TEST_OR_CONTRACT",
            "mashos-api",
            "tests/protected/test_cmee_contract.py",
        ),
        (
            "CONNECTION.CMEE.TEST.ROUTE",
            "EXPOSED_BY_ROUTE",
            "mashos-api",
            "api/routes/emlis_endpoint.py",
        ),
    ]
    contract["connections"] = [
        {
            "connection_id": connection_id,
            "source_claim_id": "CLAIM.CMEE.TEST.PRODUCT_ROUTE",
            "relation_kind": relation,
            "target_locator": locator(
                f"LOC.{connection_id}", repository_key, path
            ),
            "target_symbol_or_route": None,
            "required": True,
            "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
            "endpoint_verification": "UNRESOLVED_RELATION",
            "verified_scope": ["PROFILE_DECLARATION"],
        }
        for connection_id, relation, repository_key, path in connection_specs
    ]
    contract["scope_rules"] = [
        {
            "scope_rule_id": "SCOPE.CMEE.TEST.CONTRACT",
            "target_locator": locator(
                "LOC.SCOPE.CMEE.TEST.CONTRACT.TARGET",
                "mashos-api",
                "tests/protected/test_cmee_contract.py",
            ),
            "target_symbol_or_route": None,
            "changeability": "PROTECTED_REVIEW_REQUIRED",
            "required_approval": "PROTECTED_TEST_REVIEW_REQUIRED",
            "write_target": False,
            "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
            "source_locator": locator(
                "LOC.SCOPE.CMEE.TEST.CONTRACT.SOURCE", "Cocolon", owner_path
            ),
        },
        {
            "scope_rule_id": "SCOPE.CMEE.TEST.ACTUAL",
            "target_locator": locator(
                "LOC.SCOPE.CMEE.TEST.ACTUAL.TARGET",
                "mashos-api",
                "ai/cmee/draft_engine.py",
            ),
            "target_symbol_or_route": None,
            "changeability": "RELATED_NOT_WRITE_AUTHORIZED",
            "required_approval": "SEPARATE_EXPLICIT_AUTHORIZATION_REQUIRED",
            "write_target": False,
            "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
            "source_locator": locator(
                "LOC.SCOPE.CMEE.TEST.ACTUAL.SOURCE", "Cocolon", owner_path
            ),
        },
    ]
    contract["role_views"] = {
        "PRO_KAREN": {
            "max_items": 24,
            "max_referenced_source_bytes": 1572864,
            "max_reasons_per_item": 8,
            "max_projection_utf8_bytes": 98304,
            "first_view": {
                "card_order": [
                    "TASK_ORIENTATION_AND_PRODUCT_CONNECTION",
                    "FRESHNESS_AND_BLOCKER",
                    "MASH_FIXED_CONDITIONS",
                    "CURRENT_PRODUCT_OWNER_AND_ROUTE",
                    "ORIGINALS_TO_READ_NOW",
                    "PRODUCT_ROUTE_FINDINGS_AND_CLAIM_BOUNDARY",
                    "UNRESOLVED_AND_HANDBACK",
                    "EFFECTS_STOP_AND_AUTOMATIC_PROGRESSION",
                ],
                "max_decision_items": 12,
                "max_reasons_per_item": 2,
                "max_utf8_bytes": 16384,
                "max_locators_per_card": 3,
            },
        },
        "ULTRA_KAREN": {
            "max_items": 80,
            "max_referenced_source_bytes": 4194304,
            "max_reasons_per_item": 12,
            "max_projection_utf8_bytes": 196608,
        },
    }
    write_json(paths["task_profiles"], document)
    return document, bundle


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


def test_v1_projection_keeps_legacy_manifest_and_selected_row_shape(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    run_compile(paths)
    manifest = verify_task_context(paths["output"])
    assert "unit_a_premise_management" not in manifest
    assert "owner_bundle" not in manifest["input_sha256"]
    assert "unit_a_model" not in manifest["input_sha256"]
    assert "operator_v1_activation_approved" not in manifest["completion_gates"]
    legacy_keys = {
        "identity",
        "repository_key",
        "path",
        "source_commit",
        "blob_sha",
        "content_sha256",
        "size_bytes",
        "inventory_classification",
        "evidence_kind",
        "read_classification",
        "graph_distance",
        "selection_reasons",
    }
    assert all(set(row) == legacy_keys for row in read_jsonl(paths["output"] / "selected_files.jsonl"))


def test_v2_direct_compile_requires_prepare_bundle_without_mutating_output(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    make_unit_a_v2_profile(paths)
    output = tmp_path / "sentinel-output"
    output.mkdir()
    sentinel = output / "sentinel.txt"
    sentinel.write_text("last-good\n", encoding="utf-8")
    with pytest.raises(
        ContextCompileError, match="CANONICAL_OWNER_BUNDLE_REQUIRED_USE_PREPARE"
    ):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=output,
        )
    assert sentinel.read_text(encoding="utf-8") == "last-good\n"
    assert sorted(item.name for item in output.iterdir()) == ["sentinel.txt"]


def test_v2_prepared_compile_accepts_revalidated_read_only_owner_model(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "v2-output"
    result = compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output)
    unit_a = manifest["unit_a_premise_management"]
    assert unit_a["status"] == "UNIT_A_PREMISE_MODEL_READY"
    assert [row["relation"] for row in unit_a["owners"]] == ["SAME_REF"]
    assert [row["workspace_material_commit"] for row in unit_a["owners"]] == [
        bundle["owners"][0]["workspace_material_commit"]
    ]
    assert unit_a["required_premise_count"] == 7
    assert unit_a["required_premise_resolved_count"] == 7
    assert unit_a["responsibility_count"] == 21
    assert unit_a["workspace_incorporation_claim"] is False
    assert unit_a["write_authority"] is False
    assert unit_a["integration_required"] is False
    assert unit_a["completion_claim"] is None
    assert unit_a["v1_activation"] == 0
    assert manifest["completion_claim"] is None
    assert result.status == "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    selected = read_jsonl(output / "selected_files.jsonl")
    premise_row = next(
        row for row in selected
        if row["path"] == "Cocolon_前提資料/current_structure/04_cmee_current_structure.md"
    )
    assert premise_row["classification_provenance"] == "LEGACY_PATH_RULE"
    assert premise_row["authority_claim"] is False
    assert len(premise_row["responsibility_ids"]) == 21
    assert premise_row["selection_tier"] in {"DECISION_SURFACE", "UNRESOLVED_IMPACT"}
    assert "NO_WRITE_AUTHORITY" in premise_row["non_proof_boundaries"]


def _compile_unit_b_fixture(tmp_path: Path) -> tuple[dict[str, Path], dict, Path]:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_b_v2_profile(paths)
    output = tmp_path / "unit-b-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    return paths, bundle, output


def make_diverged_unit_b_bundle(paths: dict[str, Path], bundle: dict) -> dict:
    root = paths["root"]
    owner = bundle["owners"][0]
    merge_base = owner["workspace_material_commit"]
    subprocess.run(
        ["git", "commit", "-q", "--allow-empty", "-m", "owner side"],
        cwd=root,
        check=True,
    )
    owner_head = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=root, text=True
    ).strip()
    subprocess.run(
        ["git", "update-ref", owner["namespace"], owner_head],
        cwd=root,
        check=True,
    )
    subprocess.run(
        ["git", "checkout", "-q", "--detach", merge_base],
        cwd=root,
        check=True,
    )
    subprocess.run(
        ["git", "commit", "-q", "--allow-empty", "-m", "workspace side"],
        cwd=root,
        check=True,
    )
    workspace_head = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=root, text=True
    ).strip()
    workspace_tree = subprocess.check_output(
        ["git", "rev-parse", "HEAD^{tree}"], cwd=root, text=True
    ).strip()
    owner.update(
        first_resolved_head=owner_head,
        fetched_namespace_head=owner_head,
        pre_publish_resolved_head=owner_head,
        workspace_material_commit=workspace_head,
        relation="DIVERGED",
        merge_base=merge_base,
        owner_side_unique_commit_count=1,
        workspace_side_unique_commit_count=1,
        owner_side_changes=[],
        workspace_side_changes=[],
        owner_side_changed_paths=[],
        workspace_side_changed_paths=[],
    )
    for row in bundle["premises"]:
        row["resolved_commit"] = owner_head
    for row in bundle["responsibility_subjects"]:
        row["resolved_commit"] = owner_head

    files_path = paths["workspace"] / "files.jsonl"
    inventory_rows = read_jsonl(files_path)
    for row in inventory_rows:
        if row["repository_key"] == "Cocolon":
            row["source_commit"] = workspace_head
    write_jsonl(files_path, inventory_rows)
    inventory_sha = sha(files_path)
    inventory_manifest_path = paths["workspace"] / "manifest.json"
    inventory_manifest = json.loads(inventory_manifest_path.read_text())
    inventory_manifest["repositories"]["Cocolon"] = {
        "source_commit": workspace_head,
        "source_tree": workspace_tree,
    }
    inventory_manifest["output_sha256"]["files.jsonl"] = inventory_sha
    write_json(inventory_manifest_path, inventory_manifest)
    code_manifest_path = (
        paths["workspace"] / "code_index" / "code_index_manifest.json"
    )
    code_manifest = json.loads(code_manifest_path.read_text())
    code_manifest["inventory_sha256"] = inventory_sha
    write_json(code_manifest_path, code_manifest)
    route_manifest_path = (
        paths["workspace"] / "route_graph" / "route_graph_manifest.json"
    )
    route_manifest = json.loads(route_manifest_path.read_text())
    route_manifest["inventory_sha256"] = inventory_sha
    route_manifest["code_index_manifest_sha256"] = sha(code_manifest_path)
    write_json(route_manifest_path, route_manifest)
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(
        bundle
    )
    return bundle


def test_unit_b_emits_exact10_from_one_shared_model(tmp_path: Path) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    manifest = verify_task_context(output, expected_unit_b=True)
    assert set(manifest["output_sha256"]) == {
        "selected_files.jsonl",
        "closure_edges.jsonl",
        "required_category_coverage.json",
        "unresolved_context.jsonl",
        "full_text_read_order.md",
        "cmee_context_overview.md",
        "cmee_unincorporated_actual_findings.md",
        "operator_context.json",
        "pro_context.md",
        "ultra_context.md",
    }
    summary = manifest["unit_b_work_context"]
    assert summary["logical_output_count"] == 10
    assert summary["status"] == "UNIT_B_WORK_CONTEXT_READY"
    assert summary["operator_context_sha256"] == summary["projection_source_sha256"]
    assert summary["operator_model_fingerprint"] == summary[
        "projection_model_fingerprint"
    ]
    model = json.loads((output / "operator_context.json").read_text())
    assert model["operator_v1"]["status"] == "V1_OPERATOR_CONTEXT_READY"
    cards = model["decision_surface"]["pro_first_view_cards"]
    assert [row["card_id"] for row in cards] == [
        "TASK_ORIENTATION_AND_PRODUCT_CONNECTION",
        "FRESHNESS_AND_BLOCKER",
        "MASH_FIXED_CONDITIONS",
        "CURRENT_PRODUCT_OWNER_AND_ROUTE",
        "ORIGINALS_TO_READ_NOW",
        "PRODUCT_ROUTE_FINDINGS_AND_CLAIM_BOUNDARY",
        "UNRESOLVED_AND_HANDBACK",
        "EFFECTS_STOP_AND_AUTOMATIC_PROGRESSION",
    ]
    purpose_claim = next(
        row for row in model["claims"] if row["claim_kind"] == "PRODUCT_PURPOSE"
    )
    assert cards[0]["item_ids"] == [purpose_claim["claim_id"]]
    assert cards[1]["item_ids"]
    assert "SAME_REF" in cards[1]["reason_codes"]
    assert model["budgets"]["PRO_KAREN"][
        "first_view_observed_decision_items"
    ] <= 12
    assert {
        row["endpoint_verification"]
        for row in model["design_actual_test_connections"]
    } == {"ALL_ENDPOINTS_VERIFIED"}
    assert {row["verification_status"] for row in model["claims"]} == {
        "DECLARED_SOURCE_LOCATOR",
        "SOURCE_LOCATOR_VERIFIED",
    }
    assert sum(
        row["verification_status"] == "DECLARED_SOURCE_LOCATOR"
        for row in model["claims"]
    ) == 2
    route_claim = next(
        row for row in model["claims"] if row["claim_kind"] == "PRODUCT_ROUTE"
    )
    assert route_claim["assertion_provenance"] == (
        "KAREN_PROPOSAL_NOT_MASH_DECISION"
    )
    assert "WORKSPACE_INVENTORY_BLOB_IDENTITY" in route_claim["verified_scope"]
    assert all(row["semantic_claim"] is False for row in model["design_actual_test_connections"])
    assert all(row["product_quality_credit"] == 0 for row in model["design_actual_test_connections"])
    assert not (output / "collaboration_packets.json").exists()
    assert model["completion_claim"] is None
    assert model["v1_activation"] == 0
    assert model["product_credit"] == model["technical_credit"] == 0
    assert model["automatic_progression"] is False
    assert model["unit_c_started"] is False
    pro_text = (output / "pro_context.md").read_text()
    ultra_text = (output / "ultra_context.md").read_text()
    assert "relation `SAME_REF`" in pro_text
    assert "## Exact refs" in ultra_text
    assert "## Required entry chain" in ultra_text
    assert "## Conflict, provenance, and minimal readback" in ultra_text


def test_unit_b_same_input_rerenders_byte_exact(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_b_v2_profile(paths)
    first = tmp_path / "first"
    second = tmp_path / "second"
    for output in (first, second):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=output,
            canonical_owner_bundle=bundle,
        )
    assert sorted(row.name for row in first.iterdir()) == sorted(
        row.name for row in second.iterdir()
    )
    for row in first.iterdir():
        assert row.read_bytes() == (second / row.name).read_bytes()


def test_unit_b_pro_first_view_required_overflow_blocks_explicitly(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    claims = document["tasks"]["cmee"]["operator_contract"]["claim_nodes"]
    extra = json.loads(
        json.dumps(
            next(
                row
                for row in claims
                if row["claim_kind"] == "MASH_FIXED_CONDITION"
            )
        )
    )
    extra["claim_id"] = "CLAIM.CMEE.TEST.MASH_FIXED_CONDITION.EXTRA"
    extra["source_locator"]["locator_id"] = (
        "LOC.CLAIM.CMEE.TEST.MASH_FIXED_CONDITION.EXTRA"
    )
    claims.append(extra)
    write_json(paths["task_profiles"], document)
    output = tmp_path / "pro-overflow"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    pro_budget = model["budgets"]["PRO_KAREN"]
    assert pro_budget["first_view_observed_decision_items"] > 12
    assert "BUDGET_EXCEEDED_REQUIRED_SURFACE" in pro_budget["overflow_codes"]
    assert model["operator_v1"]["status"] == "V1_OPERATOR_CONTEXT_BLOCKED"
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )
    assert "BUDGET_EXCEEDED_REQUIRED_SURFACE" in (
        output / "pro_context.md"
    ).read_text()


def test_unit_b_pro_expanded_byte_overflow_stays_valid_blocked_context(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    for index, claim in enumerate(contract["claim_nodes"]):
        claim["source_locator"]["path"] = (
            f"long-claim-{index}/" + "a" * 980 + ".md"
        )
    for index, connection in enumerate(contract["connections"]):
        connection["target_locator"]["path"] = (
            f"long-connection-{index}/" + "b" * 975 + ".py"
        )
    write_json(paths["task_profiles"], document)
    output = tmp_path / "pro-byte-overflow"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    operator_sha = manifest["unit_b_work_context"]["operator_context_sha256"]
    expanded = _render_pro_context(
        model,
        operator_sha,
        collapse_overflow=False,
    )
    collapsed = (output / "pro_context.md").read_bytes()
    assert len(expanded) > model["budgets"]["PRO_KAREN"]["first_view"][
        "max_utf8_bytes"
    ]
    assert len(collapsed) <= model["budgets"]["PRO_KAREN"]["first_view"][
        "max_utf8_bytes"
    ]
    assert "BUDGET_EXCEEDED_REQUIRED_SURFACE" in model["budgets"][
        "PRO_KAREN"
    ]["overflow_codes"]
    assert model["operator_v1"]["status"] == "V1_OPERATOR_CONTEXT_BLOCKED"
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )


def test_unit_b_missing_claim_source_is_unresolved_and_blocked(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    claim = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["claim_nodes"]
        if row["claim_kind"] == "PRODUCT_PURPOSE"
    )
    claim["source_locator"]["path"] = "missing/product-purpose.md"
    write_json(paths["task_profiles"], document)
    output = tmp_path / "missing-claim"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    projected = next(row for row in model["claims"] if row["claim_id"] == claim["claim_id"])
    assert projected["verification_status"] == "UNRESOLVED"
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )
    assert any(
        row["reason_code"] == "REQUIRED_CLAIM_SOURCE_UNRESOLVED"
        and row["blocking"] is True
        for row in model["unresolved_by_owner"]
    )


def test_unit_b_owner_ref_claim_uses_owner_identity_not_workspace_blob(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    claim = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["claim_nodes"]
        if row["claim_kind"] == "PRODUCT_ROUTE"
    )
    claim["source_locator"]["owner_id"] = "OWNER.CMEE.TEST"
    claim["source_locator"]["remote_ref"] = "refs/heads/fixture-owner"
    write_json(paths["task_profiles"], document)
    output = tmp_path / "owner-ref-claim"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    projected = next(row for row in model["claims"] if row["claim_id"] == claim["claim_id"])
    assert projected["verification_status"] == "SOURCE_LOCATOR_VERIFIED"
    assert "OWNER_REF_BLOB_IDENTITY" in projected["verified_scope"]
    assert "OWNER_REF_FILE_IDENTITY" in projected["verified_scope"]
    assert "WORKSPACE_INVENTORY_BLOB_IDENTITY" not in projected["verified_scope"]


@pytest.mark.parametrize(
    "remote_ref",
    [
        "refs/heads/fixture-owner",
        "refs/heads/nonexistent-durable-decision",
    ],
)
def test_unit_b_ownerless_durable_ref_stays_declarative_even_for_selected_blob(
    tmp_path: Path, remote_ref: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    claim = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["claim_nodes"]
        if row["claim_kind"] == "MASH_FIXED_CONDITION"
    )
    assert ("Cocolon", claim["source_locator"]["path"]) in paths["identity_by_path"]
    assert "owner_id" not in claim["source_locator"]
    claim["source_locator"]["remote_ref"] = remote_ref
    write_json(paths["task_profiles"], document)
    output = tmp_path / "ownerless-durable-claim"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    projected = next(
        row for row in model["claims"] if row["claim_id"] == claim["claim_id"]
    )
    assert projected["verification_status"] == "DECLARED_SOURCE_LOCATOR"
    assert "DURABLE_PUBLIC_DECISION_LOCATOR" in projected["verified_scope"]
    assert not {
        "WORKSPACE_INVENTORY_BLOB_IDENTITY",
        "WORKSPACE_INVENTORY_FILE_IDENTITY",
        "OWNER_REF_BLOB_IDENTITY",
        "OWNER_REF_FILE_IDENTITY",
    }.intersection(projected["verified_scope"])
    assert manifest["unit_b_work_context"]["status"] == "UNIT_B_WORK_CONTEXT_READY"


def test_unit_b_connection_with_unknown_owner_does_not_use_workspace_blob(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    connection = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["connections"]
        if row["relation_kind"] == "IMPLEMENTED_BY_ACTUAL"
    )
    connection["target_locator"].update(
        {
            "owner_id": "OWNER.UNKNOWN.TEST",
            "remote_ref": "refs/heads/fixture-owner",
        }
    )
    write_json(paths["task_profiles"], document)
    output = tmp_path / "unknown-connection-owner"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    projected = next(
        row
        for row in model["design_actual_test_connections"]
        if row["connection_id"] == connection["connection_id"]
    )
    assert projected["endpoint_verification"] != "ALL_ENDPOINTS_VERIFIED"
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )


def test_unit_b_named_endpoint_cannot_be_promoted_by_unbound_symbol_map_or_resign(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    connection = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["connections"]
        if row["relation_kind"] == "IMPLEMENTED_BY_ACTUAL"
    )
    named_endpoint = "sym:fixture.unproven.named.endpoint"
    connection["target_symbol_or_route"] = named_endpoint
    write_json(paths["task_profiles"], document)
    output = tmp_path / "unproven-named-endpoint"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    projected = next(
        row
        for row in model["design_actual_test_connections"]
        if row["connection_id"] == connection["connection_id"]
    )
    assert projected["target_identity"] is not None
    assert projected["endpoint_verification"] == "UNRESOLVED_RELATION"
    assert projected["reason_code"] == "TARGET_SYMBOL_OR_ROUTE_UNRESOLVED"
    assert "TARGET_SYMBOL_OR_ROUTE_IDENTITY" not in projected["verified_scope"]
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )

    selected = read_jsonl(output / "selected_files.jsonl")
    records = {
        row["identity"]: FileRecord(
            identity=row["identity"],
            repository_key=row["repository_key"],
            path=row["path"],
            source_commit=row["source_commit"],
            blob_sha=row["blob_sha"],
            content_sha256=row["content_sha256"],
            size_bytes=row["size_bytes"],
            inventory_classification=row["inventory_classification"],
            raw=row,
        )
        for row in selected
    }
    rebuilt = build_work_context_model(
        workspace="cmee_working",
        task="cmee",
        legacy_status=manifest["status"],
        task_profile=document["tasks"]["cmee"],
        premise_model=manifest["unit_a_premise_management"],
        by_identity=records,
        by_key={row.key: row for row in records.values()},
        selected_rows=selected,
        used_edges=read_jsonl(output / "closure_edges.jsonl"),
        unresolved=read_jsonl(output / "unresolved_context.jsonl"),
        task_dependency_fingerprint=bundle["task_dependency_fingerprint"],
        workspace_refs=manifest["workspace_exact_refs"],
        symbol_owner={named_endpoint: projected["target_identity"]},
        route_owner={},
    )
    rebuilt_connection = next(
        row
        for row in rebuilt["design_actual_test_connections"]
        if row["connection_id"] == connection["connection_id"]
    )
    assert rebuilt_connection["endpoint_verification"] == "UNRESOLVED_RELATION"
    assert rebuilt_connection["reason_code"] == (
        "TARGET_SYMBOL_OR_ROUTE_UNRESOLVED"
    )

    projected["endpoint_verification"] = "ALL_ENDPOINTS_VERIFIED"
    projected["reason_code"] = "DECLARED_ENDPOINT_IDENTITIES_PRESENT"
    projected["verified_scope"] = sorted(
        set(projected["verified_scope"]) | {"TARGET_SYMBOL_OR_ROUTE_IDENTITY"}
    )
    verification_scope = next(
        row
        for row in model["verification_scopes"]
        if row["source_id"] == connection["connection_id"]
    )
    verification_scope["verified_scope"] = list(projected["verified_scope"])
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="endpoint reason derivation"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_manual_review_impact_is_valid_blocked_context(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    source = contract["scope_rules"][0]["source_locator"]
    contract["scope_rules"].append(
        {
            "scope_rule_id": "SCOPE.CMEE.TEST.MANUAL_REVIEW",
            "target_locator": {
                "locator_id": "LOC.SCOPE.CMEE.TEST.MANUAL_REVIEW.TARGET",
                "privacy": "PUBLIC",
                "repository_key": "mashos-api",
                "path": "private/external-gap.py",
            },
            "target_symbol_or_route": None,
            "changeability": "PROTECTED_REVIEW_REQUIRED",
            "required_approval": "MASH_MANUAL_REVIEW_REQUIRED",
            "write_target": False,
            "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
            "source_locator": {
                **source,
                "locator_id": "LOC.SCOPE.CMEE.TEST.MANUAL_REVIEW.SOURCE",
            },
        }
    )
    write_json(paths["task_profiles"], document)
    output = tmp_path / "manual-review"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    assert any(row["impact_class"] == "MANUAL_REVIEW" for row in model["impact"])
    assert model["completion_gates"]["manual_review_absent"] is False
    assert manifest["unit_b_work_context"]["status"] == (
        "UNIT_B_WORK_CONTEXT_BLOCKED"
    )


def test_unit_b_missing_required_test_blocks_with_exact_handback(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    connection = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["connections"]
        if row["relation_kind"] == "COVERED_BY_TEST_OR_CONTRACT"
    )
    connection["target_locator"]["path"] = "tests/protected/missing_contract.py"
    write_json(paths["task_profiles"], document)
    output = tmp_path / "missing-test-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    missing = next(
        row
        for row in model["design_actual_test_connections"]
        if row["connection_id"] == connection["connection_id"]
    )
    assert missing["endpoint_verification"] == "MISSING_ENDPOINT"
    assert missing["reason_code"] == "TARGET_FILE_IDENTITY_MISSING"
    assert manifest["unit_b_work_context"]["status"] == "UNIT_B_WORK_CONTEXT_BLOCKED"
    assert model["operator_v1"]["status"] == "V1_OPERATOR_CONTEXT_BLOCKED"
    assert any(
        row["drift_code"] == "DECLARED_TEST_CONTRACT_OWNER_ROUTE_MISMATCH"
        and row["required_owner_handback"] == "MASH"
        for row in model["drift"]
    )


def test_unit_b_connected_target_without_explicit_scope_defaults_related_only(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    route = next(
        row
        for row in model["design_actual_test_connections"]
        if row["relation_kind"] == "EXPOSED_BY_ROUTE"
    )
    scope = next(
        row
        for row in model["scope_rules"]
        if row["target_locator"]["path"] == route["target_locator"]["path"]
    )
    assert scope["changeability"] == "RELATED_NOT_WRITE_AUTHORIZED"
    assert scope["write_target"] is False
    assert scope["permission_claim"] is False


def test_unit_b_unchanged_is_only_an_exact_blob_file_fact(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    contract["connections"] = []
    contract["scope_rules"] = []
    write_json(paths["task_profiles"], document)
    output = tmp_path / "unchanged-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    unchanged = [row for row in model["impact"] if row["impact_class"] == "UNCHANGED"]
    assert unchanged
    assert {row["reason_code"] for row in unchanged} == {
        "EXACT_COMPARED_BLOB_IDENTITY_SAME_FILE_FACT_ONLY"
    }
    assert "NO_IMPACT" not in json.dumps(model, sort_keys=True)


def test_unit_b_projection_or_model_tamper_is_rejected(tmp_path: Path) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    pro = output / "pro_context.md"
    pro.write_bytes(pro.read_bytes() + b"forged-new-fact\n")
    with pytest.raises(ContextCompileError, match="tamper"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_recomputed_nested_permission_injection_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    model["scope_rules"][0]["implementation_permission"] = "GRANTED"
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="scope row keys mismatch"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_extra_write_candidate_scope_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    source_scope = next(
        row
        for row in model["scope_rules"]
        if row["scope_rule_id"] == "SCOPE.CMEE.TEST.ACTUAL"
    )
    forged_scope = {
        **source_scope,
        "scope_rule_id": "SCOPE.AAA.FORGED.WRITE",
        "changeability": "ALLOWED_WRITE_CANDIDATE",
        "required_approval": "SEPARATE_EXPLICIT_AUTHORIZATION_REQUIRED",
        "write_target": True,
        "assertion_provenance": "MACHINE_DISCOVERED",
    }
    model["scope_rules"].append(forged_scope)
    model["scope_rules"].sort(key=lambda row: row["scope_rule_id"])
    item = {
        "priority": 4,
        "stable_id": forged_scope["scope_rule_id"],
        "required": False,
        "repository_key": forged_scope["target_locator"]["repository_key"],
        "path": forged_scope["target_locator"]["path"],
        "graph_distance": 0,
        "selection_tier": "DECISION_SURFACE",
        "reason_codes": sorted(
            {
                forged_scope["changeability"],
                forged_scope["required_approval"],
            }
        ),
        "locator": forged_scope["target_locator"],
    }
    surface = model["decision_surface"]
    surface["items"].append(item)
    surface["items"].sort(
        key=lambda row: (
            row["priority"],
            0 if row["required"] else 1,
            row["graph_distance"]
            if row["graph_distance"] is not None
            else 10**9,
            str(row["repository_key"] or ""),
            str(row["path"] or ""),
            row["stable_id"],
        )
    )
    surface["full_candidate_count"] += 1
    model["read_tiers"]["DECISION_SURFACE"] += 1
    model["budgets"]["ULTRA_KAREN"]["observed_items"] += 1
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="scope rule exact set"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_workspace_claim_owner_scope_injection_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    claim = next(
        row
        for row in model["claims"]
        if row["source_locator"].get("owner_id") is None
        and row["source_locator"].get("remote_ref") is None
    )
    claim["verified_scope"] = sorted(
        set(claim["verified_scope"]) | {"OWNER_REF_BLOB_IDENTITY"}
    )
    scope = next(
        row
        for row in model["verification_scopes"]
        if row["source_id"] == claim["claim_id"]
    )
    scope["verified_scope"] = list(claim["verified_scope"])
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="claim source derivation"):
        verify_task_context(output, expected_unit_b=True)


@pytest.mark.parametrize(
    ("mutation", "message"),
    [
        ("claim_value", "profile declaration|claim declaration"),
        ("direct_impact_reason", "impact reason"),
    ],
)
def test_unit_b_resigned_semantic_model_tamper_is_rejected(
    tmp_path: Path, mutation: str, message: str
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    if mutation == "claim_value":
        claim = next(
            row
            for row in model["claims"]
            if row["claim_kind"] == "MASH_FIXED_CONDITION"
        )
        claim["asserted_value_code"] = "FIXTURE_FORGED_DECISION"
    else:
        direct = next(
            row
            for row in model["impact"]
            if row["impact_class"] == "DIRECT"
            and row["reason_code"] == "EXPLICIT_VERIFIED_CONNECTION"
        )
        direct["reason_code"] = "EXACT_OWNER_OR_WORKSPACE_CHANGED_PATH"
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match=message):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_impact_and_readback_reordering_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    assert len(model["impact"]) > 1
    assert len(model["minimal_readback"]) > 1
    model["impact"].reverse()
    model["minimal_readback"].reverse()
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="impact canonical order"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_decision_reason_tamper_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    visible_ids = {
        item_id
        for card in model["decision_surface"]["pro_first_view_cards"]
        for item_id in card["item_ids"]
    }
    premise = next(
        row
        for row in model["decision_surface"]["items"]
        if row["stable_id"].startswith("PREMISE.")
        and row["stable_id"] not in visible_ids
    )
    premise["reason_codes"] = ["FORGED_REASON_CODE"]
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(
        ContextCompileError, match="decision surface derivation mismatch"
    ):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_mash_card_erasure_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    card = next(
        row
        for row in model["decision_surface"]["pro_first_view_cards"]
        if row["card_id"] == "MASH_FIXED_CONDITIONS"
    )
    assert card["item_ids"]
    card.update(
        item_ids=[],
        source_item_count=0,
        locators=[],
        additional_count=0,
        reason_codes=["NO_MASH_FIXED_CONDITION"],
        additional_reason_count=0,
    )
    visible_ids = {
        item_id
        for row in model["decision_surface"]["pro_first_view_cards"]
        for item_id in row["item_ids"]
    }
    model["budgets"]["PRO_KAREN"]["observed_items"] = len(visible_ids)
    model["budgets"]["PRO_KAREN"]["first_view_observed_decision_items"] = len(
        visible_ids
    )
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(
        ContextCompileError, match="decision surface derivation mismatch"
    ):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_diverged_freshness_is_projected_and_card_erasure_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_b_v2_profile(paths)
    bundle = make_diverged_unit_b_bundle(paths, bundle)
    output = tmp_path / "diverged-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output, expected_unit_b=True)
    model = json.loads((output / "operator_context.json").read_text())
    assert [row["relation"] for row in model["freshness"]] == ["DIVERGED"]
    assert "DIVERGED" in (output / "pro_context.md").read_text()
    card = next(
        row
        for row in model["decision_surface"]["pro_first_view_cards"]
        if row["card_id"] == "FRESHNESS_AND_BLOCKER"
    )
    assert card["reason_codes"] == ["DIVERGED", "READ_ONLY_EXACT_REF_RESOLVED"]
    assert card["item_ids"]
    card.update(
        item_ids=[],
        source_item_count=0,
        locators=[],
        additional_count=0,
        reason_codes=["FRESHNESS_READY_NO_BLOCKER"],
        additional_reason_count=0,
    )
    visible_ids = {
        item_id
        for row in model["decision_surface"]["pro_first_view_cards"]
        for item_id in row["item_ids"]
    }
    model["budgets"]["PRO_KAREN"]["observed_items"] = len(visible_ids)
    model["budgets"]["PRO_KAREN"][
        "first_view_observed_decision_items"
    ] = len(visible_ids)
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(
        ContextCompileError, match="decision surface derivation mismatch"
    ):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_freshness_set_erasure_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    surface = model["decision_surface"]
    assert len(model["freshness"]) == 1
    assert surface["additional_candidate_count"] == 0
    freshness_card = next(
        row
        for row in surface["pro_first_view_cards"]
        if row["card_id"] == "FRESHNESS_AND_BLOCKER"
    )
    assert freshness_card["source_item_count"] == 1
    freshness_ids = set(freshness_card["item_ids"])
    freshness_items = [
        row for row in surface["items"] if row["stable_id"] in freshness_ids
    ]
    assert len(freshness_items) == 1
    model["freshness"] = []
    surface["items"] = [
        row for row in surface["items"] if row["stable_id"] not in freshness_ids
    ]
    surface["full_candidate_count"] -= len(freshness_items)
    surface["required_item_count"] -= sum(
        row["required"] for row in freshness_items
    )
    freshness_card.update(
        item_ids=[],
        source_item_count=0,
        locators=[],
        additional_count=0,
        reason_codes=["FRESHNESS_READY_NO_BLOCKER"],
        additional_reason_count=0,
    )
    visible_ids = {
        item_id
        for row in surface["pro_first_view_cards"]
        for item_id in row["item_ids"]
    }
    model["budgets"]["PRO_KAREN"]["observed_items"] = len(visible_ids)
    model["budgets"]["PRO_KAREN"][
        "first_view_observed_decision_items"
    ] = len(visible_ids)
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="freshness"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_minimal_readback_erasure_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    assert model["minimal_readback"]
    model["minimal_readback"] = []
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="minimal readback"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_nonblocking_handback_injection_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    model["unresolved_by_owner"].append(
        {
            "owner": "MASH",
            "reason_code": "FORGED_NONBLOCKING_HANDOFF",
            "source_id": "FORGED.SOURCE",
            "blocking": False,
        }
    )
    model["unresolved_by_owner"].sort(
        key=lambda row: (row["owner"], row["reason_code"], row["source_id"])
    )
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="unresolved handback"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_legacy_context_count_tamper_is_rejected(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    model["legacy_context"]["selected_file_count"] += 1
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="legacy context"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_drift_erasure_is_rejected_by_exact_derivation(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_b_v2_profile(paths)
    connection = next(
        row
        for row in document["tasks"]["cmee"]["operator_contract"]["connections"]
        if row["relation_kind"] == "COVERED_BY_TEST_OR_CONTRACT"
    )
    connection["target_locator"]["path"] = "tests/protected/missing_contract.py"
    write_json(paths["task_profiles"], document)
    output = tmp_path / "drift-erasure"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    assert model["drift"]
    model["drift"] = []
    model["unresolved_by_owner"] = []
    for gate in (
        "unit_a_premise_model_ready",
        "claim_provenance_valid",
        "required_claim_sources_resolved",
        "required_connections_verified",
        "scope_default_applied",
        "pro_first_view_budget_pass",
        "ultra_budget_pass",
        "manual_review_absent",
        "shared_model_projection_binding_required",
    ):
        model["completion_gates"][gate] = True
    model["operator_v1"]["status"] = "V1_OPERATOR_CONTEXT_READY"
    model["operator_v1"]["unit_b_status"] = "UNIT_B_WORK_CONTEXT_READY"
    manifest["unit_b_work_context"]["status"] = "UNIT_B_WORK_CONTEXT_READY"
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(
        ContextCompileError, match="drift exact set derivation mismatch"
    ):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_resigned_fake_budget_overflow_is_rejected_by_observation(
    tmp_path: Path,
) -> None:
    _paths, _bundle, output = _compile_unit_b_fixture(tmp_path)
    model = json.loads((output / "operator_context.json").read_text())
    manifest = json.loads((output / "context_manifest.json").read_text())
    assert model["budgets"]["PRO_KAREN"]["overflow_codes"] == []
    model["budgets"]["PRO_KAREN"]["overflow_codes"] = [
        "BUDGET_EXCEEDED_REQUIRED_SURFACE"
    ]
    model["completion_gates"]["pro_first_view_budget_pass"] = False
    model["operator_v1"]["status"] = "V1_OPERATOR_CONTEXT_BLOCKED"
    model["operator_v1"]["unit_b_status"] = "UNIT_B_WORK_CONTEXT_BLOCKED"
    manifest["unit_b_work_context"]["status"] = "UNIT_B_WORK_CONTEXT_BLOCKED"
    model["unresolved_by_owner"] = [
        {
            "owner": "MASH",
            "reason_code": "BUDGET_EXCEEDED_REQUIRED_SURFACE",
            "source_id": "UNIT_B.BUDGET_EXCEEDED_REQUIRED_SURFACE",
            "blocking": True,
        }
    ]
    resign_unit_b_artifacts(output, model, manifest)
    with pytest.raises(ContextCompileError, match="observed role budget mismatch"):
        verify_task_context(output, expected_unit_b=True)


def test_unit_b_rename_drift_requires_exact_diff_and_remote_gap_is_not_path_missing(
    tmp_path: Path,
) -> None:
    paths, bundle, output = _compile_unit_b_fixture(tmp_path)
    manifest = json.loads((output / "context_manifest.json").read_text())
    premise_model = manifest["unit_a_premise_management"]
    owner_path = "Cocolon_前提資料/current_structure/04_cmee_current_structure.md"
    premise_model["owners"][0]["owner_side_changes"] = [
        {
            "git_status": "R100",
            "status": "RENAMED",
            "old_path": owner_path,
            "new_path": "Cocolon_前提資料/current_structure/04_cmee_current_structure_v2.md",
        }
    ]
    premise_model["owners"][0]["owner_side_changed_paths"] = [
        "Cocolon_前提資料/current_structure/04_cmee_current_structure_v2.md"
    ]
    selected = read_jsonl(output / "selected_files.jsonl")
    records = {
        row["identity"]: FileRecord(
            identity=row["identity"],
            repository_key=row["repository_key"],
            path=row["path"],
            source_commit=row["source_commit"],
            blob_sha=row["blob_sha"],
            content_sha256=row["content_sha256"],
            size_bytes=row["size_bytes"],
            inventory_classification=row["inventory_classification"],
            raw=row,
        )
        for row in selected
    }
    by_key = {row.key: row for row in records.values()}
    profile = json.loads(paths["task_profiles"].read_text())["tasks"]["cmee"]
    common = {
        "workspace": "cmee_working",
        "task": "cmee",
        "legacy_status": manifest["status"],
        "task_profile": profile,
        "by_identity": records,
        "by_key": by_key,
        "selected_rows": selected,
        "used_edges": read_jsonl(output / "closure_edges.jsonl"),
        "unresolved": read_jsonl(output / "unresolved_context.jsonl"),
        "task_dependency_fingerprint": bundle["task_dependency_fingerprint"],
        "workspace_refs": manifest["workspace_exact_refs"],
        "symbol_owner": {},
        "route_owner": {},
    }
    renamed = build_work_context_model(premise_model=premise_model, **common)
    rename_drift = next(
        row
        for row in renamed["drift"]
        if row["drift_code"] == "OWNER_PATH_RENAMED_OR_DELETED"
    )
    assert rename_drift["evidence_locator"]["path"] == owner_path
    deleted = json.loads(json.dumps(premise_model))
    deleted["owners"][0]["owner_side_changes"] = [
        {
            "git_status": "D",
            "status": "DELETED",
            "old_path": owner_path,
            "new_path": None,
        }
    ]
    deleted["owners"][0]["owner_side_changed_paths"] = [owner_path]
    deleted_model = build_work_context_model(
        premise_model=deleted, **common
    )
    deletion_drift = next(
        row
        for row in deleted_model["drift"]
        if row["drift_code"] == "OWNER_PATH_RENAMED_OR_DELETED"
    )
    assert deletion_drift["evidence_locator"]["path"] == owner_path
    assert deletion_drift["impact_class"] == "MANUAL_REVIEW"
    assert deletion_drift["required_owner_handback"] == "MASH"
    remote_gap = json.loads(json.dumps(premise_model))
    remote_gap["premises"][0]["status"] = "UNRESOLVED"
    remote_gap["premises"][0]["reason_code"] = "REQUIRED_PREMISE_OWNER_UNRESOLVED"
    unresolved_model = build_work_context_model(
        premise_model=remote_gap, **common
    )
    assert not any(
        row["drift_code"] == "OWNER_PATH_MISSING"
        and row["subject_id"] == remote_gap["premises"][0]["premise_id"]
        for row in unresolved_model["drift"]
    )


@pytest.mark.parametrize(
    ("mutation", "message"),
    [
        ("dangling_claim", "dangling claim"),
        ("unknown_scope", "unsupported"),
        ("private_body", "unsupported field|private field"),
        ("forged_mash_provenance", "Mash explicit decision"),
    ],
)
def test_unit_b_invalid_contract_fails_closed(
    tmp_path: Path, mutation: str, message: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_b_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    if mutation == "dangling_claim":
        contract["connections"][0]["source_claim_id"] = "CLAIM.MISSING"
    elif mutation == "unknown_scope":
        contract["scope_rules"][0]["changeability"] = "NO_IMPACT"
    elif mutation == "forged_mash_provenance":
        claim = next(
            row
            for row in contract["claim_nodes"]
            if row["claim_kind"] == "ZERO_EFFECT_BOUNDARY"
        )
        claim["asserted_by"] = "Karen"
        claim["source_locator"].pop("remote_ref")
    else:
        contract["claim_nodes"][0]["source_locator"]["body"] = "private"
    with pytest.raises(ContextCompileError, match=message):
        _task_profile(document, "cmee")


def test_unit_a_stale_bundle_workspace_commit_cannot_follow_later_checkout(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    later = paths["root"] / "later.txt"
    later.write_text("later source material\n", encoding="utf-8")
    subprocess.run(["git", "add", "later.txt"], cwd=paths["root"], check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "later source material"],
        cwd=paths["root"],
        check=True,
    )
    with pytest.raises(
        ContextCompileError,
        match=r"canonical owner workspace material commit mismatch",
    ):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=tmp_path / "must-not-publish",
            canonical_owner_bundle=bundle,
        )
    assert not (tmp_path / "must-not-publish").exists()


def test_unit_a_recomputed_workspace_material_commit_forgery_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    bundle["owners"][0]["workspace_material_commit"] = "f" * 40
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(bundle)
    with pytest.raises(
        ContextCompileError,
        match=r"canonical owner workspace material commit mismatch",
    ):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=tmp_path / "must-not-publish",
            canonical_owner_bundle=bundle,
        )
    assert not (tmp_path / "must-not-publish").exists()


def test_unit_a_inventory_snapshot_and_current_material_are_separately_bound(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    inventory_commit = bundle["owners"][0]["workspace_material_commit"]
    review = paths["root"] / "Cocolon_前提資料/system_context/review.md"
    review.write_text("Unit A review material\n", encoding="utf-8")
    relative = review.relative_to(paths["root"]).as_posix()
    subprocess.run(["git", "add", "--", relative], cwd=paths["root"], check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "add review material"],
        cwd=paths["root"],
        check=True,
    )
    material_commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=paths["root"], text=True
    ).strip()
    owner = bundle["owners"][0]
    owner["workspace_material_commit"] = material_commit
    owner.update(
        _classify_owner_relation(
            paths["root"], material_commit, owner["first_resolved_head"]
        )
    )
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(bundle)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output)
    model = manifest["unit_a_premise_management"]
    assert inventory_commit != material_commit
    assert manifest["workspace_exact_refs"]["Cocolon"]["source_commit"] == (
        inventory_commit
    )
    assert model["owners"][0]["workspace_material_commit"] == material_commit
    assert {
        row["workspace_inventory_source_commit"] for row in model["premises"]
    } == {inventory_commit}


def test_unit_a_generated_only_checkout_tail_uses_inventory_material_commit(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    generated = (
        paths["root"]
        / "Cocolon_前提資料/system_context/current/cmee_working/generated-tail.json"
    )
    generated.write_text('{"generated":true}\n', encoding="utf-8")
    relative = generated.relative_to(paths["root"]).as_posix()
    subprocess.run(["git", "add", "--", relative], cwd=paths["root"], check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "generated-only tail"],
        cwd=paths["root"],
        check=True,
    )
    output = tmp_path / "unit-a-output"
    result = compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    assert result.status == "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    assert verify_task_context(output)["unit_a_premise_management"]["status"] == (
        "UNIT_A_PREMISE_MODEL_READY"
    )


def test_v2_rejects_purpose_and_bind_locator_mixing(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    document["tasks"]["cmee"]["purpose"] = "must not become product authority"
    with pytest.raises(ContextCompileError, match="forbids.*purpose"):
        _task_profile(document, "cmee")
    document["tasks"]["cmee"].pop("purpose")
    document["tasks"]["cmee"]["operator_contract"]["required_premises"][0][
        "expected_identity_locator_id"
    ] = "LOC.INVALID.MIXED"
    with pytest.raises(ContextCompileError, match="requires.*null"):
        _task_profile(document, "cmee")


@pytest.mark.parametrize(
    ("body", "reason"),
    [
        (b"---\ndoc_id: A\ndoc_id: B\n---\n", "DUPLICATE"),
        (b"---\ndoc_id:\n  nested: value\n---\n", "NESTED"),
        (b"---\ndoc_id: |\n  multiline\n---\n", "UNSUPPORTED"),
        (b"---\ndoc_id: &anchor value\n---\n", "UNSUPPORTED"),
        (b"---\ndoc_id: *anchor\n---\n", "UNSUPPORTED"),
        (b"---\ndoc_id: !tag value\n---\n", "UNSUPPORTED"),
        (b"---\n<<: *defaults\n---\n", "UNSUPPORTED"),
    ],
)
def test_restricted_front_matter_rejects_unsafe_yaml(body: bytes, reason: str) -> None:
    parsed = parse_restricted_front_matter(body)
    assert parsed["status"] == "UNRESOLVED_METADATA"
    assert reason in parsed["reason_code"]


@pytest.mark.parametrize(
    "unsafe_value",
    [
        "{name: PRIVATE_FLOW_MAP}",
        "Mash # PRIVATE_INLINE_COMMENT",
        "name: PRIVATE_NESTED_MAPPING",
    ],
)
def test_restricted_front_matter_rejects_unquoted_structural_scalars_without_leak(
    unsafe_value: str,
) -> None:
    parsed = parse_restricted_front_matter(
        (f"---\ndecision_owner: {unsafe_value}\n---\n").encode("utf-8")
    )
    assert parsed["status"] == "UNRESOLVED_METADATA"
    assert "UNSUPPORTED_YAML_FEATURE_IN_FRONT_MATTER" in parsed["reason_code"]
    assert parsed["fields"] == {}
    assert unsafe_value not in json.dumps(parsed, ensure_ascii=False, sort_keys=True)


def test_restricted_front_matter_allows_quoted_structural_literal() -> None:
    parsed = parse_restricted_front_matter(
        b'---\ndecision_owner: "Mash # literal: {name}"\n---\n'
    )
    assert parsed["status"] == "VERIFIED"
    assert parsed["fields"]["decision_owner"] == "Mash # literal: {name}"


@pytest.mark.parametrize(
    ("key", "sensitive_value"),
    [
        ("decision_owner", "private.person@example.com"),
        ("document_id", "sk_live_PRIVATE_TOKEN_123"),
    ],
)
def test_restricted_front_matter_rejects_sensitive_allowlisted_values_without_leak(
    key: str, sensitive_value: str
) -> None:
    parsed = parse_restricted_front_matter(
        (f"---\n{key}: {sensitive_value}\n---\n").encode("utf-8")
    )
    assert parsed == {
        "status": "UNRESOLVED_METADATA",
        "reason_code": "METADATA_SENSITIVE_VALUE_REJECTED",
        "fields": {},
    }
    assert sensitive_value not in json.dumps(parsed, sort_keys=True)


def test_restricted_front_matter_malformed_private_key_returns_fixed_reason() -> None:
    private_key = "private_account_marker"
    private_value = "PRIVATE_MALFORMED_VALUE"
    parsed = parse_restricted_front_matter(
        (f"---\n{private_key}: &anchor {private_value}\n---\n").encode("utf-8")
    )
    assert parsed == {
        "status": "UNRESOLVED_METADATA",
        "reason_code": "UNSUPPORTED_YAML_FEATURE_IN_FRONT_MATTER",
        "fields": {},
    }
    serialized = json.dumps(parsed, sort_keys=True)
    assert private_key not in serialized
    assert private_value not in serialized


def test_restricted_front_matter_extracts_only_allowlisted_public_fields() -> None:
    parsed = parse_restricted_front_matter(
        b"---\n"
        b"document_id: DOC.CMEE.TEST\n"
        b"title: ignored body-like display text\n"
        b"normative_status: REVIEWED_NONAUTHORITY\n"
        b"design_authority: false\n"
        b"supersedes: [DOC.OLD.1, DOC.OLD.2]\n"
        b"automatic_progression: false\n"
        b"---\nbody must never be returned\n"
    )
    assert parsed == {
        "status": "VERIFIED",
        "reason_code": "METADATA_RESTRICTED_VERIFIED",
        "fields": {
            "document_id": "DOC.CMEE.TEST",
            "normative_status": "REVIEWED_NONAUTHORITY",
            "design_authority": False,
            "supersedes": ["DOC.OLD.1", "DOC.OLD.2"],
            "automatic_progression": False,
        },
    }
    assert "title" not in parsed["fields"]
    assert "body" not in json.dumps(parsed)
    truncated_body = parse_restricted_front_matter(
        b"---\ndocument_id: DOC.CMEE.TEST\n---\n" + b"x" * 100 + b"\xe3"
    )
    assert truncated_body["status"] == "VERIFIED"
    assert truncated_body["fields"]["document_id"] == "DOC.CMEE.TEST"


def test_actual_nls_disposition_metadata_is_reviewed_nonauthority() -> None:
    root = Path(__file__).parents[2]
    path = "Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md"
    body = subprocess.check_output(
        ["git", "-C", str(root), "show", f"HEAD:{path}"]
    )
    metadata = parse_restricted_front_matter(body)
    assert metadata["status"] == "VERIFIED"
    assert metadata["fields"]["normative_status"] == "REVIEWED_NONAUTHORITY"
    assert metadata["fields"]["design_authority"] is False
    assert metadata["fields"]["implementation_authority"] is False


def test_navigation_responsibility_and_historical_subject_are_not_collapsed(
    tmp_path: Path,
) -> None:
    repo = tmp_path / "repo"
    repo.mkdir()
    subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=repo, check=True)
    subprocess.run(["git", "config", "user.name", "test"], cwd=repo, check=True)
    document = repo / "docs" / "current_state.md"
    document.parent.mkdir()
    document.write_text(
        "---\ndocument_id: DOC.CYCLE.TEST\n"
        "normative_status: CURRENT_CYCLE001_NAVIGATION_OWNER\n"
        "technical_authority: false\nautomatic_progression: false\n---\nbody\n",
        encoding="utf-8",
    )
    subprocess.run(["git", "add", "."], cwd=repo, check=True)
    subprocess.run(["git", "commit", "-q", "-m", "fixture"], cwd=repo, check=True)
    commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=repo, text=True
    ).strip()
    blob = subprocess.check_output(
        ["git", "rev-parse", "HEAD:docs/current_state.md"], cwd=repo, text=True
    ).strip()
    record = FileRecord(
        identity="file-cycle-test",
        repository_key="Cocolon",
        path="docs/current_state.md",
        source_commit=commit,
        blob_sha=blob,
        content_sha256="a" * 64,
        size_bytes=document.stat().st_size,
        inventory_classification="design",
        raw={},
    )
    responsibilities = []
    for responsibility_id, kind, lifecycle, authority in (
        ("RESP.CYCLE.NAVIGATION", "NAVIGATION_OWNER", "CURRENT", "NAVIGATION_AUTHORITY"),
        ("RESP.CYCLE.SUBJECT", "HISTORICAL_PREDECESSOR", "HISTORICAL", "NO_AUTHORITY_CLAIM"),
    ):
        responsibilities.append(
            {
                "responsibility_id": responsibility_id,
                "subject_locator": {
                    "repository_key": "Cocolon",
                    "owner_id": "OWNER.CYCLE.TEST",
                    "path": record.path,
                },
                "responsibility_kind": kind,
                "lifecycle": lifecycle,
                "publication_state": "FIXTURE",
                "authority_kind": authority,
                "effective_condition": "FIXTURE",
                "supersedes": [],
                "superseded_by": [],
                "metadata_assertions": [],
                "assertion_provenance": "MANUAL_PROFILE_ASSERTION",
                "source_locator": {"privacy": "PUBLIC", "repository_key": "Cocolon", "path": record.path},
            }
        )
    metadata = parse_restricted_front_matter(document.read_bytes())
    model = build_premise_management_model(
        task_profile={
            "task_orientation": "fixture routing only",
            "operator_contract": {
                "canonical_owner_refs": [],
                "required_premises": [],
                "document_responsibilities": responsibilities,
            },
        },
        by_identity={record.identity: record},
        by_key={record.key: record},
        requested_classification={record.identity: "CURRENT_OWNER"},
        repository_roots={"Cocolon": repo},
        canonical_owner_bundle={
            "owners": [],
            "premises": [],
            "responsibility_subjects": [
                {
                    "responsibility_id": row["responsibility_id"],
                    "status": "RESOLVED",
                    "resolved_commit": commit,
                    "resolved_blob_sha": blob,
                    "metadata": metadata,
                }
                for row in responsibilities
            ],
            "blocking_codes": [],
        },
    )
    rows = {row["responsibility_id"]: row for row in model["responsibilities"]}
    assert rows["RESP.CYCLE.NAVIGATION"]["lifecycle"] == "CURRENT"
    assert rows["RESP.CYCLE.NAVIGATION"]["authority_kind"] == "NAVIGATION_AUTHORITY"
    assert rows["RESP.CYCLE.SUBJECT"]["lifecycle"] == "HISTORICAL"
    assert rows["RESP.CYCLE.SUBJECT"]["authority_kind"] == "NO_AUTHORITY_CLAIM"
    assert model["bindings_by_identity"][record.identity]["responsibility_ids"] == [
        "RESP.CYCLE.NAVIGATION",
        "RESP.CYCLE.SUBJECT",
    ]


def test_supersession_self_cycle_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    responsibility = document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ][0]
    responsibility["supersedes"] = [responsibility["responsibility_id"]]
    with pytest.raises(ContextCompileError, match="self supersession"):
        _task_profile(document, "cmee")


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


def test_repository_task_profile_has_exact13_seed_and_exact_external_assets() -> None:
    profile_path = (
        Path(__file__).parents[2]
        / "Cocolon_前提資料"
        / "system_context"
        / "task_profiles.json"
    )
    profile = json.loads(profile_path.read_text())
    cmee = profile["tasks"]["cmee"]
    assert profile["schema_version"] == "cocolon.system_context.task_profiles.v2"
    assert profile["persistent_primary_task"] == "cmee"
    assert cmee["publication_mode"] == "PERSISTENT_PRIMARY"
    assert "purpose" not in cmee
    assert cmee["task_orientation"]
    contract = cmee["operator_contract"]
    assert set(contract) == {
        "canonical_owner_refs",
        "required_premises",
        "document_responsibilities",
        "claim_nodes",
        "connections",
        "scope_rules",
        "external_locators",
        "role_views",
        "collaboration",
        "actual_use_feedback",
    }
    assert len(contract["canonical_owner_refs"]) == 1
    owner = contract["canonical_owner_refs"][0]
    assert owner["owner_id"] == "OWNER.CMEE.PR30"
    assert owner["freshness_policy"] == "READ_ONLY_EXACT_REF"
    assert "resolved_head" not in owner
    assert "repository" not in owner
    assert len(contract["required_premises"]) == 7
    assert [row["entry_chain_order"] for row in contract["required_premises"]] == list(range(1, 8))
    assert all(
        row["expected_identity_policy"]
        == "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF"
        and row["expected_identity_locator_id"] is None
        for row in contract["required_premises"]
    )
    responsibilities = contract["document_responsibilities"]
    assert len(responsibilities) == 21
    assert len({row["responsibility_id"] for row in responsibilities}) == 21
    assert all(not row["supersedes"] and not row["superseded_by"] for row in responsibilities)
    assert {row["claim_kind"] for row in contract["claim_nodes"]} == {
        "PRODUCT_PURPOSE",
        "MASH_FIXED_CONDITION",
        "PRODUCT_ROUTE",
        "CURRENT_PRODUCT_OWNER",
        "ZERO_EFFECT_BOUNDARY",
    }
    product_route_claim = next(
        row
        for row in contract["claim_nodes"]
        if row["claim_id"] == "CLAIM.CMEE.PRODUCT_ROUTE"
    )
    assert product_route_claim["asserted_value_code"] == (
        "ROUND0_FOLLOW_PRIMARY_VISIBLE_RESPONSE_CORRECTION_APPROVED"
    )
    assert product_route_claim["asserted_by"] == "Mash"
    assert product_route_claim["decision_owner"] == "Mash"
    assert product_route_claim["assertion_provenance"] == "MASH_EXPLICIT_DECISION"
    assert product_route_claim["adoption_state"] == "ACCEPTED_CURRENT"
    assert product_route_claim["claim_boundary"] == (
        "APPROVED_ROUTE_REQUIRES_FRESH_EXPLICIT_UNIT_NO_AUTOMATIC_PROGRESSION"
    )
    product_route_source = product_route_claim["source_locator"]
    assert product_route_source["repository_key"] == "Cocolon"
    assert product_route_source["owner_id"] == "OWNER.CMEE.PR30"
    assert product_route_source["remote_ref"] == (
        "refs/heads/agent/three-core-cmee-current-structure-20260815"
    )
    assert product_route_source["path"] == (
        "Cocolon_前提資料/designs/cmee/v1/"
        "06_implementation_order_migration_and_verification.md"
    )
    assert product_route_source["section_locator"] == "§86"
    current_owner_claim = next(
        row
        for row in contract["claim_nodes"]
        if row["claim_id"] == "CLAIM.CMEE.CURRENT_PRODUCT_OWNER"
    )
    assert current_owner_claim["asserted_value_code"] == (
        "CMEE_INHERITED_DISABLED_OWNER_IMPLEMENTED_NOT_ACCEPTED_"
        "IM10_NON_PASS_CANDIDATE_NOT_READY"
    )
    assert current_owner_claim["asserted_by"] == "Mash"
    assert current_owner_claim["decision_owner"] == "Mash"
    assert current_owner_claim["assertion_provenance"] == "MASH_EXPLICIT_DECISION"
    assert current_owner_claim["adoption_state"] == "IMPLEMENTED_NOT_ACCEPTED"
    assert current_owner_claim["claim_boundary"] == (
        "DISABLED_NO_CUTOVER_MERGE_API_DB_RN_EXTERNAL_AI_NETWORK_"
        "FALLBACK_OR_PRODUCTION_EFFECT"
    )
    current_owner_source = current_owner_claim["source_locator"]
    assert current_owner_source["repository_key"] == "Cocolon"
    assert current_owner_source["owner_id"] == "OWNER.CMEE.PR30"
    assert current_owner_source["remote_ref"] == (
        "refs/heads/agent/three-core-cmee-current-structure-20260815"
    )
    assert current_owner_source["path"] == (
        "Cocolon_前提資料/designs/cmee/v1/02_emlis_v1a_detailed_design.md"
    )
    assert current_owner_source["section_locator"] == "§35"
    assert current_owner_claim["verified_scope"] == ["PUBLIC_SOURCE_LOCATOR"]
    assert len(contract["connections"]) == 5
    assert len(contract["scope_rules"]) == 3
    assert set(contract["role_views"]) == {
        "PRO_KAREN",
        "ULTRA_KAREN",
        "COLLABORATION",
    }
    assert len(contract["external_locators"]) == 2
    assert all(
        row["location_kind"] == "OTHER_WORKSPACE"
        and row["availability_state"] == "AVAILABLE"
        and row["privacy_state"] == "PUBLIC"
        and row["canonicality"] == "NONCANONICAL"
        and row["adoption_state"] == "DESIGN_REFLECTED_NOT_IMPLEMENTED"
        and row["public_identity_allowed"] is True
        for row in contract["external_locators"]
    )
    assert {
        row["locator_id"]: row["claim_boundary"]
        for row in contract["external_locators"]
    } == {
        "EXTERNAL.CMEE.CYCLE001.SOURCE": (
            "EXACT_MIGRATION_INPUT_NOT_ACTIVE_CMEE_SUBENGINE"
        ),
        "EXTERNAL.CMEE.CYCLE001.TEST": (
            "EXACT_PROTECTED_MIGRATION_VECTOR_NOT_ACTIVE_CMEE_TEST"
        ),
    }
    assert contract["collaboration"]["max_subagent_packets"] == 3
    assert len(contract["collaboration"]["subagent_packets"]) == 3
    assert contract["actual_use_feedback"] == []
    nls_responsibility = next(
        row for row in responsibilities
        if row["subject_locator"]["path"].endswith(
            "NLSv3_to_CMEE_Disposition_Phase1_20260817.md"
        )
    )
    assert nls_responsibility["authority_kind"] == "REVIEWED_NONAUTHORITY"
    assert nls_responsibility["assertion_provenance"] == "MANUAL_PROFILE_ASSERTION"
    assert {row["metadata_key"] for row in nls_responsibility["metadata_assertions"]} == {
        "document_role",
        "normative_status",
        "lifecycle",
        "decision_owner",
        "design_authority",
        "implementation_authority",
        "automatic_progression",
    }
    assert cmee["required_category_exact"] == 10
    assert len(cmee["required_categories"]) == 10
    nls = next(row for row in cmee["required_categories"] if row["id"] == "nlsv3_cycle001")
    assets = nls["actual_review"]["external_asset_candidates"]
    assert len(assets) == 2
    assert all(len(row["source_commit"]) == 40 for row in assets)
    assert all(len(row["blob_sha"]) == 40 for row in assets)
    review = nls["actual_review"]
    assert review["disposition"] == (
        "MIGRATED_RESPONSIBILITY_ONLY_EXTERNAL_ASSET_RETAINED_AS_HISTORY"
    )
    assert review["migration_adoption"] == "MIGRATED_RESPONSIBILITY_ONLY"
    assert review["large_cycle001_module_adoption"] == "NOT_ADOPTED"
    assert review["production_cutover"] == "ZERO"
    assert review["current_product_owner_adoption_state"] == (
        "IMPLEMENTED_NOT_ACCEPTED"
    )
    assert review["im10_state"] == "NON_PASS"
    assert review["candidate_ready"] is False
    assert review["production_effect"] == 0
    assert review["automatic_progression"] is False
    assert set(review["prohibited_effects"]) == {
        "NO_CUTOVER",
        "NO_MERGE",
        "NO_API_CHANGE",
        "NO_DB_CHANGE",
        "NO_RN_CHANGE",
        "NO_EXTERNAL_GENERATIVE_AI",
        "NO_PRODUCT_RUNTIME_NETWORK",
        "NO_FALLBACK",
    }
    targets = review["migrated_responsibility_targets"]
    assert len(targets) == 8
    assert {
        (row["repository_key"], row["path"])
        for row in targets
    } == {
        (
            "mashos-api",
            "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_input_specific_meaning.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/emlis_ai_grounded_observation_plan.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/emlis_ai_grounded_human_reception.py",
        ),
        (
            "mashos-api",
            "ai/services/ai_inference/emlis_ai_grounded_observation_gate.py",
        ),
        (
            "mashos-api",
            "ai/tests/test_emlis_cmee_body_inverse_protected.py",
        ),
    }
    responsibilities = {
        row["path"]: row["responsibility"] for row in targets
    }
    assert responsibilities[
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py"
    ] == "MEANING_PROJECTION_VALIDATION_ONLY_NO_FINAL_SURFACE_OWNER"
    assert responsibilities[
        "ai/services/ai_inference/emlis_ai_grounded_observation_plan.py"
    ] == "FINAL_GROUNDED_OBSERVATION_PLAN_OWNER"
    assert responsibilities[
        "ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py"
    ] == (
        "FINAL_GROUNDED_SENTENCE_PLAN_AND_SENTENCE_REALIZER_OWNER_WITH_BYTES_ONLY_PARSER"
    )
    assert responsibilities[
        "ai/services/ai_inference/emlis_ai_grounded_human_reception.py"
    ] == "FINAL_HUMAN_RECEPTION_AND_RECEPTION_REALIZER_OWNER_TARGET_ATTENTION_WHY"
    symbols = {row["path"]: set(row["symbols"]) for row in targets}
    assert symbols[
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_input_specific_meaning.py"
    ] == {
        "derive_input_specific_meaning_structure",
        "select_input_specific_meaning",
        "project_selected_reading",
    }
    assert symbols[
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py"
    ] == {"project_subjective_meaning_plan", "_validate_phase_A"}
    assert symbols[
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py"
    ] == {
        "build_premeaning_grounded_inputs",
        "build_subjective_planning_inputs",
        "seal_stage1_projection",
        "compile_stage1_response",
    }
    assert symbols[
        "ai/services/ai_inference/emlis_ai_grounded_observation_plan.py"
    ] == {
        "GroundedObservationPlan",
        "build_final_stage1_grounded_observation_plan",
    }
    assert symbols[
        "ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py"
    ] == {
        "GroundedBodyOnlyWitness",
        "parse_grounded_surface_body_bytes",
        "build_grounded_sentence_plan",
        "realize_grounded_sentence_plan",
    }
    assert symbols[
        "ai/services/ai_inference/emlis_ai_grounded_human_reception.py"
    ] == {"realize_grounded_human_reception"}
    assert symbols[
        "ai/services/ai_inference/emlis_ai_grounded_observation_gate.py"
    ] == {
        "GroundedBodyInverseEvaluation",
        "evaluate_grounded_surface_body_inverse",
        "evaluate_grounded_observation_gate",
    }
    assert symbols[
        "ai/tests/test_emlis_cmee_body_inverse_protected.py"
    ] == {
        "GroundedBodyOnlyParserProtectedTest",
        "GroundedBodyInverseProtectedTest",
        "test_parser_contract_is_exact_bytes_only_and_deterministic",
        "test_parser_has_no_plan_source_or_forward_metadata_parameters",
        "test_d21_delete_vector_is_rejected",
        "test_d21_relation_reverse_vector_is_rejected",
        "test_d21_unknown_fill_vector_is_rejected",
        "test_d21_relation_tamper_vector_is_rejected",
        "test_reception_target_attention_why_duties_are_protected",
        "test_existing_production_gate_default_is_unchanged_and_opt_in_is_body_free",
    }
    disabled_seed = next(
        row for row in cmee["seed_rules"]
        if row["id"] == "cmee_disabled_draft_exact13"
    )
    assert len(disabled_seed["path_globs"]) == 13
    assert {
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_input_specific_meaning.py",
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py",
    }.issubset(disabled_seed["path_globs"])
    protected = next(
        row for row in cmee["required_categories"]
        if row["id"] == "protected_tests"
    )
    assert (
        "ai/tests/test_cmee_nls_v3_batch001_unified_stage1_bridge.py"
        in protected["path_globs"]
    )
    assert nls["actual_review"]["require_external_asset_git_verification"] is True


def test_repository_cmee_workspace_profile_keeps_disabled_acceptance_boundary() -> None:
    profile_path = (
        Path(__file__).parents[2]
        / "Cocolon_前提資料"
        / "system_context"
        / "workspace_profiles.json"
    )
    document = json.loads(profile_path.read_text())
    cmee = document["profiles"]["cmee_working"]
    assert cmee["current_product_owner_adoption_state"] == (
        "IMPLEMENTED_NOT_ACCEPTED"
    )
    assert cmee["im10_state"] == "NON_PASS"
    assert cmee["candidate_ready"] is False
    assert cmee["production_effect"] == 0
    assert cmee["automatic_progression"] is False
    assert "generated_context_state" not in cmee
    assert "generated_context_consumable" not in cmee
    assert "generated_context_last_source_commits" not in cmee
    assert "generated_context_refresh_blocker" not in cmee
    product = cmee["repositories"]["Cocolon"]
    assert product["checkout_ref"] == (
        "agent/three-core-cmee-current-structure-20260815"
    )
    assert product["expected_head"] == (
        "97b25c146ad41f87d5859e450e48face9de65ea0"
    )
    assert "expected_ancestor" not in product
    api = cmee["repositories"]["mashos-api"]
    assert api["checkout_ref"] == (
        "agent/cmee-v1a-i1sx-source-explicit-20260815"
    )
    assert api["expected_head"] == (
        "3c335bd11eb94d38eb5649b54b31b2de38636ebb"
    )


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


def make_unit_c_v2_profile(paths: dict[str, Path]) -> tuple[dict, dict]:
    """Extend the Unit B fixture with the bounded Unit C contract."""
    _document, bundle = make_unit_b_v2_profile(paths)
    commit, blobs = _install_exact_external_cycle_checkout(paths)
    document = json.loads(paths["task_profiles"].read_text())
    contract = document["tasks"]["cmee"]["operator_contract"]
    source_path = (
        "ai/services/ai_inference/"
        "emlis_ai_step11_cycle001_product_recovery_v3.py"
    )
    test_path = "ai/tests/test_emlis_nls_v3_s11_cycle001_product_recovery_v3.py"

    def external_locator(
        locator_id: str,
        path: str,
        *,
        evidence_kind: str,
        symbols: list[str],
    ) -> dict:
        return {
            "locator_id": locator_id,
            "location_kind": "OTHER_WORKSPACE",
            "public_locator_or_opaque_id": {
                "repository_key": "mashos-api",
                "workspace": "cycle001_working",
                "source_commit": commit,
                "path": path,
                "blob_sha": blobs[path],
                "evidence_kind": evidence_kind,
                "symbols": symbols,
            },
            "availability_state": "AVAILABLE",
            "privacy_state": "PUBLIC",
            "canonicality": "NONCANONICAL",
            "adoption_state": "DESIGN_REFLECTED_NOT_IMPLEMENTED",
            "retrieval_owner": "ULTRA_KAREN",
            "claim_boundary": "PUBLIC_EXACT_IDENTITY_READ_ONLY_NONCANONICAL",
            "public_identity_allowed": True,
            "assertion_provenance": "EXTERNAL_ASSET_VERIFIED",
        }

    contract["external_locators"] = [
        external_locator(
            "EXTERNAL.CMEE.TEST.CYCLE001.SOURCE",
            source_path,
            evidence_kind="source",
            symbols=[
                "STEP11_CYCLE001_PRODUCT_RECOVERY_SOURCE_SCHEMA",
                "Step11Cycle001ProductRecoverySourceEnvelope",
                "_SEMANTIC_COVERAGE_AUTHORITY",
                "step11_cycle001_product_recovery_visible_inverse",
            ],
        ),
        external_locator(
            "EXTERNAL.CMEE.TEST.CYCLE001.TEST",
            test_path,
            evidence_kind="test",
            symbols=["_audit_candidate"],
        ),
    ]
    contract["role_views"]["COLLABORATION"] = {
        "max_items": 32,
        "max_referenced_source_bytes": 2097152,
        "max_reasons_per_item": 8,
        "max_projection_utf8_bytes": 131072,
    }
    contract["collaboration"] = {
        "max_subagent_packets": 3,
        "restart_packet": {
            "purpose_code": "RESUME_FROM_MASH_FIXED_CLAIM",
            "next_work_source_claim_ids": [
                "CLAIM.CMEE.TEST.MASH_FIXED_CONDITION"
            ],
            "prohibited_scope_rule_ids": [
                "SCOPE.CMEE.TEST.ACTUAL",
                "SCOPE.CMEE.TEST.CONTRACT",
            ],
            "environment_requirement_claim_id": (
                "CLAIM.CMEE.TEST.MASH_FIXED_CONDITION"
            ),
            "max_items": 12,
        },
        "subagent_packets": [
            {
                "packet_id": "PACKET.CMEE.TEST.CLAIM_ROUTE",
                "purpose_code": "VERIFY_CLAIM_ROUTE_READ_ONLY",
                "question_code": "DO_DECLARED_IDENTITIES_CONNECT",
                "question_text": (
                    "Verify the declared claim and external identities without "
                    "adding facts or effects."
                ),
                "selected_target_ids": [
                    "CLAIM.CMEE.TEST.PRODUCT_ROUTE",
                    "EXTERNAL.CMEE.TEST.CYCLE001.SOURCE",
                ],
                "prohibited_inference_codes": [
                    "NO_ACCEPTANCE_INFERENCE",
                    "NO_PRODUCT_GREEN_INFERENCE",
                ],
                "prohibited_effect_codes": [
                    "NO_EXECUTION",
                    "NO_WRITE_AUTHORITY",
                ],
                "expected_output_schema": "READ_ONLY_FINDINGS_V1",
                "coverage_boundary_ids": ["SCOPE.CMEE.TEST.ACTUAL"],
                "overlap_policy": "DISJOINT",
                "unresolved_handback_owner": "MASH",
            }
        ],
    }
    contract["actual_use_feedback"] = []
    write_json(paths["task_profiles"], document)
    return document, bundle


def compile_unit_c_fixture(
    paths: dict[str, Path],
    bundle: dict,
    *,
    task: str = "cmee",
    output: Path | None = None,
    remote_verified: bool = False,
):
    return compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task=task,
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output or paths["output"],
        remote_verified=remote_verified,
        canonical_owner_bundle=bundle,
    )


def install_ephemeral_unit_c_fixture_task(
    paths: dict[str, Path],
    document: dict,
    bundle: dict,
    *,
    task: str,
) -> dict:
    """Install a non-CMEE Unit C task and its read-only owner namespace."""
    ephemeral = json.loads(json.dumps(document["tasks"]["cmee"]))
    ephemeral["publication_mode"] = "EPHEMERAL_VERIFY_ONLY"
    ephemeral["task_orientation"] = "Verify a non-CMEE read-only context."
    ephemeral["operator_contract"]["external_locators"] = []
    ephemeral["operator_contract"]["collaboration"]["subagent_packets"][0][
        "selected_target_ids"
    ] = ["CLAIM.CMEE.TEST.PRODUCT_ROUTE"]
    document["tasks"][task] = ephemeral
    write_json(paths["task_profiles"], document)

    ephemeral_bundle = json.loads(json.dumps(bundle))
    ephemeral_bundle["task"] = task
    for owner in ephemeral_bundle["owners"]:
        namespace = _expected_owner_namespace(task, owner["owner_id"])
        owner["namespace"] = namespace
        subprocess.run(
            ["git", "update-ref", namespace, owner["pre_publish_resolved_head"]],
            cwd=paths["root"],
            check=True,
        )
    ephemeral_bundle["task_dependency_fingerprint"] = (
        canonical_owner_bundle_fingerprint(ephemeral_bundle)
    )
    return ephemeral_bundle


def test_unit_c_t32_t60_same_model_renders_exact11_byte_exact_outputs(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_c_v2_profile(paths)
    compile_unit_c_fixture(paths, bundle)
    manifest = verify_task_context(
        paths["output"],
        expected_unit_a=True,
        expected_unit_c=True,
        expected_task="cmee",
        expected_publication_mode="PERSISTENT_PRIMARY",
    )
    expected_logical = {
        "selected_files.jsonl",
        "closure_edges.jsonl",
        "required_category_coverage.json",
        "unresolved_context.jsonl",
        "full_text_read_order.md",
        "cmee_context_overview.md",
        "cmee_unincorporated_actual_findings.md",
        "operator_context.json",
        "pro_context.md",
        "ultra_context.md",
        "collaboration_packets.json",
    }
    assert set(manifest["output_sha256"]) == expected_logical
    assert len(manifest["output_sha256"]) == 11
    summary = manifest["unit_c_collaboration_support"]
    assert summary["status"] == "UNIT_C_COLLABORATION_SUPPORT_READY"
    assert summary["logical_output_count"] == 11
    assert summary["publication_state"] == "TRACKED_DRAFT_CANDIDATE"
    assert summary["temporary_candidate"] is False
    assert summary["external_locator_count"] == 2
    assert summary["actual_use_feedback_count"] == 0
    assert summary["restart_packet_count"] == 1
    assert summary["subagent_packet_count"] == 1

    operator_path = paths["output"] / "operator_context.json"
    operator = json.loads(operator_path.read_text())
    operator_sha = sha(operator_path)
    packet_path = paths["output"] / "collaboration_packets.json"
    assert packet_path.read_bytes() == _render_collaboration_packets(
        operator, operator_sha
    )
    packets = json.loads(packet_path.read_text())
    assert packets["operator_context_sha256"] == operator_sha
    assert packets["operator_model_fingerprint"] == (
        operator["operator_model_fingerprint"]
    )
    assert packets["projection_new_fact_count"] == 0
    assert packets["fact_base"] == "operator_context.json"
    assert set(packets["zero_effects"].values()) == {False}
    assert summary["collaboration_packets_sha256"] == sha(packet_path)
    assert operator["actual_use_feedback"] == {
        "policy": "EVENT_DRIVEN_OPTIONAL",
        "rows": [],
        "empty_feedback_is_valid": True,
        "feedback_required_for_ready": False,
        "automatic_selection_mutation": False,
        "automatic_rank": False,
    }
    assert operator["collaboration"]["same_operator_model_required"] is True
    assert operator["collaboration"]["subagent_execution"] is False
    assert operator["collaboration"]["model_selection"] is False
    assert operator["collaboration"]["tool_selection"] is False
    assert operator["collaboration"]["write_authority"] is False
    assert operator["collaboration"]["final_adoption_authority"] is False


def test_unit_c_t38_empty_feedback_valid_and_routine_positive_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_c_v2_profile(paths)
    profile, is_v2 = _task_profile(document, "cmee")
    assert is_v2 is True
    assert profile["operator_contract"]["actual_use_feedback"] == []

    invalid = json.loads(json.dumps(document))
    contract = invalid["tasks"]["cmee"]["operator_contract"]
    contract["actual_use_feedback"] = [
        {
            "feedback_id": "FEEDBACK.CMEE.TEST.ROUTINE_POSITIVE",
            "observed_task_instance": "CMEE.TEST.INSTANCE.001",
            "observed_at": "OBSERVATION_20260822",
            "author_role": "PRO_KAREN",
            "target_role": "COLLABORATION",
            "target_id": "CLAIM.CMEE.TEST.PRODUCT_ROUTE",
            "trigger_code": "OBSERVED_MISSING_SELECTION",
            "disposition": "SELECTED_AND_USED",
            "source_locator": json.loads(
                json.dumps(contract["external_locators"][0])
            ),
            "reason_code": "ROUTINE_SUCCESS_LOG",
        }
    ]
    with pytest.raises(
        ContextCompileError,
        match="SELECTED_AND_USED requires related_feedback_id",
    ):
        _task_profile(invalid, "cmee")

    routine_pair = json.loads(json.dumps(document))
    pair_contract = routine_pair["tasks"]["cmee"]["operator_contract"]
    reviewed_source = json.loads(
        json.dumps(pair_contract["external_locators"][0])
    )
    reviewed_source["locator_id"] = "LOC.FEEDBACK.CMEE.TEST.REVIEWED"
    positive_source = json.loads(
        json.dumps(pair_contract["external_locators"][1])
    )
    positive_source["locator_id"] = "LOC.FEEDBACK.CMEE.TEST.POSITIVE"
    pair_contract["actual_use_feedback"] = [
        {
            "feedback_id": "FEEDBACK.CMEE.TEST.ISSUE_REVIEWED",
            "observed_task_instance": "CMEE.TEST.INSTANCE.001",
            "observed_at": "OBSERVATION_20260822_A",
            "author_role": "ULTRA_KAREN",
            "target_role": "COLLABORATION",
            "target_id": "CLAIM.CMEE.TEST.PRODUCT_ROUTE",
            "trigger_code": "ISSUE_REVIEWED_NOT_TOOL_CAUSED",
            "disposition": "NOT_A_TOOL_PROBLEM",
            "source_locator": reviewed_source,
            "reason_code": "ISSUE_REVIEWED_EXTERNALLY",
        },
        {
            "feedback_id": "FEEDBACK.CMEE.TEST.ROUTINE_PAIR_POSITIVE",
            "observed_task_instance": "CMEE.TEST.INSTANCE.002",
            "observed_at": "OBSERVATION_20260822_B",
            "author_role": "PRO_KAREN",
            "target_role": "COLLABORATION",
            "target_id": "CLAIM.CMEE.TEST.ZERO_EFFECT_BOUNDARY",
            "trigger_code": "OBSERVED_MISSING_SELECTION",
            "disposition": "SELECTED_AND_USED",
            "source_locator": positive_source,
            "reason_code": "ROUTINE_SUCCESS_PAIR",
            "related_feedback_id": "FEEDBACK.CMEE.TEST.ISSUE_REVIEWED",
        },
    ]
    with pytest.raises(
        ContextCompileError,
        match="SELECTED_AND_USED does not close a matching gap",
    ):
        _task_profile(routine_pair, "cmee")


def test_unit_c_private_locator_rejects_body_or_identity_leakage(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_c_v2_profile(paths)
    invalid = json.loads(json.dumps(document))
    locator = invalid["tasks"]["cmee"]["operator_contract"][
        "external_locators"
    ][0]
    locator["location_kind"] = "PRIVATE_LOCATOR_ONLY"
    locator["availability_state"] = "EXISTENCE_UNVERIFIED"
    locator["privacy_state"] = "PRIVATE_LOCATOR_ONLY"
    locator["canonicality"] = "UNRESOLVED"
    locator["adoption_state"] = "UNRESOLVED"
    locator["public_identity_allowed"] = False
    locator["assertion_provenance"] = "UNRESOLVED"
    locator["public_locator_or_opaque_id"] = {
        "opaque_id": "PRIVATE.CMEE.TEST.001",
        "private_body": "must-never-project",
    }
    with pytest.raises(
        ContextCompileError,
        match="public_locator_or_opaque_id",
    ) as error:
        _task_profile(invalid, "cmee")
    assert "must-never-project" not in str(error.value)


def test_unit_c_t66_packet_max_dangling_and_overlap_fail_closed(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_c_v2_profile(paths)

    too_many = json.loads(json.dumps(document))
    packets = too_many["tasks"]["cmee"]["operator_contract"][
        "collaboration"
    ]["subagent_packets"]
    packets.extend(json.loads(json.dumps(packets[0])) for _ in range(3))
    with pytest.raises(
        ContextCompileError,
        match=r"subagent_packets must contain 0\.\.3 rows",
    ):
        _task_profile(too_many, "cmee")

    dangling = json.loads(json.dumps(document))
    dangling_packet = dangling["tasks"]["cmee"]["operator_contract"][
        "collaboration"
    ]["subagent_packets"][0]
    dangling_packet["selected_target_ids"] = [
        "CLAIM.CMEE.TEST.DOES_NOT_EXIST"
    ]
    with pytest.raises(ContextCompileError, match="dangling target"):
        _task_profile(dangling, "cmee")

    overlap = json.loads(json.dumps(document))
    overlap_packet = overlap["tasks"]["cmee"]["operator_contract"][
        "collaboration"
    ]["subagent_packets"][0]
    overlap_packet["selected_target_ids"].append("SCOPE.CMEE.TEST.ACTUAL")
    overlap_packet["selected_target_ids"].sort()
    with pytest.raises(
        ContextCompileError,
        match="selected/coverage overlap is unresolved",
    ):
        _task_profile(overlap, "cmee")


def test_unit_c_t43_non_cmee_profile_emits_exact9_without_cmee_compatibility(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_c_v2_profile(paths)
    task = "other_read_only"
    ephemeral_bundle = install_ephemeral_unit_c_fixture_task(
        paths, document, bundle, task=task
    )
    output = tmp_path / "non-cmee-output"
    compile_unit_c_fixture(
        paths,
        ephemeral_bundle,
        task=task,
        output=output,
    )
    manifest = verify_task_context(
        output,
        expected_unit_a=True,
        expected_unit_c=True,
        expected_task=task,
        expected_publication_mode="EPHEMERAL_VERIFY_ONLY",
    )
    expected_logical = {
        "selected_files.jsonl",
        "closure_edges.jsonl",
        "required_category_coverage.json",
        "unresolved_context.jsonl",
        "full_text_read_order.md",
        "operator_context.json",
        "pro_context.md",
        "ultra_context.md",
        "collaboration_packets.json",
    }
    assert set(manifest["output_sha256"]) == expected_logical
    assert manifest["unit_c_collaboration_support"]["logical_output_count"] == 9
    assert manifest["unit_c_collaboration_support"]["external_locator_count"] == 0
    assert not (output / "cmee_context_overview.md").exists()
    assert not (output / "cmee_unincorporated_actual_findings.md").exists()


def test_unit_c_t56_account_profile_read_only_preserves_explicit_gaps() -> None:
    repository_root = Path(__file__).resolve().parents[2]
    document = json.loads(
        (
            repository_root
            / "Cocolon_前提資料"
            / "system_context"
            / "task_profiles.json"
        ).read_text()
    )
    profile, is_v2 = _task_profile(document, "account_profile_read_only")
    assert is_v2 is True
    assert profile["publication_mode"] == "EPHEMERAL_VERIFY_ONLY"
    assert profile["required_category_exact"] == 2
    assert [len(rule["path_globs"]) for rule in profile["seed_rules"]] == [8, 5]
    contract = profile["operator_contract"]
    assert len(contract["canonical_owner_refs"]) == 2
    assert {row["remote_ref"] for row in contract["canonical_owner_refs"]} == {
        "refs/heads/main"
    }
    assert len(contract["document_responsibilities"]) == 13
    assert len(contract["connections"]) == 13
    assert contract["external_locators"] == []
    assert contract["actual_use_feedback"] == []
    assert len(contract["collaboration"]["subagent_packets"]) == 1
    packet = contract["collaboration"]["subagent_packets"][0]
    assert packet["prohibited_inference_codes"] == [
        "NO_ENDPOINT_GREEN_INFERENCE",
        "NO_MOUNT_STATUS_PROMOTION",
    ]
    assert packet["prohibited_effect_codes"] == [
        "NO_AUTH_TOKEN_OR_USER_DATA_ACCESS",
        "NO_DB_RN_API_OR_PERSISTENT_WRITE",
    ]
    assert all(row["endpoint_verification"] == "UNRESOLVED_RELATION" for row in contract["connections"])
    connection_ids = {row["connection_id"] for row in contract["connections"]}
    assert {
        "CONNECTION.ACCOUNT.API.APP_REGISTRATION",
        "CONNECTION.ACCOUNT.API.GET_HANDLER",
    }.issubset(connection_ids)
    gap = next(
        row
        for row in contract["scope_rules"]
        if row["scope_rule_id"] == "SCOPE.ACCOUNT.PROTECTED_GAP_001"
    )
    assert gap["target_symbol_or_route"] == "GET /account/profile/me"
    assert gap["changeability"] == "PROTECTED_REVIEW_REQUIRED"
    assert gap["write_target"] is False
    assert all(row["write_target"] is False for row in contract["scope_rules"])
    product_route = next(
        row
        for row in contract["claim_nodes"]
        if row["claim_kind"] == "PRODUCT_ROUTE"
    )
    assert product_route["adoption_state"] == "KAREN_PROPOSAL_NOT_MASH_DECISION"
    zero_effect = next(
        row
        for row in contract["claim_nodes"]
        if row["claim_kind"] == "ZERO_EFFECT_BOUNDARY"
    )
    assert zero_effect["asserted_value_code"] == (
        "NO_ENDPOINT_AUTH_DB_RN_OR_PERSISTENT_EFFECT"
    )

    implementation_contract = (
        repository_root
        / "Cocolon_前提資料"
        / "system_context"
        / "Cocolon_SystemContext_ImplementationContract_20260818.md"
    ).read_text()
    for required_boundary in (
        "RESOLVED_WITH_EXPLICIT_UNKNOWN_EDGES",
        "UNMOUNTED_ROUTER",
        "register_account_lifecycle_routes(app)",
        "ACCOUNT-PROTECTED-GAP-001",
        "product route GREEN claimは0",
    ):
        assert required_boundary in implementation_contract


def test_unit_c_t56_account_actual_proof_is_graph_bound_and_fail_closed(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    route_graph = paths["workspace"] / "route_graph"
    write_jsonl(
        route_graph / "rn_calls.jsonl",
        [
            {
                "call_id": "rn-account-profile-me",
                "method": "GET",
                "path": "screens/account/useAccountProfile.js",
                "normalized_path_candidates": ["/account/profile/me"],
            }
        ],
    )
    write_jsonl(
        route_graph / "api_routes.jsonl",
        [
            {
                "route_id": "api-account-profile-me",
                "method": "GET",
                "route_path": "/account/profile/me",
                "path": "ai/services/ai_inference/api_account_lifecycle.py",
                "mount_status": "UNMOUNTED_ROUTER",
            }
        ],
    )
    write_jsonl(
        route_graph / "cross_repository_route_edges.jsonl",
        [
            {
                "edge_id": "cross-account-profile-me",
                "method": "GET",
                "api_route_path": "/account/profile/me",
                "rn_source_path": "screens/account/useAccountProfile.js",
                "match_quality": "EXACT",
            }
        ],
    )
    backend_rows = [
        {
            "edge_id": "backend-account-auth",
            "route_id": "api-account-profile-me",
            "source_node": {"symbol": "_require_user_id"},
            "target_node": {"symbol": "_fetch_profile_me"},
            "resolution_status": "RESOLVED",
        },
        {
            "edge_id": "backend-account-fetch",
            "route_id": "api-account-profile-me",
            "source_node": {"symbol": "_fetch_profile_me"},
            "target_node": {"symbol": "_get_profile_row"},
            "resolution_status": "RESOLVED",
        },
        {
            "edge_id": "backend-account-db-read",
            "route_id": "api-account-profile-me",
            "source_node": {"symbol": "_get_profile_row"},
            "target_node": {"symbol": "_sb_get"},
            "resolution_status": "RESOLVED",
        },
        {
            "edge_id": "backend-account-unknown",
            "route_id": "api-account-profile-me",
            "source_node": {"symbol": "_fetch_profile_me"},
            "target_node": {"symbol": "HTTPException"},
            "resolution_status": "UNRESOLVED",
        },
    ]
    write_jsonl(route_graph / "backend_call_edges.jsonl", backend_rows)

    api_repo = tmp_path / "mashos-api"
    app_path = api_repo / "ai" / "services" / "ai_inference" / "app.py"
    app_path.parent.mkdir(parents=True)
    app_path.write_text(
        "def register_account_lifecycle_routes(value):\n"
        "    return value\n"
        "app = object()\n"
        "register_account_lifecycle_routes(app)\n",
        encoding="utf-8",
    )
    subprocess.run(["git", "init", "-q"], cwd=api_repo, check=True)
    subprocess.run(
        ["git", "config", "user.email", "test@example.invalid"],
        cwd=api_repo,
        check=True,
    )
    subprocess.run(
        ["git", "config", "user.name", "test"], cwd=api_repo, check=True
    )
    subprocess.run(["git", "add", "."], cwd=api_repo, check=True)
    subprocess.run(
        ["git", "commit", "-q", "-m", "account proof fixture"],
        cwd=api_repo,
        check=True,
    )
    app_commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=api_repo, text=True
    ).strip()
    app_blob = subprocess.check_output(
        [
            "git",
            "rev-parse",
            "HEAD:ai/services/ai_inference/app.py",
        ],
        cwd=api_repo,
        text=True,
    ).strip()
    app_record = FileRecord(
        identity="file-account-app",
        repository_key="mashos-api",
        path="ai/services/ai_inference/app.py",
        source_commit=app_commit,
        blob_sha=app_blob,
        content_sha256=hashlib.sha256(app_path.read_bytes()).hexdigest(),
        size_bytes=app_path.stat().st_size,
        inventory_classification="source",
        raw={},
    )
    selected_rows = [
        {
            "identity": app_record.identity,
            "repository_key": app_record.repository_key,
            "path": app_record.path,
            "source_commit": app_record.source_commit,
            "blob_sha": app_record.blob_sha,
        }
    ]
    repository_root = Path(__file__).resolve().parents[2]
    task_profiles = json.loads(
        (
            repository_root
            / "Cocolon_前提資料"
            / "system_context"
            / "task_profiles.json"
        ).read_text()
    )
    account_contract = task_profiles["tasks"]["account_profile_read_only"][
        "operator_contract"
    ]
    proof, blockers = _build_account_profile_actual_proof(
        workspace_dir=paths["workspace"],
        repository_roots={"mashos-api": api_repo},
        by_key={app_record.key: app_record},
        selected_rows=selected_rows,
        scope_rules=account_contract["scope_rules"],
    )
    assert proof["resolution_status"] == (
        "RESOLVED_WITH_EXPLICIT_UNKNOWN_EDGES"
    )
    assert proof["route_graph_evidence"]["backend_resolved_symbols"] == [
        "_fetch_profile_me",
        "_get_profile_row",
        "_require_user_id",
        "_sb_get",
    ]
    assert proof["route_graph_evidence"]["unresolved_backend_edge_ids"] == [
        "backend-account-unknown"
    ]
    assert proof["route_graph_evidence"]["unknown_edges_preserved"] is True
    assert proof["mount_evidence"]["route_graph_mount_status"] == (
        "UNMOUNTED_ROUTER"
    )
    assert proof["mount_evidence"]["registration_symbol_present"] is True
    assert proof["mount_evidence"]["direct_source_verification_status"] == (
        "DIRECT_SOURCE_SYMBOL_VERIFIED"
    )
    assert proof["protected_gap"] == {
        "gap_id": "ACCOUNT-PROTECTED-GAP-001",
        "reason_code": (
            "AUTH_SELF_FILTER_AND_DB_FIELD_ALLOWLIST_NOT_DIRECTLY_ENDPOINT_TESTED"
        ),
        "disposition": "PROTECTED_REVIEW_REQUIRED",
        "protected_scope_rule_ids": [
            "SCOPE.ACCOUNT.AUTH_DB.PROTECTED",
            "SCOPE.ACCOUNT.GET_HANDLER.PROTECTED",
            "SCOPE.ACCOUNT.PROTECTED_GAP_001",
        ],
        "handback_owner": "ACCOUNT_PUBLIC_API_OWNER",
    }
    assert proof["product_route_green_claim"] is False
    assert {
        "MOUNT_VERIFICATION_REQUIRES_DIRECT_SOURCE",
        "AUTH_SELF_FILTER_AND_DB_FIELD_ALLOWLIST_NOT_DIRECTLY_ENDPOINT_TESTED",
    } == set(blockers)

    output = paths["workspace"] / "task_context" / "account_profile_read_only"
    output.mkdir(parents=True)
    assert _validate_account_profile_actual_proof(
        proof, selected_rows, account_contract, output
    ) == set(blockers)

    tampered = json.loads(json.dumps(proof))
    tampered["product_route_green_claim"] = True
    with pytest.raises(
        ContextCompileError,
        match="account profile actual proof boundary violated",
    ):
        _validate_account_profile_actual_proof(
            tampered, selected_rows, account_contract, output
        )

    changed_rn_rows = [
        {
            "call_id": "rn-account-profile-me-moved",
            "method": "GET",
            "path": "screens/account/useAccountProfile.js",
            "normalized_path_candidates": ["/account/profile/me"],
        }
    ]
    write_jsonl(route_graph / "rn_calls.jsonl", changed_rn_rows)
    with pytest.raises(
        ContextCompileError,
        match="account profile route graph proof derivation mismatch",
    ):
        _validate_account_profile_actual_proof(
            proof, selected_rows, account_contract, output
        )


def test_unit_c_t74_machine_green_does_not_award_activation_or_credit(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_c_v2_profile(paths)
    compile_unit_c_fixture(paths, bundle)
    manifest = verify_task_context(paths["output"], expected_unit_c=True)
    summary = manifest["unit_c_collaboration_support"]
    assert summary["status"] == "UNIT_C_COLLABORATION_SUPPORT_READY"
    assert summary["completion_claim"] is None
    assert summary["v1_activation"] == 0
    assert summary["product_credit"] == 0
    assert summary["technical_credit"] == 0
    assert summary["automatic_progression"] is False
    assert manifest["product_credit"] == 0
    assert manifest["automatic_progression"] is False
    operator = json.loads(
        (paths["output"] / "operator_context.json").read_text()
    )
    assert operator["completion_gates"]["operator_v1_activation_approved"] is False


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


def _assert_json_pointer_result_does_not_leak(
    result: object, *forbidden_values: str
) -> None:
    serialized = json.dumps(result, ensure_ascii=False, sort_keys=True)
    assert "actual_value" not in serialized
    for value in forbidden_values:
        assert value not in serialized
    assert isinstance(result, dict)
    assert set(result) == {"status", "reason_code", "assertions"}
    assert all(
        set(row)
        == {
            "metadata_kind",
            "metadata_key",
            "verification_status",
            "reason_code",
        }
        for row in result["assertions"]
    )


def test_unit_a_json_pointer_match_returns_only_declared_verification() -> None:
    hidden = "PRIVATE_UNDECLARED_MATCH_VALUE"
    result = parse_restricted_json_pointer_assertions(
        json.dumps(
            {"declared": "PUBLIC_EXPECTED", "undeclared": hidden}
        ).encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/declared",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "VERIFIED"
    assert result["assertions"][0]["verification_status"] == "MATCH"
    assert (
        result["assertions"][0]["reason_code"]
        == "DECLARED_JSON_POINTER_VALUE_MATCH"
    )
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_json_pointer_mismatch_does_not_return_actual_value() -> None:
    private_actual = "PRIVATE_ACTUAL_MISMATCH_VALUE"
    hidden = "PRIVATE_UNDECLARED_MISMATCH_VALUE"
    result = parse_restricted_json_pointer_assertions(
        json.dumps(
            {"declared": private_actual, "undeclared": hidden}
        ).encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/declared",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "VERIFIED"
    assert result["assertions"][0]["verification_status"] == "MISMATCH"
    assert (
        result["assertions"][0]["reason_code"]
        == "DECLARED_METADATA_ASSERTION_MISMATCH"
    )
    _assert_json_pointer_result_does_not_leak(result, private_actual, hidden)


def test_unit_a_json_pointer_missing_target_is_unresolved_without_leak() -> None:
    hidden = "PRIVATE_UNDECLARED_MISSING_VALUE"
    result = parse_restricted_json_pointer_assertions(
        json.dumps({"undeclared": hidden}).encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/missing",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_POINTER_TARGET_UNRESOLVED"
    assert result["assertions"][0]["verification_status"] == "UNRESOLVED"
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_json_pointer_duplicate_key_fails_closed_without_leak() -> None:
    first = "PRIVATE_DUPLICATE_FIRST"
    second = "PRIVATE_DUPLICATE_SECOND"
    result = parse_restricted_json_pointer_assertions(
        (
            '{"declared":"'
            + first
            + '","declared":"'
            + second
            + '"}'
        ).encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/declared",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_METADATA_DUPLICATE_KEY"
    _assert_json_pointer_result_does_not_leak(result, first, second)


def test_unit_a_json_pointer_depth_over_16_fails_closed_without_leak() -> None:
    hidden = "PRIVATE_DEPTH_LEAF"
    document: object = hidden
    for _index in range(17):
        document = {"nested": document}
    result = parse_restricted_json_pointer_assertions(
        json.dumps(document).encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/nested",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_METADATA_DEPTH_EXCEEDED"
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_json_pointer_over_64_kib_fails_closed_without_leak() -> None:
    hidden = "PRIVATE_OVERSIZE_ACTUAL"
    body = json.dumps(
        {"declared": hidden, "padding": "x" * (64 * 1024)}
    ).encode("utf-8")
    assert len(body) > 64 * 1024
    result = parse_restricted_json_pointer_assertions(
        body,
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/declared",
                "expected_value": "PUBLIC_EXPECTED",
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_METADATA_BYTE_BUDGET_EXCEEDED"
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_json_pointer_exponent_overflow_fails_closed_without_leak() -> None:
    hidden = "PRIVATE_OVERFLOW"
    result = parse_restricted_json_pointer_assertions(
        ('{"x":1e9999,"hidden":"' + hidden + '"}').encode("utf-8"),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/x",
                "expected_value": 1,
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_METADATA_PARSE_FAILED"
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_json_pointer_huge_integer_fails_closed_without_leak() -> None:
    hidden = "PRIVATE_HUGE_INTEGER"
    result = parse_restricted_json_pointer_assertions(
        ('{"x":' + ("9" * 5000) + ',"hidden":"' + hidden + '"}').encode(
            "utf-8"
        ),
        [
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": "/x",
                "expected_value": 1,
            }
        ],
    )
    assert result["status"] == "UNRESOLVED_METADATA"
    assert result["reason_code"] == "JSON_METADATA_PARSE_FAILED"
    _assert_json_pointer_result_does_not_leak(result, hidden)


def test_unit_a_v2_accepts_exact1_exact7_exact21(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    profile, is_v2 = _task_profile(document, "cmee")
    contract = profile["operator_contract"]
    assert is_v2 is True
    assert len(contract["canonical_owner_refs"]) == 1
    assert len(contract["required_premises"]) == 7
    assert len(contract["document_responsibilities"]) == 21


@pytest.mark.parametrize(
    ("boundary", "error"),
    [
        ("tasks33", r"tasks must contain 1\.\.32 rows"),
        ("owners9", r"canonical_owner_refs must contain 1\.\.8 rows"),
        ("premises257", r"required_premises exceeds 256 rows"),
        (
            "responsibilities0",
            r"document_responsibilities must contain 1\.\.512 rows",
        ),
        (
            "responsibilities513",
            r"document_responsibilities must contain 1\.\.512 rows",
        ),
    ],
)
def test_unit_a_v2_rejects_cardinality_boundaries(
    tmp_path: Path, boundary: str, error: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    if boundary == "tasks33":
        for index in range(1, 33):
            document["tasks"][f"task{index:02d}"] = {}
    elif boundary == "owners9":
        contract["canonical_owner_refs"] = contract["canonical_owner_refs"] * 9
    elif boundary == "premises257":
        contract["required_premises"] = contract["required_premises"] * 37
    elif boundary == "responsibilities0":
        contract["document_responsibilities"] = []
    elif boundary == "responsibilities513":
        contract["document_responsibilities"] = (
            contract["document_responsibilities"] * 25
        )[:513]
    else:  # pragma: no cover - parameter list is closed above
        raise AssertionError(boundary)
    with pytest.raises(ContextCompileError, match=error):
        _task_profile(document, "cmee")


def test_unit_a_v2_rejects_non_boolean_required(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    owner = document["tasks"]["cmee"]["operator_contract"][
        "canonical_owner_refs"
    ][0]
    owner["required"] = 1
    with pytest.raises(ContextCompileError, match=r"required must be boolean"):
        _task_profile(document, "cmee")


def test_unit_a_v2_rejects_unknown_row_field_without_value_leak(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    owner = document["tasks"]["cmee"]["operator_contract"][
        "canonical_owner_refs"
    ][0]
    private_value = "PRIVATE_UNKNOWN_ROW_VALUE"
    owner["unexpected_field"] = private_value
    with pytest.raises(ContextCompileError, match=r"canonical owner row keys mismatch") as exc:
        _task_profile(document, "cmee")
    assert private_value not in str(exc.value)


@pytest.mark.parametrize("target", ["document", "selected_task", "other_task"])
def test_unit_a_v2_rejects_unknown_document_or_task_fields(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    if target == "document":
        document["unexpected"] = "PRIVATE_VALUE"
    elif target == "selected_task":
        document["tasks"]["cmee"]["unexpected"] = "PRIVATE_VALUE"
    else:
        other = json.loads(json.dumps(document["tasks"]["cmee"]))
        other["publication_mode"] = "EPHEMERAL_VERIFY_ONLY"
        other["unexpected"] = "PRIVATE_VALUE"
        document["tasks"]["other"] = other
    with pytest.raises(ContextCompileError, match=r"keys mismatch") as exc:
        _task_profile(document, "cmee")
    assert "PRIVATE_VALUE" not in str(exc.value)


def test_unit_a_v2_rejects_nested_private_locator_without_value_leak(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    locator = document["tasks"]["cmee"]["operator_contract"][
        "canonical_owner_refs"
    ][0]["source_locator"]
    private_value = "PRIVATE_NESTED_LOCATOR_VALUE"
    locator["section_locator"] = {
        "audit": [{"nested_token": private_value}]
    }
    with pytest.raises(ContextCompileError, match=r"forbidden private field") as exc:
        _task_profile(document, "cmee")
    assert private_value not in str(exc.value)


@pytest.mark.parametrize(
    "target",
    [
        "owner_section",
        "owner_source_path",
        "owner_public_pr",
        "premise_path",
        "responsibility_subject_path",
    ],
)
def test_unit_a_v2_rejects_non_string_public_locator_fields_without_leak(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    contract = document["tasks"]["cmee"]["operator_contract"]
    private_value = "PRIVATE_PUBLIC_LOCATOR_SENTINEL"
    forged = {"note": private_value}
    owner = contract["canonical_owner_refs"][0]
    if target == "owner_section":
        owner["source_locator"]["section_locator"] = forged
    elif target == "owner_source_path":
        owner["source_locator"]["path"] = forged
    elif target == "owner_public_pr":
        owner["public_pr_number_or_locator"] = forged
    elif target == "premise_path":
        contract["required_premises"][0]["path"] = forged
    else:
        contract["document_responsibilities"][0]["subject_locator"]["path"] = forged
    with pytest.raises(ContextCompileError) as exc:
        _task_profile(document, "cmee")
    assert private_value not in str(exc.value)


@pytest.mark.parametrize(
    "unsafe_path",
    [
        "docs//premise.md",
        "docs/./premise.md",
        "./docs/premise.md",
        "docs/premise.md/",
        "docs/premise.md?token=PRIVATE_PATH_SENTINEL",
    ],
)
def test_unit_a_v2_rejects_noncanonical_or_sensitive_repo_paths_without_leak(
    tmp_path: Path, unsafe_path: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    document["tasks"]["cmee"]["operator_contract"]["required_premises"][0][
        "path"
    ] = unsafe_path
    with pytest.raises(ContextCompileError, match=r"unsafe|sensitive") as exc:
        _task_profile(document, "cmee")
    assert "PRIVATE_PATH_SENTINEL" not in str(exc.value)


@pytest.mark.parametrize(
    "unsafe_ref",
    [
        "refs/heads/foo.",
        "refs/heads/foo/",
        "refs/heads/foo/.hidden",
        "refs/heads/foo/bar.lock",
    ],
)
def test_unit_a_v2_rejects_git_invalid_owner_refs(
    tmp_path: Path, unsafe_ref: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    document["tasks"]["cmee"]["operator_contract"]["canonical_owner_refs"][0][
        "remote_ref"
    ] = unsafe_ref
    with pytest.raises(ContextCompileError, match=r"unsafe canonical owner ref"):
        _task_profile(document, "cmee")


@pytest.mark.parametrize(
    "target",
    ["persistent_primary_task", "publication_mode", "read_tier", "required_roles"],
)
def test_unit_a_v2_invalid_json_types_fail_as_context_errors(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    profile = document["tasks"]["cmee"]
    if target == "persistent_primary_task":
        document["persistent_primary_task"] = True
    elif target == "publication_mode":
        profile["publication_mode"] = {"invalid": True}
    elif target == "read_tier":
        profile["operator_contract"]["required_premises"][0]["read_tier"] = []
    else:
        profile["operator_contract"]["required_premises"][0]["required_roles"] = [
            {"invalid": True}
        ]
    with pytest.raises(ContextCompileError):
        _task_profile(document, "cmee")


def test_unit_a_v2_boolean_metadata_assertion_rejects_integer_expected_value(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    assertion = {
        "metadata_kind": "FRONT_MATTER",
        "metadata_key": "automatic_progression",
        "expected_value": 0,
    }
    document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ][0]["metadata_assertions"] = [assertion]
    with pytest.raises(
        ContextCompileError,
        match=r"boolean front matter assertion requires boolean expected_value",
    ):
        _task_profile(document, "cmee")


def test_unit_a_v2_rejects_sensitive_expected_metadata_without_leak(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    sensitive = "private.person@example.com"
    assertion = {
        "metadata_kind": "FRONT_MATTER",
        "metadata_key": "decision_owner",
        "expected_value": sensitive,
    }
    document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ][0]["metadata_assertions"] = [assertion]
    with pytest.raises(ContextCompileError) as exc:
        _task_profile(document, "cmee")
    assert sensitive not in str(exc.value)


@pytest.mark.parametrize(
    "unsafe_item",
    [
        "&owner DOC.OLD",
        "*owner",
        "!tag DOC.OLD",
        "[DOC.NESTED]",
    ],
)
def test_unit_a_front_matter_rejects_unsafe_inline_yaml_list_items(
    unsafe_item: str,
) -> None:
    parsed = parse_restricted_front_matter(
        (
            "---\n"
            f"supersedes: [{unsafe_item}]\n"
            "automatic_progression: false\n"
            "---\n"
            "body must not be returned\n"
        ).encode("utf-8")
    )
    assert parsed["status"] == "UNRESOLVED_METADATA"
    assert "UNSUPPORTED_YAML_FEATURE_IN_FRONT_MATTER_LIST" in parsed["reason_code"]
    assert parsed["fields"] == {}


@pytest.mark.parametrize(
    ("forgery", "error"),
    [
        ("fingerprint", r"fingerprint mismatch"),
        ("identity", r"canonical owner blob mismatch"),
    ],
)
def test_unit_a_forged_owner_bundle_rejected_without_mutating_sentinel(
    tmp_path: Path, forgery: str, error: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    bundle["premises"][0]["resolved_blob_sha"] = "f" * 40
    if forgery == "identity":
        bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(
            bundle
        )
    output = tmp_path / "sentinel-output"
    output.mkdir()
    sentinel = output / "sentinel.txt"
    sentinel.write_text("last-good\n", encoding="utf-8")
    with pytest.raises(ContextCompileError, match=error):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=output,
            canonical_owner_bundle=bundle,
        )
    assert sentinel.read_text(encoding="utf-8") == "last-good\n"
    assert sorted(item.name for item in output.iterdir()) == ["sentinel.txt"]


def test_unit_a_full_model_is_serialized_and_bound_in_manifest(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest = verify_task_context(output)
    model = manifest["unit_a_premise_management"]
    assert {
        "task_orientation",
        "owners",
        "premises",
        "responsibilities",
        "conflicts",
        "bindings_by_identity",
        "blocking_codes",
        "completion_claim",
        "v1_activation",
        "product_credit",
        "technical_credit",
        "automatic_progression",
    } <= set(model)
    assert len(model["owners"]) == 1
    assert len(model["premises"]) == 7
    assert len(model["responsibilities"]) == 21
    assert model["required_premise_count"] == 7
    assert model["required_premise_resolved_count"] == 7
    assert model["responsibility_count"] == 21
    identity_model = dict(model)
    for key in (
        "required_premise_count",
        "required_premise_resolved_count",
        "responsibility_count",
        "conflict_count",
    ):
        identity_model.pop(key)
    assert hashlib.sha256(canonical(identity_model)).hexdigest() == manifest[
        "input_sha256"
    ]["unit_a_model"]


def test_unit_a_manifest_model_tamper_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["unit_a_premise_management"]["responsibilities"][0][
        "lifecycle"
    ] = "SUPERSEDED"
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"Unit A premise model tamper"):
        verify_task_context(output)


@pytest.mark.parametrize(
    ("field", "forged_value"),
    [
        ("status", "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"),
        ("completion_claim", "FORGED_COMPLETE"),
        ("product_credit", 1),
        ("automatic_progression", True),
    ],
)
def test_unit_a_manifest_top_level_activation_tamper_is_rejected(
    tmp_path: Path, field: str, forged_value: object
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest[field] = forged_value
    write_json(manifest_path, manifest)
    with pytest.raises(
        ContextCompileError,
        match=r"Unit A top-level activation or completion boundary violated",
    ):
        verify_task_context(output)


def test_unit_a_manifest_operator_activation_gate_tamper_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["completion_gates"]["operator_v1_activation_approved"] = True
    write_json(manifest_path, manifest)
    with pytest.raises(
        ContextCompileError,
        match=r"Unit A top-level activation or completion boundary violated",
    ):
        verify_task_context(output)


@pytest.mark.parametrize(
    ("field", "forged_value"),
    [
        ("v1_activation", False),
        ("product_credit", 0.0),
        ("technical_credit", False),
    ],
)
def test_unit_a_manifest_self_consistent_noninteger_zero_is_rejected(
    tmp_path: Path, field: str, forged_value: object
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    model = manifest["unit_a_premise_management"]
    model[field] = forged_value
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(
        ContextCompileError,
        match=r"Unit A activation or authority boundary violated",
    ):
        verify_task_context(output)


@pytest.mark.parametrize(
    "target",
    [
        "merge_required",
        "rebase_required",
        "owner_access_mode",
        "owner_write_authority",
        "responsibility_effective_authority",
        "orientation_authority",
        "metadata_automatic_progression",
        "metadata_assertion_automatic_progression",
    ],
)
def test_unit_a_manifest_self_consistent_deep_authority_forge_is_rejected(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    model = manifest["unit_a_premise_management"]
    if target in {"merge_required", "rebase_required"}:
        model[target] = True
    elif target == "owner_access_mode":
        model["owner_access_mode"] = "WRITE"
    elif target == "owner_write_authority":
        model["owners"][0]["write_authority"] = True
    elif target == "responsibility_effective_authority":
        model["responsibilities"][0]["effective_authority_claim"] = True
    elif target == "metadata_automatic_progression":
        model["responsibilities"][0]["metadata"]["fields"][
            "automatic_progression"
        ] = True
    elif target == "metadata_assertion_automatic_progression":
        model["responsibilities"][0]["metadata_assertions"].append(
            {
                "metadata_kind": "FRONT_MATTER",
                "metadata_key": "automatic_progression",
                "expected_value": True,
            }
        )
    else:
        model["task_orientation"]["authority_claim"] = True
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"violated"):
        verify_task_context(output)


@pytest.mark.parametrize(
    "target",
    [
        "required_premise_unselected",
        "blocking_code_without_blocked_status",
        "duplicate_responsibility",
        "publication_mode_downgrade",
        "workspace_blob_match_lie",
        "duplicate_premise_order",
        "workspace_identity_delete",
        "workspace_identity_forge",
        "responsibility_owner_unresolved",
    ],
)
def test_unit_a_manifest_self_consistent_readiness_forge_is_rejected(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    model = manifest["unit_a_premise_management"]
    if target == "required_premise_unselected":
        model["premises"][0]["selected"] = False
    elif target == "blocking_code_without_blocked_status":
        model["blocking_codes"] = ["REQUIRED_PREMISE_UNRESOLVED"]
    elif target == "duplicate_responsibility":
        model["responsibilities"].append(
            json.loads(json.dumps(model["responsibilities"][0]))
        )
        model["responsibility_count"] += 1
    elif target == "publication_mode_downgrade":
        model["publication_mode"] = "EPHEMERAL_VERIFY_ONLY"
    elif target == "workspace_blob_match_lie":
        model["premises"][0]["workspace_blob_sha"] = "f" * 40
    elif target == "duplicate_premise_order":
        model["premises"][0]["entry_chain_order"] = model["premises"][1][
            "entry_chain_order"
        ]
        model["premises"][0]["owner_read_order"] = model["premises"][1][
            "owner_read_order"
        ]
    elif target == "workspace_identity_delete":
        for key in (
            "workspace_record_identity",
            "workspace_inventory_source_commit",
            "workspace_blob_sha",
            "workspace_blob_matches_owner",
            "workspace_selection_status",
        ):
            model["premises"][0].pop(key)
    elif target == "workspace_identity_forge":
        model["premises"][0]["workspace_record_identity"] = "file:FORGED"
    else:
        model["responsibilities"][0]["resolved_owner_commit"] = None
        model["responsibilities"][0]["resolved_owner_blob_sha"] = None
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError):
        verify_task_context(output)


def test_unit_a_ephemeral_profile_uses_bounded_contract_cardinality(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, bundle = make_unit_a_v2_profile(paths)
    auxiliary = json.loads(json.dumps(document["tasks"]["cmee"]))
    auxiliary["publication_mode"] = "EPHEMERAL_VERIFY_ONLY"
    auxiliary["task_orientation"] = "auxiliary bounded verification"
    auxiliary["operator_contract"]["required_premises"] = []
    auxiliary["operator_contract"]["document_responsibilities"] = auxiliary[
        "operator_contract"
    ]["document_responsibilities"][:1]
    document["tasks"]["aux"] = auxiliary
    write_json(paths["task_profiles"], document)
    auxiliary_bundle = json.loads(json.dumps(bundle))
    auxiliary_bundle["task"] = "aux"
    auxiliary_bundle["premises"] = []
    auxiliary_bundle["responsibility_subjects"] = auxiliary_bundle[
        "responsibility_subjects"
    ][:1]
    owner = auxiliary_bundle["owners"][0]
    namespace = _expected_owner_namespace("aux", owner["owner_id"])
    owner["namespace"] = namespace
    subprocess.run(
        [
            "git",
            "-C",
            str(paths["root"]),
            "update-ref",
            namespace,
            owner["first_resolved_head"],
        ],
        check=True,
    )
    auxiliary_bundle["task_dependency_fingerprint"] = (
        canonical_owner_bundle_fingerprint(auxiliary_bundle)
    )
    output = tmp_path / "aux-output"
    result = compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="aux",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=auxiliary_bundle,
    )
    assert result.status == "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    manifest = verify_task_context(
        output,
        expected_unit_a=True,
        expected_task="aux",
        expected_publication_mode="EPHEMERAL_VERIFY_ONLY",
    )
    assert manifest["unit_a_premise_management"]["publication_mode"] == (
        "EPHEMERAL_VERIFY_ONLY"
    )
    assert manifest["unit_a_premise_management"]["required_premise_count"] == 0
    assert manifest["unit_a_premise_management"]["responsibility_count"] == 1


def test_unit_a_manifest_workspace_exact_ref_tamper_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["workspace_exact_refs"]["Cocolon"]["source_commit"] = "f" * 40
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError):
        verify_task_context(output)


def test_unit_a_manifest_self_consistent_public_secret_forge_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["unit_a_premise_management"]["owners"][0]["responsibility"] = (
        "ghp_" + "A" * 40
    )
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"sensitive public metadata value"):
        verify_task_context(output)


@pytest.mark.parametrize(
    "target",
    [
        "owner_relation",
        "supersession",
        "authority_kind",
        "lifecycle",
        "authority_role_declared",
    ],
)
def test_unit_a_manifest_self_consistent_relation_forge_is_rejected(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    model = manifest["unit_a_premise_management"]
    if target == "owner_relation":
        model["owners"][0]["relation"] = "DIVERGED"
    elif target == "supersession":
        first, second = model["responsibilities"][:2]
        first["supersedes"] = [second["responsibility_id"]]
    elif target == "authority_kind":
        model["responsibilities"][0]["authority_kind"] = "WRITE_AUTHORITY"
    elif target == "lifecycle":
        model["responsibilities"][0]["lifecycle"] = "WRITE_ENABLED"
    else:
        value = model["responsibilities"][0]["authority_role_declared"]
        model["responsibilities"][0]["authority_role_declared"] = not value
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError):
        verify_task_context(output)


def test_unit_a_trusted_mode_rejects_complete_marker_strip(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    selected_path = output / "selected_files.jsonl"
    selected_rows = read_jsonl(selected_path)
    for row in selected_rows:
        for key in (
            "classification_provenance",
            "authority_claim",
            "responsibility_ids",
            "conflict_ids",
            "selection_tier",
            "non_proof_boundaries",
        ):
            row.pop(key)
    write_jsonl(selected_path, selected_rows)
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest.pop("unit_a_premise_management")
    inputs = manifest["input_sha256"]
    inputs.pop("owner_bundle")
    inputs.pop("unit_a_model")
    manifest["completion_gates"].pop("operator_v1_activation_approved")
    manifest["output_sha256"]["selected_files.jsonl"] = sha(selected_path)
    payload = {
        "workspace": manifest["workspace"],
        "task": manifest["task"],
        "step1_manifest_sha256": inputs["step1_manifest"],
        "step1_files_sha256": inputs["step1_files"],
        "step2_manifest_sha256": inputs["step2_manifest"],
        "step3_manifest_sha256": inputs["step3_manifest"],
        "publication_transport_sha256": inputs.get("publication_transport"),
        "workspace_profiles_sha256": inputs["workspace_profiles"],
        "task_profile_sha256": inputs["task_profile"],
        "manual_overlay_sha256": inputs["manual_overlay"],
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(manifest["output_sha256"].items())),
    }
    manifest["context_fingerprint"] = hashlib.sha256(canonical(payload)).hexdigest()
    write_json(manifest_path, manifest)
    with pytest.raises(
        ContextCompileError, match=r"expected Unit A artifact markers are missing"
    ):
        verify_task_context(
            output,
            expected_unit_a=True,
            expected_task="cmee",
            expected_publication_mode="PERSISTENT_PRIMARY",
        )


def test_unit_a_trusted_mode_rejects_task_rename(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["task"] = "aux"
    manifest["unit_a_premise_management"]["publication_mode"] = (
        "EPHEMERAL_VERIFY_ONLY"
    )
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"trusted task mismatch"):
        verify_task_context(
            output,
            expected_unit_a=True,
            expected_task="cmee",
            expected_publication_mode="PERSISTENT_PRIMARY",
        )


@pytest.mark.parametrize("target", ["owner_bundle_downgrade", "remote_gate"])
def test_unit_a_manifest_presence_and_gate_tamper_is_rejected(
    tmp_path: Path, target: str
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if target == "owner_bundle_downgrade":
        manifest["input_sha256"]["owner_bundle"] = None
        resign_unit_a_manifest(output, manifest)
    else:
        manifest["completion_gates"]["generated_output_remote_hash_verified"] = True
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError):
        verify_task_context(output)


def test_unit_a_selected_row_must_match_identity_binding_and_tier(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    selected_path = output / "selected_files.jsonl"
    selected_rows = read_jsonl(selected_path)
    target = next(row for row in selected_rows if row["responsibility_ids"])
    target["responsibility_ids"] = []
    target["selection_tier"] = "REFERENCE_ON_TRIGGER"
    write_jsonl(selected_path, selected_rows)
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["output_sha256"]["selected_files.jsonl"] = sha(selected_path)
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError):
        verify_task_context(output)


def test_unit_a_manifest_rejects_unknown_top_level_authority_field(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["write_authority"] = True
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"context manifest keys mismatch"):
        verify_task_context(output)


def test_unit_a_selected_row_self_consistent_authority_forge_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    selected_path = output / "selected_files.jsonl"
    selected_rows = read_jsonl(selected_path)
    selected_rows[0]["authority_claim"] = True
    write_jsonl(selected_path, selected_rows)
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["output_sha256"]["selected_files.jsonl"] = sha(selected_path)
    resign_unit_a_manifest(output, manifest)
    write_json(manifest_path, manifest)
    with pytest.raises(
        ContextCompileError,
        match=r"selected-row authority boundary violated",
    ):
        verify_task_context(output)


def test_unit_a_supersession_dangling_edge_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    responsibilities = document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ]
    responsibilities[0]["supersedes"] = ["RESP.CMEE.DOES.NOT.EXIST"]
    with pytest.raises(ContextCompileError, match=r"dangling supersession"):
        _task_profile(document, "cmee")


def test_unit_a_supersession_nonreciprocal_edge_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    responsibilities = document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ]
    responsibilities[0]["supersedes"] = [responsibilities[1]["responsibility_id"]]
    with pytest.raises(ContextCompileError, match=r"non-reciprocal supersession"):
        _task_profile(document, "cmee")


def test_unit_a_supersession_reciprocal_cycle_is_rejected(tmp_path: Path) -> None:
    paths = make_fixture(tmp_path / "repo")
    document, _bundle = make_unit_a_v2_profile(paths)
    responsibilities = document["tasks"]["cmee"]["operator_contract"][
        "document_responsibilities"
    ]
    first, second = responsibilities[:2]
    first["supersedes"] = [second["responsibility_id"]]
    first["superseded_by"] = [second["responsibility_id"]]
    second["supersedes"] = [first["responsibility_id"]]
    second["superseded_by"] = [first["responsibility_id"]]
    with pytest.raises(ContextCompileError, match=r"supersession cycle"):
        _task_profile(document, "cmee")


def test_unit_a_manifest_convenience_count_tamper_is_rejected(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    output = tmp_path / "unit-a-output"
    compile_task_context(
        repo_root=paths["root"],
        system_context_root=paths["system"],
        workspace="cmee_working",
        task="cmee",
        task_profiles_path=paths["task_profiles"],
        manual_overlay_path=None,
        output_dir=output,
        canonical_owner_bundle=bundle,
    )
    manifest_path = output / "context_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["unit_a_premise_management"]["responsibility_count"] += 1
    write_json(manifest_path, manifest)
    with pytest.raises(ContextCompileError, match=r"Unit A premise model count mismatch"):
        verify_task_context(output)


def test_unit_a_rejects_recomputed_bundle_with_forged_metadata(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    bundle["premises"][0]["metadata"]["fields"]["document_id"] = "DOC.FORGED"
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(bundle)
    with pytest.raises(ContextCompileError, match=r"canonical premise metadata mismatch"):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=tmp_path / "must-not-publish",
            canonical_owner_bundle=bundle,
        )
    assert not (tmp_path / "must-not-publish").exists()


def test_unit_a_rejects_recomputed_bundle_with_forged_owner_evidence(
    tmp_path: Path,
) -> None:
    paths = make_fixture(tmp_path / "repo")
    _document, bundle = make_unit_a_v2_profile(paths)
    bundle["owners"][0]["workspace_side_unique_commit_count"] += 1
    bundle["task_dependency_fingerprint"] = canonical_owner_bundle_fingerprint(bundle)
    with pytest.raises(ContextCompileError, match=r"unique-commit count mismatch"):
        compile_task_context(
            repo_root=paths["root"],
            system_context_root=paths["system"],
            workspace="cmee_working",
            task="cmee",
            task_profiles_path=paths["task_profiles"],
            manual_overlay_path=None,
            output_dir=tmp_path / "must-not-publish",
            canonical_owner_bundle=bundle,
        )
    assert not (tmp_path / "must-not-publish").exists()
