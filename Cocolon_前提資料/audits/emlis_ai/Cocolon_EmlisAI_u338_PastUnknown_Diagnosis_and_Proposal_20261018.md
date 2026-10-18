# EmlisAI u338 — 過去の本人不明の誤読診断と限定実装案（未承認・未実装）

作業日：2026-10-18。開始原本：mashos-api `c26ece428f59a01cf8928ab19bd5416b879c7d31`、Cocolon `f09ccb9c7cb8bf343bc7035b8dbfa5efb48b0f51`。Draft PR #3／#30のfresh head・open・unmergedを確認。API開始原本を無変更worktreeへ固定した。

## 結論と現在位置

「何が嫌なのか、自分でもよくわからなかった」を現在の自己評価・感覚へ読み替え、安堵／寂しさに併記するとReceptionから過去の不明を落とす問題を再現した。sourceだけをuncertainty／pastへ直す仮想実行ではLIMITEDの能力判定で停止する。現在限定のunknown対応と、u334の現在限定の独立不明保持を、過去の本人認識へ限定拡張する設計判断が必要である。

今回は診断・具体案・記録まで。製品source、test、fixture、active contractは変更していない。primary outcome=`BLOCKER_NARROWED`、必要性=`DIRECT_PRODUCT_OR_ACCEPTANCE_WORK`。修復成功、商品合格、正式Product Readとして数えない。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=falseを維持する。

## 参照と権限の境界

本会話で読了済みの全体設計01、全file地図01A／01B／01C、全tracked path一覧、current structure、Karen必読入口・規則・恒久incidentを引き継ぎ、最新weekly20261017のu337、正本05・06、API handoff、u334保持契約、作業規則18 §11.3を再確認した。影響ownerの実sourceを直接確認した。全ファイルの全内容を今回再読したという意味ではない。

正本05の「2026-09-12 初回epistemic unknownのsource-object対応」は、唯一の本人・現在・陰性uncertain nucleusとUNFINISHEDの直接寄与に限定する。u334監査の保持契約も本人・現在の独立wh不明に限定し、過去を明示的に除外する。過去sourceを正しく認識させるだけで、過去の不明を現在用contentへ通す権限は発生しない。

原因特定や最小source設計はRule18 §11.3のLEVEL_2に当たる技術判断であり、read-onlyを理由に全体をLEVEL_1とは扱わない。本提案の過去unknown対応・内容選択・保持条件はLEVEL_3。Mashの残件継続指示により調査と具体化を進めたが、現在限定契約の変更を既承認と推定しない。前回u337記録のLEVEL_1表記を今回のsource実装修復や契約拡張の根拠にしない。

root華恋が編集・反映のsingle execution owner。同Workの二担当はread-onlyの原因調査／範囲監査であり、正式な別modelのPro／Ultra共同審査や二重承認の成立には数えない。以下は主担当がsourceと結果を照合した候補である。

今回の書込範囲は本監査、既存weekly、正本06末尾の結果記録、API handoff末尾のみ。原典05、規則、Gate／承認状態、受入母数、current navigation、製品構造を変更しない。外部反映は既存Draft branchへの加算commitとPR説明の更新に限定する。

## 実測24入力

既存 `test_cmee_emlis_source_scope_regressions.request`（Q3_FREE）を使い、12原文を単独、および以下の安堵／寂しさpairの直後に置いた計24入力で、prepare → plan → project／公開generateを実行した。合成入力のみ。本文18、UNAVAILABLE6。これは診断の出力数であり、成功18／失敗6という品質判定やtest pass数ではない。主担当が24件の実Observation／Receptionを確認した。

```text
友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
```

