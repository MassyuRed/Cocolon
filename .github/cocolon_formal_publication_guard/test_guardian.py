#!/usr/bin/env python3
"""Local stdlib tests for the Cocolon publication guardian.

These tests prove fail-closed parser and state-machine behavior.  They are not
the five required GitHub Actions sandbox integration tests.
"""

from __future__ import annotations

import copy
import datetime as dt
import importlib.util
import json
import os
import pathlib
import subprocess
import sys
import tempfile
import unittest
from unittest import mock


MODULE_PATH = pathlib.Path(__file__).with_name("guardian.py")
SPEC = importlib.util.spec_from_file_location("cocolon_guardian", MODULE_PATH)
assert SPEC and SPEC.loader
guardian = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = guardian
SPEC.loader.exec_module(guardian)


class GuardianTestCase(unittest.TestCase):
    maxDiff = None

    @classmethod
    def setUpClass(cls) -> None:
        cls.policy_path = MODULE_PATH.with_name("policy_v1.json")
        cls.policy = guardian.load_policy(cls.policy_path)

    def file_entry(self, *, path: str = "notes/example.txt") -> dict:
        raw = b"hello\n"
        return {
            "path": path,
            "operation": "add",
            "old_mode": None,
            "new_mode": "100644",
            "old_blob_sha1": None,
            "new_blob_sha1": guardian.git_blob_sha1(raw),
            "raw_sha256": guardian.sha256_hex(raw),
            "size_bytes": len(raw),
        }

    def request_dict(self, *, sandbox: bool = False) -> dict:
        files = [
            self.file_entry(
                path=(
                    "Cocolon_前提資料/github_actions_guardian_sandbox/"
                    "suite-01/example.txt"
                    if sandbox
                    else "notes/example.txt"
                )
            )
        ]
        target_ref = (
            "refs/heads/guardian/sandbox/suite-01/normal"
            if sandbox
            else self.policy.default_ref
        )
        expected_old_sha1 = "2" * 40 if sandbox else "1" * 40
        files_sha256 = guardian.files_hash(files)
        request_id = guardian.bound_request_id(
            target_ref,
            expected_old_sha1,
            files_sha256,
        )
        value = {
            "schema_version": guardian.REQUEST_SCHEMA_VERSION,
            "request_id": request_id,
            "request_mode": "publish",
            "repository_id": self.policy.repository_id,
            "repository": self.policy.repository,
            "target_ref": target_ref,
            "workflow_sha1": "1" * 40,
            "expected_old_sha1": expected_old_sha1,
            "staging_ref": f"{self.policy.staging_ref_prefix}{request_id}",
            "staging_head_sha1": "3" * 40,
            "authority": {"name": "test authority", "utf8_lf_sha256": "4" * 64},
            "commit": {
                "subject": "test: guardian request",
                "timestamp_utc": "2026-07-25T00:00:00Z",
            },
            "expires_at_utc": "2026-07-25T01:00:00Z",
            "files": files,
            "files_sha256": files_sha256,
            "sandbox_test": None,
            "request_sha256": "",
        }
        value["request_sha256"] = guardian.request_hash(value)
        return value

    def body(self, value: dict) -> str:
        return (
            guardian.MAGIC
            + "\n"
            + guardian.canonical_json_bytes(value).decode("utf-8")
            + "\n"
        )

    def assertRejected(self, code: str, call, *args, **kwargs) -> None:
        with self.assertRaises(guardian.GuardianReject) as caught:
            call(*args, **kwargs)
        self.assertEqual(code, caught.exception.code)


class CanonicalJsonTests(GuardianTestCase):
    def test_valid_production_request(self) -> None:
        parsed = guardian.parse_request_body(self.body(self.request_dict()), self.policy)
        self.assertTrue(parsed.request_id.startswith("g1-"))
        self.assertEqual("refs/heads/main", parsed.target_ref)

    def test_valid_sandbox_request(self) -> None:
        parsed = guardian.parse_request_body(
            self.body(self.request_dict(sandbox=True)), self.policy
        )
        self.assertTrue(parsed.target_ref.startswith(self.policy.sandbox_target_prefix))

    def test_duplicate_top_level_key_rejected(self) -> None:
        raw = '{"a":1,"a":2}'
        self.assertRejected(
            "REJECTED_DUPLICATE_JSON_KEY", guardian.strict_json_loads, raw
        )

    def test_duplicate_nested_key_rejected(self) -> None:
        raw = '{"a":{"b":1,"b":2}}'
        self.assertRejected(
            "REJECTED_DUPLICATE_JSON_KEY", guardian.strict_json_loads, raw
        )

    def test_float_rejected(self) -> None:
        self.assertRejected("REJECTED_NON_INTEGER_NUMBER", guardian.strict_json_loads, '{"a":1.0}')

    def test_nan_rejected(self) -> None:
        self.assertRejected("REJECTED_NON_FINITE_NUMBER", guardian.strict_json_loads, '{"a":NaN}')

    def test_noncanonical_space_rejected(self) -> None:
        value = self.request_dict()
        body = guardian.MAGIC + "\n" + json.dumps(value, ensure_ascii=False) + "\n"
        self.assertRejected(
            "REJECTED_NON_CANONICAL_JSON",
            guardian.parse_request_body,
            body,
            self.policy,
        )

    def test_crlf_rejected(self) -> None:
        body = self.body(self.request_dict()).replace("\n", "\r\n")
        self.assertRejected("REJECTED_BODY_ENVELOPE", guardian.parse_request_body, body, self.policy)

    def test_missing_final_lf_rejected(self) -> None:
        body = self.body(self.request_dict()).rstrip("\n")
        self.assertRejected("REJECTED_BODY_ENVELOPE", guardian.parse_request_body, body, self.policy)

    def test_extra_field_rejected(self) -> None:
        value = self.request_dict()
        value["unexpected"] = 1
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected("REJECTED_FIELD_SET", guardian.parse_request_body, self.body(value), self.policy)

    def test_hash_preimage_excludes_only_request_hash(self) -> None:
        value = self.request_dict()
        first = value["request_sha256"]
        value["request_sha256"] = "f" * 64
        self.assertEqual(first, guardian.request_hash(value))
        value["authority"]["name"] = "different"
        self.assertNotEqual(first, guardian.request_hash(value))

    def test_request_hash_mismatch_rejected(self) -> None:
        value = self.request_dict()
        value["request_sha256"] = "f" * 64
        self.assertRejected(
            "REJECTED_REQUEST_HASH", guardian.parse_request_body, self.body(value), self.policy
        )

    def test_files_hash_mismatch_rejected(self) -> None:
        value = self.request_dict()
        value["files_sha256"] = "f" * 64
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_FILES_HASH", guardian.parse_request_body, self.body(value), self.policy
        )

    def test_non_nfc_rejected(self) -> None:
        value = self.request_dict()
        value["authority"]["name"] = "e\u0301"
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_NON_NFC_STRING",
            guardian.parse_request_body,
            self.body(value),
            self.policy,
        )

    def test_same_request_id_with_different_manifest_rejected(self) -> None:
        value = self.request_dict(sandbox=True)
        original_request_id = value["request_id"]
        value["files"][0]["path"] = (
            "Cocolon_前提資料/github_actions_guardian_sandbox/"
            "suite-01/different.txt"
        )
        value["files_sha256"] = guardian.files_hash(value["files"])
        value["request_sha256"] = guardian.request_hash(value)
        self.assertEqual(original_request_id, value["request_id"])
        self.assertRejected(
            "REJECTED_REQUEST_ID_BINDING",
            guardian.parse_request_body,
            self.body(value),
            self.policy,
        )

    def test_bound_request_id_covers_target_base_and_manifest(self) -> None:
        value = self.request_dict(sandbox=True)
        original = value["request_id"]
        changed_target = guardian.bound_request_id(
            "refs/heads/guardian/sandbox/suite-01/other",
            value["expected_old_sha1"],
            value["files_sha256"],
        )
        changed_base = guardian.bound_request_id(
            value["target_ref"],
            "3" * 40,
            value["files_sha256"],
        )
        changed_manifest = guardian.bound_request_id(
            value["target_ref"],
            value["expected_old_sha1"],
            "f" * 64,
        )
        self.assertEqual(67, len(original))
        self.assertEqual(
            original,
            guardian.bound_request_id(
                value["target_ref"],
                value["expected_old_sha1"],
                value["files_sha256"],
            ),
        )
        self.assertEqual(
            4,
            len({original, changed_target, changed_base, changed_manifest}),
        )

    def test_bool_not_integer(self) -> None:
        value = self.request_dict()
        value["files"][0]["size_bytes"] = True
        value["files_sha256"] = guardian.files_hash(value["files"])
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_WRONG_INTEGER", guardian.parse_request_body, self.body(value), self.policy
        )


class PathAndPolicyTests(GuardianTestCase):
    def test_unsafe_paths(self) -> None:
        for path in (
            "/absolute",
            "../escape",
            "a/../b",
            "a//b",
            "a\\b",
            "a/\n/b",
            "a/.git/config",
            "trailing.",
            "trailing ",
        ):
            with self.subTest(path=path):
                self.assertRejected("REJECTED_UNSAFE_PATH", guardian.validate_path, path)

    def test_case_collision_rejected(self) -> None:
        self.assertRejected(
            "REJECTED_PATH_COLLISION",
            guardian._validate_collision_free,
            ["Alpha.txt", "alpha.txt"],
        )

    def test_file_directory_collision_rejected(self) -> None:
        self.assertRejected(
            "REJECTED_FILE_DIRECTORY_COLLISION",
            guardian._validate_collision_free,
            ["a", "a/b"],
        )
        self.assertRejected(
            "REJECTED_FILE_DIRECTORY_COLLISION",
            guardian._validate_collision_free,
            ["A", "a/b"],
        )

    def test_builtin_locks_are_case_insensitive(self) -> None:
        self.assertTrue(guardian.is_locked_path(".GITHUB/workflows/x.yml", self.policy))
        self.assertTrue(guardian.is_locked_path(".GITHUB", self.policy))
        self.assertTrue(guardian.is_locked_path(".GITMODULES", self.policy))

    def test_locked_manifest_path_rejected(self) -> None:
        value = self.request_dict()
        value["files"][0]["path"] = ".github/workflows/evil.yml"
        value["files_sha256"] = guardian.files_hash(value["files"])
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_LOCKED_PATH", guardian.parse_request_body, self.body(value), self.policy
        )

    def test_new_executable_rejected(self) -> None:
        value = self.request_dict()
        value["files"][0]["new_mode"] = "100755"
        value["files_sha256"] = guardian.files_hash(value["files"])
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_ADD_CONTRACT", guardian.parse_request_body, self.body(value), self.policy
        )

    def test_production_fault_rejected(self) -> None:
        value = self.request_dict()
        value["sandbox_test"] = {
            "case": "head_drift",
            "drift_ref": None,
            "drift_sha1": None,
        }
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_PRODUCTION_BINDING",
            guardian.parse_request_body,
            self.body(value),
            self.policy,
        )

    def test_policy_is_sandbox_only(self) -> None:
        self.assertEqual("OBSERVE_AND_SANDBOX_ONLY", self.policy.mode)
        self.assertIs(self.policy.production_main_enabled, False)
        self.assertIs(self.policy.sandbox_write_enabled, True)
        self.assertIs(self.policy.sandbox_fault_injection_enabled, True)
        self.assertEqual(
            ((175191163, "MassyuRed", "User"),),
            self.policy.actor_allowlist,
        )


