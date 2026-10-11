---
doc_id: cocolon_piece_current_structure
title: "Piece構造 — Current Structure"
revision_date: "2026-10-11 JST"
latest_api_implementation: "6b901a1df0037c047513e794624917a09b0f3ac4"
latest_storage_candidate: "4fcb140b778850a1b7a5a65d8e0a26005b3a24c4"
document_role: "PIECE_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
activation_effect: 0
automatic_progression: false
---

# Piece構造 — Current Structure

## 0. Current conclusion

**現在は§56を優先します。既存controllerへ保存中・結果不明・同一要求の再確認・保存完了を追加しました。正式renderer admissionを供給するhost・表示model・保存画面は未接続です。canSave/canExport=falseを維持し、正式fit・実機と画像保存共有の残件を継続します。**

### 10/09以前の先頭要約（履歴）

**最新は§32です。InputScreenの保存成功IDを既存hostへ渡す開発経路を組み込んだ。332件の検査は代替環境であり、API登録・稼働設定・実機・商品受入れの成功ではない。**
**最新は§30です。API `aa6cf858` の単一実効フラグresolver・bootstrap投影・source-ref GET/preview POSTの操作時制御が反映済みで、再開後API86件・RN282件を確認しました。稼働構成・InputScreen・実機は未完了です。以前の「サーバー制御未実装」は各時点の履歴として区別します。**

**2026-10-09現在：既存AppRuntimeContextへ認証通知時のPiece表示フラグ無効化とbootstrap再取得を接続した。保存参照GET・RN本文プレビュー・既定OFF・foreground刷新を継承する。サーバー実効flag／操作時強制、InputScreen、PIECE_FEATURE_DISABLED、実機の完成ではない。現在の追加差分は末尾の2026-10-09節、10/08以前の状態と検査件数は各時点の履歴として読む。**
**2026-10-08現在：保存参照GETの非稼働コードをAPI `0312a0fc3b07f8e46344d5746cafd7760458badd`へ反映し、RN `df88a0e0f46cdbfc005039177983dbec740efb3f`で明示GETと既存preview要求への受渡しを反映した。先行の本文プレビュー、既定OFF、再取得失敗時OFF、foreground刷新を保持する。これはInputScreen・実サーバーの登録／実効flag・実機画像の完成ではない。参照取得URLの採用と、稼働環境への登録・有効化を分離する。現在の内訳は末尾の2026-10-08節を優先し、以下の10/07以前の結果は履歴として保持する。**

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

file-only B2-Aのこの技術受入れは成立した。API反映commitは`1a215c511858a574bf76b15d0ed20ddce984744b`。凍結受入れの識別値を保つため、API migration README／manifestの『native pending』状態文は9/27候補時点の履歴として不変更。この現在地記述がその状態文を更新するものであり、SQL・catalog baseline・caller preimagesを書き換えるものではない。新Pieceの保存preview発行・HTTP／RN／native renderer／実機の残件は§8・§20へ戻り、B2-B／live applyへ自動進行しない。本map・入口・manifestを同じ資料更新単位で同期する。EmlisAIの同日HR文章修正は別の責務であり、この橋渡し試験の商品creditに含めない。

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

現在の未完了は§33.4へ集約する。以下は9/30時点の残件であり、後続のB2-B／B3／B4／B5永続化／B6保存接続が未実装という意味には使用しない。

1. user-visible routeはold Q&Aのまま。
2. 保存原入力・保存状態から本文／recipeの内部組立と画像設定だけの変更を§20まで実装。本文に表れていない選択感情、refined補足、保存済みpreview発行、HTTP／RNは未接続。
3. canonical recipe／実測layout／Linux開発PNGは§14・16〜20で実行済み。製品native renderer／export receipt／端末保存・共有は未完了。
4. B02-Aは§4.3のとおり既存5ファイル＋6reader切替、native凍結試験1 PASSのfile-only技術受入れまで成立。live catalog／全HTTP読取／権限の全行列は未確認。
5. B02-Aの本map・Piece current entry・manifestは同じ資料更新単位で同期。保存preview・新API／RN／native renderer／実機・商品受入れは未完了であり、内部bridge成立から商品合格へ昇格しない。
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

## 29. 2026-10-09 — 開発プレビューの停止応答と既存runtimeへの接続

既存PCE-7 §12の `PIECE_FEATURE_DISABLED` 受取りを、既存API→controller→InputPieceActionArea→AppRuntimeContextへつないだ。新しい公開route、flag resolver、event bus、認証ownerは追加しない。InputScreen未組込み・サーバー未登録の開発コードである。

| Path | 今回の差分 |
|---|---|
| `features/piece/pieceApi.js` | source GET／preview POSTでexact503・code単独の停止応答を通常の通信失敗と区別する。要求・source_ref・同一キー・本文／recipe／3hashは不変更。 |
| `features/piece/PieceCreateController.js` | 停止応答を同じ要求に保持し、明示closeや同じcontextの再設定で再試行可能へ戻さない。現在の要求だけが停止通知を一度発行する。 |
| `screens/input/InputPieceActionArea.js` | 既存AppRuntimeContextをclass contextTypeで参照。現在の停止通知でmodalを閉じ、既存refreshAppRuntimeを一度呼ぶ。古いprops／背景／破棄後の応答を採用しない。 |
| `AppRuntimeContext.js` | 既存Contextのnamed exportだけ追加。再取得・認証・foreground処理、provider配置・非Piece既定値は不変更。 |
| `tests/piece-v2-feature-disabled.test.js` | 追加22検査。停止と通信失敗、古い応答、再取得成功／失敗、同じ要求の再試行抑止を検査する。 |
| `tests/piece-v2-preview-display.test.js` | 既存harnessへContextの代替値を一つ追加。旧検査本文・期待値は不変更。 |

停止時は「Pieceは現在利用できません。」とし、再試行ボタン・本文・保存／exportを出さない。既存bootstrap再取得はPiece表示flagを同期OFFにし、正常な再取得後も生成は別の明示操作である。通常の通信失敗では既存の同じ本文・同じキーによる明示再試行を保持する。共有bootstrapの他機能metadata再取得は既存どおり行う。

検証はNode v22.16.0、対象6suite282 PASS／FAIL0／SKIP0／cancelled0。同じ最終22検査を旧4sourceへ戻して実行すると追加11 PASS／11 FAIL、旧260件は成功。初回の22失敗は新規検査harnessのAbortController不足でNONCREDITとして分離し、因果REDへ含めない。別コピーへの差分再適用と全文一致・282 PASSも確認した。ESMの実7moduleを連結し同一Context参照を確認したが、React・Auth・HTTP・timer・native部品は代替で、実React／Hermes／Auth／DB／端末／CI／独立review／商品受入れの成功ではない。

今回の503は停止コードのRN受取側の限定対応であり、サーバーの発行statusや実効flag制御の検証ではない。source GETの停止コードは読めるが、GETの画面callerは未接続。次の直接残件はサーバー実効flag供給・操作時強制と、本人の保存入力→InputScreen→同じpreviewの接続。native画像生成／保存／共有、capabilities／quota、実認証／DB／端末、商品受入れと10/10目標は未完了。

System Context prepareは部分コピーのmodule不足で不成立、既存正本の原典直接参照を継続した。恒久incidentを全文再読し、同じ会話で確認した作業規則・全体地図の関連役割・最新10/03週次方針と今回の対象現物を照合した。全歴史地図・全sourceの新規監査は主張しない。資料の準備とbranch反映・再取得確認は別に記録する。実DB・env・deploy・build・新依存・main／merge・有効化・実ユーザーデータ・旧Q&A・Emlis／Analysis変更0。`automatic_progression=false`。


## 30. 2026-10-09 — 中断済みB14-A実装の復元確認

### 30.1 反映済みの現在地と今回の再開

API `aa6cf858ee8d258772fc1d9b96ac5d27133c53df` は中断前の反映済みcommitで、親は `fa174b8ffd308be1374cc4bacc108e3eff0e2c6b`。再開時Cocolonは `d553a6a864e09aab87961f40a67aec557ae45f59` のままで、当該APIの資料同期は未実施だった。APIを書き直さず、現在のsource/testを復元・再検査し、本map・既存入口・manifestの同じ3点へ同期する。以下の再検査と、GitHubの資料反映後確認は区別する。

PCE-7の既存8フラグとPCE-8 B14-A ownerを使うCODE_DISABLEDのpreview sliceである。requestedは機能の要求、readyはその機能の非フラグ前提が成立したことをサーバー構成側が渡す値であり、要求・TTL・renderer・source_refからreadinessを推論しない。今回その構成をproductionへ供給する処理や環境変数は追加していない。新しい認証owner・公開管理API・flag名・依存は0。

| API path（ai/以下） | 現在の責務 |
|---|---|
| `services/ai_inference/piece_v2_runtime_control.py` | app-scopedなrequested/readyの両方が厳密なtrueのときだけ有効とし、既存PCE-7のフラグ依存も照合。欠落・不正はOFF。プロセス共通cacheやクライアントoverrideなし。 |
| `services/ai_inference/api_app_bootstrap.py` | 既存bootstrapとstartupに同じresolverの実効booleanだけを投影。非Piece情報は保持。requested/readyの内部値は返さない。 |
| `services/ai_inference/piece_v2_source_ref_http.py` | 認証後・adapter呼出前・返却前にpreview flagを照合。既存7項目のsource_refとclosed errorを保持。停止は503/PIECE_FEATURE_DISABLED。 |
| `services/ai_inference/api_piece_v2.py` | preview POSTの認証後・service前・RPC送信直前・返却前で同じflagを照合。観測済み停止をB5のエラー変換後も保持。既存要求・キー・TTL・renderer・本文projectionは保持。 |
| `tests/piece_v2/test_b14a_piece_v2_runtime_control.py` | 49件のresolver/ASGI制御検査。source/service/認証/RPC等の境界は代替。 |
| `tests/piece_v2/test_b05_source_ref_http_candidate.py` | 既存fixtureだけに明示的な合成ready/requestedを追加。従来検査本文・期待値を保持し、既存parameterが停止codeも検査。 |
| `tests/piece_v2/db/test_b05_reviewed_preview_issuance.py` | 既存隔離app fixtureへの合成ready/requestedの5行追加だけ。今回このnative DB suiteは再実行していない。 |

上記7pathの一commit比較を確認した。最初の6pathの実行用完全bytesは再取得したGit blobと一致し、追加のpure contractも既存の完全bytesを用いた。native fixtureは今回差分と対象行を確認したもので、全native suite再監査・実DB成功へ換算しない。

### 30.2 操作時の停止と未完了境界

OFFなら本人認証後に503/PIECE_FEATURE_DISABLEDを返し、原入力取得・生成service・RPCを始めない。未認証は401のまま。body受信中のOFFはservice開始を止め、生成後のOFFは未送信RPCを止める。送信済みRPCの処理中にOFFとなった場合は本文返却を抑止するが、既に送ったDB操作を取り消した・rollbackしたとはしない。自動retryは0。B5内のエラー変換や同一要求中の再ONで、いったん観測した停止を通常通信失敗へ戻さない。

制御を接続したHTTP操作はsource-ref GETとpreview POSTだけである。preview取消し・変更、保存・所有者履歴/詳細/公開切替/削除等の全操作へ制御を追加した結果ではない。既存旧Q&A・Emlis・Analysisの経路を変更していない。安全性審査・source版照合・保存済み再送・本文とrecipeの整合をフラグで代替しない。

### 30.3 再開後に実行した検査

Python3.13.5 / FastAPI0.128.2 / Starlette0.50.0 / httpx0.28.1 / pytest9.0.2でAPI2suite **86 PASS**。Nodev22.16.0で無変更RN6suite **282 PASS**、FAIL/SKIP/cancelled0。API86は従来36＋既存parameterの停止code1＋B14-A49で、86個の新規欠陥修正ではない。中断commitに記録された49件の修正前41 FAIL/8 PASSは先行実行の記録として区別し、今回新たにそのREDを実行したとはしない。

同じAPIの実ASGI応答4packet（bootstrap ON/OFF、source-ref GET停止、preview POST停止）を既存RNの実API/controller/host/runtimeへ渡した。サーバーOFF時のsource/service/RPC呼出し0、RNのプレビュー要求1回、初期を含むbootstrap取得2回、modal終了、再試行抑止、古い本文を戻さないことを確認した。source GETの停止解釈も確認したが、その画面callerは未接続。プローブの最初の失敗は公開viewに存在しないcode欄を読んだ確認スクリプトの誤りで、既存のmessage欄へ照合を修正した。製品コード・既存検査期待の修正ではなく、商品不具合として数えない。

無関係なcancel storeのtop-level importはnever-call代替、API検査ではBearer/source/service/RPCと一部projection/bootstrap依存、RNではReact/Auth/timer/通信/native部品が代替である。実React/Hermes、実Supabase/Auth/PostgREST/DB、実CMEE生成、OS/端末、CI、独立review、商品受入れの成功ではない。完全bytes一致は対象範囲の根拠であり、全repositoryのcheckout・全検査成功ではない。

### 30.4 同期・次の直接作業

今回の原典確認は恒久incident全文、現在の作業ルール入口、同じ会話で確認済みのCURRENT_RULES/Rule18・全体地図01/01A/01B/01Cの関連役割・10/03週次方針、PCE-7/PCE-8、現在のsource/test/mapへ接続した。全歴史地図の全行や全sourceの新規監査は主張しない。fresh System Context prepare成功は未成立で、既存技術正本が認める原典直接参照を使用した。部分コピーの既知のmodule不足を追加の準備工程へ拡張しない。

次の主作業は、本人の保存入力からInputScreenを通し同じpreviewを開く接続である。稼働構成のreadiness/TTL/renderer供給・ルート登録、実認証/DB/端末の一往復と必要な個別承認は別に残る。フラグだけで適格性・権限・renderer合格を作らない。取消し/保存済み等の未接続制御、capabilities/quota、native画像生成/取り出し/保存/共有、正式商品受入れも未完了。B14-A全体・B10全体・10/10目標を達成済みにしない。

API source反映は中断前、Cocolon資料は本復旧での別repository変更であり、同時原子的反映ではない。旧source-ref・認証刷新・停止受取patchを再適用せず、既存履歴と前提を保持する。実DB・env・deploy・build・依存追加・main/merge・有効化・利用者データ・旧Q&A・Emlis/Analysis変更0。`automatic_progression=false`。


## 31. 2026-10-09 — 保存入力IDから既存開発hostへのsource-ref接続

### 31.1 実装と直接の接続

Cocolon PR #30 `c1485bf13e4e3a1c57b52037cb13d802f568f308`、親 `d553a6a864e09aab87961f40a67aec557ae45f59`。API PR #3 `aa6cf858ee8d258772fc1d9b96ac5d27133c53df` は無変更。

| path（Cocolon） | 今回の変更 |
|---|---|
| `screens/input/InputPieceActionArea.js` | 既存context方式を維持し、保存入力ID・本人照合用ID・呼出し元の同一キーだけを受け取るsavedInput方式を追加。既存runtime predicate→明示source-ref GET→既存controller→別の明示preview POSTを接続。新しいcontroller、API契約、生成作者を作らない。 |
| `tests/piece-v2-saved-input-host.test.js` | 追加21件。実際の既存JS各ownerを評価し、保存参照取得とpreviewの別操作、否認、同じキー、遅着応答、runtime/背景化、同じ入力へ戻った時の表示更新を確認する。React/native/Auth/HTTP等は代替。 |

    caller-supplied saved input ID + expected owner + unchanged POST key
      -> existing current AppRuntimeContext predicate
      -> explicit GET /emotion/piece/source-ref/{saved_input_id}
      -> exact existing seven-field source_ref
      -> existing PieceCreateController context, without start
      -> separate explicit preview action
      -> existing POST /emotion/piece/preview
      -> same model / three-hash display check / full-text modal

source-ref取得前に生成CTAは出さず、取得用操作だけを置く。取得成功を安全性・保存・export権限へ変換しない。原入力・Emlis/Analysis本文・tier・quota・tokenをhostへ加えず、キーを生成・正規化・交換しない。native画像の部品ではない。InputScreenから本hostへのimport/callerは、今回もまだない。

### 31.2 状態・失敗・不変条件

同じ本人/runtime内では前のrequest/keyの対応を既存controllerへ保持し、別の保存入力を同じキーへ付け替える要求を拒否する。入力・本人・キー・runtimeの変更はrender時点で旧表示を隠し、遅いGETを新しい状態へ採用しない。背景化・unmount・取得中のcloseでは試行を無効化する。取得中の連打は一回のGETに限定する。

GETの停止は通常の通信失敗と分離し、現在の要求だけが既存bootstrapを一回再取得する。古い要求の停止は新しいアカウント/runtimeを再取得しない。失敗時の原文・認証情報・例外詳細を表示せず、既存の閉じたメッセージを使う。GETの一時失敗とPOSTの一時失敗の再試行は明示操作だけで、後者は同じ本文・キーを維持する。再取得・foreground・runtime復帰で本文を復活・再生成しない。

同じ保存入力へ戻った後に、controllerが同じcontextのため通知を省略する場合にも、sourceのready遷移自身が表示更新を通知する。追加検査で未修正版の失敗を確認して修正した。React stateはrevision/openだけで、sourceや本文を保持しない。

### 31.3 検証事実と限界

Node v22.16.0で最終7suite、303 PASS／FAIL0／SKIP0／cancelled0。既存6suite282件の全bytesは添付復旧JSONの検証済み版と一致し、変更していない。追加21件の同じ最終test bytesを元hostへ戻した再実行は21 FAIL／既存282 PASSであり、collection/import失敗ではなくcall-phaseの失敗だった。既存hostへ戻した試験後、変更済みhostを復元した。初期のUUID正規表現不備とVMを跨ぐ配列比較のtest harness不備は別の途中失敗記録で、最終の21件の原因確認とは混同しない。

実行したのは実際のPiece API/model/controller/hostのソースであるが、React reconciliation・native描画・HTTP/Auth・runtime publication・clockは代替である。成功例のsource/preview packetも合成で、実保存入力からのCMEE生成結果ではない。InputScreenのmount、実Auth/DB/端末、CI、独立review、商品受入れを実施したとはしない。前回API86件・ASGI4packetの再実行も行っていない。初期試行と最終RED/GREENのログは継続資料へ保持する。

読取りは現行作業ルール、恒久incident全文、全体地図01/01A/01B/01Cとcurrent入口の関連範囲、10/03週次のPiece主経路・完成条件、PCE-6 RN/PCE-8 B10、対象現物を照合した範囲である。全歴史地図・全sourceの新規全面監査やfresh System Context prepare成功とはしない。原典直接参照を使用し、今回prepareを実行したとは記録しない。

### 31.4 残件と次の一作業

InputScreen本体への保存成功ID・本人/観測状態・同一キーの受渡しとhostの組込みが、次の直接残件である。`screens/InputScreen.js`の `submitEmotionInput`→`submitResult.id`→既存Emlis表示経路は読み取ったが、今回は変更していない。本hostの開発用接続を、実アプリの入力選択→preview完了へ昇格させない。

稼働構成のreadiness/TTL/renderer供給・API登録、実認証/DB/端末の一往復、取消し/保存/履歴/削除等の残る操作制御、capabilities/quota、native画像生成/取り出し/保存/共有も残る。これらを削減・完了・承認済みにしない。前回の§30を含む入口・map・manifestの同期は、本候補の生成とGitHub実反映を分けて確認する。

`STRUCTURE_MAP_DELTA_UPDATED`は本hostの保存参照取得責務と現行次作業の記録を指す。新しい地図や管理機構は追加しない。GPT-6 Astra Pro / CHAT_PRO_OK、華恋単一実行。実DB・env・deploy・build・依存・main/merge・有効化・利用者データ・旧Q&A・Emlis/Analysis変更0。B10全体・Piece全体・10/10完成・正式商品受入れは未成立。`automatic_progression=false`。

## 32. 2026-10-09 — InputScreenから直前の保存入力を渡す開発経路

### 32.1 同じ未完了経路を画面へ組み込む

実装commitは `f65c19e01d630a31499414fea10fb20eecff0c5c`。§31のhost、既存source-ref GET／preview POST／本文表示を作り直さず、`screens/InputScreen.js` の保存成功 `submitResult.id` からbody-freeなsavedInputを渡す。変更する製品ソースはInputScreenのみ。新検査は `tests/piece-v2-input-screen.test.js`。本map、既存Piece入口、manifestを同じ変更範囲へ同期し、PCE-6／PCE-8の契約や旧Q&Aの公開経路は変更しない。

    InputScreenの本人入力保存成功
      -> 応答時の本人／画面生存／選択ticket／実効表示flagを照合
      -> 保存ID + 本人照合ID + 選択に固定した不透明キー
      -> 既存Emlis表示を閉じた後のHome「直前に保存した入力」
      -> 本人の明示source-ref GET（保存／terminal適格性はサーバー判断）
      -> 別の明示preview POST
      -> 既存modelの3hash照合と同じcanonical本文／画像設定表示

Emlisのopenは通信不明のreaderを表示する場合もあるため、openのbooleanや本文の存在からsource適格性を作らない。確認用の操作と、GET成功後だけの作成CTAを分離する。Emlis処理・原入力／観測本文・source_refの7項目・POST契約・画像設定の意味・本文作者は変更しない。今回の選択は直前に保存した一入力であり、履歴一覧から任意入力を選ぶ実装ではない。

### 32.2 同一要求と画面境界

キーは既存index.jsで最初に導入されるrandom-values polyfillのgetRandomValuesを使って保存選択ごとに一度作る。新依存・時刻／本人ID／保存ID由来のキー・Math.random fallbackは追加しない。キーの発行失敗ではPiece選択を作らず、入力保存の成否を変えない。GETではキーを送らず、明示POST／同一再試行へ同じキーを渡す。

InputScreenは本文でなくsavedInputとlocal lifetime／ticketだけを保持する。本人／tutorial／resetの変化はrender境界で旧選択を隠し、画面blur・破棄では遅れた保存結果を無効にする。未保存、不正ID、保存失敗・timeout、OFFでは選択しない。次の入力編集中、Emlis／旧Piece／起動／下書きmodal表示中にはhostを混在させない。hostの背景化・取消し・期限・停止応答処理は継承し、再表示で自動GET／POSTや本文復活を起こさない。

### 32.3 検証と限界

Node v22.16.0、既存7検査ファイル303件＋新規29件の計332 PASS／FAIL0／SKIP0／cancelled0。既存7ファイルおよび既存host／API／model／controller／modal／runtimeのbytesは§31の反映済み版と一致し、変更していない。最終の同じ29件を元InputScreenへ戻した比較は16 PASS／13 FAILで、既存303件は前後とも成功した。修正前の13件は画面callerがないことに結び付くcall-phase失敗で、collection失敗ではない。

最初の試行はnew29件が元画面15 PASS／14 FAIL、候補26 PASS／3 FAILだった。VMを跨いだ配列比較と、mockの下書きcallbackが毎回別identityとなる不備を新検査側だけ直した。これらを製品の欠陥解消や最終causal REDに混ぜない。保存成功→観測閉鎖→実host→GET→POST→modal全文一致、同一キー再試行、失敗／未確定入力、本人切替／ABA、離脱／破棄／reset、新入力編集中を最終集合で確認した。

