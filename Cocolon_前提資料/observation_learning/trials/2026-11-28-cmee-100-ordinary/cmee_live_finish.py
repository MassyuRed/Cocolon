"""Finish previously started fictional Cocolon cases on their existing owners."""

import argparse
import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from uuid import UUID

from cmee_live_analysis import AnalysisAPIError, LiveAnalysisClient, if_route_branch_options
from cmee_live_core import _IOS_PIECE_HEADERS, run_emlis, run_piece
from cmee_run_1128 import ALLOWED_TIERS, PREFIX, SUPABASE_HOST, audit_write, material, safe_error, wire

IDS = [f"CASE-{index:03}" for index in range(1, 101)]
ACTIVE_MAP = {"queued", "running"}
WAIT_THREAD = {"NOT_CREATED", "INITIALIZING", "REFINING"}
NO_IF_WRITE = {"map_unavailable", "no_branch", "branch_unavailable", "tier_unconfirmed", "locked"}


def read_rows(path):
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    return [json.loads(line) for line in lines if line.strip() and line.endswith("\n")]


def uuid(value):
    identity = UUID(str(value))
    if not identity.int:
        raise ValueError("missing identity")
    return str(identity)


def body(row):
    return (row or {}).get("body") or {}


def stage(rows, name):
    return next((row for row in reversed(rows) if row.get("stage") == name), None)


def session(case_id, tier, owners, key, log):
    owner_rows = [row for row in owners if row.get("case_tier") == f"{case_id}:{tier}"]
    if len(owner_rows) != 1:
        log("finish_auth", "existing_owner_not_unique")
        return None
    owner = owner_rows[0]
    email = owner.get("email", "")
    if not email.startswith(f"{PREFIX}-{case_id.lower()}-{tier}-") or not email.endswith("@example.com"):
        log("finish_auth", "fixture_owner_not_bound")
        return None
    expected = uuid(owner["owner_id"])
    if os.environ["SUPABASE_URL"].rstrip("/") != SUPABASE_HOST or not key.startswith("sb_publishable_"):
        raise RuntimeError("unexpected authentication configuration")
    status, signed = wire(SUPABASE_HOST, "POST", "/auth/v1/token?grant_type=password",
                          headers={"apikey": key}, json_body={"email": email, "password": owner["password"]})
    matches = status == 200 and uuid(signed.get("user", {}).get("id")) == expected
    log("finish_auth", status, {"same_owner": matches})
    if not matches:
        return None
    base = "http://127.0.0.1:" + str(int(os.environ["PORT"]))
    token = signed["access_token"]
    analysis = LiveAnalysisClient(base, token, allow_http_loopback=True)

    def request(method, path, *, json=None, headers=None, timeout=45):
        return wire(base, method, path, json_body=json, timeout=timeout,
                    headers={"Authorization": "Bearer " + token, **(headers or {})})

    access = analysis.map_status()
    if access.get("map_subscription_tier") != tier:
        log("finish_tier", "mismatch", {"server_tier": access.get("map_subscription_tier")})
        return None
    return request, analysis


def resume_emlis(case, tier, rows, request, log, emlis_wait):
    prior = body(stage(rows, "emlis_finish")) or body(stage(rows, "input"))
    input_id = uuid(prior["input_id"])
    reads = [step for step in prior.get("steps", []) if step["step"].startswith("first_read:")]
    initial = reads[-1] if reads else {}
    if prior.get("first_state") not in WAIT_THREAD and initial.get("http_status") != 404:
        return prior
    result = run_emlis(request, {**material(case), "emlis_question_action": "leave_pending"},
                       run_id=f"{PREFIX}:{tier}", input_id=input_id, wait_seconds=emlis_wait)
    if prior.get("answer_id"):
        result["answer_id"] = prior["answer_id"]
    log("emlis_finish", result.get("first_state") or "not_read", result)
    return result


