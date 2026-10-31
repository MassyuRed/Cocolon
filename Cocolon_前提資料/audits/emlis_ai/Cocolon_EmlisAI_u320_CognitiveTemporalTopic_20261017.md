# EmlisAI u320 — 認知内の時間主題の本文復旧と未解消事項

基準：API `d780c315ddad621120ff6399e5d1e8c05e7a3310`／Cocolon `599cb16ffb15a57cdbee07d20d7275a4eabe17e2`。Mashの今回の「EmlisAIの残件作業を進めて」を受けた既存設計内の可逆修復。全体設計01、全file地図01A/B/C、current01/04、正本06／API handoff、最新weekly20261017と対応実sourceを確認し、作業規則と永久保存ProductNeglect監査は全文確認した。System Context生成や全repo再監査を着手前提に追加していない。

rootを唯一の製品writerとし、同Work補助は原因追跡、独立範囲の検査、静的レビューを担当した。正式な別model Pro／Ultra評価ではない。今回の実行は既存local engineと隔離保存のみで、外部AI／live API／本番DBは使っていない。

## u320 — 認知内の時間主題で止まる本文を修復（2026-10-17）

最新weekly20261017のE04を追う中で、原03の自然変種「今後は誘ってもらえないかもしれないと考えると寂しい」が本文未提供になることを実測し、既存source契約内で修復した。新規自然変種3件（今後は・そのLIMITED・これからは）は未提供から本文ありへ復帰し、原03は不変。時間主題を内側の可能性の原文範囲へ残し、現在の感情の時点へ漏らさない。「今後も」の「今」だけを外側時点が消費する誤りと、「誘って」の動詞活用を人のtopic「って」とみなす誤りも同じsource ownerで修正した。後者は既存received動詞の受身語彙との活用対応で限定し、任意の漢字名詞を許可しない。

意味型・受容内容契約・作者／reader・Move／aggregate・公開API／DB／RN・質問上限は不変。旧u319 checkpointは今回修復だけを無効にした元意味を完全再導出し、旧IDへの新意味付替えを拒否する。製品変更はsource plan・questionのoriginal plan入口・answer updateの旧意味復元の既存3file。新しい意味型、外部AI、依存、補助systemは追加しない。

最終sourceの一括284件は **264 passed／20 failed／1 warning**（97.07秒）。内訳はscope／本文／旧checkpoint180、Q2/Q3 application54、周辺2file30 pass／20 fail。変更前d780c315で同じ周辺2fileを実行して30 pass／20 fail、20 failed node・102行の例外内容・retained assertion内訳が一致した（checkout path／process addressのみ正規化、trace表示はlong／short差あり）。この20件を成功へ換算せず、従来4／17／16との集合合算もしない。現行identityは別途1 passed／194 deselected。元10初回＋07回答後、固定100の全取得recordはelapsedを除きu319最終と一致し、元10本文10・固定100本文71／未提供29は不変。途中runは最終件数へ足していない。

実EmlisThreadService＋隔離PGliteで7ケース／8 DTO、現行RN hook／Modalのnative stubで8 DTOの全文・元入力・全履歴・close/reopenを確認。新規4件と旧完成原03のGET/startは作者禁止で同一、元入力DB行も不変。旧natural通常失敗はretryを409で拒否し、旧checkpoint中断retryは完全な旧意味・既存events・operationを保った上で旧意味による未提供を維持する。既存失敗の再実行許可へ変えていない。本人実機／本番DB／deploy／mergeは0。

E04の受容は依然として原文両節＋汎用の対比保持であり、今回を受容品質完成としない。scope情報がprivate内容投影で両端保持まで縮まる原因は確認したが、新しい内容armを足すだけで§9.2／§9.4の主観的な受容差分が成立するとは確認できなかった。新armは未実装・未推奨であり、承認待ちの次工程にはしない。同欄更新12件の再現ではREVISE4はreceived経験を落とし、WITHDRAW6は未撤回の行為／理由／未成立contextを受容から落とす。理由付きREVISE2は両経験を保持した。既存18検査の成功はObservation中心で、この10欠落の解消を証明しない。

`STRUCTURE_MAP_DELTA_NONE`（既存owner内の作用域と旧意味再導出。製品経路・意味契約の追加なし）。新しい旧u319 fixtureのみ01Aのfile追跡へ記録した。詳細・実測全文・途中版との区別は [u320監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u320_CognitiveTemporalTopic_20261017.md) を参照。

