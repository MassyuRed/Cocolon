# u346 — 独立不明を残したまま、別経験の1更新後に既存二反応を保持

開始原本：mashos-api `54e2adbb35d013cded34bc65faa46286467deadd`、Cocolon `9cca98ef80c1bc955d8720c7a08255e3340b77bc`。GitHubの現行HEADをfresh確認し、既存Draft PR3／PR30を継続。合成入力のみ。

## 着手根拠と範囲

Mashの「EmlisAIの残件作業を進めて」に従い、全体設計01、全file地図01A/B/C、current EmlisAI、進捗正本06、最新weekly20261017、API handoff、CURRENT_RULES、恒久ProductNeglect incident全文、作業開始入口を読んだ。Rule18と華恋の必読記録もこの会話で確認済み。開始tracked pathはAPI2415／Cocolon1733。全file地図を確認したという意味であり、全file本文を逐一読んだという意味ではない。

同会話のSystem Context prepareは設定されたAPI checkoutがなく停止している。入口が認める直接原本読取を継続し、古い生成contextを現行扱いせず、設定・権限を変えて迂回していない。作業環境はCodex Work、補助agentは同環境の読取診断・scope／差分レビュー。rootが全編集・検証・実本文確認・GitHub反映を担当し、別modelの正式Pro／Ultra審査や正式Product Readには数えない。

u345残件extra_unknownは、初回Receptionが安堵・寂しさpairのみ、別経験の実問いに回答するとそのpairまで消える状態だった。不明は初回も更新後もObservationに残り、核・所有者・関係も不変である。したがって今回は、u331/u332で既承認の「有効なpairを別経験の更新で落とさない」責務を修復する。不明への新しい第三Receptionは別残件。u334の初回exact3資格を、この4対象の混在へ広げる変更は行わない。既存2 moves／3選択対象・私有保持型のまま実装でき、Rule18 LEVEL_2に該当する。

## 原因と最小修復

`_unchanged_relief_cognition_update_source` は元pair以外のrequired核がexact2であることを要求し、event／reactionに独立不明が加わると既存保持を不適格にしていた。新しい有限helperはrest3だけを対象とし、初回のrequired moveが元pair1個だけ、unknownが既存current SELF wh文法で証明可能、同一memo末尾、関係0本であることを確認する。原文の範囲・raw slice、pair→received→unknownの句点境界、全text spanの集合、余分なtext核がないことを検査し、不明をローカルなreceived探索からだけ除く。元planやactive planから削除・降格せず、新source tagも付けない。

active planでもunknownの全核が元と同一で、required／optionalを問わず関係がないことを確認する。回答の所有者・時点・1回答・受理・更新操作・非pair targetの既存条件はそのまま。元pairの訂正／撤回、未知のcheckpoint、任意多段へ広げない。既存source_relief_cognition_update_retention:v1で新scopeのcheckpointを識別し、旧版の既存legacy経路で旧checkpointを全復元する。新legacy fieldや契約型は不要。

別event撤回では、この修復後も後段の`_thread_retained_reaction_groups`がrequired exact3を要求してsentence planを止めていた。既存witnessed branchの構造guardを、従来3核に加え独立current SELF uncertainty1核まで許すよう整合した。ここでunknown dutyは作らない。元の2 dutiesを返し、raw wh／全原文資格はselectedの独立したsource再導出で検査する。Observation author、Reception author、実本文readerの文法・検査は変更しない。

## 検証と途中失敗

最終対象集合は重複除外187 passed／0 failed／skip 0。全suiteは未実行で、既存explicit_selfの歴史停止期待など他の残件を解消したと主張しない。

