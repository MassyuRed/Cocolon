---
doc_id: cocolon_file_name_mixing_storage
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-05-16"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
source_snapshot:
  premise: "Cocolon_前提資料(90).zip"
  Cocolon: "Cocolon_8(11).zip"
  mashos-api: "mashos-api_8(16).zip"
file_counts:
  Cocolon: 216
  mashos-api: 504
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
| `MyProfile` / `myprofile_*` | visible名はユーザー向けには `わたしマップ`、内部では Self Structure / Profile系が残る | `keep` | DB physical / access policy / follow関係で混在する |
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

## 2026-05-13 差分追記: わたしマップ visible名と旧名保管

`Self Structure` / `MyProfile` は内部名・ファイル名・DB物理名として残るが、ユーザー向け visible 名は `わたしマップ` に寄せる。

| 対象 | current fact | status | 読み方 |
|---|---|---|---|
| `SelfStructure*` screen / component | visible は `わたしマップ` | `keep` | file名は互換境界。ユーザー向け文言だけ変更。 |
| `/self-structure/*` route | visible は `わたしマップ` | `keep` | public route rename 禁止。 |
| `myprofile_reports` table | `watashiMap` payload を含む self-structure report の物理保存先 | `keep` | DB physical rename 禁止。 |
| `selfStructureDeepVisual` | 旧 deep visual payload | `fallback` | `watashiMap` がない旧レポート用 adapter として残す。 |
| `content_json.watashiMap` | 新 additive payload | `additive` | UI はこれを優先表示。 |
| `components/watashiMapAccessPolicy.js` / `components/selfStructure/watashiMapAccessPolicy.js` | root互換copy + selfStructure正配置 | `resolved-watch` | 最新実ファイルではscreen import pathと一致。root copyは同内容の互換copyとして保管。 |


# 2026-05-15 差分追記: A案到達内部名称のrename禁止

| current name | 種別 | 判断 | 理由 |
|---|---|---|---|
| `cocolon_emlis_observation_composer.a1.v1` | internal composer model | `rename禁止` | A案相当の内部model名。visible名 `Emlisの観測` や `input_feedback.comment_text` へrenameしない |
| `step18_ap0_migration_decision` | internal decision meta | `rename禁止` | A-P0判定のQA meta。public API keyではない |
| `step20_long_term_quality` | internal QA meta | `rename禁止` | 長期品質の内部診断用meta。ユーザー表示文ではない |

# 2026-05-15 差分追記: 限定Composer拡張内部名称のrename禁止

限定Composer拡張 Step0-11 で増えた次の名前は、内部meta / helper / test名です。ユーザー表示名・public route・DB物理名へrenameしない。

| 名前 | 種類 | rename可否 | 理由 |
|---|---|---|---|
| `limited_composer_extension_baseline` | meta key | `rename禁止` | Step0 baseline確認用。public response keyではない。 |
| `connection_visibility` | meta key | `rename禁止` | composer未接続とrejection切り分け用。route名ではない。 |
| `SentenceBinding` / `SentenceBindingBundle` | internal type | `rename禁止` | 文ごとの根拠・phrase・relation束縛型。DB table名ではない。 |
| `relation_taxonomy` | internal meta / helper | `rename禁止` | relation_not_expressedを構造で追うための内部分類。visible名ではない。 |
| `limited_surface_realizer` | internal helper | `rename禁止` | 文法部品選択の内部層。固定表示文名ではない。 |
| `scorecard_harness` | QA meta | `rename禁止` | coverage_group別の進捗集計。商品表示名ではない。 |
| `step10_e2e_display_contract` | QA meta | `rename禁止` | passed-only表示契約の確認名。public API contract keyではない。 |
| `step11_e2e_exit_gate` | QA meta | `rename禁止` | 完全Composer初期版へ進む入口判定。route名ではない。 |

visible名は引き続き `Emlisの観測`、公開本文は `input_feedback.comment_text`、表示条件は `observation_status=passed` かつ本文ありの場合のみ。

# 2026-05-16 差分追記: 完全Composer初期版内部名称のrename禁止

Complete Composer初期版では、`complete_*` 系の新規ファイル名と、既存 `a_plan_equivalent` / `A-1` 系の互換名が併存する。これは移行中の構造保管であり、即rename対象ではない。

| 名称 / path | 種別 | 扱い | 理由 |
|---|---|---|---|
| `emlis_ai_complete_*` | 新規runtime / meta / test | `rename禁止` | Complete初期版の内部owner名。public route / visible名ではない。 |
| `a_plan_equivalent` / `A-1` | legacy compatible alias | `rename禁止` | 既存Step18/19およびtest互換を保持するため。資料上は完全Composer初期版として読む。 |
| `complete_initial` / `complete_composer_initial` | registry alias / meta | `rename禁止` | registry解決用aliasであり、DB/API/RN名ではない。 |
| `cocolon_emlis_observation_composer.a1.v1` | composer_model | `rename禁止` | 内部model名。ユーザー表示名 `Emlisの観測` を置換しない。 |
| `Cocolon/tests/rn-screen-contracts.test.js` | RN regression test | `rename禁止` | Complete metaのspecial-case禁止とpassed-only表示契約を固定する。 |

禁止: 完全Composer初期版の実装を理由に、DB physical name、public API route、response key、RN visible titleをrenameしない。

# 2026-05-16 差分追記: 商品品質版接続 Step0-7 内部名称のrename禁止

商品品質版接続 Step0-7 で増えた次の名称・pathは、内部meta / QA / release判定名です。ユーザー表示名、public route、DB physical name、response keyへrenameしない。

| 名称 / path | 種別 | 扱い | 理由 |
|---|---|---|---|
| `emlis_ai_complete_tone_policy.py` | Step5 service owner | `rename禁止` | Tone Engineの内部service名。Emlis visible名ではない。 |
| `emlis_ai_complete_product_quality_scorecard_service.py` | Step6 service owner | `rename禁止` | Product Gate判断材料を作るmeta-only service。public scorecard APIではない。 |
| `emlis_ai_complete_release_ladder_service.py` | Step7 service owner | `rename禁止` | release ladder判定metaのowner。public rollout操作ではない。 |
| `complete_product_quality_scorecard` | diagnostic/meta key | `rename禁止` | Product Gate到達宣言ではなく、判断材料。 |
| `complete_product_quality_release_ladder` | diagnostic/meta key | `rename禁止` | internal / limited / broader_beta / product_gateの判定meta。 |
| `blind_qa_rubric` / `read_feeling_score` | QA meta | `rename禁止` | 人手QA評価の概念。自動Gateやpublic本文ではない。 |
| `product_gate_reached` / `product_gate_public_release_applied` | release meta | `rename禁止` | Step7ではfalseを維持する安全契約。 |

visible名は引き続き `Emlisの観測`、公開本文は `input_feedback.comment_text`、表示条件は `observation_status=passed` かつ本文ありの場合のみ。
