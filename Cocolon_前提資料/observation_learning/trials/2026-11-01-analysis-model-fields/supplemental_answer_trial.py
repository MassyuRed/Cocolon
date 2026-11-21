"""Four independently synthetic original/ANSWER snapshots; saved 4B, no training.

Run ``live API_DIRECTORY RESULT_DIRECTORY`` once, then ``before`` with the
preceding API and the same result directory. Each complete model response is
checkpointed before admission. The RPC store is isolated mock storage; this is
not a production DB or device run. Generated bodies/questions are never source.
"""
import asyncio
from contextlib import ExitStack
from dataclasses import asdict
from datetime import datetime, timedelta, timezone
import gc
import hashlib
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
ADAPTER = Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()


def write(path, value):
    tmp = path.with_suffix(path.suffix+'.tmp')
    tmp.write_text(admission.canonical(value))
    tmp.replace(path)


def member(number, text, category, answer, now):
    original = dict(id=str(UUID(int=9100+number)), created_at='2026-11-01T01:00:00',
        memo=text, memo_action='', category=[category], emotions=['平穏'],
        emotion_details=[dict(type='平穏', strength='medium')])
    saved = dict(original=original, thread=None, events=[])
    if answer is None:
        return saved
    # Use the existing source contracts to bind this synthetic answer to its
    # exact original. The ordinal in the model packet is not a thread round.
    source = dict(original, created_at=original['created_at']+'+00:00')
    tid, qid, aid = str(UUID(int=9200+number)), 'synthetic-question-'+str(number), str(UUID(int=9300+number))
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
        dict(id=str(UUID(int=9400+number)), thread_id=tid, kind='QUESTION', question_id=qid,
            round_index=1, payload=asdict(question)),
        dict(id=aid, thread_id=tid, kind='ANSWER', question_id=qid,
            round_index=1, payload=dict(source=asdict(answer_source))),
        dict(id=str(UUID(int=9500+number)), thread_id=tid, kind='OBSERVATION',
            payload=dict(text='GENERATED_BODY_IS_NOT_SOURCE')),
    ]
    return saved


def inputs():
    now = datetime.now(timezone.utc).isoformat()
    specs = [
        ('SA01', [('僕の役割は受付係だった。', '仕事', '僕は費用を記録した。')]),
        ('SA02', [('私は資料を見た。', '生活', '私は費用を記録しなかった。')]),
        ('SA03', [('私は資料を見た。', '仕事', '私は資料を見た。')]),
        ('SA04', [('私は資料を見た。', '仕事', '私は資料を調べた。'),
                  ('私は費用を記録した。', '生活', None)]),
    ]
    rows = []
    for group, (key, records) in enumerate(specs, 1):
        members = [member(group*10+i, text, category, answer, now)
            for i, (text, category, answer) in enumerate(records, 1)]
        snap = dict(tier='free', now=now, period_start='2026-11-01T01:00:00+00:00',
            period_end=now, members=members,
            guard='analysis-db-cumulative-v1:'+admission.digest([OWNER, members]))
        rows.append(dict(id=key, owner=OWNER, snapshot=snap,
            provenance='Karen independently synthetic; no training target; no private user records'))
    return rows


def no_generation():
    stack = ExitStack()
    for name in ('build_cumulative_map', 'prepare_cumulative_category_units'):
        stack.enter_context(patch.object(service, name, side_effect=AssertionError('saved generation')))
    return stack


async def one(row, *, report, generator=None, response=None, deadline=None):
    owner, snapshot, key = row['owner'], row['snapshot'], row['id']
    result = dict(row=row, rpc_calls=[], source_calls=0)
    stored = []

    async def source(prepared):
        result['source_calls'] += 1
        assert result['source_calls'] == 1
        messages = prepared.messages()
        result['request'] = dict(request_ref=prepared.request_ref, messages=messages,
            messages_sha256=admission.digest(messages), source_guard=prepared.source_guard)
        if generator is not None:
            report['model_calls_started'] += 1
            write(root/(mode+'.json'), report)
            raw, finish = await asyncio.to_thread(generator, messages,
                min(deadline, time.monotonic()+45))
            received = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                admission.digest(messages), hashlib.sha256(raw.encode()).hexdigest(), finish, raw)
            report['new_generation'] += 1
        else:
            assert response is not None, 'preceding API unexpectedly acquired absent response'
            received = admission.AnalysisModelQuotedParentUnitsResponse(**response)
            assert received.request_ref == prepared.request_ref
            assert received.messages_sha256 == admission.digest(messages)
        result['response'] = asdict(received)
        # Keep all received bytes and bindings before parsing, including rejected
        # or incomplete packets. Never fill a missing field or repair a kind.
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

    with patch.object(service, '_rpc', rpc), patch.object(service, 'observed_mode', return_value='development'):
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
    # The old original-only scope rejects before source acquisition. Keep this
    # outcome distinct from replaying and rejecting a response after acquisition.
    assert 0 <= result['source_calls'] <= 1
    result['response_acquired'] = bool(result['source_calls'])
    return result


def main():
    assert mode in {'live', 'before'} and not (root/(mode+'.json')).exists(), 'do_not_restart_run'
    started = time.monotonic()
    report = dict(mode=mode, status='RUNNING', cases=[], new_training=0, normal_adoption=False,
        new_generation=0, model_calls_started=0, model_loads=0,
        max_seconds=600, per_call_seconds=45, max_new_tokens=2048, max_context_tokens=8192,
        scope='full original/ANSWER envelopes, parent/version/owner binding, one record occasion; '
              'existing author/ensure/commit/read; isolated mock RPC; no inferred cross-source order')
    generator = None
    try:
        if mode == 'live':
            signal.signal(signal.SIGALRM,
                lambda *_: (_ for _ in ()).throw(TimeoutError('trial_deadline')))
            signal.setitimer(signal.ITIMER_REAL, 600)
            assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
            assert sha(ADAPTER/'adapter_config.json') == CONFIG
            from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
            from importlib.metadata import version
            report.update(model=MODEL, revision=REVISION, pins={n: version(n) for n in PINS},
                weights_sha256=WEIGHTS, config_sha256=CONFIG)
            assert report['pins'] == PINS
            rows = inputs()
            write(root/'input.json', rows)
            generator = load_generator(str(ADAPTER), threading.Event(),
                weights_sha256=WEIGHTS, config_sha256=CONFIG)
            report['model_loads'] = 1
            for row in rows:
                case = asyncio.run(one(row, report=report, generator=generator, deadline=started+600))
                report['cases'].append(case)
                write(root/'live.json', report)
            report['initial_unchanged'] = (
                sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
                and sha(ADAPTER/'adapter_config.json') == CONFIG)
            assert report['initial_unchanged']
        else:
            live = json.loads((root/'live.json').read_text())
            for case in live['cases']:
                report['cases'].append(asyncio.run(one(case['row'], report=report,
                    response=case.get('response'))))
        report['status'] = 'COMPLETE'
    except BaseException as exc:
        report.update(status='FAILED', error_type=type(exc).__name__, traceback=traceback.format_exc())
        raise
    finally:
        report.update(seconds=time.monotonic()-started,
            input_record_count=sum(len(x['row']['snapshot']['members']) for x in report['cases']),
            source_acquisitions=sum(x['source_calls'] for x in report['cases']),
            saved=sum(x['status'] == 'SAVED' for x in report['cases']),
            rejected=sum(x['status'] == 'REJECTED' for x in report['cases']),
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
        print(json.dumps({k: v for k, v in report.items() if k not in {'cases', 'traceback'}},
            ensure_ascii=False))


if __name__ == '__main__':
    main()
