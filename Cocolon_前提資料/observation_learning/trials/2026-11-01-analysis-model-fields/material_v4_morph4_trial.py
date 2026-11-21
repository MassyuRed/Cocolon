"""One offline make-verb/polarity comparison; evaluation raw never becomes a teacher.

CPU prepare -> four fresh sources plus four diagnostic prefix forwards -> review.
Only a source-semantic failure on the new sources permits a separate train action.
Training reuses the unchanged existing 16-step plain-CE owner and binding/reader.
"""
from dataclasses import asdict
import copy
import hashlib
import html
import importlib.util
import inspect
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

W = Path('/workspace')
ROOT = W / 'analysis-material-v4-morph4-20261103'
PRIOR = W / 'analysis-material-v4-target4-20261103'
UL = W / 'analysis-material-v4-target-ul-20261103'
HELPER = W / 'material_v4_target4_execution.py'
HELPER_SHA = '946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
ORDER = ('M01','N01','M02','N03','T01','N05','M03','N07','T02','N02','M04','N04','SC01','N06','RU02','N08')
SPEECH = ('AT04','AT11','AT17','AT24')
sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(HELPER) == HELPER_SHA
spec = importlib.util.spec_from_file_location('existing_target4_helpers', HELPER)
h = importlib.util.module_from_spec(spec); spec.loader.exec_module(h)
h.ROOT = ROOT; h.UPDATE_ORDER = ORDER
write = h.write


def response(p, raw, finish='stop'):
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    return AnalysisModelQuotedParentUnitsResponse(p.request_ref, hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(), hashlib.sha256(raw.encode()).hexdigest(), finish, raw)


def page():
    body = '<meta charset="utf-8"><pre>'
    for name in ('cpu.json','before/report.json','prefix_measurements.json','train/report.json','after/report.json'):
        p = ROOT / name
        if p.exists(): body += html.escape(name+'\n'+p.read_text())+'\n'
    body += '</pre>'
    for phase in ('before','after'):
        for p in sorted((ROOT/phase).glob('M*.raw.txt')):
            body += '<h2>'+phase+'/'+p.name+'</h2><pre>'+html.escape(p.read_text())+'</pre>'
    (W/'morph4-review.html').write_text(body)


