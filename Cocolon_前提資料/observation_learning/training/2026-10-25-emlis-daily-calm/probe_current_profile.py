"""One-shot CPU scope diagnostic; no model, training, network, SQL or repair.

The candidate is an UNADOPTED mapping draft, never a successful model output.
Run against the pinned API checkout; do not change the existing profile to pass.
"""
from __future__ import annotations

import argparse
from dataclasses import replace
import hashlib
import json
from pathlib import Path
import platform
import subprocess
import sys


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--api-root", type=Path, required=True)
    p.add_argument("--cocolon-root", type=Path, required=True)
    p.add_argument("--output-dir", type=Path, required=True)
    args = p.parse_args()
    api = args.api_root.resolve()
    root = args.cocolon_root.resolve()
    api_head = subprocess.check_output(["git", "-C", str(api), "rev-parse", "HEAD"], text=True).strip()
    if api_head != "95d00b907f6d9c42944666269acc457c9af34f37":
        raise SystemExit("pinned_api_head_required")
    paths = [
        "ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py",
        "ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py",
        "ai/services/ai_inference/emlis_ai_grounded_observation_gate.py",
    ]
    sha = lambda data: hashlib.sha256(data).hexdigest()
    before = {name: sha((api / name).read_bytes()) for name in paths}
    sys.path.insert(0, str(api / "ai/services/ai_inference"))
    from emlis_ai_current_input_bundle import build_emlis_current_input_bundle
    from cocolon_meaning_experience_engine.contracts import GenerationRequest
    from cocolon_meaning_experience_engine.source_kernel import freeze_text_source
    from cocolon_meaning_experience_engine.emlis_thread_contracts import EmlisThreadInputV1
    from cocolon_meaning_experience_engine.preparation import prepare_emlis, receive_candidate
    from cocolon_meaning_experience_engine.emlis_semantic_admission import (
        MODEL_PROFILE, SemanticInput, SemanticNotAdopted, prepare_model_snapshot,
    )
    from cocolon_meaning_experience_engine.model_candidate_source import build_model_messages

    teacher_path = "Cocolon_前提資料/observation_learning/training/2026-10-24-emlis-free-pilot/sft_examples.jsonl"
    teacher_bytes = (root / teacher_path).read_bytes()
    teacher = next(x for x in map(json.loads, teacher_bytes.decode().splitlines()) if x["id"] == "FT-UDON-INITIAL")
    assert teacher["scenario_persons_fictitious"] is True
    user = json.loads(next(m["content"] for m in teacher["messages"] if m["role"] == "user"))
    surface = json.loads(next(m["content"] for m in teacher["messages"] if m["role"] == "assistant"))
    ref = teacher["source_refs"][0]
    dialogue = (root / ref["path"]).read_text()
    assert dialogue[ref["start_scalar"]:ref["end_scalar_exclusive"]] == ref["quote"]
    raw = dict(user["source_bundle"]["original"], created_at="2026-10-25T10:00:00Z", is_secret=False)
    req = GenerationRequest("daily-calm-scope-diagnostic", build_emlis_current_input_bundle(raw), raw["id"])
    source = freeze_text_source(req)
    req = replace(req, emlis_thread=EmlisThreadInputV1("daily-calm-scope-thread", source.envelope.envelope_id))
    material = prepare_emlis(req)
    sid = material.payload()["sources"][0]["source_id"]
    evidence = []

    def ev(field, start, end):
        text = raw[field][start:end]
        evidence.append(dict(source_id=sid, field_path=field, start=start, end=end, quote=text))
        return len(evidence) - 1

    role_specs = [("return", "EVENT", "memo_action", 0, 3),
                  ("cook", "EVENT", "memo_action", 6, 13),
                  ("eat", "EVENT", "memo_action", 13, 16),
                  ("warm_food_eat", "EVENT", "memo", 0, 10),
                  ("slight_calm", "STATE", "memo", 12, 21)]
    claims = []
    for cid, kind, field, start, end in role_specs:
        index = ev(field, start, end)
        quote = evidence[index]["quote"]
        claims.append(dict(claim_id=cid, kind=kind, text=quote,
            subject=dict(binding="OMITTED", source_entity=None, evidence_indexes=[]),
            predicate=dict(surface=quote, arguments=[]),
            polarity=dict(value="AFFIRMED", scope_refs=[cid], evidence_indexes=[index]),
            modality=dict(value="ASSERTED_AS_WRITTEN", evidence_indexes=[index]),
            about_time=dict(kind="WRITTEN_PAST_UNRESOLVED_OCCASION", expression=None,
                anchor_source_id=sid, evidence_indexes=[index]), qualifiers=[], evidence_indexes=[index]))
    kara, te, tara = ev("memo_action", 0, 16), ev("memo_action", 10, 16), ev("memo", 0, 21)
    relation_specs = [
        ("return_before_cook", "SOURCE_WRITTEN_TEMPORAL_KARA_LINK", "return", "cook", kara),
        ("return_before_eat", "SOURCE_WRITTEN_TEMPORAL_KARA_LINK", "return", "eat", kara),
        ("cook_and_eat", "SOURCE_WRITTEN_TE_LINK", "cook", "eat", te),
        ("written_eat_calm", "SOURCE_WRITTEN_TARA_LINK", "warm_food_eat", "slight_calm", tara),
    ]
    relations = [dict(relation_id=rid, type=kind, from_claim_id=left, to_claim_id=right,
        polarity="AFFIRMED", scope_refs=[rid], qualifiers=[], evidence_indexes=[index])
        for rid, kind, left, right, index in relation_specs]
    packet = dict(candidate=dict(schema_version="cocolon.cmee.semantic_and_surface_proposal.v1", core="emlis",
        claims=claims, relations=relations, unknowns=[], conflicts=[], updates=[],
        surface_proposal=dict(observation=surface["observation"], reception=surface["reception"], update_note=None,
            bindings=[dict(section="observation", claim_refs=["return", "cook", "eat"],
                relation_refs=["return_before_cook", "return_before_eat", "cook_and_eat"]),
                dict(section="reception", claim_refs=["warm_food_eat", "slight_calm"], relation_refs=["written_eat_calm"])]),
        question_proposal=None), evidence=evidence)
    assert all(raw[e["field_path"]][e["start"]:e["end"]] == e["quote"] for e in evidence)
    messages = build_model_messages(req)
    spec = json.loads(messages[1]["content"])["output_spec"]
    assert "Other grammars unsupported" in spec["meaning"]
    receipt = receive_candidate(material, request_id=material.request_id,
        raw_output=json.dumps(packet, ensure_ascii=False), finish_reason="stop", provider="synthetic-scope-diagnostic")
    try:
        prepare_model_snapshot(req, SemanticInput("FRESH_CANDIDATE", receipt, semantic_profile=MODEL_PROFILE))
    except SemanticNotAdopted as exc:
        decision, code = exc.decision, exc.reason_code
    else:
        raise AssertionError("unexpected_adoption_of_unsupported_family")
    assert (decision, code) == ("UNSUPPORTED", "model_repair_reuse_source_out_of_scope")
    after = {name: sha((api / name).read_bytes()) for name in paths}
    assert after == before and (root / teacher_path).read_bytes() == teacher_bytes
    mapping = dict(status="PROPOSED_NOT_ADOPTED_NOT_TRAINED", teacher_id=teacher["id"], origin=teacher["origin"],
        source_refs=teacher["source_refs"], original=raw, packet=packet,
        new_private_relation_values_pending_approval=["SOURCE_WRITTEN_TEMPORAL_KARA_LINK", "SOURCE_WRITTEN_TARA_LINK"],
        selections_preserved={k:raw[k] for k in ("category", "emotions", "emotion_details", "is_secret")},
        forbidden_inferences=["warm_food_is_udon_identity", "hunger", "purpose_of_calming", "general_physiological_cause", "personality"],
        human_quality_acceptance=False)
    report = dict(status="CURRENT_PROFILE_SCOPE_BLOCKER_CONFIRMED", api_commit=api_head,
        python=platform.python_version(), production_source_sha256=before, source_unchanged=True,
        teacher_path=teacher_path, teacher_sha256=sha(teacher_bytes), teacher_unchanged=True,
        dialogue_scalar_quote_verified=True, exact_evidence_rows_verified=len(evidence),
        current_model_profile=MODEL_PROFILE, current_message_meaning_spec=spec["meaning"],
        admission_decision=decision, reason_code=code, semantic_adopted=False, body_generated=False,
        diagnostic_candidate_is_synthetic=True, full_future_candidate_validity_not_claimed=True,
        model_calls=0, training_updates=0, gpu_operations=0, network_calls=0, sql_calls=0,
        production_mutations=0, reader_relaxations=0, product_credit=0, automatic_progression=False)
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, value in [("source_mapping_candidate.json", mapping), ("current_profile_diagnostic.json", report)]:
        target = args.output_dir / name
        if target.exists():
            raise FileExistsError(target.name)
        target.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status":report["status"], "decision":decision, "reason_code":code,
        "verified_evidence_rows":len(evidence), "model_calls":0, "training_updates":0}, ensure_ascii=False))


if __name__ == "__main__":
    main()
