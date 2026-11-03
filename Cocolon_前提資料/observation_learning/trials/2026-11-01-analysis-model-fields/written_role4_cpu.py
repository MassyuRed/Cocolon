"""Four source-authored role contrasts: strict map/file/tokenizer, no model calls."""
from pathlib import Path
from dataclasses import replace
from hashlib import sha256
from unittest.mock import patch
from contextlib import ExitStack
import argparse,json,sys,html,subprocess
w=Path('/workspace');api=w/'analysis-written-role-api-v2-20261103'
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/tests')]

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--source-sha256',required=True);args=parser.parse_args()
    source=w/'written-role4-sources.json';assert sha256(source.read_bytes()).hexdigest()==args.source_sha256
    spec=json.loads(source.read_text());assert len(spec)==4
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='88078cdb3cf19da0e9fe9188915bce9c0899a797'
    oldfile=w/'analysis-combination70-20261103/semantic_units_combination70_plan.json'
    before_sha=sha256(oldfile.read_bytes()).hexdigest();old=json.loads(oldfile.read_text())
    evaluation=json.loads((w/'analysis-written-role8-20261103/sources.json').read_text())
    oldtexts={m['original'][f] for r in old['teachers']+old['evaluation'] for m in r['snapshot']['members'] for f in ('memo','memo_action')}
    oldtexts.update(m['original'][f] for r in evaluation for m in r['snapshot']['members'] for f in ('memo','memo_action'))
    from test_analysis_model_quoted_parent_units import role_sample
    from test_analysis_cumulative import OWNER
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,canonical
    from transformers import AutoTokenizer
    tok=AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B',revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',local_files_only=True,trust_remote_code=False)
    out=w/'analysis-written-role4-cpu-20261103';assert not out.exists();out.mkdir()
    (out/'source.json').write_bytes(source.read_bytes());rows=[]
    for index,case in enumerate(spec):
        text=case['text'];assert text not in oldtexts
        snap=role_sample(text);snap['members'][0]['original']['id']='00000000-0000-0000-0000-%012d'%(61001+index)
        p=service.prepare_cumulative_quoted_parent_units(OWNER,snap)
        proposition=compiler._written_role_proposition(text);assert proposition is not None
        parts={role:(a,b) for role,a,b in proposition.source_parts}
        qualifiers=[dict(kind='EXPLICIT_ACTOR',quote=text[slice(*parts['SELF_POSSESSIVE'])])]
        if proposition.polarity=='negative':qualifiers.append(dict(kind='NEGATION',quote=text[slice(*parts['FINITE_ROLE_COPULA'])]))
        target=dict(fields=[dict(field=1,units=[dict(node_kind='ROLE',quote=text.rstrip('。．.'),parent_quote=None,scope_role=None,qualifiers=qualifiers)])])
        raw=canonical(target);value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,
            sha256(canonical(p.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw))
        units,counts=service.build_cumulative_quoted_parent_candidates(OWNER,snap,model_input=value)
        up=out/(case['id']+'.units.json');up.write_text(service.serialize_cumulative_quoted_parent_candidates(OWNER,snap,model_input=value,artifact=units,coverage=counts))
        artifact,cov=service.build_cumulative_written_role_map(OWNER,snap,model_input=value)
        rp=out/(case['id']+'.role.json');rp.write_text(service.serialize_cumulative_written_role_map(OWNER,snap,model_input=value,artifact=artifact,coverage=cov))
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates'),(compiler,'compile_model_written_role_graph'),(author,'realize_model_written_role_graph')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('no saved generation/compiler/author')))
            u,uc=service.reload_cumulative_quoted_parent_candidates(OWNER,snap,up.read_text())
            saved,sc=service.reload_cumulative_written_role_map(OWNER,snap,rp.read_text())
        assert u==units and uc==counts and saved==artifact and sc==cov
        prompt=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tok.apply_chat_template(p.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==raw+'<|im_end|>\n'
        rows.append(dict(id=case['id'],owner=OWNER,snapshot=snap,request_ref=p.request_ref,messages=p.messages(),
            assistant_target=raw,role_artifact_id=artifact.artifact_id,role_coverage=cov,
            polarity=proposition.polarity,prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),
            full_tokens=len(full),file_reload='MATCHED_NO_ENGINE_COMPILER_AUTHOR',
            provenance='ROOT_SYNTHETIC_SOURCE_AUTHORED_NOT_MODEL_RAW_NOT_MASH_TEACHING_NOT_BLIND'))
    assert sha256(oldfile.read_bytes()).hexdigest()==before_sha
    role_teachers=sum(any(u['node_kind']=='ROLE' for f in json.loads(r['assistant_target'])['fields'] for u in f['units']) for r in old['teachers'])
    result=dict(status='FOUR_ROLE_CONTRASTS_STRICT_MAP_FILE_TOKENIZER_CPU_ONLY',source_sha256=args.source_sha256,
        old70_plan_sha256=before_sha,old70_unchanged=True,old70_role_teachers=role_teachers,
        old70_explicit_possessive_role_constructions=sum('の役割は' in m['original']['memo'] for r in old['teachers'] for m in r['snapshot']['members']),
        rows=rows,model_loads=0,new_generations=0,training_updates=0,next_gpu_selected=False,normal_adoption=False)
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    bundle={str(p.relative_to(out)):dict(text=p.read_bytes().decode('utf-8'),sha256=sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size) for p in out.rglob('*') if p.is_file()}
    (w/'written-role4-evidence.html').write_text('<meta charset="utf-8"><h1>Four source-authored role contrasts / CPU only</h1><textarea>'+html.escape(json.dumps(bundle,ensure_ascii=False,separators=(',',':')))+'</textarea>')
    print(json.dumps(dict(status=result['status'],rows=[{k:r[k] for k in ('id','polarity','prompt_tokens','target_tokens','full_tokens')} for r in rows],model_loads=0,new_generations=0,training_updates=0)))

if __name__=='__main__':main()
