# u343 — 「その時」「しかし」の明示対比を本文・保存まで修復

## 着手条件（2026-10-18 JST）

MashのEmlisAI残件継続指示と、10/18 u331の「保存と作業終了の区切りを分ける」承認に従う。前回添付txt、前提資料、作業規則、恒久incident全文、全体設計01・全file地図01A/01B/01C、current structure、正本06、最新weekly 20261017とAPI handoff u342を確認。開始HEADはAPI `b27f22047250fe5a508b0fb28e9ae0b49788a2c7`、Cocolon `b02919150e8049df81bc9e1c2a349b47b86126ef`。

対象はE01の本人・時点保持と、同じ原文から初回本文が止まる不足。「今は疲れている。ただ、その時は友達と話せて嬉しかった。」では既存contrastと完全二文の根拠があるが、後半のtime_scopeがcurrent_inputへ落ちる。完全な本人二文・既存対比・現在prefix・「その時」prefixと過去有限述語の一致を既存source ownerで証明し、過去を復元して既存u342辺修復と本文へ接続する。新しい感情語・主観内容・問い資格・一般的な時点推定は追加しない。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK。既存契約を実現する最小修復としてRule18 LEVEL_2 standing delegation/current依頼の範囲。実装・統合・検証・GitHub反映はroot華恋。同Work補助2名はread-onlyの原因/範囲確認、追加1名は新規test作成を担当。rootが製品sourceを実装し、全差分・実本文を確認して検証・統合・反映した。正式な別model Pro/Ultra審査とは称さない。製品外部AI・依存追加・Mash操作0。

予定API変更path: `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`、`ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py`、`ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py`、新規`ai/tests/test_cmee_emlis_time_contrast_source.py`・`ai/tests/test_cmee_emlis_time_contrast_proof.py`、無変更開始版fixture `ai/tests/fixtures/cmee_emlis_u342_past_then_v1.json`、現行identity `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json`、既存API handoff。資料は本監査、既存01/01A/current_structure/06/weeklyへの短い差分案内。構造ownerは変えずSTRUCTURE_MAP_DELTA_NONE。

完了条件：現行意味と未加工本文で時点・主体・対象・程度・否定を保持、資格外不変、Q1/Q3の全旧checkpoint/plan/selectedまたは停止/本文/問いを復元、実serviceと隔離SQLで保存・再表示・checkpoint前後の中断再開を確認。同じ保存DTOの現行画面表示を確認。対象自体はENDで、架空の問いを足さない。

停止境界：新たな意味/保持/問い/原文分割契約や公開API/DB/RN変更が必要なら未承認のまま拡張しない。「しかし」はledgerの区切りにも関わり独立調査する。一般時点推定、他者・引用・条件等への資格拡張、稼働DB/配置/build/merge、依存追加・外部AI、protected歴史fixtureの変更は行わない。定型ReceptionとE04/E05/E06–E09の残差を解消済みにせず、PRODUCT_NOT_CLEAR・正式0/3・candidate_ready=false・automatic_progression=falseを維持する。

## 同一対比修復単位の継続範囲

「しかし」の共有ledgerを変更すると既存sNとEvidenceRefへ影響するため、その案は採らない。既存のsource_fragment_scalar_rangeで接続詞後の完全節を参照する現在の仕組みを使用する。本人完全二文・原field・先頭接続詞・現行有限述語・明示異時点を証明し、source-order由来のshift誤辺を既存contrastへ補正する。完全な原文span/envelopeは保持し、「しかし」の意味はcontrastへ保持する。既存作者と独立readerが同じ二対象を読めるよう既存`emlis_ai_grounded_observation_gate.py`も変更対象とする。限定のsource誤認修復として契約/新型/選択資格を追加しない。追加fixtureは無変更開始版`cmee_emlis_u342_inline_contrast_v1.json`。それ以外の予定path/禁止/完了条件は同じ。

## 実装結果と互換境界

既存4 production file内で修復した。共有ledger・原文の分割・sN・source prefix・envelopeは変更していない。新しい感情語、主観的な受け止め、質問資格、schema／enumは追加していない。

