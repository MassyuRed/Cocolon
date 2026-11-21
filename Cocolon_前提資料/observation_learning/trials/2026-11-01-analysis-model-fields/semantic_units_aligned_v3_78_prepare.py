"""CPU-bind the unchanged private78 references to the already audited v3 input.

No teacher or case body is embedded here. The real v3 probe's after53 is copied
as before53; its v2 before and CPU-shadow rebindings are never training targets.
"""
from contextlib import ExitStack
from dataclasses import replace
from hashlib import sha256, sha1
from pathlib import Path
from unittest.mock import patch
import argparse
import ast
import copy
import json
import os
import shutil
import subprocess
import sys
import traceback

W = Path('/workspace')
API = W/'analysis-reason-v3-api-20261103'
OLD = W/'analysis-boundary78-20261103'
PROBE = W/'analysis-reason-v3-probe53-20261103'
AUDIT = W/'analysis-v3-teachers78-audit-20261103'
ROOT = W/'analysis-aligned-v3-78-20261103'
PREPARED = W/'analysis-aligned-v3-78-prepared-20261103'
INITIAL = W/'analysis-reason-unknown76-20261103/result/adapter'
PLAN_NAME = 'semantic_units_aligned_v3_78_plan.json'
COMMIT = '58c47dd8d6512fdd7db5eb413a383925e8b31a87'
OLD_COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
OLD_PLAN_SHA = '72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
PROBE_CPU_SHA = '317b585868532c294e41b3e40cc9cd3236b90efb8e5060128b54037c11405533'
PROBE_REPORT_SHA = '75cb4f694907878e28595baf4dbe8ed813f91f0f5f3cc119c8b9d040f74d1415'
AUDIT_SHA = '69016aeb4f4ea03f2973f77742b5b9ca591d1f7ee7b75c428f7e904cb361c97b'
AUDIT_SCRIPT_SHA = '0604388379c095a94328b8434e82e4f5d7491fdc009b7c8f1244bea0143b20f0'
REVIEW_SHA = '81dce4e3ce71eeec347172eebc58e3b2604ea04010d4c96df69c321b6024e343'
WEIGHTS = '9dc4f947cda74e2c2befea39a978d3ca44295c7526a7ef2db8011a8c63947d4a'
CONFIG = '4776a484561a82593d78f5e79f0e57a503c58d2a9fc54a69fff8890f885a75ce'
PROFILE = 'semantic_boundaries.v3'
STATE = 'cocolon.cmee.analysis_model_units_quoted_parents_state.semantic_boundaries.v3'
STATUS = 'ROOT_SYNTHETIC_ALIGNED_V3_78_FROM_EXPLICIT_9DC_NOT_PRODUCT_ACCEPTANCE'
NAMES = tuple('semantic_units_aligned_v3_78_'+suffix+'.py' for suffix in ('prepare','run','supervisor','collect'))
TEST_NAMES = ('reason-v3-tests-command.json','reason-v3-tests.log','reason-v3-tests-job.py',
    'reason-v3-tests.exit','reason-v3-api-setup.log')
TRAINING_KEYS = ('max_updates','epochs','batch_size','gradient_accumulation','learning_rate','weight_decay',
    'gradient_clip','seed','max_new_generations','request_seconds','context_tokens','max_new_tokens',
    'max_model_loads','trainable_tensors','trainable_parameters','model','revision','base_config_sha256',
    'initial_weights_sha256','initial_config_sha256','max_teacher_measurements','max_training_forwards',
    'training_objective','measurement_objective','update_order','adaptive_loss_sha256')
sys.dont_write_bytecode = True
sha = lambda path: sha256(Path(path).read_bytes()).hexdigest()
canonical = lambda value: json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'))


