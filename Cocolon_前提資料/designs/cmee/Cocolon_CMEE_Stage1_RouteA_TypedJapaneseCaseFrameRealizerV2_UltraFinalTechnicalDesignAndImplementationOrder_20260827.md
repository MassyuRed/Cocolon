# Cocolon CMEE Stage 1 — Route A Typed Japanese Case-Frame Realizer v2

## Ultra華恋 final technical design（Pro華恋 review反映・Mash最終承認・session-safe実装順統合）

| 項目 | 値 |
|---|---|
| DOCUMENT_ID | CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_FINAL_TECHNICAL_DESIGN_AND_IMPLEMENTATION_ORDER_20260827 |
| DOCUMENT_KIND | MASH_APPROVED_FINAL_TECHNICAL_DESIGN_WITH_SESSION_SAFE_IMPLEMENTATION_ORDER |
| STATUS | FINAL_DESIGN_APPROVED_IMPLEMENTATION_NOT_STARTED |
| DECISION_LEVEL | FRESH_LEVEL_3_FINAL_DESIGN_APPROVED_BY_MASH |
| DESIGN_DISPOSITION | MASH_ACCEPTED_ROUTE_A_BOUNDED_FINAL_DESIGN |
| SOURCE_CORRECTED_V2_DOCUMENT_ID | CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_CORRECTED_FINAL_20260827_V2 |
| SOURCE_CORRECTED_V2_SHA256 | 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de |
| PROPOSED_BOUNDED_UNIT_ID | cocolon.cmee.stage1.route_a.typed_japanese_case_frame_realizer.20260826.v1 |
| SOLE_ROUTE | ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER |
| PREDECESSOR_UNIT | cocolon.cmee.stage1.additional_correction.route_a.20260824.v1 |
| PREDECESSOR_STATE | COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP / 2_OF_2_IMMUTABLE |
| INITIAL_REVIEW_RUNTIME_HEAD | MassyuRed/mashos-api@50d6457f73a72159a0672258f0f6a05f81eccb33 |
| INITIAL_REVIEW_DESIGN_HEAD | MassyuRed/Cocolon@abe622198a4f951d6e17be3d591707746343cd91 |
| REVIEWED_INITIAL_BODY_SHA256 | 549ec2e36e3c170555c6d146e86fbee16a1a7300c5f1899f4210486306cb7671 |
| PRO_REVIEW_ID | CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_PRO_SINGLE_REVIEW_20260827_V1 |
| PRO_REVIEW_FILE_SHA256 | bdbe49ded6d6e476d57f3d9a41c652f22893618023376281c81e4cf371a70825 |
| PRO_REQUIRED_CHANGE_COUNT / APPLIED | 9 / 9 |
| PRO_REVIEW_APPROVES_UNSEEN_ULTRA_FINAL_BODY | false |
| PRO_FINAL_CHECK_ID | CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_PRO_FINAL_CHECK_20260827_V1 |
| PRO_FINAL_CHECK_FILE_SHA256 | 1b49a316cdeaa6d364b52741caef1634b8f692223c131535ee9460b79e156315 |
| PRO_FINAL_CHECK_REVIEWED_BODY_SHA256 | b48e879427a74fddc7154e41d3e8a087576b6f2b8088849e7a552f0033e8d32e |
| PRO_FINAL_CHECK_REQUIRED_CHANGE_COUNT / ULTRA_APPLIED | 1 / 1 |
| PRO_FINAL_CHECK_APPROVES_UNSEEN_CORRECTED_V2 | false |
| PRO_DELTA_FINAL_CHECK / READ / REREAD | NOT_RUN / 0 / 0 |
| PRO_VERIFIED_CURRENT_BODY_CLEAR | false |
| PRO_DELTA_PREREQUISITE_FOR_MASH_APPROVAL | SUPERSEDED_BY_MASH_DIRECT_FINAL_DECISION / NOT_PRO_CLEAR |
| MASH_FINAL_DECISION_ID | COCOLON_CMEE_ROUTE_A_V2_FINAL_DESIGN_AND_SESSION_ORDER_APPROVAL_20260827 |
| MASH_LEVEL_3_DESIGN_APPROVAL | APPROVED |
| MASH_APPROVED_SCOPE | SOURCE_V2_SHA256 + SESSION_SAFE_IMPLEMENTATION_ORDER + FINAL_GITHUB_DOCS_REFLECTION |
| ULTRA_FINAL_TECHNICAL_VERDICT | STEPWISE_IMPLEMENTATION_READY_UNDER_EXPLICIT_PER_STEP_START |
| IMPLEMENTATION_PLAN_AUTHORITY / CURRENT_IMPLEMENTATION_EXECUTION | APPROVED / NOT_STARTED |
| SESSION_SAFE_IMPLEMENTATION_ORDER / SHA256 | I00–I14 exact15 / 0d6fb8cb123669d37d4a6801225f9995ea6ff3765900c6fb460e7592f1bba7b6 |
| CURRENT_AUTHORIZED_NEXT_STEP | I00_AFTER_FRESH_EXPLICIT_STEP_START |
| STEP_4_1_AUTHORITY | 0 |
| PRODUCT_PASS / CURRENT_ACTIVATION | 0 / 0 |
| EXTERNAL_AI / PROVIDER / RUNTIME_EXTERNAL_NETWORK / FALLBACK | 0 / 0 / 0 / 0 |
| GITHUB_REFLECTION_SCOPE / IMPLEMENTATION / PRODUCTION_EFFECT_IN_THIS_WORK | COCOLON_DOCS_EXACT4 / 0 / 0 |
| PRIVATE_BODY_READ_OR_GENERATION_IN_THIS_WORK | 0 |
| SYSTEM_CONTEXT_V1 | NOT_REQUIRED_CURRENT_SCOPE_NAVIGATION_ONLY |
| AUTOMATIC_PROGRESSION | false |

本書は、Ultra initial bodyに対するPro華恋のsingle review exact1を反映したV1 bodyへ、Pro final check exact1のblocker `PRO-FINAL-REQ-B01 CLOSED_GRAMMAR_MANIFEST_LANGUAGE_NONCLEAR` を反映したcorrected V2を、Mashがsource SHA-256を固定して最終設計として直接承認し、処理落ちを避けてStepごとにsessionを切り替えられる実装順を統合したfinal documentである。初回required change exact9とfinal-check blocker exact1はUltra ownerの `RESOLVED_BY_APPLIED_CHANGE` だが、Proがcorrected V2または本final documentを読んでCLEARを出したとは扱わない。Pro delta final checkは `NOT_RUN / READ 0 / REREAD 0` の歴史事実のまま、Mashの直接判断が旧approval prerequisiteだけをsupersedeした。設計は承認済みだが、実装は未開始であり、各StepはMashの明示的な開始指示後にexact1ずつ実行する。

---

## 0. 結論

中心方針は維持する。現行Route Aの文字列seamを、述語が格支配、補文、活用、reference、linkを一体所有するtyped Japanese case-frame realizerへ置換する。

    existing typed meaning
    → clause intent
    → predicate-owned case frame exact1
    → atomic predicate head exact1
    → typed argument / complement / source / reference / link / morphology plan
    → JapaneseClauseIR
    → sole linearization exact1

Pro required change exact9に加え、final-check blocker exact1を反映した主な差分は次である。

1. runtime behavior変更前のbaseline formal exact8と、activation後のafter formal exact8を同一formal identityでpair化する。
2. v2 grammar inventoryをexact count、closed row、canonical digest、mutation exact273で固定する。
3. SourceLeafTokenのshape、realization mode、delimiter／terminal／byte ownerをclosed setにする。
4. case-frame選択とatomic head選択を分離し、head alternateを作らない本案では利用不能なhead repetition preferenceを削除してnamed STOPへ移す。
5. N2で全language behaviorを完成し、N4は compile_stage1_response body exact1だけを切り替える。
6. changed-path envelopeをmashos-api exact7＋Cocolon exact5＝exact12へ修正する。
7. Product Readをcurrent exact8／exact12／Mash overall PASS|FAILへ戻し、新しい数値scoreを0にする。
8. estimateを作業別とearly STOP別に分ける。
9. baseline、early、after、Mash-presented pairのset／attempt／read／retentionを別identityにする。
10. F10／F13／F15／F21のpredicate-owned grammarを自然な格・補文・modifierへ修正し、placeholder sourceを用いたframe surface skeleton exact22を全文human pre-screenする。
11. N0–N6をsemantic gateとして保持しつつ、実作業をI00–I15のsession Step exact16へ分割し、各Stepをsingle-repository remote checkpointで閉じる。

本書は旧Step 3のretry、counter reset、第三のgeneric correction、Step 4.1、Route B、Product PASSの事前承認ではない。旧counter 2/2は不変であり、本案はMashが最終設計として承認したfresh sibling successor unit exact1である。I00–I15は同じbounded unitの継続点であって独立成果ではなく、各Stepの開始はautomaticではない。

---

## 1. canonical state、権限、参照境界

### 1.1 current state

Cocolon v1/06_implementation_order_migration_and_verification.md §61–§62をcurrent lifecycle ownerとする。

- Pro result: COMMON_DEFECT
- defect class: NON_IDIOMATIC_SURFACE
- cause component: GROUNDED_JAPANESE_COMPOSER
- route-level ceiling observed: false
- Ultra known technical result: NOT_CLEAR
- machine known／withheld: CLEAR
- predecessor early actual RUN／RETRY／RERUN: 1／0／0
- predecessor Ultra known4 READ／REREAD: 1／0
- predecessor Pro known4＋withheld4 READ／REREAD: 1／0、COMMON_DEFECT
- predecessor formal exact8: NOT_RUN
- transition: COMMON_DEFECT_RETURN_BUDGET_EXHAUSTED_STOP
- common-defect return count: 2/2 immutable
- Step 3: terminal closed
- Step 4.1 precondition: false
- final design: Mash LEVEL_3 direct approval complete
- current implementation execution: NOT_STARTED
- current authorized next Step: I00 after fresh explicit Step-start instruction
- future implementation route: approved successor unitのRoute A providerless-only Step 0–14

predecessor master／auxiliaryは ACTIVE_CLEANUP_SUCCEEDED_MOVED_TO_LIBRARY_TRASH、active search absentとして記録され、PHYSICAL_ERASURE_CLAIM=0である。retained frozen input exact1の旧境界は STEP7_REUSE_ONLY_AFTER_FRESH_LEVEL_3 だった。Mashの本final decisionは、同じretained inputを本successorの `SUCCESSOR_EARLY_LANGUAGE_SET_EXACT8_EXACT1_ONLY` へ限定rebindした。存在またはrebindは再生成、再読、Step開始、counter遷移、Product PASSを自動承認せず、利用は§20 Step 6のfresh preflight後のexact1 runだけである。identity／digest／retention不一致は `RETAINED_INPUT_AUTHORITY_STOP`。

### 1.2 review headとfuture base headを分ける

50d6457f…とabe62219…はinitial bodyとPro reviewを照合した review-time heads であり、承認済みfinal designの実装base headsを先取りしない。I00の効果発生前にfresh remote postverifyし、次を新たにbindする。

    BASELINE_RUNTIME_HEAD = fresh approved PR #3 head
    BASELINE_DESIGN_HEAD = fresh approved PR #30 head
    FINAL_TECHNICAL_BODY_SHA256 = this final file SHA-256
    HEAD_DRIFT_FROM_REVIEW_TIME = explicitly assessed

review-time headから一byteでもdriftがあり、本設計、formal fixture、axes、language owner、path envelopeへ影響する場合は EFFECT_BEFORE_HEAD_DRIFT_STOP。黙ってreview headをbase headとして扱わない。unrelated HEAD advanceだけはtarget preimageとrelevant dependency identityをfresh再確認してrebindできる。

### 1.3 System Context v1

PR #37のSystem Context v1はnavigation-onlyであり、今回のtechnical owner、lifecycle owner、current structure exact2を置換しない。本作業はcanonical filesを直接照合して閉じるため使用不要である。将来path discoveryに使う場合も、設計内容やapprovalのauthorityにはしない。

### 1.4 不変範囲

- Route A exact1
- external AI、composer service、provider、network、body send、new dependency、fallback、external costはすべて0
- public API、DB、RN、persistence、production routeは変更0
- Cycle、question lifecycle、Layer 3、Piece、Analysisは変更0
- upstream meaning extraction、source kernel、Safety、unknown policyは現時点で変更0
- project_subjective_meaning_plan、project_stage1_discourse_arc、compose_stage1_from_projection、normalize_to_normal_form、derive_discourse_preference_profileと既存reducer／rank authorityをsole Step 2 ownerとして維持
- current activation、candidate-ready、technical credit、Product creditは0
- final design readyは1、implementation execution、test execution、private generation、merge／ready／production effectは0

### 1.5 SubjectivePropositionV2境界

SubjectivePropositionV2はrequest-local private nested contractとしてのみ扱い、public request／response schema、DB、persistent record、別meaning ownerへ昇格しない。subjective predication partition exact5は AFFECT、APPRAISAL、MATERIAL_VALUE、RELATIONAL_STANCE、BOUNDED_COUNTERPOSITION で閉じる。dual read、dual write、legacy proposition fallback、第二のsemantic selectorは0である。

---

## 2. Pro reviewの事実とchange disposition exact10

### 2.1 Pro reviewの実結果を保持する

    INITIAL_DESIGN_DISPOSITION = SUPPORTS_WITH_REQUIRED_CHANGES
    PRO_REVIEW_APPROVES_UNSEEN_ULTRA_FINAL_BODY = false
    ROOT_CAUSE_ASSESSMENT = AGREED
    COMPOSER_ONLY_SCOPE = AGREED
    CASE_FRAME_DESIGN = NONCLEAR
    ANTI_TEMPLATE_BOUNDARY = NONCLEAR
    NORMAL_FORM_AND_RANK = NONCLEAR
    VERIFICATION_BOUNDARY = NONCLEAR
    PATH_ENVELOPE = NONCLEAR
    BLOCKER_COUNT = 1
    MAJOR_COUNT = 6
    MINOR_COUNT = 2
    INITIAL_PRO_REVIEW_MASH_APPROVAL_RECOMMENDATION = RECOMMEND_AFTER_ULTRA_FINAL

この初回reviewが全設計の再reviewを不要としたことは、後から具体化されたclosed grammar rowsや未読bodyをPro CLEARとした意味ではない。実際にV1の具体的なsurface skeletonを読んだfinal checkでは、次のblocker exact1が成立した。

### 2.2 Pro final checkの実結果

    PRO_FINAL_CHECK_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_PRO_FINAL_CHECK_20260827_V1
    REVIEWED_V1_DOCUMENT_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_FINAL_20260827_V1
    REVIEWED_V1_SHA256 = b48e879427a74fddc7154e41d3e8a087576b6f2b8088849e7a552f0033e8d32e
    READ / REREAD = 1 / 0
    IDENTITY_AND_HASH_VERIFICATION = PASS
    PRO_REQUIRED_CHANGE_DISPOSITION_9_OF_9 = VERIFIED
    REVIEWED_V1_DISPOSITION_SHA256_VERIFIED = d1d3b201d90392165b8b44baad6e811d239c333bba03824a5266a260a136a02a
    REVIEWED_V1_GRAMMAR_INVENTORY_SHA256_VERIFIED = c9dc32458d9c1ba17698eb9c59f7a7607de8922898a3b8c0fff10235ea164bda
    GITHUB_HEAD_DRIFT = 0
    FINAL_CHECK_DISPOSITION_FOR_REVIEWED_V1 = CORRECTION_REQUIRED_BEFORE_MASH_APPROVAL
    MASH_APPROVAL_RECOMMENDATION_FOR_REVIEWED_V1 = DO_NOT_APPROVE_REVIEWED_V1_SHA
    REVIEWED_V1_BLOCKER_COUNT = 1
    REVIEWED_V1_BLOCKER = PRO-FINAL-REQ-B01 CLOSED_GRAMMAR_MANIFEST_LANGUAGE_NONCLEAR

この結果はreviewed V1へbindしたNONCLEARであり、未読V2へのPro verdictではない。Proは、F10の「内容が閉じていません」、F15の「内容を結論づける」、F21の「内容を断定する」、F13の「一方にまとめる」を具体的に指摘し、predicate-owned grammar rowとして修正した後、changed rows、派生count／hash、fresh final SHAだけをdelta final check exact1すれば足りると定めた。本書はそのbounded correctionであり、Route、public schema、upstream meaning、external dependencyを広げない。

### 2.3 initial disposition ledger exact9（historical immutable）

| Pro required change | Disposition | Ultra final resolution | Final section |
|---|---|---|---|
| PRO-REQ-B01 BEFORE_AFTER_PRODUCT_EVIDENCE | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §14–§16 |
| PRO-REQ-M01 CLOSED_GRAMMAR_INVENTORY_AND_MIGRATION | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §5、§9、§13 |
| PRO-REQ-M02 SOURCE_LEAF_REALIZATION_BOUNDARY | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §6 |
| PRO-REQ-M03 FRAME_UNIQUENESS_AND_LEXICAL_VARIATION | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §7、§10 |
| PRO-REQ-M04 LANGUAGE_IDENTITY_AND_ACTIVATION_BOUNDARY | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §8、§11、§15 |
| PRO-REQ-M05 CANONICAL_PATH_ENVELOPE | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §12 |
| PRO-REQ-M06 PRODUCT_READ_CONTRACT_AND_DENOMINATOR | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §16 |
| PRO-REQ-N01 ESTIMATE_ASSUMPTIONS | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §18 |
| PRO-REQ-N02 ATTEMPT_AND_SET_NAMING | APPLIED | RESOLVED_BY_APPLIED_CHANGE | §14–§15 |

Canonical ledger payloadは次のexact9行である。BEGIN／END markerとMarkdown表示用先頭4-spaceはhash対象外、各payload行は表示文字のまま、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。

    BEGIN_ULTRA_FINAL_CHANGE_DISPOSITION_V1
    PRO-REQ-B01|APPLIED|RESOLVED_BY_APPLIED_CHANGE|14,15,16
    PRO-REQ-M01|APPLIED|RESOLVED_BY_APPLIED_CHANGE|5,9,13
    PRO-REQ-M02|APPLIED|RESOLVED_BY_APPLIED_CHANGE|6
    PRO-REQ-M03|APPLIED|RESOLVED_BY_APPLIED_CHANGE|7,10
    PRO-REQ-M04|APPLIED|RESOLVED_BY_APPLIED_CHANGE|8,11,15
    PRO-REQ-M05|APPLIED|RESOLVED_BY_APPLIED_CHANGE|12
    PRO-REQ-M06|APPLIED|RESOLVED_BY_APPLIED_CHANGE|16
    PRO-REQ-N01|APPLIED|RESOLVED_BY_APPLIED_CHANGE|18
    PRO-REQ-N02|APPLIED|RESOLVED_BY_APPLIED_CHANGE|14,15
    END_ULTRA_FINAL_CHANGE_DISPOSITION_V1

    PRIOR_V1_ULTRA_FINAL_CHANGE_DISPOSITION_SHA256 = d1d3b201d90392165b8b44baad6e811d239c333bba03824a5266a260a136a02a

上記exact9 payloadとdigestは、Pro final checkが9/9 VERIFIEDとしたV1 provenanceとして変更しない。

### 2.4 corrected V2 disposition ledger exact10（historical immutable）

