"""Replay saved before/after without model/compiler/author; export every run byte once."""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from hashlib import sha256
from unittest.mock import patch
import json,sys,zipfile,subprocess

w=Path('/workspace');root=w/'analysis-aligned74-20261103'
api=w/'analysis-semantic-boundaries-api-20261103'
out=w/'analysis-aligned74-collected-20261103'
sha=lambda p:sha256(Path(p).read_bytes()).hexdigest()
sys.dont_write_bytecode=True
sys.path[:0]=[str(api/'ai/tools'),str(api/'ai/services/ai_inference')]

def main():
    assert not out.exists()
    assert (root/'run.exit').exists() or (root/'prepare.exit').exists()
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip()=='dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
    manifest=json.loads((root/'manifest.json').read_text()) if (root/'manifest.json').exists() else {}
    assert all(sha(root/n)==h for n,h in manifest.items())
    if not (root/'run.exit').exists() or (root/'run.exit').read_text()!='0':
        out.mkdir()
        archive=w/'cocolon-analysis-aligned74-partial-20261103.zip'
        assert not archive.exists()
        members={}
        with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
            for p in sorted(root.rglob('*')):
                if p.is_file():
                    name='run/'+str(p.relative_to(root));z.write(p,name);members[name]=sha(p)
            z.writestr('export_manifest.json',json.dumps(members,indent=2)+'\n')
        with zipfile.ZipFile(archive) as z:
            assert z.testzip() is None and all(sha256(z.read(n)).hexdigest()==h for n,h in members.items())
        info=dict(status='PARTIAL_EXPORTED_NOT_REPLAYED',archive=str(archive),bytes=archive.stat().st_size,
            sha256=sha(archive),members=len(members)+1,replay_rows=0,model_loads=0,generations=0,updates=0)
        (out/'collection.json').write_text(json.dumps(info,indent=2)+'\n')
        print(json.dumps(info));return
    pack=json.loads((root/'semantic_units_aligned74_plan.json').read_text())
    report=json.loads((root/'result/report.json').read_text())
    assert report['status']=='COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert (report['new_calls'],report['model_loads'],report['updates_completed'],report['measurement_forwards'])==(46,2,86,148)
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    replay=[]
    before={r['probe_id']:r for r in json.loads((root/'reused_before.json').read_text())}
    after={r['probe_id']:r for r in report['calls']}
    for phase,recorded in [('before',before),('after',after)]:
        for row in pack['evaluation']:
            key=row['probe_id'];prefix=(root if phase=='before' else root/'result')/(phase+'_'+key)
            p=service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=pack['plan']['prompt_version'])
            assert p.request_ref==row['request_ref'] and p.messages()==row['messages']
            resp=json.loads(prefix.with_suffix('.response.json').read_text())
            assert resp['raw'].encode()==prefix.with_suffix('.raw.txt').read_bytes()
            assert resp['raw_sha256']==sha(prefix.with_suffix('.raw.txt'))
            value=replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
            result=dict(phase=phase,probe_id=key)
            for kind,build,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
                if kind=='role' and not row['role_vertical']:continue
                admission='admission' if kind=='candidate' else 'role_admission'
                reason='reason' if kind=='candidate' else 'role_reason'
                path=prefix.with_suffix(suffix)
                try:artifact,counts=build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert recorded[key][admission]=='REJECTED' and str(exc)==recorded[key][reason] and not path.exists()
                    result[admission]='REJECTED';result[reason]=str(exc)
                else:
                    assert recorded[key][admission]=='RETURNED' and path.exists()
                    with ExitStack() as stack:
                        for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                            (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                            (author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                        assert reload(row['owner'],row['snapshot'],path.read_text())==(artifact,counts)
                    result[admission]='RETURNED';result[kind+'_coverage']=counts
            replay.append(result)
    assert len(replay)==92
    out.mkdir()
    (out/'saved_replay.json').write_text(json.dumps(dict(model_loads=0,generations=0,updates=0,rows=replay),ensure_ascii=False,indent=2)+'\n')
    archive=w/'cocolon-analysis-aligned74-originals-20261103.zip'
    assert not archive.exists()
    members={}
    with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
        for p in sorted(root.rglob('*')):
            if p.is_file():
                name='run/'+str(p.relative_to(root));z.write(p,name);members[name]=sha(p)
        p=out/'saved_replay.json';z.write(p,p.name);members[p.name]=sha(p)
        for path in pack['api_source_blobs']:
            p=api/path;name='api-source/'+path;z.write(p,name);members[name]=sha(p)
        for name in ['semantic_units_aligned74_collect.py','aligned74-supervisor.log']:
            p=w/name;z.write(p,'extra/'+name);members['extra/'+name]=sha(p)
        z.writestr('export_manifest.json',json.dumps(members,indent=2)+'\n')
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert all(sha256(z.read(name)).hexdigest()==h for name,h in members.items())
    info=dict(status='COLLECTED_ALL_BYTES',archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive),
        members=len(members)+1,source_members=len(manifest)+1,replay_rows=92,
        adapter_sha256=report['adapter_sha256'],config_sha256=report['adapter_config_sha256'])
    (out/'collection.json').write_text(json.dumps(info,indent=2)+'\n')
    print(json.dumps(info))

if __name__=='__main__':main()
