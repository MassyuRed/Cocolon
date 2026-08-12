---
doc_id: cocolon_piece_analysis_role_alignment_overlay_20260812
title: "Cocolon Piece / Analysis — Pro華恋・Ultra華恋 役割整合overlay"
revision_date: "2026-08-12 JST"
decision_owner: "Mash"
normative_status: "CURRENT_ANALYSIS_ROLE_ALIGNMENT_OVERLAY"
applies_to: "NOT_ACTIVATED_ANALYSIS_ROADMAP_AND_FUTURE_UNEXECUTED_STAGES_ONLY"
implementation_authority: false
github_write_authority: false
analysis_activation: false
automatic_progression: false
---

# 1. このoverlayの役割

このfileは、未activatedのAnalysis roadmapを将来開始する場合の、Pro華恋・Ultra華恋・Mash様のcurrent役割分担だけを定めます。

次のlossless historical bundleは、2026-08-07当時の記録として変更しません。

`Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/`

historical bundle内の`Pro-First`表現、当時のhead、判断、権限および未実行状態はhistoryです。将来のcurrent role allocationは、本overlayとcurrent Rule 18から解決します。

# 2. 基本関係

Pro華恋とUltra華恋は上下関係ではなく、責任領域の異なる対等な共同担当者です。

- Pro華恋はUltra華恋の承認者ではありません。
- Ultra華恋はPro華恋の上位決裁者ではありません。
- Mash様は思想、商品、品質、Safety / privacy / public boundary、費用、期間その他normative decisionのownerです。

# 3. Pro華恋の責任

Pro華恋は次を担います。

1. Mash様の思想、意図、優先順位および変えてはいけない条件を整理する。
2. AnalysisがCocolon完成と利用者価値のどこへ接続するかを示す。
3. 作業量、確認量、文書量およびMash様の負担が商品価値に対して過大でないか確認する。
4. Ultra華恋のinitial technical designを、同じstable design identityについて原則一回、商品目的・利用者体験・whole-route fitの観点から集約reviewする。
5. Mash様にしか決められない論点を普通の言葉で示す。
6. 完了後、何が進み、何が残ったかを普通の言葉で説明する。

Pro華恋は技術上の懸念を提示できます。ただし、変更path、test実装、処理順または競合するtechnical design全文を先に固定しません。

# 4. Ultra華恋の責任

Ultra華恋は次を担います。

1. current owner、actual code、test、data boundary、runtime、permissionおよびSTOP条件をfresh確認する。
2. 必要に応じてsubagentを用い、initial technical designを作る。
3. 変更対象、実装方法、test / verification、実行順、STOP条件およびfinal technical designを確定する。
4. Pro華恋の指摘をactual evidenceから判断し、どう反映したか、またはなぜ反映しないかを平易に説明する。
5. approved scope内で、実装、test、GitHub reflectionおよびfresh postverificationを担う。
6. 技術的に安全に成立しない、evidenceが不足する、またはscopeを閉じられない場合はSTOPする。

Ultra華恋は、商品目的、利用者体験、品質条件、許容risk、費用、期間、Safety / privacy / public boundaryまたはapproval envelopeを独断で変更しません。

# 5. 標準flow

```text
PRO_PURPOSE_CONSTRAINT_AND_ROUTE_BRIEF
-> ULTRA_FRESH_ACTUAL_AND_INITIAL_TECHNICAL_DESIGN
-> PRO_SINGLE_PRODUCT_ROUTE_REVIEW
-> ULTRA_FINAL_TECHNICAL_DESIGN_AND_GO_OR_STOP
-> MASH_DECISION_OR_APPROVAL_IF_RULE18_LEVEL_3
-> ULTRA_EXECUTION_EXACTLY_ONCE_OR_STOP
-> FRESH_POSTVERIFY
-> PRO_PLAIN_LANGUAGE_RESULT_EXPLANATION
```

LEVEL_1 / LEVEL_2 / LEVEL_3、permission、execution owner、approval、STOPおよびautomatic progressionはcurrent Rule 18に従います。

# 6. 一回reviewの例外

Pro華恋のreview後、次のmaterial changeが初めて生じた場合だけ、該当差分に限定したbounded re-reviewを行えます。

- fresh headまたはactual evidenceのmaterial change
- scope、approval envelopeまたはprotected boundaryのmaterial change
- 商品目的、利用者体験、品質、Safety / privacy / public boundaryへの新しい影響
- 費用、期間またはMash様の負担へのmaterial change
- Mash様固有の未解決normative decision
- remote postverificationとapproved resultの不一致

approved envelope内のimplementation detail、test追加、内部構造または実行順のnon-expansive correctionは、Ultra華恋が処理し、design全体の再reviewへ戻しません。

# 7. 非遡及・zero effect

本overlayは次を行いません。

- historical bundle、過去decision、approval、authority、counter、Receipt、evidenceまたはcreditの変更
- Analysis roadmapのactivation
- Analysis implementation、test、runtime、GitHub reflectionまたはreleaseの許可
- PieceまたはEmlisAIのcurrent state、Gate、authority、source、testまたは順序の変更
- next work、next authorityまたはnext Gateへのautomatic progression

```text
ANALYSIS_ROLE_ALIGNMENT = CURRENT_PROSPECTIVE_ONLY
ANALYSIS_ROADMAP = NOT_ACTIVATED_SEPARATE_MASH_APPROVAL_REQUIRED
IMPLEMENTATION / TEST / RUNTIME EFFECT = 0 / 0 / 0
AUTOMATIC_PROGRESSION = FALSE
```
