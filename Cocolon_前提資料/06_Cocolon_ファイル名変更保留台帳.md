---
doc_id: cocolon_file_name_mixing_storage
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-05-09"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 200
  mashos-api: 342
purpose: "visible名とファイル名・route名・DB物理名のズレを、作業時に誤renameしないために保管する"
---

# 1. 位置づけ

この資料は、rename作業のタスク表ではありません。  
Cocolonに残っている旧名称ファイル・旧route・旧DB物理名を、華恋が作業時に取り違えないための保管台帳です。

現行snapshotでは、visible名整理は進んでいますが、次の層に旧語彙が残ります。

- React Nativeのroute名 / screen file名
- backendのlegacy façade file名
- public route alias
- DB physical table名
- JSON payload / semantic data内の旧語彙

これらは、消し忘れとは限りません。  
互換、DB write path、client release boundary、public contractを守るために残しているものがあります。

# 2. current file/name boundary

| 対象 | current fact | status | 読み方 |
|---|---|---|---|
| `Input` route / `InputScreen.js` | visible名はHome | `keep` | Home作業ではInput routeをHome入口として読む |
| `MyWeb`系file / route | visible名はAnalysis | `keep` | Analysis構造のlegacy / DB境界として読む |
| `MyModel` / `Nexus` / `mymodel_qna` | visible名はPiece | `keep` | Piece構造のlegacy façade / DB境界として読む |
| `MyProfile` / `myprofile_*` | visible名はSelf Structure / Profile系 | `keep` | DB physical / access policy / follow関係で混在する |
| `mymodel_create_*` table canonical | public名はProfileCreate | `keep` | DB / account delete / ranking / qna読み込みまで波及するため資料で保管 |
| `lib/apiClient.js` | current API boundary | `keep` | compat env読み取りを含むため、ファイル名は変更しない |
| `AppRuntimeContext.js` | `/app/bootstrap` runtime boundary | `current` | feature flag / version gate / maintenanceを読む正本 |

# 3. 削除・rename判断ではなく、構造読み取りに使う

華恋はこの台帳を、次の目的で使う。

- 旧名称ファイルを見つけた時に、current visible名へ写像する。
- 旧名称が互換維持なのか、DB物理名なのか、runtime ownerなのかを分ける。
- renameしてよいかを即判断しない。
- `08_Cocolon_DB_rename_boundary.md` は存在するため、DB physical rename / drop は `08` を確認した上で、Mash様が明示した場合だけ扱う。
- public APIの削除判断は `05_Cocolon_ルールファイル索引` と `PUBLIC_API_REGISTRY.md` を正本にする。

# 4. renameしない原則

以下のどれかに該当する場合は、この資料で保管し、ファイル名だけを先に変えません。

- RN navigation / deep link / stack routeに関係する。
- public route互換に関係する。
- DB physical table名に関係する。
- write / update / delete / upsert pathに関係する。
- account delete / access policy / subscription tierに関係する。
- JSON payloadや保存済みsemantic dataに旧語彙が残る。
- legacy façadeとしてcurrent ownerへ橋渡ししている。

# 5. 主な current owner / legacy façade

| current owner | legacy / compat façade |
|---|---|
| `api_analysis_reads.py` | `api_myweb_reads.py` |
| `api_analysis_reports.py` | `api_myweb_reports.py` |
| `api_follow.py` / `api_emotion_log.py` / `api_emotion_notification_settings.py` | `api_friends.py` |
| `api_self_structure.py` / `api_connect.py` / `api_follow_graph.py` | `api_myprofile.py` |
| `api_piece_runtime.py` | `api_mymodel_qna.py` |
| `api_emotion_piece.py` | `api_emotion_reflection.py` |
| `astor_analysis_insight.py` | `astor_myweb_insight.py` |
| `astor_self_structure_report.py` / `astor_self_structure_persona.py` | `astor_myprofile_report.py` / `astor_myprofile_persona.py` |
| `astor_emotion_log_feed_*` | `astor_friend_feed_*` |
| `piece_generation_*`, `piece_generated_*`, `piece_*entitlements`, `piece_text_formatter.py` | `astor_reflection_*`, `generated_reflection_*`, `reflection_*`, `mymodel_entitlements.py` |

# 6. DB名について

DB physical rename / drop / bridge view write switch は、この台帳では扱いません。  
`08_Cocolon_DB_rename_boundary.md` は存在するため、DBの実体、bridge view、write path、drop可否は `08` とこの資料を合わせて判断する。destructive変更はMash様が明示した場合だけ扱う。

この台帳では、DB旧名を見た時の読み方だけを保管します。

# 7. 作業時の結論

- この台帳は、残タスクを増やすための資料ではない。
- 旧名称は、まず構造上の役割を読む。
- 資料で保管できる旧名称は、資料で保管する。
- 稼働や契約に影響する場合だけ、関係ファイルを確認して修正する。


# 2026-05-09 差分追記: rename保留 / 追加ファイル境界

| file / name | 保留理由 |
|---|---|
| `today_question_personal_candidate_service.py` | 今日の問いpersonal候補の専用service。既存today_question_storeへ直書きせず、役割を分けるためこの名称で維持 |
| `today_question_personal_question_service.py` | candidateから表示可能question payloadを作る専用service。DB table名との対応を明確にするため維持 |
| `today_question_personal_templates.py` | question_type / fixed choices / hidden_meta の正本。生成AIではなくdeterministic templateであることを名称で明示 |
| `static_role_probe` | 既存100問のorigin名。ユーザー表示名ではないためrenameしない |
| `personal_followup` | Premium向け追加層のorigin名。DB/API/RNで同じ値を使うためrenameしない |
| `source_anchor` | 原文根拠を表すcontract名。AI要約ではない境界を示すためrenameしない |
