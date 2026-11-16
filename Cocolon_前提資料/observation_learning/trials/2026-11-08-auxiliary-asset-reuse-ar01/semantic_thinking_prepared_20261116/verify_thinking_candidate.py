"""CPU token replay only: real pinned tokenizer/LMFE, no model or GPU load.

The small tensor/generation harness below supplies already-chosen tokens. It
does not simulate model quality or claim to validate HF/GPU execution.
"""
from pathlib import Path
import ast
from contextlib import contextmanager, redirect_stdout
import hashlib
import importlib.util
import io
import json
import logging
import os
import runpy
import signal
import sys
import threading
import time
from types import ModuleType, SimpleNamespace

import numpy as np

ROOT = Path(__file__).resolve().parent
WORK = Path.cwd()
RUNTIME = WORK / 'sql_runtime/runtime_recovery'
LMFE = RUNTIME / 'lm-format-enforcer-src'
TOKROOT = Path('/workspace/shared/alignment17-tokenizer')
sys.dont_write_bytecode = True
sys.path[:0] = [str(LMFE), str(RUNTIME / 'client-deps'),
    str(RUNTIME / 'test-deps'), str(TOKROOT / 'deps')]

from tokenizers import Tokenizer
from jinja2 import Environment


def sha(data):
    return hashlib.sha256(data).hexdigest()


class Tensor:
    """Only CPU ndarray operations exercised by the actual decode closure."""
    def __init__(self, values):
        self.values = np.asarray(values)

    @property
    def shape(self):
        return self.values.shape

    def __getitem__(self, key):
        value = self.values[key]
        return Tensor(value) if isinstance(value, np.ndarray) else value

    def __setitem__(self, key, value):
        self.values[key] = value

    def __len__(self):
        return len(self.values)

    def __add__(self, other):
        return Tensor(self.values + other.values)

    def clone(self):
        return Tensor(self.values.copy())

    def to(self, unused):
        return self

    def tolist(self):
        return self.values.tolist()


class FakeTorch:
    Tensor = LongTensor = FloatTensor = Tensor
    inference_mode = staticmethod(contextmanager(lambda: (yield)))

    @staticmethod
    def full_like(value, fill):
        return Tensor(np.full_like(value.values, fill))


class HarnessMaskedToken(ValueError):
    pass


# Only the integration's type imports are satisfied by these CPU stubs. The
# real pinned TokenEnforcer and TransformersPrefixAllowedTokensFn run below.
transformers = ModuleType('transformers')
transformers.AutoModelForCausalLM = object
transformers.PreTrainedTokenizerBase = type('PreTrainedTokenizerBase', (), {})
generation = ModuleType('transformers.generation')
logits = ModuleType('transformers.generation.logits_process')
logits.LogitsProcessor = type('LogitsProcessor', (), {})
logits.PrefixConstrainedLogitsProcessor = type('PrefixConstrainedLogitsProcessor', (), {})
sys.modules.update({'torch': FakeTorch, 'transformers': transformers,
    'transformers.generation': generation,
    'transformers.generation.logits_process': logits})

from lmformatenforcer.integrations import transformers as integration
from lmformatenforcer import TokenEnforcer, TokenEnforcerTokenizerData, StringParser
import lmformatenforcer


