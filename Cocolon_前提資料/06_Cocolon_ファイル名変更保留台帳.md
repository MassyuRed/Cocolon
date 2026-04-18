---
doc_id: cocolon_file_rename_backlog
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 250
purpose: "PR1〜PR5 実装後に残る rename / orphan cleanup / field-key cleanup の判断を保留管理する"
---

# 1. 位置づけ

この台帳は、**いま意味を変えるべきもの** と **いま rename / delete しない方が安全なもの** を分けるための backlog です。  
current snapshot では、Home write gate / Piece / ProfileCreate / DeepInsight / Piece count semantics は整理できています。  
一方で、**internal canonical / legacy key / orphan file cleanup** はまだ後続タスクが残ります。

# 2. status 定義

- `later`
- `defer`
- `redefine_before_rename`
- `do_not_rename_now`
- `keep_internal_name`
- `physical_cleanup_pending`

# 3. backlog

| path or key | current fact | status | future candidate | reason |
|---|---|---|---|---|
| `screens/MyModelCreateScreen.js` | visible 名は ProfileCreate だが file 名は MyModelCreate legacy | do_not_rename_now | later rename | route / storage / API canonical と一緒に扱う必要がある |
| `api_mymodel_create.py` | current meaning は Account-only asset API | do_not_rename_now | later alias / rename | public route / storage canonical 直結 |
| `MyModelCreate` route/storage canonical | current product flow では ProfileCreate として読む | do_not_rename_now | alias phase 後に rename | 即 rename すると互換範囲が広い |
| `mymodel_questions_total` | current visible semantics は Piece count だが key 名は legacy | redefine_before_rename | additive `piece_generated_total` 追加など | key rename と semantics change は別タスクにする必要がある |
| `questions_total` | ranking payload fallback key として残る | redefine_before_rename | additive new key 追加後に段階移行 | old client / board payload 互換を壊しやすい |
| `screens/DeepInsightScreen.js` | current live flow から外れたが physical file が残りうる | physical_cleanup_pending | archive or delete | file 存在だけで live route と誤読しやすい |
| `api_deep_insight.py` | current public route registration から外れたが file は残りうる | physical_cleanup_pending | archive or delete | app registration / public registry と file cleanup を分離している |
| `/mymodel/qna/trending` | current frontend visible flow では未使用 | redefine_before_rename | generated-only discovery spec 後に再定義 | 今は spec 未確定 |
| `/mymodel/qna/holders` | current frontend visible flow では未使用 | redefine_before_rename | generated-only discovery spec 後に再定義 | 今は spec 未確定 |
| `api/services/ai_inference/piece count RPC/projection` | current visible semantics は新仕様だが repo 外同期が要再確認 | later | DB / RPC sync doc 整備 | repo 内変更だけで閉じない可能性がある |
| `emlis_ai_*` | 役割名が明快 | keep_internal_name | そのまま維持可 | rename phase の主対象ではない |
| `emotion_submit_service.py` | Home write gate + EmlisAI 単一注入点 | keep_internal_name | そのまま維持可 | source of truth が明快 |

# 4. current rename/orphan cleanup の原則

1. **意味の整理と rename を分ける**
2. **public route / response key / storage canonical に直結するものは急いで rename しない**
3. **DeepInsight はまず live flow から外した状態を守り、その後 physical cleanup を行う**
4. **Piece count は semantics を先に固定し、key rename は additive migration にする**
5. **ProfileCreate は Account-only asset の意味を守ることを rename より優先する**

# 5. current operational note

この session の PR1〜PR5 は rename phase ではなく、  
**Home write gate の固定 / Piece再定義 / ProfileCreate孤立化 / DeepInsight停止 / Piece count semantics 再定義 phase** として扱うのが正しいです。
