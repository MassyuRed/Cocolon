"""CPU preparation: exact teacher retention, actual prompts and fixed local mask."""
import argparse,copy,hashlib,importlib.util,json,os,sys,time,types
from dataclasses import replace
from pathlib import Path
sys.dont_write_bytecode=True
ORIGIN=Path('/workspace/cocolon_native15_expanded30_run_20261027')
OLD_API=Path('/workspace/cocolon_afteronly_api_20261027')
API=Path('/workspace/cocolon_localized30_api_20261027')
LEGACY=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025')
RECOVERY=Path('/workspace/cocolon_native15_expanded15_recovery_pack_20261027')
API_COMMIT='a4b91b4788b2fb29483a4c77869c91b36402ae9f'
KEY='unknown_id_constraints'

def require(ok,code):
    if not ok:raise ValueError(code)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def dump(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def module(name,p):
    s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def readrows(p):return [json.loads(x) for x in Path(p).read_text().splitlines() if x.strip()]

def cpu_prepare(pack):
    start=time.monotonic()
    require(os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1','cpu_offline_required')
    require(not (pack/'actual_cpu_check.json').exists(),'cpu_preparation_already_recorded')
    external=json.loads((pack/'dependency_bindings.json').read_text())
    require(all(sha(p)==h for p,h in external.items()),'external_dependency_changed')
    import torch
    require(not torch.cuda.is_initialized(),'cuda_must_remain_uninitialized')
    rcv=module('localized_recovery',RECOVERY/'run_expanded15_recovery.py');rcv.validate_origin()
    owner,_,_=rcv.owner_with_checked_suffixes()
    oldplan,helper,joint,tok,oldrows,oldcases,oldencoded,_=owner.prepare(rcv.OLDPACK)
    consumer=module('localized_prior_consumer',RECOVERY/'consume_expanded15_recovery.py')
    _,native=consumer.frozen_cases(ORIGIN,Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'))
    sys.path[:0]=[str(API/'ai/services/ai_inference'),str(LEGACY)]
    from verify_cmee import reconstruct_request
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine import model_candidate_source as current
    from cocolon_meaning_experience_engine.preparation import QUOTE_CANDIDATE_SCHEMA,prepare_emlis,receive_candidate
    from cocolon_meaning_experience_engine.emlis_semantic_admission import SemanticInput,SemanticNotAdopted,MODEL_PROFILE,prepare_model_snapshot
    require(Path(current.__file__).is_relative_to(API),'new_prompt_owner_not_loaded')
    # Load the unchanged predecessor function against the same contracts for a byte comparison.
    oldname='cocolon_meaning_experience_engine._localized_old_model_candidate_source'
    oldmodule=types.ModuleType(oldname);oldmodule.__package__='cocolon_meaning_experience_engine';sys.modules[oldname]=oldmodule
    oldsource=OLD_API/'ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py'
    exec(compile(oldsource.read_bytes(),str(oldsource),'exec'),oldmodule.__dict__)
    loss=module('localized_loss_cpu',pack/'local_token_loss.py')
    mask=json.loads((pack/'fixed_token_mask.json').read_text());require(mask['selected_tokens']==198 and mask['extra_weight']==15,'fixed_mask_scope')
    allrows=[];cases=[];stats=[];requests={}
    old_cpu={x['id']:x for x in json.loads((ORIGIN/'cpu_preparation.json').read_text())['cases']}
    for i,(row,case,oe) in enumerate(zip(oldrows,oldcases,oldencoded,strict=True)):
        cid=row['id'];req,prior=reconstruct_request({'native_case':native[cid]});requests[cid]=(req,prior)
        old=oldmodule.build_model_messages(req,prior,candidate_format=QUOTE_CANDIDATE_SCHEMA)
        require(old==row['messages'][:-1]==case['messages'],'predecessor_prompt_not_reproduced')
        new=current.build_model_messages(req,prior,candidate_format=QUOTE_CANDIDATE_SCHEMA)
        ob=json.loads(old[1]['content']);nb=json.loads(new[1]['content'])
        condition=nb['output_spec'].pop(KEY)
        require('[A-Za-z0-9_.-]{1,64}' in condition and 'missing_explanation' not in condition,'constraint_or_gold_name')
        require(new[0]==old[0] and nb==ob,'extra_prompt_or_material_change')
        require(current.build_model_messages(req,prior)==oldmodule.build_model_messages(req,prior),'legacy_prompt_changed')
        nr=copy.deepcopy(row);nr['messages']=new+[row['messages'][-1]]
        enc,prefix=helper.encode_training(tok,nr['messages'],context=8192)
        oldprefix=next(j for j,x in enumerate(oe['labels']) if x!=-100)
        target=enc['input_ids'][prefix:]
        require(target==oe['input_ids'][oldprefix:],'assistant_target_changed')
        selected=loss.validate_case(mask['cases'][cid],row['messages'][-1]['content'],target)
        diagnostic=Path('/workspace/cocolon_109c_token_diagnostic_run_20261027')/(cid+'.json')
        require(sha(diagnostic)==mask['cases'][cid]['diagnostic_report_sha256'],'diagnostic_report_changed')
        diagnosis=json.loads(diagnostic.read_text())
        expected_mask=[j for j in diagnosis['wrong_target_indices'] if diagnosis['tokens'][j]['field'] not in {'candidate.question_proposal','candidate.unknowns'}]
        require(selected==expected_mask and target==[t['gold_id'] for t in diagnosis['tokens']],'diagnostic_mask_not_reproduced')
        require((i>=9) or not selected,'old9_must_keep_original_full_ce')
        cap=case['max_new_tokens'];require(prefix+cap<=8192 and len(target)<=cap,'new_prompt_context_overflow')
        require(enc['labels'][:prefix]==[-100]*prefix and enc['labels'][prefix:]==target and tok.eos_token_id in target,'loss_mask_or_eos_changed')
        require(helper.chat_token_ids(tok,new,generation_prompt=True)==enc['input_ids'][:prefix],'train_eval_prefix_mismatch')
        material=prepare_emlis(req);receipt=receive_candidate(material,request_id=material.request_id,raw_output=row['messages'][-1]['content'],finish_reason='stop',model='cpu-frozen-teacher-not-4B')
        engine=MeaningExperienceEngine();cp=engine.prepare_emlis_update(req,semantic_input=SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=MODEL_PROFILE))
        resumed=replace(req,emlis_thread=replace(req.emlis_thread,prepared_meaning_checkpoint_ref=cp.checkpoint_id))
        result=engine.generate(resumed,semantic_input=SemanticInput('RESUME_ADOPTED',snapshot_json=cp.semantic_snapshot,semantic_profile=MODEL_PROFILE))
        require(result.artifact is not None,'unchanged_teacher_body_not_available')
        reference=old_cpu[cid]
        require({k:getattr(result.artifact,k) for k in ('observation','reception','update_note')}==reference['surface'],'frozen_teacher_surface_changed')
        require((result.question.prompt_private if result.question else None)==reference['question'] and result.question_decision.disposition==reference['question_disposition'],'frozen_teacher_question_changed')
        allrows.append(nr);cases.append({**case,'messages':new})
        stats.append(dict(id=cid,prompt_tokens=prefix,prompt_token_delta=prefix-oldprefix,assistant_eos_tokens=len(target),full_tokens=len(enc['input_ids']),generation_cap=cap,prompt_plus_cap=prefix+cap,selected_tokens=len(selected),uniform_ce_component=len(target)/(len(target)+15*len(selected)),teacher_bytes_unchanged=True,target_ids_unchanged=True,legacy_prompt_bytes_unchanged=True,only_prompt_spec_item_added=True,meaning_body_teacher_available=True,surface_question_and_disposition_equal=True))
    require(len(allrows)==15 and sum(x['selected_tokens'] for x in stats)==198,'prepared_case_count')
    alias_checks=[]
    for cid in ('FT-BOOK-INITIAL','FT-SHOP-INITIAL','FT-KNIT-INITIAL'):
        row=next(r for r in oldrows if r['id']==cid);req,prior=requests[cid]
        for uid,legal in [('missing_reason',True),('u'*64,True),('気がかり',False),('',False),('u'*65,False),('has space',False),('COLLIDE',False)]:
            packet=json.loads(row['messages'][-1]['content']);c=packet['candidate'];actual=c['claims'][0]['claim_id'] if uid=='COLLIDE' else uid;c['unknowns'][0]['unknown_id']=actual
            if c['question_proposal'] is not None:c['question_proposal']['target_unknown_ref']=actual
            material=prepare_emlis(req);receipt=receive_candidate(material,request_id=material.request_id,raw_output=canonical(packet),finish_reason='stop',model='cpu-alias-not-4B')
            try:
                adopted=prepare_model_snapshot(req,SemanticInput('FRESH_CANDIDATE',receipt,prior_snapshot_json=prior,semantic_profile=MODEL_PROFILE));require(legal and actual in adopted.meaning_json,'illegal_alias_was_admitted')
            except SemanticNotAdopted as exc:require(not legal and 'unknown_not_source_bound' in exc.reason_code,'wrong_alias_rejection')
            alias_checks.append(dict(case_id=cid,variant=uid if len(uid)<20 else '64-or-65-ascii',expected_admitted=legal,passed=True))
    g=torch.tensor([0,2,1,3],dtype=torch.long);x=torch.tensor([[1.,2.,0.,-1.],[2.,0.,3.,1.],[1.,2.,3.,0.],[0.,1.,2.,3.]],requires_grad=True)
    plain=torch.nn.functional.cross_entropy(x,g);empty=loss.loss_from_logits(x,g,[])
    require(torch.equal(plain,empty),'empty_mask_not_original_ce')
    a=torch.autograd.grad(plain,x,retain_graph=True)[0];b=torch.autograd.grad(empty,x,retain_graph=True)[0];require(torch.equal(a,b),'empty_mask_gradient_changed')
    weighted=loss.loss_from_logits(x,g,[1,3]);manual=(torch.nn.functional.cross_entropy(x,g,reduction='none')*torch.tensor([1.,16.,1.,16.])).sum()/34
    require(torch.equal(weighted,manual) and torch.isfinite(torch.autograd.grad(weighted,x)[0]).all(),'weighted_loss_or_gradient')
    # A tiny fake causal model verifies exactly one call and the predecessor/last-logit shift.
    class TinyHelper:
        @staticmethod
        def assistant_loss_window(e):return 2,5
    class Tiny:
        def __init__(self):self.calls=0;self.logits=torch.arange(28,dtype=torch.float32).reshape(1,7,4).requires_grad_()
        def __call__(self,**kw):
            self.calls+=1;require(kw['logits_to_keep']==5 and kw['use_cache'] is False and 'labels' not in kw,'tiny_model_call_contract')
            return types.SimpleNamespace(logits=self.logits[:,-5:,:])
    tiny=Tiny();labels=torch.tensor([[-100,-100,-100,0,2,1,3]])
    got=loss.teacher_loss(tiny,TinyHelper,input_ids=torch.zeros((1,7),dtype=torch.long),attention_mask=torch.ones((1,7)),labels=labels,encoded={},chosen=[1,3])
    expected=loss.loss_from_logits(tiny.logits[0,2:6,:],g,[1,3]);require(tiny.calls==1 and torch.equal(got,expected),'single_forward_or_causal_shift')
    require(torch.equal(torch.autograd.grad(got,tiny.logits,retain_graph=True)[0],torch.autograd.grad(expected,tiny.logits)[0]),'causal_shift_gradient')
    rejected=0
    for spec in ({**mask['cases']['FT-REPOT-INITIAL'],'selected_target_indices':[-1]},{**mask['cases']['FT-REPOT-INITIAL'],'selected_target_indices':[761,761]},{**mask['cases']['FT-REPOT-INITIAL'],'teacher_utf8_sha256':'0'*64},{**mask['cases']['FT-REPOT-INITIAL'],'target_ids_sha256':'0'*64}):
        original=mask['cases']['FT-REPOT-INITIAL'];row=next(r for r in oldrows if r['id']=='FT-REPOT-INITIAL');target=oldencoded[[r['id'] for r in oldrows].index(row['id'])]['labels'];target=[x for x in target if x!=-100]
        try:loss.validate_case(spec,row['messages'][-1]['content'],target)
        except ValueError:rejected+=1
    require(rejected==4,'mask_mutations_not_rejected')
    (pack/'train_messages.jsonl').write_text(''.join(canonical(r)+'\n' for r in allrows))
    (pack/'eval_inputs.jsonl').write_text(''.join(canonical(r)+'\n' for r in cases))
    changed=[];api_inventory={}
    for p in API.rglob('*'):
        if p.is_file() and '__pycache__' not in p.parts and '.git' not in p.parts:
            rel=str(p.relative_to(API));api_inventory[rel]=sha(p);before=OLD_API/rel
            if not before.exists() or sha(before)!=sha(p):changed.append(rel)
    expected=json.loads((pack/'api_changes.json').read_text())
    require(sorted(changed)==sorted(expected),'unintended_api_changes')
    for path,identity in expected.items():
        raw=(API/path).read_bytes();require(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==identity,'new_api_blob_changed')
    require(not torch.cuda.is_initialized(),'cuda_initialized_during_cpu')
    report=dict(status='CPU_LOCALIZED30_PREPARED_GPU_NOT_AUTHORIZED',seconds=time.monotonic()-start,api_commit=API_COMMIT,api_changes=expected,api_inventory=api_inventory,cases=stats,alias_contract_checks=alias_checks,selected_tokens=198,old9_original_ce=True,empty_mask_ce_and_gradient_exact=True,weighted_ce_and_gradient=True,single_tiny_forward_and_causal_shift_gradient=True,mutation_refusals=4,model_loads=0,model_forwards=0,training_updates=0,generations=0,sql_operations=0,cuda_initialized=False,teacher_fit_only=True,product_accepted=False,automatic_progression=False)
    report['external_dependency_sha256']=external
    report['payload_sha256']={n:sha(pack/n) for n in ('train_messages.jsonl','eval_inputs.jsonl','fixed_token_mask.json','local_token_loss.py','prepare_localized30.py','run_localized30.py','consume_localized30.py','dependency_bindings.json','api_changes.json')}
    dump(pack/'actual_cpu_check.json',report)
    plan=json.loads((pack/'localized30.plan.json').read_text())
    require(plan['status']=='PREPARED_AWAITING_MASH_APPROVAL' and plan['gpu_run_authorized'] is False and plan['approval_basis'] is None and plan['cpu_check_sha256'] is None,'preparation_plan_must_be_pending_unbound')
    plan['cpu_check_sha256']=sha(pack/'actual_cpu_check.json');dump(pack/'localized30.plan.json',plan)
    runner=module('local30_pending_runner',pack/'run_localized30.py');runner.validate_plan(pack)
    before=runner.OUTPUT.exists();require(not before,'new_gpu_output_preexists')
    try:runner.execute(pack,'0'*40)
    except ValueError as exc:require(str(exc)=='execute_refused_new_local30_approval_pending','wrong_pending_execute_rejection')
    else:raise AssertionError('pending_execute_was_not_refused')
    require(not runner.OUTPUT.exists(),'pending_execute_created_output')
    dump(pack/'pending_execution_check.json',dict(status='PENDING_EXECUTE_REFUSED_BEFORE_OUTPUT_AND_MODEL',output_absent=True,model_loads=0,forwards=0,updates=0,generations=0,runner_sha256=sha(pack/'run_localized30.py'),cpu_check_sha256=sha(pack/'actual_cpu_check.json')))
    print(json.dumps({k:v for k,v in report.items() if k not in ('api_inventory','cases','alias_contract_checks','payload_sha256')},ensure_ascii=False),flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);a=p.parse_args();cpu_prepare(a.pack.resolve())
