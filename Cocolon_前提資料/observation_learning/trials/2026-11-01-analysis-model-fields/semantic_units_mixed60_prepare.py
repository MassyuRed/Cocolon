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
    out = w / "analysis-mixed60-prepared-20261102"
    out.mkdir(exist_ok=False)
    old_path = w / "analysis-unknown58-lr1-20261102/semantic_units_unknown58_lr1_plan.json"
    cpu_path = w / "analysis-mixed-unknown-cpu-20261102/semantic_units_mixed_unknown_cpu.json"
    old = json.loads(old_path.read_text())
    cpu = json.loads(cpu_path.read_text())
    assert len(old["teachers"]) == 58 and len(old["evaluation"]) == 16
    assert len(cpu["rows"]) == 2 and cpu["model_loads"] == cpu["new_generations"] == 0
    pack = deepcopy(old)
    pack["status"] = "ROOT_SYNTHETIC_MIXED60_FROM_SAVED_LR1_NOT_BLIND_OR_PRODUCT_ACCEPTANCE"
    pack["cocolon_source_commit"] = "0decb5e9b6491521852e3c33ce29bab725c333bf"
    pack["source_lr1_plan_sha256"] = sha256(old_path.read_bytes()).hexdigest()
    pack["source_mixed_cpu_sha256"] = sha256(cpu_path.read_bytes()).hexdigest()
    for row in cpu["rows"]:
        pack["teachers"].append(dict(
            id=row["id"], owner=row["owner"], snapshot=row["snapshot"],
            request_ref=row["request_ref"], messages=row["messages"],
            assistant_target=row["assistant_target"],
            source_bound_candidate_id=row["source_bound_candidate_id"], coverage=row["coverage"],
            original_target_sha256=row["target_sha256"],
            provenance="ROOT_SYNTHETIC_ONE_MIXED_TOPIC_TWO_ORDERS_AFTER_HQ03_NOT_MASH_TEACHING"))
    assert pack["teachers"][:58] == old["teachers"]
    pack["evaluation"] = [dict(row, evaluation_scope="PREVIOUSLY_SEEN_LR1_OUTPUT_REUSED_EXACTLY")
                          for row in old["evaluation"]]
    for row in cpu["rows"]:
        pack["evaluation"].append(dict(
            probe_id=row["id"], owner=row["owner"], snapshot=row["snapshot"],
            request_ref=row["request_ref"], messages=row["messages"],
            training_use=True, pre_generation_required=True, development_seen=True,
            evaluation_scope="TRAINED_MIXED_REHEARSAL_ONE_TOPIC_TWO_ORDERS"))
    diagnostics = [
        "私は予備の鍵を渡した。担当者が来るかは分からない。荷物が届いたかも分からない。",
        "予約が取れたかも分からない。姉は参加しなかった。会議が開かれるかは分からない。",
    ]
    for index, memo in enumerate(diagnostics, 1):
        snapshot = deepcopy(cpu["rows"][0]["snapshot"])
        snapshot["members"][0]["original"].update(id=str(UUID(int=17000 + index)), memo=memo)
        prepared = service.prepare_cumulative_quoted_parent_units(cpu["rows"][0]["owner"], snapshot)
        assert memo not in {json.loads(q["messages"][1]["content"])["fields"][0]["text"]
                            for q in pack["teachers"] + pack["evaluation"]}
        pack["evaluation"].append(dict(
            probe_id=f"MD{index:02}", owner=cpu["rows"][0]["owner"], snapshot=snapshot,
            request_ref=prepared.request_ref, messages=prepared.messages(),
            training_use=False, pre_generation_required=True, development_seen=False,
            evaluation_scope="ROOT_SYNTHETIC_NEARBY_MIXED_DIAGNOSTIC_NOT_BLIND_GENERAL_ACCEPTANCE"))
    pack["preexisting_evaluation"] = [dict(probe_id=row["probe_id"], source="LR1 saved after with identical750a adapter/request/messages")
                                        for row in old["evaluation"]]
    old_order = [key for key in old["plan"]["update_order"] if not key.startswith("UQ")]
    assert len(old_order) == len(set(old_order)) == 56
    order = []
    for index, key in enumerate(old_order, 1):
        order.append(key)
        if index == 14:
            order.append("UQ01")
        if index == 42:
            order.append("UQ02")
        if index <= 48 and index % 6 == 0:
            order.append("MX01" if (index // 6) % 2 else "MX02")
    assert len(order) == 66 and order.count("MX01") == order.count("MX02") == 4
    assert all(order.count(row["id"]) == 1 for row in old["teachers"])
    assert order[-8:] == old_order[-8:]
    pack["plan"].update(
        max_updates=66, learning_rate=1e-5, max_seconds=900, max_new_generations=24,
        update_order=order, max_model_loads=3, max_teacher_measurements=120,
        max_training_forwards=66, outer_timeout_term_seconds=890,
        initial="EXPLICIT_SAVED_LR1_750A_NEW_FINITE_MIXED_CURRICULUM_NOT_INTERRUPTED_RESUME",
        initial_weights_sha256="750a78096fc5c7aa2f145169ac5e60ae7ae38981a6291d5c7e87c09d9c7a9f54",
        initial_config_sha256="13ca901a10845054b8226d386c9e08d84671b53493b91c8a1823842ab72c5f22",
        initial_private_library_file_id="libfile_41f866f3fc6081918d9ab8caa8f91684",
        process_cost_upper_usd=.145,
        evaluation_scope="Known16 before reused exactly; newMX2/nearbyMD2 before4 and all20 after=24 calls. Full source/raw reading; no blind/general-quality claim.",
        representation_comparison="Same private quoted-parent receiver,base,loader,pins,objective,LR,clip,seed. Explicit750a initial plus60target/66order curriculum; not LR-only or single-cause proof.",
        rehearsal_stop_condition="RetainAT4/UQ2 and readMX2/HQ03/MD2 actor,negation,unknown-parent meaning plus all temporal/reason controls. Any material meaning failure means normal non-adoption. No output repair, receiver relaxation, retry or extra epoch.")
    pack["teaching_rationale"] = dict(
        gap="Old58 contains0 fields with independent ACTION_OR_NONACTION and2WRITTEN_UNKNOWN roots; observed curriculum gap, not proven sole cause.",
        preservation="Old58 source/messages/targets remain dictionary-identical. Each replays once; newMX2 repeat4 each and final8 steps use old lessons.",
        initial="Choose750a explicitly for this finite comparison: retainsAT4=4/4,UQ2=2/2,AF01 reason,CQ03 key while mixed/time/reason residuals remain. No product adoption.",
        limits=["MX2 is one topic in two orders afterHQ03 was seen.", "MD2 are nearby root-authored diagnostics, not blind general acceptance.", "New mixed data are not copies ofHQ03 or model raw.", "Reason/time/qualifier and parent failures remain separate controls."])
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
    cpu_result = dict(status="CPU_STRICT_60_TEACHERS_FILE_RELOAD_AND_ACTUAL_TOKENIZER_MATCHED", source_api_commit=pack["api_commit"], teachers=60, evaluation=20, new_before=4, old58_unchanged=True, rows=checks, model_loads=0, new_generations=0, training_updates=0, saved_reload_generation_compiler_author_forbidden=True, blind_or_general_quality_credit=0)
    for name, value in (("semantic_units_mixed60_plan.json", pack), ("semantic_units_mixed60_cpu.json", cpu_result)):
        (out / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    export = {p.name: dict(bytes=p.stat().st_size, sha256=sha256(p.read_bytes()).hexdigest(), text=p.read_text())
              for p in out.glob("semantic_units_*.json")}
    (w / "mixed60-prepared-export.json").write_text(json.dumps(export, ensure_ascii=False))
    (w / "mixed60-prepared-download.html").write_text('<meta charset=utf-8><h1>Mixed60 CPU preparation</h1><a href=mixed60-prepared-export.json>Prepared plan and CPU result</a>')
    print("CPU60 matched; model loads/generation/updates0; max full tokens", max(r["full_tokens"] for r in checks))


if __name__ == "__main__":
    main()
