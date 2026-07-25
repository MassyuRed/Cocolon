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

    def test_write_outputs_exports_observation_pair(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output_path = pathlib.Path(directory) / "github-output"
            with (
                mock.patch.dict(
                    os.environ,
                    {"GITHUB_OUTPUT": str(output_path)},
                    clear=True,
                ),
                mock.patch("builtins.print"),
            ):
                guardian._write_outputs(
                    {
                        "outcome": "APPLIED_AND_POSTVERIFIED",
                        "observed_before": "a" * 40,
                        "observed_after": "b" * 40,
                    }
                )
            rendered = output_path.read_text(encoding="utf-8")
        self.assertIn(f"observed_before={'a' * 40}\n", rendered)
        self.assertIn(f"observed_after={'b' * 40}\n", rendered)

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
