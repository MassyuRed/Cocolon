---
doc_id: cocolon_rule_file_index
title: "Cocolon ルールファイル索引"
revision_date: "2026-08-07"
source_repositories:
  - Cocolon
  - mashos-api
purpose: "active Gateと専門contract / guardを、重複せず必要時だけ辿るための索引"
---

# 1. current rule architecture

全Cocolon作業で常時activeなのは次だけです。

```text
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
  G1 Source / Fact Gate
  G2 Scope / Authority Gate
  G3 User-Burden / Joint-Development Gate
  G4 Durable-Work Gate
  G5 GitHub Reflection Gate
  G6 Environment / Specialized Gate
```

`09_work_start_checklist.txt`と`99_integrated_paste_each_time.txt`はHISTORICAL_REFERENCEであり、current実行Gateではありません。

# 2. technical canonical owners

| scope | canonical owner | when required |
|---|---|---|
| GitHub reflection / completion | `11_cocolon_github_transport_and_session_continuity.md` | GitHub write時 |
| Work-local Python / pytest runtime | `13_cocolon_work_test_runner_runtime_continuity.md` | Work pytest runtimeを扱う時だけ |
| durable recording / emergency handoff | `14_cocolon_continuous_work_recording_and_emergency_handoff.md` | material artifact / blocker / transition / continuation時 |

# 3. product / code rules — 必要時だけ読む

| path | 何を拘束するか | いつ必須か |
|---|---|---|
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | public API additive-only / compatibility | public route / request / responseを触る時 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public route / version policy | route追加・置換・削除時 |
| `mashos-api/scripts/check_no_direct_supabase.py` | RN direct Supabase禁止 | frontend data access変更時 |
| `mashos-api/ai/services/ai_inference/core_contract_registry.py` | 三大中核のinput/output/storage境界 | EmlisAI / Piece / Analysis本流変更時 |
| `mashos-api/ai/services/ai_inference/piece_generation_policy.py` | Piece preview/publish safety/hash | Piece生成・publish変更時 |
| `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py` | Analysis保存・断定抑制 | Analysis変更時 |
| `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py` | EmlisAI immediate reply gate | EmlisAI表示境界変更時 |

# 4. area reference

`work_attitude_rules_for_karen/11_cocolon_area_specific_do_not_break.txt`は領域別referenceです。

Piece current definition:

```text
PieceはQ&Aそのものではない。
Q&AはPieceの一形式。
Pieceは、ユーザーの考えや価値観を他者に伝えるための文章に整形し、画像化する機能。
```

current Piece ownerは`Cocolon_Piece/00_read_first.md`と`Cocolon_Piece/manifest.json`です。

# 5. historical / retired

- `.github/cocolon_formal_publication_guard/*` と `12_cocolon_github_actions_publication_guard.md` はHISTORICAL_NON_NORMATIVE / RETIRED_DISABLED。
- old SSH / exact-lease / Guardian条件をcurrent GitHub反映条件へ戻さない。
- 09 / 99の旧巨大checklistをcurrent ruleとして復活させない。

# 6. rule maintenance policy

新しい事故が起きても、まず新ruleを増やしません。

1. 既存6 Gateのどれで止めるべきだったか確認する。
2. 専門contract不足なら、そのownerだけ修正する。
3. 同じ意味を00 / checklist / integrated copyへ重複記載しない。
4. 新しい常時active Gateが本当に必要な場合だけ、Mash承認で00へ追加する。
5. historical fileは削除せず、current statusだけ明示する。