class FixedTokenizer:
    def __init__(self):
        self.raw = Tokenizer.from_file(str(TOKROOT / 'files/tokenizer.json'))
        self.config = json.loads((TOKROOT / 'files/tokenizer_config.json').read_text())
        self.template = Environment(trim_blocks=True, lstrip_blocks=True).from_string(self.config['chat_template'])
        entries = json.loads((TOKROOT / 'files/tokenizer.json').read_text())['added_tokens']
        self.all_special_ids = [entry['id'] for entry in entries if entry.get('special')]
        self.added_tokens_decoder = {entry['id']: SimpleNamespace(special=entry.get('special', False))
            for entry in entries}
        self.eos_token_id = self.encode('<|im_end|>')[0]
        self.last_template = None

    def __len__(self):
        return self.raw.get_vocab_size(with_added_tokens=True)

    def encode(self, text, add_special_tokens=False):
        return self.raw.encode(text, add_special_tokens=add_special_tokens).ids

    def decode(self, ids, skip_special_tokens=False, clean_up_tokenization_spaces=False):
        ids = ids.tolist() if isinstance(ids, Tensor) else ids
        return self.raw.decode([int(x) for x in ids], skip_special_tokens=skip_special_tokens)

    def apply_chat_template(self, messages, **kwargs):
        self.last_template = kwargs
        text = self.template.render(messages=messages, enable_thinking=kwargs['enable_thinking'],
            add_generation_prompt=kwargs['add_generation_prompt'])
        ids = self.encode(text)
        return {'input_ids': Tensor([ids]), 'attention_mask': Tensor([[1] * len(ids)])}


class TokenReplay:
    """Supply synthetic tokens through the real candidate callback once."""
    def __init__(self, tokens, *, force_eos=False):
        self.tokens = tokens
        self.force_eos = force_eos
        self.generate_calls = 0
        self.emitted = []
        self.kwargs = None
        self.device = 'cpu'
        self.generation_config = SimpleNamespace(eos_token_id=248046)
        self.first_scores = None
        self.disabled = 0

    @contextmanager
    def disable_adapter(self):
        self.disabled += 1
        yield

    def eval(self):
        return self

    def requires_grad_(self, flag):
        assert flag is False
        return self

    def generate(self, **kwargs):
        self.generate_calls += 1
        self.kwargs = kwargs
        assert np.array_equal(kwargs['attention_mask'].values, np.ones_like(kwargs['input_ids'].values))
        assert kwargs['do_sample'] is False and kwargs['num_beams'] == 1 and kwargs['use_cache'] is True
        assert 'past_key_values' not in kwargs
        sequence = kwargs['input_ids'][0].tolist()
        for token in self.tokens[:kwargs['max_new_tokens']]:
            batch = Tensor([sequence])
            if 'prefix_allowed_tokens_fn' in kwargs:
                allowed = kwargs['prefix_allowed_tokens_fn'](0, batch[0])
                if token not in allowed:
                    raise HarnessMaskedToken('fixture_token_masked')
            if 'logits_processor' in kwargs:
                scores = Tensor(np.zeros((1, len(TOKENIZER)), dtype=np.float32))
                for processor in kwargs['logits_processor']:
                    scores = processor(batch, scores)
                if self.first_scores is None:
                    self.first_scores = scores.values.copy()
                if not np.isfinite(scores.values[0, token]) and not self.force_eos:
                    raise HarnessMaskedToken('fixture_token_masked')
            sequence.append(token)
            self.emitted.append(token)
            if token == self.generation_config.eos_token_id:
                break
            if any(stopper(Tensor([sequence]), None) for stopper in kwargs['stopping_criteria']):
                break
        return Tensor([sequence])


ORIGINAL_PATH = WORK / 'concrete/verification/worked_map_lesson_actual_20261116/private_positive_candidate.py'
CANDIDATE_PATH = ROOT / 'semantic_thinking_candidate.py'
ORIGINAL = runpy.run_path(str(ORIGINAL_PATH))
CANDIDATE = runpy.run_path(str(CANDIDATE_PATH))
TOKENIZER = FixedTokenizer()
DATA = None
PREFIXES = []
real_build = integration.build_transformers_prefix_allowed_tokens_fn


def observed_build(*args, **kwargs):
    result = real_build(*args, **kwargs)
    PREFIXES.append(result)
    return result


integration.build_transformers_prefix_allowed_tokens_fn = observed_build


