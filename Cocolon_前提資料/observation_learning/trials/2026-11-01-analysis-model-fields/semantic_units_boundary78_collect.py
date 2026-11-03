"""CPU-only saved106 replay and complete/partial byte archive; never rerun a model.

Build calls rederive candidate admission for comparison. Only saved-reader calls
are executed with Engine, both compilers and both authors prohibited.
"""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from hashlib import sha256, sha1
from unittest.mock import patch
import argparse, json, struct, subprocess, sys, traceback, zipfile

w = Path('/workspace')
root = w/'analysis-boundary78-20261103'
api = w/'analysis-semantic-boundaries-api-20261103'
out = w/'analysis-boundary78-collected-20261103'
archive = w/'cocolon-analysis-boundary78-originals-20261103.zip'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
API_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tests/test_analysis_model_quoted_parent_units.py',
    'ai/tools/serve_emlis_natural_reply.py',
)
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()
canonical = lambda x: json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))


def replay_complete(pack,report):
    assert pack['status'] == 'ROOT_SYNTHETIC_BOUNDARY78_FROM_SAVED_9DC_NOT_PRODUCT_ACCEPTANCE'
    assert pack['api_commit'] == COMMIT and pack['plan']['prompt_version'] == 'semantic_boundaries.v2'
    assert len(pack['teachers']) == 78 and len(pack['evaluation']) == 53
    assert sum(bool(row['role_vertical']) for row in pack['evaluation']) == 16
    assert (report['new_calls'],report['model_loads'],report['updates_completed'],report['measurement_forwards']) == (53,2,106,156)
    assert report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert report['plan_sha256'] == sha(root/'semantic_units_boundary78_plan.json')
    assert report['all_finished_stop'] and report['saved_adapter_nontraining_reload'] == 'MATCHED_112_TENSORS'
    gpu_after = json.loads((root/'gpu-after.json').read_text())
    assert gpu_after['exit'] == 0 and gpu_after['prior_eight_adapter_pairs_unchanged'] and gpu_after['compute_empty']
    prior = gpu_after['prior_adapter_hashes']
    assert len(prior) == 16 and all(sha(path) == expected for path,expected in prior.items())
    assert report['initial_hashes'] == {
        'adapter_model.safetensors':'9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a',
        'adapter_config.json':'4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'}
    weights = root/'result/adapter/adapter_model.safetensors'
    config = root/'result/adapter/adapter_config.json'
    assert sha(weights) == report['adapter_sha256'] and sha(config) == report['adapter_config_sha256']
    # Inspect the original safetensors header only; no tensors/model/GPU are loaded.
    with weights.open('rb') as f:
        header_size, = struct.unpack('<Q',f.read(8))
        assert 0 < header_size < weights.stat().st_size-8
        header = json.loads(f.read(header_size))
    tensors = {k:v for k,v in header.items() if k != '__metadata__'}
    assert len(tensors) == pack['plan']['trainable_tensors'] == 112
    parameters = 0
    for tensor in tensors.values():
        count = 1
        for dimension in tensor['shape']: count *= dimension
        parameters += count
    assert parameters == pack['plan']['trainable_parameters'] == 3833856
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    before_rows = json.loads((root/'reused_before.json').read_text())
    before = {row['probe_id']:row for row in before_rows}
    after = {row['probe_id']:row for row in report['calls']}
    assert len(before_rows) == len(before) == len(report['calls']) == len(after) == 53
    assert set(before) == set(after) == {row['probe_id'] for row in pack['evaluation']}
    assert all(row['phase'] == 'after' and row['finish_reason'] == 'stop' for row in report['calls'])
    replay = []
    for phase,recorded in [('before',before),('after',after)]:
        for row in pack['evaluation']:
            key = row['probe_id']
            prefix = (root if phase == 'before' else root/'result')/(phase+'_'+key)
            p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],
                prompt_version=pack['plan']['prompt_version'])
            assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
            request = json.loads(prefix.with_suffix('.request.json').read_text())
            resp = json.loads(prefix.with_suffix('.response.json').read_text())
            raw = prefix.with_suffix('.raw.txt').read_bytes()
            assert request['request_ref'] == p.request_ref and request['messages'] == p.messages()
            assert request['messages_sha256'] == sha256(canonical(p.messages()).encode()).hexdigest()
            assert resp['request_ref'] == p.request_ref and resp['messages_sha256'] == request['messages_sha256']
            assert resp['raw'].encode() == raw and resp['raw_sha256'] == sha256(raw).hexdigest()
            assert resp['finish_reason'] == 'stop'
            value = replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
            result = dict(phase=phase,probe_id=key)
            for kind,build,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
                if kind == 'role' and not row['role_vertical']: continue
                admission = 'admission' if kind == 'candidate' else 'role_admission'
                reason = 'reason' if kind == 'candidate' else 'role_reason'
                path = prefix.with_suffix(suffix)
                try: artifact,counts = build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert recorded[key][admission] == 'REJECTED' and str(exc) == recorded[key][reason] and not path.exists()
                    result[admission] = 'REJECTED'
                    result[reason] = str(exc)
                else:
                    assert recorded[key][admission] == 'RETURNED' and path.exists()
                    with ExitStack() as stack:
                        for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                            (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                            (author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                        assert reload(row['owner'],row['snapshot'],path.read_text()) == (artifact,counts)
                    result[admission] = 'RETURNED'
                    result[kind+'_coverage'] = counts
            replay.append(result)
    assert len(replay) == 106
    assert sum('role_admission' in row for row in replay) == 2*sum(bool(row['role_vertical']) for row in pack['evaluation'])
    return dict(status='SAVED106_REPLAY_MATCHED',model_loads=0,generations=0,updates=0,
        saved_reader_engine_both_compilers_both_authors_prohibited=True,
        admission_comparison_uses_existing_build=True,adapter_tensors=112,adapter_parameters=parameters,rows=replay)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--audit',required=True,type=Path)
    parser.add_argument('--supervisor-log',type=Path,default=w/'boundary78-supervisor.log')
    parser.add_argument('--archive-only',action='store_true')
    args = parser.parse_args()
    assert root.is_dir() and not out.exists() and not archive.exists()
    # The run must already be terminal, including a CPU-only/partial failure.
    assert (root/'gpu-after.json').is_file() and (root/'manifest.json').is_file()
    manifest = json.loads((root/'manifest.json').read_text())
    assert manifest and all(sha(root/path) == expected for path,expected in manifest.items())
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    out.mkdir()
    plan_path = root/'semantic_units_boundary78_plan.json'
    report_path = root/'result/report.json'
    pack = json.loads(plan_path.read_text()) if plan_path.is_file() else None
    report = json.loads(report_path.read_text()) if report_path.is_file() else None
    run_exit = (root/'run.exit').read_text() if (root/'run.exit').is_file() else None
    complete = run_exit == '0' and report is not None and report.get('status') == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    mode = 'COMPLETE_SAVED_REPLAY' if complete and not args.archive_only else 'PARTIAL_ARCHIVE_ONLY'
    replay_error = None
    if mode == 'COMPLETE_SAVED_REPLAY':
        try:
            result = replay_complete(pack,report)
            (out/'saved_replay.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        except BaseException as exc:
            replay_error = dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
            (out/'saved_replay_error.json').write_text(json.dumps(replay_error,ensure_ascii=False,indent=2)+'\n')
            mode = 'REPLAY_FAILED_ARCHIVE_ONLY_NO_RETRY'
    api_paths = tuple(pack['api_source_blobs']) if pack is not None else API_PATHS
    assert set(api_paths) == set(API_PATHS)
    for path in api_paths:
        if pack is not None:
            b = (api/path).read_bytes()
            assert sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest() == pack['api_source_blobs'][path]
    missing_extras = []
    extras = [(Path(__file__),'extra/semantic_units_boundary78_collect.py'),
        (args.supervisor_log,'extra/boundary78-supervisor.log'),
        (args.audit,'extra/role_boundary_audit.json')]
    members = {}
    sizes = {}
    with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
        def add(path,name):
            assert name not in members
            data = path.read_bytes()
            z.writestr(name,data)
            members[name] = sha256(data).hexdigest()
            sizes[name] = len(data)
        for path in sorted(root.rglob('*')):
            if path.is_file(): add(path,'run/'+str(path.relative_to(root)))
        for path in sorted(out.rglob('*')):
            if path.is_file(): add(path,str(path.relative_to(out)))
        for path in api_paths: add(api/path,'api-source/'+path)
        for path,name in extras:
            if path.is_file(): add(path,name)
            else: missing_extras.append(dict(path=str(path),archive_name=name))
        (out/'export_context.json').write_text(json.dumps(dict(mode=mode,run_exit=run_exit,
            original_report_status=report.get('status') if report else None,
            model_loads=0,generations=0,updates=0,missing_extras=missing_extras,
            replay_error=replay_error is not None),indent=2)+'\n')
        add(out/'export_context.json','export_context.json')
        size_bytes=(json.dumps(sizes,indent=2)+'\n').encode()
        z.writestr('export_member_sizes.json',size_bytes)
        members['export_member_sizes.json']=sha256(size_bytes).hexdigest()
        z.writestr('export_manifest.json',json.dumps(members,indent=2)+'\n')
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(members)+1 and len(set(z.namelist())) == len(z.namelist())
        assert all(sha256(z.read(name)).hexdigest() == expected for name,expected in members.items())
        assert all(len(z.read(name)) == size for name,size in sizes.items())
    assert all(sha(root/path) == expected for path,expected in manifest.items())
    info = dict(status='COLLECTED_ALL_BYTES' if replay_error is None else 'COLLECTED_BYTES_REPLAY_FAILED',
        mode=mode,archive=str(archive),bytes=archive.stat().st_size,sha256=sha(archive),members=len(members)+1,
        source_members=len(manifest)+1,replay_rows=106 if mode=='COMPLETE_SAVED_REPLAY' else 0,
        model_loads=0,generations=0,updates=0,missing_extras=missing_extras,
        adapter_sha256=report.get('adapter_sha256') if report else None,
        config_sha256=report.get('adapter_config_sha256') if report else None)
    (out/'collection.json').write_text(json.dumps(info,indent=2)+'\n')
    print(json.dumps(info))
    return 1 if replay_error is not None or missing_extras else 0


if __name__ == '__main__': raise SystemExit(main())
