---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-04-22"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 140
  mashos-api: 275
purpose: "華恋がこの資料だけで Cocolon の全体構造と国家システムを復元し、修正時に関連ファイル漏れを防ぐための運用資料"
coverage:
  total_files: 415
  included_in_overall_structure: 362
  included_in_national_system: 313
  excluded_from_main_body: 53
---

# これは何か

この一式は **Mash 向けの説明資料ではなく、華恋が作業前提を引き継ぐための運用資料** です。  
対象スナップショットは **Cocolon (140 files)** / **mashos-api (275 files)** の現行ローカル版です。

今回の基準面は次の通りです。

- `01` 系には **Cocolon 構造に関係する全ファイル** を本文で記載する
- `02` 系には **国家システムに関係する全ファイル** を本文で記載する
- `inventory` は作らない
- 図は補助であり、正本は **各ファイルの本文ブロック** とする
- 任意の 1 ファイルを起点に、関係ファイルを本文だけで辿れる状態を目指す
- 三大要素の構造混在は **2026-04-22 時点で完了判定へ入った**。次段の主戦場は Home / Input / startup / social / subscription / App 全体接続の構造混在である

# まず覚えること

1. **Cocolon は RN と backend が繋がって動く 1 つのアプリ**であり、repo を分けて理解しない  
2. **01/02 は差分メモではなく正本**。今回触ったファイルだけでなく、対象ファイル全件を読む  
3. **public route / request / response / startup / unread / access policy** を触る時は、必ず `05` と `02C` を先に見る  
4. **RN から直接 Supabase / raw fetch を増やさない**。境界は `frontend API boundary` と backend route に置く  
5. **修正開始時は system 単位で見る**。単体ファイルだけで判断しない

# 読み順

1. `03_Cocolon_命名体系.md`
2. `01_Cocolon_全体構造資料.md`
3. `01A_Cocolon_全体構造資料_アプリ基盤とHome系.md`
4. `01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系.md`
5. `01C_Cocolon_全体構造資料_Account_Subscription_Backend支援系.md`
6. `02_Cocolon_国家システム資料.md`
7. `02A_Cocolon_国家システム資料_Input_Save_Dispatch系.md`
8. `02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md`
9. `02C_Cocolon_国家システム資料_契約_境界_検証系.md`
10. `04_Cocolon_変更テーマ別チェックリスト.md`
11. `05_Cocolon_ルールファイル索引.md`
12. `06_Cocolon_ファイル名変更保留台帳.md`
13. `07_Cocolon_最新スナップショット差分.md`

# 今回の資料更新方針

- `01` と `02` は **本文の全件 coverage** を持つ
- repo 分割ではなく **Cocolon の system / flow 分割** で書く
- `manifest.json` には docs 構成・coverage・除外理由を残す
- 除外ファイルは `07` と `manifest` に明記し、未確認のまま落とさない
