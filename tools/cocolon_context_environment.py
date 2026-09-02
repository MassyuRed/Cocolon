#!/usr/bin/env python3
"""Fail-closed verification for the fixed System Context toolchain.

The verifier intentionally uses only the Python standard library.  It does not
install, download, or repair anything: callers either receive one deterministic
PASS report or a typed error containing the deterministic FAIL report.
"""
from __future__ import annotations

import hashlib
import importlib.metadata
import json
import os
from pathlib import Path, PurePosixPath
import platform
import re
import shutil
import subprocess
from typing import Any, Callable, Mapping, Sequence


LOCK_SCHEMA_VERSION = 1
LOCK_SCOPE = "cocolon-system-context-v1"
REPORT_SCHEMA_VERSION = "cocolon.system_context.environment_report.v1"
DEFAULT_LOCK_RELATIVE_PATH = Path(
    ".devcontainer/system-context-toolchain.lock.json"
)
LOCK_PATH_ENVIRONMENT_VARIABLE = "COCOLON_CONTEXT_TOOLCHAIN_LOCK"
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
OCI_DIGEST_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
VERSION_RE = re.compile(r"(?<![0-9])v?(\d+\.\d+\.\d+)(?![0-9])")
NPM_PACKAGE_RE = re.compile(
    r"^(?:@[a-z0-9][a-z0-9._-]*/)?[a-z0-9][a-z0-9._-]*$"
)
COMMAND_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._+-]*$")
PACKAGE_KEYS = ("typescript", "scip_typescript", "scip_python")

CommandRunner = Callable[[Sequence[str]], tuple[int, str, str]]


class EnvironmentVerificationError(RuntimeError):
    """The fixed environment is absent, malformed, or does not match its lock."""

    def __init__(self, report: Mapping[str, Any]):
        self.report = dict(report)
        failed = [
            str(row.get("id"))
            for row in report.get("checks", [])
            if isinstance(row, Mapping) and row.get("status") != "PASS"
        ]
        suffix = ",".join(failed) if failed else "lock"
        super().__init__(f"fixed System Context environment verification failed: {suffix}")


def canonical_json_bytes(value: Any) -> bytes:
    """Serialize a report or fingerprint input in one platform-neutral form."""

    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        + "\n"
    ).encode("utf-8")


def _sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _default_command_runner(command: Sequence[str]) -> tuple[int, str, str]:
    try:
        process = subprocess.run(
            list(command),
            check=False,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=30,
        )
    except (FileNotFoundError, PermissionError, subprocess.TimeoutExpired):
        return 127, "", ""
    return process.returncode, process.stdout, process.stderr


def _mapping(value: Any, field: str) -> Mapping[str, Any]:
    if not isinstance(value, Mapping):
        raise ValueError(f"{field} must be an object")
    return value


