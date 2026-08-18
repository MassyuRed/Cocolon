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

ROOT = pathlib.Path(__file__).parents[2]
TOOL = ROOT / "tools" / "cocolon_context_code_index.py"
spec = importlib.util.spec_from_file_location("code_index", TOOL)
assert spec and spec.loader
code_index = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = code_index
spec.loader.exec_module(code_index)


def cmd(*args: str, cwd: pathlib.Path) -> str:
    return subprocess.check_output(args, cwd=cwd, text=True).strip()


def make_repo(root: pathlib.Path, name: str, files: dict[str, bytes]) -> pathlib.Path:
    repo = root / name
    repo.mkdir()
    cmd("git", "init", "-q", cwd=repo)
    cmd("git", "config", "user.email", "test@example.invalid", cwd=repo)
    cmd("git", "config", "user.name", "test", cwd=repo)
    for rel, data in files.items():
        target = repo / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    cmd("git", "add", ".", cwd=repo)
    cmd("git", "commit", "-q", "-m", "fixture", cwd=repo)
    return repo


def inventory_rows(repo: pathlib.Path, key: str, repository: str) -> list[dict[str, object]]:
    commit = cmd("git", "rev-parse", "HEAD", cwd=repo)
    tree = cmd("git", "rev-parse", "HEAD^{tree}", cwd=repo)
    raw = subprocess.check_output(["git", "-C", str(repo), "ls-tree", "-r", "-l", "-z", commit])
    rows = []
    for item in raw.split(b"\0"):
        if not item:
            continue
        meta, path_b = item.split(b"\t", 1)
        mode, typ, object_sha, size = meta.split(b" ", 3)
        path = path_b.decode()
        data = subprocess.check_output(["git", "-C", str(repo), "cat-file", "blob", object_sha.decode()])
        ext = pathlib.PurePosixPath(path).suffix.lower()
        role = "SOURCE" if ext in code_index.TS_EXTENSIONS | code_index.PY_EXTENSIONS else "DOCUMENT"
        rows.append({
            "schema_version": "fixture.inventory.v1",
            "workspace_repository_key": key,
            "repository": repository,
            "source_commit": commit,
            "source_tree": tree,
            "path": path,
            "object_mode": mode.decode(),
            "object_type": typ.decode(),
            "object_sha": object_sha.decode(),
            "object_size": int(size),
            "content_sha256": hashlib.sha256(data).hexdigest(),
            "content_kind": "TEXT",
            "line_count": data.count(b"\n"),
            "file_role": role,
            "lifecycle": "ACTIVE_SOURCE" if role == "SOURCE" else "INVENTORY_ONLY",
            "domains": ["GLOBAL"],
            "classification_status": "CLASSIFIED",
        })
    return rows


def write_jsonl(path: pathlib.Path, rows: list[dict[str, object]]) -> None:
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows), encoding="utf-8")


