# u345 — 別経験への回答後の原文反復を、完全な観測の区切りで修復

開始原本：mashos-api `fc3bc92841b44950ba7cf73b905fbef024a30559`、Cocolon `35b3da1abaa5e9033eae29fa7c4f9639dd3de41a`。既存Draft PR3／PR30を継続。合成入力のみ。

## 着手根拠と今回の作業単位

Mashの「EmlisAIの残件作業を進めて」と添付の前回作業内容を受け、全体設計01・全file地図01A/B/C、current入口／EmlisAI、最新weekly20261017、進捗正本06、API handoff、CURRENT_RULES／Rule18 §11.3と恒久ProductNeglect incident、華恋の必読記録を確認した。開始時tracked pathはCocolon1732／API2412。全ファイルの内容を逐一読んだという意味ではない。

System Contextの`prepare --workspace cmee_working --task cmee`は、設定された `Cocolon/.cocolon-context-workspace/mashos-api` がなく `repository unavailable` で停止した。生成済みcontextを最新原本とみなさず、入口が認める直接原本読取へ切り替え、GitHubの現行HEADと実checkoutを照合して必要資料・コードを読んだ。設定や権限を変更して回避したものではない。

u344は二反応を更新後にも届けたが、別経験と同じ物理行に連結したObservationではu336の完全一行照応証明が成立せず、Receptionに原文を繰り返していた。u336は完全な実Observationと短いReceptionの共同保持を承認済み、u331/u332は別経験の回答・訂正・撤回を通した有効pair保持を承認済みである。今回の目的は、両経験を欠落させず、既存の行構成でこの保持を実際に成立させること。readerの完全一行要件を部分文字列へ緩める変更や、新しいAFFECT／STANCEの選択ではない。

Rule18 LEVEL_2の既存設計内修復。実行環境はCodex Work。同Workの補助は読取診断・差分レビューだけを担当し、rootが実装・検証・実本文・GitHub反映を担当する。正式な別model Pro／Ultra共同審査や正式Product Readに数えない。

## 原因と実装

更新後のpair moveは既にanaphoric_firstで、source／意味／selectedも両反応を保持していた。既存 `_merge_parallel_contrast_groups` が独立した二経験を同じgroupへまとめるため、完全pairの行が存在しなかった。単純に分けるだけでは、別経験にも同じ `semantic_arc:coexisting_contrast` が付く場合、同じ経験を断片化したと誤って判定される。

既存 `emlis_ai_grounded_sentence_surface.py` の行構成に、source contractがthread、回答envelopeがちょうど1つ、未解決回答なし、必須moveが2つ、source証明済みの完全pairが1つ、両核に既存照応資格、pair全体を持つ必須anaphoric moveが1つ、別moveが回答核または既存の別event撤回後の感情である条件を置いた。pairと外部を横断するrequired関係があれば分割しない。full段階だけで、既存の行数上限内に収まる場合に完全pairと残りを原文順で分ける。

この有限条件では、既に他の独立経験で使われている `semantic_arc:source_component:` をrequired関係の連結成分から付ける。各経験は一つの成分のままで、同じ成分の一部分だけを別行へ割れば従来の `required_arc_fragmented_without_reason` を拒否する。新しい正当化タグを足して検査を通してはいない。

既存Observation author、Human Reception author、actual-body readerをそのまま使う。特にreaderの全文一行照合、一意な照応先、他行に安堵／寂しさがある場合の全文参照、確実性・本人・程度・時点の保持は不変。別経験のReaction尾部も修正前と同一である。追加回答が元の感情を訂正したと勝手に読み替えない。

## 検証

対象集合の最終結果は重複除外323 passed／0 failed／skip 0（新規108、既存関連215）。全suite成功を意味しない。

