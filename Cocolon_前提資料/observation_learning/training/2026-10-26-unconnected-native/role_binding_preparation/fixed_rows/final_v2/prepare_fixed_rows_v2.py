"""One CPU comparison of explicit fixed rows; no runtime receiver or model execution."""
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode = True
VERSION = 'cocolon.cmee.fixed_rows_comparison.v1'
BUNDLE = Path('/workspace/cocolon_auxiliary4_20261029')
ROOT = Path('/workspace/cocolon_auxiliary_fit8_pack_20261029/cmee_current7b9_root_20261029')
ROLE = Path('/workspace/cocolon_role18_pack_20261029')
OUT = Path('/workspace/cocolon_fixed_rows_cpu_v2_20261029')
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']
OLD = ['TRAIN-SERVICE-CHAIR-01-INITIAL', 'TRAIN-SERVICE-CHAIR-01-CORRECTION',
       'TRAIN-SERVICE-CHAIR-02-INITIAL', 'TRAIN-SERVICE-CHAIR-02-CORRECTION',
       'TRAIN-SERVICE-CHAIR-03-INITIAL', 'TRAIN-SERVICE-CHAIR-03-CORRECTION',
       'TRAIN-DAILY-CALM-01-INITIAL', 'TRAIN-DAILY-CALM-02-INITIAL', 'TRAIN-DAILY-CALM-03-INITIAL']
CAP = {FULL[0]:3712, FULL[1]:3584, **{cid:2560 for cid in OLD}}
FIELDS = {
    'root':['v','a','q','c'],
    'q':['id','s','f','t'],
    'c':['claims','conflicts','core','question','relations','schema','unknowns','updates','prose'],
    'claim':['time','cid','ev','kind','mode','polarity','pred','qual','subject','text'],
    'time':['at_source','ev','expr','kind'],
    'mode':['ev','value'],
    'polarity':['ev','scope','value'],
    'pred':['args','surface'],
    'subject':['bind','ev','entity'],
    'relation':['ev','from','polarity','qual','rid','scope','to','type'],
    'update':['ev','op','prior','replace','target_kind','target','$id'],
    'prose':['binds','observation','reception','update_note'],
    'bind':['cr','rr','section'],
}
GRAMMAR = ('Each row is a JSON array in the following fixed field order, not an object. '
           'root=[format,v,a,q,c], format="'+VERSION+'"; v is the original named-wire version STRING. '
           'a=[[alias_name,actual_identity],...] with all names and values explicitly output. '
           'q is a list of q rows. c is one c row. c.claims/relations/updates are lists of their rows. '
           'claim.time/mode/polarity/pred/subject are their rows. c.prose is one prose row; '
           'prose.binds is a list of bind rows, which have cr,rr,section and optionally a fourth ur cell. '
           'All remaining cells are the original JSON values, including arrays, nulls and strings. '
           'All reference names, quotes, axes, IDs, update assignment/order, and all prose remain explicit. '
           'Do not shorten names, omit empty cells, infer values, auto-number IDs, or copy values from another cell. '
           'No row padding, JSON repair, coercion or semantic completion is allowed. '
           'The decoder restores fixed field names only. An invalid row is rejected. '
           'The explicit old v and c.schema values must still be output. Write c.updates before c.prose. '
           'prior_adopted_interpretation remains read-only, in the original named format. '
           'The root starts with ["'+VERSION+'", not an object. Other semantic requirements are unchanged.')


def compact(x):
    return json.dumps(x,ensure_ascii=False,separators=(',',':'),allow_nan=False)


def digest(x):
    return hashlib.sha256(x).hexdigest()


def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec); sys.modules[name]=module; spec.loader.exec_module(module)
    return module


def need(ok,reason):
    if not ok: raise ValueError(reason)


def row(kind,value):
    keys=FIELDS[kind]
    if kind=='bind' and type(value) is dict and list(value)==keys+['ur']: keys=keys+['ur']
    need(type(value) is dict and list(value)==keys,'object_shape_or_order:'+kind)
    return [copy.deepcopy(value[k]) for k in keys]


def obj(kind,value):
    keys=FIELDS[kind]
    need(type(value) is list,'row_not_list:'+kind)
    if kind=='bind' and len(value)==4: keys=keys+['ur']
    need(len(value)==len(keys),'row_arity:'+kind)
    return dict(zip(keys,copy.deepcopy(value)))