class ActorAndStateTests(GuardianTestCase):
    def event(self) -> dict:
        user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
        return {
            "action": "opened",
            "repository": {
                "id": self.policy.repository_id,
                "full_name": self.policy.repository,
            },
            "issue": {
                "number": 1,
                "title": guardian.TITLE_PREFIX + "actor-observation-01",
                "body": "not parsed in observe-only mode",
                "created_at": "2026-07-25T00:00:00Z",
                "user": dict(user),
            },
            "sender": dict(user),
        }

    def test_observe_only_captures_fixed_identity(self) -> None:
        observe_policy = dataclass_replace(
            self.policy,
            actor_allowlist=(),
            mode="OBSERVE_ONLY",
            sandbox_write_enabled=False,
            sandbox_fault_injection_enabled=False,
        )
        with (
            mock.patch.dict(os.environ, {"GITHUB_SHA": "1" * 40}),
            mock.patch.object(guardian, "verify_trusted_checkout"),
        ):
            result = guardian.evaluate_request(
                self.event(), observe_policy, execution_mode="preflight"
            )
        self.assertEqual("OBSERVE_ONLY_ACTOR_CAPTURE", result["outcome"])
        self.assertEqual(175191163, result["sender_id"])
        self.assertFalse(result["write_attempted"])

    def test_event_repository_mismatch_rejected(self) -> None:
        event = self.event()
        event["repository"]["id"] = 1
        self.assertRejected(
            "REJECTED_EVENT_REPOSITORY",
            guardian.evaluate_request,
            event,
            self.policy,
            execution_mode="preflight",
        )

    def test_sender_issue_user_must_match_when_enabled(self) -> None:
        policy = dataclass_replace(
            self.policy,
            actor_allowlist=((175191163, "MassyuRed", "User"),),
            mode="OBSERVE_AND_SANDBOX_ONLY",
        )
        identity = guardian.event_identity(self.event(), policy)
        identity["issue_user_id"] = 2
        self.assertRejected("REJECTED_ACTOR", guardian.validate_actor, identity, policy)

    def test_production_permit_is_impossible_in_bootstrap(self) -> None:
        request = guardian.parse_request_body(self.body(self.request_dict()), self.policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "1" * 40, request.files)
        self.assertRejected(
            "PRODUCTION_DISABLED", guardian.make_write_permit, request, self.policy, proof
        )

    def test_sandbox_permit_requires_explicit_sandbox_policy(self) -> None:
        request = guardian.parse_request_body(
            self.body(self.request_dict(sandbox=True)), self.policy
        )
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "2" * 40, request.files)
        permit = guardian.make_write_permit(
            request,
            self.policy,
            proof,
            expected_target_class="sandbox",
        )
        self.assertEqual("sandbox", permit.target_class)
        bootstrap_policy = dataclass_replace(
            self.policy,
            actor_allowlist=(),
            mode="OBSERVE_ONLY",
            sandbox_write_enabled=False,
            sandbox_fault_injection_enabled=False,
        )
        self.assertRejected(
            "SANDBOX_DISABLED",
            guardian.make_write_permit,
            request,
            bootstrap_policy,
            proof,
        )

    def test_job_target_class_mismatch_rejected(self) -> None:
        policy = dataclass_replace(
            self.policy,
            mode="PRODUCTION_ACTIVE",
            production_main_enabled=True,
        )
        request = guardian.parse_request_body(self.body(self.request_dict()), policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "1" * 40, request.files)
        self.assertRejected(
            "REJECTED_JOB_TARGET_CLASS",
            guardian.make_write_permit,
            request,
            policy,
            proof,
            expected_target_class="sandbox",
        )

    def test_reconcile_never_creates_permit(self) -> None:
        value = self.request_dict(sandbox=True)
        value["request_mode"] = "reconcile"
        value["request_sha256"] = guardian.request_hash(value)
        request = guardian.parse_request_body(self.body(value), self.policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "2" * 40, request.files)
        self.assertRejected(
            "RECONCILE_NEVER_WRITES", guardian.make_write_permit, request, self.policy, proof
        )

    def test_fixed_receipt_does_not_echo_untrusted_detail(self) -> None:
        result = guardian.sanitized_failure(
            guardian.GuardianReject("REJECTED_INVALID_JSON", "JSON_PARSE", "secret body")
        )
        receipt = guardian.fixed_receipt(result)
        self.assertNotIn("secret body", receipt)


class GitObjectTests(GuardianTestCase):
    def run_git(self, directory: pathlib.Path, *args: str, input_bytes: bytes | None = None) -> str:
        result = subprocess.run(
            ["git", *args],
            cwd=directory,
            input=input_bytes,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
        return result.stdout.decode("ascii").strip()

    def test_deterministic_commit_object(self) -> None:
        value = self.request_dict()
        request = guardian.parse_request_body(self.body(value), self.policy)
        with tempfile.TemporaryDirectory() as directory_name:
            directory = pathlib.Path(directory_name)
            self.run_git(directory, "init", "-q")
            self.run_git(directory, "config", "user.name", "test")
            self.run_git(directory, "config", "user.email", "test@example.invalid")
            (directory / "base.txt").write_text("base\n", encoding="utf-8")
            self.run_git(directory, "add", "base.txt")
            self.run_git(directory, "commit", "-qm", "base")
            parent = self.run_git(directory, "rev-parse", "HEAD")
            tree = self.run_git(directory, "rev-parse", "HEAD^{tree}")
            request = dataclass_replace(request, expected_old_sha1=parent)
            old_cwd = os.getcwd()
            try:
                os.chdir(directory)
                first = guardian.build_direct_child(request, self.policy, tree)
                second = guardian.build_direct_child(request, self.policy, tree)
            finally:
                os.chdir(old_cwd)
            self.assertEqual(first, second)
            parents = self.run_git(directory, "show", "-s", "--format=%P", first)
            self.assertEqual(parent, parents)

    def test_blob_hash_matches_git(self) -> None:
        raw = b"\x00binary\nbytes\xff"
        with tempfile.TemporaryDirectory() as directory_name:
            directory = pathlib.Path(directory_name)
            self.run_git(directory, "init", "-q")
            observed = self.run_git(
                directory, "hash-object", "--stdin", input_bytes=raw
            )
        self.assertEqual(observed, guardian.git_blob_sha1(raw))

    def test_git_commands_never_use_shell(self) -> None:
        completed = subprocess.CompletedProcess(["git"], 0, stdout=b"", stderr=b"")
        with mock.patch.object(guardian.subprocess, "run", return_value=completed) as runner:
            guardian.git(["status"])
        self.assertIs(runner.call_args.kwargs["shell"], False)
        self.assertIsInstance(runner.call_args.args[0], list)

    def test_git_failure_stage_defaults_and_sanitization_are_preserved(self) -> None:
        secret = "transport-secret-sentinel"
        remote_url = "https://credential@example.invalid/repository.git"
        secret_ref = "refs/heads/secret-ref-sentinel"
        secret_local_path = "refs/cocolon-guardian/secret-path-sentinel"
        completed = subprocess.CompletedProcess(
            ["git"],
            128,
            stdout=b"",
            stderr=secret.encode("ascii"),
        )
        cases = (
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    return_value=completed,
                ),
                ["ls-remote", remote_url, "refs/heads/main"],
                {},
                "RESULT_UNKNOWN_STOP",
                "GIT",
            ),
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    side_effect=OSError(secret),
                ),
                ["status"],
                {},
                "RESULT_UNKNOWN_STOP",
                "GIT_EXEC",
            ),
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    side_effect=subprocess.TimeoutExpired(["git"], 1),
                ),
                ["status"],
                {"failure_stage": "FIXED_OPERATION_STAGE"},
                "RESULT_UNKNOWN_STOP",
                "FIXED_OPERATION_STAGE",
            ),
        )
        for patch, args, kwargs, expected_code, expected_stage in cases:
            with self.subTest(expected_stage=expected_stage), patch:
                with self.assertRaises(guardian.GuardianReject) as caught:
                    guardian.git(
                        args,
                        failure_code="RESULT_UNKNOWN_STOP",
                        **kwargs,
                    )
            self.assertEqual(expected_code, caught.exception.code)
            self.assertEqual(expected_stage, caught.exception.stage)
            self.assertIs(caught.exception.write_attempted, False)
            self.assertIs(caught.exception.result_uncertain, False)
            receipt = guardian.fixed_receipt(
                guardian.sanitized_failure(caught.exception)
            )
            self.assertNotIn(secret, receipt)
            self.assertNotIn(remote_url, receipt)
            self.assertIsNone(caught.exception.git_failure)

        target_cases = (
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    return_value=subprocess.CompletedProcess(
                        ["git"],
                        128,
                        stdout=b"",
                        stderr=b"authentication failed: " + secret.encode("ascii"),
                    ),
                ),
                "NONZERO_EXIT",
                "AUTH_OR_ACCESS_REJECTED",
            ),
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    return_value=subprocess.CompletedProcess(
                        ["git"],
                        -9,
                        stdout=b"",
                        stderr=secret.encode("ascii"),
                    ),
                ),
                "SIGNAL_TERMINATED",
                "NOT_EVALUATED",
            ),
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    side_effect=subprocess.TimeoutExpired(
                        ["git"],
                        1,
                        stderr=secret.encode("ascii"),
                    ),
                ),
                "TIMEOUT",
                "NOT_EVALUATED",
            ),
            (
                mock.patch.object(
                    guardian.subprocess,
                    "run",
                    side_effect=OSError(13, secret),
                ),
                "SPAWN_OS_ERROR",
                "NOT_EVALUATED",
            ),
        )
        for patch, expected_kind, expected_hint in target_cases:
            with self.subTest(expected_kind=expected_kind), patch:
                with self.assertRaises(guardian.GuardianReject) as caught:
                    guardian.git(
                        [
                            "fetch",
                            remote_url,
                            f"{secret_ref}:{secret_local_path}",
                        ],
                        failure_code="RESULT_UNKNOWN_STOP",
                        failure_stage=guardian.TARGET_FETCH_FAILURE_STAGE,
                    )
            sanitized = guardian.sanitized_failure(caught.exception)
            self.assertEqual(expected_kind, sanitized["git_failure_kind"])
            self.assertEqual(expected_hint, sanitized["git_stderr_hint"])
            self.assertEqual(
                guardian.TARGET_FETCH_FAILURE_STAGE,
                sanitized["stage"],
            )
            rendered = guardian.canonical_json_bytes(sanitized).decode("utf-8")
            for forbidden in (
                secret,
                remote_url,
                secret_ref,
                secret_local_path,
                "authentication failed",
                "exit=",
                "128",
                "-9",
                "13",
                "TimeoutExpired",
                "OSError",
            ):
                self.assertNotIn(forbidden, rendered)

    def test_git_stderr_classifier_returns_only_fixed_allowlisted_hints(self) -> None:
        cases = (
            (
                b"fatal: couldn't find remote ref refs/heads/missing",
                "REMOTE_REF_MISSING_OR_MOVED",
            ),
            (
                b"fatal: authentication failed for trusted endpoint",
                "AUTH_OR_ACCESS_REJECTED",
            ),
            (
                b"fatal: could not resolve host: trusted.invalid",
                "NAME_RESOLUTION_FAILURE",
            ),
            (
                b"fatal: network is unreachable",
                "NETWORK_CONNECTION_FAILURE",
            ),
            (
                b"fatal: ssl certificate problem",
                "TLS_OR_HOST_IDENTITY_FAILURE",
            ),
            (
                b"fatal: cannot lock ref refs/cocolon-guardian/example",
                "LOCAL_REF_OR_IO_FAILURE",
            ),
            (
                b"fatal: index-pack failed",
                "OBJECT_TRANSFER_OR_INTEGRITY_FAILURE",
            ),
            (
                b"error: rpc failed",
                "REMOTE_SERVICE_OR_PROTOCOL_FAILURE",
            ),
            (b"", "UNCLASSIFIED_OR_AMBIGUOUS"),
            (b"\xff\xfe\x00", "UNCLASSIFIED_OR_AMBIGUOUS"),
            (b"unknown fixed-free failure", "UNCLASSIFIED_OR_AMBIGUOUS"),
            (
                b"couldn't find remote ref and failed to connect",
                "UNCLASSIFIED_OR_AMBIGUOUS",
            ),
            (
                b"x" * 65536 + b" authentication failed",
                "UNCLASSIFIED_OR_AMBIGUOUS",
            ),
        )
        for stderr, expected in cases:
            with self.subTest(expected=expected):
                observed = guardian.classify_git_stderr_hint(stderr)
            self.assertEqual(expected, observed)
            self.assertIn(observed, guardian.GIT_STDERR_HINTS)

        secret = b"token-secret-sentinel"
        observed = guardian.classify_git_stderr_hint(
            b"authentication failed "
            + secret
            + b" https://credential@example.invalid/repository.git "
            + b"refs/heads/private /tmp/private"
        )
        self.assertEqual("AUTH_OR_ACCESS_REJECTED", observed)
        self.assertNotIn(secret.decode("ascii"), observed)

    def test_raw_diff_parser_accepts_exact_add(self) -> None:
        raw = (
            b":000000 100644 "
            + b"0" * 40
            + b" "
            + b"a" * 40
            + b" A\0path.txt\0"
        )
        self.assertEqual(
            [("path.txt", "A", "000000", "100644", "0" * 40, "a" * 40)],
            guardian._parse_raw_diff(raw),
        )

    def test_raw_diff_parser_rejects_delete_and_missing_nul(self) -> None:
        delete = (
            b":100644 000000 "
            + b"a" * 40
            + b" "
            + b"0" * 40
            + b" D\0path.txt\0"
        )
        self.assertRejected("REJECTED_OPERATION", guardian._parse_raw_diff, delete)
        self.assertRejected(
            "REJECTED_GIT_DIFF_FORMAT",
            guardian._parse_raw_diff,
            delete.rstrip(b"\0"),
        )

    def test_postverify_rejects_fetched_ref_drift(self) -> None:
        request = guardian.parse_request_body(self.body(self.request_dict()), self.policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "1" * 40, request.files)
        with (
            mock.patch.object(guardian, "remote_ref_sha", return_value=proof.candidate_sha1),
            mock.patch.object(guardian, "_fetch_exact", return_value="c" * 40),
        ):
            self.assertRejected(
                "RESULT_UNKNOWN_STOP", guardian.postverify, request, proof
            )

    def test_postverify_rejects_final_remote_drift(self) -> None:
        request = guardian.parse_request_body(self.body(self.request_dict()), self.policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "1" * 40, request.files)
        entry = request.files[0]
        with (
            mock.patch.object(
                guardian,
                "remote_ref_sha",
                side_effect=[proof.candidate_sha1, "c" * 40],
            ),
            mock.patch.object(
                guardian, "_fetch_exact", return_value=proof.candidate_sha1
            ),
            mock.patch.object(guardian, "verify_commit"),
            mock.patch.object(
                guardian,
                "_tree_path_map",
                return_value={
                    entry.path: (entry.new_mode, "blob", entry.new_blob_sha1)
                },
            ),
            mock.patch.object(guardian, "git", return_value=b"hello\n"),
        ):
            self.assertRejected(
                "RESULT_UNKNOWN_STOP", guardian.postverify, request, proof
            )

    def test_postverify_failure_after_write_preserves_attempt_state(self) -> None:
        request = guardian.parse_request_body(self.body(self.request_dict()), self.policy)
        proof = guardian.CandidateProof("a" * 40, "b" * 40, "1" * 40, request.files)
        with mock.patch.object(
            guardian,
            "postverify",
            side_effect=guardian.GuardianReject("RESULT_UNKNOWN_STOP", "POSTVERIFY"),
        ):
            with self.assertRaises(guardian.GuardianReject) as caught:
                guardian.postverify_after_write(request, proof)
        self.assertIs(caught.exception.write_attempted, True)
        self.assertIs(caught.exception.result_uncertain, True)


