"""Task Context Compiler for Cocolon System Context Step 4.

The compiler is deterministic, stdlib-only, and fail-closed.  It binds Step 1,
Step 2, and Step 3 manifests, expands a task graph to a fixed point, preserves
unresolved context, and emits a full-text read order plus an actual CMEE review.

It does **not** change product behavior and it never awards product-quality
credit.  A local run cannot make the Step 4 completion claim; remote byte
verification remains a separate, durable GitHub checkpoint.
"""
from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass
from functools import lru_cache
import csv
import fnmatch
import hashlib
import json
import math
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tempfile
from typing import Any, Iterable, Iterator, Mapping, Sequence
import unicodedata


SCHEMA_VERSION = "cocolon.system_context.task_context_manifest.v1"
PUBLICATION_TRANSPORT_SCHEMA = "cocolon.system_context.publication_transport.v1"
PUBLICATION_TRANSPORT_NAME = "publication_transport.json"
GENERATED_CONTEXT_PREFIX = "Cocolon_前提資料/system_context/current/"
PROFILE_SCHEMA_VERSION_V1 = "cocolon.system_context.task_profiles.v1"
PROFILE_SCHEMA_VERSION = "cocolon.system_context.task_profiles.v2"
OUTPUT_NAMES = (
    "selected_files.jsonl",
    "closure_edges.jsonl",
    "required_category_coverage.json",
    "unresolved_context.jsonl",
    "full_text_read_order.md",
    "cmee_context_overview.md",
    "cmee_unincorporated_actual_findings.md",
)
UNIT_A_MANIFEST_KEYS = frozenset(
    {
        "schema_version",
        "workspace",
        "task",
        "status",
        "completion_claim",
        "context_fingerprint",
        "workspace_exact_refs",
        "input_sha256",
        "selected_file_count",
        "closure_edge_count",
        "blocking_unresolved_count",
        "actual_unincorporated_finding_count",
        "required_category_coverage",
        "completion_gates",
        "output_sha256",
        "product_credit",
        "automatic_progression",
        "unit_a_premise_management",
    }
)
UNIT_A_INPUT_SHA_KEYS = frozenset(
    {
        "step1_manifest",
        "step1_files",
        "step2_manifest",
        "step3_manifest",
        "publication_transport",
        "workspace_profiles",
        "task_profile",
        "manual_overlay",
        "owner_bundle",
        "unit_a_model",
    }
)
UNIT_A_COMPLETION_GATE_KEYS = frozenset(
    {
        "required_category_exact10_recovered",
        "required_category_exact10_all_pass",
        "full_text_read_order_generated",
        "selected_file_identity_verified",
        "unresolved_visible",
        "actual_unincorporated_finding_extracted",
        "finding_used_for_cmee_review",
        "generated_output_remote_hash_verified",
        "operator_v1_activation_approved",
    }
)
UNIT_A_MODEL_KEYS = frozenset(
    {
        "schema_version",
        "status",
        "publication_mode",
        "task_orientation",
        "owner_access_mode",
        "workspace_incorporation_claim",
        "merge_required",
        "rebase_required",
        "integration_required",
        "write_authority",
        "owners",
        "premises",
        "responsibilities",
        "conflicts",
        "bindings_by_identity",
        "blocking_codes",
        "completion_claim",
        "v1_activation",
        "product_credit",
        "technical_credit",
        "automatic_progression",
        "required_premise_count",
        "required_premise_resolved_count",
        "responsibility_count",
        "conflict_count",
    }
)
UNIT_A_PUBLIC_OWNER_KEYS = frozenset(
    {
        "owner_id",
        "responsibility",
        "repository_key",
        "repository",
        "remote_ref",
        "public_pr_number_or_locator",
        "required",
        "access_mode",
        "workspace_material_commit",
        "first_resolved_head",
        "fetched_namespace_head",
        "pre_publish_resolved_head",
        "relation",
        "merge_base",
        "owner_side_unique_commit_count",
        "workspace_side_unique_commit_count",
        "owner_side_changes",
        "workspace_side_changes",
        "owner_side_changed_paths",
        "workspace_side_changed_paths",
        "claim_boundary",
        "assertion_provenance",
        "source_locator",
        "workspace_incorporation_claim",
        "write_authority",
        "merge_required",
        "rebase_required",
        "integration_required",
    }
)
UNIT_A_PREMISE_ALLOWED_KEYS = frozenset(
    {
        "premise_id",
        "responsibility",
        "repository_key",
        "path",
        "owner_id",
        "required",
        "entry_chain_order",
        "read_tier",
        "expected_identity_policy",
        "resolved_commit",
        "resolved_blob_sha",
        "selected",
        "fresh",
        "read_target_status",
        "owner_read_order",
        "workspace_record_identity",
        "workspace_inventory_source_commit",
        "workspace_blob_sha",
        "workspace_blob_matches_owner",
        "workspace_selection_status",
        "status",
        "reason_code",
        "assertion_provenance",
        "required_roles",
        "source_locator",
        "metadata",
    }
)
UNIT_A_PREMISE_REQUIRED_KEYS = frozenset(
    {
        "premise_id",
        "responsibility",
        "repository_key",
        "path",
        "owner_id",
        "required",
        "entry_chain_order",
        "read_tier",
        "selected",
        "fresh",
        "read_target_status",
        "status",
        "reason_code",
        "assertion_provenance",
        "source_locator",
    }
)
UNIT_A_RESPONSIBILITY_KEYS = frozenset(
    {
        "responsibility_id",
        "subject_locator",
        "responsibility_kind",
        "lifecycle",
        "publication_state",
        "authority_kind",
        "effective_condition",
        "supersedes",
        "superseded_by",
        "metadata_assertions",
        "assertion_provenance",
        "source_locator",
        "workspace_subject_identity",
        "workspace_inventory_source_commit",
        "resolved_owner_commit",
        "resolved_owner_blob_sha",
        "workspace_blob_matches_owner",
        "metadata",
        "authority_role_declared",
        "effective_authority_claim",
        "authority_claim_boundary",
    }
)
UNIT_A_CONFLICT_REQUIRED_KEYS = frozenset(
    {
        "conflict_id",
        "reason_code",
        "candidate_responsibility_ids",
        "resolution",
        "handback_owner",
        "blocking",
    }
)
UNIT_A_CONFLICT_ALLOWED_KEYS = UNIT_A_CONFLICT_REQUIRED_KEYS | frozenset(
    {
        "repository_key",
        "path",
        "responsibility_id",
        "metadata_kind",
        "metadata_key",
        "owner_only_paths",
        "legacy_only_paths",
    }
)
UNIT_A_SELECTED_ROW_KEYS = frozenset(
    {
        "identity",
        "repository_key",
        "path",
        "source_commit",
        "blob_sha",
        "content_sha256",
        "size_bytes",
        "inventory_classification",
        "evidence_kind",
        "read_classification",
        "graph_distance",
        "selection_reasons",
        "classification_provenance",
        "authority_claim",
        "responsibility_ids",
        "conflict_ids",
        "selection_tier",
        "non_proof_boundaries",
    }
)
CLASSIFICATIONS = (
    "MUST_READ_FULL",
    "REFERENCE_AS_NEEDED",
    "CURRENT_OWNER",
    "RELEVANT_HISTORICAL",
    "UNRESOLVED_CONTEXT",
)
CLASSIFICATION_PRIORITY = {
    "CURRENT_OWNER": 0,
    "MUST_READ_FULL": 1,
    "RELEVANT_HISTORICAL": 2,
    "REFERENCE_AS_NEEDED": 3,
    "UNRESOLVED_CONTEXT": 4,
}
PATH_KEYS = (
    "path",
    "repo_path",
    "file_path",
    "source_path",
    "target_path",
    "from_path",
    "to_path",
    "owner_path",
    "test_path",
    "contract_path",
    "consumer_path",
    "provider_path",
    "caller_path",
    "callee_path",
    "rn_path",
    "api_path",
    "backend_path",
    "resolved_path",
    "resolved_target_path",
    "definition_path",
    "source_file",
    "target_file",
)
REPOSITORY_KEYS = (
    "repository_key",
    "workspace_repository_key",
    "repo_key",
    "repository",
    "repo",
    "resolved_repository_key",
)
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
GIT_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
SOURCE_SUFFIXES = {
    ".py", ".pyi", ".ts", ".tsx", ".js", ".jsx", ".dart", ".java",
    ".kt", ".kts", ".go", ".rs", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".swift", ".rb", ".php", ".scala", ".sh",
}
SAFE_PUBLIC_ID_RE = re.compile(r"^[A-Z][A-Z0-9_.:-]{0,127}$")
SAFE_REPOSITORY_KEY_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
SAFE_GIT_REF_RE = re.compile(r"^refs/heads/[A-Za-z0-9][A-Za-z0-9._/-]{0,239}$")
UNIT_A_WORKSPACE_REF_REQUIRED_KEYS = frozenset({"source_commit"})
UNIT_A_WORKSPACE_REF_ALLOWED_KEYS = frozenset(
    {"source_commit", "source_tree", "tracked_entry_count"}
)
METADATA_ALLOWLIST = frozenset(
    {
        "doc_id",
        "document_id",
        "document_role",
        "normative_status",
        "status",
        "lifecycle",
        "effective_when",
        "publication_state",
        "decision_owner",
        "operational_owner",
        "technical_owner",
        "design_authority",
        "implementation_authority",
        "technical_authority",
        "supersedes",
        "superseded_by",
        "automatic_progression",
    }
)
BOOLEAN_METADATA_KEYS = frozenset(
    {
        "design_authority",
        "implementation_authority",
        "technical_authority",
        "automatic_progression",
    }
)
RESPONSIBILITY_KINDS = frozenset(
    {
        "PRODUCT_PURPOSE_OWNER",
        "CURRENT_STRUCTURE_OWNER",
        "DETAILED_DESIGN_OWNER",
        "CURRENT_ACTUAL_SOURCE_OWNER",
        "PROTECTED_TEST_OR_CONTRACT_OWNER",
        "NAVIGATION_OWNER",
        "HISTORICAL_PREDECESSOR",
    }
)
AUTHORITY_KINDS = frozenset(
    {
        "NORMATIVE_AUTHORITY",
        "DESIGN_AUTHORITY",
        "ACTUAL_SOURCE_AUTHORITY",
        "TEST_CONTRACT_AUTHORITY",
        "NAVIGATION_AUTHORITY",
        "REVIEWED_NONAUTHORITY",
        "NO_AUTHORITY_CLAIM",
        "UNRESOLVED",
    }
)
LIFECYCLES = frozenset(
    {
        "CURRENT",
        "DRAFT",
        "DESIGN_ONLY",
        "IMPLEMENTED_DISABLED",
        "ACTIVE_ACTUAL",
        "HISTORICAL",
        "SUPERSEDED",
        "OTHER_WORKSPACE",
        "PRIVATE_LOCATOR_ONLY",
        "UNRESOLVED",
    }
)
SELECTION_TIERS = frozenset(
    {
        "DECISION_SURFACE",
        "MUST_READ_FULL",
        "REFERENCE_ON_TRIGGER",
        "EXCLUDED_WITH_REASON",
        "UNRESOLVED_IMPACT",
    }
)
EXPECTED_IDENTITY_POLICIES = frozenset(
    {
        "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF",
        "FIXED_PUBLIC_COMMIT_BLOB_IDENTITY",
    }
)
ASSERTION_PROVENANCE = frozenset(
    {
        "MACHINE_DISCOVERED",
        "MACHINE_VERIFIED",
        "MANUAL_PROFILE_ASSERTION",
        "OPERATOR_SUPPLIED_CONCLUSION",
        "MASH_EXPLICIT_DECISION",
        "KAREN_PROPOSAL_NOT_MASH_DECISION",
        "EXTERNAL_ASSET_VERIFIED",
        "UNRESOLVED",
    }
)
OPERATOR_CONTRACT_ALLOWED_KEYS = frozenset(
    {
        "canonical_owner_refs",
        "required_premises",
        "document_responsibilities",
        "claim_nodes",
        "connections",
        "scope_rules",
        "external_locators",
        "role_views",
        "collaboration",
        "actual_use_feedback",
    }
)
OPERATOR_CONTRACT_UNIT_A_KEYS = frozenset(
    {"canonical_owner_refs", "required_premises", "document_responsibilities"}
)
V2_DOCUMENT_KEYS = frozenset(
    {"schema_version", "persistent_primary_task", "tasks"}
)
V2_TASK_PROFILE_KEYS = frozenset(
    {
        "publication_mode",
        "task_orientation",
        "domains",
        "seed_rules",
        "current_owner_rules",
        "historical_rules",
        "required_categories",
        "required_category_exact",
        "operator_contract",
    }
)
CANONICAL_OWNER_RELATIONS = frozenset(
    {
        "SAME_REF",
        "WORKSPACE_CONTAINS_OWNER_REF",
        "OWNER_REF_AHEAD",
        "DIVERGED",
        "REMOTE_UNRESOLVED",
    }
)
BUNDLE_TOP_LEVEL_KEYS = frozenset(
    {
        "schema_version",
        "workspace",
        "task",
        "phase",
        "owners",
        "premises",
        "responsibility_subjects",
        "blocking_codes",
        "workspace_incorporation_claim",
        "write_authority",
        "integration_required",
        "automatic_progression",
        "task_dependency_fingerprint",
    }
)
BUNDLE_OWNER_COMMON_KEYS = frozenset(
    {
        "owner_id",
        "repository_key",
        "repository",
        "canonical_url",
        "ref",
        "required",
        "access_mode",
        "workspace_material_commit",
        "first_resolved_head",
        "fetched_namespace_head",
        "pre_publish_resolved_head",
        "relation",
        "owner_side_unique_commit_count",
        "workspace_side_unique_commit_count",
        "owner_side_changes",
        "workspace_side_changes",
        "owner_side_changed_paths",
        "workspace_side_changed_paths",
        "workspace_incorporation_claim",
        "write_authority",
        "merge_required",
        "rebase_required",
        "integration_required",
    }
)
BUNDLE_RESOLVED_OWNER_KEYS = BUNDLE_OWNER_COMMON_KEYS | frozenset(
    {"namespace", "merge_base"}
)
BUNDLE_UNRESOLVED_OWNER_KEYS = BUNDLE_OWNER_COMMON_KEYS | frozenset(
    {"reason_code"}
)
BUNDLE_PREMISE_COMMON_KEYS = frozenset(
    {
        "premise_id",
        "owner_id",
        "repository_key",
        "path",
        "required",
        "entry_chain_order",
        "expected_identity_policy",
        "status",
        "reason_code",
        "fresh",
        "selected",
    }
)
BUNDLE_RESOLVED_PREMISE_KEYS = BUNDLE_PREMISE_COMMON_KEYS | frozenset(
    {"resolved_commit", "resolved_blob_sha", "metadata"}
)
BUNDLE_UNRESOLVED_OWNER_PREMISE_KEYS = BUNDLE_PREMISE_COMMON_KEYS
BUNDLE_UNRESOLVED_BLOB_PREMISE_KEYS = BUNDLE_PREMISE_COMMON_KEYS | frozenset(
    {"resolved_commit"}
)
BUNDLE_RESPONSIBILITY_SUBJECT_COMMON_KEYS = frozenset(
    {
        "responsibility_id",
        "owner_id",
        "repository_key",
        "path",
        "status",
        "reason_code",
        "fresh",
    }
)
BUNDLE_RESOLVED_RESPONSIBILITY_SUBJECT_KEYS = (
    BUNDLE_RESPONSIBILITY_SUBJECT_COMMON_KEYS
    | frozenset({"resolved_commit", "resolved_blob_sha", "metadata"})
)
BUNDLE_UNRESOLVED_OWNER_RESPONSIBILITY_SUBJECT_KEYS = (
    BUNDLE_RESPONSIBILITY_SUBJECT_COMMON_KEYS
)
BUNDLE_UNRESOLVED_BLOB_RESPONSIBILITY_SUBJECT_KEYS = (
    BUNDLE_RESPONSIBILITY_SUBJECT_COMMON_KEYS | frozenset({"resolved_commit"})
)
BUNDLE_CHANGE_KEYS = frozenset(
    {"git_status", "status", "old_path", "new_path"}
)
OWNER_ROW_KEYS = frozenset(
    {
        "owner_id",
        "responsibility",
        "repository_key",
        "remote_ref",
        "public_pr_number_or_locator",
        "required",
        "freshness_policy",
        "claim_boundary",
        "assertion_provenance",
        "source_locator",
    }
)
PREMISE_ROW_KEYS = frozenset(
    {
        "premise_id",
        "responsibility",
        "repository_key",
        "path",
        "owner_id",
        "required",
        "entry_chain_order",
        "read_tier",
        "expected_identity_policy",
        "expected_identity_locator_id",
        "required_roles",
        "assertion_provenance",
        "source_locator",
    }
)
RESPONSIBILITY_ROW_KEYS = frozenset(
    {
        "responsibility_id",
        "subject_locator",
        "responsibility_kind",
        "lifecycle",
        "publication_state",
        "authority_kind",
        "effective_condition",
        "supersedes",
        "superseded_by",
        "metadata_assertions",
        "assertion_provenance",
        "source_locator",
    }
)
PUBLIC_SOURCE_LOCATOR_KEYS = frozenset(
    {
        "locator_id",
        "location",
        "availability",
        "privacy",
        "canonicality",
        "repository_key",
        "owner_id",
        "remote_ref",
        "path",
        "section_locator",
    }
)
SELECTION_TIER_PRIORITY = {
    "UNRESOLVED_IMPACT": 0,
    "DECISION_SURFACE": 1,
    "MUST_READ_FULL": 2,
    "REFERENCE_ON_TRIGGER": 3,
    "EXCLUDED_WITH_REASON": 4,
}


class ContextCompileError(RuntimeError):
    """Fail-closed compilation or verification error."""


@dataclass(frozen=True)
class CompileResult:
    output_dir: Path
    context_fingerprint: str
    status: str
    selected_count: int
    unresolved_count: int
    actual_finding_count: int


@dataclass(frozen=True)
class FileRecord:
    identity: str
    repository_key: str
    path: str
    source_commit: str
    blob_sha: str
    content_sha256: str
    size_bytes: int | None
    inventory_classification: str
    raw: Mapping[str, Any]

    @property
    def key(self) -> tuple[str, str]:
        return (self.repository_key, self.path)

    @property
    def evidence_kind(self) -> str:
        lower = self.path.lower()
        suffix = PurePosixPath(lower).suffix
        if _is_test_path(lower):
            return "test"
        if "schema" in lower or "contract" in lower or suffix in {".jsonschema"}:
            return "contract"
        if "/current_structure/" in f"/{lower}" or "current_structure" in lower:
            return "current_structure"
        if any(token in lower for token in ("history", "historical", "archive", "deprecated")):
            return "historical"
        if suffix in SOURCE_SUFFIXES:
            return "source"
        if suffix in {".md", ".txt", ".rst", ".adoc"}:
            return "design"
        if suffix in {".json", ".yaml", ".yml", ".toml", ".ini"}:
            return "config"
        return self.inventory_classification or "other"


@dataclass(frozen=True)
class GraphEdge:
    edge_id: str
    edge_type: str
    source_identity: str
    target_identity: str
    origin_file: str
    origin_row: str


