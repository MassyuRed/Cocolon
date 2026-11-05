"""Four new saved-source contexts for supplemental responsibility/decision adoption.

CLI: ``prepare API RESULT_DIR`` freezes the input and checks the real offline
tokenizer budget; ``live`` makes four v6 generations with one saved 4B load;
``before`` consumes those same raw responses on the preceding API; ``replay``
consumes them on the new API and checks saved output equality. No retraining.
Some phrases were already tested in CP01/02: these are new saved-source contexts,
not four held-out language-quality samples. Only this isolated runner selects v6;
normal ensure stays v4. RPC storage is mock, not production DB or a device run.
"""
import asyncio
from contextlib import ExitStack
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
from functools import wraps
import gc
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import signal
import sys
import threading
import time
import traceback
from unittest.mock import patch
from uuid import UUID

mode, api, root = sys.argv[1:4]
api, root = Path(api), Path(root)
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/services/ai_inference'), str(api/'ai/services'),
                str(api/'ai/tools')]
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
import analysis_cumulative_service as service
from fastapi import HTTPException
from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission

from cocolon_meaning_experience_engine.contracts import GenerationRequest
from cocolon_meaning_experience_engine.source_kernel import freeze_text_source
from cocolon_meaning_experience_engine.emlis_thread_contracts import (
    EmlisClarificationV1, EmlisQuestionDecisionV1, SupplementalAnswerSource,
)
from emlis_ai_current_input_bundle import build_emlis_current_input_bundle

OWNER = str(UUID(int=1))
PROFILE = 'selected_material.v6'
ADAPTER = Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()


def write(path, value):
    tmp = path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(admission.canonical(value))
    tmp.replace(path)


def member(number, text, category, answer, now):
    original = dict(id=str(UUID(int=11100+number)), created_at='2026-11-01T01:00:00',
        memo=text, memo_action='', category=[category], emotions=['平穏'],
        emotion_details=[dict(type='平穏', strength='medium')])
    saved = dict(original=original, thread=None, events=[])
    if answer is None:
        return saved
    # Use the existing source contracts to bind this synthetic answer to its
    # exact original. The ordinal in the model packet is not a thread round.
    source = dict(original, created_at=original['created_at']+'+00:00')
    tid, qid, aid = str(UUID(int=11200+number)), 'synthetic-question-'+str(number), str(UUID(int=11300+number))
    request = GenerationRequest('synthetic-emlis-'+str(number),
        build_emlis_current_input_bundle(source), source['id'])
    ref = freeze_text_source(request).envelope.envelope_id
    question = EmlisClarificationV1(qid, request.request_id, tid, ref,
        EmlisQuestionDecisionV1('ASK', target_ref='synthetic-target'),
        'QUESTION_IS_NOT_ANALYSIS_SOURCE')
    answer_source = SupplementalAnswerSource(aid, tid, qid, 1, ref, answer, now)
    saved['thread'] = dict(id=tid, user_id=OWNER, original_emotion_id=source['id'],
        source_snapshot=json.loads(admission.canonical(original)), revision=3, issued_count=1,
        data=dict(runtime_profile='q2.free.one_round.v1', original_source_ref=ref))
    saved['events'] = [
        dict(id=str(UUID(int=11400+number)), thread_id=tid, kind='QUESTION', question_id=qid,
            round_index=1, payload=asdict(question)),
        dict(id=aid, thread_id=tid, kind='ANSWER', question_id=qid,
            round_index=1, payload=dict(source=asdict(answer_source))),
        dict(id=str(UUID(int=11500+number)), thread_id=tid, kind='OBSERVATION',
            payload=dict(text='GENERATED_BODY_IS_NOT_SOURCE')),
    ]
    return saved


