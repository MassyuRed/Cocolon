#!/usr/bin/env python3
"""Cocolon formal publication guardian.

This program is trusted default-branch code.  It never checks out or executes
candidate content.  Candidate commits are inspected only as Git objects.
"""

from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.request
from typing import Any, Iterable, Mapping, Sequence


MAGIC = "COCOLON_FORMAL_PUBLICATION_REQUEST_V1"
TITLE_PREFIX = f"{MAGIC} "
REQUEST_SCHEMA_VERSION = "cocolon.formal_publication.request.v1"
POLICY_SCHEMA_VERSION = "cocolon.formal_publication.guardian.policy.v1"
REQUEST_HASH_DOMAIN = b"cocolon.formal_publication.request.v1\0"
REQUEST_ID_HASH_DOMAIN = b"cocolon.formal_publication.request-id.v1\0"
HEX40 = re.compile(r"^[0-9a-f]{40}$")
HEX64 = re.compile(r"^[0-9a-f]{64}$")
REQUEST_ID = re.compile(r"^g1-[0-9a-f]{64}$")
RFC3339_UTC = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$")
SANDBOX_REF = re.compile(
    r"^refs/heads/guardian/sandbox/[a-z0-9][a-z0-9._-]{0,79}/"
    r"[a-z0-9][a-z0-9._-]{0,79}$"
)
SAFE_SUBJECT = re.compile(r"^[^\x00-\x1f\x7f-\x9f]{1,120}$")
BUILTIN_LOCKED_EXACT = frozenset(
    {
        ".gitmodules",
        "Cocolon_前提資料/12_cocolon_github_actions_publication_guard.md",
    }
)
BUILTIN_LOCKED_PREFIXES = (".github/",)

REQUEST_FIELDS = frozenset(
    {
        "schema_version",
        "request_id",
        "request_mode",
        "repository_id",
        "repository",
        "target_ref",
        "workflow_sha1",
        "expected_old_sha1",
        "staging_ref",
        "staging_head_sha1",
        "authority",
        "commit",
        "expires_at_utc",
        "files",
        "files_sha256",
        "sandbox_test",
        "request_sha256",
    }
)
AUTHORITY_FIELDS = frozenset({"name", "utf8_lf_sha256"})
COMMIT_FIELDS = frozenset({"subject", "timestamp_utc"})
FILE_FIELDS = frozenset(
    {
        "path",
        "operation",
        "old_mode",
        "new_mode",
        "old_blob_sha1",
        "new_blob_sha1",
        "raw_sha256",
        "size_bytes",
    }
)
SANDBOX_TEST_FIELDS = frozenset({"case", "drift_ref", "drift_sha1"})


class GuardianReject(Exception):
    """A typed, body-free fail-closed outcome."""

    def __init__(
        self,
        code: str,
        stage: str,
        detail: str = "",
        *,
        write_attempted: bool = False,
        result_uncertain: bool = False,
    ) -> None:
        super().__init__(f"{code} at {stage}: {detail}")
        self.code = code
        self.stage = stage
        self.detail = detail
        self.write_attempted = write_attempted
        self.result_uncertain = result_uncertain


@dataclasses.dataclass(frozen=True)
class Policy:
    raw: Mapping[str, Any]
    sha256: str
    design_sha256: str
    repository: str
    repository_id: int
    default_ref: str
    staging_ref_prefix: str
    sandbox_target_prefix: str
    sandbox_test_path_prefix: str
    actor_allowlist: tuple[tuple[int, str, str], ...]
    mode: str
    production_main_enabled: bool
    sandbox_write_enabled: bool
    sandbox_fault_injection_enabled: bool
    locked_exact_paths: frozenset[str]
    locked_path_prefixes: tuple[str, ...]
    maximum_request_body_bytes: int
    maximum_total_paths: int
    maximum_staging_commits: int
    maximum_single_file_bytes: int
    maximum_total_changed_bytes: int
    request_validity_seconds: int
    author_name: str
    author_email: str


@dataclasses.dataclass(frozen=True)
class FileEntry:
    path: str
    operation: str
    old_mode: str | None
    new_mode: str
    old_blob_sha1: str | None
    new_blob_sha1: str
    raw_sha256: str
    size_bytes: int


@dataclasses.dataclass(frozen=True)
class PublicationRequest:
    raw: Mapping[str, Any]
    request_id: str
    request_mode: str
    target_ref: str
    workflow_sha1: str
    expected_old_sha1: str
    staging_ref: str
    staging_head_sha1: str
    authority_name: str
    authority_sha256: str
    commit_subject: str
    commit_timestamp_utc: str
    expires_at_utc: str
    files: tuple[FileEntry, ...]
    files_sha256: str
    sandbox_test: Mapping[str, Any] | None
    request_sha256: str


@dataclasses.dataclass(frozen=True)
class CandidateProof:
    candidate_sha1: str
    tree_sha1: str
    parent_sha1: str
    files: tuple[FileEntry, ...]


@dataclasses.dataclass(frozen=True)
class WritePermit:
    target_ref: str
    expected_old_sha1: str
    candidate_sha1: str
    target_class: str
    policy_sha256: str
    request_sha256: str


def _reject_float(_: str) -> None:
    raise GuardianReject("REJECTED_NON_INTEGER_NUMBER", "JSON_PARSE")


def _reject_constant(_: str) -> None:
    raise GuardianReject("REJECTED_NON_FINITE_NUMBER", "JSON_PARSE")


def _object_without_duplicates(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise GuardianReject("REJECTED_DUPLICATE_JSON_KEY", "JSON_PARSE")
        result[key] = value
    return result


def strict_json_loads(text: str) -> Any:
    try:
        return json.loads(
            text,
            object_pairs_hook=_object_without_duplicates,
            parse_float=_reject_float,
            parse_constant=_reject_constant,
        )
    except GuardianReject:
        raise
    except (json.JSONDecodeError, UnicodeError, ValueError) as exc:
        raise GuardianReject("REJECTED_INVALID_JSON", "JSON_PARSE", type(exc).__name__) from exc


def canonical_json_bytes(value: Any) -> bytes:
    try:
        return json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
            allow_nan=False,
        ).encode("utf-8")
    except (TypeError, ValueError, UnicodeError) as exc:
        raise GuardianReject("REJECTED_NON_CANONICAL_JSON", "JSON_CANONICAL", type(exc).__name__) from exc


