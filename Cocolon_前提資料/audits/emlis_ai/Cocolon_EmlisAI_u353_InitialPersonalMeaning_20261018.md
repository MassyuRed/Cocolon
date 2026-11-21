> 2026-10-19最新差分：u353（10/18明示承認）。初回の元経験・本人説明・独立不明を、実回答／訂正・撤回／旧再開／保存再表示と一体で修復。新private3型・logical90。限定単位の技術検証まで完了、PRODUCT_NOT_CLEAR・正式Product Read0/3・candidate_ready=false・automatic_progression=falseは維持。詳細は[u353実装監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u353_InitialPersonalMeaning_20261018.md)。

# u353 — 承認済み初回本人説明の保持

開始時記録：2026-10-18 23:49 JST。**実装作業中。完了・配置・Product Read成功ではない。**

Mashは本会話で、u352具体案（Cocolon `80dc32c48d9fcfa821f6da0fae822b2ce4d0cb55`）の「本人の説明・元の経験・独立した不明を初回から保持し、既存回答・訂正／撤回・旧版再開・保存再表示まで一体で修復する」範囲へ「進めていいよ」と明示承認した。初回説明の新しい内容・選択を承認待ちへ戻さない。

## 開始時の範囲

| 項目 | 今回の固定内容 |
| --- | --- |
| product_destination | 既に書いた本人の受け取り方を聞き直さず、元経験・未変更pair・独立不明とともに本文へ残す |
| current_gate_or_subgate | Emlis/CMEEの初回本人説明から保存再表示までの一体単位 |
| exact_work | u352承認案のR＋M、P0/1、U0/1。元memoの本人知覚＋有限過去感情、実pending一回答、到達可能な訂正／撤回、旧再開・新旧保存 |
| scope_classification | LEVEL_3・個別承認済み |
| approval_or_delegation_basis | 上記Mashの本会話明示承認とu352固定commitの具体案 |
| execution_owner | 主担当華恋が編集・実行・GitHub反映・統合判断。補助担当は読取設計レビュー |
| success_credit | 実際に成立した範囲のTECHNICAL_CREDIT。製品全体・正式Product Read成功を自動付与しない |
| completion_condition | 原文に結び付く初回本文、実回答との整合、到達可能な訂正／撤回、独立読解、旧全解釈と保存・同一DTO再表示、GitHub全差分読み戻し |
| stop_condition | u352の最大3責務・有限sourceを超える必要、架空質問、新しいsubsystem、旧IDへの新意味貼替え、保護fixture改変、productを改善しない補助作業の拡大 |
| prohibited_scope | 外部AI、公開API/DTO、DB migration、RN新操作、Safety、依存、実データ書込み、配置、merge、任意多段への拡張 |
| next_product_read_or_mash_decision_point | 本文を主担当が再読し、機械検証との限界を報告。正式Product Read・公開は別判断 |
| current_source_test_receipt | u352診断、u350/u351監査と既存received/unknown test。変更前worktreeと独立processで旧checkpoint・全plan・selected・本文／停止を採取 |
| current_docs_and_heads | API `a47d26fc2469bc3461549f9b4a58a37c2bb6c50f`／Cocolon `80dc32c48d9fcfa821f6da0fae822b2ce4d0cb55`、Draft PR3/30。全体01・地図01A/B/C・最新weekly20261017・意味設計・05/06・handoff・作業規則を継続照合 |
| affected_current_structure_maps | 01A・Emlis/CMEE current map・全体01。新private初回role契約を実装する場合はSTRUCTURE_MAP_DELTA_PRESENTとして同じwrite unitで同期 |

必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK。新しい外部利用料・Mashの追加操作は0。所要は実装・検証実績で報告し、未計測の完了時刻を確約しない。Workの補助レビューを別model Pro/Ultraの正式二重評価と呼ばない。恒久商品無視incident全文を今回も読み、本文改善を中心にする。

productionの変更先は既存ownerに限定する：`ai/services/ai_inference/cocolon_meaning_experience_engine/` 配下の `contracts.py`、`emlis_question.py`、`emlis_thread_engine.py`、`emlis_answer_update.py`、`emlis_thread_projection.py`、`emlis_stage1_composition.py`、必要な同既存 `emlis_stage1_response.py`、および `ai/services/ai_inference/` 配下の `emlis_ai_grounded_observation_plan.py`、`emlis_ai_grounded_human_reception.py`、`emlis_ai_grounded_observation_gate.py`、`emlis_ai_grounded_sentence_surface.py`。新production fileを作らず、旧型の条件は緩めない。

検証は `ai/tests/test_cmee_emlis_initial_personal_meaning.py`、同 `_source.py`、同 `_delivery.py` と独立旧原本 `ai/tests/fixtures/cmee_emlis_u352_initial_personal_meaning_v1.json` を中心とする。既存testの保護比較原本は変更せず、現行logical manifest/owner identityの意図した版差分だけを既存追従test・現行identityへ反映する。具体的な実変更pathと実行結果は完了時に追記する。

