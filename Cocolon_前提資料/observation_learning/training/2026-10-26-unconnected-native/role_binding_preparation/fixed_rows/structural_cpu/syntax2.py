"""Bounded, syntax-only fixed-rows token mask. No task values enter this module.

Schemas below mirror fixed_rows_reference_wire.py@7acff074. The runtime engine
accepts only a tokenizer and EOS ID; it never loads teachers/material/case IDs.
CPU fixtures are loaded only by the explicitly separate cpu_main entrypoint.
"""
import argparse
import codecs
from collections import OrderedDict
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import statistics
import time

SHAPES = {
    'root': ('s', 's', 'l:alias', 'l:q', 'c'),
    'alias': ('s', 's'), 'q': ('s', 's', 's', 's'),
    'c': ('l:claim', 'l:j', 's', 'j', 'l:relation', 's', 'l:j', 'l:update', 'prose'),
    'claim': ('time', 's', 'l:s', 's', 'mode', 'polarity', 'pred', 'l:j', 'subject', 's'),
    'time': ('s', 'l:s', 'nullable_s', 's'),
    'mode': ('l:s', 's'), 'polarity': ('l:s', 'l:s', 's'),
    'pred': ('l:j', 's'), 'subject': ('s', 'l:s', 'j'),
    'relation': ('l:s', 's', 's', 'l:j', 's', 'l:s', 's', 's'),
    'update': ('l:s', 's', 's', 'l:s', 's', 's', 's'),
    'prose': ('l:bind', 's', 's', 's'), 'bind': ('l:s', 'l:s', 's'),
}
WS = (9, 10, 13, 32)
HEX = frozenset(b'0123456789abcdefABCDEF')
UTF_PREFIX = (b'', b'\xc2', b'\xe1', b'\xf1', b'\xe0', b'\xed', b'\xf0', b'\xf4')


def utf_step(state, b):
    if state:
        low, high = ((128, 191) if state < 4 else
                     ((160, 191), (128, 159), (144, 191), (128, 143))[state - 4])
        if not low <= b <= high:
            return -1
        return (0, 0, 1, 2, 1, 1, 2, 2)[state]
    if b < 128:
        return 0
    if 194 <= b <= 223:
        return 1
    if b == 224:
        return 4
    if b == 237:
        return 5
    if 225 <= b <= 239:
        return 2
    if b == 240:
        return 6
    if b == 244:
        return 7
    if 241 <= b <= 243:
        return 3
    return -1


