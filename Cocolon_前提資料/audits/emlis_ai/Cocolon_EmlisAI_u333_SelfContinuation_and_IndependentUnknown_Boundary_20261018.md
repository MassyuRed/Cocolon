# EmlisAI u333 — 本人主語継続の修復と独立不明の保持境界

作業日：2026-10-18。基準：Cocolon `430197f945d44ca1663264b8be1185509a3a87cf`、mashos-api `2af661109e81456bce0da03b7d2df34cf3c93129`。両既存PRの同一作業branchで実施。

## u333 — 明示した本人主語の継続を修復／独立不明の保持境界を確定（2026-10-18）

原03の冒頭に「私は」を付けるだけで後節の主体証明が落ち、本文が停止していた。先行する名詞化された過去の安堵を実nucleus・完全source節で再証明し、実対比を経た現在の不確かな認知・寂しさに限って本人主語を継続する。わたし／僕／俺／自分、は／が、程度、過去の可能性、独立不明／別経験の併記を含む11例が本文生成へ改善。喜び等の一般肯定感情、先行する別人の文、私有物、引用・他人帰属へ適用しない。過去丁寧形の帰属もmemo／memo_actionで拒否。

新規意味は旧checkpointと区別する。u332の26例（11改善・15対照）のcheckpoint全体・核辺に対応するplan・selectedまたは同じ停止・本文・問いを完全復元。旧modeを全歴史source modeへ伝播。新規95検査、既存選択集合、current owner identityを重複除外して963 passed／8 failed／skip0。8件は旧replace無変化6・新規原03へ旧IDを要求1・今回直したexplicit_selfの停止を要求1。既存assertion／歴史fixtureは変更せず、現行成功・作者禁止の実変異拒否・旧意味復元を別に確認。前回Q3旧本文期待3件はこの集合に含めず、解消したと扱わない。

実service＋隔離PGlite SQL/RPC11ケースと同じ11DTOのAPI client／hook／Modal確認を実施。Free／Plus／Premium、5訂正・撤回、旧完成非再生成、checkpoint前／後の中断、GET／start、元入力・履歴・close/reopenを確認。checkpoint前は現行生成、旧checkpoint後は旧意味を保持するためUNAVAILABLE/body_not_validatedのままであり、復旧成功へ水増ししない。native/HTTP/Auth stubで、実機・本番ではない。

STRUCTURE_MAP_DELTA_NONE。既存production 3owner、test1・fixture1を追加しcurrent owner identityを更新。意味型・contract数77・公開API・DB・RN・依存・外部AI・費用・配置は変更なし。

独立した「何が不安なのか、私にもまだわからない」はObservationに残るがReceptionで落ちる。2moveの試作ではLIMITEDの一claimが3対象全体のMATERIAL_WEIGHTになり、承認済み二反応が消えることを実出力で確認した。試作は撤回済み。全体LIMITED／一claimを保持したまま、安堵・寂しさのlocal内容を独立不明と併存させる限定保持契約を次の個別承認案とする。既存retained型は更新後／過去経験等の資格が異なるため無断転用しない。作業規則18 §11.3の内部内容契約変更に当たるため、具体案を監査に記載。

原文の反復・長文、独立不明のReception保持、一般入力・主体／時点の未対応、E04深さ／E05問い／E06〜E09は残る。「私も」の初回、および新しい訂正文自体に「私は」を含める安堵否定等は今回拡張していない。検証した安堵否定は旧全文を正確に指定し、新節では主語を省略した既承認grammarである。

primary outcome=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=false。Draft/open/unmerged・未配置。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％を維持。

詳細・未加工本文・承認案：[Cocolon_EmlisAI_u333_SelfContinuation_and_IndependentUnknown_Boundary_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u333_SelfContinuation_and_IndependentUnknown_Boundary_20261018.md)。

## 着手時に読んだ正本と作業判断

前回作業添付、Karen read first／現行作業規則／Rule18 §11.3／必須事故記録、最新weekly 20261017のu331・u332承認、全体設計01・file地図01A/B/C・両repositoryの全tree、current structure入口・Emlis01・CMEE04、u332監査、正本06、API handoff、関連設計を照合。全ファイルの内容を全件読んだという意味ではなく、全treeと既存責務地図から今回のownerを追跡した。System Context prepareはローカルworkspace配置の未検出で失敗したため、規定どおり現行branchの直接原本へ戻した。文脈整備のためのtool修復や全99分岐再監査へは進まなかった。

同Work内の補助2者は読み取り専用の原因／反例監査。正式な別model評価には数えない。rootが変更・統合・実本文確認・保存を担当。

## 原因と採用した修正