def resume_piece(case, tier, rows, emlis, request, log):
    previous = body(stage(rows, "piece_finish")) or body(stage(rows, "piece"))
    if not previous:
        return
    if previous.get("piece_id"):
        identity = uuid(previous["piece_id"])
        checks = []
        for suffix in ("", "/export"):
            status, result = request("GET", "/emotion/piece/" + identity + suffix,
                                     headers={"Cache-Control": "no-store", **_IOS_PIECE_HEADERS})
            checks.append({"http_status": status, "same_private_piece": status == 200
                           and result.get("piece_id") == identity and result.get("visibility_scope") == "private"})
        log("piece_finish_reopen", "read", {"piece_id": identity, "checks": checks})
        return
    steps = previous.get("steps", [])
    # A cross-check by GET is safe only when the first attempt never reached a preview/save write.
    if previous.get("stop") != "piece_source_not_confirmed" or any(s["step"] != "source" for s in steps):
        return
    source_step = steps[-1] if steps else {}
    source_error = safe_error(source_step.get("body"))
    if source_step.get("http_status") not in {404, 409, 422, 503} or source_error in {
        "PIECE_FEATURE_DISABLED", "PIECE_AUTH_REQUIRED", "PIECE_REQUEST_INVALID",
    }:
        return
    if case.get("piece_use_answer") and not emlis.get("answer_id"):
        return
    source_id = uuid(emlis["input_id"])
    path = "/emotion/piece/source-ref/" + source_id
    if case.get("piece_use_answer"):
        path += "?" + urlencode({"supplemental_answer_identity": uuid(emlis["answer_id"])})
    status, source = request("GET", path, headers={"Cache-Control": "no-store", **_IOS_PIECE_HEADERS})
    if status != 200 or source.get("source_input_id") != source_id:
        log("piece_source_finish", status, {"error_code": safe_error(source)})
        return
    result = run_piece(request, material(case), emlis, run_id=f"{PREFIX}:{tier}")
    log("piece_finish", "saved" if result.get("piece_id") else "not_saved", result)


def capture_map(analysis, log, *, wait, baseline=None, capture_stage="map_finish"):
    marker = analysis.map_status()
    initial = marker
    wait_error = None
    if wait and marker.get("refresh_status") in ACTIVE_MAP:
        try:
            settled = analysis.wait_current_map(
                timeout=wait, poll_interval=8, initial_refresh_status=marker["refresh_status"],
                baseline_version=(baseline or marker).get("version_key"),
            )
            marker = settled["status"]
        except TimeoutError:
            wait_error = "still_pending_at_deadline"
            marker = analysis.map_status()
    current = analysis.read_current_map()
    monthly = analysis.read_monthly_maps(limit=12)
    evidence = {"initial_marker": initial, "marker": marker, "current": current, "monthly": monthly,
                "wait_error": wait_error}
    if baseline is not None:
        previous = baseline.get("version_key")
        updated = marker.get("version_key")
        evidence["version_changed"] = bool(updated and previous != updated)
        evidence["current_matches_status"] = (current.get("meta") or {}).get("projection_of") == updated
    log(capture_stage, marker.get("refresh_status"), evidence)
    return current, marker


def if_payload(case, current):
    graph = current.get("meta") or {}
    if current.get("map_subscription_tier") != "premium" or graph.get("wire_kind") != "watashi.map.v3":
        return None
    branch = next((item[key] for group, key in (("nodes", "node_ref"), ("edges", "edge_ref"))
                   for item in graph.get(group, []) if item.get(key)), None)
    if not branch or not graph.get("projection_of"):
        return None
    constraints = case.get("scenario_constraint") or []
    if isinstance(constraints, str):
        constraints = [constraints]
    return {"base_map_ref": graph["projection_of"], "branch_point_id": branch,
            "intent": "この場面で次に取り得る行動と、それを選び直す条件を考えたいです。",
            "constraints": constraints, "scenario_choices": case.get("scenario_choice_texts") or [],
            "candidate_count": 2, "constraints_confirmed": True,
            "idempotency_key": hashlib.sha256((PREFIX + case["id"] + ":if").encode()).hexdigest()[:32]}


