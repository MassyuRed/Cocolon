"""One offline comparison: unchanged C4 positives/retention, local negative-token UL.

Negatives come only from the independent C4 teaching sources, never evaluation raw.
The source/strict adapter/typed builder/author and free generation remain unchanged.
"""
from dataclasses import asdict
import copy
import gc
import hashlib
import html
import importlib.util
import json
import os
from pathlib import Path
import random
import shutil
import signal
import subprocess
import sys
import threading
import time
import traceback
import zipfile

W = Path('/workspace')
ROOT = W / 'analysis-material-v4-target-ul-20261103'
PRIOR = W / 'analysis-material-v4-target4-20261103'
HELPER = W / 'material_v4_target4_execution.py'
HELPER_SHA = '946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
LIMIT = 900
ALPHA = 1.0
SPEECH_IDS = ('AT04', 'AT11', 'AT17', 'AT24')
sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(HELPER) == HELPER_SHA
spec = importlib.util.spec_from_file_location('existing_target4_helpers', HELPER)
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
h.ROOT = ROOT
write = h.write


def prepare():
    started = time.monotonic()
    h.check_api()
    assert not ROOT.exists(), 'do_not_restart_completed_or_partial_root'
    assert sha(h.INITIAL / 'adapter_model.safetensors') == h.WEIGHTS
    assert sha(h.INITIAL / 'adapter_config.json') == h.CONFIG
    manifest = json.loads((PRIOR / 'manifest.json').read_text())
    assert all(sha(PRIOR / k) == v for k, v in manifest.items())
    pack = json.loads((PRIOR / 'pack.json').read_text())
    encoded = json.loads((PRIOR / 'encoded.json').read_text())
    assert len(pack['teachers']) == len(encoded) == 90
    assert pack['update_order'] == list(h.UPDATE_ORDER) and len(pack['evaluation']) == 26
    from serve_emlis_natural_reply import MODEL, REVISION
    from transformers import AutoTokenizer
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, local_files_only=True, trust_remote_code=False)
    pairs = {}
    for row in pack['teachers'][-4:]:
        key = row['id']
        assert key in {'C01', 'C02', 'C03', 'C04'}
        positive = row['assistant_target']
        good = json.loads(positive)
        bad = copy.deepcopy(good)
        children = [u for f in bad['fields'] for u in f['units'] if u['scope_role'] == 'CONTENT_TARGET']
        assert len(children) == 1
        child = children[0]
        noun = child['quote']
        parent = child['parent_quote']
        assert parent.count(noun) == 1
        expanded = parent[parent.index(noun):]
        assert expanded.startswith(noun + 'を') and len(expanded) > len(noun)
        child['quote'] = expanded
        negative = h.canonical(bad)
        restored = copy.deepcopy(bad)
        [u for f in restored['fields'] for u in f['units'] if u['scope_role'] == 'CONTENT_TARGET'][0]['quote'] = noun
        assert h.canonical(restored) == positive and positive != negative
        p = h.prepare_input(row)
        assert p.messages() == row['messages'] and p.request_ref == row['request_ref']
        def tokens(target):
            return tokenizer.apply_chat_template(p.messages() + [dict(role='assistant', content=target)], enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        a, b = tokens(positive), tokens(negative)
        assert a == encoded[key]['input_ids'] and len(b) <= 8192
        d = next(i for i, (x, y) in enumerate(zip(a, b)) if x != y)
        assert a[:d] == b[:d] and d > encoded[key]['loss_start']
        prefix = tokenizer.decode(a[:d], skip_special_tokens=False, clean_up_tokenization_spaces=False)
        good_next = tokenizer.decode(a[:d + 1], skip_special_tokens=False, clean_up_tokenization_spaces=False)[len(prefix):]
        bad_next = tokenizer.decode(b[:d + 1], skip_special_tokens=False, clean_up_tokenization_spaces=False)[len(prefix):]
        # Reject a mere BPE split inside the noun: the shared prefix must contain it fully.
        assert prefix.endswith('"quote":"' + noun), 'negative_does_not_penalize_extension_boundary'
        assert good_next.startswith('"') and bad_next.startswith('を')
        pairs[key] = dict(positive=positive, negative=negative, noun=noun, wrong_extension=expanded,
                          divergence=d, logits_index=d - encoded[key]['loss_start'] - 1,
                          positive_token=a[d], negative_token=b[d], shared_prefix_tail=prefix[-120:],
                          positive_token_text=good_next, negative_token_text=bad_next,
                          assistant_token_count=len(a) - encoded[key]['loss_start'] - 1)
    assert set(pairs) == {'C01', 'C02', 'C03', 'C04'}
    # Small mathematical check only; no model or CUDA initialization.
    import torch
    import torch.nn.functional as F
    v = torch.tensor([0.3, -0.2, 1.1], dtype=torch.float32, requires_grad=True)
    ul = F.softplus(v[1] - torch.logsumexp(torch.cat((v[:1], v[2:])), dim=0))
    expected = -torch.log1p(-v.softmax(0)[1])
    assert torch.allclose(ul, expected, atol=1e-6)
    ul.backward()
    assert v.grad[1] > 0 and v.grad[0] < 0 and v.grad[2] < 0
    assert not torch.cuda.is_initialized()
    ROOT.mkdir()
    shutil.copyfile(HELPER, ROOT / 'existing_binding_helpers.py')
    shutil.copyfile(__file__, ROOT / 'runner.py')
    shutil.copyfile(PRIOR / 'pack.json', ROOT / 'source_pack.json')
    shutil.copyfile(PRIOR / 'encoded.json', ROOT / 'encoded.json')
    (ROOT / 'teacher_check').mkdir()
    teacher_checks = []
    for row in pack['teachers'][-4:]:
        p = h.prepare_input(row)
        def response(raw):
            return AnalysisModelQuotedParentUnitsResponse(p.request_ref, hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(), hashlib.sha256(raw.encode()).hexdigest(), 'stop', raw)
        good_result = h.bind_save(row, p, response(pairs[row['id']]['positive']), ROOT / 'teacher_check', row['id'] + '-positive')
        bad_result = h.bind_save(row, p, response(pairs[row['id']]['negative']), ROOT / 'teacher_check', row['id'] + '-negative')
        assert good_result['typed'] == 'RETURNED' and good_result['typed_nodes'] == 2
        assert bad_result['candidate'] == 'RETURNED' and bad_result['typed'] == 'REJECTED'
        assert bad_result['typed_reason'] == 'analysis_written_role_action_candidate_mismatch'
        teacher_checks.append(dict(id=row['id'],positive=good_result,negative=bad_result))
    (ROOT / 'before').mkdir()
    before = []
    for row in pack['evaluation'][:22]:
        p = h.prepare_input(row)
        request = json.loads((PRIOR / 'before' / (row['id'] + '.request.json')).read_text())
        response = AnalysisModelQuotedParentUnitsResponse(**json.loads((PRIOR / 'before' / (row['id'] + '.response.json')).read_text()))
        assert p.messages() == row['messages'] == request['messages'] and p.request_ref == row['request_ref'] == response.request_ref
        assert response.raw.encode() == (PRIOR / 'before' / (row['id'] + '.raw.txt')).read_bytes()
        for suffix in ('.request.json', '.response.json', '.raw.txt'):
            shutil.copyfile(PRIOR / 'before' / (row['id'] + suffix), ROOT / 'before' / (row['id'] + suffix))
        before.append(dict(id=row['id'], **h.bind_save(row,p,response,ROOT / 'before',row['id'])))
    assert sum(x['candidate'] == 'RETURNED' for x in before) == 20
    assert sum(x['typed'] == 'RETURNED' for x in before) == 14
    write(ROOT / 'before/report.json', dict(calls=before))
    speech = [copy.deepcopy(next(r for r in pack['teachers'] if r['id'] == key)) for key in SPEECH_IDS]
    for row in speech:
        p = h.prepare_input(row)
        assert row['messages'] == p.messages() and row['request_ref'] == p.request_ref
        prompt = tokenizer.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
        assert len(prompt) + 2048 <= 8192
    pack['evaluation'] += speech
    assert len(pack['evaluation']) == 30
    pack.update(status='CPU_PREPARED_NO_MODEL',max_seconds=LIMIT,new_calls=34,model_loads=3,
                objective='CE_mean_plus_C4_first_divergence_UL',ul_alpha=ALPHA,
                baseline_reused='same_Pod_target4_before22_a2e',normal_adoption=False,
                next_training_initial_adoption=False,source_pack_sha256=sha(PRIOR / 'pack.json'),
                fresh_before_ids=list(SPEECH_IDS),speech_retention_is_existing_teacher_not_blind=True)
    write(ROOT / 'pack.json',pack)
    write(ROOT / 'negative_pairs.json',pairs)
    write(ROOT / 'cpu.json',dict(status='CPU_PASSED_NO_MODEL',seconds=time.monotonic()-started,
                               mathematical_gradient_check=True,model_loads=0,model_forwards=0,
                               teacher_checks=teacher_checks,before_candidate=20,before_typed=14,
                               pairs=pairs,runner_sha256=sha(__file__)))
    write(ROOT / 'cpu_manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
    print(json.dumps(dict(status=pack['status'],pairs=4,updates=16,new_calls=34,model_loads=3)))


def generate(phase,deadline):
    from serve_emlis_natural_reply import load_generator
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse
    pack=json.loads((ROOT/'pack.json').read_text())
    rows=pack['evaluation'][-4:] if phase=='before' else pack['evaluation']
    assert len(rows)==(4 if phase=='before' else 30)
    directory=ROOT/phase;directory.mkdir(exist_ok=phase=='before')
    report=json.loads((directory/'report.json').read_text()) if phase=='before' else dict(calls=[])
    report.update(status='STARTED',new_model_loads=1)
    expected=dict(weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG) if phase=='before' else json.loads((ROOT/'train/report.json').read_text())
    adapter=h.INITIAL if phase=='before' else ROOT/'train/adapter'
    assert sha(adapter/'adapter_model.safetensors')==expected['weights_sha256'] and sha(adapter/'adapter_config.json')==expected['config_sha256']
    generator=load_generator(str(adapter),threading.Event(),weights_sha256=expected['weights_sha256'],config_sha256=expected['config_sha256'])
    for row in rows:
        assert time.monotonic()<deadline
        p=h.prepare_input(row);key=row['id']
        assert p.messages()==row['messages'] and p.request_ref==row['request_ref']
        write(directory/(key+'.request.json'),dict(request_ref=p.request_ref,messages_sha256=hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),messages=p.messages()))
        raw,finish=generator(p.messages(),min(deadline,time.monotonic()+45))
        response=AnalysisModelQuotedParentUnitsResponse(p.request_ref,hashlib.sha256(h.canonical(p.messages()).encode()).hexdigest(),hashlib.sha256(raw.encode()).hexdigest(),finish,raw)
        (directory/(key+'.raw.txt')).write_text(raw);write(directory/(key+'.response.json'),asdict(response))
        item=dict(id=key,finish=finish,**h.bind_save(row,p,response,directory,key));report['calls'].append(item);write(directory/'report.json',report)
        assert finish=='stop'
    report['status']='COMPLETE_NOT_ADOPTED_PENDING_FULL_REVIEW';write(directory/'report.json',report)


def train(deadline):
    import torch
    import torch.nn.functional as F
    from transformers import Qwen3_5ForConditionalGeneration
    from peft import PeftModel,get_peft_model_state_dict
    from safetensors.torch import load_file
    from serve_emlis_natural_reply import MODEL,REVISION
    pack=json.loads((ROOT/'pack.json').read_text());encoded=json.loads((ROOT/'encoded.json').read_text());pairs=json.loads((ROOT/'negative_pairs.json').read_text())
    directory=ROOT/'train';directory.mkdir()
    report=dict(status='STARTED',model_loads=1,updates=0,measurement_forwards=0,steps=[],measurements=[])
    random.seed(pack['seed']);torch.manual_seed(pack['seed']);torch.cuda.manual_seed_all(pack['seed'])
    model=None
    try:
        model=Qwen3_5ForConditionalGeneration.from_pretrained(MODEL,revision=REVISION,dtype=torch.bfloat16,device_map={'':0},attn_implementation='sdpa',local_files_only=True,trust_remote_code=False)
        model=PeftModel.from_pretrained(model,h.INITIAL,is_trainable=True,local_files_only=True)
        saved=load_file(h.INITIAL/'adapter_model.safetensors');loaded=get_peft_model_state_dict(model)
        assert len(saved)==len(loaded)==112 and all(torch.equal(saved[k],loaded[k].detach().cpu()) for k in saved)
        del saved,loaded
        params=[p for p in model.parameters() if p.requires_grad]
        assert len(params)==112 and sum(p.numel() for p in params)==3833856
        assert all(m.p==0 for m in model.modules() if isinstance(m,torch.nn.Dropout))
        assert getattr(getattr(model.config,'text_config',model.config),'attention_dropout',None)==0
        torch.cuda.reset_peak_memory_stats()
        model.config.use_cache=False;model.gradient_checkpointing_enable(gradient_checkpointing_kwargs={'use_reentrant':False});model.enable_input_require_grads()
        def loss(key):
            item=encoded[key];ids=torch.tensor([item['input_ids']],device='cuda:0',dtype=torch.long)
            out=model(input_ids=ids,attention_mask=torch.ones_like(ids),logits_to_keep=item['logits_positions'],use_cache=False)
            logits=out.logits[0,:-1,:].float();gold=torch.tensor(item['labels'][item['loss_start']+1:],device='cuda:0',dtype=torch.long)
            assert logits.shape[0]==gold.shape[0]
            ce=F.cross_entropy(logits,gold);ul=ce*0;detail=dict(ce=float(ce.detach()),assistant_tokens=len(gold))
            if key in pairs:
                pair=pairs[key];v=logits[pair['logits_index']];bad=pair['negative_token'];good=pair['positive_token']
                assert int(gold[pair['logits_index']])==good and good!=bad
                ul=F.softplus(v[bad]-torch.logsumexp(torch.cat((v[:bad],v[bad+1:])),dim=0))
                probs=v.detach().softmax(0)
                detail.update(ul=float(ul.detach()),p_negative=float(probs[bad]),p_positive=float(probs[good]))
            total=ce+ALPHA*ul
            assert torch.isfinite(total)
            return total,detail
        def measure(phase):
            model.eval();values={}
            with torch.no_grad():
                for key in pack['measurement_ids']:
                    assert time.monotonic()<deadline
                    total,detail=loss(key);values[key]=detail;report['measurement_forwards']+=1
            report['measurements'].append(dict(phase=phase,values=values));write(directory/'report.json',report)
            return values
        first=measure('before')
        # A small teaching-boundary hypothesis check; do not amplify an absent bad branch.
        assert max(first[k]['p_negative'] for k in pairs)>=0.01,'C4_negative_branch_already_negligible_no_training'
        optimizer=torch.optim.AdamW(params,lr=pack['learning_rate'],weight_decay=0.)
        model.train()
        for step,key in enumerate(pack['update_order'],1):
            assert time.monotonic()<deadline
            optimizer.zero_grad(set_to_none=True);value,detail=loss(key);value.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for p in params)
            norm=torch.nn.utils.clip_grad_norm_(params,1.);assert torch.isfinite(norm);optimizer.step()
            report['updates']=step;report['steps'].append(dict(step=step,id=key,total=float(value.detach()),gradient_norm=float(norm),**detail));write(directory/'report.json',report)
        optimizer.zero_grad(set_to_none=True);optimizer=None
        measure('after')
        assert report['updates']==16 and report['measurement_forwards']==32
        model.save_pretrained(directory/'adapter',safe_serialization=True)
        saved=load_file(directory/'adapter/adapter_model.safetensors');actual=get_peft_model_state_dict(model)
        assert len(saved)==len(actual)==112 and all(torch.isfinite(t).all() and torch.equal(t,actual[k].detach().cpu()) for k,t in saved.items())
        report.update(status='COMPLETE_NOT_ADOPTED',peak_allocated_gib=torch.cuda.max_memory_allocated()/2**30,peak_reserved_gib=torch.cuda.max_memory_reserved()/2**30,weights_sha256=sha(directory/'adapter/adapter_model.safetensors'),config_sha256=sha(directory/'adapter/adapter_config.json'))
    finally:
        try:
            if model is not None and report['status']!='COMPLETE_NOT_ADOPTED':
                model.save_pretrained(directory/'partial_adapter',safe_serialization=True)
        except BaseException:
            report['partial_save_error']=traceback.format_exc()
        finally:
            write(directory/'report.json',report)


