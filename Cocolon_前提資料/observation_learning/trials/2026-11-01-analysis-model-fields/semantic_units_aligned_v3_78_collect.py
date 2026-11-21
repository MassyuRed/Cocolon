"""CPU saved106 replay and original-byte archive for the finite v3 alignment run.

Only the real v3 probe-after53 and new trained-after53 are evaluated. CPU shadow
rebindings are not generations. Saved readers prohibit Engine, both compilers
and both authors; admission comparison itself uses the existing builders.
Incomplete or inconsistent evidence is archived without model calls or retries.
"""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from hashlib import sha256, sha1
from unittest.mock import patch
import argparse
import json
import struct
import subprocess
import sys
import traceback
import zipfile


w = Path('/workspace')
root = w/'analysis-aligned-v3-78-20261103'
api = w/'analysis-reason-v3-api-20261103'
out = w/'analysis-aligned-v3-78-collected-20261103'
archive = w/'cocolon-analysis-aligned-v3-78-originals-20261103.zip'
probe = w/'analysis-reason-v3-probe53-20261103'
COMMIT = '58c47dd8d6512fdd7db5eb413a383925e8b31a87'
PROFILE = 'semantic_boundaries.v3'
STATE = 'cocolon.cmee.analysis_model_units_quoted_parents_state.semantic_boundaries.v3'
STATUS = 'ROOT_SYNTHETIC_ALIGNED_V3_78_FROM_EXPLICIT_9DC_NOT_PRODUCT_ACCEPTANCE'
OLD_PLAN_SHA = '72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
AUDIT_SHA = '69016aeb4f4ea03f2973f77742b5b9ca591d1f7ee7b75c428f7e904cb361c97b'
PROBE_CPU_SHA = '317b585868532c294e41b3e40cc9cd3236b90efb8e5060128b54037c11405533'
PROBE_REPORT_SHA = '75cb4f694907878e28595baf4dbe8ed813f91f0f5f3cc119c8b9d040f74d1415'
REVIEW_SHA = '81dce4e3ce71eeec347172eebc58e3b2604ea04010d4c96df69c321b6024e343'
INITIAL = {
    'adapter_model.safetensors':'9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a',
    'adapter_config.json':'4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce',
}
API_PATHS = (
    'ai/services/ai_inference/analysis_cumulative_service.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
    'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
    'ai/tests/test_analysis_model_quoted_parent_units.py',
    'ai/tools/serve_emlis_natural_reply.py',
)
SCRIPT_NAMES = tuple('semantic_units_aligned_v3_78_'+name+'.py'
    for name in ('prepare','run','supervisor','collect'))
sys.dont_write_bytecode = True
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()
canonical = lambda value: json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'))