def sha256_hex(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def git_blob_sha1(raw: bytes) -> str:
    header = b"blob " + str(len(raw)).encode("ascii") + b"\0"
    return hashlib.sha1(header + raw, usedforsecurity=False).hexdigest()


def request_hash(value: Mapping[str, Any]) -> str:
    unsigned = dict(value)
    unsigned.pop("request_sha256", None)
    return sha256_hex(REQUEST_HASH_DOMAIN + canonical_json_bytes(unsigned) + b"\n")


def files_hash(files: Sequence[Mapping[str, Any]]) -> str:
    return sha256_hex(canonical_json_bytes(list(files)) + b"\n")


def bound_request_id(
    target_ref: str,
    expected_old_sha1: str,
    files_sha256: str,
) -> str:
    binding = {
        "expected_old_sha1": expected_old_sha1,
        "files_sha256": files_sha256,
        "target_ref": target_ref,
    }
    digest = sha256_hex(
        REQUEST_ID_HASH_DOMAIN + canonical_json_bytes(binding) + b"\n"
    )
    return f"g1-{digest}"


def _require_exact_keys(value: Any, expected: frozenset[str], stage: str) -> Mapping[str, Any]:
    if type(value) is not dict:
        raise GuardianReject("REJECTED_WRONG_TYPE", stage)
    keys = frozenset(value)
    if keys != expected:
        raise GuardianReject("REJECTED_FIELD_SET", stage)
    return value


def _require_str(value: Any, stage: str, *, minimum: int = 0, maximum: int = 4096) -> str:
    if type(value) is not str or not (minimum <= len(value) <= maximum):
        raise GuardianReject("REJECTED_WRONG_STRING", stage)
    if unicodedata.normalize("NFC", value) != value:
        raise GuardianReject("REJECTED_NON_NFC_STRING", stage)
    try:
        value.encode("utf-8", "strict")
    except UnicodeError as exc:
        raise GuardianReject("REJECTED_INVALID_UNICODE", stage) from exc
    return value


def _require_bool(value: Any, stage: str) -> bool:
    if type(value) is not bool:
        raise GuardianReject("REJECTED_WRONG_BOOLEAN", stage)
    return value


def _require_int(
    value: Any,
    stage: str,
    *,
    minimum: int = 0,
    maximum: int = 2**63 - 1,
) -> int:
    if type(value) is not int or not (minimum <= value <= maximum):
        raise GuardianReject("REJECTED_WRONG_INTEGER", stage)
    return value


def _require_hex(value: Any, pattern: re.Pattern[str], stage: str) -> str:
    text = _require_str(value, stage, minimum=1, maximum=64)
    if not pattern.fullmatch(text):
        raise GuardianReject("REJECTED_INVALID_HASH", stage)
    return text


def _parse_utc(value: Any, stage: str) -> dt.datetime:
    text = _require_str(value, stage, minimum=20, maximum=20)
    if not RFC3339_UTC.fullmatch(text):
        raise GuardianReject("REJECTED_INVALID_TIMESTAMP", stage)
    try:
        parsed = dt.datetime.strptime(text, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc)
    except ValueError as exc:
        raise GuardianReject("REJECTED_INVALID_TIMESTAMP", stage) from exc
    if parsed.strftime("%Y-%m-%dT%H:%M:%SZ") != text:
        raise GuardianReject("REJECTED_INVALID_TIMESTAMP", stage)
    return parsed


def _walk_json(value: Any, stage: str = "JSON_VALUE") -> None:
    if value is None or type(value) in {str, bool, int}:
        if type(value) is str:
            _require_str(value, stage, maximum=65536)
        if type(value) is int and not -(2**63) <= value <= 2**63 - 1:
            raise GuardianReject("REJECTED_INTEGER_RANGE", stage)
        return
    if type(value) is list:
        for item in value:
            _walk_json(item, stage)
        return
    if type(value) is dict:
        for key, item in value.items():
            _require_str(key, stage, maximum=256)
            _walk_json(item, stage)
        return
    raise GuardianReject("REJECTED_WRONG_TYPE", stage)


def load_policy(path: pathlib.Path) -> Policy:
    raw_bytes = path.read_bytes()
    if raw_bytes.startswith(b"\xef\xbb\xbf") or b"\r" in raw_bytes:
        raise GuardianReject("REJECTED_POLICY_ENCODING", "POLICY")
    try:
        text = raw_bytes.decode("utf-8", "strict")
    except UnicodeError as exc:
        raise GuardianReject("REJECTED_POLICY_ENCODING", "POLICY") from exc
    raw = strict_json_loads(text)
    if type(raw) is not dict:
        raise GuardianReject("REJECTED_POLICY_TYPE", "POLICY")
    _walk_json(raw, "POLICY")
    required = {
        "schema_version",
        "repository",
        "repository_id",
        "default_ref",
        "staging_ref_prefix",
        "sandbox_target_prefix",
        "sandbox_test_path_prefix",
        "actor_allowlist",
        "mode",
        "production_main_enabled",
        "sandbox_write_enabled",
        "sandbox_fault_injection_enabled",
        "locked_exact_paths",
        "locked_path_prefixes",
        "maximum_request_body_bytes",
        "maximum_total_paths",
        "maximum_staging_commits",
        "maximum_single_file_bytes",
        "maximum_total_changed_bytes",
        "request_validity_seconds",
        "author_name",
        "author_email",
        "design_sha256",
    }
    if set(raw) != required:
        raise GuardianReject("REJECTED_POLICY_FIELD_SET", "POLICY")
    if raw["schema_version"] != POLICY_SCHEMA_VERSION:
        raise GuardianReject("REJECTED_POLICY_VERSION", "POLICY")
    mode = _require_str(raw["mode"], "POLICY_MODE", minimum=1, maximum=64)
    if mode not in {"OBSERVE_ONLY", "OBSERVE_AND_SANDBOX_ONLY", "PRODUCTION_ACTIVE"}:
        raise GuardianReject("REJECTED_POLICY_MODE", "POLICY")
    actor_raw = raw["actor_allowlist"]
    if type(actor_raw) is not list:
        raise GuardianReject("REJECTED_POLICY_ACTORS", "POLICY")
    actors: list[tuple[int, str, str]] = []
    for item in actor_raw:
        exact = _require_exact_keys(item, frozenset({"id", "login", "type"}), "POLICY_ACTOR")
        actor = (
            _require_int(exact["id"], "POLICY_ACTOR_ID", minimum=1),
            _require_str(exact["login"], "POLICY_ACTOR_LOGIN", minimum=1, maximum=128),
            _require_str(exact["type"], "POLICY_ACTOR_TYPE", minimum=1, maximum=64),
        )
        if actor in actors:
            raise GuardianReject("REJECTED_POLICY_ACTOR_DUPLICATE", "POLICY")
        actors.append(actor)
    locked_exact = raw["locked_exact_paths"]
    locked_prefixes = raw["locked_path_prefixes"]
    if type(locked_exact) is not list or type(locked_prefixes) is not list:
        raise GuardianReject("REJECTED_POLICY_LOCKS", "POLICY")
    exact_set = frozenset(_require_str(x, "POLICY_LOCK", minimum=1, maximum=1024) for x in locked_exact)
    prefix_tuple = tuple(
        _require_str(x, "POLICY_LOCK_PREFIX", minimum=1, maximum=1024)
        for x in locked_prefixes
    )
    if not BUILTIN_LOCKED_EXACT.issubset(exact_set):
        raise GuardianReject("REJECTED_POLICY_WEAKENED_LOCK", "POLICY")
    if not all(
        any(b.casefold().startswith(p.casefold()) for p in prefix_tuple)
        for b in BUILTIN_LOCKED_PREFIXES
    ):
        raise GuardianReject("REJECTED_POLICY_WEAKENED_LOCK", "POLICY")
    author_name = _require_str(raw["author_name"], "POLICY_AUTHOR", minimum=1, maximum=128)
    author_email = _require_str(raw["author_email"], "POLICY_EMAIL", minimum=3, maximum=254)
    if (
        any(ord(char) < 0x20 or ord(char) == 0x7F for char in author_name)
        or "<" in author_name
        or ">" in author_name
        or author_name != author_name.strip()
    ):
        raise GuardianReject("REJECTED_POLICY_AUTHOR", "POLICY")
    try:
        author_email.encode("ascii", "strict")
    except UnicodeError as exc:
        raise GuardianReject("REJECTED_POLICY_EMAIL", "POLICY") from exc
    if (
        author_email.count("@") != 1
        or any(char.isspace() or ord(char) < 0x21 or ord(char) == 0x7F for char in author_email)
        or "<" in author_email
        or ">" in author_email
    ):
        raise GuardianReject("REJECTED_POLICY_EMAIL", "POLICY")
    return Policy(
        raw=raw,
        sha256=sha256_hex(raw_bytes),
        design_sha256=_require_hex(raw["design_sha256"], HEX64, "POLICY_DESIGN_HASH"),
        repository=_require_str(raw["repository"], "POLICY_REPOSITORY", minimum=1, maximum=256),
        repository_id=_require_int(raw["repository_id"], "POLICY_REPOSITORY_ID", minimum=1),
        default_ref=_require_str(raw["default_ref"], "POLICY_DEFAULT_REF", minimum=1, maximum=256),
        staging_ref_prefix=_require_str(
            raw["staging_ref_prefix"], "POLICY_STAGING_PREFIX", minimum=1, maximum=256
        ),
        sandbox_target_prefix=_require_str(
            raw["sandbox_target_prefix"], "POLICY_SANDBOX_PREFIX", minimum=1, maximum=256
        ),
        sandbox_test_path_prefix=_require_str(
            raw["sandbox_test_path_prefix"], "POLICY_SANDBOX_PATH", minimum=1, maximum=512
        ),
        actor_allowlist=tuple(actors),
        mode=mode,
        production_main_enabled=_require_bool(raw["production_main_enabled"], "POLICY_PRODUCTION"),
        sandbox_write_enabled=_require_bool(raw["sandbox_write_enabled"], "POLICY_SANDBOX"),
        sandbox_fault_injection_enabled=_require_bool(
            raw["sandbox_fault_injection_enabled"], "POLICY_FAULT"
        ),
        locked_exact_paths=exact_set,
        locked_path_prefixes=prefix_tuple,
        maximum_request_body_bytes=_require_int(
            raw["maximum_request_body_bytes"], "POLICY_BODY_LIMIT", minimum=1024
        ),
        maximum_total_paths=_require_int(raw["maximum_total_paths"], "POLICY_PATH_LIMIT", minimum=1),
        maximum_staging_commits=_require_int(
            raw["maximum_staging_commits"], "POLICY_COMMIT_LIMIT", minimum=1
        ),
        maximum_single_file_bytes=_require_int(
            raw["maximum_single_file_bytes"], "POLICY_FILE_LIMIT", minimum=1
        ),
        maximum_total_changed_bytes=_require_int(
            raw["maximum_total_changed_bytes"], "POLICY_TOTAL_LIMIT", minimum=1
        ),
        request_validity_seconds=_require_int(
            raw["request_validity_seconds"], "POLICY_TIME_LIMIT", minimum=60, maximum=86400
        ),
        author_name=author_name,
        author_email=author_email,
    )


def validate_path(path: str) -> str:
    _require_str(path, "PATH", minimum=1, maximum=512)
    if path.startswith("/") or path.endswith("/") or "\\" in path:
        raise GuardianReject("REJECTED_UNSAFE_PATH", "PATH")
    parts = path.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise GuardianReject("REJECTED_UNSAFE_PATH", "PATH")
    for part in parts:
        if part.casefold() == ".git" or part.endswith((" ", ".")):
            raise GuardianReject("REJECTED_UNSAFE_PATH", "PATH")
    for char in path:
        code = ord(char)
        if code == 0 or code == 0x7F or code < 0x20 or 0x80 <= code <= 0x9F:
            raise GuardianReject("REJECTED_UNSAFE_PATH", "PATH")
    return path


def is_locked_path(path: str, policy: Policy) -> bool:
    folded = path.casefold()
    if folded in {x.casefold() for x in BUILTIN_LOCKED_EXACT | policy.locked_exact_paths}:
        return True
    prefixes = BUILTIN_LOCKED_PREFIXES + policy.locked_path_prefixes
    return any(
        folded == prefix.rstrip("/").casefold() or folded.startswith(prefix.casefold())
        for prefix in prefixes
    )


def _validate_collision_free(paths: Iterable[str]) -> None:
    folded: dict[str, str] = {}
    ordered = sorted(paths, key=lambda p: p.encode("utf-8"))
    for path in ordered:
        if path in folded.values():
            raise GuardianReject("REJECTED_DUPLICATE_PATH", "PATH_SET")
        key = unicodedata.normalize("NFC", path).casefold()
        if key in folded:
            raise GuardianReject("REJECTED_PATH_COLLISION", "PATH_SET")
        folded[key] = path
    for path in ordered:
        prefix = ""
        for component in path.split("/")[:-1]:
            prefix = component if not prefix else f"{prefix}/{component}"
            prefix_key = unicodedata.normalize("NFC", prefix).casefold()
            if prefix_key in folded:
                raise GuardianReject("REJECTED_FILE_DIRECTORY_COLLISION", "PATH_SET")


def parse_request_body(
    body: Any,
    policy: Policy,
    *,
    issue_created_at: str | None = None,
) -> PublicationRequest:
    body_text = _require_str(
        body,
        "ISSUE_BODY",
        minimum=len(MAGIC) + 4,
        maximum=policy.maximum_request_body_bytes,
    )
    body_bytes = body_text.encode("utf-8")
    if len(body_bytes) > policy.maximum_request_body_bytes:
        raise GuardianReject("REJECTED_BODY_TOO_LARGE", "ISSUE_BODY")
    prefix = (MAGIC + "\n").encode("utf-8")
    if not body_bytes.startswith(prefix) or not body_bytes.endswith(b"\n"):
        raise GuardianReject("REJECTED_BODY_ENVELOPE", "ISSUE_BODY")
    json_bytes = body_bytes[len(prefix) : -1]
    if not json_bytes or b"\n" in json_bytes or b"\r" in json_bytes or json_bytes.startswith(b"\xef\xbb\xbf"):
        raise GuardianReject("REJECTED_BODY_ENVELOPE", "ISSUE_BODY")
    try:
        json_text = json_bytes.decode("utf-8", "strict")
    except UnicodeError as exc:
        raise GuardianReject("REJECTED_BODY_ENCODING", "ISSUE_BODY") from exc
    raw = strict_json_loads(json_text)
    _walk_json(raw)
    exact = _require_exact_keys(raw, REQUEST_FIELDS, "REQUEST")
    if canonical_json_bytes(exact) != json_bytes:
        raise GuardianReject("REJECTED_NON_CANONICAL_JSON", "REQUEST")
    if exact["schema_version"] != REQUEST_SCHEMA_VERSION:
        raise GuardianReject("REJECTED_SCHEMA_VERSION", "REQUEST")
    request_id = _require_str(exact["request_id"], "REQUEST_ID", minimum=8, maximum=80)
    if not REQUEST_ID.fullmatch(request_id):
        raise GuardianReject("REJECTED_REQUEST_ID", "REQUEST")
    request_mode = _require_str(exact["request_mode"], "REQUEST_MODE", minimum=1, maximum=16)
    if request_mode not in {"publish", "reconcile"}:
        raise GuardianReject("REJECTED_REQUEST_MODE", "REQUEST")
    if exact["repository_id"] != policy.repository_id or exact["repository"] != policy.repository:
        raise GuardianReject("REJECTED_REPOSITORY", "REQUEST")
    target_ref = _require_str(exact["target_ref"], "TARGET_REF", minimum=1, maximum=256)
    workflow_sha1 = _require_hex(exact["workflow_sha1"], HEX40, "WORKFLOW_SHA")
    expected_old = _require_hex(exact["expected_old_sha1"], HEX40, "EXPECTED_OLD")
    staging_ref = _require_str(exact["staging_ref"], "STAGING_REF", minimum=1, maximum=256)
    if staging_ref != f"{policy.staging_ref_prefix}{request_id}":
        raise GuardianReject("REJECTED_STAGING_REF", "REQUEST")
    staging_head = _require_hex(exact["staging_head_sha1"], HEX40, "STAGING_HEAD")
    authority = _require_exact_keys(exact["authority"], AUTHORITY_FIELDS, "AUTHORITY")
    authority_name = _require_str(authority["name"], "AUTHORITY_NAME", minimum=1, maximum=512)
    authority_hash = _require_hex(authority["utf8_lf_sha256"], HEX64, "AUTHORITY_HASH")
    commit = _require_exact_keys(exact["commit"], COMMIT_FIELDS, "COMMIT")
    subject = _require_str(commit["subject"], "COMMIT_SUBJECT", minimum=1, maximum=120)
    if not SAFE_SUBJECT.fullmatch(subject) or subject != subject.strip():
        raise GuardianReject("REJECTED_COMMIT_SUBJECT", "COMMIT")
    commit_time = _parse_utc(commit["timestamp_utc"], "COMMIT_TIME")
    expiry = _parse_utc(exact["expires_at_utc"], "EXPIRY")
    if expiry <= commit_time or (expiry - commit_time).total_seconds() > policy.request_validity_seconds:
        raise GuardianReject("REJECTED_VALIDITY_WINDOW", "EXPIRY")
    if issue_created_at is not None:
        issue_time = _parse_utc(issue_created_at, "ISSUE_CREATED_AT")
        clock_skew = dt.timedelta(minutes=5)
        if commit_time > issue_time + clock_skew:
            raise GuardianReject("REJECTED_FUTURE_COMMIT_TIME", "EXPIRY")
        if expiry > issue_time + dt.timedelta(seconds=policy.request_validity_seconds):
            raise GuardianReject("REJECTED_VALIDITY_WINDOW", "EXPIRY")
    file_values = exact["files"]
    if type(file_values) is not list or not (1 <= len(file_values) <= policy.maximum_total_paths):
        raise GuardianReject("REJECTED_FILE_COUNT", "FILES")
    entries: list[FileEntry] = []
    total = 0
    for value in file_values:
        file_raw = _require_exact_keys(value, FILE_FIELDS, "FILE")
        path = validate_path(_require_str(file_raw["path"], "FILE_PATH", minimum=1, maximum=512))
        operation = _require_str(file_raw["operation"], "FILE_OPERATION", minimum=3, maximum=8)
        if operation not in {"add", "modify"}:
            raise GuardianReject("REJECTED_OPERATION", "FILE")
        old_mode_value = file_raw["old_mode"]
        old_blob_value = file_raw["old_blob_sha1"]
        new_mode = _require_str(file_raw["new_mode"], "NEW_MODE", minimum=6, maximum=6)
        if new_mode not in {"100644", "100755"}:
            raise GuardianReject("REJECTED_MODE", "FILE")
        if operation == "add":
            if old_mode_value is not None or old_blob_value is not None or new_mode != "100644":
                raise GuardianReject("REJECTED_ADD_CONTRACT", "FILE")
            old_mode = None
            old_blob = None
        else:
            old_mode = _require_str(old_mode_value, "OLD_MODE", minimum=6, maximum=6)
            if old_mode not in {"100644", "100755"} or new_mode != old_mode:
                raise GuardianReject("REJECTED_MODE_CHANGE", "FILE")
            old_blob = _require_hex(old_blob_value, HEX40, "OLD_BLOB")
        new_blob = _require_hex(file_raw["new_blob_sha1"], HEX40, "NEW_BLOB")
        raw_hash = _require_hex(file_raw["raw_sha256"], HEX64, "RAW_HASH")
        size = _require_int(
            file_raw["size_bytes"],
            "FILE_SIZE",
            minimum=0,
            maximum=policy.maximum_single_file_bytes,
        )
        total += size
        entries.append(
            FileEntry(path, operation, old_mode, new_mode, old_blob, new_blob, raw_hash, size)
        )
    if total > policy.maximum_total_changed_bytes:
        raise GuardianReject("REJECTED_TOTAL_SIZE", "FILES")
    paths = [entry.path for entry in entries]
    if paths != sorted(paths, key=lambda p: p.encode("utf-8")):
        raise GuardianReject("REJECTED_FILE_ORDER", "FILES")
    _validate_collision_free(paths)
    if any(is_locked_path(path, policy) for path in paths):
        raise GuardianReject("REJECTED_LOCKED_PATH", "FILES")
    expected_files_hash = _require_hex(exact["files_sha256"], HEX64, "FILES_HASH")
    if expected_files_hash != files_hash(file_values):
        raise GuardianReject("REJECTED_FILES_HASH", "FILES")
    if request_id != bound_request_id(
        target_ref,
        expected_old,
        expected_files_hash,
    ):
        raise GuardianReject("REJECTED_REQUEST_ID_BINDING", "REQUEST")
    expected_request_hash = _require_hex(exact["request_sha256"], HEX64, "REQUEST_HASH")
    if expected_request_hash != request_hash(exact):
        raise GuardianReject("REJECTED_REQUEST_HASH", "REQUEST")
    sandbox_test = exact["sandbox_test"]
    if sandbox_test is not None:
        sandbox_test = _require_exact_keys(sandbox_test, SANDBOX_TEST_FIELDS, "SANDBOX_TEST")
        case = _require_str(sandbox_test["case"], "SANDBOX_CASE", minimum=1, maximum=32)
        if case not in {"head_drift", "post_push_stop"}:
            raise GuardianReject("REJECTED_SANDBOX_CASE", "SANDBOX_TEST")
        drift_ref = sandbox_test["drift_ref"]
        drift_sha = sandbox_test["drift_sha1"]
        if drift_ref is not None:
            _require_str(drift_ref, "DRIFT_REF", minimum=1, maximum=256)
        if drift_sha is not None:
            _require_hex(drift_sha, HEX40, "DRIFT_SHA")
    target_class = classify_target(target_ref, policy)
    if target_class == "production":
        if sandbox_test is not None or expected_old != workflow_sha1:
            raise GuardianReject("REJECTED_PRODUCTION_BINDING", "REQUEST")
    else:
        if not all(path.startswith(policy.sandbox_test_path_prefix) for path in paths):
            raise GuardianReject("REJECTED_SANDBOX_PATH", "REQUEST")
        if sandbox_test is not None and not policy.sandbox_fault_injection_enabled:
            raise GuardianReject("REJECTED_SANDBOX_FAULT_DISABLED", "REQUEST")
    return PublicationRequest(
        raw=exact,
        request_id=request_id,
        request_mode=request_mode,
        target_ref=target_ref,
        workflow_sha1=workflow_sha1,
        expected_old_sha1=expected_old,
        staging_ref=staging_ref,
        staging_head_sha1=staging_head,
        authority_name=authority_name,
        authority_sha256=authority_hash,
        commit_subject=subject,
        commit_timestamp_utc=commit["timestamp_utc"],
        expires_at_utc=exact["expires_at_utc"],
        files=tuple(entries),
        files_sha256=expected_files_hash,
        sandbox_test=sandbox_test,
        request_sha256=expected_request_hash,
    )


def classify_target(target_ref: str, policy: Policy) -> str:
    if target_ref == policy.default_ref:
        return "production"
    if target_ref.startswith(policy.sandbox_target_prefix) and SANDBOX_REF.fullmatch(target_ref):
        return "sandbox"
    raise GuardianReject("REJECTED_TARGET_REF", "TARGET")


def load_event(path: pathlib.Path) -> Mapping[str, Any]:
    raw = path.read_bytes()
    if len(raw) > 2 * 1024 * 1024:
        raise GuardianReject("REJECTED_EVENT_TOO_LARGE", "EVENT")
    try:
        event = json.loads(raw.decode("utf-8", "strict"))
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise GuardianReject("REJECTED_EVENT_JSON", "EVENT") from exc
    if type(event) is not dict:
        raise GuardianReject("REJECTED_EVENT_TYPE", "EVENT")
    return event


def event_identity(event: Mapping[str, Any], policy: Policy) -> dict[str, Any]:
    if event.get("action") != "opened":
        raise GuardianReject("REJECTED_EVENT_ACTION", "EVENT")
    repository = event.get("repository")
    issue = event.get("issue")
    sender = event.get("sender")
    if type(repository) is not dict or type(issue) is not dict or type(sender) is not dict:
        raise GuardianReject("REJECTED_EVENT_SHAPE", "EVENT")
    if repository.get("id") != policy.repository_id or repository.get("full_name") != policy.repository:
        raise GuardianReject("REJECTED_EVENT_REPOSITORY", "EVENT")
    title = issue.get("title")
    if type(title) is not str or not title.startswith(TITLE_PREFIX):
        raise GuardianReject("REJECTED_ISSUE_TITLE", "EVENT")
    issue_user = issue.get("user")
    if type(issue_user) is not dict:
        raise GuardianReject("REJECTED_ISSUE_USER", "EVENT")
    identity = {
        "sender_id": sender.get("id"),
        "sender_login": sender.get("login"),
        "sender_type": sender.get("type"),
        "issue_user_id": issue_user.get("id"),
        "issue_user_login": issue_user.get("login"),
        "issue_user_type": issue_user.get("type"),
    }
    for key in ("sender_id", "issue_user_id"):
        _require_int(identity[key], f"EVENT_{key.upper()}", minimum=1)
    for key in ("sender_login", "sender_type", "issue_user_login", "issue_user_type"):
        _require_str(identity[key], f"EVENT_{key.upper()}", minimum=1, maximum=128)
    return identity


def validate_actor(identity: Mapping[str, Any], policy: Policy) -> None:
    sender = (
        identity["sender_id"],
        identity["sender_login"],
        identity["sender_type"],
    )
    issue_user = (
        identity["issue_user_id"],
        identity["issue_user_login"],
        identity["issue_user_type"],
    )
    if sender != issue_user or sender not in policy.actor_allowlist:
        raise GuardianReject("REJECTED_ACTOR", "ACTOR")


def _git_env() -> dict[str, str]:
    env = dict(os.environ)
    env.update(
        {
            "GIT_CONFIG_NOSYSTEM": "1",
            "GIT_CONFIG_GLOBAL": os.devnull,
            "GIT_TERMINAL_PROMPT": "0",
            "GIT_NO_REPLACE_OBJECTS": "1",
            "GIT_OPTIONAL_LOCKS": "0",
            "LC_ALL": "C.UTF-8",
        }
    )
    return env


def git(
    args: Sequence[str],
    *,
    input_bytes: bytes | None = None,
    timeout: int = 120,
    failure_code: str = "GIT_COMMAND_FAILED",
    failure_stage: str | None = None,
    write_attempted: bool = False,
) -> bytes:
    command = [
        "git",
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "fetch.fsckObjects=true",
        "-c",
        "transfer.fsckObjects=true",
        *args,
    ]
    try:
        result = subprocess.run(
            command,
            input=input_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
            shell=False,
            timeout=timeout,
            env=_git_env(),
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            failure_stage or "GIT_EXEC",
            type(exc).__name__,
            write_attempted=write_attempted,
            result_uncertain=write_attempted,
        ) from exc
    if result.returncode:
        raise GuardianReject(
            failure_code,
            failure_stage or "GIT",
            f"exit={result.returncode}",
            write_attempted=write_attempted,
            result_uncertain=write_attempted,
        )
    return result.stdout


def verify_trusted_checkout(workflow_sha1: str) -> None:
    if not HEX40.fullmatch(workflow_sha1):
        raise GuardianReject("REJECTED_WORKFLOW_SHA", "TRUSTED_CHECKOUT")
    head = git(["rev-parse", "HEAD"]).decode("ascii").strip()
    if head != workflow_sha1:
        raise GuardianReject("REJECTED_TRUSTED_CHECKOUT", "TRUSTED_CHECKOUT")
    object_format = git(["rev-parse", "--show-object-format"]).decode("ascii").strip()
    if object_format != "sha1":
        raise GuardianReject("REJECTED_OBJECT_FORMAT", "TRUSTED_CHECKOUT")


def remote_ref_sha(
    ref: str,
    *,
    failure_stage: str | None = None,
) -> str | None:
    output = git(
        ["ls-remote", "--refs", "origin", ref],
        failure_code="RESULT_UNKNOWN_STOP",
        failure_stage=failure_stage,
    ).decode("ascii", "strict")
    lines = [line for line in output.splitlines() if line]
    if not lines:
        return None
    if len(lines) != 1:
        raise GuardianReject("RESULT_UNKNOWN_STOP", "REMOTE_REF")
    sha, observed_ref = lines[0].split("\t", 1)
    if observed_ref != ref or not HEX40.fullmatch(sha):
        raise GuardianReject("RESULT_UNKNOWN_STOP", "REMOTE_REF")
    return sha


def observe_production_main(policy: Policy) -> str:
    try:
        observed = remote_ref_sha(policy.default_ref)
    except GuardianReject as exc:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "PRODUCTION_MAIN_OBSERVATION",
        ) from exc
    if observed is None:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "PRODUCTION_MAIN_OBSERVATION",
        )
    return observed


