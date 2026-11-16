"""CPU-only guard tests; fake review fixtures never open or write a database."""
from copy import deepcopy
import asyncio
import json
from pathlib import Path

import pytest

import event_plan_same_raw_finalize as finalizer

PRE = finalizer.ROOT / 'handoff/extracted/preparation/full12_sql_worked_lesson_preacquisition_20261116'
SYNTHETIC = finalizer.CANDIDATE / 'synthetic_event_plan_v2_save_rehearsal_20261116/synthetic_test_result.json'


@pytest.fixture(scope='module')
def bound():
    receipt, material, plan = finalizer.load_pre(PRE)
    return receipt, material, plan


def guard_fixture(bound):
    """Only exercise the review binder, never represent model quality."""
    receipt, material, _ = bound
    actual = json.loads(SYNTHETIC.read_bytes())
    actual['synthetic_test_output'] = False
    actual.pop('rehearsal_label', None)
    actual_bytes = finalizer.canonical(actual).encode()
    review = dict(schema_version=finalizer.MEANING_REVIEW_SCHEMA,
        state=finalizer.MEANING_REVIEW_STATE, actual_result_sha256=finalizer.sha(actual_bytes),
        raw_sha256_by_ordinal={str(row['ordinal']):finalizer.sha(
            json.loads(row['body'])['choices'][0]['message']['content'].encode()) for row in actual['acquisitions']},
        projection_sha256=finalizer.sha(finalizer.canonical(actual['projection']).encode()),
        text_sha256=finalizer.sha(actual['text'].encode()), reviewers=['root', 'independent'],
        source_records=12, source_guard=material['snapshot']['guard'],
        frozen_as_of=material['snapshot']['now'], candidate_plan_sha256=receipt['candidate_plan']['sha256'])
    return receipt, material, actual, actual_bytes, review


def write_review(tmp_path, review):
    path = tmp_path / 'CPU_guard_fixture_NOT_REAL_QUALITY_REVIEW.json'
    path.write_text(finalizer.canonical(review))
    return path


def test_complete_review_binding_checks_all_exact_raw_projection_text_and_frozen_source(bound, tmp_path):
    receipt, material, actual, data, review = guard_fixture(bound)
    selected = finalizer.check_meaning_review(write_review(tmp_path, review), data,
        actual, material, receipt, synthetic=False)
    assert selected['actual_result_sha256'] == finalizer.sha(data)
    assert len(selected['raw_sha256_by_ordinal']) == receipt['fresh_model_calls_required']
    assert selected['state'] == finalizer.MEANING_REVIEW_STATE
    assert selected['source_guard'] == material['snapshot']['guard']
    assert selected['frozen_as_of'] == material['snapshot']['now']


@pytest.mark.parametrize('damage', ['missing', 'extra_key', 'missing_key', 'wrong_state',
    'actual', 'raw', 'raw_missing', 'raw_extra', 'projection', 'text', 'single_reviewer',
    'duplicate_reviewer', 'wrong_reviewer', 'source_records', 'source_guard', 'as_of', 'plan'])
def test_review_defects_are_rejected_before_opening_sql_or_creating_output(bound, tmp_path, monkeypatch, damage):
    receipt, material, actual, data, review = guard_fixture(bound)
    path = None
    if damage == 'extra_key': review['unbound_quality_claim'] = True
    elif damage == 'missing_key': review.pop('text_sha256')
    elif damage == 'wrong_state': review['state'] = 'GENERATED'
    elif damage == 'actual': review['actual_result_sha256'] = '0' * 64
    elif damage == 'raw': review['raw_sha256_by_ordinal'][str(receipt['fresh_model_calls_required'])] = '0' * 64
    elif damage == 'raw_missing': review['raw_sha256_by_ordinal'].pop(str(receipt['fresh_model_calls_required']))
    elif damage == 'raw_extra': review['raw_sha256_by_ordinal'][str(receipt['fresh_model_calls_required'] + 1)] = '0' * 64
    elif damage == 'projection': review['projection_sha256'] = '0' * 64
    elif damage == 'text': review['text_sha256'] = '0' * 64
    elif damage == 'single_reviewer': review['reviewers'] = ['root']
    elif damage == 'duplicate_reviewer': review['reviewers'] = ['root', 'root']
    elif damage == 'wrong_reviewer': review['reviewers'] = ['root', 'someone_else']
    elif damage == 'source_records': review['source_records'] = 11
    elif damage == 'source_guard': review['source_guard'] = 'other-source'
    elif damage == 'as_of': review['frozen_as_of'] = '2026-11-17T00:00:00Z'
    elif damage == 'plan': review['candidate_plan_sha256'] = '0' * 64
    if damage != 'missing': path = write_review(tmp_path, review)
    actual_path = tmp_path / 'CPU_guard_fixture_NOT_REAL_MODEL_RESULT.json'
    actual_path.write_bytes(data)
    # Bypass acquisition preflight only for this isolated guard test; every
    # path must still fail before even constructing a disposable database.
    monkeypatch.setattr(finalizer, 'load_pre', lambda _: (receipt, material, bound[2]))
    monkeypatch.setattr(finalizer, 'check_future_result', lambda *_a, **_k: actual['acquisitions'])
    monkeypatch.setattr(finalizer, 'verify_actual_preflight', lambda *_a, **_k:
        pytest.fail('meaning review must be checked before later finalize stages'))
    monkeypatch.setattr(finalizer, 'Q3Database', lambda *_a, **_k:
        pytest.fail('invalid meaning review must never open SQL'))
    output = tmp_path / 'must_not_be_created'
    with pytest.raises(AssertionError):
        asyncio.run(finalizer.finalize(PRE, actual_path, output, review_path=path))
    assert not output.exists()


def test_explicit_synthetic_bypass_cannot_pass_as_nonsynthetic_or_attach_quality_review(bound, tmp_path):
    receipt, material, _ = bound
    actual = json.loads(SYNTHETIC.read_bytes())
    data = SYNTHETIC.read_bytes()
    assert finalizer.check_meaning_review(None, data, actual, material, receipt, synthetic=True) is None
    with pytest.raises(AssertionError):
        finalizer.check_meaning_review(None, data, actual, material, receipt, synthetic=False)
    with pytest.raises(AssertionError, match='synthetic_rehearsal_cannot_claim_meaning_review'):
        finalizer.check_meaning_review(tmp_path / 'review.json', data, actual, material, receipt, synthetic=True)
    changed = deepcopy(actual)
    changed['rehearsal_label'] = 'meaning-quality-approved'
    with pytest.raises(AssertionError):
        finalizer.check_meaning_review(None, data, changed, material, receipt, synthetic=True)


def test_existing_rehearsal_uses_actual_httpx_request_bytes_not_canonical_reserialization():
    actual = json.loads(SYNTHETIC.read_bytes())
    for row in actual['acquisitions']:
        wire = row['wire_request']
        # Rebuild the source transport's ordered envelope, not the canonical
        # sorted dict stored inside the enclosing result JSON.
        import httpx
        # Persisted message dict key order was canonicalized. Re-derive the
        # original ordered messages as the current preparation does.
        messages = [dict(role=m['role'], content=m['content']) for m in wire['messages']]
        request = httpx.Request('POST', 'https://same-pod.invalid/v1/chat/completions',
            json=dict(model=wire['model'], messages=messages, temperature=0,
                max_tokens=4096, stream=False, chat_template_kwargs={'enable_thinking':False}))
        assert finalizer.sha(request.content) == row['wire_request_sha256']
        assert finalizer.sha(finalizer.canonical(wire).encode()) != row['wire_request_sha256']