def factory(path, namespace):
    tree = ast.parse(path.read_text())
    outer = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'load_generator')
    children = [node for node in outer.body if (isinstance(node, ast.ClassDef) and node.name == 'Deadline')
        or (isinstance(node, ast.FunctionDef) and node.name == 'generate')]
    args = ['adapter', 'process_stop', 'max_new_tokens', 'context_tokens', 'semantic_json',
        'semantic_thinking_tokens', 'tokenizer', 'model', 'torch', 'tokenizer_data',
        'blocked_free_text', 'invalid_json_tokens', 'unsupported_unicode_tokens']
    wrapper = ast.FunctionDef(name='build_decode', args=ast.arguments(posonlyargs=[],
        args=[ast.arg(arg=name) for name in args], kwonlyargs=[], kw_defaults=[], defaults=[]),
        body=children + [ast.Return(value=ast.Name(id='generate', ctx=ast.Load()))], decorator_list=[])
    values = dict(namespace, StoppingCriteria=object, StoppingCriteriaList=list)
    exec(compile(ast.fix_missing_locations(ast.Module(body=[wrapper], type_ignores=[])), str(path), 'exec'), values)
    return values['build_decode']


FACTORIES = {'original': factory(ORIGINAL_PATH, ORIGINAL), 'candidate': factory(CANDIDATE_PATH, CANDIDATE)}


def decoder(replay, *, thinking=0, original=False, output=4096, context=32768, stopped=False):
    invalid = {token for token, decoded, _ in DATA.regular_tokens
        if not decoded or any(ord(char) < 32 for char in decoded)}
    blocked = {token for token, decoded, _ in DATA.regular_tokens
        if not decoded.strip() or any(ord(char) < 32 for char in decoded)}
    alphabet = frozenset(DATA.tokenizer_alphabet)
    unsupported = {token for token, decoded, _ in DATA.regular_tokens
        if '\ufffd' in decoded or any(char not in alphabet for char in decoded)}
    stop = threading.Event()
    if stopped:
        stop.set()
    return FACTORIES['original' if original else 'candidate']('synthetic-adapter', stop,
        output, context, True, thinking, TOKENIZER, replay, FakeTorch, DATA, blocked, invalid, unsupported)


PLAN = json.loads((WORK / 'cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_alignment17_prepared_20261116/semantic_alignment17_plan.json').read_text())
ROW = next(row for row in PLAN['teachers'] if row['id'] == 'T09_time')
MESSAGES, RAW = ROW['messages'], ROW['assistant_target']
JSON_IDS = TOKENIZER.encode(RAW) + [TOKENIZER.eos_token_id]
CLOSE = TOKENIZER.encode('</think>')[0]
THOUGHT_IDS = TOKENIZER.encode('PRIVATE_CPU_FIXTURE: compare the recorded events.\n') + [CLOSE]


def invoke(replay, **kwargs):
    generate = decoder(replay, **kwargs)
    with redirect_stdout(io.StringIO()) as logs:
        result = generate(MESSAGES, time.monotonic() + 300)
    assert 'PRIVATE_CPU_FIXTURE' not in logs.getvalue()
    return result


def expect_error(code, replay, **kwargs):
    try:
        invoke(replay, **kwargs)
    except ValueError as exc:
        assert str(exc) == code, (code, type(exc).__name__, str(exc))
    else:
        raise AssertionError('expected_failure_not_observed')


CHECKS = []


def check(name, fn):
    begin = time.monotonic()
    fn()
    CHECKS.append({'name': name, 'state': 'PASS', 'seconds': time.monotonic() - begin})


def check_default():
    before, after = TokenReplay(JSON_IDS), TokenReplay(JSON_IDS)
    assert invoke(before, original=True) == invoke(after) == (RAW, 'stop')
    assert before.generate_calls == after.generate_calls == 1
    assert before.kwargs.keys() == after.kwargs.keys()
    assert after.kwargs['max_new_tokens'] == 4096
    assert TOKENIZER.last_template['enable_thinking'] is False


