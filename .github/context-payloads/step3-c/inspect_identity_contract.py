from __future__ import annotations

import base64
import io
import tarfile
from pathlib import Path

PAYLOAD = Path('.github/context-payloads/step3-c/payload.b64')
MEMBER = 'tools/cocolon_context_routes_c_extension.py'
encoded = PAYLOAD.read_bytes()
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('extension source missing')
    lines = member.read().decode('utf-8').splitlines()

patterns = [
    'original_route_id =',
    'unresolved_api_route_ids =',
    'unresolved_api_rows =',
    'consumer_classification',
    'API route lacks explicit unresolved consumer row',
    'NO_RN_CONSUMER_CLASSIFICATION',
]
printed: set[tuple[int, int]] = set()
for pattern in patterns:
    print(f'===== PATTERN {pattern!r} =====')
    matches = [index for index, line in enumerate(lines) if pattern in line]
    print(f'matches={matches}')
    for index in matches:
        start = max(0, index - 24)
        end = min(len(lines), index + 35)
        key = (start, end)
        if key in printed:
            continue
        printed.add(key)
        for line_no in range(start, end):
            print(f'{line_no + 1:04d}: {lines[line_no]}')