def prepare():
    start = time.monotonic(); h.check_api()
    assert not ROOT.exists(), 'do_not_restart_completed_or_partial_root'
    assert sha(h.INITIAL/'adapter_model.safetensors') == h.WEIGHTS
    assert sha(h.INITIAL/'adapter_config.json') == h.CONFIG
    from transformers import AutoTokenizer
    from serve_emlis_natural_reply import MODEL, REVISION
    old = json.loads((PRIOR/'pack.json').read_text()); pack = copy.deepcopy(old)
    encoded = json.loads((PRIOR/'encoded.json').read_text())
    assert len(old['teachers']) == 90 and len(old['evaluation']) == 26
    tok = AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    originals = {(m['original']['memo'],m['original']['memo_action']) for r in old['teachers']+old['evaluation'] for m in r['snapshot']['members']}
    ROOT.mkdir(); (ROOT/'teacher_check').mkdir(); (ROOT/'before').mkdir()
    shutil.copyfile(__file__,ROOT/'runner.py'); shutil.copyfile(HELPER,ROOT/'existing_binding_helpers.py')
    shutil.copyfile(PRIOR/'pack.json',ROOT/'source_pack.json')
    teachers=[]; checks=[]
    for i,(rn,an) in enumerate(((False,False),(False,True),(True,False),(True,True)),1):
        role='自分の役割は受付係'+('ではなかった' if rn else 'だった')
        action='自分は衣装を'+('作らなかった' if an else '作った')
        assert (role+'。',action+'。') not in originals
        snap=copy.deepcopy(old['teachers'][0]['snapshot']); snap['tier']='plus'; snap['members']=snap['members'][:1]
        m=snap['members'][0]; m['thread']=None; m['events']=[]
        m['original'].update(id=f'00000000-0000-0000-0000-{74000+i:012}',memo=role+'。',memo_action=action+'。',category=['生活'],emotions=['平穏'],emotion_details=[])
        rq=[dict(kind='EXPLICIT_ACTOR',quote='自分')]; aq=copy.deepcopy(rq)
        if rn: rq.append(dict(kind='NEGATION',quote='ではなかった'))
        if an: aq.append(dict(kind='NEGATION',quote='なかった'))
        target=h.canonical(dict(fields=[dict(field=1,units=[dict(node_kind='ROLE',parent_quote=None,qualifiers=rq,quote=role,scope_role=None)]),dict(field=2,units=[dict(node_kind='ACTION_OR_NONACTION',parent_quote=None,qualifiers=aq,quote=action,scope_role=None),dict(node_kind=None,parent_quote=action,qualifiers=[],quote='衣装',scope_role='CONTENT_TARGET')])]))
        row=dict(id=f'M{i:02}',owner=old['teachers'][0]['owner'],snapshot=snap,with_action=True,training_use=True,kind='KAREN_INDEPENDENT_MAKE_VERB_POLARITY_SOURCE',assistant_target=target)
        p=h.prepare_input(row); row.update(messages=p.messages(),request_ref=p.request_ref)
        prompt=tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        full=tok.apply_chat_template(p.messages()+[dict(role='assistant',content=target)],enable_thinking=False,add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)]==prompt and len(prompt)+2048<=8192 and len(full)<=8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False)==target+'<|im_end|>\n'
        item=h.bind_save(row,p,response(p,target),ROOT/'teacher_check',row['id'])
        assert item['candidate']==item['typed']=='RETURNED' and item['typed_nodes']==2
        checks.append(dict(id=row['id'],**item)); teachers.append(row)
        encoded[row['id']]=dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,logits_positions=len(full)-len(prompt)+1)
    speech=[copy.deepcopy(next(r for r in old['teachers'] if r['id']==key)) for key in SPEECH]
    before=[]
    for row in old['evaluation'][:22]+speech:
        directory=UL/'before' if row['id'] in SPEECH else PRIOR/'before'; key=row['id']; p=h.prepare_input(row)
        req=json.loads((directory/(key+'.request.json')).read_text()); res=json.loads((directory/(key+'.response.json')).read_text())
        assert req['messages']==p.messages()==row['messages'] and req['request_ref']==p.request_ref==row['request_ref']==res['request_ref']
        assert hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest()==res['messages_sha256']
        raw=(directory/(key+'.raw.txt')).read_text(); assert raw==res['raw'] and hashlib.sha256(raw.encode()).hexdigest()==res['raw_sha256']
        for suffix in ('.request.json','.response.json','.raw.txt'): shutil.copyfile(directory/(key+suffix),ROOT/'before'/(key+suffix))
        before.append(dict(id=key,**h.bind_save(row,p,response(p,raw),ROOT/'before',key)))
    assert sum(x['typed']=='RETURNED' for x in before)==14
    write(ROOT/'before/report.json',dict(calls=before))
    pack['teachers']+=teachers; pack['evaluation']=old['evaluation'][:22]+speech+teachers
    assert pack['teachers'][:90]==old['teachers'] and len(pack['teachers'])==94 and len(pack['evaluation'])==30
    pack.update(update_order=list(ORDER),measurement_ids=list(ORDER),normal_adoption=False,next_training_initial_adoption=False,source_pack_sha256=sha(PRIOR/'pack.json'))
    write(ROOT/'pack.json',pack);write(ROOT/'encoded.json',encoded)
    prefixes=prefix_inputs(tok,pack)
    write(ROOT/'prefix_inputs.json',prefixes)
    write(ROOT/'cpu.json',dict(status='CPU_PASSED_NO_MODEL',new_teachers=4,checks=checks,reused_before=26,prefixes=len(prefixes),model_loads=0,model_forwards=0,seconds=time.monotonic()-start,runner_sha256=sha(__file__)))
    write(ROOT/'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()});page()


def prefix_inputs(tok, pack):
    """CPU-only diagnostic preparation; no edited raw is admitted or taught."""
    rows={r['id']:r for r in pack['evaluation']}; data=[]
    for key in ('X03','X04'):
        row=rows[key]; raw=(ROOT/'before'/(key+'.raw.txt')).read_text(); obj=json.loads(raw)
        assert raw.strip()==h.canonical(obj), 'raw_prefix_is_not_canonical'
        original=obj['fields'][1]['units'][0]['qualifiers'][1]['quote']
        for neg in ('なかった','作らなかった'):
            changed=copy.deepcopy(obj);changed['fields'][1]['units'][0]['qualifiers'][1]['quote']=neg
            s=h.canonical(changed); marker='"qualifiers":[],"quote":"模型'
            assert s.count(marker)==1
            prefix=s[:s.index(marker)+len(marker)]
            if neg==original:assert raw.startswith(prefix)
            prompt=tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,tokenize=False)
            base=tok.encode(prompt+prefix,add_special_tokens=False)
            good=tok.encode(prompt+prefix+'","scope_role"',add_special_tokens=False)
            bad=tok.encode(prompt+prefix+'を作った',add_special_tokens=False)
            assert good[:len(base)]==bad[:len(base)]==base and len(base)<8192
            data.append(dict(id=key,negation_quote=neg,actual_raw_prefix=neg==original,retokenized_prefix_sha256=hashlib.sha256(prefix.encode()).hexdigest(),prefix=prefix,input_ids=base,good_id=good[len(base)],bad_id=bad[len(base)],good_token=tok.decode([good[len(base)]]),bad_token=tok.decode([bad[len(base)]])))
    assert len(data)==4
    return data


