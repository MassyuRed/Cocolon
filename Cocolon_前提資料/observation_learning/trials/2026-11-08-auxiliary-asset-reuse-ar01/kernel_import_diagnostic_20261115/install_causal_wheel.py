import hashlib,json,pathlib,subprocess,urllib.request,torch
r=pathlib.Path('/workspace/semantic-kernel-preparation-20261115')
assert torch.__version__=='2.8.0+cu128' and torch._C._GLIBCXX_USE_CXX11_ABI is True
name='causal_conv1d-1.7.0+cu12torch2.8cxx11abiTRUE-cp312-cp312-linux_x86_64.whl'
p=r/name;assert not p.exists()
u='https://github.com/Dao-AILab/causal-conv1d/releases/download/v1.7.0/causal_conv1d-1.7.0%2Bcu12torch2.8cxx11abiTRUE-cp312-cp312-linux_x86_64.whl'
h=hashlib.sha256();n=0
with urllib.request.urlopen(u,timeout=30) as response,p.open('xb') as output:
 while True:
  b=response.read(1048576)
  if not b:break
  n+=len(b);assert n<=196377090;h.update(b);output.write(b)
assert n==196377090 and h.hexdigest()=='a1fcd5d022b67ddfc9e1c291f890004c1c081a03d66b532f6eebe31219168e0e'
subprocess.run(['/workspace/cocolon_venv/bin/python','-m','pip','--isolated','install','--disable-pip-version-check','--no-deps','--no-index','--target','/workspace/semantic-kernel-deps-20261115',str(p)],check=True,timeout=45)
(r/'causal-wheel-proof.json').write_text(json.dumps(dict(state='INSTALLED_ISOLATED',bytes=n,sha256=h.hexdigest(),torch='2.8.0+cu128',cxx11abi=True)))
print('CAUSAL_WHEEL_HASH_VERIFIED_ISOLATED',n)
