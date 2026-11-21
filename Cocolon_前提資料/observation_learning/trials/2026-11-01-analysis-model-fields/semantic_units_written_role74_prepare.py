"""Old70/CE78 kept; four CPU-verified role lessons; one bounded continuation."""
from pathlib import Path
from dataclasses import replace
from hashlib import sha256,sha1
from unittest.mock import patch
from contextlib import ExitStack
import copy,json,sys,subprocess

w=Path('/workspace');api=w/'analysis-written-role-api-v2-20261103'
oldroot=w/'analysis-combination70-20261103';roles=w/'analysis-written-role8-20261103'
cpu=w/'analysis-written-role4-cpu-20261103';out=w/'analysis-written-role74-prepared-20261103'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()

def main():
    assert not out.exists()
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='88078cdb3cf19da0e9fe9188915bce9c0899a797'
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (w/'written-role8.exit').read_text()=='0' and (w/'written-role4-cpu.exit').read_text()=='0'
    oldfile=oldroot/'semantic_units_combination70_plan.json'
    assert sha(oldfile)=='3717326a93d2510d7dd25cf1ef950ac568e6fa1b4ec9e3fafc9160265da8db30'
    old=json.loads(oldfile.read_text());oldreport=json.loads((oldroot/'result/report.json').read_text())
    role_report=json.loads((roles/'report.json').read_text());role_rows=json.loads((roles/'sources.json').read_text())
    role_cpu=json.loads((cpu/'result.json').read_text())
    assert len(old['teachers'])==70 and len(old['evaluation'])==34 and len(role_rows)==8
    assert role_cpu['status']=='FOUR_ROLE_CONTRASTS_STRICT_MAP_FILE_TOKENIZER_CPU_ONLY'
    assert role_cpu['old70_unchanged'] and len(role_cpu['rows'])==4
    weights='a5eafe344189ede6a4a664396d43af651e5482c0d3c720d6b329a1b44d01bd41'
    config='9bc9f1f3f2979d49911dae1b028cc2fb064e8e000baebcb84b84a3f50448b5cf'
    assert (oldreport['adapter_sha256'],oldreport['adapter_config_sha256'])==(weights,config)
    assert (role_report['initial_weights_sha256'],role_report['initial_config_sha256'])==(weights,config)
    assert sha(oldroot/'result/adapter/adapter_model.safetensors')==weights
    assert sha(oldroot/'result/adapter/adapter_config.json')==config
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from transformers import AutoTokenizer
    teachers=copy.deepcopy(old['teachers'])
    for row in role_cpu['rows']:
        item=copy.deepcopy(row)
        item['source_bound_candidate_id']=json.loads((cpu/(item['id']+'.units.json')).read_text())['state']['candidate_id']
        teachers.append(item)
    assert len({r['id'] for r in teachers})==74
    assert canonical(teachers[:70])==canonical(old['teachers'])
    evaluation=[]
    for row in old['evaluation']:
        item=copy.deepcopy(row);item.update(pre_generation_required=False,role_vertical=False)
        item.pop('assistant_target',None);evaluation.append(item)
    for row in role_rows:
        evaluation.append(dict(probe_id=row['id'],owner=row['owner'],snapshot=row['snapshot'],
            training_use=False,pre_generation_required=False,role_vertical=True,
            provenance='EXISTING_SEEN_WRITTEN_ROLE_DEVELOPMENT_NOT_BLIND'))
    for row in role_cpu['rows']:
        evaluation.append(dict(probe_id=row['id'],owner=row['owner'],snapshot=row['snapshot'],
            training_use=True,pre_generation_required=True,role_vertical=True,
            provenance='NEW_SOURCE_AUTHORED_ROLE_TEACHER_REPRODUCTION_NOT_BLIND'))
    assert len(evaluation)==len({r['probe_id'] for r in evaluation})==46
    assert len({canonical([r['owner'],r['snapshot']]) for r in evaluation})==46
    original_order=old['plan']['update_order'];assert len(original_order)==78
    inserts={10:'T01',20:'T02',30:'T03',40:'T04',45:'T01',50:'T02',55:'T03',60:'T04'}
    order=[]
    for i,key in enumerate(original_order,1):
        order.append(key)
        if i in inserts:order.append(inserts[i])
    assert len(order)==86 and [k for k in order if not k.startswith('T')]==original_order
    assert order[-18:]==original_order[-18:]
    assert all(order.count(k)==2 for k in ('T01','T02','T03','T04'))
    plan=dict(max_updates=86,epochs=None,batch_size=1,gradient_accumulation=1,
        learning_rate=1e-5,weight_decay=0.,gradient_clip=1.,seed=20261111,
        max_seconds=900,max_new_generations=50,request_seconds=23,
        context_tokens=8192,max_new_tokens=2048,max_model_loads=3,
        trainable_tensors=112,trainable_parameters=3833856,
        model='Qwen/Qwen3.5-4B',revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
        base_config_sha256=old['plan']['base_config_sha256'],
        initial='EXPLICIT_SAVED_COMBINATION70_A5_ROLE4_CONTINUATION_NOT_INTERRUPTED_RESUME',
        initial_weights_sha256=weights,initial_config_sha256=config,
        initial_private_library_file_id='libfile_d2746636f0a0819195c24541806470b3',
        max_teacher_measurements=148,max_training_forwards=86,
        outer_timeout_term_seconds=890,outer_kill_grace_seconds=10,
        training_objective='EXISTING_UNWEIGHTED_FULL_ASSISTANT_CE_V1',
        measurement_objective='UNWEIGHTED_FULL_ASSISTANT_NLL',update_order=order,
        adaptive_loss_sha256=old['plan']['adaptive_loss_sha256'],
        gpu_hourly_usd_previous_observation=.58,process_cost_upper_usd_at_previous_price=.145,
        current_price_freshly_checked=False,normal_adoption=False,
        evaluation_scope='after46=old34+seen_role8+new_teacher4;before42 reused from exact a5;new teacher before4;not blind/general quality',
        retention='Old70 dictionaries and entire old78 order/exposures preserved;last18 old unchanged;T4 each2',
        stop_condition='900s/50calls/86updates;no retry/extra epoch/raw repair/receiver relaxation;preserve partial')
    api_paths=['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py']
    blobs={p:sha1(b'blob '+str(len((api/p).read_bytes())).encode()+b'\0'+(api/p).read_bytes()).hexdigest() for p in api_paths}
    control=next(m['losses'] for m in oldreport['measurements'] if m['phase']=='after_updates')
    assert len(control)==70
    out.mkdir();reused=[];checks=[]
    tok=AutoTokenizer.from_pretrained(plan['model'],revision=plan['revision'],local_files_only=True,trust_remote_code=False)
    def response(p,raw):
        return AnalysisModelQuotedParentUnitsResponse(p.request_ref,sha256(canonical(p.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw)
    for row in teachers:
        p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
        assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
        raw=row['assistant_target'];value=replace(p,response=response(p,raw))
        artifact,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
        assert artifact.candidate_id==row['source_bound_candidate_id']
        path=out/('teacher_'+row['id']+'.units.json');path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value,artifact=artifact,coverage=cov))
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved unit regeneration')))
            assert service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())==(artifact,cov)
        prompt=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tok.apply_chat_template(p.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==raw+'<|im_end|>\n'
        if row['id'].startswith('T'):
            role,rc=service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
            assert role.artifact_id==row['role_artifact_id']
            rp=out/('teacher_'+row['id']+'.role.json');rp.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value,artifact=role,coverage=rc))
            with ExitStack() as stack:
                for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_model_written_role_graph'),(author,'realize_model_written_role_graph')]:
                    stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved role regeneration')))
                assert service.reload_cumulative_written_role_map(row['owner'],row['snapshot'],rp.read_text())==(role,rc)
        checks.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full)))
    for row in evaluation:
        p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
        if 'request_ref' in row:assert row['request_ref']==p.request_ref and row['messages']==p.messages()
        row.update(request_ref=p.request_ref,messages=p.messages())
        tokens=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)+2048<=8192
        if row['pre_generation_required']:continue
        probe=row['probe_id'];root=roles if row['role_vertical'] else oldroot/'result'
        stem=probe if row['role_vertical'] else 'after_'+probe
        request_file=root/(stem+'.request.json');response_file=root/(stem+'.response.json');rawfile=root/(stem+'.raw.txt')
        req=json.loads(request_file.read_text());resp=json.loads(response_file.read_text())
        assert req['request_ref']==p.request_ref and req['messages']==p.messages()
        assert req['messages_sha256']==sha256(canonical(p.messages()).encode()).hexdigest()
        assert resp['raw']==rawfile.read_text() and resp['finish_reason']=='stop'
        assert resp['raw_sha256']==sha256(rawfile.read_bytes()).hexdigest()
        value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
        entry=dict(probe_id=probe,source_group='WRITTEN_ROLE8' if row['role_vertical'] else 'COMBINATION70_AFTER34',
            initial_weights_sha256=weights,initial_config_sha256=config,source_files={})
        for suffix in ('.request.json','.response.json','.raw.txt'):
            src=root/(stem+suffix);dest=out/('before_'+probe+suffix);dest.write_bytes(src.read_bytes());entry['source_files'][suffix]=dict(path=str(src),sha256=sha(src))
        try:
            art,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
        except (AnalysisSemanticError,AnalysisSourceError) as exc:entry.update(admission='REJECTED',reason=str(exc))
        else:entry.update(admission='RETURNED',candidate_id=art.candidate_id,coverage=cov)
        original=next(c for c in (role_report['calls'] if row['role_vertical'] else oldreport['calls'])
            if (c.get('id')==probe if row['role_vertical'] else c.get('phase')=='after' and c.get('probe_id')==probe))
        expected_admission=('REJECTED' if 'original_candidate_rejection' in original else 'RETURNED') if row['role_vertical'] else original['admission']
        assert entry['admission']==expected_admission
        if entry['admission']=='RETURNED':
            suffix='.units.json' if row['role_vertical'] else '.candidate.json'
            src=root/(stem+suffix);dest=out/('before_'+probe+'.candidate.json');dest.write_bytes(src.read_bytes())
            with ExitStack() as stack:
                for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')]:
                    stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved before regeneration')))
                restored,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],dest.read_text())
            assert restored.candidate_id==entry['candidate_id'] and counts==entry['coverage']
            entry['source_files'][suffix]=dict(path=str(src),sha256=sha(src))
        else:
            assert entry['reason']==(original['original_candidate_rejection'] if row['role_vertical'] else original['reason'])
        if row['role_vertical']:
            try:art,cov=service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:entry.update(role_admission='REJECTED',role_reason=str(exc))
            else:entry.update(role_admission='RETURNED',role_artifact_id=art.artifact_id,role_coverage=cov)
            assert entry['role_admission']==original['role_admission']
            if entry['role_admission']=='RETURNED':
                assert entry['role_artifact_id']==original['artifact_id']
                src=root/(stem+'.role.json');dest=out/('before_'+probe+'.role.json');dest.write_bytes(src.read_bytes())
                entry['source_files']['.role.json']=dict(path=str(src),sha256=sha(src))
            else:assert entry['role_reason']==original['role_reason']
        reused.append(entry)
    assert len(reused)==42 and sha(oldfile)=='3717326a93d2510d7dd25cf1ef950ac568e6fa1b4ec9e3fafc9160265da8db30'
    pack=dict(status='ROOT_SYNTHETIC_WRITTEN_ROLE74_FROM_SAVED_A5_NOT_PRODUCT_ACCEPTANCE',
        api_commit='88078cdb3cf19da0e9fe9188915bce9c0899a797',teachers=teachers,evaluation=evaluation,
        preexisting_evaluation=[r['probe_id'] for r in evaluation if not r['pre_generation_required']],plan=plan,
        api_source_blobs=blobs,control_combination70_after_losses=control,
        old70_plan_sha256=sha(oldfile),role4_cpu_sha256=sha(cpu/'result.json'),role8_report_sha256=sha(roles/'report.json'))
    (out/'semantic_units_written_role74_plan.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
    (out/'reused_before.json').write_text(json.dumps(reused,ensure_ascii=False,indent=2)+'\n')
    (out/'semantic_units_written_role74_cpu.json').write_text(json.dumps(dict(status='CPU_PREPARED',teachers=74,old70_unchanged=True,
        old78_subsequence=True,old_last18_unchanged=True,updates=86,measurements_cap=148,after=46,
        before_reused=42,before_new=4,new_calls_cap=50,model_loads=0,new_generations=0,training_updates=0,token_checks=checks),ensure_ascii=False,indent=2)+'\n')
    print('WRITTEN_ROLE74_CPU_PREPARED',sha(out/'semantic_units_written_role74_plan.json'))

if __name__=='__main__':main()
