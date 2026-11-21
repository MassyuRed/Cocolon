"""Draft native C0 Emlis bindings; importing this module generates nothing.

Source owner: mashos-api@3084c99e5a08d6e475d8a177e62ebf1548e8a0f9.
Only root's bounded runner may call engine.generate/prepare_emlis_update.
No service/store/API/DB imports. The visible source is unchanged fixture JSON.
"""
from copy import deepcopy
from dataclasses import replace
import json


def visible_payload(row):
    messages = row["messages"]
    user = [m for m in messages if m["role"] == "user"]
    if len(user) != 1:
        raise ValueError("fixture_user_message_cardinality")
    payload = json.loads(user[0]["content"])
    if payload["core"] != "emlis" or payload["tier"] != "free":
        raise ValueError("fixture_emlis_free_required")
    return payload


def initial_request(row):
    from emlis_ai_current_input_bundle import build_emlis_current_input_bundle
    from cocolon_meaning_experience_engine.contracts import GenerationRequest
    from cocolon_meaning_experience_engine.source_kernel import freeze_text_source
    from cocolon_meaning_experience_engine.emlis_thread_contracts import (
        EmlisThreadInputV1, EmlisQuestionControlV1,
    )

    payload = visible_payload(row)
    source = payload["source_bundle"]
    if source.get("supplemental"):
        raise ValueError("initial_fixture_cannot_include_supplement")
    original = deepcopy(source["original"])
    req = GenerationRequest(
        request_id="offline-trial-" + row["case_id"],
        current_input_bundle=build_emlis_current_input_bundle(original),
        expected_source_record_id=original["id"],
    )
    src = freeze_text_source(req)
    # Q3_FREE is current service capability, with no history and one question.
    # OFFLINE_CANDIDATE is retained; EMLIS_APPLICATION is not falsely exercised.
    thread = EmlisThreadInputV1(
        thread_id="offline-thread-" + original["id"],
        original_source_ref=src.envelope.envelope_id,
        capability_snapshot="Q3_FREE",
        question_control_context=EmlisQuestionControlV1(question_limit=1),
    )
    return replace(req, emlis_thread=thread)


def answer_request(row, first_request, first_outcome, engine, *, recorded_at):
    """Bind the one fixed supplement only to an actual C0 question.

    Returns (None, reason) for no pending question, without inventing one.
    If a question exists, root performs pure meaning preparation once here,
    then performs the answer-body engine.generate once outside this helper.
    """
    from cocolon_meaning_experience_engine.emlis_thread_contracts import (
        EmlisQuestionControlV1, SupplementalAnswerSource,
    )

    if first_outcome.question is None:
        return None, "N_A_NO_ACTUAL_PENDING_QUESTION"
    if first_outcome.body is None or first_outcome.body.artifact is None:
        return None, "N_A_INITIAL_BODY_UNAVAILABLE"
    payload = visible_payload(row)
    source = payload["source_bundle"]
    if source["original"] != first_request.current_input_bundle.raw_current_input:
        raise ValueError("supplement_original_snapshot_mismatch")
    supplemental = source.get("supplemental", [])
    if len(supplemental) != 1:
        raise ValueError("single_supplement_required")
    item = supplemental[0]
    if (item["source_role"] != "SUPPLEMENTAL_ANSWER"
            or item["parent_record_id"] != source["original"]["id"]):
        raise ValueError("supplement_parent_mismatch")
    q, t = first_outcome.question, first_request.emlis_thread
    answer = SupplementalAnswerSource(
        answer_id=item["source_id"], thread_id=t.thread_id,
        question_id=q.question_id, round_index=1,
        original_source_ref=t.original_source_ref,
        answer_text_private=item["text"], recorded_at=recorded_at,
    )
    control = EmlisQuestionControlV1(
        pending_question=q, asked_target_refs=(q.decision.target_ref,),
        issued_count=1, issued_questions=(q,), question_limit=1,
    )
    t2 = replace(t, answers=(answer,), current_round=1,
                 question_control_context=control,
                 prepared_meaning_checkpoint_ref=None)
    req = replace(first_request, request_id="offline-trial-" + row["case_id"],
                  emlis_thread=t2)
    cp = engine.prepare_emlis_update(req)
    return replace(req, emlis_thread=replace(
        t2, prepared_meaning_checkpoint_ref=cp.checkpoint_id)), cp
