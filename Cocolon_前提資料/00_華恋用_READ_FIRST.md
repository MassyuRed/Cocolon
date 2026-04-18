---
doc_id: cocolon_karen_read_first
title: "華恋用 READ FIRST"
revision_date: "2026-04-18"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 250
purpose: "華恋が EmlisAI 実装後かつ Piece / ProfileCreate / DeepInsight 再編後の current snapshot を前提に作業できるようにする"
---

# これは何か

この一式は **Mash 向けの説明資料ではなく、華恋が作業前提を引き継ぐための運用資料** です。  
今回の更新では、このセッションで行った **PR1〜PR5** の反映後を current snapshot として固定します。

対象スナップショットは次です。

- `Cocolon` : 133 files
- `mashos-api` : 250 files

今回の最重要更新点は、EmlisAI だけではありません。  
**Home を唯一の write gate として扱い、Piece / ProfileCreate / DeepInsight の意味を再定義した**ことです。

# 最初の読み順

1. `03_Cocolon_命名体系.md`
2. `01_Cocolon_全体構造資料.md`
3. `02_Cocolon_国家システム資料.md`
4. `07_Cocolon_最新スナップショット差分.md`
5. `04_Cocolon_変更テーマ別チェックリスト.md`
6. `05_Cocolon_ルールファイル索引.md`
7. `06_Cocolon_ファイル名変更保留台帳.md`
8. `inventory/focus_map.yaml`
9. 必要な inventory / route map / registry

# 今回の再編で覚えておく一言

**Home が唯一の write gate、Piece は emotion-generated original reflection のみ、ProfileCreate は Account 内の孤立資産、DeepInsight は current live flow から外した。**

# current snapshot の operational conclusion

## 1. EmlisAI は `input_feedback.comment_text` 契約を壊さない

Input surface は今も `input_feedback.comment_text` を読む前提です。  
EmlisAI を変えても、**public response から `comment_text` を消さない**こと。  
増やしてよいのは additive meta（例: `input_feedback.emlis_ai`）だけです。

## 2. Home だけを国家システムの write gate として扱う

current live flow で国家システムへ入る primary write は次です。

- 感情入力
- Today Question 回答
- Piece preview / publish（emotion-generated only）

**ProfileCreate と DeepInsight を write gate として再導入しない**こと。

## 3. Piece は current input だけから作る

Piece は旧 Reflection 全体の総称ではありません。  
current snapshot では **Input 起点の emotion-generated original reflection** を Piece として読むこと。

- Free: 月 5 回
- Plus: 月 30 回
- Premium: 無制限

## 4. ProfileCreate は Account 内の孤立プロフィール資産

ProfileCreate は固定プロフィール表示 / Account での編集 / 他ユーザーへの自己紹介のための資産です。  
**ASTOR material snapshot / self structure analysis / ranking / Piece discovery の材料として扱わない**こと。

ただし、internal canonical には `MyModelCreate` が残ります。  
UI 名と internal canonical を混同しないこと。

## 5. DeepInsight は current live flow から外した

Analysis 側の入口と public route registration からは外しました。  
ただし、**physical file / helper / data は repo snapshot に残る場合がある**ため、file 存在だけで live route と誤読しないこと。

## 6. Piece count / ranking は legacy key を維持している

current visible flow では Account / Ranking の Piece 数を generated Piece として扱います。  
ただし public shape では **`mymodel_questions_total` / `questions_total`** など legacy key を維持しているため、  
**「意味」と「response key」を分けて読む**こと。

# この資料群を更新する時の最低手順

コードを触ったあと、最低でも次は更新します。

1. `07_Cocolon_最新スナップショット差分.md`
2. `inventory/current_snapshot_changed_files.csv`
3. `inventory/focus_map.yaml`
4. `inventory/mashos-api_inventory_full.*`
5. `inventory/backend_route_inventory.csv`
6. `inventory/public_api_registry.csv`
7. route / contract / field semantics / orphan cleanup に触ったなら `05_Cocolon_ルールファイル索引.md`
8. rename / leftover cleanup の判断を進めたなら `06_Cocolon_ファイル名変更保留台帳.md`

# 現時点の運用注意

- EmlisAI greeting-state は `emlis_ai_greeting_state` DB 前提を持つ
- DeepInsight public route は外れていても physical file が残る場合がある
- `/mymodel/qna/trending` と `/mymodel/qna/holders` は current frontend の visible flow では使っていないが、legacy public route は残る
- Piece count / ranking は legacy key を維持しているため、DB / RPC / projection 側の意味同期を将来変更時に必ず再確認する