def observe_unchanged_target(target_ref: str, observed_before: str) -> str:
    try:
        observed_after = remote_ref_sha(target_ref)
    except GuardianReject as exc:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "TARGET_OBSERVATION",
        ) from exc
    if observed_after is None or observed_after != observed_before:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "TARGET_OBSERVATION",
        )
    return observed_after


def _fetch_exact(
    ref: str,
    namespace: str,
    *,
    fetch_failure_stage: str | None = None,
) -> str:
    local_ref = f"refs/cocolon-guardian/{namespace}"
    git(
        ["fetch", "--no-tags", "--force", "--depth=128", "origin", f"{ref}:{local_ref}"],
        failure_code="RESULT_UNKNOWN_STOP",
        failure_stage=fetch_failure_stage,
    )
    return git(["rev-parse", local_ref]).decode("ascii").strip()


def _parse_raw_diff(raw: bytes) -> list[tuple[str, str, str, str, str, str]]:
    if not raw.endswith(b"\0"):
        raise GuardianReject("REJECTED_GIT_DIFF_FORMAT", "CANDIDATE")
    chunks = raw.split(b"\0")
    if chunks and chunks[-1] == b"":
        chunks.pop()
    if len(chunks) % 2:
        raise GuardianReject("REJECTED_GIT_DIFF_FORMAT", "CANDIDATE")
    result: list[tuple[str, str, str, str, str, str]] = []
    for index in range(0, len(chunks), 2):
        try:
            header = chunks[index].decode("ascii", "strict")
            path = chunks[index + 1].decode("utf-8", "strict")
        except UnicodeError as exc:
            raise GuardianReject("REJECTED_GIT_DIFF_ENCODING", "CANDIDATE") from exc
        fields = header.split(" ")
        if len(fields) != 5 or not fields[0].startswith(":"):
            raise GuardianReject("REJECTED_GIT_DIFF_FORMAT", "CANDIDATE")
        old_mode = fields[0][1:]
        new_mode, old_sha, new_sha, status = fields[1:]
        if status not in {"A", "M"}:
            raise GuardianReject("REJECTED_OPERATION", "CANDIDATE")
        if (
            not re.fullmatch(r"[0-9]{6}", old_mode)
            or not re.fullmatch(r"[0-9]{6}", new_mode)
            or not HEX40.fullmatch(old_sha)
            or not HEX40.fullmatch(new_sha)
        ):
            raise GuardianReject("REJECTED_GIT_DIFF_FORMAT", "CANDIDATE")
        if status == "A":
            if old_mode != "000000" or old_sha != "0" * 40 or new_mode != "100644":
                raise GuardianReject("REJECTED_ADD_CONTRACT", "CANDIDATE")
        elif old_mode not in {"100644", "100755"} or new_mode != old_mode:
            raise GuardianReject("REJECTED_MODE_CHANGE", "CANDIDATE")
        result.append((path, status, old_mode, new_mode, old_sha, new_sha))
    return result