@dataclass(frozen=True, slots=True)
class State:
    stack: tuple = ('root',)
    mode: str = ''
    aux: int = 0

    @property
    def complete(self):
        return not self.stack and not self.mode

    def step(self, b):
        stack, mode, aux = self.stack, self.mode, self.aux
        if mode == 'string':
            if aux:
                u = utf_step(aux, b)
                return State(stack, mode, u) if u >= 0 else None
            if b == 34:
                return State(stack)
            if b == 92:
                return State(stack, 'escape')
            if b < 32:
                return None
            u = utf_step(0, b)
            return State(stack, mode, u) if u >= 0 else None
        if mode == 'escape':
            if b in b'"\\/bfnrt':
                return State(stack, 'string')
            return State(stack, 'hex', 4) if b == 117 else None
        if mode == 'hex':
            if b not in HEX:
                return None
            return State(stack, 'hex', aux - 1) if aux > 1 else State(stack, 'string')
        if mode.startswith('n'):
            # JSON number DFA; a delimiter is consumed by the parent afterwards.
            digit = 48 <= b <= 57
            next_mode = None
            if mode == 'n-': next_mode = 'n0' if b == 48 else ('ni' if 49 <= b <= 57 else None)
            elif mode == 'n0': next_mode = 'nd' if b == 46 else ('ne' if b in (69, 101) else None)
            elif mode == 'ni': next_mode = 'ni' if digit else ('nd' if b == 46 else ('ne' if b in (69, 101) else None))
            elif mode == 'nd': next_mode = 'nf' if digit else None
            elif mode == 'nf': next_mode = 'nf' if digit else ('ne' if b in (69, 101) else None)
            elif mode == 'ne': next_mode = 'ns' if b in (43, 45) else ('nx' if digit else None)
            elif mode == 'ns': next_mode = 'nx' if digit else None
            elif mode == 'nx': next_mode = 'nx' if digit else None
            if next_mode:
                return State(stack, next_mode)
            if mode in ('n0', 'ni', 'nf', 'nx') and (b in WS or b in b',]}'):
                return State(stack).step(b)
            return None
        if stack and stack[-1].startswith('literal:'):
            tail = stack[-1][8:]
            if b != ord(tail[0]):
                return None
            return State(stack[:-1] + (('literal:' + tail[1:],) if len(tail) > 1 else ()))
        if b in WS:
            return self
        if not stack:
            return None
        top, rest = stack[-1], stack[:-1]
        if top.startswith('='):
            return State(rest) if b == ord(top[1:]) else None
        if top.startswith('first:') or top.startswith('next:'):
            child = top.split(':', 1)[1]
            if b == 93 and top.startswith('first:'):
                return State(rest)
            return State(rest + ('after:' + child, child)).step(b)
        if top.startswith('after:'):
            child = top.split(':', 1)[1]
            if b == 93:
                return State(rest)
            return State(rest + ('next:' + child,)) if b == 44 else None
        if top == 'bind_end':
            if b == 93:
                return State(rest)
            return State(rest + ('=]', 'l:s')) if b == 44 else None
        if top in ('obj_first', 'obj_next'):
            if b == 125 and top == 'obj_first':
                return State(rest)
            return State(rest + ('obj_after', 'j', '=:', 's')).step(b)
        if top == 'obj_after':
            if b == 125:
                return State(rest)
            return State(rest + ('obj_next',)) if b == 44 else None
        if top == 's':
            return State(rest, 'string') if b == 34 else None
        if top == 'nullable_s':
            return State(rest + (('literal:ull',) if b == 110 else ('s',))).step(b) if b != 110 else State(rest + ('literal:ull',))
        if top.startswith('l:'):
            return State(rest + ('first:' + top[2:],)) if b == 91 else None
        if top in SHAPES:
            if b != 91:
                return None
            seq = []
            for index, child in enumerate(SHAPES[top]):
                if index: seq.append('=,')
                seq.append(child)
            seq.append('bind_end' if top == 'bind' else '=]')
            return State(rest + tuple(reversed(seq)))
        if top == 'j':
            if b == 34: return State(rest, 'string')
            if b == 91: return State(rest + ('first:j',))
            if b == 123: return State(rest + ('obj_first',))
            if b in (110, 116, 102):
                return State(rest + ('literal:' + {110:'ull',116:'rue',102:'alse'}[b],))
            if b == 45: return State(rest, 'n-')
            if 48 <= b <= 57: return State(rest, 'n0' if b == 48 else 'ni')
            return None
        raise AssertionError('unknown grammar symbol: ' + top)

    def feed(self, data):
        state = self
        for b in data:
            state = state.step(b)
            if state is None:
                return None
        return state


def byte_inverse():
    bs = list(range(33, 127)) + list(range(161, 173)) + list(range(174, 256))
    cs = list(bs)
    extra = 0
    for b in range(256):
        if b not in bs:
            bs.append(b); cs.append(256 + extra); extra += 1
    return {chr(c): b for b, c in zip(bs, cs)}


def trie_add(trie, data, token_id):
    node = trie
    for b in data:
        node = node.setdefault(b, {})
    node.setdefault(-1, []).append(token_id)


