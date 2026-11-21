# EmlisAI u339 — 本人の過去不明を認識・返答・旧互換・保存まで修復

作業日：2026-10-18。開始原本：API `e9dde192d1b4de8a52d7ecc79c5f30ccc9e93d04`（製品はc26ece4と同一）、Cocolon `e604b45ce9b5e258a6c5b3134d1ea600f4729d9c`。承認記録を先にCocolon `27ae3b875547219b7786fe73056e619a975c719d` へ保存し、fresh取得で本文とheadを検証した。

## 承認・必読・責任

Mashはu338の限定提案と「認識・返答・旧データ互換・保存確認まで」の質問を引用し「進めていいよ」と明示承認した。Rule18 §11.3の当該LEVEL_3拡張に適用。u338は当時の未承認・未実装の診断記録として変更しない。

本会話で全体設計01、全file地図01A／01B／01C、両repo全tracked path、Karen必読入口・前提／規則・恒久incident、current structure、正本05／06・API handoffを読了した継続作業。今回もu338・最新weekly・Rule18 §11.3と影響sourceを確認した。全fileの内容を再び全件読んだという意味ではない。root華恋が唯一の編集・反映owner。同Workの二担当はread-only原因／範囲レビューであり、正式別model Pro／Ultra審査や商品受入れに数えない。

## 修復内容と境界

「進めていいよ」というu338限定案への個別承認を、weekly20261017のu339承認節に製品変更前に保存した（27ae3b8）。従来の本人・現在のepistemic unknown契約を、以下の完全sourceを証明した本人・過去認識だけに加算拡張する。既存現在経路は不変。

- 初回memo全体が、既存wh対象＋後置の明示SELF＋任意の既存程度語＋「わからなかった／分からなかった」の独立完全節だけ、または適格な既存u332 pairの後ろにその一節を置いたもの。完全field／span／source owner／required・explicit／current original envelopeと一意性を再証明する。
- 核はuncertainty／current_user／negative／uncertain／past。`source_past_self_unknown:v1` と対応するsource qualifier版が必要。版だけでは資格としない。唯一のsource_explicit_epistemic_limit境界のaffected nucleus・evidence span・hedge_onlyと同じ対象を結ぶ。UNKNOWNを残す。
- 既存UNFINISHED／PRESENT_UNFINISHED／NO_RELATION_CLAIMを維持し、時制はpast qualifierで分離する。単独は既存UNFINISHED_OPENNESS／LEAVE_UNFINISHED、pair三対象は既存MATERIAL_WEIGHT／RECEIVE_AS_MATERIALとu334のlocal保持を当該完全sourceへ限定拡張する。現在も未完という事実を付加しない。新enum・型・DIRECT_STATE写像なし、論理contract79不変。
- 原文の内側の対象「何が嫌なのか」を「何が嫌だったのか」に書き換えない。外側の「わからなかった」と所有者・肯否・程度を作者と独立readerの両方で保持し、今も不明／解決済み／原因を推測しない。聞き手へのSELF人称変換だけを許す。
- source→checkpoint→plan→selected／aggregate→実本文まで照合する。past readerはselected必須・move decision一意・全appraisal basis／contributionの既知根拠内包含・対象のresponse／primary所属とpast軸を照合し、作者を呼ばず原文全体を復元する。専用reader失敗時に汎用経路へ落とさない。
- 旧checkpointは過去資格を無効にした旧modeで全体一致する場合のみ復元し、旧plan／selected／artifactまたは旧停止を保つ。旧IDへ新意味を付け替えない。旧完成は保存DTOを非再生成で読む。
- 初回・回答なし・round0・更新／失効／未解決partsなしに限定する。対象入力はEND。回答・訂正・撤回の新資格は作らない。既存実在質問を持つ更新は回帰対照。
- 丁寧過去、時間prefix、先頭／暗黙SELF、他者、引用／報告／疑問／条件、追加material、不明先行・不完全pair、一般AFFECT／STANCE／原因補完は対象外。別の拡張へ本承認を流用しない。



