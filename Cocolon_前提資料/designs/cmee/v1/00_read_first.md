# CMEE V1 詳細設計 — Read First

- document id: `cocolon.cmee.v1.detailed_design.read_first`
- revision date: `2026-09-04 JST`
- Step 10 final document id: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2`
- Step 10 design identity: `CMEE_THREE_CORE_INTEGRATED_DESIGN_20260821`
- Step 10 Pro review: `CMEE_STEP10_PRO_SINGLE_PRODUCT_ROUTE_REVIEW_20260821 / CONSUMED_EXACTLY_ONCE`
- decision owner: `Mash`
- technical design owner: `Ultra華恋`
- architecture parent: [Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)
- NLSv3 inheritance input: [NLSv3_to_CMEE_Disposition_Phase1_20260817.md](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
- lifecycle: `CURRENT_PRODUCT_OWNER_NON_PASS / SAME_NUCLEUS_STATUS_ALIGNMENT_IN_PROGRESS`
- effective when: `MERGED_TO_COCOLON_MAIN_AS_DESIGN_OWNER`
- current Draft authority effect: `ACTIVE_ON_OPEN_PR30_WORKING_LINEAGE_BEFORE_MERGE`
- implementation approval: `INHERITED_DISABLED_IMPLEMENTATION_COMPLETE_TO_IM09 / IM10_NON_PASS / REALIZABLE_RECEPTION_EXPRESSION_AUTHORIZED`
- dependency / production / test / runner / API / DB / RN effect: `0`
- Cycle001 restart effect: `0`
- Stage 1 language route: `ROUTE_A_PROVIDERLESS / SOURCE_GROUNDED_REALIZABLE_RECEPTION_EXPRESSION / HUMAN_RECEPTION_SOLE_LAYER2_AUTHOR`
- Phase 0 / P0 / P0-R1 / standalone product-delta-0 L3-R / L3-I lifecycle: `RETIRED_HISTORICAL_NONREUSABLE`
- current implementation rule: `PRODUCT_QUALITY_DELTA_GT_0_AND_MASH_CONFIRMED_ONLY`
- current implementation state: `INHERITED_OWNER_CHAIN_IMPLEMENTED_NOT_ACCEPTED / IM10_NON_PASS`
- Phase 2 design correction state: `TOP_LEVEL_NAVIGATION_ALIGNED`
- Step 10 design correction state: `FINAL_INTEGRATED_CONTRACT_REFLECTED_EXISTING_EXACT14`
- Karen-derived functional companion: `HISTORICAL_PREDECESSOR_ABSENT_CURRENT_TREE / CURRENT_OWNER_V1_02_AND_V1_06`
- Stage 1 additional correction final body: `COCOLON_CMEE_STAGE1_ADDITIONAL_CORRECTION_ULTRA_FINAL_TECHNICAL_BODY_AND_JOINT_RECOMMENDATION_20260824`
- Stage 1 additional correction Pro final confirmation: `PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`
- Stage 1 additional correction placement: `HISTORICAL_PREDECESSOR_INTEGRATION_SOURCE`
- duplicate parallel technical canonical design files: `0`
- current authorized next implementation: `FRESH_MASH_LEVEL3_CMEE_WORK_STAGE1_REALIZABLE_RECEPTION_EXPRESSION_CANONICAL_INTEGRATION_AND_HUMAN_RECEPTION_BODY_CLOSURE_20260904`
- automatic progression: `false`

---

## 0. このsuiteの役割

このdirectoryは、CMEEの上位技術設計を、実装者がsource、contract、module、failure、test、cutoverの順に追える詳細設計群である。Emlis入力固有意味決定のimplemented design authorityは既存final canonical §§19–§22、IM10 product verdict historyは本file §13、canonical 02 §35、canonical 06 §86が保持する。current Work Stage 1のcontract／実行routeは本file latest §14、canonical 02 latest §36、canonical 06 latest §87、final canonical latest §24が所有する。

起点は旧G0–G10の補助経路ではなく、次の商品job exact3とする。

1. EmlisAI: 入力をLayer 1「見えたこと」とLayer 2「Emlisから」へ変え、plan budget内で各roundの一点を問い、Plus／Premiumは条件成立時だけLayer 3「記録の線」を加える。
2. Piece: 保存済み入力の意味を、本人の表現として他者へ共有できるcanonical textと画像artifactへ変え、recipient-visible route exact1以上まで届ける。
3. 分析構造: 期間sourceから現在の自己構造routeをsame-identityのtext＋visual graphで形にし、観測と分離したIF routeを扱う。external retentionはfuture HOLDとする。

CMEEは三商品へ共通する意味保持・artifact生成のtechnical coreである。独立したuser-facing商品、第四の商品中核、共通voice、万能text generatorではない。

### 0.1 絶対実装規則へのbinding

本suiteは、parent final design
[`§0.3 三大中核構造及びCMEE実装作業の絶対定義`](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md#03-三大中核構造及びcmee実装作業の絶対定義)
に従う。「三大中核構造及びCMEEの実装作業」は、三大中核構造及びCMEEの商品品質を1％でも
向上させる作業だけである。それ以外は作業とも成果とも扱わず、開始しない。

従って、Phase 0 / P0 / P0-R1およびstandaloneでproduct-quality delta 0のL3-R / L3-Iは
`RETIRED_HISTORICAL_NONREUSABLE`である。後続sectionに残るbody、identity、terminal、hash、resultは失敗履歴と
非再利用証拠だけであり、current prerequisite、approval order、next workまたは再実行authorityを持たない。
別executor、別provider、別model、rename、類似preflight、新しい承認または別名のsuccessorで復活させない。
source / owner / unknown / no-promotionのproduct contractだけは、route-neutralなcurrent実装unit内の制約として保持する。

別のMash明示承認後に許され得るnext implementation classは、unchanged input / fixtureとcurrent actual Emlis artifactをbeforeとし、その同じ入力から得る
actual Observation / Reception artifactの商品品質を非0に改善する、one bounded implementation unit exact1だけである。
必要なtechnical stepはこの同一unit内に限り、別stage、別Gate、別成果へ切り出さない。

同unitの末尾で、華恋はbody-full private boundary内で全candidateを本文として読む。復唱・近い言い換え・
meaning label置換・少数template・generic Reception・集合反復・深さ不足の一つでも残ればMashへ見せず、
商品本文の共通原因を同unit内で修正する。明白な低品質が解消し、商品artifactの設計・実装・読みの厳密さが
過去の補助経路へ投じた厳密さを少なくとも上回った後だけ、actual before / after / resultをMashへprivateに提示する。

商品品質向上の証明は、上記actual product resultとMashの明示確認だけである。華恋のmachine check、
trace、proof、hash、schema、internal reviewまたは自己採点はproofではない。Mash確認前はcandidateであり、成果または
product creditへ変換しない。この規則のためのnew Gate、checker、score、Receipt、authority familyまたはproof systemを作らない。

この規則の理由となった事実記録:
[EmlisAI商品中核の後回しとCMEE Product Read失敗](../../../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)。

### 0.2 NLSv3継承に関する第2段階の境界

第1段階の事実整理は、
[NLSv3 → CMEE Disposition表](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
が所有する。同表は`REVIEWED_NONAUTHORITY / NLSV3_TO_CMEE_MIGRATION_INPUT`であり、設計正本、実装承認、
Cycle001再開authorityまたはproduction cutover authorityではない。第2段階では同表の分類とevidence indexを根拠に、
既存のFinal／Detailed Design ownerだけを必要な範囲で補正する。

NLSv3は捨てない。同時に、NLSv3とCMEEを二つの現役EmlisAI生成エンジンとして残さない。継承は大規模な
PR #2 recovery／surface実装をCMEEから丸ごと呼ぶwrapper方式ではなく、責任・使えるsymbol・test vector・corpus・
failure knowledge・Product Read方法を、それぞれのcurrent CMEE ownerへ移す方式とする。

継承区分は次のとおりである。

1. 三商品で共通するsource identity、evidence、meaning、unknown、semantic duty、plan、trace、artifact identity、machine／human分離はshared ownerへ置く。
2. App-Reachable Input、Observation、bound Reception、Emlisの声・距離・深さ、自然な日本語、body-only reverse、current100商品評価はEmlis routeへ置く。
3. Pieceには完成物から意味を戻す思想をtext＋visual用へ改良し、Analysisにはnode／edge／direction／IF provenance用へ改良して置く。
4. NLSv3の失敗case、mutation、回帰test、corpus、changed-output rereadはtest／failure knowledgeとして保持する。
5. Gate、Receipt、controller、executor、FD、長いauthority chain等の運用外殻はhistorical evidenceとして保持し、current routeへ復活させない。

切替はexact2の別境界で行う。

```text
A. Cycle001 candidate ingress cutover
   CMEE Cycle candidate ingress exact1
   NLSv3 direct recovery ingress 0