class TokenMask:
    def __init__(self, tokenizer):
        started = time.perf_counter()
        backend = json.loads(tokenizer.backend_tokenizer.to_str())
        assert backend['decoder']['type'] == 'ByteLevel'
        assert backend['model']['type'] == 'BPE'
        inverse = byte_inverse()
        special = set(tokenizer.all_special_ids)
        # Added non-special tokens must also have a verified ByteLevel encoding.
        vocab = dict(backend['model']['vocab'])
        for token in backend['added_tokens']:
            if token['special']: special.add(token['id'])
            elif token['content'] not in vocab:
                raise ValueError('non_model_added_token_requires_explicit_byte_proof')
        self.eos = tokenizer.eos_token_id
        assert self.eos in special
        self.size = max(len(tokenizer), max(vocab.values()) + 1)
        self.data = {}
        self.trie, self.complex_trie = {}, {}
        self.safe = [bytearray(self.size) for _ in UTF_PREFIX]
        self.cache = OrderedDict()
        self.tensor_cache = OrderedDict()
        decoder = tokenizer.backend_tokenizer.decoder
        self.token_mapping_checked = 0
        for text, tid in vocab.items():
            if tid in special:
                continue
            raw = bytes(inverse[ch] for ch in text)
            assert raw and decoder.decode([text]) == raw.decode('utf-8', errors='replace')
            self.token_mapping_checked += 1
            self.data[tid] = raw
            trie_add(self.trie, raw, tid)
            if any(b < 32 or b in (34, 92) for b in raw):
                trie_add(self.complex_trie, raw, tid)
            else:
                for u, prefix in enumerate(UTF_PREFIX):
                    try: codecs.utf_8_decode(prefix + raw, 'strict', False)
                    except UnicodeDecodeError: continue
                    self.safe[u][tid] = 1
        self.build_seconds = time.perf_counter() - started
        if self.build_seconds > 60:
            raise TimeoutError('mask_build_over_60_seconds')

    def allowed(self, state):
        if state in self.cache:
            self.cache.move_to_end(state)
            return self.cache[state]
        in_string = state.mode == 'string'
        mask = self.safe[state.aux].copy() if in_string else bytearray(self.size)
        trie = self.complex_trie if in_string else self.trie
        todo = [(trie, state)]
        while todo:
            node, current = todo.pop()
            for b, child in node.items():
                if b == -1:
                    for tid in child: mask[tid] = 1
                else:
                    following = current.step(b)
                    if following is not None:
                        todo.append((child, following))
        if state.complete:
            mask[self.eos] = 1
        if not any(mask):
            raise ValueError('empty_syntax_mask_no_fallback')
        self.cache[state] = mask
        if len(self.cache) > 192:
            self.cache.popitem(last=False)
        return mask

    def advance(self, state, tid):
        if tid == self.eos:
            if not state.complete: raise ValueError('eos_before_complete_root')
            return state
        data = self.data.get(tid)
        if data is None:
            raise ValueError('non_json_special_or_unknown_token')
        result = state.feed(data)
        if result is None:
            raise ValueError('generated_token_outside_syntax_mask')
        return result

    def tensor(self, state, width, device):
        import torch
        key = (state, width, str(device))
        if key in self.tensor_cache:
            self.tensor_cache.move_to_end(key)
            return self.tensor_cache[key]
        if width < self.size: raise ValueError('logits_vocabulary_too_small')
        raw = self.allowed(state)
        if width > len(raw): raw = raw + bytearray(width - len(raw))
        tensor = torch.frombuffer(raw, dtype=torch.bool).to(device=device, copy=True)
        self.tensor_cache[key] = tensor
        if len(self.tensor_cache) > 96:
            self.tensor_cache.popitem(last=False)
        return tensor


