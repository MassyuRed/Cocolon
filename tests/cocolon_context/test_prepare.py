from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import types
from pathlib import Path
import unittest
from unittest import mock

from tools.cocolon_context_inventory import stable_file_identity

# The focused scratch test can run without copying the large Step 4 compiler;
# the repository test run imports the real module and does not take this branch.
try:
    import tools.cocolon_context_task  # noqa: F401
except ModuleNotFoundError:
    stub = types.ModuleType("tools.cocolon_context_task")
    stub.ContextCompileError = RuntimeError
    stub.PROFILE_SCHEMA_VERSION = "cocolon.system_context.task_profiles.v2"
    stub.PROFILE_SCHEMA_VERSION_V1 = "cocolon.system_context.task_profiles.v1"
    stub.OPERATOR_CONTRACT_UNIT_C_KEYS = frozenset(
        {
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
    )
    stub.UNIT_C_CMEE_OUTPUT_NAMES = (
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
    )
    stub.UNIT_C_NON_CMEE_OUTPUT_NAMES = (
        "selected_files.jsonl",
        "closure_edges.jsonl",
        "required_category_coverage.json",
        "unresolved_context.jsonl",
        "full_text_read_order.md",
        "operator_context.json",
        "pro_context.md",
        "ultra_context.md",
        "collaboration_packets.json",
    )
    import re as _re
    stub.SAFE_GIT_REF_RE = _re.compile(r"^refs/heads/.+$")
    stub.SAFE_PUBLIC_ID_RE = _re.compile(r"^[A-Z][A-Z0-9_.:-]{0,127}$")
    stub._git_blob_prefix = lambda *_args, **_kwargs: b""
    stub._require_safe_git_ref = lambda value, _field: str(value)
    stub._require_safe_repo_path = lambda value, _field: str(value)
    stub._task_profile = lambda document, task: (document["tasks"][task], False)
    stub.compile_task_context = lambda **_: None
    stub.parse_restricted_front_matter = lambda *_args, **_kwargs: {}
    stub.verify_task_context = lambda *_args, **_kwargs: {}
    sys.modules["tools.cocolon_context_task"] = stub

from tools.cocolon_context import build_parser
from tools.cocolon_context_prepare import (
    Change,
    PrepareError,
    RepositoryRef,
    _bind_document_responsibilities,
    _bind_required_premises,
    _derive_reverse_dependents,
    _diff_changes,
    _exclude_partial_scope_unmatched_documents,
    _iter_jsonl,
    _merge_code_partition,
    _merge_route_candidate,
    _canonical_github_url,
    _classify_owner_relation,
    _owner_namespace,
    _publication_marker,
    _publication_paths,
    _publish_workspace_candidate,
    _recover_workspace_publication,
    _validate_terminal_task_receipt,
    _verify_task,
    _workspace_publication_identity,
    _write_publication_marker,
    finalize_canonical_owner_bundle,
    prepare,
    resolve_canonical_owner_bundle_initial,
    effective_material_commit,
    plan_refresh,
)


def git(repo: Path, *args: str) -> str:
    process = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return process.stdout.strip()


class PreparePlannerTests(unittest.TestCase):
    def test_same_ref_is_noop(self) -> None:
        plan = plan_refresh([])
        self.assertEqual(plan["execution_mode"], "SAME_REF_REUSE")
        self.assertEqual(plan["changed_path_count"], 0)
        self.assertEqual(plan["requested_affected_layers"], [])
        self.assertEqual(plan["executed_layers"], [])

    def test_non_code_updates_inventory_and_task_with_semantic_reuse(self) -> None:
        plan = plan_refresh([
            Change("Cocolon", "MODIFIED", None, "Cocolon_前提資料/current_structure/readme.md")
        ])
        self.assertEqual(plan["requested_affected_layers"], ["inventory", "task_context"])
        self.assertEqual(plan["executed_layers"], ["inventory", "task_context"])
        self.assertEqual(plan["execution_mode"], "INCREMENTAL_NON_CODE_REBIND")
        self.assertEqual(plan["fallback_reasons"], [])
        self.assertIn("NON_CODE_CHANGE", plan["classification_reasons"])

    def test_add_delete_and_rename_never_use_non_code_incremental_path(self) -> None:
        for status in ("ADDED", "DELETED", "RENAMED", "TYPE_CHANGED"):
            with self.subTest(status=status):
                plan = plan_refresh([
                    Change("Cocolon", status, "docs/old.md", "docs/new.md")
                ])
                self.assertEqual(plan["execution_mode"], "FULL_REBUILD_FALLBACK")

    def test_commit_independent_file_identity(self) -> None:
        common = {
            "workspace_repository_key": "Cocolon",
            "path": "docs/readme.md",
            "object_mode": "100644",
            "object_type": "blob",
            "content_sha256": "a" * 64,
        }
        before = {**common, "source_commit": "1" * 40}
        after = {**common, "source_commit": "2" * 40}
        changed = {**after, "content_sha256": "b" * 64}
        self.assertEqual(stable_file_identity(before), stable_file_identity(after))
        self.assertNotEqual(stable_file_identity(after), stable_file_identity(changed))

    def test_rn_and_backend_changes_invalidate_route_closure(self) -> None:
        plan = plan_refresh([
            Change("Cocolon", "MODIFIED", None, "src/screens/HomeScreen.tsx"),
            Change("mashos-api", "RENAMED", "ai/services/old.py", "ai/services/engine.py"),
        ])
        self.assertEqual(
            plan["requested_affected_layers"],
            ["code_index", "inventory", "route_graph", "task_context"],
        )
        self.assertEqual(plan["detected_change_kinds"], ["MODIFIED", "RENAMED"])

    def test_toolchain_change_requires_full_rebuild_reason(self) -> None:
        plan = plan_refresh([
            Change("Cocolon", "TYPE_CHANGED", None, "tools/cocolon_context.py")
        ])
        self.assertIn("TOOLCHAIN_SCHEMA_OR_PROFILE_CHANGE", plan["classification_reasons"])
        self.assertTrue(plan["fallback_reasons"])

    def test_modified_source_uses_dependent_closure_incremental(self) -> None:
        plan = plan_refresh([
            Change("Cocolon", "MODIFIED", None, "lib/api/home/emotionPieceApi.js")
        ])
        self.assertEqual(
            plan["execution_mode"],
            "INCREMENTAL_SOURCE_DEPENDENT_CLOSURE",
        )
        self.assertEqual(plan["fallback_reasons"], [])
        self.assertEqual(
            plan["executed_layers"],
            ["code_index", "inventory", "route_graph", "task_context"],
        )

    def test_forced_route_registry_owner_uses_full_fallback(self) -> None:
        plan = plan_refresh(
            [Change("mashos-api", "MODIFIED", None, "ai/main.py")],
            forced_full_rebuild_reasons=[
                "ROUTE_REGISTRY_INCLUDE_ROUTER_OR_DOMAIN_OWNER_CHANGE"
            ],
        )
        self.assertEqual(plan["execution_mode"], "FULL_REBUILD_FALLBACK")
        self.assertIn(
            "ROUTE_REGISTRY_INCLUDE_ROUTER_OR_DOMAIN_OWNER_CHANGE",
            plan["fallback_reasons"],
        )

    def test_task_profile_only_change_avoids_code_and_route_rebuild(self) -> None:
        plan = plan_refresh(
            [
                Change(
                    "Cocolon",
                    "MODIFIED",
                    None,
                    "Cocolon_前提資料/system_context/task_profiles.json",
                )
            ]
        )
        self.assertEqual(plan["execution_mode"], "INCREMENTAL_NON_CODE_REBIND")
        self.assertEqual(plan["executed_layers"], ["inventory", "task_context"])
        self.assertNotIn("code_index", plan["executed_layers"])
        self.assertNotIn("route_graph", plan["executed_layers"])


class CanonicalOwnerResolverTests(unittest.TestCase):
    @staticmethod
    def _commit(repo: Path, relative: str, body: str, message: str) -> str:
        path = repo / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
        git(repo, "add", relative)
        git(repo, "commit", "-m", message)
        return git(repo, "rev-parse", "HEAD")

    def _dag(self, root: Path) -> tuple[Path, str, str, str]:
        repo = root / "repo"
        repo.mkdir()
        git(repo, "init", "-q")
        git(repo, "config", "user.email", "test@example.invalid")
        git(repo, "config", "user.name", "test")
        workspace_branch = git(repo, "symbolic-ref", "--short", "HEAD")
        base = self._commit(repo, "base.txt", "base\n", "base")
        workspace = self._commit(repo, "workspace.txt", "workspace\n", "workspace")
        git(repo, "checkout", "-q", "-b", "owner", base)
        owner = self._commit(
            repo,
            "docs/premise.md",
            "---\ndocument_id: DOC.PREMISE\nautomatic_progression: false\n---\nbody\n",
            "owner",
        )
        git(repo, "checkout", "-q", workspace_branch)
        self.assertEqual(git(repo, "rev-parse", "HEAD"), workspace)
        return repo, base, workspace, owner

    def test_relation_exact4_and_diverged_is_not_a_blocker(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo, base, workspace, owner = self._dag(Path(td))
            self.assertEqual(
                _classify_owner_relation(repo, workspace, workspace)["relation"],
                "SAME_REF",
            )
            self.assertEqual(
                _classify_owner_relation(repo, workspace, base)["relation"],
                "WORKSPACE_CONTAINS_OWNER_REF",
            )
            self.assertEqual(
                _classify_owner_relation(repo, base, workspace)["relation"],
                "OWNER_REF_AHEAD",
            )
            diverged = _classify_owner_relation(repo, workspace, owner)
            self.assertEqual(diverged["relation"], "DIVERGED")
            self.assertEqual(diverged["owner_side_changed_paths"], ["docs/premise.md"])
            self.assertEqual(diverged["workspace_side_changed_paths"], ["workspace.txt"])
            self.assertEqual(
                diverged["owner_side_changes"],
                [
                    {
                        "git_status": "A",
                        "status": "ADDED",
                        "old_path": None,
                        "new_path": "docs/premise.md",
                    }
                ],
            )
            self.assertEqual(
                diverged["workspace_side_changes"],
                [
                    {
                        "git_status": "A",
                        "status": "ADDED",
                        "old_path": None,
                        "new_path": "workspace.txt",
                    }
                ],
            )

    def test_relation_preserves_structured_rename_and_compatible_paths(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            git(repo, "init", "-q")
            git(repo, "config", "user.email", "test@example.invalid")
            git(repo, "config", "user.name", "test")
            branch = git(repo, "symbolic-ref", "--short", "HEAD")
            old = repo / "docs" / "old.md"
            old.parent.mkdir()
            old.write_text("same bytes\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "base")
            base = git(repo, "rev-parse", "HEAD")
            (repo / "workspace.txt").write_text("workspace\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "workspace")
            workspace = git(repo, "rev-parse", "HEAD")
            git(repo, "checkout", "-q", "-b", "owner-rename", base)
            git(repo, "mv", "docs/old.md", "docs/new.md")
            git(repo, "commit", "-m", "rename")
            owner = git(repo, "rev-parse", "HEAD")
            git(repo, "checkout", "-q", branch)

            relation = _classify_owner_relation(repo, workspace, owner)
            self.assertEqual(relation["relation"], "DIVERGED")
            self.assertEqual(
                relation["owner_side_changes"],
                [
                    {
                        "git_status": "R100",
                        "status": "RENAMED",
                        "old_path": "docs/old.md",
                        "new_path": "docs/new.md",
                    }
                ],
            )
            self.assertEqual(
                relation["owner_side_changed_paths"],
                ["docs/new.md"],
            )

    def test_initial_and_final_exact3_bind_owner_premise_read_only(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo, _base, workspace, owner = self._dag(Path(td))
            workspace_profile = {
                "repositories": {
                    "Cocolon": {"repository": "MassyuRed/Cocolon"}
                }
            }
            refs = {
                "Cocolon": RepositoryRef(
                    "Cocolon", repo, workspace, git(repo, "rev-parse", f"{workspace}^{{tree}}")
                )
            }
            task_profile = {
                "operator_contract": {
                    "canonical_owner_refs": [
                        {
                            "owner_id": "OWNER.CMEE.TEST",
                            "repository_key": "Cocolon",
                            "remote_ref": "refs/heads/owner",
                            "required": True,
                            "freshness_policy": "READ_ONLY_EXACT_REF",
                        }
                    ],
                    "required_premises": [
                        {
                            "premise_id": "PREMISE.CMEE.TEST",
                            "repository_key": "Cocolon",
                            "path": "docs/premise.md",
                            "owner_id": "OWNER.CMEE.TEST",
                            "required": True,
                            "entry_chain_order": 1,
                            "expected_identity_policy": "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
                        }
                    ],
                }
            }
            def fetch_to_namespace(
                fetch_repo: Path, _url: str, _ref: str, namespace: str
            ) -> str:
                git(fetch_repo, "update-ref", namespace, owner)
                return owner

            with mock.patch(
                "tools.cocolon_context_prepare._ls_remote_exact_head",
                return_value=owner,
            ), mock.patch(
                "tools.cocolon_context_prepare._fetch_owner_namespace",
                side_effect=fetch_to_namespace,
            ):
                initial = resolve_canonical_owner_bundle_initial(
                    repo_root=repo,
                    workspace="cmee_working",
                    task="cmee",
                    workspace_profile=workspace_profile,
                    workspace_refs=refs,
                    task_profile=task_profile,
                )
                final = finalize_canonical_owner_bundle(
                    initial, workspace_refs=refs
                )
            owner_row = final["owners"][0]
            self.assertEqual(owner_row["relation"], "DIVERGED")
            self.assertEqual(
                owner_row["first_resolved_head"],
                owner_row["fetched_namespace_head"],
            )
            self.assertEqual(owner_row["pre_publish_resolved_head"], owner)
            self.assertFalse(owner_row["workspace_incorporation_claim"])
            self.assertFalse(owner_row["write_authority"])
            self.assertFalse(owner_row["integration_required"])
            premise = final["premises"][0]
            self.assertEqual(premise["status"], "RESOLVED")
            self.assertEqual(premise["resolved_commit"], owner)
            self.assertEqual(
                premise["resolved_blob_sha"],
                git(repo, "rev-parse", f"{owner}:docs/premise.md"),
            )
            self.assertEqual(final["blocking_codes"], [])
            self.assertRegex(final["task_dependency_fingerprint"], r"^[0-9a-f]{64}$")
            self.assertEqual(git(repo, "rev-parse", "HEAD"), workspace)
            self.assertEqual(git(repo, "status", "--porcelain"), "")

    def test_ref_movement_stops_without_retry(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo, _base, workspace, owner = self._dag(Path(td))
            profile = {
                "repositories": {"Cocolon": {"repository": "MassyuRed/Cocolon"}}
            }
            refs = {
                "Cocolon": RepositoryRef(
                    "Cocolon", repo, workspace, git(repo, "rev-parse", f"{workspace}^{{tree}}")
                )
            }
            task = {
                "operator_contract": {
                    "canonical_owner_refs": [
                        {
                            "owner_id": "OWNER.CMEE.TEST",
                            "repository_key": "Cocolon",
                            "remote_ref": "refs/heads/owner",
                            "required": True,
                            "freshness_policy": "READ_ONLY_EXACT_REF",
                        }
                    ],
                    "required_premises": [],
                }
            }
            remote = mock.Mock(return_value=owner)
            with mock.patch(
                "tools.cocolon_context_prepare._ls_remote_exact_head", remote
            ), mock.patch(
                "tools.cocolon_context_prepare._fetch_owner_namespace",
                return_value=workspace,
            ), self.assertRaisesRegex(PrepareError, "REMOTE_REF_MOVED_DURING_RUN"):
                resolve_canonical_owner_bundle_initial(
                    repo_root=repo,
                    workspace="cmee_working",
                    task="cmee",
                    workspace_profile=profile,
                    workspace_refs=refs,
                    task_profile=task,
                )
            self.assertEqual(remote.call_count, 1)

    def test_pre_publish_movement_stops(self) -> None:
        bundle = {
            "workspace": "cmee_working",
            "task": "cmee",
            "owners": [
                {
                    "owner_id": "OWNER.CMEE.TEST",
                    "repository_key": "Cocolon",
                    "canonical_url": "https://github.com/MassyuRed/Cocolon.git",
                    "ref": "refs/heads/owner",
                    "namespace": "refs/cocolon-context/owners/test/owner",
                    "relation": "DIVERGED",
                    "first_resolved_head": "a" * 40,
                    "fetched_namespace_head": "a" * 40,
                }
            ],
            "premises": [],
            "blocking_codes": [],
        }
        with mock.patch(
            "tools.cocolon_context_prepare._ls_remote_exact_head",
            return_value="b" * 40,
        ), mock.patch(
            "tools.cocolon_context_prepare._namespace_head",
            return_value="a" * 40,
        ), self.assertRaisesRegex(PrepareError, "exact3 equality failed"):
            finalize_canonical_owner_bundle(
                bundle,
                workspace_refs={
                    "Cocolon": RepositoryRef(
                        "Cocolon", Path("/unused"), "a" * 40, "c" * 40
                    )
                },
            )

    def test_pre_publish_local_namespace_movement_stops(self) -> None:
        bundle = {
            "workspace": "cmee_working",
            "task": "cmee",
            "owners": [
                {
                    "owner_id": "OWNER.CMEE.TEST",
                    "repository_key": "Cocolon",
                    "canonical_url": "https://github.com/MassyuRed/Cocolon.git",
                    "ref": "refs/heads/owner",
                    "namespace": "refs/cocolon-context/owners/test/owner",
                    "relation": "DIVERGED",
                    "first_resolved_head": "a" * 40,
                    "fetched_namespace_head": "a" * 40,
                }
            ],
            "premises": [],
            "blocking_codes": [],
        }
        with mock.patch(
            "tools.cocolon_context_prepare._ls_remote_exact_head",
            return_value="a" * 40,
        ), mock.patch(
            "tools.cocolon_context_prepare._namespace_head",
            return_value="b" * 40,
        ), self.assertRaisesRegex(PrepareError, "exact3 equality failed"):
            finalize_canonical_owner_bundle(
                bundle,
                workspace_refs={
                    "Cocolon": RepositoryRef(
                        "Cocolon", Path("/unused"), "a" * 40, "c" * 40
                    )
                },
            )

    def test_owner_namespace_hash_prevents_lossy_id_collision(self) -> None:
        colon = _owner_namespace("cmee", "OWNER:CMEE")
        hyphen = _owner_namespace("cmee", "OWNER-CMEE")
        self.assertNotEqual(colon, hyphen)
        self.assertTrue(colon.startswith("refs/cocolon-context/owners/"))

    def test_multi_repository_owner_uses_its_materialized_repository(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            cocolon = root / "cocolon"
            cocolon.mkdir()
            git(cocolon, "init", "-q")
            git(cocolon, "config", "user.email", "test@example.invalid")
            git(cocolon, "config", "user.name", "test")
            (cocolon / "cocolon.txt").write_text("cocolon\n", encoding="utf-8")
            git(cocolon, "add", ".")
            git(cocolon, "commit", "-m", "cocolon")
            cocolon_head = git(cocolon, "rev-parse", "HEAD")

            mash_root = root / "mash"
            mash_root.mkdir()
            mash, _base, mash_workspace, mash_owner = self._dag(mash_root)
            refs = {
                "Cocolon": RepositoryRef(
                    "Cocolon",
                    cocolon,
                    cocolon_head,
                    git(cocolon, "rev-parse", "HEAD^{tree}"),
                ),
                "mashos-api": RepositoryRef(
                    "mashos-api",
                    mash,
                    mash_workspace,
                    git(mash, "rev-parse", f"{mash_workspace}^{{tree}}"),
                ),
            }
            workspace_profile = {
                "repositories": {
                    "Cocolon": {"repository": "MassyuRed/Cocolon"},
                    "mashos-api": {"repository": "MassyuRed/mashos-api"},
                }
            }
            task_profile = {
                "operator_contract": {
                    "canonical_owner_refs": [
                        {
                            "owner_id": "OWNER.MASH.TEST",
                            "repository_key": "mashos-api",
                            "remote_ref": "refs/heads/owner",
                            "required": True,
                            "freshness_policy": "READ_ONLY_EXACT_REF",
                        }
                    ],
                    "required_premises": [
                        {
                            "premise_id": "PREMISE.MASH.TEST",
                            "repository_key": "mashos-api",
                            "path": "docs/premise.md",
                            "owner_id": "OWNER.MASH.TEST",
                            "required": True,
                            "entry_chain_order": 1,
                            "expected_identity_policy": "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
                        }
                    ],
                    "document_responsibilities": [
                        {
                            "responsibility_id": "RESP.MASH.TEST",
                            "subject_locator": {
                                "repository_key": "mashos-api",
                                "owner_id": "OWNER.MASH.TEST",
                                "path": "docs/premise.md",
                            },
                        }
                    ],
                }
            }

            def fetch_to_mash(
                fetch_repo: Path, _url: str, _ref: str, namespace: str
            ) -> str:
                self.assertEqual(fetch_repo.resolve(), mash.resolve())
                git(fetch_repo, "update-ref", namespace, mash_owner)
                return mash_owner

            with mock.patch(
                "tools.cocolon_context_prepare._ls_remote_exact_head",
                return_value=mash_owner,
            ), mock.patch(
                "tools.cocolon_context_prepare._fetch_owner_namespace",
                side_effect=fetch_to_mash,
            ):
                initial = resolve_canonical_owner_bundle_initial(
                    repo_root=cocolon,
                    workspace="cmee_working",
                    task="cmee",
                    workspace_profile=workspace_profile,
                    workspace_refs=refs,
                    task_profile=task_profile,
                )
                finalized = finalize_canonical_owner_bundle(
                    initial, workspace_refs=refs
                )

            expected_blob = git(mash, "rev-parse", f"{mash_owner}:docs/premise.md")
            self.assertEqual(finalized["owners"][0]["repository_key"], "mashos-api")
            self.assertEqual(
                finalized["premises"][0]["resolved_blob_sha"], expected_blob
            )
            self.assertEqual(
                finalized["responsibility_subjects"][0]["resolved_blob_sha"],
                expected_blob,
            )

    def test_premise_and_subject_repository_must_match_owner(self) -> None:
        owner_rows = [
            {
                "owner_id": "OWNER.MASH.TEST",
                "repository_key": "mashos-api",
                "relation": "DIVERGED",
                "fetched_namespace_head": "a" * 40,
            }
        ]
        refs = {
            "Cocolon": RepositoryRef(
                "Cocolon", Path("/unused-cocolon"), "b" * 40, "c" * 40
            ),
            "mashos-api": RepositoryRef(
                "mashos-api", Path("/unused-mash"), "d" * 40, "e" * 40
            ),
        }
        with self.assertRaisesRegex(PrepareError, "premise repository does not match"):
            _bind_required_premises(
                workspace_refs=refs,
                owner_rows=owner_rows,
                required_premises=[
                    {
                        "premise_id": "PREMISE.MISMATCH",
                        "repository_key": "Cocolon",
                        "path": "docs/premise.md",
                        "owner_id": "OWNER.MASH.TEST",
                        "required": True,
                        "entry_chain_order": 1,
                        "expected_identity_policy": "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
                    }
                ],
            )
        with self.assertRaisesRegex(PrepareError, "subject repository does not match"):
            _bind_document_responsibilities(
                workspace_refs=refs,
                owner_rows=owner_rows,
                responsibilities=[
                    {
                        "responsibility_id": "RESP.MISMATCH",
                        "subject_locator": {
                            "repository_key": "Cocolon",
                            "owner_id": "OWNER.MASH.TEST",
                            "path": "docs/premise.md",
                        },
                    }
                ],
            )

    def test_github_url_is_derived_only_from_workspace_allowlist(self) -> None:
        profile = {
            "repositories": {"Cocolon": {"repository": "MassyuRed/Cocolon"}}
        }
        self.assertEqual(
            _canonical_github_url(profile, "Cocolon"),
            "https://github.com/MassyuRed/Cocolon.git",
        )
        profile["repositories"]["Cocolon"]["repository"] = "file:///tmp/repo"
        with self.assertRaisesRegex(PrepareError, "unsafe canonical GitHub"):
            _canonical_github_url(profile, "Cocolon")

    def test_nonterminal_v2_prepare_stops_before_resolver_or_workspace_mutation(self) -> None:
        repository_root = Path(__file__).parents[2]
        source_system = repository_root / "Cocolon_前提資料" / "system_context"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            system = root / "system_context"
            system.mkdir()
            for name in ("workspace_profiles.json", "task_profiles.json"):
                (system / name).write_bytes((source_system / name).read_bytes())
            profiles = json.loads(
                (system / "task_profiles.json").read_text(encoding="utf-8")
            )
            contract = profiles["tasks"]["cmee"]["operator_contract"]
            profiles["tasks"]["cmee"]["operator_contract"] = {
                key: contract[key]
                for key in (
                    "canonical_owner_refs",
                    "required_premises",
                    "document_responsibilities",
                )
            }
            profiles["tasks"] = {"cmee": profiles["tasks"]["cmee"]}
            (system / "task_profiles.json").write_text(
                json.dumps(profiles, ensure_ascii=False), encoding="utf-8"
            )
            sentinel = system / "current" / "cmee_working" / "sentinel.txt"
            sentinel.parent.mkdir(parents=True)
            sentinel.write_text("last-good\n", encoding="utf-8")

            for verify_only in (False, True):
                with self.subTest(verify_only=verify_only), mock.patch(
                    "tools.cocolon_context_prepare._resolve_refs"
                ) as resolve_refs, mock.patch(
                    "tools.cocolon_context_prepare._ls_remote_exact_head"
                ) as ls_remote, mock.patch(
                    "tools.cocolon_context_prepare._write_atomic"
                ) as write_atomic, self.assertRaisesRegex(
                    PrepareError,
                    "STEP7_TERMINAL_LIVE_PUBLICATION_REQUIRES_UNIT_C_EXACT10",
                ):
                    prepare(
                        repo_root=root / "repo",
                        system_context_root=system,
                        external_workspace_root=root / "external",
                        workspace="cmee_working",
                        task="cmee",
                        verify_only=verify_only,
                    )
                resolve_refs.assert_not_called()
                ls_remote.assert_not_called()
                write_atomic.assert_not_called()
                self.assertEqual(sentinel.read_text(encoding="utf-8"), "last-good\n")


class WorkspacePublicationTransactionTests(unittest.TestCase):
    @staticmethod
    def _write_workspace(root: Path, task: str, marker: str) -> None:
        required = (
            "manifest.json",
            "code_index/code_index_manifest.json",
            "route_graph/route_graph_manifest.json",
            "publication_transport.json",
            "prepare_summary.json",
            f"task_context/{task}/context_manifest.json",
            f"task_context/{task}/publication_transport.json",
        )
        for relative in required:
            path = root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(f"{marker}:{relative}\n", encoding="utf-8")

    @staticmethod
    def _terminal_receipt(*, cmee: bool) -> dict[str, object]:
        outputs = {
            name: "a" * 64
            for name in (
                "selected_files.jsonl",
                "closure_edges.jsonl",
                "required_category_coverage.json",
                "unresolved_context.jsonl",
                "full_text_read_order.md",
                "operator_context.json",
                "pro_context.md",
                "ultra_context.md",
                "collaboration_packets.json",
                *(
                    (
                        "cmee_context_overview.md",
                        "cmee_unincorporated_actual_findings.md",
                    )
                    if cmee
                    else ()
                ),
            )
        }
        return {
            "task_context": {"output_sha256": outputs},
            "operator_v1_completion_claim": None,
            "v1_activation": 0,
            "product_credit": 0,
            "technical_credit": 0,
            "automatic_progression": False,
        }

    def test_candidate_is_promoted_only_after_post_swap_verification(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            parent = Path(td)
            paths = _publication_paths(parent, "cmee_working")
            self._write_workspace(paths.live, "cmee", "old")
            self._write_workspace(paths.candidate, "cmee", "new")
            old_identity = _workspace_publication_identity(paths.live, "cmee")
            new_identity = _workspace_publication_identity(paths.candidate, "cmee")
            observed: list[str] = []

            def verify() -> None:
                observed.append(_workspace_publication_identity(paths.live, "cmee"))

            _publish_workspace_candidate(
                paths=paths,
                workspace="cmee_working",
                task="cmee",
                verify_promoted=verify,
            )
            self.assertEqual(observed, [new_identity])
            self.assertNotEqual(old_identity, new_identity)
            self.assertEqual(
                _workspace_publication_identity(paths.live, "cmee"), new_identity
            )
            self.assertFalse(paths.candidate.exists())
            self.assertFalse(paths.backup.exists())
            self.assertFalse(paths.marker.exists())

    def test_post_swap_failure_restores_last_good_workspace(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            paths = _publication_paths(Path(td), "cmee_working")
            self._write_workspace(paths.live, "cmee", "old")
            self._write_workspace(paths.candidate, "cmee", "new")
            old_identity = _workspace_publication_identity(paths.live, "cmee")

            with self.assertRaisesRegex(RuntimeError, "post-swap failure"):
                _publish_workspace_candidate(
                    paths=paths,
                    workspace="cmee_working",
                    task="cmee",
                    verify_promoted=lambda: (_ for _ in ()).throw(
                        RuntimeError("post-swap failure")
                    ),
                )
            self.assertEqual(
                _workspace_publication_identity(paths.live, "cmee"), old_identity
            )
            self.assertFalse(paths.candidate.exists())
            self.assertFalse(paths.backup.exists())
            self.assertFalse(paths.quarantine.exists())
            self.assertFalse(paths.marker.exists())

    def test_crash_phase_exact4_recovers_without_guessing(self) -> None:
        for phase in (
            "CANDIDATE_VERIFIED",
            "LIVE_MOVED_TO_BACKUP",
            "CANDIDATE_PROMOTED",
            "FINAL_VERIFIED",
        ):
            with self.subTest(phase=phase), tempfile.TemporaryDirectory() as td:
                paths = _publication_paths(Path(td), "cmee_working")
                self._write_workspace(paths.live, "cmee", "old")
                old_identity = _workspace_publication_identity(paths.live, "cmee")
                self._write_workspace(paths.candidate, "cmee", "new")
                new_identity = _workspace_publication_identity(paths.candidate, "cmee")
                if phase in {"LIVE_MOVED_TO_BACKUP", "CANDIDATE_PROMOTED", "FINAL_VERIFIED"}:
                    paths.live.replace(paths.backup)
                if phase in {"CANDIDATE_PROMOTED", "FINAL_VERIFIED"}:
                    paths.candidate.replace(paths.live)
                marker = _publication_marker(
                    paths=paths,
                    workspace="cmee_working",
                    task="cmee",
                    phase=phase,
                    pre_swap_identity=old_identity,
                    candidate_identity=new_identity,
                )
                _write_publication_marker(paths, marker)
                _recover_workspace_publication(
                    paths, workspace="cmee_working", task="cmee"
                )
                expected = new_identity if phase == "FINAL_VERIFIED" else old_identity
                self.assertEqual(
                    _workspace_publication_identity(paths.live, "cmee"), expected
                )
                self.assertFalse(paths.marker.exists())
                self.assertFalse(paths.candidate.exists())
                self.assertFalse(paths.backup.exists())
                self.assertFalse(paths.quarantine.exists())

    def test_markerless_residual_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            paths = _publication_paths(Path(td), "cmee_working")
            paths.candidate.mkdir()
            with self.assertRaisesRegex(
                PrepareError, "PUBLICATION_RECOVERY_AMBIGUOUS"
            ):
                _recover_workspace_publication(
                    paths, workspace="cmee_working", task="cmee"
                )

    def test_workspace_identity_rejects_undeclared_sibling_task(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            paths = _publication_paths(Path(td), "cmee_working")
            self._write_workspace(paths.live, "cmee", "old")
            (paths.live / "task_context" / "rogue").mkdir()
            with self.assertRaisesRegex(PrepareError, "primary task exact1"):
                _workspace_publication_identity(paths.live, "cmee")

    def test_interrupted_marker_temp_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            paths = _publication_paths(Path(td), "cmee_working")
            paths.marker.with_name(paths.marker.name + ".tmp").write_text(
                "partial", encoding="utf-8"
            )
            with self.assertRaisesRegex(
                PrepareError, "PUBLICATION_RECOVERY_AMBIGUOUS"
            ):
                _recover_workspace_publication(
                    paths, workspace="cmee_working", task="cmee"
                )

    def test_first_publication_promoted_crash_rolls_back_to_absence(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            paths = _publication_paths(Path(td), "cmee_working")
            self._write_workspace(paths.live, "cmee", "new")
            candidate_identity = _workspace_publication_identity(paths.live, "cmee")
            _write_publication_marker(
                paths,
                _publication_marker(
                    paths=paths,
                    workspace="cmee_working",
                    task="cmee",
                    phase="CANDIDATE_PROMOTED",
                    pre_swap_identity=None,
                    candidate_identity=candidate_identity,
                ),
            )
            _recover_workspace_publication(
                paths, workspace="cmee_working", task="cmee"
            )
            self.assertFalse(paths.live.exists())
            self.assertFalse(paths.marker.exists())

    def test_terminal_output_cardinality_and_zero_effect_boundary(self) -> None:
        base = {
            "operator_v1_completion_claim": None,
            "v1_activation": 0,
            "product_credit": 0,
            "technical_credit": 0,
            "automatic_progression": False,
        }
        cmee_outputs = {
            name: "a" * 64
            for name in (
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
            )
        }
        _validate_terminal_task_receipt(
            {**base, "task_context": {"output_sha256": cmee_outputs}},
            task="cmee",
            publication_mode="PERSISTENT_PRIMARY",
        )
        non_cmee = {
            key: value
            for key, value in cmee_outputs.items()
            if not key.startswith("cmee_")
        }
        _validate_terminal_task_receipt(
            {**base, "task_context": {"output_sha256": non_cmee}},
            task="account_profile_read_only",
            publication_mode="EPHEMERAL_VERIFY_ONLY",
        )
        with self.assertRaisesRegex(PrepareError, "non-CMEE exact9"):
            _validate_terminal_task_receipt(
                {**base, "task_context": {"output_sha256": cmee_outputs}},
                task="account_profile_read_only",
                publication_mode="EPHEMERAL_VERIFY_ONLY",
            )
        with self.assertRaisesRegex(PrepareError, "credit boundary"):
            _validate_terminal_task_receipt(
                {
                    **base,
                    "technical_credit": 1,
                    "task_context": {"output_sha256": cmee_outputs},
                },
                task="cmee",
                publication_mode="PERSISTENT_PRIMARY",
            )

    def test_ephemeral_task_uses_temp_candidate_and_preserves_live_bytes(self) -> None:
        repository_root = Path(__file__).parents[2]
        source_system = repository_root / "Cocolon_前提資料" / "system_context"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            system = root / "system_context"
            system.mkdir()
            for name in ("workspace_profiles.json", "task_profiles.json"):
                (system / name).write_bytes((source_system / name).read_bytes())
            live = system / "current" / "cmee_working"
            live.mkdir(parents=True)
            (live / "sentinel.txt").write_bytes(b"last-good\n")
            before = {
                path.relative_to(live).as_posix(): path.read_bytes()
                for path in live.rglob("*")
                if path.is_file()
            }

            def seed_ephemeral(_source: Path, target: Path, **_kwargs: object) -> Path:
                target.mkdir(parents=True)
                return target

            receipt = self._terminal_receipt(cmee=False)
            with mock.patch(
                "tools.cocolon_context_prepare.shutil.copytree",
                side_effect=seed_ephemeral,
            ), mock.patch(
                "tools.cocolon_context_prepare._run_v2_candidate",
                return_value=receipt,
            ) as run_candidate:
                observed = prepare(
                    repo_root=root / "repo",
                    system_context_root=system,
                    external_workspace_root=root / "external",
                    workspace="cmee_working",
                    task="account_profile_read_only",
                    verify_only=True,
                )
            self.assertIs(observed, receipt)
            candidate = run_candidate.call_args.kwargs["candidate_workspace"]
            self.assertNotEqual(candidate, live)
            self.assertFalse(candidate.exists())
            after = {
                path.relative_to(live).as_posix(): path.read_bytes()
                for path in live.rglob("*")
                if path.is_file()
            }
            self.assertEqual(after, before)
            self.assertEqual(
                sorted(path.name for path in (system / "current").iterdir()),
                ["cmee_working"],
            )

    def test_task_verifier_materializes_bound_route_graph_sibling(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            workspace = Path(td) / "workspace"
            task_output = workspace / "task_context" / "account_profile_read_only"
            route_graph = workspace / "route_graph"
            task_output.mkdir(parents=True)
            route_graph.mkdir()
            (route_graph / "api_routes.jsonl").write_text("{}\n", encoding="utf-8")

            def materialize(_source: Path, target: Path) -> Path:
                target.mkdir(parents=True)
                return target

            def verify(materialized: Path, **_kwargs: object) -> dict[str, bool]:
                bound_graph = materialized.parent.parent / "route_graph"
                self.assertTrue(bound_graph.is_symlink())
                self.assertEqual(bound_graph.resolve(), route_graph.resolve())
                return {"verified": True}

            with mock.patch(
                "tools.cocolon_context_prepare.verify_outputs"
            ), mock.patch(
                "tools.cocolon_context_prepare.materialize_outputs",
                side_effect=materialize,
            ), mock.patch(
                "tools.cocolon_context_prepare.verify_task_context",
                side_effect=verify,
            ):
                self.assertEqual(
                    _verify_task(
                        task_output,
                        expected_unit_a=True,
                        expected_task="account_profile_read_only",
                        expected_publication_mode="EPHEMERAL_VERIFY_ONLY",
                    ),
                    {"verified": True},
                )

    def test_terminal_persistent_task_routes_through_sibling_publication(self) -> None:
        repository_root = Path(__file__).parents[2]
        source_system = repository_root / "Cocolon_前提資料" / "system_context"
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            system = root / "system_context"
            system.mkdir()
            for name in ("workspace_profiles.json", "task_profiles.json"):
                (system / name).write_bytes((source_system / name).read_bytes())
            receipt = self._terminal_receipt(cmee=True)

            def seed(paths: object) -> None:
                paths.candidate.mkdir(parents=True)

            with mock.patch(
                "tools.cocolon_context_prepare._seed_workspace_candidate",
                side_effect=seed,
            ), mock.patch(
                "tools.cocolon_context_prepare._run_v2_candidate",
                return_value=receipt,
            ) as run_candidate, mock.patch(
                "tools.cocolon_context_prepare._publish_workspace_candidate"
            ) as publish:
                observed = prepare(
                    repo_root=root / "repo",
                    system_context_root=system,
                    external_workspace_root=root / "external",
                    workspace="cmee_working",
                    task="cmee",
                )
            self.assertIs(observed, receipt)
            self.assertEqual(
                run_candidate.call_args.kwargs["candidate_workspace"].name,
                ".cmee_working.cocolon-candidate",
            )
            publish.assert_called_once()


class WorkflowPolicyTests(unittest.TestCase):
    WORKFLOW_NAMES = (
        "cocolon-system-context-inventory.yml",
        "cocolon-system-context-step5-export.yml",
        "cocolon-system-context-step5-pytest-bootstrap.yml",
    )
    EXPECTED_EVENT_TYPES = ("opened", "reopened", "synchronize")
    EXPECTED_WORKFLOW_ROLES = {
        "cocolon-system-context-inventory.yml": "TERMINAL_IMPLEMENTATION_MATRIX",
        "cocolon-system-context-step5-export.yml": "WORKFLOW_POLICY_VERIFIER",
        "cocolon-system-context-step5-pytest-bootstrap.yml": "PYTEST_RUNTIME_VERIFIER",
    }
    ALLOWED_ACTIONS = {
        "actions/checkout@v4",
        "actions/setup-node@v4",
        "actions/setup-python@v5",
    }

    @staticmethod
    def _require(condition: bool, message: str) -> None:
        if not condition:
            raise AssertionError(message)

    @classmethod
    def _top_level_sections(
        cls, text: str
    ) -> tuple[list[str], dict[str, tuple[int, int, str]]]:
        lines = text.splitlines()
        starts: list[tuple[str, int, str]] = []
        seen: set[str] = set()
        for index, line in enumerate(lines):
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            if line[:1].isspace():
                continue
            match = re.fullmatch(r"([A-Za-z][A-Za-z0-9_-]*):(?:[ ]*(.*))?", line)
            cls._require(match is not None, f"unsupported top-level YAML line: {line!r}")
            key = str(match.group(1))
            cls._require(key not in seen, f"duplicate top-level YAML key: {key}")
            seen.add(key)
            starts.append((key, index, str(match.group(2) or "")))
        sections: dict[str, tuple[int, int, str]] = {}
        for position, (key, start, value) in enumerate(starts):
            end = starts[position + 1][1] if position + 1 < len(starts) else len(lines)
            sections[key] = (start, end, value)
        return lines, sections

    @classmethod
    def _direct_mapping(
        cls,
        lines: list[str],
        *,
        start: int,
        end: int,
        indent: int,
    ) -> dict[str, tuple[int, str]]:
        result: dict[str, tuple[int, str]] = {}
        prefix = " " * indent
        for index in range(start + 1, end):
            line = lines[index]
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            actual_indent = len(line) - len(line.lstrip(" "))
            if actual_indent != indent or not line.startswith(prefix):
                continue
            stripped = line[indent:]
            match = re.fullmatch(
                r"([A-Za-z][A-Za-z0-9_-]*):(?:[ ]*(.*))?", stripped
            )
            cls._require(
                match is not None,
                f"unsupported YAML mapping at line {index + 1}: {stripped!r}",
            )
            key = str(match.group(1))
            cls._require(key not in result, f"duplicate YAML key at indent {indent}: {key}")
            result[key] = (index, str(match.group(2) or ""))
        return result

    @classmethod
    def _inline_sequence(cls, value: str, field: str) -> tuple[str, ...]:
        cls._require(
            value.startswith("[") and value.endswith("]"),
            f"{field} must be an inline finite sequence",
        )
        inner = value[1:-1].strip()
        items = [] if not inner else [item.strip().strip("\"'") for item in inner.split(",")]
        cls._require(
            all(re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", item) for item in items),
            f"{field} contains an unsafe item",
        )
        return tuple(items)

    @classmethod
    def _steps(cls, lines: list[str], jobs_start: int, jobs_end: int) -> list[dict[str, object]]:
        steps_rows = [
            index
            for index in range(jobs_start + 1, jobs_end)
            if re.fullmatch(r"[ ]+steps:[ ]*", lines[index])
        ]
        cls._require(len(steps_rows) == 1, "workflow must declare exactly one steps list")
        steps_row = steps_rows[0]
        steps_indent = len(lines[steps_row]) - len(lines[steps_row].lstrip(" "))
        item_indent = steps_indent + 2
        starts: list[int] = []
        for index in range(steps_row + 1, jobs_end):
            line = lines[index]
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            indent = len(line) - len(line.lstrip(" "))
            if indent <= steps_indent:
                break
            if indent == item_indent and line[item_indent:].startswith("- "):
                starts.append(index)
        cls._require(bool(starts), "workflow steps list is empty")
        result: list[dict[str, object]] = []
        for position, start in enumerate(starts):
            end = starts[position + 1] if position + 1 < len(starts) else jobs_end
            while end > start and not lines[end - 1].strip():
                end -= 1
            block = lines[start:end]
            uses = []
            run_script = ""
            for offset, line in enumerate(block):
                stripped = line.strip()
                uses_match = re.fullmatch(r"(?:-[ ]+)?uses:[ ]*(\S.*)", stripped)
                if uses_match:
                    uses.append(str(uses_match.group(1)).strip())
                run_match = re.fullmatch(r"(?:-[ ]+)?run:[ ]*(.*)", stripped)
                if not run_match:
                    continue
                value = str(run_match.group(1))
                if value in {"|", ">", "|-", ">-"}:
                    run_indent = len(line) - len(line.lstrip(" "))
                    body: list[str] = []
                    for body_line in block[offset + 1 :]:
                        if body_line.strip():
                            body_indent = len(body_line) - len(body_line.lstrip(" "))
                            if body_indent <= run_indent:
                                break
                            body.append(body_line[run_indent + 2 :])
                        else:
                            body.append("")
                    run_script = "\n".join(body)
                else:
                    run_script = value
                break
            result.append(
                {
                    "start": start,
                    "end": end,
                    "block": "\n".join(block),
                    "uses": uses,
                    "run": run_script,
                }
            )
        return result

    @staticmethod
    def _executable_lines(script: str) -> list[str]:
        return [
            line.strip()
            for line in script.splitlines()
            if line.strip() and not line.lstrip().startswith("#")
        ]

    @staticmethod
    def _structural_line_count(lines: list[str], value: str) -> int:
        return sum(
            line.strip() == value
            for line in lines
            if line.strip() and not line.lstrip().startswith("#")
        )

    @classmethod
    def _assert_api_binding(cls, step: dict[str, object], phase: str) -> None:
        script = str(step["run"])
        executable = "\n".join(cls._executable_lines(script))
        cls._require(
            len(re.findall(r"\bgh[ ]+api\b", executable)) == 1,
            f"{phase} binding must execute exactly one GitHub API read",
        )
        cls._require(
            'gh api "repos/${GITHUB_REPOSITORY}/pulls/${EXPECTED_PR_NUMBER}"'
            in executable,
            f"{phase} binding must read the event-derived pull request",
        )
        predicates = (
            r'\.state\s*==\s*"open"',
            r"\.draft\s*==\s*true",
            r"\.merged\s*==\s*false",
            r"\.head\.repo\.full_name\s*==\s*\$repo",
            r"\.base\.repo\.full_name\s*==\s*\$repo",
            r"\.head\.sha\s*==\s*\$sha",
            r"\.head\.ref\s*==\s*\$ref",
        )
        for predicate in predicates:
            cls._require(
                re.search(predicate, executable) is not None,
                f"{phase} binding is missing predicate {predicate}",
            )
        block = str(step["block"])
        cls._require(
            cls._structural_line_count(
                block.splitlines(), "GH_TOKEN: ${{ github.token }}"
            )
            == 1,
            f"{phase} binding must use only github.token",
        )

    @classmethod
    def _assert_workflow_policy(cls, text: str) -> None:
        lines, sections = cls._top_level_sections(text)
        cls._require("on" in sections, "workflow trigger block is missing")
        on_start, on_end, on_value = sections["on"]
        cls._require(not on_value, "workflow trigger must be a mapping")
        events = cls._direct_mapping(
            lines, start=on_start, end=on_end, indent=2
        )
        cls._require(
            set(events) == {"pull_request"},
            "workflow trigger must be exactly pull_request",
        )
        pull_start, pull_value = events["pull_request"]
        cls._require(not pull_value, "pull_request trigger must be a mapping")
        pull = cls._direct_mapping(
            lines, start=pull_start, end=on_end, indent=4
        )
        cls._require(
            set(pull) == {"types", "paths"},
            "pull_request trigger may contain only exact types and paths",
        )
        cls._require(
            cls._inline_sequence(pull["types"][1], "pull_request.types")
            == cls.EXPECTED_EVENT_TYPES,
            "pull_request event types are not the approved exact3",
        )

        cls._require("permissions" in sections, "top-level permissions are missing")
        permissions_start, permissions_end, permissions_value = sections["permissions"]
        cls._require(not permissions_value, "permissions must be an explicit mapping")
        permissions = cls._direct_mapping(
            lines,
            start=permissions_start,
            end=permissions_end,
            indent=2,
        )
        cls._require(
            {key: value for key, (_line, value) in permissions.items()}
            == {"contents": "read", "pull-requests": "read"},
            "permissions must be exact read-only contents and pull-requests",
        )
        nested_permissions = [
            line
            for line in lines
            if re.fullmatch(r"[ ]{2,}permissions:(?:[ ].*)?", line)
        ]
        cls._require(
            not nested_permissions,
            "job/step permissions overrides are forbidden",
        )

        cls._require("jobs" in sections, "jobs block is missing")
        jobs_start, jobs_end, jobs_value = sections["jobs"]
        cls._require(not jobs_value, "jobs must be an explicit mapping")
        jobs = cls._direct_mapping(lines, start=jobs_start, end=jobs_end, indent=2)
        cls._require(len(jobs) == 1, "workflow must contain exactly one bounded job")
        steps = cls._steps(lines, jobs_start, jobs_end)

        uses = [str(value) for step in steps for value in step["uses"]]
        cls._require(
            set(uses).issubset(cls.ALLOWED_ACTIONS),
            "workflow uses an action outside the read-only allowlist",
        )
        checkout_indexes = [
            index
            for index, step in enumerate(steps)
            if any(str(value).startswith("actions/checkout@") for value in step["uses"])
        ]
        cls._require(
            len(checkout_indexes) == 1,
            "workflow must contain exactly one actions/checkout step",
        )
        checkout_index = checkout_indexes[0]
        checkout = steps[checkout_index]
        cls._require(
            checkout["uses"] == ["actions/checkout@v4"],
            "checkout action must be the approved exact action",
        )
        checkout_lines = str(checkout["block"]).splitlines()
        with_rows = [
            index
            for index, line in enumerate(checkout_lines)
            if line.strip() == "with:"
        ]
        cls._require(len(with_rows) == 1, "checkout must contain exact1 with mapping")
        with_start = with_rows[0]
        with_indent = len(checkout_lines[with_start]) - len(
            checkout_lines[with_start].lstrip(" ")
        )
        with_end = len(checkout_lines)
        for index in range(with_start + 1, len(checkout_lines)):
            line = checkout_lines[index]
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            indent = len(line) - len(line.lstrip(" "))
            if indent <= with_indent:
                with_end = index
                break
        checkout_with = cls._direct_mapping(
            checkout_lines,
            start=with_start,
            end=with_end,
            indent=with_indent + 2,
        )
        cls._require(
            {key: value for key, (_line, value) in checkout_with.items()}
            == {
                "ref": "${{ github.event.pull_request.head.sha }}",
                "fetch-depth": "1",
                "persist-credentials": "false",
            },
            "checkout ref must be exactly pull_request.head.sha",
        )

        expected_bindings = (
            "EXPECTED_PR_NUMBER: ${{ github.event.pull_request.number }}",
            "EXPECTED_HEAD_SHA: ${{ github.event.pull_request.head.sha }}",
            "EXPECTED_HEAD_REF: ${{ github.event.pull_request.head.ref }}",
            "EVENT_HEAD_REPOSITORY: ${{ github.event.pull_request.head.repo.full_name }}",
            "EVENT_BASE_REPOSITORY: ${{ github.event.pull_request.base.repo.full_name }}",
        )
        for binding in expected_bindings:
            cls._require(
                cls._structural_line_count(lines, binding) == 1,
                f"event identity binding must occur exact1: {binding}",
            )

        same_repo_commands = {
            'test "$GITHUB_EVENT_NAME" = "pull_request"',
            'test "$EVENT_HEAD_REPOSITORY" = "$GITHUB_REPOSITORY"',
            'test "$EVENT_BASE_REPOSITORY" = "$GITHUB_REPOSITORY"',
        }
        same_repo_indexes = [
            index
            for index, step in enumerate(steps)
            if same_repo_commands.issubset(
                set(cls._executable_lines(str(step["run"])))
            )
        ]
        cls._require(
            len(same_repo_indexes) == 1 and same_repo_indexes[0] < checkout_index,
            "same-repository event binding must execute once before checkout",
        )

        api_indexes = [
            index
            for index, step in enumerate(steps)
            if re.search(r"\bgh[ ]+api\b", str(step["run"]))
        ]
        cls._require(
            len(api_indexes) == 2,
            "workflow must execute exact2 pre/post GitHub API bindings",
        )
        cls._require(
            api_indexes[0] < checkout_index < api_indexes[1],
            "GitHub API bindings must surround checkout and verification",
        )
        cls._assert_api_binding(steps[api_indexes[0]], "pre-checkout")
        cls._assert_api_binding(steps[api_indexes[1]], "post-verification")
        post_block = str(steps[api_indexes[1]]["block"])
        cls._require(
            re.search(r"(?m)^\s*if:\s*(?:\$\{\{\s*)?always\(\)(?:\s*\}\})?\s*$", post_block)
            is not None,
            "post-verification API binding must run with always()",
        )

        scripts = "\n".join(str(step["run"]) for step in steps)
        forbidden = (
            r"\bpush\b",
            r"\bpatch\b",
            r"\bput\b",
            r"\bpost\b",
            r"\bdelete\b",
            r"\bmutation\b",
            r"\bcurl\b",
            r"\bwget\b",
            r"\bdispatch\b",
            r"\bmerge\b",
            r"\brebase\b",
            r"\bgit\b[^\n]*\b(?:add|commit|checkout|switch|reset|update-ref)\b",
            r"\bgh[ ]+pr[ ]+(?:close|edit|merge|ready|reopen)\b",
        )
        for pattern in forbidden:
            cls._require(
                re.search(pattern, scripts, flags=re.IGNORECASE) is None,
                f"forbidden workflow operation matched: {pattern}",
            )
        cls._require(
            scripts.count('test "$(git rev-parse HEAD)" = "$EXPECTED_HEAD_SHA"')
            >= 2,
            "local checkout identity must be verified before and after tests",
        )
        cls._require(
            "git diff --exit-code -- ." in scripts
            and "git diff --cached --exit-code -- ." in scripts,
            "workflow must fail on tracked source mutation",
        )

    @classmethod
    def _assert_workflow_role(cls, name: str, text: str) -> None:
        role = cls.EXPECTED_WORKFLOW_ROLES[name]
        lines, sections = cls._top_level_sections(text)
        cls._require(
            cls._structural_line_count(lines, f"WORKFLOW_ROLE: {role}") == 1,
            f"workflow role must be declared exact1: {name}={role}",
        )
        jobs_start, jobs_end, _jobs_value = sections["jobs"]
        scripts = "\n".join(
            str(step["run"])
            for step in cls._steps(lines, jobs_start, jobs_end)
        )
        cls._require(
            f'test "$WORKFLOW_ROLE" = "{role}"' in scripts,
            f"workflow role must be asserted at runtime: {name}={role}",
        )
        if role == "TERMINAL_IMPLEMENTATION_MATRIX":
            cls._require(
                "tests.cocolon_context.test_inventory" in scripts
                and "tests.cocolon_context.test_publication_transport" in scripts
                and "tests/cocolon_context/test_prepare.py" in scripts
                and "tests/cocolon_context/test_task_context.py" in scripts,
                "terminal matrix role must cover transport, prepare, and task context",
            )
        elif role == "WORKFLOW_POLICY_VERIFIER":
            cls._require(
                "tests/cocolon_context/test_prepare.py -q -k workflow_policy" in scripts,
                "workflow policy role must run only the bounded policy selector",
            )
        else:
            cls._require(
                "tests/cocolon_context/test_prepare.py tests/cocolon_context/test_task_context.py -q"
                in scripts,
                "pytest runtime role must run the terminal Python matrix",
            )
        cls._require(
            "workflow_dispatch" not in text,
            "terminal verification must not depend on manual dispatch registration",
        )

    def test_workflow_policy_is_pr_only_read_only_and_current_head_bound(self) -> None:
        root = Path(__file__).parents[2]
        for name in self.WORKFLOW_NAMES:
            with self.subTest(name=name):
                text = (root / ".github" / "workflows" / name).read_text(
                    encoding="utf-8"
                )
                self._assert_workflow_policy(text)
                self._assert_workflow_role(name, text)

    def test_workflow_policy_rejects_representative_unsafe_mutations(self) -> None:
        root = Path(__file__).parents[2]
        original = (
            root
            / ".github"
            / "workflows"
            / "cocolon-system-context-inventory.yml"
        ).read_text(encoding="utf-8")

        def replace_last(value: str, old: str, new: str) -> str:
            position = value.rfind(old)
            self.assertNotEqual(position, -1, old)
            return value[:position] + new + value[position + len(old) :]

        mutations = {
            "additional push event": (
                original.replace(
                    "on:\n  pull_request:",
                    "on:\n  push:\n  pull_request:",
                    1,
                ),
                "trigger",
            ),
            "write permission": (
                original.replace("  contents: read", "  contents: write", 1),
                "permissions",
            ),
            "job permission override": (
                original.replace(
                    "  verify-current-draft-head:\n",
                    "  verify-current-draft-head:\n"
                    "    permissions:\n"
                    "      contents: write\n",
                    1,
                ),
                "permissions overrides",
            ),
            "merge-ref checkout": (
                original.replace(
                    "          ref: ${{ github.event.pull_request.head.sha }}",
                    "          ref: ${{ github.sha }}",
                    1,
                ),
                "checkout ref",
            ),
            "persisted checkout credentials": (
                original.replace(
                    "          persist-credentials: false",
                    "          persist-credentials: true",
                    1,
                ),
                "checkout ref",
            ),
            "second checkout": (
                original.replace(
                    "      - name: Assert local checkout identity\n",
                    "      - name: Unsafe second checkout\n"
                    "        uses: actions/checkout@v4\n"
                    "        with:\n"
                    "          ref: ${{ github.event.pull_request.head.sha }}\n"
                    "          persist-credentials: false\n\n"
                    "      - name: Assert local checkout identity\n",
                    1,
                ),
                "exactly one actions/checkout",
            ),
            "mutating GitHub API method": (
                original.replace("gh api \"repos/", "gh api --method PATCH \"repos/", 1),
                "event-derived pull request",
            ),
            "missing Draft binding": (
                original.replace("and .draft == true", "and .draft == false", 1),
                "draft",
            ),
            "post head-ref mismatch": (
                replace_last(
                    original,
                    "and .head.ref == $ref",
                    "and .head.ref != $ref",
                ),
                "post-verification binding",
            ),
            "same-repository check removed": (
                original.replace(
                    'test "$EVENT_HEAD_REPOSITORY" = "$GITHUB_REPOSITORY"',
                    'test -n "$EVENT_HEAD_REPOSITORY"',
                    1,
                ),
                "same-repository",
            ),
            "git push through global option": (
                original.replace(
                    "          node --check tools/cocolon_context_ts_syntax.cjs",
                    "          git -C . push origin HEAD\n"
                    "          node --check tools/cocolon_context_ts_syntax.cjs",
                    1,
                ),
                "forbidden workflow operation",
            ),
            "curl POST mutation": (
                original.replace(
                    "          node --check tools/cocolon_context_ts_syntax.cjs",
                    "          curl -X POST https://example.invalid/mutate\n"
                    "          node --check tools/cocolon_context_ts_syntax.cjs",
                    1,
                ),
                "forbidden workflow operation",
            ),
        }
        for name, (mutated, expected) in mutations.items():
            with self.subTest(name=name):
                self.assertNotEqual(mutated, original)
                with self.assertRaisesRegex(AssertionError, expected):
                    self._assert_workflow_policy(mutated)


class PrepareCliTests(unittest.TestCase):
    def test_workflow_only_incremental_proof_flag_is_forwardable(self) -> None:
        parser = build_parser()
        args = parser.parse_args([
            "prepare",
            "--workspace",
            "cmee_working",
            "--task",
            "cmee",
            "--non-code-incremental-verified",
        ])
        self.assertTrue(args.non_code_incremental_verified)

    def test_source_incremental_proof_flag_is_forwardable(self) -> None:
        parser = build_parser()
        args = parser.parse_args([
            "prepare",
            "--workspace",
            "cmee_working",
            "--task",
            "cmee",
            "--source-incremental-verified",
        ])
        self.assertTrue(args.source_incremental_verified)


class GitDiffRefreshMatrixTests(unittest.TestCase):
    def test_actual_git_diff_covers_modify_delete_rename_and_type_change(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            git(repo, "init")
            git(repo, "config", "user.email", "test@example.com")
            git(repo, "config", "user.name", "test")
            files = {
                "screens/InputScreen.js": "fetch('/v1/input')\n",
                "ai/services/api_route.py": "def route(): return 1\n",
                "ai/services/engine.py": "def run(): return 1\n",
                "ai/tests/test_route.py": "def test_route(): pass\n",
                "docs/delete.md": "delete\n",
                "docs/old.md": "rename\n",
                "docs/type-owner": "regular\n",
            }
            for relative, body in files.items():
                path = repo / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(body, encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "base")
            base = git(repo, "rev-parse", "HEAD")

            (repo / "screens/InputScreen.js").write_text(
                "fetch('/v2/input')\n", encoding="utf-8"
            )
            (repo / "ai/services/api_route.py").write_text(
                "def route(): return 2\n", encoding="utf-8"
            )
            (repo / "ai/services/engine.py").write_text(
                "def run(): return 2\n", encoding="utf-8"
            )
            (repo / "ai/tests/test_route.py").write_text(
                "def test_route(): assert True\n", encoding="utf-8"
            )
            (repo / "docs/delete.md").unlink()
            git(repo, "mv", "docs/old.md", "docs/new.md")
            (repo / "docs/type-owner").unlink()
            (repo / "docs/type-owner").symlink_to("new.md")
            git(repo, "add", "-A")
            git(repo, "commit", "-m", "matrix")
            head = git(repo, "rev-parse", "HEAD")
            ref = RepositoryRef(
                key="mashos-api",
                path=repo,
                commit=head,
                tree=git(repo, "rev-parse", "HEAD^{tree}"),
            )
            changes = _diff_changes(ref, base)
            statuses = {change.status for change in changes}
            self.assertTrue(
                {"MODIFIED", "DELETED", "RENAMED", "TYPE_CHANGED"}.issubset(statuses)
            )
            plan = plan_refresh(changes)
            self.assertEqual(plan["execution_mode"], "FULL_REBUILD_FALLBACK")
            self.assertEqual(
                plan["requested_affected_layers"],
                ["code_index", "inventory", "route_graph", "task_context"],
            )
            self.assertIn("ROUTE_OR_OWNER_CLOSURE_CHANGE", plan["classification_reasons"])
            self.assertTrue(plan["fallback_reasons"])


class EffectiveMaterialCommitTests(unittest.TestCase):
    def test_generated_only_tail_is_skipped_but_source_commit_is_retained(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            git(repo, "init")
            git(repo, "config", "user.email", "test@example.com")
            git(repo, "config", "user.name", "test")
            (repo / "source.py").write_text("one\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "base")

            (repo / "source.py").write_text("two\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "source")
            source_commit = git(repo, "rev-parse", "HEAD")

            generated = repo / "Cocolon_前提資料/system_context/current/cmee_working"
            generated.mkdir(parents=True)
            (generated / "prepare_summary.json").write_text("{}\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "generated")
            generated_commit = git(repo, "rev-parse", "HEAD")

            self.assertNotEqual(source_commit, generated_commit)
            self.assertEqual(effective_material_commit(repo), source_commit)

    def test_mixed_source_and_generated_commit_is_material(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            git(repo, "init")
            git(repo, "config", "user.email", "test@example.com")
            git(repo, "config", "user.name", "test")
            (repo / "source.py").write_text("one\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "base")
            generated = repo / "Cocolon_前提資料/system_context/current/cmee_working"
            generated.mkdir(parents=True)
            (generated / "prepare_summary.json").write_text("{}\n", encoding="utf-8")
            (repo / "source.py").write_text("two\n", encoding="utf-8")
            git(repo, "add", ".")
            git(repo, "commit", "-m", "mixed")
            head = git(repo, "rev-parse", "HEAD")
            self.assertEqual(effective_material_commit(repo), head)


class IncrementalSemanticMergeTests(unittest.TestCase):
    @staticmethod
    def _write_jsonl(path: Path, rows: list[dict[str, object]]) -> None:
        import json

        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            "".join(
                json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
                + "\n"
                for row in rows
            ),
            encoding="utf-8",
        )

    def test_reverse_import_and_reference_dependents_are_transitive(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            self._write_jsonl(
                root / "import_edges.jsonl",
                [
                    {
                        "repository_key": "Cocolon",
                        "source_path": "b.ts",
                        "resolved_target_path": "a.ts",
                    }
                ],
            )
            self._write_jsonl(
                root / "references.jsonl",
                [
                    {
                        "repository_key": "Cocolon",
                        "path": "c.ts",
                        "resolved_repository_key": "Cocolon",
                        "resolved_path": "b.ts",
                    }
                ],
            )
            affected, evidence = _derive_reverse_dependents(
                code_dir=root,
                seeds={("Cocolon", "a.ts")},
                database_path=root / "reverse.sqlite3",
            )
            self.assertEqual(
                affected,
                {
                    ("Cocolon", "a.ts"),
                    ("Cocolon", "b.ts"),
                    ("Cocolon", "c.ts"),
                },
            )
            self.assertEqual(evidence["reverse_import_dependent_count"], 1)
            self.assertEqual(evidence["reverse_reference_dependent_count"], 1)

    def test_code_partition_replaces_only_affected_file_rows(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            target = root / "symbols.jsonl"
            partial = root / "partial.jsonl"
            self._write_jsonl(
                target,
                [
                    {"repository_key": "Cocolon", "path": "a.ts", "symbol_id": "old-a"},
                    {"repository_key": "Cocolon", "path": "b.ts", "symbol_id": "b"},
                ],
            )
            self._write_jsonl(
                partial,
                [
                    {"repository_key": "Cocolon", "path": "a.ts", "symbol_id": "new-a"}
                ],
            )
            kept, replaced = _merge_code_partition(
                target=target,
                partial=partial,
                affected={("Cocolon", "a.ts")},
                name="symbols.jsonl",
            )
            self.assertEqual((kept, replaced), (1, 1))
            rows = list(_iter_jsonl(target))
            self.assertEqual({row["symbol_id"] for row in rows}, {"b", "new-a"})

    def test_partial_unmatched_full_inventory_scope_rows_are_excluded(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            target = root / "unmatched_scip_documents.jsonl"
            partial = root / "partial-unmatched.jsonl"
            sentinel = {
                "provider_run_id": "cocolon_typescript",
                "repository_key": "Cocolon",
                "relative_path": "generated/external.d.ts",
            }
            scope_rows = [
                {
                    "provider_run_id": "mashos_api_python",
                    "repository_key": "mashos-api",
                    "relative_path": "ai/tests/fixtures/__init__.py",
                },
                {
                    "provider_run_id": "mashos_api_python",
                    "repository_key": "mashos-api",
                    "relative_path": "ai/tests/helpers/__init__.py",
                },
            ]
            self._write_jsonl(target, [sentinel])
            self._write_jsonl(partial, scope_rows)
            target_before = target.read_bytes()
            affected = {("Cocolon", "lib/api/home/emotionPieceApi.js")}
            full_inventory_keys = affected | {
                ("mashos-api", str(row["relative_path"])) for row in scope_rows
            }

            excluded = _exclude_partial_scope_unmatched_documents(
                path=partial,
                full_inventory_keys=full_inventory_keys,
                affected=affected,
            )
            kept, replaced = _merge_code_partition(
                target=target,
                partial=partial,
                affected=affected,
                name="unmatched_scip_documents.jsonl",
            )

            self.assertEqual(excluded, 2)
            self.assertEqual((kept, replaced), (1, 0))
            self.assertEqual(list(_iter_jsonl(partial)), [])
            self.assertEqual(target.read_bytes(), target_before)

    def test_partial_unmatched_rejects_unknown_or_affected_rows(self) -> None:
        affected = {("Cocolon", "lib/api/home/emotionPieceApi.js")}
        cases = [
            ("mashos-api", "ai/tests/rogue.py", set()),
            (
                "Cocolon",
                "lib/api/home/emotionPieceApi.js",
                {("Cocolon", "lib/api/home/emotionPieceApi.js")},
            ),
        ]
        for repository, path, additional_inventory in cases:
            with self.subTest(repository=repository, path=path):
                with tempfile.TemporaryDirectory() as td:
                    partial = Path(td) / "partial-unmatched.jsonl"
                    self._write_jsonl(
                        partial,
                        [
                            {
                                "provider_run_id": "partial_provider",
                                "repository_key": repository,
                                "relative_path": path,
                            }
                        ],
                    )
                    before = partial.read_bytes()
                    with self.assertRaisesRegex(
                        PrepareError, "not an unchanged full-inventory row"
                    ):
                        _exclude_partial_scope_unmatched_documents(
                            path=partial,
                            full_inventory_keys=affected | additional_inventory,
                            affected=affected,
                        )
                    self.assertEqual(partial.read_bytes(), before)

    def test_route_candidate_merges_only_affected_closure_rows(self) -> None:
        import hashlib
        import json

        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            old = root / "old"
            fresh = root / "fresh"
            old.mkdir()
            fresh.mkdir()
            old_calls = [
                {
                    "call_id": "call-a",
                    "path": "lib/api/a.js",
                    "matched_route_ids": ["route-a"],
                },
                {
                    "call_id": "call-b",
                    "path": "lib/api/b.js",
                    "matched_route_ids": ["route-b"],
                },
            ]
            fresh_calls = [
                {
                    "call_id": "call-a",
                    "path": "lib/api/a.js",
                    "matched_route_ids": [],
                    "unresolved_reason": "changed",
                },
                old_calls[1],
            ]
            routes = [
                {"route_id": "route-a", "path": "ai/api_a.py"},
                {"route_id": "route-b", "path": "ai/api_b.py"},
            ]
            old_edges = [
                {
                    "edge_id": "edge-a",
                    "rn_call_id": "call-a",
                    "api_route_id": "route-a",
                },
                {
                    "edge_id": "edge-b",
                    "rn_call_id": "call-b",
                    "api_route_id": "route-b",
                },
            ]
            fresh_edges = [old_edges[1]]
            files = {
                "rn_calls.jsonl": (old_calls, fresh_calls),
                "api_routes.jsonl": (routes, routes),
                "cross_repository_route_edges.jsonl": (old_edges, fresh_edges),
            }
            for name, (old_rows, fresh_rows) in files.items():
                self._write_jsonl(old / name, old_rows)
                self._write_jsonl(fresh / name, fresh_rows)
            summary = {"completion_claim": "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED"}
            (old / "route_graph_summary.json").write_text(json.dumps(summary) + "\n")
            (fresh / "route_graph_summary.json").write_text(json.dumps(summary) + "\n")
            manifest = {
                "output_sha256": {
                    name: hashlib.sha256((fresh / name).read_bytes()).hexdigest()
                    for name in [*files, "route_graph_summary.json"]
                }
            }
            (fresh / "route_graph_manifest.json").write_text(json.dumps(manifest) + "\n")
            evidence = _merge_route_candidate(
                old_route_dir=old,
                candidate_dir=fresh,
                affected_keys={("Cocolon", "lib/api/a.js")},
                replacements={},
            )
            self.assertEqual(evidence["affected_rn_call_count"], 1)
            self.assertEqual(evidence["affected_route_count"], 1)
            self.assertEqual(
                evidence["outputs"]["rn_calls.jsonl"]["changed_row_count"],
                1,
            )
            merged_calls = list(_iter_jsonl(old / "rn_calls.jsonl"))
            self.assertEqual(merged_calls, fresh_calls)


if __name__ == "__main__":
    unittest.main()
