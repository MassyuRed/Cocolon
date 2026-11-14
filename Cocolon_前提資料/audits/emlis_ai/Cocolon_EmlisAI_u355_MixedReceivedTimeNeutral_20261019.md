# u355 — 混在入力の元の経験に同時性を加えない

2026-10-19 JST。開始記録。次の表は開始判断であり、検証完了ではない。

| 開始項目 | 固定範囲 |
| --- | --- |
| product_destination | 本人が書いた経験の時点を補わず、初回から回答後・保存表示まで保つ |
| current_gate_or_subgate | 最新weekly20261017 E05/E06/E08の同じ意味から本文・保存へ至る経路 |
| exact_work | 安堵・寂しさのpair＋received一組（任意の不明）の元経験に「同時に」を加える表示欠陥を修復 |
| scope_classification | LEVEL_2、既存設計内の本文実現の不具合修正 |
| approval_or_delegation_basis | Mashの今回のEmlisAI残件継続指示とRule18 §11.3 standing delegation |
| execution_owner | 主担当華恋が編集・実行・GitHub反映。補助担当はR9.7に従う読取レビューのみ。正式別model二重審査ではない |
| success_credit | 限定TECHNICAL_CREDIT。Product Readや商品全体の合格を自己認定しない |
| completion_condition | 完全原sourceで対象を限定し原relation・両核が残る場合だけ中立表現。意味・選択・Reception不変、改変拒否、旧保存非再生成、未完成再開、同一DTO再表示、GitHub照合 |
| stop_condition | 新しい意味・選択・資格・型・parserが必要、検査緩和、必須対象削除、新補助機構、scope拡大 |
| prohibited_scope | 説明Mを含む別sourceへの拡張、任意多段、公開API/DTO/DB/RN/Safety、依存・外部AI・実データ・merge・deploy |
| next_product_read_or_mash_decision_point | Receptionの長い反復・深さ・一般入力・方式判断は残す。機械検証から正式Product Readへ進めない |
| current_source_test_receipt | u354監査と現行thread surface／既存neutral writer-reader。既存unknown_revision_time・negative_revision・relief_received・result_appraisal検査。修正前u354から比較を採取 |
| current_docs_and_heads | API 7f9209ef1e8c0dfb56ddc72499440ac8ccb6180e／Cocolon 36102c8fb3fef94792e6750089d3eebd35d5fbc2。全体01・全file地図01A/B/C・current maps・最新weekly・作業規則・恒久incident全文を確認 |
| affected_current_structure_maps | Emlis/CMEE map、全体01・01A。既存owner内の指定対象漏れ修正でSTRUCTURE_MAP_DELTA_NONE |

必要性はOBSERVED_BLOCKER_MINIMAL_FIX。u354の実本文で観測した根拠のない同時性の原因だけを既存owner内で修復する。追加費用・Mashへの新操作負担0。実装と対象回帰を一作業枠で閉じる。新しいcheckerや受理文法は作らない。現行readerの完全旧文法との互換は維持し、新本文には中立文法を使う。

変更予定は既存production `emlis_thread_surface.py`、対象test・変更前比較fixture、current owner identityが実際に変わる場合のみ同期、既存設計地図・weekly・06/07・API引継ぎと本監査。歴史的fixtureは書き換えない。完成済み旧DTOは再生成せず、未完成checkpointは同じ意味から現行本文へ再開する。正式Product Read0/3、PRODUCT_NOT_CLEAR、candidate_ready=false、automatic_progression=falseを維持。


## 実装・検証結果
u354実本文の残件をLEVEL_2で修復。安堵・寂しさのpair＋received一組（任意の不明）の完全原sourceを既存ownerで証明し、原relation・両核が現行にも同一で残る場合だけ対象にする。初回と別対象への訂正後に、Rを「異なる向きのまま同時にあります」から、元の「のに／けど」等を保つ既存の経験文へ変更。独立readerは完全な主体・程度・肯否・時点・接続詞と一文の範囲を照合する。意味・checkpoint・全plan・selected・Reception・問い／ENDは変えず、撤回したRは復活させない。anti-template検査は維持。

