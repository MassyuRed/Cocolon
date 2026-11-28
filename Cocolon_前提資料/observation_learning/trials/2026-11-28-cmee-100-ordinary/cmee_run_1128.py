"""Fictional ordinary Emlis API evaluation. Run on the existing Render service."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import secrets
import sys
from time import monotonic, sleep
import urllib.error
import urllib.request
from uuid import UUID

from cmee_live_analysis import LiveAnalysisClient, if_route_branch_options, run_if_flow
from cmee_live_core import input_payload, run_emlis, run_piece

SUPABASE_HOST = "https://oeahmpmigszggnkyiivq.supabase.co"
ALLOWED_TIERS = ("free", "plus", "premium")
PREFIX = "cmee-sample-20261128-v1"


class NoRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


opener = urllib.request.build_opener(NoRedirects())


def wire(base, method, path, *, json_body=None, headers=None, timeout=45):
    if not path.startswith("/") or path.startswith("//"):
        raise ValueError("not an ordinary relative API path")
    payload = None if json_body is None else json.dumps(json_body, ensure_ascii=False).encode()
    req = urllib.request.Request(base + path, data=payload, method=method,
                                 headers={"Content-Type": "application/json", **(headers or {})})
    try:
        response = opener.open(req, timeout=timeout)
    except urllib.error.HTTPError as exc:
        response = exc
    with response as read:
        raw = read.read()
        try:
            body = json.loads(raw or "{}")
        except ValueError:
            body = {"non_json_response": True}
        return read.code, body


def safe_error(body):
    if not isinstance(body, dict):
        return None
    val = body.get("error_code") or body.get("code") or body.get("detail")
    if isinstance(val, str) and val.replace("_", "").replace("-", "").isalnum() and len(val) < 100:
        return val
    return None


def audit_write(file, row):
    with file.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(row, ensure_ascii=False) + "\n")
        stream.flush()
        os.fsync(stream.fileno())


def read_rows(file):
    if not file.exists():
        return []
    return [json.loads(line) for line in file.read_text(encoding="utf-8").splitlines() if line]


def checked_id(value):
    return str(UUID(str(value)))


def setup_owner(case_id, tier, folder, public_key, log):
    supabase = os.environ["SUPABASE_URL"].rstrip("/")
    if supabase != SUPABASE_HOST:
        raise RuntimeError("unexpected Supabase project")
    admin_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    admin = {"apikey": admin_key, "Authorization": "Bearer " + admin_key}
    key = case_id + ":" + tier
    owner_file = folder / "owners.private.jsonl"
    previous = next((v for v in read_rows(owner_file) if v["case_tier"] == key), None)
    if previous is None:
        email = f"{PREFIX}-{case_id.lower()}-{tier}-{secrets.token_hex(4)}@example.com"
        password = secrets.token_urlsafe(32)
        status, value = wire(supabase, "POST", "/auth/v1/admin/users", headers=admin, json_body={
            "email": email, "password": password, "email_confirm": True,
            "user_metadata": {"display_name": f"{PREFIX}-{case_id}-{tier}"},
        })
        log("fixture_user", status, {"error_code": safe_error(value)})
        if status not in (200, 201):
            return None
        previous = {"case_tier": key, "owner_id": checked_id(value.get("id") or value.get("user", {}).get("id")),
                    "email": email, "password": password}
        audit_write(owner_file, previous)
    if not previous["email"].endswith("@example.com") or not previous["email"].startswith(PREFIX + "-"):
        raise RuntimeError("not an evaluation owner")
    owner = checked_id(previous["owner_id"])
    endpoint = f"/rest/v1/profiles?id=eq.{owner}&select=id,subscription_tier"
    status, value = wire(supabase, "PATCH", endpoint, json_body={"subscription_tier": tier},
                         headers={**admin, "Prefer": "return=representation"})
    matches = status == 200 and value == [{"id": owner, "subscription_tier": tier}]
    log("fixture_tier", status, {"matches": matches})
    if not matches:
        return None
    status, value = wire(supabase, "POST", "/auth/v1/token?grant_type=password",
                         json_body={k: previous[k] for k in ("email", "password")},
                         headers={"apikey": public_key})
    log("owner_sign_in", status, {"error_code": safe_error(value)})
    if status != 200 or checked_id(value["user"]["id"]) != owner:
        return None
    return value["access_token"]


def material(case):
    case = dict(case)
    case["case_id"] = case["id"]
    case["is_secret"] = True
    case["emotions"] = case["emotion_details"]
    action = {"off": "disabled", "answer": "leave_pending", "skip": "skip",
              "answer_then_skip": "leave_pending"}
    case["emlis_question_action"] = action[case["question_mode"]]
    if "answer" in case:
        case["answer_text"] = case["answer"]
    return case


def once(case, tier, folder, key, *, map_wait, history_limit, phase):
    tracker = folder / "results.jsonl"
    case_id = case["id"]
    last = read_rows(tracker)
    present = [r for r in last if r.get("case_id") == case_id and r.get("tier") == tier]
    completed_stages = {item["stage"] for item in present}
    if phase == "snapshot" and "input" not in completed_stages:
        return
    def log(stage, status, body=None):
        audit_write(tracker, dict(case_id=case_id, tier=tier, stage=stage,
                                 status=status, body=body, utc=datetime.now(timezone.utc).isoformat()))
        print(case_id, tier, stage, status, flush=True)

    if "input" in completed_stages and phase != "snapshot":
        log("paused_existing_case", "existing_input", {"next_phase": "snapshot"})
        return
    token = setup_owner(case_id, tier, folder, key, log)
    if not token:
        return
    base = "http://127.0.0.1:" + os.environ["PORT"]

    def request(method, path, *, json=None, headers=None, timeout=45):
        return wire(base, method, path, json_body=json,
                    headers={"Authorization": "Bearer " + token, **(headers or {})}, timeout=timeout)

    # Ordinary app routes must independently see the fixture's rights.
    status, state = request("GET", "/deep-insight", timeout=25)
    log("deep_insight_state", status, state)
    if status != 200 or state.get("can_use_records") != (tier == "premium"):
        log("tier_gate", "mismatch", {"can_use_records": state.get("can_use_records")})
        return
    analysis = LiveAnalysisClient("https://mashos-api.onrender.com", token)
    if phase == "snapshot":
        capture_map(case, tier, folder, request, analysis, log, map_wait=map_wait, confirm_refresh=False)
        return

    if history_limit is not None and len(case["history"]) > history_limit:
        log("history", "blocked_by_batch_history_limit", {"records": len(case["history"])})
        return
    if {"history", "history_row"} & completed_stages:
        log("paused_history_state", "manual_resume_required")
        return
    for index, history in enumerate(case["history"], 1):
        historic = input_payload({**history, "emotions": history["emotion_details"],
                                  "is_secret": True, "emlis_question_action": "disabled"})
        status, result = request("POST", "/emotion/submit", json=historic, timeout=120)
        log("history_row", status, {"index": index, "saved": isinstance(result, dict) and bool(result.get("id"))})
        if status != 200 or not result.get("id"):
            return
    log("history", "saved", {"records": len(case["history"])})
    observed = run_emlis(request, material(case), run_id=PREFIX + ":" + tier)
    log("input", "saved" if observed["input_id"] else "not_saved", observed)
    if not observed["input_id"]:
        return

    piece = run_piece(request, material(case), observed, run_id=PREFIX + ":" + tier)
    log("piece", "saved" if piece["piece_id"] else "not_saved", piece)
    try:
        from cmee_live_common import run_common
        log("common", "api_reads", run_common(request))
    except (ImportError, OSError, RuntimeError) as error:
        log("common", type(error).__name__)

    if not state.get("can_use_theme"):
        log("theme", "unavailable", state.get("can_use_theme"))
    else:
        try:
            issued = analysis.issue_deep_insight("theme", case["theme"], timeout=105)
            question = issued.get("question")
            log("theme", issued.get("status"), dict(result=issued,
                saved_reopen=analysis.read_deep_insight_question(question["id"]) if question else None))
        except Exception as error:
            log("theme", type(error).__name__, str(error))
    if tier == "premium":
        try:
            issued = analysis.issue_deep_insight("records", timeout=105)
            question = issued.get("question")
            log("records_question", issued.get("status"), dict(result=issued,
                saved_reopen=analysis.read_deep_insight_question(question["id"]) if question else None))
        except Exception as error:
            log("records_question", type(error).__name__, str(error))
    else:
        log("records_question", "locked", {"can_use_records": False})
    capture_map(case, tier, folder, request, analysis, log, map_wait=map_wait, confirm_refresh=True)


def capture_map(case, tier, folder, request, analysis, log, *, map_wait, confirm_refresh):
    try:
        status = analysis.map_status()
        marker = analysis.request_current_map() if confirm_refresh else status
        if map_wait and marker.get("refresh_status") in ("queued", "running"):
            marker = analysis.wait_current_map(timeout=map_wait, poll_interval=8,
                initial_refresh_status=marker["refresh_status"], baseline_version=status.get("version_key"))
        current = analysis.read_current_map()
        monthly = analysis.read_monthly_maps(limit=12)
        log("map", marker.get("refresh_status"), {"marker": marker, "current": current, "monthly": monthly})
        if tier != "premium":
            log("if_route", "locked" if current.get("map_subscription_tier") == tier else "tier_unconfirmed")
            return
        choices = if_route_branch_options(analysis)
        if choices["status"] != "ready":
            log("if_route", choices["status"], choices)
            return
        intent = "この場面で次に取り得る行動と、それを選び直す条件を考えたいです。"
        constraints = case.get("scenario_constraint") or []
        if isinstance(constraints, str):
            constraints = [constraints]
        attempt_key = hashlib.sha256((PREFIX + case["id"] + ":if").encode()).hexdigest()[:32]
        result = run_if_flow(analysis, branch_point_id=choices["branches"][0]["id"], intent=intent,
            constraints=constraints, scenario_choices=case.get("scenario_choice_texts") or (),
            candidate_count=2, constraints_confirmed=True, idempotency_key=attempt_key, timeout=210)
        log("if_route", result.get("status"), result)
    except Exception as error:
        log("map_or_if", type(error).__name__, str(error))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cases", type=Path)
    parser.add_argument("results_dir", type=Path)
    parser.add_argument("--first", type=int, required=True)
    parser.add_argument("--last", type=int, required=True)
    parser.add_argument("--tiers", nargs="+", choices=ALLOWED_TIERS, default=ALLOWED_TIERS)
    parser.add_argument("--history-limit", type=int, default=12)
    parser.add_argument("--map-wait", type=int, default=0)
    parser.add_argument("--cooldown", type=float, default=5)
    parser.add_argument("--phase", choices=("main", "snapshot"), default="main")
    args = parser.parse_args()
    os.umask(0o077)
    data = json.loads(args.cases.read_text(encoding="utf-8"))
    cases = data["cases"]
    ids = [f"CASE-{index:03}" for index in range(1, 101)]
    if data["all_fictional"] is not True or [case["id"] for case in cases] != ids:
        parser.error("incorrect fictional manifest")
    if not 1 <= args.first <= args.last <= len(cases):
        parser.error("invalid case range")
    args.results_dir.mkdir(parents=True, exist_ok=True)
    key = os.environ["CMEE_EVALUATION_PUBLISHABLE_KEY"]
    if not key.startswith("sb_publishable_"):
        parser.error("normal Auth requires the publishable key")
    for case in cases[args.first - 1:args.last]:
        for tier in args.tiers:
            try:
                once(case, tier, args.results_dir, key, map_wait=args.map_wait,
                     history_limit=args.history_limit, phase=args.phase)
            except Exception as error:
                audit_write(args.results_dir / "results.jsonl", dict(case_id=case["id"], tier=tier,
                             stage="coordinator_error", status=type(error).__name__))
                print(case["id"], tier, "coordinator_error", type(error).__name__, flush=True)
            sleep(args.cooldown)


if __name__ == "__main__":
    main()