1. 「その時」だけでは過去を推定しない。本人の完全二文、原field全体、既存明示対比、一方の今／今日＋present、他方のその時＋既存有限過去述語を証明した場合だけ、current_inputへ落ちた核のtime_scopeと対応attributeをpastへ戻す。「その時」の日付は特定しない。
2. 「しかし」が後半spanへ含まれる場合、既存generic_relation_fragment／source_fragment_scalar_rangeで接続詞後の完全節を参照する。原spanはそのまま残し、prefixの位置・原文切片と両端を検証する。原文順の辺が、exact source-order由来shift、exact source-order由来uncertain/should、またはsource-order＋単一conflict.eNを併合した同方向attemptという既知3形の場合に限り、contrast／user_stated_relation／requiredへ戻す。ID・両端・certainty・元のprovenanceを保持して明示marker参照を加える。foreign／複数conflict／別arc／因果を受け入れず、その他の辺を消さない。
3. 逆方向の近接誤辺は、u342の既存独立証明とdowngradeを通す。本文は既存「一方で」・二対象Receptionへ接続する。Gateは作者を呼ばず既存typed fragment readerで原文部分を復元し、非fragmentは従来のraw textを使う。途中レビューで見つけた空白・読点・英字まで正規化する比較案は取り除いた。
4. 新しい意味は新checkpointを持つ。u342旧IDには、当時の全意味を再導出し、既存の完全照合を通した後だけ復元する。新legacy flag単独でu342修復は無効化しない。より古いsource modeは新修復も無効化する。OP direct builderの既定は旧modeで、現行Emlis original_meaning_planだけ新modeを明示する。

無変更開始HEADから36＋18＝54record（原文53種類）を凍結した。17record（原文16種類）が修復対象。内訳は「その時」8、inline「しかし」8と両fixture間で重なる「しかし」1。Q1/Q3で時点・原文順・対象・程度・否定を保持した本文となり、ENDを維持し、新checkpointの再開も一致した。残る37recordはcheckpoint／plan／核辺／selectedまたは同じ投影停止／全artifact／問い／decision／reasonが不変。不変の対照には従来の誤読・未提供が残るため、品質合格とはしない。

全54record×Q1/Q3＝108経路の旧ID復元では、checkpoint／plan／核辺／selectedまたは同じ投影停止／本文／問い／decision／reasonを各routeの凍結値と比較した。Q1 selected hashも今回独立に凍結済みで、Q3のhashを流用していない。全54recordのsource prefixと全evidence spansも一致する。さらにu341の44復元、u337の44復元、u334の40復元が通った。

## 最終検証

重複除外 **690 passed／7 failed／skip 0**。新318成功（317件の最終集合＋追加した旧完成保存1）、関連372成功・7失敗。途中実行310成功や個別probeを加算しない。Python 3.12.14、pytest 8.4.1、既存Pydantic 2.14.0、既存PGlite 0.5.8を使用し、依存は追加していない。

| 集合 | 結果 | 確認内容 |
|---|---:|---|
| 新 time_contrast_source | 253 pass | 現行108、旧復元108、独立本文変異20、SQL保存／再開17 |
| 新 time_contrast_proof | 65 pass | source-order3形×16変異、時点9変異、foreign ID1、fragment7変異 |
| 既存 reverse_contrast | 117 pass／2 fail | u341復元、既存source／本文／保存。2件は今回対象の旧核一致要求 |
| 既存 contrast_degree | 52 pass／2 fail | 程度・参照・保存。既知reverse／reverse_degree比較不一致 |
| 既存 separate_time_contrast | 70 pass／2 fail | 時点・本文・保存。既知degree／reverse比較不一致 |
| 既存 contrast_reference | 40 pass／1 fail | 具体参照・本文。既知distinct_timesの旧「同時」表示要求 |
| 旧u337／u334復元 | 84 pass | 44＋40旧recordの意味／出力復元 |
| 既存有限対比の訂正・撤回／保存 | 8 pass | 4＋4経路 |
| current owner identity | 1 pass | 現行ownerから再導出。歴史fixtureを保持 |