def _tree_path_map(commit_sha1: str) -> dict[str, tuple[str, str, str]]:
    raw = git(["ls-tree", "-rz", "-r", "--full-tree", commit_sha1])
    chunks = raw.split(b"\0")
    if chunks and chunks[-1] == b"":
        chunks.pop()
    result: dict[str, tuple[str, str, str]] = {}
    for chunk in chunks:
        try:
            metadata, path_raw = chunk.split(b"\t", 1)
            mode_raw, type_raw, sha_raw = metadata.split(b" ", 2)
            mode = mode_raw.decode("ascii", "strict")
            object_type = type_raw.decode("ascii", "strict")
            sha = sha_raw.decode("ascii", "strict")
            path = path_raw.decode("utf-8", "strict")
        except (ValueError, UnicodeError) as exc:
            raise GuardianReject("REJECTED_TREE_FORMAT", "CANDIDATE") from exc
        validate_path(path)
        if path in result or not re.fullmatch(r"[0-9]{6}", mode) or not HEX40.fullmatch(sha):
            raise GuardianReject("REJECTED_TREE_FORMAT", "CANDIDATE")
        result[path] = (mode, object_type, sha)
    _validate_collision_free(result)
    return result


def inspect_candidate(request: PublicationRequest, policy: Policy) -> CandidateProof:
    staging_remote = remote_ref_sha(
        request.staging_ref,
        failure_stage="CANDIDATE_STAGING_REF_OBSERVATION",
    )
    if staging_remote != request.staging_head_sha1:
        raise GuardianReject("REJECTED_STAGING_REF_DRIFT", "CANDIDATE")
    staging_head = _fetch_exact(
        request.staging_ref,
        f"staging-{request.request_sha256}",
        fetch_failure_stage="CANDIDATE_STAGING_REF_FETCH",
    )
    if staging_head != request.staging_head_sha1:
        raise GuardianReject("REJECTED_STAGING_FETCH", "CANDIDATE")
    # Fetch the target object as an exact object/ref before lineage inspection.
    target_remote = remote_ref_sha(
        request.target_ref,
        failure_stage="CANDIDATE_TARGET_REF_OBSERVATION",
    )
    if target_remote is None:
        raise GuardianReject("REJECTED_TARGET_MISSING", "CANDIDATE")
    _fetch_exact(
        request.target_ref,
        f"target-{request.request_sha256}",
        fetch_failure_stage="CANDIDATE_TARGET_REF_FETCH",
    )
    base_type = git(["cat-file", "-t", request.expected_old_sha1]).decode("ascii").strip()
    head_type = git(["cat-file", "-t", staging_head]).decode("ascii").strip()
    if base_type != "commit" or head_type != "commit":
        raise GuardianReject("REJECTED_OBJECT_TYPE", "CANDIDATE")
    ancestry = git(
        ["rev-list", "--reverse", "--ancestry-path", f"{request.expected_old_sha1}..{staging_head}"]
    ).decode("ascii").splitlines()
    if not ancestry or len(ancestry) > policy.maximum_staging_commits:
        raise GuardianReject("REJECTED_LINEAGE_LENGTH", "CANDIDATE")
    previous = request.expected_old_sha1
    manifest_paths = {entry.path for entry in request.files}
    for commit_sha in ancestry:
        parents = git(["show", "-s", "--format=%P", commit_sha]).decode("ascii").strip().split()
        if parents != [previous]:
            raise GuardianReject("REJECTED_NON_LINEAR_LINEAGE", "CANDIDATE")
        intermediate = _parse_raw_diff(
            git(
                [
                    "diff-tree",
                    "--no-commit-id",
                    "-r",
                    "--raw",
                    "-z",
                    "--no-renames",
                    previous,
                    commit_sha,
                ]
            )
        )
        for path, _status, _old_mode, _new_mode, _old_sha, _new_sha in intermediate:
            validate_path(path)
            if is_locked_path(path, policy):
                raise GuardianReject("REJECTED_INTERMEDIATE_LOCKED_PATH", "CANDIDATE")
            if path not in manifest_paths:
                raise GuardianReject("REJECTED_INTERMEDIATE_MANIFEST_PATH", "CANDIDATE")
        previous = commit_sha
    if previous != staging_head:
        raise GuardianReject("REJECTED_LINEAGE_GAP", "CANDIDATE")
    base_tree = _tree_path_map(request.expected_old_sha1)
    final_tree = _tree_path_map(staging_head)
    for entry in request.files:
        if entry.operation == "add" and entry.path in base_tree:
            raise GuardianReject("REJECTED_ADD_EXISTING_PATH", "CANDIDATE")
        if entry.operation == "modify" and entry.path not in base_tree:
            raise GuardianReject("REJECTED_MODIFY_MISSING_PATH", "CANDIDATE")
    if set(final_tree) != (
        set(base_tree) | {entry.path for entry in request.files if entry.operation == "add"}
    ):
        raise GuardianReject("REJECTED_FINAL_TREE_PATH_SET", "CANDIDATE")
    diff = _parse_raw_diff(
        git(["diff-tree", "-r", "--raw", "-z", "--no-renames", request.expected_old_sha1, staging_head])
    )
    if [item[0] for item in diff] != [entry.path for entry in request.files]:
        raise GuardianReject("REJECTED_MANIFEST_PATH_SET", "CANDIDATE")
    for observed, expected in zip(diff, request.files, strict=True):
        path, status, old_mode, new_mode, old_sha, new_sha = observed
        operation = "add" if status == "A" else "modify"
        normalized_old_mode = None if status == "A" else old_mode
        normalized_old_sha = None if status == "A" else old_sha
        if (
            path != expected.path
            or operation != expected.operation
            or normalized_old_mode != expected.old_mode
            or new_mode != expected.new_mode
            or normalized_old_sha != expected.old_blob_sha1
            or new_sha != expected.new_blob_sha1
        ):
            raise GuardianReject("REJECTED_MANIFEST_METADATA", "CANDIDATE")
        if new_mode not in {"100644", "100755"} or (status == "A" and new_mode != "100644"):
            raise GuardianReject("REJECTED_MODE", "CANDIDATE")
        raw = git(["cat-file", "blob", new_sha])
        if (
            len(raw) != expected.size_bytes
            or sha256_hex(raw) != expected.raw_sha256
            or git_blob_sha1(raw) != new_sha
        ):
            raise GuardianReject("REJECTED_BLOB_PROOF", "CANDIDATE")
    tree = git(["rev-parse", f"{staging_head}^{{tree}}"]).decode("ascii").strip()
    candidate = build_direct_child(request, policy, tree)
    proof = CandidateProof(candidate, tree, request.expected_old_sha1, request.files)
    verify_commit(proof, request)
    return proof