対象321件の最終結果passed、未解消fail／skip0。未変更u354の60recordで全意味・選択・Reception・本文のその他fieldが一致し、Observation一文と本文由来IDだけ24recordで変わる。残り36は本文／停止も同一。旧u350未完成checkpointは旧時点解釈を保持して現行表面へ進むため、この一文だけ変わり得る。完成済み旧DTO・確定旧失敗は非再生成。実SQL14件で初回・実pendingへのADD／現在否定REVISE・旧保存・意味前後中断再開を通し、同じ18DTOを現行apiClient→API→hook→Modalで各2回close/reopenした。HTTP/Auth/nativeはstub、実端末・本番・全suiteの成功ではない。

STRUCTURE_MAP_DELTA_NONE。既存production3file内、新production／型／意味版／依存／API／DTO／DB／RN／Safety変更0、logical90を維持。正式別model評価ではなく主担当実行と補助読取レビュー。限定TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／正式0/3／candidate_ready=false／automatic_progression=false。長い原文反復、深い受容、一般入力、PARTIAL、説明Mを含む別sourceの更新、任意多段・本人実機は残る。範囲外の元reaction訂正では「その時は今は嬉しい」等の時点衝突が比較本文に残り、次の具体的な診断対象とする。次はE05/E06/E08の実本文品質と既存方式判断へ戻る。10/20方式判断・10/31管理線・12/18公開目標、Piece/Analysis主枠53.25％は再評価しない。Draft PR3／30、merge・deployなし。詳細・全変更file・本文は[u355監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u355_MixedReceivedTimeNeutral_20261019.md)。


開始時の「既存中立文へ指定を渡すだけ」の案は、初回実測で独立readerはpassedだがanti-templateの同stem反復に失敗した。検査を緩めず、Rに既存u353経験文法を再利用し、writerと独立readerの局所source証明を整合した。currentの専用保持witnessはunknown訂正で失効するため、adapterは原sourceの完全資格を確認し、writer/readerは現行のPとRを原文から確認する。専用意味資格は復活させない。R-only lineでは一文だけを完全に消費し、重複や無引用の追加説明も拒否する。新しい文法・parser・型・checkerを導入せず既存3owner内で閉じた。既存の旧complete／neutral文法を読む互換性は維持するため、旧文型の「同時に」まで全拒否したという主張ではない。新しい経験文への同時性・因果・順序の付加、原接続詞の変更、主体／程度／時点／肯否の改変を拒否する。

最初の単純中立案はsmoke8失敗、SQL12失敗・旧保存2成功。その後current witness必須の取り違えを読取レビューで修正し、意味の初回再実行等の途中runは打切った。最終全比較の2失敗は、既存PARTIAL除外のmixed_unknown_then×2まで一文が変わるとしたtest期待の誤りだった。productionのPARTIAL除外を維持し、変化対象を初回16＋既存4種類の完全訂正×2へ限定して、失敗2件だけ再実行し成功した。他94件は同じ最終productionで既に成功しており、再実行分の重複加算はしない。これらの途中失敗を最終成功件数へ合算しない。最終結果は完了summaryの対象を次のように集計した。

| 検証対象 | 最終成功件数 |
| --- | ---: |
| u354全比較60・独立読解33・主体/程度2・適用境界1 | 96（94＋期待訂正後の2） |
| unknown_revision_time／negative_revision_surfaceの既存比較 | 125 |
| relief_received初回60・旧u349代表16 | 76 |
| 単独／別対比の既存読解9・現行owner identity1 | 10 |
| 実service／隔離SQLの保存・再開 | 14 |
| 合計（同一testの再実行を重複加算しない） | 321 |

