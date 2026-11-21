"""CPU-audit the unchanged private78 references under the opt-in v3 prompt.

No source body or target is embedded here. This does not create a training plan,
new teachers, model output, or an additional GPU selection. Output is private.
"""
from contextlib import ExitStack
from dataclasses import asdict, replace
from hashlib import sha256, sha1
from importlib.metadata import version
from pathlib import Path
from unittest.mock import patch
import argparse
import ast
import copy
import json
import os
import subprocess
import sys
import time
import traceback
import zipfile


COMMIT = '58c47dd8d6512fdd7db5eb413a383925e8b31a87'
OLD_COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
PLAN_SHA = '72696f33ae6e8284eb928e7497fa966b64bb072c99474ea99abc6b5a93b133be'
RENDERER_SHA = '59939d81022c4e8a86ce2217180a4f8143e6f46cc8141bc28dc6163f1593dbb4'
V2 = 'semantic_boundaries.v2'
V3 = 'semantic_boundaries.v3'
V3_STATE = 'cocolon.cmee.analysis_model_units_quoted_parents_state.semantic_boundaries.v3'
WORKSPACE = Path('/workspace')
sha = lambda path: sha256(Path(path).read_bytes()).hexdigest()
sys.dont_write_bytecode = True
os.environ['CUDA_VISIBLE_DEVICES'] = ''
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'


def write(path, value):
    path = Path(path)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value,ensure_ascii=False,indent=2) + '\n')
    temporary.replace(path)


def saved_restore(reload, engine, compiler, author, row, path):
    with ExitStack() as stack:
        for obj, name in [(engine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                (author,'realize_model_written_role_graph')]:
            stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
        return reload(row['owner'],row['snapshot'],path.read_text())


def same_meaning(kind, left, right, left_counts, right_counts):
    assert left_counts == right_counts
    if kind == 'candidate':
        a, b = asdict(left.graph), asdict(right.graph)
        for key in ('request_ref','response_ref'):
            assert a.pop(key) != b.pop(key)
        assert a == b and left.text == right.text and left.diagram_json == right.diagram_json
        assert left.candidate_id != right.candidate_id
    else:
        assert asdict(left.graph) == asdict(right.graph)
        assert (left.owner_scope,left.source_set_ref,left.period,left.artifact_version,
            left.source_members,left.category_records) == (right.owner_scope,right.source_set_ref,
            right.period,right.artifact_version,right.source_members,right.category_records)
        assert left.artifact_id != right.artifact_id
        for method in ('safe_text_projection','safe_projection'):
            a = getattr(left,method)(authenticated_owner_scope=left.owner_scope)
            b = getattr(right,method)(authenticated_owner_scope=right.owner_scope)
            assert a.pop('projection_of') != b.pop('projection_of')
            assert a == b


def training_renderer(path):
    """Extract the pinned real renderer, without executing the training main."""
    assert sha(path) == RENDERER_SHA
    tree = ast.parse(path.read_text())
    loops = [node for node in ast.walk(tree) if isinstance(node,ast.For)
        and ast.unparse(node.target) == 'row'
        and ast.unparse(node.iter) == "pack['teachers'] + pack['evaluation']"]
    assert len(loops) == 1
    body = loops[0].body
    starts = [i for i,node in enumerate(body) if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) == 'prompt']
    ends = [i for i,node in enumerate(body) if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) == "encoded[row['id']]"]
    assert len(starts) == len(ends) == 1
    block = body[starts[0]:ends[0]+1]
    # Only the teacher guard's continue is removed; all callers have targets.
    guards = [node for node in block if isinstance(node,ast.If)]
    assert len(guards) == 1 and ast.unparse(guards[0].test) == "'assistant_target' not in row"
    assert len(guards[0].body) == 1 and isinstance(guards[0].body[0],ast.Continue)
    block = [node for node in block if not isinstance(node,ast.If)]
    assert len(block) == 7 and all(isinstance(node,(ast.Assign,ast.Assert)) for node in block)
    losses = [node for node in ast.walk(tree) if isinstance(node,ast.FunctionDef) and node.name == 'teacher_loss']
    assert len(losses) == 1
    tensors = [copy.deepcopy(node) for node in losses[0].body if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) in {'ids','labels'}]
    gold = [node for node in losses[0].body if isinstance(node,ast.Assign)
        and ast.unparse(node.targets[0]) == 'gold']
    assert len(tensors) == 2 and len(gold) == 1
    for node in tensors:
        assert isinstance(node.value,ast.Call) and ast.unparse(node.value.func) == 'torch.tensor'
        devices = [item for item in node.value.keywords if item.arg == 'device']
        assert len(devices) == 1 and ast.literal_eval(devices[0].value) == 'cuda:0'
        devices[0].value = ast.Constant(value='cpu')
    provenance = dict(source_sha256=RENDERER_SHA,render_ast=ast.unparse(ast.Module(body=block,type_ignores=[])),
        tensor_ast=ast.unparse(ast.Module(body=tensors,type_ignores=[])),gold_ast=ast.unparse(gold[0]),
        only_transformations=['Remove the nonteacher continue guard;all78 have assistant_target',
            'Change the two tensor device keywords from cuda:0 to cpu'],
        model_forward_and_loss_equality_tested=False)
    modules = [ast.fix_missing_locations(ast.Module(body=nodes,type_ignores=[])) for nodes in (block,tensors,gold)]
    return [compile(module,str(path)+':CPU_AUDIT','exec') for module in modules], provenance


