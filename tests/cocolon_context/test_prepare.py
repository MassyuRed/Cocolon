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

from tools.cocolon_context_prepare import Change, effective_material_commit, plan_refresh


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


if __name__ == "__main__":
    unittest.main()
