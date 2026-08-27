from __future__ import annotations

import subprocess
import sys
import tempfile
import types
from pathlib import Path
import unittest

from tools.cocolon_context_inventory import stable_file_identity

# The focused scratch test can run without copying the large Step 4 compiler;
# the repository test run imports the real module and does not take this branch.
try:
    import tools.cocolon_context_task  # noqa: F401
except ModuleNotFoundError:
    stub = types.ModuleType("tools.cocolon_context_task")
    stub.ContextCompileError = RuntimeError
    stub.compile_task_context = lambda **_: None
    stub.verify_task_context = lambda *_args, **_kwargs: {}
    sys.modules["tools.cocolon_context_task"] = stub

from tools.cocolon_context import build_parser
from tools.cocolon_context_prepare import (
    Change,
    PrepareError,
    RepositoryRef,
    _derive_reverse_dependents,
    _diff_changes,
    _exclude_partial_scope_unmatched_documents,
    _iter_jsonl,
    _merge_code_partition,
    _merge_route_candidate,
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
