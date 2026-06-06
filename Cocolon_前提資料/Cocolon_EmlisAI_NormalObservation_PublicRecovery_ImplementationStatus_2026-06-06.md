# Cocolon EmlisAI Normal Observation Public Recovery 実装反映メモ

作成日: 2026-06-06  
対象: `Cocolon_前提資料(178).zip` / `Cocolon_10(13).zip` / `mashos-api_10(25).zip`  
作業種別: 前提資料差分更新。コード変更なし。  
基準判断: ローカル実ファイル基準。GitHub接続確認不要。  

---

## 0. 結論

最新実ファイルでは、EmlisAI Gate Recovery public surface leak repair P0〜P12の上に、通常・高情報量入力のsurface failureをpublic observation candidateへ戻す経路が実装されている。

中心source kindは次である。

```text
normal_observation_rebuild_candidate
```

この候補は、Gate Recovery material surfaceではない。低情報観測でもない。bounded original repairでもない。

```text
元Composer候補が ai_generated として存在する
  ↓
Runtime / Visible / Display Gateでsurface_grammar / relation_skeleton等により落ちる
  ↓
normal_observation_rebuild_candidateを一度だけ作る
  ↓
既存Gateへ再投入する
  ↓
passed + comment_text の場合だけRNへ届く
```

---

## 1. 実ファイル差分

| repo | added | changed | removed |
|---|---:|---:|---:|
| Cocolon | 0 | 0 | 0 |
| mashos-api | 6 | 15 | 0 |

差分詳細は `cocolon_local_file_inventory_diff_20260606.csv` に保持する。

---

## 2. 追加された主な構造

| 層 | 追加/変更 |
|---|---|
| constants | `normal_observation_rebuild_candidate` と `normal_observation_rebuild_candidate_missing` を追加。 |
| builder | repairable reason family / non-repairable reason family / normal rebuild eligibility / surface precheck / body-free metaを追加。 |
| loop | Gate Recovery loopからnormal rebuild候補を既存Gateへ通す。 |
| reply_service | adopted public candidate sourceをdiagnostic material surfaceと混同しないmetaへ整理。 |
| display_gate | final pre-return確認に必要なrerender attempt metaを保持。 |
| product quality | ProductQualityEvent / public feedback meta / scorecardでattempted / applied / source kindをbody-freeに追跡。 |
| regression | P3〜P8のnormal observation rebuild関連テストを追加。 |

---

## 3. eligibility

normal rebuildを試す条件:

```text
original_composer_candidate が存在する
composer_source == ai_generated
ai_generated == true
comment_text が空ではない
material_quality が low_information / limited_grounding ではない
Gate Recovery material surface / diagnostic recovery surface lineageではない
surface_grammar / relation_skeleton / visible_surface / runtime_surface / koto_splice系のrepairable reason familyを持つ
safety / source_unavailable / composer_disabled / phase_not_complete / grounding_unsupported / reader_failure / template_echo_major / public_boundary_blocked / infrastructure_errorを含まない
```

---

## 4. 不変境界

```text
RN production UI変更なし
RN表示タイトル Emlisの観測 変更なし
RN表示条件 observation_status == passed && comment_text non-empty 変更なし
/emotion/submit route変更なし
request key変更なし
public response top-level key変更なし
DB physical schema / write path変更なし
Gate緩和なし
固定テンプレート追加なし
Gate Recovery material surfaceのpublic昇格なし
raw input / original body / candidate body / comment_text bodyのpublic meta混入なし
```

---

## 5. 検証

今回の前提資料更新時に最新実ファイル上で再確認した結果:

```text
backend normal observation rebuild主要関連: 56 passed
RN screen contract: 36 passed
```

P9は、最新実ファイルzip内のproduction code差分ではなく、ローカル検証工程として扱う。`mashos-api_10(25).zip` にはP9 report docの実ファイルは含まれていないため、前提資料では「コード差分なしの検証工程」として記録する。
