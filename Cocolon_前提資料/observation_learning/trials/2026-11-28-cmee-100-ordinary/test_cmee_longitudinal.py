from datetime import date
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from unittest import TestCase
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit
from uuid import UUID

import json

from cmee_live_analysis import AnalysisAPIError
from cmee_longitudinal import TIERS, evaluate, local_call, local_origin, review_answers, timeline


DAY = date(2026, 11, 27)


class FixtureSession:
    def __init__(self, tier, index):
        self.tier = tier
        self.owner_id = str(UUID(int=index))
        self.sequence = index * 100
        self.rows = []
        self.question = None
        self.sent = []
        self.map_waiting = False

    def request(self, method, path, *, json=None, headers=None, timeout=None):
        self.sent.append((method, path))
        if path == "/subscription/me":
            return 200, {"user_id": self.owner_id, "subscription_tier": self.tier}
        if path.startswith("/follow/stats?"):
            return 200, {"target_user_id": self.owner_id, "following_count": 0, "follower_count": 0}
        if path == "/account/profile/me":
            return 200, {"user_id": self.owner_id}
        if path == "/emotion/submit":
            assert json["send_emotion_notification"] is False
            assert not self.rows or self.rows[-1]["created_at"] < json["created_at"]
            self.sequence += 1
            row = {**json, "id": str(UUID(int=self.sequence)), "emotion_details": json["emotions"]}
            self.rows.append(row)
            return 200, {"id": row["id"], "created_at": row["created_at"]}
        if path.startswith("/emlis/threads/by-input/"):
            return 200, {"state": "COMPLETED", "current_observation": {"text": "fixture transport only"}}
        if path == "/emotion/history/search":
            flags = {"public": False, "secret": True}
            visible = [row for row in self.rows
                       if json["secret_filter"] == "all" or row["is_secret"] == flags[json["secret_filter"]]]
            return 200, {"user_id": self.owner_id, "items": visible, "meta": {"has_more": False}}
        if path.startswith("/analysis/kokoro-weather?"):
            query = parse_qs(urlsplit(path).query)
            assert query["anchor"] == [DAY.isoformat()]
            start = {"today": DAY.isoformat(), "week": "2026-11-23", "month": "2026-11-01"}[query["period"][0]]
            # Input timestamps are UTC. Compare against the fixture's saved JST dates.
            rows = [row for row, case in zip(self.rows, timeline(DAY))
                    if not row["is_secret"] and case["created_at"][:10] >= start]
            return 200, {
                "period": query["period"][0], "start_date": start, "end_date": DAY.isoformat(),
                "summary": {"input_count": len(rows)},
            }
        if path.startswith("/emotion/piece/source-ref/"):
            return 422, {"error_code": "PIECE_SOURCE_NOT_ELIGIBLE"}
        return 200, {}

    def deep_insight_state(self):
        return {"can_use_theme": True, "can_use_records": self.tier == "premium"}

    def issue_deep_insight(self, lane, theme):
        if lane == "records" and self.tier != "premium":
            raise AnalysisAPIError("POST", "/deep-insight/questions", status=403, code="deep_insight_records_locked")
        identity = str(UUID(int=self.sequence + (50 if lane == "theme" else 51)))
        self.question = {"id": identity, "question_text": "先に確かめたいことは何ですか。",
                         "lane": lane, "answered_at": None}
        return {"status": "issued", "question": self.question}

    def read_deep_insight_question(self, identity):
        assert identity == self.question["id"]
        return self.question

    def answer_deep_insight(self, identity, answer):
        assert identity == self.question["id"]
        self.question = {**self.question, "answer_text": answer, "answered_at": DAY.isoformat()}
        return {"question": self.question}

    def map_status(self):
        return {"refresh_status": "running" if self.map_waiting else "ready", "version_key": "unchanged"}

    def request_current_map(self):
        return self.map_status()

    def wait_current_map(self, **kwargs):
        raise TimeoutError

    def read_current_map(self):
        return {"has_visible_content": False, "map_subscription_tier": self.tier}

    def read_monthly_maps(self, limit):
        return {"items": []}

    def read_if_scenario_sets(self, limit):
        raise AnalysisAPIError("GET", "/analysis/if-route/scenario-sets", status=403, code="analysis_if_locked")