| 原文 | 単独 | pair併記 | 主な確認点 |
|---|---|---|---|
| 何が嫌なのか、自分でもよくわからなかった。 | 本文 | 本文 | self_evaluation／feeling／current_input、Receptionから不明が消える |
| 何が不安なのか、私にもまだわからなかった。 | 未提供 | 未提供 | reaction／feeling／current_inputのまま、unknown能力不足で停止 |
| 何が不安なのか、僕にもまだ分からなかった。 | 未提供 | 未提供 | 同上 |
| 何が嫌なのか、自分でもよくわからない。 | 本文 | 本文 | 現在対照。uncertainty／uncertain、具体的な不明の受容あり |
| 何が不安なのか、私にもまだわからない。 | 本文 | 本文 | 現在対照。独立不明を保持 |
| 何が嫌なのか、自分でもよくわかりませんでした。 | 本文 | 本文 | 丁寧過去も自己評価／現在へ誤読。今回の最小資格には含めない |
| 当時は何が嫌なのか、自分でもよくわからなかった。 | 本文 | 本文 | 明示時間があっても現在へ誤読。時間句資格は別途残件 |
| 私は何が嫌なのかわからなかった。 | 本文 | 本文 | state／fact／current_input。先頭SELFは今回の最小資格外 |
| 何が嫌なのかわからなかった。 | 本文 | 本文 | 暗黙SELF。今回の最小資格外 |
| 友達は何が嫌なのかわからなかった。 | 本文 | 本文 | 既存の別主体誤読も確認。本人過去の資格へ入れない |
| 「何が嫌なのか、自分でもよくわからなかった」と友達は話した。 | 未提供 | 未提供 | 引用／報告対照。新しい本人資格へ入れない |
| 何が嫌なのか、自分でもよくわかった。 | 本文 | 本文 | 肯定の理解も既存誤読。新しい陰性不明資格へ入れない |

本文が出る資格外入力にも既存問題がある。不変を要求する対照は、現状を正しいと認定するものではない。

## 原因と依存する境界

| 既存owner（mashos-api / ai/services/ai_inference/ 以下） | 確認した作用 |
|---|---|
| `emlis_ai_evidence_ledger_service.py` | 「自分でも」をself_awarenessへ寄せる |
| `emlis_ai_grounded_observation_plan.py` | self_awarenessをself_evaluationへ写す。過去否定の有限語尾がuncertainty／limiting_unknown／past判定に不足。現在wh＋後置SELF修復も過去を扱わない |
| `cocolon_meaning_experience_engine/contracts.py` | `source_explicit_epistemic_unknown_object_ref`がtime_scope present/current_inputだけを受ける。unknown義務と実sourceの対応を持たないまま本文へ進めない |
| `cocolon_meaning_experience_engine/emlis_thread_projection.py` | u334のlocal保持資格が、現在の独立不明と既存pairの完全対応を要する |
| `emlis_ai_grounded_sentence_surface.py` | 誤ったframeから「今は…という感覚」「今は…と自分を見ている状態」を生成 |

既存current入力のpremeaningからtime_scope qualifierだけをpastへ差し替える依存probeでは、currentのobject bindingは成立、pastはNoneだった。このprobeは一つの関数の条件確認に限定し、整合した過去planや製品本文の生成成功として扱わない。

source-only仮想実行は `_final_stage1_typed_nuclei` の返却値だけをメモリ上で変更し、対象核のkind/predicate=uncertainty、modality=uncertain、polarity=negative、time_scope=past、uncertainty／limiting_unknown属性を設定した。単独・pairとも `LIMITED_RECEPTION_CAPABILITY_GAP_STOP`、公開generateはUNAVAILABLE。製品ファイルは変更せず、全source修復・内部契約の妥当性を検証した実装ではない。誤った現在本文を出す現状から、sourceだけ直した本文停止へ移すことを完成とはしない。

追加のメモリ実験では、同じsource-only差替えに加えて上記binding関数の現在限定guardへpastを仮に加え、import済みaliasも同一関数へ差し替えた。単独／pairともprojectionは通過し、公開結果はFINALとなった。しかし単独は現在化Observationと汎用Receptionのまま、pairは過去不明をReceptionへ残さなかった。通過だけで正しい本文になるわけではない。

| メモリ内条件 | 単独 | pair併記 |
|---|---|---|
| 無変更 | 現在へ誤読した本文 | 現在へ誤読し、不明の受容なし |
| source属性だけ修正 | 能力不足でUNAVAILABLE | 能力不足でUNAVAILABLE |
| source属性＋bindingのpast許可 | FINALだが現在化／汎用受容 | FINALだが過去不明の受容なし |

