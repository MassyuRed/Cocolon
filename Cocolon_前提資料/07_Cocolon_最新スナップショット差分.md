---
doc_id: cocolon_current_snapshot_diff
title: "Cocolon 最新スナップショット差分"
revision_date: "2026-04-17"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 238
purpose: "前回確認スナップショットとの差分を華恋向けに要約し、現在どこまで整理が進んだかを固定する"
---

# 1. 差分の要点

今回の current snapshot は、**主に名称整理の visible copy cleanup** が入った版です。  
file 名 / route 名 / public API canonical / storage canonical rename は、まだ実施していません。

# 2. 変更ファイル数

- `Cocolon`: 16 files
- `mashos-api`: 2 files
- total: 18 files

# 3. 変更ファイル一覧

## Cocolon
- `App.js`
- `guide/guidesJa.js`
- `guide/termsJa.js`
- `lib/iap/iapRuntimeCatalog.js`
- `screens/DeepInsightScreen.js`
- `screens/DiscoveriesHistoryDetailScreen.js`
- `screens/DiscoveriesHistoryListScreen.js`
- `screens/EchoesHistoryDetailScreen.js`
- `screens/EchoesHistoryListScreen.js`
- `screens/MyModelCreateScreen.js`
- `screens/MyWebReportHistoryScreen.js`
- `screens/MyWebReportViewerScreen.js`
- `screens/MyWebScreen.js`
- `screens/SettingsScreen.js`
- `screens/TodayQuestionHistoryScreen.js`
- `screens/nexus/NexusReflectionCard.js`

## mashos-api
- `ai/services/ai_inference/api_deep_insight.py`
- `ai/services/ai_inference/subscription_bootstrap_store.py`

# 4. 今回の差分が意味すること

## 4-1. 進んだこと
- visible label の `Analysis / Piece / ProfileCreate / Settings` 整理
- guide / terms / IAP copy の新名称寄せ
- 一部 backend copy / bootstrap text の新名称寄せ

## 4-2. まだ進んでいないこと
- file rename
- stack route rename
- public API path rename
- storage canonical rename

## 4-3. だから今の資料運用はこうなる
- **表示名は新名称で読む**
- **コード探索は旧 canonical も使って読む**
- rename phase は別管理する

# 5. 今回の差分を見た上での current operational conclusion

- `Analysis` は UI 名  
- `MyWeb` は internal canonical  
- `Piece` は UI 名 / public concept  
- `Nexus` は internal system 名  
- `ProfileCreate` は固定プロフィール資産  
- `EmotionGeneratedPiece` は華恋用補助用語で、Input 起点 `/emotion/reflection/*` flow を指す
