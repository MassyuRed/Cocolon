from __future__ import annotations

import pathlib
import tempfile
import unittest

from tests.cocolon_context.test_routes import inventory_rows, make_repo, routes


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


if __name__ == "__main__":
    unittest.main()
