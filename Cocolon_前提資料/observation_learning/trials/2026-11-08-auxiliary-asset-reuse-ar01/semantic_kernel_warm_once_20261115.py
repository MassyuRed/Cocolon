"""Prepare a bounded, isolated kernel proof; never load model weights or generate.

Run only after the two pinned pure-Python wheels have been installed into DEPS.
The parent reads the provider's restart state into RAM, then launches this file's
worker with the same environment plus the candidate-only import/cache paths.
"""
import argparse
import hashlib
import importlib
import importlib.metadata
import importlib.util
import inspect
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

DEPS = Path('/workspace/semantic-kernel-deps-20261115')
CACHE = Path('/workspace/semantic-kernel-cache-20261115/triton')
OUTPUT = Path('/workspace/semantic-kernel-proof-20261115.json')
PYTHON = '/workspace/cocolon_venv/bin/python'
SERVE = Path('/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py')
SERVE_SHA = 'ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be'
MODEL = 'Qwen/Qwen3.5-4B'
REVISION = '851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a'
VERSIONS = {'torch': '2.8.0+cu128', 'transformers': '5.19.0', 'triton': '3.4.0'}
DEPENDENCIES = {'fla-core': '0.6.0', 'einops': '0.8.2'}
BASELINE_MODULES = tuple(VERSIONS) + ('transformers.models.qwen3_5.modeling_qwen3_5',
    'transformers.integrations.hub_kernels')


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def file_identity(path):
    path = Path(path).resolve()
    return dict(path=str(path), sha256=digest(path.read_bytes()))


def dependency_tree():
    files = {str(path.relative_to(DEPS)): digest(path.read_bytes())
        for path in sorted(DEPS.rglob('*')) if path.is_file() and '__pycache__' not in path.parts
        and path.suffix != '.pyc'}
    assert files and all(not name.split('/')[0].startswith(('torch', 'triton', 'transformers'))
        for name in files), 'isolated_dependencies_overwrite_baseline'
    return dict(file_count=len(files), sha256=digest(canonical(files).encode()))


def bound_reference(wrapper, expected):
    """Read the exact Transformers 5.19 closure that selects the native op."""
    pending, seen = [wrapper], set()
    while pending:
        value = pending.pop()
        if not inspect.isfunction(value) or id(value) in seen:
            continue
        seen.add(id(value))
        closure = inspect.getclosurevars(value).nonlocals
        if closure.get('implementation') is expected:
            assert closure.get('is_new_implementation') is True
            reference = closure['torch_function']
            assert reference.__module__ == 'transformers.models.qwen3_5.modeling_qwen3_5'
            return reference
        pending.extend(v for v in closure.values() if inspect.isfunction(v))
        if hasattr(value, '__wrapped__'):
            pending.append(value.__wrapped__)
    raise RuntimeError('transformers_native_kernel_not_bound')