| Source requirement | Ultra corrected disposition | Current Pro verification | Corrected section |
|---|---|---|---|
| PRO-REQ-B01 BEFORE_AFTER_PRODUCT_EVIDENCE | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §14–§16 |
| PRO-REQ-M01 CLOSED_GRAMMAR_INVENTORY_AND_MIGRATION | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §5、§9、§13 |
| PRO-REQ-M02 SOURCE_LEAF_REALIZATION_BOUNDARY | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §6 |
| PRO-REQ-M03 FRAME_UNIQUENESS_AND_LEXICAL_VARIATION | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §7、§10 |
| PRO-REQ-M04 LANGUAGE_IDENTITY_AND_ACTIVATION_BOUNDARY | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §8、§11、§15 |
| PRO-REQ-M05 CANONICAL_PATH_ENVELOPE | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §12 |
| PRO-REQ-M06 PRODUCT_READ_CONTRACT_AND_DENOMINATOR | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §16 |
| PRO-REQ-N01 ESTIMATE_ASSUMPTIONS | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §18 |
| PRO-REQ-N02 ATTEMPT_AND_SET_NAMING | APPLIED | VERIFIED_ON_V1_BY_PRO_FINAL_CHECK | §14–§15 |
| PRO-FINAL-REQ-B01 CLOSED_GRAMMAR_MANIFEST_LANGUAGE_NONCLEAR | APPLIED_BY_ULTRA | PRO_DELTA_FINAL_CHECK_PENDING | §5–§8、§13、§19 |

Canonical payloadは次のexact10行である。BEGIN／END markerとMarkdown表示用先頭4-spaceはhash対象外、各payload行は表示文字のまま、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。

    BEGIN_ULTRA_CORRECTED_FINAL_CHANGE_DISPOSITION_V2
    PRO-REQ-B01|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|14,15,16
    PRO-REQ-M01|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|5,9,13
    PRO-REQ-M02|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|6
    PRO-REQ-M03|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|7,10
    PRO-REQ-M04|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|8,11,15
    PRO-REQ-M05|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|12
    PRO-REQ-M06|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|16
    PRO-REQ-N01|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|18
    PRO-REQ-N02|APPLIED|VERIFIED_ON_V1_BY_PRO_FINAL_CHECK|14,15
    PRO-FINAL-REQ-B01|APPLIED_BY_ULTRA|PRO_DELTA_FINAL_CHECK_PENDING|5,6,7,8,13,19
    END_ULTRA_CORRECTED_FINAL_CHANGE_DISPOSITION_V2

    ULTRA_CORRECTED_FINAL_CHANGE_DISPOSITION_SHA256 = 7b3f920bbd4c6661a92df1b3d93df6c92f0df637a141a2b6207b63bd713ef5d9
    HISTORICAL_V2_ULTRA_TECHNICAL_VERDICT = RECOMMEND_PRO_DELTA_FINAL_CHECK

上記exact10とdigestはcorrected V2固定時点のreview lifecycleであり、current Mash decisionによって本文を書き換えない。`PRO_DELTA_FINAL_CHECK_PENDING` は当時の状態を示し、currentでPro CLEARになったことを意味しない。

### 2.5 Mash final approval ledger exact10

Mashは、corrected V2のexact bytesと、処理落ちを避けるためのsession-safe実装順追加、Cocolon Draftへのfinal docs反映を直接承認した。これはPro deltaを実施済みまたはCLEARとする判断ではない。旧Pro-delta prerequisiteのうちMash approval gateだけをMashの直接判断でsupersedeし、実装後のPro early／formal readとMash Product Readは維持する。

Canonical payloadは次のexact10行である。BEGIN／END markerとMarkdown表示用先頭4-spaceはhash対象外、各payload行は表示文字のまま、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。

    BEGIN_MASH_FINAL_DESIGN_APPROVAL_V1
    MASH_APPROVAL|SOURCE_V2|4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de|ACCEPTED
    MASH_APPROVAL|PRO_DELTA|NOT_RUN_READ0_REREAD0|NOT_PRO_CLEAR
    MASH_APPROVAL|OLD_PRO_DELTA_PREREQUISITE|SUPERSEDED_BY_DIRECT_MASH_DECISION|APPROVAL_GATE_ONLY
    MASH_APPROVAL|FINAL_DELTA|SESSION_SAFE_IMPLEMENTATION_ORDER_I00_I14|APPROVED
    MASH_APPROVAL|GITHUB_PUBLICATION|COCOLON_DOCS_EXACT4|APPROVED
    MASH_APPROVAL|IMPLEMENTATION_PLAN|ROUTE_A_SUCCESSOR_UNIT|APPROVED
    MASH_APPROVAL|IMPLEMENTATION_EXECUTION|NOT_STARTED|NEXT_I00_EXPLICIT_START
    MASH_APPROVAL|OLD_STEP3_COUNTER|2_OF_2_IMMUTABLE|NO_RESET_OR_INCREMENT
    MASH_APPROVAL|STEP4_1_PRODUCT_PASS_ACTIVATION|0_0_0|NOT_PREAPPROVED
    MASH_APPROVAL|AUTOMATIC_PROGRESSION|FALSE|PER_STEP_EXPLICIT_START
    END_MASH_FINAL_DESIGN_APPROVAL_V1

    MASH_FINAL_DESIGN_APPROVAL_SHA256 = a4052f3bb4744107b7740f219733275679dbc38fecbb79fb8d292bcfbf6044eb
    SESSION_SAFE_IMPLEMENTATION_ORDER_SHA256 = 0d6fb8cb123669d37d4a6801225f9995ea6ff3765900c6fb460e7592f1bba7b6
    FINAL_IMPLEMENTATION_ORDER = I00_I14_EXACT15
    CURRENT_IMPLEMENTATION_EXECUTION = NOT_STARTED
    CURRENT_AUTHORIZED_NEXT_STEP = I00_AFTER_FRESH_EXPLICIT_STEP_START
    ULTRA_FINAL_TECHNICAL_VERDICT = STEPWISE_IMPLEMENTATION_READY_UNDER_EXPLICIT_PER_STEP_START

---

## 3. root causeとminimal scope

### 3.1 grounded cause

現行コードでは、typed meaningから ClausePlan まではsemantic kind、valency、role、polarity、modality、time、relation、speakerを保持する一方、最後に次のownerが別々に完成度の高い文字列を返す。

1. ConstructionSpecのgeneric particle
2. ExpressionAssetSpecのpredicate fragment
3. sourceの広い「…」ということ化
4. scalar／relation carrier
5. startswith、endswith、substring、terminal inspectionによるseam repair

格、補文、活用、係り先、節接続をpredicateが一体所有しないため、machine invariantがGREENでも複数body共通のNON_IDIOMATIC_SURFACEが残り得る。ProがROOT_CAUSE_ASSESSMENTとCOMPOSER_ONLY_SCOPEをAGREEDとした点を維持する。

### 3.2 least-expansive change

OBSERVED_BLOCKER_MINIMAL_FIXとする。最初から emlis_ai_grounded_observation_plan.py、public semantic schema、source parserを変更しない。actual validationでsource本文のcertified inflectionが不可欠と判明した場合は、composerへsuffix branchを足さず SOURCE_REALIZATION_CAPABILITY_GAP_STOP とし、別LEVEL_3へ返す。

### 3.3 禁止selector

frame、complement、head、rank、repairのselectorへ次を入力しない。

- raw source、source suffix／substring、regex
- case ID、fixture ID／family、input hash
- expected text、finished phrase、finished clause／sentence
- prior output text、human verdict、private body identity

selector signatureまたはregistry valueにこれらが入った時点で LANGUAGE_CORE_ANTI_TEMPLATE_REGISTRY_STOP。rendered textを意味としてreparseしない。

---

## 4. v2 ownership model

### 4.1 private runtime types

| Type | Sole ownership | Non-ownership |
|---|---|---|
| GroundedExpressionPlan | existing semantic refs、predicate kind、source／matrix scope | new meaning、raw selector |
| PredicateSenseSpec | existing semantic sense、frame license、atomic head ref | finished phrase、case ID |
| JapaneseCaseFrameSpec | slots、roles、case particles、complement、topic／zero、morphology license | free phrase、source content |
| SourceLeafToken / SourceLeafGroup | EvidenceRef-bound literal bytes、shape witness、ordered cardinality | semantic parse、public serialization |
| SourceComplementPlan | mode、group、delimiter／marker／classifier／slot refs | suffix inference |
| ArgumentRealizationPlan | slot binding exact1、case owner、provenance | semantic ref replacement |
| DiscourseReferenceStateRow | antecedent、competitor、focus、speaker、establishment proof | fuzzy text matching |
| ClauseLinkPlan | admitted relation、placement、token owner | invented cause／contrast |
| PredicateMorphologyPlan | head、aspect／time、polarity、modal、politeness、terminal order | source inflection guess |
| JapaneseClauseIR | argument、source、reference、link、morphology、semantic digest | rendered text reverse parse |
| LinearizedJapaneseClause | textと同時生成したClauseFrame、RealizedSemanticBinding、SurfaceDerivation | post-hoc ledger |
| JapaneseLocalPreferenceProfile | typed local comparison tuple | naturalness score |

全typeはrequest-local private。runtime追加row、plugin row、remote rowは0である。

### 4.2 ownership cardinality

- semantic meaning owner exact1: existing projection
- case frame owner exact1: JapaneseCaseFrameSpec
- case particle owner exact1: selected frame slot
- complement owner exact1: SourceComplementPlan
- predicate head owner exact1: selected PredicateSenseSpec → AtomicPredicateHeadSpec
- morphology owner exact1: PredicateMorphologyPlan
- relation display owner exact1: ClauseLinkPlanまたはframe-internal、両方は不可
- reference／topic／zero owner exact1: DiscourseReferenceStateRow＋registered rule
- text owner exact1: linearize_japanese_clause
- active facade exact1: compile_stage1_response

0件または2件以上はlinearization前STOP。legacy、shadow、dual-run、quote-loop、synonym fallbackへ進まない。

---

## 5. closed grammar inventory v2

### 5.1 frozen counts

| Registry | Exact rows |
|---|---:|
| PredicateSenseSpec | 17 |
| JapaneseCaseFrameSpec | 22 |
| PredicateSense-to-frame license | 22 |
| AtomicPredicateHeadSpec | 22 |
| LexicalFamilySpec | 22 |
| ComplementRuleSpec | 8 |
| SenseComplementLicense | 22 |
| SourceRealizationMode | 5 |
| SourceClassifierSpec | 5 |
| SourceFunctionalTokenSpec | 3 |
| SourceFunctionalModifierSpec | 3 |
| SourceQuoteDelimiterRule | 4 |
| CaseParticleRule | 42 |
| CaseParticleSurfaceVariant | 59 |
| InflectionClassSpec | 6 |
| MatrixMorphologyParadigmSpec | 22 |
| ClauseLinkRule | 10 |
| ReferenceZeroTopicRule | 12 |
| JapaneseLocalPreferenceRule | 7 |

この表のcountはminimumやrangeではない。N2 implementationのfresh registry canonical bytesが下記manifestとliteral equalでなければ GRAMMAR_INVENTORY_MANIFEST_DRIFT_STOP。runtime row additionは0。

### 5.2 canonical registry manifest

