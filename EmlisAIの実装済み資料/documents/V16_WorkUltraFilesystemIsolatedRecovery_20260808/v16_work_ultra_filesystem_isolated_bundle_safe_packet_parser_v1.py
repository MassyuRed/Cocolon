#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations

"""Parse one frozen V16 STOP bundle without emitting raw bundle or payload bytes.

The program intentionally writes no stdout or stderr. It emits only:
  1. one closed-schema body-free safe packet; and
  2. on PASS only, the exact decoded earlier-authority bytes to a separate 0600 file.

The caller must independently verify this script's frozen SHA-256 before execution,
run it in an isolated Work Ultra filesystem boundary, and redirect stdout/stderr to
empty files. The raw bundle path must never be opened through a model-readable tool.
"""

import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
from typing import Final, NoReturn

PARSER_SCHEMA: Final = "cocolon.v16.work_ultra.bundle_safe_packet_parser.v1"
SAFE_PACKET_SCHEMA: Final = "cocolon.v16.work_ultra.bundle_safe_packet.v1"

EXPECTED_BUNDLE_BYTES: Final = 129_363
EXPECTED_BUNDLE_SHA256: Final = (
    "8398dc837ed78a1183a5dbb4699737de366bb8650ef803748c810ec0b7fdfbff"
)
EXPECTED_BUNDLE_SCHEMA: Final = "v16_inspector_v2_bundle_refetch_stop_bundle_v1"
EXPECTED_BUNDLE_STATUS: Final = (
    "FROZEN_PUBLIC_SAFE_LOSSLESS_TERMINAL_EVIDENCE_NONCREDIT"
)
EXPECTED_SELECTED_BRANCH: Final = "SAFE_STOP_EXACT2"
EXPECTED_AUTHORITY_ID: Final = (
    "V16_INSPECTOR_V2_BUNDLE_REFETCH_FROZEN_REUSE_PUBLICATION_QA_"
    "PREEXEC_REVIEW_AUTHORITY_V1"
)
EXPECTED_AUTHORITY_SHA256: Final = (
    "f785c5784d31221bdc5f3cbeebc5657899ab02b9f8d9a97ccdef6f9a77682e30"
)
EXPECTED_AUTHORITY_BYTES: Final = 42_008
EXPECTED_AUTHORITY_LF: Final = 735
EXPECTED_AUTHORITY_CR: Final = 0
EXPECTED_AUTHORITY_FINAL_LF: Final = True
EXPECTED_AUTHORITY_GIT_BLOB: Final = "d30c422f735e3c2923b9b83a11a22769e85d5dbb"
EXPECTED_ARTIFACTS_CARDINALITY: Final = 2
EXPECTED_SELECTED_INDEX: Final = 0
EXPECTED_SELECTED_ROLE: Final = "approved_successor_authority"
EXPECTED_SEGMENT_COUNT: Final = 14
EXPECTED_SEGMENT_CHARS: Final = 4096
EXPECTED_CONTENT_ENCODING: Final = "base64_ascii_segments_concat_exact_order"

_ALLOWED_ERROR_CODES: Final = frozenset(
    {
        "ARGUMENT_CONTRACT_INVALID",
        "OUTPUT_PATH_PREEXISTS",
        "BUNDLE_FILE_UNREADABLE",
        "BUNDLE_FILE_IDENTITY_MISMATCH",
        "BUNDLE_UTF8_OR_JSON_INVALID",
        "BUNDLE_ROOT_OR_METADATA_MISMATCH",
        "AUTHORITY_LIFECYCLE_MISMATCH",
        "ARTIFACT_SELECTOR_MISMATCH",
        "SELECTED_ARTIFACT_METADATA_MISMATCH",
        "SEGMENT_SHAPE_MISMATCH",
        "BASE64_DECODE_FAILURE",
        "DECODED_AUTHORITY_IDENTITY_MISMATCH",
        "DECODED_AUTHORITY_WRITE_FAILURE",
        "SAFE_PACKET_WRITE_FAILURE",
        "UNEXPECTED_INTERNAL_FAILURE",
    }
)


class SafeStop(RuntimeError):
    def __init__(self, code: str) -> None:
        if code not in _ALLOWED_ERROR_CODES:
            code = "UNEXPECTED_INTERNAL_FAILURE"
        self.code = code
        super().__init__(code)


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _git_blob_sha1(data: bytes) -> str:
    header = b"blob " + str(len(data)).encode("ascii") + b"\0"
    return hashlib.sha1(header + data).hexdigest()  # noqa: S324 - Git object identity


def _canonical_json_bytes(value: dict[str, object]) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=True,
            sort_keys=True,
            separators=(",", ":"),
        ).encode("ascii")
        + b"\n"
    )