def commit_payload(request: PublicationRequest, policy: Policy, tree_sha1: str) -> bytes:
    timestamp = _parse_utc(request.commit_timestamp_utc, "COMMIT_TIME")
    epoch = int(timestamp.timestamp())
    message = (
        f"{request.commit_subject}\n\n"
        f"Cocolon-Guardian-Request-ID: {request.request_id}\n"
        f"Cocolon-Guardian-Authority-SHA256: {request.authority_sha256}\n"
        f"Cocolon-Guardian-Files-SHA256: {request.files_sha256}\n"
        f"Cocolon-Guardian-Request-SHA256: {request.request_sha256}\n"
    )
    return (
        f"tree {tree_sha1}\n"
        f"parent {request.expected_old_sha1}\n"
        f"author {policy.author_name} <{policy.author_email}> {epoch} +0000\n"
        f"committer {policy.author_name} <{policy.author_email}> {epoch} +0000\n"
        "\n"
        f"{message}"
    ).encode("utf-8")


def build_direct_child(request: PublicationRequest, policy: Policy, tree_sha1: str) -> str:
    payload = commit_payload(request, policy, tree_sha1)
    header = b"commit " + str(len(payload)).encode("ascii") + b"\0"
    expected = hashlib.sha1(header + payload, usedforsecurity=False).hexdigest()
    actual = git(["hash-object", "-t", "commit", "-w", "--stdin"], input_bytes=payload).decode("ascii").strip()
    if actual != expected or git(["cat-file", "commit", actual]) != payload:
        raise GuardianReject("REJECTED_COMMIT_REPRODUCIBILITY", "CANDIDATE")
    return actual