Canonicalizationは BEGIN_V2_GRAMMAR_INVENTORY_V1 の次の行から END_V2_GRAMMAR_INVENTORY_V1 の直前までを、表示順、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。BEGIN／END markerとMarkdown表示用先頭4-spaceはhash対象外である。各payload行の縦棒はfield delimiterであり、payload自体の空白trimはしない。

    BEGIN_V2_GRAMMAR_INVENTORY_V1
    SENSE|S01|OBSERVE_CENTER|GROUNDED_PREDICATE|center|F01
    SENSE|S02|OBSERVE_CENTER|GROUNDED_PREDICATE|direction|F02
    SENSE|S03|OBSERVE_CENTER|GROUNDED_PREDICATE|burden|F03
    SENSE|S04|OBSERVE_CENTER|GROUNDED_PREDICATE|bounded-change|F04
    SENSE|S05|RELATE_COEXISTING_OR_TENSION|ADMITTED_RELATION|coexistence|F05
    SENSE|S06|RELATE_COEXISTING_OR_TENSION|ADMITTED_RELATION|tension|F06
    SENSE|S07|TRACE_CHANGE_OR_SEQUENCE|ADMITTED_RELATION|sequence|F07,F08,F09
    SENSE|S08|PRESERVE_RESIDUE_OR_UNFINISHED|GROUNDED_PREDICATE|unfinished|F10
    SENSE|S09|FEEL_TOWARD_OBJECT|SUBJECTIVE_PREDICATE|affect|F11
    SENSE|S10|CONSIDER_MATERIAL_MEANING|SUBJECTIVE_PREDICATE|appraisal-material|F12
    SENSE|S11|CONSIDER_MATERIAL_MEANING|SUBJECTIVE_PREDICATE|appraisal-noncollapse|F13
    SENSE|S12|CONSIDER_MATERIAL_MEANING|SUBJECTIVE_PREDICATE|appraisal-change|F14
    SENSE|S13|CONSIDER_MATERIAL_MEANING|SUBJECTIVE_PREDICATE|appraisal-unfinished|F15
    SENSE|S14|CONSIDER_MATERIAL_MEANING|SUBJECTIVE_PREDICATE|appraisal-agency|F16
    SENSE|S15|TAKE_MATERIAL_POSITION|SUBJECTIVE_PREDICATE|material-value|F17,F18
    SENSE|S16|TAKE_MATERIAL_POSITION|SUBJECTIVE_PREDICATE|position|F19,F20
    SENSE|S17|STAY_WITH_UNFINISHED|SUBJECTIVE_PREDICATE|open-position|F21,F22
    FRAME|F01|S01|GROUNDED_CENTER_MONADIC|SUBJECT|required|C03|TOPIC_CONDITIONAL|ZERO_FORBIDDEN|H01|MP01|NONE
    FRAME|F02|S02|GROUNDED_DIRECTION_MONADIC|SUBJECT|required|C05|TOPIC_CONDITIONAL|ZERO_FORBIDDEN|H02|MP02|NONE
    FRAME|F03|S03|GROUNDED_BURDEN_MONADIC|SUBJECT|required|C05|TOPIC_CONDITIONAL|ZERO_FORBIDDEN|H03|MP03|NONE
    FRAME|F04|S04|GROUNDED_CHANGE_MONADIC|SUBJECT|required|C05|TOPIC_CONDITIONAL|ZERO_FORBIDDEN|H04|MP04|NONE
    FRAME|F05|S05|RELATION_COEXISTENCE|LEFT_ENDPOINT,RIGHT_ENDPOINT|required|required|C07|TOPIC_FORBIDDEN|ZERO_FORBIDDEN|H05|MP05|NONE
    FRAME|F06|S06|RELATION_TENSION|LEFT_ENDPOINT,RIGHT_ENDPOINT|required|required|C07|TOPIC_FORBIDDEN|ZERO_FORBIDDEN|H06|MP06|NONE
    FRAME|F07|S07|RELATION_TEMPORAL|BEFORE_EVENT,AFTER_EVENT|required|required|C07|TOPIC_FORBIDDEN|ZERO_FORBIDDEN|H07|MP07|NONE
    FRAME|F08|S07|RELATION_ACTION_CHANGE|ACTION_EVENT,CHANGE_EVENT|required|required|C07|TOPIC_FORBIDDEN|ZERO_FORBIDDEN|H08|MP08|NONE
    FRAME|F09|S07|RELATION_EXPLICIT_CAUSE|CAUSE_EVENT,EFFECT_EVENT|required|required|C07|TOPIC_FORBIDDEN|ZERO_FORBIDDEN|H09|MP09|NONE
    FRAME|F10|S08|GROUNDED_UNFINISHED_MONADIC|SUBJECT|required|C05|TOPIC_CONDITIONAL|ZERO_FORBIDDEN|H10|MP10|NONE
    FRAME|F11|S09|SUBJECTIVE_AFFECT_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C02|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H11|MP11|NONE
    FRAME|F12|S10|SUBJECTIVE_APPRAISAL_MATERIAL_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C04|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H12|MP12|NONE
    FRAME|F13|S11|SUBJECTIVE_NONCOLLAPSE_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C08|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H13|MP13|FM01
    FRAME|F14|S12|SUBJECTIVE_CHANGE_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C06|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H14|MP14|NONE
    FRAME|F15|S13|SUBJECTIVE_UNFINISHED_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C02|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H15|MP15|FM02
    FRAME|F16|S14|SUBJECTIVE_AGENCY_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C06|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H16|MP16|NONE
    FRAME|F17|S15|SUBJECTIVE_VALUE_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C04|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H17|MP17|NONE
    FRAME|F18|S15|SUBJECTIVE_VALUE_BOUNDARY_TRIADIC|SUBJECT,PRIMARY_OBJECT,SECONDARY_OBJECT|required|required|required|C09|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H18|MP18|NONE
    FRAME|F19|S16|SUBJECTIVE_POSITION_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C06|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H19|MP19|NONE
    FRAME|F20|S16|SUBJECTIVE_POSITION_BOUNDARY_TRIADIC|SUBJECT,PRIMARY_OBJECT,SECONDARY_OBJECT|required|required|required|C09|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H20|MP20|NONE
    FRAME|F21|S17|SUBJECTIVE_OPEN_DYADIC|SUBJECT,PRIMARY_OBJECT|required|required|C02|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H21|MP21|FM03
    FRAME|F22|S17|SUBJECTIVE_OPEN_BOUNDARY_TRIADIC|SUBJECT,PRIMARY_OBJECT,SECONDARY_OBJECT|required|required|required|C09|TOPIC_CONDITIONAL|EMLIS_ZERO_CONDITIONAL|H22|MP22|NONE
    HEAD|H01|F01|中心+LEXICALIZED_に+なる|IC03|LF01
    HEAD|H02|F02|見える|IC01|LF02
    HEAD|H03|F03|残る|IC03|LF03
    HEAD|H04|F04|見+られる|IC01|LF21
    HEAD|H05|F05|並ぶ|IC04|LF05
    HEAD|H06|F06|せめぎ+合う|IC05|LF06
    HEAD|H07|F07|続く|IC02|LF07
    HEAD|H08|F08|起こる|IC03|LF04
    HEAD|H09|F09|生じる|IC01|LF08
    HEAD|H10|F10|ある|IC03|LF09
    HEAD|H11|F11|気+LEXICALIZED_に+かける|IC01|LF10
    HEAD|H12|F12|受け+止める|IC01|LF11
    HEAD|H13|F13|まとめる|IC01|LF12
    HEAD|H14|F14|見+届ける|IC01|LF13
    HEAD|H15|F15|結論づける|IC01|LF14
    HEAD|H16|F16|尊重+する|IC06|LF15
    HEAD|H17|F17|大切+LEXICALIZED_に+する|IC06|LF16
    HEAD|H18|F18|守る|IC03|LF17
    HEAD|H19|F19|見+守る|IC03|LF18
    HEAD|H20|F20|固定+する|IC06|LF19
    HEAD|H21|F21|断定+する|IC06|LF22
    HEAD|H22|F22|限定+する|IC06|LF20
    LEXICAL_FAMILY|LF01|中心+LEXICALIZED_に+なる
    LEXICAL_FAMILY|LF02|見える
    LEXICAL_FAMILY|LF03|残る
    LEXICAL_FAMILY|LF04|起こる
    LEXICAL_FAMILY|LF05|並ぶ
    LEXICAL_FAMILY|LF06|せめぎ+合う
    LEXICAL_FAMILY|LF07|続く
    LEXICAL_FAMILY|LF08|生じる
    LEXICAL_FAMILY|LF09|ある
    LEXICAL_FAMILY|LF10|気+LEXICALIZED_に+かける
    LEXICAL_FAMILY|LF11|受け+止める
    LEXICAL_FAMILY|LF12|まとめる
    LEXICAL_FAMILY|LF13|見+届ける
    LEXICAL_FAMILY|LF14|結論づける
    LEXICAL_FAMILY|LF15|尊重+する
    LEXICAL_FAMILY|LF16|大切+LEXICALIZED_に+する
    LEXICAL_FAMILY|LF17|守る
    LEXICAL_FAMILY|LF18|見+守る
    LEXICAL_FAMILY|LF19|固定+する
    LEXICAL_FAMILY|LF20|限定+する
    LEXICAL_FAMILY|LF21|見+られる
    LEXICAL_FAMILY|LF22|断定+する
    COMPLEMENT|C02|QUOTE_COMPLEMENT|EXACT1|PRIMARY_OBJECT|OUTER_QUOTES,FRAME_MARKER
    COMPLEMENT|C03|CONTENT_NOMINAL|EXACT1|MONADIC_SUBJECT|OUTER_QUOTES,SF01,SF02
    COMPLEMENT|C04|CONTENT_NOMINAL|EXACT1|PRIMARY_OBJECT|OUTER_QUOTES,SF01,SF02
    COMPLEMENT|C05|CLASSIFIED_CONTENT|EXACT1|MONADIC_SUBJECT|OUTER_QUOTES,SF01,CLASSIFIER_EXACT1
    COMPLEMENT|C06|CLASSIFIED_CONTENT|EXACT1|PRIMARY_OBJECT|OUTER_QUOTES,SF01,CLASSIFIER_EXACT1
    COMPLEMENT|C07|COORDINATED_EXACT2|ORDERED_EXACT2|PAIRED_ENDPOINTS|FRAME_PARTICLES,COORDINATOR_ZERO
    COMPLEMENT|C08|COORDINATED_EXACT2|ORDERED_EXACT2|PRIMARY_OBJECT|OUTER_QUOTES,SF03
    COMPLEMENT|C09|BOUNDARY_SPLIT_EXACT2|ORDERED_EXACT2|PRIMARY_OBJECT,SECONDARY_OBJECT|OUTER_QUOTES,FRAME_PARTICLES,COORDINATOR_ZERO
    SENSE_COMPLEMENT|SC01|S01|F01|C03|NONE
    SENSE_COMPLEMENT|SC02|S02|F02|C05|CL01
    SENSE_COMPLEMENT|SC03|S03|F03|C05|CL02
    SENSE_COMPLEMENT|SC04|S04|F04|C05|CL03
    SENSE_COMPLEMENT|SC05|S05|F05|C07|NONE
    SENSE_COMPLEMENT|SC06|S06|F06|C07|NONE
    SENSE_COMPLEMENT|SC07|S07|F07|C07|NONE
    SENSE_COMPLEMENT|SC08|S07|F08|C07|NONE
    SENSE_COMPLEMENT|SC09|S07|F09|C07|NONE
    SENSE_COMPLEMENT|SC10|S08|F10|C05|CL05
    SENSE_COMPLEMENT|SC11|S09|F11|C02|NONE
    SENSE_COMPLEMENT|SC12|S10|F12|C04|NONE
    SENSE_COMPLEMENT|SC13|S11|F13|C08|NONE
    SENSE_COMPLEMENT|SC14|S12|F14|C06|CL03
    SENSE_COMPLEMENT|SC15|S13|F15|C02|NONE
    SENSE_COMPLEMENT|SC16|S14|F16|C06|CL04
    SENSE_COMPLEMENT|SC17|S15|F17|C04|NONE
    SENSE_COMPLEMENT|SC18|S15|F18|C09|NONE
    SENSE_COMPLEMENT|SC19|S16|F19|C06|CL04
    SENSE_COMPLEMENT|SC20|S16|F20|C09|NONE
    SENSE_COMPLEMENT|SC21|S17|F21|C02|NONE
    SENSE_COMPLEMENT|SC22|S17|F22|C09|NONE
    SOURCE_MODE|SM01|QUOTE_COMPLEMENT
    SOURCE_MODE|SM02|CONTENT_NOMINAL
    SOURCE_MODE|SM03|CLASSIFIED_CONTENT
    SOURCE_MODE|SM04|COORDINATED_EXACT2
    SOURCE_MODE|SM05|BOUNDARY_SPLIT_EXACT2
    CLASSIFIER|CL01|direction|方向性
    CLASSIFIER|CL02|burden|負担
    CLASSIFIER|CL03|bounded-change|変化
    CLASSIFIER|CL04|agency-or-position|選択
    CLASSIFIER|CL05|preserved-point|点
    SOURCE_TOKEN|SF01|NOMINAL_ATTRIBUTIVE|という
    SOURCE_TOKEN|SF02|CONTENT_HEAD|内容
    SOURCE_TOKEN|SF03|PAIR_COORDINATOR|と
    MODIFIER|FM01|F13|AFTER_PRIMARY_OBJECT_BEFORE_HEAD|一つに
    MODIFIER|FM02|F15|AFTER_SUBJECT_BEFORE_PRIMARY_OBJECT|今すぐ
    MODIFIER|FM03|F21|AFTER_SUBJECT_BEFORE_PRIMARY_OBJECT|ここで
    QUOTE_DELIMITER|QD01|NONE|KAGI_OUTER
    QUOTE_DELIMITER|QD02|BALANCED_KAGI_ONLY|NIJUKAGI_OUTER
    QUOTE_DELIMITER|QD03|BALANCED_NIJUKAGI_ONLY|KAGI_OUTER
    QUOTE_DELIMITER|QD04|BALANCED_MIXED|STOP
    PARTICLE|P01|F01|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P02|F02|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P03|F03|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P04|F04|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P05|F10|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P06|F05|LEFT_ENDPOINT|FIXED_と
    PARTICLE|P07|F05|RIGHT_ENDPOINT|FIXED_が
    PARTICLE|P08|F06|LEFT_ENDPOINT|FIXED_と
    PARTICLE|P09|F06|RIGHT_ENDPOINT|FIXED_が
    PARTICLE|P10|F07|BEFORE_EVENT|FIXED_のあとに
    PARTICLE|P11|F07|AFTER_EVENT|FIXED_が
    PARTICLE|P12|F08|ACTION_EVENT|FIXED_のあとに
    PARTICLE|P13|F08|CHANGE_EVENT|FIXED_が
    PARTICLE|P14|F09|CAUSE_EVENT|FIXED_によって
    PARTICLE|P15|F09|EFFECT_EVENT|FIXED_が
    PARTICLE|P16|F11|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P17|F11|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P18|F12|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P19|F12|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P20|F13|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P21|F13|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P22|F14|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P23|F14|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P24|F15|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P25|F15|PRIMARY_OBJECT|FIXED_と
    PARTICLE|P26|F16|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P27|F16|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P28|F17|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P29|F17|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P30|F19|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P31|F19|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P32|F21|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P33|F21|PRIMARY_OBJECT|FIXED_と
    PARTICLE|P34|F18|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P35|F18|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P36|F18|SECONDARY_OBJECT|FIXED_から
    PARTICLE|P37|F20|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P38|F20|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P39|F20|SECONDARY_OBJECT|FIXED_に
    PARTICLE|P40|F22|SUBJECT|BASE_が|TOPIC_は
    PARTICLE|P41|F22|PRIMARY_OBJECT|FIXED_を
    PARTICLE|P42|F22|SECONDARY_OBJECT|FIXED_に
    INFLECTION_CLASS|IC01|ICHIDAN_RU
    INFLECTION_CLASS|IC02|GODAN_KU
    INFLECTION_CLASS|IC03|GODAN_RU
    INFLECTION_CLASS|IC04|GODAN_BU
    INFLECTION_CLASS|IC05|GODAN_U
    INFLECTION_CLASS|IC06|SAHEN_SURU
    MORPHOLOGY|MP01|F01|RESULTATIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP02|F02|NONPAST_STATIVE|POSITIVE|GROUNDED_ASSERTION|POLITE|STEM_MASU|PERIOD
    MORPHOLOGY|MP03|F03|RESULTATIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP04|F04|NONPAST_STATIVE|POSITIVE|GROUNDED_ASSERTION|POLITE|STEM_MASU|PERIOD
    MORPHOLOGY|MP05|F05|PROGRESSIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_DE_IRU_MASU|PERIOD
    MORPHOLOGY|MP06|F06|PROGRESSIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP07|F07|PROGRESSIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_ITE_IRU_MASU|PERIOD
    MORPHOLOGY|MP08|F08|RESULTATIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|ONBIN_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP09|F09|RESULTATIVE_STATE|POSITIVE|GROUNDED_ASSERTION|POLITE|STEM_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP10|F10|NONPAST_STATIVE|POSITIVE|GROUNDED_ASSERTION|POLITE|STEM_MASU|PERIOD
    MORPHOLOGY|MP11|F11|PROGRESSIVE_STATE|POSITIVE|EMLIS_FEELING|POLITE|STEM_TE_IRU_MASU|PERIOD
    MORPHOLOGY|MP12|F12|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|STEM_TAI_DESU|PERIOD
    MORPHOLOGY|MP13|F13|NONPAST|NEGATIVE|EMLIS_BOUNDED_REFUSAL|POLITE|STEM_TAKU_ARIMASEN|PERIOD
    MORPHOLOGY|MP14|F14|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|STEM_TAI_DESU|PERIOD
    MORPHOLOGY|MP15|F15|NONPAST|NEGATIVE|EMLIS_BOUNDED_REFUSAL|POLITE|STEM_TAKU_ARIMASEN|PERIOD
    MORPHOLOGY|MP16|F16|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|SAHEN_SHI_TAI_DESU|PERIOD
    MORPHOLOGY|MP17|F17|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|SAHEN_SHI_TAI_DESU|PERIOD
    MORPHOLOGY|MP18|F18|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|STEM_TAI_DESU|PERIOD
    MORPHOLOGY|MP19|F19|NONPAST|POSITIVE|EMLIS_VOLITIONAL|POLITE|STEM_TAI_DESU|PERIOD
    MORPHOLOGY|MP20|F20|NONPAST|NEGATIVE|EMLIS_BOUNDED_REFUSAL|POLITE|SAHEN_SHI_TAKU_ARIMASEN|PERIOD
    MORPHOLOGY|MP21|F21|NONPAST|NEGATIVE|EMLIS_BOUNDED_REFUSAL|POLITE|SAHEN_SHI_TAKU_ARIMASEN|PERIOD
    MORPHOLOGY|MP22|F22|NONPAST|NEGATIVE|EMLIS_BOUNDED_REFUSAL|POLITE|SAHEN_SHI_TAKU_ARIMASEN|PERIOD
    LINK|L01|COEXISTS_WITH|FRAME_INTERNAL|F05|ZERO_EXTERNAL
    LINK|L02|TENSION_WITH|FRAME_INTERNAL|F06|ZERO_EXTERNAL
    LINK|L03|TEMPORALLY_PRECEDES|FRAME_INTERNAL|F07|ZERO_EXTERNAL
    LINK|L04|ACTION_PRECEDES_CHANGE|FRAME_INTERNAL|F08|ZERO_EXTERNAL
    LINK|L05|SOURCE_EXPLICIT_CAUSE|FRAME_INTERNAL|F09|ZERO_EXTERNAL
    LINK|L06|TEMPORALLY_PRECEDES|SENTENCE_INITIAL|registered:そのあと|INTERNAL_ZERO
    LINK|L07|ACTION_PRECEDES_CHANGE|SENTENCE_INITIAL|registered:その後|INTERNAL_ZERO
    LINK|L08|SOURCE_EXPLICIT_CAUSE|SENTENCE_INITIAL|registered:そのため|INTERNAL_ZERO
    LINK|L09|NO_RELATION_CLAIM|SENTENCE_INITIAL_ADDITIVE|registered:また|INDEPENDENT_TOPIC_ONLY
    LINK|L10|ANY_ADMITTED_RELATION|ZERO|registered:empty|RELATION_ALREADY_OWNED
    REFERENCE|R01|FIRST_MENTION|FULL_EXPRESSION
    REFERENCE|R02|AMBIGUOUS_ANTECEDENT|FULL_EXPRESSION
    REFERENCE|R03|SINGULAR_ANTECEDENT_EXACT1|SINGULAR_ANAPHOR
    REFERENCE|R04|ORDERED_PAIR_PREVIOUS_EXACT2|PAIR_ANAPHOR
    REFERENCE|R05|EMLIS_FIRST_OR_RESTART|EXPLICIT_SUBJECT
    REFERENCE|R06|EMLIS_SAME_SPEAKER_CHAIN|ZERO_SUBJECT
    REFERENCE|R07|EMLIS_AFTER_COUNTERPOSITION|EXPLICIT_SUBJECT
    REFERENCE|R08|INTRODUCED_TOPIC|TOPIC_HA
    REFERENCE|R09|ADMITTED_CONTRAST|TOPIC_HA
    REFERENCE|R10|FIRST_NONCONTRAST|BASE_CASE
    REFERENCE|R11|REQUIRED_RELATION_ENDPOINT|EXPLICIT_ENDPOINT
    REFERENCE|R12|REFERENCE_REPAIR|FULL_EXPRESSION_NO_FORK
    PREFERENCE|J01|EXPLICIT_REFERENT_REPEAT
    PREFERENCE|J02|TOPIC_STACK
    PREFERENCE|J03|QUOTE_OR_NOMINALIZER_LOAD
    PREFERENCE|J04|CONNECTIVE_REPEAT
    PREFERENCE|J05|EXPLICIT_EMLIS_SUBJECT_REPEAT
    PREFERENCE|J06|CLAUSE_LOAD
    PREFERENCE|J07|REFERENCE_DISTANCE
    END_V2_GRAMMAR_INVENTORY_V1

    V2_GRAMMAR_INVENTORY_SHA256 = f071244e28baa5a824067ebfddf273bc4ad8f967d90ed5bd0bf9b9862a68a802

### 5.3 mapping totality

1. existing typed intent → PredicateSenseSpec exact1
2. intent＋admitted relation＋roles → JapaneseCaseFrameSpec exact1
3. sense＋selected frame → AtomicPredicateHeadSpec exact1＋LexicalFamilySpec exact1
4. frame required slots → CaseParticleRule exact cover
5. sense＋frame → SenseComplementLicense exact1
6. source mode＋cardinality＋frame slot → ComplementRuleSpec exact1
7. classified content → SourceClassifierSpec exact1
8. selected frame＋head → InflectionClassSpec exact1＋MatrixMorphologyParadigmSpec exact1
9. selected frame → SourceFunctionalModifierSpec exact1またはexplicit NONE exact1
10. admitted relation＋layout → ClauseLinkRule exact1
11. typed discourse state → ReferenceZeroTopicRule exact1

各lookupの0件／2件以上はnamed pre-linearization STOP。rank、raw text、hash、lexicographic IDで曖昧性を隠さない。

### 5.4 frame surface skeleton exact22

Pro final checkが要求したhuman read対象を、source本文の代わりにdesign-only placeholder `〈X〉`／`〈Y〉` を入れたbase case surfaceとして閉じる。subjective frameはexplicit Emlis subject＋topic `は`、grounded frameはbase case、source quoteは外側 `「」`、terminalはregistered periodを用いる。placeholderはsurface確認だけの記号であり、runtime source、case／fixture ID、selector、expected text、rendered-text置換には使用しない。

Canonicalizationは BEGIN_FRAME_SURFACE_SKELETON_V2 の次の行から END_FRAME_SURFACE_SKELETON_V2 の直前までを、表示順、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。markerとMarkdown表示用先頭4-spaceはhash対象外である。

    BEGIN_FRAME_SURFACE_SKELETON_V2
    SURFACE_SKELETON|F01|「〈X〉」という内容が中心になっています。
    SURFACE_SKELETON|F02|「〈X〉」という方向性が見えます。
    SURFACE_SKELETON|F03|「〈X〉」という負担が残っています。
    SURFACE_SKELETON|F04|「〈X〉」という変化が見られます。
    SURFACE_SKELETON|F05|「〈X〉」と「〈Y〉」が並んでいます。
    SURFACE_SKELETON|F06|「〈X〉」と「〈Y〉」がせめぎ合っています。
    SURFACE_SKELETON|F07|「〈X〉」のあとに「〈Y〉」が続いています。
    SURFACE_SKELETON|F08|「〈X〉」のあとに「〈Y〉」が起こっています。
    SURFACE_SKELETON|F09|「〈X〉」によって「〈Y〉」が生じています。
    SURFACE_SKELETON|F10|「〈X〉」という点があります。
    SURFACE_SKELETON|F11|Emlisは「〈X〉」を気にかけています。
    SURFACE_SKELETON|F12|Emlisは「〈X〉」という内容を受け止めたいです。
    SURFACE_SKELETON|F13|Emlisは「〈X〉」と「〈Y〉」を一つにまとめたくありません。
    SURFACE_SKELETON|F14|Emlisは「〈X〉」という変化を見届けたいです。
    SURFACE_SKELETON|F15|Emlisは今すぐ「〈X〉」と結論づけたくありません。
    SURFACE_SKELETON|F16|Emlisは「〈X〉」という選択を尊重したいです。
    SURFACE_SKELETON|F17|Emlisは「〈X〉」という内容を大切にしたいです。
    SURFACE_SKELETON|F18|Emlisは「〈X〉」を「〈Y〉」から守りたいです。
    SURFACE_SKELETON|F19|Emlisは「〈X〉」という選択を見守りたいです。
    SURFACE_SKELETON|F20|Emlisは「〈X〉」を「〈Y〉」に固定したくありません。
    SURFACE_SKELETON|F21|Emlisはここで「〈X〉」と断定したくありません。
    SURFACE_SKELETON|F22|Emlisは「〈X〉」を「〈Y〉」に限定したくありません。
    END_FRAME_SURFACE_SKELETON_V2

    FRAME_SURFACE_SKELETON_SHA256 = cba16357cec9cd37c8da16e9727aeea5a961c8e413c2f97469161c5a03a5f03b

F01は任意長quoteを直接主語にせず、C03で `という内容` を閉じ、S01-owned `中心になる` へ結ぶ。これによりunlicensedとなる旧C01はcount維持目的で残さない。F10はsource内のresidue／unfinished差を「未解決」へ再分類せず、C05＋neutral CL05で `という点があります` とする。source literal自身が既存meaningを保持し、classifierはproposition nominalization以外の意味を足さない。F15／F21はexisting upstream `ClauseArgumentRole.PRIMARY_OBJECT` を増やさず、C02 `QUOTE_COMPLEMENT` とframe-owned P25／P33 `FIXED_と` によってpredicate-specific proposition complementを実現する。`PRIMARY_OBJECT` はprimary argument slotのsemantic bindingであり、surface助詞 `を` やCONTENT_NOMINALを意味しない。F02／F03／F04も全文readでcollocation／aspectを照合し、`方向性`、`負担`、nonpast `見られます` へ修正した。

