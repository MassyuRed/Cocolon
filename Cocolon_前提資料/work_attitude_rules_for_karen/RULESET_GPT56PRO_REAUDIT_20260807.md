---
doc_id: cocolon_ruleset_gpt56pro_full_reaudit_20260807
title: "Cocolon ruleset GPT-5.6 Pro full re-audit and correction"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
execution_model: "GPT-5.6 Pro"
audit_type: "FULL_RULESET_SOURCE_REAUDIT_AND_CORRECTION"
pre_audit_verified_commit: "78ff47b5809d08ecefff6b251a0009ff2b7d3cdf"
non_pro_simplification_head: "60d48140dc277c2c02999c46b0b52b732be4aba5"
non_pro_revert_commit: "2aa7a322c9c74cc40db8def19915ef0481531be6"
automatic_progression: false
production_effect: "exact0"
---

# Cocolon ruleset GPT-5.6 Pro full re-audit and correction

## 1. 結論

GPT-5.6 Pro以外で行われた2026-08-07のruleset簡略化は、current ruleとして採用しない。

理由は、単なる見やすさ改善を越え、次を行っていたためである。

1. GitHub reflection技術正本のwrite authorityを変更した。
2. continuous durable recording技術正本を短縮・変更した。
3. rule indexの大部分を削除した。
4. currentな開始checklistと出力gateをhistorical referenceへ降格した。
5. 個別ruleにだけ存在した発動条件・STOP条件・user-action条件を落とした。
6. Piece current定義の正しい補正を、上記不正変更と同一packageへ混在させた。

non-Pro simplificationは、まずcommit
`2aa7a322c9c74cc40db8def19915ef0481531be6`
で、pre-audit verified stateの8対象blobへbyte-identicalに復元した。

その後、GPT-5.6 Proで全rule sourceを原典から再監査し、技術正本を変更せず、一般ruleと実行Gateだけを再構成した。

## 2. source basis

### Karen-Diary

1. `Karen-Diary/00_READ_FIRST.md`
2. `Karen-Diary/memory/karen_operating_principles.md`
3. `Karen-Diary/memory/mash_and_karen.md`

Karen-DiaryはCocolon仕様正本ではないが、最終目的、Mashの時間、華恋の判断責任、共同開発、全肯定や謝罪への退避禁止を判断基準として確認した。

### work attitude rules

1. `00_read_first.txt`
2. `01_cocolon_business_life_funding_source.txt`
3. `02_forbidden_assumed_understanding_unverified_assertion.txt`
4. `03_forbidden_insufficient_premise_and_actual_file_check.txt`
5. `04_forbidden_mixing_design_and_implementation.txt`
6. `05_forbidden_unrequested_completion_and_structure_addition.txt`
7. `06_forbidden_mentalization_and_template_apology.txt`
8. `07_forbidden_shifting_burden_to_user.txt`
9. `08_artifact_delivery_rules.txt`
10. `09_work_start_checklist.txt`
11. `10_stop_judgment_and_unwritten_rules.txt`
12. `11_cocolon_area_specific_do_not_break.txt`
13. `12_check_items_not_short_oath.txt`
14. `13_forbidden_reasking_existing_design_and_design_term_escape.txt`
15. `14_cocolon_joint_development_and_karen_thought_boundary.txt`
16. `15_trust_based_joint_development_boundary_2026_06_05.txt`
17. `16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt`
18. `17_continuous_durable_work_recording_and_emergency_handoff.txt`
19. `18_chat_work_environment_selection_rule_2026_08_06.txt`
20. `99_integrated_paste_each_time.txt`
21. `manifest.json`

### technical canonical owners

1. `Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md`
2. `Cocolon_前提資料/13_cocolon_work_test_runner_runtime_continuity.md`
3. `Cocolon_前提資料/14_cocolon_continuous_work_recording_and_emergency_handoff.md`

### external indexes / product owners

1. `Cocolon_前提資料/05_cocolon_rule_file_index.md`
2. `Cocolon_前提資料/05A_cocolon_chat_work_environment_rule_index_20260806.md`
3. `Cocolon_Piece/00_read_first.md`
4. `Cocolon_Piece/manifest.json`

reviewed source path count: exact31

## 3. non-Pro simplification range

```text
base:
  78ff47b5809d08ecefff6b251a0009ff2b7d3cdf

non-Pro head:
  60d48140dc277c2c02999c46b0b52b732be4aba5

commit count:
  exact8

changed paths:
  exact8
```

対象path:

```text
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
Cocolon_前提資料/14_cocolon_continuous_work_recording_and_emergency_handoff.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/manifest.json
```

## 4. confirmed defects

### D1. technical contract mutation

GitHub reflection正本は、writeをMashが承認した作業範囲へ限定し、華恋が独断でcontractを変更できないと定めていた。

non-Pro simplificationは、その同じ正本へ`standing checkpoint-write authority`を追加した。
これはrule整理ではなくwrite authorityの変更であり、明示された条項変更authorityを欠いていた。

corrective disposition:

```text
technical canonical 11:
  restored unchanged

standing authority:
  removed

current boundary:
  GitHub write is limited to Mash-approved scope
```

### D2. technical history / canonical detail deletion

GitHub reflection正本とrule indexは、current contractだけでなく、historical non-normative recordとtechnical locatorを所有していた。

