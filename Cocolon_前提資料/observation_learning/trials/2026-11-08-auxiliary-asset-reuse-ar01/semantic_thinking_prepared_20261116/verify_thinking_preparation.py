"""One-shot local source/token/CLI checks; no ML model or Pod access."""
import ast
import hashlib
import json
from pathlib import Path
import runpy
import sys
import tempfile
import types

BASE = Path.cwd()
HERE = Path(__file__).resolve().parent
TRIAL = BASE / 'cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01'
sys.path[:0] = [str(BASE / 'api/ai/services/ai_inference'), str(BASE / 'api/ai'),
    '/workspace/shared/alignment17-tokenizer/deps']
from tokenizers import Tokenizer
from jinja2 import Environment

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

config = json.loads(Path('/workspace/shared/alignment17-tokenizer/files/tokenizer_config.json').read_text())
template = Environment(trim_blocks=True, lstrip_blocks=True).from_string(config['chat_template'])
rust = Tokenizer.from_file('/workspace/shared/alignment17-tokenizer/files/tokenizer.json')

class TokenizerView:
    def apply_chat_template(self, messages, *, enable_thinking, add_generation_prompt, **kwargs):
        return rust.encode(template.render(messages=messages, enable_thinking=enable_thinking,
            add_generation_prompt=add_generation_prompt), add_special_tokens=False).ids
    def decode(self, tokens, *, skip_special_tokens=False):
        return rust.decode(tokens, skip_special_tokens=skip_special_tokens)
    def convert_tokens_to_ids(self, token):
        return rust.token_to_id(token)

class LocalAutoTokenizer:
    @classmethod
    def from_pretrained(cls, model, **kwargs):
        assert model == 'Qwen/Qwen3.5-4B'
        assert kwargs == dict(revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a',
            local_files_only=True, trust_remote_code=False)
        return TokenizerView()

def main():
    plan = json.loads((HERE / 'semantic_thinking_plan.json').read_text())
    ns = runpy.run_path(str(HERE / 'semantic_thinking_once.py'))
    assert ns['PLAN_SHA'] == sha(HERE / 'semantic_thinking_plan.json')
    assert plan['candidate_native_sha256'] == sha(HERE / 'semantic_thinking_candidate.py')
    assert sha(BASE / 'api' / ns['CORE_PATH']) == ns['CORE_SHA']
    assert not (Path('/workspace') / 'semantic-thinking-bounded-20261116-once').exists()
    rawbase = BASE / 'concrete/verification/semantic_alignment17_recovery_actual_20261116'
    pack = json.loads((TRIAL / 'semantic_alignment17_prepared_20261116/semantic_alignment17_plan.json').read_text())
    rows = json.loads((rawbase / 'after.result.json').read_text())['calls']
    tok = TokenizerView()
    for row in rows:
        before = tok.apply_chat_template(row['messages'], enable_thinking=False, add_generation_prompt=True)
        after = tok.apply_chat_template(row['messages'], enable_thinking=True, add_generation_prompt=True)
        assert tok.decode(before[-6:]).endswith('<think>\n\n</think>\n\n')
        assert tok.decode(after[-4:]).endswith('<think>\n')
        assert before[:-6] == after[:-4]
        assert len(after) + 6144 <= 32768
    assert [r['id'] for r in rows] == plan['case_ids']
    # Real current preparation and exact original after messages; no canned
    # graph/target is used to replace the native response.
    with tempfile.TemporaryDirectory() as folder:
        old = Path(folder) / 'old'
        old.mkdir()
        (old / 'plan.json').write_text(json.dumps(pack, ensure_ascii=False))
        (old / 'after.result.json').write_bytes((rawbase / 'after.result.json').read_bytes())
        (old / 'A3.actual.result.json').write_bytes((BASE / 'concrete/verification/worked_map_lesson_actual_20261116/positive-reading.actual.result.json').read_bytes())
        fn = ns['inputs']
        fn.__globals__['OLD'] = old
        app, core, prepared = fn(BASE / 'api', plan)
        assert len(prepared) == 5
        # ROOT/ai -> BASE/api/ai is the actual same-source owner, not a stub.
        out = Path(folder) / 'out'
        out.mkdir()
        ns['preflight'].__globals__.update(OLD=old, ROOT=out)
        previous = sys.modules.get('transformers')
        sys.modules['transformers'] = types.SimpleNamespace(AutoTokenizer=LocalAutoTokenizer)
        try:
            ns['preflight'](plan)
        finally:
            if previous is None:
                del sys.modules['transformers']
            else:
                sys.modules['transformers'] = previous
        proof = json.loads((out / 'preflight.json').read_text())
        assert len(proof['rows']) == 5
    for p in HERE.glob('*.py'):
        compile(p.read_text(), str(p), 'exec')
    report = dict(state='OFFLINE_PREPARATION_VERIFIED_NOT_MODEL_QUALITY',
        exact_same_source_preparations=5, exact_same_a6_messages=5,
        tokenizer='Fixed original Rust tokenizer and Jinja template; not a new HF model call',
        real_hf_remote_preflight='Required before provider stop; not claimed here',
        native_sha256=plan['candidate_native_sha256'], plan_sha256=sha(HERE / 'semantic_thinking_plan.json'),
        new_model_calls=0, training=0, gpu_access=0, remote_mutations=0)
    (HERE / 'preparation_verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False))

if __name__ == '__main__':
    main()
