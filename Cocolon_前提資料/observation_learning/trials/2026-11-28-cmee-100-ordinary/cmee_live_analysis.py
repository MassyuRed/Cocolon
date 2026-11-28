"""Exercise Cocolon's existing authenticated Analysis app routes.

Supply the API origin and an ordinary user's access token to LiveAnalysisClient.
Importing this module does not send requests. Mutations use the normal app
entries, with no privileged credentials, forced refreshes, or automatic replay.
"""

from __future__ import annotations

import json
import re
import time
from collections.abc import Callable, Sequence
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from uuid import UUID

_PROGRESS = Callable[[str, dict], None]
_IF_PATH = "/analysis/if-route/scenario-sets"
_SAVED_PATH = "/analysis/saved-route-intents"
_MAP_ACTIVE = {"queued", "running"}
_MAP_HEADERS = {
    "X-Watashi-Map-Renderer": "semantic.v3",
    "X-Watashi-Map-Structure-Relations": "v1",
}


class AnalysisAPIError(RuntimeError):
    """A network, HTTP, or response-contract failure without private data."""

    def __init__(self, method: str, route: str, *, status: int | None, code: str):
        self.method = method
        self.route = route
        self.status = status
        self.code = code
        category = f"HTTP {status}" if status is not None else "transport"
        super().__init__(f"{method} {route}: {category} ({code})")


