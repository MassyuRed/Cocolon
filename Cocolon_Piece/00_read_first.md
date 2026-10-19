---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-10-20 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

**現在の作業は§79／current map §65.27／weekly20261017 §5.6.7です。10/20の新指示により、v6で加えた本文Textの固定高さを明示iOS preview v7だけで解除し、RN本来の自然計測へ戻しました。横padding・内幅・logical行高・厳密な描画条件は維持。local JSは既存888＋新8＝896成功です。新source一度の実RNと画像は結果待ちで、Arabicの直接原因・修復成立・正式admission・通常保存は未確認です。旧v6の失敗と未採用STOPは§78の履歴として保持します。**

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
