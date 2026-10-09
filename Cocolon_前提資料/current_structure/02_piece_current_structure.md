---
doc_id: cocolon_piece_current_structure
title: "Piece構造 — Current Structure"
revision_date: "2026-10-09 JST"
latest_api_implementation: "0312a0fc3b07f8e46344d5746cafd7760458badd"
latest_storage_candidate: "d71fdb40238f2c99751f0c20e578ab654f72308e"
document_role: "PIECE_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
activation_effect: 0
automatic_progression: false
---

# Piece構造 — Current Structure

## 0. Current conclusion

**2026-10-09現在：既存AppRuntimeContextへ認証通知時のPiece表示フラグ無効化とbootstrap再取得を接続した。保存参照GET・RN本文プレビュー・既定OFF・foreground刷新を継承する。サーバー実効flag／操作時強制、InputScreen、PIECE_FEATURE_DISABLED、実機の完成ではない。現在の追加差分は末尾の2026-10-09節、10/08以前の状態と検査件数は各時点の履歴として読む。**
**2026-10-08現在：保存参照GETの非稼働コードをAPI `0312a0fc3b07f8e46344d5746cafd7760458badd`へ反映し、RN `df88a0e0f46cdbfc005039177983dbec740efb3f`で明示GETと既存preview要求への受渡しを反映した。先行の本文プレビュー、既定OFF、再取得失敗時OFF、foreground刷新は保持する。これはInputScreen・実サーバーの登録／実効flag・実機画像の完成ではない。参照取得URLの採用と、稼働環境への登録・有効化を分離する。現在の内訳は末尾の2026-10-08節を優先し、以下の10/07以前の結果は履歴として保持する。**

**GitHub反映済みのAPI再開位置は `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996`（§26）です。§25に役割明記ひらがな人名の修正と旧CI 676 PASSを分離して保持します。§26のB7公開切替・削除HTTPは反映済みで、2026-10-07の既存隔離PostgreSQL workflowにおいてB7 HTTP 152件とnative SQL接続13件が成功しています。実Auth／実PostgREST／実機の確認ではなく、B7全体・商品合格は未成立です。公開安全性の実判定→永続preview発行→開発画面という本線は未完了です。§24以前の結果は各commitの履歴として保持します。**

### 9/30・9/26の到達点（履歴）

**2026-09-30 保存基盤の現在地：B2-Aの既存5ファイルを保持し、6readerを専用read viewへ切り替えた。凍結試験はnative PostgreSQL／psycopgで1 PASS。file-only B2-Aの技術受入れに限り、live DB適用・保存preview／HTTP／RN・商品受入れは未完了。現在の内訳は§4.3を優先し、以下の9/26記載と§19〜20は本文・画像の前回到達点として継承する。**

**2026-09-26最新：API PR #3の `fa82077febb1363e286eb225fd53ff50ad863bbf` で、保存前の内部組立物に対する画像設定だけの変更を実装した。本文を再生成せず、全本文・content payloadとhashを保持し、変更前後に元入力・保存状態・権限・tierを再照合する。追加54件は全PASS、統合5,446件は5,313 PASS／133 FAIL。前回 `57df8fc` の組立処理も反映済みだが、その60件のテストはツール安全性チェックで未反映のまま。今回の54件とは別であり、再送・代替していない。§20を最新、§19を前回組立の記録、§12〜18を履歴として読む。保存済みpreview発行・HTTP／RN・保存／履歴・native共有は未完成。Draft／default OFFと旧Q&A未切替を維持する。**

Pieceは三構造の中で最も専用資料が整っているが、現行old Q&A経路、将来Piece V2、RN／backendのactive owner、PCE-9A B02-A causal REDの進行状態を一枚で読めるcurrent mapがなかった。

このmapは詳細PCE資料を置き換えない。商品全体、current actual、future design、file family、保護境界、履歴への唯一の入口を提供する。

## 1. 商品目的

Pieceは、owner-authenticatedな保存済みユーザー入力を起点に、本人の考えや価値観を他者が単独で受け取れるcanonical textへ整形し、versioned visual recipeを通じて画像化できるユーザー所有artifactにする機能である。

PieceはQ&A productではない。現行のQ&Aはpre-release legacyであり、future Piece V2のactive formatではない。

## 2. Current actualとtargetを分ける

| Layer | Current actual | Designed target |
|---|---|---|
| source | emotion／memo payloadを使うlegacy route | owner-authenticated saved_input_id + source version exact1 |
| text shape | question／answer channel | short_essay、quote、declaration |
| generation | focus-key／keyword／fixed fallbackを含むold service | source-bound semantic artifact planからcandidate生成 |
| visual | Q&A modal／card | canonical piece_text + versioned visual recipe + layout plan |
| image | actual product ownerなし | derived export binary。record／feed source-of-truthはexact0 |
| lifecycle | legacy preview／publish／Nexus route | preview = record = card = renderer input = export-visible body |
| activation | old user-visible route | V2はcode-disabled／design-only。runtime activationなし |

Current user-visible Pieceはold Q&Aである。将来designが存在することを、V2 runtime完成へ変換しない。

## 3. Target product flow

    owner-authenticated saved input
      -> original / supplemental source partition
      -> Piece semantic duties
      -> eligible format planning
      -> publicization and safety transform
      -> canonical piece_text
      -> versioned visual recipe + layout plan
      -> immutable preview bundle
      -> record / visibility / export lifecycle

safety transform後に本人の核が残らない場合、generic文を捏造せずUNAVAILABLEとする。record／quota effectは0。

## 4. Current architecture components and files

### 4.1 Cocolon RN

| Responsibility | Path | Lifecycle |
|---|---|---|
| stack navigation | navigation/PieceStackNavigator.js | CURRENT_ACTUAL |
| Piece home | screens/PieceScreen.js | CURRENT_ACTUAL |
| library | screens/PieceLibraryScreen.js | CURRENT_ACTUAL |
| entry／history menu | screens/PieceEntryScreen.js、screens/PieceHistoryMenuScreen.js | CURRENT_ACTUAL |
| legacy preview | components/EmotionPiecePreviewModal.js | CURRENT_ACTUAL_LEGACY |
| input preview control | screens/input/InputPiecePreviewController.js | CURRENT_ACTUAL_LEGACY |
| API client | lib/api/home/emotionPieceApi.js | CURRENT_ACTUAL |
| Nexus | screens/NexusScreen.js、screens/nexus/NexusPieceCard.js、screens/nexus/NexusPieceFeedSection.js | CURRENT_ACTUAL_LEGACY |
| wire compatibility owner | lib/compat/legacyWireContracts.js | CURRENT_ACTUAL |
| representative RN contract | tests/rn-screen-contracts.test.js | PROTECTED_TEST |

### 4.2 mashos-api current route

| Responsibility | Path | Lifecycle |
|---|---|---|
| API entry | ai/services/ai_inference/api_emotion_piece.py | CURRENT_ACTUAL_LEGACY |
| generation | ai/services/ai_inference/emotion_piece_generation_service.py | CURRENT_ACTUAL_LEGACY |
| draft store | ai/services/ai_inference/emotion_piece_store.py | CURRENT_ACTUAL_LEGACY |
| terminal publish | ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py | CURRENT_ACTUAL_LEGACY |
| generation policy | ai/services/ai_inference/piece_generation_policy.py | CURRENT_ACTUAL_LEGACY |
| visible display／format | ai/services/ai_inference/piece_generated_display.py、ai/services/ai_inference/piece_text_formatter.py | CURRENT_ACTUAL_LEGACY |
| Nexus／read APIs | ai/services/ai_inference/api_nexus.py、ai/services/ai_inference/api_piece_runtime.py | CURRENT_ACTUAL |
| public reads | ai/services/ai_inference/piece_public_read_service.py、ai/services/ai_inference/piece_public_read_store.py | CURRENT_ACTUAL |
| shared text guard adapter | ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py | SHARED_SUBSYSTEM |
| shared input contract | ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py | SHARED_SUBSYSTEM |
| Piece V2 pure contract | ai/services/ai_inference/piece_v2_contract.py | CODE_DISABLED_TARGET |

Current shared PieceComposerはcaller-supplied candidateを評価するguard adapterであり、Piece V2 artifact generatorではない。

### 4.3 Piece V2 protected development path

| State | Path／owner |
|---|---|
| B01 causal RED | ai/tests/piece_v2/ 以下のB01 protected tests |
| B01 code-disabled owner | ai/services/ai_inference/piece_v2_contract.py |
| B02-A M0／M1 causal RED freeze | ai/tests/piece_v2/db/test_b02_m0_m1_legacy_bridge.py（変更なし） |
| B02 implementation artifacts | API Draft `0ea9c99`の下記5ファイルを保持し、9/30続行で6readerのselectorだけ変更。native凍結試験1 PASS。旧mainのabsent状態と区別する。 |

2026-09-27 JSTの限定B2-A提案後のMash続行指示により、同じfile-only実装・隔離DB検証・Draft反映は承認済み。同じ承認を取り直さない。本番適用、公開契約変更、B2-B、merge/deploy/有効化は含まない。

| published path（mashos-api） | B2-A責務 |
|---|---|
| `supabase/migrations/20260808_001_piece_v2_legacy_read_bridge.sql` | 旧`public.pieces`と元データを変えず、同じ21列の専用read viewを作る候補。 |
| `supabase/migrations/README.md` | 未適用・検証条件・後日の適用順序と戻し方。 |
| `supabase/migrations/manifest.json` | SQLの識別値、過去PCE-0と現在の2本のEmlis migrationを分離。実DB一致は未確認。 |
| `requirements-piece-v2-test.txt` | 隔離試験の依存版固定。インストール済みの証拠ではない。 |
| `ai/tests/piece_v2/db/conftest.py` | 検査対象を明示された使い捨てlocal DBに限定。DB作成・模擬成功・skip置換なし。 |

    B02-A frozen test:
      UNCHANGED / native PostgreSQL 16.15 + psycopg 3.3.6 + pytest 8.4.1
      1 PASS / FAIL 0 / ERROR 0 / SKIP 0

    M0 / M1 implementation:
      EXISTING_EXACT5_PRESERVED
      EXACT6_READ_SELECTORS_REBOUND_TO_MYMODEL_REFLECTIONS_READ

    disposable PostgreSQL GREEN:
      DISPOSABLE_LOCAL_DATABASE / NATIVE_ACCEPTANCE_PASSED
      production catalog / full HTTP paths / full ACL matrix remain unverified

    production apply:
      NOT_AUTHORIZED / NOT_PERFORMED