B. Production generation cutover
   Cycle proofと別のMash判断後
   CMEE Emlis generation owner exact1
   current production direct generation ingress 0
```

AとBを同一承認または同時cutoverへまとめない。第2段階のdesign correction自体から、A、B、実装、runner、
Product Read、PieceまたはAnalysis activationへ自動進行しない。

第2段階の整理順は次のexact5とする。

1. Final Designと本Read Firstで最上位の継承方針・読み順を揃える。
2. shared kernelとschemaで共通責任、identity、lineageの置き場所を揃える。
3. Emlis detailで商品中核、body-only reverse、natural／anti-template、separate safetyを揃える。
4. migration designでasset単位の移管、二段階cutover、旧owner退役を揃える。
5. Piece／Analysis detailへ将来改良する確認責任だけを明記する。

一つのphase資料を新設せず、既存ownerを順に修正する。第3段階のcurrent structure map／商品経路地図修正は、
上記design ownerの責任境界が揃った後に別write unitで行う。

### 0.3 Step 10 final integrated contract routing

2026-08-21のStep 10では、Step 9-B Final Disposition、MashのQ1〜Q3とplan判断、actual evidence、
Ultra stable V1に対するPro華恋の一回限りの正式reviewを、existing canonical exact14へ同期した。
Pro reviewは`CONSUMED_EXACTLY_ONCE`で、二回目は不要である。

current contractの短いroutingは次である。詳細は各exact ownerを読む。

| Contract | Canonical owner |
|---|---|
| source role、thread sequence、shared neutral boundary | `01_shared_kernel_and_runtime_contracts.md` |
| Emlis Free／Plus／Premium、Premium frame、Layer 1／2／3、question | `02_emlis_v1a_detailed_design.md` |
| Piece exact3 plan selection、recipient-visible final acceptance | `03_piece_v1c_detailed_design.md` |
| Analysis text＋graph、Free latest-only、IF、future external retention HOLD | `04_analysis_v1d_v1e_detailed_design.md` |
| logical thread／plan／layer／Piece／Analysis fields and invariants | `05_json_schema_and_versioning.md` |
| asset migration、remaining exact10、vertical order、verification | `06_implementation_order_migration_and_verification.md` |

cross-core source boundary:

- user originalとsupplemental answerは本人sourceである。
- Emlis Layer 1／2／3とquestionはderived artifactで、Analysis／Pieceのsourceにしない。
- Analysisはsupplemental answerをoriginal recordの補足根拠として使えても別occasionへ数えない。
- Pieceは本人が明示的に含めたsupplemental answerだけを使える。
- Premium cross-coreはuser-owned／user-confirmed／source-resolvable safe projectionだけを許可し、
  Piece生成本文、Analysis推定／IF、過去Emlis本文を拒否する。

Emlis plan／Layer:

```text
Free:
  current thread only
  Layer 1 + Layer 2
  question 0..1
  Layer 3 = 0

Plus:
  current thread + eligible owned history
  Layer 1 + Layer 2 + conditional Layer 3 0..1
  question 0..1

Premium:
  Plus + evidence-bound provisional correctable interpretive frame
  + allowed cross-core user context
  Layer 1 + Layer 2 + conditional Layer 3 0..1
  question sequential 0..3