これにより、新enumやDIRECT_STATEへの写像変更が必要とはいえないことを確認した。UNFINISHED／PRESENT_UNFINISHEDはkindから選択され、時制は別qualifierで保持する。`_stage1_direct_unfinished_contribution`と既存appraisal選択にも現在時制限定はない。単独では既存UNFINISHED_OPENNESS／LEAVE_UNFINISHEDにpast qualifierを持つ選択が成立した。PRESENTというenum名だけを現在形の意味と読まない。初期のDIRECT_STATE案はこの再確認により撤回した。

## Mashへ提示する限定実装案（未採用）

目的は、「何が嫌なのか、自分でもよくわからなかった」という過去の本人の認識を、その時点のまま受け止めること。現在もわからない、現在は解決した、原因は何かという情報は推測しない。

初回memoにある、既存の現在wh文法で扱う対象＋後置の明示SELF＋程度語＋「わからなかった／分からなかった」の独立した完全有限節を対象とする。単独の一節、または既存u332安堵／認知内の寂しさpairの後ろに独立一節を置いた入力だけ。SELFの表記集合とwh対象は既存現在文法と同じに固定し、先頭SELF・暗黙SELF・丁寧否定・時間句を一緒に解禁しない。他者／引用／報告／疑問／推測の埋込み／肯定の理解／追加material／不明先行／欠けた対比は新資格に含めない。

1. 原memo全体・完全span・一意の本人を証明し、過去uncertaintyとして保持する。UNKNOWNを残し、同一evidenceの過去source-objectへ一意に対応させる。required owner・影響核／span・hedge・PRIMARY／同じEXPERIENCER・unknown basis／compatibilityの全件対応を維持する。時間qualifierの列挙追加だけで一般unknown admissionを広げない。
2. 過去の本人認識の受容に必要な内容選択を既存content体系内で限定する。具体的な候補写像は下記技術判断に固定し、現在unknownの経路を置き換えない。一般AFFECT／STANCE、原因、現在の未完・解決状態を補わない。
3. pair併記では既存二反応と過去の独立不明をそれぞれ必須対象として保持する。u334のlocal保持資格を当該完全三対象に限って拡張し、source／checkpoint／plan／resolver／選択／aggregate／basisの一致を再導出する。未知義務の除去やgeneric fallbackで通す実装はしない。
4. Observationは完全原文を保ち、現在の自己評価・感覚へ変換しない。Receptionは聞き手への人称変換以外の対象・時点・肯否・程度を保持する。独立readerが作者を呼ばず最終本文を原文へ戻して検証し、過去→現在、既知化、主体変更、程度欠落、引用化の改変を拒む。
5. 新意味資格を版で分け、旧完成は非再生成、旧checkpointは旧plan／選択／本文または旧停止へ完全復元する。新初回資格を回答sourceへ自動適用しない。今回の対象入力はENDであり、過去不明そのものへの回答・訂正・撤回機能を新設しない。既存の実在する問いを持つ対照で、訂正・撤回とlive根拠失効が従来どおりであることを確認する。対象へ別の経験や架空の問いを足さず、通常生成と保存再表示を完了させる。

### 採用候補の技術写像

source核は`uncertainty / uncertain / negative / past`、既存直接寄与`UNFINISHED / PRESENT_UNFINISHED / NO_RELATION_CLAIM`を維持する。単独の既存`UNFINISHED_OPENNESS / LEAVE_UNFINISHED`は、原文で不明だった対象の内容を勝手に解くことを禁じる責務として使い、現在も不明だという事実を加えない。past qualifierを作者・独立readerまで保持する。pairではu334の既存三対象`MATERIAL_WEIGHT / RECEIVE_AS_MATERIAL`とlocal保持契約を、この過去の完全source証明に限り拡張する。新しい主観反応や新enumは設けない。

この候補は現在用unknown bindingを単純にpastへ全開放するメモリprobeそのものではない。完全sourceと同一span／ownerを再証明した過去資格が必要である。初期仮説のDIRECT_STATEへ替える方法は、kind写像・basis role・appraisalまで変えるため採用候補から除外した。

### 提案する本文例（実生成結果ではない）

単独Observation：

```text
「何が嫌なのか、自分でもよくわからなかった」とあります。
```

単独Reception：

