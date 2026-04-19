---
doc_id: cocolon_overall_structure_full_coverage
title: "Cocolon 全体構造資料"
revision_date: "2026-04-19"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 140
  mashos-api: 265
purpose: "華恋が Cocolon 構造に関係する全ファイルを system / relation 単位で復元できるようにする"
coverage:
  included_files_total: 352
  included_files_cocolon: 133
  included_files_mashos_api: 219
---

# 1. 1行定義

現行の Cocolon は、**RN surface + frontend boundary + backend public API + gateway / policy / worker + tests / rules** が繋がって動く 1 つのアプリです。  
repo は分かれていても、理解の単位は **system / feature / flow** です。

# 2. 全体構造の読み方

- `01A` は **アプリ基盤 / Home / startup / immediate reply**
- `01B` は **Analysis / Piece / EmotionLog / Ranking / Self Structure**
- `01C` は **Account / Subscription / ProfileCreate / support / rule / test / script**

この分け方は repo 軸ではなく、**Cocolon 内で一緒に動くものを同じ章に置く**ためのものです。

# 3. 全体 flow

`App root` → `RN screen / component / hook` → `frontend API boundary` → `backend public API` → `gateway / service / store / ASTOR / worker / access policy` → `read-side API` → `RN display`

# 4. 今回の current fact

- `Home write` は backend 内部 `home_gateway` に集約される
- `Home read` は `GET /home/state` を持つ
- `read-side visibility` は `access_policy` に寄っている
- `ProfileCreate` は current public 名として残る
- `MyModelCreate` は public route / public screen 名から外れ、legacy canonical 名が一部に残る
- `inventory` は廃止し、本文側に coverage を持たせる

# 5. 章と対象件数

- `01A`: 77 files
- `01B`: 103 files
- `01C`: 172 files

# 6. 任意の 1 ファイルから辿る時の原則

1. そのファイルの **system** を見る
2. **直接関係ファイル** を追う
3. **このファイルを直接参照するファイル** を追う
4. **修正時に必ず同時確認するファイル** を開く
5. 国家システムに関係する変更なら `02` 系へ移る