def build_sandbox_drift_fixture(
    request: PublicationRequest,
    policy: Policy,
    tree_sha1: str,
) -> str:
    timestamp = _parse_utc(request.commit_timestamp_utc, "COMMIT_TIME")
    epoch = int(timestamp.timestamp())
    message = (
        "test: cocolon guardian sandbox head drift fixture\n\n"
        f"Cocolon-Guardian-Sandbox-Request-ID: {request.request_id}\n"
    )
    payload = (
        f"tree {tree_sha1}\n"
        f"parent {request.expected_old_sha1}\n"
        f"author {policy.author_name} <{policy.author_email}> {epoch} +0000\n"
        f"committer {policy.author_name} <{policy.author_email}> {epoch} +0000\n"
        "\n"
        f"{message}"
    ).encode("utf-8")
    header = b"commit " + str(len(payload)).encode("ascii") + b"\0"
    expected = hashlib.sha1(header + payload, usedforsecurity=False).hexdigest()
    actual = git(["hash-object", "-t", "commit", "-w", "--stdin"], input_bytes=payload).decode(
        "ascii"
    ).strip()
    if actual != expected or git(["cat-file", "commit", actual]) != payload:
        raise GuardianReject("REJECTED_DRIFT_FIXTURE", "FAULT_INJECTION")
    return actual


def advance_sandbox_head_drift_fixture(
    request: PublicationRequest,
    policy: Policy,
) -> str:
    if (
        classify_target(request.target_ref, policy) != "sandbox"
        or policy.sandbox_fault_injection_enabled is not True
        or request.sandbox_test is None
        or request.sandbox_test["case"] != "head_drift"
        or request.sandbox_test["drift_ref"] != request.target_ref
    ):
        raise GuardianReject("REJECTED_DRIFT_FIXTURE", "FAULT_INJECTION")
    base_tree = git(["rev-parse", f"{request.expected_old_sha1}^{{tree}}"]).decode(
        "ascii"
    ).strip()
    fixture_sha1 = build_sandbox_drift_fixture(request, policy, base_tree)
    if request.sandbox_test["drift_sha1"] != fixture_sha1:
        raise GuardianReject("REJECTED_DRIFT_FIXTURE_HASH", "FAULT_INJECTION")
    if remote_ref_sha(request.target_ref) != request.expected_old_sha1:
        raise GuardianReject("REJECTED_HEAD_DRIFT", "FAULT_INJECTION")
    git(
        [
            "push",
            "origin",
            f"--force-with-lease={request.target_ref}:{request.expected_old_sha1}",
            f"{fixture_sha1}:{request.target_ref}",
        ],
        failure_code="RESULT_UNKNOWN_STOP",
        write_attempted=True,
    )
    if remote_ref_sha(request.target_ref) != fixture_sha1:
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "FAULT_INJECTION",
            write_attempted=True,
            result_uncertain=True,
        )
    return fixture_sha1


def verify_commit(proof: CandidateProof, request: PublicationRequest) -> None:
    parents = git(["show", "-s", "--format=%P", proof.candidate_sha1]).decode("ascii").strip().split()
    tree = git(["rev-parse", f"{proof.candidate_sha1}^{{tree}}"]).decode("ascii").strip()
    if parents != [request.expected_old_sha1] or tree != proof.tree_sha1:
        raise GuardianReject("REJECTED_DIRECT_CHILD", "CANDIDATE")
    observed = _parse_raw_diff(
        git(["diff-tree", "-r", "--raw", "-z", "--no-renames", request.expected_old_sha1, proof.candidate_sha1])
    )
    if [x[0] for x in observed] != [x.path for x in request.files]:
        raise GuardianReject("REJECTED_DIRECT_CHILD_DIFF", "CANDIDATE")


def make_write_permit(
    request: PublicationRequest,
    policy: Policy,
    proof: CandidateProof,
    *,
    expected_target_class: str | None = None,
) -> WritePermit:
    target_class = classify_target(request.target_ref, policy)
    if expected_target_class is not None and target_class != expected_target_class:
        raise GuardianReject("REJECTED_JOB_TARGET_CLASS", "WRITE_PERMIT")
    if request.request_mode != "publish":
        raise GuardianReject("RECONCILE_NEVER_WRITES", "WRITE_PERMIT")
    if target_class == "production":
        if policy.mode != "PRODUCTION_ACTIVE" or policy.production_main_enabled is not True:
            raise GuardianReject("PRODUCTION_DISABLED", "WRITE_PERMIT")
    elif (
        policy.mode != "OBSERVE_AND_SANDBOX_ONLY"
        or policy.sandbox_write_enabled is not True
    ):
        raise GuardianReject("SANDBOX_DISABLED", "WRITE_PERMIT")
    return WritePermit(
        request.target_ref,
        request.expected_old_sha1,
        proof.candidate_sha1,
        target_class,
        policy.sha256,
        request.request_sha256,
    )


def push_exact_lease(permit: WritePermit, policy: Policy) -> None:
    # Recheck policy immediately before constructing the only permitted write.
    if permit.target_class == "production":
        if (
            permit.target_ref != policy.default_ref
            or policy.mode != "PRODUCTION_ACTIVE"
            or policy.production_main_enabled is not True
        ):
            raise GuardianReject("PRODUCTION_DISABLED", "PUSH")
    else:
        if (
            not permit.target_ref.startswith(policy.sandbox_target_prefix)
            or policy.mode != "OBSERVE_AND_SANDBOX_ONLY"
            or policy.sandbox_write_enabled is not True
        ):
            raise GuardianReject("SANDBOX_DISABLED", "PUSH")
    git(
        [
            "push",
            "origin",
            f"--force-with-lease={permit.target_ref}:{permit.expected_old_sha1}",
            f"{permit.candidate_sha1}:{permit.target_ref}",
        ],
        failure_code="RESULT_UNKNOWN_STOP",
        write_attempted=True,
    )


def postverify(request: PublicationRequest, proof: CandidateProof) -> None:
    observed_before_fetch = remote_ref_sha(request.target_ref)
    if observed_before_fetch != proof.candidate_sha1:
        raise GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY")
    fetched = _fetch_exact(request.target_ref, f"postverify-{request.request_sha256}")
    if fetched != proof.candidate_sha1:
        raise GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY")
    verify_commit(proof, request)
    final_tree = _tree_path_map(proof.candidate_sha1)
    for entry in request.files:
        observed = final_tree.get(entry.path)
        if observed != (entry.new_mode, "blob", entry.new_blob_sha1):
            raise GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY")
        raw = git(["cat-file", "blob", entry.new_blob_sha1])
        if len(raw) != entry.size_bytes or sha256_hex(raw) != entry.raw_sha256:
            raise GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY")
    observed_after_fetch = remote_ref_sha(request.target_ref)
    if observed_after_fetch != proof.candidate_sha1:
        raise GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY")


def postverify_after_write(request: PublicationRequest, proof: CandidateProof) -> None:
    try:
        postverify(request, proof)
    except GuardianReject as exc:
        raise GuardianReject(
            exc.code,
            exc.stage,
            write_attempted=True,
            result_uncertain=True,
        ) from exc