| 集合 | 結果 | 内容 |
|---|---|---|
| 新規原本比較／境界／独立本文読解 | 93 passed | 18×2の初回と旧保存比較36test、現行36test、意味境界12、作者呼出禁止の本文改変9 |
| 新規SQL保存・再開 | 8 passed | 現行3、旧3、現行／旧meaning保存後の中断再試行2 |
| 既存u344保持の対象回帰 | 73 passed | 現行1回答34、旧再導出18、再seal改変20、不正checkpoint1 |
| u345行構成の対象回帰＋identity | 13 passed | 3入力×Q1/Q3×初回／回答12、current owner identity1 |

無変更u345で18入力×Q1/Q3の初回36、回答後31、実問いなし5を凍結した。9入力×2経路で既存pairを回復し、他の現行結果／停止と全初回を保持する。9入力は現在positive、過去positive、現在negative、別感情訂正、別event撤回、程度、かな表記、別の明示SELF表記、既存wh程度object。fixture名scalarの「どれくらい不安なのか」は既存wh文法の範囲であり、objectのない不明を追加認識する変更ではない。原因問い、複数不明、前置不明、第三者／過去不明、pair訂正撤回、不明なし等は対照として保存する。

最初の新core実行は86 passed／7 failed。うち撤回2件は上記後段guardの実欠陥で修復した。残りは新testの期待誤りで、Q3本文成功による既存停止理由への到達1件、過去感情の既存名詞形「その時の悲しさ」を過去動詞のままと期待した2件、既存wh程度objectを対象外と誤分類した2件である。製品の文法をその期待に合わせて変更せず、観測した元仕様と対象責務に合わせて検査を修正し、該当8現行testと旧撤回2testを再実行した。Q3のnegative／訂正／撤回は本文未提供fallbackから正常なno-target判定へ進み、decision_reasonだけがfree_round_complete→no_bound_personal_meaning_targetに変わる。全て追加質問なし。

最初のSQL実行は5 passed／3 failed。現行撤回1件は同じ製品guard欠陥、旧訂正／撤回2件は保存状態をCOMPLETEDと誤期待したtestの誤りで、実際の旧RESPONSE_FAILED／MEANING_UPDATED_BODY_UNAVAILABLEを保持するよう修正した。最終8件を全再実行。関連testの収集でimport path不足2errorがあり、絶対PYTHONPATHで再実行した。途中実行・smokeの重複は最終件数に加えない。

Python3.12／pytest8.4.1／既存Pydantic2.14／隔離PGlite。周辺conftestの未導入fastapiを避ける既存`--noconftest`方式を継続し、新依存なし。原文不明の所有者／時点／kind／scope／anchor、required／optional関係、初回move増減、unknownへの更新、active unknown改変／関係追加を拒否する。独立本文readerは作者呼出を禁止したまま、不明の欠落・所有者／object改変、pair／別経験欠落、可能性確定化、反応／傾聴欠落、回答時点改変を拒否する。

## 保存と画面

実service＋隔離SQL/RPCで、現行ADD／REVISE／event WITHDRAW、旧u345の完成ADDと未提供REVISE／WITHDRAW、現行／旧のmeaning保存直後中断からの再試行を確認した。旧準備は新source helperだけを無効化し、無変更u345の独立fixtureと旧checkpoint／全出力が一致する経路を使用。架空の本文は保存していない。

新engineの生成を禁止してGET／startの全DTO、元入力、履歴、回答数、保存meaning、operationを確認した。retryでは保存meaningの再準備も禁止し、既存保存意味を使って回答を1回のまま完了する。旧保存本文・旧停止は新しい生成へ勝手に置き換えない。

8DTOを現行API client→useEmlisThread→Modalへ通し、GETのみでclose/reopen各2回。現在本文／未提供表示、元入力、履歴全event、問い／入力欄なし、全DTO一致を確認。HTTP／Auth／nativeはstubで、本人実機・本番DB・lost ACK・失効attempt・配置の検証ではない。

## 判定・次の残件