| 集合 | 最終結果 | 確認範囲 |
|---|---|---|
| 新規の原本比較・独立読解・旧保存準備 | 101 passed | 初回／1回答84比較（実問いなし1件を含む）、本文改変13、同一成分分割拒否1、旧owner挙動と原本一致3 |
| 新旧の保存／更新関連 | 28 passed | 新規SQL7、既存更新SQL9、既存表記の訂正撤回5＋SQL7 |
| u344保持の回帰 | 193 passed | 初回、現行1更新、旧u343全復元、本文／保持証明改変 |
| current owner identity | 1 passed | 現在のowner proofのみ同期、歴史proof維持 |

開始原本で21入力を凍結し、21×Q1/Q3×初回／回答後の83生成結果と、Q3の実問いなし1件を記録。10入力×2経路の回答後で短縮し、意味checkpoint／source prefix／全plan／全selected／問い／decision／理由／statusを一致させた。短縮例の全artifactは、Observation・Reception・本文由来artifact ID以外が原本と同じ。初回42結果は全artifactまで不変。曖昧例の2更新は行を区切ってもReceptionを全文のまま保持する。残る19更新結果も全artifact不変である。

「かもしれなかった」はQ1の更新も本文未提供、Q3は初回から実問いなし。最初の新testではこれを短縮成功集合へ誤って含めたため、Q1更新の1件が失敗した。開始原本を再確認して新testの分類だけを直し、修正箇所を再実行。また実問いなし理由の比較ではpytestが追記するassertion診断を原本の理由文字列へ混ぜていたため、理由の第1行だけを完全一致させるよう新testを修正し、対象1件を再実行した。製品sourceや凍結fixtureはこの失敗のために変更していない。初期3件smokeや途中実行の重複は最終件数へ加算しない。全suiteは未実行で、u344で記録された既存explicit_selfの旧停止期待1失敗を解消したとも主張しない。

Python3.12／pytest8.4.1／既存Pydantic2.14／隔離PGliteを使用。通常のpytestでは周辺conftestが未導入fastapiを参照するため、今回も既存の `--noconftest` 方式で対象集合を実行した。新依存は導入していない。独立body reader検査では作者呼出を禁止し、片側欠落、別経験欠落、可能性→確定、程度・本人・時点・対比の変造、重複・同じ行への再結合、反応／傾聴の欠落、別回答の時点／内容変更を拒否する。

## 保存互換と画面

新規7件は、ADD／REVISE／別event WITHDRAWの現行完成3件、u344の完成済み長文3件、現在meaning保存後の確定中断1件。旧保存の準備は新しい行構成判断を無効にして旧ownerと同じ挙動で生成し、独立に凍結した無変更u344の全artifactと3件一致する。架空の本文文字列をDBへ差し込んだ検査ではない。

既存16件と合わせ、実service＋隔離SQL/RPCで保存23ケースを確認。元入力、1回答の数、初回／更新後の履歴、保存意味とoperationを保持し、生成禁止の新engineでGET／startの全DTOが一致した。旧u343のcheckpoint復元は旧意味と全出力／停止へ戻る。u344とu345は同じ意味checkpointなので、未完成の本文を生成する際には改善されたsurfaceを使う。一方、完成・保存したu344本文はそのまま返し、再生成して置き換えない。

同じ23DTOを現行API client→useEmlisThread→Modalへ通し、GETだけでclose/reopen各2回。現在本文／未提供表示、元入力、履歴ボタンを開いた各event、現在の問い／入力欄なし、全DTOの一致を確認した。HTTP／Auth／nativeはstub。本人実機、本番DB、lost ACK／失効attempt、配置の検証ではない。

## 判定と次の残件

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。今回の有限な行構成修復は完了。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseは維持する。意味の深さを新しく実装した成果には数えない。定型的な「小さくせずに受け止めています」、初回の長い混在Reception、任意多段は残る。

