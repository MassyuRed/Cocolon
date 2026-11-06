"""CPU-only preparation of one explicit fact/wish teaching comparison.

Reuses the original a2e lineage, old v4 encodings, existing v7 parser/consumer,
and local pinned tokenizer. New synthetic inputs are caller-provided private
data. No model load, training, network request, or production mutation occurs.
"""
from __future__ import annotations
import argparse
from contextlib import ExitStack
import copy
from dataclasses import asdict, replace
import hashlib
from importlib.metadata import version
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from unittest.mock import patch
from uuid import UUID

API_SHA='5c9606507d296adfe69fe0350c84a5d5deab585b'
PACK_SHA='30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
ENCODED_SHA='d439ff2017914fc53acf5b41240c88d9421d64edbe36964758f59d492008919b'
WIRE_BEFORE_SHA='93dd14889756de4c0c1f39bf62ecf582cf4f03949a8fa0a182eeb0ecfa5f9432'
CARD_PACK_SHA='1768fed4f2537ef15213e36bd13278156382a0f9bcdd0d84186db4770cf04d1f'
WEIGHTS='a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG='006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE='selected_material.v7'
KEEP=('T01','T02','N01','N08','SC01','OA01','RU01','RB01','RB02','RU02')
WISH=('AT04','AT12','AT19','AT29','BT08')
ORDER=('T01','F01','AT04','N01','F02','AT12','T02','F03','AT19','N08','F04',
    'AT29','SC01','F05','BT08','OA01','F06','RU01','F07','RB01','F08','RB02','RU02')
NLL_IDS=(*WISH,'F02','F03','F04','F05','T01')
LIMITS=dict(max_seconds=900,max_train_updates=23,max_new_generation=19,max_model_loads=3,
    per_generation_seconds=23,output_tokens=2048,context_tokens=8192,max_measurement_forwards=20)
SOURCE_PATHS=('ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_model_source.py','ai/services/ai_inference/astor_material_snapshots.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tools/serve_emlis_natural_reply.py')
WIRE_ROOT=Path('/workspace/analysis-multirecord-wire24-20261105')
CARD_ROOT=Path('/workspace/analysis-cardinality123-20261106')
INITIAL=Path('/workspace/analysis-material-v4-pair8-20261103/train/adapter')
OPTIONAL_ROOT=Path('/workspace/analysis-optional-kernel-control-v2-20261105')

def canonical(value):
    return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def digest(value):return hashlib.sha256(canonical(value).encode()).hexdigest()
def read(path):return json.loads(Path(path).read_text(encoding='utf-8'))
def write(path,value):
    path=Path(path);tmp=path.with_name(path.name+'.tmp');tmp.write_text(canonical(value)+'\n',encoding='utf-8');tmp.replace(path)
def git(api,*args):return subprocess.check_output(['git','-C',str(api),*args],text=True).strip()

def prepare_row(row):
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    prepared=service.prepare_cumulative_category_units(row['owner'],row['snapshot'],prompt_version=row['prompt_version'])
    admission.require_analysis_model_observed_scope(prepared.request)
    messages=prepared.messages()
    return prepared,dict(id=row['id'],prompt_version=prepared.prompt_version,
        snapshot_sha256=digest(row['snapshot']),request_ref=prepared.request_ref,
        source_guard=prepared.source_guard,messages_sha256=digest(messages),messages=messages)

def _guard_candidate_replay():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    stack=ExitStack()
    for owner,name in ((MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
        (author,'realize_analysis_unit_candidates'),(admission,'generate_analysis_model_quoted_parent_units')):
        stack.enter_context(patch.object(owner,name,side_effect=AssertionError('saved candidate generation')))
    return stack

def _candidate(prepared,target):
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    response=admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,digest(prepared.messages()),
        hashlib.sha256(target.encode()).hexdigest(),'stop',target)
    bound=replace(prepared,response=response)
    candidate=admission.generate_analysis_model_quoted_parent_units(prepared.request,bound)
    state=admission.serialize_analysis_model_quoted_parent_units(bound,candidate)
    with _guard_candidate_replay():assert admission.reload_analysis_model_quoted_parent_units(prepared,state)==candidate
    return state,bound

