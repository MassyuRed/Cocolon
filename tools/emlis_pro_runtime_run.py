#!/usr/bin/env python3
"""Run existing synthetic Emlis tests using only the transported environment.

The source snapshot is intentionally not a full Git checkout. This entry is a
startup/portability check, not final CMEE acceptance or a replacement test suite.
"""
import ctypes
import errno
import json
import os
from pathlib import Path
import platform
import sys
import tempfile

ROOT = Path(__file__).resolve().parent
PYTHON = ROOT / 'python/bin/python3'
API = ROOT / 'sources/mashos-api'
DEFAULT_TEST = 'ai/tests/test_emlis_q2_application.py::test_persisted_round_and_restart_get_do_not_generate'


def deny_network():
    """OS filter inherited by Node children; keep local pipes/socketpair usable."""
    lib = ctypes.CDLL('libseccomp.so.2', use_errno=True)
    lib.seccomp_init.argtypes = [ctypes.c_uint32]
    lib.seccomp_init.restype = ctypes.c_void_p
    lib.seccomp_syscall_resolve_name.argtypes = [ctypes.c_char_p]
    lib.seccomp_syscall_resolve_name.restype = ctypes.c_int
    lib.seccomp_rule_add.argtypes = [ctypes.c_void_p, ctypes.c_uint32, ctypes.c_int, ctypes.c_uint]
    lib.seccomp_load.argtypes = [ctypes.c_void_p]
    lib.seccomp_release.argtypes = [ctypes.c_void_p]
    context = lib.seccomp_init(0x7fff0000)  # SCMP_ACT_ALLOW
    if not context:
        raise RuntimeError('cannot allocate network isolation')
    try:
        # No new sockets, connections or datagrams, including in subprocesses.
        # asyncio uses socketpair, not socket; PGlite uses stdin/stdout pipes.
        for name in [b'socket', b'connect', b'sendto', b'sendmsg', b'sendmmsg']:
            number = lib.seccomp_syscall_resolve_name(name)
            if number < 0 or lib.seccomp_rule_add(context, 0x00050000 | errno.ENETUNREACH, number, 0):
                raise RuntimeError('cannot install network isolation rule')
        if lib.seccomp_load(context):
            raise RuntimeError('network isolation unavailable; test not started')
    finally:
        lib.seccomp_release(context)


def main():
    if Path(sys.executable).resolve() != PYTHON.resolve() or not os.environ.get('EMLIS_BUNDLE_ISOLATED'):
        work = tempfile.mkdtemp(prefix='emlis-pro-test-')
        env = {
            'PATH': str(ROOT / 'node/bin') + ':/usr/bin:/bin',
            'HOME': work, 'TMPDIR': work, 'LANG': 'C.UTF-8', 'TZ': 'UTC',
            'PYTHONNOUSERSITE': '1', 'PYTHONDONTWRITEBYTECODE': '1',
            'PYTEST_DISABLE_PLUGIN_AUTOLOAD': '1', 'PYTHONHASHSEED': '0',
            'Q2_PGLITE_MODULE': str(ROOT / 'node_modules/@electric-sql/pglite'),
            'NODE_PATH': str(ROOT / 'node_modules'), 'EMLIS_BUNDLE_ISOLATED': '1',
            'PYTHONPATH': os.pathsep.join(map(str, [ROOT / 'site-packages', API / 'ai/services/ai_inference', API / 'ai', API])),
        }
        os.execve(PYTHON, [str(PYTHON), '-s', '-B', str(Path(__file__).resolve()), *sys.argv[1:]], env)
    assert platform.python_version() == '3.12.13', 'wrong Python version'
    assert platform.machine() == 'x86_64' and sys.platform == 'linux'
    import importlib.metadata as metadata
    spec = json.loads((ROOT / 'python-dependencies.lock.json').read_text())
    expected = {item['normalized_distribution_name']: item['distribution_version'] for item in spec['distributions']}
    actual = {item.metadata['Name'].lower().replace('_', '-'): item.version
              for item in metadata.distributions(path=[str(ROOT / 'site-packages')])}
    assert actual == expected and len(actual) == 46
    import pytest
    assert pytest.__version__ == '8.4.1'
    os.chdir(API)
    deny_network()
    args = sys.argv[1:] or ['-q', DEFAULT_TEST]
    print('TRANSPORTED_ENVIRONMENT: Python 3.12.13, pytest 8.4.1, fixed 46 distributions; OS network denial enabled', flush=True)
    raise SystemExit(pytest.main(['-p', 'no:cacheprovider', *args]))


if __name__ == '__main__':
    main()