def _exclusive_write(path: Path, data: bytes, mode: int) -> None:
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    descriptor = os.open(path, flags, mode)
    try:
        with os.fdopen(descriptor, "wb", closefd=True) as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
    except Exception:
        try:
            path.unlink(missing_ok=True)
        except Exception:
            pass
        raise


def _error_packet(code: str) -> dict[str, object]:
    if code not in _ALLOWED_ERROR_CODES:
        code = "UNEXPECTED_INTERNAL_FAILURE"
    return {
        "schema": SAFE_PACKET_SCHEMA,
        "status": "STOP",
        "error_code": code,
        "bundle_sha256_match": False,
        "bundle_schema_match": False,
        "bundle_terminal_closed": False,
        "artifacts_cardinality": 0,
        "selected_index": -1,
        "selected_role_match": False,
        "selected_role_cardinality": 0,
        "selected_metadata_match": False,
        "segment_count": 0,
        "decoded_bytes": 0,
        "decoded_lf": 0,
        "decoded_cr": 0,
        "decoded_final_lf": False,
        "decoded_sha256": "0" * 64,
        "decoded_git_blob_match": False,
        "raw_bundle_model_output": False,
        "payload_semantic_exposure": False,
        "private_body_exposure": False,
    }


def _success_packet(decoded: bytes) -> dict[str, object]:
    return {
        "schema": SAFE_PACKET_SCHEMA,
        "status": "PASS",
        "error_code": None,
        "bundle_sha256_match": True,
        "bundle_schema_match": True,
        "bundle_terminal_closed": True,
        "artifacts_cardinality": EXPECTED_ARTIFACTS_CARDINALITY,
        "selected_index": EXPECTED_SELECTED_INDEX,
        "selected_role_match": True,
        "selected_role_cardinality": 1,
        "selected_metadata_match": True,
        "segment_count": EXPECTED_SEGMENT_COUNT,
        "decoded_bytes": len(decoded),
        "decoded_lf": decoded.count(b"\n"),
        "decoded_cr": decoded.count(b"\r"),
        "decoded_final_lf": decoded.endswith(b"\n"),
        "decoded_sha256": _sha256(decoded),
        "decoded_git_blob_match": _git_blob_sha1(decoded)
        == EXPECTED_AUTHORITY_GIT_BLOB,
        "raw_bundle_model_output": False,
        "payload_semantic_exposure": False,
        "private_body_exposure": False,
    }


def _require(condition: bool, code: str) -> None:
    if not condition:
        raise SafeStop(code)


