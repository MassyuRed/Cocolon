"""Preserve one completed suffix2 run and its frozen reconstruction inputs."""
from pathlib import Path
import hashlib
import json
import zipfile

BASE=Path('/workspace')
PACK=BASE/'cocolon_suffix2_pack_20261029'
RUN=BASE/'cocolon_suffix2_run_20261029'
CMEE=BASE/'cocolon_suffix2_cmee_20261029'
BUNDLE=BASE/'cocolon_auxiliary4_20261029'
SOURCE=BASE/'cocolon_auxiliary_fit8_pack_20261029/cmee_current7b9_root_20261029'
INITIAL=BASE/'cocolon_joint_role18_run_20261029/adapter'
OUTPUT=BASE/'cocolon-suffix2-weights-originals-20261029.zip'

def sha(b):
    return hashlib.sha256(b).hexdigest()

def main():
    rb=(RUN/'run.json').read_bytes();run=json.loads(rb)
    assert run['status']=='RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW'
    assert run['optimizer_steps_completed']==2 and run['model_calls_completed']==11
    assert run['initial_adapter_and_frozen_inputs_unchanged'] is True
    assert (PACK/'cmee.exit').read_text()=='0'
    db=(CMEE/'diagnosis.json').read_bytes();d=json.loads(db)
    assert len(d['cases'])==11
    for item in run['calls']:
        assert sha((RUN/item['path']).read_bytes())==item['raw_sha256']
    for n,h in run['adapter_sha256'].items():
        assert sha((RUN/'adapter'/n).read_bytes())==h
    roots={'runtime':PACK,'run':RUN,'cmee':CMEE,'frozen/archive':BUNDLE/'archive','frozen/support':BUNDLE/'support','frozen/diagnostic':BUNDLE/'diagnostic','cmee_source':SOURCE,'initial_adapter':INITIAL}
    payload={}
    for prefix,root in roots.items():
        assert root.is_dir()
        for path in sorted(root.rglob('*')):
            if path.is_file() and '__pycache__' not in path.parts and '.ipynb_checkpoints' not in path.parts:
                assert not path.is_symlink()
                payload[prefix+'/'+str(path.relative_to(root))]=path.read_bytes()
    prior=INITIAL.parent
    for path in [prior/'run.json',*sorted(prior.glob('after_*.jsonl'))]:
        payload['before_f493/'+path.name]=path.read_bytes()
    summary=dict(status='SUFFIX2_EXECUTION_COMPLETE_CONTENT_REVIEW_SEPARATE',source_commit=run['source_commit'],api_commit=d['api_commit'],optimizer_steps_completed=2,model_loads_completed=run['model_loads_completed'],model_calls_completed=11,changed_tensors=run['changed_tensors'],adapter_sha256=run['adapter_sha256'],processing_seconds=run['processing_seconds'],process_cost_usd=run['process_cost_usd'],cmee_cpu_seconds=d['seconds'],full2=d['full2'],old9=d['old9'],complete_diagnosis_sha256=sha(db),complete_diagnosis_bytes=len(db),cases=[{**{k:c.get(k) for k in ['case_id','meaning_adopted','body_available','decision','reason_code','cold_file_status']},**{k:run['calls'][i].get(k) for k in ['output_tokens','eos_reached','seconds','raw_sha256','timeout_triggered']}} for i,c in enumerate(d['cases'])],normal_activation=False,product_credit=0,automatic_progression=False,base_model_and_tokenizer_files_included=False,base_model='Qwen/Qwen3.5-4B',base_revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',optimizer_rng_state_included=False)
    payload['execution_summary.json']=(json.dumps(summary,ensure_ascii=False,indent=2)+'\n').encode()
    payload['export_suffix2.py']=Path(__file__).read_bytes()
    manifest={'stage':'COMPLETED_EXECUTION_ORIGINALS_NOT_PRODUCT_ACCEPTANCE','files':[dict(path=n,bytes=len(b),sha256=sha(b)) for n,b in payload.items()]}
    with zipfile.ZipFile(OUTPUT,'x',zipfile.ZIP_DEFLATED) as z:
        for n,b in payload.items():z.writestr(n,b)
        z.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    assert (RUN/'run.json').read_bytes()==rb and (CMEE/'diagnosis.json').read_bytes()==db
    print(json.dumps(dict(archive=OUTPUT.name,bytes=OUTPUT.stat().st_size,sha256=sha(OUTPUT.read_bytes()),payloads=len(payload),full2=d['full2'],old9=d['old9'],seconds=run['processing_seconds'],usd=run['process_cost_usd'])),flush=True)

if __name__=='__main__':main()
