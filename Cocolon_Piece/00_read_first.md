---
doc_id: cocolon_piece_read_first
title: "Cocolon Piece — Read First"
revision_date: "2026-10-09 JST"
decision_owner: "Mash"
workstream: "Cocolon / Piece"
document_status: "CURRENT_PIECE_WORKSTREAM_ENTRY"
automatic_progression: false
---

# Cocolon Piece — Read First

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

現在の実装・残件は§28／current map §32を優先する。次の段落と状態表は10/07以前の履歴であり、未着手判定に使わない。

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
