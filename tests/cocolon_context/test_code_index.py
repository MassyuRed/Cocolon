from __future__ import annotations

import hashlib
import importlib.util
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

ROOT = pathlib.Path(__file__).parents[2]
TOOL = ROOT / "tools" / "cocolon_context_code_index.py"
HELPER = ROOT / "tools" / "cocolon_context_ts_syntax.cjs"
spec = importlib.util.spec_from_file_location("code_index", TOOL)
assert spec and spec.loader
code_index = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = code_index
spec.loader.exec_module(code_index)


def cmd(*args: str, cwd: pathlib.Path) -> str:
    return subprocess.check_output(args, cwd=cwd, text=True).strip()


def make_repo(root: pathlib.Path, name: str, files: dict[str, str]) -> pathlib.Path:
    repo = root / name
    repo.mkdir()
    cmd("git", "init", "-q", cwd=repo)
    cmd("git", "config", "user.email", "test@example.invalid", cwd=repo)
    cmd("git", "config", "user.name", "test", cwd=repo)
    for relative, text in files.items():
        target = repo / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")
    cmd("git", "add", ".", cwd=repo)
    cmd("git", "commit", "-q", "-m", "initial", cwd=repo)
    return repo


def inventory_rows(repo: pathlib.Path, key: str, repository: str) -> list[dict[str, object]]:
    commit = cmd("git", "rev-parse", "HEAD", cwd=repo)
    tree = cmd("git", "rev-parse", "HEAD^{tree}", cwd=repo)
    output: list[dict[str, object]] = []
    raw = subprocess.check_output(["git", "ls-tree", "-r", "-l", "-z", commit], cwd=repo)
    for item in raw.split(b"\0"):
        if not item:
            continue
        meta, path_bytes = item.split(b"\t", 1)
        mode, typ, obj, size = meta.split(b" ", 3)
        path = path_bytes.decode()
        data = subprocess.check_output(["git", "cat-file", "blob", obj.decode()], cwd=repo)
        ext = pathlib.PurePosixPath(path).suffix.lower()
        output.append({
            "workspace_repository_key": key,
            "repository": repository,
            "source_commit": commit,
            "source_tree": tree,
            "path": path,
            "object_mode": mode.decode(),
            "object_type": typ.decode(),
            "object_sha": obj.decode(),
            "object_size": int(size),
            "content_sha256": hashlib.sha256(data).hexdigest(),
            "content_kind": "TEXT",
            "file_role": "SOURCE" if ext in {".js", ".py"} else "DOCUMENT",
        })
    return output