次は入力固有の受容を、語尾変更やsource分類の表示だけで済ませず、自然変種・訂正／撤回・保存表示まで一体で成立させる。E01の他の主体／時点／願い誤認、E05の問い、E06の上記10欠落、E07 history、E08本人実機、E09既存失敗は未解消。新意味契約が必要な場合は可視内容の差まで具体化して扱い、型追加そのものを次作業にしない。10/20方式判断、10/31管理線・12/18公開目標、Piece／Analysis主枠・管理評価53.25％は不変。

本文提供の修復はtechnical resultであり、PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置を維持する。同Work補助を正式な別model評価へ換算しない。

## 実装の因果箇所

1. `_source_current_cognition_parts` は感情を伴う入口に限り、`今後／これから`＋`は／も`を内側possibilityの範囲に保つ。裸の認知文の従来資格は変えない。`今後も`の先頭を外側の`今`へ切り分けない。
2. `_source_cognitive_feeling_parts` は時間副詞だけを主体照合時に除き、残部の他者topicを拒否する。`誘ってもらえない`等は従来のreceived受身語彙とgodan活用が一致する場合だけ、動詞の`って`をtopicと誤認しない。`先生ってくれない`／`母ってもらえない`／`資料ってもらえる`は拒否する。動詞語彙は既存3箇所の同じ文法を共通参照し、追加していない。
3. 外側感情は現在、可能性はその対象内として既存scopeへ投影する。内側の否定／未来を外側の不確実性／時点へ漏らさない。他者・報告・引用・外側の過去／否定／推量は新証明の対象外。
4. `original_meaning_plan` と `prepare_emlis_meaning` で、pre-u319より先にpre-u320の完全解釈を再導出する。既存過去flagも今回の変化を無効化する。新規初回を旧意味へ戻さず、旧checkpointを新意味へ付け替えない。fixtureは変更前git archiveから取得した4件の完全checkpoint・意味SHA・public結果で、歴史fixtureを変更していない。

## 実生成の比較と全文

以下4入力は今回の最終sourceで実生成した未加工本文。最初の原03は対照で変化なし、残る3件は基準版でUNAVAILABLEだった。rootが全4本文と保存8 DTOの対応を読んだ。これはhuman Product Readではない。

### original03

入力：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。

変更前：GENERATED。変更後：GENERATED。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いをどちらの側も残したまま、感じています。
```

### natural03

入力：友人の誘いを断って、一人で休めたことにほっとした。でも、今後は誘ってもらえないかもしれないと考えると寂しい。

変更前：UNAVAILABLE。変更後：GENERATED。

```text
見えたこと：
「友人の誘いを断って、一人で休めたことにほっとした」の一方で「今後は誘ってもらえないかもしれないと考えると寂しい」とあります。

Emlisから：
友人の誘いを断って、一人で休めたことにほっとしたという気持ちと今後は誘ってもらえないかもしれないと考えると寂しいこととの違いをどちらの側も残したまま、感じています。
```

### limited_natural03

入力：友人の誘いを断って、一人で休めたことにほっとした。でも、今後は誘ってもらえないかもしれないと考えると寂しい。何が不安なのか、私にもまだわからない。

変更前：UNAVAILABLE。変更後：LIMITED。

```text
見えたこと：
「友人の誘いを断って、一人で休めたことにほっとした」の一方で「今後は誘ってもらえないかもしれないと考えると寂しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
友人の誘いを断って、一人で休めたことにほっとしたという気持ちと今後は誘ってもらえないかもしれないと考えると寂しいこととの違いをどちらの側も残したまま、感じています。
```

### korekarawa_natural03

入力：友人の誘いを断って、一人で休めたことにほっとした。でも、これからは誘ってもらえないかもしれないと考えると寂しい。

変更前：UNAVAILABLE。変更後：GENERATED。

```text
見えたこと：
「友人の誘いを断って、一人で休めたことにほっとした」の一方で「これからは誘ってもらえないかもしれないと考えると寂しい」とあります。

