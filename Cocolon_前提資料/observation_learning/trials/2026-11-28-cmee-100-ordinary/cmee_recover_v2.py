"""Recover previously saved fictional v2 cases through ordinary owner reads."""

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
from urllib.parse import urlencode

from cmee_live_analysis import LiveAnalysisClient
from cmee_live_core import _IOS_PIECE_HEADERS, run_emlis
from cmee_live_finish import capture_map, read_rows, uuid
from cmee_run_1128 import ALLOWED_TIERS, PREFIX, SUPABASE_HOST, audit_write, material, safe_error, wire


def _query(path, **filters):
    return path + "?" + urlencode(filters)


def _admin_headers():
    if os.environ["SUPABASE_URL"].rstrip("/") != SUPABASE_HOST:
        raise RuntimeError("unexpected Supabase project")
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    if not key:
        raise RuntimeError("missing Supabase service role")
    return {"apikey": key, "Authorization": "Bearer " + key}


def recover_owner(case_id, tier, log, *, known_identity=None):
    if not re.fullmatch(r"CASE-(?:0[0-9][0-9]|100)", case_id) or case_id == "CASE-000" or tier not in ALLOWED_TIERS:
        raise ValueError("fixture identity")
    name = f"{PREFIX}-{case_id}-{tier}"
    admin = _admin_headers()
    profile_filter = {"id": "eq." + uuid(known_identity)} if known_identity else {"display_name": "eq." + name}
    path = _query("/rest/v1/profiles", **profile_filter, select="id,display_name,subscription_tier", limit=2)
    status, profiles = wire(SUPABASE_HOST, "GET", path, headers=admin)
    if status != 200 or not isinstance(profiles, list) or len(profiles) != 1:
        log("fixture_recovery_profile", "not_found" if status == 200 and profiles == [] else "not_unique_or_unavailable",
            {"http_status": status, "matches": len(profiles) if isinstance(profiles, list) else None})
        return None
    profile = profiles[0]
    identity = uuid(profile["id"])
    match = identity == uuid(known_identity) if known_identity else profile.get("display_name") == name
    if not match or profile.get("subscription_tier") != tier:
        log("fixture_recovery_profile", "profile_does_not_match_fixture")
        return None
    status, raw = wire(SUPABASE_HOST, "GET", "/auth/v1/admin/users/" + identity, headers=admin)
    owner = raw.get("user", raw) if isinstance(raw, dict) else {}
    email = owner.get("email") or ""
    prefix = f"{PREFIX}-{case_id.lower()}-{tier}-"
    if (status != 200 or owner.get("id") != identity or not owner.get("email_confirmed_at")
            or not re.fullmatch(re.escape(prefix) + r"[a-f0-9]{8}@example\.com", email)
            or (owner.get("user_metadata") or {}).get("display_name") != name):
        log("fixture_recovery_auth_user", "not_exact_fixture", {"http_status": status})
        return None
    log("fixture_recovery_profile", "exact_fixture")
    return {"case_tier": f"{case_id}:{tier}", "owner_id": identity, "email": email, "auth_mode": "admin_link"}


def authenticate_owner(owner, key, log):
    # Re-bind the caller to a verified existing fixture before asking Auth for a link.
    case_id, tier = owner["case_tier"].split(":", 1)
    prefix = f"{PREFIX}-{case_id.lower()}-{tier}-"
    if (not re.fullmatch(r"CASE-(?:0[0-9][0-9]|100)", case_id) or case_id == "CASE-000"
            or tier not in ALLOWED_TIERS or not key.startswith("sb_publishable_")
            or not re.fullmatch(re.escape(prefix) + r"[a-f0-9]{8}@example\.com", owner["email"])):
        raise ValueError("fixture auth configuration")
    identity = uuid(owner["owner_id"])
    status, raw = wire(SUPABASE_HOST, "POST", "/auth/v1/admin/generate_link", headers=_admin_headers(),
                       json_body={"type": "magiclink", "email": owner["email"]})
    if not isinstance(raw, dict):
        raw = {}
    user = raw.get("user", raw)
    properties = raw.get("properties", raw)
    token_hash = properties.get("hashed_token")
    if (status not in (200, 201) or user.get("id") != identity or user.get("email") != owner["email"]
            or not isinstance(token_hash, str) or not token_hash):
        log("fixture_recovery_auth", "link_not_bound", {"http_status": status, "error_code": safe_error(raw)})
        return None
    status, signed = wire(SUPABASE_HOST, "POST", "/auth/v1/verify", headers={"apikey": key},
                          json_body={"type": "magiclink", "token_hash": token_hash})
    valid = (status == 200 and isinstance(signed, dict) and (signed.get("user") or {}).get("id") == identity
             and isinstance(signed.get("access_token"), str) and bool(signed["access_token"]))
    log("fixture_recovery_auth", status, {"same_owner": valid})
    return signed["access_token"] if valid else None


