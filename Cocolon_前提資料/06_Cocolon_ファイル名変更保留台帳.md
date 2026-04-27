---
doc_id: cocolon_file_rename_backlog
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-04-27"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
purpose: "visible 名と canonical 名のズレを管理し、rename phase の判断を保留管理する"
---

# 1. 位置づけ

現行 snapshot では、visible 名整理は進んでいるが、file 名 / route 名 / canonical table 名に旧語彙が残る。  
この台帳は、**今すぐ rename しないが、将来の rename phase で判断を忘れない**ための backlog とする。

# 2. current backlog

| 対象 | current fact | status | 理由 |
|---|---|---|---|
| `mymodel_create_*` table canonical | public 名は `ProfileCreate`、canonical table 名は `mymodel_create_questions` / `mymodel_create_answers` | `defer` | DB / account delete / ranking / qna 読み込みまで波及する |
| `MyModel` / `MyProfile` route 名 | visible は `Piece`、tab route には旧名が残る | `later` | frontend route / deep link / navigation 呼び出しの整理が必要 |
| `MyWeb` route 名 | visible は `Analysis`、file / route は MyWeb が残る | `later` | backend canonical と read-side API が MyWeb 名で揃っている |
| compat import path (`lib/apiClient.js` など) | current live caller が残る | `later` | 呼び元が消えるまで互換維持が必要 |
| ProfileCreate の内部文言 | 一部 text に旧 MyModelCreate 文脈が残る | `redefine_before_rename` | UX 名と canonical の切り分けを先に固める |

# 3. 原則

- public route / public contract を巻き込む rename は単独実施しない
- canonical rename は DB / worker / test / docs を同時に見る
- visible 名だけ変えて構造理解を壊さない

# 2026-04-25 差分追記: rename backlog current判断

## current owner 本体化が完了扱いになったもの

| current owner | legacy façade |
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

## 削除判断

現時点で旧名称ファイルは **削除しません**。理由は、旧構造を本体として残すためではなく、legacy route / import path / DB physical name / public contract retirement が未完了だからです。

削除に進める条件:

1. legacy route を contract registry から retire する
2. DB physical name / bridge view / API table constant の方針を確定する
3. current caller から legacy module import が 0 であることを再確認する
4. RN / contract tests / smoke が current route のみで通る

## DB rename backlog

DB physical rename は `08_Cocolon_DB_rename_boundary.md` の分類に従う。現時点では破壊的 rename / drop は実行しません。


# 2026-04-26 差分追記: bridge view 後の削除判断

low / medium / high `pieces` の DB current bridge view は作成済みで、API側も SELECT-only path は current bridge view へ切替済みです。  
ただし、これは旧名称ファイル削除を許可するものではありません。

現時点で削除してよいファイル: **0件**

理由:

- write / update / delete / upsert / insert path は旧物理 table を使い続けている
- DB physical rename / drop は未実行
- JSON payload / scalar vocabulary に旧語彙が残る
- legacy route / public contract retirement は未実行
- client release boundary と API compatibility が未確認

削除判断の次工程:

1. runtime smoke で read-only current bridge view と旧物理 write path の両方を確認する
2. legacy route / contract registry / RN release boundary を棚卸しする
3. public contract retirement の計画を `05` / `02C` / registry と突合する
4. その後に旧名称APIファイル単位で削除可否を判定する

現時点の旧名称ファイルは、消し忘れではなく compat façade / legacy route / DB physical name boundary として保持します。


# 2026-04-27 差分追記: public contract retirement棚卸し後の削除判断

public contract registry cleanup は実施済みですが、旧名称APIファイル削除はまだ行いません。

今回進んだこと:

- current public route 欠落分を registry に追加
- `/friends/*` 互換aliasの一部を deprecated + replacement に整理
- endpoint read/write smoke で `hard_502_count=0` / `non_2xx_count=0` を確認

まだ削除しない理由:

- route handler は互換aliasとしてまだ登録されている
- active legacy named public rows が `mymodel/qna/*` 系を中心に残っている
- DB physical rename / drop は未実行
- write path は旧物理 table を維持している
- Piece write smoke は対象 Piece が無いため今回未確認

現時点で削除してよいファイル: **0件**
