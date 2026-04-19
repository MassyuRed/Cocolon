---
doc_id: cocolon_national_system_full_coverage
title: "Cocolon 国家システム資料"
revision_date: "2026-04-19"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 140
  mashos-api: 265
purpose: "華恋が国家システムに関係する全ファイルを Input -> Save -> Dispatch -> Snapshot -> Worker -> Publish -> Read -> RN の流れで復元できるようにする"
coverage:
  included_files_total: 303
  included_files_cocolon: 98
  included_files_mashos_api: 205
---

# 1. 1行定義

ここでいう国家システムは、**入力保存 API 群 + dispatch / gateway + material snapshot + queue + worker + publish / access policy + startup snapshot + read-side API + RN surface** をまとめた運用全体です。  
backend だけで終わらず、**RN surface まで含めて state の流れを固定する**ものとして扱います。

# 2. 現在の国家システム flow

`Input Gate` → `Save API` → `Dispatch` → `Snapshot / Queue / Worker` → `Publish / Access Policy` → `Read API / Startup` → `RN display`

補足:
- `home_gateway` は Home 由来 write の fan-out 集約点
- `startup_snapshot_store` は startup 断面
- `access_policy` は read-side visibility / tier 判定の集約点
- `EmlisAI` は保存直後 immediate reply path を持つ

# 3. 章と対象件数

- `02A`: 59 files
- `02B`: 134 files
- `02C`: 110 files

# 4. 読み方

- `02A` で **入力・保存・dispatch** を追う
- `02B` で **snapshot / worker / publish / read / RN** を追う
- `02C` で **contract / boundary / test / guard** を追う

# 5. current drift / 注意点

- frontend 文字列に現れる endpoint のうち、backend route 側に直接見えないものは drift 候補として 07 に別記する
- ProfileCreate は current public 名だが、canonical table 名には `mymodel_create_*` が残る
- 旧 compat import path はまだ live なものがあるため、消したい時は呼び元を全部確認する