とくにextra_unknown（pair＋別経験＋本人の独立不明）は、追加回答後に別経験のReceptionだけとなる既存欠落を残す。pairの否定訂正、一般入力、E04深さ／E05問い／E06〜E09、本人実機も未完。次はextra_unknownの実問いと既受理回答を起点に、未変更の不明・二反応がどこで責務から落ちるか診断する。既承認保持の修復と、新しい主観内容や資格の追加を混同しない。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は不変。

STRUCTURE_MAP_DELTA_NONE。新production0／既存production1file。私有schema・logical81・意味選択・公開wire・DB・RN・Safety・外部AI・依存・費用の変更なし。Analysis全suiteは未実行。既存Draft/open/unmergedを保持し、merge／配置なし。

## u345変更file地図（13file）

| repository | path | 役割 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 既存の行構成owner。保持pairと独立した別経験を別行にし、既存source-component arcを使用 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout.py` | 新規。無変更u344比較、全意味・問い保持、独立本文読解、同一経験の分割拒否、旧保存準備の原本一致 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_layout_delivery.py` | 新規。現行／u344完成本文の保存、生成なし再表示、保存済み意味からの中断再試行7件 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u344_relief_layout_v1.json` | 新規。開始原本fc3bc928の21入力×Q1/Q3×初回／1回答の83結果と実問いなし1件 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現在owner identityのみ再導出。歴史fixture・scopeは保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回結果・保存境界・残件・次の再開先 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 設計全体の最新差分と監査への入口 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 今回13fileの全変更地図。01B/Cの既存担当範囲は変更なし |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 今回のスナップショット差分 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | EmlisAI現状・保持範囲・未完 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装順序・検証・進捗の正本追記 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週次への実績・残件追記 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u345_ReliefObservationLayout_20261018.md` | 新規。本監査、判断根拠・実本文・検証境界・全変更file |


## 未加工の保存本文（合成入力）

### layout-True-add

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。

Emlisから：
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### layout-False-add

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### layout-False-revise

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」ことについて、その時の受け止めは「悲しかった」と書かれています。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、その時の悲しさを小さくせずに受け止めています。
```

### layout-False-withdraw

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
最初の記録からは、当時の「嬉しくなかった」という気持ちが読み取れます。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。その時は嬉しくなかったのですね。
```

### update-variant-kana

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うとさびしい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、そのさびしさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### update-variant-self

```text
見えたこと：
「私は友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと少し寂しい」とあります。
「褒められた」ことについて、その時の受け止めは「悲しかった」と書かれています。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、その時の悲しさを小さくせずに受け止めています。
```

### layout-retry

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```


## 追加の未加工本文と残る対照

rootは合成20件のQ3回答後本文／未提供を直接読んだ。下記は表記・程度・曖昧照応・残件の具体例。実問いを出せない過去可能性形は、この20件の成功／失敗集計へ混ぜない。

### degree_pair

原文：友達からの誘いを断って、一人で休めたことに少しほっとした。でも、もう誘ってもらえなくなるかもしれないと思うととても寂しい。褒められたのに、嬉しくなかった。

回答：今は少し悲しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことに少しほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うととても寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「少し悲しい」とあります。

Emlisから：
ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点で少し悲しいことを小さくせずに受け止めています。
```

### relief

原文：友達からの誘いを断って、一人で休めたことに安心した。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。

回答：今は悲しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことに安心した」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「悲しい」とあります。

Emlisから：
安心したと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことについて、回答した時点で悲しいことを小さくせずに受け止めています。
```

### ambiguous

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、寂しかった。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「寂しかった」、回答した時点では「嬉しい」とあります。

Emlisから：
友達からの誘いを断って、一人で休めたことにほっとしたと聞いて、私も少し安心しましたが、もう誘ってもらえなくなるかもしれないと思うと寂しいという気持ちにも、今、耳を傾けていたいです。褒められたことについて、回答した時点では嬉しいのですね。
```

### extra_unknown

原文：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

回答：今は嬉しい。

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」のに「嬉しくなかった」、回答した時点では「嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
褒められたことについて、回答した時点では嬉しいのですね。
```