def encode(value):
    r=row('root',value)
    need(type(value['a']) is dict,'aliases_not_object')
    r[1]=[[k,v] for k,v in value['a'].items()]
    r[2]=[row('q',q) for q in value['q']]
    c=row('c',value['c'])
    claims=[]
    for claim in value['c']['claims']:
        cr=row('claim',claim)
        for i,k in [(0,'time'),(4,'mode'),(5,'polarity'),(6,'pred'),(8,'subject')]: cr[i]=row(k,claim[k])
        claims.append(cr)
    c[0]=claims
    c[4]=[row('relation',v) for v in value['c']['relations']]
    c[7]=[row('update',v) for v in value['c']['updates']]
    prose=row('prose',value['c']['prose']); prose[0]=[row('bind',v) for v in value['c']['prose']['binds']]
    c[8]=prose; r[3]=c
    return [VERSION]+r


def strings(v):
    return type(v) is list and all(type(x) is str for x in v)


def decode(value):
    need(type(value) is list and len(value)==5 and value[0]==VERSION,'fixed_rows_version_or_root')
    r=obj('root',value[1:]); need(type(r['v']) is str,'v_not_string')
    need(type(r['a']) is list,'aliases_not_rows')
    aliases={}
    for pair in r['a']:
        need(type(pair) is list and len(pair)==2 and all(type(x) is str for x in pair),'alias_shape')
        need(pair[0] not in aliases,'duplicate_alias')
        aliases[pair[0]]=pair[1]
    r['a']=aliases
    need(type(r['q']) is list,'quotes_not_list')
    r['q']=[obj('q',q) for q in r['q']]
    need(all(all(type(v) is str for v in q.values()) for q in r['q']),'quote_cell_type')
    c=obj('c',r['c']); r['c']=c
    need(all(type(c[k]) is list for k in ['claims','conflicts','relations','unknowns','updates']),'candidate_list_type')
    need(type(c['core']) is str and type(c['schema']) is str,'candidate_string_type')
    claims=[]
    for raw in c['claims']:
        claim=obj('claim',raw)
        for k in ['time','mode','polarity','pred','subject']: claim[k]=obj(k,claim[k])
        need(all(type(claim[k]) is str for k in ['cid','kind','text']),'claim_string_type')
        need(strings(claim['ev']) and type(claim['qual']) is list,'claim_list_type')
        need(type(claim['time']['at_source']) is str and strings(claim['time']['ev']) and
             (claim['time']['expr'] is None or type(claim['time']['expr']) is str) and type(claim['time']['kind']) is str,'time_cell_type')
        need(strings(claim['mode']['ev']) and type(claim['mode']['value']) is str,'mode_cell_type')
        need(strings(claim['polarity']['ev']) and strings(claim['polarity']['scope']) and type(claim['polarity']['value']) is str,'polarity_cell_type')
        need(type(claim['pred']['args']) is list and type(claim['pred']['surface']) is str,'predicate_cell_type')
        need(type(claim['subject']['bind']) is str and strings(claim['subject']['ev']),'subject_cell_type')
        claims.append(claim)
    c['claims']=claims
    c['relations']=[obj('relation',v) for v in c['relations']]
    for relation in c['relations']:
        need(strings(relation['ev']) and strings(relation['scope']) and type(relation['qual']) is list,'relation_list_type')
        need(all(type(relation[k]) is str for k in ['from','polarity','rid','to','type']),'relation_string_type')
    c['updates']=[obj('update',v) for v in c['updates']]
    for update in c['updates']:
        need(strings(update['ev']) and strings(update['replace']),'update_list_type')
        need(all(type(update[k]) is str for k in ['op','prior','target_kind','target','$id']),'update_string_type')
    prose=obj('prose',c['prose']); c['prose']=prose
    need(type(prose['binds']) is list and all(type(prose[k]) is str for k in ['observation','reception','update_note']),'prose_cell_type')
    prose['binds']=[obj('bind',v) for v in prose['binds']]
    for bind in prose['binds']:
        need(strings(bind['cr']) and strings(bind['rr']) and type(bind['section']) is str,'bind_cell_type')
        if 'ur' in bind: need(strings(bind['ur']),'update_binding_type')
    compact(r)
    return r


