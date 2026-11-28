"""Exercise a dated, fictional Emlis history on three fixed local owners."""

from argparse import ArgumentParser
from datetime import date, datetime, time, timedelta, timezone
from fcntl import LOCK_EX, LOCK_NB, flock
import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlencode, urlsplit
from urllib.request import ProxyHandler, Request, build_opener
from uuid import UUID

from cmee_live_analysis import AnalysisAPIError, LiveAnalysisClient, _NoRedirects, if_route_branch_options, run_if_flow
from cmee_live_common import run_common
from cmee_live_core import _operation_key, input_payload, run_emlis, run_piece


TIERS = ("free", "plus", "premium")
STAGES = ("baseline", "contrast", "followup")
JST = timezone(timedelta(hours=9))
THEME = "人間関係"
LOCAL_OPENER = build_opener(ProxyHandler({}), _NoRedirects())

# All entries belong to the same fictional library employee. The two
# recurring decisions compare an existing due date and the ability to choose
# the scope of help. The secret entry is an independent graph control.
RECORDS = (
    ("CML-01", "baseline", -24, 16, ["仕事", "人間関係"], "平穏", "medium",
     "同僚に返却本の整理を頼まれた。自分の集計が終わっていて、できる範囲も先に聞いてくれたので引き受けた。",
     "一緒に返却本の棚を二列整理した。", False),
    ("CML-02", "baseline", -17, 16, ["仕事", "人間関係"], "不安", "weak",
     "閉館までに自分の集計を出す約束があった。返却本の整理を全部引き受けると間に合わないので、棚一列ならできると伝えた。",
     "一列を片づけてから集計を提出した。", False),
    ("CML-03", "contrast", -8, 16, ["仕事", "人間関係"], "怒り", "weak",
     "今日は自分の集計は終わっていた。でも返却本を全部整理すると私に聞かず決められていて、引き受けなかった。",
     "担当表を直してもらい、自分の机に戻った。", False),
    ("CML-04", "contrast", -2, 16, ["仕事", "価値観"], "平穏", "medium",
     "時間があるかだけで決めていないと気づいた。どこまでなら手伝えるか自分で返事できると、集計が残っている日も手伝いたい。",
     "次に頼むときは先に範囲を聞いてほしいと同僚に伝えた。", False),
    ("CML-05", "contrast", 0, 8, ["仕事"], "喜び", "weak",
     "今朝は同僚が先に担当表を見せてくれた。今日はできる範囲を一緒に考えられそうで、少し楽しみだった。",
     "空いている時間を担当表に書いた。", False),
    ("CML-06", "contrast", 0, 9, ["生活"], "悲しみ", "strong",
     "大切なマグカップを落として割ってしまって、悲しかった。仕事の話とは別に、自分だけの記録にしたい。",
     "破片を紙に包んで片づけた。", True),
    ("CML-07", "followup", 0, 12, ["仕事", "人間関係"], "平穏", "medium",
     "昼に頼まれたときは、集計を先に出す約束と、同僚を手伝いたい気持ちの両方があった。手伝うのは集計を出した後の一列にすると自分で決めて、ほっとした。",
     "集計を提出してから、返却本の棚を一列整理した。", False),
)


def timeline(day):
    return [
        {
            "case_id": identifier,
            "stage": stage,
            "created_at": datetime.combine(day + timedelta(days=offset), time(hour), JST).isoformat(),
            "category": categories,
            "emotions": [{"type": emotion, "strength": strength}],
            "memo": memo,
            "memo_action": action,
            "is_secret": secret,
            "emlis_question_action": "disabled" if identifier in {"CML-01", "CML-02", "CML-06"} else "leave_pending",
        }
        for identifier, stage, offset, hour, categories, emotion, strength, memo, action, secret in RECORDS
    ]


def local_origin(value):
    url = urlsplit(value)
    if (url.scheme not in {"http", "https"} or url.hostname not in {"127.0.0.1", "::1"}
            or url.port is None or url.username is not None or url.password is not None
            or url.path not in {"", "/"} or url.query or url.fragment):
        raise ValueError("API and Supabase must be distinct loopback origins with explicit ports")
    return value.rstrip("/")


def local_call(origin, method, path, *, payload=None, headers=None, timeout=40):
    origin = local_origin(origin)
    if not path.startswith("/") or path.startswith("//"):
        raise ValueError("local request requires a relative API path")
    body = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = Request(origin + path, data=body, method=method, headers={
        "Content-Type": "application/json", "Accept": "application/json", **(headers or {}),
    })
    try:
        response = LOCAL_OPENER.open(req, timeout=timeout)
    except HTTPError as error:
        response = error
    with response as result:
        try:
            payload = json.load(result)
        except (ValueError, UnicodeError):
            payload = {"non_json_response": True}
        return result.code, payload


