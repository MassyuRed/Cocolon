"""Real tokenizer15 + synthetic rank/causal metrics. No pretrained 4B load."""
import argparse, hashlib, importlib.util, json, os, sys, time
from pathlib import Path
sys.dont_write_bytecode=True

def import_file(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec)
    sys.modules[name]=m;spec.loader.exec_module(m);return m

def verify(pack):
    started=time.monotonic()
    assert os.environ.get('CUDA_VISIBLE_DEVICES')==''
    assert os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
    m=import_file('token_diagnostic_cpu_owner',pack/'run_token_diagnostic.py')
    plan=m.validate_plan(pack)
    assert plan['status']=='PREPARED_AWAITING_MASH_APPROVAL' and not plan['gpu_run_authorized']
    assert not m.OUTPUT.exists()
    rejected=False
    try:m.execute(pack,'3aae98fed9832dede864036c845e33b2d6b5ea72')
    except ValueError as exc:rejected=str(exc)=='execute_refused_new_diagnostic_approval_pending'
    assert rejected and not m.OUTPUT.exists()
    plan,recovery,owner,r,tok,rows,encoded,mappings,comparisons,identities=m.prepare(pack)
    import torch
    assert not torch.cuda.is_initialized()
    class TinyTokenizer:
        def decode(self,ids,**kw):return '|'.join(str(x) for x in ids)
    # A final unused logit row is intentionally wrong. The next-token window
    # starts at prompt-1, includes EOS, and excludes that final ignored row.
    gold=[4,2,1,5]
    logits=torch.tensor([[0.,1.,2.,3.,8.,4.],
                         [0.,1.,2.,7.,3.,4.],
                         [0.,6.,2.,3.,4.,5.],
                         [0.,1.,2.,3.,4.,4.],
                         [90.,0.,0.,0.,0.,0.]])
    mapping=dict(target_count=4,tokens=[dict(target_index=i,full_input_position=3+i,gold_id=g,
        field='EOS' if i==2 else 'candidate.claims',char_span=None,raw_lexeme=None,touched_fields=[])
        for i,g in enumerate(gold)])
    scored=m.score_logits(logits[:-1],gold,mapping,TinyTokenizer())
    assert [x['gold_rank'] for x in scored['tokens']]==[1,4,1,1]
    assert [x['top1_correct'] for x in scored['tokens']]==[True,False,True,False]
    assert scored['first_wrong_target_index']==1 and scored['wrong_target_indices']==[1,3]
    assert 'top5' in scored['tokens'][2] and len(scored['tokens'][2]['top5'])==5
    reference=torch.nn.functional.cross_entropy(logits[:-1],torch.tensor(gold),reduction='none')
    assert max(abs(a-b) for a,b in zip(reference.tolist(),[x['nll'] for x in scored['tokens']],strict=True))<1e-6
    assert abs(scored['mean_nll']-float(reference.mean()))<1e-6
    helper_start,helper_count=r.assistant_loss_window(dict(input_ids=[0,0,0]+gold,labels=[-100]*3+gold))
    assert helper_start==2 and helper_count==5
    # Shape/NaN errors must fail instead of creating plausible metrics.
    negatives=[]
    for label,bad in [('wrong_length',logits),('nan',logits[:-1].clone())]:
        if label=='nan':bad[0,0]=float('nan')
        try:m.score_logits(bad,gold,mapping,TinyTokenizer())
        except ValueError:negatives.append(label)
        else:raise AssertionError('invalid metrics accepted:'+label)
    parser=m.import_file('span_cpu_negative',pack/'candidate_focus_loss.py')
    text=rows[0]['messages'][-1]['content'];prefix=mappings[0]['prompt_tokens']
    corrupt={k:list(v) for k,v in encoded[0].items()};corrupt['input_ids'][prefix]+=1
    try:m.field_map(parser,tok,corrupt,prefix,text)
    except ValueError:negatives.append('teacher_token_changed')
    else:raise AssertionError('changed teacher accepted')
    duplicate=text[:-1]+',"schema_version":"duplicate"}'
    try:parser._SpanParser(duplicate).parse()
    except ValueError:negatives.append('duplicate_json_key')
    else:raise AssertionError('duplicate teacher accepted')
    cases=[]
    for row,item,mapping,comparison in zip(rows,encoded,mappings,comparisons,strict=True):
        counts={}
        for value in mapping['tokens']:counts[value['field']]=counts.get(value['field'],0)+1
        assert sum(counts.values())==len(item['input_ids'])-mapping['prompt_tokens']
        assert counts['EOS']==1
        if row['id'].startswith('TRAIN-'):
            assert comparison['raw_json_text_equals_teacher_except_outer_whitespace']
            assert comparison['substantive_character_divergence'] is None
            assert comparison['difference_kind'] in {'IDENTICAL_THROUGH_EOS','JSON_CONTENT_IDENTICAL_TERMINATION_ONLY'}
            assert comparison['common_prefix_chars']==len(row['messages'][-1]['content'])
            assert comparison['uncompared_template_tail_after_eos']>0
        cases.append(dict(case_id=row['id'],prompt_tokens=mapping['prompt_tokens'],
            full_tokens=len(item['input_ids']),target_tokens=mapping['target_count'],
            field_token_counts=counts,char_spans=mapping['char_spans'],existing_raw_comparison=comparison))
    assert all(m.sha(p)==h for p,h in identities.items())
    assert not torch.cuda.is_initialized() and not m.OUTPUT.exists()
    report=dict(status='CPU_TOKEN_DIAGNOSTIC_READY_REAL_4B_NOT_EXECUTED',
        seconds=time.monotonic()-started,pending_execute_refused_before_output=rejected,
        real_tokenizer_cases=15,case_ids=[x['id'] for x in rows],cases=cases,
        original_json_offset_and_full_chat_token_ids_exact=True,
        cross_field_tokens_preserved_as_boundary=True,synthetic_causal_window_and_ce_exact=True,
        synthetic_top1_rank_ties_and_eos_top5_verified=True,negative_cases_rejected=negatives,
        source_sha256=identities,cuda_initialized=False,real_4b_model_loads=0,
        real_4b_forwards=0,generations=0,optimizer_steps=0,cmee_adoptions=0,sql_operations=0,
        product_credit=0,unknown_generalization_credit=0,automatic_progression=False,
        base_whole_shards_rehashed=False,base_boundary='Inherited fixed revision/index/config/loader; no whole-shard rehash',
        checkpoint_scope='CPU token mapping and synthetic metrics only; no measured 4B token probabilities')
    m.dump(pack/'actual_cpu_check.json',report)
    print(json.dumps({k:report[k] for k in ('status','seconds','real_tokenizer_cases','negative_cases_rejected','real_4b_model_loads','real_4b_forwards','generations','optimizer_steps')}),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True)
    a=p.parse_args();verify(a.pack.resolve())
