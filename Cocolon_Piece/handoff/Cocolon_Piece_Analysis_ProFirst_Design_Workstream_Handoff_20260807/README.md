---
doc_id: cocolon_piece_analysis_handoff_bundle_20260807
title: "Cocolon Piece / Analysis Pro-First Handoff — GitHub Preservation Bundle"
created_at: "2026-08-07 JST"
decision_owner: "Mash"
publication_state: "GITHUB_REFLECTED_LOSSLESS_WITH_MANIFESTED_TRAILING_LF_RESTORATION"
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

## 読み順

1. `part_01_context_and_actual.md`
2. `part_02_piece_and_analysis_policy.md`
3. `part_03_emlis_state_next_and_closure.md`

## GitHub保存形と原本再構成

part 1とpart 2は、対応する原本区間の本文を保持し、GitHub publication時に末尾区切りLFがexact1省略されています。part 3は原本区間とbyte-exactです。

原本再構成時は、part 1とpart 2の後にLF exact1を復元します。本文文字・順序・section境界は変更していません。

### GitHub current part identities

| part | GitHub bytes | GitHub LF count | GitHub SHA-256 | Git blob SHA-1 | restore trailing LF |
|---|---:|---:|---|---|---|
| `part_01_context_and_actual.md` | 10,220 | 298 | `e27bbe15a6f967c469d087c8d68e582413551f4ee244fb0386d397b37ad1aa2f` | `ab3925e43ef94c3e542b4c549bb5dd49f36cfc59` | exact1 |
| `part_02_piece_and_analysis_policy.md` | 8,804 | 366 | `1b4ff288c08b8a72002337976956dcae9d9766a56163224a4e799331f775aef6` | `72c27a7ba2f60a6070c1428583391faf5b054757` | exact1 |
| `part_03_emlis_state_next_and_closure.md` | 8,651 | 282 | `df639d8882c5a9cbabeeb4d0006aab9d5cd433752dcfbfa4831ea84555b21b10` | `1d24c1d268d47711bd0b99cf643e1fdcc8de53ea` | exact0 |

## reconstruction

repository rootから次を実行します。

```bash
out='Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807.md'
: > "$out"

cat Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_01_context_and_actual.md >> "$out"
printf '\n' >> "$out"
cat Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md >> "$out"
printf '\n' >> "$out"
cat Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_03_emlis_state_next_and_closure.md >> "$out"

printf '%s  %s\n' \
  '82f4f811760fb86767b4f667d7ed653b8c00678101d06a3e2c44948f8c166bd0' \
  "$out" \
  | sha256sum --check --strict
```

この復元規則で、27,677 bytesおよび原本SHA-256が一致することをpublication前検証で確認済みです。

## creation-state note

原本に残る`LOCAL_DOWNLOAD_ARTIFACT`、`GITHUB_NOT_REFLECTED`、`GITHUB_WRITE_EXACT0`は、原本作成時点のhistorical stateです。原本本文を改変しないため、その記述自体は残しています。current publication stateは本README、`Cocolon_Piece/manifest.json`、GitHub current path、current commitで判断します。

このhandoffはEmlisAI authority、STOP、pending、credit、acceptanceを変更しません。PieceとAnalysisのsource境界をPCE-2前に二重定義するauthorityも与えません。