def _timestamp(value):
    stamp = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if stamp.utcoffset() is None:
        stamp = stamp.replace(tzinfo=timezone.utc)
    return stamp.astimezone(timezone.utc)


def _matches_input(row, case):
    try:
        return (row.get("is_secret") is True and _timestamp(row["created_at"]) == _timestamp(case["created_at"])
                and (row.get("memo") or "") == (case.get("memo") or "")
                and (row.get("memo_action") or "") == (case.get("memo_action") or ""))
    except (AttributeError, KeyError, TypeError, ValueError):
        return False


def _recover_input(case, owner, request, log, *, known_input=None):
    path = _query("/emotion/history/search", secret_filter="secret", order="desc", limit=200)
    status, history = request("GET", path)
    if status == 200 and isinstance(history, dict) and history.get("user_id") == owner["owner_id"]:
        matches = [row for row in history.get("items", []) if _matches_input(row, case)]
        if known_input:
            matches = [row for row in matches if row.get("id") == known_input]
        if len(matches) == 1 and not (history.get("meta") or {}).get("has_more"):
            return uuid(matches[0]["id"])

    filters = {"id": "eq." + uuid(known_input)} if known_input else {"created_at": "eq." + _timestamp(case["created_at"]).isoformat()}
    path = _query("/rest/v1/emotions", **filters, user_id="eq." + owner["owner_id"], is_secret="eq.true",
                  select="id,user_id,memo,memo_action,created_at,is_secret", limit=25)
    status, rows = wire(SUPABASE_HOST, "GET", path, headers=_admin_headers())
    if status != 200 or not isinstance(rows, list):
        log("input_recovery", "owner_storage_unavailable", {"http_status": status, "error_code": safe_error(rows)})
        return None
    matches = [row for row in rows if row.get("user_id") == owner["owner_id"] and _matches_input(row, case)]
    if len(matches) != 1 or len(rows) == 25:
        log("input_recovery", "not_found_or_ambiguous", {"matches": len(matches), "owner_rows_at_stamp": len(rows),
            "owner_rows_with_exact_text": sum((row.get("memo") or "") == (case.get("memo") or "")
                and (row.get("memo_action") or "") == (case.get("memo_action") or "") for row in rows)})
        return None
    log("input_recovery", "exact_private_owner_input")
    return uuid(matches[0]["id"])


def _recover_saved_piece(owner, input_id, request, log):
    status, rows = wire(SUPABASE_HOST, "GET", _query("/rest/v1/piece_records",
                        owner_user_id="eq." + owner["owner_id"], source_input_id="eq." + input_id,
                        lifecycle_status="eq.saved", visibility_scope="eq.private",
                        select="id,owner_user_id,source_input_id,lifecycle_status,visibility_scope", limit=2),
                        headers=_admin_headers())
    if status != 200 or not isinstance(rows, list) or len(rows) != 1:
        log("piece_recovery", "not_saved" if status == 200 and rows == [] else "not_unique_or_unavailable",
            {"http_status": status, "matches": len(rows) if isinstance(rows, list) else None})
        return
    row = rows[0]
    if (row.get("owner_user_id") != owner["owner_id"] or row.get("source_input_id") != input_id
            or row.get("lifecycle_status") != "saved" or row.get("visibility_scope") != "private"):
        log("piece_recovery", "source_binding_mismatch")
        return
    identity = uuid(row["id"])
    steps = []
    headers = {"Cache-Control": "no-store", **_IOS_PIECE_HEADERS}
    for kind, suffix in (("saved_detail", ""), ("export_recipe", "/export")):
        status, value = request("GET", "/emotion/piece/" + identity + suffix, headers=headers)
        steps.append({"step": kind, "http_status": status, "body": value})
    detail, export = (step["body"] for step in steps)
    matched = [step["http_status"] == 200 and isinstance(step["body"], dict)
               and step["body"].get("piece_id") == identity and step["body"].get("visibility_scope") == "private"
               for step in steps]
    keys = ("row_version", "piece_text", "piece_text_hash", "content_payload_hash", "visual_recipe_hash")
    equal = all(matched) and all(key in detail and key in export and detail[key] == export[key] for key in keys)
    log("piece", "saved", {"piece_id": identity, "steps": steps, "source_binding_matches": True,
                             "same_saved_detail": matched[0], "same_export_recipe": equal})