7失敗のうち今回増えた2件は `test_current_repair_changes_only_the_proved_reverse_edge[past_then/now]` の修正前核hash一致要求。残る5件はu342時点からの比較不一致である。歴史fixture・旧assertionを書き換えず、skip／xfailも追加していない。全suite GREENとは報告しない。

新規testは `pytest -q --tb=short -ra -p no:cacheprovider -c /dev/null --noconftest ai/tests/test_cmee_emlis_time_contrast_source.py ai/tests/test_cmee_emlis_time_contrast_proof.py`。既存集合は上記4module全体、`past_unknown::test_u337_checkpoint_restores_every_old_meaning_and_output_field`、`relief_unknown_source::test_saved_u334_checkpoint_restores_complete_old_record`、`received_discourse::test_finite_contrast_correction_withdrawal_preserves_other_source`／`test_finite_contrast_saved_update_and_original_replay`、`test_cmee_v1a_i1sx_contracts.py::CMEEStage1AdditionalCorrectionStep2CompositionTest::test_active_final_language_owner_chain_has_zero_legacy_compose_calls`を選定した。PYTHONPATHは既存test依存・ai・ai/services/ai_inference・ai/tests、Q2_PGLITE_MODULEは既存PGlite moduleを指定。

## 保存・中断・画面

実service＋隔離PGlite SQL/RPC17ケース。原文2種×3tier×現行完成／旧未提供12、原文2種×旧checkpoint前後の確定中断4、旧「その時→今」完成本文1。完成・未提供のGET／start全DTOを生成禁止engineで一致確認。旧完成の「同時」を含む本文も凍結本文と完全一致し、保存済み記録を書き換えない。確定中断ではcheckpoint前retryだけが現行意味を初めて作り、checkpoint後はprepareを呼ばず旧meaning event／payloadを保持する。各意味eventは1件、operationも維持する。

同じ17DTOを現行API client→hook→Modalへ渡し、GETのみでclose/reopen各2回、全DTO・本文または未提供表示・original・timeline・質問／回答欄なしを確認した。HTTP／Auth／nativeはstubであり、本人実機・live DB・production配置の証明ではない。lost ACKや失効attemptを今回検査したとも言わない。

## 判定・残件・再開先

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。この一体単位は実本文・旧互換・保存・画面まで確認して終了する。rootは以下16原文の実出力全文を読んだ。時点・程度・肯否・原文順と明示対比を保持し、因果や同時性を加えていない。一方でReceptionは「小さくせずに受け止めています」という定型に留まり、E04の深さを満たしたとは判断しない。

PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read 0/3／candidate_ready=false／automatic_progression=falseを維持。E04深さ、E05問い、E06〜E09、他者・明示SELF・条件・敬体・時点未指定等の資格外、本人実機は残件。次はこれらの実本文・停止理由から共通不足を切り出し、既存source契約内の修復と新しい意味・主観・問いの契約拡張を区別する。新契約への承認を今回へ含めない。

STRUCTURE_MAP_DELTA_NONE。既存production4file、新production0。公開wire／DB／RN／Safety／releaseは不変。Analysis等のdirect builderの核辺経路は既定旧modeを保持するが、Analysis全suiteは未実行。Draft/open/unmergedを維持し、merge／配置なし。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は前回記録を維持する。

## u343変更file地図（16file）

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 時点・接続詞の原field証明、既存fragment参照、限定関係修復、direct旧mode |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 独立typed fragment読取と生の二対象照合 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／歴史source modeの伝播 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u342全旧意味を再導出してcheckpoint照合 |
| mashos-api | `ai/tests/test_cmee_emlis_time_contrast_source.py` | 新規。現行・旧復元・独立本文・SQL保存／中断 |
| mashos-api | `ai/tests/test_cmee_emlis_time_contrast_proof.py` | 新規。原文・provenance・時点・fragment変異 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u342_past_then_v1.json` | 新規。無変更u342の36record・両route |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u342_inline_contrast_v1.json` | 新規。無変更u342の18record・両route |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner証跡のみ更新 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 短い結果と正本への再開参照 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 今回差分・参照／本監査 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u343_PastThenContrast_20261018.md` | 今回差分・参照／本監査 |

## 実本文（現行16原文、合成入力）

### past_then

原文：今は疲れている。ただ、その時は友達と話せて嬉しかった。

```text
見えたこと：
「今は疲れている」の一方で「その時は友達と話せて嬉しかった」とあります。

