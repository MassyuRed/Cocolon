"""Fresh CPU saved-file replay and text evidence export; no GPU/model calls."""
from pathlib import Path
from dataclasses import replace
from unittest.mock import patch
import sys,os,json,hashlib,html
w=Path('/workspace');api=w/'analysis-written-role-api-v2-20261103';root=w/'analysis-written-role8-20261103'
sys.dont_write_bytecode=True;sys.path[:0]=[str(api/'ai/services/ai_inference')]
import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError)
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
report=json.loads((root/'report.json').read_text());sources=json.loads((root/'sources.json').read_text());replay=[]
for row,call in zip(sources,report['calls']):
    key=row['id'];assert key==call['id']
    if call.get('role_admission')=='RETURNED':
        with patch.object(MeaningExperienceEngine,'generate',side_effect=AssertionError('no generation')), \
             patch.object(compiler,'compile_model_written_role_graph',side_effect=AssertionError('no compile')), \
             patch.object(author,'realize_model_written_role_graph',side_effect=AssertionError('no author')):
            artifact,cov=service.reload_cumulative_written_role_map(row['owner'],row['snapshot'],(root/(key+'.role.json')).read_text())
        assert artifact.artifact_id==call['artifact_id'] and cov==call['coverage']
        replay.append(dict(id=key,status='MATCHED_NO_ENGINE_COMPILER_AUTHOR',artifact_id=artifact.artifact_id))
    else:
        p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
        value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(**json.loads((root/(key+'.response.json')).read_text())))
        try:service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
        except (AnalysisSemanticError,AnalysisSourceError) as exc:
            assert str(exc)==call['role_reason'];replay.append(dict(id=key,status='REJECTION_PRESERVED',reason=str(exc)))
        else:raise AssertionError('previous rejection changed')
saved=dict(status='FRESH_CPU_SAVED_REPLAY',model_loads=0,new_generations=0,training_updates=0,rows=replay)
(root/'saved_replay.json').write_text(json.dumps(saved,ensure_ascii=False,indent=2)+'\n')
files={str(p.relative_to(root)):p for p in root.rglob('*') if p.is_file()}
extras=['written_role8_run.py','written_role8_supervisor.py','collect_written_role8.py','written-role8-sources.json',
    'written-role8.exit','written-role8.log','written-role8.finished.json','written-role8-supervisor.log',
    'written-role-tests.log','written-role-tests.exit','written-role-tests-command.json','written-role-tests-job.py',
    'written-role-tests-v2.log','written-role-tests-v2.exit','written-role-tests-v2-command.json','written-role-tests-v2-job.py',
    'written-role-api-setup.log','written-role-api-v2-setup.log']
for name in extras:
    p=w/name
    if p.exists():files['extra/'+name]=p
bundle={k:dict(text=p.read_bytes().decode('utf-8'),bytes=p.stat().st_size,
    sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for k,p in sorted(files.items())}
text=json.dumps(bundle,ensure_ascii=False,separators=(',',':'))
(w/'written-role8-evidence.html').write_text('<html><meta charset="utf-8"><h1>Written-role vertical evidence</h1><p>'+str(len(bundle))+' exact source files</p><textarea style="width:100%;height:80vh">'+html.escape(text)+'</textarea></html>')
(w/'written-role8-collection.json').write_text(json.dumps(dict(files=len(bundle),json_characters=len(text),
    evidence_sha256=hashlib.sha256(text.encode()).hexdigest(),model_loads=0,new_generations=0),indent=2)+'\n')
print('COLLECTED',len(bundle),len(text))
