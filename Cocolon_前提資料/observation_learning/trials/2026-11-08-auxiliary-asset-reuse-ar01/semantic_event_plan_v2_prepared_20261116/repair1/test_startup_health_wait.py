"""CPU-only startup boundary tests; no real process, socket or model is used."""
import importlib.util
import io
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch


BASE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


OLD = load('unchanged_a9_startup', BASE.parent / 'event_plan_v2_20261116/event_plan_execution.py')
NEW = load('mechanical_startup_repair1', BASE / 'event_plan_execution.py')
EXPECTED = ['/synthetic/python', '/synthetic/driver.py', '--phase', 'provider']


class Scenario:
    def __init__(self, observations, *, owned=True, exited=False):
        self.observations = iter(observations)
        self.last = observations[-1]
        self.owned = owned
        self.now = 0
        self.trace = []
        self.child = SimpleNamespace(pid=999, poll=lambda: 1 if exited else None)

    def sleep(self, seconds):
        assert 0 < seconds <= 1
        self.trace.append(('sleep', seconds))
        self.now += seconds

    def path(self, value):
        scenario = self

        class FakePath:
            def __init__(self, name):
                self.value = name

            def __truediv__(self, other):
                return FakePath(self.value + '/' + str(other))

            def read_bytes(self):
                assert self.value == '/proc/999/cmdline'
                scenario.last = next(scenario.observations, scenario.last)
                scenario.trace.append(('argv', tuple(scenario.last)))
                return b'\0'.join(x.encode() for x in scenario.last) + (b'\0' if scenario.last else b'')

            def iterdir(self):
                assert self.value == '/proc/999/fd'
                scenario.trace.append(('fds',))
                return [FakePath('/proc/999/fd/3')]

            def readlink(self):
                return SimpleNamespace(name='socket:[123]')

            def read_text(self):
                assert self.value == '/proc/net/tcp'
                scenario.trace.append(('tcp',))
                inode = '123' if scenario.owned else '456'
                return 'header\n0: 0100007F:4658 00000000:0000 0A 0 0 0 0 0 ' + inode + '\n'

        return FakePath(str(value))

    def urlopen(self, url, *, timeout):
        assert url == 'http://127.0.0.1:18008/healthz' and timeout == 2
        assert self.owned and self.last == EXPECTED
        self.trace.append(('health',))
        response = io.StringIO('{"status":"ok"}')
        response.status = 200
        return response

    def run(self, module, seconds=.12):
        with (patch.object(module, 'Path', self.path),
                patch.object(module.time, 'monotonic', lambda: self.now),
                patch.object(module.time, 'sleep', self.sleep),
                patch.object(module.urllib.request, 'urlopen', self.urlopen)):
            module.trial_health_wait(self.child, EXPECTED, seconds)


class StartupBoundaries(unittest.TestCase):
    def test_old_rejects_empty_live_startup_without_any_health_request(self):
        scenario = Scenario([[], EXPECTED])
        with self.assertRaisesRegex(AssertionError, 'candidate_provider_argv_changed'):
            scenario.run(OLD)
        self.assertEqual(scenario.trace, [('argv', ())])

    def test_empty_startup_waits_then_requires_exact_identity_and_owned_socket(self):
        scenario = Scenario([[], [], EXPECTED])
        scenario.run(NEW)
        self.assertEqual(scenario.trace[:4], [('argv', ()), ('sleep', .05), ('argv', ()), ('sleep', .05)])
        self.assertEqual(scenario.trace[4:], [('argv', tuple(EXPECTED)), ('fds',), ('tcp',), ('health',)])
        self.assertLess(scenario.now, .12)

    def test_nonempty_different_argv_still_rejects_immediately(self):
        scenario = Scenario([['/synthetic/unexpected']])
        with self.assertRaisesRegex(AssertionError, 'candidate_provider_argv_changed_nonempty:1:'):
            scenario.run(NEW)
        self.assertEqual(scenario.trace, [('argv', ('/synthetic/unexpected',))])

    def test_empty_then_nonempty_mismatch_never_checks_socket_or_health(self):
        scenario = Scenario([[], ['/synthetic/unexpected']])
        with self.assertRaisesRegex(AssertionError, 'candidate_provider_argv_changed_nonempty'):
            scenario.run(NEW)
        self.assertFalse(any(row[0] in {'fds', 'tcp', 'health'} for row in scenario.trace))

    def test_empty_forever_expires_inside_the_unchanged_deadline(self):
        scenario = Scenario([[]])
        with self.assertRaisesRegex(RuntimeError, 'candidate_provider_health_unavailable'):
            scenario.run(NEW)
        self.assertAlmostEqual(scenario.now, .12)
        self.assertFalse(any(row[0] in {'fds', 'tcp', 'health'} for row in scenario.trace))

    def test_exact_argv_without_owned_listener_cannot_request_health(self):
        scenario = Scenario([EXPECTED], owned=False)
        with self.assertRaisesRegex(RuntimeError, 'candidate_provider_health_unavailable'):
            scenario.run(NEW, seconds=2)
        self.assertFalse(any(row[0] == 'health' for row in scenario.trace))

    def test_exited_child_is_rejected_before_argv_read(self):
        scenario = Scenario([EXPECTED], exited=True)
        with self.assertRaisesRegex(AssertionError, 'candidate_provider_exited'):
            scenario.run(NEW)
        self.assertEqual(scenario.trace, [])


if __name__ == '__main__':
    unittest.main(verbosity=2)