def check_private_boundary():
    replay = TokenReplay(THOUGHT_IDS + JSON_IDS)
    before = len(PREFIXES)
    assert invoke(replay, thinking=2048) == (RAW, 'stop')
    assert replay.generate_calls == 1 and replay.disabled == 0
    assert replay.kwargs['max_new_tokens'] == 6144
    assert TOKENIZER.last_template['enable_thinking'] is True
    assert 'prefix_allowed_tokens_fn' not in replay.kwargs
    prefix = PREFIXES[before]
    prompt_count = len(replay.kwargs['input_ids'][0])
    assert min(map(len, prefix.token_enforcer.prefix_states)) == prompt_count + len(THOUGHT_IDS)
    assert tuple(replay.kwargs['input_ids'][0].tolist() + THOUGHT_IDS) in prefix.token_enforcer.prefix_states
    assert np.all(replay.first_scores == 0), 'natural_thinking_logits_changed'


def check_exact_thinking_budget():
    replay = TokenReplay(THOUGHT_IDS + JSON_IDS)
    assert invoke(replay, thinking=len(THOUGHT_IDS)) == (RAW, 'stop')
    short = TokenReplay(THOUGHT_IDS + JSON_IDS)
    expect_error('semantic_thinking_budget_exceeded', short, thinking=len(THOUGHT_IDS) - 1)
    assert short.generate_calls == 1 and CLOSE not in short.emitted


def check_no_close():
    replay = TokenReplay(TOKENIZER.encode('PRIVATE_CPU_FIXTURE does not close. ' * 6))
    expect_error('semantic_thinking_budget_exceeded', replay, thinking=5)
    assert len(replay.emitted) == 5 and CLOSE not in replay.emitted


def check_early_eos():
    replay = TokenReplay([TOKENIZER.eos_token_id])
    expect_error('semantic_thinking_incomplete', replay, thinking=10)
    assert replay.emitted == [TOKENIZER.eos_token_id]
    assert np.all(replay.first_scores == 0)
    forced = TokenReplay([TOKENIZER.eos_token_id], force_eos=True)
    expect_error('semantic_thinking_incomplete', forced, thinking=10)


def check_prompt_close_not_generated_close():
    messages = [dict(message) for message in MESSAGES]
    messages[0]['content'] += '\nCPU fixture prompt has </think> already.'
    replay = TokenReplay(TOKENIZER.encode('no close ' * 5))
    generate = decoder(replay, thinking=3)
    try:
        generate(messages, time.monotonic() + 300)
    except ValueError as exc:
        assert str(exc) == 'semantic_thinking_budget_exceeded'
    else:
        raise AssertionError('prompt_close_was_misread')


def check_separate_json_budget():
    packet = json.loads(RAW)
    for node in packet['nodes']:
        node['explanation'] = 'a0b1c2d3e4f5g6h7i8j9' * 150
    fixture = json.dumps(packet, ensure_ascii=False, separators=(',', ':'))
    tokens = TOKENIZER.encode(fixture) + [TOKENIZER.eos_token_id]
    assert len(tokens) > 4096
    class BudgetReplay(TokenReplay):
        def generate(self, **kwargs):
            self.generate_calls += 1
            self.kwargs = kwargs
            processor = kwargs['logits_processor'][0]
            prompt = kwargs['input_ids'][0].tolist()
            scores = Tensor(np.zeros((1, len(TOKENIZER)), dtype=np.float32))
            assert processor(Tensor([prompt]), scores) is scores
            # Establish the real LMFE root exactly at the natural close.
            processor(Tensor([prompt + [CLOSE]]), scores)
            # This is a direct quota boundary probe, not 4096 decoder steps.
            # The shorter positive replay exercises every real LMFE step.
            self.emitted = [CLOSE] + tokens[:4096]
            return processor(Tensor([prompt + self.emitted]), scores)
    replay = BudgetReplay([CLOSE] + tokens)
    expect_error('semantic_json_budget_exceeded', replay, thinking=2048)
    assert replay.generate_calls == 1 and len(replay.emitted) == 4097


