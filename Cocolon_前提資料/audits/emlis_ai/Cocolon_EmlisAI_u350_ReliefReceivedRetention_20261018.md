# u350 — 安堵・寂しさと別経験を、初回から一更新・保存再表示まで受け取る

記録日：2026-10-18 JST。Mashは本会話で、u349の「既存の安堵・寂しさ＋別経験に限定し、不明の有無の両方で、初回・追加回答・訂正／撤回・旧保存互換・再表示まで一体で実装。撤回後は残る事実だけを受け取り、感情を補わない」という案に「進めていいよ」と承認した。作業規則18 §11.3 LEVEL_3の個別承認として扱い、同じ範囲を再確認要求せず実装した。

開始GitHub先端はmashos-api `9ae2079769a1ee7c1d524fcc9569c8fa172ccbc8`（tree `e4794f3c36fc7bcf14b443f14fe9ca702b99af8f`、Draft PR3）、Cocolon `c8fd9692d9b2832dfd71465b555d26eedb6679dc`（tree `1757eb5af537a08fc36905d828054140a17eccc7`、Draft PR30）。local materialized copyは同treeを照合し、local convenience commitをGitHub親に使わない。

全体設計01、全file地図01A/B/C、三中核入口、Emlis／CMEE current map、作業規則とRule18、最新weekly20261017、正本06・API handoffを確認した同じ作業の継続である。恒久商品無視incidentとu349判断案は今回も全文を読み直した。全repositoryの全file本文を改めて精読したという意味ではない。System Contextは既存判断どおり任意補助とし原典を直接確認した。ChatGPT Work内の分担による実装・source診断・旧比較原本作成・SQL/UI・構造記録・read-only相互確認を利用した。別model Pro／Ultraの正式二重評価や正式Product Readとは扱わない。

## 商品に届く変更

対象は完全原文で証明された本人の安堵・不確かな予想と現在の寂しさのpair、その後の既存received一経験、任意の末尾current SELF wh不明一つ。元の構文・語彙・問い・回答受理を広げず、不明なし／ありの二形を同じ作業単位で保持する。

| 操作 | 有効な応答対象 | 責務数 | 別経験として受け取るもの |
|---|---:|---:|---|
| 初回 | 4／5 | 2／3 | 出来事＋元の反応 |
| 既受理ADD一回 | 5／6 | 2／3 | 出来事＋元の反応＋追加回答の固有時点と感情 |
| 既受理反応REVISE一回 | 4／5 | 2／3 | 出来事＋実際のABOUTに結ばれた訂正後反応 |
| event WITHDRAW一回 | 3／4 | 2／3 | 出来事を復活させず、残る反応 |
| reaction WITHDRAW一回 | 3／4 | 2／3 | 感情を補わず、残る出来事の事実 |

各数字は独立不明なし／ありの順。pairと不明の未変更責務を維持し、一般move上限3・最大3文を緩めない。pair／unknown自身の訂正・撤回で元の完全資格は失効する。意味非更新は既存の保存本文再使用へ接続し、解決済みに見せない。未解釈・複数回答・追加経験・順序自由化・第三者／過去／複数／前置不明・新しい問いや回答文法・本人の原因や願望の補完へは拡張しない。

u349まで、初回は別経験がObservationと問いにあるのにReceptionから落ちていた。ADDは元の「嬉しくなかった」を落とし、reaction撤回では独立不明も落ちていた。今回、この三つの欠落を同じ完全sourceと更新に結び直す。

以下の本文は合成診断入力を実生成した未加工Receptionである。原文pairは「友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。」、別経験は「褒められたのに、嬉しくなかった。」、不明は「何が不安なのか、私にもまだわからない。」。privateな実ユーザー記録ではない。

### 初回、不明あり

> 褒められたことは、あなたにとって嬉しさを伴わない経験だったのですね。ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。

既存のrole順に従い、receivedのattention、pairのfelt_response、独立不明の順に表れる。u349説明案の語順を固定の本文テンプレートにしたものではない。Observationはpairと別経験を別行に保つ。現在不明も独立行で保持する。既存の問いは「『褒められた』は、あなたにはどんな意味として届きましたか。」で、明示された経験を受け取ったことだけで個人的意味の問いを解決したとはしない。

