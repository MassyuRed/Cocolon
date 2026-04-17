---
doc_id: cocolon_file_rename_backlog
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-04-17"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 238
purpose: "visible copy cleanup の後に行う file/route/API rename phase の判断を保留管理する"
---

# 1. 位置づけ

今回の current snapshot では、**visible copy cleanup は進んだが、file 名変更はまだ実施していない**。  
この台帳は、その判断を忘れないための backlog です。

# 2. まず current fact

今回の前回スナップショット差分は **18 files**。  
ただし差分の中心は **表示文言・説明文・copy 整理** であり、**file 名 rename / route rename / storage canonical rename ではない**。

# 3. status 定義

- `later`  
  役割が十分安定しており、rename phase で候補になる
- `defer`  
  まだ役割境界が安定していないので保留
- `redefine_before_rename`  
  rename より前に役割整理が必要
- `do_not_rename_now`  
  public API / storage canonical / compatibility に直結するので今は触らない
- `keep_internal_name`  
  internal 名としてむしろ残す方がわかりやすい

# 4. backlog

| path | current fact | status | future candidate | reason |
|---|---|---|---|---|
| `screens/MyModelCreateScreen.js` | UI は ProfileCreate。役割は固定プロフィール資産でかなり安定 | later | `screens/ProfileCreateScreen.js` | public UI 名と role が一致している |
| `screens/MyModelEntryScreen.js` | Piece 領域入口。通常は Nexus、linkPayload 時だけ MyModelScreen | later | `screens/NexusEntryScreen.js` | 入口ファイルとしての役割が明確 |
| `screens/NexusScreen.js` | Piece画面の internal root | keep_internal_name | そのまま維持可 | public UI 名 Piece と internal 名 Nexus を分けるため |
| `screens/MyModelScreen.js` | Entry fallback / legacy 面。通常 root ではない | redefine_before_rename | 未定 | rename より前に役割整理が必要 |
| `screens/MyModelReflectionsScreen.js` | Piece 一覧 / 詳細 / echoes / discoveries / user switch が混在 | defer | 未定 | 単体 Piece list と social history の境界整理が先 |
| `screens/MyModelReactionHistoryScreen.js` | history 系だが役割名がまだ広い | defer | 未定 | history 境界整理が先 |
| `screens/MyWebScreen.js` | Analysis の hub。history / report / self structure / deep insight を内包 | defer | 未定 | Analysis への rename より前に hub 分割判断が必要 |
| `screens/MyWebContentFirstScreen.js` | Analysis 配下 hub card | defer | 未定 | `MyWebScreen.js` 側の整理と一緒に考える |
| `screens/MyWebReportHistoryScreen.js` | Analysis 配下の report history | defer | 未定 | UI 名は Analysis でも route/API canonical は MyWeb |
| `screens/MyWebReportViewerScreen.js` | Analysis 配下の report detail | defer | 未定 | 同上 |
| `screens/MyWebHistoryScreen.js` | Input history/search との境界が絡む | defer | 未定 | Analysis と Home の責務整理が先 |
| `screens/MyWebInputHistoryMenuScreen.js` | history menu 的役割 | defer | 未定 | Home 側への整理可能性あり |
| `App.js` の tab/stack route 名 `MyWeb` | UI 名は Analysis | do_not_rename_now | 未定 | stack / deep link / alias / notification params への波及が大きい |
| `App.js` の tab/stack route 名 `MyModel` / `MyProfile` | UI 名は Piece | do_not_rename_now | 未定 | stack alias / old route compatibility をまだ持つ |
| `lib/nexusApi.js` | internal Nexus aggregation | keep_internal_name | そのまま維持可 | internal 名として有効 |
| `ai/services/ai_inference/api_mymodel_create.py` | `/mymodel/create/*` canonical を維持しつつ `/account/profile-create` も持つ | do_not_rename_now | なし | public route / storage canonical / compatibility に直結 |
| `ai/services/ai_inference/api_mymodel_qna.py` | MyModel canonical を大量に保持 | do_not_rename_now | なし | public API contract 直結 |
| `ai/services/ai_inference/api_myweb_reports.py` | MyWeb canonical を大量に保持 | do_not_rename_now | なし | public API contract 直結 |
| `ai/services/ai_inference/api_myweb_reads.py` | MyWeb canonical を保持 | do_not_rename_now | なし | public API contract 直結 |
| `ai/services/ai_inference/api_nexus.py` | internal Nexus read-side wrapper | keep_internal_name | そのまま維持可 | internal 名として明快 |
| `ai/services/ai_inference/*reflection*` | backend canonical reflection storage / display | do_not_rename_now | なし | storage / publish / generated reflection canonical を維持中 |

# 5. 今後の rename phase の原則

1. **visible copy と file rename を分ける**  
2. **frontend route/file より先に backend public API canonical を触らない**  
3. **public API path を変える時は contract phase として別管理**  
4. **`Nexus` は internal 名として残す選択肢を持つ**  
5. **`ProfileCreate` と `EmotionGeneratedPiece` は絶対に混ぜない**

# 6. current snapshot 差分ファイル（rename 保留の前提）

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

# 7. この台帳の使い方

- copy cleanup phase では `status=do_not_rename_now` を触らない
- file rename phase に入る時は `later` から順に検討する
- `defer` / `redefine_before_rename` は、役割整理の結論が出るまで rename しない
