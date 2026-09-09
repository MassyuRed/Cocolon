from __future__ import annotations

import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock

from tools.cocolon_context_environment import (
    EnvironmentVerificationError,
    canonical_json_bytes,
    inspect_environment,
    verify_environment,
)


def canonical(value: object) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        + "\n"
    ).encode("utf-8")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class EnvironmentFixture:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.devcontainer = root / ".devcontainer"
        self.devcontainer.mkdir(parents=True)
        self.python_lock = self.devcontainer / "system-context-python.lock"
        self.python_lock.write_text(
            "pytest==8.4.2 \\\n+    --hash=sha256:" + "1" * 64 + "\n",
            encoding="utf-8",
        )

        self.install_root = root / "installed-node-toolchain"
        self.bin_root = self.install_root / "node_modules" / ".bin"
        self.bin_root.mkdir(parents=True)
        self.packages = {
            "typescript": {
                "package": "typescript",
                "version": "5.2.2",
                "integrity": "sha512-typescript",
                "bin": "tsc",
            },
            "scip_typescript": {
                "package": "@sourcegraph/scip-typescript",
                "version": "0.4.0",
                "integrity": "sha512-scip-typescript",
                "bin": "scip-typescript",
            },
            "scip_python": {
                "package": "@sourcegraph/scip-python",
                "version": "0.6.6",
                "integrity": "sha512-scip-python",
                "bin": "scip-python",
            },
        }
        self.transitive = {
            "parent": "@sourcegraph/scip-typescript",
            "package": "typescript",
            "version": "5.9.3",
            "integrity": "sha512-transitive-typescript",
        }
        for configuration in self.packages.values():
            package = configuration["package"]
            metadata = self.install_root / "node_modules" / Path(*package.split("/"))
            metadata.mkdir(parents=True)
            (metadata / "package.json").write_bytes(
                canonical({"name": package, "version": configuration["version"]})
            )
            executable = self.bin_root / configuration["bin"]
            executable.write_text("#!/bin/sh\nexit 0\n", encoding="utf-8")
            executable.chmod(0o755)
        transitive_metadata = (
            self.install_root
            / "node_modules"
            / "@sourcegraph"
            / "scip-typescript"
            / "node_modules"
            / "typescript"
        )
        transitive_metadata.mkdir(parents=True)
        (transitive_metadata / "package.json").write_bytes(
            canonical(
                {
                    "name": self.transitive["package"],
                    "version": self.transitive["version"],
                }
            )
        )

        self.package_lock = self.devcontainer / "system-context-node" / "package-lock.json"
        self.package_lock.parent.mkdir(parents=True)
        self.package_lock.write_bytes(
            canonical(
                {
                    "name": "cocolon-system-context-toolchain",
                    "lockfileVersion": 3,
                    "packages": {
                        "": {
                            "dependencies": {
                                configuration["package"]: configuration["version"]
                                for configuration in self.packages.values()
                            }
                        },
                        **{
                            f"node_modules/{configuration['package']}": {
                                "version": configuration["version"],
                                "integrity": configuration["integrity"],
                            }
                            for configuration in self.packages.values()
                        },
                        "node_modules/@sourcegraph/scip-typescript/node_modules/typescript": {
                            "version": self.transitive["version"],
                            "integrity": self.transitive["integrity"],
                        },
                    },
                }
            )
        )
        self.toolchain_lock = self.devcontainer / "system-context-toolchain.lock.json"
        self.write_toolchain_lock()

    def write_toolchain_lock(self) -> None:
        document = {
            "schema_version": 1,
            "scope": "cocolon-system-context-v1",
            "platform": {"os": "linux", "architecture": "amd64"},
            "python": {
                "implementation": "CPython",
                "version": "3.11.16",
                "base_image": {
                    "reference": "python:3.11.16-slim-bookworm",
                    "index_digest": "sha256:" + "2" * 64,
                    "platform_manifest_digest": "sha256:" + "3" * 64,
                },
                "test_lock": {
                    "path": ".devcontainer/system-context-python.lock",
                    "sha256": sha256(self.python_lock),
                    "pytest_version": "8.4.2",
                },
            },
            "node": {
                "version": "20.20.2",
                "npm_version": "10.8.2",
                "archive": {
                    "url": "https://nodejs.org/dist/v20.20.2/node-v20.20.2-linux-x64.tar.xz",
                    "sha256": "4" * 64,
                },
            },
            "scip_cli": {
                "version": "v0.7.1",
                "archive": {
                    "url": "https://github.com/sourcegraph/scip/releases/download/v0.7.1/scip-linux-amd64.tar.gz",
                    "sha256": "5" * 64,
                },
            },
            "npm_toolchain": {
                "install_root": str(self.install_root),
                "lock": {
                    "path": ".devcontainer/system-context-node/package-lock.json",
                    "sha256": sha256(self.package_lock),
                    "lockfile_version": 3,
                },
                "packages": {
                    "typescript": {
                        key: self.packages["typescript"][key]
                        for key in ("package", "version", "integrity", "bin")
                    },
                    "scip_typescript": {
                        key: self.packages["scip_typescript"][key]
                        for key in ("package", "version", "integrity", "bin")
                    },
                    "scip_python": {
                        key: self.packages["scip_python"][key]
                        for key in ("package", "version", "integrity", "bin")
                    },
                },
                "resolved_transitives": {
                    "@sourcegraph/scip-typescript>typescript": {
                        "version": self.transitive["version"],
                        "integrity": self.transitive["integrity"],
                    }
                },
            },
            "required_commands": ["bash", "git", "xz"],
        }
        self.toolchain_lock.write_bytes(canonical(document))

    @staticmethod
    def command(command: list[str] | tuple[str, ...]) -> tuple[int, str, str]:
        executable = Path(command[0]).name
        outputs = {
            "node": "v20.20.2\n",
            "npm": "10.8.2\n",
            "scip": "scip version v0.7.1\n",
            "tsc": "Version 5.2.2\n",
            "scip-typescript": "0.4.0\n",
            "scip-python": "0.6.6\n",
        }
        if executable not in outputs:
            return 127, "", ""
        return 0, outputs[executable], ""


