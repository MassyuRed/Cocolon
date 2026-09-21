---
doc_id: cocolon_piece_current_structure
title: "Piece構造 — Current Structure"
revision_date: "2026-09-21 JST"
document_role: "PIECE_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
activation_effect: 0
automatic_progression: false
---

# Piece構造 — Current Structure

## 0. Current conclusion

**2026-09-21 PR候補の現在地：CMEEのPiece専用source graph／intent／ArtifactPlanからcanonical本文を生成し、既存B9の実測レイアウト・開発PNGへ返すdisabled経路を接続した。意味処理と共有向け変換は限定範囲であり、商品経路・B8/B9全体は未完了。現行ファイルと実行範囲は§14を優先し、旧Q&A／V2未有効化の境界を維持する。**

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
2. saved-input exact1をsource authorityにするV2 runtimeは未接続。
3. canonical visual recipe／layout／PNG renderer／export receiptはruntime未実装。
4. B02-Aはcausal RED test bytesだけが先行し、durable execution creditは未確認、implementation required artifactsはabsent。
5. Piece current entry／manifestのB02-A stateはこのmapと同じwrite unitで同期済みであり、mergeまでDRAFT_CANDIDATEである。
6. CMEE Piece adapterのdisabled候補はMashの継続指示で§14まで接続した。runtime activationは未承認・未実施であり、候補実装と混同しない。

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