def load_owners(path):
    owners = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(owners, dict) or set(owners) != set(TIERS):
        raise ValueError("provide exactly one fixture profile for each tier")
    seen = set()
    for tier, fixture in owners.items():
        if not isinstance(fixture, dict) or set(fixture) != {"owner_id", "email", "password"}:
            raise ValueError(f"{tier}: expected owner_id, email and password")
        owner_id = str(UUID(fixture["owner_id"]))
        if owner_id in seen or fixture["email"] != f"cmee-longitudinal-{tier}@example.invalid":
            raise ValueError("fixture IDs must be distinct and the email must match its tier")
        if not isinstance(fixture["password"], str) or not fixture["password"]:
            raise ValueError(f"{tier}: fixture password is required")
        seen.add(owner_id)
        fixture["owner_id"] = owner_id
    return owners


def authenticate(api, supabase, key, fixture):
    api = local_origin(api)
    status, grant = local_call(supabase, "POST", "/auth/v1/token?grant_type=password",
                               payload={key: fixture[key] for key in ("email", "password")},
                               headers={"apikey": key})
    if status != 200 or (grant.get("user") or {}).get("id") != fixture["owner_id"]:
        raise RuntimeError(f"local fixture sign-in or owner match failed (HTTP {status})")
    token = grant.get("access_token")
    analysis = LiveAnalysisClient(api, token, allow_http_loopback=True)

    def request(method, path, *, json=None, headers=None, timeout=40):
        return local_call(api, method, path, payload=json,
                          headers={**(headers or {}), "Authorization": "Bearer " + token}, timeout=timeout)

    return request, analysis


def history_readback(request, owner_id, known_count):
    status, body = request("POST", "/emotion/history/search", json={
        "secret_filter": "all", "order": "desc", "offset": 0, "limit": 200,
    })
    if (status != 200 or body.get("user_id") != owner_id
            or len(body.get("items") or []) < known_count or (body.get("meta") or {}).get("has_more")):
        raise RuntimeError(f"owner history could not be verified (HTTP {status})")
    return {str(item.get("id") or item.get("emotion_id")): item for item in body["items"]}


def check_owner(request, analysis, tier, owner, expected_input_ids):
    status, subscription = request("GET", "/subscription/me")
    if (status != 200 or subscription.get("user_id") != owner
            or subscription.get("subscription_tier") != tier):
        raise RuntimeError(f"{tier}: effective owner or subscription mismatch (HTTP {status})")
    status, following = request("GET", "/follow/stats?" + urlencode({"target_user_id": owner}))
    if (status != 200 or following.get("target_user_id") != owner
            or any(following.get(name) != 0 for name in ("follower_count", "following_count"))):
        raise RuntimeError(f"{tier}: the fixture owner has an unverified follow boundary")
    if set(history_readback(request, owner, len(expected_input_ids))) != expected_input_ids:
        raise RuntimeError(f"{tier}: visible history does not match this evaluation's saved inputs")
    state = analysis.deep_insight_state()
    if state.get("can_use_theme") is not True or state.get("can_use_records") != (tier == "premium"):
        raise RuntimeError(f"{tier}: DeepInsight access does not match the expected tier")
    return {"subscription": subscription, "follow_counts": {
        key: following[key] for key in ("follower_count", "following_count")
    }, "deep_insight_access": {
        key: state.get(key) for key in ("can_use_theme", "can_use_records")
    }, "prior_input_ids": sorted(expected_input_ids)}


def verified_input(request, owner, case, observed, expected_input_ids):
    saved_id = observed.get("input_id")
    if not saved_id or saved_id in expected_input_ids:
        raise RuntimeError("input save has no new confirmed ID; inspect the trace before another write")
    read = history_readback(request, owner, len(expected_input_ids) + 1)
    row = read.get(saved_id)
    if not row:
        raise RuntimeError("saved input did not appear in the owner's ordinary history")
    payload = input_payload(case)
    actual_stamp = datetime.fromisoformat(row["created_at"])
    actual_emotions = [{key: emotion.get(key) for key in ("type", "strength")}
                       for emotion in row.get("emotion_details") or []]
    if (set(read) != expected_input_ids | {saved_id} or actual_emotions != payload["emotions"]
            or actual_stamp != datetime.fromisoformat(payload["created_at"])
            or any(row.get(name) != payload[name] for name in ("memo", "memo_action", "is_secret", "category"))):
        raise RuntimeError("saved record differs from the original fictional timeline")
    return row


