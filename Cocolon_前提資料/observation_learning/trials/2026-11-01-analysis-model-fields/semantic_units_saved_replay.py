"""CPU-only, separate-process replay of the saved LR1 run; never loads a model."""
from argparse import ArgumentParser
from contextlib import ExitStack
from dataclasses import replace
from hashlib import sha256
import json
from pathlib import Path
from unittest.mock import patch

import analysis_cumulative_service as service
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.cores.analysis.semantic_admission import (
    AnalysisModelQuotedParentUnitsResponse, AnalysisSemanticError, canonical,
)
from cocolon_meaning_experience_engine.cores.analysis.source_adapter import AnalysisSourceError
import cocolon_meaning_experience_engine.cores.analysis.intent_compiler as compiler
import cocolon_meaning_experience_engine.cores.analysis.observed_route_realizer as author


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--run-dir", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    root = args.run_dir
    pack = json.loads((root / "semantic_units_unknown58_lr1_plan.json").read_text())
    rows = []
    for phase in ("before", "comparison", "after"):
        folder = root / "result" if phase == "after" else root
        for row in pack["evaluation"]:
            prefix = folder / (phase + "_" + row["probe_id"])
            request = json.loads(prefix.with_suffix(".request.json").read_text())
            response_data = json.loads(prefix.with_suffix(".response.json").read_text())
            raw = prefix.with_suffix(".raw.txt").read_text()
            prepared = service.prepare_cumulative_quoted_parent_units(row["owner"], row["snapshot"])
            assert prepared.request_ref == row["request_ref"] == request["request_ref"]
            assert prepared.messages() == row["messages"] == request["messages"]
            assert request["messages_sha256"] == sha256(canonical(prepared.messages()).encode()).hexdigest()
            response = AnalysisModelQuotedParentUnitsResponse(**response_data)
            assert response.raw == raw
            assert response.raw_sha256 == sha256(raw.encode()).hexdigest()
            candidate_file = prefix.with_suffix(".candidate.json")
            if not candidate_file.exists():
                # Rejected outputs must still fail the unchanged receiver.
                try:
                    service.build_cumulative_quoted_parent_candidates(
                        row["owner"], row["snapshot"], model_input=replace(prepared, response=response))
                except (AnalysisSemanticError, AnalysisSourceError) as exc:
                    rows.append(dict(phase=phase, probe_id=row["probe_id"], admission="REJECTED", reason=str(exc)))
                else:
                    raise AssertionError("saved rejection unexpectedly admitted")
                continue
            artifact, coverage = service.build_cumulative_quoted_parent_candidates(
                row["owner"], row["snapshot"], model_input=replace(prepared, response=response))
            with ExitStack() as stack:
                for target, name in ((MeaningExperienceEngine, "generate"),
                                     (compiler, "compile_analysis_unit_candidates"),
                                     (author, "realize_analysis_unit_candidates")):
                    stack.enter_context(patch.object(target, name, side_effect=AssertionError("forbidden during saved reload")))
                saved, counts = service.reload_cumulative_quoted_parent_candidates(
                    row["owner"], row["snapshot"], candidate_file.read_text())
            assert saved == artifact and counts == coverage
            assert coverage["mapped_count"] == 0 and coverage["unparsed_count"] == 1
            rows.append(dict(phase=phase, probe_id=row["probe_id"], admission="RETURNED",
                             candidate_id=saved.candidate_id, coverage=counts,
                             serialized_sha256=sha256(candidate_file.read_bytes()).hexdigest()))
    assert len(rows) == 48
    result = dict(status="SAVED_FILES_REPLAYED_IN_SEPARATE_CPU_PROCESS", rows=rows,
                  matched_candidates=sum(r["admission"] == "RETURNED" for r in rows),
                  rejected_responses=sum(r["admission"] == "REJECTED" for r in rows),
                  model_loads=0, new_generations=0, training_updates=0,
                  saved_reload_generation_compiler_author_patched_to_fail=True,
                  quality_credit=0)
    with args.out.open("x") as handle:
        handle.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(result["status"], result["matched_candidates"], result["rejected_responses"])


if __name__ == "__main__":
    main()
