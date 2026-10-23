"""Fixture binding proposal for root's single-owner C0 execution.

Prepared against mashos-api 3084c99e5a08d6e475d8a177e62ebf1548e8a0f9.
This module has NOT been used to run the two trial cases. No DB/API/Auth I/O.
Set PYTHONPATH to the exact materialized ai/services/ai_inference directory.
"""
from dataclasses import asdict
import json

API_SHA = "3084c99e5a08d6e475d8a177e62ebf1548e8a0f9"
OFFLINE_OWNER = "offline-cocolon-four-case-owner-20261023"
FIELDS = {"id", "created_at", "memo", "memo_action", "category", "emotions", "emotion_details"}


def visible_task(row):
    """Read only the row's actual user source, no review/index/other fixtures."""
    return json.loads(next(m["content"] for m in row["messages"] if m["role"] == "user"))


def piece_source(row):
    from piece_v2_contract import canonical_json_bytes
    from piece_v2_generation import PieceSourceSnapshot
    task = visible_task(row)
    raw = task["source_bundle"]["original"]
    assert set(raw) == FIELDS
    # Same exact field projection/order as project_saved_original_source.
    # The source adapter module is not imported because it pulls Auth/DB owners.
    view = "\n\n".join(raw[k] for k in ("memo", "memo_action")
                         if raw[k] is not None and raw[k].strip())
    return PieceSourceSnapshot(
        owner_id=OFFLINE_OWNER, saved_input_id=raw["id"],
        source_version="emlis.current_input_bundle.v1", original_text=view,
        source_role="original", source_stage=task["source_bundle"]["source_stage"],
        saved_original_json=canonical_json_bytes(raw)), task["tier"]


def analysis_request(row):
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import (
        AnalysisSavedRecord, AnalysisObservedMapRequest, canonical_bytes, commitment,
    )
    task = visible_task(row)
    bundle = task["source_bundle"]
    records = bundle["records"]
    assert all(set(raw) == FIELDS for raw in records)
    members = tuple(AnalysisSavedRecord(
        owner_scope=OFFLINE_OWNER, saved_record_ref=raw["id"],
        saved_record_version=commitment(raw),
        original_json=canonical_bytes(raw).decode("utf-8"), supplements=(),
        record_state="LIVE") for raw in records)
    return AnalysisObservedMapRequest(
        request_id="offline-A02-P1-20261023",
        authenticated_owner_scope=OFFLINE_OWNER,
        period_start=bundle["period"]["start"],
        period_end=bundle["period"]["end_exclusive"], members=members)


def run_piece_once(row):
    """Root may call exactly once for P01-N. No silent fallback or retry."""
    from piece_v2_generation import generate_piece_candidate
    from piece_v2_contract import PieceContractError
    source, tier = piece_source(row)
    try:
        candidate = generate_piece_candidate(source,
            authenticated_owner_id=OFFLINE_OWNER, tier=tier, requested_format=None)
    except PieceContractError as exc:
        return {"status": "UNAVAILABLE", "contract_code": exc.code,
                "reason_detail": exc.detail, "candidate": None}
    return {"status": "GENERATED", "candidate": candidate}


def run_analysis_once(row):
    """Root may call exactly once for A02-P1; projections are not generation."""
    from cocolon_meaning_experience_engine.engine import MeaningExperienceEngine
    from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
    outcome = MeaningExperienceEngine().generate(analysis_request(row))
    result = {"outcome": outcome.as_body_free(), "artifact": None}
    if outcome.artifact is None:
        return result
    result["artifact"] = asdict(outcome.artifact)
    # Preserve raw generated graph for offline review. Safe rendering may have
    # a narrower surface; record that limitation rather than replace the graph.
    for key, method in (("safe_visual", "safe_projection"),
                        ("safe_text", "safe_text_projection"),
                        ("private_visual", "private_visual_preview"),
                        ("private_text", "private_text_preview")):
        try:
            result[key] = getattr(outcome.artifact, method)(authenticated_owner_scope=OFFLINE_OWNER)
        except AnalysisSourceError as exc:
            result[key] = {"status": "UNAVAILABLE", "reason": str(exc)}
    return result