u338のObservation例は原文引用だけだったが、実検査では既存echo gateが不足と判定した。gateを弱めず「その時の認識として、」を付け、原文を引用した過去認識として表示する。現在化・原因推測・対象改変を加えない。独立readerもこの時点表現を検証する。

最初のselected readerレビューで、foreign appraisal basis／contribution、response／primary欠落、decision重複、selectedなしの受理を発見した。pastだけを厳格化し、実際に再identifyした変異も作者禁止で拒否するテストを追加した。既存現在readerの互換仕様は拡張しない。

候補表のemlis_thread_source.pyは変更不要だった。既存境界生成はそのまま使いprojectionがsourceを再証明する。一方、Q1の既存入口は新prepared planを使う分岐が必要だったため、emlis_thread_engine.pyへ当該markerの2行を追加した。候補9ownerからthread_sourceを除外し、同じ承認対象をQ1へ渡す既存thread_engineを追加したため、最終差分も9ownerとなる。承認対象以外の新資格・新型・carrier familyは増えていない。

## ファイル地図

| mashos-api exact path | u339の差分 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 完全memo・一意の後置SELF・過去陰性wh節を再証明しsource_past_self_unknown:v1を付す。単独または完全pair末尾のみ |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 新資格・同一sourceに限るpast unknown binding。UNFINISHEDと既存enumを維持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 初回限定・完全source・唯一のUNKNOWN境界とspanを再証明。既存三対象保持を限定拡張 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 新source modeと全歴史modeを分離。問いの範囲追加なし |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpoint全体の一致から旧意味・旧本文／停止を復元 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | 新資格付き初回はQ1入口もprepared planへ接続 |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | その時の認識として完全原文を示すObservation |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 過去の具体対象・程度・肯否を保持しSELFだけ聞き手の人称へ変換 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 作者を呼ばない原文復元、selected内容／past軸の照合、専用reader失敗時のfallback拒否 |
| `ai/tests/test_cmee_emlis_past_unknown.py` | 新14／不変30、旧44完全復元、本文・選択・境界改変、SQL保存を検証 |
| `ai/tests/fixtures/cmee_emlis_u337_past_unknown_v1.json` | 無変更c26ece4から実行取得した合成44record。歴史原本 |
| `ai/tests/test_cmee_emlis_source_scope_regressions.py` | 単独過去1行の旧admission境界をu337凍結checkpointへ固定。現在の適格性は新testで確認 |
| `ai/tests/test_cmee_emlis_relief_anaphora.py` | 過去3歴史対照だけ旧checkpointを明示。既存assertion維持 |
| `ai/tests/test_cmee_emlis_relief_self_recipient.py` | 過去3初回歴史対照だけ旧checkpointを明示。更新の現在対照維持 |
| `ai/tests/test_cmee_emlis_relief_unknown.py` | 当時除外していた過去1行を歴史checkpointへ固定。既存assertion維持 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終sourceからcurrent identityを再導出。歴史fixtureは書き換えない |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回の承認・結果・残件・再開先 |


## 検証と限界

最終結果は、再実行後の重複除外 **1,439 passed／既知1 failed／skip0**。新module186、関連6module1,252成功・既知1失敗、current identity1。初回まとめ実行は1,423 passed／4 failed（930.83秒）。このうち今回の承認で現在の結果が変わる過去対照3件について、既存assertionを変えず歴史checkpoint／実行modeを正しく選び直した。該当parameter familyの再実行はanaphora15、pair旧境界12、単独旧境界12がすべてPASS。これらを新規成功39として加算せず、初回の3失敗だけを置き換えて集計した。まとめ実行のcollection後に追加した境界／SQL12件も全PASS、current identity1もPASS。

残る既知失敗は `test_cmee_emlis_relief_cognition.py::test_new_selection_requires_the_two_source_roles_and_preserves_controls[explicit_self]`。u331の「停止する」期待とu333以降の既存対応の不一致で、u337の最終記録でも同じ1失敗だった。今回は当該test・歴史fixtureを変更していない。これを合格に数えず、今回の限定修復に新たな製品失敗は検出されていないという範囲で報告する。全件green・商品合格とは記さない。

