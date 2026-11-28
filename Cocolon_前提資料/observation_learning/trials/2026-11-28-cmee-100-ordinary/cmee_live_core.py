"""Exercise the ordinary Emlis and Piece HTTP contracts with a bound test account.

The caller owns authentication, evidence storage, and an isolated, fictional
dataset. This module does not mint credentials, log requests, or publish Piece.
"""

from datetime import datetime, timezone
from time import monotonic, sleep
from urllib.parse import quote, urlencode
from uuid import NAMESPACE_URL, UUID, uuid5


_TRANSIENT_THREAD = {"INITIALIZING", "REFINING"}
_PIECE_ROOT = "/emotion/piece"
_RECIPE_FIELDS = ("piece_text_hash", "content_payload_hash", "visual_recipe_hash")
_OWNER_FIELDS = (*_RECIPE_FIELDS, "piece_text", "visual_recipe", "content_payload", "renderer_version")
_IOS_PIECE_HEADERS = {
    "X-Piece-Renderer": "piece.rn_bitmap_renderer.ios.v2",
    "X-Piece-Palette": "7",
    "X-Piece-Decoration-Palette": "8",
}


def _operation_key(run_id, case_id, action):
    return uuid5(NAMESPACE_URL, f"emlis-cmee-test:{run_id}:{case_id}:{action}").hex


def _read_uuid(value):
    try:
        value = str(UUID(str(value)))
    except (TypeError, ValueError):
        return None
    return value if value != "00000000-0000-0000-0000-000000000000" else None


def _call(request, steps, step, method, path, *, payload=None, headers=None, timeout=35):
    start = monotonic()
    try:
        status, body = request(method, path, json=payload, headers=headers, timeout=timeout)
    except Exception as exc:
        # A timeout after a write may have committed. Preserve the original
        # operation and leave any redo to the coordinator, using the same key.
        steps.append({"step": step, "http_status": None, "exception": type(exc).__name__,
                      "seconds": round(monotonic() - start, 3)})
        return None, {}
    elapsed = round(monotonic() - start, 3)
    if not isinstance(body, dict):
        body = {"non_object_response": True}
    steps.append({"step": step, "http_status": status, "body": body, "seconds": elapsed})
    return status, body


def input_payload(case):
    payload = {
        "memo": case.get("memo"),
        "emotions": case["emotions"],
        "created_at": case.get("created_at") or datetime.now(timezone.utc).isoformat(),
        "is_secret": bool(case.get("is_secret", False)),
        "send_emotion_notification": False,
        "receive_emlis_questions": case.get("emlis_question_action", "skip") != "disabled",
    }
    if case.get("memo_action"):
        payload["memo_action"] = case["memo_action"]
    if case.get("category"):
        categories = case["category"]
        payload["category"] = [categories] if isinstance(categories, str) else categories
    return payload


def _read_thread(request, result, phase, *, wait_seconds):
    end_time = monotonic() + wait_seconds
    poll = 0
    while True:
        poll += 1
        status, thread = _call(request, result["steps"], f"{phase}:{poll}", "GET",
                               f"/emlis/threads/by-input/{result['input_id']}",
                               headers={"Cache-Control": "no-store"})
        if status != 200 or thread.get("state") not in _TRANSIENT_THREAD:
            return thread if status == 200 else {}
        remaining = end_time - monotonic()
        if remaining <= 0:
            result["thread_poll_wait_expired"] = phase
            return thread
        sleep(min(2.5, remaining))


def _observation(trace):
    current = trace.get("current_observation")
    return current if isinstance(current, dict) else {}


def run_emlis(request, case, *, run_id, wait_seconds=80, input_id=None):
    """Submit, read, optionally answer or skip, and reread the persisted thread."""
    case_id = case["case_id"]
    action = case.get("emlis_question_action", "answer" if case.get("answer_text") else "skip")
    if action not in {"answer", "skip", "disabled", "leave_pending"}:
        raise ValueError("unsupported Emlis question action")
    if action == "answer" and not isinstance(case.get("answer_text"), str):
        raise ValueError("answer_text is required for an answer action")
    result = {"input_id": _read_uuid(input_id), "answer_id": None, "steps": []}
    if input_id is not None and result["input_id"] is None:
        raise ValueError("invalid existing input ID")
    if result["input_id"] is None:
        payload = input_payload({**case, "emlis_question_action": action})
        status, submitted = _call(request, result["steps"], "submit", "POST", "/emotion/submit",
                                  payload=payload, timeout=120)
        if status != 200 or not (saved_id := _read_uuid(submitted.get("id"))):
            result["stop"] = "input_not_confirmed_saved"
            return result
        result["input_id"] = saved_id
    first = _read_thread(request, result, "first_read", wait_seconds=wait_seconds)
    result["thread_id"] = _read_uuid(first.get("thread_id"))
    result["first_state"] = first.get("state")
    pending = first.get("pending_question") or {}
    if not isinstance(pending, dict):
        result["stop"] = "invalid_pending_question"
        return result
    question_id = pending.get("question_id")
    if action in {"disabled", "leave_pending"} or not question_id:
        if question_id and action == "disabled":
            result["stop"] = "question_dispatched_when_disabled"
        if not question_id and action == "answer":
            result["stop"] = "no_question_to_answer"
        result["first_observation"] = _observation(first)
        return result
    if (not result["thread_id"] or type(first.get("revision")) is not int
            or first.get("state") != "AWAITING_ANSWER"):
        result["stop"] = "thread_not_writable_for_pending_question"
        return result
    body = {"expected_revision": first["revision"], "question_id": question_id,
            "idempotency_key": _operation_key(run_id, case_id, f"emlis-{action}")}
    if action == "answer":
        suffix = "answers"
        body["answer_text"] = case["answer_text"]
    else:
        suffix = "actions"
        body["action"] = "skip"
    status, written = _call(request, result["steps"], action, "POST",
                            f"/emlis/threads/{result['thread_id']}/{suffix}", payload=body, timeout=60)
    reread = _read_thread(request, result, "after_action_read", wait_seconds=wait_seconds)
    result["final_state"] = reread.get("state")
    result["same_thread"] = result["thread_id"] == _read_uuid(reread.get("thread_id"))
    observed = _observation(written)
    result["same_observation"] = observed == _observation(reread) if observed.get("event_id") else None
    if action == "answer" and result["same_thread"]:
        for entry in reread.get("timeline") or []:
            if (entry.get("kind") == "ANSWER" and entry.get("question_id") == question_id
                    and entry.get("text") == case["answer_text"]):
                result["answer_id"] = _read_uuid(entry.get("event_id"))
    if status != 200 and not result["answer_id"]:
        result["stop"] = "action_not_confirmed"
    return result