Emlisから：
友人の誘いを断って、一人で休めたことにほっとしたという気持ちとこれからは誘ってもらえないかもしれないと考えると寂しいこととの違いをどちらの側も残したまま、感じています。
```

## E04とE06を完了にしていない理由

E04：原03のselected contentは `RELATIONAL_NONCOLLAPSE / PRESERVE_BOTH_ENDPOINTS` であり、sourceの経験対象／内側可能性／認知条件の区別はprivate内容投影まで十分に運ばれていない。scope fieldを増やすだけ、あるいは「過去／現在」「経験／可能性」の分類を本文へ挿すだけでは、8/28意味設計§9.2／§9.4の主観的受け取りを満たしたと判定しない。新private appraisalの案は検討したが、今回その追加を推奨・実装・承認待ち化しない。今後必要と判断する場合は可視内容の差を先に具体化し、規則18§11.3に従う。また「友達を傷つけたかもしれないと思うと寂しい」でも同じ認知構造が成立する実測があるため、「まだ起きていない未来」へ一般化しない。

E06：現行d780c315で「誘われたのに、悲しかったです。」にplain／reasoned／unfinished評価を続け、memo／memo_actionの同一欄に置いた12更新を実生成した。各REVISEは「『満足した』ではなく『満足しなかった』です」、WITHDRAWは「『満足した』は誤りです」の既存引用形。全12件RESOLVED／本文ありだが、Receptionでは以下が残る。

| 条件 | 実測 | 欠ける内容 |
|---|---|---|
| plain／unfinished REVISE×2欄 | 訂正評価1 Move、4件 | 未変更のreceived経験。unfinishedではそのcontextも受容に戻らない |
| reasoned REVISE×2欄 | 評価＋receivedの2 Move、2件 | 今回の10欠落には含めない |
| plain／reasoned／unfinished WITHDRAW×2欄 | received1 Move、6件 | 未撤回の行為と、それに属する理由／未成立context |

`_separate_reasonless_appraisal_received_source`の別欄資格だけを緩めてもWITHDRAW6は閉じない。withdraw後の残存行為は独立action dutyの証明に入らず、family代表へ縮む。既存`test_polite_received_prefix_updates_preserve_owned_meaning`は18 passed（21.73秒）だったが、REVISE／WITHDRAWのReception欠落を検査していない。これを修復成功としない。今回E06の製品変更は0。

## 検証の版と限界

- 最終scope180件は18.70秒。その後同じ最終製品sourceの一括284件で264 pass／既存20 failを確認し、180を重複加算しない。
- 途中版は新規probeの属性取違え、時間topic修復の不足、名詞topic誤許容を発見した版。初回scope158 pass／12 fail、限定前171 pass、途中一括259 pass／20 failを最終結果へ混ぜない。原文を成功する言い回しへ書き換えて解消扱いにはしていない。
- 最終元10／固定100の変更recordは0。source3file SHAの実行前後一致を確認した。全100本文を今回新たに読んだとは主張せず、既存u319実読結果とのrecord完全一致と今回変化した4本文の読解を分ける。
- 最終保存は7ケース8 DTO。RN検査は現行実hook／Modal＋native stubで、本人端末検証ではない。検査runnerの最初の読取ではDTO外側の記録構造を旧形式と取り違えたため修正し、8 DTOを最後まで再実行した。製品RNコードは変更していない。
- 最終周辺20 failedは変更前の同じ2fileと失敗node・例外内容・retained assertion内訳が一致。全trace表示は`--tb=short`と既定表示の差で同一ではない。従来4／17／16の集合対応は未確定であり、差し引き・合算・無害認定はしない。

## 最終source identity

実装commit：`1cedaeff2299b12fbe9ef6b03a6dd550c3c6cfa5`。下記source SHAと同一の版を検証した。

- language: `86d23b8d413decdcf92494c8ca8732fc1a3bf9d2a75f442cc54e620f4ad4f744`
- runtime: `6bc1eb7c5af4bd11e61a64bbc5943ef7a42922726ce3e49589b5098e9733c16f`

- `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`: `526eb7e57680dbccb110373127bfc45137f2ea0645a8295672f74859a08c3e7b`
- `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py`: `e8a708fc11cf940303fcf4888adfd2b70bcead61ef8c38ac693aea50035009cd`
- `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py`: `2d5b2d2bf228c0c264332bccfbc9f7db815a1f5fefdf610e63f1b22b37fabf69`
