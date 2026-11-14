"""Existing quoted-parent scope contrast; CPU-only preparation, no model load."""
from pathlib import Path
from copy import deepcopy
from uuid import UUID
from hashlib import sha256
from dataclasses import replace
from contextlib import ExitStack
from unittest.mock import patch
import sys,json
w=Path('/workspace');api=w/'analysis-api-20261103'
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,canonical
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author

def main():
 olddir=w/'analysis-other62-restored-20261103';oldpath=olddir/'semantic_units_other62_plan.json'
 old=json.loads(oldpath.read_text());cpu=json.loads((w/'semantic_units_scope_contrast_cpu.json').read_text())
 assert sha256(oldpath.read_bytes()).hexdigest()=='708e979b8b20b9dac8bd55181ff624e478a6db492f439052171e9093f5a94698'
 assert sha256((w/'semantic_units_scope_contrast_cpu.json').read_bytes()).hexdigest()=='dfa900b01675ad4401adcf9dbb7bc11376ff54421d5cb281bbf5d846843ab430'
 assert len(old['teachers'])==62 and len(cpu['rows'])==6
 out=w/'analysis-scope68-prepared-20261103';out.mkdir(exist_ok=False)
 pack=deepcopy(old);pack['status']='ROOT_SYNTHETIC_SCOPE68_FROM_SAVED_OTHER62_NOT_BLIND_OR_PRODUCT_ACCEPTANCE'
 pack['cocolon_source_commit']='7b7e17738f2ada35d3800042c134869e61d9d10e'
 pack['source_other62_plan_sha256']=sha256(oldpath.read_bytes()).hexdigest()
 pack['source_scope6_cpu_sha256']=sha256((w/'semantic_units_scope_contrast_cpu.json').read_bytes()).hexdigest()
 for row in cpu['rows']:
  pack['teachers'].append({k:row[k] for k in ('id','owner','snapshot','request_ref','messages','assistant_target','source_bound_candidate_id','coverage','provenance')})
 pack['evaluation']=[dict(row,pre_generation_required=False,development_seen=True,evaluation_scope='EXACT_SAVED_OTHER62_AFTER89BA_REUSE') for row in old['evaluation']]
 for row in cpu['rows']:
  pack['evaluation'].append(dict(probe_id=row['id'],owner=row['owner'],snapshot=row['snapshot'],request_ref=row['request_ref'],messages=row['messages'],training_use=True,pre_generation_required=True,development_seen=True,evaluation_scope='ROOT_SYNTHETIC_SC6_TRAINED_REHEARSAL'))
 for i,source in enumerate((cpu['rows'][0],cpu['rows'][4]),1):
  snap=deepcopy(source['snapshot']);m=snap['members'][0]['original'];m.update(id=str(UUID(int=24000+i)),memo=m['memo'].replace('叔父は','叔母は'))
  pr=service.prepare_cumulative_quoted_parent_units(source['owner'],snap)
  assert pr.messages() not in [r['messages'] for r in pack['teachers']+pack['evaluation']]
  pack['evaluation'].append(dict(probe_id=f'SD{i:02}',owner=source['owner'],snapshot=snap,request_ref=pr.request_ref,messages=pr.messages(),training_use=False,pre_generation_required=True,development_seen=False,evaluation_scope='ROOT_SYNTHETIC_NEARBY_ACTOR_TRANSFER_DIAGNOSTIC_NOT_BLIND_GENERAL_QUALITY'))
 pack['preexisting_evaluation']=[dict(probe_id=r['probe_id'],source='Exact other62 saved after89ba response') for r in old['evaluation']]
 oldorder=list(dict.fromkeys(old['plan']['update_order']));assert len(oldorder)==62
 order=[]
 for i,key in enumerate(oldorder,1):
  order.append(key)
  if i<=48 and i%4==0:order.append(f'SC{((i//4-1)%6)+1:02}')
 assert len(order)==74 and order[-14:]==oldorder[-14:]
 assert all(order.count(r['id'])==1 for r in old['teachers']) and all(order.count(f'SC{i:02}')==2 for i in range(1,7))
 pack['plan'].update(max_updates=74,max_new_generations=40,max_teacher_measurements=136,max_training_forwards=74,update_order=order,
  initial='EXPLICIT_SAVED_OTHER62_89BA_NEW_SCOPE_CONTRAST_NOT_INTERRUPTED_RESUME',initial_weights_sha256='89badc47bc21bf315e4475267c007b9ee51c0b013a4d7d3161333f02fd30f580',initial_config_sha256='b357ff96373f1dac800ce0e5216daabbd9741358a2c72674c2838ac470cf60eb',initial_private_library_file_id='libfile_8ad5521b02bc819199f00c2be35ec190',evaluation_scope='Exact saved24 before reused;SC6/SD2 newbefore8+all32after=40 calls,nearby seen/development not general quality',rehearsal_stop_condition='PreserveAT4/UQ2/MX2/OA2;readSC6/SD2/MD02 actor/negation/content target/unknown parent;trackHQ03 actor,CQ04 slight,HQ04 reason separately;normal non-adoption;no retry/output repair/receiver relaxation')
 pack['teaching_rationale']=dict(purpose='Support existing material-to-role/choice analysis by improving a limited action-scope reader;not whole-route completion',preservation='Old62 dictionary-identical including participation noun targets;SC6 root-authored,not Mash teaching',initial='89ba explicitly chosen to preserve OA2 and prior retained behavior;HQ03 regression remains a tracked blocker',limits=['Nearby synthetic contrast,not blind/general acceptance','Old quoted-parent prompt unchanged;selected-categories prompt is a separate comparison','All unparsed/actor unresolved/route0/normal non-adoption remain','No new theory,subsystem,public API,DB,RN,deployment or acceptance change'])
 from transformers import AutoTokenizer
 tokenizer=AutoTokenizer.from_pretrained(pack['plan']['model'],revision=pack['plan']['revision'],local_files_only=True,trust_remote_code=False)
 checks=[]
 for row in pack['teachers']:
  pr=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot']);assert pr.messages()==row['messages'] and pr.request_ref==row['request_ref']
  raw=row['assistant_target'];response=AnalysisModelQuotedParentUnitsResponse(pr.request_ref,sha256(canonical(pr.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw);inp=replace(pr,response=response)
  art,cov=service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=inp)
  assert art.candidate_id==row['source_bound_candidate_id'] and cov['mapped_count']==0
  path=out/('teacher_'+row['id']+'.candidate.json');path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=inp,artifact=art,coverage=cov))
  with ExitStack() as stack:
   for obj,name in ((MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates')):stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved reader must not regenerate')))
   again,counts=service.reload_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],path.read_text())
  assert art==again and cov==counts
  prompt=tokenizer.apply_chat_template(pr.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
  full=tokenizer.apply_chat_template(pr.messages()+[dict(role='assistant',content=raw)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
  assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
  assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==raw+'<|im_end|>\n'
  checks.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full),file_reload='MATCHED_NO_GENERATION_COMPILER_AUTHOR'))
 for row in pack['evaluation']:
  pr=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot']);assert pr.messages()==row['messages'] and pr.request_ref==row['request_ref']
  prompt=tokenizer.apply_chat_template(pr.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False);assert len(prompt)+2048<=8192
 assert pack['teachers'][:62]==old['teachers']
 for n,value in [('semantic_units_scope68_plan.json',pack),('semantic_units_scope68_cpu.json',dict(status='CPU68_STRICT_FILE_RELOAD_TOKENIZER_MATCHED',old62_unchanged=True,teachers=68,evaluation=32,new_before=8,rows=checks,model_loads=0,new_generations=0,training_updates=0))]:
  (out/n).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
 print('CPU68 matched;model0/generation0/update0;max full tokens',max(r['full_tokens'] for r in checks))

if __name__=='__main__':main()
