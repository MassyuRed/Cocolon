#!/usr/bin/env python3
"""Publish oversized canonical system-context outputs as byte-exact Git parts."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import pathlib
import re
import sys
from typing import Any, Mapping, Sequence

SCHEMA_VERSION = "cocolon.system_context.publication_transport.v1"
MANIFEST_NAME = "publication_transport.json"
DEFAULT_MAX_PART_BYTES = 90_000_000
PART_RE = re.compile(r"\.part\d{4}$")
CANONICAL_MANIFESTS = (
    ("manifest.json", "."),
    ("code_index/code_index_manifest.json", "code_index"),
    ("route_graph/route_graph_manifest.json", "route_graph"),
)


class PublicationTransportError(RuntimeError):
    pass


def canon(value: Any) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        + "\n"
    ).encode("utf-8")


def sha256_file(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_atomic(path: pathlib.Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(data)
    os.replace(temporary, path)


def load_json(path: pathlib.Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PublicationTransportError(f"cannot read JSON {path}: {exc}") from exc


def safe_relative(raw: str) -> pathlib.PurePosixPath:
    value = pathlib.PurePosixPath(str(raw))
    if value.is_absolute() or not value.parts or any(
        part in {"", ".", ".."} for part in value.parts
    ):
        raise PublicationTransportError(f"unsafe relative path: {raw!r}")
    return value


def expected_outputs(root: pathlib.Path) -> dict[str, str]:
    result: dict[str, str] = {}
    for manifest_relative, base_relative in CANONICAL_MANIFESTS:
        manifest_path = root / manifest_relative
        manifest = load_json(manifest_path)
        outputs = manifest.get("output_sha256")
        if not isinstance(outputs, dict):
            raise PublicationTransportError(
                f"manifest output_sha256 missing or invalid: {manifest_relative}"
            )
        base = pathlib.PurePosixPath(base_relative)
        for raw_name, raw_digest in outputs.items():
            name = safe_relative(str(raw_name))
            logical = name if str(base) == "." else base / name
            logical_text = logical.as_posix()
            digest = str(raw_digest)
            if not re.fullmatch(r"[0-9a-f]{64}", digest):
                raise PublicationTransportError(
                    f"invalid SHA-256 for {logical_text}: {digest!r}"
                )
            previous = result.setdefault(logical_text, digest)
            if previous != digest:
                raise PublicationTransportError(
                    f"conflicting canonical SHA-256 for {logical_text}"
                )
    return dict(sorted(result.items()))


def clean_existing_parts(path: pathlib.Path) -> None:
    for candidate in path.parent.glob(
        path.name + ".part[0-9][0-9][0-9][0-9]"
    ):
        if candidate.is_file():
            candidate.unlink()


def split_jsonl(
    *,
    root: pathlib.Path,
    logical_path: pathlib.Path,
    max_part_bytes: int,
    expected_digest: str,
) -> dict[str, Any]:
    if max_part_bytes <= 0:
        raise PublicationTransportError("max_part_bytes must be positive")
    clean_existing_parts(logical_path)
    logical_hasher = hashlib.sha256()
    logical_size = 0
    part_records: list[dict[str, Any]] = []
    part_handle = None
    part_path: pathlib.Path | None = None
    part_hasher = hashlib.sha256()
    part_size = 0
    part_index = 0

    def close_part() -> None:
        nonlocal part_handle, part_path, part_hasher, part_size
        if part_handle is None or part_path is None:
            return
        part_handle.close()
        relative = part_path.relative_to(root).as_posix()
        part_records.append(
            {
                "path": relative,
                "size": part_size,
                "sha256": part_hasher.hexdigest(),
            }
        )
        part_handle = None
        part_path = None
        part_hasher = hashlib.sha256()
        part_size = 0

    def open_part() -> None:
        nonlocal part_handle, part_path, part_index
        part_path = logical_path.with_name(
            f"{logical_path.name}.part{part_index:04d}"
        )
        part_index += 1
        part_handle = part_path.open("wb")

    try:
        with logical_path.open("rb") as source:
            for line_number, line in enumerate(source, 1):
                if len(line) > max_part_bytes:
                    raise PublicationTransportError(
                        "JSONL row exceeds max part size: "
                        f"{logical_path}:{line_number}:{len(line)}"
                    )
                if part_handle is None:
                    open_part()
                if part_size and part_size + len(line) > max_part_bytes:
                    close_part()
                    open_part()
                assert part_handle is not None
                part_handle.write(line)
                part_hasher.update(line)
                part_size += len(line)
                logical_hasher.update(line)
                logical_size += len(line)
        close_part()
    except Exception:
        if part_handle is not None:
            part_handle.close()
        clean_existing_parts(logical_path)
        raise

    if not part_records:
        raise PublicationTransportError(f"cannot split empty file: {logical_path}")
    actual_digest = logical_hasher.hexdigest()
    if actual_digest != expected_digest:
        clean_existing_parts(logical_path)
        raise PublicationTransportError(
            "canonical SHA-256 mismatch before split: "
            f"{logical_path}:{actual_digest}!={expected_digest}"
        )
    logical_path.unlink()
    return {
        "logical_path": logical_path.relative_to(root).as_posix(),
        "logical_size": logical_size,
        "logical_sha256": actual_digest,
        "representation": "ORDERED_BYTE_CONCATENATION",
        "parts": part_records,
    }


def pack_outputs(root: pathlib.Path, max_part_bytes: int) -> dict[str, Any]:
    root = root.resolve()
    if not root.is_dir():
        raise PublicationTransportError(f"output root does not exist: {root}")
    expected = expected_outputs(root)
    oversized: list[tuple[str, pathlib.Path]] = []
    for logical, expected_digest in expected.items():
        path = root / safe_relative(logical)
        if not path.is_file():
            raise PublicationTransportError(
                f"canonical output missing before publication pack: {logical}"
            )
        if path.stat().st_size > max_part_bytes:
            oversized.append((logical, path))
        elif sha256_file(path) != expected_digest:
            raise PublicationTransportError(
                f"canonical output hash mismatch before publication pack: {logical}"
            )

    logical_files = [
        split_jsonl(
            root=root,
            logical_path=path,
            max_part_bytes=max_part_bytes,
            expected_digest=expected[logical],
        )
        for logical, path in oversized
    ]
    manifest = {
        "schema_version": SCHEMA_VERSION,
        "max_part_bytes": max_part_bytes,
        "logical_file_count": len(logical_files),
        "logical_files": logical_files,
        "canonical_manifest_paths": [
            value[0] for value in CANONICAL_MANIFESTS
        ],
        "product_credit": 0,
        "automatic_progression": False,
    }
    write_atomic(root / MANIFEST_NAME, canon(manifest))
    return verify_outputs(root)


def read_transport(root: pathlib.Path) -> dict[str, Any]:
    manifest = load_json(root / MANIFEST_NAME)
    if manifest.get("schema_version") != SCHEMA_VERSION:
        raise PublicationTransportError("unsupported publication transport schema")
    logical_files = manifest.get("logical_files")
    if not isinstance(logical_files, list):
        raise PublicationTransportError("logical_files must be a list")
    return manifest


def verify_logical_file(
    root: pathlib.Path,
    record: Mapping[str, Any],
) -> tuple[str, str, int, int]:
    logical = safe_relative(str(record.get("logical_path") or ""))
    logical_text = logical.as_posix()
    if (root / logical).exists():
        raise PublicationTransportError(
            f"transported logical file must be absent: {logical_text}"
        )
    expected_digest = str(record.get("logical_sha256") or "")
    expected_size = int(record.get("logical_size") or -1)
    parts = record.get("parts")
    if not isinstance(parts, list) or not parts:
        raise PublicationTransportError(f"transport parts missing: {logical_text}")

    logical_hasher = hashlib.sha256()
    logical_size = 0
    seen_parts: set[str] = set()
    for part in parts:
        if not isinstance(part, dict):
            raise PublicationTransportError(
                f"transport part is not an object: {logical_text}"
            )
        relative = safe_relative(str(part.get("path") or ""))
        relative_text = relative.as_posix()
        if relative_text in seen_parts:
            raise PublicationTransportError(
                f"duplicate transport part: {relative_text}"
            )
        seen_parts.add(relative_text)
        path = root / relative
        if not path.is_file():
            raise PublicationTransportError(
                f"transport part missing: {relative_text}"
            )
        expected_part_size = int(part.get("size") or -1)
        expected_part_digest = str(part.get("sha256") or "")
        part_hasher = hashlib.sha256()
        part_size = 0
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                part_hasher.update(chunk)
                logical_hasher.update(chunk)
                part_size += len(chunk)
                logical_size += len(chunk)
        if part_size != expected_part_size:
            raise PublicationTransportError(
                f"transport part size mismatch: {relative_text}"
            )
        if part_hasher.hexdigest() != expected_part_digest:
            raise PublicationTransportError(
                f"transport part SHA-256 mismatch: {relative_text}"
            )
    if logical_size != expected_size:
        raise PublicationTransportError(f"logical size mismatch: {logical_text}")
    if logical_hasher.hexdigest() != expected_digest:
        raise PublicationTransportError(
            f"logical SHA-256 mismatch: {logical_text}"
        )
    return logical_text, expected_digest, logical_size, len(parts)


def verify_outputs(root: pathlib.Path) -> dict[str, Any]:
    root = root.resolve()
    manifest = read_transport(root)
    expected = expected_outputs(root)
    transported: dict[str, tuple[str, int, int]] = {}
    declared_parts: set[str] = set()

    for raw_record in manifest["logical_files"]:
        if not isinstance(raw_record, dict):
            raise PublicationTransportError(
                "logical file record must be an object"
            )
        logical, digest, size, part_count = verify_logical_file(
            root, raw_record
        )
        if logical in transported:
            raise PublicationTransportError(
                f"duplicate transported logical file: {logical}"
            )
        transported[logical] = (digest, size, part_count)
        for raw_part in raw_record["parts"]:
            declared_parts.add(
                safe_relative(str(raw_part["path"])).as_posix()
            )

    for logical, expected_digest in expected.items():
        path = root / safe_relative(logical)
        if path.is_file():
            if sha256_file(path) != expected_digest:
                raise PublicationTransportError(
                    f"canonical output SHA-256 mismatch: {logical}"
                )
            continue
        transported_value = transported.get(logical)
        if transported_value is None:
            raise PublicationTransportError(
                f"canonical output missing and not transported: {logical}"
            )
        if transported_value[0] != expected_digest:
            raise PublicationTransportError(
                f"transport/canonical manifest mismatch: {logical}"
            )

    actual_parts = {
        path.relative_to(root).as_posix()
        for path in root.rglob("*")
        if path.is_file() and PART_RE.search(path.name)
    }
    undeclared = sorted(actual_parts - declared_parts)
    missing = sorted(declared_parts - actual_parts)
    if undeclared or missing:
        raise PublicationTransportError(
            "transport part declaration mismatch: "
            f"undeclared={undeclared}, missing={missing}"
        )

    return {
        "schema_version": SCHEMA_VERSION,
        "verification": "PASS",
        "canonical_output_count": len(expected),
        "transported_logical_file_count": len(transported),
        "transport_part_count": sum(
            value[2] for value in transported.values()
        ),
        "transport_manifest_sha256": sha256_file(root / MANIFEST_NAME),
        "product_credit": 0,
        "automatic_progression": False,
    }


def cli(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command", required=True)

    pack = subparsers.add_parser("pack")
    pack.add_argument("--root", required=True, type=pathlib.Path)
    pack.add_argument(
        "--max-part-bytes",
        type=int,
        default=DEFAULT_MAX_PART_BYTES,
    )

    verify = subparsers.add_parser("verify")
    verify.add_argument("--root", required=True, type=pathlib.Path)

    args = parser.parse_args(argv)
    try:
        if args.command == "pack":
            result = pack_outputs(args.root, args.max_part_bytes)
        else:
            result = verify_outputs(args.root)
        print(canon(result).decode("utf-8"), end="")
        return 0
    except PublicationTransportError as exc:
        print(f"PUBLICATION_TRANSPORT_ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(cli())