```

P6 current-input structure insightは全planのLayer 1へ、P5 history continuityはPlus／PremiumのLayer 3へ置く。
Freeでもthreadを保存するが、別入力の生成sourceとしてpast threadを利用しない。

target scheduling order:

1. Emlis Layer 1／2。
2. Emlis question／refined Layer 1／2。
3. Emlis Plus／Premium Layer 3。
4. Piece text＋visual＋recipient-visible route。
5. Analysis V1-D observed text＋graph。
6. Analysis V1-E SELF_ONLY IF。

これはautomatic progressionまたはcross-core hard dependencyではない。各verticalの終点はactual artifactと
core-specific Product Readである。Cycle001はfresh current ownerが持つseparate external proof laneで、
docs、Layer 3、Piece、Analysisのautomatic prerequisiteではない。

Step 10 canonical synchronization set:

```text
parent Final Technical Design = exact1
detailed suite = exact7
current structure = exact5
Emlis long-term roadmap = exact1
total existing paths = exact14
new parallel canonical design file = 0
```

remaining `NEW_BUILD_IMPLEMENTATION`はlogical responsibility exact10であり、file countまたはimplementation authorityではない。
本docs reflectionからsource、test、DB、API、RN、runtime、activation、production、Cycle、Product Read、cleanupへ進行しない。

### 0.4 2026-08-23 華恋由来functional companion correction

2026-08-23のPro final reviewは、華恋由来の機能構造が既存technical ownerへ吸収されるだけでは、商品目的の独立ownerが残らないと判断した。Mashの今回指示に基づき、functional companion exact2を追加する。

```text
functional companion canonical candidate = exact2
duplicate technical canonical = 0
technical integration source = NONCANONICAL exact1
current structure map delta = 01 + 04
runtime / test / API / DB / RN / production effect = 0
product credit = 0
automatic progression = false
```

Step 10の`new parallel canonical design file = 0`は当時のsynchronization factとして保持する。今回追加するのは第二technical design treeではなく、P1–P8、M1–M7、Layer 1 / 2、V1–V9、最低商品品質を所有するfunctional companionである。

technical integration source at that historical checkpoint:

`Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md`（current treeには存在せず、Git history上のpredecessor）

次のruntime implementationは別の長い設計・審査projectへせず、fresh preimageを入れた短いexecution envelopeから同一bounded Stage 1 product correctionへ戻る。本docs correctionはimplementation開始authorityを生成しない。

### 0.5 2026-08-24 Stage 1 additional correction final body

Mashの今回の明示指示に基づき、Pro華恋が最終確認で`PASS / BLOCKER 0 / MAJOR 0 / MINOR 0`とした次の本文を、PR #30 working lineageへdocs-onlyで配置する。

`Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md`（current treeには存在せず、Git history上のpredecessor）

```text
document_id = COCOLON_CMEE_STAGE1_ADDITIONAL_CORRECTION_ULTRA_FINAL_TECHNICAL_BODY_AND_JOINT_RECOMMENDATION_20260824
reviewed_source_sha256 = 1f02e566ddfaefcbfc99ba985e3ef8af5c8e15b8867215c994cda99fbdedff05
reviewed_source_bytes_lines = 357275 / 4008
pro_final_confirmation_sha256 = ceef533a19d6ee2be75be06e8be74bc2fbefb7a7f0130050ffe2678903bef5bb
placement_role = NONCANONICAL_TECHNICAL_INTEGRATION_SOURCE
design_record_write = APPROVED_BY_MASH_20260824
implementation_approval = NOT_GRANTED
runtime_test_api_db_rn_production_provider_dependency_effect = 0
automatic_progression = false
```

本文frontmatterの`pro_review_verdict=CHANGES_REQUIRED`は初回reviewの歴史事実、`GITHUB_WRITE_APPROVAL=NOT_GRANTED`はfinal body freeze時点の状態として改変しない。本sectionとcanonical 06 §30が、今回のfinal Pro confirmationとdocs-only配置authorityを所有する。これは本文§12.2が禁じるparallel technical canonicalではなく、将来MashがLEVEL_3実装を明示承認した場合に限り、functional owner、02、05、06へ責任別に分配するintegration sourceである。

current v2 Step 7のmachine GREEN / pre-screen結果はhistorical factとして保持するが、Mashのactual本文判断「文章品質が不足する」によりproduct acceptanceは`FALSE`、candidate readyは`false`である。本文§13のStep 0–9だけをadditional correctionの提案実装順とし、canonical 06 §30がcallable名、known early exact4、遷移Tを一意に補足する。別の実装順ownerは作らない。System Context PR #37はnavigation-onlyのまま更新しない。

### 0.6 2026-08-27 Route A typed Japanese case-frame realizer v2 final design

Mashのcurrent直接判断により、corrected V2 exact bytesへsession-safe実装順Step 0–14を統合した次のfinal documentを、PR #30 working lineageのcurrent Stage 1 successor designとする。

[Route A Typed Japanese Case-Frame Realizer v2 — Final Technical Design and Implementation Order](../Cocolon_CMEE_Stage1_RouteA_TypedJapaneseCaseFrameRealizerV2_UltraFinalTechnicalDesignAndImplementationOrder_20260827.md)

    final_document_id = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_FINAL_TECHNICAL_DESIGN_AND_IMPLEMENTATION_ORDER_20260827
    source_corrected_v2_sha256 = 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de
    final_document_sha256 = da20918280ccb4bcaba7ee112dca454e447fdcfb6432891e3c7437d29b311cbd
    mash_decision_id = COCOLON_CMEE_ROUTE_A_V2_FINAL_DESIGN_AND_SESSION_ORDER_APPROVAL_20260827
    mash_final_design_approval_sha256 = a4052f3bb4744107b7740f219733275679dbc38fecbb79fb8d292bcfbf6044eb
    session_safe_order = I00_I14_EXACT15
    session_safe_order_sha256 = 0d6fb8cb123669d37d4a6801225f9995ea6ff3765900c6fb460e7592f1bba7b6
    pro_delta_final_check / read / reread = NOT_RUN / 0 / 0
    pro_verified_current_body_clear = false
    implementation_execution = NOT_STARTED
    current_authorized_next_step = I00_AFTER_FRESH_EXPLICIT_STEP_START
    predecessor_counter = 2_OF_2_IMMUTABLE
    step_4_1 / product_pass / activation = 0 / 0 / 0
    automatic_progression = false

旧2026-08-24 final bodyは歴史的predecessorとして保持し、current implementation orderの詳細はfinal document §20、canonical checkpoint routingは06 latest sectionが所有する。本docs reflectionはruntime、test、private generation、API、DB、RN、activation、productionを開始しない。

### 0.7 2026-08-28 Emlis input-specific meaning decision pre-finalization record（§11がstatusを置換）

Proの最終商品レビューは、前回必須修正10/10の反映を確認し、設計方向を`PASS`とした。残るtechnical handoff exact1をForeground Scope closed derivation、whole-reading consequence closed exact7、`SubjectiveDepthClass`、IM00–IM10 exact11で閉じた次のfinal documentを、PR #30 working lineageのcurrent Stage 1 upstream meaning design candidateとする。

[Emlis Input-Specific Meaning Decision — Final Technical Design and Implementation Order](../Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md)

    final_document_id = Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828
    intermediate_revision_sha256 = 0bc64a78c2ce092dec1ca86fb91050402745c00ffaf1c2b198d2b83f5f0e1a51
    pro_final_product_review_sha256 = 7dbaf221244c840f376d49b978df4fdab375f1c4f7f7ff4cbcfc25be712d0cec
    final_document_sha256 = 9690c3f027608825406df7bd5d3b51cb6834b20e07e36bf837b1e309b2daef18
    pro_final_product_review = PASS
    previous_required_corrections = 10_OF_10_REFLECTED
    canonical_adoption = READY_FOR_MASH_DECISION
    revision_state = PRO_FINAL_PRODUCT_REVIEW_PASSED
    technical_handoff_remaining = EXACT0
    implementation_order = IM00_IM10_EXACT11
    implementation_execution = NOT_STARTED
    current_authorized_next_step = NONE
    next = FRESH_MASH_LEVEL_3_ROUTE_A_ONLY_DESIGN_ADOPTION_AND_IMPLEMENTATION_DECISION
    product_read / product_credit / activation / i09 = 0 / 0 / 0 / 0
    automatic_progression = false

本paragraphは2026-08-28時点のpre-finalization履歴である。current status、レビュー列、canonical adoption、implementation contract、proposal dispositionは§11が置換する。上流meaning decision ownerと下流Route A typed case-frame sole-owner境界は保持し、下流でmeaningを再選択しない。

### 0.8 2026-08-28 Emlis input-specific meaning decision IM00 checkpoint

Mashのfresh Level 3 Route A providerless-only指示により、final document §17のIM00 exact1だけを実装した。mashos-api Draft PR #3 head `2c607f001e3524de67c6c276d0140c1b8b464584`でremote postverify済みである。

- 既存`SubjectiveDepthClass` exact3を再利用した。
- Foreground Scope basis exact5、relation exact4、compatibility axis exact10、derivation state exact4とclosed validatorをcore-private contractへ実装した。
- `MeaningReadingOperation` exact7はtyped seamだけ、`WholeReadingConsequenceCode` exact7はsemantic signature／context／row validatorまでを実装した。
- typed `GroundedObservationPlan`／`GroundedMeaningGraph`をIM00のupstream Grounded View trust boundaryとし、source／Layer 1／projectionをlocal deterministicに照合する。Reception、affect、style、surface、visible line、subjective bindingからの逆流は0である。
- actual `derive_foreground_scope_closed()` pipeline接続とcompatible union／competing LIMITED／zero-object STOPはIM01、Required Difference issuerはIM02、operation applicabilityはIM03へ留保した。

focused IM00＋current identityは`15/15 PASS`、boundaryは`5/5 PASS`、compileall／diff-checkはPASSである。旧Route A v2 N3 runner identity、terminal、counter 2/2はimmutableのまま、full public regressionはfinal designどおりIM07へ留保し、IM00では主張しない。

IM00はnonterminal session checkpointであり、Product／technical credit、Product Read、acceptance、activation、mergeは0である。依存順上の次はIM01で正しいが、IM01は未開始で、fresh Mash explicit startなしに自動進行しない。

### 0.9 2026-08-28 Emlis input-specific meaning decision IM01 integration gate

Mashのfresh explicit authorityは、IM00のremote-postverified runtime head `2c607f001e3524de67c6c276d0140c1b8b464584`とdesign head `ac1ccfce52374abad122cb6b82f99b0760c01d6f`をsole preimageとして、final document §17のIM01統合修正とformal pytest exact1だけを許可する。authority前のlocal途中差分は完了creditではなく、failed diagnostic pytestはclosed/no-creditである。

最初のformal launcherはrepository `ai` rootをisolated Pythonのimport pathから外した`COMMAND_CONSTRUCTION_ERROR`でcollection 0となった。Mashのfresh bounded mechanical repair authorityによりlauncherだけをexact1修復し、target／denominator／comparator／input identity／runtime不変の同じGateをexact1再実行した結果は`25 passed`でGREENである。

- response pipelineをpre-meaning grounded inputsとallowed Reception envelopeへ型分離する。
- typed Grounded Viewから`derive_foreground_scope_closed()`へ実接続し、scope basisを許可exact5に限定してtyped compatibility exact10でcanonical unionする。
- 新しい型に合わせて旧IM00 test fixtureを移行し、この移行を含むactual source／test統合をformal pytestより前に完了する。
- material competing scopeは`LIMITED_COMPETING_MATERIAL_READINGS`、safe objectがある構造不足は`LIMITED_STRUCTURE_INSUFFICIENT`、safe foreground object exact0だけを`STRUCTURE_INSUFFICIENT_STOP`へ閉じる。
- Reception、affect、stance、style、temperature、subjective mode、surface、fixture、ID／hash／列挙順からscope derivationへの逆流は0とする。

```text
RUNTIME_PRE_HEAD = 2c607f001e3524de67c6c276d0140c1b8b464584_REMOTE_POSTVERIFIED
DESIGN_PRE_HEAD = ac1ccfce52374abad122cb6b82f99b0760c01d6f_REMOTE_POSTVERIFIED
PRIOR_DIAGNOSTIC_PYTEST = FAILED_CLOSED_NO_CREDIT
POST_AUTHORITY_PREINTEGRATION_TEST_EXECUTION = 0
IM00_FIXTURE_MIGRATION_BEFORE_FORMAL_PYTEST = COMPLETE
ORIGINAL_FORMAL_PYTEST_ALLOWED_INVOCATION / RETRY / RERUN = 1 / 0 / 0
ORIGINAL_FORMAL_PYTEST_RESULT = COMMAND_CONSTRUCTION_ERROR_COLLECTION_0_CLOSED_NO_CREDIT
BOUNDED_MECHANICAL_REPAIR_LAUNCHER / SAME_GATE_RERUN = 1 / 1
FORMAL_PYTEST_TERMINAL_RESULT = GREEN_PASS_25_OF_25_OWNED_BY_CANONICAL_06_SECTION_82
OTHER_REPOSITORY_CODE_EXECUTION = 0
WRITE_GATE = FORMAL_PYTEST_GREEN_SATISFIED
STEP_STATE = COMPLETE_NONTERMINAL_CHECKPOINT
IM02 / ACTIVATION / I09 / PRODUCTION = 0 / 0 / 0 / 0
NEXT_DEPENDENCY / CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = IM02 / NONE_AFTER_IM01
```

IM01はIM00–IM09のnonseparable bounded unit内にあり、このcompleted nonterminal checkpoint自体のProduct／technical credit、Product Read、acceptance、activation、mergeは0である。Required Difference、counterfactual mutation、WholeReadingConsequence actual issuerはIM02のownerへ留保するが、本authorityでIM02へは進まない。full public regressionはIM07へ留保し、自動進行しない。

## 1. 読む順 exact11

1. 本file
2. [NLSv3 → CMEE Disposition表](../NLSv3_to_CMEE_Disposition_Phase1_20260817.md)
3. [Emlis V1-A current product contract](02_emlis_v1a_detailed_design.md) latest §36（§35はIM10 verdict history）
4. [01_shared_kernel_and_runtime_contracts.md](01_shared_kernel_and_runtime_contracts.md)
5. [05_json_schema_and_versioning.md](05_json_schema_and_versioning.md)
6. 実装対象coreの詳細設計
   - [02_emlis_v1a_detailed_design.md](02_emlis_v1a_detailed_design.md)
   - [03_piece_v1c_detailed_design.md](03_piece_v1c_detailed_design.md)
   - [04_analysis_v1d_v1e_detailed_design.md](04_analysis_v1d_v1e_detailed_design.md)
7. [Emlis input-specific meaning decision final technical design and implementation order](../Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md)
8. [06_implementation_order_migration_and_verification.md](06_implementation_order_migration_and_verification.md) latest §87（§86はpre-current execution history）
9. `../../../current_structure/01_emlis_ai_current_structure.md` latest §19
10. `../../../current_structure/04_cmee_current_structure.md` latest §32
11. mashos-apiの既存CMEE handoff latest current sectionとactual source / contract / test

Disposition表だけでcurrent実装状態や移管完了を決めない。本suiteだけでcurrent実装状態を決めず、current structure mapを地図、
GitHubのactual source / testを現物として両方確認する。

## 2. 文書別authority

| File | Owns | Does not own |
|---|---|---|
| `00_read_first.md` | 読み順、lifecycle、suite全体の非影響、NLSv3継承の第2段階routing | runtime contract詳細、asset単位の最終移管 |
| `02_emlis_v1a_detailed_design.md` latest §36 + `06_implementation_order_migration_and_verification.md` latest §87 + final canonical latest §24 | IM10 NON_PASSを継承するcurrent expression contract、follow-primary配分、owner境界、完成までの実行順 | actual runtime execution、Product PASS、production activation |
| `../NLSv3_to_CMEE_Disposition_Phase1_20260817.md` | 第1段階の分類、受け皿、重複・欠落、evidence index | design authority、implementation authority、移管完了claim |
| deleted `../Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md` | HISTORICAL_PREDECESSOR_ABSENT_CURRENT_TREE / 当時のPro-confirmed Stage 1 additional correction、root cause、提案delta、§13実装順をGit historyで保持 | current authority、parallel canonical owner、current runtime activation、implementation authority、Product PASS |
| `../Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md` | `FINAL_CANONICAL_IMPLEMENTATION_READY`のupstream input-specific meaning商品設計、§19–§22のnormative implementation contract／order／Packet境界 | implementation execution start、actual runtime result、Product Read、activation、I09 |
| `01_shared_kernel_and_runtime_contracts.md` | shared logical architecture、ports、pipeline、failure | core固有商品判断 |
| `02_emlis_v1a_detailed_design.md` | Emlis observation vertical、question lifecycle、Cycle境界 | Piece / Analysis activation |
| `03_piece_v1c_detailed_design.md` | share artifact、visual spec、identity、clean cutover | renderer implementation / DB activation |
| `04_analysis_v1d_v1e_detailed_design.md` | observed route、IF graph、projection、identity | current Watashi Mapの無承認置換 |
| `05_json_schema_and_versioning.md` | canonical draft schemas、identity、versioning | production schema registration |
| `06_implementation_order_migration_and_verification.md` | current product-quality implementation unit、NLSv3 asset migration、二段階cutover、Route A-only current authority | 実装開始authority |

## 3. Fixed architecture decisions

1. outer hostは`ai/services/ai_inference/cocolon_meaning_experience_engine/`をexact1推奨とする。
2. current `cocolon_text_generation_core`はdownstream guard subsystemとして保持し、CMEE全体へ昇格しない。
3. first implementationはEmlis sourceからactual observation candidateまでのvertical sliceであり、空package / schema-only / adapter-onlyを完成扱いしない。
4. active generation ownerはcoreごとにexact1とし、cutover時のparallel active owner、fallback、mirror routeは0とする。
5. shared APIの詳細fieldはEmlisだけでfinal freezeせず、第2 actual coreで共通昇格を判定する。
6. Piece / Analysisのdesign contractは先に固定してよいが、runtime moduleは各phaseの別承認まで作らない。
7. machine PASS、human Product Read、actual-device PASS、runtime readiness、Cycle acceptanceを相互変換しない。
8. user source、provisional meaning、hypothesis、simulation、saved intentを型で分離する。
9. original sourceをuser correctionやsupplemental answerでretroactive mutationしない。
10. API / DB / RLS / RN / public routeはcore lifecycle ownerに残し、CMEE packageの初期実装で変更しない。
11. NLSv3は責任・symbol・test・corpus・failure knowledgeをowner単位でCMEEへ継承し、PR #2全体をCMEE hostへwrapしない。
12. Cycle001 candidate ingress cutoverとproduction generation cutoverは別approval・別write unitとし、最終的にactive Emlis generation owner exact1へ収束する。

## 5. Runtime entrypoint target

outer public entryはexact1とする。

```python
MeaningExperienceEngine.generate(
    request: GenerationRequest,
) -> EngineOutcome
```

requestは`core_id + product_job`のdiscriminated unionである。V1-Aでadmitするのは`EMLIS_AI / OBSERVE_AND_CLARIFY`のObservation sliceだけである。Piece / Analysis callable、dynamic provider registry、empty handlerをproduction packageへ先行作成しない。

canonical internal / schema enum:

```text
core_id:
  EMLIS_AI | PIECE | ANALYSIS