def run():
    h.check_api();manifest=json.loads((ROOT/'cpu_manifest.json').read_text());assert all(sha(ROOT/n)==v for n,v in manifest.items())
    assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    with (ROOT/'run_started.json').open('x') as f:json.dump(dict(started=time.time(),max_seconds=LIMIT),f)
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    started=time.monotonic();deadline=started+LIMIT;report=dict(status='STARTED',stages=[],normal_adoption=False)
    try:
        for phase in ('before','train','after'):
            remaining=int(deadline-time.monotonic())-10;assert remaining>0
            with (ROOT/(phase+'.log')).open('x') as log:
                r=subprocess.run(['timeout','--signal=TERM','--kill-after=10',str(remaining),sys.executable,str(ROOT/'runner.py'),phase,str(deadline)],stdout=log,stderr=subprocess.STDOUT)
            report['stages'].append(dict(phase=phase,exit=r.returncode));write(ROOT/'report.json',report)
            assert r.returncode==0,phase
        report['status']='COMPLETE_PENDING_ALL_RAW_REVIEW_NOT_ADOPTED'
    except BaseException:
        report.update(status='FAILED_NO_RETRY_NOT_ADOPTED',traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-started,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG,
                      gpu_after_process=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip(),
                      compute_apps=subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True))
        write(ROOT/'report.json',report)
        write(ROOT/'manifest.json',{str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*') if p.is_file()})
        archive=W/'cocolon-analysis-material-v4-target-ul-originals-20261103.zip'
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(ROOT.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(ROOT)))
        print(json.dumps(dict(status=report['status'],archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive))))


if __name__=='__main__':
    action=sys.argv[1]
    if action=='prepare':prepare()
    elif action=='run':run()
    else:
        def interrupted(*_):raise TimeoutError('bounded_trial_deadline')
        signal.signal(signal.SIGTERM,interrupted)
        (train(float(sys.argv[2])) if action=='train' else generate(action,float(sys.argv[2])))
