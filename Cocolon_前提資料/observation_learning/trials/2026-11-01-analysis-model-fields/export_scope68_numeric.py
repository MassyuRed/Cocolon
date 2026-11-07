"""Lossless member/text and numeric F32 recovery; no model or generation."""
from pathlib import Path
import json,hashlib,struct,zipfile
w=Path('/workspace');r=w/'analysis-scope68-20261103';out=w/'scope68-numeric-recovery';out.mkdir(exist_ok=False)
sha=lambda b:hashlib.sha256(b).hexdigest()
texts={}
for p in r.rglob('*'):
 if p.is_file() and p.suffix!='.safetensors':texts['run/'+str(p.relative_to(r))]=dict(text=p.read_text(),sha256=sha(p.read_bytes()),bytes=p.stat().st_size)
for p in (w/'analysis-scope68-prepared-20261103').rglob('*'):
 if p.is_file():texts['cpu/'+str(p.relative_to(w/'analysis-scope68-prepared-20261103'))]=dict(text=p.read_text(),sha256=sha(p.read_bytes()),bytes=p.stat().st_size)
for name in ['scope68-saved-replay.json','api-restoration-correction.json','bootstrap_analysis.py','bootstrap_analysis.log','model-restore.log','semantic_units_scope_contrast_cpu.json','semantic_units_scope68_saved_replay.py','collect_scope68.py']:
 p=w/name;texts['extra/'+name]=dict(text=p.read_text(),sha256=sha(p.read_bytes()),bytes=p.stat().st_size)
(out/'texts.txt').write_text(json.dumps(texts,ensure_ascii=False,separators=(',',':')))
binary=(r/'result/adapter/adapter_model.safetensors').read_bytes();hlen=struct.unpack('<Q',binary[:8])[0];head=binary[:8+hlen];data=binary[8+hlen:];assert len(data)%4==0
header=json.loads(binary[8:8+hlen]);assert all(v['dtype']=='F32' for k,v in header.items() if k!='__metadata__')
chunk_names=[]
for i,start in enumerate(range(0,len(data),1048576)):
 b=data[start:start+1048576];name=f'values-{i:02}.txt';(out/name).write_text(json.dumps(list(struct.unpack('<'+'I'*(len(b)//4),b)),separators=(',',':')));chunk_names.append(name)
meta=dict(binary_relative_path='run/result/adapter/adapter_model.safetensors',binary_bytes=len(binary),binary_sha256=sha(binary),header_bytes=list(head),chunks=chunk_names,texts='texts.txt',files={p.name:dict(bytes=p.stat().st_size,sha256=sha(p.read_bytes())) for p in out.glob('*.txt')},original_archive_sha256=sha((w/'cocolon-analysis-scope68-result-20261103.zip').read_bytes()),model_loads=0,new_generations=0,training_updates=0)
(out/'meta.txt').write_text(json.dumps(meta,separators=(',',':')))
(w/'scope68-evidence-download.html').write_text('<meta charset=utf-8><h1>Scope68 numeric recovery</h1>'+''.join('<p><a href="scope68-numeric-recovery/'+n+'">'+n+'</a></p>' for n in ['meta.txt','texts.txt']+chunk_names))
print(json.dumps(dict(chunks=len(chunk_names),binary_sha256=sha(binary),meta_bytes=(out/'meta.txt').stat().st_size,total_text_bytes=sum(p.stat().st_size for p in out.glob('*.txt')))))
