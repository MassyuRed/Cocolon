import os,subprocess,sys
from pathlib import Path
p=Path('/workspace/cocolon_namedoutput9_pack_20261028')
env=dict(os.environ,HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',CUDA_VISIBLE_DEVICES='0')
code=subprocess.run(['timeout','--signal=TERM','--kill-after=10s','590s','/workspace/cocolon_venv/bin/python','-B',str(p/'run_namedoutput9.py'),'--pack',str(p),'--execute','--source-commit','4ba6f23f7f2c68d629fe6622efbeae812bb17641'],env=env).returncode
Path('/workspace/cocolon_namedoutput9_gpu.exit').write_text(str(code)+'\n')