class CodeIndexTests(unittest.TestCase):
    def test_python_ast_definitions_and_imports(self) -> None:
        symbols, refs, errors, status = code_index.parse_python(
            "pkg/a.py",
            "import os\nfrom .b import value\nclass C:\n    def m(self):\n        pass\nasync def f():\n    pass\n",
        )
        self.assertEqual(status, "PARSED")
        self.assertFalse(errors)
        self.assertEqual({row["name"] for row in symbols}, {"C", "C.m", "f"})
        self.assertEqual({row["target"] for row in refs}, {"os", "b.value"})

    def test_structured_parsers_are_visible(self) -> None:
        symbols, refs, errors, status, parser = code_index.parse_structured(
            "docs/readme.md", "# Title\n[Design](../design.md)\n"
        )
        self.assertEqual((status, parser), ("PARSED", "MARKDOWN_SYNTAX"))
        self.assertFalse(errors)
        self.assertEqual(symbols[0]["name"], "Title")
        self.assertEqual(refs[0]["target"], "../design.md")
        _, _, errors, status, _ = code_index.parse_structured("bad.json", "{")
        self.assertEqual(status, "ERROR")
        self.assertEqual(errors[0]["code"], "JSON_PARSE_ERROR")

    def test_local_resolution(self) -> None:
        self.assertEqual(
            code_index.resolve_js_reference("screens/X.js", "../lib/a", {"lib/a.js"}),
            "lib/a.js",
        )
        modules = code_index.python_module_map({"pkg/__init__.py", "pkg/b.py", "ai/services/ai_inference/x.py"})
        self.assertEqual(code_index.resolve_python_reference("pkg/a.py", "b", 1, modules), "pkg/b.py")
        self.assertEqual(code_index.resolve_python_reference("other.py", "x", 0, modules), "ai/services/ai_inference/x.py")

    def test_typescript_parser_uses_real_ast(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            source = root / "x.tsx"
            source.write_text("import X from './x';\nexport class C {}\nconst f = () => 1;\n", encoding="utf-8")
            request = root / "request.json"
            output = root / "output.json"
            request.write_text(json.dumps({"files": [{"repository_key": "Cocolon", "path": "x.tsx", "filesystem_path": str(source)}]}), encoding="utf-8")
            env = os.environ.copy()
            env.setdefault("NODE_PATH", subprocess.check_output(["npm", "root", "-g"], text=True).strip())
            subprocess.check_call(["node", str(ROOT / "tools" / "cocolon_context_ts_syntax.cjs"), "--input", str(request), "--output", str(output)], env=env)
            result = json.loads(output.read_text())["files"][0]
            self.assertEqual(result["parser_status"], "PARSED")
            self.assertEqual({row["name"] for row in result["symbols"]}, {"C", "f"})
            self.assertEqual(result["references"][0]["target"], "./x")

    def _fixture(self, root: pathlib.Path, *, failed_required: bool = False) -> tuple[pathlib.Path, dict[str, pathlib.Path], pathlib.Path, pathlib.Path, pathlib.Path]:
        cocolon = make_repo(root, "Cocolon", {
            "App.js": b"import { helper } from './helper';\nexport function App(){ return helper(); }\n",
            "helper.js": b"export function helper(){ return 1; }\n",
            "README.md": b"# App\n[Helper](helper.js)\n",
        })
        mashos = make_repo(root, "mashos-api", {
            "api.py": b"from service import run\ndef handler():\n    return run()\n",
            "service.py": b"def run():\n    return 1\n",
        })
        rows = inventory_rows(cocolon, "Cocolon", "example/Cocolon") + inventory_rows(mashos, "mashos-api", "example/mashos-api")
        inventory = root / "files.jsonl"
        write_jsonl(inventory, rows)
        profiles = root / "profiles.json"
        profiles.write_text(json.dumps({
            "schema_version": code_index.PROFILE_SCHEMA,
            "profiles": {"fixture": {"repositories": {}}},
            "code_index": {
                "toolchain": {"node_major": "20", "typescript_syntax": "5.2.2", "scip_cli": "v0.7.1", "scip_typescript": "0.4.0", "scip_python": "0.6.6"},
                "runs": [
                    {"run_id": "cocolon_typescript", "repository_key": "Cocolon", "family": "typescript", "required": True},
                    {"run_id": "mashos_python", "repository_key": "mashos-api", "family": "python", "required": True},
                ],
            },
        }), encoding="utf-8")
        work = root / "scip-work"
        work.mkdir()
        cocolon_json = {
            "documents": [
                {
                    "relativePath": "App.js",
                    "symbols": [{"symbol": "scip-typescript npm app 1 App.js/App().", "displayName": "App", "kind": 17}],
                    "occurrences": [
                        {"range": [1, 16, 1, 19], "symbol": "scip-typescript npm app 1 App.js/App().", "symbolRoles": 1},
                        {"range": [1, 30, 1, 36], "symbol": "scip-typescript npm app 1 helper.js/helper().", "symbolRoles": 0},
                    ],
                },
                {
                    "relativePath": "helper.js",
                    "symbols": [{"symbol": "scip-typescript npm app 1 helper.js/helper().", "displayName": "helper", "kind": 17}],
                    "occurrences": [{"range": [0, 16, 0, 22], "symbol": "scip-typescript npm app 1 helper.js/helper().", "symbolRoles": 1}],
                },
            ]
        }
        python_json = {
            "documents": [
                {
                    "relativePath": "api.py",
                    "symbols": [{"symbol": "scip-python python mashos 1 api/handler().", "displayName": "handler", "kind": 17}],
                    "occurrences": [{"range": [1, 4, 1, 11], "symbol": "scip-python python mashos 1 api/handler().", "symbolRoles": 1}],
                }
            ]
        }
        (work / "cocolon_typescript.json").write_text(json.dumps(cocolon_json), encoding="utf-8")
        (work / "mashos_python.json").write_text(json.dumps(python_json), encoding="utf-8")
        report = {
            "schema_version": code_index.RUN_REPORT_SCHEMA,
            "workspace": "fixture",
            "inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest(),
            "toolchain_match": True,
            "toolchain": {},
            "runs": [
                {"run_id": "cocolon_typescript", "repository_key": "Cocolon", "family": "typescript", "required": True, "candidate_count": 2, "exit_code": 1 if failed_required else 0, "output_exists": not failed_required, "print_exit_code": None if failed_required else 0, "document_count": 0 if failed_required else 2, "json_file": None if failed_required else "cocolon_typescript.json"},
                {"run_id": "mashos_python", "repository_key": "mashos-api", "family": "python", "required": True, "candidate_count": 2, "exit_code": 0, "output_exists": True, "print_exit_code": 0, "document_count": 1, "json_file": "mashos_python.json"},
            ],
        }
        (work / "scip_runs.json").write_text(json.dumps(report), encoding="utf-8")
        return profiles, {"Cocolon": cocolon, "mashos-api": mashos}, inventory, work, root / "out"

    def test_full_denominator_and_internal_graph(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            profiles, repos, inventory, work, output = self._fixture(pathlib.Path(raw))
            old_node_path = os.environ.get("NODE_PATH")
            os.environ["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
            try:
                summary = code_index.build_index(profiles=profiles, workspace="fixture", inventory_path=inventory, repos=repos, scip_work=work, output=output)
            finally:
                if old_node_path is None:
                    os.environ.pop("NODE_PATH", None)
                else:
                    os.environ["NODE_PATH"] = old_node_path
            self.assertEqual(summary["completion_claim"], "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED")
            self.assertEqual(summary["coverage_total"], summary["inventory_total"])
            self.assertEqual(summary["coverage_gap_count"], 0)
            self.assertGreater(summary["scip_precise_file_count"], 0)
            dependencies = [json.loads(line) for line in (output / "file_dependencies.jsonl").read_text().splitlines()]
            self.assertTrue(any(row["source_path"] == "App.js" and row["target_path"] == "helper.js" for row in dependencies))
            code_index.verify_index(inventory, output)

    def test_required_scip_failure_is_partial(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            profiles, repos, inventory, work, output = self._fixture(pathlib.Path(raw), failed_required=True)
            old_node_path = os.environ.get("NODE_PATH")
            os.environ["NODE_PATH"] = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
            try:
                summary = code_index.build_index(profiles=profiles, workspace="fixture", inventory_path=inventory, repos=repos, scip_work=work, output=output)
            finally:
                if old_node_path is None:
                    os.environ.pop("NODE_PATH", None)
                else:
                    os.environ["NODE_PATH"] = old_node_path
            self.assertEqual(summary["completion_claim"], "STEP2_PARTIAL_INDEX_STOP")
            self.assertFalse(summary["required_scip_runs_ok"])
            self.assertEqual(summary["coverage_gap_count"], 0)


if __name__ == "__main__":
    unittest.main()
