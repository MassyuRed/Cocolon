from __future__ import annotations

import base64
import gzip
import hashlib
import io
import json
import tarfile
from pathlib import Path

PAYLOAD = Path('.github/context-payloads/step3-c/payload.b64')
LOADER = Path('tools/cocolon_context_routes.py')
TEST = Path('tests/cocolon_context/test_routes.py')
MEMBER = 'tools/cocolon_context_routes_c_extension.py'

OLD_ENCODED_SHA = '26bdc94df68fddc893fa408ad7b05d506ee10ce25c1f840b2b27cff93482056d'
OLD_SOURCE_SHA = '97b406f62a71e621281536cf5e0c6712482615b63e189b734e3d54cde8272418'
OLD_LOADER_SHA = '9b229d5cca5131659e187157d871f6d9974efb43864b77d177a98f549492b0df'


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


encoded = PAYLOAD.read_bytes()
if sha256(encoded) != OLD_ENCODED_SHA:
    raise SystemExit('RN unresolved reason payload preimage mismatch')
archive = base64.b64decode(encoded, validate=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as bundle:
    member = bundle.extractfile(MEMBER)
    if member is None:
        raise SystemExit('RN unresolved reason extension source missing')
    source = member.read()
if sha256(source) != OLD_SOURCE_SHA:
    raise SystemExit('RN unresolved reason extension source preimage mismatch')

source_text = source.decode('utf-8')
anchor = '''    rn_calls = _c_enrich_rn_calls(rn_calls)
    backend_edges, closures, unresolved_backend = _c_backend_closures(
'''
replacement = '''    rn_calls = _c_enrich_rn_calls(rn_calls)
    unresolved_rn_rows = _c_read_jsonl(output_dir / "unresolved_rn_calls.jsonl")
    unresolved_rn_reason_by_subject: dict[str, str] = {}
    for unresolved_row in unresolved_rn_rows:
        subject_id = str(unresolved_row.get("subject_id") or "")
        reason = str(unresolved_row.get("reason") or "")
        if not subject_id or not reason:
            _c_error("unresolved RN row lacks subject_id or reason")
        if subject_id in unresolved_rn_reason_by_subject:
            _c_error(f"duplicate unresolved RN subject_id: {subject_id}")
        unresolved_rn_reason_by_subject[subject_id] = reason

    canonical_rn_calls: list[dict[str, _c_Any]] = []
    for original_call in rn_calls:
        call = dict(original_call)
        status = str(call.get("connection_status") or "")
        if not status.startswith("MATCHED") and not call.get("unresolved_reason"):
            reason = unresolved_rn_reason_by_subject.get(str(call.get("call_id") or ""))
            if reason:
                call["unresolved_reason"] = reason
        canonical_rn_calls.append(call)
    rn_calls = sorted(canonical_rn_calls, key=lambda item: str(item.get("call_id") or ""))

    backend_edges, closures, unresolved_backend = _c_backend_closures(
'''
if source_text.count(anchor) != 1:
    raise SystemExit('RN unresolved reason synchronization anchor mismatch')
source_text = source_text.replace(anchor, replacement, 1)

new_source = source_text.encode('utf-8')
new_source_sha = sha256(new_source)
raw_tar = io.BytesIO()
with tarfile.open(fileobj=raw_tar, mode='w', format=tarfile.PAX_FORMAT) as bundle:
    info = tarfile.TarInfo(MEMBER)
    info.size = len(new_source)
    info.mtime = 0
    info.mode = 0o644
    info.uid = 0
    info.gid = 0
    info.uname = ''
    info.gname = ''
    bundle.addfile(info, io.BytesIO(new_source))
gzip_bytes = io.BytesIO()
with gzip.GzipFile(fileobj=gzip_bytes, mode='wb', filename='', mtime=0) as stream:
    stream.write(raw_tar.getvalue())
new_archive = gzip_bytes.getvalue()
new_encoded = base64.b64encode(new_archive)
new_encoded_sha = sha256(new_encoded)
PAYLOAD.write_bytes(new_encoded)

loader_bytes = LOADER.read_bytes()
if sha256(loader_bytes) != OLD_LOADER_SHA:
    raise SystemExit('RN unresolved reason loader preimage mismatch')
loader_text = loader_bytes.decode('utf-8')
for old, new, label in (
    (OLD_ENCODED_SHA, new_encoded_sha, 'loader payload hash'),
    (OLD_SOURCE_SHA, new_source_sha, 'loader source hash'),
):
    if loader_text.count(old) != 1:
        raise SystemExit(f'{label} preimage mismatch')
    loader_text = loader_text.replace(old, new, 1)
new_loader = loader_text.encode('utf-8')
LOADER.write_bytes(new_loader)

test_text = TEST.read_text(encoding='utf-8')
test_anchor = '''            matched = [call for call in calls if call["connection_status"].startswith("MATCHED")]
            self.assertTrue(any("screens/AccountItemsScreen.js" in call["visible_consumer_files"] for call in matched))
            closures = routes.read_jsonl(output / "route_owner_closures.jsonl")
'''
test_replacement = '''            matched = [call for call in calls if call["connection_status"].startswith("MATCHED")]
            self.assertTrue(any("screens/AccountItemsScreen.js" in call["visible_consumer_files"] for call in matched))
            unresolved_rn = routes.read_jsonl(output / "unresolved_rn_calls.jsonl")
            unresolved_reason_by_subject = {
                row["subject_id"]: row["reason"] for row in unresolved_rn
            }
            unresolved_calls = [
                call
                for call in calls
                if not call["connection_status"].startswith("MATCHED")
            ]
            self.assertGreater(len(unresolved_calls), 0)
            self.assertTrue(all(
                call["unresolved_reason"]
                == unresolved_reason_by_subject[call["call_id"]]
                for call in unresolved_calls
            ))
            closures = routes.read_jsonl(output / "route_owner_closures.jsonl")
'''
if test_text.count(test_anchor) != 1:
    raise SystemExit('RN unresolved reason regression anchor mismatch')
TEST.write_text(test_text.replace(test_anchor, test_replacement, 1), encoding='utf-8')

print(json.dumps({
    'archive_sha256': sha256(new_archive),
    'encoded_payload_sha256': new_encoded_sha,
    'extension_source_sha256': new_source_sha,
    'loader_sha256': sha256(new_loader),
    'regression': 'unresolved RN reason matches canonical unresolved ledger',
}, sort_keys=True))