def check_context_reservation():
    replay = TokenReplay(THOUGHT_IDS + JSON_IDS)
    prompt = TOKENIZER.apply_chat_template(MESSAGES, enable_thinking=True, add_generation_prompt=True)['input_ids']
    expect_error('context_or_deadline_exceeded', replay, thinking=2048, context=len(prompt[0]) + 6143)
    assert replay.generate_calls == 0


def check_if_rejected():
    replay = TokenReplay([])
    generate = decoder(replay, thinking=2048)
    messages = [{'role': 'system', 'content': 'CPU fixture'}, {'role': 'user',
        'content': json.dumps({'model_schema': CANDIDATE['IF_CANDIDATE_SCHEMA']})}]
    try:
        generate(messages, time.monotonic() + 300)
    except ValueError as exc:
        assert str(exc) == 'semantic_thinking_map_only'
    else:
        raise AssertionError('IF_accepted_thinking')
    assert replay.generate_calls == 0


def check_natural_and_piece_unchanged():
    replay = TokenReplay(TOKENIZER.encode('CPU natural fixture') + [TOKENIZER.eos_token_id])
    generate = decoder(replay, thinking=2048)
    with redirect_stdout(io.StringIO()):
        assert generate(MESSAGES, time.monotonic() + 300, profile='natural') == ('CPU natural fixture', 'stop')
    assert replay.kwargs['max_new_tokens'] == 2048 and replay.disabled == 1
    assert TOKENIZER.last_template['enable_thinking'] is False
    messages = [{'role': 'system', 'content': 'CPU Piece fixture'}, {'role': 'user',
        'content': json.dumps({'core': 'piece', 'task': 'PIECE_MODEL_BODY',
            'control': {'field_slots': {'memo_0': {}}}})}]
    raw = '{"field_blocks":{"memo_0":"CPU fixture"}}'
    replay = TokenReplay(TOKENIZER.encode(raw) + [TOKENIZER.eos_token_id])
    generate = decoder(replay, thinking=2048)
    with redirect_stdout(io.StringIO()):
        assert generate(messages, time.monotonic() + 300, profile='piece') == (raw, 'stop')
    assert replay.kwargs['max_new_tokens'] == 2048 and replay.disabled == 1
    assert 'logits_processor' not in replay.kwargs
    assert TOKENIZER.last_template['enable_thinking'] is False


def check_failed_json_and_request_isolation():
    invalid = TokenReplay(THOUGHT_IDS + TOKENIZER.encode('{"overview":'))
    expect_error('fixture_token_masked', invalid, thinking=2048)
    # The failed request's parser cannot constrain the next invocation.
    valid = TokenReplay(THOUGHT_IDS + JSON_IDS)
    assert invoke(valid, thinking=2048) == (RAW, 'stop')


def check_lmfe_first_call_negative_control():
    token = {'{': 1, '}': 2}
    data = TokenEnforcerTokenizerData([(1, '{', False), (2, '}', False)],
        lambda ids: ''.join({1: '{', 2: '}'}.get(i, '') for i in ids), 3, False, 4)
    correct = TokenEnforcer(data, StringParser('{}'))
    assert 1 in correct.get_allowed_tokens([99, 98, CLOSE]).allowed_tokens
    assert 2 in correct.get_allowed_tokens([99, 98, CLOSE, 1]).allowed_tokens
    late = TokenEnforcer(data, StringParser('{}'))
    assert 1 in late.get_allowed_tokens([99, 98, CLOSE, 1]).allowed_tokens
    assert 2 not in late.get_allowed_tokens([99, 98, CLOSE, 1]).allowed_tokens