初回Mは回答核・回答ABOUTにせず、元sourceの本人知覚・過去感情として新しい限定内容へ保持する。旧received二端点内容へ第三roleを偽装しない。既存P・R・M・Uの最大3責務を、received→任意P→任意Uの順に選ぶ。初回END後や一回答END後の架空回答は作らない。u352の否定unknown訂正の別不整合は診断を維持し、本単位の初回意味契約へ便乗して専用資格を復活させない。

PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。


## 実装・検証結果（2026-10-19）

Mashの「進めていいよ」により、u352固定案（Cocolon `80dc32c48d9fcfa821f6da0fae822b2ce4d0cb55`）を実装。新規初回のR＋Mに、前置P0/1・末尾独立U0/1を認め、元出来事・元反応・本人知覚＋有限過去感情を元memoの三roleとして保持する。初回を回答核・回答ABOUTへ変換せず、received→任意P→任意Uの最大3責務とする。完全な原文・主体・時点・肯否・全span順序を確認した場合だけ選択し、初回END・既述説明の非再質問を維持する。

Observationも修復し、本人説明と不明を原文順だけで「一つの流れ」にせず、過去の説明を「今は」の状態へ移さない。元received contrastから同時性を加えない。Receptionは原文の知覚を残し、他者の意図を事実化しない。新局所内容は既存LIMITED一aggregateを置き換えず、全3+2P+U対象とdisjointな2+P+U contributionを保持する。独立readerは作者を呼ばず、実本文の三role・原文・主体・時点・知覚・独立不明を照合する。

実pending一回答の明示時点語がない過去Mは、回答envelope・全scalar範囲・既存PERCEIVED文法・受理核の再導出が一致する場合に限り混在保持する。新しい回答文法は追加しない。混在3moveでcheckpoint生成と本文の資格入口がずれていた箇所も揃え、新Mを既存retention版へ結び付けた。旧u352 IDは旧source／plan／selected／本文または停止の全体を復元し、新意味を旧IDへ貼り替えない。完全引用訂正・撤回と実Q3の次質問での後続訂正を確認し、END後の架空回答は作っていない。

技術検証：分割実行・重複除外で対象140件通過（旧全比較50を含むcore90、source31、SQL15、既存manifest3、現行owner identity1）。独立した未変更u352原本50件と、checkpoint・original plan・accepted核・更新plan・関係・selected・本文・質問・停止が一致。保存済み完成DTOは再生成せず、未完成は保存checkpointの再利用／意味前再開を分けて検証した。同一の保存DTO 15件を実apiClient→API→hook→Modalで閉じて再表示2回まで確認。HTTP/Auth/nativeはstub、本人実機ではない。pytestは専用`--noconftest`の対象検証で、全suite成功とは呼ばない。

STRUCTURE_MAP_DELTA_PRESENT。既存production10owner内の変更、新private logical3型で87→90。公開API／DTO／DB migration／RN製品code／Safety仕様／依存は変更していない。Work補助担当は読取レビュー、編集・実行・統合・GitHub反映は主担当。別modelの正式二重評価やProduct Read成功へ転用しない。PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持。初回一体単位の限定技術修復を閉じるが、E04〜E09・深い理解・一般入力・否定unknown訂正の別generic整合・本人実機は残件。Piece/Analysis主枠53.25％、10/20方式判断・10/31管理線・12/18公開目標は再評価していない。Draft PR3／PR30継続、merge／deployなし。詳細・実本文・全変更地図は[u353監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u353_InitialPersonalMeaning_20261018.md)。

### 主担当による代表本文の再読

合成入力P＋R＋M＋Uの未加工本文。原文の説明を保持し、独立不明を解消せず、問いはEND。正式Product Readとは別の実装再読である。

```text
「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
「褒められた」のに「嬉しくなかった」という経験が書かれています。
「期待されているように感じて、重かった」と「何が不安なのか、私にもまだわからない」と、それぞれ書かれています。

褒められたのに、嬉しくなかったし、期待されているように感じて、重かったのですね。ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。何が不安なのか、あなたにもまだわからないのですね。
```

### 検証中に見つけた差分と修復

- 初回canonical「次も同じ成果を求められるようで、重かった」が既存lexicalでchangeに分類されるため、完全な原文資格が成立したときだけ外側feeling/pastへ一括正規化。「気がして」「ようで、軽かった」がeventになる場合も、同じ有限PERCEIVED全文と完全sourceでのみ正規化。
- Mの肯否とSELFをラベルだけで信用せず、外側感情と原文主体から再確認。
- 混在implicit ADDでcheckpoint入口と本文入口が不一致になったため、該当する既存資格だけ版生成へ接続。旧50件との全比較で解消を確認。
- 返答だけでなくObservationに残っていた「一つの流れ」「今は」とreceivedの同時性を修復し、独立読解に対応する改変拒否を追加。
- 新Rの独立読解を原文接続の完全1文・1pairに限定し、旧複数pair fallbackや余分な文を拒否。新Mの質問ENDとObservation作者にも完全source資格を使い、markerだけでは新内容へ進めない。
- Q3の部分引用「重かった」は全文の撤回にせず、既存どおりcorrection_target_unresolvedで本文停止。元回答・非失効・更新なしを確認。
- 非SAFEの既存自己否定ownerでは新source正規化・新move後処理を適用せず、旧全planとの完全一致を確認。新markerの必要条件を全source証明の前に置き、対象外の旧経路で不要なpair再導出を行わない。
- 公開engine回答比較は、実prepareしたcheckpointをrequestへ渡して実行。checkpoint不足の診断試行を製品failure／成功件数へ転用しない。

