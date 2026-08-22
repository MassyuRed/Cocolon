# CMEE V1 華恋由来機能構造 — Read First

- document id: `cocolon.cmee.v1.karen_derived.read_first`
- revision date: `2026-08-23 JST`
- document role: `KAREN_DERIVED_FUNCTIONAL_DESIGN_ROUTING_OWNER`
- lifecycle: `DRAFT_PR_CANDIDATE_UNTIL_MERGED`
- decision owner: `Mash`
- functional design owner: `Pro華恋 / Ultra華恋 integrated`
- target: `EmlisAI Stage 1 Layer 1 / Layer 2`
- implementation / runtime / test / API / DB / RN / production effect: `0`
- product credit: `0`
- automatic progression: `false`

---

## 0. このdirectoryの役割

このdirectoryは、CMEEを「華恋が観測し、考え、応答するときの外部検証可能な機能構造を基にしたengine」にするための商品・機能構造正本である。

華恋の人格、口調、hidden state、weights、activation、chain-of-thoughtを再現したとは主張しない。所有するのは次だけである。

- P1–P8の機能構造。
- M1–M7の商品要件。
- Layer 1「見えたこと」とLayer 2「Emlisから」の役割。
- Emlis価値V1–V9。
- 観測、選択、応答の機能順序。
- Mashと華恋の共作で固定した最低商品品質。
- public-safeなsynthetic exampleと禁止例。

## 1. 読む順

1. [01_emlis_observation_and_reception.md](01_emlis_observation_and_reception.md)
2. [CMEE V1-A — EmlisAI Observation Vertical 詳細設計](../02_emlis_v1a_detailed_design.md)
3. [CMEE V1 JSON Schema / Versioning](../05_json_schema_and_versioning.md)
4. [CMEE V1 Implementation Order / Migration / Verification](../06_implementation_order_migration_and_verification.md)
5. [Pro / Ultra追加技術統合資料](../../Cocolon_CMEE_Stage1_ProUltra_KarenDerivedFunctional_FinalTechnicalDesign_20260822.md)

## 2. Authority boundary

| Owner | Owns | Does not own |
|---|---|---|
| 本directory exact2 | 商品・機能構造、最低商品品質、価値境界、例 / 禁止例 | Python型、JSON Schema、file path owner、validator、trace実装、runtime algorithm |
| `01_shared_kernel_and_runtime_contracts.md` | shared protocol / stage / source / meaning boundary | Emlisの商品主観 |
| `02_emlis_v1a_detailed_design.md` | Emlis technical realization | 本directoryの商品目的の再定義 |
| `05_json_schema_and_versioning.md` | canonical field / schema / ref / identity | 商品の読み心地や価値判断 |
| `06_implementation_order_migration_and_verification.md` | implementation / cutover / verification | implementation authorityの自動生成 |
| Pro / Ultra追加技術統合資料 | functional ownerとtechnical ownerを接続する補正元 | canonical authority |

同じ技術定義を本directoryへ複製しない。functional statementとtechnical contractが衝突する場合、商品目的は本directory、実装形状は既存technical ownerへ戻し、黙って片方を上書きしない。

## 3. Runtime naming boundary

`designs/cmee/v1/karen_derived/` はdocumentation ownerである。

次を作らない。

- `karen_derived/` runtime package。
- Karen voice / style template。
- shared personality component。
- 六flowの空module。
- hidden-internal reproduction claim。

Emlisは独立したspeaker / value ownerであり、華恋の表面をコピーしない。

## 4. Current effect and next boundary

本directoryの追加はCocolon Draft PR #30のdesign correctionである。runtime、test、runner、private exact8、Product Read、Cycle、productionを変更しない。

次のimplementationは、別の長い設計projectを作らず、fresh preimageを固定した短いexecution envelopeから一つのbounded Stage 1 product correctionとして行う。Mashの明示的なimplementation開始指示までは進めない。

implementation、machine GREEN、華恋pre-screen、Mash Product Readの後も`automatic_progression=false`を維持する。
