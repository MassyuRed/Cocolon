"""One-shot CPU reading of frozen training/inference seams; no model or repair."""
from pathlib import Path
import collections
import gzip
import hashlib
import json
import signal
import subprocess
import time

W = Path('/workspace')
TRAIN = W/'cocolon_rehearsal13_cpu_20261029'
INFER = W/'cocolon_prior_rows2_cpu_20261029'
RUN = W/'cocolon_syntax2b_run_20261030'
OUT = W/'cocolon_alignment_cpu_20261030.json'
FULL = ['FT-BOOK-AFTER-ANSWER', 'FT-SHOP-AFTER-ANSWER']

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def read(p): return json.loads(p.read_text())
def rows(p): return [json.loads(x) for x in p.read_text().splitlines()]
def changed(a, b, path=''):
    if type(a) is not type(b): return [path]
    if isinstance(a, dict):
        result=[]
        for key in sorted(set(a)|set(b)):
            where=path+'.'+key if path else key
            result += changed(a[key],b[key],where) if key in a and key in b else [where]
        return result
    if isinstance(a,list):
        if len(a)!=len(b): return [path]
        return [p for i,(x,y) in enumerate(zip(a,b)) for p in changed(x,y,f'{path}[{i}]')]
    return [] if a==b else [path]

def members(text, start=0):
    """Read complete members only; never append a closer to truncated raw."""
    dec=json.JSONDecoder();pos=start
    while text[pos:pos+1].isspace(): pos+=1
    assert text[pos:pos+1]=='[';pos+=1;result=[]
    while pos<len(text):
        while text[pos:pos+1].isspace(): pos+=1
        if text[pos:pos+1]==']': return result,pos+1,True
        begin=pos
        try: value,end=dec.raw_decode(text,pos)
        except json.JSONDecodeError: return result,begin,False
        result.append((value,begin,end));pos=end
        while text[pos:pos+1].isspace():pos+=1
        if text[pos:pos+1]==',':pos+=1
        elif text[pos:pos+1]==']':return result,pos+1,True
        else:return result,pos,False
    return result,pos,False