def _parse_bundle(bundle_path: Path) -> tuple[dict[str, object], bytes]:
    try:
        raw = bundle_path.read_bytes()
    except Exception as exc:
        raise SafeStop("BUNDLE_FILE_UNREADABLE") from exc

    _require(
        len(raw) == EXPECTED_BUNDLE_BYTES
        and _sha256(raw) == EXPECTED_BUNDLE_SHA256,
        "BUNDLE_FILE_IDENTITY_MISMATCH",
    )

    try:
        root = json.loads(raw.decode("utf-8"))
    except Exception as exc:
        raise SafeStop("BUNDLE_UTF8_OR_JSON_INVALID") from exc

    _require(type(root) is dict, "BUNDLE_ROOT_OR_METADATA_MISMATCH")
    _require(
        root.get("schema") == EXPECTED_BUNDLE_SCHEMA
        and root.get("status") == EXPECTED_BUNDLE_STATUS
        and root.get("selected_branch") == EXPECTED_SELECTED_BRANCH,
        "BUNDLE_ROOT_OR_METADATA_MISMATCH",
    )

    lifecycle = root.get("authority_lifecycle")
    _require(type(lifecycle) is dict, "AUTHORITY_LIFECYCLE_MISMATCH")
    assert isinstance(lifecycle, dict)
    _require(
        lifecycle.get("authority_id") == EXPECTED_AUTHORITY_ID
        and lifecycle.get("approved_sha256") == EXPECTED_AUTHORITY_SHA256
        and lifecycle.get("activation") == 1
        and lifecycle.get("consumption") == 1
        and lifecycle.get("terminal") == "UNAUTHORIZED_EFFECT_STOP"
        and lifecycle.get("normal_progression")
        == "STOPPED_BEFORE_AUTHORIZED_BUNDLE_FETCH"
        and lifecycle.get("automatic_retry") == 0
        and lifecycle.get("automatic_progression") == 0,
        "AUTHORITY_LIFECYCLE_MISMATCH",
    )

    artifacts = root.get("artifacts")
    _require(
        type(artifacts) is list
        and len(artifacts) == EXPECTED_ARTIFACTS_CARDINALITY,
        "ARTIFACT_SELECTOR_MISMATCH",
    )
    assert isinstance(artifacts, list)
    roles = [item.get("role") if type(item) is dict else None for item in artifacts]
    _require(
        roles.count(EXPECTED_SELECTED_ROLE) == 1
        and roles[EXPECTED_SELECTED_INDEX] == EXPECTED_SELECTED_ROLE,
        "ARTIFACT_SELECTOR_MISMATCH",
    )

    selected = artifacts[EXPECTED_SELECTED_INDEX]
    _require(type(selected) is dict, "SELECTED_ARTIFACT_METADATA_MISMATCH")
    assert isinstance(selected, dict)
    mode = selected.get("mode")
    _require(
        "intended_public_path_json" in selected
        and selected.get("bytes") == EXPECTED_AUTHORITY_BYTES
        and selected.get("lf") == EXPECTED_AUTHORITY_LF
        and selected.get("cr") == EXPECTED_AUTHORITY_CR
        and selected.get("final_lf") is EXPECTED_AUTHORITY_FINAL_LF
        and str(mode) in {"0644", "420"}
        and selected.get("sha256") == EXPECTED_AUTHORITY_SHA256
        and selected.get("git_blob") == EXPECTED_AUTHORITY_GIT_BLOB
        and selected.get("content_encoding") == EXPECTED_CONTENT_ENCODING
        and selected.get("segment_chars") == EXPECTED_SEGMENT_CHARS,
        "SELECTED_ARTIFACT_METADATA_MISMATCH",
    )

    segments = selected.get("content_b64_segments")
    _require(
        type(segments) is list and len(segments) == EXPECTED_SEGMENT_COUNT,
        "SEGMENT_SHAPE_MISMATCH",
    )
    assert isinstance(segments, list)
    _require(
        all(type(segment) is str and segment.isascii() for segment in segments),
        "SEGMENT_SHAPE_MISMATCH",
    )
    segment_texts = [str(segment) for segment in segments]
    _require(
        all(len(segment) == EXPECTED_SEGMENT_CHARS for segment in segment_texts[:-1])
        and 0 < len(segment_texts[-1]) <= EXPECTED_SEGMENT_CHARS,
        "SEGMENT_SHAPE_MISMATCH",
    )

    try:
        decoded = base64.b64decode("".join(segment_texts), validate=True)
    except Exception as exc:
        raise SafeStop("BASE64_DECODE_FAILURE") from exc

    _require(
        len(decoded) == EXPECTED_AUTHORITY_BYTES
        and decoded.count(b"\n") == EXPECTED_AUTHORITY_LF
        and decoded.count(b"\r") == EXPECTED_AUTHORITY_CR
        and decoded.endswith(b"\n") is EXPECTED_AUTHORITY_FINAL_LF
        and _sha256(decoded) == EXPECTED_AUTHORITY_SHA256
        and _git_blob_sha1(decoded) == EXPECTED_AUTHORITY_GIT_BLOB,
        "DECODED_AUTHORITY_IDENTITY_MISMATCH",
    )

    return _success_packet(decoded), decoded


def _write_stop_packet(safe_packet_path: Path, code: str) -> None:
    try:
        _exclusive_write(
            safe_packet_path,
            _canonical_json_bytes(_error_packet(code)),
            0o600,
        )
    except Exception:
        # Deliberately silent. The caller treats missing safe packet as STOP.
        pass


def _main() -> int:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--bundle", required=True)
    parser.add_argument("--safe-packet-out", required=True)
    parser.add_argument("--decoded-authority-out", required=True)
    try:
        args = parser.parse_args()
    except SystemExit:
        return 64

    bundle_path = Path(args.bundle)
    safe_packet_path = Path(args.safe_packet_out)
    decoded_path = Path(args.decoded_authority_out)

    if safe_packet_path == decoded_path or safe_packet_path.exists() or decoded_path.exists():
        _write_stop_packet(safe_packet_path, "OUTPUT_PATH_PREEXISTS")
        return 65

    if not safe_packet_path.parent.is_dir() or not decoded_path.parent.is_dir():
        _write_stop_packet(safe_packet_path, "ARGUMENT_CONTRACT_INVALID")
        return 66

    try:
        packet, decoded = _parse_bundle(bundle_path)
    except SafeStop as stop:
        _write_stop_packet(safe_packet_path, stop.code)
        return 2
    except Exception:
        _write_stop_packet(safe_packet_path, "UNEXPECTED_INTERNAL_FAILURE")
        return 3

    try:
        _exclusive_write(decoded_path, decoded, 0o600)
    except Exception:
        _write_stop_packet(safe_packet_path, "DECODED_AUTHORITY_WRITE_FAILURE")
        return 4

    try:
        _exclusive_write(safe_packet_path, _canonical_json_bytes(packet), 0o600)
    except Exception:
        try:
            decoded_path.unlink(missing_ok=True)
        except Exception:
            pass
        return 5

    return 0


if __name__ == "__main__":
    raise SystemExit(_main())