class CodeIndexTests(unittest.TestCase):
    def test_python_heap_wrapper_propagates_limit_to_spawned_node(self) -> None:
        # run_provider supplies 4096 in its environment. The existing wrapper's
        # command-line limit alone only changes the parent, not spawned Node.
        with tempfile.TemporaryDirectory(prefix="scip provider ") as raw:
            entry = pathlib.Path(raw) / "provider entry.js"
            entry.write_text(
                "const cp = require('child_process');\n"
                "const child = cp.spawnSync(process.execPath, ['-e', "
                "'process.stdout.write(JSON.stringify({options:process.env.NODE_OPTIONS,limit:require(\"v8\").getHeapStatistics().heap_size_limit}))'], "
                "{encoding:'utf8'});\n"
                "if (child.status !== 0) process.exit(child.status || 1);\n"
                "console.log(JSON.stringify({args:process.argv.slice(2),child:JSON.parse(child.stdout)}));\n",
                encoding="utf-8",
            )
            real_which = code_index.shutil.which
            wrapper_dir = None
            try:
                with mock.patch.dict(os.environ), mock.patch.object(
                    code_index.shutil,
                    "which",
                    side_effect=lambda name: str(entry) if name == "scip-python" else real_which(name),
                ):
                    code_index._install_scip_python_heap_wrapper()
                    wrapper_dir = pathlib.Path(os.environ["PATH"].split(os.pathsep)[0])
                    result = code_index.run_command(
                        ["scip-python", "index", "argument with spaces"],
                        env={"NODE_OPTIONS": "--max-old-space-size=4096"},
                        timeout=30,
                    )
                self.assertEqual(result.returncode, 0, result.stderr)
                observed = json.loads(result.stdout)
                self.assertEqual(observed["args"], ["index", "argument with spaces"])
                self.assertEqual(observed["child"]["options"], "--max-old-space-size=8192")
                self.assertGreaterEqual(observed["child"]["limit"], 8192 * 1024 * 1024)
            finally:
                if wrapper_dir is not None:
                    code_index.shutil.rmtree(wrapper_dir)

    def test_python_syntax_extracts_symbols_and_imports(self) -> None:
        symbols, refs, errors = code_index.python_syntax(
            "api.py",
            "import os\nfrom a import b\nclass C:\n    pass\ndef f():\n    pass\n",
        )
        self.assertFalse(errors)
        self.assertEqual({row["name"] for row in symbols}, {"C", "f"})
        self.assertIn("os", {row["target"] for row in refs})
        self.assertIn("a.b", {row["target"] for row in refs})

    def test_relative_import_resolution(self) -> None:
        self.assertEqual(
            code_index.resolve_js_import("screens/X.js", "../lib/a", {"lib/a.js"}),
            "lib/a.js",
        )
        mapping = {"api.core": "api/core.py", "api": "api/__init__.py"}
        self.assertEqual(code_index.resolve_python_import("api/routes/x.py", "api.core.Model", mapping), "api/core.py")

    def test_provider_failure_is_explicit(self) -> None:
        report = {
            "runs": [{
                "run_id": "required",
                "required": True,
                "exit_code": 1,
                "output_exists": False,
                "print_exit_code": None,
                "document_count": 0,
            }]
        }
        failures = code_index.provider_failures(report)
        self.assertIn("required:index_exit", failures)
        self.assertIn("required:output_missing", failures)
        self.assertIn("required:zero_documents", failures)

    def test_build_and_verify_full_denominator(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(root, "Cocolon", {
                "lib/a.js": "export const f = () => 1;\n",
                "screens/X.js": "import { f } from '../lib/a';\nexport function X(){ return f(); }\n",
                "README.md": "fixture\n",
            })
            api = make_repo(root, "mashos-api", {
                "api/app.py": "from fastapi import FastAPI\napp = FastAPI()\nclass R: pass\ndef f(): return 1\n",
            })
            rows = inventory_rows(cocolon, "Cocolon", "example/Cocolon") + inventory_rows(api, "mashos-api", "example/mashos-api")
            inventory = root / "files.jsonl"
            inventory.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows), encoding="utf-8")
            work = root / "scip"
            work.mkdir()
            cocolon_doc = {
                "documents": [{
                    "relative_path": "lib/a.js",
                    "symbols": [{"symbol": "scip-typescript npm fixture 1 lib/a/f.", "display_name": "f", "kind": 12}],
                    "occurrences": [{"range": [0, 13, 0, 14], "symbol": "scip-typescript npm fixture 1 lib/a/f.", "symbol_roles": 1}],
                }]
            }
            api_doc = {
                "documents": [{
                    "relative_path": "api/app.py",
                    "symbols": [{"symbol": "scip-python python fixture 1 api/app/f().", "display_name": "f", "kind": 12}],
                    "occurrences": [{"range": [3, 4, 3, 5], "symbol": "scip-python python fixture 1 api/app/f().", "symbol_roles": 1}],
                }]
            }
            (work / "cocolon_typescript.json").write_text(json.dumps(cocolon_doc), encoding="utf-8")
            (work / "mashos_api_python.json").write_text(json.dumps(api_doc), encoding="utf-8")
            report = {
                "schema_version": code_index.RUN_SCHEMA,
                "inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest(),
                "source_commits": {"Cocolon": cmd("git", "rev-parse", "HEAD", cwd=cocolon), "mashos-api": cmd("git", "rev-parse", "HEAD", cwd=api)},
                "tool_versions": {},
                "runs": [
                    {"run_id": "cocolon_typescript", "repository_key": "Cocolon", "family": "typescript", "required": True, "candidate_count": 2, "source_commit": cmd("git", "rev-parse", "HEAD", cwd=cocolon), "exit_code": 0, "output_exists": True, "print_exit_code": 0, "document_count": 1, "json_file": "cocolon_typescript.json"},
                    {"run_id": "mashos_api_python", "repository_key": "mashos-api", "family": "python", "required": True, "candidate_count": 1, "source_commit": cmd("git", "rev-parse", "HEAD", cwd=api), "exit_code": 0, "output_exists": True, "print_exit_code": 0, "document_count": 1, "json_file": "mashos_api_python.json"},
                ],
            }
            (work / "scip_runs.json").write_text(json.dumps(report), encoding="utf-8")
            output = root / "out"
            summary = code_index.build_index(
                inventory,
                {"Cocolon": cocolon, "mashos-api": api},
                work,
                output,
                HELPER,
            )
            self.assertEqual(summary["coverage_total"], len(rows))
            self.assertEqual(summary["coverage_gap_count"], 0)
            self.assertGreater(summary["scip_precise_file_count"], 0)
            verified = code_index.verify_index(inventory, output)
            self.assertEqual(verified["completion_claim"], "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED")


if __name__ == "__main__":
    unittest.main()
