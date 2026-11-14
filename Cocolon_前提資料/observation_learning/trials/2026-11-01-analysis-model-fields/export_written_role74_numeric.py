"""Lossless completed-run export; exact UTF-8 bytes, F32 uint32 bits, no model."""
from pathlib import Path
import hashlib,html,json,struct,subprocess,os
w=Path('/workspace');r=w/'analysis-written-role74-20261103';out=w/'written-role74-numeric-recovery'
assert (r/'run.exit').exists() and not out.exists()
env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',PYTHONPATH=str(w/'analysis-written-role-api-v2-20261103/ai/services/ai_inference'),HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1')
replay=w/'written-role74-saved-replay.json'
assert replay.exists()
out.mkdir()
sha=lambda b:hashlib.sha256(b).hexdigest()
texts={}
def add(p,name):
 b=p.read_bytes();s=b.decode('utf-8');assert s.encode()==b
 texts[name]=dict(text=s,sha256=sha(b),bytes=len(b))
for p in sorted(r.rglob('*')):
 if p.is_file() and p.suffix!='.safetensors':add(p,'run/'+str(p.relative_to(r)))
for folder,key in [('analysis-written-role74-prepared-20261103','cpu')]:
 for p in sorted((w/folder).rglob('*')):
  if p.is_file():add(p,key+'/'+str(p.relative_to(w/folder)))
for n in ['written-role74-saved-replay.json','written-role74-supervisor.log','semantic_units_written_role74_saved_replay.py','export_written_role74_numeric.py']:add(w/n,'extra/'+n)
data=json.dumps(texts,ensure_ascii=False,separators=(',',':'))
parts=[]
def viewer(name,text):
 (out/name).write_text('<meta charset=utf-8><textarea aria-label="Recovery data" style="width:98vw;height:94vh">'+html.escape(text)+'</textarea>')
for i,start in enumerate(range(0,len(data),500000)):
 n=f'texts-{i:02}.html';viewer(n,data[start:start+500000]);parts.append(n)
binary=(r/'result/adapter/adapter_model.safetensors').read_bytes();hlen=struct.unpack('<Q',binary[:8])[0];head=binary[:8+hlen];body=binary[8+hlen:]
header=json.loads(binary[8:8+hlen]);assert len(body)%4==0 and all(v['dtype']=='F32' for k,v in header.items() if k!='__metadata__')
chunks=[];files={}
for i,start in enumerate(range(0,len(body),1048576)):
 b=body[start:start+1048576];n=f'values-{i:02}.html';s=json.dumps(list(struct.unpack('<'+'I'*(len(b)//4),b)),separators=(',',':'));viewer(n,s);chunks.append(n);files[n]=dict(bytes=len(s.encode()),sha256=sha(s.encode()))
meta=dict(binary_relative_path='run/result/adapter/adapter_model.safetensors',binary_bytes=len(binary),binary_sha256=sha(binary),header_bytes=list(head),chunks=chunks,text_parts=parts,text_bundle_bytes=len(data.encode()),text_bundle_sha256=sha(data.encode()),files=files,source_members=len(texts)+1,model_loads=0,new_generations=0,training_updates=0)
viewer('meta.html',json.dumps(meta,separators=(',',':')))
(w/'written-role74-evidence.html').write_text('<meta charset=utf-8><h1>Written role 74 exact saved evidence</h1>'+''.join('<p><a href="written-role74-numeric-recovery/'+n+'">'+n+'</a></p>' for n in ['meta.html']+parts+chunks))
print(json.dumps(dict(chunks=len(chunks),text_parts=len(parts),source_members=len(texts)+1,binary_sha256=sha(binary),status='SAVED_REPLAY_AND_EXPORT_DONE')))
