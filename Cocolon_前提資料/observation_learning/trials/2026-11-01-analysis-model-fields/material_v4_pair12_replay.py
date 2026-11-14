"""Re-admit the immutable twelve responses after the finite suru operator fix."""
from contextlib import ExitStack
from dataclasses import asdict, replace
import hashlib
import json
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch
import zipfile

W = Path('/workspace')
API = W/'analysis-material-v3-api-20261103'
ORIGINAL = W/'analysis-material-v4-pair12-20261103'
OUT = W/'analysis-material-v4-replay12-20261103'
COMMIT = 'ded0586720df0c0d50d8838bcd391a19ca3eead5'
sys.dont_write_bytecode = True
sys.path[:0] = [str(API/'ai/services/ai_inference'), str(API/'ai/tests')]
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')


def main():
    assert not OUT.exists(), 'do_not_restart_completed_replay'
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'], text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'], text=True).strip()
    assert (W/'material-v4-final-tests.exit').read_text().strip() == '0'
    assert 'passed' in (W/'material-v4-final-tests.log').read_text()
    manifest = json.loads((ORIGINAL/'manifest.json').read_text())
    assert all(sha(ORIGINAL/name)==digest for name,digest in manifest.items())
    assert sha(W/'cocolon-analysis-material-v4-pair12-originals-20261103.zip') == '0c8c7afe5c2d6e0e2d37766daa16a5b13137a122d9a7e534217956975eefb573'
    from test_analysis_cumulative import OWNER
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse, AnalysisSemanticError)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    cases = json.loads((ORIGINAL/'sources.json').read_text())
    OUT.mkdir()
    (OUT/'runner.py').write_bytes(Path(__file__).read_bytes())
    for name in ('material-v4-final-tests.log','material-v4-final-tests.exit'):
        (OUT/name).write_bytes((W/name).read_bytes())
    report = dict(status='STARTED', api_commit=COMMIT, new_calls=0, model_loads=0,
        training_updates=0, normal_adoption=False, calls=[])
    try:
        for case in cases:
            for profile in case['profiles']:
                key = case['case']+'_'+profile
                response = AnalysisModelQuotedParentUnitsResponse(**json.loads((ORIGINAL/(key+'.response.json')).read_text()))
                p = service.prepare_cumulative_category_units(OWNER, case['snapshot'], prompt_version=profile)
                value = replace(p, response=response)
                item = dict(case=case['case'], profile=profile)
                report['calls'].append(item)
                try:
                    candidate, counts = service.build_cumulative_quoted_parent_candidates(OWNER,case['snapshot'],model_input=value)
                    saved = service.serialize_cumulative_quoted_parent_candidates(OWNER,case['snapshot'],
                        model_input=value,artifact=candidate,coverage=counts)
                    assert saved == (ORIGINAL/(key+'.candidate.json')).read_text()
                    item['candidate'] = 'UNCHANGED_SAVED_BYTES'
                except (AnalysisSemanticError, AnalysisSourceError) as exc:
                    item.update(candidate='REJECTED', candidate_reason=str(exc))
                try:
                    artifact, counts = service.build_cumulative_written_role_map(OWNER,case['snapshot'],model_input=value,with_action=True)
                    saved = service.serialize_cumulative_written_role_map(OWNER,case['snapshot'],
                        model_input=value,artifact=artifact,coverage=counts,with_action=True)
                    with ExitStack() as stack:
                        for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_observed_graph'),
                            (compiler,'compile_analysis_unit_candidates'),(compiler,'compile_model_written_role_graph'),
                            (compiler,'compile_model_written_role_action_graph'),(author,'realize_analysis_unit_candidates'),
                            (author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                        assert service.reload_cumulative_written_role_map(OWNER,case['snapshot'],saved,with_action=True)==(artifact,counts)
                    (OUT/(key+'.role_action.json')).write_text(saved)
                    write(OUT/(key+'.projection.json'),dict(graph=asdict(artifact.graph),
                        text=artifact.safe_text_projection(authenticated_owner_scope=OWNER),
                        diagram=artifact.safe_projection(authenticated_owner_scope=OWNER)))
                    previous=ORIGINAL/(key+'.role_action.json')
                    if previous.exists(): assert previous.read_text()==saved
                    assert len(artifact.graph.nodes)==2 and not artifact.graph.edges
                    assert all(n.selected_category_context and list(n.selected_categories)==case['snapshot']['members'][0]['original']['category'] for n in artifact.graph.nodes)
                    item.update(role_action='TYPED_TWO_NODES', saved_replay='MATCHED', previous_saved_bytes='IDENTICAL' if previous.exists() else 'NEW_FROM_UNCHANGED_RAW')
                except (AnalysisSemanticError, AnalysisSourceError) as exc:
                    item.update(role_action='REJECTED', reason=str(exc))
        assert len(report['calls']) == 12
        assert {(r['case'],r['profile']) for r in report['calls'] if r['role_action']=='TYPED_TWO_NODES'} == {
            (c,'selected_material.v4') for c in ('PV01','PV02','PV05')}
        report['status']='COMPLETE_PENDING_SOURCE_RAW_REVIEW'
    finally:
        report['original_manifest_unchanged']=all(sha(ORIGINAL/n)==h for n,h in manifest.items())
        report['gpu_after_process']=subprocess.check_output(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader'],text=True).strip()
        assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
        write(OUT/'report.json',report)
        write(OUT/'manifest.json',{str(p.relative_to(OUT)):sha(p) for p in OUT.rglob('*') if p.is_file()})
        archive=W/'cocolon-analysis-material-v4-replay12-originals-20261103.zip'
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(OUT.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(OUT)))
        print(json.dumps(dict(status=report['status'],archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive),gpu=report['gpu_after_process'])))


if __name__=='__main__':
    main()
