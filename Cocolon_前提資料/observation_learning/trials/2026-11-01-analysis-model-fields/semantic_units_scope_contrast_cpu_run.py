"""CPU-only synthetic scope contrasts; never loads, generates or updates a model."""
from pathlib import Path
from copy import deepcopy
from dataclasses import replace
from uuid import UUID
from contextlib import ExitStack
from unittest.mock import patch
import hashlib,json
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,canonical
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author

def main():
    w=Path('/workspace');old_path=w/'analysis-other62-20261102/semantic_units_other62_plan.json';old_bytes=old_path.read_bytes();old=json.loads(old_bytes);assert len(old['teachers'])==62
    evidence=w/'analysis-actor-predicate-20261102';assert (evidence/'run.exit').read_text()=='0';report=json.loads((evidence/'report.json').read_text());assert report['new_calls']==12 and report['updates']==0
    out=w/'analysis-scope-contrast-cpu-20261102';out.mkdir(exist_ok=False)
    known={f['text'] for r in old['teachers']+old['evaluation'] for f in json.loads(r['messages'][1]['content'])['fields']}
    actor='叔父は';contexts=[('列車が着いたかも分からない','窓口が開くかは分からない'),('荷物が届いたかも分からない','担当者が戻るかは分からない')]
    constructions=[('NEGATIVE_ACTION','叔父は参加しなかった'),('POSITIVE_ACTION','叔父は参加した'),('NOUN_TARGET','叔父は参加を断った')]
    rows=[]
    from transformers import AutoTokenizer
    tokenizer=AutoTokenizer.from_pretrained(old['plan']['model'],revision=old['plan']['revision'],local_files_only=True,trust_remote_code=False)
    for context,(left,right) in enumerate(contexts,1):
        for construction,clause in constructions:
            key=f'SC{len(rows)+1:02}';memo='。'.join((left,clause,right))+'。';assert memo not in known
            snapshot=deepcopy(old['teachers'][0]['snapshot']);snapshot['members'][0]['original'].update(id=str(UUID(int=23001+len(rows))),memo=memo,memo_action='');owner=old['teachers'][0]['owner']
            prepared=service.prepare_cumulative_quoted_parent_units(owner,snapshot);units=[]
            for text in (left,clause,right):
                if text==clause:
                    qualifiers=[dict(kind='EXPLICIT_ACTOR',quote=actor)]
                    if construction=='NEGATIVE_ACTION':qualifiers.append(dict(kind='NEGATION',quote='しなかった'))
                    units.append(dict(quote=text,node_kind='ACTION_OR_NONACTION',parent_quote=None,scope_role=None,qualifiers=qualifiers))
                    if construction=='NOUN_TARGET':units.append(dict(quote='参加',node_kind=None,parent_quote=text,scope_role='CONTENT_TARGET',qualifiers=[]))
                else:
                    units.append(dict(quote=text,node_kind=None,parent_quote=None,scope_role='WRITTEN_UNKNOWN',qualifiers=[dict(kind='EPISTEMIC_EXPRESSION',quote='分からない')]))
                    suffix='も分からない' if text.endswith('も分からない') else 'は分からない';content=text[:-len(suffix)]
                    units.append(dict(quote=content,node_kind=None,parent_quote=text,scope_role='UNKNOWN_CONTENT',qualifiers=[]))
            raw=canonical(dict(fields=[dict(field=1,units=units)]));response=AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,hashlib.sha256(canonical(prepared.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),'stop',raw);model_input=replace(prepared,response=response)
            artifact,coverage=service.build_cumulative_quoted_parent_candidates(owner,snapshot,model_input=model_input);saved=service.serialize_cumulative_quoted_parent_candidates(owner,snapshot,model_input=model_input,artifact=artifact,coverage=coverage);path=out/(key+'.candidate.json');path.write_text(saved)
            with ExitStack() as stack:
                for obj,name in ((MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')):stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved reader must not regenerate')))
                again,counts=service.reload_cumulative_quoted_parent_candidates(owner,snapshot,path.read_text())
            assert artifact==again and coverage==counts and counts['mapped_count']==0 and counts['unparsed_count']==1
            prompt=tokenizer.apply_chat_template(prepared.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            full=tokenizer.apply_chat_template(prepared.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
            assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==raw+'<|im_end|>\n'
            rows.append(dict(id=key,context=context,construction=construction,owner=owner,snapshot=snapshot,messages=prepared.messages(),request_ref=prepared.request_ref,assistant_target=raw,target_sha256=hashlib.sha256(raw.encode()).hexdigest(),source_bound_candidate_id=artifact.candidate_id,coverage=coverage,serialized_payload=path.read_text(),serialized_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full),saved_file_reload='MATCHED_SAME_PROCESS_NO_GENERATION_COMPILER_AUTHOR',provenance='ROOT_SYNTHETIC_AFTER_FACTORIAL_NOT_MASH_TEACHING_MODEL_OUTPUT_OR_BLIND_EVALUATION'))
    assert len(rows)==len({r['snapshot']['members'][0]['original']['memo'] for r in rows})==6 and old_path.read_bytes()==old_bytes
    result=dict(status='CPU_SCOPE_CONTRAST6_ONLY_NO_GPU_PLAN_OR_MODEL_QUALITY',api_commit=old['api_commit'],old62_plan_sha256=hashlib.sha256(old_bytes).hexdigest(),evidence_manifest_sha256=hashlib.sha256((evidence/'manifest.json').read_bytes()).hexdigest(),rows=rows,old62_changed=False,model_loads=0,new_generations=0,training_updates=0,receiver_changed=False,normal_adoption=False,product_credit=0,limits=['Two contexts xthree constructions with one actor are six root-authored contrast sources, not six independent observations.','Created after diagnosis. All sources/targets are seen development material, not blind general performance.','No MD02/OA02/model output is copied into a target; new actor and new complete sources.','ACTION uses full source actor clause; noun-target is distinct from grammatical negative, positive action has no NEGATION.','No new dose/order/initial/evaluation/GPU run is selected automatically.','HQ03 actor qualifier/CQ04 slight/HQ04 reason remain separate residuals.','Strict source binding and actual-file reload/tokenizer prove representation only, not model understanding.'])
    target=out/'semantic_units_scope_contrast_cpu.json';target.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    (w/'scope-contrast-cpu-download.html').write_text('<meta charset=utf-8><h1>Scope contrast CPU6</h1><a href=analysis-scope-contrast-cpu-20261102/semantic_units_scope_contrast_cpu.json>CPU contrasts and saved payloads</a>')
    print('SC6 strict/file replay/tokenizer matched; old62 unchanged; model0/generation0/update0')

if __name__=='__main__':main()
