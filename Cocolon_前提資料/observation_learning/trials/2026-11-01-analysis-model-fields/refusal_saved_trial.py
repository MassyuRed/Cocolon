"""Compare the same nineteen saved responses; never load or call a model."""
import argparse
from dataclasses import asdict
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import time


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def canonical(v):
    return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def semantics(c):
    return {k: ({a:b for a,b in v.items() if a != 'projection_of'}
        if k in {'text', 'projection'} else v) for k,v in c.items()}


def main():
    ap = argparse.ArgumentParser()
    for name in ('api', 'baseline', 'helper', 'output'):
        ap.add_argument('--' + name, type=Path, required=True)
    ap.add_argument('--phase', choices=['before', 'after'], required=True)
    a = ap.parse_args()
    assert not a.output.exists(), 'fresh output required'
    started = time.monotonic()
    spec = importlib.util.spec_from_file_location('saved_consumer', a.helper)
    h = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(h)
    h.bind_api(a.api)
    baseline = json.loads(a.baseline.read_bytes())
    assert len(baseline['cases']) == 19
    assert baseline['new_generation'] == baseline['model_loads'] == baseline['training_updates'] == 0
    cases, changed = [], []
    for saved in baseline['cases']:
        case = {k:saved[k] for k in ('id', 'profile', 'row', 'request')}
        response = h.admission.AnalysisModelQuotedParentUnitsResponse(**saved['response'])
        out = h.consume(case, response)
        for k in ('row', 'request', 'response', 'candidate'):
            assert canonical(out[k]) == canonical(saved[k]), (saved['id'], k)
        assert out['candidate']['non_generation_reload_exact']
        exact = canonical(semantics(out['cumulative'])) == canonical(semantics(saved['cumulative']))
        if not exact:
            changed.append(saved['id'])
        if a.phase == 'before' or saved['id'] != 'WC04_v13':
            assert exact, saved['id']
        else:
            c = out['cumulative']
            assert saved['cumulative']['status'] == 'UNSUPPORTED'
            assert c['status'] == 'GENERATED_PRIVATE_ONLY'
            assert c['counts']['mapped_count'] == 1 and c['counts']['unparsed_count'] == 0
            n, = c['graph']['nodes']
            p = n['proposition']
            assert (n['node_kind'], p['actor'], p['predicate_lemma'], n['polarity'],
                n['modality'], n['temporal_scope'], p['relative_day']) == (
                    'ACTION_OR_NONACTION', 'UNSPECIFIED', '断る', 'positive', 'fact', 'past', '')
            assert p['arguments'] == (('は', '今日の集まりへの誘い'),)
            assert len(n['record_refs']) == len(n['evidence_refs']) == 1
            assert not c['graph']['edges'] and not c['graph']['annotations'] and not c['graph']['conflicts']
            assert '誰の行動かは未確定' in c['text']['text']
            assert '今日の集まりへの誘いは断る' in c['projection']['nodes'][0]['visible_label']
            assert {g['missing_scope'] for g in c['graph']['unknown_gaps']} == {
                'SCENE', 'ROLE', 'ATTENTION_OR_THOUGHT', 'IMMEDIATE_RESULT_OR_AFTERMATH'}
        out['baseline_cumulative'] = saved['cumulative']
        out['typed_exact_to_baseline'] = exact
        cases.append(out)
    assert changed == ([] if a.phase == 'before' else ['WC04_v13'])
    paths = ['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py']
    result = dict(schema_version='analysis_refusal_saved_compare.v1', phase=a.phase,
        api_commit=subprocess.check_output(['git','-C',str(a.api),'rev-parse','HEAD'],text=True).strip(),
        new_generation=0, model_loads=0, training_updates=0, db_calls=0, normal_adoption=False,
        changed=changed, unchanged_typed=19-len(changed), candidate_saved_reload=19,
        raw_request_candidate_exact=19, cases=cases, baseline_sha256=sha(a.baseline),
        helper_sha256=sha(a.helper), runner_sha256=sha(__file__),
        api_hashes={p:sha(a.api/p) for p in paths}, seconds=time.monotonic()-started)
    a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(canonical({k:v for k,v in result.items() if k not in {'cases','api_hashes'}}))


if __name__ == '__main__':
    main()