def resume_if(case, tier, rows, analysis, current, marker, log, resume_pending):
    earlier_finish = stage(rows, "if_finish")
    earlier_main = stage(rows, "if_route")
    earlier = earlier_finish or earlier_main
    previous = (earlier or {}).get("status")
    if previous == "GENERATED":
        identity = uuid(body(earlier)["id"])
        reopened = analysis.read_if_scenario_set(identity)
        log("if_finish_reopen", reopened.get("status"), {"same_id": reopened.get("id") == identity, "result": reopened})
        return
    if tier != "premium" or previous in {"QUESTION_PENDING", "SEPARATE_SAFETY"}:
        return
    if marker.get("refresh_status") in ACTIVE_MAP:
        log("if_finish_wait", "map_pending")
        return
    payload = if_payload(case, current)
    if payload is None:
        options = if_route_branch_options(analysis)
        log("if_finish_wait", options["status"])
        return
    attempted = stage(rows, "if_finish_attempt")
    if previous == "PENDING" or attempted:
        if not resume_pending:
            log("if_finish_wait", "explicit_same_operation_resume_required")
            return
        original = body(attempted) or if_payload(case, body(stage(rows, "map")).get("current") or {})
        if original != payload:
            log("if_finish_wait", "original_map_or_branch_changed")
            return
    elif previous not in NO_IF_WRITE and (earlier or stage(rows, "map_or_if")):
        log("if_finish_wait", "earlier_operation_outcome_unknown")
        return
    log("if_finish_attempt", "normal_request", payload)
    result = analysis.create_if_scenario_set(**payload)
    log("if_finish", result.get("status"), result)
    if result.get("status") == "GENERATED":
        identity = uuid(result["id"])
        reopened = analysis.read_if_scenario_set(identity)
        log("if_finish_reopen", reopened.get("status"), {
            "same_id": reopened.get("id") == identity,
            "same_projection": reopened.get("projection") == result.get("projection"),
            "result": reopened,
        })