product_job:
  OBSERVE_AND_CLARIFY | EXPRESS_AND_SHARE | MAP_AND_EXPLORE
```

V1-Aのactual admitted sub-jobは`OBSERVE_AND_CLARIFY`内のObservation sliceである。Piece formatのcanonical wire valueはexisting V2 contractへ合わせて`short_essay | quote | declaration`とし、uppercase Python enumを使う場合はserializerでexact mappingを一つだけ持つ。

## 6. State axes

current orthogonal state:

```text
document_lifecycle = DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE
stage1_language_route = ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER_ONLY
external_generative_ai = PROHIBITED
external_body_send = 0
retired_provider_investigation = REMOVED_FROM_CURRENT_TREE_GIT_HISTORY_ONLY
runtime_state = DRAFT_WIP_DISABLED
implementation_evidence_owner = MASSYURED_MASHOS_API_DRAFT_PR_3_HEAD_106A1B8C92E808D15E88CE4F56C6300568D93E9F
r1_r4_state = CLOSED_GREEN
candidate_state = GENERATED_FOR_PRODUCT_READ_DISABLED_PENDING_MASH
machine_structural_exact8 = 8/8
product_read_state = PENDING_MASH_PRODUCT_READ
candidate_ready = false
source_owner_contract_complete = false
production_state = NOT_CONNECTED
cycle_state = NOT_REOPENED
current_authorized_next_implementation = NONE
only_admissible_next_implementation_class = ONE_BOUNDED_ACTUAL_EMLIS_STAGE1_ARTIFACT_IMPROVEMENT_UNIT
current_result_proof = NOT_ESTABLISHED_PENDING_MASH_PRODUCT_READ
required_future_result_proof = ACTUAL_PRODUCT_RESULT_PLUS_MASH_EXPLICIT_CONFIRMATION
automatic_progression = false
```

future target states:

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
CMEE_V1A_CYCLE001_PROVEN
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
CMEE_V1B_EMLIS_QUESTION_OPERATIONAL
CMEE_V1C_PIECE_VISUAL_OPERATIONAL
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
CMEE_V1_THREE_CORE_OPERATIONAL
```