def map_readback(analysis, wait, before):
    result = {"before": before, "requested": analysis.request_current_map()}
    marker = analysis.map_status()
    if marker.get("refresh_status") in {"queued", "running"}:
        try:
            result["wait"] = analysis.wait_current_map(
                timeout=wait, initial_refresh_status=marker["refresh_status"],
                baseline_version=before.get("version_key"),
            )
            marker = result["wait"]["status"]
        except TimeoutError:
            result["wait_error"] = "still_pending_at_deadline"
            marker = analysis.map_status()
    current = analysis.read_current_map()
    result.update(status=marker, current=current, monthly=analysis.read_monthly_maps(limit=12))
    version_key = marker.get("version_key")
    result["version_changed"] = bool(version_key and version_key != before.get("version_key"))
    if report_id := current.get("report_id"):
        detail = analysis.read_map_report(report_id)
        reopened = detail["item"]
        graph = current.get("meta") or {}
        result["reopened"] = reopened
        result["same_id_text_and_graph"] = (
            reopened.get("id") == report_id and detail.get("map_subscription_tier") == current.get("map_subscription_tier")
            and reopened.get("content_text") == current.get("content_text")
            and graph == (reopened.get("content_json") or {}).get("watashiMap")
        )
        result["same_status_projection"] = graph.get("projection_of") == version_key
        evidence = {}
        for node in (graph.get("accessibility_linear_order") or [])[:3]:
            if current.get("map_subscription_tier") == "free" or not node.startswith("n") or not node[1:].isdigit():
                continue
            try:
                evidence[node] = analysis.read_map_evidence(report_id, node)
            except AnalysisAPIError as error:
                evidence[node] = {"http_status": error.status, "code": error.code}
        result["evidence"] = evidence
    return result


def deep_insight(analysis, log):
    for lane in ("theme", "records"):
        try:
            issued = analysis.issue_deep_insight(lane, THEME if lane == "theme" else None)
            question = issued.get("question")
            reopened = analysis.read_deep_insight_question(question["id"]) if question else None
            log("deep_insight", {"lane": lane, "issued": issued, "reopened": reopened,
                                 "same_question": reopened == question if question else None})
        except AnalysisAPIError as error:
            log("deep_insight", {"lane": lane, "http_status": error.status, "code": error.code})


def capture_graphs(request, owner, day, input_ids, cases):
    day_string = day.isoformat()
    common = run_common(request, expected_user_id=owner, input_ids=input_ids,
                        anchors={key: day_string for key in ("today", "week", "month")})
    for step in common["steps"]:
        if step["step"] not in ("kokoro_today", "kokoro_week", "kokoro_month"):
            continue
        graph = step.get("graph") or {}
        start, end = graph.get("start_date"), graph.get("end_date")
        if start and end:
            expected = sum(not item["is_secret"] and start <= item["created_at"][:10] <= end for item in cases)
            step["expected_nonsecret_input_count"] = expected
            step["observed_input_count"] = (graph.get("summary") or {}).get("input_count")
            step["matches_expected_count"] = step["observed_input_count"] == expected
    return common


def if_route(analysis, tier, report, log, run_id):
    try:
        if tier != "premium":
            log("if_route_access", {"list_response": analysis.read_if_scenario_sets(limit=1)})
            return
        current = report["current"]
        branch_map = if_route_branch_options(analysis)
        branch = next((item for item in branch_map.get("branches", [])
                       if any(word in (item.get("label") or "") for word in ("手伝", "集計", "整理", "引き受", "締切"))), None)
        if (report.get("wait_error") or not report["version_changed"]
                or not report.get("same_id_text_and_graph") or not report.get("same_status_projection") or not branch
                or branch_map.get("map_ref") != (current.get("meta") or {}).get("projection_of")):
            log("if_route", {"status": "no_confirmed_current_branch", "branch_map": branch_map})
            return
        result = run_if_flow(
            analysis, branch_point_id=branch["id"],
            intent="翌朝までの集計を守りながら、同僚をどこまで手伝えるか考えたいです。",
            constraints=("作業時間は三十分", "自分の集計を先に出す約束がある"),
            scenario_choices=("集計が終わってから棚一列を受け持つ", "今日は引き受けず明日の担当だけ相談する"),
            candidate_count=2, constraints_confirmed=True,
            idempotency_key=_operation_key(run_id, "CML-07", "if"),
        )
        log("if_route", result)
        if result.get("status") != "GENERATED":
            return
        reopened = analysis.read_if_scenario_set(result["id"])
        log("if_route_reopened", {"body": reopened, "same_id_and_projection": (
            result["id"] == reopened.get("id") and result.get("projection") == reopened.get("projection")
        )})
        scenarios = (reopened.get("projection") or {}).get("scenarios") or []
        if not scenarios or result.get("projection") != reopened.get("projection"):
            return
        ref = scenarios[0].get("scenario_artifact_ref")
        if not ref:
            return
        saved = analysis.save_route_intent(
            reopened["scenario_set_ref"], ref, idempotency_key=_operation_key(run_id, "CML-07", "if-selection"),
        )
        log("saved_intent", saved)
        if saved.get("status") == "GENERATED":
            again = analysis.read_saved_route_intent(saved["id"])
            log("saved_intent_reopened", {"body": again, "same_id_and_projection": (
                saved["id"] == again.get("id") and saved.get("projection") == again.get("projection")
            )})
    except AnalysisAPIError as error:
        log("if_route_access" if tier != "premium" else "if_route_error",
            {"http_status": error.status, "code": error.code})


