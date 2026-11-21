import os,subprocess
from pathlib import Path
env=os.environ.copy();env.update(HF_HOME="/workspace/.cache/huggingface",PYTHONDONTWRITEBYTECODE="1")
with open("/workspace/semantic-resume40-v1/train.log","ab",buffering=0) as log:
 child=subprocess.Popen(['timeout', '--signal=TERM', '--kill-after=10s', '1490s', '/workspace/cocolon_venv/bin/python', '/workspace/semantic-resume40-v1/resume40_semantic_map.py', '--plan', '/workspace/semantic-resume40-v1/plan.json', '--plan-sha256', '189182165cf1d9593b6d7539fdf2c1750e1f4c6cc1159b6966d9076181247cc4', '--config-dir', '/workspace/semantic-continue96-v1/run/checkpoint_56', '--out', '/workspace/semantic-resume40-v1/run'],env=env,stdin=subprocess.DEVNULL,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
Path("/workspace/semantic-resume40-v1/train.pid").write_text(str(child.pid));assert os.getsid(child.pid)==child.pid;print("INDEPENDENT_SESSION_STARTED",child.pid)