### 実行根拠・限界

対象は分割実行・重複除外で140件。core90（旧全比較50、初回16、非資格8、実pending9、実Q3訂正3、2表現×Q1/Q3の4）、source31、実SQL15、既存manifest3、最終owner identity1。単一の全suite実行結果とは呼ばない。

- 旧全比較：`pytest --noconftest ai/tests/test_cmee_emlis_initial_personal_meaning.py -k u352_full -q`、50 passed。独立未変更worktreeから採取したfixture（blob `3479c5e7039bc40ba4d93052e841dbb64f7c2daf`）を比較原本とした。
- 新coreの初回16／非資格8／実pending9／Q3完全引用2は通過。追加2表現×Q1/Q3の4も通過。部分引用の期待値を既存契約どおり本文停止・更新なしに直し、最後にQ3全3とsource30を33 passedで確認。部分引用へ新しい本文成功を与える製品変更はしていない。
- 最終source31＋現行owner identity1を同processで32 passed（38.84秒）。作者stubで欠落・事実化・現在化・因果化・独立要素損失・旧複数pair・余分sentenceを拒否。source改変、再sealによる役割偽装、型downgradeを拒否。非SAFEの既存ownerは旧全planと完全一致。
- 既存manifest3はlogical90・新型field inventory追従として通過。旧比較fixtureを新出力へ上書きしていない。
- 実SQL：`pytest --noconftest ai/tests/test_cmee_emlis_initial_personal_meaning_delivery.py -q -s -x`で初回8件通過後、次の初回commitにthread_conflict。初回試行ではSQL詳細codeを記録しておらず、単一の確定原因と断言しない。対象外旧sourceで新資格helperが不要なpair再導出を繰り返す箇所を、marker必要条件の早期returnで修復。SQLエラーの記録も追加し、期限／時計／engine結果を変更せず、`-k 'not completed_initial'`で残り7件を100.34秒・7 passedで確認。初回8＋回答4＋中断3＝15件。
- 記録された初回／回答保存の成功操作は0.139〜20.234秒。実30秒期限は変更していない。性能全体や本人実機での時間保証ではない。
- `node verify_ui_u353.cjs 15`：15件すべてで実apiClient→API→hook→Modalの同一DTO／本文／質問／状態／元入力／履歴順序、close/reopen各2回を確認。HTTP・Auth・nativeはstub。旧停止ではcurrent_observation=None、旧本文は履歴に保持。旧完成DTOはNoGenerationでGET/start一致。未完成のmeaning再利用はserviceの新しい意味保存をしない意味であり、本文生成内部の原文再導出・checkpoint照合は通常どおり行う。

実行環境はPython3.12.14／Pydantic2.14.0／pytest8.4.1、Node24.19.0／PGlite0.5.8。既存の一時依存環境を使い、repository依存は未変更。既定conftestに必要なFastAPIがこの環境にないため対象指定`--noconftest`で実行。一般full suite、本人実機、正式Product Readは未実施。

技術検証完了は2026-10-19 00:44 JST。開始23:49 JSTから約55分（この後のGitHub反映・読み戻しは別）。新しい外部有料サービス利用・Mashへの追加操作依頼は0。所要を商品完成率へ換算しない。GitHubの最終head・全changed paths・全blob一致は反映後にPR先頭へ記録する。

primary outcome: TECHNICAL_CREDIT。承認済み初回一体単位の限定修復を完了。新しいGateの自動進行・正式Product Read成功・公開判断は行わない。開始時記録の未完了表記は本節で置き換える。



### u353 全変更file地図

| repository | path | 責務 |
| --- | --- | --- |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_engine.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_projection.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 承認済み初回三roleの既存owner内修復 |
| mashos-api | `ai/tests/test_cmee_emlis_initial_personal_meaning.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/test_cmee_emlis_initial_personal_meaning_source.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/test_cmee_emlis_initial_personal_meaning_delivery.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u352_initial_personal_meaning_v1.json` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/test_cmee_emlis_mixed_unknown.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_cognition.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/tests/test_cmee_emlis_relief_unknown.py` | 境界・旧互換・保存／現行identity検証 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 現在地と次残件 |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u353_InitialPersonalMeaning_20261018.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/01_cocolon_overall_structure.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/current_structure/04_cmee_current_structure.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/designs/cmee/Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/05_json_schema_and_versioning.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 実装・契約・全体構造・現在地の同期 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 実装・契約・全体構造・現在地の同期 |
