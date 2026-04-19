---
doc_id: cocolon_file_rename_backlog
title: "Cocolon ファイル名変更保留台帳"
revision_date: "2026-04-19"
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