def main():
    started=time.perf_counter()
    def expired(*_):raise TimeoutError('bounded_cpu_read_60s')
    signal.signal(signal.SIGALRM,expired);signal.alarm(60)
    assert not OUT.exists()
    expected={TRAIN/'train_messages11.jsonl':'1401ee1144b820bbedbbcf1740133ca7d4330231f0d04732692820723bccff3b',
              TRAIN/'eval_inputs11.json':'6eaa2acd66f359da1d0e77bdb48c1eb483138dbcc50cb30ce7673b6da499b4ea',
              TRAIN/'prepared_cpu.json.gz':'ddf81a26f67e98fff901cc78e405f06919ab9cbe4ad6cbc49908a6b8cf616165',
              INFER/'train_messages11.jsonl':'ef2d70877eb55c9191a2600581e74bd3d51f316473655efc154b7c389cf5485e',
              INFER/'eval_inputs11.json':'8f32141212419628092c69e43dcf3a267651c8b95b20f1ad7e98e064cb41a820'}
    before={str(p):sha(p) for p in expected};assert before=={str(p):h for p,h in expected.items()}
    old={r['id']:r for r in rows(TRAIN/'train_messages11.jsonl')}
    new={r['id']:r for r in rows(INFER/'train_messages11.jsonl')}
    ev={r['case_id']:r for r in read(INFER/'eval_inputs11.json')}
    prepared=json.loads(gzip.decompress((TRAIN/'prepared_cpu.json.gz').read_bytes()))
    run=read(RUN/'run.json');assert run['model_calls_completed']==2 and run['source_commit']=='8842ef2bb88d01a5ff946d1e01455941f23e225f'
    report={'status':'CPU_TRAIN_INFER_ALIGNMENT_READ_COMPLETE','cases':[],'old9':[],
            'input_sha256_before':before,'training_update_order':prepared['order']}
    for cid,row in old.items():
        count=next(c for c in prepared['counts'] if c['case_id']==cid)
        encoded=prepared['encoded'][cid];cut=count['prompt_tokens']
        assert encoded['labels'][:cut]==[-100]*cut
        assert encoded['labels'][cut:]==encoded['input_ids'][cut:]
        assert encoded['input_ids'][cut:].count(248046)==1
        if cid not in FULL:
            assert row==new[cid]
            report['old9'].append({'case_id':cid,'entire_row_unchanged':True,'target_root_type':type(json.loads(row['messages'][-1]['content'])).__name__,'scheduled_updates':prepared['order'].count(cid)})
            continue
        assert row['messages'][0]==new[cid]['messages'][0]
        assert row['messages'][-1]==new[cid]['messages'][-1]
        assert new[cid]['messages'][:-1]==ev[cid]['messages']
        a=json.loads(row['messages'][1]['content']);b=json.loads(new[cid]['messages'][1]['content'])
        # Collapse differences to the five deliberately changed owner fields.
        owners=['prior_adopted_interpretation.meaning_packet.a','prior_adopted_interpretation.meaning_packet.q','prior_adopted_interpretation.meaning_packet.c.claims','prior_adopted_interpretation.meaning_packet.c.relations','output_spec.output_types']
        diffs=changed(a,b);assert all(any(p==o or p.startswith(o+'[') or p.startswith(o+'.') for o in owners) for p in diffs)
        target=json.loads(row['messages'][-1]['content']);c=target[4]
        assert len(target)==5 and len(c)==9 and all(len(x)==10 for x in c[0]) and all(len(x)==7 for x in c[7])
        assert [x[1] for x in c[0]]==a['output_spec']['role_order']
        path=RUN/('before_'+cid+'.jsonl');raw=read(path)
        assert sha(path)==next(x['raw_sha256'] for x in run['calls'] if x['case_id']==cid)
        root,stop,closed=members(raw['raw_text']);assert len(root)==4 and not closed
        pos=root[3][2]
        while raw['raw_text'][pos] in ' \r\n\t,':pos+=1
        cm,stop,cclosed=members(raw['raw_text'],pos)
        report['cases'].append({'case_id':cid,'changed_owner_paths':owners,'exact_changed_paths':diffs,
            'system_unchanged':True,'assistant_teacher_unchanged':True,'inference_matches_derived_eval':True,
            'actual_training_prompt_tokens':cut,'derived_inference_prompt_tokens':raw['input_tokens'],
            'all_teacher_tokens_and_eos_supervised_in_saved_encoding':True,'supervised_tokens':len(encoded['input_ids'])-cut,
            'scheduled_updates':prepared['order'].count(cid),'teacher_claim_count':len(c[0]),'teacher_update_count':len(c[7]),
            'teacher_aliases':[x[0] for x in target[2]],'teacher_p0_declared':any(x[0]=='p0' for x in target[2]),
            'raw_first_claim_list_count':len(cm[0][0]),'raw_claim_rows_all_ten_cells':all(isinstance(x,list) and len(x)==10 for x in cm[0][0]),
            'raw_c_complete_members':len(cm),'raw_root_closed':closed,'raw_c_closed':cclosed,
            'raw_last_incomplete_c_field':'relations' if len(cm)==4 else 'conflicts',
            'raw_full_sha256':sha(path),'actual_finish_reason':raw['finish_reason'],
            'no_gold_values_injected_no_raw_repair':True})
    report.update(seconds=time.perf_counter()-started,input_sha256_after={str(p):sha(p) for p in expected},
        model_loads=0,model_forwards=0,training_updates=0,generations=0,new_cmee_calls=0,
        outcome='NO_NEW_DETERMINISTIC_PREPROCESSING_BUG_FOUND; INTENTIONAL_PROMPT_CHANGE_CONFIRMED; FIELD_MISROUTING_UNRESOLVED',
        limitations=['cached encoding inspected; tokenizer/model not rerun','format mixture and prompt differences are not causal proof','previous TOKEN_LIMIT receipts and 0/2 unchanged','does not authorize another paid trial'],
        product_credit=0,candidate_ready=False,automatic_progression=False)
    assert report['input_sha256_after']==before
    report['adapter_sha256']=sha(W/'cocolon_rehearsal13_run_20261029/adapter/adapter_model.safetensors')
    assert report['adapter_sha256']=='114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66'
    report['gpu_read_only']=subprocess.check_output(['nvidia-smi','--query-gpu=name,memory.total,memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip()
    report['source_sha256']=sha(Path(__file__))
    report['seconds']=time.perf_counter()-started
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');signal.alarm(0)
    print(json.dumps({'status':report['status'],'seconds':report['seconds'],'case_summary':[{k:r[k] for k in ['case_id','actual_training_prompt_tokens','derived_inference_prompt_tokens','supervised_tokens','scheduled_updates','teacher_claim_count','raw_first_claim_list_count','raw_last_incomplete_c_field']} for r in report['cases']], 'old9_unchanged':len(report['old9']),'model_forwards':0,'generations':0,'out_sha256':sha(OUT)},ensure_ascii=False),flush=True)

if __name__=='__main__':main()