def write(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    temporary.replace(path)


def verify_manifest(root):
    manifest = json.loads((root/'manifest.json').read_text())
    assert manifest and all((root/name).is_file() and sha(root/name) == expected for name,expected in manifest.items())
    return manifest


def check_api():
    assert subprocess.check_output(['git','-C',str(API),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(API),'status','--porcelain','--untracked-files=no'],text=True).strip()


def teacher_identity(rows):
    return [dict(id=row['id'],owner=row['owner'],snapshot=row['snapshot'],assistant_target=row['assistant_target'])
        for row in rows]


def renderer_ast(path):
    tree = ast.parse(path.read_text())
    loops = [node for node in ast.walk(tree) if isinstance(node,ast.For)
        and ast.unparse(node.target) == 'row'
        and ast.unparse(node.iter) == "pack['teachers'] + pack['evaluation']"]
    assert len(loops) == 1
    body = loops[0].body
    start = [i for i,node in enumerate(body) if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) == 'prompt']
    end = [i for i,node in enumerate(body) if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) == "encoded[row['id']]"]
    assert len(start) == len(end) == 1
    block = body[start[0]:end[0]+1]
    guards = [node for node in block if isinstance(node,ast.If)]
    assert len(guards) == 1 and ast.unparse(guards[0].test) == "'assistant_target' not in row"
    assert len(guards[0].body) == 1 and isinstance(guards[0].body[0],ast.Continue)
    block = [node for node in block if not isinstance(node,ast.If)]
    assert len(block) == 7 and all(isinstance(node,(ast.Assign,ast.Assert)) for node in block)
    return ast.unparse(ast.Module(body=block,type_ignores=[]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--api-commit',required=True)
    parser.add_argument('--source-plan',type=Path,default=OLD/'semantic_units_boundary78_plan.json')
    parser.add_argument('--source-plan-sha256',required=True)
    parser.add_argument('--teacher-audit',type=Path,default=AUDIT)
    parser.add_argument('--teacher-audit-sha256',required=True)
    parser.add_argument('--source-review',type=Path,default=W/'v3-teachers78-SOURCE_TARGET_REVIEW.md')
    parser.add_argument('--source-review-sha256',required=True)
    args = parser.parse_args()
    assert not PREPARED.exists()
    PREPARED.mkdir()
    result = dict(status='STARTED_CPU_PREPARE',model_loads=0,generations=0,training_updates=0,nll_measurements=0)
    try:
        os.environ['CUDA_VISIBLE_DEVICES'] = ''
        os.environ['HF_HUB_OFFLINE'] = '1'
        os.environ['TRANSFORMERS_OFFLINE'] = '1'
        assert args.api_commit == COMMIT and args.source_plan_sha256 == OLD_PLAN_SHA
        assert args.teacher_audit_sha256 == AUDIT_SHA and args.source_review_sha256 == REVIEW_SHA
        assert sha(args.source_plan) == OLD_PLAN_SHA and sha(args.source_review) == REVIEW_SHA
        check_api()
        assert (W/'reason-v3-tests.exit').read_text().strip() == '0'
        assert (PROBE/'run.exit').read_text().strip() == '0' and (OLD/'run.exit').read_text().strip() == '0'
        original = json.loads(args.source_plan.read_text())
        assert original['status'] == 'ROOT_SYNTHETIC_BOUNDARY78_FROM_SAVED_9DC_NOT_PRODUCT_ACCEPTANCE'
        assert original['api_commit'] == OLD_COMMIT and original['plan']['prompt_version'] == 'semantic_boundaries.v2'
        assert len(original['teachers']) == 78 and len(original['evaluation']) == 53
        assert len(original['plan']['update_order']) == 106
        assert sha(PROBE/'cpu/result.json') == PROBE_CPU_SHA and sha(PROBE/'result/report.json') == PROBE_REPORT_SHA
        cpu = json.loads((PROBE/'cpu/result.json').read_text())
        report = json.loads((PROBE/'result/report.json').read_text())
        gpu = json.loads((PROBE/'gpu-after.json').read_text())
        assert cpu['status'] == 'REASON_V3_PROBE53_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
        assert cpu['api_commit'] == report['api_commit'] == COMMIT and cpu['prompt_version'] == report['prompt_version'] == PROFILE
        assert cpu['old_plan_sha256'] == OLD_PLAN_SHA and report['cpu_result_sha256'] == PROBE_CPU_SHA
        assert report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
        assert (report['new_calls'],report['model_loads'],report['training_updates'],report['nll_measurements']) == (53,1,0,0)
        assert report['all_finished_stop'] and report['all_prior_eighteen_files_unchanged']
        assert (report['weights_sha256'],report['config_sha256']) == (WEIGHTS,CONFIG)
        assert gpu['exit'] == 0 and gpu['all_prior_nine_adapter_pairs_unchanged'] and gpu['compute_empty']
        prior = gpu['adapter_hashes']
        assert len(prior) == 18 and prior == report['adapter_hashes']
        assert all(sha(path) == expected for path,expected in prior.items())
        assert sha(INITIAL/'adapter_model.safetensors') == WEIGHTS and sha(INITIAL/'adapter_config.json') == CONFIG
        verify_manifest(PROBE)
        verify_manifest(OLD)
        audit = args.teacher_audit
        assert sha(audit/'result.json') == AUDIT_SHA
        audit_result = json.loads((audit/'result.json').read_text())
        assert audit_result['status'] == 'V3_TEACHERS78_CPU_AUDITED_NO_MODEL_NO_GPU_PLAN'
        assert audit_result['api_commit'] == COMMIT and audit_result['old78_plan_sha256'] == OLD_PLAN_SHA
        assert audit_result['runner_sha256'] == AUDIT_SCRIPT_SHA
        assert audit_result['old78_source_target_order_unchanged']
        assert (audit_result['teachers'],audit_result['input_update_order_length'],
            audit_result['strict_candidate_saved_replays'],audit_result['typed_role_saved_replays']) == (78,106,156,8)
        assert (audit/'external/audit.exit').read_text().strip() == '0'
        verify_manifest(audit)
        assert sha(audit/'old78_plan.json') == OLD_PLAN_SHA
        assert cpu['api_source_blobs'] == audit_result['api_source_blobs']
        for path,expected in cpu['api_source_blobs'].items():
            data = (API/path).read_bytes()
            assert sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest() == expected
        assert len(cpu['api_source_blobs']) == 6
        provenance = json.loads((audit/'training_renderer_provenance.json').read_text())
        assert renderer_ast(Path(__file__).with_name(NAMES[1])) == provenance['render_ast']
        (PREPARED/'original78_plan.json').write_bytes(args.source_plan.read_bytes())
        (PREPARED/'SOURCE_TARGET_REVIEW.md').write_bytes(args.source_review.read_bytes())
        for name,src in [('probe_cpu_result.json',PROBE/'cpu/result.json'),
            ('probe_report.json',PROBE/'result/report.json'),('probe_manifest.json',PROBE/'manifest.json')]:
            shutil.copyfile(src,PREPARED/name)
        shutil.copytree(audit,PREPARED/'teacher_audit')
        write(PREPARED/'adapter_hashes_before.json',prior)
        tests = PREPARED/'tests_provenance'
        tests.mkdir()
        for name in TEST_NAMES: shutil.copyfile(W/name,tests/name)
        sys.path[:0] = [str(API/'ai/tools'),str(API/'ai/services/ai_inference')]
        import analysis_cumulative_service as service
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
        from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        from transformers import AutoTokenizer
        tokenizer = AutoTokenizer.from_pretrained(original['plan']['model'],revision=original['plan']['revision'],
            local_files_only=True,trust_remote_code=False)

        def restore(reload,row,path):
            with ExitStack() as stack:
                for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                    (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                    (author,'realize_model_written_role_graph')]:
                    stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
                return reload(row['owner'],row['snapshot'],path.read_text())

        def response(prepared,raw):
            return AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                sha256(canonical(prepared.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw)

        checks = {row['id']:row for row in audit_result['rows']}
        assert len(checks) == 78
        teachers, encoded = [], {}
        for oldrow in original['teachers']:
            row = copy.deepcopy(oldrow)
            p2 = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version='semantic_boundaries.v2')
            p3 = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
            assert p2.request_ref == row['request_ref'] and p2.messages() == row['messages']
            assert p3.request_ref != p2.request_ref and p3.messages()[1] == p2.messages()[1]
            assert p3.messages()[0]['content'].startswith(p2.messages()[0]['content']+'\n')
            raw = row['assistant_target']
            assert 'training_use' not in row or row['training_use'] is True
            value = replace(p3,response=response(p3,raw))
            artifact,counts = service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
            row.update(previous_v2_request_ref=row['request_ref'],previous_v2_source_bound_candidate_id=row['source_bound_candidate_id'],
                request_ref=p3.request_ref,messages=p3.messages(),source_bound_candidate_id=artifact.candidate_id)
            path = PREPARED/('teacher_'+row['id']+'.units.json')
            path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
                model_input=value,artifact=artifact,coverage=counts))
            assert json.loads(path.read_text())['state']['schema_version'] == STATE
            assert restore(service.reload_cumulative_quoted_parent_candidates,row,path) == (artifact,counts)
            assert path.read_bytes() == (audit/(row['id']+'.'+PROFILE+'.candidate.json')).read_bytes()
            if row['id'] in {'T01','T02','T03','T04'}:
                role,coverage = service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
                row.update(previous_v2_role_artifact_id=row['role_artifact_id'],role_artifact_id=role.artifact_id)
                path = PREPARED/('teacher_'+row['id']+'.role.json')
                path.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],
                    model_input=value,artifact=role,coverage=coverage))
                assert restore(service.reload_cumulative_written_role_map,row,path) == (role,coverage)
                assert path.read_bytes() == (audit/(row['id']+'.'+PROFILE+'.role.json')).read_bytes()
            if row['id'] in {'RB01','RB02'}:
                try: service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert str(exc) == row['expected_typed_role_reason'] == 'analysis_written_role_scope_unsupported'
                else: raise AssertionError('multiclause typed scope must stay unsupported')
            prompt = tokenizer.apply_chat_template(row['messages'],enable_thinking=False,
                add_generation_prompt=True,tokenize=True,return_dict=False,truncation=False)
            full = tokenizer.apply_chat_template(row['messages']+[dict(role='assistant',content=raw)],enable_thinking=False,
                add_generation_prompt=False,tokenize=True,return_dict=False,truncation=False)
            assert full[:len(prompt)] == prompt and len(prompt)+2048 <= 8192 and len(prompt) < len(full) <= 8192
            assert tokenizer.decode(full[len(prompt):],skip_special_tokens=False,clean_up_tokenization_spaces=False) == raw+'<|im_end|>\n'
            encoded[row['id']] = dict(input_ids=full,labels=[-100]*len(prompt)+full[len(prompt):],loss_start=len(prompt)-1,
                logits_positions=len(full)-len(prompt)+1,prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt))
            check = checks[row['id']]
            assert check['v3_request_ref'] == p3.request_ref
            assert check['assistant_target_sha256'] == sha256(raw.encode()).hexdigest()
            assert check['full_token_ids_sha256'] == sha256(canonical(full).encode()).hexdigest()
            assert (check['prompt_tokens'],check['target_tokens'],check['full_tokens']) == (len(prompt),len(full)-len(prompt),len(full))
            teachers.append(row)
        assert teacher_identity(teachers) == teacher_identity(original['teachers'])
        assert len(teachers) == len(encoded) == 78
        evaluation, reused = [], []
        probe_rows = {row['probe_id']:row for row in cpu['rows']}
        calls = {row['probe_id']:row for row in report['calls']}
        assert len(probe_rows) == len(calls) == 53
        for oldrow in original['evaluation']:
            row = copy.deepcopy(oldrow)
            assert 'assistant_target' not in row
            key = row['probe_id']
            origin_row = probe_rows[key]
            assert all(row[key2] == origin_row[key2] for key2 in ('owner','snapshot','training_use','role_vertical'))
            p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=PROFILE)
            assert p.request_ref == origin_row['request_ref'] and p.messages() == origin_row['messages']
            row.update(previous_v2_request_ref=row['request_ref'],request_ref=p.request_ref,messages=p.messages(),
                prompt_version=PROFILE,pre_generation_required=False,provenance='EXACT_REAL_V3_PROBE53_AFTER_REUSE_NO_NEW_BEFORE')
            prefix = PROBE/'result'/('after_'+key)
            req = json.loads(prefix.with_suffix('.request.json').read_text())
            resp = json.loads(prefix.with_suffix('.response.json').read_text())
            raw_bytes = prefix.with_suffix('.raw.txt').read_bytes()
            assert req['request_ref'] == p.request_ref and req['messages'] == p.messages()
            assert req['messages_sha256'] == sha256(canonical(p.messages()).encode()).hexdigest()
            assert resp['request_ref'] == p.request_ref and resp['messages_sha256'] == req['messages_sha256']
            assert resp['raw'].encode() == raw_bytes and resp['raw_sha256'] == sha256(raw_bytes).hexdigest()
            assert resp['finish_reason'] == 'stop' and calls[key]['finish_reason'] == 'stop'
            entry = dict(probe_id=key,source='REAL_V3_PROBE53_AFTER',initial_weights_sha256=WEIGHTS,
                initial_config_sha256=CONFIG,prompt_version=PROFILE,source_files={})
            for suffix in ('.request.json','.response.json','.raw.txt','.candidate.json','.role.json'):
                src = prefix.with_suffix(suffix)
                if src.exists():
                    shutil.copyfile(src,PREPARED/('before_'+key+suffix))
                    entry['source_files'][suffix] = dict(path=str(src),sha256=sha(src))
            value = replace(p,response=AnalysisModelQuotedParentUnitsResponse(**resp))
            for kind,build,reload,suffix in [
                ('candidate',service.build_cumulative_quoted_parent_candidates,service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                ('role',service.build_cumulative_written_role_map,service.reload_cumulative_written_role_map,'.role.json')]:
                if kind == 'role' and not row['role_vertical']: continue
                admission,reason = ('admission','reason') if kind == 'candidate' else ('role_admission','role_reason')
                path = PREPARED/('before_'+key+suffix)
                try: artifact,counts = build(row['owner'],row['snapshot'],model_input=value)
                except (AnalysisSemanticError,AnalysisSourceError) as exc:
                    assert calls[key][admission] == 'REJECTED' and str(exc) == calls[key][reason] and not path.exists()
                    entry.update({admission:'REJECTED',reason:str(exc)})
                else:
                    assert calls[key][admission] == 'RETURNED' and path.exists()
                    assert restore(reload,row,path) == (artifact,counts)
                    entry.update({admission:'RETURNED',kind+'_coverage':counts})
            prompt = tokenizer.apply_chat_template(row['messages'],enable_thinking=False,add_generation_prompt=True,
                tokenize=True,return_dict=False,truncation=False)
            assert len(prompt)+2048 <= 8192
            row['prompt_tokens'] = len(prompt)
            evaluation.append(row)
            reused.append(entry)
        assert len(evaluation) == len(reused) == len({row['probe_id'] for row in evaluation}) == 53
        assert sum(row['admission'] == 'RETURNED' for row in reused) == 51
        assert sum(row.get('role_admission') == 'RETURNED' for row in reused) == 9
        assert sum(bool(row['role_vertical']) for row in evaluation) == 16
        assert [row['probe_id'] for row in evaluation] == original['preexisting_evaluation']
        assert len({canonical([row['owner'],row['snapshot']]) for row in evaluation}) == 53
        plan = copy.deepcopy(original['plan'])
        plan.update(prompt_version=PROFILE,max_seconds=1200,outer_timeout_term_seconds=1190,outer_kill_grace_seconds=10,
            initial='EXPLICIT_SAVED_9DC_SAME78_SOURCE_TARGET_ORDER_V3_INPUT_ALIGNMENT_RESEARCH_ONLY',
            process_cost_upper_usd_at_previous_price=original['plan']['gpu_hourly_usd_previous_observation']*1200/3600,
            evaluation_scope='same53 real9dc/v3 probeafter reused before;new53 after;development/rehearsal not blind/general/Mash acceptance',
            retention='Unchanged78 source/assistant_target and exact106 order;only input profile alignment;new weights not automatically adopted',
            stop_condition='1200s/53calls/106updates/2loads;no retry/extra epoch/raw repair/receiver relaxation;preserve partial')
        assert all(plan[key] == original['plan'][key] for key in TRAINING_KEYS)
        pack = dict(status=STATUS,api_commit=COMMIT,teachers=teachers,evaluation=evaluation,
            preexisting_evaluation=[row['probe_id'] for row in evaluation],plan=plan,api_source_blobs=cpu['api_source_blobs'],
            old78_plan_sha256=OLD_PLAN_SHA,teacher_audit_sha256=AUDIT_SHA,source_review_sha256=REVIEW_SHA,
            probe_cpu_sha256=PROBE_CPU_SHA,probe_report_sha256=PROBE_REPORT_SHA,
            old78_source_target_order_unchanged=True,new_teachers_created=0,model_raw_teacher_use=0,
            input_alignment_comparison_not_sole_cause_proof=True,normal_adoption=False,next_training_initial_selected=False)
        write(PREPARED/PLAN_NAME,pack)
        write(PREPARED/'encoded_training_cpu.json',encoded)
        write(PREPARED/'reused_before.json',reused)
        assert sha(args.source_plan) == OLD_PLAN_SHA and sha(args.source_review) == REVIEW_SHA
        assert all(sha(path) == expected for path,expected in prior.items())
        result.update(status='ALIGNED_V3_78_CPU_PREPARED_NO_MODEL',teachers=78,evaluation=53,training_order=106,
            model_loads=0,generations=0,training_updates=0,nll_measurements=0,source_target_order_unchanged=True,
            teacher_audit_sha256=AUDIT_SHA,source_review_sha256=REVIEW_SHA,before_source='REAL_V3_PROBE53_AFTER',
            before_candidates_returned=51,before_typed_roles_returned=9,api_commit=COMMIT,prompt_version=PROFILE)
    except BaseException as exc:
        result.update(status='FAILED_CPU_PREPARE_NO_MODEL',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        write(PREPARED/'prepare_result.json',result)
        write(PREPARED/'manifest.json',{str(path.relative_to(PREPARED)):sha(path)
            for path in PREPARED.rglob('*') if path.is_file() and path != PREPARED/'manifest.json'})
    print('ALIGNED_V3_78_CPU_PREPARED',sha(PREPARED/PLAN_NAME))


if __name__ == '__main__': main()