def _canonical_json_bytes(value: Any) -> bytes:
    return (
        json.dumps(
            value,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        + "\n"
    ).encode("utf-8")


def _pretty_json_bytes(value: Any) -> bytes:
    return (
        json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"
    ).encode("utf-8")


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _read_json(path: Path) -> Any:
    try:
        return _strict_json_loads(path.read_text(encoding="utf-8"), str(path))
    except FileNotFoundError as exc:
        raise ContextCompileError(f"required file is missing: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ContextCompileError(f"invalid JSON: {path}: {exc}") from exc


def _strict_json_loads(text: str, source: str = "JSON") -> Any:
    def reject_duplicate_pairs(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for key, value in pairs:
            if key in result:
                raise ContextCompileError(
                    f"duplicate JSON object key in {source}: {key!r}"
                )
            result[key] = value
        return result

    def reject_nonfinite(value: str) -> Any:
        raise ContextCompileError(
            f"non-finite JSON number in {source}: {value}"
        )

    def parse_finite_float(value: str) -> float:
        try:
            result = float(value)
        except (OverflowError, ValueError) as exc:
            raise ContextCompileError(
                f"invalid JSON floating-point number in {source}"
            ) from exc
        if not math.isfinite(result):
            raise ContextCompileError(
                f"non-finite JSON number in {source}: exponent overflow"
            )
        return result

    def parse_bounded_int(value: str) -> int:
        if len(value.lstrip("-")) > 128:
            raise ContextCompileError(
                f"JSON integer exceeds 128 digits in {source}"
            )
        try:
            return int(value)
        except (OverflowError, ValueError) as exc:
            raise ContextCompileError(
                f"invalid JSON integer in {source}"
            ) from exc

    return json.loads(
        text,
        object_pairs_hook=reject_duplicate_pairs,
        parse_constant=reject_nonfinite,
        parse_float=parse_finite_float,
        parse_int=parse_bounded_int,
    )


def _require_safe_public_id(value: Any, field: str) -> str:
    if type(value) is not str:
        raise ContextCompileError(f"unsafe or missing {field}")
    text = value
    if not SAFE_PUBLIC_ID_RE.fullmatch(text):
        raise ContextCompileError(f"unsafe or missing {field}")
    return text


def _require_safe_repository_key(value: Any, field: str) -> str:
    if type(value) is not str or not SAFE_REPOSITORY_KEY_RE.fullmatch(value):
        raise ContextCompileError(f"unsafe or missing {field}")
    _reject_sensitive_public_text(value)
    return value


def _require_safe_repo_path(value: Any, field: str) -> str:
    if type(value) is not str:
        raise ContextCompileError(f"unsafe {field}")
    text = value
    if (
        not text
        or "\\" in text
        or "\x00" in text
        or "//" in text
        or text.startswith("./")
        or text.endswith("/")
        or any(ord(char) < 32 or ord(char) == 127 for char in text)
        or unicodedata.normalize("NFC", text) != text
        or len(text.encode("utf-8")) > 1024
    ):
        raise ContextCompileError(f"unsafe {field}")
    path = PurePosixPath(text)
    if (
        path.is_absolute()
        or path.as_posix() != text
        or any(part in {"", ".", ".."} for part in path.parts)
    ):
        raise ContextCompileError(f"unsafe {field}")
    _reject_sensitive_public_text(text)
    return path.as_posix()


def _require_enum(value: Any, allowed: frozenset[str], field: str) -> str:
    if type(value) is not str:
        raise ContextCompileError(f"unsupported {field}")
    text = value
    if text not in allowed:
        raise ContextCompileError(f"unsupported {field}")
    return text


def _require_repository_key(value: Any, field: str) -> str:
    if type(value) is not str or not re.fullmatch(
        r"[A-Za-z0-9_.-]{1,128}", value
    ):
        raise ContextCompileError(f"unsafe {field}")
    return value


def _require_safe_git_ref(value: Any, field: str) -> str:
    if type(value) is not str or not SAFE_GIT_REF_RE.fullmatch(value):
        raise ContextCompileError(f"unsafe {field}")
    suffix = value.removeprefix("refs/heads/")
    components = suffix.split("/")
    if (
        ".." in value
        or "//" in value
        or "@{" in value
        or "\\" in value
        or value.endswith((".", "/"))
        or any(
            not component
            or component.startswith(".")
            or component.endswith(".lock")
            for component in components
        )
    ):
        raise ContextCompileError(f"unsafe {field}")
    return value


def _reject_sensitive_public_text(value: str) -> None:
    if (
        re.search(
            r"(?i)(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+"
            r"@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![A-Za-z0-9.-])",
            value,
        )
        or re.search(
            r"(?i)(?:\b(?:sk|pk)_(?:live|test)_[A-Za-z0-9_-]{8,}\b"
            r"|\bgh[pousr]_[A-Za-z0-9]{20,}\b"
            r"|\bgithub_pat_[A-Za-z0-9_]{20,}\b"
            r"|\bxox[baprs]-[A-Za-z0-9-]{10,}\b"
            r"|\bAKIA[0-9A-Z]{16}\b"
            r"|-----BEGIN [A-Z ]*PRIVATE KEY-----"
            r"|\bBearer\s+[A-Za-z0-9._~-]{10,})",
            value,
        )
        or re.search(
            r"(?i)[?&](?:token|access_token|sig|signature|secret|key|credential)=",
            value,
        )
    ):
        raise ContextCompileError("sensitive public metadata value")


def _reject_sensitive_public_projection(value: Any, *, depth: int = 0) -> None:
    """Scan every public string, including values not interpreted as metadata."""
    if depth > 32:
        raise ContextCompileError("public projection nesting exceeds limit")
    if isinstance(value, str):
        if len(value.encode("utf-8")) > 4096:
            raise ContextCompileError("public projection string exceeds limit")
        _reject_sensitive_public_text(value)
        return
    if isinstance(value, Mapping):
        if len(value) > 4096:
            raise ContextCompileError("public projection object exceeds limit")
        for key, nested in value.items():
            if type(key) is not str:
                raise ContextCompileError("public projection key is invalid")
            _reject_sensitive_public_text(key)
            _reject_sensitive_public_projection(nested, depth=depth + 1)
        return
    if isinstance(value, list):
        if len(value) > 4096:
            raise ContextCompileError("public projection list exceeds limit")
        for nested in value:
            _reject_sensitive_public_projection(nested, depth=depth + 1)
        return
    if value is not None and type(value) not in (bool, int, float):
        raise ContextCompileError("public projection scalar is invalid")
    if isinstance(value, float) and not math.isfinite(value):
        raise ContextCompileError("public projection number is non-finite")


def _require_exact_keys(
    value: Mapping[str, Any], allowed: frozenset[str], field: str
) -> None:
    unknown = set(value) - allowed
    missing = allowed - set(value)
    if unknown or missing:
        raise ContextCompileError(f"{field} keys mismatch")


def _require_strict_bool(value: Any, field: str) -> bool:
    if type(value) is not bool:
        raise ContextCompileError(f"{field} must be boolean")
    return value


def _require_safe_code(value: Any, field: str) -> str:
    return _require_safe_public_id(value, field)


def _validate_public_expected_value(value: Any, field: str) -> None:
    if isinstance(value, list):
        if len(value) > 64:
            raise ContextCompileError(f"{field} exceeds 64 items")
        for index, item in enumerate(value):
            if not isinstance(item, (str, bool, int, float, type(None))):
                raise ContextCompileError(
                    f"{field}[{index}] must be a public scalar"
                )
            if isinstance(item, float) and not math.isfinite(item):
                raise ContextCompileError(f"{field}[{index}] is non-finite")
            if isinstance(item, str) and len(item.encode("utf-8")) > 512:
                raise ContextCompileError(f"{field}[{index}] exceeds 512 bytes")
            if isinstance(item, str):
                _reject_sensitive_public_text(item)
        return
    if not isinstance(value, (str, bool, int, float, type(None))):
        raise ContextCompileError(f"{field} must be a public scalar or flat list")
    if isinstance(value, float) and not math.isfinite(value):
        raise ContextCompileError(f"{field} is non-finite")
    if isinstance(value, str) and len(value.encode("utf-8")) > 2048:
        raise ContextCompileError(f"{field} exceeds 2 KiB")
    if isinstance(value, str):
        _reject_sensitive_public_text(value)


def _validate_public_source_locator(value: Any, field: str) -> Mapping[str, Any]:
    if not isinstance(value, dict):
        raise ContextCompileError(f"{field} must be an object")
    forbidden = {
        "body",
        "excerpt",
        "quote",
        "summary",
        "embedding",
        "content_hash",
        "content_sha256",
        "secret",
        "token",
        "signed_url",
        "private_reason",
    }
    unknown = set(value) - PUBLIC_SOURCE_LOCATOR_KEYS
    if unknown:
        raise ContextCompileError(
            f"unsupported field in {field}: {sorted(unknown)!r}"
        )

    def reject_nested_private(item: Any, path: str) -> None:
        if isinstance(item, Mapping):
            for key, nested in item.items():
                normalized = str(key).lower()
                if normalized in forbidden or any(
                    token in normalized
                    for token in ("body", "excerpt", "quote", "summary", "secret", "token")
                ):
                    raise ContextCompileError(f"forbidden private field in {path}")
                reject_nested_private(nested, f"{path}.{key}")
        elif isinstance(item, list):
            for index, nested in enumerate(item):
                reject_nested_private(nested, f"{path}[{index}]")

    reject_nested_private(value, field)
    _require_safe_public_id(value.get("locator_id"), f"{field}.locator_id")
    if value.get("privacy") != "PUBLIC":
        raise ContextCompileError(f"Unit A source locator must be PUBLIC: {field}")
    _require_repository_key(value.get("repository_key"), f"{field}.repository_key")
    _require_safe_repo_path(value.get("path"), f"{field}.path")
    if "owner_id" in value:
        _require_safe_public_id(value["owner_id"], f"{field}.owner_id")
    if "remote_ref" in value:
        _require_safe_git_ref(value["remote_ref"], f"{field}.remote_ref")
    for key in ("location", "availability", "canonicality"):
        if key in value:
            _require_safe_public_id(value[key], f"{field}.{key}")
    if "section_locator" in value:
        if type(value["section_locator"]) is not str:
            raise ContextCompileError(f"unsafe {field}.section_locator")
        section = value["section_locator"]
        if (
            not section
            or len(section.encode("utf-8")) > 512
            or any(ord(char) < 32 or ord(char) == 127 for char in section)
        ):
            raise ContextCompileError(f"unsafe {field}.section_locator")
        _reject_sensitive_public_text(section)
    return value


def _validate_supersession_graph(
    responsibilities: Sequence[Mapping[str, Any]],
) -> None:
    ids = {
        _require_safe_public_id(row.get("responsibility_id"), "responsibility_id")
        for row in responsibilities
    }
    if len(ids) != len(responsibilities):
        raise ContextCompileError("duplicate document responsibility ID")
    by_id = {str(row["responsibility_id"]): row for row in responsibilities}
    adjacency: dict[str, set[str]] = {item: set() for item in ids}
    for row in responsibilities:
        source = str(row["responsibility_id"])
        for field in ("supersedes", "superseded_by"):
            targets = row.get(field, [])
            if not isinstance(targets, list):
                raise ContextCompileError(f"{source}.{field} must be a list")
            normalized = [
                _require_safe_public_id(item, f"{source}.{field}") for item in targets
            ]
            if len(normalized) != len(set(normalized)):
                raise ContextCompileError(f"duplicate supersession edge: {source}.{field}")
            for target in normalized:
                if target == source:
                    raise ContextCompileError(f"self supersession edge: {source}")
                if target not in ids:
                    raise ContextCompileError(
                        f"dangling supersession responsibility: {source}->{target}"
                    )
                if field == "supersedes":
                    adjacency[source].add(target)
                    reciprocal = by_id[target].get("superseded_by", [])
                    if source not in reciprocal:
                        raise ContextCompileError(
                            f"non-reciprocal supersession edge: {source}->{target}"
                        )
                else:
                    adjacency[target].add(source)
                    reciprocal = by_id[target].get("supersedes", [])
                    if source not in reciprocal:
                        raise ContextCompileError(
                            f"non-reciprocal supersession edge: {target}->{source}"
                        )
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node: str) -> None:
        if node in visiting:
            raise ContextCompileError("supersession cycle detected")
        if node in visited:
            return
        visiting.add(node)
        for target in sorted(adjacency[node]):
            visit(target)
        visiting.remove(node)
        visited.add(node)

    for node in sorted(adjacency):
        visit(node)


def _validate_v2_task_profile_document(
    document: Mapping[str, Any], task: str, *, _validate_all_tasks: bool = True
) -> Mapping[str, Any]:
    if not isinstance(document, Mapping):
        raise ContextCompileError("task profile document must be an object")
    _require_exact_keys(document, V2_DOCUMENT_KEYS, "task_profiles.v2 document")
    if document.get("schema_version") != PROFILE_SCHEMA_VERSION:
        raise ContextCompileError("unsupported task profile schema")
    if type(document.get("persistent_primary_task")) is not str:
        raise ContextCompileError("unsafe or missing persistent_primary_task")
    primary = _require_safe_public_id(
        document["persistent_primary_task"].upper(),
        "persistent_primary_task",
    ).lower()
    tasks = document.get("tasks")
    if not isinstance(tasks, dict) or task not in tasks:
        raise ContextCompileError(f"task profile not found: {task}")
    if not 1 <= len(tasks) <= 32:
        raise ContextCompileError("task_profiles.v2 tasks must contain 1..32 rows")
    for task_id, candidate in tasks.items():
        if type(task_id) is not str:
            raise ContextCompileError("unsafe or missing task ID")
        _require_safe_public_id(task_id.upper(), "task ID")
        if not isinstance(candidate, dict):
            raise ContextCompileError(f"task profile must be an object: {task_id}")
        if "purpose" in candidate:
            raise ContextCompileError("task_profiles.v2 forbids tasks.<id>.purpose")
        _require_exact_keys(
            candidate, V2_TASK_PROFILE_KEYS, f"task_profiles.v2 task {task_id}"
        )
    persistent = [
        key
        for key, value in tasks.items()
        if isinstance(value, dict)
        and value.get("publication_mode") == "PERSISTENT_PRIMARY"
    ]
    if persistent != [primary]:
        raise ContextCompileError(
            "workspace must declare PERSISTENT_PRIMARY task exact1"
        )
    if _validate_all_tasks:
        for task_id in tasks:
            _validate_v2_task_profile_document(
                document, task_id, _validate_all_tasks=False
            )
        return tasks[task]
    profile = tasks[task]
    publication_mode = profile.get("publication_mode")
    if type(publication_mode) is not str or publication_mode not in {
        "PERSISTENT_PRIMARY",
        "EPHEMERAL_VERIFY_ONLY",
    }:
        raise ContextCompileError("unsupported publication_mode")
    if "purpose" in profile:
        raise ContextCompileError("task_profiles.v2 forbids tasks.<id>.purpose")
    orientation = profile.get("task_orientation")
    if not isinstance(orientation, str) or not orientation.strip():
        raise ContextCompileError("task_profiles.v2 task_orientation is required")
    if len(orientation.encode("utf-8")) > 2048:
        raise ContextCompileError("task_orientation exceeds 2 KiB")
    _reject_sensitive_public_text(orientation)
    contract = profile.get("operator_contract")
    if not isinstance(contract, dict) or set(contract) != OPERATOR_CONTRACT_UNIT_A_KEYS:
        raise ContextCompileError(
            "operator_contract must contain Unit A exact3 only"
        )
    for key in OPERATOR_CONTRACT_UNIT_A_KEYS:
        if not isinstance(contract[key], list):
            raise ContextCompileError(f"operator_contract.{key} must be a list")
    if not 1 <= len(contract["canonical_owner_refs"]) <= 8:
        raise ContextCompileError("canonical_owner_refs must contain 1..8 rows")
    if len(contract["required_premises"]) > 256:
        raise ContextCompileError("required_premises exceeds 256 rows")
    if not 1 <= len(contract["document_responsibilities"]) <= 512:
        raise ContextCompileError(
            "document_responsibilities must contain 1..512 rows"
        )
    if task == "cmee" and publication_mode == "PERSISTENT_PRIMARY":
        counts = (
            len(contract["canonical_owner_refs"]),
            len(contract["required_premises"]),
            len(contract["document_responsibilities"]),
        )
        if counts != (1, 7, 21):
            raise ContextCompileError(
                "CMEE Unit A requires canonical owner/premise/responsibility "
                "exact1/exact7/exact21"
            )

    owner_ids: set[str] = set()
    owner_repository_by_id: dict[str, str] = {}
    locator_ids: set[str] = set()

    def validate_locator(locator: Any, field: str) -> Mapping[str, Any]:
        validated = _validate_public_source_locator(locator, field)
        locator_id = validated["locator_id"]
        if locator_id in locator_ids:
            raise ContextCompileError(f"duplicate source locator ID: {locator_id}")
        locator_ids.add(locator_id)
        return validated

    if not contract["canonical_owner_refs"]:
        raise ContextCompileError("task_profiles.v2 requires a canonical owner ref")
    for owner in contract["canonical_owner_refs"]:
        if not isinstance(owner, dict):
            raise ContextCompileError("canonical owner row must be an object")
        _require_exact_keys(owner, OWNER_ROW_KEYS, "canonical owner row")
        owner_id = _require_safe_public_id(owner.get("owner_id"), "owner_id")
        if owner_id in owner_ids:
            raise ContextCompileError(f"duplicate canonical owner ID: {owner_id}")
        owner_ids.add(owner_id)
        repository_key = _require_repository_key(
            owner.get("repository_key"), f"{owner_id}.repository_key"
        )
        owner_repository_by_id[owner_id] = repository_key
        _require_safe_code(owner.get("responsibility"), f"{owner_id}.responsibility")
        _require_strict_bool(owner.get("required"), f"{owner_id}.required")
        if owner.get("freshness_policy") != "READ_ONLY_EXACT_REF":
            raise ContextCompileError(
                f"canonical owner must be READ_ONLY_EXACT_REF: {owner_id}"
            )
        _require_safe_git_ref(owner.get("remote_ref"), "canonical owner ref")
        _require_enum(
            owner.get("assertion_provenance"), ASSERTION_PROVENANCE,
            f"{owner_id}.assertion_provenance",
        )
        _require_safe_code(owner.get("claim_boundary"), f"{owner_id}.claim_boundary")
        if type(owner.get("public_pr_number_or_locator")) is not str:
            raise ContextCompileError(
                f"unsafe {owner_id}.public_pr_number_or_locator"
            )
        public_pr = owner["public_pr_number_or_locator"]
        if (
            not public_pr
            or len(public_pr.encode("utf-8")) > 256
            or any(ord(char) < 32 or ord(char) == 127 for char in public_pr)
        ):
            raise ContextCompileError(
                f"unsafe {owner_id}.public_pr_number_or_locator"
            )
        _reject_sensitive_public_text(public_pr)
        owner_source = validate_locator(
            owner.get("source_locator"), f"{owner_id}.source_locator"
        )
        if owner_source.get("repository_key") != repository_key:
            raise ContextCompileError(
                f"{owner_id}.source_locator repository does not match owner repository"
            )

    premise_ids: set[str] = set()
    premise_orders: set[int] = set()
    for premise in contract["required_premises"]:
        if not isinstance(premise, dict):
            raise ContextCompileError("required premise row must be an object")
        _require_exact_keys(premise, PREMISE_ROW_KEYS, "required premise row")
        premise_id = _require_safe_public_id(
            premise.get("premise_id"), "premise_id"
        )
        if premise_id in premise_ids:
            raise ContextCompileError(f"duplicate premise ID: {premise_id}")
        premise_ids.add(premise_id)
        policy = _require_enum(
            premise.get("expected_identity_policy"),
            EXPECTED_IDENTITY_POLICIES,
            f"{premise_id}.expected_identity_policy",
        )
        if policy != "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF":
            raise ContextCompileError(
                f"{premise_id} FIXED identity is not available in the Unit A exact3 contract"
            )
        owner_value = premise.get("owner_id")
        locator_value = premise.get("expected_identity_locator_id")
        owner_id = _require_safe_public_id(owner_value, "owner_id")
        if owner_id not in owner_ids:
            raise ContextCompileError(
                f"required premise has dangling owner: {premise_id}->{owner_id}"
            )
        if locator_value is not None:
            raise ContextCompileError(
                f"{premise_id} BIND policy requires expected_identity_locator_id=null"
            )
        repository_key = _require_repository_key(
            premise.get("repository_key"), f"{premise_id}.repository_key"
        )
        if repository_key != owner_repository_by_id[owner_id]:
            raise ContextCompileError(
                f"{premise_id} repository does not match canonical owner"
            )
        _require_safe_repo_path(premise.get("path"), f"{premise_id}.path")
        _require_safe_code(
            premise.get("responsibility"), f"{premise_id}.responsibility"
        )
        _require_strict_bool(premise.get("required"), f"{premise_id}.required")
        _require_enum(
            premise.get("assertion_provenance"),
            ASSERTION_PROVENANCE,
            f"{premise_id}.assertion_provenance",
        )
        order = premise.get("entry_chain_order")
        if type(order) is not int or not 1 <= order <= 256:
            raise ContextCompileError(
                f"{premise_id}.entry_chain_order must be integer 1..256"
            )
        if order in premise_orders:
            raise ContextCompileError(f"duplicate premise entry_chain_order: {order}")
        premise_orders.add(order)
        if (
            type(premise.get("read_tier")) is not str
            or premise.get("read_tier") not in SELECTION_TIERS
        ):
            raise ContextCompileError(f"unsupported {premise_id}.read_tier")
        roles = premise.get("required_roles")
        if (
            not isinstance(roles, list)
            or not roles
            or any(type(role) is not str for role in roles)
            or len(roles) != len(set(roles))
            or any(role not in {"PRO_KAREN", "ULTRA_KAREN"} for role in roles)
        ):
            raise ContextCompileError(f"{premise_id}.required_roles is invalid")
        premise_source = validate_locator(
            premise.get("source_locator"), f"{premise_id}.source_locator"
        )
        if (
            premise_source.get("repository_key") == premise.get("repository_key")
            and premise_source.get("path") == premise.get("path")
        ):
            raise ContextCompileError(
                f"{premise_id}.source_locator cannot double as verification target"
            )
    if premise_orders != set(range(1, len(contract["required_premises"]) + 1)):
        raise ContextCompileError(
            "required premise entry_chain_order must be contiguous from 1"
        )

    responsibilities = contract["document_responsibilities"]
    responsibility_ids: set[str] = set()
    for row in responsibilities:
        if not isinstance(row, dict):
            raise ContextCompileError("document responsibility row must be an object")
        _require_exact_keys(
            row, RESPONSIBILITY_ROW_KEYS, "document responsibility row"
        )
        rid = _require_safe_public_id(
            row.get("responsibility_id"), "responsibility_id"
        )
        if rid in responsibility_ids:
            raise ContextCompileError(f"duplicate document responsibility ID: {rid}")
        responsibility_ids.add(rid)
        locator = row.get("subject_locator")
        if not isinstance(locator, dict):
            raise ContextCompileError(f"{rid}.subject_locator must be an object")
        _require_exact_keys(
            locator,
            frozenset({"repository_key", "owner_id", "path"}),
            f"{rid}.subject_locator",
        )
        _require_safe_repo_path(locator.get("path"), f"{rid}.subject_locator.path")
        subject_repository_key = _require_repository_key(
            locator.get("repository_key"),
            f"{rid}.subject_locator.repository_key",
        )
        subject_owner_id = _require_safe_public_id(
            locator.get("owner_id"), f"{rid}.subject_locator.owner_id"
        )
        if subject_owner_id not in owner_ids:
            raise ContextCompileError(
                f"{rid}.subject_locator has dangling owner: {subject_owner_id}"
            )
        if subject_repository_key != owner_repository_by_id[subject_owner_id]:
            raise ContextCompileError(
                f"{rid}.subject_locator repository does not match canonical owner"
            )
        _require_enum(
            row.get("responsibility_kind"), RESPONSIBILITY_KINDS,
            f"{rid}.responsibility_kind",
        )
        _require_enum(row.get("lifecycle"), LIFECYCLES, f"{rid}.lifecycle")
        _require_enum(
            row.get("authority_kind"), AUTHORITY_KINDS, f"{rid}.authority_kind"
        )
        _require_enum(
            row.get("assertion_provenance"), ASSERTION_PROVENANCE,
            f"{rid}.assertion_provenance",
        )
        _require_safe_code(row.get("publication_state"), f"{rid}.publication_state")
        _require_safe_code(row.get("effective_condition"), f"{rid}.effective_condition")
        assertions = row.get("metadata_assertions", [])
        if not isinstance(assertions, list):
            raise ContextCompileError(f"{rid}.metadata_assertions must be a list")
        if len(assertions) > 64:
            raise ContextCompileError(f"{rid}.metadata_assertions exceeds 64 rows")
        assertion_keys: set[tuple[str, str]] = set()
        for assertion in assertions:
            if not isinstance(assertion, dict):
                raise ContextCompileError(
                    f"{rid}.metadata_assertions rows must be tagged objects"
                )
            _require_exact_keys(
                assertion,
                frozenset({"metadata_kind", "metadata_key", "expected_value"}),
                f"{rid}.metadata_assertion",
            )
            if type(assertion.get("metadata_kind")) is not str:
                raise ContextCompileError(f"{rid}.metadata_kind must be a string")
            if type(assertion.get("metadata_key")) is not str:
                raise ContextCompileError(f"{rid}.metadata_key must be a string")
            kind = assertion["metadata_kind"]
            key = assertion["metadata_key"]
            if (kind, key) in assertion_keys:
                raise ContextCompileError(f"duplicate metadata assertion: {rid}")
            assertion_keys.add((kind, key))
            if kind == "FRONT_MATTER":
                if key not in METADATA_ALLOWLIST:
                    raise ContextCompileError(
                        f"{rid} uses unsupported front matter assertion key"
                    )
                if (
                    key in BOOLEAN_METADATA_KEYS
                    and type(assertion.get("expected_value")) is not bool
                ):
                    raise ContextCompileError(
                        f"{rid} boolean front matter assertion requires boolean expected_value"
                    )
            elif kind == "JSON_POINTER":
                _json_pointer_tokens(key)
            else:
                raise ContextCompileError(
                    f"{rid} uses unsupported metadata assertion kind"
                )
            _validate_public_expected_value(
                assertion.get("expected_value"),
                f"{rid}:{kind}:{key}.expected_value",
            )
        source = validate_locator(
            row.get("source_locator"), f"{rid}.source_locator"
        )
        if source.get("repository_key") not in set(
            owner_repository_by_id.values()
        ):
            raise ContextCompileError(
                f"{rid}.source_locator repository is not declared by an owner"
            )
    for premise in contract["required_premises"]:
        if premise["responsibility"] not in responsibility_ids:
            raise ContextCompileError(
                f"required premise has dangling responsibility: {premise['premise_id']}"
            )
    _validate_supersession_graph(responsibilities)
    return profile


def _task_profile(
    document: Mapping[str, Any], task: str
) -> tuple[Mapping[str, Any], bool]:
    if not isinstance(document, Mapping):
        raise ContextCompileError("task profile document must be an object")
    schema = document.get("schema_version")
    if schema == PROFILE_SCHEMA_VERSION_V1:
        tasks = document.get("tasks", {})
        if not isinstance(tasks, dict) or task not in tasks:
            raise ContextCompileError(f"task profile not found: {task}")
        profile = tasks[task]
        if not isinstance(profile, dict):
            raise ContextCompileError(f"task profile must be an object: {task}")
        return profile, False
    return _validate_v2_task_profile_document(document, task), True


def _parse_inline_metadata_value(raw: str, key: str) -> Any:
    value = raw.strip()
    if len(value.encode("utf-8")) > 2048:
        raise ContextCompileError(f"front matter scalar exceeds 2 KiB: {key}")
    if not value:
        return ""
    if value[0] in "|>" or value.startswith(("&", "*", "!")) or "<<:" in value:
        raise ContextCompileError(f"unsupported YAML feature in front matter: {key}")
    if value.startswith("["):
        if not value.endswith("]"):
            raise ContextCompileError(f"unterminated front matter list: {key}")
        inner = value[1:-1]
        try:
            items = next(csv.reader([inner], skipinitialspace=True)) if inner else []
        except (csv.Error, StopIteration) as exc:
            raise ContextCompileError(f"invalid front matter list: {key}") from exc
        if len(items) > 64:
            raise ContextCompileError(f"front matter list exceeds 64 items: {key}")
        normalized = []
        for item in items:
            raw_item = item.strip()
            quoted = (
                len(raw_item) >= 2
                and raw_item[0] in {"\"", "'"}
                and raw_item[-1] == raw_item[0]
            )
            if not quoted and (
                any(
                    token in raw_item
                    for token in (
                        "&", "*", "!", "[", "]", "{", "}", "|", ">", ":", "#"
                    )
                )
                or "<<:" in raw_item
            ):
                raise ContextCompileError(
                    f"unsupported YAML feature in front matter list: {key}"
                )
            text = raw_item[1:-1] if quoted else raw_item
            if any(ord(char) < 32 or ord(char) == 127 for char in text):
                raise ContextCompileError(
                    f"control character in front matter list: {key}"
                )
            if len(text.encode("utf-8")) > 512:
                raise ContextCompileError(f"front matter list item exceeds 512 bytes: {key}")
            normalized.append(text)
        return normalized
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if value.lower() in {"null", "~"}:
        return None
    quoted = value[:1] in {"\"", "'"}
    if quoted:
        if len(value) < 2 or value[-1] != value[0]:
            raise ContextCompileError(f"unterminated quoted front matter scalar: {key}")
        return value[1:-1]
    if (
        any(token in value for token in (" &", " *", " !", "<<:", "{", "}", "#"))
        or re.search(r":(?:\s|$)", value)
        or "[" in value
        or "]" in value
    ):
        raise ContextCompileError(f"unsupported YAML feature in front matter: {key}")
    return value


def parse_restricted_front_matter(data: bytes) -> Mapping[str, Any]:
    """Extract only public allowlisted metadata from a bounded YAML header.

    This is intentionally not a general YAML parser.  It never returns document
    body bytes and converts malformed or over-budget headers to a stable
    unresolved result for conflict visibility.
    """
    raw_lines = data.splitlines(keepends=True)
    if not raw_lines or raw_lines[0].rstrip(b"\r\n") != b"---":
        return {"status": "ABSENT", "reason_code": "FRONT_MATTER_ABSENT", "fields": {}}
    header_lines = [raw_lines[0]]
    closing: int | None = None
    header_size = len(raw_lines[0])
    for index, raw_line in enumerate(raw_lines[1:256], 1):
        header_lines.append(raw_line)
        header_size += len(raw_line)
        if header_size > 16 * 1024:
            return {"status": "UNRESOLVED_METADATA", "reason_code": "METADATA_BYTE_BUDGET_EXCEEDED", "fields": {}}
        if raw_line.rstrip(b"\r\n") == b"---":
            closing = index
            break
    if closing is None:
        reason = (
            "METADATA_BYTE_BUDGET_EXCEEDED"
            if len(data) > 16 * 1024
            else "METADATA_LINE_BUDGET_EXCEEDED"
            if len(raw_lines) > 256
            else "METADATA_CLOSING_DELIMITER_MISSING"
        )
        return {"status": "UNRESOLVED_METADATA", "reason_code": reason, "fields": {}}
    try:
        text = b"".join(header_lines).decode("utf-8", errors="strict")
    except UnicodeDecodeError:
        return {"status": "UNRESOLVED_METADATA", "reason_code": "METADATA_UTF8_INVALID", "fields": {}}
    lines = text.splitlines()
    fields: dict[str, Any] = {}
    seen: set[str] = set()
    try:
        for line in lines[1:closing]:
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            if line[:1].isspace() or ":" not in line:
                raise ContextCompileError("nested or malformed front matter")
            if any(ord(char) < 32 or ord(char) == 127 for char in line):
                raise ContextCompileError("control character in front matter")
            key, raw = line.split(":", 1)
            key = key.strip()
            if key == "<<":
                raise ContextCompileError("unsupported YAML feature in front matter")
            if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_-]{0,127}", key):
                raise ContextCompileError("invalid front matter key")
            if key in seen:
                raise ContextCompileError("duplicate front matter key")
            seen.add(key)
            parsed = _parse_inline_metadata_value(raw, key)
            if key in METADATA_ALLOWLIST:
                _validate_public_expected_value(parsed, "front matter metadata")
                fields[key] = parsed
    except ContextCompileError as exc:
        message = str(exc)
        if message.startswith("duplicate front matter key"):
            reason = "DUPLICATE_FRONT_MATTER_KEY"
        elif message.startswith("nested or malformed front matter"):
            reason = "NESTED_OR_MALFORMED_FRONT_MATTER"
        elif message.startswith("sensitive public metadata value"):
            reason = "METADATA_SENSITIVE_VALUE_REJECTED"
        elif message.startswith("unsupported YAML feature in front matter list"):
            reason = "UNSUPPORTED_YAML_FEATURE_IN_FRONT_MATTER_LIST"
        elif message.startswith("unsupported YAML feature in front matter"):
            reason = "UNSUPPORTED_YAML_FEATURE_IN_FRONT_MATTER"
        elif message.startswith("control character in front matter list"):
            reason = "CONTROL_CHARACTER_IN_FRONT_MATTER_LIST"
        elif message.startswith("control character in front matter"):
            reason = "CONTROL_CHARACTER_IN_FRONT_MATTER"
        elif message.startswith("front matter list exceeds"):
            reason = "FRONT_MATTER_LIST_BUDGET_EXCEEDED"
        elif message.startswith("front matter list item exceeds"):
            reason = "FRONT_MATTER_LIST_ITEM_BUDGET_EXCEEDED"
        elif message.startswith("front matter scalar exceeds"):
            reason = "FRONT_MATTER_SCALAR_BUDGET_EXCEEDED"
        elif message.startswith("unterminated front matter list"):
            reason = "FRONT_MATTER_LIST_UNTERMINATED"
        elif message.startswith("unterminated quoted front matter scalar"):
            reason = "FRONT_MATTER_QUOTED_SCALAR_UNTERMINATED"
        elif message.startswith("invalid front matter list"):
            reason = "FRONT_MATTER_LIST_INVALID"
        elif message.startswith("invalid front matter key"):
            reason = "FRONT_MATTER_KEY_INVALID"
        else:
            reason = "FRONT_MATTER_RESTRICTED_PARSE_FAILED"
        return {"status": "UNRESOLVED_METADATA", "reason_code": reason, "fields": {}}
    return {"status": "VERIFIED", "reason_code": "METADATA_RESTRICTED_VERIFIED", "fields": fields}


def _json_pointer_tokens(pointer: str) -> list[str]:
    if not pointer.startswith("/") or len(pointer.encode("utf-8")) > 1024:
        raise ContextCompileError("unsafe JSON pointer")
    tokens: list[str] = []
    for raw in pointer[1:].split("/"):
        result: list[str] = []
        index = 0
        while index < len(raw):
            char = raw[index]
            if char != "~":
                result.append(char)
                index += 1
                continue
            if index + 1 >= len(raw) or raw[index + 1] not in {"0", "1"}:
                raise ContextCompileError("unsafe JSON pointer escape")
            result.append("~" if raw[index + 1] == "0" else "/")
            index += 2
        token = "".join(result)
        if any(ord(char) < 32 or ord(char) == 127 for char in token):
            raise ContextCompileError("unsafe JSON pointer token")
        tokens.append(token)
    return tokens


def _json_depth(value: Any) -> int:
    if isinstance(value, Mapping):
        if not value:
            return 1
        return 1 + max(_json_depth(item) for item in value.values())
    if isinstance(value, list):
        if not value:
            return 1
        return 1 + max(_json_depth(item) for item in value)
    return 0


def _resolve_json_pointer(value: Any, pointer: str) -> Any:
    current = value
    for token in _json_pointer_tokens(pointer):
        if isinstance(current, Mapping):
            if token not in current:
                raise ContextCompileError(f"JSON pointer target is absent: {pointer}")
            current = current[token]
        elif isinstance(current, list):
            if (
                not re.fullmatch(r"0|[1-9][0-9]*", token)
                or int(token) >= len(current)
            ):
                raise ContextCompileError(f"JSON pointer array target is absent: {pointer}")
            current = current[int(token)]
        else:
            raise ContextCompileError(f"JSON pointer traverses a scalar: {pointer}")
    return current


def parse_restricted_json_pointer_assertions(
    data: bytes, assertions: Sequence[Mapping[str, Any]]
) -> Mapping[str, Any]:
    """Verify declared JSON pointers without returning undeclared JSON values."""
    pointers = [
        row for row in assertions if row.get("metadata_kind") == "JSON_POINTER"
    ]
    if not pointers:
        return {
            "status": "ABSENT",
            "reason_code": "JSON_POINTER_ASSERTIONS_ABSENT",
            "assertions": [],
        }

    def unresolved(reason_code: str) -> Mapping[str, Any]:
        return {
            "status": "UNRESOLVED_METADATA",
            "reason_code": reason_code,
            "assertions": [
                {
                    "metadata_kind": "JSON_POINTER",
                    "metadata_key": str(row["metadata_key"]),
                    "verification_status": "UNRESOLVED",
                    "reason_code": reason_code,
                }
                for row in pointers
            ],
        }

    if len(data) > 64 * 1024:
        return unresolved("JSON_METADATA_BYTE_BUDGET_EXCEEDED")
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError:
        return unresolved("JSON_METADATA_UTF8_INVALID")
    try:
        document = _strict_json_loads(text, "declared metadata blob")
    except (ContextCompileError, json.JSONDecodeError, RecursionError) as exc:
        reason = (
            "JSON_METADATA_DUPLICATE_KEY"
            if "duplicate JSON object key" in str(exc)
            else "JSON_METADATA_PARSE_FAILED"
        )
        return unresolved(reason)
    try:
        depth = _json_depth(document)
    except RecursionError:
        return unresolved("JSON_METADATA_DEPTH_EXCEEDED")
    if depth > 16:
        return unresolved("JSON_METADATA_DEPTH_EXCEEDED")

    results: list[dict[str, Any]] = []
    any_unresolved = False
    for assertion in pointers:
        pointer = str(assertion["metadata_key"])
        try:
            actual = _resolve_json_pointer(document, pointer)
        except ContextCompileError:
            any_unresolved = True
            results.append(
                {
                    "metadata_kind": "JSON_POINTER",
                    "metadata_key": pointer,
                    "verification_status": "UNRESOLVED",
                    "reason_code": "JSON_POINTER_TARGET_UNRESOLVED",
                }
            )
            continue
        matches = _canonical_json_bytes(actual) == _canonical_json_bytes(
            assertion.get("expected_value")
        )
        results.append(
            {
                "metadata_kind": "JSON_POINTER",
                "metadata_key": pointer,
                "verification_status": "MATCH" if matches else "MISMATCH",
                "reason_code": (
                    "DECLARED_JSON_POINTER_VALUE_MATCH"
                    if matches
                    else "DECLARED_METADATA_ASSERTION_MISMATCH"
                ),
            }
        )
    return {
        "status": "UNRESOLVED_METADATA" if any_unresolved else "VERIFIED",
        "reason_code": (
            "JSON_POINTER_TARGET_UNRESOLVED"
            if any_unresolved
            else "DECLARED_JSON_POINTERS_VERIFIED"
        ),
        "assertions": results,
    }


def extract_restricted_metadata(
    data: bytes, assertions: Sequence[Mapping[str, Any]] = ()
) -> Mapping[str, Any]:
    """Extract bounded front matter and verify only declared JSON pointers."""
    front = parse_restricted_front_matter(data)
    json_result = parse_restricted_json_pointer_assertions(data, assertions)
    front_required = any(
        row.get("metadata_kind") == "FRONT_MATTER" for row in assertions
    )
    if json_result["status"] == "UNRESOLVED_METADATA":
        status = "UNRESOLVED_METADATA"
        reason_code = str(json_result["reason_code"])
    elif front["status"] == "UNRESOLVED_METADATA" and (
        front_required or data.startswith(b"---")
    ):
        status = "UNRESOLVED_METADATA"
        reason_code = str(front["reason_code"])
    elif json_result["status"] == "VERIFIED" or front["status"] == "VERIFIED":
        status = "VERIFIED"
        reason_code = "DECLARED_METADATA_VERIFIED"
    else:
        status = str(front["status"])
        reason_code = str(front["reason_code"])
    return {
        "status": status,
        "reason_code": reason_code,
        "fields": dict(front.get("fields", {})),
        "json_pointer_assertions": list(json_result["assertions"]),
    }


def _git_blob_prefix(repo: Path, blob_sha: str, maximum: int = 16 * 1024) -> bytes:
    if not GIT_SHA_RE.fullmatch(blob_sha):
        raise ContextCompileError(f"invalid Git blob identity: {blob_sha!r}")
    process = subprocess.Popen(
        ("git", "-C", str(repo), "cat-file", "blob", blob_sha),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    assert process.stdout is not None
    prefix = process.stdout.read(maximum + 1)
    process.kill()
    _stdout, stderr = process.communicate()
    if process.returncode not in {0, -9} and not prefix:
        raise ContextCompileError(
            f"cannot read inventory blob {blob_sha}: {stderr.decode('utf-8', 'replace').strip()}"
        )
    return prefix


def canonical_owner_bundle_fingerprint(bundle: Mapping[str, Any]) -> str:
    payload = {
        "schema_version": bundle.get("schema_version"),
        "workspace": bundle.get("workspace"),
        "task": bundle.get("task"),
        "phase": bundle.get("phase"),
        "owners": bundle.get("owners"),
        "premises": bundle.get("premises"),
        "responsibility_subjects": bundle.get("responsibility_subjects"),
        "blocking_codes": bundle.get("blocking_codes"),
        "workspace_incorporation_claim": bundle.get(
            "workspace_incorporation_claim"
        ),
        "write_authority": bundle.get("write_authority"),
        "integration_required": bundle.get("integration_required"),
        "automatic_progression": bundle.get("automatic_progression"),
    }
    return _sha256_bytes(_canonical_json_bytes(payload))


def _git_text(repo: Path, *args: str) -> str:
    completed = subprocess.run(
        ("git", "-C", str(repo), *args),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if completed.returncode:
        raise ContextCompileError(
            f"git {' '.join(args)} failed: {completed.stderr.strip()}"
        )
    return completed.stdout.strip()


def _git_is_ancestor(repo: Path, ancestor: str, descendant: str) -> bool:
    return subprocess.run(
        ("git", "-C", str(repo), "merge-base", "--is-ancestor", ancestor, descendant),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    ).returncode == 0


def _actual_owner_relation(repo: Path, workspace_head: str, owner_head: str) -> str:
    if workspace_head == owner_head:
        return "SAME_REF"
    if _git_is_ancestor(repo, owner_head, workspace_head):
        return "WORKSPACE_CONTAINS_OWNER_REF"
    if _git_is_ancestor(repo, workspace_head, owner_head):
        return "OWNER_REF_AHEAD"
    return "DIVERGED"


def _owner_diff_evidence(
    repo: Path, merge_base: str, side_head: str
) -> list[dict[str, Any]]:
    raw = _git_text(
        repo,
        "-c",
        "core.quotepath=false",
        "diff",
        "--name-status",
        "-M",
        merge_base,
        side_head,
    )
    changes: list[dict[str, Any]] = []
    for line in raw.splitlines():
        if not line:
            continue
        fields = line.split("\t")
        code = fields[0]
        kind = code[:1]
        if kind in {"R", "C"} and len(fields) == 3:
            status = "RENAMED" if kind == "R" else "COPIED"
            old_path, new_path = fields[1], fields[2]
        elif code in {"A", "M", "D", "T"} and len(fields) == 2:
            status = {
                "A": "ADDED",
                "M": "MODIFIED",
                "D": "DELETED",
                "T": "TYPE_CHANGED",
            }[code]
            old_path = fields[1] if code == "D" else None
            new_path = None if code == "D" else fields[1]
        else:
            raise ContextCompileError(
                f"unrecognized canonical owner diff row: {line!r}"
            )
        change = {
            "git_status": code,
            "status": status,
            "old_path": old_path,
            "new_path": new_path,
        }
        _require_exact_keys(change, BUNDLE_CHANGE_KEYS, "canonical owner change")
        changes.append(change)
    return sorted(
        changes,
        key=lambda row: (
            str(row["old_path"] or ""),
            str(row["new_path"] or ""),
            str(row["git_status"]),
        ),
    )


def _owner_changed_path_projection(
    evidence: Sequence[Mapping[str, Any]],
) -> list[str]:
    return sorted(
        {
            str(path)
            for row in evidence
            for path in (row.get("new_path") or row.get("old_path"),)
            if path
        }
    )


def _validated_workspace_commit(
    *,
    repository_key: str,
    repository_root: Path,
    workspace_exact_refs: Mapping[str, Any] | None,
) -> str:
    inventory_commit: str | None = None
    if workspace_exact_refs is not None:
        exact_ref = workspace_exact_refs.get(repository_key)
        if not isinstance(exact_ref, Mapping):
            raise ContextCompileError(
                f"inventory lacks canonical owner workspace ref: {repository_key}"
            )
        inventory_commit = str(exact_ref.get("source_commit") or "")
        if not GIT_SHA_RE.fullmatch(inventory_commit):
            raise ContextCompileError(
                f"inventory workspace commit is invalid: {repository_key}"
            )
        try:
            inventory_resolved = _git_text(
                repository_root,
                "rev-parse",
                "--verify",
                f"{inventory_commit}^{{commit}}",
            )
        except ContextCompileError as exc:
            raise ContextCompileError(
                "inventory workspace commit is unavailable: "
                f"{repository_key}:{inventory_commit}"
            ) from exc
        if inventory_resolved != inventory_commit:
            raise ContextCompileError(
                f"inventory workspace commit moved: {repository_key}"
            )

    checkout_head = _git_text(repository_root, "rev-parse", "HEAD")
    if not GIT_SHA_RE.fullmatch(checkout_head):
        raise ContextCompileError(
            f"canonical owner workspace commit is invalid: {repository_key}"
        )
    commit = checkout_head
    if repository_key == "Cocolon":
        while True:
            parent_line = _git_text(
                repository_root, "rev-list", "--parents", "-n", "1", commit
            )
            parts = parent_line.split()
            if len(parts) < 2:
                break
            parent = parts[1]
            changed_paths = [
                line
                for line in _git_text(
                    repository_root,
                    "-c",
                    "core.quotepath=false",
                    "diff",
                    "--name-only",
                    parent,
                    commit,
                ).splitlines()
                if line
            ]
            if not changed_paths or any(
                not path.startswith(GENERATED_CONTEXT_PREFIX)
                for path in changed_paths
            ):
                break
            commit = parent
    try:
        resolved = _git_text(
            repository_root, "rev-parse", "--verify", f"{commit}^{{commit}}"
        )
    except ContextCompileError as exc:
        raise ContextCompileError(
            "canonical owner workspace commit is unavailable: "
            f"{repository_key}:{commit}"
        ) from exc
    if resolved != commit:
        raise ContextCompileError(
            f"canonical owner workspace commit moved: {repository_key}"
        )
    return commit


def _expected_owner_namespace(task: str, owner_id: str) -> str:
    safe_task = re.sub(r"[^A-Za-z0-9._-]+", "-", task).strip("-.")
    safe_owner = re.sub(r"[^A-Za-z0-9._-]+", "-", owner_id).strip("-.")
    if not safe_task or not safe_owner:
        raise ContextCompileError("canonical owner namespace is unsafe")
    task_digest = hashlib.sha256(task.encode("utf-8")).hexdigest()[:12]
    owner_digest = hashlib.sha256(owner_id.encode("utf-8")).hexdigest()[:16]
    return (
        "refs/cocolon-context/owners/"
        f"{safe_task[:48]}-{task_digest}/{safe_owner[:64]}-{owner_digest}"
    )


def _regular_blob_identity(repo: Path, commit: str, path: str) -> str | None:
    if not GIT_SHA_RE.fullmatch(commit):
        raise ContextCompileError("canonical owner commit identity is invalid")
    raw = _git_text(repo, "ls-tree", "-z", commit, "--", path)
    rows = [row for row in raw.split("\x00") if row]
    if not rows:
        return None
    if len(rows) != 1 or "\t" not in rows[0]:
        raise ContextCompileError(f"canonical owner tree row is ambiguous: {commit}:{path}")
    identity, actual_path = rows[0].split("\t", 1)
    fields = identity.split(" ", 2)
    if (
        len(fields) != 3
        or fields[0] != "100644"
        or fields[1] != "blob"
        or actual_path != path
    ):
        return None
    blob_sha = fields[2]
    if not GIT_SHA_RE.fullmatch(blob_sha):
        raise ContextCompileError(
            f"canonical owner tree blob identity is invalid: {commit}:{path}"
        )
    try:
        _git_text(repo, "cat-file", "-e", f"{blob_sha}^{{blob}}")
    except ContextCompileError:
        return None
    return blob_sha


def _verify_commit_blob(repo: Path, commit: str, path: str, expected_blob: str) -> None:
    if not GIT_SHA_RE.fullmatch(expected_blob):
        raise ContextCompileError("canonical owner commit/blob identity is invalid")
    actual_blob = _regular_blob_identity(repo, commit, path)
    if actual_blob != expected_blob:
        raise ContextCompileError(
            f"canonical owner blob mismatch: {commit}:{path}"
        )
    object_type = _git_text(repo, "cat-file", "-t", expected_blob)
    if object_type != "blob":
        raise ContextCompileError(f"canonical owner object is not a blob: {expected_blob}")


def validate_canonical_owner_bundle(
    *,
    bundle: Mapping[str, Any],
    workspace: str,
    task: str,
    task_profile: Mapping[str, Any],
    workspace_profile: Mapping[str, Any],
    repository_roots: Mapping[str, Path],
    workspace_exact_refs: Mapping[str, Any] | None = None,
) -> Mapping[str, Any]:
    """Revalidate a resolver bundle before it can influence Unit A readiness."""
    if not isinstance(bundle, Mapping):
        raise ContextCompileError("canonical owner bundle must be an object")
    _require_exact_keys(bundle, BUNDLE_TOP_LEVEL_KEYS, "canonical owner bundle")
    if bundle.get("schema_version") != "cocolon.system_context.canonical_owner_bundle.v1":
        raise ContextCompileError("canonical owner bundle schema is invalid")
    if bundle.get("workspace") != workspace or bundle.get("task") != task:
        raise ContextCompileError("canonical owner bundle workspace/task mismatch")
    if bundle.get("phase") != "PRE_PUBLISH_FINALIZED":
        raise ContextCompileError("canonical owner bundle is not pre-publish finalized")
    for field in (
        "workspace_incorporation_claim",
        "write_authority",
        "integration_required",
        "automatic_progression",
    ):
        if bundle.get(field) is not False:
            raise ContextCompileError(f"canonical owner bundle grants forbidden {field}")
    fingerprint = str(bundle.get("task_dependency_fingerprint") or "")
    if not SHA256_RE.fullmatch(fingerprint):
        raise ContextCompileError("canonical owner bundle fingerprint is invalid")
    if fingerprint != canonical_owner_bundle_fingerprint(bundle):
        raise ContextCompileError("canonical owner bundle fingerprint mismatch")

    contract = task_profile.get("operator_contract")
    if not isinstance(contract, Mapping):
        raise ContextCompileError("Unit A operator contract is missing")
    owner_declarations = {
        str(row["owner_id"]): row for row in contract["canonical_owner_refs"]
    }
    premise_declarations = {
        str(row["premise_id"]): row for row in contract["required_premises"]
    }
    responsibility_declarations = {
        str(row["responsibility_id"]): row
        for row in contract["document_responsibilities"]
    }
    owners = bundle.get("owners")
    premises = bundle.get("premises")
    responsibility_subjects = bundle.get("responsibility_subjects")
    blocking_codes = bundle.get("blocking_codes")
    if not all(
        isinstance(value, list)
        for value in (owners, premises, responsibility_subjects, blocking_codes)
    ):
        raise ContextCompileError("canonical owner bundle row sets are invalid")
    if any(not isinstance(code, str) or not SAFE_PUBLIC_ID_RE.fullmatch(code) for code in blocking_codes):
        raise ContextCompileError("canonical owner bundle blocking code is invalid")
    if len(blocking_codes) != len(set(blocking_codes)):
        raise ContextCompileError("canonical owner bundle has duplicate blocking codes")

    owner_rows = {
        str(row.get("owner_id")): row for row in owners if isinstance(row, Mapping)
    }
    if len(owner_rows) != len(owners) or set(owner_rows) != set(owner_declarations):
        raise ContextCompileError("canonical owner bundle owner set mismatch")
    repository_specs = workspace_profile.get("repositories")
    if not isinstance(repository_specs, Mapping):
        raise ContextCompileError("workspace repository profile is invalid")
    expected_blocking: set[str] = set()
    workspace_commits: dict[str, str] = {}
    for owner_id, declaration in owner_declarations.items():
        row = owner_rows[owner_id]
        repository_key = str(declaration["repository_key"])
        repository_root = repository_roots.get(repository_key)
        repository_spec = repository_specs.get(repository_key)
        if repository_root is None or not repository_root.is_dir():
            raise ContextCompileError(
                f"canonical owner repository is not materialized: {repository_key}"
            )
        if not isinstance(repository_spec, Mapping):
            raise ContextCompileError(
                f"canonical owner repository is not workspace-declared: {repository_key}"
            )
        workspace_head = workspace_commits.get(repository_key)
        if workspace_head is None:
            workspace_head = _validated_workspace_commit(
                repository_key=repository_key,
                repository_root=repository_root,
                workspace_exact_refs=workspace_exact_refs,
            )
            workspace_commits[repository_key] = workspace_head
        repository = str(repository_spec.get("repository") or "")
        expected_url = f"https://github.com/{repository}.git"
        if (
            row.get("repository_key") != repository_key
            or row.get("repository") != repository
            or row.get("canonical_url") != expected_url
            or row.get("ref") != declaration.get("remote_ref")
            or row.get("required") is not declaration.get("required")
            or row.get("access_mode") != "READ_ONLY_EXACT_REF"
        ):
            raise ContextCompileError(f"canonical owner declaration mismatch: {owner_id}")
        for field in (
            "workspace_incorporation_claim",
            "write_authority",
            "merge_required",
            "rebase_required",
            "integration_required",
        ):
            if row.get(field) is not False:
                raise ContextCompileError(f"canonical owner grants forbidden {field}")
        relation = str(row.get("relation") or "")
        if row.get("workspace_material_commit") != workspace_head:
            raise ContextCompileError(
                f"canonical owner workspace material commit mismatch: {owner_id}"
            )
        if relation not in CANONICAL_OWNER_RELATIONS:
            raise ContextCompileError(f"canonical owner relation is invalid: {owner_id}")
        if relation == "REMOTE_UNRESOLVED":
            _require_exact_keys(
                row,
                BUNDLE_UNRESOLVED_OWNER_KEYS,
                f"unresolved canonical owner {owner_id}",
            )
            if any(
                row.get(field) is not None
                for field in (
                    "first_resolved_head",
                    "fetched_namespace_head",
                    "pre_publish_resolved_head",
                )
            ):
                raise ContextCompileError(
                    f"unresolved canonical owner carries resolved identity: {owner_id}"
                )
            if (
                row.get("reason_code") != "CANONICAL_OWNER_REMOTE_UNRESOLVED"
                or row.get("owner_side_unique_commit_count") is not None
                or row.get("workspace_side_unique_commit_count") is not None
                or row.get("owner_side_changes") != []
                or row.get("workspace_side_changes") != []
                or row.get("owner_side_changed_paths") != []
                or row.get("workspace_side_changed_paths") != []
            ):
                raise ContextCompileError(
                    f"unresolved canonical owner shape mismatch: {owner_id}"
                )
            if declaration.get("required"):
                expected_blocking.add("CANONICAL_OWNER_REMOTE_UNRESOLVED")
            continue
        _require_exact_keys(
            row,
            BUNDLE_RESOLVED_OWNER_KEYS,
            f"resolved canonical owner {owner_id}",
        )
        heads = [
            str(row.get(field) or "")
            for field in (
                "first_resolved_head",
                "fetched_namespace_head",
                "pre_publish_resolved_head",
            )
        ]
        if not all(GIT_SHA_RE.fullmatch(value) for value in heads) or len(set(heads)) != 1:
            raise ContextCompileError(f"canonical owner exact3 mismatch: {owner_id}")
        owner_head = heads[0]
        namespace = str(row.get("namespace") or "")
        if namespace != _expected_owner_namespace(task, owner_id):
            raise ContextCompileError(f"canonical owner namespace is invalid: {owner_id}")
        if (
            _git_text(
                repository_root, "rev-parse", "--verify", f"{namespace}^{{commit}}"
            )
            != owner_head
        ):
            raise ContextCompileError(f"canonical owner namespace moved: {owner_id}")
        if _actual_owner_relation(repository_root, workspace_head, owner_head) != relation:
            raise ContextCompileError(f"canonical owner relation mismatch: {owner_id}")
        merge_base = _git_text(repository_root, "merge-base", workspace_head, owner_head)
        if row.get("merge_base") != merge_base:
            raise ContextCompileError(f"canonical owner merge base mismatch: {owner_id}")
        owner_count = int(
            _git_text(
                repository_root,
                "rev-list",
                "--count",
                f"{workspace_head}..{owner_head}",
            )
        )
        workspace_count = int(
            _git_text(
                repository_root,
                "rev-list",
                "--count",
                f"{owner_head}..{workspace_head}",
            )
        )
        if (
            type(row.get("owner_side_unique_commit_count")) is not int
            or row.get("owner_side_unique_commit_count") != owner_count
            or type(row.get("workspace_side_unique_commit_count")) is not int
            or row.get("workspace_side_unique_commit_count") != workspace_count
        ):
            raise ContextCompileError(
                f"canonical owner unique-commit count mismatch: {owner_id}"
            )
        owner_changes = _owner_diff_evidence(
            repository_root, merge_base, owner_head
        )
        workspace_changes = _owner_diff_evidence(
            repository_root, merge_base, workspace_head
        )
        if (
            row.get("owner_side_changes") != owner_changes
            or row.get("workspace_side_changes") != workspace_changes
        ):
            raise ContextCompileError(
                f"canonical owner structured change mismatch: {owner_id}"
            )
        owner_paths = _owner_changed_path_projection(owner_changes)
        workspace_paths = _owner_changed_path_projection(workspace_changes)
        if (
            row.get("owner_side_changed_paths") != owner_paths
            or row.get("workspace_side_changed_paths") != workspace_paths
        ):
            raise ContextCompileError(f"canonical owner changed-path mismatch: {owner_id}")

    premise_rows = {
        str(row.get("premise_id")): row
        for row in premises
        if isinstance(row, Mapping)
    }
    if len(premise_rows) != len(premises) or set(premise_rows) != set(
        premise_declarations
    ):
        raise ContextCompileError("canonical owner bundle premise set mismatch")
    for premise_id, declaration in premise_declarations.items():
        row = premise_rows[premise_id]
        owner_id = str(declaration["owner_id"])
        owner = owner_rows[owner_id]
        repository_key = str(declaration["repository_key"])
        if owner.get("relation") == "REMOTE_UNRESOLVED":
            _require_exact_keys(
                row,
                BUNDLE_UNRESOLVED_OWNER_PREMISE_KEYS,
                f"unresolved canonical premise {premise_id}",
            )
        elif row.get("status") == "RESOLVED":
            _require_exact_keys(
                row,
                BUNDLE_RESOLVED_PREMISE_KEYS,
                f"resolved canonical premise {premise_id}",
            )
        else:
            _require_exact_keys(
                row,
                BUNDLE_UNRESOLVED_BLOB_PREMISE_KEYS,
                f"unresolved canonical premise {premise_id}",
            )
        if (
            row.get("owner_id") != owner_id
            or row.get("repository_key") != repository_key
            or row.get("path") != declaration.get("path")
            or row.get("required") is not declaration.get("required")
            or row.get("entry_chain_order") != declaration.get("entry_chain_order")
            or row.get("expected_identity_policy")
            != declaration.get("expected_identity_policy")
        ):
            raise ContextCompileError(f"canonical premise declaration mismatch: {premise_id}")
        if owner.get("relation") == "REMOTE_UNRESOLVED":
            if (
                row.get("status") != "UNRESOLVED"
                or row.get("reason_code") != "REQUIRED_PREMISE_OWNER_UNRESOLVED"
                or row.get("fresh") is not False
                or row.get("selected") is not False
            ):
                raise ContextCompileError(f"canonical premise unresolved state mismatch: {premise_id}")
            if declaration.get("required"):
                expected_blocking.add("REQUIRED_PREMISE_OWNER_UNRESOLVED")
            continue
        if row.get("status") == "UNRESOLVED":
            if (
                row.get("reason_code")
                != "REQUIRED_PREMISE_MISSING_OR_UNREADABLE"
                or row.get("fresh") is not False
                or row.get("selected") is not False
                or row.get("resolved_commit")
                != owner.get("fetched_namespace_head")
            ):
                raise ContextCompileError(
                    f"canonical premise unresolved state mismatch: {premise_id}"
                )
            actual_blob = _regular_blob_identity(
                repository_roots[repository_key],
                str(row["resolved_commit"]),
                str(row["path"]),
            )
            if actual_blob is not None:
                raise ContextCompileError(
                    f"canonical premise false-unresolved state: {premise_id}"
                )
            if declaration.get("required"):
                expected_blocking.add(
                    "REQUIRED_PREMISE_MISSING_OR_UNREADABLE"
                )
            continue
        if (
            row.get("status") != "RESOLVED"
            or row.get("reason_code") != "PREMISE_EXACT_OWNER_BLOB_RESOLVED"
            or row.get("fresh") is not True
            or row.get("selected") is not True
            or row.get("resolved_commit") != owner.get("fetched_namespace_head")
        ):
            raise ContextCompileError(f"canonical premise is not exact/fresh: {premise_id}")
        _verify_commit_blob(
            repository_roots[repository_key],
            str(row["resolved_commit"]),
            str(row["path"]),
            str(row.get("resolved_blob_sha") or ""),
        )
        actual_metadata = extract_restricted_metadata(
            _git_blob_prefix(
                repository_roots[repository_key],
                str(row["resolved_blob_sha"]),
            ),
            (),
        )
        if row.get("metadata") != actual_metadata:
            raise ContextCompileError(
                f"canonical premise metadata mismatch: {premise_id}"
            )

    subject_rows = {
        str(row.get("responsibility_id")): row
        for row in responsibility_subjects
        if isinstance(row, Mapping)
    }
    if len(subject_rows) != len(responsibility_subjects) or set(subject_rows) != set(
        responsibility_declarations
    ):
        raise ContextCompileError(
            "canonical owner bundle responsibility subject set mismatch"
        )
    for responsibility_id, declaration in responsibility_declarations.items():
        row = subject_rows[responsibility_id]
        locator = declaration["subject_locator"]
        owner_id = str(locator["owner_id"])
        owner = owner_rows[owner_id]
        repository_key = str(locator["repository_key"])
        if owner.get("relation") == "REMOTE_UNRESOLVED":
            _require_exact_keys(
                row,
                BUNDLE_UNRESOLVED_OWNER_RESPONSIBILITY_SUBJECT_KEYS,
                f"unresolved responsibility subject {responsibility_id}",
            )
        elif row.get("status") == "RESOLVED":
            _require_exact_keys(
                row,
                BUNDLE_RESOLVED_RESPONSIBILITY_SUBJECT_KEYS,
                f"resolved responsibility subject {responsibility_id}",
            )
        else:
            _require_exact_keys(
                row,
                BUNDLE_UNRESOLVED_BLOB_RESPONSIBILITY_SUBJECT_KEYS,
                f"unresolved responsibility subject {responsibility_id}",
            )
        if (
            row.get("owner_id") != owner_id
            or row.get("repository_key") != repository_key
            or row.get("path") != locator.get("path")
        ):
            raise ContextCompileError(
                f"responsibility subject declaration mismatch: {responsibility_id}"
            )
        if owner.get("relation") == "REMOTE_UNRESOLVED":
            if (
                row.get("status") != "UNRESOLVED"
                or row.get("reason_code")
                != "RESPONSIBILITY_SUBJECT_OWNER_UNRESOLVED"
                or row.get("fresh") is not False
            ):
                raise ContextCompileError(
                    f"responsibility subject unresolved state mismatch: {responsibility_id}"
                )
            expected_blocking.add("RESPONSIBILITY_SUBJECT_OWNER_UNRESOLVED")
            continue
        if row.get("status") == "UNRESOLVED":
            if (
                row.get("reason_code")
                != "RESPONSIBILITY_SUBJECT_MISSING_OR_UNREADABLE"
                or row.get("fresh") is not False
                or row.get("resolved_commit")
                != owner.get("fetched_namespace_head")
            ):
                raise ContextCompileError(
                    "responsibility subject unresolved state mismatch: "
                    f"{responsibility_id}"
                )
            actual_blob = _regular_blob_identity(
                repository_roots[repository_key],
                str(row["resolved_commit"]),
                str(row["path"]),
            )
            if actual_blob is not None:
                raise ContextCompileError(
                    "responsibility subject false-unresolved state: "
                    f"{responsibility_id}"
                )
            expected_blocking.add(
                "RESPONSIBILITY_SUBJECT_MISSING_OR_UNREADABLE"
            )
            continue
        if (
            row.get("status") != "RESOLVED"
            or row.get("reason_code")
            != "RESPONSIBILITY_SUBJECT_EXACT_OWNER_BLOB_RESOLVED"
            or row.get("fresh") is not True
            or row.get("resolved_commit") != owner.get("fetched_namespace_head")
        ):
            raise ContextCompileError(
                f"responsibility subject is not exact/fresh: {responsibility_id}"
            )
        _verify_commit_blob(
            repository_roots[repository_key],
            str(row["resolved_commit"]),
            str(row["path"]),
            str(row.get("resolved_blob_sha") or ""),
        )
        assertions = declaration.get("metadata_assertions", [])
        maximum = (
            64 * 1024
            if any(
                isinstance(assertion, Mapping)
                and assertion.get("metadata_kind") == "JSON_POINTER"
                for assertion in assertions
            )
            else 16 * 1024
        )
        actual_metadata = extract_restricted_metadata(
            _git_blob_prefix(
                repository_roots[repository_key],
                str(row["resolved_blob_sha"]),
                maximum=maximum,
            ),
            assertions,
        )
        if row.get("metadata") != actual_metadata:
            raise ContextCompileError(
                f"responsibility subject metadata mismatch: {responsibility_id}"
            )
    if blocking_codes != sorted(expected_blocking):
        raise ContextCompileError("canonical owner bundle blocker set mismatch")
    return bundle


@dataclass(frozen=True)
class LogicalInput:
    logical_path: Path
    parts: tuple[Path, ...]
    logical_sha256: str
    logical_size: int
    transported: bool
    transport_manifest_sha256: str | None


def _safe_relative_path(raw: str) -> PurePosixPath:
    value = PurePosixPath(str(raw))
    if value.is_absolute() or not value.parts or any(
        part in {"", ".", ".."} for part in value.parts
    ):
        raise ContextCompileError(f"unsafe publication transport path: {raw!r}")
    return value


def _transport_root_for(path: Path) -> Path | None:
    path = path.resolve()
    for candidate in (path.parent, *path.parents):
        manifest = candidate / PUBLICATION_TRANSPORT_NAME
        if manifest.is_file():
            try:
                path.relative_to(candidate)
            except ValueError:
                continue
            return candidate
    return None


@lru_cache(maxsize=64)
def _logical_input_cached(path_text: str) -> LogicalInput:
    path = Path(path_text).resolve()
    if path.is_file():
        return LogicalInput(
            logical_path=path,
            parts=(path,),
            logical_sha256=_sha256_file(path),
            logical_size=path.stat().st_size,
            transported=False,
            transport_manifest_sha256=None,
        )

    root = _transport_root_for(path)
    if root is None:
        raise ContextCompileError(f"required logical file is missing: {path}")
    manifest_path = root / PUBLICATION_TRANSPORT_NAME
    manifest = _read_json(manifest_path)
    if not isinstance(manifest, dict) or manifest.get("schema_version") != PUBLICATION_TRANSPORT_SCHEMA:
        raise ContextCompileError(
            f"unsupported publication transport schema: {manifest_path}"
        )
    try:
        logical_relative = path.relative_to(root).as_posix()
    except ValueError as exc:  # pragma: no cover - guarded by root discovery
        raise ContextCompileError(f"logical path escapes transport root: {path}") from exc
    records = manifest.get("logical_files")
    if not isinstance(records, list):
        raise ContextCompileError(f"publication transport logical_files is invalid: {manifest_path}")
    matches = [
        row for row in records
        if isinstance(row, dict) and str(row.get("logical_path") or "") == logical_relative
    ]
    if len(matches) != 1:
        raise ContextCompileError(
            f"logical file is not declared exactly once by publication transport: {logical_relative}"
        )
    record = matches[0]
    if record.get("representation") != "ORDERED_BYTE_CONCATENATION":
        raise ContextCompileError(
            f"unsupported publication representation: {logical_relative}"
        )
    expected_sha = str(record.get("logical_sha256") or "")
    expected_size = record.get("logical_size")
    if not SHA256_RE.fullmatch(expected_sha) or not isinstance(expected_size, int):
        raise ContextCompileError(
            f"invalid logical identity in publication transport: {logical_relative}"
        )
    raw_parts = record.get("parts")
    if not isinstance(raw_parts, list) or not raw_parts:
        raise ContextCompileError(
            f"publication transport parts are missing: {logical_relative}"
        )

    logical_digest = hashlib.sha256()
    logical_size = 0
    part_paths: list[Path] = []
    seen: set[str] = set()
    for raw_part in raw_parts:
        if not isinstance(raw_part, dict):
            raise ContextCompileError(
                f"publication transport part is not an object: {logical_relative}"
            )
        relative = _safe_relative_path(str(raw_part.get("path") or ""))
        relative_text = relative.as_posix()
        if relative_text in seen:
            raise ContextCompileError(f"duplicate publication part: {relative_text}")
        seen.add(relative_text)
        part_path = root.joinpath(*relative.parts)
        if not part_path.is_file():
            raise ContextCompileError(f"publication part is missing: {part_path}")
        expected_part_size = raw_part.get("size")
        expected_part_sha = str(raw_part.get("sha256") or "")
        if not isinstance(expected_part_size, int) or not SHA256_RE.fullmatch(expected_part_sha):
            raise ContextCompileError(f"invalid publication part identity: {relative_text}")
        part_digest = hashlib.sha256()
        part_size = 0
        with part_path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                part_digest.update(chunk)
                logical_digest.update(chunk)
                part_size += len(chunk)
                logical_size += len(chunk)
        if part_size != expected_part_size:
            raise ContextCompileError(f"publication part size mismatch: {relative_text}")
        if part_digest.hexdigest() != expected_part_sha:
            raise ContextCompileError(f"publication part SHA-256 mismatch: {relative_text}")
        part_paths.append(part_path)

    if logical_size != expected_size:
        raise ContextCompileError(f"logical file size mismatch: {logical_relative}")
    actual_sha = logical_digest.hexdigest()
    if actual_sha != expected_sha:
        raise ContextCompileError(f"logical file SHA-256 mismatch: {logical_relative}")
    return LogicalInput(
        logical_path=path,
        parts=tuple(part_paths),
        logical_sha256=actual_sha,
        logical_size=logical_size,
        transported=True,
        transport_manifest_sha256=_sha256_file(manifest_path),
    )


def _logical_input(path: Path) -> LogicalInput:
    return _logical_input_cached(str(path.resolve()))


def _logical_sha256(path: Path) -> str:
    return _logical_input(path).logical_sha256


def _iter_jsonl(path: Path) -> Iterator[Mapping[str, Any]]:
    logical = _logical_input(path)
    line_number = 0
    for source_path in logical.parts:
        try:
            stream = source_path.open("r", encoding="utf-8")
        except FileNotFoundError as exc:  # pragma: no cover - logical validation guards this
            raise ContextCompileError(f"required JSONL part is missing: {source_path}") from exc
        with stream:
            for line in stream:
                line_number += 1
                if not line.strip():
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError as exc:
                    raise ContextCompileError(
                        f"invalid JSONL: {path}:{line_number}: {exc}"
                    ) from exc
                if not isinstance(row, dict):
                    raise ContextCompileError(
                        f"JSONL row must be an object: {path}:{line_number}"
                    )
                yield row


def _write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def _write_jsonl(path: Path, rows: Iterable[Mapping[str, Any]]) -> None:
    data = b"".join(_canonical_json_bytes(row) for row in rows)
    _write_bytes(path, data)


def _first_string(row: Mapping[str, Any], keys: Sequence[str]) -> str:
    for key in keys:
        value = row.get(key)
        if isinstance(value, str) and value:
            return value
    return ""


def _normalize_repository(value: str) -> str:
    if not value:
        return ""
    return value.rsplit("/", 1)[-1]


def _normalize_path(value: str) -> str:
    value = value.replace("\\", "/").strip()
    while value.startswith("./"):
        value = value[2:]
    return str(PurePosixPath(value)) if value else ""


def _is_test_path(path: str) -> bool:
    parts = PurePosixPath(path).parts
    name = PurePosixPath(path).name
    return (
        any(part in {"test", "tests", "__tests__", "spec", "specs"} for part in parts)
        or name.startswith("test_")
        or ".test." in name
        or ".spec." in name
    )


def _inventory_record(row: Mapping[str, Any]) -> FileRecord:
    repository_key = _normalize_repository(_first_string(row, REPOSITORY_KEYS))
    path = _normalize_path(_first_string(row, PATH_KEYS))
    if not repository_key or not path:
        raise ContextCompileError(
            "inventory row lacks canonical repository/path identity: "
            + json.dumps(row, ensure_ascii=False, sort_keys=True)[:500]
        )
    source_commit = _first_string(
        row, ("source_commit", "commit", "repository_commit", "commit_sha")
    )
    blob_sha = _first_string(row, ("blob_sha", "git_blob_sha", "oid", "object_sha"))
    content_sha256 = _first_string(
        row, ("content_sha256", "sha256", "content_hash", "hash")
    )
    identity = _first_string(row, ("file_identity", "identity", "file_id"))
    if not identity:
        identity_payload = {
            "repository_key": repository_key,
            "path": path,
            "source_commit": source_commit,
            "blob_sha": blob_sha,
            "content_sha256": content_sha256,
        }
        identity = "file:" + _sha256_bytes(_canonical_json_bytes(identity_payload))
    size_value = row.get("size_bytes", row.get("size", row.get("object_size")))
    size_bytes = size_value if isinstance(size_value, int) else None
    classification = _first_string(
        row, ("classification", "initial_classification", "file_role", "kind", "file_type")
    )
    return FileRecord(
        identity=identity,
        repository_key=repository_key,
        path=path,
        source_commit=source_commit,
        blob_sha=blob_sha,
        content_sha256=content_sha256,
        size_bytes=size_bytes,
        inventory_classification=classification,
        raw=row,
    )


def _metadata_for_record(
    record: FileRecord,
    repository_roots: Mapping[str, Path],
    assertions: Sequence[Mapping[str, Any]] = (),
) -> Mapping[str, Any]:
    suffix = PurePosixPath(record.path).suffix.lower()
    has_json_pointer = any(
        row.get("metadata_kind") == "JSON_POINTER" for row in assertions
    )
    if suffix not in {".md", ".txt", ".rst", ".adoc"} and not (
        suffix == ".json" and has_json_pointer
    ):
        return {"status": "ABSENT", "reason_code": "FRONT_MATTER_NOT_APPLICABLE", "fields": {}}
    root = repository_roots.get(record.repository_key)
    if root is None or not record.blob_sha:
        return {"status": "UNRESOLVED_METADATA", "reason_code": "METADATA_BLOB_UNAVAILABLE", "fields": {}}
    try:
        maximum = 64 * 1024 if has_json_pointer else 16 * 1024
        return extract_restricted_metadata(
            _git_blob_prefix(root, record.blob_sha, maximum=maximum), assertions
        )
    except ContextCompileError:
        return {"status": "UNRESOLVED_METADATA", "reason_code": "METADATA_BLOB_UNREADABLE", "fields": {}}


def _apply_required_premise_seeds(
    task_profile: Mapping[str, Any],
    by_key: Mapping[tuple[str, str], FileRecord],
    reasons: dict[str, set[str]],
    requested_classification: dict[str, str],
    canonical_owner_bundle: Mapping[str, Any],
) -> None:
    contract = task_profile.get("operator_contract")
    if not isinstance(contract, dict):
        return
    resolved_by_id = {
        str(row.get("premise_id")): row
        for row in canonical_owner_bundle.get("premises", [])
        if isinstance(row, Mapping)
    }
    for premise in contract.get("required_premises", []):
        if not isinstance(premise, dict):
            continue
        key = (
            _normalize_repository(str(premise.get("repository_key") or "")),
            _normalize_path(str(premise.get("path") or "")),
        )
        record = by_key.get(key)
        if record is None:
            # Owner-side premise identity remains available in the resolved
            # bundle even when the workspace snapshot does not contain it.
            continue
        premise_id = str(premise["premise_id"])
        binding = resolved_by_id.get(premise_id)
        if (
            not isinstance(binding, Mapping)
            or binding.get("status") != "RESOLVED"
            or binding.get("fresh") is not True
            or record.blob_sha != binding.get("resolved_blob_sha")
        ):
            # Never relabel a workspace blob as the selected owner-ref premise.
            # The owner-ref route remains visible in the Unit A premise model.
            continue
        reasons[record.identity].add(f"required_premise:{premise_id}")
        requested = str(premise.get("read_tier") or "MUST_READ_FULL")
        classification = (
            "MUST_READ_FULL"
            if requested in {"DECISION_SURFACE", "MUST_READ_FULL"}
            else "REFERENCE_AS_NEEDED"
        )
        old = requested_classification.get(record.identity)
        if old is None or CLASSIFICATION_PRIORITY[classification] < CLASSIFICATION_PRIORITY[old]:
            requested_classification[record.identity] = classification


def _stable_conflict_id(payload: Mapping[str, Any]) -> str:
    return "CONFLICT." + _sha256_bytes(_canonical_json_bytes(payload))[:24].upper()


def build_premise_management_model(
    *,
    task_profile: Mapping[str, Any],
    by_identity: Mapping[str, FileRecord],
    by_key: Mapping[tuple[str, str], FileRecord],
    requested_classification: Mapping[str, str],
    repository_roots: Mapping[str, Path],
    canonical_owner_bundle: Mapping[str, Any],
) -> Mapping[str, Any]:
    """Bind Unit A responsibility, metadata, conflict, and premise facts.

    The result contains stable public facts only.  It never carries document
    body text, summaries, content-derived hashes, or inferred write authority.
    """
    contract = task_profile.get("operator_contract")
    if not isinstance(contract, dict):
        return {
            "schema_version": "cocolon.system_context.premise_management.v1",
            "status": "LEGACY_V1_COMPATIBILITY",
            "task_orientation": {
                "value": str(task_profile.get("purpose") or ""),
                "authority_claim": False,
                "provenance": "LEGACY_V1_MIGRATION_DISPLAY_ONLY",
            },
            "responsibilities": [],
            "premises": [],
            "conflicts": [],
            "bindings_by_identity": {},
            "blocking_codes": [],
        }

    owners = canonical_owner_bundle.get("owners")
    premise_bindings = canonical_owner_bundle.get("premises")
    if not isinstance(owners, list) or not isinstance(premise_bindings, list):
        raise ContextCompileError("canonical owner bundle is malformed")
    owner_by_id = {
        str(row.get("owner_id")): row for row in owners if isinstance(row, dict)
    }
    owner_declaration_by_id = {
        str(row.get("owner_id")): row
        for row in contract["canonical_owner_refs"]
        if isinstance(row, dict)
    }
    public_owners: list[dict[str, Any]] = []
    for owner_id in sorted(owner_by_id):
        row = owner_by_id[owner_id]
        declaration = owner_declaration_by_id.get(owner_id, {})
        public_owners.append(
            {
                "owner_id": owner_id,
                "responsibility": declaration.get("responsibility"),
                "repository_key": row.get("repository_key"),
                "repository": row.get("repository"),
                "remote_ref": row.get("ref"),
                "public_pr_number_or_locator": declaration.get(
                    "public_pr_number_or_locator"
                ),
                "required": row.get("required"),
                "access_mode": row.get("access_mode"),
                "workspace_material_commit": row.get(
                    "workspace_material_commit"
                ),
                "first_resolved_head": row.get("first_resolved_head"),
                "fetched_namespace_head": row.get("fetched_namespace_head"),
                "pre_publish_resolved_head": row.get(
                    "pre_publish_resolved_head"
                ),
                "relation": row.get("relation"),
                "merge_base": row.get("merge_base"),
                "owner_side_unique_commit_count": row.get(
                    "owner_side_unique_commit_count"
                ),
                "workspace_side_unique_commit_count": row.get(
                    "workspace_side_unique_commit_count"
                ),
                "owner_side_changes": row.get("owner_side_changes", []),
                "workspace_side_changes": row.get("workspace_side_changes", []),
                "owner_side_changed_paths": row.get(
                    "owner_side_changed_paths", []
                ),
                "workspace_side_changed_paths": row.get(
                    "workspace_side_changed_paths", []
                ),
                "claim_boundary": declaration.get("claim_boundary"),
                "assertion_provenance": declaration.get(
                    "assertion_provenance"
                ),
                "source_locator": declaration.get("source_locator"),
                "workspace_incorporation_claim": False,
                "write_authority": False,
                "merge_required": False,
                "rebase_required": False,
                "integration_required": False,
            }
        )
    premise_by_id = {
        str(row.get("premise_id")): row
        for row in premise_bindings
        if isinstance(row, dict)
    }
    blocking_codes = {
        str(item) for item in canonical_owner_bundle.get("blocking_codes", [])
    }
    normalized_premises: list[dict[str, Any]] = []
    for premise in contract["required_premises"]:
        premise_id = str(premise["premise_id"])
        binding = premise_by_id.get(premise_id)
        if binding is None:
            blocking_codes.add("REQUIRED_PREMISE_BINDING_MISSING")
            normalized_premises.append(
                {
                    "premise_id": premise_id,
                    "responsibility": str(premise.get("responsibility") or ""),
                    "status": "UNRESOLVED",
                    "reason_code": "REQUIRED_PREMISE_BINDING_MISSING",
                    "required": bool(premise.get("required", True)),
                    "entry_chain_order": premise["entry_chain_order"],
                    "repository_key": premise["repository_key"],
                    "path": premise["path"],
                    "owner_id": premise["owner_id"],
                    "read_tier": premise["read_tier"],
                    "expected_identity_policy": premise[
                        "expected_identity_policy"
                    ],
                    "selected": False,
                    "fresh": False,
                    "read_target_status": "UNRESOLVED",
                    "owner_read_order": premise["entry_chain_order"],
                    "assertion_provenance": premise["assertion_provenance"],
                    "required_roles": list(premise["required_roles"]),
                    "source_locator": dict(premise["source_locator"]),
                }
            )
            continue
        if (
            binding.get("owner_id") != premise.get("owner_id")
            or binding.get("repository_key") != premise.get("repository_key")
            or binding.get("path") != premise.get("path")
        ):
            raise ContextCompileError(
                f"canonical premise binding identity mismatch: {premise_id}"
            )
        status = str(binding.get("status") or "UNRESOLVED")
        if bool(premise.get("required", True)) and status != "RESOLVED":
            blocking_codes.add(str(binding.get("reason_code") or "REQUIRED_PREMISE_UNRESOLVED"))
        workspace_record = by_key.get(
            (
                _normalize_repository(str(premise["repository_key"])),
                _normalize_path(str(premise["path"])),
            )
        )
        workspace_blob_matches_owner = bool(
            workspace_record is not None
            and workspace_record.blob_sha == binding.get("resolved_blob_sha")
        )
        selected = bool(binding.get("selected", status == "RESOLVED"))
        fresh = bool(binding.get("fresh", status == "RESOLVED"))
        read_target_status = (
            "OWNER_REF_EXACT_BLOB_SELECTED"
            if status == "RESOLVED" and selected and fresh
            else "OWNER_REF_READ_TARGET_UNRESOLVED"
        )
        normalized_premises.append(
            {
                "premise_id": premise_id,
                "responsibility": str(premise.get("responsibility") or ""),
                "repository_key": str(premise["repository_key"]),
                "path": str(premise["path"]),
                "owner_id": str(premise["owner_id"]),
                "required": bool(premise.get("required", True)),
                "entry_chain_order": int(premise["entry_chain_order"]),
                "read_tier": str(premise["read_tier"]),
                "expected_identity_policy": str(premise["expected_identity_policy"]),
                "resolved_commit": binding.get("resolved_commit"),
                "resolved_blob_sha": binding.get("resolved_blob_sha"),
                "selected": selected,
                "fresh": fresh,
                "read_target_status": read_target_status,
                "owner_read_order": int(premise["entry_chain_order"]),
                "workspace_record_identity": (
                    workspace_record.identity if workspace_record is not None else None
                ),
                "workspace_inventory_source_commit": (
                    workspace_record.source_commit
                    if workspace_record is not None
                    else None
                ),
                "workspace_blob_sha": (
                    workspace_record.blob_sha if workspace_record is not None else None
                ),
                "workspace_blob_matches_owner": workspace_blob_matches_owner,
                "workspace_selection_status": (
                    "WORKSPACE_IDENTICAL_BLOB_SELECTED"
                    if workspace_blob_matches_owner
                    else "OWNER_REF_ROUTING_ONLY"
                ),
                "status": status,
                "reason_code": str(binding.get("reason_code") or "PREMISE_RESOLVED"),
                "assertion_provenance": str(premise["assertion_provenance"]),
                "required_roles": list(premise["required_roles"]),
                "source_locator": dict(premise["source_locator"]),
                "metadata": binding.get(
                    "metadata",
                    {"status": "ABSENT", "reason_code": "FRONT_MATTER_ABSENT", "fields": {}},
                ),
            }
        )
    normalized_premises.sort(
        key=lambda row: (
            row["entry_chain_order"], row["repository_key"], row["path"], row["premise_id"]
        )
    )

    premise_metadata = {
        (str(row["repository_key"]), str(row["path"])): row.get("metadata", {})
        for row in normalized_premises
    }
    responsibility_subjects = canonical_owner_bundle.get(
        "responsibility_subjects", []
    )
    if not isinstance(responsibility_subjects, list):
        raise ContextCompileError("canonical responsibility subject bindings are malformed")
    responsibility_binding_by_id = {
        str(row.get("responsibility_id")): row
        for row in responsibility_subjects
        if isinstance(row, dict)
    }
    responsibilities: list[dict[str, Any]] = []
    bindings_by_identity: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"responsibility_ids": [], "conflict_ids": []}
    )
    responsibility_by_scope: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    conflicts: list[dict[str, Any]] = []
    for row in contract["document_responsibilities"]:
        locator = row["subject_locator"]
        key = (
            _normalize_repository(str(locator["repository_key"])),
            _normalize_path(str(locator["path"])),
        )
        record = by_key.get(key)
        owner_binding = responsibility_binding_by_id.get(
            str(row["responsibility_id"])
        )
        metadata = (
            owner_binding.get("metadata")
            if isinstance(owner_binding, dict)
            and owner_binding.get("status") == "RESOLVED"
            and isinstance(owner_binding.get("metadata"), dict)
            else _metadata_for_record(
                record, repository_roots, row.get("metadata_assertions", [])
            )
            if record is not None
            else premise_metadata.get(
                key,
                {"status": "UNRESOLVED_METADATA", "reason_code": "RESPONSIBILITY_SUBJECT_NOT_IN_WORKSPACE_OR_OWNER_PREMISES", "fields": {}},
            )
        )
        normalized = {
            "responsibility_id": str(row["responsibility_id"]),
            "subject_locator": {
                "repository_key": key[0],
                "owner_id": str(locator["owner_id"]),
                "path": key[1],
            },
            "responsibility_kind": str(row["responsibility_kind"]),
            "lifecycle": str(row["lifecycle"]),
            "publication_state": str(row.get("publication_state") or "UNRESOLVED"),
            "authority_kind": str(row["authority_kind"]),
            "effective_condition": str(row.get("effective_condition") or "UNRESOLVED"),
            "supersedes": sorted(str(item) for item in row.get("supersedes", [])),
            "superseded_by": sorted(str(item) for item in row.get("superseded_by", [])),
            "metadata_assertions": sorted(
                (dict(item) for item in row.get("metadata_assertions", [])),
                key=lambda item: _canonical_json_bytes(item),
            ),
            "assertion_provenance": str(row["assertion_provenance"]),
            "source_locator": dict(row["source_locator"]),
            "workspace_subject_identity": (
                record.identity if record is not None else None
            ),
            "workspace_inventory_source_commit": (
                record.source_commit if record is not None else None
            ),
            "resolved_owner_commit": (
                owner_binding.get("resolved_commit")
                if isinstance(owner_binding, dict)
                else None
            ),
            "resolved_owner_blob_sha": (
                owner_binding.get("resolved_blob_sha")
                if isinstance(owner_binding, dict)
                else None
            ),
            "workspace_blob_matches_owner": bool(
                record is not None
                and isinstance(owner_binding, dict)
                and record.blob_sha == owner_binding.get("resolved_blob_sha")
            ),
            "metadata": metadata,
            "authority_role_declared": str(row["authority_kind"])
            in {
                "NORMATIVE_AUTHORITY",
                "DESIGN_AUTHORITY",
                "ACTUAL_SOURCE_AUTHORITY",
                "TEST_CONTRACT_AUTHORITY",
                "NAVIGATION_AUTHORITY",
            },
            "effective_authority_claim": False,
            "authority_claim_boundary": "ROLE_FACT_ONLY_NO_AUTOMATIC_EFFECTIVE_AUTHORITY",
        }
        responsibilities.append(normalized)
        scope_id = str(row.get("responsibility_scope_id") or row["responsibility_kind"])
        responsibility_by_scope[(scope_id, key[1])].append(normalized)
        if record is not None:
            bindings_by_identity[record.identity]["responsibility_ids"].append(
                normalized["responsibility_id"]
            )
        fields = metadata.get("fields", {}) if isinstance(metadata, dict) else {}
        requested = (
            requested_classification.get(record.identity)
            if record is not None
            else None
        )
        if requested == "CURRENT_OWNER" and (
            fields.get("normative_status") == "REVIEWED_NONAUTHORITY"
            or fields.get("design_authority") is False
        ):
            payload = {
                "reason_code": "LEGACY_CURRENT_OWNER_CONFLICTS_WITH_VERIFIED_NONAUTHORITY_METADATA",
                "repository_key": key[0],
                "path": key[1],
            }
            conflict_id = _stable_conflict_id(payload)
            conflict = {
                "conflict_id": conflict_id,
                **payload,
                "candidate_responsibility_ids": [normalized["responsibility_id"]],
                "resolution": "UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT",
                "handback_owner": str(fields.get("decision_owner") or "MASH"),
                "blocking": False,
            }
            if conflict_id not in {item["conflict_id"] for item in conflicts}:
                conflicts.append(conflict)
            if record is not None:
                bindings_by_identity[record.identity]["conflict_ids"].append(
                    conflict_id
                )

        assertions = normalized["metadata_assertions"]
        if metadata.get("status") == "UNRESOLVED_METADATA":
            is_blocking = bool(assertions)
            payload = {
                "reason_code": str(
                    metadata.get("reason_code") or "UNRESOLVED_METADATA"
                ),
                "repository_key": key[0],
                "path": key[1],
                "responsibility_id": normalized["responsibility_id"],
            }
            conflict_id = _stable_conflict_id(payload)
            conflicts.append(
                {
                    "conflict_id": conflict_id,
                    **payload,
                    "candidate_responsibility_ids": [
                        normalized["responsibility_id"]
                    ],
                    "resolution": "UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT",
                    "handback_owner": "MASH",
                    "blocking": is_blocking,
                }
            )
            if is_blocking:
                blocking_codes.add("DECLARED_METADATA_ASSERTION_UNRESOLVED")
            if record is not None:
                bindings_by_identity[record.identity]["conflict_ids"].append(
                    conflict_id
                )
        else:
            json_results = {
                str(item.get("metadata_key")): item
                for item in metadata.get("json_pointer_assertions", [])
                if isinstance(item, Mapping)
            }
            for assertion in assertions:
                metadata_kind = str(assertion["metadata_kind"])
                metadata_key = str(assertion["metadata_key"])
                if metadata_kind == "FRONT_MATTER":
                    matches = _canonical_json_bytes(
                        fields.get(metadata_key)
                    ) == _canonical_json_bytes(
                        assertion.get("expected_value")
                    )
                    reason_code = "DECLARED_METADATA_ASSERTION_MISMATCH"
                else:
                    result = json_results.get(metadata_key)
                    matches = bool(
                        result
                        and result.get("verification_status") == "MATCH"
                    )
                    reason_code = str(
                        result.get("reason_code")
                        if result
                        else "JSON_POINTER_TARGET_UNRESOLVED"
                    )
                if matches:
                    continue
                payload = {
                    "reason_code": reason_code,
                    "repository_key": key[0],
                    "path": key[1],
                    "responsibility_id": normalized["responsibility_id"],
                    "metadata_kind": metadata_kind,
                    "metadata_key": metadata_key,
                }
                conflict_id = _stable_conflict_id(payload)
                conflicts.append(
                    {
                        "conflict_id": conflict_id,
                        **payload,
                        "candidate_responsibility_ids": [
                            normalized["responsibility_id"]
                        ],
                        "resolution": "UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT",
                        "handback_owner": "MASH",
                        "blocking": True,
                    }
                )
                blocking_codes.add(
                    "DECLARED_METADATA_ASSERTION_MISMATCH"
                    if reason_code == "DECLARED_METADATA_ASSERTION_MISMATCH"
                    else "DECLARED_METADATA_ASSERTION_UNRESOLVED"
                )
                if record is not None:
                    bindings_by_identity[record.identity]["conflict_ids"].append(
                        conflict_id
                    )

    for (_scope, _path), candidates in responsibility_by_scope.items():
        current = [
            row for row in candidates
            if row["lifecycle"] in {"CURRENT", "ACTIVE_ACTUAL"}
            and row["authority_role_declared"]
        ]
        if len(current) > 1:
            payload = {
                "reason_code": "MULTIPLE_CURRENT_AUTHORITY_CANDIDATES",
                "repository_key": current[0]["subject_locator"]["repository_key"],
                "path": current[0]["subject_locator"]["path"],
            }
            conflict_id = _stable_conflict_id(payload)
            conflicts.append(
                {
                    "conflict_id": conflict_id,
                    **payload,
                    "candidate_responsibility_ids": sorted(
                        row["responsibility_id"] for row in current
                    ),
                    "resolution": "UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT",
                    "handback_owner": "MASH",
                    "blocking": True,
                }
            )
            blocking_codes.add("MULTIPLE_CURRENT_AUTHORITY_CANDIDATES")
            for row in current:
                identity = row.get("workspace_subject_identity")
                if identity:
                    bindings_by_identity[str(identity)]["conflict_ids"].append(conflict_id)

    owner_changed = {
        (str(owner.get("repository_key") or ""), str(path))
        for owner in owners
        for path in owner.get("owner_side_changed_paths", [])
    }
    legacy_current = {
        (record.repository_key, record.path)
        for identity, record in by_identity.items()
        if requested_classification.get(identity) == "CURRENT_OWNER"
    }
    if owner_changed and owner_changed != legacy_current:
        owner_only = sorted(owner_changed - legacy_current)
        legacy_only = sorted(legacy_current - owner_changed)
        payload = {
            "reason_code": "OWNER_CHANGED_PATH_SET_DIFFERS_FROM_LEGACY_CURRENT_OWNER_SET",
            "owner_only_paths": [f"{repo}:{path}" for repo, path in owner_only],
            "legacy_only_paths": [f"{repo}:{path}" for repo, path in legacy_only],
        }
        conflict_id = _stable_conflict_id(payload)
        conflicts.append(
            {
                "conflict_id": conflict_id,
                **payload,
                "candidate_responsibility_ids": sorted(
                    row["responsibility_id"]
                    for row in responsibilities
                    if (
                        row["subject_locator"]["repository_key"],
                        row["subject_locator"]["path"],
                    ) in owner_changed.union(legacy_current)
                ),
                "resolution": "UNRESOLVED_OWNER_OR_LIFECYCLE_CONFLICT",
                "handback_owner": "MASH",
                "blocking": False,
            }
        )
        for key in owner_changed.union(legacy_current):
            record = by_key.get(key)
            if record is not None:
                bindings_by_identity[record.identity]["conflict_ids"].append(
                    conflict_id
                )

    for binding in bindings_by_identity.values():
        binding["responsibility_ids"] = sorted(set(binding["responsibility_ids"]))
        binding["conflict_ids"] = sorted(set(binding["conflict_ids"]))
    responsibilities.sort(key=lambda row: row["responsibility_id"])
    conflicts.sort(key=lambda row: row["conflict_id"])
    owner_ready = all(
        row.get("relation") != "REMOTE_UNRESOLVED"
        and row.get("first_resolved_head") == row.get("fetched_namespace_head") == row.get("pre_publish_resolved_head")
        for row in owners
        if row.get("required", True)
    )
    premises_ready = all(
        row["status"] == "RESOLVED"
        and row["fresh"]
        and row.get("selected") is True
        and row.get("read_target_status") == "OWNER_REF_EXACT_BLOB_SELECTED"
        for row in normalized_premises
        if row["required"]
    )
    status = (
        "UNIT_A_PREMISE_MODEL_READY"
        if owner_ready
        and premises_ready
        and not blocking_codes
        and not any(conflict.get("blocking") is True for conflict in conflicts)
        else "UNIT_A_PREMISE_MODEL_BLOCKED"
    )
    return {
        "schema_version": "cocolon.system_context.premise_management.v1",
        "status": status,
        "publication_mode": str(
            task_profile.get("publication_mode") or "EPHEMERAL_VERIFY_ONLY"
        ),
        "task_orientation": {
            "value": str(task_profile["task_orientation"]),
            "authority_claim": False,
            "provenance": "MANUAL_PROFILE_ASSERTION",
        },
        "owner_access_mode": "READ_ONLY_EXACT_REF",
        "workspace_incorporation_claim": False,
        "merge_required": False,
        "rebase_required": False,
        "integration_required": False,
        "write_authority": False,
        "owners": public_owners,
        "premises": normalized_premises,
        "responsibilities": responsibilities,
        "conflicts": conflicts,
        "bindings_by_identity": dict(bindings_by_identity),
        "blocking_codes": sorted(blocking_codes),
        "completion_claim": None,
        "v1_activation": 0,
        "product_credit": 0,
        "technical_credit": 0,
        "automatic_progression": False,
    }


def _match_path(path: str, rule: Mapping[str, Any]) -> bool:
    globs = [str(item) for item in rule.get("path_globs", [])]
    contains = [str(item).lower() for item in rule.get("path_contains_any", [])]
    excludes = [str(item) for item in rule.get("exclude_path_globs", [])]
    if excludes and any(fnmatch.fnmatchcase(path, pattern) for pattern in excludes):
        return False
    if globs and any(fnmatch.fnmatchcase(path, pattern) for pattern in globs):
        return True
    lower = path.lower()
    if contains and any(token in lower for token in contains):
        return True
    return not globs and not contains


def _match_record(record: FileRecord, rule: Mapping[str, Any]) -> bool:
    repos = {
        _normalize_repository(str(item))
        for item in rule.get("repository_keys", [])
    }
    if repos and record.repository_key not in repos:
        return False
    evidence = {str(item) for item in rule.get("evidence_kinds", [])}
    if evidence and record.evidence_kind not in evidence:
        return False
    return _match_path(record.path, rule)


def _json_strings(value: Any) -> Iterator[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, Mapping):
        for item in value.values():
            yield from _json_strings(item)
    elif isinstance(value, list):
        for item in value:
            yield from _json_strings(item)


def _resolve_string_to_identities(
    value: str,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
    repository_hint: str,
) -> list[str]:
    candidate = _normalize_path(value)
    if not candidate or candidate in {".", "/"}:
        return []
    if repository_hint:
        record = by_key.get((_normalize_repository(repository_hint), candidate))
        if record:
            return [record.identity]
    exact = by_path.get(candidate)
    if exact:
        return sorted(record.identity for record in exact)
    # Some index formats prefix a repository key in the path.
    if ":" in candidate:
        prefix, rest = candidate.split(":", 1)
        record = by_key.get((_normalize_repository(prefix), _normalize_path(rest)))
        if record:
            return [record.identity]
    return []


def _row_id(row: Mapping[str, Any], origin_file: str, ordinal: int) -> str:
    explicit = _first_string(
        row,
        (
            "edge_id",
            "reference_id",
            "route_id",
            "call_id",
            "symbol_id",
            "subject_id",
            "id",
        ),
    )
    return explicit or f"{origin_file}:{ordinal}"


def _edge(
    edge_type: str,
    source_identity: str,
    target_identity: str,
    origin_file: str,
    origin_row: str,
) -> GraphEdge:
    body = {
        "edge_type": edge_type,
        "source_identity": source_identity,
        "target_identity": target_identity,
        "origin_file": origin_file,
        "origin_row": origin_row,
    }
    return GraphEdge(
        edge_id="edge:" + _sha256_bytes(_canonical_json_bytes(body)),
        **body,
    )


def _extract_edges_from_rows(
    path: Path,
    edge_type: str,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
    symbol_owner: Mapping[str, str],
    route_owner: Mapping[str, str],
    known_identities: set[str],
) -> list[GraphEdge]:
    edges: dict[str, GraphEdge] = {}
    for ordinal, row in enumerate(_iter_jsonl(path), 1):
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        identities: list[str] = []
        for key in PATH_KEYS:
            value = row.get(key)
            if isinstance(value, str):
                path_repository_hint = repository_hint
                if key in {
                    "target_path",
                    "to_path",
                    "callee_path",
                    "api_path",
                    "backend_path",
                    "resolved_path",
                    "resolved_target_path",
                    "definition_path",
                    "target_file",
                }:
                    path_repository_hint = _first_string(
                        row,
                        (
                            "resolved_repository_key",
                            "target_repository_key",
                            "to_repository_key",
                        ),
                    ) or repository_hint
                identities.extend(
                    _resolve_string_to_identities(
                        value, by_key, by_path, path_repository_hint
                    )
                )
        for key in (
            "source_file_identity",
            "target_file_identity",
            "file_identity",
            "owner_file_identity",
            "test_file_identity",
            "contract_file_identity",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in known_identities:
                identities.append(value)
        for key, value in row.items():
            if key.endswith("_files") and isinstance(value, list):
                for item_value in value:
                    if isinstance(item_value, str):
                        identities.extend(
                            _resolve_string_to_identities(
                                item_value, by_key, by_path, repository_hint
                            )
                        )
        for key in (
            "route_id",
            "api_route_id",
            "source_route_id",
            "target_route_id",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in route_owner:
                identities.append(route_owner[value])
        for key in ("matched_route_ids", "route_ids"):
            value = row.get(key)
            if isinstance(value, list):
                identities.extend(
                    route_owner[item_value]
                    for item_value in value
                    if isinstance(item_value, str) and item_value in route_owner
                )
        for key in (
            "symbol",
            "symbol_id",
            "source_symbol",
            "target_symbol",
            "definition_symbol",
            "callee_symbol",
            "caller_symbol",
            "scip_symbol",
            "target",
        ):
            value = row.get(key)
            if isinstance(value, str) and value in symbol_owner:
                identities.append(symbol_owner[value])
        # Fall back to any exact inventory path embedded in a structured row.
        if len(set(identities)) < 2:
            for value in _json_strings(row):
                identities.extend(
                    _resolve_string_to_identities(
                        value, by_key, by_path, repository_hint
                    )
                )
        unique = list(dict.fromkeys(identities))
        if len(unique) < 2:
            continue
        origin_row = _row_id(row, path.name, ordinal)
        # Preserve the first identity as the row's source and each remaining one
        # as a target.  Closure is traversed both forward and reverse.
        source = unique[0]
        for target in unique[1:]:
            if source == target:
                continue
            item = _edge(edge_type, source, target, path.name, origin_row)
            edges[item.edge_id] = item
    return sorted(edges.values(), key=lambda item: item.edge_id)


def _validate_manifest_chain(workspace_dir: Path) -> dict[str, Any]:
    inventory_path = workspace_dir / "manifest.json"
    files_path = workspace_dir / "files.jsonl"
    code_path = workspace_dir / "code_index" / "code_index_manifest.json"
    route_path = workspace_dir / "route_graph" / "route_graph_manifest.json"
    inventory = _read_json(inventory_path)
    code = _read_json(code_path)
    route = _read_json(route_path)
    if not all(isinstance(item, dict) for item in (inventory, code, route)):
        raise ContextCompileError("Step 1/2/3 manifests must be JSON objects")

    workspace = workspace_dir.name
    if inventory.get("workspace") != workspace:
        raise ContextCompileError(
            f"stale workspace manifest: expected {workspace!r}, "
            f"got {inventory.get('workspace')!r}"
        )
    files_sha = _sha256_file(files_path)
    expected_files_sha = inventory.get("output_sha256", {}).get("files.jsonl")
    if expected_files_sha != files_sha:
        raise ContextCompileError(
            "Step 1 files.jsonl fingerprint mismatch; fresh regeneration required"
        )
    if code.get("inventory_sha256") != files_sha:
        raise ContextCompileError(
            "Step 2 is not bound to the current Step 1 inventory; "
            "fresh regeneration required"
        )
    code_sha = _sha256_file(code_path)
    if route.get("inventory_sha256") != files_sha:
        raise ContextCompileError(
            "Step 3 is not bound to the current Step 1 inventory; "
            "fresh regeneration required"
        )
    if route.get("code_index_manifest_sha256") != code_sha:
        raise ContextCompileError(
            "Step 3 is not bound to the current Step 2 manifest; "
            "fresh regeneration required"
        )

    for base, manifest in (
        (workspace_dir / "code_index", code),
        (workspace_dir / "route_graph", route),
    ):
        outputs = manifest.get("output_sha256", {})
        if not isinstance(outputs, dict):
            raise ContextCompileError(f"invalid output_sha256 in {base}")
        for relative, expected in outputs.items():
            target = base / relative
            actual = _logical_sha256(target)
            if actual != expected:
                raise ContextCompileError(
                    f"manifest-bound logical output fingerprint mismatch: {target}"
                )

    transport_path = workspace_dir / PUBLICATION_TRANSPORT_NAME
    transport_sha256 = _sha256_file(transport_path) if transport_path.is_file() else None

    return {
        "inventory": inventory,
        "inventory_sha256": _sha256_file(inventory_path),
        "files_sha256": files_sha,
        "code_index": code,
        "code_index_manifest_sha256": code_sha,
        "route_graph": route,
        "route_graph_manifest_sha256": _sha256_file(route_path),
        "publication_transport_sha256": transport_sha256,
    }


def _validate_workspace_refs(
    workspace: str,
    workspace_profiles: Mapping[str, Any],
    inventory_manifest: Mapping[str, Any],
    repo_root: Path,
) -> None:
    profiles = workspace_profiles.get("profiles")
    if not isinstance(profiles, dict) or workspace not in profiles:
        raise ContextCompileError(f"workspace profile not found: {workspace}")
    profile = profiles[workspace]
    repositories = profile.get("repositories", {})
    actual_repositories = inventory_manifest.get("repositories", {})
    for repository_key, expected in repositories.items():
        actual = actual_repositories.get(repository_key)
        if not isinstance(actual, dict):
            raise ContextCompileError(
                f"inventory lacks workspace repository: {repository_key}"
            )
        source_commit = actual.get("source_commit")
        expected_head = expected.get("expected_head")
        if expected_head and source_commit != expected_head:
            raise ContextCompileError(
                f"stale ref for {repository_key}: expected {expected_head}, "
                f"got {source_commit}; fresh regeneration required"
            )
        if not source_commit:
            raise ContextCompileError(
                f"inventory lacks exact source commit for {repository_key}"
            )
        expected_ancestor = expected.get("expected_ancestor")
        if expected_ancestor:
            if not (repo_root / ".git").exists():
                raise ContextCompileError(
                    f"cannot verify expected_ancestor for {repository_key}; "
                    f"repository checkout is required at {repo_root}"
                )
            probe = subprocess.run(
                [
                    "git",
                    "-C",
                    str(repo_root),
                    "merge-base",
                    "--is-ancestor",
                    str(expected_ancestor),
                    str(source_commit),
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
                text=True,
                check=False,
            )
            if probe.returncode != 0:
                detail = probe.stderr.strip() or "not an ancestor"
                raise ContextCompileError(
                    f"stale ancestor lock for {repository_key}: "
                    f"{expected_ancestor} is not an ancestor of {source_commit}: {detail}"
                )


def _load_inventory(
    files_path: Path,
) -> tuple[
    dict[str, FileRecord],
    dict[tuple[str, str], FileRecord],
    dict[str, list[FileRecord]],
]:
    by_identity: dict[str, FileRecord] = {}
    by_key: dict[tuple[str, str], FileRecord] = {}
    by_path: dict[str, list[FileRecord]] = defaultdict(list)
    for row in _iter_jsonl(files_path):
        record = _inventory_record(row)
        if record.identity in by_identity:
            raise ContextCompileError(f"duplicate file identity: {record.identity}")
        if record.key in by_key:
            raise ContextCompileError(
                f"duplicate repository/path identity: {record.repository_key}:{record.path}"
            )
        by_identity[record.identity] = record
        by_key[record.key] = record
        by_path[record.path].append(record)
    if not by_identity:
        raise ContextCompileError("inventory is empty")
    return by_identity, by_key, by_path


def _load_symbol_owners(
    symbols_path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, str]:
    owners: dict[str, str] = {}
    for row in _iter_jsonl(symbols_path):
        symbol = _first_string(row, ("symbol", "symbol_id", "id", "scip_symbol"))
        if not symbol:
            continue
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        identity = _first_string(row, ("file_identity", "owner_file_identity"))
        if not identity:
            path = _first_string(row, PATH_KEYS)
            resolved = _resolve_string_to_identities(
                path, by_key, by_path, repository_hint
            )
            identity = resolved[0] if len(resolved) == 1 else ""
        if identity:
            owners[symbol] = identity
    return owners



def _load_route_owners(
    api_routes_path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, str]:
    owners: dict[str, str] = {}
    for row in _iter_jsonl(api_routes_path):
        route_id = _first_string(row, ("route_id", "id"))
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        path = _first_string(row, ("path", "file_path", "owner_path"))
        resolved = _resolve_string_to_identities(path, by_key, by_path, repository_hint)
        if route_id and len(resolved) == 1:
            owners[route_id] = resolved[0]
    return owners


def _load_domain_assignments(
    path: Path,
    by_key: Mapping[tuple[str, str], FileRecord],
    by_path: Mapping[str, Sequence[FileRecord]],
) -> dict[str, set[str]]:
    result: dict[str, set[str]] = defaultdict(set)
    for row in _iter_jsonl(path):
        repository_hint = _first_string(row, REPOSITORY_KEYS)
        file_path = _first_string(row, PATH_KEYS)
        resolved = _resolve_string_to_identities(
            file_path, by_key, by_path, repository_hint
        )
        domains: list[str] = []
        for key in ("domains", "domain_tags", "assigned_domains"):
            value = row.get(key)
            if isinstance(value, list):
                domains.extend(str(item) for item in value)
        value = row.get("domain")
        if isinstance(value, str):
            domains.append(value)
        for identity in resolved:
            result[identity].update(domains)
    return result

def _profile_seed_selection(
    records: Mapping[str, FileRecord],
    task_profile: Mapping[str, Any],
    domain_assignments: Mapping[str, set[str]],
) -> tuple[dict[str, set[str]], dict[str, str]]:
    reasons: dict[str, set[str]] = defaultdict(set)
    requested_classification: dict[str, str] = {}
    for rule in task_profile.get("seed_rules", []):
        if not isinstance(rule, dict):
            continue
        rule_id = str(rule.get("id", "unnamed_seed"))
        classification = str(rule.get("classification", "MUST_READ_FULL"))
        if classification not in CLASSIFICATIONS:
            raise ContextCompileError(
                f"unknown classification in task profile: {classification}"
            )
        for record in records.values():
            if _match_record(record, rule):
                reasons[record.identity].add(f"task_profile:{rule_id}")
                old = requested_classification.get(record.identity)
                if old is None or CLASSIFICATION_PRIORITY[classification] < CLASSIFICATION_PRIORITY[old]:
                    requested_classification[record.identity] = classification
    wanted_domains = {str(item) for item in task_profile.get("domains", [])}
    if bool(task_profile.get("seed_all_matching_domains", False)):
        for identity, assigned in domain_assignments.items():
            overlap = wanted_domains.intersection(assigned)
            if overlap:
                reasons[identity].add("domain:" + ",".join(sorted(overlap)))
                requested_classification.setdefault(identity, "REFERENCE_AS_NEEDED")
    else:
        # Domain assignment is evidence attached to the selected closure, not an
        # instruction to select every historical or generated file sharing a
        # broad domain label.  Explicit task seeds remain the admission owner.
        for identity in tuple(reasons):
            overlap = wanted_domains.intersection(domain_assignments.get(identity, set()))
            if overlap:
                reasons[identity].add("domain:" + ",".join(sorted(overlap)))
    if not reasons:
        raise ContextCompileError("task profile selected no seed files")
    return reasons, requested_classification


def _apply_manual_overlay(
    overlay: Mapping[str, Any],
    by_key: Mapping[tuple[str, str], FileRecord],
    reasons: dict[str, set[str]],
    requested_classification: dict[str, str],
) -> list[GraphEdge]:
    edges: list[GraphEdge] = []
    for item in overlay.get("files", []):
        if not isinstance(item, dict):
            continue
        key = (
            _normalize_repository(str(item.get("repository_key", ""))),
            _normalize_path(str(item.get("path", ""))),
        )
        record = by_key.get(key)
        if record is None:
            raise ContextCompileError(
                f"manual overlay file is absent from Inventory: {key[0]}:{key[1]}"
            )
        classification = str(item.get("classification", "MUST_READ_FULL"))
        if classification not in CLASSIFICATIONS:
            raise ContextCompileError(
                f"unknown manual classification: {classification}"
            )
        reasons[record.identity].add(
            "manual_overlay:" + str(item.get("reason", "explicit"))
        )
        requested_classification[record.identity] = classification
    for ordinal, item in enumerate(overlay.get("edges", []), 1):
        if not isinstance(item, dict):
            continue
        source_key = (
            _normalize_repository(str(item.get("source_repository_key", ""))),
            _normalize_path(str(item.get("source_path", ""))),
        )
        target_key = (
            _normalize_repository(str(item.get("target_repository_key", ""))),
            _normalize_path(str(item.get("target_path", ""))),
        )
        source = by_key.get(source_key)
        target = by_key.get(target_key)
        if source is None or target is None:
            raise ContextCompileError(
                "manual overlay edge endpoint is absent from Inventory: "
                f"{source_key!r} -> {target_key!r}"
            )
        edges.append(
            _edge(
                str(item.get("edge_type", "manual_owner")),
                source.identity,
                target.identity,
                "manual_overlay",
                str(item.get("id", ordinal)),
            )
        )
    return edges


def _classify_selected(
    record: FileRecord,
    requested: str | None,
    task_profile: Mapping[str, Any],
    distance: int,
) -> str:
    current_owner_rules = task_profile.get("current_owner_rules", [])
    historical_rules = task_profile.get("historical_rules", [])
    if any(_match_record(record, rule) for rule in current_owner_rules):
        return "CURRENT_OWNER"
    if any(_match_record(record, rule) for rule in historical_rules):
        return "RELEVANT_HISTORICAL"
    if requested:
        return requested
    # Graph closure discovers dependencies and reverse consumers, but does not
    # automatically promote an entire connected component to a full-text read.
    # Full reads are owned by the explicit task profile and current owners.
    return "REFERENCE_AS_NEEDED"


def _expand_fixed_point(
    seeds: Mapping[str, set[str]],
    edges: Sequence[GraphEdge],
) -> tuple[set[str], dict[str, int], dict[str, set[str]], set[str]]:
    adjacency: dict[str, list[tuple[str, GraphEdge]]] = defaultdict(list)
    for item in edges:
        adjacency[item.source_identity].append((item.target_identity, item))
        adjacency[item.target_identity].append((item.source_identity, item))
    selected = set(seeds)
    distance = {identity: 0 for identity in seeds}
    reasons = {identity: set(value) for identity, value in seeds.items()}
    used_edge_ids: set[str] = set()
    queue = deque(sorted(seeds))
    while queue:
        current = queue.popleft()
        for neighbor, item in sorted(
            adjacency.get(current, []), key=lambda pair: (pair[0], pair[1].edge_id)
        ):
            used_edge_ids.add(item.edge_id)
            candidate_distance = distance[current] + 1
            reasons.setdefault(neighbor, set()).add(
                f"closure:{item.edge_type}:{current}"
            )
            if neighbor not in selected:
                selected.add(neighbor)
                distance[neighbor] = candidate_distance
                queue.append(neighbor)
            elif candidate_distance < distance[neighbor]:
                distance[neighbor] = candidate_distance
    return selected, distance, reasons, used_edge_ids


def _validated_external_assets(
    review: Mapping[str, Any],
    required_workspace: str,
    workspace_profiles: Mapping[str, Any],
    external_workspace_root: Path,
) -> list[dict[str, Any]]:
    raw_assets = review.get("external_asset_candidates", [])
    if not isinstance(raw_assets, list):
        raise ContextCompileError("external_asset_candidates must be a list")
    profiles = workspace_profiles.get("profiles", {})
    required_profile = profiles.get(required_workspace, {})
    repositories = required_profile.get("repositories", {})
    result: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()
    for raw in raw_assets:
        if not isinstance(raw, dict):
            raise ContextCompileError("external asset must be an object")
        repository_key = _normalize_repository(str(raw.get("repository_key") or ""))
        asset_workspace = str(raw.get("required_workspace") or "")
        path = _normalize_path(str(raw.get("path") or ""))
        source_commit = str(raw.get("source_commit") or "")
        blob_sha = str(raw.get("blob_sha") or "")
        content_sha256 = str(raw.get("content_sha256") or "")
        evidence_kind = str(raw.get("evidence_kind") or "source")
        symbols = raw.get("symbols", [])
        if (
            not repository_key
            or asset_workspace != required_workspace
            or not path
            or not GIT_SHA_RE.fullmatch(source_commit)
            or not GIT_SHA_RE.fullmatch(blob_sha)
            or (content_sha256 and not SHA256_RE.fullmatch(content_sha256))
            or evidence_kind not in {"source", "test", "contract", "design"}
            or not isinstance(symbols, list)
            or not all(isinstance(value, str) and value for value in symbols)
        ):
            raise ContextCompileError(
                "external asset lacks exact workspace/commit/blob/path identity: "
                + json.dumps(raw, ensure_ascii=False, sort_keys=True)
            )
        repository_profile = repositories.get(repository_key)
        if not isinstance(repository_profile, dict):
            raise ContextCompileError(
                f"external asset repository is absent from {required_workspace}: {repository_key}"
            )
        expected_head = repository_profile.get("expected_head")
        if expected_head and source_commit != expected_head:
            raise ContextCompileError(
                f"external asset stale ref for {repository_key}: "
                f"expected {expected_head}, got {source_commit}"
            )
        key = (repository_key, path)
        if key in seen:
            raise ContextCompileError(f"duplicate external asset: {repository_key}:{path}")
        seen.add(key)

        require_git_verification = bool(review.get("require_external_asset_git_verification", False))
        validation_status = "PROFILE_LOCK_ONLY"
        actual_content_sha256: str | None = None
        checkout = external_workspace_root / required_workspace / repository_key
        if require_git_verification or checkout.exists():
            if not (checkout / ".git").exists():
                raise ContextCompileError(
                    f"external asset checkout is required: {checkout}"
                )
            actual_head = subprocess.check_output(
                ["git", "-C", str(checkout), "rev-parse", "HEAD"], text=True
            ).strip()
            if actual_head != source_commit:
                raise ContextCompileError(
                    f"external asset checkout HEAD mismatch: {repository_key}:"
                    f"{actual_head}!={source_commit}"
                )
            tree_row = subprocess.check_output(
                ["git", "-C", str(checkout), "ls-tree", source_commit, "--", path],
                text=True,
            ).strip()
            if not tree_row:
                raise ContextCompileError(
                    f"external asset path is absent at exact commit: {repository_key}:{path}"
                )
            metadata, separator, tree_path = tree_row.partition("\t")
            fields = metadata.split()
            if not separator or tree_path != path or len(fields) != 3 or fields[1] != "blob":
                raise ContextCompileError(
                    f"external asset tree identity is invalid: {repository_key}:{path}"
                )
            actual_blob_sha = fields[2]
            if actual_blob_sha != blob_sha:
                raise ContextCompileError(
                    f"external asset blob mismatch: {repository_key}:{path}:"
                    f"{actual_blob_sha}!={blob_sha}"
                )
            bytes_value = subprocess.check_output(
                ["git", "-C", str(checkout), "show", f"{source_commit}:{path}"]
            )
            actual_content_sha256 = _sha256_bytes(bytes_value)
            if content_sha256 and actual_content_sha256 != content_sha256:
                raise ContextCompileError(
                    f"external asset content SHA-256 mismatch: {repository_key}:{path}"
                )
            text_value = bytes_value.decode("utf-8", "strict")
            missing_symbols = [value for value in symbols if value not in text_value]
            if missing_symbols:
                raise ContextCompileError(
                    f"external asset symbols are absent: {repository_key}:{path}:"
                    + ",".join(missing_symbols)
                )
            validation_status = "GIT_COMMIT_BLOB_CONTENT_SYMBOL_VERIFIED"

        result.append(
            {
                "repository_key": repository_key,
                "required_workspace": required_workspace,
                "path": path,
                "source_commit": source_commit,
                "blob_sha": blob_sha,
                "content_sha256": actual_content_sha256 or content_sha256 or None,
                "evidence_kind": evidence_kind,
                "symbols": list(symbols),
                "validation_status": validation_status,
            }
        )
    return sorted(result, key=lambda row: (row["repository_key"], row["path"]))


def _review_disposition_complete(
    review: Mapping[str, Any],
    external_assets: Sequence[Mapping[str, Any]],
    selected_paths: set[tuple[str, str]],
) -> bool:
    disposition = str(review.get("disposition") or "")
    design_impact = str(review.get("design_impact") or "")
    owner_paths = review.get("canonical_owner_paths", [])
    if (
        not disposition
        or not design_impact
        or not external_assets
        or not isinstance(owner_paths, list)
        or not owner_paths
    ):
        return False
    for raw in owner_paths:
        if not isinstance(raw, dict):
            return False
        repository_key = _normalize_repository(str(raw.get("repository_key") or ""))
        path = _normalize_path(str(raw.get("path") or ""))
        if not repository_key or not path or (repository_key, path) not in selected_paths:
            return False
    return True


def _category_coverage(
    task_profile: Mapping[str, Any],
    records: Mapping[str, FileRecord],
    selected: set[str],
    workspace: str,
    workspace_profiles: Mapping[str, Any],
    external_workspace_root: Path,
) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
    categories = task_profile.get("required_categories", [])
    expected_exact = int(task_profile.get("required_category_exact", 10))
    if len(categories) != expected_exact:
        raise ContextCompileError(
            f"task profile must define required category exact{expected_exact}; "
            f"got {len(categories)}"
        )
    coverage_rows: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    findings: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    profiles = workspace_profiles.get("profiles", {})
    selected_records = [records[identity] for identity in selected]
    selected_paths = {(record.repository_key, record.path) for record in selected_records}

    for category in categories:
        if not isinstance(category, dict):
            raise ContextCompileError("required category must be an object")
        category_id = str(category.get("id", ""))
        if not category_id or category_id in seen_ids:
            raise ContextCompileError(f"duplicate/empty required category id: {category_id!r}")
        seen_ids.add(category_id)
        matches = [record for record in selected_records if _match_record(record, category)]
        source_like = [
            record for record in matches
            if record.evidence_kind in {"source", "test", "contract"}
        ]
        required_workspace = str(category.get("required_workspace") or "") or None
        review = category.get("actual_review", {})
        review = review if isinstance(review, dict) else {}
        external_assets: list[dict[str, Any]] = []
        if required_workspace and required_workspace != workspace:
            external_assets = _validated_external_assets(
                review,
                required_workspace,
                workspace_profiles,
                external_workspace_root,
            )
        disposition_complete = _review_disposition_complete(
            review, external_assets, selected_paths
        )
        if bool(review.get("require_external_asset_git_verification", False)):
            disposition_complete = disposition_complete and all(
                row.get("validation_status")
                == "GIT_COMMIT_BLOB_CONTENT_SYMBOL_VERIFIED"
                for row in external_assets
            )
        external_source_like_count = sum(
            asset["evidence_kind"] in {"source", "test", "contract"}
            for asset in external_assets
        )
        effective_source_like_count = len(source_like) + external_source_like_count
        min_source = int(category.get("minimum_source_like", 0))

        status = "PASS"
        blocking_codes: list[str] = []
        review_codes: list[str] = []
        if not matches:
            status = "BLOCKED"
            blocking_codes.append("REQUIRED_CATEGORY_EMPTY")
        if effective_source_like_count < min_source:
            status = "BLOCKED" if not matches else "PARTIAL_BLOCKED"
            blocking_codes.append("SOURCE_LEVEL_EVIDENCE_INSUFFICIENT")

        if required_workspace and required_workspace != workspace:
            required_profile = profiles.get(required_workspace, {})
            current_profile = profiles.get(workspace, {})
            raw_gap_code = str(
                category.get(
                    "workspace_gap_code",
                    "REQUIRED_SOURCE_WORKSPACE_NOT_INDEXED",
                )
            )
            if disposition_complete and matches and effective_source_like_count >= min_source:
                status = "PASS"
                review_codes.append("EXTERNAL_EXACT_ASSET_REVIEWED_WITH_DISPOSITION")
                unresolved_code = str(
                    review.get(
                        "reviewed_workspace_gap_code",
                        raw_gap_code + "_EXTERNAL_EXACT_REVIEWED",
                    )
                )
                blocking = False
                reason = (
                    "The implementation/test lane is outside the current Inventory, "
                    "but exact external commit/blob identities were reviewed and a "
                    "canonical CMEE disposition was recorded without mixing workspaces."
                )
            else:
                status = "PARTIAL_BLOCKED" if matches else "BLOCKED"
                blocking_codes.append("REQUIRED_WORKSPACE_NOT_INDEXED")
                unresolved_code = raw_gap_code
                blocking = True
                reason = (
                    "The current task context can see documentary references, "
                    "but the required implementation/test source lane is locked "
                    "to a different workspace profile without an exact reviewed disposition."
                )
            unresolved_id = "unresolved:" + _sha256_bytes(
                _canonical_json_bytes(
                    {
                        "code": unresolved_code,
                        "category_id": category_id,
                        "workspace": workspace,
                        "required_workspace": required_workspace,
                        "external_assets": [
                            {
                                "repository_key": row["repository_key"],
                                "path": row["path"],
                                "source_commit": row["source_commit"],
                                "blob_sha": row["blob_sha"],
                            }
                            for row in external_assets
                        ],
                    }
                )
            )
            unresolved.append(
                {
                    "unresolved_id": unresolved_id,
                    "classification": "UNRESOLVED_CONTEXT",
                    "blocking": blocking,
                    "code": unresolved_code,
                    "category_id": category_id,
                    "current_workspace": workspace,
                    "required_workspace": required_workspace,
                    "current_workspace_repositories": current_profile.get("repositories", {}),
                    "required_workspace_repositories": required_profile.get("repositories", {}),
                    "external_exact_assets": external_assets,
                    "reason": reason,
                    "disposition": review.get("disposition"),
                    "product_credit": 0,
                }
            )

            review_rules = review.get("basis_rules", [])
            review_rules = review_rules if isinstance(review_rules, list) else []
            basis = [
                record
                for record in selected_records
                if (
                    any(
                        isinstance(rule, dict) and _match_record(record, rule)
                        for rule in review_rules
                    )
                    if review_rules
                    else record in matches
                )
            ]
            findings.append(
                {
                    "finding_id": str(review.get("finding_id", f"ACTUAL-{category_id}")),
                    "title": str(
                        review.get(
                            "title",
                            f"{category_id} source lane is outside {workspace}",
                        )
                    ),
                    "category_id": category_id,
                    "status": str(
                        review.get(
                            "status",
                            "DESIGN_OWNER_PRESENT_IMPLEMENTATION_ASSET_NOT_MIGRATED",
                        )
                    ),
                    "current_workspace": workspace,
                    "required_workspace": required_workspace,
                    "current_workspace_repositories": current_profile.get("repositories", {}),
                    "required_workspace_repositories": required_profile.get("repositories", {}),
                    "selected_documentary_evidence": [
                        {
                            "repository_key": record.repository_key,
                            "path": record.path,
                            "source_commit": record.source_commit,
                            "identity": record.identity,
                            "evidence_kind": record.evidence_kind,
                        }
                        for record in sorted(basis, key=lambda item: (item.repository_key, item.path))
                    ],
                    "cmee_review_conclusion": str(
                        review.get(
                            "conclusion",
                            "The required source/test lane is not proven by the current workspace.",
                        )
                    ),
                    "disposition": str(review.get("disposition") or ""),
                    "design_impact": str(review.get("design_impact") or ""),
                    "canonical_owner_paths": review.get("canonical_owner_paths", []),
                    "required_action": str(
                        review.get(
                            "required_action",
                            f"Admit or separately bind {required_workspace} before resolving this context gap.",
                        )
                    ),
                    "external_exact_assets": external_assets,
                    "review_disposition_complete": disposition_complete,
                    "structure_map_delta": str(
                        review.get("structure_map_delta") or "STRUCTURE_MAP_DELTA_NONE"
                    ),
                    "product_credit": 0,
                }
            )

        coverage_rows.append(
            {
                "category_id": category_id,
                "title": str(category.get("title", category_id)),
                "status": status,
                "selected_count": len(matches),
                "source_like_count": len(source_like),
                "external_source_like_count": external_source_like_count,
                "effective_source_like_count": effective_source_like_count,
                "minimum_source_like": min_source,
                "required_workspace": required_workspace,
                "blocking_codes": sorted(set(blocking_codes)),
                "review_codes": sorted(set(review_codes)),
                "files": [
                    {
                        "repository_key": record.repository_key,
                        "path": record.path,
                        "source_commit": record.source_commit,
                        "identity": record.identity,
                        "evidence_kind": record.evidence_kind,
                    }
                    for record in sorted(matches, key=lambda item: (item.repository_key, item.path))
                ],
                "external_exact_assets": external_assets,
            }
        )

    coverage = {
        "schema_version": "cocolon.system_context.required_category_coverage.v1",
        "required_category_exact": expected_exact,
        "observed_category_count": len(coverage_rows),
        "all_nonzero": all(row["selected_count"] > 0 for row in coverage_rows),
        "all_pass": all(row["status"] == "PASS" for row in coverage_rows),
        "categories": coverage_rows,
        "product_credit": 0,
    }
    return coverage, unresolved, findings

def _selected_row(
    record: FileRecord,
    classification: str,
    reasons: Iterable[str],
    distance: int,
    premise_binding: Mapping[str, Any] | None = None,
    unit_a_fields: bool = False,
) -> dict[str, Any]:
    base = {
        "identity": record.identity,
        "repository_key": record.repository_key,
        "path": record.path,
        "source_commit": record.source_commit,
        "blob_sha": record.blob_sha,
        "content_sha256": record.content_sha256,
        "size_bytes": record.size_bytes,
        "inventory_classification": record.inventory_classification,
        "evidence_kind": record.evidence_kind,
        "read_classification": classification,
        "graph_distance": distance,
        "selection_reasons": sorted(set(reasons)),
    }
    if not unit_a_fields:
        return base
    binding = premise_binding or {}
    conflict_ids = sorted(set(str(item) for item in binding.get("conflict_ids", [])))
    responsibility_ids = sorted(
        set(str(item) for item in binding.get("responsibility_ids", []))
    )
    if conflict_ids:
        selection_tier = "UNRESOLVED_IMPACT"
    elif classification == "CURRENT_OWNER":
        selection_tier = "DECISION_SURFACE"
    elif classification == "MUST_READ_FULL":
        selection_tier = "MUST_READ_FULL"
    else:
        selection_tier = "REFERENCE_ON_TRIGGER"
    return {
        **base,
        "classification_provenance": "LEGACY_PATH_RULE",
        "authority_claim": False,
        "responsibility_ids": responsibility_ids,
        "conflict_ids": conflict_ids,
        "selection_tier": selection_tier,
        "non_proof_boundaries": [
            "NO_AUTOMATIC_OWNER_DECISION",
            "NO_WORKSPACE_INCORPORATION_CLAIM",
            "NO_WRITE_AUTHORITY",
        ],
    }


def _read_order_markdown(rows: Sequence[Mapping[str, Any]], workspace: str, task: str) -> str:
    lines = [
        f"# {task} 全文確認順",
        "",
        f"workspace: `{workspace}`",
        "",
        "この順序はexact selected-file identityとgraph closureから生成したもので、更新日時順ではありません。",
        "",
    ]
    for index, row in enumerate(rows, 1):
        item_lines = [
            f"## {index}. `{row['repository_key']}:{row['path']}`",
            "",
            f"- classification: `{row['read_classification']}`",
        ]
        if "selection_tier" in row:
            item_lines.extend(
                [
                    f"- selection tier: `{row['selection_tier']}`",
                    f"- authority claim: `{str(bool(row.get('authority_claim'))).lower()}`",
                ]
            )
        item_lines.extend(
            [
                f"- source commit: `{row['source_commit']}`",
                f"- file identity: `{row['identity']}`",
                f"- graph distance: `{row['graph_distance']}`",
                "- 選択理由:",
            ]
        )
        lines.extend(item_lines)
        lines.extend(f"  - `{reason}`" for reason in row["selection_reasons"])
        if row.get("responsibility_ids"):
            lines.append("- responsibility IDs:")
            lines.extend(f"  - `{value}`" for value in row["responsibility_ids"])
        if row.get("conflict_ids"):
            lines.append("- unresolved conflict IDs:")
            lines.extend(f"  - `{value}`" for value in row["conflict_ids"])
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _overview_markdown(
    workspace: str,
    task: str,
    selected_rows: Sequence[Mapping[str, Any]],
    coverage: Mapping[str, Any],
    unresolved: Sequence[Mapping[str, Any]],
    findings: Sequence[Mapping[str, Any]],
    status: str,
) -> str:
    class_counts: dict[str, int] = defaultdict(int)
    for row in selected_rows:
        class_counts[str(row["read_classification"])] += 1
    lines = [
        f"# {task.upper()} task context 概要",
        "",
        f"- workspace: `{workspace}`",
        f"- status: `{status}`",
        f"- selected files: `{len(selected_rows)}`",
        f"- required categories: `{coverage['observed_category_count']}` / `{coverage['required_category_exact']}`",
        f"- required categories all nonzero: `{str(coverage['all_nonzero']).lower()}`",
        f"- required categories all PASS: `{str(coverage['all_pass']).lower()}`",
        f"- blocking unresolved: `{sum(bool(row.get('blocking')) for row in unresolved)}`",
        f"- actual unincorporated findings: `{len(findings)}`",
        "- product_credit: `0`",
        "- automatic_progression: `false`",
        "",
        "## classification別件数",
        "",
    ]
    for classification in CLASSIFICATIONS[:-1]:
        lines.append(f"- `{classification}`: `{class_counts.get(classification, 0)}`")
    lines.extend(
        [
            "",
            "## 境界",
            "",
            "この成果物はcontext／review checkpointです。RN／API／backend behavior、public contract、DB、production dependency、product outputは変更しません。",
            "",
        ]
    )
    return "\n".join(lines)


def _findings_markdown(
    findings: Sequence[Mapping[str, Any]],
    unresolved: Sequence[Mapping[str, Any]],
) -> str:
    lines = [
        "# CMEE未取込actual finding",
        "",
        "以下はmanifest-lockされたworkspace identityから導出したcontext findingです。商品品質creditではありません。",
        "",
    ]
    if not findings:
        lines.extend(
            [
                "actual未取込findingを導出できませんでした。",
                "",
                "required category exact10のmanual cross-checkが終わるまでStep 4 completionを保留します。",
                "",
            ]
        )
    for finding in findings:
        lines.extend(
            [
                f"## {finding['finding_id']} — {finding['title']}",
                "",
                f"- status: `{finding['status']}`",
                f"- current workspace: `{finding['current_workspace']}`",
                f"- required workspace: `{finding['required_workspace']}`",
                "- product_credit: `0`",
                "",
                "### exact workspace identity",
                "",
                "```json",
                json.dumps(
                    {
                        "current_workspace_repositories": finding[
                            "current_workspace_repositories"
                        ],
                        "required_workspace_repositories": finding[
                            "required_workspace_repositories"
                        ],
                    },
                    ensure_ascii=False,
                    sort_keys=True,
                    indent=2,
                ),
                "```",
                "",
                "### CMEE再確認結論",
                "",
                str(finding["cmee_review_conclusion"]),
                "",
                "### 必要な次処理",
                "",
                str(finding["required_action"]),
                "",
                "### 選択された文書evidence",
                "",
            ]
        )
        evidence = finding.get("selected_documentary_evidence", [])
        if evidence:
            for row in evidence:
                lines.append(
                    f"- `{row['repository_key']}:{row['path']}` @ `{row['source_commit']}` "
                    f"(`{row['identity']}`, `{row['evidence_kind']}`)"
                )
        else:
            lines.append("- none")
        lines.append("")
        lines.extend(
            [
                "### Disposition",
                "",
                f"- disposition: `{finding.get('disposition')}`",
                f"- design impact: `{finding.get('design_impact')}`",
                f"- structure map: `{finding.get('structure_map_delta')}`",
                "",
                "### canonical owner",
                "",
            ]
        )
        owner_paths = finding.get("canonical_owner_paths", [])
        if owner_paths:
            for owner in owner_paths:
                lines.append(
                    f"- `{owner.get('repository_key')}:{owner.get('path')}`"
                )
        else:
            lines.append("- none")
        lines.append("")
        external_assets = finding.get("external_exact_assets", [])
        if external_assets:
            lines.extend(["### secondary workspace actual asset exact identity", ""])
            for asset in external_assets:
                symbols = ", ".join(f"`{value}`" for value in asset.get("symbols", []))
                lines.append(
                    f"- `{asset.get('repository_key')}:{asset.get('path')}` "
                    f"@ `{asset.get('source_commit')}` / blob `{asset.get('blob_sha')}` "
                    f"(workspace `{asset.get('required_workspace')}`, `{asset.get('evidence_kind')}`): {symbols}"
                )
            lines.append("")
    if unresolved:
        lines.extend(["## blocking unresolved context", ""])
        for row in unresolved:
            if row.get("blocking"):
                lines.append(
                    f"- `{row['code']}` — category `{row['category_id']}`: {row['reason']}"
                )
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def _context_fingerprint_payload(
    workspace: str,
    task: str,
    manifests: Mapping[str, Any],
    workspace_profiles_sha256: str,
    task_profile_sha256: str,
    manual_overlay_sha256: str | None,
    selected_rows: Sequence[Mapping[str, Any]],
    output_sha256: Mapping[str, str],
    owner_bundle_fingerprint: str | None = None,
    unit_a_model_sha256: str | None = None,
    workspace_exact_refs: Mapping[str, Any] | None = None,
    unit_a_completion_gates: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    payload = {
        "workspace": workspace,
        "task": task,
        "step1_manifest_sha256": manifests["inventory_sha256"],
        "step1_files_sha256": manifests["files_sha256"],
        "step2_manifest_sha256": manifests["code_index_manifest_sha256"],
        "step3_manifest_sha256": manifests["route_graph_manifest_sha256"],
        "publication_transport_sha256": manifests.get("publication_transport_sha256"),
        "workspace_profiles_sha256": workspace_profiles_sha256,
        "task_profile_sha256": task_profile_sha256,
        "manual_overlay_sha256": manual_overlay_sha256,
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(output_sha256.items())),
    }
    if owner_bundle_fingerprint is not None:
        payload["owner_bundle_fingerprint"] = owner_bundle_fingerprint
    if unit_a_model_sha256 is not None:
        payload["unit_a_model_sha256"] = unit_a_model_sha256
    if workspace_exact_refs is not None:
        payload["workspace_exact_refs"] = workspace_exact_refs
    if unit_a_completion_gates is not None:
        payload["unit_a_completion_gates"] = unit_a_completion_gates
    return payload


def compile_task_context(
    *,
    repo_root: Path,
    system_context_root: Path,
    workspace: str,
    task: str,
    task_profiles_path: Path,
    manual_overlay_path: Path | None,
    output_dir: Path,
    external_workspace_root: Path | None = None,
    remote_verified: bool = False,
    canonical_owner_bundle: Mapping[str, Any] | None = None,
) -> CompileResult:
    """Compile and atomically publish one task context.

    ``remote_verified`` is accepted only for a distinct post-push verifier.  The
    public CLI always leaves it false, so local generation cannot self-award the
    durable completion claim.
    """
    task_profiles = _read_json(task_profiles_path)
    task_profile, is_v2 = _task_profile(task_profiles, task)
    if is_v2 and canonical_owner_bundle is None:
        raise ContextCompileError("CANONICAL_OWNER_BUNDLE_REQUIRED_USE_PREPARE")
    if is_v2 and manual_overlay_path is not None:
        raise ContextCompileError(
            "task_profiles.v2 forbids direct manual overlay completion input"
        )
    workspace_dir = system_context_root / "current" / workspace
    external_workspace_root = (
        external_workspace_root.resolve()
        if external_workspace_root is not None
        else repo_root / ".cocolon-context-workspace"
    )
    manifests = _validate_manifest_chain(workspace_dir)
    workspace_profiles_path = system_context_root / "workspace_profiles.json"
    workspace_profiles = _read_json(workspace_profiles_path)
    _validate_workspace_refs(
        workspace, workspace_profiles, manifests["inventory"], repo_root
    )
    repository_roots = {
        "Cocolon": repo_root,
        "mashos-api": external_workspace_root / "mashos-api",
    }
    if is_v2:
        workspace_profile = workspace_profiles.get("profiles", {}).get(workspace)
        if not isinstance(workspace_profile, Mapping):
            raise ContextCompileError(f"workspace profile not found: {workspace}")
        canonical_owner_bundle = validate_canonical_owner_bundle(
            bundle=canonical_owner_bundle or {},
            workspace=workspace,
            task=task,
            task_profile=task_profile,
            workspace_profile=workspace_profile,
            repository_roots=repository_roots,
            workspace_exact_refs=manifests["inventory"].get("repositories"),
        )

    by_identity, by_key, by_path = _load_inventory(workspace_dir / "files.jsonl")
    symbol_owner = _load_symbol_owners(
        workspace_dir / "code_index" / "symbols.jsonl", by_key, by_path
    )
    route_owner = _load_route_owners(
        workspace_dir / "route_graph" / "api_routes.jsonl", by_key, by_path
    )
    domain_assignments = _load_domain_assignments(
        workspace_dir / "route_graph" / "file_domain_assignments.jsonl",
        by_key,
        by_path,
    )
    edge_specs = [
        (workspace_dir / "code_index" / "import_edges.jsonl", "import"),
        (workspace_dir / "code_index" / "references.jsonl", "reference"),
        (workspace_dir / "route_graph" / "rn_calls.jsonl", "rn_call"),
        (workspace_dir / "route_graph" / "api_routes.jsonl", "api_route"),
        (
            workspace_dir / "route_graph" / "cross_repository_route_edges.jsonl",
            "cross_repository_route",
        ),
        (
            workspace_dir / "route_graph" / "backend_call_edges.jsonl",
            "backend_call",
        ),
        (
            workspace_dir / "route_graph" / "route_owner_closures.jsonl",
            "route_owner",
        ),
        (
            workspace_dir / "route_graph" / "test_contract_edges.jsonl",
            "test_contract",
        ),
        (
            workspace_dir / "route_graph" / "api_model_edges.jsonl",
            "api_model",
        ),
    ]
    all_edges: dict[str, GraphEdge] = {}
    known_identities = set(by_identity)
    for path, edge_type in edge_specs:
        for item in _extract_edges_from_rows(
            path,
            edge_type,
            by_key,
            by_path,
            symbol_owner,
            route_owner,
            known_identities,
        ):
            all_edges[item.edge_id] = item

    reasons, requested_classification = _profile_seed_selection(
        by_identity, task_profile, domain_assignments
    )
    _apply_required_premise_seeds(
        task_profile,
        by_key,
        reasons,
        requested_classification,
        canonical_owner_bundle or {},
    )
    manual_overlay_sha256: str | None = None
    if manual_overlay_path is not None:
        overlay = _read_json(manual_overlay_path)
        manual_overlay_sha256 = _sha256_file(manual_overlay_path)
        for item in _apply_manual_overlay(
            overlay, by_key, reasons, requested_classification
        ):
            all_edges[item.edge_id] = item

    premise_model = build_premise_management_model(
        task_profile=task_profile,
        by_identity=by_identity,
        by_key=by_key,
        requested_classification=requested_classification,
        repository_roots=repository_roots,
        canonical_owner_bundle=canonical_owner_bundle or {},
    )

    selected, distances, closure_reasons, used_edge_ids = _expand_fixed_point(
        reasons, list(all_edges.values())
    )
    for identity, values in closure_reasons.items():
        reasons.setdefault(identity, set()).update(values)
    missing = sorted(selected - set(by_identity))
    if missing:
        raise ContextCompileError(
            "selected identity is absent from Inventory: " + ", ".join(missing[:5])
        )

    selected_rows = [
        _selected_row(
            by_identity[identity],
            _classify_selected(
                by_identity[identity],
                requested_classification.get(identity),
                task_profile,
                distances.get(identity, 0),
            ),
            reasons.get(identity, set()),
            distances.get(identity, 0),
            premise_model.get("bindings_by_identity", {}).get(identity),
            is_v2,
        )
        for identity in selected
    ]
    if is_v2:
        selected_rows.sort(
            key=lambda row: (
                SELECTION_TIER_PRIORITY[row["selection_tier"]],
                0 if any(
                    reason.startswith("required_premise:")
                    for reason in row["selection_reasons"]
                ) else 1,
                row["graph_distance"],
                row["repository_key"],
                row["path"],
                row["identity"],
            )
        )
    else:
        selected_rows.sort(
            key=lambda row: (
                CLASSIFICATION_PRIORITY[row["read_classification"]],
                row["graph_distance"],
                row["repository_key"],
                row["path"],
                row["identity"],
            )
        )

    coverage, unresolved, findings = _category_coverage(
        task_profile,
        by_identity,
        selected,
        workspace,
        workspace_profiles,
        external_workspace_root,
    )
    for conflict in premise_model.get("conflicts", []):
        unresolved.append(
            {
                "unresolved_id": str(conflict["conflict_id"]),
                "code": str(conflict["reason_code"]),
                "category_id": "UNIT_A_PREMISE_MANAGEMENT",
                "reason": str(conflict["reason_code"]),
                "blocking": bool(conflict.get("blocking")),
                "handback_owner": str(conflict.get("handback_owner") or "MASH"),
                "source": {
                    "repository_key": conflict.get("repository_key"),
                    "path": conflict.get("path"),
                },
            }
        )
    for code in premise_model.get("blocking_codes", []):
        unresolved.append(
            {
                "unresolved_id": f"UNIT_A.{code}",
                "code": str(code),
                "category_id": "UNIT_A_PREMISE_MANAGEMENT",
                "reason": str(code),
                "blocking": True,
                "handback_owner": "MASH",
            }
        )
    unresolved.sort(
        key=lambda row: (
            0 if row.get("blocking") else 1,
            str(row.get("code") or ""),
            str(row.get("unresolved_id") or ""),
        )
    )
    used_edges = [
        {
            "edge_id": item.edge_id,
            "edge_type": item.edge_type,
            "source_identity": item.source_identity,
            "target_identity": item.target_identity,
            "origin_file": item.origin_file,
            "origin_row": item.origin_row,
        }
        for item in sorted(all_edges.values(), key=lambda edge: edge.edge_id)
        if item.edge_id in used_edge_ids
        and item.source_identity in selected
        and item.target_identity in selected
    ]
    blocking_unresolved = sum(bool(row.get("blocking")) for row in unresolved)
    finding_review_complete = bool(findings) and all(
        bool(row.get("review_disposition_complete")) for row in findings
    )
    completion_gates = {
        "required_category_exact10_recovered": bool(
            coverage["observed_category_count"] == 10 and coverage["all_nonzero"]
        ),
        "required_category_exact10_all_pass": bool(coverage["all_pass"]),
        "full_text_read_order_generated": bool(selected_rows),
        "selected_file_identity_verified": not missing,
        "unresolved_visible": True,
        "actual_unincorporated_finding_extracted": bool(findings),
        "finding_used_for_cmee_review": finding_review_complete,
        "generated_output_remote_hash_verified": bool(remote_verified),
    }
    if is_v2:
        completion_gates["operator_v1_activation_approved"] = False
    complete = all(completion_gates.values())
    status = (
        "STEP4_TASK_CONTEXT_COMPILER_CMEE_ACTUAL_REVIEW_COMPLETE"
        if complete
        else "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
    )

    output_dir.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(
        prefix=f"cocolon-{workspace}-{task}-", dir=str(output_dir.parent)
    ) as temporary:
        staging = Path(temporary)
        _write_jsonl(staging / "selected_files.jsonl", selected_rows)
        _write_jsonl(staging / "closure_edges.jsonl", used_edges)
        _write_bytes(
            staging / "required_category_coverage.json",
            _pretty_json_bytes(coverage),
        )
        _write_jsonl(staging / "unresolved_context.jsonl", unresolved)
        _write_bytes(
            staging / "full_text_read_order.md",
            _read_order_markdown(selected_rows, workspace, task).encode("utf-8"),
        )
        _write_bytes(
            staging / "cmee_context_overview.md",
            _overview_markdown(
                workspace,
                task,
                selected_rows,
                coverage,
                unresolved,
                findings,
                status,
            ).encode("utf-8"),
        )
        _write_bytes(
            staging / "cmee_unincorporated_actual_findings.md",
            _findings_markdown(findings, unresolved).encode("utf-8"),
        )
        output_sha256 = {
            name: _sha256_file(staging / name) for name in OUTPUT_NAMES
        }
        profile_document = {
            "schema_version": task_profiles["schema_version"],
            "task": task,
            "profile": task_profile,
        }
        profile_sha = _sha256_bytes(_canonical_json_bytes(profile_document))
        owner_bundle_fingerprint = (
            str(canonical_owner_bundle.get("task_dependency_fingerprint"))
            if canonical_owner_bundle is not None
            else None
        )
        if is_v2 and not SHA256_RE.fullmatch(owner_bundle_fingerprint or ""):
            raise ContextCompileError("canonical owner bundle fingerprint is invalid")
        unit_a_model_sha256 = (
            _sha256_bytes(_canonical_json_bytes(premise_model)) if is_v2 else None
        )
        fingerprint_payload = _context_fingerprint_payload(
            workspace,
            task,
            manifests,
            _sha256_file(workspace_profiles_path),
            profile_sha,
            manual_overlay_sha256,
            selected_rows,
            output_sha256,
            owner_bundle_fingerprint,
            unit_a_model_sha256,
            manifests["inventory"].get("repositories") if is_v2 else None,
            completion_gates if is_v2 else None,
        )
        context_fingerprint = _sha256_bytes(
            _canonical_json_bytes(fingerprint_payload)
        )
        manifest = {
            "schema_version": SCHEMA_VERSION,
            "workspace": workspace,
            "task": task,
            "status": status,
            "completion_claim": status if complete else None,
            "context_fingerprint": context_fingerprint,
            "workspace_exact_refs": manifests["inventory"].get("repositories", {}),
            "input_sha256": {
                "step1_manifest": manifests["inventory_sha256"],
                "step1_files": manifests["files_sha256"],
                "step2_manifest": manifests["code_index_manifest_sha256"],
                "step3_manifest": manifests["route_graph_manifest_sha256"],
                "publication_transport": manifests.get("publication_transport_sha256"),
                "workspace_profiles": _sha256_file(workspace_profiles_path),
                "task_profile": profile_sha,
                "manual_overlay": manual_overlay_sha256,
                **(
                    {"owner_bundle": owner_bundle_fingerprint}
                    if owner_bundle_fingerprint is not None
                    else {}
                ),
                **(
                    {"unit_a_model": unit_a_model_sha256}
                    if unit_a_model_sha256 is not None
                    else {}
                ),
            },
            "selected_file_count": len(selected_rows),
            "closure_edge_count": len(used_edges),
            "blocking_unresolved_count": blocking_unresolved,
            "actual_unincorporated_finding_count": len(findings),
            "required_category_coverage": {
                "expected_exact": coverage["required_category_exact"],
                "observed": coverage["observed_category_count"],
                "all_nonzero": coverage["all_nonzero"],
                "all_pass": coverage["all_pass"],
            },
            "completion_gates": completion_gates,
            "output_sha256": output_sha256,
            "product_credit": 0,
            "automatic_progression": False,
        }
        if is_v2:
            manifest["unit_a_premise_management"] = {
                **premise_model,
                "required_premise_count": len(premise_model.get("premises", [])),
                "required_premise_resolved_count": sum(
                    row.get("status") == "RESOLVED"
                    for row in premise_model.get("premises", [])
                    if row.get("required")
                ),
                "responsibility_count": len(
                    premise_model.get("responsibilities", [])
                ),
                "conflict_count": len(premise_model.get("conflicts", [])),
            }
        _write_bytes(staging / "context_manifest.json", _pretty_json_bytes(manifest))
        if output_dir.exists():
            shutil.rmtree(output_dir)
        shutil.move(str(staging), str(output_dir))

    verify_task_context(
        output_dir,
        expected_unit_a=is_v2,
        expected_task=task,
        expected_publication_mode=(
            str(task_profile["publication_mode"]) if is_v2 else None
        ),
    )
    return CompileResult(
        output_dir=output_dir,
        context_fingerprint=context_fingerprint,
        status=status,
        selected_count=len(selected_rows),
        unresolved_count=len(unresolved),
        actual_finding_count=len(findings),
    )


def _validate_unit_a_metadata_projection(value: Any) -> None:
    if not isinstance(value, Mapping):
        raise ContextCompileError("Unit A metadata projection is invalid")
    _require_exact_keys(
        value,
        frozenset({"status", "reason_code", "fields", "json_pointer_assertions"}),
        "Unit A metadata projection",
    )
    if type(value.get("status")) is not str or type(value.get("reason_code")) is not str:
        raise ContextCompileError("Unit A metadata status is invalid")
    fields = value.get("fields")
    if not isinstance(fields, Mapping) or set(fields) - METADATA_ALLOWLIST:
        raise ContextCompileError("Unit A metadata field set is invalid")
    if (
        "automatic_progression" in fields
        and fields.get("automatic_progression") is not False
    ):
        raise ContextCompileError("Unit A metadata automatic progression violated")
    for item in fields.values():
        _validate_public_expected_value(item, "Unit A metadata field")
    assertions = value.get("json_pointer_assertions")
    if not isinstance(assertions, list) or len(assertions) > 64:
        raise ContextCompileError("Unit A JSON pointer projection is invalid")
    for row in assertions:
        if not isinstance(row, Mapping):
            raise ContextCompileError("Unit A JSON pointer row is invalid")
        _require_exact_keys(
            row,
            frozenset(
                {
                    "metadata_kind",
                    "metadata_key",
                    "verification_status",
                    "reason_code",
                }
            ),
            "Unit A JSON pointer row",
        )
        if row.get("metadata_kind") != "JSON_POINTER":
            raise ContextCompileError("Unit A JSON pointer kind is invalid")
        if type(row.get("metadata_key")) is not str:
            raise ContextCompileError("Unit A JSON pointer key is invalid")
        _json_pointer_tokens(row["metadata_key"])
        if type(row.get("verification_status")) is not str or row.get(
            "verification_status"
        ) not in ("MATCH", "MISMATCH", "UNRESOLVED"):
            raise ContextCompileError("Unit A JSON pointer status is invalid")
        _require_safe_public_id(row.get("reason_code"), "JSON pointer reason code")


def _validate_unit_a_workspace_exact_refs(value: Any) -> dict[str, str]:
    """Validate the public Inventory ref projection and return exact commits."""
    if not isinstance(value, Mapping) or not value:
        raise ContextCompileError("Unit A workspace exact refs are invalid")
    commits: dict[str, str] = {}
    for raw_repository_key, ref in value.items():
        repository_key = _require_safe_repository_key(
            raw_repository_key, "workspace repository key"
        )
        if not isinstance(ref, Mapping):
            raise ContextCompileError("Unit A workspace exact ref row is invalid")
        unknown = set(ref) - UNIT_A_WORKSPACE_REF_ALLOWED_KEYS
        missing = UNIT_A_WORKSPACE_REF_REQUIRED_KEYS - set(ref)
        if unknown or missing:
            raise ContextCompileError("Unit A workspace exact ref keys mismatch")
        source_commit = ref.get("source_commit")
        if type(source_commit) is not str or not GIT_SHA_RE.fullmatch(source_commit):
            raise ContextCompileError("Unit A workspace source commit is invalid")
        source_tree = ref.get("source_tree")
        if source_tree is not None and (
            type(source_tree) is not str or not GIT_SHA_RE.fullmatch(source_tree)
        ):
            raise ContextCompileError("Unit A workspace source tree is invalid")
        tracked_entry_count = ref.get("tracked_entry_count")
        if tracked_entry_count is not None and (
            type(tracked_entry_count) is not int or tracked_entry_count < 0
        ):
            raise ContextCompileError("Unit A workspace entry count is invalid")
        commits[repository_key] = source_commit
    if len(commits) != len(value):
        raise ContextCompileError("Unit A workspace repository keys are duplicated")
    return commits


def _validate_unit_a_manifest_projection(
    manifest: Mapping[str, Any],
    model: Mapping[str, Any],
    selected_rows: Sequence[Mapping[str, Any]],
) -> None:
    """Fail closed on self-consistent forgeries of Unit A public boundaries."""
    _require_exact_keys(manifest, UNIT_A_MANIFEST_KEYS, "Unit A context manifest")
    inputs = manifest.get("input_sha256")
    gates = manifest.get("completion_gates")
    if not isinstance(inputs, Mapping) or not isinstance(gates, Mapping):
        raise ContextCompileError("Unit A manifest input or gate projection is invalid")
    _require_exact_keys(inputs, UNIT_A_INPUT_SHA_KEYS, "Unit A input identity")
    _require_exact_keys(gates, UNIT_A_COMPLETION_GATE_KEYS, "Unit A completion gates")
    if any(type(value) is not bool for value in gates.values()):
        raise ContextCompileError("Unit A completion gate type is invalid")
    if (
        type(manifest.get("selected_file_count")) is not int
        or manifest.get("selected_file_count") != len(selected_rows)
    ):
        raise ContextCompileError("Unit A selected-file count mismatch")
    workspace_commits = _validate_unit_a_workspace_exact_refs(
        manifest.get("workspace_exact_refs")
    )

    _require_exact_keys(model, UNIT_A_MODEL_KEYS, "Unit A premise model")
    _reject_sensitive_public_projection(model)
    _reject_sensitive_public_projection(selected_rows)
    publication_mode = model.get("publication_mode")
    if (
        model.get("schema_version")
        != "cocolon.system_context.premise_management.v1"
        or publication_mode
        not in ("PERSISTENT_PRIMARY", "EPHEMERAL_VERIFY_ONLY")
        or (
            manifest.get("task") == "cmee"
            and publication_mode != "PERSISTENT_PRIMARY"
        )
        or type(model.get("status")) is not str
        or model.get("status")
        not in ("UNIT_A_PREMISE_MODEL_READY", "UNIT_A_PREMISE_MODEL_BLOCKED")
        or model.get("owner_access_mode") != "READ_ONLY_EXACT_REF"
        or model.get("workspace_incorporation_claim") is not False
        or model.get("merge_required") is not False
        or model.get("rebase_required") is not False
        or model.get("integration_required") is not False
        or model.get("write_authority") is not False
    ):
        raise ContextCompileError("Unit A model read-only boundary violated")
    orientation = model.get("task_orientation")
    if not isinstance(orientation, Mapping):
        raise ContextCompileError("Unit A task orientation is invalid")
    _require_exact_keys(
        orientation,
        frozenset({"value", "authority_claim", "provenance"}),
        "Unit A task orientation",
    )
    if (
        type(orientation.get("value")) is not str
        or not orientation.get("value")
        or orientation.get("authority_claim") is not False
        or orientation.get("provenance") != "MANUAL_PROFILE_ASSERTION"
    ):
        raise ContextCompileError("Unit A task orientation authority boundary violated")
    _reject_sensitive_public_text(orientation["value"])

    owners = model.get("owners")
    premises = model.get("premises")
    responsibilities = model.get("responsibilities")
    conflicts = model.get("conflicts")
    exact_cmee_contract = (
        manifest.get("task") == "cmee"
    )
    if (
        not isinstance(owners, list)
        or not 1 <= len(owners) <= 8
        or any(not isinstance(row, Mapping) for row in owners)
        or not isinstance(premises, list)
        or len(premises) > 256
        or any(not isinstance(row, Mapping) for row in premises)
        or not isinstance(responsibilities, list)
        or not 1 <= len(responsibilities) <= 512
        or any(not isinstance(row, Mapping) for row in responsibilities)
        or not isinstance(conflicts, list)
        or any(not isinstance(row, Mapping) for row in conflicts)
    ):
        raise ContextCompileError("Unit A premise model row sets are invalid")
    if exact_cmee_contract and (
        len(owners), len(premises), len(responsibilities)
    ) != (1, 7, 21):
        raise ContextCompileError("Unit A CMEE contract cardinality mismatch")
    selected_identity_values = [row.get("identity") for row in selected_rows]
    if (
        any(type(identity) is not str or not identity for identity in selected_identity_values)
        or len(selected_identity_values) != len(set(selected_identity_values))
    ):
        raise ContextCompileError("Unit A selected-file identities are duplicated")
    selected_by_identity = {
        str(row["identity"]): row for row in selected_rows
    }

    owner_ids: list[str] = []
    for owner in owners:
        _require_exact_keys(owner, UNIT_A_PUBLIC_OWNER_KEYS, "Unit A public owner")
        owner_id = _require_safe_public_id(owner.get("owner_id"), "owner ID")
        repository_key = _require_safe_repository_key(
            owner.get("repository_key"), "owner repository key"
        )
        _require_safe_public_id(owner.get("responsibility"), "owner responsibility")
        _require_safe_public_id(owner.get("claim_boundary"), "owner claim boundary")
        _require_enum(
            owner.get("assertion_provenance"),
            ASSERTION_PROVENANCE,
            "owner assertion provenance",
        )
        repository = owner.get("repository")
        public_locator = owner.get("public_pr_number_or_locator")
        if (
            type(repository) is not str
            or not re.fullmatch(
                r"[A-Za-z0-9_.-]{1,128}/[A-Za-z0-9_.-]{1,128}", repository
            )
            or type(public_locator) is not str
            or not public_locator
        ):
            raise ContextCompileError("Unit A public owner locator is invalid")
        owner_ids.append(owner_id)
        if (
            repository_key not in workspace_commits
            or owner.get("access_mode") != "READ_ONLY_EXACT_REF"
            or owner.get("workspace_incorporation_claim") is not False
            or owner.get("write_authority") is not False
            or owner.get("merge_required") is not False
            or owner.get("rebase_required") is not False
            or owner.get("integration_required") is not False
            or type(owner.get("required")) is not bool
            or not GIT_SHA_RE.fullmatch(str(owner.get("workspace_material_commit") or ""))
        ):
            raise ContextCompileError("Unit A public owner authority boundary violated")
        _require_safe_git_ref(owner.get("remote_ref"), "Unit A owner ref")
        _validate_public_source_locator(owner.get("source_locator"), "Unit A owner locator")
        relation = owner.get("relation")
        heads = [
            owner.get("first_resolved_head"),
            owner.get("fetched_namespace_head"),
            owner.get("pre_publish_resolved_head"),
        ]
        if relation == "REMOTE_UNRESOLVED":
            if (
                any(head is not None for head in heads)
                or owner.get("merge_base") is not None
                or owner.get("owner_side_unique_commit_count") is not None
                or owner.get("workspace_side_unique_commit_count") is not None
                or owner.get("owner_side_changes") != []
                or owner.get("workspace_side_changes") != []
                or owner.get("owner_side_changed_paths") != []
                or owner.get("workspace_side_changed_paths") != []
            ):
                raise ContextCompileError("Unit A unresolved owner carries exact head")
        elif (
            type(relation) is not str
            or relation not in CANONICAL_OWNER_RELATIONS
            or not all(type(head) is str and GIT_SHA_RE.fullmatch(head) for head in heads)
            or len(set(heads)) != 1
        ):
            raise ContextCompileError("Unit A owner exact3 boundary violated")
        if relation != "REMOTE_UNRESOLVED" and (
            type(owner.get("merge_base")) is not str
            or not GIT_SHA_RE.fullmatch(owner["merge_base"])
            or type(owner.get("owner_side_unique_commit_count")) is not int
            or owner.get("owner_side_unique_commit_count") < 0
            or type(owner.get("workspace_side_unique_commit_count")) is not int
            or owner.get("workspace_side_unique_commit_count") < 0
        ):
            raise ContextCompileError("Unit A owner relation projection is invalid")
        if relation != "REMOTE_UNRESOLVED":
            owner_head = heads[0]
            workspace_material_commit = owner["workspace_material_commit"]
            merge_base = owner["merge_base"]
            expected_relation = (
                "SAME_REF"
                if workspace_material_commit == owner_head
                else "WORKSPACE_CONTAINS_OWNER_REF"
                if merge_base == owner_head
                else "OWNER_REF_AHEAD"
                if merge_base == workspace_material_commit
                else "DIVERGED"
            )
            owner_count = owner["owner_side_unique_commit_count"]
            workspace_count = owner["workspace_side_unique_commit_count"]
            if relation != expected_relation or (
                relation == "SAME_REF"
                and (owner_count != 0 or workspace_count != 0)
            ) or (
                relation == "WORKSPACE_CONTAINS_OWNER_REF" and owner_count != 0
            ) or (
                relation == "OWNER_REF_AHEAD" and workspace_count != 0
            ) or (
                relation == "DIVERGED"
                and (owner_count < 1 or workspace_count < 1)
            ):
                raise ContextCompileError("Unit A owner relation mismatch")
        for change_key, path_key in (
            ("owner_side_changes", "owner_side_changed_paths"),
            ("workspace_side_changes", "workspace_side_changed_paths"),
        ):
            changes = owner.get(change_key)
            paths = owner.get(path_key)
            if not isinstance(changes, list) or not isinstance(paths, list):
                raise ContextCompileError("Unit A owner change projection is invalid")
            for change in changes:
                if not isinstance(change, Mapping):
                    raise ContextCompileError("Unit A owner change row is invalid")
                _require_exact_keys(change, BUNDLE_CHANGE_KEYS, "Unit A owner change row")
                old_path = change.get("old_path")
                new_path = change.get("new_path")
                if old_path is not None:
                    _require_safe_repo_path(old_path, "Unit A owner old path")
                if new_path is not None:
                    _require_safe_repo_path(new_path, "Unit A owner new path")
                if old_path is None and new_path is None:
                    raise ContextCompileError("Unit A owner change path is invalid")
            if any(type(path) is not str for path in paths) or paths != sorted(
                set(paths)
            ) or paths != _owner_changed_path_projection(changes):
                raise ContextCompileError("Unit A owner changed paths are invalid")
            for path in paths:
                _require_safe_repo_path(path, "Unit A owner changed path")

    if len(owner_ids) != len(set(owner_ids)) or owner_ids != sorted(owner_ids):
        raise ContextCompileError("Unit A owner IDs are duplicated")
    owner_by_id = {
        str(owner["owner_id"]): owner
        for owner in owners
    }

    responsibility_id_values = [
        _require_safe_public_id(row.get("responsibility_id"), "responsibility ID")
        for row in responsibilities
    ]
    if (
        len(responsibility_id_values) != len(set(responsibility_id_values))
        or responsibility_id_values != sorted(responsibility_id_values)
    ):
        raise ContextCompileError("Unit A responsibility IDs are duplicated")
    responsibility_ids = set(responsibility_id_values)
    conflict_id_values = [
        _require_safe_public_id(row.get("conflict_id"), "conflict ID")
        for row in conflicts
    ]
    if (
        len(conflict_id_values) != len(set(conflict_id_values))
        or conflict_id_values != sorted(conflict_id_values)
    ):
        raise ContextCompileError("Unit A conflict IDs are duplicated")
    conflict_ids = set(conflict_id_values)
    premise_ids: list[str] = []
    for premise in premises:
        unknown = set(premise) - UNIT_A_PREMISE_ALLOWED_KEYS
        missing = UNIT_A_PREMISE_REQUIRED_KEYS - set(premise)
        if unknown or missing:
            raise ContextCompileError("Unit A premise row keys mismatch")
        premise_id = _require_safe_public_id(premise.get("premise_id"), "premise ID")
        premise_ids.append(premise_id)
        repository_key = _require_safe_repository_key(
            premise.get("repository_key"), "premise repository key"
        )
        owner_id = _require_safe_public_id(premise.get("owner_id"), "premise owner ID")
        responsibility_id = _require_safe_public_id(
            premise.get("responsibility"), "premise responsibility ID"
        )
        _require_enum(
            premise.get("read_tier"), SELECTION_TIERS, "premise read tier"
        )
        _require_enum(
            premise.get("assertion_provenance"),
            ASSERTION_PROVENANCE,
            "premise assertion provenance",
        )
        if "expected_identity_policy" in premise:
            policy = _require_enum(
                premise.get("expected_identity_policy"),
                EXPECTED_IDENTITY_POLICIES,
                "premise identity policy",
            )
            if policy != "BIND_EXACT_IDENTITY_AT_RESOLVED_OWNER_REF":
                raise ContextCompileError("Unit A premise identity policy is invalid")
        required_roles = premise.get("required_roles")
        if required_roles is not None and (
            not isinstance(required_roles, list)
            or any(type(role) is not str for role in required_roles)
            or required_roles != sorted(set(required_roles))
        ):
            raise ContextCompileError("Unit A premise required roles are invalid")
        for role in required_roles or []:
            if role not in {"PRO_KAREN", "ULTRA_KAREN"}:
                raise ContextCompileError("Unit A premise required role is invalid")
        if exact_cmee_contract and set(required_roles or []) != {
            "PRO_KAREN",
            "ULTRA_KAREN",
        }:
            raise ContextCompileError("Unit A CMEE premise roles are invalid")
        owner_read_order = premise.get("owner_read_order")
        if owner_read_order is not None and (
            type(owner_read_order) is not int
            or owner_read_order != premise.get("entry_chain_order")
        ):
            raise ContextCompileError("Unit A premise read order is invalid")
        if (
            repository_key not in workspace_commits
            or owner_id not in owner_by_id
            or owner_by_id[owner_id].get("repository_key") != repository_key
            or responsibility_id not in responsibility_ids
            or type(premise.get("required")) is not bool
            or type(premise.get("selected")) is not bool
            or type(premise.get("fresh")) is not bool
            or type(premise.get("entry_chain_order")) is not int
            or premise.get("entry_chain_order") < 1
            or type(premise.get("status")) is not str
            or premise.get("status") not in ("RESOLVED", "UNRESOLVED")
            or type(premise.get("read_target_status")) is not str
            or premise.get("read_target_status") not in (
                "OWNER_REF_EXACT_BLOB_SELECTED",
                "OWNER_REF_READ_TARGET_UNRESOLVED",
                "UNRESOLVED",
            )
        ):
            raise ContextCompileError("Unit A premise state is invalid")
        _require_safe_public_id(premise.get("reason_code"), "premise reason code")
        if "workspace_blob_matches_owner" in premise and type(
            premise.get("workspace_blob_matches_owner")
        ) is not bool:
            raise ContextCompileError("Unit A premise workspace match is invalid")
        if premise.get("status") == "RESOLVED":
            workspace_keys = {
                "workspace_record_identity",
                "workspace_inventory_source_commit",
                "workspace_blob_sha",
                "workspace_blob_matches_owner",
                "workspace_selection_status",
            }
            if (
                not workspace_keys.issubset(premise)
                or premise.get("selected") is not True
                or premise.get("fresh") is not True
                or premise.get("read_target_status")
                != "OWNER_REF_EXACT_BLOB_SELECTED"
                or type(premise.get("resolved_commit")) is not str
                or not GIT_SHA_RE.fullmatch(premise["resolved_commit"])
                or premise.get("resolved_commit")
                != owner_by_id[owner_id].get("fetched_namespace_head")
                or type(premise.get("resolved_blob_sha")) is not str
                or not GIT_SHA_RE.fullmatch(premise["resolved_blob_sha"])
            ):
                raise ContextCompileError("Unit A resolved premise is invalid")
        elif premise.get("selected") is not False or premise.get("fresh") is not False:
            raise ContextCompileError("Unit A unresolved premise is invalid")
        inventory_commit = premise.get("workspace_inventory_source_commit")
        if inventory_commit is not None and (
            type(inventory_commit) is not str
            or inventory_commit != workspace_commits[repository_key]
        ):
            raise ContextCompileError("Unit A premise workspace ref mismatch")
        workspace_identity = premise.get("workspace_record_identity")
        workspace_blob_sha = premise.get("workspace_blob_sha")
        if workspace_identity is not None and (
            type(workspace_identity) is not str or not workspace_identity
        ):
            raise ContextCompileError("Unit A premise workspace identity is invalid")
        if workspace_blob_sha is not None and (
            type(workspace_blob_sha) is not str
            or not GIT_SHA_RE.fullmatch(workspace_blob_sha)
        ):
            raise ContextCompileError("Unit A premise workspace blob is invalid")
        workspace_presence = (
            workspace_identity is not None,
            inventory_commit is not None,
            workspace_blob_sha is not None,
        )
        if any(workspace_presence) and not all(workspace_presence):
            raise ContextCompileError("Unit A premise workspace identity is incomplete")
        expected_workspace_match = bool(
            all(workspace_presence)
            and workspace_blob_sha == premise.get("resolved_blob_sha")
        )
        if (
            (all(workspace_presence) or "workspace_blob_matches_owner" in premise)
            and premise.get("workspace_blob_matches_owner")
            is not expected_workspace_match
        ):
            raise ContextCompileError("Unit A premise workspace match mismatch")
        if expected_workspace_match:
            selected_workspace = selected_by_identity.get(str(workspace_identity))
            if (
                not isinstance(selected_workspace, Mapping)
                or selected_workspace.get("repository_key") != repository_key
                or selected_workspace.get("path") != premise.get("path")
                or selected_workspace.get("source_commit") != inventory_commit
                or selected_workspace.get("blob_sha") != workspace_blob_sha
            ):
                raise ContextCompileError(
                    "Unit A premise selected workspace identity mismatch"
                )
        workspace_selection_status = premise.get("workspace_selection_status")
        if workspace_selection_status is not None:
            _require_safe_public_id(
                workspace_selection_status, "premise workspace selection status"
            )
            expected_workspace_status = (
                "WORKSPACE_IDENTICAL_BLOB_SELECTED"
                if premise.get("workspace_blob_matches_owner") is True
                else "OWNER_REF_ROUTING_ONLY"
            )
            if workspace_selection_status != expected_workspace_status:
                raise ContextCompileError(
                    "Unit A premise workspace selection status mismatch"
                )
        _require_safe_repo_path(premise.get("path"), "Unit A premise path")
        _validate_public_source_locator(
            premise.get("source_locator"), "Unit A premise locator"
        )
        if "metadata" in premise:
            _validate_unit_a_metadata_projection(premise["metadata"])

    if len(premise_ids) != len(set(premise_ids)):
        raise ContextCompileError("Unit A premise IDs are duplicated")
    entry_orders = [int(premise["entry_chain_order"]) for premise in premises]
    if entry_orders != list(range(1, len(premises) + 1)):
        raise ContextCompileError("Unit A premise order is not contiguous")

    for responsibility in responsibilities:
        _require_exact_keys(
            responsibility,
            UNIT_A_RESPONSIBILITY_KEYS,
            "Unit A responsibility row",
        )
        _require_enum(
            responsibility.get("responsibility_kind"),
            RESPONSIBILITY_KINDS,
            "responsibility kind",
        )
        _require_enum(
            responsibility.get("lifecycle"),
            LIFECYCLES,
            "responsibility lifecycle",
        )
        _require_enum(
            responsibility.get("authority_kind"),
            AUTHORITY_KINDS,
            "responsibility authority kind",
        )
        _require_enum(
            responsibility.get("assertion_provenance"),
            ASSERTION_PROVENANCE,
            "responsibility assertion provenance",
        )
        for field in (
            "publication_state",
            "effective_condition",
            "authority_claim_boundary",
        ):
            _require_safe_public_id(responsibility.get(field), f"responsibility {field}")
        expected_authority_role = responsibility.get("authority_kind") in {
            "NORMATIVE_AUTHORITY",
            "DESIGN_AUTHORITY",
            "ACTUAL_SOURCE_AUTHORITY",
            "TEST_CONTRACT_AUTHORITY",
            "NAVIGATION_AUTHORITY",
        }
        if (
            responsibility.get("effective_authority_claim") is not False
            or responsibility.get("authority_claim_boundary")
            != "ROLE_FACT_ONLY_NO_AUTOMATIC_EFFECTIVE_AUTHORITY"
            or type(responsibility.get("authority_role_declared")) is not bool
            or responsibility.get("authority_role_declared")
            is not expected_authority_role
        ):
            raise ContextCompileError("Unit A responsibility authority boundary violated")
        subject = responsibility.get("subject_locator")
        if not isinstance(subject, Mapping):
            raise ContextCompileError("Unit A responsibility subject is invalid")
        _require_exact_keys(
            subject,
            frozenset({"repository_key", "owner_id", "path"}),
            "Unit A responsibility subject",
        )
        repository_key = _require_safe_repository_key(
            subject.get("repository_key"), "responsibility repository key"
        )
        owner_id = _require_safe_public_id(
            subject.get("owner_id"), "responsibility owner ID"
        )
        if (
            repository_key not in workspace_commits
            or owner_id not in owner_by_id
            or owner_by_id[owner_id].get("repository_key") != repository_key
            or type(responsibility.get("workspace_blob_matches_owner")) is not bool
        ):
            raise ContextCompileError("Unit A responsibility subject is invalid")
        inventory_commit = responsibility.get("workspace_inventory_source_commit")
        if inventory_commit is not None and (
            type(inventory_commit) is not str
            or inventory_commit != workspace_commits[repository_key]
        ):
            raise ContextCompileError("Unit A responsibility workspace ref mismatch")
        resolved_commit = responsibility.get("resolved_owner_commit")
        resolved_blob_sha = responsibility.get("resolved_owner_blob_sha")
        if (resolved_commit is None) != (resolved_blob_sha is None) or (
            resolved_commit is not None
            and (
                type(resolved_commit) is not str
                or not GIT_SHA_RE.fullmatch(resolved_commit)
                or resolved_commit
                != owner_by_id[owner_id].get("fetched_namespace_head")
                or type(resolved_blob_sha) is not str
                or not GIT_SHA_RE.fullmatch(resolved_blob_sha)
            )
        ):
            raise ContextCompileError("Unit A responsibility owner identity is invalid")
        workspace_identity = responsibility.get("workspace_subject_identity")
        workspace_presence = (
            workspace_identity is not None,
            inventory_commit is not None,
        )
        if any(workspace_presence) and not all(workspace_presence):
            raise ContextCompileError(
                "Unit A responsibility workspace identity is incomplete"
            )
        if workspace_identity is not None and (
            type(workspace_identity) is not str or not workspace_identity
        ):
            raise ContextCompileError(
                "Unit A responsibility workspace identity is invalid"
            )
        selected_subject = (
            selected_by_identity.get(str(workspace_identity))
            if workspace_identity is not None
            else None
        )
        if selected_subject is not None:
            if (
                selected_subject.get("repository_key") != repository_key
                or selected_subject.get("path") != subject.get("path")
                or selected_subject.get("source_commit") != inventory_commit
            ):
                raise ContextCompileError(
                    "Unit A responsibility selected identity mismatch"
                )
            expected_workspace_match = bool(
                resolved_blob_sha is not None
                and selected_subject.get("blob_sha") == resolved_blob_sha
            )
            if (
                responsibility.get("workspace_blob_matches_owner")
                is not expected_workspace_match
            ):
                raise ContextCompileError(
                    "Unit A responsibility workspace match mismatch"
                )
        elif responsibility.get("workspace_blob_matches_owner") is True:
            raise ContextCompileError(
                "Unit A responsibility matching workspace identity is not selected"
            )
        for edge_key in ("supersedes", "superseded_by"):
            edge_ids = responsibility.get(edge_key)
            if (
                not isinstance(edge_ids, list)
                or any(type(item) is not str for item in edge_ids)
                or any(item not in responsibility_ids for item in edge_ids)
                or edge_ids != sorted(set(edge_ids))
            ):
                raise ContextCompileError("Unit A responsibility edge set is invalid")
        _require_safe_repo_path(subject.get("path"), "Unit A responsibility path")
        _validate_public_source_locator(
            responsibility.get("source_locator"),
            "Unit A responsibility locator",
        )
        assertions = responsibility.get("metadata_assertions")
        if not isinstance(assertions, list) or len(assertions) > 64:
            raise ContextCompileError("Unit A metadata assertion projection is invalid")
        for assertion in assertions:
            if not isinstance(assertion, Mapping):
                raise ContextCompileError("Unit A metadata assertion row is invalid")
            _require_exact_keys(
                assertion,
                frozenset({"metadata_kind", "metadata_key", "expected_value"}),
                "Unit A metadata assertion row",
            )
            metadata_kind = assertion.get("metadata_kind")
            metadata_key = assertion.get("metadata_key")
            if (
                type(metadata_kind) is not str
                or metadata_kind not in ("FRONT_MATTER", "JSON_POINTER")
                or type(metadata_key) is not str
                or not metadata_key
            ):
                raise ContextCompileError("Unit A metadata assertion locator is invalid")
            if metadata_kind == "FRONT_MATTER":
                if metadata_key not in METADATA_ALLOWLIST:
                    raise ContextCompileError("Unit A front-matter assertion is invalid")
            else:
                _json_pointer_tokens(metadata_key)
            _validate_public_expected_value(
                assertion.get("expected_value"),
                "Unit A metadata expected value",
            )
            if (
                assertion.get("metadata_kind") == "FRONT_MATTER"
                and assertion.get("metadata_key") == "automatic_progression"
                and assertion.get("expected_value") is not False
            ):
                raise ContextCompileError(
                    "Unit A metadata automatic progression assertion violated"
                )
        _validate_unit_a_metadata_projection(responsibility.get("metadata"))

    _validate_supersession_graph(responsibilities)

    for conflict in conflicts:
        if (
            set(conflict) - UNIT_A_CONFLICT_ALLOWED_KEYS
            or UNIT_A_CONFLICT_REQUIRED_KEYS - set(conflict)
            or type(conflict.get("blocking")) is not bool
        ):
            raise ContextCompileError("Unit A conflict row is invalid")
        _require_safe_public_id(conflict.get("reason_code"), "conflict reason code")
        _require_safe_public_id(conflict.get("resolution"), "conflict resolution")
        if type(conflict.get("handback_owner")) is not str or not conflict.get(
            "handback_owner"
        ):
            raise ContextCompileError("Unit A conflict handback owner is invalid")
        _reject_sensitive_public_text(conflict["handback_owner"])
        candidates = conflict.get("candidate_responsibility_ids")
        if (
            not isinstance(candidates, list)
            or any(type(candidate) is not str for candidate in candidates)
            or any(candidate not in responsibility_ids for candidate in candidates)
            or candidates != sorted(set(candidates))
        ):
            raise ContextCompileError("Unit A conflict responsibility set is invalid")
        if "repository_key" in conflict:
            _require_safe_repository_key(
                conflict.get("repository_key"), "conflict repository key"
            )
        if "path" in conflict:
            _require_safe_repo_path(conflict.get("path"), "Unit A conflict path")
        if "responsibility_id" in conflict and conflict.get(
            "responsibility_id"
        ) not in responsibility_ids:
            raise ContextCompileError("Unit A conflict responsibility is invalid")

    blocking_codes = model.get("blocking_codes")
    if (
        not isinstance(blocking_codes, list)
        or any(type(code) is not str for code in blocking_codes)
        or blocking_codes != sorted(set(blocking_codes))
    ):
        raise ContextCompileError("Unit A blocking-code set is invalid")
    for code in blocking_codes:
        _require_safe_public_id(code, "blocking code")

    bindings = model.get("bindings_by_identity")
    if not isinstance(bindings, Mapping):
        raise ContextCompileError("Unit A identity bindings are invalid")
    selected_identities = set(selected_by_identity)
    if any(type(identity) is not str or not identity for identity in bindings):
        raise ContextCompileError("Unit A identity binding key is invalid")
    for binding in bindings.values():
        if not isinstance(binding, Mapping):
            raise ContextCompileError("Unit A identity binding row is invalid")
        _require_exact_keys(
            binding,
            frozenset({"responsibility_ids", "conflict_ids"}),
            "Unit A identity binding row",
        )
        if (
            not isinstance(binding.get("responsibility_ids"), list)
            or any(
                type(item) is not str for item in binding["responsibility_ids"]
            )
            or any(
                item not in responsibility_ids
                for item in binding["responsibility_ids"]
            )
            or binding["responsibility_ids"]
            != sorted(set(binding["responsibility_ids"]))
            or not isinstance(binding.get("conflict_ids"), list)
            or any(type(item) is not str for item in binding["conflict_ids"])
            or any(item not in conflict_ids for item in binding["conflict_ids"])
            or binding["conflict_ids"] != sorted(set(binding["conflict_ids"]))
        ):
            raise ContextCompileError("Unit A identity binding target is invalid")

    expected_non_proof = [
        "NO_AUTOMATIC_OWNER_DECISION",
        "NO_WORKSPACE_INCORPORATION_CLAIM",
        "NO_WRITE_AUTHORITY",
    ]
    for row in selected_rows:
        _require_exact_keys(row, UNIT_A_SELECTED_ROW_KEYS, "Unit A selected row")
        identity = row.get("identity")
        repository_key = _require_safe_repository_key(
            row.get("repository_key"), "selected repository key"
        )
        _require_safe_repo_path(row.get("path"), "Unit A selected path")
        expected_binding = bindings.get(
            identity, {"responsibility_ids": [], "conflict_ids": []}
        )
        expected_tier = (
            "UNRESOLVED_IMPACT"
            if expected_binding["conflict_ids"]
            else "DECISION_SURFACE"
            if row.get("read_classification") == "CURRENT_OWNER"
            else "MUST_READ_FULL"
            if row.get("read_classification") == "MUST_READ_FULL"
            else "REFERENCE_ON_TRIGGER"
        )
        selection_reasons = row.get("selection_reasons")
        if (
            not isinstance(selection_reasons, list)
            or any(type(reason) is not str for reason in selection_reasons)
            or selection_reasons != sorted(set(selection_reasons))
            or type(row.get("graph_distance")) is not int
            or row.get("graph_distance") < 0
            or (
                row.get("size_bytes") is not None
                and (
                    type(row.get("size_bytes")) is not int
                    or row.get("size_bytes") < 0
                )
            )
        ):
            raise ContextCompileError("Unit A selected-row projection is invalid")
        if (
            type(identity) is not str
            or not identity
            or repository_key not in workspace_commits
            or row.get("source_commit") != workspace_commits[repository_key]
            or type(row.get("blob_sha")) is not str
            or not GIT_SHA_RE.fullmatch(row["blob_sha"])
            or type(row.get("content_sha256")) is not str
            or not SHA256_RE.fullmatch(row["content_sha256"])
            or type(row.get("inventory_classification")) is not str
            or not row.get("inventory_classification")
            or type(row.get("evidence_kind")) is not str
            or not row.get("evidence_kind")
            or type(row.get("read_classification")) is not str
            or row.get("read_classification") not in CLASSIFICATIONS
            or row.get("classification_provenance") != "LEGACY_PATH_RULE"
            or row.get("authority_claim") is not False
            or type(row.get("selection_tier")) is not str
            or row.get("selection_tier") not in SELECTION_TIERS
            or row.get("non_proof_boundaries") != expected_non_proof
            or not isinstance(row.get("responsibility_ids"), list)
            or any(type(item) is not str for item in row["responsibility_ids"])
            or any(item not in responsibility_ids for item in row["responsibility_ids"])
            or row["responsibility_ids"] != expected_binding["responsibility_ids"]
            or not isinstance(row.get("conflict_ids"), list)
            or any(type(item) is not str for item in row["conflict_ids"])
            or any(item not in conflict_ids for item in row["conflict_ids"])
            or row["conflict_ids"] != expected_binding["conflict_ids"]
            or row.get("selection_tier") != expected_tier
        ):
            raise ContextCompileError("Unit A selected-row authority boundary violated")

    owner_ready = all(
        owner.get("relation") != "REMOTE_UNRESOLVED"
        and owner.get("first_resolved_head")
        == owner.get("fetched_namespace_head")
        == owner.get("pre_publish_resolved_head")
        for owner in owners
        if owner.get("required") is True
    )
    premises_ready = all(
        premise.get("status") == "RESOLVED"
        and premise.get("fresh") is True
        and premise.get("selected") is True
        and premise.get("read_target_status")
        == "OWNER_REF_EXACT_BLOB_SELECTED"
        for premise in premises
        if premise.get("required") is True
    )
    responsibilities_ready = all(
        type(responsibility.get("resolved_owner_commit")) is str
        and GIT_SHA_RE.fullmatch(responsibility["resolved_owner_commit"])
        and type(responsibility.get("resolved_owner_blob_sha")) is str
        and GIT_SHA_RE.fullmatch(responsibility["resolved_owner_blob_sha"])
        for responsibility in responsibilities
    )
    expected_status = (
        "UNIT_A_PREMISE_MODEL_READY"
        if owner_ready
        and premises_ready
        and responsibilities_ready
        and not blocking_codes
        and not any(conflict.get("blocking") is True for conflict in conflicts)
        else "UNIT_A_PREMISE_MODEL_BLOCKED"
    )
    if model.get("status") != expected_status:
        raise ContextCompileError("Unit A premise readiness status mismatch")


def verify_task_context(
    output_dir: Path,
    *,
    expected_unit_a: bool | None = None,
    expected_task: str | None = None,
    expected_publication_mode: str | None = None,
) -> Mapping[str, Any]:
    """Verify output hashes and the context fingerprint; reject tampering."""
    manifest_path = output_dir / "context_manifest.json"
    manifest = _read_json(manifest_path)
    if not isinstance(manifest, Mapping):
        raise ContextCompileError("context manifest must be an object")
    if manifest.get("schema_version") != SCHEMA_VERSION:
        raise ContextCompileError("unsupported context manifest schema")
    output_sha = manifest.get("output_sha256", {})
    if not isinstance(output_sha, Mapping):
        raise ContextCompileError("context manifest output hashes are invalid")
    if set(output_sha) != set(OUTPUT_NAMES):
        raise ContextCompileError("context manifest output set is not canonical exact7")
    for name, expected in output_sha.items():
        actual = _sha256_file(output_dir / name)
        if actual != expected:
            raise ContextCompileError(f"context output tamper detected: {name}")
    selected_rows = list(_iter_jsonl(output_dir / "selected_files.jsonl"))
    inputs = manifest.get("input_sha256")
    if not isinstance(inputs, Mapping):
        raise ContextCompileError("context manifest input hashes are invalid")
    owner_bundle_fingerprint = inputs.get("owner_bundle")
    unit_a_model = manifest.get("unit_a_premise_management")
    selected_unit_a_marker = any(
        "classification_provenance" in row
        or "authority_claim" in row
        or "selection_tier" in row
        for row in selected_rows
    )
    observed_unit_a = (
        "unit_a_premise_management" in manifest
        or "owner_bundle" in inputs
        or "unit_a_model" in inputs
        or selected_unit_a_marker
    )
    if expected_unit_a is True and not observed_unit_a:
        raise ContextCompileError("expected Unit A artifact markers are missing")
    if expected_unit_a is False and observed_unit_a:
        raise ContextCompileError("unexpected Unit A artifact markers")
    is_unit_a = expected_unit_a is True or observed_unit_a
    if expected_task is not None and manifest.get("task") != expected_task:
        raise ContextCompileError("task context trusted task mismatch")
    if expected_unit_a is True and (
        type(expected_task) is not str
        or not expected_task
        or expected_publication_mode
        not in ("PERSISTENT_PRIMARY", "EPHEMERAL_VERIFY_ONLY")
    ):
        raise ContextCompileError("trusted Unit A expectation is incomplete")
    if is_unit_a:
        if not isinstance(unit_a_model, Mapping):
            raise ContextCompileError("Unit A premise model is missing or invalid")
        if (
            expected_publication_mode is not None
            and unit_a_model.get("publication_mode")
            != expected_publication_mode
        ):
            raise ContextCompileError("Unit A trusted publication mode mismatch")
        _validate_unit_a_manifest_projection(manifest, unit_a_model, selected_rows)
    payload = {
        "workspace": manifest["workspace"],
        "task": manifest["task"],
        "step1_manifest_sha256": manifest["input_sha256"]["step1_manifest"],
        "step1_files_sha256": manifest["input_sha256"]["step1_files"],
        "step2_manifest_sha256": manifest["input_sha256"]["step2_manifest"],
        "step3_manifest_sha256": manifest["input_sha256"]["step3_manifest"],
        "publication_transport_sha256": manifest["input_sha256"].get("publication_transport"),
        "workspace_profiles_sha256": manifest["input_sha256"]["workspace_profiles"],
        "task_profile_sha256": manifest["input_sha256"]["task_profile"],
        "manual_overlay_sha256": manifest["input_sha256"]["manual_overlay"],
        "selected_file_identities": [row["identity"] for row in selected_rows],
        "output_sha256": dict(sorted(output_sha.items())),
    }
    if is_unit_a:
        if (
            type(owner_bundle_fingerprint) is not str
            or not SHA256_RE.fullmatch(owner_bundle_fingerprint)
        ):
            raise ContextCompileError("context owner bundle fingerprint is invalid")
        completion_gates = manifest.get("completion_gates")
        if (
            manifest.get("status")
            != "STEP4_INCOMPLETE_BLOCKING_CONTEXT_OR_REMOTE_VERIFICATION"
            or manifest.get("completion_claim") is not None
            or type(manifest.get("product_credit")) is not int
            or manifest.get("product_credit") != 0
            or manifest.get("automatic_progression") is not False
            or not isinstance(completion_gates, Mapping)
            or completion_gates.get("operator_v1_activation_approved") is not False
            or completion_gates.get("generated_output_remote_hash_verified") is not False
        ):
            raise ContextCompileError(
                "Unit A top-level activation or completion boundary violated"
            )
        payload["owner_bundle_fingerprint"] = owner_bundle_fingerprint
        expected_model_sha = str(
            manifest["input_sha256"].get("unit_a_model") or ""
        )
        if not isinstance(unit_a_model, Mapping) or not SHA256_RE.fullmatch(
            expected_model_sha
        ):
            raise ContextCompileError("Unit A premise model is missing or invalid")
        premise_rows = unit_a_model.get("premises")
        responsibility_rows = unit_a_model.get("responsibilities")
        conflict_rows = unit_a_model.get("conflicts")
        if (
            not isinstance(premise_rows, list)
            or any(not isinstance(row, Mapping) for row in premise_rows)
            or not isinstance(responsibility_rows, list)
            or any(not isinstance(row, Mapping) for row in responsibility_rows)
            or not isinstance(conflict_rows, list)
            or any(not isinstance(row, Mapping) for row in conflict_rows)
        ):
            raise ContextCompileError("Unit A premise model row sets are invalid")
        expected_counts = {
            "required_premise_count": len(premise_rows),
            "required_premise_resolved_count": sum(
                row.get("status") == "RESOLVED"
                for row in premise_rows
                if row.get("required")
            ),
            "responsibility_count": len(responsibility_rows),
            "conflict_count": len(conflict_rows),
        }
        if any(
            type(unit_a_model.get(key)) is not int
            or unit_a_model.get(key) != expected
            for key, expected in expected_counts.items()
        ):
            raise ContextCompileError("Unit A premise model count mismatch")
        # Count conveniences are part of the manifest projection, not the
        # shared model identity used by the compiler.
        identity_model = dict(unit_a_model)
        for key in (
            "required_premise_count",
            "required_premise_resolved_count",
            "responsibility_count",
            "conflict_count",
        ):
            identity_model.pop(key, None)
        actual_model_sha = _sha256_bytes(_canonical_json_bytes(identity_model))
        if actual_model_sha != expected_model_sha:
            raise ContextCompileError("Unit A premise model tamper detected")
        if (
            unit_a_model.get("completion_claim") is not None
            or type(unit_a_model.get("v1_activation")) is not int
            or unit_a_model.get("v1_activation") != 0
            or type(unit_a_model.get("product_credit")) is not int
            or unit_a_model.get("product_credit") != 0
            or type(unit_a_model.get("technical_credit")) is not int
            or unit_a_model.get("technical_credit") != 0
            or unit_a_model.get("automatic_progression") is not False
            or unit_a_model.get("workspace_incorporation_claim") is not False
            or unit_a_model.get("write_authority") is not False
            or unit_a_model.get("integration_required") is not False
        ):
            raise ContextCompileError("Unit A activation or authority boundary violated")
        payload["unit_a_model_sha256"] = expected_model_sha
        payload["workspace_exact_refs"] = manifest["workspace_exact_refs"]
        payload["unit_a_completion_gates"] = completion_gates
    actual_fingerprint = _sha256_bytes(_canonical_json_bytes(payload))
    if actual_fingerprint != manifest.get("context_fingerprint"):
        raise ContextCompileError("context fingerprint tamper detected")
    return manifest
