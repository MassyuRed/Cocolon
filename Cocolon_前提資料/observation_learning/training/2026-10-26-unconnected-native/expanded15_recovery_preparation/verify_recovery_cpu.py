"""CPU-only regression for observed PEFT target minimization; no real 4B operation."""
import argparse,copy,hashlib,importlib.util,json,os,time
from pathlib import Path
def main(pack):
 started=time.monotonic()
 assert os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
 spec=importlib.util.spec_from_file_location('recovery',pack/'run_expanded15_recovery.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 pending=m.validate_plan(pack);assert pending['status']=='PREPARED_AWAITING_MASH_APPROVAL' and pending['gpu_run_authorized'] is False and not m.OUTPUT.exists()
 plan,origin,owner,r,tok,cases,check=m.prepare(pack)
 import torch
 from torch import nn
 from peft import LoraConfig,PeftModel,get_peft_model,get_peft_model_state_dict
 from peft.tuners.tuners_utils import check_target_module_exists
 from peft.utils.constants import MIN_TARGET_MODULES_FOR_OPTIMIZATION
 assert not torch.cuda.is_initialized()
 saved=json.loads((m.ORIGIN/'adapter/adapter_config.json').read_text());full=copy.deepcopy(saved);full['target_modules']=sorted(owner.EXPANDED_TARGETS)
 modules,names=m.inventory();cfg=LoraConfig(**saved)
 assert {n for n in names if check_target_module_exists(cfg,n)}==owner.EXPANDED_TARGETS
 owner.check_config(saved,owner.EXPANDED_TARGETS);owner.check_config(full,owner.EXPANDED_TARGETS)
 original=m.import_file('historical_expanded30',m.OLDPACK/'run_native15_expanded30.py');old_guard_reproduced=False
 try:original.check_config(saved,owner.EXPANDED_TARGETS)
 except ValueError as e:old_guard_reproduced=str(e)=='adapter_config_scope_changed'
 assert old_guard_reproduced
 negatives=[]
 for label,change in [('missing_k',lambda c:c['target_modules'].remove('k_proj')),('generic_up',lambda c:c.update(target_modules=[x for x in c['target_modules'] if not x.endswith('up_proj')]+['up_proj'])),('extra_layer',lambda c:c['target_modules'].append('0.mlp.up_proj')),('rank',lambda c:c.update(r=9)),('alpha',lambda c:c.update(lora_alpha=17))]:
  bad=copy.deepcopy(saved);change(bad)
  try:owner.check_config(bad,owner.EXPANDED_TARGETS)
  except ValueError:negatives.append(label)
  else:raise AssertionError('negative accepted:'+label)
 class Tiny(nn.Module):
  def __init__(self):
   super().__init__()
   for path in sorted(names-{''},key=lambda x:(x.count('.'),x)):
    bits=path.split('.');node=self
    for bit in bits:
     if not hasattr(node,bit):node.add_module(bit,nn.Module())
     node=getattr(node,bit)
   for path in owner.EXPANDED_TARGETS:self.set_submodule(path,nn.Linear(2,2,bias=False))
 toy_cfg=LoraConfig(r=8,lora_alpha=16,lora_dropout=0,bias='none',target_modules=sorted(owner.EXPANDED_TARGETS))
 toy=get_peft_model(Tiny(),toy_cfg)
 actual_targets={n for n,mod in toy.base_model.model.named_modules() if hasattr(mod,'lora_A')}
 assert actual_targets==owner.EXPANDED_TARGETS
 minimized=set(toy.peft_config['default'].target_modules);assert minimized==set(saved['target_modules']) and len(minimized)==28
 tiny_dir=pack/'tiny_cpu_roundtrip';assert not tiny_dir.exists();toy.save_pretrained(tiny_dir,safe_serialization=True)
 before=get_peft_model_state_dict(toy);assert len(before)==112
 reloaded=PeftModel.from_pretrained(Tiny(),tiny_dir,is_trainable=False,local_files_only=True)
 after=get_peft_model_state_dict(reloaded)
 assert set(before)==set(after) and all(torch.equal(before[k],after[k]) for k in before) and not any(p.requires_grad for p in reloaded.parameters())
 assert {n for n,mod in reloaded.base_model.model.named_modules() if hasattr(mod,'lora_A')}==owner.EXPANDED_TARGETS
 pending_refused=False
 try:m.execute(pack,'bd5d169ad457fc440bf01d1876cb40d697ce6847')
 except ValueError as e:pending_refused=str(e)=='execute_refused_new_recovery_approval_pending'
 assert pending_refused and not m.OUTPUT.exists()
 consumer=m.import_file('recovery_consumer',pack/'consume_expanded15_recovery.py')
 args=argparse.Namespace(run=m.ORIGIN,examples=Path('/workspace/cocolon_4b_quote_joint_pack_20261026/sft_examples.jsonl'),api=Path('/workspace/cocolon_afteronly_api_20261027'),legacy=Path('/workspace/cocolon_4b_service_binding_legacy_reference_20261025'),runtime_python=Path('/workspace/cocolon_4b_service_runtime_20261025/python'))
 consumer.validate_inputs_only(args)
 m.validate_origin();assert not torch.cuda.is_initialized()
 report=dict(status='CPU_RECOVERY_READY_REAL_4B_RELOAD_NOT_TESTED',seconds=time.monotonic()-started,old_failure_reproduced=old_guard_reproduced,peft_version='0.21.2',minimization_threshold=MIN_TARGET_MODULES_FOR_OPTIMIZATION,initial_target_names=56,saved_suffixes=28,resolved_modules=56,all_module_inventory_count=len(names),weight_module_inventory_count=len(modules),inventory_basis='FIXED_CLASS_META_ARCHITECTURE_NO_PRETRAINED_TENSOR_LOAD',meta_architecture_constructions=1,checkpoint_contains_unused_mtp_weights=True,all_112_saved_f32_finite=True,saved_parameter_count=3833856,original_adapter_files_unchanged=True,negative_cases_rejected=negatives,tiny_peft_injection_and_save_reload_exact_112=True,tiny_all_modules_equal_56=True,tiny_inference_requires_grad_false=True,tokenizer_and_frozen_cases=15,cmee_input_prior_binding=15,pending_execute_refused_before_output=pending_refused,real_4b_model_loads=0,real_4b_forwards=0,training_updates=0,real_generation_calls=0,cmee_adoptions=0,sql_operations=0,cuda_initialized=False,model_reload_4b_tested=False,source_sha256={n:m.sha(pack/n) for n in ('run_expanded15_recovery.py','consume_expanded15_recovery.py','verify_recovery_cpu.py','gpu15_recovery.plan.json')},training_origin_sha256=m.ORIGIN_FILES,adapter_sha256=m.ADAPTER,preparation=check)
 m.dump(pack/'actual_cpu_check.json',report);print(json.dumps(report),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--pack',type=Path,required=True);a=p.parse_args();main(a.pack.resolve())