def worker(args):
    started = time.monotonic()
    proof = dict(schema='cocolon.analysis.kernel_warm_proof.v1', state='STARTED',
        warm_completed=False, finite=False, model_loaded=False, weights_loaded=False,
        new_model_calls=0, training=0, worker_seconds=120, outer_seconds=130,
        provider_pid=args.provider_pid, script=file_identity(__file__),
        deps_path=str(DEPS), cache_dir=str(CACHE), capacity_proof=file_identity(args.capacity_proof),
        pythonpath_suffix_sha256=args.pythonpath_suffix_sha256)
    def save():
        OUTPUT.write_text(canonical(proof) + '\n')
        OUTPUT.chmod(0o600)
    def deadline(signum, frame):
        raise TimeoutError('kernel_warm_deadline')
    signal.signal(signal.SIGALRM, deadline)
    signal.signal(signal.SIGTERM, deadline)
    signal.alarm(120)
    try:
        assert os.environ['PYTHONPATH'].split(os.pathsep)[0] == str(DEPS)
        assert os.environ['TRITON_CACHE_DIR'] == str(CACHE)
        assert os.environ.get('FLA_TRIL_PRECISION', 'ieee') == 'ieee'
        assert os.environ.get('FLA_USE_FAST_OPS', '0') == '0'
        assert os.environ.get('FLA_CI_ENV', '0') == '0'
        proof['precision'] = dict(fla_tril_precision='ieee', fla_use_fast_ops=False, fla_ci_env=False)
        assert {name: importlib.metadata.version(name) for name in VERSIONS} == VERSIONS
        assert {name: importlib.metadata.version(name) for name in DEPENDENCIES} == DEPENDENCIES
        before = {name: file_identity(importlib.util.find_spec(name).origin) for name in BASELINE_MODULES}
        assert all(not Path(row['path']).is_relative_to(DEPS) for row in before.values())
        dep_before = dependency_tree()
        import torch
        from transformers import AutoConfig
        from transformers.models.qwen3_5 import modeling_qwen3_5 as qwen
        from fla.ops.gated_delta_rule import chunk_gated_delta_rule, fused_recurrent_gated_delta_rule
        from fla.utils import assert_close
        refs = {}
        imports = {}
        for name, wrapper, native in (
            ('chunk_gated_delta_rule', qwen.torch_chunk_gated_delta_rule, chunk_gated_delta_rule),
            ('fused_recurrent_gated_delta_rule', qwen.torch_recurrent_gated_delta_rule,
                fused_recurrent_gated_delta_rule)):
            refs[name] = bound_reference(wrapper, native)
            module_path = importlib.import_module(native.__module__).__file__
            assert Path(module_path).resolve().is_relative_to(DEPS / 'fla')
            assert native.__module__.startswith('fla.ops.gated_delta_rule.')
            imports[name] = dict(function=native.__name__, module=native.__module__,
                **file_identity(module_path), dispatch_bound=True,
                reference_module=refs[name].__module__, reference_name=refs[name].__name__)
        proof['kernel_imports'] = imports
        dependency_versions = dict(DEPENDENCIES)
        try:
            conv_version = importlib.metadata.version('causal-conv1d')
        except importlib.metadata.PackageNotFoundError:
            conv = None
            proof['causal_conv1d'] = dict(installed=False, tested=False, reason='NOT_INSTALLED')
        else:
            assert conv_version.split('+', 1)[0] == '1.7.0'
            assert torch._C._GLIBCXX_USE_CXX11_ABI is True
            import causal_conv1d as conv
            import causal_conv1d_cuda
            dependency_versions['causal-conv1d'] = conv_version
            assert Path(causal_conv1d_cuda.__file__).resolve().is_relative_to(DEPS)
            proof['causal_conv1d'] = dict(installed=True, tested=False, version=conv_version,
                extension=file_identity(causal_conv1d_cuda.__file__))
            for name in ('causal_conv1d_fn', 'causal_conv1d_update'):
                native = getattr(conv, name)
                refs[name] = bound_reference(getattr(qwen, name), native)
                module_path = importlib.import_module(native.__module__).__file__
                assert Path(module_path).resolve().is_relative_to(DEPS / 'causal_conv1d')
                imports[name] = dict(function=native.__name__, module=native.__module__,
                    **file_identity(module_path), dispatch_bound=True,
                    reference_module=refs[name].__module__, reference_name=refs[name].__name__)
        config = AutoConfig.from_pretrained(MODEL, revision=REVISION,
            local_files_only=True, trust_remote_code=False)
        text = getattr(config, 'text_config', config)
        shape = {name: getattr(text, name) for name in ('num_hidden_layers',
            'linear_num_key_heads', 'linear_num_value_heads', 'linear_key_head_dim',
            'linear_value_head_dim', 'linear_conv_kernel_dim')}
        assert shape == dict(num_hidden_layers=32, linear_num_key_heads=16,
            linear_num_value_heads=32, linear_key_head_dim=128, linear_value_head_dim=128,
            linear_conv_kernel_dim=4)
        capacity = json.loads(Path(args.capacity_proof).read_text())
        assert capacity['messages_sha256'] == args.messages_sha256
        assert capacity['new_model_calls'] == 0 and capacity['model_loaded'] is False
        total = capacity['input_tokens']
        assert total == args.input_tokens
        assert type(total) is int and 0 < total and total + 4096 <= 32768
        assert torch.cuda.is_available() and torch.cuda.get_device_capability() == (8, 6)
        proof['model_config'] = dict(model=MODEL, revision=REVISION, shape=shape)
        proof['gpu'] = dict(name=torch.cuda.get_device_name(), capability=[8, 6])
        proof['dependency_versions'] = dependency_versions
        proof['baseline_versions'] = VERSIONS
        proof['baseline_sources_before'] = before
        proof['dependency_tree_before'] = dep_before
        save()
        torch.manual_seed(20261115)
        def inputs(length):
            # TF5.19 expands Q/K before either op: kernel H=HV=32, although
            # the checkpoint's projected Q/K head count remains 16.
            combined = torch.randn(1, length, 8192, device='cuda', dtype=torch.bfloat16)
            query, key, value = combined.split((2048, 2048, 4096), dim=-1)
            return (query.reshape(1, length, 16, 128).repeat_interleave(2, dim=2),
                key.reshape(1, length, 16, 128).repeat_interleave(2, dim=2),
                value.reshape(1, length, 32, 128),
                torch.full((1, length, 32), -.25, device='cuda', dtype=torch.float32),
                torch.full((1, length, 32), .5, device='cuda', dtype=torch.bfloat16))
        def run(function, values, state=None):
            query, key, value, g, beta = values
            return function(query, key, value, g=g, beta=beta, initial_state=state,
                output_final_state=True, use_qk_l2norm_in_kernel=True)
        parity = {}
        def compare(name, reference, actual):
            for suffix, ref, value in zip(('output', 'state'), reference, actual):
                assert ref.shape == value.shape
                assert bool(torch.isfinite(ref).all()) and bool(torch.isfinite(value).all())
                # The upstream GDN tests use assert_close with 0.005 for chunk
                # outputs/states. Keep that check, without CI tolerance bypass.
                assert_close(name + '_' + suffix, ref, value, 0.005)
                difference = ref.float() - value.float()
                relative = difference.square().mean().sqrt() / ref.float().square().mean().sqrt().clamp_min(1e-12)
                parity[name + '_' + suffix] = dict(finite=True, allclose=True,
                    tolerance=0.005, rms_relative_error=float(relative),
                    max_absolute_error=float(difference.abs().max()))
        with torch.inference_mode():
            toy = inputs(64)
            reference = run(refs['chunk_gated_delta_rule'], toy)
            actual = run(chunk_gated_delta_rule, toy)
            compare('chunk', reference, actual)
            step = inputs(1)
            compare('fused_recurrent', run(refs['fused_recurrent_gated_delta_rule'], step, reference[1]),
                run(fused_recurrent_gated_delta_rule, step, reference[1]))
            if conv is not None:
                conv_input = torch.randn(1, 64, 8192, device='cuda', dtype=torch.bfloat16).transpose(1, 2)
                conv_weight = torch.randn(8192, 4, device='cuda', dtype=torch.bfloat16)
                conv_step = torch.randn(1, 1, 8192, device='cuda', dtype=torch.bfloat16).transpose(1, 2)
                conv_state = torch.randn(1, 8192, 4, device='cuda', dtype=torch.bfloat16)
                def conv_compare(name, ref, value):
                    assert ref.shape == value.shape
                    assert bool(torch.isfinite(ref).all()) and bool(torch.isfinite(value).all())
                    # The official causal-conv1d bf16 tests use these bounds.
                    assert torch.allclose(ref, value, rtol=1e-2, atol=5e-2)
                    parity[name] = dict(finite=True, allclose=True, rtol=1e-2, atol=5e-2,
                        max_absolute_error=float((ref.float() - value.float()).abs().max()))
                conv_compare('causal_conv1d_output',
                    refs['causal_conv1d_fn'](conv_input, conv_weight, activation='silu'),
                    conv.causal_conv1d_fn(conv_input, conv_weight, activation='silu'))
                ref_state, native_state = conv_state.clone(), conv_state.clone()
                conv_compare('causal_conv1d_update_output',
                    refs['causal_conv1d_update'](conv_step, ref_state, conv_weight, activation='silu'),
                    conv.causal_conv1d_update(conv_step, native_state, conv_weight, activation='silu'))
                assert bool(torch.isfinite(ref_state).all()) and bool(torch.isfinite(native_state).all())
                assert torch.equal(ref_state, native_state)
                parity['causal_conv1d_update_state'] = dict(finite=True, allclose=True, exact_equal=True,
                    max_absolute_error=0.0)
                proof['causal_conv1d']['tested'] = True
            full = inputs(total)
            warm = []
            for iteration in range(2):
                torch.cuda.synchronize()
                tick = time.monotonic()
                output, state = run(chunk_gated_delta_rule, full)
                next_output, next_state = run(fused_recurrent_gated_delta_rule, step, state)
                assert all(bool(torch.isfinite(value).all()) for value in (output, state, next_output, next_state))
                torch.cuda.synchronize()
                warm.append(dict(iteration=iteration + 1, prefill_tokens=total, decode_tokens=1,
                    finite=True, elapsed_seconds=time.monotonic() - tick))
        after = {name: file_identity(importlib.util.find_spec(name).origin) for name in BASELINE_MODULES}
        assert before == after
        dep_after = dependency_tree()
        assert dep_before == dep_after
        proof.update(state='PASS', warm_completed=True, finite=True, parity=parity, warm_runs=warm,
            baseline_sources_after=after, baseline_unchanged=True,
            dependency_tree_after=dep_after, dependency_tree_unchanged=True,
            input_tokens=total, messages_sha256=args.messages_sha256,
            kernel_input_heads=dict(query=32, key=32, value=32, dimension=128),
            elapsed_seconds=time.monotonic() - started)
    except BaseException as exc:
        proof.update(state='FAILED', failure_type=type(exc).__name__,
            elapsed_seconds=time.monotonic() - started)
        save()
        raise
    finally:
        signal.alarm(0)
        save()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--provider-pid', required=True, type=int)
    parser.add_argument('--capacity-proof', required=True)
    parser.add_argument('--messages-sha256', required=True)
    parser.add_argument('--input-tokens', required=True, type=int)
    parser.add_argument('--worker', action='store_true')
    parser.add_argument('--pythonpath-suffix-sha256')
    args = parser.parse_args()
    assert len(args.messages_sha256) == 64 and set(args.messages_sha256) <= set('0123456789abcdef')
    assert 0 < args.input_tokens and args.input_tokens + 4096 <= 32768
    if args.worker:
        worker(args)
        return
    assert not OUTPUT.exists(), 'one_shot_proof_already_exists'
    assert DEPS.is_dir() and digest(SERVE.read_bytes()) == SERVE_SHA
    proc = Path('/proc') / str(args.provider_pid)
    argv = [value.decode() for value in (proc / 'cmdline').read_bytes().split(b'\0') if value]
    assert argv[0] == PYTHON and argv[1] == str(SERVE)
    original_env = dict(value.decode().split('=', 1)
        for value in (proc / 'environ').read_bytes().split(b'\0') if value)
    suffix = original_env.get('PYTHONPATH', '')
    warm_env = dict(original_env, PYTHONPATH=str(DEPS) + (os.pathsep + suffix if suffix else ''),
        TRITON_CACHE_DIR=str(CACHE), PYTHONDONTWRITEBYTECODE='1', HF_HUB_OFFLINE='1',
        TRANSFORMERS_OFFLINE='1')
    CACHE.mkdir(parents=True, exist_ok=True)
    command = [PYTHON, str(Path(__file__).resolve()), '--worker', '--provider-pid', str(args.provider_pid),
        '--capacity-proof', args.capacity_proof, '--messages-sha256', args.messages_sha256,
        '--input-tokens', str(args.input_tokens), '--pythonpath-suffix-sha256', digest(suffix.encode())]
    completed = subprocess.run(command, cwd=str((proc / 'cwd').resolve()), env=warm_env,
        stdin=subprocess.DEVNULL, timeout=130)
    assert completed.returncode == 0, 'kernel_warm_worker_failed'
    proof = json.loads(OUTPUT.read_text())
    assert proof['state'] == 'PASS' and proof['warm_completed'] is True
    print(canonical(dict(state=proof['state'], proof=str(OUTPUT),
        proof_sha256=digest(OUTPUT.read_bytes()), elapsed_seconds=proof['elapsed_seconds'],
        new_model_calls=0, weights_loaded=False)))


if __name__ == '__main__':
    main()