target listはautomatic transitionではない。current authorized next implementationは0である。別のMash明示承認がある場合に許され得るclass exact1だけが§0.1のactual Emlis artifact品質改善unitであり、historical preflight / L3-Iを間に挿入しない。Cycle再入場、production、Piece / Analysis activationは、各coreのactual product resultが必要な別product decisionである。

## 6.1 Parent contract refinement

本suiteの`05_json_schema_and_versioning.md`は、parent §6.6のstatus shapeを次の二層へ詳細化する。

- `GenerationArtifactBundle`: visible artifactが存在する`GENERATED | LIMITED`だけ。
- `EngineOutcome`: `GENERATED | QUESTION_PENDING | LIMITED | REJECTED | UNAVAILABLE | SEPARATE_SAFETY` exact6。`QUESTION_PENDING`はtyped clarificationと、core policyに応じたoptional artifact bundleを持てる。
- non-generated resultをempty `GenerationArtifactBundle`で表現しない。
- parent / Piece entryの`new Piece safe-disable`は、V1-C初回cutover前に別承認・pre-admitするsingle-owner `PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET`へ具体化する。generic feature flag、dual-run、旧Q&A restorationではない。

このrefinementはparentのproduct intentを変えず、同名typeの曖昧さを解消する。詳細suiteがdesign ownerとしてadoptされる場合、このstatus fieldに限り05をimplementation schema authorityとする。