def review_answers(path, rows):
    if path is None:
        return {}
    answers = {}
    for item in json.loads(path.read_text(encoding="utf-8")):
        tier, lane = item["tier"], item["lane"]
        if tier not in TIERS or lane not in ("theme", "records") or (lane == "records" and tier != "premium"):
            raise ValueError("invalid fixture answer lane or tier")
        key = (tier, lane)
        matching = [row["body"]["reopened"] for row in rows if row.get("tier") == tier
                    and row["event"] == "deep_insight" and row["body"].get("lane") == lane and row["body"].get("reopened")]
        if (key in answers or len(matching) != 1 or matching[0]["id"] != str(UUID(item["question_id"]))
                or matching[0]["question_text"] != item["question_text"]
                or matching[0].get("answered_at") or not isinstance(item["answer_text"], str)
                or not 0 < len(item["answer_text"].strip()) <= 2000 or "\x00" in item["answer_text"]):
            raise ValueError("each answer must match a reviewed, unanswered question in the local trace")
        answers[key] = item
    return answers


def write_answer(analysis, item, log):
    before = analysis.read_deep_insight_question(item["question_id"])
    if (before.get("question_text") != item["question_text"] or before.get("lane") != item["lane"]
            or before.get("answered_at")):
        raise RuntimeError("reviewed question changed before answer")
    saved = analysis.answer_deep_insight(item["question_id"], item["answer_text"])
    reopened = analysis.read_deep_insight_question(item["question_id"])
    matches = (reopened.get("id") == item["question_id"] and
               reopened.get("answer_text") == item["answer_text"] and bool(reopened.get("answered_at")))
    log("answer", {"before": before, "write": saved, "reopened": reopened, "exact_answer_reopened": matches})
    if not matches:
        raise RuntimeError("reviewed answer did not reopen on its original question")