def prefix_measure(generator, pack, deadline):
    """Diagnostic only. Re-tokenized prefixes are not original generation tokens."""
    import torch
    env=inspect.getclosurevars(generator).nonlocals; model=env['model']; tok=env['tokenizer']
    prepared=json.loads((ROOT/'prefix_inputs.json').read_text());assert prepared==prefix_inputs(tok,pack)
    data=[]
    for item in prepared:
        assert time.monotonic()<deadline
        ids=torch.tensor([item['input_ids']],device=model.device,dtype=torch.long)
        with torch.inference_mode(): logits=model(input_ids=ids,attention_mask=torch.ones_like(ids),logits_to_keep=1,use_cache=False).logits[0,-1,:].float();probs=logits.softmax(0)
        top=probs.topk(5)
        data.append(dict(**{k:v for k,v in item.items() if k!='input_ids'},p_noun_end=float(probs[item['good_id']]),p_wrong_extension=float(probs[item['bad_id']]),top=[dict(token=int(t),text=tok.decode([int(t)]),probability=float(v)) for t,v in zip(top.indices,top.values)]))
        write(ROOT/'prefix_measurements.json',dict(status='DIAGNOSTIC_ONLY_NOT_TRAINING',forwards=len(data),values=data))


def generate(phase, deadline):
    from serve_emlis_natural_reply import load_generator
    pack=json.loads((ROOT/'pack.json').read_text()); rows=pack['evaluation'][-4:] if phase=='before' else pack['evaluation']
    directory=ROOT/phase;directory.mkdir(exist_ok=phase=='before')
    report=json.loads((directory/'report.json').read_text()) if phase=='before' else dict(calls=[])
    report.update(status='STARTED',new_model_loads=1)
    expected=dict(weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG) if phase=='before' else json.loads((ROOT/'train/report.json').read_text())
    if phase!='before':assert expected['status']=='COMPLETE_NOT_ADOPTED' and expected['updates']==16 and expected['measurement_forwards']==32
    adapter=h.INITIAL if phase=='before' else ROOT/'train/adapter'
    generator=load_generator(str(adapter),threading.Event(),weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    for row in rows:
        assert time.monotonic()<deadline
        p=h.prepare_input(row); key=row['id']; assert p.messages()==row['messages'] and p.request_ref==row['request_ref']
        write(directory/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
        raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45));res=response(p,raw,finish)
        (directory/(key+'.raw.txt')).write_text(raw);write(directory/(key+'.response.json'),asdict(res))
        assert finish=='stop'
        report['calls'].append(dict(id=key,finish=finish,**h.bind_save(row,p,res,directory,key)));write(directory/'report.json',report);page()
    if phase=='before': prefix_measure(generator,pack,deadline)
    report.update(status='COMPLETE_PENDING_SEMANTIC_REVIEW_NOT_ADOPTED');write(directory/'report.json',report);page()


def main():
    action=sys.argv[1]
    if action=='prepare':prepare();return
    h.check_api(); assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    manifest=json.loads((ROOT/'cpu_manifest.json').read_text())
    fixed=manifest if action=='before' else {n:manifest[n] for n in ('pack.json','encoded.json','source_pack.json','runner.py','existing_binding_helpers.py','prefix_inputs.json')}
    assert all(sha(ROOT/n)==value for n,value in fixed.items())
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    with (ROOT/(action+'.started.json')).open('x') as f:json.dump(dict(started=time.time()),f)
    start=time.monotonic();deadline=start+300
    def interrupted(*_):raise TimeoutError('bounded_morph4_trial')
    signal.signal(signal.SIGTERM,interrupted);signal.signal(signal.SIGALRM,interrupted);signal.setitimer(signal.ITIMER_REAL,deadline-start)
    result=dict(status='STARTED',normal_adoption=False)
    try:
        if action=='train':
            assert (ROOT/'semantic_training_permission.json').exists(),'root_semantic_review_required'
            h.train_phase(deadline)
        else:generate(action,deadline)
        result['status']='COMPLETE_NOT_ADOPTED'
    except BaseException:result.update(status='FAILED_NO_RETRY',traceback=traceback.format_exc());raise
    finally:
        result.update(seconds=time.monotonic()-start,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG)
        write(ROOT/(action+'.exit.json'),result);page()
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file() and p.name!='manifest.json'})


if __name__=='__main__':main()
