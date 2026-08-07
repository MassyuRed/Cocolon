---
doc_id: cocolon_piece_durable_recording_rule_application_incident_20260807
title: "Piece durable-recording rule application incident"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
operational_owner: "Karen"
workstream: "Cocolon / Piece"
incident_type: "EXISTING_CURRENT_RULE_NOT_APPLIED"
predecessor_cocolon_commit: "f17187b4a79f329b91f56e76cb06dca07ff159c5"
predecessor_cocolon_tree: "65a6ff4a0fdb33aa5bf5a0bb89f8985ddc9b8b7c"
automatic_progression: false
technical_effect: "exact0"
production_effect: "exact0"
---

# Piece durable-recording rule application incident

## 1. 結論

Piece成果物をMashの指摘前にGitHubへ保存しなかった問題は、durable recording ruleが存在しなかったことではない。

```text
rule state:
  ALREADY_CURRENT_AND_CONNECTED

actual failure:
  KAREN_DID_NOT_APPLY_EXISTING_RULE
```

したがって、正しい説明は次である。

```text
誤:
  今回からPiece成果物をGitHubへ残す運用になった。

正:
  2026-08-05から全Cocolon作業にcurrent mandatory ruleが存在していたが、
  Piece作業で華恋がそのruleを適用せず、Mashの指摘後に遅れてGitHub反映した。
```

## 2. 既存current rule

### canonical owner

```text
Cocolon_前提資料/14_cocolon_continuous_work_recording_and_emergency_handoff.md
```

このownerは、次をcurrent mandatory ruleとして定めている。

- local file、chat、scratch、cache、SHA-256だけはdurable accumulationではない。
- new artifact、review blocker、authority transition、execution result、next-action変更ごとに作業途中でcheckpointを更新する。
- Mashがhandoffを求めることを保存開始条件にしない。
- public-safe work recordはCocolon GitHubの既存ownerへ保存する。
- remote fresh readまでpreservation completeとしない。

### behavioral owner

```text
Cocolon_前提資料/work_attitude_rules_for_karen/
17_continuous_durable_work_recording_and_emergency_handoff.txt
```

このruleは全Cocolon design、implementation、audit、authority、GitHub-reflection workへmandatoryと明記している。

### connected entry and gates

```text
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/09_work_start_checklist.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
Cocolon_前提資料/work_attitude_rules_for_karen/manifest.json
Cocolon_前提資料/05_cocolon_rule_file_index.md
Cocolon_前提資料/11_cocolon_github_transport_and_session_continuity.md
```

2026-08-05のrule接続commitは次である。

```text
e6c5e1ff783e8ff54652f50f585102758bfae40f
message:
  docs: preserve V16 work state and require continuous handoff
```

このcommitはcanonical ruleだけでなく、READ FIRST、rule index、latest snapshot、GitHub continuity contract、behavioral ruleへ接続している。

## 3. 今回確認した違反

Piece roadmap、Piece / Analysis handoff、PCE-0成果物は、後続作業が依存するmaterial artifactだった。

それにもかかわらず、最初の成果物作成時点ではlocal-onlyのまま完了成果物として扱い、GitHub-backed checkpointを作成しなかった。

GitHub反映は、Mashが次を指摘した後に開始した。

```text
成果物はGitHubに反映してくれない？
ローカルで残されても何の意味もない。
```

これは、canonical ruleの次の要件に抵触する。

```text
Do not defer all recording until Mash asks for a handoff.
Local bytes are not durable project accumulation.
After every material artifact, update a GitHub-backed checkpoint.
```

## 4. 直接原因

確認できる直接原因は次である。

1. Piece作業開始時に、`00_read_first.txt`の必読順と`09_work_start_checklist.txt`のdurable checkpoint項目を実際の作業gateとして適用しなかった。
2. roadmapとhandoffを「ローカルで作成してMashへ渡せば完了する成果物」と誤分類した。
3. artifact作成後のmandatory checkpoint triggerを通さず、local-only stateを完了として報告した。
4. 出力前の`99_integrated_paste_each_time.txt`で、material artifactがGitHub-backedかを確認しなかった。

これはMash側の指示不足ではない。

## 5. explicit write approval条項との関係

current rule群には、次の二つが併存している。

```text
A:
  material artifactごとにMashのhandoff依頼を待たずGitHub-backed checkpointを更新する。

B:
  対象checkpointまたは成果物の明示承認後だけGitHub writeする。
```

既存文面は、approved task scope内のpublic-safe administrative checkpointについて、task承認をcheckpoint write承認として扱うかを一文で明示していない。

ただし、この接続上の曖昧さは今回のlocal-only完了を正当化しない。

どちらに解釈しても、華恋が取れる行動は次のいずれかだった。

```text
1. approved durable ownerへcheckpointを保存し、remote fresh verificationする。

または

2. write authorityが不足すると判断した時点で、material local-only dependencyを増やす前にSTOPし、
   保存owner / approval gapを明示する。
```

次は許可されていなかった。

```text
local-only成果物を完成扱いして報告し、MashからGitHub反映を指摘されるまで待つ。
```

したがって、primary incidentはrule application failureである。approval条項の接続曖昧さはsecondary correction candidateとして分離する。

## 6. 実施済み是正

Mashの指摘後、Piece成果物は次へGitHub反映済みである。

```text
Cocolon_Piece/
Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md
Cocolon_前提資料/07A_piece_workstream_checkpoint_20260807.md
```

反映後head:

```text
commit:
  f17187b4a79f329b91f56e76cb06dca07ff159c5

tree:
  65a6ff4a0fdb33aa5bf5a0bb89f8985ddc9b8b7c
```

EmlisAI実装履歴へのPiece成果物混入はexact0、production source / DB / API / RN / migration / test / runtime / release effectはすべてexact0である。

## 7. current rule status

このincident記録は、existing ruleの変更、緩和、追加、再解釈を行わない。

```text
14 canonical rule:
  CURRENT_UNCHANGED

17 behavioral rule:
  CURRENT_UNCHANGED

GitHub reflection contract:
  CURRENT_UNCHANGED

automatic progression:
  false
```

## 8. separate correction candidate

同じ誤読余地をなくすには、別のMash approvalで、AとBの接続を次のように明文化する候補がある。

```text
public-safe administrative durable checkpointが、
既にMash承認済みのtask scope内であり、
既存のapproved premise / implemented-document ownerへ保存され、
technical execution、product progression、contract mutation、new production ownerを伴わない場合、
continuous recording ruleをstanding checkpoint-write authorityとして扱う。

code、DB、API、RN、migration、runtime、rule / contract変更、scope expansion、
または新しいtechnical ownerの作成は、従来どおり別の明示承認を必要とする。

approved durable ownerが存在しない場合、material local-only dependencyを完成扱いせず、
owner approvalを必要とするSTOPとして記録する。
```

これはproposalであり、Mashの別承認なしにcurrent contractへ反映しない。

## 9. closure state

```text
RULE_MISSING:
  false

RULE_ALREADY_CURRENT:
  true

RULE_FULLY_CONNECTED:
  true

KAREN_RULE_APPLICATION_FAILURE:
  true

MASH_INSTRUCTION_DEFECT:
  false

PIECE_ARTIFACT_GITHUB_REMEDIATION:
  complete at f17187b4a79f329b91f56e76cb06dca07ff159c5

NORMATIVE_RULE_CORRECTION:
  not executed

AUTOMATIC_PROGRESSION:
  false

TECHNICAL_EFFECT:
  exact0
