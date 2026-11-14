# u349 — 別経験を初回から一更新・保存まで受け取る限定変更案

記録日：2026-10-18 JST。状態は **診断・具体案、意味契約変更は未承認・未実装**。最新の「EmlisAIの残件作業を進めて」に基づき、u348後に残る初回received経験のReception欠落を確認した。今回の実行は既存sourceの読取り・実生成診断と記録だけで、production／test／fixture変更は0。

開始GitHub先端：mashos-api `321dff8d28204087cd9274f225ffb3f3fd967987`（Draft PR3）、Cocolon `fc00a81347acd33bf0632e5b46340673c6ca19f3`（Draft PR30）。localは同じtreeのmaterialized copyで確認し、local convenience commitをremote親に使用しない。全体設計01、全file地図01A/B/C、三中核入口とEmlis／CMEE current map、作業規則とRule18、恒久商品無視incident全文、最新weekly20261017のE04〜E09・u331作業単位合意・u348、u347承認案、正本06とAPI handoff、関係sourceを確認した同じ作業を継続した。全repoの全本文を今回再精読したという意味ではない。System Contextは既存判断どおり任意補助とし、原典を直接確認した。

ChatGPT Work内のread-only補助による承認範囲確認とsource診断を利用し、主担当が原典と照合・統合・GitHub反映を担う。別model Pro／Ultraによる正式な二重評価、正式Product Readは実施したと扱わない。

## 実際に残っている欠落

共通原文のpair：

> 友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。

別経験は「褒められたのに、嬉しくなかった。」、任意の末尾不明は「何が不安なのか、私にもまだわからない。」である。いずれも既存の合成診断入力であり、privateな実ユーザー記録ではない。

現行u348を実生成した3構成のReception：

| 入力 | 選択された応答対象／責務 | 未加工のReception |
|---|---|---|
| 別経験だけ | NORMAL、2対象／1 move | 褒められたことは、嬉しさにはつながらなかったのですね。 |
| pair＋別経験 | LIMITED、2対象／1 move | ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。 |
| pair＋別経験＋現在の不明 | LIMITED、3対象／2 moves | ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。 |

実際の問いは全3例で次のとおり。別経験はObservationと問いにはあるが、pairが混ざると初回Receptionには選ばれない。u348で直した現在不明の受け取りは維持されている。

> 「褒められた」は、あなたにはどんな意味として届きましたか。

u348で生成・保存した同じ混在入力へのADD「今は嬉しい。」では、別経験部分のReceptionは「褒められたことについて、回答した時点では嬉しいのですね。」である。元の「嬉しくなかった」はObservationにあり、Receptionにはない。新しく初回received責務を選ぶだけでは、ADD時にその責務がまた欠ける。

同じu348実出力の反応撤回「『嬉しくなかった』は誤りです。」では、Observationに残る出来事と現在不明が、Receptionでは両方落ちてpairだけになる。u348の限定更新資格はevent WITHDRAWを対象とし、reaction WITHDRAWは対象外だった。新案ではこの片側撤回も、同じ経験の保持・失効として一緒に扱う。

これらは製品改善後の比較ではなく、変更前の不足を特定する診断である。今回pytest／SQL／UI検証を追加実行しておらず、u348の313成功や18保存・UI例をu349の新規合格数へ加算しない。

## なぜ既承認内の短い修正ではないか

u347提案の検証条件は「初回の別経験Receptionは未選択のままであり追加しない」。その承認を実装したu348監査・weekly・意味設計にも「別received経験自体の初回Receptionは追加しない」とある。今回の一般的な残件継続指示を、その明示境界を変更する個別承認へ読み替えない。

現行の選択と契約もこの境界を実装している。

| 現行owner | 実際の境界 | 必要な変更 |
|---|---|---|
| `emlis_ai_grounded_observation_plan.py::_select_reception_opportunities` | pairのlived_changeから別current_burdenを通常のsupportとして選ばない | 完全sourceが証明されたこの2経験だけに、別経験の両端責務を選ぶ |
| 同final sourceの`retained_reaction_groups` | mixed unknownの場合はpair＋unknownを明示列挙 | receivedを加えても独立unknownを落とさない選択・roleを明示する |
| 同`_build_reception_depth_policy_and_moves` | current_burdenが二つになると、supportなしのunknownをattentionにする既存規則が働く | この資格だけreceivedとunknownの役割を区別し、unknownの既存felt_responseを保持する |
| `emlis_answer_update.py::_retained_unchanged_relief_cognition_duties` | 既受理ADD／REVISE後はpair＋回答（＋unknown）。元経験はObservationのみ | ADDでは元経験＋回答の各時点を同一経験内で保持、REVISE／WITHDRAWでは有効な残存だけを選ぶ |
| `contracts.py`／`emlis_thread_projection.py` | 初回Relief V1はexact3対象、更新V1/V2はexact3/4対象。Received V1も特定の既存appraisal更新専用 | 初回4/5対象と一更新の有効対象を証明する限定private版を分離。旧条件を緩めない |
| `emlis_stage1_composition.py`／source replay | 旧型dispatchとreliefだけをcarryした全selectedの一致 | 同じ全source証明からpairとreceivedの局所内容を構築し、全aggregate・全selectedを再導出して検査 |
| `emlis_ai_grounded_sentence_surface.py`／Human Reception／独立gate | 既存初回のmove数、role、finite discourseを前提 | 新資格の2/3責務をObservationとの照応・作者・独立読解へ一貫して接続 |

