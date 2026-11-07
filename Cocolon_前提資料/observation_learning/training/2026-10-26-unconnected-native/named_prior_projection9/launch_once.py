import os,subprocess,sys
from pathlib import Path
p=Path('/workspace/cocolon_namedprior9_pack_20261028')
env=dict(os.environ,HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',CUDA_VISIBLE_DEVICES='0')
code=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','590s','/workspace/cocolon_venv/bin/python','-B',str(p/'run_namedprior9.py'),'--pack',str(p),'--execute','--source-commit','ecc42b9f8be5342bdd9c4a8318ff08208f8f0c92'],env=env).returncode
Path('/workspace/cocolon_namedprior9_gpu.exit').write_text(str(code)+'\n')
