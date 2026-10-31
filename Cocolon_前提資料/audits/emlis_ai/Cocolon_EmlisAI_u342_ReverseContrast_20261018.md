# EmlisAI u342 — 今日→昨日の対比で本文が停止する誤派生関係の修復

2026-10-18、Mashの残件継続指示に基づく。全体設計01、全file地図01A、最新weekly（10/17追記u341）、current_structure、canonical06、API handoff、CURRENT_RULES／作業開始・出力規則／Rule18および恒久incident全文を確認。開始HEADはAPI `d663ce22836fd32604788605001d71e8561f7ba2`、Cocolon `1c3dcac03420bd8f37e0d6a0a325a1bb7cf9ce25`。

目的は「今日は疲れている。でも、昨日は友達と話せて嬉しかった。」で誤ったrequired attempt_and_blockが加わり本文未提供となる条件を、原文の対比と両対象を保って減らすこと。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、既存契約内の最小修復（LEVEL_2 standing delegationとcurrent依頼）。root華恋が実装・検証・反映を担当する。同Workのread-only補助は正式な別モデルPro／Ultra審査に数えない。

原fieldの本人完全二文、原文prefixと既存semantic timeがpresent→pastで一致すること、既存有限述語、明示contrast、同じ両端の逆向き誤辺、sole conflict.eN／arc空／span完全一致をすべて証明する。誤辺のID・両端・根拠は残し、既存uncertain_connection／bounded_structural_inference／shouldへ戻す。既存の主観選択・作者・本文readerで正しく返答できるところまでを同一単位とする。新checkpointを導出し、旧checkpointは旧関係・旧停止まで完全復元する。新解釈を旧IDに付け替えない。

予定変更ownerはAPIの既存OP、emlis_question、emlis_answer_update（Q1配線に必要な場合のみemlis_thread_engine）。新test／無変更u341 baseline fixture／current identity／API handoff、Cocolonの01・01A・current_structure・06・weekly・本監査を追跡する。新schema・主観内容・質問資格・Safety条件、公開API／DB／RN、依存、release、merge／配置は変更しない。資格外の関係や保存履歴を変更する必要、または既存選択から本文へ届かず契約拡張が必要と判明した場合は、その境界で止める。新しい補助機構を作らない。

成功条件は、原文の二対象・時点・程度・肯否を保持した現行本文、資格外不変、旧checkpoint完全復元、保存完成／初回中断の再開と非再生成の確認。根拠のない因果・同時性・主体変更を最終本文の読解で拒否する。以下に結果・全変更path・実本文を追記した。PRODUCT_NOT_CLEAR／正式0/3／candidate_ready=false／automatic_progression=falseを維持する。


## u342 — 今日→昨日の完全対比に加わる誤関係と本文停止を修復（2026-10-18）

Mashの残件継続指示に基づき、全体設計01・全file地図01A・current_structure・正本06・最新weekly・API handoffと作業規則、恒久incident全文を確認した。開始HEADはAPI `d663ce22836fd32604788605001d71e8561f7ba2`、Cocolon `1c3dcac03420bd8f37e0d6a0a325a1bb7cf9ce25`。u341で特定した逆順停止に対する、既存設計内のsource誤派生修復である。Rule18 LEVEL_2 standing delegation／current依頼の範囲で、rootが実装・検証・反映し、同Work補助はread-only調査を担当した。正式な別モデルPro／Ultra審査とは数えない。

完全原fieldで本人二文・既存有限述語・明示対比を証明し、原文prefixと既存semantic timeがpresent→pastで一致する場合に限定した。同じ両端の逆向き `attempt_and_block` が単一 `conflict.eN`／meaning arc空／endpoint span完全一致である場合だけ、既存 `uncertain_connection`／bounded_structural_inference／shouldへ戻す。元のcontrast、全核、誤辺を含むID・両端・根拠・certaintyは保持する。実markerの位置・原文切片・対比性も確認する。参照helperから完全二文のsource証明を既存OP内へ抽出し、選択と独立して使用した。u341の参照資格は拡張しない。

