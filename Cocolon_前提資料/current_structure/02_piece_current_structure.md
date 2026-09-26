---
doc_id: cocolon_piece_current_structure
title: "Piece構造 — Current Structure"
revision_date: "2026-09-26 JST"
latest_api_implementation: "fa82077febb1363e286eb225fd53ff50ad863bbf"
document_role: "PIECE_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
activation_effect: 0
automatic_progression: false
---

# Piece構造 — Current Structure

## 0. Current conclusion

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
| B02-A M0／M1 causal RED freeze | ai/tests/piece_v2/db/test_b02_m0_m1_legacy_bridge.py |
| B02 implementation artifacts | current mainではrequired exact5がabsent。implementation／DDL／production applyは未成立 |

B02-A testはcurrent mainに存在するため、旧entryのNOT_ACTIVATEDだけではactualを表せない。正確なstateは次である。

    B02-A causal RED test:
      FROZEN_PRESENT
      EXECUTION_CREDIT_UNVERIFIED

    M0 / M1 implementation:
      NOT_MATERIALIZED

    disposable PostgreSQL GREEN:
      NOT_RUN / NOT_CREDIT

    production apply:
      NOT_AUTHORIZED

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

1. user-visible routeはold Q&Aのまま。
2. 保存原入力・保存状態から本文／recipeの内部組立と画像設定だけの変更を§20まで実装。本文に表れていない選択感情、refined補足、保存済みpreview発行、HTTP／RNは未接続。
3. canonical recipe／実測layout／Linux開発PNGは§14・16〜20で実行済み。製品native renderer／export receipt／端末保存・共有は未完了。
4. B02-Aはcausal RED test bytesだけが先行し、durable execution creditは未確認、implementation required artifactsはabsent。
5. Piece current entry／manifestのB02-A stateはこのmapと同じwrite unitで同期済みであり、mergeまでDRAFT_CANDIDATEである。
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

## 11. Last verified refs

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
