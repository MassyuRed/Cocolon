"""Four known Analysis inputs on the pinned base model, no adapter or training."""
import argparse
from dataclasses import asdict, replace
import gc
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import random
import signal
import sys
import threading
import time
import traceback
from unittest.mock import patch

sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'


def sha_text(text):
    return hashlib.sha256(text.encode()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-root', required=True, type=Path)
    parser.add_argument('--plan', required=True, type=Path)
    parser.add_argument('--plan-sha256', required=True)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    assert not args.out.exists() and sha_text(args.plan.read_text()) == args.plan_sha256
    pack = json.loads(args.plan.read_text()); plan = pack['plan']
    assert pack['status'] == 'ROOT_SELECTED_FOUR_KNOWN_INPUTS_ADAPTER_NONE_CONTROL_NOT_BLIND_OR_ACCEPTANCE'
    assert len(pack['evaluation']) == 4
    assert (plan['max_updates'], plan['max_measurement_forwards'], plan['max_model_loads'], plan['max_new_generations'], plan['max_seconds']) == (0, 0, 1, 4, 300)
    for path, expected in pack['api_source_blobs'].items():
        b = (args.api_root / path).read_bytes()
        assert hashlib.sha1(b'blob ' + str(len(b)).encode() + b'\0' + b).hexdigest() == expected
    args.out.mkdir()

    def save(name, value):
        p = args.out / name; tmp = p.with_suffix(p.suffix + '.tmp')
        tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n'); tmp.replace(p)

    report = dict(status='STARTED', plan_sha256=args.plan_sha256,
                  runner_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                  model_loads=0, new_calls=0, updates=0, measurement_forwards=0,
                  adapter=None, training=False, model_adopted=False, product_credit=0,
                  retry=False, calls=[])
    start = time.monotonic(); deadline = start + 300; generator = None

    def checkpoint():
        report['process_seconds'] = time.monotonic() - start; save('report.json', report)

    def expired(*_):
        raise TimeoutError('base4_control_deadline')

    signal.signal(signal.SIGTERM, expired); signal.signal(signal.SIGALRM, expired)
    signal.setitimer(signal.ITIMER_REAL, 300); checkpoint()
    try:
        sys.path[:0] = [str(args.api_root / 'ai/tools'), str(args.api_root / 'ai/services/ai_inference')]
        from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse, AnalysisSemanticError, canonical
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        import analysis_cumulative_service as service
        import torch
        assert {n: version(n) for n in PINS} == PINS
        assert (MODEL, REVISION) == (plan['model'], plan['revision'])
        random.seed(plan['seed']); torch.manual_seed(plan['seed']); torch.cuda.manual_seed_all(plan['seed'])
        report.update(model=MODEL, revision=REVISION, pins=PINS, torch=torch.__version__, gpu=torch.cuda.get_device_name(0))
        prepared = {}
        for row in pack['evaluation']:
            p = service.prepare_cumulative_quoted_parent_units(row['owner'], row['snapshot'])
            assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
            prepared[row['probe_id']] = p
        generator = load_generator(None, threading.Event()); report['model_loads'] += 1
        for row in pack['evaluation']:
            assert report['new_calls'] < 4 and time.monotonic() < deadline
            p = prepared[row['probe_id']]; messages = p.messages(); name = 'base_' + row['probe_id']
            sent_hash = sha_text(canonical(messages))
            save(name + '.request.json', dict(request_ref=p.request_ref, messages_sha256=sent_hash, messages=messages))
            item = dict(probe_id=row['probe_id'], status='STARTED', known_input=True)
            report['calls'].append(item); report['new_calls'] += 1; checkpoint()
            begin = time.monotonic(); raw, finish = generator(messages, min(deadline, begin + 23))
            response = AnalysisModelQuotedParentUnitsResponse(p.request_ref, sent_hash, sha_text(raw), finish, raw)
            (args.out / (name + '.raw.txt')).write_text(raw); save(name + '.response.json', asdict(response))
            item.update(status='RETURNED', seconds=time.monotonic() - begin, finish_reason=finish, raw_sha256=sha_text(raw))
            try:
                value = replace(p, response=response)
                artifact, coverage = service.build_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], model_input=value)
            except (AnalysisSemanticError, AnalysisSourceError) as exc:
                item.update(admission='REJECTED', reason=str(exc))
            else:
                path = args.out / (name + '.candidate.json')
                path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], model_input=value, artifact=artifact, coverage=coverage))
                with patch.object(MeaningExperienceEngine, 'generate', side_effect=AssertionError('generation forbidden')):
                    saved, counts = service.reload_cumulative_quoted_parent_candidates(row['owner'], row['snapshot'], path.read_text())
                assert saved == artifact and counts == coverage
                item.update(admission='RETURNED', candidate_id=artifact.candidate_id, coverage=coverage, file_replay='MATCHED')
            checkpoint()
        assert report['new_calls'] == 4 and report['model_loads'] == 1
        report['status'] = 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED', error_type=type(exc).__name__, error=str(exc), traceback=traceback.format_exc())
        raise
    finally:
        generator = None; gc.collect(); checkpoint(); signal.setitimer(signal.ITIMER_REAL, 0)


if __name__ == '__main__':
    main()
