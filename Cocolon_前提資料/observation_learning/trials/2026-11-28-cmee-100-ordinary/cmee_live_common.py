"""Read-only checks for Cocolon's normal app surfaces on a fictional account."""

from time import monotonic
from urllib.parse import urlencode
from uuid import UUID


def _uuid(value):
    try:
        return str(UUID(str(value)))
    except (TypeError, ValueError):
        return None


def _url(path, **params):
    return path + "?" + urlencode(params) if params else path


def _request(request, steps, name, method, path, *, payload=None):
    start = monotonic()
    status, body, exception = None, {}, None
    try:
        status, supplied = request(method, path, json=payload,
                                   headers={"Cache-Control": "no-store"}, timeout=30)
        if isinstance(supplied, dict):
            body = supplied
    except Exception as exc:
        exception = type(exc).__name__
    row = {"step": name, "http_status": status, "seconds": round(monotonic() - start, 3)}
    if exception:
        row["exception"] = exception
    row["fields_received"] = sorted(body)
    row["list_counts"] = {key: len(value) for key, value in body.items() if isinstance(value, list)}
    steps.append(row)
    return status, body, row


def run_common(request, *, expected_user_id=None, input_ids=(), anchors=None):
    """Inspect ordinary API responses and keep only privacy-safe evidence.

    The caller binds a dedicated fake account; no subscription projection,
    post publication, settings update, or notification dispatch is requested.
    The single POST is the app's read-only history search.
    """
    if expected_user_id is not None and not _uuid(expected_user_id):
        raise ValueError("expected_user_id must be a UUID")
    expected_inputs = {uid for raw in input_ids if (uid := _uuid(raw)) is not None}
    steps = []
    result = {"steps": steps, "device_exercised": False, "mutations_exercised": False}
    status, profile, row = _request(request, steps, "profile_me_and_saved_settings", "GET", "/account/profile/me")
    viewer_id = _uuid(profile.get("user_id"))
    if status != 200 or not viewer_id or (expected_user_id is not None and viewer_id != _uuid(expected_user_id)):
        result["stop"] = "fictional_owner_not_confirmed"
        return result
    row["account_match"] = True if expected_user_id is not None else None
    row["settings"] = {key: profile[key] for key in ("push_enabled", "tutorial_completed", "tutorial_skipped")
                       if isinstance(profile.get(key), bool)}

    for visibility in ("all", "secret", "public"):
        status, body, row = _request(request, steps, "input_history_" + visibility, "POST", "/emotion/history/search",
                                     payload={"secret_filter": visibility, "order": "desc", "offset": 0, "limit": 200})
        if status == 200:
            found_ids = {_uuid(item.get("id") or item.get("emotion_id"))
                         for item in body.get("items", []) if isinstance(item, dict)}
            row["expected_inputs_in_page"] = len(found_ids & expected_inputs)
            row["owner_match"] = _uuid(body.get("user_id")) == viewer_id
            meta = body.get("meta") or {}
            row["has_more"] = meta.get("has_more") if isinstance(meta, dict) else None

    for period in ("today", "week", "month"):
        params = {"period": period}
        if anchor := (anchors or {}).get(period):
            params["anchor"] = anchor
        status, body, row = _request(request, steps, f"kokoro_{period}", "GET", _url("/analysis/kokoro-weather", **params))
        if status == 200:
            row["period_match"] = body.get("period") == period
            fields = ("version", "period", "start_date", "end_date", "partial_history", "summary", "items", "time_buckets")
            row["graph"] = {key: body[key] for key in fields if key in body}

    checks = (
        ("account_status", "/account/status"),
        ("follow_stats", _url("/follow/stats", target_user_id=viewer_id)),
        ("follow_list_following", _url("/follow/list", target_user_id=viewer_id, tab="following")),
        ("follow_list_followers", _url("/follow/list", target_user_id=viewer_id, tab="followers")),
        ("follow_requests_incoming", "/follow/requests/incoming"),
        ("follow_requests_outgoing", "/follow/requests/outgoing"),
        ("follower_content_visibility", "/follow/followers/content-visibility"),
        ("emotion_notification_settings", "/emotion-notifications/settings"),
        ("emotion_notification_feed", "/emotion-log/feed"),
        ("emotion_notification_unread", "/emotion-log/unread-status"),
        ("notice_current", "/notices/current"),
        ("notice_history", "/notices/history?limit=30"),
        ("piece_feed_latest", "/nexus/pieces?sort=latest&limit=20&following_only=true&include_piece_v2=true&include_piece_v2_resonance=true"),
        ("piece_feed_oldest", "/nexus/pieces?sort=oldest&limit=20&following_only=true&include_piece_v2=true&include_piece_v2_resonance=true"),
        ("piece_feed_unread", "/nexus/pieces/unread-status"),
        ("resonance_history", "/nexus/history/resonances?limit=20&order=newest&include_piece_v2=true"),
    )
    for name, path in checks:
        _request(request, steps, name, "GET", path)
    return result
