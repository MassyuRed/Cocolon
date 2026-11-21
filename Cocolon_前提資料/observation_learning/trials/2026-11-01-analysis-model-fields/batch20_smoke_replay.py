"""CPU-only old synthetic batch20 input replay on the wish consumer.

Usage: python batch20_smoke_replay.py NEW_API OLD_SMOKE_ROOT NEW_OUTPUT_ROOT
Only the pinned intent_compiler source may differ from the old pack. This is
synthetic smoke input, never the three incomplete live model responses.
No model/tokenizer, generation, normal ensure, API, DB or saved-map reader.
"""
from __future__ import annotations

from dataclasses import asdict
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import time
import traceback
from unittest.mock import patch
import zipfile

OLD_API = 'fc7563b98d5dfa5b8df7815e9a8b89f334b6719b'
NEW_API = '09b65013658c661cbc33a3857bd2e360e6f4c424'
INTENT = 'ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py'
PROFILE = 'selected_material.v7'


def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def digest(v):return hashlib.sha256(canonical(v).encode()).hexdigest()
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(p,v):p.write_text(canonical(v)+'\n',encoding='utf-8')


def main():
    assert len(sys.argv) == 4
    api,source,root = (Path(p).resolve() for p in sys.argv[1:])
    assert not root.exists() and not Path(str(root)+'.zip').exists()
    assert api not in root.parents and source not in root.parents and root not in {api,source}
    sys.dont_write_bytecode = True
    os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',HF_DATASETS_OFFLINE='1')
    git = lambda *args:subprocess.check_output(['git','-C',str(api),*args],text=True).strip()
    assert git('rev-parse','HEAD') == NEW_API and not git('status','--porcelain','--untracked-files=no')
    pack = json.loads((source/'pack.json').read_text())
    old_run = json.loads((source/'execution.json').read_text())
    old_map = json.loads((source/'composition.json').read_text())
    assert pack['api_commit'] == OLD_API and pack['prompt_version'] == PROFILE
    assert old_run['mode'] == 'smoke' and old_run['new_generation'] == old_run['model_loads'] == 0
    assert old_map['observed_map'] is None and old_map['coverage']['mapped_count'] == 0
    assert old_map['coverage']['source_count'] == old_map['coverage']['unparsed_count'] == 20
    before = {p:sha(api/p) for p in pack['source_hashes']}
    assert INTENT in before and before[INTENT] != pack['source_hashes'][INTENT]
    assert all(before[p] == h for p,h in pack['source_hashes'].items() if p != INTENT), 'unexpected_nonconsumer_source_change'
    source_paths = ('pack.json','prepare.json','synthetic_source.json','batch_input.json','execution.json','composition.json')
    # The batch runner uses report.json for preparation rather than prepare.json.
    source_paths = tuple(p for p in source_paths if (source/p).exists())
    input_hashes = {p:sha(source/p) for p in source_paths}
    assert input_hashes['batch_input.json'] == old_map['input_sha256']
    root.mkdir();shutil.copyfile(__file__,root/'runner.py')
    for name in source_paths:shutil.copyfile(source/name,root/('original_'+name))
    started = time.monotonic()
    report = dict(status='STARTED_CPU_ONLY',api_commit=NEW_API,original_api_commit=OLD_API,
        new_generation=0,model_loads=0,new_training=0,normal_adoption=False,api_calls=0,database_access=0,
        source_hashes_before=before,original_input_hashes=input_hashes,
        interpretation='Synthetic smoke responses only; live7/7/6 raw field-count failures are separate and are not repaired or replayed here.')
    failure = None
    def expired(*_):raise TimeoutError('cpu_replay_deadline')
    old_signal = signal.signal(signal.SIGALRM,expired);signal.setitimer(signal.ITIMER_REAL,140)
    try:
        assert 'analysis_cumulative_service' not in sys.modules
        sys.path[:0] = [str(api/'ai/services/ai_inference'),str(api/'ai/services'),str(api/'ai/tests'),str(api)]
        import analysis_cumulative_service as service
        from cocolon_meaning_experience_engine.cores.analysis import semantic_admission as semantic
        from cocolon_meaning_experience_engine.cores.analysis import observed_route_realizer as author
        from test_analysis_cumulative import OWNER,source_snapshot
        snapshot = json.loads((source/'synthetic_source.json').read_text())
        assert snapshot == source_snapshot(20) and digest(snapshot) == pack['fixture_sha256']
        parent = service.prepare_cumulative_category_units(OWNER,snapshot,prompt_version=PROFILE)
        assert parent.request_ref == pack['parent_request_ref']
        assert parent.messages() == pack['parent_messages'] and digest(parent.messages()) == pack['parent_messages_sha256']
        frozen,fields = semantic._model_fields_source(parent.request,allow_supplements=True)
        assert frozen.source_set_ref == pack['source_set_ref']
        assert [f['field_ref'] for f in fields] == pack['field_refs']
        raw_input = (source/'batch_input.json').read_text()
        def forbidden(*_,**__):raise AssertionError('input replay reached acquisition/compiler/author/store')
        with patch.object(service,'_model_response',forbidden),patch.object(service,'_rpc',forbidden),\
                patch.object(semantic,'_realize_model_observed_records',forbidden),\
                patch.object(semantic,'_compile_model_observed_record',forbidden),\
                patch.object(author,'realize_observed_graph',forbidden):
            value = service.reload_cumulative_model_batch_input(OWNER,snapshot,raw_input,prompt_version=PROFILE)
            assert service.serialize_cumulative_model_batch_input(OWNER,snapshot,model_input=value) == raw_input
        assert value.parent == parent and len(value.batches) == len(pack['children'])
        state = json.loads(raw_input)
        for child,row,saved in zip(value.batches,pack['children'],state['batches']):
            assert child.request_ref == row['request_ref'] == saved['request_ref']
            assert child.source_guard == parent.source_guard == row['source_guard']
            assert child.messages() == row['messages'] and digest(child.messages()) == row['messages_sha256']
            assert asdict(child.response) == saved['response']
        assert tuple(m.saved_record_ref for c in value.batches for m in c.request.members) == tuple(pack['record_refs'])
        artifact,coverage = service.build_cumulative_model_batch_map(OWNER,snapshot,model_input=value)
        report.update(after_coverage=coverage,after_map_present=artifact is not None,
            before_coverage=old_map['coverage'],before_map_present=False,
            exact_parent_children_messages_refs_sources=True,exact_response_dicts_and_input_bytes=True)
        if artifact is not None:
            write(root/'composition.json',dict(coverage=coverage,graph=asdict(artifact.graph),
                text=artifact.safe_text_projection(authenticated_owner_scope=OWNER),
                projection=artifact.safe_projection(authenticated_owner_scope=OWNER),
                source_members=[asdict(m) for m in artifact.source_members],source_set_ref=artifact.source_set_ref))
        else:
            write(root/'composition.json',dict(coverage=coverage,observed_map=None))
        assert artifact is not None and len(artifact.graph.nodes) == 2
        assert coverage['source_count'] == coverage['processed_count'] == coverage['mapped_count'] == 20
        assert coverage['unparsed_count'] == coverage['excluded_count'] == 0
        assert {n.node_kind for n in artifact.graph.nodes} == {'ACTION_OR_NONACTION','ATTENTION_OR_THOUGHT'}
        assert all(n.proposition.actor == 'SELF' and len(n.record_refs) == 20 for n in artifact.graph.nodes)
        report.update(status='COMPLETE_SYNTHETIC_CPU_REPLAY_NOT_ADOPTED',after_nodes=2,
            after_node_kinds=[n.node_kind for n in artifact.graph.nodes],model_calls_on_input_reload=0,
            response_rebound=False,raw_repaired=False)
    except BaseException as error:
        failure = error;report.update(status='FAILED_CPU_REPLAY',error_type=type(error).__name__,traceback=traceback.format_exc())
    finally:
        signal.setitimer(signal.ITIMER_REAL,0);signal.signal(signal.SIGALRM,old_signal)
        try:
            assert git('rev-parse','HEAD') == NEW_API and not git('status','--porcelain','--untracked-files=no')
            assert {p:sha(api/p) for p in before} == before
            assert {p:sha(source/p) for p in source_paths} == input_hashes
            report.update(source_hashes_unchanged=True,original_inputs_unchanged=True)
        except BaseException as error:
            report.update(status='FAILED_CPU_REPLAY',integrity_error_type=type(error).__name__)
            if failure is None:failure = error
        report['seconds'] = time.monotonic()-started;write(root/'report.json',report)
        public = {k:v for k,v in report.items() if k not in {'source_hashes_before','original_input_hashes','traceback'}}
        write(root/'aggregate.json',public)
        files = sorted(p for p in root.rglob('*') if p.is_file())
        write(root/'manifest.json',{str(p.relative_to(root)):dict(bytes=p.stat().st_size,sha256=sha(p)) for p in files})
        target = Path(str(root)+'.zip')
        with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED) as output:
            for p in files+[root/'manifest.json']:output.write(p,str(p.relative_to(root)))
        with zipfile.ZipFile(target) as output:assert output.testzip() is None
        print(canonical(dict(status=report['status'],archive=str(target),archive_sha256=sha(target))))
    if failure is not None:raise failure


if __name__ == '__main__':main()