def check_invalid_configuration_before_model_load():
    for value in (-1, True, 2049, 1.5):
        try:
            CANDIDATE['load_generator'](None, threading.Event(), semantic_thinking_tokens=value)
        except ValueError as exc:
            assert str(exc) == 'semantic_thinking_configuration_invalid'
        else:
            raise AssertionError('invalid_config_accepted')


def check_existing_evidence_and_record_constraints():
    packet = json.loads(RAW)
    packet['nodes'][0]['evidence'][0]['field'] = 4
    replay = TokenReplay(THOUGHT_IDS + TOKENIZER.encode(json.dumps(packet,
        ensure_ascii=False, separators=(',', ':'))) + [TOKENIZER.eos_token_id])
    expect_error('fixture_token_masked', replay, thinking=2048)
    packet = json.loads(RAW)
    packet['nodes'] = packet['nodes'][:1]
    packet['edges'] = []
    replay = TokenReplay(THOUGHT_IDS + TOKENIZER.encode(json.dumps(packet,
        ensure_ascii=False, separators=(',', ':'))) + [TOKENIZER.eos_token_id])
    expect_error('fixture_token_masked', replay, thinking=2048)


def check_cli_delivery_and_default_zero():
    capture = {}

    def load(adapter, stop, **kwargs):
        capture['load'] = kwargs
        stop.set()
        return None

    def handler(generator, **kwargs):
        capture['handler'] = kwargs
        return object

    class Server:
        def __init__(self, address, unused):
            capture['address'] = address

        def server_close(self):
            pass

    main = CANDIDATE['main']
    namespace = main.__globals__
    old_globals = {name: namespace[name] for name in ('load_generator', 'make_handler', 'ThreadingHTTPServer')}
    old_argv = sys.argv
    old_key = os.environ.get('COCOLON_ANALYSIS_MODEL_API_KEY')
    old_signals = {s: signal.getsignal(s) for s in (signal.SIGTERM, signal.SIGINT)}
    try:
        namespace.update(load_generator=load, make_handler=handler, ThreadingHTTPServer=Server)
        os.environ['COCOLON_ANALYSIS_MODEL_API_KEY'] = 'CPU_FIXTURE_ONLY_NOT_A_REAL_KEY_12345'
        base = [str(CANDIDATE_PATH), '--analysis-service', '--semantic-json', '--model-name', 'private-cpu-alias']
        sys.argv = base + ['--semantic-thinking-tokens', '2048', '--max-requests', '13',
            '--max-new-tokens', '4096', '--context-tokens', '32768']
        main()
        assert capture['load']['semantic_thinking_tokens'] == 2048
        assert capture['load']['max_new_tokens'] == 4096
        assert capture['handler']['max_requests'] == 13
        sys.argv = base
        main()
        assert 'semantic_thinking_tokens' not in capture['load']
        assert capture['handler']['max_requests'] == 2
    finally:
        namespace.update(old_globals)
        sys.argv = old_argv
        for s, value in old_signals.items():
            signal.signal(s, value)
        if old_key is None:
            os.environ.pop('COCOLON_ANALYSIS_MODEL_API_KEY', None)
        else:
            os.environ['COCOLON_ANALYSIS_MODEL_API_KEY'] = old_key