### ADD「今は嬉しい。」後の別経験部分

> 褒められたのに、嬉しくなかったし、回答した時点では嬉しいのですね。

元反応と回答時点を両方保持する。「変わった」「褒められたから嬉しい」等の変化・原因は推定しない。同じ本文にはpairと任意不明も残る。当時の回答は当時へ結び、現在回答へ読み替えない。

### 訂正・撤回後の別経験部分

| 操作 | 未加工の別経験Reception |
|---|---|
| 反応REVISE | 褒められた時は、悲しかったのですね。 |
| event WITHDRAW | その時は嬉しくなかったのですね。 |
| reaction WITHDRAW | 褒められたことはあったのですね。 |

撤回された元反応を「嬉しさを伴わない経験」として復活させない。残る出来事から感情・評価・個人的意味を作らない。本文の自然さ・深い理解・一般入力・商品全体の完成をこの限定保持だけで保証しない。

## 構造と互換

`STRUCTURE_MAP_DELTA_PRESENT`。新production fileは0、既存10owner内の有限拡張。private logical83→87で、完全sourceの初回／一更新資格とpair／received局所contentの4型を新設する。schema1.0の別familyとして、旧V1/V2のexact対象数・seal・意味条件を緩めない。HR carrierも新型で両局所内容を同じ全体選択に結ぶ。全fieldと版の正本は05、意味判断と実ownerの対応は8/28意味設計・01/01A・Emlis/CMEE current mapへ同期する。

全体はLIMITED・一claim、局所はpair・received・任意unknownの互いに重ならない寄与へ分割する。初回receivedは既存2端点appraisalを保ち、ADDは元経験2端点と回答の固有時点・実ABOUTを新contentに保持する。3端点を旧2 basisのcontentへ偽装しない。REVISEは既存更新ownerのABOUTだけを使い、片側撤回は有効な一端点だけとする。

source readerは元envelope、受理済み一回答、全span、主体・時点・肯否・関係、checkpointとcontrol、全plan、全aggregate、両局所内容を含む全selectedを再導出して照合する。本文readerは作者を呼ばずに欠落・時点／肯否変更・原因化・撤回素材復活を拒否する。新資格で作者が責務を実現できない場合、汎用表現に落として受理しない。

新source witness `source_relief_received_retention:v1` をcheckpoint identityへ含め、旧u348復元はsource専用legacy modeで新選択を付けずに再構築する。旧mixed unknownを止める汎用legacy fieldは追加しない。旧完成DTOは非再生成で返す。旧意味checkpointから未完成本文を再開する検査と、旧完成本文をそのまま返す検査を分ける。u348以前の既存legacy復元も維持する。

新局所contentが二つあることで同じ全selected再導出を一検証内で二度行っていた重複を除いた。一回目が全selected一致を検査し、後続行も基本検査と局所内容検査を継続する。pair readerはreceived専用contentを非該当として早期に返す。呼出間共有・global cache・source改変の見逃しは導入していない。

公開wire／API／DTO／DB／RN／Safety／外部AI／依存／費用は変更しない。一般上限・他core・新method family・配置にも変更はない。

## 検証結果

最終対象集合は **443 passed／0 failed／skip 0**（新core268＋source51＋実service/SQL36＋u347旧checkpoint84＋現行manifest／owner identity4、重複除外）。全suite成功ではない。初回30入力×Q1/Q3では16入力×2で両経験と任意不明を保持し、資格外14入力×2は旧全recordを維持。既存一回答28構成×Q1/Q3のうち対象16構成×2は有効素材と各時点を保持し、対照は新資格失効・非更新・既存停止を確認した。旧u349の116 recordとu347の84 record、計200旧結果を意味・選択・本文／停止まで完全比較した。現行unknown自身変更では本文等は旧一致、新checkpointに由来する4つのidentity/trace fieldだけを区別した。