class CandidateFailureLocalizationTests(GuardianTestCase):
    def event_and_request(self) -> tuple[dict, guardian.PublicationRequest]:
        value = self.request_dict(sandbox=True)
        user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
        event = {
            "action": "opened",
            "repository": {
                "id": self.policy.repository_id,
                "full_name": self.policy.repository,
            },
            "issue": {
                "number": 10,
                "title": guardian.TITLE_PREFIX + value["request_id"],
                "body": self.body(value),
                "created_at": "2026-07-25T00:00:00Z",
                "user": dict(user),
            },
            "sender": dict(user),
        }
        request = guardian.parse_request_body(
            event["issue"]["body"],
            self.policy,
            issue_created_at=event["issue"]["created_at"],
        )
        return event, request

    def assert_candidate_transport_failure(
        self,
        *,
        failed_operation: str,
        expected_stage: str,
        expected_operations: list[str],
    ) -> None:
        event, request = self.event_and_request()
        secret = "candidate-transport-secret-sentinel"

        for execution_mode in ("preflight", "reconcile"):
            observed_operations: list[str] = []

            def run(command, **_kwargs):
                if "ls-remote" in command:
                    ref = command[-1]
                    if ref == request.staging_ref:
                        operation = "staging-ref-observation"
                        sha1 = request.staging_head_sha1
                    else:
                        self.assertEqual(request.target_ref, ref)
                        operation = "target-ref-observation"
                        sha1 = request.expected_old_sha1
                    stdout = f"{sha1}\t{ref}\n".encode("ascii")
                elif "fetch" in command:
                    fetched_ref = command[-1].split(":", 1)[0]
                    if fetched_ref == request.staging_ref:
                        operation = "staging-ref-fetch"
                    else:
                        self.assertEqual(request.target_ref, fetched_ref)
                        operation = "target-ref-fetch"
                    stdout = b""
                elif "rev-parse" in command:
                    local_ref = command[-1]
                    if local_ref.startswith("refs/cocolon-guardian/staging-"):
                        operation = "staging-ref-rev-parse"
                        stdout = f"{request.staging_head_sha1}\n".encode("ascii")
                    else:
                        self.assertTrue(
                            local_ref.startswith("refs/cocolon-guardian/target-")
                        )
                        operation = "target-ref-rev-parse"
                        stdout = f"{request.expected_old_sha1}\n".encode("ascii")
                else:
                    self.fail(
                        f"unexpected git command before localized failure: {command!r}"
                    )
                observed_operations.append(operation)
                return subprocess.CompletedProcess(
                    command,
                    128 if operation == failed_operation else 0,
                    stdout=b"" if operation == failed_operation else stdout,
                    stderr=secret.encode("ascii"),
                )

            with (
                self.subTest(execution_mode=execution_mode),
                mock.patch.dict(
                    os.environ,
                    {"GITHUB_SHA": request.workflow_sha1},
                ),
                mock.patch.object(guardian, "verify_trusted_checkout"),
                mock.patch.object(guardian.subprocess, "run", side_effect=run),
                mock.patch.object(guardian, "make_write_permit") as permit,
                mock.patch.object(guardian, "push_exact_lease") as push,
                mock.patch.object(
                    guardian,
                    "postverify_after_write",
                ) as postverify,
            ):
                with self.assertRaises(guardian.GuardianReject) as caught:
                    guardian.evaluate_request(
                        event,
                        self.policy,
                        execution_mode=execution_mode,
                    )
            self.assertEqual("RESULT_UNKNOWN_STOP", caught.exception.code)
            self.assertEqual(expected_stage, caught.exception.stage)
            self.assertIs(caught.exception.write_attempted, False)
            self.assertIs(caught.exception.result_uncertain, False)
            self.assertEqual(expected_operations, observed_operations)
            permit.assert_not_called()
            push.assert_not_called()
            postverify.assert_not_called()
            sanitized = guardian.sanitized_failure(caught.exception)
            self.assertIs(sanitized["postverified"], False)
            if expected_stage == guardian.TARGET_FETCH_FAILURE_STAGE:
                self.assertEqual(
                    "NONZERO_EXIT",
                    sanitized["git_failure_kind"],
                )
                self.assertEqual(
                    "UNCLASSIFIED_OR_AMBIGUOUS",
                    sanitized["git_stderr_hint"],
                )
            else:
                self.assertNotIn("git_failure_kind", sanitized)
                self.assertNotIn("git_stderr_hint", sanitized)
            receipt = guardian.fixed_receipt(sanitized)
            self.assertNotIn(secret, receipt)

    def test_candidate_staging_ref_observation_failure_is_localized(self) -> None:
        self.assert_candidate_transport_failure(
            failed_operation="staging-ref-observation",
            expected_stage="CANDIDATE_STAGING_REF_OBSERVATION",
            expected_operations=["staging-ref-observation"],
        )

    def test_candidate_staging_ref_fetch_failure_is_localized(self) -> None:
        self.assert_candidate_transport_failure(
            failed_operation="staging-ref-fetch",
            expected_stage="CANDIDATE_STAGING_REF_FETCH",
            expected_operations=[
                "staging-ref-observation",
                "staging-ref-fetch",
            ],
        )

    def test_candidate_target_ref_observation_failure_is_localized(self) -> None:
        self.assert_candidate_transport_failure(
            failed_operation="target-ref-observation",
            expected_stage="CANDIDATE_TARGET_REF_OBSERVATION",
            expected_operations=[
                "staging-ref-observation",
                "staging-ref-fetch",
                "staging-ref-rev-parse",
                "target-ref-observation",
            ],
        )

    def test_candidate_target_ref_fetch_failure_is_localized(self) -> None:
        self.assert_candidate_transport_failure(
            failed_operation="target-ref-fetch",
            expected_stage="CANDIDATE_TARGET_REF_FETCH",
            expected_operations=[
                "staging-ref-observation",
                "staging-ref-fetch",
                "staging-ref-rev-parse",
                "target-ref-observation",
                "target-ref-fetch",
            ],
        )

        secret = "main-publish-output-secret-sentinel"
        failure = guardian.GuardianReject(
            "RESULT_UNKNOWN_STOP",
            guardian.TARGET_FETCH_FAILURE_STAGE,
            f"exit=128 {secret}",
            git_failure=guardian.GitFailureDiagnostic(
                "NONZERO_EXIT",
                "UNCLASSIFIED_OR_AMBIGUOUS",
            ),
        )
        with tempfile.TemporaryDirectory() as directory:
            output_path = pathlib.Path(directory) / "github-output"
            with (
                mock.patch.dict(
                    os.environ,
                    {"GITHUB_OUTPUT": str(output_path)},
                    clear=True,
                ),
                mock.patch.object(
                    guardian,
                    "run_guardian",
                    side_effect=failure,
                ),
                mock.patch("builtins.print") as printer,
            ):
                exit_code = guardian.main(
                    [
                        "publish",
                        "--event-path",
                        "/tmp/guardian-test-event.json",
                        "--expected-target-class",
                        "sandbox",
                    ]
                )
            rendered = output_path.read_text(encoding="utf-8")
            printed = printer.call_args.args[0]
        self.assertEqual(1, exit_code)
        self.assertEqual(
            1,
            rendered.count(
                f"failure_stage={guardian.TARGET_FETCH_FAILURE_STAGE}\n"
            ),
        )
        self.assertEqual(
            1,
            rendered.count("git_failure_kind=NONZERO_EXIT\n"),
        )
        self.assertEqual(
            1,
            rendered.count(
                "git_stderr_hint=UNCLASSIFIED_OR_AMBIGUOUS\n"
            ),
        )
        self.assertEqual(1, rendered.count("result_uncertain=false\n"))
        for forbidden in (secret, "exit=", "128"):
            self.assertNotIn(forbidden, rendered)
            self.assertNotIn(forbidden, printed)