```text
何が嫌なのか、ご自身でもよくわからなかったのですね。
```

pair併記Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が嫌なのか、ご自身でもよくわからなかったのですね。
```

pairの原文は既存u336どおり実Observationに完全保持する。上記の「今」は既存の寂しさへのEmlisの傾聴にのみ係り、過去の不明へ移さない。これは対象・時点の修復案であって、E04の深さが完成したという主張ではない。

### 変更予定ownerと確認範囲

既存OP、contracts、thread source adapter／projection、選択、sentence surface、HumanReception、Gate、旧mode／checkpoint replayを必要範囲で変更する。新production module・新公開wire・DB migration・RN経路・外部AI・依存・費用は追加しない。具体的な変更pathと差分を実装開始前に既存owner内で固定し、別のcarrier familyやenumが必要になる場合は再分類して停止する。想定pathは次表に限定する。不要なownerは編集しない。新testとc26ece4の凍結fixtureを追加し、current identityのみ再導出する。既存assertionや歴史fixtureは弱化・上書きしない。

| mashos-apiの候補path（未編集） | 目的 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 完全な過去SELF wh source資格と版 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 証明された過去sourceへのunknown binding／保持資格 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_source.py` | 元boundary／spanと新資格の対応 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 過去独立不明を含む完全三対象の保持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 現行／歴史source modeの分離。問いの選択変更なし |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 旧checkpoint完全復元。回答の新資格は追加しない |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 過去認識のObservation |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 選択された本人の過去認識を具体的に受け取る |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 原文全体と最終本文の独立読解 |
| `ai/tests/test_cmee_emlis_past_unknown.py` | 新資格・本文改変・旧復元・保存の検証 |
| `ai/tests/fixtures/cmee_emlis_u337_past_unknown_v1.json` | c26ece4原本の凍結record |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行source identityの再導出 |

正本05には承認された場合に新しい限定条件を加算し、06・weekly・地図・API handoff・監査へ実装結果を反映する。既存stage1のkind写像／appraisal enumは変更予定に含めない。この候補path表は今回の書込許可や実装済みpathではない。

成功条件は、適格過去入力でsourceの本人／時点／認識上の不明が一致し、単独・pairとも過去の具体対象を最終本文へ残すこと。現在対照と資格外入力の結果不変、完全な旧checkpoint再現、作者禁止の本文改変拒否、Free／Plus／Premiumの実service＋隔離SQL/RPC保存、同DTOの現行client／hook／Modal再表示を確認する。本人実機・本番の検証と混同しない。技術検査数だけで商品合格にしない。

追加作業はsource→意味／内容→作者／独立reader→更新／保存を一体で検証する一単位。単なる語尾置換より実装・検証量が増える。新しい運用費・外部serviceは不要だが、所要時間はまだ実測しておらず完了日時を保証しない。10/20の方式継続判断をこの修復で延期しない。10/31管理線・12/18目標・Piece/Analysis主枠53.25％は不変。

STOP条件：本人・完全source・過去時点・unknown対応が一意に証明できない、過去を現在へ補完する、旧意味identityが変わる、必要unknownやpairを消す、専用reader失敗を汎用経路で通す、承認範囲外のsource資格／新型／carrier／外部境界へ広がる場合。未承認の段階では製品実装を開始しない。不採用なら本案をretireし、現状の過去不明問題を未解決として残す。

## この作業の実施・未実施

24入力の現行source／本文診断、依存probe、source-only仮想実行、既存契約の照合、source＋bindingのメモリ内6条件比較（無変更2を含む）、具体案の作成を実施した。製品source/test変更0、pytest suite・SQL/RPC・UI再検証0、merge／deploy0。前回u337の650 passedを今回の検証実績へ加算しない。STRUCTURE_MAP_DELTA_NONEで、既存01A／01B／01Cの製品file地図は不変。新規ファイルはこの監査だけで、既存audits/emlis_aiの作業記録に属する。

初回一体単位・一般入力・E04深さ／E05問い／E06〜E09・本人実機・正式受入れは未完了。本案の承認や実装完了が、次Gate・公開・商品合格の承認を兼ねることはない。

## 未加工本文24件

