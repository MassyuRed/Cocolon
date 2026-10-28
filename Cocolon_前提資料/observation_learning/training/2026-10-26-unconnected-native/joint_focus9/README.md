# Joint focus9 — fresh bounded continuation, 2026-10-28 JST

Current status: CPU verified; GPU not yet executed. This is a new unit under Mash’s latest 「4B学習＋CMEE接続」を続けて request, rule18 §11.3. The closed updates_first9 run is preserved and is not retried.

## Concrete blocker and single change

The preceding run completed BOOK JSON but duplicated evidence coordinates and retained semantic/body errors. SHOP repeated observation text and missed EOS. Existing completed BOOK/SHOP teachers contain the needed source distinctions and prose. Additional observation is not currently required for this blocker.

Keep API `7b9ee073de03940ba71587297d8600b2b6094dd1`, all15 prompt/teacher bytes, current strict receiver/CMEE and original284f unchanged. Change only the training objective for the two new cases: 0.50 existing detached adaptive full-target CE + 0.25 normalized grounding/reference CE + 0.25 normalized prose/closing/EOS CE. Old3 retain original CE; one forward/backward per update. No alias renaming, output repair, acceptance relaxation, new dependency, or production connection.

## CPU evidence and actual scope

`actual_cpu_check.json` records 6.672460324014537 seconds, no model load/forward/update/generation, no CUDA initialization and SQL0. All15 prompts and targets are byte-identical to updates_first9. Prior353 CPU tests at the same API are verified and reused, not rerun; 12 actual-SQL tests remain excluded. New FP32 checks compare the weighted loss, reference/analytic gradients, positive normalized mass, invalid groups and nonfinite rejection. Uploaded five source files and every CPU archive CRC/size/hash were independently verified outside Pod.

| Case | Prompt | Target | Ground/ref group | Prose/closing/EOS group | Prose observation/reception/update_note | Supplementary group overlap |
|---|---:|---:|---:|---:|---|---:|
| BOOK | 4387 | 2913 | 2149 | 78 | 20 / 34 / 21 | 0 |
| SHOP | 4539 | 3238 | 2398 | 119 | 42 / 39 / 35 | 0 |

Group counts use actual tokenizer offsets and exact helper input IDs. Prompt-selected tokens0, EOS exactly1 per target, every target retains positive full-target weight. The full-target objective intentionally overlaps both supplementary groups. The 25% coefficients describe loss allocation, not an improvement or success rate.

## Once-only bound

Original adapter `284f1df77c828982bdb7c2480f3f269b71dc9d69a29ea36b48dc6d25ab807d23`, base Qwen/Qwen3.5-4B revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`, 112 F32 tensors. Fixed9 updates (old3 once and BOOK/SHOP three times each), AdamW LR5e-5/wd0, seed20261024, clip1. Save and exact inference-only reload before at most2 greedy generations. BOOK cap3712, SHOP3584, context8192, generation180s each. Process cap600s, wrapper590s+TERM/10s, hourly $0.28, processing allocation at most$0.047. Preparation, CPU, recovery, holding, storage, network and taxes are extra.

Stop on first limit/failure with no retry or automatic next run. Preserve all raw outputs and new weights even if rejected; use actual receiver/CMEE and same-snapshot cold read only if accepted. Root is sole executor/writer. Helper read-only reviews are not formal Pro/Ultra/human acceptance. Codex Work/GPT-6 actual environment; formal3-core acceptance remains0/3, management54.50%, product credit0, candidate_ready=false, automatic_progression=false. GPU remains held; lifecycle operations0, production/DB/Render/merge/deploy0.

`jointfocus9.plan.json` is the pre-execution prepared record. The runtime authorized plan and raw run will be preserved without rewriting; final result_summary owns closure.
