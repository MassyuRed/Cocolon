# EmlisAI u337 — 訂正・撤回後に残る本人の安堵の人称を修復

作業日：2026-10-18。開始原本：mashos-api `703991e984ae15f279e57e73d9f72b232c526662`、Cocolon `4280778db5d0579b9334ce7c6d456b732f302a9f`。既存Draft PR #3／#30をfresh確認し、API開始版を無変更worktreeへ固定した。

## 必読確認・範囲

全体設計01、全file地図01A／01B／01C、両repositoryの全tracked path一覧、最新weekly20261017、current structure Emlis01／CMEE04、正本06、既存API handoff、Karen必読入口・現行規則・作業規則18 §11.3、出力規則99、商品無視incident全文、transport／durability規則、u336監査と残件を確認した。地図に加え影響経路のsourceを直接確認している。全ファイル内容を全件読んだという主張ではない。System Context prepareは補助checkout未配置で実行できず、9/5以降のoptional扱いに従い原典を直接読んだ。補助機構を追加していない。

今回は既存Emlis threadの意味保持修復。Cycle001のGate・受入れ・current navigationは変更せず、正本06・最新weekly・API handoffを現在の実装経路として参照した。

本会話のMashの継続指示とRule18 §11.3の既存目的・契約内の最小可逆修復を適用。LEVEL_1、single ownerはroot華恋、read-only補助二担当は原因／範囲の監査のみ。同Work補助を正式な別model評価、Pro／Ultra審査成立へ数えない。新しい内容契約、承認資格、受入基準、品質合格、配置判断を作らない。

## 閉じた欠陥と修復境界

元の二反応が片方の訂正・撤回で失効すると、残る過去の安堵が一般の単独受容へ戻り、本人原文の「私は」がEmlisの発話として露出していた。sourceは既に本人と証明されているので、所有者を変えず、聞き手としての人称だけを直す。

対象は、元の適格u332 pairの安堵、明示SELF（私／わたし／僕／俺／自分等＋は／が）、memoの完全一span、現在入力のrequired／explicit、過去の肯定feeling、訂正後も残る同じ核、関係・support・contextなし、既存recognize_lived_changeかつ選択済みMATERIAL_WEIGHT。裸の単独入力、別人・引用・他人の話、否定安堵、一般AFFECT／STANCEへ拡大しない。冒頭の代名詞以外のsource文字を変えない。

`source_relief_self_recipient:v1` は既存意味identityに含む表現資格版であり、新型や新しい主観内容ではない。旧checkpointは旧plan全体の一致でのみ復元。旧三対象carrierについては、この表現だけのlegacy flagを意味の旧modeと混同しない。

独立readerは作者を呼ばず、live targetとsource全体、共有appraisalに含まれる当該selected basis／contributionを照合する。LIMITEDの共通評価内容を一対象へ削らない。実際の「あなたは／あなたが」を原文の人称へ戻し、残り全文字をexact一致させる。専用readerが失敗した対象を汎用nominal検証で通さない。

検証途中に、共有appraisalの全対象と一文の選択対象を集合一致させたため正常本文が停止する不備を発見し、保存・本文検査で修正した。初期の58成功では汎用fallbackが専用readerの不成立を隠していたため、その初期値を最終成功数へ加算しない。最終版は選択根拠が共通評価内容に含まれ、共通評価内容のbinding／contributionも実basis内に存在することをそれぞれ確認する。

## ファイル地図

STRUCTURE_MAP_DELTA_NONE。新production fileなし。論理contract79、公開API／DB／RN／依存／外部AI／費用／配置は不変。

| mashos-api exact path | u337の差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 元の適格pairで明示SELF安堵へ表現資格版を付ける。新意味型なし |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行と全歴史source modeへ旧表現flagを伝播 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | u336の旧checkpoint全体を先に再導出して復元 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 表現だけのlegacy flagで旧u336独立不明carrierを失効させない |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 原文の明示SELFを再証明し、単独残存安堵の先頭人称だけ「あなた」に変換 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 共通appraisalの選択basis・live核・全原文から独立に人称を検証。汎用fallbackによる迂回禁止 |
| `ai/tests/test_cmee_emlis_relief_self_recipient.py` | 現行初回40／更新21、旧61完全復元、二作者禁止変異、偽根拠、資格対照、SQL保存再表示 |
| `ai/tests/fixtures/cmee_emlis_u336_self_recipient_v1.json` | 無変更u336 commit 703991eの実engineから取得した合成61完全record |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終source ASTからcurrent identityを再導出。過去の凍結fixture不変更 |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 実装・検証・残件の再開先 |


## 検証

| 最終sourceの重複なし検証集合 | passed | failed |
|---|---:|---:|
| 新self_recipient | 145 | 0 |
| 既存relief_anaphora／self_continuation／relief_unknown／relief_unknown_source／relief_cognition | 504 | 1 |
| current shared owner identity | 1 | 0 |
| 合計 | 650 | 1 |

skip0。650件suiteは649成功／1失敗、616.47秒。identityの選択1件は26.08秒。全project suiteではなく、前回1244件を今回の成功数へ流用していない。既知失敗は `test_new_selection_requires_the_two_source_roles_and_preserves_controls[explicit_self]`。u333で修復済みの入力へ、u331当時のprojection停止を求める期待であり、今回も同名・同理由。既存assertion・歴史fixtureは変更していない。

新145は現行更新21＋旧更新21＋現行初回40＋旧初回40＋本文実変異9＋再identifyしたforeign basisの置換／追加4＋資格外6＋偽checkpoint1＋SQL保存再表示3。実変異で本文作者とObservation rendererを禁止し、人称・助詞・対象・肯否・時点・程度・結論改変を拒む。LIMITED共通appraisalにforeign binding／contributionを追加してsealを再計算した場合も拒む。

