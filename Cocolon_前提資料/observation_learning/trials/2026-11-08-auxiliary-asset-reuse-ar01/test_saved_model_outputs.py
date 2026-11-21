"""Replay captured synthetic model text through actual Q3 SQL, without GPU.

Set PYTHONPATH to the fixed mashos-api source/test directories and configure
Q2_PGLITE_MODULE as in the existing API integration suite. This does not
certify the captured text's meaning or touch the hosted database.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
from uuid import uuid4

import pytest

from test_emlis_q2_application import run
from test_emlis_q3_application import qdb
import emlis_thread_store
from emlis_thread_service import EmlisThreadService, Q3_PROFILE
from cocolon_meaning_experience_engine.natural_reply import NaturalReply, system_message_for

RESULTS = [record for name in ('baseline_12.json', 'baseline_transfer_6.json')
           for record in json.loads((Path(__file__).parent / name).read_text())['records']]


@pytest.mark.parametrize('record', RESULTS, ids=lambda row: row['id'])
def test_exact_saved_model_text_reopens_without_generation(record, qdb, monkeypatch):
    assert record['status'] == 'RETURNED'
    user = str(uuid4())
    original = record['original']
    parent = original['id']
    created_utc = datetime.fromisoformat(original['created_at']).astimezone(timezone.utc).replace(tzinfo=None).isoformat()
    assert 'code' not in qdb.query('insert into auth.users values ($1)', [user])
    assert 'code' not in qdb.query("insert into public.profiles values ($1,'free')", [user])
    assert 'code' not in qdb.query(
        'insert into public.emotions values ($1,$2,$3,$4,$5,$6,$7,$8)',
        [parent, user, created_utc, original['memo'], original['memo_action'],
         original['category'], original['emotions'],
         json.dumps(original['emotion_details'], ensure_ascii=False)])
    monkeypatch.setattr(emlis_thread_store, 'sb_post_rpc', qdb.rpc)
    calls = []

    async def captured_source(material):
        calls.append(material)
        assert material.material_json == record['request']['messages'][1]['content']
        assert system_message_for(material) == record['request']['messages'][0]['content']
        return NaturalReply(record['text'], record['request']['model'], material.source_prefix_ref)

    service = EmlisThreadService(runtime_profile=Q3_PROFILE, natural_reply_source=captured_source)
    dto = run(service.start(user, parent))
    assert dto['body_state'] == 'FINAL' and dto['current_observation']['text'] == record['text']
    snapshot = run(service.store.read(user, input_id=parent))
    event = next(row for row in snapshot['events'] if row['kind'] == 'OBSERVATION')
    artifact = event['payload']['artifact']
    assert artifact['analysis_state'] == 'NOT_GENERATED'
    assert artifact['meaning_comparison']['reply_sha256'] == hashlib.sha256(record['text'].encode()).hexdigest()
    assert not artifact['meaning_comparison']['full_reply_semantic_coverage']

    async def forbidden_source(*args):
        raise AssertionError('saved GET attempted a provider call')

    def forbidden_reader(*args):
        raise AssertionError('saved GET recomputed meaning')

    import cocolon_meaning_experience_engine.natural_reply_meaning as meaning
    monkeypatch.setattr(meaning, 'compare_reply_meaning', forbidden_reader)
    reopened = EmlisThreadService(runtime_profile=Q3_PROFILE, natural_reply_source=forbidden_source)
    fetched = run(reopened.get(user, parent))
    assert fetched == dto and len(calls) == 1
    assert 'meaning_comparison' not in json.dumps(fetched)