def transform_messages(messages):
    result=copy.deepcopy(messages)
    old=result[0]['content']; pivot=old.index('本人source以外')
    result[0]['content']='JSON配列だけを返してください。出力形式は'+VERSION+'です。'+old[pivot:]
    user=json.loads(result[1]['content']); before=copy.deepcopy(user)
    user['model_output_format']=VERSION
    spec=user['output_spec']
    spec['notation']=spec['notation'].replace('Emit minified named-wire JSON.','Emit minified fixed-rows JSON.')
    spec['shape']=FIELDS
    prior_scope=before['output_spec']['output_types'].split('prior_adopted_interpretation',1)[1].split('The JSON starts',1)[0]
    update_scope='ur lists only this output updates.$id, never a relation ID or gap ID.'
    need(update_scope in before['output_spec']['output_types'],'prior_output_types_changed')
    spec['output_types']=GRAMMAR+' '+update_scope+' prior_adopted_interpretation'+prior_scope+' observation, reception and update_note cells are Japanese strings addressed to the person.'
    for requirement in [
        'Its a/q names are local there; declare every used identity and quote in your own a/q.',
        'updates.prior uses the snapshot alias @p0, not a source alias.',
        update_scope,
    ]:
        need(requirement in spec['output_types'],'reference_scope_requirement_lost')
    result[1]['content']=compact(user)
    allowed={'notation','shape','output_types'}
    need({k:v for k,v in spec.items() if k not in allowed}=={k:v for k,v in before['output_spec'].items() if k not in allowed},'semantic_requirements_changed')
    need({k:v for k,v in user.items() if k not in ['model_output_format','output_spec']}=={k:v for k,v in before.items() if k not in ['model_output_format','output_spec']},'material_or_prior_changed')
    if result[-1]['role']=='assistant': result[-1]['content']=compact(encode(json.loads(result[-1]['content'])))
    return result


