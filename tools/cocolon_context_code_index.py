#!/usr/bin/env python3
"""Load the exact Step 2 code-index implementation from verified repository chunks."""
from __future__ import annotations

import base64
import hashlib
import lzma
import os
import shlex
import shutil
import sys
import tempfile
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


def _install_scip_python_heap_wrapper() -> None:
    """Invoke the pinned npm entrypoint with the documented larger V8 heap."""
    executable = shutil.which("scip-python")
    node = shutil.which("node")
    if executable is None or node is None:
        raise RuntimeError("pinned scip-python or node executable is unavailable")
    entrypoint = Path(executable).resolve()
    if not entrypoint.is_file():
        raise RuntimeError(f"scip-python entrypoint is not a file: {entrypoint}")
    wrapper_dir = Path(tempfile.mkdtemp(prefix="cocolon-scip-python-"))
    wrapper = wrapper_dir / "scip-python"
    wrapper.write_text(
        "#!/usr/bin/env bash\n"
        "set -euo pipefail\n"
        f"exec {shlex.quote(node)} --max-old-space-size=8192 "
        f"{shlex.quote(str(entrypoint))} \"$@\"\n",
        encoding="utf-8",
    )
    wrapper.chmod(0o755)
    os.environ["PATH"] = f"{wrapper_dir}{os.pathsep}{os.environ.get('PATH', '')}"


for cli_flag in ("--work", "--scip-work"):
    _absolutize_cli_path(cli_flag)

if len(sys.argv) > 1 and sys.argv[1] == "run-scip":
    _install_scip_python_heap_wrapper()

encoded = b"".join(part.read_bytes() for part in sorted(PAYLOAD.glob("part*")))
if hashlib.sha256(encoded).hexdigest() != "006157b087aaeaebb245d215a288cfa0db12901df240fdc2007d03868b171cab":
    raise RuntimeError("Step 2 code-index payload identity mismatch")
source = lzma.decompress(base64.b64decode(encoded, validate=True))
if hashlib.sha256(source).hexdigest() != "96b7ad03f43fa5e6e2b643884f05767c3582fd75153924231db8296eff8a62ca":
    raise RuntimeError("Step 2 code-index source identity mismatch")
exec(compile(source, str(PAYLOAD / "cocolon_context_code_index.py"), "exec"), globals(), globals())
