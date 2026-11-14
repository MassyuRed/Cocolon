"""CPU-only comparison candidate: reversible record columns, no model or runtime integration."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import sys
import time

os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
sys.dont_write_bytecode=True
BUNDLE=Path('/workspace/cocolon_auxiliary4_20261029')
ROLE=Path('/workspace/cocolon_role18_pack_20261029')
ROOT=Path('/workspace/cocolon_auxiliary_fit8_pack_20261029/cmee_current7b9_root_20261029')
OUT=Path('/workspace/cocolon_carrier_cpu_20261029')
IDS=['FT-BOOK-AFTER-ANSWER','FT-SHOP-AFTER-ANSWER']
VERSION='cocolon.lossless_record_comparison.v1'

def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec);sys.modules[name]=module;spec.loader.exec_module(module)
    return module

def encode(value):
    columns=[]
    def pack(x):
        if isinstance(x,dict):
            keys=list(x)
            if keys not in columns:columns.append(keys)
            return {'@':[columns.index(keys),[pack(x[k]) for k in keys]]}
        if isinstance(x,list):return [pack(v) for v in x]
        return x
    records=pack(value)
    return dict(v=VERSION,columns=columns,records=records)

def decode(carrier):
    assert set(carrier)=={'v','columns','records'} and carrier['v']==VERSION
    columns=carrier['columns']
    assert isinstance(columns,list) and columns
    assert all(isinstance(keys,list) and all(isinstance(k,str) for k in keys) and len(keys)==len(set(keys)) for keys in columns)
    assert len({tuple(keys) for keys in columns})==len(columns)
    def unpack(x):
        if isinstance(x,dict):
            assert set(x)=={'@'} and isinstance(x['@'],list) and len(x['@'])==2
            shape,values=x['@']
            assert type(shape) is int and 0<=shape<len(columns) and isinstance(values,list)
            assert len(values)==len(columns[shape]),'missing_or_extra_record_value'
            return {k:unpack(v) for k,v in zip(columns[shape],values)}
        if isinstance(x,list):return [unpack(v) for v in x]
        assert x is None or type(x) in [str,int,float,bool]
        return x
    return unpack(carrier['records'])

def compact(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'),allow_nan=False)

def main():
    start=time.monotonic();OUT.mkdir(exist_ok=False)
    helper=load('carrier_cpu_immutable_helper',BUNDLE/'support/run_pilot.py')
    assert hashlib.sha256((BUNDLE/'support/run_pilot.py').read_bytes()).hexdigest()=='2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d'
    import torch
    from transformers import AutoTokenizer
    assert not torch.cuda.is_initialized()
    tokenizer=AutoTokenizer.from_pretrained(helper.MODEL,revision=helper.REVISION,local_files_only=True,trust_remote_code=False)
    consumer=load('carrier_existing_consumer',ROLE/'consume_role18.py')
    _,(v,native,Engine,semantic,prep)=consumer.owners(BUNDLE,ROOT)
    teachers={r['id']:r for r in map(json.loads,(BUNDLE/'archive/runtime/train_messages.jsonl').read_text().splitlines())}
    report=dict(status='CPU_COMPARISON_CANDIDATE_ONLY',cases=[],model_loads=0,model_forwards=0,generations=0,training_updates=0,sql_operations=0,normal_integration=False,new_method_approved=False,product_credit=0,automatic_progression=False)
    for cid in IDS:
        original=teachers[cid]['messages'][-1]['content'].strip()
        gold=helper.strict_json(original);carrier=encode(gold);packed=compact(carrier)
        restored=decode(helper.strict_json(packed));roundtrip=compact(restored)
        assert restored==gold and roundtrip==original,'roundtrip_changed_values_or_order'
        control=[]
        for text in [original,roundtrip]:
            raw=dict(raw_text=text,finish_reason='stop',provider='CPU_FROZEN_TEACHER_COMPARISON_NOT_MODEL',model=helper.MODEL,revision=helper.REVISION,adapter_revision='comparison_not_model',usage=dict(prompt_tokens=0,completion_tokens=0),seconds=0.)
            result,_=consumer.read_raw(v,native,Engine,semantic,prep,cid,raw)
            assert result['meaning_adopted'] and result['body_available']
            control.append(result)
        assert control[0]==control[1],'cmee_teacher_outcome_changed'
        before=len(tokenizer.encode(original,add_special_tokens=False));after=len(tokenizer.encode(packed,add_special_tokens=False))
        malformed=json.loads(packed);malformed['records']['@'][1].pop()
        rejected=False
        try:decode(malformed)
        except AssertionError:rejected=True
        assert rejected
        (OUT/(cid+'.carrier.json')).write_text(packed+'\n')
        (OUT/(cid+'.roundtrip.json')).write_text(roundtrip+'\n')
        report['cases'].append(dict(case_id=cid,original_output_tokens=before,carrier_output_tokens=after,saved_tokens=before-after,output_token_reduction_fraction=1-after/before,column_shapes=len(carrier['columns']),all_values_and_order_byte_equal=True,missing_value_rejected=True,original_sha256=hashlib.sha256(original.encode()).hexdigest(),carrier_sha256=hashlib.sha256(packed.encode()).hexdigest(),cmee_teacher_outcome_equal=True,teacher_control=control[0]))
    assert not torch.cuda.is_initialized()
    report['seconds']=time.monotonic()-start
    (OUT/'comparison.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({**{k:v for k,v in report.items() if k!='cases'},'cases':[{k:v for k,v in x.items() if k!='teacher_control'} for x in report['cases']]}),flush=True)

if __name__=='__main__':main()