比較原本はu354 headのコードを読み込んだ独立processから60record（初回16、実pendingへのreceived追加／訂正／撤回16、unknown等の訂正28）を採取した。修正後から期待値を作り直していない。全checkpoint、original plan、accepted核、更新全plan、selectedのhashを照合し、artifactはObservationと本文ID以外の全fieldを比較。初回16＋unknown訂正8の計24でのみ、完全R一文を元接続詞の経験文へ変えた。停止2とPARTIAL2を含む残り36は同一。旧fixtureは改変せず、旧u350の全意味／旧時点はそのまま維持し、未完成の現行表面の一文差を明示した。

SQLは隔離PGlite0.5.8、Python3.12.14／pytest8.4.1／pydantic2.14.0、専用--noconftestの対象回帰。既存UIの実apiClient／API／hook／Modalへ保存DTOを通し、本文・問い・状態・元入力・履歴順序と2回再表示を確認。旧完成／確定失敗はNoGenerationでGET/startし全保存snapshot不変。意味後中断ではMEANING_UPDATEを追加・置換せず再開し、意味前中断では保存回答から意味を作る。本人端末・本番DB・外部AI・全suite検証は行っていない。

### 主担当による本文確認

以下は合成入力の実保存DTOの未加工本文。根拠のない同時性は対象Rから除去された。一方、Receptionの長い原文反復・深さの不足はそのままであり、商品合格候補とはしない。主担当の読解は正式human Product Readを代替しない。


### u355-initial-premium-True.json

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」という経験が書かれています。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
褒められたことは、あなたにとって嬉しさを伴わない経験だったのですね。ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。
```


### u355-add-premium-True.json

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」、回答した時点では「少し嬉しい」とあります。
今回の中心には、「何が不安なのか、私にもまだわからない」があります。

Emlisから：
褒められたのに、嬉しくなかったし、回答した時点では少し嬉しいのですね。ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。
```


### u354-current-premium-mixed_unknown_current_negative.json

```text
見えたこと：
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」という経験が書かれています。
回答した時点の気持ちとして、「嬉しくない」が見えます。

Emlisから：
回答した時点で嬉しくないことを小さくせずに受け止めています。友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いを受け止めています。
```


開始記録の未完了表記はこの結果節で更新する。remote最終head・全changed-pathと全blobの照合はPRおよびfresh readbackを正とする。


### u355 全変更file地図（20 path）

| repository | path | 責務 |
| --- | --- | --- |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_surface.py` | 完全原sourceと現行の原核・関係から中立表示対象を指定 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 指定済みmixed Rに原接続詞の既存経験文を再利用 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 既存経験文のsource読解と一文の完全消費、anti-templateは不変 |
| mashos-api | `ai/tests/test_cmee_emlis_mixed_received_surface.py` | u354全意味比較、原接続詞・主体・程度・時点・余剰文の独立読解 |
| mashos-api | `ai/tests/test_cmee_emlis_mixed_received_delivery.py` | 初回／ADD保存と旧完成DTO非再生成 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_revision_time.py` | 旧全artifact比較で意図した一文と本文IDだけを分離 |
| mashos-api | `ai/tests/test_cmee_emlis_negative_revision_surface.py` | u353全比較の初回／更新の限定表面差へ追従 |
| mashos-api | `ai/tests/test_cmee_emlis_negative_revision_delivery.py` | 現在否定と中断再開の新経験文を確認 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_received.py` | 自然変種の原接続詞を保つ初回期待を確認 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u354_mixed_received_surface_v1.json` | 変更前u354の60record比較原本 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行ownerのidentity同期、歴史的proofは維持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回の限定修復・境界・次の本文品質残件 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 全体設計の最新参照。構造差分なし |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 全変更fileの地図と責務 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | Emlis現行routeの限定修復 |
| Cocolon | `Cocolon_前提資料/current_structure/04_cmee_current_structure.md` | 意味・selected不変、logical90の継承 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 意味・旧保存・未完成再開の検証境界 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | E05/E06/E08の限定更新と残件 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | milestone差分 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u355_MixedReceivedTimeNeutral_20261019.md` | 開始根拠・実本文・全差分・残件 |