def answer_saved_question(rows, analysis, log, *, lane, answer, explicit_id, map_wait):
    previous = body(stage(rows, "theme" if lane == "theme" else "records_question"))
    expected = previous.get("saved_reopen") or (previous.get("result") or {}).get("question")
    if not expected or expected.get("lane") != lane:
        log("answer_finish", "no_audited_question")
        return
    question_id = uuid(expected["id"])
    if explicit_id is not None and uuid(explicit_id) != question_id:
        log("answer_finish", "question_id_mismatch")
        return
    actual = analysis.read_deep_insight_question(question_id)
    binding = ("id", "lane", "theme", "question_text", "issued_on")
    if any(actual.get(key) != expected.get(key) for key in binding):
        log("answer_finish", "saved_question_changed")
        return
    if actual.get("answered_at") and actual.get("answer_text") != answer:
        log("answer_finish", "question_already_has_different_answer")
        return
    before = analysis.map_status()
    saved = actual
    if not actual.get("answered_at"):
        try:
            saved = analysis.answer_deep_insight(question_id, answer)["question"]
        except AnalysisAPIError as error:
            if error.status not in (None, 409, 500, 502, 503, 504):
                raise
            log("answer_write", "needs_readback", {"http_status": error.status, "error_code": error.code})
            saved = None
    reopened = analysis.read_deep_insight_question(question_id)
    verified = (reopened.get("id") == question_id and reopened.get("answer_text") == answer
                and bool(reopened.get("answered_at"))
                and all(reopened.get(key) == expected.get(key) for key in binding))
    log("answer_finish", "same_saved_answer" if verified else "answer_not_confirmed",
        {"question_id": question_id, "same_response": reopened == saved if saved is not None else None,
         "same_saved_answer": verified, "saved_question": reopened})
    if verified:
        capture_map(analysis, log, wait=map_wait, baseline=before, capture_stage="map_after_answer")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cases", type=Path)
    parser.add_argument("results_dir", type=Path)
    parser.add_argument("--first", type=int, default=1)
    parser.add_argument("--last", type=int, default=100)
    parser.add_argument("--tiers", choices=ALLOWED_TIERS, nargs="+")
    parser.add_argument("--tier", choices=ALLOWED_TIERS)
    parser.add_argument("--map-wait", type=float, default=120)
    parser.add_argument("--emlis-wait", type=float, default=30)
    parser.add_argument("--resume-pending-if", action="store_true")
    parser.add_argument("--answer-case", choices=IDS)
    parser.add_argument("--lane", choices=("theme", "records"))
    parser.add_argument("--answer")
    parser.add_argument("--question-id")
    args = parser.parse_args()
    os.umask(0o077)
    if not 1 <= args.first <= args.last <= 100 or min(args.map_wait, args.emlis_wait) < 0:
        parser.error("invalid range or wait")
    if args.tiers and args.tier:
        parser.error("use one tier selector")
    if args.answer_case:
        if (not args.answer or not args.answer.strip() or len(args.answer) > 2000
                or "\x00" in args.answer or not args.tier or not args.lane):
            parser.error("--answer-case requires --tier, --lane and nonempty --answer")
    elif args.lane or args.answer is not None or args.question_id:
        parser.error("answer options require --answer-case")
    data = json.loads(args.cases.read_text(encoding="utf-8"))
    cases = data["cases"]
    if data["all_fictional"] is not True or [case["id"] for case in cases] != IDS:
        parser.error("incorrect fictional manifest")
    subjects = [cases[IDS.index(args.answer_case)]] if args.answer_case else cases[args.first - 1:args.last]
    folder = args.results_dir
    owners = read_rows(folder / "owners.private.jsonl")
    main_rows = read_rows(folder / "results.jsonl")
    output = folder / "finish.jsonl"
    follow_up = read_rows(output)
    key = os.environ["CMEE_EVALUATION_PUBLISHABLE_KEY"]
    for case in subjects:
        case_id = case["id"]
        for tier in ([args.tier] if args.tier else args.tiers or ALLOWED_TIERS):
            rows = [row for row in (*main_rows, *follow_up) if row.get("case_id") == case_id and row.get("tier") == tier]

            def log(name, status, payload=None):
                audit_write(output, {"case_id": case_id, "tier": tier, "stage": name, "status": status,
                                     "body": payload, "utc": datetime.now(timezone.utc).isoformat()})
                print(case_id, tier, name, status, flush=True)

            if not body(stage(rows, "input")).get("input_id"):
                if args.answer_case:
                    log("answer_finish", "no_confirmed_saved_case")
                continue
            try:
                signed = session(case_id, tier, owners, key, log)
                if not signed:
                    continue
                request, analysis = signed
                if args.answer_case:
                    answer_saved_question(rows, analysis, log, lane=args.lane, answer=args.answer,
                                          explicit_id=args.question_id, map_wait=args.map_wait)
                    continue
                for operation, action in (
                    ("emlis_finish_error", lambda: resume_emlis(case, tier, rows, request, log, args.emlis_wait)),
                    ("piece_finish_error", lambda: resume_piece(case, tier, rows, emlis, request, log)),
                    ("map_finish_error", lambda: capture_map(analysis, log, wait=args.map_wait)),
                    ("if_finish_error", lambda: resume_if(case, tier, rows, analysis, current, marker, log,
                                                          args.resume_pending_if)),
                ):
                    try:
                        if operation == "emlis_finish_error":
                            emlis = action()
                        elif operation == "map_finish_error":
                            current, marker = action()
                        else:
                            action()
                    except (AnalysisAPIError, OSError, ValueError, TypeError, KeyError) as error:
                        log(operation, type(error).__name__)
                        if operation == "emlis_finish_error":
                            emlis = body(stage(rows, "input"))
                        elif operation == "map_finish_error":
                            break
            except (AnalysisAPIError, OSError, ValueError, TypeError, KeyError) as error:
                log("finish_error", type(error).__name__)


if __name__ == "__main__":
    main()
