"""Prepare one private multirecord-wire trial; never load a model or train.

assemble SOURCE_PACK REVIEW_DIR writes synthetic whole-record assemblies only.
prepare API NEW_ROOT --expected-api-head SHA --source-pack PACK
  --old-encoded ENCODED --private-inputs INPUTS --initial-adapter ADAPTER
performs the pinned CPU tokenizer/strict/private-replay preparation.
Only this script, the run script and body-free aggregates are public artifacts.
"""
from __future__ import annotations

import argparse
from contextlib import ExitStack
import copy
from dataclasses import asdict, replace
from datetime import datetime, timezone
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

PACK_SHA = '30afde6a0735aac0b5f23e737b2b80c72e7dd65ba0cdbe4bc791886473f4bbf1'
ENCODED_SHA = 'd439ff2017914fc53acf5b41240c88d9421d64edbe36964758f59d492008919b'
PRIVATE_INPUTS_SHA = 'd4d48826649fd9b7c3822e2d77dc820ae6ecf8e14df939a20066cfc2ed4e4b26'
WEIGHTS = 'a2e62bca49ccccc5eb1d91254cd7f536d2cae0329ef7f80e5ee37208d335eb59'
CONFIG = '006ebf7bef859264b3778126f4a0f6512e1b2a7e6049b09dfcf0d56603ede3a9'
PROFILE = 'selected_material.v7'
OLD_ORDER = ('T01','N01','T02','N08','SC01','N03','OA01','N06','RU01',
    'RB01','N05','RB02','N04','T03','N07','T04','N02','RU02')
SPECS = (
    ('MW01', ('T01','T01')), ('MW02', ('T02','T02')),
    ('MW03', ('T01','T02','T01')), ('MW04', ('T01','T02','T02')),
    ('MW05', ('T01','T02','T01','T02')), ('MW06', ('T01','T02','T02','T01')),
)
CONTROL_IDS = ('AE05','AP07_v7','AP08_v7','OP02_v7')
SOURCE_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/analysis_model_source.py',
    'ai/services/ai_inference/astor_material_snapshots.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tools/serve_emlis_natural_reply.py',
)


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
        separators=(',', ':'), allow_nan=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode('utf-8')).hexdigest()


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(canonical(value)+'\n', encoding='utf-8')
    temporary.replace(path)


def git(api, *args):
    return subprocess.check_output(['git','-C',str(api),*args], text=True).strip()


def _canonical_members(members):
    def key(member):
        original = member['original']
        stamp = datetime.fromisoformat(original['created_at'].replace('Z','+00:00'))
        if stamp.tzinfo is None:
            stamp = stamp.replace(tzinfo=timezone.utc)
        return stamp.astimezone(timezone.utc), original['id']
    return sorted(members, key=key)


