"""Align unchanged source-authored74 targets/order with v2; reuse saved73ee/v2 before46."""
from pathlib import Path
from dataclasses import replace
from hashlib import sha256, sha1
from unittest.mock import patch
from contextlib import ExitStack
import copy, json, sys, subprocess

w = Path('/workspace')
api = w / 'analysis-semantic-boundaries-api-20261103'
old = w / 'analysis-written-role74-20261103'
bound = w / 'analysis-semantic-boundaries46-20261103'
out = w / 'analysis-aligned74-prepared-20261103'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
PROFILE = 'semantic_boundaries.v2'
WEIGHTS = '73ee8d05a2e9be611df8654f4a583c87b3d27f266bedfe700f25f2d5325eae96'
CONFIG = '07262234563cbca51bfe75c3d6797b04cf89e7569f4cd0ee862e664ba5638685'
sys.dont_write_bytecode = True
sys.path[:0] = [str(api/'ai/tools'), str(api/'ai/services/ai_inference')]
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not out.exists()
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    assert (old/'run.exit').read_text() == '0' and (bound/'run.exit').read_text() == '0'
    oldfile = old/'semantic_units_written_role74_plan.json'
    assert sha(oldfile) == 'a557550ee2881814ece6e0c60eee0ece8abc57b9db6b276cf56750ecedc09ec8'
    original = json.loads(oldfile.read_text())
    oldreport = json.loads((old/'result/report.json').read_text())
    prior = json.loads((bound/'plan.json').read_text())
    report = json.loads((bound/'result/report.json').read_text())
    assert sha(bound/'plan.json') == '79b7b671f1a82c5b09c0b19f1c2b7ff35b68d2445d2196e98e491f71c2cabc45'
    assert len(original['teachers']) == 74 and len(original['evaluation']) == 46
    assert (oldreport['adapter_sha256'],oldreport['adapter_config_sha256']) == (WEIGHTS,CONFIG)
    assert (report['initial_weights_sha256'],report['initial_config_sha256']) == (WEIGHTS,CONFIG)
    assert report['status'] == 'COMPLETE_PENDING_RAW_READ_NOT_ADOPTED'
    assert (report['new_calls'],report['model_loads'],report['training_updates']) == (46,1,0)
    assert report['prompt_version'] == prior['prompt_version'] == PROFILE
    assert sha(old/'result/adapter/adapter_model.safetensors') == WEIGHTS
    assert sha(old/'result/adapter/adapter_config.json') == CONFIG
    for root in (old,bound):
        manifest = json.loads((root/'manifest.json').read_text())
        assert all(sha(root/n) == h for n,h in manifest.items())
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse, AnalysisSemanticError, canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained(original['plan']['model'], revision=original['plan']['revision'],
        local_files_only=True, trust_remote_code=False)
    out.mkdir()

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

    teachers = []
    checks = []
    for original_row in original['teachers']:
        row = copy.deepcopy(original_row)
        p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'])
        new = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
        assert p.request == new.request and p.source_guard == new.source_guard
        assert new.messages()[1:] == p.messages()[1:] and new.request_ref != p.request_ref
        assert new.messages()[0]['content'].startswith(p.messages()[0]['content']+'\n')
        row['legacy_request_ref'] = row['request_ref']
        row['legacy_source_bound_candidate_id'] = row['source_bound_candidate_id']
        if 'role_artifact_id' in row: row['legacy_role_artifact_id'] = row['role_artifact_id']
        row.update(request_ref=new.request_ref,messages=new.messages())
        raw = row['assistant_target']
        value = replace(new,response=response(new,raw))
        artifact,coverage = service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
        row['source_bound_candidate_id'] = artifact.candidate_id
        path = out/('teacher_'+row['id']+'.units.json')
        path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
            model_input=value,artifact=artifact,coverage=coverage))
        assert restore(service.reload_cumulative_quoted_parent_candidates,row,path) == (artifact,coverage)
        if row['id'] in ('T01','T02','T03','T04'):
            role,counts = service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
            row['role_artifact_id'] = role.artifact_id
            path = out/('teacher_'+row['id']+'.role.json')
            path.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],
                model_input=value,artifact=role,coverage=counts))
            assert restore(service.reload_cumulative_written_role_map,row,path) == (role,counts)
        prompt = tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        full = tok.apply_chat_template(row['messages']+[dict(role='assistant',content=raw)],enable_thinking=False,
            add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
        assert full[:len(prompt)] == prompt and len(prompt)+2048 <= 8192 and len(prompt) < len(full) <= 8192
        assert tok.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False) == raw+'<|im_end|>\n'
        checks.append(dict(id=row['id'],prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full)))
        for key in ('id','owner','snapshot','assistant_target'):
            assert canonical(row[key]) == canonical(original_row[key])
        teachers.append(row)
    assert len({r['id'] for r in teachers}) == 74
    evaluation = []
    reused = []
    for original_row,prior_row in zip(original['evaluation'],prior['evaluation']):
        row = copy.deepcopy(original_row)
        key = row['probe_id']
        assert key == prior_row['probe_id']
        assert canonical([row['owner'],row['snapshot']]) == canonical([prior_row['owner'],prior_row['snapshot']])
        p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
        assert p.request_ref == prior_row['request_ref'] and p.messages() == prior_row['messages']
        row.update(request_ref=p.request_ref,messages=p.messages(),pre_generation_required=False)
        prefix = bound/'result'/('after_'+key)
        request = json.loads(prefix.with_suffix('.request.json').read_text())
        resp = json.loads(prefix.with_suffix('.response.json').read_text())
        raw = prefix.with_suffix('.raw.txt').read_bytes()
        assert request['request_ref'] == p.request_ref and request['messages'] == p.messages()
        assert request['messages_sha256'] == sha256(canonical(p.messages()).encode()).hexdigest()
        assert resp['request_ref'] == p.request_ref and resp['messages_sha256'] == request['messages_sha256']
        assert resp['raw'].encode() == raw and resp['raw_sha256'] == sha256(raw).hexdigest()
        assert resp['finish_reason'] == 'stop'
        value = replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
        recorded = next(c for c in report['calls'] if c['probe_id'] == key)
        entry = dict(probe_id=key,source='SEMANTIC_BOUNDARIES46_AFTER46_SAVED_73EE_V2',
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
            try: artifact,coverage = build(row['owner'],row['snapshot'],model_input=value)
            except (AnalysisSemanticError,AnalysisSourceError) as exc:
                assert recorded[admission] == 'REJECTED' and str(exc) == recorded[reason] and not path.exists()
                entry.update({admission:'REJECTED',reason:str(exc)})
            else:
                assert recorded[admission] == 'RETURNED' and path.exists()
                assert restore(reload,row,path) == (artifact,coverage)
                entry.update({admission:'RETURNED',kind+'_coverage':coverage})
        tokens = tok.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        assert len(tokens) == prior_row['after_prompt_tokens'] and len(tokens)+2048 <= 8192
        row['prompt_tokens'] = len(tokens)
        evaluation.append(row)
        reused.append(entry)
    assert len(evaluation) == len(reused) == 46 and len({r['probe_id'] for r in evaluation}) == 46
    plan = copy.deepcopy(original['plan'])
    plan.update(max_updates=86,max_new_generations=46,max_model_loads=2,max_teacher_measurements=148,
        max_training_forwards=86,learning_rate=1e-5,gradient_clip=1.,seed=20261111,
        max_seconds=900,request_seconds=23,context_tokens=8192,max_new_tokens=2048,
        outer_timeout_term_seconds=890,outer_kill_grace_seconds=10,
        initial='EXPLICIT_SAVED_73EE_UNCHANGED74_V2_ALIGNMENT_NOT_INTERRUPTED_RESUME',
        initial_weights_sha256=WEIGHTS,initial_config_sha256=CONFIG,
        initial_private_library_file_id='libfile_e120a914f9348191b7f065b419e1693b',prompt_version=PROFILE,
        evaluation_scope='same46/same73ee-v2 before reused;old34+seenR8+teacherT4;not blind/general/Mash acceptance',
        retention='Unchanged74 owner/snapshot/targets and full86 order;v2 request/identity rederived;no raw teachers',
        stop_condition='900s/46calls/86updates/2loads;no retry/extra epoch/raw repair/receiver relaxation;preserve partial')
    assert plan['update_order'] == original['plan']['update_order'] and len(plan['update_order']) == 86
    assert set(plan['update_order']) == {r['id'] for r in teachers}
    paths = ['ai/services/ai_inference/analysis_cumulative_service.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py',
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py','ai/tools/serve_emlis_natural_reply.py']
    blobs = {p:sha1(b'blob '+str(len((api/p).read_bytes())).encode()+b'\0'+(api/p).read_bytes()).hexdigest() for p in paths}
    pack = dict(status='ROOT_SYNTHETIC_ALIGNED74_FROM_SAVED_73EE_NOT_PRODUCT_ACCEPTANCE',api_commit=COMMIT,
        teachers=teachers,evaluation=evaluation,preexisting_evaluation=[r['probe_id'] for r in evaluation],
        plan=plan,api_source_blobs=blobs,old74_plan_sha256=sha(oldfile),
        before46_plan_sha256=sha(bound/'plan.json'),before46_report_sha256=sha(bound/'result/report.json'),
        old74_source_target_order_unchanged=True,baseline_nll_control_not_comparable_due_to_new_prompt=True)
    (out/'semantic_units_aligned74_plan.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
    (out/'reused_before.json').write_text(json.dumps(reused,ensure_ascii=False,indent=2)+'\n')
    (out/'semantic_units_aligned74_cpu.json').write_text(json.dumps(dict(status='CPU_PREPARED',teachers=74,
        unchanged_source_targets_order=True,prompt_version=PROFILE,typed_role_teachers=4,
        updates=86,measurements_cap=148,after=46,before_reused=46,before_new=0,
        model_loads=0,new_generations=0,training_updates=0,token_checks=checks),ensure_ascii=False,indent=2)+'\n')
    print('ALIGNED74_CPU_PREPARED',sha(out/'semantic_units_aligned74_plan.json'))


if __name__ == '__main__': main()