def inputs():
    now = datetime.now(timezone.utc).isoformat()
    specs = [
        ('AC01', [('私は資料を見た。', '仕事',
            '私は会場の準備を担当しました。その後、私は手順を決めました。')]),
        ('AC02', [('僕の役割は受付係だった。', '生活',
            '僕は連絡を担当しなかった。僕は日程を決めなかった。')]),
        ('AC03', [('私は案内を担当した。私は集合時刻を決めた。', '仕事',
            '私は案内を担当した。私は集合時刻を決めた。')]),
        ('AC04', [('私は資料を見た。', '仕事',
            '私は会合の進行を担当した。その後、私は分担を決めた。'),
            ('僕は費用を記録しなかった。', '生活', None)]),
    ]
    rows = []
    for group, (key, records) in enumerate(specs, 1):
        members = [member(group*10+i, text, category, answer, now)
            for i, (text, category, answer) in enumerate(records, 1)]
        snap = dict(tier='free', now=now, period_start='2026-11-01T01:00:00+00:00',
            period_end=now, members=members,
            guard='analysis-db-cumulative-v1:'+admission.digest([OWNER, members]))
        rows.append(dict(id=key, prompt_version=PROFILE, owner=OWNER, snapshot=snap,
            provenance='Karen synthetic new saved-source context; some wording previously tested; '
                       'not held-out language-quality data; no training target; no private user records'))
    return rows


def input_check(rows):
    assert [row['id'] for row in rows] == ['AC01', 'AC02', 'AC03', 'AC04']
    assert all(row['prompt_version'] == PROFILE for row in rows)
    assert [len(row['snapshot']['members']) for row in rows] == [1, 1, 1, 2]


def prepare_row(row):
    prepared = service.prepare_cumulative_category_units(row['owner'], row['snapshot'],
        prompt_version=row['prompt_version'])
    admission.require_analysis_model_observed_scope(prepared.request)
    messages = prepared.messages()
    return prepared, dict(id=row['id'], prompt_version=row['prompt_version'],
        snapshot_sha256=admission.digest(row['snapshot']), request_ref=prepared.request_ref,
        source_guard=prepared.source_guard, messages_sha256=admission.digest(messages), messages=messages)


def prepare():
    assert not (root/'input.json').exists(), 'do_not_replace_prepared_inputs'
    from serve_emlis_natural_reply import MODEL, REVISION, PINS
    from transformers import AutoTokenizer
    pins = {name: version(name) for name in PINS}
    assert pins == PINS
    assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
    assert sha(ADAPTER/'adapter_config.json') == CONFIG
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION,
        local_files_only=True, trust_remote_code=False)
    rows = inputs()
    input_check(rows)
    write(root/'input.json', rows)
    prepared_rows = []
    for row in rows:
        _, item = prepare_row(row)
        encoded = tokenizer.apply_chat_template(item['messages'], enable_thinking=False,
            add_generation_prompt=True, tokenize=True, return_dict=True,
            return_tensors='pt', truncation=False)
        count = encoded['input_ids'].shape[-1]
        assert count + 2048 <= 8192, 'context_budget_exceeded'
        item.update(input_tokens=count, reserved_new_tokens=2048, max_context_tokens=8192)
        prepared_rows.append(item)
    return dict(mode='prepare', status='COMPLETE', rows=prepared_rows, model=MODEL,
        revision=REVISION, pins=pins, weights_sha256=WEIGHTS, config_sha256=CONFIG,
        model_loads=0, new_generation=0, new_training=0, normal_adoption=False)


def no_generation():
    stack = ExitStack()
    for name in ('build_cumulative_map', 'prepare_cumulative_category_units'):
        stack.enter_context(patch.object(service, name, side_effect=AssertionError('saved generation')))
    return stack


def selected_prepare(profile):
    original = service.prepare_cumulative_category_units
    @wraps(original)
    def wrapped(owner, snapshot, *, prompt_version='selected_categories.v1'):
        # ensure_map requests v4; build_cumulative_map later requests the actual
        # bound profile. Change only this explicit isolated trial seam.
        assert prompt_version in {'selected_material.v4', profile}
        return original(owner, snapshot, prompt_version=profile)
    return wrapped


