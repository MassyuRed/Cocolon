"""Fresh CPU replay and exact UTF-8 collection; no generation, training, or weight copies."""
from pathlib import Path
from hashlib import sha256
from dataclasses import replace
from contextlib import ExitStack
from unittest.mock import patch
import sys,json,html

w=Path('/workspace');root=w/'analysis-semantic-boundaries46-20261103'
api=w/'analysis-semantic-boundaries-api-20261103';export=w/'semantic-boundaries46-recovery'
sys.dont_write_bytecode=True;sys.path[:0]=[str(api/'ai/services/ai_inference')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError

def main():
    assert (root/'run.exit').read_text()=='0' and not export.exists()
    report=json.loads((root/'result/report.json').read_text());plan=json.loads((root/'plan.json').read_text())
    assert report['status']=='COMPLETE_PENDING_RAW_READ_NOT_ADOPTED'
    assert (report['new_calls'],report['model_loads'],report['training_updates'])==(46,1,0)
    manifest=json.loads((root/'manifest.json').read_text())
    assert all(sha256((root/n).read_bytes()).hexdigest()==h for n,h in manifest.items())
    gpu=json.loads((root/'gpu-after.json').read_text())
    assert gpu['prior_six_adapter_pairs_unchanged'] and not gpu['compute_apps'].strip()
    rows=[]
    for phase in ('before','after'):
        folder=root if phase=='before' else root/'result'
        for row in plan['evaluation']:
            key=row['probe_id'];prefix=folder/(phase+'_'+key)
            prompt='baseline.v1' if phase=='before' else plan['prompt_version']
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=prompt)
            req=json.loads(prefix.with_suffix('.request.json').read_text());res=json.loads(prefix.with_suffix('.response.json').read_text())
            raw=prefix.with_suffix('.raw.txt').read_bytes()
            assert req['request_ref']==p.request_ref and req['messages']==p.messages()
            assert req['messages_sha256']==sha256(canonical(p.messages()).encode()).hexdigest()
            assert res['raw'].encode()==raw and res['raw_sha256']==sha256(raw).hexdigest()
            value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(**res))
            recorded=next(c for c in (plan['reused_before'] if phase=='before' else report['calls']) if c['probe_id']==key)
            item=dict(phase=phase,probe_id=key,prompt_version=prompt,raw_sha256=sha256(raw).hexdigest())
            for kind,build,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
                if kind=='role' and not row['role_vertical']:continue
                admission='admission' if kind=='candidate' else 'role_admission'
                reason='reason' if kind=='candidate' else 'role_reason'
                saved=prefix.with_suffix(suffix)
                try:artifact,counts=build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert recorded[admission]=='REJECTED' and str(exc)==recorded[reason] and not saved.exists()
                    item[admission]='REJECTED';item[reason]=str(exc)
                else:
                    assert recorded[admission]=='RETURNED' and saved.exists()
                    with ExitStack() as stack:
                        for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                            (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                            (author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                        assert reload(row['owner'],row['snapshot'],saved.read_text())==(artifact,counts)
                    item[admission]='RETURNED';item[kind+'_coverage']=counts
                    item[kind+'_file_replay']='MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
                    item[kind+'_file_sha256']=sha256(saved.read_bytes()).hexdigest()
            rows.append(item)
    assert len(rows)==92
    replay=dict(status='FRESH_CPU_92_RESPONSES_REPLAYED',rows=rows,model_loads=0,new_generations=0,training_updates=0,
        candidate_matched=sum(r['admission']=='RETURNED' for r in rows),candidate_rejected=sum(r['admission']=='REJECTED' for r in rows),
        role_matched=sum(r.get('role_admission')=='RETURNED' for r in rows),role_rejected=sum(r.get('role_admission')=='REJECTED' for r in rows),
        saved_reader_engine_both_compilers_both_authors_forbidden=True,quality_credit=0)
    replay_file=w/'semantic-boundaries46-saved-replay.json'
    with replay_file.open('x') as f:f.write(json.dumps(replay,ensure_ascii=False,indent=2)+chr(10))
    files={('run/'+str(p.relative_to(root))):p for p in root.rglob('*') if p.is_file()}
    extras=['semantic_boundaries46_collect.py','semantic-boundaries46-saved-replay.json','semantic-boundaries46-supervisor.log',
        'semantic-boundaries-api-setup.log','semantic-boundaries-tests-command.json','semantic-boundaries-tests.log',
        'semantic-boundaries-tests.exit','semantic-boundaries-tests-job.py','semantic-boundaries-tests-supervisor.log',
        'semantic-boundaries-tests-v2-job.py','semantic-boundaries-tests-v2-supervisor.log',
        'semantic-boundaries-tests-v3-job.py','semantic-boundaries-tests-v3-supervisor.log']
    for n in extras:
        assert (w/n).exists();files['extra/'+n]=w/n
    for n in plan['api_source_blobs']:files['api-source/'+n]=api/n
    bundle={}
    for n,p in sorted(files.items()):
        b=p.read_bytes();text=b.decode('utf-8');assert text.encode()==b
        bundle[n]=dict(text=text,bytes=len(b),sha256=sha256(b).hexdigest())
    text=json.dumps(bundle,ensure_ascii=False,separators=(',',':'))
    export.mkdir();parts=[]
    def viewer(name,value):
        (export/name).write_text('<meta charset="utf-8"><textarea aria-label="Recovery data" style="width:98vw;height:94vh">'+html.escape(value)+'</textarea>')
    for i,offset in enumerate(range(0,len(text),500000)):
        name=f'texts-{i:02}.html';viewer(name,text[offset:offset+500000]);parts.append(name)
    meta=dict(text_parts=parts,bundle_bytes=len(text.encode()),bundle_sha256=sha256(text.encode()).hexdigest(),
        source_members=len(bundle),source_weight_archive='libfile_e120a914f9348191b7f065b419e1693b',
        new_weights=False,model_loads=0,new_generations=0,training_updates=0)
    viewer('meta.html',json.dumps(meta,separators=(',',':')))
    print(json.dumps(dict(status=replay['status'],candidate_matched=replay['candidate_matched'],candidate_rejected=replay['candidate_rejected'],
        role_matched=replay['role_matched'],role_rejected=replay['role_rejected'],**meta)))

if __name__=='__main__':main()
