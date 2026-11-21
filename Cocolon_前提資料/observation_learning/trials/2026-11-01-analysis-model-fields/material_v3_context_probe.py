"""One zero-training source-context comparison. Private raw stays in the archive."""
import copy
from contextlib import ExitStack
from dataclasses import asdict, replace
import gc
import hashlib
import html
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import threading
import time
import traceback
from unittest.mock import patch
import zipfile

W = Path('/workspace')
API = W / 'analysis-material-v3-api-20261103'
OUT = W / 'analysis-material-v3-context10-20261103'
ADAPTER = W / 'analysis-reason-unknown76-20261103/result/adapter'
COMMIT = '348b641c4a68c03ae0318b1160740b3dea891e94'
WEIGHTS = '9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG = '4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'
PROFILES = ('selected_material.v2', 'semantic_boundaries.v3', 'selected_material.v3')
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
sys.path[:0] = [str(API/'ai/services/ai_inference'), str(API/'ai/tools'), str(API/'ai/tests')]


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    assert not OUT.exists(), 'completed_or_running_root_must_not_restart'
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'], text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'], text=True).strip()
    assert (W/'material-v3-tests-v2.exit').read_text().strip() == '0'
    assert '249 passed, 2 skipped' in (W/'material-v3-tests-v2.log').read_text()
    assert sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
    assert sha(ADAPTER/'adapter_config.json') == CONFIG
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'], text=True).strip()
    from test_analysis_cumulative import OWNER, source_snapshot
    from test_analysis_model_material_v3 import snapshot as answered_snapshot
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse, AnalysisSemanticError, canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from serve_emlis_natural_reply import load_generator, MODEL, REVISION, PINS
    from transformers import AutoTokenizer
    from importlib.metadata import version
    assert {n: version(n) for n in PINS} == PINS
    cases = []
    first = source_snapshot(1, tier='plus')
    first['members'][0]['original'].update(memo='私の役割は連絡係だった。', memo_action='私は資料を調べた。')
    cases.append(dict(case='M01', snapshot=first, profiles=PROFILES))
    second = copy.deepcopy(first)
    second['members'][0]['original'].update(memo='なぜ開催できたかはまだ分からない。', memo_action='私は資料を調べた。')
    cases.append(dict(case='M02', snapshot=second, profiles=PROFILES))
    third = source_snapshot(2, tier='plus')
    third['members'][0]['original'].update(memo='私の役割は連絡係だった。', memo_action='私は資料を調べた。')
    third['members'][1]['original'].update(memo='私の役割は連絡係ではなかった。', memo_action='私は記録を残した。')
    cases.append(dict(case='M03', snapshot=third, profiles=PROFILES))
    cases.append(dict(case='S01', snapshot=answered_snapshot(), profiles=('selected_material.v3',)))
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
    prepared = []
    for case in cases:
        for profile in case['profiles']:
            p = (service.prepare_cumulative_category_units if profile.startswith('selected_')
                 else service.prepare_cumulative_quoted_parent_units)(OWNER, case['snapshot'], prompt_version=profile)
            tokens = tokenizer.apply_chat_template(p.messages(), enable_thinking=False, add_generation_prompt=True,
                tokenize=True, return_dict=False, truncation=False)
            assert len(tokens) + 2048 <= 8192
            prepared.append((case, profile, p, len(tokens)))
    assert len(prepared) == 10
    OUT.mkdir()
    write(OUT/'sources.json', cases)
    (OUT/'runner.py').write_bytes(Path(__file__).read_bytes())
    for name in ('material-v3-tests-v2.log','material-v3-tests-v2.exit','material-v3-tests.log','material-v3-tests.exit'):
        (OUT/name).write_bytes((W/name).read_bytes())
    report = dict(status='STARTED', api_commit=COMMIT, model=MODEL, revision=REVISION,
        weights_sha256=WEIGHTS, config_sha256=CONFIG, selection='EXPLICIT_9DC_RESEARCH_COMPARATOR_NOT_ADOPTED',
        max_seconds=600, max_new_tokens=2048, request_seconds=45, max_calls=10,
        training_updates=0, model_loads=0, new_calls=0, calls=[], normal_adoption=False, product_credit=0)
    start = time.monotonic(); deadline = start + 600
    def save():
        report['seconds'] = time.monotonic() - start
        write(OUT/'report.json', report)
    def timeout(*_):
        raise TimeoutError('material_v3_context_deadline')
    signal.signal(signal.SIGTERM, timeout); signal.signal(signal.SIGALRM, timeout)
    signal.setitimer(signal.ITIMER_REAL, 600)
    gen = None; save()
    try:
        report['model_loads'] = 1; save()
        gen = load_generator(str(ADAPTER), threading.Event(), weights_sha256=WEIGHTS, config_sha256=CONFIG)
        for case, profile, p, tokens in prepared:
            key = case['case'] + '_' + profile
            sent = hashlib.sha256(canonical(p.messages()).encode()).hexdigest()
            write(OUT/(key+'.request.json'), dict(request_ref=p.request_ref, messages_sha256=sent,
                messages=p.messages(), prompt_tokens=tokens))
            item = dict(case=case['case'], profile=profile, status='STARTED', prompt_tokens=tokens)
            report['calls'].append(item); report['new_calls'] += 1; save()
            begin = time.monotonic()
            raw, finish = gen(p.messages(), min(deadline, begin+45))
            response = AnalysisModelQuotedParentUnitsResponse(p.request_ref, sent,
                hashlib.sha256(raw.encode()).hexdigest(), finish, raw)
            (OUT/(key+'.raw.txt')).write_text(raw)
            write(OUT/(key+'.response.json'), asdict(response))
            item.update(status='RETURNED', seconds=time.monotonic()-begin, finish=finish)
            try:
                value = replace(p, response=response)
                artifact, coverage = service.build_cumulative_quoted_parent_candidates(OWNER, case['snapshot'], model_input=value)
                saved = service.serialize_cumulative_quoted_parent_candidates(OWNER, case['snapshot'],
                    model_input=value, artifact=artifact, coverage=coverage)
                (OUT/(key+'.candidate.json')).write_text(saved)
                with ExitStack() as stack:
                    for obj, name in [(MeaningExperienceEngine,'generate'),
                        (compiler,'compile_analysis_unit_candidates'),(compiler,'compile_model_written_role_graph'),
                        (author,'realize_analysis_unit_candidates'),(author,'realize_model_written_role_graph')]:
                        stack.enter_context(patch.object(obj, name, side_effect=AssertionError('saved regeneration')))
                    assert service.reload_cumulative_quoted_parent_candidates(OWNER, case['snapshot'], saved) == (artifact, coverage)
                item.update(admission='CANDIDATE_ONLY', saved_replay='MATCHED', coverage=coverage)
            except (AnalysisSemanticError, AnalysisSourceError) as exc:
                item.update(admission='REJECTED', reason=str(exc))
            save()
        report['status'] = 'COMPLETE_PENDING_SOURCE_RAW_REVIEW'
    except BaseException as exc:
        report.update(status='FAILED_NO_RETRY', error_type=type(exc).__name__)
        (OUT/'traceback.txt').write_text(traceback.format_exc())
        raise
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
        gen = None; gc.collect()
        import torch
        torch.cuda.empty_cache(); torch.cuda.synchronize()
        report['adapter_unchanged'] = (sha(ADAPTER/'adapter_model.safetensors') == WEIGHTS
            and sha(ADAPTER/'adapter_config.json') == CONFIG)
        report['gpu_after'] = subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory',
            '--format=csv,noheader'], text=True)
        save()
        manifest = {str(p.relative_to(OUT)): sha(p) for p in OUT.rglob('*') if p.is_file()}
        write(OUT/'manifest.json', manifest)
        archive = W/'cocolon-analysis-material-v3-context10-originals-20261103.zip'
        with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(OUT.rglob('*')):
                if p.is_file(): z.write(p, str(p.relative_to(OUT)))
        body = '<h1>Material v3 context comparison</h1><pre>'+html.escape(json.dumps(report,ensure_ascii=False,indent=2))+'</pre>'
        for case in cases:
            body += '<h2>'+case['case']+'</h2><pre>'+html.escape(json.dumps(case['snapshot'],ensure_ascii=False,indent=2))+'</pre>'
            for profile in case['profiles']:
                path = OUT/(case['case']+'_'+profile+'.raw.txt')
                body += '<h3>'+profile+'</h3><pre>'+html.escape(path.read_text() if path.exists() else 'NOT_RETURNED')+'</pre>'
        body += '<a href="/files/workspace/'+archive.name+'" download>Download originals</a>'
        (W/'material-v3-context10-review.html').write_text(body)
        print(json.dumps(dict(status=report['status'], calls=report['new_calls'], archive=str(archive),
            bytes=archive.stat().st_size, sha256=sha(archive))))


if __name__ == '__main__':
    main()