def _new_row(spec,template,ordinal):
    snapshot=copy.deepcopy(template['snapshot'])
    assert len(snapshot['members'])==1
    member=snapshot['members'][0]
    assert member['thread'] is None and member['events']==[]
    member['original'].update(id=str(UUID(int=920000+ordinal)),memo=spec['memo'],memo_action=spec['memo_action'])
    snapshot['guard']='analysis-db-cumulative-v1:'+digest(['fact-wish.independent.v1',spec['id'],snapshot])
    return dict(id=spec['id'],owner=template['owner'],snapshot=snapshot,prompt_version=PROFILE,
        training_use=spec['training_use'],provenance='KAREN_SYNTHETIC_INDEPENDENT_CONTRAST',
        typed_map_expected=spec['typed_map_expected'],expected_roots=copy.deepcopy(spec['roots']))

def _new_target(spec,prepared):
    fields=json.loads(prepared.messages()[1]['content'])['fields'];packet=[]
    assert len(fields)==(2 if spec['memo_action'] else 1)
    for f in fields:
        roots=[r for r in spec['roots'] if r['field_path']==f['field_path']]
        assert f['text']==spec[f['field_path']] and roots
        assert ''.join(r['quote']+'。' for r in roots)==f['text']
        units=[]
        for r in roots:
            qualifiers=[dict(kind='EXPLICIT_ACTOR',quote='私')]
            if r['negative_quote']:qualifiers.append(dict(kind='NEGATION',quote=r['negative_quote']))
            units.append(dict(quote=r['quote'],node_kind=r['node_kind'],parent_quote=None,scope_role=None,qualifiers=qualifiers))
            units.append(dict(quote=r['target'],node_kind=None,parent_quote=r['quote'],scope_role='CONTENT_TARGET',qualifiers=[]))
        packet.append(dict(field=f['field'],units=units))
    return canonical(dict(fields=packet))

def _bodies(snapshot):
    return tuple((m['original']['memo'],m['original']['memo_action']) for m in snapshot['members'])