## 7. Product-causal admission — human checklist only

新module、field、dependency、test、signalは、PR説明内で次を説明できる場合だけadmitする。

1. actual consumer core
2. product job
3. quality criterion ID
4. observed gap
5. user-visible artifactへ効く因果
6. 次のactual run / Product Read / device proof
7. stop / retire condition

この確認専用のchecker、schema、Gate、Receipt、dashboard、authority chainを作らない。

## 8. Privacy and evidence boundary

- runtime source body、generated body、user correction、Product Read本文はprivate body-fullである。
- public GitHubとbody-free telemetryへraw input / output、identifiable paraphrase、case ID、private locator、keyを出さない。
- source body hash、source commitment digest、visible text hashはprivateであり外へ出さない。承認済みのnon-user-correlating provider / schema / artifact identity hash、anonymous count、reason code、body-free contract resultだけをpolicy範囲で外へ出せる。
- internal `body_locator_private`はpublic serialization対象外である。
- CMEEは新しいpublic telemetry DB、log service、dashboardを作らない。

## 9. Completion and STOP

本suiteの完成は、technical Markdown exact7とfunctional companion exact2がGitHubへ存在するだけではない。次を満たす必要がある。

- exact7相互linkが解決する。
- shared / Emlis / Piece / Analysisのauthority重複がない。
- schema draftと文章contractが一致する。
- implementation順にentry / exit / STOPがある。
- current CMEE structure mapが同じwrite unitで同期する。
- remote bytesとchanged pathsをpostverifyする。

## Current Route A-only authority（2026-08-25 Mash決定）

Mashのcurrent明示指示により、CMEE Stage 1のcurrent/future language routeはproviderless Route A exact1だけである。外部生成AI、external generative composer、remote model/provider、current input本文またはsemantic projectionの外部送信、network call、provider dependency、fallback、external costを禁止する。名称変更、別packet、別operator、別providerまたはfresh approvalで代替routeを復活させない。

今回の決定は外部route撤去とroute-neutral source/owner contractへの改名だけを承認する。第三generic correction、counter reset、同じStep 3の再実行、Step 4、formal Product Read、ready、merge、productionは承認しない。Route Aでceilingまたはreturn budget exhaustionとなった場合は、そのterminalで停止する。

```text
DECISION_ID = COCOLON_CMEE_STAGE1_ROUTE_A_ONLY_EXTERNAL_AI_PROHIBITION_20260825
DECISION_OWNER = MASH
SOLE_CURRENT_AND_FUTURE_ROUTE = ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER
EXTERNAL_GENERATIVE_AI = PROHIBITED
EXTERNAL_COMPOSER_OR_REMOTE_MODEL_PROVIDER = PROHIBITED
CURRENT_INPUT_OR_SEMANTIC_PROJECTION_EXTERNAL_SEND = 0
NETWORK_CALL / NEW_PROVIDER_DEPENDENCY / FALLBACK / EXTERNAL_COST = 0 / 0 / 0 / 0
ALTERNATIVE_ROUTE_CURRENT_AUTHORITY / FUTURE_TRIGGER / REACTIVATION = 0 / 0 / 0
EXTERNAL_OPERATOR = NOT_APPLICABLE
COMMON_DEFECT_RETURN_COUNT = 2/2_UNCHANGED
EARLY_ACTUAL_STATUS = NOT_RUN
STEP3 = COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP
THIRD_GENERIC_CORRECTION / COUNTER_RESET / STEP3_RERUN / STEP4 = 0 / 0 / 0 / 0
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION_AT_20260825 = NONE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = I00_AFTER_FRESH_EXPLICIT_STEP_START_PER_SECTION_0_6
ONLY_POSSIBLE_FUTURE_CLASS_AT_20260825 = FRESH_LEVEL3_ROUTE_A_PROVIDERLESS_ONLY
CURRENT_APPROVED_SUCCESSOR_CLASS = ROUTE_A_TYPED_CASE_FRAME_I00_I14
PRIMARY_OUTCOME = ADMINISTRATIVE_ONLY
PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0
AUTOMATIC_PROGRESSION = false
```

## 10. IM02 completion checkpoint（2026-08-28）

Mashの明示的なcomplete-to-finish authorityにより、implementation order §17のIM02をactual runtimeへ統合した。Difference Config、Observed Difference／Required Difference、closed counterfactual mutation、Difference Bundle、WholeReadingConsequence issuer、response pre-Reception storage、composition rederive／exact equality、runtime integration exact17 identityが実装対象である。final design source本文は変更していない。

```text
CHECKPOINT_ID = CMEE_EMLIS_INPUT_SPECIFIC_MEANING_IM02_DIFFERENCE_REQUIREMENTS_20260828_V1
IMPLEMENTATION_STEP / STEP_STATE = IM02 / COMPLETE_NONTERMINAL_CHECKPOINT
FORMAL_GATE_HISTORY = MISSING_FASTAPI_PRECOLLECTION_CLOSED_NO_CREDIT -> 28_OF_32 -> 24_OF_32 -> 25_OF_32 -> FINAL_32_OF_32_GREEN
FINAL_EXACT_SELECTORS / PASS = 32 / 32
IM02_TARGETED_SELECTORS / PASS = 7 / 7
RUNTIME_INTEGRATION_IDENTITY = EXACT17_FROZEN
PRODUCT_CREDIT / TECHNICAL_CREDIT = 0 / 0
IM03 / ACTIVATION / I09 / PRODUCTION / MERGE = NOT_STARTED / 0 / 0 / 0 / 0
API / DB / RN / PERSISTENCE / PROVIDER / NETWORK / FALLBACK / COST_EFFECT = 0 / 0 / 0 / 0 / 0 / 0 / 0 / 0
FULL_PUBLIC_REGRESSION = DEFERRED_TO_IM07_NOT_CLAIMED_AT_IM02
DESIGN_FINAL_SOURCE_MODIFICATION = 0
DESIGN_PR30_STATE = DRAFT_OPEN_UNMERGED_PENDING_PUSH
NEXT_DEPENDENCY = IM03
AUTOMATIC_PROGRESSION = false
```

失敗した各Gateは完了creditに使わず、final `32/32`だけをIM02 write gateとする。IM03のreading operation applicability／enumeration、I09、activation、production、mergeへは進んでいない。

