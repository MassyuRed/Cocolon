# Source identity / quote field guidance — finite CPU check

2026-10-30 JST. Source: Cocolon ae03e5bdd192479da1c57c29648b14dacb30df37; API PR3 7acff07421c0cfa458ec6cf75616187379311854.

## Purpose and boundary

Continue Mash's current 4B + CMEE request by checking the actual Stage1 failure: source identity versus clause-role confusion, original versus supplemental field confusion, and alias/quote nesting. The frozen teacher already maps correctly; earlier SHOP Stage1 had correct source/field bindings, so the latest failure does not prove a weight capability limit. Source guidance is a candidate, not an improvement claim.

Only Stage1 gains an input-derived source/field roster and explicit namespace/array guidance. No teacher aliases, selected quotes, claims, relations, updates or prose are supplied by the guide. Original material/prior/request/all semantics and the five-stage receiver/decoder/acceptance/token caps remain unchanged. For identical previous candidates, Stages2–5 remain byte-identical to the instruction baseline. The current failed 9b1901ab weight is an offline comparison target only, never promoted.

## Files and implementation order

1. `prompt_source_index.py`: minimal copy of the current stage-only prompt module; Stage1 metadata guidance and the same actual-message-chain projection.
2. `check_source_index.py`: finite Jupyter CPU invocation; read frozen originals, verify metadata against source, check all 10 teacher target/EOS token sequences and two exact packet reassemblies, unchanged old9 encodings, prompt substitution rejection, and pre/post frozen hashes. No model load/forward/training/generation/CMEE.
3. Record the actual CPU result, inspect all changed fields, then decide whether a separate finite model experiment is justified. CPU success does not authorize that paid experiment.

Root Karen is the only writer/executor/final judge. Subagent is read-only review. Observed environment: Codex Work; no formal Pro/Ultra/human authority is claimed. New CPU output must be fresh; CPU timeout 300 seconds, failure stops without a model run. Existing dependencies/tokenizer only, offline mode and hidden CUDA; no installation or Runpod management API/console use. GPU stays running per Mash's instruction.

## Success and STOP

CPU success means exact source derivation, unchanged original data/semantic values/teachers, valid token budgets, exact reassembly and unchanged old9. It is not free generation, new CMEE adoption, a product-quality score or acceptance. Any mismatch stops; no frozen teacher/receiver repair. Existing probe remains CLOSED_NOT_ADOPTED_NO_RETRY. A new bounded paid run needs Mash approval; no consumed plan reuse.

STRUCTURE_MAP_DELTA_NONE: no product/source admission/API/DB/RN/Render/Supabase responsibilities change. Product credit 0; formal acceptance 0/3; 54.50%; candidate_ready=false; automatic_progression=false.

## 実CPU結果と判断 — 2026-10-30 JST

同PodのJupyterへ直接接続し、source5dbb5ce9の2本をSHA確認してCPUを一回実行した。exit0、CPU4.787097356秒、親外5.317406782秒は別計測。モデルload/forward/学習/自由生成/新CMEEは全0、CUDA未初期化、凍結200fileは前後不変。A5000は処理後1MiB/0％で稼働保持、Stop/restart/delete/Runpod管理画面/API0。CPU処理のGPU推論按分は0だが、準備・回収・保持等は別である。

元教師はBOOK alias3/quote17、SHOP alias3/quote18で、全引用が対応sourceの正しいfieldに一意に存在する。教材のsource対応不備は見つからなかった。最新rawでは意味role名やfield名をidentityに使い、aliasとquoteを同じ配列へ混在、補足fieldの誤配があった。ただし前のSHOP S1は正しい3identity/answer_text_privateを生成し構造通過しており、重みの能力限界・全原因・教材不足とは断定しない。

追加はS1だけ。BOOK入力4316→4668token（+352）、SHOP4468→4825（+357）。同じ前段候補でS2〜5のmessagesはbytes不変、全10target/EOS/token/label不変、2完成packetを元bytesへ再結合、旧9encoding不変、旧prompt代入2拒否、不正metadata6拒否を確認。最大prompt+cap7117/8192。CPU正解再結合を実生成・新CMEE採用・商品改善へ数えない。追加観測会はこの2題の正解不足を補う目的には不要。

`result/report.json`は実CPU結果、`source_guides.json`は原入力だけから得た一覧、`candidate_train10.jsonl`はCPUで確認した全messagesと不変target、`frozen_sha256.json`は200不変入力、`execution.json/cpu.log/cpu.exit`は一回起動・時間・exit、`recovery_manifest.json`はPodで計算した原9fileのbytes/SHA、`verification.json`は回収後の全9file一致とrootの全10messages/target独立照合を所有する。Jupyter実画面を今回の報告へ添付する。原重みは今回不変、別保存済み完全stage5原本を保持する。

## 次の具体案（未承認・未実行）

`proposal.json`と`run_source_index_once.py`を準備した。追加学習0・保存9b1901abの非学習1load、新2件を各最大5call、実前段rawだけで連鎖し、全5段が成立した場合だけ既存CMEEと保存再読へ進む。両件の意味・本人本文・coldが全成功した場合だけ旧9を各1回確認する。最大19call、各180秒、全1800秒、親1790秒TERM+kill10秒。前回確認単価$0.28/hによる処理按分$0.14上限（準備・回収・保持・保存・通信・税等別）。現在単価の再照会0。

runnerは既存非学習一回の最小差分で、今回CPU report/messages/source SHAと200不変fileを実行前後に照合する。`plan.json`のMASH_EXPLICITLY_APPROVED_ONCEがなければ実行不可。現`proposal.json`はPROPOSED_NOT_APPROVEDで、GPU実行pack/lock/モデルload/生成は未作成・未実行。承認後に今回planだけを同名plan.jsonへ固定して新fresh pack/runへ一回実行する。旧閉鎖承認を再利用しない。途中不成立は同題停止、再生成・修復・cap延長・次prompt探索・次GPU・学習追加へ進まない。全raw/実messages/token/usage/派生packet/CMEE/coldを回収し、成立本文があれば華恋が全件読む。

今回のCPU・可逆入力補正・結果保存はMashの現行継続指示に対応する限定作業。新しい一回の有料実行はRule18§11.3の個別承認対象。実環境Codex Workで正式Pro/Ultra/humanの権威を申告しない。単一writer/executor/judgeはroot華恋、補助read-only。primary=BLOCKER_NARROWED（教師のsource対応不備を除外した限定観測）、technical/product credit0、商品状態・前回0/2・旧9NOT_RUNは不変。STRUCTURE_MAP_DELTA_NONE。