開始原本の合成22入力を凍結し、7入力で新しい意味checkpointと本文が成立した。対象は、通常／ひらがな／程度両端／程度過去側／「今日も・昨日も」／句読点違い／過去否定。現行のQ1/Q3本文が一致し、新checkpointで再開しても同じ本文となる。15対照はcheckpoint・plan・Q3 selectedまたは同じ停止・全artifact・問い・reasonが不変。全22入力の核は不変で、対象7入力の関係差分は逆向き誤辺のtype／grounding／retentionだけである。新しい主観内容・選択契約・質問資格を足していない。

今回の修復は意味関係を変えるため、u341の参照だけの修復と異なり、旧IDへ新しい意味を付けない。既存3ownerにlegacy modeを接続し、旧ID指定時にu341の全核辺を再導出して既存checkpoint照合を通す。22入力×Q1/Q3の44復元で、各経路の旧checkpoint・plan・全artifact・問い・reasonを保持した。Q3 selected全体または同じ投影停止も比較した。Q1 selected全体のu341 hashは凍結しておらず、Q3のsource refを含むhashと同一とは主張しない。さらに旧u337の44recordと旧u334の40recordの復元検査が通った。新flag単独で過去の別修復まで無効化せず、より古いsource modeからは今回修復も無効化する。新schemaは不要、Q1 engine／serviceの変更も不要だった。

最終検証は **374 passed／5 failed／skip0**（新119成功、関連255成功・5失敗。current identity1は関連集合に含む）。5失敗はu341の旧不変対照 `reverse`／`reverse_degree`、u340の旧意味・plan比較 `degree`／`reverse`、u331の旧「同時」表示比較 `distinct_times`。歴史fixture・旧assertionは変更・xfail・skipしていない。新119は原本比較22、旧復元44、作者を禁止した本文変異20、source関係変異16、foreign checkpoint拒否1、SQL保存・再開16である。最初の新規検査で検出した対象誤仮定3件とQ1/Q3 selected hash混同4件は、新規test側の仮定を修正した。開始原本fixtureは変更せず、途中実行を成功数へ加算しない。全suite GREEN・製品完成ではない。

実service＋隔離PGlite SQL/RPC16ケース：2原文×3tier×現行完成／旧未提供の12と、2原文×旧checkpoint保存前／後の確定中断4。現行完成と旧未提供は生成禁止engineによるGET／startで全DTO一致。確定中断は既存CancelledError経路を使い、checkpoint前はretryで現行意味を初めて作り、checkpoint後はprepareを呼ばず旧meaning event／payloadと旧未提供を保持した。意味eventは各1件、operationも維持する。旧未提供はRESPONSE_FAILED／body_not_validated／can_retry=falseであり、成功表示へ変えない。lost ACKや失効attempt、本番旧DBを検証したとはしない。

同じ16DTOを現行API client→hook→Modalへ渡し、GETのみでclose/reopen各2回、全DTO・本文または未提供表示・original・timeline・質問／回答欄なしを確認。HTTP／Auth／nativeはstubであり、本人実機・本番配置ではない。全7現行本文をrootが読み、時点・程度・肯否・原文順を維持し、因果や「同時」を足していないことを確認した。定型的な「小さくせずに受け止めています」は残り、E04の深さや正式Product Read完了に換算しない。

STRUCTURE_MAP_DELTA_NONE。既存production3file、新production0、新test1・原本fixture1・current identity。OP direct builderの新legacy引数の既定はTrueで、Analysis等の直接呼出しは従来経路を保持し、現行Emlis original_meaning_planだけFalseを明示する。Analysis全suiteは未実行。公開API／DB／RN／Safety／依存／releaseは不変。