class _NoRedirects(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        return None


def _response_code(error: HTTPError) -> str:
    try:
        detail = json.loads(error.read(16384)).get("detail")
    except (OSError, ValueError, AttributeError):
        return "http_error"
    if isinstance(detail, str) and re.fullmatch(
        r"(?:analysis_|deep_insight_)[a-z0-9_]{1,94}", detail
    ):
        return detail
    return "http_error"


def _identity_segment(value: str) -> str:
    return str(UUID(value))


def _page(limit, offset, *, max_limit, max_offset=None):
    if type(limit) is not int or not 1 <= limit <= max_limit:
        raise ValueError(f"limit must be between 1 and {max_limit}")
    if type(offset) is not int or offset < 0 or (max_offset is not None and offset > max_offset):
        raise ValueError("offset is out of range")
    return {"limit": limit, "offset": offset}


def _nonempty_text(value, *, name, max_length):
    if not isinstance(value, str) or not value.strip() or len(value) > max_length:
        raise ValueError(f"{name} must contain text of at most {max_length} characters")
    return value


def _text_list(values, *, name, max_items):
    if not isinstance(values, Sequence) or isinstance(values, (str, bytes)) or len(values) > max_items:
        raise ValueError(f"{name} must be a sequence of at most {max_items} text values")
    return [_nonempty_text(value, name=name, max_length=2000) for value in values]


class LiveAnalysisClient:
    def __init__(self, base_url: str, access_token: str, *, request_timeout: float = 20.0):
        url = urlsplit(base_url)
        if (url.scheme != "https" or not url.hostname or url.username is not None
                or url.password is not None or url.query or url.fragment):
            raise ValueError("base_url must be an HTTPS API URL")
        if not isinstance(access_token, str) or not access_token or any(c.isspace() for c in access_token):
            raise ValueError("access_token must be the ordinary bearer token without a prefix")
        if request_timeout <= 0:
            raise ValueError("request_timeout must be positive")
        self._base = base_url.rstrip("/")
        self._token = access_token
        self._timeout = request_timeout
        self._opener = build_opener(_NoRedirects())

    def _request(self, method, path, *, params=None, payload=None, map_headers=False, timeout=None):
        url = self._base + path
        if params:
            url += "?" + urlencode(params)
        headers = {
            "Authorization": "Bearer " + self._token,
            "Accept": "application/json",
            "Cache-Control": "no-store",
        }
        if map_headers:
            headers.update(_MAP_HEADERS)
        data = None
        if payload is not None:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"
        request = Request(url, data=data, headers=headers, method=method)
        # Report only public route families when a path includes an owned ID.
        family, _, _ = path.rpartition("/")
        route = family + "/{id}" if family in {
            "/self-structure/reports", "/deep-insight/questions", _IF_PATH, _SAVED_PATH,
        } and path != "/self-structure/reports/history" else path
        try:
            with self._opener.open(request, timeout=self._timeout if timeout is None else timeout) as response:
                try:
                    result = json.load(response)
                except (ValueError, UnicodeError):
                    raise AnalysisAPIError(method, route, status=response.status, code="invalid_json") from None
                if not isinstance(result, dict):
                    raise AnalysisAPIError(method, route, status=response.status, code="invalid_envelope")
                return result
        except HTTPError as error:
            with error:
                raise AnalysisAPIError(method, route, status=error.code, code=_response_code(error)) from None
        except (URLError, OSError) as error:
            reason = getattr(error, "reason", None)
            code = "timeout" if isinstance(error, TimeoutError) or isinstance(reason, TimeoutError) else "network_error"
            raise AnalysisAPIError(method, route, status=None, code=code) from None

    def map_status(self, *, request_timeout: float | None = None) -> dict:
        return self._request("GET", "/self-structure/latest/status", timeout=request_timeout)

    def read_current_map(self) -> dict:
        return self._request(
            "GET", "/self-structure/latest",
            params={"ensure": "false", "background": "true"}, map_headers=True,
        )

    def request_current_map(self) -> dict:
        """Request the normal debounced map-view refresh once."""
        return self._request(
            "GET", "/self-structure/latest",
            params={"ensure": "true", "background": "true"}, map_headers=True,
        )

    def wait_current_map(
        self, *, timeout: float = 360.0, poll_interval: float = 3.0,
        initial_refresh_status: str | None = None, baseline_version: str | None = None,
        progress: _PROGRESS | None = None,
    ) -> dict:
        """Poll only the status route until the normal refresh settles.

        A completed job can leave the previous map unchanged. The returned
        version and refresh state identify whether new content was published.
        """
        if timeout <= 0 or poll_interval <= 0:
            raise ValueError("timeout and poll_interval must be positive")
        deadline = time.monotonic() + timeout
        previous = object()
        saw_active = initial_refresh_status in _MAP_ACTIVE
        while (remaining := deadline - time.monotonic()) > 0:
            try:
                status = self.map_status(request_timeout=min(self._timeout, remaining))
            except AnalysisAPIError as error:
                if error.status is not None and not 500 <= error.status <= 599:
                    raise
                _emit(progress, "map_status_unavailable", http_status=error.status)
                time.sleep(min(poll_interval, max(0.0, deadline - time.monotonic())))
                continue
            phase = status.get("refresh_status")
            if phase != previous:
                _emit(progress, "map_refresh", refresh_status=phase,
                      has_visible_content=status.get("has_visible_content"),
                      skip_reason=status.get("skip_reason"))
                previous = phase
            saw_active = saw_active or phase in _MAP_ACTIVE
            if phase in _MAP_ACTIVE:
                time.sleep(min(poll_interval, max(0.0, deadline - time.monotonic())))
                continue
            return {
                "status": status,
                "saw_active": saw_active,
                "version_changed": bool(status.get("version_key")) and status["version_key"] != baseline_version,
            }
        raise TimeoutError("Watashi Map background refresh did not settle before the deadline")

    def read_monthly_maps(self, *, limit: int = 60, offset: int = 0) -> dict:
        return self._request(
            "GET", "/self-structure/reports/history",
            params={"report_type": "monthly", **_page(limit, offset, max_limit=200)},
            map_headers=True,
        )

    def read_map_report(self, report_id: str, *, month: str | None = None) -> dict:
        params = None
        if month is not None:
            if not isinstance(month, str) or not re.fullmatch(r"\d{4}-(0[1-9]|1[0-2])", month):
                raise ValueError("month must use YYYY-MM")
            params = {"month": month}
        # This route also accepts older report identifiers.
        identity = quote(_nonempty_text(report_id, name="report_id", max_length=256), safe="")
        result = self._request(
            "GET", "/self-structure/reports/" + identity, params=params, map_headers=True,
        )
        row = result.get("item") or {}
        if row.get("id") != report_id or (month is not None and row.get("snapshot_month") != month):
            raise AnalysisAPIError("GET", "/self-structure/reports/{id}", status=200, code="analysis_report_identity_mismatch")
        return result

    def deep_insight_state(self) -> dict:
        return self._request("GET", "/deep-insight")

    def issue_deep_insight(self, lane: str, theme: str | None = None, *, timeout: float = 110.0) -> dict:
        _validate_lane(lane, theme, require_theme=True)
        payload = {"lane": lane}
        if lane == "theme":
            payload["theme"] = theme.strip()
        return self._request("POST", "/deep-insight/questions", payload=payload, timeout=timeout)

    def read_deep_insight_question(self, question_id: str) -> dict:
        return self._request("GET", "/deep-insight/questions/" + _identity_segment(question_id))

    def answer_deep_insight(self, question_id: str, answer_text: str) -> dict:
        if "\x00" in _nonempty_text(answer_text, name="answer_text", max_length=2000):
            raise ValueError("answer_text contains a null character")
        return self._request("POST", "/deep-insight/answers", payload={
            "question_id": _identity_segment(question_id), "answer_text": answer_text,
        })

    def create_if_scenario_set(
        self, base_map_ref: str, branch_point_id: str, *, intent: str | None = None,
        constraints: Sequence[str] = (), candidate_count: int = 1,
        constraints_confirmed: bool = False, scenario_choices: Sequence[str] = (),
        idempotency_key: str, timeout: float = 230.0,
    ) -> dict:
        if type(candidate_count) is not int or not 1 <= candidate_count <= 3:
            raise ValueError("candidate_count must be between 1 and 3")
        if type(constraints_confirmed) is not bool:
            raise ValueError("constraints_confirmed must be a boolean")
        if intent is not None:
            intent = _nonempty_text(intent, name="intent", max_length=2000)
        return self._request("POST", _IF_PATH, timeout=timeout, payload={
            "base_observed_map_ref": _nonempty_text(base_map_ref, name="base_map_ref", max_length=256),
            "branch_point_id": _nonempty_text(branch_point_id, name="branch_point_id", max_length=256),
            "branch_intent_text": intent,
            "constraint_texts": _text_list(constraints, name="constraints", max_items=10),
            "requested_candidate_count": candidate_count,
            "constraints_confirmed": constraints_confirmed,
            "scenario_choice_texts": _text_list(scenario_choices, name="scenario_choices", max_items=3),
            "idempotency_key": _nonempty_text(idempotency_key, name="idempotency_key", max_length=128),
        })

    def read_if_scenario_sets(self, *, limit: int = 60, offset: int = 0) -> dict:
        return self._request("GET", _IF_PATH, params=_page(limit, offset, max_limit=100, max_offset=10000))

    def read_if_scenario_set(self, artifact_id: str) -> dict:
        return self._request("GET", _IF_PATH + "/" + _identity_segment(artifact_id))

    def delete_if_scenario_set(self, artifact_id: str) -> dict:
        return self._request("DELETE", _IF_PATH + "/" + _identity_segment(artifact_id))

    def save_route_intent(
        self, scenario_set_ref: str, scenario_ref: str, *, idempotency_key: str,
        user_note: str | None = None,
    ) -> dict:
        if user_note is not None:
            user_note = _nonempty_text(user_note, name="user_note", max_length=2000)
        return self._request("POST", _SAVED_PATH, payload={
            "source_scenario_set_ref": _nonempty_text(scenario_set_ref, name="scenario_set_ref", max_length=256),
            "selected_scenario_ref": _nonempty_text(scenario_ref, name="scenario_ref", max_length=256),
            "user_note": user_note,
            "idempotency_key": _nonempty_text(idempotency_key, name="idempotency_key", max_length=128),
        })

    def read_saved_route_intents(self, *, limit: int = 60, offset: int = 0) -> dict:
        return self._request("GET", _SAVED_PATH, params=_page(limit, offset, max_limit=100, max_offset=10000))

    def read_saved_route_intent(self, artifact_id: str) -> dict:
        return self._request("GET", _SAVED_PATH + "/" + _identity_segment(artifact_id))

    def delete_saved_route_intent(self, artifact_id: str) -> dict:
        return self._request("DELETE", _SAVED_PATH + "/" + _identity_segment(artifact_id))


def _emit(progress, event, **details):
    if progress is not None:
        progress(event, details)


def _validate_lane(lane, theme, *, require_theme):
    if lane not in ("records", "theme"):
        raise ValueError("lane must be records or theme")
    if lane == "records" and theme is not None:
        raise ValueError("only the theme entrance accepts a theme")
    if lane == "theme" and (require_theme or theme is not None):
        if any(char in _nonempty_text(theme, name="theme", max_length=40) for char in "\r\n\x00"):
            raise ValueError("theme must be a single line")


def run_map_flow(
    client: LiveAnalysisClient, *, request_refresh: bool = False, wait: bool = True,
    timeout: float = 360.0, poll_interval: float = 3.0, monthly_limit: int = 5,
    monthly_offset: int = 0, include_monthly_details: bool = True, progress: _PROGRESS | None = None,
) -> dict:
    """Read the current map and monthly history, with an optional normal refresh."""
    before = client.map_status()
    _emit(progress, "map_status", refresh_status=before.get("refresh_status"),
          has_visible_content=before.get("has_visible_content"), skip_reason=before.get("skip_reason"))
    requested = client.request_current_map() if request_refresh else None
    marker = requested if requested is not None else before
    result = {"initial_status": before, "request": requested}
    if wait and marker.get("refresh_status") in _MAP_ACTIVE:
        result["wait"] = client.wait_current_map(
            timeout=timeout, poll_interval=poll_interval, initial_refresh_status=marker["refresh_status"],
            baseline_version=before.get("version_key"), progress=progress,
        )
    result["current"] = client.read_current_map()
    history = client.read_monthly_maps(limit=monthly_limit, offset=monthly_offset)
    result["monthly_history"] = history
    _emit(progress, "map_monthly_history", item_count=len(history.get("items", [])))
    if include_monthly_details:
        result["monthly_reports"] = [
            client.read_map_report(item["id"], month=item.get("snapshot_month"))
            for item in history.get("items", [])
        ]
    return result


def run_deep_insight_flow(
    client: LiveAnalysisClient, lane: str, *, theme: str | None = None, issue: bool = False,
    answer_text: str | None = None, question_id: str | None = None,
    issue_timeout: float = 110.0, progress: _PROGRESS | None = None,
) -> dict:
    """Use the theme or records entrance and return the app's business result."""
    _validate_lane(lane, theme, require_theme=issue)
    state = client.deep_insight_state()
    eligible = state.get("can_use_" + lane) is True
    if not eligible:
        _emit(progress, "deep_insight", lane=lane, status="locked")
        return {"status": "locked", "state": state}
    question = client.read_deep_insight_question(question_id) if question_id else state.get(lane)
    if question and question.get("lane") != lane:
        raise ValueError("question_id does not belong to the selected entrance")
    matches_theme = lane != "theme" or theme is None or (question or {}).get("theme") == theme.strip()
    if issue and question_id is None and (not question or not matches_theme):
        result = client.issue_deep_insight(lane, theme, timeout=issue_timeout)
        question = result.get("question")
        if question and (question.get("lane") != lane or (lane == "theme" and question.get("theme") != theme.strip())):
            _emit(progress, "deep_insight", lane=lane, status="existing_different_input")
            return {"status": "existing_different_input", "state": state, "issue": result}
        matches_theme = True
        status = result["status"]
    else:
        result = None
        status = "existing" if question and matches_theme else "not_requested"
    _emit(progress, "deep_insight", lane=lane, status=status)
    outcome = {"status": status, "state": state, "issue": result, "question": question}
    if question and matches_theme and answer_text is not None:
        # Re-read a question surfaced by state/issuance before posting an answer.
        if question_id is None:
            question = client.read_deep_insight_question(question["id"])
        if question.get("answered_at"):
            outcome.update(status="already_answered", question=question)
        else:
            answered = client.answer_deep_insight(question["id"], answer_text)
            outcome.update(status="answered", answer=answered, question=answered["question"])
        _emit(progress, "deep_insight_answer", lane=lane, status=outcome["status"])
    return outcome


def if_route_branch_options(client: LiveAnalysisClient) -> dict:
    """Expose the same owned, visible Premium nodes/edges as the app dialog."""
    current = client.read_current_map()
    if current.get("map_subscription_tier") != "premium":
        return {"status": "locked"}
    graph = current.get("meta")
    if current.get("has_visible_content") is not True or not graph or not graph.get("projection_of"):
        return {"status": "map_unavailable", "skip_reason": current.get("skip_reason")}
    if graph.get("wire_kind") != "watashi.map.v3":
        return {"status": "no_branch", "map_ref": graph["projection_of"], "branches": []}
    branches = [
        {"id": item[key], "kind": kind, "label": item.get("title") or item.get("label")}
        for collection, kind, key in (("nodes", "node", "node_ref"), ("edges", "edge", "edge_ref"))
        for item in graph.get(collection, []) if item.get(key)
    ]
    return {"status": "ready" if branches else "no_branch", "map_ref": graph["projection_of"], "branches": branches}


def run_if_flow(
    client: LiveAnalysisClient, *, branch_point_id: str | None = None,
    intent: str | None = None, constraints: Sequence[str] = (), candidate_count: int = 1,
    constraints_confirmed: bool = False, scenario_choices: Sequence[str] = (),
    idempotency_key: str | None = None, timeout: float = 230.0, progress: _PROGRESS | None = None,
) -> dict:
    """Inspect usable Premium branches or explicitly request an IF route."""
    options = if_route_branch_options(client)
    _emit(progress, "if_route_branches", status=options["status"], branch_count=len(options.get("branches", [])))
    if branch_point_id is None or options["status"] != "ready":
        return options
    if branch_point_id not in {branch["id"] for branch in options["branches"]}:
        return {"status": "branch_unavailable", "options": options}
    if idempotency_key is None:
        raise ValueError("idempotency_key is required to submit an IF request")
    result = client.create_if_scenario_set(
        options["map_ref"], branch_point_id, intent=intent, constraints=constraints,
        candidate_count=candidate_count, constraints_confirmed=constraints_confirmed,
        scenario_choices=scenario_choices, idempotency_key=idempotency_key, timeout=timeout,
    )
    _emit(progress, "if_route", status=result.get("status"))
    return result