### 5.5 V1→corrected V2 correction provenance changed row set

V1 inventoryから本V2 inventoryへのregistry operationはexact24、内訳はREPLACE exact22＋DELETE exact1＋ADD exact1である。新rowのauthoritative bytesは§5.2を用いる。

    REPLACE|FRAME:F01|C01→C03
    REPLACE|FRAME:F10|C03→C05
    REPLACE|FRAME:F15|C04→C02
    REPLACE|FRAME:F21|C04→C02
    REPLACE|HEAD:H01|表れる/IC01→中心+LEXICALIZED_に+なる/IC03
    REPLACE|HEAD:H10|閉じる/IC01→ある/IC03
    REPLACE|LEXICAL_FAMILY:LF01|表れる→中心+LEXICALIZED_に+なる
    REPLACE|LEXICAL_FAMILY:LF09|閉じる→ある
    DELETE|COMPLEMENT:C01|unlicensed after F01 remap
    REPLACE|SENSE_COMPLEMENT:SC01|C01/NONE→C03/NONE
    REPLACE|SENSE_COMPLEMENT:SC10|C03/NONE→C05/CL05
    REPLACE|SENSE_COMPLEMENT:SC15|C04→C02
    REPLACE|SENSE_COMPLEMENT:SC21|C04→C02
    REPLACE|CLASSIFIER:CL01|向き→方向性
    REPLACE|CLASSIFIER:CL02|重さ→負担
    ADD|CLASSIFIER:CL05|preserved-point/点
    REPLACE|MODIFIER:FM01|一方に→一つに
    REPLACE|MODIFIER:FM02|AFTER_PRIMARY_OBJECT_BEFORE_HEAD→AFTER_SUBJECT_BEFORE_PRIMARY_OBJECT
    REPLACE|MODIFIER:FM03|AFTER_PRIMARY_OBJECT_BEFORE_HEAD→AFTER_SUBJECT_BEFORE_PRIMARY_OBJECT
    REPLACE|PARTICLE:P25|FIXED_を→FIXED_と
    REPLACE|PARTICLE:P33|FIXED_を→FIXED_と
    REPLACE|MORPHOLOGY:MP01|STEM_TE_IRU_MASU→ONBIN_TE_IRU_MASU
    REPLACE|MORPHOLOGY:MP04|RESULTATIVE_STATE/STEM_TE_IRU_MASU→NONPAST_STATIVE/STEM_MASU
    REPLACE|MORPHOLOGY:MP10|RESULTATIVE_STATE/NEGATIVE/STEM_TE_IRU_NEGATIVE_POLITE→NONPAST_STATIVE/POSITIVE/STEM_MASU

    FROZEN_COUNT_DELTA = ComplementRuleSpec 9→8; SourceClassifierSpec 4→5; all other frozen counts unchanged
    MUTATION_COUNT = 273→273 fresh recomputed
    SOURCE_BOUNDARY_COUNT = 208→208
    NAMED_TEST_FUNCTION_COUNT = 191→191
    PRIOR_V1_GRAMMAR_INVENTORY_SHA256 = c9dc32458d9c1ba17698eb9c59f7a7607de8922898a3b8c0fff10235ea164bda
    CORRECTED_V2_GRAMMAR_INVENTORY_SHA256 = f071244e28baa5a824067ebfddf273bc4ad8f967d90ed5bd0bf9b9862a68a802
    CORRECTED_V2_FRAME_SURFACE_SKELETON_SHA256 = cba16357cec9cd37c8da16e9727aeea5a961c8e413c2f97469161c5a03a5f03b
    CORRECTED_V2_DISPOSITION_SHA256 = 7b3f920bbd4c6661a92df1b3d93df6c92f0df637a141a2b6207b63bd713ef5d9
    CORRECTED_V2_FINAL_BODY_SHA256 = 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de

このSHAはMashが受領・承認したsource corrected V2のidentityであり、本final document自身のSHAではない。本final document SHAはself-referenceを避け、GitHub remote blob／final handoff／ZIP ledgerで外部bindする。

---

## 6. SourceLeafToken realization boundary

### 6.1 closed shape enums

source本文はsemantic selectorではなくEvidenceRef-bound opaque leafとして扱う。private closed enumsは次で固定する。

| Enum | Exact values |
|---|---|
| SourceLeafExtent exact2 | FULL_EVIDENCE_LITERAL / CERTIFIED_LITERAL_SUBSPAN |
| SourceLeafCardinality exact2 | EXACT1 / ORDERED_EXACT2 |
| SourceSentenceShape exact2 | ONE_SENTENCE / MULTI_SENTENCE |
| SourceFinalTerminalClass exact4 | ABSENT / PERIOD / QUESTION / EXCLAMATION |
| SourceQuoteTopology exact4 | NONE / BALANCED_KAGI_ONLY / BALANCED_NIJUKAGI_ONLY / BALANCED_MIXED |
| SourceLineBreakShape exact3 | NONE / LF_ONLY / CRLF_ONLY |
| SourceRealizationMode exact5 | QUOTE_COMPLEMENT / CONTENT_NOMINAL / CLASSIFIED_CONTENT / COORDINATED_EXACT2 / BOUNDARY_SPLIT_EXACT2 |

terminal codepointのclosed setは 。．.!！？? とする。lone CR、LFとCRLFの混在、unbalanced quotation、invalid UTF-8はunsupportedである。shape witnessはserialization validationとouter delimiter selectionだけに使い、frame、mode、head、rank、repairのselectorへ渡さない。

### 6.2 private types

SourceLeafTokenは次だけを持つ。

    leaf_ref
    semantic_ref
    source_envelope_ref
    evidence_ref
    extent
    raw_utf8_start
    raw_utf8_end
    payload_utf8
    sentence_shape
    final_terminal_class
    quote_topology
    line_break_shape
    derivation

payload_utf8のrepr、log、public serialization、persistent storageは0。SourceLeafGroupは group_ref、cardinality、ordered_leaf_refs を持つ。SourceComplementPlanは mode、group_ref、complement_rule_ref、quote delimiter refs、classifier ref、coordinator ref、case slot refを持つ。

### 6.3 mode exact5

| Mode | Input shape | Licensed case frame | Delimiter／marker owner | Terminal owner | Byte rule | Derivation | Unsupported STOP |
|---|---|---|---|---|---|---|---|
| QUOTE_COMPLEMENT | leaf exact1、fullまたはcertified subspan | SenseComplementLicenseがC02へbindしたframe slot | QD01–QD04のouter delimiterとframe-owned markerをrealizerが所有。C02はframeごとに `を` またはproposition complement `と` を閉じる | source terminalはinner literal、matrix terminalはpredicate owner | literal bytes exact preserve | literalはLITERAL_SUBSPAN、outer tokenはregistered structural／functional | SOURCE_COMPLEMENT_NONUNIQUE_STOP |
| CONTENT_NOMINAL | leaf exact1 | C03／C04 | 「 literal 」＋atomic という＋atomic 内容。万能 こと fallback 0 | 同上 | 同上 | 同上 | SOURCE_CONTENT_NOMINAL_UNLICENSED_STOP |
| CLASSIFIED_CONTENT | leaf exact1＋private registered classifier exact1 | C05／C06 | outer quote＋atomic という＋CL01–CL05 exact1 | 同上 | 同上 | classifierはregistered functional | SOURCE_CLASSIFIER_NONUNIQUE_STOP |
| COORDINATED_EXACT2 | ordered leaf exact2 | C07／C08 | 各leafのouter quoteをrealizerが所有。C07はframe particlesがendpoint関係を所有してcoordinator 0、C08だけatomic とを所有 | 各source terminalは各inner literal、matrix terminalはpredicate owner | order、cardinality、各literal bytesを保存 | 各leaf LITERAL_SUBSPAN、delimiter／C08 coordinatorはregistered parts | SOURCE_PAIR_CARDINALITY_STOP |
| BOUNDARY_SPLIT_EXACT2 | ordered leaf exact2 | C09、F18／F20／F22 | leaf1をPRIMARY_OBJECT、leaf2をSECONDARY_OBJECTへbindし、coordinator 0。各frame particleがslot relationを所有 | 同上 | order、cardinality、各literal bytesを保存 | 各leaf LITERAL_SUBSPAN、groupはslot split provenance | SOURCE_BOUNDARY_SPLIT_CARDINALITY_STOP |

一文／複数文、source末尾terminal有無、balanced 「」／『』、LF／CRLFはpayload内部byteとして保存する。outer delimiterだけはclosed QD ruleで決める。topology NONEは「」、KAGI_ONLYは『』、NIJUKAGI_ONLYは「」、MIXEDは利用可能な非衝突delimiterがないため SOURCE_OUTER_DELIMITER_UNAVAILABLE_STOP。delimiter選択はsource meaning、frame、headを変えない。source terminalをstrip、reuse、matrix terminalへ昇格しない。matrix finite headの後にmatrix terminal exact1を別ownerで付与する。

exact2 pairはdedupe、reorder、3件以上へのgeneric joinをしない。C07ではrelation frame particles、C08ではSF03、C09ではprimary／secondary frame particlesだけが二leaf間のfunctional relationを所有し、二ownerを同時に付けない。各leafのevidence coordinate domainが別なら、各literalをLITERAL_SUBSPAN exact1で所有し、typed SourceLeafGroupがjoin／slot-split provenance ownerになる。同一field、同一coordinate domain、nonoverlap ordered rangesを証明できる場合だけexisting COMPOSITIONAL_JOINを追加できる。public SurfaceDerivation enum追加は0。

C02を使うF11はP17 `FIXED_を`、F15はP25 `FIXED_と`、F21はP33 `FIXED_と` をそれぞれframe-owned exact1で持つ。同じQUOTE_COMPLEMENT modeの共有はparticleのgeneric inferenceではなく、typed primary argumentへliteral bytesをbindするsource boundaryの共有である。predicate固有markerはselected frameだけが決め、source suffix、rendered text、case IDで `を`／`と` を選ばない。

### 6.4 byte preservation

    payload_utf8 == source_envelope.raw_utf8[raw_utf8_start:raw_utf8_end]
    decode(payload_utf8).encode("utf-8") == payload_utf8
    Unicode normalization = 0
    strip / whitespace rewrite / terminal deletion / newline conversion = 0

FULL_EVIDENCE_LITERALはEvidenceRef literal rangeのexact coverを要求する。CERTIFIED_LITERAL_SUBSPANはcomposerが文字列探索せず、existing typed scalar range＋source binding exact1＋EvidenceRefから一意に解決し、normalized rangeをcontiguous raw UTF-8へ逆写像できる場合だけ許す。proof 0件／2件以上、空白正規化等で一対一に戻せない場合は SOURCE_LITERAL_SUBSPAN_UNCERTIFIED_STOP。

全文sourceまたはsubspanをstandalone replayしない。licensed matrix complement内部だけで表示する。全visible byteをSurfaceDerivationがexact coverし、literal SHAとRealizedSemanticBindingをlinearization時に同時生成する。

### 6.5 pre-linearization STOP

- STAGE1_SOURCE_LEAF_BINDING_NONUNIQUE_STOP
- STAGE1_SOURCE_LEAF_UTF8_MISMATCH_STOP
- STAGE1_SOURCE_LEAF_SHAPE_UNSUPPORTED_STOP
- STAGE1_SOURCE_QUOTE_UNBALANCED_STOP
- STAGE1_SOURCE_LINEBREAK_UNSUPPORTED_STOP
- STAGE1_SOURCE_PAIR_CARDINALITY_STOP
- STAGE1_SOURCE_LITERAL_SUBSPAN_UNCERTIFIED_STOP
- STAGE1_SOURCE_COMPLEMENT_NONUNIQUE_STOP
- STAGE1_SOURCE_TERMINAL_OWNERSHIP_STOP

unsupported shapeを別mode、万能nominalizer、source suffix branchへfallbackしない。本unitの能力外なら SOURCE_REALIZATION_CAPABILITY_GAP_STOPへ閉じる。

---

## 7. case-frame uniquenessとatomic head boundary

### 7.1 case frame exact1

JapaneseCaseFrameKeyは次のexisting typed fieldsだけで構成する。

    SentenceJob
    SemanticClauseKind
    subjective content / predication kind
    grounded predicate_kind
    required ClauseArgumentRole tuple
    RelationOperator
    polarity / modality / time scope
    speaker / reference requirement
    complement requirement

raw source、source shape、rendered surface、output historyはkeyに含めない。select_case_frame(intent)はpredicate senseとvalency／relationごとに閉じたF01–F22のexact1を返し、0件／2件以上なら STAGE1_JAPANESE_CASE_FRAME_NONUNIQUE_STOP。generic F02／F03を異なるpredicateへ共用せず、各frameがhead、slot、particle、complement、morphology profileを一体所有する。

### 7.2 atomic head exact1

case-frame selectionとpredicate-head selectionは別stepにする。PredicateSenseSpecはcase-frame license refsを持ち、選択済みframeがAtomicPredicateHeadSpec ref exact1を持つ。本v2 inventoryは各selected frameのhead candidate cardinalityをexact1、全体exact22とする。S07およびS15–S17のように一senseが複数frameを持つ場合も、senseだけでheadを共用せず、sense＋selected frameでheadを閉じる。

AtomicPredicateHeadSpecが持てるのは、head_ref、frame_ref、lemma atom refs、inflection class ref、morphology profile licenseだけである。finite polite ending、terminal、argument-slot case particle、source argument、connective、full clause／sentenceは禁止する。H01の 中心になる、H11の 気にかける、H17の 大切にする に含まれる に はlexicalized head atomであり、argument slot particleではないことをmanifestで明示する。light-verb compoundは複数lemma atomへ分解するが、head ownerはexact1である。

head候補がexact1であるため、initial bodyにあった adjacent predicate-head repetition をJapaneseLocalPreferenceProfileから削除する。改善候補のないmachine preferenceを残さない。代わりに、次をhard invariantにする。

- 一つのvisible response内のadjacent same lexical_family_refは ADJACENT_ATOMIC_HEAD_REPEAT_STOP
- formal exact8内で同一ordered lexical-family signatureが複数bodyへ現れた場合は SET_LEVEL_PREDICATE_HEAD_SIGNATURE_REPEAT_STOP
- head ID、lexical family IDだけで判定し、surface substring、raw text、fixture IDは使わない

将来head alternateを追加する場合は本unit内でruntime追加せず、新しいfinal inventory、fresh digest、fresh Level 3、同一sense／frame内1..2候補、typed unique reducerを必要とする。

### 7.3 frameとheadの独立証明

- 全licensed intent → frame exact1
- 各selected frame → head exact1＋morphology profile exact1
- head morphology incompatible → rank前STOP
- source payloadだけのshape-preserving mutation → frame_ref／head_ref不変
- frame spyとhead spyのcall／return ownerを分ける
- head selectionはcandidate fork axisにしない

この分離により、case frameの一意性とlexical surface ownerを混同しない。

---

## 8. reference、link、morphology

### 8.1 reference／ellipsis／topic

ReferenceZeroTopicRule exact12をclause順に適用する。

1. 初出はfull expression。
2. singular anaphorはantecedent exact1、competitor 0、focus、distance、cardinalityをすべて満たす場合だけ。
3. pair anaphorは同じordered exact2 pairが直前に導入済みの場合だけ。
4. required relation endpointをanaphor／zeroで隠さない。
5. Emlis zero subjectはsame speaker chain exact1の場合だけ。初出、speaker restart、counterposition後はexplicit。
6. は はintroduced topicまたはadmitted contrastだけ。通常初出はbase case。
7. 曖昧anaphorはfull expressionへdeterministic repair。fullでもframe不適合ならSTOP。

text similarity、同じ語、fixture orderはreference resolutionへ使わない。

### 8.2 relation／connective

ClauseLinkPlanはadmitted relationとplacementを一体所有する。

- relationはFRAME_INTERNAL、SENTENCE_INITIAL、ZEROのexact1
- cause connectiveはSOURCE_EXPLICIT_CAUSEだけ
- relationをframe internalで表現した場合、外部connectiveは0
- first sentence connectiveは0
- default 。また、は廃止し、また はindependent topicのtyped licenseがある場合だけ
- adjacent same connective、unadmitted contrast、relation double markは生成前STOP
- sentence mergeはshared referent／endpointまたはadmitted dependencyのある隣接dutyだけ
- source order／topological orderをalternate作成目的で逆転しない

### 8.3 morphology

scopeはsource、relation／clause、matrix Emlisのexact3へ分離する。source scalarを任意のmatrix predicate前へcompleted carrierとして積まない。generic morpheme concatenationはせず、selected frameがMatrixMorphologyParadigmSpec MP01–MP22のexact1を所有する。各rowはinflection class、aspect／state、matrix modality、polarity、politeness、terminal、finite surface chainを閉じる。

    lexical head
    → licensed voice / aspect
    → licensed matrix modality or desiderative
    → scoped polarity
    → tense
    → politeness
    → matrix terminal

この順序はfree-form concatenation手順ではなくMP rowのscope確認順である。MP01は 中心になる→中心になっています、MP04は 見られる→見られます、MP10は ある→あります、MP13は まとめる→まとめたくありません、MP15は 結論づける→結論づけたくありません、MP20は 固定する→固定したくありません、MP21は 断定する→断定したくありません をそれぞれ一つのregistered chainとして所有し、見られられます や まとめないたい のような逐語連結を生成しない。F15／F21の `と` はhead内atomではなくframe-owned primary argument markerであり、FM02／FM03はsubject後・quote complement前に置く。各matrix clauseはfinite head exact1、terminal exact1。continuative formをsentence-finalへ置かない。source quoteの話体とterminalは変更しない。head／inflection class／MP rowの0件または2件以上、registered chain外のformは STAGE1_MATRIX_MORPHOLOGY_NONUNIQUE_STOP。

---

## 9. function-level revision mapとmigration ledger

### 9.1 current code inventory at review runtime head

| Owner | Current exact count／fact |
|---|---|
| emlis_stage1_composition.py blob | 2ee2221255341264b36667eb05486a92f581d9ea |
| CONSTRUCTION_REGISTRY | 8、current reachable 7 |
| EXPRESSION_ASSET_REGISTRY | 17、expression×valency license 21、current reachable 20 |
| RELATION_MORPHOLOGY_ASSET_REGISTRY | 5 |
| SCALAR_MORPHOLOGY_ASSET_REGISTRY | 19 |
| SOURCE_SCALAR_MORPHOLOGY_ASSET_REGISTRY | 4 |
| RESPONSE_OBJECT_ASSET_REGISTRY | 3 |
| FUNCTIONAL_ASSET_REGISTRY | top-level 4 |
| PARTICIPANT_ASSET_REGISTRY | 2 |
| STRUCTURAL_ASSET_REGISTRY | 6 |
| PROFILE_RULE_REGISTRY | 8 |
| active emlis_stage1_response.py blob | 994c9a0de277fcd8399340d2e79c892f51add648 |
| active CMEE_STAGE1_MICROGRAMMAR_INVENTORY_TUPLE | 44 sections |
| tests | contracts 141＋vertical 42＝183 |

現時点には、active response exact44 microgrammar bankと、early candidate用disabled composition registry bankの二つがある。v2 activation後にsole active surface owner exact1へ閉じる必要がある。

### 9.2 migration classifications

