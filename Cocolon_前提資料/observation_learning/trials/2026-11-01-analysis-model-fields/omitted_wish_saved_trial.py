"""Reconsume nineteen saved model responses; never load or call a model.

The source/requests/responses stay byte-identical. This comparison owns no
adoption decision and uses the existing candidate saved reader and map owner.
"""
import argparse
from dataclasses import asdict
import hashlib
import importlib.util
import json
from pathlib import Path
import time


def read(p):return json.loads(Path(p).read_bytes())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def projection(p):return None if p is None else {k:v for k,v in p.items() if k!='projection_of'}
def equal(a,b):
    canonical=lambda v:json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
    return all(canonical(a.get(k))==canonical(b.get(k)) for k in ('status','counts','graph')) and all(
        canonical(projection(a.get(k)))==canonical(projection(b.get(k))) for k in ('text','projection'))


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--api',type=Path,required=True)
    ap.add_argument('--baseline',type=Path,required=True);ap.add_argument('--helper',type=Path,required=True)
    ap.add_argument('--output',type=Path,required=True);ap.add_argument('--phase',choices=['before','after'],required=True)
    a=ap.parse_args();started=time.monotonic()
    assert not a.output.exists(),'fresh output path required'
    spec=importlib.util.spec_from_file_location('existing_saved_consumer',a.helper)
    h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);h.bind_api(a.api)
    baseline=read(a.baseline/'result.private.json');pack=read(a.baseline/'pack.private.json')
    assert baseline['new_generation']==19 and baseline['model_loads']==1 and baseline['training_updates']==0
    assert [c['id'] for c in baseline['cases']]==[c['id'] for c in pack['cases']]
    result=[];changed=[]
    for saved in baseline['cases']:
        case={k:saved[k] for k in ('id','profile','row','request')}
        response=h.admission.AnalysisModelQuotedParentUnitsResponse(**saved['response'])
        out=h.consume(case,response)
        assert out['response']==saved['response'] and out['request']==saved['request'] and out['row']==saved['row']
        assert out['candidate']['non_generation_reload_exact']
        matches=equal(saved['cumulative'],out['cumulative'])
        if not matches:changed.append(saved['id'])
        if a.phase=='before' or saved['id']!='WC02_v13':assert matches,saved['id']
        else:
            c=out['cumulative'];assert saved['cumulative']['status']=='UNSUPPORTED'
            assert c['status']=='GENERATED_PRIVATE_ONLY' and c['counts']['mapped_count']==1 and c['counts']['unparsed_count']==0
            (n,)=c['graph']['nodes'];p=n['proposition']
            assert (n['node_kind'],p['actor'],n['modality'],n['polarity'],n['temporal_scope'])==(
                'ATTENTION_OR_THOUGHT','UNSPECIFIED','wish','positive','past')
            assert not c['graph']['edges'] and len(n['record_refs'])==len(n['evidence_refs'])==1
            assert '誰の希望かは未確定' in c['text']['text'] and '（当時）' in c['text']['text']
            assert '誰の希望かは未確定' in c['projection']['nodes'][0]['visible_label']
        out['baseline_cumulative']=saved['cumulative'];out['typed_exact_to_baseline']=matches
        result.append(out)
    assert changed==([] if a.phase=='before' else ['WC02_v13'])
    names=['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py']
    out=dict(schema_version='analysis_omitted_wish_saved_compare.v1',phase=a.phase,
        new_generation=0,model_loads=0,training_updates=0,db_calls=0,normal_adoption=False,
        cases=result,changed=changed,unchanged_typed=19-len(changed),candidate_saved_reload=19,
        inputs={str(a.baseline/p):sha(a.baseline/p) for p in ['result.private.json','pack.private.json']},
        helper_sha256=sha(a.helper),runner_sha256=sha(__file__),api_hashes={p:sha(a.api/p) for p in names},
        seconds=time.monotonic()-started)
    a.output.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in out.items() if k not in {'cases','inputs','api_hashes'}},ensure_ascii=False))


if __name__=='__main__':main()