def evaluate_request(
    event: Mapping[str, Any],
    policy: Policy,
    *,
    execution_mode: str,
    expected_target_class: str | None = None,
) -> dict[str, Any]:
    identity = event_identity(event, policy)
    if not policy.actor_allowlist or policy.mode == "OBSERVE_ONLY":
        workflow_sha = os.environ.get("GITHUB_SHA", "")
        verify_trusted_checkout(workflow_sha)
        return {
            "outcome": "OBSERVE_ONLY_ACTOR_CAPTURE",
            "stage": "ACTOR_OBSERVATION",
            "workflow_sha1": workflow_sha,
            "policy_sha256": policy.sha256,
            "design_sha256": policy.design_sha256,
            "postverified": False,
            "write_attempted": False,
            **identity,
        }
    validate_actor(identity, policy)
    issue = event["issue"]
    request = parse_request_body(
        issue.get("body"),
        policy,
        issue_created_at=issue.get("created_at"),
    )
    expected_title = f"{TITLE_PREFIX}{request.request_id}"
    if issue.get("title") != expected_title:
        raise GuardianReject("REJECTED_ISSUE_TITLE", "EVENT")
    workflow_sha = os.environ.get("GITHUB_SHA", "")
    if request.workflow_sha1 != workflow_sha:
        raise GuardianReject("REJECTED_WORKFLOW_BINDING", "EVENT")
    verify_trusted_checkout(workflow_sha)
    proof = inspect_candidate(request, policy)
    observed_before = remote_ref_sha(request.target_ref)
    base = {
        "request_id": request.request_id,
        "repository": policy.repository,
        "target_ref": request.target_ref,
        "workflow_sha1": request.workflow_sha1,
        "expected_old_sha1": request.expected_old_sha1,
        "candidate_sha1": proof.candidate_sha1,
        "files_sha256": request.files_sha256,
        "request_sha256": request.request_sha256,
        "policy_sha256": policy.sha256,
        "design_sha256": policy.design_sha256,
        "target_class": classify_target(request.target_ref, policy),
        "paths": [
            {"path": x.path, "raw_sha256": x.raw_sha256, "blob_sha1": x.new_blob_sha1}
            for x in request.files
        ],
        "observed_before": observed_before,
        "write_attempted": False,
        "postverified": False,
    }
    if execution_mode == "reconcile":
        base["write_attempted"] = "unknown"
    if observed_before == proof.candidate_sha1:
        postverify(request, proof)
        outcome = (
            "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT"
            if execution_mode == "reconcile"
            else "ALREADY_APPLIED_POSTVERIFIED"
        )
        return {
            **base,
            "outcome": outcome,
            "observed_after": proof.candidate_sha1,
            "postverified": True,
        }
    if execution_mode == "reconcile" or request.request_mode == "reconcile":
        observed_after = observe_unchanged_target(
            request.target_ref,
            observed_before,
        )
        if observed_before == request.expected_old_sha1:
            return {
                **base,
                "outcome": "NOT_APPLIED_CONFIRMED_STOP",
                "observed_after": observed_after,
            }
        return {
            **base,
            "outcome": "DRIFT_AFTER_ATTEMPT_STOP",
            "observed_after": observed_after,
        }
    if observed_before != request.expected_old_sha1:
        observed_after = observe_unchanged_target(
            request.target_ref,
            observed_before,
        )
        return {
            **base,
            "outcome": "REJECTED_HEAD_DRIFT",
            "observed_after": observed_after,
        }
    if _parse_utc(request.expires_at_utc, "EXPIRY") <= dt.datetime.now(dt.timezone.utc):
        raise GuardianReject("REJECTED_EXPIRED_REQUEST", "WRITE_PERMIT")
    if execution_mode == "preflight":
        make_write_permit(
            request,
            policy,
            proof,
            expected_target_class=expected_target_class,
        )
        return {**base, "outcome": "PREFLIGHT_PASSED"}
    if execution_mode != "publish":
        raise GuardianReject("REJECTED_EXECUTION_MODE", "STATE")
    permit = make_write_permit(
        request,
        policy,
        proof,
        expected_target_class=expected_target_class,
    )
    result = dict(base)
    # A fault case is reachable only in a trusted sandbox-enabled maintenance revision.
    if request.sandbox_test and request.sandbox_test["case"] == "head_drift":
        fixture_sha1 = advance_sandbox_head_drift_fixture(request, policy)
        result["write_attempted"] = True
        try:
            push_exact_lease(permit, policy)
        except GuardianReject:
            observed_after = remote_ref_sha(request.target_ref)
            if observed_after == fixture_sha1:
                result.update(
                    {
                        "outcome": "REJECTED_HEAD_DRIFT",
                        "observed_after": observed_after,
                        "postverified": False,
                    }
                )
                return result
            raise GuardianReject(
                "RESULT_UNKNOWN_STOP",
                "FAULT_INJECTION",
                write_attempted=True,
                result_uncertain=True,
            )
        raise GuardianReject(
            "SANDBOX_STALE_LEASE_UNEXPECTEDLY_ACCEPTED",
            "FAULT_INJECTION",
            write_attempted=True,
            result_uncertain=True,
        )
    result["write_attempted"] = True
    push_exact_lease(permit, policy)
    if request.sandbox_test and request.sandbox_test["case"] == "post_push_stop":
        raise GuardianReject(
            "RESULT_UNKNOWN_STOP",
            "INTENTIONAL_POST_PUSH_STOP",
            write_attempted=True,
            result_uncertain=True,
        )
    postverify_after_write(request, proof)
    result.update(
        {
            "outcome": "APPLIED_AND_POSTVERIFIED",
            "observed_after": proof.candidate_sha1,
            "postverified": True,
        }
    )
    return result


def sanitized_failure(exc: GuardianReject) -> dict[str, Any]:
    return {
        "outcome": exc.code,
        "stage": exc.stage,
        "write_attempted": exc.write_attempted,
        "result_uncertain": exc.result_uncertain,
        "postverified": False,
    }


def run_guardian(
    event_path: pathlib.Path,
    policy_path: pathlib.Path,
    command: str,
    *,
    expected_target_class: str | None = None,
) -> dict[str, Any]:
    policy = load_policy(policy_path)
    event = load_event(event_path)
    return evaluate_request(
        event,
        policy,
        execution_mode=command,
        expected_target_class=expected_target_class,
    )