前回のPGlite補助確認17 PASSとcaller未切替FAIL／DB未確保NONCREDITは履歴として保持する。9/30のnative試験では21列・security_invoker bridge、旧piecesの定義/options保持、合成generated行読取り、published_at欠落時の拒否とbridge不存在、rollbackを確認した。最初のsandbox内socket接続失敗はNONCREDIT、実行可能な隔離環境で同じ凍結試験を通した。6readerは`astor_worker.py`、`api_piece_runtime.py`、`emlis_ai_readers.py`、`piece_generated_metrics.py`、`piece_generation_store.py`、`piece_public_read_store.py`。旧COCOLON_PIECES overrideを外し、既存MYMODELのoverride優先順を保持し、既定／空文字fallbackだけ専用read viewへ変更。query・write・認証・公開interfaceは不変。既存SQL・requirements・凍結test・historical caller preimagesは不変更。最新の反映commitと全文照合は[API Draft PR #3](https://github.com/MassyuRed/mashos-api/pull/3)の要約へ戻る。

file-only B2-Aのこの技術受入れは成立した。API反映commitは`1a215c511858a574bf76b15d0ed20ddce984744b`。凍結受入れの識別値を保つため、API migration README／manifestの『native pending』状態文は9/27候補時点の履歴として不変更。この現在地記述がその状態文を更新するものであり、SQL・catalog baseline・caller preimagesを書き換えるものではない。新Pieceの保存preview発行・HTTP／RN・native renderer／実機の残件は§8・§20へ戻り、B2-B／live applyへ自動進行しない。本map・入口・manifestを同じ資料更新単位で同期する。EmlisAIの同日HR文章修正は別の責務であり、この橋渡し試験の商品creditに含めない。

## 5. Product and design owners

| Role | Path | Lifecycle |
|---|---|---|
| Piece workstream entry | Cocolon_Piece/00_read_first.md | CURRENT_PRODUCT_OWNER |
| Piece machine routing | Cocolon_Piece/manifest.json | CURRENT_PRODUCT_OWNER |
| current old-route inventory | Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Contract_Inventory_20260807.md | CURRENT_REFERENCE |
| current owner map | Cocolon_Piece/pce0_current_contract_pin/Piece_Current_Owner_Map_20260807.md | CURRENT_REFERENCE |
| future design PCE1–PCE8 | Cocolon_Piece/pce1_identity_clean_cutover/ through pce8_design_freeze_work_packages/ | DESIGNED_NOT_IMPLEMENTED |
| implementation packet index | Cocolon_Piece/pce8_design_freeze_work_packages/Piece_Implementation_WorkPackage_Index_20260808.md | DESIGNED_NOT_IMPLEMENTED |
| historical premise | Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md | HISTORICAL_REFERENCE |
| older Piece current-state file | Cocolon_前提資料/15_cocolon_piece_workstream_current_state.md | SUPERSEDED_REFERENCE |

15_cocolon_piece_workstream_current_state.mdはPCE0 stateが古いため、current entryに使用しない。

## 6. Protected invariants

### Source and meaning

- sourceはowner-authenticated saved_input_id + version／stage snapshot exact1。
- normal／pre-questionはoriginalのみ。refinedだけoriginal + supplementalを別role／別commitmentで束ねる。
- Emlis visible body、Emlis internal body、Analysis inference／routeはPiece text source exact0。
- subject、stance、object、relation、negation、uncertainty、time、condition、must-keepを変形後も保持する。
- sourceにない出来事、意志、診断、性格、原因、未来、助言を追加しない。

### Artifact identity

- canonical visible bodyはpiece_text。
- piece_text_hashは空白／改行を含むexact UTF-8 bytesから作る。
- piece_contract_version、visual_recipe_hash、template_version、export_contract_version、renderer_versionを固定する。
- preview text = saved record text = card body = renderer input = export／re-export visible body。
- 保存後のtext、format、recipeのin-place mutationは0。変更はnew record。
- image binaryはderived exportでありrecord／feed source-of-truthは0。
- layout fitまたはsafetyが成立しない場合はUNAVAILABLE、record／quota effectは0。

### Lifecycle, privacy, and access

- record lifecycleとvisibilityを混同しない。
- preview quota 0、初回record確定だけquota 1、visibility toggle／same-record re-exportはquota 0。
- privateはowner-only。owner historyとexport／re-exportは可能、Nexus／notificationは0。
- publicは全世界公開を意味せず、既存access policyで許可された他者だけが読める。
- policy外readはRED。
- external image shareはCocolon内部visibilityとは別境界。外部copyを回収できると主張しない。
- publicからprivateへ戻す時は内部feed／cacheをsource deny firstで除去する。
- deleteはCocolon内conceal／purge。外部保存／SNS copyは回収不能。

### Clean cutover

V2 activation時:

- Q&A active／selectable format 0
- legacy compatibility read adapter 0
- dual-run／coexistence renderer 0
- old preview／generation／API／RN／Nexus entry到達可能性0
- Nexus renderer exact1
- 初回V2 activation前に、旧Q&A reachability 0、明示UNAVAILABLE、quota 0、single ownerを満たすpre-admitted V2 rollback targetを別Mash判断で固定する。なければ`NO_SAFE_PIECE_V1C_FIRST_CUTOVER_STOP`
- 以後のrollbackはdeploy / git revertでlast admitted single-owner V2 versionへ戻し、old Q&Aを復活させない。generic runtime safe-disableはpublic behavior / owner exact1を別承認するまで未採用

shared tableのnon-Piece row／consumerは、exact Piece predicateとwriter／reader dependency mapなしに破壊しない。

## 7. Product quality conditions

1. Source fidelity: must-keep、relation、negation、uncertainty corruption 0。
2. Standalone comprehensibility: 画像だけで誰の何が伝わるか読める。
3. Authorship integrity: user-owned meaningであり、Emlis／Analysis voice 0。
4. Public safety without meaning erasure: unsafe material 0、generic filler 0。
5. Format fitness: semantic shapeからshort_essay／quote／declarationを選ぶ。
6. Visual readability: font、contrast、余白、clip／ellipsis 0、actual device確認。
7. Artifact identity: preview／save／export mismatch 0、version再現性。
8. User value: 保存／共有したい、他者が誤解しない、商品として成立する。Human Product Read owner。

## 8. Current gaps

現在の未完了は§28.3へ集約する。以下は9/30時点の残件であり、後続のB2-B／B3／B4／B5永続化／B6保存接続が未実装という意味には使用しない。

1. user-visible routeはold Q&Aのまま。
2. 保存原入力・保存状態から本文／recipeの内部組立と画像設定だけの変更を§20まで実装。本文に表れていない選択感情、refined補足、保存済みpreview発行、HTTP／RNは未接続。
3. canonical recipe／実測layout／Linux開発PNGは§14・16〜20で実行済み。製品native renderer／export receipt／端末保存・共有は未完了。
4. B02-Aは§4.3のとおり既存5ファイル＋6reader切替、native凍結試験1 PASSのfile-only技術受入れまで成立。live catalog／全HTTP読取／権限の全行列は未確認。
5. B02-Aの本map・Piece current entry・manifestは同じ資料更新単位で同期。保存preview・新API／RN・native renderer／実機・商品受入れは未完了であり、内部bridge成立から商品合格へ昇格しない。
6. CMEE Piece adapterとB5-B内部組立のdisabled候補はMashの継続指示で§20まで接続した。runtime activationは未承認・未実施であり、候補実装と混同しない。

CMEE Piece detailed design candidate:

[CMEE V1-C — Piece Semantic Visual Artifact 詳細設計](../designs/cmee/v1/03_piece_v1c_detailed_design.md)

このpointerはPiece V2 activation、old Q&A cutover、API／DB／RN／Nexus／renderer変更を承認しない。

## 9. History pointers

- PCE0 current inventory and owner map
- PCE1–PCE8 canonical design folders
- pce8_design_freeze_work_packages/ のimplementation index
- Cocolon_前提資料/15L_cocolon_piece_workstream_pce9a_b01_closure_20260808.md
- Git history under Cocolon_Piece/

phaseごとの新しいcurrent mapを増やさず、このfileをreplace-currentで更新する。

## 10. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- source identity／saved input handoff
- canonical piece_text／hash／visual recipe
- active format／renderer／RN／API／DB owner
- preview／record／visibility／quota／export lifecycle
- Q&A clean cutover state
- Piece V2 phase state
- CMEE connectionまたはold route retirement
- Piece／Emlis／Analysis source boundary

内部logicのみで構造が不変ならSTRUCTURE_MAP_DELTA_NONEと理由を記す。

## 11. 初期mapのverified refs（履歴）

    Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

    mashos-api Draft PR #2
      958c1b53f5b5894691e0b10e2d991fb8236d9f6f
      Piece paths changed: 0

次回はfresh refと実fileを再確認する。

## 12. 2026-09-21 — B8/B9開発候補と実出力

MashはProでPieceの独立部分を前倒しし、既存B8/B9に沿って「入力から本文、本文から欠けない画像」へ進めることを明示承認した。Emlisの通常文章修正は一時停止し、未適用候補と既存結果を保持する。これは実DB、公開、有効化、商品仕様削減、新native依存の包括承認ではない。既存の9/23・9/26判断点と10/10内容期限を自動延期しない。

API PR #3の実装：`b72161434086685cb13c86290a01858169d1dbcc`。親は`ebd008cad93d6f9b8b4270e28f4370e4da54551d`。新規7ファイルのみで、既存商品コード・テスト・Emlis・CMEE入口は変更していない。

| 追加path（mashos-api） | 現在の責務・状態 |
|---|---|
| `ai/services/ai_inference/piece_v2_content_policy.py` | 既存content envelopeと選択境界、既存検出器利用。完全な公開安全性判定ではない。 |
| `ai/services/ai_inference/piece_v2_generation.py` | 本人が明示した一人称の焦点文と隣接する完結文の限定整形。OFFLINE_NOT_ACCEPTED。 |
| `ai/services/ai_inference/piece_v2_visual.py` | 既存テーマ・比率・文字サイズ・版を維持したrecipe生成と照合。 |
| `ai/services/ai_inference/piece_v2_layout.py` | 実rendererの文字幅・字形境界と書記素分割を受ける純粋layout。禁則、行長調整、本文非削除。 |
| `ai/tests/piece_v2/test_b08_piece_v2_generation.py` | 公開合成入力42検査。限定本文・否定・留保・形式・source境界。 |
| `ai/tests/piece_v2/test_b09_piece_v2_visual.py` | 合成metrics34検査。実機の字形測定結果とは区別する。 |
| `scripts/piece_v2_preview_probe.py` | 開発hostの既存Pillow等で実測・描画する試作。製品のbackend/native export ownerではない。 |

既存B1検査1件と新規76件は固定Pro Python3.12.13／pytest8.4.1で全77件PASS。元B1、利用した既存contractとformatterは現行GitHub blobと一致する。一式は旧runtime snapshotを含むため、全repositoryの現行checkout・全体回帰が成立したとはしない。初期の新規検査fixture不備と途中試行は非公開原物へ保持した。

開発hostでは合成4入力の本文を通して4:5／9:16の計8 PNGを出力し、本文の完全再構成と実描画の字形範囲を照合、画像を目視確認した。表示だけの模範文ではなくコード出力であるが、8件の商品合格やnative実装完了ではない。Linuxのfont/metricsをiOS/Androidの証明へ転用しない。依存追加・font配布は0。

**未完了：** 本文は明示一人称の限定構文だけで、汎用文章生成ではない。CMEEのPiece consumer、意味planからの文章化、B5の認証済み保存source取得、refined補足、共有向け意味保持変換、実アプリpreview／保存／履歴／native画像保存・共有は未接続。B8/B9完了・商品PASS・全体進捗増へ換算しない。次は個別の語句を追加し続けるのでなく、既存CMEEの意味・Piece intentから本文へ接続する未完了を扱い、今回のrecipe/layoutをその同じ本文に使用する。

RN_FIRST／device-gatedの画像owner判断を維持し、開発用PNGスクリプトを製品rendererへ昇格しない。実機依存や商品契約変更が必要になった箇所だけ、具体的差分を示して別判断とする。Draft／default OFF、merge・deploy・実DB・実機・実課金・外部生成AIなし。非公開の入力・実本文・原物識別子は公開記録へ転記しない。

## 13. 2026-09-21 — 中断後の継続：共有meaning blockによる限定段落編成

API PR #3の実装は `d27b4fe5310c95c463b6ddd2beb336d7f6cb0ccc`、親は `a4ec35dabcabf4de3f80f4cc88f3a5bb3f91ec54`。中断時点で実装4ファイルの反映は済んでおり、再開時のfresh HEADも同じだった。再実装せず、この実装を復元・照合して検証と本mapの同期を継続した。親の連絡先境界修正と時刻に依存しない開発PNG出力も保持する。

| path（mashos-api） | 責務・接点 |
|---|---|
| `ai/services/ai_inference/piece_v2_expression.py`（新規） | 既存 `emlis_ai_input_meaning_block_service.build_input_meaning_blocks` のsource-order blockを参照し、独立した末尾の明示一人称の意向と、それ以前の文を二段落へ編成する限定処理。共有側のsummary・推測relation・重複除去結果を本文にしない。 |
| `ai/services/ai_inference/piece_v2_generation.py`（変更） | 従来の焦点構文を維持し、対象外の場合に上記の限定段落編成を呼ぶ。形式・プラン・source owner/stage・本文hashの既存境界を通して既存B9へ渡す。 |
| `ai/tests/piece_v2/test_b08_piece_v2_expression.py`（新規） | 32の公開合成検査。全context保持、否定・留保・条件、unsupportedな参照依存、形式・プラン・source境界を検査する。 |
| `scripts/piece_v2_preview_probe.py`（変更） | 従来4入力を保持し、新しい段落編成の合成4入力を追加する。描画処理・依存・font配布・製品rendererの責務は変えない。 |

既存meaning block serviceと `emlis_ai_types.py` は無変更。`InputMeaningBlock` のcompatibility roleと順番を用いた限定接続であり、CMEEの `SourceBoundMeaningGraph`／`ArtifactPlan`／Piece consumerの本接続ではない。末尾以外の意向や解決していない照応を一般に扱えるとはしない。入力の文を削らず、文内の条件・否定・時点を保持して段落を編成する。

再開後の実行結果：固定Python3.12.13／pytest8.4.1／46依存と既存OSネットワーク拒否を使用し、対象5検査ファイルは **112 PASS／0 FAIL／0 ERROR／0 SKIP**。既存80検査の本文は無変更、新規32検査を含む。B02 DB検査・全API・Emlis全回帰を含めた件数ではない。

同じ開発font/metricsで合成8入力から16 PNGを実出力した。全8本文と画像を確認し、各画像の本文ブロック完全再構成と実描画の字形領域内収容を検査した。従来4入力の8画像は、保存済み親版と本文・recipe・layout・復号画素・PNG bytesが全件一致した。新しい4入力の8画像は限定段落編成から生成したもので、nativeの実機合格ではない。

**残件：** CMEEの意味graph／Piece intent／ArtifactPlanからの本文生成、共有向け意味保持変換、B5の認証済み保存入力取得、refined補足、RN preview／保存／履歴／native画像保存・共有。限定的な段落の並べ替えを汎用文章生成やB8/B9全体完了へ換算しない。次の主対象はCMEEから本文への未接続であり、末尾の言い回しや単語条件を増やすループにしない。

`STRUCTURE_MAP_DELTA_UPDATED`：上記の新しいPiece段落編成ownerと共有meaning blockへの参照を本mapへ追加した。既存全体図・RN/API/保存/Nexusの所有者は変更しない。Emlis文面修正・未適用候補・既存失敗は今回変更しない。Draft／NOT_CLEAR／default OFF、全体45%・商品0/3、9/23・9/26・10/10の判断日を維持する。merge・Ready・deploy・実DB・実機・実課金・新native依存・外部生成AIは実施していない。

## 14. 2026-09-21 — CMEE Piece consumerからcanonical本文・既存B9への接続

API PR #3の実装は `a07cdc11e30fd48f9a8d4495c868f17f7addc5fe`、親は `d27b4fe5310c95c463b6ddd2beb336d7f6cb0ccc`。変更は下記6ファイルに限定した。GitHubへ同一commitで反映し、PR branchから6ファイルを再取得した際のblob SHAが検証済みローカル全文のGit blob SHAと全件一致した。§12・§13は各時点の履歴であり、現在のdisabled候補の接続先は本節を優先する。

| path（mashos-api） | 現在の責務・接点 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py`（新規） | Piece original snapshotを既存CMEEのSourceEnvelope／EvidenceRef／GroundedMeaningGraphへ束ねる。原文の全完結文・重複・scalar/UTF-8範囲と保存入力ID・版・owner照合を保持する。共有meaning blockは暫定roleだけに利用し、summary・推測relationを本文にしない。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_v1c.py`（新規） | Piece専用request／intent／ArtifactPlan／artifact／outcome。source graphから本文を生成し、明示された人名と関係の対応だけを共有向けに抽象化する。本文・block・hash・形式は既存B8契約へ返す。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py`（変更） | 型付きPiece requestをPiece consumerへdispatch。既存Emlis request、thread、元本文生成、更新checkpointの処理は保持する。 |
| `ai/services/ai_inference/piece_v2_generation.py`（変更） | 既存B8の呼出形とsnapshot／文法ownerを維持し、本文生成は実CMEE呼出とPiece artifactの取得へ置換。旧段落compilerを包んで返す経路ではない。 |
| `ai/tests/piece_v2/test_b08_cmee_piece_consumer.py`（新規） | 34の合成検査。実CMEE入口、旧author・Emlis本文を呼ばないこと、source/planの対応、限定的な人名抽象化、否定・条件・後続留保、同じ本文の既存B9渡しを検査する。 |
| `scripts/piece_v2_preview_probe.py`（変更） | 旧8入力を保持し、単独・冒頭・途中の意向と明示人名関係の6合成入力を追加。既存描画処理・依存・fontを変えず、接続済み範囲と非完成の範囲をreportへ分ける。 |

### 14.1 今回つながった経路と本文の差

    disabled B8 generate_piece_candidate
      -> MeaningExperienceEngine.generate(PieceGenerationRequest)
      -> Piece original SourceEnvelope + existing GroundedMeaningGraph
      -> PieceArtifactIntent / PieceArtifactPlan
      -> source-bound Piece author + explicit-role publicization
      -> PieceArtifact / canonical content_payload / piece_text / hash
      -> existing B9 recipe / measured layout / development PNG probe

Emlisのsource adapterやEmlis artifactを通してから本文を取り出す構造ではない。旧 `compile_piece_expression_plan` を呼ばなくても生成することを検査した。旧末尾意向経路のほか、認めた単独・冒頭・途中の一人称意向を扱い、後続の未決定・留保を意向と同じ読み取りgroupへ保持する。宣言形式へ昇格させるために留保を落とさない。

共有向け変換は、原文に明示された「関係の人名さん」と、その対応が一意な同名参照の限定範囲である。原文の関係語を残し、人名を外す。誰との関係かを推測しない。同じ関係に別人がいる場合、同名の関係が衝突する場合、名前自体が話題の対象であると検出した場合は拒否する。過去の否定、条件付きの意向、現在の未決定を保持した実本文を確認した。

### 14.2 実行・読取範囲

固定portable Python3.12.13／pytest8.4.1／既存46依存、既存OSネットワーク拒否で、対象6検査ファイルは **146 PASS／0 FAIL／0 ERROR／0 SKIP**。旧5ファイル・112検査のbytesは変更していない。追加34検査を含む。既存Pydantic deprecation warningが1件ある。途中の検査では既存B01 loaderのexception class再読込との不一致を検出し、既存content ownerと同じValueError境界へ修正した後に全件成功した。

14の合成入力を固定Pythonと開発PNG hostの両方で生成し、canonical candidate全体が14/14一致した。開発hostでは4:5／9:16の28 PNGを生成。全原文・全本文を読み、28画像を目視確認し、本文block完全再構成と実描画字形の収容を確認した。旧8入力の16件は、保存済み親版と全record・recipe・layout・復号画素・PNG bytesが一致した。新規6入力についても原文にない出来事・気持ち・原因・助言を付加していないことと、限定変換の実本文を読んだ。

実行した検査は `ai/tests/piece_v2/` の `test_b01_piece_v2_contract_red.py`、`test_b08_piece_v2_generation.py`、`test_b08_piece_v2_expression.py`、`test_b08_source_contact_boundary.py`、`test_b09_piece_v2_visual.py`、`test_b08_cmee_piece_consumer.py`。既存Actions artifact `10381446286` の固定runtimeを継承した。runtime元snapshot全体をcurrent checkoutと呼ばず、現行Piece経路と無変更の共有依存を照合した対象検証である。B02 DB検査・全API・Emlis全文回帰・実機検証の成功数へ足さない。Emlis入口のdispatch保持検査もEmlis商品品質の全回帰を代替しない。

### 14.3 完成扱いにしない範囲と次の接続

**CMEEのPiece入口・source graph・専用plan・本文結果を既存B9へつなぐdisabledコード経路は成立したが、汎用の意味理解／文章生成とB8/B9全体は未完了。** 今回のgraphは原文の完結文単位とSOURCE_ORDERであり、述語・項・因果・照応・時点作用域を一般に解析する完成版ではない。段落計画も既存の限定文法と暫定roleを用いる。これを完全なSourceBoundMeaningGraph推論や、自然な文章の汎用生成へ換算しない。人名形式・関係語の適用範囲も限定され、あらゆる個人情報を処理できる公開安全性の完成版ではない。

B5の認証済み保存入力取得、original/refined補足、実アプリpreview・保存・履歴・native画像書出し／共有は未接続。snapshotのowner照合は認証ではない。Linux開発PNGを製品rendererへ昇格せず、RN_FIRST／device-gatedを維持する。次はこの接続済みconsumer上で未解釈の意味と共有向け変換を進め、個別文末条件の追加や別の独立試作を本接続の代用にしない。

`STRUCTURE_MAP_DELTA_UPDATED`。既存のRN／API公開契約／DB／保存／Nexus ownerは変更しない。Emlis通常文面・未適用候補・既存失敗は別作業のまま。Draft／NOT_CLEAR／default OFF、全体45%・商品0/3、9/23・9/26・10/10判断日を維持する。merge・Ready・deploy・実DB・実機・実課金・新native依存・外部生成AIは実施していない。公開記録へ利用者の私的入力・出力・識別子、runtimeやfontを追加しない。


## 15. 2026-09-26 — B5-A保存原入力の取得・版照合（ローカル検証済み／GitHub未反映）

本節は前回のローカル検証・未反映時点の履歴。続くGitHub反映と両記述欄の接続は§16を参照する。

### 15.1 作業の位置づけと差分

9/26週末議事録§5.4・§5.9で採用された「保存原入力→既存生成→プレビュー」を次の主対象とし、その最初の取得部分を実装した。基準はAPI PR #3 `5887cecd852a475f84d51b10d2f6a73aea46d5b5`とCocolon PR #30 `38a2ae8609dac4407e57da9ab2a10886c9338a5d`。前者の既存Piece source／writer／B9と既存検査は無変更である。

本節と下記2ファイルは `LOCAL_TESTED_UNPUBLISHED_CANDIDATE`。本sessionで公開されたGitHub操作はread-onlyで、PRへの追加commitは0。保存された変更差分を再開に使い、反映済みの§14や前回の修正と混同しない。反映を行う実行ではfresh HEAD・差分を照合し、同じ実装と本mapを反映・再取得した事実に合わせて本節の公開状態を更新する。

| repository / path | 今回の責務・接点 |
|---|---|
| mashos-api: `ai/services/ai_inference/piece_v2_source_adapter.py`（新規） | 既存bearer verifierで得たownerを、既存 `EmlisThreadStore.read` / `emlis_thread_read`へ渡す。保存原入力の全欄を分離して保持し、既存input-bundleのidentityと、空白・nullを含む原保存値のidentityを区別する。再使用前の再認証・再取得・版照合を行う。 |
| mashos-api: `ai/tests/piece_v2/test_b05a_piece_v2_source_adapter.py`（新規） | 原入力・認証・版・失敗時非提供の64検査。うち12件は既存Q2 PostgreSQL WASM bridgeでrepository上の既存SQLを実行する。 |
| Cocolon: `Cocolon_前提資料/current_structure/02_piece_current_structure.md`（本file） | 反映済み経路と、この未反映取得候補、次の未接続箇所を分離する。新しいcurrent mapは作らない。 |

GPT-6 Astra Pro / CHAT_PRO_OK / Rule18§0・§11.3 / Pro single execution owner。現行のPiece限定分担内の作業であり、Emlisや共有契約の実装変更を含めない。

### 15.2 取得で保持するものと、生成へ渡していないもの

    authorization header
      -> existing _require_user_id / verified owner
      -> existing owner-scoped saved-original RPC
      -> live saved original + current retention / tier
      -> immutable PieceSavedOriginal (private)
      -> revalidation before later operation (same input, current owner/access, exact revision)

取得する原保存値は、`id`、`created_at`、`memo`、`memo_action`、`category`、`emotions`、`emotion_details`。考え・行動・選択感情・強度・分類を一つの文章へ潰さず、元のnullや空白も原保存snapshotへ保持する。正規化用copyは既存 `emlis_ai_current_input_bundle` を使い、保存時刻の正規化は現行保存入力request ownerと一致させる。input-bundle commitmentは既存NLSのNFC／LF規則を使用し、Pieceの本文hashへすり替えない。原保存値の別commitmentで、正規化後に同じでも原欄が編集された場合を検出する。

RPCが返すthread／eventsの本文、Emlisの観測文、回答・補足は原入力へ入れない。取得に成功しただけでnormal／pre-question／refined stageやterminal eligibilityを発行しない。Emlis threadがまだない入力も原入力としてreadできることは、Piece生成を許可したこととは別である。

別owner・削除済み・保存期間外はsourceとして返さない。入力の欄・記録時刻・tierが変われば、以前の取得物をそのまま再利用しない。通信・認証・保存読取の失敗ではraw診断・token・本文を例外へ転載せず、既存Piece error codeだけを返す。`PieceSavedOriginal`はprivate内部型でありpublic DTOではない。今の再取得はその瞬間の確認で、後続のpreview／saveまでを跨ぐtransactionや永続的な閲覧権限ではない。

### 15.3 実行した検証と限界

同一の最終追加test bytesを修正前後に実行し、未実装時64 FAILから実装後64 PASSを確認した。既存69ファイル／5,090件は前後とも4,957 PASS／133 FAIL。統合70ファイル／5,154件は5,021 PASS／133 FAIL、ERROR／SKIP0。既存全検査のbytes、status、失敗本文は不変（実行時間を比較対象から外し、tree絶対pathとPython object addressだけ正規化）。133件を解消済み・無害と判定したものではない。

固定runtimeはPython3.12.13／pytest8.4.1／既存46依存・OSネットワーク拒否。runtime元の旧snapshotと、GitHub identityを照合した現在の関連overlayによる対象検証であり、全current repository／全Emlis／CIの合格ではない。既存の原入力read SQLをPGlite0.5.8で実行し、owner／削除／retention／変更／DB role拒否を検証した。bearer構文の実処理は使い、remote token lookupは合成値へ差し替えている。実Supabase認証や実DBの原入力取得は実行していない。

途中で現行保存入力requestとの時刻・NFC／LF hash一致を追加検証し、不一致のREDを保存して修正した。初期試行・中断ログも保持し、最終XMLや成功結果へ置き換えて消していない。前回保存の2,323要求と開発PNGは今回再実行しておらず、新しいPiece本文・画像・画面出力を得たとはしない。

### 15.4 次の未接続箇所と環境

本候補はB5-Aの原入力取得sliceであって、B5-A／PCE8-U01全体完了ではない。stage snapshot、Emlis terminal control identity、許可されたsupplemental sourceとのhandoffは未成立として保持する。現在のCMEE Piece入口は単一 `original_text` を受けるため、次は原入力のthought／action／emotion等の区別を失わない投影と既存source／planへの接続を扱う。memoだけを渡して全原入力が接続されたとしない。B5-B preview API、既存RN画面、保存・履歴・native画像保存／共有は続く未完了である。既存の必要承認を超える契約・公開境界・実環境操作は自動実行しない。

接続先のpublic schemaのtable一覧を読み取り専用で確認したところ、既存Q2 readが参照する `emlis_input_threads` と `emlis_thread_events` は返された一覧になかった。RPCそのものの存在・定義は今回の利用可能操作では確認していない。対象が承認済み開発環境であることも未確定であり、実接続確認の前提は未充足。migration・table作成・実ユーザー入力read・DB更新は行っていない。このmetadata確認を、実認証・保存原入力→プレビューの成功へ換算しない。

`STRUCTURE_MAP_DELTA_UPDATED_LOCAL_ONLY`。production route登録、旧Q&A到達性、API／DB／RN／quota／record／visibility／renderer／Emlis／Analysis ownerは無変更。Draft／NOT_CLEAR／default OFF、商品受入未成立を維持する。GitHub反映、merge、Ready、deploy、有効化、新依存、実課金、実機、外部生成AIは今回行っていない。


## 16. 2026-09-26 — 保存原入力の両記述欄から既存CMEEへの開発用接続

最新週末議事録の§5.4・§5.9で採用された保存原入力→生成→プレビューのうち、生成前の欄別接続を進めた。前回の取得sliceを作り直さず、API PR #3へ下記6ファイルを同一commitで反映した。親 `5887cecd852a475f84d51b10d2f6a73aea46d5b5`、実装 `dc6e9900f5fb8a7002eb88322c8e776bbed7647a`、tree `0daeb040d71a1d0344c12d073ee57b00507a9f97`。全6作成blobと反映後のbranch読取が、検証済み全文のGit blob identityと一致した。Cocolon側は本mapの同期だけで、画面・API登録は変更しない。

| path（mashos-api） | 責務・変更 |
|---|---|
| `ai/services/ai_inference/piece_v2_source_adapter.py` | 前回の本人限定原入力取得・再照合を継承。両記述欄のsnapshot投影と、取得→既存CMEE→再照合の開発用呼出しを追加。公開routeやstage権限を発行しない。 |
| `ai/tests/piece_v2/test_b05a_piece_v2_source_adapter.py` | 前回の64検査をbyte不変で反映。既存Q2 SQLによる12検査を含む。 |
| `ai/services/ai_inference/piece_v2_generation.py` | 既存private snapshotにoptionalな原保存JSONを保持。旧単一text呼出しのdefaultは不変。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py` | 両記述欄を別出典へ対応付け、元欄に対するscalar座標とenvelope内UTF-8座標を保持。原保存値全体をidentityへbindし、選択感情の未対応を明示する。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_v1c.py` | 欄別出典をplan／realizationで照合。考え→行動の欄順と欄間段落を保持し、行動欄の意向の前置きや欄を跨ぐ主題省略を行わない。 |
| `ai/tests/piece_v2/test_b05a_piece_saved_original_generation.py` | 今回の44検査。実CMEE／B9、欄・版・文字座標・欠落・再照合・未対応拒否、既存SQLから生成までの4検査を含む。 |

### 16.1 成立した接続と範囲

    development caller / explicit offline source_stage
      -> existing bearer verifier and owner-scoped original read
      -> immutable complete saved original
      -> memo and memo_action field projection
      -> existing CMEE Piece source / intent / ArtifactPlan / canonical body
      -> owner / liveness / retention / exact revision / tier revalidation
      -> development candidate; existing B9 can consume that same body

原文にない接続詞・気持ち・因果・日付・決意を追加しない。欄順を出来事の時系列や因果と同一視しない。片方が空欄なら実際に書かれた側の出典を使い、途中で終わった欄を別欄につないで完結した文章に見せない。両欄の重複も、出典を失わせるために消さない。元欄の空白・null・分類・記録時刻をprivate recordへ保ち、分類や記録日時を勝手な本文説明へ変換しない。

**選択された感情と強度の意味処理は未接続。** `emotions` または `emotion_details` に内容がある新saved-field経路は、`saved_emotion_meaning_not_yet_supported` でUNAVAILABLEにする。考え欄だけで成功にしたり、感情labelから意志を捏造したりしない。これは不足の明示であり、当該入力の商品対応を完成したという意味ではない。

**source_stageは開発呼出側が明示した値であり、実際のEmlis terminal／stageの検証ではない。** normal／pre-questionの候補だけを扱い、refinedと補足は未接続。保存IDが読めたことをterminal success、生成適格、公開previewの許可へ読み替えない。後続のB5-A handoff／B5-Bが既存契約に沿って解決する必要がある。

### 16.2 実行・出力確認

前回分を含む既存70ファイル／5,154件は前後とも **5,021 PASS／133 FAIL**。今回の同一最終44検査は **44 FAIL→44 PASS**。統合71ファイル／5,198件は **5,065 PASS／133 FAIL／ERROR0／SKIP0**。旧70ファイルのbytes、全5,154件の成否と失敗本文は不変（tree絶対pathとPython object addressだけ正規化）。旧期待値更新、除外、xfail、閾値変更は0。全成功や133件の解消とはしない。

今回の44件中4件は、既存Q2 SQL／PGliteを用いた保存原入力read→実CMEE→再照合を実行した。前回のSQL12件も同じ統合検査へ含む。remote token照合は模擬、DBは既存の検証用WASMであり、実Supabase・本番・端末ではない。Emlis thread／eventの新規保存が0であることも検証した。

固定Python3.12.13／pytest8.4.1／既存46依存／OSネットワーク拒否を継承し、元archiveと18,548 checksumを再照合した。旧runtime snapshot＋現在の関連overlayの対象検証で、全repo／全Emlis／GitHub CIの合格を主張しない。初期40検査の結果、44検査初回実行の時間切れ、新規検査の冗長な原文一致assert修正を別記録へ保持し、最終44件のRED／GREENへ混ぜない。

新規検査で記録した46回のengine呼出し（同一recordを除く29件）の原入力と実本文・拒否結果を読んだ。内部で本文生成後に再照合で返却を拒否した試行も含み、46件を最終返却成功数にしない。旧2,323要求の再実行は行わず、無変更の既存source／test結果から継承する。文章全般の自然さ、重複解消、汎用理解の合格ではない。

実engine出力を固定した4候補から、無変更の開発renderer／B9で4:5と9:16の8 PNGを作成。本文blockの完全再構成、実測字形の収容、8画像の目視を確認した。開発hostで別の生成成功を捏造せず、固定Pythonの実候補をrenderer入力として使用した。font配布・新依存・native renderer昇格は0。商品受入れ・実アプリpreview／save／shareの合格ではない。

### 16.3 次の未完了と保持境界

残る直接接続は、選択感情／強度の意味処理と、実保存状態にboundされたstage／terminal control handoff、それを用いるpreview API／RNである。取得と本接続は再実装しない。refined補足、保存・履歴・同一本文再表示、native画像保存・共有は既存必須残件として維持する。公開API／DB／共有契約や実環境変更が必要な箇所は別の承認境界を守る。

§15.4の接続先DB metadataは前回確認の履歴であり、今回再照会していない。参照テーブル不足、RPC定義・開発環境の未確認を解消済みにしない。実Supabase認証・実入力read・migration・実機は行っていない。

`STRUCTURE_MAP_DELTA_UPDATED`。GitHubのコード反映と、このmap更新は実施するが、Draft／NOT_CLEAR／default OFF／正式商品0/3を維持する。全体48%は最新議事録の管理評価を継承し、今回の検査件数や文書更新で加点しない。Emlis／Analysis／共有契約／旧検査／公開API／RN／DB／record／quota／visibility／native renderer／依存／merge／Ready／deploy／有効化は変更0。automatic_progression=false。


## 17. 2026-09-26 — 保存状態からのPiece本文と、明示された選択感情の対応付け

9/26議事録§5.4・§5.9の保存原入力→生成→プレビューを継続した。再開時、API PR #3は添付checkpointの `dc6e990` から `33e1a8e0c8d7cb27aa78a53d31894a3d6865c793` へ進んでいた。後者の保存状態handoffと追加61検査は継承し、重複実装せず再取得して照合した。本単位の新しい実装は `ef60a4f4a2551bd5d26c21aacc5698f5dd338b86`、親 `33e1a8e0c8d7cb27aa78a53d31894a3d6865c793`、tree `d74f583dc831e7fe9f767f2d354b9648a95f71cf`。GPT-6 Astra Pro／CHAT_PRO_OK／Rule18§0・§11.3、Pro単一実行担当。

### 17.1 既存経路と今回の差分

| path（mashos-api） | 扱いと責務 |
|---|---|
| `ai/services/ai_inference/piece_v2_source_adapter.py` | 先行33e1a8eを無変更で継承。保存済みINITIAL観測・同じ試行の完了・原入力版・現行利用条件から、回答前のoriginal-only normal／pre-questionを判定し、本文生成後に再照合する。呼出側のstageやeligible指定を権限にしない。 |
| `ai/tests/piece_v2/test_b05a_piece_saved_state_handoff.py` | 先行61検査をbyte不変で継承。実SQL／Emlisで保存したpre-question・未回答skip／stopの状態判定と、未対応本文の拒否を含む。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py` | 今回変更。全原保存値を保持し、選択欄のfield／indexと、本人が書いた感情のnode／evidenceを対応付ける。既存の欄別再導出をplan／realizationまで使う。 |
| `ai/tests/piece_v2/test_b05a_piece_selected_feeling_binding.py` | 今回追加66検査。意味の一致・不一致、主体・程度・否定・過去・留保、複数選択、改変拒否、実SQL保存結果から本文までの到達と生成中の変更拒否。 |

Cocolon側は本map一つを同期する。全体地図01／01A／01B／01Cの同一blobと全377の役割行、最新議事録、対象実ファイルを確認した。System Context prepareは継承snapshotの参照不一致で完了していないため、既存規定の原典直接読取りを用いた。全current repositoryの監査やSystem Contextの完了とはしない。

### 17.2 選択感情の意味を本文へ欠落させない限定接続

    saved original + current INITIAL observation/control
      -> original-only saved-state handoff
      -> complete memo / memo_action source graph
      -> each selected feeling and specified strength bound to an explicit self proposition
      -> existing ArtifactPlan / canonical body
      -> saved source / state / access revalidation
      -> disabled candidate / unchanged B9

既存の感情集合・強度正規化をread-onlyで再利用する。対象は、本人が現在の感情を肯定形で明記した完結文と、そこに明示された程度が選択内容を覆う場合だけ。raw選択値、別欄、空白、null、版は既存snapshotに保持し、選択情報を削ってtext-only成功にしない。タグと詳細の両方がある場合、選択順も一致させる。

感情名だけから原因・意志・行動を追加しない。選択強度が未指定なら程度を補わない。既存の強度aliasを正規化してもraw値と本文は変えない。自己理解は入力modeとして保持し、感情を捏造しない。否定・過去・可能性・条件・他者・伝聞や、複数候補・不一致・本文で表現されていない感情は、当該対応付けの根拠にせずUNAVAILABLEを維持する。これは感情の汎用文章化の完成ではない。

本人の感情文そのものは、既存の原文保持処理で本文へ残す。選択欄に合わせて書き足した文章ではない。価値観・意向は既存作者が別に解釈し、感情だけで意志を作らない。本文の自然さや共有価値全般を、この対応検査だけで合格にしない。

### 17.3 実際に到達した範囲と検証

既存Q2 SQLとEmlisThreadService／CMEEを用いて検証用保存入力のINITIAL結果を作成し、その実保存結果のnormal_observation identityを既存adapterから受け取り、Pieceのcanonical本文まで通した。原入力の感情・強度と意向を保持した実本文を確認した。生成途中に選択強度を編集する対になる検査では、内部生成後でも返却前の再照合で候補を拒否した。Piece呼出しによるEmlis再生成、保存thread／event変更、record／quota消費は0。

認証サーバーへの照合は模擬、SQL実行は既存PGlite／WASM。実Supabaseの原入力取得・実認証・実API・実画面の一往復ではない。先行33e1a8eの合成controlによる本文成功だけを実保存状態からの成功へ換算せず、今回のSQL結果を分離した。

最終の同一新66検査は、変更前45 FAIL／21 PASSから、変更後66 PASS。既存71ファイル／5,198件の成否と133失敗の詳細は不変（実行時間・runtime絶対path・Python object addressのみ比較から除外）。先行の保存状態61検査も全PASS。公開するexact blobで再実行した統合73ファイル／5,325件は **5,192 PASS／133 FAIL／0 ERROR／0 SKIP**。旧検査の変更・除外・xfail・品質閾値変更は0。全件GREENではない。

途中のSQL探索で確認した既存上流の未提供・強度未指定の拒否、新規検査の引数／recipe key誤り、最初の実行起動失敗は、それぞれの原記録へ保持した。旧検査を変更して解消したものではない。公開用転記で既存commentの英語冠詞のみ2byteが変わったため、AST一致を確認したうえで、その公開exact bytesで上記統合検査を完走した。途中結果を最終分母へ足さない。

固定Python3.12.13／pytest8.4.1／既存46依存／OSネットワーク拒否、元archiveのZIP／TAR／全18,548 checksumを照合した継承runtimeを使用。現在の関連overlayを載せた対象検証であり、全repo・全Emlis・GitHub CIの合格ではない。旧2,323要求の再実行は今回行っていない。

実engineの2候補を固定入力として、無変更の開発B9 rendererで4:5／9:16の4 PNGを作成。本文block完全再構成と実測字形収容を検査し、4画像を目視確認した。開発hostの別生成成功、端末rendererの受入れ、商品合格とはしない。font／runtime本体の配布、新依存は0。

### 17.4 次の位置と保持する未完了

取得、両記述欄投影、保存状態handoff、今回の明示感情対応を作り直さない。次は採用済みの保存原入力→プレビューに向け、対応する入力をB5-Bと既存RNへ返す残差を扱う。既存の公開API／共有契約／実環境の承認境界を越える差分は、具体化して別判断とする。未対応の選択感情、許可されたrefined補足、保存・履歴・同一本文再表示・native書出し共有は引き続き必須残件である。

§15.4の接続先metadataは履歴のまま。今回の再照会・実ユーザー入力read・実DB書込み・migration・実機は0。開発環境／RPC／必要tableの未確認を、この検証用SQL成功で解消済みにしない。

`STRUCTURE_MAP_DELTA_UPDATED`。primary outcomeはTECHNICAL_CREDIT、正式商品受入れは未成立。Draft／NOT_CLEAR／default OFF／商品0/3、最新議事録の全体管理48%を継承し、今回の検査件数で加点しない。Emlis／Analysis／共有契約／旧検査／公開API／RN／実DB／record／quota／visibility／native renderer／依存／merge／Ready／deploy／有効化は変更0。automatic_progression=false。


## 18. 2026-09-26 — 自己理解の単独選択を保持した本文生成と中断後の実検証

9/26議事録§5.4・§5.9の保存原入力→生成→プレビューの継続単位。中断前のAPI実装 `be889185be019010b14ed28f68e96e5c82b71333`（親 `ef60a4f4a2551bd5d26c21aacc5698f5dd338b86`）は反映済みで、再開時に同じbranch headと対象blobを取得した。コードを二重適用せず、残っていた実engine検証、既存検査の前後比較、実本文・開発画像の確認と本map同期を完了した。GPT-6 Astra Pro／CHAT_PRO_OK／Rule18§0・§11.3、Pro単一実行担当。

### 18.1 原入力modeと本文の責務

変更した商品コードは `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py` の17行追加だけ。blobは `cd5bcc1fc9796cc7e7a8eec62bb88392944bd65f`。新規 `ai/tests/piece_v2/test_b05a_piece_self_insight_mode.py` はblob `ee8848e798c41badca67659660dedf6e9ea00793`、61単体＋7実engineの68検査である。

現行 `screens/InputScreen.js` は自己理解を単独選択し、強度UIを表示しないまま `medium` を送る。これを感情の強さや「自己理解できた」という命題へ変換しない。自己理解だけの選択と、強度未指定・空文字・現行UIのexact `medium` に限り、原保存JSONとそのidentityへ保持したまま、感情nodeを作らず既存本文生成へ進める。

混在、重複、余分なkey、別の強度や未証明のaliasは拒否する。通常感情に必要な本人記述・程度・主体・時点の照合は変更しない。既存の保存状態handoff、両記述欄の出典、planと本文の再照合も継承する。source選択を消して成功にする処理や、意味・品質条件の緩和ではない。

### 18.2 今回実行した検証と分母

中断前commit messageの「7実engine検査は未実行」は当時の事実として保持し、この再開で実行した結果を追加する。撤回済みの旧「追加56件成功」は根拠にも分母にも使用していない。

| 今回の実行集合 | 変更前 | 変更後 |
|---|---:|---:|
| 同じ新規68検査 | 54 PASS／14 FAIL | 68 PASS／0 FAIL |
| 既存5,264検査 | 5,131 PASS／133 FAIL | 5,131 PASS／133 FAIL |
| 変更後統合73ファイル／5,332検査 | — | 5,199 PASS／133 FAIL／0 ERROR／0 SKIP |

既存5,264は§16の71ファイル5,198件と§17の選択感情66件。同じ5,264件のnode ID・成否・失敗詳細に差分0。比較の正規化はbaseline/work絶対pathとPython object addressだけで、旧test bytes・期待・除外・xfail・閾値変更は0。133失敗は未解消のまま保持する。

**§17の保存状態handoff61検査は今回は再実行していない。** 先行記録を継承するだけで、今回の分母5,332へ加算しない。選択感情66検査は、実Q2 SQL／PGlite／Emlis保存状態から本文への2検査を含め全PASS。一方、新規の自己理解7実engine検査は合成した保存snapshotからの実CMEE呼出しであり、自己理解の実SQL保存状態・実認証・実アプリ往復の成功へ読み替えない。

既存Actions artifact `MassyuRed/Cocolon:10679104273` のruntimeを取得した。ZIP SHA256 `3f3d9c30ec9ec7164bc93caa09021cbe2dbce011e45cc12b7de496349df16b9d`、TAR SHA256 `80217818d8693789f7f9b1ee44f0427a477f380d2cedc8e9894f9389e9f54485`、全18,548 checksumを照合。固定Python3.12.13／pytest8.4.1／既存46依存とOSネットワーク拒否を使った。旧snapshotにGitHub同一性を確認した関連overlayを載せる対象検証であり、全current repository・全Emlis・CIの合格ではない。環境再構築・新依存追加は0。

### 18.3 本文と開発画像の実物

同じ考え・行動欄を持つ7種類の保存形式で、変更前は全て選択情報未対応、変更後は全て実engineの本文生成まで到達した。全原入力・全本文を確認し、本人の意向と後続の未決定を保持した。同じ本文を使う保存形式差の確認であり、7種類の異なる意味を扱えるという主張ではない。modeを持たない同じ記述の本文との一致、元JSON保持、出典欄、identity差、snapshot差替え拒否も実engine検査で確認した。

固定runtimeが返した候補exact1を無変更の既存B9 recipe／layout／開発描画へ渡し、4:5・9:16の2 PNGを作成。本文block完全再構成、実測字形収容、2画像の目視を確認した。hostで別の本文生成をした結果ではない。Linux開発画像はnative renderer、端末プレビュー・保存・共有、正式Product Readの合格ではない。font・runtime本体の配布は0。

### 18.4 次の位置と維持する境界

取得・欄別投影・保存状態判定・選択感情対応・今回の自己理解modeを再実装しない。次は採用済みの保存原入力→プレビューに沿って、対応入力をB5-Bと既存RNへ返す残差を扱う。公開API・共有契約・対象環境など既存承認を超える変更は別判断とする。未対応の通常感情、許可されたrefined補足、保存・履歴・同一本文再表示・native保存共有は必須残件のまま。

全体地図01／01A／01B／01Cの既知の同一blob、全ファイル地図の役割path、最新議事録、対象の実sourceを照合した。歴史的役割地図の確認を全current source監査へ換算しない。本mapだけを同期し、旧§12〜17は履歴として保持する。

`STRUCTURE_MAP_DELTA_UPDATED`。本単位は限定入力の本文提供を改善した技術結果であり、正式商品受入れではない。Draft／NOT_CLEAR／default OFF／商品0/3、全体管理48%を維持。今回の再開でAPI製品コードの追加変更は0。Emlis／Analysis／公開API／RN／実DB／record／quota／visibility／native renderer／依存／merge／Ready／deploy／有効化への変更も0。automatic_progression=false。


## 19. 2026-09-26 — 保存原入力から本文・画像設定の内部組立（前回の反映状態）

前回実装 `57df8fc3f2c331470f7b8a448579a82886e6361b` は `ai/services/ai_inference/piece_v2_preview_service.py` の新規1ファイル。初期blobは `288121d15a3e680fc9edb7dadfb3a60221ef55a4`。PCE-6のsource_refをB5-Aの保存状態handoffへ照合し、既存CMEE本文と現在tierのB9 recipeをimmutableな内部組立物へ結合、返却前に再照合する。Emlis本文やclient指定のowner／tier／本文をsourceにしない。

前回追加 `ai/tests/piece_v2/test_b05b_piece_v2_preview_api.py`（blob `b008d163205c96081dccf4cb188ea23a522babf6`）は60件のローカル検証済みだが、GitHubへの書込みがツール安全性チェックでブロックされた。未反映のまま保持し、再送・別経路による迂回・別名への置換はしていない。前回のmap案も未反映だったため、本節で実装と未反映testを分けて同期する。

前回の保存済み検証原物は既存5,332件＋追加60件の5,392件、5,259 PASS／133 FAIL／ERROR0／SKIP0。60件中2件は既存Q2 SQL／PGlite／Emlis保存状態を用い、外部認証は模擬。本文と画像設定の組立は保存済みpreviewではなく、ID・revision・expiry・idempotency・safety-ready・quota結果を発行していない。実HTTP／RNの成功ではない。

## 20. 2026-09-26 — 本文を再生成しない画像設定変更

最新議事録§5.4・§5.9の保存原入力→プレビューに必要な、PCE-6「visual-only changes may not change text/hash」の内部処理を実装した。実行担当はGPT-6 Astra Pro／CHAT_PRO_OK／Rule18§0・§11.3のPro単一owner。保存基盤を仮のin-memory storeで代替せず、実DB・migration・公開登録へ広げていない。

### 20.1 変更ファイルと接続

| path（mashos-api） | 今回の差分 |
|---|---|
| `ai/services/ai_inference/piece_v2_preview_service.py` | `prepare_visual_change`を追加。内部で保持したPreparedPiecePreviewに対し、画像設定だけを置換する。最終blob `c8751df0a0e02cc09855a6777db67dcecf0acc0e`。 |
| `ai/tests/piece_v2/test_b05b_piece_visual_change.py` | 新しい変更操作の54検査。前回未反映60件の再送・代替ではない。blob `ed953d70c086acd26d3d6bd196b7ca878991e365`。 |

テストcommit `c0487ae474ab25d062768afd77a8b9442c37dfff`、実装commit `fa82077febb1363e286eb225fd53ff50ad863bbf`。基準 `57df8fc` からの変更はこの2pathだけ。両ファイルをGitHubから再取得したblobが、検証した全文のGit blobと一致する。

    server-held prepared original
      -> copied complete visual selection
      -> original/state/access/tier revalidation
      -> existing content/recipe consistency check
      -> existing B9 recipe under unchanged authoritative tier
      -> original/state/access/tier revalidation
      -> new immutable internal preparation; exact original content retained

本文作者は呼ばない。piece_textのUTF-8 bytes、content payloadとhash、format、eligible formats、private状態は変更しない。元の内部組立物も変更しない。theme／aspect／brandingの全3selectorを受け、nullは既存B9のtier別defaultへ戻す。任意のclient本文、tier、recipeや文体変更を受け入れるHTTP APIではない。

変更前後に原入力・保存状態・アクセス・tierの不一致があれば返却を拒否する。内部hash不整合を修復したふりで成功にしない。利用プランの画像選択範囲は既存B9のまま。これは内部データの新しい組立であり、保存previewのrevision更新、同一要求再試行保証、保存・quota消費の実装ではない。

### 20.2 実検証と比較の根拠

同じ最終54検査を旧serviceに対して実行すると54 FAIL、新実装では54 PASS。新規単体fixtureの本文が既存の文字数・形式条件を満たさなかった初回52 FAIL／2 PASSも原記録へ残し、fixtureだけを修正した。商品条件や旧テストは変更していない。

統合75ファイル／5,446件は **5,313 PASS／133 FAIL／0 ERROR／0 SKIP**。うち既存74ファイル／5,392件は5,259 PASS／133 FAILで、前回の完走済み検証原物と全caseの成否・失敗詳細が一致した。比較で正規化したのは作業root pathとPython object addressだけ。旧テストbytes・期待・除外・xfail・閾値の変更は0。

今回試した変更前の既存全件再実行は時間切れで中断したため、完走した前後二実行とは報告しない。上記比較は前回の検証済み5,392件を基準とする。前回未反映60件も同じbytesでローカル統合に含み、GitHubだけでその分母を再現できるとはしない。保存状態handoff61件は今回も未実行で、分母に含めない。133失敗は未解消のまま保持する。

新54件には既存Q2 SQL／PGlite／実Emlis保存状態を使う2件を含む。Plusの保存入力から同じ本文のままテーマを変更でき、B9処理中に原入力を編集した場合は返却を拒否した。thread／eventは変更しない。外部認証は模擬で、実Supabase・端末の成功ではない。

既存artifact `10679104273` の固定Python3.12.13／pytest8.4.1／46依存／OSネットワーク拒否を再利用。TARと全18,548 checksumを照合した。旧runtime snapshot＋照合済み関連overlayの対象検証であり、全current repository・全Emlis・GitHub CIの合格ではない。

### 20.3 本文・画像と残る本経路

同じ一つの記述に対する3形式×5選択の15組と、SQL保存入力の1組について、変更前後の実本文・artifactを確認した。15種類の意味を新しく理解したという主張ではない。固定runtimeが返した4artifactをそのまま既存の開発B9描画へ渡し、変更前後の4 PNGで本文block再構成・実測字形収容・目視を確認した。本文をhostで別生成していない。native renderer／実機保存共有／正式Product Readは未完了である。

次の本経路は専用保存基盤からpreview ID／revision／expiry／同一要求再試行を成立させ、HTTP／RNへ接続する部分。既存PCE-6専用table設計とPCE-8のB2／B5を使い、旧Q&A保存の流用や仮成功はしない。migration・実DB・公開契約の既存承認境界を省略しない。今回の画像設定変更を理由に、同種の周辺機能追加を主経路へ戻る条件にしない。

Cocolon側は本mapのみ更新する。全体地図01／01A／01B／01Cの同一blobと対象の役割接点、最新議事録、current rule・対象実ファイルを照合した。historical地図の確認を全current source監査へ換算しない。§12〜18は履歴として保持する。

`STRUCTURE_MAP_DELTA_UPDATED`。今回の新規実装・54検査は反映済み、前回60検査は未反映のまま。Draft／NOT_CLEAR／default OFF／正式商品0/3／管理48%を維持。公開API／RN／実DB／migration／record／quota／visibility／native renderer／依存／Emlis／Analysis／merge／Ready／deploy／有効化は変更0。automatic_progression=false。


## 21. 2026-10-06 — 保存済みpreviewからB6保存HTTPへの接続

本節は`bee83063ce11b42de64f1c635149bbd5066ec3e5`時点の履歴。Q3履歴contextの後続差分と現在の残件は§22を優先する。

### 21.1 現在の実装と商品上の意味

MashのPiece継続指示に従い、前回の保存時プラン再検証から、保存済みpreviewを本人が同じ内容で確定する経路へ接続した。API Draft PR #3の対象は `bee83063ce11b42de64f1c635149bbd5066ec3e5`、直前は `f803956`。これまでのB2-B専用保存基盤、B3権限、B4原子的保存、B5永続化・取消、B6プラン再検証を保持した候補実装である。main／稼働API／商品完成へ昇格しない。

初回保存の順序は、Bearer本人確認、本人＋preview IDに限定した保存行の読取り、revision／hash／期限／保存状態の照合、既存source adapterによる現在の原入力・Emlis状態取得、lineage・現在プラン・形式・画像設定の再照合、service専用RPCによる保存である。クライアントから本人ID、プラン、本文、source lineage、保存判定の代用品を受け付けない。

SQLはpreviewを更新lockし、serverが取得した原入力、profile、threadをその既存順で`FOR SHARE`してcommitまで保持する。原入力の変更・削除、thread revision／観測identity／状態の変化、プラン変化、保存時点の閲覧期限を確認してからrecord・quotaを確定する。原入力／Emlis行は読取りlockであり、Pieceがこれらを書き換えたり、入力件数を増やしたりしない。

保存済み行の再送は本人確認と保存行identityの照合後、`replay_only`を内部引数として既存保存結果へ照合する。元入力削除やプラン変更を理由に同一保存結果を失わせず、古い読取り結果から初回保存へ戻ることも禁止する。RPCは一度だけ呼び、応答不明を自動再送しない。

### 21.2 現在のfile familyと今回の変更

| owner（mashos-api） | 責務・今回の境界 |
|---|---|
| `ai/services/ai_inference/api_piece_v2.py` | 既存のpreview取消に`POST /emotion/piece/save`候補を追加。認証・単一Idempotency-Key・閉じたrequest・本文を出さないエラー応答。production `app.py`へ未登録。 |
| `ai/services/ai_inference/piece_v2_save_service.py` | 新規のB6保存入口。本人の永続previewを読み、既存source adapterと形式／visual policyを照合してstoreへ渡す。本文作者、preview発行者、安全性の承認者にはしない。 |
| `ai/services/ai_inference/piece_v2_store.py` | 既存のB4/B5 RPC adapter。初回await前のrequest固定、server専用の原入力／thread expectation、再送専用指定を追加。低層B4互換呼出しをB6の保存適格判定として扱わない。 |
| `supabase/migrations/20260808_004_piece_v2_atomic_functions.sql` | 未適用M4候補を更新。原入力／profile／threadのlockと照合、保存時閲覧期限、再送から初回保存への移行禁止を既存`piece_save_v2`へ接続。 |
| `ai/tests/piece_v2/test_b06_piece_v2_save_api.py` | 新規のASGI・既存service client・隔離native SQL検査。認証／形式／recipe／source差異、応答不明後の同一再送、変更競合、実lock待ち、production未登録を対象とする。 |
| `.github/workflows/piece-b2b-isolated-postgres.yml` | 既存隔離PostgreSQL workflowへ新規B6検査を接続。公開環境への適用やdeployはしない。 |

既存で接続先となるownerは`piece_v2_source_adapter.py`（本人の保存原入力・保存状態）、`piece_v2_preview_service.py`（保存前の内部組立と画像設定変更）、`piece_v2_content_policy.py`／`piece_v2_visual.py`（形式・recipe）、`piece_v2_access.py`／`piece_v2_quota.py`（権限・回数）である。専用保存基盤は`supabase/migrations/20260808_002_piece_v2_foundation.sql`、RLS/stagingは`20260808_003_piece_v2_rls_and_staging.sql`、保存・取消はM4へ接続する。今回これらの責任を別systemへ複製しない。

### 21.3 検証の現在地と限界

- 今回commit `bee83063ce11b42de64f1c635149bbd5066ec3e5` のGitHub Actions [run 37449500208](https://github.com/MassyuRed/mashos-api/actions/runs/37449500208)、job `112222328168` は完了／成功。実logは **347 PASS／0 FAIL／0 ERROR／0 SKIP**。
- 内訳はB2 46、B3 native 4＋policy 61、B4 48、B5永続化36、取消57、tier 33、新規B6保存62。既存285件も今回commitで再実行して全成功し、前回`f803956`の結果を流用していない。
- 新62件のうちnative SQLは10件（応答喪失後の同一再送1、判定後の原入力／thread／削除／tier変化4、原入力／threadのcommit／rollback実lock待ち4、再送専用から初回保存への移行拒否1）。残る52件はAPI・policy・設定を扱う。CIはPython 3.12.14／pytest 8.4.1／psycopg 3.3.6／PostgreSQL 16.15。警告2件は失敗と分離する。
- 今回のローカルpytestは依存installが阻まれ未実行。構文・差分の確認とpytestの実行結果を分ける。
- 新検査の認証・保存preview・source handoffは合成条件。native部分は使い捨てDBで既存Q2 schemaと未適用M4を使う。実Auth／実PostgREST／実CMEE生成物への安全性付与／端末操作の証明ではない。
- 作業環境はCodex Work。同じ環境のread-only subagent確認は検査補助であり、Pro／Ultra間の独立商品受入れとは報告しない。

全体地図は実在する`01`／`01A`／`01B`／`01C`の全体構造とPiece関連ownerを確認した。`repo_file_maps/00_all_repos_file_maps_index.md`は当該checkoutに存在せず、GitHub default branchでも404だったため、存在しない地図の読了を主張しない。最新weekly review（2026-10-03）へ戻って作業を選択した。System Contextのprepareはancestry条件で成立せず、許可された原典の直接読取りを使用した。これをSystem Contextのprepare成功や全source監査へ換算しない。

### 21.4 残件と再開先

次は、既存の保存原入力→本文・recipe内部組立から、実際の公開安全性判定を経た永続preview発行までをつなぐ。`PreparedPiecePreview`や合成fixtureに`ready`を付けて代用しない。B6は既に保存・適格化されたpreviewだけを対象とし、今回の実装は安全性を付与せず、本文・payload・recipeを再生成・修復・置換しない。

Q3の履歴contextを使った観測について、履歴側の変更と保存適格判定の競合は未解消として残し、公開切替前に解消・確認する条件とする。現在の原入力・profile・thread lockを、Q3履歴context全体を保護した証拠へ拡張しない。refined補足、残るHTTP／RN接続、native画像保存・共有、実機・正式Product Readも未完了である。

M4は未適用の候補。production router登録、稼働DB適用、旧Q&A切替、RN、merge、deploy、有効化は今回0。`STRUCTURE_MAP_DELTA_UPDATED`として本map・Piece入口・manifestを同じ資料更新単位で同期する。商品PASS・完成・公開を認定せず、`automatic_progression=false`を維持する。


## 22. 2026-10-06 — Q3観測が消費したcontextの保存時再照合

本節は`d71fdb40238f2c99751f0c20e578ab654f72308e`時点の履歴。後続の本人向け再取得と現在の残件は§23を優先する。

### 22.1 今回扱う保存不整合と選択理由

§21.4で残した、Q3観測の判定後に履歴側が変わってもPieceを保存できる競合のうち、既存の消費済みcontextを扱う。API対象は `d71fdb40238f2c99751f0c20e578ab654f72308e`、直前の保存入口は `bee83063ce11b42de64f1c635149bbd5066ec3e5`。保存時の原入力・profile・現在threadだけでなく、観測で使用した履歴source／履歴threadとpremium feedbackを同じatomic saveの成立条件へ加える。

当初の永続preview発行の調査では、PCE-4が求めるsource確認・公開向け変換・変換後検査・意味保持を一貫して承認する実装ownerがまだないことを確認した。CMEEのsource graph／役割抽象化、既存detectorによる拒否、`PreparedPiecePreview`の内部組立は、それだけでは公開安全性の承認にならない。これらを`ready`へ昇格させず、既に記録済みの保存不整合を直接修正する限定単位とした。preview発行・安全性の実接続は後続の主経路として残す。

### 22.2 実装ownerと保護する範囲

| path（mashos-api） | 今回の差分と責務 |
|---|---|
| `supabase/migrations/20260808_004_piece_v2_atomic_functions.sql` | 未適用M4の`piece_save_v2`にQ3 context照合を追加。既存の初回保存・lock・quota処理の内側で確認し、record／quotaと原子的に成立させる。 |
| `ai/services/ai_inference/piece_v2_save_service.py` | SQLへ渡した後の保護範囲をdocstringに反映。serviceの処理・HTTP契約・本文作者の呼出しは追加しない。 |
| `ai/tests/piece_v2/db/test_b06_save_context_fence.py` | native PostgreSQLのcontext差替え・実lock待ち・再送・期限検査を追加。認証、適格化済みpreview、source handoffは合成条件。 |
| `.github/workflows/piece-b2b-isolated-postgres.yml` | 既存隔離DB workflowに新検査を接続。実DB適用や公開切替には使用しない。 |

初回保存でserverのsource expectationがあり、現在threadの`runtime_profile`が`q3.plan.sequential.v1`の場合だけ追加判定へ進む。threadの`evaluated_tier`を現在tierへ照合し、保存済み`context_guards`／`context_feedback`の型とtier別の履歴上限を確認する。

消費した履歴guardごとに本人の既存`emotions`行と対応する`emlis_input_threads`行を`FOR SHARE`し、元入力より前の履歴であること、source hash、thread revisionを照合する。threadがない場合のrevision 0も既存のQ3表現に従う。premiumでは本人の既存`emlis_frame_feedback`行もlockする。既存のprofile→thread→整列済み履歴というQ3側の順序を使い、profileに`FOR UPDATE`を取る通常のQ3 thread／feedback writerと直列化する。

quota待ちの後に取得する保存時刻で、消費履歴の閲覧・保持期限を再確認する。さらに既存ownerの`emlis_thread_context`を再利用し、消費済みguardが現在選択される履歴集合に含まれることと、feedbackのframe key／version集合が完全一致することを確認する。履歴は消費したguardの部分集合照合であり、全履歴の完全一致へ契約を変えない。不一致は本文を含まない固定`PIECE_CONFLICT`で拒否し、Piece／quotaの書込みを成立させない。

履歴本文はPiece作者にもrecordにも渡さない。本文・payload・recipeの再生成、書換え、安全性付与は0。保存済み再送は従来どおり同じ確定結果へ戻り、現在のsource／contextの再確認や初回保存へ戻らない。

### 22.3 検証状態と根拠の分離

修正後commit `d71fdb40238f2c99751f0c20e578ab654f72308e` のGitHub Actions [run 37451592242](https://github.com/MassyuRed/mashos-api/actions/runs/37451592242)、job `112229192204`は完了／成功。**既存347件＋新規26件＝373 PASS／0 FAIL／0 ERROR／0 SKIP**。警告3件は失敗と分離する。

新規検査を先に載せたtest-only baseline commit `f3df2dc36a03dc4009c83ee5e2eafc64db9a730a` の[run 37451349778](https://github.com/MassyuRed/mashos-api/actions/runs/37451349778)、job `112228407192`では、既存347件は全PASS、新26件は21 FAIL／5 PASS／0 ERROR／0 SKIPだった。失敗は古いcontextでの保存成功や必要なlock待ちの不成立を示すassertionであり、fixtureエラーではない。修正後はこの同じ26件をbytes無変更で再実行して全PASS。修正commitの親はtest-only baselineで、修正部分はM4 SQLとservice docstringだけである。§21の347 PASSを転用せず、既存集合も両commitで再実行した。

新26件は全て隔離native SQLを使い、free／plus／premiumの通常保存、判定後の履歴編集・削除・thread revision・選択対象外化、feedback更新・削除・追加、評価tierと不正context、保存済み再送、thread未作成時の通常writer protocol、quota待ち中の履歴期限切れを確認した。実lock待ちは消費行のcommit／rollback 6件、通常profile writer 1件、quota待ち中の期限切れ1件を含み、PostgreSQLのblockerで確認した。

隔離native PostgreSQLで既存Q2／Q3 migrationとM4候補を実行する検査であり、実Auth／実PostgREST／実CMEE生成物の安全性／端末・native共有の証拠ではない。作業環境はCodex Work。同環境のread-only subagent確認は補助であり、Pro／Ultraの独立受入れではない。

### 22.4 残件と次の再開先

今回保護するのは既存の消費行と、同じprofileロックを用いる通常のQ3 thread／feedback writerである。**新規・過去日付入力の追加等による履歴選択集合の変化、profileロックを共有しないwriterは別の残件**とする。入力APIには`created_at`を受け取る経路があり、上流gatewayを含む全writerのprotocolはこの単位で監査していない。既存行のlockと再照合を、Q3履歴context全体・全writerの競合解消へ拡張しない。

次の本経路は、実際の生成物へPCE-4の公開安全性判定を接続して永続previewを発行する部分。B5／B6全体の完成判定は行わない。refined補足、残るHTTP／RN接続、native画像保存・共有、実機・正式Product Readも残る。

最新weekly reviewは2026-10-03のまま。永久incidentとcurrent rule、PCE-4／PCE-6／PCE-8の原典、対象sourceへ戻って進行を選択した。全体設計・file mapは§21記載の実在する01／01A／01B／01Cの全体構造とPiece関連ownerの確認範囲を継承し、全mapping行や全current sourceの再監査とは報告しない。今回のSystem Context prepareもdocs `d40ac6ba1a8ab5a9b52fb32fd2f975643363580e`のancestry条件で成立せず、許可された原典の直接読取りを使用した。

`STRUCTURE_MAP_DELTA_UPDATED`として本map・Piece入口・manifestの既存3点を同期する。M4は未適用候補、production router未登録のまま。実DB／稼働アプリ／RN／旧Q&A切替／merge／deploy／有効化は今回0。商品受入れは未成立、`automatic_progression=false`を維持する。


## 23. 2026-10-06 — 本人の保存済みPiece履歴・詳細の再取得

本節は`e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`時点の履歴。後続のLatin人名対応と現在の残件は§24を優先する。

### 23.1 今回の直接経路とpreview本線の残差

API対象は `e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`。§21・§22の保存経路に続き、PCE-6／PCE-8 B7のうち、保存したPieceを本人が後から同じ本文・画像設定で読み出す部分を接続した。`GET /emotion/piece/history`と`GET /emotion/piece/{piece_id}`を専用routerへ追加する。公開Nexusや旧Q&A履歴の流用ではなく、本人の保存recordから返す独立した読取りである。

公開安全性付きpreviewの調査では、sourceに役割が明記されたLatin／ひらがなの人名が抽象化されず候補へ残ること、第三者へのallegationが断定のまま残ることを確認した。source graph・役割処理・既存detectorの成功だけで公開`ready`を付与できない具体的残差である。安全性判定と発行は後続に残し、今回は既存保存後の再表示を限定単位として実装した。10/03議事録§5.3の「生成→永続preview→開発画面」は未完了であり、本単位をその完成へ換算しない。

### 23.2 ownerと読取り契約

| path（mashos-api） | 今回の差分 |
|---|---|
| `ai/services/ai_inference/api_piece_v2.py` | 未登録routerに本人history／detailのGETを追加。Bearer認証、閉じたquery、GET body拒否、固定エラー、`no-store`を使う。固定`/history`を`/{piece_id}`より先に置く。 |
| `ai/services/ai_inference/piece_v2_owner_service.py` | 新規のB7本人読取りowner。認証本人＋savedに限定した`piece_records` queryと、保存内容を検証する専用projectionを持つ。 |
| `ai/tests/piece_v2/test_b07_piece_v2_owner_api.py` | 新規の本人API・内容同一性・ページ継続・隔離native保存recordの検査。 |
| `.github/workflows/piece-b2b-isolated-postgres.yml` | 既存隔離DB workflowへ新B7検査を追加。 |

GETごとに本人認証し、queryと返却前の両方で`owner_user_id`と`lifecycle_status=saved`を確認する。B3のowner-only判定を使い、private／publicの両方を本人に返す。本人以外・不在・保存前・削除済みの詳細はnot-found相当とし、公開済みでも他人へこの入口を開かない。

保存済みの`piece_text`、content payload、visual recipe、そのhash、renderer／contract versionを保持して返す。公開可能な状態は既存保存値の`content_status=ready|adjusted`へ投影するだけで、新しい安全性判定は行わない。source lineage、raw source、安全性詳細、idempotency hashなどを除いた閉じたresponseにする。保存本文・payload・recipeの不整合は固定503で失敗し、部分的な本文や自動修復を返さない。

履歴は既定20件・最大100件、`saved_at DESC, id DESC`のkeysetで継続する。cursorは認証ownerに結び付く継続境界であり、認可tokenではない。次ページも改めて本人とsavedを絞り、境界行の削除や先頭への新規保存でoffsetがずれて重複することを避ける。不正・別ownerのcursorは400、取得結果の順序やownerなどの不整合はページ全体を503にする。全ページを同じ時点へ固定したsnapshot履歴の保証ではない。

原入力・Emlis context・現在プラン・本文作者を呼ばず、保存recordを再取得する。元入力の削除やプラン変更によって保存済み本文・合法に保存されたrecipeを作り直さない。quota・metrics・read stateを含む書込みは0。M2／M3／M4、source writer、CMEE、RNは変更しない。

### 23.3 検証状態

修正commit `e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`のGitHub Actions [run 37453508303](https://github.com/MassyuRed/mashos-api/actions/runs/37453508303)、job `112235434764`は完了／成功。**既存373件＋新B7 41件＝414 PASS／0 FAIL／0 ERROR／0 SKIP**。新41件のうち隔離native DBの4件も全PASS。警告4件は失敗と分ける。実行環境はPython 3.12.14／pytest 8.4.1／psycopg 3.3.6／PostgreSQL 16.15。

test-only baseline commit `2fddb201f8bfe0a6b68e14098d9495d83c5c405d`の[run 37453282548](https://github.com/MassyuRed/mashos-api/actions/runs/37453282548)、job `112234690313`では、既存373件は全PASS、新41件は40 FAIL／1 PASS／0 ERROR／0 SKIP。失敗は旧routerの404または規定エラー応答の不在で、fixture不具合ではない。修正後は同じtest bytesで全PASSとなり、既存373件も再実行した。新testのRED／修正後、local／remoteのbytes一致、親commitと全単位4pathを確認した。§22の373 PASSを今回の再実行結果へ転用していない。

native検査は保存済みartifactからの本人取得を確認する。現在tierへ依存しない検査では、source tableのない隔離DBで`profiles.subscription_tier`をunknownへ変更しても同じ保存artifactを取得した。有料プランからfreeへ実際に変更した試験や、実ユーザー原入力を削除した試験とは報告しない。

構文と同環境read-only確認は実行済みだが、CI・実機の成功の代用にはしない。新検査は認証を模擬し、HTTP clientのPostgREST応答模擬と隔離native DBでの実保存を分ける。実Auth／実PostgREST／安全性付きpreview発行／RN再表示・native共有の商品受入れは証明しない。作業環境はCodex Workであり、同環境の確認をPro／Ultra間の独立受入れへ換算しない。

### 23.4 残件・原典・再開先

次の本線は公開安全性判定と、実生成物の永続preview発行・開発画面接続である。人名・第三者断定は今回確認した不足例であり、その2点の修正だけでPCE-4全体が成立したとは扱わない。B7も今回GETだけであり、visibility／delete API、RN本人履歴、native画像保存・共有、refined補足、実機・正式商品受入れを残す。B5／B6／B7全体完了にはしない。

Q3履歴選択のphantomは別残件のまま。今回は既存submit gateway→legacy→PostgRESTの`emotions` INSERTが`created_at`を保持し、Q3のprofile lockへ参加しない経路を確認した。新規・過去日付入力による履歴集合の変化を保護するには、共有writer protocolの変更が必要である。§22の消費済み既存行lockで解消済みとはせず、本単位ではsource writerを変更しない。

最新weekly review（2026-10-03、§5.3・§6.6〜6.10）、恒久incident全文、current rule、PCE-3／4／5／6／8へ戻った。全体地図01のflow／coverageと01A／01B／01CのApp・入力・Piece・read/access関連fileの役割を現在docs `89e508871f2a08bfcbfa1c1285407321d784f971`で確認した。全mapping行や全sourceの再監査ではない。System Context prepareは同headのancestry条件で成立せず、許可された原典直接読取りを使用した。

`STRUCTURE_MAP_DELTA_UPDATED`として既存map・Piece入口・manifestを同期する。production router未登録、M4未適用候補、稼働DB・アプリ・main・merge・deploy・有効化への変更0。`automatic_progression=false`を維持する。


## 24. 2026-10-06 — 明示された役割へLatin人名を置換する本文修正

### 24.1 欠陥と限定した修正

§23で確認した人名残留のうち、ASCII／全角Latinの名前を既存のsource-role処理へ接続する。API対象は `ee81b49203509c92c63a776b22c54176f9f57d37`、直前の実装は `e697d4f8ece3cfcd8ea9d26cc2d9c0e2cb9ddf4d`。ひらがなまで一括拡張すると助詞や普通語の境界が崩れるため、今回は`A-Za-zＡ-Ｚａ-ｚ`だけを既存の漢字／カナ名に加えた。

| path（mashos-api） | 今回の差分 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py` | 明記された役割・ownerと人名の対応へASCII／全角Latinを接続し、混在名も全tokenとして扱う。未対応の長い名前を既知末尾として部分置換しない。 |
| `ai/tests/piece_v2/test_b08_piece_latin_role_binding.py` | 新規の合成入力検査。実CMEE／B8本文、原文と出典、役割・owner連鎖、拒否境界、普通語を確認する。 |
| `.github/workflows/piece-b2b-isolated-postgres.yml` | 既存workflowでscript／joined-kana／named-ownerの近傍3suiteと新Latin検査を実行する。 |

原文に「友人のAliceさん」と明記された場合、同じ人物への後続参照を含めて「友人」へ置換する。既存の関係語を増やしたり、誰の友人かを推測したりしない。条件、否定、未決定・留保と、明示された中間owner・関係連鎖を保持する。原文bytesとsource spanを変えず、本文側だけを既存の対応に従って変換する。

今回確認した実CMEEの合成入力と候補本文を2例示す。名前の除去に加え、関係と未決定、条件付きの否定が本文に残ることを読んだ確認であり、正式human Product Readの合格ではない。

| 合成入力 | 候補本文 |
|---|---|
| 私は友人のAliceさんと落ち着いて話したい。Aliceさんの都合はまだ分からない。 | 私は、友人と落ち着いて話したい。友人の都合はまだ分からない。 |
| 私は友人のAliceさんが来られるなら、Aliceさんと急いで話したくない。まだ、会う日は決めていない。 | 私は、友人が来られるなら、友人と急いで話したくない。まだ、会う日は決めていない。 |

大文字／小文字、全角／半角はexactな綴りごとに扱い、同一人物のaliasへ正規化しない。アクセント文字・結合文字・数字・ハイフン・アポストロフィなどを含む未対応名も、より広い候補token境界で捉えて既知の短い末尾へ切り詰めず、対応が証明できなければ候補を出さない。この拒否境界は、それらの名前を生成対象として受理することではない。完了した「さん」をハイフン・アポストロフィでつないだ未対応名も、scannerと本文置換で別人へ分割して成功させない。「さん」直後の中黒による既存の区切りは保持する。普通語については`たくさん`・`みなさん`の確認例で、人物へ読み替えず本文を保持した。

本文は既存のCMEE Piece authorからB8へ戻り、`OFFLINE_NOT_ACCEPTED`／`production_enabled=false`／record・quota effect 0を維持する。安全性stateの付与、汎用PII認識、別の生成器・人名辞書、preview発行は追加しない。

### 24.2 検証の区別

修正commit `ee81b49203509c92c63a776b22c54176f9f57d37`のGitHub Actions [run 37456010795](https://github.com/MassyuRed/mashos-api/actions/runs/37456010795)、job `112243680293`は完了／成功。**新35件＋近傍旧3suite194件＋API／DB414件＝643 PASS／0 FAIL／0 ERROR／0 SKIP**。B8 stepは229 PASS、既存警告4件は失敗と分ける。Python 3.12.14／pytest 8.4.1／psycopg 3.3.6／PostgreSQL 16.15で実行した。

同じ35件を固定したtest-only RED `71b79ae84ed8028968f509bd16c465a6a71b31cb`の[run 37455824577](https://github.com/MassyuRed/mashos-api/actions/runs/37455824577)、job `112243056826`では、新35件が33 FAIL／2 PASS、旧194件とAPI／DB414件は全PASS、ERROR／SKIP0だった。修正commitはこのREDを親とし、`piece_source.py`だけを変更。test／workflowは同じbytesのまま再実行し、新35件が全PASSとなった。最終commitの親・差分、全単位3pathのlocal／remote一致、CI logのsource／test SHA-256も確認した。中間試行の結果を最終35件へ代用していない。

対象は近傍旧3suite194件と新Latin検査、既存API／DB414件である。過去のPiece全体検査に残る133失敗は今回全再実行せず、解消済みとも扱わない。旧`explicit_role_owner`のnamed-owner拒否期待と後続`named_role_owner`の生成期待の矛盾も未解消のまま保持し、今回その旧testを変更して合格を作らない。選択した近傍回帰の成功を全Piece／全CMEE合格へ拡張しない。

新しい本文検査は合成入力から実CMEEとB8を呼ぶもので、本文生成mockではない。一方、実認証・実保存入力・公開安全性判定・端末画像・正式human Product Readの証拠ではない。Codex Workと同環境のread-only確認を、Pro／Ultra間の独立受入れへ換算しない。

### 24.3 残件と次の本線

ひらがな人名の助詞・普通語境界、第三者へのallegationを事実のように残さない変換、PCE-4全体の公開安全性判定は残る。今回のLatin名対応だけで安全性判定issuerを成立させず、永続preview発行・HTTP／RN本接続・10/03議事録§5.3の開発画面完了へ数えない。B7のvisibility／delete、RN履歴、native保存共有、refined補足、Q3の新規・過去日付入力に対する共有writer protocolも引き続き未完了である。

最新weekly reviewは2026-10-03。恒久incident全文、current rules、Piece入口／manifest、map§14・§23、PCE-4／PCE-8と実source／関連testへ戻り、今回の修正を選んだ。01の全体flowと01A／01B／01Cの関連mappingを確認したが、全mapping行・全sourceの再監査ではない。System Context prepareは既知のdescendant整合条件で成立せず、許可された原典直接読取りを継続した。

`STRUCTURE_MAP_DELTA_UPDATED`として既存map・入口・manifestを同期する。保存済みrecord、API契約、DB／migration、RN、共有source writer、Emlis／Analysis本体、production登録、main／merge／deploy／有効化への変更0。`automatic_progression=false`を維持する。


## 25. 2026-10-06 — GitHub反映済みの役割明記ひらがな名と資料同期の回復

API実装は `4033e1f323c06c4bad369b03583d5b87e84fb0d5`、先行する新規33検査は `355226b95c23d6a552ebb800332f1b75f88a6e7c`、開始点は `ee81b49203509c92c63a776b22c54176f9f57d37`。変更対象は既存 `piece_source.py` と `test_b08_piece_latin_role_binding.py` であり、今回のB7候補からこれらの内容は変更しない。

原文で関係が明記された純ひらがな＋「さん」の名前だけを関係表現に対応させる限定修正である。名前の境界、役割衝突、関係の所有者連鎖、条件・否定・未決定を対象検査で確認した。一般的な人名検出や安全性issuerの完成ではない。普通語を一律に人物扱いせず、名前そのものが主題の文や未証明の参照は拒否する。

既存FIX run `37461341829`／job `112261400773` の結果は676 PASS／0 FAIL（保存・権限・取消等414件、人名・関係262件）。新33件は受理14件・拒否19件。前回RED記録は648 PASS／28 FAILである。676 PASSはrun 37461341829固有の履歴である。後続B7 run 37533895479にはB8を含む既存工程の成功があるが、旧676へ新B7件数を足して統合件数を作らない。

- FIX: https://github.com/MassyuRed/mashos-api/actions/runs/37461341829
- RED: https://github.com/MassyuRed/mashos-api/actions/runs/37460456046
- 訂正済み記録: https://github.com/MassyuRed/mashos-api/pull/3#issuecomment-6016091963
- 旧FIXの警告はPytestCacheWarning 1件＋PydanticDeprecatedSince20 3件。初版コメントのhttpx表記は訂正済み。
- 旧FIX実装SHA-256: `f3a73e86d6af93adad8b52253c58970237af0191db7f70daff5fcf189b02c71a`
- 旧FIX検査SHA-256: `139cf3d1bd11f761566c9fa90e174a00da64590cbd307e7dec657d98bb25c162`

§24のLatin対応はその時点の履歴として残す。過去の広域133失敗は今回未再実行・未解消扱いであり、676件成功を全Piece合格へ広げない。


## 26. 2026-10-07 — B7公開切替・削除HTTPの反映と隔離PostgreSQL接続確認

### 26.1 反映済みの範囲

APIの確認済みHEADは `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996`、このB7単位の開始点は `4033e1f323c06c4bad369b03583d5b87e84fb0d5`。2026-10-06の140件ローカル候補は履歴であり、現在の未反映候補ではない。既存router・store・SQLを作り直さず、未登録routerの `PATCH /emotion/piece/{piece_id}/visibility` と `DELETE /emotion/piece/{piece_id}` を既存terminalへ接続した。production登録・本番適用は行っていない。

| commit | 反映内容 |
|---|---|
| `fa92752b1c556910c972fd039e1b13e16ac1f868` | 元140件を保持し、正規化境界12件を加えたB7 HTTP検査。 |
| `8f68b44e3a64b565fb6d922b109907c639c37e85` | 公開切替・削除HTTPと正規化済み公開状態による応答照合。 |
| `093aefc5642a7d1d3fa14469a689f2b653bdfe9e3` | 既存隔離PostgreSQLへ接続するB7検査13件。 |
| `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996` | 既存隔離DB workflowへのB7検査追加。 |

変更pathは `ai/services/ai_inference/api_piece_v2.py`、`ai/tests/piece_v2/test_b07_piece_v2_mutation_http.py`、`ai/tests/piece_v2/db/test_b07_piece_v2_mutation_http_native.py`、`.github/workflows/piece-b2b-isolated-postgres.yml` の4点。SQL・store・contract自体はこのB7単位で変更していない。

本人認証、expected row version、削除の同じ再送識別キーを既存terminalへ渡す。clientのowner・本文・recipe・tier・safety追加を拒否する。本文と画像設定を再生成せず、利用回数を消費・返却しない。削除前のrow取得によって削除後の同一キー再送を拒否しない。不正応答・providerの401/404・通信結果不明を成功や本人権限・不存在と誤認せず、自動再送しない。

旧候補には、保存側が空白付き公開状態を正規化して更新しても、APIが未正規化の要求と応答を比較して503とする不一致があった。既存 `normalize_visibility_scope` と同じ結果で照合する限定修正で解消した。要求と反対の公開状態の応答は引き続き拒否する。

### 26.2 検証結果と証拠の限界

2026-10-07の保存済み検証記録を反映する資料更新であり、この資料同期作業で製品検査を新しく実行した意味ではない。

- ローカルの同じ152件は、正規化修正前144 PASS／8 FAILから、修正後152 PASS／0 FAILへ変化した。旧140件を削除・緩和していない。
- [GitHub Actions run 37533895479](https://github.com/MassyuRed/mashos-api/actions/runs/37533895479)／job `112509836141`／HEAD `0c1f69ed25d6e5bb7a887c125ae900ab61ee4996` はcompleted／success。B7 HTTPは152 PASS、B7隔離native SQL接続は13 PASS。既存B2〜B8の工程も成功した。
- 今回の資料準備時にも当該jobのB7工程・既存工程のcompleted／successを再取得した。152件・13件の件数は前回の検証原記録による。再実行やCI全ログの新規取得とはしない。
- 旧676件と新B7件数を単純合算して新しい全体実行件数にしない。広域133失敗の全再実行・解消は未成立。

隔離DBでは本人／別人・不在、古い版番号、本文／recipe／quota保持、子行削除、削除receipt永続化、削除後同一キー再送、commit後ACK喪失時の自動再送なし、同時更新、実row-lock待ち後の版番号再確認、削除失敗時のrollbackを確認した。実API・store・共有HTTP client・既存SQL・使い捨てPostgreSQLを使用したが、Bearer照会とPostgREST transportは合成である。実Supabase/Auth/PostgREST、Nexus/cache非表示化、RN・端末の画像保存共有、独立Ultra受入れ・正式human Product Readを証明した結果ではない。

### 26.3 未完了・再開位置

本線は10/03週次レビュー§5.3の **保存原入力→実CMEE/B9→公開安全性の実判定→永続preview発行→同じ本文・画像設定の開発画面**。B7の確認済み実装と隔離検証を初めから作り直さない。

現在の `piece_v2_content_policy.py::check_existing_detectors` は既存detectorによる候補拒否であって、完全な公開安全性判定ではない。同owner自身がその限界を明記している。`piece_v2_preview_service.py` の内部組立物と `piece_v2_store.py::issue_piece_preview` の永続化を、仮のready/adjustedや常時成功する判定でつながない。PCE-4のS0〜S8が成立した候補だけをS9へ進める。private/planを理由に安全性を省略しない。

第三者への未確認断定、未証明の広い人名／参照境界、実安全性判定と永続preview発行・変更、HTTP/RN接続、許可されたrefined補足、Q3履歴選択集合とshared writer、Nexus/read-through非表示化、native保存共有・実機は残る。10/07の開発画面接続を本資料だけで成立扱いにせず、10/10完成も予定通りと断言しない。週次判断点の不足を残したまま、履歴拡張・画像微調整・別の周辺機能へ逸れない。

`automatic_progression=false`、Draft/default OFF、production router未登録を維持する。資料同期の準備と、remote適用・再取得の成功は別に記録する。共有DB・SQL migration・Render・RN・Emlis/Analysis・merge/deploy/activation・実ユーザーデータの変更0。B7／B8／Piece全体の完了や商品合格creditを付与しない。


## 27. 2026-10-08 — 保存参照GETからRN本文プレビューへの非稼働接続

### 27.1 現行ownerと接続範囲

| Repository / path | 現在の責務 |
|---|---|
| API `piece_v2_source_adapter.py` | `93c26f7c`で既存の保存handoffと返却前再照合からsource_refの7項目を供給。原入力・Emlis本文・Analysis推論は応答へ含めない。今回不変更。 |
| API `piece_v2_source_ref_http.py` | `0312a0fc`の別 `source_ref_router`。本人認証→UUID／query／body照合→既存adapter→7項目のclosed応答。app.pyと既存api_piece_v2.routerには未登録。 |
| API `api_piece_v2.py` | `0c6cb565`のPOST preview初回発行／同一キー再取得を維持。今回不変更。実サーバーの実効flag・登録は未完了。 |
| RN `features/piece/pieceApi.js` | 明示 `requestPieceSourceRef` GETを追加し、取得前後の本人session照合後、既存preview要求へ7項目を渡せる。POSTの要求・応答・同一キー規則を維持。InputScreenはまだ呼ばない。 |
| RN `features/piece/piecePreviewModel.js` | 正規本文・content／recipe・3hashと期限の照合。保存／export権限は付与しない。今回不変更。 |
| RN `features/piece/PieceCreateController.js` | 明示start／retry、古い要求排除、close／dispose。今回不変更。 |
| RN `screens/input/InputPieceActionArea.js`・`components/piece/PiecePreviewModal.js` | 切り離されたhostと全文閲覧。画像生成・保存・共有ではない。InputScreen未組込み。今回不変更。 |
| RN `features/piece/pieceRuntime.js`・`AppRuntimeContext.js` | `b03311fd`で8フラグの既定OFF、欠落／不正／再取得中／失敗OFF。`467cc589`で背景化時の無効化とforegroundでのbootstrap刷新。今回不変更。 |
| API `ai/tests/piece_v2/test_b05_source_ref_http_candidate.py` | 既存候補36件を実装pathへ配置。認証・保存adapter境界は代替。 |
| RN `tests/piece-v2-source-ref.test.js` | 既存候補36件を実装pathへ配置。従来の4検査ファイル203件は変更せず維持。 |

APIのpathは `ai/services/ai_inference/` 以下。RNの実装commitは `df88a0e0f46cdbfc005039177983dbec740efb3f`。先行source／consumer／B2-A／B7を再実装していない。

### 27.2 API採用と稼働権限を分ける

直前の「`GET /emotion/piece/source-ref/{saved_input_id}`を採用し、候補を非稼働コードへ反映する。実DB変更・デプロイ・有効化は含めない」という提案に続くMashの続行指示により、提示した範囲で実施した。API契約の追加は既存PCE-6 API資料§11。既存source_refの7項目、原入力のみのnormal／pre-question、本人認証・保存状態再照合、closed error、no-storeを維持する。

GETは本文生成・preview発行・record保存・quota消費・自動retryを行わない。後続のpreview POSTは別の明示操作であり、その時点の権限・版・保存状態を独立に再確認する。source_refは継続権限、eligible、flag、安全性判定またはrenderer admissionではない。

production route登録、実効flag resolverと各操作の強制、保存入力からのInputScreen導線、認証状態変更時のbootstrap刷新、PIECE_FEATURE_DISABLED連携は残る。default OFFを保ち、旧Q&Aとのuser-visible併走を作らない。

### 27.3 今回の検証と限界

HTTP36 PASS、RN239 PASS（前回203不変更＋既存source-ref候補36）。新しく36欠陥を閉じたという意味ではない。HTTPは実FastAPI／Starlette ASGIとhandlerを実行し、Bearer検証と保存adapter結果を代替する。部分materializationでは無関係なcancel storeのtop-level importをnever-call代替とした。API本体全文は `a395b19e33d9718f3e31189553fa8dcb35ef0bfa`、contract全文は `e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa` と一致し、抜粋APIではない。実store／実認証／DB／CMEE生成の統合検査ではない。

ASGIのnormal／pre-questionの2応答を実ESM4モジュールへ渡し、明示POST後の既存modal全文、content payload、3hashが一致した。HTTP/session、React/RN部品と時刻は代替で、InputScreenやHermes／実機の成功ではない。VM Modulesのexperimental warningあり。旧検査の期待削除・緩和0。全repo、CI、独立review、商品受入れ、10/10目標の達成を主張しない。

### 27.4 再開位置と資料の扱い

旧source-ref HTTP／RN候補patchは過去の候補を保持したものであり、現行コードに再適用しない。旧DocSync候補もruntime2続行と本採用前の記述であり、本改訂への適用は禁止ではなく不要・不整合な再実行となる。現物と本節を優先する。

今回の構造差分は別source_ref routerと既存RN API内の明示GET。入口・本map・manifestは同じ資料変更単位で同期する。コードは先行反映済みであり、コードと同時の同期ではない。API側は別repoの先行commitとして記録し、二repoの同時原子的反映とは扱わない。全体01／01A／01B／01Cの全履歴再監査や全面再生成は行わない。System Context prepareは部分コピーにmoduleがなく失敗し、現行技術正本のdirect-original fallbackで対象現物を参照した。

次の本線はサーバー実効flag／操作時強制と保存済み入力からのInputScreen接続。native画像生成・取り出し・保存・共有、許可refined補足、保存／履歴等の後続残件は保持する。実DB・env・deploy・build・依存追加・main／merge・有効化・実ユーザーデータ・Emlis／Analysisの変更0。`automatic_progression=false`。


## 28. 2026-10-09 — 認証通知と既存bootstrapの接続

### 28.1 今回の差分と既存owner

コード反映先は `1492c9c875485809789b4ebaf7fa33403b2ea2fe`。source／testの2pathを先に反映し、資料はこの後続commitで同期する。同じ作業単位内の別commitであり、同時原子的反映とは扱わない。

| Path | 今回の責務・境界 |
|---|---|
| `AppRuntimeContext.js` | 既存Supabase clientの `onAuthStateChange` を購読。認証通知を受けたら8つのPiece表示フラグと進行中の古いbootstrap結果を無効化し、active時だけ通知後に既存bootstrapを再取得する。 |
| `lib/supabase.ts` | 既存clientを参照するだけ。client／Auth設定／保存先／資格情報／依存版を変更しない。 |
| `tests/piece-v2-runtime.test.js` | 既存41件の本文・期待値を保持し、認証イベント／予約timerのharnessを追加。新21件で同期無効化、古い応答・timer、背景化、重複、失敗、破棄／effect再設定と既存本文hostへの影響を検査する。 |
| `App.js`・`AuthContext.js`・`runtime/AppRuntimeBootstrapGate.js` | 参照のみ。provider順序、認証状態の所有者、初期bootstrap gateと子画面の位置は不変更。 |
| 既存Piece API／model／controller／host／modal | 参照のみ。認証通知からpreview発行・再送・保存・画像出力を呼ばない。 |

これはPCE-7 feature flag設計§12に既存の認証状態刷新を接続した限定差分である。新しい認証の正本、外部client、flag resolver、専用bootstrap routeを作らない。共有 `/app/bootstrap` の再取得は非Piece metadataにも及ぶ。成功時の他機能の更新を隠して「Pieceだけの通信」とは呼ばない。入口・本map・manifestへ前回source-ref／runtimeの未同期差分も同じ資料変更単位で反映する。全体01／01A／01B／01Cは既存owner参照として使用し、全歴史を再生成していない。

### 28.2 動作と検証範囲

認証通知の種類やsession本文から有効・権限・プランを推論しない。通知直後に既存の表示判定がOFFを読み、HTTPはコールバックの外へ遅延する。連続通知は予約を置き換え、手動／foregroundのbootstrapが先行すれば予約を取り消す。背景化・破棄でも取り消し、取消済みcallbackは次の予約を消したりHTTPを開始したりできない。破棄で中断した予約・進行中取得はeffectの再設定で必要な一回を再開する。取得失敗はOFFのままで自動retryをしない。

Node v22.16.0の対象5suiteは260 PASS／FAIL0／SKIP0／cancelled0。既存239件は変更なし、新21件。最初の20件は未修正時16 FAIL／4 PASS、旧runtime41件は成功。追加timer回帰1件は初版実装で61 PASS／1 FAILのREDから最終修正で成功した。新検査を期待値の緩和で通していない。再実行や別コピーのpatch replayを件数へ加算しない。

既存本文hostとの合成接続で、認証通知→本文非表示→bootstrap成功後も本文を復活させず、明示操作を待つことを確認した。React hooks／JSX、認証通知／timer、HTTPとnative部品は代替であり、実React reconciliation、Hermes、Supabase Auth、実HTTP／DB、OS、端末、CI、独立review、商品受入れの成功ではない。今回HTTP36件やAPI側の生成検査を再実行した意味でもない。

### 28.3 現在の再開位置

前回のsource-ref GETとRN受取のコードは反映済みのまま、再適用しない。認証通知後のbootstrap刷新のコード差分は本節、前回までのforegroundとGETの実装履歴は§27と既存handoffを参照する。次は同じ保存入力→preview→開発画面のサーバー実効flag供給・操作時強制、InputScreen接続、PIECE_FEATURE_DISABLED連携。参照値や通知をeligible／enabledに昇格させない。

System Context prepareは今回も部分コピーの `tools.cocolon_context` 不在で不成立。現行技術入口が許可する原典直接読取りを用いた。恒久incident、作業規則・Rule18、最新10/03週次方針と関連設計／map／現物を確認したが、全歴史地図・全sourceの新規監査を主張しない。

前回の入口・map・manifestの未反映は今回の同期対象へ含めるが、更新準備とGitHubの反映後確認を混同しない。実DB・env・deploy・build・新依存・main／merge・有効化・実ユーザーデータ・旧Q&A・Emlis／Analysis変更0。実認証／端末の一往復、native画像生成／保存／共有、商品受入れ、10/10目標の達成は未完了。`automatic_progression=false`。