def archive(args):
    """Collect completed or partial CPU output only; never re-run the audit."""
    assert args.api_commit == COMMIT and args.plan_sha256 == PLAN_SHA
    root, destination, collected = args.output, args.archive, args.collection
    assert root.is_dir() and not destination.exists() and not collected.exists()
    manifest_path = root/'manifest.json'
    old_manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else None
    mismatches = []
    if old_manifest is not None:
        for name, expected in old_manifest.items():
            path = root/name
            if not path.is_file() or sha(path) != expected:
                mismatches.append(name)
    for source, name in [(args.log,'audit.log'),(args.exit_file,'audit.exit')]:
        if source is not None:
            assert source.is_file()
            target = root/'external'/name
            target.parent.mkdir(exist_ok=True)
            assert not target.exists()
            target.write_bytes(source.read_bytes())
    report_path = root/'result.json'
    report = json.loads(report_path.read_text()) if report_path.exists() else None
    complete = bool(report and report.get('status') == 'V3_TEACHERS78_CPU_AUDITED_NO_MODEL_NO_GPU_PLAN'
        and old_manifest is not None and not mismatches)
    write(root/'archive_context.json',dict(mode='COMPLETE_CPU_AUDIT' if complete else 'PARTIAL_ARCHIVE_ONLY_NO_RERUN',
        previous_manifest_present=old_manifest is not None,previous_manifest_mismatches=mismatches,
        model_loads=0,model_generations=0,training_updates=0,nll_measurements=0))
    files = {str(path.relative_to(root)):path for path in root.rglob('*') if path.is_file()}
    assert files and 'export_manifest.json' not in files
    manifest = {name:dict(bytes=path.stat().st_size,sha256=sha(path)) for name,path in sorted(files.items())}
    with zipfile.ZipFile(destination,'x',compression=zipfile.ZIP_DEFLATED) as z:
        for name,path in sorted(files.items()):
            z.write(path,name)
        z.writestr('export_manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    with zipfile.ZipFile(destination) as z:
        assert len(z.namelist()) == len(files)+1 and z.testzip() is None
        for name, expected in manifest.items():
            value = z.read(name)
            assert len(value) == expected['bytes'] and sha256(value).hexdigest() == expected['sha256']
    collected.mkdir()
    result = dict(status='CPU_AUDIT_ORIGINALS_ARCHIVED_NO_MODEL',mode='COMPLETE_CPU_AUDIT' if complete else 'PARTIAL_ARCHIVE_ONLY_NO_RERUN',
        archive=str(destination),bytes=destination.stat().st_size,sha256=sha(destination),members=len(files)+1,
        member_bytes_sha256_verified=True,crc_all_matched=True,model_loads=0,model_generations=0,
        training_updates=0,nll_measurements=0,new_training_plan_created=False,additional_gpu_selected=False)
    write(collected/'collection.json',result)
    print(json.dumps(result))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phase',required=True,choices=['audit','archive'])
    parser.add_argument('--api',type=Path,default=WORKSPACE/'analysis-reason-v3-api-20261103')
    parser.add_argument('--api-commit',required=True)
    parser.add_argument('--plan',type=Path,
        default=WORKSPACE/'analysis-boundary78-20261103/semantic_units_boundary78_plan.json')
    parser.add_argument('--plan-sha256',required=True)
    parser.add_argument('--renderer',type=Path,
        default=WORKSPACE/'analysis-boundary78-20261103/semantic_units_boundary78_run.py')
    parser.add_argument('--output',type=Path,default=WORKSPACE/'analysis-v3-teachers78-audit-20261103')
    parser.add_argument('--archive',type=Path,default=WORKSPACE/'cocolon-analysis-v3-teachers78-audit-originals-20261103.zip')
    parser.add_argument('--collection',type=Path,default=WORKSPACE/'analysis-v3-teachers78-audit-collected-20261103')
    parser.add_argument('--log',type=Path)
    parser.add_argument('--exit-file',type=Path)
    args = parser.parse_args()
    if args.phase == 'archive':
        return archive(args)
    assert args.api_commit == COMMIT and args.plan_sha256 == PLAN_SHA
    assert not args.output.exists() and sha(args.plan) == PLAN_SHA
    assert subprocess.check_output(['git','-C',str(args.api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(args.api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    original_bytes = args.plan.read_bytes()
    pack = json.loads(original_bytes)
    assert pack['status'] == 'ROOT_SYNTHETIC_BOUNDARY78_FROM_SAVED_9DC_NOT_PRODUCT_ACCEPTANCE'
    assert pack['api_commit'] == OLD_COMMIT and pack['plan']['prompt_version'] == V2
    teachers, order = pack['teachers'], pack['plan']['update_order']
    assert len(teachers) == len({row['id'] for row in teachers}) == 78
    assert [row['id'] for row in teachers[-2:]] == ['RB01','RB02']
    assert len(order) == 106 and order[-16:] == ['RU01','RU02','RB01','RB02'] * 4
    assert set(order) == {row['id'] for row in teachers}
    assert all(type(row['assistant_target']) is str and bool(row['assistant_target'].strip()) for row in teachers)
    assert all('training_use' not in row or row['training_use'] is True for row in teachers)
    assert pack['plan']['model'] == 'Qwen/Qwen3.5-4B'
    assert pack['plan']['revision'] == '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
    paths = pack['api_source_blobs']
    assert len(paths) == 6
    allowed_changes = {
        'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py',
        'ai/tests/test_analysis_model_quoted_parent_units.py'}
    blobs = {}
    for path, previous in paths.items():
        data = (args.api/path).read_bytes()
        actual = sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        assert actual == subprocess.check_output(['git','-C',str(args.api),'rev-parse',COMMIT+':'+path],text=True).strip()
        if path not in allowed_changes:
            assert actual == previous
        blobs[path] = actual
    args.output.mkdir()
    (args.output/'old78_plan.json').write_bytes(original_bytes)
    (args.output/Path(__file__).name).write_bytes(Path(__file__).read_bytes())
    for path in blobs:
        target = args.output/'api-source'/path
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes((args.api/path).read_bytes())
    write(args.output/'audit_command.json',dict(argv=sys.argv,python=sys.executable,api_commit=COMMIT,
        plan=str(args.plan),plan_sha256=PLAN_SHA,renderer=str(args.renderer),renderer_sha256=RENDERER_SHA,
        model_loads=0,model_generations=0,training_updates=0))
    report = dict(status='STARTED_CPU_AUDIT',api_commit=COMMIT,old_api_commit=OLD_COMMIT,
        old78_plan_sha256=PLAN_SHA,api_source_blobs=blobs,runner_sha256=sha(__file__),
        prompt_version=V3,before_prompt_version=V2,teachers=78,old78_source_target_order_unchanged=False,
        input_update_order_length=106,model_loads=0,model_generations=0,training_updates=0,nll_measurements=0,
        new_teachers_created=0,new_training_plan_created=False,additional_gpu_selected=False,
        normal_adoption=False,next_training_initial_selected=False,product_credit=0,rows=[])
    start = time.monotonic()
    try:
        sys.path[:0] = [str(args.api/'ai/tools'),str(args.api/'ai/services/ai_inference')]
        import analysis_cumulative_service as service
        from cocolon_meaning_experience_engine import MeaningExperienceEngine
        from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
        from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
        from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
            AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
        from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
        from transformers import AutoTokenizer
        import torch
        canonical_before = canonical(pack)
        source_target_order_before = canonical([teachers,order])
        report['source_target_order_sha256'] = sha256(source_target_order_before.encode()).hexdigest()
        report['runtime_versions'] = {name:version(name) for name in ('transformers','tokenizers','torch')}
        codes, provenance = training_renderer(args.renderer)
        (args.output/'training_renderer_source.py').write_bytes(args.renderer.read_bytes())
        write(args.output/'training_renderer_provenance.json',provenance)
        report['training_renderer_source_sha256'] = RENDERER_SHA
        report['model_forward_and_loss_equality_tested'] = False
        tok = AutoTokenizer.from_pretrained(pack['plan']['model'],revision=pack['plan']['revision'],
            local_files_only=True,trust_remote_code=False)
        context, generation = 8192, 2048
        typed_count = rejected_count = 0
        for row in teachers:
            key, raw = row['id'], row['assistant_target']
            p2 = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=V2)
            p3 = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=V3)
            assert p2.request_ref == row['request_ref'] and p2.messages() == row['messages']
            assert p3.request == p2.request and p3.source_guard == p2.source_guard
            assert p3.messages()[1] == p2.messages()[1] and p3.request_ref != p2.request_ref
            assert p3.messages()[0]['content'].startswith(p2.messages()[0]['content'] + '\n')
            result = dict(id=key,source_target_unchanged=True,v2_request_ref=p2.request_ref,
                v3_request_ref=p3.request_ref,assistant_target_sha256=sha256(raw.encode()).hexdigest())
            candidates, roles = [], []
            for profile, prepared in [(V2,p2),(V3,p3)]:
                response = AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
                    sha256(canonical(prepared.messages()).encode()).hexdigest(),sha256(raw.encode()).hexdigest(),'stop',raw)
                value = replace(prepared,response=response)
                candidate, counts = service.build_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],model_input=value)
                if profile == V2:
                    assert candidate.candidate_id == row['source_bound_candidate_id']
                path = args.output/(key+'.'+profile+'.candidate.json')
                path.write_text(service.serialize_cumulative_quoted_parent_candidates(row['owner'],row['snapshot'],
                    model_input=value,artifact=candidate,coverage=counts))
                if profile == V3:
                    assert json.loads(path.read_text())['state']['schema_version'] == V3_STATE
                assert saved_restore(service.reload_cumulative_quoted_parent_candidates,MeaningExperienceEngine,
                    compiler,author,row,path) == (candidate,counts)
                candidates.append((candidate,counts))
                if key in {'T01','T02','T03','T04'}:
                    role, coverage = service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
                    if profile == V2:
                        assert role.artifact_id == row['role_artifact_id']
                    path = args.output/(key+'.'+profile+'.role.json')
                    path.write_text(service.serialize_cumulative_written_role_map(row['owner'],row['snapshot'],
                        model_input=value,artifact=role,coverage=coverage))
                    assert saved_restore(service.reload_cumulative_written_role_map,MeaningExperienceEngine,
                        compiler,author,row,path) == (role,coverage)
                    roles.append((role,coverage))
                if key in {'RB01','RB02'}:
                    assert row['expected_typed_role_admission'] == 'REJECTED'
                    assert row['expected_typed_role_reason'] == 'analysis_written_role_scope_unsupported'
                    try:
                        service.build_cumulative_written_role_map(row['owner'],row['snapshot'],model_input=value)
                    except (AnalysisSemanticError,AnalysisSourceError) as exc:
                        assert str(exc) == row['expected_typed_role_reason']
                    else:
                        raise AssertionError('multiclause reference must stay outside typed role scope')
            same_meaning('candidate',candidates[0][0],candidates[1][0],candidates[0][1],candidates[1][1])
            result['candidate_v2_v3_parity_except_identity'] = True
            if roles:
                same_meaning('role',roles[0][0],roles[1][0],roles[0][1],roles[1][1])
                result['typed_role_v2_v3_parity_except_identity'] = True
                typed_count += 1
            if key in {'RB01','RB02'}:
                result.update(typed_role_admission='REJECTED',typed_role_reason='analysis_written_role_scope_unsupported')
                rejected_count += 1
            messages = p3.messages()
            render_scope = dict(tokenizer=tok,row=dict(id=key,messages=messages,assistant_target=raw),encoded={})
            exec(codes[0],render_scope)
            prompt, full, item = render_scope['prompt'], render_scope['full'], render_scope['encoded'][key]
            assert len(prompt)+generation <= context and item['input_ids'] == full
            tensor_scope = dict(torch=torch,item=item)
            exec(codes[1],tensor_scope)
            exec(codes[2],tensor_scope)
            ids, labels, gold = tensor_scope['ids'], tensor_scope['labels'], tensor_scope['gold']
            attention = torch.ones_like(ids)
            target_count = len(full)-len(prompt)
            assert ids.device.type == labels.device.type == gold.device.type == 'cpu'
            assert ids.dtype == labels.dtype == torch.long and ids.shape == labels.shape == attention.shape == (1,len(full))
            assert (attention == 1).all() and (labels[0,:len(prompt)] == -100).all()
            assert torch.equal(labels[0,len(prompt):],ids[0,len(prompt):]) and (gold >= 0).all()
            assert item['loss_start'] == len(prompt)-1 and item['logits_positions'] == target_count+1
            assert gold.numel() == target_count and torch.equal(gold,ids[0,len(prompt):])
            shifted = labels[0,1:]
            supervised = shifted[shifted != -100]
            assert torch.equal(supervised,gold)
            positions = torch.arange(len(full)-1,dtype=torch.long)[shifted != -100]
            tail_start = len(full)-item['logits_positions']
            assert tail_start == len(prompt)-1 and torch.equal(positions,torch.arange(tail_start,len(full)-1))
            tensor_path = args.output/(key+'.training_cpu.pt')
            torch.save(dict(input_ids=ids,labels=labels,attention_mask=attention,loss_start=item['loss_start'],
                logits_positions=item['logits_positions'],gold=gold),tensor_path)
            restored = torch.load(tensor_path,map_location='cpu',weights_only=True)
            assert all(torch.equal(restored[name],value) for name,value in
                [('input_ids',ids),('labels',labels),('attention_mask',attention),('gold',gold)])
            assert restored['loss_start'] == item['loss_start'] and restored['logits_positions'] == item['logits_positions']
            result.update(prompt_tokens=len(prompt),target_tokens=len(full)-len(prompt),full_tokens=len(full),
                training_context_margin=context-len(full),generation_budget_margin=context-len(prompt)-generation,
                full_token_ids_sha256=sha256(canonical(full).encode()).hexdigest(),prefix_exact=True,target_eos_exact=True,
                cpu_tensor_file=tensor_path.name,cpu_tensor_sha256=sha(tensor_path),tensor_dtype=str(ids.dtype),
                prompt_labels_masked=True,shifted_gold_boundary_exact=True,loss_start=item['loss_start'],
                logits_positions=item['logits_positions'],actual_training_renderer_reused=True)
            report['rows'].append(result)
            write(args.output/'result.json',report)
        assert len(report['rows']) == 78 and typed_count == 4 and rejected_count == 2
        assert canonical(pack) == canonical_before
        assert canonical([teachers,order]) == source_target_order_before
        assert args.plan.read_bytes() == original_bytes and sha(args.plan) == PLAN_SHA
        report.update(status='V3_TEACHERS78_CPU_AUDITED_NO_MODEL_NO_GPU_PLAN',old78_source_target_order_unchanged=True,
            strict_candidate_saved_replays=156,typed_role_saved_replays=8,typed_role_teachers_preserved=4,
            multiclause_typed_scope_refusals=4,multiclause_teacher_ids=2,
            saved_reader_engine_both_compilers_both_authors_prohibited=True,
            candidate_identity_exclusions=['graph.request_ref','graph.response_ref'],
            role_identity_exclusions=['artifact_id','safe_text_projection.projection_of','safe_projection.projection_of'],
            min_training_context_margin=min(row['training_context_margin'] for row in report['rows']),
            min_generation_budget_margin=min(row['generation_budget_margin'] for row in report['rows']))
    except BaseException as exc:
        report.update(status='FAILED_CPU_AUDIT_NO_MODEL_NO_GPU_PLAN',error_type=type(exc).__name__,
            error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        report['process_seconds'] = time.monotonic()-start
        write(args.output/'result.json',report)
        write(args.output/'manifest.json',{str(path.relative_to(args.output)):sha(path)
            for path in args.output.rglob('*') if path.is_file() and path != args.output/'manifest.json'})
    print('V3_TEACHERS78_CPU_AUDITED',sha(args.output/'result.json'))


if __name__ == '__main__': main()