async def one(row, expected, *, report, generator=None, response=None, deadline=None):
    owner, snapshot, key = row['owner'], row['snapshot'], row['id']
    _, fresh = prepare_row(row)
    assert fresh == {k: v for k, v in expected.items()
        if k not in {'input_tokens', 'reserved_new_tokens', 'max_context_tokens'}}
    result = dict(row=row, rpc_calls=[], source_calls=0)
    stored = []

    async def source(prepared):
        result['source_calls'] += 1
        assert result['source_calls'] == 1
        assert prepared.prompt_version == row['prompt_version']
        messages = prepared.messages()
        assert prepared.request_ref == expected['request_ref']
        assert prepared.source_guard == expected['source_guard']
        assert messages == expected['messages']
        result['request'] = dict(request_ref=prepared.request_ref, messages=messages,
            messages_sha256=admission.digest(messages), source_guard=prepared.source_guard,
            prompt_version=prepared.prompt_version)
        if generator is not None:
            report['model_calls_started'] += 1
            write(root/'live.json', report)
            raw, finish = await asyncio.to_thread(generator, messages,
                min(deadline, time.monotonic()+45))
            received = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                admission.digest(messages), hashlib.sha256(raw.encode()).hexdigest(), finish, raw)
            report['new_generation'] += 1
        else:
            assert response is not None, 'saved_response_missing'
            received = admission.AnalysisModelQuotedParentUnitsResponse(**response)
            assert received.request_ref == prepared.request_ref
            assert received.messages_sha256 == admission.digest(messages)
        result['response'] = asdict(received)
        # Persist every raw before its original kind/field structure is admitted.
        write(root/(mode+'-'+key+'.response.json'),
            dict(row=row, request=result['request'], response=asdict(received)))
        return received

    async def forbidden(_):
        raise AssertionError('saved model acquisition')

    async def rpc(name, payload):
        assert payload['p_user_id'] == owner
        result['rpc_calls'].append(dict(name=name, payload=payload))
        if name == 'analysis_cumulative_read':
            rows = json.loads(admission.canonical(stored))
            if payload['p_id'] is not None:
                rows = [x for x in rows if x['id'] == payload['p_id']]
            if not payload['p_history']:
                for x in rows:
                    x.update(snapshot_month=None, captured_at=None)
            return dict(items=rows, subscription_tier='free', matched=True, history_limit=2)
        if name == 'analysis_cumulative_source_snapshot':
            return snapshot
        assert name == 'analysis_cumulative_commit' and payload['p_guard'] == snapshot['guard']
        if 'p_existing_id' in payload:
            return stored[0]['id']
        rid = str(UUID(payload['p_artifact_id'][9:]))
        stored.append(dict(id=rid, source_profile='cumulative.v1', report_mode='standard',
            report_type='latest', title='わたしマップ', period_start=payload['p_start'],
            period_end=payload['p_end'], generated_at=snapshot['now'],
            snapshot_month=datetime.now(timezone(timedelta(hours=9))).date().replace(day=1).isoformat(),
            captured_at=snapshot['now'], content_text=payload['p_text'],
            content_json=dict(report_mode='standard', watashiMap=payload['p_projection'],
                map_context=payload['p_private_evidence']['coverage'])))
        assert 'raw_sha256' not in admission.canonical(payload['p_private_evidence'])
        return rid

    with patch.object(service, '_rpc', rpc), \
         patch.object(service, 'observed_mode', return_value='development'), \
         patch.object(service, 'prepare_cumulative_category_units', selected_prepare(row['prompt_version'])):
        try:
            dto = await service.ensure_map(owner, model_source=source)
        except HTTPException as exc:
            result.update(status='REJECTED', error=dict(status_code=exc.status_code, detail=exc.detail))
        else:
            result.update(status='SAVED' if dto['has_visible_content'] else 'UNSUPPORTED', result=dto)
            if stored:
                with no_generation():
                    current = await service.ensure_map(owner, model_source=forbidden)
                    monthly = await service.ensure_map(owner, monthly=True, force=True, model_source=forbidden)
                    readonly = await service.ensure_map(owner, ensure=False, model_source=forbidden)
                for reread in (current, monthly, readonly):
                    assert reread['meta'] == dto['meta'] and reread['content_text'] == dto['content_text']
                    assert reread['report_id'] == dto['report_id'] and not reread['refreshed']
                result.update(current=current, monthly=monthly, readonly=readonly)
    result['commit_count'] = sum(x['name'] == 'analysis_cumulative_commit' for x in result['rpc_calls'])
    assert 0 <= result['source_calls'] <= 1
    return result


def compare_replay(old, new):
    assert old['row'] == new['row'] and old['status'] == new['status']
    assert old.get('request') == new.get('request') and old.get('response') == new.get('response')
    assert old['source_calls'] == new['source_calls']
    if old['status'] == 'REJECTED':
        assert old['error'] == new['error']
    else:
        a, b = old['result'], new['result']
        assert a['content_text'] == b['content_text'] and a['map_context'] == b['map_context']
        if a.get('meta') is None or b.get('meta') is None:
            assert a.get('meta') is None and b.get('meta') is None
        else:
            x, y = dict(a['meta']), dict(b['meta'])
            x.pop('projection_of', None)
            y.pop('projection_of', None)
            assert x == y