def assemble(original):
    """Copy whole existing records; only duplicate record IDs are reassigned."""
    assert len(original['teachers']) == 86 and tuple(original['update_order']) == OLD_ORDER
    # Historical evaluation also names T01/T02 without targets. The immutable
    # training row is authoritative when an ID occurs in both collections.
    by_id = {row['id']:row for row in original['evaluation']+original['teachers']}
    assert original['profile'] == 'selected_material.v4'
    output = []
    for ordinal,(key,source_ids) in enumerate((*SPECS,
            ('HN01',('N01','N02')), ('HX01',('X01','X02'))), 1):
        sources = [by_id[source_id] for source_id in source_ids]
        owner = sources[0]['owner']
        base = copy.deepcopy(sources[0]['snapshot'])
        top = {k:v for k,v in base.items() if k not in {'members','guard'}}
        members, mapping, origins, used = [], [], {}, set()
        for position,(source_id,row) in enumerate(zip(source_ids,sources), 1):
            assert row['owner'] == owner and len(row['snapshot']['members']) == 1
            assert {k:v for k,v in row['snapshot'].items() if k not in {'members','guard'}} == top
            member = copy.deepcopy(row['snapshot']['members'][0])
            assert member['thread'] is None and member['events'] == []
            old_id = member['original']['id']
            duplicate = old_id in used
            new_id = str(UUID(int=900000+ordinal*100+position)) if duplicate else old_id
            assert new_id not in used
            member['original']['id'] = new_id
            before = copy.deepcopy(row['snapshot']['members'][0])
            check = copy.deepcopy(member)
            check['original']['id'] = old_id
            assert check == before
            members.append(member);used.add(new_id);origins[new_id] = source_id
            mapping.append(dict(source_id=source_id, position=position,
                original_record_id=old_id, record_id=new_id, duplicate_reassigned=duplicate,
                original_whole_record_sha256=digest(before), assembled_whole_record_sha256=digest(member)))
        base['members'] = members
        base['guard'] = 'analysis-db-cumulative-v1:'+digest([
            'multirecord-wire.synthetic-complete-assembly.v1',key,owner,top,members])
        row = dict(id=key,owner=owner,snapshot=base,prompt_version=PROFILE,
            source_ids=list(source_ids),origin_by_record=origins,member_mapping=mapping,
            training_use=key.startswith('MW'),
            provenance=('TRAINING_SEEN_WHOLE_RECORD_REASSEMBLY_AFTER_ONLY_FIT' if key.startswith('MW')
                else 'SOURCE_FAMILIAR_TRAINED_N01_N02_NEW_ASSEMBLY' if key=='HN01'
                else 'KNOWN_NONTRAINING_X01_X02_NEARBY_TRANSFER_NOT_BLIND_NEW_ASSEMBLY'),
            fixture_scope='Complete independently assembled synthetic snapshot; no real DB guard or user data.')
        if key.startswith('MW'):
            # Preview uses the exact existing saved-source canonical rule.
            # CPU prepare below rederives field order from actual frozen fields.
            row['assistant_target'] = canonical(dict(fields=[dict(field=i,
                units=copy.deepcopy(json.loads(by_id[origins[m['original']['id']]]['assistant_target'])['fields'][0]['units']))
                for i,m in enumerate(_canonical_members(members),1)]))
        output.append(row)
    assert sum(x['source_ids'].count('T01') for x in output[:6]) == 9
    assert sum(x['source_ids'].count('T02') for x in output[:6]) == 9
    assert len({canonical(x['snapshot']) for x in output[:6]}) == 6
    assert all(by_id[key].get('training_use') is False for key in ('X01','X02'))
    return output


def prepare_row(row):
    """Recreate exact full inputs or a previously bound whole-record child."""
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    prepared = service.prepare_cumulative_category_units(row['owner'],row['snapshot'],
        prompt_version=row['prompt_version'])
    admission.require_analysis_model_observed_scope(prepared.request)
    if 'child_record_refs' in row:
        members = {m.saved_record_ref:m for m in prepared.request.members}
        refs = row['child_record_refs']
        assert len(set(refs)) == len(refs) and all(ref in members for ref in refs)
        prepared = admission.prepare_analysis_model_quoted_parent_units(
            replace(prepared.request,members=tuple(members[ref] for ref in refs)),
            source_guard=prepared.source_guard,prompt_version=prepared.prompt_version)
        admission.require_analysis_model_observed_scope(prepared.request)
    messages = prepared.messages()
    return prepared, dict(id=row['id'],prompt_version=prepared.prompt_version,
        snapshot_sha256=digest(row['snapshot']),request_ref=prepared.request_ref,
        source_guard=prepared.source_guard,messages_sha256=digest(messages),messages=messages)


def _guard_candidate_replay():
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    stack = ExitStack()
    for obj,name in ((MeaningExperienceEngine,'generate'),(compiler,'compile_observed_graph'),
            (compiler,'compile_analysis_unit_candidates'),(author,'realize_analysis_unit_candidates'),
            (admission,'generate_analysis_model_quoted_parent_units')):
        stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved candidate generation')))
    return stack


def _candidate(prepared, target):
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    response = admission.AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
        digest(prepared.messages()),hashlib.sha256(target.encode('utf-8')).hexdigest(),'stop',target)
    value = replace(prepared,response=response)
    artifact = admission.generate_analysis_model_quoted_parent_units(prepared.request,value)
    saved = admission.serialize_analysis_model_quoted_parent_units(value,artifact)
    with _guard_candidate_replay():
        assert admission.reload_analysis_model_quoted_parent_units(prepared,saved) == artifact
    return saved