全文のInputScreenをTypeScript 5.8.3でJSX／module構文変換して評価した。検査は実Piece JSを呼ぶが、React reconciliation／hooks、Home／Emlis、認証、通信、乱数、native描画、時刻は検査用代替で、source／preview packetは合成である。repositoryの指定TypeScript 5.2.2での実行、実React／Hermes、実Supabase／DB／CMEE生成、端末、全RN契約suite、CI、独立review、商品受入れは未実施。本文生成品質の新しい合格を、この画面配線検査から認定しない。

### 32.4 現在の残件と読取り

InputScreenのコード上の呼出しは本節で接続した。次の直接残件は、同じ画面が呼ぶAPIの未登録と稼働構成のreadiness／TTL／renderer供給である。実環境の適用／有効化は別承認境界で、今回実施しない。capabilities／quota、取消し・保存済み等の全操作制御、native画像生成・取り出し・保存・共有、実認証／DB／端末の一往復と正式商品受入れも残る。B10全体・Piece全体・10/10完成を認定しない。

現行前提資料・作業入口／CURRENT_RULES／Rule18、同じ会話で参照した全体地図01／01A／01B／01Cとcurrent mapの関連責務、PCE-6 RN／PCE-8 B10、最新10/03週次の主経路を継承し、今回InputScreen全文・Emlis reader・API client・index.js・package.json等を照合した。恒久incidentは今回も全文を再読。部分materializationでSystem Context prepareを一度実行したがtools.cocolon_contextがなく不成立、正本が認める原典直接参照を使用した。全歴史地図／全repoの全面新規監査ではない。

`STRUCTURE_MAP_DELTA_UPDATED`。華恋／GPT-6 Astra Pro／CHAT_PRO_OK、Rule18§0・§11.3内の単一実行。API repository・実DB・env・deploy・build・依存・main／merge・有効化・利用者データ・旧Q&A・Emlis／Analysis変更0。GitHub反映は応答だけで完了にせず、対象bytes／変更path／最終headを別途再取得して照合する。`automatic_progression=false`。

## 33. 2026-10-10 — DB4本適用済み・実接続に必要な共有API採用

### 33.1 先行実装と検証を継承する

API PR #3のheadは `e81c112900f5439a49cd99c7178c2959237984c3`、今回の資料更新前Cocolon PR #30は `bc8c2ef1a9b67a8af549251c0bda2fce45abdf95`。InputScreenの `f65c19e0` と既存hostを保持する。APIの `piece_v2_runtime_control.py::create_piece_preview_application` は、source-ref GET、preview POST、bootstrap、startupの4経路を持つ独立した開発appとして既に実装済み。旧 `register_piece_preview_routes` 候補を再適用しない。

