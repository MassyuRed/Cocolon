"""CPU-bind unchanged74 plus two private source-authored reason/unknown contrasts.

The private file is SHA-bound by a required argument. No source body is embedded
here. Reuse exact saved d25/v2 after46+after4 as before50; no model calls.
"""
from pathlib import Path
from dataclasses import replace
from contextlib import ExitStack
from hashlib import sha256, sha1
from unittest.mock import patch
import argparse, copy, json, re, subprocess, sys

w = Path('/workspace')
api = w/'analysis-semantic-boundaries-api-20261103'
aligned = w/'analysis-aligned74-20261103'
transfer = w/'analysis-role-transfer4-20261103'
source = w/'reason-unknown76-sources.json'
out = w/'analysis-reason-unknown76-prepared-20261103'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
OLD_PLAN_SHA = '868ae97435fcb98b4c6d8806c2b9eadfca080f4043b38c1e490e230ad77d6ab4'
WEIGHTS = 'd25da0a00dc575b3035b26be1f6d5d52ee3f0291c746d87fead7bfd12146c648'
CONFIG = '4a46d90dfe81c1c99eaf6abcff01aeede7dadfaa9d9abaafb866ff2da01137dd'
PROFILE = 'semantic_boundaries.v2'
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,default=source)
    parser.add_argument('--source-sha256',required=True)
    args = parser.parse_args()
    source_path = args.source
    assert re.fullmatch('[0-9a-f]{64}',args.source_sha256)
    assert not out.exists() and sha(source_path) == args.source_sha256
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (aligned/'run.exit').read_text() == '0' and (transfer/'run.exit').read_text() == '0'
    oldfile = aligned/'semantic_units_aligned74_plan.json'
    assert sha(oldfile) == OLD_PLAN_SHA
    original = json.loads(oldfile.read_text())
    aligned_report = json.loads((aligned/'result/report.json').read_text())
    transfer_cpu = json.loads((transfer/'result.json').read_text())
    transfer_report = json.loads((transfer/'result/report.json').read_text())
    spec = json.loads(source_path.read_text())
    assert spec['schema_version'] == 'cocolon.analysis.reason_unknown76.sources.v1'
    assert spec['api_commit'] == COMMIT and spec['old_plan_sha256'] == OLD_PLAN_SHA
    assert len(original['teachers']) == 74 and len(original['evaluation']) == 46
    assert original['plan']['prompt_version'] == PROFILE and len(original['plan']['update_order']) == 86
    assert aligned_report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert (aligned_report['updates_completed'],aligned_report['new_calls'],aligned_report['model_loads']) == (86,46,2)
    assert (aligned_report['adapter_sha256'],aligned_report['adapter_config_sha256']) == (WEIGHTS,CONFIG)
    initial = aligned/'result/adapter'
    assert sha(initial/'adapter_model.safetensors') == WEIGHTS and sha(initial/'adapter_config.json') == CONFIG
    assert transfer_cpu['status'] == 'ROLE_TRANSFER4_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
    assert transfer_report['status'] == 'COMPLETE_PENDING_RAW_READ_NOT_ADOPTED'
    assert (transfer_report['new_calls'],transfer_report['model_loads'],transfer_report['training_updates']) == (8,2,0)
    assert transfer_report['prompt_version'] == transfer_cpu['prompt_version'] == PROFILE
    assert len(transfer_cpu['rows']) == 4
    for oldroot in (aligned,transfer):
        manifest = json.loads((oldroot/'manifest.json').read_text())
        assert all(sha(oldroot/path) == expected for path,expected in manifest.items())
    lessons = spec['teachers']
    assert type(lessons) is list and len(lessons) == 2
    assert [row['id'] for row in lessons] == ['RU01','RU02']
    assert spec['update_order'] == ['RU01','RU02','RU01','RU02']
    assert all(type(row) is dict and set(row) == {'id','text','units'} and type(row['text']) is str
        and bool(row['text'].strip()) and type(row['units']) is list for row in lessons)
    assert lessons[0]['text'] != lessons[1]['text']
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained(original['plan']['model'],revision=original['plan']['revision'],
        local_files_only=True,trust_remote_code=False)
    out.mkdir()
    (out/'sources.json').write_bytes(source_path.read_bytes())

    def response(p,raw):
        return AnalysisModelQuotedParentUnitsResponse(p.request_ref,sha256(canonical(p.messages()).encode()).hexdigest(),
            sha256(raw.encode()).hexdigest(),'stop',raw)

    def restore(reload,row,path):
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                (author,'realize_model_written_role_graph')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
            return reload(row['owner'],row['snapshot'],path.read_text())

    evaluation = []
    reused = []
    before_target_values = set()
    origins = [(copy.deepcopy(row),aligned,aligned_report) for row in original['evaluation']]
    for source_row in transfer_cpu['rows']:
        row = {key:copy.deepcopy(source_row[key]) for key in ('probe_id','owner','snapshot','request_ref','messages','provenance')}
        row.update(training_use=False,role_vertical=True,pre_generation_required=False)
        origins.append((row,transfer,transfer_report))
    assert len(origins) == 50
    for row,origin,report in origins:
        key = row['probe_id']
        p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
        row.update(pre_generation_required=False)
        prefix = origin/'result'/('after_'+key)
        request = json.loads(prefix.with_suffix('.request.json').read_text())
        resp = json.loads(prefix.with_suffix('.response.json').read_text())
        raw = prefix.with_suffix('.raw.txt').read_bytes()
        assert request['request_ref'] == p.request_ref and request['messages'] == p.messages()
        assert request['messages_sha256'] == sha256(canonical(p.messages()).encode()).hexdigest()
        assert resp['request_ref'] == p.request_ref and resp['messages_sha256'] == request['messages_sha256']
        assert resp['raw'].encode() == raw and resp['raw_sha256'] == sha256(raw).hexdigest()
        assert resp['finish_reason'] == 'stop'
        before_target_values.add(canonical(json.loads(resp['raw'])))
        recorded = next(call for call in report['calls'] if call['phase'] == 'after' and call['probe_id'] == key)
        if origin == transfer:
            assert (recorded['weights_sha256'],recorded['config_sha256']) == (WEIGHTS,CONFIG)
        value = replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
        entry = dict(probe_id=key,source='ALIGNED74_AFTER46' if origin == aligned else 'ROLE_TRANSFER4_AFTER4',
            initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,source_files={})
        for suffix in ('.request.json','.response.json','.raw.txt','.candidate.json','.role.json'):
            src = prefix.with_suffix(suffix)
            if src.exists():
                (out/('before_'+key+suffix)).write_bytes(src.read_bytes())
                entry['source_files'][suffix] = dict(path=str(src),sha256=sha(src))
        for kind,build,reload,suffix in [
            ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
            ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
            if kind == 'role' and not row['role_vertical']: continue
            admission = 'admission' if kind == 'candidate' else 'role_admission'
            reason = 'reason' if kind == 'candidate' else 'role_reason'
            path = out/('before_'+key+suffix)
            try: artifact,counts = build(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                assert recorded[admission] == 'REJECTED' and str(exc) == recorded[reason] and not path.exists()
                entry.update({admission:'REJECTED',reason:str(exc)})
            else:
                assert recorded[admission] == 'RETURNED' and path.exists()
                assert restore(reload,row,path) == (artifact,counts)
                entry.update({admission:'RETURNED',kind+'_coverage':counts})
        tokens = tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        assert len(tokens)+2048 <= 8192
        row['prompt_tokens'] = len(tokens)
        evaluation.append(row)
        reused.append(entry)
    assert len(evaluation) == len(reused) == len({row['probe_id'] for row in evaluation}) == 50
    assert len({canonical([row['owner'],row['snapshot']]) for row in evaluation}) == 50
    oldrows = original['teachers']+evaluation
    oldtexts = {m['original'].get(field,'') for row in oldrows for m in row['snapshot']['members']
        for field in ('memo','memo_action') if m['original'].get(field,'')}
    oldpairs = {(m['original'].get('memo',''),m['original'].get('memo_action',''))
        for row in oldrows for m in row['snapshot']['members']}
    oldids = {m['original']['id'] for row in oldrows for m in row['snapshot']['members']}
    oldkeys = {row.get('id',row.get('probe_id')) for row in oldrows}
    old_target_values = {canonical(json.loads(row['assistant_target'])) for row in original['teachers']}
    teachers = copy.deepcopy(original['teachers'])
    new_source_values = set()
    new_target_values = set()
    for index,lesson in enumerate(lessons):
        key,text = lesson['id'],lesson['text']
        assert key not in oldkeys and text not in oldtexts and (text,'') not in oldpairs
        raw = canonical(dict(fields=[dict(field=1,units=lesson['units'])]))
        assert raw not in old_target_values and raw not in before_target_values and raw not in new_target_values
        assert text not in new_source_values
        new_source_values.add(text)
        new_target_values.add(raw)
        snap = copy.deepcopy(original['teachers'][0]['snapshot'])
        snap['members'] = snap['members'][:1]
        identifier = '00000000-0000-0000-0000-%012d' % (92005+index)
        assert identifier not in oldids
        snap['members'][0]['original'].update(id=identifier,memo=text,memo_action='')
        owner = original['teachers'][0]['owner']
        p = service.prepare_cumulative_quoted_parent_units(owner,snap,prompt_version=PROFILE)
        material = json.loads(p.messages()[1]['content'])
        assert len(material['fields']) == 1 and material['fields'][0]['text'] == text
        assert material['fields'][0]['field_path'] == 'memo'
        row = dict(id=key,owner=owner,snapshot=snap,request_ref=p.request_ref,messages=p.messages(),
            assistant_target=raw,training_use=True,role_vertical=False,
            provenance='ROOT_SYNTHETIC_SOURCE_AUTHORED_REASON_UNKNOWN_CONTRAST_NOT_MODEL_RAW_NOT_MASH_TEACHING_NOT_BLIND')
        teachers.append(row)
    assert len(teachers) == len({row['id'] for row in teachers}) == 76
    assert canonical(teachers[:74]) == canonical(original['teachers'])
    checks = []
    for row in teachers:
        p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
        raw = row['assistant_target']
        value = replace(p,response=response(p,raw))
        artifact,counts = service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
        if row['id'] not in {'RU01','RU02'}:
            assert artifact.candidate_id == row['source_bound_candidate_id']
        else:
            row['source_bound_candidate_id'] = artifact.candidate_id
        path = out/('teacher_'+row['id']+'.units.json')
        path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
            model_input=value,artifact=artifact,coverage=counts))
        assert restore(service.reload_cumulative_quoted_parent_candidates,row,path) == (artifact,counts)
        if row['id'] in {'T01','T02','T03','T04'}:
            role,coverage = service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
            assert role.artifact_id == row['role_artifact_id']
            path = out/('teacher_'+row['id']+'.role.json')
            path.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],
                model_input=value,artifact=role,coverage=coverage))
            assert restore(service.reload_cumulative_written_role_map,row,path) == (role,coverage)
        prompt = tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        full = tok.apply_chat_template(row['messages']+[dict(role='assistant',content=raw)],enable_thinking=False,
            add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt)+2048 <= 8192 and len(prompt) < len(full) <= 8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False) == raw+'<|im_end|>\n'
        checks.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full)))
    assert canonical(teachers[:74]) == canonical(original['teachers'])
    order = original['plan']['update_order']+spec['update_order']
    assert len(order) == 90 and order[:86] == original['plan']['update_order']
    assert order[86:] == ['RU01','RU02','RU01','RU02']
    assert set(order) == {row['id'] for row in teachers}
    assert all(order.count(key) == 2 for key in ('RU01','RU02'))
    plan = copy.deepcopy(original['plan'])
    plan.update(max_updates=90,max_new_generations=50,max_model_loads=2,max_teacher_measurements=152,
        max_training_forwards=90,learning_rate=1e-5,gradient_clip=1.,seed=20261111,
        max_seconds=900,request_seconds=23,context_tokens=8192,max_new_tokens=2048,
        outer_timeout_term_seconds=890,outer_kill_grace_seconds=10,prompt_version=PROFILE,
        initial='EXPLICIT_SAVED_D25_OLD74_PLUS_SOURCE_REASON_UNKNOWN2_NOT_INTERRUPTED_RESUME',
        initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,
        initial_private_library_file_id='libfile_9e641f4df39081919d7a396d40fc43c0',
        update_order=order,evaluation_scope='same50 d25/v2 before reused;old46+new-role4;seen synthetic development not blind/general/Mash acceptance',
        retention='Old74 full dictionaries unchanged;old86 order is exact prefix;new source-authored2 append twice;no all-object split rule',
        stop_condition='900s/50calls/90updates/2loads;no retry/extra epoch/raw repair/receiver relaxation;preserve partial')
    paths = ['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py','ai/tools/serve_emlis_natural_reply.py']
    blobs = {path:sha1(b'blob '+str(len((api/path).read_bytes())).encode()+b'\0'+(api/path).read_bytes()).hexdigest() for path in paths}
    pack = dict(status='ROOT_SYNTHETIC_REASON_UNKNOWN76_FROM_SAVED_D25_NOT_PRODUCT_ACCEPTANCE',api_commit=COMMIT,
        teachers=teachers,evaluation=evaluation,preexisting_evaluation=[row['probe_id'] for row in evaluation],
        plan=plan,api_source_blobs=blobs,old74_plan_sha256=OLD_PLAN_SHA,
        private_source_sha256=args.source_sha256,aligned_report_sha256=sha(aligned/'result/report.json'),
        transfer_report_sha256=sha(transfer/'result/report.json'),old74_source_target_order_unchanged=True,
        new_sources_exact_nonempty_match_count=0,new_source_pair_match_count=0,new_targets_exact_json_match_count=0)
    assert sha(source_path) == args.source_sha256 and sha(oldfile) == OLD_PLAN_SHA
    (out/'semantic_units_reason_unknown76_plan.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
    (out/'reused_before.json').write_text(json.dumps(reused,ensure_ascii=False,indent=2)+'\n')
    (out/'semantic_units_reason_unknown76_cpu.json').write_text(json.dumps(dict(status='CPU_PREPARED',teachers=76,
        old74_unchanged=True,old86_prefix_unchanged=True,new2_update_order=spec['update_order'],
        private_source_sha256=args.source_sha256,prompt_version=PROFILE,typed_role_teachers=4,
        updates=90,measurements_cap=152,after=50,before_reused=50,before_new=0,
        new_source_nonempty_exact_matches=0,new_source_pair_matches=0,new_target_exact_json_matches=0,
        empty_fields_excluded='One nonempty field retained;blank action is plumbing,not novelty',
        model_loads=0,new_generations=0,training_updates=0,token_checks=checks),ensure_ascii=False,indent=2)+'\n')
    (out/'manifest.json').write_text(json.dumps({str(path.relative_to(out)):sha(path)
        for path in out.rglob('*') if path.is_file()},indent=2)+'\n')
    print('REASON_UNKNOWN76_CPU_PREPARED',sha(out/'semantic_units_reason_unknown76_plan.json'))


if __name__ == '__main__': main()