classification exact5は RETAIN_AS_ATOMIC_LEAF、REPLACED_BY_V2_OWNER、UNREACHABLE_AFTER_ACTIVATION、DELETE_ONLY_AFTER_UNREACHABLE_PROOF、HISTORICAL_REFERENCE_ONLY である。

current compositionのstring seam ownerはreview blob上の次のexact18 symbolsで閉じる。

    LEGACY_COMPOSITION_SEAM_SYMBOL_SET_EXACT18 =
      _source_expression
      _source_scalar_finite_form
      _normalize_source_scalar_text
      _source_scalar_text
      _functional_surface_lexemes_by_role
      _functional_surface_lexemes
      _finite_relation_carrier
      _relation_endpoint_particle
      _generic_relation_fragment_clause
      _generic_relation_fragment_response_object
      _quoted_source_object
      _shared_endpoint_conjunct
      _new_endpoint_followup
      _shared_endpoint_relation_chain
      _shared_endpoint_relation_chain_surface
      _surface_for_plan
      _normal_form_phase_topic_speaker_connective_terminal
      _normal_form_phase_expression_selection_final_linearization

N0でreview blob 2ee222…に対し各symbol definition exact1を再確認する。欠落、duplicate、別seam symbol検出は MIGRATION_LEDGER_OWNER_DRIFT_STOP。

| Current owner | Exact coverage | Disposition | v2 owner／condition |
|---|---:|---|---|
| CONSTRUCTION_REGISTRY[*] | 8/8 | REPLACED_BY_V2_OWNER | predicate-owned F01–F22＋particle rule exact42／surface variant exact59。unreachable grounded actor-targetは移植0 |
| EXPRESSION_ASSET_REGISTRY[*] | 17/17 | REPLACED_BY_V2_OWNER | sense exact17＋frame/head exact22 |
| RELATION_MORPHOLOGY_ASSET_REGISTRY[*] | 5/5 | REPLACED_BY_V2_OWNER | ClauseLinkRule exact10＋frame internal owners |
| SCALAR_MORPHOLOGY_ASSET_REGISTRY[*] | 19/19 | REPLACED_BY_V2_OWNER | PredicateMorphologyPlan。completed carrier移植0 |
| SOURCE_SCALAR_MORPHOLOGY_ASSET_REGISTRY[*] | 4/4 | REPLACED_BY_V2_OWNER | SourceLeaf mode exact5。suffix rewrite移植0 |
| RESPONSE_OBJECT_ASSET_REGISTRY[*] | 3/3 | REPLACED_BY_V2_OWNER | ReferenceZeroTopicRule exact12 |
| FUNCTIONAL_ASSET_REGISTRY top-level rows | 4/4 | REPLACED_BY_V2_OWNER | typed complement／morphology／link registries |
| PARTICIPANT_ASSET_REGISTRY[*] | 2/2 | RETAIN_AS_ATOMIC_LEAF | あなた／Emlis participant refs |
| STRUCTURAL comma、sentence、quote-open、quote-close | 4/4 | RETAIN_AS_ATOMIC_LEAF | registered structural token |
| STRUCTURAL 。また、／ということ | 2/2 | REPLACED_BY_V2_OWNER | atomic また、という、内容のみlicensed ownerで再登録。universal fragment 0 |
| PROFILE_RULE_REGISTRY[*] | 8/8 | RETAIN_AS_ATOMIC_LEAF | existing DiscoursePreferenceProfile。v2 local exact7は別低位owner |
| LEGACY_COMPOSITION_SEAM_SYMBOL_SET_EXACT18[*] | 18/18 symbols | REPLACED_BY_V2_OWNER | source／frame／head／reference／link／morphology／IR ownerへtotal mapping |
| active CMEE_STAGE1_MICROGRAMMAR_INVENTORY_TUPLE[*]＋its transitive AST closure | 44/44 sections、response blob 994c9a…でclosed | UNREACHABLE_AFTER_ACTIVATION → DELETE_ONLY_AFTER_UNREACHABLE_PROOF | N4 non-call proof後もsame unit内で物理削除0。別approved cleanup unitだけ |
| predecessor unit identity＋v1 policy identities | bounded historical identity families only | HISTORICAL_REFERENCE_ONLY | runtime selection 0、new v2 manifestへのdual read0 |
| compile_stage1_response symbol | exact1 | RETAIN_AS_ATOMIC_LEAF | signature維持、N4 bodyだけv2 delegateへ置換 |

DELETE_ONLY_AFTER_UNREACHABLE_PROOFはN4で削除を許す分類ではない。activation後のnon-call proofとMash verdict後、別authorityがある場合にだけ物理削除を検討する。v2 active pathからlegacy bankを呼ぶfallbackは0。

### 9.3 current-to-v2 function map

| Current owner | v2 action |
|---|---|
| project_subjective_meaning_plan | unchanged semantic owner |
| project_stage1_discourse_arc | unchanged discourse owner |
| _project_duties | unchanged |
| _clause_plan | intent、frame、slot、morphology projectionへ分割 |
| select_eligible_constructions | select_case_frame exact1へ置換 |
| _source_expression | SourceLeafToken＋SourceComplementPlanへ置換 |
| _expression_asset | sense＋selected frame→head exact1へ置換 |
| _response_object_surface | typed reference／mention planへ置換 |
| _functional_surface_lexemes_by_role | scope-bound morphologyへ置換 |
| _relation_endpoint_particle | frame particle ownerへ移す |
| _generic_relation_fragment_* | phrase branch廃止 |
| _surface_for_plan | build_japanese_clause_ir＋linearize_japanese_clauseへ分割 |
| _normal_form_phase_* | rendered textでなくtyped IR exact6 |
| _project_post_normalization_defect_rows | grammar typed invariantを追加 |
| derive_discourse_preference_profile | existing exact8を維持、hard gate後にlocal exact7 |
| compose_stage1_from_projection | sole Step 2 facade、Stage A/B reducer、emitted max2維持 |

---

## 10. candidate、normal form、rank

### 10.1 candidate bound

外部contract internal ≤32／emitted ≤2を維持し、v2内部は≤16とする。

| Whole-plan axis | Max |
|---|---:|
| layout／grouping | 4 |
| mention policy | 2 |
| link placement | 2 |
| predicate head fork | 1 |
| total | 16 |

referent／relationごとの独立bit列挙は0。上限超過時はtruncateせず CANDIDATE_BOUND_STOP。

### 10.2 exact6 normal form

1. nonmaterial duty suppression
2. dependency-preserving merge／split
3. information／relation order
4. grouping後のreference／speaker／link recalculation
5. frame／complement／topic／morphology bindingとIR-only local repair
6. sole linearization＋grammar seal

allowed repair exact4は、ambiguous anaphorのfull expression化、overloaded exact2-clause unitのsplit、redundant connective除去、licensed topic alternantのbase case化だけ。各candidate／repair kindごとexact1、candidate fork 0、retry loop 0。semantic digest、source ref、relation direction、polarity、modality、time、speaker authorityは変更不可。defect tupleがstrict decreaseしなければSTOP。

### 10.3 rank

lexicographic orderは次である。

1. semantic／source／Safety／unknown hard validity
2. frame totality、complement compatibility、finite closure
3. reference uniqueness、relation realization exact1、connective license
4. existing DiscoursePreferenceProfile exact8
5. JapaneseLocalPreferenceProfile exact7
6. canonical visible equivalence dedupe

weighted naturalness score、human-score imitation、head repetition preferenceは0。異なるvisible surfaceが全typed profileで同率なら、hash／IDで自然さを選ばず IDIOMATIC_PREFERENCE_NONUNIQUE_STOP。

---

## 11. identity、versioning、activation boundary

### 11.1 identity changes

| Identity | Final design action |
|---|---|
| public CMEE_STAGE1_RESPONSE_SCHEMA_VERSION | unchanged |
| CMEE_STAGE1_SUBJECTIVE_PROPOSITION_SCHEMA_VERSION | unchanged |
| CMEE_STAGE1_COMPOSITION_POLICY_VERSION | v1 → v2 |
| CMEE_STAGE1_NORMAL_FORM_VERSION | v1 → v2 |
| CMEE_STAGE1_CONSTRUCTION_GRAMMAR_POLICY_VERSION | v1 → v2 |
| LANGUAGE_CORE_IDENTITY | N2 product-causal AST closure＋manifest exact16からfresh recompute |
| STAGE1_RUNTIME_INTEGRATION_IDENTITY | N4 facade activation後のwhole-file payloadからfresh recompute |
| old unit／counter | immutable、reuse 0 |

public response field、upstream semantic fieldが必要なら PUBLIC_CONTRACT_SCOPE_EXPANSION_STOP。current finalを拡張しない。

### 11.2 N2 product-causal symbols

N2で次をすべて完成し、N3前にidentityへ含める。

- contracts.py: private v2 grammar／derivation typesとanti-template value invariant
- composition.py: source mode、case frame、head、reference、link、morphology、IR、normalizer、rank、linearizer、registry、validator
- response.py: build_subjective_planning_inputs、seal_stage1_projection、build_surface_composition_inputs、registry snapshot wiring
- N4で呼ぶ preactivated _adapt_v2_composed_units_to_realized_units と _compile_stage1_response_v2_candidate
- policy／version／manifestとLANGUAGE_CORE_PRODUCT_CAUSAL_OWNER_MANIFEST

N4用helper、import、manifest seedをN4へ先送りしない。N2完了時に N3_LANGUAGE_CORE_IDENTITY とowner-symbol manifest digestをfreezeする。

N2のproduct-causal behavior root seedsはexact22で固定する。新type、enum、registry rowは V2_GRAMMAR_INVENTORY のcanonical manifest dependency、private helperは下記rootのtransitive AST closureとしてLANGUAGE_CORE_IDENTITYへ含める。変更helperがどのrootからも到達しない場合は LANGUAGE_CORE_UNOWNED_SYMBOL_DRIFT_STOP。

    N2|contracts.py|CMEE_STAGE1_FINAL_LOGICAL_ID_REGISTRY
    N2|contracts.py|validate_stage1_anti_template_registry_invariant
    N2|emlis_stage1_composition.py|V2_GRAMMAR_INVENTORY
    N2|emlis_stage1_composition.py|validate_v2_grammar_inventory
    N2|emlis_stage1_composition.py|project_source_leaf_group
    N2|emlis_stage1_composition.py|select_source_complement_plan
    N2|emlis_stage1_composition.py|select_case_frame
    N2|emlis_stage1_composition.py|select_atomic_predicate_head
    N2|emlis_stage1_composition.py|project_argument_realization_plan
    N2|emlis_stage1_composition.py|project_reference_state
    N2|emlis_stage1_composition.py|project_clause_link_plan
    N2|emlis_stage1_composition.py|project_predicate_morphology_plan
    N2|emlis_stage1_composition.py|build_japanese_clause_ir
    N2|emlis_stage1_composition.py|linearize_japanese_clause
    N2|emlis_stage1_composition.py|normalize_to_normal_form
    N2|emlis_stage1_composition.py|derive_discourse_preference_profile
    N2|emlis_stage1_composition.py|compose_stage1_from_projection
    N2|emlis_stage1_response.py|build_subjective_planning_inputs
    N2|emlis_stage1_response.py|seal_stage1_projection
    N2|emlis_stage1_response.py|build_surface_composition_inputs
    N2|emlis_stage1_response.py|_adapt_v2_composed_units_to_realized_units
    N2|emlis_stage1_response.py|_compile_stage1_response_v2_candidate

project_subjective_meaning_planとproject_stage1_discourse_arcはsole semantic／discourse rootsとしてidentityへ残すが、N2 behavior rootsではなくbyte-unchangedを要求する。

identity infrastructureのdirect changed symbolsは次のexact5へ分離する。

    N2_IDENTITY_INFRASTRUCTURE_CHANGED_SYMBOL_SET_EXACT5 =
      LANGUAGE_CORE_PRODUCT_CAUSAL_OWNER_MANIFEST
      _validate_product_causal_owner_manifest
      stage1_runtime_integration_identity_payloads
      _language_core_source_owner_payloads
      language_core_identity_payloads

exact5はv2 seed追加、manifest exact9再編、AST closure validation、payload cardinality exact16だけを変更し、text generation、selection、normalization、rankを所有しない。N2で許されるruntime AST changeは、behavior root exact22のtransitive closureまたはidentity infrastructure exact5だけである。そのunion外のtop-level owner変更、global side effect、public schema mutationはN2_SCOPE_DRIFT_STOP。

LANGUAGE_CORE_IDENTITY payload cardinality exact16も次で固定する。AST closure exact7＋canonical manifest exact9であり、順序変更もidentity changeである。

    LCI_PAYLOAD|01|composition AST closure|project_subjective_meaning_plan,project_stage1_discourse_arc,compose_stage1_from_projection,normalize_to_normal_form,derive_discourse_preference_profile,_derive_discourse_preference_profile_with_frozen_applicability,V2_GRAMMAR_INVENTORY,validate_v2_grammar_inventory
    LCI_PAYLOAD|02|contracts AST closure|stage1_canonical_json_bytes,stage1_subjective_forbidden_promotions,_stage1_material_visible_value_refs,project_stage1_projection_preimage_ref,project_stage1_subjective_basis_binding_ref,project_stage1_source_qualifier_binding_ref,project_stage1_policy_basis_binding_ref,validate_stage1_projection,validate_stage1_sentence_unit,validate_stage1_anti_template_registry_invariant
    LCI_PAYLOAD|03|response AST closure|project_direct_argument_bindings,_candidate_from_direct,_candidate_for_contribution,resolve_candidate_for_contribution,_qualifier_value,resolve_qualifier_value,build_subjective_planning_inputs,seal_stage1_projection,build_surface_composition_inputs,_adapt_v2_composed_units_to_realized_units,_compile_stage1_response_v2_candidate
    LCI_PAYLOAD|04|emlis_v1a AST closure|_ordered,_planned_visible_source_ids,_build_graph,_build_experience_plan
    LCI_PAYLOAD|05|grounded plan AST closure|build_grounded_observation_plan,build_final_stage1_grounded_observation_plan,validate_grounded_observation_plan
    LCI_PAYLOAD|06|composer AST closure|generate_core_text
    LCI_PAYLOAD|07|adapter AST closure|build_emlis_observation_core_payload,evaluate_emlis_observation_candidate
    LCI_PAYLOAD|08|manifest|contract
    LCI_PAYLOAD|09|manifest|case_frame_and_particle
    LCI_PAYLOAD|10|manifest|predicate_sense_and_atomic_head
    LCI_PAYLOAD|11|manifest|source_complement_reference
    LCI_PAYLOAD|12|manifest|morphology_link_functional
    LCI_PAYLOAD|13|manifest|participant_structural
    LCI_PAYLOAD|14|manifest|policy_and_closed_enum
    LCI_PAYLOAD|15|manifest|normal_form_and_profile
    LCI_PAYLOAD|16|manifest|product_causal_owner_and_registry_digests

N2 endでexact16各payloadのSHA-256、ordered tuple SHA-256、behavior root exact22のtransitive AST closure symbol set／bytes、identity infrastructure exact5のAST diffをfreezeする。N3 runnerはそのsame ordered tupleとsymbol setsを再計算し、literal equalityがなければbody generation前にSTOPする。

### 11.3 N4 allowed change exact1

N4 changed AST symbol exact setは次だけ。

    ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py
      ::compile_stage1_response

bodyがN2完成済み _compile_stage1_response_v2_candidate をexact1 callし、そのreturnをそのまま返す。signature、import、__all__、registry、policy／version、identity seed、Phase A/B builders、adapter、composer、normalizer、ranker、linearizerは変更0。

必須identity関係は次である。

    LANGUAGE_CORE_IDENTITY_N4 == N3_LANGUAGE_CORE_IDENTITY
    STAGE1_RUNTIME_INTEGRATION_IDENTITY_N4 != N3_RUNTIME_INTEGRATION_IDENTITY

response whole-file bytesが変わるためruntime integration identityのfresh化はexpectedである。N4 AST changed symbolがexact1でない、またはlanguage identityが変わる場合は LANGUAGE_CORE_ACTIVATION_DRIFT_STOP。N3 CLEAR継承0。必要変更をN2 behaviorへ戻し、fresh identity、fresh admission、fresh N3が必要であり、same-attempt retryにはしない。

---

## 12. future implementation changed-path envelope exact12

本節のexact12はI00以降の将来実装envelopeであり、今回のfinal design docs publication exact4へ加算しない。今回のGitHub writeはCocolonだけで、次のnew exact1＋modify exact3である。

1. `Cocolon_前提資料/designs/cmee/Cocolon_CMEE_Stage1_RouteA_TypedJapaneseCaseFrameRealizerV2_UltraFinalTechnicalDesignAndImplementationOrder_20260827.md`（new）
2. `Cocolon_前提資料/designs/cmee/v1/00_read_first.md`（modify）
3. `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md`（modify）
4. `Cocolon_前提資料/current_structure/04_cmee_current_structure.md`（modify）

今回のsource、test、runtime、API、DB、RN、private body、activation、production effectは0である。

### 12.1 mashos-api exact7

1. ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py
2. ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py
3. ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py
4. ai/tests/test_cmee_v1a_i1sx_contracts.py
5. ai/tests/test_cmee_v1a_i1sx_vertical.py
6. ai/tools/cmee_v1a_i1sx_candidate_run.py
7. ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md

### 12.2 Cocolon exact5

8. Cocolon_前提資料/designs/cmee/v1/02_emlis_v1a_detailed_design.md
9. Cocolon_前提資料/designs/cmee/v1/05_json_schema_and_versioning.md
10. Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md
11. Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md
12. Cocolon_前提資料/current_structure/04_cmee_current_structure.md

    FINAL_CHANGED_PATH_COUNT = 12
    RUNTIME_PATH_COUNT = 7
    DESIGN_PATH_COUNT = 5

02_emlis_v1a_detailed_design.mdはcase-frame、source mode、linearizer、identity／activation技術正本を所有する。01_emlis_ai_current_structure.mdはcurrent compiler／candidate／call chain／activation stateを所有する。05はprivate grammar types／version／count／digest、06はN0–N6、§20 Step 0–14 mapping、attempt、evidence、checkpoint、STOPを所有し、04はCMEE active owner／runner ingress／cutoverを所有する。各Stepは本exact12の許可subsetだけを使い、actual changed pathsをterminal checkpointへ記録する。

### 12.3 unchanged actual call chain

emlis_v1a.py blob 4ebfa9ec88112c0e5d1b2c90481043ca18b06be5 はunchangedとする。active actual call chainは次である。

    MeaningExperienceEngine.generate
    → emlis_v1a.build_text_grounded_limited_artifact
    → emlis_v1a._realize_cmee_experience
    → imported emlis_stage1_response.compile_stage1_response exact1
    → visible lines / trace / artifact seal

compile_stage1_responseの引数 source、grounded_graph、parent_plan、grounded_plan と、return EmlisStage1Projection＋tuple[RealizedSentenceUnit,...] を維持する。response側facade bodyだけをv2 presealed helperへ切り替えるため、emlis_v1a.pyのimport、call site、visible-line、trace、artifact pathは変更不要である。

early runnerは build_subjective_planning_inputs → project_subjective_meaning_plan → seal_stage1_projection → build_surface_composition_inputs → compose_stage1_from_projection を直接exact1呼ぶため、N3はactive facade未接続のままN2完成済みsame language coreを評価できる。

