from __future__ import annotations

import faulthandler
import importlib.util
import shutil
import sys
import time
from pathlib import Path

ROOT = Path.cwd()
TOOL = ROOT / 'tools/cocolon_context_routes.py'
INVENTORY = ROOT / 'Cocolon_前提資料/system_context/current/cmee_working/files.jsonl'
CODE_INDEX = ROOT / 'Cocolon_前提資料/system_context/current/cmee_working/code_index'
HELPER = ROOT / 'tools/cocolon_context_ts_routes.cjs'
OUTPUT = Path('/tmp/cocolon-c-stage-profile')
MASHOS = ROOT / '.cocolon-context-workspace/mashos-api'

faulthandler.enable()
faulthandler.dump_traceback_later(60, repeat=True)

spec = importlib.util.spec_from_file_location('routes_profile', TOOL)
if spec is None or spec.loader is None:
    raise SystemExit('route tool loader unavailable')
routes = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = routes
spec.loader.exec_module(routes)

for name in (
    '_base_build_route_graph',
    '_base_verify_route_graph',
    '_c_backend_closures',
    '_c_test_contract_edges',
    '_c_file_domain_assignments',
    '_c_verify_extended',
):
    original = getattr(routes, name)
    def make_wrapper(label, function):
        def wrapper(*args, **kwargs):
            started = time.monotonic()
            print(f'C_PROFILE_START {label}', flush=True)
            try:
                return function(*args, **kwargs)
            finally:
                print(f'C_PROFILE_END {label} seconds={time.monotonic() - started:.3f}', flush=True)
        return wrapper
    setattr(routes, name, make_wrapper(name, original))

shutil.rmtree(OUTPUT, ignore_errors=True)
started = time.monotonic()
print('C_PROFILE_BUILD_START', flush=True)
summary = routes.build_route_graph(
    INVENTORY,
    {'Cocolon': ROOT, 'mashos-api': MASHOS},
    CODE_INDEX,
    HELPER,
    OUTPUT,
)
print(f'C_PROFILE_BUILD_END seconds={time.monotonic() - started:.3f}', flush=True)
print(f'C_PROFILE_CLAIM {summary.get("completion_claim")}', flush=True)
faulthandler.cancel_dump_traceback_later()
