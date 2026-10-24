# EmlisAI u341 — contrastの程度表現（2026-10-18）

## 着手範囲

ユーザーの「残件作業」「続きから再開」に基づく既存設計内の修復。01全体設計、01A全ファイル地図、EmlisAI current_structure、canonical 06、最新weekly_reviews（2026-10-17追記u340）、API handoffを再確認した。起点はAPI `741463920723bae5ac81d5052a779ca838778cfe`、Cocolon `5134acb7200ed635fe688332acc4410eb87e48ee`。

u340残件のdegreeは、既存の有限述語直前にある「とても」の「も」をtopic除外が拾い、二つの本人対象の具体参照が外れる。既存OP参照証明の検査用文字列だけから、有限述語直前の一つの「とても」を除いてtopic検査を行う。原文、核、辺、意味checkpoint、主観選択は保持し、reference_modeとそこから派生する参照表現だけを修復する。他の「も」、主体、引用、条件、敬体、未対応述語の制限は維持する。

逆順は別の関係authority問題として原因と次工程を記録する。本単位で意味関係・選択契約を変更しない。新依存、DB/schema、UI、質問仕様、release、merge/deployは対象外。旧比較fixture・期待値を変更せず、新しい修復比較を追加する。正式な別モデルreviewは未実施であり、read-only作業分担を正式reviewと数えない。

以下へ検証結果と実本文を追記した。PRODUCT_NOT_CLEAR、正式0/3、candidate_ready=false、automatic_progression=falseは維持する。


## u341 — 「とても」をtopicの「も」と誤判定する参照を修復（2026-10-18）

ユーザーの残件作業・中断後再開の指示に基づき、全体設計01、全file地図01A、current_structure、canonical 06、最新weeklyとAPI handoffを確認した。u340反映済みHEADはAPI `741463920723bae5ac81d5052a779ca838778cfe`、Cocolon `5134acb7200ed635fe688332acc4410eb87e48ee`。既存設計内の参照実現修復として、Rule18の通常修復範囲で進めた。新しい意味資格・主観契約の拡張へ承認を流用していない。

既存OPの二対象contrast証明が「とても」の「も」をtopicとして除外していた。既存有限述語の直前にある一つの「とても」だけを検査用コピーから除き、他のtopic・主体・条件・引用・敬体の制限を維持した。原文は削らない。無変更u340から凍結した22入力の意味checkpoint・核・辺・selected.decisions・問い・reasonは不変。8入力はreference_modeだけを具体参照へ変え、派生参照と本文を修復した。plan全体／selected全containerが不変という主張はしない。対照14入力はplan・selectedまたは同じ停止・全artifactまで不変である。

8入力のReceptionは両方の原文を「こと」で受け取り、程度・肯否・時点を保持する。うち明示past/presentの6入力はu340の既存「一方で」表示へ自然に接続し、誤った「同時」を除去した。時点未指定の2入力は参照だけを修復し、Observationの旧「同時」は残る。不変の他者・引用・敬体等の旧誤読も品質合格には数えない。同じ旧意味checkpointでの修復本文とQ1/Q3の本文一致を確認した。

検証は重複除外 **228 passed／2 failed／skip0**（新54、関連173成功・2失敗、current identity1成功）。2失敗はu340 `degree` の旧plan完全一致要求（今回reference_mode修復との差）とu331 `distinct_times` の旧「同時」本文一致要求（u340から既知）。旧fixture／assertionは改変・xfail・skipしていない。前回の `explicit_self` 旧停止期待は今回の選定集合に含まず、解消済みとは扱わない。全suite GREEN・製品完成ではない。

実service＋隔離PGlite SQL/RPC12ケース（2原文×3tier×現行／合成旧完成）で、生成禁止engineによるGET／startの全DTO一致を確認。同じ12DTOを現行API client／hook／Modalへ通し、GETのみでclose/reopen各2回、全DTO・本文・original・timeline・質問／回答欄なしを確認した。旧完成は旧helper結果を生成時だけ局所再現し、開始原本の実本文と完全一致させた合成検査。本番旧DB・中断retry・本人実機の証明ではない。HTTP／Auth／nativeはstubである。

STRUCTURE_MAP_DELTA_NONE。既存production1file内の参照証明だけを変更。new production0、公開wire／DB／RN／依存／Safety／releaseは不変。新test1・開始原本fixture1・current owner identityを追跡した。Analysisは同じOP builderから核辺等を読むがreference_mode／human_reception_planを参照しないことをsource読取で確認した。Analysis全suiteの実行済みとはしない。作者とreaderはsource資格helperを共有し、reader変異20では作者呼出なしに最終本文の程度位置・時点・主体・肯否・両端・追加主張を検査した。

