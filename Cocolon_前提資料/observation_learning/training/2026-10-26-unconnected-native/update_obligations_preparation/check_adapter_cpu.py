"""Verify the unchanged saved d431 adapter on CPU with the existing suffix loader."""
import argparse,hashlib,importlib.util,json,os,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
SOURCES={
 'legacy/run_pilot.py':'2f659078c05bee6d7b32f50aae8b9eebc03c767d4a3be084bc17e9e3ccc4c10d',
 'gpu_support/run_native15_expanded30.py':'ca03471329b5f622284cf3abd446cdd2f7831de3f7617da49a558ff7b5259e9d',
 'gpu_support/run_expanded15_recovery.py':'e4be86a2b6fb0581961fc3c619853ba7f419e3239464e969214772b8bc3bfb54',
}
ADAPTER={
 'README.md':'7716b0151793769140a76026939437398273346aefc3e5f75bb8ab2833b42885',
 'adapter_config.json':'8e2fa340bbba53210c982fb5ae6e5839960bafa390c643b57ff4f195a1b9d8d4',
 'adapter_model.safetensors':'d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684',
}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);sys.modules[name]=m;s.loader.exec_module(m);return m
def existing_loaders(root):
 for path,h in SOURCES.items():assert sha(root/path)==h,'immutable_loader_changed:'+path
 for name,h in ADAPTER.items():assert sha(root/'adapter'/name)==h,'saved_adapter_changed:'+name
 helper=module('update_probe_immutable_helper',root/'legacy/run_pilot.py')
 recovery=module('update_probe_existing_suffix_recovery',root/'gpu_support/run_expanded15_recovery.py')
 recovery.OLDPACK=root/'gpu_support';recovery.ORIGIN=root
 owner,modules,names=recovery.owner_with_checked_suffixes()
 return helper,owner,modules,names
def main(root):
 started=time.monotonic();out=root/'adapter_cpu_check.json'
 assert not out.exists()
 assert os.environ.get('CUDA_VISIBLE_DEVICES')=='' and os.environ.get('HF_HUB_OFFLINE')==os.environ.get('TRANSFORMERS_OFFLINE')=='1'
 import torch
 assert not torch.cuda.is_initialized()
 helper,owner,modules,names=existing_loaders(root)
 state=owner.validate_expanded_tensors(root/'adapter')
 assert len(state)==112 and sum(t.numel() for t in state.values())==3833856
 assert not torch.cuda.is_initialized()
 report=dict(status='SAVED_D431_CPU_VERIFIED_NO_PRETRAINED_MODEL_LOAD',seconds=time.monotonic()-started,
  adapter_sha256=ADAPTER,immutable_loader_sha256=SOURCES,tensors=112,parameters=3833856,finite_f32=True,
  resolved_modules=56,meta_architecture_constructions=1,pretrained_model_loads=0,model_forwards=0,
  training_updates=0,generations=0,cuda_initialized=False,automatic_progression=False,product_credit=0)
 out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);main(p.parse_args().root.resolve())
