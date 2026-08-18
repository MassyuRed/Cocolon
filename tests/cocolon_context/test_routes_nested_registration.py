from __future__ import annotations

import hashlib
import json
import pathlib
import tempfile
import unittest

from tests.cocolon_context.test_routes import (
    HELPER,
    inventory_rows,
    make_repo,
    routes,
)


class NestedFastApiRouteTests(unittest.TestCase):
    def test_routes_nested_inside_registration_function_are_indexed(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            repo = make_repo(
                root,
                "mashos-api",
                {
                    "api/nested.py": (
                        "from fastapi import FastAPI\n"
                        "def register_routes(app: FastAPI) -> None:\n"
                        "    @app.get('/nested')\n"
                        "    async def nested_route():\n"
                        "        return {'ok': True}\n"
                    )
                },
            )
            rows = inventory_rows(repo, "mashos-api")
            extracted, _model_edges, errors = routes.extract_api_routes(rows, repo)
            self.assertFalse(errors)
            self.assertTrue(
                any(
                    row["method"] == "GET"
                    and row["route_path"] == "/nested"
                    and row["endpoint_symbol"] == "nested_route"
                    for row in extracted
                )
            )

    def test_nested_registration_route_builds_cross_repository_edge(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            cocolon = make_repo(
                root,
                "Cocolon",
                {
                    "lib/contracts.js": (
                        "export const WIRE = Object.freeze({"
                        "routes:Object.freeze({nested:'/nested'})"
                        "});\n"
                    ),
                    "lib/api.js": (
                        "import { apiGet } from './client';\n"
                        "import { WIRE } from './contracts';\n"
                        "export function loadNested(){ return apiGet(WIRE.routes.nested); }\n"
                    ),
                    "lib/client.js": "export function apiGet(){}\n",
                    "screens/NestedScreen.js": (
                        "import { loadNested } from '../lib/api';\n"
                        "export function NestedScreen(){ return loadNested(); }\n"
                    ),
                },
            )
            api = make_repo(
                root,
                "mashos-api",
                {
                    "api/nested.py": (
                        "from fastapi import FastAPI\n"
                        "def register_routes(app: FastAPI) -> None:\n"
                        "    @app.get('/nested')\n"
                        "    async def nested_route():\n"
                        "        return {'ok': True}\n"
                    )
                },
            )
            rows = inventory_rows(cocolon, "Cocolon") + inventory_rows(
                api, "mashos-api"
            )
            inventory = root / "files.jsonl"
            inventory.write_text(
                "".join(json.dumps(row, sort_keys=True) + "\n" for row in rows),
                encoding="utf-8",
            )
            code_index = root / "code_index"
            code_index.mkdir()
            import_edges = [
                {
                    "repository_key": "Cocolon",
                    "source_path": "lib/api.js",
                    "resolved_target_path": "lib/contracts.js",
                },
                {
                    "repository_key": "Cocolon",
                    "source_path": "screens/NestedScreen.js",
                    "resolved_target_path": "lib/api.js",
                },
            ]
            (code_index / "import_edges.jsonl").write_text(
                "".join(json.dumps(row) + "\n" for row in import_edges),
                encoding="utf-8",
            )
            (code_index / "code_index_summary.json").write_text(
                json.dumps(
                    {"completion_claim": "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED"}
                ),
                encoding="utf-8",
            )
            (code_index / "code_index_manifest.json").write_text(
                json.dumps(
                    {"inventory_sha256": hashlib.sha256(inventory.read_bytes()).hexdigest()}
                ),
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
            self.assertGreater(result["cross_repository_edge_count"], 0)
            verified = routes.verify_route_graph(inventory, code_index, output)
            self.assertEqual(
                verified["completion_claim"],
                "STEP3_RN_API_CROSS_REPOSITORY_ROUTE_GRAPH_CONNECTED",
            )


class RnUnresolvedAdjudicationTests(unittest.TestCase):
    def test_local_query_builder_wrapper_and_method_options_are_resolved(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            repo = make_repo(
                root,
                "Cocolon",
                {
                    "lib/client.js": (
                        "export async function apiFetch(pathOrUrl, options = {}) {\n"
                        "  return fetch(pathOrUrl, options);\n"
                        "}\n"
                        "export async function apiJson(path, options = {}) {\n"
                        "  return apiFetch(path, options);\n"
                        "}\n"
                        "export function apiGet(path, options = {}) {\n"
                        "  return apiJson(path, { ...options, method: 'GET' });\n"
                        "}\n"
                        "export function apiPost(path, body, options = {}) {\n"
                        "  return apiJson(path, { ...options, method: 'POST', body });\n"
                        "}\n"
                    ),
                    "lib/contracts.js": (
                        "export const WIRE = Object.freeze({routes:Object.freeze({\n"
                        "  incoming:'/follow/requests/incoming',\n"
                        "  outgoing:'/follow/requests/outgoing',\n"
                        "  approve:'/follow/requests/approve',\n"
                        "  reject:'/follow/requests/reject'\n"
                        "})});\n"
                        "export function buildFollowRequestsPath(kind) {\n"
                        "  const basePath = String(kind || '').trim() === 'outgoing'\n"
                        "    ? WIRE.routes.outgoing\n"
                        "    : WIRE.routes.incoming;\n"
                        "  const params = new URLSearchParams();\n"
                        "  const query = params.toString();\n"
                        "  return query ? `${basePath}?${query}` : basePath;\n"
                        "}\n"
                    ),
                    "screens/TestScreen.js": (
                        "import { apiFetch, apiGet, apiPost } from '../lib/client';\n"
                        "import { WIRE, buildFollowRequestsPath } from '../lib/contracts';\n"
                        "const API_BASE_URL = 'https://example.test';\n"
                        "async function getJsonWithAuth(url) {\n"
                        "  return apiFetch(url, { method: 'GET' });\n"
                        "}\n"
                        "export async function run(kind) {\n"
                        "  const params = new URLSearchParams();\n"
                        "  params.set('x', '1');\n"
                        "  const query = params.toString();\n"
                        "  const homePath = `/home/state${query ? `?${query}` : ''}`;\n"
                        "  await apiGet(homePath);\n"
                        "  await apiFetch(buildFollowRequestsPath('incoming'), { method: 'GET' });\n"
                        "  await apiFetch(buildFollowRequestsPath('outgoing'), { method: 'GET' });\n"
                        "  const fetchOpts = { method: 'GET' };\n"
                        "  await apiFetch('/self-structure/latest?x=1', fetchOpts);\n"
                        "  const rankUrl = new URL('/ranking/emotions', API_BASE_URL);\n"
                        "  rankUrl.searchParams.set('range', 'day');\n"
                        "  await getJsonWithAuth(rankUrl.toString());\n"
                        "  const endpoint = kind === 'approve'\n"
                        "    ? WIRE.routes.approve\n"
                        "    : WIRE.routes.reject;\n"
                        "  await apiPost(endpoint, {});\n"
                        "}\n"
                    ),
                },
            )
            rows = inventory_rows(repo, "Cocolon")
            calls, errors = routes.extract_rn_calls(rows, repo, HELPER)
            self.assertFalse(errors)
            self.assertFalse(any(call["path"] == "lib/client.js" for call in calls))

            def candidates(expression: str) -> list[set[str]]:
                return [
                    set(call["normalized_path_candidates"])
                    for call in calls
                    if call["path_expression"] == expression
                ]

            self.assertIn({"/home/state"}, candidates("homePath"))
            self.assertIn(
                {"/follow/requests/incoming"},
                candidates("buildFollowRequestsPath('incoming')"),
            )
            self.assertIn(
                {"/follow/requests/outgoing"},
                candidates("buildFollowRequestsPath('outgoing')"),
            )
            self.assertIn(
                {"/self-structure/latest"},
                candidates("'/self-structure/latest?x=1'"),
            )
            self.assertIn({"/ranking/emotions"}, candidates("rankUrl.toString()"))
            self.assertIn(
                {"/follow/requests/approve", "/follow/requests/reject"},
                candidates("endpoint"),
            )
            local_options = [
                call
                for call in calls
                if call["path_expression"] == "'/self-structure/latest?x=1'"
            ]
            self.assertEqual(["GET"], [call["method"] for call in local_options])


if __name__ == "__main__":
    unittest.main()