def _new_target_from_frozen(row, prepared, originals):
    from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as admission
    frozen,fields = admission._model_fields_source(prepared.request,allow_supplements=True)
    by_id = {source['id']:source for source in originals['teachers']}
    packet = []
    canonical_refs = [member.saved_record_ref for member in frozen.members]
    for index,field in enumerate(fields,1):
        ref = field['source'].record_ref
        origin = by_id[row['origin_by_record'][ref]]
        original_member, = origin['snapshot']['members']
        expected_member = copy.deepcopy(original_member)
        expected_member['original']['id'] = ref
        assert expected_member == next(m for m in row['snapshot']['members'] if m['original']['id']==ref)
        original_fields = json.loads(origin['messages'][1]['content'])['fields']
        gold_fields = json.loads(origin['assistant_target'])['fields']
        matches = [(source,gold) for source,gold in zip(original_fields,gold_fields)
            if source['field_path']==field['field_path']]
        source,gold = matches[0]
        assert len(matches)==1 and source['text']==field['text']
        packet.append(dict(field=index,units=copy.deepcopy(gold['units'])))
    assert len(packet)==len(canonical_refs)==len(row['snapshot']['members'])
    target = canonical(dict(fields=packet))
    assert target == row['assistant_target'], 'preview_and_actual_frozen_field_order_differ'
    return target, canonical_refs