class SyntaxProcessor:
    def __init__(self, engine, prompt_length):
        self.engine, self.prompt_length = engine, prompt_length
        self.state = State()
        self.seen = 0
        self.observed_token_ids = []
        self.latencies = []

    def __call__(self, input_ids, scores):
        import torch
        started = time.perf_counter()
        if input_ids.shape[0] != 1 or scores.shape[0] != 1:
            raise ValueError('syntax2_single_sequence_only')
        count = input_ids.shape[1] - self.prompt_length
        if count not in (self.seen, self.seen + 1):
            raise ValueError('non_incremental_generation_no_replay_fallback')
        if count > self.seen:
            tid = int(input_ids[0, -1].item())
            self.observed_token_ids.append(tid)
            self.state = self.engine.advance(self.state, tid)
            self.seen = count
        allowed = self.engine.tensor(self.state, scores.shape[-1], scores.device)
        if torch.isnan(scores).any() or torch.isposinf(scores).any():
            raise ValueError('nonfinite_logits_no_fallback')
        scores.masked_fill_(~allowed.unsqueeze(0), -float('inf'))
        if not torch.isfinite(scores).any():
            raise ValueError('no_finite_allowed_logit_no_fallback')
        self.latencies.append(time.perf_counter() - started)
        return scores


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)


