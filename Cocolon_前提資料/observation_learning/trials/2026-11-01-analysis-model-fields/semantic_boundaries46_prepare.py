"""Freeze an instruction-only comparison against all 46 exact saved role74 outputs."""
from pathlib import Path
from hashlib import sha256,sha1
from dataclasses import replace
from contextlib import ExitStack
from unittest.mock import patch
import json,sys,subprocess

w=Path('/workspace');api=w/'analysis-semantic-boundaries-api-20261103'
old=w/'analysis-written-role74-20261103';out=w/'analysis-semantic-boundaries46-prepared-20261103'
COMMIT='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
PROFILE='semantic_boundaries.v2'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()

def main():
    assert not out.exists() and (w/'semantic-boundaries-tests.exit').read_text()=='0'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()==COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (old/'run.exit').read_text()=='0'
    old_plan=old/'semantic_units_written_role74_plan.json'
    assert sha(old_plan)=='a557550ee2881814ece6e0c60eee0ece8abc57b9db6b276cf56750ecedc09ec8'
    original=json.loads(old_plan.read_text());report=json.loads((old/'result/report.json').read_text())
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert report['new_calls']==50 and report['updates_completed']==86
    weights='73ee8d05a2e9be611df8654f4a583c87b3d27f266bedfe700f25f2d5325eae96'
    config='07262234563cbca51bfe75c3d6797b04cf89e7569f4cd0ee862e664ba5638685'
    assert (report['adapter_sha256'],report['adapter_config_sha256'])==(weights,config)
    initial=old/'result/adapter'
    assert sha(initial/'adapter_model.safetensors')==weights and sha(initial/'adapter_config.json')==config
    manifest=json.loads((old/'manifest.json').read_text())
    assert all(sha(old/n)==h for n,h in manifest.items())
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from transformers import AutoTokenizer
    model,revision=original['plan']['model'],original['plan']['revision']
    tok=AutoTokenizer.from_pretrained(model,revision=revision,local_files_only=True,trust_remote_code=False)
    out.mkdir();evaluation=[];reused=[]
    for original_row in original['evaluation']:
        row={k:original_row[k] for k in ['probe_id','owner','snapshot','training_use','role_vertical','provenance'] if k in original_row}
        key=row['probe_id'];p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
        new=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        old_messages=p.messages();messages=new.messages()
        assert old_messages==original_row['messages'] and p.request_ref==original_row['request_ref']
        assert p.request==new.request and p.source_guard==new.source_guard and p.request_ref!=new.request_ref
        assert messages[1:]==old_messages[1:] and messages[0]['content'].startswith(old_messages[0]['content']+'\n')
        prefix=old/'result'/('after_'+key)
        req=json.loads(prefix.with_suffix('.request.json').read_text());response=json.loads(prefix.with_suffix('.response.json').read_text())
        raw=prefix.with_suffix('.raw.txt').read_bytes()
        assert req['request_ref']==p.request_ref and req['messages']==old_messages
        assert req['messages_sha256']==sha256(canonical(old_messages).encode()).hexdigest()
        assert response['raw'].encode()==raw and response['raw_sha256']==sha256(raw).hexdigest()
        value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(**response))
        recorded=next(c for c in report['calls'] if c['phase']=='after' and c['probe_id']==key)
        entry=dict(probe_id=key,source='ROLE74_AFTER46_EXACT_SAVED_73EE_BASELINE_V1',
            original_request_ref=p.request_ref,old_messages_sha256=req['messages_sha256'],source_files={})
        for suffix in ['.request.json','.response.json','.raw.txt','.candidate.json','.role.json']:
            src=prefix.with_suffix(suffix)
            if src.exists():
                dest=out/('before_'+key+suffix);dest.write_bytes(src.read_bytes())
                entry['source_files'][suffix]=dict(path=str(src),sha256=sha(src))
        for kind,build,reload,suffix in [
            ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
            ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
            if kind=='role' and not row['role_vertical']:continue
            admission='admission' if kind=='candidate' else 'role_admission'
            reason='reason' if kind=='candidate' else 'role_reason'
            saved_file=out/('before_'+key+suffix)
            try:artifact,counts=build(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                assert recorded[admission]=='REJECTED' and str(exc)==recorded[reason] and not saved_file.exists()
                entry[admission]='REJECTED';entry[reason]=str(exc)
            else:
                assert recorded[admission]=='RETURNED' and saved_file.exists()
                with ExitStack() as stack:
                    for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                        (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                        (author,'realize_model_written_role_graph')]:
                        stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                    assert reload(row['owner'],row['snapshot'],saved_file.read_text())==(artifact,counts)
                entry[admission]='RETURNED';entry[kind+'_coverage']=counts
        for version,prepared in [('before',p),('after',new)]:
            tokens=tok.apply_chat_template(prepared.messages(),enable_thinking=False,add_generation_prompt=True,
                tokenize=True,return_dict=False,truncation=False)
            assert len(tokens)+2048<=8192
            row[version+'_prompt_tokens']=len(tokens)
        row.update(request_ref=new.request_ref,messages=messages,before_request_ref=p.request_ref,before_messages=old_messages)
        evaluation.append(row);reused.append(entry)
    assert len(evaluation)==46 and len({r['probe_id'] for r in evaluation})==46
    paths=['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py','ai/tools/serve_emlis_natural_reply.py']
    blobs={p:sha1(b'blob '+str(len((api/p).read_bytes())).encode()+b'\0'+(api/p).read_bytes()).hexdigest() for p in paths}
    plan=dict(status='INSTRUCTION_ONLY_SEMANTIC_BOUNDARIES46_CPU_PREPARED',api_commit=COMMIT,
        model=model,revision=revision,initial_weights_sha256=weights,initial_config_sha256=config,
        initial_selection='EXPLICIT_SAVED_73EE_FOR_INSTRUCTION_ONLY_RESEARCH_NOT_NORMAL_OR_NEXT_TRAINING_ADOPTION',
        initial_private_library_file_id='libfile_e120a914f9348191b7f065b419e1693b',
        prompt_version=PROFILE,before_prompt_version='baseline.v1',
        max_calls=46,max_model_loads=1,max_seconds=900,request_seconds=23,max_new_tokens=2048,context_tokens=8192,
        outer_timeout_term_seconds=890,outer_kill_grace_seconds=10,training_updates=0,
        evaluation_scope='ALL46_TRAINED_OR_SEEN_SYNTHETIC_DEVELOPMENT_NOT_BLIND_NOT_MASH_TEACHING',
        evaluation=evaluation,reused_before=reused,api_source_blobs=blobs,
        prior_plan_sha256=sha(old_plan),prior_report_sha256=sha(old/'result/report.json'),
        historical_hourly_usd=.58,process_cost_upper_usd_at_historical_price=.145,
        current_price_freshly_checked=False,normal_adoption=False,
        stop_condition='46calls/1load/900s;no retry/no training/no raw repair/no receiver relaxation')
    (out/'plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
    print('SEMANTIC_BOUNDARIES46_CPU_PREPARED',sha(out/'plan.json'))

if __name__=='__main__':main()