emlis_ai_grounded_observation_plan.py、emlis_v1a.py、source kernel、public API／DB／RN／persistence／production route、dependency manifestはunchanged。exact12外が必要なら CHANGED_PATH_ENVELOPE_STOP。実装途中で黙って増やさない。

---

## 13. verification design

### 13.1 machineが証明する範囲

- semantic、source、owner、Safety、unknown fidelity
- polarity、modality、time、relation direction、speaker authority保存
- case frame exact1、required slot exact1、extra slot 0
- case particle owner exact1、complement compatibility
- frozen registry count、canonical literal、digest一致、unlicensed／orphan row 0
- atomic head exact1、morphology paradigm exact1
- finite head／matrix terminal exact1
- source scope／matrix scope disjoint
- SourceLeaf byte preservation、delimiter／terminal owner、visible derivation exact cover
- antecedent exact1、zero／topic license exact1
- relation realization exact1、connective license、double mark 0
- normal form exact6、idempotence、determinism
- candidate bound、repair monotonicity、typed tie STOP
- manifestから導出したbase surfaceが§5.4 skeleton exact22とbyte一致
- active facade exact1、legacy／shadow／fallback calls 0
- external AI、provider、network、dependency、body send 0

machine GREENはidiomatic Japanese、華恋／Emlis voice、Product PASSを証明しない。

### 13.2 mutation registry exact273

約60–100というrangeを廃止する。MUTATION_CASE_REGISTRYは stable-sort[(eligible frozen row, applicable mutation operator)] で生成し、inapplicable rowを数えない。

| Mutation operator | Frozen base rows | Exact cases |
|---|---:|---:|
| PARTICLE_DROP | CaseParticleSurfaceVariant 59 | 59 |
| PARTICLE_DUPLICATE | CaseParticleSurfaceVariant 59 | 59 |
| PARTICLE_WRONG_SWAP | CaseParticleSurfaceVariant 59 | 59 |
| REQUIRED_SLOT_DROP | required frame slots 42 | 42 |
| COMPLEMENT_SWAP | SenseComplementLicense 22 | 22 |
| FINITE_TO_CONTINUATIVE | MatrixMorphologyParadigmSpec 22 | 22 |
| ILLEGAL_CONNECTIVE | ClauseLinkRule 10 | 10 |
| Total | — | 273 |

本V2ではComplementRuleSpecがC02–C09のexact8、SourceClassifierSpecがCL01–CL05のexact5へ変わった一方、mutation baseであるCaseParticleSurfaceVariant 59、required frame slots 42、SenseComplementLicense 22、MatrixMorphologyParadigmSpec 22、ClauseLinkRule 10は不変である。上表をfresh再計算した結果は `59×3＋42＋22＋22＋10＝273` であり、旧値の転記ではない。

wrong targetは次のclosed mapping exact1からだけ作る。

    PARTICLE_WRONG_TARGET =
      が→を
      は→を
      を→が
      と→を
      のあとに→によって
      によって→のあとに
      から→に
      に→から

    COMPLEMENT_WRONG_TARGET =
      C02→C03→C04→C05→C06→C07→C08→C09→C02

    LINK_WRONG_TARGET =
      L01→L02→L03→L04→L05→L06→L07→L08→L09→L10→L01

COMPLEMENT／LINKはselected licensed rowと異なるnext rowを差し込み、意味selectorとして使わない。FINITE_TO_CONTINUATIVEはMP01–MP22ごとにregistered finite chainのterminal／politenessを外したclass-specific nonfinite form exact1へ置換する。各mutated case identityは base row ID＋operator ID＋wrong target ID のcanonical tupleで一意である。

    EXACT_MUTATION_CASE_COUNT = 273
    MUTATION_RUN / RETRY / RERUN = 1 / 0 / 0
    INVALID_CASE_REACHES_RANK = 0
    INVALID_CASE_REACHES_LINEARIZATION = 0

registry countまたはlicense countが変われば273を自動調整してよい、という意味ではない。final manifest driftとしてSTOPし、fresh design identityが必要である。

### 13.3 source boundary enumeration

primitive leaf shape predicateは extent exact2 × sentence exact2 × terminal exact4 × quote topology exact4 × linebreak exact3 ＝ exact192を全列挙し、各rowをadmissibleまたはnamed STOPへ分類する。group cardinality rows exact2、mode exact5 × cardinality exact2のcompatibility rows exact10、quote delimiter rules exact4を加え、source boundary table subcasesはexact208とする。

ORDERED_EXACT2ではleaf1とleaf2へsame exact192 predicateを独立適用する。group／coordinator logicが読むのはordered leaf refsとcardinalityだけで、leaf shape同士のcouplingは0である。このcompositional invariantにより192²の異種pairも二つのindependent leaf proofでcoverし、36,864 rowsをcollectionへ展開しない。group logicがterminal、quote、newline、extentを読む変更は SOURCE_PAIR_SHAPE_COUPLING_STOP。

shape-preserving payload mutationではpayload bytesだけを替え、mode、frame、head、functional scaffold IDsが不変であることを証明する。unbalanced quote、lone CR、mixed newline、uncertified subspan、pair cardinality 1／3をnamed STOPとして検査する。

### 13.4 new named tests exact8

既存exact2 test filesへ追加し、新test file、新checker family、external dependencyは作らない。

1. test_route_a_registered_surface_assembly_is_morphosyntactically_closed
2. test_route_a_illegal_morphosyntactic_join_stops_before_rank
3. test_route_a_normal_form_preserves_grammar_plan_and_is_idempotent
4. test_route_a_shape_preserving_source_mutations_preserve_functional_scaffold
5. test_route_a_semantic_role_mutations_change_only_licensed_grammar_slots
6. test_route_a_source_leaf_modes_preserve_bytes_and_ownership
7. test_route_a_frame_and_atomic_head_selection_are_distinct_and_total
8. test_route_a_activation_changes_only_facade_and_runtime_identity

existing 183＋new exact8＝191 named test functionsをexpected baselineとする。mutation273とsource208はnew exact8 functions内部のclosed table-loop subcasesであり、pytest parameterized collection itemへ展開せず191へ加算しない。function collection count driftは採取時に原因を説明し、無断で191をbaseline化しない。

### 13.5 strengthen existing tests exact3

1. test_known_exact4_final_api_generates_source_bound_actual_japanese
   - source binding、duty coverageにtyped grammar closureとderivation exact coverを追加
2. test_early_exact8_calls_only_the_final_step2_production_chain
   - same v2 core、legacy／provider／formal facade non-callを確認
3. test_early_exact8_is_body_isolated_identity_bound_and_machine_clear
   - frozen input、body boundary、language identity、formal denominator effect 0を確認

### 13.6 humanだけが判定する範囲

    ULTRA_CORRECTED_GRAMMAR_HUMAN_READ_ATTEMPT_ID = ULTRA_CORRECTED_GRAMMAR_HUMAN_READ_ATTEMPT_01
    TARGET = FRAME_SURFACE_SKELETON_V2
    TARGET_ROW_COUNT = 22
    READ / REREAD = 1 / 0
    ROW_READ = 22_OF_22
    ULTRA_BASE_SKELETON_DISPOSITION = NO_REMAINING_GRAMMATICAL_OR_COLLOCATION_NONCLEAR_FOUND_22_OF_22
    PRO_DELTA_FINAL_CHECK_DISPOSITION = NOT_RUN_ON_CORRECTED_V2
    PRO_VERIFIED_CURRENT_BODY_CLEAR = false
    MASH_FINAL_DESIGN_ACCEPTANCE = APPROVED
    PRODUCT_PASS = 0

Proが指定したF10／F13／F15／F21を全件修正したうえで、F01–F22を§5.4の順に一行ずつ読んだ。追加でF01の任意長quote直接主語化、F02の `向き`、F03の `重さ`、F04のprogressive passiveをNONCLEARとして修正した。F19の `選択を見守りたいです` はnon-intervention meaningと両立する有効なcollocationとして保持した。このattemptはplaceholder skeletonの設計時pre-screenであり、runtime output、private body、N3／N5 set、Pro CLEAR、Mash Product Readではない。Mashのfinal design acceptanceも、実装後のPro pre-screenまたはMash Product Readを代替しない。

- idiomatic Japanese、collocation
- head、ellipsis、topic、connectiveの語用的自然さ
- 華恋／Emlis voice、温度、読後感、記録価値
- set-levelの機械感、template concentration
- actual beforeからafterへの商品改善
- Product acceptance

新しいnaturalness checker、score、Gate、Receipt authority familyは0。既存machine gate、Ultra／Pro pre-screen、Mash Product Readを別claimとして維持する。

---

## 14. set、attempt、read、retention identities

### 14.1 formal input identity

    FORMAL_INPUT_IDENTITY = {
      fixture_id,
      denominator_id,
      axes_identity,
      ordered_inputs_exact8
    }
    FORMAL_CASE_ORDER = SX-01,SX-02,SX-03,SX-04,SX-05,SX-06,SX-07,SX-08
    FORMAL_DENOMINATOR = EXACT8

historical combined hash dbb2cb8a…を盲目的に再利用しない。approvalでbindされたfresh base headsに対し、runner literal、EXACT8 order、axes literal、canonical input bytesをN0でfresh recomputeする。beforeとafterではFORMAL_INPUT_IDENTITYのliteral equalityを要求する。runner file SHAは実装で変わり得るため別々にbindするが、fixture、order、denominator、axes、presentation semanticsのdeltaは0。

### 14.2 distinct identities exact5

| Identity | Attempt／run | Human read | Retention | Reuse boundary |
|---|---|---|---|---|
| BASELINE_FORMAL_PRODUCT_SET_EXACT8 | BASELINE_FORMAL_PRODUCT_ATTEMPT_01、RUN/RETRY/RERUN=1/0/0 | N0は0。N5 Pro pair read、N6 Mash pair readにだけ含む | N0 durable readback後からN6 verdict dual-postverifyまで | early／別unitへreuse 0 |
| SUCCESSOR_EARLY_LANGUAGE_SET_EXACT8 | SUCCESSOR_EARLY_LANGUAGE_ATTEMPT_01、RUN/RETRY/RERUN=1/0/0 | Ultra known-only SUCCESSOR_EARLY_ULTRA_KNOWN_READ_ATTEMPT_01=1/0、Pro combined SUCCESSOR_EARLY_PRO_COMBINED_READ_ATTEMPT_01=1/0、Mash=0 | N3 decision dual-postverifyまで | formal／Mash evidenceへreuse 0 |
| AFTER_FORMAL_PRODUCT_SET_EXACT8 | AFTER_FORMAL_PRODUCT_ATTEMPT_01、RUN/RETRY/RERUN=1/0/0 | Ultra after-only=1/0、Pro bound pairのmember、Mash bound pairのmember | N6 verdict dual-postverifyまで | early／別unitへreuse 0 |
| FORMAL_PRODUCT_PRESCREEN_SET_EXACT8 | FORMAL_PRODUCT_PRESCREEN_ATTEMPT_01。baseline digest＋after digest＋formal identityから作るpaired-row exact8 view、regeneration 0 | Ultra=0 on this identity。Pro before／after individual＋pairwise＋set-level exact1 | N5 decision後prescreen auxiliary cleanup、underlying pairだけretain | Mash presentation identityへそのままreuse 0 |
| MASH_PRESENTED_FORMAL_PRODUCT_PAIR_BEFORE_EXACT8_AFTER_EXACT8 | MASH_PRODUCT_READ_ATTEMPT_01。baseline digest＋after digest＋formal identity＋presentation formatからsame-byte view | PRESENTATION/READ/REREAD/VERDICT_ATTEMPT=1/1/0/1 | verdict receipt dual-postverifyまで | redisplay、差替え、再生成0 |

baselineとafterは各SX-iごとにpairにする。pair row countは8であり、16 independent product casesではない。member orderはbefore→after、各member内はSX-01→SX-08で固定する。

### 14.3 retentionとunknown handling

- baselineはfresh write後にdurable readback exact1を行う。
- early setはN3 terminal／CLEAR decisionの両repo postverify後にinput master、auxiliary、outputをactive cleanupする。
- N5 CLEARならformal review auxiliaryをcleanupし、underlying before／after pairだけN6まで保持する。
- presentation／receipt stateがunknownならbodyを再提示しない。body-free SEEN／NOT_SEEN acknowledgementだけを許す。
- verdict receiptがunknownならsame-verdict re-attestationだけを許し、Product Readをやり直さない。
- physical erasureの未確認をverified deletionと表現しない。unknownはquarantineする。

### 14.4 session-switch-safe atomic checkpoint contract

N0–N6はsemantic gate、§20のStep 0–14はsession作業単位である。各Stepはexact owner、exact path subset、独立verification、既存owner内のbody-free checkpointを持つ。`COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED`だけを安全なsession切替点とし、次Stepは自動開始しない。

1. runtime／test／runner／body-free handoffは `MassyuRed/mashos-api`、canonical sync／body-free completion blockは `MassyuRed/Cocolon` へ、runtime first→design secondの順で反映する。runtime ownerは既存 `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md`、design ownerは既存 `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` とし、新しいcheckpoint file familyを作らない。
2. first effect前にfinal design ID／external SHA、Mash approval ID／scope、predecessor Step、両Draft branchとfresh heads、other-repo dependency head、allowed exact paths、target existence／mode／bytes／final-LF／blob／raw SHA preimageをbindする。unrelated HEAD advanceはtargetとrelevant dependencyが同一ならfresh rebindし、conflictは `STEP_PREIMAGE_DRIFT_STOP`。
3. local-only changed bytesまたはprivate reconstruction dependencyが生じた場合だけ、approved durable ownerへlossless prepared bundle exact1を保存してfresh readbackする。scratch pathまたはhashだけを継続根拠にせず、private bodyはGitHubへ置かない。
4. Step write orderは prepare→必要時durable readback→runtime write／fresh target-byte・changed-path・latest-head postverify→Cocolon sync write／同postverify→terminal checkpoint fresh readback とする。GitHub機能上のcommit group `1..n`を許容し、single commit、CAS、全tree／全unchanged-path取得を追加条件にしない。
5. runtime側だけ完了した場合は `RUNTIME_REMOTE_POSTVERIFIED_DESIGN_SYNC_PENDING` とし、次sessionはCocolon syncだけを行う。runtime code、test、generation、human readを再実行しない。intended postimageがremoteにあればrewriteせずpostverify／receiptだけを完了し、preimageならunconsumed writeとしてfresh validation後に再開する。mixed pre／postはbound bundleから不足だけを閉じ、third-state／取得不能／relevant driftは `RESULT_UNKNOWN_STOP` でblind retryしない。
6. terminal時は `LOCAL_UNCOMMITTED_TARGET_DELTA=0`、`LOCAL_ONLY_RECONSTRUCTION_DEPENDENCY=0`、`SAFE_SESSION_SWITCH=true` をremote evidenceで確認する。private artifactはbody-free identity、digest、retention／cleanupだけをpublic checkpointへ残す。

各terminal checkpointのminimum fieldsは次である。

    CHECKPOINT_SCHEMA = CMEE_ROUTE_A_V2_STEP_CHECKPOINT_V1
    UNIT_ID / STEP_ID / SEMANTIC_GATE / PAIR_ID
    STEP_STATE
    FINAL_DESIGN_ID / FINAL_DESIGN_SHA256_EXTERNAL_BINDING
    APPROVAL_ID / APPROVED_SCOPE
    PREDECESSOR_CHECKPOINT_ID
    REPOSITORY / BRANCH / PRE_HEAD / FINAL_HEAD / OTHER_REPO_HEAD
    WRITE_COMMIT_GROUP = ordered 1..n
    ALLOWED_PATHS / ACTUAL_CHANGED_PATHS
    PREIMAGE_MANIFEST_SHA256 / POSTIMAGE_MANIFEST_SHA256
    PREPARED_BUNDLE_ID / SHA256 / FRESH_READBACK = value | NOT_REQUIRED
    TEST_OR_READ_IDENTITY / DENOMINATOR / RESULT
    RUN / RETRY / RERUN / READ / REREAD
    PRIVATE_ARTIFACT_IDENTITY / BODY_FREE_DIGEST / RETENTION
    REMOTE_BYTES / CHANGED_PATHS / LATEST_HEAD_CONTAINS_ALL
    PRIMARY_OUTCOME = PRODUCT_CREDIT | TECHNICAL_CREDIT | BLOCKER_NARROWED | ADMINISTRATIVE_ONLY
    STOP / NON_REUSABLE_EVIDENCE / NEXT_STEP
    AUTOMATIC_PROGRESSION = false
    SAFE_SESSION_SWITCH = true | false

新sessionのfirst actionは、current rules、本final design、両continuity owner、latest relevant checkpointをfresh取得し、両PR headsとtarget bytesを再照合することである。Python／pytest readinessは `CURRENT_CONTINUITY_UNVERIFIED` へ戻し、current sessionでadmitted exact runtimeだけをfresh確認する。chat、scratch、subagent output、prior READY、記憶したhashをStep進行根拠にしない。formal generation／human readはlaunch時にattemptを消費し、unknownをrerun／rereadしない。GitHub reconciliationはproduct rerunに数えない。

---

## 15. one bounded unit execution order N0–N6

N0–N6はsemantic gateであり、session作業単位ではない。Mashはsource corrected V2 SHA-256、本final designへのsession-safe実装順追加、Route A exact1、旧counter 2/2不変を直接bindして最終設計を承認した。Pro delta final checkはNOT_RUNであり、Pro CLEARとは記録しない。実装は、MashがI00をfreshに明示開始した後だけ、§20のStep 0–14をexact1ずつ実行する。各N／各Stepは独立product outcomeではなく、Step完了から次Stepへのautomatic progressionは0である。

### N0 — fresh admission＋baseline actual before

1. fresh BASELINE_RUNTIME_HEAD、BASELINE_DESIGN_HEAD、final body SHA、exact12 pathsをbind。
2. old terminalとcounter 2/2 immutableを確認。
3. Mashの本final decisionでsuccessor early exact1へ限定rebindされたretained input authorityをfresh照合し、formal runner、SX-01..SX-08、exact12 axes、FORMAL_INPUT_IDENTITYをfresh freeze。Step 6まではprivate input利用0。
4. いかなるruntime behavior変更より前に、approved base headsで BASELINE_FORMAL_PRODUCT_SET_EXACT8 をexact1生成。
5. durable save＋fresh readback exact1。RUN/RETRY/RERUN=1/0/0。
6. human read 0、Product verdict 0、old Step 3 counter effect 0。
7. external AI、provider、network、dependency、fallback 0を再確認。

baseline captureはfresh successor unitの比較証拠であり、旧Step 3 retry、old output reconstruction、Product PASSではない。

### N1 — register-disabled implementation

- v2 private types、frozen registries、version、invariantsをsame Draft branchesへ実装。
- active legacy facadeは切り替えない。
- body generation、credit、independent completion 0。

### N2 — all product-causal language behavior

- source、frame、head、reference、link、morphology、IR、normalizer、rank、linearizer、preactivated adapterを完成。
- final registry manifest literal equality、digest、mutation exact273を検証。
- existing183＋new8、source exact208、A/B/A、idempotence、identity mutationをpublic typed fixturesだけで実行。
- public verification中human body read 0。
- N2完了後 N3_COMPOSER_RUNTIME_HEAD、N3_COMPOSER_DESIGN_HEAD、N3_LANGUAGE_CORE_IDENTITY、owner-symbol manifestをfreeze。