class ReconcileAndReportTests(GuardianTestCase):
    def enabled_policy(self):
        return dataclass_replace(
            self.policy,
            actor_allowlist=((175191163, "MassyuRed", "User"),),
            mode="PRODUCTION_ACTIVE",
            production_main_enabled=True,
        )

    def event_and_request(self):
        value = self.request_dict()
        user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
        event = {
            "action": "opened",
            "repository": {
                "id": self.policy.repository_id,
                "full_name": self.policy.repository,
            },
            "issue": {
                "number": 7,
                "title": guardian.TITLE_PREFIX + value["request_id"],
                "body": self.body(value),
                "created_at": "2026-07-25T00:00:00Z",
                "user": dict(user),
            },
            "sender": dict(user),
        }
        request = guardian.parse_request_body(
            event["issue"]["body"],
            self.enabled_policy(),
            issue_created_at=event["issue"]["created_at"],
        )
        proof = guardian.CandidateProof(
            "a" * 40,
            "b" * 40,
            request.expected_old_sha1,
            request.files,
        )
        return event, request, proof

    def evaluate_reconcile(self, observed: str):
        event, request, proof = self.event_and_request()
        with (
            mock.patch.dict(os.environ, {"GITHUB_SHA": request.workflow_sha1}),
            mock.patch.object(guardian, "verify_trusted_checkout"),
            mock.patch.object(guardian, "inspect_candidate", return_value=proof),
            mock.patch.object(guardian, "remote_ref_sha", return_value=observed),
            mock.patch.object(guardian, "postverify"),
            mock.patch.object(guardian, "make_write_permit") as permit,
        ):
            result = guardian.evaluate_request(
                event,
                self.enabled_policy(),
                execution_mode="reconcile",
            )
        permit.assert_not_called()
        return result, proof, request

    def test_reconcile_original_publish_request_h0(self) -> None:
        _, request, _ = self.event_and_request()
        result, _, _ = self.evaluate_reconcile(request.expected_old_sha1)
        self.assertEqual("NOT_APPLIED_CONFIRMED_STOP", result["outcome"])
        self.assertEqual("unknown", result["write_attempted"])
        self.assertEqual(request.expected_old_sha1, result["observed_before"])
        self.assertEqual(request.expected_old_sha1, result["observed_after"])

    def test_reconcile_original_publish_request_candidate(self) -> None:
        result, proof, _ = self.evaluate_reconcile("a" * 40)
        self.assertEqual(proof.candidate_sha1, "a" * 40)
        self.assertEqual(
            "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT", result["outcome"]
        )
        self.assertEqual(proof.candidate_sha1, result["observed_before"])
        self.assertEqual(proof.candidate_sha1, result["observed_after"])

    def test_reconcile_original_publish_request_other(self) -> None:
        result, _, _ = self.evaluate_reconcile("c" * 40)
        self.assertEqual("DRIFT_AFTER_ATTEMPT_STOP", result["outcome"])
        self.assertEqual("c" * 40, result["observed_before"])
        self.assertEqual("c" * 40, result["observed_after"])

    def test_report_missing_token_fails(self) -> None:
        event, _, _ = self.event_and_request()
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertRejected(
                "REPORT_FAILED",
                guardian.report_result,
                event,
                {"outcome": "NOT_APPLIED_CONFIRMED_STOP"},
            )

    def test_result_unknown_stop_is_reported_without_issue_close(self) -> None:
        event, _, _ = self.event_and_request()
        secret = "report-token-secret-sentinel"
        with (
            mock.patch.dict(
                os.environ,
                {
                    "GH_TOKEN": secret,
                    "GITHUB_REPOSITORY": self.policy.repository,
                },
            ),
            mock.patch.object(
                guardian,
                "observe_production_main",
                side_effect=["a" * 40, "a" * 40],
            ),
            mock.patch.object(
                guardian,
                "run_guardian",
                side_effect=guardian.GuardianReject(
                    "RESULT_UNKNOWN_STOP",
                    "CANDIDATE_TARGET_REF_FETCH",
                ),
            ),
            mock.patch.object(guardian, "load_event", return_value=event),
            mock.patch.object(guardian, "_github_api") as github_api,
            mock.patch.object(guardian, "_write_outputs") as write_outputs,
        ):
            exit_code = guardian.main(
                [
                    "report",
                    "--event-path",
                    "/tmp/guardian-test-event.json",
                    "--policy-path",
                    str(self.policy_path),
                ]
            )
        self.assertEqual(1, exit_code)
        github_api.assert_called_once()
        method, url, token, payload = github_api.call_args.args
        self.assertEqual("POST", method)
        self.assertTrue(url.endswith("/comments"))
        self.assertEqual(secret, token)
        self.assertIn('"outcome":"RESULT_UNKNOWN_STOP"', payload["body"])
        self.assertIn(
            '"stage":"CANDIDATE_TARGET_REF_FETCH"',
            payload["body"],
        )
        self.assertNotIn(secret, payload["body"])
        reported = write_outputs.call_args.args[0]
        self.assertEqual("RESULT_UNKNOWN_STOP", reported["outcome"])
        self.assertEqual("unknown", reported["write_attempted"])

    def test_receipt_contains_exact_paths_but_not_failure_detail(self) -> None:
        value = self.request_dict()
        receipt = guardian.fixed_receipt(
            {
                "outcome": "APPLIED_AND_POSTVERIFIED",
                "paths": [
                    {
                        "path": value["files"][0]["path"],
                        "raw_sha256": value["files"][0]["raw_sha256"],
                        "blob_sha1": value["files"][0]["new_blob_sha1"],
                    }
                ],
                "production_main_observed_before": "a" * 40,
                "production_main_observed_after": "b" * 40,
                "write_attempted": True,
                "postverified": True,
            }
        )
        self.assertIn(value["files"][0]["path"], receipt)
        self.assertIn(value["files"][0]["raw_sha256"], receipt)
        self.assertIn(f'"production_main_observed_before":"{"a" * 40}"', receipt)
        self.assertIn(f'"production_main_observed_after":"{"b" * 40}"', receipt)

    def test_report_preserves_verified_normal_publish_outcome(self) -> None:
        result = {
            "outcome": "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "b" * 40,
            "observed_after": "b" * 40,
            "write_attempted": "unknown",
            "postverified": True,
        }
        env = {
            "GUARDIAN_SANDBOX_JOB_RESULT": "success",
            "GUARDIAN_SANDBOX_OUTCOME": "APPLIED_AND_POSTVERIFIED",
            "GUARDIAN_SANDBOX_REQUEST_SHA256": "a" * 64,
            "GUARDIAN_SANDBOX_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_AFTER": "b" * 40,
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "true",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "true",
        }
        with mock.patch.dict(os.environ, env, clear=True):
            bound = guardian.bind_trusted_publish_result(result)
        self.assertEqual("APPLIED_AND_POSTVERIFIED", bound["outcome"])
        self.assertIs(bound["write_attempted"], True)
        self.assertEqual("d" * 40, bound["observed_before"])
        self.assertEqual("b" * 40, bound["observed_after"])

    def test_report_preserves_verified_duplicate_outcome(self) -> None:
        result = {
            "outcome": "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "b" * 40,
            "observed_after": "b" * 40,
            "write_attempted": "unknown",
            "postverified": True,
        }
        for prefix in ("GUARDIAN_PREFLIGHT", "GUARDIAN_SANDBOX"):
            env = {
                f"{prefix}_JOB_RESULT": "success",
                f"{prefix}_OUTCOME": "ALREADY_APPLIED_POSTVERIFIED",
                f"{prefix}_REQUEST_SHA256": "a" * 64,
                f"{prefix}_CANDIDATE_SHA1": "b" * 40,
                f"{prefix}_OBSERVED_BEFORE": "b" * 40,
                f"{prefix}_OBSERVED_AFTER": "b" * 40,
                f"{prefix}_WRITE_ATTEMPTED": "false",
                f"{prefix}_POSTVERIFIED": "true",
            }
            with (
                self.subTest(prefix=prefix),
                mock.patch.dict(os.environ, env, clear=True),
            ):
                bound = guardian.bind_trusted_publish_result(result)
            self.assertEqual("ALREADY_APPLIED_POSTVERIFIED", bound["outcome"])
            self.assertIs(bound["write_attempted"], False)
            self.assertEqual("b" * 40, bound["observed_before"])
            self.assertEqual("b" * 40, bound["observed_after"])

    def test_report_preserves_verified_head_drift(self) -> None:
        claims = (
            ("GUARDIAN_PREFLIGHT", "false", False),
            ("GUARDIAN_SANDBOX", "false", False),
            ("GUARDIAN_SANDBOX", "true", True),
        )
        for prefix, attempted_text, attempted_bool in claims:
            result = {
                "outcome": "DRIFT_AFTER_ATTEMPT_STOP",
                "target_class": "sandbox",
                "expected_old_sha1": "d" * 40,
                "request_sha256": "a" * 64,
                "candidate_sha1": "b" * 40,
                "observed_before": "c" * 40,
                "observed_after": "c" * 40,
                "write_attempted": "unknown",
                "postverified": False,
            }
            env = {
                f"{prefix}_JOB_RESULT": "success",
                f"{prefix}_OUTCOME": "REJECTED_HEAD_DRIFT",
                f"{prefix}_REQUEST_SHA256": "a" * 64,
                f"{prefix}_CANDIDATE_SHA1": "b" * 40,
                f"{prefix}_OBSERVED_BEFORE": (
                    "d" * 40 if attempted_text == "true" else "c" * 40
                ),
                f"{prefix}_OBSERVED_AFTER": "c" * 40,
                f"{prefix}_WRITE_ATTEMPTED": attempted_text,
                f"{prefix}_POSTVERIFIED": "false",
            }
            with (
                self.subTest(prefix=prefix, attempted=attempted_text),
                mock.patch.dict(os.environ, env, clear=True),
            ):
                bound = guardian.bind_trusted_publish_result(result)
            self.assertEqual("REJECTED_HEAD_DRIFT", bound["outcome"])
            self.assertIs(bound["write_attempted"], attempted_bool)
            self.assertEqual(
                "d" * 40 if attempted_text == "true" else "c" * 40,
                bound["observed_before"],
            )
            self.assertEqual("c" * 40, bound["observed_after"])

    def test_report_does_not_trust_unbound_publish_outcome(self) -> None:
        result = {
            "outcome": "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "b" * 40,
            "observed_after": "b" * 40,
            "write_attempted": "unknown",
            "postverified": True,
        }
        env = {
            "GUARDIAN_SANDBOX_JOB_RESULT": "success",
            "GUARDIAN_SANDBOX_OUTCOME": "APPLIED_AND_POSTVERIFIED",
            "GUARDIAN_SANDBOX_REQUEST_SHA256": "c" * 64,
            "GUARDIAN_SANDBOX_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_AFTER": "b" * 40,
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "true",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "true",
        }
        with mock.patch.dict(os.environ, env, clear=True):
            bound = guardian.bind_trusted_publish_result(result)
        self.assertEqual(
            "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT", bound["outcome"]
        )

    def test_report_does_not_trust_failed_job_claim(self) -> None:
        result = {
            "outcome": "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "b" * 40,
            "observed_after": "b" * 40,
            "write_attempted": "unknown",
            "postverified": True,
        }
        env = {
            "GUARDIAN_SANDBOX_JOB_RESULT": "failure",
            "GUARDIAN_SANDBOX_OUTCOME": "APPLIED_AND_POSTVERIFIED",
            "GUARDIAN_SANDBOX_REQUEST_SHA256": "a" * 64,
            "GUARDIAN_SANDBOX_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_SANDBOX_OBSERVED_AFTER": "b" * 40,
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "true",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "true",
        }
        with mock.patch.dict(os.environ, env, clear=True):
            bound = guardian.bind_trusted_publish_result(result)
        self.assertEqual(
            "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT", bound["outcome"]
        )

    def test_report_does_not_trust_inconsistent_observations(self) -> None:
        cases = (
            ("c" * 40, "b" * 40, "b" * 40, "b" * 40),
            ("d" * 40, "c" * 40, "b" * 40, "b" * 40),
            ("d" * 40, "b" * 40, "b" * 40, "c" * 40),
        )
        for claim_before, claim_after, remote_before, remote_after in cases:
            result = {
                "outcome": "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
                "target_class": "sandbox",
                "expected_old_sha1": "d" * 40,
                "request_sha256": "a" * 64,
                "candidate_sha1": "b" * 40,
                "observed_before": remote_before,
                "observed_after": remote_after,
                "write_attempted": "unknown",
                "postverified": True,
            }
            env = {
                "GUARDIAN_SANDBOX_JOB_RESULT": "success",
                "GUARDIAN_SANDBOX_OUTCOME": "APPLIED_AND_POSTVERIFIED",
                "GUARDIAN_SANDBOX_REQUEST_SHA256": "a" * 64,
                "GUARDIAN_SANDBOX_CANDIDATE_SHA1": "b" * 40,
                "GUARDIAN_SANDBOX_OBSERVED_BEFORE": claim_before,
                "GUARDIAN_SANDBOX_OBSERVED_AFTER": claim_after,
                "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "true",
                "GUARDIAN_SANDBOX_POSTVERIFIED": "true",
            }
            with (
                self.subTest(
                    claim_before=claim_before,
                    claim_after=claim_after,
                    remote_after=remote_after,
                ),
                mock.patch.dict(os.environ, env, clear=True),
            ):
                bound = guardian.bind_trusted_publish_result(result)
            self.assertEqual(
                "APPLIED_CONFIRMED_AFTER_AMBIGUOUS_RESULT",
                bound["outcome"],
            )
            self.assertEqual(remote_before, bound["observed_before"])
            self.assertEqual(remote_after, bound["observed_after"])

    def test_report_does_not_trust_invalid_head_drift_relation(self) -> None:
        cases = (
            ("GUARDIAN_SANDBOX", "d" * 40, "false"),
            ("GUARDIAN_SANDBOX", "b" * 40, "false"),
            ("GUARDIAN_PREFLIGHT", "c" * 40, "true"),
        )
        for prefix, remote_sha1, attempted in cases:
            result = {
                "outcome": "DRIFT_AFTER_ATTEMPT_STOP",
                "target_class": "sandbox",
                "expected_old_sha1": "d" * 40,
                "request_sha256": "a" * 64,
                "candidate_sha1": "b" * 40,
                "observed_before": remote_sha1,
                "observed_after": remote_sha1,
                "write_attempted": "unknown",
                "postverified": False,
            }
            env = {
                f"{prefix}_JOB_RESULT": "success",
                f"{prefix}_OUTCOME": "REJECTED_HEAD_DRIFT",
                f"{prefix}_REQUEST_SHA256": "a" * 64,
                f"{prefix}_CANDIDATE_SHA1": "b" * 40,
                f"{prefix}_OBSERVED_BEFORE": (
                    "d" * 40 if attempted == "true" else remote_sha1
                ),
                f"{prefix}_OBSERVED_AFTER": remote_sha1,
                f"{prefix}_WRITE_ATTEMPTED": attempted,
                f"{prefix}_POSTVERIFIED": "false",
            }
            with (
                self.subTest(
                    prefix=prefix,
                    remote_sha1=remote_sha1,
                    attempted=attempted,
                ),
                mock.patch.dict(os.environ, env, clear=True),
            ):
                bound = guardian.bind_trusted_publish_result(result)
            self.assertEqual("DRIFT_AFTER_ATTEMPT_STOP", bound["outcome"])
            self.assertEqual("unknown", bound["write_attempted"])

    def test_report_binds_fixed_target_fetch_failure_diagnostic(self) -> None:
        result = {
            "outcome": "NOT_APPLIED_CONFIRMED_STOP",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "d" * 40,
            "observed_after": "d" * 40,
            "write_attempted": "unknown",
            "postverified": False,
        }
        env = {
            "GUARDIAN_PREFLIGHT_JOB_RESULT": "success",
            "GUARDIAN_PREFLIGHT_OUTCOME": "PREFLIGHT_PASSED",
            "GUARDIAN_PREFLIGHT_REQUEST_SHA256": "a" * 64,
            "GUARDIAN_PREFLIGHT_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_PREFLIGHT_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_PREFLIGHT_WRITE_ATTEMPTED": "false",
            "GUARDIAN_PREFLIGHT_POSTVERIFIED": "false",
            "GUARDIAN_SANDBOX_JOB_RESULT": "failure",
            "GUARDIAN_SANDBOX_OUTCOME": "RESULT_UNKNOWN_STOP",
            "GUARDIAN_SANDBOX_FAILURE_STAGE": (
                guardian.TARGET_FETCH_FAILURE_STAGE
            ),
            "GUARDIAN_SANDBOX_GIT_FAILURE_KIND": "NONZERO_EXIT",
            "GUARDIAN_SANDBOX_GIT_STDERR_HINT": (
                "UNCLASSIFIED_OR_AMBIGUOUS"
            ),
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "false",
            "GUARDIAN_SANDBOX_RESULT_UNCERTAIN": "false",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "false",
        }
        secret = "job-claim-secret-sentinel"
        env["GUARDIAN_SANDBOX_RAW_STDERR"] = secret
        with mock.patch.dict(os.environ, env, clear=True):
            claim = guardian._job_claim("GUARDIAN_SANDBOX")
            bound = guardian.bind_trusted_publish_failure_diagnostic(result)
        self.assertEqual(
            {
                "job_result",
                "outcome",
                "request_sha256",
                "candidate_sha1",
                "write_attempted",
                "postverified",
                "observed_before",
                "observed_after",
                "failure_stage",
                "git_failure_kind",
                "git_stderr_hint",
                "result_uncertain",
            },
            set(claim),
        )
        self.assertNotIn(
            secret,
            guardian.canonical_json_bytes(claim).decode("utf-8"),
        )
        self.assertEqual(result, {k: v for k, v in bound.items() if k != "publish_failure"})
        self.assertEqual(
            {
                "job": "publish-sandbox",
                "outcome": "RESULT_UNKNOWN_STOP",
                "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
                "git_failure_kind": "NONZERO_EXIT",
                "git_stderr_hint": "UNCLASSIFIED_OR_AMBIGUOUS",
                "write_attempted": False,
                "result_uncertain": False,
                "postverified": False,
            },
            bound["publish_failure"],
        )
        receipt = guardian.fixed_receipt(bound)
        self.assertIn('"publish_failure":{', receipt)
        self.assertIn('"git_failure_kind":"NONZERO_EXIT"', receipt)
        self.assertIn(
            '"git_stderr_hint":"UNCLASSIFIED_OR_AMBIGUOUS"',
            receipt,
        )
        self.assertEqual("NOT_APPLIED_CONFIRMED_STOP", bound["outcome"])
        self.assertEqual("unknown", bound["write_attempted"])
        self.assertIs(bound["postverified"], False)

    def test_report_rejects_unbound_or_malformed_failure_diagnostic(self) -> None:
        base_result = {
            "outcome": "NOT_APPLIED_CONFIRMED_STOP",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "d" * 40,
            "observed_after": "d" * 40,
            "write_attempted": "unknown",
            "postverified": False,
        }
        base_env = {
            "GUARDIAN_PREFLIGHT_JOB_RESULT": "success",
            "GUARDIAN_PREFLIGHT_OUTCOME": "PREFLIGHT_PASSED",
            "GUARDIAN_PREFLIGHT_REQUEST_SHA256": "a" * 64,
            "GUARDIAN_PREFLIGHT_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_PREFLIGHT_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_PREFLIGHT_WRITE_ATTEMPTED": "false",
            "GUARDIAN_PREFLIGHT_POSTVERIFIED": "false",
            "GUARDIAN_SANDBOX_JOB_RESULT": "failure",
            "GUARDIAN_SANDBOX_OUTCOME": "RESULT_UNKNOWN_STOP",
            "GUARDIAN_SANDBOX_FAILURE_STAGE": (
                guardian.TARGET_FETCH_FAILURE_STAGE
            ),
            "GUARDIAN_SANDBOX_GIT_FAILURE_KIND": "NONZERO_EXIT",
            "GUARDIAN_SANDBOX_GIT_STDERR_HINT": (
                "UNCLASSIFIED_OR_AMBIGUOUS"
            ),
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "false",
            "GUARDIAN_SANDBOX_RESULT_UNCERTAIN": "false",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "false",
        }
        missing = object()
        cases = (
            ("report target", {"target_class": "production"}, {}),
            ("report outcome", {"outcome": "RESULT_UNKNOWN_STOP"}, {}),
            ("report expected", {"expected_old_sha1": "z" * 40}, {}),
            ("report before", {"observed_before": "c" * 40}, {}),
            ("report after", {"observed_after": "c" * 40}, {}),
            ("report write", {"write_attempted": False}, {}),
            ("report postverify", {"postverified": True}, {}),
            ("report request", {"request_sha256": "A" * 64}, {}),
            ("report candidate", {"candidate_sha1": "z" * 40}, {}),
            (
                "preflight result",
                {},
                {"GUARDIAN_PREFLIGHT_JOB_RESULT": "failure"},
            ),
            (
                "preflight outcome",
                {},
                {"GUARDIAN_PREFLIGHT_OUTCOME": "RESULT_UNKNOWN_STOP"},
            ),
            (
                "preflight request",
                {},
                {"GUARDIAN_PREFLIGHT_REQUEST_SHA256": "c" * 64},
            ),
            (
                "preflight candidate",
                {},
                {"GUARDIAN_PREFLIGHT_CANDIDATE_SHA1": "c" * 40},
            ),
            (
                "preflight write",
                {},
                {"GUARDIAN_PREFLIGHT_WRITE_ATTEMPTED": "true"},
            ),
            (
                "preflight postverify",
                {},
                {"GUARDIAN_PREFLIGHT_POSTVERIFIED": "true"},
            ),
            (
                "preflight observed",
                {},
                {"GUARDIAN_PREFLIGHT_OBSERVED_BEFORE": "c" * 40},
            ),
            (
                "publish result",
                {},
                {"GUARDIAN_SANDBOX_JOB_RESULT": "success"},
            ),
            (
                "publish outcome",
                {},
                {"GUARDIAN_SANDBOX_OUTCOME": "PREFLIGHT_PASSED"},
            ),
            (
                "publish stage",
                {},
                {"GUARDIAN_SANDBOX_FAILURE_STAGE": "CANDIDATE"},
            ),
            (
                "publish kind",
                {},
                {"GUARDIAN_SANDBOX_GIT_FAILURE_KIND": "UNKNOWN_KIND"},
            ),
            (
                "publish hint",
                {},
                {"GUARDIAN_SANDBOX_GIT_STDERR_HINT": "raw secret"},
            ),
            (
                "publish nonzero unevaluated mismatch",
                {},
                {"GUARDIAN_SANDBOX_GIT_STDERR_HINT": "NOT_EVALUATED"},
            ),
            (
                "publish timeout classified mismatch",
                {},
                {
                    "GUARDIAN_SANDBOX_GIT_FAILURE_KIND": "TIMEOUT",
                    "GUARDIAN_SANDBOX_GIT_STDERR_HINT": (
                        "NAME_RESOLUTION_FAILURE"
                    ),
                },
            ),
            (
                "publish write",
                {},
                {"GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "true"},
            ),
            (
                "publish uncertain",
                {},
                {"GUARDIAN_SANDBOX_RESULT_UNCERTAIN": "true"},
            ),
            (
                "publish postverify",
                {},
                {"GUARDIAN_SANDBOX_POSTVERIFIED": "true"},
            ),
            (
                "missing publish hint",
                {},
                {"GUARDIAN_SANDBOX_GIT_STDERR_HINT": missing},
            ),
        )
        for label, result_updates, env_updates in cases:
            result = copy.deepcopy(base_result)
            result.update(result_updates)
            env = dict(base_env)
            for key, value in env_updates.items():
                if value is missing:
                    env.pop(key, None)
                else:
                    env[key] = value
            with (
                self.subTest(label=label),
                mock.patch.dict(os.environ, env, clear=True),
            ):
                bound = guardian.bind_trusted_publish_failure_diagnostic(result)
                self.assertNotIn("publish_failure", bound)

        valid_failure = {
            "job": "publish-sandbox",
            "outcome": "RESULT_UNKNOWN_STOP",
            "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
            "git_failure_kind": "NONZERO_EXIT",
            "git_stderr_hint": "UNCLASSIFIED_OR_AMBIGUOUS",
            "write_attempted": False,
            "result_uncertain": False,
            "postverified": False,
        }
        preexisting = copy.deepcopy(base_result)
        preexisting["publish_failure"] = dict(valid_failure)
        mismatched_env = dict(base_env)
        mismatched_env["GUARDIAN_SANDBOX_JOB_RESULT"] = "success"
        with mock.patch.dict(os.environ, mismatched_env, clear=True):
            rebound = guardian.bind_trusted_publish_failure_diagnostic(
                preexisting
            )
        self.assertNotIn("publish_failure", rebound)

        secret = "raw-secret-sentinel"
        malformed = []
        extra = dict(valid_failure)
        extra["raw_stderr"] = secret
        malformed.append(extra)
        for key, value in (
            ("job", secret),
            ("outcome", secret),
            ("stage", secret),
            ("git_failure_kind", secret),
            ("git_failure_kind", ["NONZERO_EXIT"]),
            ("git_stderr_hint", secret),
            ("git_stderr_hint", ["NOT_EVALUATED"]),
            ("git_stderr_hint", "NOT_EVALUATED"),
            ("write_attempted", 0),
            ("result_uncertain", None),
            ("postverified", True),
        ):
            candidate = dict(valid_failure)
            candidate[key] = value
            malformed.append(candidate)
        malformed.append([valid_failure])
        for candidate in malformed:
            with self.subTest(candidate=candidate):
                receipt = guardian.fixed_receipt(
                    {
                        "outcome": "NOT_APPLIED_CONFIRMED_STOP",
                        "publish_failure": candidate,
                    }
                )
                self.assertNotIn('"publish_failure"', receipt)
                self.assertNotIn(secret, receipt)

        with self.assertRaises(ValueError):
            guardian.GitFailureDiagnostic(
                kind=secret,
                stderr_hint="NOT_EVALUATED",
            )
        with self.assertRaises(ValueError):
            guardian.GitFailureDiagnostic(
                kind="TIMEOUT",
                stderr_hint="NAME_RESOLUTION_FAILURE",
            )

    def test_write_outputs_exports_observation_pair(self) -> None:
        unsafe_output_secret = "unsafe-output-extra-sentinel"
        with tempfile.TemporaryDirectory() as directory:
            output_path = pathlib.Path(directory) / "github-output"
            with (
                mock.patch.dict(
                    os.environ,
                    {"GITHUB_OUTPUT": str(output_path)},
                    clear=True,
                ),
                mock.patch("builtins.print") as printer,
            ):
                guardian._write_outputs(
                    {
                        "outcome": "RESULT_UNKNOWN_STOP",
                        "observed_before": "a" * 40,
                        "observed_after": "b" * 40,
                        "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
                        "git_failure_kind": "NONZERO_EXIT",
                        "git_stderr_hint": "NAME_RESOLUTION_FAILURE",
                        "result_uncertain": False,
                        "raw_stderr": unsafe_output_secret,
                        "command": ["git", unsafe_output_secret],
                        "remote_url": unsafe_output_secret,
                        "local_path": unsafe_output_secret,
                        "token": unsafe_output_secret,
                        "matched_marker": unsafe_output_secret,
                        "stderr_sha256": unsafe_output_secret,
                        "stderr_length": 999,
                        "exit_code": 128,
                        "signal": 9,
                        "errno": 13,
                        "exception_message": unsafe_output_secret,
                    }
                )
            rendered = output_path.read_text(encoding="utf-8")
            printed = printer.call_args.args[0]
        self.assertIn(f"observed_before={'a' * 40}\n", rendered)
        self.assertIn(f"observed_after={'b' * 40}\n", rendered)
        self.assertIn(
            f"failure_stage={guardian.TARGET_FETCH_FAILURE_STAGE}\n",
            rendered,
        )
        self.assertIn("git_failure_kind=NONZERO_EXIT\n", rendered)
        self.assertIn(
            "git_stderr_hint=NAME_RESOLUTION_FAILURE\n",
            rendered,
        )
        self.assertIn("result_uncertain=false\n", rendered)
        for forbidden in (
            unsafe_output_secret,
            "raw_stderr",
            "command",
            "remote_url",
            "local_path",
            "token",
            "matched_marker",
            "stderr_sha256",
            "stderr_length",
            "exit_code",
            '"signal"',
            '"errno"',
            "exception_message",
        ):
            self.assertNotIn(forbidden, rendered)
            self.assertNotIn(forbidden, printed)

        secret = "invalid-diagnostic-secret-sentinel"
        invalid_diagnostics = (
            {
                "stage": secret,
                "git_failure_kind": "NONZERO_EXIT",
                "git_stderr_hint": "NAME_RESOLUTION_FAILURE",
                "result_uncertain": False,
            },
            {
                "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
                "git_failure_kind": secret,
                "git_stderr_hint": "NAME_RESOLUTION_FAILURE",
                "result_uncertain": False,
            },
            {
                "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
                "git_failure_kind": "NONZERO_EXIT",
                "git_stderr_hint": secret,
                "result_uncertain": False,
            },
            {
                "stage": guardian.TARGET_FETCH_FAILURE_STAGE,
                "git_failure_kind": "NONZERO_EXIT",
                "git_stderr_hint": "NAME_RESOLUTION_FAILURE",
                "result_uncertain": "invalid-result-uncertain-sentinel",
            },
        )
        for invalid in invalid_diagnostics:
            with self.subTest(invalid=invalid):
                with tempfile.TemporaryDirectory() as directory:
                    output_path = pathlib.Path(directory) / "github-output"
                    with (
                        mock.patch.dict(
                            os.environ,
                            {"GITHUB_OUTPUT": str(output_path)},
                            clear=True,
                        ),
                        mock.patch("builtins.print") as printer,
                    ):
                        guardian._write_outputs(
                            {
                                "outcome": "RESULT_UNKNOWN_STOP",
                                **invalid,
                            }
                        )
                    rendered = output_path.read_text(encoding="utf-8")
                    printed = printer.call_args.args[0]
                valid_diagnostic = (
                    invalid["stage"]
                    == guardian.TARGET_FETCH_FAILURE_STAGE
                    and guardian._is_valid_git_failure_values(
                        invalid["git_failure_kind"],
                        invalid["git_stderr_hint"],
                    )
                )
                expected_stage = (
                    guardian.TARGET_FETCH_FAILURE_STAGE
                    if valid_diagnostic
                    else ""
                )
                expected_kind = (
                    invalid["git_failure_kind"]
                    if valid_diagnostic
                    else ""
                )
                expected_hint = (
                    invalid["git_stderr_hint"]
                    if valid_diagnostic
                    else ""
                )
                self.assertIn(
                    f"failure_stage={expected_stage}\n",
                    rendered,
                )
                self.assertIn(
                    f"git_failure_kind={expected_kind}\n",
                    rendered,
                )
                self.assertIn(
                    f"git_stderr_hint={expected_hint}\n",
                    rendered,
                )
                expected_uncertain = (
                    "result_uncertain=\n"
                    if type(invalid["result_uncertain"]) is not bool
                    else "result_uncertain=false\n"
                )
                self.assertIn(expected_uncertain, rendered)
                for forbidden in (
                    secret,
                    "invalid-result-uncertain-sentinel",
                ):
                    self.assertNotIn(forbidden, rendered)
                    self.assertNotIn(forbidden, printed)

    def test_workflow_forwards_observation_pair_from_each_job(self) -> None:
        workflow_path = (
            MODULE_PATH.parents[1]
            / "workflows"
            / "cocolon_formal_publication_guard.yml"
        )
        workflow = workflow_path.read_text(encoding="utf-8")
        self.assertEqual(
            3,
            workflow.count(
                "observed_before: ${{ steps.guard.outputs.observed_before }}"
            ),
        )
        self.assertEqual(
            3,
            workflow.count(
                "observed_after: ${{ steps.guard.outputs.observed_after }}"
            ),
        )
        for prefix in ("PREFLIGHT", "MAIN", "SANDBOX"):
            self.assertIn(f"GUARDIAN_{prefix}_OBSERVED_BEFORE:", workflow)
            self.assertIn(f"GUARDIAN_{prefix}_OBSERVED_AFTER:", workflow)

        preflight_job = workflow.split("  preflight:", 1)[1].split(
            "\n  publish-sandbox:",
            1,
        )[0]
        sandbox_job = workflow.split("  publish-sandbox:", 1)[1].split(
            "\n  publish-main:",
            1,
        )[0]
        main_job = workflow.split("  publish-main:", 1)[1].split(
            "\n  report:",
            1,
        )[0]
        report_job = workflow.split("  report:", 1)[1]
        sandbox_outputs = sandbox_job.split("    outputs:\n", 1)[1].split(
            "\n    steps:",
            1,
        )[0]
        sandbox_output_lines = [
            line
            for line in sandbox_outputs.splitlines()
            if line.startswith("      ")
        ]
        sandbox_output_keys = {
            line.strip().split(":", 1)[0]
            for line in sandbox_output_lines
        }
        self.assertEqual(
            len(sandbox_output_lines),
            len(sandbox_output_keys),
        )
        self.assertEqual(
            {
                "outcome",
                "postverified",
                "write_attempted",
                "request_sha256",
                "candidate_sha1",
                "observed_before",
                "observed_after",
                "failure_stage",
                "git_failure_kind",
                "git_stderr_hint",
                "result_uncertain",
            },
            sandbox_output_keys,
        )
        report_env = report_job.split(
            "      - name: Reconcile and report\n",
            1,
        )[1].split("        env:\n", 1)[1].split("\n        run:", 1)[0]
        report_env_lines = [
            line
            for line in report_env.splitlines()
            if line.startswith("          ")
        ]
        report_env_keys = {
            line.strip().split(":", 1)[0]
            for line in report_env_lines
        }
        self.assertEqual(len(report_env_lines), len(report_env_keys))
        self.assertEqual(
            {
                "GH_TOKEN",
                "GUARDIAN_EVENT_PATH",
                "GUARDIAN_PREFLIGHT_CANDIDATE_SHA1",
                "GUARDIAN_PREFLIGHT_JOB_RESULT",
                "GUARDIAN_PREFLIGHT_OBSERVED_AFTER",
                "GUARDIAN_PREFLIGHT_OBSERVED_BEFORE",
                "GUARDIAN_PREFLIGHT_OUTCOME",
                "GUARDIAN_PREFLIGHT_POSTVERIFIED",
                "GUARDIAN_PREFLIGHT_REQUEST_SHA256",
                "GUARDIAN_PREFLIGHT_WRITE_ATTEMPTED",
                "GUARDIAN_MAIN_CANDIDATE_SHA1",
                "GUARDIAN_MAIN_JOB_RESULT",
                "GUARDIAN_MAIN_OBSERVED_AFTER",
                "GUARDIAN_MAIN_OBSERVED_BEFORE",
                "GUARDIAN_MAIN_OUTCOME",
                "GUARDIAN_MAIN_POSTVERIFIED",
                "GUARDIAN_MAIN_REQUEST_SHA256",
                "GUARDIAN_MAIN_WRITE_ATTEMPTED",
                "GUARDIAN_SANDBOX_CANDIDATE_SHA1",
                "GUARDIAN_SANDBOX_FAILURE_STAGE",
                "GUARDIAN_SANDBOX_GIT_FAILURE_KIND",
                "GUARDIAN_SANDBOX_GIT_STDERR_HINT",
                "GUARDIAN_SANDBOX_JOB_RESULT",
                "GUARDIAN_SANDBOX_OBSERVED_AFTER",
                "GUARDIAN_SANDBOX_OBSERVED_BEFORE",
                "GUARDIAN_SANDBOX_OUTCOME",
                "GUARDIAN_SANDBOX_POSTVERIFIED",
                "GUARDIAN_SANDBOX_REQUEST_SHA256",
                "GUARDIAN_SANDBOX_RESULT_UNCERTAIN",
                "GUARDIAN_SANDBOX_WRITE_ATTEMPTED",
            },
            report_env_keys,
        )
        forwarding = (
            ("failure_stage", "FAILURE_STAGE"),
            ("git_failure_kind", "GIT_FAILURE_KIND"),
            ("git_stderr_hint", "GIT_STDERR_HINT"),
            ("result_uncertain", "RESULT_UNCERTAIN"),
        )
        for output_name, env_name in forwarding:
            output_forwarding = (
                f"{output_name}: "
                f"${{{{ steps.guard.outputs.{output_name} }}}}"
            )
            self.assertEqual(1, sandbox_job.count(output_forwarding))
            self.assertNotIn(
                output_forwarding,
                preflight_job,
            )
            self.assertNotIn(
                output_forwarding,
                main_job,
            )
            report_forwarding = (
                f"GUARDIAN_SANDBOX_{env_name}: "
                f"${{{{ needs.publish-sandbox.outputs.{output_name} }}}}"
            )
            self.assertEqual(1, report_job.count(report_forwarding))
        self.assertEqual(
            ["if: ${{ false }}"],
            [
                line.strip()
                for line in main_job.splitlines()
                if line.startswith("    if:")
            ],
        )
        self.assertEqual(
            ["if: >-"],
            [
                line.strip()
                for line in report_job.splitlines()
                if line.startswith("    if:")
            ],
        )
        report_if_block = report_job.split("    if: >-\n", 1)[1].split(
            "\n    runs-on:",
            1,
        )[0]
        self.assertIn("always() &&", report_if_block)
        report_needs = report_job.split("    needs:\n", 1)[1].split(
            "\n    if:",
            1,
        )[0]
        self.assertEqual(
            ["- preflight", "- publish-sandbox", "- publish-main"],
            [line.strip() for line in report_needs.splitlines()],
        )
        self.assertIn(
            "GUARDIAN_SANDBOX_JOB_RESULT: "
            "${{ needs.publish-sandbox.result }}",
            report_job,
        )
        self.assertNotIn("continue-on-error", workflow)
        self.assertNotIn("if: failure()", workflow)
        self.assertNotIn("retry", workflow.lower())
        self.assertEqual(
            [
                "- name: Checkout trusted main revision",
                "- name: Publish sandbox with exact lease",
            ],
            [
                line.strip()
                for line in sandbox_job.splitlines()
                if line.startswith("      - ")
            ],
        )
        self.assertEqual(
            1,
            sandbox_job.count(
                "python .github/cocolon_formal_publication_guard/guardian.py publish"
            ),
        )
        self.assertEqual(
            1,
            main_job.count(
                "python .github/cocolon_formal_publication_guard/guardian.py publish"
            ),
        )
        self.assertEqual(
            2,
            workflow.count(
                "python .github/cocolon_formal_publication_guard/guardian.py publish"
            ),
        )

    def test_unknown_preflight_cannot_unlock_publish_jobs(self) -> None:
        with (
            mock.patch.object(
                guardian,
                "run_guardian",
                side_effect=guardian.GuardianReject(
                    "RESULT_UNKNOWN_STOP",
                    "CANDIDATE_STAGING_REF_OBSERVATION",
                ),
            ),
            mock.patch.object(guardian, "_write_outputs") as write_outputs,
            mock.patch.object(guardian, "make_write_permit") as permit,
            mock.patch.object(guardian, "push_exact_lease") as push,
        ):
            exit_code = guardian.main(
                [
                    "preflight",
                    "--event-path",
                    "/tmp/guardian-test-event.json",
                ]
            )
        self.assertEqual(1, exit_code)
        output = write_outputs.call_args.args[0]
        self.assertEqual("RESULT_UNKNOWN_STOP", output["outcome"])
        self.assertEqual(
            "CANDIDATE_STAGING_REF_OBSERVATION",
            output["stage"],
        )
        permit.assert_not_called()
        push.assert_not_called()

        workflow_path = (
            MODULE_PATH.parents[1]
            / "workflows"
            / "cocolon_formal_publication_guard.yml"
        )
        workflow = workflow_path.read_text(encoding="utf-8")
        sandbox_job = workflow.split("  publish-sandbox:", 1)[1].split(
            "\n  publish-main:",
            1,
        )[0]
        main_job = workflow.split("  publish-main:", 1)[1].split(
            "\n  report:",
            1,
        )[0]
        self.assertIn("needs.preflight.result == 'success'", sandbox_job)
        self.assertIn(
            "needs.preflight.outputs.outcome == 'PREFLIGHT_PASSED'",
            sandbox_job,
        )
        self.assertIn(
            "needs.preflight.outputs.target_class == 'sandbox'",
            sandbox_job,
        )
        self.assertIn("if: ${{ false }}", main_job)
        self.assertIs(self.policy.production_main_enabled, False)

    def test_post_push_stop_is_uncertain_only_after_one_push_attempt(self) -> None:
        policy = dataclass_replace(
            self.policy,
            actor_allowlist=((175191163, "MassyuRed", "User"),),
            mode="OBSERVE_AND_SANDBOX_ONLY",
            sandbox_write_enabled=True,
            sandbox_fault_injection_enabled=True,
        )
        value = self.request_dict(sandbox=True)
        now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
        value["commit"]["timestamp_utc"] = now.strftime("%Y-%m-%dT%H:%M:%SZ")
        value["expires_at_utc"] = (now + dt.timedelta(hours=1)).strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        value["sandbox_test"] = {
            "case": "post_push_stop",
            "drift_ref": None,
            "drift_sha1": None,
        }
        value["request_sha256"] = guardian.request_hash(value)
        user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
        event = {
            "action": "opened",
            "repository": {
                "id": policy.repository_id,
                "full_name": policy.repository,
            },
            "issue": {
                "number": 8,
                "title": guardian.TITLE_PREFIX + value["request_id"],
                "body": self.body(value),
                "created_at": value["commit"]["timestamp_utc"],
                "user": dict(user),
            },
            "sender": dict(user),
        }
        request = guardian.parse_request_body(
            event["issue"]["body"],
            policy,
            issue_created_at=event["issue"]["created_at"],
        )
        proof = guardian.CandidateProof(
            "a" * 40,
            "b" * 40,
            request.expected_old_sha1,
            request.files,
        )
        with (
            mock.patch.dict(os.environ, {"GITHUB_SHA": request.workflow_sha1}),
            mock.patch.object(guardian, "verify_trusted_checkout"),
            mock.patch.object(guardian, "inspect_candidate", return_value=proof),
            mock.patch.object(
                guardian,
                "remote_ref_sha",
                return_value=request.expected_old_sha1,
            ),
            mock.patch.object(guardian, "make_write_permit", return_value=object()),
            mock.patch.object(guardian, "push_exact_lease") as push,
            mock.patch.object(guardian, "postverify_after_write") as postverify,
        ):
            with self.assertRaises(guardian.GuardianReject) as caught:
                guardian.evaluate_request(
                    event,
                    policy,
                    execution_mode="publish",
                    expected_target_class="sandbox",
                )
        self.assertEqual("RESULT_UNKNOWN_STOP", caught.exception.code)
        self.assertEqual("INTENTIONAL_POST_PUSH_STOP", caught.exception.stage)
        self.assertIs(caught.exception.write_attempted, True)
        self.assertIs(caught.exception.result_uncertain, True)
        push.assert_called_once()
        postverify.assert_not_called()

    def test_report_observes_production_main_around_reconciliation(self) -> None:
        result = {
            "outcome": "NOT_APPLIED_CONFIRMED_STOP",
            "write_attempted": "unknown",
            "postverified": False,
        }
        event = {"issue": {"number": 8}}
        with (
            mock.patch.object(
                guardian,
                "remote_ref_sha",
                side_effect=["a" * 40, "a" * 40],
            ) as observe,
            mock.patch.object(guardian, "run_guardian", return_value=result),
            mock.patch.object(guardian, "load_event", return_value=event),
            mock.patch.object(guardian, "report_result") as report,
            mock.patch.object(guardian, "_write_outputs"),
        ):
            exit_code = guardian.main(
                [
                    "report",
                    "--event-path",
                    "/tmp/guardian-test-event.json",
                    "--policy-path",
                    str(self.policy_path),
                ]
            )
        self.assertEqual(0, exit_code)
        self.assertEqual(2, observe.call_count)
        reported = report.call_args.args[1]
        self.assertEqual("a" * 40, reported["production_main_observed_before"])
        self.assertEqual("a" * 40, reported["production_main_observed_after"])

    def test_report_main_records_bound_failure_without_changing_final_state(
        self,
    ) -> None:
        secret = "report-secret-sentinel"
        result = {
            "outcome": "NOT_APPLIED_CONFIRMED_STOP",
            "target_class": "sandbox",
            "expected_old_sha1": "d" * 40,
            "request_sha256": "a" * 64,
            "candidate_sha1": "b" * 40,
            "observed_before": "d" * 40,
            "observed_after": "d" * 40,
            "write_attempted": "unknown",
            "postverified": False,
            "raw_stderr": secret,
        }
        event = {"issue": {"number": 13}}
        env = {
            "GH_TOKEN": "test-token",
            "GITHUB_REPOSITORY": "MassyuRed/Cocolon",
            "GITHUB_RUN_ID": "30179774714",
            "GITHUB_RUN_ATTEMPT": "1",
            "GUARDIAN_PREFLIGHT_JOB_RESULT": "success",
            "GUARDIAN_PREFLIGHT_OUTCOME": "PREFLIGHT_PASSED",
            "GUARDIAN_PREFLIGHT_REQUEST_SHA256": "a" * 64,
            "GUARDIAN_PREFLIGHT_CANDIDATE_SHA1": "b" * 40,
            "GUARDIAN_PREFLIGHT_OBSERVED_BEFORE": "d" * 40,
            "GUARDIAN_PREFLIGHT_WRITE_ATTEMPTED": "false",
            "GUARDIAN_PREFLIGHT_POSTVERIFIED": "false",
            "GUARDIAN_SANDBOX_JOB_RESULT": "failure",
            "GUARDIAN_SANDBOX_OUTCOME": "RESULT_UNKNOWN_STOP",
            "GUARDIAN_SANDBOX_FAILURE_STAGE": (
                guardian.TARGET_FETCH_FAILURE_STAGE
            ),
            "GUARDIAN_SANDBOX_GIT_FAILURE_KIND": "NONZERO_EXIT",
            "GUARDIAN_SANDBOX_GIT_STDERR_HINT": (
                "UNCLASSIFIED_OR_AMBIGUOUS"
            ),
            "GUARDIAN_SANDBOX_WRITE_ATTEMPTED": "false",
            "GUARDIAN_SANDBOX_RESULT_UNCERTAIN": "false",
            "GUARDIAN_SANDBOX_POSTVERIFIED": "false",
            "GUARDIAN_SANDBOX_RAW_STDERR": secret,
        }
        api_calls = []

        def api(method, url, token, payload):
            api_calls.append((method, url, token, payload))

        with (
            mock.patch.dict(os.environ, env, clear=True),
            mock.patch.object(
                guardian,
                "remote_ref_sha",
                side_effect=["c" * 40, "c" * 40],
            ),
            mock.patch.object(guardian, "run_guardian", return_value=result),
            mock.patch.object(guardian, "load_event", return_value=event),
            mock.patch.object(guardian, "_github_api", side_effect=api),
            mock.patch.object(guardian, "_write_outputs") as write_outputs,
        ):
            exit_code = guardian.main(
                [
                    "report",
                    "--event-path",
                    "/tmp/guardian-test-event.json",
                    "--policy-path",
                    str(self.policy_path),
                ]
            )
        self.assertEqual(0, exit_code)
        self.assertEqual(["POST", "PATCH"], [call[0] for call in api_calls])
        body = api_calls[0][3]["body"]
        self.assertIn('"outcome":"NOT_APPLIED_CONFIRMED_STOP"', body)
        self.assertIn('"publish_failure":{', body)
        self.assertIn('"stage":"CANDIDATE_TARGET_REF_FETCH"', body)
        self.assertIn('"git_failure_kind":"NONZERO_EXIT"', body)
        self.assertNotIn(secret, body)
        reported = write_outputs.call_args.args[0]
        self.assertEqual("NOT_APPLIED_CONFIRMED_STOP", reported["outcome"])
        self.assertEqual("unknown", reported["write_attempted"])
        self.assertIs(reported["postverified"], False)
        self.assertEqual("c" * 40, reported["production_main_observed_before"])
        self.assertEqual("c" * 40, reported["production_main_observed_after"])
        self.assertEqual(
            guardian.TARGET_FETCH_FAILURE_STAGE,
            reported["publish_failure"]["stage"],
        )

    def test_production_main_observation_normalizes_missing_or_failed_read(
        self,
    ) -> None:
        cases = (
            None,
            guardian.GuardianReject("RESULT_UNKNOWN_STOP", "GIT"),
        )
        for observed in cases:
            patch = (
                mock.patch.object(
                    guardian,
                    "remote_ref_sha",
                    return_value=None,
                )
                if observed is None
                else mock.patch.object(
                    guardian,
                    "remote_ref_sha",
                    side_effect=observed,
                )
            )
            with self.subTest(observed=observed), patch:
                with self.assertRaises(guardian.GuardianReject) as caught:
                    guardian.observe_production_main(self.policy)
            self.assertEqual("RESULT_UNKNOWN_STOP", caught.exception.code)
            self.assertEqual(
                "PRODUCTION_MAIN_OBSERVATION",
                caught.exception.stage,
            )

    def test_no_write_target_observation_requires_second_matching_read(
        self,
    ) -> None:
        with mock.patch.object(
            guardian,
            "remote_ref_sha",
            return_value="a" * 40,
        ) as observe:
            observed_after = guardian.observe_unchanged_target(
                "refs/heads/guardian/sandbox/suite/case",
                "a" * 40,
            )
        self.assertEqual("a" * 40, observed_after)
        observe.assert_called_once()

        cases = (
            None,
            "b" * 40,
            guardian.GuardianReject("RESULT_UNKNOWN_STOP", "GIT"),
        )
        for observed in cases:
            patch = (
                mock.patch.object(
                    guardian,
                    "remote_ref_sha",
                    return_value=observed,
                )
                if not isinstance(observed, Exception)
                else mock.patch.object(
                    guardian,
                    "remote_ref_sha",
                    side_effect=observed,
                )
            )
            with self.subTest(observed=observed), patch:
                with self.assertRaises(guardian.GuardianReject) as caught:
                    guardian.observe_unchanged_target(
                        "refs/heads/guardian/sandbox/suite/case",
                        "a" * 40,
                    )
            self.assertEqual("RESULT_UNKNOWN_STOP", caught.exception.code)
            self.assertEqual("TARGET_OBSERVATION", caught.exception.stage)

    def test_resolved_duplicate_and_head_drift_exit_success(self) -> None:
        cases = (
            ("preflight", "ALREADY_APPLIED_POSTVERIFIED"),
            ("preflight", "REJECTED_HEAD_DRIFT"),
            ("publish", "REJECTED_HEAD_DRIFT"),
        )
        for command, outcome in cases:
            with (
                self.subTest(command=command, outcome=outcome),
                mock.patch.object(
                    guardian,
                    "run_guardian",
                    return_value={"outcome": outcome},
                ),
                mock.patch.object(guardian, "_write_outputs"),
            ):
                observed = guardian.main(
                    [command, "--event-path", "/tmp/guardian-test-event.json"]
                )
            self.assertEqual(0, observed)


class TimeBindingTests(GuardianTestCase):
    def test_future_request_relative_to_issue_rejected(self) -> None:
        value = self.request_dict()
        value["commit"]["timestamp_utc"] = "2099-01-01T00:00:00Z"
        value["expires_at_utc"] = "2099-01-01T01:00:00Z"
        value["request_sha256"] = guardian.request_hash(value)
        self.assertRejected(
            "REJECTED_FUTURE_COMMIT_TIME",
            guardian.parse_request_body,
            self.body(value),
            self.policy,
            issue_created_at="2026-07-25T00:00:00Z",
        )

    def test_policy_author_header_injection_rejected(self) -> None:
        raw = json.loads(self.policy_path.read_text(encoding="utf-8"))
        raw["author_name"] = "bad\nparent deadbeef"
        with tempfile.TemporaryDirectory() as directory_name:
            path = pathlib.Path(directory_name) / "policy.json"
            path.write_text(json.dumps(raw), encoding="utf-8")
            self.assertRejected(
                "REJECTED_POLICY_AUTHOR", guardian.load_policy, path
            )


class LocalBareRemoteIntegrationTests(GuardianTestCase):
    def git_run(
        self,
        directory: pathlib.Path,
        *args: str,
    ) -> str:
        result = subprocess.run(
            ["git", *args],
            cwd=directory,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
        return result.stdout.decode("utf-8", "strict").strip()

    def test_object_only_inspection_exact_lease_and_postverify(self) -> None:
        with tempfile.TemporaryDirectory() as directory_name:
            root = pathlib.Path(directory_name)
            remote = root / "remote.git"
            work = root / "work"
            remote.mkdir()
            work.mkdir()
            self.git_run(remote, "init", "--bare", "-q")
            self.git_run(work, "init", "-q")
            self.git_run(work, "config", "user.name", "test")
            self.git_run(work, "config", "user.email", "test@example.invalid")
            self.git_run(work, "checkout", "-qb", "main")
            (work / "base.txt").write_text("base\n", encoding="utf-8")
            self.git_run(work, "add", "base.txt")
            self.git_run(work, "commit", "-qm", "base")
            base = self.git_run(work, "rev-parse", "HEAD")
            self.git_run(work, "remote", "add", "origin", str(remote))
            self.git_run(work, "push", "-q", "origin", "main")

            target_ref = "refs/heads/guardian/sandbox/suite-local/normal"
            self.git_run(work, "push", "-q", "origin", f"{base}:{target_ref}")
            sandbox_path = pathlib.Path(
                "Cocolon_前提資料/github_actions_guardian_sandbox/"
                "suite-local/normal.txt"
            )
            (work / sandbox_path).parent.mkdir(parents=True)
            raw = b"guardian local integration\n"
            (work / sandbox_path).write_bytes(raw)
            self.git_run(work, "add", sandbox_path.as_posix())
            self.git_run(work, "commit", "-qm", "candidate")
            staging_head = self.git_run(work, "rev-parse", "HEAD")
            new_blob = self.git_run(work, "rev-parse", f"HEAD:{sandbox_path.as_posix()}")

            policy = dataclass_replace(
                self.policy,
                mode="OBSERVE_AND_SANDBOX_ONLY",
                sandbox_write_enabled=True,
            )
            files = [
                {
                    "path": sandbox_path.as_posix(),
                    "operation": "add",
                    "old_mode": None,
                    "new_mode": "100644",
                    "old_blob_sha1": None,
                    "new_blob_sha1": new_blob,
                    "raw_sha256": guardian.sha256_hex(raw),
                    "size_bytes": len(raw),
                }
            ]
            files_sha256 = guardian.files_hash(files)
            request_id = guardian.bound_request_id(
                target_ref,
                base,
                files_sha256,
            )
            staging_ref = f"refs/heads/guardian/staging/{request_id}"
            self.git_run(work, "push", "-q", "origin", f"HEAD:{staging_ref}")
            value = self.request_dict(sandbox=True)
            value.update(
                {
                    "request_id": request_id,
                    "target_ref": target_ref,
                    "expected_old_sha1": base,
                    "staging_ref": staging_ref,
                    "staging_head_sha1": staging_head,
                    "files": files,
                    "files_sha256": files_sha256,
                }
            )
            value["request_sha256"] = guardian.request_hash(value)
            request = guardian.parse_request_body(self.body(value), policy)

            old_cwd = os.getcwd()
            try:
                os.chdir(work)
                proof = guardian.inspect_candidate(request, policy)
                permit = guardian.make_write_permit(
                    request,
                    policy,
                    proof,
                    expected_target_class="sandbox",
                )
                guardian.push_exact_lease(permit, policy)
                guardian.postverify(request, proof)
                observed = guardian.remote_ref_sha(target_ref)
            finally:
                os.chdir(old_cwd)
            self.assertEqual(proof.candidate_sha1, observed)
            self.assertEqual(base, proof.parent_sha1)

    def test_corrected_merge_fixture_matches_preflight_and_reconcile(self) -> None:
        with tempfile.TemporaryDirectory() as directory_name:
            work = pathlib.Path(directory_name) / "work"
            work.mkdir()
            self.git_run(work, "init", "-q")
            self.git_run(work, "config", "user.name", "test")
            self.git_run(work, "config", "user.email", "test@example.invalid")
            self.git_run(work, "checkout", "-qb", "main")
            (work / "base.txt").write_text("base\n", encoding="utf-8")
            self.git_run(work, "add", "base.txt")
            self.git_run(work, "commit", "-qm", "base")
            base = self.git_run(work, "rev-parse", "HEAD")

            self.git_run(work, "checkout", "-qb", "candidate")
            sandbox_path = pathlib.Path(
                "Cocolon_前提資料/github_actions_guardian_sandbox/"
                "suite-local/merge-lineage.txt"
            )
            raw = b"corrected merge lineage fixture\n"
            (work / sandbox_path).parent.mkdir(parents=True)
            (work / sandbox_path).write_bytes(raw)
            self.git_run(work, "add", sandbox_path.as_posix())
            self.git_run(work, "commit", "-qm", "candidate")
            candidate = self.git_run(work, "rev-parse", "HEAD")
            new_blob = self.git_run(
                work,
                "rev-parse",
                f"HEAD:{sandbox_path.as_posix()}",
            )

            self.git_run(work, "checkout", "-q", "main")
            self.git_run(
                work,
                "merge",
                "--no-ff",
                "-qm",
                "corrected merge fixture",
                "candidate",
            )
            corrected_merge = self.git_run(work, "rev-parse", "HEAD")
            self.assertEqual(
                [base, candidate],
                self.git_run(
                    work,
                    "show",
                    "-s",
                    "--format=%P",
                    corrected_merge,
                ).split(),
            )
            self.git_run(work, "checkout", "--detach", "-q", base)

            target_ref = (
                "refs/heads/guardian/sandbox/suite-local/merge-lineage"
            )
            files = [
                {
                    "path": sandbox_path.as_posix(),
                    "operation": "add",
                    "old_mode": None,
                    "new_mode": "100644",
                    "old_blob_sha1": None,
                    "new_blob_sha1": new_blob,
                    "raw_sha256": guardian.sha256_hex(raw),
                    "size_bytes": len(raw),
                }
            ]
            files_sha256 = guardian.files_hash(files)
            request_id = guardian.bound_request_id(
                target_ref,
                base,
                files_sha256,
            )
            now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
            value = self.request_dict(sandbox=True)
            value.update(
                {
                    "request_id": request_id,
                    "target_ref": target_ref,
                    "workflow_sha1": base,
                    "expected_old_sha1": base,
                    "staging_ref": (
                        f"{self.policy.staging_ref_prefix}{request_id}"
                    ),
                    "staging_head_sha1": corrected_merge,
                    "commit": {
                        "subject": "test: corrected merge fixture",
                        "timestamp_utc": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    },
                    "expires_at_utc": (
                        now + dt.timedelta(hours=1)
                    ).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "files": files,
                    "files_sha256": files_sha256,
                }
            )
            value["request_sha256"] = guardian.request_hash(value)
            user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
            event = {
                "action": "opened",
                "repository": {
                    "id": self.policy.repository_id,
                    "full_name": self.policy.repository,
                },
                "issue": {
                    "number": 11,
                    "title": guardian.TITLE_PREFIX + request_id,
                    "body": self.body(value),
                    "created_at": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "user": dict(user),
                },
                "sender": dict(user),
            }

            def observe(ref: str, *, failure_stage: str | None = None):
                if ref == value["staging_ref"]:
                    return corrected_merge
                self.assertEqual(target_ref, ref)
                return base

            def fetch(
                ref: str,
                _namespace: str,
                *,
                fetch_failure_stage: str | None = None,
            ):
                if ref == value["staging_ref"]:
                    return corrected_merge
                self.assertEqual(target_ref, ref)
                return base

            outcomes: list[tuple[str, str]] = []
            old_cwd = os.getcwd()
            try:
                os.chdir(work)
                for execution_mode in ("preflight", "reconcile"):
                    with (
                        self.subTest(execution_mode=execution_mode),
                        mock.patch.dict(os.environ, {"GITHUB_SHA": base}),
                        mock.patch.object(
                            guardian,
                            "remote_ref_sha",
                            side_effect=observe,
                        ) as remote,
                        mock.patch.object(
                            guardian,
                            "_fetch_exact",
                            side_effect=fetch,
                        ) as exact_fetch,
                        mock.patch.object(
                            guardian,
                            "make_write_permit",
                        ) as permit,
                        mock.patch.object(
                            guardian,
                            "push_exact_lease",
                        ) as push,
                        mock.patch.object(
                            guardian,
                            "postverify_after_write",
                        ) as postverify,
                    ):
                        with self.assertRaises(
                            guardian.GuardianReject
                        ) as caught:
                            guardian.evaluate_request(
                                event,
                                self.policy,
                                execution_mode=execution_mode,
                            )
                    outcomes.append(
                        (caught.exception.code, caught.exception.stage)
                    )
                    receipt = guardian.fixed_receipt(
                        guardian.sanitized_failure(caught.exception)
                    )
                    self.assertIn(
                        '"outcome":"REJECTED_NON_LINEAR_LINEAGE"',
                        receipt,
                    )
                    self.assertIn('"stage":"CANDIDATE"', receipt)
                    self.assertNotIn("RESULT_UNKNOWN_STOP", receipt)
                    self.assertEqual(2, remote.call_count)
                    self.assertEqual(2, exact_fetch.call_count)
                    permit.assert_not_called()
                    push.assert_not_called()
                    postverify.assert_not_called()

                with (
                    mock.patch.dict(
                        os.environ,
                        {
                            "GITHUB_SHA": base,
                            "GH_TOKEN": "report-token",
                            "GITHUB_REPOSITORY": self.policy.repository,
                        },
                    ),
                    mock.patch.object(
                        guardian,
                        "load_event",
                        return_value=event,
                    ),
                    mock.patch.object(
                        guardian,
                        "observe_production_main",
                        side_effect=[base, base],
                    ),
                    mock.patch.object(
                        guardian,
                        "remote_ref_sha",
                        side_effect=observe,
                    ),
                    mock.patch.object(
                        guardian,
                        "_fetch_exact",
                        side_effect=fetch,
                    ),
                    mock.patch.object(guardian, "_github_api") as github_api,
                    mock.patch.object(
                        guardian,
                        "_write_outputs",
                    ) as write_outputs,
                    mock.patch.object(
                        guardian,
                        "make_write_permit",
                    ) as report_permit,
                    mock.patch.object(
                        guardian,
                        "push_exact_lease",
                    ) as report_push,
                    mock.patch.object(
                        guardian,
                        "postverify_after_write",
                    ) as report_postverify,
                ):
                    report_exit = guardian.main(
                        [
                            "report",
                            "--event-path",
                            "/tmp/guardian-merge-event.json",
                            "--policy-path",
                            str(self.policy_path),
                        ]
                    )
                self.assertEqual(0, report_exit)
                self.assertEqual(
                    ["POST", "PATCH"],
                    [call.args[0] for call in github_api.call_args_list],
                )
                receipt = github_api.call_args_list[0].args[3]["body"]
                self.assertIn(
                    '"outcome":"REJECTED_NON_LINEAR_LINEAGE"',
                    receipt,
                )
                self.assertIn('"stage":"CANDIDATE"', receipt)
                self.assertNotIn("RESULT_UNKNOWN_STOP", receipt)
                reported = write_outputs.call_args.args[0]
                self.assertEqual(
                    "REJECTED_NON_LINEAR_LINEAGE",
                    reported["outcome"],
                )
                self.assertEqual("CANDIDATE", reported["stage"])
                report_permit.assert_not_called()
                report_push.assert_not_called()
                report_postverify.assert_not_called()
            finally:
                os.chdir(old_cwd)
            self.assertEqual(
                [
                    ("REJECTED_NON_LINEAR_LINEAGE", "CANDIDATE"),
                    ("REJECTED_NON_LINEAR_LINEAGE", "CANDIDATE"),
                ],
                outcomes,
            )

    def test_head_drift_fixture_advances_target_and_stale_lease_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory_name:
            root = pathlib.Path(directory_name)
            remote = root / "remote.git"
            work = root / "work"
            remote.mkdir()
            work.mkdir()
            self.git_run(remote, "init", "--bare", "-q")
            self.git_run(work, "init", "-q")
            self.git_run(work, "config", "user.name", "test")
            self.git_run(work, "config", "user.email", "test@example.invalid")
            self.git_run(work, "checkout", "-qb", "main")
            (work / "base.txt").write_text("base\n", encoding="utf-8")
            self.git_run(work, "add", "base.txt")
            self.git_run(work, "commit", "-qm", "base")
            base = self.git_run(work, "rev-parse", "HEAD")
            self.git_run(work, "remote", "add", "origin", str(remote))
            self.git_run(work, "push", "-q", "origin", "main")

            target_ref = "refs/heads/guardian/sandbox/suite-local/head-drift"
            self.git_run(work, "push", "-q", "origin", f"{base}:{target_ref}")
            self.git_run(work, "checkout", "-qb", "staging-test")
            sandbox_path = pathlib.Path(
                "Cocolon_前提資料/github_actions_guardian_sandbox/"
                "suite-local/head-drift.txt"
            )
            (work / sandbox_path).parent.mkdir(parents=True)
            raw = b"head drift candidate\n"
            (work / sandbox_path).write_bytes(raw)
            self.git_run(work, "add", sandbox_path.as_posix())
            self.git_run(work, "commit", "-qm", "candidate")
            staging_head = self.git_run(work, "rev-parse", "HEAD")
            new_blob = self.git_run(work, "rev-parse", f"HEAD:{sandbox_path.as_posix()}")
            self.git_run(work, "checkout", "-q", "main")

            policy = dataclass_replace(
                self.policy,
                actor_allowlist=((175191163, "MassyuRed", "User"),),
                mode="OBSERVE_AND_SANDBOX_ONLY",
                sandbox_write_enabled=True,
                sandbox_fault_injection_enabled=True,
            )
            files = [
                {
                    "path": sandbox_path.as_posix(),
                    "operation": "add",
                    "old_mode": None,
                    "new_mode": "100644",
                    "old_blob_sha1": None,
                    "new_blob_sha1": new_blob,
                    "raw_sha256": guardian.sha256_hex(raw),
                    "size_bytes": len(raw),
                }
            ]
            files_sha256 = guardian.files_hash(files)
            request_id = guardian.bound_request_id(
                target_ref,
                base,
                files_sha256,
            )
            staging_ref = f"refs/heads/guardian/staging/{request_id}"
            self.git_run(work, "push", "-q", "origin", f"{staging_head}:{staging_ref}")
            now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0)
            expires = now + dt.timedelta(hours=1)
            value = self.request_dict(sandbox=True)
            value.update(
                {
                    "request_id": request_id,
                    "target_ref": target_ref,
                    "workflow_sha1": base,
                    "expected_old_sha1": base,
                    "staging_ref": staging_ref,
                    "staging_head_sha1": staging_head,
                    "commit": {
                        "subject": "test: sandbox head drift",
                        "timestamp_utc": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    },
                    "expires_at_utc": expires.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "files": files,
                    "files_sha256": files_sha256,
                    "sandbox_test": {
                        "case": "head_drift",
                        "drift_ref": target_ref,
                        "drift_sha1": "0" * 40,
                    },
                }
            )
            value["request_sha256"] = guardian.request_hash(value)
            provisional = guardian.parse_request_body(self.body(value), policy)
            old_cwd = os.getcwd()
            try:
                os.chdir(work)
                base_tree = self.git_run(work, "rev-parse", f"{base}^{{tree}}")
                drift_sha = guardian.build_sandbox_drift_fixture(
                    provisional, policy, base_tree
                )
            finally:
                os.chdir(old_cwd)
            value["sandbox_test"]["drift_sha1"] = drift_sha
            value["request_sha256"] = guardian.request_hash(value)
            user = {"id": 175191163, "login": "MassyuRed", "type": "User"}
            event = {
                "action": "opened",
                "repository": {
                    "id": policy.repository_id,
                    "full_name": policy.repository,
                },
                "issue": {
                    "number": 9,
                    "title": guardian.TITLE_PREFIX + request_id,
                    "body": self.body(value),
                    "created_at": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "user": dict(user),
                },
                "sender": dict(user),
            }
            try:
                os.chdir(work)
                with mock.patch.dict(os.environ, {"GITHUB_SHA": base}):
                    result = guardian.evaluate_request(
                        event,
                        policy,
                        execution_mode="publish",
                        expected_target_class="sandbox",
                    )
                observed_target = guardian.remote_ref_sha(target_ref)
                observed_main = guardian.remote_ref_sha("refs/heads/main")
            finally:
                os.chdir(old_cwd)
            self.assertEqual("REJECTED_HEAD_DRIFT", result["outcome"])
            self.assertEqual(drift_sha, observed_target)
            self.assertEqual(base, observed_main)


def dataclass_replace(value, **changes):
    return guardian.dataclasses.replace(value, **changes)


if __name__ == "__main__":
    unittest.main(verbosity=2)
