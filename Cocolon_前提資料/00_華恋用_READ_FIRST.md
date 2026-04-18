---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 250
purpose: "華恋がセッションを跨いでも、全体構造と国家システムを前提に作業できるようにする"
---

# これは何か

この一式は **Mash 向けの説明資料ではなく、華恋が作業前提を引き継ぐための運用資料** です。  
対象スナップショットは **Cocolon (133 files)** / **mashos-api (250 files)** の現行ローカル版です。

今回の目的は次の 3 点です。

1. 単体ファイルだけを見て修正しない  
2. 変更対象を **システム単位** で把握してから作業する  
3. セッションが変わっても、前提知識をこの資料群から復元できるようにする

# 資料更新ポリシー（2026-04-18 追加）

この資料群は、**全置換ではなく差分修正を積み増していく形式**で運用する。  
既存本文は原則残し、**今回の変更で内容が変化した箇所だけ**を追記・更新する。

運用原則:
- 既存の構造説明は消さない
- 変更履歴は `07_Cocolon_最新スナップショット差分` と `manifest.json` / `inventory/current_snapshot_changed_files.csv` に蓄積する
- `current snapshot` 系 inventory は最新差分を示しつつ、履歴は別セクション/履歴列で保持する


# 最初の読み順

1. `03_Cocolon_命名体系.md`  
2. `01_Cocolon_全体構造資料.md`  
3. `02_Cocolon_国家システム資料.md`  
4. `04_Cocolon_変更テーマ別チェックリスト.md`  
5. `05_Cocolon_ルールファイル索引.md`  
6. `inventory/focus_map.yaml`  
7. 必要な inventory / route map / worker map

# 作業時の絶対ルール

## 1. 単体ファイルだけで判断しない
変更対象が 1 ファイルに見えても、最低でも次の連鎖を確認する。

- `frontend screen`
- `client lib / shared component`
- `backend api_*`
- 必要なら `astor_material_snapshots.py / astor_worker.py / publish_governance.py / startup_snapshot_store.py`

## 2. public API は contract を先に確認する
public route / request / response / unread / startup payload を触る前に、必ず先に読む。

- `05_Cocolon_ルールファイル索引.md`
- `mashos-api/ai/docs/API_CONTRACT_POLICY.md`
- `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md`
- `mashos-api/ai/services/ai_inference/api_contract_registry.py`
- `mashos-api/ai/tests/contract/*`

## 3. RN から直接 Supabase / raw fetch を増やさない
RN 側は `lib/apiClient.js` を経由する前提。  
直接 `supabase.from / rpc / channel` や `fetch()` を増やす前に、必ず rule を確認する。

- `mashos-api/scripts/check_no_direct_supabase.py`

## 4. Tutorial は screen 個別実装ではなく共通基盤で見る
tutorial のズレや押下不安定は、`TutorialOverlay` の共通測定・proxy press 基盤で解く。  
画面ごとのタイマー修正で直さない。

- `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md`

## 5. Piece / Nexus / MyModel を雑に同一視しない
命名は現状もっとも混乱しやすい。  
必ず `03_Cocolon_命名体系.md` を基準にする。

# 変更テーマごとの入口

- Input / Notice / Today Question / Input summary / global summary  
  → `04_Cocolon_変更テーマ別チェックリスト.md` の `Input/Home`
- Analysis / MyWeb / report / unread  
  → `Analysis/MyWeb`
- Self Structure  
  → `Self Structure`
- Piece 画面全体  
  → `Piece画面 / Nexus`
- Piece 単体仕様  
  → `Piece単体 / generated reflection / qna`
- ProfileCreate  
  → `ProfileCreate`
- EmotionGeneratedPiece（華恋用補助用語）  
  → `EmotionGeneratedPiece`
- EmotionLog / 感情通知  
  → `EmotionLog / Follow`
- startup / bootstrap / unread orchestration  
  → `App startup / unread`
- API contract / response shape  
  → `Public API contract`
- EmlisAI / input_feedback / greeting-state / subscription capability  
  → `EmlisAI`

# この資料群を更新する時の最低手順

コードを触ったあと、次だけは更新する。

1. `07_Cocolon_最新スナップショット差分.md`
2. `06_Cocolon_ファイル名変更保留台帳.md`（rename 判断が変わった場合）
3. `inventory/focus_map.yaml`（system の読み順や主要ファイルが増えた場合）
4. `inventory/Cocolon_inventory_full.*` / `inventory/mashos-api_inventory_full.*`（全件 inventory）
5. `inventory/public_api_registry.csv`（public route が変わった場合）
6. `inventory/worker_job_map.csv`（job family が増減した場合）

## 6. 前提資料更新は差分蓄積で行う
- 既存本文を丸ごと置き換えない
- 変更した system / contract / inventory のみを差分修正する
- 変更履歴は `07` に追記して残す

# 今回の最新スナップショットで覚えておく一言

**visible 名は更新が進んでいるが、file / route / API / storage canonical は旧名が多く残っている。**  
なので、**見た目だけ新名称、内部は旧名称** の層を意識して読む必要がある。

**2026-04-18 追記:** Input 直後返答には EmlisAI の同期 immediate path が追加された。  
ただし worker / publish / startup を置き換えたわけではなく、**保存直後の `input_feedback` だけが EmlisAI 層を通る**と理解する。