残件：`past_then`「今は疲れている。ただ、その時は友達と話せて嬉しかった。」は後半がcurrent_inputで、ただもother_explicitに残り、今回の時点資格を満たさない。`now`「今は疲れている。しかし、昨日は友達と話せて嬉しかった。」は「しかし」が後半spanへ入り、明示contrastがなくattempt_and_block＋shift_from_toのまま停止する。他者・明示SELF・条件・敬体・時点未指定等の対照は従来の誤読／停止を含み、不変を品質合格と扱わない。次の読取位置は、これら未証明例の時間・接続詞のsource帰属と、既存契約内で修復できる共通原因である。語順一般への対応完了とは報告しない。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=false。E04深さ／E05問い／E06〜E09は未完。10/20方式判断・10/31管理線・12/18目標、Piece/Analysis主枠53.25％は不変。既存Draft PR継続、merge／配置なし。

実本文・全path・検証境界：[u342監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u342_ReverseContrast_20261018.md)。

### u342変更file地図

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存二文証明の抽出、逆向き誤辺だけの修復、direct builder旧mode |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／旧source modeから修復条件を伝播 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpointの全意味再導出と既存照合 |
| mashos-api | `ai/tests/test_cmee_emlis_reverse_contrast.py` | 新規。原本比較、旧復元、独立本文読解、source変異、SQL保存／中断再開 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u341_reverse_contrast_v1.json` | 新規。無変更u341から凍結した22入力・Q1/Q3旧記録 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行owner identityのみ更新、歴史証跡は保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 再開範囲・実績・互換境界・残件を追記 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 今回の設計・構造・週次差分 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u342_ReverseContrast_20261018.md` | 新規。着手・実本文・検証・残件 |

## rootが読んだ現行7本文

### reverse

原文：今日は疲れている。でも、昨日は友達と話せて嬉しかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せて嬉しかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### hiragana

原文：今日は疲れている。でも、昨日は友達と話せてうれしかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せてうれしかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せてうれしかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_both

原文：今日はとても疲れている。でも、昨日は友達と話せてとても嬉しかった。

```text
見えたこと：
「今日はとても疲れている」の一方で「昨日は友達と話せてとても嬉しかった」とあります。

Emlisから：
今日はとても疲れていることと昨日は友達と話せてとても嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### degree_past

原文：今日は疲れている。でも、昨日は友達と話せてとても嬉しかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せてとても嬉しかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せてとても嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### also

原文：今日も疲れている。でも、昨日も友達と話せて嬉しかった。

```text
見えたこと：
「今日も疲れている」の一方で「昨日も友達と話せて嬉しかった」とあります。

Emlisから：
今日も疲れていることと昨日も友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### punctuation

原文：今日は疲れている。ただ昨日は友達と話せて嬉しかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せて嬉しかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せて嬉しかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

### negative

原文：今日は疲れている。でも、昨日は友達と話せて嬉しくなかった。

```text
見えたこと：
「今日は疲れている」の一方で「昨日は友達と話せて嬉しくなかった」とあります。

Emlisから：
今日は疲れていることと昨日は友達と話せて嬉しくなかったことの両方を、その違いも含めて小さくせずに受け止めています。
```

## 検査集合と限界

Python3.12.14／pytest8.4.1／PGlite0.5.8。PYTEST_DISABLE_PLUGIN_AUTOLOAD=1、--noconftest -p no:cacheprovider。新規module119、関連260はcontrast_degree全54・separate_time_contrast全72・contrast_reference全41、past_unknownの旧u337復元44、relief_unknown_sourceの旧u334復元40、received_discourseの有限contrast訂正／撤回4＋保存再表示4、current shared identity1。関連255成功・5失敗を最終JUnitとexit statusで確認し、再実行を加算しない。UIは一時harnessから現行client／hook／Modalを読み、16保存DTOを各2回表示した。全反映fileのremote byte照合・差分集合・親commit・PR状態は反映後にrootが別途確認する。
