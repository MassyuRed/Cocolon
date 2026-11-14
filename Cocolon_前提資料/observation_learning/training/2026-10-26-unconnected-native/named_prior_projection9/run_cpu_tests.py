"""Run selected unchanged and new tests, prohibit real Supabase transport."""
import json
import os
from pathlib import Path
import sys
import time
from types import ModuleType
import xml.etree.ElementTree as ET

os.environ.update(CUDA_VISIBLE_DEVICES='',HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',PYTEST_DISABLE_PLUGIN_AUTOLOAD='1')
sys.dont_write_bytecode=True
ROOT=Path('/workspace/cocolon_namedprior9_root_20261028')
PACK=Path('/workspace/cocolon_namedprior9_pack_20261028')
sys.path[:0]=[str(ROOT/'api/ai/services/ai_inference'),str(ROOT/'api/ai/tests')]
stub=ModuleType('supabase_client')
async def blocked(*a,**kw):raise AssertionError('REAL_DATABASE_TRANSPORT_FORBIDDEN')
for name in ('sb_post_rpc','sb_get','sb_post','sb_patch','sb_delete'):
    setattr(stub,name,blocked)
sys.modules['supabase_client']=stub
import pytest
start=time.monotonic()
files=['test_cmee_preparation.py','test_cmee_model_candidate_source.py','test_cmee_quote_candidate.py',
       'test_cmee_emlis_model_meaning.py','test_cmee_emlis_model_daily_calm.py','test_cmee_emlis_sixrow.py',
       'test_cmee_named_reference_candidate.py']
code=pytest.main(['-q','--noconftest','-p','no:cacheprovider','--junitxml='+str(PACK/'pytest_results.xml'),
    '-k','not real_sql',*[str(ROOT/'api/ai/tests'/f) for f in files]])
tree=ET.parse(PACK/'pytest_results.xml')
suites=list(tree.getroot().iter('testsuite'))
report=dict(status='CPU_PYTEST_PASS' if code==0 else 'CPU_PYTEST_FAILED',exit_code=int(code),
    seconds=time.monotonic()-start,files=files,sql_tests_deselected=True,sql_operations=0,
    tests=sum(int(s.attrib.get('tests',0)) for s in suites),failures=sum(int(s.attrib.get('failures',0)) for s in suites),
    errors=sum(int(s.attrib.get('errors',0)) for s in suites),skipped=sum(int(s.attrib.get('skipped',0)) for s in suites),
    model_loads=0,model_forwards=0,training_updates=0,generations=0,product_credit=0,automatic_progression=False)
(PACK/'pytest_summary.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report),flush=True)
raise SystemExit(code)