def cpu_main(args):
    import copy
    import gzip
    import importlib
    import importlib.metadata
    import inspect
    import os
    import resource
    import signal
    import sys
    start = time.perf_counter()
    def expired(*_): raise TimeoutError('cpu_300_seconds_no_gpu')
    signal.signal(signal.SIGALRM, expired); signal.setitimer(signal.ITIMER_REAL, 300)
    os.environ.update(CUDA_VISIBLE_DEVICES='', HF_HUB_OFFLINE='1', TRANSFORMERS_OFFLINE='1')
    import torch
    torch.set_num_threads(1)
    from transformers import AutoTokenizer, GenerationMixin, LogitsProcessorList
    assert not torch.cuda.is_initialized()
    assert importlib.metadata.version('transformers') == '5.19.0'
    assert 'prefix_allowed_tokens_fn' in inspect.signature(GenerationMixin.generate).parameters
    assert 'logits_processor' in inspect.signature(GenerationMixin.generate).parameters
    tokenizer = AutoTokenizer.from_pretrained('Qwen/Qwen3.5-4B', revision='851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a', local_files_only=True, trust_remote_code=False)
    cpu = args.cpu
    train = [json.loads(line) for line in (cpu/'train_messages11.jsonl').read_text().splitlines()]
    assert hashlib.sha256((cpu/'train_messages11.jsonl').read_bytes()).hexdigest() == 'ef2d70877eb55c9191a2600581e74bd3d51f316473655efc154b7c389cf5485e'
    ev = json.loads((cpu/'eval_inputs11.json').read_text())
    assert hashlib.sha256((cpu/'eval_inputs11.json').read_bytes()).hexdigest() == '8f32141212419628092c69e43dcf3a267651c8b95b20f1ad7e98e064cb41a820'
    import importlib.util
    consumer_path=Path('/workspace/cocolon_fixedrows5_pack_20261029/consume_fixed_rows5.py')
    spec=importlib.util.spec_from_file_location('syntax2_existing_consumer',consumer_path)
    consumer=importlib.util.module_from_spec(spec);sys.modules[spec.name]=consumer;spec.loader.exec_module(consumer)
    own=consumer.owners(args.api)
    wire = importlib.import_module('cocolon_meaning_experience_engine.fixed_rows_reference_wire')
    assert [len(wire.FIELDS[name]) for name in ('c','claim','time','mode','polarity','pred','subject','relation','update','prose')] == [9,10,4,2,3,2,3,8,7,4]
    engine = TokenMask(tokenizer)
    report = {'status':'CPU_RUNNING','engine_build_seconds':engine.build_seconds,'token_mapping_checked':engine.token_mapping_checked,'checks':{},'teacher_prefixes':[],'raw_first_rejected':[],'syntax_only':True,'model_loads':0,'model_forwards':0,'training_updates':0,'generations':0}
    all_latencies = []
    def replay(text, benchmark=False):
        ids = tokenizer.encode(text, add_special_tokens=False)
        assert b''.join(engine.data[i] for i in ids).decode('utf-8') == text
        assert tokenizer.decode(ids, skip_special_tokens=False, clean_up_tokenization_spaces=False) == text
        state = State()
        for tid in ids:
            now = time.perf_counter(); mask = engine.allowed(state)
            if benchmark: all_latencies.append(time.perf_counter()-now)
            assert mask[tid], (tid, state)
            assert not mask[engine.eos]
            state = engine.advance(state, tid)
        assert state.complete and engine.allowed(state)[engine.eos]
        assert state.feed(b' \r\n\t').complete and state.feed(b'[]') is None
        return ids
    targets = []
    for i in range(2):
        assert train[i]['id'] == ev[i]['case_id'] and train[i]['messages'][:-1] == ev[i]['messages']
        text = train[i]['messages'][-1]['content']; target = json.loads(text); targets.append(target)
        wire.decode_named(target)
        ids = replay(text, True)
        report['teacher_prefixes'].append({'case_id':ev[i]['case_id'],'tokens_without_eos':len(ids),'all_next_tokens_allowed':True})
        raw = json.loads((args.raw/('before_'+ev[i]['case_id']+'.jsonl')).read_text())
        assert b''.join(engine.data[t] for t in raw['output_token_ids']).decode('utf-8') == raw['raw_text']
        state = State(); rejected = None
        for pos, tid in enumerate(raw['output_token_ids']):
            if not engine.allowed(state)[tid]:
                rejected = {'case_id':ev[i]['case_id'],'token_offset':pos,'token_id':tid,'bytes_hex':engine.data[tid].hex()};break
            state = engine.advance(state,tid)
        assert rejected is not None
        report['raw_first_rejected'].append(rejected)
    # Type-valid values outside both teachers, including fields not null/empty.
    variants=[]
    v=copy.deepcopy(targets[0]);v[1]='different-version';v[2]=[['new','different-id']];v[3]=[]
    v[4][0]=[];v[4][1]=[{'x':[True,False,None,-0.0,1e-9]}];v[4][2]='different-core';v[4][3]={'nested':[1,{'q':'quote'}]};v[4][4]=[];v[4][5]='different-schema';v[4][6]=[{'unknown':['x']}];v[4][7]=[]
    v[4][8]=[[[[],[],'other-section'],[[],[],'another',[]]],'人「引用」\\改行\n😀','\u0000','自由な別文']
    variants.append(v)
    v=copy.deepcopy(targets[0]);v[4][0][0][8][2]={'non_null':[1,'自由']};v[4][0][0][6][0]=[{'arg':'new'}];v[4][0][0][7]=[{'qual':'other'}];v[4][0][0][4][1]='OTHER_MODE';v[4][0][0][0][2]='different time'; variants.append(v)
    for v in variants:
        wire.decode_named(v);replay(compact(v))
    different_format=copy.deepcopy(variants[0]);different_format[0]='another-format'
    replay(compact(different_format))
    try: wire.decode_named(different_format)
    except ValueError: pass
    else: raise AssertionError('receiver_accepted_different_format')
    report['checks']['teacher_external_type_valid_variants']=len(variants)
    escaped=compact(variants[0]).replace('😀',r'\uD83D\uDE00').replace('1e-09','1E-9')
    replay(escaped)
    for invalid in ('[', '["unfinished', '[null]', '["x",]', '["x","y",[],[],[]]{}'):
        end=State().feed(invalid.encode());assert end is None or not end.complete
    literal_base='["x","v",[],[],[[],[],"core",null,[],"schema",[],[],[[],"x","y","z"]]]'
    assert State().feed(literal_base.encode()).complete
    for wrong in ('n ull','nu ll','nul l','t rue','tr ue','tru e','f alse','fa lse','fal se','fals e'):
        assert State().feed(literal_base.replace('null',wrong).encode()) is None
    for wrong in ('01','1.','1e','1e+','-','NaN','Infinity','[1,]','{"x":1,}'):
        end=State().feed(literal_base.replace('null',wrong).encode());assert end is None or not end.complete
    for raw in (b'\xff',b'\xed\xa0\x80',b'\xc0\x80'):
        assert State((), 'string').feed(raw) is None
    for raw in (b'\\u0000',b'\\uD83D\\uDE00',b'\\"',b'\\\\'):
        assert State((), 'string').feed(raw) == State((), 'string')
    assert State((), 'string').feed(b'\xf0\x9f').feed(b'\x98\x80') == State((), 'string')
    assert not engine.allowed(State((), 'string'))[engine.eos]
    for sid in tokenizer.all_special_ids:
        if sid != engine.eos: assert not engine.allowed(State())[sid]
    report['checks'].update(unicode_escape_partial_bytes=True,extra_json_and_trailing_comma_rejected=True,special_tokens_rejected=True,root_eos_boundary=True)
    # Exercise the installed real LogitsProcessorList without any model forward.
    proc=SyntaxProcessor(engine,3); call=LogitsProcessorList([proc]); seq=[0,0,0]
    # Warm-up is syntax state only. Independent of task contents at runtime.
    for tid in tokenizer.encode(compact(targets[0]),add_special_tokens=False):
        scores=torch.zeros((1,engine.size)); result=call(torch.tensor([seq]),scores)
        assert torch.isfinite(result[0,tid]);seq.append(tid)
    scores=call(torch.tensor([seq]),torch.zeros((1,engine.size)))
    assert torch.isfinite(scores[0,engine.eos])
    report['checks']['installed_logits_processor_list']=True
    report['mask_seconds']={'mean':statistics.mean(all_latencies),'p95':sorted(all_latencies)[int(len(all_latencies)*.95)],'max':max(all_latencies),'samples':len(all_latencies)}
    report['processor_seconds']={'mean':statistics.mean(proc.latencies),'p95':sorted(proc.latencies)[int(len(proc.latencies)*.95)],'max':max(proc.latencies),'samples':len(proc.latencies)}
    report['projected_mask_seconds_at_caps']=[n*max(statistics.mean(all_latencies),statistics.mean(proc.latencies)) for n in (3712,3584)]
    assert max(report['projected_mask_seconds_at_caps']) <= 20, 'mask_over_20_seconds_at_cap'
    report['semantic_negatives']=[];report['teacher_cmee_controls']=[]
    for index,target in enumerate(targets):
        value=copy.deepcopy(target);value[4][0][0][2]=['nonexistent_quote_for_cpu_negative']
        wire.decode_named(value);replay(compact(value))
        raw={'raw_text':compact(value),'finish_reason':'stop','provider':'CPU_SYNTAX_NEGATIVE_NOT_MODEL','model':'Qwen/Qwen3.5-4B','revision':'851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a','adapter_revision':'syntax2_cpu_not_model','usage':{'prompt_tokens':0,'completion_tokens':0},'seconds':0.0}
        control=dict(raw,raw_text=compact(target))
        positive,_=consumer.read_raw(own,ev[index]['case_id'],control)
        assert positive['meaning_adopted'] and positive['body_available']
        report['teacher_cmee_controls'].append({'case_id':ev[index]['case_id'],'same_metadata_positive_meaning':True,'same_metadata_positive_body':True})
        item,saved=consumer.read_raw(own,ev[index]['case_id'],raw)
        assert not item['meaning_adopted'] and not item['body_available'] and saved is None
        report['semantic_negatives'].append({'case_id':ev[index]['case_id'],'receipt_status':item['receipt']['status'],'reason_code':item['reason_code'],'meaning_adopted':False,'body_available':False})
    report['checks']['syntax_valid_wrong_semantics_rejected_by_existing_cmee']=True
    report['max_rss_kib']=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    report['seconds']=time.perf_counter()-start
    assert report['seconds']<300 and not torch.cuda.is_initialized()
    report['status']='CPU_SYNTAX2_PASSED_NO_MODEL'
    report['source_sha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    args.out.mkdir(exist_ok=False)
    (args.out/'cpu.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    signal.setitimer(signal.ITIMER_REAL,0)
    print(compact(report),flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--cpu',type=Path,required=True);p.add_argument('--raw',type=Path,required=True);p.add_argument('--api',type=Path,required=True);p.add_argument('--out',type=Path,required=True)
    cpu_main(p.parse_args())