class LongitudinalTests(TestCase):
    def setUp(self):
        self.folder = self.enterContext(TemporaryDirectory())
        self.trace_path = Path(self.folder) / "trace.jsonl"
        self.clients = {tier: FixtureSession(tier, index) for index, tier in enumerate(TIERS, 1)}
        self.owners = {tier: {"owner_id": client.owner_id} for tier, client in self.clients.items()}
        self.cases = timeline(DAY)

    def run_stage(self, stage, answers=None):
        sessions = {tier: (client.request, client) for tier, client in self.clients.items()}
        with self.trace_path.open("a+", encoding="utf-8") as trace:
            trace.seek(0)
            evaluate(stage, DAY, self.cases, self.owners, sessions, trace, answers, map_wait=0.1, emlis_wait=0)

    def trace(self):
        return [json.loads(line) for line in self.trace_path.read_text().splitlines()]

    def test_three_fixed_tier_owners_get_same_chronological_inputs(self):
        self.run_stage("baseline")
        self.run_stage("contrast")
        premium_question = self.clients["premium"].question
        answers = Path(self.folder) / "answers.json"
        answers.write_text(json.dumps([{
            "tier": "premium", "lane": "records", "question_id": premium_question["id"],
            "question_text": premium_question["question_text"], "answer_text": "集計が先に終わるか確かめます。",
        }]))
        self.run_stage("followup", answers)
        finished = [row for row in self.trace() if row["event"] == "stage_finished"]
        self.assertEqual([row["body"]["inputs_reopened_by_tier"] for row in finished],
                         [{tier: count for tier in TIERS} for count in (2, 6, 7)])
        for tier, client in self.clients.items():
            self.assertEqual({row["memo"] for row in client.rows}, {case["memo"] for case in self.cases})
            tier_rows = [row for row in self.trace() if row["tier"] == tier]
            common = [row["body"] for row in tier_rows if row["event"] == "common"]
            daily = [step for item in common for step in item["steps"] if step["step"] == "kokoro_today"]
            self.assertEqual([step["observed_input_count"] for step in daily], [0, 1, 2])
            self.assertTrue(all(step["matches_expected_count"] for step in daily))
            if tier != "premium":
                self.assertTrue(any(row["event"] == "if_route_access"
                                    and row["body"].get("http_status") == 403 for row in tier_rows))
        self.assertTrue(any(row["event"] == "answer" and row["body"]["exact_answer_reopened"] for row in self.trace()))
        self.assertFalse(any(row["event"] == "if_route" and row["body"].get("status") == "GENERATED"
                             for row in self.trace()))

    def test_preflight_rejects_wrong_tier_or_order_before_input(self):
        with self.assertRaisesRegex(RuntimeError, "in order"):
            self.run_stage("contrast")
        self.clients["premium"].tier = "plus"
        with self.assertRaisesRegex(RuntimeError, "subscription mismatch"):
            self.run_stage("baseline")
        self.assertEqual(self.trace(), [])
        self.assertTrue(all(not client.rows for client in self.clients.values()))

    def test_unknown_input_outcome_stops_replay(self):
        with patch("cmee_longitudinal.run_emlis", return_value={"input_id": None}):
            with self.assertRaisesRegex(RuntimeError, "no new confirmed ID"):
                self.run_stage("baseline")
        rows = self.trace()
        self.assertTrue(any(row["event"] == "stage_started" for row in rows))
        self.assertFalse(any(row["event"] == "stage_finished" for row in rows))
        with self.assertRaisesRegex(RuntimeError, "interrupted stage"):
            self.run_stage("baseline")
        self.assertEqual(self.trace(), rows)

    def test_unreviewed_answer_cannot_write(self):
        path = Path(self.folder) / "answers.json"
        path.write_text(json.dumps([{
            "tier": "premium", "lane": "records", "question_id": str(UUID(int=15)),
            "question_text": "別の問いです。", "answer_text": "このまま回答しない。",
        }]))
        with self.assertRaisesRegex(ValueError, "reviewed, unanswered"):
            review_answers(path, [])

    def test_map_timeout_remains_in_trace(self):
        for client in self.clients.values():
            client.map_waiting = True
        self.run_stage("baseline")
        reports = [row["body"] for row in self.trace() if row["event"] == "map"]
        self.assertEqual(len(reports), 3)
        self.assertTrue(all(report["wait_error"] == "still_pending_at_deadline"
                            and not report["version_changed"] for report in reports))

    def test_remote_origins_and_redirects_are_rejected(self):
        for unsupported in ("https://mashos-api.onrender.com", "http://127.0.0.1:8000/x", "localhost:8000",
                            "http://127.0.0.1", "http://127.0.0.1:8000@remote.test", "http://10.0.0.1:8000"):
            with self.subTest(origin=unsupported), self.assertRaises(ValueError):
                local_origin(unsupported)
        with self.assertRaises(ValueError):
            local_call("https://mashos-api.onrender.com", "GET", "/healthz")

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(302)
                self.send_header("Location", "https://example.invalid")
                self.end_headers()

            def log_message(self, format, *args):
                pass

        with ThreadingHTTPServer(("127.0.0.1", 0), Handler) as server:
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                origin = local_origin(f"http://127.0.0.1:{server.server_port}")
                self.assertEqual(local_call(origin, "GET", "/")[0], 302)
            finally:
                server.shutdown()
                thread.join(timeout=1)