既存のreceived内容そのものを別商品へ変える案ではないが、これまで選んでいなかった経験を選び、更新後にも保持する意味契約の変更である。Rule18 §11.3 LEVEL_3、特に既に説明した限定scopeの拡張に当たるため、実装前のMash判断が必要。

## 推奨する一つの実装単位

対象は既存本人の安堵・不確かな予想と現在の寂しさのpair、その後の独立した既存received一経験、任意の末尾current SELF wh不明一つ。原文順序・全span・主体・時点・肯否・関係・独立性が証明された構成だけを扱う。不明なし／ありを同じ原因の二形としてまとめる。

| 時点／操作 | 一体で成立させる内容 |
|---|---|
| 初回、不明なし | pairの既存二反応＋receivedの出来事と反応。4対象／2責務 |
| 初回、不明あり | 上記に独立現在不明を加える。5対象／3責務。「自分でも」の既承認変種も保持 |
| 実在する問いへの既受理ADD一回 | 元の出来事・当時の反応を消さず、追加回答の感情をその回答時点／元出来事時点に結ぶ。pairと任意の不明も保持 |
| 既受理の反応REVISE一回 | 訂正された旧反応と依存関係を失効し、出来事と訂正後反応を受け取る。未変更のpair・不明を保持 |
| 出来事または反応のWITHDRAW一回 | 撤回対象とその依存だけを外す。残る反応／出来事・pair・不明を保持し、撤回した反応・出来事を復活させない |
| pair／unknown自身の訂正・撤回 | 元の完全資格は失効。既存受理範囲の更新・残存に従い、変更済みの元pair／不明を新資格で再導入しない |
| 不明回答・無変更・未解釈 | 現行の意味更新／非更新の区別を守る。非更新は保存本文を再使用し、解決したことにしない |
| 旧保存・中断・再表示 | u348とそれ以前の既存復元経路を旧版の意味・選択・停止へ戻す。完成済み本文を再生成せず、GET/start・再送・意味保存前後の中断再試行・画面close/reopenまで同一候補で確認 |

ADDの肯定回答「今は嬉しい」も本案の範囲である。現行は肯定回答を別lived_changeへ分ける。既存receivedの3端点source資格は否定回答に限定されているため、肯定回答まで既存文法を無変更で流用できるとは言わない。**この有限sourceと既受理一回答に限り、出来事・元反応・回答を一つの経験としてsource／IR／作者／独立readerへ結び直す限定変更も、今回の承認対象に含める。** 受理できる回答構文・語彙・質問数を増やす変更ではない。

推奨は一経験を2端点／3端点として扱い、pair＋経験＋任意unknownの最大3責務を維持すること。肯定ADDを単に4番目のmoveへ足して一般上限を緩める案は採らない。初回はexact4/5、ADDは有効な5/6対象、REVISEは有効な4/5対象、片側撤回は有効な3/4対象を、操作・原文から有限に証明する設計を基本とする。対象数を増やせば通る一般規則にはしない。

3端点経験を旧received localの「2 basis／2 qualifiers／1 contrast」と偽って通さない。原経験の両端と追加回答の時点・ABOUTを各々証明する新しい限定contentを使う。REVISEを出来事と結ぶのも、既存更新ownerが実際に作ったABOUT関係がある場合だけであり、本文の都合で関係を追加しない。

反応撤回後の出来事単独には、既存receivedの2端点文法は使えない。**この片側撤回で残ったsource-owned event一つを、感情・評価・個人的意味を補わず事実として受け取る有限の内容・本文・逆検査も、本承認案へ含める。** 例として「褒められたことはあったのですね。」という受け取りが考えられるが、これは未実装の比較案であり本文成立は未検証。初回から一般のevent単独へ適用する案ではない。撤回された反応は出さず、独立不明は別の責務として残す。