def _recover_case(case, tier, owner, token, log, *, emlis_wait, map_wait, known_input=None):
    base = "http://127.0.0.1:" + str(int(os.environ["PORT"]))

    def request(method, path, *, json=None, headers=None, timeout=45):
        if method != "GET":
            raise RuntimeError("recovery product routes are read-only")
        return wire(base, method, path, json_body=json, timeout=timeout,
                    headers={"Authorization": "Bearer " + token, **(headers or {})})

    input_id = _recover_input(case, owner, request, log, known_input=known_input)
    if not input_id:
        return
    emlis = run_emlis(request, {**material(case), "emlis_question_action": "leave_pending"},
                      run_id=f"{PREFIX}:{tier}", input_id=input_id, wait_seconds=emlis_wait)
    if case.get("answer"):
        answers = {event["event_id"] for step in emlis["steps"] for event in step.get("body", {}).get("timeline", [])
                   if event.get("kind") == "ANSWER" and event.get("text") == case["answer"] and event.get("event_id")}
        if len(answers) == 1:
            emlis["answer_id"] = uuid(answers.pop())
    log("input", "saved", emlis)
    _recover_saved_piece(owner, input_id, request, log)
    analysis = LiveAnalysisClient(base, token, allow_http_loopback=True)
    insight = analysis.deep_insight_state()
    log("deep_insight_state", 200, insight)
    for lane, name in (("theme", "theme"), ("records", "records_question")):
        question = insight.get(lane)
        if not question:
            question = next((item for item in insight.get("history", []) if item.get("lane") == lane), None)
        if question:
            log(name, "existing", {"result": {"status": "existing", "question": question},
                                   "saved_reopen": analysis.read_deep_insight_question(uuid(question["id"]))})
        else:
            log(name, "no_saved_question" if insight.get("can_use_" + lane) else "locked")
    current, _ = capture_map(analysis, log, wait=map_wait, capture_stage="map")
    if tier == "premium" and current.get("has_visible_content"):
        log("if_route", "saved_read", {"scenario_sets": analysis.read_if_scenario_sets(limit=20),
                                        "saved_intents": analysis.read_saved_route_intents(limit=20)})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cases", type=Path)
    parser.add_argument("results_dir", type=Path)
    parser.add_argument("--first", type=int, default=1)
    parser.add_argument("--last", type=int, default=100)
    parser.add_argument("--case", type=int, action="append", help="Recover only this numbered case. Repeatable.")
    parser.add_argument("--owner-ids", type=Path, help="Exact known fixture UUIDs by CASE-NNN:tier; verify against Auth.")
    parser.add_argument("--input-ids", type=Path, help="Exact known input UUIDs by CASE-NNN:tier; verify owner, stamp and text.")
    parser.add_argument("--tiers", nargs="+", choices=ALLOWED_TIERS, default=ALLOWED_TIERS)
    parser.add_argument("--emlis-wait", type=float, default=0)
    parser.add_argument("--map-wait", type=float, default=0)
    args = parser.parse_args()
    os.umask(0o077)
    data = json.loads(args.cases.read_text(encoding="utf-8"))
    cases = data["cases"]
    if (data.get("all_fictional") is not True or [case["id"] for case in cases] != [f"CASE-{i:03}" for i in range(1, 101)]
            or not 1 <= args.first <= args.last <= 100 or min(args.emlis_wait, args.map_wait) < 0):
        parser.error("invalid fictional manifest, range or wait")
    key = os.environ["CMEE_EVALUATION_PUBLISHABLE_KEY"]
    if not key.startswith("sb_publishable_"):
        parser.error("normal Auth requires the publishable key")
    folder = args.results_dir
    folder.mkdir(parents=True, exist_ok=True)
    tracker = folder / "results.jsonl"
    fixture_file = folder / "owners.private.jsonl"
    saved_owners = {row["case_tier"] for row in read_rows(fixture_file)}
    order = list(dict.fromkeys(args.case or range(args.first, args.last + 1)))
    if any(not args.first <= index <= args.last for index in order):
        parser.error("selected cases must be inside the recovery range")
    known_owners = json.loads(args.owner_ids.read_text(encoding="utf-8")) if args.owner_ids else None
    known_inputs = json.loads(args.input_ids.read_text(encoding="utf-8")) if args.input_ids else {}
    for case in (cases[index - 1] for index in order):
        case_id = case["id"]
        for tier in dict.fromkeys(args.tiers):
            def log(stage, status, body=None):
                audit_write(tracker, {"case_id": case_id, "tier": tier, "stage": stage, "status": status,
                                      "body": body, "utc": datetime.now(timezone.utc).isoformat()})
                print(case_id, tier, stage, status, flush=True)

            try:
                identity = known_owners.get(f"{case_id}:{tier}") if known_owners is not None else None
                if known_owners is not None and not identity:
                    log("fixture_recovery_profile", "no_known_owner")
                    continue
                owner = recover_owner(case_id, tier, log, known_identity=identity)
                if owner:
                    if owner["case_tier"] not in saved_owners:
                        audit_write(fixture_file, owner)
                        saved_owners.add(owner["case_tier"])
                    token = authenticate_owner(owner, key, log)
                    if token:
                        _recover_case(case, tier, owner, token, log, emlis_wait=args.emlis_wait, map_wait=args.map_wait,
                                      known_input=known_inputs.get(f"{case_id}:{tier}"))
            except Exception as error:
                log("recover_error", type(error).__name__)


if __name__ == "__main__":
    main()
