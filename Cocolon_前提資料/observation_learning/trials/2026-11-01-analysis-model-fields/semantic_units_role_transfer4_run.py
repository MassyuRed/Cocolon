"""Exactly one zero-training73ee/aligned74 comparison on four new synthetic sources."""
from pathlib import Path
from dataclasses import asdict, replace
from contextlib import ExitStack
from hashlib import sha256, sha1
from importlib.metadata import version
from unittest.mock import patch
import gc, json, os, signal, subprocess, sys, threading, time, traceback

w = Path('/workspace')
api = w/'analysis-semantic-boundaries-api-20261103'
root = w/'analysis-role-transfer4-20261103'
out = root/'result'
old = w/'analysis-written-role74-20261103/result/adapter'
aligned = w/'analysis-aligned74-20261103'
new = aligned/'result/adapter'
COMMIT = 'dc05dc358d1c44ce47fd844f6041d74f1f74fe6a'
WEIGHTS = '73ee8d05a2e9be611df8654f4a583c87b3d27f266bedfe700f25f2d5325eae96'
CONFIG = '07262234563cbca51bfe75c3d6797b04cf89e7569f4cd0ee862e664ba5638685'
sys.dont_write_bytecode = True
os.environ['HF_HUB_OFFLINE'] = '1'
os.environ['TRANSFORMERS_OFFLINE'] = '1'
sys.path[:0] = [str(api/'ai/tools'),str(api/'ai/services/ai_inference')]
sha = lambda p: sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not out.exists() and (root/'prepare.exit').read_text() == '0'
    assert (aligned/'run.exit').read_text() == '0'
    assert subprocess.check_output(['git','-C',str(api),'rev-parse','HEAD'],text=True).strip() == COMMIT
    assert not subprocess.check_output(['git','-C',str(api),'status','--porcelain','--untracked-files=no'],text=True).strip()
    cpu = json.loads((root/'result.json').read_text())
    assert cpu['status'] == 'ROLE_TRANSFER4_CPU_PREPARED_NO_MODEL_NO_GPU_PLAN'
    assert cpu['api_commit'] == COMMIT and cpu['prompt_version'] == 'semantic_boundaries.v2'
    assert len(cpu['rows']) == 4 and len({r['probe_id'] for r in cpu['rows']}) == 4
    assert (cpu['expected_typed_role_returned'],cpu['expected_typed_role_rejected']) == (2,2)
    assert cpu['comparison_population']['nonempty_field_exact_matches'] == 0
    assert cpu['comparison_population']['memo_action_pair_exact_matches'] == 0
    for path,expected in cpu['api_source_blobs'].items():
        b = (api/path).read_bytes()
        assert sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest() == expected
    cpu_manifest = json.loads((root/'cpu_manifest.json').read_text())
    assert all(sha(root/path) == expected for path,expected in cpu_manifest.items())
    source_report = json.loads((aligned/'result/report.json').read_text())
    assert source_report['status'] == 'COMPLETE_NOT_ADOPTED_PENDING_RAW_READ'
    assert (source_report['updates_completed'],source_report['new_calls'],source_report['model_loads']) == (86,46,2)
    assert source_report['initial_hashes'] == {'adapter_config.json':CONFIG,'adapter_model.safetensors':WEIGHTS}
    adapters = [
        ('before',old,WEIGHTS,CONFIG),
        ('after',new,source_report['adapter_sha256'],source_report['adapter_config_sha256']),
    ]
    hashes = {str(path/name):sha(path/name) for _,path,_,_ in adapters
        for name in ('adapter_model.safetensors','adapter_config.json')}
    for _,path,weights,config in adapters:
        assert sha(path/'adapter_model.safetensors') == weights
        assert sha(path/'adapter_config.json') == config
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid,used_memory','--format=csv,noheader'],text=True).strip()
    import analysis_cumulative_service as service
    from cocolon_meaning_experience_engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis import intent_compiler as compiler
    from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
    from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
        AnalysisModelQuotedParentUnitsResponse,AnalysisSemanticError,canonical)
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    from serve_emlis_natural_reply import load_generator,MODEL,REVISION,PINS
    from transformers import AutoTokenizer
    import torch
    assert {n:version(n) for n in PINS} == PINS
    assert (MODEL,REVISION) == (cpu['model'],cpu['revision'])
    tok = AutoTokenizer.from_pretrained(MODEL,revision=REVISION,local_files_only=True,trust_remote_code=False)
    prepared = []
    for row in cpu['rows']:
        p = service.prepare_cumulative_quoted_parent_units(row['owner'],row['snapshot'],prompt_version=cpu['prompt_version'])
        assert p.request_ref == row['request_ref'] and p.messages() == row['messages']
        tokens = tok.apply_chat_template(p.messages(),enable_thinking=False,add_generation_prompt=True,
            tokenize=True,return_dict=False,truncation=False)
        assert len(tokens) == row['prompt_tokens'] and len(tokens)+2048 <= 8192
        prepared.append((row,p))
    out.mkdir()
    report = dict(status='STARTED',api_commit=COMMIT,model=MODEL,revision=REVISION,
        runner_sha256=sha(Path(__file__)),cpu_result_sha256=sha(root/'result.json'),
        aligned_report_sha256=sha(aligned/'result/report.json'),prompt_version=cpu['prompt_version'],
        max_calls=8,max_model_loads=2,max_seconds=300,request_seconds=23,max_new_tokens=2048,context_tokens=8192,
        training_updates=0,model_loads=0,new_calls=0,calls=[],adapter_hashes=hashes,
        evaluation_scope='FOUR_NEW_SYNTHETIC_NEAR_TRANSFER_NOT_BLIND_GENERAL_OR_MASH_TEACHING',
        normal_adoption=False,next_training_initial_selected=False,product_credit=0)
    start = time.monotonic()
    deadline = start+300
    generator = None

    def save():
        report['process_seconds'] = time.monotonic()-start
        path = out/'report.tmp'
        path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
        path.replace(out/'report.json')

    def timeout(*_): raise TimeoutError('role_transfer4_deadline')

    def restore(reload,row,path):
        with ExitStack() as stack:
            for obj,name in [(MeaningExperienceEngine,'generate'),(compiler,'compile_analysis_unit_candidates'),
                (compiler,'compile_model_written_role_graph'),(author,'realize_analysis_unit_candidates'),
                (author,'realize_model_written_role_graph')]:
                stack.enter_context(patch.object(obj,name,side_effect=AssertionError('saved regeneration')))
            return reload(row['owner'],row['snapshot'],path.read_text())

    signal.signal(signal.SIGTERM,timeout)
    signal.signal(signal.SIGALRM,timeout)
    signal.setitimer(signal.ITIMER_REAL,300)
    save()
    try:
        for phase,path,weights,config in adapters:
            assert report['model_loads'] < 2 and time.monotonic() < deadline
            report['model_loads'] += 1
            save()
            generator = load_generator(str(path),threading.Event(),weights_sha256=weights,config_sha256=config)
            for row,p in prepared:
                assert report['new_calls'] < 8 and time.monotonic() < deadline
                key = phase+'_'+row['probe_id']
                sent = sha256(canonical(p.messages()).encode()).hexdigest()
                (out/(key+'.request.json')).write_text(json.dumps(dict(request_ref=p.request_ref,
                    messages_sha256=sent,messages=p.messages(),prompt_tokens=row['prompt_tokens']),ensure_ascii=False,indent=2)+'\n')
                item = dict(phase=phase,probe_id=row['probe_id'],status='STARTED',prompt_tokens=row['prompt_tokens'],
                    weights_sha256=weights,config_sha256=config,training_use=False,
                    expected_role_admission=row['expected_role_admission'],expected_role_reason=row['expected_role_reason'])
                report['calls'].append(item)
                report['new_calls'] += 1
                save()
                begin = time.monotonic()
                raw,finish = generator(p.messages(),min(deadline,begin+23))
                response = AnalysisModelQuotedParentUnitsResponse(p.request_ref,sent,sha256(raw.encode()).hexdigest(),finish,raw)
                (out/(key+'.raw.txt')).write_text(raw)
                (out/(key+'.response.json')).write_text(json.dumps(asdict(response),ensure_ascii=False,indent=2)+'\n')
                item.update(status='RETURNED',seconds=time.monotonic()-begin,finish_reason=finish,raw_sha256=response.raw_sha256)
                value = replace(p,response=response)
                for kind,build,serialize,reload,suffix in [
                    ('candidate',service.build_cumulative_quoted_parent_candidates,service.serialize_cumulative_quoted_parent_candidates,
                        service.reload_cumulative_quoted_parent_candidates,'.candidate.json'),
                    ('role',service.build_cumulative_written_role_map,service.serialize_cumulative_written_role_map,
                        service.reload_cumulative_written_role_map,'.role.json')]:
                    admission = 'admission' if kind == 'candidate' else 'role_admission'
                    reason = 'reason' if kind == 'candidate' else 'role_reason'
                    try: artifact,counts = build(row['owner'],row['snapshot'],model_input=value)
                    except (AnalysisSemanticError,AnalysisSourceError) as exc:
                        item[admission] = 'REJECTED'
                        item[reason] = str(exc)
                    else:
                        saved = out/(key+suffix)
                        saved.write_text(serialize(row['owner'],row['snapshot'],model_input=value,artifact=artifact,coverage=counts))
                        assert restore(reload,row,saved) == (artifact,counts)
                        item[admission] = 'RETURNED'
                        item[kind+'_coverage'] = counts
                        item[kind+'_file_replay'] = 'MATCHED_NO_ENGINE_BOTH_COMPILERS_BOTH_AUTHORS'
                try: item['source_reference_json_equal'] = canonical(json.loads(raw)) == canonical(json.loads(row['assistant_target']))
                except (TypeError,ValueError): item['source_reference_json_equal'] = False
                save()
            generator = None
            gc.collect()
            torch.cuda.empty_cache()
            torch.cuda.synchronize()
        assert (report['new_calls'],report['model_loads'],report['training_updates']) == (8,2,0)
        assert all(sha(path) == expected for path,expected in hashes.items())
        report.update(status='COMPLETE_PENDING_RAW_READ_NOT_ADOPTED',both_saved_adapters_unchanged=True,
            all_finished_stop=all(c['finish_reason'] == 'stop' for c in report['calls']))
    except BaseException as exc:
        report.update(status='FAILED_NOT_ADOPTED',error_type=type(exc).__name__,error=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        generator = None
        gc.collect()
        signal.setitimer(signal.ITIMER_REAL,0)
        save()


if __name__ == '__main__': main()