`_final_source_current_cognition_nuclei` は先行節に「は／が／も」があると汎用owner checkerを要求していた。そのcheckerは「私は…休めたことにほっとした」という名詞化された感情節全体を受理しない。主語省略の原03や後節にも「私は」がある場合だけ通る非対称があった。

汎用checkerを緩めず、その直前にsource-firstのSELF過去安堵を証明する局所資格を追加。実nucleusのactor・predicate・modality・polarity・time・source witness・span bytes、先行節全体、実contrast gap、後節の可能性／寂しさを照合する。報告・後置帰属、内側の一人称所有、他人のtopic、別の肯定感情は資格外。Q1は既存relief slotによって既存prepared経路へ入り、別engine経路を追加しない。

意味核が変わるため新checkpointを作る。`_legacy_cognitive_self_continuation` は現行source proofのみ無効にしてu332全体を再導出し、供給されたcheckpoint全体が一致した場合だけ復元。旧IDを新意味へ付け替えない。direct builderの既定は従来どおり。

## 変更ファイルと責務

| 実path | 変更責務 |
|---|---|
| `mashos-api/ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 局所SELF継続証明・旧source mode。既存作者／readerは変更なし |
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／全旧source modeの明示伝播 |
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧u332 checkpoint完全復元の優先経路 |
| `mashos-api/ai/tests/test_cmee_emlis_self_continuation.py` | 新規95検査。source・Q1/Q3・NORMAL/LIMITEDの独立変異・5更新・8SQL保存・帰属 |
| `mashos-api/ai/tests/fixtures/cmee_emlis_u332_self_continuation_v1.json` | 凍結u332実engineで取得した26例のcheckpoint／plan／selected・停止／本文・問い |
| `mashos-api/ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行source ASTからlanguage/runtime identityを再導出。歴史fixtureは不変 |
| `mashos-api/ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 修復・限界・具体的な次の承認案の所在 |

## 実行結果の読み方

| 重複を除いた集合 | passed | failed |
|---|---:|---:|
| 新self_continuation | 95 | 0 |
| 既存relief_cognition | 81 | 1 |
| 既存source_scope＋contrast_reference | 732 | 7 |
| Q2/Q3 application | 54 | 0 |
| current owner identity | 1 | 0 |
| 合計 | 963 | 8 |

全project suiteではない。skip0。新95とidentityは最終sourceで96 passed／194 deselected。既存reliefの1件はfixtureのexplicit_selfを現在も停止させる旧期待であり、新検査の成功／旧復元の両方で実態を確認した。source_scopeの7件はu332と同じ旧replace無変化6・fresh原03旧ID要求1。保護assertionは削除・弱化していない。前回Q3旧本文3失敗は本集合では再実行していない。

Python3.12.14／pytest8.4.1／Pydantic2.13.5／FastAPI0.115.12／httpx0.28.1／既存PGlite0.5.8。`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`、`--noconftest -p no:cacheprovider -q`。既存testdepsと各既存AI import path、`Q2_PGLITE_MODULE`を指定。使用test名は上表の実file名、identityは `test_active_final_language_owner_chain_has_zero_legacy_compose_calls`。既存production dependencyは追加していない。

途中試験の失敗は件数に加算しない。並行実行中のsource修正で一つ前のidentityを保持した試験processはidentity 1件が失敗したため、最終sourceからfixtureを再導出し、新95＋identityの96件を再実行して成功した。初回SELF guardの適用範囲が喜び／別人先行文／後置帰属へ広がったため、反例を使って限定した。訂正文自体の一人称は旧grammarが拒否するため、これを修復済みと見せる試験にはせず、既承認grammarによる訂正を確認。旧本文停止をretryableと仮定した補助検査を修正し、実worker cancellationと保存済みbody_not_validatedを区別した。

## 未加工の前後本文（11改善例）

以下は凍結u332と現行engineの実結果。整文・要約をしていない。旧11例は本文なし。未提供を空の成功本文に数えない。

### self_watashi

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### self_hiragana

入力：

```text
わたしは友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「わたしは友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### self_boku

入力：

```text
僕は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「僕は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### self_ore

入力：

```text
俺は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「俺は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### self_jibun

入力：

```text
自分は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「自分は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### self_ga

入力：

```text
私が友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私が友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたが友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### relief_degree

入力：

```text
私は友達からの誘いを断って、一人で休めたことに少しほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことに少しほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことに少しほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### lonely_slight

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと少し寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと少し寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと少し寂しいという気持ちにも、今、耳を傾けていたいです。
```

