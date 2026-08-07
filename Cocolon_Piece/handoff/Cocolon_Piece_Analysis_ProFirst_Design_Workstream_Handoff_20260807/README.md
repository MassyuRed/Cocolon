---
doc_id: cocolon_piece_analysis_handoff_bundle_20260807
title: "Cocolon Piece / Analysis Pro-First Handoff — GitHub Preservation Bundle"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
publication_state: "GITHUB_REFLECTED_LOSSLESS_ORDERED_UTF8_PARTS"
automatic_progression: false
---

# Cocolon Piece / Analysis Pro-First Handoff — GitHub Preservation Bundle

このdirectoryは、次の原本をPiece専用ownerへ保存するlossless bundleです。

```text
original filename:
  Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807.md

UTF-8 bytes:
  27,677

lines:
  948

SHA-256:
  82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0
```

## 読み順・連結順

1. `part_01_context_and_actual.md`
2. `part_02_piece_and_analysis_policy.md`
3. `part_03_emlis_state_next_and_closure.md`

各partは原本の連続したUTF-8 byte範囲であり、要約・補正・再整形ではありません。上記順で単純連結すると原本bytesを再構成できます。

## part identities

| part | bytes | lines | SHA-256 |
|---|---:|---:|---|
| `part_01_context_and_actual.md` | 10,221 | 299 | `1dd9932b49544ca667ee34af181ef80bc248e505091700e1e246608492824304` |
| `part_02_piece_and_analysis_policy.md` | 8,805 | 367 | `d5832b13cba80a848252ba980804bd573956496d61385c79b95b7e914a94c99a` |
| `part_03_emlis_state_next_and_closure.md` | 8,651 | 282 | `df639d8882c5a9cbabeeb4d0006aab9d5cd433752dcfbfa4831ea84555b21b10` |

## reconstruction

repository rootから次を実行します。

```bash
cat \
  Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_01_context_and_actual.md \
  Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md \
  Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_03_emlis_state_next_and_closure.md \
  > Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807.md

printf '%s  %s\n' \
  '82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0' \
  'Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807.md' \
  | sha256sum --check --strict
```

## creation-state note

原本に残る`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_NOT_REFLECTED`、`GITHUB_WRITE_EXACT0`は、原本作成時点のhistorical stateです。原本bytesを改変しないため、その記述自体は残しています。current publication stateは本README、`Cocolon_Piece/manifest.json`、GitHub current pathとcommitで判断します。

このhandoffはEmlisAI authority、STOP、pending、credit、acceptanceを変更しません。PieceとAnalysisのsource境界をPCE-2前に二重定義するauthorityも与えません。