基準版c26ece4を無変更worktreeへ固定してから、元の24＋追加20=44入力の全checkpoint／plan digest／selected digestまたは同じ停止／artifact／問い／reasonをfixture化した。修正後は14入力を改善、30入力は完全不変。本文の有無は旧36本文／8未提供から現行40本文／4未提供になったが、これは出力数であり商品品質の成功数ではない。44旧checkpointは全意味・出力／停止を復元した。旧fixtureのsource_commitはc26ece428f59a01cf8928ab19bd5416b879c7d31。既存u335／u336の過去3行とu333の過去境界1行・u337単独過去admission境界1行は、承認された現在結果と歴史期待を混同しないよう旧checkpointを明示した。u335→u336の短縮表現を検証する3行にはu336凍結checkpointを使い、短縮まで古いu335状態へ戻す初期のテスト指定を修正した。u333の過去境界行も凍結時と同じQ3実行モードへ揃え、Q1モードへの旧checkpoint混入を解消した。既存assertionと凍結歴史fixtureは維持し、新現在結果はu339テストで別途確認する。

実service＋隔離PGlite SQL/RPC14ケースと同一14DTOの実API client／hook／Modal close/reopen各2回を実施。新規単独／pair×Free／Plus／Premium6、旧成功／旧UNAVAILABLE×単独／pair4、旧初回のcheckpoint前後中断×成功／UNAVAILABLE4。旧完成GET／startの全DTO一致を作者禁止で確認。旧checkpoint後はprepareを禁止してretryし、旧意味イベント全体・source prefix・operationを維持しattemptだけ更新、旧成功／旧未提供へ戻る。checkpoint前は意味未保存なので新資格で生成する。現行対象はEND、旧未提供はUNAVAILABLEを維持し、全ケースで追加質問・回答入力はない。原文・全履歴を保った。HTTP／Auth／nativeはstub、合成データのみで本人端末・本番DBの証明ではない。

再実行対象は `test_cmee_emlis_past_unknown.py` と、relief_self_recipient／relief_anaphora／relief_unknown／relief_unknown_source／relief_cognition／source_scope_regressions の6既存module。`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`、`PYTHONDONTWRITEBYTECODE=1`、`--noconftest -p no:cacheprovider` を使用し、既存のPGlite helperへ隔離PostgreSQLモジュールを設定した。現行shared-owner identityの既存検査も別に実施。product dependencyの追加はなく、pytest/httpx/PGlite/React/Babelはscratchの検証用に用意した。

current language identity：`ce582cc5f3bb42828d04f6ca70e87d4c3736603e444babcb8958cc997eccdd87`。runtime identity：`16cc2d383e0183371ef1e6eca49cf18d7124f4cc924a23ba04ad041bafd88bbd`。歴史のidentity証拠は変更しない。

## 実本文

主担当が44現行結果を確認した。以下14件は実際の生成本文。pairの前半の「今」は既存の寂しさに対するEmlisの傾聴へ係り、過去不明に現在継続を足していない。内容が保持されることとE04の深さ・商品合格は別である。

### jibun_past_single

入力：

```text
何が嫌なのか、自分でもよくわからなかった。
```

Observation：

```text
その時の認識として、「何が嫌なのか、自分でもよくわからなかった」とあります。
```

Reception：

```text
何が嫌なのか、ご自身でもよくわからなかったのですね。
```

### jibun_past_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分でもよくわからなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「何が嫌なのか、自分でもよくわからなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が嫌なのか、ご自身でもよくわからなかったのですね。
```

### watashi_past_single

入力：

```text
何が不安なのか、私にもまだわからなかった。
```

Observation：

```text
その時の認識として、「何が不安なのか、私にもまだわからなかった」とあります。
```

Reception：

```text
何が不安なのか、あなたにもまだわからなかったのですね。
```

### watashi_past_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、私にもまだわからなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「何が不安なのか、私にもまだわからなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからなかったのですね。
```

