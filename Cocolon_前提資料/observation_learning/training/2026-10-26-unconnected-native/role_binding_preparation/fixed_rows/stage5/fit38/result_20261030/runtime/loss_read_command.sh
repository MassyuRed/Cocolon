python3.12 - <<'PY'
from pathlib import Path
from importlib.metadata import distribution,version
import hashlib,json,ast,sys
site=distribution('transformers')
files={}
for rel in ['transformers/models/qwen3_5/modeling_qwen3_5.py','transformers/loss/loss_utils.py']:
 p=Path(site.locate_file(rel));b=p.read_bytes();tree=ast.parse(b.decode())
 selected=[]
 for node in ast.walk(tree):
  if isinstance(node,ast.ClassDef) and node.name in ['Qwen3_5ForConditionalGeneration','Qwen3_5ForCausalLM']:
   for fn in node.body:
    if isinstance(fn,(ast.FunctionDef,ast.AsyncFunctionDef)) and fn.name=='forward':selected.append({'name':node.name+'.forward','line':fn.lineno,'source':ast.get_source_segment(b.decode(),fn)})
  if isinstance(node,ast.FunctionDef) and node.name=='ForCausalLMLoss':selected.append({'name':node.name,'line':node.lineno,'source':ast.get_source_segment(b.decode(),node)})
 files[rel]={'path':str(p),'sha256':hashlib.sha256(b).hexdigest(),'selected':selected}
report={'transformers_version':version('transformers'),'files':files,'torch_imported':'torch' in sys.modules,'model_loads':0,'model_forwards':0,'updates':0,'generations':0,'new_cmee_calls':0}
out=Path('/workspace/cocolon-fit38-loss-source-20261030.json');assert not out.exists();out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+chr(10));print(json.dumps({k:v for k,v in report.items() if k!='files'},indent=2));print({p:x['sha256'] for p,x in files.items()})
PY