この有限な保持修復は完了。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK／TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR、初回一体単位未完了、正式Product Read0/3、candidate_ready=false、automatic_progression=falseを維持する。unknownへのReceptionは初回から存在せず、今回も追加していない。次は、この独立不明の未充足責務を実原文・初回と更新後の本文で整理し、既承認u334 exact3と混在4対象／3 movesの差分を明示する。定型的Reception、初回原文反復、一般入力／任意多段、pair否定訂正、E04深さ／E05問い／E06〜E09、本人実機は残る。

10/20方式判断・10/31残件管理・12/18目標・Piece/Analysis主枠53.25％は不変。STRUCTURE_MAP_DELTA_NONE、既存production2／新production0、logical81。公開wire／DB／RN／Safety／外部AI／依存／費用は変更なし。既存Draft/open/unmergedを保持しmerge／配置なし。

## 全変更file地図（16file）

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 既存answer owner。末尾の独立current SELF wh-unknownを全原文で証明し、別経験の探索からだけ除外。unknownを不変保持して元pairを回復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存撤回後の構成guard。source再導出済みpair＋残存感情に、関係のないcurrent SELF unknown1核が併存できるよう整合 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_pair_retention.py` | 新規。初回・旧保存の完全一致、現行の有限保持、source/active境界12改変、作者なし本文読解9改変 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_pair_delivery.py` | 新規。現行／旧保存6件と保存意味からの現行／旧中断再開2件、生成なしGET/start一致 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u345_unknown_pair_retention_v1.json` | 新規。無変更u345で18入力×Q1/Q3の初回36、回答後31、実問いなし5を凍結 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_update_retention.py` | extra_unknownを現行保持集合へ追加。旧u343凍結本文・意味は変更せず旧再導出も検証 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout.py` | extra_unknownのu344行構成比較は当時の保存checkpointで固定。現行比較は新u345原本suiteで担当 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | current owner identityのみ再導出。過去proofは保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 修復範囲・新旧保存・残件・次の開始点を記録 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 全体設計の現行差分 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 全16変更fileの地図。01B/Cの担当は不変 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 現行snapshot差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | EmlisAI構造・有限な保持範囲・未完 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装順・検証・進捗の正本 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週次の実績と次の残件 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u346_UnknownAlongsidePairRetention_20261018.md` | 新規。本監査、変更理由・未加工本文・検証・全file地図 |

## 未加工の現行Q3本文（合成入力）

rootが初回原本の全body／停止、下記9現行候補、旧保存body／停止を直接確認。同Workの読取レビューは正式Product Readに数えない。

### degree

原文：友達からの誘いを断って、一人で休めたことに少しほっとした。でも、もう誘ってもらえなくなるかもしれないと思うととても寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことに少しほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うととても寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### kana

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うとさびしい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うとさびしい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、そのさびしさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### now_negative

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：今は悲しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「悲しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点で悲しいことを小さくせずに受け止めています。
```

### now_positive

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### past_positive

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：その時は嬉しかった。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、その時は「嬉しかった」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、その時は嬉しかったのですね。
```

### revise_other

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：「嬉しくなかった」ではなく「悲しかった」です。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」ことについて、その時の受け止めは「悲しかった」と書かれています。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、その時の悲しさを小さくせずに受け止めています。
```

### scalar

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。どれくらい不安なのか、私にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「どれくらい不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### self_other

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、僕にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、僕にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### withdraw_event

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：「褒められた」は誤りです。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
最初の記録からは、当時の「嬉しくなかった」という気持ちが読み取れます。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。その時は嬉しくなかったのですね。
```

## 旧保存との具体差分

### unknown-True-add

COMPLETED／REFINED

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
褒められたことについて、回答した時点では嬉しいのですね。
```

### unknown-True-revise

RESPONSE_FAILED／MEANING_UPDATED_BODY_UNAVAILABLE

```text
本文未提供
```

### unknown-True-withdraw

RESPONSE_FAILED／MEANING_UPDATED_BODY_UNAVAILABLE

```text
本文未提供
```
