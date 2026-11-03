"""A bounded unbound prompt probe: four outputs, no admission or model writes.

This probe does not reuse the v4 request identity for changed messages. Results
cannot be passed into the v4 consumer. A versioned implementation is still needed.
"""
from dataclasses import asdict
import hashlib
import html
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import threading
import time
import traceback

W=Path('/workspace');ROOT=W/'analysis-material-v4-negquote-probe4-20261103'
MORPH=W/'analysis-material-v4-morph4-20261103'
HELPER=W/'material_v4_target4_execution.py'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(HELPER)=='946101d4b03b34bfe641b8c3298500e16229b2b48dd7ba86e67d88529127932b'
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
spec=importlib.util.spec_from_file_location('h',HELPER);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
INSTRUCTION='\n否定行動の引用：ACTION_OR_NONACTIONが単一節の否定行動を表す場合、NEGATIONのquoteは、そのfieldの原文にある動詞と否定語尾を連続したまま引用します。否定の語尾だけへ縮めません。原文の動詞を肯定形や別の活用へ書き換えません。この方針は原文にない主体や原因を補う許可ではありません。'


def main():
    assert not ROOT.exists(),'do_not_restart_probe'
    h.check_api();assert sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG
    assert not subprocess.check_output(['nvidia-smi','--query-compute-apps=pid','--format=csv,noheader'],text=True).strip()
    ROOT.mkdir();(ROOT/'runner.py').write_bytes(Path(__file__).read_bytes())
    from serve_emlis_natural_reply import load_generator
    start=time.monotonic();deadline=start+240
    def interrupted(*_):raise TimeoutError('bounded_probe')
    signal.signal(signal.SIGTERM,interrupted);signal.signal(signal.SIGALRM,interrupted);signal.setitimer(signal.ITIMER_REAL,240)
    report=dict(status='UNBOUND_PROMPT_PROBE_ONLY_STARTED',model_loads=1,calls=[],training_updates=0,normal_adoption=False,semantic_admission_performed=False)
    def save():
        h.write(ROOT/'report.json',report)
        body='<meta charset="utf-8"><pre>'+html.escape(json.dumps(report,ensure_ascii=False,indent=2))+'</pre>'
        for p in sorted(ROOT.glob('*.raw.txt')):body+='<h2>'+p.name+'</h2><pre>'+html.escape(p.read_text())+'</pre>'
        (W/'negquote-probe4-review.html').write_text(body)
    try:
        pack=json.loads((MORPH/'pack.json').read_text());rows={r['id']:r for r in pack['evaluation']}
        generator=load_generator(str(h.INITIAL),threading.Event(),weights_sha256=h.WEIGHTS,config_sha256=h.CONFIG)
        for key in ('X03','X04','M02','M04'):
            p=h.prepare_input(rows[key]);original=p.messages();messages=[dict(v) for v in original];messages[0]['content']+=INSTRUCTION
            digest=hashlib.sha256(h.canonical(messages).encode()).hexdigest()
            h.write(ROOT/(key+'.request.json'),dict(probe_identity='analysis_negquote_probe.'+digest,baseline_request_ref=p.request_ref,baseline_messages_sha256=hashlib.sha256(h.canonical(original).encode()).hexdigest(),messages_sha256=digest,messages=messages))
            raw,finish=generator(messages,min(deadline,time.monotonic()+45))
            (ROOT/(key+'.raw.txt')).write_text(raw)
            h.write(ROOT/(key+'.response.json'),dict(probe_identity='analysis_negquote_probe.'+digest,messages_sha256=digest,raw_sha256=hashlib.sha256(raw.encode()).hexdigest(),finish_reason=finish,raw=raw))
            report['calls'].append(dict(id=key,finish=finish,raw_sha256=hashlib.sha256(raw.encode()).hexdigest(),baseline_raw_identical=raw==(MORPH/'before'/(key+'.raw.txt')).read_text()));save()
            assert finish=='stop'
        report['status']='UNBOUND_PROMPT_PROBE_COMPLETE_NOT_ADOPTED'
    except BaseException:report.update(status='UNBOUND_PROMPT_PROBE_FAILED_NO_RETRY',traceback=traceback.format_exc());raise
    finally:
        report.update(seconds=time.monotonic()-start,initial_unchanged=sha(h.INITIAL/'adapter_model.safetensors')==h.WEIGHTS and sha(h.INITIAL/'adapter_config.json')==h.CONFIG);save()


if __name__=='__main__':main()