## 11. Emlis入力固有意味決定 — 最終正典統合・実装入口（2026-08-29）

Mashのcurrent requestにより、遅延して到着したProレビュー列をinitial exact8、intermediate exact7、latest exact13へ分離し、正規設計書へ統合した。前回GitHub反映は非規範の修正案だけであり、正規設計書は未修正だった。今回、その修正案のeffective contentを正規設計書§19–§22へ統合し、修正案はcurrent treeから削除する。Git履歴は保持する。

最終正典は次の既存path exact1であり、別addendum／parallel proposalを参照しない。

```text
CANONICAL_DESIGN_PATH = Cocolon_前提資料/designs/cmee/Cocolon_CMEE_Stage1_Emlis_InputSpecificMeaningDecision_KarenDesigned_FinalTechnicalDesignAndImplementationOrder_20260828.md
CANONICAL_DESIGN_SHA256 = 167a0a4012f5e542d7cbc11fee25f067df929c1cf6d82fe9c927bef63d604ca8
CANONICAL_STATUS = FINAL_CANONICAL_IMPLEMENTATION_READY
CANONICAL_ADOPTION = ADOPTED_BY_MASH_CURRENT_REQUEST
NORMATIVE_IMPLEMENTATION_SECTIONS = 19_THROUGH_22
PARALLEL_PROPOSAL_CURRENT_TREE = 0
TECHNICAL_HANDOFF_REMAINING = EXACT0
```

current mashos-apiはIM02 complete checkpointのままであり、このdocs finalizationではruntime source／testを変更していない。次のactual implementationは、canonical §21のPacket Aをfresh mashos-api headへfreezeし、IM03–IM06 atomic development unitをIM03から開始する。write allowlist exact6、full46 lock＋locked wheelhouse acquisition exact1、focused new exact15／cumulative exact47、composition derivation exact0、mutation exact12、root v1.1 exact12、post-selection Stage1 exact38、candidate／Reception identityはcanonicalへ閉じてある。

```text
CURRENT_RUNTIME_IMPLEMENTATION = IM02_COMPLETE_NONTERMINAL
CURRENT_CANONICAL_NEXT_IMPLEMENTATION = PACKET_A_FRESH_PREIMAGE_FREEZE_THEN_IM03
IMPLEMENTATION_EXECUTION_IN_DOCS_FINALIZATION = NOT_STARTED
PRODUCT_READ / ACTIVATION / I09 / MERGE = 0 / 0 / 0 / 0
STRUCTURE_MAP_DELTA = CMEE_AUTHORITY_ROUTING_ONLY
AUTOMATIC_PROGRESSION = false
```

## 12. Current inheritance routing（2026-09-01）

本節はcurrent実装navigationについて§11よりfreshである。過去のIM02／IM03入口、Route A correction、Cycle001 recoveryは履歴として残すが、current workの再開点には使わない。

読むべきdisabled implementation seedはexact13である。従来exact11へ、`emlis_input_specific_meaning.py`と`emlis_stage1_composition.py`を加える。protected test laneは`test_cmee_nls_v3_batch001_unified_stage1_bridge.py`を含み、canonical100の各入力をcurrent candidate／meaning／contribution／depth authorityからfinal plan、existing final surface、Gate、final-body-only inverseまで通す。

owner順は次に固定する。

```text
input-specific meaning owner
  -> response orchestration
  -> composition = MEANING_PROJECTION_VALIDATION_ONLY_NO_FINAL_SURFACE_OWNER
  -> Grounded Observation Plan
  -> Grounded Sentence Plan + sentence realizer
  -> Human Reception + reception realizer
  -> final-body-only inverse + independent Gate
```

Cycle001 large moduleは`NOT_ADOPTED`であり、責務移管だけを行う。current product ownerの`adoption_state`は`IMPLEMENTED_NOT_ACCEPTED`、`IM10=MASH_PENDING`、`candidate_ready=false`である。production effect、cutover、merge、API、DB、RN、external generative AI、product-runtime network、fallback、automatic progressionは全て0のまま保持する。

current runtime evidenceはmashos-api Draft PR #3 head `4e8d397843c0381bc94379b71665cf71b80d7d1b`である。active identity payloadは18/18、product causal source ownerはexact9、canonical100はdirect 100/100およびouter generated-disabled 68／finite fail-closed 32である。historical exact17／IM06 approval freezeは遡及更新しない。

保存済み`system_context/current/cmee_working/**`は06ce時点の旧materializationであり、current profileは`STALE_FAIL_CLOSED`／`generated_context_consumable=false`に固定する。pinned SCIP Python／Node 20が無い環境では再生成をfail closedし、新headのformal contextとして消費しない。

## 13. IM10 Product Read NON_PASSと完成route（2026-09-02）

本節はcurrent商品判定と次の順路について§12よりfreshである。Mashはcurrent disabled exact8を確認し、観測構造が内部に存在することと、ユーザーへ届く文章が商品として成立することは別だと判断した。current候補は`NON_PASS`であり、IM10の`MASH_PENDING`は解消した。

```text
IM10 = NON_PASS
MASH_PRODUCT_READ = EVALUATED_NON_PASS_VISIBLE_RESPONSE_QUALITY_INSUFFICIENT
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
CANDIDATE_READY = false
PRODUCT_CREDIT = 0
PRODUCTION / CUTOVER / MERGE / API / DB / RN EFFECT = 0 / 0 / 0 / 0 / 0 / 0
CURRENT_IMPLEMENTATION_EXECUTION = NOT_STARTED
AUTOMATIC_PROGRESSION = false
```

current商品契約では、Layer 2「Emlisから」がユーザーの主本文であり、Layer 1「見えたこと」はその主本文が何を根拠にしたかを示す必要最小限の観測である。配分は文字数、文数、token数の固定quotaではなく、入力ごとの意味役割の比率として、観測1：フォロー9から観測4：フォロー6の範囲で動的に決める。日常の出来事や感情の受け取りは観測1〜3：フォロー9〜7、通常の悩みや自己理解は観測3〜4：フォロー7〜6、構造説明を明示的に求められた場合でも観測は最大4、フォローは最小6とする。観測0またはフォロー0にはしない。

旧資料に残る標準`観測6：フォロー4`および構造要求時`観測7：フォロー3`は、当時の履歴として保持するが、current EmlisAI商品routeには使用しない。§13／canonical 02 §35／06 §86はIM10 verdictと再開前historyを保持し、current meaning-to-expression routeはcanonical 02 latest §36が所有する。

完成routeは次の順である。