実service＋隔離PGliteの36ケースと同じ36保存DTOを現行API client→hook→Modalへ通し、各2回のclose/reopenで本文・問い・状態・元記録・履歴・閉じた後の消去を確認した。HTTP／Auth／nativeはstub、本人実機・public server・本番DB・配置の検証ではない。並行run中の保存競合3件とtest期待不備は監査の失敗履歴へ記録し、低負荷の最終再検査で対象成功を揃えた。

比較原本はproduction変更前の独立worktree（開始remoteと同tree）から別Python processで採取した。新実装由来の期待値を旧互換の原本にしていない。fixtureは初回30構成と一更新28構成をそれぞれQ1/Q3で保存した116 recordで、checkpoint・original/active plan・selected・artifact全文・question/decision・status/body_state/理由を含む。保存fixtureのsha256は`aedb515cc3182cc46327b9d6125fde9063b28c800cfa0514446e5a898eff9487`。

本検証は対象集合の検査であり全suite成功ではない。SQLは実service＋隔離PGlite、UIは同じDTOを現行API client→hook→Modalへ通す。HTTP／Auth／nativeはstubで、本人実機・public server・本番DB・稼働配置の検証ではない。u348の313成功やu349の診断を今回の新規成功数へ転用しない。

## 実装中に見つかった差分

初回の新source群が任意emotion/category核まで含めて空になる不備を、既存text/answer核に限定して修復した。不明ありのfelt_responseとstrategyの不一致も、既存quiet_referent_firstへ接続して修復した。unknownありevent撤回では旧survivor witnessが2 moves前提のため付かず、完全な新資格から既存survivor witnessへつなぐ修復を行った。

初期source試験は未接続状態で3 pass／30 setup errors、source/witness接続後もunknownのrole/strategy不一致が残る段階では18 pass／15 setup errorsだった。quiet_referent_first修復後はsource有限33件が通過した。これらを成功へ数えず、修復後の対象を再実行する。本文8構成のsmokeと、不明あり5構成の作者禁止による不明削除拒否を確認した。性能上の重複再導出を整理するため途中core run（3例進行・失敗なし）を中断し、最適化後の直列runも独立shardへ切り替えた。その途中分は完了件数へ数えず、最終対象の重複を除く。

read-only相互確認では、別の既存received表現2件のUNAVAILABLEを診断したが、旧版でも新完全資格でも対象外だった。これを新実装の受理範囲へ拡張していない。本人明示の既存praise変種は完全資格と本文成立を確認した。これは探索診断であり有限fixtureの合格件数へ加算しない。

現行unknown自身のWITHDRAW／REVISE各2経路で、初期testは新checkpointからのartifact metadataまで旧版へ一致させたため4件失敗した。実際の差は`artifact_id`・`meaning_checkpoint_ref`・`meaning_trace`・`reception_trace`の4fieldだけで、Observation・Reception・問い／decision・disposition・status／body_state／理由は一致した。現行失効例はこの4field以外の全一致と新checkpoint整合、旧unknown核不在、新marker無し、duties空を検査するよう訂正し、4件再実行が通過した。旧checkpoint116の全metadata一致検査は緩めていない。

SQL初回runは31 pass／5 fail。REVISE二件はtestが「その時」だけを要求した期待不備であり、実際の「褒められた時は、悲しかったのですね。」も元出来事時点への明示対応として検査するよう修正した。残る三件（unknownありの当時肯定ADD／当時否定ADD／意味保存後ADD再試行）は、作者成功後の最終SQL commitで`thread_conflict`だった。既存storeは複数SQLSTATEを同名へ写すため、r1のlogだけで期限超過を厳密に断定できない。各々独立threadで他writeなし、30秒attempt期限と並行高負荷の条件から期限超過に整合するが、これは推定である。期限延長・時計変更・productionのSQL／service変更はしていない。

失敗5件と最適化後の代表3件を同じ低負荷processで再実行し、8 passed／0 failed（194.01秒）。先行の当時肯定unknown単体も成功したが、重複数へ加算しない。元31成功との重複を除いた36対象が最終成功となった。同じ36保存DTOをUIへ通し、全36件でclose/reopen各2回を確認した。

