#!/usr/bin/env python3
"""Load the exact Step 2 code-index implementation from verified repository chunks."""
from __future__ import annotations

import base64
import hashlib
import lzma
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAYLOAD = ROOT / ".github" / "context-payloads" / "step2-code"


def _absolutize_cli_path(flag: str) -> None:
    """Keep SCIP work paths stable when providers change their subprocess cwd."""
    try:
        index = sys.argv.index(flag)
    except ValueError:
        return
    if index + 1 >= len(sys.argv):
        raise RuntimeError(f"missing value for {flag}")
    value = Path(sys.argv[index + 1])
    if not value.is_absolute():
        sys.argv[index + 1] = str((ROOT / value).resolve())


for cli_flag in ("--work", "--scip-work"):
    _absolutize_cli_path(cli_flag)

encoded = b"".join(part.read_bytes() for part in sorted(PAYLOAD.glob("part*")))
if hashlib.sha256(encoded).hexdigest() != "b04cfa8c7a38989365c78e34ad6f7965e208beff20989499dbf2bb957a7121d7":
    raise RuntimeError("Step 2 code-index payload identity mismatch")
source = lzma.decompress(base64.b64decode(encoded, validate=True))
if hashlib.sha256(source).hexdigest() != "20925e2a4a1b3a19c2db2b69bf68b83a37e00ae5b7c250db37cddd93b1a7c415":
    raise RuntimeError("Step 2 code-index source identity mismatch")
exec(compile(source, str(PAYLOAD / "cocolon_context_code_index.py"), "exec"), globals(), globals())