### boku_past_single

入力：

```text
何が不安なのか、僕にもまだ分からなかった。
```

Observation：

```text
その時の認識として、「何が不安なのか、僕にもまだ分からなかった」とあります。
```

Reception：

```text
何が不安なのか、あなたにもまだ分からなかったのですね。
```

### boku_past_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、僕にもまだ分からなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「何が不安なのか、僕にもまだ分からなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだ分からなかったのですね。
```

### self_suffix_single

入力：

```text
何が嫌なのか、自分自身でもまだはっきり分からなかった。
```

Observation：

```text
その時の認識として、「何が嫌なのか、自分自身でもまだはっきり分からなかった」とあります。
```

Reception：

```text
何が嫌なのか、ご自身でもまだはっきり分からなかったのですね。
```

### self_suffix_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分自身でもまだはっきり分からなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「何が嫌なのか、自分自身でもまだはっきり分からなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が嫌なのか、ご自身でもまだはっきり分からなかったのですね。
```

### ore_single

入力：

```text
どこが不安なのか、俺にはよくわからなかった。
```

Observation：

```text
その時の認識として、「どこが不安なのか、俺にはよくわからなかった」とあります。
```

Reception：

```text
どこが不安なのか、あなたにはよくわからなかったのですね。
```

### ore_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。どこが不安なのか、俺にはよくわからなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「どこが不安なのか、俺にはよくわからなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。どこが不安なのか、あなたにはよくわからなかったのですね。
```

### watashi_kana_single

入力：

```text
何がつらいのかわたしにもわからなかった。
```

Observation：

```text
その時の認識として、「何がつらいのかわたしにもわからなかった」とあります。
```

Reception：

```text
何がつらいのかあなたにもわからなかったのですね。
```

### watashi_kana_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何がつらいのかわたしにもわからなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「何がつらいのかわたしにもわからなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何がつらいのかあなたにもわからなかったのですね。
```

### boku_kana_single

入力：

```text
どれが嫌なのか、ぼくにもはっきり分からなかった。
```

Observation：

```text
その時の認識として、「どれが嫌なのか、ぼくにもはっきり分からなかった」とあります。
```

Reception：

```text
どれが嫌なのか、あなたにもはっきり分からなかったのですね。
```

### boku_kana_pair

入力：

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。どれが嫌なのか、ぼくにもはっきり分からなかった。
```

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
その時の認識として、「どれが嫌なのか、ぼくにもはっきり分からなかった」とあります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。どれが嫌なのか、あなたにもはっきり分からなかったのですね。
```

## 残件とbody-free terminal Receipt

当該限定修復は終了。丁寧過去・時間句・先頭／暗黙SELF・他者の既存誤読、一般入力での独立不明保持、「どうしたいのか」、E04の深さ／E05の問い／E06〜E09は未完。次は10/20方式判断に向け、今回の実本文と未対応入力を材料に初回一体単位の残りを判断する。次の意味資格拡張に本承認を流用しない。

- necessity：DIRECT_PRODUCT_OR_ACCEPTANCE_WORK
- primary outcome：TECHNICAL_CREDIT
- product：PRODUCT_NOT_CLEAR、初回一体単位未完了、正式0/3
- candidate_ready=false、automatic_progression=false
- structure：STRUCTURE_MAP_DELTA_NONE、新production file0、既存production9、論理contract79
- authority terminal：Mash承認の本人過去不明単独／既存pair末尾の認識・受容・旧互換・保存を終了
- zero effects：本番DB、実機、merge、deploy、外部AI、公開wire変更、新費用
- schedule：10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％不変
- GitHub：API `d28e7bc079c3a8bceb30f94d539f416625a12e39`（fresh取得でparent／tree／17fileのbyte一致を確認）。Cocolonは本監査を含む既存Draft PR #30差分。PR #3／#30をDraft/open/unmergedで維持し、merge／deployなし。
