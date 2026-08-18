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


if __name__ == "__main__":
    unittest.main()
