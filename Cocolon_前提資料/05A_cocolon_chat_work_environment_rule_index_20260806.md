---
doc_id: cocolon_chat_work_environment_rule_index
title: "Chat 5.6 Pro / Work Ultra 実行環境ルール索引"
revision_date: "2026-08-06"
normative_status: "CURRENT_INDEX"
decision_owner: "Mash"
operational_owner: "Karen"
canonical_rule: "work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt"
---

# 1. この索引の役割

この資料は、Cocolon作業でChat / Workと実際のmodelを選ぶrule ownerを、前提資料側から見つけるためのadditive indexです。

環境判定の本文を重複所有しません。current canonical ruleは次です。

`Cocolon_前提資料/work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt`

# 2. いつ必須か

Cocolonの技術作業、設計、実装、監査、authority、STOP recovery、GitHub reflectionを始める前に必須です。

華恋は、現在の実際のChat / Work環境とmodelを確認し、bounded作業単位ごとに次のいずれかを判定します。

- `CHAT_5_6_PRO_OK`
- `WORK_ULTRA_REQUIRED`
- `MODEL_OR_ENVIRONMENT_MISMATCH_STOP`

Chat作業を`CHAT_5_6_PRO_OK`と扱えるのは、実際のmodelが`GPT-5.6 Pro`であると確認できる場合だけです。

# 3. 必読・接続先

| path | role |
|---|---|
| `work_attitude_rules_for_karen/00_read_first.txt` | 毎回の入口。18番を09より先に読む順序を固定 |
| `work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt` | 環境・model判定のcanonical owner |
| `work_attitude_rules_for_karen/09_work_start_checklist.txt` | 実model確認、bounded work unit、判定表示、STOP条件の開始gate |
| `work_attitude_rules_for_karen/99_integrated_paste_each_time.txt` | 出力直前の統合gate |
| `work_attitude_rules_for_karen/manifest.json` | rule file登録と2026-08-06 update lineage |
| `14_cocolon_continuous_work_recording_and_emergency_handoff.md` | Chat / Work / model切替時のdurable checkpoint owner |
| `work_attitude_rules_for_karen/17_continuous_durable_work_recording_and_emergency_handoff.txt` | 作業姿勢側の継続記録owner |
| `13_cocolon_work_test_runner_runtime_continuity.md` | Work-local Python / pytestを使う場合のruntime owner |
| `work_attitude_rules_for_karen/16_test_runner_runtime_continuity_and_one_shot_prelaunch.txt` | Work-local test-runnerのbehavioral prelaunch owner |

# 4. 選択境界

Chatの`GPT-5.6 Pro`を標準環境とします。

速度、応答回数、便利さだけを理由にWork Ultraへ移しません。bounded分割、deterministic verification、hash / diff / test、fresh postverification、durable checkpointで同じ要求品質を維持できるならChatを使います。

Work Ultraは、独立複数agent review、独立並列仮説調査、Chatではcoverageを証明できない分割不能監査、Work固有runtime / path / tool、atomic authority内のWork必須stageなど、環境自体が品質・証拠条件になる場合だけ必須です。

同じ華恋の反復確認を独立agent reviewとして数えません。

# 5. model変更境界

華恋はmodelを勝手に変更した、変更できる、変更済みであるとは扱いません。

現在のChat modelが`GPT-5.6 Pro`ではない、または確認できない場合、技術作業を開始せず`MODEL_OR_ENVIRONMENT_MISMATCH_STOP`を出します。

Work Ultraが必要だが利用できない場合、品質を下げずexact作業単位をpending / STOPとして保持します。追加credit購入、自動補充、課金を黙示前提にしません。

# 6. 完了条件

環境ruleが接続済みと扱えるのは、次が全てcurrent remote bytesとして確認できる場合だけです。

1. 18番canonical ruleが存在する。
2. 00の必読順で18番が09より前にある。
3. 09に実環境・実model・bounded作業単位のcheckがある。
4. 99に同じ判定語と停止条件が統合されている。
5. manifestのfilesとupdate notesに18番が登録されている。
6. この前提資料側indexからcanonical ruleへ到達できる。
7. GitHubからfresh readし、書き込んだbytesと一致する。

# 7. この索引が許可しないこと

この索引は、technical authority、実装、GitHub write、model変更、Work Ultra課金、subagent write、automatic progressionを許可しません。
