---
doc_id: cocolon_chat_work_environment_rule_index
title: "GPT-5.6 Pro / Work Ultra 実行環境ルール索引"
revision_date: "2026-08-12"
normative_status: "CURRENT_INDEX"
decision_owner: "Mash"
operational_owner: "Karen"
canonical_rule: "work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt"
---

# 1. この索引の役割

この資料は、Cocolon作業で使用できるmodel / environmentと、Pro華恋・Ultra華恋・Mash様の三者role / 三段階scope classificationのcurrent canonical ruleを、前提資料側から見つけるためのindexです。

本文を重複所有しません。current canonical ruleは次です。

`Cocolon_前提資料/work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt`

# 2. 最重要境界

- ChatでCocolon作業を行うmodelは`GPT-5.6 Pro`。
- Pro以外またはmodel identity不明では`MODEL_OR_ENVIRONMENT_NOT_ELIGIBLE_STOP`。
- non-Proまたはmodel不明で作られたCocolon成果物は、Pro再監査まで`UNTRUSTED_NOT_ADOPTED_UNTIL_PRO_REAUDIT`。
- bounded workは`ROUTINE_SINGLE_OWNER_SCOPE` / `JOINT_WITHIN_EXISTING_DELEGATION_SCOPE` / `MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE`からexactly oneへ分類する。
- LEVEL_1 / LEVEL_2はRule 18のallowed standing delegation内だけで作業ごとの新しい事前approvalを省略し、LEVEL_3はfirst effect前のMash明示decision / approvalを必要とする。
- Work Ultraは、独立agent、分割不能監査、Work固有runtime等、環境自体が成立条件の場合だけ使用する。
- Pro華恋とUltra華恋は上下関係ではなく、商品整合と技術成立の責任領域が異なる対等な共同担当者である。
- Pro華恋はMash様の思想・商品目的・利用者価値・作業比例性・平易な説明、Ultra華恋はinitial / final technical design・実装・test・final technical go / STOP・postverificationを担う。
- Pro華恋のproduct reviewは同じstable design identityについて原則一回とし、materialな新事実・scope・商品条件・費用期間・remote不一致だけを差分限定の再確認理由とする。
- Mash様は思想、商品、品質、Safety / privacy / public boundary、費用、期間その他normative decisionとLEVEL_3 approvalのownerである。

# 3. いつ必須か

Cocolonの設計、診断、監査、rule変更、実装、authority、STOP recovery、GitHub reflection、完了判断の前に必須です。

bounded作業単位ごとに次のいずれかを判定します。

- `CHAT_5_6_PRO_OK`
- `WORK_ULTRA_REQUIRED`
- `MODEL_OR_ENVIRONMENT_NOT_ELIGIBLE_STOP`

# 4. 接続先

| path | role |
|---|---|
| `work_attitude_rules_for_karen/00_read_first.txt` | current入口とmodel gate |
| `work_attitude_rules_for_karen/CURRENT_RULES.md` | current一般行動rule |
| `work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt` | model / environment + three-role / three-tier workflow canonical rule |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` | 作業開始前の実行Gate |
| `work_attitude_rules_for_karen/99_integrated_paste_each_time.txt` | 出力直前Gate |
| `work_attitude_rules_for_karen/manifest.json` | activation mapとcurrent owner |
| `14_cocolon_continuous_work_recording_and_emergency_handoff.md` | model / environment切替時のdurable checkpoint owner |
| `13_cocolon_work_test_runner_runtime_continuity.md` | Work-local Python / pytest runtime owner |

# 5. 完了条件

環境ruleがcurrentに接続済みと扱えるのは、次が全てremoteで確認できる場合だけです。

1. canonical rule 18が存在する。
2. 00、CURRENT_RULES、09、99が同じmodel statesを参照する。
3. manifestがcurrent ownerとactivationを登録する。
4. non-Pro成果物の再監査境界が定義されている。
5. Rule 18、CURRENT_RULES、09、99が同じ三者roleとreview boundaryを参照する。
6. GitHubから各対象fileをfresh readし、prepared bytesと一致する。

# 6. この索引が許可しないこと

technical authority、実装、GitHub write、Work Ultra課金、subagent write、automatic progressionを許可しません。