初期検査の不備（readerの集合範囲と汎用fallback、凍結初回fixtureに異なるテストrequestを使用したこと）を直した後、最終6module全650件を再実行した。identity初回収集のPYTHONPATH不足も修正して選択1件を実行。途中の成功・失敗や再実行を重複加算しない。

実service＋隔離PGlite SQL/RPC15ケース：現行3訂正／撤回×Free／Plus／Premium=9、u336完成保存3、u336の更新意味checkpoint後の実中断→現行retry3。旧完成はGET／startで非再生成、旧更新checkpointは旧人称の本文へ完全復元。元入力・全timelineを保持。同じ15DTOを実API client／hook／Modalへ通しclose/reopen各2回、text／original／timeline全体一致。native・HTTP・Authはstubで、本人端末・本番DBではない。

最終language identity：`80bf1f03967d225880ba45301cff86f092a6ed01eaaae0cc762b05339160299b`。runtime identity：`3015454e48ba50348cd42fdbe43e407a80fee93d40c8366232f6ee5e8079dd96`。current identityだけを実ASTから再導出し、歴史fixture／既存期待を変更していない。

## 実本文の読取

以下は合成入力。主担当が全21更新のObservation／Receptionと初回40の結果を確認。21更新は本文21のまま、18の人称のみ改善、主語省略3は不変。初回40は本文21／なし19のまま。本文があることと商品品質は別であり、定型的な「受け止めています」の反復や深さは未解決。

### 私は-factual_present

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。
```

実在する問いへの回答：

```text
「もう誘ってもらえなくなるかもしれないと思うと寂しい」ではなく「もう誘ってもらえなくなったので寂しい」です。
```

修正前Reception：

```text
言い直してくださった気持ちは、もう誘ってもらえなくなったので寂しいということなのですね。私は友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

修正後の完全本文：

```text
「私は友達からの誘いを断って、一人で休めたことにほっとした」という気持ちが書かれています。
「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
その時の気持ちとして、「もう誘ってもらえなくなったので寂しい」が見えます。
言い直してくださった気持ちは、もう誘ってもらえなくなったので寂しいということなのですね。あなたは友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

### 私は-factual_past

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。
```

実在する問いへの回答：

```text
「もう誘ってもらえなくなるかもしれないと思うと寂しい」ではなく「もう誘ってもらえなくなったので寂しかった」です。
```

修正前Reception：

```text
言い直してくださった気持ちは、もう誘ってもらえなくなったので寂しかったということなのですね。私は友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

修正後の完全本文：

```text
「私は友達からの誘いを断って、一人で休めたことにほっとした」という気持ちが書かれています。
「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
「もう誘ってもらえなくなったので寂しかった」と、当時の気持ちを言い直されています。
言い直してくださった気持ちは、もう誘ってもらえなくなったので寂しかったということなのですね。あなたは友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

### 私は-withdraw

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。
```

実在する問いへの回答：

```text
「もう誘ってもらえなくなるかもしれないと思うと寂しい」は誤りです。
```

修正前Reception：

```text
私は友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

修正後の完全本文：

```text
「私は友達からの誘いを断って、一人で休めたことにほっとした」という気持ちが書かれています。
「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
あなたは友達からの誘いを断って、一人で休めたことにほっとしたという気持ちを受け止めています。褒められたことと嬉しくなかったこととの違いを小さくせずに受け止めています。
```

## 残件と次の具体的単位

- 過去の「何が嫌なのか、自分でもよくわからなかった」は現在の自己評価として扱われる。evidence ledgerのself_awareness分類、現在不明だけのsource補正、時点認識の境界が原因候補。u334の保持資格は本人・現在のwh不明なので、過去不明の保持まで同じ承認と扱わない。今回は未実装。
- 「どうしたいのか」の未対応、否定安堵・対比欠落・不明先行での独立不明欠落、一般入力の主体／時点、E04の深さ・E05の問い・E06〜E09は未完。
- 次の単位は過去不明の原文・分類・時点とactual bodyを並べ、source誤読の修復と新しい保持資格の必要性を分けた具体案にする。意味／保持契約が広がる部分はMashの個別判断へ渡す。

10/20方式判断を延期しない。10/31管理線・12/18目標・Piece/Analysis主枠53.25％は不変。

## body-free terminal Receipt

- necessity：DIRECT_PRODUCT_OR_ACCEPTANCE_WORK
- primary outcome：TECHNICAL_CREDIT
- product：PRODUCT_NOT_CLEAR、初回一体単位未完了、正式0/3
- candidate_ready=false、automatic_progression=false
- success：当該訂正後の本人の人称修復と旧意味／保存互換、独立source検証
- zero effects：本番DB、実機、deploy、merge、外部AI、公開API変更、新しい外部サービス費用、Mashの操作依頼
- 所要：全セッションの厳密計測なし。最終検証の実行秒数は上の検査結果に記録する。
- authority terminal：当該最小修復を終了。次の意味保持契約変更は未承認・未実行。
- remote：API commit `c26ece428f59a01cf8928ab19bd5416b879c7d31`、tree `bb6ad4c44897ccb38cff0e9fd01a1c43c5c6438b`。既存Draft PR #3へnon-force反映し、fresh fetchでparent／10変更path／全blob SHA／local tree一致を確認。資料は既存Draft PR #30の本書を含むcommitへ保存し、最終HEADと読戻し結果をPR本文・完了報告に記録する。