def prepare(args):
    api,root = args.api.resolve(),args.root.resolve()
    assert not root.exists(), 'do_not_restart_or_replace_partial_root'
    assert root != api and api not in root.parents, 'output_outside_api_required'
    assert git(api,'rev-parse','HEAD')==args.expected_api_head
    assert not git(api,'status','--porcelain','--untracked-files=no')
    assert sha(args.source_pack)==PACK_SHA and sha(args.old_encoded)==ENCODED_SHA
    assert sha(args.private_inputs)==PRIVATE_INPUTS_SHA
    assert sha(args.initial_adapter/'adapter_model.safetensors')==WEIGHTS
    assert sha(args.initial_adapter/'adapter_config.json')==CONFIG
    sys.dont_write_bytecode=True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    sys.path[:0]=[str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tools')]
    from serve_emlis_natural_reply import MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    assert {name:version(name) for name in PINS}==PINS
    originals=json.loads(args.source_pack.read_text())
    old_encoded=json.loads(args.old_encoded.read_text())
    private=json.loads(args.private_inputs.read_text())
    assert private['schema_version']=='multirecord_wire_private_inputs.v1'
    assert private['source_pack_sha256']==PACK_SHA and private['old_encoded_sha256']==ENCODED_SHA
    assert len(old_encoded)==86
    for lineage in private['lineage'].values():
        assert lineage['weights_sha256']==WEIGHTS and lineage['config_sha256']==CONFIG
        assert lineage['model']==MODEL and lineage['revision']==REVISION and lineage['pins']==PINS
    assemblies=assemble(originals)
    by_id={row['id']:row for row in originals['teachers']}
    old_rows=[copy.deepcopy(by_id[key]) for key in OLD_ORDER]
    for row in old_rows:row['prompt_version']='selected_material.v4'
    teachers=old_rows+assemblies[:6]
    assert len(teachers)==24 and len({row['id'] for row in teachers})==24
    source_hashes={path:sha(api/path) for path in SOURCE_PATHS}
    root.mkdir()
    shutil.copyfile(__file__,root/'prepare.py')
    shutil.copyfile(args.runner,root/'runner.py')
    shutil.copyfile(args.source_pack,root/'original_pack.json')
    shutil.copyfile(args.old_encoded,root/'old_encoded.json')
    shutil.copyfile(args.private_inputs,root/'private_inputs.json')
    write(root/'assemblies.private.json',assemblies)
    tokenizer=AutoTokenizer.from_pretrained(MODEL,revision=REVISION,
        local_files_only=True,trust_remote_code=False)
    encoded,audits={},[]
    for row in teachers:
        prepared,expected=prepare_row(row)
        if row['id'].startswith('MW'):
            target,refs=_new_target_from_frozen(row,prepared,originals)
        else:
            assert row['messages']==expected['messages'] and row['request_ref']==expected['request_ref']
            target=row['assistant_target'];refs=[m.saved_record_ref for m in prepared.request.members]
        messages=expected['messages']
        prompt=tokenizer.apply_chat_template(messages,enable_thinking=False,
            add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tokenizer.apply_chat_template(messages+[dict(role='assistant',content=target)],
            enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192 and full[:len(prompt)]==prompt
        assert 0<len(full)-len(prompt)<=2048 and len(full)<=8192
        assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,
            clean_up_tokenization_spaces=False)==target+'<|im_end|>\n'
        item=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],
            loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
        assert item['labels'][:len(prompt)]==[-100]*len(prompt)
        assert item['labels'][len(prompt):]==full[len(prompt):]
        if row['id'] in OLD_ORDER:
            assert item==old_encoded[row['id']], 'old_v4_encoded_identity_changed'
        encoded[row['id']]=item
        saved=_candidate(prepared,target)
        (root/(row['id']+'.teacher.candidate.json')).write_text(saved,encoding='utf-8')
        row.update(messages=messages,request_ref=prepared.request_ref)
        audits.append(dict(id=row['id'],profile=row['prompt_version'],record_refs=refs,
            field_count=len(json.loads(target)['fields']),prompt_tokens=len(prompt),
            assistant_with_eos_tokens=len(full)-len(prompt),full_tokens=len(full),
            full_prompt_mask=True,strict_candidate=True,private_non_generating_replay=True,
            source_row_sha256=digest(by_id[row['id']]) if row['id'] in OLD_ORDER else None,
            target_sha256=hashlib.sha256(target.encode('utf-8')).hexdigest(),encoded_sha256=digest(item),
            old_encoded_exact=row['id'] in OLD_ORDER))
    evaluation=[]
    for row in assemblies:
        evaluation.append({k:copy.deepcopy(v) for k,v in row.items() if k!='assistant_target'})
    # evaluation is MW6 + HN01/HX01 + old4 controls + known2 batch children.
    reused=[]
    for wrapper in private['reused_before']:
        row=copy.deepcopy(wrapper['row'])
        prepared,expected=prepare_row(row)
        case=wrapper['case'];request=case['request'];response=case['response']
        assert request['request_ref']==expected['request_ref'] and request['messages']==expected['messages']
        assert request['messages_sha256']==expected['messages_sha256']
        assert request['source_guard']==expected['source_guard']
        assert response['request_ref']==expected['request_ref'] and response['messages_sha256']==expected['messages_sha256']
        assert response['finish_reason']=='stop'
        assert hashlib.sha256(response['raw'].encode('utf-8')).hexdigest()==response['raw_sha256']
        assert wrapper['lineage'] in private['lineage']
        evaluation.append(row);reused.append(copy.deepcopy(wrapper))
    assert len(reused)==6 and {x['id'] for x in reused}==set(CONTROL_IDS)|{'B20_C01','B20_C03'}
    assert len(evaluation)==14 and len({row['id'] for row in evaluation})==14
    expected=[]
    for row in evaluation:
        prepared,item=prepare_row(row)
        prompt=tokenizer.apply_chat_template(item['messages'],enable_thinking=False,
            add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt)+2048<=8192
        item.update(input_tokens=len(prompt),reserved_new_tokens=2048,max_context_tokens=8192)
        expected.append(item)
    assert sha(args.source_pack)==PACK_SHA and sha(args.old_encoded)==ENCODED_SHA
    assert sha(args.private_inputs)==PRIVATE_INPUTS_SHA
    assert sha(root/'original_pack.json')==PACK_SHA and sha(root/'old_encoded.json')==ENCODED_SHA
    assert {path:sha(api/path) for path in SOURCE_PATHS}==source_hashes
    assert git(api,'rev-parse','HEAD')==args.expected_api_head
    assert not git(api,'status','--porcelain','--untracked-files=no')
    plan=dict(schema_version='analysis_multirecord_wire_trial_pack.v1',status='CPU_PREPARED_NO_MODEL',
        api_commit=args.expected_api_head,source_hashes=source_hashes,
        initial_adapter=str(args.initial_adapter.resolve()),initial_weights_sha256=WEIGHTS,
        initial_config_sha256=CONFIG,model=MODEL,revision=REVISION,pins=PINS,
        source_pack_sha256=PACK_SHA,old_encoded_sha256=ENCODED_SHA,private_inputs_sha256=sha(args.private_inputs),
        teachers=teachers,encoded_sha256=digest(encoded),seed=20261111,learning_rate=1e-5,
        update_order=list(OLD_ORDER)+[key for key,_ in SPECS],old18_v4_identity_exact=True,
        nll_ids=['T01','T02','N01','N02']+[key for key,_ in SPECS],
        nll_scope='Fixed ten-teacher diagnostic before/after only; not all old18 losses or a semantic-quality substitute.',
        evaluation=evaluation,expected=expected,before_ids=['HN01','HX01'],after_ids=[row['id'] for row in evaluation],
        cached_before_ids=[row['id'] for row in reused],cached_before_exact=True,
        limits=dict(max_seconds=900,max_train_updates=24,max_new_generation=16,max_model_loads=3,
            per_generation_seconds=23,output_tokens=2048,context_tokens=8192,max_measurement_forwards=20),
        normal_adoption=False,next_training_initial_adoption=False,training_repetition=1,
        retry=0,model_loads=0,new_generation=0,new_training=0,api_calls=0,database_access=0,
        interpretation='Wire completeness experiment only; MW seen-fit after-only; HN source-familiar and HX known nontraining diagnostic assemblies are paired separately; no general semantic-quality or full-history/60-second claim.')
    write(root/'pack.json',plan);write(root/'encoded.json',encoded)
    write(root/'teacher_audit.json',audits);write(root/'reused_before.json',reused)
    write(root/'cpu_manifest.json',{str(path.relative_to(root)):sha(path)
        for path in sorted(root.rglob('*')) if path.is_file()})
    print(canonical(dict(status=plan['status'],teachers=24,new_wire_teachers=6,updates=24,
        old18_encoded_exact=True,new_calls_limit=16,loads_limit=3,pack_sha256=sha(root/'pack.json'))))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    sub=parser.add_subparsers(dest='mode',required=True)
    assembly=sub.add_parser('assemble')
    assembly.add_argument('source_pack',type=Path);assembly.add_argument('review_root',type=Path)
    cpu=sub.add_parser('prepare')
    cpu.add_argument('api',type=Path);cpu.add_argument('root',type=Path)
    cpu.add_argument('--expected-api-head',required=True)
    cpu.add_argument('--source-pack',type=Path,required=True)
    cpu.add_argument('--old-encoded',type=Path,required=True)
    cpu.add_argument('--private-inputs',type=Path,required=True)
    cpu.add_argument('--initial-adapter',type=Path,required=True)
    cpu.add_argument('--runner',type=Path,default=Path(__file__).with_name('multirecord_wire_run.py'))
    args=parser.parse_args()
    if args.mode=='assemble':
        assert not args.review_root.exists(), 'do_not_replace_assembled_review'
        assert sha(args.source_pack)==PACK_SHA
        args.review_root.mkdir()
        rows=assemble(json.loads(args.source_pack.read_text()))
        write(args.review_root/'teacher_preview.private.json',rows[:6])
        write(args.review_root/'heldout_assemblies.private.json',rows[6:])
        write(args.review_root/'assembly_manifest.json',dict(status='ASSEMBLED_NOT_TOKENIZER_OR_STRICT_VALIDATED',
            source_pack_sha256=PACK_SHA,files={path.name:sha(path) for path in args.review_root.iterdir() if path.is_file()}))
    else:
        prepare(args)


if __name__=='__main__':
    main()
