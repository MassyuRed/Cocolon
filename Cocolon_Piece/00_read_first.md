---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-10-21 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

**最新は入口§92.2／current map§65.40.2／weekly§5.6.20.2／manifest v118です。一度CI39565918631はfailure。JS933/旧native175は成功、新v3 10FAIL。診断保存は13件・重複0へ修復できましたが、新プレビュー8件は未成立。実RN62拒否の56件はcontentsがCGImageでないこと、残6件はsnapshot整合guard停止を確認。元alpha7不一致/quote制約は未再検証。候補未採用DETOUR_RISK_STOP、正式admission/通常保存は未完了です。**

### §87の設計時点（履歴）

**最新は入口§87／current map§65.35／weekly§5.6.15／manifest v104です。実layer包含修復の具体仕様を確定しGitHubへ記録。旧v2を保持する別preview候補で、native非clip参照・自然layer・配置/余白判定を一体化する案です。新ink/wire/profileの実装と一度の検証は判断待ち・未実行。前回JS915/native175/RN11成功は保持し、正式採用・通常保存は未完了です。**

### §86.2〜86.3の結果（履歴）

**最新は入口§86.2〜86.3／current map§65.34.2／weekly§5.6.14.2／manifest v103です。source1f168d19は全6job/CI success、JS915/native175/RN11成立。配置直後のlayer合成と完成PNGの範囲が一致し、directだけtop/right各1px過小と確認。包含修復・正式admission・通常保存は未完了です。**

### §85.2〜85.3の結果（履歴）

**最新結果は入口§85.2〜85.3／current map§65.33.1／weekly§5.6.13.1／manifest v100です。source623662bの一度のCIは全6job success、JS915/native175/実RN11条件・PNG11を確認しました。配置直後の自然contentsはnonnull（型・画素未確認）、canvas透明度0のまま同一性・前後状態・期限を確認。次は同時点のlayer合成を外部contextへ写す限定診断です（未実施）。実画素包含・v9採用・通常保存は未完了です。**

### §85 source時点の記録（履歴）

**現在は入口§85／current map§65.33／weekly§5.6.13／manifest v99です。前回native175完走と実RN11条件を継承し、既存placed成功callbackの先頭で自然なmodel-layer状態だけを読む診断を追加しました。新sourceの一度の既存CIは未実行。画素観測・実layer包含・v9正式採用・通常保存は未完了です。**

### §84結果の記録（履歴）

**最新結果は入口§84.2〜84.4／current map§65.32.2／weekly§5.6.12.2／manifest v98です。Window修復source9de5a87でnative175件unique PASS・FAIL0、JS915、実RN11条件・元PNG11枚を確認し、結果原物を保存しました。native検査stepはsuccessですがjob/CI全体cancelled、取消理由は未確定です。モデルのPro限定はRule18§0Aで解除済み。v9正式採用・実layer包含・通常保存は未完了です。**

**最新確認は入口§84.2／current map§65.32.1／weekly§5.6.12.1／manifest v97です。Window修復source9de5a87の13pathを全文読戻し、native175件の重複なし個別PASS・FAIL0と3summary、mainから39.800秒、検査step成功を確認。ただしjob全体はcancelled、理由未確定です。実RN検査は同じrun39430845624で継続中。v9採用・実layer厳密包含・通常保存は未完了です。**

**現在は入口§84／current map §65.32／weekly §5.6.12／manifest v96です。Mashの2026-10-20明示決定でPiece残件のPro限定を解除し、v9テスト専用Window修復を実装しました。旧129件・v9追加46件の判定と製品sourceは維持。新sourceの一度のCIはこれから確認し、175件成功・v9採用・通常保存の完成は未確認です。**

**最新結果は入口§83.3〜83.6／current map §65.31.1／weekly §5.6.11.1／manifest v95です。source5fa54927の5path全文読戻しと一度のCIを確認しました。install／launch／mainに到達し、旧129件の個別PASSと両budget完了を観測。v9最初のfixture追加時に、テスト用Textが自身をWindowとして返すことに整合するUIKit例外が発生し、追加46件は未検証です。実RN11/11条件・元PNG11枚の結果を保存しました。v9未採用、実layer包含・正式admission・通常保存は未完了です。**

### §83 source時点の記録（履歴）

**現在の作業は入口§83／current map §65.31／weekly §5.6.11／manifest v94です。18:22:22 JSTの再開指示を受け、前回結果commit21ad068を新鮮照合しました。リンク修復済み・native175未検証・v9未採用を引き継ぎ、既存workflowへinstall／launch到達点のHOST_STAGE3行だけを加えた新sourceを一度確認します。製品・test・判定・時間上限は不変で、正式admission・通常保存は未完了です。**

### §82時点の結果（履歴）

**最新結果は入口§82.3〜82.6／current map §65.30.1／weekly §5.6.10.1／manifest v93です。source972205c8の6path全文読戻しと一度のCIを確認しました。前回のリンクエラーは解消し、JS915・実RN11条件が成功、元PNG11枚は前回v9とバイト同一です。ただしnative175件はsimctl起動境界の取消で全件未検証。Arabicの1px差は独立Text layerのlocal／placed描画でも再現し、placed layer境界は完成PNGと一致しました。差の発生段階は絞れましたが、実描画の包含保証・正式admission・通常保存は未完了です。v9未採用を維持します。**

### §81時点の結果（履歴）

**最新結果は§81.4〜81.6／current map §65.29.1／weekly §5.6.9／manifest v91です。承認済みv9をsource bac29a1dへ反映し、15path全文を読み戻しました。一度のCIではJS915件成功、実RNはbaseline5・補足3・raw3の全11report／11PNGを確認。Arabicは72pt・200.256ms、両420は5533.207／3399.714msで元8秒以内です。ただしnative単体は追加したQuartzCore関数2個のリンク失敗で旧129＋新46が全件未実行。Arabic完成PNGの端はoffscreen判定値と1px異なり、完全一致は未証明です。v9は未採用として限定単位を終了し、正式admission・通常保存は未完了です。**

### §80時点の結果（履歴）

**最新結果は§80.4〜80.7／current map §65.28.1／weekly §5.6.8です。v8 source ef96dc5をGitHubへ反映し、全12fileの全文読み戻しと一度のCI結果確認を完了しました。JS900件成功、mixed420は最終照合込み8018.127→5172.852msとなり、従来のPNG10枚は全てv7とバイト同一です。Arabicは同layout診断の全3サイズで実画素が元view内でしたが、現TextKit bbox条件では拒否が続きます。native単体は115 PASS行で未完走、残る14件は未確認です。v8未採用、正式admission・通常保存は未完了。実画素を新しい計測契約に使うv9案と、既承認条件からの差を§80.7に具体化しました。**

### §79時点の結果（履歴）

**最新結果は§79.3〜79.4／current map §65.27.1／weekly20261017 §5.6.7です。v7の本文Text自然高さ修復をsource0b24ce7dへ反映し、一度の実RN・全11report・PNG10枚の照合と原寸目視を完了しました。local／CI JS896・native129・iOS／Android source compileは成功。quote／Latin／両420の高さ境界拒否とessay／declarationの不要な縮小は回復しました。ただし元8秒を含む合格はbaseline4/5・補足2/3・raw3/3で、mixed420は8018.126875ms、ArabicはTextKit行高超過のためv7未採用です。Arabicは元operationの属性・glyph boundsまで原因を絞りましたが、実画素の超過は未確認です。正式admission・通常保存は未完了。§79.1〜79.2の結果待ちはsource時点の履歴です。**

### §78時点の要約（履歴）

**最新結果は§78.3〜78.4／current map §65.26.1／weekly20261017 §5.6.6です。明示iOS preview v6の横描画領域修復をsource 0033ee36へ反映し、一度の実RNと全11report・完成6枚PNGの確認を終えました。local／CI JS888・native129・iOS／Android source compileは成功。raw Hebrew／mixed bidiは余白内へ改善しましたが、元Card3/5・補足Card0/3で、quote／Latin／両420の高さ境界拒否とArabicのTextKit行高超過が残りました。v6は未採用STOP、RTL修復全体・420条件・正式admission・通常保存は未成立です。同source再実行・結果後の製品／test／workflow追加変更0。§78.1〜78.2の結果待ちは実行前の履歴です。**

### §77時点の要約（履歴）

**最新結果は§77.2〜77.4です。Mash承認に基づくiOS preview v5の実装と一度の限定検証を完了しました。source b983da2dはlocal／CI JS880・native129・iOS／Android compile成功。実RNの元5ケースは全成功し、420文字は6,763.778ms・36pt18行・同token fit・完成PNGまで確認しました。ただし追加ArabicのCardとraw RTL2件に描画条件の未達が残ったため、§76.5に従いv5は未採用で停止します。同source再実行・結果後の製品／test／workflow追加変更0。正式admission・通常保存は未完了です。§76の未承認記録と§77.1の結果待ちは提案／実行前の履歴です。**

### §76時点の要約（履歴）

**最新の調査・判断候補は§76／current map §65.24、週次P-W1の進捗はweekly20261017 §5.6.4です。現source b4467a77のv4は420文字timeoutで未採用のまま。全候補の独立計測を保つ確かな追加修復は今回特定できず、「候補探索はsuffix文脈の代表値、採用行は実際のTextの独立寸法とTextKitで検査する」明示iOS preview v5を具体化しました。改行・font・fitの選択が旧版と変わり得るため、v5の実装・限定検証は新しい契約差へのMash判断前で、未実行です。通常保存には正式admissionのInputScreen供給と採用版のsaved再表示対応も必要です。今回の反映は既存4文書だけで、420・正式採用・保存受入れを完了にしません。**

### §75時点の要約（履歴）

**最新は§75.2〜75.3／current map §65.23.1です。承認されたiOS preview専用v4の実装と限定検証を完了しました。source b4467a77はlocal／CI JS839件・native97件・iOS／Android compile成功。実RNは4ケース成功・4枚PNG確認済みですが、420文字は8,069.796msでtimeoutし、36ptの計測が未完了でした。§74.4の停止条件に従いv4は未採用です。同source再実行や追加変更へ進まず、旧v3・saved/export・元8秒を維持。正式採用・通常初回保存の受入れは未完了です。**

### §74時点の要約（履歴）

サーバー保存確定後のFEATURE停止で保存キーを失う不具合はsource `5c44b252` で修復済み。同一要求での明示回収→同owner詳細GETを含むlocal／CI JS802件・native69件・Android source compile成功を§74.3.1に保持します。

### §72時点の要約（履歴）

**最新は§72／current map §65.20です。最終描画検査を同じ画面の全Textへまとめて依頼する変更をsource `f49238acc8a94f4560af4918effa31b428919c9f`へ反映しました。local14ファイル806件、CI JS768件・native69件成功。実RN run38495258157は4ケース成功・420文字8,100.109msでtimeout（§72.1）。420文字・正式保存は未成立です。**

### §70〜71時点の要約（履歴）

**最新作業は入口§70〜71／current map §65.18〜65.19です。書き出し初期整理の失敗後に復帰できない不具合を修正しました。source `562e6a38` は従来の独立計測へ復元し、通常UIKit起動でnative69件・JS766件が成功。CoreText再利用2案は数値不一致で撤回しました。復元後の実RNは4ケース成功・420文字timeout（§71.2）で、420文字は未解消です。**

### §66／map §65.14時点の先頭要約（履歴）

**現在は入口§66／current map §65.14を優先します。source `ec5db637` はnative63件・JS758件を通過し、実RN4ケースと4枚PNGを確認しました。420文字は48→44→40→36ptの全候補計測・復号が返りましたが、36ptのB9開始前に全体8,118.417msでtimeoutとなり、未解消です。共有CF版のcrashは専用workerデータへ修正し、最新native/実RNでは再発しませんでした。次は候補の反復と最終復号を短縮し、36ptのB9・最終inspectionまで同じ8秒内へ収めることです。正式renderer admission・保存直前fit・通常初回保存・実機受入れは未完了です。**

### 10/09以前の先頭要約（履歴）

**最新のコード上の再開位置は§28／current map §32です。InputScreenの直前保存入力から既存hostへ組み込み、同じ本文プレビューまでの検査332件が成功。稼働API登録・設定供給・実機は未完了です。以下の記録は各時点の履歴として保持します。**
**最新の再開位置は§26／current map §30です。中断前のAPI `aa6cf858` の実効フラグ・preview操作時制御を確認し、再開後API86件・RN282件を再検査しました。InputScreen・稼働構成・実機は未完了です。以下の以前の記録は履歴として保持します。**

**2026-10-09現在：既存AppRuntimeContextへ認証通知時のPiece表示フラグ無効化とbootstrap再取得を接続した。保存参照GET・RN本文プレビュー・既定OFF・foreground刷新を継承する。サーバー実効flag／操作時強制、InputScreen、PIECE_FEATURE_DISABLED、実機の完成ではない。現在の追加差分は末尾の2026-10-09節、10/08以前の状態と検査件数は各時点の履歴として読む。**
**2026-10-08現在：保存参照GETの非稼働コードをAPI `0312a0fc3b07f8e46344d5746cafd7760458badd`へ反映し、RN `df88a0e0f46cdbfc005039177983dbec740efb3f`で明示GETと既存preview要求への受渡しを反映した。先行の本文プレビュー、既定OFF、再取得失敗時OFF、foreground刷新は保持する。これはInputScreen・実サーバーの登録／実効flag・実機画像の完成ではない。参照取得URLの採用と、稼働環境への登録・有効化を分離する。現在の内訳は末尾の2026-10-08節を優先し、以下の10/07以前の結果は履歴として保持する。**

**GitHub反映済みのAPI再開位置は `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996`（§22／current map §26）です。B7公開切替・削除HTTPの実装と隔離PostgreSQL接続確認を反映し、役割明記ひらがな名と旧676 PASSは§21／map §25へ分離します。前回B7 runのHTTP 152件・native SQL接続13件の成功は、実Auth／実PostgREST／実機・商品合格を意味しません。公開安全性の実判定→永続preview→開発画面の本線は未完了です。§20以前は各commitの履歴として保持します。**

## 1. Current owner

```text
Piece workstream:
  Cocolon_Piece/

EmlisAI implementation history:
  EmlisAIの実装済み資料/

current Piece structure map:
  Cocolon_前提資料/current_structure/02_piece_current_structure.md

current Piece premise / historical phase closure:
  Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md
```

Piece / EmlisAI / Analysisの内部ownerを統合しない。PieceはPCE-2のbody-free source handoffだけでsaved inputと接続する。

## 2. Current Piece identity

```text
Piece:
  保存済みユーザー入力を起点に、
  考えや価値観を他者へ伝わるcanonical textへ整形し、
  versioned visual recipeで画像化できるユーザー所有artifact。

record:
  piece.record.v2

public identity:
  piece:<uuid>

canonical visible body:
  piece_text

image binary:
  derived export artifact
  record/feed source-of-truth exact0

Q&A:
  pre-release legacy
  new active format / migration / compatibility exact0
```

## 3. Phase state

現在の実装・残件は§32／current map §36を優先する。次の段落と状態表は10/07以前の履歴であり、未着手判定に使わない。

最新の実装状態は§21〜22／current map §25〜26です。保存・消費済みcontext照合・本人履歴読取りを継承し、役割明記ひらがな名とB7公開切替・削除HTTPを反映済みとして分けて記録します。643／676 PASSは各旧commitの履歴であり、B7 runのHTTP 152件・native SQL接続13件とは別の実行結果です。公開安全性の実判定・永続preview発行・開発画面接続は未完了で、B5／B6／B7／B8全体完了へ換算しません。以下のPCE-0〜B2-Aは成立済み設計・過去実装の履歴として保持します。Analysisは自身のcurrent mapに従い、以下の旧未着手記述を再開判断へ使用しません。

```text
PCE-0: COMPLETE
PCE-1: COMPLETE_DESIGN_ONLY
PCE-2: COMPLETE_DESIGN_ONLY
PCE-3: COMPLETE_DESIGN_ONLY
PCE-4: COMPLETE_DESIGN_ONLY
PCE-5: COMPLETE_DESIGN_ONLY
PCE-6: COMPLETE_DESIGN_ONLY
PCE-7: COMPLETE_DESIGN_ONLY
PCE-8: COMPLETE_DESIGN_ONLY

PCE-9A B01-R Contract/Version Causal RED:
  COMPLETE_TEST_ONLY_CAUSAL_RED

PCE-9A B01-I Contract Owner Implementation:
  COMPLETE_CODE_DISABLED_TARGETED_GREEN

PCE-9A B02-A M0/M1 Tracked Migration + Legacy Bridge:
  FILE_ONLY_IMPLEMENTATION_APPROVED_BY_MASH_20260927
  M1_SQL_AND_TEST_SUPPORT_EXACT5_PUBLISHED_IN_API_DRAFT
  EXACT6_READER_REBINDING_PUBLISHED_IN_API_DRAFT
  FROZEN_TEST_UNCHANGED_NATIVE_POSTGRESQL_1_PASS
  FILE_ONLY_TECHNICAL_ACCEPTANCE_PASSED
  PRODUCTION_APPLY_NOT_AUTHORIZED
  REPEAT_APPROVAL_FOR_SAME_B2A_SCOPE_NOT_REQUIRED

Analysis roadmap:
  NOT_ACTIVATED
  SEPARATE_MASH_APPROVAL_REQUIRED

Analysis current role alignment:
  Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md
  PRO_PRODUCT_ALIGNMENT_AND_EXPLANATION
  ULTRA_INITIAL_FINAL_TECHNICAL_DESIGN_AND_EXECUTION
  FUTURE_UNEXECUTED_STAGES_ONLY

automatic progression:
  false
```

## 4. Canonical design owners

```text
PCE-1:
  Cocolon_Piece/pce1_identity_clean_cutover/

PCE-2:
  Cocolon_Piece/pce2_cross_core_source_handoff/

PCE-3:
  Cocolon_Piece/pce3_record_lifecycle_visibility_quota/

PCE-4:
  Cocolon_Piece/pce4_content_format_safety/

PCE-5:
  Cocolon_Piece/pce5_visual_recipe_export/

PCE-6:
  Cocolon_Piece/pce6_api_db_rn_migration/

PCE-7:
  Cocolon_Piece/pce7_test_monitoring_rollback/

PCE-8:
  Cocolon_Piece/pce8_design_freeze_work_packages/
    Piece_Design_Freeze_Candidate_20260808.md
    Piece_Implementation_WorkPackage_Index_20260808.md
    Piece_Environment_Assignment_Ledger_20260808.md
```

PCE-0 through PCE-8の詳細identityはimmutable predecessor manifests、各Phase canonical artifact、07N checkpointに保持される。

## 5. PCE-1 through PCE-5 fixed boundary

```text
clean cutover:
  old Q&A preservation / adapter / visible coexistence exact0

source:
  saved input exact1
  refined supplemental remains distinct
  Emlis / Analysis body reuse exact0

lifecycle:
  preview_draft / saved / cancelled / rejected / expired / deleted

visibility:
  private default
  public only for current allowed viewer relation

quota:
  first successful save exact1
  preview/mutation/visibility/re-export/failed export exact0
  delete refund exact0

formats exact3:
  short_essay / quote / declaration

meaning/safety:
  equal for every plan and private/public
  user free text edit / safety override exact0

visual:
  versioned recipe/catalog
  themes exact2
  ratios 4:5 / 9:16
  PNG derived export
  RN-first prototype, device-gated release
```

## 6. PCE-6 fixed boundary

```text
data:
  piece.data_contract.v1

API:
  piece.api.v2

RN flow:
  piece.rn_flow.v1

migration:
  piece.clean_cutover_migration.v1
```

```text
physical owner:
  public.piece_records + dedicated Piece family

legacy shared table:
  public.mymodel_reflections preserved for create/generated/unrelated owners

legacy read bridge before final view cutover:
  public.mymodel_reflections_read

final new Piece projection:
  public.pieces after legacy shared caller exact0

atomic functions:
  piece_save_v2
  piece_set_visibility_v2
  piece_delete_v2

canonical API operation:
  save, not publish

RN entry:
  saved input + terminal Emlis observation
  -> この入力をPieceにする

owner history:
  separate from Nexus

migration:
  M0 tracked baseline
  M1 legacy bridge
  M2 new foundation
  M3 RLS/RPC/staging
  M4 disabled integration
  M5 single clean cutover
  M6 body-free old identity capture
  M7 separate-approval destructive cleanup
  M8 obsolete Q&A retirement
```

Rollback is new Piece safe-disable, never old Q&A restoration.

## 7. PCE-7 fixed boundary

```text
RED catalog:
  piece.red_contract_catalog.v1

Test matrix:
  piece.test_matrix.v1

Monitoring privacy:
  piece.monitoring_privacy.v1

Feature flag / rollback:
  piece.feature_flag_rollback.v1
```

```text
required negative contracts:
  PCE7-R001..R040 exact40

valid causal RED:
  collected + call-phase intended invariant failure
  import/collection/fixture/environment failure noncredit

suite classes:
  exact13

actual DB transaction/RLS:
  actual isolated DB required
  mock-only GREEN prohibited

monitoring:
  piece.ops_event.v1 strict enum/numeric allowlist
  free-form Piece body/error/meta exact0

feature flags exact8:
  missing/unknown false
  backend authoritative

safe states exact5:
  PRELAUNCH_OFF
  OWNER_RECOVERY_ONLY
  PRIVATE_ONLY
  FULL
  READ_ONLY_OWNER
```

Actual-device evidence belongs to PCE-11/Mash. Independent cross-repository acceptance belongs to PCE-U1/U2 Work Ultra.

## 8. PCE-8 fixed boundary

```text
design freeze:
  piece.design_freeze.v1

work-package index:
  piece.implementation_workpackage_index.v1

environment assignment:
  piece.environment_assignment_ledger.v1

product/design decisions unresolved:
  exact0

runtime/tooling/deployment conditions:
  exact6 with fixed owner

work-package groups:
  B1..B15 exact15

packet lifecycle:
  R causal RED
  I bounded implementation + targeted GREEN
  automatic progression false
```

```text
B6 terminal owner:
  Save API, not publish

new staged backend API owner:
  api_piece_v2.py
  unregistered until M5

public.pieces cutover:
  after legacy shared caller exact0 only

monitoring public terminal event:
  piece_record_saved_public

Piece RN flag fallback:
  explicit false at every call

RN initial tests:
  existing node:test + pure state model

M7 destructive cleanup:
  outside B1-B15
  separate Mash approval

multirepository B-group:
  dependency group only
  separate repository write units
```

## 9. PCE-9A B01 current implementation state

### B01-R causal RED

```text
repository:
  MassyuRed/mashos-api

commit:
  522af8cb66fb8e4d8e1b4b2d6cc82cf10545ce56

tree:
  37fe412c1f7b342cd521e88fc3b010bbccafa2ae

test path:
  ai/tests/piece_v2/test_b01_piece_v2_contract_red.py

test blob:
  00bf4dea9a2321c59265d2bbb211ae5b13b97cde

causal signature:
  PCE9A_B01_PIECE_V2_CONTRACT_OWNER_IMPLEMENTATION_ABSENT_RED

covered release blockers:
  PCE7-R008
  PCE7-R013
  PCE7-R027
  PCE7-R037

production source / DB / API / RN / runtime effect:
  exact0
```

B01-Rはcollection/import/environment failureではなく、future owner不存在をtest call phaseのstable causal REDとして固定した。

### B01-I pure contract owner

```text
repository:
  MassyuRed/mashos-api

commit:
  7a10fc593b123cb9d9b02147c4b345894dba0c0b

tree:
  842715d588c0573f0de5411dae62b8b8bb22f3a4

owner path:
  ai/services/ai_inference/piece_v2_contract.py

owner blob:
  e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa

classification:
  CODE_DISABLED

implemented responsibilities:
  exact contract-version registry
  canonical UTF-8 compact JSON / SHA-256
  content payload -> piece_text reconstruction
  piece_text/hash binding
  visibility missing -> private / unknown reject
  public Piece field allowlist
  strict Piece ops-event allowlist

targeted GREEN recorded by completed B01-I authority:
  collected exact1
  passed exact1
  failed/error/skipped/xfail exact0

existing RED test modification:
  exact0

API registration / DB / migration / RN / runtime connection:
  exact0
```

このDOC_ONLY同期ではpytestを再実行していない。B01-Iの実行結果をcurrent workstreamへ記録し、GitHub上のtest/owner commit・blob identityをfresh確認した。

## 10. Frozen implementation order — historical B2-A checkpoint

以下はB2-A完了時点の履歴であり、現在の次作業・未着手判定には使用しません。最新の実装・残件は§21〜22とcurrent map §25〜26へ戻ります。確認済みB2-AやB7を再実装せず、公開安全性の実判定→永続preview発行→開発画面接続を本線とします。

```text
01 B1      COMPLETE
02 B2-A    FILE_ONLY_TECHNICAL_ACCEPTANCE_PASSED__LIVE_APPLY_NOT_PERFORMED
03 B2-B    NOT_ACTIVATED
04 B3      NOT_ACTIVATED
05 B4      NOT_ACTIVATED
06 B8      NOT_ACTIVATED
07 B9      NOT_ACTIVATED
08 B14-A   NOT_ACTIVATED
09 B5-A    NOT_ACTIVATED
10 B5-B    NOT_ACTIVATED
11 B6      NOT_ACTIVATED
12 B7      NOT_ACTIVATED
13 B14-B   NOT_ACTIVATED
14 B10     NOT_ACTIVATED
15 B11     NOT_ACTIVATED
16 B13     NOT_ACTIVATED
17 B12-A   NOT_ACTIVATED
18 B12-B   NOT_ACTIVATED
19 B12-C   NOT_ACTIVATED
20 B15     NOT_ACTIVATED
21 PCE-U1  NOT_ACTIVATED
```

B2-AはM0 tracked migration baselineとM1 legacy read bridge/current caller rebindを扱う。2026-09-27の限定提案に対するMashの続行指示で、同じfile-only範囲は承認済み。SQL・検証用5ファイルの既存反映を保持し、2026-09-30に6readerのselectorを専用`mymodel_reflections_read`へ切り替えた。凍結試験を変更せず、隔離したnative PostgreSQL 16.15／psycopg 3.3.6／pytest 8.4.1で1 PASS、FAIL／ERROR／SKIP0。これはfile-only B2-Aの技術受入れであり、live DB適用、全HTTP読取経路、保存preview／RN、B2-B開始、商品合格を示さない。詳細はcurrent structure map §4.3とAPI Draft PR #3の最新要約へ戻る。

## 11. Environment assignment

```text
bounded B1-B15 design/code:
  CHAT_PRO_OK (Rule 18 section 0; approved Piece scope only)

actual DB transaction/RLS/migration evidence:
  ISOLATED_DB_REQUIRED

integrated non-production flow:
  STAGING_RUNTIME_REQUIRED

native iOS/Android behavior:
  MASH_ACTUAL_DEVICE_REQUIRED

independent cross-repository acceptance:
  WORK_ULTRA_REQUIRED at PCE-U1/U2

production runtime/migration/rollback/destructive operation:
  DEPLOYMENT_OWNER_REQUIRED
```

Work priority remains:

```text
EmlisAI current executable Work-required task
  > Piece PCE-U1 / PCE-U2
```

## 12. Read order

1. `Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt`
2. `Cocolon_前提資料/current_structure/02_piece_current_structure.md`
3. `Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md`
4. `Cocolon_Piece/manifest.json`
5. revised clean-cutover roadmap
6. PCE-1 through PCE-8 canonical artifacts
7. B01 RED test and pure contract owner at their pinned mashos-api commits
8. B02-A frozen causal RED test bytes and exact target/current files for the already approved bounded implementation
9. PCE-7 RED/test matrix rows assigned to B02-A
10. Analysis作業の場合だけ、`Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md`

## 13. Prohibited

- B01 targeted GREENをPiece全体、PCE-9A全体、releaseのGREENへ拡大する。
- `piece_v2_contract.py`をAPI登録済み、DB接続済み、runtime activeと扱う。
- B01 RED testを次packetで無承認変更する。
- B2-AをB01完了から自動activationする。
- actual migration/RLS claimをmockだけでGREENにする。
- `public.pieces`をlegacy shared caller exact0前に置換する。
- current Q&A routeをM5前にnew v2へ置換・二重登録する。
- B5 source adapterでEmlis visible/internal bodyをコピーする。
- generic free-form monitoringをPiece callerへ開放する。
- missing/unknown Piece flagをtrueにする。
- M7/M8をB1-B15へ混在させる。
- rollbackでold Q&Aを復活させる。
- actual-device/Work evidenceをChatの推測で完了にする。
- PCE-U1、Analysisまたはproductionへautomatic progressionする。
- historical `Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807`を書き換え、current role ownerとして再利用する。

## 14. 9/30時点のactual basis（履歴）

```text
Cocolon historically audited main head / tree:
  de9c3d985053bbaaa7fc0d396e688cc2097ece40
  4e7901f8b3e10d20f242e19be91f6c725f625b2a

mashos-api historically audited main head / tree:
  a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428
  a7f782e48e8ac0c97992c74e5a0c5a828f1a9e00

B02-A causal RED test at the historical snapshot:
  ai/tests/piece_v2/db/test_b02_m0_m1_legacy_bridge.py
  FROZEN_PRESENT
  EXECUTION_CREDIT_UNVERIFIED_AT_THAT_TIME

B02-A implementation required exact5 at the historical main snapshot above:
  absent

2026-09-27 published baseline (historical, not the latest Draft):
  0ea9c99a8fcba9f017248237ccdb3abef0cce590
  exact5 present; exact6 readers unchanged
  FROZEN_TEST_FAILS_CALLER_NOT_EXACT0; NATIVE_DATABASE_GREEN_NOT_ESTABLISHED

2026-09-30 applicable API Draft continuation:
  1a215c511858a574bf76b15d0ed20ddce984744b
  exact5 preserved; exact6 read selectors rebound
  FROZEN_TEST_UNCHANGED; NATIVE_POSTGRESQL_ACCEPTANCE_1_PASS
  LIVE_DATABASE_APPLY_0; NEW_PIECE_RUNTIME_NOT_CONNECTED

current user-visible product:
  old Q&A Piece flow

new Piece pure contract owner:
  present, code-disabled

new Piece API registration:
  absent

B2-A tracked migration and test support:
  exact5 present in the applicable API Draft
  isolated native database acceptance passed / production apply absent

new Piece DB / RN / runtime connection:
  absent

current Piece v2 feature flags:
  absent
```

## 15. 9/30時点のapproved group and bounded result（履歴）

```text
group:
  B2-A M0 Tracked Baseline + M1 Legacy Read Bridge

environment:
  CHAT_PRO_OK (Rule 18 §0 and the explicitly approved B2-A scope)
  ISOLATED_DB_REQUIRED for honest migration GREEN

state:
  FILE_ONLY_B2A_APPROVED_BY_MASH_20260927
  M1_EXACT5_PUBLISHED_IN_API_DRAFT
  EXACT6_READER_REBINDING_AND_NATIVE_DATABASE_ACCEPTANCE_PASSED
  SAME_B2A_SCOPE_REAPPROVAL_NOT_REQUIRED

bounded completed lifecycle:
  exact6 rebindings + unchanged isolated migration test + current-map sync

remaining product work:
  saved preview issuance / HTTP / RN / native renderer / device acceptance
  B2-B is not automatically activated by this result

production DB apply:
  exact0 until separately approved

automatic progression:
  false
```

## 16. Effects

```text
B01 mashos-api source addition:
  exact1 pure contract owner

B01 API / DB / migration / RN / runtime connection:
  exact0

this state-sync Cocolon documentation:
  STAGED_IN_DOCS_DRAFT
  EFFECTIVE_WHEN_MERGED

this state-sync production source / DB / API / RN / runtime:
  exact0

EmlisAI / Analysis technical state:
  exact0

release effect:
  exact0

automatic progression:
  false
```


## 17. 2026-10-06現在地 — B6保存入口と残るpreview発行

本節は`bee83063ce11b42de64f1c635149bbd5066ec3e5`時点の履歴。後続のQ3 context差分と現在の残件は§18を優先する。

実装はAPI Draft PR #3の`bee83063ce11b42de64f1c635149bbd5066ec3e5`。詳細owner・責務・確認範囲は[Piece current map §21](../Cocolon_前提資料/current_structure/02_piece_current_structure.md#21-2026-10-06--保存済みpreviewからb6保存httpへの接続)へ戻る。

- 本人認証した保存HTTP→本人限定の永続preview読取り→現在の保存原入力／Emlis状態／tier／format／recipe照合→既存atomic saveを接続した。クライアントから本文・本人ID・プランを採用しない。
- SQLは原入力→profile→threadを`FOR SHARE`し、変更競合と保存時の閲覧期限を確認する。本文・payload・recipeを保存時に書き換えない。
- 保存済み再送は`replay_only`で同じ保存結果へ戻り、元入力削除・プラン変更後も初回保存へ戻らない。結果不明の自動再送はしない。
- CI [run 37449500208](https://github.com/MassyuRed/mashos-api/actions/runs/37449500208)は今回commitで成功。既存285件の再実行と新規62件を合わせて347 PASS／0 FAIL／0 ERROR／0 SKIP。新規62件にはnative SQL／実lock待ちの10件を含む。ローカルpytestは依存install阻害で未実行。検査は合成認証／preview／handoffとPostgREST応答模擬を含み、実Auth・実PostgREST・実機の成功ではない。
- 次作業は、既存本文組立から公開安全性を実際に判定した永続preview発行への接続。Q3履歴contextとの競合も未解消。`PreparedPiecePreview`を安全性承認済みへ変換しない。
- M4未適用、production router未登録。RN、native保存共有、商品受入れ、merge／deploy／有効化は未完了。旧Q&Aの公開経路は変更しない。

作業環境はCodex Work。同環境のread-only subagent確認は検査補助であり、Pro／Ultraの独立受入れとは扱わない。本入口・current map・manifestの既存3点を同期し、新しい地図や補助機構は作らない。`automatic_progression=false`。


## 18. 2026-10-06現在地 — 消費済みQ3 contextの保存時照合

本節は`d71fdb40238f2c99751f0c20e578ab654f72308e`時点の履歴。後続の再取得と現在の残件は§19を優先する。

対象APIは `d71fdb40238f2c99751f0c20e578ab654f72308e`。詳細owner・競合の範囲・検証状態は[Piece current map §22](../Cocolon_前提資料/current_structure/02_piece_current_structure.md#22-2026-10-06--q3観測が消費したcontextの保存時再照合)を参照する。

- §17で残したQ3保存競合のうち、観測が消費した既存履歴source／threadとpremium feedbackの変更をatomic saveまで保護する。評価tier、現在履歴へのguard包含、feedbackの完全一致、quota待ち後の履歴期限を既存`emlis_thread_context`と照合する。
- 既存Q3のprofileロックを用いるthread／feedback writerとの直列化を使う。新規・過去日付入力の追加等による履歴選択集合の変化と、profileロックを共有しないwriterは未解消の残件であり、全writerを監査・保護したとはしない。
- 保存本文・payload・recipeは変更せず、履歴本文もPiece作者へ渡さない。保存済み再送は現在contextへ戻らず、同じ保存結果を返す。
- 修正後CI [run 37451592242](https://github.com/MassyuRed/mashos-api/actions/runs/37451592242)は373 PASS／0 FAIL／0 ERROR／0 SKIP。新26件はtest-only baselineで21 FAIL／5 PASSとなり、同じtest bytesのまま修正後に全PASS。既存347件も両commitで再実行して成功した。新26件はnative SQLで、消費行・通常profile writer・quota期限の実lock待ち8件を含む。合成認証／preview／handoffと隔離DBの検査は、実安全性・実機の商品受入れとは区別する。
- preview発行の調査では完全な公開安全性判定の実装ownerが未完成だった。source graph／役割抽象化やdetectorの拒否だけで`ready`にせず、今回は既に記録された保存不整合を直接修正した。実生成物の公開安全性判定と永続preview発行が次の本経路である。

最新weekly reviewは2026-10-03、原典読取りとSystem Context prepareの不成立範囲はmap §22.4に記録した。Codex Workと同環境read-only確認による作業であり、Pro／Ultraの独立受入れではない。M4未適用・production未登録を維持し、B5／B6全体完了、RN・実機・商品受入れ、merge／deploy／有効化は未成立。本入口・current map・manifestの既存3点を同期し、`automatic_progression=false`を維持する。


## 19. 2026-10-06現在地 — 本人の保存済み履歴・詳細GET

本節は`e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`時点の履歴。後続のLatin人名対応と現在の残件は§20を優先する。

対象APIは `e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`。詳細は[Piece current map §23](../Cocolon_前提資料/current_structure/02_piece_current_structure.md#23-2026-10-06--本人の保存済みpiece履歴詳細の再取得)を参照する。

- `GET /emotion/piece/history`と`GET /emotion/piece/{piece_id}`で、認証本人のsaved private／public recordだけを専用projectionから返す。公開Nexus・旧Q&A履歴を流用しない。
- 同じ本文・payload・recipe・hash・renderer／contract versionを再取得する。保存済み`ready|adjusted`を返すだけで新たな安全性承認はせず、原入力・現在プラン・本文作者を呼ばない。書込み・quota消費0。
- 履歴は既定20件／最大100件、保存日時・IDの降順keyset。ownerに結び付いたcursorを使い、境界削除や先頭への追加によるoffsetの重複を避ける。
- 修正後CI [run 37453508303](https://github.com/MassyuRed/mashos-api/actions/runs/37453508303)は414 PASS／0 FAIL／0 ERROR／0 SKIP。新41件（native 4件）はbaselineの40 FAIL／1 PASSから同じtest bytesで全PASS、既存373件も両commitで再実行して成功した。模擬認証／PostgREST応答と隔離DBの範囲であり、実Auth・実機の商品受入れではない。
- 公開安全性には、役割が明記されたLatin／ひらがなの人名と第三者への断定が候補へ残る具体的不足がある。preview発行を`ready`で代用せず、今回の保存後再表示を独立した限定単位とした。10/03議事録§5.3のpreview→開発画面は未完了。

Q3の新規・過去日付入力による履歴集合の変化は、profile lockへ参加しない既存submit／INSERT経路を含む共有writer protocolの残件として保持する。今回source writer・CMEE・RNは変更0。B7のvisibility／delete、RN履歴、native保存共有も残り、B5／B6／B7全体・商品受入れは未完了。原典確認、Codex Workの同環境確認、System Context prepare不成立と直接読取りの範囲はmap §23へ記録した。production未登録・M4未適用・merge／deploy／有効化0、`automatic_progression=false`。


## 20. 2026-10-06現在地 — 明示された役割へのLatin人名置換

対象APIは `ee81b49203509c92c63a776b22c54176f9f57d37`。詳細は[Piece current map §24](../Cocolon_前提資料/current_structure/02_piece_current_structure.md#24-2026-10-06--明示された役割へlatin人名を置換する本文修正)を参照する。

- ASCII／全角Latinと既存漢字／カナの混在人名を全tokenで扱い、明記された「友人のAliceさん」等を既存の関係表現へ置換する。条件・否定・留保・owner連鎖を保持する。
- 大文字小文字・全半角を同一人物へ正規化しない。アクセント・結合文字・数字・ハイフン・アポストロフィ等の未対応名を既知末尾へ部分置換せず、`たくさん`／`みなさん`の確認例は人物扱いせず保持する。
- 最終CI [run 37456010795](https://github.com/MassyuRed/mashos-api/actions/runs/37456010795)は新35件＋近傍旧3suite194件＋API／DB414件の643 PASS／0 FAIL／0 ERROR／0 SKIP。新35件は同じtest bytesでREDの33 FAIL／2 PASSから全PASSとなり、旧集合も両commitで再実行した。過去の全Piece133失敗は今回全再実行しておらず、解消済み・全Piece合格としない。
- ひらがな人名・第三者断定・PCE-4安全性判定issuer・永続preview発行・RN接続は残件。今回候補は`OFFLINE_NOT_ACCEPTED`、production false、record／quota 0のままである。

既存3資料を同期し、新しい地図や安全性機構を追加しない。原典確認・環境と検証範囲はmap §24へ記録。DB／API契約／RN／共有writer／merge／deploy／有効化への変更0、正式商品受入れ未成立、`automatic_progression=false`。


## 21. GitHub反映済み再開点 — 役割明記のひらがな人名

API `4033e1f323c06c4bad369b03583d5b87e84fb0d5` と、先行する33検査 `355226b95c23d6a552ebb800332f1b75f88a6e7c` を保持する。詳細はcurrent map §25。原文に書かれた関係と名前の対応に限る限定修正であり、PCE-4全体・preview発行の完成ではない。

旧FIX run `37461341829` は676 PASS／0 FAIL。後続B7 runの工程成功・対象件数とは分け、単純加算しない。旧警告・SHA-256の訂正はAPI PR #3 comment `6016091963` の記録とmap §25へ戻る。§20の643 PASSは旧Latin修正時点の履歴として残す。


## 22. 反映済み再開点 — 保存済みPieceの公開切替・削除HTTP

API `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996`。詳細はcurrent map §26。既存の未登録routerを既存store／SQL terminalへ接続する4pathの変更であり、GitHub未反映の140件候補へ戻さない。本人認証・版番号・削除の同じキーを保持し、本文／recipe再生成、quota操作、仮の安全性付与、自動再送を加えない。

2026-10-07の[run 37533895479](https://github.com/MassyuRed/mashos-api/actions/runs/37533895479)はHTTP 152件・隔離native SQL接続13件が成功、既存B2〜B8工程も成功した。前回実行の結果を記録したもので、資料同期作業での再実行ではない。Auth／PostgREST transportは合成、実Supabase・実機・Nexus/cache非表示化・商品受入れは未確認。

次の本線は公開安全性実判定→永続preview発行→同じ本文と画像設定の開発画面である。既存detector成功や内部組立物の存在を安全性判定へ昇格せず、PCE-4 S0〜S8の不成立を残したまま発行しない。B7の確認済み実装・隔離検証を作り直さず、3資料の更新後全文と適用差分を作成・照合済み。GitHub反映と反映後の再取得は別に確認し、ZIPだけでremote同期済みにしない。

production未登録、共有DB・Render・RN・旧Q&A・Emlis/Analysis・merge/deploy変更0、`automatic_progression=false`。B7全体や10/07の画面接続・10/10完成を成立した扱いにしない。


## 23. 2026-10-08 — 保存参照GET・RN受渡し・起動フラグの現在地

最新の実装はAPI `0312a0fc`と、RN `df88a0e0`の `features/piece/pieceApi.js::requestPieceSourceRef`。対応する構造はcurrent map §27、API契約の追加は `pce6_api_db_rn_migration/Piece_API_CleanCutover_Design_20260808.md` §11。直前に提示した参照取得GETの採用・非稼働コード反映の範囲に対するMashの続行指示として実施し、実DB・デプロイ・有効化へ拡張していない。

本人の保存入力IDから既存7項目のsource_refを取得し、別の明示操作で既存preview POSTへ渡す。GETだけで本文生成・保存・quota消費は起こさない。原入力やEmlis／Analysis本文を再送せず、source_refからeligible／enabledを推測しない。

APIの別routerとRN関数は実装pathへ反映済みだが、app.py・InputScreenへ未登録。先行RN `c78b0b1f`の本文表示、`b03311fd`の8フラグ受取、`467cc589`のforeground刷新を作り直さない。新しい認証状態変更時の刷新とPIECE_FEATURE_DISABLED連携、サーバーの実効flag供給・操作時強制、保存後のInputScreen接続、native画像出力は未完了。

今回HTTP36件、RN239件（既存203＋既存候補36）が成功。ASGIが返した2段階のJSONを実ESM4モジュールへ渡し、明示POST後のmodal全文と3hashの一致も確認した。認証・保存adapter・React/RN・通信は検査用代替を含み、実Auth／DB／実画面／native／CIの成功ではない。詳細とimport代替は既存handoff末尾の本続行節へ戻る。

旧source-ref候補patchは履歴であり、現行コードへ再適用しない。旧DocSync候補は本改訂に含まれる現在地に追い付いていないため、盲目的に適用しない。今回の入口・map・manifest同期の結果は反映後のblob／head確認で別に記録する。System Context prepareは部分コピーにmoduleがなく失敗し、既存正本が許可する実ファイル直接参照を使用した。全repo・全歴史地図の新規監査ではない。

次は同じ保存入力→preview→開発画面の未接続箇所を閉じる。文章微調整や履歴拡張を主作業へ置かず、default OFF・旧Q&A未切替・商品未受入れ・10/10目標の達成未確認を維持する。


## 24. 2026-10-09 — 認証通知後の表示フラグ再取得

コード反映先は `1492c9c875485809789b4ebaf7fa33403b2ea2fe`。今回の資料同期より先行する別commitで、source／testの2pathと反映後blobを確認した。

既存 `AppRuntimeContext.js` が既存 `lib/supabase.ts` の認証通知を購読し、通知時にPieceの8表示フラグを同期的にOFFへ戻す。認証処理のコールバック内ではHTTPを呼ばず、通知後に既存 `/app/bootstrap` を一回再取得する。通知の連続は予約をまとめ、手動・foregroundの再取得が先に始まれば重複しない。背景化・破棄で予約を取り消し、古い応答は新しい状態へ戻さない。認証情報や本人IDをruntimeへ保持せず、通知そのものを権限・有効化と解釈しない。

既存hostとの検査では、表示済み本文を認証通知で隠し、bootstrap成功後も古い本文を復活・自動再生成しない。本文・source_ref・API要求と同一キー・3hash・画像設定の意味は変えていない。App／AuthProvider／bootstrap gateの配置、非Pieceの既定値と版情報、既存foreground処理を維持した。共有bootstrapなので正常な他機能のmetadataも再取得されることは、明示した影響である。

Node v22.16.0で260 PASS／FAIL0／SKIP0／cancelled0。既存239件を保持し、認証通知の21回帰検査を追加。最初の20件は未修正で16 FAIL／4 PASS、旧runtime41件は成功。取消済みtimerの追加1件は初版修正でFAILを再現し、最終版で解消した。旧検査の本文・期待値は変更せず、runtime harnessに認証通知／timerの代替を追加した。実React、Supabase Auth、HTTP、OS、端末での成功ではない。

前回未反映だった入口・map・manifestの同期候補を現行preimageと照合し、今回の追加差分を同じ資料単位へ含めた。実際のGitHub反映はbranch／blobの再取得結果と区別して報告する。API／RNの反映済みsource-ref patchを再適用しない。詳細ownerと制約はcurrent map §28、実行記録は既存source-ref handoff末尾。

次の直接残件はサーバー実効flag供給・操作時強制、保存入力からInputScreenへの接続、PIECE_FEATURE_DISABLED連携。今回をB14-B／10/10目標全体の完成とせず、実Auth／DB／端末の一往復・native画像出力・商品受入れは未完了のまま保持する。実DB・env・deploy・build・依存追加・main／merge・有効化・実ユーザーデータ・Emlis／Analysis変更0。`automatic_progression=false`。

## 25. 2026-10-09 — 開発用プレビューの機能停止応答

PCE-7 §12の停止応答の受取りを、既存Piece API／controller／hostから既存AppRuntimeContextの再取得へ接続した。`503 {"code":"PIECE_FEATURE_DISABLED"}`だけを停止として受け取り、通常の通信失敗と区別する。開発hostはプレビューを閉じ、同じ要求の再試行を抑止してbootstrapを一回再取得する。成功しても本文の復活・自動生成はしない。新しい所有者・保存入力へ変わった後の古い応答では再取得しない。

Nodeの対象6suiteは282 PASS、失敗・skip・取消し0。既存260件の本文・期待値は保持し、追加22件の同じ最終検査は修正前11 PASS／11 FAILから修正後22 PASS。React／認証／通信／端末は代替であり、実機成功ではない。詳細・現在の制約はcurrent map §29。

サーバー実効flagと操作時強制、InputScreenと保存入力GETの画面接続は未完了。今回の503はRN受取側の限定対応であり、稼働サーバーからの発行を確認したものではない。実DB・env・deploy・build・新依存・main／merge・有効化・実ユーザーデータ・旧Q&A・Emlis／Analysis変更0。`automatic_progression=false`。


## 26. 2026-10-09 — 中断復旧：サーバー実効フラグとpreview操作時制御

中断前にAPI `aa6cf858ee8d258772fc1d9b96ac5d27133c53df` へ反映されたB14-Aの限定差分を再取得し、作り直さず検証した。既存8フラグの単一resolverを既存bootstrap/startupへ接続し、source-ref GETとpreview POSTを認証後・処理前・返却前で制御する。POSTはRPC送信直前にも確認する。requestedとreadyは別のサーバー内部値で、欠落・不正値はOFF。実環境の設定供給・readinessの成立を今回実装・承認したものではない。

今回再開後の検査はAPI86 PASS、無変更RN282 PASS、失敗・skip・取消し0。APIの内訳は従来source-ref36件＋停止codeの既存parameter展開1件＋B14-A49件。件数を新しい欠陥解消数へ換算しない。実ASGIが返したbootstrap ON/OFFとGET/POST停止応答の4packetを既存RNへ渡し、modal終了・既存bootstrap再取得・自動retry/本文復活なしを確認した。React・認証・保存/生成・RPC・HTTP transportは代替を含み、実DB・実機・商品受入れではない。詳しい内訳と限界はcurrent map §30。

次は本人保存入力からInputScreenへつなぐ同じpreview経路。稼働構成のreadiness/TTL/renderer供給、ルート登録、実認証/DB/端末は別に未完了。取消し・保存済み操作等の全フラグ制御、capabilities/quota、native画像生成/取り出し/保存/共有も残る。今回のAPI制御はsource-ref GETとpreview POSTの範囲であり、B14-A全体・10/10目標を完了扱いにしない。実DB・env・deploy・build・依存・main/merge・有効化・利用者データ・旧Q&A・Emlis/Analysis変更0。`automatic_progression=false`。


## 27. 2026-10-09 — 保存入力の参照取得を既存開発hostへ接続

Cocolon `c1485bf13e4e3a1c57b52037cb13d802f568f308` で、既存 `screens/input/InputPieceActionArea.js` と追加検査 `tests/piece-v2-saved-input-host.test.js` を反映した。既存の確定済みrequestを受け取るcontext方式を保持し、保存入力ID・認証照合用owner・呼出し元が保持する同一キーだけを受け取るsavedInput方式を追加した。現在のAppRuntimeContextが許可する場合だけ、明示操作で既存source-ref GETを呼ぶ。返った7項目を既存controllerへ渡し、別の「この入力をPieceにする」操作で既存preview POSTを呼ぶ。取得成功だけで自動生成・保存・画像化しない。

同じowner/keyへ別の要求を付け替えない。入力・アカウント・runtime・背景化・破棄後の古い取得結果を採用せず、現在の停止応答では既存bootstrapを一回再取得する。取得中の二重送信を避け、通信失敗の再試行は本人の明示操作だけにする。本文・3hash・recipeを既存表示経路へそのまま渡し、原入力やEmlis本文を再送・保存しない。元の入力へ戻った時に、同じcontroller contextでも参照取得完了の表示更新を通知する不具合修正を含む。

今回の最終Node検査は303 PASS／FAIL0／SKIP0／cancelled0。既存6suiteの282件をbyte不変で保持し、追加21件の同じ最終test bytesを元hostへ戻して実行すると21 FAIL、既存282 PASSだった。React/native・HTTP/Auth・runtime・時刻は検査用代替であり、InputScreenをmountした結果、実Auth/DB/端末・CI・商品受入れではない。API86件とASGI4packetは前回復旧の記録で、今回の再実行ではない。

**InputScreen本体は未変更・未接続。** 現在の入力保存成功 `submitResult.id` と本人・観測表示の既存経路を読み取ったが、本hostへ保存IDとキーを供給する実画面の組込みまでは完了していない。次はその同じ保存入力→既存host→previewを接続する。機能有効化・稼働設定のreadiness/TTL/renderer供給・API登録・実認証/DB/端末・capabilities/quota・native画像保存共有も未完了で、10/10目標やB10全体を完了にしない。前回の未同期§26/map§30を本3資料候補へ含め、反映結果はGitHubの実ファイルと別に照合する。`automatic_progression=false`。

## 28. 2026-10-09 — InputScreenの保存成功から本文プレビューへの組込み

Cocolon `f65c19e01d630a31499414fea10fb20eecff0c5c` で既存 `screens/InputScreen.js` に、直前に保存が確認された入力IDを `InputPieceActionArea` のsavedInput方式へ渡す呼出しを組み込んだ。元入力やEmlis本文は渡さず、既存Emlis表示が閉じた後のHomeに「直前に保存した入力」を示す。本人の「保存入力を確認」で既存GETを呼び、その成功後の「この入力をPieceにする」で既存preview POSTと同じ本文・3hash・画像設定の表示へ進む。Emlis readerが開いた／閉じたこと自体をterminal適格性にせず、GETの保存状態照合を省略しない。

入力画面は保存ID・認証照合用owner・一度作成した不透明な同一キーだけを保持する。既存index.jsのrandom-values polyfillを使い、鍵用乱数取得に失敗しても入力保存を失敗へ変換しない。再表示・通信再試行でキーを作り直さない。未保存・保存失敗／timeout・不正ID・チュートリアル・OFFでは接続せず、本人切替／画面離脱／破棄／tutorial reset後の古い保存結果を採用しない。新しい入力編集中や他modal表示中には混在させない。

最終Node検査は既存303件＋追加29件の332 PASS、失敗・skip・取消し0。同じ最終検査を元のInputScreenへ戻すと319 PASS／13 FAILで、既存303件は両方で成功した。最初の検査用環境でのVM配列比較・不安定なmock callbackによる失敗は修正したが、商品不具合数には数えない。InputScreen全文をTypeScript 5.8.3で構文変換して実行し、既存Piece実ソースへ接続した検査である。React hooks／Home／Emlis／認証／HTTP／乱数／nativeは代替、成功packetも合成で、実React・Hermes・実DB・実機・CI・商品受入れの成功ではない。

今回のInputScreen組込みはコード上で成立し、履歴一覧からの入力選択や実アプリの稼働一往復まで成立したとはしない。次は同じ画面が呼ぶAPIの登録・readiness／TTL／renderer供給の未接続を扱う。稼働DB・deploy・有効化の個別承認は維持し、capabilities／quota、native画像生成・保存・共有、残る操作制御、正式商品受入れは未完了。旧Q&Aの切替・Emlis／Analysis変更・新依存・main／mergeは行わない。`automatic_progression=false`。

## 29. 2026-10-10 — DB適用完了後の実接続再開位置

詳細はcurrent map §33。API `e81c112900f5439a49cd99c7178c2959237984c3` の専用 `create_piece_preview_application`、実CMEE/B9→限定安全性判定→隔離DBの13件、既存契約146件を継承する。InputScreen `f65c19e0`、既存host、認証・停止時のフラグ処理も作り直さない。これらは先行実行の記録であり、今回再実行していない。

**新Piece DBの既存001〜004は適用・確認済み。未適用は0。** `cocolon-project / oeahmpmigszggnkyiivq` の記録versionは順に `20261010014326`、`20261010014413`、`20261010014441`、`20261010014516`。8テーブル・2ビュー・5関数名／6シグネチャと構造・権限・履歴を確認済み。旧piecesの定義・ACLは保持。詳細は[API実行記録](https://github.com/MassyuRed/mashos-api/pull/3#issuecomment-6092348061)と[PR30適用記録](https://github.com/MassyuRed/Cocolon/pull/30#issuecomment-6092352103)。今回の資料同期でDB照会・再適用はしていない。古い未適用表示から4本を再実行しない。前回Chatの拒否理由は不明だが、Workでは4本成功済みで解除待ちへ戻さない。

実接続の残りは設定だけではない。入力保存・bootstrap・新Pieceは同じAPI baseを使用する。共有appは旧previewを同じURLへ登録済みで、新source-refとruntime stateは未接続。専用factoryは4経路だけで入力保存を持たないため、base変更や起動CLIだけではInputScreenの一往復を成立させられない。

次はmap §33.4の共有app採用構成、preview/source-refの契約台帳整合、明示TTL／renderer／requested／ready供給、同一baseの隔離検証を一組として確認する。旧Q&A切替はPCE-6 §7／§11・PCE-8 B12-Cの個別境界。今回除外されたdeploy/env/activation/native build/main merge・実利用者生成試験も未実施。DB成功だけでreadyを立てず、検査設定を稼働値へ採用しない。未呼出helper、別factory、CLI、追加CIを成果として増やしていない。

本同期は既存3資料だけを変更する。製品source/SQL変更、新規pytest/Node/CIは0。実Auth・実InputScreen往復・実機preview・native画像保存共有・Piece全体完成は未確認／未完了。最新weekly ownerは10/10議事録§5.5で、Emlis＋分析の先行実機確認と12/18公開目標を維持。`automatic_progression=false`。

## 30. 2026-10-10 — 共有API切替用コードと隔離検証を反映

最新の現在地はcurrent map §34。Mashの明示承認を受け、稼働環境を切り替えないsource準備・隔離検証を実施した。APIの最終検証commitは `875dca35c02715c8f572344c78715850862d2902`。§29の共有API不足は、明示候補の `app.create_application(piece_preview_configuration=...)` により、入力保存・bootstrap・source-ref・previewを同じappへ構成するコードを反映した。通常のmodule-level `app` は旧構成のままで、新しい環境変数や起動CLIは追加しない。

新previewのownerは1本、候補のheaderはv2。候補だけ旧reflection-preview aliasを404にし、旧DTOを新handlerへ渡さない。他の旧Piece/Q&A経路は残り、M5全面移行ではない。空configurationは全OFF、検査用TTL／rendererは稼働値へ採用していない。

[CI run 38016668498](https://github.com/MassyuRed/mashos-api/actions/runs/38016668498) は最終commit `875dca35c02715c8f572344c78715850862d2902` でsuccess。共有HTTP新規16件＋既存公開契約10件＝26 PASS、共有native新規2 PASS。既存preview契約146件・既存composed native13件も再実行してPASS、workflow全20検査batchの合計は1,452 PASS／FAIL0／SKIP0。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。従来のPydantic validatorとon_eventの非推奨警告は残る。サーバーlifespan方式の変更は今回行っていない。

最初のrunは私の変更したshutdown登録方法がFastAPIに存在せず、共有app importで停止した。既存のon_event登録へ修正して再実行し、期待値を緩めていない。既存InputScreen・host・実生成経路・SQLは保持する。RN332件は先行証拠のままで、今回再実行していない。

再開位置は稼働TTL／renderer・requested／readyの採用根拠と、PCE-6/PCE-7 M5の残る移行条件を確定する工程。稼働切替・実Authから同じInputScreenの実機往復・画像保存共有は未実施。DB4本は適用済みで再実行しない。今回の限定準備承認を稼働変更承認へ拡張しない。`automatic_progression=false`。



## 31. 2026-10-10 — 保存・本人操作へPCE-7停止制御を接続

API `227bacf8a1925345fc680a6b54d6e0ba484e6f27` で、未登録の保存・本人履歴／詳細・公開範囲変更・削除を既存サーバー実効フラグへ接続した。認証後に確認し、既存IO境界の直前／直後と返却前でも再確認する。公開指定にはpublic_writeを追加し、空白付きpublicも既存正規化で同じ扱いとする。本人回復とpreview取消しの独立性を保持する。詳細はmap §35。

[CI run 38017728318](https://github.com/MassyuRed/mashos-api/actions/runs/38017728318) はAPI `227bacf8a1925345fc680a6b54d6e0ba484e6f27` でsuccess。既存workflow全20検査batchは1,489 PASS／FAIL0／SKIP0（先行1,452件に今回37件追加）。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。既存の共有候補・default契約・native接続検査も成功し、Pydantic validator／on_eventの既存非推奨警告は残る。local pytestは実行していない。

製品変更は既存API 1file、検査は既存4file。既存resolver・service/store・SQL・共有app・RN・workflow・依存は変更しない。実Auth・本人データ・実機・正式商品受入れは未確認。DB4本の適用済み記録を維持し、再適用・稼働env／deploy／activation／native build／main mergeを実行していない。

次はcapabilities／quota、保存・本人操作のRN接続、renderer／画像保存共有等の未完成部分と、M5の旧経路一括移行・設定採用条件。今回のsource補修だけでpreviewを稼働有効化せず、個別の稼働変更承認を省略しない。既存factory/InputScreen/生成・保存処理を作り直さず、weekly review §5.5の順序を維持する。`automatic_progression=false`。


## 32. 2026-10-10 — quota読取APIとservice-only集計関数

API `d3904888f31f105b8c77bcfda9ec9cc80aa5be0b`。未登録v2 routerの`GET /emotion/piece/quota`を、本人の現在プランとJST当月の不変消費台帳へ接続した。既存exact7応答とFree5／Plus30／Premium無制限を保持。削除で回数を戻さず、DB失敗を使用0へ変換しない。can_saveは回数の参考値で、最終保存許可は既存SQLが担当する。

直接table SELECTは既存権限で不可能なため、新規`20261010_005_piece_v2_quota_read.sql`の読取専用RPCを使用する。既存tableのACL／RLSを緩めず、service_roleだけが実行できる。preview表示経路として既存previewフラグへ対応付け、RPC前後の停止確認を行う。詳細・対応付けの根拠はmap §36。

[CI run 38018804564](https://github.com/MassyuRed/mashos-api/actions/runs/38018804564) はcommit `d3904888f31f105b8c77bcfda9ec9cc80aa5be0b` でsuccess。追加quota検査39件（native2件を含む）が成功し、既存workflow全21 batchは1,528 PASS／FAIL0／SKIP0。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。既存Pydantic validator／on_eventの非推奨警告は残る。local pytestは未実行。

**001〜004適用済み／005稼働未適用**を区別する。本番DB・env・deploy・有効化・native build・main mergeは変更していない。次はPCE-6のcapabilitiesとquotaをpreview／RNへ同時に接続する工程。現RNの厳密な応答検証を保持し、backend単独の応答追加はしない。保存・本人操作の画面、画像保存共有、旧経路切替・実機の残件を継承する。`automatic_progression=false`。


## 33. 2026-10-10 — previewのプラン別設定・利用枠を本文画面へ接続

API `004a85eeb7af83b68ae1c1fba42ec2d6941b6874`、RN `e5f112a826c6b99732aaaa01f365ea95114037ef`。PCE-6のplan capabilitiesと既存exact7 quotaをpreview応答へ加え、RNの厳密な契約検証と既存本文modalの表示を同時更新した。Free固定形式、Plus自動形式、Premium適格形式選択、各planのテーマ／比率／Cocolon表記とJST月の残回数を表示する。画像設定変更・保存／export操作は有効化していない。

quotaは生成前・同じキーの再取得でも読み、現在source tierと一致しなければCONFLICT。RPC欠落／失敗は本文生成前に503。保存artifact・3hash・expiryは維持し、quota残0でもpreviewを禁止しない。最終保存は従来のSQL再判定がownerであり、can_saveは表示情報に限る。

API CI 38019674020＝1,537 PASS、RN CI 38019722996＝365 PASS（既存8suite）。FAIL／SKIP0。実Auth・PostgREST／React-native等は代替を含み、実機・商品合格ではない。初回RN検査の旧fixture不整合2件は修正済み。詳細、各path・検証範囲・System Context失敗からの原典fallbackはcurrent map §37。

次は既存preview identity／revision／3hashを保持した保存・本人操作のRN接続。preview形式／画像設定変更・private／public選択・native画像保存共有・M5・稼働設定・実Auth／実機も残る。既存001〜004を再適用しない。005は稼働DB未適用で、preview候補の利用にも必要。APIとRNを同じ応答形で配置する必要はあるが、今回配置／有効化はしていない。最新weekly review §5.5・12/18目標と既存実行境界を保持。`automatic_progression=false`。


## 34. 2026-10-10 — 保存済み本人履歴・詳細・公開範囲変更・削除のRN接続

最新の詳細ownerはcurrent map §38。既存履歴メニューからowner_read flag有効時だけ「自分のPiece」へ進み、canonical全文・公開状態・保存日時・形式/テーマ/比率を表示する。本人専用APIを使い、Nexus/共鳴履歴を流用しない。公開変更は明示確認＋expected_row_version、競合時は最新詳細再読。削除は外部画像回収不可/回数不返還の確認後だけで、応答不明時は同じkey/versionによる明示再試行。本人切替/背景化/離脱/停止後の古い結果を表示しない。

今回のlocal検査はowner32件＋既存7suite336件＝368 PASS。別途既存CIでInputScreenも含め確認する。Auth/HTTP/React/nativeは代替を含み、実機・B11全体・商品受入れの成立ではない。保存前native fitが未接続と判明したため、本文からの保存は有効化していない。次はnative画像プレビューと保存前fit、その後に同じpreviewの保存接続。画像保存共有・M5・005稼働適用・実Auth/実機も残る。001〜004適用済みをread-only migration履歴で確認し、再適用なし。製品API/SQL/env/deploy/native build/main mergeは不変更。weekly review §5.5と12/18目標を維持し、automatic_progression=false。

§34最終確認：実装commit `11b61579ff0f119bfbbf12e1fecd60354667ffb3` の[CI 38021152558](https://github.com/MassyuRed/Cocolon/actions/runs/38021152558)で、InputScreenを含む9suite **397 PASS／FAIL0／SKIP0**。GitHub再取得で対象14fileの内容と変更pathを照合した。local368件とは別に足さない。今回のコード接続は反映済み、稼働有効化・native画像/保存・実機は未実施。


## 35. 2026-10-10 — 固定比率の確認用画像プレビューを本文modalへ接続

既存PiecePreviewModalへB10指定PieceVisualCardを接続し、B13-C指定pieceLayoutが1080 logical canvas、既定catalog、native行寸法によるサイズ候補調整を持つ。全文blockとbrandingの測定が揃うまで透明、overflowは規定サイズだけ降順、floor失敗／欠イベント8秒は表示不可。本文確認は維持する。preview identity/3hash・候補font・測定世代に結ぶため、旧eventや旧timeoutを新表示へ流用しない。

今回のgeometry_checkedは画像レイアウトの確認用表示。glyph/実ink/禁則・B9とのlayout同等性・指定renderer対応・PNG/export・実機は未成立で、保存前fit成功ではない。canSave/canExport=false。次は同じnative canvasのglyph/inkとlayout/renderer admissionを成立させ、既存保存API接続へ進む。SQL005稼働未適用、001〜004適用済み、M5/設定変更/画像保存共有/実Auth実機の残件を維持する。

local既存368＋新renderer18＝386 PASS／FAIL0／SKIP0。InputScreen含むCI結果は後続確認。測定値/React/nativeは代替で、実機合格ではない。根拠・owner map・検証境界はcurrent_structure/02_piece_current_structure.md §39。API/DB/env/deploy/activation/native build/main merge変更0。weekly review §5.5・12/18目標・automatic_progression=falseを維持。


§35最終確認：source `1976de5ca9f2d9c6c68b3cdfb8ca7f1bc2f19c6e` の[CI 38022110375](https://github.com/MassyuRed/Cocolon/actions/runs/38022110375)でInputScreenを含む10suite **415 PASS／FAIL0／SKIP0**。remote再取得で今回9fileのbytesと変更path集合を確認済み。native試作のコード接続が成立した結果であり、保存前fit・PNG/共有・実機の完成ではない。


## 36. 2026-10-10 — 同じnative Textのglyph観測・描画範囲・改行を検査

current map §40が現在の詳細owner。Androidはmount済みReactTextViewのLayout＋実font spanを使い、一時Bitmapの描画範囲を調べる。iOSは同じTextKit storage/layoutを既存RN 0.77.3へのread-only accessor patchで読み、glyph/font観測と描画範囲を調べる。両方とも全文・font・行末をJS測定と照合し、native文字境界と硬い禁則も確認する。新ライブラリ・capture依存は導入しないが、RN本体patchとnative module登録の変更は含む。

全blockの検査が揃うまで画像は透明。不明・欠損観測・timeoutは全文確認へ戻り、描画範囲overflowだけ規定font候補を降順に試す。古いnative promiseや発火済みtimeoutを新測定世代へ反映しない。native_checkedはno_missing_observedの確認用で、保存前fit/指定renderer admission/実機合格ではない。canSave/canExport=falseを保持する。

local9suite394 PASS／FAIL0／SKIP0、rendererは26件（今回8追加）。固定RN原本へのpatch適用は成功。CI/単体native sourceコンパイル結果は後続確認。app build・実機は未実施。次はB9 soft-wrap同等性とrenderer admission/実機描画受入、その後に保存を接続する。native capture/共有・preview設定変更・M5・005・実Authも残る。weekly§5.5、12/18目標、既存001〜004適用済み、automatic_progression=falseを維持する。


§36最終確認：source `7554b9cd716efab15e03d3c321c2ac4900da4bfb` の14fileをremote全文/path一致確認済み。検査環境だけを直した `888723804129afe63bf35b8dac50720b2d8757ee` の[CI 38023650569](https://github.com/MassyuRed/Cocolon/actions/runs/38023650569)は全3job成功。JSはInputScreenを含む423 PASS／FAIL0／SKIP0、Android javac単体source compileとiOS clang syntax-only・patch適用・pbxproj確認も成功。Androidのannotation不足警告18件はmap§40.4に記録。app build/実機描画/保存前fitは未成立で、保存・共有を有効化しない。

§36追加補修：nativeの硬い禁則違反で最初のfont候補から直ちに画像不可へ落ちる動作を、実component＋合成native応答で再現した。全応答・書記素・描画範囲を照合した後、禁則違反だけは次の規定fontで全文を再測定する。全候補失敗は画像不可、glyph不明・不正応答は即停止。prototypeをv2へ更新し、本文・recipe・保存rendererのversionは変えない。local9suite399 PASS（renderer31件）。source `01088f7a69828c08a8c9ec0a98536f47efab0772` の[CI 38024570077](https://github.com/MassyuRed/Cocolon/actions/runs/38024570077)はInputScreen込み428 PASS／FAIL0／SKIP0、Android/iOS単体source検査も成功。対象7fileのremote bytesと変更path集合一致を確認済み。OS上の自然改行での発生・実機解消は未確認。詳細と次工程はmap§40.5。B9のsoft-wrap選択器を接続した結果ではなく、§40.3の保存前fit残件を継承する。

## 37. 2026-10-10 — 保存済み本人詳細へ確認用画像レイアウトを共通接続

詳細はcurrent map §41。freshな本人詳細に限り、既存PieceVisualCardとpieceLayoutの同じcatalog/geometry/native検査を使用する。saved契約＋3hashを再確認し、preview expiryや現在plan/quotaを持ち込まない。対応は実装済み`piece.rn_native_preview.prototype.v2`だけ。未知の保存rendererを現在の外観へ置き換えず、画像を表示できない場合も全文・本人操作を残す。一覧全件のnative測定は行わない。

本人変更・背景化・停止・履歴再読・公開変更/削除中は既存host/controllerにより画像を除く。測定は保存identity/版/3hash/rendererへ結び、遅延結果を新しい詳細へ流用しない。native_checkedは確認用で、保存前fit・export・実機合格ではない。対応versionの実保存record存在も未確認。

local9suite405 PASS／FAIL0／SKIP0（今回6追加）。InputScreenはlocal TypeScript欠落により未実行で、既存CIを反映後に確認する。ソース準備のみで、依存/native/API/DB/env/deploy/activation/build/main merge変更0。次はB9 soft-wrap・native metrics・renderer admission/実機・保存前fit→保存。本工程の詳細接続を再実装しない。画像保存共有・Nexus・設定変更・M5・005・実Authも残る。weekly§5.5・12/18目標、automatic_progression=falseを維持。

§37最終確認：source `631873265959a3a3c4ff0949744b9c1cb342f193` の対象8fileをremote全文／変更path集合／親head一致確認済み。[CI 38024824965](https://github.com/MassyuRed/Cocolon/actions/runs/38024824965) はInputScreenを含む434 PASS／FAIL0／SKIP0、Android/iOS単体source検査も成功。既存contract guardsもsuccess。nativeのannotation不足警告18件と、実機・保存前fit・実保存renderer存在未確認をcurrent map §41.4へ記録した。


## 38. 2026-10-10 — nativeで測った候補からB9の行を選んで描画

詳細ownerはcurrent map §42。既存Python B9を純粋JSへ移植し、同じmounted Textのfontでnative候補実測→読取単位/禁則/段落共通行数予算による選択→個別Text描画→既存native最終検査を接続した。本文へ改行を挿入せず、元段落・空白を保持する。候補はbackgroundで測り、全表の不足/重複/不正値、不明glyph、選択行の再改行、元8秒deadline超過は表示不可。規定font以外を選ばない。

最終inkがText自身のboxに収まる場合だけ行slotで揃える。すでにclipしたTextを位置移動で修復した扱いにはしない。確認用prototypeはv3に更新し、保存済み旧v1/v2・未知版は全文表示を残して画像を代替しない。対応版の実保存record存在は未確認。native_checked／候補測定は保存前fitや正式renderer admissionを意味せず、canSave/canExport=false。

local10suite449 PASS／FAIL0／SKIP0（renderer39、planner39・Python由来oracle25例を含む）。候補値とReact/native応答は合成を含み、端末合格ではない。clipと期限raceの2回帰検査は因果RED後に修正済み。InputScreenとAndroid/iOS source CIの最終結果は以下に記録。source6＋test/fixture3＋既存workflow1＋資料3。次は実端末のnative B9描画同等性/glyph/ink/性能とrenderer admission→保存前fit→保存。B9選択器を重複実装しない。画像保存共有・Nexus・設定変更・M5・005・実Authは残る。新依存/API/SQL・DB操作・env/deploy/activation/app build/main merge変更0、001〜004適用済み／005稼働未適用、weekly§5.5・12/18目標・automatic_progression=falseを維持する。


§38最終確認：source `c77f3aed07ce8514d7505bc169d00a4114804904` の13fileをremote全文／変更path集合／親head一致確認済み。[CI38026057042](https://github.com/MassyuRed/Cocolon/actions/runs/38026057042) はInputScreen込み11suite **478 PASS／FAIL0／SKIP0**、Android単体source compile・iOS syntax-only/既存patch/pbxprojも成功。既存contract guardsもsuccess。native実行・app build・実機受入れは含まない。従来のAndroid annotation警告18件と描画上の限界・残件はcurrent map §42に記録した。

## 39. 2026-10-10 — 発行済みプレビューの画像設定だけを更新

詳細ownerはcurrent map §43。既存の発行前 `prepare_visual_change` を再利用し、`PATCH /emotion/piece/preview/{preview_id}` とservice・store・service_role専用SQL候補へ接続した。受理するのは `expected_preview_revision` と3項目の `visual_selection` だけ。本文・content payload/各hash・形式・安全判定・renderer・元入力・期限・元POSTのrequest hashを保ち、recipe/hashとrevision/row_version/updated_atだけを更新する。保存回数を消費せず、期限を延長しない。

現所有者・現tier・元入力/観測と消費済みQ3 contextを再検査し、既存のauthorを呼ばない安全性判定を通す。SQLは既存M4のlock順序を継承し、待機後もpreview/履歴期限を検査する。応答消失時は自動で再PATCHせず、元POSTの同key/同requestで最新revisionを読み直す。旧revisionはSTALE。形式変更・RN selector・稼働route登録は今回含まず、既存preview factory/shared/default appは変えていない。

API source `4fcb140b778850a1b7a5a65d8e0a26005b3a24c4`、7fileのremote全文・変更path集合・親head一致を確認済み。local新規74 PASS、既存非DB回帰216 PASS／4 deselected。最初の回帰実行では既存DB専用4件がlocal runtime未用意でsetup errorとなり、製品PASSへ含めていない。隔離CI [38027073893](https://github.com/MassyuRed/mashos-api/actions/runs/38027073893) は **1,658 PASS／FAIL0／SKIP0**（新規service/HTTP74＋native47、既存1,537）。詳細はcurrent map §43.4。001〜004再実行・live DB query/apply・env/deploy/activation/main merge・native build 0。005と `supabase/migrations/20261010050940_piece_v2_preview_visual_change.sql` は稼働未適用。週次10/10 §5.5、12/18目標、automatic_progression=falseを維持。

次は既存PATCHへのRN設定操作・中断/再取得の接続と、既存native B9の実端末描画同等性・glyph/ink/性能、renderer admission、保存前fit→保存。形式変更、capture/共有、Nexus、M5/稼働構成、実Authも残る。§38の478 PASS/Android source compile/iOS syntax-onlyは先行証拠として保持し、今回の実機結果へ数え直さない。


## 40. 2026-10-10 — 発行済み画像設定をプレビュー画面から変更

詳細ownerはcurrent map §44。既存PATCHへテーマ・比率・Cocolon表記の操作を接続した。取得済みcapabilities内だけ選択し、変更しない項目は現在recipeの具体値で保持。本文・形式・期限・rendererを変えず、更新版と3hashを確認後に新canvasを測定する。旧表示の操作と遅延応答を採用しない。

不明ACK/競合は自動PATCHせず「最新のプレビューを取得」から元POSTの同request/keyで回収。close→同候補再表示やsource A→B→Aでも旧ボタンを拒否する。local InputScreen込み11suite **520 PASS／FAIL0／SKIP0**。Auth/HTTP/React/nativeは代替を含み、実機合格ではない。途中失敗・review補修の内訳はmap §44.2。

次は既存preview/shared候補factoryへのPATCH登録準備と隔離往復、その後の稼働採用・実機確認。native描画同等性/renderer admission→保存前fit→保存、形式変更・画像保存共有・Nexus・M5/実Authが残る。001〜004はmigration履歴読取で適用済みを確認、005とvisual変更SQLは未登録。今回API/SQL/native source・新依存・稼働DB書込/env/deploy/activation/build/main mergeは0。weekly§5.5・12/18目標・automatic_progression=falseを維持する。


§40最終確認：source `ef4806198352c3dde1a084d2eeb343fdb5f40c56` の対象10fileをremote全文・変更path集合・親head一致確認済み。[CI38028229338](https://github.com/MassyuRed/Cocolon/actions/runs/38028229338)はInputScreen込み11suite **520 PASS／FAIL0／SKIP0**、Android単体source compile・iOS syntax-only/既存patch/pbxprojも成功。既存contract guardsもsuccess。localとの合算なし。Android既存annotation警告18件と検査限界はmap §44.4へ記録。画面接続sourceの反映であり、稼働有効化・実機受入れ・保存共有の完成ではない。


## 41. 2026-10-10 — 画像設定変更をpreview／shared候補構成へ登録

詳細ownerはcurrent map §45。既存PATCH handlerを専用preview factoryへ直接登録し、そのfactoryを使うshared候補にも接続した。candidate専用contract registryを追加し、default app・旧Q&A・既定registryは保持。専用構成は従来4route＋PATCHの5routeで、保存等のfull routerは登録していない。RNは§40の接続をそのまま使用する。

API `f1762879d7983adc6b4f9b5728791d6404dbbe88` の6fileはremote全文・変更path集合・親head一致確認済み。local関連5file **243 PASS／FAIL0／SKIP0**。両構成での生成→画像変更→同request/key再取得とcommit前後停止・ACK消失を既存の隔離PostgreSQL CIで確認した。synthetic Auth/source/HTTP transportを含み、実機・稼働受入れではない。

次はnative B9実機描画同等性／renderer admission→保存前fit→保存。形式変更・画像保存共有・Nexus・保存等のAPI接続・M5/実Auth・稼働採用も残る。今回API製品2＋test4、RN/native/SQL・依存の変更0、Supabase操作・env/deploy/activation/build/main merge0。001〜004適用済みと追加2本未適用は先行確認を継承。weekly§5.5・12/18目標・automatic_progression=falseを維持する。


§41最終確認：fixtureの既存Q3 schema不足による初回native12 FAILを補修し、head `d5731750b9cf4018de9af454e93184f011e32f17` の[隔離CI38029243416](https://github.com/MassyuRed/mashos-api/actions/runs/38029243416)は **1,675 PASS／FAIL0／SKIP0**（先行1,658＋追加17）。両factoryの実SQL更新・元POST回収が成立。最終全6fileのremote全文、変更集合・親headを照合。製品sourceはf176287から不変。初回失敗と検査限界はmap §45.2/45.4。実機確認・保存共有・稼働配置の完了ではない。


## 42. 2026-10-10 — 候補の明示取消と同じ候補への再試行

詳細ownerはcurrent map §46。RN `ae389bf40dba9d8a0e3d5457895922d2b8fd3442` で「候補を取り消す」を既存DELETEへ接続。API `7a4d16a8ad6c23b130f883797d3846f3049c8e23` で専用preview/shared候補へ登録した。通常の閉じるは通信なし。取消結果不明は本文を保持せず同ID/revisionのDELETEを明示再試行し、成功後は同じPOST/keyの再生成をしない。runtime OFFでは非表示、同じ本人・入力・keyの背景復帰時だけ取消対象を再開できる。本人/入力/key変更・画面離脱・unmountで破棄する。

RN local **545 PASS／FAIL0／SKIP0**、API local84 PASS、API [CI38030365374](https://github.com/MassyuRed/mashos-api/actions/runs/38030365374) **1,682 PASS／FAIL0／SKIP0**。両factoryで実SQLの取消・古い版拒否・ACK消失後の期限後再試行・保存回数消費0を確認。実機/live Auth検査ではない。全16source/test pathのremote全文・変更集合・親headを確認。review補修・途中検査の内訳はmap §46.2。

次は実機描画/renderer admission→保存前fit→保存。形式変更・capture共有・Nexus・保存API構成・M5/実Auth・稼働採用も残る。今回native/SQL/依存・Supabase操作・env/deploy/activation/build/main merge0。入口/map/manifestの3資料を同期し、weekly§5.5・12/18目標・automatic_progression=falseを維持する。


§42最終確認：RN [CI38030732508](https://github.com/MassyuRed/Cocolon/actions/runs/38030732508)は **545 PASS／FAIL0／SKIP0**、既存Android/iOS source検査とcontract guardsもsuccess。API CI1,682 PASSとともに記録し、localとCIの重複加算はしない。実端末・保存前fit・保存共有の完成ではない。詳細はmap §46.4。

## 43. 2026-10-10 — 保存済みPieceの一覧・詳細を既存候補APIへ接続

詳細ownerはcurrent map §47。API `d7e1cabf6f3f622f7e0f042d137eb1c29237dd42` で既存owner history/detail GETを専用preview/shared候補へ登録した。読取requested/readyをpreviewから独立させ、両方Trueのときだけ保存時の本文・画像設定・rendererを返す。現tier・元入力・本文再生成を読取条件に加えない。sharedの既存quotaは静的routeを優先し、UUID/public ID双方を保持した。既定OFFで、default appは変更しない。

local関連5file **223 PASS／FAIL0／4 deselected**。最終headの[隔離CI38034228175](https://github.com/MassyuRed/mashos-api/actions/runs/38034228175)は **1,717 PASS／FAIL0／SKIP0**。localとの合算なし。 全7fileのremote全文・変更path集合・親headを照合済み。合成artifactを実SQLへ保存して読む検査であり、実Auth/PostgREST・端末・商品受入れではない。途中補修と検査限界はmap §47.2。

次は実機描画/renderer admission→保存前fit→保存。形式変更・capture共有・Nexus・保存/公開切替/削除の候補API接続・quota v2採用・M5/実Auth・稼働採用も残る。今回RN/native/SQL/依存・稼働DB書込/env/deploy/activation/build/main merge0。Supabase migration履歴の読取で001〜004適用済み、追加2本未適用を再確認。入口/map/manifestを同期し、weekly§5.5・12/18目標・automatic_progression=falseを維持する。


## 44. 2026-10-10 — 保存済みPieceの本人削除を既存候補APIへ接続

詳細ownerはcurrent map §48。API `fd15babe24e8dbcb28e0b20f5cf7960385106130` で既存 `owner_delete` を専用preview/shared候補へ直接登録した。削除requested/readyの両方が厳密Trueで、既存owner_readも有効な場合だけ操作できる。生成・保存・public・exportをOFFのまま、PCE7の本人閲覧/削除だけの回復状態を構成できる。既定構成・稼働環境は変更しない。

local関連4file **370 PASS／FAIL0／SKIP0**。最初の収集はsource import path不足で1 ERRORとなり、既存sourceの探索pathを明示して検証した。製品の判定緩和はない。初回CIは既存B10の経路一覧にDELETEを追加し忘れたため6 FAIL。期待する経路を1件追加した最終head `5773dbf3794090b4cee64ef5843f52b78e88cfad` の[隔離CI38044205689](https://github.com/MassyuRed/mashos-api/actions/runs/38044205689)は **1,759 PASS／FAIL0／SKIP0**。localとの合算なし。合成artifact/Auth/HTTPを含み、稼働データや実機の受入れではない。製品2＋test4の最終remote全文・変更path集合・親headを照合済み。詳細はmap §48.2。

次はnative B9実機描画/renderer admission→保存前fit→保存。形式変更・画像保存共有・Nexus・保存/公開切替の候補API接続・quota v2採用・M5/実Auth・稼働採用は残る。今回の本人削除登録、既存owner GET・候補取消・visual PATCHを再実装しない。Supabaseはproject/migration履歴読取のみ、001〜004適用済み・追加2本未適用。RN/native/SQL/依存・live DB書込・deploy/activation/build/main mergeの変更0。weekly§5.5・12/18目標・automatic_progression=falseを維持する。


## 45. 2026-10-10 — 候補APIの回数取得を保存回数へそろえる

詳細ownerはcurrent map §49。API `6384f8b165337a47adf052e3ccc4f2fe3a2a28c3` で既存 `read_quota` を専用preview/shared候補へ登録した。`GET /emotion/piece/quota` はプレビュー内quotaと同じ保存回数を返し、既存preview flagで制御する。`can_save`は回数上の表示であり保存許可ではない。shared候補だけ旧quota登録と旧DTO前提の `/emotion/reflection/quota` を除き、candidate contractをv2へ選択。default構成・旧DTO・旧aliasは保持する。

local関連3file **211 PASS／FAIL0／SKIP0**。既存構成の旧応答、候補の厳密な本人認証/OFF/不正要求、停止後の回数応答抑止、handler同一性を確認。[隔離CI38045414597](https://github.com/MassyuRed/mashos-api/actions/runs/38045414597)は **1,774 PASS／FAIL0／SKIP0**。両候補からのSQL読取→preview内表示一致・回数不消費・新しい使用回数の取得・005不在時503を確認した。localとの合算なし。合成Auth/source/HTTPを含み、実Auth・端末・稼働受入れではない。全9fileのremote全文・変更path集合・親headを照合済み。詳細はmap §49.2。

次はnative B9実機描画/renderer admission→保存前fit→保存。形式変更・capture共有・Nexus v2公開読取と公開切替・保存API構成・M5/実Auth・稼働採用が残る。公開切替はowner_read/public_readへ依存し、public指定にはpublic_writeも必要。未接続の公開読取をready扱いしたり、private対象だけの例外を作ったりしない。今回quota候補登録・本人GET/DELETE・preview取消/visual PATCHを再実装しない。005 quotaとvisual変更SQLの稼働未適用は先行確認を継承し、今回Supabase操作なし。RN/native/SQL/依存/workflow・env/deploy/activation/build/main merge変更0。weekly§5.5・12/18目標・automatic_progression=falseを維持する。


## 46. 2026-10-11 — 同じプレビューの非公開保存を候補APIへ接続

詳細ownerはcurrent map §50。API `6b901a1df0037c047513e794624917a09b0f3ac4` で既存 `save_preview` を専用preview/shared候補の `POST /emotion/piece/save` へ直接登録した。`save_requested` / `save_ready` の両方が厳密Trueで、previewも有効な場合に限る。既存source再照合・原子保存/回数消費・同key再取得を再利用し、public保存を有効化しない。default app・RNのcanSave/canExport=false・native admission境界を保持する。

local関連5file **261 PASS／FAIL0／SKIP0**。両候補の独立した保存準備、preview依存、認証優先、bootstrap、default registryを検査。既存の[隔離CI38089343394](https://github.com/MassyuRed/mashos-api/actions/runs/38089343394)は **1,789 PASS／FAIL0／SKIP0**。新native12件を含み、同じ本文・画像設定の保存/本人再取得、commit後停止・ACK消失からの同key復旧と回数1回を確認した。localとの合算なし。全6fileのremote全文・変更path集合・親headを照合済み。合成Auth/source/HTTP境界であり、実端末の保存・画像共有の受入れとは区別する。途中の検査補修と結果はmap §50.2へ記録する。

次はnative B9実端末の描画同等性・glyph/ink/性能とrenderer admission→保存前fit→RN保存操作。形式変更・capture/画像保存共有・Nexus v2公開読取/公開切替・M5/実Auth・稼働採用も残る。今回のprivate save候補接続と、既存quota・owner GET/DELETE・preview取消/visual PATCHを再実装しない。Supabaseはproject/migration履歴の読取のみで001〜004適用済み・005 quotaとvisual変更SQL未適用を確認。DB書込・env/deploy/activation・native app build・main merge0。weekly§5.5・12/18目標・automatic_progression=falseを維持する。


## 47. 2026-10-11 — RNに同じプレビューの保存通信を追加

詳細ownerはcurrent map §51。B10既存 `features/piece/pieceApi.js` に `requestPieceSave` を追加した。preview ID・revision・3hashと公開範囲（省略/nullはprivate）だけを閉じた要求として送り、本文/recipe・client fit・権限情報は送らない。要求・owner・keyを最初のawait前に固定し、本人切替やabort後の結果を採用しない。応答不明でも自動再送や別key発行は行わず、呼出元の明示再試行で同じkey/requestを使う。

保存後に公開範囲が変わった場合、正規replayは現在のvisibilityとrow versionを返す既存SQL契約に合わせた。初回は要求visibility一致を検査し、replayはprivate/publicのenumを検査して現在状態を保持する。保存回数上限は固定の日本語文言にし、previewの拒否条件へ流用しない。

source `ca4ce05cf1f62ed5fad3a0a72733e2956d8ae0a7` の製品1＋test1をDraft PR #30へ反映し、remote全文/変更path集合/親head一致を確認済み。localはInputScreen込み既存11suite **557 PASS／FAIL0／SKIP0**（先行545＋追加12）。同環境read-only reviewでreplay visibilityの不一致を検出し、回帰検査追加と修正後にblocking指摘なし。Auth/HTTP/React/nativeは合成を含み、今回SQL・実Auth・実機を実行した結果ではない。CI最終値は以下に記録。

次はnative B9実機描画同等性/glyph/ink/性能・renderer admission→保存前fit→既存controller/modalの保存操作。通信処理は今回のownerを使用し再実装しない。canSave/canExport=falseを保持し、形式変更・画像保存共有・Nexus v2公開読取/切替・M5/実Auth/稼働構成も残る。API/native/SQL/依存/workflowの変更0、Supabase操作・env/deploy/activation/app build/main merge0。001〜004適用済みと追加2本未適用は先行確認を継承。weekly10/10 §5.5・12/18目標・automatic_progression=falseを維持する。


§47最終確認：[CI38090399330](https://github.com/MassyuRed/Cocolon/actions/runs/38090399330)はInputScreen込み11suite **557 PASS／FAIL0／SKIP0**、Android単体source compile・iOS syntax-only/既存patch/pbxprojも成功。Node24.21.0／TypeScript5.2.2。既存contract guards等も全success。localとCIの合算なし。Android既存annotation不足警告18件と検査境界はmap§51.2へ記録した。保存操作・native fit・実機の完成ではない。


## 48. 2026-10-11 — 画像保存・共有の依存導入案（B13-A・未導入）

詳細ownerはcurrent map §52。既読の全体設計・全ファイル地図・前回txtと最新weekly10/10 §5.4–5.5を引き継ぎ、既存source・PCE5/PCE6・PCE8 B13-A/Cを照合した。MashのPiece続行指示に基づき、画像保存共有に必要な直接4依存の候補を一次sourceの固定SHAで確認した。`react-native-view-shot@5.1.1`、`react-native-share@12.3.1`、`@react-native-camera-roll/camera-roll@7.10.2`、`react-native-file-access@3.2.0`。最新版への無条件追従はせず、RN0.77.3・旧architectureを維持する案とする。

規定filename・内部cacheへのコピー・同じPNGのhash・限定した共有provider・写真への追加権限と、Node更新およびRNFAのAndroid互換patchが必要。共有先選択を読取完了と誤認した即時削除、異常終了時のraw capture残存は実装で解消すべき未確認点として明記した。動作適合済み・cleanup完了とは扱わない。

今回は入口/map/manifestの3資料のみ更新。製品source・依存追加・lock/native設定変更・新規検査・ビルド・Supabase操作・env/deploy/activation/main mergeは0。先行RN557件/API1,789件は今回再実行していない。B13-A/Cとweekly§5.4に従い、4依存＋記載したnative設定/互換修正の個別承認を求め、その後に既存B13-Cの画像保存共有実装へ進む。承認に稼働有効化・TestFlight配布は含めない。native B9実機描画/renderer admission→保存前fit→保存操作の本線を保持し、画像exportの全完成を実機確認の新しい前提にしない。BLOCKER_NARROWED／automatic_progression=false。


## 49. 2026-10-11 — 画像capture・写真保存・共有のnative prototype

詳細ownerはcurrent map §53。前回の具体導入案を記した添付txtを参照する今回の続行指示に沿い、固定4依存とnative設定／必要互換patchを導入した。保存済み本人detailの3hashとprototype v3を確認し、既存PieceVisualCardの固定1080幅の内側canvasからPNGを作り、寸法・SHA-256を確認して同じcopyを写真／共有へ渡すprototypeを追加した。製品画面へは未接続で、正式renderer fit/admissionを付与しない。

iOS追加のみ保存で発生する保存後のPHAsset読取をPiece限定patchで除き、raw PNGは両OSとも専用cacheへ限定。共有先の読取終了をcallbackから推測しないため、共有copyの回収は未接続のまま残す。既存依存の版更新なし。クリーンnpm ciと3新patchの再適用成功。JS12suite **570 PASS／FAIL0／SKIP0**。native/OS/HTTPは代替を含み、端末写真保存成功を検証した結果ではない。独立読取reviewで文字計測停止・iOS追加のみ保存・非同期共有直前検査を補修した。

GitHub CI38093232063も570 PASS、既存Android/iOS source検査、macOSのnpm ci／4依存autolink／CocoaPods1.17.0解決が成功。実生成Podfile.lock（ZIPFoundation0.9.20を含む）と検証結果をmap §53.5へ記録した。実native compile・実機描画／PNG／権限／共有・共有copy寿命・receipt・UI接続は残件。本線はnative B9実機描画受入れ→renderer admission→保存前fit→保存操作。形式変更・Nexus・M5/実Auth/稼働構成も残す。Supabaseはproject/migration履歴の読取のみ。DB変更・flag有効化・API配置・TestFlight配布・main mergeなし。weekly§5.5の実機順序と12/18目標を維持する。


## 50. 2026-10-11 — 4依存のnative compileと再起動時のcapture準備

詳細ownerはcurrent map §54。Android FileAccessが既存directoryへのmkdirを拒否するため、再起動後も既存raw directoryを検査して限定清掃・captureへ進むよう修正した。同pathがfileなら操作を拒否し、共有cache全体を削除しない。

source198e8ba／CI補修e4f4984をDraft PR #30へ反映し、remote全文・変更path集合・親headを照合済み。[CI38094296963](https://github.com/MassyuRed/Cocolon/actions/runs/38094296963)は**全5job success**。JS12suiteはlocal／CIそれぞれ **572 PASS／FAIL0／SKIP0**。view-shot／share／camera-roll／file-accessはiOS arm64 simulatorの4Pod実buildとAndroid Java/Kotlinの5compile taskが成功した。Podfile.lock差分0も確認。初回AndroidのCI前提check失敗と既存依存のwarningはmap §54.2に記録した。

次は端末B9描画／PNG／写真保存／共有と正式renderer admission→保存前fit→UI接続。共有copy回収・B13-B receipt等も残る。canSave/canExport=falseを維持し、今回のlibrary compileをapp build・実機受入れへ換算しない。DB書込・本番切替・署名／配布・main merge0。画像共有全完成を初回実機確認の追加前提にしない。


## 51. 2026-10-11 — iOS共有終了後の一時画像回収と取消結果

詳細ownerはcurrent map §55。固定RNShareのiOS終了通知を受けた後だけ、その操作専用directoryを回収するよう既存export処理へ接続した。共有中のdispose／本人変更では削除せず、正規の終了結果を待つ。取消は本文・共有先名を含まない `cancelled` として返す。終了後の削除失敗は `cleanup_failed:true` で分け、取消・共有結果を上書きしない。Androidの共有先選択通知、未知・矛盾した結果、rejectではcopyを保持し、再起動や任意TTLによる削除を加えない。

修正前19検査中15 PASS／4 FAILで未接続を確認し、修正後はexport19 PASS。InputScreen込み12suiteはlocal **577 PASS／FAIL0／SKIP0**（先行572＋5件）。[CI38095920492](https://github.com/MassyuRed/Cocolon/actions/runs/38095920492)でも **577 PASS／FAIL0／SKIP0**、既存Android bridge／iOS source検査success。依存差分がないため4依存の再compileはscopeどおりskip。OS通知・filesystemは代替であり、実機の共有受入れではない。前回の両OS library compileは§50の実結果を継承し、今回はnative／依存／workflowを変更しない。

保存・画像化の製品caller、正式renderer admission→保存前fit→UI接続、実端末B9／PNG／写真保存共有が残る。画像共有全完成を初回実機確認の追加前提にしない。canSave/canExport=false、DB書込・本番切替・署名／配布・main merge0。

§51反映確認：source `1c6fbd3d4787e5fbd5a06d9eed92344f6e452800` の製品1＋test1＋資料3をDraft PR #30へ反映し、remote全文・変更path集合・親head一致を確認した。localとCIは合算しない。

## 52. 2026-10-11 — 既存controllerの保存状態管理（画面未接続）

詳細ownerはcurrent map §56。既存 `PieceCreateController` に、同じpreviewの非公開保存・保存中・結果不明から同key/requestでの明示再確認・保存receiptの保持を追加した。既存 `requestPieceSave` を使用する。表示tokenとID/revision/3hash、期限を確認し、将来のhostから厳密なsave許可と正式admissionが供給されない限り送信しない。正式admissionの判定実装を新設したものではなく、製品callerも未接続である。

close後は本文を破棄して保存要求／receiptだけを保持し、結果不明から新しいpreview POSTや別keyへ戻さない。本人・入力変更／全体無効化／dispose後の遅延結果を捨てる。save許可のみの取消は要求を保持して再送を止める。同環境read-only reviewで見つかったabort通知内の同期retryを、許可取消を先に確定する順序と回帰検査で修正した。

local既存12suite **592 PASS／FAIL0／SKIP0**（先行577＋追加15）。合成HTTP/Auth/React/nativeを含み、実保存・実機・正式fitの受入れではない。表示model／modal／runtimeへの保存接続、保存後owner detail取得は未実装。次はB9実機描画とrenderer admission→保存前fit→既存controllerを使う画面接続。画像共有の全完成を初回実機確認の前提にしない。

Supabaseはprojectとmigration履歴の読取のみ。001〜004適用済み・005 quotaとvisual変更SQL未適用を確認。DB書込・API／native／依存／workflow変更・env/deploy/activation/app build/main merge0。最新weekly10/10 §5.5・12/18目標・automatic_progression=falseを維持する。GitHub／CI結果はcurrent map §56に記録する。



§52最終確認：source `9aca322808cbf877e883feab8f235ec1ab7a61a5` の5fileをDraft PR #30へ反映し、remote全文・変更path集合・親headを照合した。[CI38099147844](https://github.com/MassyuRed/Cocolon/actions/runs/38099147844)は全5job success、JSは **592 PASS／FAIL0／SKIP0**。既存Android bridge source／iOS syntax・patch検査も成功。依存差分がないため両OS export library compile stepはscopeどおりskipで、今回の実native再buildとはしない。修正後のread-only reviewに追加重大指摘なし。正式admission・表示／画面接続・実機は引き続き未完了。

## 53. 2026-10-11 — 保存結果の表示と復帰後の確認導線

詳細ownerはcurrent map §57。前回controllerの保存状態を既存display→modal→InputPieceActionAreaへ接続した。保存中は「Pieceを保存しています。」、結果不明は「同じ保存要求で結果を確認」、保存済みは「Pieceを保存しました。」と表示する。保存後に保存不可の説明を重ねない。本文／receiptの内部値を画面stateへ複製しない。

同じ本人・保存入力ID・元keyに限り、背景化／runtime刷新をまたいで本文を含まない保存要求を保持する。復帰だけでは通信せず、結果確認操作だけで同key/requestを再送する。入力・本人・key切替とunmountでは破棄する。保存flagのみの変更は受信済みpreviewとsource readyを保持し、新runtimeの刷新とは区別する。

正式admissionを供給する製品callerと初回保存ボタンは未接続。canSave/canExport=falseを保持し、今回の表示／復帰検査では合成admissionを注入した。実端末保存や描画受入れの成功ではない。次はB9実機描画・正式renderer admission→保存前fit→初回保存操作と保存後本人detail取得。画像共有の全完成を初回実機確認の前提にしない。検査とGitHub結果はmap §57へ記録する。

§53最終確認：source `703c60b05ffa5851ade5eb366c24c74a4c90a19a` の製品4＋test2＋資料3をDraft PR #30へ反映し、全9fileのremote全文・変更path集合・親headを照合した。[CI38100005424](https://github.com/MassyuRed/Cocolon/actions/runs/38100005424)は全5job success、JSはlocal／CIそれぞれ **611 PASS／FAIL0／SKIP0**。既存Android／iOS bridge source検査も成功。依存差分がないためexport library compile stepは両OSともskip。同環境read-only reviewの3指摘を修正し、限定再確認に追加指摘なし。初回保存操作・正式admission・実機の完成とは区別する。


## 54. 2026-10-11 — 保存後の本人詳細を再取得して表示

詳細ownerはcurrent map §58。InputScreenの既存navigationをhostへ渡し、保存完了時の「保存したPieceを確認」からPieceタブの既存PieceOwnerHistoryへ接続した。画面間では保存receiptのPiece IDと期待する本人IDだけを渡す。保存前本文／recipeやsourceを持ち越さず、既存owner detail GETの本人照合・ID照合・3hash検証を通った保存済みrecordを表示する。

保存元は同じreceiptと本人／入力binding、foreground、厳密owner-read flagを再確認する。取得先も本人・対象・focus／foreground・read flagを確認し、切替後の遅延応答を表示しない。取得失敗は同じGETを明示再試行し、preview生成／保存要求へ戻らない。通常の履歴入口は保存直後の対象を消す。

local既存12suite **634 PASS／FAIL0／SKIP0**（先行611＋追加23）。InputScreenのnavigation受渡し、実savedInputモードから合成save後の遷移、保存元から実owner hostのfresh detail表示、遅延応答と本人／対象切替、削除中の古い読取操作から同key削除回収を検査した。React/navigation/native/HTTP/Auth/admissionは代替を含む。正式admission供給と初回保存buttonがないため、稼働アプリで保存可能になったとは扱わない。GitHub結果は本節とmap §58へ追記する。

次はB9実機描画・正式renderer admission→保存前fit→初回保存操作。保存後本人detail接続を再実装しない。画像保存共有の全完成を初回実機確認の前提にしない。API/native/SQL/依存/workflow変更・Supabase操作・DB書込・env/deploy/activation/app build/署名/配布/main merge0。weekly10/10 §5.5・2026年12月18日目標・automatic_progression=falseを維持する。

§54最終確認：source `7bd593040bc6ab317def5f0f209ca8cbb720d7af` の製品6＋test3＋資料3をDraft PR #30へ反映し、全12fileのremote全文・変更path集合・親headを照合した。[CI38101826766](https://github.com/MassyuRed/Cocolon/actions/runs/38101826766)は全5job success、JSはlocal／CIそれぞれ **634 PASS／FAIL0／SKIP0**。既存Android／iOS bridge source検査も成功。依存差分がなくexport library compile stepは両OSともskip。初回保存操作・正式admission・実機確認の完成とは区別する。

## 55. 2026-10-11 — 写真保存の確定結果を保持

既存`features/piece/pieceExport.js`の写真保存処理を補修。OSが保存成功を確定した後は、一時copyの削除失敗を`cleanup_failed: true`として分離し、本人／runtime失効でも実際の保存済み結果を失敗へ変えない。画面へ表示するかは将来hostの本人・lifecycle照合が担当する。保存前の本人・bytes・権限・dispose確認、iOSの厳密な成功応答、一回限りの操作は保持する。

既存export検査へ9件追加し、修正前24 PASS／4 FAIL、修正後28 PASS。local既存12suite **643 PASS／FAIL0／SKIP0**。同環境read-only reviewの重大指摘なし。OS/native/filesystemは代替で、端末保存や正式描画受入れの結果ではない。製品1＋test1＋既存資料3。実DBはproject/migration履歴を読取のみ。稼働切替・配布は未実施。詳細とGitHub／CI結果はcurrent map §59へ記録する。

保存の本線は **B9実端末描画確認→正式renderer admission→保存前fit→初回保存操作**。prototype v3/native_checkedを正式判定へ昇格させない。保存結果表示・同key回収・本人detailは再実装しない。画像共有の全完成を初回実機確認へ追加せず、weekly10/10 §5.5と12/18公開目標を継承する。

§55最終確認：source `1df91cc74b92e59d9ac6bba126a2c8fbfa696e84` の製品1＋test1＋資料3をDraft PR #30へ反映し、全5fileのremote全文・変更path集合・親headを照合した。[CI38102760544](https://github.com/MassyuRed/Cocolon/actions/runs/38102760544)は全5job success、JSはlocal／CIそれぞれ **643 PASS／FAIL0／SKIP0**。Android／iOS bridge source検査も成功。export library compile stepは依存差分がなく両OSともskip。正式描画判定・初回保存・実機受入れは未完了。

## 56. 2026-10-11 — 通常入力から旧Piece通信を除去

通常InputScreenの旧「ピースを生成する」は、未保存のraw本文をV2と同じpreview URLへ送り、旧publish/cancelも保持していた。PCE6／PCE8 B12-Cの既承認非稼働切替準備として、この3通信とimportを除去。通常入力は「この内容でOK」で保存し、Emlis表示が閉じた後に既存saved-input V2 hostを使う。V2 flag OFFでも旧操作へ戻さない。

既存チュートリアルの固定sample／step7／説明後の遷移は保持し、旧button/modalをtutorialだけに限定した。古いtutorial callbackと途中処理は、既存owner/tutorial/reset lifetimeで失効させる。通常入力・Emlisの所有範囲は変更しない。

追加11検査。入力画面42件は修正前34 PASS／8 FAIL、修正後42 PASS。Piece既存12suite **654 PASS／FAIL0／SKIP0**、既存screen/IAP/themeは別集合 **77 PASS／FAIL0／SKIP0**。React/native/Auth/HTTPは代替であり実機結果ではない。製品2＋test2＋資料3。GitHub／CIと再開点はcurrent map §60。

通常入力の通信衝突を除く部分準備で、tutorial・Nexus・旧API等を含む全面M5は未完了。次は既存候補APIの稼働構成／対象アプリ版と実機経路をそろえ、B9描画確認→正式renderer admission→保存前fit→初回保存へ進む。稼働変更・配布は別の範囲。画像共有の全完成を初回実機確認へ追加しない。

§56最終確認：source `e9045aaa7be8b74b37e484c64661e19ba1ea2bcf` の製品2＋test2＋資料3をDraft PR #30へ反映し、全7fileのremote全文・変更path集合・親headを照合した。[CI38103585515](https://github.com/MassyuRed/Cocolon/actions/runs/38103585515)は全5job success、Piece JSはlocal／CIそれぞれ **654 PASS／FAIL0／SKIP0**。既存screen/IAP/theme77件はlocalの別検査でありCI件数へ含めない。実機・正式保存判定・稼働切替は未完了。


## 57. 2026-10-11 — 通常Piece画面から自分の保存履歴を開く

通常のPiece入口はPieceEntryScreen→Nexusで、既存の本人履歴menuへ進む導線がなかった。Nexusの見出し直下に「自分のPieceを開く」を置き、既存PieceOwnerHistoryへ `savedPiece: null` で接続した。以前の保存直後detail対象を解除し、到着先の「保存済みPieceを読み込む」で既存本人専用GETを使う。公開feedの「自分」filterや表示上「共鳴」のtabへ本人保存dataを混ぜない。

認証初期化完了・本人あり・非tutorial・既存owner-read flag厳密trueの場合だけ表示。本人／利用可否が変わると古い操作を失効させ、元の値へ戻っても復活させない。blur／unmount後も移動しない。公開feed・共鳴のloading/errorと入口を分離する。

追加13検査。既存owner-history集合61件は修正前54 PASS／7 FAIL、修正後61 PASS。Piece既存12suiteは **667 PASS／FAIL0／SKIP0**。既存screen/IAP/themeは別集合 **77 PASS／FAIL0／SKIP0**。実Screen/Header→route→既存本人controller/APIを代替React/Auth/HTTPで確認し、実機受入れとはしない。製品2＋test1＋既存資料3。詳細・GitHub／CI・次の残件はcurrent map §61。

本線はB9実機描画→正式renderer admission→保存前fit→初回保存。画像共有の全完成を初回実機確認の前提にしない。今回の入口接続はAPI有効化・アプリ配布ではなく、全面M5の完了でもない。weekly10/10 §5.5と12/18目標を継承する。

§57反映確認：source `d866dc081bfc8f9cbae3bfb21bb2777b74b1ff63` の製品2＋test1をDraft PR #30へ反映し、remote全文・変更path集合・親head一致を確認した。[CI38104312149](https://github.com/MassyuRed/Cocolon/actions/runs/38104312149)は全5job success、JSはlocal／CIそれぞれ **667 PASS／FAIL0／SKIP0**。screen/IAP/theme77件はlocalの別検査。既存Android／iOS bridge source検査も成功。依存差分がないためexport library compileは両OSともskip。入口§57／map§61／manifest v56を同期する。実機・正式保存判定・稼働切替は未完了。


## 58. 2026-10-13 — 旧write除去と初回保存Modal準備の同期

### 反映済みの範囲

API `804beca66f9f02e18dc4522232478466f4d52b13` は `ai/services/ai_inference/app.py` と `api_contract_registry.py` を変更した。`piece_preview_configuration` が明示されたshared V2候補に限り、旧POST `/emotion/piece/publish`、`/emotion/piece/cancel`、`/emotion/reflection/publish`、`/emotion/reflection/cancel` を除去する。V2へのalias化やredirectはせず、既定のlegacy構成と対象外のNexus/Q&A経路は保持する。この差分とPR #3のheadを再取得して確認した。稼働切替・M5全面完了・今回のAPI検査再実行を意味しない。同じ4経路除去を再実装しない。

RN `d9ccbc1d62851f7792c2384497ee817171c45ee1` は既存 `components/piece/PiecePreviewModal.js` に `onSave` を追加した。received/hash-verified preview、厳密な `display.canSave === true`、表示token、callbackがそろった場合だけ初回保存操作を表示し、固定した候補ID・revision・recipe hashと同じtokenを渡す。Modal自身は保存許可・保存key・本文・HTTPを生成しない。保存結果、同一保存要求の再確認、取消、保存直後の本人詳細は保持する。前回の未反映patchを再適用しない。

### 既存検証の記録と限界

同commitの `tests/piece-v2-initial-save-modal.test.js` は通常のNode source-VM方式で42件を検査する。前回確認済みの同じ42件は変更前38 PASS／4 FAIL、変更後42 PASS／FAIL0／SKIP0。既存 `.github/workflows/piece-rn-contracts.yml` へこの検査を追加し、run `38345010905` のJS job `115124267331` はNode24.21.0／TypeScript5.2.2で709 PASS／FAIL0／SKIP0。709には42を含み、合算しない。これは実際のモジュールを用いた合成React/native/Auth/HTTP境界の検査であり、端末・稼働DB・商品受入れではない。この文書同期で新しい商品検査を実行したとはしない。

2026-10-13の追加取得では、同runのiOS source、Android source、Android export libraryの各jobもsuccess。Android export job `115124268056` の4 library compile stepは完了。iOS export Pods job `115124267502` は最終取得時点でin_progressのため、run全体成功・iOS export library compile完了を認定しない。以前の「export2 job未確認」は当時の記録として保持する。

### 次の再開位置

`features/piece/piecePreviewModel.js::readPiecePreviewDisplay` は現在も `canSave:false`。`screens/input/InputPieceActionArea.js` は初回 `onSave` と正式な `isSaveAdmitted` を供給していない。既存 `PieceCreateController.savePreview(identity, displayToken, idempotencyKey)` は再照合・単一要求・保存結果保持を実装済みだが、正式な供給元との接続が残る。`PieceVisualCard` の `native_checked` とローカルcapture targetは正式renderer admissionではない。quota、flag、hash、version文字列、合成テストを正式な描画合格へ置き換えない。

本線はB9の実機描画同等性・glyph/ink/性能、正式renderer admission、保存直前のfit、同じ候補/token/keyによる初回保存の親画面接続。既存保存controller・結果再確認・本人詳細・Nexus本人履歴入口・写真保存結果保持を再実装しない。画像保存共有、形式変更、Nexus公開読取/切替、tutorial/旧APIを含むM5残差、稼働接続は引き続き未完了。画像共有の全完成を初回実機確認の追加前提にしない。

最新weekly `Cocolon_Weekly_Review_20261010.md` §5.5、公開目標2026-12-18、default OFF、Draft/open/unmerged、automatic_progression=falseを維持する。この同期は既に反映したsourceと現在地の文書同期であり、稼働DB・env・deploy・activation・native app build・署名・配布・main mergeへの効果は0。実機未確認だけでなく実装未接続が残るため、単にMashの確認待ちとはしない。


## 59. 2026-10-13 — 初回保存の親画面接続と既存保存処理の結合

### 反映した製品接続

RN commit `f026adb805ae6795845e22bef14edb6ee301becd`。既存 `screens/input/InputPieceActionArea.js` が、`PiecePreviewModal.onSave` から既存 `PieceCreateController.savePreview(identity, displayToken, idempotencyKey)` へつながる。別途供給される同期・副作用なしの `isSaveAdmitted(preview, displayToken)` が厳密にtrueを返す場合だけ、host側の表示へ初回保存を許可する。本文hash・候補ID/revision・recipe hash・表示token・期限・本人/source/key・画面状態・runtime/save flag・判定供給元を再照合する。共有display readerの `canSave:false` とnative prototypeの非正式状態は変更しない。

保存keyは明示した初回操作で既存random-values基盤から16byteを生成する。本文・本人ID・保存入力ID・preview keyを流用しない。乱数取得失敗は本文や例外詳細を含まない再試行案内とし、previewを保持する。二重押下は単一要求に限定し、結果不明時は既存controllerが保持する同じ要求・同じkeyで再確認する。判定・乱数処理中に画面や候補が変わっても古い保存を送らない。保存API、保存結果保持、取消、本人詳細、Nexus本人履歴、画像export処理は再実装しない。

構造差分：既存InputScreen → InputPieceActionArea → PiecePreviewModalという表示経路に、条件付きの明示保存 → 既存PieceCreateController → 既存private save transportという操作接続を追加した。新しいAPI、DB、画像renderer、権限、データ契約は追加しない。STRUCTURE_MAP_DELTA_UPDATED。

### 今回確認した検査と限界

新しい `tests/piece-v2-initial-save-host.test.js` は30件のhost単体検査と8件の既存実モジュール接続検査。既存 `tests/piece-v2-initial-save-modal.test.js` の42件は変更せず、末尾で新検査を読み込む。既存CIの対象コマンド・基準・workflowは変更していない。

同じhost単体30件を、元sourceのGit blob `16ce6b3d66bd6ddfb6bafd8b234c5ea85397f3b3` と照合した作業コピーで実行：変更前9 PASS／21 FAIL、変更後30 PASS／FAIL0／SKIP0（Node22.16.0）。GitHub Actions run `38353118223`、JS job `115149790070` は正確な `f026adb` head・Node24.21.0・TypeScript5.2.2で747 PASS／FAIL0／SKIP0。完了ログを取得し、新規38件と既存709件が含まれることを確認した。38件や単体30件を747へ重複加算しない。

8件の接続検査では実際のAPI/model/controller/host/Modalを使い、保存済みsourceの明示GET → 別操作でpreview → 初回保存ボタン → private save → 保存結果表示、および結果不明時のruntime停止・復帰後の同一要求/key再確認を通した。ただしReact/native/Auth/HTTP/runtime/乱数・正式判定は合成境界である。端末描画・稼働API/DB保存・正式なrenderer合格・商品受入れを意味しない。この資料同期は検査の再実行ではない。Native job全体の完了はこのJSログから推測せず、既存PR #30の追加確認記録に分離する。

### 次の再開位置

`InputPieceActionArea` の条件付き初回保存接続は再実装しない。現在の `InputScreen` は正式な `isSaveAdmitted` を供給していないため、通常アプリから初回保存できる完成状態ではない。`PieceVisualCard.native_checked`、quota、flag、hash、renderer version文字列、今回の合成trueを正式描画合格へ置き換えない。

次はB9の実機描画同等性・glyph/ink/性能、正式renderer admissionの供給元、保存直前のfitと同じ候補/tokenへの結合、通常画面での初回保存・本人詳細の確認。画像保存共有・形式変更・Nexus公開読取/切替・tutorial/旧APIを含むM5残差・稼働接続も未完了。画像共有の全完成を初回実機確認の追加前提にしない。単にMashの実機確認待ちとはしない。

最新weekly `Cocolon_Weekly_Review_20261010.md` §5.5、2026-12-18公開目標、default OFF、Draft/open/unmerged、automatic_progression=falseを維持する。今回の稼働DB・env・deploy・activation・native app build・署名・配布・main mergeへの効果は0。既存API `804beca` の候補構成限定の旧4write除去と通常legacy構成保持を継承し、API変更・検査再実行は行っていない。


## 60. 2026-10-13 — 未判定だったiOS描画44項目の実行確認

source `502c87527b3a28961ae3138754fe46d3cb731e08` は既存 `tests/native/piece-text-metrics-ios.mm` だけに進行出力・stdout非buffer化・main開始後90秒の実行上限を追加した。44件のfixture・判定式、製品native source、workflowは変更していない。[CI38362941699](https://github.com/MassyuRed/Cocolon/actions/runs/38362941699)の完了ログを取得し、iOS 26.2 simulatorで **44 PASS／FAIL0／SKIP0**、JSは別集合 **747 PASS／FAIL0／SKIP0** を確認した。製品コードの追加実装ではなく、前回未判定だったnative計測・描画範囲の技術確認である。

前回の停止は再現せず、原因は未特定。起動完了出力からmainの最初の出力まで約95.3秒のログ上の間隔があり、起動処理だけの時間とは断定しない。420文字の候補計測は1,703.604msだったが、Piece全体の時間ではない。実UIKit/TextKit/CoreTextを使う一方、RN bridge/view境界は代替であり、実RN描画・実機・正式renderer admissionには昇格しない。詳細と各jobの範囲はcurrent map §64。

次は既存 `PieceVisualCard` の実RN描画で、同じ本文・recipeから候補計測→B9行選択→全行の最終検査→固定canvas配置を確認する。段落・branding・長文を含む全体描画と全体処理時間を確認し、その結果に基づく正式renderer判定、保存直前fit、同じpreview/tokenへの結合へ進む。既存host/controllerを再実装せず、`native_checked`だけで保存を許可しない。通常InputScreenの正式判定供給は未接続。画像共有全完成を初回実機確認の追加条件にしない。weekly10/10 §5.5と12/18目標を継承する。


## 61. 2026-10-13 — 実React Nativeの全体描画検査へ接続（再検査時の配置保持を検証中）

source `2c7c554cf51cff38efc84a99df80565f736fe9d9` は、既存 `tempCocolonTests` で実RCTBridge／RCTRootView／Textと製品のPieceVisualCard・B9・PieceTextMetricsを実行する検査を追加した。段落、Unicode／中央揃え、宣言／brandingなし、420文字、保存済みcanvasの5ケースで、実Textの本文・最終ink配置・画像寸法・全体時間を確認し、PNGを取得する。本文・preview/saved packetは合成で、生成品質・実API保存・実機受入れの確認ではない。

検査用のdisposable checkoutだけで通常AppDelegateを空の起動へ置き換え、専用bundleを載せる。検査用Metroは `lib/apiClient.js` だけを呼出し時に拒否する代替にし、Auth/APIを使わない。製品のPiece、RN Text、native計測は差し替えない。製品のAppDelegate・project・Podfile・lockはrepository上では変更しない。署名・配布・稼働有効化はない。

初回[run38366036318](https://github.com/MassyuRed/Cocolon/actions/runs/38366036318)は既存JS747 PASSとnative44 PASS、両OSの既存library compile成功。実RN job `115191277280` は35分上限でcancelled。完了ログにcompile errorはなく、simulator起動後もnative buildが継続し、XCTest結果・5ケースJSON／PNGは得られなかった。既存検査の成功を全体描画へ読み替えない。

source `5c501d9eaed60257b202de418c936a1f7acb3bf6` でbuild-for-testing→simulator起動→同じ出力先のtest-without-buildingへ分け、通常iOS build実績のあるmacos-26に合わせた。CI全体上限は45分へ変更したが、描画8秒・5ケースのfixture／判定・製品sourceは変更していない。[run38370566662](https://github.com/MassyuRed/Cocolon/actions/runs/38370566662)はbuild前のPodfile.lock完全照合で停止した。差分は66個のSPEC CHECKSUMS値だけで、依存version・取得元・Podfile checksum・CocoaPods版の差分はなかった。環境差の原因は未特定。`5c685b4b658f5e08ed78039ea3ecd68761582e79` で実RN jobだけlock完全一致の実績があるmacos-15へ戻し、build先行・45分・lock完全照合を保持した。[run38371898401](https://github.com/MassyuRed/Cocolon/actions/runs/38371898401)はbuild・simulator起動・XCTest実行まで到達したが、検査用captureへnull tagが渡って結果通知が停止し、90秒timeout／reports 0件で失敗した。保存artifactのxcresultからJS起動とRN引数拒否を取得した。appとtest binaryのRN class重複も観測したが、nullの元原因とはまだ断定しない。

`1667ecd64a10345987b5fcb7be307f9ee315a0a1` のtest3fileで、無効tagは既存recordへ失敗結果を送り、captureをnonnullにした。CI projectのtest targetだけPod全体の重複リンクを除き、既存BUNDLE_LOADERでhostのRNを使う。製品source／Podfile／lock／fixture／8秒描画判定は不変。無効tagの実finishCaseはlocalで変更前pending→変更後report保持・次ケース進行を確認した。[run38375322124](https://github.com/MassyuRed/Cocolon/actions/runs/38375322124)は完了し、5ケースJSONと4枚のPNGを取得した。短文・Unicode・宣言・保存済みcanvasは本文保持／配置／8秒以内を通過したが、420文字はsize0で8,094.264msのmeasurement_timeoutとなり画像なし。4枚を目視確認し、今回stdoutのRN class重複警告は0件。全5ケース合格・実機受入れ・正式admissionではない。既存native44は「あ」420文字で本文条件も異なるため、同じ混在文のnative計測と実RN候補呼出の段階時間をtestだけに追加した（source `545c7cc3476bdcd84e88624d29137e51089169d6`）。[run38379288880](https://github.com/MassyuRed/Cocolon/actions/runs/38379288880)でも420文字は候補Promise未返却のまま8,095.284msでtimeout。native単体の再実行では同じ文章が8,000.101msで失敗し、JS改行選択以前の候補計測を原因区間として確定した。Unicodeケースは一度native_checkedになった後、撮影時には再検査中だったため、このrunは3ケース合格。永久的な不安定動作とはまだ断定しない。source `6d20e1c10c427850cec5c2b8567e74507dbad631` で完全一致する属性付き文字列の呼出内計測再利用と撮影直前の同snapshot再確認を実装した。[run38383082112](https://github.com/MassyuRed/Cocolon/actions/runs/38383082112)のJS747件は通過。native単体は最初のview_initで90秒alarmとなり、58件のassertionには未到達。旧計算との数値同値は未確認で、実RN5ケース描画は実行中。詳細と再開位置はmap §65.6。


source `6d20e1c` の完了結果は、実RN3ケース通過・混在420文字8,115.294msのtimeout・引用10,087.829msで再検査中だった。native単体の再実行は58件中56 PASS／2 FAILで、混在420文字の計測とその数値比較が未達。重複計測の再利用だけでは混在文の期限超過を解消できていない。引用では再検査のたびに配置を原点へ戻す製品側の往復を確認したため、source `f7a4c61d4d30c8e7ab360f59f508d20e5d4692c8` で同じ計測世代の配置を保持し、表示・capture・再検査の条件は維持した。修正前に位置変更で失敗する回帰検査を確認し、修正後は既存renderer／B9計80件を通過。[run38387379229](https://github.com/MassyuRed/Cocolon/actions/runs/38387379229)の実RN5ケースと、検査内だけのCoreText時間集計を確認する。詳細と再開位置はmap §65.7。正式admission・保存直前fit・通常初回保存・実機受入れは未完了。


source `f7a4c61` の[run38387379229](https://github.com/MassyuRed/Cocolon/actions/runs/38387379229)は、引用478.033msを含む4ケースで安定したnative_checked／本文保持／canvasを確認した。4枚のPNGを目視確認し、引用の黒い画像・再検査時の位置往復は今回の合成ケースでは解消した。混在420文字は8,088.625msで時間切れとなり、全5ケースの合格ではない。JS748件は通過した。

source `ff38671` の全文属性が一様な場合だけの比較削減でも、native混在420文字は8,000.106msで時間切れだった。source `70a597384009c26ccd9c0826422b0ee8058edc58` は、同じsnapshotの全属性辞書を一度だけ同値分類し、候補間の生UTF-16列と属性ID列が完全一致する場合に限り既存計測値を再利用する。未命中時のCoreText入力・数値・全候補順序・8秒基準は保持する。異なる位置にある同じ非均一属性列の旧計算比較を追加し、native検査は59件。[run38390527878](https://github.com/MassyuRed/Cocolon/actions/runs/38390527878)のJS748件とnative59件は全て通過した。混在420文字のnative候補計測は3,045.567ms、全88,410候補の旧計算とのbit同値も確認した。実RN5ケースの全体描画は確認中。詳細はmap §65.8。native段階の改善は確認したが、環境差を含む各時間差を一つの処理だけの効果とは断定しない。

次はこの結果を読み、420文字の計測値同値・全体描画・8秒以内を確認する。その後の正式renderer供給、保存直前fit、同じpreview/tokenによる通常画面の初回保存、実機受入れは別の残件。最新weekly10/10 §5.5・12/18公開目標を継承し、既存host/controllerを再実装しない。default OFF・Draft/open/unmerged・canSave/canExport=falseを維持する。


## 62. 2026-10-14 JST — 計測値を保持した候補の受渡し削減

前回source `70a5973` の[run38390527878](https://github.com/MassyuRed/Cocolon/actions/runs/38390527878)を完了結果まで確認した。native59件は全て通過し混在420文字の単体計測は3,045.567msだったが、実RNでは候補呼出の完了まで7,878.525ms、全体8,776.295msでmeasurement_timeoutとなった。残る4ケースはnative_checked／本文保持、420文字はplan・PNGなし。単体計測の成功を全体描画の成功へ読み替えない。native単体と実RNの差にはsnapshot／環境差もあり、全差分をbridgeだけの費用とは断定しない。

source `b6a135613c7f443e61740c02873d26424208d8ac` は、native候補の各7数値をlittle-endian Float64のbyte列にまとめ、base64文字列を通じてRNへ渡す。JSで元の行列へ復元し、既存B9の全候補・有限値・境界検証を行う。数値の丸め、候補削除、font順序、改行score、8秒期限、最終native検査の変更はない。iOS内部候補protocolはv2、Androidの既存v1を保持し、描画recipeのprototype.v3は変更しない。

localのrenderer/B9は83 PASS／FAIL0／SKIP0、[run38433766446](https://github.com/MassyuRed/Cocolon/actions/runs/38433766446)のJSは751 PASS／FAIL0／SKIP0。native単体job115422361806はcompile成功後、最初のview_initで90秒alarmとなり59検査へ未到達。実RN job115422361678は確認中。source5fileのremote全文・親・変更path一致は確認済み。次は実RN5ケースの結果と画像を読み、停止したnative単体だけを再実行して旧計測とのbit同値を確かめる。詳細はmap §65.9。

正式rendererの供給、保存直前fit、同じpreview/tokenと通常InputScreenの初回保存、実機受入れは別の残件。既存host/controllerは再実装しない。weekly10/10 §5.5・12/18公開目標、default OFF、Draft/open/unmerged、canSave/canExport=falseを維持する。


§62継続：source `b6a1356` のrun38433766446は完了し、4ケースnative_checkedと4枚のPNGを確認した。混在420文字は48pt候補が5,917.120msで返り、全体7,611.359msで44ptへ進んだが、全体8,111.817msで時間切れとなった。受渡し削減だけでは全体8秒を満たしていない。native単体はview_init停止のため59判定未実行。

source `6be0bed18fa33d5414d4834bf29ecc8b6d25c6d5` で、同じ完全一致条件・cache上限により候補を先に分類し、各substring／CTLineをworker専用にした最大4並列の独立計測へ変更した。元の全行順に全7数値を復元してv2で渡す。全workerの終了を待ち、失敗・同じ8秒期限は一度だけ拒否する。glyph・数値式・font順・B9・最終検査・save/export禁止は維持。testだけのprofileをatomic化し、実RNのadapter／B9時間を別記録にした。local83件は成功。run38437753643のnative59と実RN5ケースを確認中であり、並列化の数値同値・全体短縮はまだ認定しない。詳細はmap §65.10。旧版のnative再実行より、現在sourceのnative59検査を優先する。

§62 native確認：run38437753643のjob115436093723は59 PASS／FAIL0／SKIP0。14fixtureの旧uncached全候補bit比較を含め通過した。混在420文字の単体候補4,524.926ms、「あ」420文字633.233ms。JS job115436093608も751 PASS／FAIL0／SKIP0。別runnerの前回時間との差から並列化単独の短縮率を求めず、実RN5ケースの全体8秒は引き続き確認中。


## 63. 2026-10-14 JST — 全候補を保持した分類・転送・不成立判定の削減

source `6be0bed` の[run38437753643](https://github.com/MassyuRed/Cocolon/actions/runs/38437753643)は完了。native59件の旧方式bit同値・JS751件は通過した。実RNは短文1,034.884ms／引用505.629ms／宣言344.842ms／保存済み2,470.387msでnative_checkedとなり、本文・余白・brandingと4枚PNGを確認した。420文字は8,095.899msでmeasurement_timeout、size1、plan／PNGなし。最初の48ptはnative候補4,707.749ms、adapter全体5,864.281ms、B9不成立601.744ms。44pt候補中に全体期限へ到達した。単体成功を全体合格へ換算しない。

source `b46f4537582a047d25339abcf005ca9d85a7f1d0` は製品3file／test3file。native分類はrange hashで候補を探し、生UTF-16と全属性の完全一致をmemcmpで確認してから再利用する。hash衝突だけでは再利用しない。既存上限・4worker・同じCoreText式を維持する。内部候補v3は代表jobのFloat64計測値と全候補のuint32参照を送り、JSで元の全7数値行へ復元する。v1/v2の受容、全metric検証、font順、最終native inspection、recipe prototype.v3、8秒期限は維持した。B9は全検証後に実測rangeで最小行数を求め、高さに入らないと証明できる場合だけ早期nullとする。収まる場合の元のscore処理は同じ。

local renderer/B9は86 PASS／FAIL0／SKIP0。Python ownerの既存oracleと追加の非単調widthを含む合成2,000graphも旧実装と一致した。remote exact6fileの全文・blob・path・parent51ca57bを照合。同環境read-only reviewに重大指摘なし。独立Pro受入れでも性能証明でもない。[run38441898578](https://github.com/MassyuRed/Cocolon/actions/runs/38441898578)のnative59と実RN5ケースを待ち、完成結果・画像・全体時間で判定する。map §65.11を再開位置とする。正式renderer供給・保存直前fit・通常初回保存・実機は引き続き未完了。weekly10/10 §5.5と12/18目標、default OFF、Draft/open/unmergedを継承する。

§63 検査途中：run38441898578のJS job115450309138は754 PASS／FAIL0／SKIP0。native単体job115450309219はコンパイル後17:54:22 UTCの最初のview_initで止まり、17:55:53に90秒alarmで終了した。59assertion開始前で、計測値の比較結果はない。実RN job115450308931は進行中。workflow完了後に単体jobを再実行する。

§63 実RN完了：run38441898578のjob115450308931は4ケースnative_checked、420文字のみ失敗。artifact11838285425のdigest・5件JSON・4枚PNGを確認した。短文810.885ms／引用396.497ms／宣言1,083.560ms／保存済み1,327.600ms。420文字は48pt候補2,793.299ms→adapter3,039.565ms→B9不成立292.267ms、44pt候補3,280.519ms→adapter3,543.499ms→B9不成立217.106ms。全体7,288.208msに40ptへ進んだが、計測中に期限へ達し、最終8,113.899ms。全体8秒は未達でplan・PNGなし。採用順を保った各fontのnative反復を収めることが次の修正対象。全候補・本文・font順・期限を緩和して成功扱いしない。workflow完了後にnative単体のみを再実行し、attempt2 job115462431082の全59判定を待つ。詳細はmap §65.11末尾。

§63 native再実行完了：attempt2 job115462431082は59 PASS／FAIL0／SKIP0。v3を検査側で独立decodeし、混在420文字の全88,410候補と非均一属性を含む14fixtureすべてで旧uncached計測とのbit一致を確認した。「あ」420文字368.540ms、混在420文字7,974.885ms（単体検査の候補呼出・decodeを含む時計）。CoreTextの操作時間の和は作成6,981.997ms／幅0.922ms／ink1,692.260ms、11,382作成／2,320,415 UTF-16 units。並列操作の和をwall-clockへ加算せず、この別runnerの単体値を実RN性能へ換算しない。初期化停止の原因解消を意味せず、今回の再実行は全判定まで到達したという結果である。JS754件とnative59件は通過したが、実RNは4ケース成功・420文字は40pt候補中の全体timeoutが残る。次の本線はこの反復計測を全体8秒へ収める修正であり、その後の正式renderer供給・保存直前fit・通常初回保存・実機受入れは未完了。


## 64. 2026-10-14 JST — 次fontの実測を先行させ、採用順を保持

source `ecfda5730681ade9374cfcbfcd6916e187b8fb26` は既存製品2path・test2pathの変更です。前回の混在420文字は全体8,113.899msで40pt候補待ちのtimeoutでした。

- `components/piece/PieceVisualCard.js`：現在fontの全段落を先に発行し、実mount済みの次font一段だけを先行計測します。同じ入力batchのpromiseを引き継ぎ、48→44→40→36ptの採用順、元の全体8秒、全候補、本文、最終inspectionを保持します。別入力・A→B→A・unmount・期限後の結果を採用せず、先行fontの失敗はそのfontが必要になった時だけ反映します。
- `ios/tempCocolon/PieceTextMetrics.mm`：module横断の共有serial queueに候補呼出を載せ、各呼出内の最大4workerを保持します。前fontのJS復元/B9中に次fontを計測できます。queue待ちでnative期限を延長せず、開始直後も期限を確認します。CoreText計算・候補値・v3転送・属性比較を変更しません。
- `tests/piece-v2-renderer.test.js`：先行完了でも順序保持、段落順、再計測不要、失敗の遅延反映、世代/期限失効、固定export canvasを4検査で確認。localの既存13suiteは758 PASS／FAIL0／SKIP0。最初の追加検査1件のVM配列比較を補正して最終成功しました。実RN性能の代用ではありません。
- `tests/native/piece-text-metrics-ios.mm`：独立decoderを既存検査と共用し、別module・別fontの同時要求3判定を追加。先行59判定・全候補の旧uncached bit比較は保持します。

4pathのremote全文・親head・変更pathを照合しました。同環境read-only補助reviewに重大指摘なし。[run38470057115](https://github.com/MassyuRed/Cocolon/actions/runs/38470057115)の実RN job115546511987、native job115546512207で検証中です。最新の次作業はこのrunの完了結果・全候補比較・5ケースの時間/画像を読むことです。未完了runを成功へ換算しません。

STRUCTURE_MAP_DELTA_NONE（既存Cardと計測ownerの内部順序のみ）。weekly10/10 §5.5、12/18目標、default OFF、Draft/open/unmergedを保持。API/DB/依存/workflow/本番有効化/配布/main mergeの変更0。正式renderer supplier→保存直前fit→通常初回保存→実機受入れはこの描画確認後の残件です。


§64 追加修正：source `f882601c115bd075d1379a09837d4d9043caa6e1` は既存製品2pathです。`PieceVisualCard.js` の先行probeのReact keyを入力keyに結び、同じ寸法の別入力でもonLayoutを取り直します。`pieceRenderer.js` はv3代表値を一度だけFloat64へ復号し、全候補の7数値行へコピーします。混在420文字の11,381代表ではFloat64読取が442,050回から56,905回、追加typed bufferは455,240 bytesです。全88,410候補、参照と全代表使用の検証、符号付き0／subnormalを含む有限値、B9全数値検証、font順、8秒を保持します。local13suiteは758 PASS／FAIL0／SKIP0。2pathのremote全文・親head・変更pathを照合済みです。

先行source `ecfda573` のnative job115546512207は62 PASS／FAIL0／SKIP0、混在420文字を含む旧uncached全候補比較と別module/48・44ptの3追加判定が成功しました。単体混在420文字は2,575.993msであり、実RN全体時間ではありません。GitHub JS job115546512276は758 PASS／FAIL0／SKIP0。先行実RN job115546511987はまだ進行中です。最新sourceの[run38472162457](https://github.com/MassyuRed/Cocolon/actions/runs/38472162457)、実RN job115553723490の5件JSON／PNGと全体時間を次に確認します。未完了runを成功へ換算しません。


## 65. 2026-10-14 JST — 実RN期限超過の内訳と完全属性の部分文字列作成

先行source `ecfda573` の[run38470057115](https://github.com/MassyuRed/Cocolon/actions/runs/38470057115)は完了しました。短文1,368.814ms／引用1,636.797ms／宣言299.457ms／保存済み5,483.014msはnative_checked、本文保持・native_canvas_valid・4枚PNGの本文／余白／brandingを確認しました。artifact11851834939（59,317,729 bytes、SHA256 `24acbe0b0ea8452b4ee7cdd5c75a9c6a692e73957722cb0e984e5dcba411468d`）のdigestを照合済みです。

420文字は8,089.435msでmeasurement_timeout、40ptのsize2、plan／PNGなし。48pt候補3,126.507ms／adapter3,393.581ms／B9不成立242.812ms、44pt候補6,687.866ms／adapter6,940.100ms／B9不成立224.464msでした。44pt呼出時間にはqueue待ちが含まれ、単純加算しません。44ptへの状態移行は3,766.830ms、40ptへ7,301.694ms。40／36ptも先行発行済みですが期限内に解決しませんでした。保存済みcaseの候補待ち約5.2秒は、直前の未完了候補が共有queueに残ることと整合しますが、単独原因確定とはしません。

source `f882601c` のnative job115553723717は62 PASS／FAIL0／SKIP0、GitHub JS job115553723621は758 PASS／FAIL0／SKIP0。実RN job115553723490は検証中です。source `59f7fa7d38ac8ac1aff90da5c05943047ea0bc82` は既存native検査1pathだけの観測拡張で、製品sourceを変更しません。run38473518272／job115558365099は62 PASS／FAIL0／SKIP0。混在420文字の時計は2,083.495ms（検査decode含む）、queue0.015ms、glyph＋分類48.232ms、worker実時間1,676.862ms、pack＋resolve19.645ms、検査decode337.325msでした。worker内累積はCoreText作成1,817.048ms／ink485.550ms／generic部分文字列1,126.983ms／release154.248ms、時計取得8.555ms（199,584回）。累積を実時間へ加算／4で除算して未計測時間と断定しません。時計poll頻度の変更は採用せず、実測で支配的なworker処理を対象にしました。

最新source `785c37a950932af96eb39c92dc721aa6dc8e02fd` は製品1＋test1の2pathです。`ios/tempCocolon/PieceTextMetrics.mm` は既存の完全属性dictionary分類が1種類だけの場合、同じUTF-16 substringとdictionary全体からimmutable NSAttributedStringを直接作ります。複数属性の場合は元のattributedSubstringFromRange経路を保持します。文字・全属性・全候補・CoreText式・4worker・font順・8秒を維持し、font比例や候補省略を使いません。`tests/native/piece-text-metrics-ios.mm` は全文uniformのkern／baselineOffset／monospaced fontの独立uncached bit比較を1件追加し、未到達phaseの時計はNaNとしました。計測名generic_substring_sum_msは旧経路だけを表し、新規文字列生成コストはworker実時間で読みます。

2pathのremote全文・親head・変更pathを確認済みです。最新[run38474295233](https://github.com/MassyuRed/Cocolon/actions/runs/38474295233)のnative job115561053058（期待63判定）と実RN job115561052750（5ケース）を次に確認します。全体8秒や高速化を未確認で成功扱いしません。正式renderer supplier→保存直前fit→同じpreview/tokenの通常初回保存→実機受入れは未完了です。既存host/controller/API保存を再実装せず、この描画確認後に接続を進めます。weekly10/10 §5.5・12/18目標、default OFF、Draft/open/unmerged、STRUCTURE_MAP_DELTA_NONE、DB/env/deploy/署名/配布/main merge効果0を保持します。


## 66. 2026-10-14 JST — 複数属性の計測データをworkerごとに独立

source `785c37a9` のrun38474295233はnative job115561053058で63 PASS／FAIL0／SKIP0、JS job115561053139で758 PASS／FAIL0／SKIP0でした。uniformなkern／baselineOffset／monospaced fontを含む全候補の旧uncached bit比較が通過しました。ただしmixed420は複数属性で、このuniform経路の対象ではありません。単体mixed420は3,011.834ms（検査decode含む）、worker実時間2,709.033ms、generic部分文字列の累積2,107.025ms。別runnerの時間差を修正単独の効果へ換算しません。

同runの実RN job115561052750は短文514.682ms／引用340.039ms／宣言251.090ms／保存済み1,923.948msでnative_checked・本文保持・native_canvas_valid。artifact11854250812（62,494,151 bytes、SHA256 `7c9d05af18a36a315b0453b3b9d74c58916f712a24924c01650e05e4036dae35`）のdigest、5件JSON、4枚PNGの本文／余白／brandingを確認しました。420文字は8,056.995msのmeasurement_timeoutで36pt（size3）待ち、plan／PNGなし。48／44／40ptの各88,410行・11,381代表値は返りましたがB9は不成立でした。native呼出は2,581.425／4,771.826／4,114.919msで、後続はqueue待ちを含むため加算しません。先行f882のrun38472162457も4件成功・420文字8,079.121ms（size1）で未解決です。

source `5ef1e0301fec0e8ab87290829dffe4883baee0b9` は複数属性の全runをCF内部データへ一度転記し、その部分文字列を使う製品1＋test1pathの修正でした。JS758件は通過しましたが、run38475623262／native job115565457508は55 PASSの後、mixed420 candidate_call中にsignal11／exit139となり、63判定を完走していません。高速化・計測値同値の成功へ換算しません。公開Swift corelibsのCFRunArray読取に内部位置cacheの無ロック更新を確認しましたが、その公開実装と当該iOSの一致やcrashの直接原因は未確定です。

最新source `ec5db637523c047a67a427c69f88d5685e3e4fa5` は既存 `ios/tempCocolon/PieceTextMetrics.mm` の1pathだけです。並列開始前に、各worker専用のCFデータをCreateMutable→全文→全属性run→immutable化で別々に構築します。同じimmutableオブジェクトのcopyだけでは独立とみなしません。workerは専用snapshotから候補を作るため、substring作成時に共有CF run-arrayを読みません。文字・全属性・全候補・CoreText式・48→44→40→36pt・総4worker・元の8秒期限・最終inspectionを保持します。native63判定は変更していません。

remote全文・親5ef1・変更1pathは一致確認済み。同環境read-only補助reviewに重大指摘なし。run38476571738のJS job115568602141は758 PASS／FAIL0／SKIP0。native job115568602020（期待63判定）と実RN job115568602208（5ケース）の結果を次に確認します。正式renderer supplier→保存直前fit→同じpreview/tokenの通常初回保存→実機受入れは描画確認後の残件です。weekly10/10 §5.5・12/18目標、default OFF、Draft/open/unmerged、STRUCTURE_MAP_DELTA_NONE、DB/env/deploy/署名/配布/main merge効果0を保持します。

§66 native再検証：source ec5db637／run38476571738／job115568602020は63 PASS／FAIL0／SKIP0。混在420文字の全88,410候補、非均一属性、uniform全属性、別module/2fontを含む旧uncached bit比較を完走し、今回のcrashは再発しませんでした。混在420文字は2,898.438ms（検査decode500.362msを含む）、queue0.045ms、glyph＋分類85.379ms、worker実時間2,273.151ms、pack＋resolve33.396ms。累積はCF部分文字列472.582ms／generic部分文字列0ms／CoreText作成3,487.415ms／ink910.367ms。「あ」420文字887.024ms。並列累積や別runner差を性能証明へ換算せず、実RN全体8秒は未確認です。

§66 実RN完了：source ec5db637／[run38476571738](https://github.com/MassyuRed/Cocolon/actions/runs/38476571738)／job115568602208は完了しました。短文2,024.390ms／引用1,433.250ms／宣言256.899ms／保存済み249.688msはnative_checked、本文保持、native_canvas_valid。artifact11856136762（56,143,057 bytes、SHA256 `4ae72dec7bd3b48b82e70421f8c1fe3a3df2cd718ae08f6f7e2af8ea6708225e`）のdigestを照合し、5件JSONと4枚PNGの本文／余白／brandingを確認しました。

420文字は8,118.417msのmeasurement_timeout、size3、plan／PNGなし。48→44→40→36ptの全native候補・全adapterはresolvedで、各88,410行・11,381代表値が返りました。48ptのnative1,583.702ms／adapter1,745.653ms、44pt3,271.316／3,448.172ms、40pt3,352.568／3,591.154ms、36pt4,002.509／4,164.934ms。後続の呼出時間はqueue待ちを含み、合計時間として加算しません。48／44／40ptのB9は216.672／247.412／254.773msで不成立。stateは44ptへ2,065.573ms、40ptへ3,815.238ms、36ptへ6,008.826ms、unavailableへ8,087.806msでした。36ptのB9記録はなく、adapter返却後の同じdeadline確認で採用されていません。36pt B9の処理が遅いと確定した結果ではありません。

旧共有CF版source5ef1のrun38475623262／RN job115565457118も完了し、joblogにsignal segvを確認しました。最初の3ケースだけが完了し、420以降は未完了です。symbolicated stackはjoblogになく、内部cache競合は引き続き仮説です。最新ec5db637はnative63件を完走し実RN全5ケースの結果を返し、今回のcrashは再発しませんでした。ただし全5ケース合格・全体8秒の達成ではありません。旧profile-only source59f7の実RNも4件成功・420文字8,094.463ms（size1）のtimeoutでした。

次の本線は、全4fontのnative反復と最後の候補復号をさらに短縮し、36ptのB9・実Text描画・最終inspectionの時間を同じ8秒内に確保することです。全候補、bit同値、font順、全体deadlineを緩和しません。未測定のworker数変更・font間比例・候補省略を解決策として採用していません。現在sourceのJS758／native63は成功ですが、実RN全体は4成功・420文字未解消です。保存接続へはまだ進めません。正式renderer supplier→保存直前fit→通常初回保存→実機受入れのownerは§65.10を継承し、既存host/controller/API保存を再実装しません。default OFF、canSave/canExport=false、Draft/open/unmerged、STRUCTURE_MAP_DELTA_NONEを保持します。

## 67. 2026-10-14 JST — JS復号とB9境界判定の反復削減

source `f93f9108cc8e3fb798ebc0fb99dd8e916d57a145` は既存製品2＋test2pathです。前回実RNは全4fontの候補返却後、36pt B9の開始前に8,118.417msで停止しました。今回は同じ全候補を使う復号・計画側の重複処理を削減します。

- `features/piece/pieceRenderer.js` はbase64の途中quartetと最終quartetを分離し、padding／末尾bitの判定を最後だけに行います。途中の全4文字の妥当性と出力長、非ASCII／途中paddingの拒否、全Float64値・全range復元を保持します。
- `features/piece/pieceMeasuredWrap.js` は禁則を段落内の境界ごとに一度計算し、最短行数とB9で再利用します。全候補の検証・DP順序・得点式・終端境界の例外は保持します。数値5slotの検証を明示し、従来everyがskipし得た疎配列の欠損metricも拒否します。
- `tests/piece-v2-renderer.test.js` と `tests/piece-v2-measured-wrap.test.js` に、padding全形のbit同値、途中quartet各位置の不正文字拒否、全oracleの逆順table一致、数値全slotの不正／欠損拒否、先頭句読点と末尾開き括弧の境界検査を追加しました。localの既存13suiteは763 PASS／FAIL0／SKIP0（Node24.19.0／TypeScript5.2.2）。native／Hermes性能の代用ではありません。

同環境read-only補助review後、華恋が原典と差分を確認し、4pathのremote全文一致・親head・変更path集合を照合しました。native source／worker数／CoreText式／font順／8秒／最終inspection／workflow／依存は変更0です。CTTypesetterによる段落全体の再利用はsubstring外contextが変わり得るため採用していません。

最新検証は[run38480929335](https://github.com/MassyuRed/Cocolon/actions/runs/38480929335)。実RN job115583041976はfailure、native job115583042506は63 PASS／FAIL0／SKIP0、JS job115583042448は763 PASS／FAIL0／SKIP0です。完了結果は次項へ記録しました。描画確認後の正式renderer供給→保存直前fit→通常初回保存→実機受入れは引き続き未完了です。

必須前提・作業rule・全体構造01系・現行Piece map・weekly10/10 §5.5／12/18基準・前回txtを確認。System Context prepareは作業用sparse treeにtools.cocolon_contextがなくModuleNotFoundErrorで未成立、technical entryが許す原典直接読取りで継続しました。生成contextの成功は主張しません。STRUCTURE_MAP_DELTA_NONE（既存JS内部処理のみ）。default OFF、canSave/canExport=false、Draft/open/unmerged、DB/env/deploy/署名/配布/main merge効果0を保持します。

### 67.1 同じsourceの実RN完了結果 — 420文字は未解消

実RN jobは2026-10-13 22:55:11〜23:14:25 UTC（約19分14秒、ビルドを含む）。artifact11857877697のZIP SHA-256 `35819bfdeb5797986444e52efad4cee504e20978d4ae543990ce48995c1ac7ab` を照合し、5件results.jsonと4 PNGを取得しました。results.json SHA-256は `ff8364481e17ce8e97bfdfcd097c7ae83acd99d6d9687f97d2eea5e527da8316`。artifactの期限は2026-10-20です。

| case | 最終状態 | 全体ms | 描画確認 |
|---|---|---:|---|
| essay_paragraphs | native_checked | 1,243.988 | 全文・段落・branding、1080×1350 |
| quote_unicode | native_checked | 584.907 | 結合文字・emoji・branding、1080×1920 |
| declaration_no_brand | native_checked | 377.571 | 全文・brandingなし、1080×1920 |
| essay_max420 | measurement_timeout / size2 | 8,113.969 | plan・最終inspection・PNGなし |
| saved_essay_canvas | native_checked | 3,295.463 | 保存済み合成recordの全文・branding、1080×1350 |

成功4件はJSONのbody_preserved／native_canvas_valid=true、native_textsと選択行＋brandingの一致、PNG寸法を確認し、華恋が4画像の本文・改行・欠け・配置を読みました。420文字のbody_preserved=falseはplan未成立によるもので、画像を生成できていません。全ケースでcanSave/canExport=false。実機・正式保存・release受入れの証拠ではありません。

420文字の48ptはnative2,680.218ms／adapter2,898.100ms、44ptは5,728.085／5,975.691ms。各88,410行・11,381代表値を返し、B9は137.328／175.843msで不成立でした。stateは44ptへ3,200.344ms、40ptへ6,366.127ms、unavailableへ8,065.025ms。保存されたtraceでは40pt／36ptのnative・adapterはpendingで、B9も未実行です。呼出時間にはqueue待ちを含むため合計へ加算しません。前回は36ptまで返却、今回は40pt待ちであり、異なるrun間の時間差を今回変更だけの速度効果・退行とは断定しません。JS変更だけで8秒を満たすという見込みは成立しませんでした。

native単体は63件成功し、mixed420は2,837.208ms、全候補・従来uncached計測とのbit同値を確認しました。profileはCoreText creates11,382／units2,320,415、create累計3,630.224ms／image累計858.217ms、workers wall2,214.111ms。並列worker累計とwallは別量です。native sourceは不変で、この結果を今回のnative性能改善とは扱いません。

read-only補助調査と原典で、nativeは候補indexを4workerへ交互配分していることを確認しました。fixtureのunique11,381候補のUTF16量は579,999／580,000／579,999／579,997（合計2,319,995＋全文glyph420がprofileと一致）。長さの配分偏りを根拠にworker方式・数を変える判断は成立しません。追加helper・並列方式変更・通るまでの再実行は行っていません。

**primary outcome: BLOCKER_NARROWED。** 重複JS処理の削減と欠損metric拒否は検証済みですが、420文字の商品上の停止は未解消です。次の本線は、既存 `ios/tempCocolon/PieceTextMetrics.mm` の同一属性substring／CoreText行作成の反復コストを、既存profile・同値検査に基づいて直接短縮し、同じ実RN5ケースで全体8秒・最終inspectionを確認すること。全候補・bit同値・font順・8秒の緩和、根拠のないworker変更、font比例、全段落shapingへの置換は解決として採用しません。

保存側は `PieceVisualCard` の同一mount・generation・plan・inspectionと同じpreview/tokenを `PiecePreviewModal` 経由で既存 `InputPieceActionArea.isSaveAdmitted` へ結ぶ箇所が残っています。Controller/API保存を重複実装しません。PCE5 `Piece_Export_Owner_Comparison_20260808.md` §1/8/15–16と `Piece_Render_Reproducibility_Contract_20260808.md` §6–7に従い、prototype native_checkedや例示versionを正式renderer採用・実機受入れへ昇格しません。一方、実機matrix全体を接続コードの着手条件へ拡張する根拠もありません。今回は未解消の描画を先に扱います。

## 68. 2026-10-14 JST — 独立候補を段落ごとに束ねたCoreText計測

source `015dda53ece8a65dbc3ce374e9fc814a4c1840a3` は既存 `ios/tempCocolon/PieceTextMetrics.mm` と `tests/native/piece-text-metrics-ios.mm` の2pathです。420文字が全体8秒で停止する残件に対し、候補ごとのCoreText初期化をまとめる内部実装を検証します。

- 各worker専用のattributed batchへ、元の独立substringと完全属性をそのまま転記し、候補間へU+2029を置きます。1batchは最大16,384 UTF16単位・256候補。separatorをcandidate range・本文・返却値へ含めず、各rangeをCTTypesetterCreateLineで計測します。全候補表、v3 Float64転送、B9、4worker、48→44→40→36pt、元の8秒、最終mounted Text inspectionは維持します。
- typesetterとCF storageをworker専有にし、早期returnを含む所有期間を明示しました。旧独立CTLineとの全range・全5metricのbit一致を採用条件のまま保持します。段落全体のsubstring contextを共有する方式ではありませんが、separatorによる影響がないと未検証で決めません。
- 既存native63判定を保持し、Latin合字／Arabic／Hebrew／bidi混在／絵文字／属性の全候補比較6件と、batch先頭・中間・末尾／前後neighbor／末尾separator有無の直接比較5件を追加。tab・改行・未閉鎖bidiは直接CoreText比較へ分離し、製品のglyph判定を弱めません。期待74判定、alarm90秒は不変です。新typesetter作成・行作成のprofileを別々に計上します。

local既存13suiteは763 PASS／FAIL0／SKIP0。GitHub [run38485611654](https://github.com/MassyuRed/Cocolon/actions/runs/38485611654) のJS job115598400212も763 PASS／FAIL0／SKIP0（Node24.21.0／TypeScript5.2.2）。source2pathのremote全文・親071f3d8・変更path集合は一致確認済み。同環境の独立補助reviewで、範囲対応・属性・worker所有・deadlineに静的blockerなし。別modelのreview実績へ換算しません。

native job115598400327は最初のCASE japaneseのSTAGE view_initで停止し、90秒alarm／signal14／exit142で終了しました。STAGE view_ready・candidate_call・最初のassertionへ到達しておらず、今回の計測変更の同値／性能は未検証です。同じsourceの単体jobだけを再実行する要求は、並行する実RN job115598400455が実行中のためGitHubに拒否されました（workflow already running）。実RN完了後に単体jobを一度再実行して確認します。実RN job115598400455は検証中です。全候補bit一致、5ケースの本文・最終inspection・PNG・8秒を実結果で判断します。候補の高速化や420文字の解消はまだ未確認です。正式renderer供給→保存直前fit→同じpreview/tokenの初回保存→実機受入れは未完了です。

STRUCTURE_MAP_DELTA_NONE（既存native内部実装と対応検査のみ）。全体設計・全file地図・最新weekly10/10 §5.5・12/18目標を確認済み。default OFF、canSave/canExport=false、Draft/open/unmerged、DB/env/deploy/署名/配布/main merge効果0を保持します。

### 68.1 完了結果 — batch方式は不採用

source `015dda53` の[run38485611654](https://github.com/MassyuRed/Cocolon/actions/runs/38485611654)は完了しました。最初のnative job115598400327はUIView初期化で90秒alarmとなったため、実RN完了後に同じsourceのnativeだけを一度再実行しました。再実行job115604411027は74判定中72 PASS／2 FAIL／SKIP0です。元63判定を含む全行oracleは削除・許容誤差化していません。

- max420_uncached_equivalence：UTF16 [0,8) の「あ」8文字でadvanceが1 ULP不一致（actual `407699e7cc4e7ae3`／expected `407699e7cc4e7ae2`）。
- batch_positions_unmatched_bidi：position1／neighbor_order0／final_separator0のinkLeftが不一致（actual `4009800000000000`／expected `3ffaa00000000000`）。
- mixed420の全88,410行はbit一致しましたが、これだけでは方式全体を採用しません。計測profileはtypesetter144個／入力2,331,376 UTF16単位、行11,381個。worker実時間5,345.412ms、typesetter作成累積8,294.104ms、行作成累積607.526msでした。並列累積を実時間へ加算しません。

実RN job115598400455は4成功・420文字timeoutです。essay1,050.932ms／quote434.540ms／declaration599.866ms／saved5,227.107msはnative_checked、body_preserved／native_canvas_valid=true。華恋が4枚PNGの本文・改行・余白・brandingを確認しました。420文字は8,098.169ms、size2、plan／inspection／PNGなし。48／44ptは各88,410行・11,381代表値を返し、native2,781.681／6,118.381ms、adapter2,925.391／6,257.927ms、B9は122.856／105.117msで不成立。40／36ptは保存traceでpending。呼出時間にはqueue待ちを含み、加算しません。

artifact11859539554（56,522,478 bytes、期限2026-10-20）のZIP SHA256 `9dc660ddd32f2220ac3aa5c604bebed176dd234716ad3f9933c8a44cbf601bf6` とresults.json SHA256 `ec17157767e46ab55b0fe0f162cff9d2051065a9b2b5910d579ca601456be530` を照合しました。JS763成功、Android source compile成功。再実行attempt2に他jobの新IDが並ぶことを、他jobの再検証とは扱いません。batchは数値一致条件と実RN期限条件を満たさず不採用です。

## 69. 2026-10-14 JST — 開始位置ごとのCoreText準備の再利用を検証

source `69f9f2cd069ff229fa940e3f3f5302a878f27efd` は既存native製品＋testの2pathです。batchを取り除き、各workerで開始位置が同じ候補だけ、同じ開始位置からのsuffixを使うtypesetterを再利用します。CTLineのrangeは常にoffset0から候補末尾までです。完全属性・worker専有storage・全候補表・v3・B9・4worker・font順・8秒・最終inspectionを維持します。後続文字の影響がないと未検証で決めず、旧独立substringとの全行bit一致を採用条件にします。

既存63＋追加6の全行比較を維持し、直接比較5件を候補offset0＋空／LTR／RTL／U+2029+LTR／U+2029+RTLの後続文脈へ置き換えました。候補文字・属性・5double比較式・alarm90秒は不変、期待74判定です。同環境の補助review後、華恋が差分・remote全文・親284db3f6・変更2pathを照合しました。

[run38488415449](https://github.com/MassyuRed/Cocolon/actions/runs/38488415449)のJS job115607570592は763 PASS／FAIL0／SKIP0。最初のnative job115607570600と、同じnative blobを含むf782ac64のjob115609133528はview_initで90秒alarmでした。同sourceの単体jobを一度再実行した結果を§69.1、実RN5ケースを§69.2へ記録します。この案は不採用です。

### 69.1 同じnative blobの再実行結果 — suffix方式も撤回

sourcef782ac64（native製品・testは69f9f2cdと同一）／run38488895460のnative再実行job115610828443は74判定中66 PASS／8 FAIL／SKIP0でした。最初の2実行はview_initで90秒alarmでしたが、今回は候補計測と全判定へ到達しました。失敗は次の通りです。

| 判定 | UTF16範囲／直接比較条件 | metric | actual bits | expected bits |
|---|---|---|---|---|
| spaces_uncached_equivalence | [0,3) | advance | 40456f0000000000 | 4046050000000000 |
| max420_uncached_equivalence | [0,8) | advance | 407699e7cc4e7ae3 | 407699e7cc4e7ae2 |
| latin_ligature_context_uncached_equivalence | [0,17) | advance | 4072db0000000000 | 4073170000000000 |
| hebrew_context_uncached_equivalence | [0,8) | advance | 40662fc000000000 | 40666bc000000000 |
| arabic_context_uncached_equivalence | [0,1) | advance | 40379474d0000000 | 403898c430000000 |
| mixed_bidi_context_uncached_equivalence | [3,4) | inkLeft | c024640000000000 | 0000000000000000 |
| paragraph_direction_attributes_uncached_equivalence | [0,4) | advance | 4050dd8000000000 | 4051cd8000000000 |
| suffix_contexts_whitespace | neighbor_case2 | advance | 403c000000000000 | 4043190000000000 |

mixed420の全88,410行はbit一致しました。typesetter入力は45,528 UTF16単位／112個、line11,381個、worker実時間886.411ms、typesetter作成累積59.788ms、line作成累積447.418ms、ink累積1,147.681msでした。mixed420計測1,187.071msは検査decoder185.350msを含み、実RN全体時間ではありません。速度短縮があっても上記不一致を許容しません。特定の検体だけに合わせた文字種分岐や許容誤差の追加も行いません。

製品nativeを検証済みbaseline071f3d8のblob `4dbe6cb1c50f216acad2a2d3f091ca5c0a1bddf8` と完全一致へ戻しました。原63判定と追加6件の全行oracleを残し、撤回した方式だけの直接比較5件と専用profileは取り除きます。元の失敗する全行判定を削除してgreenにする変更ではありません。§68のbatch・§69のsuffixはいずれも不採用です。

### 69.2 不採用sourceの実RN画像 — 420文字は5.81秒、製品解消には数えない

source69f9f2cd／[run38488415449](https://github.com/MassyuRed/Cocolon/actions/runs/38488415449)／実RN job115607570509は5ケースともnative_checkedでした。essay920.549ms／quote481.021ms／declaration680.611ms／420文字5,806.998ms／saved319.225ms。5件のbody_preserved／native_canvas_valid=true、native_textsと選択行＋brandingの一致、画像寸法を確認し、華恋が5枚PNGの本文・段落・欠け・余白・brandingを読みました。420文字は1080×1350、36pt・18行で最終inspectionまで完了しました。

420文字の48／44／40／36ptは各88,410行・11,381代表値を返し、native呼出886.560／1,778.954／1,335.137／1,410.657ms、adapter1,092.060／1,938.064／1,507.562／1,600.211ms。queue待ち込みの呼出時間を加算しません。B9は123.323／117.308／116.834msで不成立、36pt237.322msでfit成立。stateはmeasuring4,227.509ms→geometry_checked5,556.216ms→native_checked5,755.432msでした。

artifact11860684136（2,002,440 bytes、期限2026-10-21）のZIP SHA256 `3e7baeeabb108d0f8fa36eddc4aab3be79737707c72c0bd67b77905f215bb102` とresults.json SHA256 `afc5fcde7ae415bf6a87028215a7a9e510ae6ba6a0b60ca433a24433633a170e` を照合しました。全ケースcanSave/canExport=false。これは不採用のsuffix sourceの検証記録であり、§69.1の8件不一致を打ち消しません。現行製品の420文字解消・正式renderer・保存・実機受入れの証拠には使いません。

## 70. 2026-10-14 JST — 書き出し初期整理失敗後の明示再試行

source `f782ac64513a449fe4b18db86b9b49be9b0c9674` は `features/piece/pieceExport.js` と `tests/piece-v2-export.test.js` の2pathです。prepareRawCacheが一度失敗すると、rejected Promiseをprocess内に残し続け、その後にfilesystemが回復しても全prepareが失敗する不具合を再現しました。最初のls失敗後の再試行でもlsCount=1、captureCount=0でした。

失敗した同じPromiseだけをidentity確認後に破棄し、次の明示prepareから初期整理を再試行します。成功Promiseは保持し、並行prepareは同じpendingを共有します。自動再試行は追加せず、整理完了前のcapture・owner/current境界・許可されたraw名だけの削除・外部エラーの匿名化を維持します。成功後のcaptureを次のstartup cleanupで消す経路は作りません。

追加3件はls失敗／unlink失敗からの復帰と、並行prepareの共通失敗・回復を検査します。修正前は28 PASS／3 FAIL、修正後は31 PASS／FAIL0／SKIP0。local既存14ファイルもexit0で成功しました（dot出力、総件数は取得していません）。workflowの13ファイルとの差はinitial-save-host検査です。GitHub [run38488895460](https://github.com/MassyuRed/Cocolon/actions/runs/38488895460)／JS job115609133612は766 PASS／FAIL0／SKIP0です。OS・filesystemを代替したJS検査であり、実機の写真保存完了ではありません。

同環境の別担当がPromiseの並行共有・旧rejectと新pendingのidentity・成功後one-time・owner/current維持をread-only確認し、華恋が製品原典と差分を確認しました。remote2path全文・親69f9f2cd・変更path集合を照合済み。native／renderer／workflow／依存への変更はありません。実RN job115609133524のsuccessは描画変更なしによるscope skipで、新しい描画検証ではありません。420文字の再利用案は§69.1の結果により撤回しました。

STRUCTURE_MAP_DELTA_NONE（既存export準備内部の再試行のみ）。全体設計・全file地図・最新weekly10/10 §5.5と12/18目標を確認済み。default OFF、canSave/canExport=false、Draft/open/unmergedを保持。DB/env/deploy/署名/配布/main merge効果0です。

## 71. 2026-10-14 JST — 独立計測の復元とUIKit単体検査の通常起動

source `562e6a38a7ff1f75a557b464cd5badfcf55bb113` は既存3pathです。

- `ios/tempCocolon/PieceTextMetrics.mm` をbaseline071f3d8のblob `4dbe6cb1c50f216acad2a2d3f091ca5c0a1bddf8` と全文一致へ復元しました。独立substring＋CTLineCreateWithAttributedString、完全属性dedup、4worker、全候補、v3、B9、font順、8秒、最終inspectionを保持します。batch／suffixの再利用は残しません。
- `tests/native/piece-text-metrics-ios.mm` は原63判定へ追加6件の全行oracleを残し、実験専用5件とprofileだけを撤去。追加6とhost起動部分を逆変換して原071f3d8とbyte一致することを確認しました。UIKit専用hostをUIApplicationMainで起動し、active後一度だけmain queueから同じ検査本体を実行します。mainで開始する90秒alarmは延長・再設定しません。
- `.github/workflows/piece-rn-contracts.yml` のnative単体stepだけを、裸のbinaryのspawnから小さな.appのinstall／launch --consoleへ変更。pipeline終了codeと、完走summary `NATIVE_CHECKS=69 PASS=69 FAIL=0 SKIP=0` の完全一致1行・FAIL行なしを両方要求します。起動失敗やsummary欠落／重複を成功にしません。

初回UIViewでの停止は計測methodへ到達する前でした。標準UIKit起動を通らないharness構造は確認できましたが、内部の停止stackがないため、それが直接原因だと断定しません。timeout延長・assertion省略・追加自動retryは行いません。実RN hostへshimを混ぜず、依存追加・署名・配布もありません。他job本文は同一です。

localでYAML／shell／埋込Python／plistと完走guardを確認。別担当の同環境read-only reviewと華恋の差分確認後、remote3path全文・親f782ac64・変更path集合を照合しました。別modelのreview実績ではありません。最新[run38490317258](https://github.com/MassyuRed/Cocolon/actions/runs/38490317258)の完了結果は§71.1〜71.2です。

採用済み成果は§70の書き出し再試行修正と追加回帰検査です。420文字は現行の厳密計測では未解消です。2つのCoreText再利用案は実測で不採用とし、同じ案を繰り返しません。次は全候補を先に独立計測する方式の処理量を設計段階から検討します。全候補契約や測定の意味を変更する場合は、owner／native-JS境界／比較基準を先に明記し、実装だけで黙って変更しません。本文・段落保持、離散font順、8秒、実Text最終inspectionを成功条件のまま扱います。

正式renderer供給→保存直前fit→同じpreview/tokenの通常初回保存→実機受入れは未完了です。全体設計・全file地図・weekly10/10 §5.5／12/18目標を確認済み。STRUCTURE_MAP_DELTA_NONE（既存owner内の処理・検査起動のみ）、default OFF、canSave/canExport=false、Draft/open/unmerged、DB/env/deploy/署名/配布/main merge効果0を保持します。
### 71.1 通常起動で69判定を完走

source562e6a38／run38490317258／native job115613701492は69 PASS／FAIL0／SKIP0です。main_entered 00:32:07.791 UTC→application_launch 00:32:08.071→application_active 00:32:08.879→69件完了00:32:37.645で、同じ90秒alarm内に通常起動と検査を完走しました。今回のview_init停止は再発していませんが、将来の全環境で停止しない保証にはしません。

原63判定＋追加6判定が成功し、全行bit比較も通過しました。撤回案で失敗したspaces／「あ」420／Latin／Hebrew／Arabic／bidi混在／段落属性も成功しました。mixed420は2,248.797ms（検査decoder131.934ms含む）、worker実時間2,008.329ms。CoreText作成累積3,171.967ms、ink累積780.871ms、CF substring累積452.669ms。これは復元処理の単体観測で、実RN全体8秒の成功ではありません。別runnerや新hostとの差を性能改善と断定しません。

同じsourceのGitHub JS job115613701632は766 PASS／FAIL0／SKIP0、Android source job115613701644も成功。export Pods job115613701452とAndroid job115613701590は、4部品それぞれのcompile stepを実行して成功しました。実RN job115613701309も完了し、4成功・420文字timeoutでfailureでした。完了結果・画像・traceは§71.2です。workflow変更で起動した各jobは、scope skipと実compile／実行結果を区別して確認しました。

### 71.2 復元後の実RNは4ケース成功・420文字は未解消

source562e6a38／[run38490317258](https://github.com/MassyuRed/Cocolon/actions/runs/38490317258)／実RN job115613701309はfailureで完了しました。essay_paragraphs 650.189ms、quote_unicode 545.958ms、declaration_no_brand 1,135.125ms、saved_essay_canvas 408.752msの4ケースはnative_checkedです。4件ともbody_preserved／native_canvas_valid=true、native_textsが選択行＋任意brandingと一致し、PNGはessay／savedが1080×1350、quote／declarationが1080×1920です。華恋が4枚を開き、本文・段落・欠け・余白・brandingを確認しました。全5件canSave/canExport=falseを維持しています。

420文字は9,227.129msでmeasurement_timeout、size3、body_preserved=trueですが、native_canvas_valid=null、最終inspectionの配列は空、PNGなし、capture_error=trueです。48／44／40／36ptの全候補は各88,410行・11,381代表値が返り、native呼出1,791.996／3,870.271／3,593.161／3,328.496ms、adapter1,990.864／4,014.835／3,730.178／3,460.558msでした。queue待ちを含む呼出時間を合算しません。

B9は48／44／40ptでfit=false（133.912／98.720／95.513ms）、36ptでfit=true（174.146ms）です。stateはplanning1 2,244.403ms→planning2 4,238.594ms→planning3 6,185.723ms→measuring3 7,984.063ms→unavailable3 9,202.122ms。reportのplan欄はnullですが、traceでは36ptのfit成立と実Text計測開始まで進んでおり、「plan未成立」とは扱いません。trace上では7,984.063msにmeasuringを観測し、8秒付近まで候補処理を要しました。traceは別起点のperformance.nowと20ms間隔の観測、実deadlineはCard mount時のDate.nowに基づくため、差を厳密な残り時間とは扱いません。geometry_checked／native_checkedへは到達していません。timeout通知までの遅れの内部原因は未確定です。deadlineの延長や遅延結果の採用は行っていません。

artifact11862032995（56,533,434 bytes、期限2026-10-21T00:47:28Z）のZIP SHA256 `a2692cf793bbf088b25eb36ff9e6c3e1e4614f46d4696781f598b07d6e0d1e6d` とresults.json SHA256 `9143012b454509ee0973fac0fe5c8d7365ef5d4ff5c00dee3c1795cc5b5a256b` を照合しました。§71.1のnative69・JS766・Android source・export Pods／Androidは成功ですが、workflow全体はこのRN jobの失敗により成功ではありません。これはiOS simulator上の実RN検証であり、物理実機の受入れや正式保存の完了ではありません。

次の設計では、計測対象の文字列と前後文脈を実際に描画する行と一致させることを明記します。全候補先行計測の処理量を見直す際も、owner／native-JS境界／全候補契約／5doubleのbit比較基準を先に整理し、既存の比較を緩めて速度だけを採用しません。本文・段落保持、離散font順、4worker上限、8秒、最終inspectionを維持します。正式renderer供給→保存直前fit→同じpreview/tokenの通常初回保存→実機受入れは未完了です。失敗した2案は撤回済みで、現行nativeはbaseline071f3d8と同一です。

## 72. 2026-10-14 JST — 最終描画検査の逐次bridge待ちを削減

source `f49238acc8a94f4560af4918effa31b428919c9f` は `components/piece/PieceVisualCard.js` と `tests/piece-v2-renderer.test.js` の2pathです。旧実装は選択された行とbrandingの検査を一つずつawaitし、前行のnative応答が返るまで次行を依頼できませんでした。同じmeasurement snapshotの全node・generation・期待本文・box・lineEndsを先に収集し、Promise.allで依頼します。native処理は両OSとも既存UIManagerのUI block上で実行するため、UIKitを別workerへ移しません。

全検査結果の順序と各result validator、全件完了前の非表示、1件でも失敗した場合の全体拒否、current／元の8秒deadline／setState直前の再照合を維持します。全候補88,410行の独立substring計測、5doubleのbit比較、v3転送、B9、4worker上限、48→44→40→36pt、本文・段落、canSave/canExport=falseは変更していません。これは候補処理自体を減らす変更ではなく、§71.2の約7,984ms時点まで候補側に費やす問題が解消したとは未確認です。

追加2件は、全検査が応答待ちより先に依頼されること、逆順完了でも行順を保持して最後の結果まで隠すこと、先頭待機中の後続rejectで全体拒否し後着成功で復活しないことを確認。既存のdeadline・unmount・入力差替え・計測snapshot変更の検査も保持。local対象55 PASS、既存14ファイル全体806 PASS／FAIL0／SKIP0（Node24.19.0／TypeScript5.2.2）。CIの既存13ファイルとの件数差はinitial-save-hostの38件です。同環境の別担当が実差分をread-only確認し、華恋が原典と差分・反映2pathのremote全文・親head・changed pathsを照合しました。別model reviewとは扱いません。

[run38495258157](https://github.com/MassyuRed/Cocolon/actions/runs/38495258157) のJS job115629460888は768 PASS／FAIL0／SKIP0、Android source job115629460943は実compile成功です。phase6-contract-guards run38495258123も成功。export Pods／Androidは対象変更なしでcompile stepがskipされ、新しい実compile証拠へ加点しません。native job115629460966も69 PASS／FAIL0／SKIP0で完了しました（全行bit比較を含む）。mixed420単体は1,923.468ms、worker実時間1,686.725ms、検査decode154.717msでした。異なるrunの計測時間差を今回の性能改善へ換算しません。実RN job115629460856も4成功・420文字timeoutでfailureとして完了しました。結果と画像確認は§72.1です。今回の差分を420文字解消や確定した速度改善値へ換算しません。sourceは上記commitに固定します。正式renderer供給→保存直前fit→同じpreview/tokenの初回保存→物理実機受入れは未完了です。

設計調査で、全候補の独立行を維持したまま、実測advanceがcontentWidthを超えた候補を明示的な幅超過として返す案を確認しました。B9の幅はmax(advance,right)-min(0,left)でありadvance以上なので、幅超過拒否には文字幅の単調性・font比例・前後文脈の仮定は不要です。ただし、この案は幅超過行のink計測を省くため、全行5doubleと未使用行の不正inkも拒否する現行v3契約を変えます。未採用・未実装です。現行検査を削除・緩和せず、候補契約・比較範囲・必要な判断を先に具体化する必要があります。過去profileでink計測はCoreText作成より小さく、この案でも8秒解消は保証できません。batch／suffix再利用は復活させません。

この未採用案を評価する場合も、同値の範囲は「旧v3の全行が有効で、両方式が期限内に計測を完了した入力」に限られます。native要求・返却table・B9のcontentWidthを同じ有限正値に固定し、advanceのNaN／±Infinity／負値を拒否した後にstrict advance>widthだけを分類します。advance=widthはink取得を残し、既存の0.5許容差を転用しません。overflowを偽の0／Infinityのinkへ変換せず、明示状態とadvanceの矛盾を拒否します。全範囲・順序・参照・代表値使用・バッファ検証を維持し、B9のfits／protectViewpoint／wrapSolutions／minimumMeasuredLineCountの全4経路で状態を扱います。比較は各幅判定、fit/null、font、行本文、段落、gap、総高さ、同点時選択まで必要です。全文glyph、独立substringの属性／空の前後文脈、4worker、元deadline、CTLine解放、Androidの既存呼出し互換も維持対象です。幅超過行の非空白null ink／非有限ink／逆転inkに対する旧拒否は省略後に保証できず、選択行の最終inspectionでも取り戻せません。これを現行契約不変の最適化と称しません。

初回保存の読取り確認では、Cardの同一mount／generation／plan／inspectionを同じpreviewとvisualTokenへ結ぶ証拠の受渡しが未接続、InputScreenの正式isSaveAdmitted供給も未接続です。native_checkedだけを許可へ昇格しません。visualTokenだけが替わる場合は現行measurement keyが同じになるため、将来の証拠接続ではtoken変更でも旧証拠を必ず失効させます。今回この経路の製品変更はありません。

次の最小接続案（未採用・未実装）は、Cardが現在の同一mount/token/generation/plan/inspectionを照合できるローカルhandleを供給し、Modalがhandleと状態変更を渡し、InputPieceActionAreaが現在preview/tokenおよび正式supplierを合わせて既存の同期isSaveAdmittedを判定する形です。InputScreenの正式supplier供給元と採用family/version/platformの対応は未決です。prototypeの版文字列を許可リストに書くだけでは成立しません。LongText §§6–8は保存前の選択候補text＋recipe＋target profileのfit検証を要求しますが、毎回全native計測を再実行するとの明文はありません。有効snapshotの現在性照合という案を、正式renderer採用・実機受入れ完了と混同しません。handleの本文・行文字列・native nodeを保存bodyや永続receiptへ追加しません。

必須前提・作業rule・恒久incident・全体設計01系・全ファイル地図・Piece現行map／manifest・PCE5・最新weekly20261010 §5.5と12/18目標・添付前回txtを確認。System Context prepareはshallow checkoutの祖先照合で停止し、管理入口が許す原典直接読取りで継続しました。生成contextの成功や全文全repo監査は主張しません。STRUCTURE_MAP_DELTA_NONE（既存Cardの検査呼出し順のみ）。default OFF、Draft/open/unmerged、DB/env/deploy/署名/配布/main merge効果0を維持します。

### 72.1 実RN完了 — 4ケースの描画を確認、420文字は候補計測中にtimeout

sourcef49238ac／[run38495258157](https://github.com/MassyuRed/Cocolon/actions/runs/38495258157)／実RN job115629460856はfailureで完了しました。essay_paragraphs 1,902.520ms、quote_unicode 631.281ms、declaration_no_brand 345.065ms、saved_essay_canvas 1,205.142msの4ケースはnative_checkedです。body_preserved／native_canvas_valid=true、native_textsが選択行＋任意brandingと一致し、inspection数は順に6／4／5／6です。PNGのessay／savedは1080×1350、quote／declarationは1080×1920。華恋が4枚を開き、本文・段落・欠け・余白・brandingを確認しました。全5件canSave/canExport=falseです。

420文字は8,100.109msでmeasurement_timeout、size3。48／44／40ptは各88,410行・11,381代表値が返り、native呼出2,530.129／4,658.188／3,594.676ms、adapter2,700.742／4,797.367／3,736.438msでした。queue待ちを含む時間を合算しません。36ptはreport採取時にnative／adapterともpendingで、B9未実行。48／44／40ptのB9は110.499／103.093／124.229msでいずれもfit=falseでした。stateはplanning1 2,950.828ms→planning2 5,043.914ms→planning3 6,954.630ms→unavailable3 8,043.447msです。選択plan／最終inspection／PNGはなく、body_preserved=falseは完成planがないためのharness判定、capture_error=trueです。本文の削除を行ったという記録ではありません。

今回の420文字は最終inspectionへ到達していないため、検査依頼の一括化だけでこの残件が解消したとは扱いません。前回§71.2は36ptのfitまで到達しましたが、今回との別runner・別実行の時間差を改善／悪化の因果と断定しません。8秒を延ばさず、次は最終検査前の候補計測量・返却／復号を減らす設計を優先します。§72のv4案は契約変更を伴う未採用案で、現行5double／全行比較を黙って変更しません。

artifact11864476166（55,431,860 bytes、期限2026-10-21T01:40:49Z）のZIP SHA256 `a607ee49316877c4879950aa23d0aa6a5789832d86c594312eba0d91339d110e` とresults.json SHA256 `3a6e91aa60def5411c355da05fe82c2c1b18e4f2286cc3f808f78ed3a7b414b7` を照合しました。native69／JS768／Android source／phase6 guardsは成功、export Pods／Androidはscope skip、workflow全体はRN failureです。物理実機受入れ・正式renderer供給・保存直前fit・通常初回保存は未完了です。

## 73. 2026-10-19 JST — P-W1保存前fit接続の実測確定（通常保存は未完了）

最新weekly20261017の§1.5／§5.6とREADMEの10/19追記を本線にします。添付の旧checkpoint06935d2にあるiOS44停止は現行の未完了箇所ではなく、§71–72でnative69完走を確認済みです。現在の未完了条件は混在420文字の全体8秒・最終inspectionと、正式renderer供給→同じpreview/tokenの保存前fit→通常初回保存・同owner再表示です。性能修正と保存接続をP-W1の内部工程として扱い、小さな検査成功だけを通常保存の完成へ数えません。

| start field | current actual |
|---|---|
| product_destination | 保存済み入力からPieceを全文のまま描画し、同じ候補を明示保存して同owner履歴・詳細へ戻す |
| current_gate_or_subgate | weekly20261017 §5.6 P-W1（10/19–22、10/20方式判断） |
| exact_work | 全候補契約内の420文字処理短縮と、既存Card→Modal→hostの保存前fit接続 |
| scope_classification | LEVEL_2 |
| approval_or_delegation_basis | 今回のPiece継続指示＋rule18 §11.3 standing delegation。§0のPiece Pro例外適用 |
| execution_owner | 華恋（system明示GPT-6 Astra Pro）。同環境補助担当はread-only、統合・編集・GitHub反映はroot |
| success_credit | TECHNICAL_CREDIT。正式採用・稼働・物理実機の商品受入れは別結果 |
| completion_condition | 既存全行5double bit比較69件と同じDebug実RN5件の本文／inspection／PNG／8秒を確認し、同一候補の現在性を保存直前まで接続。未供給の正式admissionはtrueへ代入しない |
| stop_condition | 数値不一致なら方式撤回。本文・候補契約・品質・公開効果の変更が必要なら既存委任を超えて実行しない。同じ失敗案の再実行や補助台帳の増殖は行わない |
| prohibited_scope | 全行・5double・不正ink拒否・48→44→40→36pt・4worker・8秒の緩和、batch/suffix typesetter再利用、prototype版文字列だけの正式昇格、DB/env/deploy/署名/配布/main merge |
| next_product_read_or_mash_decision_point | 同じ5画像の実描画確認。正式supplierは実装/version/platform/asset・catalog互換と既存設定経路を具体化して採用判断を分離する |
| current_source_test_receipt | source76afe964内のnative baseline blob4dbe6cb1c50f216acad2a2d3f091ca5c0a1bddf8、既存native69 oracle／JS renderer・wrap、§72.1 run38495258157 |
| current_docs_and_heads | 全体設計01／全file地図01A–C、Piece map／manifest／PCE5、最新weekly20261017。Cocolon PR30 head76afe96481b2b78ec21b8f899c9b7a5be956a19d、API PR3 heada536e50ee284785f585ac73329ef2947dca8bba9 |
| affected_current_structure_maps | current_structure/02_piece_current_structure.md。今回native内部修正はSTRUCTURE_MAP_DELTA_NONE。後続のcomponent責任接続は同じwrite unitでmapへ反映 |

必要性はOBSERVED_BLOCKER_MINIMAL_FIXです。現行実RNでは420文字が36pt候補待ちでtimeoutするため、既にprofileで観測した全文substring作成の反復を直接減らします。既存69／実RN workflowを使い、新helperや新workflowは作りません。見込む検証は既存CI一回（ビルドを含め約20分）、新しい有料サービス・Mash操作は追加しません。既存GitHub Actionsの課金有無・金額は未確認です。

今回のnative差分は各worker専用のmutable attributed candidateを持ち、同じ開始位置から末尾だけ伸びるときに完全属性の追加区間をappendするものです。開始位置変更時は候補全文から作り直します。各候補のCTLineCreateWithAttributedStringは毎回新規、両bounds取得後に解放し、その後だけbufferを更新します。worker間でmutable storageを共有しません。全候補表・属性dedup・v3・5double・B9・元deadlineは不変です。CoreText行作成自体を減らす方式ではなく、8秒解消はまだ未確認です。

華恋と同環境read-only担当が元blobとの差分・所有期間・属性保持を確認。localのrenderer／measured-wrap 2suiteは終了code0です。iOS bit同値・実RN性能の代用にはしません。native sourceとこのcheckpointを既存PR30へ反映し、既存CIで検証します。正式renderer supplierと通常初回保存は現時点で未完了です。

必須前提・作業rule・Karen-Diary・恒久incidentを確認。System Context prepareは今回のsparse materializationにtools.cocolon_contextがなくModuleNotFoundErrorで未成立、管理入口が許す原典直接読取りで継続しました。生成context成功や全repo本文監査は主張しません。default OFF、Draft/open/unmerged、DB/env/deploy/署名/配布/main merge効果0を維持します。

### 73.1 候補buffer版の実測結果 — native69成功、混在420文字は未解消

native source `b3fdafaf465b0fc298bcf0f230f844db5f375bc5`／[run39171059794](https://github.com/MassyuRed/Cocolon/actions/runs/39171059794) は、native job117804017059で69 PASS／FAIL0／SKIP0（全行5double bit比較を含む）、JS job117804016923とAndroid source job117804017072も成功しました。export Pods／Androidのjobは成功表示ですがcompile stepはscope skipで、新しい実compile証拠にはしません。

mixed420単体は1,682.738ms、worker実時間1,434.249ms、検査decode155.906ms。CoreText作成累積2,138.849ms、ink累積508.629msでした。CF substring counter16.571msにはappend／mutable copyの全費用が含まれないため、文字列構築全体の費用とは扱いません。別runnerの時間差を今回差分の改善量へ換算しません。

実RN job117804017087はfailure／exit65で完了。essay_paragraphs 1,159.016ms、quote_unicode 1,617.194ms、declaration_no_brand 379.459ms、saved_essay_canvas 2,368.189msの4件はnative_checked、body_preserved／native_canvas_valid=trueです。inspectionは6／4／5／6件、行本文＋任意brandingとnative textが一致。PNGはessay／savedが1080×1350、quote／declarationが1080×1920。華恋が4枚を開いて本文・段落・欠け・余白・brandingを確認しました。成功4件のcapture_errorはfalse値ではなくキー欠落です。

420文字は8,332.374msでmeasurement_timeout、size2。48／44／40ptの候補は各88,410行・11,381代表値を返し、native2,593.324／5,088.231／4,912.878ms、adapter2,763.396／5,289.584／5,144.215msでした。待ち時間を含む呼出しを合算しません。B9は48／44ptのみ完了し、107.031／138.359ms、両方fit=false。40ptはadapter完了記録があってもB9完了なし、36ptはnative／adapterともreport時pendingです。stateはplanning1 3,052.320ms→planning2 5,653.468ms→unavailable2 8,058.122ms。最終inspection／選択行／PNGなし、native_canvas_validはキー欠落、capture_error=trueです。body_preserved=falseは完成planがないためのharness判定であり、本文を変更・削除した記録ではありません。

artifact12153037478（56,908,730 bytes、期限2026-10-25T22:30:21Z）のZIP SHA256 `3317dd1e3d56a1552b11a70c271acdfaca26f32806e79a7c783265bcced72a9b` とresults.json SHA256 `076b8e7feeb059b1e2500eb238145189a245b54c5c35042d6ed77f3157f23599` を照合。ログの5reportとartifact JSONは完全一致しました。全5件canSave/canExport=false。単体69成功を実RN全体8秒・通常保存の完成へ換算しません。

### 73.2 同じ描画の保存前fitを既存hostへ接続

このwrite unitは既存製品4path、JS検査4path、既存実RN検査2pathと入口／current map／manifestの3pathです。新しいhelper・workflow・保存APIは作りません。

- `PieceVisualCard` が同一mount・preview token・binding・generation・B9 plan・最終inspection・全Text node・canvasを照合するローカルhandleを供給します。公開fieldは同期の`isCurrent(preview, token)`だけ。本文・行・node・計測値を外部へ渡しません。native_checkedの完了前／期限切れ／変更後は不成立で、getterからnative処理や通知を起動しません。ハッシュ・expiry・完全artifact keyの検査を保持します。
- tokenだけの変更でもmeasurementを作り直し、論理canvasのkeyを替えてprobeをremountします。同じgeometryでonLayoutが再通知されない問題、token A→B→Aで旧Promiseや証拠が復活する問題を防ぎます。listener変更時の取消通知が親を再変更する場合も、新listenerとdisplayを照合し直してから供給します。
- `PiecePreviewModal` はstable callbackをCardへ渡します。`InputPieceActionArea` がローカルfitと外部の正式supplierを両方確認し、render・押下・entropy生成後・既存controllerの保存意図確定前で現在性を再照合。旧handleの取消通知は新handleを消さず、旧buttonは新handleを借りません。保存HTTP body・同一idempotency key・owner境界・結果不明時の同一要求再試行・同owner詳細経路は既存処理を維持します。
- `piecePreviewModel.js` のSHA-256内部だけを、blockごとの配列確保と小関数呼出しの反復を減らす形へ変更。全64wordをblockごとに上書きし、digest間に共有しません。UTF-8 bytes／canonicalization／署名対象／検証回数／expiryは変更せず、ハッシュcacheや検証省略を入れません。Node crypto独立比較164入力と不正surrogate5入力を既存検査内で確認しました。

復元後のlocal14ファイルは833 PASS／FAIL0／SKIP0（Node24.19.0／TypeScript5.2.2）。initial-save-modal内でも実行するhost43件を別起動した重複があるため、既存CI13ファイルとの対応件数は790です。対象renderer71、host43、modal86（host43を含む）が成功。これはnativeをsyntheticにしたsource検査であり、通常保存の実端末操作の証拠ではありません。

既存実RNの同じ5fixtureへ、previewごとに固定したtokenとstable callbackを渡し、実handleの現在性・別token拒否・公開keyをreportへ追加しました。savedにも同じcallbackを渡し、handleが実際に無いことを負例として確認します。元の2frame安定確認・本文／inspection／PNG／全5件・8秒・canSave/canExport=falseを保持し、handleの照合時間もelapsed_msへ含めます。このsourceの実RNとnative69の再検証は完了し、結果を§73.4に確定しました。

同環境read-only担当による原典・実差分reviewと華恋の確認を実施。別model reviewや物理実機受入れとは扱いません。構造責任の追加をcurrent map§65.21とmanifestへ同時反映します。

### 73.3 通常初回保存の残件と稼働境界

保存前fitのローカル接続は上記sourceに実装しましたが、`InputScreen` からの正式`isSaveAdmitted` supplierは未供給です。prototype version一致はこのhandleが検証したprofileとの対応であり、正式renderer採用ではありません。Cardは画像レイアウトの確認表示を担当し、利用可否の説明はModal／hostに置きます。

API PR3 heada536e50ee284785f585ac73329ef2947dca8bba9の既存candidate compositionを確認しました。通常の新規preview発行は`piece_read_quota_v2(uuid)`が必要です。2026-10-19 JSTにSupabaseのmigration履歴とpg_proc／pg_namespaceだけをread-only照合したところ、この関数と`piece_mutate_preview_visual_v2`はpublic schemaに同名overloadも含め存在しませんでした。個人のPiece本文・保存行は読みませんでした。

未適用sourceはAPIの`supabase/migrations/20261010_005_piece_v2_quota_read.sql`と`supabase/migrations/20261010050940_piece_v2_preview_visual_change.sql`です。後者は見た目変更PATCH用で、初期recipeのまま保存する経路の必須関数ではありません。保存POST自体は既存M4の`piece_save_v2`でquota再照合・消費を行います。quota読取り成功だけを保存許可へ置換しません。

P-W1の未完了は、420文字の全体8秒と最終描画、正式renderer supplier、必要DB関数・明示candidate compositionの稼働、同じ候補の明示初回保存→同owner履歴／詳細再表示です。default applicationはlegacy、bootstrapの8flagは正式renderer供給ではなく、versionやready fieldを追加する変更は行っていません。P-W2の画像保存／共有3形式とP-W3の物理実機・実画像受入れも未完了です。weekly10/17§5.6を本線とし、過去の全device準備をsource作業の前提へ戻しません。

今回の委任で進めるsource／検査／既存PR反映と、DB適用・env・deploy・署名・配布・main mergeの稼働効果を区別します。後者の実行は0。Draft/open/unmerged・default OFFを保持し、未供給の正式admissionをtrueに代入しません。

### 73.4 source90cbd705の実測確定 — Cardの保存fitを3fixtureで確認、420文字はtimeout

source [90cbd705f2d344906eac7959c63e2fa1b2b06253](https://github.com/MassyuRed/Cocolon/commit/90cbd705f2d344906eac7959c63e2fa1b2b06253)／[run39177257042](https://github.com/MassyuRed/Cocolon/actions/runs/39177257042) を確認しました。JS job117822371689は790 PASS／FAIL0／SKIP0。native job117822371774の実出力は69 PASS／FAIL0／SKIP0で、mixed420全行とuncached oracleの5double bit比較も通過。Android source job117822371720はcompile成功、同headの既存guard workflow5本も成功しました。export Pods／Androidのjobは成功表示ですが、依存変更がなくcompile stepはscope skipです。実RN job117822371654は下表の420文字失敗によりexit65、workflow全体もfailureです。

native mixed420単体2,486.745ms、worker実時間2,261.017ms、CoreText作成11,382回／累積4,262.470ms、ink累積790.779ms、検査decode134.437msでした。全候補88,410行から完全UTF-16＋属性が同じ11,381代表値を処理し、各独立行のCoreText作成と5doubleを維持しています。累積時間とworker実時間を合算せず、別runnerの時間差をbuffer変更やSHA変更の効果量と断定しません。

| 実RN fixture | phase | elapsed_ms | inspection件数 | 現在tokenのfit | 別tokenのfit |
|---|---|---:|---:|---|---|
| essay_paragraphs | native_checked | 944.133 | 6 | true | false |
| quote_unicode | native_checked | 725.929 | 4 | true | false |
| declaration_no_brand | native_checked | 308.555 | 5 | true | false |
| essay_max420 | unavailable / measurement_timeout | 8284.257 | 0 | false | false |
| saved_essay_canvas | native_checked | 4087.257 | 6 | false | false |

成功したpreview3fixtureでは、実際にmountしたCardが公開したhandleのkeyはisCurrentだけで、同じpreview/tokenを受理し別tokenを拒否しました。savedカードには同じcallbackを渡してもhandleはありません。この実RN harnessはCardを直接mountするため、Modal／host／InputScreenを通る実RNの通常保存導線の証拠ではありません。Card→Modal→hostの接続と保存境界の失効条件は§73.2のJS source検査で確認しています。3形式の全入力・全端末の合格へ一般化しません。全5件state_can_save／state_can_export=falseです。

成功4件はbody_preserved／native_canvas_valid=true、全inspectionでwrapViolation=false、overflow=false、glyphCheck=no_missing_observed。華恋が4枚を開き、本文・段落・文字欠け・余白・brandingを確認しました。essay／savedは1080×1350、quote／declarationは1080×1920です。4 PNGのSHA256は§73.1の対応画像と同一でした。成功4件のcapture_errorはキー不在です。

420文字はsize_index1でtimeout、完成したB9は48ptの1回（132.438ms、fit=false）だけでした。48ptはnative4,215.968ms／adapter4,378.582ms。44ptはnative7,952.272ms／adapter8,186.087msでreport時には解決済みですが、B9完了記録はありません。40ptはnative／adapterともpending、36ptはtraceに要求記録がありません。48／44ptは各88,410行・11,381代表値・UTF-16長420・v3です。stateはplanning1 4,623.575ms→unavailable1 8,034.571ms。queue待ちを含む呼出時間を合算しません。rows／inspectionは空、PNGなし、capture_error=true、native_canvas_validキーなし。body_preserved=falseは完成した選択planがないharness判定で、本文を削除した記録ではありません。8,284.257msを描画成功時間や改善証拠にはしません。

artifact12155650678（60,195,947 bytes、期限2026-10-25T23:59:13Z）のZIP SHA256は `44de1b7fb340d17951a526fcd4907823a66b8ffe97f05e50fc3845d92ab295a3`、results.json SHA256は `a4dcfb2545237d767e0194305eb4a5d9b4bab45f280c41fc47734a7cb0821c6d`。ZIPをGitHub digestと、JSONを実行ログ5reportと照合しました。420文字PNGはartifactにありません。

現在のprofileと実装から、現行の全候補・全行5double契約を維持したまま8秒を解消できる追加案は確定していません。既に代表値の重複除去・v3転送・worker内文字列appendを実装済みで、失敗したbatch／suffix再利用や同じsourceの再実行へ戻しません。§72の幅超過行ink省略は契約変更を伴う未採用案のままです。P-W1の通常初回保存・同owner再表示、正式renderer供給と稼働、420文字の最終描画、P-W2／P-W3は未完了です。

### 73.5 次のDB適用候補を2本に限定して具体化（承認前記録。適用結果は§73.6）

対象はSupabase `cocolon-project`（project ref `oeahmpmigszggnkyiivq`）。API sourceは `a536e50ee284785f585ac73329ef2947dca8bba9` に固定し、既存SQL全文と依存条件を確認しました。

| 既存SQL / blob | 適用内容と必要な経路 |
|---|---|
| [20261010_005_piece_v2_quota_read.sql](https://github.com/MassyuRed/mashos-api/blob/a536e50ee284785f585ac73329ef2947dca8bba9/supabase/migrations/20261010_005_piece_v2_quota_read.sql) / 3db5ed79c2ebca7e3c2b83825de13a98be7ff0df | public.piece_read_quota_v2(uuid)を追加。新規preview発行前にownerのtierと当月保存消費数を読む。保存の許可・消費処理の代替ではない |
| [20261010050940_piece_v2_preview_visual_change.sql](https://github.com/MassyuRed/mashos-api/blob/a536e50ee284785f585ac73329ef2947dca8bba9/supabase/migrations/20261010050940_piece_v2_preview_visual_change.sql) / 585e4e386e7afb2b06b363f8c2e0108699796582 | public.piece_mutate_preview_visual_v2(uuid,uuid,bigint,jsonb,jsonb,text,text,jsonb)を追加。後のvisual PATCH呼出しで未保存private previewのrecipe／hash／revisionを更新。初期recipeのままの保存に必須ではない |

両関数はSECURITY DEFINER／固定search_pathで、EXECUTEはservice_roleだけです。同名関数が一つでも既存ならSQLのguardで停止し、CREATE OR REPLACEは行いません。SQL適用自体は既存Piece本文や保存行を書き換えず、table／RLSを変更しません。visual関数の後の呼出しではowner・元データ・revisionを照合し、未保存previewの見た目を更新しますが、本文・expiry・quota・保存済みrecordを変更しません。

read-onlyのmetadata照合で、適用role条件とservice_role、依存する通常table6個、piece_records／piece_quota_consumptionsのRLS有効・強制、必要な既存関数5個のsignatureを確認しました。既存M4 migration4本を維持し、再適用しません。これは適用前提の確認で、稼働中candidate compositionや通常保存の受入れではありません。個人のPiece本文・行の読取りとlive applyは0です。

rule18 §0(4)／§11.3は新規DB migrationを今回のsource／test／docs委任に含めないため、次の個別承認候補は「この2本を対象projectへ適用し、migration履歴・関数signature・EXECUTE権限・既存M4の維持をmetadataで確認する」までです。正式renderer採用、flag／env、deploy／activation、署名／配布／main mergeはこの承認候補に含めません。2本の適用だけで通常保存が完成するとは扱いません。

### 73.6 2026-10-19 JST — 承認済SQL2本を稼働DBへ適用し、metadata確認を完了

Mash様がこの会話で§73.5の既存SQL2本と適用後metadata確認を「進めていいよ」と明示承認しました。対象・原文・現行DBを再照合し、華恋が1本ずつ各1回適用しました。両apply_migrationはsuccess、適用後照合も成功です。新しい承認を重ねて求めず、承認範囲を実行しました。

| start field | fixed scope / actual result |
|---|---|
| product_destination | P-W1の通常preview発行と未保存previewの見た目変更に必要なDB関数を成立させる |
| current_gate_or_subgate | weekly20261017 §5.6 P-W1。§73.5の未適用2関数 |
| exact_work | pinned SQL2本をcocolon-projectへ適用し、定義・ACL・履歴・既存metadataを照合 |
| scope_classification | LEVEL_3 |
| approval_or_delegation_basis | この会話でのMash様の2本限定明示承認。rule18 §0のPiece Pro例外 |
| execution_owner | 華恋 / GPT-6 Astra Pro / CHAT_PRO_OK。同環境補助担当はSQLのread-only確認のみ |
| success_credit | TECHNICAL_CREDIT。未適用DB関数2件を解消。通常保存の製品受入れは未完了 |
| completion_condition | 原文との関数本文・設定一致、client EXECUTE拒否、追加履歴2件、既存metadata不変、GitHub記録の読戻し |
| stop_condition | apply失敗・応答不明・既存同名関数・metadata不一致なら現状を確認。原文変更・盲目的再適用をしない |
| prohibited_scope | 他migration、private Piece行の操作、table/RLS/default ACL変更、renderer採用、env/flag/deploy/署名/配布/main merge |
| next_product_read_or_mash_decision_point | 420文字の最終描画、正式renderer供給、明示candidate runtime、通常保存→同owner再表示が残る |
| current_source_test_receipt | API a536e50ee284785f585ac73329ef2947dca8bba9の§73.5の2blob。今回は製品code/test/SQL原文変更0 |
| current_docs_and_heads | 適用前Cocolon head e90360d94bd22a3062005b5e6b5c06498c2ea3ad。全体設計・全file地図・rules・weekly・現行文書11件のlocal全文が同headのblobと一致 |
| affected_current_structure_maps | current_structure/02_piece_current_structure.md §65.21.2、manifest v76 |

対象projectは `cocolon-project` / `oeahmpmigszggnkyiivq`、適用前statusはACTIVE_HEALTHY、Postgres 17.4.1.074、適用ownerはpostgresです。SQL原文は§73.5のpinned sourceと同一で、過去のSOURCE-ONLY commentも含め改変しませんでした。今回の明示承認がこの2本の適用許可です。

| migration version | name | 追加関数 |
|---|---|---|
| 20261019021118 | piece_v2_quota_read | public.piece_read_quota_v2(uuid) |
| 20261019021121 | piece_v2_preview_visual_change | public.piece_mutate_preview_visual_v2(uuid,uuid,bigint,jsonb,jsonb,text,text,jsonb) |

適用後観測は2026-10-19T02:13:41.72847Z。両関数はそれぞれ1 signatureのみで、引数名・型・順序、plpgsql、RETURNS jsonb、SECURITY DEFINER、owner=postgres、関数本文が原文に一致しました。quotaはSTABLE、search_path=pg_catalog、row_security=off。visualはVOLATILE、search_path=pg_catalogで、row_securityの個別指定はありません。

両関数とも所有者の固有権限を除くACLはservice_roleのEXECUTEだけで、grant optionはありません。PUBLICの余分なACLなし、anon／authenticatedの実効EXECUTE=false、service_role=trueを確認。新しい2件のmigration履歴は各statements1件で、コメント・改行も含め承認SQL全文と一致しました。

既存の8件のmigration履歴は維持され、全体10件・Piece分6件になりました。既存Piece4本の再適用はありません。適用前後の既存9 function overloadの定義・signature・設定・ACL、依存6tableの列構成・ACL・RLS有効／強制・policy、24件のdefault ACLは一致しています。個人のPiece本文・行は読まず、新関数も業務入力で呼び出していません。今回のDDL自体は既存Piece行を書き換えません。

security advisorsは観測時刻を除く指摘内容が適用前後で同一で、今回の2関数による新規指摘はありません。既存のINFO59件／WARN44件は残存し、解消したとは扱いません。分類・参照URLはmanifestのlive_db_apply_20261019に記録します。今回の2本以外へ修正範囲を広げませんでした。

この適用で§73.3／§73.5の「quota／visual RPC未作成」は解消しました。新規preview発行前のquota読取りとvisual PATCHのDB定義が揃いましたが、明示candidate APIの稼働、実ownerによるRPC呼出し、正式renderer supplier、通常InputScreenからの保存→同owner履歴／詳細は未確認です。420文字は§73.4の8,284.257ms timeoutのままで、今回再実行していません。P-W2／P-W3の未完了も保持します。

今回の効果は新関数2個・migration履歴追加2件と既存3文書の記録更新です。製品source／test／workflow／SQL原文、env／deploy／署名／配布／main mergeは変更0。default OFF、Draft/open/unmerged、automatic_progression=falseを維持します。次はDB2本を再適用せず、P-W1の残る描画・正式供給・稼働・通常保存の条件へ戻ります。

## 74. 2026-10-19 JST — 保存確定後の機能停止から、同じ要求で結果を回収

P-W1の到達先は、通常の保存済み入力→本文・画像preview→明示保存→同じ本人の履歴／詳細です。全体設計01、全file地図01A〜C、current map、作業rulesと最新weekly20261017 §1.5／§5.6を再読し、前回添付記録と§73.6のDB適用を確認して再開しました。Cocolon開始headは`3e65a639df1388b771aa528a33e26022917e6757`、APIは`a536e50ee284785f585ac73329ef2947dca8bba9`。localで使用した既存fileはGitHub treeのblobと一致を確認しています。System Contextのprepareはrepository unavailableで未成立のため、同入口で許されたGitHub正本の直接読みに戻し、prepare成功とは扱いません。

| start field | fixed scope / actual result |
|---|---|
| product_destination / current work | weekly20261017 §5.6 P-W1。保存結果が不明でも別Pieceを作り直さず、同じ保存要求で結果を確認する |
| exact_work | server FEATURE_DISABLED後も同一owner・保存入力ID・元keyのbody-free save intentを保持し、fresh runtime復帰後の明示回収を修復 |
| scope / permission | LEVEL_2。Mash様の今回のPiece残件指示、Rule18 §0のPiece Pro例外と§11.3 standing delegation。既存§53・weekly §5.6.3・API既存回収契約内 |
| execution_owner | 華恋 / GPT-6 Astra Pro / CHAT_PRO_OK。補助担当はsource・設計・差分のread-only確認。書込／test／DB実行は主担当だけ |
| exact paths | 製品2: features/piece/PieceCreateController.js、screens/input/InputPieceActionArea.js。検査2: tests/piece-v2-state-models.test.js、tests/piece-v2-preview-display.test.js。既存記録3: この入口、current map、manifest |
| verification / completion | 修正前の原因再現、既存13file検査、同body/key回収と同owner詳細GET、旧flag・背景・選択変更・認証拒否の維持。GitHub反映後の変更集合／全対象内容照合とCIを確認 |
| STOP / prohibited | public contract／protected owner／新依存／稼働設定／新DB変更が必要ならその拡張を止める。renderer正式採用、全候補計測契約、API、env／flag／deploy／署名／配布／mergeを変更しない |
| credit | TECHNICAL_CREDIT。既存source内の保存回収欠陥を修復。実端末での通常初回保存やP-W1製品受入れへの換算なし |
| affected map | STRUCTURE_MAP_DELTA_NONE。既存controller／hostの内部lifecycle修復。新owner・wire・永続fieldなし。map §65.22に実結果だけを併記 |

### 74.1 原因と既存契約

API `ai/services/ai_inference/api_piece_v2.py`の`_OperationFeatures.wrap`はIOの前後に実効flagを検査します。保存commitの直後に停止すると、DB保存済みでも503 `PIECE_FEATURE_DISABLED`が返り得ます。既存の`ai/tests/piece_v2/db/test_b12_shared_preview_native.py::test_composed_save_recovers_committed_receipt_without_second_consumption`は、この場合も復帰後に同じbody/keyで同じpiece_id／consumption_idを回収し、追加消費をしない契約を持ちます。このAPI検査は今回は原文確認のみで、API testや業務RPCを実行していません。

RNの`runSave`はFEATURE停止をboundaryに保持しますが、従来の`setSaveAvailability`はboundaryがあると同一保存の保持を拒否していました。hostはbootstrapの新runtimeへ切り替わると一般disableへ落ち、save intent／keyを消していました。再開画面が保存入力の再確認へ戻るため、既に成立した保存の結果回収が途切れます。

### 74.2 修復した動作

| 状態 | 現在のsourceの動作 |
|---|---|
| 保存要求がFEATURE停止 | 元のbody-free要求／保存keyを保持。本文・画像を再表示せず、saveの操作種別を維持し、source GETやpreview POSTへ戻さない |
| 同じ選択でpreviewまたはsave flagがOFF | 停止を維持し、追加送信0。背景でもintentを保持 |
| 背景から戻るだけ／同runtimeのsave-only flag差分／stale true setContext | server停止は解除せず、追加送信0 |
| 同一owner・入力ID・元keyの新runtimeがpreview/saveともstrict true | 結果不明状態へ戻し、同じ保存要求での明示確認だけを可能にする。自動送信0 |
| 明示確認 | 元body・元保存keyを再送し、その都度既存Auth照合を通す。同じreceiptを受けたら既存navigationから同owner詳細GETへ進む |
| owner／保存入力ID／元key変更、一般disable、unmount | 元intentを破棄し、元の選択やflagへ戻しても復活させない |
| AUTH／CONFLICT等の既知拒否、再度のFEATURE停止 | 既知拒否を回収可能に格上げしない。再度のFEATUREは新たなruntime publicationを待つ |

hostは`boundRuntime`更新前のidentity差を、同saved selectionの`syncContext`枝だけから既存setterへ渡します。AppStateと同runtimeのflag変更はこのsignalを供給しません。AppRuntimeの既存strict readは最新bootstrap成功・loaded・非loading・errorなし・trueを要求します。サーバーのFEATURE応答を既知停止として使い、中間OFFがReactにまとめられたfresh ONでも回収できるようにしました。AppRuntimeContext自体やbootstrap wireの変更はありません。初回保存の正式supplierとlocal fitの二重確認も変更していません。

### 74.3 検証結果と残る製品条件

修正前sourceで追加の原因検査4件を実行し、controllerのsave種別保持1件と、preview OFF→ON／save OFF→ON／中間OFFなしの新runtimeというhost3件が意図したassertionでFAILしました。source修復後、追加3 controller／9 hostを含む既存13file合計802 PASS／FAIL0／SKIP0です。既存のstale true setContext検査は無変更で成功しました。同環境read-only差分reviewに重大指摘はありません。

local実行はNode24.19.0・TypeScript5.2.2。既定の子process方式は検査本文まで到達せずfile-level ERR_TEST_FAILUREとなったため、localは`node --test --test-isolation=none`で実行しました。これはCIの標準process実行結果とは区別します。途中の新testでAuth取得回数を各要求1回と予想したassertionは、既存APIの前後照合に合わず失敗したため、「回収時に新たな取得があり、全取得が同owner」を確認する形へ修正しました。製品Authの変更はありません。

host3分岐では、source GET→preview POST→503保存→新runtime→明示同body/key保存→receipt→同owner詳細GETを通し、詳細のpiece_text・text hash・visual_recipe・recipe hash一致を確認しました。追加source／preview要求や新保存keyは0です。React/RN/AppState/HTTP/Authと初回保存admissionは既存harnessの代替境界であり、画像・実機・実DBの保存成功ではありません。CIとGitHub読戻しは反映後に同節へ結果を追加します。

Supabaseのmigration一覧で§73.6の2本を含む全10件・Piece6件を再確認しました。今回は再適用・新migration・個人のPiece行読取り・業務RPC・設定変更は0です。420文字は§73.4の実RN8,284.257ms timeout・最終inspection／PNGなしを維持し、同sourceの再実行をしていません。通常初回保存の正式renderer supplier、明示candidate APIの稼働、実ownerの保存→再表示、P-W2／P-W3は残件です。

#### 74.3.1 GitHub反映・標準CIの完了結果

実装修復はCocolon Draft PR #30の[5c44b252f049a973de29b37f2fb8dba93548cca0](https://github.com/MassyuRed/Cocolon/commit/5c44b252f049a973de29b37f2fb8dba93548cca0)へ反映しました。親は開始head3e65a639、変更集合は§74の既存7pathだけで、新規file0。全7fileをGitHubから再取得し、準備した内容とblobの完全一致を確認しました。反映時headも5c44b252、Draft/open/unmergedです。

[Piece workflow run39197238380](https://github.com/MassyuRed/Cocolon/actions/runs/39197238380)はsuccessで完了しました。

| job / scope | 確認した結果 |
|---|---|
| piece-rn-contracts / 117882535797 | 標準`node --test`で802 PASS／FAIL0／SKIP0。Node24.21.0・TypeScript5.2.2。localのno-isolation実行と区別し、CIログ末尾の件数を確認 |
| piece-ios-source / 117882535723 | Objective-C++ source compileと実TextKit／CoreText単体検査成功。NATIVE_CHECKS=69 PASS=69 FAIL=0 SKIP=0。mixed420・複合属性・各script・queued fontを含む既存uncached5double一致を保持 |
| piece-android-source / 117882535888 | 既存Piece bridgeのcompile成功 |
| piece-ios-rn-canvas / 117882535818 | 描画source差分なしのscope判定で、実RN実行stepをskip。job successを実RNの描画成功とは扱わない |
| piece-export-pods / 117882535875、piece-export-android / 117882535778 | 依存／build差分なしのscope判定で、依存解決・実compile stepはskip |

既存guardはpush phase6 run39197238429、PR phase6 run39197249281、pytest run39197249264、read-only policy run39197249236、terminal Step7 run39197249245の5runすべてsuccessで完了しました。新workflow・手動再試行は0です。

単体69件の成功は全体8秒の描画受入れではありません。420文字の最新実RN結果は引き続き§73.4のtimeoutで、画像や最終inspectionは追加されていません。今回の最後の記録更新は入口／current map／manifestの既存3pathだけです。製品source／testは5c44b252のまま、DB／env／deploy／署名／配布／main merge／v4実装の追加効果は0です。

### 74.4 次の判断候補 — iOS preview専用v4の限定検証（承認前の候補記録。今回の承認と実行は§75）

現行の全候補・独立CoreText・5double・最大4worker・元8秒を維持した追加修正について、今回のread-only監査でも420文字を解消できる確かな案は特定できませんでした。既に完全属性dedup、v3 binary転送、worker専用buffer append、次font先読みを実装済みです。§72の幅超過行ink省略案を、次の限定候補として具体化します。これは現行契約への採用記録ではありません。

全候補の独立CTLineとadvanceの実測を残し、有限・非負のadvanceが要求幅Wを厳密に超える候補だけ、文字の描画範囲（ink）の取得を省く案です。現行B9の幅は`max(advance,right)-min(0,left)`でadvance以上のため、その候補は幅判定を通りません。advance==Wは従来どおりinkを取得します。幅単調性・font比例・文脈再利用は仮定しません。

| 限定項目 | 承認候補の内容 |
|---|---|
| 適用profile | 新しい明示`piece.rn_native_preview.prototype.v4`のiOS previewだけ。既存v3定数・保存済みv3・saved/export経路を維持。自動fallbackや版のsilent置換なし |
| native / wire | 同classに幅付きmethodを追加。全rangeのu32参照を保持し、代表値はtag0=advance+ink4double、tag1=width_overflow+advance。偽0／Infinity／null inkで穴埋めしない |
| 幅の束縛 | Card→adapter→native要求／返却→B9の有限正値Wを完全一致で照合。別幅の結果を再使用しない |
| B9 | fits、protectViewpoint、wrapSolutions、minimumMeasuredLineCountの4消費箇所でoverflowを明示的に幅不成立とし、full値だけを従来計算へ渡す |
| 維持する品質条件 | 全文・段落・grapheme順、font採用順／下限、全range、完全属性dedup、独立substring、全advance検査、選択行のink／最終Text inspection、元8秒、最大4worker、正式保存／export不可 |
| 承認対象となる差 | 旧v3は選択されない幅超過行でも不正inkがあれば全体拒否。v4はそのinkを取得せず、そこだけのnull／非有限／逆転異常を検出しない。最終選択行のinspectionではこの差は回復しない |
| 製品path候補 | ios/tempCocolon/PieceTextMetrics.mm、features/piece/pieceRenderer.js、features/piece/pieceMeasuredWrap.js、components/piece/PieceVisualCard.js、features/piece/pieceLayout.jsの既存5path |
| 検査path候補 | 既存tests/piece-v2-renderer.test.js、tests/piece-v2-measured-wrap.test.js、tests/native/piece-text-metrics-ios.mm、tests/native/piece-rn-canvas-entry.js、tests/native/piece-rn-canvas-fixtures.cjs。native判定追加が必要なときだけ既存.github/workflows/piece-rn-contracts.ymlの期待件数を同期。新workflow／checkerなし |
| 検証 | 元native69判定とuncached oracleを保持。全range／advanceのbit一致、full5doubleのbit一致、strict overflow分類、wire異常拒否、旧版の不正metric拒否を検査。有効v3が期限内に完了する入力に限りB9のfit／行／font／gap等の同値を比較。既存実RN5fixtureの全文・inspection・PNG・8秒を維持 |
| 採否 | source検証後の実RN限定確認で420文字が依然8秒を超えれば未採用として結果を記録。期限延長・worker増加・他の省略条件・batch／suffix復活へ広げない。速度改善や8秒達成を事前保証しない |
| 含めないもの | v4 saved/export対応、正式renderer supplier採用、API／DB／flag／env／deploy／署名／配布／main merge |

PCE5 Render Reproducibility §7〜8は計測方式の版識別と旧版互換を要求します。`pieceExport.js`は現在v3定数へ出力識別子を束縛するため、v4をsaved/exportまで広げる場合は別の変更scopeが必要です。今回の候補はpreview限定です。

Rule18 §0(4)／§11.3は新しい契約・品質条件の変更をsource修復のstanding delegationに含めません。幅超過行の不正ink検出を省く差はここに該当するため、v4の実装・限定実行はMash様の別承認を得てからです。ここまでのsource変更は§74.2の保存結果回収だけで、v4効果0・正式採用0です。

## 75. 2026-10-19 JST — 承認されたiOS preview専用v4を実装し、限定検証

Mash様がこの会話で「入口§74.4の範囲で、v4の実装と限定検証」を「進めていいよ」と明示承認しました。以下は最初のsource変更前に固定した作業範囲です。承認済みの同じ範囲を再承認待ちへ戻しません。開始時Cocolon headは`fab912241599d42a6c1706ab8cd29342666be990`、APIは`a536e50ee284785f585ac73329ef2947dca8bba9`で、両PRはDraft/open/unmerged。全体設計01、全file地図01A〜C、最新weekly20261017、rules、対象14pathを含む22fileのlocal原文と最新treeのblob一致を確認しました。

| start field | fixed scope |
|---|---|
| product_destination / current gate | weekly20261017 §5.6 P-W1。420文字を含む全文のpreview画像を元8秒内に最終検査まで成立させられるか、明示v4だけで検証 |
| exact_work / classification | LEVEL_3。全独立CTLine・全advance・全rangeを残し、有限非負advanceが要求幅Wを厳密に超えた候補のinkだけ省略するpreview専用v4 |
| approval / owner | この会話の§74.4限定明示承認。華恋 / GPT-6 Astra Pro / CHAT_PRO_OKが唯一の書込・test実行担当。補助担当は原典・設計・差分のread-only監査 |
| product exact paths | ios/tempCocolon/PieceTextMetrics.mm、features/piece/pieceRenderer.js、features/piece/pieceMeasuredWrap.js、components/piece/PieceVisualCard.js、features/piece/pieceLayout.js |
| verification exact paths | tests/piece-v2-renderer.test.js、tests/piece-v2-measured-wrap.test.js、tests/native/piece-text-metrics-ios.mm、tests/native/piece-rn-canvas-entry.js、tests/native/piece-rn-canvas-fixtures.cjs。native追加判定の期待件数同期だけ.github/workflows/piece-rn-contracts.yml |
| durable owners / affected map | この入口、Cocolon_Piece/manifest.json、Cocolon_前提資料/current_structure/02_piece_current_structure.md。版の明示分岐と幅付きwireを同write unitで地図へ反映 |
| version / width binding | piece.rn_native_preview.prototype.v4はiOS previewだけ。旧v3定数・saved/export・Android既存経路を維持。Card→adapter→native要求／返却→B9で有限正値Wを完全一致照合。fallback／二重実行なし |
| wire / consumers | 新measureCandidatesForWidth。代表recordはtag0＋advance／ink4double、tag1＋advanceだけ。全range u32参照を維持。fits／protectViewpoint／wrapSolutions／minimumMeasuredLineCountがoverflowを明示拒否 |
| accepted contract difference | v4では選択されない幅超過行のinkを取得せず、そのinkだけのnull／非有限／逆転異常を検出しない。旧v3の全ink拒否契約と同一とは扱わない。advance==Wはfull ink必須 |
| completion / verification | 元native69とuncached oracleを保持し、全range／advance bit一致・full5double bit一致・wire異常拒否・B9同値・版境界を追加確認。既存13JS suiteと実RN5fixtureの全文／inspection／PNG／8秒／canSave=false／canExport=false。GitHub反映・対象全内容・CI結果を読戻し |
| STOP / prohibited | 限定実RNで420文字が依然8秒を超えればv4未採用と記録し停止。期限延長・worker増加・追加省略・batch／suffix復活・同source再実行へ拡張しない。API／DB書込／flag／env／deploy／署名／配布／main merge／正式supplier／v4 saved・export対応は範囲外 |
| credit / next product decision | 検査通過だけはTECHNICAL_CREDIT。正式採用と通常初回保存の受入れへ換算しない。実測結果で採否を記録し、正式supplier・candidate runtime・通常保存→同owner再表示・P-W2／P-W3へ残件を接続 |

Supabaseのmigration一覧を再確認し、§73.6の2本を含む全10件・Piece6件を維持。今回のDB書込・再適用・業務RPCは0です。実装は§75.1、限定検証の確定結果と停止判断は§75.2〜75.3に保持します。

### 75.1 実装した境界とlocal検証

Layoutは旧`PIECE_NATIVE_PREVIEW_VERSION`をv3のまま保持し、別の明示v4定数と内部candidateProfileを追加しました。iOSのpreviewだけがv4を選び、saved v4・Android v4・preview v4のexport canvasは拒否します。既存v3／diagnostic previewのkeyと計測経路は維持。Cardの現在fontと次font先読みは同じ共通関数から幅付きmethodを呼び、版変更は既存binding／generationを更新して旧結果・fit handleを失効させます。ローカルhandleは最終検査済みの同じpreview/tokenだけを確認し、正式admissionを供給しません。

nativeの新measureCandidatesForWidthは、旧methodと同じ候補生成本体へ明示幅を渡します。各public入口で元8秒のdeadlineを一度だけ作り、queue待ちで更新しません。完全UTF-16＋全属性の同値判定、全grapheme range、独立CTLine、最大4workerを保持。v4では全advanceを有限・非負と確認し、advance>Wだけink取得前に分岐します。返却recordはtag0＋5double／tag1＋advanceの連結で、`9×metric_count＋32×full_metric_count` bytesと全rangeのu32参照を持ちます。

adapterはv4の11fieldを厳密に検査し、要求幅＝返却幅、tagとstrict幅分類、全metricの有限値／full inkの順序、byte終端・full件数・全参照・全代表使用を確認します。B9はinput profileとtable versionも双方向に一致させ、同じ幅を再照合します。overflowは4slotの明示状態で、偽inkを補いません。4消費箇所では数値の幅／高さ計算より前に除外し、従来のscore・探索順・font順・gap・最終Text inspectionを保持しました。

localはNode24.19.0／TypeScript5.2.2、既存13fileを`node --test --test-isolation=none`で実行し839 PASS／FAIL0／SKIP0。追加は既存renderer8件とmeasured-wrap29件の計37件です。対象2fileだけでも150 PASS。元Python B9の25case／expectedを変更せず、v4のfit/null・本文行・段落・lineHeight・gap・totalHeight・同点選択が一致。幅同値／1ulp超過／ink張出し／非単調候補／viewpoint／版と幅の不一致／wire異常／旧v1〜3の未選択不正ink拒否を確認しました。新timeout検査の最初のfixtureは1.123秒でpreviewが失効したため、この検査のexpiryだけ60秒へ直し、元8秒のtimeoutを独立に確認しました。製品expiryやdeadlineは変更していません。

nativeの旧decoder／call／validCandidates／独立uncached oracleは原文一致で保持しています。元69判定に、既存21入力のv4全range／advance bit一致・full5double bit一致、strict幅境界、無効幅、glyph拒否、queued2font、全独立line／全advance／fullだけink取得の回数、承認済み不正ink検出差、異常advance拒否の28判定を追加し、既存workflowの期待件数だけ97へ同期しました。source公開前のlocal段階ではnative97件を合格扱いにせず、その後の実CI結果を§75.2に保持します。

既存実RN5fixtureの名前・順序・全本文・recipe・hash・propsは、preview4件のrenderer_versionだけをv4にしたことを比較確認しました。savedはv3のまま、mixed本文は420文字です。観測wrapperは旧／幅付きmethodを別に記録し、要求と返却の版・幅・代表数をtraceへ残します。既存の全文・最終inspection・PNG・8秒・save/export=false・ローカルfitの実検査を維持。source reviewで重大指摘なし。CIと実RNの確定結果は次節です。

### 75.2 限定検証の結果 — JS839／native97成功、実RN420文字timeout

実装sourceは`b4467a77877dd936c29845f2977a06bd61df84c1`、treeは`baa4153f82f38b05de0dd1c8eef59bdb42bca13f`です。既存Draft PR #30に反映後、変更14pathの全内容・blobと親`fab912241599d42a6c1706ab8cd29342666be990`からの差分path集合を読戻し照合しました。限定CIは[run39205556730](https://github.com/MassyuRed/Cocolon/actions/runs/39205556730)、attempt1です。

| 検証 | 実結果 |
|---|---|
| local既存13 JS suite | 839 PASS／FAIL0／SKIP0。対象2suiteの150件はこの部分集合で、合算しない |
| CI piece-rn-contracts | job117907499629、Node24.21.0／TypeScript5.2.2、標準node --testで839 PASS／FAIL0／SKIP0 |
| iOS source／native | job117907499621、製品source compile成功。実UIKit／TextKit／CoreTextで元69＋追加28＝97 PASS／FAIL0／SKIP0 |
| Android source | job117907499301、compile成功 |
| iOS export依存 | job117907499728、既存4Podを実compileして成功。scope skipではない |
| Android export依存 | job117907499609、既存4libraryを実compileして成功。scope skipではない |
| 実RN canvas | job117907499684、4ケース成功・420文字timeout、exit65。workflow全体はfailure |
| 既存guard | 同sourceの5runすべてsuccess。これは失敗した420文字の代替合格ではない |

nativeはApple clang17.0.0／Xcode16.4（16F6）、iOS26.2（23C54）のsimulatorです。実出力`NATIVE_CHECKS=97 PASS=97 FAIL=0 SKIP=0`と97本のPASSを確認しました。既存21入力の全range／advance bit一致とfull5double bit一致、strict幅境界、旧版拒否、承認済みの省略行ink検出差も成功。mixed420の48pt・W888では全88,410rangeと11,381代表を残し、full531・overflow10,850でした。native v4 raw callは2,085.487msですが、旧v3計測はtest decoderを含むため同じ計時境界ではありません。これを実RN全体の改善量や8秒達成へ換算しません。

| 既存実RN fixture | 使用版 | elapsed_ms | 結果 |
|---|---|---:|---|
| essay_paragraphs | preview v4 | 2,438.203 | native_checked、本文・最終inspection・PNG成立 |
| quote_unicode | preview v4 | 704.151 | native_checked、本文・最終inspection・PNG成立 |
| declaration_no_brand | preview v4 | 369.839 | native_checked、本文・最終inspection・PNG成立 |
| essay_max420 | preview v4 | 8,069.796 | unavailable／measurement_timeout、size_index3、完成PNGなし |
| saved_essay_canvas | saved v3 | 1,420.968 | native_checked、本文・最終inspection・PNG成立 |

成功4件はbody_preserved／native_canvas_valid=true、全Textのoverflow／wrapViolation=false、glyphCheck=no_missing_observedです。preview成功3件は同tokenのlocal fitだけtrue、wrong tokenはfalse。saved v3はfit handleを出さない従来結果を維持。全5件のstate canSave／canExportはfalseです。実RNはCardを直接mountする既存simulator harnessであり、InputScreen→Modal→hostの通常初回保存や実機受入れではありません。

artifact `piece-rn-canvas-ios`（ID12166475887、63,767,854bytes、SHA256 `3e5064d7e207c481897f1ee683673b83407550ef62053ee1475dfb28a1cda34f`）を取得し、GitHub metadataと一致を確認しました。results.jsonは33,697bytes、SHA256 `932003158c34b7715a08ffd0073bf64aaa942db871339b7124462350b2092c38`で、収集済みjob logの5件JSONと完全一致。4枚PNGを目視し、本文順・段落・branding有無・明暗themeを確認しました。前回run39177257042の対応4枚とPNG bytesが同一で、全5件の入力blocks／描画寸法、成功4件のrows／offsets／inspectionも一致。PNGごとの寸法・digestはmanifestの同v4 ownerに保持します。420文字の完成PNGはありません。artifactのGitHub保管期限は2026-10-26T05:59:40Zです。

420文字のtraceは48→44→40ptのnative／adapterがv4・W888で返り、B9は各fit=falseでした。planning:3は7,117.998msで始まりましたが、timeout時点では36ptのnative／adapterがpendingで、そのfontのB9・最終Text inspectionへ未到達です。unavailable:3の観測は8,035.288ms、report elapsedは8,069.796ms。後者は全体timeoutの観測値で、36pt単体時間・描画完了時間・「あと69.796msで完成」の意味ではありません。先読みのqueue待ちを含む各methodの時間は合算しません。本文420文字のblocksは保持され、body_preserved=falseは最終plan未成立の結果であり、本文を短縮した結果ではありません。

### 75.3 採否と停止後の残件

§74.4の停止条件が成立したため、**v4は未採用**です。承認された実装と限定検証は完了し、sourceは既存Draft PR #30に未採用候補として残します。承認を未承認へ戻したり、source撤去を意味したりする状態ではありません。結果確認後の更新は既存入口・manifest・current mapの3点だけで、製品／test／workflowへの追加変更0、同source再実行0、期限延長0、worker増加0、追加省略0です。旧v3とsaved/exportの経路を維持します。

現在のP-W1残件は、420文字について未完了の36pt候補計測→B9→最終inspection→画像成立を元8秒内へ収める方式の判断です。この結果だけで420文字が原理的に不可能とは結論しません。正式renderer admission supplier、explicit candidate APIの稼働確認、通常初回保存→同owner履歴／詳細の再表示、P-W2の3format export／Photos／share、P-W3の商品読取り・実機受入れも未完了です。適用済みPiece6migrationと保存停止回収source5c44b252を保持し、同じ基盤作業をやり直しません。API変更・DB書込／再適用・業務RPC・flag／env・deploy・署名／配布・main merge効果0、default OFF・Draft/open/unmerged・automatic_progression=falseを維持します。

## 76. 2026-10-19 JST — 420文字の方式判断候補と通常保存への接続箇所

**状態：調査・具体案の記録。v5は未承認・未実装・未検証・未採用。** §75のv4承認済み作業は終了したままです。今回の「Pieceの残件作業を進めて」とweekly §5.6.2の10/20判断点に基づき、最初の未完了条件へ直接対応する案を準備しました。新方式の承認前に、v4のSTOPを解除したり旧suffixを稼働経路へ戻したりしません。

### 76.1 今回の作業範囲と根拠

| start field | 今回の固定内容 |
|---|---|
| product_destination | 本人が選んだ全文のPieceを画像で確認し、同じ本文・recipeで保存して履歴から開き直せること |
| current_gate_or_subgate | weekly20261017 §5.6 P-W1の420文字方式判断。v4の閉じた限定検証は再開しない |
| exact_work | 現native／B9／Cardと保存経路を読取り、契約を保つ修復の有無、新方式の最小差、保存接続までを既存ownerへ具体化 |
| scope_classification | 今回の調査・候補記録はLEVEL_2相当。§76.3〜76.5の新契約を実装・実行する次作業はLEVEL_3で、未承認 |
| approval_or_delegation_basis | 今回の残件継続指示、weekly §5.6、Rule18 §0／§11.3の既存目的内の調査・文書反映。提案記録を新契約の承認・有効化へ変換しない |
| execution_owner | 華恋／GPT-6 Astra Pro／CHAT_PRO_OK。書込はroot一人。補助担当は描画・保存・契約差の読取レビューだけで、別modelの正式独立審査とは扱わない |
| success_credit | BLOCKER_NARROWED。時間を使う処理と保存を止める実装箇所、Mash判断に必要な契約差を具体化。描画速度改善・商品完成のcreditは0 |
| completion_condition | 具体案、許容する差、限定検証・STOP、保存への接続順を既存4文書へ反映し、remote全内容・差分path・最終headを照合 |
| stop_condition | 新契約のfirst source effect前で停止。新たな確かな修復がないまま同source実RNを再実行しない。補助機構だけを増やす場合はDETOUR_RISK_STOP |
| prohibited_scope | 製品／test／workflow変更、test再実行、v4再試行、API変更、DB書込・業務RPC・実Piece行取得、flag／env／deploy／署名／配布／main merge、正式supplierの自己採用 |
| next_product_read_or_mash_decision_point | §76.3の契約差を明示したiOS preview v5の限定実装・検証へ進めるか。承認後の新source出力を実読みし、採否を結果から判断 |
| current_source_test_receipt | Cocolon source b4467a77877dd936c29845f2977a06bd61df84c1、既存JS839／native97、実RN run39205556730の§75.2記録。今回新しいtest結果や画像は生成していない |
| current_docs_and_heads | 開始・反映前head Cocolon321ef6f64fe837019c7e6989c89e5d634ef2a224／API a536e50ee284785f585ac73329ef2947dca8bba9。全体設計01、全file地図01A〜C、current maps入口、Piece入口・manifest、最新weekly20261017、適用rules・PCE5契約を照合 |
| affected_current_structure_maps | current_structure/02_piece_current_structure.md §65.24。実装構造は無変更で、確認できた未接続箇所と未承認候補を同write unitへ記録 |

必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORKで、未完了条件は「420文字の最終検査まで元8秒で成立させる方式が未決定」の一つです。成功後は方式の具体的な差への判断へ進めますが、P-W1完了へは進みません。文書の反映対象はこの入口、Cocolon_Piece/manifest.json、Piece current map、weekly_reviews/Cocolon_Weekly_Review_20261017.mdの既存4pathだけです。新しいaudit／checker／台帳は作りません。今回の製品test実行・外部設定変更・Mashの端末操作は0です。

### 76.2 確認できた原因と、通常保存までの残り

nativeは全grapheme range、完全UTF-16文字列＋全属性のdedup、最大4worker、worker専用buffer appendを実装済みです。v4が省いたのは幅超過行のink取得で、代表ごとの独立CTLine作成は残っています。§75.2のmixed420は88,410range／11,381代表で、36pt計測待ちのまま8,069.796msでtimeoutしました。onLayout待機には縮められる可能性がありますが、今回のtimeoutの主因だとする計時証拠はありません。全候補の独立数値条件を保って大きく短縮できる確かな追加修復は特定できませんでした。不可能の証明ではありません。

| 現在のowner | 原文で確認した未接続／再利用する責任 |
|---|---|
| screens/InputScreen.js → screens/input/InputPieceActionArea.js | 通常mountはsavedInputとnavigationを渡し、正式isSaveAdmittedを渡していない。hostはそのsupplierと同じpreview/tokenのlocal fit handleの両方を要求するため、通常初回保存の正式許可は成立しない |
| components/piece/PieceVisualCard.js／PiecePreviewModal.js | 最終inspection済みの同mount・generation・preview/tokenへ結び付くlocal fitを既に渡す。これは正式renderer admissionを生成しない |
| features/piece/pieceLayout.js／screens/PieceOwnerHistoryScreen.js | savedRecordの描画経路はv3だけ。preview専用v4は保存後の再表示に使えない。新方式を保存へ採用する場合も、同じ採用版のsaved対応を同じ完成単位で準備する必要がある |
| features/piece/PieceCreateController.js／pieceApi.js | 既存のpreview revision・本文／payload／recipe hashを束縛したprivate保存と同一key回収を再利用する。source5c44b252の回収修復を再実装しない。保存後は同ownerのdetail GETで実recordを開く |
| features/piece/pieceExport.js／通常本人詳細 | exportの版識別は現在v3。通常詳細には既存exportの呼出しが未接続。P-W2で同じsavedRecordと採用rendererを使って接続する |
| API app.py／piece_v2_runtime_control.py | candidate構成は明示引数で組み立てる実装があり、preview runtimeはttl_secondsとrenderer_versionを検証する。引数なしapp生成からcandidate稼働を証明できない。稼働環境の配置・実効flag・TTL／rendererとRN版は未確認 |

API原文は[API a536e50のapp.py](https://github.com/MassyuRed/mashos-api/blob/a536e50ee284785f585ac73329ef2947dca8bba9/ai/services/ai_inference/app.py)と同ディレクトリのpiece_v2_runtime_control.pyを確認しました。Supabaseはmigration履歴をread-onlyで再確認し、全10件・Piece6件、うち10/19適用2件を保持しています。これは§73.6のschema／関数再検証やcandidate稼働確認ではなく、再適用も行っていません。

### 76.3 推奨する限定v5 — 探索用の代表寸法と、表示する行の独立検査

**推奨は新しい明示iOS preview版として、一度の限定実装・検証を行うことです。現行と同値な高速化とは扱いません。** 新previewをpiece.rn_native_preview.prototype.v5、候補wireをpiece.native_candidates.v5、選択行inspectionをpiece.native_selected_line.v1として分離します。旧v3／v4の入口と判定は保持し、v5はiOS previewだけに適用する候補です。

1. **全候補は探索用の値で調べる。** start昇順・各startのend昇順で全n(n+1)/2 rangeを列挙し、完全substring＋全属性、16,384keys／4×1024×1024 UTF-16 unitsの既存保持予算を固定します。cache hitは保持済み最初の代表rangeのsuffix文脈、missは当該rangeのsuffix文脈で得た値を使います。予算超過後の未保持rangeを「全体で最初の出現」と説明しません。これらは探索用の代表値であり、各rangeの独立値でも各range自身のsuffix値でもありません。**この版では列挙順・cache予算も見た目に影響し得る仕様**となり、無言で変更しません。
2. **suffix処理はworker内で所有する。** snapshotの当該start以降を完全属性のままtypesetterへ渡し、そのstartを持つ代表の行を作ります。mutable buffer・typesetter・lineをworker間で共有せず、最大4worker、元の呼出しdeadlineとqueue待ちを保持します。全候補rangeの参照と全代表のCTLine生成を残し、独立shaping準備の反復を減らす案です。Appleの[CoreText overview](https://developer.apple.com/documentation/CoreText)のlayout objectのqueue／thread所有指針にも従います。
3. **全代表5doubleを返す。** 新measureExplorationCandidates(tag,text,fontSize)はv3形式相当のmetrics_f64le（advance,left,top,right,bottom）と全rangeのrow_indices_u32leを別versionで返します。headerはversion／platform／font_size／utf16_length／boundaries／glyph_check／metric_countの7field、payloadを含めexact9fieldです。全範囲・参照・代表使用・finite／順序を検査します。v4の幅超過ink省略を混ぜず、幅付きtagや偽inkは使いません。v5のtable versionとinput profileをB9まで一致させます。
4. **同じB9手順で選んだgroupsを固定する。** 既存のscore式、探索順、font順、段落とgraphemeを保持して探索用tableを渡します。返るgroups／lineHeight／gap／totalHeightだけで描画します。同fontで一部の値をtableへ戻して再探索するloopは加えません。探索のnullは「この方式で選べない」であり、独立全候補にfitが存在しない証明ではありません。
5. **実際にmountした選択行を厳密に確認する。** nativeの既存inspectは最終Textの各行について独立CTLineを既に作っています。新inspectSelectedLine(tag,text,fontSize)では、そのCTLineを解放する前に独立5doubleも取得します。新inspection版は既存10fieldのversionを新値にし、40byteのindependent_metrics_f64leを加えたexact11field。line_ends=[expected.length]の一行と5値exact1を要求し、旧inspectのv1応答は変えません。属性は**実際に選択行としてmountしたTextの完全属性**であり、probe段落のsubstringと属性が完全一致するという未検証の主張はしません。
6. **独立寸法と実描画の両方を通す。** advance≥0、全値finite、right≥left、bottom≥top、既存oracleのnull-ink規則を維持し、max(advance,right)−min(0,left)≤contentWidthとbottom−top≤lineHeightをstrictに追加検査します。non-whitespaceのnull inkは拒否、whitespaceのnull inkは従来の0扱いを保ち、既存TextKit側の拒否条件は緩めません。本文とbranding（28pt／lineHeight40）は分けて確認します。位置は既存TextKit ink＋onTextLayout幅から決め、CTLineのbaseline座標をTextKit座標へ代入しません。全文・全glyph・段落順・禁則・再wrap拒否・own viewのink containment・移動後の幅／高さ検査を保持します。
7. **現在の対象・期限へ結ぶ。** 同じbinding／key／plan／token／generation／node集合をawait前後とstate確定前に照合します。新たなbridge往復や別再計測passは増やさず、候補探索から最終inspection・state確定まで元8秒へ含めます。正しく計測された幅／高さoverflowは既存の次discrete fontへだけ進めます。glyph・不正値・identity・bridge・再wrap・期限の失敗は既存拒否を維持します。独立値と探索値の差だけを理由に同font再planしません。

**Mash判断の対象となる差：** 未選択候補の独立advance／ink異常は全数検出しません。また候補寸法は幅判定だけでなく、B9のbridge・determiner／viewpoint・kana・durationの語群分割保護やscoreにも使われるため、最終行の独立検査を追加しても、旧独立全候補による最適な改行・最大font・fit／unavailableとの同値は回復しません。改行やfontが変わり、旧方式なら描ける入力を不成立にする場合もあります。全文維持・font下限・元8秒・表示する行の欠け拒否と、この選択の差を分けて判断します。

### 76.4 効く可能性の根拠と検証範囲

§69の旧suffix source69f9f2cdは、mixed420を実RN run38488415449で5,806.998ms・36pt18行・PNG成立まで進めた記録があります。一方、native74判定中8件が独立数値と不一致で、不採用・復元済みです。差は1ULPだけではなく、空白、Latin ligature、Hebrew、Arabic、mixed bidiのinkLeft、paragraph direction、後続RTL文脈を含みます。許容誤差や文字種分岐で旧合格へ変換しません。旧sourceの成功は今回の速度・画像・受入れの証拠には使わず、今回旧artifactを再取得・目視したとも扱いません。

新方式はこの実測された処理削減を、異なる数値契約と選択行検査の追加で再設計する案です。8秒達成を保証しません。増える作業は既存owner内の実装・検証1単位と既存CI／実RN1回です。総工数は未実測、10/22保存・10/23共有の完成保証はしません。新規service・依存・課金設定は追加せず、既存Actionsの実行枠を使用します。Mashに求めるのは契約差への判断1件で、端末操作はこの限定検証に含めません。

| 既存path | 承認後に行う最小変更候補 |
|---|---|
| ios/tempCocolon/PieceTextMetrics.mm | v5探索用suffix method、新選択行inspection。旧候補／inspect経路は保持 |
| features/piece/pieceRenderer.js | v5候補と新inspectionの厳密な版別decoder、旧版との相互混入拒否 |
| features/piece/pieceMeasuredWrap.js | v5探索tableの明示受理。旧アルゴリズム・期待値を保持し、新table上の結果を旧独立最適解と扱わない |
| components/piece/PieceVisualCard.js | v5だけ新inspectionを選択し独立strict寸法を追加検査。既存配置・対象束縛・期限を保持 |
| features/piece/pieceLayout.js | 明示v5のiOS preview分岐。saved/export v5・Android v5は拒否 |
| tests/piece-v2-renderer.test.js／tests/piece-v2-measured-wrap.test.js | 版／wire／代表値／最終寸法／旧版境界とB9差の検査を既存suite内へ追加 |
| tests/native/piece-text-metrics-ios.mm | 旧97判定・uncached oracleを維持。新代表定義、実Textの独立5値、過去不一致入力と属性、負例を追加 |
| tests/native/piece-rn-canvas-entry.js／tests/native/piece-rn-canvas-fixtures.cjs | 既存5fixtureの全文・recipe・順序・元8秒・PNG検査を保持し、preview4件だけ明示v5と新inspectionの観測へ接続。savedはv3 |
| .github/workflows/piece-rn-contracts.yml | 追加native判定の期待件数・既存結果収集との必要な同期だけ。新workflow／checkerは作らない |

限定検証では、旧v3／v4・native97・元B9純粋25caseの期待値を維持します。新tableは全range、属性、固定cacheのhit／missと保持予算境界、後続LTR／RTL／空白の代表文脈、異常値を確認します。選択行の独立5値は実Textの完全属性から作る旧uncached oracleとbit比較し、探索値はfitでも独立値が幅／高さoverflowする負例、負のinkLeft、whitespace、null／nonfinite／逆転を確認します。

旧suffix8不一致入力と既存の句読点・語群・Unicode caseは、新sourceの候補・B9選択差と、選ばれた行の独立寸法／描画を確認します。任意のparagraph属性を持つnative入力はその属性を保ったnative/UIKit検証、通常RNで表現できる入力は実RN側の描画確認として区別します。旧純粋25caseの成功だけで新nativeの改行・font同値を主張しません。実RN5fixtureは新sourceで一度実行し、420文字の全inspectionと完成PNG、本文・段落・branding・local fit同一性を確認して実画像を読みます。canSave／canExport=falseを維持し、この結果を正式保存許可へ格上げしません。現harnessはlocal fit照合後にreport.elapsed_msを固定し、その後でPNGをcaptureします。8秒の検査はreport時点までで、PNGファイル生成自体が8秒以内に終わったという計測ではありません。この既存の計時と画像確認を分けて記録します。

### 76.5 採否・STOPと、その後の保存接続

既存harnessのreport.elapsed_msが8秒以内で420文字のnative_checked・全inspection・同tokenのlocal fitが成立しない場合、またはその同じ状態の完成PNGを取得・確認できない場合は、v5も未採用として終了します。既存成功fixtureや過去不一致入力の明白な崩れ、選択行の独立検査を現在mountへ結び付けられない場合も未採用です。幅／高さoverflowからの既存font順以外の再探索、期限延長、worker増加、本文削除、候補集合縮小、旧版のsilent置換、同source再実行へ自動拡張しません。実装がこのscopeで成立しない場合も差を記録して止めます。

限定v5に含めない正式採用と通常保存は、次の同じ完成単位で扱う必要があります。採用rendererの版・platform・layout／measurement・catalogを確定し、既存renderer ownerからの正式isSaveAdmittedをInputScreen→hostへ渡します。local fitと同じpreview・正文・recipeへ束縛し、採用版をpieceLayoutのsavedRecord経路へ対応させ、既存保存controller→同owner detail GET／履歴で同じ本文・recipeを再表示します。旧保存版の互換を維持し、PCE5 Reproducibility §7〜8とLongText §15に従い、previewの見た目だけを変えて保存後に別方式へ置換しません。

candidate API構成・実効flag・TTL／renderer・RN版の実稼働確認もP-W1の依存として保持します。設定／deploy／実DB／署名・配布に新しいeffectが必要な部分は、具体的な対象を準備して既存承認範囲と照合します。P-W2は採用版の同一savedRecordから既存exportを通常詳細へ接続し、3形式・両OSのPhotos／shareへ進めます。新しい保存controller、DTO、schemaをこのために作り直す案ではありません。

**今回の結論：BLOCKER_NARROWED。** 新しい画像成立・速度改善・正式admission・通常保存・実機受入れは未成立です。実装へ進む判断は、Rule18 §0(4)／§11.3が新しい契約・品質条件を既存source修復の委任から分けているため必要です。確認対象は§76.3〜76.5の新しい差を含むiOS preview v5の限定実装・検証であり、終了したv4範囲の再承認ではありません。反映後のremote照合結果と最終headは同manifest・作業報告から辿り、automatic_progression=falseを維持します。

## 77. 2026-10-19 JST — 承認されたiOS preview v5の実装・限定検証

Mash様はこの会話で、§76.3〜76.5の差と停止条件を含むv5の実装と一度の限定検証について「進めていいよ、お願い」と明示承認しました。以下は最初のsource変更前に固定した開始範囲です。

| start field | 固定内容 |
|---|---|
| product_destination / current_gate_or_subgate | weekly20261017 §5.6 P-W1の420文字描画方式判断。全文画像を確認し同じ候補を保存・再表示する完成単位へ接続 |
| exact_work / scope_classification | LEVEL_3。§76.3の明示v5探索用suffix代表値と実Textの独立選択行検査を実装し、§76.4〜76.5の限定検証・採否を完遂 |
| approval_or_delegation_basis / execution_owner | 上記のMash明示承認。華恋／GPT-6 Astra Pro／CHAT_PRO_OKが唯一のsource・test・GitHub書込担当。補助担当は読取・差分レビューで、正式な別model審査とは扱わない |
| success_credit / completion_condition | 新sourceの結果を実画像まで確認し採否を記録。技術検証の成功だけを正式admission・通常保存・商品受入れへ換算しない。対象全内容・差分path・最終headのremote照合まで実施 |
| stop_condition | §76.5をそのまま適用。既存reportの元8秒内の420文字native_checked／全inspection／同token fit、同状態のPNG確認が成立しなければ未採用で終了。明白な崩れ・current mountへの束縛不成立もSTOP。補助機構だけを増やす場合はDETOUR_RISK_STOP |
| prohibited_scope | 同source再実RN、期限延長、worker増加、本文削除、候補縮小、同font再plan、旧版silent置換、正式supplier／saved・export v5、API／DB／flag／env／deploy／署名・配布／main merge |
| next_product_read_or_mash_decision_point | 新sourceの完成画像を華恋が読み、限定方式の採否を記録。正式admission・同採用版saved再表示・通常保存の実装と稼働は引き続きP-W1の残件 |
| current_source_test_receipt | source b4467a77877dd936c29845f2977a06bd61df84c1、旧JS839／native97と独立oracle、元B9純粋25case、実RN run39205556730の5fixture。旧期待値を保持し新検査を追加 |
| current_docs_and_heads | Cocolon開始head9d9f0b7d17b988bd5f1c64431edf88681df917f7／tree861fac4762c5b1d065744867834d39039bb4324b、API a536e50ee284785f585ac73329ef2947dca8bba9。前段で読んだ全体設計01・全file地図01A〜C・最新weekly・rulesと§76を継承し、最新tree／対象原文を再照合。local70fileの全blob一致 |
| affected_current_structure_maps | Piece current map §65.25へ新version・owner責任と結果を同write unitで反映。入口・manifest・map・weeklyの既存4文書へ記録 |

製品pathは§76.4の既存5つ、検査は既存renderer／measured-wrap／native metrics／RN entry／fixtures、既存workflowです。追加検査の収集に必要な既存tests/native/piece-rn-canvas-ios.mも対象に固定します。同fileがreport数5を直接検査しているため、元5fixtureの本文・順序・assert・分母を維持しつつ過去不一致入力の補足確認を収集するための同期です。追加の製品機能・受入条件変更・新harnessは作りません。対象は製品5＋検査6＋既存workflow1＋文書4の計16pathです。

必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK。現未完了の420方式に直接作用する実装1単位と既存CI／実RN1回で、元のSTOPを保持します。localは既存のNode24／TypeScript5.2.2 suiteを使用し、iOS実UIKit／TextKit／CoreTextと実RNは既存CIで確認します。新規依存・課金設定・Mash端末操作は追加しません。保存回収source5c44b252と適用済みPiece6migrationは保持し、再実装・再適用を行いません。

### 77.1 実装差とlocal検査 — 新sourceの一度のCI実行前

§76.3の3版を明示的に実装しました。iOS preview v5だけが新measureExplorationCandidatesとinspectSelectedLineを呼び、候補wire exact9／選択行wire exact11・40byte／B9までの版を双方向に照合します。saved／export v5とAndroid v5は拒否し、旧v3／v4は元の候補・inspectionを使います。選択行では実mountの全文属性を持つ既存CTLineを再利用し、独立5値は寸法のstrict確認だけに使用、配置は元のTextKit ink／onTextLayoutのままです。本文lineHeightとbranding28pt／40を分け、geometryの有効な超過だけ次のcatalog fontへ進みます。無効値・glyph・bridge・全文・再wrap違反は画像全体を利用不可とし、await後とstate反映時にも同node／generation／binding／token／key／元期限を照合します。v5で全fontの探索がnullの場合はlayout_search_unavailableと記録し、独立行の不可能性証明にはしません。

全grapheme範囲、start昇順／end昇順、完全substringと全点属性の照合、16,384保持key／4,194,304 UTF16 unitsを保持します。hitは最初の保持代表のsuffix、missは当該rangeのsuffixです。ある長いkeyがunits不足で保持できなくても、後から短いkeyが残容量に入れば保持します。workerは専有snapshot／typesetterと上限4、元8秒はqueue待ちを含みます。全代表の5doubleを返し、v4のink省略や候補削減を混ぜません。列挙・予算・文脈が見た目へ影響し得る新契約で、旧版の改行／font／fit同値は主張しません。

| 検査 | source実行前に確認した状態／次の証拠 |
|---|---|
| 既存13 JS suite | Node24.19.0／TypeScript5.2.2、test-isolation=noneで880 passed、fail／skip0。旧839を含む同じ集合で、新41判定を追加。local／将来CIを加算しない |
| 保護した旧期待値 | rendererの旧test本文、measured-wrap旧全本文と固定B9 oracle、native旧97実行部分・独立uncached oracleが原文一致。元RN5入力はpreview版だけv4→v5、本文／recipe／順序／saved v3は完全一致 |
| local準備差 | sparse環境に不足した既存Nexus／InputActionArea等6原文を同9d9f0b7から取得。変更対象へ含めず、検査の読取依存だけを充足。最終未解消failなし |
| nativeの限定検査 | 旧97を独立summaryで必須にし、新32を追加して期待129。旧7入力の全探索代表と属性付き独立選択行5値／paint、旧8件目の原属性観測と拒否、4worker所有、実key／units予算境界、無効値・例外解放・再wrap・queue期限を検査。iOS実行結果は未取得 |
| 予算境界2件の限界 | 実16,384／4,194,304の列挙・refを検査するため、その2件だけtest wrapper内で短い実CTLineを使用。数値同値・品質・性能の証拠に数えない |
| 実RNの元集合 | essay_paragraphs／quote_unicode／declaration_no_brand／essay_max420／saved_essay_canvasの5件を独立分母で維持。最後だけsaved v3。420の既存文反復stress入力を生成policyの適合証拠へ換算しない |
| 実RNの補足集合 | Latin ligature／Arabic／あ420の原文字列をCard3件、spaces／Hebrew／mixed bidiの本文下限未満3件をraw RN Text診断として別集計。rawは同Textの候補→B9一行→独立検査→PNGまでで、Piece response／Card fit／保存証拠にはしない |
| 旧属性条件の区別 | paragraph directionは原属性のnative検査。8件目は48ptの「space-tab-space」＋37pt RTL後続・baseline4で、原文の直接CoreText観測と製品のfont不一致拒否を維持。属性を緩めて受理しない |

旧5のassert・元8秒・同token local fit・完成PNGの検査は維持し、追加Card3とraw3は別の件数・名前・条件で収集します。B9のgroups／font／選択した探索5値と最終独立5値を同じreportへ記録します。report.elapsed_msはlocal fit照合後、PNG生成前に確定する従来の境界を保ちます。native単体・raw診断・PNG encoding時間をCardの8秒成立へ読み替えません。

現時点はSOURCE_IMPLEMENTED／LOCAL_JS_VERIFIED、正式採用false・実画像未確認です。この新sourceのpushで起動する既存CIの1runだけを待ち、全結果・artifactを回収して§76.5の採否を記録します。同sourceの実RN再実行は行いません。今回の変更は§77の16pathに限定し、API／DB／flags／env／deploy／署名／配布／main mergeの効果0です。

### 77.2 source固定・CIの契約／native検査結果

実装sourceは [`b983da2d3ba5ffd7d9f78a2b9e8d2b0574b5b5b1`](https://github.com/MassyuRed/Cocolon/commit/b983da2d3ba5ffd7d9f78a2b9e8d2b0574b5b5b1)、tree `5efe974d8c39cdac75cf23fe6fb67d2986407ae8`です。親9d9f0b7dからの変更集合が§77の16pathだけであること、16fileのremote全内容がlocalと一致することを確認しました。このpushで起動した既存[run39227065284](https://github.com/MassyuRed/Cocolon/actions/runs/39227065284)、attempt1の結果だけを使用します。§77.1の「未確認」はこの実行前の履歴です。

| 検査owner | 同じsourceの実結果 |
|---|---|
| piece-rn-contracts／job117975813346 | CI既存13 suiteは880 PASS、FAIL／cancel／SKIP／TODO 0。旧839＋新41で、local880との加算なし |
| piece-ios-source／job117975812954 | 製品Objective-C++ compileとproject lint成功。実TextKit／CoreTextで旧97 PASS、新32 PASS、計129 PASS、FAIL／SKIP 0 |
| piece-android-source／job117975813356 | 既存Android bridge compile成功 |
| piece-export-pods／job117975813358 | 既存export用4 Podsのcompile成功 |
| piece-export-android／job117975813415 | 既存Android export依存compile成功 |

native原ログは `LEGACY_NATIVE_CHECKS=97 PASS=97 FAIL=0 SKIP=0` と `NATIVE_CHECKS=129 PASS=129 FAIL=0 SKIP=0` を各1回出力。個別PASS行も旧97＋新v5 32と一致し、FAIL行0です。source SHAとnative blob `030e527024433494c2a4b985164220d980a2d7ba` を同じjobのcheckout／hash出力で照合しました。macOS15.7.9・Xcode16.4、iPhone17 Pro／iOS26.2 simulatorの結果で、物理端末の受入れではありません。

過去8入力のsuffix側と独立側の差は今回も観測されています。許容誤差で旧契約の合格へ変換していません。

| 歴史入力・UTF-16 range | 今回も異なった値の観測 |
|---|---|
| spaces [0,3) | advance 42.8671875／44.0390625 |
| あ420 prefix [0,8) | advance bit `407699e7cc4e7ae3`／`407699e7cc4e7ae2`、1ULP |
| Latin ligature [0,17) | advance 301.6875／305.4375 |
| Hebrew [0,8) | advance／left／rightに各−1.875の差 |
| Arabic [0,1) | 5値すべてが異なる。bottom差−15.4453125を含む |
| mixed bidi [3,4) | left／rightが探索−10.1953125、独立0 |
| paragraph direction [0,4) | advance 67.4609375／71.2109375 |
| 旧whitespace neighbor2の原属性 | advance 28／38.1953125、left／right 7.609375／28 |

表の順は探索／suffix側、独立側で、差は前者−後者です。7つのselected fixtureでは、実Textの独立5値が旧uncached oracleとbit一致し、既存UIKit paint bounds検査も成功しました。旧8件目は48ptの空白・tab＋37ptの後続RTL・baseline4という原条件を直接CoreTextで観測し、製品methodによる混font拒否も確認しています。完全属性cache、4worker所有、実保持予算、再wrap・異常値・例外解放・元queue deadlineの追加検査も成功。予算2件は短い実CTLineによる参照検査であり、数値同値・実RN速度の根拠にはしません。

以上は探索代表契約と実Textの独立選択行検査の技術検証です。実RNのB9選択・現在mount／tokenのlocal fit・元8秒・同状態PNGの判定は次節で独立に記録します。

### 77.3 一度の実RN・完成PNG — 元420条件は達成、追加RTLに未達

同じrun39227065284／attempt1の[実RN job117975813409](https://github.com/MassyuRed/Cocolon/actions/runs/39227065284/job/117975813409)は、実RNの全11reportを収集してexit65／failureで終了しました。元Card5、追加Card3、raw診断3の名前・順序・分母を別々に確認しています。build／testを含む1jobであり、同sourceの再実行は0です。

| 元Card5（本文・recipe・順序を保持） | 結果 | report時刻 | 最終font／行 | 完成PNG |
|---|---|---:|---|---|
| essay_paragraphs | native_checked | 661.249ms | 48pt／5行 | あり |
| quote_unicode | native_checked | 387.419ms | 80pt／3行 | あり |
| declaration_no_brand | native_checked | 326.135ms | 72pt／5行 | あり |
| essay_max420 | native_checked | **6,763.778ms** | **36pt／18行** | **あり** |
| saved_essay_canvas（v3） | native_checked | 653.169ms | 48pt／5行 | あり |

**元5ケースは5成功です。** preview4件は全て現在の同token fit=true、wrong-token=false、公開handleはisCurrentだけ。saved v3は想定どおりhandleを出さずfit=falseです。成功したv5の本文とbrandingは全て新inspection版の独立5値・strict幅／高さ・TextKit overflow／wrap拒否・glyph条件を満たし、本文・段落／行順・native canvasも確認できています。全8Card reportでcanSave／canExport=falseを維持しました。

mixed420は48→44→40→36ptの順で、各fontの88,410全range／11,381代表が返りました。B9は最初の3fontでfit=false、36ptで18行・lineHeight56・本文高1008のplanを選択。planning:3 4,272.587ms→measuring 5,662.220ms→geometry_checked 6,646.963ms→native_checked 6,701.837ms、同token fit確認後のreportが6,763.778msです。本文18＋branding1の19inspectionと同状態の1080×1350 PNGを確認しました。queueを含む重なった候補呼出し時間を加算しません。PNGはreport後にcaptureする既存手順で、PNGエンコードまで8秒以内だったという計測ではありません。また元420fixtureは15文反復の描画stressで、short_essayの生成文数方針を満たすAPI受入れへは換算しません。

| 追加Card3 | 結果 | report時刻 | 選択font／行 | PNG |
|---|---|---:|---|---|
| suffix_latin_ligature | native_checked | 177.428ms | 72pt／1行 | あり |
| suffix_arabic | unavailable／native_ink_overflow | 336.643ms | 最小56pt／B9は原文1行 | なし |
| suffix_max420_a | native_checked | 2,693.200ms | 36pt／17行 | あり |

**追加Cardは2成功・1不成立です。** Latinとあ420は同token fitと全inspection・native canvasが成立。Arabicは72→64→56ptの各B9が原文1行を選び、geometry_checkedまで進んだ後、最小56ptで寸法拒否になりました。reasonを生成するCardの分岐から、新inspectionのPromise.allとdecoderが返った後、①TextKit own-view overflow、②TextKit／onTextLayoutによる配置幅・高さ、③新独立5値の幅・高さ、の少なくとも一つが超過したことは確認できます。失敗時はinspection値をstateへ保存しないため、reportのinspection=[]を「未検査」とは扱いません。どの条件・本文とbrandingのどちらが超過したかは、この1runの値では特定できません。NaN／負advance／wire／bridge／glyph拒否のreasonとは区別します。

| raw診断3（Card・保存fitの分母外） | 結果 | report時刻 | PNGと範囲 |
|---|---|---:|---|
| suffix_spaces_raw | measurement_checked | 104.679ms | PNGあり、同Text node・独立寸法・native canvas成立 |
| suffix_hebrew_raw | measurement_unavailable | 100.858ms | PNGあり、TextKit左端84.9609375、local左端−11.0390625 |
| suffix_mixed_bidi_raw | measurement_unavailable | 97.370ms | PNGあり、TextKit左端73.5234375、local左端−22.4765625 |

**rawは1成功・2不成立です。** 失敗2件でも候補は返り、B9は原文全体の一行を選択し、captureのnative_textsは原文と一致しています。body_preserved=falseはcatchの総合失敗flagで、本文削除の観測ではありません。実PNGにも文字列は見えますが、Textのleft=96に対する負のlocal左端と、canvas margin判定95.5を下回る範囲が記録され、own-view／margin条件は不成立です。直接のcatch理由と最終独立値は残っていないため、独立5値自体の異常／成功、実画素の欠け、v5による新規回帰とは断定しません。raw3件は保存・export許可fieldを持たず、Piece responseの成功へ格上げしません。

artifact `piece-rn-canvas-ios`（ID12176407319、61,628,295bytes、SHA256 `3bf6346a0984baeacec610da152cd8b93bdeeb26c8df0e35cd7b5193e36fe36e`）を取得し、GitHub metadataのdigestと照合しました。results.jsonは117,389bytes、SHA256 `ad07db9c6349e1d5042f3a505529b54ab7d2962f1a6f6804fb5a65f79e47831c`で、job logの全11reportと完全一致。取得10 PNG（成功Card7＋成功raw1＋失敗raw2）を全て目視しました。成功Cardの本文／行順／余白／brandingに明白な欠け・重なりは見られず、旧成功4枚は§75.2の記録SHA256とも一致します。ArabicのPNGはありません。各PNGの寸法・digest・判定はmanifestのv5 ownerへ保持。GitHub artifactの期限は2026-10-26T09:22:39Zです。

### 77.4 採否・STOPと次の未完了条件

**V5_UNADOPTED_STOP。承認された実装・一度の限定検証は完了し、420文字の元8秒／全inspection／同token fit／同状態PNG条件は今回のsourceで達成しました。** しかし追加ArabicのCardとraw RTL2件が承認範囲の描画・境界条件を満たさず、旧差分入力まで含む品質確認が揃わないため、v5全体は採用しません。native129や元Card5成功を、追加の失敗を除外した全体合格へ変換しません。旧sourceで同じ追加入力・RN条件が成功していた証拠はなく、回帰の原因をv5だけに断定する結論でもありません。

source b983da2dを既存Draft PR #30の未採用候補として保持し、結果確認後は既存4文書だけを更新します。製品／test／workflowの追加変更0、同source実RN再実行0、期限延長0、worker増加0、候補削減0、同font再plan0です。承認を未承認へ戻す状態ではなく、§76.5の停止条件に従って今回の完成単位を閉じた状態です。

次の製品読取対象はRTLの実Text属性・TextKit境界と既存配置条件です。Arabicの直接の超過項目は今回未確定であり、探索値から補いません。確かな修復根拠がないまま新しい記録機構だけを増やしたり、同じsourceを再試行したりしません。P-W1には正式renderer admissionのInputScreen供給、同採用版のsaved再表示、candidate APIの実効flag／TTL／renderer・RN版の稼働確認、通常初回保存→同owner詳細／履歴での再表示が残ります。今回API／DB／flags／env／deploy／署名／配布／main merge効果0、正式採用false、商品／物理実機受入れfalse、automatic_progression=falseです。全体設計・全file地図・最新weeklyで確認したP-W2／P-W3、10/20方式判断・10/31管理線・12/18目標を、この技術検証だけで完了・達成保証に変更しません。

## 78. 2026-10-19 JST — Piece残件のRTL描画領域修復・明示iOS preview v6

### 78.1 開始時の限定範囲

Mash様の新しい「Pieceの残件作業を進めて」に接続し、P-W1の最初の未達であるRTLの実Text描画領域を修復する。開始headはb91cf47132ef3d6f025188ddac52f6982483c28b、実行ownerは華恋。全体設計01/01A/01B/01C、全国民制、全file indexとrecursive tree1901件、Piece入口・manifest・current map、最新weekly20261017とmandatory incidentを確認した。旧v5の限定検証と未採用STOPは§77の履歴として保持する。

permission basisは現指示とRule18 §11.3 LEVEL_2、weekly §5.6.2〜5.6.3。本文・catalog・組版幅・safe margin・方法族・受入れ条件を保つ内部描画修復であり、PCE5 Render Reproducibility §7に従う新preview版を用いる。v6→既存native_candidates.v5／native_selected_line.v1の対応を明示し、旧v3/v4/v5を変更しない。

対象repositoryはMassyuRed/Cocolon、既存Draft PR30の同branch。exact pathsは次の11件だけとする。

- components/piece/PieceVisualCard.js
- features/piece/pieceLayout.js
- features/piece/pieceMeasuredWrap.js
- tests/piece-v2-renderer.test.js
- tests/native/piece-rn-canvas-entry.js
- tests/native/piece-rn-canvas-fixtures.cjs
- tests/native/piece-rn-canvas-ios.m
- Cocolon_Piece/00_read_first.md
- Cocolon_Piece/manifest.json
- Cocolon_前提資料/current_structure/02_piece_current_structure.md
- Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md

選択済みv6本文行だけにpaddingHorizontal=既存margin96/108を設け、外側Text幅1080、実TextContainer内幅888/864を維持する。配置計算時だけraw ink左右からpaddingを引き、従来の幅・位置式を使って外側leftを同量戻す。onTextLayoutは内側座標のまま。own-view判定には実外側boxとraw ink、本文配置幅には元contentWidthを使用する。縦方向、probe/prefetch、branding、native製品source・wire・全range探索・独立5値・全文/glyph/禁則/rewrap・現在node/token/generation・元8秒は保持する。

検証は既存13 JS suite（importされるhost検査含む）＋必要なv6回帰、既存workflowのcompile/native129、同じ本文/recipe/順序の実RN基準Card5・補足Card3・raw診断3、同状態PNGとnative contentFrame実測。Arabic拒否時は既存operation内の同plan/generation/sizeIndex evidenceを既存harnessに記録し、追加native passや製品記録機構を設けない。raw診断の表示配置をv6に合わせるが、診断をPiece保存成功へ転用しない。

新sourceの限定実RNは一度。失敗時は該当値と完成条件を記録して未採用で止め、同source再試行・期限延長・判定緩和・成功分だけによる全体合格を行わない。API/DB/flags/env/deploy/署名/配布/main merge効果は本範囲に含まれない。canSave/canExportはfalse、正式admission・saved/export v6・通常初回保存→同owner詳細/履歴・物理実機受入れは別の未完了条件として保持する。current map §65.26・weekly §5.6.6・manifest v6 ownerを同じ変更単位で同期する。

### 78.2 source修復とlocal検査

製品差分はCard/layout/B9の既存3fileです。明示v6はiOS previewだけで、selected body Textに幅1080・paddingHorizontal96/108・height=lineHeightを設定し、leftをpadding分戻します。内側幅・onTextLayout・元の本文占有幅を保持します。candidate adapterは既存v5 optionを明示指定し、B9はv6とv5 wireの対応だけ追加しました。native候補/inspection source、pinned RN patch、旧versionの分岐はbyte未変更です。

既存renderer suiteへ8回帰を追加し、両ratio/両alignment、raw own-view/元本文幅/独立5値/branding40の厳密な拒否、旧wire拒否、同node/token/generation/期限を検査しました。全13 suiteはNode24.19.0・TypeScript5.2.2で既存880＋新8=888成功、失敗/skip0。通常process isolationではfile単位13成功のreportになったため、同13 suiteのtest-isolation=noneで全888の登録と個別結果を確認しました。これは合成計測によるsource検査で、実RNの成立証拠ではありません。

既存実RN harnessは全文/recipe/順序/5+3+3分母・旧assertionを保持し、preview版だけv6、savedはv3のままです。captureで実view bounds/contentFrame/TextContainer寸法を確認します。raw成功reportは配置setStateのcommit確認後に公開し、拒否値は既存operationからのみ保持します。追加native pass・新製品記録owner・workflow変更はありません。実RN結果とPNGの確認前であり、この時点の状態はV6_SOURCE_READY__ONE_RUN_PENDING__NOT_ADOPTEDです。

### 78.3 一度の実RN・実画像の結果 — v6は未採用

sourceは [`0033ee3662b7ae76db8efa0c2cadf177be7776ca`](https://github.com/MassyuRed/Cocolon/commit/0033ee3662b7ae76db8efa0c2cadf177be7776ca)、tree f576f10bb75ec8003b7ae51ed388e93409c98163です。変更集合は§78.1の11pathだけで、remote全内容を準備原文と照合済みです。このpushから起動した既存[run39254155962](https://github.com/MassyuRed/Cocolon/actions/runs/39254155962)、attempt1だけを使用しました。

| 検査owner | 同sourceの実結果 |
|---|---|
| piece-rn-contracts／job118065114470 | CI JS888 PASS、FAIL／cancel／SKIP／TODO 0。既存880＋回帰8。local888と加算しない |
| piece-ios-source／job118065114582 | 製品Objective-C++ compile・project lint成功。旧97＋新v5 32＝native129 PASS、FAIL／SKIP 0。製品native blobは旧030e527024433494c2a4b985164220d980a2d7baを保持 |
| piece-android-source／job118065114545 | 既存Android bridge source compile成功。Android v6描画の証拠ではない |
| piece-export-pods／118065114125、piece-export-android／118065114465 | job成功。ただし依存変更なしのため依存compileのstepはSKIP。export compileを今回再実行したとは扱わない |
| piece-ios-rn-canvas／job118065114426 | 全11reportを回収し、exit65／failure。baseline3/5・supplemental0/3・raw3/3。完成PNG6枚 |

[実RN job118065114426](https://github.com/MassyuRed/Cocolon/actions/runs/39254155962/job/118065114426)のcheckoutは上記sourceと一致します。元Card5・補足Card3・raw診断3の名前／順序／本文／recipe／分母を維持しました。全11でbody_preserved=true、elapsed_msは8000未満ですが、拒否して8秒内に終了した5件は8秒内描画成功ではありません。時刻は従来どおりfit照合後・PNG生成前です。

| 集合／case | 判定 | elapsed_ms | 最終font／本文行数 | accepted検査／PNG |
|---|---|---:|---|---|
| baseline essay_paragraphs | native_checked | 5786.850791 | 44pt／3行 | 4／あり |
| baseline quote_unicode | native_ink_overflow | 1167.024541 | 64pt／3行 | 0／なし |
| baseline declaration_no_brand | native_checked | 872.482834 | 56pt／3行 | 3／あり |
| baseline essay_max420 | native_ink_overflow | 4987.793458 | 36pt／18行 | 0／なし |
| baseline saved_essay_canvas（v3） | native_checked | 349.904333 | 48pt／5行 | 6／あり |
| supplemental suffix_latin_ligature | native_ink_overflow | 287.480333 | 56pt／1行 | 0／なし |
| supplemental suffix_arabic | native_ink_overflow | 356.839667 | 56pt／1行 | 0／なし |
| supplemental suffix_max420_a | native_ink_overflow | 2178.468042 | 36pt／17行 | 0／なし |
| raw suffix_spaces_raw | measurement_checked | 98.538000 | 48pt／1行 | 1／あり |
| raw suffix_hebrew_raw | measurement_checked | 90.377375 | 48pt／1行 | 1／あり |
| raw suffix_mixed_bidi_raw | measurement_checked | 103.214875 | 48pt／1行 | 1／あり |

成功previewはessay／declarationの2件だけで、同tokenのsave_fit_current=true、wrong-token=false、handle keys=[isCurrent]を確認しました。失敗preview5件とsaved v3はhandleなしです。全Card8件のstate_can_save／state_can_exportはfalse。rawには保存／export状態やfit handleがなく、診断を正式admissionやPiece保存へ換算しません。essayは旧48pt／5行から44pt／3行、declarationは旧72pt／5行から56pt／3行へfallbackしたため、成功2件でも旧表示を維持したという結論は出せません。

**高さ境界での拒否。** quoteの最終body index2ではonLayout box高86.99998474121094に対してink下端87、Latin index0は75.99998474121094に対して76です。両420のbody index1／4／8／14も、box高55.99998474121094／55.999996185302734／55.99999237060547／55.999969482421875に対し、ink下端は56です。記録値でのown-view超過は下端だけで、独立5値・元本文幅・glyph・wrapの条件は通っています。両420のgroups・選択行独立5値・paddingを引いたTextKit inkはv5最終値と同じです。mixed420はrejected inspection19件、あ420は18件を同じ最終operationから記録しましたが、accepted inspection／current fit／完成PNGはありません。

このboxはonLayoutで得たsnapshotの値です。既存decoderはnative wireのboxとの±0.5の整合確認後、このsnapshot高でink包含をstrict判定します。失敗時のnative wire高さそのものは残らないため、失敗した全UIView.boundsも同じ小数高だったとは断定しません。§78.1の「縦方向保持」は実装時の意図であり、実際の高さを維持したという証拠ではありません。新しいheight=lineHeightはRN/Yogaの自然Text計測を外す構造です。pinned RNの自然計測にはusedRectのpixel切上げ＋0.001、Yogaには絶対上下端を個別に丸めてから差を取る処理があります。固定高によって小さな不足が露出した説明はsourceに支持されますが、heightだけを解除した比較実行はなく、唯一原因・解除だけでの治癒は未確認です。

**Arabicの別の縦方向超過。** 最小56pt／lineHeight76で、本文raw TextKit inkは[83.12109375,0,421.5358552932739,84.51171875]です。paddingを引くと[-12.87890625,0,325.5358552932739,84.51171875]となり、元の式による横幅338.4147615432739は888以内、raw左端もown-view内へ戻りました。一方、TextKit高84.51171875はlogical lineHeight76を**8.51171875**超えます。独立CTLine高57.61328125は76以内ですが、TextKitを置き換える根拠にはしません。記録box高75.99998474121094を正確な76へ直しただけでも行高／own-view両条件は失敗します。brandingはoverflow=falseで、今回の最終拒否は本文です。Arabicには完成PNGとnative capture geometryがなく、実画素の見た目は未確認です。

**raw RTLの改善。** spaces／Hebrew／mixed bidiの3件すべてで、原文とnative_textsの一致、same_selected_text_node、1行の独立検査、diagnostic_valid／native_canvas_validを確認しました。実native viewは1080×75、contentFrame=[96,0,888,75]、TextContainer=888×75です。Hebrewのlocal inkは[84.9609375,0,316.96875,75]、位置反映後canvas inkは[95.9609375,96,327.96875,171]。mixedは[73.5234375,0,441.6796875,75]／[95.85677146911621,96,464.0130214691162,171]。rawLeftのstate commit後の描画で、own-viewと既存canvas余白許容差0.5の両方を満たします。本文下限未満の診断文字列であり、Arabic Cardや全RTLの成立を代用しません。

artifact12187029713は94,755,619 bytes、SHA256 3ebd2177400a715c811e42f5f2ce77c6be94aafd351c6836d5a7692021b60890です。ZIPを実取得してdigest一致を確認し、results.jsonの全11objectがジョブログ全文配列と一致しました。今回のジョブログにPIECE_RN_CASE markerはなく、results.jsonの配列から抽出した記録です。manifestに11report全値・log/result/PNG hashを保持します。元artifactの期限は2026-10-26T13:07:08Zで、PNG binaryを文書へ複製したものではありません。

完成6枚を原寸で目視しました。essay／saved v3は1080×1350、declarationは1080×1920で、本文・段落・余白・branding有無を確認し、明白な文字切れは見られませんでした。raw3枚は1080×320で、Hebrew／mixed／spaceを含む元文字列の描画と余白を確認しました。失敗Card5件のPNGは存在しません。目視は上記画像に限定し、端末matrixや未生成のArabic／420画像を合格にしません。

### 78.4 採否・次の製品上の未完了

**V6_UNADOPTED_STOP。** 限定した実装・一度の実RN・結果確認は完了しましたが、横paddingの部分改善だけでRTL修復を完成扱いにしません。v6の420条件は不成立で、v5の過去成功は§77に残す履歴です。sourceは未採用のDraft候補として保持します。結果後はこの入口／manifest／current map／weeklyの既存4文書だけを更新し、製品・test・workflowの追加変更、同source再実行、8秒／包含／行高の緩和は0です。

次の最初の製品作業は、既存Card／RN／TextKitで縦方向の描画と実測boxが食い違う原因の確認・修復です。固定heightによる自然計測回避の影響と、ArabicのusedRect高76に対するboundingRectForGlyphRange高84.51171875を別々に追います。baseline offset、原fontとfallback glyph、行fragmentと実描画範囲のどれがArabicの直接原因かは未確定です。自然計測へ戻す案は横の内幅を保てる構造ですが、contentFrame高がlogical lineHeightと±0.01で一致するというv6 harnessの前提まで維持できるとは限りません。TextKitを独立CTLine値へ置換したり、欠けを許容して通す方針にはしません。

描画の未達解消後に残る本線は、既存renderer ownerで版／platform／layout-measurement／catalogを固定し、採用版のsaved再表示を揃え、InputScreenから既存hostの正式isSaveAdmitted供給と同mount/token fitを接続することです。既存controller／APIによる通常初回保存→同owner詳細GET・履歴再表示は未完了です。flags／TTL／renderer値だけでnative admissionを代用せず、saved v3の成功をsaved v6の証拠へ換算しません。新controller／DTO／schemaの再作成や既適用DB6件の再適用は不要です。物理端末受入れを接続source準備の事前条件に増やしませんが、正式商品採用・稼働切替・署名配布・main mergeとは区別します。

この結果反映でAPI／DB／実flag／env／deploy／署名／配布／main mergeの効果0、正式admission／通常保存／physical acceptance=false、automatic progression=falseを保持します。current map §65.26.1・weekly §5.6.6・manifest v85を同じ結果単位で同期します。
## 79. 2026-10-20 JST — v7の自然Text高さ修復と同operationのArabic原因確認

### 79.1 開始時の判断・変更範囲

Mash様の新しい「Pieceの残件作業を進めて」に基づき、華恋がhead c0576dbd0cea68028175ff9f83bbc5fbe07c9adeから再開しました。全体設計01/01A/01B/01C・全国民制・全file indexとrecursive tree1901件・Piece入口/manifest/current map・最新weekly20261017・mandatory incidentを確認しています。Rule18の2026-09-24追補と§11.3 LEVEL_2、weekly §5.6.1〜5.6.3に基づく既存契約内の修復です。旧v6の一度の検証を再試行する作業ではありません。PCE5 Render Reproducibility §7に従い、視覚的修復を新しいpreview版へ固定します。

原因候補は二つに分けます。quote/Latin/両420はsnapshot高の微小不足によるown-view拒否で、v6のheight指定がpinned RN0.77.3の自然計測を省く構造を確認済みです。ArabicはTextKit高84.51171875がlogical行高76を超え、同じheight解除だけで治ると断定できません。属性font/baseline/glyph位置の未観測値を推測で埋めません。

対象は既存Draft PR30・同branch、次の11pathです。

- components/piece/PieceVisualCard.js
- features/piece/pieceLayout.js
- features/piece/pieceMeasuredWrap.js
- tests/piece-v2-renderer.test.js
- tests/native/piece-rn-canvas-entry.js
- tests/native/piece-rn-canvas-fixtures.cjs
- tests/native/piece-rn-canvas-ios.m
- Cocolon_Piece/00_read_first.md
- Cocolon_Piece/manifest.json
- Cocolon_前提資料/current_structure/02_piece_current_structure.md
- Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md

製品は既存Card/layout/B9の3fileだけです。明示v7のselected body Textからheight指定だけを外し、外幅1080・横padding96/108・実内幅888/864・parentのlogical行高・元位置計算を保持します。旧v6の固定高さ、旧v3/v4/v5、probe/prefetch/brandingは保持します。v7はiOS preview限定で、既存native_candidates.v5／native_selected_line.v1へ明示対応させ、saved/export/Android v7は拒否します。catalog/font/本文/段落/禁則/全range探索/独立5値/元8秒・同node/token/generationを変えません。

native製品sourceとdecoderは未変更です。Textの自然box高とlogical描画行高を分離し、既存のbox整合許容差0.5を保ったまま、raw inkのown-view包含、元本文幅、TextKit行高、独立寸法をstrictに検査します。自然viewが少し高くなっても、logical行高を超えるinkを受理しません。

### 79.2 実装・local検査と一度の実RNで確かめる条件

既存13 JS suiteはNode24.19.0／TypeScript5.2.2、test-isolation=noneで896 PASS、FAIL/SKIP0です。既存888を保持し、8回帰で旧v6との差、自然box高とlogical ink高、両ratio/全format、記録済み微小不足のstrict拒否、Arabicの行高超過、独立値、現在node/token/generationと元期限を確認しました。最初の全suite実行は一時環境のTypeScript不在で完了できず、CIと同じ5.2.2を復元して全件を確認した結果です。合成計測の成功を実RNの描画成立へ読み替えません。

既存RN harnessの本文/recipe/順序・基準Card5/補足Card3/raw3の分母を維持し、previewだけv7へ更新します。raw Textもheight指定を外して製品の自然高さへ揃えます。native captureでは実view/contentFrame/containerの高さ同士を0.01で照合し、logical高との差は既存0.5以内、実TextKit ink高はlogical高以下をstrict確認します。旧v6の固定高さ用capture条件は保持します。

Arabicの観測は既存native harness内のtest-only wrapperです。元inspectSelectedLineを一度呼び、元main UIBlockのresolve内で同じtag/view/storage/layoutの文字属性・baseline・glyph位置とbounds・元wireを読み、同じwire objectを無変更で一度返します。追加bridge呼出し/別UIBlock/再inspect/CTLine/ensureLayout/製品wire fieldは追加しません。対象は既存「مرحبا بالعالم」と72/64/56ptだけで、既存reportへ添付します。観測時間も元8秒内に含み、例外は診断内で処理し、元methodをfinallyで復帰します。属性のstorage_fontを未観測のactual fallback fontと呼びません。

新sourceのpushで動く既存CIを一度確認します。JS/native129/source compileと、実RNの基準5・補足3・raw3、同状態PNG、同mount/token fitをそれぞれ照合し、失敗を除外した全体合格にしません。同source再実行・元8秒延長・行高/包含/独立値の緩和は行いません。現在はSOURCE_READY／LOCAL_JS_VERIFIEDで、実RN修復・420・Arabic・正式admission・通常保存・物理端末受入れは未確認です。

10/20の方式判断、10/22の通常保存、10/23の共有確認への影響はweekly §5.6.7に集約します。描画成立後も既存renderer ownerの採用版固定・同版saved再表示・InputScreen→既存hostの正式admission供給・既存controller/APIによる通常保存→同owner詳細/履歴が残ります。接続source準備へ物理端末の事前gateは追加しません。今回のAPI/DB/flags/env/deploy/署名/配布/main merge効果0、canSave/canExport=falseを保持します。
### 79.3 一度の実RN結果 — 自然高さの回復、Arabicと8秒は未達

実装sourceは [`0b24ce7dc44cafa72666b266325c20dedab5e097`](https://github.com/MassyuRed/Cocolon/commit/0b24ce7dc44cafa72666b266325c20dedab5e097)、tree 0cdc3238c52d02d6ceedd2f80f49532bbbeb301dです。§79.1の製品3／test4／既存文書4、計11pathだけを変更し、remote全内容を準備原文と照合済みです。このpushによる既存[run39333428161 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39333428161)を一度確認しました。

| 検査owner | 同sourceの実結果 |
|---|---|
| piece-rn-contracts／job118336948193 | CI JS896 PASS、FAIL／cancel／SKIP／TODO 0。local896と同じ集合で加算しない |
| piece-ios-source／job118336947872 | 製品Objective-C++ compile・project lint成功。旧97＋v5追加32＝native129 PASS、FAIL／SKIP 0。native製品blob030e527024433494c2a4b985164220d980a2d7baを保持 |
| piece-android-source／job118336948188 | 既存Android bridge source compile成功。Android v7描画の証拠ではない |
| export-pods／118336948207、export-android／118336948195 | job成功、依存変更なしのためcompile工程はSKIP。今回の依存compile再実行とは数えない |
| piece-ios-rn-canvas／job118336948201 | 全11reportとPNG10枚を回収。exit65／failure。元8秒を含む合格baseline4/5・supplemental2/3・raw3/3 |

実RNはRN0.77.3、Xcode16.4、iPhone 17 Pro／iOS26.2 Simulatorです。物理端末の受入れではありません。元Card5・補足Card3・raw診断3の名前／順序／本文／recipeを維持し、全11でbody_preserved=true。baselineのnative geometryは5/5ですが、mixed420の時間超過を含めると合格4/5です。rawは下限未満文字列の診断であり、Cardへ合算しません。

| 集合／case | 元のphase・全条件判定 | elapsed_ms | font／本文行数 | accepted検査／PNG |
|---|---|---:|---|---|
| baseline essay_paragraphs | native_checked | 2135.776209 | 48pt／5行 | 6／あり |
| baseline quote_unicode | native_checked | 436.830750 | 80pt／3行 | 4／あり |
| baseline declaration_no_brand | native_checked | 332.983667 | 72pt／5行 | 5／あり |
| baseline essay_max420 | native_checked／8秒超過 | 8018.126875 | 36pt／18行 | 19／あり |
| baseline saved_essay_canvas | native_checked | 423.746000 | 48pt／5行 | 6／あり |
| supplemental suffix_latin_ligature | native_checked | 197.312625 | 72pt／1行 | 2／あり |
| supplemental suffix_arabic | unavailable／native_ink_overflow | 455.343334 | 56pt／1行 | 0／なし |
| supplemental suffix_max420_a | native_checked | 3904.686458 | 36pt／17行 | 18／あり |
| raw suffix_spaces_raw | measurement_checked | 102.944500 | 48pt／1行 | 1／あり |
| raw suffix_hebrew_raw | measurement_checked | 121.847416 | 48pt／1行 | 1／あり |
| raw suffix_mixed_bidi_raw | measurement_checked | 232.663208 | 48pt／1行 | 1／あり |

**高さ境界修復の実証。** quote／Latin／mixed420／あ420は、v6で失敗したstrictなown-view包含を通り、実native captureまで成立しました。両420では本文・全rows・選択行独立5値・raw TextKit ink全4値がv6と一致しています。旧失敗行index1／4／8／14の実view高は56.33332824707031／56.33333206176758／56.333335876464844／56.333343505859375で、同じink下端56を含みます。各行のview／contentFrame／TextContainer高は一致し、外幅1080、内側原点96、内幅888、logical行高56、ink高56を維持しました。inkの丸めや判定緩和ではなく、RN自然計測へ戻した実高さの回復です。

essayは48pt／5行、quoteは80pt／3行、declarationは72pt／5行、Latinは72pt／1行へ戻りました。v6でのessay44pt／3行、declaration56pt／3行と、quote64pt／Latin56ptでの拒否から回復しています。v5とfont／rowsが一致してもPNGの画素同一性は主張しません。v5記録hashと今回のPNG10枚を比較するとsaved v3だけが同一で、残り9枚は異なります。

**mixed420の8秒未達。** final reportは8018.1268750000745msで、既存8000未満の条件を18.126875000074506ms超えました。native_checked:3をpollが最初に観測した時刻は7948.190166000044msで、その後、2回のrequestAnimationFrameによる同snapshotの安定確認、preparePieceNativeCard、同token／誤tokenのisCurrent照合を経てreportを記録します。差69.93670900003053msの処理別時刻はなく、2RAFまたはfit照合だけを原因とは断定できません。受入時刻は従来どおりfit照合後・PNG生成前で、7948msへ付け替えません。

Cardはnative_checked到達後に描画deadline timerを解除し、現在性handleのisCurrentは描画開始から8秒経過したこと自体を失効条件にしません。harnessのperformance.now起点とCardのDate.nowによる開始差も未記録です。従ってcurrent_fit=trueとreportの8秒超過はsource上両立しますが、時間内完了には数えません。420の探索rangeは各font88410、metric11381で維持され、全4fontを実行しました。候補計測／adapter／planは重なりや待ち時間を含むため、単純合計をcritical pathやnative CPU時間とは呼びません。

同tokenのfit handleはnative_checkedとなったpreview6件でisCurrent=true、wrong-token=false、keys=[isCurrent]です。そのうち全条件合格は5件、mixed420の1件は時間未達です。Arabicとsaved v3にはhandleがなく、全Card8件のcanSave／canExportはfalse。raw3件には保存／export／fit fieldsがありません。この結果はdirect Cardの局所fit確認であり、正式admission・InputScreen初回保存の成立ではありません。

**Arabicの同operation実測。** 72／64／56ptで、それぞれ元inspectSelectedLineのresolve内・同main UIBlock・同tag／view／storage／layoutから観測できました。各operationの元wireを無変更で返し、そのink／view高と観測値の一致、独立5値のdecode、最終56ptとrejected inspectionの一致を確認しています。

| font | logical行高 | 実view高 | TextKit bbox高 | logical超過 | baseline offset | Arabic storage font高 |
|---:|---:|---:|---:|---:|---:|---:|
| 72 | 98 | 98.33332824707031 | 108.80078125 | 10.80078125 | 4.28125 | 89.4375 |
| 64 | 87 | 87.33332824707031 | 96.65625 | 9.65625 | 3.75 | 79.5 |
| 56 | 76 | 76.33332824707031 | 84.51171875 | 8.51171875 | 3.21875 | 69.5625 |

56ptのraw inkは[83.12109375,0,421.5358552932739,84.51171875]、contentFrame=[96,0,888,76.33332824707031]、usedRect=[0,0,265.63412046432495,76]です。独立CTLine高57.61328125はlogical76以内ですが、TextKit bbox高84.51171875は自然view高をも8.178390502929688超えます。自然計測だけでArabicは回復しません。

storageの文字range[0,5]／[6,7]は.SFArabic-Regular、空白[5,1]は.SFUI-Regularです。baseline offsetは全fontで(logical行高−Arabic UIFont.lineHeight)/2とexact一致し、56ptのglyph baselineもascender56.0546875＋offset3.21875＝59.2734375です。「Arabic fontを見落としてLatin高でbaselineを決めた」という説明は今回の観測には支持されません。

14個のArabic glyphはdrawsOutsideLineFragment=trueで、56ptではすべて相対x−12.87890625・width100.16015625・y0・height84.51171875という共通の個別bboxを持ちます。空白glyphだけは高76です。空白も含む全15glyphで上記flagはtrueのため、flag単独を縦方向の実画素超過の証拠にはしません。これはglyphごとの輪郭を超えるfont共通の範囲を返している可能性を示しますが、実描画画素が同じ量だけはみ出した証明ではありません。storage fontを未観測の実fallback draw fontと同一視せず、独立CTLineでTextKit判定を置き換えません。Arabic PNGはなく、実画素の成立も未確認です。

**artifactと画像。** artifact12226916713は64,036,082bytes、SHA256 ae9d4996d7f3ef2e9117d0e37b17881a9a25cddea0e53f58ca64b7abcb808d9f。ZIP実取得後にdigestを照合し、results.json（186,022bytes、SHA256 12eaf6364d055cfa435325dc31eeba4bf824ad17c87453a6b108eaa6803d814e）の全11objectがジョブログ全文配列と一致しました。manifest v87へ未加工report・元wire／全glyph属性・trace・log/result/PNG hashを保持します。artifactの期限は2026-10-26T22:36:10Zで、PNG binaryをmanifestへ複製したものではありません。

Card7枚とraw3枚の計10枚を原寸で目視しました。essay／saved v3の段落、quoteの日本語／結合文字／絵文字、declarationのbrandingなし、Latin、両420の全行、rawのspace／Hebrew／mixed bidiを確認し、明白な文字切れやbrandingとの重なりは見られませんでした。Cardは1080×1350または1080×1920、rawは1080×320です。mixed420の画像成立と時間不合格を併記し、未生成Arabic・物理端末matrixを目視合格へ数えません。

### 79.4 10/20の採否と次の製品作業

**V7_UNADOPTED_STOP。自然高さ修復と一度の結果確認は完了しましたが、v7は正式採用できません。** 高さ回帰の回復は部分成果です。ArabicのTextKit範囲問題とmixed420の元8秒未達が残り、全RTL・420条件・正式admission・通常保存は未成立です。旧版とv7sourceをDraft候補として保持し、結果後は既存4文書のみを同期しました。同sourceの再実行、製品／test／workflow追加変更、期限・行高・包含条件の緩和は0です。

次の最初の製品上の未完了は、既存RN／TextKit／PieceTextMetricsのArabic glyph描画範囲と、返される共通bboxの関係を解決することです。新証拠によりbaselineのfallback見落としを前提にした修正は選びません。実layoutとglyph位置を維持して実描画を過小評価しない根拠を持つ修復が必要で、使用API・計測契約の置換が必要なら既存契約との差を具体化して方式判断します。現Cardはready前のcanvasをopacity=0とし、unavailableでsubtreeを外すため、受動的なdraw hookを足すだけで拒否Arabicの描画証拠が得られる保証はありません。同mounted Textのdraw機会・追加描画の作用を踏まえて次の検証範囲を具体化し、未観測の画素成立や理論上の代替だけで採用しません。

mixed420は最終安定確認／fit照合まで含む現8秒に余裕がなく、既存候補生成・decoder・B9・再検証の実処理を同一本文／全range／全font条件で改善する必要があります。時刻の付替え、選択候補削減、probe／prefetchやquality gateの省略では解決扱いにしません。今回のtraceだけから特定一処理を唯一原因とは断定しません。

通常保存の残件は既存ownerへ接続します。InputScreenは既存InputPieceActionAreaへ正式isSaveAdmitted供給をまだ渡しておらず、局所fitのCard→Modal→host経路だけが存在します。採用版のsaved readerは許可version・saved key・描画profileの3箇所を揃える必要があり、許可listだけをv7へ増やして旧v3描画へ流す実装は不可です。既存PieceCreateController→POST /emotion/piece/save、owner履歴→GET /emotion/piece/{id}→saved Cardはsourceにあります。新controller／DTO／schemaの再作成ではなく、採用版・正式admission・稼働値との整合を保って通常初回保存→同owner再表示の実動作を閉じます。source接続準備へ物理端末の事前gateを追加しませんが、実稼働のflag／TTL／renderer／認証round-trip・物理端末の受入れは未検証です。

10/20の判断はv7不採用です。10/22の通常保存・10/23の共有確認は未達前提を抱えるため、実施済みや延期承認へ読み替えません。API／DB／実flag／env／deploy／署名／配布／main merge効果0、既適用DB6件の再適用0。current map §65.27.1・weekly §5.6.7・manifest v87を同じ結果へ同期します。

## 80. 2026-10-20 — v8の内部処理短縮と同一Arabic描画の直接観測

### 80.1 今回の実行範囲

Mashの10/20「Pieceの残件作業を進めろ」と既存GitHub／Supabase許可、Rule18 §0のGPT-6 Astra Pro主体および§11.3の委任内修復を継承します。v7を採用済みにせず、§79.4の二つの未達を既存ownerで進めます。

| start record | 今回の具体値 |
|---|---|
| product_destination | 本人の同一Pieceを通常画面で描画・明示保存し、同じ本文を開き直せるP-W1へつなぐ |
| current_gate_or_subgate | P-W1 / B10_WITH_B12C_ADOPTION_BOUNDARY |
| exact_work | 同契約の内部重複処理を減らす明示iOS preview v8と、拒否Arabicの同layout描画2画像を既存harnessで取得 |
| scope_classification | LEVEL_2 / OBSERVED_BLOCKER_MINIMAL_FIX |
| approval_or_delegation_basis | 10/20の直接再開指示、Rule18 §0・§11.3、weekly §5.6.1〜5.6.3。既承認の操作を再確認しない |
| execution_owner | GPT-6 Astra Pro 華恋。GitHub書込はroot一人、分担は原因調査・差分reviewのみ |
| success_credit | 最終照合込み420時間の改善とArabicの描画原因の確定。診断画像や検査数を正式保存完成へ換算しない |
| completion_condition | 新sourceをGitHubへ反映・全変更path内容照合し、既存CI一度の全11reportと画像を確認して同4文書へ結果保存 |
| stop_condition | 同source再実行や条件緩和で通さない。新計測契約が必要なら実画素・元wire・具体差分で方式判断。補助経路の増設はDETOUR_RISK_STOP |
| prohibited_scope | 全range／font順／B9 score／本文／recipe／独立5値／元8秒／same node・token・generationの弱化、未採用版のadmission、DB再適用、無関係なAPI・runtime・署名・配布変更 |
| next_product_read_or_mash_decision_point | 実RN画像を華恋が読み、実処理改善の結果とArabicの描画範囲を確認。計測契約の置換が必要な場合だけ差と案を具体化 |
| current_source_test_receipt | PR30 head6c2da880、製品source0b24ce7d、v7 run39333428161、入口79.3〜79.4の全結果、既存13 JS suiteとnative129 |
| current_docs_and_heads | Piece入口／manifest v87、overall structure 01・01A〜C、national system 02・02A〜B、全file地図とhead tree1901件、最新weekly20261017 §5.6.7を関係ownerと照合 |
| affected_current_structure_maps | current_structure/02_piece_current_structure.md §65.28、STRUCTURE_MAP_DELTA_PRESENT |

追加購入・新しいMash操作は0です。実装・検査・既存CI一度・結果保存を一作業単位とし、CI待ちを含む実行時間は結果に記します。System Context prepareは、この環境の部分取得sourceではcocolon_context_prepare module不在により一度失敗しました。System Context自体の故障とは扱わず、同read_firstで許可されたexact head原本の直接読取へ移りました。新しいhelperの復元を製品修復の前提にしません。

### 80.2 製品差分と保持する判定

PieceVisualCardのinspectDrawingは、inactive／検査対象外phase／同snapshot検査済みを先に返し、実行しない操作での正文・payload・recipeの再検証を省きます。measureも既存planning除外をprepareの前へ移し、syncDeadlineはbindingと対象phaseを先に確認します。実際のrender、候補採用、非同期完了、最終fitでのhash・expiry・現在性の再検証は残します。可変propsを参照同一性だけでmemoizeしません。

B9は全n(n+1)/2 rangeを従来どおり受領・検証し、同じ禁則と厳密な幅条件を満たすendをstartごとに記録します。元から不採用となるedgeへの重複判定だけをDP内から除き、endの昇順、tie、8項目score、非単調幅、独立した高さ条件と制約付きallocatorを保ちます。入力tableが逆順でも同じ結果となり、不正な未選択rangeも拒否します。nativeの候補生成／転送／decoderは変更していません。

新しい未採用版をpiece.rn_native_preview.prototype.v8で識別します。v7と同じ自然Text高、外幅1080、横padding96/108、内幅888/864、logical行高、既存v5候補とselected_line.v1検査を使います。旧v6固定高と旧版を保持し、v8のsaved／export／Androidは拒否します。元8秒、最終2RAF安定確認、同token／誤token fit照合と受入時刻を変えません。

### 80.3 Arabicの診断と検証状況

既存native harnessのArabic同operation観測へ、同じTextStorage／NSLayoutManager／TextContainer・glyph範囲・contentFrameから透明画像を2枚描く処理を追加します。同じ拡張整数extentで、全glyphを描く画像と元view.boundsでclipした画像を作り、72／64／56ptを既存evidence directoryへ保存します。有限座標・正の寸法・4096上限を確認し、描画前後のattributed stringとgeometryを比較します。画像取得後はalpha>0の全画素で空画像・外縁到達・元view内外の差を調べます。

これは追加のoffscreen描画を伴う診断です。受動的読取だけとは呼びません。元inspectSelectedLineは一度、元wire objectとresolveは無変更、別bridge／UIBlock／再inspect／ensureLayout／CTLine計測は追加しません。画像作成・保存時間も元observation_msと8秒に含まれます。透明診断PNGを完成Arabic Cardや正式rendererの証拠へ置き換えません。

修正前の描画・B9 207件はPASS。修正後はNode24.19.0で、既存13 suiteのうちTypeScript依存2 suiteを除く11 suite **797 PASS／FAIL・SKIP0**です。今回追加した4検査はv8の版境界、v7と同じplan／描画／最終fit、古い結果の失効、全Python B9 oracleの正逆row順です。InputScreenとowner-historyの2 suiteはローカルTypeScript不在のため未実行であり、既存CIのTypeScript5.2.2で全13 suiteを実行します。797を過去896へ加算しません。

10/20 13:05 JST以降の継続で、既存TypeScript5.2.2を再発見しました。最初の通常isolation起動は詳細理由を伴わないfile単位2失敗で終了し、その後、部分取得から欠けていた既存screen依存7fileを現在のGitHub head6c2da880のblobと照合して補完しました。製品sourceを変更せず、前回と同じisolation noneで未実行2 suiteを実行し、103 PASS／FAIL・SKIP0、8576.381702msを確認しました。先行11 suite797と合わせ、同じv8 sourceのlocal coverageは全13 suite900件です。最初の起動失敗を隠さず、単一原因に断定しません。GitHubでは全13 suiteを既存CIの起動条件で確認します。

この保存時点はSOURCE_READY／LOCAL_13_SUITES_VERIFIED、実RN結果待ちです。Arabic修復・420時間合格・正式admission・通常保存再表示はまだ未成立です。Supabase cocolon-projectではPiece用6 migrationの既適用を履歴から再確認し、再適用・business RPC・本人Piece行取得・設定変更は0。既存API保存controller、同owner詳細GET、InputScreenの正式供給と同版saved再表示が続く本線です。

### 80.4 GitHub反映と一度のCI実行

上記のsource準備状態を完了し、10/20 13:18 JSTに[ef96dc5b152d0ad2cc5bb8dd8a83ed988ba259f0](https://github.com/MassyuRed/Cocolon/commit/ef96dc5b152d0ad2cc5bb8dd8a83ed988ba259f0)をPR30の既存branchへ反映しました。parentは6c2da880868b3044b104198d68b652c8ef277a18、treeは31d3fa4bfa11f2e4777e71cae5ebb9ce74ba80d6です。製品3・検査5・既存資料4の計12pathだけが変わったこと、更新後のbranch ref、全12fileのGitHubからの全文読み戻し一致を確認しました。ローカル変更や接続確認だけを反映済みと呼んでいません。

同sourceの[既存CI run39368845949 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39368845949)はpushから一度だけ起動しました。全13 JavaScript suiteはCIでも900 PASS／FAIL・SKIP・CANCEL0、11156.222292msです。これはlocalの900件へ加算する件数ではありません。Androidの既存native source compile、iOSのObjective-C++構文検査とproject lintは通過しました。export用Pods／Android libraryのjobはsuccessですが、依存変更がないため当該compile stepはSKIPであり、今回の再compile成功に数えません。

iOS native単体job118451844863はexit1で未完走でした。legacy97の正式summaryと追加18件のPASS行、計115 PASS行／個別FAIL行0までは取得しましたが、残る14件と最終129件summaryはありません。最後はkey予算の検査がPASSした後、A＋結合アクセントを420回繰り返すUTF-16予算caseのlayout_readyまでです。終了確認はsummary不足を報告しましたが、nativeの具体的終了原因を示すstacktrace／signal／OOM情報はありません。製品native・単体test・shim・workflowは取得元6c2da880と同一で、v8の別canvas診断はこのbinaryへ入りません。したがって原因をv8回帰・環境故障のいずれにも断定せず、過去の129 PASSを今回の合格へ流用しません。同sourceの再実行は0です。

### 80.5 実RN結果 — 元8秒内へ改善し、既存10画像を保持

run39368845949は2026-10-20T04:18:06Z開始、04:46:52Zにfailureで完了し、経過28分46秒でした。実RN job118451844935のexit65は、xcresult上の1 XCTestに記録されたArabicの7 assertion失敗に対応します。phase、canvas、capture、fit、handle keys、inspection件数、通常PNGの各条件です。7回の再実行ではなく、実テスト本体は24.08535099029541秒、0 unexpected failureです。元11reportを全て回収し、分母・順序・本文・recipeを保持しました。

| 集合／case | 最終phase／判定 | elapsed_ms | font／本文行数 | 通常PNG |
|---|---|---:|---|---|
| baseline essay_paragraphs | native_checked／成功 | 1815.069333 | 48pt／5行 | あり |
| baseline quote_unicode | native_checked／成功 | 500.642333 | 80pt／3行 | あり |
| baseline declaration_no_brand | native_checked／成功 | 328.239709 | 72pt／5行 | あり |
| baseline essay_max420 | native_checked／成功 | 5172.852042 | 36pt／18行 | あり |
| baseline saved_essay_canvas | native_checked／旧saved v3成功 | 251.435166 | 48pt／5行 | あり |
| supplemental suffix_latin_ligature | native_checked／成功 | 147.033333 | 72pt／1行 | あり |
| supplemental suffix_arabic | unavailable／native_ink_overflow | 352.844083 | 56pt／1行 | なし |
| supplemental suffix_max420_a | native_checked／成功 | 2452.123250 | 36pt／17行 | あり |
| raw suffix_spaces_raw | measurement_checked／診断成功 | 100.556458 | 48pt／1行 | あり |
| raw suffix_hebrew_raw | measurement_checked／診断成功 | 101.027375 | 48pt／1行 | あり |
| raw suffix_mixed_bidi_raw | measurement_checked／診断成功 | 109.450125 | 48pt／1行 | あり |

元8秒を含むbaselineは5/5、補足は2/3、raw診断は3/3です。成功preview6件は同token fit=true、誤token=false、handle keys=[isCurrent]で、独立5値・一行・font・glyph・幅・高さ・own-viewを元assertのまま満たしました。saved v3には従来どおりfitがなく、rawにも保存／export／fit fieldを付与していません。全Card8件のcanSave／canExportはfalseです。Arabicの8秒内拒否を描画成功へ数えません。

mixed420の最終reportはv7の8018.1268750000745msから5172.852042000042msへ、2845.274833ms／35.4855%短縮しました。あ420は3904.6864580002148msから2452.123249999946msへ、1452.563208ms／37.2005%短縮しました。どちらも元の2RAF安定確認・prepare・同token／誤token fit照合後、PNG生成前の受入時刻です。本文blocks・全rows・plan_groups・font36・sizeIndex3・logical行高56・row_offsets・inspection全値・native_texts・ink frames・native geometry・canvas／余白寸法がv7と完全一致しています。font順48→44→40→36、全88410 range／font、B9合否false→false→false→trueを保持しました。一度の実RNで観測した短縮であり、全量をB9単独の効果や将来の全端末性能へ帰属しません。

artifact12241825184は95,549,205bytes、SHA256 369c72b6fd7e2c9d19919876657526051af91ed43852706d5648567803c6ed03。ZIP実取得後にdigestを照合しました。results.jsonは240,229bytes、SHA256 8cc332f5491dd888fe5115b30299debeb59f519d59a4e87bd153935e06bbf1a6で、全11objectがGitHub job log中の結果配列と一致しています。manifest v89に未加工全report、各PNGのhash、画素解析を保持します。artifactの期限は2026-10-27T04:46:31Zであり、PNG binary自体をmanifestへ複製したものではありません。

完成Card7枚・raw3枚の計10PNGは、全てv7記録のSHA256と一致し、バイト単位で同じ画像でした。今回も10枚を原寸目視し、段落、Unicode／結合文字／絵文字、両420の全行、branding有無、rawの空白／Hebrew／mixed bidiに明白な欠けや重なりがないことを確認しました。これとは別にArabic診断6PNGがあります。後者の各同一pairはバイト一致を確認し、3サイズのexpanded画像を原寸目視しました。完成Arabic Cardの画像は存在しません。

実行環境はRN0.77.3、Xcode16.4（16F6）、build SDK iPhoneSimulator18.5、実行iPhone 17 Pro／iOS26.2（23C54）です。Xcodeの601.194秒は起動待ち・終了処理を含むaction時間で、Cardのelapsedや24.085秒のXCTest本体時間ではありません。launch要求04:36:44.590→起動通知04:44:05.969に約441.379秒を要しましたが、その原因は未確定です。localhost:8081の接続拒否や終了後の接続消失は記録されていますが、同runnerはbundle内JSで11reportと終了summaryまで完了しています。追加のtest起動／再実行や発火したtimeoutを示す記録はなく、設定上のtimeout値を発生事実へ読み替えません。

### 80.6 Arabicの実画素 — 同じ描画は枠内、TextKit bboxは枠外

72／64／56ptの元selected operationで、描画前後のattributed storageとgeometryは全て一致し、元selected_line.v1 wireを変更していません。同じlayout・glyph・contentFrame・fontから得た透明PNGを、scale1の全alpha>0画素について調べました。閾値による薄い画素の除外はなく、画素cell全体の外縁をview座標へ戻した結果です。

| font | logical行高 | 実view高 | 元TextKit bbox高 | 実alpha外縁 [左,上,右,下] | alpha高 | view外画素／extent外縁画素 |
|---:|---:|---:|---:|---|---:|---|
| 72 | 98 | 98.33332824707031 | 108.80078125 | [99,23,429,98] | 75 | 0／0 |
| 64 | 87 | 87.33332824707031 | 96.65625 | [99,20,395,86] | 66 | 0／0 |
| 56 | 76 | 76.33332824707031 | 84.51171875 | [98,18,360,76] | 58 | 0／0 |

各サイズのexpanded／view-clipped pairはRGBA差分0画素、PNG byte列も完全一致です。非透明画素数は5516／4438／3502で、空画像ではありません。診断範囲はviewと元bboxを含む2font分の余白付きextentで、その外縁に画素はありません。診断所要時間19.134083／15.956500／9.411417msは元observationとCardの8秒内に含まれます。

これにより、今回の同layout・scale1局所描画では、TextKitの共通glyph bboxの超過量が実際の画素超過を表していないと確認しました。baseline属性供給の誤りや二重offsetの証拠はなく、行高・view高の微小不足とも別の問題です。元bbox高84.51171875を保ったまま位置を平行移動したりviewだけを広げても、logical行高76以下という条件は満たせません。

ただし診断はready前の非表示状態を迂回してoffscreen描画したものです。現Cardはbbox条件で拒否され、accepted inspection、fit、完成PNGがありません。局所原点でのscale1画素確認を、配置後canvasや全表示倍率、物理端末の成立へ広げません。現実装はnative_checkedへの遷移で初めてrowOffsetsを反映し、既存onLayout snapshotはx/yを保持しないため、実画素を判定に使うなら最終位置での検査も設計対象になります。

### 80.7 採否と、次に必要な計測契約の具体判断

**V8_UNADOPTED_STOP。** source反映・全12file読戻し・一度のCI・全11report／16PNGの取得照合・画素確認という今回の限定作業は完了しました。mixed420の元8秒未達は今回の同条件実行で解消しましたが、Arabicの現契約下の拒否とnative単体14件未確認が残るため、正式採用はしません。結果反映は入口／manifest／本map／weeklyの既存4文書だけで、製品／test／workflow追加変更・同source再実行・条件緩和・DB再適用は0です。

次の提案は、明示iOS preview v9と新しいpiece.native_selected_line.v2に限り、実際の選択行を描く同TextStorage／layout／container／glyphから得たalpha画素範囲をinkとして使うものです。候補探索v5・独立CTLineの5値はそのまま保持し、独立値で描画範囲を代用しません。旧v1と既存版は保持します。bboxで拒否していたArabicを受理し得るほか、ink原点が変わることで配置や選択fontも変わり得ます。したがって単なる診断追加や同じ条件の高速化ではありません。

**個別判断が必要な根拠。** Rule18 §0(4)はPro主体の役割許可を新しい契約・品質条件の許可に広げず、§11.3 LEVEL_3は計測契約／受入条件の置換をMash判断としています。加えて§76.3(6)は「既存TextKit側の拒否条件は緩めません」「位置は既存TextKit ink＋onTextLayout幅から決め」と明記し、§77でその差と停止条件を含めてv5の個別承認を受けています。10/20の継続指示と既存GitHub許可を、当該条件の解除へ暗黙に読み替えません。GitHub反映や今回の結果記録に再承認を求めるものではなく、ここに示す新しいink定義への変更が判断点です。

| 具体案の項目 | 実装・限定検証の範囲 |
|---|---|
| product_destination | 同じ本文と元8秒を保ち、Arabicを含む通常Pieceの採用rendererへ進める。正式保存の無条件開放は含めない |
| native owner | 既存PieceTextMetrics.mm内で選択済み行だけを同layoutでdraw／scan。view boundsとTextKit bboxのunion＋明示guardを含む有限bitmapを1行ずつ解放。全88410候補のraster化、製品でのPNG保存、新serviceは追加しない |
| scale／座標 | 現在の固定1080 logical canvas・scale1を明示。canvas相対の整数bitmap原点で最終位置の小数位相を保つ。UIScreen.scaleだけを採用して親transformを無視しない。responsive表示や全physical scaleの受入れは別途検証が必要 |
| 最終位置の束縛 | 先に局所alphaで配置案を作り、その配置後の同node／token／generation・実canvas相対位置で再検査し、安定した結果だけをnative_checked／fitへ渡す。位置変化を既存width/heightだけのonLayoutで見逃さない。無限の再配置loopは作らない |
| 厳密な失敗条件 | 全alpha>0を対象とし、extent上限・総pixel数・stride・allocation・外縁到達を検査。空画素を正のbboxへ捏造せず、未定義な空白だけの意味はunavailable。staleなnode／位置、geometry変化、期限超過も拒否。own-view・logical行高・元canvas余白を緩めない |
| 時間と品質 | 追加draw／scan／必要なbridge・UIBlock／最終fitを全て元8秒へ含め、起点を戻さず早期解除もしない。本文・recipe・全range・font順・B9 score/tie・独立5値を保持。改行／font／配置の実差は同11fixtureとPNGで明示する |
| 検査 | JS900の既存coverage、native旧129全件と追加する位置／空／外縁／上限／現在性の検査を保持。新source一度の実RNでbaseline5・補足3・raw3、Arabic完成Card、両420、同mount/token fit、配置後画素を確認。今回のnative115を129合格の代用にしない |
| 完了／STOP | 新契約source反映と全文照合、一度の全結果・画像の記録までを一単位にする。8秒・包含・全検査が揃わなければ未採用のまま記録して停止し、同source再試行や基準緩和で通さない |
| 費用・効果 | 追加購入・依存・helper・DB・API・flag・env・deploy・署名・配布・main merge変更0。既存CI使用量と実行時間は増える。今回のCIは28分46秒、既存canvas job timeout45分であり、新実装の8秒達成や作業時間は未実証 |

候補変更先は既存15pathです。製品5件はios/tempCocolon/PieceTextMetrics.mm、features/piece/pieceRenderer.js、components/piece/PieceVisualCard.js、features/piece/pieceLayout.js、features/piece/pieceMeasuredWrap.js。検査6件はtests/piece-v2-renderer.test.js、tests/piece-v2-measured-wrap.test.js、tests/native/piece-text-metrics-ios.mm、tests/native/piece-rn-canvas-entry.js、tests/native/piece-rn-canvas-fixtures.cjs、tests/native/piece-rn-canvas-ios.m。資料は今回と同じ4件です。新しいhelper、controller、DTO、workflowは作りません。v9製品sourceは未実装・未反映で、提案の承認はまだありません。

描画の未達を解消した後のP-W1は、既存renderer ownerの採用版固定、同版saved readerのversion／key／profile整合、InputScreenから既存InputPieceActionAreaへの正式isSaveAdmitted供給と同mount/token fit接続、既存PieceCreateController／APIでの通常初回保存→同owner詳細GET・履歴再表示です。これらは未完了です。既存6migrationや保存APIを作り直さず、接続source準備へ物理端末の追加事前gateを設けません。実稼働・商品受入れ・署名配布は完了にしません。10/22通常保存・10/23共有確認の予定は未達前提を残し、実施済みや延期承認へ読み替えません。


## 81. 2026-10-20 — 承認済みv9の同layout画素計測と配置後検査

### 81.1 承認と今回の完成単位

Mashは10/20 14:31:53 JST、「この判定方式の変更を含むv9の実装と、一度の検証まで進めてよいですか」に「進めていいよ」と明示承認しました。14:55:34 JSTの「処理落ちしているから、続きから再開して」は同じ作業の継続です。§80.7の新ink定義・配置後再検査・既存15path・元8秒・一度のCI・未達時STOPまでが現在の承認範囲です。Rule18 §0(4)／§11.3 LEVEL_3の具体判断はこの承認で成立し、GitHub書込の再承認は求めません。§80.7／map65.28.1／weekly5.6.8の「未承認・未実装」は承認前の履歴です。

実行ownerは華恋／GPT-6 Astra Pro／CHAT_PRO_OK、rootが唯一の書込主体です。並列agentはJS・native・再開範囲の読み取りレビューだけを担当しました。基点は既存PR30のbranch `agent/three-core-cmee-current-structure-20260815`、head `076c0edef425e071c297da2b366776d3e0cf6cd5`／tree `ed0debd98ea5303a8da5899ce17584caf4f859fb`です。

変更は製品5・検査6・既存資料4の計15pathです。製品ownerはPieceTextMetrics.mm／pieceRenderer.js／PieceVisualCard.js／pieceLayout.js／pieceMeasuredWrap.js。検査ownerはpiece-v2-renderer.test.js／piece-v2-measured-wrap.test.js／nativeのpiece-text-metrics-ios.mm・piece-rn-canvas-entry.js・piece-rn-canvas-fixtures.cjs・piece-rn-canvas-ios.m。資料は本入口／manifest／current map／weeklyです。全pathとblob／SHA-256はmanifestのios_preview_v9_20261020へ記録します。

### 81.2 実装した計測・配置の責任境界

| owner | v9で実装した動作 |
|---|---|
| PieceTextMetrics.mm | 新selected_line.v2だけが同じTextStorage／NSLayoutManager／NSTextContainer／glyphをscale1で描き、alpha>0の全pixel cellをinkにします。旧selected_line.v1と旧版のTextKit判定は維持します。独立CTLineの5値を描画inkへ代用しません |
| native request／wire | requestはstage・canvas_tag・expires_at_ms・snapshot_tokenの4field、wireは既存11fieldとstage・tag・canvas_tag・canvas_frame・content_frame・raster_scale・snapshot_tokenの計18fieldです。local tokenを同viewへ短く保持し、placedは成功／失敗とも消費。元storage／layout／container、属性、bounds、content frame、canvas、独立5値、元deadlineが一致しなければ拒否します |
| bitmap／期限 | view boundsとTextKit bboxのunionをfont×2でguardし、canvas相対の整数原点へ拡張。1辺4096以下・総4,194,304pixel以下、provider32MiB以下、8bit alphaのみ、stride／data長／allocation／空／外縁／描画中の変化を検査します。各行で解放し、製品PNG保存・全候補raster化はありません。元wall-clock期限とlocal残余時間からのmonotonic期限を両方確認します |
| pieceRenderer.js | 閉じたv2 schema・実tag・canvas・local/placed段階・小数canvas frame・同token・独立5値の不変を復号時にも照合します。bridge前後の元期限、元own-view・logical行高・glyph・禁則の拒否条件を保持します |
| PieceVisualCard.js | geometry_checked→local計測→positioning→2RAF→placed計測→native_checkedの順です。既存composition／row Viewのtranslationだけで位置を変え、Textのleft／top・Yoga boundsを変えて元TextStorageを作り直しません。localで配置を一度決め、placed中の位置／node／generation変化を拒否します。無限再配置loopはありません |
| 現在性とfit | 同mount／token／generation・canvas・各Text node・placement epochをbridge／await／state更新／最終fitで照合します。onLayoutのx/yも保持。配置後inkを元余白±0.5とbody branding zoneで再照合し、own-viewとlogical高はstrictのままです。元8秒の起点を再開せず、native_checked後もexpiryを保持。最終isCurrent照合を含めて期限内でなければfitを出しません |
| layout／B9 | 明示iOS preview v9だけを既存profile一覧へ追加。候補計測v5・全range・font catalog/順・score/tie・独立5値・本文／recipe・自然Text高は保持します。配置後のstrict境界不適合では元catalogの次fontへ進みます。saved/export/Androidのv9は許可しません |

fixed1080 logical canvas・scale1での定義です。小数位相は実canvas相対原点から保持し、canvas内ancestorはtranslationだけを許します。外側の表示縮尺を含む全physical raster条件・物理端末受入れをこの単体計測で成立させません。alphaが変わる新定義のため、配置や選択fontがv8と変わる可能性は§80.7の承認差に含まれ、実結果で明示します。

### 81.3 反映前検査と一度のCIで確かめる範囲（source時点の履歴）

local Node24.19.0／既存TypeScript5.2.2で、既存13 test fileを `node --test --test-isolation=none` により915 PASS、FAIL／SKIP／CANCEL0、63,446.835935msで完了しました。既存900のcoverageを保持し、renderer14件とmeasured-wrap1件を追加しています。最初の通し実行は849 PASS／66 FAILで、全失敗は未展開の既存AppRuntimeContext.jsのENOENTでした。remote blob `be875054b73593b2a62be6a6dd95110ce176e21d` と同一の元fileを復元し、最終915件を確認しました。このfileにremote差分はありません。途中の追加検査で見つけたstub callback引数の誤りは検査側を修正し、独立したrender styleから配置を計算する検査にしています。

nativeは旧129件を削らず、6 fixture×4判定＋22拒否ケースの46件を追加しました。独立raw RGBA bitmapによるlocal／fractional placedのalpha oracle、旧v1／独立5値、token再利用、空／透明／extent／detached／微小scale／canvas／期限／schema／storage／layout／container／属性／bounds／content frame／allocation／外縁／途中変化を含みます。旧115 PASSの未完走原因は未確定で、元UTF16 budget testへ段階出力を追加しただけです。90秒alarm・既存期待件数・callback時間は維持し、未確認14件を成功にしません。

実RN harnessは元baseline5・補足3・raw3の11fixture・正文・順序・元8秒を維持。preview7件だけをv9へ替え、saved v3は保持します。local/placed証跡、同Textオブジェクト、最終小数frame、独立raw bitmapの全4端点、全canvas marginとlogical高、元same/wrong-token fit、完成PNGを同じ一度の実行で確認します。Linuxでのsource reviewやJS成功をiOS compile／native175件成功へ換算しません。

このsource時点ではGitHub反映後の全文照合・一度のCI・全11reportと完成画像の確認は未完了です。iOS旧129＋新46、Arabic完成Card、両420、全時間・包含・現在性の実結果を同じ既存4文書へ追記します。元条件の一つでも未達ならv9未採用としてその結果を記録し、この限定単位を終了します。同source再実行や合格条件緩和へ進みません。

追加購入・新service・dependency・helper・controller・DTO・workflowは0。API／DB／migration再適用／runtime flag／env／deploy／署名／配布／main merge変更も0。既存CI使用量は増えますが、実行所要時間と元8秒達成はまだ未確定です。正式renderer admission・同採用版saved再表示・InputScreenへの正式供給・通常初回保存→本人GET／履歴は後続の未完了作業として保持します。

### 81.4 GitHub反映と一度のCI — RN全11成立、native単体はリンク失敗

実装は[source `bac29a1d9bf9879cb7d12de79d7d124c892257fb`](https://github.com/MassyuRed/Cocolon/commit/bac29a1d9bf9879cb7d12de79d7d124c892257fb)、tree `3c18da98792c5ffeed78a28c4a4258457acd4593`です。親076c0edef425e071c297da2b366776d3e0cf6cd5から既存15pathだけを変更し、全15blobの全内容をlocalと一致照合しました。branch／Draft PR30のheadも同sourceです。source段階のmanifest v90 blobは`aac1e52504e45af794bd3109987cb0e0e915ef96`。本結果更新は同sourceを親に、既存資料4pathだけを変更します。

限定CIは[run39381252246](https://github.com/MassyuRed/Cocolon/actions/runs/39381252246)、attempt1、2026-10-20 15:35:21〜15:58:27 JST（23分06秒）です。pushによる既存workflowを一度確認し、manual dispatch・再実行は0です。workflow全体はfailureです。

| 検証 | 実結果 |
|---|---|
| local／CI JavaScript | 既存13file、915 PASS／FAIL0／SKIP0／CANCEL0。local63,446.835935ms、CI8,197.716023ms。CI Node24.21.0／TypeScript5.2.2。別実行の件数を合算しません |
| piece-ios-source／job118490626661 | 製品Objective-C++ syntax check成功、pbxproj lint OK。standaloneは実行前のlinkで失敗し、旧129＋追加46＝175件は全件未実行 |
| piece-android-source／job118490626319 | 既存source compile成功。v9 Android採用ではありません |
| piece-ios-rn-canvas／job118490626609 | success。1 XCTest内の既定11reportがすべて成功し、完成PNG11枚を取得。11 XCTestという意味ではありません |
| piece-export-pods／piece-export-android | jobはsuccessですが、依存compileは既存scope判定によるskip。今回の新しいexport実検証へ数えません |
| 同pushの既存phase6-contract-guards | run39381252256、119 passed／warnings5（5.95秒）。自動起動した既存guardで、native175件の代わりにはしません |

standaloneの失敗は、今回PiecePixelCanvasFrameへ追加した`CATransform3DGetAffineTransform`と`CATransform3DIsAffine`の未解決symbolです。既存link commandはUIKit／Foundation／CoreText／CoreGraphicsを指定し、QuartzCoreを直接linkしていません。新しい外部関数の導入と既存link条件の整合を落とした実装側の不備です。GitHub書込障害・旧v8の115 PASS後の未完走と同一原因にはしません。175件のPASS／FAIL集計は生成されておらず、0 FAILを合格とは表現しません。Xcode16.4（16F6）／clang17.0.0／iPhoneSimulator18.5 SDKを使用しました。実RNのテスト先はiOS26.2／iPhone17 Pro simulatorです。

### 81.5 全11report・画像・Arabic・420文字の実結果

| 既存fixture | 経路 | elapsed_ms | font | 本文行数 | 結果 |
|---|---|---:|---:|---:|---|
| essay_paragraphs | preview v9 | 1539.596458 | 48 | 5 | native_checked |
| quote_unicode | preview v9 | 1474.850125 | 80 | 3 | native_checked |
| declaration_no_brand | preview v9 | 449.918375 | 72 | 5 | native_checked |
| essay_max420 | preview v9 | 5533.207459 | 36 | 18 | native_checked |
| saved_essay_canvas | saved v3 | 255.548750 | 48 | 5 | native_checked |
| suffix_latin_ligature | preview v9 | 210.303667 | 72 | 1 | native_checked |
| suffix_arabic | preview v9 | 200.255958 | 72 | 1 | native_checked |
| suffix_max420_a | preview v9 | 3399.713625 | 36 | 17 | native_checked |
| suffix_spaces_raw | v9 raw diagnostic | 126.882083 | 48 | 1 | measurement_checked |
| suffix_hebrew_raw | v9 raw diagnostic | 135.772875 | 48 | 1 | measurement_checked |
| suffix_mixed_bidi_raw | v9 raw diagnostic | 137.347792 | 48 | 1 | measurement_checked |

baseline5/5・補足3/3・raw3/3、全11件でbody_preserved／native_canvas_valid=true、capture errorなし、元8000ms未満です。elapsed_msはfit確認後・capture呼出前の値で、PNG生成完了までの時間ではありません。preview7件はsame-token fit=true／wrong-token=false／handle keys=[isCurrent]、saved v3は従来どおりfitなし。Card8件のcanSave／canExportはすべてfalseです。raw3件はdiagnostic-only／valid／same-selected-nodeで、正式fit/save/exportの権限を持ちません。

v9対象10reportの計59行（preview56＋raw3）はlocal／placedのtoken・tag・canvasTag・contentFrame・独立5値が一致し、placedのoverflow／wrapはfalseでした。今回のwire／独立raw oracle上でstrict own-view・論理行高・元余白を満たしています。全11件の本文blocks・plan groups・行数はv8と一致。v8で成功した10件は時間を除くcandidate trace／B9 plan／選択独立5値も一致し、Arabicの初回72pt B9 planも同じです。全候補とfont順・B9 score/tieを変えた成功ではありません。

Arabicは旧v8の72→64→56pt拒否から、同じ最初の72ptでnative_checkedへ進みました。TextKit bbox高108.80078125、自然Text view高98.33332824707031、論理行高98、baseline offset4.28125はそのままです。local ink[99,23,429,98]、placed ink[98.3905029296875,22.5,429.3905029296875,97.5]、実canvas原点[275.6094970703125,578.5]で、判定用のcanvas inkは[374,601,705,676]です。同じview／TextStorage／layout manager／text containerと15glyph、属性、独立5値を両段階で維持しています。小数位置によりink幅は330→331pixelとなり、localの寸法を最終結果へ転用したものではありません。

**最終PNGとの境界の完全一致は未証明です。** 実際のArabic完成PNGを読み取り、背景RGBA(255,253,248,255)が一様な本文ROI[200,500,880,800]内の異なる全画素を調べると、本文境界は[374,600,706,676]（右・下端はexclusive）でした。offscreen alpha境界[374,601,705,676]より上／右が1pixel大きく、上辺の追加36画素・右辺12画素があります。右辺にはRGBA(140,142,146,255)もあり、背景の僅差だけとは扱いません。両境界は実view・論理行高・本文領域に収まっていますが、原因は未特定です。現harnessはplaced wireと独立raw offscreen oracleを比較し、その後canvas.layerのPNGを保存するため、CI成功から最終layer PNGとのexact一致を主張できません。全physical scale・実機受入れの証明にもなりません。

両420はfont36／size_index3／lineHeight56、混在文18行・あ420は17行です。v8からのelapsed差は混在文+360.355417ms、あ420+947.590375msで、速度改善は主張しません。選択font・本文・行分割・独立5値は維持し、混在文の各row yは0から−0.5／−1へ、あ420は各行−0.5へ変わりました。Latinのyは−6.5、Arabicは−11.5です。今回の判定方式変更に伴う配置差として記録します。

artifact `piece-rn-canvas-ios` ID12246326787、3,222,364bytes、SHA256 `442b7b71bda87c029279e66ae786ed477e1dd6941b359749c622c650ebe0b21f`を取得してmetadataと照合しました。results.jsonは296,758bytes、SHA256 `6b15ef53255fa7096c74b87fb11f9964559028fe82b7900fc0ffd5f1913bb809`。元11report全文とPNG11枚の寸法・bytes・SHA256をmanifestへ保持します。GitHub artifact保管期限は2026-10-27T06:58:13Zです。華恋が11枚すべてを元解像度で開き、本文・段落・欠け・余白・brandingを確認しました。v8共通10枚のうちsaved_essay_canvas／suffix_spaces_rawの2枚だけがbyte-identicalで、残り8枚は変わり、Arabicの完成1枚が加わっています。

### 81.6 未採用で限定単位を終了し、次の修復箇所を固定

**v9は未採用です。** 明示承認された実装・GitHub15path全文照合・一度のCI・全11report／11PNGの確認と既存4文書への結果記録まで完了しました。全native検査の条件を満たしていないため、§80.7／§81.1のSTOPを適用します。承認を未承認へ戻すことやsourceを撤去することは意味しません。結果確定後のproduct／test／workflow変更0、再実行0、期限延長・分母削減・判定緩和0です。

次の最小修復箇所は既存PieceTextMetrics.mm内のPiecePixelCanvasFrameです。2つの外部CATransform3D関数を、translationだけを許す16成分の直接比較へ置き換える案を特定しました。m11/m22/m33/m44=1、m12/m13/m14/m21/m23/m24/m31/m32/m34/m43=0、m41/m42有限を要求します。canvas内ancestorのsublayerTransformとcanvas自身を除くlayer.transformへ適用し、既存UIView affine条件・convertPointの座標照合を維持します。新framework／helper／workflowを足す案ではなく、まだ未適用・未検証です。これだけで最終PNGの1px差や旧v8の未完走が解消するとは主張しません。次のsourceでは旧129＋新46の完走が必要で、最終layer PNGと判定用alphaの境界差も品質残件として明示します。

正式renderer admission、採用版とsaved再表示の整合、InputScreen→既存hostへの正式供給、通常初回保存→同owner GET／履歴、共有／実機受入れは未完了です。今回のsourceは既存Draft PR30に残し、API／DB／runtime／deploy／署名／配布／main mergeの効果は0、automatic_progression=falseを維持します。既存CI使用量は増えましたが、請求額は確認していません。10/22通常保存・10/23共有の達成や延期承認へ今回結果を読み替えません。

## 82. 2026-10-20 — v9のリンク修復と、完成PNGとの差を同じ検証で確認

### 82.1 新しい継続指示と修復範囲

Mashの16:54:36 JSTの「Pieceの残件作業を進めて」と添付の前回結果を受け、§81.6に固定済みの未適用修復から再開します。旧source bac29a1d／run39381252246 attempt1の未採用STOPは完了済み履歴として保持し、旧runを再実行しません。今回の新sourceを既存push CIで一度確認します。新ink定義を再承認事項に戻さず、Rule18 §0／§11.3 LEVEL_2とweekly §5.6.2の既存契約内の修復として扱います。

実行ownerは華恋／GPT-6 Astra Pro／CHAT_PRO_OK、rootのみが編集・GitHub反映・実行判断を行います。開始headは73f600db74c5221984e90bbe3e34e052ce644860、API参照headはa536e50ee284785f585ac73329ef2947dca8bba9です。前提資料、作業rule、恒久incident全文、全体設計01／全file地図01A〜C、Piece current map、最新weeklyを確認しました。GitHub treeの全pathを取得し、使用するlocal実ファイルはremote blobへ照合しました。System Contextの保存結果は旧refのためcurrent根拠に使わず、正本・現物を直接確認しています。

| 作業境界 | 今回固定する内容 |
|---|---|
| 商品接続／未完了条件 | P-W1通常preview→明示保存→本人再表示の前提である、v9の全native検査と完成画像品質の確認 |
| 必要性／scope | OBSERVED_BLOCKER_MINIMAL_FIX。既に観測済みのlink不整合を既存関数内で直し、同じ一度の描画検証で既知1px差の発生段階を調べる |
| source変更 | PieceTextMetrics.mmの外部2関数を16成分直接比較へ置換。m11/m22/m33/m44=1、他10成分=0、m41/m42有限。canvas内sublayerとcanvas自身以外のlayerへ適用。UIView affineとconvertPoint条件は保持 |
| 既存検証file変更 | piece-rn-canvas-ios.m内のArabic診断だけ。元完成PNG保存後、同じText layerを透明sRGB・scale1 bitmapへ局所phase0／最終小数phaseで各1回描画し、全alpha境界・scale・CTMを記録する。元PNG、oracle、native_canvas_valid、elapsed、fixture、assertionは不変 |
| 変更path／保存先 | 製品1・検証1・既存資料4の計6path。資料は本入口、manifest、Piece map、weekly20261017。新file／helper family／workflowなし |
| 完了条件 | sourceのGitHub全文読戻し、新source CI1回のnative旧129＋v9追加46、既存JS915、実RN11reportと元PNG11枚を回収。成功・失敗・境界差を既存4文書へ記録する |
| STOP／非対象 | 元8秒・strict包含・分母・本文・全range/font/B9・独立5値・旧版を変更しない。未達時は未採用を維持し、同source再試行・許容値追加・正式admission／save開放・DB／配置／配布へ広げない |
| 時間／費用 | 前回CI23分06秒を目安とし保証しない。新規購入・依存・外部service・Mash操作0、既存CI使用量は増える。請求額は未確認 |

旧v8は97＋18の115 PASS後、UTF16 budget検査中に終わっています。保存ログのmain_enteredからjob終了までは約54.7秒で、90秒alarm、例外、OOM、signalの原因記録はありません。同じ旧製品sourceのv7は129完走しており、入力は840 UTF16／420 graphemeで既存上限内です。メモリ・main占有を候補に留め、fixture縮小や時間変更はせず、既にv9にある段階ログで今回の到達点を確認します。

Arabicでは直接glyph描画とlayer合成の経路が異なることを確認しました。今回の診断は元PNGの後に行い、layerのplaced境界が元PNGに一致するか、directと一致するかを比較します。画素差を許す新しいマージンやoffscreen画像への完成PNG置換は行いません。具体的なAA/filter原因は観測できた範囲だけで判断します。

Supabase cocolon-projectのmigration履歴をread-only照合し、全10件・Piece6件（005 quota_read、006 preview_visual_changeを含む）を再確認しました。再適用、業務RPC、本人行読取、設定変更は0です。STRUCTURE_MAP_DELTA_NONE：既存owner・契約内のリンク修復と検証時診断であり、新route・保存権限・公開DTOは増やしません。

### 82.2 source時点の未実施事項

差分の読み取りレビューでは、16成分、canvas境界、既存判定不変、診断bufferの解放と元PNG後の実行を確認しました。Linuxのsource reviewをiOS compile／175件成功へ換算しません。新CI・全画像・結果記録はこのsource時点で未実施です。正式renderer採用、同版saved、InputScreenへのisSaveAdmitted、通常初回保存→本人GET／履歴は引き続き未完了です。

### 82.3 一度の実行結果：リンク修復を確認、native175件は未検証

source **972205c858ecfd3ab36f83e078c4d6c2c6a13ee7**／tree **75b5e5f5c3421347cadc18794ffeef06f906d626**をPR30へ反映し、source6pathのremote全文とGit blobを照合しました。新sourceの既存push CIは[run39392217445 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39392217445)の一度だけで、17:16:31〜17:35:02 JST、18分31秒です。全体結論はcancelledであり、GREENではありません。旧runの再実行、今回の同source再実行、追加dispatchは0です。

| 検証 | 観測結果と限界 |
|---|---|
| JavaScript | 915 PASS、FAIL／skip 0。今回sourceの既存CI結果 |
| iOS syntax／project／standalone link | 成功。元の2つの未解決QuartzCore symbolは再発せず、compile/link後のsimulator bootstatusまで進行 |
| native旧97＋v5追加32＋v9追加46 | 合計175件は全件未検証。main_entered／budget stage／PASS／FAIL／3種summaryの観測0。0/0を成功や全件非実行の証明にはしない |
| 実React Native | XCTest1成功。baseline5/5、補足3/3、raw診断3/3の全11reportと元PNG11枚を回収 |
| 同token・本文・保存境界 | v9のlocal/placed59組（preview56＋raw3）、本文・順序、7previewの同token fit、wrong-token拒否を確認。8CardのcanSave/canExportはfalse、savedv3にはfit handleなし、rawに保存権限なし |
| 元8秒 | 最終reportまで全11件が8秒以内。mixed420は4916.761542ms／36pt18行、あ420は2591.970250ms／36pt17行、Arabicは192.152958ms／72pt。PNG capture前までの既存計測境界であり、capture完了時間へ読み替えない |
| 画像 | 全11枚を原寸目視し、このfixtureでは欠け／重なりを観測せず。全11PNGは旧v9とバイト同一。処理時間の差を製品性能改善とは主張しない |
| Android／共通guard | Android native source compile成功。既存phase6 guardは別run39392217376で119 PASS。export Pods／Android依存compileは変更対象外でskipのため、新しいcompile成功へ換算しない |

native job118526218778は、08:22:10.368080Zにbootstatus Finished、その後08:26:59.042112ZにNSMachErrorDomain -308、同59.448462Zに`(ipc/mig) server died`、08:27:00.736644Zにcancelを記録しました。既存10分上限の取消境界に近く、-308が根因か終了処理の結果かは未確定です。bootstatus後のinstall／launchには境界markerがなく、どちらの完了も確定できません。元10分・native90秒alarm・検査分母は不変です。

以前native129が完走したv7と、macOS15.7.9／Xcode16.4／clang17／runner image20260907.0337.1／選択iPhone17 Proが一致しました。workerは別で、今回の実runtimeはアプリのOS出力がなく不明です。環境の版差を原因とする証拠はありません。旧v8の115 PASS後のbudget未完走も、今回その段階が観測されないため未解明のままです。

### 82.4 Arabicの境界差をText layer単独で再現

元PNG保存後の追加診断は、allocation／exception／empty／edge到達なしで成立しました。境界は右・下を排他的端点とする`[左,上,右,下]`です。

| 描画経路 | local境界 | 最終canvas座標のplaced境界 |
|---|---|---|
| 同layoutのdirect glyph、scale1 | [99,23,429,98] | [374,601,705,676] |
| 同Text layerを独立描画、scale1 | [99,22,430,98] | [374,600,706,676] |
| 元完成PNGの本文実画素 | — | [374,600,706,676] |

placed layerはcanvas原点[275.6094970703125,578.5]を加えると完成PNGの本文境界と一致します。zero-phaseのlocalでも上・右へ1px広いため、小数配置や祖先canvas合成がなくても差は発生します。直接glyphをscale1へ描く判定値が、実Text layerの描画に対して小さいことを確認しました。view contentScaleFactor／layer contentsScale／screen scaleは3、min/magnification filterはlinear、shouldRasterizeはfalseです。ただし、scale・filter・backingの個別寄与は操作しておらず、単独原因は未分離です。

Arabic PNGは前回と全RGBA画素・bytesが同一で、SHA256は`118d4e4060aee2d05fa1287a2629fcfecd126e94ab6db774e5fd46d6fcd30350`です。実ink高76は論理98以内、本文領域内で、view下端まで約0.833328ptの余裕があります。上辺追加36画素／右辺追加12画素があり、右辺RGBA(140,142,146,255)を背景の微差として無視しません。

PCE-5の一般契約を「全PNGのpixel完全一致必須」へ変更しません。今回の未解決点は、strict包含を判断するproxyが実描画を過小評価する場合の保証です。元PNG後の診断は、実製品のplaced時点（canvas opacity0）でbackingが有効な証明ではありません。差の切分けを修復完了や正式renderer採用へ換算しません。

### 82.5 現在の未完了と、次の最小着手点（未適用）

1. **native175件の実行証拠。** 既存workflowのbootstatus帰還後／install帰還後／launch pipeline帰還後へ3つのHOST_STAGEを置けば、installとlaunchのどちらで止まるかを切り分けられます。最後のmarkerは`PIECE_NATIVE_LAUNCH_STATUS=$?`と`set -e`の後に置き、status採取を壊しません。これは未適用案であり、時間延長・fixture削減・同source再試行は行っていません。
2. **実Text layerのstrict包含保証。** 既承認direct ink／wireを変えず、既存placed内で実layerにも同じ包含条件を当てる候補はあります。ただしopacity0時点のbacking有効性・元8秒・独立性の成立が未確認です。1px許容追加、scale変更、displayIfNeededによる強制成立、完成PNGの差し替えは実装していません。まずこの成立条件を既存owner内で明らかにします。
3. **P-W1の商品接続。** 正式renderer admission、採用版のsaved再表示、InputScreenからのisSaveAdmitted供給、通常初回保存→本人GET／履歴、実機受入れが残っています。既存create controller／private-save API／owner reads／6本のDB定義を作り直しません。native_checkedだけで保存を開放しません。

今回の限定単位は、source反映・一度の観測・結果保存として終了します。primary outcomeはBLOCKER_NARROWED、リンク修復は確認済みですがnative175完走とP-W1完成は未成立です。v9は未採用、formal_admission／product_acceptance／normal_save_reopen_completeはfalseです。新しいink定義の承認を再度求める扱いにも戻しません。

### 82.6 復元可能な証拠と反映範囲

結果反映は既存4資料だけです。manifest v93の`ios_preview_v9_link_repair_20261020`へ全11report、各PNG/hash、native到達点、Arabic比較、元CI metadataを集約します。Rule14／17に従い、今回の元PNG11枚・raw results.json・必要ログとledgerをlossless tar.gz/base64 bundleとして同recordに保存します。新file／helper／ownerは0です。元Actions ZIPはartifact12250972261、3,206,417 bytes、SHA256 `880ae6746b62deac71f85577feffc8cb9d50cb081c7d002702291e3f87eaa875`、期限は10/27ですが、採用判断に使う最小証拠bytesを期限付きURLだけに依存させません。

Supabaseは開始時のread-only migration履歴（全10／Piece6）の照合だけで、DB apply／業務RPC／本人行読取0。今回の結果後は製品／test／workflowの追加変更0、再CI0、API／runtime／環境／署名／配布／deploy／main merge 0です。source時点の§82.1〜82.2と旧v9結果ownerは履歴として保持します。構造はSTRUCTURE_MAP_DELTA_NONEです。

## 83. 2026-10-20 再開：native install／launch境界の最小診断（source時点）

### 83.1 再開地点と今回の限定範囲

Mash様の18:22:22 JST「処理落ちしているから、続きから再開して」を受け、前回結果commit **21ad068cb9605d1e4945b3dbe38259690fabe924**／tree **16bf672fed83f2fef3481b93407fd38702efeb47**がPR30の最新であることをfresh確認しました。前回のsource972205c8・run39392217445・30件lossless証拠は保存済みで、旧単位のSTOP・回数・v9未採用を保持します。全体設計01・全ファイル地図01A〜C・最新weekly20261017・現行Piece ownerから、最初の未完了はnative175件の観測と実layer包含保証であることを再確認しました。

実行modelはGPT-6 Astra Pro、環境はCHAT_PRO_OK、分類はLEVEL_2です。現在の再開指示、Rule18 §0／§11.3のstanding delegation、weekly §5.6.2、入口§82.5の未適用案を根拠に、華恋rootを単一writerとして同じ検証目的内の診断を実施します。一般の次Gateや保存開放へ進む承認には扱いません。

| 項目 | 今回固定する内容 |
|---|---|
| 対象／保存先 | MassyuRed/Cocolon、既存branch agent/three-core-cmee-current-structure-20260815、Draft PR30 |
| 変更path | .github/workflows/piece-rn-contracts.yml と本入口・manifest・Piece current map・weekly20261017の既存5path。新file0 |
| 実行差分 | bootstatus帰還後、install帰還後、launch終了status採取とset -eの後へHOST_STAGE各1行。終了status直前には追加しない |
| 条件保全 | pipeline／pipefail、summary parser、job10分、main後alarm90秒、旧97＋v5追加32＋v9追加46、fixture・元8秒・厳密包含を保持 |
| CI | 変更した新sourceの既存push CIを一度。workflow自身がscope判定対象のため、JS／native／RN canvasに加え、前回skipだったexport Pods／Android依存compileも実行対象 |
| 完了条件 | 5path remote全文読戻し、marker・main／budget到達点と元job全体ログを保存。3summary・175件の実測または停止境界を確定し、既存job・RN report／元PNGの結果と残件を既存4資料へ保存・再取得 |
| STOP | 同source再実行・旧run再開・上限変更・fixture削減・比較緩和・追加修復へ自動進行しない。未達は未検証として残し、正式admission／save／exportを開放しない |
| 費用・時間 | 新規購入・依存・外部service・Mash操作0。既存CI使用量は増加、請求額未確認。前回18分31秒は参考値で、今回は既存export依存検証も実行対象のため所要時間の保証にしない |

3つのmarkerはlaunchのteeの外にあります。native-metrics.logだけでなく元job全体ログを保存します。install_beginはbootstatus正常帰還、launch_beginはinstall正常帰還、launch_endはpipeline帰還と取得済みstatusを示します。launch_end status=0だけで合格にせず、LEGACY_NATIVE_CHECKS=97、NATIVE_CHECKS=129、V9_NATIVE_CHECKS=46／EXPECTED=46、FAIL／SKIP0を全て観測します。bootstatusのFinished出力と正常帰還も区別します。

STRUCTURE_MAP_DELTA_NONE。製品・native test・RN test・依存・API・DB・runtime・環境値・署名・配布・deploy・main mergeの変更0です。Supabaseは前回確認のPiece6migrationを参照し、今回のDB metadata再取得・適用・業務RPC・本人行読取は0です。旧§82の結果とmanifest ownerは上書きしません。

### 83.2 source時点の確認と未実施事項

実行差分はprintf3行だけで、それらを除くworkflow全文は開始時と同一です。既存native stepのbash構文と、status採取・pipefail・main後alarm・175件の既存判定を確認しました。nativeのNATIVE_CHECKS=129を175へ書き換えず、v9独立summaryと合わせて評価します。sourceの公開、新CI、実ログ・全画像の確認はこのsource時点で未実施です。

Arabicの1px差、opacity0時点のbacking、全入力に対する実Text layer包含は未解決です。正式renderer採用、採用版saved、InputScreenのisSaveAdmitted供給、通常保存→本人GET／履歴、実機受入れはこの単位の完了へ含めません。

### 83.3 一度の実行結果：native旧129件PASS、v9のfixture組立で例外

source **5fa54927477364af61dab989021d0f511d8c9994**／tree **d15b9591543f2067ed96219dc2c75325470f5205**をPR30へ反映し、既存5pathの全文・Git blob・差分をGitHubから読み戻しました。実行差分はHOST_STAGEのprintf3行だけです。[run39402186101 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39402186101)は18:38:42〜18:56:35 JST、17分53秒、全体結論は**failure**です。今回も同source再実行・旧run再開・追加dispatchは0です。

| job | 最終結論 |
|---|---|
| piece-ios-rn-canvas | success |
| piece-ios-source | failure |
| piece-rn-contracts | success |
| piece-android-source | success |
| piece-export-android | success |
| piece-export-pods | success |

native job118559340319の追加markerは、09:41:07.413230Z install_begin、09:41:44.572895Z launch_begin、09:43:10.946589Z launch_end status=0です。bootstatusとinstallは正常帰還し、main_enteredは09:42:38.007737Z、application_launch／activeも観測しました。今回の失敗はinstall／launch未識別や10分取消ではありません。

旧97件は個別PASSとLEGACY_NATIVE_CHECKS=97 PASS=97 FAIL=0 SKIP=0を観測、v5追加32件も全て個別PASS、合計129 PASS／FAIL行0です。キー数・UTF16の両budgetはoracle_completeとPASSまで進みました。v9_beginの後、最初のlatin fixtureを[row addSubview:view]で実Window階層へ追加する段階で、**NSInvalidArgumentException: -[RCTTextView isTrackingKeyboard]: unrecognized selector**が発生しました。stackはUIKitの_willMoveToWindow→_addSubview→runV9Checksです。追加46件の個別PASS／FAILは0、V9 summaryと最後のNATIVE_CHECKS=129 summaryは欠落し、175件完走は未成立です。

mainから例外まで約32.265秒で、main後90秒alarmより前です。simctl pipelineはアプリ例外後もstatus0を返しましたが、既存summary検査が不足を検知してjobをfailureにしました。status0だけを成功にしません。旧v8のbudget停止原因や前回run39392217445の取消原因を、この新しい観測だけで遡及確定しません。

### 83.4 原因に対応する最小修復案（未適用）

既存testのRCTTextView.windowは、fixtureAttachedがYESでsuper.windowがnilのとき、**(UIWindow *)self**を返します。v9ViewはmakeView経由でattached=YESとなり、実mount前のText自身をWindowとして返したままaddSubviewへ進みます。例外stackとこの自己castの不整合が一致しています。製品のglyph判定や独立oracleに到達して失敗したものではありません。

次の最小案はtests/native/piece-text-metrics-ios.mm内のtest-only propertyで、v9だけ実windowを要求することです。以下はclass extension追加・既存implementation内のgetter置換・v9View内への1行追加の抜粋です。未適用で、今回のsourceや検証済み成果には含めません。

```objc
@interface RCTTextView ()
@property(nonatomic) BOOL fixtureRequiresRealWindow;
@end

- (UIWindow *)window {
  if (self.fixtureRequiresRealWindow) {
    return self.fixtureAttached ? [super window] : nil;
  }
  return self.fixtureAttached ? ([super window] ?: (UIWindow *)self) : nil;
}

// Only in v9View, immediately after makeView:
view.fixtureRequiresRealWindow = YES;
```

旧129件はflag既定NOで元のgetter式を保持します。v9はmount前／remove後がnil、mount後は実UIWindow、既存detached試験のfixtureAttached=NOもnilです。私有selectorのstubを足して型不整合を残す案、mount時だけflagを切り替えてremove後のfallbackを残す案は採りません。fixture数・assertion・oracle・175分母・各期限・製品sourceを維持した次の限定修復として扱い、成功は次の実測まで未確認です。

### 83.5 RN・exportの結果と商品側の残件

既存JSは915 PASS／FAIL・skip0、Android source compileは成功しました。RNはbaseline 5/5、補足 3/3、raw診断 3/3、取得report 11/11、元PNG 11/11です。全reportの元条件成立はtrue。local／placedはpreview56＋raw3の59組で、同token・同Text／canvas node・独立5値を確認。preview7件の同token fitはtrue、card8件のsave／exportはfalse、saved v3はfitなし、raw3件は権限なしを維持しました。元8秒の計測境界はPNG capture前の最終reportまでで、essay_max420=6337.859333000146ms、suffix_max420_a=3358.7697920000646ms、suffix_arabic=212.6296250000596msです。前回link-repairの元PNGとbytes同一は11/11枚で、今回原寸目視した範囲と限界はmanifestのvisual_reviewへ保存します。主要例の時間は前回より長く、性能改善は主張しません。

export Pods／Androidは今回は既存scopeにより実行対象となりました。各jobの最終結論は上表と元ログに従い、skipと実compileを区別します。これらは既存ライブラリの検証であり、写真保存／共有の実機操作や正式admissionの完了にはしません。

実Text layer包含では、製品placedは2 rAF後もcanvas opacity0であり、現在のnativeはTextKit layoutとdirect glyphを測っています。次の読取候補は既存RN testのplaced成功callbackで、同Text・同token・同配置の自然描画とlayer内容を、resolve前に観測することです。既存18項目wire／4項目requestには本文とbrandingの意味境界がなく、native rejectionだけでは既存の文字サイズ縮小分岐へ進まないため、実layerを追加測定するだけでは修復完了になりません。standaloneのText shimには実RNのdrawRectもありません。これらはread-onlyで整理した成立条件で、今回実装・追加実行していません。

現在の順序は、v9 fixtureのWindow扱い修復→175件完走、実layer厳密包含の成立、正式renderer admission・採用版saved・InputScreen供給、通常明示保存→本人GET／履歴・実機受入れです。既存API/controller/owner reads/DB6定義の再実装は不要です。10/20の採用方針は未完了で、10/22通常保存・10/23共有は未達目標です。v9採用や通常保存の完成を確約しません。

### 83.6 今回の終了記録と復元可能な証拠

primary outcomeは**BLOCKER_NARROWED**です。source反映・一度の実行・原因切分け・結果保存として今回単位を終了し、v9は未採用、formal_admission／product_acceptance／normal_save_reopen_completeはfalseを維持します。新しいfixture修復や実layer診断をこの単位へ追加しません。

結果反映は既存4資料のみです。今回固有のraw report・全6job元ログ・metadata・解析を、同じmanifest内の新recordにlossless tar.gz/base64で保存します。新bundleは21 member、その内PNG実体0枚。今回取得の元PNG 11枚のうち11枚は前回の保存済みmemberとbytes完全同一であるため、旧owner ios_preview_v9_link_repair_20261020／bundle SHA256 94aaba66d3863b4635a122ee949dfba85caf5c1d939c6d6c966ea776e1247e76／immutable commit21ad068／member pathへ一意に参照します。旧report・時間・token・成功判定を今回へ流用せず、同じ画像bytesだけを重複保存しません。新旧bundleから今回の全画像を合成復元して現物と照合する構成です。

旧v9／link-repair ownerとその証拠はdeep同一で保持します。今回の結果後に製品・test・workflow追加変更0、再CI0、DB metadata再取得／apply／業務RPC／本人行読取0、runtime／環境値／署名／配布／deploy／main merge0です。STRUCTURE_MAP_DELTA_NONEです。

## 84. 2026-10-20 — Pieceモデル制限解除とv9テスト用Windowの最小修復

### 84.1 今回の判断・実装・固定範囲

Mashの22:15:45 JST「Pieceの残件作業を進めて」と22:20:04 JST「Pro以外でもPieceの残件作業をやることはあるから、その制限は外して大丈夫！」を根拠とします。モデル条件の解除はRule18 §0Aへ反映し、入口・一般rule・開始/出力Gate・rule manifest・環境索引を同じ決定へ接続しました。EmlisAI/分析の条件、品質、既存の承認範囲・実DB/本番操作・再試行境界は維持します。

| 開始項目 | 今回固定する内容 |
|---|---|
| product_destination / current_gate | P-W1、B10_WITH_B12C_ADOPTION_BOUNDARY。通常保存へ進む前のnative175件未完走を直接解消する |
| exact_work / necessity | §83.4のテスト用Window不整合だけを修復し、新sourceの既存push CIを一度確認。OBSERVED_BLOCKER_MINIMAL_FIX |
| scope / basis | モデル条件はMash明示変更。test修復と記録は既存v9契約内のLEVEL_2、現行残件指示とRule18 §11.3。旧単位のretryではない |
| execution_owner / environment | 華恋root、Codex（GPT-6系、正確なモデル/Pro名称は未確認）、PIECE_WORK_ALLOWED。agentは読取reviewのみ |
| source / heads | Cocolon07f08f000ee751d717a383b7c494bb6b0cbe60a6、API a536e50ee284785f585ac73329ef2947dca8bba9（API変更0）、前回run39402186101 |
| docs / map | 全体設計01と全file地図01A〜C、fresh recursive tree1909件、Piece入口/manifest/current map、最新weekly20261017 §5.6と直近結果を確認 |
| context | prepareはmaterial commit ancestryを解決できず失敗。保存済みContextは旧refのためcurrent根拠に採用せず、System Context入口が認める正本の直接読取へ戻した。Context製品codeの修復・生成結果の公開0 |
| changed paths | test .mm1、モデル条件の既存7資料、Piece入口/manifest/current map/weekly4資料、既存07差分記録1。計13、全て既存path |
| allowed / protected | class extensionのBOOL、window getterのv9分岐、v9Viewのflag設定の3箇所のみ。元getterへ戻すとtest全文が開始時と完全一致することをlocal確認 |
| completion / success | remote全13path一致、新CIの元ログで旧97/合計129/v9=46の各summary・個別PASS/FAILを直接確認、RN実report/PNGを同じ版で確認。成功は限定TECHNICAL_CREDIT、商品採用には換算しない |
| stop / prohibited | 新sourceの一度のCI後に失敗を隠して再実行・追加修復しない。fixture/oracle/assertion/175分母/8秒/native90秒/job10分/製品/API/DB/依存/署名/配布/deploy/main merge変更0 |
| next product / Mash point | native完走後も実Text layer厳密包含・正式admission・採用版saved・InputScreen供給・通常保存→本人GET/履歴を残す。契約変更が必要なら具体差分でMash判断へ戻す |
| cost / time | 新規購入・外部service・依存・Mash操作0。既存CI使用量は増加し請求額未確認。前回17分53秒は参考、見積りは10〜30分で保証しない |

v9だけfixtureRequiresRealWindow=YESとし、未mount/remove後はnil、mount後はsuper.windowを参照します。旧129は既定NOで従来式を保持します。比較・oracle・46件の中身は変更しません。workflowは変更せず、native stepのV9 summaryは元ログから別途照合します。test .mm変更は既存RN canvas scopeに含まれます。exportの依存compileはscope条件に従い、skipを実compile成功へ置き換えません。

STRUCTURE_MAP_DELTA_NONE。単独test実装とモデル運用条件の変更で、製品のowner/route/contractは不変です。今回Supabaseはcocolon-project ACTIVE_HEALTHYという一覧だけ確認し、DB query/apply・本人行読取・業務RPCは0です。新CIはsource時点で未実行、v9未採用・formal_admission=false・normal_save_reopen_complete=falseを維持します。

### 84.2 途中保存：native175件完走、job取消と実RN継続を区別

source **9de5a87dd2287228e9fe8217f1657aacc239abaf**／tree **9bce1edf61264a996782c9e751cba7b2aa29497c**を既存PR30へ反映し、13pathのremote全文・変更集合・旧v9 evidence不変・入口/map hash一致を確認しました。[run39430845624 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39430845624)は同sourceで一度だけ実行しています。

native job118655208907の元ログは**175個別PASS／unique175／FAIL0**です。旧97＋v5追加32＝129と、v9追加46を分け、LEGACY97を129へ重複加算しません。LEGACY_NATIVE_CHECKS=97 PASS=97 FAIL=0 SKIP=0、V9_NATIVE_CHECKS=46 PASS=46 FAIL=0 SKIP=0 EXPECTED=46、最終NATIVE_CHECKS=129 PASS=129 FAIL=0 SKIP=0、launch_end status=0が全て揃いました。両budgetも完了しています。main13:38:59.370662Z→最終summary13:39:39.170470Zは約39.800秒で元90秒内です。前回の最初のaddSubview例外を越え、全46件の正常・拒否比較が成立しました。rootと独立読取agentで一致しています。

一方、GitHub metadataはjob全体を**cancelled**とし、開始13:29:50Z→終了13:39:54Z、10分4秒です。Execute、post、Completeの全stepはsuccessです。元ログに取消理由の明示行はなく、既存10分境界との関係は推定に留めます。検査合格をjob/CI全体GREENへ変換しません。job上限・parser・test・sourceの追加変更や再実行は0です。

JS915 PASS／FAIL・skip・cancelled0、Android source compile success。export2jobはsuccessですが依存compileはscope skipです。sourceに対する別自動check5件はsuccess。実RN canvas job118655208930は途中保存時点でin_progressのため、11条件やPNG成功を今回分として主張しません。今回のnative元ログ・終了済み5job元ログ・jobs metadataをmanifestの同じ新owner内へlossless保存します。実RN終了後に同unitへ結果を追記します。

Window修復・実native175の証拠は限定TECHNICAL_CREDITです。bounded work全体は実RN採取と最終記録まで継続中。次の商品上の作業は、既存RN harness PieceObservedSelectedV2Callのplaced成功callbackで、wireをresolveする直前の同Text/tag/token/配置の自然なlayer状態を読むことです。現行製品・独立oracleはdrawGlyphsを測り、完成PNG後のlayer診断はopacity0のplaced時点を証明しません。単にlayer測定を足すだけでは本文/branding境界・縮小経路・正式admissionは完成しません。v9未採用、通常保存・本人再読・実機は未完了です。

### 84.3 同じ一度の実RN結果と画像確認

run39430845624 attempt1は13:29:37〜13:51:50Z（22分13秒）で終了し、全体結論は**cancelled**です。piece-ios-rn-canvas／piece-rn-contracts／piece-android-source／export2jobはsuccess、piece-ios-sourceは§84.2のとおりjob cancelledです。export2jobの依存compileはscope skipで、再compile成功へ換算しません。再実行・追加dispatch・結果後のtest/製品/workflow変更は0です。

実RNはbaseline5/5、supplemental3/3、raw3/3、全native_canvas_valid/body_preserved=true、元PNG11/11。preview7の同token fitはtrue、旧saved v3はfitなし、Card8のcanSave/canExportはfalse、raw3は保存権限なしを維持しました。v9のlocal→placed59組で同token・同Text/canvas node・独立5値とoverflow/wrapなしを確認しました。local保存照合の初回は旧saved v3（local0）にもv9の同数条件を誤要求し、検査側assertionで停止しました。v9の59組へ対象を正して再照合し、source/fixture/CIは変更・再実行していません。

| 例 | 最終reportまでの時間 | font | 現行条件 |
|---|---:|---:|---|
| essay_max420 | 5053.087665999774ms | 36pt | 成立 |
| suffix_max420_a | 2370.564250000054ms | 36pt | 成立 |
| suffix_arabic | 179.20866600004956ms | 72pt | 成立 |

元8秒の境界は最終fit確認を含むreportまでであり、後のPNG capture時間を含むと主張しません。前回より短い観測値ですが製品sourceは不変なので、今回の修復による性能改善とは判定しません。

artifact12268708757の元ZIP SHA256は **4f5cf92c198ac7915e455da6f2c623ffbb216bdc2a48e0d01f7b1247a74f8b12**。元PNG11枚は既存link-repair ownerの11memberとbytes完全一致です。今回のreport/time/tokenは新しく採取し、旧結果を成功判定へ流用していません。全11の一覧を目視、Arabic/essay_max420を原寸で確認し、確認範囲で明らかな切れは見ませんでした。1px厳密同値や他の未検証入力は目視で証明しません。画像は旧owner/bundle/member/hashから可逆復元し、重複byteを追加しません。

今回もArabicの完成後layer診断はlocal=[99,22,430,98]、placed=[98.3905029296875,21.5,430.3905029296875,97.5]です。opacity0時点の自然なText backing、全入力のlayer包含は未観測のままです。既存のdrawGlyphs oracleをlayerの証明へ読み替えません。

### 84.4 保存と次の一作業

今回のprimaryは**TECHNICAL_CREDIT**、範囲はWindow不整合修復・native175件完走と同sourceの実RN条件確認です。商品合格・正式admission・通常保存完成には加点しません。元native/終了済み5jobログは途中checkpoint e186e9d4f2815c8f519167efdbc44c2ef1662f7bと同ownerのinterim bundleに保存・5path読戻し確認済み。最終RN元ログ・新raw report・最終6job/run metadata・解析・元xcodebuild logを8memberのfinal bundleへlossless保存します。旧ownerを改変せず、同manifestの旧bundleから画像11枚も復元・照合できます。期間付きActions artifactだけへ保存を依存させません。

次は、既存実RN harnessのplaced成功callbackで、元wireを返す前の同Text/tag/token/配置の自然なlayer backingを直接観測し、既存の本文/branding境界・縮小経路へ必要な差分を具体化する一作業です。native175は検証済みとして維持し、CI cancelledを理由に同sourceを再実行したり、job上限を延ばす補助作業へ逸れません。判定方式・品質・公開契約の変更が必要なら、具体差分を先に用意して既承認範囲と区別します。

bounded unitを最終結果保存で終了し、実layer修復・正式renderer admission・採用版saved・InputScreen供給・通常明示保存→本人GET/履歴・実機は残件です。今回Pro限定を解除した決定は恒常運用へ接続しましたが、EmlisAI/分析のmodel条件や他承認を変更しません。root単一writer、STRUCTURE_MAP_DELTA_NONE、v9未採用、DB/apply/本人行/RPC/依存/runtime/deploy/配布/main merge変更0、automatic_progression=falseです。

## 85. 2026-10-21 — 配置後の自然なText layer状態を同じcallbackで観測

### 85.1 開始記録・限定実装（source時点）

最新の残件継続指示に基づき、§84.4の一作業を進めます。モデルのPro限定はMashの明示決定とRule18 §0Aで解除済みです。

| 開始項目 | 固定する内容 |
|---|---|
| product_destination / current_gate | P-W1 / B10_WITH_B12C_ADOPTION_BOUNDARY。通常保存の前に残る、drawGlyphs判定と実Text layerの差を絞る |
| exact_work / necessity | OBSERVED_BLOCKER_MINIMAL_FIX。既存Arabic v9 wrapperのplaced成功callbackで、既存geometry readerとresolveより前に同じTextの自然なmodel-layer metadataを読む。画素判定・新計測契約を追加しない |
| authority / environment / owner | 既存v9診断範囲のLEVEL_2、Rule18 §11.3と最新継続指示。PIECE_WORK_ALLOWED、華恋rootが編集・実行・GitHub反映、補助agentは読取reviewのみ。Codex GPT-6系、正確なmodel/Pro名称は未確認 |
| heads / maps | Cocolon e470c8948ec1f75435a1857ab9a40855da9bdec4、API a536e50ee284785f585ac73329ef2947dca8bba9。fresh全tree1909件/non-truncated、全体設計01・全file地図01A〜C・Piece入口/manifest/map・最新weekly20261017 §5.6と直近結果を確認 |
| context / current evidence | prepareはmaterial ancestry解決で失敗。System Context入口の正本直接読取へ戻り、生成tempは公開しない。前回source9de5a87のnative175/RN11結果を継承。前回doc commit e470の自動run39435122125は今回fresh確認でcompleted/cancelled、再実行しない |
| changed paths / structure | test harness .m1＋既存入口/manifest/current map/weekly/07の5資料＝6既存path。新file・製品/route/型/依存/契約変更0、STRUCTURE_MAP_DELTA_NONE |
| protected | 元wireを一度そのままresolve。既存geometry reader/oracle/fixtures/assertions/175分母/元8秒/native90秒/job10分を保持。render/layout/display/flush/wait/opacity変更・private backing解読・未知contentsのCGImage cast・新hookは追加しない |
| success / stop | remote6path一致、新sourceの既存CI1回、元report内のcallback記録・前後同一性・本文/元11条件/PNGを確認。metadataがnil/opaqueでも画素なし・透明・包含成功に変換しない。失敗/取消/未観測をそのまま保存し、同source再実行や追加修復を行わない |
| next product / Mash point | 実layerの画素包含とbody/branding縮小は未成立。結果から最小修復を具体化し、描画定義・選択契約・saved版等を変えるなら具体差分を示して判断へ戻す。新方式の採用や保存解禁はしない |
| cost / time | 追加依存・購入・外部service・Mash操作0。既存CI使用量増、請求額未確認。前回22分13秒を参考に10〜30分程度を見込むが保証しない |

`tests/native/piece-rn-canvas-ios.m`だけへ99行を追加しました。元Arabic（72/64/56pt）の成功wrapperでplacedだけを対象に、callback時刻/残期限、requestとwireのtag/canvas/token/stage、registryのText/canvasとstorage/layout/container identity、実配置、layerのbounds/position/anchor/scale/contents設定/needsDisplay、ancestorのhidden/alpha/opacity、公開contentsのnil/non-nullとidentity/class、読取前後の同一性を記録します。classはloggingのみで内容型の推定に使いません。既存geometry/glyph診断より先に最初のcontentsを読み、その後に従来診断を続け、wireは変更しません。

`pixel_observation=NOT_PERFORMED`を必ず明示します。nilはその時点の公開contentsがnilという観測だけで、Core Animation内部backingの不存在や透明を意味しません。nonnullでも不透明なobjectとして記録するだけで、画素を読めたことにはしません。読取で例外があれば診断errorとして残し、製品の成功/拒否を置き換えません。Appleの[CALayer.contents](https://developer.apple.com/documentation/quartzcore/calayer/contents?language=objc)と[displayIfNeeded](https://developer.apple.com/documentation/quartzcore/calayer/displayifneeded())を照合し、強制更新を避ける範囲としました。

新CIはsource時点で未実行です。前回の175成功を今回の再実行成功へ転記しません。formal_admission/product_acceptance/normal_save_reopen_complete=false、v9未採用を維持します。Supabaseは一覧のACTIVE_HEALTHYのみ確認し、DB query/apply/本人行/業務RPC0。API/runtime/環境値/署名/配布/deploy/main merge0です。

### 85.2 一度の結果：自然contentsはnonnull、画素は未観測

source **623662b693cc829a6877e042e46ffdaf0702c72c**／tree **4b07a293b7f1a990a38eec1dd59d28c73ecfecd0**の6path全文と変更集合をremote照合しました。[run39502473690 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39502473690)は21:42:06〜22:10:05 UTC（27分59秒）、**全6job success・CI全体success**です。前回の取消理由の解明や修復を意味せず、今回のmetadata観測がjob成功の原因とも主張しません。source追加修復・同source再実行0です。

JS915 PASS、fail/skip/cancelled0。native175個別PASS/unique175/FAIL0（旧97＋v5追加32＝129、v9追加46）、LEGACY97/V9=46/最終129の3summary、launch0が揃いました。mainから最終summaryまで34,488.192msで元90秒内、native jobは5分21秒でsuccess。Android source compileもsuccess。export2jobはsuccessですが、依存compile/Pod解決はscope skipで再compile成功ではありません。他の自動check5件もsourceに対してsuccessです。

実RNはbaseline5/5・supplemental3/3・raw3/3、全11でnative_canvas_valid/body_preserved=true。v9 local/placed59組で同token/Text/canvas/独立5値、preview7の同token fit=true/wrong-token=false、Card8のcanSave/canExport=false、旧saved v3のfitなしとraw3の権限なしを維持しました。

| 例 | 最終reportまで | font |
|---|---:|---:|
| essay_paragraphs | 5422.762ms | 48pt |
| mixed420 | 5356.544ms | 36pt |
| あ420 | 2790.863ms | 36pt |
| Arabic | 181.273ms | 72pt |

全11が元8秒内ですが、これは既存report時点までで、後続PNG capture完了までの時間ではありません。計測方式や選択を変えていないため、前回との時間差を性能改善・悪化の原因証明へ転用しません。

新しいplaced観測は**Arabic72ptの1件**です。既存geometry reader/resolve前、main thread、同じText/storage/layout/container、同じtag/canvas/token/stage、wireと同じcanvas frame、同window/descendant、前後の観測state同一を確認しました。callbackの残期限は7864.397ms、読取所要0.265ms。canvasのalpha/layer opacityは0、Textはalpha/opacity1、hidden=falseです。TextのcontentsScale/viewContentScaleは3、needsDisplay/needsLayout=falseでした。

**公開contentsはnonnullで、記録classは`__NSCFType`です。nilではありません。** private class名からCGImage型を推定せず、CFGetTypeIDやCGImage castは実行していません。`pixel_observation=NOT_PERFORMED`のままです。観測したmodel-state/identity一致は、内部backingの画素内容やphysical表示の一致を証明しません。他font・他Text・全入力へ一般化しません。

元PNG11枚は、旧link-repair保存bundleの各memberとbytes完全一致。全11一覧とArabic/420原寸を目視しました。完成PNG後の既存layer診断はlocal[99,22,430,98]、placed[98.3905029296875,21.5,430.3905029296875,97.5]で、direct wireのplaced[98.3905029296875,22.5,429.3905029296875,97.5]と依然1px差があります。今回のcallback metadataは、この差の実画素比較そのものではありません。

artifact12303830546（ZIP SHA256 c6787efdd5572cfc20a52ad4f74b401dda91252e6b8ca1b7b959699e78e14a6c、期限2026-10-27T22:09:49Z）の64原fileは、新bundleの53 artifact memberと、旧保存先へbyte一致で結び付けたPNG11から復元できます。新bundleには全6job元ログ、raw report、xcodebuild.log、xcresult原file群、metadata、解析と解析scriptもlossless保存しました。ZIP容器そのものの再生成一致を主張せず、各原fileのbytes/hashを照合しています。今回のreport/token/timeは今回固有で、旧PNG参照を成功記録の流用に使いません。

primary outcomeは**BLOCKER_NARROWED**。自然contentsが配置直後にnonnullという限定観測と、同sourceの回帰結果です。実画素包含・body/branding縮小・正式renderer採用・採用版saved/InputScreen供給・通常保存→本人履歴/実機は未完了で、formal_admission/product_acceptance/normal_save_reopen_complete=false、v9未採用を維持します。結果反映は既存5資料だけ、製品/test/workflow追加変更・再実行・DB query/apply/本人行/業務RPC・API/runtime/環境値/署名/配布/deploy/main merge0、STRUCTURE_MAP_DELTA_NONEです。

### 85.3 次の最小観測案（未実施、製品契約を変更しない）

今回のmetadata-only単位は終了します。fresh nonnull/needsDisplay=falseの結果を根拠に、次は既存test harnessの同placed callbackで、自然に存在する同Textのlayerを公開`renderInContext:`で外部の固定RGBA contextへ合成する**placed-only診断**を候補とします。既存の完成PNG後の診断と同じAPI/bitmap形式を使い、unknown contentsの型を推定・解読しません。

対象は`tests/native/piece-rn-canvas-ios.m`と同じ5資料だけです。 Arabic72ptのplaced成功1件に限定し、既存post-PNGと同じ1536×512/RGBA8/stride6144/pad160/scale1（約3MiB）のcontextを使います。実配置の小数位相を保ち、取得像をraw RGBAまたは可逆PNGとして保存してから即時解放します。同じregistry node/storage/layout/container/tag/canvas/token/配置/期限を確認し、最初のmetadataを読み、同layerを一度外部contextへ写し、alphaをscanして元wire/完成後layer/元PNGの境界と比較します。前後metadataとcontents identity、dirty flags、残期限も記録します。元wire・resolve・oracle・fixtures/assertions・175分母・元8秒/native90秒/job上限・製品sourceは変更しません。

setNeedsDisplay/displayIfNeeded/layoutIfNeeded/flush/opacity変更/新待機/再試行・private class解析・未知idのCFGetTypeID/CGImage castを追加しません。nil、dirty、未知背景/子layer等、empty/edge、資源/期限超過、identity/state変化は診断未成立として残します。外部contextでのlayer合成という測定であり、内部backingのbytes直接取得・private paint非発生・physical画面同一を保証する測定とは呼びません。元wireへ結果を採用せず、contains/fit成功へ加算しません。[Apple CALayer](https://developer.apple.com/documentation/quartzcore/calayer?language=objc)のrenderInContext/needsDisplayと、既存完成後診断を根拠に、既存v9のLEVEL_2限定診断として具体化した未実施案です。次sourceの一度の既存CIで結果を原物保存し、不成立でも強制表示・追加描画へfallbackしません。

計測bitmapそのものを表示する別preview v10案も比較検討しましたが、fresh nonnullを受け**次の推奨routeにはしません**。それはRGBA8/sRGBの新描画、PNG/bridge/Image decodeと資源barrier、見え方・版・wireの変更を伴うLEVEL_3の未承認案です。現在の次診断の失敗時に自動採用しません。まず今のText表示を維持したまま、同配置時点のlayer合成結果を直接比較します。


## 86. 2026-10-21 — 配置直後の同Text layerを外部RGBAへ一回合成する診断

入口§85.3の既存案を実装します。current source parentは4c711ab5b0f759dedf2f21d1a9893668fd4a16e3、APIはa536e50ee284785f585ac73329ef2947dca8bba9。前回の自然contents nonnullと、完成後layer対direct wireのtop/right各1px差が未解決のため、同じ配置時点で差があるかを直接比較します。P-W1の実描画包含→正式renderer→通常保存への残差を限定するOBSERVED_BLOCKER_MINIMAL_FIX／LEVEL_2です。root単一writer、PIECE_WORK_ALLOWED。Mashのモデル制限解除を適用し、補助担当は読取レビューだけです。

対象exact6はtests/native/piece-rn-canvas-ios.m、入口、本map、最新weekly、07_latest_snapshot_diff、既存manifest。Arabic72ptのplaced成功callbackで、最初のmetadata読取後・既存geometry/resolve前に、同Text layerを1536×512／RGBA8／sRGB／stride6144／pad160／scale1へ一回だけrenderInContextで合成します。実配置の小数位相と既存完成後診断のCTMを維持し、raw .rgba原物を保存してalpha境界を走査します。buffer3MiB＋所有copy3MiBを固定上限とし、即時解放します。公開contentsの型推定・直接backing解読はしません。外部合成であり、private paint非発生やphysical画面同一は保証しません。

同registry Text/storage/layout/container/tag/canvas/token/frame、contents identity、dirty flags、前後metadata、残期限を照合します。nil/dirty、非透明背景・子layer・mask/transform等、空/edge、資源/保存失敗、identity/state変化・期限超過は診断不成立として保存します。元wire、resolve、oracle、fixtures/assertions、175分母、8秒/native90秒/job上限を変更しません。setNeedsDisplay/displayIfNeeded/layoutIfNeeded/flush/opacity変更/新待機/再試行は0。取得のための別renderer・v10へfallbackしません。

全体設計01・全file地図01A/01B/02・current map・最新weekly・mandatory incident全文・Karen-Diary入口3file・規則current/18/09/08/11/17/99と技術正本11/14、実harness・native inspector/Card・既存workflowを確認しました。System Context prepareはmaterialized環境でtools module不在のため失敗し、同入口が許可する原典直接読取へ移行しました。生成context検証成功とは扱いません。Supabase一覧ではcocolon-project ACTIVE_HEALTHYを確認し、DB query/apply/本人行/業務RPC0です。

完了条件は新sourceの既存push CI一度の結果とraw/reportを保存し、元wire・完成後layer・元PNGとの差を比較できること。予想CI30〜40分、Mash操作追加0、追加service/依存0。未成立でも強制描画・同source再実行はしません。契約・表示/判定方式/版変更が必要ならこの単位の外として具体化します。source時点の新CIは未実行、前回JS915/native175/RN11成功は履歴です。formal_admission/product_acceptance/normal_save_reopen_complete=false、v9未採用、canSave/canExport=false、automatic_progression=false。STRUCTURE_MAP_DELTA_NONE（既存harness内の観測のみ、製品owner/route/型/公開contractは不変）。


### 86.1 途中checkpoint：native175・JS915成功、実RNの採取は進行中

source1f168d19ebfbe05d80d14e0e33f41c1dbb057419／tree332c600552c5ed83d6b338abe41f28aae5e27362の全6path・blob全文を読み戻し一致確認。run39509902845 attempt1のJS915、native175 unique PASS/FAIL0、3summaryとlaunch0を確認しました。native main22:49:30.586〜最終summary22:50:28.886 UTCの約58.300秒は元90秒内です。Android source・export2jobもsuccess、export依存compileはscope skipです。実RN canvas jobは同じ一度のrunで進行中のため、raw画素・今回RN11条件・CI全体は未確認とします。

取得済み5job元ログとmetadataをmanifest v102の同owner.interim_evidence_bundleへlossless保存。追加source修復・再CI・DB/deploy/main0。既存5資料の途中保存のみで、formal_admission/product_acceptance/normal_save_reopen_complete=false、v9未採用を維持します。


### 86.2 最終結果：配置直後のlayer合成と完成PNGの範囲が一致、direct測定だけtop/right各1px過小

source **1f168d19ebfbe05d80d14e0e33f41c1dbb057419**の一度の[run39509902845 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39509902845)は22:41:13〜23:02:12 UTC（20分59秒）で全6job/CI success。JS915/native175 unique PASS/FAIL0、3native summary/launch0、Android sourceが成立しました。export2jobはsuccessですが依存compileはscope skipです。追加source修復・同source再実行0。

実RNはbaseline5/5・supplemental3/3・raw3/3で全11 native_canvas_valid/body_preserved=true。mixed420は4437.769ms、あ420は2376.193ms、Arabic72ptは204.392ms（最終reportまで、後続capture完了時間ではない）。全11が元8秒内です。v9 local/placed59組のtoken/Text/canvas/独立5値一致、preview7のsame-token fit=true/wrong-token=false、Card8のcanSave/canExport=false、旧saved v3のfitなし、raw3の保存権限なしを確認しました。これらを前回件数へ加算しません。

新観測はArabic72pt・placed成功callbackの**一件だけ**。同Text/storage/layout/container/tag/canvas/token/frame、前後metadataとcontents identity、clean flags、残期限7876.398→7866.681msが成立。観測全体10.113ms、canvas alpha/opacity0・Text opacity1のまま、外部合成はvalidでした。固定3,145,728 bytesのraw SHA-256は `cc5e1e4c73b37e657430f31c8ef5147bd24b2175ab8c9ddc63728420e6ccbbf2`。独立Python/Pillowでalpha>0の6,285画素を走査し、native記録と同じraw境界[259,182,591,258]を得ました。

| 同じTextの範囲（local座標、left/top/right/bottom） | 結果 |
|---|---|
| 元v2 direct wire | [98.3905029296875,22.5,429.3905029296875,97.5] |
| 配置直後の外部layer合成 | [98.3905029296875,21.5,430.3905029296875,97.5] |
| 同run・完成PNG後のlayer合成 | [98.3905029296875,21.5,430.3905029296875,97.5] |
| 同run・元Card PNGのRGB差分 | [98.3905029296875,21.5,430.3905029296875,97.5] |

PNG比較はこのfixtureの固定領域[350,570,750,700]の全borderがRGB[255,253,248]であることを確認した上での背景との差分です。canvas上の境界[374,600,706,676]を同じframe原点へ戻しました。raw alpha像と元Arabic Cardを目視し、元PNG11枚は以前の原物とbytes完全一致です。

**この一件ではdirect測定が上端・右端を各1px狭く返し、配置直後の外部layer合成は完成後layer/元PNGの境界と一致しました。** 完成PNG後の観測だけに由来する差ではないと限定できます。directはscale1へTextKit glyphを直接描き、layerはcontentsScale3の既存内容を合成しています。backing scale/縮小補間/context設定等は候補ですが、単独原因の確定ではありません。外部合成時にprivate paintがなかったこと、内部backing bytesの直接取得、全画素一致、physical画面や全入力の保証とは扱いません。

artifact12305059324のZIP SHA-256は54ec831e253b12630445ae468f5f6e116297769e51d9370114f9ef32368384aa、元65member（raw/report/xcodebuild/xcresultを含む）を確認しました。同owner.final_evidence_bundleには原artifact54member、全6job元ログ、metadata、独立解析/解析scriptをlossless保存し、元PNG11memberはimmutable旧commitの同一bytesへ明示参照で結び付けています。ZIP容器そのものの再生成一致は主張しません。

途中manifestの巨大本文読戻しは2回Transport closed、contents部分読取は空でした。書込結果不明として再書込せず、既に全読できたimmutable commit4c711abの旧bundleをJSON pointerで参照する形へ縮小し、現在manifestの全文読戻し一致を回復しました。旧原物はGit履歴に保持し、削除・置換していません。今回の最終bundleを含めても全文取得できるサイズへ保ちます。

primary outcomeは**BLOCKER_NARROWED**。配置直後と完成後の差を切り分ける単位は終了し、包含判定の過小評価は未修復です。実layerの非欠落保証、本文/brandingの縮小、正式renderer採用、同版saved/InputScreen供給、通常保存→本人履歴/実機は未完了。formal_admission/product_acceptance/normal_save_reopen_complete=false、v9未採用、automatic_progression=falseを維持します。結果は既存5資料だけ、製品/test/workflow追加変更・再CI・DB query/apply/本人行/業務RPC・API/runtime/env/署名/配布/deploy/main merge0、STRUCTURE_MAP_DELTA_NONEです。

### 86.3 次の一作業：実描画包含の修復設計を確定する

今回のnonnull/metadata/同callback raw採取は再実装・再実行しません。次は既存native inspector→Cardの修復として、**意図した非clip描画と実layerの範囲を保持し、本文/brandingの論理高さ・余白・次fontへ一体で反映する最小差分**を具体化します。画像保存やAPIを先に解禁せず、完成PNGとの完全画素一致を新しい一般受入条件へ追加しません。

比較検討した案は、元v2を保持し、別候補のselected_line.v3でdirect alphaと自然layer alphaのunionをinkとして返す方法です。local unionで配置、placed unionで厳密包含と既存次font処理へ接続するため、閉じたwire/profileとink定義の変更を含むLEVEL_3未承認案です。現行v2のinkへ黙ってunionを代入しません。従来比較案の「bitmap表示v10」とは別の未採用案であり、版名や契約を確定していません。

**unionだけでは、既にbackingでclipされたnative-scaleの意図した画素を回復できない可能性が残ります。** direct側がscale1なので、native-scaleの非clip参照または保守的な境界が一致する根拠も必要です。一律1px追加、固定padding、bboxの単純な倍率変換を解決としません。localの2RAFも自然contents readinessの証明ではなく、nonnull/clean/同一性/期限の実確認が必要です。現行brandingのopacity0.8をArabic診断のopacity1条件で全拒否せず、既存表示のまま扱います。これらを含む具体的な最小修復・可視差・検証/STOPを定めてから、契約差がある部分だけRule18 §11.3の判断へ戻します。未確認の案を採用・実装したとは扱いません。


## 87. 2026-10-21 — 実layer包含修復の具体仕様（実装判断待ち）

今回の継続指示から§86.3を完了する設計単位です。基点はPR30 head `763ab03b5fd0cb545a0da606c5a7fafd87726d70`／tree `a273e853b46af6465448c6f6b64d8e04fdb08315`、APIはPR3 head `a536e50ee284785f585ac73329ef2947dca8bba9`。全体設計01/01A/01B/01C、全国民制、全file index・非打切りrecursive tree1909件、Piece/current map・最新weekly§5.6・作業規則入口/Rule18§0A/§11.3・mandatory incident全文を確認し、現materialized38fileをtree blobと照合しました。System Context prepareはtools module未提供のため失敗し、既存入口で許された原典直接読取を使っています。Supabaseは対象projectのACTIVE_HEALTHY確認だけで、SQL/本人行/業務RPC/変更0です。

### 87.1 単なる補足検査では直らない理由と判断点

v2成功wireの18fieldとscale1 inkを保持する内部補足検査は、Rule18§11.3 LEVEL_2になり得ます。native-scaleを内部で使うこと自体やモデル名を新たな承認事項にはしません。しかし現Cardは返却inkでlocal配置、本文論理行高、branding高40、canvas余白±0.5、次fontを一体判断します。nativeでlayer不適合をrejectするだけではcatchがunavailableへ落ち、縮小へ進みません。own-view内にあるlayerでも論理行高/余白を越す場合があり、1px差に応じた配置も補正できません。nativeへCardのlayout budget推測を新設する案より、測定した範囲を既存Cardへ渡す方を推奨します。

そのため、別iOS preview `piece.rn_native_preview.containment.prototype.v1`＋`piece.native_selected_line.v3`を提案します。通常のRN Text表示と既存候補v5/B9を維持し、比較履歴のbitmap表示v10を採りません。旧v2/旧v9の定義を上書きしません。**新ink定義・閉じたwire・profileの変更部分はLEVEL_3未承認**です。Rule18§11.3の「商品目的、商品体験、method family、contract、acceptanceまたは品質条件を追加、変更、置換または弱化する。」に該当する場合の明示判断が必要です。モデル制限解除、既存GitHub許可、旧v9承認の取り直しではありません。

### 87.2 native→Cardの最小仕様

| 項目 | 限定実装で固定する内容 |
|---|---|
| 同じpaint | 既存RN0.77.3 patchに、現在のdrawRectの背景/glyph描画2呼出しだけを共有するread-only paint methodを加える。通常drawRectも同methodを使い、元super/highlight/Catalyst処理順は維持。現在のplain Piece Text以外のattachment/highlight/background/shadow/mask/子layer/非translation等は対応を捏造せず拒否。新Text描画器を表示しない |
| A: direct | 旧v2と同じscale1 draw/scan結果。draw/scanだけをpure内部関数へ切り出し、旧snapshot key/副作用/返却を維持。v3からsnapshotを持つ旧method全体を呼んでtokenを二重生成/消費しない |
| B: native | 同じmounted storage/layout/container/全glyphrange/content frameを共有paintへ渡し、S=view.contentScaleFactor=layer.contentsScaleの有限正値で非clip描画する。native raster gridはText-local原点0へ固定。実alpha>0を全走査したnative pixel cellを、local phase0／placed実canvas原点のlogical scale1 cellへfloor/ceilで外向き射影する。TextKit bboxの単純倍率値はinkにしない |
| filter込み参照 | Bの非clip画像を、実layerと同じ対応可能なpublic contentsRect/Center/gravity/filter/geometryでlogical1へ合成したalpha範囲もBへunionする。native cell射影だけでfilterの外側画素を切らない。外部参照layerは一時memoryだけで、表示treeへ挿入・実layer再parent・画像file/bridge転送をしない |
| 参照の忠実性 | 各成功要求で、非clip参照を元viewでclipしたnative-scale合成と、同じ自然layerのnative-scale合成を、同grid/geometry/stateで全alpha occupancy比較する。fixtureだけの一致でlive入力を保証せず、実行時不一致はunavailable。actualRN testは自然drawRect直前のCTM/clip/frame/Sを一回観測し、参照/自然paintの対応も確認。shared method＋3倍だけを忠実性の証明にしない |
| C: layer | 同一Textの自然nonnull/clean layerを、localはphase0、placedは実小数canvas位相で既存renderInContextへ合成し、alpha>0を全走査。Canvas祖先opacity0を変更しない。body1/branding0.8を自然状態で束縛し、root opacityが減衰しない合成なら保守的な非減衰footprintと明記する。勝手なalpha1化/二重alpha乗算はしない |
| ink/wire | v3は旧18field＋native_raster_scale＋component_inksの20fieldを閉じて受理。component_inksはdirect/native/layerの3rectだけ、inkは3rectの厳密unionでJSも再計算する。raster_scale=1は出力logical cellのgrid、native_raster_scale=Sは元backing gridを示す。native成分はrawcell射影とfilter込み参照のunion。requestは元4fieldのまま、native entry名だけinspectSelectedLineV3で分離 |
| local/placed | 新profileだけ各stageで2RAFを一度awaitし、残余元8秒で自然contentsを確認。2RAFはreadinessの証明ではなく、nil/dirtyなら失敗。localで3成分と最終同一性が全成立した時だけv3専用keyへ一つのtokenを保存。placedは開始時一回消費し、同contents identity/scale/geometry/attrs/全layout/opacity/filter/deadlineを前後照合。旧v2とのtoken流用、poll/強制display/layout、同font再計測/再配置loop0 |
| Card配置/拒否 | local unionで既存rowOffsetsを一度決め、placed unionでstrict own-view・本文lineHeight・branding40・width・元余白±0.5を判定。検証済み幾何学overflow/既存禁則違反だけ次の既存fontへ進み、floorでunavailable。未準備/参照不一致/stale/資源/期限は縮小retryせずunavailable |
| branding | 現行font28/lineHeight40/required_subtle opacity0.8を維持。branding超過も既存次候補分岐へ入るが、branding font自体は縮まない。全候補で不適合ならunavailableであり、branding縮小済みとは報告しない |

共有paintの上流原典は[公式RN0.77.3 RCTTextView.mm](https://github.com/react/react-native/blob/v0.77.3/packages/react-native/Libraries/Text/Text/RCTTextView.mm)、blob `47632aa885cdb314fbcb2dfe94137d5101cee34d`です。全文を読み、iOSでは当該2呼出し以外の明示text context設定がないこと、highlight生成は別処理であることを確認しました。UIKitが用意する全graphics stateの同値性を、このsource確認だけでは断定しません。

### 87.3 原予算内の資源・期限

native参照extentはTextKit ink±2fontのscratch範囲をnative gridでfloor/ceilします。viewBoundsとのunionまで3倍するとArabic72で(1080+288)×3=4104pxとなり、元4096上限を越すため使いません。2fontは返却inkへ足すpaddingではなく測定領域です。空/外縁alpha/unsupported状態/参照対応不成立は拒否し、領域拡大の再描画・tile・固定1px補正へ逃げません。有限extentの外に未知fontの離れた画素が絶対に無いという一般保証は未成立で、同paint/全glyphrange/対象font/layout/明示clip trapの根拠を確認できなければ未採用STOPです。

1辺4096 actual pixel以下、各context総4,194,304pixel以下、provider32MiB以下を保持し、native非clip画像・参照/実layer比較buffer・logical合成・provider copyの**同時保有合計も32MiB以下**へchecked arithmeticでpreflightします。一成分ずつ解放し、snapshotへ画像を残さず、上限不足なら確保前に拒否します。元wall-clock/monotonic deadlineを全draw/scan/比較/2RAF/bridge/最終fitへ通し、8秒の起点やnative90秒alarm/job上限を変えません。速度/資源成立は未実証です。

### 87.4 exact pathと一度の検証

実装判断の対象は既存19pathだけです。

| 区分 | path |
|---|---|
| 製品6 | ios/tempCocolon/PieceTextMetrics.mm、patches/react-native+0.77.3.patch、features/piece/pieceRenderer.js、components/piece/PieceVisualCard.js、features/piece/pieceLayout.js、features/piece/pieceMeasuredWrap.js |
| 検査7 | tests/piece-v2-renderer.test.js、tests/piece-v2-measured-wrap.test.js、tests/native/piece-text-metrics-ios.mm、tests/native/piece-ios-react-shim.h、tests/native/piece-rn-canvas-entry.js、tests/native/piece-rn-canvas-fixtures.cjs、tests/native/piece-rn-canvas-ios.m |
| workflow1 | .github/workflows/piece-rn-contracts.yml。既存97/129とv9 46、新v3 20のsummaryおよびunique PASS195を厳密に確認するだけ。時間・job/fixture分母は変えない |
| 資料5 | 本入口、manifest、current_structure/02_piece_current_structure.md、weekly_reviews/Cocolon_Weekly_Review_20261017.md、07_latest_snapshot_diff.md |

nativeは旧175uniqueを保持し、新v3の20unique判定を別counter/summaryへ加え195uniqueを予定します。closure/正確union/direct-v2不変/S2/S3/正負小数位相/同snapshot/branding0.8/native clip trap/nil/dirty-display/dirty-layout/scale不一致/snapshot変更・版間token拒否/unsupported描画状態/資源上限・整数overflow/外縁/空/期限・one-useを含めます。20の内部matrixを成功行の重複加算にせず、旧NATIVE_CHECKS=129とV9_NATIVE_CHECKS=46を保持してV3_NATIVE_CHECKS=20を追加します。native wrapper doubleを実RN paintの代用にしません。

JSは元915を保持し、新閉schema/全成分偽造/union/同一性/期限/本文とbranding overflow→次候補/floor/不成立→unavailable/旧版互換を追加。新sourceをPR30へ反映・全19path読戻し後、既存push CIを一度だけ確認します。実RNは既存baseline5＋補足3＋raw3の11条件を新profileで省かず、旧saved v3/保存export拒否も保持。自然native backingでclipされdirect1ではfitするtrapとbranding0.8を同harness内の追加2条件として確認します。row/font変化があれば全rendered rowの独立5値・token/fit対を再導出し、旧59へ分母を合わせません。

完成PNGは全体の本文・改行・配置・元余白・brandingと旧版との差を記録します。新inkによる位置/選択font/改行の可視差はあり得ます。全PNG完全一致を一般品質条件へ追加せず、旧v2/v9とsaved v3のsource/互換は保持します。同mount/token current・誤token拒否、全Card保存/export false、元8秒/90秒、native全分母、runtime参照対応が揃わなければ未採用で結果記録しSTOP。同source再実行、判定緩和、未確認項目をgreen扱いすることはありません。

### 87.5 完了範囲・必要な明示判断

今回完了したのは具体仕様と原典照合の既存5資料への記録です。製品/test/workflow変更、CI実行、DB/API/runtime/flag/env/依存追加/署名/配布/deploy/main mergeは0。STRUCTURE_MAP_DELTA_NONE。モデル条件はPIECE_WORK_ALLOWED、華恋rootが単一writer、補助agent3名は独立read-only検討です。正式admission/product acceptance/通常保存・本人再表示はfalse、automatic_progression=falseを維持します。

必要な判断は、**§87.2〜87.4の新ink/wire/profileを含む限定実装・GitHub19path反映・新source一度のCIと全結果記録まで進めること**です。追加購入/依存/定常費用0、実装工数と既存CI一回の使用量が増えます。前回CI20分59秒は参考実績で、今回の所要時間/8秒成立を約束しません。承認がない場合は設計記録で止まり、現在のv9や通常保存を開放しません。成立後も正式renderer採用→同版saved reader→InputScreen正式isSaveAdmitted供給→既存controller/API通常初回保存→本人GET/履歴は別の未完了作業です。


## 88. 2026-10-21 — 承認済み包含修復候補の実装と一度のCI

Mashは直前の「旧v2を保持し、元の8秒制限を維持した新候補の実装と、一度のCI検証まで進めてよいですか？」へ「いいよ、進めて。」と明示承認しました。§87.2〜87.4の新ink/wire/profile・既存19path反映・一度の検証と結果記録が今回の範囲です。設計時点の未承認記載は履歴であり、同じ判断やGitHub許可を再確認しません。

### 88.1 開始と今回の完成単位

| start field | current actual |
|---|---|
| product_destination | 実描画を過小評価しないPiece preview候補から、正式renderer/通常保存へ接続する |
| current_gate_or_subgate | weekly P-W1、実Text非clip意図描画と自然layerの包含修復 |
| exact_work | §87の別preview containment.prototype.v1＋selected_line.v3を19pathへ実装、全source照合、一度の既存CIと全結果記録 |
| scope_classification | LEVEL_3、今回Mash明示承認済み |
| approval_or_delegation_basis | 今回の「いいよ、進めて。」、入口§87の具体仕様と元8秒・一度CI/未達STOP |
| execution_owner | 華恋root、Codex GPT-6系、PIECE_WORK_ALLOWED。rootが唯一repo writer、補助agentはread-only reviewとscratch draftだけ |
| success_credit | 成立時は候補のTECHNICAL_CREDITに限定。正式admission/商品完成/通常保存のcreditへ変換しない |
| completion_condition | 19path全文照合＋一度CIのJS/native全分母/実RN13条件/PNG/独立5値・fit/元期限の実結果を記録 |
| stop_condition | native195/実RN/参照対応/包含/元8秒・90秒/資源上限が未達なら未採用STOP。同source再実行・条件緩和0 |
| prohibited_scope | 旧v2/旧v9の定義置換、bitmap表示、正式保存/export/Android候補開放、DB/API/runtime/flag/env/依存追加/deploy/署名/配布/main merge0 |
| next_product_read_or_mash_decision_point | 今回の有限検証後の正式採用・同版saved/InputScreen正式供給・通常保存/本人GETは未完了。自動進行しない |
| current_source_test_receipt | Cocolon0d09bb6、前回source1f168d19/run39509902845の独立証拠を保持。今回source/testはmanifestの19path preimage/新blobで束縛 |
| current_docs_and_heads | PR30 head0d09bb6c1f466711aa8e6d5d86c0b2f7f3f3f4f7/tree774d155b0dc1475b365590cb0a1c6abb070245da、API PR3 a536e50ee284785f585ac73329ef2947dca8bba9。全体設計/全file map/tree1909・最新weekly/current map・規則/mandatory incident全文を再確認 |
| affected_current_structure_maps | Piece current map§65.36。STRUCTURE_MAP_DELTA_PRESENT：同じRN Text内の新preview/計測wire/共有paint責務。新tracked file・API/DB/cross-core route変更0 |

System Context prepareは今回もtools module未提供で失敗し、原典直接read fallbackを使用。Karen-Diary入口と指定2memory、作業規則入口/CURRENT_RULES/Rule18/開始check、全体地図、対象実source/testを確認。current source/treeとmaterialized原典のblobを照合し、単に過去summaryを承認根拠にしません。Supabase操作・本人行・業務RPCは今回0です。

### 88.2 実装した差分と内部調整

1. 新profile `piece.rn_native_preview.containment.prototype.v1`だけ、新bridge entry `inspectSelectedLineV3`と閉じた20fieldを使用します。元候補v5/B9・font順・本文/recipe・独立CTLine5値は保持。旧v2のscale1 draw/scanだけをpure関数へ分け、旧snapshot key/18field/返却を維持しました。
2. RN既存patchで通常drawRectの背景/glyph2呼出しを共有methodへ移し、元super/highlight/Catalyst処理を維持。v3専用plain gateを別methodとし、Piece以外の通常Text表示を拒否しません。共有methodは表示rendererの置換ではなく、同TextStorageの計測にも使います。
3. native gridはview原点0/Sへ固定し、TextKit ink±2font内で非clip描画/全alpha走査。実native cellをlogical1へ外向き射影し、同public filter/geometryの非clip合成範囲もnative成分に含めます。自然layer成分と元direct成分のunionを4edgeのmin/maxで返し、JSも厳密再計算します。
4. **fractional view高を整数cropで近似しません。** 既観測のArabic高98.333328247×3は294.9999847であり、整数一致を新しい門にすると通常のRNを拒否します。clipped参照は同grid/同paintを元view boundsで先にclipして描き、full-view透明画像→同filterのnative合成→自然layerの全alpha occupancyと実行時比較します。失敗後retryではなく、必須比較用参照の忠実な生成方法です。未知drawing stateを許容差や固定1pxで通しません。
5. provider最終releaseがRGBA allocationを解放する所有権へ移し、CAがcontents画像を遅延保持してもuse-after-freeを生じさせません。shared atomic budgetもproviderまで生存。各context4096/4Mpixel、provider/同時保有32MiBを確保前に確認し、遅延保持中の予約も残します。一時layerのimplicit actionsを止め、実layerの再parent/強制layout/display/transaction flushは行いません。private CA cacheをcode-owned memoryとして計測できるとは主張しません。
6. 新profileだけlocal/placed各2RAF、自然nonnull/clean/同contents/scale/geometry/attrs/layout/元dual期限を確認。nil/不一致/stale/資源/期限はunavailable、有効なunionの幾何超過だけ既存次fontへ進めます。branding28/40/opacity0.8は固定。fit handleも新profileでは後続readごとに元deadline同一性とexpiryを再確認します。
7. workflowの原時間/job/検査分母を保持し、旧97/129＋v9 46＋新v3 20の4summaryと195unique PASSを要求。新参照とnative fixtureが使用する**既存iOS SDKのQuartzCore**をstandalone compileのframework一覧へ明示しました。§87でworkflowを件数照合中心とした記載に対するbuild整合の最小追加で、新third-party依存/serviceや時間条件の拡張ではありません。

### 88.3 source時点の検証と未確認

Node24.19.0＋既存dev dependency TypeScript5.2.2を一時test環境へ用意し、既存13test fileを通しで**933 PASS、FAIL/SKIP/CANCEL0、14,436.28399ms**。元915を保持し、renderer16＋measured-wrap2の18件を追加。閉schema/成分偽造・4edge両方向1ULP/正確union/同S・token/期限・各stage2RAF/本文とbrandingの超過・floor/不成立unavailable/fit失効/旧版互換を確認しました。実React/フォント/画素の合格には換算しません。元raw logはmanifest内のlossless gzipへ保存します。

nativeは旧175uniqueを維持して20追加、actualRNはbaseline5/補足3/raw3の元11を省かず、synthetic native clip trapとbranding0.8の2条件を追加しました。trapは実fontで自然発生した欠陥ではなく、test-only共有paintへnativeS時だけ元view上辺外1cellを描く明示故障です。元directはfit、自然backingはclip、非clipnativeはoverflowすることを独立raw oracle/実node/frame/unionで要求します。falseなcanvasだけで検出成功にしません。

通常drawRectと参照paintのCTM/clip/frame/Sも同じ現viewに束縛して観測。RN patchは公式0.77.3全文への適用dry-runが成功。LinuxではUIKit実行/コンパイルは未実行です。**JS933だけで新sourceの描画成立、195/13条件、資源/時間成立、正式renderer採用を主張しません。** 次は新sourceを一度の既存push CIで確認し、結果を同じownerへ記録します。source反映後は製品/test/workflowを追加編集せず、全job原ログ/実RN原物/画像差を回収します。途中結果も全件成功とは扱いません。

formal_admission/product_acceptance/normal_save_reopen_complete=false、新候補/旧v9とも未採用、automatic_progression=false。今回の実装は通常初回保存・本人詳細/履歴・実機受入れの完了ではありません。


### 88.4 途中保存：source19path照合、一度CIのnative195完走

source `9b0abdeda1e417f475a212a269021374f72e1553`、tree `b83d10e5808f82ad163cedd3544af2495e54f909`、parent0d09bb6cの19pathをGitHubから全文取得しlocal正本と一致確認。一度のpush CI [39523761970 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39523761970)は同source固定で実行中です。

| 検証 | 今回確認した実結果 |
|---|---|
| JS | CI933 PASS/FAIL0、11,430.378062ms。local933/14,436.28399msも別証拠として保持 |
| native | 195 PASS行/195unique/重複0/FAIL0。旧97を内包する129＋v9 46＋新v3 20。4summary一致、launch status0 |
| native時間 | main_entered00:56:44.380589Z→最終summary00:57:25.805654Z、ログ時刻差41.425065秒。元alarm90秒内 |
| CI jobs | JS/native/Android source/export Pods/export Androidの5job success。両export依存compileは今回は実行済み |
| 実RN | 最後のcanvas job継続中。13条件/全PNG/全rendered row/元8秒の成立はまだ未確認 |

native compile警告はenum型ORとshim nullability注釈。main後の実行時異常は見当たらず、fault名のPASSは意図的拒否検査です。195件はstandalone wrapperの証拠であり、実RNや実機・正式admissionへ換算しません。

5jobの原ログ・source/run/job metadata・native独立集計・元Podfile.lock ZIPをlossless bundleで保存しました。旧placed-composite最終bundleは、全内容を読戻し済みのsource9b0abded内の同JSON pointerへ不変参照化し、旧compressed hash/member情報を保持。旧原物はGit履歴から復元可能です。これはmanifest全体の全文再取得を可能に保つ整理で、過去証拠の廃棄ではありません。

製品/test/workflowはsource確定後に追加変更0。資料5pathだけの途中保存で新Piece CIを起動せず、同source再実行0。正式採用/product acceptance/normal save/reopenはfalse、automatic_progression=false。残る一度CIの原物を回収し、未達条件があれば未採用STOPで最終記録します。


### 88.5 最終結果：実RN testのmacro構文でbuild停止、未採用STOP

一度のCI [39523761970 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39523761970)はsource `9b0abdeda1e417f475a212a269021374f72e1553`で**failure**。created/run_started00:50:46Z→updated01:04:51Zは14分05秒です。途中資料b2eafc22の5pathもGitHub全文一致を確認しました。今回の承認単位である実装・19path照合・一度CI・全結果保存までを終え、検証合格や正式採用には至っていません。

| 対象 | 最終実結果・限界 |
|---|---|
| JS | CI933/933 PASS、FAIL/SKIP/CANCEL0、11,430.378062ms。local933/14,436.28399msとは別の原ログ |
| native | 195個別PASS/195unique/重複0/FAIL0。旧129（内包97）＋v9 46＋新v3 20、4summary一致。main後41.425065秒、launch0、元90秒内 |
| Android source/export Android/export Pods | 3job success。後2jobは今回は依存compileを実行。配布や実機exportの成功ではない |
| 実RN | job failure、test build exit65。test902:277が最初のerror、macro展開から20件連鎖。test_started/PIECE_RN_CASE/実行report0 |
| 実RN条件/画像 | 13条件すべて未検証、results.json0、PNG0。rendered row/local-placed pair/独立5値/fit/8秒/clip trap/opacity.8/画像差は今回未確認。13条件が画素判定に失敗したという意味ではない |

#### 88.5.1 原因と、未適用の最小修復案

既存 `tests/native/piece-rn-canvas-ios.m` 902行の `XCTAssertEqualObjects`第2引数内に、追加2条件の配列リテラル `@[@"containment_native_clip_trap",@"containment_branding_opacity08"]` を直接置きました。Cプリプロセッサは角括弧をmacro引数の保護として扱わず、内部commaが引数を分割し、残りがXCTest可変引数へ渡って構文を壊します。原xcodebuild.logには902行の最初のerrorとXCTestAssertions.h→XCTestAssertionsImpl.hの展開位置が残っています。これは華恋が今回加えたtestの不備で、実RNビルド前の確認で見落としたものです。

次の具体的な最小修復案は**同じ902行の第2引数全体を丸括弧で囲むだけ**です。判定・13件の名前と順・元11条件・分母・deadlineは変わりません。未適用のafter全文を示します。

```objc
XCTAssertEqualObjects([self.resultModule.reports valueForKey:@"name"], ([[[baselineNames arrayByAddingObjectsFromArray:supplementalNames] arrayByAddingObjectsFromArray:rawNames] arrayByAddingObjectsFromArray:@[@"containment_native_clip_trap",@"containment_branding_opacity08"]]));
```

修復案のiOSコンパイル成功や実RN13条件の成立は未確認です。今回のsource確定後の製品/test/workflow追加変更0・同source再実行0を守り、この1行もまだ適用していません。別の新sourceでの限定検証単位として扱い、今回失敗を黙って修正・再実行した成功へ置換しません。正式admission・採用版saved reader・InputScreen正式供給・通常初回保存→本人GET/履歴・実機は引き続き未完了です。

#### 88.5.2 保存した原物と完了範囲

全6jobのdecoded原ログ、RN artifact ZIP25,718bytes（SHA256 `4181f551dd91cf5c0cd48badee6633df303883cb428238b58fc61c6c3dde61f6`）と唯一の原member `xcodebuild.log`354,682bytes、Podfile.lock ZIP、source19pathのmetadata・run/job/artifact metadata・native独立集計・今回のfailure解析をlossless tar/gzip/base64でmanifestへ保存しました。RN成果物に存在しないPNG/reportを旧runから流用せず、旧11PNG/59pair/7fitを今回の分母へ換算しません。旧証拠は§88.4の不変Git参照を維持します。

primary outcomeは **BLOCKER_NARROWED**。native新20を含む195成功とJS933は部分的な技術証拠ですが、実RN包含/画素/元8秒成立は未確認、新候補未採用STOPです。今回の一度CIは14分05秒で終了。新購入/third-party依存/定常service追加0、既存Actions一回の実使用量は発生し、請求額は今回取得していません。Mash様への追加操作依頼0です。

source19pathのうち製品6/test7/workflow1は9b0abdedのbytesを固定。最終記録は同じ資料5pathだけ、STRUCTURE_MAP_DELTA_NONE（実装時の限定測定/paint責務は§65.36に保持）。DB/query/business RPC/API/runtime/flag/env/署名/配布/deploy/main merge0。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。今回の有限作業は結果保存まで完了、商品完成ではありません。


## 89. 2026-10-21 — 実RN検証を止めたtest macroの最小修復、新source一度のCI

今回のMash明示指示「Pieceの残件作業を進めて。モデル制限は無しでいい。」を、current manifestのfirst_unfinished_work／入口§88.5.1に既記録の1行修復と新source一度CI・結果保存を行う再開指示として受け取り、新しい限定単位exact1を開始します。前回§88／CI39523761970の失敗・閉鎖は保持し、再実行・遡及修正しません。追加承認を求めるための設計変更はなく、規則や既存の停止境界を変更しません。

### 89.1 開始記録

| start field | current actual |
|---|---|
| product_destination | Piece画像プレビューの実描画包含を検証し、正式採用と通常保存へ進める根拠を得る |
| current_gate_or_subgate | weekly P-W1、包含候補の実RN13条件がtest buildで未実行 |
| exact_work | test902第2引数の括弧追加1行、新source一度の既存push CIと全結果保存 |
| scope_classification | LEVEL_3相当の別限定単位。閉鎖済み単位のretry権限は継承しない |
| approval_or_delegation_basis | 今回のMash明示続行指示＋current ownerの既記録exact repair。一般standing delegationだけを閉鎖単位repairの根拠にしない |
| execution_owner | 華恋root、Codex GPT-6系、PIECE_WORK_ALLOWED。root唯一writer、補助2agentはread-only review |
| success_credit | 実RN13条件・全PNG・期限/参照対応まで成立すれば限定TECHNICAL_CREDIT。正式admission/商品合格には変換しない |
| completion_condition | 既存6path全文readback、新source CI一度の全6job・JS933/native195・実RN13/画像/元8秒と失敗を記録 |
| stop_condition | 一度CIで未達なら新候補未採用STOP。source確定後は追加source/test/workflow変更・同source再実行0 |
| prohibited_scope | 製品source/fixture/workflow/判定/分母/元8秒・90秒・旧v2/v9/saved/exportの変更0、DB/API/依存/runtime/flag/env/deploy/配布/main merge0 |
| next_product_read_or_mash_decision_point | 有限検証後の正式採用、同版saved reader、InputScreen正式供給、通常保存→本人GET/履歴は別の未完了作業 |
| current_source_test_receipt | Cocolon5c3bb726、前回source9b0abded/CI39523761970/入口§88.5。testは同blobから括弧2文字だけ追加 |
| current_docs_and_heads | Cocolon PR30 head5c3bb726f8124ff91d1d0b465491e31ce1fd33ce、API PR3 a536e50ee284785f585ac73329ef2947dca8bba9。全体設計01/01A/01B/01C、全file map/tree RN1747/API2444、最新weekly・前提/規則・incident全文・Karen-Diary指定3fileを確認 |
| affected_current_structure_maps | Piece map§65.37、STRUCTURE_MAP_DELTA_NONE。既存testの構文修復だけで製品/測定/paint/owner責務の差分なし |

必要性はOBSERVED_BLOCKER_MINIMAL_FIX。前回build errorの因果箇所だけを直し、未実行だった実RNによる元の直接検証へ戻します。追加購入・third-party依存・定常費用とMash追加操作は0。既存Actions一回の使用量は発生、前回14分05秒は参考実績です。時間/品質条件を弱めません。R10.3のhelper限定repairへtest変更を偽装せず、今回の明示続行指示とcurrent next workに基づく別のtest構文修正単位として記録します。

System Context prepareを実行したところ、保存lockが要求する祖先a77b79cとlocal material commit450735bのlineage不一致で拒否されました。生成contextをcurrent根拠に使わず、technical ownerのdirect original read fallbackで全1747remote blobとlocal原典の一致を確認しました。今回refreshやcontext機構自体を変更しません。Supabase cocolon-projectはread-onlyでmigration最新8件を確認し、Piece6本（追加quota/visual各1を含む）が適用済み。本人行・業務RPC・DB変更0。

### 89.2 source時点の修復・確認

第2引数全体を丸括弧で囲むだけで、配列の要素・順序・13分母・全assertionを保持します。Cプリプロセッサで同じ行を二引数macroへ渡し、修正前は内部commaにより3引数エラー、修正後は2引数として展開成功を確認しました。独立read-only reviewでも同じ原因と修復を確認しました。LinuxでUIKit/XCTestの実コンパイルを行ったとは扱いません。

対象はtest1＋既存資料5の計6path。製品6/test他6/workflow/fixtureは前回sourceのbytesを保持します。全6pathをGitHubへ反映・全文読戻し後、新sourceの既存push CIを一度確認し、原ログ・実RN report/PNG・全rendered row/local/placed/fit/8秒を保存します。CI未実行・成功未確認のsource時点です。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


### 89.3 途中結果：syntax修復source照合、native195完走

source fbf9c233eef738329456780b9fd1b79b89a78134/tree ea8517feの全6pathをGitHub全文照合。一度CI39544012216 attempt1でJS933 PASS/FAIL0/SKIP0/15,862.724ms、native195個別/195unique/重複0/FAIL0・4summary一致・launch0。main04:32:01.205044Z→最終summary04:32:32.348149Z＝31.143105秒で元90秒内。Android source成功、export2jobはscope skipによるsuccessで依存compileを今回実行したとは扱わない。実RNは継続中、13条件/PNG/8秒は未確認。5job原ログ・run/job metadata・独立集計をmanifestへ可逆保存。source/test/workflow追加変更・再CI0、STRUCTURE_MAP_DELTA_NONE、正式採用/通常保存・本人履歴は未完了、automatic_progression=false。


### 89.4 最終結果：build修復は成立、実RNの新preview8件はlocal段階で停止

source `fbf9c233eef738329456780b9fd1b79b89a78134`、一度の [CI39544012216 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39544012216) は **failure**。04:26:06Z→04:45:55Z＝19分49秒。6job中5success、実RN1failureです。source6pathと途中結果ca358df0の5pathはそれぞれGitHubから全文読戻し済み。今回の実装差分はtest902行への括弧2文字だけで、以後のsource/test/workflow変更・同source再実行は0です。

| 検証群 | 実結果 |
|---|---|
| JS | 933 PASS / FAIL0 / SKIP0、15,862.724ms |
| standalone native | 195個別/195unique、重複0/FAIL0、旧129（内包97）＋v9 46＋v3 20、4summary一致。main後31.143105秒、元90秒内、launch0 |
| Android source | compile成功 |
| export2job | scope skipによりsuccess。今回Pod/Android export依存compileを実行したとは扱わない |
| 実RN build | build_completed04:40:07.874580Z、test_started04:42:23.212459Z。前回のmacro構文停止は解消 |
| 実RN13条件 | baseline1/5（旧savedのみ）、supplemental0/3、raw3/3、controlled clip trap1/1、opacity追加0/1 |
| PNG | 新規原物5枚。旧savedとraw3は前回原PNGとbyte/全画素一致。clip trapは今回のcontrolled fault原物。失敗preview8のPNGは存在しない |

全13reportの本文保持はtrue、report時刻は元8秒内です。ただし新preview8は完成/同token fitへ到達していないため、420完了・画素包含・8秒内の有効preview成立とは扱いません。

| 条件 | 実phase | reportまでms | 完成PNG |
|---|---|---:|---|
| essay_paragraphs | unavailable | 2817.294 | なし |
| quote_unicode | unavailable | 598.815 | なし |
| declaration_no_brand | unavailable | 339.500 | なし |
| essay_max420 | unavailable | 4306.925 | なし |
| saved_essay_canvas | native_checked | 382.878 | あり |
| suffix_latin_ligature | unavailable | 204.963 | なし |
| suffix_arabic | unavailable | 210.776 | なし |
| suffix_max420_a | unavailable | 2339.797 | なし |
| suffix_spaces_raw | measurement_checked | 292.311 | あり |
| suffix_hebrew_raw | measurement_checked | 191.883 | あり |
| suffix_mixed_bidi_raw | measurement_checked | 165.489 | あり |
| containment_native_clip_trap | measurement_checked | 130.307 | あり |
| containment_branding_opacity08 | unavailable | 218.588 | なし |

#### 89.4.1 失敗を確定できる範囲、確定できない範囲

新preview8件は全てgeometry_checked後、v3 local inspector/decoderを包むPromiseが拒否され、native_measurement_unavailableとなりました。placed試行0、保持されたlocal/placed inspection0、fit false、PNG0です。Arabic72/Latin72/opacity72では本文local1件はresolved、branding28ptがrejectedです。branding高40.3333740234375×scale3＝121.0001220703125でceil122となる事実、複数本文rowで小数高さとの相関もあります。一方quoteの拒否は同じ相関外であり、これだけを共通原因と断定しません。

現traceはrenderer全体のcatchをrejectedと記録し、native moduleの拒否とraw20field decoderの拒否を分離していません。失敗Cardはcapture前に止まりpaint context/opacity factsも保存されません。**具体的なnative nil guard、alpha対応の失敗、JS decoderのどこかは未確定**です。時間超過・32MiB不足を今回の原因へ推測で足しません。8Cardの表示成立・opacity.8・余白/全行fitは未確認です。

計画上68Text（v3目標62）と実capture10Text（旧saved6＋raw3＋trap1）を分離します。実際に保持されたv3 inspectionはraw placed3＋trap local1の4件、raw local/placedは3pairです。trace resolved29件（local26＋placed3）の3成分unionは独立再計算で一致。20field raw原responseはArabic body1件のみで、全62件のwire検証へ換算しません。scratch解析のcheck数を製品検査合格数へ加算しません。

#### 89.4.2 原物保存、限定credit、次の一作業

GitHub manifestのlossless bundleへ全6jobの元decodedログ、run/job/artifact metadata、原xcodebuild.log/results13/PNG5、独立集計・画像比較・診断・元artifact全1006memberのchecksum一覧を保存しました。大きいxcresultを含む元ZIP55,925,398bytes全体も別の永続原物として保存済み。SHA256は `94e460945dbbce83945758a9eeb4a2cecf88adc6baa439149923f9067e2e6c79`、具体的保存identityはmanifestのartifact_archiveです。期限付きActionsのURLだけには依存しません。過去の原PNGを今回の欠落PNGへ流用していません。

primary outcomeは **BLOCKER_NARROWED**。再利用できる事実はmacro build停止の解消、JS933/native195、新実行での旧saved/raw3/controlled fault、および失敗箇所を配置前v3境界へ絞れたことです。新previewの採用・商品合格creditはありません。原寸PNG5枚と全体一覧を目視し、旧saved本文/改行/配置/余白/brandingとraw3の画像一致を確認しました。新8Cardに画像品質の合格を付けません。

次の最小未実施作業は、失敗した同一local1操作（例：Latin branding28）のnative resolve/rejectとdecoder入口/出口をtest-onlyで区別し、native側なら既存拒否分岐のscalar stageを識別する診断です。時計・guard・wire・font/行選択・強制display・再試行を変えません。今回の失敗記録はその実装/新CIの実行記録や自動進行権限ではなく、sourceは固定して本単位を未採用STOPで閉じます。

#### 89.4.3 正式採用までの残件と今回の境界

今回のactual失敗とは別に、原典read-only reviewで確認した未証明範囲を保持します。32MiB counterは各inspectionで新設され、provider最終解放までその予約は維持されますが、CAがcall間で保持したallocationの合算保証は今回の原物にありません。超過発生とは断定せず、§87.3の同時合計条件をper-callへ黙って変更しません。nativeはwall/systemUptime両期限を使い、Card最終fitは同deadline object/Date.now expiryを確認します。wall時計巻戻りを含む最後までのmonotonic保証は未成立です。これらを今回8件の拒否原因とは呼びません。

正式renderer採用、containment版saved reader、InputScreen正式isSaveAdmitted供給、実Auth/API通常初回保存→同owner詳細/履歴、物理実機の受入れは未完了です。結果5資料のみの更新、STRUCTURE_MAP_DELTA_NONE。製品source/fixture/workflow/API/DB write/業務RPC/runtime/flag/env/依存/署名/配布/deploy/main merge0。全体設計/全file地図と既存責務は維持し、元8秒/90秒・旧v2/v9/saved境界は不変です。追加購入/新service/定常費用・Mash追加操作0、既存Actions一回の実使用量は発生、請求額は未取得。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


## 90. 新依頼に基づくtest-only拒否原因診断（2026-10-21）

Mashの新しい「Pieceの残件作業を進めて」を受け、完了済み§89の同source再実行ではなく、§89.4が残した最小診断を新しい限定作業として開始します。app全体設計01/01A/01B/01C、全file地図、現行Piece map、最新weekly 20261017、作業規範・transport current contractと恒久incident全文を再確認。PR30は8c41edbc、API PR3はa536e50eで基点一致、Supabase projectはACTIVE_HEALTHY（一覧readのみ）。context prepareはlocal checkpoint f313a4aとa77b79c5の非子孫判定で失敗したため、生成contextを信用せずtechnical ownerが原典を直接読みました。context systemは変更しません。

変更レベルはLEVEL2（既存目的・契約内の技術的原因調査）。製品観点は「本文と行選択を保持したプレビューが配置前に止まる原因を実物から識別する」、技術観点は「同じ原native呼出しとdecoder一回を保持し、元拒否guardの第一位置だけを観測する」で一致。rootを唯一のrepo writerとし、独立reviewer2名はscratch draft/read-only担当です。新規product API/featureではありません。

### 90.1 実行前の契約と停止条件

既存test3path（runner、RN entry、native XCTest）と既存資料5pathの計8path。新tracked file0。runnerは隔離されたCI checkoutのnative build copyへTLS scalar first_failure_stage/tag/font/stageの観測だけを注入します。59箇所の既存return NO/nil/unavailableを原条件式・return値のまま標識し、元source SHA256、標識除去後の全文一致、3つのthread resetを検査。原native product fileをGitへ変更しません。getterは元resolve/reject callbackと同じ同期stackで読み、thread/tag/font/stage照合を記録します。JSは元native Promise一回とrenderer/decoder一回のままraw20fieldまたはrejectとadapter結果を対応付けます。失敗Cardにも共通saveReportから観測を付記し、late callbackは開始caseへ保持します。

診断は元8秒内の処理時間に含みます。時計、deadline、guard、20field wire、drawing、row/font、fit、opacity、保存admission、fixture13、XCTest全assertion、standalone native195、元90秒は変更しません。強制display/flush、追加draw、decoderやnativeの二重呼出し、preview成功の擬装、再試行は0。native guard stage不明またはcompile失敗でも同source再実行・その場の迂回修正はせず、原物を保存して未採用STOP。one-source CIは一回だけで、全体failureも観測結果として残します。native成功後のadapter拒否なら実raw/expectedと期限から切り分け、証拠が足りなければ未確定とします。

結果はGitHubへ元ログ・13report・PNG・stage mapとchecksum付きで残し、全変更fileを全文読戻します。現時点CI未実行、具体guard未確定、既存failureは撤回しません。製品source/API/DB/業務RPC/runtime/env/flag/依存/署名/deploy/main merge0、通常保存・履歴/実機は未完了。追加購入/定常費用/新service/Mash操作0、既存Actions一回の実使用量は発生します。STRUCTURE_MAP_DELTA_NONE。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


### 90.2 最終結果：同じnative呼出しで拒否した分岐を記録

source `ae77b72102da82f58aa8b941083ad1d6aacebc1f`、一度の [CI39548735598 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39548735598) を終了。source8pathは全てGitHubから全文読戻しし、local git blob SHAとも一致しました。以後test/source/workflow編集0、同source再実行0。結果は failure。source ae77b721、一度CI39548735598 attempt1はfailure。JS933/native195成功、実RN13条件到達。旧saved1/raw3/controlled fault1は成立しPNG5は前回原物とbyte/全RGBA画素一致。新preview8はnative拒否を再現し、7条件は原line488のalpha occupancy不一致（stage38）、quoteは原line260のPieceRasterPlan複合制約（stage15、具体operand未確定）へ分離。native65uniqueの対応は全件一致、37resolve/28reject。JS/adapterは30resolve/16reject/19pending、native成功後のadapter拒否0。元本文/13fixture/assertion/8秒/90秒と製品処理は不変。診断単位は未採用STOP、プレビュー修復・正式採用・通常保存は未完了。

JS933 PASS/FAIL0/SKIP0（15,128.900842ms）、standalone native195 unique PASS/FAIL0/重複0、旧129（内包97）＋v9 46＋v3 20の4summary一致。mainから最終summaryまで28.173337秒で元90秒内、launch0。Android source compile成功。export2jobは既存scope skipによりsuccessで、依存libraryを今回compileしたとは扱いません。共通5checkも全successです。

| 条件 | 実phase | reportまでms | PNG |
|---|---|---:|---|
| essay_paragraphs | unavailable | 2580.322 | なし |
| quote_unicode | unavailable | 2534.952 | なし |
| declaration_no_brand | unavailable | 424.127 | なし |
| essay_max420 | unavailable | 5550.626 | なし |
| saved_essay_canvas | native_checked | 371.957 | あり |
| suffix_latin_ligature | unavailable | 236.310 | なし |
| suffix_arabic | unavailable | 176.894 | なし |
| suffix_max420_a | unavailable | 2089.520 | なし |
| suffix_spaces_raw | measurement_checked | 296.340 | あり |
| suffix_hebrew_raw | measurement_checked | 160.093 | あり |
| suffix_mixed_bidi_raw | measurement_checked | 155.527 | あり |
| containment_native_clip_trap | measurement_checked | 129.983 | あり |
| containment_branding_opacity08 | unavailable | 230.471 | なし |

#### 90.2.1 実観測と因果関係の限界

native original境界65件は65unique、tag/canvas/font/stage tuple重複0、JS selected/raw native/native originalの対応は全65件1対1。raw identity flagは全てObjective-C boxed expression由来の数値1で、解析時に原値を保持したまま厳密1/trueを扱い、tag/font/request_stage/enabled/main_threadを独立再計算して全件一致しました。native37resolvedはstage0、28rejectedはstage38が27件、stage15が1件。他stage0件です。最初のJS完了rejectは8Card中7Cardがstage38、quoteだけstage15。JS/adapter30resolved・16rejected・19pendingでstatus矛盾0、native resolve後のadapter reject0。JS時点pending19に対応するnative結果は7resolve/12rejectですが、JSのpendingを完了や孤児化へ換算しません。stage38はPieceNativeAndLayerInk原488行で、clipped参照をrenderしたbitsと自然view.layerをrenderしたactualのalpha>0を全画素で比較し不一致ならNOを返す分岐です。7CardをJS decoderの拒否とは扱いません。quoteのtag139/80pt/『🇯🇵。違いを大切にして、』はPieceRasterPlan原260行のfinite/正値/4096辺/4Mpixel等の複合条件で拒否されました。

stage38における最初の不一致座標/alpha値、自然backingの実寸/CTMは未取得です。scale3・box高さから算出したceil−roundはlocal成功34件で0、stage38拒否27件で1という相関がありますが、自然backingをroundした実寸だと仮定せず、ceil→roundの修正根拠にしません。Apple公式CoreAnimationガイドはcontents画像をboundsへ拡縮することを説明していますが、fractional backingの整数丸め方はここから確定できません。quoteではどのPieceRasterPlan呼出し・どのoperand・どの実寸が拒否を生んだかは未取得で、4Mpixel/4096/32MiB超過や時計超過を断定しません。raw20fieldはJSへ届いた30件すべてで閉じたfield集合・3成分union・finiteなF64LE5値を再計算、全30件は元wall expiry前に受信。native37resolveのうちJS snapshotでpendingの7件にはraw wireを捏造しません。JSONはnegative zeroのbit identityを保証しません。

native/JSのordinalを無条件に同一視せず、tag・canvas・font・local/placedを用いて照合しました。pending・欠落・同tuple重複は欠落/曖昧のまま保持し、観測していないcallbackや追加drawの結果を作成していません。stageは元guardの実行位置であり、複合条件の各operandまで自動特定したとは扱いません。marker mapのpreimage/postimage SHA、59marker・3reset、元source lexical projection一致、元XCTest111行・fixture hash不変を確認しました。実RN build copyの診断以外は製品処理不変です。

#### 90.2.2 原物、商品評価、次の未実施作業

全6jobのdecoded元ログ、原run/job/artifact metadata、実際のPIECE_V3_DIAGNOSTIC_MAP、13reportとPNG、元xcodebuild.log、guard原文context、独立解析とhash一覧をmanifestのlossless bundleへ保存し、全memberを展開してchecksum照合しました。大きい元xcresultを含むZIP全体は別の永続原物として保存、具体identity/digest/member ledgerをmanifestに記載。Actionsの期限付きURLだけには依存しません。

全13reportはbody_preserved=trueかつ元8秒内（最大5550.626ms）ですが、新preview8はplaced0/fit未達/完成PNG0なので、420文字完了・有効プレビュー成立・opacity.8や余白/全行fitの合格にはしません。実captureは旧saved6Text＋raw3＋trap1の10Text、計画68Text/v3目標62を成功数へ加算しません。原PNG5枚を一覧で目視し、旧savedの本文/改行/配置/余白/brandingとraw3/controlled trapは前回原画像にbyte/全RGBA画素一致することを確認しました。失敗8Cardの画像品質は未検証です。 原画像比較の事実はmanifest.image_comparisonを参照。primary outcomeは BLOCKER_NARROWED。診断単位を**新候補未採用STOP**として終了し、プレビュー成立の合格へ換算しません。

次の最小未実施作業：自然layerと参照が同じ描画gridを使う根拠を整えて7条件の画素不一致を修復し、quoteは同一操作でPieceRasterPlanへ渡った寸法/scaleと拒否operandを確定する。元guard/8秒/90秒/4096辺/4Mpixel/32MiBを緩めず、新source一度CIで全13条件を検証する。今回この修復・追加観測・追加CIは未実施。

今回の原物から32MiBのcall間合算保証やwall時計巻戻りを含む最終monotonic保証を立証したとは扱わず、過去に記録した未証明範囲を保持します。formal renderer採用、containment版saved reader、InputScreen正式isSaveAdmitted供給、実Auth/API通常初回保存→同owner詳細/履歴、実機受入れは引き続き未完了。結果5資料のみの更新、STRUCTURE_MAP_DELTA_NONE。製品source/fixture/workflow/API/DB/業務RPC/runtime/env/flag/依存/署名/配布/deploy/main merge0。追加購入/新service/定常費用/Mash追加操作0、既存Actions一回の実使用量は発生、請求額は未取得。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


## 91. 自然描画の実gridへ参照を合わせる内部修復（2026-10-21）

Mashの新しいPiece残件続行依頼に基づくLEVEL_2／OBSERVED_BLOCKER_MINIMAL_FIX。実行環境はWork／PIECE_WORK_ALLOWED、root華恋だけをexecution・GitHub writerとし、独立read-only reviewer3名の技術・全体経路reviewを統合しました。目的は§90.2の7条件のalpha不一致を、表示Textと参照の同じ実gridを使うことで修復し、本文を失わない画像プレビューへ戻すことです。前回STOPの同source再実行ではありません。

基点PR30 a713ea3ec50af0dd821eb2a4d4a8b893c9472088、API PR3 a536e50ee284785f585ac73329ef2947dca8bba9。添付引継ぎ・作業規則00/CURRENT_RULES/18・恒久incident全文・全体設計01/01A/01B/01C・02国家システム/全file地図の全体経路と対象family・最新weekly/Piece currentを確認。全1,747blobをGitHub treeと照合し不一致0。巨大地図全約3万行の逐語読了という主張はしません。System Context prepareはlocal material commitの非子孫エラーで失敗し、規定の原典直接読取を採用、生成contextを根拠にせずsystem変更0。Supabaseはcocolon-project ACTIVE_HEALTHYの一覧readのみ、SQL/本人行/業務RPC/変更0です。

### 91.1 原因と同じ契約内の修復

原物の自然paint CTM.tyはbounds.height×Sであり、整数bitmap高さとは限りません。例：bounds高75.33332824707031、S3、ty225.99998474121094、clip.y約−0.000005086263。単純なceil→round変更では自然gridの位相まで復元できません。

既存RN patchの通常drawRectで実bitmap幅高・CTM6値・clip・bounds/contentFrame/scale/storage/属性copyをprivate snapshotへ記録し、CGContextや画素は保持しません。v3だけが非bitmap/不正値/staleを拒否し、local/placed/処理後で同snapshot identityと既存layer/source stateを照合します。自然paint呼出し、super/highlightの順序は維持。ただし全plain RCTTextViewに読取・属性copy/辞書保持コストを追加し、Piece外性能は未計測です。

自然top-down位相p=(CTM.tx,H−CTM.ty)を使い、±2fontの非clip extentを同格子へfloor/ceilします。expanded contextの最終CTMをidentity contextへ一度だけ適用し、割算→再乗算や逆CTM往復の丸めを避けます。raw native cellのlogical射影と、元bitmap→view.bounds写像を延長したCA filter参照をunionします。clipped参照は実W/H・元CTM・clipで描画し、両方を従来共通のceil比較canvasへ合成して元の全alpha occupancy一致guardをそのまま実行します。旧『nativegrid0』という実装仮定を実測gridへ修復するもので、表示renderer、wire20、成分定義、許容幅、±2font、4096辺/4Mpixel/32MiB、元8秒/90秒は変更しません。

quoteの具体operandはまだ未確定です。test-only runnerの同じPieceRasterPlan呼出しでsize/scale/ceil幅高/拒否maskを記録し、追加描画・再試行は行いません。非有限値はNSNullとmaskでJSONへ保持。新sourceの元guard63箇所をscalar標識し、標識・単一operand observer除去後の元全文一致をlocalで確認。実RN paint観測はCTM6値/bitmap寸法/clipも重複除外keyへ含め、expanded後のclipped原物を落としません。旧XCTest判定文と全fixtureは維持しました。

### 91.2 範囲・検証・停止

変更は既存製品2path（native metrics/RN patch）、検査4path（shim/native fixture/実RN観測/runner）、資料5pathの計11path、新tracked file0。Rule18§11.3既存設計内の可逆的最小修復で、商品目的/公開API/DB/課金/他core/依存/本番/flag/env/署名/配布/deploy/main mergeは変更しません。PRODUCT_ROUTE_ALIGNEDと独立原典reviewのTECHNICALLY_ADMISSIBLEは成立しましたが、実iOS成功とは別です。

local JS933 PASS/FAIL0/SKIP0（9,725.963454ms）、RN patch dry-run成功、runner bash構文と診断lexical復元成功。旧native195とXCTest assertion列の不変を確認。iOS/native195/実RN13/完成画像/元時間内の結果は未確認で、新sourceの既存push CIを一度だけ実行します。原13条件・画像とrow/font・fitを全件確認し、自然/clipped実gridを独立照合します。失敗・未達なら未採用STOP、同source再実行0。quoteが資源制約なら上限や±2fontをその場で変えません。

正式renderer採用・containment版saved reader・InputScreen正式isSaveAdmitted供給・実Auth/API通常初回保存→本人詳細/履歴・物理実機は今回も未完了。新snapshot全否定境界の検査成功はclaimせず、JS/195だけで商品合格へ換算しません。追加購入/新service/定常費用/Mash操作0、既存Actions一回の実使用量は発生します。構造責務・公開経路は不変のためSTRUCTURE_MAP_DELTA_NONE、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


### 91.3 途中checkpoint：旧175成功、新v3の正常local経路が未成立

source dfd656c737778a5f7f1c2982debe99369fff0b41/tree dfb53d0b11303d0b594eb46762f6f978cfd711a2、全11変更pathのremote全文一致と親/変更集合を確認。一度CI39555207737 attempt1でJS933 PASS/FAIL0/SKIP0（14,421.74829ms）、Android source/iOS source/RN patchと両exportの実compileが成功しました。実RNは同runでまだ進行中、13report/完成PNG/元8秒/quote operandは未確認です。

native195到達、185unique PASS/10FAIL。旧129（内包97）＋v9 46は全成功、新v3は20中10PASS/10FAIL。失敗は成功想定8条件と、成功localを前提とするcontents変更/版間tokenの2条件。拒否想定10件のPASSは、早い共通gateで拒否されても通るため、本来のfault箇所到達の証明にはしません。main06:29:16.382443Z→最終summary06:29:45.797276Z、29.414833秒で元90秒内、launch0です。

standaloneにはgridの実寸/CTM/attrs/具体拒否位置がないため原因は未確定。自然CGContextが非bitmapで幅高0、snapshot属性fixup、CTM/clip等の新gate、alpha比較のどれかとは断定しません。fixtureではglyphRange計算前に記録し実RN patchは計算後という差も未確定候補です。現在の元5job decodedログ/metadataをmanifestのinterim bundleへ可逆保存しました。

新候補は未採用のまま。実RN原物の確定までsource/test/workflow追加編集・同source再実行0。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。通常保存・本人履歴・実機は未完了、STRUCTURE_MAP_DELTA_NONE。


### 91.4 最終結果：自然UIKit contextのbitmap前提不成立、未採用STOP

source dfd656c737778a5f7f1c2982debe99369fff0b41の一度CI39555207737 attempt1は2026-10-21 06:24:29Z→06:54:13Z、failure。途中記録b34955063ef966d10bf4b18f109bb2f03992e9a0の後もsource/test/workflowを変更せず、同source再実行0です。JS933 PASS/0FAIL/0SKIP、旧native129（内包97）＋v9 46＝175全成功、新v3 20＝10PASS/10FAIL、合計185unique PASS/10FAIL。新v3の拒否想定10件成功を各fault経路到達の証明へ換算しません。iOS/Android source・RN patch・両exportの実compileは成功していますが、製品条件の成功を意味しません。standalone nativeの具体的な拒否位置は未記録です。

実RNの保存されたresults.jsonは8件。essay_paragraphs、quote_unicode、declaration_no_brand、essay_max420、suffix_latin_ligature、suffix_arabic、suffix_max420_aの新プレビュー7件はすべてunavailable/capture_error、local/placedとも0です。saved_essay_canvasだけnative_checked/native_canvas_valid=true、6Textの画像を取得しました。8件ともbody_preserved=trueです。13条件完遂でも、新プレビュー8条件の実施完了でもありません。

machine-readable native境界56件（重複tuple0）は全件stage20、raster_failure_mask=0。stage20は今回追加した自然grid snapshot検証（元source line362）です。保存済み6Textの自然drawRect/prepaint＋sharedpaint計12contextでCGBitmapContextGetWidth/Heightの照会値はすべて[0,0]でした。これは自然backingが0pxという証明ではありません。9件目suffix_spaces_rawのtag827では、自然contextのbitmap照会0/0→RecordPaintGridがsnapshotをnilのままにする→stage20拒否、という同一tagの因果が原物でつながっています。自然UIKit contextをCGBitmapとして扱えるという私の修正前提が成立しません。他56件それぞれの自然contextは未保存のため、全56件の原因を個別確定したとはしません。

quoteも新stage20で止まり、元stage15のraster計画複合制約に未到達。operandの0は未記録TLS初期値であり、実際のsize/scale/ceil寸法0や予算内の証拠ではありません。前回の7条件のalpha占有不一致とquote1条件の制約は未再検証・未解決です。raw20 wire成功0、新プレビューlocal/placed成功0。元guard、font、8秒/90秒、±2font/4096/4M/32MiB、fixture13・native195・assertion順序は緩めていません。

9件目suffix_spaces_rawはXCTest失敗記述にメモリ上のreportとPNGがありますが、results.jsonにはありません。native_ink_framesは(inf,inf,inf,inf)で、sourceはその非有限値をNSJSONSerialization(error:nil)へ渡し、nil結果/書込結果を確認していません。保存停止と整合しますが、NSError/例外/書込結果の直接記録がないため、90秒expectation timeoutの単一原因とは断定しません。suffix_hebrew_raw、suffix_mixed_bidi_raw、containment_native_clip_trap、containment_branding_opacity08の後続4条件は未到達。raw spacesのPNG取得を条件合格へ繰り上げません。

PNGはsaved_essay_canvas（1080×1350）とsuffix_spaces_raw（1080×320）の2件のみ。両方とも前回原物とbyte/全RGBA一致し、保存済み本文6行・余白・brandingを目視確認しました。失敗した新プレビューの完成画像品質は未確認です。解析補助check129PASS/36FAIL/28UNVERIFIEDは製品試験件数ではなく、JS/nativeの分母へ加算しません。

全6jobの元decodedログ、results.json、xcodebuild/xcresult失敗記述、63stage写像、2PNG、画像比較、archive全971memberのSHA256台帳、最終要約をmanifest final_evidence_bundleへ可逆保存しました（13member、gzip767074bytes、SHA256 b00385df74da84e80aaac3cd5017df2c56a6d0278345e0808df81b7675fe186f）。GitHub artifact12326203610のZIP原物81189167bytes/SHA256 0a8b92847de94f05368fbf1005c53e885f3a21c8c20c3315c891f80bab9294c6も照合・別保全済み。途中bundleはb3495506のimmutable Git pointerで保持します。

PRIMARY_OUTCOME=BLOCKER_NARROWED、bounded_work_complete=true、validation_success=false、unadopted=true、STOP。次の最小未実施作業は、自然CTM/clip/source snapshotをbitmap照会0でも保持できる設計と、同じclean layer.contentsが公式typeIDでCGImageと確認できる場合だけ実寸を読む候補の成立確認です。contents型は未観測で、成立を約束しません。未知型をceil/round/clip推定の実backing寸法へ置き換えません。同時に既存harnessで非有限frameを既存PieceFiniteによりnullとして残し、JSON error/nil/書込失敗を欠落なく記録する最小修復が必要です。追加実装・追加CIは行っていません。

今回の候補は正式renderer/admissionへ採用せず、containment保存reader・InputScreenのisSaveAdmitted供給・実Auth/端末の通常保存と同一owner再表示も未完了。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。API/DB/RPC/依存/flags/env/merge/deployの変更0、STRUCTURE_MAP_DELTA_NONE。


CURRENT_RULES R10.2の「同じblocker familyで2回連続STOP」に従い、DETOUR_RISK_STOPとして追加開発・再試行を停止します。本来の完了条件は元13条件の本文画像を成立させることです。今回増えた証拠はbitmap前提不成立と記録欠落の範囲だけで、商品品質creditは増えていません。次の推奨経路exact1は、元の全画素guardを維持した製品grid直接修復と既存harnessの欠落修復を一体の最小作業へ戻すこと（未実施）。追加helper/診断family/恒久checkerを挟まず、同じ失敗sourceを再実行しません。


## 92. 本文画像へ戻す直接修復：同じclean contentsの公開CGImage寸法

2026-10-21のMash「Pieceの残件作業を進めて」をcurrent requestとし、Rule18§0A/§11.3のLEVEL2で、§91.4に示した製品grid直接修復と既存harness欠落修復を同一単位で進めます。前回の失敗・DETOUR_RISK_STOPは不変。同じsourceの再実行・closed authority再活性化・追加helper/診断familyではありません。root単一writer、今回の新sourceで既存CI一度、未達は未採用STOP、次Gate自動進行falseです。

自然drawRectのsnapshotをCGBitmap幅高照会から切り離し、CTM/clip/bounds/content frame/scale/storage/属性を保持。cleanな同Text layer.contentsをstrong localで一度読み、CFGetTypeID==CGImageGetTypeID確認後だけCGImageGetWidth/Heightを使用します。size_tで0/4096辺/4Mpixelを検査し、grid/contents/寸法をlocal・placed・afterの同一性へ束縛。未知typeは拒否し、clip/ceil/roundから実backing寸法を推定しません。元の全alpha占有比較、provider共有32MiB、native非clip・filter・direct・layer union、wire20・旧v2を維持します。UIKitのcontentsが実際にCGImageであること、元画素比較とquoteの資源制約成立は新CIで未確認です。

fixtureは実RNと同じglyphRange計算→snapshot→共有paintへ揃え、初回属性fixup前のsnapshotを避けます。既存harnessはnative_ink_framesの[x,y,maxX,maxY]各値を既存PieceFiniteへ通し、非有限値をnull/native_canvas_valid=falseで保存。saveReport内でJSON error/nil・atomic書込失敗・例外を明示保持/記録し、append後のrejectによる同名二重reportを避けて元capture callbackへ戻します。元111 assertion行の内容/順番を保ち、記録失敗nil確認1件だけ追加。fixture13/native195/元8秒・90秒/±2font/4096/4M/32MiBは変更しません。

既存source5＋資料5の10path、新file0。local JS933 PASS/FAIL0/SKIP0（11,918.940381ms）、RN0.77.3全文へのpatch --fuzz=0 dry-run・runner bash構文・既存observer65marker/字句復元一致、独立read-only review2件を確認。最初のlocal JS processは既存TypeScript参照設定不足でMODULE_NOT_FOUND、NODE_PATHを既存5.2.2へ設定して実行しました。project依存追加0。これらはUIKit実行・画像品質・13条件完遂の証拠ではありません。

既存preflight bundleに開始範囲・pre/post source・review・両local JS原ログ・65markerを可逆保存。System Context prepareはresidual without markerで失敗し、同ownerが許すdirect original読取りへ戻りました。Context修復を挟まず、全体設計/全file地図/current map/最新weeklyとactual1747blobをfresh head9f0709dfへ一致確認、mashos-api a536e50e、Supabase ACTIVE_HEALTHYを確認しました。API/DB query/apply/RPC/flags/env/依存/workflow/deploy/main merge変更0、STRUCTURE_MAP_DELTA_NONE（既存optional metrics/共有paintとharness内部のみ）。

今回のsource反映・全文読戻し後は追加source/test/workflow編集をせず、既存CI一度のJS933/native195/実RN13条件と元PNG・時間・画素を回収して判定します。旧7alpha不一致とquote制約は現段階未解決。正式renderer、containment版saved reader、InputScreen正式isSaveAdmitted供給、実Auth/端末の通常保存→同owner再表示は未完了。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


### 92.1 途中結果：今回も新v3正常local未成立、実RN継続中

source14a1286e6265a1194ad83873693afd9cf6680e24/tree9edc6fc27e56e1a5e06f04064263ad98153de0ec、全10path remote全文一致。一度CI39565918631 attempt1でJS933と旧native175成功、新v3 20は10PASS/10FAIL、計185unique PASS/10FAIL。成功想定8＋成功localを前提とする2が未成立。拒否想定10成功を各fault到達証明へ換算しない。iOSsource/RNpatch/Androidsource/Androidexport実compile成功。standaloneは具体拒否位置/contents型未記録で、非CGImageが原因とはまだ確定しない。実RN13/元PNG/画素比較/quote旧制約は同run継続中・未確認。完了4jobのdecoded原ログ/metadata/集計をmanifestへ可逆保存。今回も候補未採用、source/test/workflow追加変更・同source再実行0、正式admission/通常保存/実機は未完了、STRUCTURE_MAP_DELTA_NONE、automatic_progression=false。


### 92.2 最終結果：診断13件保存は修復、CGImage寸法取得は実RNで不成立

source14a1286e6265a1194ad83873693afd9cf6680e24/tree9edc6fc27e56e1a5e06f04064263ad98153de0ecの一度CI39565918631 attempt1はfailure。2026-10-21 16:59:33→17:21:04 JST、21分31秒。source10pathと途中資料ce05a4f5の5pathをremote全文照合し、CI開始後のsource/test/workflow追加変更・同source再実行0を維持しました。JS933 PASS/0FAIL/0SKIP（8,772.908047ms）、旧native129（内包97）＋v9 46＝175全成功、新v3 20＝10PASS/10FAIL、計185unique PASS/10FAIL。拒否想定10成功は各fault経路到達の証明ではありません。native main→最終summary43.604826秒、元90秒内。iOS/Android source・RN patch・両export libraryの実compileは成功ですが、製品成立へ換算しません。

実RNの元13namesが同順序・重複0でresults.jsonへ保存され、NaN/Infinityを拒否するstrict JSON読取りも成功。前回欠落した9件目rawspacesと後続4件をすべて記録できました。raw3＋controlled trapのnative_ink_framesはnull4値/native_canvas_valid=falseです。保存error/nil/write/exception marker0、保存エラーnil assertionの失敗0、元90秒expectation timeoutの失敗記述0。末尾branding opacityの元assertionまで到達しています。xcresultはtest1件中1件失敗、root failure summaries60件（action側との重複走査120を試験件数としない）。全13reportのelapsed_msは元8秒未満ですが、unavailableを画像成立/420合格へ繰り上げません。

実際の製品条件は保存済み1件だけnative_checked/native_canvas_valid=true、新プレビュー8件はすべてunavailable/capture_errorでlocal/placed0、raw3＋trapはmeasurement_unavailable/native_canvas_valid=falseです。raw4件のbody_preserved=falseは計測拒否catchの既存flagであり、実本文改変の証拠ではありません。同4件のnative_textsは元raw入力と一致し、画像も前回と一致します。診断保存の修復をプレビュー修復・商品品質成功へ換算しません。

native境界62件/62unique tupleは全rejected、同呼出しdiagnostic identity62/62一致。essay_paragraphsの6Textはstage20＝元source362のsnapshot/storage/attributes/bounds/frame/scale複合guardで停止し、どの項目かは未識別です。残56件はstage23＝source390の単独CFGetTypeID(contents)!=CGImageGetTypeID()で停止。前段のgeometry/clean/plain条件を通過した同contentsがCGImage確認を通らなかった、と確定できます。IOSurface等の正体や型ID値は記録していません。私が選んだCGImage寸法取得も、この実行で成立しませんでした。

56件はCGImageGetWidth/Height・raster計画・元全alpha比較へ未到達。quote4件も全stage23で、前回のquote旧stage15資源制約と旧7条件のalpha不一致は未再検証・未解決です。raster mask/operandの0は未到達TLS初期値であり、実寸0や予算内の証明ではありません。stage20の6件を、今回除去した前回bitmap照会0の因果へ戻して説明しません。standalone新10FAILの具体拒否stageも未記録のままです。

PNGは保存済み1＋raw3＋trapの5枚で、すべて前回原物とbyte/全RGBA一致。保存済み本文5行とbranding1Text、rawの空白・Hebrew/mixed bidi・controlled trapを目視しました。新プレビュー8条件の完成PNGはありません。旧§91.4の「保存済み本文6行」は誤記で、正しくは本文5行＋branding1＝6Textです。画像自体の一致事実は不変です。補助解析202PASS/58FAIL/66UNVERIFIEDは商品試験件数ではなく、JS/native/実RNの分母へ加算しません。

全6jobの元decodedログ、元13report、xcodebuild/xcresult、root失敗記述、65stage写像、5PNG、画像比較、全1010ZIP memberのSHA256台帳、最終要約等17memberをmanifest final_evidence_bundleへ可逆保存。GitHub artifact12329849185のZIP原物58,747,479bytes/SHA25615725088149a4a9369017ce3b1f04a449d4467e95b0ff29fef6e8f1241c46a98も照合・保全済みです。途中4job bundleはce05a4f5のimmutable Git pointerで保持します。

PRIMARY_OUTCOME=BLOCKER_NARROWED、bounded_work_complete=true、validation_success=false、renderer_unadopted=true、DETOUR_RISK_STOP。追加開発・再試行を停止し、今回の失敗を新authority/helper familyへ連鎖させません。次の未実施exact1は、contentsをCGImageとして読める前提を外した実grid/忠実性比較の直接修復を設計すること。自然CTM/clip/sourceと既存layer合成・元全alpha比較を維持し、clip bboxを実backing寸法と偽装しません。先頭6Textのsnapshot整合も同じ描画lifecycle内で扱い、契約/comparator変更が不可避なら変更前に明示判断へ戻します。今回この追加設計/実装/CIは未実施です。

正式renderer admission、containment版saved reader、InputScreen正式isSaveAdmitted供給、実Auth/端末の通常保存→同owner再表示は未完了。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。API/DB/RPC/flags/env/依存/workflow/deploy/main変更0、STRUCTURE_MAP_DELTA_NONE。


## 93. 2026-10-22 — opaque backingに依存しない出力座標の比較案（設計済み・実装前）

### 93.1 今回の結果と、承認を要する差分

§92.2の次作業を進め、自然contentsがCGImageであることを前提としない比較案を具体化した。現在の製品は変えていない。旧source14a1286e／run39565918631 attempt1のfailure、185unique PASS／10FAIL、13report保存修復、候補未採用／DETOUR_RISK_STOPを維持する。今回新たな描画・CI・pytest／JS検査・DB書込みは実行していない。

公開APIと実sourceの照合では、opaqueなUIView backingの実寸を必ず得られる根拠を確認できなかった。自然contextのbitmap照会、contentsのCGImage cast、clip/boundsを実backing寸法へ読み替える三つの前提を次候補には使わない。これは公開API全般の不可能性証明ではなく、今回確認した範囲でLEVEL2修復の根拠を示せないという判断である。計測用画像の実寸が取得できても、自然backingの実寸とは限らない。

推奨exact1は、自然なRN Text表示を維持した別preview `piece.rn_native_preview.containment.prototype.v2`／別inspection `piece.native_selected_line.v4`。比較の座標を出力画像と同じlogical1へ変更する。既存v2/v9と未採用containment.prototype.v1／selected_line.v3は上書きしない。bitmapを製品表示へ置換しない。

| 判断項目 | 旧v3で要求していたもの | 新v4候補で要求するもの |
|---|---|---|
| B成分 | 自然backingの格子・backing→bounds写像を非clip側へ延長した参照 | 観測CTMのpixel latticeで作る独立S倍意図描画と、その公開filter参照範囲 |
| C成分 | 自然Text layerの実合成範囲 | 同じ自然Text layerの実合成範囲を維持 |
| A成分とunion | 旧scale1 direct＋B＋Cの4edge min/max | 同じ3成分の厳密unionを維持 |
| 忠実性比較 | 元nativeS比較canvasで全画素alpha>0の占有一致 | 同phaseの出力logical1比較canvasで全画素alpha>0の占有一致 |
| 一致が示す範囲 | 自然格子を再現したという前提を含む | 観測したclipped出力の占有対応。非clip外側や元backingのfilter写像の同値性は保証しない |
| 検査profile | 旧175＋旧v3の20を成功要求 | 新候補専用profileで旧175＋新v4の20を成功要求。旧v3の20は今回未実行と明記 |

**比較解像度とBの意味は品質／比較契約の変更である。logical1一致をnativeS一致と同等とは扱わない。** nativeSにだけ残る差がlogical1で区別できなくなる可能性がある一方、Bの全native cellの外向き射影とCの実像包含は両方保持する。Rule18 §11.3 LEVEL3および§11.5.6により、製品・検査・workflow実装はMashの明示判断前には行わない。既存の「残件を進めて」、モデル制限解除、旧§87/88承認をこの差分への承認へ読み替えない。

### 93.2 寸法推定を使わない具体的な描画・比較

1. 同じ自然drawRect内で得たCTM／clip／storage／全文属性／bounds／content frame／scaleを使う。許容するCTMは `(S,0,0,-S,tx,ty)`、有限S>0。opaque contentsは読取同一性の参照としてだけ保持し、CFGetTypeID／CGImage寸法照会をしない。nil、dirty、plain不成立、未知の変換・filter・背景等は既存と同じく拒否する。
2. 背面画像の高さHnaturalを使わず、top-downの独立格子 `qx=S*x+tx, qy=S*y-ty` を定義する。TextKit ink±2fontをこの格子へ写してfloor/ceilした `(x0,y0,x1,y1)` の差だけをapp所有bitmapのW/Hとする。W/Hは独立参照の実寸であり、自然backingの実寸ではない。
3. app所有contextのCTMは `(S,0,0,-S,tx-x0,H+y0+ty)`。同じshared paintの全glyph rangeを描き、全alpha>0を走査する。pixel cellを逆写像して出力logical1へ外向き射影する。参照画像は `(x0-tx)/S,(y0+ty)/S,W/S,H/S` の宣言したlogical extentへpublic CALayerで合成し、元の公開filter／opacity条件を反映した範囲もBへunionする。未知の自然backing→bounds縮尺を復元したとは呼ばない。
4. 忠実性用のclipped参照は同じ独立格子／shared paintに観測clipとview.boundsのintersectionを適用する。同じphase・透明背景・logical1 canvasへ、この参照と自然view.layerをそれぞれ合成し、比較領域の**全cell**でalpha>0の真偽が一致することを要求する。差分率、alpha許容幅、固定1pxの追加、差分の無視は導入しない。自然layer自体の全alpha範囲は独立にCとして走査する。
5. 比較／C用extentはview.boundsと宣言した参照extentのunionを含み、元のfilter-support scratchを保持する。空・外縁alpha・非有限値・資源不足は拒否し、領域を拡大して再描画しない。A/B/Cの4edgeを厳密min/maxで計算し、JS側でも再計算する。20fieldは維持するがversionをv4に分け、v3 tokenや旧local結果を受理しない。
6. §92.2の先頭6Textのsnapshot複合不一致は原因未確定のまま扱う。自然drawの前後に同じsource／glyph range／属性／geometryが対応することを既存patchとinspectorで確認し、独立CTLine計測は保存したimmutable属性snapshotを使う。paint後snapshotへ無条件に移して正当化せず、自然paintがどのsnapshotに対応したか確認できなければunavailable。項目別の不一致は同じ一回のharness結果へ残し、診断専用CIは追加しない。

CGContextのCTMから独立座標へ写せることと、自然backingの実寸／resamplingが同じことは別である。上記の式は独立参照の定義であり、Appleがこの方法の自然RN忠実性を保証しているという主張ではない。logical1で不一致が残る可能性、新候補でもquote／snapshot／時間／資源が未達になる可能性を保持する。

### 93.3 元の上限・同一性・試験選択

- 本文・空白・段落・離散font順・B9選択・branding28/40/opacity0.8を維持する。新しい背景・入力例の削除・本文短縮・成功するサイズへの固定はしない。
- 元8秒の起点とdeadline object、native90秒、1辺4096・4,194,304pixel・code-owned同時保有32MiBを維持する。新v4のprovider予約はinspectionをまたいで実際の最終解放まで共有し、per-callの新budgetだけで合算を保証したとはしない。direct成分の同時保有も確認する。CA内部cacheは計測したと主張しない。
- 既知のwall-clock巻戻りを含む最終monotonic保証は未証明のまま残す。最終fitまで元の経過時間を照合し、単なるwall expiry内や早いunavailableを8秒内成功としない。実装前にこの上限を保つ根拠が閉じなければ、緩和せず未実装STOPとする。
- 同mount／本人／source／recipe／測定世代／自然contents同一性／local→placed token／一度消費を維持する。新v4は旧v3結果と混在させず、保存済み旧版を新表示に読み替えない。強制layout/display/flush、追加wait、同source再実行、追加helper/診断familyは行わない。
- JS既存933件を保持し、新v4 schema／version分離／union／source／token／期限／全pixel比較の条件を追加する。旧175のnative期待値と旧runV3Checks本体・20期待値は保存する。**新候補profileの195＝旧175＋新v4の20**であり、旧v3の20を新成功へ再ラベルしない。旧v3の20はこのprofileでは未実行、旧10FAILと原物はそのまま残す。workflowのV3→V4対象選択とsummary変更も今回の明示判断範囲とする。
- 新v4の20項目は旧候補の目的に対応する独立した検査とし、S2/S3・正負小数phase・Arabic/ligature/emoji・opacity0.8・clip trap・snapshot/版間token・nil/dirty/unsupported・資源/整数overflow・外縁/空・期限/一度消費を含める。拒否想定は当該fault経路へ到達した証拠を要求し、前段の別拒否を成功へ付け替えない。
- 実RNは元13namesを同順で保持する。旧savedは元版のまま、対象preview/raw/trapは新候補へ明示分岐する。全reportのstrict JSON、本文保持、全row/brandingのlocal/placed・独立5値・token/fit・PNG・時間を確認する。controlled clip trapはdirectだけならfitでもBがoverflowを捉えることを要求する。新previewのunavailableを成功へ加算しない。

### 93.4 対象path・実施上限・完了条件

承認を求める実装範囲は**既存20path（製品6・検査8・workflow1・資料5）**だけ、新tracked file0。§87の19pathに既存runner `tests/native/run-piece-rn-canvas-ios.sh` を加える差分も明示する。runnerは既存test-only観測を新v4分岐へ対応させるためであり、製品へ診断機構を追加しない。

| 区分 | exact paths |
|---|---|
| 製品6 | ios/tempCocolon/PieceTextMetrics.mm、patches/react-native+0.77.3.patch、features/piece/pieceRenderer.js、components/piece/PieceVisualCard.js、features/piece/pieceLayout.js、features/piece/pieceMeasuredWrap.js |
| 検査8 | tests/piece-v2-renderer.test.js、tests/piece-v2-measured-wrap.test.js、tests/native/piece-text-metrics-ios.mm、tests/native/piece-ios-react-shim.h、tests/native/piece-rn-canvas-entry.js、tests/native/piece-rn-canvas-fixtures.cjs、tests/native/piece-rn-canvas-ios.m、tests/native/run-piece-rn-canvas-ios.sh |
| workflow1 | .github/workflows/piece-rn-contracts.yml |
| 資料5 | Cocolon_Piece/00_read_first.md、Cocolon_Piece/manifest.json、Cocolon_前提資料/current_structure/02_piece_current_structure.md、Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md、Cocolon_前提資料/07_latest_snapshot_diff.md |

承認後に根拠・実装・local検証が成立した新sourceだけをGitHubへ反映し、既存CIを一度だけ実行する。全結果・原report・PNG・元ログを既存manifestへ保存して終了する。nativeの新profile195、実RN13の対応条件、全alpha比較、同一性、元上限のどれかが未達なら候補未採用STOP、same-source rerun0。追加購入・dependency・service・定常費用・Mash端末操作0。既存Actions一回の実使用量は発生し、前回21分31秒は参考であって所要保証ではない。

新候補が成立しても正式renderer admission、containment版saved reader、InputScreen正式isSaveAdmitted供給、実Auth/APIの通常保存→同owner再表示、写真保存/共有、物理実機の受入れへ自動進行しない。これらは未完了のまま保持する。今回の提案をP-W1完成や10/22保存目標の達成に数えない。

### 93.5 今回実施した確認と保存

開始Cocolon PR30 head b38989ff50070ca6d72682d353385cb2dfb5503e、API PR3 head a536e50ee284785f585ac73329ef2947dca8bba9を確認。添付の前回作業内容、Karen-Diary指定入口と2memory、作業規則、恒久incident全文、全体設計01と全file地図01A/B/Cの全体flow・責務・Piece接続、共通current map／Piece map、最新weekly20261017のP-W1〜P-W3と最新結果、該当source/testを確認した。巨大資料全体や全repo実ファイルの逐語読了は主張しない。GitHub由来の対象75ファイルはmaterialized bytesとblob SHAを照合した。

System Context prepareはtask_profiles.json未取得で失敗し、technical entryの原典直接read fallbackを使用した。生成contextは更新・採用していない。Supabaseはproject一覧readのみでcocolon-projectのACTIVE_HEALTHYを確認。user rows／業務RPC／SQL／migration／本番設定操作0。

独立read-only review2担当が、比較gridとB意味の変更がLEVEL3であること、旧v3の検査を新v4成功と混同しないprofileの必要性を指摘し、最終案へ反映した。同一環境の補助reviewであり、別モデルPro/Ultraの審査を捏造しない。root華恋が最終判断・唯一のGitHub writer。モデル制限解除を適用する。

今回の変更は既存資料5fileのみ。提案は未承認・製品/test/workflow実装0・CI0、STRUCTURE_MAP_DELTA_NONE（現行構造を変えず、別候補はproposedに分離）。PRIMARY_OUTCOME=BLOCKER_NARROWEDは『既存契約内で直るという未立証前提を外し、必要な比較契約差を特定した』範囲だけで、商品品質credit0。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。

公開仕様の原典（2026-10-22確認、設計根拠と推論の区別を上記に明示）：
- Apple CALayer contents: https://developer.apple.com/documentation/quartzcore/calayer/contents
- Apple CALayer render(in:): https://developer.apple.com/documentation/quartzcore/calayer/render(in:)
- Apple Graphics Contexts: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_context/dq_context.html
- Apple Quartz 2D Coordinate Systems: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_overview/dq_overview.html


## 94. 2026-10-22 — Mash承認済み出力座標v4を実装（source準備、CI前）

Mashは直前の「旧候補を保持し、出力画像の座標で全画素比較する別候補の実装と、一度のCI検証まで」へ「進めていいよ。」と明示承認した。§93のB意味・比較grid・新profile195・既存20pathと一度CIが今回の範囲で、§93の未承認記載は設計時の履歴である。同じ承認やGitHub許可を再質問しない。

開始Cocolon PR30は7ce4426b552d5ffe2276c70b30489db01df6344c、API PR3はa536e50ee284785f585ac73329ef2947dca8bba9。前提資料・作業規則・全体設計/全file地図・最新weeklyと§93の決定を継承し、恒久incident全文を今回も読んだ。root華恋だけがrepo編集/実行/GitHub writerを担い、補助3担当のscratch draftを原典再確認して統合した。別モデル審査が成立したとは主張しない。必要性はOBSERVED_BLOCKER_MINIMAL_FIX、scopeはMash明示承認済みLEVEL3。商品接続は、現在停止する本文画像からP-W1の通常保存へ進む前の描画候補成立を確認すること。

### 94.1 実装と保持した境界

- 別preview containment.prototype.v2と別wire selected_line.v4/inspectSelectedLineV4を追加。旧v3 helper/decoder/bridge・runV3Checks本体/20期待値を保持し、旧v2/v9/savedの版を置換しない。新wireも閉じた20field/4field requestで、3成分unionをJSで厳密再計算する。
- 自然contentsはstrong identityだけに使う。新V4 helper内のCFGetTypeID/CGImage実寸/自然context bitmap寸法照会は0。観測CTMのq格子、宣言した独立参照extent、同phaseのlogical1全alpha>0比較を実装した。比較は全cell一致で、許容差/固定1px/差分率は加えていない。Bが自然backingを復元したとは呼ばず、旧nativeSの検出感度と同じとは主張しない。
- 新V4のAは旧scale1 glyphs-onlyの意味を保ち、所有を追えるRGBA contextで実装した。旧UIRenderer A helperは不変更。新nativeのpositive全件でlocal/placed両方のAのedgeと独立5値を旧v2へ照合する。所有実装変更後の同値性はCI前には未実証である。
- 新V4専用process共有32MiB ownerを使い、A/B/比較/Cとprovider最終解放まで予約を保持する。CA内部cacheは計測したとしない。native grid±2font、4096辺/4Mpixel/8秒/90秒は不変。全資源不足・外縁・空・unsupportedは拒否し、再描画して領域を広げない。
- 自然drawのbefore/after観測を旧gridとは別に保持し、storage/全文属性/layout/container/glyph range/bounds/frame/scale等の12bit stable_maskとcurrent一致を検査する。CTLineの独立計測はimmutable属性copyを使う。snapshot6の具体原因を解決済みとはせず、新条件で失敗すればunavailableにする。
- 新profileだけ同じdeadline objectのwall開始/expiryとperformance.now開始を保持し、候補探索・local・placed・queued state採用・最終hash後・fit同期再読の全てで元8秒を確認する。wall巻戻りや最後のhash処理が期限を跨いでもfitを成立させない。nativeは元dual guardとlocal monotonic期限を保持する。これは最終adoption/fitの上限であり、native処理の絶対終了時刻やCA内部処理の一般保証まで立証したとはしない。

### 94.2 検証profileとCI前の実結果

新candidate profileを明示して、旧native129（内包97）＋v9 46＋新V4 20＝195uniqueを検査する。旧V3 20は不変更で残し、このprofileでは未実行という独立markerを要求する。旧run39565918631の10FAILを消去/成功化/skip加算しない。新20内部ではnormal controlを先に成功要求し、allocation/edge faultの到達、stable_mask/属性/glyph_range個別破壊、contents/token/版、資源算術/空alphaを検査する。複数assertionを別testへ重複加算しない。

| CI前確認 | 実結果と限界 |
|---|---|
| 変更前JS | 933 PASS/FAIL0/SKIP0、10,466.889485ms。最初のpartial materializationではnexusRouteModel未取得のsetup failureがあり、必要原典を取得して解消。製品修正ではない |
| 統合後JS | 949 PASS/FAIL0/SKIP0/CANCEL0、12,619.480735ms。既存933＋新16。local結果をCI件数へ重複加算しない |
| RN patch | 公式0.77.3 package原本へ --dry-run/--fuzz=0 成功。新snapshot観測を追加しても元shared paint二呼出しとhighlight経路は保持 |
| shell/workflow | bash -n、YAML全6job parse、workflow内Python heredoc5本の構文確認成功 |
| test-only診断 | 新native SHA256へ束縛。104箇所/3TLS reset/同呼出しraster observer1の注釈を除去すると製品source全文一致。注釈はCI隔離copyのみ |
| 旧候補保持 | 旧V3 helper spanとrunV3Checks本体、旧decoder/bridgeの関数全文を照合。不変更。旧失敗原物も保持 |
| 実iOS | LinuxではUIKit compile/実RN13条件/全PNG/A同値は未実行。新source一度のCIで確認する |

本変更は承認済み既存20path（製品6/検査8/workflow1/資料5）、新tracked file0。CI発火前のlocal結果と、旧資料5fileは同一write unitで同期する。current mapに新候補の分岐責務を反映しSTRUCTURE_MAP_DELTA_PRESENT。Supabase/SQL/user rows/業務RPC/API/依存/flags/env/署名/配布/deploy/main mergeへの変更0。

### 94.3 一度のCIと終了条件

sourceをGitHubへ反映・全20file読戻し確認後、同sourceの既存push CI一回の完了を待つ。元13names/入力/saved DTOを保持し、新候補のrow/branding/source/token/fit/画像/実経過とraw/trap/opacity0.8を確認する。native新profile195、実RNの各対応条件、full alpha比較、資源/期限/原文保持のどれかが未達なら未採用STOP。同source再実行・結果後source/test/workflow追加修正・追加診断CIは0。

CIの全job原ログ・元report・PNG・xcresultの取得可能な原物を既存manifestへ保存し、結果を同じownerへ追記して終了する。現時点CI未実行、画像成立/正式admission/商品合格/通常保存・再表示の成功は主張しない。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=falseを維持する。10/22保存・10/23共有の目標も達成扱いしない。


### 94.4 途中checkpoint：source全20file読戻しと一度CI開始

source87335f4ff489389a75857f90e7fb3f93367ce153／tree8846d921d8174bb9f9a3332380df349f74314215をPR30へ反映し、全20fileをGitHubから全文取得してlocal bytes/blob SHAと一致確認した。一度の[CI39683393855 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39683393855)は同sourceで実行中。以後製品/test/workflowを固定し、source追加修正・同source再実行0を維持する。local949 PASSはCIの結果や実RN13条件へ換算しない。全6jobと実PNG/fit/期限はこのcheckpoint時点で未確定。今回のreadbackと実run identityを継続記録し、完了後に同じ単位へ結果を追記する。候補未採用、正式admission/通常保存・本人再表示は未完了、automatic_progression=false。


### 94.5 途中結果：旧175成功、新V4は1PASS/19FAIL、実RN継続中

同じsource87335f4f、一度CI39683393855 attempt1。JS949 PASS/FAIL0/SKIP0（9,990.680848ms）、Android sourceと四つのAndroid export library実compileも成功。iOS source syntax compileとpatch適用は成功したが、standaloneの新V4は20件中1成功/19失敗、旧175は全成功。計176unique PASS/19FAIL、重複0、旧V3 20未実行markerと旧97/129/V9 46 summaryを確認した。main→最終summaryは42.039325秒で元90秒内、launch status0でも検査失敗でjobはfailureである。

新V4の唯一の成功はempty_alphaの合成検査。正常想定8件と、正常controlを前提にする拒否・snapshot・token等11件は失敗した。各拒否faultへ到達した合格とは扱わない。standaloneには具体的な拒否stage/code比較詳細がなく、snapshot/alpha/A同値/資源のどれが直接原因かはこの集計から確定しない。旧A同値・新V4 pixel忠実性を証明したとは扱わない。

実RN13条件とPNG、iOS export library compileは同runで継続中。今回checkpointへ完了4jobの元decodedログ、jobs metadata、独立native集計を可逆保存した。新候補は未採用STOPとし、source/test/workflow追加修正・同source再実行0。残る同run原物の回収と最終結果記録だけを続ける。通常保存/本人再表示・正式admissionは未完了、automatic_progression=false。


### 94.6 最終結果：承認単位完了、CI failure、新候補未採用STOP

§93へのMash明示承認に従い、旧候補を保持した出力logical1比較の別候補を実装し、新source87335f4ff489389a75857f90e7fb3f93367ce153で[CI39683393855 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39683393855)を一度だけ実行した。2026-10-21T22:01:33Z開始→22:23:32Z最終更新、全6job完了・総合failure。実装と一回検証の承認単位は完了したが、品質条件は未達で新候補未採用。結果後のsource/test/workflow修正0、同source再実行0、追加CI0を維持する。§94.5の「継続中」は当時の途中記録であり、現在は終了済みである。

| job | 最終結果・成立範囲 |
|---|---|
| piece-rn-contracts | success、JS949 PASS/FAIL0/SKIP0/CANCEL0、9,990.680848ms |
| piece-android-source | success、native source回帰 |
| piece-export-android | success、既存export依存4library実compile、BUILD SUCCESSFUL |
| piece-export-pods | success、既存export依存4Pods実compile、Podfile.lock元blob c11ea8959571227856f67f2f631047924be0861dに一致 |
| piece-ios-source | failure、syntax/patch compileは成功、旧native175 PASS、新V4は1PASS/19FAIL |
| piece-ios-rn-canvas | failure、実RN host build成功、XCTest実行失敗。元13reportとPNG5を回収 |

nativeは195unique中176PASS/19FAIL、重複0。旧129（内包97）＋旧V9 46＝175は全成功。新20の唯一の成功はoutput_v4_empty_alphaで、正常8条件と正常controlを前提とする11条件は失敗した。拒否faultの成功へ付け替えず、A旧V2同値・S2/S3・phase・union・opacity0.8・clip trap・資源/版/tokenの成立を主張しない。旧V3の20は今回profileで明示未実行、旧10FAILと原物・helper・期待値を保持する。standalone main→最終summaryは42.039325秒/元90秒内だが、終了status0は検査成功を意味しない。standaloneには呼出し別stageがなく、その19FAIL原因をRNのstageから一括確定しない。

元13names/順序/入力とsaved DTOを保持し、strict JSON13件を保存した。結果は次の通り（elapsedはreport値で、完成captureまでの成功時間ではない）。

| 元name | phase | elapsed ms | PNG |
|---|---|---:|---|
| essay_paragraphs | unavailable | 2390.151 | なし |
| quote_unicode | unavailable | 368.577 | なし |
| declaration_no_brand | unavailable | 471.464 | なし |
| essay_max420 | unavailable | 5533.348 | なし |
| saved_essay_canvas | native_checked | 699.256 | あり |
| suffix_latin_ligature | unavailable | 252.987 | なし |
| suffix_arabic | unavailable | 286.411 | なし |
| suffix_max420_a | unavailable | 3075.043 | なし |
| suffix_spaces_raw | measurement_unavailable | 448.760 | あり |
| suffix_hebrew_raw | measurement_unavailable | 157.187 | あり |
| suffix_mixed_bidi_raw | measurement_unavailable | 169.607 | あり |
| containment_native_clip_trap | measurement_unavailable | 156.210 | あり |
| containment_branding_opacity08 | unavailable | 219.171 | なし |

新preview8はすべてunavailableで完成PNG/fit0。旧saved1だけが元版のままnative_checked/native_canvas_valid=true、raw3＋trap1はmeasurement_unavailable/native_canvas_valid=false。Card9件のcanSave/canExport/save_fit_currentはすべてfalse。全13のblocksと元fixtureは一致、Card9のplan_groups連結も一致し、raw4のnative_texts/rows/blocksも元文字列と一致した。raw4のbody_preserved=falseは既存catchの固定flagであり、本文改変を観測したという意味ではない。一方、新完成画像がないため表示の本文忠実性は未証明である。

実RN native境界62件は全local/rejected、tuple重複0、診断identity一致、placed成功0。その61件はstage83（原native806行）のclipped独立参照と自然Text layerのlogical1全cell alpha>0占有不一致。独立非clip描画/scan、B公開filter合成、clipped参照/scan/bitset、自然layer描画/scanまでは到達している。不一致x/y、actual alpha、参照bit/alpha、比較geometry operandは原物にないため、位相・filter・丸め等の単一原因や具体修正箇所を断定しない。snapshot/CGImage仮定/自然bitmap照会/確保/期限失敗へ読み替えない。

残るquote_unicodeのtag139/80ptの1件はstage15、raster failure mask256。3481×1285＝4,473,085画素が元4,194,304上限を超える。各辺4096と32MiBの超過ではない。どのRasterPlan呼出しかを専用fieldで記録しておらず、寸法からの推論と確定事項を分ける。62件すべての記録済み自然snapshotはpresent/paint_complete/stable_mask0と属性・storage・bounds・frame・scale一致で、旧V3 snapshot複合失敗の原因解明を今回へ流用しない。JS trace snapshotの31rejected＋31pendingに対しnative原境界は62callback完了しており、pendingを孤児化/timeoutと断定しない。

全13のreport elapsedは8秒未満（最大5,533.348333ms）だが、早いunavailableを8秒内成功/420成功/実RN最終fitのmonotonic保証とはしない。A/B/Cの製品union・全画素一致・clip trap overflow検出・branding0.8成立・新画像品質も未証明である。

PNG5の原bytes SHA256と全RGBAを前回contents-grid結果へ照合し、5枚すべて完全一致。root華恋が5枚contact sheetと旧saved原画像を目視した。旧savedは元5本文行とbrandingを表示し、raw4はnative Textを表示するが、新候補成功のcreditにはしない。原zip59,523,256byte/1020member（完全な元xcresultを含む）のSHA256はccfd99e62ea378a22ea50dd81a082f115c5295966749b94404becee870fd49e8でGitHub digestに一致し、有効期限を持つActionsコピーとは別に保存済み。全memberのbytes/SHA256台帳、全6job元ログ、元results.json、原PNG5、xcodebuild.log、元xcresult root JSON、診断stage map、独立レビュー2件、原Pod lock zipを既存manifestのfinal_evidence_bundleへ可逆保存した。XCTestは1method/1failed、59failure summariesで、13fixtureを13test methodへ加算しない。

今回最後の同期は既存資料5pathのみ、STRUCTURE_MAP_DELTA_NONE。15source/test/workflowはsource87335f4fのbytesと一致確認済み。追加dependency/service/flags/env/deploy/main merge、API/DB/SQL/user rows/業務RPC操作0。補助2担当はread-only、root華恋のみ結果資料を同期した。同時pushのphase6-contract-guardsはrun39683393854のcontract-guards 1job successであり、追加Piece検証や複数jobとは数えない。

PRIMARY_OUTCOME=BLOCKER_NARROWEDは「画像占有不一致61件と画素数上限1件を区別し、旧snapshot/opaque CGImage原因の流用を避けた」範囲だけ。商品品質credit0、DETOUR_RISK_STOPを維持する。次の未完exact1は既存logical1参照合成と自然layerの対応を直接修復する具体案の設計であり、現原物だけでは原因/修正箇所が一意でなく、修復案未成立・未実装・未実行。同source再実行、追加診断family、比較許容差/上限緩和、別helperへの迂回を自動開始しない。通常保存→本人再表示・正式admission・写真保存/共有・物理実機受入れは未完了、10/22保存目標未達のまま。bounded_work_complete=trueとvalidation_success=falseを区別し、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=falseを維持する。


結果保存時の補足：9,828,497byte版manifestの全文取得はTransport closedで失敗し、branchへは反映しなかった。過去診断と前回contents-gridの二つの原物bundleだけを、全文照合済みv122固定commit0ef6a57e11c1c020421995ddcf846d16eab09a94／blob e0295a73124b009f5555bf79c7d15585088c6e3cのJSON pointerへ置き換えた。圧縮bytes/SHA256/member数と原bytesはGit履歴に保持し、今回のfinal原物bundleは不変更。製品・検査・workflowやCIには影響しない。


## 95. 2026-10-22 — 比較不一致の直接修復を再解析、追加診断一回の具体案（未承認・未実行）

### 95.1 現在の不足と、今回確認できた範囲

Mashの新しい「Pieceの残件作業を進めて。」により、§94.6の次exact1である既存logical1参照合成と自然Text layerの対応を再解析した。前回の終了を設計・原典読取まで永久に禁止するものとは読まない。一方、旧§93の承認済み一回CIは消費済みで、旧source87335f4f/run39683393855 attempt1のfailure・新候補未採用・DETOUR_RISK_STOP・counter1を保持する。

開始はCocolon PR30 head e4107a28e584a47288102a2cd7c8e0a6ce7659f5、API PR3 head a536e50ee284785f585ac73329ef2947dca8bba9。fresh recursive treeは1917entry/truncated=false、materialized98 tracked fileのblob一致・差分0を確認した。全体設計01、全file地図01A/B/Cの責務・Piece接続、共通current入口、Piece map、最新weekly20261017のP-W1〜3と最終§5.6.22.3、§93〜94と現source/patch/test/logを照合した。巨大資料全体・1917entry全実ファイルの逐語読了は主張しない。Karen-Diary指定3fileと作業規則、恒久incidentは先頭からEOFまで今回も確認。System Context prepareはtask_profiles.json未materializedで失敗し、技術入口が認める原典直接read fallbackを使った。生成contextの採用/更新は0。

P-W1の完成条件は通常入力→本文/画像preview→明示保存→同じ本人の履歴/詳細であり、現在は最初の新previewが成立しない。前回13reportの62local拒否の61件はstage83のlogical1全cell占有不一致、quote80ptの1件は4,473,085pixel/元4M超過。旧native175成功・新V4 1PASS/19FAILと旧savedだけの表示成功を維持し、新preview8未成立/PNG0/fit0、通常保存・本人再表示未完了を変えない。

独立原典解析2担当とrootでq格子を再計算した。top-down row rを置けば、現CTMはr=S*y-ty-y0、逆写像y=(r+y0+ty)/S、宣言extent原点+(r/S)も同じになる。単純なty符号誤り、contentFrame二重加算、無条件Y反転を確定した修復とはできない。raw spacesの記録済み自然/参照CTMの差288native pixelは96logicalの整数原点移動と整合し、clip高さの微小差だけを全61件の原因と断定しない。

現sourceで未照合なのは、自然UIView layerとplain参照layerの内容方向、参照CGImageの補間設定と自然出力の対応である。geometryFlippedの検査だけでは内容描画の方向を保証せず、公開contentsAreFlippedは別の照会である。ただしその値は自然draw時のcontext反転に関係し、CTMへ既に表れている可能性もあるため、値の差だけで画像上下反転の原因とはしない。PiecePixelsImageはshouldInterpolate=false、参照layerはlinearだが、この二つの指定の優先関係やopaque自然backingの設定を原物から確定できない。これらを理由に反転・補間を決め打ちで製品へ入れない。

最初の不一致x/y、actual alpha、参照占有bit、両scan範囲と合成geometryが原物にない。現証拠では具体修正箇所を閉じられず、製品修復済みとはしない。旧snapshot/CGImage問題やRN stage83をstandalone19FAIL原因へ一括流用しない。引用元はApple公開APIの原典であり、この方法のUIKit忠実性の保証や今回causeの証明ではない。

- https://developer.apple.com/documentation/quartzcore/calayer/contentsareflipped()
- https://developer.apple.com/documentation/quartzcore/calayer/isgeometryflipped
- https://developer.apple.com/documentation/coregraphics/cgimage/shouldinterpolate

### 95.2 推奨exact1：既存比較の最初の差を残す一回限りの観測

新しい描画候補・helper familyを作らず、既存tests/native/run-piece-rn-canvas-ios.sh内のtest-only TLSだけを補足する。承認前のtracked runner・製品・patch・test期待値は不変更。提案runner全bytes/patch/identity/局所検証/独立レビューをmanifestのlossless bundleに保存した。提案runnerは19,974byte、SHA256 07700096663e332d4c9dcec5fa09c87d0d3f8686911ea10f7bb4c720ce9d0b1a、git blob2e2f952addd57c818cf7570e29ae5b5e9fc3c9a3。native preimage SHA256は6250785b9d9d09e9fdf293ff78b48134995c5210ab5c37e73551027753902111に固定し、想定外preimageでは実行しない。

1. 既存V4 clipped参照のscan成功直後に、既に得たreferenceCells、native/logicalExtent、sourceClip、観測CTM/paintCTM/phase、自然/参照layerの公開contentsAreFlipped/geometryFlipped/scale/opacityと、自分が作ったCGImageのshouldInterpolateをscalarへコピーする。opaque自然contentsをCGImageへcastしたり寸法を照会したりしない。
2. 元のstage83比較ifに入った最初の不一致時だけ、x/y・columns/rows・actual alpha uint8・参照占有bool・actualCellsを保存し、元と同じNOを返す。比較式は変更しない。参照側は占有bitであり、生の参照alpha値や全maskを採ったとは呼ばない。
3. 既存のtest-only diagnostic getterへoutput_grid_comparisonを追加し、同callのtag/font/stage/identityを持つ元native境界recordへ残す。製品の20field wire/RN exportは増やさない。first_mismatch_present=falseの座標/寸法0は未設定で、0位置の差や透明画素を観測したという意味ではない。
4. TLSはstatic_assertで1KiB以下に限定し、image/layer/context/providerを保持しない。新しい描画/走査/画像/bitmap buffer/wait/retry0。観測実行時間は増えるため、前回と同じ失敗件数・所要を保証しない。8秒/90秒/4096辺/4Mpixel/32MiBと元の期限式は維持する。

scratchでbash -n、埋込Python構文とbuild関数の隔離実行、104guard/3reset/既存raster観測1＋新reference観測1＋first-mismatch観測1、注釈を除去した製品全文の逆射影一致、診断injector後のrunner全文一致を確認した。最初の準備用AST選択がfooterのpath読取まで含んだためscratchで失敗し、footer前で止める選択へ訂正した。repo/source write・UIKit/CI実行効果は0。ObjC++compileと実iOS実行は未確認であり、局所構文・逆射影をcompile成功へ換算しない。

product/route reviewは例外を明示したこの一回案を推奨、technical reviewは変数寿命・有限JSON・元比較/NOの保持に重大なblockerなしと判断した。同じWork環境の実補助reviewであり、別モデルPro/Ultraの成立は捏造しない。root華恋が唯一のexecution/GitHub writerである。

### 95.3 今回必要なMash判断、実行上限と終了条件

今回求める差分は、旧§93.2.6の「項目別の不一致は同じ一回のharness結果へ残し、診断専用CIは追加しない。」への、既存runner scalar補足＋新test commitでCI一度の**今回限りの例外**である。旧source SHAのActions rerunではなく、旧counter/旧失敗/旧終端を保持した別の未実行案であり、same-source違反が既に起きたとは記録しない。

Rule18 §11.3 LEVEL3のprior prohibition例外/新approval envelope、§11.5.6のeffect/STOP境界変更に該当する。またCURRENT_RULES R1.5は商品delta0の単独test/runner/blocker narrowing unitを禁じる。今回は根拠ある製品修復がまだ未特定のため、同一unitの付随検証だと読み替えず、**原因確認だけで閉じる単独診断を一回だけ認める例外**も同時に判断対象とする。一般rule本文を変更・恒久解除せず、この限定例外以外は維持する。新しい一般継続指示だけで禁止の解除を明示承認済みとは扱わない。同じ比較契約への再承認やGitHub接続許可を求めるものでもない。

| 境界 | 具体的な範囲 |
|---|---|
| 承認後に反映するexact paths | 既存runner1：tests/native/run-piece-rn-canvas-ios.sh。結果資料4：Cocolon_Piece/00_read_first.md、Cocolon_Piece/manifest.json、Cocolon_前提資料/current_structure/02_piece_current_structure.md、Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md。計5、new tracked0 |
| 実行 | 提案runnerを新test commitへ反映し、既存push CIを一度だけ実行。workflow/job追加0、Actions rerun0。新counter0→1で終了 |
| 保持 | 製品/patch、logical1全cell alpha>0完全一致、A/B/C厳密union、20field/version/token、元13names/順序/本文/saved DTO、旧175＋新20の195期待と旧V3明示未実行、全元上限 |
| 新しい証拠 | 同じcallのfirst mismatchと双方占有/両scan範囲/合成geometry。値を得ても、原因確定・新preview成功・商品品質改善とは別 |
| 時間・費用 | 前回は全6job約22分、今回の所要保証なし。既存Actions一回の使用量あり。新規依存/service/購入/定常費用/端末操作0 |
| 診断成立 | 元13strict JSONとnative identityを保持し、取得したstage83 recordでfirst mismatch/寸法/indices/alphaと参照bit/両scan範囲/geometryが有効。同じ比較ifで双方の占有が異なることを確認する。無観測0を実測にしない |
| 打切り | compile/infrastructure/record不足やstage83へ未到達でも一回で終了。追加修正→再CI、条件緩和、別観測family、bitmap置換0。CIの元合否を成功へ書換えない |
| 終了 | 全job元ログ/元report/取得PNG/診断map/取得可能原物を既存manifestへ保存し停止。結果後の製品修復や次CIは自動開始しない。原因・修復が特定できなければ未特定のまま保持 |

本候補が将来観測を返してもproduct credit0、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。quote4M超過1件は別残差として保持し、tile/領域縮小/上限増/資源拒否からのfont縮小へ拡大しない。10/22通常保存・10/23共有の未成立を解消したとはしない。

### 95.4 今回の実効果と保存

今回は原典解析と具体案まで。current source/test/workflowへの反映0、CI0、製品修復0、DB/SQL/user rows/API/本番/配布/main操作0。旧§94.6の結果と原物は保持し、未採用STOPを撤回しない。PRIMARY_OUTCOME=ADMINISTRATIVE_ONLY、商品品質credit0。比較の根因を一意に狭めたとは主張せず、新たに準備した未実行案と観測不足を記録する。

更新は既存資料4fileだけ。mapは構造変更ではなくpending判断への案内を同ownerへ追記したためSTRUCTURE_MAP_DELTA_NONE。07はmilestone-only正本に従い、この未実行診断案だけでは更新しない。提案の作成・記録は現在指示とRule18の既存範囲で行い、診断の適用/push/CIは上記例外の明示判断まで未実行とする。


## 96. 2026-10-22 — Mash承認済み比較operand観測を適用（新test source準備）

Mashは§95の「原因調査に限定し、この記録追加とCI一回を進めてよいでしょうか。」へ「進めていいよ。」と明示承認した。§95.3の診断専用CI禁止/R1.5単独診断禁止への今回限りの例外であり、§95の未承認表記は設計時の履歴である。同じ例外やGitHub接続許可を再質問しない。旧§93のsource87335f4f/run39683393855 attempt1・counter1・failure・未採用は保持し、新§95の一回だけを別counterで記録する。

開始Cocolon PR30 head2a0584613c3ea19df83e61c2e5fd932bf829fffd/treec517843c92a8bda35641da0698713b3876b9a062、API PR3 a536e50ee284785f585ac73329ef2947dca8bba9。最新入口§95、Piece map§65.43、weekly§5.6.23とP-W1〜3、全体設計/全file地図の既確認責務・実sourceを継承し、恒久incident全文を今回も読んだ。model/environmentはPIECE_WORK_ALLOWED、別モデルPro/Ultraの成立を主張せずroot華恋を唯一のexecution/GitHub writerに固定する。

### 96.1 適用した範囲と、CI前確認

既存runnerのbytesは、GitHub manifestに保存・Mash承認された19,974byte/SHA256 07700096663e332d4c9dcec5fa09c87d0d3f8686911ea10f7bb4c720ce9d0b1a/blob2e2f952addd57c818cf7570e29ae5b5e9fc3c9a3と完全一致する。bundle全memberのbytes/圧縮hashを復号照合し、元runner preimageと、製品/patch/test/workflowの前回source metadataも一致確認してから適用した。元nativeはSHA256 6250785b9d9d09e9fdf293ff78b48134995c5210ab5c37e73551027753902111のままである。

追加は既存test-only TLSのreference観測1と最初のstage83不一致観測1だけ。元104guard/3reset/比較if/return NO・deadline・paint/scan/pixel bufferは維持。最初のx/y・actual alpha/参照占有bitと、両scan範囲/extent/clip/CTM/内容方向等を元native callbackへ残す。first_mismatch_present=falseの0は未設定であり、差なしや透明画素を測定したとはしない。参照の生alpha・全maskやopaque自然backingの実寸は取得しない。

局所bash/Python構文・元製品全文の逆射影とrunner後半一致は同一承認bytesで確認済み。適用後もhashとbash -nを確認する。UIKit compile/新operandの取得/画像/13report成立は未確認であり、新test sourceを反映した既存CI一度で実測する。JS949・旧native175・旧/新20の前回結果は履歴として維持し、今回へ成功を転用しない。前回の62call/61stage83を今回の固定分母にしない。

### 96.2 一回の実行と終了

今回exact pathsはrunner1＋結果資料4の計5、new tracked0。workflow/fixture/195期待値/元13names・順序・入力/saved DTO/製品/patch/20field wire/version/token/8秒/90秒/4096辺/4Mpixel/32MiBを変更しない。新source pushで既存CIを一回だけ実行し、Actions rerun0。compile・infra・記録不足でも一回で終了し、source追加修正→再CIへ進まない。

診断の取得と元CIの合否を分ける。有効な同call identityのstage83 recordでavailable/first_mismatch_present、整数indices/寸法、alpha0〜255と参照boolの占有不一致、有限geometryを確認する。取得できた範囲を実数で記録し、値の相違だけで根因を断定しない。全6job元ログ・元report/取得PNG・診断map・取得可能原物を既存manifestへ保存したところで停止する。製品修復、次CI、admission、通常保存/本人再表示へ自動進行しない。

現時点はtest source準備でCI未実行。STRUCTURE_MAP_DELTA_NONE（既存診断内のscalar補足だけ、製品構造不変）。DB/SQL/user rows/API/本番/配布/main操作0、商品品質credit0、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。


### 96.3 途中checkpoint：承認runnerの全文反映と一度CI開始

新test source a79773bdfa1ea0bd8b929c2a7ceb5ab9a470cfa9/tree0b6d7aca004fd85967e71ad3bad1385ac3bafa95を反映し、変更集合が承認5pathだけであることと全5fileのremote全文一致を確認した。[CI39692007906 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39692007906)は同sourceのpushで2026-10-21T23:13:35Z（10/22 08:13:35 JST）に開始した。新診断counter1/上限1、Actions rerun0。旧§93/run39683393855のcounter1/failureを保持する。

同pushの既存phase6_contract_guards run39692007783も起動し、contract-guards 1jobだけである。追加したworkflow/jobではなく、Pieceの診断結果へ合算しない。今回source pushを再送せず、以後runner/製品/patch/test/workflowを固定する。全6jobの元結果とoperandの取得・13report/画像はまだ未確定であり、元の合否と診断成立を分けて回収・保存だけを続ける。今回checkpointは結果資料4fileのみ、STRUCTURE_MAP_DELTA_NONE、商品品質credit0、通常保存/本人再表示は未完了、automatic_progression=false。


### 96.4 途中checkpoint：5job終了、単体native新候補19FAILを保持

同source/唯一CI39692007906 attempt1の5jobが終了した。JS949PASS/0FAIL/0SKIP/0cancel、Android source compile成功。iOS source compile成功後、元175PASSを保ち、新V4は1PASS（output_v4_empty_alpha）/19FAIL、計195unique＝176PASS/19FAIL。旧V3 20は明示未実行、main→summary37.68472秒で元90秒内。元の失敗を診断の成功や時間条件の達成へ読み替えない。この単体実行は今回runnerのoperand補足対象ではなく、19FAILすべての原因を実RNへ流用しない。

export-android/export-podsはjob successだが、今回差分がrunnerだけのため、既存path条件で依存install/4library実compile/Pod解決/Podlock artifactをskipした。今回は新しいexport compile成功証拠がない。既存phase6 run39692007783のcontract-guards 1jobはsuccess。完了5jobとguardの元decoded logsはBOM/CR/LFを含め無変換bytesで回収し、job metadata/単体native集計とともにmanifestへ可逆保存・全member hash照合した。

実RN canvas jobはまだ実行中で、13report/5PNG/今回operandの取得と有効性は未確定。新counter1/上限1、rerun0、source追加修正0を維持して結果回収だけを続ける。資料4fileのみ、STRUCTURE_MAP_DELTA_NONE、商品品質credit0、通常保存/本人再表示未完了、automatic_progression=false。


### 96.5 最終：原因調査限定＋一度CI終了、61件のscalar観測成立、製品失敗STOP

Mash承認の§95/§96に従い、承認runnerだけをsource a79773bdfa1ea0bd8b929c2a7ceb5ab9a470cfa9へ反映し、[CI39692007906 attempt1](https://github.com/MassyuRed/Cocolon/actions/runs/39692007906)を一度実行した。2026-10-21T23:13:35Z開始→23:38:39Z最終更新、全6job完了/総合failure。新診断counter1/上限1・Actions rerun0、source追加修正0。旧run39683393855/counter1/failureは保持。原因調査の承認単位は完了し、追加修復/追加CIへ進まず停止する。§96.3〜4の継続中表記は途中記録である。

| 元job | 最終結果と成立範囲 |
|---|---|
| piece-rn-contracts | success、JS949PASS/0FAIL/0SKIP/0cancel、16,371.395362ms |
| piece-android-source | success、既存native source compile |
| piece-export-android | success、既存path条件でnative compile等skip。今回の4library実compile証拠なし |
| piece-export-pods | success、既存path条件でPod解決/compile/artifact skip。今回の新Pod lockなし |
| piece-ios-source | failure、source compile成功、旧175PASS＋新V4 1PASS/19FAIL＝195unique。旧V3 20明示未実行 |
| piece-ios-rn-canvas | failure、instrumented実RN host build成功、XCTest1method/1failed/59failure summaries。元13report/PNG5を回収 |

単体nativeのmain→summary37.68472秒/元90秒内、唯一の新PASSはoutput_v4_empty_alpha。正常controlを前提とするfault検査など19FAILを成功へ付け替えず、呼出し別operandのない単体19件へ実RNの原因を一括流用しない。

#### 96.5.1 今回実際に得たoperandと、原因として言える限界

native原境界は実数62件、全local/rejected、unique tuple62、placed成功0。stage83が61件、stage15が1件で、前回分母を固定せず原物から集計した。stage83の61件は全件で同call identity、available/first_mismatch_present、整数indices/正寸法、alpha uint8、参照bool、占有不一致、有限geometryが成立し、独立担当とrootの照合に矛盾0。元104guard/3resetと製品preimageに対応する診断map/postimage SHAも承認案と完全一致した。observation_success=trueはこのscalar取得だけを指し、元CI/新preview/fit成功とは分ける。

61件すべての最初の不一致はactual alpha1〜9>0に対してreference_occupied=false。自然側bbox topは参照よりlogical1cell上にあり、height差は59件+2・2件+1、全61で自然側bboxが参照bboxを包含した。例：essay_paragraphs/tag59/48ptは1082×271比較gridのcell(243,114)、actualAlpha1/参照非占有。参照bbox[99,115,399,42]に対し自然bbox[99,114,399,44]（形式[x,y,width,height]）。bbox包含は全maskのpointwise包含を証明しない。

全61でcontentsAreFlippedは自然/参照ともtrue、geometryFlippedはともfalse、contentsScaleとも3、opacity同値（57件1、4件0.800000011920929）。観測済みq格子/native extent/paint CTM式は再計算残差0で、ty符号や両側の反転flag不一致は今回の値からは示されない。参照のCGImage shouldInterpolate=falseは実測したが、opaque自然backingの同flag・実寸・形式やrendererの優先処理は取得していない。全体を一律Y移動するだけではbbox height差を説明できない一方、補間・filter・再標本化・自然backing写像等のどれが根因かは一意未確定である。alpha1〜9も元のalpha>0契約では占有であり、閾値変更・1px水増し・許容差追加で合格へ置換しない。新たな製品修復案は選定/実装/実行していない。

比較前のquote_unicode/tag139/80ptの1件はstage15/mask256、3481×1285＝4,473,085pixelで元4,194,304超過。4096辺/32MiB超過ではない。output_grid_comparison={}は未到達で、0座標・透明alpha・差なしの観測へ読み替えない。全62の記録済みnatural snapshotはpresent/paint_complete/stable_mask0と属性/storage/bounds/frame/scale一致を維持する。

#### 96.5.2 元13条件・画像・期限・原物保存

strict JSON13件、元names/順序/blocks/観測入力projectionは前回と一致。新preview8は全unavailable、完成PNG0/fit0。旧saved1のみ元v3/native_checked（401.311917ms）、raw/trap4はmeasurement_unavailable。Card9のcanSave/canExport/save_fit_currentはfalse。raw4のbody_preserved=falseは既存catchflagで、native Textの元文字列一致を別確認した。saved DTO全体はreportにserializeされないため、元fixture/helper/entryのbytes一致による構築不変と実測した旧版/blocks/flagsを区別する。

全13のreport elapsedは8秒未満、最大4250.887msだが、新previewの8秒内完成/420成功/実RN最終fit保証は成立しない。62dispatchは期限前でcase内dispatch/adapter expiryは同一、観測できた36callbackは期限前。JS traceのpending26はsnapshot上の時刻欠測であり、別採取native境界62callbackの完了拒否と区別し、孤児化やtimeoutと断定しない。Card自身の開始時刻は未出力で8秒起点そのものの実測証明もない。元8秒/90秒/4096辺/4Mpixel/32MiBと比較式/期待195/入力/20field wire/version/tokenを維持した。

原PNG5のbytesと全RGBAは前回と完全一致。root華恋が5枚contact sheetと旧saved原画像を目視し、旧5本文行/brandingとraw表示を確認した。新候補の画像忠実性や計測成功には加算しない。完全xcresult入り原ZIP58,482,322byte/994member、SHA256 6c71aa2ea0c4c458069fb7f2505154e0998a5f1698a3456959e774635fb86389はGitHub artifact digestに一致し、原bytesを保存済み。元6job＋既存guard1jobのdecoded logs、元13report/PNG5/xcodebuild.log/Info.plist、timestamp prefixだけを除いたxcresulttool root JSON、診断map、全archive member台帳、独立レビュー3件/root解析/保存identityをmanifest final_evidence_bundleへ可逆保存し、全member bytes/hashの復号一致を確認した。

前回実装runのfinal/途中bundleと今回途中bundleの3件は、全文照合済み固定commit98b0e3f026977c766aa25bd1a8d3e87993fcfe5c/blob ee718a072773777d4497e48b95f11e1183332e41内の同JSON pointerへ置換し、元圧縮hash/bytes/member数を保持した。元bytesはGit履歴に残り、今回の完全原物bundleは直接内包する。現在のsource/test/workflow15pathがCI開始時と一致し、API head a536e50e不変も確認した。同pushの既存phase6 run39692007783はcontract-guards 1job successであり、Pieceの追加診断CIへ加算しない。

今回最終同期は資料4fileのみ、STRUCTURE_MAP_DELTA_NONE（既存test-only scalar補足以外の実構造不変）。07は本単位の更新対象外。root華恋だけがwriter、補助3担当はread-only。DB/SQL/user rows/API/本番/配布/main操作0。PRIMARY_OUTCOME=BLOCKER_NARROWEDは「境界supportの差を実測し、単なる反転flag不一致/一律Y移動だけでは説明できないことを区別した」範囲で、商品品質credit0。次の未完exact1は、この出力alpha support差を生む既存参照合成と自然layer対応の直接修復案の設計。根因/検証済み修正案は未成立で、追加診断family・同source再実行・次CIへ自動進行しない。通常保存→同owner再表示・admission・写真保存共有・実機受入れと10/22保存目標は未完了。bounded_work_complete=true、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=falseを維持して停止する。


## 97. 2026-10-22 — V4参照画像の補間指定を揃える直接修復候補（未適用・新CI判断待ち）

### 97.1 現在地・事実・推論

Mashの新しいPiece残件続行指示を受け、入口§96.5の次exact1「既存参照合成と自然layer対応の直接修復案」を具体化した。開始Cocolon PR30 head c3929573a0e1b355f5de372a3130b92ee83ce986、API PR3 head a536e50ee284785f585ac73329ef2947dca8bba9。recursive tree1917entry/truncated=false、local materialized98fileのblob一致/差分0を確認。添付txt/CI39692007906原物、Karen-Diary指定3file、前提入口・作業ルール・恒久incident全文、全体設計01と01A/B/Cの全体flow/責務/関連file、三中核共通map/Piece map、最新weekly20261017のP-W1〜3/末尾結果、実source/patch/test/runnerを照合した。巨大地図全体や1917entry全実ファイルの逐語精読を主張しない。System Context prepareはtask_profiles.json未materializedで終了code2、technical entryの原典直接read fallbackを使用し生成context更新/採用0。Supabaseはproject一覧readのみ、cocolon-project ACTIVE_HEALTHY。user rows/SQL/RPC/migration操作0。

実測は前回のまま：実RN stage83の61件すべてでactual alpha1〜9/参照非占有、自然bbox上端−1cell・高さ+1/+2。flip/scale/opacity一致・q/CTM残差0で、一律Y移動だけでは説明できない。現sourceのPiecePixelsImageはCGImageCreateのshouldInterpolateをfalseへ固定する一方、自然layerはlinear filterを要求し、参照layerは同じlinearをコピーする。自然paintと参照paintはpatchの同じTextKit二呼出しを共有している。

AppleのCGImageCreateはshouldInterpolateを画像補間の指定、CALayer minificationFilterは縮小filter、linearは線形補間と説明する。しかし、この二指定の優先関係・opaqueな自然backingの補間値・今回の61件の根因を公開資料だけでは確定できない。今回の「補間の違いが薄い輪郭差を生む」は根拠のある**修復仮説**であり、原因確定/修復済み/成功保証ではない。前回§95で根拠なく補間を決め打ちしなかった判断を遡及誤りにせず、今回取得済みの61件の輪郭support差を根拠に、明示的な一候補へ絞った。

別系統のquote80pt/stage15は3481×1285＝4,473,085pixelが元4,194,304pixel上限を超えるとsource照合した。本案でこの拒否を解消するとはしない。standalone19FAILはcall別operandがないため、すべてが同じ補間原因とは扱わない。

### 97.2 適用前に固定したexact candidate

推奨は既存V4参照画像の補間だけを有効にする一案。新renderer/version/familyを作らず、既存containment.prototype.v2/selected_line.v4内の新source候補として試す。旧未採用source・元失敗・counter・原物は維持する。

```diff
-static CGImageRef PiecePixelsImage(PieceOwnedPixels &pixels) {
+static CGImageRef PiecePixelsImage(PieceOwnedPixels &pixels, bool shouldInterpolate = false) {
 // CGImageCreate の shouldInterpolate に固定falseではなく引数を渡す。
-  CGImageRef expandedImage = PiecePixelsImage(native), clippedImage = NULL;
+  CGImageRef expandedImage = PiecePixelsImage(native, true), clippedImage = NULL;
-  clippedImage = PiecePixelsImage(clipped);
+  clippedImage = PiecePixelsImage(clipped, true);
```

上記二呼出しの変更はV4関数だけ。V3の同名二呼出しは既定falseのまま。providerの所有権/解放順序/割当buffer/寸法/budget、自然Text/layer、opaque backing非読取、CTM/clip、全cell alpha>0完全一致、A/B/C厳密union、wire20field/version/token、8秒/90秒/4096辺/4Mpixel/32MiBを維持する。alpha閾値・許容差・固定1px追加・差の無視は0。V4のfilter後B/maskが変わるため、その後のfont/配置が変わる可能性はある。参照を変えるだけで合格を保証したとはしない。

候補native96,744byte/SHA256 f3dadd39774bfaf3886dc180e4a5be55a165f2918194b26614aa75af87241340。元preimage SHA256 6250785b9d9d09e9fdf293ff78b48134995c5210ab5c37e73551027753902111。既存runnerはこのsource preimage pinの1箇所だけを更新し、候補19,974byte/SHA256 d71f0677b7648f229745597cb2140955a57fee94cacd5a405bcec04fb1e96259。診断観測/記録field/処理/guardを追加しない。候補全文2file・patch・局所確認・instrumentation map・実補助reviewをmanifestのios_preview_v4_interpolation_repair_proposal_20261022.lossless_candidate_bundleへ可逆保存する。現在のtracked製品/runnerへは未適用。

局所確認はbash -n、既存埋込Python構文/build関数の隔離実行、旧→候補の注釈逆射影一致、runner差がhash1箇所だけ、元104guard全式/順序・3reset・既存観測数/比較if/NO不変を確認した。UIKit/ObjC++ compile/描画/CIは未実行。これらの静的確認を画像一致・8秒内成功・195成功へ換算しない。read-only補助2担当は実行候補として具体的で、静的な重大blockerなし、商品routeに合うと判断。別モデルPro/Ultra審査の成立は主張しない。

### 97.3 今回の判断対象・実行上限・終了条件

製品の純粋な内部修正に毎回承認を求める扱いへ戻さない。ただし旧§96の承認は原因調査＋一回CIで終了し、製品/patch不変更・結果後の修復/次CIへ自動進行しない境界だった。本候補のnative変更と新source一度CIをその消費済み診断承認へ含められない。Rule18 §11.3 LEVEL3(3)(4)(6)の新envelope/allowed effect/STOP境界の判断として、**この具体候補の適用と付随CI一回**をMashへ確認する。GitHub接続許可や同じ比較契約の再承認ではなく、単独診断CI例外をもう一度提案するものでもない。一般ruleは変更しない。

| 項目 | 限定範囲 |
|---|---|
| 適用後のexact paths | source1：ios/tempCocolon/PieceTextMetrics.mm、runner1：tests/native/run-piece-rn-canvas-ios.sh、既存資料4：本入口/manifest/Piece map/weekly20261017。計6、新tracked0 |
| 実行owner/環境 | root華恋一人、PIECE_WORK_ALLOWED。補助担当はread-only。原典と候補preimageをfresh確認して適用 |
| 実行 | 新source pushによる既存CI一回。workflow/job追加0、Actions rerun0。同source再実行/結果後のsource追加修正0 |
| 検査 | 旧175＋新V4 20の195期待を維持、旧V3 20は明示未実行。元13names/順序/本文/旧saved DTO、元JS949を保持。fault拒否は目的の経路到達を確認 |
| 成功/不成立 | 全alpha一致と元各期待・元上限を評価。新preview/PNG/fitは実際の成立数で記録し、未達は候補未採用。quote資源拒否の残存を含め、部分改善を全合格や通常保存へ昇格しない |
| 終了 | 成否/compile/infra不成立を問わず一回で閉じ、元jobログ/report/PNG/診断map/取得可能原物を保存して停止。条件緩和/次診断/別修復/追加CIを自動開始しない |
| 費用・期間・負担 | 既存Actions使用量一回。前回全6job約25分は参考で所要保証なし。新依存/service/購入/定常費用/Mash端末操作0 |
| 対象外 | quote資源方式変更、admission、saved版切替、通常保存/同owner再表示、写真保存/共有、API/DB/SQL/本番/配布/main変更 |

承認後も根因確定は実比較の結果で判断する。補間を有効化して差が減っても、他のguard/資源/時間/paint対応が未達なら未採用のまま。正式renderer admission→同採用版saved key/profile→InputScreen正式isSaveAdmitted→既存保存controller/API→同owner履歴/詳細というP-W1後続を再作成せず、現残件として保持する。

### 97.4 今回の実効果

今回反映は資料4fileだけ。source/runner/test/workflow/fixtureのtracked変更0、CI0、DB/API/本番/配布/main操作0。候補全文はmanifest内に未適用で保存。Piece map冒頭の古い「最新§92.2」を実際の最新pending§97へ訂正し、過去本文は履歴として保持する。STRUCTURE_MAP_DELTA_NONE（実製品構造不変、候補判断案内のみ）。07はmilestone-onlyにより今回更新しない。

PRIMARY_OUTCOME=ADMINISTRATIVE_ONLY。新しい修復candidateを具体化したが実画像の新証拠/商品品質credit0。旧§96/run39692007906 counter1/failureと旧§94/run39683393855 counter1/failureは不変。新候補適用/CI counter0、approval_pending=true。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。10/22通常保存目標未完、10/23共有/10/24実機の予定は未達成として保持する。

原典（2026-10-22確認）：
- https://developer.apple.com/documentation/coregraphics/cgimage/init(width:height:bitspercomponent:bitsperpixel:bytesperrow:space:bitmapinfo:provider:decode:shouldinterpolate:intent:)
- https://developer.apple.com/documentation/quartzcore/calayer/minificationfilter
- https://developer.apple.com/documentation/quartzcore/scaling-filters


## 98. 2026-10-22 — Mash承認済みV4参照補間修復を適用（新source準備）

Mashは具体案§97の適用と新sourceのCI一回へ「進めていいよ。」と明示承認した。§97の未承認記述は設計時履歴であり、同じ承認を再質問しない。旧run39692007906/counter1/failureと旧run39683393855/counter1/failureは不変に保ち、今回の新製品修復候補と一度CIを独立に記録する。

開始Cocolon PR30 c79c06aaac7a1e38023e640f7c502653bd36ba48/tree587bd48c6210b20cd1647c968ecc32d948742362、API PR3 a536e50ee284785f585ac73329ef2947dca8bba9。fresh head、tree1917entry/truncated=false、materialized98file全blob一致/差分0と、承認manifest内candidate bundle6memberの復号全文/hashを確認した。前提資料/作業規則/全体設計/全file地図/最新weekly/Piece map/実sourceの前回確認を同refで継承し、恒久incidentは今回も先頭からEOFまで全文確認。model/environmentはPIECE_WORK_ALLOWED、root華恋が唯一のwriter/execution owner、補助担当はread-only。別モデルPro/Ultraの成立は主張しない。

### 98.1 適用したbytesと検証境界

製品nativeは承認済み候補96,744byte/SHA256 f3dadd39774bfaf3886dc180e4a5be55a165f2918194b26614aa75af87241340をbundleからそのまま適用した。PiecePixelsImageへ既定falseの補間引数を追加し、V4のexpanded/clipped二参照だけtrue、V3二呼出しはfalseを維持する。runner19,974byte/SHA256 d71f0677b7648f229745597cb2140955a57fee94cacd5a405bcec04fb1e96259はsource hash pin一箇所だけの承認bytes。同candidateの局所確認・104guard全式/順序・3reset・元比較if/NOと注釈逆射影結果は§97保存済みで、適用時hashとbash -nも成功した。

自然Text/opaque backing非読取、CTM/clip、全logical1 cellのalpha>0占有真偽一致、A/B/C厳密union、wire20field/version/token、元13names/順序/本文/旧saved DTO、旧175＋新V4 20の195期待（旧V3 20明示未実行）、8秒/90秒/4096辺/4Mpixel/32MiBを維持する。alpha値やRGBA値そのものの一致を要求する別比較へ変更していない。追加診断/描画/走査/bitmap buffer/待機/再試行0。filter後Bと配置/fontへの可視差は承認した修復候補の評価対象で、成功の保証ではない。

### 98.2 一度CIと終了条件

source1/runner1/結果資料4の承認6pathだけを新source commitへ反映し、既存push CIを一回だけ実行する。新counter0→1、Actions rerun0、workflow/job/fixture/期待値変更0。全結果の元logs/report/PNG/診断map/取得可能原物を保存して終了し、compile/infra/検査未達でも追加修正→再CIや別診断へ進まない。旧失敗のcounterはresetしない。

現時点はsource準備、CI未実行。ObjC++compile/UIKit描画/alpha対応/8秒/195成功は未確認。既知quote80ptの4,473,085pixel/4M拒否と、standalone19FAILの個別原因未特定は維持し、全体成功/修復完了へ読み替えない。新正常preview・raw・trap・opacityと元保存済み旧版を分けて判定する。新全alpha占有比較が改善しても、元各条件未達なら候補未採用のまま。

今回STRUCTURE_MAP_DELTA_NONE（既存未採用V4内の参照補間指定修復、route/owner/wire不変）。DB/SQL/user rows/API/依存/本番/配布/main操作0。formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。正式admission/通常保存→同owner再表示/画像保存共有/実機受入れとP-W1〜3の管理点は未完了であり、この単回結果へ自動進行を含めない。


### 98.3 承認source全6fileを照合、一度CI開始

source 66be9cbedb8babd15b1c59cc1479a2fd10624747/treef9dddc8a4fc4d02f6980cd5648596d50f2f9d5e6の承認6pathを全文読み戻し、changed-path setがnative1/runner1/資料4だけであることを確認した。CI39704913859 attempt1は2026-10-22T01:18:28Z（10/22 10:18:28 JST）に同sourceのpushで開始。新counter1/上限1、Actions rerun0。以後source/runner/patch/test/workflowを固定し、結果回収と保存だけを続ける。

同pushの既存phase6-contract-guards run39704913858は別のcontract-guards 1jobであり、Piece診断/修復の追加実行に数えない。現在全6jobの結果は未確定。途中のiOSsource compile/patch stepはsuccessだが、新native195/実RN13/PNG/alpha対応/fit/期限の成功へ換算しない。今回checkpointは資料4fileのみ、STRUCTURE_MAP_DELTA_NONE、商品品質credit0、通常保存/本人再表示未完、automatic_progression=false。


### 98.4 途中：旧native175成功、新V4は1成功/19失敗

同source66be9cbedb8babd15b1c59cc1479a2fd10624747/唯一CI39704913859 attempt1の5jobが終了。JS949PASS/0FAIL/0SKIP/0cancel（10,131.470663ms）、Android source成功。iOS source compile/patch step成功後、旧native175PASS・新V4 1PASS（empty_alpha）/19FAIL、計195unique＝176PASS/19FAIL、旧V3 20は明示未実行。正常controlが必要な19項目を19独立故障と扱わず、未採用を維持する。補間変更だけでこの単体条件が通らなかったことは確認できたが、call別原因は未記録で根因断定しない。

export2jobはjob successでも、既存path条件で依存install/Pods解決/4library実compileをskipしているため今回の新export compile証拠なし。既存phase6 guard run39704913858/contract-guards 1job success。完了5jobとguardの元decoded logsをBOM/CR/LF含め無変換bytesで回収し、元metadata/JS/native集計とともにmanifestへ可逆保存・全member復号一致を確認した。

実RN canvas jobは継続中で、元13report/PNG/参照補間trueと双方占有対応/時間/fitの結果は未確定。source/runner/patch/test/workflow固定、新counter1/上限1・Actions rerun0、追加修正0。checkpoint資料4fileのみSTRUCTURE_MAP_DELTA_NONE、商品品質credit0、通常保存/本人再表示未完。全6jobと原物の回収/保存だけを続ける。


### 98.4.1 途中記録の読戻し容量を縮小、原物保持

途中commit1e55b16eの資料4fileのうち3fileはremote全文一致したが、manifest8,388,394byteのfetch_blob全文取得が二回ともTransport closedで終了した。書込commit/tree/blob SHAは期待値と一致するものの、この途中manifestの全文読戻し完了は主張しない。

既に全文照合済みの固定commit c79c06aaac7a1e38023e640f7c502653bd36ba48/blob542f7267e4aadb23dd68caef0cd02d6afd6f4256に同一bytesで存在する旧run39692007906のfinal_evidence_bundleだけを、その同JSON pointerへのimmutable参照へ置換する。元圧縮bytes/hash/member数は保持し、Git履歴や原ZIPを削除しない。今回run39704913859の元5job＋guard原ログbundleは直接内包し、checkpoint facts側の同bundle重複だけを同manifest内pointerへ置換する。原物を減らさず、新しいnative/runner/test/workflow/CI効果を生まない容量修復である。

この記録の全文読戻しを確認してから途中原物の保存完了とする。実RNは同じ唯一CIで継続中、source固定/counter1・rerun0、通常保存/本人再表示未完、STRUCTURE_MAP_DELTA_NONE。


### 98.5 最終：承認修復＋一度CI完了、補間有効でも占有不一致、未採用STOP

Mash承認の§97/§98に従い、承認native/runnerをsource66be9cbedb8babd15b1c59cc1479a2fd10624747へ反映し、CI39704913859 attempt1を一度実行した。2026-10-22T01:18:28Z開始→01:37:49Z最終更新（10/22 10:18:28〜10:37:49 JST、約19分21秒）、全6job終了/総合failure。新counter1/上限1、Actions rerun0、結果後source追加修正0。§98.3〜4の実行中表記は途中履歴である。旧run39692007906・39683393855のcounter1/failureを維持し、今回候補も未採用として単位を終了する。

| 元job | 実結果と成立範囲 |
|---|---|
| piece-rn-contracts | success、JS949PASS/0FAIL/0SKIP/0cancel、10,131.470663ms |
| piece-android-source | success、既存native source compile |
| piece-export-pods / piece-export-android | successだが既存path条件で依存install/Pod解決/4library実compileをskip。今回の新export native compile証拠なし |
| piece-ios-source | source compile/patch成功、旧175PASS＋新V4 1PASS/19FAIL＝195unique。旧V3 20明示未実行、job failure |
| piece-ios-rn-canvas | instrumented実RN host build成功、XCTest1method/1failed/59failure summaries、元13report/PNG5取得、job failure |

単体nativeはmain_entered→最終summaryのログ差約35.89秒、元alarm90を維持してsummaryへ到達した。唯一の新PASSはempty_alpha。残19項目は正常control成功を前提とするため、19独立故障や個別guard破損と断定しない。standalone各callの拒否operandは今回も取得しておらず、実RNのcauseを一括流用しない。simctl exit0や期限内の終了をテスト成功へ付け替えない。

#### 98.5.1 補間指定の効果と修復不成立

元native境界62件は全local/rejected。stage83が61、quoteのstage15が1。比較61件すべてで同call identity・reference_image_should_interpolate=true・first_mismatch_present=true・有限geometry・正寸法/範囲内indexと占有不一致を確認した。承認native preimage/実instrumentation mapは候補と完全一致、元104guard/3reset/比較if/NOは不変。全62の自然snapshotはpresent/paint_complete/stable_mask0と属性/storage/bounds/frame/scale一致を維持する。

| 各callの最初の不一致 | 前回run39692007906 | 今回run39704913859 |
|---|---:|---:|
| actual alpha>0・参照非占有 | 61（alpha1〜9） | 9（alpha1が6、alpha2が3） |
| actual alpha0・参照占有 | 0 | 52 |

これは最初の差の分布であり、総不一致画素数や差分率ではない。自然側bboxは61件すべて前回と同じ、参照側bboxは61件すべて変化。今回27件は両bboxが一致しても内部の占有maskが一致しない。したがってbbox一致だけで全alpha占有一致に代えない。

例：essay_paragraphs/tag59/48ptは同1082×271gridでactual bbox[99,114,399,44]、参照bbox[98,114,400,44]。最初の差cell(246,114)はactual alpha0/参照占有で、前回のactual alpha1/参照非占有とは変わった。補間指定は参照出力へ作用したと実測できたが、単にtrueへ揃える修正だけでは忠実性比較を解消しない。自然backingの補間設定/実寸/内部filter写像や唯一の根因を確定したとはしない。全alpha>0占有真偽の完全一致、A/B/C厳密union、全資源/期限/期待値は維持する。

quote_unicode/tag139/80ptのstage15は前回と同じ3481×1285＝4,473,085pixel、mask256、4,194,304pixel上限超過。比較未到達であり、空の比較objectを透明alphaや差なしとして数えない。上限増加/領域縮小/tile化/資源拒否からのfont縮小へ範囲を広げていない。

#### 98.5.2 元13条件・画像・時間と保存

strict JSON13件を原reportから確認し、元names/順序/blocks/rows/plan_groups/renderer/candidate/幅高/brandingは前回と一致。新preview8は全unavailable、完成PNG0/fit0。旧saved1だけ元prototype.v3/native_checked（679.403458ms）、raw3＋cliptrap1はmeasurement_unavailable。全Card9の保存/export/current-fitはfalse。raw4のbody_preserved=falseは既存catchflagであり、今回もnative_texts＝元rows＝blocksを実確認した。元saved DTO全文はreportにserializeされないため、fixture/entry bytes不変とreportの旧版/本文/flagsを区別する。

全13report elapsedは8秒未満、最大5,450.421459msだが拒否までの時間であり、新preview完成/420成功/最終inspectionまでの元8秒保証ではない。元5PNGは前回添付ZIP内の対応原PNGとbytes/全RGBAが5/5完全一致。rootはcontact sheetで全5を目視し、旧savedの本文5行/brandingとraw表示を確認した。新候補の改善画像や描画成功には加算しない。独立read-only2担当も同じ成否と占有方向の変化を確認し、別モデルPro/Ultraの成立は主張しない。局所PNG解析がreportだけの旧展開先を参照して一度失敗したため、添付旧ZIPの原PNGを直接読むよう訂正した。製品/CI/期待値は変更していない。

全6job＋既存guard1jobのdecoded原ログ、元13report/PNG5/xcodebuild.log/Info.plist、timestamp prefixだけを除いたxcresulttool root JSON、実診断map、全archive member台帳、source凍結照合、解析/補助review/保存identityをmanifest final_evidence_bundleへ可逆保存し、各member bytes/hashの復号一致を確認した。完全原ZIP55,728,124byte/998member/SHA256 a74eed4184a8938f71017c1fc297a7669442788ceb38addd800fcdf206779985はGitHub artifact digestと一致。完全xcresultを含む原bytesはlibfile_496805d086c8819196eb9e71eb705b5e/version0へ保存し、同じ原fileへidentityを適用済み。Actions側copyは10/29期限だが保存済み原物を保持する。

今回raw bundleの追加後も全文取得を可能にするため、旧containment macro修復のfinal bundleだけを、全文照合済み固定c79c06aa/blob542f7267の同JSON pointerへ参照保持する。旧compressed bytes/hash/member台帳は不変でGit履歴から復元可能。今回のfinal raw bundleは直接内包する。途中§98.4.1の容量修復も原物削除やsource変更ではない。

#### 98.5.3 終了・残件

source後の変更集合は資料4fileのみで、native/runner/patch/test/fixture/workflowを全て固定したこととAPI head a536e50e不変、同sourceのPiece CI attempt1だけを確認した。同pushのphase6 run39704913858は既存contract-guards 1job successで、追加修復CIには数えない。今回最終同期も資料4fileのみ、STRUCTURE_MAP_DELTA_NONE。DB/SQL/user rows/API/依存/本番/配布/main操作0。

PRIMARY_OUTCOME=BLOCKER_NARROWEDは「補間trueの実作用を確認し、このflagだけの修正では全占有一致を直せないと実測した」範囲に限定する。再利用可能な合格renderer/商品品質creditは0、validation_success=false/unadopted=true/DETOUR_RISK_STOP。bounded_work_complete=trueは承認された適用＋一度検証＋結果保存の単位だけで、formal_admission/product_acceptance/normal_save_reopen_complete/can_save/can_export/automatic_progression=false。

次の未完exact1は、残る参照合成と自然layerのfilter/占有対応を既存品質契約内で直接修復する具体案の設計。唯一根因/次の検証済み修正案は未成立であり、追加修復/診断family/同source再実行/次CIへ自動進行しない。quote資源方式、正式renderer admission、採用版saved key/profile/InputScreen供給、通常保存→同owner再表示、写真保存共有、実機受入れとP-W1〜3管理点は未完了。今回承認範囲で停止する。
