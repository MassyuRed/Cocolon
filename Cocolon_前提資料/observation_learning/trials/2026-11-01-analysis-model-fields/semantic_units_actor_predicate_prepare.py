"""CPU-only actor/predicate factorial plan; no training targets or model loads."""
from copy import deepcopy
from pathlib import Path
from uuid import UUID
import hashlib
import json
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import canonical

def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    w=Path('/workspace');prior=w/'analysis-other62-20261102';old=w/'analysis-mixed60-20261102'
    out=w/'analysis-actor-predicate-prepared-20261102';out.mkdir(exist_ok=False)
    pack=json.loads((prior/'semantic_units_other62_plan.json').read_text());report=json.loads((prior/'result/report.json').read_text())
    assert (prior/'run.exit').read_text()=='0' and report['updates_completed']==68 and report['new_calls']==28
    assert report['adapter_sha256']=='89badc47bc21bf315e4475267c007b9ee51c0b013a4d7d3161333f02fd30f580'
    original={r['probe_id']:r for r in pack['evaluation']};reuses=json.loads((prior/'reused_before.json').read_text());rows=[]
    all_teacher_texts={field['text'] for r in pack['teachers'] for field in json.loads(r['messages'][1]['content'])['fields']}
    for context,source_id,base_actor,base_predicate in (('MD','MD02','姉','参加'),('OA','OA02','父','返送')):
        source=original[source_id];memo=source['snapshot']['members'][0]['original']['memo'];clause=base_actor+'は'+base_predicate+'しなかった'
        assert memo.count(clause)==1
        for actor in ('姉','父'):
            for predicate in ('参加','返送'):
                key='AD'+str(len(rows)+1).zfill(2);reused=actor==base_actor and predicate==base_predicate
                snapshot=deepcopy(source['snapshot']);changed_clause=actor+'は'+predicate+'しなかった'
                if not reused:
                    snapshot['members'][0]['original'].update(id=str(UUID(int=22000+len(rows)+1)),memo=memo.replace(clause,changed_clause))
                prepared=service.prepare_cumulative_quoted_parent_units(source['owner'],snapshot)
                if reused: assert prepared.messages()==source['messages'] and prepared.request_ref==source['request_ref']
                else: assert snapshot['members'][0]['original']['memo'] not in all_teacher_texts
                row=dict(probe_id=key,context=context,actor=actor,predicate=predicate,source_probe_id=source_id,original_clause=clause,changed_clause=changed_clause,reuse=reused,training_use=False,prior_teacher_source=reused and source_id=='OA02',owner=source['owner'],snapshot=snapshot,request_ref=prepared.request_ref,messages=prepared.messages(),messages_sha256=hashlib.sha256(canonical(prepared.messages()).encode()).hexdigest(),provenance='ROOT_SEEN_MINIMAL_COUNTERFACTUAL_NOT_BLIND_OR_TEACHER')
                if reused:
                    row['saved']={}
                    for condition in ('f982','89ba'):
                        phase='before' if condition=='f982' else 'after'
                        prefix=(prior if condition=='f982' and source_id=='MD02' else prior/'result')/(phase+'_'+source_id)
                        request=json.loads(Path(str(prefix)+'.request.json').read_text());response=json.loads(Path(str(prefix)+'.response.json').read_text());raw=Path(str(prefix)+'.raw.txt').read_bytes()
                        assert request['messages']==row['messages'] and request['request_ref']==row['request_ref'] and request['messages_sha256']==row['messages_sha256']
                        assert response['raw'].encode()==raw and response['raw_sha256']==hashlib.sha256(raw).hexdigest()
                        if condition=='f982' and source_id=='MD02':
                            proof=[x for x in reuses if x['probe_id']==source_id];assert len(proof)==1 and proof[0]['raw_sha256']==response['raw_sha256'] and proof[0]['adapter_sha256']==report['initial_hashes']['adapter_model.safetensors']
                            admission='RETURNED'
                        else:
                            calls=[x for x in report['calls'] if x['phase']==phase and x['probe_id']==source_id];assert len(calls)==1 and calls[0]['raw_sha256']==response['raw_sha256'];admission=calls[0]['admission']
                        assert Path(str(prefix)+'.candidate.json').exists()==(admission=='RETURNED')
                        row['saved'][condition]=dict(prefix=str(prefix),raw_sha256=response['raw_sha256'],admission=admission,files={suffix:sha(Path(str(prefix)+suffix)) for suffix in ('.request.json','.response.json','.raw.txt','.candidate.json') if Path(str(prefix)+suffix).exists()})
                rows.append(row)
    assert len(rows)==8 and sum(r['reuse'] for r in rows)==2
    assert len({r['snapshot']['members'][0]['original']['memo'] for r in rows})==8
    from transformers import AutoTokenizer
    tokenizer=AutoTokenizer.from_pretrained(pack['plan']['model'],revision=pack['plan']['revision'],local_files_only=True,trust_remote_code=False)
    counts={}
    for row in rows:
        ids=tokenizer.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(ids)+2048<=8192;counts[row['probe_id']]=len(ids)
    result=dict(status='PREPARED_FINITE_ACTOR_PREDICATE_DIAGNOSIS',source_commit='3c6e7ff31d561580a0037065ff5592cb59522436',api_commit=pack['api_commit'],source_plan_sha256=sha(prior/'semantic_units_other62_plan.json'),source_report_sha256=sha(prior/'result/report.json'),model=pack['plan']['model'],revision=pack['plan']['revision'],api_source_blobs=pack['api_source_blobs'],rows=rows,conditions=[dict(id='f982',adapter_dir=str(old/'result/adapter'),weights_sha256=report['initial_hashes']['adapter_model.safetensors'],config_sha256=report['initial_hashes']['adapter_config.json']),dict(id='89ba',adapter_dir=str(prior/'result/adapter'),weights_sha256=report['adapter_sha256'],config_sha256=report['adapter_config_sha256'])],limits=dict(new_calls=12,reused_results=4,model_loads=2,max_seconds=300,request_seconds=23,context_tokens=8192,max_new_tokens=2048,training_updates=0,seed=20261110,outer_term_seconds=290,outer_kill_grace_seconds=10,process_cost_upper_usd_at_prior_058=.04833333333333333),evaluation_scope='Two source contexts each actor2 x predicate2; two saved originals x2adapters reused and only6new cells x2 generated. Seen diagnostic, not blind/new teaching/general accuracy/sole token causation.',partial_policy='Preserve partial on timeout; no cap extension, retry, output repair or extra training.',reading='Read independent full ACTION root, actor, NEGATION, inappropriate actor target and both unknown parent pairings separately. Keep HQ03 qualifier/CQ04 slight/HQ04 reason residuals separate.')
    plan=out/'semantic_units_actor_predicate_plan.json';plan.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    cpu=out/'semantic_units_actor_predicate_cpu.json';cpu.write_text(json.dumps(dict(status='CPU8_PREPARE_AND_4_REUSE_IDENTITY_AND_TOKENIZER_MATCHED',rows=8,new_sources=6,reused_results=4,prompt_tokens=counts,source_teacher_exact_match_new=0,model_loads=0,new_generations=0,training_updates=0),indent=2)+'\n')
    export={p.name:dict(bytes=p.stat().st_size,sha256=sha(p),text=p.read_text()) for p in (plan,cpu)}
    (w/'actor-predicate-prepared-export.json').write_text(json.dumps(export,ensure_ascii=False))
    (w/'actor-predicate-prepared-download.html').write_text('<meta charset=utf-8><h1>Actor predicate CPU preparation</h1><a href=actor-predicate-prepared-export.json>Plan and CPU checks</a>')
    print('CPU8/ref4/tokenizer matched, models0/generations0/updates0')

if __name__=='__main__':main()