def main():
    start=time.monotonic(); OUT.mkdir(exist_ok=False)
    helper=load('fixed_rows_frozen_helper',BUNDLE/'support/run_pilot.py')
    need(digest((BUNDLE/'support/run_pilot.py').read_bytes())=='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d','helper_changed')
    import torch
    from transformers import AutoTokenizer
    need(not torch.cuda.is_initialized(),'cuda_initialized')
    tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
    consumer=load('fixed_rows_existing_consumer',ROLE/'consume_role18.py')
    _,(v,native,Engine,semantic,prep)=consumer.owners(BUNDLE,ROOT)
    trainpath=BUNDLE/'archive/runtime/train_messages.jsonl'; evalpath=BUNDLE/'archive/runtime/eval_inputs.json'
    lines=trainpath.read_text().splitlines(); teachers={json.loads(line)['id']:json.loads(line) for line in lines}
    rawlines={json.loads(line)['id']:line for line in lines}
    evals={r['case_id']:r for r in json.loads(evalpath.read_text())}
    inputs={str(p):digest(p.read_bytes()) for p in [trainpath,evalpath,Path(__file__),BUNDLE/'support/run_pilot.py']}
    report=dict(status='CPU_FIXED_ROWS_COMPARISON_ONLY',format=VERSION,cases=[],old9=[],frozen=inputs,
                model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,
                runtime_integration=False,normal_activation=False,product_credit=0,automatic_progression=False)
    trainout=[]; evalout=[]
    for cid in FULL+OLD:
        source=teachers[cid]; original=source['messages']; evaluation=evals[cid]
        need(original[:-1]==evaluation['messages'],'original_train_eval_mismatch')
        derived=copy.deepcopy(source); ev=copy.deepcopy(evaluation)
        if cid in FULL:
            derived['messages']=transform_messages(original); ev['messages']=transform_messages(evaluation['messages'])
        else:
            need(compact(derived)==compact(source) and compact(ev)==compact(evaluation),'old9_changed')
        need(derived['messages'][:-1]==ev['messages'],'derived_train_eval_mismatch')
        oldenc,oldprompt=helper.encode_training(tokenizer,original,context=8192)
        newenc,newprompt=helper.encode_training(tokenizer,derived['messages'],context=8192)
        counts=dict(case_id=cid,original_prompt_tokens=oldprompt,new_prompt_tokens=newprompt,
                    original_output_with_eos=len(oldenc['input_ids'])-oldprompt,
                    new_output_with_eos=len(newenc['input_ids'])-newprompt,
                    original_full_tokens=len(oldenc['input_ids']),new_full_tokens=len(newenc['input_ids']),
                    old_cap=CAP[cid],new_prompt_plus_old_cap=newprompt+CAP[cid],
                    train_eval_prompt_identical=True,encoded= newenc if cid in FULL else None)
        need(newprompt+CAP[cid]<=8192,'same_cap_context_exceeded:'+cid)
        if cid in FULL:
            originaltext=original[-1]['content'].strip(); packet=helper.strict_json(derived['messages'][-1]['content'])
            named=decode(packet); restored=compact(named)
            need(restored==originaltext,'named_roundtrip_changed_bytes')
            controls=[]
            for text in [originaltext,restored]:
                raw=dict(raw_text=text,finish_reason='stop',provider='CPU_FROZEN_TEACHER_COMPARISON_NOT_MODEL',model=helper.MODEL,revision=helper.REVISION,adapter_revision='comparison_not_model',usage=dict(prompt_tokens=0,completion_tokens=0),seconds=0.)
                outcome,_=consumer.read_raw(v,native,Engine,semantic,prep,cid,raw)
                need(outcome['meaning_adopted'] and outcome['body_available'],'teacher_cmee_failed')
                controls.append(outcome)
            need(controls[0]==controls[1],'teacher_cmee_outcome_changed')
            mutations=[]
            for kind in ['missing_claim_cell','extra_update_cell','duplicate_alias','wrong_quote_type','wrong_version']:
                bad=copy.deepcopy(packet)
                if kind=='missing_claim_cell': bad[4][0][0].pop()
                elif kind=='extra_update_cell': bad[4][7][0].append('extra')
                elif kind=='duplicate_alias': bad[2].append(copy.deepcopy(bad[2][0]))
                elif kind=='wrong_quote_type': bad[3][0][3]=None
                else: bad[0]='other-version'
                try: decode(bad)
                except ValueError as e: mutations.append(dict(mutation=kind,rejected=True,reason=str(e)))
                else: raise ValueError('invalid_row_accepted:'+kind)
            wrong=copy.deepcopy(packet); wrong[4][0][0][0][2]='null'
            need(decode(wrong)['c']['claims'][0]['time']['expr']=='null','null_string_was_repaired')
            missing=copy.deepcopy(packet); missing[4][0].pop()
            need(len(decode(missing)['c']['claims'])==len(named['c']['claims'])-1,'missing_claim_was_filled')
            for suffix,value in [('rows',packet),('roundtrip',named)]: (OUT/(cid+'.'+suffix+'.json')).write_text(compact(value)+'\n')
            counts.update(all_named_values_and_order_byte_equal=True,teacher_cmee_outcomes_equal=True,
                          original_sha256=digest(originaltext.encode()),derived_output_sha256=digest(derived['messages'][-1]['content'].encode()),
                          old_prompt_sha256=digest(compact(original[:-1]).encode()),new_prompt_sha256=digest(compact(ev['messages']).encode()),
                          semantic_requirements_and_material_prior_unchanged=True,decoder_negative_examples=mutations,
                          null_string_not_repaired=True,missing_claim_not_filled=True,teacher_control=controls[0])
            report['cases'].append(counts)
        else:
            counts.pop('encoded'); counts['old_messages_and_teacher_bytes_unchanged']=True
            need(oldenc==newenc,'old9_token_or_mask_changed')
            report['old9'].append(counts)
        trainout.append(compact(derived) if cid in FULL else rawlines[cid]); evalout.append(ev)
    need(all(digest(Path(p).read_bytes())==h for p,h in inputs.items()),'frozen_source_changed')
    need(not torch.cuda.is_initialized(),'cuda_initialized_at_end')
    (OUT/'train_messages.jsonl').write_text('\n'.join(trainout)+'\n')
    (OUT/'eval_inputs.json').write_text(json.dumps(evalout,ensure_ascii=False,indent=2)+'\n')
    report['seconds']=time.monotonic()-start
    (OUT/'cpu_check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({**{k:v for k,v in report.items() if k not in ['cases','old9','frozen']},'cases':[{k:v for k,v in c.items() if k not in ['encoded','teacher_control','decoder_negative_examples']} for c in report['cases']],'old9_unchanged':len(report['old9'])}),flush=True)


if __name__=='__main__': main()
