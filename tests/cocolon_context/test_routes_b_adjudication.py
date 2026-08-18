from __future__ import annotations

import pathlib
import tempfile
import unittest

from tests.cocolon_context.test_routes import (
    HELPER,
    inventory_rows,
    make_repo,
    routes,
)


class RnBAdjudicationRegressionTests(unittest.TestCase):
    def test_query_suffix_endpoint_wrapper_and_config_array(self) -> None:
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
                        "export function apiGet(path, options = {}) {\n"
                        "  return apiFetch(path, { ...options, method: 'GET' });\n"
                        "}\n"
                    ),
                    "lib/contracts.js": (
                        "export const WIRE = Object.freeze({routes:Object.freeze({\n"
                        "  resonance:'/ranking/piece_resonances'\n"
                        "})});\n"
                        "export function buildDetail(id) {\n"
                        "  return `/analysis/reports/${encodeURIComponent(String(id))}`;\n"
                        "}\n"
                    ),
                    "lib/homeApi.js": (
                        "import { apiGet } from './client';\n"
                        "function buildQuery(params = {}) {\n"
                        "  const search = new URLSearchParams();\n"
                        "  Object.entries(params).forEach(([key, value]) => search.set(key, value));\n"
                        "  const query = search.toString();\n"
                        "  return query ? `?${query}` : '';\n"
                        "}\n"
                        "export function getHomeState(params = {}) {\n"
                        "  const query = buildQuery(params);\n"
                        "  return apiGet(`/home/state${query}`);\n"
                        "}\n"
                        "export function dynamic(path) { return apiGet(path); }\n"
                    ),
                    "screens/History.js": (
                        "import { apiGet } from '../lib/client';\n"
                        "import { buildDetail } from '../lib/contracts';\n"
                        "async function fetchKokoroWeatherReportDetail(reportId) {\n"
                        "  return apiGet(buildDetail(reportId));\n"
                        "}\n"
                        "export async function run(rid) {\n"
                        "  await fetchKokoroWeatherReportDetail(rid);\n"
                        "  return fetchKokoroWeatherReportDetail(rid);\n"
                        "}\n"
                    ),
                    "screens/Ranking.js": (
                        "import { apiFetch } from '../lib/client';\n"
                        "import { WIRE } from '../lib/contracts';\n"
                        "const API_BASE = 'https://example.test';\n"
                        "const PREVIEWS = [\n"
                        "  { endpoint:'/ranking/login_streak' },\n"
                        "  { endpoint:'/ranking/input_count' },\n"
                        "  { endpoint:'/ranking/input_length' },\n"
                        "  { endpoint:WIRE.routes.resonance },\n"
                        "];\n"
                        "async function fetchRankingPreview(config) {\n"
                        "  const url = new URL(config.endpoint, API_BASE);\n"
                        "  return apiFetch(url.toString(), { method:'GET' });\n"
                        "}\n"
                        "export function run() {\n"
                        "  return Promise.all(PREVIEWS.map(async (config) => fetchRankingPreview(config)));\n"
                        "}\n"
                    ),
                },
            )
            calls, errors = routes.extract_rn_calls(
                inventory_rows(repo, "Cocolon"),
                repo,
                HELPER,
            )
            self.assertFalse(errors)
            self.assertFalse(any(call["path"] == "lib/client.js" for call in calls))

            home = [
                call
                for call in calls
                if call["path"] == "lib/homeApi.js"
                and call["caller_symbol"] == "getHomeState"
            ]
            self.assertEqual(
                [{"/home/state"}],
                [set(call["normalized_path_candidates"]) for call in home],
            )

            dynamic = [
                call
                for call in calls
                if call["path"] == "lib/homeApi.js"
                and call["caller_symbol"] == "dynamic"
            ]
            self.assertEqual(1, len(dynamic))
            self.assertEqual("PATH_UNRESOLVED", dynamic[0]["extraction_status"])

            history = [
                call for call in calls if call["path"] == "screens/History.js"
            ]
            self.assertEqual(1, len(history))
            self.assertEqual(
                {"/analysis/reports/{param}"},
                set(history[0]["normalized_path_candidates"]),
            )
            self.assertEqual(
                "fetchKokoroWeatherReportDetail",
                history[0]["caller_symbol"],
            )

            ranking = [
                call for call in calls if call["path"] == "screens/Ranking.js"
            ]
            self.assertEqual(1, len(ranking))
            self.assertEqual(
                {
                    "/ranking/input_count",
                    "/ranking/input_length",
                    "/ranking/login_streak",
                    "/ranking/piece_resonances",
                },
                set(ranking[0]["normalized_path_candidates"]),
            )


if __name__ == "__main__":
    unittest.main()