def verify_source():
    original = ORIGINAL_PATH.read_bytes()
    assert sha(original) == '7ae06f31b4db9f8b705dddf67e098a8338c94765c78fc3d5d02194eb89eee562'
    receipt = json.loads((TOKROOT / 'receipt.json').read_text())
    for entry in receipt['files']:
        data = (TOKROOT / 'files' / entry['name']).read_bytes()
        assert len(data) == entry['bytes'] and sha(data) == entry['sha256']
    manifest = json.loads((WORK / 'concrete/runtime_recovery/runtime_restoration_manifest.json').read_text())
    sources = manifest['lmfe']['all_python_source_sha256']
    for name, expected in sources.items():
        assert sha((LMFE / name).read_bytes()) == expected
    assert manifest['lmfe']['exact_git_commit'] == CANDIDATE['SEMANTIC_FORMAT_SOURCE']
    assert Path(lmformatenforcer.__file__).resolve().is_relative_to(LMFE.resolve())
    def functions(path):
        text = path.read_text()
        return {n.name: ast.get_source_segment(text, n) for n in ast.parse(text).body
            if isinstance(n, (ast.FunctionDef, ast.ClassDef))}
    before, after = functions(ORIGINAL_PATH), functions(CANDIDATE_PATH)
    changed = [name for name in before if before[name] != after[name]]
    assert changed == ['load_generator', 'main'], changed
    compile(CANDIDATE_PATH.read_bytes(), str(CANDIDATE_PATH), 'exec')
    return {'source_sha256': sha(original), 'candidate_sha256': sha(CANDIDATE_PATH.read_bytes()),
        'candidate_bytes': CANDIDATE_PATH.stat().st_size, 'changed_top_level_functions': changed,
        'other_functions_byte_unchanged': True, 'lmfe_commit': CANDIDATE['SEMANTIC_FORMAT_SOURCE'],
        'pinned_lmfe_source_hashes_match': True, 'tokenizer_receipt_files_match': True,
        'model_loads': 0, 'gpu_calls': 0, 'remote_calls': 0, 'training': 0}


def main():
    global DATA
    provenance = verify_source()
    # Existing privacy filter also guards malformed-prefix negative controls.
    logging.getLogger().addFilter(CANDIDATE['SourcePrivateConstraintLog']())
    DATA = integration.build_token_enforcer_tokenizer_data(TOKENIZER,
        vocab_size=min(len(TOKENIZER), json.loads((TOKROOT / 'files/config.json').read_text())['text_config']['vocab_size']))
    for name, fn in [
        ('default_zero_same_real_parser_result_and_generate_options', check_default),
        ('natural_close_then_first_json_token_private_once', check_private_boundary),
        ('thinking_budget_exact_boundary_and_overrun', check_exact_thinking_budget),
        ('no_close_no_forced_close_or_retry', check_no_close),
        ('natural_eos_unchanged_and_missing_close_not_generated', check_early_eos),
        ('prompt_close_cannot_start_final_phase', check_prompt_close_not_generated_close),
        ('unused_thinking_budget_cannot_enlarge_final_json_budget', check_separate_json_budget),
        ('context_reserves_thinking_plus_final', check_context_reservation),
        ('if_optin_rejected_before_generation', check_if_rejected),
        ('natural_piece_keep_default_mode_and_base_profile', check_natural_and_piece_unchanged),
        ('wrong_json_key_rejected_and_next_request_fresh', check_failed_json_and_request_isolation),
        ('real_lmfe_first_call_anchor_negative_control', check_lmfe_first_call_negative_control),
        ('invalid_thinking_configuration_before_model_load', check_invalid_configuration_before_model_load),
        ('same_quote_field_pair_and_required_records_constraints', check_existing_evidence_and_record_constraints),
        ('cli_optin_delivery_and_default_zero_without_server', check_cli_delivery_and_default_zero),
    ]:
        check(name, fn)
    result = dict(state='CPU_SYNTHETIC_TOKEN_BOUNDARIES_PASS_NOT_MODEL_QUALITY', **provenance,
        checks=CHECKS, passed=len(CHECKS), failed=0,
        limitations=['No HF model.generate, model forward, GPU or weight load was run.',
            'Actual HF integration/GPU latency, thinking natural closure and semantic quality are unmeasured.',
            'Synthetic CPU tensor/generation harness executes the candidate decode closure and pinned LMFE.',
            'The final-4096 quota is probed directly after real LMFE root setup; no 4096-step model/decoder replay is claimed.',
            'Private alias wire false versus internal true remains an explicit experiment, not normal deployment.'])
    (ROOT / 'cpu_verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: value for key, value in result.items() if key != 'checks'}, ensure_ascii=False))


if __name__ == '__main__':
    main()