最終再試験で実SQLの同attemptのRUNNING→OBSERVATION時刻を採取した代表観測では、初回5.451〜8.024秒、更新10.169〜22.833秒だった。最大観測22.833秒の30秒期限までの残余は7.167秒。これはこの環境の今回の観測であり、高負荷・実機・本番の性能保証ではない。競合3件の原因を断定したことや負荷耐性を確認したことにはせず、運用前に確認すべき残件として保持する。

## 全変更fileの地図

今回の変更は mashos-api 19file、Cocolon 10file、計29file。

| repository | path | 責務 |
|---|---|---|
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 承認・実装・構造・実測・次作業の同期記録 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 新4型・全field・局所内容・全責務分割・seal |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 既受理一更新の全有効対象、survivor、旧版復元 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 新source witnessとu348専用source再構築 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 新content生成とprivate logical87登録 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | 非更新の保存本文再使用 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 全source資格・両局所content・全selected再導出 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 新carrier・既存作者・経験と残存事実の本文 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 作者非依存の新責務本文読解 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 完全原文・初回選択・更新後責務・role |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | Observation行とpair短文参照の同時保持 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 現行shared owner identity（歴史fixture不変） |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u349_relief_received_v1.json` | 独立u349原本116 record |
| mashos-api | `ai/tests/test_cmee_emlis_mixed_unknown.py` | 現行manifest件数同期（旧期待不変） |
| mashos-api | `ai/tests/test_cmee_emlis_relief_cognition.py` | 現行manifest件数同期（旧期待不変） |
| mashos-api | `ai/tests/test_cmee_emlis_relief_received.py` | 初回／一更新・旧全結果・作者禁止の本文逆検査 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_received_delivery.py` | 実service／SQL・旧保存・中断再開・同一DTO |
| mashos-api | `ai/tests/test_cmee_emlis_relief_received_source.py` | source／局所content／3端点再seal改変拒否 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_unknown.py` | 現行manifest件数同期（旧期待不変） |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u350_ReliefReceivedRetention_20261018.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/current_structure/04_cmee_current_structure.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/designs/cmee/Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/05_json_schema_and_versioning.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 承認・実装・構造・実測・次作業の同期記録 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 承認・実装・構造・実測・次作業の同期記録 |

01B/CとPiece/Analysisの責務変更はない。新fixtureと3test fileを含む全pathをこの表に記録し、既存ownerの責務変更は全体設計・01A・current mapにも反映する。歴史fixtureと旧意味契約の期待値は変更せず、現行owner identityと現行manifest件数の検査のみ同期する。

## 残件と次の作業

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。この限定同時保持の成立と、初回一体単位全体・EmlisAI商品の完成を区別する。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。

定型性・深い理解、一般入力・任意多段、過去不明混在の既存時点誤読、pairの否定訂正、E04〜E09と本人実機は未完。新資格外のunknown自身REVISEでは、旧u349と同じ「これまで、その時に今は嬉しいという気持ちを受け止めています。」が残る。原unknownを現時点の肯定感情へ直す回答を既存ownerが当時として扱う問題であり、今回解決済みとはしない。unknown自身WITHDRAW後も既存の長いpair-only Receptionへ戻る。今回承認された「元pair／unknown自身を変えると新資格を失効し、既存更新・残存へ従う」という境界を保った結果であり、この二例へ新同時保持を再適用していない。次は最新weeklyのE04〜E09に戻り、原文・実問い・未加工本文の具体差から、今回の保持修復後も残る初回の理解と問いの不足を診断する。新たな意味契約を変える必要がある場合は差分と一体の実装単位を具体化する。今回承認済みの範囲を再び未承認に戻さない。

10/20方式判断・10/31管理線・12/18公開目標、Piece/Analysis主枠と53.25％は再評価していない。既存Draft PR3／PR30へ同じwrite unitで反映し、親commit・tree・全path・全blob本文・PR先端と本文を読戻し確認する。merge／deployは行わない。