def prepare(args):
    api,root=args.api.resolve(),args.root.resolve()
    assert not root.exists() and not Path(str(root)+'.zip').exists()
    assert git(api,'rev-parse','HEAD')==API_SHA and not git(api,'status','--porcelain','--untracked-files=no')
    original_path=WIRE_ROOT/'original_pack.json';old_encoded_path=WIRE_ROOT/'old_encoded.json'
    assert sha(original_path)==PACK_SHA and sha(old_encoded_path)==ENCODED_SHA
    assert sha(WIRE_ROOT/'reused_before.json')==WIRE_BEFORE_SHA and sha(CARD_ROOT/'pack.json')==CARD_PACK_SHA
    assert sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tools')]
    import analysis_cumulative_service as service
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    assert {k:version(k) for k in PINS}==PINS
    originals=read(original_path);old_encoded=read(old_encoded_path);inputs=read(args.inputs)
    assert len(originals['teachers'])==len(old_encoded)==86
    assert inputs['schema_version']=='analysis_fact_wish_contrasts.v1'
    assert len(inputs['new_teachers'])==8 and len(inputs['evaluation'])==6
    by_id={r['id']:r for r in originals['teachers']}
    new_specs=inputs['new_teachers'];eval_specs=inputs['evaluation']
    assert [x['id'] for x in new_specs]==[f'F{i:02}' for i in range(1,9)]
    assert [x['id'] for x in eval_specs]==[f'E{i:02}' for i in range(1,7)]
    seen={_bodies(row['snapshot']) for row in originals['teachers']+originals['evaluation']}
    card=read(CARD_ROOT/'pack.json');seen.update(_bodies(r['snapshot']) for r in card['cases'])
    assert all(((s['memo'],s['memo_action']),) not in seen for s in new_specs+eval_specs)
    assert {s['memo']+'\0'+s['memo_action'] for s in new_specs}.isdisjoint({s['memo']+'\0'+s['memo_action'] for s in eval_specs})
    root.mkdir();shutil.copyfile(__file__,root/'prepare.py');shutil.copyfile(args.runner,root/'runner.py')
    for src,name in ((original_path,'original_pack.json'),(old_encoded_path,'old_encoded.json'),(args.inputs,'inputs.private.json')):
        shutil.copyfile(src,root/name)
    source_hashes={p:sha(api/p) for p in SOURCE_PATHS}
    old_rows=[dict(copy.deepcopy(by_id[k]),prompt_version='selected_material.v4') for k in KEEP]
    wish_rows=[dict(copy.deepcopy(by_id[k]),prompt_version=PROFILE,original_v4_row_sha256=digest(by_id[k])) for k in WISH]
    new_rows=[_new_row(s,by_id['T01'],i) for i,s in enumerate(new_specs,1)]
    teachers=old_rows+wish_rows+new_rows
    assert len(teachers)==len(set(ORDER))==23 and set(ORDER)=={r['id'] for r in teachers}
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    encoded,audits={},[]
    for row in teachers:
        prepared,expected=prepare_row(row)
        if row['id'].startswith('F'):
            spec=next(s for s in new_specs if s['id']==row['id']);target=_new_target(spec,prepared)
        else:target=row['assistant_target']
        if row['id'] in KEEP:
            assert expected['messages']==row['messages'] and expected['request_ref']==row['request_ref']
        state,bound=_candidate(prepared,target)
        (root/(row['id']+'.teacher.candidate.private.json')).write_text(state,encoding='utf-8')
        if row['id'].startswith('F'):
            artifact,coverage=service.build_cumulative_map(row['owner'],row['snapshot'],model_input=bound)
            assert (artifact is not None)==row['typed_map_expected'], 'new_teacher_map_scope_'+row['id']
            if artifact:
                normal,normal_counts=service.build_cumulative_map(row['owner'],row['snapshot'])
                assert normal is not None and artifact.graph==normal.graph and coverage==normal_counts
        messages=expected['messages']
        prompt=tokenizer.apply_chat_template(messages,enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tokenizer.apply_chat_template(messages+[dict(role='assistant',content=target)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192 and full[:len(prompt)]==prompt and 0<len(full)-len(prompt)<=2048
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==target+'<|im_end|>\n'
        item=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        if row['id'] in KEEP:assert item==old_encoded[row['id']]
        encoded[row['id']]=item;row.update(messages=messages,request_ref=prepared.request_ref,assistant_target=target)
        audits.append(dict(id=row['id'],profile=row['prompt_version'],strict_candidate=True,non_generating_replay=True,
            original_v4_encoded_exact=row['id'] in KEEP,prompt_tokens=len(prompt),assistant_with_eos_tokens=len(full)-len(prompt),
            target_sha256=hashlib.sha256(target.encode()).hexdigest(),encoded_sha256=digest(item)))
    evaluation=[_new_row(s,by_id['T01'],50+i) for i,s in enumerate(eval_specs,1)]
    # Independent gold remains evaluation-only. Its CPU validation is not a model result.
    for row,spec in zip(evaluation,eval_specs):
        prepared,_=prepare_row(row);target=_new_target(spec,prepared);_,bound=_candidate(prepared,target)
        artifact,coverage=service.build_cumulative_map(row['owner'],row['snapshot'],model_input=bound)
        assert (artifact is not None)==row['typed_map_expected'], 'new_evaluation_map_scope_'+row['id']
        if artifact:
            normal,normal_counts=service.build_cumulative_map(row['owner'],row['snapshot'])
            assert normal is not None and artifact.graph==normal.graph and coverage==normal_counts
        row['gold_typed_map_verified']=True
        row['review_gold']=target
    cached=[]
    for wrapper in read(WIRE_ROOT/'reused_before.json'):
        if wrapper['id'] in ('AE05','AP07_v7','AP08_v7','OP02_v7'):
            row=copy.deepcopy(wrapper['row']);prepared,expected=prepare_row(row)
            request=wrapper['case']['request'];response=wrapper['case']['response']
            assert expected['messages']==request['messages'] and expected['request_ref']==response['request_ref']
            assert digest(expected['messages'])==response['messages_sha256'] and hashlib.sha256(response['raw'].encode()).hexdigest()==response['raw_sha256']
            evaluation.append(row);cached.append(dict(id=row['id'],row=row,request=request,response=response))
    assert len(cached)==4
    for old in card['cases']:
        row=dict(id=old['id'],owner=card['owner'],snapshot=old['snapshot'],prompt_version=PROFILE,provenance='KNOWN_CARDINALITY_DIAGNOSTIC_NOT_BLIND')
        prepared,expected=prepare_row(row);response=read(CARD_ROOT/(row['id']+'.response.json'))
        assert expected['messages']==old['input']['messages'] and expected['request_ref']==response['request_ref']
        assert digest(expected['messages'])==response['messages_sha256'] and hashlib.sha256(response['raw'].encode()).hexdigest()==response['raw_sha256']
        evaluation.append(row);cached.append(dict(id=row['id'],row=row,request=dict(request_ref=prepared.request_ref,messages=expected['messages'],messages_sha256=digest(expected['messages']),source_guard=prepared.source_guard,prompt_version=PROFILE),response=response))
    expected=[]
    for row in evaluation:
        prepared,item=prepare_row(row)
        tokens=tokenizer.apply_chat_template(item['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)+2048<=8192
        item['input_tokens']=len(tokens);expected.append(item)
    assert len(evaluation)==13 and len(cached)==7
    write(root/'encoded.json',encoded);write(root/'teacher_audit.json',audits);write(root/'reused_before.json',cached)
    optional=read(OPTIONAL_ROOT/'pack.json')
    pack=dict(schema_version='analysis_fact_wish_contrast_trial.v1',status='CPU_PREPARED_NO_MODEL',api_commit=API_SHA,
        source_hashes=source_hashes,initial_adapter=str(INITIAL),initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,
        model=MODEL,revision=REVISION,pins=PINS,source_pack_sha256=PACK_SHA,old_encoded_sha256=ENCODED_SHA,
        private_inputs_sha256=sha(args.inputs),teachers=teachers,evaluation=evaluation,expected=expected,
        update_order=list(ORDER),old_keep_ids=list(KEEP),existing_wish_ids=list(WISH),new_teacher_ids=[s['id'] for s in new_specs],
        nll_ids=list(NLL_IDS),before_ids=[s['id'] for s in eval_specs],after_ids=[r['id'] for r in evaluation],
        cached_before_ids=[r['id'] for r in cached],seed=20261114,learning_rate=1e-5,limits=LIMITS,
        normal_adoption=False,next_training_initial_adoption=False,retry=0,optional_target=optional['target_root'],
        optional_generation_only=True,training_uses_unchanged_base_environment=True,previous_optional_root=str(OPTIONAL_ROOT),
        nll_scope='Ten fixed diagnostic teacher losses only; not free-generation quality or all-retention loss.',
        interpretation='Independent morphology/field contrasts plus known raw keepers, each planned model call once; no normal/full-history/60-second or general-language claim.')
    write(root/'pack.json',pack)
    assert {p:sha(api/p) for p in SOURCE_PATHS}==source_hashes and git(api,'rev-parse','HEAD')==API_SHA
    assert sha(INITIAL/'adapter_model.safetensors')==WEIGHTS and sha(INITIAL/'adapter_config.json')==CONFIG
    write(root/'cpu_manifest.json',{str(p.relative_to(root)):sha(p) for p in sorted(root.rglob('*')) if p.is_file()})
    print(canonical(dict(status=pack['status'],teachers=23,new_teachers=8,existing_wish_v7_variants=5,old_v4_exact=10,
        before=6,after=13,cached_before=7,training=0,model_loads=0,pack_sha256=sha(root/'pack.json'))))

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('api',type=Path);parser.add_argument('root',type=Path)
    parser.add_argument('--inputs',type=Path,required=True);parser.add_argument('--runner',type=Path,required=True)
    args=parser.parse_args();sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    prepare(args)
if __name__=='__main__':main()