class EnvironmentVerificationTests(unittest.TestCase):
    def setUp(self) -> None:
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.fixture = EnvironmentFixture(self.root)
        node_path = mock.patch.dict(
            "os.environ",
            {
                "NODE_PATH": str(
                    self.fixture.install_root / "node_modules"
                )
            },
        )
        node_path.start()
        self.addCleanup(node_path.stop)
        self.runtime = mock.patch.multiple(
            "tools.cocolon_context_environment.platform",
            python_version=mock.DEFAULT,
            python_implementation=mock.DEFAULT,
            system=mock.DEFAULT,
            machine=mock.DEFAULT,
        )
        platform_mocks = self.runtime.start()
        self.addCleanup(self.runtime.stop)
        platform_mocks["python_version"].return_value = "3.11.16"
        platform_mocks["python_implementation"].return_value = "CPython"
        platform_mocks["system"].return_value = "Linux"
        platform_mocks["machine"].return_value = "x86_64"

        metadata = mock.patch(
            "tools.cocolon_context_environment.importlib.metadata.version",
            return_value="8.4.2",
        )
        metadata.start()
        self.addCleanup(metadata.stop)
        which = mock.patch(
            "tools.cocolon_context_environment.shutil.which",
            side_effect=lambda value: f"/usr/bin/{value}",
        )
        which.start()
        self.addCleanup(which.stop)

    def inspect(self, runner=None) -> dict[str, object]:
        return inspect_environment(
            implementation_root=self.root,
            lock_path=self.fixture.toolchain_lock,
            command_runner=runner or self.fixture.command,
        )

    def test_exact_environment_passes_with_deterministic_fingerprint(self) -> None:
        first = self.inspect()
        second = self.inspect()

        self.assertEqual(first, second)
        self.assertEqual(first["status"], "PASS")
        self.assertTrue(all(row["status"] == "PASS" for row in first["checks"]))
        fingerprint = first["environment_fingerprint"]
        identity = dict(first)
        identity.pop("environment_fingerprint")
        self.assertEqual(
            fingerprint,
            hashlib.sha256(canonical_json_bytes(identity)).hexdigest(),
        )
        self.assertEqual(
            verify_environment(
                implementation_root=self.root,
                lock_path=self.fixture.toolchain_lock,
                command_runner=self.fixture.command,
            ),
            first,
        )

    def test_fixture_bin_validation_uses_locked_mode_not_mount_access(self) -> None:
        # CI keeps /tmp on a noexec tmpfs. The real providers are executed from
        # /opt by the version checks; fixture metadata should remain portable.
        with mock.patch(
            "tools.cocolon_context_environment.os.access", return_value=False
        ):
            report = self.inspect()
        self.assertEqual(report["status"], "PASS")

    def test_fixed_image_lock_environment_variable_is_supported(self) -> None:
        with mock.patch.dict(
            "os.environ",
            {"COCOLON_CONTEXT_TOOLCHAIN_LOCK": str(self.fixture.toolchain_lock)},
        ):
            report = inspect_environment(
                implementation_root=self.root,
                command_runner=self.fixture.command,
            )
        self.assertEqual(report["status"], "PASS")

    def test_environment_lock_override_cannot_replace_repository_identity(self) -> None:
        replacement = self.root / "replacement-lock.json"
        replacement.write_bytes(self.fixture.toolchain_lock.read_bytes())
        document = json.loads(replacement.read_text(encoding="utf-8"))
        document["node"]["version"] = "20.19.0"
        replacement.write_bytes(canonical(document))
        with mock.patch.dict(
            "os.environ",
            {"COCOLON_CONTEXT_TOOLCHAIN_LOCK": str(replacement)},
        ):
            report = inspect_environment(
                implementation_root=self.root,
                command_runner=self.fixture.command,
            )
        self.assertEqual(report["status"], "FAIL")
        self.assertEqual(report["checks"][0]["id"], "lock.configuration")

    def test_runtime_version_mismatch_is_a_typed_failure(self) -> None:
        def wrong_node(command: list[str] | tuple[str, ...]) -> tuple[int, str, str]:
            if Path(command[0]).name == "node":
                return 0, "v20.19.0\n", ""
            return self.fixture.command(command)

        report = self.inspect(wrong_node)
        self.assertEqual(report["status"], "FAIL")
        node = next(row for row in report["checks"] if row["id"] == "node.version")
        self.assertEqual(node["expected"], "v20.20.2")
        self.assertEqual(node["actual"], "v20.19.0")

        with self.assertRaises(EnvironmentVerificationError) as raised:
            verify_environment(
                implementation_root=self.root,
                lock_path=self.fixture.toolchain_lock,
                command_runner=wrong_node,
            )
        self.assertEqual(raised.exception.report, report)
        self.assertIn("node.version", str(raised.exception))

    def test_node_module_path_must_expose_the_locked_typescript(self) -> None:
        with mock.patch.dict("os.environ", {"NODE_PATH": "/wrong/modules"}):
            report = self.inspect()
        row = next(
            check
            for check in report["checks"]
            if check["id"] == "node.module_path"
        )
        self.assertEqual(report["status"], "FAIL")
        self.assertEqual(row["status"], "FAIL")

    def test_related_lock_tamper_is_rejected(self) -> None:
        self.fixture.python_lock.write_text("pytest==8.4.3\n", encoding="utf-8")
        report = self.inspect()
        row = next(
            check
            for check in report["checks"]
            if check["id"] == "lock.python.sha256"
        )
        self.assertEqual(report["status"], "FAIL")
        self.assertEqual(row["status"], "FAIL")
        self.assertRegex(row["actual"], r"^[0-9a-f]{64}$")

    def test_package_lock_integrity_and_installed_metadata_are_both_required(self) -> None:
        package = (
            self.fixture.install_root
            / "node_modules"
            / "@sourcegraph"
            / "scip-python"
            / "package.json"
        )
        package.write_bytes(
            canonical({"name": "@sourcegraph/scip-python", "version": "0.6.5"})
        )
        report = self.inspect()
        installed = next(
            row
            for row in report["checks"]
            if row["id"] == "package.scip_python.version"
        )
        locked = next(
            row
            for row in report["checks"]
            if row["id"] == "lock.npm.package.scip_python.integrity"
        )
        self.assertEqual(installed["status"], "FAIL")
        self.assertEqual(locked["status"], "PASS")

    def test_malformed_lock_returns_stable_fail_closed_report(self) -> None:
        self.fixture.toolchain_lock.write_text(
            '{"schema_version":2}\n', encoding="utf-8"
        )
        first = self.inspect()
        second = self.inspect()
        self.assertEqual(first, second)
        self.assertEqual(first["status"], "FAIL")
        self.assertEqual(
            first["checks"],
            [
                {
                    "id": "lock.configuration",
                    "expected": "VALID",
                    "actual": "INVALID:ValueError",
                    "status": "FAIL",
                }
            ],
        )

    def test_repository_lock_schema_and_related_hashes_are_accepted(self) -> None:
        repository = Path(__file__).resolve().parents[2]
        report = inspect_environment(
            implementation_root=repository,
            lock_path=(
                repository
                / ".devcontainer"
                / "system-context-toolchain.lock.json"
            ),
            command_runner=self.fixture.command,
        )
        rows = {row["id"]: row for row in report["checks"]}
        self.assertNotIn("lock.configuration", rows)
        required = {
            "lock.python.sha256",
            "lock.python.pytest_version",
            "lock.npm.sha256",
            "lock.npm.lockfile_version",
            "lock.npm.package.typescript.version",
            "lock.npm.package.typescript.integrity",
            "lock.npm.package.scip_typescript.version",
            "lock.npm.package.scip_typescript.integrity",
            "lock.npm.package.scip_python.version",
            "lock.npm.package.scip_python.integrity",
            (
                "lock.npm.transitive."
                "sourcegraph_scip-typescript.typescript.version"
            ),
            (
                "lock.npm.transitive."
                "sourcegraph_scip-typescript.typescript.integrity"
            ),
        }
        self.assertEqual(
            {check_id for check_id in required if rows[check_id]["status"] != "PASS"},
            set(),
        )

    def test_dockerfile_literals_match_the_repository_toolchain_lock(self) -> None:
        repository = Path(__file__).resolve().parents[2]
        lock = json.loads(
            (
                repository
                / ".devcontainer"
                / "system-context-toolchain.lock.json"
            ).read_text(encoding="utf-8")
        )
        dockerfile = (repository / ".devcontainer" / "Dockerfile").read_text(
            encoding="utf-8"
        )
        expected_from = (
            "FROM --platform=linux/amd64 "
            f"python:{lock['python']['version']}-slim-bookworm@"
            f"{lock['python']['base_image']['platform_manifest_digest']}"
        )
        self.assertIn(expected_from, dockerfile)
        expected_arguments = {
            "NODE_VERSION": lock["node"]["version"],
            "NODE_ARCHIVE_SHA256": lock["node"]["archive"]["sha256"],
            "SCIP_VERSION": lock["scip_cli"]["version"],
            "SCIP_ARCHIVE_SHA256": lock["scip_cli"]["archive"]["sha256"],
            "DEBIAN_SNAPSHOT": lock["debian"]["snapshot"],
        }
        for key, value in expected_arguments.items():
            self.assertIn(f"ARG {key}={value}", dockerfile)
        self.assertEqual(
            lock["node"]["archive"]["url"],
            "https://nodejs.org/dist/"
            f"v{lock['node']['version']}/"
            f"node-v{lock['node']['version']}-linux-x64.tar.xz",
        )
        self.assertEqual(
            lock["scip_cli"]["archive"]["url"],
            "https://github.com/scip-code/scip/releases/download/"
            f"{lock['scip_cli']['version']}/scip-linux-amd64.tar.gz",
        )


if __name__ == "__main__":
    unittest.main()