Emlisから：
今は疲れていることとその時は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_demo

原文：今日は疲れている。でも、その時は友達と話せて嬉しかった。

```text
見えたこと：
「今日は疲れている」の一方で「その時は友達と話せて嬉しかった」とあります。

Emlisから：
今日は疲れていることとその時は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_negative

原文：今は疲れている。でも、その時は友達と話せて嬉しくなかった。

```text
見えたこと：
「今は疲れている」の一方で「その時は友達と話せて嬉しくなかった」とあります。

Emlisから：
今は疲れていることとその時は友達と話せて嬉しくなかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_degree

原文：今はとても疲れている。ただ、その時は友達と話せてとても嬉しかった。

```text
見えたこと：
「今はとても疲れている」の一方で「その時は友達と話せてとても嬉しかった」とあります。

Emlisから：
今はとても疲れていることとその時は友達と話せてとても嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_hiragana

原文：今は疲れている。でも、その時は友達と話せてうれしかった。

```text
見えたこと：
「今は疲れている」の一方で「その時は友達と話せてうれしかった」とあります。

Emlisから：
今は疲れていることとその時は友達と話せてうれしかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_also

原文：今日も疲れている。でも、その時も友達と話せて嬉しかった。

```text
見えたこと：
「今日も疲れている」の一方で「その時も友達と話せて嬉しかった」とあります。

Emlisから：
今日も疲れていることとその時も友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_punctuation

原文：今は疲れている。ただその時は友達と話せて嬉しかった。

```text
見えたこと：
「今は疲れている」の一方で「その時は友達と話せて嬉しかった」とあります。

Emlisから：
今は疲れていることとその時は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_then_forward

原文：その時は友達と話せて嬉しかった。でも、今は疲れている。

```text
見えたこと：
「その時は友達と話せて嬉しかった」の一方で「今は疲れている」とあります。

Emlisから：
その時は友達と話せて嬉しかったことと今は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi

原文：今は疲れている。しかし、昨日は友達と話せて嬉しかった。

```text
見えたこと：
「今は疲れている」の一方で「昨日は友達と話せて嬉しかった」とあります。

Emlisから：
今は疲れていることと昨日は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_negative

原文：今日は疲れている。しかし、昨日は友達と話せて嬉しくなかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せて嬉しくなかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せて嬉しくなかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_degree

原文：今はとても疲れている。しかし、昨日は友達と話せてとても嬉しかった。

```text
見えたこと：
「今はとても疲れている」の一方で「昨日は友達と話せてとても嬉しかった」とあります。

Emlisから：
今はとても疲れていることと昨日は友達と話せてとても嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_hiragana

原文：今は疲れている。しかし、昨日は友達と話せてうれしかった。

```text
見えたこと：
「今は疲れている」の一方で「昨日は友達と話せてうれしかった」とあります。

Emlisから：
今は疲れていることと昨日は友達と話せてうれしかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_no_comma

原文：今は疲れている。しかし昨日は友達と話せて嬉しかった。

```text
見えたこと：
「今は疲れている」の一方で「昨日は友達と話せて嬉しかった」とあります。

Emlisから：
今は疲れていることと昨日は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_forward

原文：昨日は友達と話せて嬉しかった。しかし、今は疲れている。

```text
見えたこと：
「昨日は友達と話せて嬉しかった」の一方で「今は疲れている」とあります。

Emlisから：
昨日は友達と話せて嬉しかったことと今は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_then

原文：今は疲れている。しかし、その時は友達と話せて嬉しかった。

```text
見えたこと：
「今は疲れている」の一方で「その時は友達と話せて嬉しかった」とあります。

Emlisから：
今は疲れていることとその時は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### shikashi_then_forward

原文：その時は友達と話せて嬉しかった。しかし、今は疲れている。

```text
見えたこと：
「その時は友達と話せて嬉しかった」の一方で「今は疲れている」とあります。

Emlisから：
その時は友達と話せて嬉しかったことと今は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```
