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
if hashlib.sha256(encoded).hexdigest() != "bab67bf86899797fb346fc5c0e5ea19823ac12efef411801b2354f57c690015b":
    raise RuntimeError("Step 2 code-index payload identity mismatch")
source = lzma.decompress(base64.b64decode(encoded, validate=True))
if hashlib.sha256(source).hexdigest() != "036c296111c23a38ead4afe4c9b8ce9194fd9146b31ff3cc96726fe8262fee61":
    raise RuntimeError("Step 2 code-index source identity mismatch")
exec(compile(source, str(PAYLOAD / "cocolon_context_code_index.py"), "exec"), globals(), globals())