def _piece_selection(case):
    default = {"theme_id": None, "aspect_ratio": None, "branding_mode": None}
    return {**default, **case.get("piece_visual_selection", {})}


def run_piece(request, case, emlis, *, run_id, save=True):
    """Read the saved source, generate, optionally edit, save private and reread."""
    case_id = case["case_id"]
    result = {"piece_id": None, "steps": [], "native_png_exercised": False}
    if not (input_id := _read_uuid(emlis.get("input_id"))):
        result["stop"] = "no_saved_input"
        return result
    answer_id = _read_uuid(emlis.get("answer_id")) if case.get("piece_use_answer") else None
    if case.get("piece_use_answer") and answer_id is None:
        result["stop"] = "no_saved_selected_answer"
        return result
    headers = {"Cache-Control": "no-store", **_IOS_PIECE_HEADERS}
    path = f"{_PIECE_ROOT}/source-ref/{input_id}"
    if answer_id:
        path += "?" + urlencode({"supplemental_answer_identity": answer_id})
    status, source = _call(request, result["steps"], "source", "GET", path, headers=headers)
    if status != 200 or source.get("source_input_id") != input_id \
            or source.get("supplemental_answer_identity") != answer_id:
        result["stop"] = "piece_source_not_confirmed"
        return result
    payload = {"source_ref": source, "requested_format": case.get("piece_requested_format"),
               "visual_selection": _piece_selection(case)}
    status, preview = _call(request, result["steps"], "preview", "POST", f"{_PIECE_ROOT}/preview",
                            payload=payload, headers={**headers, "Idempotency-Key":
                            _operation_key(run_id, case_id, "piece-preview")}, timeout=250)
    if status != 200 or not (preview_id := _read_uuid(preview.get("preview_id"))):
        result["stop"] = "piece_preview_not_confirmed"
        return result
    result["preview_id"] = preview_id
    if "piece_visual_edit" in case:
        change = {"expected_preview_revision": preview.get("preview_revision"),
                  "visual_selection": _piece_selection({"piece_visual_selection": case["piece_visual_edit"]})}
        status, new_preview = _call(request, result["steps"], "visual_edit", "PATCH",
                                    f"{_PIECE_ROOT}/preview/{preview_id}", payload=change, headers=headers)
        if status == 200 and _read_uuid(new_preview.get("preview_id")) == preview_id:
            preview = new_preview
        elif not case.get("piece_edit_expected_denied"):
            result["stop"] = "piece_visual_edit_not_confirmed"
            return result
    if not save:
        return result
    payload = {"preview_id": preview_id, "expected_preview_revision": preview.get("preview_revision"),
               "visibility_scope": "private", **{field: preview.get(field) for field in _RECIPE_FIELDS}}
    status, saved = _call(request, result["steps"], "save_private", "POST", f"{_PIECE_ROOT}/save",
                          payload=payload, headers={**headers, "Idempotency-Key":
                          _operation_key(run_id, case_id, "piece-save")})
    if status != 200 or saved.get("piece_id") != preview_id or saved.get("visibility_scope") != "private":
        result["stop"] = "piece_private_save_not_confirmed"
        return result
    result["piece_id"] = preview_id
    statuses = []
    for name, suffix in (("saved_detail", ""), ("export_recipe", "/export")):
        status, artifact = _call(request, result["steps"], name, "GET",
                                 f"{_PIECE_ROOT}/{quote(preview_id)}{suffix}", headers=headers)
        statuses.append(status == 200 and artifact.get("piece_id") == preview_id
                        and artifact.get("row_version") == saved.get("row_version")
                        and artifact.get("visibility_scope") == "private"
                        and all(field in artifact and artifact[field] == preview.get(field)
                                for field in _OWNER_FIELDS))
    result["same_saved_detail"] = statuses[0]
    result["same_export_recipe"] = statuses[1]
    return result
