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
    _expected_owner_namespace,
    _task_profile,
    _validate_workspace_refs,
    build_premise_management_model,
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


def test_repository_task_profile_has_exact10_and_exact_external_assets() -> None:
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