### past_possible

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、友達を傷つけたかもしれないと思うと寂しい。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「友達を傷つけたかもしれないと思うと寂しい」とあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、友達を傷つけたかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### with_unknown

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、私にもまだわからない。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### with_question

入力：

```text
私は友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。
```

変更前：本文なし／emlis_q3_initial_body_unavailable。

変更後：

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。

Emlisから：
あなたは友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

## 保存・再表示11ケース

実serviceと現行migration／RPCを隔離PGliteで使用。同じDTOを現行 `emlisThreadApi` → `useEmlisThread` → `EmlisThreadModal` へ通し、原入力・全timeline・current bodyを一致確認。各caseはclose/reopen各2回。service再起動後は作者を禁止し、GET／startが同じDTOを返すことを確認。native／HTTP／Auth stubであり実端末や本番DBの確認ではない。

| ケース | 保存結果 |
|---|---|
| current Free／Plus／Premium | FINAL、二反応あり、質問なし |
| u332完成済み原03 | 旧保存本文をbyte一致で非再生成 |
| u332初回checkpoint前storage中断 | 再試行で新意味・新本文 |
| u332初回checkpoint後worker中断 | 同一旧checkpoint。旧本文停止を保持しUNAVAILABLE／body_not_validated、can_retry=false |
| 安堵否定／実際の出来事＋現在寂しさ／同過去寂しさ | 実際の問いへのREVISE、二反応失効、残る経験保持、REFINED |
| 左撤回／右撤回 | WITHDRAW、二反応失効、残る経験保持、REFINED |

後checkpointケースは本文復旧成功ではない。旧意味を新意味へ読み替えず保持できたという互換検証である。旧完成済み原03も今回停止修復の成功数には加えない。

## 未採用試作：独立不明を保持すると二反応が落ちる

入力は原03＋「何が不安なのか、私にもまだわからない。」。現行はObservationに不明が残るがReceptionにはない。sourceには安堵s1・寂しさs3・wh不明s4の3required nucleusがある。候補のcurrent_burdenがlived_changeにより削除され、1moveだけ選択される。

既存retained groupsで2move／2文へ戻し、既存unknown作者・readerへ接続した試作の**実出力**は次のとおり。

```text
友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いを受け止めています。何が不安なのか、あなたにもまだわからないのですね。
```

これは不採用。独立readerは `body_inverse_nominal_cognition_feeling_object_missing:rm1` で拒否。安堵／現在の傾聴も欠落する。LIMITEDの `resolve_limited_reception_aggregate` が全3対象を一claimのMATERIAL_WEIGHTへ統合するためで、作者だけ修正してfacetを後付けできない。試作のproduction差分は全て撤回し、採用差分に混入させていない。

## 次の個別承認案：独立不明と承認済み二反応の限定併存

作業規則18 §11.3では内部内容契約・資格の拡張は個別承認が必要。u332で承認された二反応そのものは変えず、それを異なる対象と併存させる保持資格を追加する案である。

- 対象は現行の完全source証明が通る一対の過去安堵／現在の可能性に伴う寂しさと、独立した本人・現在のwh不明一つだけ。追加の別素材・他人帰属・引用・過去不明・対比欠落は資格外。
- 全体LIMITED／三対象／一claim／MATERIAL_WEIGHTは維持する。安堵・寂しさのmoveに限り、既存 `EmlisReliefCognitionAppraisalContent` をsourceから再証明して保持する。
- 新しい限定carrier／decision版には、全体claim・projection seal・checkpoint・move・二対象の全basisとsource資格を結び付ける。既存の訂正後／過去経験向けretained型を資格外の初回入力へ転用しない。
- 独立不明のmoveは既存material receptionを用いる。推定uncertain_connectionは原因・背景に転用しない。作者と独立readerの両方で証明し、片側欠落、対象交換、確定化、原因化、古い資格の再利用を拒否する。
- 公開API・DB・RN・外部AI・課金・deployは変更しない。原入力は既存どおりENDで、検証用の架空の問いは作らない。u332 source／5訂正撤回／歴史checkpoint、完成済み非再生成と生成中断前後を一括確認する。

期待する本文は以下。**未実装の承認案であり、現行成功本文ではない。**

```text
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。
```

この案で短文化まで達成したとは扱わない。短文化は既承認ANAPHORIC設計を参照しつつ、Reception単独の全節保持をObservationと共同の根拠保持へ変更するかを、別の具体的保持条件として判断する。protected testの両section全節assertを黙って弱めない。

API反映commit：`92cc0832998e488ac352b6c9504beaacb9be79cd`。既存PR #3へnon-forceで反映し、7fileのblob SHA／内容と検証済みlocal tree一致を確認。資料は既存PR #30へ保存。merge・deployは未実施。