private資格・局所content・checkpoint版はこの同時保持を区別できる形で既存ownerに追加し、旧V1/V2のschema・seal・意味条件を保持する。pairの局所二反応、receivedの局所両端と時点、unknownの独立対象を、同じ完全原文と受理更新の再導出から検証する。既存owner内の必要な内部関数は本案に含む。新production file、独立した補助subsystem／別生成経路、外部AI、依存、公開wire／DB migration／RNの仕様変更、稼働配置・費用追加は含めない。

現行`_base_ref`は核と関係をhashするため、選択変更だけでは旧新版を区別できない。新しい完全source資格のwitnessとu348再構築modeでcheckpoint identityを分け、旧保存checkpointへ新しい初回選択を付け替えない。旧完成DTO非再生成と、旧checkpointから未完成本文を再開することを別に確認する。

追加経験、順序自由化、複数／前置／第三者／過去不明、任意多段、新しい問い・回答理解、本人の原因・願望・他人意図の補完へは広げない。反応だけを撤回した場合、残る出来事から嬉しさ・悲しさなどを作り直さない。

## 利用者へ届く変化の比較案

以下は**未実装の説明用の案であり、生成済み出力ではない**。既存のreceived内容を選ぶことで何が増えるかを示す。語尾やこの全文への固定一致を完成条件にはしない。

初回、不明あり：

> ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。褒められたことは、あなたにとって嬉しさを伴わない経験だったのですね。何が不安なのか、あなたにもまだわからないのですね。

「今は嬉しい。」の追加後、別経験の部分：

> 褒められたのに、嬉しくなかったし、回答した時点では嬉しいのですね。

元の経験と回答時点を両方残し、「変わった」「褒められたから嬉しい」等の原因・変化を推定しない。経験内を一文に結び、pair・unknownを含む既存最大3文を緩めない。明示された経験を受け取っても、「本人にはどんな意味として届いたか」という未回答の問いを解決したことにはしない。無根拠な深さや新しい感情を足さない。

## 確認・成功・停止条件

- 元入力と既存の自然変種をQ1/Q3に通し、初回・既受理一更新の本文でpair・別経験・任意不明を読み分ける。件数や引用保持だけを品質改善に換算しない。
- ADD肯定／否定・明示現在／当時、反応訂正、出来事／反応撤回、pair／unknown自身の変更、非更新を、実際に発行された問いから確認する。架空の問いを作らない。
- 作者を呼ばない既存readerで、各責務の欠落・主体／時点／肯否の変異、原因化、撤回済み素材の復活を拒否する。全source資格・関係・envelope・selectedの改変も拒否する。
- 変更前u348の独立比較原本を先に保存し、新実装で作った期待値を旧互換の原本にしない。u348以前の既存復元も必要な差分に応じて確認する。
- 実service＋隔離SQLで同じ候補の保存・中断再開・非再生成を確認し、そのDTOを既存API client→hook→Modalへ通す。HTTP／Auth／nativeのstubを本人実機や本番確認と言わない。
- 一般move上限・既存未解釈の受理・Safety・public boundary・他core・新method familyを変更しなければ成立しない場合は、その具体差で止める。新しい承認を小分けに要求するために、初回だけを完成としない。

追加費用・Mashの環境操作は0の計画。必要なMash判断はこの同時保持範囲への一つの承認。工数は未計測で、固定時間や10/20までの完成保証を置かない。ここで承認がなければ初回received選択と更新保持の実装は未着手のまま。成立後も定型性・深い理解、一般入力、任意多段、E04〜E09、本人実機は別の未完として残す。

## 今回の結果と記録範囲

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=BLOCKER_NARROWED。不足の共通原因と、初回だけでは再発する更新時保持まで具体化した。production改善は0、意味契約変更は未実装。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持。10/20方式判断・10/31管理線・12/18公開目標、Piece/Analysis主枠と53.25％は再評価していない。

STRUCTURE_MAP_DELTA_NONE：今回変更するのは記録5fileのみ。実装owner・private logical83・公開経路に変更はなく、全体図01・地図01A/B/C・current mapの現行u348構造を維持する。提案が承認され実装した時点で、必要な型と全file地図を同じwrite unitで更新する。

| repository | 今回変更するpath | 役割 |
|---|---|---|
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u349_ReceivedExperienceRetention_Decision_20261018.md` | 実不足・承認差分・一体案の本文 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新診断・Mash判断が必要な範囲 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | u348実装とu349未実装案の区別 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 継続時の作業単位・未実装境界 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | API側の実source診断と同じ再開範囲 |

既存Draft PR3／PR30へ記録し、変更path・blob・全文・親commit・先端を読戻し確認する。merge・deployは行わない。