def evaluate(stage, day, cases, owners, sessions, trace, answers, *, map_wait, emlis_wait):
    previous = [json.loads(line) for line in trace.read().splitlines()]

    def log(event, body, tier=None):
        entry = {"event": event, "stage": stage, "tier": tier,
                 "utc": datetime.now(timezone.utc).isoformat(), "body": body}
        trace.write(json.dumps(entry, ensure_ascii=False) + "\n")
        trace.flush()
        os.fsync(trace.fileno())

    run_id = "cmee-longitudinal:" + day.isoformat() + ":" + ":".join(owners[tier]["owner_id"] for tier in TIERS)
    identity = {"run_id": run_id, "owners": {tier: owners[tier]["owner_id"] for tier in TIERS},
                "timeline": [{"case": case["case_id"], "stage": case["stage"], "payload": input_payload(case)}
                             for case in cases]}
    if previous and (previous[0]["body"] != identity or previous[0]["event"] != "identity"):
        raise RuntimeError("timeline day or fixture owner changed; use the original run")
    expected_stages = list(STAGES[:STAGES.index(stage)])
    if ([item["stage"] for item in previous if item["event"] == "stage_finished"] != expected_stages
            or [item["stage"] for item in previous if item["event"] == "stage_started"] != expected_stages):
        raise RuntimeError("stages must be completed in order; inspect an interrupted stage before continuing")
    known = {
        tier: {item["body"]["id"] for item in previous if item["tier"] == tier and item["event"] == "input_reopened"}
        for tier in TIERS
    }
    reviewed = review_answers(answers, previous)
    preflight = {tier: check_owner(*sessions[tier], tier, owners[tier]["owner_id"], known[tier]) for tier in TIERS}
    if not previous:
        log("identity", identity)
    log("stage_started", {"cases": [case["case_id"] for case in cases if case["stage"] == stage]})
    for tier in TIERS:
        request, analysis = sessions[tier]
        owner = owners[tier]["owner_id"]
        tier_run = run_id + ":" + tier

        def owned_log(event, body):
            log(event, body, tier)

        owned_log("owner_context", preflight[tier])
        before = analysis.map_status()
        owned_log("prior_map", {"status": before, "current": analysis.read_current_map()})
        if stage == "followup":
            for lane in ("theme", "records"):
                if answer := reviewed.get((tier, lane)):
                    write_answer(analysis, answer, owned_log)
        for case in (item for item in cases if item["stage"] == stage):
            owned_log("input_request", {"case": case["case_id"], "payload": input_payload(case)})
            observed = run_emlis(request, case, run_id=tier_run, wait_seconds=emlis_wait)
            owned_log("emlis", {"case": case["case_id"], "result": observed})
            row = verified_input(request, owner, case, observed, known[tier])
            known[tier].add(observed["input_id"])
            owned_log("input_reopened", {"case": case["case_id"], "id": observed["input_id"], "row": row})
            if case["case_id"] in {"CML-05", "CML-07"}:
                owned_log("piece", {"case": case["case_id"], "result": run_piece(
                    request, case, observed, run_id=tier_run,
                )})
        graph_cases = [case for case in cases if STAGES.index(case["stage"]) <= STAGES.index(stage)]
        owned_log("common", capture_graphs(request, owner, day, known[tier], graph_cases))
        try:
            report = map_readback(analysis, map_wait, before)
            owned_log("map", report)
        except AnalysisAPIError as error:
            owned_log("map", {"http_status": error.status, "code": error.code})
            report = None
        if stage == "contrast":
            deep_insight(analysis, owned_log)
        elif stage == "followup" and report is not None:
            if_route(analysis, tier, report, owned_log, tier_run)
    log("stage_finished", {"inputs_reopened_by_tier": {tier: len(ids) for tier, ids in known.items()}})


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--day", type=date.fromisoformat, required=True, help="JST day of the three latest records")
    parser.add_argument("--plan", action="store_true", help="Print exact fictional inputs without contacting any service")
    parser.add_argument("--stage", choices=STAGES)
    parser.add_argument("--api", type=local_origin)
    parser.add_argument("--supabase", type=local_origin)
    parser.add_argument("--owners", type=Path)
    parser.add_argument("--trace", type=Path)
    parser.add_argument("--answers", type=Path, help="Reviewed fictional DeepInsight answers for followup only")
    parser.add_argument("--map-wait", type=float, default=120)
    parser.add_argument("--emlis-wait", type=float, default=30)
    args = parser.parse_args()
    cases = timeline(args.day)
    if args.plan:
        print(json.dumps([{**case, "payload": input_payload(case)} for case in cases], ensure_ascii=False, indent=2))
        return
    if not all((args.stage, args.api, args.supabase, args.owners, args.trace)) or args.api == args.supabase:
        parser.error("local execution requires --stage, distinct --api and --supabase, --owners and --trace")
    if args.answers and args.stage != "followup":
        parser.error("--answers is only accepted with --stage followup")
    if args.map_wait <= 0 or args.emlis_wait < 0:
        parser.error("wait values are out of range")
    now = datetime.now(JST)
    if datetime.fromisoformat(cases[-1]["created_at"]) > now:
        parser.error("the fictional timeline ends after the current JST time")
    prior_month_start = (now.date().replace(day=1) - timedelta(days=1)).replace(day=1)
    if datetime.fromisoformat(cases[0]["created_at"]).date() < prior_month_start:
        parser.error("the first fictional input would fall outside Free history visibility")
    key = os.environ.get("CMEE_LOCAL_PUBLISHABLE_KEY")
    if not key:
        parser.error("CMEE_LOCAL_PUBLISHABLE_KEY is required")
    os.umask(0o077)
    owners = load_owners(args.owners)
    with args.trace.open("a+", encoding="utf-8") as trace:
        flock(trace.fileno(), LOCK_EX | LOCK_NB)
        trace.seek(0)
        sessions = {tier: authenticate(args.api, args.supabase, key, owners[tier]) for tier in TIERS}
        evaluate(args.stage, args.day, cases, owners, sessions, trace, args.answers,
                 map_wait=args.map_wait, emlis_wait=args.emlis_wait)


if __name__ == "__main__":
    main()
