from __future__ import annotations

import hashlib
import importlib.util
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).parents[2]
TOOL = ROOT / "tools" / "cocolon_context_routes.py"
HELPER = ROOT / "tools" / "cocolon_context_ts_routes.cjs"
spec = importlib.util.spec_from_file_location("routes", TOOL)
assert spec and spec.loader
routes = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = routes
spec.loader.exec_module(routes)


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


def inventory_rows(repo: pathlib.Path, key: str) -> list[dict[str, object]]:
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
            "repository": f"example/{key}",
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


class RouteGraphTests(unittest.TestCase):
    def test_normalize_and_template_match(self) -> None:
        self.assertEqual(routes.normalize_route_path("https://example.test/items/${id}?x=1")[0], "/items/{param}")
        self.assertEqual(routes.path_match("/items/{param}", "/items/{item_id}"), "EXACT")
        self.assertEqual(routes.path_match("/items/abc", "/items/{item_id}"), "TEMPLATE")
        self.assertIsNone(routes.path_match("/items", "/items/{item_id}"))

    def test_fastapi_router_mount_and_models(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            repo = make_repo(root, "mashos-api", {
                "api/routes.py": "from fastapi import APIRouter\nfrom pydantic import BaseModel\nrouter = APIRouter(prefix='/items')\nclass Req(BaseModel): pass\nclass Res(BaseModel): pass\n@router.post('/{item_id}', response_model=Res)\ndef create(item_id: str, body: Req): return body\n",
                "api/app.py": "from fastapi import FastAPI\nfrom api.routes import router\napp = FastAPI()\napp.include_router(router, prefix='/v1')\n",
            })
            rows = inventory_rows(repo, "mashos-api")
            extracted, model_edges, errors = routes.extract_api_routes(rows, repo)
            self.assertFalse(errors)
            self.assertTrue(any(row["route_path"] == "/v1/items/{item_id}" and row["method"] == "POST" for row in extracted))
            self.assertIn("USES_REQUEST_MODEL", {row["edge_kind"] for row in model_edges})
            self.assertIn("RETURNS_RESPONSE_MODEL", {row["edge_kind"] for row in model_edges})

    def test_rn_helper_resolves_imported_route_constant_and_builder(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            repo = make_repo(root, "Cocolon", {
                "lib/contracts.js": "export const WIRE = Object.freeze({routes:Object.freeze({list:'/items', detail:'/items'})});\nexport function buildDetail(id){ return `${WIRE.routes.detail}/${encodeURIComponent(String(id))}`; }\n",
                "lib/api.js": "import { apiGet, apiPost } from './client';\nimport { WIRE, buildDetail } from './contracts';\nexport function list(){ return apiGet(WIRE.routes.list); }\nexport function detail(id){ return apiPost(buildDetail(id), {}); }\n",
                "lib/client.js": "export function apiGet(){}\nexport function apiPost(){}\n",
            })
            rows = inventory_rows(repo, "Cocolon")
            calls, errors = routes.extract_rn_calls(rows, repo, HELPER)
            self.assertFalse(errors)
            paths = {path for call in calls for path in call["normalized_path_candidates"]}
            self.assertIn("/items", paths)
            self.assertIn("/items/{param}", paths)

    def test_build_verify_and_c1_c6_closure(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(root, "Cocolon", {
                "lib/contracts.js": "export const ROUTE='/account/items';\n",
                "lib/api.js": "import { apiGet } from './client';\nimport { ROUTE } from './contracts';\nexport function load(){ return apiGet(ROUTE); }\nexport function dynamic(path){ return apiGet(path); }\n",
                "lib/client.js": "export function apiGet(){}\n",
                "screens/AccountItemsScreen.js": "import { load } from '../lib/api';\nexport function AccountItemsScreen(){ return load(); }\n",
            })
            api = make_repo(root, "mashos-api", {
                "api/routes.py": "from fastapi import APIRouter\nfrom api.account_service import load_account_items\nfrom api.contracts import AccountItemsResponse\nrouter = APIRouter(prefix='/account/items')\n@router.get('', response_model=AccountItemsResponse)\nasync def list_items(): return await load_account_items()\n@router.get('/{item_id}')\ndef detail(item_id: str): return {}\n",
                "api/account_service.py": "from api.account_store import fetch_account_items\nasync def load_account_items(): return await fetch_account_items()\n",
                "api/account_store.py": "from supabase_client import sb_get\nasync def fetch_account_items(): return await sb_get('/rest/v1/account_items')\n",
                "api/contracts.py": "from pydantic import BaseModel\nclass AccountItemsResponse(BaseModel):\n    items: list[str] = []\n",
                "api/app.py": "from fastapi import FastAPI\nfrom api.routes import router\napp = FastAPI()\napp.include_router(router)\n",
                "api/tests/contract/test_account_items_contract.py": "from api.routes import list_items\nROUTE='/account/items'\ndef test_contract(): assert list_items and ROUTE\n",
            })
            rows = inventory_rows(cocolon, "Cocolon") + inventory_rows(api, "mashos-api")
            inventory = root / "files.jsonl"
            inventory.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows), encoding="utf-8")
            code_index = root / "code_index"
            code_index.mkdir()
            import_edges = [
                {"repository_key": "Cocolon", "source_path": "lib/api.js", "resolved_target_path": "lib/contracts.js"},
                {"repository_key": "Cocolon", "source_path": "screens/AccountItemsScreen.js", "resolved_target_path": "lib/api.js"},
                {"repository_key": "mashos-api", "source_path": "api/routes.py", "resolved_target_path": "api/account_service.py"},
                {"repository_key": "mashos-api", "source_path": "api/routes.py", "resolved_target_path": "api/contracts.py"},
                {"repository_key": "mashos-api", "source_path": "api/account_service.py", "resolved_target_path": "api/account_store.py"},
                {"repository_key": "mashos-api", "source_path": "api/tests/contract/test_account_items_contract.py", "resolved_target_path": "api/routes.py"},
            ]
            (code_index / "import_edges.jsonl").write_text("".join(json.dumps(row) + "\n" for row in import_edges), encoding="utf-8")
            summary = {"completion_claim": "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED"}
            (code_index / "code_index_summary.json").write_text(json.dumps(summary), encoding="utf-8")
            manifest = {"inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest()}
            (code_index / "code_index_manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            output = root / "routes"
            result = routes.build_route_graph(
                inventory,
                {"Cocolon": cocolon, "mashos-api": api},
                code_index,
                HELPER,
                output,
            )
            self.assertEqual(result["completion_claim"], "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED")
            self.assertGreater(result["cross_repository_edge_count"], 0)
            self.assertGreater(result["unresolved_rn_call_count"], 0)
            self.assertGreater(result["backend_call_edge_count"], 0)
            self.assertGreater(result["protected_test_edge_count"], 0)
            self.assertEqual(result["backend_owner_coverage_count"], result["rn_connected_route_count"])
            self.assertEqual(result["test_contract_coverage_count"], result["api_route_count"])
            self.assertEqual(result["visible_consumer_coverage_count"], result["rn_call_count"])
            calls = routes.read_jsonl(output / "rn_calls.jsonl")
            matched = [call for call in calls if call["connection_status"].startswith("MATCHED")]
            self.assertTrue(any("screens/AccountItemsScreen.js" in call["visible_consumer_files"] for call in matched))
            closures = routes.read_jsonl(output / "route_owner_closures.jsonl")
            owner_roles = {node["node_role"] for row in closures for node in row["nodes"]}
            self.assertIn("APPLICATION_SERVICE", owner_roles)
            self.assertIn("STORE_OR_REPOSITORY", owner_roles)
            self.assertIn("DB_TABLE_REFERENCE", owner_roles)
            domains = routes.read_jsonl(output / "file_domain_assignments.jsonl")
            route_domain = next(row for row in domains if row["path"] == "api/routes.py")
            self.assertIn("account", route_domain["domain_tags"])
            verified = routes.verify_route_graph(inventory, code_index, output)
            self.assertEqual(verified["completion_claim"], "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED")


    def test_duplicate_method_path_unresolved_consumers_preserve_subject_ids(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(root, "Cocolon", {
                "lib/api.js": "import { apiGet } from './client';\nexport function load(){ return apiGet('/items'); }\n",
                "lib/client.js": "export function apiGet(){}\n",
                "screens/ItemsScreen.js": "import { load } from '../lib/api';\nexport function ItemsScreen(){ return load(); }\n",
            })
            api = make_repo(root, "mashos-api", {
                "api/routes.py": (
                    "from fastapi import FastAPI\n"
                    "def register_routes(app: FastAPI) -> None:\n"
                    "    @app.get('/items')\n"
                    "    async def list_items(): return []\n"
                    "    @app.get('/ranking/emotions/self')\n"
                    "    async def ranking_self_primary(): return {}\n"
                    "    @app.get('/ranking/emotions/self')\n"
                    "    async def ranking_self_compat(): return {}\n"
                ),
            })
            rows = inventory_rows(cocolon, "Cocolon") + inventory_rows(api, "mashos-api")
            inventory = root / "files.jsonl"
            inventory.write_text(
                "".join(json.dumps(row, sort_keys=True) + "\n" for row in rows),
                encoding="utf-8",
            )
            code_index = root / "code_index"
            code_index.mkdir()
            import_edges = [{
                "repository_key": "Cocolon",
                "source_path": "screens/ItemsScreen.js",
                "resolved_target_path": "lib/api.js",
            }]
            (code_index / "import_edges.jsonl").write_text(
                "".join(json.dumps(row) + "\n" for row in import_edges),
                encoding="utf-8",
            )
            (code_index / "code_index_summary.json").write_text(
                json.dumps({"completion_claim": "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED"}),
                encoding="utf-8",
            )
            (code_index / "code_index_manifest.json").write_text(
                json.dumps({"inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest()}),
                encoding="utf-8",
            )
            output = root / "route_graph"
            result = routes.build_route_graph(
                inventory,
                {"Cocolon": cocolon, "mashos-api": api},
                code_index,
                HELPER,
                output,
            )
            self.assertEqual(
                "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED",
                result["completion_claim"],
            )
            api_routes = routes.read_jsonl(output / "api_routes.jsonl")
            connected = next(
                row for row in api_routes
                if row["method"] == "GET" and row["route_path"] == "/items"
            )
            self.assertEqual("RN_CONSUMED", connected["consumer_classification"])
            duplicates = [
                row for row in api_routes
                if row["method"] == "GET"
                and row["route_path"] == "/ranking/emotions/self"
            ]
            self.assertEqual(2, len(duplicates))
            self.assertEqual(
                {"UNRESOLVED_CONSUMER"},
                {row["consumer_classification"] for row in duplicates},
            )
            duplicate_ids = {row["route_id"] for row in duplicates}
            unresolved = routes.read_jsonl(output / "unresolved_api_consumers.jsonl")
            self.assertTrue(all("route_id" not in row for row in unresolved))
            unresolved_ids = {row["subject_id"] for row in unresolved}
            self.assertNotIn(connected["route_id"], unresolved_ids)
            self.assertEqual(duplicate_ids, unresolved_ids)
            verified = routes.verify_route_graph(inventory, code_index, output)
            self.assertEqual(
                "STEP3_RN_API_BACKEND_TEST_ROUTE_GRAPH_CONNECTED",
                verified["completion_claim"],
            )


if __name__ == "__main__":
    unittest.main()