source capability gapが判明したらN3へ進まずterminal STOP。upstream fieldを自動追加しない。

### N3 — SUCCESSOR_EARLY_LANGUAGE_SET_EXACT8 exact1

- known4＋retained withheld4をfresh output exact1として生成。
- run／retry／rerun=1/0/0。
- Ultraはknown4だけをtechnical read exact1、reread0。
- Proはsame new known4＋withheld4 combined setをlanguage read exact1、reread0。
- Mash read0、formal denominator effect0。
- old private outputの再構成／再読0。

machine、Ultra、Proのいずれかnonclearならdecisionを保存してterminal STOP。same unit correction loop、counter increment、automatic retryは0。

### N4 — compile facade activation exact1

N3 machine／Ultra／ProがすべてCLEARの場合だけ、compile_stage1_response body exact1をN2 presealed helperへdelegateする。

- N4 AST changed symbols exact1
- emlis_v1a.py、contracts.py、composition.py、runner、registry、manifest、adapter変更0
- text、binding、derivationをsame objectから返し、text reparse 0
- active facade／owner exact1
- legacy、shadow、dual-run、fallback 0
- LANGUAGE_CORE_IDENTITYはN3と同一
- STAGE1_RUNTIME_INTEGRATION_IDENTITYはfresh変更
- activated headsをfresh freezeし、full machine／integration suiteを再実行

identityまたはchanged-symbol driftならN3 evidenceを継承せず LANGUAGE_CORE_ACTIVATION_DRIFT_STOP。

### N5 — after formal＋before/after pre-screen

1. activated headsで AFTER_FORMAL_PRODUCT_SET_EXACT8 をexact1生成。RUN/RETRY/RERUN=1/0/0。
2. baselineとafterのFORMAL_INPUT_IDENTITY、order、denominator、axesをliteral compare。差があれば BEFORE_AFTER_FORMAL_IDENTITY_MISMATCH_STOP。
3. each SX-iのbefore／afterをimmutable pair exact8へbind。
4. machine gateを実行。bodyをmachine receiptへ漏らさない。
5. Ultraはafter-only technical read exact1、reread0。
6. Proはbaseline／after individual、pairwise、set-levelを FORMAL_PRODUCT_PRESCREEN_ATTEMPT_01 でexact1 read、reread0。
7. machine／Ultra／ProのいずれかnonclearならMashへ提示せずterminal cleanup。
8. CLEARならunderlying before／after pairだけをN6までretain。

Ultra／Pro CLEARはProduct PASSではない。

### N6 — Mash Product Read before/after exact1

- MASH_PRESENTED_FORMAL_PRODUCT_PAIR_BEFORE_EXACT8_AFTER_EXACT8をexact1提示。
- same member bytes、same order、replacement 0。
- Mash presentation／read／reread／verdict attempt=1/1/0/1。
- Mashがoverall PASSまたはFAIL exact1を所有。
- verdict-only body-free receiptをfirst write→fresh readback→second repository write→fresh readbackの順でdual-postverify。
- receipt後にmap／handoffをdocs-only同期。
- runtime byte driftが0であることを確認してcleanup。

PASSの場合だけProduct Credit。FAILの場合はProduct Credit 0、automatic correction、retry、next step、counter transition 0。

---

## 16. current Product Read contract

### 16.1 owners

- product上位owner: Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md §10.2／§10.4
- Stage 1 lifecycle owner: Cocolon_CMEE_Stage1_AdditionalCorrection_UltraFinalTechnicalBodyAndJointRecommendation_20260824.md §13.9、§13.11、§14.4–§14.6
- formal fixture／operational axes owner: ai/tools/cmee_v1a_i1sx_candidate_run.py
- current runner review blob: f0876790fd22e2f489fe262c4070487ae3644651

### 16.2 product-level axes exact5

1. 読まれた感
2. 自然さ
3. 非テンプレ
4. 問いの負担
5. また入力したさ

machineが代替しない。問いの負担はcurrent Vertical 1ではquestion lifecycle外であり、別numeric fieldを新設しない。また入力したさも独立numeric captureではなくMashのqualitative overall判断に含める。

### 16.3 formal operational axes exact12

1. PRIMARY_MEANING_RETAINED
2. RELATION_DIRECTION_CORRECT
3. NO_CAUSE_PERSONALITY_DIAGNOSIS_PROMOTION
4. UNKNOWN_BOUNDARY_PRESERVED
5. SELF_DENIAL_NOT_ADOPTED_OR_AMPLIFIED
6. BOUND_EMLIS_RECEPTION
7. SECTION_SEMANTIC_DISTINCTNESS
8. NATURAL_NON_REPETITIVE_SURFACE
9. DISTRIBUTION_NOT_OVERCONCENTRATED
10. DEPTH_PROPORTIONAL
11. NO_FALSE_UNDERSTANDING_COMPLETION
12. IMMEDIATE_OBSERVATION_FEELS_READ

### 16.4 denominatorとverdict

    FORMAL_CASE_ORDER = SX-01..SX-08
    PRODUCT_READ_DENOMINATOR = FORMAL_CASES_EXACT8
    PAIR_ROW_COUNT = 8
    WITHHELD_EXACT4_DENOMINATOR_EFFECT = 0
    AXIS_COUNT_IS_NOT_SCORE_DENOMINATOR = true
    PER_CASE_NUMERIC_SCORE = 0
    PASS_RATE = 0
    NUMERIC_THRESHOLD = 0
    MASH_PRODUCT_VERDICT = ONE_OVERALL_PASS_OR_FAIL
    VERDICT_TUPLE = attempt_id + product_bundle_sha256 + PASS|FAIL

各SX-iのbefore／after memberを個別に読み、memberごとにformal operational axis exact12のqualitative observation exact1ずつを行う。したがって CASE_AXIS_OBSERVATION_COUNT_PER_MEMBER=12、PAIR_MEMBER_COUNT=2、PAIR_ROW_COUNT=8である。これは12点満点、96件の多数決、PASS率ではない。軸1–6と11はmember-level preservation／regressionとbefore-after pairwise差を主に判定する。軸7、8、10、12はmember-level contribution、pairwise差、exact8 set-level patternをすべて再読する。軸9は各memberのconcentration contributionを記述したうえで、exact8 set-level distributionを決定的単位として判定する。全axis observationsの後にbefore set、after set、paired setをset-level exact1 rereadする。

product-level axis exact5は、このformal exact12 reread後にMashがpaired set全体へ行うqualitative judgmentであり、case scoreでもformal axisの別名でもない。semantic／Safety regressionを示す軸1–6または11のNONCLEARはoverall FAILを強制できる。他軸のfindingsは数値集計せず、Mashのsole qualitative overall PASS／FAIL判断をsupportする。axis結果だけから自動PASSを導出しない。

current runnerの `human_product_read.axis_results`、`human_product_read.common_severity`、`human_product_read.accepted` は生成時の `None` のままimmutable unevaluated placeholderとし、body artifactへhuman resultを書き戻さない。これらをcurrent verdict schema、score field、receipt fieldに転用しない。

Pro pre-screenはMash verdictと分離する。Proはmember-level、pairwise、set-levelをexact1読み、`common_blocker_or_major_required=0` の場合だけPRESCREEN_CLEARとする。結果は `prescreen_attempt_id + paired_set_sha256 + PRESCREEN_CLEAR|PRESCREEN_NONCLEAR + common_blocker_or_major_required` だけのseparate body-free receiptへ記録し、axis prose、本文、source literalを含めない。Ultra resultをPro resultへ合算しない。このreceiptはMash Product Readを代替せず、Mashのcanonical verdictは `attempt_id + product_bundle_sha256 + PASS|FAIL` exact1だけである。

initial bodyの read feeling／naturalness／non-template ≥0.90 と wants-more ≥0.80／0.90 を削除する。current contractにnumeric aggregationがないため、exact8で0.90を8/8へ換算する判定もNOT_APPLICABLEである。

MACHINE_GREEN、ULTRA_CLEAR、PRO_CLEARはいずれもPRODUCT_PASSではない。Mash exact1だけがsame immutable before／after pairへoverall PASS／FAILを付す。human verdictをengine、bundle、canonical artifact identityへ書き戻さない。

---

## 17. success、STOP、credit、cleanup

### 17.1 technical success

- exact path、final SHA、head、identity、registry digest一致
- semantic、source、Safety、unknown regression 0
- finished phrase／sentence asset、raw selector、fixture branch 0
- eligible intentがframe exact1、head exact1、またはnamed pre-generation STOP
- invalid grammarのrank／linearization到達0
- source byte／delimiter／terminal provenance exact cover
- external AI、provider、network、dependency、fallback 0
- active facade exact1、legacy active call0
- machine suite、mutation273、source208、A/B/A、idempotence GREEN
- N4 language identity不変、runtime integration identity fresh

### 17.2 language viability success

- early machine known／withheld each CLEAR_4_OF_4
- Ultra early known technical CLEAR
- Pro early combined exact8 CLEAR
- formal after Ultra technical CLEAR
- Pro bound before／after individual＋pairwise＋set-level CLEAR

これはProduct PASSではない。

### 17.3 product success

Mashがsame immutable before／after pairを一度読み、current axesでoverall PASSを出した場合だけ成立する。

### 17.4 terminal STOP

- fresh head、final SHA、path envelope、formal identity drift
- registry count／digest／mutation count drift
- case ID、fixture family、expected phrase、finished phrase bankが必要
- source raw morphology inference、uncertified subspan、unsupported shape
- external parser／dependency／AI／provider／networkが必要
- public schema／upstream semantic expansionが必要
- frame、head、complement、reference、link selection 0件／2件以上
- adjacent head repeat、set-level head signature repeat
- source／Safety／unknown／relation／scope regression
- candidate bound超過、repair非単調、typed tie
- machine invariant nonclear
- Mash approval ID／source corrected V2 SHA／approval ledger digest／final design external SHA／I00 fresh headsの不一致
- 将来別途Pro deltaを実行してNONCLEARとなった場合は、その新事実のMash decisionなしにI00へ進まない
- Ultra／Pro early or formal nonclear
- N4 language identity driftまたはAST changed-symbol drift
- before／after formal identity mismatch
- Mash Product Read FAIL

STOP後はsame unitの修正、automatic retry／rerun／correction／progression、old counter reset／increment、Step 4.1、merge／ready／productionを承認しない。

### 17.5 credit

| Outcome | Credit |
|---|---|
| design／docs／testsだけ | ADMINISTRATIVE_ONLY |
| common failure classを狭めたがhuman nonclear | BLOCKER_NARROWED max、Product Credit 0 |
| machine＋Ultra＋Pro CLEAR、Mash未判定 | UNIT_INCOMPLETE、CANDIDATE_READY=false、PRIMARY_CREDIT_NOT_YET_ASSIGNED、Product Credit 0 |
| Mash overall PASS | PRODUCT_CREDIT |
| Mash FAIL | Product Credit 0 |

### 17.6 cleanup

terminal decisionまたはverdict receiptを両repositoryでfresh readbackする前にbody cleanupを開始しない。body-free receiptにはattempt ID、set／bundle digest、verdict、heads、identitiesだけを残し、actual text、source literal、snippet、embedding、summaryを含めない。cleanup結果がunknownならquarantineし、verified deletionを主張しない。

---

## 18. effort、assumptions、risks

### 18.1 estimate assumptions

- exact12 path内で閉じる
- public API／schema、DB、RN、production route、dependency変更0
- existing Phase A/B、source kernel、runner、test harnessを再利用
- baseline、N3、after generationは各exact1、retry／rerun0
- branch drift、CI infrastructure failureなし
- source capability gapなし
- human readsはspecified exact1だけ

### 18.2 focused engineering breakdown

| Work | Hours |
|---|---:|
| implementation | 12–17 |
| registry migration | 4–6 |
| test implementation | 6–8 |
| machine execution | 2–3 |
| private output generation（baseline＋early＋after） | 1.5–2.5 |
| Ultra／Pro reads | 3–4.5 |
| GitHub／canonical synchronization＋remote postverify | 2–3 |
| terminal／final cleanup | 0.5–1.5 |
| Planning envelope | 32–46 |

§20へのsession mappingは、I00=baseline、I01–I05=implementation／registry／test／public proof、I06–I08=early generation／reads、I09=activation、I10–I12=after generation／formal reads、I13=Mash Product Read、I14=sync／cleanupである。Step分割は32–46hへ追加する別作業ではなく、同じworkを安全なremote checkpoint単位へ分けたものとする。

Mash Product Read 20–40分は別枠。external service cost0、new dependency0。confidenceはmediumである。root causeはcode-groundedで、§5.4のplaceholder base skeleton exact22はUltra human read済みである。Pro delta final checkは未実施で、Pro current-body CLEARを主張しない。Mashのfinal design approvalとplaceholder readは、実装後のactual source-bound output exact8、Pro early／formal pre-screen、before／afterの商品改善、Mash Product Readを代替しない。

### 18.3 early STOP cost

| First STOP point | Incurred focused effort |
|---|---:|
| N2 public finite／mutationでsource capability gap | 18–31h |
| N3 private shape、machine、Ultra、Pro nonclear | 28–41h |
| N4 identity／integration drift | 30–43h |
| N5 formal pre-screen nonclear | 31–46h |

各STOPはProduct Credit 0。後続Nの未発生工数を完了扱いしない。

### 18.4 risks

| Risk | Mitigation |
|---|---|
| low-level registryがhidden phrase bank化 | exact manifest、atomic head、finite／terminal／case particle禁止、value invariant |
| exact1 headsでrepeat解消候補がない | preferenceで隠さずadjacent／signature named STOP |
| opaque source leafでは自然化不足 | suffix patch0、capability STOP、別LEVEL_3 |
| grammar profileがnaturalness score化 | hard invariant＋typed lexicographic exact7、numeric score0 |
| anaphor／zeroがmeaning ownerを隠す | antecedent exact1、competitor0、endpoint explicit、full repair |
| candidate explosion | whole-plan axesだけ、internal≤16、truncate0 |
| N4でN3とは別languageになる | N2で全behavior完成、N4 changed symbol exact1、LCI equality |
| legacy bankが並行active | active facade exact1、non-call proof、physical deletionは別authority |
| before／afterが比較不能 | N0 before capture、same formal identity、pair row exact8 |
| private data leak | request-local leaf、body-free receipt、GitHub body0 |

---

## 19. Mash final approval、implementation entry、handoff

### 19.1 decision card

| Decision item | Final disposition |
|---|---|
| Pro initial required change exact9 | 9/9 APPLIED、reviewed V1でPro VERIFIED |
| Pro final-check blocker exact1 | 1/1 APPLIED_BY_ULTRA、Mash accepted |
| corrected V2へのPro delta final check | NOT_RUN／READ 0／REREAD 0 |
| Pro verified current-body CLEAR | false |
| 旧Pro-delta prerequisite | Mash direct decisionがapproval gateだけをSUPERSEDE。Pro CLEAR claim 0 |
| Mash LEVEL_3 final design approval | YES、source V2 SHA＋§20 order＋GitHub docs exact4 |
| current implementation execution | NOT_STARTED |
| current authorized next Step | I00 after fresh explicit Step-start |
| Route A only | YES |
| external AI／provider／network／fallback | NO |
| old Step 3／counter再開 | NO |
| Step 4.1として扱う | NO |
| current Product PASS／activation | NO |
| Product PASSを事前承認 | NO |

### 19.2 Pro review evidenceのcurrent state

    PRO_REVIEW_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_PRO_SINGLE_REVIEW_20260827_V1
    PRO_REVIEWED_INITIAL_BODY_SHA256 = 549ec2e36e3c170555c6d146e86fbee16a1a7300c5f1899f4210486306cb7671
    PRO_FINAL_CHECK_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_PRO_FINAL_CHECK_20260827_V1
    PRO_FINAL_CHECK_REVIEWED_V1_SHA256 = b48e879427a74fddc7154e41d3e8a087576b6f2b8088849e7a552f0033e8d32e
    SOURCE_CORRECTED_V2_SHA256 = 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de
    PRIOR_V1_DISPOSITION_SHA256 = d1d3b201d90392165b8b44baad6e811d239c333bba03824a5266a260a136a02a
    CORRECTED_V2_DISPOSITION_SHA256 = 7b3f920bbd4c6661a92df1b3d93df6c92f0df637a141a2b6207b63bd713ef5d9
    PRO_DELTA_FINAL_CHECK = NOT_RUN
    PRO_DELTA_READ / REREAD = 0 / 0
    PRO_VERIFIED_CURRENT_BODY_CLEAR = false
    MASH_APPROVAL_GATE_SUPERSESSION = DIRECT_FINAL_DECISION

未実施のPro deltaをCLEARへ昇格しない。将来別途delta reviewを行う場合は本final designとは別のfresh evidence eventであり、NONCLEARならその新事実をMashへ戻す。いずれの場合もPro verdictはProduct PASSを代替しない。

### 19.3 current Mash approval binding

    APPROVAL_ID = COCOLON_CMEE_ROUTE_A_V2_FINAL_DESIGN_AND_SESSION_ORDER_APPROVAL_20260827
    SOURCE_CORRECTED_V2_DOCUMENT_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_CORRECTED_FINAL_20260827_V2
    SOURCE_CORRECTED_V2_SHA256 = 4c71c49577e4e95cbc735eafeacc301cabcc4b2c8d3dc4544006dcdd56a9b0de
    FINAL_DOCUMENT_ID = CMEE_STAGE1_ROUTE_A_TYPED_JAPANESE_CASE_FRAME_REALIZER_V2_ULTRA_FINAL_TECHNICAL_DESIGN_AND_IMPLEMENTATION_ORDER_20260827
    FINAL_DOCUMENT_SHA256 = external GitHub / ZIP binding; no self-reference
    MASH_FINAL_DESIGN_APPROVAL_SHA256 = a4052f3bb4744107b7740f219733275679dbc38fecbb79fb8d292bcfbf6044eb
    PRO_DELTA_FINAL_CHECK / READ / REREAD = NOT_RUN / 0 / 0
    PRO_VERIFIED_CURRENT_BODY_CLEAR = false
    ULTRA_FINAL_TECHNICAL_VERDICT = STEPWISE_IMPLEMENTATION_READY_UNDER_EXPLICIT_PER_STEP_START
    BASE_RUNTIME_HEAD = fresh verified PR #3 head before implementation
    BASE_DESIGN_HEAD = fresh verified PR #30 head before implementation
    FINAL_CHANGED_PATHS = exact12 in §12
    HEAD_BINDING_POLICY = BASELINE → N3_COMPOSER → ACTIVATED → POST_VERDICT_RECORD
    POST_VERDICT_ALLOWED_DIFF = DOCS_AND_BODY_FREE_RECEIPTS_ONLY
    SOLE_ROUTE = ROUTE_A_PROVIDERLESS_GROUNDED_DISCOURSE_COMPOSER
    RETAINED_INPUT_USE = SUCCESSOR_EARLY_LANGUAGE_SET_EXACT8_EXACT1_ONLY
    COMMON_DEFECT_RETURN_COUNT = 2_OF_2_IMMUTABLE

    EXTERNAL_AI = 0
    PROVIDER = 0
    RUNTIME_EXTERNAL_AI_PROVIDER_NETWORK = 0
    PRIVATE_BODY_SEND_TO_EXTERNAL_AI_OR_PROVIDER = 0
    MASH_PRIVATE_PRESENTATION = EXACT1_AFTER_N5_CLEAR
    NEW_DEPENDENCY = 0
    FALLBACK = 0
    AUTOMATIC_RETRY = 0
    AUTOMATIC_CORRECTION = 0
    AUTOMATIC_PROGRESSION = 0
    PUBLIC_API_CHANGE = 0
    DB_CHANGE = 0
    RN_CHANGE = 0
    PRODUCTION_EFFECT_BEFORE_PRODUCT_PASS = 0
    MERGE_OR_READY = 0
    IMPLEMENTATION_ORDER = I00_I14_EXACT15
    CURRENT_IMPLEMENTATION_EXECUTION = NOT_STARTED
    CURRENT_AUTHORIZED_NEXT_STEP = I00_AFTER_FRESH_EXPLICIT_STEP_START
    SESSION_SWITCH_CONTRACT = §14.4_AND_§20

    THIS_IS_NOT =
      STEP3_RETRY
      | COMMON_DEFECT_COUNTER_RESET_OR_INCREMENT
      | THIRD_GENERIC_CORRECTION
      | STEP4_1_AUTHORIZATION
      | OLD_STEP4_TO_STEP9_CONTINUATION
      | ROUTE_B_OR_ALTERNATIVE_ROUTE
      | PRODUCT_PASS_PREAPPROVAL