def _string(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value:
        raise ValueError(f"{field} must be a non-empty string")
    return value


def _sha256(value: Any, field: str) -> str:
    result = _string(value, field)
    if not SHA256_RE.fullmatch(result):
        raise ValueError(f"{field} must be a lowercase SHA-256")
    return result


def _safe_relative_path(value: Any, field: str) -> Path:
    text = _string(value, field)
    pure = PurePosixPath(text)
    if pure.is_absolute() or not pure.parts or ".." in pure.parts or "." in pure.parts:
        raise ValueError(f"{field} must be a normalized repository-relative path")
    if "\\" in text:
        raise ValueError(f"{field} must use POSIX separators")
    return Path(*pure.parts)


def _npm_package(value: Any, field: str) -> str:
    result = _string(value, field)
    if not NPM_PACKAGE_RE.fullmatch(result):
        raise ValueError(f"{field} must be a normalized npm package name")
    return result


def _command_name(value: Any, field: str) -> str:
    result = _string(value, field)
    if not COMMAND_NAME_RE.fullmatch(result):
        raise ValueError(f"{field} must be a command basename")
    return result


def _normalize_architecture(value: str) -> str:
    normalized = value.strip().lower()
    aliases = {
        "x86_64": "amd64",
        "x64": "amd64",
        "aarch64": "arm64",
    }
    return aliases.get(normalized, normalized)


def _extract_version(output: str, *, prefix: str = "") -> str:
    match = VERSION_RE.search(output.strip())
    if match is None:
        return "UNAVAILABLE"
    version = match.group(1)
    return prefix + version


def _command_version(
    runner: CommandRunner,
    command: Sequence[str],
    *,
    prefix: str = "",
) -> str:
    returncode, stdout, stderr = runner(command)
    if returncode != 0:
        return "UNAVAILABLE"
    return _extract_version(stdout or stderr, prefix=prefix)


def _check(check_id: str, expected: Any, actual: Any) -> dict[str, Any]:
    return {
        "id": check_id,
        "expected": expected,
        "actual": actual,
        "status": "PASS" if actual == expected else "FAIL",
    }


def _unavailable(check_id: str, expected: Any) -> dict[str, Any]:
    return _check(check_id, expected, "UNAVAILABLE")


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _package_version_at(path: Path) -> str:
    try:
        document = _load_json(path)
    except (OSError, UnicodeError, json.JSONDecodeError):
        return "UNAVAILABLE"
    version = document.get("version") if isinstance(document, Mapping) else None
    return version if isinstance(version, str) and version else "UNAVAILABLE"


def _installed_package_version(install_root: Path, package: str) -> str:
    path = install_root / "node_modules" / Path(*package.split("/")) / "package.json"
    return _package_version_at(path)


def _installed_transitive_version(
    install_root: Path,
    parent: str,
    package: str,
) -> str:
    path = (
        install_root
        / "node_modules"
        / Path(*parent.split("/"))
        / "node_modules"
        / Path(*package.split("/"))
        / "package.json"
    )
    return _package_version_at(path)


def _pytest_version() -> str:
    try:
        return importlib.metadata.version("pytest")
    except importlib.metadata.PackageNotFoundError:
        return "UNAVAILABLE"


def _pytest_version_from_lock(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError):
        return "UNAVAILABLE"
    match = re.search(
        r"(?im)^\s*pytest\s*==\s*([A-Za-z0-9][A-Za-z0-9._+-]*)\s*(?:\\|$)",
        text,
    )
    return match.group(1) if match is not None else "UNAVAILABLE"


def _package_lock_row(document: Any, package: str) -> Mapping[str, Any]:
    if not isinstance(document, Mapping):
        return {}
    packages = document.get("packages")
    if not isinstance(packages, Mapping):
        return {}
    row = packages.get(f"node_modules/{package}")
    return row if isinstance(row, Mapping) else {}


def _package_lock_transitive_row(
    document: Any,
    parent: str,
    package: str,
) -> Mapping[str, Any]:
    if not isinstance(document, Mapping):
        return {}
    packages = document.get("packages")
    if not isinstance(packages, Mapping):
        return {}
    row = packages.get(f"node_modules/{parent}/node_modules/{package}")
    return row if isinstance(row, Mapping) else {}


def _bin_is_executable(install_root: Path, name: str) -> bool:
    target = install_root / "node_modules" / ".bin" / name
    return target.is_file() and os.access(target, os.X_OK)


def _configured_lock(lock_path: Path) -> tuple[Mapping[str, Any], str]:
    raw = lock_path.read_bytes()
    document = json.loads(raw.decode("utf-8"))
    if not isinstance(document, Mapping):
        raise ValueError("toolchain lock must be an object")
    if (
        type(document.get("schema_version")) is not int
        or document.get("schema_version") != LOCK_SCHEMA_VERSION
    ):
        raise ValueError(
            f"schema_version must equal {LOCK_SCHEMA_VERSION}"
        )
    if document.get("scope") != LOCK_SCOPE:
        raise ValueError(f"scope must equal {LOCK_SCOPE}")
    return document, _sha256_bytes(raw)


def inspect_environment(
    *,
    implementation_root: Path | None = None,
    lock_path: Path | None = None,
    command_runner: CommandRunner | None = None,
) -> dict[str, Any]:
    """Return a deterministic PASS/FAIL report without mutating the environment."""

    root = (
        implementation_root.resolve()
        if implementation_root is not None
        else Path(__file__).resolve().parents[1]
    )
    configured_lock = os.environ.get(LOCK_PATH_ENVIRONMENT_VARIABLE)
    selected_lock = (
        lock_path.resolve()
        if lock_path is not None
        else (
            Path(configured_lock).resolve()
            if configured_lock
            else root / DEFAULT_LOCK_RELATIVE_PATH
        )
    )
    runner = command_runner or _default_command_runner
    checks: list[dict[str, Any]] = []

    try:
        repository_lock = root / DEFAULT_LOCK_RELATIVE_PATH
        if (
            lock_path is None
            and configured_lock
            and selected_lock != repository_lock.resolve()
            and selected_lock.read_bytes() != repository_lock.read_bytes()
        ):
            raise ValueError(
                "configured toolchain lock differs from repository exact lock"
            )
        lock, lock_sha256 = _configured_lock(selected_lock)
        platform_lock = _mapping(lock.get("platform"), "platform")
        python_lock = _mapping(lock.get("python"), "python")
        base_image = _mapping(python_lock.get("base_image"), "python.base_image")
        test_lock = _mapping(python_lock.get("test_lock"), "python.test_lock")
        node_lock = _mapping(lock.get("node"), "node")
        node_archive = _mapping(node_lock.get("archive"), "node.archive")
        scip_lock = _mapping(lock.get("scip_cli"), "scip_cli")
        scip_archive = _mapping(scip_lock.get("archive"), "scip_cli.archive")
        npm_lock = _mapping(lock.get("npm_toolchain"), "npm_toolchain")
        npm_lockfile = _mapping(npm_lock.get("lock"), "npm_toolchain.lock")
        package_locks = _mapping(npm_lock.get("packages"), "npm_toolchain.packages")

        expected_os = _string(platform_lock.get("os"), "platform.os").lower()
        expected_arch = _normalize_architecture(
            _string(platform_lock.get("architecture"), "platform.architecture")
        )
        expected_python_implementation = _string(
            python_lock.get("implementation"), "python.implementation"
        )
        expected_python = _string(python_lock.get("version"), "python.version")
        _string(base_image.get("reference"), "python.base_image.reference")
        if not OCI_DIGEST_RE.fullmatch(
            _string(base_image.get("index_digest"), "python.base_image.index_digest")
        ):
            raise ValueError("python.base_image.index_digest must be an OCI digest")
        if not OCI_DIGEST_RE.fullmatch(
            _string(
                base_image.get("platform_manifest_digest"),
                "python.base_image.platform_manifest_digest",
            )
        ):
            raise ValueError(
                "python.base_image.platform_manifest_digest must be an OCI digest"
            )

        python_lock_path = _safe_relative_path(
            test_lock.get("path"), "python.test_lock.path"
        )
        expected_python_lock_sha = _sha256(
            test_lock.get("sha256"), "python.test_lock.sha256"
        )
        expected_pytest = _string(
            test_lock.get("pytest_version"), "python.test_lock.pytest_version"
        )
        expected_node = _string(node_lock.get("version"), "node.version")
        expected_npm = _string(node_lock.get("npm_version"), "node.npm_version")
        _string(node_archive.get("url"), "node.archive.url")
        _sha256(node_archive.get("sha256"), "node.archive.sha256")
        expected_scip = _string(scip_lock.get("version"), "scip_cli.version")
        _string(scip_archive.get("url"), "scip_cli.archive.url")
        _sha256(scip_archive.get("sha256"), "scip_cli.archive.sha256")

        install_root = Path(
            _string(npm_lock.get("install_root"), "npm_toolchain.install_root")
        )
        if not install_root.is_absolute():
            raise ValueError("npm_toolchain.install_root must be absolute")
        npm_lock_path = _safe_relative_path(
            npm_lockfile.get("path"), "npm_toolchain.lock.path"
        )
        expected_npm_lock_sha = _sha256(
            npm_lockfile.get("sha256"), "npm_toolchain.lock.sha256"
        )
        expected_lockfile_version = npm_lockfile.get("lockfile_version")
        if type(expected_lockfile_version) is not int:
            raise ValueError("npm_toolchain.lock.lockfile_version must be an integer")

        package_configuration: dict[str, dict[str, str]] = {}
        for key in PACKAGE_KEYS:
            configured = _mapping(package_locks.get(key), f"npm_toolchain.packages.{key}")
            package_name = _npm_package(
                configured.get("package"),
                f"npm_toolchain.packages.{key}.package",
            )
            package_configuration[key] = {
                "package": package_name,
                "version": _string(
                    configured.get("version"),
                    f"npm_toolchain.packages.{key}.version",
                ),
                "integrity": _string(
                    configured.get("integrity"),
                    f"npm_toolchain.packages.{key}.integrity",
                ),
                "bin": _command_name(
                    configured.get("bin"),
                    f"npm_toolchain.packages.{key}.bin",
                ),
            }

        resolved_transitives = _mapping(
            npm_lock.get("resolved_transitives", {}),
            "npm_toolchain.resolved_transitives",
        )
        transitive_configuration: dict[str, dict[str, str]] = {}
        for relation, raw_configuration in sorted(resolved_transitives.items()):
            if not isinstance(relation, str) or relation.count(">") != 1:
                raise ValueError(
                    "npm_toolchain.resolved_transitives keys must be PARENT>PACKAGE"
                )
            parent_name, child_name = relation.split(">", 1)
            parent = _npm_package(
                parent_name,
                f"npm_toolchain.resolved_transitives.{relation}.parent",
            )
            package = _npm_package(
                child_name,
                f"npm_toolchain.resolved_transitives.{relation}.package",
            )
            configured = _mapping(
                raw_configuration,
                f"npm_toolchain.resolved_transitives.{relation}",
            )
            transitive_configuration[relation] = {
                "parent": parent,
                "package": package,
                "version": _string(
                    configured.get("version"),
                    f"npm_toolchain.resolved_transitives.{relation}.version",
                ),
                "integrity": _string(
                    configured.get("integrity"),
                    f"npm_toolchain.resolved_transitives.{relation}.integrity",
                ),
            }

        commands = lock.get("required_commands")
        if not isinstance(commands, list) or not commands or not all(
            isinstance(value, str) and COMMAND_NAME_RE.fullmatch(value)
            for value in commands
        ):
            raise ValueError("required_commands must be a non-empty command array")
        if len(commands) != len(set(commands)):
            raise ValueError("required_commands must not contain duplicates")
    except (OSError, UnicodeError, json.JSONDecodeError, TypeError, ValueError) as exc:
        checks.append(
            _check("lock.configuration", "VALID", f"INVALID:{type(exc).__name__}")
        )
        return _finalize_report("UNAVAILABLE", checks)

    checks.extend(
        (
            _check("platform.os", expected_os, platform.system().strip().lower()),
            _check(
                "platform.architecture",
                expected_arch,
                _normalize_architecture(platform.machine()),
            ),
            _check(
                "python.implementation",
                expected_python_implementation,
                platform.python_implementation(),
            ),
            _check("python.version", expected_python, platform.python_version()),
            _check(
                "lock.python.sha256",
                expected_python_lock_sha,
                _file_sha_or_unavailable(root / python_lock_path),
            ),
            _check(
                "lock.npm.sha256",
                expected_npm_lock_sha,
                _file_sha_or_unavailable(root / npm_lock_path),
            ),
            _check(
                "node.version",
                f"v{expected_node}",
                _command_version(runner, ("node", "--version"), prefix="v"),
            ),
            _check(
                "npm.version",
                expected_npm,
                _command_version(runner, ("npm", "--version")),
            ),
            _check(
                "node.module_path",
                str(install_root / "node_modules"),
                os.environ.get("NODE_PATH", "UNAVAILABLE"),
            ),
            _check(
                "scip_cli.version",
                expected_scip,
                _command_version(runner, ("scip", "--version"), prefix="v"),
            ),
        )
    )

    try:
        package_lock_document = _load_json(root / npm_lock_path)
    except (OSError, UnicodeError, json.JSONDecodeError):
        package_lock_document = {}
    lockfile_actual = (
        package_lock_document.get("lockfileVersion")
        if isinstance(package_lock_document, Mapping)
        else None
    )
    checks.append(
        _check(
            "lock.npm.lockfile_version",
            expected_lockfile_version,
            lockfile_actual if type(lockfile_actual) is int else "UNAVAILABLE",
        )
    )

    for key in PACKAGE_KEYS:
        configured = package_configuration[key]
        package_name = configured["package"]
        package_row = _package_lock_row(package_lock_document, package_name)
        checks.extend(
            (
                _check(
                    f"lock.npm.package.{key}.version",
                    configured["version"],
                    package_row.get("version", "UNAVAILABLE"),
                ),
                _check(
                    f"lock.npm.package.{key}.integrity",
                    configured["integrity"],
                    package_row.get("integrity", "UNAVAILABLE"),
                ),
                _check(
                    f"package.{key}.version",
                    configured["version"],
                    _installed_package_version(install_root, package_name),
                ),
                _check(
                    f"package.{key}.bin",
                    "EXECUTABLE",
                    (
                        "EXECUTABLE"
                        if _bin_is_executable(install_root, configured["bin"])
                        else "UNAVAILABLE"
                    ),
                ),
            )
        )

    for relation in sorted(transitive_configuration):
        configured = transitive_configuration[relation]
        package_row = _package_lock_transitive_row(
            package_lock_document,
            configured["parent"],
            configured["package"],
        )
        check_name = relation.replace("@", "").replace("/", "_").replace(">", ".")
        checks.extend(
            (
                _check(
                    f"lock.npm.transitive.{check_name}.version",
                    configured["version"],
                    package_row.get("version", "UNAVAILABLE"),
                ),
                _check(
                    f"lock.npm.transitive.{check_name}.integrity",
                    configured["integrity"],
                    package_row.get("integrity", "UNAVAILABLE"),
                ),
                _check(
                    f"package.transitive.{check_name}.version",
                    configured["version"],
                    _installed_transitive_version(
                        install_root,
                        configured["parent"],
                        configured["package"],
                    ),
                ),
            )
        )

    typescript = package_configuration["typescript"]
    checks.append(
        _check(
            "typescript.version",
            typescript["version"],
            _command_version(
                runner,
                (
                    str(install_root / "node_modules" / ".bin" / typescript["bin"]),
                    "--version",
                ),
            ),
        )
    )

    for key in ("scip_typescript", "scip_python"):
        configured = package_configuration[key]
        checks.append(
            _check(
                f"{key}.version",
                configured["version"],
                _command_version(
                    runner,
                    (
                        str(
                            install_root
                            / "node_modules"
                            / ".bin"
                            / configured["bin"]
                        ),
                        "--version",
                    ),
                ),
            )
        )

    locked_pytest = _pytest_version_from_lock(root / python_lock_path)
    checks.extend(
        (
            _check(
                "lock.python.pytest_version",
                expected_pytest,
                locked_pytest,
            ),
            _check("pytest.version", expected_pytest, _pytest_version()),
        )
    )

    for command in commands:
        checks.append(
            _check(
                f"system_command.{command}",
                "AVAILABLE",
                "AVAILABLE" if shutil.which(command) else "UNAVAILABLE",
            )
        )

    return _finalize_report(lock_sha256, checks)


def _file_sha_or_unavailable(path: Path) -> str:
    try:
        return _sha256_file(path)
    except OSError:
        return "UNAVAILABLE"


def _finalize_report(lock_sha256: str, checks: Sequence[Mapping[str, Any]]) -> dict[str, Any]:
    rows = [dict(row) for row in checks]
    payload: dict[str, Any] = {
        "schema_version": REPORT_SCHEMA_VERSION,
        "status": "PASS" if rows and all(row["status"] == "PASS" for row in rows) else "FAIL",
        "lock": {
            "path": DEFAULT_LOCK_RELATIVE_PATH.as_posix(),
            "sha256": lock_sha256,
        },
        "checks": rows,
    }
    payload["environment_fingerprint"] = _sha256_bytes(canonical_json_bytes(payload))
    return payload


def verify_environment(
    *,
    implementation_root: Path | None = None,
    lock_path: Path | None = None,
    command_runner: CommandRunner | None = None,
) -> dict[str, Any]:
    """Return a PASS report or raise :class:`EnvironmentVerificationError`."""

    report = inspect_environment(
        implementation_root=implementation_root,
        lock_path=lock_path,
        command_runner=command_runner,
    )
    if report["status"] != "PASS":
        raise EnvironmentVerificationError(report)
    return report


__all__ = (
    "DEFAULT_LOCK_RELATIVE_PATH",
    "EnvironmentVerificationError",
    "LOCK_PATH_ENVIRONMENT_VARIABLE",
    "LOCK_SCHEMA_VERSION",
    "LOCK_SCOPE",
    "REPORT_SCHEMA_VERSION",
    "canonical_json_bytes",
    "inspect_environment",
    "verify_environment",
)