def write(path,value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')


def manifest_mismatches(directory,manifest,complete=False):
    assert type(manifest) is dict and manifest
    mismatches = []
    for name,expected in manifest.items():
        path = Path(name)
        if path.is_absolute() or '..' in path.parts:
            mismatches.append(dict(path=name,reason='manifest_path_outside_root'))
            continue
        target = directory/path
        if not target.is_file():
            mismatches.append(dict(path=name,reason='missing'))
        elif sha(target) != expected:
            mismatches.append(dict(path=name,reason='sha256_mismatch'))
    if complete:
        actual = {str(path.relative_to(directory)) for path in directory.rglob('*')
            if path.is_file() and path != directory/'manifest.json'}
        for name in sorted(actual-set(manifest)):
            mismatches.append(dict(path=name,reason='file_not_in_manifest'))
    return mismatches


def replay_complete(pack,report):
    assert pack['status'] == STATUS and pack['api_commit'] == COMMIT
    plan = pack['plan']
    assert plan['prompt_version'] == PROFILE
    assert plan['initial_weights_sha256'] == INITIAL['adapter_model.safetensors']
    assert plan['initial_config_sha256'] == INITIAL['adapter_config.json']
    assert (plan['max_updates'],plan['max_teacher_measurements'],plan['max_seconds'],
        plan['max_new_generations'],plan['max_model_loads']) == (106,156,1200,53,2)
    assert len(pack['teachers']) == 78 and len(pack['evaluation']) == 53
    assert len({row['id'] for row in pack['teachers']}) == 78
    assert len({row['probe_id'] for row in pack['evaluation']}) == 53
    assert sum(bool(row['role_vertical']) for row in pack['evaluation']) == 16
    assert all(not row['pre_generation_required'] and 'assistant_target' not in row
        for row in pack['evaluation'])
    assert sha(root/'original78_plan.json') == pack['old78_plan_sha256'] == OLD_PLAN_SHA
    old = json.loads((root/'original78_plan.json').read_text())
    assert old['plan']['prompt_version'] == 'semantic_boundaries.v2'
    assert plan['update_order'] == old['plan']['update_order'] and len(plan['update_order']) == 106
    for before,after in zip(old['teachers'],pack['teachers']):
        for key in ('id','owner','snapshot','assistant_target'):
            assert before[key] == after[key]
    for key in ('learning_rate','seed','weight_decay','gradient_clip','training_objective',
            'measurement_objective','batch_size','gradient_accumulation','model','revision'):
        assert plan[key] == old['plan'][key]
    assert sha(root/'teacher_audit/result.json') == pack['teacher_audit_sha256'] == AUDIT_SHA
    audit = json.loads((root/'teacher_audit/result.json').read_text())
    assert audit['status'] == 'V3_TEACHERS78_CPU_AUDITED_NO_MODEL_NO_GPU_PLAN'
    assert audit['old78_source_target_order_unchanged'] and len(audit['rows']) == 78
    assert not manifest_mismatches(root/'teacher_audit',
        json.loads((root/'teacher_audit/manifest.json').read_text()))
    assert sha(root/'SOURCE_TARGET_REVIEW.md') == pack['source_review_sha256'] == REVIEW_SHA
    assert sha(root/'probe_cpu_result.json') == pack['probe_cpu_sha256'] == PROBE_CPU_SHA
    assert sha(root/'probe_report.json') == pack['probe_report_sha256'] == PROBE_REPORT_SHA
    probe_cpu = json.loads((root/'probe_cpu_result.json').read_text())
    probe_report = json.loads((root/'probe_report.json').read_text())
    assert probe_cpu['prompt_version'] == probe_report['prompt_version'] == PROFILE
    assert (probe_report['new_calls'],probe_report['model_loads'],
        probe_report['training_updates'],probe_report['nll_measurements']) == (53,1,0,0)
    assert probe_report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert probe_report['weights_sha256'] == INITIAL['adapter_model.safetensors']
    assert probe_report['config_sha256'] == INITIAL['adapter_config.json']
    assert len(probe_cpu['rows']) == 53
    assert (report['new_calls'],report['model_loads'],report['updates_completed'],
        report['measurement_forwards'],report['training_forwards']) == (53,2,106,156,106)
    assert report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert report['api_commit'] == COMMIT
    assert report['plan_sha256'] == sha(root/'semantic_units_aligned_v3_78_plan.json')
    codes = json.loads((root/'code_hashes.json').read_text())
    assert set(codes) == set(SCRIPT_NAMES) and all(sha(root/name) == value for name,value in codes.items())
    assert report['runner_sha256'] == codes['semantic_units_aligned_v3_78_run.py']
    assert report['prompt_version'] == PROFILE
    assert report['all_finished_stop'] and report['saved_adapter_nontraining_reload'] == 'MATCHED_112_TENSORS'
    assert report['training_initial_reload'] == 'MATCHED_ALL_112_SAVED_TENSORS'
    assert report['model_adopted'] is False and report['next_training_initial_selected'] is False
    assert report['initial_hashes'] == INITIAL and report['initial_adapter_unchanged']
    assert len(report['measurements']) == 2
    assert [row['phase'] for row in report['measurements']] == ['before_updates','after_updates']
    assert all(set(row['losses']) == {teacher['id'] for teacher in pack['teachers']}
        for row in report['measurements'])
    # Both NLL sets are newly measured with v3 messages. No cross-prefix NLL
    # equality with the historical v2 run is asserted or inferred here.
    gpu_after = json.loads((root/'gpu-after.json').read_text())
    assert gpu_after['exit'] == 0 and gpu_after['prior_nine_adapter_pairs_unchanged']
    assert gpu_after['compute_empty'] and not gpu_after['compute_apps'].strip()
    prior = gpu_after['prior_adapter_hashes']
    assert prior == json.loads((root/'adapter_hashes_before.json').read_text())
    assert len(prior) == 18 and all(sha(path) == expected for path,expected in prior.items())
    weights = root/'result/adapter/adapter_model.safetensors'
    config = root/'result/adapter/adapter_config.json'
    assert sha(weights) == report['adapter_sha256'] and sha(config) == report['adapter_config_sha256']
    # Read the saved original header; no tensor, base model or GPU is loaded.
    with weights.open('rb') as handle:
        header_size, = struct.unpack('<Q',handle.read(8))
        assert 0 < header_size < weights.stat().st_size-8
        header = json.loads(handle.read(header_size))
    tensors = {key:value for key,value in header.items() if key != '__metadata__'}
    assert len(tensors) == plan['trainable_tensors'] == 112
    parameters = 0
    for tensor in tensors.values():
        count = 1
        for dimension in tensor['shape']:
            assert type(dimension) is int and dimension > 0
            count *= dimension
        parameters += count
    assert parameters == plan['trainable_parameters'] == 3833856
    sys.path[:0] = [str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
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
    cpu_rows = {row['probe_id']:row for row in probe_cpu['rows']}
    original_calls = {row['probe_id']:row for row in probe_report['calls']}
    assert len(before_rows) == len(before) == len(report['calls']) == len(after) == 53
    assert set(before) == set(after) == set(cpu_rows) == set(original_calls)
    assert set(before) == {row['probe_id'] for row in pack['evaluation']}
    assert all(row['phase'] == 'after' and row['finish_reason'] == 'stop' for row in report['calls'])
    replay = []
    for phase,recorded in [('before',before),('after',after)]:
        for row in pack['evaluation']:
            key = row['probe_id']
            for field in ('owner','snapshot','request_ref','messages','role_vertical','training_use'):
                assert row[field] == cpu_rows[key][field]
            prefix = (root if phase == 'before' else root/'result')/(phase+'_'+key)
            p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
            assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
            request = json.loads(prefix.with_suffix('.request.json').read_text())
            response = json.loads(prefix.with_suffix('.response.json').read_text())
            raw = prefix.with_suffix('.raw.txt').read_bytes()
            assert request['request_ref'] == p.request_ref and request['messages'] == p.messages()
            assert request['messages_sha256'] == sha256(canonical(p.messages()).encode()).hexdigest()
            assert response['request_ref'] == p.request_ref
            assert response['messages_sha256'] == request['messages_sha256']
            assert response['raw'].encode() == raw and response['raw_sha256'] == sha256(raw).hexdigest()
            assert response['finish_reason'] == 'stop'
            if not row['role_vertical']: assert not prefix.with_suffix('.role.json').exists()
            if phase == 'before':
                entry = recorded[key]
                assert entry['source'] == 'REAL_V3_PROBE53_AFTER'
                assert entry['initial_weights_sha256'] == INITIAL['adapter_model.safetensors']
                assert entry['initial_config_sha256'] == INITIAL['adapter_config.json']
                expected_suffixes = {'.request.json','.response.json','.raw.txt'}
                if entry['admission'] == 'RETURNED': expected_suffixes.add('.candidate.json')
                if entry.get('role_admission') == 'RETURNED': expected_suffixes.add('.role.json')
                assert set(entry['source_files']) == expected_suffixes
                for suffix,source in entry['source_files'].items():
                    origin = probe/'result'/('after_'+key+suffix)
                    assert source['path'] == str(origin)
                    assert sha(origin) == source['sha256'] == sha(prefix.with_suffix(suffix))
                assert entry['admission'] == original_calls[key]['admission']
                assert original_calls[key]['raw_sha256'] == response['raw_sha256']
                assert original_calls[key]['finish_reason'] == 'stop'
                if entry['admission'] == 'REJECTED':
                    assert entry['reason'] == original_calls[key]['reason']
                if row['role_vertical']:
                    assert entry['role_admission'] == original_calls[key]['role_admission']
                    if entry['role_admission'] == 'REJECTED':
                        assert entry['role_reason'] == original_calls[key]['role_reason']
            else:
                assert recorded[key]['raw_sha256'] == response['raw_sha256']
            value = replace(p,response=AnalysisModelQuotedParentUnitsResponse(**response))
            result = dict(phase=phase,probe_id=key,prompt_version=PROFILE,
                response_raw_sha256=response['raw_sha256'],real_generation=True,
                source='REAL_V3_PROBE53_AFTER' if phase == 'before' else 'NEW_V3_ALIGNED78_AFTER')
            for kind,build,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
                if kind == 'role' and not row['role_vertical']: continue
                admission = 'admission' if kind == 'candidate' else 'role_admission'
                reason = 'reason' if kind == 'candidate' else 'role_reason'
                path = prefix.with_suffix(suffix)
                try:
                    artifact,counts = build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert recorded[key][admission] == 'REJECTED'
                    assert str(exc) == recorded[key][reason] and not path.exists()
                    result[admission],result[reason] = 'REJECTED',str(exc)
                else:
                    assert recorded[key][admission] == 'RETURNED' and path.exists()
                    saved_packet = json.loads(path.read_text())
                    assert saved_packet['state']['prompt_version'] == PROFILE
                    assert saved_packet['state']['request_ref'] == p.request_ref
                    assert saved_packet['state']['response'] == response
                    assert saved_packet['coverage'] == counts
                    if kind == 'candidate':
                        assert saved_packet['state']['schema_version'] == STATE
                        assert counts['mapped_count'] == 0
                        expected_counts = recorded[key].get('candidate_coverage',recorded[key].get('coverage'))
                    else:
                        expected_counts = recorded[key].get('role_coverage')
                    assert expected_counts == counts
                    with ExitStack() as stack:
                        for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                                (author,'realize_model_written_role_graph')]:
                            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                        assert reload(row['owner'],row['snapshot'],path.read_text()) == (artifact,counts)
                    result[admission] = 'RETURNED'
                    result[kind+'_coverage'] = counts
                    result[kind+'_file_replay'] = 'MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
            replay.append(result)
    assert len(replay) == 106 and sum('role_admission' in row for row in replay) == 32
    return dict(status='SAVED106_REAL_V3_BEFORE_AFTER_REPLAY_MATCHED',model_loads=0,generations=0,
        updates=0,nll_measurements=0,real_saved_generations=106,cpu_shadow_generations=0,
        before_prompt_version=PROFILE,after_prompt_version=PROFILE,
        saved_reader_engine_both_compilers_both_authors_prohibited=True,
        admission_comparison_uses_existing_build=True,adapter_tensors=112,adapter_parameters=parameters,rows=replay)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-commit',required=True)
    parser.add_argument('--supervisor-log',type=Path,default=w/'aligned-v3-78-supervisor.log')
    parser.add_argument('--archive-only',action='store_true')
    args = parser.parse_args()
    assert root.is_dir() and not out.exists() and not archive.exists()
    # A supervisor terminal marker is required so collection cannot race a run.
    assert (root/'gpu-after.json').is_file()
    out.mkdir()
    preflight_errors = []
    missing_extras = []
    missing_api_files = []
    manifest = pack = report = None

    def inspect(label,call):
        try:
            return call()
        except BaseException as exc:
            preflight_errors.append(dict(check=label,error_type=type(exc).__name__,error=str(exc),
                traceback=traceback.format_exc()))
            return None

    manifest = inspect('source_manifest_read',lambda:json.loads((root/'manifest.json').read_text()))
    source_mismatches = inspect('source_manifest_compare',
        lambda:manifest_mismatches(root,manifest,complete=True)) if manifest is not None else None
    if source_mismatches:
        preflight_errors.append(dict(check='source_manifest_compare',mismatches=source_mismatches))
    plan_path = root/'semantic_units_aligned_v3_78_plan.json'
    report_path = root/'result/report.json'
    pack = inspect('plan_read',lambda:json.loads(plan_path.read_text())) if plan_path.is_file() else None
    report = inspect('report_read',lambda:json.loads(report_path.read_text())) if report_path.is_file() else None
    run_exit = inspect('run_exit_read',lambda:(root/'run.exit').read_text()) if (root/'run.exit').is_file() else None

    def check_api():
        assert args.api_commit == COMMIT
        assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
        assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
        if pack is not None:
            assert pack['api_commit'] == COMMIT and set(pack['api_source_blobs']) == set(API_PATHS)
        for path in API_PATHS:
            data = (api/path).read_bytes()
            actual = sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
            expected = subprocess.check_output(['git','-C',str(api),'rev-parse',COMMIT+':'+path],text=True).strip()
            assert actual == expected
            if pack is not None: assert actual == pack['api_source_blobs'][path]
        return True

    api_ok = inspect('api_commit_clean_six_blobs',check_api) is True
    complete = bool(run_exit == '0' and pack is not None and report is not None
        and report.get('status') == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
        and manifest is not None and source_mismatches == [] and api_ok and not preflight_errors)
    mode = 'COMPLETE_SAVED_REPLAY' if complete and not args.archive_only else 'PARTIAL_ARCHIVE_ONLY_NO_RETRY'
    replay_error = None
    if mode == 'COMPLETE_SAVED_REPLAY':
        try:
            write(out/'saved_replay.json',replay_complete(pack,report))
        except BaseException as exc:
            replay_error = dict(error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
            write(out/'saved_replay_error.json',replay_error)
            mode = 'REPLAY_FAILED_ARCHIVE_ONLY_NO_RETRY'
    if preflight_errors: write(out/'preflight_errors.json',preflight_errors)
    members,sizes,source_snapshot,archive_read_errors = {},{},{},[]
    extras = [(Path(__file__),'extra/semantic_units_aligned_v3_78_collect.py'),
        (args.supervisor_log,'extra/aligned-v3-78-supervisor.log')]
    root_files = [path for path in sorted(root.rglob('*')) if path.is_file()]
    with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED) as z:
        def add(path,name):
            assert name not in members
            try:
                data = path.read_bytes()
            except OSError as exc:
                archive_read_errors.append(dict(path=str(path),archive_name=name,
                    error_type=type(exc).__name__,error=str(exc)))
                return
            z.writestr(name,data)
            members[name],sizes[name] = sha256(data).hexdigest(),len(data)
            if name.startswith('run/'): source_snapshot[str(path.relative_to(root))] = members[name]

        for path in root_files: add(path,'run/'+str(path.relative_to(root)))
        for path in sorted(out.rglob('*')):
            if path.is_file(): add(path,str(path.relative_to(out)))
        for path in API_PATHS:
            if (api/path).is_file(): add(api/path,'api-source/'+path)
            else: missing_api_files.append(path)
        for path,name in extras:
            if path.is_file(): add(path,name)
            else: missing_extras.append(dict(path=str(path),archive_name=name))
        write(out/'export_context.json',dict(mode=mode,run_exit=run_exit,
            original_report_status=report.get('status') if report else None,
            original_plan_present=pack is not None,api_commit_verified=api_ok,
            source_manifest_present=manifest is not None,source_manifest_mismatches=source_mismatches,
            preflight_errors=preflight_errors,replay_error=replay_error is not None,
            archive_read_errors=archive_read_errors,missing_api_files=missing_api_files,missing_extras=missing_extras,
            model_loads=0,generations=0,updates=0,nll_measurements=0,
            real_saved_replay_rows=106 if mode == 'COMPLETE_SAVED_REPLAY' else 0,
            cpu_shadow_generations=0,old_weights_copied=False,
            new_saved_weights_in_root=(root/'result/adapter/adapter_model.safetensors').is_file()))
        add(out/'export_context.json','export_context.json')
        size_bytes = (json.dumps(sizes,indent=2)+'\n').encode()
        z.writestr('export_member_sizes.json',size_bytes)
        members['export_member_sizes.json'] = sha256(size_bytes).hexdigest()
        z.writestr('export_manifest.json',json.dumps(members,indent=2)+'\n')
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(members)+1 and len(set(z.namelist())) == len(z.namelist())
        assert all(sha256(z.read(name)).hexdigest() == expected for name,expected in members.items())
        assert all(len(z.read(name)) == size for name,size in sizes.items())
        assert z.read('export_member_sizes.json') == size_bytes
    # Source stability is checked against the exact archived bytes, even when
    # a pre-existing source manifest was already inconsistent.
    changed = []
    for name,expected in source_snapshot.items():
        path = root/name
        if not path.is_file() or sha(path) != expected: changed.append(name)
    current_files = {str(path.relative_to(root)) for path in root.rglob('*') if path.is_file()}
    changed.extend(sorted(current_files-set(source_snapshot)))
    intact = not archive_read_errors and not changed and not missing_api_files and not missing_extras
    status = 'COLLECTED_ALL_BYTES' if intact and replay_error is None else 'COLLECTED_BYTES_WITH_RECORDED_ERRORS'
    info = dict(status=status,mode=mode,archive=str(archive),bytes=archive.stat().st_size,
        sha256=sha(archive),members=len(members)+1,source_members=len(source_snapshot),
        replay_rows=106 if mode == 'COMPLETE_SAVED_REPLAY' else 0,
        model_loads=0,generations=0,updates=0,nll_measurements=0,cpu_shadow_generations=0,
        crc_all_matched=True,member_bytes_sha256_verified=True,source_bytes_unchanged=not changed,
        source_changed_paths=changed,preflight_errors=preflight_errors,replay_error=replay_error is not None,
        archive_read_errors=archive_read_errors,missing_api_files=missing_api_files,missing_extras=missing_extras,
        adapter_sha256=report.get('adapter_sha256') if report else None,
        config_sha256=report.get('adapter_config_sha256') if report else None)
    write(out/'collection.json',info)
    print(json.dumps(info))
    return 0 if intact and replay_error is None and not preflight_errors else 1


if __name__ == '__main__': raise SystemExit(main())
