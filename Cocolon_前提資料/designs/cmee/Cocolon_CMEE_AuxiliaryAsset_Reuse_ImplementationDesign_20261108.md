---
doc_id: cocolon.cmee.auxiliary_asset_reuse.implementation_design.20261108
title: "CMEE 補助経路の活用作業 — 全必要資産の回収・改修・商品接続 詳細設計"
revision_date: "2026-11-10 JST"
decision_owner: Mash
implementation_owner: Karen
status: AR01_UNRESOLVED_AR04_GENERAL_PROSE_REGISTER_LIMITED_CONNECTION_UNADOPTED
working_lineage: "Cocolon PR30 / mashos-api PR3"
product_spec_owner: "../../00_cocolon_current_product_and_state.md and each core canonical owner"
continuation_instruction: "補助経路の活用作業を進めて"
current_next: AR-04
runtime_effect_of_this_document: 0
---

> **11/10・AR-04最新：** 固定c634・追加学習0で新しい架空8入力を確認し、source資格5／資格外3を分離。資格5＋既使用対照2の実4B7応答を無修補で再受領し、API209b4a27の既存S7 model比較で、完全な本人表記・対象を保つ「たいです／たい」と未決定の場所等の文体差を限定接続、CMEE4→6採用／7。新規5は2→4採用、対照2と旧46本文は不変。新隔離SQL21は18保存／3拒否、保存後0生成。17file1082 PASS／既存warning1。反復表現、理由文1の未判定、source資格外3は残る。元GPU提供46144へ復元・health／前後control一致、c634通常未採用／selector OFF・正式0/3。 [今回の実結果・範囲・次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general-prose-register-20261110)。


# CMEE 補助経路の活用作業 — 詳細設計

## 0. 今回の決定と、この設計の責任

2026-11-08、Mashは、華恋が必要と判断した旧補助経路の能力・資産を、改修規模を理由に諦めず、使える形にして最大限活用することを承認した。先に挙げた数項目だけに対象を限定せず、必要な資産すべてを回収する。その実装・検証・接続を詳細設計し、GitHubへ保存し、後日の短い指示から継続できるようにすることが今回の依頼である。

本書は、その活用方法、移管先、変更箇所、実施順、完了条件、再開位置の正本とする。EmlisAI・Piece・分析構造の商品仕様、一般作業規則、GitHub反映契約を二重所有しない。現在の商品契約に合わせて旧能力を改修する。古い文型や5段packet・3本文を新natural応答の必須形式へ戻さない。

**目的は、現在の返答・作品・地図の意味保持と伝わり方を改善することである。** 原文や実行対象の取り違えを防ぐ既存能力、問題の共通原因を見つける知識、修正前後の比較、履歴・訂正・失効の扱いも、この目的に接続して回収する。回収は、既存symbolの直接利用、責務の移管、必要部分の抽出、検査例・失敗知識の移植、現owner内での再実装を含む。

元の承認・実行・証明を管理する外殻は現役経路へ戻さない。その中に使える比較・計測・再現入力の部品があれば抽出対象にする。「外殻を退役」と「内包する能力まで全廃」を同一視しない。必要な能力は規模で除外せず、不要な統制は規模に関わらず再開しない。

最初の設計保存時点では設計と参照導線のみで、製品実装等は未開始だった。その後Mashの続行指示でAR-01を着手した。現在の実装・実生成・不採用と未完了は§11を正本とし、最初の設計保存を活用完了へ換算しない。

## 1. 正本、確認版、現在の不足

### 1.1 読む原本