以下は開始原本の実出力。pairケースの入力は先掲pair＋表示原文。frame欄は最後のmemo核について記す。本文なしの場合は公開reasonとprojection停止を記す。

### jibun_past_single

入力：`何が嫌なのか、自分でもよくわからなかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
今は、「何が嫌なのか、自分でもよくわからなかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### jibun_past_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分でもよくわからなかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今は、「何が嫌なのか、自分でもよくわからなかった」と自分を見ている状態です。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。
```

### watashi_past_single

入力：`何が不安なのか、私にもまだわからなかった。`

最後のmemo核：`reaction / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：`LIMITED_RECEPTION_CAPABILITY_GAP_STOP`。

### watashi_past_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、私にもまだわからなかった。`

最後のmemo核：`reaction / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：`LIMITED_RECEPTION_CAPABILITY_GAP_STOP`。

### boku_past_single

入力：`何が不安なのか、僕にもまだ分からなかった。`

最後のmemo核：`reaction / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：`LIMITED_RECEPTION_CAPABILITY_GAP_STOP`。

### boku_past_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、僕にもまだ分からなかった。`

最後のmemo核：`reaction / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：`LIMITED_RECEPTION_CAPABILITY_GAP_STOP`。

### jibun_present_single

入力：`何が嫌なのか、自分でもよくわからない。`

最後のmemo核：`uncertainty / current_user / uncertain / negative / current_input`

Observation：

```text
今は、「何が嫌なのか、自分でもよくわからない」という感覚が前に出ています。
```

Reception：

```text
結論を急がずに、何が嫌なのか、ご自身でもよくわからないのだと受け止めています。
```

### jibun_present_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分でもよくわからない。`

最後のmemo核：`uncertainty / current_user / uncertain / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今回の中心には、「何が嫌なのか、自分でもよくわからない」があります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が嫌なのか、ご自身でもよくわからないのですね。
```

### watashi_present_single

入力：`何が不安なのか、私にもまだわからない。`

最後のmemo核：`uncertainty / current_user / uncertain / negative / current_input`

Observation：

```text
今は、「何が不安なのか、私にもまだわからない」という感覚が前に出ています。
```

Reception：

```text
結論を急がずに、何が不安なのか、あなたにもまだわからないのだと受け止めています。
```

### watashi_present_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が不安なのか、私にもまだわからない。`

最後のmemo核：`uncertainty / current_user / uncertain / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。
```

### polite_past_single

入力：`何が嫌なのか、自分でもよくわかりませんでした。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
今は、「何が嫌なのか、自分でもよくわかりませんでした」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### polite_past_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分でもよくわかりませんでした。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今は、「何が嫌なのか、自分でもよくわかりませんでした」と自分を見ている状態です。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。
```

### explicit_time_single

入力：`当時は何が嫌なのか、自分でもよくわからなかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
今は、「当時は何が嫌なのか、自分でもよくわからなかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### explicit_time_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。当時は何が嫌なのか、自分でもよくわからなかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今は、「当時は何が嫌なのか、自分でもよくわからなかった」と自分を見ている状態です。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。
```

### leading_self_single

入力：`私は何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
今は、「私は何が嫌なのかわからなかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### leading_self_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。私は何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。その背景には、「私は何が嫌なのかわからなかった」という状態も重なっています。
```

Reception：

```text
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### implicit_single

入力：`何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
今は、「何が嫌なのかわからなかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### implicit_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。その背景には、「何が嫌なのかわからなかった」という状態も重なっています。
```

Reception：

```text
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### other_single

入力：`友達は何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
今は、「友達は何が嫌なのかわからなかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### other_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。友達は何が嫌なのかわからなかった。`

最後のmemo核：`state / current_user / fact / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。その背景には、「友達は何が嫌なのかわからなかった」という状態も重なっています。
```

Reception：

```text
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。
```

### quote_single