def main():
    assert mode in {'prepare', 'live', 'before', 'replay'}
    root.mkdir(parents=True, exist_ok=True)
    assert not (root/(mode+'.json')).exists(), 'do_not_restart_run'
    started = time.monotonic()
    report = dict(mode=mode, status='RUNNING', cases=[], new_training=0, normal_adoption=False,
        new_generation=0, model_calls_started=0, model_loads=0,
        new_saved_source_contexts=4, input_record_instances=5, held_out_language_quality_samples=0,
        max_seconds=600, per_call_seconds=45,
        max_new_tokens=2048, max_context_tokens=8192,
        scope='v6 original/ANSWER envelopes; supplemental responsibility/decision source proof; '
              'same raw before/after with existing author/ensure/commit/read; isolated mock RPC')
    generator = None
    try:
        if mode == 'prepare':
            report.update(prepare())
        else:
            manifest = json.loads((root/'prepare.json').read_text())
            assert manifest['status'] == 'COMPLETE'
            rows = json.loads((root/'input.json').read_text())
            input_check(rows)
            expected = {item['id']: item for item in manifest['rows']}
            if mode == 'live':
                signal.signal(signal.SIGALRM,
                    lambda *_: (_ for _ in ()).throw(TimeoutError('trial_deadline')))
                signal.setitimer(signal.ITIMER_REAL, 600)
                assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
                assert sha(ADAPTER/'adapter_config.json') == CONFIG
                from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
                report.update(model=MODEL, revision=REVISION, pins={n: version(n) for n in PINS},
                    weights_sha256=WEIGHTS, config_sha256=CONFIG)
                assert report['pins'] == PINS
                generator = load_generator(str(ADAPTER), threading.Event(),
                    weights_sha256=WEIGHTS, config_sha256=CONFIG)
                report['model_loads'] = 1
                for row in rows:
                    case = asyncio.run(one(row, expected[row['id']], report=report,
                        generator=generator, deadline=started+600))
                    report['cases'].append(case)
                    write(root/'live.json', report)
                report['initial_unchanged'] = (
                    sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
                    and sha(ADAPTER/'adapter_config.json') == CONFIG)
                assert report['initial_unchanged']
            else:
                live = json.loads((root/'live.json').read_text())
                assert live['status'] == 'COMPLETE'
                for case in live['cases']:
                    new = asyncio.run(one(case['row'], expected[case['row']['id']],
                        report=report, response=case.get('response')))
                    if new['source_calls']:
                        assert new['response'] == case['response']
                        assert new['request'] == case['request']
                    if mode == 'replay':
                        compare_replay(case, new)
                    report['cases'].append(new)
                report['received_response_replay_count'] = sum(
                    item['source_calls'] for item in report['cases'])
                report['same_received_responses'] = all(
                    item['source_calls'] == 1 for item in report['cases'])
                if mode == 'replay':
                    report['same_responses_and_projections'] = True
            report['status'] = 'COMPLETE'
    except BaseException as exc:
        report.update(status='FAILED', error_type=type(exc).__name__, traceback=traceback.format_exc())
        raise
    finally:
        report.update(seconds=time.monotonic()-started,
            source_acquisitions=sum(x['source_calls'] for x in report['cases']),
            saved=sum(x['status'] == 'SAVED' for x in report['cases']),
            rejected=sum(x['status'] == 'REJECTED' for x in report['cases']),
            unsupported=sum(x['status'] == 'UNSUPPORTED' for x in report['cases']),
            mapped_records=sum((x.get('result', {}).get('map_context') or {}).get('mapped_count', 0)
                for x in report['cases']),
            unparsed_records=sum((x.get('result', {}).get('map_context') or {}).get('unparsed_count', 0)
                for x in report['cases']))
        write(root/(mode+'.json'), report)
        if generator is not None:
            del generator
            gc.collect()
            import torch
            torch.cuda.empty_cache()
        print(json.dumps({k: v for k, v in report.items()
            if k not in {'cases', 'rows', 'traceback'}}, ensure_ascii=False))


if __name__ == '__main__':
    main()