def _github_api(method: str, url: str, token: str, payload: Mapping[str, Any]) -> None:
    raw = canonical_json_bytes(payload)
    request = urllib.request.Request(
        url,
        data=raw,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status < 200 or response.status >= 300:
                raise GuardianReject("REPORT_FAILED", "REPORT_API")
    except (urllib.error.URLError, TimeoutError) as exc:
        raise GuardianReject("REPORT_FAILED", "REPORT_API", type(exc).__name__) from exc


def fixed_receipt(result: Mapping[str, Any]) -> str:
    allowed = [
        "outcome",
        "stage",
        "request_id",
        "repository",
        "target_ref",
        "workflow_sha1",
        "expected_old_sha1",
        "candidate_sha1",
        "observed_before",
        "observed_after",
        "production_main_observed_before",
        "production_main_observed_after",
        "files_sha256",
        "request_sha256",
        "policy_sha256",
        "design_sha256",
        "target_class",
        "paths",
        "write_attempted",
        "result_uncertain",
        "postverified",
        "sender_id",
        "sender_login",
        "sender_type",
        "issue_user_id",
        "issue_user_login",
        "issue_user_type",
    ]
    receipt = {key: result[key] for key in allowed if key in result}
    if type(result.get("paths")) is list:
        receipt["path_count"] = len(result["paths"])
    receipt.update(
        {
            "run_id": os.environ.get("GITHUB_RUN_ID", ""),
            "run_attempt": os.environ.get("GITHUB_RUN_ATTEMPT", ""),
            "run_url": (
                f"{os.environ.get('GITHUB_SERVER_URL', 'https://github.com')}/"
                f"{os.environ.get('GITHUB_REPOSITORY', '')}/actions/runs/"
                f"{os.environ.get('GITHUB_RUN_ID', '')}"
            ),
        }
    )
    marker = (
        f"<!-- cocolon-guardian:{receipt.get('run_id', '')}:"
        f"{receipt.get('run_attempt', '')}:{receipt.get('outcome', '')} -->"
    )
    rendered = (
        marker
        + "\nCocolon publication guardian receipt\n\n```json\n"
        + canonical_json_bytes(receipt).decode("utf-8")
        + "\n```"
    )
    if len(rendered.encode("utf-8")) > 60000:
        raise GuardianReject("REPORT_FAILED", "REPORT_SIZE")
    return rendered


def report_result(event: Mapping[str, Any], result: Mapping[str, Any]) -> None:
    token = os.environ.get("GH_TOKEN", "")
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    issue = event.get("issue")
    if not token or not repository or type(issue) is not dict or type(issue.get("number")) is not int:
        raise GuardianReject("REPORT_FAILED", "REPORT_CONTEXT")
    number = issue["number"]
    base = f"https://api.github.com/repos/{repository}/issues/{number}"
    _github_api("POST", f"{base}/comments", token, {"body": fixed_receipt(result)})
    outcome = result.get("outcome")
    resolved = (
        outcome
        in {
            "OBSERVE_ONLY_ACTOR_CAPTURE",
            "APPLIED_AND_POSTVERIFIED",
            "ALREADY_APPLIED_POSTVERIFIED",
            "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
            "NOT_APPLIED_CONFIRMED_STOP",
            "DRIFT_AFTER_ATTEMPT_STOP",
            "REJECTED_HEAD_DRIFT",
        }
        or (type(outcome) is str and outcome.startswith("REJECTED_"))
        or outcome in {"PRODUCTION_DISABLED", "SANDBOX_DISABLED", "RECONCILE_NEVER_WRITES"}
    )
    if resolved:
        _github_api("PATCH", base, token, {"state": "closed", "state_reason": "completed"})


def _write_outputs(result: Mapping[str, Any]) -> None:
    rendered = canonical_json_bytes(result).decode("utf-8")
    print(rendered)
    output_path = os.environ.get("GITHUB_OUTPUT")
    if output_path:
        safe = {
            "outcome": result.get("outcome", "RESULT_UNKNOWN_STOP"),
            "postverified": "true" if result.get("postverified") else "false",
            "target_class": result.get("target_class", ""),
            "write_attempted": (
                "true"
                if result.get("write_attempted") is True
                else "false"
                if result.get("write_attempted") is False
                else "unknown"
            ),
            "request_sha256": result.get("request_sha256", ""),
            "candidate_sha1": result.get("candidate_sha1", ""),
            "observed_before": result.get("observed_before", ""),
            "observed_after": result.get("observed_after", ""),
            "production_main_observed_before": result.get(
                "production_main_observed_before", ""
            ),
            "production_main_observed_after": result.get(
                "production_main_observed_after", ""
            ),
        }
        with open(output_path, "a", encoding="utf-8", newline="\n") as handle:
            for key, value in safe.items():
                handle.write(f"{key}={value}\n")


def _job_claim(prefix: str) -> dict[str, str]:
    return {
        "job_result": os.environ.get(f"{prefix}_JOB_RESULT", ""),
        "outcome": os.environ.get(f"{prefix}_OUTCOME", ""),
        "request_sha256": os.environ.get(f"{prefix}_REQUEST_SHA256", ""),
        "candidate_sha1": os.environ.get(f"{prefix}_CANDIDATE_SHA1", ""),
        "write_attempted": os.environ.get(f"{prefix}_WRITE_ATTEMPTED", ""),
        "postverified": os.environ.get(f"{prefix}_POSTVERIFIED", ""),
        "observed_before": os.environ.get(f"{prefix}_OBSERVED_BEFORE", ""),
        "observed_after": os.environ.get(f"{prefix}_OBSERVED_AFTER", ""),
    }


def bind_trusted_publish_result(reconciled: Mapping[str, Any]) -> dict[str, Any]:
    """Preserve a trusted job outcome only after remote-first reconciliation."""

    result = dict(reconciled)
    target_class = result.get("target_class")
    if target_class not in {"sandbox", "production"}:
        return result
    reconciled_outcome = result.get("outcome")
    publish_prefix = (
        "GUARDIAN_SANDBOX" if target_class == "sandbox" else "GUARDIAN_MAIN"
    )
    for source, claimed in (
        ("publish", _job_claim(publish_prefix)),
        ("preflight", _job_claim("GUARDIAN_PREFLIGHT")),
    ):
        if (
            claimed["job_result"] != "success"
            or claimed["request_sha256"] != result.get("request_sha256")
            or claimed["candidate_sha1"] != result.get("candidate_sha1")
        ):
            continue
        observed_before = claimed["observed_before"]
        observed_after = claimed["observed_after"]
        if not HEX40.fullmatch(observed_before) or not HEX40.fullmatch(observed_after):
            continue
        if (
            source == "publish"
            and reconciled_outcome == "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT"
            and claimed["outcome"] == "APPLIED_AND_POSTVERIFIED"
            and claimed["write_attempted"] == "true"
            and claimed["postverified"] == "true"
            and observed_before == result.get("expected_old_sha1")
            and observed_after == result.get("candidate_sha1")
            and result.get("observed_before") == result.get("candidate_sha1")
            and result.get("observed_after") == result.get("candidate_sha1")
            and result.get("write_attempted") == "unknown"
            and result.get("postverified") is True
        ):
            result.update(
                {
                    "outcome": "APPLIED_AND_POSTVERIFIED",
                    "write_attempted": True,
                    "postverified": True,
                    "observed_before": observed_before,
                    "observed_after": observed_after,
                }
            )
            return result
        if (
            reconciled_outcome == "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT"
            and claimed["outcome"] == "ALREADY_APPLIED_POSTVERIFIED"
            and claimed["write_attempted"] == "false"
            and claimed["postverified"] == "true"
            and observed_before == result.get("candidate_sha1")
            and observed_after == result.get("candidate_sha1")
            and result.get("observed_before") == result.get("candidate_sha1")
            and result.get("observed_after") == result.get("candidate_sha1")
            and result.get("write_attempted") == "unknown"
            and result.get("postverified") is True
        ):
            result.update(
                {
                    "outcome": "ALREADY_APPLIED_POSTVERIFIED",
                    "write_attempted": False,
                    "postverified": True,
                    "observed_before": observed_before,
                    "observed_after": observed_after,
                }
            )
            return result
        if (
            reconciled_outcome == "DRIFT_AFTER_ATTEMPT_STOP"
            and claimed["outcome"] == "REJECTED_HEAD_DRIFT"
            and (
                (
                    source == "publish"
                    and claimed["write_attempted"] in {"true", "false"}
                )
                or (
                    source == "preflight"
                    and claimed["write_attempted"] == "false"
                )
            )
            and claimed["postverified"] == "false"
            and result.get("observed_before") == result.get("observed_after")
            and result.get("observed_before") != result.get("expected_old_sha1")
            and result.get("observed_before") != result.get("candidate_sha1")
            and result.get("write_attempted") == "unknown"
            and result.get("postverified") is False
            and (
                (
                    claimed["write_attempted"] == "true"
                    and observed_before == result.get("expected_old_sha1")
                    and observed_after == result.get("observed_before")
                )
                or (
                    claimed["write_attempted"] == "false"
                    and observed_before == result.get("observed_before")
                    and observed_after == result.get("observed_before")
                )
            )
        ):
            result.update(
                {
                    "outcome": "REJECTED_HEAD_DRIFT",
                    "write_attempted": claimed["write_attempted"] == "true",
                    "postverified": False,
                    "observed_before": observed_before,
                    "observed_after": observed_after,
                }
            )
            return result
    return result


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("preflight", "publish", "reconcile", "report"))
    parser.add_argument(
        "--event-path",
        default=os.environ.get("GUARDIAN_EVENT_PATH") or os.environ.get("GITHUB_EVENT_PATH"),
    )
    parser.add_argument(
        "--policy-path",
        default=".github/cocolon_formal_publication_guard/policy_v1.json",
    )
    parser.add_argument(
        "--expected-target-class",
        choices=("sandbox", "production"),
        default=None,
    )
    args = parser.parse_args(argv)
    if not args.event_path:
        _write_outputs(sanitized_failure(GuardianReject("REJECTED_EVENT_PATH", "CLI")))
        return 1
    event_path = pathlib.Path(args.event_path)
    policy_path = pathlib.Path(args.policy_path)
    command = "reconcile" if args.command == "report" else args.command
    report_policy = None
    production_main_observed_before = None
    if args.command == "report":
        try:
            report_policy = load_policy(policy_path)
            production_main_observed_before = observe_production_main(
                report_policy
            )
        except GuardianReject as observation_exc:
            _write_outputs(sanitized_failure(observation_exc))
            return 1
    try:
        result = run_guardian(
            event_path,
            policy_path,
            command,
            expected_target_class=args.expected_target_class,
        )
    except GuardianReject as exc:
        result = sanitized_failure(exc)
        if command == "reconcile" and result["write_attempted"] is False:
            result["write_attempted"] = "unknown"

    if args.command == "report":
        try:
            if report_policy is None:
                raise GuardianReject(
                    "RESULT_UNKNOWN_STOP",
                    "PRODUCTION_MAIN_OBSERVATION",
                )
            production_main_observed_after = observe_production_main(
                report_policy
            )
        except GuardianReject as observation_exc:
            _write_outputs(sanitized_failure(observation_exc))
            return 1
        result.update(
            {
                "production_main_observed_before": (
                    production_main_observed_before
                ),
                "production_main_observed_after": (
                    production_main_observed_after
                ),
            }
        )
        result = bind_trusted_publish_result(result)
        try:
            report_result(load_event(event_path), result)
        except GuardianReject as report_exc:
            _write_outputs(sanitized_failure(report_exc))
            return 1
        _write_outputs(result)
        return 0 if result["outcome"] != "RESULT_UNKNOWN_STOP" else 1

    _write_outputs(result)
    outcome = result["outcome"]
    if args.command == "preflight":
        return 0 if outcome in {
            "PREFLIGHT_PASSED",
            "OBSERVE_ONLY_ACTOR_CAPTURE",
            "ALREADY_APPLIED_POSTVERIFIED",
            "REJECTED_HEAD_DRIFT",
        } else 1
    if args.command == "publish":
        return 0 if outcome in {
            "APPLIED_AND_POSTVERIFIED",
            "ALREADY_APPLIED_POSTVERIFIED",
            "REJECTED_HEAD_DRIFT",
        } else 1
    return 0 if outcome in {
        "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
        "NOT_APPLIED_CONFIRMED_STOP",
        "DRIFT_AFTER_ATTEMPT_STOP",
    } else 1


if __name__ == "__main__":
    raise SystemExit(main())