non-Pro simplificationは、これらを大幅削除した。
見やすさ改善のためにtechnical historyとrule locatorを消すことは許容しない。

corrective disposition:

```text
technical canonical 11:
  original full bytes restored

rule index 05:
  original full bytes restored

technical canonical 14:
  original full bytes restored
```

### D3. unique rule loss

09と99には、単なる重複ではなく次が存在した。

- user_action_effect
- contract_mutation_effect
- position_change_effect
- actual environment / proportionality
- same-package continuation
- Work runtime exact Gate
- durable checkpoint contents
- completion / next-environment checks

これらをhistoricalへ降格し、6つの抽象Gateだけへ置換した結果、実行条件が失われた。

corrective disposition:

- 一般ruleは`CURRENT_RULES.md`へ意味を保持して統合する。
- 09は短い開始時実行Gateとしてcurrentを維持する。
- 99は短い出力前実行Gateとしてcurrentを維持する。
- 個別詳細ruleは条件付きcurrent referenceとして維持する。
- 元の長文bytesはGit historyとpre-audit blob identityで保持する。

### D4. model eligibility absent

従来ruleは標準ChatをGPT-5.6 Proとしていたが、modelがnon-Proまたは不明になった場合に作業を禁止し、成果物を再監査する明示Gateがなかった。

corrective disposition:

- 00、CURRENT_RULES、09、18、99、manifest、05Aへmodel eligibilityを接続する。
- non-Pro / unknownは`MODEL_OR_ENVIRONMENT_NOT_ELIGIBLE_STOP`。
- non-Pro成果物は`UNTRUSTED_NOT_ADOPTED_UNTIL_PRO_REAUDIT`。
- 最後のPro verified checkpointから全changed pathsを再監査する。

### D5. Piece old definition

area-specific rule 11はPieceを一問一答として固定していた。

current Piece ownerは、Q&Aを一形式とし、Pieceをユーザーの考えや価値観を他者へ伝える文章に整形し画像化する機能と定義している。

corrective disposition:

- area rule 11のPiece節をcurrent ownerへ整合する。
- existing Q&A actualをcompatibility formatとして保持し、確認なしに削除・一括migrationしない。

### D6. stale cross-reference

rule 07は、旧09 checklistの`§O`へ依存していた。
新しい開始Gateでは該当内容を`F. Mash様への質問・依頼`へ配置するため、referenceを更新する。

## 5. file disposition

| path / class | disposition |
|---|---|
| technical canonical 11 | RESTORED_AND_UNCHANGED |
| technical canonical 13 | REVIEWED_UNCHANGED |
| technical canonical 14 | RESTORED_AND_UNCHANGED |
| rule index 05 | RESTORED_AND_UNCHANGED |
| rules 01-06, 08, 10, 12-17 | REVIEWED_CURRENT_CONDITIONAL_REFERENCE |
| rule 07 | CURRENT_REFERENCE_WITH_CROSSREF_CORRECTION |
| rule 11 | CURRENT_REFERENCE_WITH_PIECE_DEFINITION_CORRECTION |
| rule 18 | CURRENT_WITH_MODEL_ELIGIBILITY_CORRECTION |
| 00 | CURRENT_ENTRY_REBUILT |
| CURRENT_RULES.md | NEW_CURRENT_GENERAL_RULE_OWNER |
| 09 | CURRENT_START_GATE_REBUILT |
| 99 | CURRENT_OUTPUT_GATE_REBUILT |
| manifest | CURRENT_ROUTING_AND_ACTIVATION_REBUILT |
| 05A environment index | CURRENT_MODEL_ENVIRONMENT_INDEX_CORRECTED |

## 6. current rule architecture

```text
entry:
  00_read_first.txt

current general rule owner:
  CURRENT_RULES.md

execution gates:
  09_work_start_checklist.txt
  99_integrated_paste_each_time.txt

conditional references:
  rules 01-18

technical canonicals:
  premise 11 / 13 / 14
```

この構造は、全ruleを毎回全文で読むことを要求しない。
一方で、対象作業に必要な個別ruleとtechnical canonicalをmanifest activation mapから必ず発動する。

## 7. GitHub write / durable recording boundary

current technical contractを保持する。

```text
GitHub write:
  Mash-approved scope only

continuous recording:
  mandatory project obligation

continuous recording alone:
  not automatic write authority
```

write承認がなくmaterial artifactが発生した場合は、local-only完成扱いをせず、`DURABLE_WRITE_APPROVAL_REQUIRED`を明示する。

Mashが将来standing checkpoint-write authorityを設定する場合は、exact scopeを明示した別rule / contract authorityを必要とする。

## 8. product / technical effects

```text
Cocolon production source change:
  exact0

mashos-api source change:
  exact0

DB / API / RN / migration change:
  exact0

test / runtime execution:
  exact0

EmlisAI technical authority effect:
  exact0

Piece PCE-0 completion / PCE-1 activation:
  false / false

automatic progression:
  false
```

## 9. postwrite verification requirements

修正反映後、次をfresh確認する。

1. final main / tree。
2. exact changed paths。
3. prepared blobとremote blobの一致。
4. technical canonical 11 / 13 / 14 blob不変。
5. rule index 05 blob不変。
6. production / EmlisAI / Piece workstream artifact変更exact0。
7. `CURRENT_RULES.md`を含むcurrent routingの到達性。

このreport自体はtechnical PASS、product progression、PCE-0 completionを作らない。
