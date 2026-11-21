"""Independent local tests of argument preservation, packaging and materials.

Never invokes execution main/preflight/acquire, a tokenizer, a model, a remote
endpoint, provider control, or SQL. Uses synthetic argv and temporary roots.
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile


BASE = Path(__file__).resolve().parent
DEPENDENCIES = BASE.parents[1] / 'handoff/extracted/runtime_recovery'
sys.dont_write_bytecode = True
sys.path[:0] = [str(DEPENDENCIES / 'client-deps'),
               str(DEPENDENCIES / 'lm-format-enforcer-src'), str(DEPENDENCIES / 'test-deps')]
spec = importlib.util.spec_from_file_location('local_event_plan_execution_under_test', BASE / 'event_plan_execution.py')
execution = importlib.util.module_from_spec(spec)
spec.loader.exec_module(execution)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def candidate_scope():
    return {'candidate_adapter': {'path': '/synthetic/isolated-event-plan-adapter',
            'weights_sha256': '1' * 64, 'config_sha256': '2' * 64}}


def provider_argv():
    return ['/synthetic/python', '/synthetic/original-native.py',
            '--analysis-service', '--semantic-json',
            '--model-name', 'cocolon-qwen3.5-4b-analysis-semantic-120u',
            '--adapter', '/synthetic/original-default-adapter',
            '--adapter-weights-sha256', '3' * 64,
            '--adapter-config-sha256', '4' * 64,
            '--natural-reply-model', 'synthetic-original-natural',
            '--natural-reply-correction-target-context',
            '--piece-adapter', '/synthetic/original-piece-adapter',
            '--piece-adapter-weights-sha256', '5' * 64,
            '--piece-adapter-config-sha256', '6' * 64,
            '--port', '8000']


class CandidateArguments(unittest.TestCase):
    def test_default_analysis_if_natural_piece_identity_and_extra_flags_are_preserved(self):
        original = provider_argv()
        before = original.copy()
        changed = execution.candidate_args(original, Path('/synthetic/new-native.py'), candidate_scope())
        self.assertEqual(original, before)
        self.assertEqual(changed[:2], ['/synthetic/python', '/synthetic/new-native.py'])
        expected_existing = original[2:].copy()
        expected_existing[expected_existing.index('--port') + 1] = str(execution.TRIAL_PORT)
        self.assertEqual(changed[2:len(original)], expected_existing)
        self.assertEqual(execution.option(changed, '--port'), '18008')
        self.assertEqual(execution.option(changed, '--event-plan-model'), execution.MODEL)
        self.assertEqual(execution.option(changed, '--event-plan-adapter'),
                         '/synthetic/isolated-event-plan-adapter')
        self.assertEqual(execution.option(changed, '--context-tokens'), '32768')
        self.assertEqual(execution.option(changed, '--max-new-tokens'), '4096')
        self.assertEqual(execution.option(changed, '--request-seconds'), '210')

    def test_old_explicit_generation_options_are_replaced_once_in_both_spellings(self):
        for suffix in (['--context-tokens', '16384', '--max-new-tokens', '2048', '--request-seconds', '30'],
                       ['--context-tokens=16384', '--max-new-tokens=2048', '--request-seconds=30']):
            with self.subTest(suffix=suffix):
                original = provider_argv() + suffix
                changed = execution.candidate_args(original, Path('/synthetic/new-native.py'), candidate_scope())
                for option, expected in (('--context-tokens', '32768'), ('--max-new-tokens', '4096'),
                                         ('--request-seconds', '210')):
                    self.assertEqual(execution.option(changed, option), expected)
                    self.assertEqual(sum(x == option or x.startswith(option + '=') for x in changed), 1)

    def test_existing_candidate_adapter_or_model_is_rejected_without_mutating_input(self):
        for option in ('--event-plan-model', '--event-plan-adapter',
                       '--event-plan-adapter-weights-sha256', '--event-plan-adapter-config-sha256'):
            with self.subTest(option=option):
                original = provider_argv() + [option, 'synthetic-existing-value']
                before = original.copy()
                with self.assertRaises(AssertionError):
                    execution.candidate_args(original, Path('/synthetic/new-native.py'), candidate_scope())
                self.assertEqual(original, before)

    def test_request_expiry_thinking_or_missing_service_constraints_are_rejected(self):
        cases = [provider_argv() + ['--max-requests', '9'],
                 provider_argv() + ['--semantic-thinking-tokens', '2048'],
                 [x for x in provider_argv() if x != '--analysis-service'],
                 [x for x in provider_argv() if x != '--semantic-json']]
        for original in cases:
            with self.subTest(original=original):
                with self.assertRaises(AssertionError):
                    execution.candidate_args(original, Path('/synthetic/new-native.py'), candidate_scope())

    def test_duplicate_identity_option_is_rejected_by_identity_check(self):
        with self.assertRaises(AssertionError):
            execution.candidate_args(provider_argv() + ['--adapter', '/synthetic/other'],
                                     Path('/synthetic/new-native.py'), candidate_scope())


class SafeSourceExtraction(unittest.TestCase):
    def make_payload(self, parent, name, raw=b'pass\n', *, archive_extra=False, wrong_hash=False):
        payload = parent / 'payload'
        payload.mkdir()
        rows = [{'path': name, 'bytes': len(raw), 'sha256': '0'*64 if wrong_hash else sha(raw)}]
        (payload / 'source_manifest.json').write_text(json.dumps({'sources': rows}))
        with zipfile.ZipFile(payload / 'current_api_sources.zip', 'w') as archive:
            archive.writestr(name, raw)
            if archive_extra:
                archive.writestr('unlisted.py', b'pass\n')
        return payload

    def test_exact_generated_package_extracts_full_bytes_under_same_repo_layout(self):
        manifest = json.loads((BASE / 'source_manifest.json').read_text())
        native = next(row for row in manifest['sources'] if row['path'] == execution.NATIVE)
        with tempfile.TemporaryDirectory(prefix='event-plan-safe-source-') as temporary:
            root = Path(temporary)
            execution.install_sources(root, {'candidate_native_sha256': native['sha256']})
            self.assertEqual(len([p for p in root.rglob('*') if p.is_file()]), manifest['source_count'])
            for row in manifest['sources']:
                data = (root / row['path']).read_bytes()
                self.assertEqual(len(data), row['bytes'])
                self.assertEqual(sha(data), row['sha256'])

    def test_absolute_and_parent_escape_paths_are_rejected_before_write(self):
        for bad_path in ('../outside.py', '/absolute-outside.py', 'ai/../../outside.py'):
            with self.subTest(path=bad_path), tempfile.TemporaryDirectory(prefix='event-plan-invalid-source-') as temporary:
                parent = Path(temporary)
                payload = self.make_payload(parent, bad_path)
                root = parent / 'root'
                root.mkdir()
                with patch.object(execution, 'PAYLOAD', payload), self.assertRaises(AssertionError):
                    execution.install_sources(root, {'candidate_native_sha256': '0' * 64})
                self.assertEqual(list(root.rglob('*')), [])
                self.assertFalse((parent / 'outside.py').exists())

    def test_archive_extra_member_or_byte_tamper_is_rejected(self):
        for options in ({'archive_extra': True}, {'wrong_hash': True}):
            with self.subTest(options=options), tempfile.TemporaryDirectory(prefix='event-plan-invalid-source-') as temporary:
                parent = Path(temporary)
                payload = self.make_payload(parent, 'ai/valid.py', **options)
                root = parent / 'root'
                root.mkdir()
                with patch.object(execution, 'PAYLOAD', payload), self.assertRaises(AssertionError):
                    execution.install_sources(root, {'candidate_native_sha256': '0' * 64})

    def test_different_native_snapshot_is_rejected(self):
        with tempfile.TemporaryDirectory(prefix='event-plan-native-mismatch-') as temporary:
            with self.assertRaises(AssertionError):
                execution.install_sources(Path(temporary), {'candidate_native_sha256': '0' * 64})


class OfflineProviderWrapper(unittest.TestCase):
    def invoke(self, unit, *, initial_native_limit=0, change_port=False, b_map_calls=7):
        calls = []
        marker = object()
        def fake_handler(*args, **kwargs):
            calls.append(('handler', args, kwargs))
            return marker
        def fake_server(address, handler):
            self.assertIs(handler, marker)
            calls.append(('server', address))
            return object()
        namespace = {'make_handler': fake_handler, 'ThreadingHTTPServer': fake_server,
                     'initial_native_limit': initial_native_limit, 'trial_port': execution.TRIAL_PORT}
        exec("def main():\n"
             "    handler = make_handler('dummy-generator', api_key='offline-test-placeholder',\n"
             "        model_name='synthetic-default-120u', deadline=210, max_requests=initial_native_limit)\n"
             "    ThreadingHTTPServer(('0.0.0.0', trial_port), handler)\n", namespace)
        with tempfile.TemporaryDirectory(prefix='event-plan-fake-provider-') as temporary:
            root = Path(temporary)
            native = root / execution.NATIVE
            native.parent.mkdir(parents=True)
            native.write_text('# Placeholder only; runpy is mocked and no native is executed.\n')
            scope = candidate_scope()
            scope.update(candidate_native_sha256=sha(native.read_bytes()),
                         units={'A9': {'max_model_calls': 9}, 'B9': {'max_model_calls': b_map_calls + 4}})
            argv = execution.candidate_args(provider_argv(), native, scope)
            if change_port:
                argv[argv.index('--port') + 1] = '8000'
            (root / 'provider.argv.json').write_text(json.dumps(argv))
            with (patch.object(execution.runpy, 'run_path', return_value={'main': namespace['main']}) as run,
                  patch.object(sys, 'argv', ['offline-test-parent'])):
                execution.provider(root, unit, scope)
                run.assert_called_once_with(str(native))
                self.assertEqual(sys.argv, argv[1:])
        return calls

    def test_provider_caps_native_calls_and_changes_bind_to_loopback_without_server(self):
        for unit, maps, count in (('A9', 5, 9), ('B9', 7, 11), ('B9', 13, 17)):
            with self.subTest(unit=unit, maps=maps):
                calls = self.invoke(unit, b_map_calls=maps)
                self.assertEqual(calls[0][0], 'handler')
                self.assertEqual(calls[0][2]['max_requests'], count)
                self.assertEqual(calls[0][2]['model_name'], 'synthetic-default-120u')
                self.assertEqual(calls[1], ('server', ('127.0.0.1', 18008)))

    def test_existing_native_call_cap_is_rejected_without_network_or_model(self):
        with self.assertRaises(AssertionError):
            self.invoke('A9', initial_native_limit=1)

    def test_provider_rejects_wrong_trial_port_before_fake_main(self):
        with self.assertRaises(AssertionError):
            self.invoke('A9', change_port=True)

    def test_changed_leaf_count_or_limits_are_rejected_before_tokenizer_or_provider(self):
        for leaves in (6, 12):
            for key in ('fresh_leaves', 'fresh_merge', 'max_map_calls', 'max_control_calls', 'max_model_calls'):
                limits=dict(fresh_leaves=leaves, fresh_merge=1, max_map_calls=leaves+1,
                    max_control_calls=4, max_model_calls=leaves+5)
                limits[key] += 1
                with self.subTest(leaves=leaves, key=key), patch.object(execution, 'material',
                        return_value=(None, None, (None, None, [None]*leaves))):
                    with self.assertRaises(AssertionError):
                        execution.preflight(Path('/unused'), 'B9', dict(units={'B9':limits}))


class MaterialPreparation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix='event-plan-material-source-')
        cls.root = Path(cls.temporary.name)
        manifest = json.loads((BASE / 'source_manifest.json').read_text())
        native = next(row for row in manifest['sources'] if row['path'] == execution.NATIVE)
        execution.install_sources(cls.root, {'candidate_native_sha256': native['sha256']})

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    def test_a9_five_preparations_match_existing_packet_identities_without_model_import(self):
        app, core, rows = execution.material(self.root, 'A9')
        self.assertEqual(len(rows), 5)
        self.assertTrue(all(prepared.prompt_version == execution.PROFILE for _, prepared in rows))
        self.assertTrue(Path(app.__file__).resolve().is_relative_to(self.root))
        self.assertFalse(any(name == 'torch' or name == 'transformers' or name.startswith('transformers.')
                             for name in sys.modules))

    def test_b9_preacquisition_parent_and_all_derived_cohort_stages_match_existing_packet(self):
        app, core, values = execution.material(self.root, 'B9')
        source, parent, stages = values
        self.assertEqual(len(source['snapshot']['members']), 12)
        self.assertEqual(len(stages), json.loads((BASE / 'full12_pre_acquisition.plan.json').read_text())['leaf_count'])
        self.assertEqual(sum(len(stage.record_refs) for stage in stages), 12)
        self.assertEqual(parent.prompt_version, execution.PROFILE)
        self.assertFalse(any(name == 'torch' or name == 'transformers' or name.startswith('transformers.')
                             for name in sys.modules))


if __name__ == '__main__':
    result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromModule(sys.modules[__name__]))
    record = {'state': 'PASS_OFFLINE_BOUNDARIES_ONLY' if result.wasSuccessful() else 'FAIL_OFFLINE_BOUNDARIES',
              'tests_run': result.testsRun, 'failures': len(result.failures), 'errors': len(result.errors),
              'tested_execution_sha256': sha((BASE / 'event_plan_execution.py').read_bytes()),
              'source_archive_sha256': sha((BASE / 'current_api_sources.zip').read_bytes()),
              'scope_file_used': False, 'dummy_scope_only': True,
              'main_calls': 0, 'actual_tokenizer_preflight_calls': 0,
              'model_calls': 0, 'GPU': 0, 'network_calls': 0, 'SQL_calls': 0,
              'runtime_ready_claim': False}
    (BASE / 'execution_offline_verification.json').write_text(json.dumps(record, sort_keys=True, indent=2) + '\n')
    print(json.dumps(record, sort_keys=True))
    raise SystemExit(0 if result.wasSuccessful() else 1)