- [全体現在地](../../00_cocolon_current_product_and_state.md)、[current rules](../../work_attitude_rules_for_karen/CURRENT_RULES.md)、[恒久incident](../../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)。
- [8/14 全体活用計画](../../Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.md)、[旧32系列の監査](../../audits/emlis_ai/Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md)、[NLSv3→CMEE Disposition D01–D51](NLSv3_to_CMEE_Disposition_Phase1_20260817.md)。
- [CMEE Final Design](Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)、[詳細設計入口](v1/00_read_first.md)、[CMEE map](../../current_structure/04_cmee_current_structure.md)。
- [Emlis map](../../current_structure/01_emlis_ai_current_structure.md)、[Piece map](../../current_structure/02_piece_current_structure.md)、[Analysis map](../../current_structure/03_analysis_current_structure.md)。
- [最新weekly §17–19](../../weekly_reviews/Cocolon_Weekly_Review_20261107.md#three-core-quality-backlog-20261108)、[観測学習の目的](../../observation_learning/README.md#observation-learning-intent-and-assumptions)。
- Karen-Diaryと構造知識は判断の前提として照合する。私的会話を公開設計へ転載せず、日記や知識の存在を実装済み・学習利用許可へ変換しない。

調査固定点はCocolon PR30 `89a9594dbeb91668436f82b48832025bab49a0e1`、API PR3 `497f7008fec8935885d09d2e430499892189b5bb`。これは本書の確認版であり、後日の実行版を固定する命令ではない。再開時にfresh headと対象差分を確認する。mainが古い間は、mainだけから現在を判断しない。

### 1.2 現在の実利用と不足

API pathは、特記以外 `ai/services/ai_inference/` を起点とする。

本書の短縮名は次のpathへ解決する。文脈のない同名fileを新規作成しない。

| 短縮名 | repository内の場所 |
|---|---|
| `source_kernel.py`、`emlis_thread_source.py`、`emlis_thread_history.py`、`emlis_answer_update.py`、`emlis_question.py`、`emlis_stage1_*`、`piece_source.py`、`piece_v1c.py`、`piece_semantic_admission.py`、`preparation*`、`contracts.py`、`engine.py` | `ai/services/ai_inference/cocolon_meaning_experience_engine/`配下 |
| `cores/analysis/*` | `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/`配下 |
| `emlis_ai_*.py`、`emlis_thread_service.py`、`emlis_thread_store.py`、`emlis_thread_config.py`、`piece_v2_generation.py`、`analysis_cumulative_service.py`、`analysis_observed_service.py`、`analysis_semantic_map.py` | `ai/services/ai_inference/`直下 |
| `cocolon_text_generation_core/*` | `ai/services/ai_inference/cocolon_text_generation_core/`配下 |

| 現owner | 確認済みの接続 | 本作業で減らす不足 |
|---|---|---|
| `cocolon_meaning_experience_engine/natural_reply.py` | `prepare_natural_reply`→`admit_emlis_thread`→原文・履歴・本人回答の出所確認と独立Safety。`validate_reply`は型、source参照、非空、長さ、内部記号等を確認 | 現自由文の主体・対象・否定・時点・認識・留保を、完成した本文で意味比較する責務が未接続 |
| `emlis_thread_service.py` | naturalを`_process_natural`へ先に分岐。初回本文の保存・非生成再読。`_hydrate`は`related_context`を使用 | 旧Engineの意味更新・本文逆検査を通らない。新naturalでの任意問い／回答後更新／frame訂正と分析材料が未完。観測artifactは`analysis_state=NOT_GENERATED` |
| `source_kernel.py` | 旧`normalize_emlis_current_input`、`build_evidence_ledger`、原文locatorを実利用 | 原文位置の一致と、主体・否定等の解釈の正しさを区別したまま現出力へ生かす |
| `emlis_stage1_response.py`と旧grounded owner群 | 意味・計画・Sentence Surface・Reception・本文逆検査の責務継承あり | 専用文型／計画依存を分解し、現自由文へ適合。旧作者を第二の通常作者にしない |
| `piece_v2_generation.py`、`piece_source.py`、`piece_v1c.py` | CMEE Engine、旧意味ブロック、原文→plan→本文、独立意味保持検査を実利用 | 有限文法、単独伝達、補足を使うrefined、画像までの同一意味。既存画像・保存の成功は継承 |
| `analysis_cumulative_service.py`→`analysis_semantic_map.py`→Engine→Analysis admission/compiler/realizer | 4B関係mapをCMEE本体へ統合。通常保存・実機表示に到達した記録あり | 引用一致だけでは残る解釈誤り、本人基準・記録間関係・長履歴・補足訂正・IF/Saved |

履歴候補取得は現naturalで既に接続されている。「履歴未接続」と過去資料の文をそのまま使わず、関連候補取得と妥当な履歴理解の残件を分ける。source Safetyの存在を、完成本文の意味検査済みと呼ばない。

## 2. 回収の単位と採否

回収単位は「能力＋実装／知識／検査例＋現在の商品での用途」。file数やimport数を回収率にしない。旧32系列、D01–D51、8/14計画の各層を付録で照合し、同じ資産の重複計上を避ける。D51件は46責務・資産＋5判断／不足であり、51個の実装moduleとは扱わない。

| 処置 | 実施方法 | 完了の観測 |
|---|---|---|
| 継続利用 | 現ownerの実利用を維持し、後続との不足だけ修正 | 現呼出しと、同じ原情報からの商品結果が保たれる |
| 改修して移管 | 現目的へ合う比較単位・入出力・検査例に変え、既存ownerへ接続 | 現商品出力の誤り減少／更新成立、保存再読、必要回帰 |
| 知識・検査例として利用 | 旧失敗・変異・修正前後・比較条件を現在の教材／評価へ移す | 実モデル／作者を直し、再発と別題材への影響を確認。知識登録だけで閉じない |
| 内部部品のみ抽出 | 比較・計測・再現性の必要部分を使い、元のcontrollerを起動しない | 対象商品試行で取り違えや不要な再実行を防ぎ、実出力確認まで進む |
| 履歴保持・非採用 | 重複作者、旧運用chain、使わない方式をGit履歴に残す | 復活させず、採用した現ownerが明確。未精査を非採用理由にしない |

「必要な資産すべて」は本表を固定した短い選抜にしない。実装中に有効な旧symbol、失敗vector、比較器が見つかれば、本書の対応行へ追記して同じ商品単位で利用する。新しい独立台帳・scanner・承認段階は作らない。未精査symbolは未精査と書き、存在／全文理解／商品効果を分ける。

## 3. 共通の入力・意味・商品の条件

1. `memo`と`memo_action`の片欄／両欄、9カテゴリの複数選択、5感情それぞれの弱中強・同時選択を保持する。自己理解は通常感情と排他的で強度UIなし、wire mediumは互換値。欄名だけで実行済み行動を認定しない。
2. 本人／他者／引用者、行為者／対象／感情の所有者、事実／本人認識／推測／希望／予定／未実行／不明を分ける。記録日時を出来事時点へ置き換えない。
3. 原入力、適格な本人回答、訂正・撤回、本人frame feedback、閲覧権利内の履歴は別source。AIの問いは文脈、AIの応答・Piece・分析推定は生成物として扱う。
4. Free当回、Plus適格本人履歴、Premium本人frame・本人続行等の既存権利を継承する。原入力保存を生成成功へ従属させず、補足を新規入力数／国家event／課金へ再加算しない。
5. 原文一致・quote・hash・型成立は意味の正しさを保証しない。modelが自己申告したclaimや根拠refも検証前の候補である。
6. Emlisは本人宛、Pieceは本人の作品、分析は観測・解釈・IFの区別を持つ。共通化は意味と出所の必要部分まで。声・選択・作者・保存・公開の責任を各coreに残す。
7. 短い受取り・一度の言い換え・自然な省略を許す。文数、深さ、新発見、助言、問い、観測対フォロー比の固定を加えない。必要な意味を残す責任と、原入力全部を再掲する義務を混同しない。
8. source Safety、生成物の危険な断定・漏出、意味保持、商品としての自然さは別の判断。旧Safety ownerと公開境界を保つ。新意味検査で通常Safetyを解除しない。

## 4. 実装する責務と接続の形

### 4.1 現ownerへ組み込む構成

| 責務 | 入力／出力 | 実装先と境界 |
|---|---|---|
| 有効な本人sourceの確定 | 原入力・回答・訂正・撤回・権利→現在有効なsource集合 | 既存thread source/history/answer_update、Piece saved source、Analysis source adapter。modelに権利や有効版を決めさせない |
| sourceの意味候補と根拠 | source→主体・述語・対象・否定・時点・留保等の候補 | 既存意味ownerから使える抽出を回収。確定できない項目は未確定。原文位置だけから意味を確定しない |
| 生成 | 現sourceから本人宛本文／作品／map候補 | 現natural・Piece作者・Analysis compiler/realizerを使う。旧作者との二重通常生成を追加しない |
| 完成物の読み返し | 実際の完成本文／図→その出力が述べた意味の候補 | 作者のplanを正解としてコピーせず、完成物そのものを読む。有限reader／候補modelの限界を明記 |
| 比較と失敗局所化 | source意味と完成物意味→一致範囲・衝突・未判定 | 下記の限定された比較。誤り原因を教材・指示・意味owner・作者の修正へ返す |
| 保存と再読 | 採用した同一成果物と既存lineage | 現store・artifact・RPC。保存再読で新生成を行わず、旧確定保存物を黙って置換しない |

先に巨大な共通抽象APIを完成させる工程は置かない。Emlisで実商品改善と必要な共通責務を一緒に実装し、Piece／Analysisで二度目の実用途が成立した時に共有境界を確定する。旧回路を呼ぶだけのwrapperをCMEE統合と呼ばない。

### 4.2 比較に必要なprivateデータ

次は新しい公開DTOやDB schemaではなく、実装時に既存型へ対応させる論理項目である。新private型が必要なら現CMEE package内の最小型にし、persistent schemaへ無条件追加しない。

| 論理項目 | 持つ情報 | 注意 |
|---|---|---|
| Review context | core、元source集合と版／owner／権利、実本文と作者版、比較方式版 | 既存guard／source_prefix／artifact identityを参照。新しい証明chainを作らない |
| Meaning claim | source role、speaker、actor、predicate、arguments、polarity、time、modality、epistemic status、感情所有、scope、原文／本文位置 | 各項目に既知／不明と根拠。model推定を本人確認済みへ昇格しない |
| Comparison item | 比較対象、確認できた関係、衝突理由、根拠位置、未判定理由、検査対象範囲 | source/本文のどちらが誤った読取か未確定なら、確定衝突へしない |
| Comparison result | 判定、比較済み範囲、未対応範囲、source／本文の対応、実行時間 | 全体の品質点や一般正解率を作らない。機械所見は正式Product Readではない |

### 4.3 判定の契約

| 判定 | 意味 | 動作 |
|---|---|---|
| `CONFLICT` | 確認できたsourceと完成物の間に、説明可能な主体反転・肯否反転・時点改変・不確定の確定化等がある | 開発では原因を修正して正しい実出力まで確認。通常での拒否は実証済み範囲だけに限定 |
| `NO_CONFLICT_IN_CHECKED_SCOPE` | 明記した対応範囲では衝突を見つけなかった | 未対応範囲を併記。全文意味合格・安全・商品受入れとはしない |
| `UNASSESSED` | 読取未対応、意味が曖昧、比較根拠不足、補助処理の時間切れ等 | 誤りと断定せず、既存source／Safety／形式検査の判断を維持。分析材料の資格を付与しない |

どの判定にもcoverageを残す。部分比較の正常を全文正常へしない。source owner不一致、失効、改竄、認証・Safety不成立は`UNASSESSED`へ弱めず、既存ownerで拒否する。比較器が意味を読めないことと、元情報が不正なことを分ける。

モデルによる読取候補だけで通常応答を強制拒否・自動修復しない。同じmodelの生成と自己説明が一致しても独立の正しさは成立しない。機械で確定できる範囲、候補判定、人間の原文／本文読解を分ける。

### 4.4 比較する意味と、正常とする差

| 境界 | 検出する意味変化 | 正常として保護するもの |
|---|---|---|
| 主体・所有者・引用 | 他者の経験を本人へ、本人推測をEmlisの事実説明へ移す | 省略しても指示先が明確な文、直接話法と間接話法の妥当な変換 |
| 否定・述語・scope | 行為未実行を予定未定へ変更、現在否定を肯定へ変更、否定範囲の移動 | 同じ否定を自然に言い換える、返答で触れない出来事を省く |
| 時点・変化 | 記録時刻への置換、事前認識を事後認識へ、再参加を初参加へ | 元の順序を保つ文統合、出来事と現在の受取りを区別する |
| 認識・不確定 | 「そう感じた／まだ不明」を確定事実・確定因果へする | 原文の留保保持、Emlisの受取りとして明示する範囲 |
| 関係・因果 | 共起だけから原因・約束・義務・人格を作る | 原文にある理由・条件・対比、原文が確定しない両立 |
| 感情・強さ | 本人の選択と他者感情を混ぜる、複数感情を一つへ固定 | 選択と本文の時点差、自己理解の互換medium、全感情を毎回列挙しない自然さ |
| 受取り・声 | 本人の内語をEmlisの返事として貼り返す、一般共感の反復 | 短い受取り、必要十分な言換え、問い・助言を出さない返答 |

旧文型への一致は補助情報にとどめる。旧二段見出し、行数、anchorの字面、固定のEmlis文句を新naturalの合格条件にしない。未出力の項目は、各coreが実際に必要とする意味の欠落である時だけ不足へ数える。

### 4.5 読取・対応付け・比較の処理順

1. source側は、admission済みの完全な原文から、旧`SemanticFrame`、`EvidenceRef`、proposition等を使って候補を作る。原文の逐語位置、項目ごとのspeaker／actor／time／否定scopeを保存する。有限parserが確認した範囲、人間が確認した教材上の範囲、model解釈だけの範囲を混ぜない。
2. 出力側は、完成した本人宛本文の各文・節・引用を読む。元の作者planから同じ意味をコピーしてreader結果にしない。二人称、省略された本人、Emlisの一人称、引用者を解決できる範囲で分け、複数解釈なら保持する。
3. 述語・対象・scope・時点・参照先の対応候補を列挙する。単語共通数だけで一つに決めず、対応先が一意でない時は未判定にする。同一原文の別sourceや、別時点の同じ表現を混ぜない。
4. 対応した各意味軸を比較する。主体・対象・時点を揃えた上で肯否等が両立しない時にだけ`CONFLICT`。単に根拠が見つからない、文法未対応、意味が省略された、という理由で確定衝突にしない。
5. source側の未出力範囲と、出力側の未評価命題を別coverageにする。未出力が商品固有の必須意味であれば不足として修正へ戻すが、短い受取りに全文再掲を要求しない。
6. 対応済みの純粋readerでは、同じsource・同じ本文・同じ方式版から同じ比較結果を返す。random IDや実行日時を意味判定に使わない。時間切れ時は終わった範囲だけを報告する。

例として、「参加しなかった」から同じ主体・対象・時点の「参加した」は確定衝突にできる。一方、不安と期待が書かれた入力への不安だけに触れる返答は省略であり、反対の断定ではない。「期待はなかった」と実際に述べた場合は別に比較する。以前と今の気持ちは時点が違えば併存できる。

旧`guards/grounding.py`、`must_keep_coverage.py`、`template_echo.py`等の字面・ngram・類似・反復の知識も抽出対象とする。ただし、原文類似度が低いから意味不一致、高いから意味正解、とはしない。正常な短い受取りを一律復唱FAILにせず、実本文と集合の反復傾向を読む。

## 5. Emlis自然応答への実装詳細

### 5.1 最初の変更位置

- `natural_reply.py::prepare_natural_reply`：既存admission・Safetyを保ち、現入力材料を意味比較にも同じ版で使う。sourceの全内容を本文への再掲義務へしない。
- 同`validate_reply`：現形式契約を維持する。形式検査と意味比較を別責務とし、既存返却型を不用意に変えない。
- `emlis_thread_service.py::_process_natural`：完成candidateを形式確認した後、OBSERVATIONを確定する前に比較する接点。比較を通ったと偽るreceiptを作らず、既存受領候補と採用済み本文を区別する。
- `source_kernel.py`、`emlis_thread_source.py`、`emlis_answer_update.py`：原文根拠・source role・有効版の既存owner。旧grounded plan／surface／gateから必要な比較・reader・vectorを抽出する。

候補private関数は `compare_reply_meaning(context, reply)` 相当。名前・型の最終形は実装時に既存責務と照合する。これは新service、外部API、常駐checkerではない。重複する現helperがあれば改修して使う。

### 5.2 開発適用から通常適用へ

1. 現提供版と、現在残る誤読／正常例を同じsourceで生成・保存する。旧失敗群と現6境界、既にCPU準備された語順／二欄8教材を再利用する。旧36教師と保存候補の由来を保持し、未採用候補を通常重みにしない。
2. 旧資産から比較責務を入れ、誤りだけでなく正常な省略・言換えも読む。誤検出と見逃しを原文・本文から分類する。readerの指摘が誤っている場合はreaderを直す。
3. 検出した共通原因を、既存教材・指示・意味owner・作者へ戻して修正する。検査を厳しくして無出力が増えただけでは終了しない。修正後の実返答と既成功の保持まで同じ単位で確認する。
4. 実証済みの検査範囲だけ通常保存前へ採用する。追加model callが必要な方式は、まず既存試行の中で比較し、精度・誤拒否・時間・費用を測る。未実証の自由文readerを通常全件の必須条件へしない。
5. 採用版で保存した同じ本文を非生成再読する。旧completed保存物は当時版のまま読み、現checkerが増えたことを理由に一括再生成しない。

通常のcandidate生成数は現行どおり1、追加model callは既定0。候補比較／多様性／tournament資産は開発時の明示された有限比較へ先に使う。通常で複数生成する採用は、具体的な品質改善と既存応答期限・費用内での実証がある場合だけ行う。暗黙の無限再生成や別provider fallbackは追加しない。

### 5.3 中断・保存・失敗の扱い

- 受領済みcandidateがある再開では、同じsource／contextを確認し、純粋比較だけを再開する。model HTTPを再送しない。受領記録を意味合格と解釈しない。
- 比較結果を将来永続化する必要がある場合は、既存private OPERATION等の保存先と版互換を先に確認する。新table・RPC・公開fieldは本書から自動作成しない。未保存所見を過去に実施済みとしない。
- 通常強制拒否を導入する際は、確定衝突だけ既存の失敗／未生成処理へ対応させる。入力保存・既存の保存応答は保護し、generic filler、旧template、本文の改竄を代わりに返さない。
- 未対応文法・曖昧さ・比較予算不足は、そのscopeの`UNASSESSED`として記録する。source認可・Integrity・Safety・形式エラーは従来のエラーのまま伝播させ、広いcatchで未判定へ弱めない。予期しない比較器の不具合は、privateな`CHECKER_ERROR`等の別理由で未実施範囲とともに残す。比較成功や全文正常の件数へ含めず、比較器の修正対象にする。例外本文や本人原文をlogへ出さない。
- 現在のprovider timeout、thread deadline、残時間予約を尊重する。比較のため新しい待ち時間を無条件上乗せしない。候補model方式の通常採用前に待ち時間とGPU競合を実測する。

### 5.4 保存reportと時間の実装契約

private reportを保存する場合の最小情報は、既存`source_prefix_ref`／`context_ref`、materialとreplyのdigest、比較方式版、参照したsource dependency版、各claimの本文位置・根拠・評価軸・判定・理由、source／reply各coverage、未判定理由、実行時間である。既存identityで表せる項目は参照し、別の恒久証明系列を作らない。本人ID／原文／本文をpublic logへ出さない。

現readerは受領したreply辞書を`NaturalReply(**reply)`として再構築するため、新reportをその辞書へ任意keyとして混ぜない。既存private payloadのsibling等へ置けるかRPC／serializer／再読で確認する。採用時は同じsource・context・replyに対応するreportと本文を既存commit境界で保存する。古い保存物にreportがなくても、破損や意味検査済みへ読み替えない。

調査版の自然応答providerは240秒、service attemptは270秒、保存用の残時間予約は既存3秒。これらを本書で延長しない。実装では現在のdeadlineから保存余白と比較予算を引き、providerや比較に使える時間を計算する。CPU比較の予算値は実測で決め、正規化・認可・guard確認を予算不足で省略しない。新readerの時間、追加call数、誤拒否／未判定は未測定である。

## 6. 本人回答・訂正・履歴と分析材料

### 6.1 問い・回答・訂正の一往復

旧Q1/Q3の問い・skip・終了・本人続行・訂正・撤回・frame処理を回収し、現naturalへ接続する。問い機構を新設しない。Free／Plusはthread全体0..1、Premiumは本人続行による逐次最大3の既決仕様を保つ。初回を全て深く読む完成待ちにせず、一往復で必要な意味を更新する。

旧解釈、本人の肯定／修正／否定／撤回、新有効意味を比較し、訂正された対象だけ更新する。訂正に含まれない出来事・時点・感情を消さない。訂正の対象が曖昧ならmodelだけで全過去を失効させず、既存の一点確認／不明保持へ戻す。無効になったsourceからのclaimや問いを現在へ再利用しない。

現naturalは本文内の問い禁止を指示し、`_process_natural`の最後で`COMPLETED`へ固定する。AR-02では次の既存event／stateへ接続する設計とし、本文の疑問符を許すだけの改修にしない。

| 操作・判断 | 接続する処理 | 保存後の状態 |
|---|---|---|
| 初回に必要な一点を確定できる | 有効本人sourceと意味状態から既存`question_candidate`／bindingを使い、対象・根拠・roundを確認。自然本文と別`QUESTION` eventを既存`_finish(observation=..., question=...)`で同時保存 | `AWAITING_ANSWER` |
| 初回に問い不要 | 自然本文だけを同じ保存境界で確定 | `COMPLETED` |
| 本人が回答する | 既存ANSWER保存→`REFINING`。原入力を保ち、新しいsource_prefixに対応する更新意味と自然本文を生成・比較する | 更新本文と、次の問い／終了の既存状態 |
| Premiumの次の問い候補 | 現`continuation_question`と本人続行待ちを使う。候補を作っただけではQUESTIONを送らない | `AWAITING_CONTINUE`→本人continue後だけ次QUESTION |
| skip／stop／訂正／撤回 | 現actionと更新ownerを再利用し、対象sourceと残る意味を確定 | 既存契約に従う終了／更新状態 |

このための有効意味checkpointと自由原文→旧question対象のadapterは未実装であり、AR-02内で既存の詳細設計02／schema05へprivate版と互換を具体化する。旧有限checkpointを全自然応答の必須入力にしない。既に保存されたNaturalReply／QUESTION／ANSWERを壊さず、新状態が旧clientで読めるかAPI／RNの既存契約で検証する。

### 6.2 履歴の関連性と版

現`related_context`と保持期間・件数選択を継承し、P5／P6の連続性・差異・未確定・版比較を、今回に関係する意味を読むために使う。キーワード一致を同じ場面・同じ役割・同じ気持ちの証明にしない。履歴言及率を上げることを目的にしない。

本人切替、権利変更、削除・秘匿・撤回、source guard変更時は、現在の利用資格と生成前の版を既存ownerで再確認する。取消済み材料をcacheから再利用しない。保存済み作品／月次の当時性と、現在表示の再認可はそれぞれの既存契約を保つ。過去保存物の消去や履歴の書換えを本作業から自動実行しない。

### 6.3 Emlisから分析への材料

新naturalの`NOT_GENERATED`を、本人sourceから根拠を持つ観測材料を生成できた時だけ更新する。Emlisの返答を再解析して本人の事実にしない。引き渡すのは原入力・適格本人補足・有効な訂正と、根拠・未確定・source roleを保った意味候補である。

限定意味比較reportができただけでは`analysis_state`を更新しない。実際の意味材料artifactのschema・参照・生成成功を確認する。意味材料の生成状態、Analysis mapの生成・保存状態、比較reportの有無は別である。現thread.dataとOBSERVATION.artifact双方に関連状態があるため、将来変更時は同じ保存境界で整合させる。

Analysisの既存source adapter→semantic admission→compiler→唯一realizerへ渡す。元記録ID／版／owner、両欄、カテゴリ、感情と強度、時点、否定・留保、解析済み／未解析範囲を保持する。原文引用が一致しても、ROLE／判断／選択／因果の解釈は別に確認する。

材料生成が失敗しても、保存済み入力や自然応答を失わない。分析は未生成／未解析を保持する。独立したAnalysis通常経路が有効な時、Emlis材料の全面完成待ちにしない。EM-04とAN-02／08のsource責任を一致させる。

## 7. Piece・分析へ適用する詳細

### 7.1 Piece

**11/10・API1ce24b8c／全文有限動作の生成条件：** `piece_model_source._source_action_constraint`は、既存`piece_source._finite_self_person_action_account`の全文資格と`natural_reply_meaning._clauses/_FORMS/_arguments`の一意な完全節読取を再利用する。各source partの全sentenceが既知の明示SELF・頼む／相談する／伝えるの事実過去として成立した場合だけ、欄別`control.authoring_constraints.field_slots.<key>.required_actions`へ本人表記、原文活用形／述語、肯否、時点、事実性、voice、相対日、格と相手／対象、scalar範囲を渡す。その適格partの受動文を含むfieldでは、各有限eventへ原文source_literalと既存MeaningWitnessのsubject／agent／counterpartを同じfield／scalar範囲へ追加する。同fieldの能動eventにも固有の役割を対応させ、同partの別fieldは独立させる。役割は否定された述語内の関係であり、依頼の実在、本人の拒否／承諾、対象作業の実行は推論しない。active-only fieldは旧wireを保持する。評価・感情・opaque文・未決定を含む混在partは従前の送信内容を保持し、既存の名前・評価条件も失わない。原requestからのPreparedRequest再導出一致、原入力7fieldと本人の補足の分離、SYSTEM、条件なし既定送信bytes、独立採否／S7、保存後非生成再読、公開DTO／DB、selector既定OFFは維持する。期待正文、生成後修補、新しい受理文法、別作者は追加しない。

**11/9・混在本文と欄／補足の語り手：** 旧S7の全part・source／plan／欄境界と、既存有限本文readerの完全key比較を同じKEEP検査へ接続。明示SELF・単一の既知能動事実過去だけとし、該当nodeの名前・参照・scopeを迂回しない。原文保持のopaque文と、別欄の意味を保った語尾編集を併用する。通常nativeのliteral条件と公開契約は保持。欄先頭／本人補足の語り手と公開役割は独立教材で候補修復し、意味退行を拒否・未採用のまま記録する。

**11/9・名前抽象化と過去2動作の独立読取：** 原文の明記役割を学ぶ新24行で作者候補を改修。旧body inverseの本人継続と既存finite活用／格の必要部分をPiece完成本文の読取へ移し、単一欄・明示SELF・2能動過去・一つの読点を全節照合する。肯否は動作ごとに保持し、別本人／条件／受動／非過去／別欄借用は拒否する。原文・期待正文・raw・採否閾値を緩めず、結果は§11とtrialを正本とする。

**11/9・原文から成立した生成条件の回収：** 原requestと再導出したPreparedRequestの完全一致を確認し、既存本人評価frame・公開役割bindingをsource／欄／scalar位置を保持したprivate `control.authoring_constraints`へ投影する。原文・SYSTEM・期待正文・採否検査は変更せず、sourceの意味条件だけを作者へ渡す。設定された4B providerに限って通常preview／共有初回取得へ接続し、未対応は条件を捏造しない。独自callback、同key共有、保存後非生成再読、selector既定OFFは維持する。実効果・限界は§11と既存trialへ記録する。

**11/9続行・本人の一人称と評価対象の伝達：** 変更は既存private model reader・その一人称検証・既存workflowを起点とする。`piece_model_source.SYSTEM_MESSAGE`の追加2指示は比較で不採用となったため完全撤回し、元ad417と同じSYSTEMを維持する。private model readerは意味上のactor=SELFを維持したまま、各欄に書かれた一人称を別の比較要素として保持する。同一欄の既に成立した本人継続でだけ、その直前の本人表記を省略読取へ用い、別欄からの本人表記借用・raw補修はしない。評価対象「は」の受理文法は拡張しない。公開型・DB・source資格・原入力／補足・S7／native経路の既存保護境界は変えない。 既存FOCUS文法が認定する原語順と終端copula組、およびnativeで成立済みの明記した同本人の隣接自己評価の主語省略を、model private読取へ限定接続した。native既定の意味保持契約は不変である。参照先・全scope・本人視点・元一人称・評価base／程度／肯否／時点／留保を独立照合し、先頭省略・にとって脱落・別field・OTHER・異なる本人表記・肯否変更等は拒否する。既存evaluation-reuse testの同作者省略を常時拒否する1期待だけを、このnative由来の正期待へ整合させた。同じ新22rawは16→20採用、旧22rawは最終readerでも16採用。未知の語義や意味欠落を許可する差分ではない。

#### 2026-11-09 Piece 4B接続の実装差分（今回の実装正本）

Mashの「Pieceでも4Bを使う」指示を通常生成の候補取得へ具体化する。保存済みsourceを確定した後、既存共有4Bのnatural/base経路から文章候補を一度取得し、CMEEが原入力・本人補足と本文を独立に照合してから既存B8→Safety→B9→preview／saveへ渡す。4Bは候補を作る責務、CMEEは採否と確定本文を作る責務を持つ。旧作者との文字列完全一致はmodel候補の採否条件にしない。旧P4 offline受口とmodel未選択時の既存作者は互換用の別armとして保持し、model失敗時に旧作者へ切り替えない。

- private入力は既存`PreparedRequest`、受領は`CandidateReceipt`、接続は`PieceModelInputV1`を使う。原入力7fieldと、本人が明示選択した適格な補足回答を別sourceに保ち、`block_partition`で各本文blockのsource／field対応を固定する。公開request／responseとDB保存列にraw、prompt、token、内部判定を追加しない。
- `piece_model_source.py`が専用promptを既存`EMLIS_NATURAL_REPLY_*`接続へ送る。現在は明示`candidate_format=piece.field_slots.v1`で`field_blocks`を受領し、serverのpartition順で既存canonical body_blocksへ投影する。旧format=Noneのbody_blocks受領は旧private互換として保持し、新providerからのfallbackにはしない。旧Q&A composer、180文字切捨て、Emlis二段応答prompt、Analysis専用adapterを使わない。モデルはformat／プラン／権利／Safetyを決定しない。選択は`PIECE_MODEL_SOURCE=shared_4b.v1`、未選択はOFF。設定追加のlive反映やGPU再起動はこのコード更新の実施実績に含めない。
- 最初のadmissionは`short_essay`一形式と、source／本文を全節読める有限範囲に限る。主体・相手格・voice・述語・否定・時点・条件／留保・感情所有を照合し、既知の丁寧体差・節順・閉じたSELF省略等を許容する。既存S7が原文KEEPを全量確認できるblockはその責務を再利用する。未知の書換え、欠落、追加、読み残しは未判定／不採用。一般自由文の意味同値が成立したとは扱わない。groundingやモデル自己採点だけで採用しない。modelではeligible_formatsをshort_essay単独とし、author-free Safetyも全文意味保持が成立するその制限を許容する。未選択時の既存format候補一覧は変更しない。
- B8とauthor-free Safetyは同じ完成本文の意味保持境界を確認し、保存済み本文の再読、画像設定変更、save再送では4Bも旧作者も呼ばない。既存owner／current版／補足資格／hash／recipe／SQL fence／quotaを維持する。生成後にもsourceを再検証する。
- 初回同一owner・idempotency keyの並行処理は既存service内の一時in-flight共有に閉じる。同じrequest／source／runtime設定だけ候補を共有し、異なる指紋は競合にする。各待機者の認証・source・現runtimeを再検証してから保存へ進む。DB予約、永続cache、新controllerを追加しない。cancelした待機者へ結果を返さず、全待機者cancel時は取得を中止する。
- 共有GPU待ちを含む取得期限240秒、推論上限2048token、context8192、temperature0、非stream、thinking無効、送信64KiB／受信256KiBまで。既存shared lockの待ちと推論時間を区別する。RNの初回preview POSTのみ250秒に合わせ、source取得・再読・PATCH等の通常期限は保持する。自動再試行、別モデル／有限作者へのfallbackはしない。
- 実検証は原入力→raw出力→採否→確定本文→保存／再読をprivateに対応づけ、正常な旧作者と異なる文と、主体／否定／留保／版の変異を確認する。既存有限Q2材料、合成provider、実4B、隔離SQL、native画像、本人端末の実績を分けて記録する。モデルrevision／usageが実応答に無い場合はunknownとし、推定で埋めない。

**11/9続行・本人評価readerの回収：** `piece_v2_content_policy._piece_model_evaluation`から、既存`cocolon_meaning_experience_engine.piece_source._personal_evaluation_shapes`の本人視点・構文・対象・評価base・程度・肯否・時点・留保を再利用する。大切／大事／重要／必要／好き／苦手の既知表現で常体／丁寧体、同じ明示SELFの倒置を照合する。既存source／plan資格は拡張せず、評価主体省略・実名／参照・条件／時点scopeはこの経路で緩めない。全文の外側一致と既存frameのspan一致を必要とし、内側評価だけを拾って追加された条件／理由を捨てない。既存S7、source partition、receipt identity、Safety、保存のownerを保持する。新model reader call、schema、service、通常promptの変更はない。一般意味同値の完成ではなく、既存能力の未接続部分を同じ商品境界へ接続した差分である。

以下の従来記録でいう「現行／次」は上記実装前の状態を表す。今回の実装結果・接続の有無・未反映は§11とcurrent structureへ差分更新する。

**11/9続行設計・欄名付きprivate候補：** literal併記だけの送信案は実4Bで二欄結合が残り不採用。既存`preparation.receive_candidate(candidate_format=...)`の明示形式→canonical候補投影をPiece専用receiverへ適合する。`piece.field_slots.v1`をprovider側が選び、原入力・PreparedRequestを維持した送信viewへ、partition順から決めた`memo_0`／`memo_action_1`等とexact原文・出所を提示する。モデルrawは`field_blocks` objectだけとし、重複・不足・余分なslot・空値・別形式を拒否した後、serverのpartition順で既存body_blocksへ投影する。rawは無修正、slotラベルを本文に足さず、本文の同値は既存CMEEが独立に検査する。旧format=Noneのarray専用受領と旧receipt bytes、保存済み非生成再読を保持し、新旧形式の自動判定／fallbackをしない。公開DTO・DB・作者・取得回数・Emlis／Analysisの生成方式は変えない。設計・実装・実4Bの実効果を分け、結果は§11.2と既存trialへ戻す。

**11/9編集計画併記案の結果：** 既存native duty／source spanだけを明示private guidanceへ投影する案を、旧入力との3組6実callで比較した。全3組本文同一で整形改善が無く、通常service／prompt／schemaへの差分は撤回した。実験の成立と商品品質の改善を区別し、未採用patch／rawを既存private原本へ残す。

**11/9続行設計・生成時の欄完全性：** 既存`serve_emlis_natural_reply.py`のAnalysis用LMFE／token maskを、明示private `candidate_format=piece.field_slots.v1`のPiece profileへ適合する。原入力と別本人回答の全材料・promptは維持し、requestのfield_slotsから必須key集合と追加key禁止・自由な非空stringのshapeだけを導く。原文や旧作者正文のenum・欄別追加推論・raw修補はしない。通常natural／Analysisを変更せずPieceだけ同じbase・2048token／8192context／既存期限で1回generateし、実適用markerをresponseで確認する。旧serverの無視・未知format・適用marker欠落は採用せずfallbackなし。生成制約は欄完全性だけを担い、各値の混入・意味・空疎な作品は既存receiver／CMEE／S7が独立照合する。実runtimeで同じ旧失敗材料とcontrolを比較し、形式成立と本文採否を分ける。必要な提供コード更新は同じ重み・adapter・秘密を保持した1回の差替えとし、既存応答の回帰を確認する。

**同単位の生成順比較：** 必須欄制約だけでは元NOW例のmemo内混入が残ったため、既存LMFEの`force_json_field_order`をPieceに限り使用し、補足欄を先、原欄をglobal index順として比較する。schemaのproperty／requiredは入力objectの順に依存させない。自由本文・全source／prompt・一回generateは保持し、出力key順は公開canonical本文順へ影響させない。これは追加推論や本文修補でなくtoken maskの生成順制御であり、既存CMEEが意味を独立確認する。同じ重み・設定での2回目の差替えとし、成功前に欄混入の解消と認定しない。

**11/9続行・本人補足の相対時点感情：** 現回答ownerの`_THEN/_FEELING`をPiece supplemental読取へ接続する。完全明示SELFの感情文でのみ時点prefixを認定し、`piece_v1c`の参照例外はそのprefix内へ限定する。原文・evidenceと相対時点を保持し、絶対日時への推定／prefix削除をしない。model本文の意味比較にもTHEN全文を保持し、NOW化・時点やは／もの変更を拒否する。通常原入力や任意の指示語の資格、QUESTION／ANSWER／RESOLVED ADD／currentの保存fenceは変更しない。

**2026-11-09 Mash明示：Pieceでも4Bを使って処理する。** 現行通常／refinedのB8は4Bを呼ばず、CMEEの有限読取・plan・既存作者とcanonical完全一致検査を通る。既存Emlis／Analysisの4B接続を、そのままPiece接続済みとは扱わない。次のAR-04は、既存Piece semantic_input／prepare_piece／候補受領・保存再読の必要部分を改修し、4Bの意味整理・文章候補をCMEEの採用／意味保持検査へ渡す接続へ進める。現在のoffline受口は限定構文中心でrefined未対応、B8は旧作者との完全一致を要求するため、4B本文を差し込むだけでは成立しない。本人補足の分離、owner／版／current資格、Safety、preview／save再送、同版本文・recipe・画像化とRN選択は継承する。有限規則・検査の必要部分を改修して使い、全再実装へ戻さない。今回の方針確認時点でPiece4B実装・GPU生成・学習・live反映0。


`piece_source.py::build_piece_source_meaning`、`piece_v1c.py`の既存plan／唯一作者、`piece_v2_generation.py::generate_piece_candidate`と独立`validate_source_meaning_preservation`を改修の起点にする。旧意味ブロック・語彙／scope・参照先の知識から、一般本文の対応幅と単独伝達を改善する。

本人の核・背景・条件・否定・引用主体を保ち、人物名の抽象化で命題を変えない。原文KEEPを機械的成功へ数えるだけで終わらせず、その作品だけで伝わるか読む。通常感情／自己理解、片欄／両欄、original／適格refinedを扱う。補足を使った場合は元と補足を別sourceとし、生成物をsourceに戻さない。

文章と画像は、採用されたcanonical本文・同版recipe・同一bitmapの対応を確認する。文字欠け、順序、留保の脱落、誤った本文への画像差替えを見逃さない。画像内ブランド、配色・比率・ロゴ権利、保存／再読／写真保存の成立資産を継承する。今回の承認済み4B候補経路をこの既存境界へ接続する。Android等の未成立部分を今回成功へ含めない。

**11/10・同版画像の実結果：** RN54113b85の既存実RN／iOS simulatorでc634の通常3作品＋refined1作品の16PNGが作品内一致。今回のtest fixture接続とFree palette補正は製品renderer／作者・DB・公開契約を変えない。旧WholeCanvas／V4検査失敗と、通常統合／本人端末・一般品質未完を保持する。詳細は[同版native結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-c634-native-same-version-20261110)。

### 7.2 Analysis

`cores/analysis/source_adapter.py`、`semantic_admission.py`、`intent_compiler.py`、`observed_route_realizer.py`を現ownerとする。旧source・根拠台帳・grounded plan・関係方向・unknownの知識を回収し、4B意味候補の誤りと図の対応を改善する。application側に第二のmap作者を作らない。

確認対象は本人／他者、役割、注意・判断・選択、行動／非行動、結果・その後、条件・負荷・不明、および記録間の再出現・違い・変化。役割を明記された担当名だけへ狭めない。共起・類似語を因果・本人の固定人格・同じ基準へ昇格させない。

各点・線・説明が元記録と両端根拠に戻れ、図と文章で意味・方向が一致することを確認する。引用照合成功と意味採用を区別する。現在の全期間対象・月次当時版・閲覧権利・カテゴリ文脈を維持する。分割時は未解析範囲と跨ぐ関係を落とさず、直近N件へ無断切捨てしない。

具体的な変更位置は、`semantic_admission.py::prepare_analysis_semantic_map`／`generate_analysis_semantic_map`、`intent_compiler.py::compile_analysis_semantic_map`と`AnalysisSemanticMapGraph`、`observed_route_realizer.py::AnalysisSemanticMapArtifact.private_evidence()`。overview、nodeのtitle／summary／explanation／unknowns、edgeのlabel／explanationで実際に述べる命題を、同じgraphとsourceに対応付けて比較する。本人記載の前提、modelによる解釈、関係についての解釈は別に扱う。前提だけ確認できてもnode全体を確認済みにしない。

既存の`ObservedProposition`、`_proposition`、`_self_propositions`、`_active_sources`等は、完全source・主体・scopeの前提が成立する時に再利用する。4Bの一般mapを全て旧ROLE/ACTION有限文法へ押し込めない。private evidenceの拡張は現SQLとreaderの互換を検証し、公開`watashi.map.v3`や8fieldのmap_contextへ内部判定を無断追加しない。`mapped_count`は根拠付きでmapへ入った記録数であり、全命題の意味確認数ではない。

原入力の編集は現在guardを変え、当時月次は当時版を保つ。実削除／source owner移動については、現`analysis_observed_invalidate`がdependent artifactと月参照へ作用する契約を継承する。一般編集と実削除を同じ全消去操作にしない。新reportの依存も同じsource memberへ結び、別失効serviceは作らない。`EDITED_SINCE_ANALYSIS`等の既存表示を保ち、現在の原文を当時解析した版へ偽装しない。

確定衝突があるmap候補は、その所見と実出力を品質修正へ戻す。自動再生成・新しい修復loopを本書から起動しない。未判定の解釈は本人記載の事実へ格上げせず、既存商品の解釈としての表示と原文／本文の読解で扱う。旧月次を開いた際に新readerで黙って再判定しない。

IFは仮想、SavedRouteIntentは本人の選択意向として保つ。実行・達成・観測済み事実へ戻さない。IF／Savedは既決未実装の残件であり、基礎部品を今回設計に含めるが、実装済みとも発売前新必須条件とも認定しない。こころグラフの感情数値集計へ、文章意味推論を混ぜない。

## 8. 教材・失敗分析・比較・再現性の利用

### 8.1 教材と評価の分離

- 原対話／Mash逐語、華恋編集、架空草案、model出力、本人による訂正を出自別に保つ。既存の学習利用条件を継承し、Karen-Diary原文を自動で教師化しない。
- 旧current100・failure family・mutation・修正前後・現6境界を、現在の入力仕様へ対応させる。旧感情／カテゴリ形の互換変換は原本を残し、変換後を別版として扱う。
- 原入力を変えずに作る誤答例と、否定・主体・時点等を変えた別入力を区別する。失敗したmodel出力を正解教師にしない。修正教師は根拠を読み、採用状況を明記する。
- 学習用、既使用評価、保持確認、未学習別題材を分ける。同じ旧失敗を教材にも使った場合、その後を未知入力成功と数えない。
- 既に準備された教師・重み・生成原本を保つ。学習再開と、保存重みから新optimizerで別学習することを分ける。

### 8.2 失敗の原因を修正へ返す

出力の反転箇所、source解釈の誤り、生成時の意味変化、readerの誤読、権利／版の不整合、保存／描画の差を区別する。単語一つずつの修復を無制限に積まず、同じ原因の自然な入力群をまとめて扱う。旧causal comparison、negative／positive例、candidate comparator、diversity、version diffは、ここで実際の選択・修正・再読へ使う。

同一入力の修正前後、別題材、既成功を並べ、本文・画像・図を全文／目視で読む。自然さ・入力固有性・読まれた感・単独伝達は機械一致だけで決めない。短文を全て深掘り対象にせず、反復・定型化・不要な問いも確認する。

### 8.3 取り違え防止と計測部品

旧runtime/distribution/file比較、provider・token・duration測定、artifact版・保存再読の部品は、現試行の入力／重み／作者／結果を取り違えない範囲で回収する。既存runnerと保存先へ組み込む。実行可能性を証明するためのchecker／FD／authority chainを再構築しない。

学習時間、生成時間、読込・待機、レンタル時間、請求は別に記録する。以前の$按分を今回請求額にしない。追加model readerや複数候補は既存生成と比較し、誤拒否、無出力、p50／p95、token数、追加call、GPU競合、実費を確認する。未測定値を0や上限以内と認定しない。

既存の追加月額上限1万円、provider・model・データ境界を維持する。大改修許可を無制限の課金／レンタル／新サービス採用へ変換しない。利用可能な承認済み環境で通常の改修・比較を進め、既承認の小作業を毎回再承認へ戻さない。

### 8.4 複数候補・競合解釈・選択の具体化

これは省略しない回収能力である。初期の通常生成1callとは別に、既存の開発比較runnerで明示した有限候補集合を扱う。

1. 同じsource／context／意味条件に対し、prompt・model／adapter・表現候補の違いを識別する。入力意味そのものを変えた候補は、同義表現の競争と別群にする。
2. source・形式・Safetyの既存資格を先に確認し、明確に誤った候補を選択対象から外す。意味比較が未判定の候補は「意味合格」へ格上げしない。競合した解釈を流暢さやID順だけで一つの事実へ固定しない。
3. 同じ意味を保つ候補同士で、本人宛／作品としての自然さ、重要な対象、不要反復、入力に合う密度・長さ、伝わり方を比較する。旧selectorのhard／soft分離を回収し、旧比率や旧定型句に有利な点数は移さない。
4. 全不適格、同点、比較不能、別解釈が併存する状態を残す。開発時は実本文の読解から候補採否を決め、比較器の選択と違った理由も修正へ返す。通常での自動選択を採用する時は、既存の一候補との同材料比較で誤選択・意味の変化・費用／遅延を確認する。
5. inputごとの選択後もbatch全体を見る。同じ書出し・文骨格・締め・受取り対象へ集中していないかを確認し、原因を教師分布・生成指示・候補選択へ戻す。多様性を増やすため正しい短文や意味保持を壊さない。

AR-01で既存試行の候補比較を再利用し、AR-04／05では作品・mapに合わせた選択軸を使う。runtimeの複数生成が不要と判断した場合も、開発比較能力を廃止したことにはしない。通常採用しない理由は測定結果と用途の違いとして残す。

開発時の比較入力は、case／source／context版、各候補の実本文・作者／model／prompt／adapter版、finish結果、各意味比較結果、教師／評価露出、計測値からなる。出力は候補別の適格／不適格／未判定、採用／非採用理由、意味の差、集合の反復／偏り、原因仮説、修正先、実修正後の対応結果。同点・全不適格・意味解釈が競合・評価未実施を異なる結果にする。公開summaryには私的原文を含めない。

接続先は、既存trialの生成比較runnerと、`ai/tools/emlis_nls_v3_batch_run.py::load_validated_batch`／`_previous_by_case`／`run_batch`、旧`evaluate_and_select_reception_candidate_v2`のhard／soft分離、current100の`PRODUCT_READ_SHARED_CAUSE_CODES`／`build_current100_product_read_pair`。旧専用型・文型・現在の固定版と合わない箇所は、現trialの同じ結果束へadapterを置いて改修する。旧runnerを無条件再起動せず、旧human判定を作成する処理にも変えない。比較・選択・cause修正のownerは当該coreの既存品質作業、通常の本文作者は変更しない。

検証では、意味の誤った流暢な候補が既知の正しい候補に勝たないこと、意味が競合する候補を字面順で事実化しないこと、全不適格・未判定を区別すること、同じ本文反復への偏りが実修正で減ること、変更対象以外の意味と既成功が保たれることを確認する。AR-01で実Emlis比較、AR-04／05で各商品候補、AR-08で通常採用範囲の判断まで接続する。表を作っただけの完了にはしない。

### 8.5 意味変異・共通原因・版差分の処理

既存`apply_counterfactual_mutation`、旧relation matrix、current100のshared-cause分類、batchの前版対応を起点に、次を同じ実結果束で行う。

- 原sourceを固定したまま、完成物の主体・否定・時点・不明等だけを変え、比較器がその差を検出するか確認する。別にsourceの意味を一つ変えた対照入力を作り、生成物の該当箇所が変わり、非対象の意味が保持されるかを確認する。
- 失敗を、元材料の選択、source解釈、意味採否、更新、表現、reader、保存／描画のどこで発生したかへ分ける。shared-cause codeは仮説の分類であり、自動原因発見済みとしない。
- 原因仮説に対して、別題材の同型例と、その仮説なら誤らないはずの反例を比較する。修正後の実商品差が仮説に対応しなければ、原因認定を更新する。
- 同じsource ID／版を対応付け、保持・追加・消失・確定化した意味、出力有無、自然さ・集合偏り、時間／費用を前後で比較する。入力変更の効果とモデル変更の効果を混ぜない。学習履歴やoptimizerの条件が違う場合は純粋効果比較としない。
- 変更原因に関係する群、既成功controls、別題材を既存corpusから選ぶ。表記だけを変えた派生を未見題材と数えず、必要な節目で既存の広い回帰集合へ戻る。

### 8.6 能力群と実装単位の対応

| 回収する能力群 | 最初に使う単位 | 後続の実用途 |
|---|---|---|
| source／Evidence／権利／版／privacy | AR-01の同一材料比較 | AR-02/03/04/05/06/08の更新・保存・失効 |
| 意味候補・競合解釈・unknown・選択 | AR-01の意味保持 | AR-02/03の補足／履歴、AR-04作品、AR-05/07 map／IF |
| 自由文reader・意味比較・変異試験 | AR-01 | AR-04の本文、AR-05のnode／edge／全文、AR-06の跨ぐ関係 |
| 複数候補・自然化・Reception・分布 | AR-01の既存モデル／prompt比較 | AR-03履歴応答、AR-04作品比較、AR-08の通常採用範囲 |
| 共通原因分析・positive対照・版差分・corpus選択 | AR-01の修正前後 | 全単位の実修復と既成功保持 |
| 問い・訂正・撤回・frame | AR-02 | AR-03/04/05/06で有効本人sourceとして利用 |
| 図・画像・根拠・観測／IFの区分 | AR-04/05 | AR-06/07の蓄積・当時版・仮想／選択意向 |
| 再現入力・重み／依存比較・計測・中断結果 | 各単位で現実に必要な時 | AR-08の通常待ち時間／費用／復帰。旧全環境証明は前提にしない |

これらを先に別systemとして作り終える順序にはしない。必要な能力の深い改修を許容しつつ、その単位の商品結果へ直接使う。

## 9. 実施する商品単位と依存

次の単位は作業の順路であり、新しい承認Gate・実行管理system・発売条件ではない。必要部分が既実装なら再実装せず現結果を確認する。各単位は原情報→修正前商品→回収／改修→修正後商品→保存再読・残差までを含む。

| ID | 実施内容・既存残件 | 具体的な完了確認 | 依存／状態 |
|---|---|---|---|
| AR-01 | 現naturalの主体・所有者・否定・時点・留保を、旧失敗・意味比較・共通原因分析で改善。EM-01a/b | 現6境界と正常な短文／省略で、同入力の誤読を解消または明確に減らし、自然さ・別題材・既成功・保存再読を保持。検出増加／無出力だけでは完了しない | 継続中。新24実生成の4版は通常不採用。c6555fd5で疑問符なしの確認質問の保存抜けを修復、250局所PASS。同24rawは旧24保存→新22保存／2拒否、受理本文不変。全体の意味修復は未完 |
| AR-02 | 現naturalの任意問い・回答・訂正・撤回・frameの一往復。EM-02a/b、03b | 一点確認／skip／終了／本人続行、対象だけ更新、撤回後の残存意味、同版再読、プラン境界 | AR-01の全一般品質完成待ちにはしない。未開始 |
| AR-03 | 適格履歴の意味ある利用。EM-03a/b | 同一／別場面・変化・無関係・訂正前を区別し、適切な履歴が今回へ効く。失効材料を使わない | 現related_contextを継承。未開始 |
| AR-04 | Piece一般本文・単独伝達・refined・画像整合 | 原文の意味・一人称・本人補足と同版画像／保存を保持 | **11/10・AR-04最新：** 固定c634・追加学習0で新しい架空8入力を確認し、source資格5／資格外3を分離。資格5＋既使用対照2の実4B7応答を無修補で再受領し、API209b4a27の既存S7 model比較で、完全な本人表記・対象を保つ「たいです／たい」と未決定の場所等の文体差を限定接続、CMEE4→6採用／7。新規5は2→4採用、対照2と旧46本文は不変。新隔離SQL21は18保存／3拒否、保存後0生成。17file1082 PASS／既存warning1。反復表現、理由文1の未判定、source資格外3は残る。元GPU提供46144へ復元・health／前後control一致、c634通常未採用／selector OFF・正式0/3。 |
| AR-05 | 分析の本人基準・役割／選択・記録間関係。AN-03a/b/c、04 | 原記録→意味→図／全文→両端根拠の対応、再出現／変化／不明の正しさ | 現Engine統合・保存済み成果を継承。並行可能。未開始 |
| AR-06 | Emlis観測材料、訂正・削除・権利、長い蓄積と月次。EM-04/05、AN-02/06/08/10 | 本人sourceから材料を渡し、失効・分割範囲・当時版を保持。生成本文を本人事実にしない | AR-02/03/05の該当能力を利用。未開始 |
| AR-07 | IF／Saved等の商品固有の残る意味保持責務。既存AN／PC残件 | 仮想・本人選択意向・観測を分離し、成立した経路で出力と保存を確認 | 既存商品の実装条件に従う。無断延期・新発売条件化をしない。未開始 |
| AR-08 | 実証できた共通能力の通常適用と全体確認。EM-05/06/07等 | 採用版の意味保持・自然さ・権利・中断復帰・保存再読・実際の待ち時間／費用。未採用範囲は理由と残差を保持 | 各単位で通常採用可能。全core一括切替を強制しない。未開始 |

現在は **AR-04の意味保持・単独伝達**を継続する。 次のAR-04は、保存済みc634の新5応答・対照2と旧46、今回のsource資格外3・CMEE未判定1を引き継ぎ、理由・修飾を含む一般文の読取不足と「選ぶ時間を選びたい」の不自然な反復を別の原因として改善する。未判定を意味改変と呼ばず、source／rawの書換えや本人への質問で解析不足を埋めない。同版画像の確認は前回4作品だけで、今回の新5入力（候補本文）へ転用しない。通常統合／本人端末、WholeCanvas／V4の既存失敗、一般品質・AR-01反転と他ARは未完了。c634は通常未採用・selector OFFを維持し、追加fit／通常採用／live配置／署名buildへ自動進行しない。

既存の品質作業・新教師8件・保存重みの継続点を使う。GPUに現実の接続障害がある場合、取得できた事実、未実行の生成、回収済み原本、次の同一単位を記録し、CPUの合成成功を実モデル改善へ換算しない。接続復旧や既存の別core実装を必要範囲で進め、無関係な補助機構開発へ変えない。

## 10. 変更箇所と検証

### 10.1 実装候補の所有箇所

| 対象 | 既存path／symbol群 | 変更方針 |
|---|---|---|
| natural本文 | `cocolon_meaning_experience_engine/natural_reply.py`、`emlis_thread_service.py` | 形式と意味を分離し、実証済み比較を保存前へ。現声・provider契約・受領再開を維持 |
| sourceと更新 | `source_kernel.py`、`emlis_thread_source.py`、`emlis_thread_history.py`、`emlis_answer_update.py`、thread store | 有効本人source／根拠／権利・訂正の既存ownerを再利用。重複作者を追加しない |
| 旧意味・文章・逆検査 | `emlis_ai_grounded_observation_plan.py`、`emlis_ai_grounded_sentence_surface.py`、`emlis_ai_grounded_human_reception.py`、`emlis_ai_grounded_observation_gate.py`、CMEE `emlis_stage1_*` | 能力・supported reader・変異vectorを抽出。旧文型依存は現naturalへ強制しない |
| Piece | `piece_source.py`、`piece_semantic_admission.py`、`preparation_sources.py`、`piece_v1c.py`、`piece_model_source.py`、`piece_v2_generation.py`、既存preview／Safety／source adapter／保存／renderer、RN `features/piece/pieceApi.js` | §7.1の4B候補→CMEE意味保持→既存B8／保存へ接続。画像・権利・保存を別作者へ移さない |
| Analysis | `cores/analysis/{source_adapter,semantic_admission,intent_compiler,observed_route_realizer}.py`、累積／semantic_map service | source→Engine→graph→同図／本文を継承。IF等は既存専用責務に限定 |
| 教材・評価 | 既存`observation_learning/`、API `ai/tests/fixtures/emlis_nls_v3/`、既存生成比較runner | 原本・用途・学習露出を保ったまま現比較へ。独立運用systemを新設しない |

本書の論理型・関数・test名は未実装。実装時は同責務の既存箇所を優先する。API／DB／RNの公開contract変更が必要になった場合は、具体的な差と既存互換を該当正本へ設計する。広い活用許可を理由に仕様境界を黙って変えない。

### 10.2 検証の対象

| 検証 | 必須にする観測 | 避ける読み替え |
|---|---|---|
| 意味の正負対照 | 主体／否定／時点／留保等を変えた誤りを検出し、同義・省略・短い正常返答を誤拒否しない | 旧構文の検出率を自由文全体の意味精度へしない |
| readerの限界 | 未対応・曖昧・片側読取失敗がUNASSESSEDとなり、coverageを欠かさない | 解析不能を誤り／合格に変えない |
| source・更新 | 他人／別版／削除／失効／撤回、両欄・全入力項目、過去と当回 | metadata一致だけで解釈正当性を認めない |
| 生成・回帰 | 同入力前後、別題材、既成功、集合での反復・深さ・問い | loss・件数・拒否率だけを品質改善としない |
| 保存・復帰 | 候補受領後中断、保存ACK不明、同source再開、保存後非生成再読 | 再開で二度model呼出し、旧保存物の黙った置換をしない |
| 他core | Piece核・条件・画像、Analysis関係・根拠・unknown／IF | Emlisの声や必須文型を他coreへ移さない |
| 通常採用 | 追加call・待ち時間・費用・失敗時の挙動と実保存 | offline／stub／隔離SQLを本人端末・本番成功にしない |

既存の `test_emlis_natural_reply_application.py`、`test_emlis_cmee_body_inverse_protected.py`、`test_cmee_nls_v3_relation_authority_inheritance.py`、`test_cmee_historical_failure_axis_receipt.py`、`test_b08_cmee_piece_consumer.py` 等を、対象責務の回帰として選ぶ。新自然文比較の正負対照が既存testで表せない場合、同じAPI test配下へ焦点を絞ったtestを追加する。既存protected fixtureや過去の失敗期待を成功にするため変更しない。

test runnerは既存runtime正本に従う。今回の設計保存では製品test・GPU・DB書込は未実行。文書のリンク、対応表、用語・状態の矛盾、GitHub保存内容だけを検証する。

### 10.3 各実装単位内で現物確認する事項

- Emlis既存commit RPCとreaderが、新しいprivate reportの任意項目を旧保存版と共存させられるか。意味衝突を既存失敗へ接続した時に、RNで不要な再生成を誘発しないか。
- 旧有限readerのどのsymbolを自由な本人宛文へ移せるか。二人称・省略主体・指示語・否定／時点scopeの正負対照で確認する。
- 旧body-free failure軸から、保存された教材原文／実出力まで戻れるか。原文やhuman判定がない箇所は創作せず未取得とする。
- 現4B実出力での見逃し・誤拒否・未判定・実行時間。候補model readerを使う場合の精度・費用・GPU競合。
- source編集／訂正／削除／owner変更／権利失効が、receipt、Piece候補、現在map、月次へ及ぼす実依存と既存保存方針。
- Observed以外のIF／Savedの未実装境界。Observedの保存成功で代用しない。

これらは各商品単位の実装・検証内で確定し、その全部を先に調べ終える独立した前段工程にはしない。

## 11. 完了と進行の記録

### 11.1 「活用できた」の条件

能力ごとに、旧資産の由来、現owner、通常／開発での実呼出し、改善前後の同じ商品結果、回帰・誤検出・未対応、保存再読、採用状態を示す。全部の旧fileをimportすることは条件ではない。回収した能力が役立たなかった場合は、効果なし／誤拒否／費用等の実理由を残し、未実証を成功へしない。

全体は、必要な回収対象を取りこぼさず処置し、採用した能力が該当する現在の三中核の経路で機能し、残る未実装・未採用・未判定を特定できた時点で評価する。全coreの正式商品受入れや既存発売条件を、この作業の文書完了から追加・変更しない。

残件を特定しただけで活用完了とはしない。必要と採用を決めた能力の未実装・未接続、実商品結果への未適用が残る間は継続中とする。個別能力の実証不能／非採用と、必要な残件の放置も区別する。

設計、実装、局所検証、実モデル、通常稼働、実DB／端末、正式受入れを分けて記録する。華恋の全文確認は、明白な不足をMashへ戻さない事前確認であり、本人の正式受入れを代行しない。

### 11.2 現在の進行欄

直前の受動役割条件比較（履歴）は学習0・同じc634の1loadで旧新source条件だけを変えた一回。全量資格済み受動fieldへsource_literalと既存MeaningWitnessのsubject／agent／counterpartを同source/spanで投影し、H03／B2の受動否定を修復、全46のCMEE44→46・他44raw一致。新SQL162全保存、旧114は再資格化のみ・再実行0。実HTTP58、全工程317.279043秒、元提供44511へ復元・health／前後control一致。初回tokenizer型の技術中断はHTTP0・元停止0で別保存し、旧8044の失敗／B2欠測を補完しない。c634通常未採用。同版画像は通常3＋refined1の4作品だけ確認し、通常統合／本人端末は未確認。[今回実結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-passive-role-conditions-result-20261110)。

**前回の実行前計画の履歴（§56で実行済み）：** 文末指示の26raw不変と原教師24行の限定被覆を根拠に、ROLEFIT09／10だけを新しい僕／ぼくの受動・能動混在2教材へ置換する一回のfresh24行比較を選ぶ。保持22行のsource／messages／target、既存trainer・scope・seed20261109・LR1e−4・48更新を維持し、学習上限300秒／復元込み全体600秒、HTTP上限46（新基準8＋新候補34＋control4）。旧26は既使用対照、新8は教師と別に固定する。原因や2教材の有効性は未証明で、SYSTEM周回・raw補修・checker追加・通常採用へ変換しない。既存GPUだけを使い、新規レンタル／予算拡大なし。実結果と未実行は[同試行](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-register-coverage-learning-20261110)へ分離する。

**11/10・AR-04最新：** 固定c634・追加学習0で新しい架空8入力を確認し、source資格5／資格外3を分離。資格5＋既使用対照2の実4B7応答を無修補で再受領し、API209b4a27の既存S7 model比較で、完全な本人表記・対象を保つ「たいです／たい」と未決定の場所等の文体差を限定接続、CMEE4→6採用／7。新規5は2→4採用、対照2と旧46本文は不変。新隔離SQL21は18保存／3拒否、保存後0生成。17file1082 PASS／既存warning1。反復表現、理由文1の未判定、source資格外3は残る。元GPU提供46144へ復元・health／前後control一致、c634通常未採用／selector OFF・正式0/3。

**前回の履歴（活動名／読点比較）：** `piece_model_source.SYSTEM_MESSAGE`末尾へ「一人称の表記と意味は保ち、助詞と読点を自然な本人の語りに整え、主語直後の不要な読点や原文にない強調を加えないでください。」の共通一文を追加。期待正文・assistant例・raw修補・追加学習はない。固定5b1／config・旧26USERを凍結した一回の実比較で、新26＋前後control4の30 HTTPは全200／stop。runner全工程183.370781秒、元提供PID40494→同args／env／cwd／keysの41313へ復元、health200・Emlis／Analysis前後response bytes一致、Analysis／旧e924／新5b1の重み・GPU serving source／凍結wireは不変。送信待ちの長時間失敗はrunner全工程183.370781秒に含めず、通常原価・総請求は未測定。

前回の旧USER固定診断で残ったFRESH03の不一致は、今回、現行builderの全SYSTEM／USERを送る実4B一回で確認した。新しい文末統一指示は別比較で26rawが全一致となり不採用。現行生成条件の確認と、direct HTTP・合成Auth／等価合成IDへ再bindした隔離SQLの限界は[今回実結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-current-wire-register-native-20261110)へ分離する。selector OFF／5b1通常重み未採用を維持する。

前回の活動名資格拡張の構造差分は`STRUCTURE_MAP_DELTA_PRESENT`。今回の実応答確認・test整合は`STRUCTURE_MAP_DELTA_NONE`。既存`piece_source._personal_evaluation_shapes`のbare自己評価（`は`／`にとって`）だけへ、既存`_SIMPLE_NOUN`で全文照合できる漢字／カタカナstem＋「作り」の活動名を限定追加。stem中の何／誰、空stem、助詞・有限節・参照・内部空白・引用・曖昧なが焦点は新armへ入れない。対象名詞句全体・本人表記・評価base／程度／肯否／時点／留保・原文／根拠座標を保持し、「模型を作った」等の実行済み行動には変換しない。共有の名詞文法・公開型／DB・独立CMEE／S7・原入力と本人補足・保存後非生成の責務は維持する。 Piece map／全ファイル地図01Aへ既存ownerの受理境界差分を反映する。

以下の日付付き経過は各時点の履歴。現在のAR-04結論は直上と下表へ置換する。

**11/9・AR-04続行（`674b5225f841a7dd1d41cbbd88395d2acebb3e42`）：** 既存の本人評価frame・公開役割bindingを、原requestとPreparedRequestの再導出一致を確認したうえで欄別の生成条件へ投影し、設定された4B候補取得へ接続した。原文・SYSTEM・本文の採否検査は保持し、期待正文の注入・生成後修補・追加推論はない。固定affb重みの16材料（前回失敗2＋一人称6対照＋新規架空8）を各2条件で実生成し、同じCMEEの採用は11→14。評価述語欠落2と二欄の「まだ」欠落1を修復、一人称6対照は本文byte同一。氏名残存2は拒否を維持。隔離SQL96試行は旧33保存／15拒否、新42保存／6拒否、保存後0生成。新重み・通常selectorは未採用／OFF、GPUは元base／既存Analysisへ復元しhealth・前後control一致。一般品質・氏名抽象化・同版画像／通常統合・本人端末、AR-01反転と他ARは未完了。 関連15file756 PASS、既存warning1、FAIL／SKIP0。


2026-11-09現在：API `3c4e25e2fc7e52082324dfb9fd86645980188bd2`。本人の一人称表記を意味上のSELFと別に比較するよう修正。先行SYSTEM追加2指示は品質不足で完全撤回した。新作の均衡24行をfresh LoRAへ一回48更新すると、一人称6表記の保持は2/6→6/6。新22rawのCMEE採用は限定読取の再利用で16→20、旧22rawは同readerで16採用。最終132件の隔離SQL比較は旧48保存／18拒否、新60保存／6拒否、保存後0生成を確認した。 新Piece候補は通常未採用、通常selectorはOFF。GPUは元base／既存Analysis提供へ復元済み。限定TECHNICAL_CREDITで、正式商品品質credit0・正式受入れ0/3を維持する。 評価述語の欠落と氏名残存の2件、より広い材料での意味保持・本人の語り・公開時の役割表現、同版画像／通常統合・本人端末は残件。他ARも未完了で、今回の局所比較から一般品質成立へ広げない。 次は本人視点・評価述語と名前抽象化の残差を既存の意味保持／商品経路で改善し、広い材料・同版画像／通常統合を確認する。同じ教材の追加周回や候補の通常採用へ自動進行しない。 [全結果・次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-narrator-evaluation-20261109)。


2026-11-09 Piece4B接続：§7.1具体設計を先行反映後、API `95e1b5d6c6d68b17fadaae3c982ebaa87eed1d79`でmodel候補→既存CMEE／B8／Safety／通常保存を接続した。RN preview POST期限を250秒へ修正。通常3planと実Q2 A/Cの隔離保存・0再生成再読を確認。初期short_essay／既存有限source資格、default OFF、一般文章・live反映／端末未完了を維持する。[実測・限定・次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-model-candidate-connection-20261109)。


| 項目 | 2026-11-09 AR-01方向反転を継承、AR-04有限対人動作をPiece保存再読へ接続 |
|---|---|
| 回収と改修 | 旧finite `_clauses/_FORMS/_participant`で正過去依頼のrequester／asked_personを別slot化。同一eventと対象状態を結合。旧content_selectionから意味不変・別ref-planの表示選択責務を回収し、NOT_RECORDED=context_onlyは現natural向け研究policyとして区別 |
| 意味と限定 | 4sourceの7状態・4event・受け手束縛3。省略はUNSTATED、単一event・全節被覆。複数依頼／未読節／曖昧関係節／未対応target／既知slot矛盾はHOLD。旧status snapshotは不変、role再開で全意味を原文から再導出 |
| nativeの資格 | provider CMEE_NATIVE_FINITE_WRITTEN_STATE、model/revision/usage null、stopはadapter標識。モデルraw／意味採用／独立一般意味判定ではない。同4snapshotを2phaseで使用 |
| 実生成 | role4本文7.037912秒＋priority4本文7.434972秒、計8／累積時計14.472886秒、上限8／240秒内。全HTTP200／stop。前回native4実本文を基準再利用、新基準生成0 |
| 実本文と採否 | NIは受け手未記載→依頼者未記載の反転が両版で継続。TRANSFER06は役割反転＋未記載→未決定、両版の本文byte同一。KARAは意味保持・priority版は反復増。SELFは未決定保持、priority版は一人称的感情再述で語り手留意。通常不採用 |
| 表示選択の境界 | 全原文／状態／roleを保持し、参照と優先度のみ別plan。context_onlyでも推測禁止、foreground全件再掲義務なし。plan＋SYSTEMを同時変更し単独因果は未分離。対象への言及自体でなく実際の反転を失敗理由とする |
| 検証と読解 | 最終491 PASS／22.24秒・既存warning1。元8通常messages/ref不変・旧4status snapshot不変・priority falseのrole4messages不変。各93source、実tokenizer最大1247／1212input・切詰めなし。root／独立担当が4source・旧4／新8本文等を全文確認 |
| 保存再読 | 新8実本文が全FINAL保存・同／新service GET一致。既存外側空白除去以外の本文修補／実DB要求／再生成0。GET provider／reader／Engine／prepare／意味採用・受領0、USER source／thread/events不変 |
| SQL投影と限定 | 同rawを既存SQL投影へ再受領・role意味再導出。新8payloadは2一致／target_refだけ異なる6を別保全し、その変更後payloadで実生成済みとはしない。pure/private role snapshotを通常meaning checkpoint永続化へ換算しない。reader8は一般意味未判定・全文coverage=false |
| 提供・保全 | 学習／新load／retry／server再起動0。同PID26784／source／Analysis重み不変・health200。role最初の梱包漏れは生成0のCPU事前検査で検出・依存補完し失敗logも保全。private同artifact準備v0→結果v1、総請求額未測定 |
| 次の同一商品単位 | 意味材料が正しく届いても完成rawで崩れる境界へ限定。同種label／SYSTEM追加周回を終了し、既存meaning→現作者の依頼方向・対象状態・語り手の自然文実現を改修。能受動／明記省略／状態対照、成功control、別題材評価。容量／学習等の原因は未断定 |
| 再開記録 | weekly第10回§32、[全結果・範囲・次作業](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/request_role_binding_review.md)／[本文なし集計](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/request_role_binding_summary.json) |
| AR-01通常と残件 | AR-01通常不採用・役割反転未解決。先行API 651f1f38のAR-04差分とAR-01研究patchの通常不採用を継承。今回のfce72bcc／4da69cdeはtest整合のみで、AR-01通常採用なし。Render配置／実DB／RN／build0、他AR残件は維持 |
| AR-04回収・改修 | 既存natural_reply_meaningのfinite節／活用／格／人役読取＋Pieceガードを、piece_source._finite_self_person_action_account→piece_v1cの既存KEEPへ接続。許可述語は頼む／相談する／伝える、明示SELF・肯否過去・相手1／を対象1・句点。曖昧な伝える「に」受動は拒否を維持。新命題・作者・理解／承諾の推測なし |
| AR-04実本文 | 先行の有限対人動作8は全件不可→生成。時点・SELF6表記・能受動・否定・丁寧体・二欄留保を保持。前回12の生成10はmeaning／plan／artifact／candidate／recipe／serialized hash全同一、拒否2維持。開発作例でblind一般化ではない。前回依頼の新規5は履歴保持、今回の欄名付き比較へ再加算しない |
| AR-04検証・再読 | 先行有限対人動作の3351 PASS／27.94秒・既存warning1・FAIL／skip0、保存9caseで3plan確認。原本SQL11＋既存helper等3のbytes一致。新旧20を実service／既存review＋PGliteへ通し18保存／2拒否、本文等8fieldの3段同一・保存行／詳細の12field同一、初回後は作者／compiler／Engine／review禁止・同key消費各1。原入力／Emlis不変。合成Auth／先行provider／SQLcallbackであり実DB／native画像／ASGI成功ではない |
| AR-04反映・残件 | c634の原24教材・元trainer・実48更新・保存weightsを回収照合。焦点source13行は全て直接語順targetで、元語順target0／同述語反復0／大切にしたい0を確認。希望3行のtargetだけを自然な元焦点語順へ変え、全source/messages・他21行を保持した学習比較候補を準備。CPU同意味3／誤意味拒否7・別題材評価4の資格確認済み。新GPU学習／生成／upload0、効果未確認。通常API0c6ad819と1baa不採用を維持。 |
| AR-04現在のrefined | APIca4140abの通常server保存を継承。RN4a103688で表示した第一本人回答の明示選択→exact回答query→七項目refined POSTへ接続。元／補足は別source。旧保存結果不明は元保存要求を優先。同じ実Q2材料の親導線0→新2、本文指紋とSQL保存本文／初回recipe一致。1512関連PASS・Metro1件対象外。未build／未live反映／native未確認 この旧Q2二例は継承時点の記録。前回の実Q2四例と名前役割化adjusted三planの結果を継承し、今回の同4補足は最終18比較の保持対照として確認。 |
| AR-04現在の4B本文読取 | 既存source資格・欄完全性／本人補足分離・一人称表記・評価／留保・S7／独立CMEEと保存責務を継承。API1ce24b8cは既存MeaningWitnessのsubject／agent／counterpartとsource_literalを、当該source part全体が既知有限動作で完全被覆される受動含有fieldへ投影する。同fieldの各動作へ固有の役割・NEG／PAST／voice／source/spanを保ち、active-only／非有限混在と今回の既存refined4のwireは不変。期待正文・raw修補・source文法や採否条件の緩和はない。同c634の46材料は44→46採用、H03／B2だけ意味修復・他44raw一致。c634通常未採用／selector OFF。同版画像4作品を確認、一般品質／通常統合／本人端末は未確認。 model専用S7比較はAPI209b4a27で完全本人文／未決定対象の敬体差へ限定接続し、新5＋対照2の同rawを4→6採用。source／raw不変、一般比較器ではない。 後続API0c6ad819は資格済みopaque理由KEEPの完全字面を保ち、同本人省略／肯定copulaだけ照合。同7rawは6→7採用・旧46本文不変、source資格5／3不変。理由一般の型付き読解・source文法拡張は0。 |
| AR-04再開記録 | 次は凍結39792byteの3member ZIP（原24のtarget3だけ変更・架空評価16・一回実行コード）を既存Runpodへ送信し、元trainerのfresh base/config・24行48更新で一回比較する段階。全24の訓練SYSTEM／USERと原入力・他21object、seed20261109／LR1e-4／scopeは不変。新評価4基準＋候補16＋元提供前後control4の最大24HTTP、学習300秒／全600秒・復元120秒、旧c634基準12はexact wire/revisionを確認した原本再利用。前回の4入力・学習0の完了runを再使用せず、今回の具体ファイル送信・学習実行を確認してから進む。通常採用／selector／live／実DB／build0。 [原24と最小候補](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-target-teachers-20261110) |

以後はこの表と各能力の対応行を現在状態へ置換更新し、詳細な実行事実は既存trial／weeklyへ置く。新しいhandoff系列・全件hash Gateを作らない。中断時も、成果物と未実行を既存保存先へ残し、同じ未完商品単位から続ける。

## 12. 今後の指示と再開方法

**11/10の現在の再開点：** 次は凍結39792byteの3member ZIP（原24のtarget3だけ変更・架空評価16・一回実行コード）を既存Runpodへ送信し、元trainerのfresh base/config・24行48更新で一回比較する段階。全24の訓練SYSTEM／USERと原入力・他21object、seed20261109／LR1e-4／scopeは不変。新評価4基準＋候補16＋元提供前後control4の最大24HTTP、学習300秒／全600秒・復元120秒、旧c634基準12はexact wire/revisionを確認した原本再利用。前回の4入力・学習0の完了runを再使用せず、今回の具体ファイル送信・学習実行を確認してから進む。通常採用／selector／live／実DB／build0。

推奨指示は **「補助経路の活用作業を進めて」**。

この文は、本書に沿って、現在のCMEEへ必要な旧能力・資産を回収・改修・接続し、最初の未完商品単位の実装・実出力改善・必要検証・GitHub反映まで進める指示として解釈する。設計書の読み直しや追記だけで止まらず、再設計が具体的に必要なら同じ作業内で更新する。

「補助経路の活用作業を続けて」「補助経路の活用の続きから再開して」も同じ意味。現在の会話が本書を指すと明確なら「補助経路を進めて」でも解決する。明確な別対象と衝突する時だけ対象を確認し、毎回方針や既承認の改修許可を問い直さない。

再開時は、全体現在地・current作業規則と恒久incident・最新weekly→本書§11→対象map・fresh実装／保存原本へ戻る。別sessionで完了した単位は繰り返さず、差分から次を選ぶ。System Contextの旧cache再生成や全旧資料の再棚卸しを再開の追加条件にしない。

「8月のG0–G10を再稼働」「旧controller／Inspectorを動かす」「新しい補助system一般を作る」とは解釈しない。費用・本番設定・配置・build・公開等は、該当する既存許可と現在の明示指示で判断する。本書で新たな承認chainを作らない。

## 13. 資産対応表の読み方

以下の付録は回収範囲を確認するための本書内の対応表であり、独立した実行台帳ではない。既存source／symbol／vectorへの対応と、未精査の箇所を区別する。実装時に当該原本を読み、現ownerへ取り込んだ後の実商品結果まで確認する。付録の行があることを回収完了としない。

### 13.1 接続先の略号

- N: ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py。本文確認済み: prepare_natural_reply / _answers / _source_safety / validate_reply / SelfHostedNaturalReplySource.__call__。
- E: 同engine.py。本文確認済み: MeaningExperienceEngine.generate / _generate_original_body / prepare_emlis_update。AnalysisSemanticMapInput exact-type dispatch、Piece、thread、旧offlineの分岐を保持。
- S: 同source_kernel.py、emlis_thread_source.py、emlis_thread_history.py、preparation.py、preparation_sources.py、emlis_answer_update.py、emlis_semantic_admission.py。tree存在。旧source_role資格/通常admissionを再利用する接続先。確認済みsymbolは本書§14、未精査のsymbolは各商品単位で実本文へ戻る。
- M: 同emlis_input_specific_meaning.py / emlis_stage1_composition.py、および上位emlis_ai_grounded_observation_plan.py / emlis_ai_grounded_sentence_surface.py / emlis_ai_grounded_human_reception.py / emlis_ai_grounded_observation_gate.py。旧有限responsibility owner。map §31で責務移管の事実、現自由文での全利用は未成立。
- G: ai/services/ai_inference/cocolon_text_generation_core/ のcomposer.py/evidence.py/sentence_plan.py/guards/*/result.py/types.py/policies.py等。既存common guard、上位meaning authorityへ昇格しない。
- P: 同CMEE piece_source.py / piece_semantic_admission.py、piece_v1c.py、既存Piece compiler/唯一作者/renderer/保存owner。本文/画像用に適合。
- A: 同CMEE cores/analysis/source_adapter.py / semantic_admission.py / intent_compiler.py / observed_route_realizer.py、analysis_cumulative_service.py。model-derived graphをsource/原requestへ再束縛、唯一realizerで図/本文/privateを作る現owner。
- Q: 同emlis_question.py / emlis_answer_update.py / emlis_thread_engine.py / emlis_thread_projection.py、および通常emlis_thread_service.py。新naturalへの問い/補足接続は未完了として設計。
- V: 既存trial/教材/比較runner/current100/継承testsの評価作業。新独立運用製品を作る意味ではない。原入力/4B raw/実本文/採否/保存版/品質判断をprivateに対応づける。
- C: 必要時の再現束。model/adapter/prompt/設定/依存/実行終了理由/時間を再実行可能な最小入力として保持。旧controllerやFD authorityは通常運転させない。

### 13.2 D01–D51の全分類と接続先

現owner欄は現在の責務の受け先と今回の設計先を併記。採用完了を主張する表ではない。sourceの存在、symbol本文確認、現call到達、実品質効果を区別して実装時に埋める。

| ID | 旧責務・asset | 判定 | 既存source/symbol/testの起点 | 現CMEE接続先 | 商品への具体的効果 | 完了証拠 | 重複/境界 |
|---|---|---|---|---|---|---|---|
| D01 | App-Reachable Input / input projection | 採用＋現raw契約へ改造 | emlis_ai_current_input_bundle.py、source_kernel、N._material | S→N、P/Aは各source adapter | 欄/カテゴリ/感情/記録時点と出来事時点を取り違えず実app入力へ接続 | 実RN/API由来shape→同private材料→同出力の対応。架空caseだけを実入力適合へ昇格しない | S07/D02/D03を共有。Emlis固有inputは専用 |
| D02 | original/supplemental/history source role | 採用・接続不足を改造 | S、N._answers / prepare_natural_reply | 三中核source責務＋Q更新 | 補足や過去で原入力を上書きせず本人情報とAI文脈を分離 | 原入力不変、補足別source、問文が本人事実にならない、履歴訂正/失効時の再読 | D27/D29/D50と重複。role検査ownerは一つ |
| D03 | exact evidence span/range/hash/provenance | 採用＋自由文/graphへ適合 | emlis_ai_evidence_ledger_service.py、S.freeze系、P/A source | S＋current品質照合 | 生成の意味を元根拠へ戻す。文字一致だけで意味正解としない | offset/Unicode/同文反復/別欄改変拒否＋主体/否定/時点の実照合 | D15/D28/D50と同じ原文hashを共用 |
| D04 | Semantic Obligation Inventory一般 | 改造 | semantic obligation inventory v3、CMEE SourceOwnerUniverse/ExperiencePlan | Sで根拠付き責務→N/P/A固有採否 | 残す意味・許容省略・unknown・禁止追加を現在の商品に合わせて扱う | 重要意味の追加/消失/確定化を区別、短い受取りや一度の言換えを不当に拒否しない | D10/D12と責務の選択/順序を分離 |
| D05 | Emlis固有観測/Reception/depth | 改造 | Mのgrounded plan/reception、N.SYSTEM_MESSAGE | Emlis候補生成・品質評価 | 本人宛で自然に受け取り、深読み・比率を固定しない | 最低応答基準で全候補読解、同型定型や不要助言の偏りが減る | S08/S10/D17/D24。旧二段強制は復帰しない |
| D06 | semantic units / meaning nodes | 改造＋既存型再利用 | M.emlis_input_specific_meaning、A/P semantic admission | CMEE意味候補/評価の共通責務、各core projection | 語一致でなく誰/何/状態/選択/未確定の単位へ読む | 自然文の省略/言換えを含む未知題材で単位保持、分析graphと本人sourceを区別 | D07/D14/D45。共通schema凍結は実二consumerの一致後 |
| D07 | relation/predicate/argument/scope/polarity/time | 改造・重点 | M、relation inheritance tests、A semantic graph | N意味検査＋A関係＋P意味保持 | 主体反転、否定述語混線、事前/事後、希望と実行の変化を検出/改善 | 単独語一致でも誤る自然な対比群、正しい言換え受理、修正前後のactual差 | D08/D21/D36/positive mutationと一元化 |
| D08 | unknown/open slot/ambiguity | 採用＋自然文へ改造 | source_kernel/M/Q/A UnknownGap系 | 全coreのepistemic責務＋必要問い | 本人認識/推測/不明を事実へ昇格しない | 本人不明と解析不能を分ける、保持すべき不確かさが出力/訂正後にも残る | D09/D22/D26。unknownだけで毎回ASK/全面拒否しない |
| D09 | forbidden inference / negative knowledge | 採用＋対象粒度を改造 | G.overclaim_diagnosis/grounding、M、N.SYSTEM_MESSAGE | core別品質判定/必要なruntime拒否 | 原因/人格/診断/意図/未来の未根拠追加を検出 | 明示事実/本人認識/妥当な受取りを区別。引用のある誤因果も落とす | S10/D20/D51。文体好みを危険判定へ混ぜない |
| D10 | Content Selection一般 | 改造 | content_selection_v3、M candidate selection/ExperiencePlan | 各商品生成前選択＋N候補評価 | 何を返すか/省くか/未決にするかを商品価値に結ぶ | 中心維持と許容省略、重要unknown/対比の欠落、同じ負荷対象偏重を実本文で比較 | D04は責務母集団、D10は今回選択、D19は候補選択 |
| D11 | Emlis sufficiency / depth / NORMAL LIMITED ASK | 改造 | M選択/Q、現N初回reply | Emlis本文/問い判断 | 短い日常には短く、情報量に応じた受取り。問いで弱さを隠さない | 短文/相談/不明で適切な出力、無質問ENDと必要一点ASKを区別 | D05/D26。旧availability率や固定深さを復活させない |
| D12 | plan-before-surface / duty binding | 改造 | M Observation/Sentence/Reception plans、G.sentence_plan | N自由文生成の意味条件、P canonical/visual、A graph projection | 本文へ重要意味が実際に出るよう制約し後付け整合を防ぐ | 同一意味条件→actual本文/図の対応、metadataだけ一致する失敗を検出 | D04/D10/D16。旧5段全packet強制とは別 |
| D13 | Emlis visible block order | 履歴形式は保持・現在の一応答へ改造 | 旧two_stage、N natural reply | 現Emlis表示/保存DTO | 本人宛で読める応答を保ち、不必要な見出しやJSONを出さない | 現実機の同一保存本文が再読され、旧saved DTO互換維持 | S08/D25。同じ二段文面を全coreに要求しない |
| D14 | typed AST / intermediate structures | 必要型採用＋旧AST改造 | contracts.py、M、A/P typed graphs | 責務を分けた内部型 | 本人sourceと候補意味/生成物/品質判断の混同を防ぐ | 型/版/refs検査＋実意味整合。型成立を理解成功に換算しない | D06/D50。旧AST class全bytes移植は不要 |
| D15 | semantic anchors / must-keep | 改造 | G.must_keep_coverage/evidence、M、P/A evidence | 独立意味照合とcore別coverage | 表現が変わっても重要意味・条件・不明が残るか確認 | 同義語/省略許容と意味落ちの境界、surface quoteだけの偽成功をreject | D03/D04/D21/D44/D45で同じ証拠を再計算しない |
| D16 | plan-bound realization一般 | 改造 | M sole author責務、P/A compiler→sole realizer | Nは4B候補＋CMEE採否、P/A現作者 | 最終出力の実意味を本人根拠/採用意味へ結ぶ | 変異した意味が意図した可視箇所へ出て非対象意味が保持される | D12/D28。作者を二重にせずplanメタだけで合格不可 |
| D17 | Japanese naturalization / voice / repetition | 改造 | 旧natural_surface/grounded_sentence/reception、G.coherence/template、N | 4B自由文の学習/生成/比較 | 現在の自然な本人宛応答を改善、旧有限定型へ閉じない | 文法/語り手/一人称/不要反復/異題材偏りの全文読解、短い言換え許容 | D05/D18/D24/D37。旧完全語句期待の正解化を避ける |
| D18 | multi-candidate generation | 改造・保持対象 | 旧NLS candidate set、current runner/realizer知識 | V候補比較→必要時runtime候補生成 | 同じ意味で自然さの異なる候補を比較し単一弱候補への固定を避ける | 同一入力/意味条件/モデル版、候補別意味保持と人読、費用/遅延/多様性 | D19。全通常返信を無条件多callにはしないが能力は省かない |
| D19 | candidate comparator / selection | 改造・保持対象 | 旧candidate comparator、G.result、M selection | CMEE source/意味妥当性→品質選択 | 自然さ点で意味誤りが勝たず、最適な受取りを選ぶ | 意味invalid排除、同義候補同士の選択説明、同点/不明/全不適格の扱い | D10母集団選択と区別。model自己confidenceを唯一根拠にしない |
| D20 | hard semantic validation | 採用＋現構文自由度へ改造 | G guards、M gate、A/P semantic admission | 共通責務＋core専用意味検査 | 意味追加/破壊を見つける。弱い文章をただ全面非表示にしない | 実誤り検出と正常言換え受理の両方、判定不能を正解/誤りへ断定しない | D09/D21/D22。形検査と意味判定を別status |
| D21 | body-only inverse / completed text reverse | 大きく改造可・重点 | emlis_ai_grounded_observation_gate.py / sentence_surface body parser、independence tests | 現4B自由文を独立読取→原入力と照合 | 生成側の自己申告graphが正しくても本文が誤る失敗を防ぐ | 本文だけから主体/述語/否定/時点/留保/感情所有を読み出し、原文比較。forward witness参照禁止の変異試験 | D03/D07/D15。旧632KB gate全体call/旧出力文法の強制は不要 |
| D22 | abstention / UNAVAILABLE / fail closed | 採用＋拒否粒度改造 | EngineOutcome、N provider failures、既存service | 現outcome/保存/表示 | 取得失敗・形式不正・意味不正・判定不能を混ぜず古い本文を新意味として返さない | 中断/再読/明示再試行/未確定結果が整合、入力や保存済み本文を失わない | S19/D08。語法品質の低さを全てhard blockにしない |
| D23 | observation taxonomy | 改造 | 旧観測duty/grounded plan | V教材coverage＋Emlis商品選択 | CURRENT/RELATION/CHANGE/INTENTION/CONSTRAINT等を読み分ける | 分類labelを返すのでなく実本人宛応答/必要問いに効く | D05/D10。分類そのものを商品出力へ貼らない |
| D24 | Human Reception binding | 改造 | grounded_human_reception.py、N current prompt/training | Emlisの自然な受取り | 誰の何を受け止めるか、本人/他者/Emlisの感情を混ぜない | 別題材でも同じ締めに偏らず、観測反復を増やさず本人宛となる | S10/D05/D17。旧target+attention+whyの固定作文は継承しない |
| D25 | observation / Emlis follow product roles | 現在仕様へ改造 | 旧2層契約、N | 現一つの本人宛応答＋saved互換 | 受取りと観測の意味役割を保ち二重説明を避ける | 最新最低線に従う本文読解。長さ/比率/節の固定なし | D13/S08。旧形式の強制は履歴 |
| D26 | question need / one-point / burden | 改造＋新naturalへの接続設計 | emlis_question.py、Q、source未知/曖昧 | 現Emlis問い合わせ責務 | 本人にしか確定できず意味が変わる一点を質問、不要なら終了 | 実pending→本人回答→更新→終了。反復質問・質問圧・原因誘導を検証 | D08/D11/D27。旧ASK率目標や常時質問化は不採用 |
| D27 | supplemental answer refinement | 採用基盤＋接続改造 | emlis_answer_update、Q、N._answers | current natural/thread→P/A本人補足材料 | 回答分だけ理解を更新、原入力/AI文/本人訂正を混ぜない | ADD/REVISE/WITHDRAW/併存・依存関係・保存中断再開・完成非生成再読 | D02/D26/D50。新naturalで未接続の分を完了へ数えない |
| D28 | positive realization trace | 改造 | CMEE VisibleUnitTrace/positive trace、M、A/P evidence | 採用意味→actual可視文/図/画像への対応 | メタだけ生成して本文に出ない問題を検出 | visible単位ごと根拠/意味/版の対応、metadata-only wrappingの拒否 | D03/D12/D15/D16。同じtraceを別台帳へ重複しない |
| D29 | private body-full / public body-free | 採用＋情報最小化 | S01/S02/X01、existing errors、N.NaturalReplyError | private評価束と公開summary | 改善担当は実全文を読めるが公開GitHubへ本人原文/秘密を出さない | private全結果との対応、公開payload漏れ0、error/trace/logの本文漏れ確認 | S01/S02/S11/X01を同一評価保存責務へ |
| D30 | current100 corpus / app input identity | 評価資産として改造 | current100 fixture/manifest/runner、bridge test | V回帰・旧失敗再現群 | 旧教訓と新4B題材の比較母集団を保つ | 由来/既使用/教師/未知を区別、旧100成功を新一般品質へ換算しない | D31/D35/D37。新毎call runtime前提にはしない |
| D31 | batch cumulative regression | 改造 | current100/G8 runner、existing trial runners | Vfocused＋節目batch | 局所修正が既改善を壊さないか確認 | 変更原因群＋既成功controls＋未使用題材。同一case/actual版比較 | D30/D32/RegressionSelector。毎小変更full全量必須は退役 |
| D32 | changed-output reread | 採用 | 旧product read tooling、current reading_review/README | V同一保存版の前後レビュー | 変更本文を実際に読み合否を更新する | 変わった全本文と必要controlsを全文読取、旧reviewを新本文へ流用0 | D34/S11。hash一致だけで読了しない |
| D33 | machine/human separation | 採用 | 旧G6/incident/current outcome/results | 全core受入境界 | 型/保存/JSON/引用一致と本人に伝わる品質を分ける | 機械・華恋screen・Mash受入れ・実機を別欄で記録 | S03/S05/D34。新承認連鎖system不要 |
| D34 | Emlis Product Read axes / full body | 現在基準へ改造 | 旧12/13軸、最新weekly§17/18/19 | V Emlis品質評価 | 意味保持/自然さ/本人宛/不要反復/再利用価値を実文で判定 | 全候補screen・残差・本人受入れを区別、短い返事や一度の言換えを許容 | D05/D17/D32。旧必須depthや観測:follow比は不採用 |
| D35 | recurring failure / before-after / causal localization | 改造・全範囲保持 | G3 failure localization/Gate0 B0–B7/old trial issue families | V→actual owner最小修復 | 復唱/所有/対象/否定/時点/留保/関係等を共通原因へ束ねる | 失敗群→仮説owner→反証的case→修復前後のactual改善と残差 | S06/D36/D37。case名へのpatch列増殖を避ける |
| D36 | lexical/attachment authority matrix / blockers | 知識/negative vectorsへ改造 | NLS relation/attachment/mutation modules、inheritance tests | 意味照合・教材coverage | 日本語の係り受け/引用/省略/開いた役割の失敗を再利用 | 現自由文で正しい省略を通し誤結合を落とす、未解決を明示 | D07/D08。旧251-owner formal admission全体を通常返信必須に戻さない |
| D37 | natural failure / anti-template / severity corpus | 改造 | 旧100/private failure、G.template_echo、最新actual trials | V学習候補/回帰/分布比較 | 自然さと誤読を対比し少数例暗記を避ける | 評価原文→教師への無断流用0、派生/既使用/新規の区別、意味/文法/偏りを別判断 | D17/D30/D35。旧固定正解文への一致を目標にしない |
| D38 | PR2 semantic/relation/mutation overlap | 必要concept/symbol/tests抽出 | PR2旧実装、PR3 inheritance tests | 既存CMEE単一owner | 二重実装を避け旧検証を現在の意味責務へ回収 | symbolごと受け先/削除or参照のみ/変異vectorを記録、現経路で実行 | D06/D07/D14。whole module保持と同義でない |
| D39 | large recovery/natural surface/semantic overlay | 責務を分解改造、塊は履歴 | large recovery builder、old natural surface | D04–D28の各現owner | 有用読解/逆検査/比較を救出し旧出力方式の制約を解く | wrapper/copy/import/callで大型moduleを現役化0、各責務実入出力証拠 | D38/D40/旧8層。内部利用していないだけで放棄認定しない |
| D40 | independent second active NLS engine | 退役/禁止 | PR2 direct ingress、E current dispatcher | CMEE各coreの唯一owner | 混在した候補作者/旧fallback/鏡像生成を防ぐ | 現runtimeの実callgraph/dispatchで単一採否と作者責務、saved互換は別 | D38/D39。code削除より先にunreachable確認 |
| D41 | old steps/RC/snapshots | 履歴保持 | historical baselines/Git history/audit | V知識source | 失敗と採否を復元できる | 原bytesと当時結果維持、現在のnext/authorityに自動復帰しない | D30/D35。必要資料を現複製しない |
| D42 | long Gate/Receipt/authority/handoff chain | 旧常時運用退役、必要記録採用 | S04/S14/S16/S17/S23 | 既存checkpoint/versioned評価束 | 成果消失/結果混同を防ぐ最小記録を残す | 一つの実行結果/参照で再開可能、同eventの多数重複記録なし | S23/D29/D50。記録全廃ではない |
| D43 | G0–G10 checker/controller/executor/FD/transport | shell退役＋有用pure部品を個別改造 | S18–S30、optional C | 比較/再現/結果整理の限定責務 | 環境差・破損・別重み混在の実障害を短く識別 | 差分入力/予想/実値/影響が1回で確認でき、通常生成の前段連鎖なし | 32family表を参照。whole外殻復活0 |
| D44 | reverse verification adapted to Piece | 改造・必要全責務 | P source/semantic/author-free、G must_keep | P canonical text＋recipe＋PNG＋saved/export | 本人の核/条件/否定/人物抽象化と読める画像の一致 | 同版原文→canonical→recipe→PNG→保存/再読/持出し、意味変異/欠け双方を確認 | D03/D15/D21。Emlis文法を共通化しない |
| D45 | reverse verification adapted to Analysis | 改造・必要全責務 | A source/admission/compiler/sole realizer/cumulative | A graph/本文/図/根拠/unknown/IF | 引用が正しくても役割/選択/関係が誤る失敗を見つける | node/edge/方向/時点/留保/撤回/併存→source根拠、図と詳細・累積/月次の同版再読 | D06/D07/D08。IF/Savedは現在未完を維持 |
| D46 | external natural expression provider | 現在承認済4Bへ改造済基盤を採用 | N SelfHostedNaturalReplySource、model_candidate_source | 承認済自己host4Bのみ | 自然文/意味候補を得る。providerを本人事実/意味採用ownerにしない | 実endpoint/model/adapter/prompt/finish/期限/費用と候補の対応。新provider選択は別商品判断 | 旧8/17時点未採用statusを現在へ流用しない |
| D47 | Cycle001 candidate ingress cutover | 独立履歴/契約保持 | 08_cycle001_current_state/old bridge | 現設計の品質改善とCycle契約を分離 | 新能力再利用が旧acceptance条件を書換えない | 必要となる時fresh current ownerで判断。今回の設計だけでCycleをPASSへしない | D30/D40。新全通常経路前提にはしない |
| D48 | production one-owner cutover | 現稼働との整合設計 | service/factory/config/current deployment | 現N/P/Aの必要箇所のみ段階反映 | 新意味検査の誤判定/遅延を実利用へ無検証で持ち込まない | 候補比較→offline適合→必要範囲配置→現版保存再読/中断と品質確認 | 旧I5切替手順をそのまま現runtimeへ当てない |
| D49 | asset migration manifest gap | この全表＋実装時symbol表で閉じる | 原D51/32family/current source/tests | 同一GitHub詳細設計と各実装差分 | 必要assetの取りこぼし/二重owner/設計だけ完了を防ぐ | 全D51/S32/8層crosswalk、exact symbolごと利用/改造/履歴/退役と実test結果 | 独立恒久controller/新Receipt familyを作らない |
| D50 | artifact/schema/version/parent lineage | 採用＋結果比較へ改造 | contracts/artifact identity、source_prefix、saved DTO/RPC | 全core保存とV比較 | 別重み/入力/旧本文の評価を混ぜず訂正前後を扱う | source/prompt/model/adapter/grammar版＋actual出力対応、変更時旧review無効化、保存非生成再読 | D03/D28/D29/S11/X01。hash一致を意味品質へ換算しない |
| D51 | separate Safety triage/owner | 採用・既存owner維持 | emlis_ai_safety_triage、N._source_safety | 現Safety境界＋core責務 | 高配慮材料と通常観測を混ぜず既存動作を壊さない | 原入力/補足/訂正/履歴の実triage、通常/安全outcomeと公開表示の整合 | D09/D22/S10。新安全補助systemを独立構築しない |

### 13.3 原32系列と外殻内の回収対象

S01–S32を全て判定し、X01は原監査同様に横断実装として扱う。『外殻退役』はその中のpure計算/比較/診断/negative testまで廃棄する意味ではない。部品単位で現実の不足、既存重複、採用先、実効果を確認して改造する。

| ID | 原系列 | 判定 | D対応 | 回収する能力/部品 | 現在への適合 | 完了証拠 | 継承しない旧運転 |
|---|---|---|---|---|---|---|---|
| S01 | body-free / public-private | 採用＋形式を現束へ適合 | D29/D50 | 公開payload key/value検査、secret非掲載、本文なしerror | private実全文と公開summaryを別責務で対応。漏れ検査を既存保存/runnerに組込む | 本文/credential/URL等の公開漏れ0、private再読可能 | body-freeだから読了/品質合格という昇格 |
| S02 | local review root/export/scoped allow/purge | privacy責務採用・旧承認shell退役 | D29/D32/D34 | private bundleの保管/保持/削除・対象範囲 | 現在のprivate保管と権限で実全文を扱う。不要な複製を減らし保持根拠を残す | 必要原本の回収/版照合とretention、原文未読を読了扱い0 | 旧R47/R50/R51 allow token/blank sidecarの連鎖 |
| S03 | human provenance | 採用 | D33/D34 | 機械評価/華恋screen/Mash受入れのrole区分 | 現在のtrial/設計/商品判定に同じ区分を使う | AIの評価をMash実受入れへ代作0、誰がどの版を読んだか対応 | 人未供給なら全ての日常開発停止という旧運転 |
| S04 | no-promotion/manual handoff/retry | 原則採用・旧step chain退役 | D22/D33/D42 | 結果種別、未実行/結果不明、適格な明示再試行 | 現service/評価のoutcomeに統合、結果不明の二重生成/二重writeを避ける | actual結果と記録が一致、成功前提の自動再write0 | OP毎Result/Receipt/Handoff/新承認family |
| S05 | P7-PQR actual Product QA | 評価軸/actual material改造、旧Gate退役 | D30–D34 | 本人が読む材料を実際に揃える責務、技術/人読分離 | 現4B出力・図・画像の同版実物をV比較へ渡す | blank sidecarでなく実本文/実画像を読了、残差記録 | I0–I6全起動手順・1797検査を新前提にする |
| S06 | Gate0 FailureClosure B0–B7 | 因果局所化を改造 | D35/D36 | failure taxonomy、owner/reachability、current-owner reproduction | 失敗→共通原因仮説→現実call先→positive対比→修正へ返す | 反例を含む実前後結果で原因仮説を支持/棄却 | 全closure台帳/旧172checkを独立完成目標にする |
| S07 | Evidence Ledger/lineage | 採用＋現sourceへ適合 | D02/D03/D15/D28 | canonical spans/nucleus/relation lookupのpure関数とtests | 既存Sが唯一の本人原文owner。P/A/N評価で同じ参照を使う | Unicode/別field/別version/ref改変検査、意味照合との区別 | 語のlabel/confidenceを本人の意味確定に使う |
| S08 | always two-stage display | 意味役割を改造・literal形式は履歴 | D05/D13/D25 | 観測と受取りの役割、旧saved本文の互換知識 | 現naturalは一つの本人宛応答。保存済み旧表示は再生成せず表示 | 最新表示仕様・同一保存本文の再読。余計な節/重複が増えない | 毎回二段label、固定比率、全core同形式 |
| S09 | restatement/runtime visible guards | 現基準へ改造 | D17/D20/D25 | 台帳読み上げ・不自然反復・空本文・順序診断 | 現一返答の文法/語り手/反復の評価へ。高確度形式のみruntime | 短い受取り/一度の言換えを通し意味誤りを別に検出 | 旧section label各1回、echoだから全面拒否 |
| S10 | Reception distinctness/human voice/Safety | 改造＋既存Safety採用 | D05/D09/D17/D24/D51 | 感情所有/未根拠追加/引用集中/分布/voiceの検査知識 | 現自然文への受取り評価＋batch分布。本人/他者/Emlisを分離 | actual本文で所有・意向・怖さの未根拠化を抑え、自然さを全件読む | 13軸旧比率/長短/closing閾値を無条件runtime化 |
| S11 | hash-bound review/stale invalidation | 採用＋版比較へ改造 | D32/D50 | 評価対象identity、本文変更時のreview無効化 | source/context/prompt/model/adapter/policy/output版をV比較へ結ぶ | 前後本文一致/差分とreview対象が一意、別出力へPASS流用0 | hash一致を品質正解とみなす、公開raw body hash常時要求 |
| S12 | device/runtime/display evidence separation | 採用・既存確認へ統合 | D34/D44/D45/D48 | clipping/scroll/順序/実画像とbackend本文の区分 | iOS/Android採用候補の既存実機確認、同版画像/図/詳細 | local/RN stub/実機/端末保存・共有を別に記録 | 毎小変更Mash実機操作必須、旧representative4/exact8の恒久Gate |
| S13 | NLS candidate/inverse/fail-close | 大幅改造 | D04/D07/D14–D22 | 候補identity、意味/関係/unknown、逆検査独立、no-valid | 現4B自由文の独立読取/候補妥当性/選択。P/Aへ専用改良 | 意味変異と正常言換え、全不適格/判定不能の適切処理 | 旧AST/節数/有限parser/過剰fail-closeをそのまま適用 |
| S14 | Cycle closure/recovery/current route | current記録は保持・旧日常chain退役 | D30/D41/D42/D47 | 唯一の現在地、原本/結果/残件、過去結果不改変 | 現週次・trial・設計の必要記録とCycle外部契約 | fresh資料から再開できる、Cycle未完を勝手にPASS化0 | G0–G10/Epoch全再起動/旧nextの復活 |
| S15 | scope/cardinality/depth/witness | 責務改造 | D04/D10/D12/D15/D28 | optional/required分離、独立検査witnessと選択責務の分離 | 現在の許容省略/意味変化/差分範囲を扱う | 語数やduty数でなく重要意味/非対象意味が保たれる | 旧exact cardinalityやCONTENT_DEPTH_ONLYの権限代用 |
| S16 | RED/protected tests/preimage | 因果試験と原本保持を採用 | D31/D35/D36/D38 | before failure、変更対象意味、negative controls、履歴不改変 | 現自由文のpositive/metamorphic testと実本文比較 | 修正前に失敗/修正後改善＋既改善維持。現仕様への期待変更は理由を残す | freeze/refreeze毎の別承認/Receipt/proof chain |
| S17 | ledger/reservation/owner graph/atomic publication | 有用state責務抽出、旧台帳shell退役 | D27/D42/D50 | 冪等性、二重消費防止、parent版、atomic commit、曖昧成功 | 既存thread/meaning checkpoint/保存RPC/生成jobの現ownerを再利用 | 中断/二重要求で候補/保存枠/更新を二重消費せず同版再読 | exact134等の巨大ledger/success graphを再構築 |
| S18 | source/runtime/manifest identity closure | 必要identityを条件付き抽出 | D03/D43/D50 | source/prompt/model/adapter/依存版比較、hash/manifest差分 | C/Vの候補比較・保存重みreload・実障害再現 | 違う実行条件を同じ改善へ混ぜず、必要bytesから再現可能 | 全root/19identity/full wheel closureを全生成前に要求 |
| S19 | terminal grammar/RESULT_UNKNOWN | 採用・現outcomeへ適合 | D22/D42/D50 | stop/length/timeout/cancel/error/unknown、body-free reason | 現model finish/HTTP/保存/再開の結果整理 | 途中結果を成功としない、保存済み結果を無根拠再生成しない | 一文字stderr差を新authority作業へ変える運用 |
| S20 | GitHub contract/postverification | 現契約採用・旧transport履歴 | D42/D49 | target path/content/version/changed pathの確認 | rootの現GitHub反映contract。商品runtime責務と別 | 保存した設計/変更が対象pathで読める | 特定SSH/exact lease/directchild/fulltreeを必須にする |
| S21 | Publication Guardian | whole退役・pure検査は必要なら抽出 | D43/D49/D50 | strict JSON/duplicate key reject、path/mode/blob整合、untrusted入力をshell展開しないtests | 現candidate parser/保管packの既存検査で不足が実在する時にreuse | 新候補/manifestの重複key/不正path等を確実に拒否、既存との重複なし | Issue/actor approval/Actions publication/remote-first authorityの復活 |
| S22 | model/environment/Work route | 実測/責任区分を採用・旧UI Gate履歴 | D33/D43/D46 | 実使用model/adapter/実行環境、能力を実確認 | C/V比較とrootの現実作業route | 別model生成/学習/CPU診断/実GPUを混同せず版が追える | 旧model名/UI表記そのものを新停止機構にする |
| S23 | durable checkpoint/handoff/current owner | 採用・重複縮小 | D29/D41/D42/D49/D50 | actual bytes保存・最小manifest・明確なresume | 既存trial/週次/設計/GitHubまたはprivate原束 | scratch消失後に原本/結果/次作業を復元、hashだけにしない | event毎にResult/Handoff/Plan/07/08を全部増やす |
| S24 | observer/analyzer/helper/launcher trust | 独立検査思想・pure比較を抽出、chain退役 | D21/D35/D43 | forward結果に依存しない独立reader、差分/投影/正規化検査、negative vectors | 現自由文逆検査/実意味比較とCの必要部分 | forward planを盗用しない検査、同一誤実装の相互承認を避ける | V1–V16 launcher/lock/catalog/authority連鎖・未実証自動原因診断 |
| S25 | Inspector/scanner/harness | whole退役・失敗知識保持・pure部品個別評価 | D35/D43 | bounded入出力・既知failureを未到達と分けるnegative tests、破損検出の知識 | 既存toolに具体的不足があれば小関数/testとして取り出す | 採用symbolの現実効果を別途証明。旧Inspector未実行=品質成功0を維持 | Inspector本体/scan harnessの復活を再利用の目的にする |
| S26 | Gate A/B/C runtime admission | identity照合/独立比較を条件付き抽出、Gate退役 | D43/D50 | 環境差が結果に関わる時の依存/重み/入力比較 | Cの一回比較/実障害診断 | 具体的差と出力への影響が記録され、通常生成を止める新Gateなし | A→B→C readiness連鎖/旧admission authority |
| S27 | installed manifest comparator/mismatch diagnostic | pure comparatorを改造・条件付き採用 | D43/D50 | expected/actual集合、missing/extra/hash mismatch、説明差分 | model/adapter/prompt/評価pack/必要依存の版比較 | 改変/欠落/余分fileを局所化、同一重みのreloadなど実問いへ答える | 一致させること自体を商品完成目標にする/毎回installed全走査 |
| S28 | runtime checker/distribution reconciliation | 有用導出/比較/testsを抽出、whole checker退役 | D43/D50 | distribution側とfilesystem側の違う導出、canonical診断、既知不整合vectors | C/Vの候補bundle/実依存不整合診断 | 自己申告metadataとactual fileを区別して必要差を検出 | exact19/5責務全checkerを自然応答の入口に固定 |
| S29 | runtime preparation controller/acquisition/materialization | 最小再現手順/lock知識採用、controller退役 | D43/D46/D50 | 必要依存固定・重み保存/取得後検証・再取得不要の知識 | 現在GPU/CPU runnerの再現inputsと準備手順 | 候補重み/prompt/adapterを復元して同条件評価できる | 新controller/exact7/exact18/私的egress証明/全runtime準備連鎖 |
| S30 | FD9/credential drop/exec proof | 通常不採用・有用pure境界のみ条件付き | D29/D43 | bounded stdin/stderr、safe error allowlist、secret非漏出、file整合negative tests | 既存HTTP provider/errorとprivate評価toolに必要があれば適合 | エラーに本文/秘密が出ず、切断/過大入力/実file改変が明確 | 現selfhost4BへUID/GID/execve/FD proofを前提追加 |
| S31 | Pro/Ultra/Rule18 lifecycle | 現責任区分採用・旧authority shell履歴 | D33/D42/D49 | 設計/実装/商品判断、承認範囲の区別 | 現ユーザー指示で必要scopeを進める。root最終統合/書込 | 設計のみで実装/配置/受入れに変換せず、既承認の再質問なし | 旧exact approval bytes/activation/consumption連鎖 |
| S32 | necessity/product delta/minimum boundary | 現目的として採用 | 全D/S | 商品結果に効く必要性・既存との重複・中止判断 | 今回ユーザーが必要asset改造の労力を許容。量で切らず価値で採否 | 実本文/画像/図の改善と残差、比較/検査だけの独立完成にしない | 『小さいから可』『大きいから不可』という便宜的範囲制限 |
| X01 | exact100 private/HMAC evidence | 横断部品採用/改造、独立系列に加算しない | S01/S11/S14/S26・D29/D30/D50 | private/public対応・no-overwrite・例外会計・manifest/hmac | Vの必要評価束、重み/生成結果対応 | 原本再読/改変検出/公開summary一致。意味品質は別に全文確認 | 全通常返信でHMAC/fullsource closureを必須化 |

### 13.4 原8層と追加活用案の対応

| 原8層/提案 | 回収/改造する内容 | 今回の現product接続・評価 |
|---|---|---|
| L1 Semantic Evidence / Authority | 原文・本人/他者・述語項・条件/対比・否定/時点・認識/不明・関係のgrounded candidate、競合解釈 | 既存Sを材料正本にN/P/Aの意味保持検査と採用候補へ。生成本文やcategory名を本人事実へしない |
| L2 Plan-Owned Surface | 選ばれた意味が実際に出力へ現れる責務・sole author・後付けspliceの失敗知識 | 現4B自由文を保つ。旧二段/行数/phrase grammarを新packetへ偽装して強制しない。Pは§7.1の4B候補をCMEEが採否確定し、旧作者との文字列一致を要求しない。Aは現compiler／realizerを使う |
| L3 Causal Failure Localization | failure axes→共通原因仮説→実source owner→修復範囲→反例/controls→actual before-after | 単なる問題コード集計から修正までつなぐ。current100コードは人の注釈検証であり自動原因発見済みとはしない |
| L4 Causal RED/GREEN | 意味要素を一つ変え、意図した可視箇所が変わり他が保たれるpositive/metamorphic試験 | 値参照/例外/台帳の一致を本文実現成功の代用にしない。主体・対象・否定述語・時点・認識・unknown・関係方向の変異 |
| L5 Human Product Read | 意味・自然さ・本人宛・関係の読みやすさ・不要反復・伝わり方、machineとの分離 | 現最低線へ適合。長さ/深さ/二段/比率を固定せず、短い受取り・一度の言換えも許容 |
| L6 Batch / Evidence Envelope | 母集団/教師/既使用/新題材の由来、選択/no-valid/unavailable、全出力読解、private/public対応 | 必要なbatchと節目比較。旧case/旧PASS/旧fail-close率を現在の品質へ移さない。分母/再利用/重複を明示 |
| L7 Reproducibility | 入力・prompt・model/adapter・依存/環境・重み・raw・finish・時間/費用・manifest差分の再現 | 実4B比較/保存reload/原因不明差の検証へ使う。全root証明を通常応答前段へ置かない |
| L8 Governance / Publication | 実結果と未確認を分ける状態、保存原本、必要な反映後確認・再開情報 | 既存記録/保存を使う。旧authority activation/consumption/proof-of-proof/controller群は再起動しない |
| candidate tournament | 同一入力/意味条件で複数候補、意味hard validity→自然さ/本人宛/密度等の比較 | Vの比較能力を必ず残す。通常で候補数を増やすかは実際の品質増分・遅延・費用から決める。語尾ランダム化ではない |
| diversity / distribution | opening/文骨格/述語/closing/受取り対象・act集中、同topologyでの意味/表現差 | batchの異題材過集中を検出し教材/選択/生成原因を修復。多様性のため意味や正しい短文を改悪しない |
| semantic/version diff | 保持/追加/消失/確定化した意味、主体/対象/関係/時点/受取りの変化、severity/availability差 | 同一source/version上で比較。原文変更とモデル変更、対象変更と品質変化を混ぜない |
| corpus curator / regression selector | topology/感情/否定/省略/引用/複数欄/長短/unknown/思考行動差/複数人物のcoverage | 変更した意味責務に関係する群＋既成功controlsを選ぶ。全件毎callを必須にしない。教師への評価流用を区別 |
| model/algorithm bench | 同材料・同meaning comparison・同読解基準でprompt/model/adapter/候補選択を比較 | model名/学習loss/JSON成功で採否を決めない。今の自然さと旧意味保持知識を両方使う |
| question need / feedback learning | 未確定の意味が回答で変わる一点、本人補足/訂正/撤回、更新後END、過去frameの暫定性 | new naturalへの実問い・回答後理解更新が未完。解析器の能力不足を本人へ質問転嫁しない |
| longitudinal analysis / change | 同一人物の場面/対象/役割/基準/選択/結果を時点/根拠付きで比較 | 全期間累積/月次当時版、撤回/併存、原記録と推定/IFの区別。P6旧labelを固定性格へしない |
| semantic-to-creative / PieceCandidateLab | 意味の核/形式適合/自然なcanonical/人物抽象化、複数候補比較、recipe/PNGとの整合 | 他者が単独で受取れる作品。原文保存の正常例をechoという理由だけで拒否しない |
| cross-core consistency / source lineage | 原入力/本人補足/生成返答/分析推定/Piece共有物の資格/版/削除/訂正の反映 | EM-04/05とAN-02等の既残件へ結合。Emlis返答を本人事実へ再投入しない。本人/plan/context資格は現ownerに従う |
| complaint/forensic trace | source→候補→採否→実output→保存版の必要な経緯 | 問い合わせや実品質異常に限りprivate原本から辿る。raw本文のpublic複製/恒久trace膨張を避ける |
| quality console/dashboard/design review | 上記の比較/coverage/causeを改善担当が読める同一結果束で表示 | 今回は既存README/trialと必要な比較表示へ統合。独立dashboard構築を商品品質の先行条件にしない。必要な表示は実product修復と同unit |
| app-wide version/tier/history/device | source資格・保存/可視範囲・版・権利・端末のexisting contractと意味材料の整合 | 原計画の全体適用責務を捨てない。今回だけで通知/IAP/全app改造を新規scopeに拡張せず、既残件/現ownerへ接続 |


## 14. 確認済みsource・symbol・既存検査の対応

API `497f7008fec8935885d09d2e430499892189b5bb`で、以下のsource抜粋とsymbolを照合した。tree存在だけを確認したtestはその旨を区別する。testの存在は今回のfresh PASSでも、新naturalへの接続完了でもない。行番号はこの確認版の位置であり、再開時は現symbolを確認する。

| Asset family / D IDs | Verified source/symbol | Existing tests / evidence | Reuse/customization consequence |
|---|---|---|---|
| Source normalization / D01, D02, D03, D29 | `ai/services/ai_inference/cocolon_meaning_experience_engine/source_kernel.py`: `freeze_text_source` L997, `validate_evidence_refs` L161, `build_source_owner_universe` L309; `emlis_thread_source.py`: `freeze_supplemental_answer` L51, `admit_emlis_thread` L170 | `ai/tests/test_cmee_source_kernel_variable_cardinality.py` (tree presence); `test_cmee_nls_v3_batch001_unified_stage1_bridge.py` explicitly imports and uses source_kernel, current_input, ledger L18-75/124-148 | Keep single source admission/ownership/version guard. New evaluators consume immutable admitted material; do not invent a second source normalizer or let model output establish source eligibility. Metadata exactness proves linkage, not truth of interpretation. |
| Evidence lookup / D03, D15, D28 | `ai/services/ai_inference/emlis_ai_evidence_ledger_service.py`: `build_evidence_ledger` L289, `EvidenceSpanResolver` L74, `validate_evidence_ledger` L369, `source_text_for_span` L471 | `test_cocolon_text_generation_core_evidence.py` has span/source/field/hash retention and stable hash tests L21/62 | Reuse raw/source lookup and range duties, avoid treating lexical detected_type/confidence as meaning authority. Any transformed quote/span must resolve to original field/version. |
| Shared evidence conversion / D03, D28, D50 | `cocolon_text_generation_core/evidence.py`: `stable_evidence_hash` L58, `make_source_anchor` L116, `make_evidence_span_like` L162, `usable_evidence_spans` L215 | `test_cocolon_text_generation_core_evidence.py`: `test_emlis_evidence_adapter_preserves_span_id_source_field_and_hash`; `test_source_anchor_and_evidence_helpers_filter_unusable_evidence` | Reuse small pure conversion functions after confirming new CMEE identity compatibility. A stable hash is version linkage and not semantic verification. |
| Meaning obligations / D04, D05, D08-D12, D15 | `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`: `GroundedSourceSnapshot` L515, `InventoryUnknownSource` L411, `build_grounded_source_snapshot` L2423, `build_semantic_obligation_inventory` L3889; `emlis_ai_content_selection_v3.py`: `derive_content_depth` L633, `build_content_selection_plan` L1127 | Current100/bridge and inheritance tests below cover known finite branches; not arbitrary free prose | Extract must-preserve / optional / deferred / unknown / forbidden responsibility. New natural reply need not verbalize every source fact. Distinguish permissible compression from semantic reversal or fabricated certainty. Do not make old full inventory mandatory merely to return a short valid reply. |
| Meaning alternatives / D06-D08, D10-D12, D14 | `cocolon_meaning_experience_engine/emlis_input_specific_meaning.py`: `derive_grounded_situation_view` L773, `derive_foreground_scope_closed` L1473, `derive_difference_configuration_set` L2137, `derive_requirement_bundle_set` L3039 | `test_cmee_final_stage1_exact8_meaning_inheritance.py` explicitly tests required meaning/relation, compound source fragments, source-bound hedged unknown L382/391/409 | Preserve competing readings and explicit unknown. Separate grounded candidate interpretations from confirmed user fact. Reuse representational knowledge and tests; current finite inference code is not already a free-Japanese interpreter. |
| Difference / counterfactual tests / D07, D15, D35-D38 | Same file: `apply_counterfactual_mutation` L3567, `issue_whole_reading_consequence_row` L3602, `_derive_candidate_semantic_loss_codes` L4333, `_evaluate_candidate_hard_validity` L4500 | `test_cmee_nls_v3_relation_matrix_inheritance.py` L733 coordinated endpoint-role laundering, L2041 non-temporal/unsealed action sequence, L2248 visible inverse | Extract mutation axes and causal questions (actor/recipient swap, negation, time, uncertainty, scope, relation). New expected outcomes must match current natural text and accepted semantics. Old schema/hashes alone are not a free-prose semantic oracle. |
| Meaning selection / D10, D11, D18, D19 | Same file `select_input_specific_meaning` L5177: unique nondominated candidate required; returns None when count is not 1 L5204-5205. `project_selected_reading` L5135 retains unresolved alternatives and decision trace | Existing inheritance tests establish old owner relationships, not general quality | Keep hard semantic validity before preference scoring; competing meanings remain unknown/limited rather than selecting via smoothness, ID, or arbitrary order. Build explicit comparison on current candidate format. |
| Multiple natural-surface candidates / D17-D19, D24 | `emlis_ai_grounded_reception_candidate_selector_v2.py`: `evaluate_and_select_reception_candidate_v2` L861 hard-gates every candidate L897-938; scores only passed candidates; no valid candidate returns `v2_no_valid_candidate` L955; runtime_connected=False L963 | Prior V2 source itself is offline; not connected to current natural provider. `test_cmee_grounded_surface_owner_inheritance.py` L527 tests body inverse failure making every candidate invalid | Preserve candidate-set comparison and semantic-hard / naturalness-soft separation. Adapt old surface-plan types/metrics to current free reply; candidate count/cost and whether runtime multi-candidate is necessary must be measured. Failure must not trigger hidden provider fallback or repeat forever. |
| Plan/surface/Reception owner separation / D12-D14, D16, D23-D25 | `emlis_ai_grounded_observation_plan.py` final-stage1 builder; `emlis_ai_grounded_sentence_surface.py`; `emlis_ai_grounded_human_reception.py` (very large). `test_cmee_nls_v3_batch001_unified_stage1_bridge.py` imports exact owner chain L18-75; `test_cmee_grounded_surface_owner_inheritance.py` checks facade no independent surface call L88 and unreachable legacy compiler L492 | Tests present and source excerpts fetched; no execution | Keep who owns meaning, expression, validation, storage distinct. Extract authoring constraints and trace duties rather than restoring old two-section literal output, fixed ratio, or phrase grammar. Current natural recipient reply remains the reply author; independent evaluator cannot rewrite user facts or become hidden second author. |
| Body-only inverse / D20, D21, D44, D45 | `emlis_ai_grounded_observation_gate.py` `evaluate_grounded_surface_body_inverse` L7110; docstring L7118-7123 states body-only parser, independent plan matching, no forward parser witness. It checks exact section order and line count L7148-7153. `evaluate_emlis_model_surface_inverse` L10290 is another finite model-specific seam | `test_cmee_grounded_surface_owner_inheritance.py` L527; `test_cmee_emlis_mixed_unknown.py` L178 `test_body_inverse_rejects_loss_without_using_the_author`, L201 coordinated reseal unknown borrowing/erasure | Strong reuse target, substantial adaptation necessary: old checker requires observation/reception sections and plan counts which current natural reply intentionally lacks. Preserve independent visible-output reading, source-bound meanings/unknown and mutation rejection. New comparator must tolerate correct paraphrase and allowed omission and expose uncertainty of its own reading. |
| Unknown preservation through answers / D08, D26, D27 | `emlis_question.py` `question_candidate` L305, `validate_question_binding` L387, `model_question_candidate` L431; `emlis_thread_source.py` independent supplemental source | `test_cmee_emlis_mixed_unknown.py`: initial qualified unknown L92, answer keeps/expires duty L125, inverse loss L178, updated reader answer reception L234 | Reuse original/answer separation and target-scoped refinement/withdrawal. Current natural first reply does not itself provide live question/refinement capability; design must connect after meaning/update acceptance, preserve explicit unknown that is not the question target, and avoid compulsory questions. |
| History/frame limits / D02, D26, D27 | `emlis_thread_history.py`: `OwnedHistorySourceV1` L15, `FrameFeedbackSourceV1` L22, `InterpretationFrameV1` L37, `admitted_history_plans` L60, `derive_interpretive_frames` L86 | Source symbol presence checked; behavior not fully re-audited in this subtask | Keep eligible source/feedback roles, temporary interpretation and correction. Adapt semantic relevance and version differences; a past label is not current identity/fact. This is necessary future integration, not claimed complete by old structs. |
| Shared guard subsystem / D09, D20, D22 | `cocolon_text_generation_core/composer.py` `CoreTextComposer` L59; `_run_guards` L72 invokes coherence/template/overclaim/grounding/must-keep; `generate` L102 validates caller-supplied candidate and requires all guards | `test_cocolon_text_generation_core_composer.py` (tree presence); `test_cocolon_text_generation_core_guards.py` actual test declarations and imports fetched | Existing common composer is a candidate validator, not meaning generator. Reuse reliable low-cost checks as parts; do not promote this subsystem to CMEE author or assume all old guards suit new natural text. |
| Must-keep coverage / D04, D15, D20 | `guards/must_keep_coverage.py` `guard_must_keep_coverage` L78, helper L46 uses substring or ngram_overlap >=0.24 / head-tail matching L51-61 | `test_cocolon_text_generation_core_guards.py` required role/evidence IDs L140 | Retain structural coverage and test ideas; lexical overlap cannot detect polarity/actor/time correctness. Replace/adapt semantic comparison, evaluate false accept and false reject with valid paraphrases. Do not import threshold as truth guarantee. |
| Template/repetition / D17, D35, D37 | `guards/template_echo.py` `guard_template_echo` L137 uses fixed meta/source/markers, previous similarity >=.72, echo/quote ratios and repeated signatures L157-218 | `test_cocolon_text_generation_core_guards.py` obvious repeated surfaces L71 | Reuse diagnostic features, adapt thresholds and product policy. Current acceptance allows a short receipt and one paraphrase. Piece deliberately preserves source claims. Blanket echo rejection would contradict current specification. Sample-level and batch-level repetition remain useful as separate assessments. |
| Fixed corpus / D30-D32, D35-D37 | `ai/tools/emlis_nls_v3_batch_run.py` `load_validated_batch` L93, `_previous_by_case` L251, `run_batch` L268; fixture `ai/tests/fixtures/emlis_nls_v3/generated/batch_001.jsonl` + `batch_001_manifest.json` | Unified bridge L55/59-61 uses validated original corpus as sole inventory; no copied case table | Retain corpus and case identities as regression assets, distinguish previously used inputs, teacher variants, new unseen topics. Existing Cycle denominator/acceptance remains its separate contract. Current natural regression can use versioned adapters without copying raw private corpus into public docs. |
| Human review / common-cause categories / D32-D35 | `ai/tools/emlis_nls_v3_step11_current100_product_read.py` `PRODUCT_READ_AXES` L54, `PRODUCT_READ_SHARED_CAUSE_CODES` L92, `build_current100_product_read_pair` L703. Tool docstring L5-11 explicitly never makes/revises human decisions | `test_emlis_nls_v3_step11_current100_product_read.py` L266 exact100 pair, L391 shared cause, L424 tamper; source L329-437 validates human rows | Reuse meaning/relation/unknown/naturalness/distribution dimensions and common-cause grouping; adapt obsolete mandatory section-distinctness/depth assumptions to current criteria. Keep evaluator reading versus Mash formal acceptance distinct. The tool validates annotations; it does not discover root cause automatically. |
| Version diff / changed-output re-read / D31,D32,D35,D50 | `batch_run.py::_previous_by_case` and `run_batch`; current100 runner/version parent binding; bridge and frozen old/new snapshots are concrete reusable patterns | Current100 tests parent/source/candidate bindings L486/500; mixed_unknown full prior checkpoint reproduction L84 | Reuse input/version matching, changed/same/availability/meaning deltas. New output means fresh reading; unchanged bytes may reuse a matching earlier reading only when source/context/policy/model conditions needed for that claim are unchanged. Historical PASS is not re-awarded to new output. |
| Privacy/HMAC/body-free evidence / D29,D50 | current100 review `_public_case` L467, `_aggregates` L483, `_review_hmac` L440, `_assert_body_free` L544, `_validate_review_pair` L557 | Current100 test public aggregate/tamper L424, exact0600/no overwrite L526 | Useful governance component retained inside required evidence packaging. Reuse compact sanitization/linkage; no per-step publication authority chain, no HMAC as semantic proof. |


## 15. 設計の確認範囲と未成立事項

- 旧32系列の監査、PostG2の8層／活用案、D01–D51、現在の全体設計・全ファイル地図の関連責務、三中核map、最新weekly、現source／symbol／testsを照合した。Karen-Diaryは確認版の全50fileを分担全文読取し、構造知識と現在の商品仕様を区別した。
- 旧32系列監査の確認blobは`d056dba48c65acb55198b24b021924360171ded0`、[PostG2再利用監査](../../audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md)は`8f44b842bd5314b75d5e3fe33c14ec16bd46e7f3`。全体ファイル地図の件数・所在確認と、全blobの意味読解・全画像目視は区別する。
- 巨大な旧migration詳細06の全文と全symbolの意味監査は完了していない。本文取得できた上位設計・Disposition・現map・現sourceを根拠に本書を設計し、各実装単位で必要原本を確認する。未取得を「存在しない」「移管不要」「全文理解済み」にしない。
- 本書は自由文の一般意味検査、通常追加model reader、全三中核の意味品質、実費・待ち時間の改善を実証していない。sourceの正規化／引用一致、表の完全性、文書保存をその代用にしない。
- **最初の設計保存時点**の構造差分は、回収・改修・商品接続の設計と再開導線だけで、その時点では製品の作者・API・DB・RN・provider・稼働設定を変えていなかった。その後のAR-01ではa98c／e14の候補source変更、研究opt-inの実生成比較、private保存・再読へ進んでいる。現在の実装・適用範囲・不採用と残件は[§11.2](#112-現在の進行欄)と最新weekly／既存AR-01 trialを参照する。新しい発売条件、料金、quota、独立した承認／統制systemは追加しない。


<a id="piece-general-prose-register-20261110"></a>
### 11/10追記 — AR-04の一般文診断と既存S7比較への限定接続

**11/10・AR-04最新：** 固定c634・追加学習0で新しい架空8入力を確認し、source資格5／資格外3を分離。資格5＋既使用対照2の実4B7応答を無修補で再受領し、API209b4a27の既存S7 model比較で、完全な本人表記・対象を保つ「たいです／たい」と未決定の場所等の文体差を限定接続、CMEE4→6採用／7。新規5は2→4採用、対照2と旧46本文は不変。新隔離SQL21は18保存／3拒否、保存後0生成。17file1082 PASS／既存warning1。反復表現、理由文1の未判定、source資格外3は残る。元GPU提供46144へ復元・health／前後control一致、c634通常未採用／selector OFF・正式0/3。

新規架空8をsource資格5／資格外3へ分離し、既存c634を1load・学習0で新5＋対照2を生成。現実装の読み取れない構造を、生成誤りや本人への追加質問へ転嫁しない。今回のAPI209b4a27は既存policy／testの2pathだけで、意味保持を緩めず、完全なsource対象／本人文に対する既知敬体差の比較を追加した。STRUCTURE_MAP_DELTA_NONE（既存owner内条件のみ）。quote・修飾source3／opaque理由文1と、選択述語の反復は未解消。旧資産の主体／対象／肯否／時点／unknown保持・変異拒否・独立全文読取・既存保存非生成再読を今回の本文／rawへ適用した。新schema／checker systemや通常生成回数は追加しない。[実装・原本・範囲の正本](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general-prose-register-20261110)。

次のAR-04は、保存済みc634の新5応答・対照2と旧46、今回のsource資格外3・CMEE未判定1を引き継ぎ、理由・修飾を含む一般文の読取不足と「選ぶ時間を選びたい」の不自然な反復を別の原因として改善する。未判定を意味改変と呼ばず、source／rawの書換えや本人への質問で解析不足を埋めない。同版画像の確認は前回4作品だけで、今回の新5入力（候補本文）へ転用しない。通常統合／本人端末、WholeCanvas／V4の既存失敗、一般品質・AR-01反転と他ARは未完了。c634は通常未採用・selector OFFを維持し、追加fit／通常採用／live配置／署名buildへ自動進行しない。


<a id="piece-literal-reason-register-20261110"></a>
## 11/10 AR-04 — 理由KEEPの完全字面と既知copulaの照合

固定c634の保存済み7rawを追加生成0で再受領し、理由・本人評価を丸ごと保持する既存S7のmodel専用KEEP比較をAPI0c6ad819で限定修復。GENERAL02は未判定→採用となり同7件は6→7採用、旧46の判定／本文と全8入力のsource資格5／資格外3は不変。新隔離SQL21は全保存・保存後0生成、関連17file1129 PASS／既存warning1。原文／raw・source文法・通常selectorは不変、追加学習・GPU操作・live／実DB／build0。反復、引用／修飾等のsource資格外3、一般品質・通常統合／本人端末・正式0/3は残る。

STRUCTURE_MAP_DELTA_NONE（既存S7内のmodel比較のみ）。[原本・全結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-literal-reason-register-20261110)。

次のAR-04は、保存済みc634の同7応答と旧46、source資格外3を引き継ぐ。今回のopaque KEEP比較は、完全な同一理由前提／ので／対象／評価語・強調／終端を保持し、肯定非過去の「です／だ」と同一文の同表記本人省略だけを扱う。理由一般の型付き意味理解・否定／過去／推量の拡張とはしない。残る「選ぶ時間を選びたい」の反復、修飾付き評価対象と引用の資格不足を別原因として既存商品ownerで改善する。source／rawの書換えや質問で解析不足を埋めず、通常採用／追加fit／live／署名buildへ自動進行しない。同版画像は前回4作品だけで今回7件への転用不可。


<a id="piece-focal-order-preparation-20261110"></a>
## 11/10 AR-04 — 焦点語順の反復対策候補・実比較未実行

焦点語順を保つ生成条件の候補1baa7977をAPI別branch `agent/piece-focal-order-candidate-20261110`へ保存。既存の資格済み無scope焦点構文から、原文／本人・述語・対象と範囲を同欄の既存条件へ投影し、語順変換に伴う反復を減らす案。関連1158 PASS＋追加operator4 PASS、旧53rawの判定／本文不変。通常API作業正本は0c6ad819のまま。実4B比較用の架空4入力＋実行コードのRunpod送信は自動承認審査で拒否され、upload／新生成／GPU切替0・品質改善未確認。

STRUCTURE_MAP_DELTA_PRESENT_CANDIDATE_ONLY（既存private生成条件境界のみ、通常正本未反映）。[候補・全結果と再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-order-preparation-20261110)。

次は、保存した13,753byteの比較用ZIP（架空新2＋既使用2・比較コード）を既存Runpod f1lle4xwq3wjlnへ送信し、同c634のbefore4／after4と既存提供の前後control4、計最大12HTTP・600秒／復元枠120秒で一回比較する。現在はこの送信・実行への明示承認待ちであり、uploadも生成も再試行していない。原文／raw修補、SYSTEM変更、学習／新レンタル／通常採用／live／実DB／buildは0。修飾付き評価・引用のsource資格外3、一般品質・通常統合／本人端末と他ARは引き続き未完。


<a id="piece-focal-order-actual-20261110"></a>
## 11/10 AR-04 — 実比較完了・焦点条件候補は不採用

承認済みの焦点語順条件を同c634で実比較（架空4入力×前後＝8応答、control4、115.70秒）したが、反復修復0/3・元焦点語順の実現0/4。各版CMEE3/4、FOCAL02の格不成立は両版停止。候補1baa7977は不採用、通常API正本0c6ad819と元提供を維持。隔離保存は24試行＝18保存・非生成再読／6事前拒否。

原提供の復帰と通常／分析control前後一致。追加学習／新weights／retry0。STRUCTURE_MAP_DELTA_NONE_FOR_NORMAL、通常branch／selector／live／実DB／buildの変更0。[全結果と次の作業](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-order-actual-20261110)。

次は既存private保存先から、c634を作った原24教材のsource／messages／target・既存trainer・48更新記録を取得し、焦点構文・活動を含む名詞化対象・格・否定／時点／留保・述語重複の被覆を全24行で監査する。現在のcheckpointにはこの原24教材とfit trainerがなく、被覆件数・原因・次のfit行数はまだ不明。今回の評価4入力を教師へ流用せず、別題材の自然な焦点語順／成立する直接語順を教える最小の学習候補へ戻す。今回の条件追加だけでは改善しなかった事実を保持し、prompt一般や学習原因全体へは断定しない。反復目的のS7緩和や不正raw修補は行わない。修飾・引用のsource資格外3、一般品質、通常統合・本人端末、他ARは未完。


<a id="piece-focal-target-teachers-20261110"></a>
## 11/10 AR-04 — 原24教材監査と希望3targetの最小比較候補

c634の原24教材・元trainer・実48更新・保存weightsを回収照合。焦点source13行は全て直接語順targetで、元語順target0／同述語反復0／大切にしたい0を確認。希望3行のtargetだけを自然な元焦点語順へ変え、全source/messages・他21行を保持した学習比較候補を準備。CPU同意味3／誤意味拒否7・別題材評価4の資格確認済み。新GPU学習／生成／upload0、効果未確認。通常API0c6ad819と1baa不採用を維持。

通常商品source・owner／公開／保存／DB／RN差分0、STRUCTURE_MAP_DELTA_NONE。今回のCPU資格確認・準備を自然さ改善へ換算しない。[原本・候補・再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-target-teachers-20261110)。

次は凍結39792byteの3member ZIP（原24のtarget3だけ変更・架空評価16・一回実行コード）を既存Runpodへ送信し、元trainerのfresh base/config・24行48更新で一回比較する段階。全24の訓練SYSTEM／USERと原入力・他21object、seed20261109／LR1e-4／scopeは不変。新評価4基準＋候補16＋元提供前後control4の最大24HTTP、学習300秒／全600秒・復元120秒、旧c634基準12はexact wire/revisionを確認した原本再利用。前回の4入力・学習0の完了runを再使用せず、今回の具体ファイル送信・学習実行を確認してから進む。通常採用／selector／live／実DB／build0。