逆順「今日は疲れている。でも、昨日は友達と話せて嬉しかった。」は未提供のまま。明示contrastに加えてconflict observerが後半positive→前半limitの近接由来 `attempt_and_block` をrequiredで生成し、`RECEPTION_BINDING_CONFLICT_STOP`となる。参照helperの2辺拒否は正当であり緩めない。次は、完全二文・本人・既存有限述語・明示contrastを証明し、同じ両端を逆向きに結ぶ `conflict.eN` 単独／arcなし／endpoint span一致の誤派生辺だけを既存非required `uncertain_connection`へ戻す案を検討する。これは未実装。核辺とcheckpoint identityが変わるため、旧checkpoint後の復元は旧意味・旧未提供状態を保持し、新意味を旧IDへ付け替えない互換設計が必要である。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。rootが実本文を読み、同Work補助がsourceを読取確認したが、正式な別model Pro／Ultra審査・正式Product Readとは数えない。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=false。E04の受け止めの深さ、E05問い、E06〜E09、逆順・他者・時点未指定・敬体等は残る。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は不変。既存Draft PRで継続、merge／配置なし。

実本文・全path・検証境界：[u341監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u341_ContrastDegree_20261018.md)。

### u341変更file地図

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存production owner。既存有限述語直前1個の程度語だけをtopic検査用コピーで区別 |
| mashos-api | `ai/tests/test_cmee_emlis_contrast_degree.py` | 新規。22比較／本文変異20／SQL保存12 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u340_contrast_degree_v1.json` | 新規。無変更u340の22入力・意味／参照／実本文凍結 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner identityのみ更新。歴史証跡は保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 再開先・修復範囲・結果・未解消を追記 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 設計／構造／週次の今回差分追記 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u341_ContrastDegree_20261018.md` | 新規。着手記録・実本文・検証・残件 |

## rootが読んだ現行8本文

### degree_first

原文：昨日は友達と話せてとても嬉しかった。でも、今日は疲れている。

```text
見えたこと：
「昨日は友達と話せてとても嬉しかった」の一方で「今日は疲れている」とあります。

Emlisから：
昨日は友達と話せてとても嬉しかったことと今日は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_both

原文：昨日は友達と話せてとてもうれしかった。ただ、今はとても疲れている。

```text
見えたこと：
「昨日は友達と話せてとてもうれしかった」の一方で「今はとても疲れている」とあります。

Emlisから：
昨日は友達と話せてとてもうれしかったことと今はとても疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_second

原文：昨日は友達と話せて嬉しくなかった。でも、今日はとても疲れている。

```text
見えたこと：
「昨日は友達と話せて嬉しくなかった」の一方で「今日はとても疲れている」とあります。

Emlisから：
昨日は友達と話せて嬉しくなかったことと今日はとても疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_negative

原文：昨日は友達と話せてとても嬉しくなかった。でも、今日は疲れている。

```text
見えたこと：
「昨日は友達と話せてとても嬉しくなかった」の一方で「今日は疲れている」とあります。

Emlisから：
昨日は友達と話せてとても嬉しくなかったことと今日は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_untimed_first

原文：友達と話せてとても嬉しかった。でも、少し疲れた。

```text
見えたこと：
「友達と話せてとても嬉しかった」と「少し疲れた」が、異なる向きのまま同時にあります。

Emlisから：
友達と話せてとても嬉しかったことと少し疲れたことの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_untimed_second

原文：友達と話せて嬉しかった。でも、とても疲れた。

```text
見えたこと：
「友達と話せて嬉しかった」と「とても疲れた」が、異なる向きのまま同時にあります。

Emlisから：
友達と話せて嬉しかったことととても疲れたことの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_time_also

原文：昨日も友達と話せてとても嬉しかった。でも、今日も疲れている。

```text
見えたこと：
「昨日も友達と話せてとても嬉しかった」の一方で「今日も疲れている」とあります。

Emlisから：
昨日も友達と話せてとても嬉しかったことと今日も疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_now

原文：昨日は友達と話せてとても嬉しかった。ただ、今は疲れている。

```text
見えたこと：
「昨日は友達と話せてとても嬉しかった」の一方で「今は疲れている」とあります。

Emlisから：
昨日は友達と話せてとても嬉しかったことと今は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

時点未指定2例の「同時」と、定型的な「小さくせずに受け止めています」は残る。程度と原文参照が保たれた技術的修復であり、時点一般化やE04の深さの完成とは認定しない。

## 検査の再現と範囲

Python 3.12.14／pytest 8.4.1、PGlite 0.5.8。`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`、`--noconftest -p no:cacheprovider`で対象集合を実行。新規module54成功、関連集合は `test_cmee_emlis_separate_time_contrast.py`、`test_cmee_emlis_contrast_reference.py`、source_scopeの `test_past_and_current_feelings_keep_their_full_objects_and_distinct_times`／`test_body_reader_rejects_scope_object_time_and_contrast_loss_without_author`、received_discourseの `test_finite_contrast_correction_withdrawal_preserves_other_source`／`test_finite_contrast_saved_update_and_original_replay` で173成功・2失敗。current identityの `test_active_final_language_owner_chain_has_zero_legacy_compose_calls` は1成功。途中や前回の検査を足し込んでいない。UI検査は現行sourceをBabelで読み、実API client→hook→Modalと合成保存DTOを接続した一時harnessで12成功。全変更fileの差分チェックとGitHub反映後のbyte一致はrootが別途確認する。