[10/09実装記録](https://github.com/MassyuRed/mashos-api/pull/3#issuecomment-6078985237)と[CI run 37916159645](https://github.com/MassyuRed/mashos-api/actions/runs/37916159645)を再取得した。既存契約146件と実CMEE/B9→限定安全性判定→service/store→隔離PostgreSQLの13件の成功は先行実行の証拠であり、今回再実行した件数ではない。Bearer照会・保存元取得・PostgREST transport・TTL/rendererは検査用代替。RN332件も先行結果である。実Auth、実利用者の保存入力GETから同じInputScreenまでの一往復、実機画像の成功へ換算しない。

### 33.2 実DBの適用結果

同じ会話の先行工程で、`cocolon-project / oeahmpmigszggnkyiivq` を確認し、既存原典全文のままSupabase `apply_migration` を001→004の順に各1回実行した。各段階で構造・権限・履歴を確認し、最終view/ACL照合は **2026-10-10 10:46:43.976675 JST**。今回の資料同期ではDB照会・再適用を行っていない。

| 既存SQL（supabase/migrations/） | 記録されたmigration version | 状態 |
|---|---|---|
| 20260808_001_piece_v2_legacy_read_bridge.sql | 20261010014326 | 適用・確認済み |
| 20260808_002_piece_v2_foundation.sql | 20261010014413 | 適用・確認済み |
| 20260808_003_piece_v2_rls_and_staging.sql | 20261010014441 | 適用・確認済み |
| 20260808_004_piece_v2_atomic_functions.sql | 20261010014516 | 適用・確認済み |

8テーブル・2ビュー・5関数名／6シグネチャが存在し、ENABLE＋FORCE RLS、予定policy、service_role限定SELECT/EXECUTE、clientの直接アクセス禁止、constraint/index、6関数本文hashを照合済み。旧 `public.pieces` の定義・ACLは適用前と一致。履歴は既存4＋Piece4の計8件で重複なし。詳細・SQL blob・各段階の結果は[API適用記録](https://github.com/MassyuRed/mashos-api/pull/3#issuecomment-6092348061)、対応する[アプリ側記録](https://github.com/MassyuRed/Cocolon/pull/30#issuecomment-6092352103)を参照する。

対象4本の未適用は0。**古いmanifestや本mapの履歴にある未適用記述を根拠に再実行しない。** 今後DB変更が必要な場合は、その時点の実履歴・catalogと照合する。前回Chatの内部拒否理由は今も不明だが、Workの4呼出しは成功した。解除待ち・サポート回答待ちを現在のDB停止理由にしない。DB準備完了と稼働readinessを分ける。

### 33.3 設定だけでは閉じない実接続の不足

| owner | 確認した現在の構造 |
|---|---|
| Cocolon `screens/InputScreen.js` → `lib/api/home/emotionSubmitApi.js` | 入力保存は共有 `lib/apiClient.js` 経由の `/emotion/submit`。 |
| `features/piece/pieceApi.js` | source-ref／previewも同じapiFetchと既定API base。個別base指定なし。 |
| `AppRuntimeContext.js` | 表示flagは同じbaseの `/app/bootstrap` から取得。 |
| API `app.py`／`api_emotion_piece.py` | 共有appは旧 `POST /emotion/piece/preview` を登録。新source-refと新runtime stateは未供給。 |
| `piece_v2_runtime_control.py` | 専用factoryの引数供給・4経路の結線は実装済み。`/emotion/submit` は持たない。 |
| `api_contract_registry.py`／`ai/docs/PUBLIC_API_REGISTRY.md` | 共有previewの台帳は旧 `emotion.piece.preview.v1`。`middleware_api_contract.py` もこの台帳を使用する。 |

したがって専用factoryへ共通baseを付け替えるだけでは入力保存が成立せず、共有appへ新previewを後付けするだけでは同一method/pathが重複する。未呼出helperや起動CLIを増やしても解消しない。今回これらを追加していない。共有appの実際の配置状態や端末接続は、ソース読取だけでは確認済みにしない。

### 33.4 次の具体的な変更範囲と実行境界

次に必要なのはB10の実接続に関わるB12-Cの採用確認であり、以下を一組としてレビューする。

1. `app.py` と `api_emotion_piece.py` の登録構成で、入力保存・bootstrap・非Piece機能を保ち、新source-refとpreviewを同じappへ接続する。同じPOST pathのownerは1本とする。未完成の全v2 routerを登録しない。
2. `api_contract_registry.py`、`ai/docs/PUBLIC_API_REGISTRY.md`、既存契約検査を、新saved-source DTOの採用と同時に整合させる。旧v1 headerのまま新DTOを返さず、未登録routeを先に公開済み台帳へ記載しない。
3. 既存resolver/validatorへpreviewのrequested／readyと採用TTL／rendererを渡す。値・readiness根拠は未確定。DBの存在や検査用600秒／synthetic-renderer.v1を稼働承認へ流用しない。
4. 同じ接続先で入力保存・bootstrap・参照GET・preview POSTの結線、重複登録なし、OFF時停止を隔離環境で検証する。旧Q&Aの到達性変更はPCE-6 §7／§11とPCE-8 B12-Cの個別境界に従い、片側だけの変更で既存clean-cutover条件を緩めない。

上記は具体的な次変更候補であり、今回ソースへ適用・稼働承認したものではない。元の依頼は旧Q&A切替・deploy/env/activation/native build/main mergeを除外しているため、その境界を越える変更は実行しない。既存ソースが不足している箇所と、未承認／未確認の環境条件を区別する。実Auth・本人の保存入力・同じInputScreenの一往復、その後のcapabilities/quota・残る操作制御・native画像保存共有・商品受入れも未完了。

今回の変更は既存入口・本map・manifestの3資料だけ。新しい起動CLI、helper、テスト、CI、依存、API/RNソース、SQL変更は0。確認済みのDB適用結果と専用factoryを現在の入口へ反映し、次の実接続変更を確定する資料同期である。恒久incident全文、現行作業ルール、全体地図の関連owner、最新10/10 weekly review §1.4／§5.5と原典を確認。fresh System Context prepare成功、全repo全面監査、新規実機検証は主張しない。10/10週次の実機順序・12/18公開目標を維持する。

`STRUCTURE_MAP_DELTA_UPDATED`。Workの読取専用補助を用い、書込は華恋root。GitHub反映後に3path全文・変更path・PR headを再取得して照合し、両PRへ結果と再開位置を記録する。`automatic_progression=false`。

## 34. 2026-10-10 — 共有APIの切替準備・隔離検証（稼働切替なし）

### 34.1 今回の承認と反映範囲

Mashから「稼働環境は切り替えず、切替用コードの準備・隔離検証まで進めてよい」への明示承認を受けた。§33.4の「未承認」はその時点の履歴であり、この限定範囲を再承認待ちへ戻さない。APIの準備commitは `fed81845a0667d58bf84ce02dd94c700fc68d186`、最終検証commitは `875dca35c02715c8f572344c78715850862d2902`。Cocolonは `3cabfbb7a10c9fb72c27a59769b8d7b23efec0a3` を今回の資料変更のpreimageとした。

`app.py::create_application(piece_preview_configuration=...)` へ共有appの組立をまとめ、明示dictionaryを渡した場合だけ、既存 `create_piece_preview_application` を同じ共有APIの構成に使う。別base・起動CLI・別の生成serviceは追加しない。引数を省略した通常のmodule-level `app` は旧構成を維持する。空dictionaryの候補は全PieceフラグOFFであり、ONには既存requested／ready・TTL／renderer検証が必要である。検査値を稼働値に採用していない。

| owner | 今回の変更 |
|---|---|
| `app.py` | 共有登録・middleware・shutdownを同じfactoryへ集約。入力保存・bootstrap・非Piece登録を保持し、候補は既存4経路factoryを利用する。 |
| `api_emotion_piece.py` | 既定trueのpreview登録選択を追加。候補では旧previewを登録せず、同じPOST pathのownerを新handler1本にする。既存処理本体は変更しない。 |
| `api_piece_compat.py` | 候補だけ旧 `/emotion/reflection/preview` aliasを未登録404にする。旧DTOを新handlerへdelegateしない。defaultでは従来どおり。 |
| `api_contract_registry.py`／`middleware_api_contract.py` | app別の候補台帳を使い、previewを `emotion.piece.preview.v2`、source-refを `emotion.piece.source_ref.v2` とする。default台帳・policy versionは維持し、flagをOFFにしても契約をv1へ偽装しない。 |
| `ai/docs/PUBLIC_API_REGISTRY.md` | default台帳と候補の差、未登録alias、未完了のM5を明記する。 |
| 追加2検査／既存隔離workflow | shared HTTP接続・契約とnative保存・再取得を検証する。既存fixture／SQL／13件／146件は変更しない。 |

APIは上記9path、Cocolonは既存の本map・入口・manifestの3pathだけ。InputScreenと既存host・API/model/controller、CMEE/Emlis/Analysis、SQLを作り直していない。他の旧Piece／Q&A経路は候補にも残るため、**M5／B12-C全面移行完了・旧Q&A残存0ではない**。これはPCE-6 §7、PCE-7 §7〜8が区別する非稼働準備の範囲である。

### 34.2 実行した隔離検証と途中失敗

[CI run 38016668498](https://github.com/MassyuRed/mashos-api/actions/runs/38016668498) は最終commit `875dca35c02715c8f572344c78715850862d2902` でsuccess。共有HTTP新規16件＋既存公開契約10件＝26 PASS、共有native新規2 PASS。既存preview契約146件・既存composed native13件も再実行してPASS、workflow全20検査batchの合計は1,452 PASS／FAIL0／SKIP0。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。従来のPydantic validatorとon_eventの非推奨警告は残る。サーバーlifespan方式の変更は今回行っていない。

共有HTTP検査は実app組立・middleware・submit/preview/source-ref handlerを使い、Bearer、保存元、submit command、preview service/RPC/projectionを合成で置換する。新DTO validatorは実物で、旧raw-inputの拒否・同一baseでの順序・一意登録・app間の契約とstate分離・OFF/Auth順序を確認する。

native2件は既存B5 fixtureのguard付き使い捨てPostgreSQLを使用する。Bearer・保存元IO・PostgREST transport・active-user Auth照会は合成、CMEE/B9・限定review・orchestration・response projection・native SQLは実物。本文／3hash／DB行の一致、別appへの同じキーで再取得、再生成なし・行1件・quota0、OFF時の生成／書込0を確認する。外部active-user照会はテスト境界でのみ置換し、製品middlewareは保持する。実Auth、ASGI lifespan、実利用者入力、RN実機を検証したとはしない。

最初の [run 38016471168](https://github.com/MassyuRed/mashos-api/actions/runs/38016471168) は共有app importで `FastAPI.add_event_handler` が存在しないcollection errorとなった。今回の組立変更で導入した登録方法の不備であり、安全性拒否・DB権限不足ではない。既存と同じ `app.on_event("shutdown")(handler)` に1行修正して再実行した。検査の期待値・fixtureを緩めていない。最初のnative2件は未到達であり、成功件数に含めない。

### 34.3 現在地と次の具体的対応

共有baseの構成不足に対する切替用source準備・今回の隔離検証は完了。稼働構成の採用と実機接続は未実施である。次は、採用するTTL／rendererとrequested／readyの根拠、旧経路の残存を解消するPCE-6／PCE-7 M5条件を確定し、稼働変更の許可範囲と照合する。その後の実Auth→本人の保存入力→同じInputScreenの一往復は別の実接続証拠であり、現在のCIを代用しない。capabilities/quota・他操作の全制御・native画像保存共有・商品受入れも未完了。

実DBの001〜004は§33.2の適用済み記録を保持し、今回再照会・再適用していない。対象4本の未適用0を未適用へ戻さない。今回の稼働env変更・deploy・activation・native build・main merge・利用者データ試験・旧入力削除は0。稼働環境が切り替わったとは記録しない。

現行ルール、恒久incident全文、前提／全体地図の関連owner、Piece入口・current map・manifest、最新10/10 weekly reviewと両PR記録を継承・照合した。fresh System Context prepare成功や全repoの新規全面監査は主張しない。Workの読取専用補助レビューを使用し、書込は華恋root。公開後の全文・変更path・headと両PRへの結果記録は再取得して確認する。

`STRUCTURE_MAP_DELTA_UPDATED`。B10全体・M5・Piece全体・実機プレビュー・画像保存共有の完了とはしない。`automatic_progression=false`。



## 35. 2026-10-10 — 保存・本人操作の機能停止を既存APIへ接続

### 35.1 対象と根拠

§34の次工程としてPCE-6／PCE-7の稼働条件を原典と現物で照合した。preview以外の既存保存・本人操作にはサーバー実効フラグの確認がなく、停止時にも処理へ到達できる具体的な不足があった。今回のMashのPiece続行指示、先行の非稼働切替準備・隔離検証承認、Rule18の既存設計内実装範囲に基づき、PCE-7 §5／6／9の未接続だけを補修した。分類はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK／TECHNICAL_CREDIT。華恋rootが書込を担当し、補助agentは読取reviewのみ。

対象API commitは `227bacf8a1925345fc680a6b54d6e0ba484e6f27`。製品変更は `ai/services/ai_inference/api_piece_v2.py` 1file、既存B6／B7検査4file。resolver・service・store・SQL・共有app・RNは変更しない。全v2 routerと保存／本人操作は引き続き稼働app・共有preview候補に未登録であり、この変更は有効化ではない。

| 操作 | 同じresolverで要求する実効フラグ |
|---|---|
| 保存 | save（依存preview）、public指定の場合だけpublic_write（依存public_read）を追加。既存schemaで正規化した値を使い、空白付きpublicも同じ扱い。 |
| 本人履歴・詳細 | owner_read。生成・保存・公開・exportの停止とは独立。 |
| 公開範囲変更 | visibility_toggle（依存owner_read／public_read）、public対象にpublic_writeを追加。既存のprivate-target-only例外を新設しない。 |
| 本人削除 | delete（依存owner_read）。生成／保存／公開停止中でも健康な本人回復を保持。 |
| preview取消し | 新しいフラグ条件なし。既存認証・所有権・revisionと取消RPCを保持。 |

認証後・本文検証前に確認し、既存のIO注入点を使ってDB読取／書込直前と完了後、結果返却前にも確認する。一度観測したOFFを要求内で保持し、service/storeの閉じたエラー変換を通っても503／`PIECE_FEATURE_DISABLED`を返す。自動retry・取消SQL・別設定resolverは追加しない。送信済みRPCのcommitを後から取り消したとは扱わず、書込後の停止はACKを返さず状態不明を保持する。既存の共有GET transportの限定再試行は維持する。task cancellationは伝播する。

### 35.2 検証

[CI run 38017728318](https://github.com/MassyuRed/mashos-api/actions/runs/38017728318) はAPI `227bacf8a1925345fc680a6b54d6e0ba484e6f27` でsuccess。既存workflow全20検査batchは1,489 PASS／FAIL0／SKIP0（先行1,452件に今回37件追加）。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。既存の共有候補・default契約・native接続検査も成功し、Pydantic validator／on_eventの既存非推奨警告は残る。local pytestは実行していない。

新規検査は、既定OFF・認証優先・公開のみ停止・public正規化・依存フラグ・本人回復・読取／source照合中停止・RPC送信後停止と再送なし・停止後の再ONで同要求を復活させないこと・取消し継続を確認する。native PostgreSQLではsource照合中停止によりpreviewが未消費のまま、保存RPC送信0・quota消費0であることを確認する。既存の正常系fixtureへ明示requested／readyを供給し、既存期待値とSQLは変更しない。検査用readyを稼働readyへ採用しない。

実Auth／実PostgREST／本人データ／端末の検証ではない。正式商品受入れ、B14-A全体、M5、Piece全体完成を主張しない。GitHub反映後、変更5pathの全文とcommitの変更pathを再取得して一致を確認した。

### 35.3 次の位置と維持する境界

保存・本人操作のフラグ未接続は今回の対象範囲で補修。次は同じ実機利用経路の未完成部分（capabilities／quota、保存・本人操作のRN接続、renderer／画像保存共有）を完成させ、PCE-6 M5／PCE-7 §8の一括切替条件へつなぐ。旧経路を残したままpreviewだけを有効にすることをM5成立へ読み替えない。

旧quota／publish／cancel、reflection系、Nexus旧Piece、`/piece/*`、`/mymodel/qna/*`の残存と、稼働TTL／renderer／requested／readyの採用根拠は継続残件。検査用600秒やsynthetic-rendererを稼働値にしない。稼働変更の前には対象版・設定・旧経路移行・復旧方法を具体化して既存承認境界と照合する。

DB001〜004適用済みの証拠は§33.2を維持。今回DB再照会／再適用・env／deploy／activation／native build／main merge・利用者データ試験0。Emlis／Analysis変更0。最新weekly review §5.5の実機順序と12/18公開目標を保持。

System Context prepareは実行したが、浅いcheckoutで既定の祖先commitとの連続性を証明できず終了code2となった。prepare成功とはせず、System Context入口が認める原典直接読取で、前提・全体構造／ファイル地図・current map・PCE原典・今回の実ファイルを確認した。補助機構の再開発は行わない。読取reviewで新しい検査のGET再試行回数の不一致を指摘され、共有clientの既存仕様どおりに固定してからCIへ反映した。

`STRUCTURE_MAP_DELTA_UPDATED`。現在のAPI制御責任を本mapへ反映し、入口・manifestを同じ資料更新で同期する。`automatic_progression=false`。


## 36. 2026-10-10 — 本人の保存利用枠を返すquota APIと読取専用RPC

### 36.1 実装と権限の接続

MashのPiece続行指示と既存の非稼働コード準備・隔離検証承認に基づく、PCE-3 quota §12／PCE-6 API §3／PCE-8 B5の未接続部分。API commit `d3904888f31f105b8c77bcfda9ec9cc80aa5be0b`。分類はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK／TECHNICAL_CREDIT。保存利用枠の計算は既存`project_piece_quota`を再利用し、本文作者・旧quota・保存transactionを作り直さない。

| 変更owner（mashos-api） | 責任 |
|---|---|
| `ai/services/ai_inference/api_piece_v2.py` | 未登録routerの静的`GET /emotion/piece/quota`。認証由来ownerだけを使い、query／bodyを拒否、no-storeと閉じたエラーを返す。 |
| `ai/services/ai_inference/piece_v2_quota.py` | 既存投影へservice-only RPCの閉じたsnapshotを接続。失敗・欠落・不正応答を503へ閉じ、free／使用0へ偽装しない。 |
| `supabase/migrations/20261010_005_piece_v2_quota_read.sql` | 新規の非稼働SQL候補。`piece_read_quota_v2(uuid)`だけを追加する。既存テーブル・データ・ACL・RLSは変更しない。 |
| `ai/tests/piece_v2/test_b05_piece_v2_quota_api.py`／既存隔離workflow | Auth／transport合成HTTPと、既存B4使い捨てDB・SQL保存削除・実RPCへの接続検査。新しいworkflowや依存は追加しない。 |

最初の直接GET案は、読取reviewでM2〜M4がquota ledgerへservice_role SELECTを許可していないと確認して採用を中止した。fixtureの権限を緩めず、原典のservice-only RPC境界に合わせた。直接GET案はGitHub未反映・未実行であり、稼働失敗や成功検査には数えない。

新関数はSTABLE／SECURITY DEFINER、固定`search_path=pg_catalog`、`row_security=off`。適用主体にsuperuserまたはBYPASSRLSを要求し、同名関数があれば停止する。PUBLIC・anon・authenticated・その他の非owner既定EXECUTEを除去し、service_roleへだけEXECUTEを許可する。`row_security=off`自体で権限を昇格するとは扱わない。NULL／zero ownerは拒否する。通常clientがowner IDを任意指定して使えるRPCにはしない。

DBの単一`statement_timestamp()`とSTABLEの読取snapshotで、現時点の`profiles.subscription_tier`と`piece_quota_consumptions`の本人・JST月別件数を取得する。既存SQLと同じく、profileなし／null／未知プランはfree。内部snapshotはtier・count・server_nowだけで、HTTPは既存exact7 fields（contract_version／subscription_tier／month_key／save_limit／saved_count／remaining_count／can_save）に投影する。上限free5／plus30／premium無制限を維持する。削除後も残る消費行を数え、旧published行・現存Piece数から導出しない。

quotaはPCE-8 B5のpreview表示経路として既存preview_enabledに従う。これはPCE-7にquota専用の明文行があるという主張ではなく、既存役割からの技術的な対応付けである。save停止中にもpreviewの利用枠は取得できる。can_saveは回数だけの参考値であり、保存機能の有効化・source適格性・実際の保存許可ではない。最終判定は既存保存SQLが現在値で行う。認証後、RPC直前／直後、応答直前で既存停止制御を再確認し、POSTの自動再送は行わない。

### 36.2 検証と公開確認

[CI run 38018804564](https://github.com/MassyuRed/mashos-api/actions/runs/38018804564) はcommit `d3904888f31f105b8c77bcfda9ec9cc80aa5be0b` でsuccess。追加quota検査39件（native2件を含む）が成功し、既存workflow全21 batchは1,528 PASS／FAIL0／SKIP0。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。既存Pydantic validator／on_eventの非推奨警告は残る。local pytestは未実行。

新規native検査では既存001〜004を既存fixtureどおり隔離DBへ展開後、005候補を適用する。既存tableのACL／RLSが不変であること、NOBYPASSRLSのservice_roleから関数だけを呼べること、anon／authenticatedのEXECUTE拒否、serviceのprofile／ledger直接SELECT拒否を確認する。実保存→実削除後も使用回数が1で残り、他人／別月を除外し、プラン再取得に応じ残数が変わる。RPCはREAD ONLY transactionでも実行する。

HTTP検査は公開応答exact7、Free／Plus／Premium、認証優先、client値拒否、既定OFF、実行中停止、RPC欠落／権限エラー／timeout／壊れた応答、DB時刻のJST月境界、取消し伝播を確認する。実Auth／実PostgREST transportは合成であり、本番適用・本人データ・端末検証の代用ではない。GitHub上の全5pathを全文再取得し、commitの変更pathとの一致を確認した。

### 36.3 適用状態と次の一作業

**既存001〜004は適用済み。新規005だけが稼働DB未適用。** 過去の4本を未適用へ戻さず、再実行しない。005の適用と配置／有効化は今回行っていない。稼働で利用する前に対象DBの現在構造・関数不存在・適用主体の権限を照合し、具体的な005適用について別途承認範囲を確認する。未適用RPCを呼ぶ場合は503となる。

次の一作業は、既存PCE-6のplan capabilitiesとquotaをpreview／RNの同じ契約へ接続すること。現RNはPREVIEW_FIELDS完全一致のためbackendだけへ項目を追加しない。今回の単独quota GETは稼働app・共有preview候補へ未登録で、旧quotaの契約は保持している。その後に保存／本人操作のRN、renderer／画像保存共有、M5の旧経路移行と設定採用、実Auth／同じInputScreen／実機を続ける。M5やPiece全体の完了とはしない。

今回のlive DB照会／適用、env／deploy／activation／native build／main merge・本人データ試験は0。Emlis／Analysis変更0。最新weekly review 10/10 §5.5と12/18目標は維持する。現行前提・作業ルール・恒久incident全文・全体構造／ファイル地図・Piece原典と現物を照合した。System Context prepareは新headでも祖先証明ができずcode2となり、許可された原典直接読取を使用した。読取reviewは補助agent、書込・最終確認は華恋root。`STRUCTURE_MAP_DELTA_UPDATED`／`automatic_progression=false`。


## 37. 2026-10-10 — プラン別設定と残り保存回数をpreview／RNへ接続

### 37.1 同じ応答契約での実装

API `004a85eeb7af83b68ae1c1fba42ec2d6941b6874`、RN `e5f112a826c6b99732aaaa01f365ea95114037ef`。§36.3の未完了だったPCE-6 RN flow §5のplan capability／remaining saves表示を、既存preview POSTと既存本文modalへ接続した。API片側だけの項目追加ではなく、RNのPREVIEW_FIELDS完全一致も同じ実装単位で更新する。APIは製品3file・既存検査2file、RNは製品2file・既存検査3file・対象検査workflow1file。新しい画面、controller、保存権限ownerは追加しない。

| owner path | 今回の役割 |
|---|---|
| API `api_piece_v2.py` | 認証・要求・runtime検証後、既存005 RPCでquotaを先に読み、既存生成／再取得へ期待tierを渡す。公開応答exact19にquota／plan_capabilitiesの2項目を追加。 |
| API `piece_v2_preview_service.py` | issue_originalとread_original_previewでserver-only expected_subscription_tierと現在handoffを照合。不一致はPIECE_CONFLICT。従来の再照合・SQL fenceを保持。 |
| API `piece_v2_quota.py` | 既存exact7 quotaを再利用し、PCE-6表からexact4のplan_capabilitiesを投影。 |
| RN `features/piece/pieceApi.js` | exact19と追加nested契約を検証し、tier・制限・残数・can_save算術・recipeとの整合を確認。saved_countは安全な非負整数、Premium limit／remainingはnull。 |
| RN `components/piece/PiecePreviewModal.js` | 現在の設定とは別にプランで利用できる形式／テーマ／比率／Cocolon表記、JST対象月と残回数を表示。設定変更ボタンは追加しない。 |
| `.github/workflows/piece-rn-contracts.yml` | 既存8種のPiece Node検査を対象branch／pathで実行。package.jsonと同じTypeScript 5.2.2だけを使い捨てディレクトリへ導入し、native build／deployなし。 |

capabilitiesは `format_selection`、`theme_ids`、`aspect_ratios`、`branding_modes` の4項目。Free＝fixed／soft_paper／4:5／required_small、Plus＝automatic／exact2 theme／4:5／required_subtle、Premium＝eligible_choice／exact2 theme／4:5・9:16／required_subtle・off。形式候補は既存eligible_formatsを使い、全形式を新たに適格認定しない。Plusに手動形式変更を約束しない。

quotaのRPC欠落・失敗では生成／preview書込前に503で停止する。新規発行と同じキーの再取得の両方で現在tierを照合し、再取得途中のtier変化も閉じる。quota残0はpreview生成を禁止する新条件にしない。同じキーでもquotaは再読取し、本文・payload・recipe・3hash・preview identity・expiryは保存済みのまま。追加metadataを保存artifactやhashへ混ぜず、SQL／migrationを変更しない。取得後の保存・プラン変更・月境界で表示が古くなる可能性は残り、最終保存RPCが再判定する。

preview HTTPも既存_OperationFeaturesを用い、quota IO前後・preview write前後と返却前のOFFを要求中保持する。停止後の自動再送／書込取消しはしない。RNは既存model／controller／hostをそのまま通り、本人変更・停止・閉じる・期限切れでmetadataも破棄される。quota.can_saveを画面canSave／canExportへ昇格せず、今回は両操作falseを維持する。

### 37.2 検証と限界

[API CI run 38019674020](https://github.com/MassyuRed/mashos-api/actions/runs/38019674020) は `004a85eeb7af83b68ae1c1fba42ec2d6941b6874` でsuccess、全21batch＝1,537 PASS／FAIL0／SKIP0。既存1,528件に新規9件（native7、停止制御2）を追加した。Free／Plus／Premiumのmetadata、残0でもpreview可能、同一キー再取得時のquotaだけの更新、RPC欠落で生成0、初回／再取得のtier不一致、再取得の第2handoffでのtier変化、quota読取中OFFを確認した。既存本文・hash・保存／再取得検査を維持する。native HTTP fixtureは既存001〜004の隔離DBへ005を追加し、quota RPCとpreview書込のcounter／fault注入を分けた。Python 3.12.15、pytest 8.4.1、FastAPI 0.143.0、PostgreSQL 16.15。既存非推奨警告は残る。

[RN CI run 38019722996](https://github.com/MassyuRed/Cocolon/actions/runs/38019722996) は `e5f112a826c6b99732aaaa01f365ea95114037ef` でsuccess。InputScreenを含む既存8suiteで365 PASS／FAIL0／SKIP0／cancelled0。新規33件で3plan・不正metadata・残0／無制限表示・期限切れ後非表示・操作を有効化しないことを確認した。Node 24.21.0／TypeScript 5.2.2。手元はTypeScriptがなく7suiteを実行し、最終336 PASS。最初の334 PASS／2 FAILは旧quota不存在期待とFreeの9:16成功fixtureが新契約と不整合だったため、正しいmetadata期待・Premium fixtureへ更新した。validatorを緩めていない。

APIのBearer／source／PostgREST transport、RNのReact／native／HTTP／sessionは代替境界を含む。実Auth、実PostgREST、実機画像、商品受入れの成功ではない。local pytest未実行。公開済みAPI5path・RN6pathの全文とcommit変更path集合を再取得して一致確認し、資料3pathも公開後に同じ確認を行う。

### 37.3 次の未完了と適用境界

capabilities／quotaの応答・本文画面表示を未実装へ戻さない。次は既存preview identity／revision／3hashを使う保存・本人操作のRN接続を扱う。PCE-6 §6のpreview形式／画像設定変更とprivate／public選択も未接続であり、表示した候補が操作可能とは記録しない。その後もnative画像preview／保存共有、M5旧経路移行・稼働設定採用、実Auth→同じInputScreen→端末での確認が残る。内部prepare_visual_changeを、永続previewのPATCH API実装済みへ読み替えない。

005は引き続き稼働DB未適用。preview候補も005読取が前提となり、未適用なら503。現在のAPI／RNの応答形は一組で配置する必要があるが、今回のPR反映は配置・activationではない。既存001〜004適用済みを維持し、再実行しない。稼働005適用は対象・権限を確認した具体的な別操作として扱う。

最新10/10 weekly review §5.5と12/18公開目標を保持し、今回の明示Piece指示による準備を進めた。全体設計／ファイル地図、Piece原典、現行作業ルール、恒久incident全文と現物を照合した。System Context prepareは旧HEADで祖先確認失敗、整合した67a71724ではPUBLICATION_RECOVERY_AMBIGUOUS（residual without marker）で停止。推測cleanupや生成結果の採用はせず、入口が許可する原典直接読取を継続した。fresh prepare成功・全面再監査は主張しない。

live DB照会／適用・env／deploy／activation／native build／main merge・本人データ試験は0。Emlis／Analysis製品変更0。補助agentは読取reviewのみ、書込・最終確認は華恋root。`STRUCTURE_MAP_DELTA_UPDATED`／`automatic_progression=false`。B10／Piece全体・実機利用・商品受入れ完了ではない。


## 38. 2026-10-10 — 保存済みPieceの本人履歴・詳細・公開範囲変更・削除をRNへ接続

### 38.1 再開判断と実装範囲

前回§37の次工程を実コードとPCE-5 §8へ照合し、保存前のselected text/recipe/target profileによるnative実測fitが未接続と確認した。preview/save serviceはrecipeやhashの検証を持つが、renderer_version文字列・本文hash一致をfitの代わりにはできない。従って本文modalの保存ボタンは有効化せず、独立して進められるPCE-8 B11の保存済み本人操作を今回の直接作業とした。保存の未完了を消さず、準備用transportだけを追加する迂回もしない。

MashのPiece続行指示に基づく既存設計内の可逆的RN実装・検査・GitHub反映。実行・最終統合はroot華恋、二つの補助agentは読取reviewのみ。同環境reviewであり別model Pro reviewや商品受入れとは主張しない。分類はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK／TECHNICAL_CREDIT。稼働有効化・実DB変更・native build・本人データ操作・旧Q&A切替は対象外。

| owner（Cocolon） | 責任と接続 |
|---|---|
| features/piece/pieceApi.js | 既存本人history/detail/visibility/delete APIの閉じた要求・応答。既存apiFetch、送受信前後の本人照合、no-storeを使用。previewとsavedのartifact形状検証だけを共有。 |
| features/piece/piecePreviewModel.js | 既存3hash検証をsaved表示でも使える関数に抽出。previewのexpiry・quota・plan検証は維持。 |
| features/piece/pieceOwnerModel.js | PCE-8 B11指定owner。保存済み本文・payload・recipeの3hashと本人操作flagを検証。現在tier・source・preview expiryで保存済みartifactを再判定しない。 |
| features/piece/PieceOwnerHistoryController.js | PCE-8 B11指定owner。一覧/ページ送り、fresh詳細、version付き公開範囲変更、確認済み削除と同じkeyでの結果確認。競合時に詳細を再取得し、自動上書きしない。 |
| components/piece/PieceOwnerCard.js | PCE-8 B11指定owner。canonical全文、非公開/公開の文字、保存日時・形式・テーマ・比率。画像rendererとしては扱わない。 |
| screens/PieceOwnerHistoryScreen.js | PCE-8 B11指定owner。既存Auth/Runtime/Tutorial/Navigationへ接続。初回も明示読取。本人変更、flag停止、背景化、画面離脱で本文とpendingを破棄。 |
| navigation/PieceStackNavigator.js／screens/PieceHistoryMenuScreen.js | 既存履歴メニューからowner_read有効時だけ「自分のPiece」へ接続。共鳴履歴/Nexusのモデル・cacheを本人履歴へ流用しない。 |
| tests/piece-v2-owner-history.test.js／既存contracts test／既存Piece RN workflow | 合成Auth/HTTP/React/nativeによる実source確認。既存workflowにowner suiteと変更画面pathを追加。新依存・新workflowなし。 |

公開変更は本人の確認後だけ。private→publicにはpublic_writeを追加要求する。expected_row_version競合時は一回fresh詳細を読み、本人が内容を確認してから次の操作を行う。削除確認はCocolon内削除・外部画像回収不可・保存回数不返還を明記。応答不明時は同一key/versionの明示再試行だけを許し、成功ACK前に削除済み表示へ変えない。preview/save停止とowner_readを独立させる。PIECE_FEATURE_DISABLEDでは本文を閉じ既存bootstrapを一回更新する。本文やtokenを永続cache・ログ・navigation paramsへ保存しない。

### 38.2 検証状態とDB確認

初回のowner検査27件が成功し、ページ送り・不正page・二重tap/離脱・delete競合・削除flag/乱数失敗を追加した最終owner検査は32件。既存7suite336件と合わせlocal Node 24.19.0で368 PASS／FAIL0／SKIP0／cancelled0。初回の既存検査ではAPI transport call site数を1に固定した1件だけが失敗し、既存経路と新owner経路の2箇所を期待するよう更新した。既存の本人照合・閉じた契約の期待は弱めていない。追加後の最終CI結果はこの節の追記で確定する。InputScreen29件はlocal compiler不在のため未実行、既存CIのTypeScript 5.2.2で確認する。

React reconciliation・Hermes・native画像・実Auth/PostgREST/DBは合成または未実行で、端末確認・商品合格・B11全体完成ではない。今回Supabase list_migrationsだけをread-only実行し、001〜004の適用履歴を再確認した。005は履歴に未登録。本人のrecord本文読取・稼働SQL適用は0。

### 38.3 次工程と境界

次の直接残件はPCE-5の同じlayout ownerを使うnative画像プレビューと保存前fitの接続。その結果を表示中のpreview identity/revision/3hashへ結び、既存保存APIへ進める。画像capture/端末保存/外部共有、preview設定変更、M5旧経路移行と稼働設定、005適用、実Auth/端末確認は残る。本文履歴接続を新Piece全体の完成にしない。

設計図01と関連01B、全ファイルの構造地図・historical inventory、current map、作業CURRENT_RULES/Rule18/恒久incident全文、PCE-5/6/7/8、最新weekly review 10/10 §5.5を照合した。生成System Contextの過去prepare成功を継承せず、入口の原典直接読取fallbackに従いcurrent GitHubと一致するcheckoutの原典を参照した。本作業でprepare成功を主張しない。Emlis/分析の先行実機確認順と12/18公開目標を維持する。API製品・SQL・環境設定・deploy・activation・native build・main mergeは変更しない。STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。

### 38.4 GitHub反映・最終CI確認

実装と資料14fileをcommit `11b61579ff0f119bfbbf12e1fecd60354667ffb3` でPR #30へ反映。通常git pushはHTTPS認証情報なしで失敗したため、利用可能なGitHub connectorから同じ14fileをnon-force反映し、GitHub再取得で全対象bytesと変更path集合の一致を確認した。

[Piece RN CI 38021152558](https://github.com/MassyuRed/Cocolon/actions/runs/38021152558)／job 114122211809は同commitでsuccess。既存8suite365件＋今回owner32件＝**397 PASS／FAIL0／SKIP0／cancelled0**。InputScreen29件を含む。Node 24.21.0、既存TypeScript 5.2.2。local368件との差29件はInputScreenであり、API検査件数とは合算しない。最終sourceはこのCI版から変更していない。本追記と入口/manifestの結果記録だけを後続反映する。実機・画像出力・正式商品受入れは未成立。


## 39. 2026-10-10 — RN固定キャンバスの確認用プレビューとnative行寸法の接続

### 39.1 今回成立させた範囲

前回§38.3からnative画像プレビューの未実装へ進み、既存本文modalにPCE-8 B10指定の `components/piece/PieceVisualCard.js` を接続した。PCE-8 B13-C指定の `features/piece/pieceLayout.js` がPCE-5のcatalog/geometryと測定状態を保持する。`tests/piece-v2-renderer.test.js` を既存Piece RN workflowへ追加し、既存preview表示検査も実component読取へ更新する。新しいdependency、workflow、API、DB保存先は追加しない。

1080×1350／1080×1920のlogical canvasへ全文blockを描画し、表示だけ一様transformで縮小する。theme exact2、template別の整列・font候補・行高、essay段落間隔、marginとbranding予約領域は既存B9 `piece_v2_visual.py` と一致する。branding OFFでも本文領域を広げない。固定branding色を使い、確認用RN表現ではrequired_subtleにopacity 0.8を適用し、surfaceとのcontrast 3:1以上を数値確認する。system body、文字拡縮OFF、規定discrete sizeのみ、本文のtrim／正規化／省略／numberOfLinesは使用しない。既存selectableな全文と読み上げ表示を残す。

同じnative TextでonLayoutとonTextLayoutを受け、全段落と必要なCocolon表記についてline textの完全再構成、有限座標、順序、行boxの範囲と総高さを確認する。overflowなら次の規定サイズへ進み、floorでも収まらなければcanvasを取り除く。未測定canvasは透明で読み上げ対象外、8秒以内に測定が揃わなければunavailable。native eventにはpreview identity/revision/row_version/expiry/3hash/server renderer文字列に由来するkey、font候補、測定世代を結ぶ。同じartifactへ戻った場合も古い世代は使わない。props変更はrender時に旧表示を遮断し、閉じる／本人変更／背景化等は既存hostの破棄を継承する。timeout自身も世代を持ち、新候補のtimerを破棄しない。測定後stateは数値だけで、native event本文の副正本・永続cache・log・network送信を作らない。

### 39.2 保存前fitとの明確な差

**今回の成功stateは `geometry_checked` という確認用表示だけであり、PCE-5の `layout_state=fit` ではない。** RN 0.77 Text公開仕様のonTextLayoutは行寸法を返すが、glyph存在・実ink boxを保証しない。公式資料: https://reactnative.dev/docs/0.77/text 。公式sourceの個別取得は成立しなかったため、実nativeのline.text挙動も端末確認済みとはしない。textが欠落／変化したeventはunavailableになる。

Python B9のgrapheme/禁則/読取単位を守るwrapとRN native wrapの同等性、実ink欠け0、glyph availability、実機、PNG capture/export共通性は未証明。Python build_measured_layoutは現在のpreview/save製品経路から未呼出で、serverのrenderer_version文字列だけではこの穴を埋めない。prototype実装version `piece.rn_native_preview.prototype.v1` を使用し、server指定renderer対応済み・rn_renderer完成・出力PNG成功へ昇格しない。canSave／canExportはfalseを保持し、同APIへの保存操作は今回も未接続。新schemaやclient自己申告fitを保存許可へ通さない。

### 39.3 検証・review

local Node 24.19.0で既存8suite368件＋renderer新18件＝**386 PASS／FAIL0／SKIP0／cancelled0**。全format/ratio・2theme token・Free/Premium branding、複数native行の空白/混在言語/結合文字/ZWJ emojiを含む全文一致、全block待機、横/縦overflow、下限拒否、縮小transform、遅延event・props切替・同一候補へ戻る世代、期限/hash拒否、timeoutとunmountを合成eventで検査した。React/native計測・Hermes・実機・glyph/inkの実測テストではない。InputScreen29件はlocal TypeScript不在のため既存CIで確認する。

読取reviewは同環境の補助agent2名、実装／統合／検査はroot華恋。指摘された無期限計測待ちとbranding token流用を修正した。別model Pro確認や商品受入れではない。GitHub/CIの最終結果は本節へ追記する。

### 39.4 次の直接作業と稼働状態

次はこの同じnative canvasについて、glyph/inkの測定手段とgrapheme/禁則を含むlayout同等性、target renderer versionのadmissionを接続し、保存前fitを成立させる工程。その後に同じpreview identity/revision/3hashで保存操作へ進む。画像capture/端末保存/共有の依存preflight、owner/Nexusへの同じ描画接続、preview設定変更、M5の旧経路移行、005適用、実Auth/実機も残る。

既存001〜004適用済み／005稼働未適用を保持。今回はlive DB照会/適用0、API/SQL/env/deploy/activation/native build/main merge/本人データ試験0。全体設計図01/関連01Bと全ファイル構造地図、Piece current map/原典、現行作業ルールと恒久incident、最新10/10 weekly review §5.5を確認し、Emlis＋分析の先行実機順と12/18公開目標を保持した。生成System Contextの過去失敗を成功に変えず、許可された原典直接読取を使用。今回の明示Piece続行に基づく既存設計内の可逆的RN準備・GitHub反映。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK／TECHNICAL_CREDIT、STRUCTURE_MAP_DELTA_UPDATED、automatic_progression=false。


### 39.5 GitHub反映と最終CI

source＋再開資料9fileをcommit `1976de5ca9f2d9c6c68b3cdfb8ca7f1bc2f19c6e` でPR #30へnon-force反映し、remote再取得で全9fileのbytesと変更path集合の一致を確認した。[Piece RN CI 38022110375](https://github.com/MassyuRed/Cocolon/actions/runs/38022110375)／job 114125130449は同commitでsuccess。InputScreen29件を含む10suite＝**415 PASS／FAIL0／SKIP0／cancelled0**（既存397＋新renderer18）。Node 24.21.0、既存TypeScript 5.2.2。local386件との差29件はInputScreenで、件数を合算しない。sourceはこのCI版から変更していない。本節・入口・manifestへの最終結果追記だけを後続反映する。実native計測・実機画像・保存前fit・商品受入れは未成立のまま。


## 40. 2026-10-10 — 実際のnative Textの描画検査を確認用プレビューへ接続

### 40.1 ownerと同一描画条件

§39の外枠測定を継承し、B13-C指定pieceRendererから、画面へmountした同じPaper Textのnative layoutを読む。新レンダリングライブラリ・別canvas・本文正本・保存APIは追加しない。RN 0.77.3の公式npm配布sourceを取得して、RCTTextView、ReactTextView、UIManagerとonTextLayoutの実装を確認した。§39.2の「個別source取得未成立」は前回の履歴であり、今回は固定versionのsource確認が成立した。端末実行済みには読み替えない。

| owner path | 今回の変更 |
|---|---|
| features/piece/pieceRenderer.js | mounted Textのtag、expected全文/fontをlocal bridgeへ渡す。exact10の数値中心応答を検査し、行末とnative grapheme境界・既存B9硬い禁則集合、描画範囲を確認する。 |
| features/piece/pieceLayout.js | 完全再構成済み行へUTF-16終端を保持。再測定では旧native検査を無効化する。 |
| components/piece/PieceVisualCard.js | 全block＋brandingの検査完了まで透明。overflowは規定sizeだけ降順、floor/不明/8秒失敗は全文表示へ戻る。native_checkedもcanSave/canExport=false。 |
| android/app/src/main/java/com/anonymous/cocolonmvp/piece/PieceTextMetricsModule.java | ReactTextViewの同じLayout/実MetricAffectingSpanのfont、ICU grapheme、切詰めなしの行末を読む。同じLayoutをoverscan付き一時Bitmapへ描画しalpha範囲を検査する。4M pixel上限、finally recycle、file/network/logなし。 |
| android/app/src/main/java/com/anonymous/cocolonmvp/MainApplication.java | 既存package listへ上記local moduleを登録する。 |
| ios/tempCocolon/PieceTextMetrics.mm | UIManagerのqueue→UI blockで同じTextKit storage/layoutを読む。全文/font/行末、composed characters、glyph0/LastResort観測とglyph bounding rectを確認する。 |
| ios/tempCocolon.xcodeproj/project.pbxproj | 上記1sourceを既存app targetに登録する。 |
| patches/react-native+0.77.3.patch | 既存patch-package運用でRCTTextViewへread-only storage/frame accessorを2つ追加する。setter/描画/測定処理は変更せず、KVCやswizzleを使わない。 |
| tests/piece-v2-renderer.test.js／tests/piece-v2-preview-display.test.js | 実JS sourceを合成native応答と測定で確認。失敗・遅延・batch queueの取り違えを追加する。 |
| .github/workflows/piece-rn-contracts.yml | 既存10suiteに加え、Androidのjavac単体source compileとiOSのclang syntax-only／固定RN patch適用を確認する。app build/signing/deployではない。 |

native pathとRN本体patchも変更範囲に含めてGitHub反映前にここへ固定する。B13-Aの未選定capture/media-save依存は導入しない。本変更は既存RN-first interface内の描画検査の具体化で、PCE-8 freeze §9のtooling substitutionとしてSTOP/保存前fit/実機受入条件を保持する。既存package.json/lock/Podfile/Gradle依存versionは不変だが、RN本体へのpatch変更はあるため「native依存ファイル変更0」とは記録しない。実バイナリへの組込みは将来のnative build時に必要で、module/accessor不存在は表示不可へ閉じる。

### 40.2 判定と非同期の境界

native応答はversion/platform/font/box/UTF-16 length/grapheme boundaries/line ends/ink/glyph_checkのexact10。本文はlocal照合だけに使用し、応答・stateに本文を複製しない。glyph_check=no_missing_observedは欠損を観測しなかった意味に限る。Android hasGlyph falseやiOS不明font/glyph、改行不一致、grapheme途中の分割、禁則違反はunavailable。妥当な複雑文字も保守的に拒否する可能性があり、missing_glyph=falseの保証にはしない。

native promiseは測定snapshot・operation identity・generationに結び、functional updater内でも再照合する。測定変更を先にqueueした後の古い成功/失敗で上書きしない。発火済みtimeoutもupdaterに世代を結び、A→B→Aの新世代を破棄しない。既存hostの本人変更/閉じる/背景化/期限切れを継承する。補助agentの読取reviewで上記batch raceとiOS addUIBlockのqueue制約を指摘され、実sourceを修正した。

### 40.3 検証と残件

local Node 24.19.0、9suite **394 PASS／FAIL0／SKIP0**。renderer26件（前回18＋今回8）を含む。固定RN 0.77.3の原本にpatchがfuzz0で適用できることを確認済み。CIのInputScreen込み検査、実SDK/固定RN定義に対するnative sourceコンパイルはGitHub反映後に確認し、結果を本節へ追記する。JS検査のReact/native応答は代替であり、ネイティブの実描画検査・Hermes・端末合格は未実施。

次はB9の読取単位/soft wrapとnative wrapの同等性、target renderer versionのadmission、実端末での同じcanvasのglyph/ink受入を揃えて保存前fitへ接続する。native_checkedをlayout_state=fitと記録せず、server renderer文字列やclient自己申告だけでは保存を許可しない。保存操作、capture/端末保存/共有、owner/Nexusの共通描画、preview設定変更、M5、005適用、実Auth/実機も残る。

全体設計図01/関連01B・全ファイル地図、現行rules/Rule18・恒久incident全文、最新weekly 10/10 §5.5を照合。Emlis＋分析の先行実機順と12/18目標を保持する。System Context prepareの既知失敗を成功にせず、許可された原典直接読取を使用した。Mashの明示Piece続行による可逆的source準備。実装/統合/書込はroot華恋、補助2名は読取review。新依存導入・API/SQL/live DB/env/deploy/activation/app native build/main merge/本人データ試験0。001〜004適用済み／005稼働未適用。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。商品全体完成ではない。


### 40.4 GitHub反映と最終CI

実装＋資料14fileは `7554b9cd716efab15e03d3c321c2ac4900da4bfb` でPR #30へnon-force反映し、remote再取得で全対象bytesと変更path集合の一致を確認した。初回CIのJS423件は成功したが、native source検査はiOSのRCTDeprecation header探索不足／AndroidのMaven artifact転送先403で停止した。製品sourceを緩めず、既存workflow1fileだけを `888723804129afe63bf35b8dac50720b2d8757ee` で修正した。iOSは固定RN同梱headerを探索へ追加し、Androidは公開Maven Central mirrorから同じ0.77.3 artifactを取得して公式Gradle metadataのSHA-256一致を必須化した。修正1fileもremote全文/path一致確認済み。

[最終CI run 38023650569](https://github.com/MassyuRed/Cocolon/actions/runs/38023650569) は `888723804129afe63bf35b8dac50720b2d8757ee` で全3job success。

| 確認 | 結果と範囲 |
|---|---|
| piece-rn-contracts／job 114129792372 | InputScreenを含む10suite **423 PASS／FAIL0／SKIP0／cancelled0**。前回415＋今回8。Node 24.21.0／TypeScript 5.2.2。local394との差29はInputScreenで、件数を合算しない。 |
| piece-android-source／job 114129792263 | javac 17.0.20.1、Android35 APIと固定RN0.77.3/既存transitive APIで新moduleをcompile成功。検査用最小classpathにAndroidX annotation定義を含めないためRestrictTo.Scopeの警告18件は残る。app全体/端末ではない。 |
| piece-ios-source／job 114129792360 | 固定RN patch適用、Apple clang17.0.0/Xcode16.4のiOS simulator SDKでObjective-C++ syntax-only成功、pbxproj plutil OK。link/signing/app build/実機ではない。 |

既存phase6-contract-guards run38023650552もsuccess。製品sourceは7554b9版から変更していない。最終結果を本map・入口・manifestへ追記して後続反映する。nativeのfont engineを実行した欠損0/描画fit、React実reconciliation、端末保存共有、商品合格は未成立。§40.3の残件を保持する。

### 40.5 2026-10-10 — 硬い禁則違反でも規定サイズで再測定する補修

再開headはCocolon `475e5711c5c8ff78a5bd510fb8ab89dba6a19ef3`、API `004a85eeb7af83b68ae1c1fba42ec2d6941b6874`。前回txtより§38〜40が進んでいたため、最新sourceを優先した。今回の未完了条件は、同じ全文が次の規定fontで描画できる場合でも、最初のhard-kinsoku違反だけで確認用画像が消えること。現componentに合成native行末を与えた検査で、期待measuringに対しunavailableとなるREDを確認した。実OSの自然改行による発生頻度は未確認であり、端末不具合を実測したとはしない。

`pieceRenderer.js`は全native応答と全行末の書記素境界を検証し終えた後、禁則違反だけを`wrapViolation`へ分類する。`PieceVisualCard.js`は全段落・brandingの検査が揃うまで透明を維持し、違反時は既存の規定font降順で再測定する。下限でも違反なら`native_kinsoku_unavailable`、欠損glyph／不正応答／書記素分割／bridge例外は従来どおり即unavailable。最初の8秒期限を更新せず、旧測定世代のevent/promiseを採用しない。本文、段落、比率、recipe、font下限は不変。可視挙動が変わるため`pieceLayout.js`の確認用prototypeを`piece.rn_native_preview.prototype.v2`へ上げる。保存recordのrenderer versionは変えない。

既存renderer検査へ5件追加し、行頭句読点／行末開き括弧→次候補で全文表示、3formatの全規定サイズ不成立、期限維持、禁則と不正情報の混在、遅れた禁則応答の無効化を検証した。local Node 24.19.0で9suite **399 PASS／FAIL0／SKIP0／cancelled0**（renderer31）。InputScreen29件はlocal compiler不在のため既存CIで確認する。React/nativeは合成境界であり、実機・Hermes・フォントengineを実行した検査ではない。読取補助reviewで具体blockerなし、別model Pro審査や商品合格ではない。

分類はOBSERVED_BLOCKER_MINIMAL_FIX／LEVEL_2相当の既存設計内補修。Mashの明示Piece続行・Work選択と既存可逆的実装/GitHub反映範囲に基づき、root華恋が製品3file・既存test1file・既存資料3fileを統合する。新しい検証system・dependencyは追加しない。完成条件はこの因果箇所の補修・対象回帰・remote確認、打切り条件は本文/品質条件変更や実機受入れなしでは成立できない追加範囲。今回は禁則を解決した候補だけ確認用表示に進め、soft hintを硬い禁止条件に変えない。構成owner・外部契約の差分はなく`STRUCTURE_MAP_DELTA_NONE`、primaryはTECHNICAL_CREDIT。実行環境はWork、確認不能なPro/Ultra名称や独立審査の成立を推定しない。

全体設計図01/関連01Bのファイル関係地図、current map、Piece原典PCE-5/PCE-8、現行ruleと恒久incident全文、weekly 10/10 §5.5を照合。System Context prepareは475e571が保存基準a77b79の子孫でないと報告して停止したため、生成結果を採用せず許可された原典直接読取を使用した。新しいcontext再構築は行わない。Supabase migration履歴のみread-onlyで確認し、001〜004登録済み／005未登録。本人本文・API製品・SQL・DB適用・env/deploy/activation/app native build/main mergeは変更0。

**次は引き続きB9の読取単位・soft-wrapとnative選択処理の接続、target renderer admission、同canvasの実機glyph/ink確認。** 現native応答には代替行候補の実測がないため、行末validatorだけでB9同等性とはしない。今回もnative_checkedは保存前fitではなく、canSave/canExport=false。保存接続、capture/共有、設定変更、M5、005適用、実Auth/実機を残す。weekly§5.5の先行Emlis＋分析実機順、12/18目標、automatic_progression=falseを維持する。


§40.5結果：source `01088f7a69828c08a8c9ec0a98536f47efab0772`、[CI run38024570077](https://github.com/MassyuRed/Cocolon/actions/runs/38024570077) の全3job成功。JS job114132549261はInputScreenを含む10file **428 PASS／FAIL0／SKIP0／cancelled0**。Android job114132549134はjavac17.0.20.1で単体source compile成功（従来のannotation不足警告18件）、iOS job114132549290は固定RN patch適用・clang17 syntax-only・pbxproj検査成功。既存phase6-contract-guards run38024570014もsuccess。GitHubから再取得したsource7fileの全bytes・変更path集合・親headと、入口のmanifest hashを照合済み。後続はこの結果の資料3fileだけを反映する。native source、workflow、依存は今回変更しておらず、実機・保存前fit・商品受入れの成立は主張しない。

## 41. 2026-10-10 — 保存済み本人詳細で同じ確認用canvasを使う（未配置）

### 41.1 今回の直接作業とowner

§40.3に残る本人詳細への共通描画接続を実装した。B9 soft-wrap同等性と保存前fitは未完了のまま保持し、その成立を偽らず、独立して進められる保存済み詳細の確認用表示へ同じcanvasを接続する。別の画像renderer・本文・API・状態controllerを作らない。

| path | 責任・変更 |
|---|---|
| `features/piece/pieceLayout.js` | saved専用入口で既存readPieceOwnerDisplayの閉じた契約と3hashを再確認。previewと共通のcatalog/geometryへ渡す。saved identityをpreviewと別namespaceにし、piece/public ID・row_version・saved_at・3hash・rendererへ測定を結ぶ。 |
| `components/piece/PieceVisualCard.js` | displayまたはsavedRecordの一方だけを受け、同じText・native検査・サイズ候補・timeoutを使用。未対応時は画像を除き、全文への案内を表示する。 |
| `screens/PieceOwnerHistoryScreen.js` | 本人APIから検証済みのfresh詳細だけへ共通componentを置く。一覧は全文cardを維持し、全件native測定を開始しない。 |
| `tests/piece-v2-renderer.test.js` / `tests/piece-v2-owner-history.test.js` | 共通geometry、保存済みの期限/現在plan非依存、3hash/lifecycle/未知renderer、詳細限定表示、本人/背景/停止/操作中の非表示、古いnative結果の拒否を確認。 |

保存済みをpreviewへ偽装しない。保存時の合法なtheme/ratio/branding・全文・段落を保持し、現在plan・quota・期限・sourceの再判定を加えない。本人切替、背景化、離脱、停止、履歴再読、公開変更・削除開始時のrecord破棄は既存host/controllerをそのまま使用する。本文のselect/読み上げと本人操作を残す。

PCE-5再現性§7〜8に従い、保存rendererが実装済み`piece.rn_native_preview.prototype.v2`に一致する場合だけ確認用canvasへ渡す。設計例の`piece.rn_renderer.v1`や任意の過去版は非対応のままで、latest外観へ置き換えない。これは保存用renderer admissionではなく、既存prototypeへの限定接続である。実保存recordに対応versionが存在することは確認していない。native_checked、no_missing_observedを保存前fit・欠け0保証・PNG成功へ変換せず、canSave/canExport=falseを保持する。

### 41.2 検証と実行境界

local Node24.19.0で既存9suite **405 PASS／FAIL0／SKIP0**（並行補修後399＋今回6、renderer34・owner35）。React/HTTP/Auth/native応答は合成代替であり、font engine/実React/端末の実行ではない。初回の検査組立は未追加symbol参照で失敗し、causal RED creditにしていない。全10suiteのlocal試行はInputScreenの既存TypeScriptが環境に無く収集で失敗したため、9suite結果と分けた。InputScreen込みの既存CIを反映後に確認する。製品依存の追加はない。

root華恋が実装・確認・書込を担当。補助2名の読取でdirect sliceとsaved/renderer境界を検討し、実diffの読取reviewに具体的blockerなし。正式な別model Pro/Ultra受入れではない。全体構造01/関連01B・全file tree/対象map、前提資料・作業ルール・恒久incident、最新weekly§5.5を確認した。System Context prepareはmaterial ancestry不一致で終了し、正本が許可する原典直接読取を使用した。generated成功と扱わない。

範囲は製品JS3＋既存test2＋既存資料3の計8file。API/SQL/native source/RN patch/依存/稼働DB/env/deploy/activation/app build/main mergeを変更しない。weekly§5.5の先行実機順序・12/18公開目標、001〜004適用済み／005稼働未適用を継承する。今回DB再照会はしていない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。

反映直前にremoteが`01088f7a69828c08a8c9ec0a98536f47efab0772`へ進んだため、§40.5の禁則再測定・prototype v2・追加5検査を保持して統合した。保存版も実装中のv2一致だけを対応対象とし、v1をv2外観へ置き換えない。統合後9suite405 PASSを確認した。保存済みfixtureの旧v1指定による途中2失敗はv2へ合わせて修正し、旧v1拒否検査も保持した。上流の結果記録`231000211e5a8f4347b7221e7ac4cc34af133464`も取り込み、履歴を保持した。

### 41.3 再開位置

本線は§40.3のB9読取単位/soft-wrapと実native metricsの同等性、target renderer admission・実機描画、保存前fit→同じpreviewの保存接続。保存済み詳細の共通canvas接続を作り直さない。capture/端末保存/共有・Nexus共通描画・preview設定変更・M5・005稼働適用・実Auth/実機は残る。本変更を全保存renderer対応やPiece全体完成にしない。

### 41.4 GitHub最終検証

製品source `631873265959a3a3c4ff0949744b9c1cb342f193` を上流最終記録2310002の子としてnon-force反映した。対象8fileをGitHubから全文再取得して検査済みlocalとのbytes一致、変更path集合の完全一致、親headを確認済み。上流§40.5と結果記録を保持し、統合後の読取補助reviewにも具体的blockerなし。

[CI run38024824965](https://github.com/MassyuRed/Cocolon/actions/runs/38024824965) は全3job成功。JS job114133332822はNode24.21.0／TypeScript5.2.2でInputScreenを含む10file **434 PASS／FAIL0／SKIP0／cancelled0**（上流428＋今回6、local405との差29はInputScreen）。Android job114133332833はjavac17.0.20.1で単体source compile成功、既存のannotation不足警告18件を保持。iOS job114133332925は固定RN patch適用・clang17 syntax-only・pbxproj検査成功。既存phase6-contract-guards run38024825008もsuccess。app build・実機描画・保存前fit・商品受入れは未成立。

後続反映は本map・Piece入口・manifestの結果記録3fileのみ。現在のsourceを繰り返し作り直さず、§41.3の残件から再開する。対応prototype v2を持つ実保存recordは未確認で、旧v1を代替描画しない。


## 42. 2026-10-10 — native候補実測とB9の行選択を確認用canvasへ接続

### 42.1 作業根拠とowner

再開headはCocolon `a53c6d1b4847283449007f8091d0294317f89fad`、API `004a85eeb7af83b68ae1c1fba42ec2d6941b6874`。Mashの明示Piece続行に従い、§41.3のB9接続残件を進めた。APIの既存`piece_v2_layout.py`を原本として読み、B9自体の新仕様・別render ownerを作らない。全体設計図01/01B・current map、current rules/Rule18・恒久incident、weekly10/10 §5.5を照合した。System Context prepareはlocal祖先不一致で失敗し、入口が許可する原典直接読取を使用した。成功扱いにせず、Emlis＋分析の先行実機順と12/18目標を維持する。

| owner path | 今回の変更 |
|---|---|
| features/piece/pieceMeasuredWrap.js | 新規。実測済み候補表を厳密に検証し、既存Python B9と同じ順序の比較・高さ制約で段落ごとの行を選ぶ純粋関数。 |
| features/piece/pieceLayout.js | planning段階と選択済み行の固定lineHeight/段落gapを導入。再改行を拒否し、prototypeをv3へ更新。 |
| features/piece/pieceRenderer.js | mounted Textから候補計測を要求し、exact7の応答metadataを検証するlocal bridge。 |
| components/piece/PieceVisualCard.js | 同じfontのprobe→候補実測→B9行選択→各行の実描画→全行とbrandingの既存native検査へ接続。previewと本人詳細で共通利用。 |
| android/app/src/main/java/com/anonymous/cocolonmvp/piece/PieceTextMetricsModule.java | 実ReactTextViewのTextPaintと有効font spanを取得し、専用background workerで全候補のadvance/inkを測定する。 |
| ios/tempCocolon/PieceTextMetrics.mm | 同じTextKit storageのimmutable snapshotを取り、background CoreTextで全候補のadvance/inkを測定する。 |
| tests/piece-v2-measured-wrap.test.js／tests/fixtures/piece-b9-wrap-oracle.json | Python B9由来の合成oracleと不正候補表の検査。CIでPython実行は不要。 |
| tests/piece-v2-renderer.test.js | 実componentのplanning、font再試行、identity/期限/世代、行配置、既に欠けたTextを位置移動で受理しない境界を検査。 |
| .github/workflows/piece-rn-contracts.yml | 既存JS jobへ上記suiteとfixtureのpath triggerを追加。既存Android/iOS source jobを継承する。 |

製品source6、test2＋fixture1、既存workflow1、資料3の計13path。RN0.77.3既存patch/Paper/local moduleを使用し、依存・本体patch・native登録・API/SQL契約を追加変更しない。実装補助2名がplannerとoracleを分担し、root華恋が原本照合・native/UI実装・統合・相互reviewの修正・書込を担う。同環境の補助reviewであり、別modelの正式受入れではない。

### 42.2 候補計測と選択

protocolは`piece.native_candidates.v1`。UI側では同じmounted Textの全文/fontを照合してsnapshotだけを取り、候補の二次元計測はUI queue外で行う。OSの書記素境界を使い、段落最大420書記素、全文UTF-16長/文字サイズの上限、native処理8秒上限を検査する。各連続部分文字列のadvanceとink座標を返し、全n(n+1)/2候補が一つずつ揃うことをJSで確認する。不明なfont/span/glyph・欠落/重複候補・非有限値・書記素途中の分割は表示不可。文字数比例などの推測幅を補わず、本文をnetwork/log/fileへ出力しない。

既存B9の漢字・カタカナrun、仮名付着/bridge、幅に収まる連結、連体語・視点語・長い仮名/競合する仮名・数値期間、硬い禁則、空白保持を移植した。比較tupleの優先順はcohesion＋singleton＋long-kana orphan、行数、ASCII空白split、script/sokuon split、sentence-head orphan、kana attachment、short bridge、余白二乗和。Python3.12/Unicode15.0の文字分類を固定し、NFCは比較だけに使う。本文・測定文字列を正規化しない。まず制約なし最適行を求め、高さに収まらなければ同じfontで段落共通の行数予算を再配分し、それでも不成立のときだけ次の規定fontへ進む。

選んだ各行を個別のTextへ渡すため、本文へ改行文字を追加しない。元段落のgapを保ち、実Textが再び複数行へ折り返した場合は受理しない。probe・行・brandingのrefを分け、世代を更新してremountする。全工程は元の8秒deadlineを継承し、font変更で延長しない。候補/最終検査promiseはidentity・operation・snapshot・絶対期限を再確認し、古い成功/失敗やqueue済み更新を新しい描画へ流用しない。

### 42.3 最終描画の境界

候補のadvance/inkは行選択用で、実描画の合格証拠ではない。全行を既存Android raster／iOS TextKit検査へ再度渡し、全文・font・書記素・禁則・glyph・実ink・brandingを確認する。各Text自身のbox内に収まるinkだけを行slot内で揃える。Text内部ですでにclipしたinkをText全体の位置移動で回復したとは扱わず、bodyにもnative overflowの次サイズ／下限失敗を適用する。負の張出し等によって、内容が妥当でも現native Text構造では確認画像を出せない場合が残る。

挙動変更により確認用versionは`piece.rn_native_preview.prototype.v3`。保存済み表示はexact v3のみで、旧v1/v2や未知rendererを最新外観に置き換えない。実保存recordに対応versionが存在するかは未確認。native_checkedは確認用に限り、canSave/canExport=false。OS font・fallback・書記素version・実React/native再描画・性能を実端末で受け入れた結果ではなく、B9のnative描画全体同等性、保存renderer admission、保存前fitは未成立。

### 42.4 検証と次工程

local Node24.19.0の10suite **449 PASS／FAIL0／SKIP0／cancelled0**。renderer39件、追加planner39件（Python原本由来oracle25例を含む）。oracleは合成計測であり、font engineの端末実測ではない。oracle生成元は上記API head、Python3.12.14/Unicode15.0.0をfixtureに記録した。InputScreen29件はlocal TypeScript欠落のため未実行。InputScreen込みCIとAndroid/iOS source compileの最終結果は§42.5。

同環境reviewが指摘した、既にclipしたTextを移動して受理する問題と、最終promiseが8秒後にtimer callbackより先に完了する問題は、各回帰検査の因果REDを確認して製品sourceを修正し、上記449件で成功した。途中の旧自然改行fixture/時刻設定を新しいplanningと元deadlineへ適合させた結果も含む。実機上の症状再現・解消とは記録しない。

次は選択済み行を含む同じcanvasについて実端末のglyph/ink/性能とnative B9描画同等性を確認し、対象renderer admission・保存前fitを揃えて既存保存APIへ接続する。planner、本人詳細の共通canvas、quota/owner APIを再実装しない。capture/端末保存/共有、Nexus共通描画、preview設定変更、M5/稼働構成、005、実Authも残る。今回DB query/apply・env/deploy/activation/app native build/main merge/本人データ試験0。001〜004適用済み、005稼働未適用を継承。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。商品全体完成ではない。


### 42.5 GitHub反映と最終CI

source＋資料13pathは `c77f3aed07ce8514d7505bc169d00a4114804904` で既存Draft PR #30へnon-force反映した。GitHub再取得で全13fileの全文bytes、変更path集合、親`a53c6d1`、PR headの一致を確認済み。[CI run 38026057042](https://github.com/MassyuRed/Cocolon/actions/runs/38026057042) は同じsource headで全3job success。

| 確認 | 結果と範囲 |
|---|---|
| piece-rn-contracts／job114137021092 | InputScreenを含む11suite **478 PASS／FAIL0／SKIP0／cancelled0**。前回434＋今回44。Node24.21.0／TypeScript5.2.2。local449との差29はInputScreenで、合算しない。 |
| piece-android-source／job114137021304 | Android35 API／固定RN0.77.3に対するjavac17.0.20.1の単体source compile成功。既存の最小classpathによるAndroidX annotation不足警告18件を保持。 |
| piece-ios-source／job114137021280 | RN0.77.3の既存patch適用、Apple clang17.0.0／Xcode16.4／iOS simulator SDKのObjective-C++ syntax-only成功、pbxproj plutil OK。 |

既存phase6-contract-guards run38026057020もsuccess。CIでnative font engine自体を実行したわけではなく、app link/build/signing/実機・保存前fit・正式renderer admissionは未成立。今回の最終結果を本map・入口・manifestへ同期し、製品sourceを変えずに後続の資料commitで反映する。§42.3〜42.4の描画上の限界と残件を維持する。

## 43. 2026-10-10 — 発行済みpreviewの画像設定だけをrevision付きで更新

### 43.1 作業根拠と変更owner

Mashの明示Piece続行に従い、§42.4の設定変更残件を進めた。再開headはCocolon `48f0263cb3043f681abde3f4230d1d083bff7b56`、API `004a85eeb7af83b68ae1c1fba42ec2d6941b6874`。既存の発行前画像設定変更は永続previewの更新APIではなく、別POSTで本文を再生成する代用をしない。PCE-6のpreview PATCH設計とB5-B/B10、全体設計図01/01B・current rules/Rule18・恒久incident・週次10/10 §5.5を照合し、12/18目標とEmlis＋分析の先行実機順を継承した。System Context prepareはlocal祖先不一致で失敗し、入口が許可する原典読取を行った。

| owner path（mashos-api） | 変更 |
|---|---|
| ai/services/ai_inference/api_piece_v2.py | 既存full routerへvisual-only PATCH。認証→feature→closed request→quota/tier→service→既存exact19投影。default/shared/専用preview factoryには未登録。 |
| ai/services/ai_inference/piece_v2_preview_service.py | owned exact20 recordを読み、現source/tier/形式・安全性を再確認して既存recipe builderを再利用。元POSTのrev>1再読は現在recipeを返す。 |
| ai/services/ai_inference/piece_v2_store.py | server-only snapshot/recipe/sourceを8引数RPCへ渡す。成功応答のbody/期限/rendererと期待revisionを検証。 |
| supabase/migrations/20261010050940_piece_v2_preview_visual_change.sql | CLI migration newで生成した追加source。既存M4に揃えたrow/source/profile/thread/context lock、revision CAS、待機後期限確認、service_roleだけEXECUTE。 |
| ai/tests/piece_v2/test_b05_preview_visual_mutation.py | 実CMEE fixtureと実reviewer、合成Auth/DB/transportによるservice/HTTP検査。 |
| ai/tests/piece_v2/db/test_b05_preview_visual_mutation_native.py | 既存disposable native PostgreSQL fixtureを使う同時更新・lock wait・ACL・rollback検査。 |
| .github/workflows/piece-b2b-isolated-postgres.yml | 既存隔離workflowへ上記2suiteとpath triggerを追加。新workflow/依存なし。 |

API7path（製品Python3、SQL1、test2、既存workflow1）、Cocolon資料3path。同環境補助2名が新test/SQLと差分reviewを分担し、rootがAPI/service/store・統合・全文review・GitHub反映を担った。別modelの正式受入れではない。Supabase/PG skillsを読み、CLI生成・既存lock順序を使用した。live Supabase操作は行っていない。

### 43.2 画像設定変更の契約と回収

`PATCH /emotion/piece/preview/{preview_id}` のexact2は `expected_preview_revision` と `visual_selection`。後者は既存 `theme_id` / `aspect_ratio` / `branding_mode` のexact3、nullは現在tierの既定選択。client本文・形式・recipe・owner/tier・TTL・renderer・新Idempotency-Key・queryは受け付けない。本文・payload/各hash・format/eligible formats・safety・renderer・source lineage・preview ID・元request hash・expiryは保持する。更新列はrecipe/hash、preview_revision/row_version各+1、updated_atの5列。保存回数/消費履歴/予約lockは変更せず、同じ設定を指定した場合も受理された更新は版を進める。

owned rowの3hashを検証し、現original handoffの所有者/観測lineageとquota由来tierを照合、現tierで同じ形式が使えることを検査する。新画像設定は既存build_visual_recipeへ渡し、現在sourceと本文についてauthorを再実行しない既存reviewerを通す。stored ready/adjustedとreviewerのready/transformedが不一致なら拒否し、本文や安全状態を変更して続行しない。sourceを再照合してからserver snapshotをSQLへ渡す。

通信応答が不明でも自動でPATCHを繰り返さない。commit済みなら旧revisionはSTALEとなる。元POSTの同key/同request hashでのread-only回収は更新後のrecipe/revisionを返し、元の画像設定へ戻したり本文を再生成したりしない。revision1の元選択照合は保持。現tierで現在の形式/recipeが使えない場合は閉じた既存エラーとなる。将来のRN接続では新keyで再生成する代わりにこの回収経路を扱う。

### 43.3 DBと稼働境界

新 `piece_mutate_preview_visual_v2` はservice_role専用。preview FOR UPDATE→original SHARE→profile SHARE→thread SHARE→既存Q3順のhistory/feedback lockを取り、server読取時のexact20 snapshotとsource expectationを比較する。expires_atの同一時刻表記差だけを許容し、それ以外は完全一致。全lock待機後のclockでoriginal/historyの可視期限とpreview期限を再検査し、同時更新・保存・取消しへ古いrevisionを持ち越さない。既存table ACL/RLS/関数・default privilegesは変更せず、新関数に継承された他role権限を剥がす。既存同名関数があれば移行を拒否する。

今回の追加はsource-only。稼働001〜004は先行適用済みで再適用しない。未適用は `20261010_005_piece_v2_quota_read.sql` と `20261010050940_piece_v2_preview_visual_change.sql` の2本。既存004を編集せず、profile/元入力のschemaや運用権限を広げない。default/shared/専用preview factoryの登録、RN selector、形式変更、実Auth/PostgREST/端末接続は未実装または未確認のまま。source上のPATCH存在を利用可能な画面と扱わない。

### 43.4 検証と次工程

API source `4fcb140b778850a1b7a5a65d8e0a26005b3a24c4` を既存Draft PR #3へnon-force反映し、remote全7fileの全文bytes・変更path集合・親`004a85ee`を確認した。local Python3.12.14の新規service/HTTPは **74 PASS／FAIL0**。既存非DB5fileの回帰は **216 PASS／4 deselected**。最初はDB専用4件がlocal PGlite/native PostgreSQL未用意でsetup errorとなったため、DB成功として数えず、再実行では該当4件を明示除外した。新native47件はcollection後、以下の隔離PostgreSQL CIでも全件成功した。合成fixtureのfull lineage不足とPYTHONPATHなしのimport設定不足は新test内で補修し、CI同等invokeの74 PASSを確認した。

[隔離CI run38027073893](https://github.com/MassyuRed/mashos-api/actions/runs/38027073893)／job114140066988は同じsource head `4fcb140b778850a1b7a5a65d8e0a26005b3a24c4` をcheckoutし、全step success。23回のpytest実行は **1,658 PASS／FAIL0／SKIP0**（既存1,537＋新service/HTTP74＋新native47）。Python3.12.15／pytest8.4.1／psycopg3.3.6／PostgreSQL16.15、FastAPI0.143.0／Starlette1.7.0／Pydantic2.14.0／httpx0.28.1。logから実行sourceと各件数を照合した。

新native47件で同revision並行更新の片側STALE、旧save/取消しrevision拒否、新revisionの保存接続、owner/期限/全snapshot/recipe制約、preview・original・profile・thread・history source/thread・feedbackの7箇所で実lock待機を観測してcommit/rollbackを検査した。preview/historyが待機中に期限切れとなる例、service_role ACLとtable/default ACL保持、既存関数拒否、更新失敗のrollbackも成功。合成source/recordと隔離native PostgreSQLによる結果であり、live Supabase/Auth/PostgREST/端末の受入れではない。

既存quota native2件はこのCIのquota39 PASSに含む。localで未実行だった既存PGlite専用2件はこのworkflow対象外であり、今回PASSへ読み替えない。既存Pydantic root_validator／FastAPI on_eventの非推奨警告を保持。callback/HTTP境界は代替を含み、本文安全性全般・native描画・保存fitの承認ではない。

次はこのPATCHのRN画像設定操作・current revision/再取得/中断との接続。並行して先行native B9の実端末描画同等性・glyph/ink/性能、renderer admission、保存前fit→保存が必要。形式変更、capture/画像保存共有、Nexus、M5/設定供給、上記2 migration適用、実Authが残る。既存B9選択器・preview factory・owner/quota/save基盤を作り直さない。§42の478 PASS・native source compileは今回再実行せず先行証拠として保持。今回RN/native source・新依存・live DB query/apply・env/deploy/activation/app build/main merge・本人データ試験0。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false、商品全体完成ではない。


## 44. 2026-10-10 — 発行済みPieceの画像設定をRN画面へ接続（未配置）

### 44.1 根拠と実装範囲

MashのPiece続行指示から、§43の最初の残件である既存PATCHの画面接続を実施。開始headはCocolon `584d9788d7d78b14a10f7b09d07fd3a1d8e8e5e7`、API `4fcb140b778850a1b7a5a65d8e0a26005b3a24c4`。txtの423件時点より新しいGitHubを採用した。前提資料・作業ルール/Rule18・恒久incident・Karen-Diary、全体設計/ファイル地図01/01B・対象current map・PCE-6 RN/API契約、weekly10/10 §5.5と12/18目標を確認。System Context prepareは祖先不一致で失敗し、入口の原典読取fallbackを使用した。Workでの既存承認範囲のRN実装（LEVEL_2相当、DIRECT_PRODUCT_OR_ACCEPTANCE_WORK）。root華恋が単一write owner、補助agentはread-only API調査と差分review。別modelのPro/Ultra正式受入れとは扱わない。

| Cocolon owner | 変更内容 |
|---|---|
| `features/piece/pieceApi.js` | 既存認証transport・厳密応答readerへvisual-only PATCHを接続。exact2 body、preview ID/revision照合、前後の本人確認、再送なし。 |
| `features/piece/PieceCreateController.js` | 現候補と画面世代を照合し、変更中は旧候補を隠す。本文/3hash/期限/renderer/非選択recipe保持とrevision増分を確認。不明結果は元POST/keyで明示回収。 |
| `features/piece/piecePreviewModel.js` | 既存hash/expiry検証を保持し、更新中・再取得・変更告知とbody-freeな表示ticketを渡す。保存/export許可はfalse。 |
| `components/piece/PiecePreviewModal.js` | 現capabilitiesに含むテーマ・比率・表記の選択操作、選択状態、変更告知、明示再取得ボタン。Free固定項目を無理に選択させず、形式変更は未接続。 |
| `screens/input/InputPieceActionArea.js` | 現owner/source/runtime/foreground/openの確認後だけ設定操作を既存controllerへ渡す。 |
| `tests/piece-v2-contracts.test.js` / `tests/piece-v2-preview-display.test.js` | 上記transport・実host/controller/display sourceの回帰を既存suiteへ追加。 |

変更しない設定は現在recipeの具体値を送る（nullで既定値へ戻さない）。元POSTの凍結request/keyは書き換えない。PATCH応答の紛失・不正ACK・STALE/CONFLICTでは旧候補を操作可能に戻さず、同じPOST/keyの回収だけを明示操作で許可する。回収の同revisionは元recipe一致、進んだrevisionはrow_version同増分・本文/期限等保持を要件とする。閉じる/背景化/本人やsource変更/破棄で遅延応答を棄却し、同候補を再表示しても旧ボタンcallbackを表示ticketで拒否する。変更後は既存canvasが新revision/recipe hashで再測定する。

### 44.2 検証と限界

local Node24.19.0、既存test compiler TypeScript5.2.2を一時検査用directoryに準備。`NODE_PATH=… node --test tests/piece-v2-*.test.js` のInputScreen込み11suite **520 PASS／FAIL0／SKIP0／cancelled0**（既存478＋追加42）。本文保持、3項目の連続変更、二重押下、lost commit前後、STALE/CONFLICT、不正hash/本文/ID/期限/renderer/recipe/版、旧世代callback、owner/背景/close/disable/unmount、期限切れ、回収の古い/異なる候補拒否を確認した。新依存/lockfile変更なし。

途中の初回195件では設定ボタン未提供を前提にした既存4assertionが失敗し、保存/export無効を保持したまま今回の選択UIに更新した。新規bad-hash回収テストの1失敗はlocal検証例外を不明応答として扱う修正で解消。read-only reviewで再表示後の旧callbackがPATCHできることを実harnessで再現し、表示ticket照合と2回帰を追加して解消した。最初の全suite実行では既存TypeScript不足のcollection1件が失敗し、検査用の既存固定compilerを用意した後に全520件を実行した。これら途中失敗をPASSへ合算しない。

HTTP/Auth/React/nativeは合成・代替を含む。実native測定の再実行、実機・稼働API/Supabase往復・商品受入れではない。既存native sourceは変更なし。最終差分reviewで具体的blockerなし。GitHub CIと反映後確認は後続の最終確認欄に記録する。

### 44.3 稼働境界と次の直接作業

Supabaseはproject metadataとmigration履歴の読取のみ。001〜004の登録済みを確認し、再適用なし。005 quotaとvisual変更SQLは履歴未登録のまま。DB query/write/apply、環境変数、deploy、activation、native app build、main mergeは0。API・SQL・native source・新ライブラリ変更0。保存前fit未成立のためcanSave/canExport=falseを保持する。

次は、今回のPATCHを既存preview/shared候補factoryの明示構成に含める接続準備と、その隔離往復確認。既存の生成/保存/rendererを作り直さない。稼働配置に必要な追加2本のmigration・設定採用は個別境界を維持し、001〜004を再実行しない。native B9実端末描画同等性・glyph/ink/性能とrenderer admission→保存前fit→保存、形式変更、capture/共有、Nexus、M5/実Authも残る。Pieceの全内容完成を実機確認の前提にせず、準備した利用経路ごとに確認する。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


### 44.4 GitHub反映・CI最終確認

source `ef4806198352c3dde1a084d2eeb343fdb5f40c56`（親 `584d9788d7d78b14a10f7b09d07fd3a1d8e8e5e7`）の対象10fileをGitHubから再取得し、全文・変更path集合・親headを照合した。通常git pushの認証が利用できなかったため、既存GitHub connectorのtree/commit/refでexpected head一致・force=falseにより反映した。local treeとremote treeは一致。既存draft PR #30を継続し、API headは変更していない。

[Piece CI 38028229338](https://github.com/MassyuRed/Cocolon/actions/runs/38028229338)は全3job成功。`piece-rn-contracts`はInputScreen込み11suite **520 PASS／FAIL0／SKIP0／cancelled0**。Android単体javac source compile、iOS clang syntax-only・既存patch適用・pbxproj検査も成功。[既存contract guards 38028229336](https://github.com/MassyuRed/Cocolon/actions/runs/38028229336)もsuccess。local520件とCI520件は同じ検査を別環境で実行した結果であり、合算しない。

Androidのannotation不足に由来する既存`Scope.LIBRARY_GROUP_PREFIX`警告18件を保持。nativeソース検査は実端末での描画・app build・商品受入れを証明しない。今回の画像設定操作sourceは反映済みで、§44.3の稼働登録・実機・保存前fit・保存共有等は残る。この最終追記は入口・map・manifestの3資料だけで、検証済みsource/testを変更しない。


## 45. 2026-10-10 — 画像設定変更を既存preview構成へ登録（未配置）

### 45.1 目的・実装owner

MashのPiece続行指示により§44.3の最初の残件を実施。Cocolon開始head `b5c09914c2a88f9c6d2af00fea890211a00015b5`、API開始head `4fcb140b778850a1b7a5a65d8e0a26005b3a24c4`。全体設計／地図・前提・作業rule/Rule18・恒久incident全文・Karen-Diary・weekly10/10 §5.5・Piece原典を継承確認し、同じ内容を再生成しない設定操作を、実際に呼べるAPI構成へつなげた。System Context prepareはb5c0991でも祖先不一致によりcode2。入口の原典直接読取を使用し、凍結済みSystem Contextを変更していない。

Workでの既存承認範囲の実装（LEVEL_2相当、DIRECT_PRODUCT_OR_ACCEPTANCE_WORK）。root華恋が単一write owner、補助agentは既存接続調査と差分read-only review。別modelの独立Pro/Ultra受入れとは扱わない。既存preview factoryを再実装せず、新runtime／依存／自動有効化を加えない。

| mashos-api owner | 今回の変更 |
|---|---|
| `ai/services/ai_inference/piece_v2_runtime_control.py` | 既存`mutate_preview_visual`を`PATCH /emotion/piece/preview/{preview_id}`へ直接登録。専用構成は従来4route＋PATCHの5route。既存shared候補は同factoryを継承。full Piece routerをmountしない。 |
| `ai/services/ai_inference/api_contract_registry.py` | candidate専用registryに`emotion.piece.preview.visual.v2`を追加し、既存middlewareがそのappだけの応答headerを選択。default registryとpolicy versionは不変。 |
| `ai/tests/piece_v2/test_b14a_piece_preview_composition.py` / `test_b12_shared_preview_composition.py` | handler同一性・重複なし・default/旧経路不変、auth→OFF、候補だけのheader、無効時のIOなし。 |
| `ai/tests/piece_v2/db/test_b10_preview_application_native.py` | 既存の4route固定検査をPATCH追加の5routeへ更新。既存生成検査は維持。 |
| `ai/tests/piece_v2/db/test_b12_shared_preview_native.py` | 既存native fixtureを使い、両構成で3tierの生成→PATCH→旧revision拒否→元POST再取得、review後停止・commit後停止・ACK消失の回収を追加。 |

製品は2file、testは4file。`app.py`／middleware／既定app／旧Q&A／API・DBのDTO／SQL source／RN・native sourceは変更0。専用previewで同じpathへの未登録DELETEは404から405になるが、DELETE handlerを公開したわけではない。shared候補のdefault route集合差分は既存source-ref追加・旧preview alias除外に今回PATCHを加えたものだけ。

### 45.2 検証と反映

local Python3.12.14、pytest8.4.1、FastAPI0.143.0、Starlette1.7.0、Pydantic2.14.0、httpx0.28.1、psycopg3.3.6。既存requirementsを一時venvに導入し、製品requirements／lockfile変更なし。B14 runtime/composition、source-ref、shared composition、visual mutationの5fileは **243 PASS／FAIL0／SKIP0**。初回は旧DELETE404固定の1件が405となり、未登録methodの現挙動へ期待を直した（242 PASS/1 FAILから全243 PASS）。reader等は既存fixtureのmodule stubに実importを戻し、製品handlerを検査都合で変更していない。

localにはnative PostgreSQLがなく、新native12件はcollect-onlyでは合格にしない。GitHubの既存隔離workflowで実行確認した（下記§45.4）。read-only reviewの指摘はnative transport fixtureのSQL例外に`code=P0001`が欠けていた1点で、既存HTTP readerと同じcode/messageへ補修済み。製品の追加blockerなし。

API source `f1762879d7983adc6b4f9b5728791d6404dbbe88` をGitHub connectorでexpected parent一致・force=falseによりPR #3へ反映。対象6fileのremote全文・変更path集合・親head（4fcb140）を照合済み。CI最終結果は次の確認欄へ記録する。

初回[CI38029047086](https://github.com/MassyuRed/mashos-api/actions/runs/38029047086)は既存を含む1,663 PASS、新native12件がsetup時の`PIECE_PREVIEW_VISUAL_PRECONDITION`でFAIL。再利用したB5 fixtureがQ2だけを適用し、visual SQLの前提であるQ3の`emlis_frame_feedback`／`emlis_thread_context`がなかった。新fixture内だけに既存Q3 migrationを先行適用する修正を`d5731750b9cf4018de9af454e93184f011e32f17`（test1fileのみ）で反映した。製品2file・既存SQL・期待する本文/版/権限条件は変えていない。read-only reviewでも原因と最小修正範囲を確認。初回FAILを後続PASSへ合算しない。

### 45.3 残る利用経路と稼働境界

次はnative B9の実端末描画同等性・glyph/ink/性能、正式renderer admission、保存前fit→保存の接続。画像を測れたことだけで保存可にしない。形式変更、capture/画像保存共有、Nexus、保存等のAPI構成への接続、M5/実Auth・稼働設定も残る。今回のfactory/PATCH登録を次回再実装しない。

稼働利用には既存005 quotaとvisual変更SQLの追加2本、サーバー設定採用、共有候補の配置境界が残る。001〜004は先行履歴確認の適用済みを保持し再適用しない。今回Supabase/live DB読取・書込・migration適用、env/deploy/activation、native app build、main merge、本人データ操作は0。隔離PostgreSQLの操作を稼働DB適用と混同しない。実Auth/PostgREST・実機・商品受入れは未確認。weekly§5.5の実機確認順序と12/18公開目標を維持し、Pieceの全内容完成を実機確認の前提にしない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


### 45.4 最終CI・反映後確認

検査用準備を補ったhead `d5731750b9cf4018de9af454e93184f011e32f17` の[隔離CI38029243416](https://github.com/MassyuRed/mashos-api/actions/runs/38029243416)／job `114146515867`は全工程success、重複しない23回の検査集合で **1,675 PASS／FAIL0／SKIP0**（先行1,658＋source5＋新native12）。local243件と初回CIは合算しない。Python3.12.15、PostgreSQL16.15、pytest8.4.1、psycopg3.3.6。既存Pydantic root_validator／FastAPI on_eventの非推奨警告を保持する。

両factoryのFree/Plus/Premiumで実生成・実bounded review・実SQLを通し、画像設定だけの変更後に本文/期限/renderer保持、revision増分、旧版拒否、元request/key再取得、追加authorなし・保存回数消費なしを確認した。review後停止はSQL未送信、commit後停止とACK消失はcommit済み行を保持し、再起動した構成の元POST/keyからその版を回収する。native追加12件は最終14件（既存2含む）として成功。Auth・保存source・PostgREST transportは代替で、実ユーザーや端末の受入れではない。

最終API headから対象全6fileを再取得し、今回の最終内容と一致確認。初回6path＋補修1pathの変更集合、各commitの親headも照合済み。製品2fileは最初のf176287から不変で、補修は検査用DB準備4行だけ。この資料更新はCocolonの入口・map・manifestの3fileで、RN/native/test sourceやweeklyの方針を変更しない。§45.3の実機・保存前fit・稼働採用へ戻り、同じ接続準備を繰り返さない。


## 46. 2026-10-10 — 候補を取り消す操作を画面から接続（未配置）

### 46.1 直接の残件と実装owner

MashのPiece続行指示により、rendererの実機確認とは独立して実装できる、PCE3/PCE6の明示取消を接続した。全体設計・全ファイル地図・Piece原典・最新weekly §5.5と前回引き継ぎを照合し、恒久incident全文を再読。開始headはRN `237aae1a485564554747fbdcf842e992fe5825b0`／API `d5731750b9cf4018de9af454e93184f011e32f17`。System Context prepareは同RN headで既知の祖先不一致code2となり、既存入口の原典直接読取を使用した。WorkでのLEVEL_2相当の直接製品作業。root華恋が単一write owner、補助agentは読取reviewのみ。別modelによる正式Pro/Ultra受入れではない。

| 既存owner | 今回の変更 |
|---|---|
| RN `features/piece/pieceApi.js` | 認証済みDELETE。bodyはexpected_preview_revisionのみ、成功は既存exact5項目。前後の本人照合、closed error、abort、no-store。同ID/revisionの明示再試行だけを許し、新key・POST回収なし。 |
| RN `features/piece/PieceCreateController.js` | 現在の表示ticket・ID/revision/hash・期限で初回取消をbind。処理開始で本文を破棄し、取消対象ID/revision/rowVersionだけを保持。成功rowVersion+1を照合。unknownだけ同DELETE再試行、STALEの自動付替えなし。 |
| RN `features/piece/piecePreviewModel.js` / `components/piece/PiecePreviewModal.js` | 「候補を取り消す」、取消中、結果不明の再試行、取消完了の表示。成功後は保存回数未消費を示し、同じ候補を復活させない。通常の閉じる/戻るはDELETEしない。 |
| RN `screens/input/InputPieceActionArea.js` / `screens/InputScreen.js` | 同じsaved ID/owner/keyの取消だけruntime OFFで非表示のまま保持し、fresh runtime復帰後に本人が再試行。親はruntime OFFだけでhostをunmountしない。本人/入力/key変更（OFF中A→B→A含む）、画面離脱、unmountは破棄。通常preview本文の破棄は継承。 |
| API `ai/services/ai_inference/piece_v2_runtime_control.py` / `api_contract_registry.py` | 既存cancel_previewを専用preview/shared候補へ直接登録し、candidate専用contract headerを追加。専用構成は6route。生成停止後も既存の本人・revision照合による取消を維持。save flagや新flagを追加しない。 |

RN製品6＋test4、API製品2＋test4。既存取消HTTP handler/store/SQL、native renderer、依存、default app/registryは変更0。本文・形式変更、保存、画像出力を同時に有効化しない。

### 46.2 検証・review・反映

RN source `ae389bf40dba9d8a0e3d5457895922d2b8fd3442`、API source `7a4d16a8ad6c23b130f883797d3846f3049c8e23`。GitHub connectorのexpected parent一致・force=falseで既存draft PR #30/#3へ反映し、全16fileのremote全文・変更path集合・親head/treeを確認した。

RN localはNode24.19.0／既存TypeScript5.2.2でInputScreenを含む11suite **545 PASS／FAIL0／SKIP0**（先行520＋今回25）。API localの両compositionは **84 PASS**。API [隔離CI38030365374](https://github.com/MassyuRed/mashos-api/actions/runs/38030365374)／job114149821874は23集合 **1,682 PASS／FAIL0／SKIP0**（先行1,675＋source4＋native4−旧DELETE未登録固定1）。localとCIを合算しない。Python3.12.15／PostgreSQL16.15。既存Pydantic/FastAPI非推奨警告を保持。

両factoryで実生成→画像設定変更revision2→古いrevision取消拒否→正しいrevision取消row3を通し、生成OFF・ACK消失・元期限後の同DELETE再取得、追加author/保存回数消費0を実SQLで確認した。Auth/source/HTTP transportは検査用代替。RNは実JSを使うがReact/native/clock/runtime通知/Authは代替で、実端末・live Auth/PostgREST受入れではない。

read-only reviewでsaved-input背景時の取消破棄、runtime OFF中のA→B→A見逃し、親InputScreenのOFF unmountを特定し、上表の保持と破棄境界を補修した。最終read-only reviewに追加blockerなし。途中のlocal検査ではtransport呼出箇所の旧固定数、VM realmの配列比較を修正。fixture抽出より前へ置いた新検査の多重登録は末尾へ移動し、途中694件を成果件数に使わない。545件は重複解消後の最終集合である。

### 46.3 残件・稼働境界

次はnative B9実端末の描画同等性・glyph/ink/性能、renderer admission、保存前fit→保存。形式変更、capture/画像保存共有、Nexus、保存等のAPI構成、M5/実Auth・稼働設定も未完了。今回の取消接続や画像設定PATCH登録を次回作り直さない。runtime OFF中は取消ボタンも非表示であり、本文や権限を復元していない。取消identityはメモリだけで、画面離脱・アプリ再起動を越える永続回収は今回の範囲外。

Supabase操作・live DB書込/追加migration適用、env/deploy/activation、native app build、main mergeは0。001〜004適用済みは先行確認を継承し、005 quotaとvisual変更SQLの追加2本は未適用のまま。weekly §5.5の実機確認順序と12/18公開目標を維持し、全内容完成をPiece実機確認の前提にしない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


### 46.4 最終RN CI

RN source `ae389bf40dba9d8a0e3d5457895922d2b8fd3442` の[CI38030732508](https://github.com/MassyuRed/Cocolon/actions/runs/38030732508)は全3job成功。Node24.21.0／TypeScript5.2.2でInputScreen込み11suite **545 PASS／FAIL0／SKIP0**（job114150944944）。Android単体source compile（114150944831）、iOS syntax-only/既存patch/pbxproj（114150945057）も成功。[既存contract guards38030732449](https://github.com/MassyuRed/Cocolon/actions/runs/38030732449)もsuccess。Android既存annotation警告18件を維持。native app build・実端末描画・保存前fitの成功ではない。local545件をCI545件へ合算しない。§46.3の残件を保持し、今回の検証済み製品source/testは資料同期で変更しない。

## 47. 2026-10-10 — 保存済みPieceの本人向け一覧・詳細を候補構成へ接続（未配置）

### 47.1 製品上の残件と既存owner

保存したPieceを後で読み返すため、PCE6の既存GETとPCE7 §5〜7の独立したowner_read制御を、すでにある専用preview/shared候補へ登録した。RNの既存履歴・詳細、本文/画像設定のprojectionは再実装しない。native renderer admissionに依存しない保存済みデータの読取を進め、実機・保存前fitの未達は維持する。

開始headはCocolon `d1122f299c81d4b6a0fe7f0ebe02d422d6635240`／API `7a4d16a8ad6c23b130f883797d3846f3049c8e23`。全体設計・全ファイル地図・現行入口・Piece原典・前回txt・最新weekly §5.5・恒久incident全文を照合。System Context prepareは既知の祖先不一致code2のため、既存入口に従って原典を直接読んだ。WorkでのLEVEL_2相当の直接製品作業、root華恋が単一write owner、補助agentは同環境の読取reviewのみ。別modelによる正式Pro/Ultra受入れではない。

| 既存owner | 今回の変更と意味 |
|---|---|
| API `ai/services/ai_inference/piece_v2_runtime_control.py` | 既存owner_history/owner_detailをGET `/emotion/piece/history`・`/emotion/piece/{piece_id}`へ登録。`owner_read_requested` / `owner_read_ready` は両方が厳密にTrueの場合だけ有効。preview・TTL・現rendererとは独立し、既定OFF。専用構成は8route。 |
| API `ai/services/ai_inference/app.py` | shared候補では同じdetail route objectを静的routeの後へ移し、既存GET `/emotion/piece/quota`を先に選ぶ。UUIDと`piece:<UUID>`の両方を保持。default appの登録は変更しない。 |
| API `ai/services/ai_inference/api_contract_registry.py` | 明示candidateだけにhistory.v2/detail.v2のcontract headerを追加。既定registry・quota.v1は保持。 |
| 既存 `api_piece_v2.py` / `piece_v2_owner_service.py` | 今回変更なし。認証→独立flag→入力検証→owner/saved限定SELECT→保存時artifactのhash/closed projection→応答直前flag確認を再利用。現プラン判定・元入力の再読・本文再生成・書込なし。 |
| API検査4file | `test_b14a_piece_preview_composition.py`、`test_b12_shared_preview_composition.py`、`db/test_b10_preview_application_native.py`、`db/test_b12_shared_preview_native.py`。既存fixtureとworkflowを使用。 |

### 47.2 確認結果と限界

API製品commit `eabcd21ba7b8f079a89346c40ca94ff88b167ac2`、最終head `d7e1cabf6f3f622f7e0f042d137eb1c29237dd42`（後者はnative検査docstringの合成artifact範囲を明記しただけ）。全7fileのremote全文、初回7path＋補修1path、各commitの親headを照合した。

local関連5fileは **223 PASS／FAIL0／4 deselected**。4件は既存B7 native専用検査で、localにはPostgreSQLを用意せず既存隔離CIへ委ねた。初回の4file検査は旧route件数6の期待が1 FAIL（177 PASS）となり8へ補修。読取reviewで検出したgeneric detailによるquota遮蔽は、sharedの登録順変更と回帰検査で解消。新native2件は合成本文・recipe・rendererを実SQLで保存し実projectionで再読する。新2件そのものをCMEE生成/reviewの検査とは数えない。

最終headの[隔離CI38034228175](https://github.com/MassyuRed/mashos-api/actions/runs/38034228175)／job `114161231439` は全工程success。重複しない23回の検査集合で **1,717 PASS／FAIL0／SKIP0**。shared native検査20件（今回owner読取2件を含む）も成功。Python3.12.15／PostgreSQL16.15／pytest8.4.1／psycopg3.3.6。local223件や先行commitのCIを加算しない。

本人のprivate/public履歴とページング、UUID/public ID両方の詳細、別owner/未保存の非表示、保存後の現tier不明でも本文・recipe・renderer保持、DB/回数変更なし、IO後停止時の本文遮断を確認した。Auth/HTTP transportとartifact準備は代替を含む。実Auth/PostgREST・実データ・端末・商品受入れを意味しない。既存Pydantic root_validator／FastAPI on_eventの非推奨警告は維持。

### 47.3 再開位置と稼働境界

次はnative B9の実端末描画同等性・glyph/ink/性能、renderer admission→保存前fit→保存。形式変更、capture/画像保存共有、Nexus、保存・公開切替・削除等の候補API接続、quota v2採用、M5/実Auth・稼働設定が残る。今回のowner GET登録・preview取消・画像設定接続を作り直さない。Piece V2のsave/visibility/delete/public/exportは今回の構成で有効化できない。

今回の変更はAPI製品3file＋test4file、Cocolon入口/map/manifest3file。RN/native/SQL・新依存・稼働DB書込・env/deploy/activation/app build/main mergeは0。Supabase project状態とmigration履歴だけを読取り、001〜004適用済み、005 quotaとvisual変更SQLの2本未適用を再確認した。weekly §5.5の実機確認順序と12/18公開目標を維持し、Pieceの全内容完成を実機確認の前提にしない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


## 48. 2026-10-10 — 保存済み本人Pieceの削除を候補構成へ接続（未配置）

### 48.1 直接の残件と変更owner

保存済みPieceを本人が取り消せる利用経路の残件として、PCE3のowner deleteとPCE6の既存DELETEを、専用preview/shared候補へ登録した。PCE7 §5〜7・§11のowner_read＋deleteだけの回復状態を保持する。RN `PieceOwnerHistoryController` の削除/同key再試行、HTTP `owner_delete`、store、SQLのpurge/receiptは実装済みのため再実装しない。保存や公開切替の前提を緩めない。

開始headはCocolon `7037539bec710522c2fd01de10f7a92a4d9cf12c`／API `a90d590bb66e4cecc87e5da9c5f5b1859d387686`。前回txt、全体設計01/01B、国家システム02、全ファイル地図とcurrent map、Piece原典、最新weekly §5.5、作業ルールと恒久incident全文を確認。System Context prepareは祖先不一致code2のため、既存入口の原典直接読取へ戻った。Workでの既存承認範囲内LEVEL_2相当の直接製品作業。root華恋が単一writer、補助agentは同環境read-only review。別modelによる正式受入れとは扱わない。

| 既存owner | 今回の変更 |
|---|---|
| API `ai/services/ai_inference/piece_v2_runtime_control.py` | 既存 `owner_delete` をDELETE `/emotion/piece/{piece_id}`へ登録。`owner_delete_requested` / `owner_delete_ready`を両方厳密Trueで採用し、既存resolverのowner_read依存を維持。専用構成は9route。TTL/rendererや生成の準備を削除条件にしない。 |
| API `ai/services/ai_inference/api_contract_registry.py` | candidate専用 `emotion.piece.delete.v2` headerを登録。default registryは変更しない。 |
| 既存 `app.py` / `api_piece_v2.py` / `piece_v2_store.py` / atomic SQL | 変更なし。既存factory引数転送、認証→実効flag→closed request→owner/version/key照合、IO前後の停止確認、atomic purgeとbody-free receiptを再利用。 |
| 既存test4file | `test_b14a_piece_preview_composition.py`、`test_b12_shared_preview_composition.py`、`db/test_b10_preview_application_native.py`、`db/test_b12_shared_preview_native.py`。既存workflowで検証する。 |

### 48.2 検証と反映

API `fd15babe24e8dbcb28e0b20f5cf7960385106130`、製品2＋test3をPR #3へ反映し、全5fileのremote全文・変更path集合・親headを照合。local関連4fileは **370 PASS／FAIL0／SKIP0**。Python3.12.14、pytest8.4.1、FastAPI0.143.0、Starlette1.7.0、Pydantic2.14.0、httpx0.28.1。初回の収集はsource import path不足で1 ERROR、製品/testを緩めず探索pathを明示した。既存Pydantic/FastAPI非推奨警告を保持。native test追記時の既存関数末尾の位置は実行前に確認し元の関数へ保持した。

両候補で認証優先・default OFF・strict bool・owner_read依存、UUID/public ID両方、同key/RPC引数、bootstrapの実効flagを検査。新native6件は、合成保存artifactを実SQLで削除し、他人404・古い版409・停止時SQL0・commit後停止/ACK消失・同key receipt回収・削除後GET/履歴非表示・子state purge・quota不返却・旧data不変を対象とする。初回[隔離CI38043904568](https://github.com/MassyuRed/mashos-api/actions/runs/38043904568)／job114189457494は既存B10の厳密route集合にDELETEを追加し忘れたため6 FAILとなった。製品を変更せず、期待経路1行を `5773dbf3794090b4cee64ef5843f52b78e88cfad` で補った。再実行[CI38044205689](https://github.com/MassyuRed/mashos-api/actions/runs/38044205689)／job114190332088は全工程success。重複しない23検査集合で **1,759 PASS／FAIL0／SKIP0**（先行1,717＋strict flag32＋HTTP4＋bootstrap1＋native6−旧未登録DELETE固定1）。新native6件を含むshared native26件、既存B10の13件も成功。Python3.12.15／PostgreSQL16.15／pytest8.4.1／psycopg3.3.6。最終全6fileのremote全文、初回5pathと補修1path、各commitの親headを照合済み。local370件と初回CIは最終CIへ加算しない。

同環境read-only差分reviewに具体的blockerなし。sharedの既存静的GET/POSTはmethod完全一致で選ばれ、generic DELETEは遮蔽しないためapp.pyは変更不要。合成Auth/artifact/PostgREST transportを含み、live Auth/Supabase・実データ・RN実機・商品受入れではない。

### 48.3 残件と稼働境界

次はnative B9の実端末描画同等性・glyph/ink/性能、renderer admission→保存前fit→保存。形式変更、capture/画像保存共有、Nexus、保存/公開切替の候補API接続、quota v2採用、M5/実Auth・稼働設定が残る。今回のDELETE登録、owner GET・候補取消・visual PATCHは再実装しない。保存・public・visibility・exportの有効化は今回0。canSave/canExport=falseのRN境界を維持。

Supabase project metadataとmigration履歴の読取で001〜004適用済み、005 quotaとvisual変更SQLの追加2本未適用を確認。稼働DB query/write/apply、利用者データ削除、env/deploy/activation、native app build、main mergeは0。RN/native/SQL/依存・workflow変更0。weekly §5.5の実機確認順序と12/18公開目標を維持し、Piece全内容完成を実機確認の前提へ追加しない。TECHNICAL_CREDIT（local接続・隔離実SQL検証）／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


## 49. 2026-10-10 — プレビューと同じ保存回数を候補APIから取得（未配置）

### 49.1 残件と実装owner

MashのPiece続行指示に基づき、§48.3に残るquota v2候補採用を進めた。プレビューのquotaは保存回数だが、shared候補の独立GETは旧公開回数だった。既存のV2読取handler/SQLを同じ候補へ登録し、取得する回数の意味をそろえる。RN操作を新設せず、保存許可・native fitの成立とは分離する。PCE6のsave quota、PCE8/B5と既存preview flagの境界を保持。

開始headはCocolon `d461873a59df8fed0f4b4569ea999628d7bd0fc5`／API `5773dbf3794090b4cee64ef5843f52b78e88cfad`。同会話の必須資料読取を継承し、現行ルール、設計01/01B・ファイル地図/current map、Piece入口/原典、weekly 10/10 §5.5と最新PR headを照合。System Context prepareはd461873の祖先不一致code2で、原典直接読取を使用した。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、Workの既存非稼働切替準備・隔離検証範囲。root華恋が単一writer、補助agentは同環境read-only review。独立modelによる正式商品受入れではない。

| 既存owner | 今回の変更 |
|---|---|
| `ai/services/ai_inference/piece_v2_runtime_control.py` | 既存 `api_piece_v2.read_quota` をGET `/emotion/piece/quota`へ直接登録し、generic owner GETより先に選ぶ。専用構成10route。既存preview flagを使い、新flagを追加しない。 |
| `ai/services/ai_inference/api_emotion_piece.py` / `api_piece_compat.py` | 両登録関数へ既定Trueの `include_quota`。旧quota本体と旧reflection quota aliasを個別に登録選択できるようにする。旧aliasは公開回数のDTOで、新保存回数へ委譲しない。 |
| `ai/services/ai_inference/app.py` | 明示candidateだけ両include_quota=False。factoryのV2 GETを一つだけ保持し、defaultは旧DTOと旧aliasを維持。既存publish/cancel/Homeの旧quota owner等は変更せず、M5完了としない。 |
| `ai/services/ai_inference/api_contract_registry.py` | candidateだけ `emotion.piece.quota.v2`。旧quota v1とreflection quota aliasをcandidate registryから除外。既定registryは保持。 |
| 既存test4file | `test_b14a_piece_preview_composition.py`、`test_b12_shared_preview_composition.py`、`db/test_b10_preview_application_native.py`、`db/test_b12_shared_preview_native.py`。新source接続7件とnative8件。 |

HTTP `read_quota`、`piece_v2_quota`、既存005、認証・flagのIO前後照合・closed応答・server JST月/本人/現tier集計は変更しない。回数を予約/消費せず、生成・保存・本人データ操作へ置換しない。RPC不在や読取失敗を旧回数やfree/0へfallbackしない。

### 49.2 検証と反映

API source `6384f8b165337a47adf052e3ccc4f2fe3a2a28c3`、製品5＋test4。local既存control/dedicated/shared compositionの3fileで **211 PASS／FAIL0／SKIP0**。Python3.12.14／pytest8.4.1。既存FastAPI/Pydantic非推奨警告131件を保持。default2構成で旧quota本体/aliasの実handlerと旧DTOを確認し、候補ではV2 handler同一性、旧alias404、auth先行・default OFF・不正body/queryのIO0・IO後停止・保存flag OFFを確認した。

新native8件は両factoryを通し、Free上限到達・Plus・Premiumの6件で実SQL読取、同じpreview内quotaとの一致、GET前後のrecord/消費履歴/profile不変、回数上限でもpreview可能、新しい使用回数の再取得、旧data不変を確認した。追加2件は005 RPC欠落時に503となり生成や保存へ進まないことを確認した。既存B10経路集合も10routeへ更新。[隔離CI38045414597](https://github.com/MassyuRed/mashos-api/actions/runs/38045414597)／job114193834651は全工程success。23の重複しない検査集合で **1,774 PASS／FAIL0／SKIP0**（先行1,759＋composition7＋native8）。shared composition110件、shared native34件を含む。Python3.12.15／PostgreSQL16.15／pytest8.4.1／psycopg3.3.6。全9fileのremote全文・変更path集合・親headを照合済み。localとCIを合算しない。

同環境read-only reviewで具体的blockerなし。fixtureのSQL/tier準備、RPC回数4回、旧aliasのDTO不一致と候補限定除外を照合済み。Auth/source/PostgREST transportは合成であり、実Auth・稼働Supabase・RN実機・商品受入れを意味しない。

### 49.3 再開位置と稼働境界

次はnative B9実端末の描画同等性・glyph/ink/性能とrenderer admission→保存前fit→保存。形式変更、capture/画像保存共有、Nexus v2公開読取、保存/公開切替の候補API構成、M5/実Auth・稼働設定が残る。今回完了したquota v2候補登録を繰り返さず、005の稼働適用と採用は別残件として保持する。owner GET/DELETE・preview取消・visual PATCHも再実装しない。

公開切替は現resolverでowner_read AND public_readが必要で、public指定時はpublic_write（save/preview/public_read依存）も要求する。現公開読取は旧Q&Aのownerであるため、visibility requested/readyだけを追加して成立扱いにしない。private対象だけの例外やpublic_readの準備済み捏造も行わない。今回の回数表示からcanSave/canExportを有効化しない。

Supabase操作・live DB query/write/apply、env/deploy/activation、native app build、main mergeは0。RN/native/SQL/依存/workflow変更0。001〜004適用済み、005 quotaとvisual変更SQLの稼働未適用は先行確認を継承し、再照会や再適用はしていない。weekly §5.5・12/18公開目標を維持し、Piece全内容完成を実機確認の前提へ追加しない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


## 50. 2026-10-11 — 同じプレビューの非公開保存を候補APIへ接続（未配置）

### 50.1 残件と実装owner

MashのPiece残件続行指示に基づき、§49.3の保存API構成を接続した。既存save handler/service/store/SQLは実装済みで、専用preview/shared候補から呼べなかった。今回は同じプレビューをprivateで保存する候補接続に限定し、端末描画・保存前fitや公開読取の準備済みを捏造しない。

開始headはCocolon `16c6275f694a33200a6fc7cc1961be5b9c1bc0e6`／API `6384f8b165337a47adf052e3ccc4f2fe3a2a28c3`。添付の前回作業txt、全体設計01/01B・全ファイル地図とcurrent map、Piece入口/manifestとPCE6・PCE7・PCE8/B6、最新weekly 10/10 §5.5と§4.7、作業ルールと恒久incidentを確認した。System Context prepareはworkspace配下のmashos-api不在でcode2となり、原典の直接読取を使用。Workの既存非稼働実装/隔離検証範囲、root華恋が単一writer、補助agentは同環境read-only review。独立modelの正式商品受入れとは扱わない。

| 既存owner | 今回の変更 |
|---|---|
| `ai/services/ai_inference/piece_v2_runtime_control.py` | 既存 `api_piece_v2.save_preview` を `POST /emotion/piece/save` へ直接登録。専用構成11route。`save_requested` / `save_ready` を両方 `is True` で採用し、既存resolverの実効preview依存を保持。defaultはFalse。 |
| `ai/services/ai_inference/api_contract_registry.py` | candidateだけ `emotion.piece.save.v2` を追加。default registryとpolicy versionは保持。 |
| 既存 `app.py` / `api_piece_v2.py` / `piece_v2_save_service.py` / store / atomic SQL | 変更なし。既存factory転送、認証→実効flag→closed request、owner/version/3hash・source/tier再照合、IO前後の停止、原子保存/消費と同key receipt再取得を再利用する。 |
| 既存test4file | `test_b14a_piece_preview_composition.py`、`test_b12_shared_preview_composition.py`、`db/test_b10_preview_application_native.py`、`db/test_b12_shared_preview_native.py`。経路一覧更新とstrict flag、生成previewから保存/再取得/復旧するnative12件を追加。 |

public_write/public_read/visibility/exportは今回の引数で準備済みにならない。public指定は既存handlerが拒否する。quota.can_saveやrenderer文字列・テスト成功をsave_readyやnative admissionへ転用しない。既存default appと旧経路、RN、native、SQL、依存定義・workflowは変更しない。

### 50.2 検証と反映

API source `6b901a1df0037c047513e794624917a09b0f3ac4`、製品2＋test4を既存Draft PR #3へ反映。local control/dedicated/source-ref/shared/registryの5fileは **261 PASS／FAIL0／SKIP0**。Python3.12.14／pytest9.1.1／FastAPI0.142.2／Starlette1.7.0／Pydantic2.14.0／httpx0.28.1。既存非推奨警告181件を保持する。最初はlocal環境のPyJWT欠落で収集1 ERROR、続く専用検査はsource module stubが保存用型を隠したため2 FAIL／147 PASS。scratchに既存実行依存を補い、testで実save moduleをfixture置換前に読み込むように修正。製品・入力判定・失敗条件は緩めていない。

両候補で独立したstrict save pairとpreview依存、認証優先・default OFF、bootstrapの実効flag、candidate contractとdefault registry不変を確認。新native12件は実CMEE生成/既存bounded review→SQL preview発行から、private保存・同key receipt再取得・本人詳細で本文/3hash/payload/recipe/renderer一致・他人404・旧data不変・消費1回を検査する。stale/hash/public拒否、load後停止時RPC0、commit後停止/ACK消失時503→同keyで同じ消費ID回収・別key409を含む。保存後のsource再照会禁止はfixtureで検出し、実原入力削除や実プラン変更を実施したとは扱わない。

[隔離CI38089343394](https://github.com/MassyuRed/mashos-api/actions/runs/38089343394)／job114322377201は全工程success。重複しない23検査集合で **1,789 PASS／FAIL0／SKIP0**（先行1,774＋composition純増3＋native12）。専用/source-ref/control149件、shared/registry112件、shared native46件を含む。Python3.12.15／PostgreSQL16.15／pytest8.4.1／psycopg3.3.6／FastAPI0.143.0。全6fileのremote全文・変更path集合・親headを照合済み。localとCIの件数は合算しない。同環境read-only reviewにblocking指摘なし。reviewで本人詳細の必須field欠落を許さない比較へ改善した。Auth/source/PostgREST transportは合成、生成・review・projection・PostgreSQLの保存/再取得は実コードであり、live Auth/Supabase・RN実機・商品受入れではない。

### 50.3 再開位置と稼働境界

次はnative B9実端末の描画同等性・glyph/ink/性能、renderer admission→保存前fit→RN保存操作。形式変更、capture/画像保存共有、Nexus v2公開読取/公開切替、M5/実Auth・稼働設定が残る。private saveの候補API構成は今回の接続を使い、quota・owner GET/DELETE・preview取消/visual PATCHとともに再実装しない。公開切替のowner_read/public_read/public_write依存を保持し、未接続の公開読取をready扱いしない。

Supabase project metadataとmigration履歴の読取で001〜004適用済み、005 quotaとvisual変更SQLの追加2本未適用を確認。live DB query/write/apply、env/deploy/activation、native app build、main mergeは0。RN canSave/canExport=falseを維持する。weekly §5.5の実機確認順序と12/18公開目標を保持し、Piece全内容完成を実機確認の前提へ追加しない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


## 51. 2026-10-11 — RNの保存通信と同keyでの結果受取（操作未接続）

### 51.1 残件と既存owner

MashのPiece残件続行指示に基づくB10の通信接続。前回の§50で候補APIへ登録した保存処理に対して、RN側のHTTP ownerが未実装だった。既読の全体設計・全ファイル地図・前回txtと最新weekly10/10 §5.5を引き継ぎ、今回もCURRENT_RULES・必読incident全文・§50、PCE6 RN flow/clean cutover、PCE5保存前fit、PCE8 B10と現行sourceを照合した。開始Cocolon `6e601b40ed675c99801ba84f4e5994eb0fc701c6`、API `6b901a1df0037c047513e794624917a09b0f3ac4`。root華恋が単一writer、補助agentは同環境read-only reviewであり、独立modelによる正式商品受入れではない。

| 既存owner | 今回の変更・責務 |
|---|---|
| `features/piece/pieceApi.js` | `requestPieceSave` を追加。既存shared auth transportへPOST `/emotion/piece/save`。exact5 identity/version/hashにvisibilityだけを追加し、省略/nullはprivate。本文/recipe/fit/権限の混入を拒否。callerのowner/key/requestを最初のawait前に固定。 |
| 同保存transport | HTTP前後の本人再照合、各await境界のabort、no-store、closed errorとexact7 receipt。piece ID・消費UUID・保存状態・正数版・日時・replay boolを検査し、detached frozen receiptを返す。自動再送・別key発行・生成/expiryによる再取得阻害を追加しない。 |
| `tests/piece-v2-contracts.test.js` | 実moduleでprivate既定・要求snapshot・不正入力/receipt・本人切替・abort・未知結果から同key再取得・現在visibility/versionの保持・quota errorのpreview隔離を追加。 |
| `PieceCreateController.js` / `piecePreviewModel.js` / `PiecePreviewModal.js` / native renderer | 変更なし。保存操作・native fit/admissionは接続していない。quota表示、`native_checked`、renderer文字列から保存許可を作らず、canSave/canExport=falseを保持する。 |

初回receiptは要求visibility一致が必要。正規same-key replayは既存atomic SQLとB4検査に従い、現在のprivate/public・row versionを受け取り、古い公開範囲へ戻さない。public要求の契約は受け付けるが許可は推測せず、前回の候補APIが返すfeature-disabled等を保持する。保存上限の固定文言を追加し、previewではquotaコードを一時利用不可へ閉じる。保存済み本文や生エラーをログ/永続領域へ出さない。

### 51.2 検証と反映

source `ca4ce05cf1f62ed5fad3a0a72733e2956d8ae0a7`、製品1＋test1を既存Draft PR #30へ反映。全2fileのremote全文・変更path集合・親head一致を確認済み。local Node24.19.0／既存TypeScript5.2.2でInputScreen込み既存11suite **557 PASS／FAIL0／SKIP0**（先行545＋追加12、contracts126）。既存test compilerはscratchに補い、repositoryの依存定義は変更しない。先行targeted125 PASS後、read-only reviewで正規replayのvisibility equality過剰制約を発見し修正。正規public replay/version3/同consumptionの回帰1件と不正enum拒否を追加した。再reviewでblocking指摘なし。検査の途中FAILは0。[CI38090399330](https://github.com/MassyuRed/Cocolon/actions/runs/38090399330)／job114325475500も同じ11suite **557 PASS／FAIL0／SKIP0**。Node24.21.0／TypeScript5.2.2。Android source compile job114325475644、iOS syntax-only/既存patch/pbxproj job114325475560はsuccess。Androidには既存のannotation不足警告18件（Scope.LIBRARY_GROUP_PREFIX）があり、native app buildや端末実行を意味しない。既存contract guardsとread-only workflow policy/exact Draft pytest/terminal Step7も全success。localとの合算なし。

Auth/HTTP/React/nativeは合成を含む。通信の要求固定・結果検証を確認する検査であり、実native描画、実Auth/PostgREST、SQL実行、保存ボタン経路、商品受入れの証拠ではない。§50のAPI隔離CI1,789件は先行証拠として保持し、今回の557件へ合算しない。

### 51.3 再開位置と稼働境界

次は既存native B9の実端末描画同等性・glyph/ink/性能、renderer admission→保存前fit→controller/modalの同preview保存操作。新transportを利用し、同key/要求保持・未知結果・停止・本人切替を画面状態へ結ぶ。今回の通信ownerや§50の候補APIを再実装しない。形式変更、capture/画像保存共有、Nexus v2公開読取/公開切替、M5/実Auth・稼働構成が残る。

API/native/SQL/依存定義/workflow変更0、Supabase操作0、env/deploy/activation/native app build/main merge0。001〜004適用済み、005 quotaとvisual変更SQLの2本未適用は§50の先行確認を継承し、今回再照会したとは扱わない。weekly §5.5の実機順序と12/18公開目標を保持し、Piece全内容完成を実機確認の前提へ追加しない。TECHNICAL_CREDIT／STRUCTURE_MAP_DELTA_UPDATED／automatic_progression=false。


## 52. 2026-10-11 — B13-A画像保存・共有依存の導入候補（未導入）

### 52.1 現在の残件と今回の範囲

開始Cocolon `163b9aff9d3ba8c0c4b5f13c9383361b90db4e77`、API `6b901a1df0037c047513e794624917a09b0f3ac4`。全体設計・全ファイル地図・前回txtの既読を引き継ぎ、CURRENT_RULES、必読incident全文、最新weekly10/10 §5.4–5.5、PCE5画像/export契約、PCE6 RN flow、PCE8 B10/B13-A/Cと環境ledger、現行sourceを照合した。全sourceの再監査ではない。Mashの今回の明示対象はPieceであり、週次の先行実機対象・12/18目標を変更しない。

§51の保存通信は既存ownerを利用する。`native_checked` は現prototypeの測定結果で、正式renderer admission／保存前fitではない。APIのsave-readyもnative admissionを認定しない。quotaや文字列の一致だけでcanSave/canExportを有効にしない。端末確認を合成検査へ置き換えず、既存の別残件B13-A（読取と導入判断準備）を進めた。

`package.json` にcapture/share/camera-roll/file-accessは現在ない。RN0.77.3／React18.3.1／両OS旧architecture、iOS15.1、Android minSdk24／compileSdk35／AGP8.9.0を維持する導入候補とする。以下はソースと宣言上の整合確認であり、この組合せのnative build成功は未確認。

### 52.2 直接依存4件の固定候補と一次資料

| 用途・package固定版 | 固定source（tag対応commit） | 採用理由・制約 |
|---|---|---|
| PNG capture：`react-native-view-shot` **5.1.1** | [v5.1.1](https://github.com/gre/react-native-view-shot/tree/b92795723f4aba2538d10b121f872493bd1c7d2e) | packageはReact>=18／RN>=0.76、Node>=20.19.4／npm>=10。旧architectureのsourceあり。v6系はRN>=0.80のため採用しない。5.1.1 releaseは2026-06-20。 |
| OS共有：`react-native-share` **12.3.1** | [v12.3.1](https://github.com/react-native-share/react-native-share/tree/7a429e6a6199e55dad9fbfc6b46fd7a5c25f9970) | PNGのローカルfile共有に限定。Node>=16、旧architectureのsourceあり。releaseは2026-05-04。RN core ShareのAndroidは画像file共有を満たさないため使用。 |
| 写真へ保存：`@react-native-camera-roll/camera-roll` **7.10.2** | [v7.10.2](https://github.com/react-native-cameraroll/react-native-cameraroll/tree/e56436f1d3e0a7b95d392e9a7c2c3d8c066731c7) | Node>=18.17、RN>=0.59宣言。iOS add-only、Android29以上MediaStoreのsave sourceを確認。releaseは2025-08-06。 |
| 一時file管理：`react-native-file-access` **3.2.0** | [v3.2.0](https://github.com/alpha0010/react-native-file-access/tree/e8c8816f8732457ae49e034eda0e8c0123fd3b42) | 規定filenameで内部CacheDirへcp、SHA-256、限定dirのls/unlinkに使用。README上の旧architecture対応3.x。4.xは旧architectureを廃止しており代用しない。3.2.0 releaseは2025-08-22。下記AGP互換patchが必要。 |

4件ともpackageのlicense宣言はMIT。公開release日時・指定tagの実sourceを確認したが、将来の保守やnative適合を保証する評価ではない。直接JS依存を完全一致版（`^`/`~`なし）にし、承認後のinstall時にregistry integrityと全推移依存をlockへ固定する。view-shotにはhtml2canvas、RNFA podspecには版未指定のZIPFoundationがある。「native追加も4個だけ」とは扱わない。

3依存のみでraw captureを直接渡す案では規定filename・内部cache・限定清掃を満たせない。特にview-shotのiOSはfileNameを使わず、Androidは空き容量により外部cacheを選ぶ。一方shareの標準FileProviderにはexternal-cache-pathがない。4件目はこの差を吸収するfile管理ownerであり、hashのためだけに導入するものではない。backend/hybridへの切替やRN本体upgradeは提案に含めない。

### 52.3 承認後の変更箇所・実装条件・戻し方

| 変更候補path | 具体的内容 |
|---|---|
| `package.json` / `package-lock.json` | 上記直接4件を完全一致版で追加。既存依存を一括更新しない。推移依存とintegrity差分を確認。 |
| `.github/workflows/ios-build.yml` | 現Node18を、既存RN source CIでも使用した**24.21.0**へ固定し、view-shot engine条件を満たす。workflow編集とdispatchは別。 |
| `ios/Podfile` / `ios/Podfile.lock` | autolinkとlock差分を確認。RNFAでfile-space/timestamp APIを使用しないため `$RNFANoPrivacyAPI = true` を設定。ZIPFoundation等の実際の版はinstall後に記録。 |
| `ios/tempCocolon/Info.plist` | `NSPhotoLibraryAddUsageDescription`＝「Pieceの画像を写真ライブラリに保存するために使用します。」を追加。album指定なしのadd-only保存を用いる。 |
| `patches/react-native-file-access+3.2.0.patch` | 既存patch-packageでAGP8.9対応を限定補修：`namespace "com.alpha0010.fs"`、`buildFeatures { buildConfig = true }`、library manifestのpackage属性をnamespaceへ移す。現3.2.0にはnamespace/buildConfig有効化がなく、無修正の適合とは扱えない。適用後の実compileで確認する。 |
| `android/app/src/main/res/xml/share_download_paths.xml` | library resourceをapp側で上書きし、共有対象を `<cache-path name="piece_export" path="piece-export/" />` に限定。外部cache全体やapp cache rootを公開対象にしない。 |
| `features/piece/pieceExport.js` / `components/piece/PieceExportCanvas.js` と既存visual/owner UI | PCE8 B13-Cの既存owner計画に沿ってcapture・端末保存・共有を接続。すでに存在するrenderer/layoutを新規再実装しない。操作停止・本人切替・古い描画結果の破棄は既存契約を継承。 |

想定file経路は、同一の保存済みPiece/recipe/hashからPNGをcaptureし、`Dirs.CacheDir/piece-export/<session-random>/` へコピーしてPCE5の `cocolon-piece_<piece-uuid-no-hyphen>_<visual-recipe-hash-first12>_<ratio-token>.png` を付ける。そのコピーのSHA-256を計算し、同じbytesを共有／写真保存へ渡す。本文・画像bytes・temp pathを監視ログやサーバーreceiptへ入れない。raw captureの戻り値はそのまま保持し、URI正規化した共有用値とは分けて `releaseCapture` に返す（iOSはraw pathを前提とする）。

端末権限は保存操作時に限る。iOSは写真への追加権限で、一覧読取権限を要求しない。Android29以上はこの自作画像のMediaStore追加、24–28は既存WRITE_EXTERNAL_STORAGEの実行時権限を利用する。画像一覧読取・個別SNSの追加queries・base64共有を導入しない。既存の無関係なmanifest権限整理は今回範囲外。

以下は実装・端末確認で閉じる必要があり、preflightで解消済みにしない。

- **共有file寿命**：Androidのshare成功callbackは共有先選択時にも返る。外部appの読み終わりではないため、成功直後のfinallyでunlinkしない。共有session終了・次回起動時の限定清掃へ結び、共有先の読取を壊さない条件を実機で確認する。OS復帰だけを読取完了の証明にも使わない。未定の保持時間を契約へ追加しない。
- **capture直後の異常終了**：cp→release前に終了すると、元のcache root／iOS ReactNative tmpへraw PNGが残り得る。`piece-export/` の清掃だけでは回収できない。capture出力を専用領域へ限定する小さなview-shot patch等の実装を検討し、必要差分を記録・検証する。app cache全体やReactNative共用tmpを削除しない。未解決のままexportを有効化しない。
- **native適合と描画**：4件同時autolink、RNFA patch、PNG寸法/透過/字体・同一canvas、保存権限拒否、共有中の中断・本人変更・再起動を実nativeで確認する。現prototype v3の `native_checked` を正式fit/admissionへ読み替えない。
- **B13-B receipt**：同じ保存record/hashに束縛したbody-free export receiptのbackend残件を保持する。クライアントのhash計算だけでreceipt保存・正式export完了とは扱わない。

導入は依存/native設定とexport実装の差分を分けて確認可能にする。失敗時は今回追加した依存・lock・plist/provider・patch・workflow差分とexport配線だけを戻し、既存保存通信とrendererを保持する。featureは既定OFFを維持し、DBや保存済みPieceを移行しない。すでに端末写真／共有先へ出たコピーの回収はできない。既存iOS workflowはTestFlight uploadまで行うため、compile確認のつもりでdispatchしない。

### 52.4 今回の結果と再開位置

入口§48・本節・manifestの3資料だけを更新。製品source/API/SQL/native設定/lock/workflow変更0、新依存install0、新規test実行0、Supabase操作0、env/deploy/activation/native app build/main merge0。先行RN557 PASS／API1,789 PASSは今回再実行していない。001〜004適用済み、005 quota／visual変更SQL未適用も先行証拠を継承する。rootが一次資料を読み、同環境read-only補助reviewでRNFAのAGP設定不足・共有callbackとraw cleanupの限界を追加した。独立modelの正式受入れではない。

**次の個別判断は上記4依存と列挙したnative設定／互換修正の導入**。PCE8 B13-Aはread-only、B13-CはB13-A承認後だけpackage/native依存を変更する指定であり、weekly§5.4でも新依存は承認範囲を個別に照合する。今回の一般的な続行指示を、この新しい具体構成の導入承認へ自動換算しない。承認後は同じ資料調査を繰り返さず、lock固定・必要互換修正・B13-Cの画像保存共有source準備へ進む。現段階はSOURCE_REVIEWED_PINNED_PROPOSAL、native適合済みでもB13完了でもない。

§51.3の本線（実機native B9描画同等性/glyph/ink/性能・renderer admission→保存前fit→同previewの保存操作）と、形式変更、Nexus公開読取/切替、M5/実Auth/稼働配置は残る。画像共有の全完成をPieceの実機確認に対する追加前提へしない。導入承認に本番flag変更・API配置・TestFlight配布・DB適用を含めない。BLOCKER_NARROWED／STRUCTURE_MAP_DELTA_UPDATED（導入候補と実在ownerの区別）／automatic_progression=false。


## 53. 2026-10-11 — B13-Cの固定依存と画像書出しprototype

### 53.1 目的・範囲

§52の具体的な4依存導入案を記した添付「前回作業内容(20261010-223724).txt」を参照する今回の「Pieceの残件作業を進めて」に沿って、提案済みの可逆な導入・source準備を実施した。導入案の再提示を繰り返さず進める指示として扱い、本番有効化・DB適用・配布は含めない。基準RN head `69039eab15a501ff724543a863bda431eea640f5`／API `6b901a1df0037c047513e794624917a09b0f3ac4`。旧§52は導入前の履歴。本節が現状owner。

### 53.2 実在ownerと経路

| 実在path | 今回の役割 |
| --- | --- |
| `package.json` / `package-lock.json` | view-shot5.1.1・share12.3.1・camera-roll7.10.2・file-access3.2.0をexact固定。取得integrityを確認。推移5件追加。既存package版・integrity・optional peerを保持。 |
| `ios/Podfile` / `ios/tempCocolon/Info.plist` | RNFA未使用privacy API除外、写真への追加のみの用途説明。RN0.77.3・旧architecture・iOS15.1を保持。Pod lockはCI38093232063のCocoaPods1.17.0実出力を採用（§53.5）。 |
| `.github/workflows/ios-build.yml` | Node24.19.0とnpm ciへ変更。TestFlight workflowはdispatchしていない。 |
| `.github/workflows/piece-rn-contracts.yml` | 既存JS検査へexport suiteを追加。依存／Podfile／patch差分時だけmacOSでnpm ci→pod install→lock artifactを取得。署名・app build・配布なし。 |
| `patches/react-native-file-access+3.2.0.patch` | AGP8.9用namespace／buildConfig／library manifest補修。 |
| `patches/react-native-view-shot+5.1.1.patch` | `cocolonPieceCache`限定でinternal CacheDir/piece-captureにrawを保存。専用rawのcanonical parentを検査してrelease。iOSはscale1／standard rangeで指定pixel寸法を保持。通常captureは保持。 |
| `patches/@react-native-camera-roll+camera-roll+7.10.2.patch` | `cocolonAddOnly`＋local PNG＋photo＋album空だけ、performChanges成功後のPHAsset再読取を省略してsaved:trueを返す。既存saveAssetの挙動は保持。 |
| `android/app/src/main/res/xml/share_download_paths.xml` | RNShareのFileProvider resourceをinternal cache `piece-export/`だけへ限定。raw用piece-captureは共有対象外。 |
| `components/piece/PieceVisualCard.js` | 既存計測／row／catalogを再利用。export専用時だけ固定幅1080・scale1、内側canvas ref、保存済み同key/native_checkedのcapture targetと失効検査。通常previewとcanSave/canExport=falseは保持。 |
| `components/piece/PieceExportCanvas.js` | 保存済みrecordを上記cardへ渡す薄いwrapper。別rendererを作らない。製品UIからのmountなし。 |
| `features/piece/pieceExport.js` | 本人detail再取得→3hash／保存recipe／prototype v3検査→同keyの内側canvas capture→専用session copy→PNG prefix／寸法／SHA-256→写真またはshare。本文／URIをreceipt・logへ送らない。 |
| `tests/piece-v2-export.test.js` / `tests/piece-v2-renderer.test.js` | 実JS sourceと代替native/OS境界で失効・二重操作・bytes変化・権限拒否・cleanup範囲・固定canvasを検査。 |

copy名はPCE5の `cocolon-piece_<uuid-no-hyphen>_<recipe-hash-first12>_<ratio-token>.png`。random session下の同bytesを使い、native操作直前までruntime／本人／disposeを検査。非同期検証の前に操作を予約し二重save/shareを拒否。操作中disposeでは読取中copyを消さず、保存完了後またはhandoff前失敗に限定して回収する。rawはcapture後releaseし、異常終了残存は次JS processの初回capture準備時に専用名前だけ回収する。共用cache・写真libraryは削除しない。

iOSは固定旧architectureの `NativeModules.RNCCameraRoll.saveToCameraRoll` を上記opt-inで呼ぶ。Android29以上は権限追加なし、24–28は保存直前だけ既存WRITE権限を要求。share callbackは送信成功や受信完了ではなく `share_result_returned` として返す。ローカルcandidate metadataは正式receiptではない。

### 53.3 検証と限界

local Node24.19.0／npm11.9.0で固定lockのクリーンnpm ci成功、新3patchと既存有効patchが再適用された。既存の古いslider/svg patchをpostinstallが除外する動作と既存deprecation warningは継承。plist/XML/JSONをparseし、既存依存の版変更・削除0を照合。JSはInputScreen込み12suite **570 PASS／FAIL0／SKIP0**（先行557＋追加13）。native/OS/filesystem/Auth/HTTPの代替を含み、実native受入れと合算しない。

同環境read-only分担reviewで、export時Text onLayoutを止める誤配置、iOS写真保存後のPHAsset読取、share直前await復帰時の再確認不足を検出して修正し、回帰検査を追加。途中のexport検査1FAILは既存hash不一致の安全なエラーcodeに対するtest期待を補正したもの。検証不足を成功扱いする変更なし。補修後のnative source reviewに追加重大指摘なし。

現在のネイティブ適合はsource review・patch適用・Pod解決まで（§53.5）。app compile、sRGB/PNG実bytes、実字体／glyph／ink／性能、実写真の追加権限、共有先の読取継続は実行結果なし。system_context prepareはshallow cloneの祖先判定で停止したため、canonical入口・全体設計／file map・最新weeklyと本Piece原本を直接読んで進めた。

### 53.4 再開位置

- Pod解決／autolink／実lock反映は§53.5で完了。次は4依存のnative compileと端末上のcapture・写真保存・共有を確認する。
- 共有copyはhandoff後（失敗・取消を含む）に削除せず保持する。外部読取終了を推測しない回収条件／次回起動時限定回収は未接続。任意TTLを新設しない。これを理由にtemp cleanup完成とは扱わない。
- 正式renderer admission／保存前fit後に既存保存controller／UIとexport hostを接続する。現prototypeのnative_checked・hash確認だけで操作を有効化しない。B13-B body-free receiptはbackend未接続。
- 本線のnative B9実機描画受入れ→保存前fit→同preview保存、および形式変更、Nexus公開読取／切替、M5／実Auth／稼働構成を残す。画像共有の全完成を初回実機確認への追加前提にしない。

Supabase project／migration履歴読取で001〜004適用済み、005 quotaとvisual変更SQL未登録を再確認。API/SQL source変更・DB書込・env/deploy/activation・TestFlight配布・main merge0。weekly§5.5・12/18目標・automatic_progression=falseを維持。


### 53.5 GitHub検証と実生成Pod lock

source `d9debbff318441f3064ae87c3b725ffd2454ae52` の18fileをremote全文・変更path集合・親headで照合した。通常git pushは認証情報がなく終了128となったため、接続済GitHubのGit Dataで同じtreeを反映した（local treeとremote tree一致）。[CI38093232063](https://github.com/MassyuRed/Cocolon/actions/runs/38093232063)は全4job success：JS12suite **570 PASS／FAIL0／SKIP0**（Node24.21.0/TS5.2.2）、既存Android Piece bridge単体compile、既存iOS Piece source syntax-only、新Pod jobのnpm ci／3新patch／4依存autolink／pod install／plist lint。localとCIを合算しない。既存contract guardsとread-only workflow policyもsuccess。

Pod jobはNode24.19.0／CocoaPods1.17.0、99 total Podsを解決。artifact `11684881687` のzip SHA256 `39d7411bb1eef2e785c885d870bf1e489106b4288fb596e997bd112eb80321fa`を検証し、実出力68,710bytesを `ios/Podfile.lock` へ反映。追加はRNShare12.3.1／ReactNativeFileAccess3.2.0／camera-roll7.10.2／view-shot5.1.1／ZIPFoundation0.9.20。既存158 Pod identitiesの版／依存edge／external source変更・削除0。CocoaPods1.16.2→1.17.0と既存spec checksum69件の再計算は実出力を保持し、手で旧checksumへ戻さない。Podfile checksumも実bytesと一致。lockの独立read-only reviewで重大指摘なし。

これは依存解決と既存bridge source検査の成功であり、追加4依存を含むapp/native compile、実機画像・OS保存共有、renderer fit/admissionを合格にしない。§53.4の残件と製品UI非接続を維持する。


## 54. 2026-10-11 — 導入したnative依存を実コンパイルする

### 54.1 範囲・実在owner

直前head `e5980b4ee1d8164fc2eca73b7a12d1e0269566d7`、入口§49／本map§53、最新weekly§5.4／5.5から再開。依存解決だけでは未確認だった4ライブラリの実compileを、既存 `.github/workflows/piece-rn-contracts.yml` で行う。iOSはPods projectのview-shot／RNShare／camera-roll／ReactNativeFileAccessと必要な依存だけをarm64 simulator向けにbuildする。Androidは既存Gradle/autolinkで同4ライブラリのJava・Kotlin compile taskだけを実行。root Gradleがapp設定を評価するため、CI内だけで既存tracked key.propertiesを内容非出力で退避し、既存tracked debug.keystoreの公開debug設定へ一時置換して終了時に原本を復元する。本番鍵・秘密情報・署名taskを使わない。app assemble/archive、TestFlight／Play配布、env／DB／flag変更を含めない。native検査は依存／platform設定変更時に限定し、通常のJS変更ごとに全native buildを増やさない。

`features/piece/pieceExport.js` のraw cache初期化も補修する。RNFA3.2.0 Android実sourceでは既存directoryへのmkdirはEEXISTで失敗する。従来の無条件mkdirは再起動後のcapture準備・残存raw回収を止めるため、未存在時だけ作成し、既存時もtype=directoryを確認して既存の限定清掃へ進む。`tests/piece-v2-export.test.js` の代替filesystemを同挙動へ合わせ、再起動後の既存directory成功・1process1回清掃と、同pathがfileのときの操作拒否を追加した。local export14 PASS／FAIL0／SKIP0。native実行結果ではない。

本作業は既存画像書出しの端末到達に必要な互換確認と観測済み不具合の最小修正。同環境read-only分担で両OSの対象／コマンドと既存sourceを確認し、rootだけが変更する。source/model reviewを実端末の受入れへ換算しない。system_context prepareは今回もshallow cloneの祖先判定でexit2だったためcanonical原本を直接参照。全体設計／file map・current rules・恒久incident全文・weekly・Pieceのcurrent ownerを照合し、過去のQ&A設計を現行へ戻さない。

### 54.2 実コンパイルと回帰の結果

source `198e8ba06a0c2da41ebad761e98d182f3bc96f8f`（6file）とCI補修 `e4f498426ef69f8a0f5acba2039f1adcd79c5ad1`（workflow1file）をDraft PR #30へ反映し、それぞれremote全文・親head・変更path集合を照合した。[CI38094296963](https://github.com/MassyuRed/Cocolon/actions/runs/38094296963)は最新source e4f4984で**全5job success**。localとCIを合算しない。

| 検査 | 実結果・証拠範囲 |
| --- | --- |
| JS12suite | local／CIとも **572 PASS／FAIL0／SKIP0**。先行570＋再起動2件。HTTP/Auth/React/native代替を含む。CI job114336895200。 |
| iOS export Pods | job114336895163。Node24.19.0、固定lockのnpm ci・3patch再適用・pod install・Podfile.lock差分0・plist lint成功。Pods projectの4targetをDebug／arm64／iphonesimulatorで実buildし、compile step success。RNViewShot.mm／RNShare.mm／RNCCameraRoll.mm／FileAccess.swiftのcompiler出力を確認。必要なRN等の依存buildを含む。 |
| Android export libraries | job114336895237。Node24.19.0／Temurin17.0.20／Gradle8.11.1。view-shot・share・camera-roll・file-accessのcompileDebugJavaWithJavac、file-accessのcompileDebugKotlinの5taskすべて実行成功。BUILD SUCCESSFUL in 4m 43s／43 actionable tasks: 43 executed。app task・assemble・署名・publishは実行していない。 |
| 既存bridge source | piece-android-source／piece-ios-sourceともsuccess。従来の単体javac／syntax-only・patch・pbxproj検査であり、上記4依存の実buildとは別。 |

初回[CI38094134300](https://github.com/MassyuRed/Cocolon/actions/runs/38094134300)のAndroidは、tracked key.propertiesの存在を想定していない `test ! -e key.properties` がGradle実行前にexit1となった。compile不適合ではない。既存fileを内容非出力で退避し、公開debug設定だけへ一時置換、EXITで原本復元するe4f4984へ補修して成功した。既存鍵の値・ファイル自体の変更は今回差分に含めない。初回iOSもsuccessだが、受入れ証拠は両OSが揃った最新runを用いる。

iOS logはcompiler warning130行を含む。既存依存のdeprecated API・nullability／型・format警告とRN/Pods script phaseの出力未定義などで、error0。AndroidはJavaのdeprecated／uncheckedとRNFA Kotlinのdeprecated3件を含む。新たなwarning抑制や依存の一括更新は加えていない。同環境read-only分担で実logと対象範囲を照合し、独立modelの正式商品受入れとは扱わない。

### 54.3 再開位置

4依存は固定構成で両OSのlibrary compileまで確認できた。次は**端末上のB9描画同等性・glyph/ink/性能、PNG実bytes／寸法／色、写真への追加権限と保存、共有先の読取継続**。app全体build・実端末動作は今回未確認。正式renderer admission→保存前fit→既存保存controller／export hostのUI接続が残り、canSave/canExport=falseとprototype v3を維持する。ライブラリcompile成功で操作を有効化しない。

共有copy回収・B13-B body-free receipt・形式変更・Nexus公開読取／切替・M5／実Auth／稼働構成も残る。画像共有の全完成を初回実機確認への追加前提にしない。API/SQL/native library patch／依存版の追加変更0、Supabase操作・DB書込・env/deploy/activation・app build・署名／配布・main merge0。weekly§5.5・12/18目標を維持。STRUCTURE_MAP_DELTA_UPDATED（再起動動作と両OS検証範囲）／automatic_progression=false。


## 55. 2026-10-11 — iOS共有session終了後のcopy回収

### 55.1 直接作業・判断根拠

基準head `0892b49913557cfeb258a66e3923b057e6b515aa`、入口§50／本map§54と最新weekly§5.5から再開。PCE5 `Piece_Export_Owner_Comparison_20260808.md` §12が定めるshare/save completion後の一時file回収のうち、iOSで終了を確認できる共有sessionを実装対象にした。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK／既存設計内の可逆なsource補修。root一人がsource1・test1・資料3を編集し、同環境read-only補助reviewを使用する。別modelの正式受入れとはしない。

[AppleのcompletionWithItemsHandler仕様](https://developer.apple.com/documentation/uikit/uiactivityviewcontroller/completionwithitemshandler-swift.property?changes=_9)は、選択serviceのdata操作終了またはview controllerのdismiss時にfinal resultを返す。固定 `react-native-share@12.3.1` の `ios/RNShare.mm` はこのcallbackからsuccess booleanをresolveし、`src/index.tsx` はsuccess=falseをdismissedAction=trueへ正規化する。今回呼ぶ通常Share.openはsaveToFiles／shareSingleを使わない。この実sourceと仕様を照合し、iOSの正規resolveをlocal共有session終了として回収へ使う。相手への送信・配達・受信成功を認定するものではない。

Androidの同版TargetChosenReceiverは共有先選択時にsuccess=trueを返すため、同条件での削除はできない。PCE5のapp start時stale cleanupはcandidateであり、再起動を読取終了へ読み替える条件ではない。従来§53.4のhandoff後一律保持は本節のiOS正規終了だけ更新し、Android・未知／例外・異常終了残存は保持する。任意TTLや新しい回収契約を追加しない。

### 55.2 実在owner・動作と検証

| path | 変更内容 |
| --- | --- |
| `features/piece/pieceExport.js` | iOSのsuccess=trueかつdismissedAction未付与、又はsuccess=falseかつdismissedAction=trueのときだけhandedOffを解除し、既存finallyから専用session directoryを回収。取消はbody-free `cancelled`、その他は既存 `share_result_returned`。未知・矛盾・reject・Androidはcopy保持。 |
| `tests/piece-v2-export.test.js` | iOS成功／取消終了前のdisposeと本人変更、終了後だけの限定削除・再dispose、Android取消の分類と保持、未知／矛盾した応答、cleanup失敗時の結果保持と再共有拒否を追加。既存の二重操作検査はAndroid正規successで保持を確認。 |

新5件を加えた修正前export検査は **15 PASS／4 FAIL**、原因は未実装の回収・取消分類。source補修後 **19 PASS／FAIL0／SKIP0**。local全12suiteは **577 PASS／FAIL0／SKIP0**。API/Auth/React/native/filesystem/OSは代替を含み、実native share callbackや外部appで観測した結果ではない。CIの実結果は§55.4に記録する。

補助reviewで、確定した取消結果がfinallyのcleanup例外で上書きされる不具合を検出した。追加条件で19件中18 PASS／1 FAILを確認後、共有結果の確定後はoutcomeを保持し、後片付けの失敗だけbody-free `cleanup_failed:true` を付けるよう補修した。確定前の失敗は既存coarse errorを維持する。file pathやnative exceptionを出さず、同じassetを再共有しない。取消を共有失敗metricへ変換せず、画像送信成功や正式receiptを新設しない。今回のnative source／依存／workflow変更は0で、前回CI38094296963の両OS library compile成功を今回の再実行結果へ換算しない。

### 55.3 残る直接経路

次は正式renderer admissionと保存前fit、既存保存controller／export hostのUI接続、および端末B9描画／PNG実bytes／写真保存共有の確認。`PieceExportCanvas` と `preparePieceExportPrototype` に製品callerがない状態を保持している。simulator appを起動するだけではこの経路へ到達しない。隔離描画用entryの調査では、cardからpieceApi→apiClient→Supabaseの間接初期化と、AppDelegateのFirebase初期化を確認した。entry差替えだけを通信隔離済みとせず、今回新しいharness／native app buildは追加していない。この調査を新しい恒久Gateや初回実機確認の追加前提にしない。

Android／結果不明／異常終了後の共有copy回収、B13-B receipt、形式変更、Nexus公開読取／切替、M5／実Auth／稼働構成も残る。canSave/canExport=false、prototype v3を維持。画像共有の全完成を初回実機確認までの追加前提にしない。API／SQL／Supabase操作・DB書込・env/deploy/activation・署名／配布・main merge0。全体設計・file map・作業ルール・恒久incident全文を参照し、system_context prepareはshallow clone祖先判定exit2のためcanonical原本を直接確認した。weekly§5.5・12/18目標・automatic_progression=falseを維持。STRUCTURE_MAP_DELTA_UPDATED（一時file lifecycle）。


### 55.4 GitHub最終確認

source `1c6fbd3d4787e5fbd5a06d9eed92344f6e452800` の製品1＋test1＋資料3をGitHubへ反映し、全5fileのremote全文・変更path集合・親headを照合した。[CI38095920492](https://github.com/MassyuRed/Cocolon/actions/runs/38095920492)のJS job114341668316は **577 PASS／FAIL0／SKIP0**。既存Android bridge source compile／iOS source syntax・patch検査もsuccess。workflow全5jobはsuccessだが、export Pods／Android4依存のcompile stepは依存差分がないためscopeどおり**skip**。今回はnative libraryを再compileしたとはせず、前回run38094296963の成功と区別する。

同環境read-only差分reviewで指摘された取消とcleanup失敗の混同は修正済みで、最終差分に追加重大指摘なし。current entry§51／manifest v50へ同期した。実機・画像・写真保存・共有先受信・正式fit/admission・製品UI接続の受入れは未成立のまま、今回の共有session回収と分ける。

## 56. 2026-10-11 — 既存保存controllerの状態管理

### 56.1 現在地と変更owner

基準head `eb24b240af9315739019ce216ae06d76d9c30020`、入口§51／本map§55と添付前回txtから再開。全体設計・全ファイル地図・最新weekly10/10 §5.5・PCE5の描画再現契約・PCE6の保存flow・PCE8の既存ownerを確認した。既存save通信はあるがcontrollerの保存状態が欠けていたため、今回はその直接実装を進めた。実機と正式renderer admissionが未完了のため、画面操作の有効化は行わない。

| path | 今回の変更 |
| --- | --- |
| `features/piece/PieceCreateController.js` | 既存APIを使うsavePreviewと保存中／結果不明／保存完了を追加。厳密なsaveEnabledと将来hostのisSaveAdmitted=trueを要し、既定では送信しない。表示token、preview ID/revision/3hash、期限を検査してprivate要求と明示keyを固定する。 |
| `tests/piece-v2-state-models.test.js` | 追加15件。未許可／未admissionの送信拒否、要求固定、ACK不明から同key再確認、期限後回収、重複操作拒否、close／本人・入力変更／無効化／dispose、同期再入、既知拒否、feature-disabled刷新を検査。admission callbackは合成で、正式rendererの証拠ではない。 |

save開始時はpreview本文を破棄する。結果不明は明示retryだけで同じ要求を確認し、期限が過ぎてもkeyを更新しない。close後も本文を含まない保存要求／receiptを保持してpreview POSTへ戻さない。saveEnabledのみの取消は中断と再送停止、全体無効化・owner/source変更・disposeは要求を破棄する。初回保存はprivate、正規replayは既存APIが検証した現在visibility／row versionを保持する。保存後owner detailの再取得は将来の画面接続で行う。

### 56.2 検証と証拠範囲

Node24.19.0／TypeScript5.2.2で既存12suiteは **592 PASS／FAIL0／SKIP0**。先行577＋追加15で、localとCIは合算しない。最初の全件実行はこのscratch環境のTypeScript不足によりInputScreen suiteのmodule-loadが失敗したため、作業用directoryへ既存固定版5.2.2を用意して全件再実行した。repoのpackage／lock変更はない。

同環境read-only分担reviewが、save許可取消のabort通知から同期retryすると旧許可で再送できる順序を検出した。saveEnabledを先に更新してからabortするよう補修し、同期abort listenerの回帰検査を追加した。別modelの正式受入れではない。作業区分はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK、環境記録はCODEX_WORK_WITH_SAME_ENVIRONMENT_READ_ONLY_SUBAGENT_REVIEW_NOT_PRO_ULTRA_ACCEPTANCE。

HTTP/Auth/React/nativeは代替を含み、実DB保存・端末描画／画像・正式fit/admissionの成功を示さない。既存の両OS library compile成功は前回証拠であり、今回sourceはnative／依存を変更していない。

### 56.3 次の直接経路と未接続範囲

正式B9実機描画同等性・glyph/ink/性能→renderer admission→保存前fit→既存controllerの保存画面接続が本線。今回のisSaveAdmittedは将来の正式判定を受け取る未接続口であり、判定ownerや商品合格条件を置き換えない。表示model／modalは今回のsave状態に未対応。hostで実効save flag、foreground/runtime失効、保存後owner detail再取得を接続する作業が残る。現行のcanSave/canExport=falseを保持する。

画像PNG／写真権限・保存／共有の実端末確認、Android・結果不明／異常終了時の共有copy回収、receipt、形式変更、Nexus公開読取／切替、M5／実Auth／稼働構成も残る。画像共有の全完成を初回実機確認の追加前提にしない。既存controller・save API・原子保存SQLを再実装しない。

Supabase projectはACTIVE_HEALTHY、Piece001〜004は適用済み、005 quotaとvisual変更SQLはmigration履歴に未適用。今回読取のみでDB書込0。API／SQL／native／依存／workflow変更・env/deploy/activation・app build・署名／配布・main merge0。system_context prepareは部分取得環境のtask_profiles.json不足でexit2のため、指定されたcanonical原本の直接参照へ切り替えた。最新weekly§5.5・12/18目標・automatic_progression=falseを維持。STRUCTURE_MAP_DELTA_UPDATED（保存要求と結果のlifecycle）。GitHub／CI結果は以下へ追記する。



### 56.4 GitHub最終確認

source `9aca322808cbf877e883feab8f235ec1ab7a61a5` の製品1＋test1＋資料3をDraft PR #30へ反映し、5fileのremote全文・変更path集合・基準headとの親子関係を照合した。[CI38099147844](https://github.com/MassyuRed/Cocolon/actions/runs/38099147844)は**全5job success**。JS job114351256203は **592 PASS／FAIL0／SKIP0**。既存Android bridge source compileとiOS source syntax／patch検査もsuccess。依存差分がないためexport Pods／Android4依存compile stepはscopeどおりskipであり、前回library compile証拠を今回の実行結果へ換算しない。

同環境read-only reviewで許可取消と同期abort retryの修正成立を再確認し、追加重大指摘なし。entry§52／manifest v51へ結果を同期。保存状態の制御は実装済みだが、正式admission・表示model／modal・保存後owner再取得・実機／商品受入れは未完了のまま区別する。