1. Round 0のLayer 1／2について、actual user-visible本文の共通原因を修正し、「見えたこと」を必要最小限へ、「Emlisから」を入力固有で会話として流れる主本文へする。
2. 華恋がbody-full private boundary内で代表入力の本文を読み、復唱、label置換、定型文、generic follow、同義反復、深さ不足が残る間はMashへ提示せず、同じproduct-causal unit内で修正する。
3. actual before／afterをMashへ提示し、Round 0のProduct Readを受ける。Mashの明示PASSまではquestion実装へ進まない。
4. Round 0 PASS後のfresh explicit startで、Freeの重要な問い0..1をend-to-endで実装する。original inputとは別sourceとしてsupplemental answerを保存し、その回答を根拠にLayer 1／2をrefineする。既存API／DB／Supabase／RN契約を確認し、必要な既存経路だけを変更する。
5. Plus／PremiumのLayer 3と複数roundは、Round 0およびFree一問end-to-endの後に別判断で扱う。

これは新しい並列設計書を作るrouteではない。本段落は§13 historyとして保持し、current ownerはlatest §14、canonical 02 §36、06 §87、final canonical §24である。構造地図はactual owner change反映前のcurrent_structure 01 §19と04 §32である。各実装unitはactual visible outputの非0改善、必要なtest、GitHub checkpoint、fresh remote verificationまでを同じ単位で完了し、framework、document、test、internal proofだけで完了またはproduct creditとしない。

本2026-09-02反映はapproved商品判断と再開順を既存ownerへ保存する`ADMINISTRATIVE_ONLY`である。runtime、test、private generation、API、DB、Supabase、RN、production、System Context生成物は変更しておらず、次実装は新しいsessionの明示開始指示まで開始しない。

## 14. Realizable Reception expression Work Stage 1 routing（2026-09-04）

本節はcurrent Work Stage 1のnavigationについて§13よりfreshである。root causeは`SELECTED_MEANING_TO_GRAMMATICALLY_REALIZABLE_HUMAN_RECEPTION_EXPRESSION_CONTRACT_ABSENT`であり、current capabilityは`SOURCE_GROUNDED_REALIZABLE_RECEPTION_EXPRESSION_CONTRACT`である。

読む順は次へ固定する。

1. canonical 02 latest §36 — sole expression contract、asset disposition、Human Reception／Sentence Surface owner境界。
2. canonical 06 latest §87 — Phase 0–4、verification、success／STOP、GitHub checkpoint順。
3. final canonical latest §24 — pre-IM10診断の補正、current precedence、private schema／product境界。
4. current_structure 01 latest sectionおよび04 latest section — actual runtime実装後にのみ更新するcurrent map。

current routeは、selected meaningを再選択せず、late selected final plan Move（required全数と存在するplan-owned optionalを含む）ごとにrequest-local private expression exact1を作り、Human Receptionをfinal Layer 2 sole author、Sentence Surfaceをarrangement-onlyにする。Move identity／dutyをexpressionより先に読むのはexact-cover keyの確定だけで、正規因果順はselected meaning→expression→Move consumeである。前回bounded focus selector authorityは消費済みterminal STOPであり、同名・別名・別helperで反復しない。old composer、old case-frame route、large NLS route、`compose_stage1_from_projection()`をactive化しない。

```text
AUTHORITY = FRESH_MASH_LEVEL3_CMEE_WORK_STAGE1_REALIZABLE_RECEPTION_EXPRESSION_CANONICAL_INTEGRATION_AND_HUMAN_RECEPTION_BODY_CLOSURE_20260904
PHASE1 = DESIGNED_NOT_IMPLEMENTED
PRIVATE_BODY_PUBLICATION = 0
PRODUCT / TECHNICAL CREDIT = 0 / 0
PUBLIC PRODUCT ROUTE / API / DB / SUPABASE / RN / PERSISTENCE / PRODUCTION / MERGE EFFECT = 0
NEXT_EXACT_ACTION = IMPLEMENT_FINAL_MOVE_TO_EXPRESSION_TO_HUMAN_RECEPTION_BODY
AUTOMATIC_PROGRESSION = false
```

## 15. Realizable Reception expression Work Stage 1 scope terminal STOP（2026-09-04）

本節はcurrent lifecycle、state、next actionについて§14よりfreshである。§14は採択時のplanned routeとして履歴保持するが、runtime実装をnext actionとする記載はcurrentではない。

canonical100のfull-body確認により、Layer 1のprospective-action判定とLayer 2のperformed／nonfuture判定が同じaction nucleusを所有するcross-layer conflictが確定した。詳細なevidence ownerはcanonical 02 §37、execution dispositionはcanonical 06 §88、final precedenceはfinal canonical §25とする。

```text
CURRENT_WORK_STAGE1 = SCOPE_TERMINAL_STOP
CURRENT_PRODUCT_OWNER_ADOPTION_STATE = IMPLEMENTED_NOT_ACCEPTED
CANDIDATE_RETAINED = false
CANDIDATE_READY = false
MASH_ROUND0_PRODUCT_READ_READY = false
PRIVATE_BODY_PUBLICATION = 0
PRODUCT / TECHNICAL CREDIT = 0 / 0
PUBLIC PRODUCT ROUTE / API / DB / SUPABASE / RN / PERSISTENCE / PRODUCTION / MERGE EFFECT = 0
NEXT_REQUIRED_ACTION = FRESH_MASH_DECISION_EXACT1
AUTOMATIC_PROGRESSION = false
```

fresh Mash decisionは、Layer 1 visible byte parityを緩和してsame-nucleus statusを整合させるか、Layer 1 parityを維持してprospective contentとperformed actionを別nucleusへbindするupstream split ownerを承認するかのexact1である。決定前にHuman Reception、Gate、別helper、renameまたは局所規則で再試行しない。

current read orderは本§15、canonical 02 §37、canonical 06 §88、final canonical §25とする。


## Current authorized work — same-nucleus status alignment（2026-09-04）

Mash approved `FRESH_MASH_LEVEL3_CMEE_STAGE1_SAME_NUCLEUS_STATUS_ALIGNMENT_WITH_LAYER1_PARITY_RELAXATION_20260904`. Current contract is 02 §38, current execution is 06 §89, and schema/identity remains in 05. Prior 02 §37 / 06 §88 is the closed rejected/rolled-back predecessor. Layer1 may change only for source-grounded status alignment and necessary language; both layers and all100 quality must be verified in the same unit. No Product Read readiness, adoption, merge or production is yet claimed.

Current execution is `BLOCKED_AVAILABILITY_CONSTRAINT_UNFINISHED`: source-faithful removal of unsupported sensation changes the unchanged outer body verdict, conflicting with required per-input 68/32 parity. See canonical 06 §89 and the existing runtime handoff. The reliable all100 probe was read in full and was NOT_CLEAR; latest source verification and quality repair remain incomplete. No acceptance, Product Read readiness or production effect follows.

Current state superseding the preceding boundary checkpoint: `IN_PROGRESS_APPROVED_SOURCE_FIDELITY_EXCEPTION`. Mash approved only UNAVAILABLE→GENERATED caused by removal of unsupported meaning under unchanged strict checks. Canonical 02 §38 / 06 §89 own the exception and continued same-unit correction; all100 CLEAR and product readiness remain pending.