入力：`「何が嫌なのか、自分でもよくわからなかった」と友達は話した。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：``。

### quote_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。「何が嫌なのか、自分でもよくわからなかった」と友達は話した。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

本文なし：`emlis_q3_initial_body_unavailable`。projection：`LIMITED_RECEPTION_CAPABILITY_GAP_STOP`。

### knowing_single

入力：`何が嫌なのか、自分でもよくわかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
今は、「何が嫌なのか、自分でもよくわかった」という感覚が前に出ています。
```

Reception：

```text
今ここに置かれた言葉を小さくせずに受け止めています。
```

### knowing_pair

入力：`友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。何が嫌なのか、自分でもよくわかった。`

最後のmemo核：`self_evaluation / current_user / feeling / negative / current_input`

Observation：

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
今は、「何が嫌なのか、自分でもよくわかった」と自分を見ている状態です。
```

Reception：

```text
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。
```

## 再現方法

開始原本で既存test requestを使い、下記の要領で各入力を実行する。24入力は上の表の各原文を単独／pair後置したもの。再現のために新しい製品helperは追加しない。

```python
from test_cmee_emlis_source_scope_regressions import request
from cocolon_meaning_experience_engine import MeaningExperienceEngine
from cocolon_meaning_experience_engine.emlis_answer_update import (
    prepare_emlis_meaning, build_updated_grounded_plan,
)
from cocolon_meaning_experience_engine.emlis_thread_projection import project_thread_meaning

req = request(memo)
p = prepare_emlis_meaning(req)
plan = build_updated_grounded_plan(p)
result = MeaningExperienceEngine().generate(req)
# result.artifact.observation / reception、またはresult.reason_codesを保存。
# project_thread_meaning(p, plan)の選択またはValueErrorの停止理由を別途確認。
```

### メモリ内依存実験の再現部分（製品への採用コードではない）

開始原本で`gp`をobservation_plan、`c`をcontracts、`im`をemlis_input_specific_meaningとしてimportする。`dataclasses.replace`、`inspect`、`unittest.mock.patch`を使用。以下の一つの完全節だけを差し替える。この実験はsource recognizerの実装ではなく、他の既存属性を保持した診断用の反実仮想である。

```python
UNKNOWN = "何が嫌なのか、自分でもよくわからなかった"
ORIGINAL_PROJECTOR = gp._final_stage1_typed_nuclei


def source_counterfactual(*args, **kwargs):
    nuclei, dependencies = ORIGINAL_PROJECTOR(*args, **kwargs)
    spans = {span.span_id: span for span in args[1]}
    changed = []
    for nucleus in nuclei:
        if (len(nucleus.source_span_ids) == 1
                and nucleus.source_span_ids[0] in spans
                and spans[nucleus.source_span_ids[0]].raw_text == UNKNOWN):
            frame = nucleus.semantic_frame
            codes = tuple(code for code in frame.attribute_codes
                          if not code.startswith("time_scope:"))
            codes = tuple(dict.fromkeys((*codes, "operator:uncertainty",
                         "semantic_role:limiting_unknown", "time_scope:past")))
            nucleus = replace(nucleus, kind="uncertainty", semantic_frame=replace(
                frame, predicate_kind="uncertainty", modality="uncertain",
                polarity="negative", time_scope="past", attribute_codes=codes))
        changed.append(nucleus)
    return tuple(changed), dependencies


def hypothetical_past_binding():
    """Only test whether existing selection needs a new operator/shape."""
    source = inspect.getsource(c.source_explicit_epistemic_unknown_object_ref)
    old = '({"time_scope:present"}, {"time_scope:current_input"})'
    new = '({"time_scope:present"}, {"time_scope:current_input"}, {"time_scope:past"})'
    if source.count(old) != 1:
        raise RuntimeError("Expected current-only binding guard has changed")
    namespace = dict(c.__dict__)
    exec(compile(source.replace(old, new), "<u338-memory-only-past-binding>", "exec"), namespace)
    return namespace["source_explicit_epistemic_unknown_object_ref"]


# source_only: patch.object(gp, "_final_stage1_typed_nuclei", source_counterfactual)
# source_plus_past_binding: 上記に加え、同じpast_bindingを以下の二箇所へpatchする。
# c.source_explicit_epistemic_unknown_object_ref
# im.source_explicit_epistemic_unknown_object_ref
# 各context内で単独／pairのprepare、plan、project、generateを実行する。
```

このguard差替えは診断専用であり、本案の完全source資格・現在対照・旧identity保持を備えていない。承認候補の実装として再利用しない。
