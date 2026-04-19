---
doc_id: cocolon_change_theme_checklists
title: "Cocolon 変更テーマ別チェックリスト"
revision_date: "2026-04-19"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
purpose: "変更テーマから 01/02 の読む順を逆引きできるようにする"
---

# 1. 使い方

変更指示を受けたら、まずテーマを 1 つ決める。  
その後、**01 の system 把握 → 02 の国家システム把握 → rule / contract / test 確認** の順で辿る。

# 2. テーマ別の最短読む順

## 2-1. Home / Input / notice / today-question / emotion reflection
1. `03_Cocolon_命名体系.md`
2. `01_Cocolon_全体構造資料.md`
3. `01A_Cocolon_全体構造資料_アプリ基盤とHome系.md`
4. `02_Cocolon_国家システム資料.md`
5. `02A_Cocolon_国家システム資料_Input_Save_Dispatch系.md`
6. `02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md`
7. `05_Cocolon_ルールファイル索引.md`

## 2-2. Analysis / MyWeb / Self Structure / report
1. `03`
2. `01`
3. `01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系.md`
4. `02`
5. `02B_Cocolon_国家システム資料_Snapshot_Worker_Publish_Read系.md`
6. `02C_Cocolon_国家システム資料_契約_境界_検証系.md`
7. `05`

## 2-3. Piece / Nexus / generated reflection / qna
1. `03`
2. `01`
3. `01B`
4. `02`
5. `02A`
6. `02B`
7. `02C`
8. `05`

## 2-4. EmotionLog / social / ranking
1. `03`
2. `01B`
3. `02B`
4. `02C`
5. `05`

## 2-5. Account / ProfileCreate / subscription / settings
1. `03`
2. `01C_Cocolon_全体構造資料_Account_Subscription_Backend支援系.md`
3. 国家システムに絡むなら `02B` と `02C`
4. `05`

## 2-6. contract / boundary / startup / guard
1. `01A` と `01C`
2. `02C`
3. `05`
4. 必要なら `07`

# 3. 実作業時の原則

- 単体ファイルだけで決めない
- file block の **直接関係ファイル / 直接参照ファイル / 同時確認ファイル** を全部開く
- national system に関係する変更は必ず `02` 系へ入る
- route / request / response / startup / unread / entitlement を触る時は rule file と test を先に見る