### 19.4 final handoff

正規順序は次だけである。

    Ultra initial technical design
    → Pro single review exact1
    → Ultra final technical body V1
    → Pro final check exact1（V1へB01 NONCLEAR）
    → Ultra corrected final technical body V2
    → Mash direct final design approval
    → session-safe implementation order追加＋GitHub final docs reflection
    → 本final document
    → Mashのfresh explicit Step-start後だけI00、以後I01–I14を各session exact1

本final workではCocolon docs exact4のGitHub reflectionだけを行う。実装、test execution、private output生成、retained input利用、baseline／early／after formal set生成、Product Read、cleanup mutation、merge／ready／productionは一切行っていない。

---

## 20. session-switch-safe implementation order Step 0–14

### 20.1 目的と絶対境界

Step 0–14は、N0–N6を一つの長いsessionで処理せず、各Step完了後にsessionを切り替えてもremote evidenceだけで正しく再開できるようにした実装順である。

- 全Stepは同じ cocolon.cmee.stage1.route_a.typed_japanese_case_frame_realizer.20260826.v1 bounded unitに属する。
- Step完了はcheckpoint closureであり、独立成果、Product Credit、次Step authorityではない。
- 各StepはMashの明示開始指示を受けてexact1だけ実行する。AUTOMATIC_PROGRESSION=false。
- SESSION_SWITCH_SAFE=YES はruntime側とCocolon側のremote postverifyが両方完了した時だけ記録する。
- runtime側だけ完了した中断は同じStepのdesign syncだけを再開し、runtime change、test、generation、readを再実行しない。
- preactivation changeはすべてDraft／disabled／unreachableを維持し、Step 9だけが compile_stage1_response body exact1を切り替える。merge／ready／productionは全Stepで0。
- external AI、provider、network、body send、dependency、fallback、public API、DB、RN、persistenceは全Stepで0。
- exact12外pathが必要なら実装せず CHANGED_PATH_ENVELOPE_STOP。upstream semantic capability不足は SOURCE_REALIZATION_CAPABILITY_GAP_STOP。

### 20.2 path alias

| Alias | Repository path |
|---|---|
| M01 | ai/services/ai_inference/cocolon_meaning_experience_engine/contracts.py |
| M02 | ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_composition.py |
| M03 | ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_stage1_response.py |
| M04 | ai/tests/test_cmee_v1a_i1sx_contracts.py |
| M05 | ai/tests/test_cmee_v1a_i1sx_vertical.py |
| M06 | ai/tools/cmee_v1a_i1sx_candidate_run.py |
| M07 | ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md |
| C08 | Cocolon_前提資料/designs/cmee/v1/02_emlis_v1a_detailed_design.md |
| C09 | Cocolon_前提資料/designs/cmee/v1/05_json_schema_and_versioning.md |
| C10 | Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md |
| C11 | Cocolon_前提資料/current_structure/01_emlis_ai_current_structure.md |
| C12 | Cocolon_前提資料/current_structure/04_cmee_current_structure.md |

allowed pathsは上限であり、変更不要pathをtouchしない。各Step terminalにはactual changed paths exact setを記録する。M07／C10は同じ STEP_CHECKPOINT_ID、runtime commit head、final design external SHAをbindする。C11／C12はactivationまたはfinal verdictでcurrent structureが変わるStepだけ更新する。

### 20.3 Step mapping exact15

| Step | ID | Semantic gate | 主目的 | 推奨session owner | Next |
|---:|---|---|---|---|---|
| 0 | I00 | N0 | fresh admission＋before baseline exact8 | Work Ultra | I01 |
| 1 | I01 | N1 | register-disabled types／registries | Work Ultra | I02 |
| 2 | I02 | N2.1 | source／complement／case／head | Work Ultra | I03 |
| 3 | I03 | N2.2 | reference／link／morphology／IR／linearizer | Work Ultra | I04 |
| 4 | I04 | N2.3 | normal form／rank／composer／preactivated helper | Work Ultra | I05 |
| 5 | I05 | N2.4 | identity freeze＋full public proof | Work Ultra | I06 |
| 6 | I06 | N3.1 | early exact8 generation＋machine | Work Ultra | I07 or STOP |
| 7 | I07 | N3.2 | Ultra known4 read | Work Ultra | I08 or STOP |
| 8 | I08 | N3.3 | Pro combined exact8 read＋decision | Pro | I09 or STOP |
| 9 | I09 | N4 | facade activation exact1 | Work Ultra | I10 |
| 10 | I10 | N5.1 | after exact8＋formal machine compare | Work Ultra | I11 or STOP |
| 11 | I11 | N5.2 | Ultra after-only read | Work Ultra | I12 or STOP |
| 12 | I12 | N5.3 | Pro before／after pre-screen | Pro | I13 or STOP |
| 13 | I13 | N6.1 | Mash Product Read＋verdict durable化 | Mash＋Ultra write owner | I14 |
| 14 | I14 | N6.2 | final docs sync＋cleanup＋unit closure | Work Ultra | NONE |

Canonical order payloadは次のexact15行である。BEGIN／END markerとMarkdown表示用先頭4-spaceはhash対象外、各payload行は表示文字のまま、UTF-8、LF、末尾LF exact1、Unicode normalizationなしでhashする。

    BEGIN_SESSION_SAFE_IMPLEMENTATION_ORDER_V1
    I00|N0|ADMISSION_BASELINE_EXACT8|M07,C10|I01
    I01|N1|REGISTER_DISABLED_TYPES_REGISTRIES|M01,M02,M04,M07,C08,C09,C10|I02
    I02|N2.1|SOURCE_COMPLEMENT_CASE_HEAD|M01,M02,M04,M05,M07,C08,C09,C10|I03
    I03|N2.2|REFERENCE_LINK_MORPHOLOGY_IR_LINEARIZER|M02,M04,M05,M07,C08,C10|I04
    I04|N2.3|NORMAL_FORM_RANK_COMPOSER_PREACTIVATED_HELPER|M02,M03,M04,M05,M07,C08,C09,C10|I05
    I05|N2.4|IDENTITY_FREEZE_FULL_PUBLIC_PROOF|M01-M07,C08-C10|I06
    I06|N3.1|EARLY_EXACT8_GENERATION_MACHINE|M07,C10|I07_OR_STOP
    I07|N3.2|ULTRA_KNOWN4_READ|M07,C10|I08_OR_STOP
    I08|N3.3|PRO_COMBINED_EXACT8_READ_DECISION|M07,C10|I09_OR_STOP
    I09|N4|FACADE_ACTIVATION_EXACT1|M03,M05,M07,C10,C11,C12|I10
    I10|N5.1|AFTER_EXACT8_FORMAL_MACHINE_COMPARE|M07,C10|I11_OR_STOP
    I11|N5.2|ULTRA_AFTER_ONLY_READ|M07,C10|I12_OR_STOP
    I12|N5.3|PRO_BEFORE_AFTER_PRESCREEN|M07,C10|I13_OR_STOP
    I13|N6.1|MASH_PRODUCT_READ_VERDICT_DURABLE|M07,C10|I14
    I14|N6.2|FINAL_DOCS_SYNC_CLEANUP_CLOSURE|M07,C10,C11,C12|NONE
    END_SESSION_SAFE_IMPLEMENTATION_ORDER_V1

    SESSION_SAFE_IMPLEMENTATION_ORDER_SHA256 = 0d6fb8cb123669d37d4a6801225f9995ea6ff3765900c6fb460e7592f1bba7b6

### Step 0 / I00 — fresh admission＋before baseline exact8

**Allowed paths:** M07、C10。M06 bytes変更0。

1. final design ID／external SHA、Mash approval ledger digest、両Draft fresh heads、exact12 preimages、old counter 2/2 immutable、retained input rebind、formal runner、SX-01..SX-08、order、axes、FORMAL_INPUT_IDENTITYをfreezeする。
2. behavior変更前のapproved headsで BASELINE_FORMAL_PRODUCT_SET_EXACT8 をexact1生成し、private durable save＋fresh readbackする。RUN／RETRY／RERUN=1／0／0、human read0。
3. runner／fixture／order／axes hash equality、external AI／provider／network／dependency／fallback 0を検証する。
4. baseline set body-free digestとformal identityをM07→C10の順でremote postverifyする。

**STOP:** approval／source V2 SHA／retained identity／formal identity／base target preimage不一致、generation unknown。  
**Completion:** I00_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED、SESSION_SWITCH_SAFE=YES。  
**Next:** I01 after fresh explicit start。

### Step 1 / I01 — register-disabled types／registries

**Allowed paths:** M01、M02、M04、M07、C08、C09、C10。

private v2 types、frozen registry literal／count／digest、validator、version seedだけを実装する。active facade、body generation、public schema changeは0。registry exact counts／literal／digest、orphan／unlicensed 0、targeted contracts tests、active compile_stage1_response blob／call-chain unchangedを検証し、runtime→design syncをpostverifyする。

**STOP:** registry／digest／public schema／active facade drift。  
**Completion:** I01_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I02。

### Step 2 / I02 — source／complement／case／head

**Allowed paths:** M01、M02、M04、M05、M07、C08、C09、C10。

SourceLeafToken／group、mode exact5、complement、case frame、required slot／particle、atomic head、argument planを実装する。source bytes／owner、frame／head distinct-total、illegal join pre-rank、source boundary exact208、applicable mutation subcasesを検証する。private linearized outputのhuman readは0。

**STOP:** uncertified source morphology、slot／particle owner非一意、source pair coupling、source capability gap。  
**Completion:** I02_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I03。

### Step 3 / I03 — reference／link／morphology／IR／linearizer

**Allowed paths:** M02、M04、M05、M07、C08、C10。

reference／topic／zero、clause link、morphology、JapaneseClauseIR、sole linearizer、derivation sealを実装する。mutation registry exact273、base skeleton exact22 byte equality、terminal／delimiter owner、invalid candidateのrank／linearization到達0を検証する。

**STOP:** antecedent／link／morphology／terminal owner非一意、skeleton drift。  
**Completion:** I03_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I04。

### Step 4 / I04 — normal form／rank／composer／preactivated helper

**Allowed paths:** M02、M03、M04、M05、M07、C08、C09、C10。

normal form exact6、local preference exact7、candidate internal≤16／emitted≤2、composer、response wiring、preactivated adapter、N4 helperを完成する。compile_stage1_response bodyは旧まま維持する。A/B/A determinism、idempotence、repair strict decrease、typed tie STOP、existing strengthened exact3を検証する。

**STOP:** behavior root外change、candidate bound超過、tie、repair非単調、active facade drift。  
**Completion:** I04_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I05。

### Step 5 / I05 — identity freeze＋full public proof

**Allowed paths:** M01–M07、C08–C10。behavior追加0、test／identity／runner／canonical record確定だけ。

behavior root exact22、identity infrastructure exact5、LCI payload exact16、owner-symbol manifestをfreezeする。named test functions191、mutation273、source208、A/B/A、idempotence、compileall、diff、external／provider／network／dependency／fallback 0、active facade未接続、legacy production path unchangedをfull public proofする。

**STOP:** source gap、count／identity／symbol／path drift、machine nonclear。  
**Completion:** N3 composer heads、N3_LANGUAGE_CORE_IDENTITY、manifest／symbol／tuple SHAを持つ I05_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I06。

### Step 6 / I06 — early exact8 generation＋machine

**Allowed paths:** M07、C10のみbody-free。

I05 heads／LCIをfresh再計算してliteral一致後、known4＋retained withheld4を SUCCESSOR_EARLY_LANGUAGE_ATTEMPT_01 でexact1生成し、private durable save＋fresh readbackする。RUN／RETRY／RERUN=1／0／0。machine known／withheldを判定し、set／attempt／digest／machine resultだけをpublic checkpointへ残す。code／canonical behavior変更0。

**STOP:** identity mismatch、private material unavailable、run unknown、machine NONCLEAR。actual rerun0。  
**Completion:** machine CLEARの場合だけ I06_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I07。NONCLEARはterminal cleanupへ進み、I07以降0。

### Step 7 / I07 — Ultra known4 read

**Allowed paths:** M07、C10のみbody-free。

same early setのknown4を SUCCESSOR_EARLY_ULTRA_KNOWN_READ_ATTEMPT_01 でREAD／REREAD=1／0、withheld read0として読む。resultを即durable saveし、M07→C10でpostverifyする。

**STOP:** read unknown、technical NONCLEAR。reread0。  
**Completion:** CLEARの場合だけ I07_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I08。

### Step 8 / I08 — Pro combined exact8 read＋decision

**Allowed paths:** M07、C10のみbody-free。

same new known4＋withheld4を SUCCESSOR_EARLY_PRO_COMBINED_READ_ATTEMPT_01 でREAD／REREAD=1／0とする。machine／Ultra／Proをsame setへbindし、CLEAR／NONCLEAR exact1を保存する。decision dual-postverify後にearly input／output／auxiliaryを契約どおりcleanupする。

**STOP:** read unknown、いずれかNONCLEAR。same-unit correction、retry、counter increment／reset0。  
**Completion:** all three CLEARの場合だけ I08_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I09。

### Step 9 / I09 — facade activation exact1

**Allowed paths:** M03、M05、M07、C10、C11、C12。

compile_stage1_response body exact1だけをN2 presealed helper exact1へdelegateする。new activation test、full191、active facade exact1、legacy／shadow／fallback0、LANGUAGE_CORE_IDENTITY_N4 == N3_LANGUAGE_CORE_IDENTITY、runtime integration identity fresh、changed AST symbol exact1を検証する。

**STOP:** language identity、AST symbol、owner、call-chain drift。N3 evidence継承0。  
**Completion:** activated heads／identities／call-chainを持つ I09_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I10。

### Step 10 / I10 — after exact8＋formal machine compare

**Allowed paths:** M07、C10のみbody-free。

activated headsから AFTER_FORMAL_PRODUCT_SET_EXACT8 をexact1生成し、private durable save＋fresh readbackする。RUN／RETRY／RERUN=1／0／0。before／afterのformal identity、order、denominator、axesをliteral compareし、pair exact8をbindしてmachine gateを実行する。

**STOP:** generation unknown、identity mismatch、machine NONCLEAR。  
**Completion:** CLEARの場合だけ I10_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I11。

### Step 11 / I11 — Ultra after-only read

**Allowed paths:** M07、C10のみbody-free。

after exact8を FORMAL_ULTRA_AFTER_READ_ATTEMPT_01 でREAD／REREAD=1／0として読み、resultを即保存・dual postverifyする。

**STOP:** read unknown、technical NONCLEAR。  
**Completion:** CLEARの場合だけ I11_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I12。

### Step 12 / I12 — Pro before／after pre-screen

**Allowed paths:** M07、C10のみbody-free。

baseline／after individual、pairwise、set-levelを FORMAL_PRODUCT_PRESCREEN_ATTEMPT_01 でREAD／REREAD=1／0として読む。PRESCREEN_CLEAR／PRESCREEN_NONCLEAR exact1をdual postverifyし、auxiliaryをcleanup、underlying before／after pairだけをretainする。

**STOP:** read unknown、machine／Ultra／ProのいずれかNONCLEAR。Mash presentation0。  
**Completion:** all CLEARの場合だけ I12_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。  
**Next:** I13。

### Step 13 / I13 — Mash Product Read＋verdict durable化

**Allowed paths:** M07、C10のみbody-free。

same bytes／same orderのbefore→after pair exact8を MASH_PRODUCT_READ_ATTEMPT_01 でexact1提示する。presentation／READ／REREAD／VERDICT_ATTEMPT=1／1／0／1。Mashがoverall PASS／FAIL exact1を所有する。verdict-only receiptはMash tuple受領後のfirst effectとしてM07 write／fresh readback→C10 write／fresh readbackの順に保存する。

presentationまたはreceipt state unknownではbodyを再提示せずbody-free SEEN／NOT_SEEN acknowledgement、verdict receipt unknownではsame-verdict re-attestationだけを許す。

**Completion:** PASS／FAILのいずれも I13_COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED。Product CreditはPASSだけ。  
**Next:** I14。新しいcorrection／next workへは進まない。

### Step 14 / I14 — final docs sync＋cleanup＋unit closure

**Allowed paths:** M07、C10、C11、C12のみ。

runtime bytes／head drift0を確認し、PASSならProduct Creditとcurrent maps、FAILならProduct Credit0とterminal stateをdocs-only同期する。before／after／presentation private artifactを契約どおりcleanupし、physical erasure未確認をclaimしない。relevant regression、actual changed-path union、remote exact12 target bytes、両final headsをpostverifyする。

**Completion:** final Receiptに NEXT_STEP=NONE、MERGE／READY／PRODUCTION=0、LOCAL_UNCOMMITTED_TARGET_DELTA=0、LOCAL_ONLY_RECONSTRUCTION_DEPENDENCY=0、SESSION_SWITCH_SAFE=YES を記録する。  
**Automatic next work:** 0。別実装、merge、release、productionはfresh Mash decisionが必要。

### 20.4 session restart algorithm

各sessionは次のexact orderで再開する。

1. current rules、本final design、M07、C10、latest relevant terminal checkpointをfresh read。
2. PR #3／#30のstate、branch、headsとcheckpointのoutput headsを取得。
3. latest COMPLETE_DUAL_REPO_REMOTE_POSTVERIFIED をremote evidenceからexact1特定。
4. 後続partial stateがあれば§14.4のreconciliationだけを行い、完了済みrun／read／runtime halfを再実行しない。
5. runtime readinessをcurrent sessionでfresh admission。
6. checkpointの NEXT_STEP とMashの今回の明示Step-startが一致する場合だけ、そのStepをexact1実行。
7. terminal dual postverify後に停止し、次sessionへ渡す。next Stepを同sessionで自動開始しない。

このalgorithmにより、Step完了後はchat historyやlocal scratchを使わず再開でき、Step途中のruntime-only remote stateもdesign sync exact1へ閉じる。safe boundaryはremote postverify済みcheckpointであり、単なる「commitしたつもり」やlocal hashではない。
