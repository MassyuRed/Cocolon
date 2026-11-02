"""Prepare one mixed-action/two-unknown curriculum comparison; CPU/tokenizer only."""
from argparse import ArgumentParser
from contextlib import ExitStack
from copy import deepcopy
from dataclasses import replace
from hashlib import sha256
import json
from pathlib import Path
from uuid import UUID
from unittest.mock import patch

import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse, canonical,
)
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, default=Path("/workspace"))
    args = parser.parse_args()
    w = args.workspace
    out = w / "analysis-other62-prepared-v2-20261102"
    out.mkdir(exist_ok=False)
    old_path = w / "analysis-mixed60-20261102/semantic_units_mixed60_plan.json"
    cpu_path = w / "analysis-other-actor-cpu-20261102/semantic_units_other_actor_cpu.json"
    old = json.loads(old_path.read_text())
    cpu = json.loads(cpu_path.read_text())
    assert len(old["teachers"]) == 60 and len(old["evaluation"]) == 20
    assert len(cpu["rows"]) == 2 and cpu["model_loads"] == cpu["new_generations"] == 0
    pack = deepcopy(old)
    pack["status"] = "ROOT_SYNTHETIC_OTHER62_FROM_SAVED_MIXED60_NOT_BLIND_OR_PRODUCT_ACCEPTANCE"
    pack["cocolon_source_commit"] = "fd809ea2ddf066ace0e9e0fc1f9489ba352bf6fa"
    pack["source_mixed60_plan_sha256"] = sha256(old_path.read_bytes()).hexdigest()
    pack["source_other_actor_cpu_sha256"] = sha256(cpu_path.read_bytes()).hexdigest()
    for row in cpu["rows"]:
        pack["teachers"].append(dict(
            id=row["id"], owner=row["owner"], snapshot=row["snapshot"],
            request_ref=row["request_ref"], messages=row["messages"],
            assistant_target=row["assistant_target"],
            source_bound_candidate_id=row["source_bound_candidate_id"], coverage=row["coverage"],
            original_target_sha256=row["target_sha256"],
            provenance="ROOT_SYNTHETIC_ONE_OTHER_NEGATIVE_TOPIC_TWO_ORDERS_AFTER_MD02_NOT_MASH_TEACHING"))
    assert pack["teachers"][:60] == old["teachers"]
    pack["evaluation"] = [dict(row, pre_generation_required=False, development_seen=True, evaluation_scope="PREVIOUSLY_SEEN_MIXED60_OUTPUT_REUSED_EXACTLY")
                          for row in old["evaluation"]]
    for row in cpu["rows"]:
        pack["evaluation"].append(dict(
            probe_id=row["id"], owner=row["owner"], snapshot=row["snapshot"],
            request_ref=row["request_ref"], messages=row["messages"],
            training_use=True, pre_generation_required=True, development_seen=True,
            evaluation_scope="TRAINED_OTHER_NEGATIVE_REHEARSAL_ONE_TOPIC_TWO_ORDERS"))
    diagnostics = [
        "友人は予備の傘を返した。受付が開いているかは分からない。担当者が戻ったかも分からない。",
        "箱が届いたかも分からない。弟は申し込まなかった。窓口が開くかは分からない。",
    ]
    for index, memo in enumerate(diagnostics, 1):
        snapshot = deepcopy(cpu["rows"][0]["snapshot"])
        snapshot["members"][0]["original"].update(id=str(UUID(int=21000 + index)), memo=memo)
        prepared = service.prepare_cumulative_quoted_parent_units(cpu["rows"][0]["owner"], snapshot)
        assert memo not in {json.loads(q["messages"][1]["content"])["fields"][0]["text"]
                            for q in pack["teachers"] + pack["evaluation"]}
        pack["evaluation"].append(dict(
            probe_id=f"OD{index:02}", owner=cpu["rows"][0]["owner"], snapshot=snapshot,
            request_ref=prepared.request_ref, messages=prepared.messages(),
            training_use=False, pre_generation_required=True, development_seen=False,
            evaluation_scope="ROOT_SYNTHETIC_NEARBY_OTHER_ACTOR_DIAGNOSTIC_NOT_BLIND_GENERAL_ACCEPTANCE"))
    pack["preexisting_evaluation"] = [dict(probe_id=row["probe_id"], source="Mixed60 saved after with identicalf982 adapter/request/messages")
                                        for row in old["evaluation"]]
    old_order = list(dict.fromkeys(old["plan"]["update_order"]))
    assert len(old_order) == len(set(old_order)) == 60
    order = []
    for index, key in enumerate(old_order, 1):
        order.append(key)
        if index <= 48 and index % 6 == 0:
            order.append("OA01" if (index // 6) % 2 else "OA02")
    assert len(order) == 68 and order.count("OA01") == order.count("OA02") == 4
    assert all(order.count(row["id"]) == 1 for row in old["teachers"])
    assert order[-12:] == old_order[-12:]
    pack["plan"].update(
        max_updates=68, learning_rate=1e-5, max_seconds=900, max_new_generations=28,
        update_order=order, max_model_loads=3, max_teacher_measurements=124,
        max_training_forwards=68, outer_timeout_term_seconds=890,
        initial="EXPLICIT_SAVED_MIXED60_F982_NEW_FINITE_OTHER_ACTOR_CURRICULUM_NOT_INTERRUPTED_RESUME",
        initial_weights_sha256="f9824503b8af3f0b67f6f75cc129f713c861a07d1a9f62f556e4b03461bb522b",
        initial_config_sha256="cc21925a85bf067989ca41adadb3fdd1d2051a2150e58ae4c8a9c74ac4575db3",
        initial_private_library_file_id="libfile_094d5e38d88c8191808fa78c14dfe158",
        process_cost_upper_usd=.145,
        evaluation_scope="Known20 before reused exactly;newOA2/nearbyOD2 before4 and all24 after=28 calls. Full source/raw reading;no blind/general-quality claim.",
        representation_comparison="Same private receiver,base,loader,pins,objective,LR,clip,seed. Explicitf982 initial plus62target/68order curriculum;not a single-cause proof.",
        rehearsal_stop_condition="RetainAT4/UQ2/MX2 and readOA2/MD02/OD2 actor,negation,unknown-parent meaning plusCQ04/SQ03/HQ04 controls. Any material meaning failure means normal non-adoption. No output repair,receiver relaxation,retry or extra epoch.")
    pack["teaching_rationale"] = dict(
        gap="Old60 has0 explicitOTHER negative independent ACTION teachers,6positiveOTHER ACTION;the mixedOTHER-negative case is0. Observed gap,not proven sole cause.",
        preservation="Old60 source/messages/targets remain dictionary-identical. Each replays once;newOA2 repeat4 each and final12 steps use old lessons.",
        initial="Choosef982 explicitly to retainAT4/UQ2/MX2 andNV04/HQ03/MD01/SQ01/PQ02 local improvements;normal non-adoption remains.",
        limits=["OA2 is one topic in two orders afterMD02 was seen.","OD2 are nearby root-authored diagnostics,not blind general acceptance.","New data are not copies ofMD02 or model raw.","CQ04 unknown-versus-reason,SQ03 modifier andHQ04 reason remain separate."])
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained(pack["plan"]["model"], revision=pack["plan"]["revision"],
                                             local_files_only=True, trust_remote_code=False)
    checks = []
    for row in pack["teachers"]:
        prepared = service.prepare_cumulative_quoted_parent_units(row["owner"], row["snapshot"])
        assert prepared.request_ref == row["request_ref"] and prepared.messages() == row["messages"]
        raw = row["assistant_target"]
        response = AnalysisModelQuotedParentUnitsResponse(prepared.request_ref,
            sha256(canonical(prepared.messages()).encode()).hexdigest(), sha256(raw.encode()).hexdigest(), "stop", raw)
        inp = replace(prepared, response=response)
        artifact, coverage = service.build_cumulative_quoted_parent_candidates(row["owner"], row["snapshot"], model_input=inp)
        assert artifact.candidate_id == row["source_bound_candidate_id"] and coverage["mapped_count"] == 0
        saved = service.serialize_cumulative_quoted_parent_candidates(row["owner"], row["snapshot"], model_input=inp, artifact=artifact, coverage=coverage)
        path = out / ("teacher_" + row["id"] + ".candidate.json")
        path.write_text(saved)
        with ExitStack() as stack:
            for target, name in ((MeaningExperienceEngine, "generate"), (compiler, "compile_analysis_unit_candidates"), (author, "realize_analysis_unit_candidates")):
                stack.enter_context(patch.object(target, name, side_effect=AssertionError("saved reader must not regenerate")))
            again, counts = service.reload_cumulative_quoted_parent_candidates(row["owner"], row["snapshot"], path.read_text())
        assert again == artifact and counts == coverage
        prompt = tokenizer.apply_chat_template(prepared.messages(), enable_thinking=False, add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        full = tokenizer.apply_chat_template(prepared.messages() + [dict(role="assistant", content=raw)], enable_thinking=False, add_generation_prompt=False, tokenize=True, return_dict=False, truncation=False)
        assert full[:len(prompt)] == prompt and len(full) <= 8192 and len(prompt) + 2048 <= 8192
        assert tokenizer.decode(full[len(prompt):], skip_special_tokens=False, clean_up_tokenization_spaces=False) == raw + "<|im_end|>\n"
        checks.append(dict(id=row["id"], prompt_tokens=len(prompt), target_tokens=len(full)-len(prompt), full_tokens=len(full), candidate_id=artifact.candidate_id, saved_reload="MATCHED", target_sha256=sha256(raw.encode()).hexdigest()))
    for row in pack["evaluation"]:
        prepared = service.prepare_cumulative_quoted_parent_units(row["owner"], row["snapshot"])
        assert prepared.request_ref == row["request_ref"] and prepared.messages() == row["messages"]
        prompt = tokenizer.apply_chat_template(prepared.messages(), enable_thinking=False, add_generation_prompt=True, tokenize=True, return_dict=False, truncation=False)
        assert len(prompt) + 2048 <= 8192
    cpu_result = dict(status="CPU_STRICT_62_TEACHERS_FILE_RELOAD_AND_ACTUAL_TOKENIZER_MATCHED", source_api_commit=pack["api_commit"], teachers=62, evaluation=24, new_before=4, old60_unchanged=True, rows=checks, model_loads=0, new_generations=0, training_updates=0, saved_reload_generation_compiler_author_forbidden=True, blind_or_general_quality_credit=0)
    for name, value in (("semantic_units_other62_plan.json", pack), ("semantic_units_other62_cpu.json", cpu_result)):
        (out / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    export = {p.name: dict(bytes=p.stat().st_size, sha256=sha256(p.read_bytes()).hexdigest(), text=p.read_text())
              for p in out.glob("semantic_units_*.json")}
    (w / "other62-prepared-export.json").write_text(json.dumps(export, ensure_ascii=False))
    (w / "other62-prepared-download.html").write_text('<meta charset=utf-8><h1>Other62 CPU preparation</h1><a href=other62-prepared-export.json>Prepared plan and CPU result</a>')
    print("CPU62 matched; model loads/generation/updates0; max full tokens", max(r["full_tokens"] for r in checks))


if __name__ == "__main__":
    main()
