> 2026-10-19最新差分：u353（10/18明示承認）。初回の元経験・本人説明・独立不明を、実回答／訂正・撤回／旧再開／保存再表示と一体で修復。新private3型・logical90。限定単位の技術検証まで完了、PRODUCT_NOT_CLEAR・正式Product Read0/3・candidate_ready=false・automatic_progression=falseは維持。詳細は[u353実装監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u353_InitialPersonalMeaning_20261018.md)。

> 2026-10-18最新：u350。Mash承認済みの「安堵・寂しさ＋別経験」を不明なし／ありの両方で初回・既受理一更新・旧保存互換・再表示へ保持する限定契約。private logical83→87、既存production10owner・新production0、STRUCTURE_MAP_DELTA_PRESENT。構造差分は末尾、実本文・検証結果・残件は[u350監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u350_ReliefReceivedRetention_20261018.md)を参照。PRODUCT_NOT_CLEARを維持。

> 2026-10-18 u348：u347の混在current SELF wh不明の限定案はMash個別承認済み。初回の既存V1三対象／二責務を保ち、別received経験への受理一更新後は新private V2二型で四対象／三責務を拘束する。型・field・版・旧checkpoint保持は末尾u348、検証結果は同監査を参照。公開wire・DB・商品合格・配置は変更しない。

> 2026-10-18 u339：初回の本人・過去不明への限定拡張はMash個別承認済み。末尾u339に現行条件。一般化・商品合格・配置は含まない。

# CMEE V1 — JSON Schema / Identity / Versioning 詳細設計

> 2026-10-17 u315：追加回答後の未変更理由付き満足を保持する限定資格はMash承認済み。最新責務差分は末尾u315、実装・検証結果は正本06／API handoff u315を参照。未配置・商品NOT_CLEAR。

> 2026-09-11 Q3現在地：添付修正版Technical Design v1.2に従い、Q2のコード実装完了からQ3へ進めた。Plusの適格本人履歴、Premiumの本人続行による最大3問と確認・修正・否定できる解釈フレーム、限定条件のLayer3を保存・API・RNまで実装した。Q3のコード実装は完了し、次の実装単位はQ4の統合・実本文確認・互換性・公開接続準備。実DB適用、端末・実課金確認、Mashの正式商品判断、公開操作は別作業として未実施。default OFF、商品NOT_CLEAR、Draft/open/unmergedを維持する。以下の旧Q1/Q2段落・Product Read待ちの順序は当時の履歴であり、Q3/Q4のコード進行を止める現行条件ではない。現在の進行ownerは本系列の`06_implementation_order_migration_and_verification.md`末尾Q3節とAPI既存handoff末尾Q3節。


- document id: `cocolon.cmee.v1.schema_and_versioning.detailed_design`
- revision date: `2026-08-17 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- Phase 2 product-route verdict: `ADOPT_WITH_BOUNDED_CORRECTIONS_REFLECTED`
- canonical field / ref / schema / version owner: `THIS_FILE`
- schema registration: `NOT_REGISTERED`
- runtime serialization / implementation / cutover effect: `0`
- DB / API effect: `0`

---

## 0. Purpose

本fileはCMEE V1中心設計exact3におけるcanonical field名、required／optional、ref encoding、schema ID、version、identity material、machine-only projectionのsole ownerである。Final Technical Designはauthority／cutover、`01_shared_kernel_and_runtime_contracts.md`はruntime semantics／validation、各core designはproduct duty／human Product Readを所有し、本fileのfield shapeを重複定義しない。

ここにあるschemaはimplementation candidateであり、production registry、API wire、DB columnを作らない。Phaseごとにactual consumerと一緒にmaterializeし、unused schema fileを先行作成しない。current PR #3の実装shapeはWIP evidenceであり、本fileと同名のsecond schema ownerにはしない。

## 1. Schema catalog

| Schema ID | Privacy | Lifecycle |
|---|---|---|
| `cocolon.cmee.generation_request_meta.v1alpha1` | internal body-free request metadata | V1-A candidate |
| `cocolon.cmee.source_envelope_meta.v1alpha1` | body-free | V1-A candidate |
| `cocolon.cmee.evidence_span.v1alpha1` | private body-full | V1-A candidate |
| `cocolon.cmee.evidence_graph.v1alpha1` | private body-full aggregate | V1-A candidate |
| `cocolon.cmee.japanese_attachment_set.v1alpha1` | private body-full | provider admission candidate |
| `cocolon.cmee.japanese_attachment_admission.v1alpha1` | internal body-free assessment | provider admission candidate |
| `cocolon.cmee.grounded_meaning_graph.v1alpha1` | private body-full | V1-A candidate |
| `cocolon.cmee.hypothetical_scenario_graph.v1alpha1` | private body-full | V1-E future |
| `cocolon.cmee.experience_plan.v1alpha1` | private body-full | V1-A candidate |
| `cocolon.cmee.generation_artifact_bundle.v1alpha1` | private bundle + explicit public projection | V1-A candidate |
| `cocolon.cmee.engine_outcome.v1alpha1` | internal response envelope | V1-A candidate |
| `cocolon.cmee.clarification_request.v1alpha1` | private interaction artifact | V1-A offline candidate; V1-B / V1-E operational future |
| `cocolon.cmee.positive_realization_trace.v1alpha1` | private body-full | V1-A candidate |
| `cocolon.cmee.body_free_quality_report.v1alpha1` | body-free | V1-A candidate |
| `cocolon.cmee.failure_envelope.v1alpha1` | body-free | V1-A candidate |
| `cocolon.cmee.piece_visual_card_payload.v1alpha1` | private primary payload | V1-C future |
| `cocolon.cmee.analysis_source_set.v1alpha1` | internal body-free lineage | V1-D future |
| `cocolon.cmee.analysis_observed_map_payload.v1alpha1` | private primary payload | V1-D future |
| `cocolon.cmee.analysis_visual_plan.v1alpha1` | private product projection | V1-D future |
| `cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1` | audience-authorized product projection | V1-D future |
| `cocolon.cmee.analysis_period_comparison.v1alpha1` | private comparison claim | V1-D future |
| `cocolon.cmee.analysis_if_route_payload.v1alpha1` | private primary payload | V1-E future |
| `cocolon.cmee.analysis_if_scenario_candidate_set.v1alpha1` | private primary payload | V1-E future |
| `cocolon.cmee.analysis_saved_route_intent_payload.v1alpha1` | private primary payload | V1-E future |
| `cocolon.cmee.analysis_if_safe_projection.v1alpha1` | audience-authorized product projection | V1-E future |
| `cocolon.cmee.analysis_saved_intent_safe_projection.v1alpha1` | owner-authorized product projection | V1-E future |

`v1alpha1`は「契約なし」を意味しない。discriminator、privacy、identity、required fieldsはstrictに守り、互換性のない変更は新schema IDへ進める。

## 2. Runtime-only private material

raw bodyはJSON durable contractへしない。

```python
@dataclass(frozen=True, slots=True, repr=False)
class SourceFieldPrivate:
    field_id: str
    raw_utf8_body: str
    raw_utf8_sha256: str
    codepoint_length: int
    utf8_byte_length: int

@dataclass(frozen=True, slots=True, repr=False)
class SourceMaterialPrivate:
    source_id: str
    source_version: str
    authenticated_owner_private: str
    fields_private: Mapping[str, SourceFieldPrivate]
    structured_private: Mapping[str, object]

@dataclass(frozen=True, slots=True, repr=False)
class CoreSourceInputPrivate:
    input_ref: str
    core_id: CoreId
    source_type: str
    requested_role_hint: str
    material_private: SourceMaterialPrivate

@dataclass(frozen=True, slots=True, repr=False)
class SourceEnvelope:
    meta: SourceEnvelopeMeta
    material_private: SourceMaterialPrivate
```

constraints:

- request-local
- CMEE persistence 0
- public serializer 0
- log / exception repr 0
- body-free report projection 0
- raw bodyをtrim / whitespace normalize / punctuation rewriteしてからhashしない
- source body digestもpublic reportへ0。durable product identityで必要な場合はprivate artifact storage ownerが管理する
- `structured_private`はauthentication / entitlement / source-stage等の非意味control metadataだけを持つ。visible claim、predicate / argument、user selection、condition、note等のmeaning-bearing値は必ず`fields_private`へcanonical fieldとして置き、body hash、EvidenceSpan、source commitmentへbindする。`structured_private`からmeaning graphへ直接edgeを作ることは0

## 3. `SourceEnvelopeMeta`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.cmee.source_envelope_meta.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "source_id",
    "core_id",
    "source_type",
    "source_role",
    "source_version",
    "stage",
    "privacy_class",
    "owner_scope",
    "parent_source_refs",
    "material_present"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.cmee.source_envelope_meta.v1alpha1"
    },
    "source_id": {"type": "string", "minLength": 1},
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "source_type": {"type": "string", "minLength": 1},
    "source_role": {
      "enum": [
        "ORIGINAL_INPUT",
        "OWNED_HISTORY_RECORD",
        "SUPPLEMENTAL_ANSWER",
        "PERIOD_METADATA",
        "USER_CORRECTION",
        "SIMULATION_SESSION_MATERIAL"
      ]
    },
    "source_version": {"type": "string", "minLength": 1},
    "stage": {"type": "string", "minLength": 1},
    "privacy_class": {
      "const": "PRIVATE_BODY_FULL_REQUEST_LOCAL"
    },
    "owner_scope": {
      "const": "AUTHENTICATED_SAME_OWNER"
    },
    "parent_source_refs": {
      "type": "array",
      "items": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
      "uniqueItems": true
    },
    "material_present": {
      "type": "object",
      "additionalProperties": {"type": ["boolean", "integer"]}
    }
  }
}
```

body-free `SourceEnvelopeMeta`はraw user ID、raw text、private locator、source range、identifiable paraphraseを持たない。

`SourceEnvelopeMeta`はinternal body-freeであり、public-safe telemetryではない。opaque `source_id`も相関可能なためpublic reportへ出さない。public-safe projectionはanonymous count、reason code、schema / provider / policy versionだけである。

### 3.1 `GenerationRequestMeta`

```json
{
  "$id": "cocolon.cmee.generation_request_meta.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "request_id",
    "core_id",
    "product_job",
    "operation_kind",
    "core_request_ref",
    "source_input_refs",
    "locale",
    "execution_scope",
    "policy_versions"
  ],
  "properties": {
    "request_id": {"type": "string", "minLength": 1},
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "product_job": {
      "enum": ["OBSERVE_AND_CLARIFY", "EXPRESS_AND_SHARE", "MAP_AND_EXPLORE"]
    },
    "operation_kind": {
      "enum": [
        "EMLIS_OBSERVATION", "PIECE_COMPILE",
        "ANALYSIS_OBSERVED_MAP", "ANALYSIS_IF_ROUTE", "ANALYSIS_SAVE_ROUTE_INTENT"
      ]
    },
    "core_request_ref": {"type": "string", "minLength": 1},
    "source_input_refs": {
      "type": "array",
      "minItems": 1,
      "items": {"type": "string"},
      "uniqueItems": true
    },
    "locale": {"const": "ja-JP"},
    "execution_scope": {"enum": ["OFFLINE_CANDIDATE", "CYCLE", "PRODUCTION"]},
    "policy_versions": {"type": "object", "additionalProperties": {"type": "string"}}
  }
}
```

JSONはbodyを持たないmetadata projectionであり、単独ではengine invocationではない。runtime public callableが受けるPython `GenerationRequest`はrequest-local / nonserializableである。

`execution_scope`はrequest-local ingress routing contextに限る。Final Design／migration ownerが別に承認したentryを選ぶためにだけ使い、cutover approval、generation owner、meaning claim、relation、epistemic state、duty、trace、artifact bytesを決めない。`GroundedMeaningGraph`、`ExperiencePlan`、`GenerationArtifactBundle`のmeaning、artifact identity／lineage、machine reportのevaluated identity、human Product Read identityへ含めない。同じsource／meaning／plan／artifact bytesはlaneだけで別identityにならない。

```python
@dataclass(frozen=True, slots=True, repr=False)
class GenerationRequest:
    meta: GenerationRequestMeta
    source_inputs_private: tuple[CoreSourceInputPrivate, ...]
    core_payload_private: CoreRequestPayloadPrivate
```

`CoreRequestPayloadPrivate`は次のclosed runtime unionである。

```text
EmlisObservationRequestPrivate
PieceGenerationRequestPrivate
AnalysisObservedMapRequestPrivate
AnalysisIfRouteRequestPrivate
AnalysisSaveRouteIntentRequestPrivate
```

discriminator consistency:

| core_id / product_job / operation_kind | private payload |
|---|---|
| `EMLIS_AI / OBSERVE_AND_CLARIFY / EMLIS_OBSERVATION` | `EmlisObservationRequestPrivate` |
| `PIECE / EXPRESS_AND_SHARE / PIECE_COMPILE` | `PieceGenerationRequestPrivate` |
| `ANALYSIS / MAP_AND_EXPLORE / ANALYSIS_OBSERVED_MAP` | `AnalysisObservedMapRequestPrivate` |
| `ANALYSIS / MAP_AND_EXPLORE / ANALYSIS_IF_ROUTE` | `AnalysisIfRouteRequestPrivate` |
| `ANALYSIS / MAP_AND_EXPLORE / ANALYSIS_SAVE_ROUTE_INTENT` | `AnalysisSaveRouteIntentRequestPrivate` |

`meta.core_request_ref`はprivate payload IDとexact matchし、`meta.source_input_refs`と`source_inputs_private`もexact ID setで一致させる。Core adapterがowner / role / versionをadmitした後だけ`SourceEnvelope(meta, material_private)`を作る。mismatched unionは`REJECTED`、raw sourceをglobal registry、body-free JSON、loggerから解決することは0である。

Analysis private payloadのminimum shapeは次である。いずれもrequest-local / nonserializableであり、derived artifact refをmeaning-bearing sourceへ変換しない。

```text
AnalysisObservedMapRequestPrivate:
  core_request_id
  period_start / period_end
  saved_record_members[]
  comparison_previous_artifact_ref?
  analysis_policy_version

AnalysisIfRouteRequestPrivate:
  core_request_id
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  requested_candidate_count = 1..3
  analysis_if_policy_version

AnalysisSaveRouteIntentRequestPrivate:
  core_request_id
  source_scenario_set_ref
  selected_scenario_ref
  user_selection_source_ref
  optional_user_note_source_ref?
  save_policy_version
```

`ANALYSIS_SAVE_ROUTE_INTENT`の`source_inputs_private`には、ユーザーが選択したという真正な操作materialを`SIMULATION_SESSION_MATERIAL`としてexact1含める。optional noteも別SourceEnvelopeにする。scenario set / scenario graph / simulation artifactは`parent_artifact_refs`でありsourceではない。

## 4. `EvidenceSpan` and `EvidenceGraph`

`SourceEnvelopeMeta`のlogical source identityと、`SourceMaterialPrivate`のcontent-bound fieldを分ける。Evidenceはfield-relative Unicode scalar range、source全体でのabsolute UTF-8 byte range、field digest、literal digestへ同時にbindする。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.cmee.evidence_span.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "evidence_id",
    "evidence_version",
    "source_ref",
    "source_field",
    "source_field_sha256",
    "literal_utf8_sha256",
    "scalar_range",
    "absolute_utf8_byte_range",
    "role"
  ],
  "properties": {
    "evidence_id": {"type": "string", "minLength": 1},
    "evidence_version": {"type": "integer", "minimum": 1},
    "source_ref": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
    "source_field": {"type": "string", "minLength": 1},
    "source_field_sha256": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "literal_utf8_sha256": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "scalar_range": {
      "type": "array",
      "prefixItems": [
        {"type": "integer", "minimum": 0},
        {"type": "integer", "minimum": 0}
      ],
      "items": false
    },
    "absolute_utf8_byte_range": {
      "type": "array",
      "prefixItems": [
        {"type": "integer", "minimum": 0},
        {"type": "integer", "minimum": 0}
      ],
      "items": false
    },
    "role": {
      "enum": ["MEANING", "CONTEXT", "CONDITION", "UNKNOWN_BOUNDARY"]
    }
  }
}
```

validatorは`start < end`、scalar rangeとabsolute UTF-8 rangeが同じliteral bytesを指すこと、field／literal digest、source version、role、overlap policyをcodeで再検証する。

### 4.1 `EvidenceGraph`

`EvidenceGraph`はS2のprivate aggregate contractであり、EvidenceSpanのsecond identity ownerではない。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "cocolon.cmee.evidence_graph.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "evidence_graph_id",
    "evidence_graph_version",
    "source_bindings",
    "required_source_refs",
    "unknown_boundary_evidence_refs",
    "spans"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.cmee.evidence_graph.v1alpha1"},
    "evidence_graph_id": {"type": "string", "minLength": 1},
    "evidence_graph_version": {"type": "integer", "minimum": 1},
    "source_bindings": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["source_ref", "source_role"],
        "properties": {
          "source_ref": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
          "source_role": {
            "enum": [
              "ORIGINAL_INPUT", "OWNED_HISTORY_RECORD", "SUPPLEMENTAL_ANSWER",
              "PERIOD_METADATA", "USER_CORRECTION", "SIMULATION_SESSION_MATERIAL"
            ]
          }
        }
      },
      "uniqueItems": true
    },
    "required_source_refs": {
      "type": "array",
      "items": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
      "uniqueItems": true
    },
    "unknown_boundary_evidence_refs": {
      "type": "array",
      "items": {"type": "string", "pattern": "^evidence:[^@]+@[^@]+$"},
      "uniqueItems": true
    },
    "spans": {
      "type": "array",
      "items": {"$ref": "cocolon.cmee.evidence_span.v1alpha1"},
      "uniqueItems": true
    }
  }
}
```

`evidence:<evidence_id>@<evidence_version>`と`evidence-graph:<graph_id>@<graph_version>`をcanonical refsとする。`source_bindings`はsource identity／roleをfreezeし、required source refsはbindingsのsubset、unknown-boundary refsは`spans`内の`UNKNOWN_BOUNDARY`へ解決しなければならない。foreign source、duplicate evidence ID、unresolved ref、source version mismatchをrejectする。graphはrequest-local private body-fullでraw bodyを複製せず、public reportへsource ref、range、digestまたはliteralを出さない。

## 5. `JapaneseAttachmentSet`

このschemaはcandidate providerのruntime-only payloadをshared kernelがsource / provider / resource identityへbindし、独立recomputeしたdigestを付けたprivate body-full sealed setである。provider自身はset ID、digest、source bindings、formal admissionを決めない。lemma、surface、rangeをpublic reportへ投影しない。`owner_id`はuser ownerと混同しないよう`meaning_owner_id`とする。

```json
{
  "$id": "cocolon.cmee.japanese_attachment_set.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "attachment_set_id",
    "canonical_private_digest",
    "provider_identity",
    "source_bindings",
    "owners"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.cmee.japanese_attachment_set.v1alpha1"
    },
    "attachment_set_id": {"type": "string", "minLength": 1},
    "canonical_private_digest": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "provider_identity": {
      "type": "object",
      "additionalProperties": false,
      "required": ["provider_id", "provider_version", "resource_lock_ref"],
      "properties": {
        "provider_id": {"type": "string"},
        "provider_version": {"type": "string"},
        "resource_lock_ref": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"}
      }
    },
    "source_bindings": {
      "type": "array",
      "minItems": 1,
      "items": {"$ref": "#/$defs/sourceBinding"},
      "uniqueItems": true
    },
    "owners": {
      "type": "array",
      "minItems": 1,
      "items": {"$ref": "#/$defs/owner"}
    }
  },
  "$defs": {
    "sourceBinding": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_id", "source_version", "field_body_digests"],
      "properties": {
        "source_id": {"type": "string"},
        "source_version": {"type": "string"},
        "field_body_digests": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["source_field", "body_sha256"],
            "properties": {
              "source_field": {"type": "string"},
              "body_sha256": {"type": "string", "pattern": "^[0-9a-f]{64}$"}
            }
          }
        }
      }
    },
    "owner": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "meaning_owner_id",
        "source_range",
        "resolution",
        "predicate_candidates",
        "argument_candidates",
        "open_slot_candidates",
        "scope_candidates",
        "ambiguity_reasons",
        "unresolved_reasons",
        "producer_provenance"
      ],
      "properties": {
        "meaning_owner_id": {"type": "string"},
        "source_range": {"$ref": "cocolon.cmee.evidence_span.v1alpha1"},
        "resolution": {"enum": ["UNIQUE", "AMBIGUOUS", "UNRESOLVED"]},
        "predicate_candidates": {
          "type": "array",
          "items": {"$ref": "#/$defs/predicate"}
        },
        "argument_candidates": {
          "type": "array",
          "items": {"$ref": "#/$defs/argument"}
        },
        "open_slot_candidates": {
          "type": "array",
          "items": {"$ref": "#/$defs/openSlot"}
        },
        "scope_candidates": {
          "type": "array",
          "items": {"$ref": "#/$defs/scope"}
        },
        "ambiguity_reasons": {"type": "array", "items": {"type": "string"}},
        "unresolved_reasons": {"type": "array", "items": {"type": "string"}},
        "producer_provenance": {
          "type": "object",
          "additionalProperties": false,
          "required": ["mechanism", "source_ref", "candidate_generation_ref"],
          "properties": {
            "mechanism": {
              "enum": [
                "UPSTREAM_EXACT_ATTACHMENT",
                "STATISTICAL_PROPOSAL_ONLY"
              ]
            },
            "source_ref": {"type": "string"},
            "candidate_generation_ref": {"type": "string"}
          }
        }
      }
    },
    "range": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_field", "scalar", "utf8_byte"],
      "properties": {
        "source_field": {"type": "string"},
        "scalar": {
          "type": "array",
          "prefixItems": [{"type": "integer"}, {"type": "integer"}],
          "items": false
        },
        "utf8_byte": {
          "type": "array",
          "prefixItems": [{"type": "integer"}, {"type": "integer"}],
          "items": false
        }
      }
    },
    "predicate": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "predicate_id", "token_range", "lemma", "inflection",
        "polarity", "modality", "temporal_scope", "lifecycle_scope", "provenance"
      ],
      "properties": {
        "predicate_id": {"type": "string"},
        "token_range": {"$ref": "#/$defs/range"},
        "lemma": {"type": "string"},
        "inflection": {"type": "string"},
        "polarity": {"type": "string"},
        "modality": {"type": "string"},
        "temporal_scope": {"type": "string"},
        "lifecycle_scope": {"type": "string"},
        "provenance": {"type": "string"}
      }
    },
    "argument": {
      "oneOf": [
        {"$ref": "#/$defs/explicitArgument"},
        {"$ref": "#/$defs/implicitArgument"}
      ]
    },
    "explicitArgument": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "argument_id", "span", "case_marker", "case_role", "governing_predicate_ref",
        "attachment_kind", "resolution", "provenance"
      ],
      "properties": {
        "argument_id": {"type": "string"},
        "span": {"$ref": "#/$defs/range"},
        "case_marker": {"type": ["string", "null"]},
        "case_role": {"type": "string"},
        "governing_predicate_ref": {"type": "string"},
        "attachment_kind": {"const": "EXPLICIT"},
        "resolution": {"enum": ["UNIQUE", "AMBIGUOUS", "UNRESOLVED"]},
        "provenance": {"type": "string"}
      }
    },
    "implicitArgument": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "argument_id", "span", "case_marker", "case_role", "governing_predicate_ref",
        "attachment_kind", "open_slot_candidate_ref", "referent_candidate_refs",
        "resolution", "provenance"
      ],
      "properties": {
        "argument_id": {"type": "string"},
        "span": {"type": "null"},
        "case_marker": {"type": "null"},
        "case_role": {"type": "string"},
        "governing_predicate_ref": {"type": "string"},
        "attachment_kind": {"enum": ["ZERO", "OMITTED"]},
        "open_slot_candidate_ref": {"type": "string"},
        "referent_candidate_refs": {
          "type": "array",
          "items": {"type": "string"},
          "uniqueItems": true
        },
        "resolution": {"enum": ["UNIQUE", "AMBIGUOUS", "UNRESOLVED"]},
        "provenance": {"type": "string"}
      }
    },
    "openSlot": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "slot_id", "role", "governing_predicate_ref", "denominator_member",
        "status", "reason_code", "provenance"
      ],
      "properties": {
        "slot_id": {"type": "string"},
        "role": {"type": "string"},
        "governing_predicate_ref": {"type": "string"},
        "denominator_member": {"type": "boolean"},
        "status": {"enum": ["EXPLICIT_UNKNOWN", "CLOSED_NONE", "UNRESOLVED"]},
        "reason_code": {"type": "string"},
        "provenance": {"type": "string"}
      }
    },
    "scope": {
      "type": "object",
      "additionalProperties": false,
      "required": ["scope_id", "scope_kind", "scope_value", "resolution", "provenance"],
      "properties": {
        "scope_id": {"type": "string"},
        "scope_kind": {"enum": ["TOPIC", "TEMPORAL", "MODALITY", "LIFECYCLE"]},
        "scope_value": {"type": "string"},
        "resolution": {"enum": ["UNIQUE", "AMBIGUOUS", "UNRESOLVED"]},
        "provenance": {"type": "string"}
      }
    }
  }
}
```

### 5.1 `JapaneseAttachmentAdmission`

候補producerから独立したCMEE assessorが次を生成する。

```json
{
  "$id": "cocolon.cmee.japanese_attachment_admission.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "admission_id",
    "attachment_set_ref",
    "attachment_set_digest",
    "approved_contract_version",
    "resource_lock_ref",
    "closure_status",
    "candidate_set_completeness",
    "open_slot_denominator_state",
    "admitted_owner_refs",
    "ambiguity_count",
    "unresolved_count",
    "independent_mutation_result",
    "reason_codes"
  ],
  "properties": {
    "admission_id": {"type": "string"},
    "attachment_set_ref": {"type": "string"},
    "attachment_set_digest": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "approved_contract_version": {"type": "string"},
    "resource_lock_ref": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "closure_status": {
      "enum": ["FORMAL_CLOSED", "PROVISIONAL_ONLY", "UNRESOLVED", "UNAVAILABLE"]
    },
    "candidate_set_completeness": {
      "enum": ["FORMALLY_COMPLETE", "NOT_PROVED"]
    },
    "open_slot_denominator_state": {
      "enum": ["ESTABLISHED", "NOT_ESTABLISHED"]
    },
    "admitted_owner_refs": {
      "type": "array", "items": {"type": "string"}, "uniqueItems": true
    },
    "ambiguity_count": {"type": "integer", "minimum": 0},
    "unresolved_count": {"type": "integer", "minimum": 0},
    "independent_mutation_result": {"enum": ["GREEN", "RED", "NOT_RUN"]},
    "reason_codes": {"type": "array", "items": {"type": "string"}}
  }
}
```

`closure_status=FORMAL_CLOSED` requires code-level cross-field constraints:

- CMEE shared kernelが`canonical_private_digest` fieldを除くclosed canonical private set bytesを独立recomputeし、sealed setのdigestとexact match
- `attachment_set_ref` / `attachment_set_digest`がprivate set identityとexact match
- set-level source ID / version / field body digestがEvidenceSpanとexact match
- set provider identity / resource lock、admission context、approved lock identityがexact match
- candidate set completeness `FORMALLY_COMPLETE`
- formal open-slot denominator `ESTABLISHED`
- required / active meaning owner全件`UNIQUE`
- exact predicate range、authoritative lemma / inflection
- argument span / case role / governing predicate edge
- polarity / modality / temporal / lifecycle scope
- ambiguity / unresolved reason 0
- independent mutation rejection GREEN
- `admitted_owner_refs`はsealed set内owner IDのunique subsetで、approved contractがrequired / activeと定めるowner setにexact match
- `ambiguity_count` / `unresolved_count`はsealed setからassessorが再導出した値とexact match

JSON Schemaのshape validationだけでformal authorityを証明しない。

## 6. `GroundedMeaningGraph`

```json
{
  "$id": "cocolon.cmee.grounded_meaning_graph.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "graph_id",
    "graph_version",
    "core_id",
    "source_refs",
    "evidence_graph_ref",
    "meaning_derivation_mode",
    "attachment_admission_ref",
    "epistemic_partition",
    "nodes",
    "edges",
    "status"
  ],
  "properties": {
    "graph_id": {"type": "string"},
    "graph_version": {"type": "integer", "minimum": 1},
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "source_refs": {
      "type": "array",
      "minItems": 1,
      "items": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
      "uniqueItems": true
    },
    "evidence_graph_ref": {
      "type": "string",
      "pattern": "^evidence-graph:[^@]+@[^@]+$"
    },
    "meaning_derivation_mode": {
      "enum": ["SOURCE_OR_USER_EVIDENCE_ONLY", "FORMAL_ATTACHMENT_ADMITTED"]
    },
    "attachment_admission_ref": {
      "type": ["string", "null"],
      "pattern": "^attachment-admission:[^@]+@[^@]+$"
    },
    "epistemic_partition": {"const": "SOURCE_BOUND_PROVISIONAL"},
    "nodes": {"type": "array", "items": {"$ref": "#/$defs/node"}},
    "edges": {"type": "array", "items": {"$ref": "#/$defs/edge"}},
    "status": {"enum": ["GROUNDED", "PARTIAL", "UNAVAILABLE"]}
  },
  "allOf": [
    {
      "if": {
        "properties": {"meaning_derivation_mode": {"const": "SOURCE_OR_USER_EVIDENCE_ONLY"}},
        "required": ["meaning_derivation_mode"]
      },
      "then": {"properties": {"attachment_admission_ref": {"type": "null"}}}
    },
    {
      "if": {
        "properties": {"meaning_derivation_mode": {"const": "FORMAL_ATTACHMENT_ADMITTED"}},
        "required": ["meaning_derivation_mode"]
      },
      "then": {
        "properties": {
          "attachment_admission_ref": {
            "type": "string",
            "pattern": "^attachment-admission:[^@]+@[^@]+$"
          }
        }
      }
    }
  ],
  "$defs": {
    "node": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "node_id", "kind", "epistemic_state", "evidence_refs",
        "polarity", "modality", "temporal_scope", "forbidden_promotions"
      ],
      "properties": {
        "node_id": {"type": "string"},
        "kind": {"type": "string"},
        "epistemic_state": {
          "enum": [
            "SOURCE_EXPLICIT", "FORMAL_DERIVED", "USER_CONFIRMED",
            "USER_CORRECTED", "UNKNOWN", "CONFLICT"
          ]
        },
        "evidence_refs": {
          "type": "array",
          "items": {"type": "string", "pattern": "^evidence:[^@]+@[^@]+$"}
        },
        "polarity": {"type": "string"},
        "modality": {"type": "string"},
        "temporal_scope": {"type": "string"},
        "forbidden_promotions": {"type": "array", "items": {"type": "string"}}
      }
    },
    "edge": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "edge_id", "edge_type", "from_node_ref", "to_node_ref",
        "direction", "epistemic_state", "evidence_refs", "provenance"
      ],
      "properties": {
        "edge_id": {"type": "string"},
        "edge_type": {"type": "string"},
        "from_node_ref": {"type": "string"},
        "to_node_ref": {"type": "string"},
        "direction": {"type": "string"},
        "epistemic_state": {
          "enum": [
            "SOURCE_EXPLICIT", "FORMAL_DERIVED", "USER_CONFIRMED",
            "USER_CORRECTED", "UNKNOWN", "CONFLICT"
          ]
        },
        "evidence_refs": {
          "type": "array",
          "items": {"type": "string", "pattern": "^evidence:[^@]+@[^@]+$"}
        },
        "provenance": {"type": "string"}
      }
    }
  }
}
```

`SOURCE_OR_USER_EVIDENCE_ONLY`ではvisible claim全量を`SOURCE_EXPLICIT | USER_CONFIRMED | USER_CORRECTED`へ限定し、provider-derived meaning／relation／attachmentを0にする。required source coverage、unknown preservation、polarity／modality／time、evidence binding、no-added-claimをcross-field validatorで確認する。

`FORMAL_DERIVED` node／edgeが一つでもあればmodeを`FORMAL_ATTACHMENT_ADMITTED`、version-qualified admission refをnon-nullとし、formal admissionとevidenceを両方要求する。provider-required routeのfailure後にmodeをsource-onlyへ変えない。graphはuser truthではなく、user correctionはoriginal graphをin-place変更せずnew source／graph versionとderivation lineageを作る。

## 7. `HypotheticalScenarioGraph`

```json
{
  "$id": "cocolon.cmee.hypothetical_scenario_graph.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "scenario_graph_id",
    "scenario_graph_version",
    "base_observed_map_ref",
    "base_route_ref",
    "branch_point_id",
    "branch_intent_source_ref",
    "constraint_source_refs",
    "nodes",
    "edges",
    "unmodelled_factors",
    "status"
  ],
  "properties": {
    "scenario_graph_id": {"type": "string"},
    "scenario_graph_version": {"type": "integer", "minimum": 1},
    "base_observed_map_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "base_route_ref": {"type": "string", "pattern": "^route:[^@]+@[^@]+$"},
    "branch_point_id": {"type": "string"},
    "branch_intent_source_ref": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
    "constraint_source_refs": {
      "type": "array",
      "items": {"type": "string"},
      "uniqueItems": true
    },
    "nodes": {"type": "array", "items": {"$ref": "#/$defs/node"}},
    "edges": {"type": "array", "items": {"$ref": "#/$defs/edge"}},
    "unmodelled_factors": {"type": "array", "items": {"type": "string"}},
    "status": {"const": "GENERATED"}
  },
  "$defs": {
    "node": {
      "type": "object",
      "additionalProperties": false,
      "required": ["node_id", "step_kind", "origin", "source_refs", "unknown_reasons"],
      "properties": {
        "node_id": {"type": "string"},
        "step_kind": {"type": "string"},
        "origin": {
          "enum": ["OBSERVED_ANCHOR", "USER_CHOICE", "SIMULATED_EXTENSION", "UNKNOWN"]
        },
        "source_refs": {"type": "array", "items": {"type": "string"}},
        "unknown_reasons": {"type": "array", "items": {"type": "string"}}
      }
    },
    "edge": {
      "type": "object",
      "additionalProperties": false,
      "required": ["edge_id", "edge_type", "from_node_ref", "to_node_ref", "condition_refs"],
      "properties": {
        "edge_id": {"type": "string"},
        "edge_type": {"const": "SIMULATED_TRANSITION"},
        "from_node_ref": {"type": "string"},
        "to_node_ref": {"type": "string"},
        "condition_refs": {"type": "array", "items": {"type": "string"}}
      }
    }
  }
}
```

scenario nodeは`origin = OBSERVED_ANCHOR | USER_CHOICE | SIMULATED_EXTENSION | UNKNOWN`を必須にする。observed graph nodeへIF fieldを追加しない。`rank`、`score`、`probability`、`optimality`はadditional propertiesとして拒否する。

## 8. `ExperiencePlan`

```json
{
  "$id": "cocolon.cmee.experience_plan.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "plan_id",
    "plan_version",
    "core_id",
    "product_job",
    "semantic_graph_ref",
    "duties",
    "ordering",
    "interaction_acts",
    "artifact_plans",
    "surface_constraints",
    "forbidden_promotions",
    "fallback_disposition"
  ],
  "properties": {
    "plan_id": {"type": "string"},
    "plan_version": {"type": "integer", "minimum": 1},
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "product_job": {
      "enum": ["OBSERVE_AND_CLARIFY", "EXPRESS_AND_SHARE", "MAP_AND_EXPLORE"]
    },
    "semantic_graph_ref": {"type": "string", "pattern": "^(grounded|hypothetical):[^@]+@[^@]+$"},
    "duties": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "duty_id", "duty_kind", "semantic_refs", "retention",
          "allowed_operations", "forbidden_operations"
        ],
        "properties": {
          "duty_id": {"type": "string"},
          "duty_kind": {"type": "string"},
          "semantic_refs": {"type": "array", "items": {"type": "string", "pattern": "^(node|edge):[^@]+@[^@]+$"}},
          "retention": {"enum": ["REQUIRED", "OPTIONAL", "DEFERRED"]},
          "allowed_operations": {"type": "array", "items": {"type": "string"}},
          "forbidden_operations": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    "ordering": {"type": "array", "items": {"type": "string"}},
    "interaction_acts": {"type": "array", "items": {"type": "string"}},
    "artifact_plans": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "artifact_plan_id", "artifact_kind", "primary_duty_refs",
          "companion_duty_refs", "projection_kind", "constraint_refs"
        ],
        "properties": {
          "artifact_plan_id": {"type": "string"},
          "artifact_kind": {"type": "string"},
          "primary_duty_refs": {"type": "array", "minItems": 1, "items": {"type": "string"}},
          "companion_duty_refs": {"type": "array", "items": {"type": "string"}},
          "projection_kind": {"type": "string"},
          "constraint_refs": {"type": "array", "items": {"type": "string"}}
        }
      }
    },
    "surface_constraints": {"type": "array", "items": {"type": "string"}},
    "forbidden_promotions": {"type": "array", "items": {"type": "string"}},
    "fallback_disposition": {
      "enum": ["LIMITED", "UNAVAILABLE", "ASK", "REJECT"]
    }
  }
}
```

`ExperiencePlan.duties[]`はshared plan-dutyのsole canonical recordである。source coverage denominator、meaning graph、core product taxonomyまたはhuman Product Readをdutiesへ混ぜない。current PR #3の`SourceOwnerUniverse`と`RouteBOwnerDisposition`はcatalogへshared schemaとして追加せず、Emlis provisional specializationとして§16で扱う。

plan／graph／semantic refsはversion-qualifiedにする。同一plan内のlocal duty ID／artifact-plan IDはそのplan versionのnamespace内だけで有効であり、別planからbare IDで参照しない。

## 9. `GenerationArtifactBundle`

```json
{
  "$id": "cocolon.cmee.generation_artifact_bundle.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "artifact_id",
    "artifact_version",
    "artifact_kind",
    "epistemic_partition",
    "core_id",
    "product_job",
    "source_commitments",
    "semantic_graph_ref",
    "experience_plan_ref",
    "parent_artifact_refs",
    "derivation_lineage",
    "primary_artifact",
    "companion_artifacts",
    "realization_trace_ref",
    "machine_quality_report_ref",
    "lifecycle_bindings",
    "status"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.cmee.generation_artifact_bundle.v1alpha1"
    },
    "artifact_id": {"type": "string"},
    "artifact_version": {"type": "integer", "minimum": 1},
    "artifact_kind": {
      "enum": [
        "EMLIS_CONVERSATIONAL_OBSERVATION",
        "PIECE_VISUAL_CARD_SPEC",
        "ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP",
        "ANALYSIS_IF_SCENARIO_SET",
        "ANALYSIS_SAVED_ROUTE_INTENT"
      ]
    },
    "epistemic_partition": {
      "enum": ["SOURCE_BOUND_PROVISIONAL", "OBSERVED", "HYPOTHETICAL", "USER_SAVED_INTENT"]
    },
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "product_job": {
      "enum": ["OBSERVE_AND_CLARIFY", "EXPRESS_AND_SHARE", "MAP_AND_EXPLORE"]
    },
    "source_commitments": {
      "type": "array",
      "minItems": 1,
      "items": {"$ref": "#/$defs/sourceCommitmentRef"}
    },
    "semantic_graph_ref": {
      "oneOf": [
        {"type": "string", "pattern": "^grounded:[^@]+@[^@]+$"},
        {"type": "string", "pattern": "^hypothetical:[^@]+@[^@]+$"},
        {"type": "string", "pattern": "^scenario-set:[^@]+@[^@]+$"}
      ]
    },
    "experience_plan_ref": {"type": "string", "pattern": "^plan:[^@]+@[^@]+$"},
    "parent_artifact_refs": {"type": "array", "items": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"}},
    "derivation_lineage": {"type": "array", "items": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"}},
    "primary_artifact": {
      "oneOf": [
        {"$ref": "#/$defs/emlis"},
        {"$ref": "#/$defs/piece"},
        {"$ref": "#/$defs/observedMap"},
        {"$ref": "#/$defs/ifScenarioSet"},
        {"$ref": "#/$defs/savedIntent"}
      ]
    },
    "companion_artifacts": {
      "type": "array",
      "items": {"$ref": "#/$defs/companionArtifactRef"}
    },
    "realization_trace_ref": {"type": "string", "pattern": "^trace:[^@]+@[^@]+$"},
    "machine_quality_report_ref": {"type": "string", "pattern": "^machine-report:[^@]+@[^@]+$"},
    "lifecycle_bindings": {"$ref": "#/$defs/lifecycleBindings"},
    "status": {"enum": ["GENERATED", "LIMITED"]}
  },
  "$defs": {
    "sourceCommitmentRef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["source_id", "source_version", "commitment_id", "private_digest_ref"],
      "properties": {
        "source_id": {"type": "string"},
        "source_version": {"type": "string"},
        "commitment_id": {"type": "string"},
        "private_digest_ref": {"type": "string"}
      }
    },
    "companionArtifactRef": {
      "type": "object",
      "additionalProperties": false,
      "required": ["artifact_ref", "artifact_kind", "relation"],
      "properties": {
        "artifact_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
        "artifact_kind": {"type": "string"},
        "relation": {"enum": ["CLARIFIES", "PROJECTS", "DERIVES_FROM", "CONTINUES"]}
      }
    },
    "lifecycleBindings": {
      "type": "object",
      "additionalProperties": false,
      "required": ["canonical_content_hash", "version_set", "storage_owner", "projection_refs"],
      "properties": {
        "canonical_content_hash": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
        "version_set": {"type": "object", "additionalProperties": {"type": "string"}},
        "storage_owner": {"type": "string"},
        "projection_refs": {"type": "array", "items": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"}, "uniqueItems": true}
      }
    },
    "emlis": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "kind", "observation_stage", "sufficiency_decision",
        "observation_blocks", "reception_block"
      ],
      "properties": {
        "kind": {"const": "EMLIS_CONVERSATIONAL_OBSERVATION"},
        "observation_stage": {"enum": ["NORMAL", "PRE_QUESTION", "REFINED"]},
        "sufficiency_decision": {
          "enum": ["SUFFICIENT", "LIMITED", "ASK"]
        },
        "observation_blocks": {
          "type": "array",
          "minItems": 1,
          "items": {"$ref": "#/$defs/visibleBlock"}
        },
        "reception_block": {"$ref": "#/$defs/receptionBlock"}
      }
    },
    "visibleBlock": {
      "type": "object",
      "additionalProperties": false,
      "required": ["block_id", "visible_text", "duty_refs", "visible_text_private_hash"],
      "properties": {
        "block_id": {"type": "string"},
        "visible_text": {"type": "string", "minLength": 1},
        "duty_refs": {"type": "array", "minItems": 1, "items": {"type": "string"}},
        "visible_text_private_hash": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"}
      }
    },
    "receptionBlock": {
      "type": "object",
      "additionalProperties": false,
      "required": ["block_id", "visible_text", "bound_observation_duty_refs", "visible_text_private_hash"],
      "properties": {
        "block_id": {"type": "string"},
        "visible_text": {"type": "string", "minLength": 1},
        "bound_observation_duty_refs": {
          "type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true
        },
        "visible_text_private_hash": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"}
      }
    },
    "piece": {"$ref": "cocolon.cmee.piece_visual_card_payload.v1alpha1"},
    "observedMap": {"$ref": "cocolon.cmee.analysis_observed_map_payload.v1alpha1"},
    "ifScenarioSet": {"$ref": "cocolon.cmee.analysis_if_scenario_candidate_set.v1alpha1"},
    "savedIntent": {"$ref": "cocolon.cmee.analysis_saved_route_intent_payload.v1alpha1"}
  }
}
```

実装時は次のvariant matrixをcode-level validatorとmutation testでexactに固定する。

| artifact_kind | core / product job | epistemic_partition | semantic_graph_ref |
|---|---|---|---|
| `EMLIS_CONVERSATIONAL_OBSERVATION` | `EMLIS_AI / OBSERVE_AND_CLARIFY` | `SOURCE_BOUND_PROVISIONAL` | `grounded:` |
| `PIECE_VISUAL_CARD_SPEC` | `PIECE / EXPRESS_AND_SHARE` | `SOURCE_BOUND_PROVISIONAL` | `grounded:` |
| `ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP` | `ANALYSIS / MAP_AND_EXPLORE` | `OBSERVED` | `grounded:` |
| `ANALYSIS_IF_SCENARIO_SET` | `ANALYSIS / MAP_AND_EXPLORE` | `HYPOTHETICAL` | `scenario-set:` and primary candidate set ID exact match |
| `ANALYSIS_SAVED_ROUTE_INTENT` | `ANALYSIS / MAP_AND_EXPLORE` | `USER_SAVED_INTENT` | selected `hypothetical:` graph; source scenario setはparent ref |

`artifact_kind`、`primary_artifact.kind`、core、product job、partition、graph prefix / identityの一つでも不一致ならREJECTする。PieceをHYPOTHETICALにする、observed mapをscenario setへbindする、SavedRouteIntentをobserved graphへbindする等はschema shapeが通ってもadmitしない。

`source_commitments`はprivate bundle内でSource ID / version / private digest refを固定する。public API / telemetryへこのobjectをそのまま投影しない。public-safe reportはanonymous countsとapproved provider / schema / artifact identityだけを持つ。

`GenerationArtifactBundle`はvisible artifactがある`GENERATED | LIMITED`だけを持つ。`machine_quality_report_ref`は`MACHINE_ONLY` reportへのversion-qualified参照であり、human Product Read verdictではない。human evaluationはimmutable `artifact:<artifact_id>@<artifact_version>`を外側から参照し、bundle、status、canonical identityまたはlineageをmutateしない。`execution_scope`、A／B lane、cutover stateはbundle fieldにもidentity materialにも含めない。

### 9.1 `ClarificationRequest`

以下のv1alpha1 JSONは旧shared／Analysisを含む既存契約として維持する。Emlis問い版の新しいcallableは本書「Emlis thread v1 profile」を使い、旧JSONのLIMITED強制やtarget_unknown_refを緩和して流用しない。

問いの要否、prompt、source lifecycleはcore ownerが決める。EmlisとAnalysisでreason code / policyを共有しない。

```json
{
  "$id": "cocolon.cmee.clarification_request.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "clarification_id", "core_id", "parent_request_ref", "target_unknown_ref",
    "reason_code", "prompt_private", "skip_allowed", "max_answer_count",
    "answer_source_role", "status"
  ],
  "properties": {
    "clarification_id": {"type": "string"},
    "core_id": {"enum": ["EMLIS_AI", "ANALYSIS"]},
    "parent_request_ref": {"type": "string"},
    "target_unknown_ref": {"type": "string"},
    "reason_code": {"type": "string"},
    "prompt_private": {"type": "string", "minLength": 1},
    "skip_allowed": {"const": true},
    "max_answer_count": {"const": 1},
    "answer_source_role": {"enum": ["SUPPLEMENTAL_ANSWER", "SIMULATION_SESSION_MATERIAL"]},
    "status": {"enum": ["PENDING", "ANSWERED", "SKIPPED", "EXPIRED"]}
  },
  "allOf": [
    {
      "if": {"properties": {"core_id": {"const": "EMLIS_AI"}}, "required": ["core_id"]},
      "then": {"properties": {"answer_source_role": {"const": "SUPPLEMENTAL_ANSWER"}}}
    },
    {
      "if": {"properties": {"core_id": {"const": "ANALYSIS"}}, "required": ["core_id"]},
      "then": {"properties": {"answer_source_role": {"const": "SIMULATION_SESSION_MATERIAL"}}}
    }
  ]
}
```

`prompt_private`はbody-full artifactでpublic telemetryへ0。Analysis IFでbranch point / intent / constraint不足時はgraph / primary artifactを捏造せず、このrequestをouter outcomeへ返す。

### 9.2 `EngineOutcome`

以下のv1alpha1 JSONは旧shared／Analysisを含む既存契約として維持する。Emlis問い版の新しいcallableは本書「Emlis thread v1 profile」を使い、旧JSONのLIMITED強制やtarget_unknown_refを緩和して流用しない。

`GenerationArtifactBundle`はvisible artifactが存在する結果だけを表す。非生成結果をempty primary artifactで表現しない。

```json
{
  "$id": "cocolon.cmee.engine_outcome.v1alpha1",
  "oneOf": [
    {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "artifact_bundle", "clarification_request", "failure"],
      "properties": {
        "status": {"const": "GENERATED"},
        "artifact_bundle": {
          "allOf": [
            {"$ref": "cocolon.cmee.generation_artifact_bundle.v1alpha1"},
            {"properties": {"status": {"const": "GENERATED"}}, "required": ["status"]}
          ]
        },
        "clarification_request": {"type": "null"},
        "failure": {"type": "null"}
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "artifact_bundle", "clarification_request", "failure"],
      "properties": {
        "status": {"const": "LIMITED"},
        "artifact_bundle": {
          "allOf": [
            {"$ref": "cocolon.cmee.generation_artifact_bundle.v1alpha1"},
            {"properties": {"status": {"const": "LIMITED"}}, "required": ["status"]}
          ]
        },
        "clarification_request": {"type": "null"},
        "failure": {"type": "null"}
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "artifact_bundle", "clarification_request", "failure"],
      "properties": {
        "status": {"const": "QUESTION_PENDING"},
        "artifact_bundle": {
          "allOf": [
            {"$ref": "cocolon.cmee.generation_artifact_bundle.v1alpha1"},
            {
              "properties": {
                "status": {"const": "LIMITED"},
                "core_id": {"const": "EMLIS_AI"},
                "artifact_kind": {"const": "EMLIS_CONVERSATIONAL_OBSERVATION"},
                "primary_artifact": {
                  "properties": {
                    "kind": {"const": "EMLIS_CONVERSATIONAL_OBSERVATION"},
                    "observation_stage": {"const": "PRE_QUESTION"},
                    "sufficiency_decision": {"const": "ASK"}
                  },
                  "required": ["kind", "observation_stage", "sufficiency_decision", "observation_blocks", "reception_block"]
                }
              },
              "required": ["status", "core_id", "artifact_kind", "primary_artifact"]
            }
          ]
        },
        "clarification_request": {
          "allOf": [
            {"$ref": "cocolon.cmee.clarification_request.v1alpha1"},
            {"properties": {"core_id": {"const": "EMLIS_AI"}}, "required": ["core_id"]}
          ]
        },
        "failure": {"type": "null"}
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "artifact_bundle", "clarification_request", "failure"],
      "properties": {
        "status": {"const": "QUESTION_PENDING"},
        "artifact_bundle": {"type": "null"},
        "clarification_request": {
          "allOf": [
            {"$ref": "cocolon.cmee.clarification_request.v1alpha1"},
            {"properties": {"core_id": {"const": "ANALYSIS"}}, "required": ["core_id"]}
          ]
        },
        "failure": {"type": "null"}
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": ["status", "artifact_bundle", "clarification_request", "failure"],
      "properties": {
        "status": {"enum": ["REJECTED", "UNAVAILABLE", "SEPARATE_SAFETY"]},
        "artifact_bundle": {"type": "null"},
        "clarification_request": {"type": "null"},
        "failure": {"$ref": "cocolon.cmee.failure_envelope.v1alpha1"}
      },
      "allOf": [
        {
          "if": {"properties": {"status": {"const": "REJECTED"}}, "required": ["status"]},
          "then": {
            "properties": {
              "failure": {
                "allOf": [
                  {"$ref": "cocolon.cmee.failure_envelope.v1alpha1"},
                  {"properties": {"disposition": {"const": "REJECTED"}}, "required": ["disposition"]}
                ]
              }
            }
          }
        },
        {
          "if": {"properties": {"status": {"const": "UNAVAILABLE"}}, "required": ["status"]},
          "then": {
            "properties": {
              "failure": {
                "allOf": [
                  {"$ref": "cocolon.cmee.failure_envelope.v1alpha1"},
                  {"properties": {"disposition": {"const": "UNAVAILABLE"}}, "required": ["disposition"]}
                ]
              }
            }
          }
        },
        {
          "if": {"properties": {"status": {"const": "SEPARATE_SAFETY"}}, "required": ["status"]},
          "then": {
            "properties": {
              "failure": {
                "allOf": [
                  {"$ref": "cocolon.cmee.failure_envelope.v1alpha1"},
                  {"properties": {"disposition": {"const": "SEPARATE_SAFETY"}}, "required": ["disposition"]}
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

Analysis partial observed mapは`GENERATED`でありfailureではない。outer `GENERATED | LIMITED`はbundle statusとexact matchする。Emlis `QUESTION_PENDING`は`LIMITED`のpre-question observation bundle、Observation block、bound Receptionを必須とする。Analysis IF情報不足はbundle null exact1とする。どちらもtyped clarificationを必須とし、Analysisのstorage / latest mutationは0である。Schemaに加え、artifact kind / primary variant / core IDの全一致をcode-level validatorでも固定する。

`SEPARATE_SAFETY`はartifact bundle nullのtyped non-generation outcomeだけを表す。public safe response、current production safety owner、B cutover admissibilityまたはproduction ingress authorityを意味しない。このschemaからsafe-response／public-behavior mappingを作らず、Final／migration ownerがB前にsingle owner、silent empty 0、fallback／dual-run 0を別判断で固定する。

### 9.3 Piece contract profile

CMEEは既存Piece V2 contractと並列のidentityを作らない。canonical wire formatはlowercase `short_essay | quote | declaration`である。

| Existing contract | CMEE relation |
|---|---|
| `piece.record.v2` | record lifecycleとimmutable saved identityはPiece ownerに残す |
| `piece.content_payload.v1` | canonical `piece_text`とformatをCMEE artifactから供給する |
| `piece.content_meaning.v1` | source-bound meaning dutyへadaptし、二重meaning ownerを作らない |
| `piece.public_safety_transformation.v1` | Piece publicization policyとしてPiece compilerから呼ぶ |
| `piece.visual_recipe.v1` | Piece-owned recipe selection resultをartifactへbindする |

```json
{
  "$id": "cocolon.cmee.piece_visual_card_payload.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind", "format", "canonical_piece_text",
    "piece_text_hash", "body_blocks", "visual_recipe_ref", "visual_recipe_hash",
    "layout_plan", "version_set"
  ],
  "properties": {
    "kind": {"const": "PIECE_VISUAL_CARD_SPEC"},
    "format": {"enum": ["short_essay", "quote", "declaration"]},
    "canonical_piece_text": {"type": "string", "minLength": 1},
    "piece_text_hash": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "body_blocks": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["block_id", "block_role", "visible_text", "duty_refs"],
        "properties": {
          "block_id": {"type": "string"},
          "block_role": {"type": "string"},
          "visible_text": {"type": "string", "minLength": 1},
          "duty_refs": {"type": "array", "minItems": 1, "items": {"type": "string"}}
        }
      }
    },
    "visual_recipe_ref": {"type": "string"},
    "visual_recipe_hash": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"},
    "layout_plan": {
      "type": "object",
      "additionalProperties": false,
      "required": ["block_order", "wrap_policy", "minimum_font_policy", "no_clip", "no_ellipsis"],
      "properties": {
        "block_order": {"type": "array", "items": {"type": "string"}},
        "wrap_policy": {"type": "string"},
        "minimum_font_policy": {"type": "string"},
        "no_clip": {"const": true},
        "no_ellipsis": {"const": true}
      }
    },
    "version_set": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "piece_contract_version", "meaning_schema_version", "artifact_plan_version",
        "visual_recipe_version", "template_version", "layout_contract_version",
        "export_contract_version", "renderer_version"
      ],
      "properties": {
        "piece_contract_version": {"type": "string"},
        "meaning_schema_version": {"type": "string"},
        "artifact_plan_version": {"type": "string"},
        "visual_recipe_version": {"type": "string"},
        "template_version": {"type": "string"},
        "layout_contract_version": {"type": "string"},
        "export_contract_version": {"type": "string"},
        "renderer_version": {"type": "string"}
      }
    }
  }
}
```

### 9.4 Analysis source-set profile

`PERIOD_RECORD_IDENTITY`はrecord membershipであり、本文roleを潰すcontainerではない。各included recordはoriginalとoptional supplementalを別`SourceEnvelope`へbindする。

```json
{
  "$id": "cocolon.cmee.analysis_source_set.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "source_set_id", "source_set_version", "owner_scope", "period",
    "members", "dedupe_policy_version", "comparability_policy_version"
  ],
  "properties": {
    "source_set_id": {"type": "string"},
    "source_set_version": {"type": "integer", "minimum": 1},
    "owner_scope": {"const": "AUTHENTICATED_SAME_OWNER"},
    "period": {
      "type": "object",
      "additionalProperties": false,
      "required": ["start", "end"],
      "properties": {
        "start": {"type": "string", "format": "date-time"},
        "end": {"type": "string", "format": "date-time"}
      }
    },
    "members": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "saved_record_ref", "saved_record_version", "member_role", "source_commitment",
          "inclusion_status", "inclusion_or_exclusion_reason", "child_source_envelope_refs"
        ],
        "properties": {
          "saved_record_ref": {"type": "string"},
          "saved_record_version": {"type": "string"},
          "member_role": {"const": "PERIOD_RECORD_IDENTITY"},
          "source_commitment": {
            "type": "object",
            "additionalProperties": false,
            "required": ["source_id", "source_version", "commitment_id", "private_digest_ref"],
            "properties": {
              "source_id": {"type": "string"},
              "source_version": {"type": "string"},
              "commitment_id": {"type": "string"},
              "private_digest_ref": {"type": "string"}
            }
          },
          "inclusion_status": {"enum": ["INCLUDED", "EXCLUDED"]},
          "inclusion_or_exclusion_reason": {"type": "string"},
          "child_source_envelope_refs": {
            "type": "array",
            "items": {"type": "string"},
            "uniqueItems": true
          }
        }
      }
    },
    "dedupe_policy_version": {"type": "string"},
    "comparability_policy_version": {"type": "string"}
  }
}
```

included memberは`child_source_envelope_refs`に`ORIGINAL_INPUT` exact1と、存在する場合だけ`SUPPLEMENTAL_ANSWER`を別refで持つ。question decision、Emlis visible body、Piece artifact、simulation outputはperiod observed sourceにできない。

### 9.5 Analysis observed-map and visual profiles

```json
{
  "$id": "cocolon.cmee.analysis_observed_map_payload.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind", "wire_kind", "source_set_ref", "period", "route_graph",
    "annotation_claims", "unknown_gaps", "conflict_refs", "comparison_availability",
    "period_comparisons",
    "text_projection_ref", "visual_projection_ref"
  ],
  "properties": {
    "kind": {"const": "ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP"},
    "wire_kind": {"const": "watashi.map.v2"},
    "source_set_ref": {"type": "string"},
    "period": {
      "type": "object",
      "additionalProperties": false,
      "required": ["start", "end"],
      "properties": {
        "start": {"type": "string", "format": "date-time"},
        "end": {"type": "string", "format": "date-time"}
      }
    },
    "route_graph": {
      "type": "object",
      "additionalProperties": false,
      "required": ["nodes", "edges"],
      "properties": {
        "nodes": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["node_id", "node_kind", "evidence_refs"],
            "properties": {
              "node_id": {"type": "string"},
              "node_kind": {
                "enum": [
                  "SCENE", "ROLE", "ATTENTION_OR_THOUGHT",
                  "ACTION_OR_NONACTION", "IMMEDIATE_RESULT_OR_AFTERMATH"
                ]
              },
              "evidence_refs": {"type": "array", "minItems": 1, "items": {"type": "string"}}
            }
          }
        },
        "edges": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "object",
                "additionalProperties": false,
                "required": ["edge_id", "edge_type", "from_node_ref", "to_node_ref", "direction", "evidence_refs"],
                "properties": {
                  "edge_id": {"type": "string"},
                  "edge_type": {"const": "OBSERVED_ORDER"},
                  "from_node_ref": {"type": "string"},
                  "to_node_ref": {"type": "string"},
                  "direction": {"const": "DIRECTED"},
                  "evidence_refs": {"type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true}
                }
              },
              {
                "type": "object",
                "additionalProperties": false,
                "required": ["edge_id", "edge_type", "node_refs", "direction", "evidence_refs"],
                "properties": {
                  "edge_id": {"type": "string"},
                  "edge_type": {"const": "REPEATED_COOCCURRENCE"},
                  "node_refs": {"type": "array", "minItems": 2, "items": {"type": "string"}, "uniqueItems": true},
                  "direction": {"const": "UNDIRECTED"},
                  "evidence_refs": {"type": "array", "minItems": 2, "items": {"type": "string"}, "uniqueItems": true}
                }
              }
            ]
          }
        }
      }
    },
    "annotation_claims": {"type": "array", "items": {"$ref": "#/$defs/annotation"}},
    "unknown_gaps": {"type": "array", "items": {"$ref": "#/$defs/unknownGap"}},
    "conflict_refs": {"type": "array", "items": {"type": "string"}},
    "comparison_availability": {"enum": ["NO_PREVIOUS", "COMPARISON_PRESENT"]},
    "period_comparisons": {
      "type": "array",
      "maxItems": 1,
      "items": {"$ref": "cocolon.cmee.analysis_period_comparison.v1alpha1"}
    },
    "text_projection_ref": {"type": "string"},
    "visual_projection_ref": {"type": "string"}
  },
  "$defs": {
    "annotation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "annotation_id", "kind", "target_ref", "annotation_state",
        "evidence_refs", "uncertainty", "alternative_explanations", "forbidden_promotions"
      ],
      "properties": {
        "annotation_id": {"type": "string"},
        "kind": {"enum": ["PROTECTIVE", "BURDEN"]},
        "target_ref": {"type": "string"},
        "annotation_state": {
          "enum": ["SOURCE_EXPLICIT_ANNOTATION", "EVIDENCE_BOUND_INTERPRETIVE_HYPOTHESIS"]
        },
        "evidence_refs": {
          "type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true
        },
        "uncertainty": {"type": "string"},
        "alternative_explanations": {"type": "array", "items": {"type": "string"}},
        "forbidden_promotions": {"type": "array", "items": {"type": "string"}}
      }
    },
    "unknownGap": {
      "type": "object",
      "additionalProperties": false,
      "required": ["gap_id", "between_node_refs", "missing_scope", "reason_code", "source_set_ref"],
      "properties": {
        "gap_id": {"type": "string"},
        "between_node_refs": {
          "type": "array", "minItems": 1, "maxItems": 2,
          "items": {"type": "string"}, "uniqueItems": true
        },
        "missing_scope": {"type": "string"},
        "reason_code": {"type": "string"},
        "source_set_ref": {"type": "string"}
      }
    }
  }
}
```

`REPEATED_COOCCURRENCE`のevidenceはdistinct source exact2以上であることをcode-level validatorで確認する。`UNKNOWN_GAP`はobserved edgeではなく別marker、protective / burdenはroute nodeではなくannotationである。`comparison_availability=NO_PREVIOUS`では`period_comparisons` exact0、`COMPARISON_PRESENT`ではexact1とし、comparison objectを同じimmutable canonical stored JSONへ含める。

```json
{
  "$id": "cocolon.cmee.analysis_period_comparison.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "comparison_id", "current_artifact_ref", "current_source_set_ref",
    "previous_artifact_ref", "previous_source_set_ref", "comparability_state",
    "reason_codes", "change_claims"
  ],
  "properties": {
    "comparison_id": {"type": "string"},
    "current_artifact_ref": {"type": "string"},
    "current_source_set_ref": {"type": "string"},
    "previous_artifact_ref": {"type": "string"},
    "previous_source_set_ref": {"type": "string"},
    "comparability_state": {"enum": ["COMPARABLE", "NOT_COMPARABLE"]},
    "reason_codes": {"type": "array", "items": {"type": "string"}},
    "change_claims": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["change_id", "change_kind", "current_ref", "previous_ref", "evidence_refs"],
        "properties": {
          "change_id": {"type": "string"},
          "change_kind": {
            "enum": [
              "ROUTE_EVIDENCE_CHANGED", "ANNOTATION_EVIDENCE_CHANGED",
              "UNKNOWN_SCOPE_CHANGED", "CONFLICT_STATE_CHANGED"
            ]
          },
          "current_ref": {"type": "string"},
          "previous_ref": {"type": "string"},
          "evidence_refs": {
            "type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true
          }
        }
      }
    }
  }
}
```

`NOT_COMPARABLE`では`change_claims` exact0とし、reason codeを1件以上要求する。`COMPARABLE`でもchangeをimprovement / deterioration / causeへ自動昇格しない。このcross-field ruleはcode-level validatorで固定する。

```json
{
  "$id": "cocolon.cmee.analysis_visual_plan.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "projection_id", "projection_of", "node_specs", "edge_specs", "lane_specs",
    "group_specs", "evidence_badges", "unknown_badges", "branch_markers",
    "style_tokens", "accessibility_linear_order", "text_fallback_ref"
  ],
  "properties": {
    "projection_id": {"type": "string"},
    "projection_of": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "node_specs": {"type": "array", "items": {"$ref": "#/$defs/nodeSpec"}},
    "edge_specs": {"type": "array", "items": {"$ref": "#/$defs/edgeSpec"}},
    "lane_specs": {"type": "array", "items": {"$ref": "#/$defs/laneSpec"}},
    "group_specs": {"type": "array", "items": {"$ref": "#/$defs/groupSpec"}},
    "evidence_badges": {"type": "array", "items": {"$ref": "#/$defs/badgeSpec"}},
    "unknown_badges": {"type": "array", "items": {"$ref": "#/$defs/badgeSpec"}},
    "branch_markers": {"type": "array", "items": {"$ref": "#/$defs/branchMarker"}},
    "style_tokens": {
      "type": "object",
      "additionalProperties": false,
      "required": ["theme_ref", "layout_policy_ref", "accessibility_policy_ref"],
      "properties": {
        "theme_ref": {"type": "string"},
        "layout_policy_ref": {"type": "string"},
        "accessibility_policy_ref": {"type": "string"}
      }
    },
    "accessibility_linear_order": {"type": "array", "items": {"type": "string"}},
    "text_fallback_ref": {"type": "string"}
  },
  "$defs": {
    "nodeSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["node_ref", "lane_ref", "display_role", "label_ref"],
      "properties": {
        "node_ref": {"type": "string"},
        "lane_ref": {"type": "string"},
        "display_role": {"enum": ["OBSERVED", "SIMULATED", "UNKNOWN", "ANNOTATION"]},
        "label_ref": {"type": "string"}
      }
    },
    "edgeSpec": {
      "oneOf": [
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["edge_ref", "display_role", "from_ref", "to_ref", "line_style", "label_ref"],
          "properties": {
            "edge_ref": {"type": "string"},
            "display_role": {"enum": ["OBSERVED_ORDER", "SIMULATED_TRANSITION"]},
            "from_ref": {"type": "string"},
            "to_ref": {"type": "string"},
            "line_style": {"enum": ["SOLID", "DASHED", "DOTTED"]},
            "label_ref": {"type": "string"}
          }
        },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["edge_ref", "display_role", "endpoint_refs", "line_style", "label_ref"],
          "properties": {
            "edge_ref": {"type": "string"},
            "display_role": {"const": "REPEATED_COOCCURRENCE"},
            "endpoint_refs": {
              "type": "array", "minItems": 2, "items": {"type": "string"}, "uniqueItems": true
            },
            "line_style": {"enum": ["SOLID", "DOTTED"]},
            "label_ref": {"type": "string"}
          }
        }
      ]
    },
    "laneSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["lane_ref", "lane_role", "label_ref"],
      "properties": {
        "lane_ref": {"type": "string"},
        "lane_role": {"enum": ["OBSERVED", "SIMULATED", "ANNOTATION"]},
        "label_ref": {"type": "string"}
      }
    },
    "groupSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["group_ref", "member_refs", "display_role", "label_ref"],
      "properties": {
        "group_ref": {"type": "string"},
        "member_refs": {
          "type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true
        },
        "display_role": {"enum": ["OBSERVED_CLUSTER", "SIMULATED_SCENARIO", "ANNOTATION_GROUP"]},
        "label_ref": {"type": "string"}
      }
    },
    "branchMarker": {
      "type": "object",
      "additionalProperties": false,
      "required": ["branch_point_ref", "selected_node_ref", "marker_role", "label_ref"],
      "properties": {
        "branch_point_ref": {"type": "string"},
        "selected_node_ref": {"type": "string"},
        "marker_role": {"const": "USER_SELECTED_BRANCH"},
        "label_ref": {"type": "string"}
      }
    },
    "badgeSpec": {
      "type": "object",
      "additionalProperties": false,
      "required": ["target_ref", "badge_kind", "label_ref"],
      "properties": {
        "target_ref": {"type": "string"},
        "badge_kind": {"enum": ["EVIDENCE", "UNKNOWN", "CONFLICT", "HYPOTHESIS"]},
        "label_ref": {"type": "string"}
      }
    }
  }
}
```

`AnalysisVisualPlan`はprivate planである。API / RNへは次のsafe projectionだけを渡し、private source / evidence identityを除外する。

2026-10-03 u94補足：このDTOは認証された本人向けSELF_ONLY商品表示であり、匿名telemetry／外部共有用ではない。visible_labelは根拠にbindした名詞項・格・極性・modality／時点から再構成でき、意味上必要な本人入力の名詞を含みうる。raw bodyの複製、private source ID、evidence locator、source digestは含めない。unknown_gaps.between_node_refs、annotation_badges.target_ref、conflict_badges.target_refsをRN modelと文章にも保持し、同一ラベルのdedupeで対象関係を消さない。owner文字列一致は認証の代用ではなく、lifecycle ownerの認証／tier／retention／削除再検査が別途必要。u94はoffline producerとRN receiverまでで、実API配信は未接続。

```json
{
  "$id": "cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version", "wire_kind", "projection_of", "artifact_version",
    "period_label", "period_comparison", "nodes", "edges", "annotation_badges",
    "unknown_gaps", "conflict_badges", "accessibility_linear_order"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1"},
    "wire_kind": {"const": "watashi.map.v2"},
    "projection_of": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "artifact_version": {"type": "integer", "minimum": 1},
    "period_label": {"type": "string"},
    "period_comparison": {
      "type": "object",
      "additionalProperties": false,
      "required": ["state", "reason_codes", "safe_change_kinds"],
      "properties": {
        "state": {"enum": ["NO_PREVIOUS", "COMPARABLE", "NOT_COMPARABLE"]},
        "reason_codes": {"type": "array", "items": {"type": "string"}},
        "safe_change_kinds": {
          "type": "array",
          "items": {
            "enum": [
              "ROUTE_EVIDENCE_CHANGED", "ANNOTATION_EVIDENCE_CHANGED",
              "UNKNOWN_SCOPE_CHANGED", "CONFLICT_STATE_CHANGED"
            ]
          },
          "uniqueItems": true
        }
      }
    },
    "nodes": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["node_ref", "node_kind", "visible_label", "evidence_badge_count"],
        "properties": {
          "node_ref": {"type": "string"},
          "node_kind": {"type": "string"},
          "visible_label": {"type": "string"},
          "evidence_badge_count": {"type": "integer", "minimum": 0}
        }
      }
    },
    "edges": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "type": "object",
            "additionalProperties": false,
            "required": ["edge_ref", "edge_kind", "from_ref", "to_ref", "visible_label"],
            "properties": {
              "edge_ref": {"type": "string"},
              "edge_kind": {"const": "OBSERVED_ORDER"},
              "from_ref": {"type": "string"},
              "to_ref": {"type": "string"},
              "visible_label": {"type": "string"}
            }
          },
          {
            "type": "object",
            "additionalProperties": false,
            "required": ["edge_ref", "edge_kind", "endpoint_refs", "visible_label"],
            "properties": {
              "edge_ref": {"type": "string"},
              "edge_kind": {"const": "REPEATED_COOCCURRENCE"},
              "endpoint_refs": {
                "type": "array", "minItems": 2, "items": {"type": "string"}, "uniqueItems": true
              },
              "visible_label": {"type": "string"}
            }
          }
        ]
      }
    },
    "annotation_badges": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["annotation_ref", "target_ref", "kind", "visible_label"],
        "properties": {
          "annotation_ref": {"type": "string"},
          "target_ref": {"type": "string"},
          "kind": {"enum": ["PROTECTIVE", "BURDEN"]},
          "visible_label": {"type": "string"}
        }
      }
    },
    "unknown_gaps": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["gap_ref", "between_node_refs", "visible_label"],
        "properties": {
          "gap_ref": {"type": "string"},
          "between_node_refs": {
            "type": "array", "minItems": 1, "maxItems": 2,
            "items": {"type": "string"}, "uniqueItems": true
          },
          "visible_label": {"type": "string"}
        }
      }
    },
    "conflict_badges": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["conflict_ref", "target_refs", "visible_label"],
        "properties": {
          "conflict_ref": {"type": "string"},
          "target_refs": {
            "type": "array", "minItems": 1, "items": {"type": "string"}, "uniqueItems": true
          },
          "visible_label": {"type": "string"}
        }
      }
    },
    "accessibility_linear_order": {"type": "array", "items": {"type": "string"}}
  }
}
```

このprojectionはaccess policyを置き換えない。`projection_of`はcanonical `artifact_id@version`へ解決し、raw body、private source ID、private evidence locator、source digestを持たない。latest / history / detailの各viewは同じcanonical identityを参照するが、audienceごとのauthorized projection bytesまで同一である必要はない。`NO_PREVIOUS`と`NOT_COMPARABLE`では`safe_change_kinds` exact0、`NOT_COMPARABLE`ではreason code exact1以上とする。`COMPARABLE`だけがsafe change kindを持てるが、改善・悪化・原因・達成labelへ変換しない。

### 9.6 Analysis IF-route profile

```json
{
  "$id": "cocolon.cmee.analysis_if_route_payload.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind", "wire_kind", "scenario_artifact_ref",
    "base_observed_map_ref", "base_route_ref", "branch_point_id",
    "scenario_graph_ref", "branch_intent_source_ref", "condition_refs",
    "unmodelled_factor_refs", "text_projection_ref", "visual_projection_ref",
    "scenario_display_label"
  ],
  "properties": {
    "kind": {"const": "ANALYSIS_IF_ROUTE_SIMULATION"},
    "wire_kind": {"const": "watashi.if-route.v1"},
    "scenario_artifact_ref": {"type": "string", "pattern": "^analysis-if-scenario:"},
    "base_observed_map_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "base_route_ref": {"type": "string", "pattern": "^route:[^@]+@[^@]+$"},
    "branch_point_id": {"type": "string"},
    "scenario_graph_ref": {"type": "string", "pattern": "^hypothetical:"},
    "branch_intent_source_ref": {"type": "string", "pattern": "^source:[^@]+@[^@]+$"},
    "condition_refs": {"type": "array", "items": {"type": "string"}},
    "unmodelled_factor_refs": {"type": "array", "items": {"type": "string"}},
    "text_projection_ref": {"type": "string"},
    "visual_projection_ref": {"type": "string"},
    "scenario_display_label": {"type": "string", "minLength": 1}
  }
}
```

`HypotheticalScenarioGraph`のstrict `origin` / `SIMULATED_TRANSITION` contractを参照し、scenario同士のrank / score / probability / optimalityを追加しない。

```json
{
  "$id": "cocolon.cmee.analysis_if_scenario_candidate_set.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind", "wire_kind", "candidate_set_id", "base_observed_map_ref",
    "base_route_ref", "scenarios", "display_order", "selection_policy"
  ],
  "properties": {
    "kind": {"const": "ANALYSIS_IF_SCENARIO_SET"},
    "wire_kind": {"const": "watashi.if-route-set.v1"},
    "candidate_set_id": {"type": "string", "pattern": "^scenario-set:"},
    "base_observed_map_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "base_route_ref": {"type": "string", "pattern": "^route:[^@]+@[^@]+$"},
    "scenarios": {
      "type": "array", "minItems": 1, "maxItems": 3,
      "items": {"$ref": "cocolon.cmee.analysis_if_route_payload.v1alpha1"}
    },
    "display_order": {
      "type": "array", "minItems": 1, "maxItems": 3,
      "items": {"type": "string", "pattern": "^analysis-if-scenario:"},
      "uniqueItems": true
    },
    "selection_policy": {"const": "PARALLEL_NOT_RANKED"}
  }
}
```

`scenarios[].scenario_artifact_ref` setと`display_order`はexact matchし、全scenarioが同じ`base_observed_map_ref` / `base_route_ref`へbindする。`display_order`はUI上の安定表示順だけであり、rank、score、probability、best flagではない。Bundleのprimary artifactはこのcandidate set exact1で、個々のscenarioはその内包artifactである。意味の異なるscenarioを`companion_artifacts`の曖昧な並びへ逃がさない。

```json
{
  "$id": "cocolon.cmee.analysis_saved_route_intent_payload.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "kind", "wire_kind", "source_scenario_set_ref", "selected_scenario_ref",
    "selection_source_ref", "user_note_source_ref", "saved_at"
  ],
  "properties": {
    "kind": {"const": "ANALYSIS_SAVED_ROUTE_INTENT"},
    "wire_kind": {"const": "watashi.saved-route-intent.v1"},
    "source_scenario_set_ref": {"type": "string", "pattern": "^scenario-set:[^@]+@[^@]+$"},
    "selected_scenario_ref": {"type": "string", "pattern": "^analysis-if-scenario:[^@]+@[^@]+$"},
    "selection_source_ref": {"type": "string"},
    "user_note_source_ref": {"type": ["string", "null"]},
    "saved_at": {"type": "string", "format": "date-time"}
  }
}
```

validatorは`selected_scenario_ref`が`source_scenario_set_ref`のmember exact1であること、Bundleの`parent_artifact_refs`にscenario setがあること、`source_commitments`にuser selection SourceEnvelope exact1とoptional note sourceだけがあることを確認する。scenario / simulation artifactをsource commitmentへ入れない。

```json
{
  "$id": "cocolon.cmee.analysis_if_safe_projection.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version", "wire_kind", "projection_of", "base_observed_map_ref",
    "base_route_ref", "selection_policy", "scenarios"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.cmee.analysis_if_safe_projection.v1alpha1"},
    "wire_kind": {"const": "watashi.if-route-set.v1"},
    "projection_of": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "base_observed_map_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "base_route_ref": {"type": "string", "pattern": "^route:[^@]+@[^@]+$"},
    "selection_policy": {"const": "PARALLEL_NOT_RANKED"},
    "scenarios": {
      "type": "array", "minItems": 1, "maxItems": 3,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "scenario_ref", "branch_point_ref", "visible_label", "nodes", "edges",
          "required_conditions", "frictions", "unmodelled_factors"
        ],
        "properties": {
          "scenario_ref": {"type": "string"},
          "branch_point_ref": {"type": "string"},
          "visible_label": {"type": "string"},
          "nodes": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": ["node_ref", "origin", "visible_label"],
              "properties": {
                "node_ref": {"type": "string"},
                "origin": {"enum": ["OBSERVED_ANCHOR", "USER_CHOICE", "SIMULATED_EXTENSION", "UNKNOWN"]},
                "visible_label": {"type": "string"}
              }
            }
          },
          "edges": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": ["edge_ref", "from_ref", "to_ref", "visible_condition_labels"],
              "properties": {
                "edge_ref": {"type": "string"},
                "from_ref": {"type": "string"},
                "to_ref": {"type": "string"},
                "visible_condition_labels": {"type": "array", "items": {"type": "string"}}
              }
            }
          },
          "required_conditions": {"type": "array", "items": {"type": "string"}},
          "frictions": {"type": "array", "items": {"type": "string"}},
          "unmodelled_factors": {"type": "array", "items": {"type": "string"}}
        }
      }
    }
  }
}
```

```json
{
  "$id": "cocolon.cmee.analysis_saved_intent_safe_projection.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version", "wire_kind", "projection_of", "source_scenario_set_ref",
    "selected_scenario_ref", "visible_note", "saved_at"
  ],
  "properties": {
    "schema_version": {"const": "cocolon.cmee.analysis_saved_intent_safe_projection.v1alpha1"},
    "wire_kind": {"const": "watashi.saved-route-intent.v1"},
    "projection_of": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "source_scenario_set_ref": {"type": "string", "pattern": "^scenario-set:[^@]+@[^@]+$"},
    "selected_scenario_ref": {"type": "string", "pattern": "^analysis-if-scenario:[^@]+@[^@]+$"},
    "visible_note": {"type": ["string", "null"]},
    "saved_at": {"type": "string", "format": "date-time"}
  }
}
```

IF setとSavedRouteIntentのstorage / API / RN identityはobserved `watashi.map.v2`と別namespaceにする。Analysis lifecycle storage / access ownerだけがimmutable persistenceとauthorized safe projectionを行い、CMEE kernelはDB ownerにならない。view-time regeneration、observed payloadへのinline mutation、v1 fallback、rank / score / probability fieldは0である。

## 10. `PositiveRealizationTrace`

```json
{
  "$id": "cocolon.cmee.positive_realization_trace.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "trace_id", "trace_version", "artifact_ref", "units", "required_duty_coverage"
  ],
  "properties": {
    "trace_id": {"type": "string"},
    "trace_version": {"type": "integer", "minimum": 1},
    "artifact_ref": {"type": "string", "pattern": "^artifact:[^@]+@[^@]+$"},
    "units": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "visible_artifact_unit_ref", "unit_role", "plan_duty_ref",
          "semantic_node_or_edge_refs", "attachment_witness_refs",
          "source_evidence_refs", "constrained_owner_refs",
          "realization_operation", "coverage_status"
        ],
        "properties": {
          "visible_artifact_unit_ref": {"type": "string"},
          "unit_role": {
            "enum": ["SEMANTIC_REALIZATION", "UNKNOWN_DISCLOSURE", "RECEPTION"]
          },
          "plan_duty_ref": {"type": "string", "pattern": "^duty:[^@]+@[^@]+$"},
          "semantic_node_or_edge_refs": {
            "type": "array",
            "items": {"type": "string", "pattern": "^(node|edge):[^@]+@[^@]+$"}
          },
          "attachment_witness_refs": {
            "type": "array",
            "items": {"type": "string", "pattern": "^attachment-witness:[^@]+@[^@]+$"}
          },
          "source_evidence_refs": {
            "type": "array",
            "minItems": 1,
            "items": {"type": "string", "pattern": "^evidence:[^@]+@[^@]+$"}
          },
          "constrained_owner_refs": {
            "type": "array",
            "items": {"type": "string", "pattern": "^owner:[^@]+@[^@]+$"}
          },
          "realization_operation": {"type": "string"},
          "coverage_status": {"enum": ["COVERED", "UNCOVERED", "INVALID"]}
        },
        "allOf": [
          {
            "if": {
              "properties": {"unit_role": {"const": "UNKNOWN_DISCLOSURE"}},
              "required": ["unit_role"]
            },
            "then": {
              "properties": {
                "semantic_node_or_edge_refs": {"maxItems": 0},
                "constrained_owner_refs": {"minItems": 1}
              }
            },
            "else": {
              "properties": {"semantic_node_or_edge_refs": {"minItems": 1}}
            }
          }
        ]
      }
    },
    "required_duty_coverage": {"enum": ["COMPLETE", "INCOMPLETE"]}
  }
}
```

visible unitからplan duty、meaning、EvidenceGraph内EvidenceSpanまで連続しない場合はinvalid。`UNKNOWN_DISCLOSURE`はfake UNKNOWN nodeを作らず、semantic refs exact0、constrained owner refs exact1以上、evidence exact1以上で「何を確定しなかったか」を示す。provider proposal単独のattachment witnessはvisible authorityにならない。

current PR #3の`VisibleUnitTrace`はこのcanonical traceへのV1-A provisional implementation mappingでありsecond schema ownerではない。`CommonGuardProof`はmachine guard evidence、Emlis body-only inverseはEmlis core-owned completed-body verification、human Product Readはexternal evaluationであり、いずれもPositiveRealizationTraceを代替しない。trace body、source range、visible textをpublic GitHubへ出さない。

## 11. Body-free machine report

```json
{
  "$id": "cocolon.cmee.body_free_quality_report.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schema_version",
    "report_id",
    "report_version",
    "assessment_scope",
    "evaluated_artifact_ref",
    "core_id",
    "product_job",
    "artifact_kind",
    "status",
    "meaning_derivation_mode",
    "schema_versions",
    "provider_identity_digest",
    "policy_versions",
    "check_results",
    "metrics",
    "reason_codes",
    "body_free"
  ],
  "properties": {
    "schema_version": {
      "const": "cocolon.cmee.body_free_quality_report.v1alpha1"
    },
    "report_id": {"type": "string", "minLength": 1},
    "report_version": {"type": "integer", "minimum": 1},
    "assessment_scope": {"const": "MACHINE_ONLY"},
    "evaluated_artifact_ref": {
      "type": ["string", "null"],
      "pattern": "^artifact:[^@]+@[^@]+$"
    },
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "product_job": {
      "enum": ["OBSERVE_AND_CLARIFY", "EXPRESS_AND_SHARE", "MAP_AND_EXPLORE"]
    },
    "artifact_kind": {"type": ["string", "null"]},
    "status": {
      "enum": ["GENERATED", "QUESTION_PENDING", "LIMITED", "REJECTED", "UNAVAILABLE", "SEPARATE_SAFETY"]
    },
    "meaning_derivation_mode": {
      "enum": ["SOURCE_OR_USER_EVIDENCE_ONLY", "FORMAL_ATTACHMENT_ADMITTED", "NOT_REACHED"]
    },
    "schema_versions": {"type": "object", "additionalProperties": {"type": "string"}},
    "provider_identity_digest": {
      "type": ["string", "null"],
      "pattern": "^sha256:[0-9a-f]{64}$"
    },
    "policy_versions": {"type": "object", "additionalProperties": {"type": "string"}},
    "check_results": {"type": "object", "additionalProperties": {"type": "boolean"}},
    "metrics": {"type": "object", "additionalProperties": {"type": "integer", "minimum": 0}},
    "reason_codes": {"type": "array", "items": {"type": "string"}},
    "body_free": {"const": true}
  },
  "allOf": [
    {
      "if": {
        "properties": {"meaning_derivation_mode": {"const": "FORMAL_ATTACHMENT_ADMITTED"}},
        "required": ["meaning_derivation_mode"]
      },
      "then": {
        "properties": {
          "provider_identity_digest": {"type": "string", "pattern": "^sha256:[0-9a-f]{64}$"}
        }
      },
      "else": {"properties": {"provider_identity_digest": {"type": "null"}}}
    }
  ]
}
```

`machine-report:<report_id>@<report_version>`をcanonical report refとする。provider digestがnullなのはpreselected source／user evidence routeまたはprovider stage未到達だけであり、provider-required routeのfailure後にnullへ切り替えて成功扱いしない。`FORMAL_DERIVED` claim、attachment witnessまたはprovider-derived relationがあるreportはformal mode／non-null provider identity／formal admissionを必須にする。

このreportは`MACHINE_ONLY` sidecar evidenceで、canonical artifact meaning／identity materialではない。human Product Read verdict、acceptance、actual-device result、Cycle／production approvalをfieldへ追加しない。human Product Readはimmutable artifact ref／canonical content hashを外側から評価し、reportまたはartifactをmutateしない。public reportにraw input／output、lemma、surface、exact source range、user ID、case ID、private path、Product Read本文を含めない。

## 12. Failure envelope

```json
{
  "$id": "cocolon.cmee.failure_envelope.v1alpha1",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "failure_id",
    "core_id",
    "stage",
    "reason_code",
    "disposition",
    "retryable",
    "fallback_used",
    "body_free"
  ],
  "properties": {
    "failure_id": {"type": "string"},
    "core_id": {"enum": ["EMLIS_AI", "PIECE", "ANALYSIS"]},
    "stage": {
      "enum": [
        "SOURCE_ADMISSION", "EVIDENCE_BINDING", "LINGUISTIC_PROVIDER",
        "ATTACHMENT_ADMISSION", "MEANING_ASSEMBLY", "CORE_INTENT", "PLAN",
        "REALIZATION", "HARD_VALIDITY", "TRACE", "ARTIFACT_IDENTITY"
      ]
    },
    "reason_code": {"type": "string"},
    "disposition": {"enum": ["REJECTED", "UNAVAILABLE", "SEPARATE_SAFETY"]},
    "retryable": {"type": "boolean"},
    "fallback_used": {"const": false},
    "body_free": {"const": true}
  }
}
```

runtime retryやfallback authorityは別policyで勝手に追加しない。provider / resource mismatchはfail-closeである。`LIMITED`はartifactあり / failure nullのEngineOutcomeであり、このfailure schemaへ入れない。work-level `STOP`はdesign / navigation stateで、runtime FailureEnvelopeへ入れない。

## 13. Canonical identity and references

canonical artifact identity material:

```text
schema version set
core id / product job
source commitment IDs and versions
evidence graph identity
semantic graph identity
experience plan identity
canonical primary artifact bytes or canonical graph form
recipe / layout / projection version set
policy version set
```

EvidenceGraph→GroundedMeaningGraph→ExperiencePlan→PositiveRealizationTrace→GenerationArtifactBundleの参照は`<type>:<id>@<version>`でversion-qualifiedにする。別artifact／graph／plan／trace／reportからbare IDを参照しない。bare local IDを許すのは、同一versioned container内のnode／edge／duty／visible unit等へ閉じた参照だけで、container外へ持ち出す時は必ずversion-qualified refへする。Source commitmentのID／version pairも同じ論理referenceを一意に指す。

provider identityはprocessing provenanceであり、それだけでsemantic authorityにならない。formal-derived claimがprovider admissionへ依存する場合は、version-qualified admission／graph identityを通じてtransitively固定する。

canonical artifact identityから除外する:

- generated timestamp if not product identity
- request-local path／request ID
- private user ID
- process ID／host／log sequence
- unordered map serialization
- public telemetry transport metadata
- `execution_scope`、CYCLE／PRODUCTION lane、A／B cutover state
- machine report result／machine verdict
- human Product Read verdict／record／actual-device result
- NLSv3 old RC番号、Gate、Receipt、controller、executor、FD、旧approval identity

`machine-report:<id>@<version>`はsidecar machine evidenceへのrefであり、artifact semantic identity materialではない。human evaluationは`artifact:<artifact_id>@<artifact_version>`とprivate canonical content hashへ外側からbindし、artifact identityまたはlineageをmutateしない。

canonical JSONはUTF-8、sorted object keys、no insignificant whitespace、array order semantic、numbers normalizedの一つのimplementationをowner exact1にする。

## 14. Versioning rules

1. schema IDはmeaning contractを表す。incompatible field semanticsはnew schema ID。
2. required field追加、enum narrowing、nullable／non-null変更、identity material変更はbreaking。
3. optional field追加もconsumerがunknown fieldを拒否する間はschema revisionを上げる。
4. version-qualified refのtarget schema／versionをsilent rewriteしない。
5. core extensionをshared schemaへ昇格するのは第2 actual consumerで一致責任を証明した後。
6. Emlis-only fieldまたはtypeを`shared`と呼んでfreezeしない。
7. Piece recipe／renderer、Analysis graph projection、Emlis response mappingはcore version ownerを保持する。
8. preview／saved／history／latestが参照するartifact versionをsilent upgradeしない。
9. old version migrationはnew artifactを作り、in-place meaning mutationをしない。

本2026-08-17 correctionで`EvidenceGraph`、nullable provider path、trace role、machine-only report、version-qualified refsを加えたschemaはすべて`NOT_REGISTERED / runtime effect 0`である。既存registered consumerとの互換性を主張せず、最初にmaterializeするschemaは本補正shapeを使う。もし旧draft shapeが既にruntime registry／wireへmaterializeされていることをfresh確認した場合は、同じIDをmutateせずnew schema IDへ上げる。§16のhistorical L3-R identityをv1alpha2 shared schema approvalとして流用しない。

## 15. Schema verification

minimum tests:

- canonical examples validate
- required field missing RED
- additional property RED
- wrong core / artifact discriminator RED
- artifact variant / product job / epistemic partition / semantic graph prefix mismatch RED
- original / supplemental / simulation source role swap RED
- user owner field in body-free projection RED
- `FORMAL_CLOSED` with incomplete candidate set RED
- attachment set ID / private digest / source versionとadmissionのswap RED
- admitted owner set duplicate / required-active mismatch RED
- admission ambiguity / unresolved count differs from sealed set re-derivation RED
- open-slot denominator absent RED
- EXPLICIT argument span absent、ZERO / OMITTED argument span non-null RED
- observed claim without evidence ref RED
- `REPEATED_COOCCURRENCE` with fewer than two distinct source evidence refs RED
- `NOT_COMPARABLE` with change claim、またはreason 0 RED
- `NO_PREVIOUS` with comparison object / safe change kind RED
- IF graph inserted into grounded graph RED
- Analysis IF `QUESTION_PENDING` with fabricated empty graph / artifact RED
- IF scenario set count 0 / 4、base map mismatch、display-order membership mismatch RED
- IF scenario set with rank / score / probability / best flag RED
- SavedRouteIntent selected scenario outside source set RED
- SavedRouteIntent missing user selection source commitment RED
- simulation artifact used as SavedRouteIntent source commitment RED
- IF / SavedRouteIntent wire or storage identity mixed with `watashi.map.v2` RED
- safe projection cooccurrence represented by directed from/to RED
- safe projection annotation / unknown / conflict target correspondence lost RED
- Piece compacted whitespace hash mismatch RED
- initial Piece cutover without pre-admitted V2 rollback target RED
- watashi.map.v2 safe projectionにprivate source ID / evidence locator / digestがある場合RED
- body-free report raw body／private locator／human Product Read field RED
- body-free report `assessment_scope != MACHINE_ONLY` RED
- source-only mode with non-null provider／attachment witness／`FORMAL_DERIVED` RED
- formal mode with null admission／provider identity RED
- provider-required failure followed by source-only fallback RED
- source-only mode missing required coverage／unknown／polarity／modality／time／evidence／no-added-claim RED
- EvidenceSpan unresolved、foreign source、source version／role／field digest／literal digest mismatch RED
- EvidenceGraph required source missing、unknown-boundary ref mismatch RED
- PositiveRealizationTrace role invariant、version-qualified ref、EvidenceGraph resolution mismatch RED
- `SourceOwnerUniverse`／`RouteBOwnerDisposition`をPiece／Analysis shared schemaとして使用した場合RED
- `execution_scope`またはA／B laneだけでartifact hash／meaning／lineageが変わる場合RED
- machine reportまたはhuman Product Read verdictがcanonical artifact identityを変える場合RED
- `SEPARATE_SAFETY`がartifact／public safe response／production ingress authorityを持つ場合RED
- EngineOutcome status／FailureEnvelope disposition mismatch RED
- version-required external refがbare IDの場合RED
- canonical identity invariant under object key ordering
- canonical identity changes under semantic array ordering／semantic version change

test fixtureをproduction schema ownerにしない。actual implementationでPython dataclass、validator、JSON schemaのthree-way consistencyを検証する。

## 16. Emlis V1-A retained Route B semantics — non-shared provisional profile

旧L3-R technical body、P0、P0-R1、L3-I／I1、旧Gate、Receipt、controller、executor、FD、approval orderはhistorical operational shellであり、current schema registration、runtime implementation prerequisiteまたはversion authorityへ移さない。旧approval identityをv1alpha2 shared schemaの承認として流用しない。

### 16.1 Provisional type boundary

current PR #3の`SourceOwnerUniverse`はgeneric coverage conceptのcurrent Emlis shape、`RouteBOwnerDisposition`はEmlis／Route B core-owned specializationである。

```text
SourceOwnerUniverse = PROVISIONAL_EMLIS_SPECIALIZATION
RouteBOwnerDisposition = PROVISIONAL_EMLIS_SPECIALIZATION
promotion = NOT_YET_PROMOTED_TO_CROSS_CORE_SHARED_FINAL
```

このため両typeを§1 shared catalog、EvidenceGraph `$defs`またはPiece／Analysis required fieldへ追加しない。`ExperiencePlan.duties[]`だけをshared plan-duty recordとする。promotionは第2 actual productが同じ責任を実証した後のbreaking design／schema decisionに限る。

### 16.2 Retained Emlis semantic constraints

Emlis provisional profileは、source／supplemental role分離、owner coverage、unknown／conflict、no-promotion、one clarification、immutable refinement（旧版target-only、thread版は検証済み更新集合）、no fallbackを保持できる。source coverage denominatorとproduct plan duty、positive trace、machine report、human Product Readを別ownerにする。

providerなしrouteは`SOURCE_OR_USER_EVIDENCE_ONLY`だけで、visible claim全量がdirect EvidenceSpanへbindし、provider-derived meaning／relation／attachment exact0、required source coverage、unknown、polarity／modality／time、no-added-claimを満たす。provider-required failure後のsilent switchは禁止する。`FORMAL_DERIVED`にはnon-null formal admission、provider identity、evidence bindingを必須にする。

旧shared版はoriginal source lifecycle全体で最大1回。Emlis thread版は一round一問、thread上限はFree／Plus 1回、Premium 3回。今回Q1はFree最大1回の純粋処理だけで、後続round・永続的枠管理は未実施。 authenticated supplemental answerをnew SourceEnvelope／new graph versionへ適用する。旧版はtarget unknown exact1、Emlis thread v1は焦点補足・同threadの特定可能な明示訂正・依存先を項目別に検証する。original bytes／digest／version、prior graph、prior artifact identityをin-place変更しない。

### 16.3 Current Cycle contract and schema separation

251-owner、Cycle001のfresh denominator／acceptance、current100評価条件はCMEE implementation prerequisiteまたはshared schema constantではない。一方、本設計からhistorical-only、unnecessary、relaxedまたはretiredとも決めない。Cycle適用時はfresh Cycle001 current ownerに従い、source-only modeまたは`execution_scope=CYCLE`をacceptance PASSへ変換しない。

本sectionのschema registration、Python dataclass、JSON schema file、DB／API wire、implementation、Cycle／production effectは0である。最初のactual materializationは§14のpre-registration correction ruleに従い、別Mash実装承認なしに開始しない。


## Same-nucleus temporal alignment boundary（2026-09-04）

Canonical 02 §38 / 06 §89 authorize source-grounded correction of existing status/time/modality before selected meaning and projection identity derivation. Existing time-scope/attribute vocabulary is retained; no public/private response or GroundedSentencePlan schema bump is introduced. The §36 request-local expression/segment/placement contract remains private, excluded from Gate forward inputs, public response, diagnostic and durable body-free metadata. Updated frames, graphs, meaning and projections must be freshly derived together; mixed old/new sealed identities are rejected.

The existing V2 candidate required-qualifier field now carries source-owned aspect, with matching original/rebuilt meaning compatibility and role-bound causal validation. SourceQualifierBinding retains exactly polarity/modality/time; V1 and existing aspect/episodicity vocabularies stay unchanged. This is re-derivation from source, not mutation of a sealed meaning. An aspect-only NORMAL trace must exactly cover the aspect values of its existing bound configuration components; missing/foreign/unsupported aspect is rejected.

Current validation is incomplete under the availability constraint recorded in canonical 06 §89. No schema or Gate relaxation is used to preserve counts, and no body-independent availability hold or second rendering route is introduced.

Mash subsequently approved the source-fidelity availability exception in canonical 06 §89. This changes an acceptance condition only; it adds no schema vocabulary, Gate input, relaxed threshold or body-independent admission condition.


The resumed source-grounded grammar uses the existing private expression nominalization-plan tuple and existing Human Reception internal clause core. Any bounded case/head/carrier description is identity-bearing private grammar, derived before expression emission and re-derived exactly by plan-only replay. It creates no public schema, transport carrier, semantic taxonomy, Reception act, Move family or downstream metadata oracle. Actual source/slot/edge preservation and the unchanged strict body checks are required; implementation and final validation remain pending.


The internal clause-core time owner may be the already visible target referent; this is private grammatical ownership, not a time-scope value or serialized field. A negative finite-carrier nominalization operation in the existing tuple records reversible morphology and modifier/separator attachment. Expression identity and plan-only replay must derive the identical operation from the same source profiles; changed negation in a completed body is rejected. Public/V1 schema and Gate inputs remain unchanged. Current full100 root review is NOT_CLEAR, with final verification pending.


Current source-owned uncertain wish modality and the existing finite/progressive/future state are re-derived before identity sealing; no new semantic time/modality vocabulary is added. The selected subjective-content replay gap in 02 §38 was a pre-approval boundary requiring an explicit adjustment to the existing trusted replay input contract. At that checkpoint the adjustment was proposed only: no hidden appraisal payload is inserted in source attributes, stance strings or grammar tuples, and no new plan/sentence-plan field or Gate oracle has been added. Root fixed100 review is NOT_CLEAR; completion/readiness remain false.


## Selected subjective reception request-local input boundary（2026-09-05）

Mash approved `FRESH_MASH_LEVEL3_CMEE_STAGE1_SELECTED_SUBJECTIVE_RECEPTION_FORWARD_INVERSE_REQUEST_LOCAL_CONTRACT_20260905`. Canonical 02 §36.3–§36.5 and §38 now authorize the existing selected NORMAL/LIMITED decision as an explicit trusted request-local input for Human Reception forward and independent replay. Implementation and validation are pending at this design checkpoint. The preceding proposed-only paragraph remains pre-approval history.

`SelectedSubjectiveReceptionDecisionV1` references the complete existing immutable `SubjectivePropositionV2` and its authoritative Move/meaning/binding lineage; `SelectedSubjectiveReceptionInputV1` holds the immutable decision tuple and projection/grounding preimage/seal for this request. These are Python-only, nonserializable input records in the existing Human Reception owner, not a new semantic schema, shared ontology, Emlis self-state, response payload or plan field. Existing `SubjectivePropositionV2`, `GroundedObservationPlan`, `GroundedReceptionMovePlan`, `GroundedSentencePlan` and public/private response versions are unchanged.

The sole Stage 1 bridge exact-joins the authoritative upstream records before realization. Human Reception forward and replay receive the same `selected_subjective_input`; final-stage Gate/matcher call signatures carry that input only to replay. The parser remains body-only. Replay re-derives realization without consuming forward expression, surface, visible metadata or hidden source-attribute/grammar payload as an oracle. Missing, modified, foreign-request or mismatched branch/Move/claim/binding/focal-relation input fails closed. No case body, source reference, digest, locator or lexical material from the input is serialized to public response, diagnostics, logs or durable body-free records. Source/unknown/safety validation and completed-body exact comparison remain mandatory; approval does not confer all100 CLEAR, acceptance or readiness.

## Emlis thread v1 profile（2026-09-10／Q1）

このprofileはEmlis専用の新しい型契約です。§9の旧shared JSON、Analysis、単一source validatorは保持します。Q1でPythonのprocess-local dataclassを実装し、JSON API／DB wireはQ2で型・認可・永続性を含めて実装します。以下を旧JSON schema実装済みと読み替えません。

| 型／版 | 必須の意味・参照 |
|---|---|
| `EmlisThreadInputV1` / `cocolon.cmee.emlis_thread.v1` | thread_id、original_source_ref、answers、admitted_history、current_round、capability_snapshot、question_control_context、prepared_meaning_checkpoint_ref。原sourceは親GenerationRequest所有。Freeはhistory空・answer最大1。 |
| `SupplementalAnswerSource` / `cocolon.cmee.supplemental_answer.v1` | answer_id、thread_id、question_id、round_index、original_source_ref、answer_text_private、recorded_at、任意authored_at、SUPPLEMENTAL_ANSWER role。独立raw identity・UTF-8位置。 |
| `QualifiedEvidenceRef` | thread_span_id、元local_source_span_id、envelope／field／scalar／UTF-8を持つ既存EvidenceRef。元根拠IDを変更しない。 |
| `EmlisQuestionDecisionV1` | ASK／END／BLOCKED、target_ref／kind、supporting_evidence_refs、missing_dimension、affected_meaning_refs、affected_reception_refs、asked_target_refs、decision_reason。 |
| `EmlisClarificationV1` / `cocolon.cmee.emlis_clarification.v1` | question／parent request／thread／original source、decision、prompt_private、skip_allowed=true、answer_limit=1、SUPPLEMENTAL_ANSWER role。 |
| `AnswerTemporalBindingV1` | about_time、anchor_source_ref、time_expression_evidence_refs、任意relative_relation／resolved_interval／timezone_basis。受信時刻から推定しない。 |
| `EmlisAnswerUpdateItemV1` | update_ref、binding_kind、target_meaning_refs、evidence_refs、temporal_binding、operation、changed_claim_refs、superseded_claim_refs、affected_dependency_refs。 |
| `AnswerMeaningUpdateV1` | answer_source_ref、question_ref、prior_meaning_ref、updates、unresolved_parts、disposition、new_meaning_ref。 |
| `EmlisMeaningCheckpointV1` / `cocolon.cmee.emlis_answer_meaning.v1` | checkpoint_id、source_prefix_ref、base_meaning_ref、answer_update、assessment_status、accepted_update_refs、inactive_claim_refs、unresolved_parts。 |
| `EmlisThreadOutcomeV1` | status、body、question_decision、question、meaning_checkpoint、body_sufficiency、body_state、reason_codes。automatic_progression=false。 |
| `EmlisThreadBodyArtifactV1` | 二節本文、source_prefix_ref、meaning_checkpoint_ref、qualified_evidence_refs、meaning／reception trace、body_status。private artifact。 |

`binding_kind`はQUESTION_FOCUS／EXPLICIT_CORRECTION／SAME_OCCASION_CURRENT_STATE、`operation`はADD／REVISE／WITHDRAW、dispositionはMATERIAL_UPDATE／NO_MATERIAL_UPDATE／UNRESOLVED、assessment_statusはRESOLVED／PARTIAL／UNRESOLVEDです。問いの一焦点制限と、回答内の検証済み訂正集合を分けます。

`QUESTION_PENDING`は有効な初回本文＋一問です。本文はSUFFICIENTでもLIMITEDでもよく、問いpendingを本文不十分へ強制変換しません。回答後はcheckpointのsource prefixを再導出し、clientが任意の意味graphを指定する入口を持ちません。更新確定後に本文が失敗した場合もcheckpointを返し、本文はnull、body_stateはMEANING_UPDATED_BODY_UNAVAILABLEです。未評価回答を無視した旧本文の再ラベルは禁止です。

共通IM03の旧`ForegroundScopeRelationKind` exact4と`INTERPRETATION_MATRIX_EXACT16`は不変です。thread専用`EmlisThreadScopeRelationKind.ABOUT_TARGET`だけを、thread graphのevaluation_about_event・両endpoint・元／回答evidenceに結んでscopeへadmitします。carried viewも元graph／premeaningに照合します。共有候補を追加の因果・対比へ昇格しません。

これはQ1の型・意味の登録です。質問数の永続的消費、checkpoint先行保存、UI状態、公開レスポンスのprivate除外はQ2のwire contractで閉じます。旧profileへの暗黙fallbackはありません。

## 2026-09-11 Q2 application v1 — 開発用wireと永続identity

profileは `cocolon.emlis_thread.application.v1`、runtimeは `q2.free.one_round.v1`。実allowlistは `api_emlis_thread.ThreadResponse` に対応する。

| 領域 | fieldと責任 |
|---|---|
| original | id / created_at / memo / memo_action。元の保存日時を保持 |
| thread | thread_id / revision / state / issued_count / question_limit。元emotions.idに一意、一問上限 |
| timeline | event_id / kind / recorded_at / text。QUESTIONのquestion_id、ANSWERのauthored_at、OBSERVATIONのstage/is_current |
| current | current_observation と pending_question。意味更新後の旧本文はcurrentにしない |
| assessment | body_state / answer_saved / answer_assessment / meaning_updated |
| operation | operation_id / attempt_id / requested_attempt_id / processing_deadline_at / failure_code / can_retry / can_continue |
| private persistence | original FK、current_meaning_event_id、last_observation_event_id、latest_answer_event_id、source/evaluated_prefix、source_snapshot、private event payload |

MEANING_UPDATEはthread＋source prefix＋semantic schemaで一意。ANSWERはthread＋questionで一意。idempotency_keyはthread内一意でpayload fingerprintを保持する。回答受理、意味確定、本文保存のtransactionを分け、現在pointer更新と該当eventsのappendは原子的。RPCは短いlock＋CAS、FK cascade、service-roleを含むowner/access検査を行う。private graphs/checkpoints/raw bytes/digestsをpublic DTOに含めない。parent created_atの保持期間を使い、回答日時で延長しない。

source-modeや意味schemaを変えるQ3では既存checkpointを黙って再利用しない。Q2に本番schema migrationの適用済みeffectはない。物理DDL ownerはmashos-apiの `supabase/migrations/20260911020509_emlis_input_threads_q2.sql`、route一覧は `ai/docs/PUBLIC_API_REGISTRY.md`。

## 2026-09-11 Q3 — 有料履歴・逐次質問・解釈フレーム

実行profileは`q3.plan.sequential.v1`、旧保存profileは`q2.free.one_round.v1`。新規開発入口だけQ3、旧Q2保存threadの上限1とDTO意味は維持する。logical graph source版は`cocolon.cmee.emlis_thread.q3.v1`、Q1版は変更しない。公開wireはadditiveな`cocolon.emlis_thread.application.v1`のまま。

`EmlisQuestionControlV1.issued_questions/question_limit`、最大3件の回答、Q3 capability、owned history guards、独立frame feedback refsをprivate prefixへ含める。質問文・生成済み本文・推論cacheは本人sourceへ昇格しない。公開DTOに`started_question_limit`、`AWAITING_CONTINUE`、`CONTEXT_CHANGED`、型付き`interpretive_frames`と`requested_operation`を追加。frameはopaque ref、暫定状態、根拠の日付・出来事・受け取り、CONFIRMED/REVISED/REJECTEDを公開する。内部digest・意味checkpoint・raw evidenceは公開しない。

`POST /emlis/threads/{thread_id}/frames`はexpected_revision/idempotency_key/frame_ref/status/correction_textを受け、ownerと現在frame versionを照合する。user/plan/sourceをclientから採用しない。framefeedbackは独立OPERATIONで質問数を消費しない。

追加DDLは`20260911041749_emlis_q3_plan_rounds.sql`。旧Q2後に適用し、started_question_limitの不変性、round0〜3、質問/回答の対応、owner限定feedback表、context RPCを追加する。親・user削除はcascade。current profile行のlockで同じ本人のcommitを直列化し、履歴のsource digest/revisionとfeedback versionを最終commitまで再照合する。

| 対象 | 現行Q3の動作 |
|---|---|
| Free | 今回の原入力＋同thread回答のみ、最大1問。履歴とframeなし。 |
| Plus | 最大1問、所有者・状態・365日の条件を満たす直近最大3記録から必要な履歴。 |
| Premium | 最大3問、3650日の条件を満たす直近最大6記録と修正可能frame。元入力自体の閲覧は既存Premium無期限条件のまま。 |
| 質問発行 | 回答後本文を先に保存し、次候補があればAWAITING_CONTINUE。本人のcontinueで初めて次問を保存・発行する。4問目なし。 |
| プラン変更 | 開始時上限と現在上限の小さい方。upgradeで開始枠を増やさず、downgrade後も既発行問への回答を受けるが次問は現在枠に従う。 |
| 履歴失効 | 編集・削除・回答更新・期限・権限・feedback versionの変化を保存時に照合。古い現在本文はCONTEXT_CHANGED、旧timelineでは自分のLayer1/2だけを履歴として扱う。 |
| 意味変更なし | 同じ有効意味・同じ許可contextの保存済み本文だけを再使用。旧本文へ新prefixを付け替えず、最終commitでもguardを再照合。 |
| 障害と再送 | ANSWER→意味→本文の独立commit、同じ回答で明示retry。旧操作receiptと現在stateを分ける。CAS後の再読取りと失敗返却も現在contextを照合。 |


## 2026-09-11 Q4 — additive wireと保存版互換

cocolon.emlis_thread.application.v1へboolean can_writeを追加。読取り専用ではfalse、can_retry/can_continueもfalse。既存state・body_state・question_limit・profile・revisionの意味は維持する。app.bootstrap.v1のfeature_flagsへemlis_threads_enabledを追加し、欠落時false。旧input_feedbackはpassed＋comment_textのままで、QUESTION_PENDINGやprivate checkpointを露出しない。

実modeはEMLIS_APPLICATION、保存profileは既存q2.free.one_round.v1／q3.plan.sequential.v1。旧Q2をQ3上限へ自動昇格しない。意味schema、元source bytes、source prefixのidentityをmode追加だけで変えず、保存checkpointの再計算を正常回復の条件にしない。Q4追加DDLなし。Q2→Q3追加migrationの順序と停止/互換回復はAPI運用資料§9がowner。


## 2026-09-12 Q4 — 未解釈回答範囲の内部境界

公開wire cocolon.emlis_thread.application.v1、意味schemaのfield、source encoding/segmentation/qualified span ID、保存profileと状態・質問数・権限は変更しない。既存GroundedUnknownBoundaryのfree-string dimensionへ次の内部区別を登録する。元回答・保存checkpointの意味採用と本文出力上の処理限界を混同しない。

| 内部境界 | 生成根拠と責務 |
|---|---|
| answer_interpretation_unresolved | checkpoint.unresolved_partsの実在するqualified回答spanに限定。連続した未解釈範囲だけを束ね、affected_nucleus_idsは空、surface_policyはdo_not_claim。採用意味の未知graphには加えず、同じsentence planのlimited_scope / render_limited_scopeで必須表示する。claim_scopeはunresolved_answer_interpretation。 |
| source_explicit_epistemic_limit等の意味上の未知 | 本人sourceから採用された未知として従来のgraph・LIMITED能力判定を保持する。上記処理限界の除外条件を流用しない。 |

answer_interpretation_unresolvedの句はsource envelopeの同一field内で順序・連続性・一意性を確認した原文を用い、sourceの区切りと引用文脈を保持する。意味を採用できないことを本人の不明へ変換しない。完成本文の独立inverseは必須境界と根拠引用・外側述語の全件対応を検査し、同時削除/付替えや意味の反転を拒否する。引用内の疑問符はこの検証済み句のsource部分に限る。quoted spanの採用前確認はcanonical scalar_startを用い、sourceを再分割・再符号化しない。

歴史的snapshotは保持し、現行共有owner identityだけを更新した。新しい公開field・state・DDL・rendererはなく、保存版を再計算して正常回復した扱いにしない。本人の不明を意味として採用しHRへ接続する残件は未完了。品質結果は同日06/API handoff、責務地図はcurrent_structure01を参照。


### 2026-09-12 初回epistemic unknownのsource-object対応

wire schema / enum / source owner数は変更しない。Q1/Q3の既存unknown dimensionだけではsource-object対応の権限を与えない。UNKNOWNはUNKNOWNのまま残し、同じ完全evidenceに結び付く唯一の本人・現在・陰性uncertain nucleus、required owner / provisional-only attachment、単一UNFINISHED/PRESENT_UNFINISHED/NO_RELATION_CLAIMのrequired contributionが揃う場合だけ原文objectへ対応させる。PRIMARYと同一objectのEXPERIENCER以外のargumentを許可しない。adapterでは元boundaryのaffected nucleus・span・hedge-onlyも照合する。

Q1/Q3の実経路にある `validate_grounded_situation_view` で、required UNKNOWN dispositionとmaterial unknown refsの全件一致、各unknown専用basisの対象・証拠・unknown参照と空の他duty欄、compatibilityの正確な対応を再計算する。basisの削除・別対象化・複製・余分なduty混入を許可しない。旧generic source admissionやhistorical unknown grounding-kind契約を広げない。Layer 1 trace必須とuser-fact-effect 0を維持する。


### 2026-09-13 継続 — 併存する気持ちと暫定判断の内部表現

公開wire・意味schema field・enum・source segmentation/encoding・保存profileは変更しない。初回memo全域の隣接2節を完全sourceで照合でき、本人の現在の二つの気持ちの併存と、対象の単一性についての暫定判断を表す有限文法に限り、既存属性欄とCOMPOSITE IRへ次の区別を追加する。他者・過去・引用・未完断片・追加のmemo節には一般化しない。

| 内部表現 | 意味と適用条件 |
|---|---|
| `lexical:source_current_material_primary` / `lexical:source_current_material_qualification` | 前者はreaction/feeling/mixed/feeling、後者は元のeventまたはstateと同じpredicate・negative・uncertainを保持する。両方ともrequired/explicit・本人・現在・単一の完全spanを要する。対象判断を認識不能や理由不明へ読み替えない。 |
| `source-current-material:0:1` | 既存名詞化planの内部marker。COMPOSITE・2 fragments/profiles・target slot 0・context slot 1・関係なしに限定し、source文法と原述語を再照合する。従来の`source-feeling-reason-boundary:0:1`は元の証明条件を維持し、二つを同時に付与しない。 |

暫定判断のuncertain modalityと原文の曖昧さは保持する。この完全source証明を持つ判断だけは、uncertain属性から別の`source_explicit_epistemic_limit`を追加導出しない。既にあるunknown境界・UNKNOWN node・material unknown refs・required unknown coverageは除去せず、本人が明示した認識上の不明の既存契約も変更しない。

groupは二つのmemo対象だけ、または別欄の本人の実行済み行動を一つ加えた構成に限る。関係は非requiredのuncertain_connectionに限定し、欄順由来の行動因果を補正する場合も、既存source順のarc・両endpointの完全span・元の構造推論由来・既存権限正規化後の非required・実行証明を照合する。上流でrequiredと付いた欄順の構造推論は既存正規化でshouldになるが、ユーザーが明示した原因や権限を持つrequired関係をこの補正へ流用しない。

groupと独立行動が同じsealed claimを共有する場合、二つのMoveの順序にかかわらず、そのclaim・branch・meaning outcome・binding・命題・basis・qualifierを一致させ、focal relationがないことを確認する。target/supportの対象集合と寄与集合はそれぞれ非空・排他・全量でなければならない。Q1の正確な分配済み参照とQ3の完全共有参照だけを扱い、任意の部分集合・混在・欠落を補完しない。既存HR作者と完成本文の独立inverseが原文二対象を検査する。

これは選択・名詞化・寄与対応の限定的な補修であり、質問選択や回答採用の新契約ではない。対象判断節への明示focusを選択で保持したことを、その汎用本文生成の成立へ換算しない。責務地図はcurrent_structure01、固定sourceと実検証・残件は正本06/API既存handoffの同日継続節を参照する。商品NOT_CLEARを維持する。

### 2026-09-13 継続 — 暫定的な対象判断へ焦点を移しても両対象を保持する

既存の完全source照合で`lexical:source_current_material_primary`と`lexical:source_current_material_qualification`を持つ隣接2節に限り、名詞化planの内部markerへ`source-current-material:1:0`を追加する。公開wire・意味schema field・enum・保存profileは変更しない。

| marker | target/contextと検証 |
|---|---|
| `source-current-material:0:1` | 従来どおり気持ちをtarget、暫定判断をcontextとする。 |
| `source-current-material:1:0` | 暫定判断をtarget、気持ちをcontextとする。headerはnegative/uncertain、COMPOSITE・`target_slot_count=1`（targetはIR slot 0）・`context_slots=(1,)`・2 fragments/profiles・関係なし。検証では気持ち／判断の原文役割順へ戻して従来の有限文法を照合し、本文はtarget/contextの選択順で生成する。 |

逆順markerは意味役割やsource順の交換ではない。targetが元の判断、supportが元の気持ちであることを照合し、完成本文は独立inverseで原文の両対象・否定・時点・留保を保持する。`source-feeling-reason-boundary:0:1`へ逆順許可を広げない。groupと独立行動の寄与は従来のsealed claim・非空・排他・全量条件を保持する。内部focus対応を質問・回答の新契約へ換算しない。正本06/API handoffの同見出しへ検証と未解消範囲を記録した。商品NOT_CLEAR。

### 2026-09-13 継続 — 完結した負担と別節の言いかけを区別する

公開wire・意味schema field・enum・source segmentation/encoding・保存profileは変更しない。既存attribute_codesへ、原文全域と節間区切りを照合した内部区別を追加する。

| 内部marker | 証明する範囲 |
|---|---|
| `lexical:source_nominal_constraint_clause` | 単一spanの完結した名詞述語。既存のrequired/explicit・本人・現在・constraint/negative/possibilityを保持し、程度・留保・指示対象を落とさない。 |
| `lexical:source_unfinished_utterance_clause` | 疑問詞・任意の格助詞・問いの導入・未完の修飾語・省略記号からなる別spanの発話範囲。欠けた主述語、その内容・主体・時点・unknown・前節との因果は証明しない。 |

負担だけのmemo、またはその後ろに上記の未完発話を一つ伴うmemoを照合する。任意prefix、有限の主張、後置報告・撤回を末尾だけで許可しない。独立行動を含む選択groupでは、全text対象、既存の実行証明、非requiredのuncertain_connectionという境界を照合する。明示focusを上書きしない。

HRは選択された原文と参加spanを再照合して既存の「という言葉」を使用する。独立inverseは完成本文の目的語全体を左端から一致させる。共有claimの分配は既存のclaim・branch・命題・basis・qualifierと非空・排他・全量条件を保持する。未知保持や全欄の省略記号制限は解除しない。責務はcurrent_structure01、検証と反映は正本06/API既存handoffの同見出しを参照する。


### 2026-09-13 継続 — 回想・現在の不明・条件付きの変化を区別する

公開wire・意味schema field・enum・source segmentation/encoding・保存profileは変更しない。既存attribute_codesと名詞化planへ、完全なmemo二節の証明に限定した内部区別を追加する。

| 内部marker | 保持する範囲 |
|---|---|
| `lexical:source_temporal_causal_unknown` | 原因の同一性が不明である現在のhost。既存型uncertainty、uncertain、negativeを使用し、回想内の過去を現在の状態へ変えない。 |
| `lexical:source_temporal_relief_residue` | 条件を含む軽減と残存の現在host。既存型change、fact、mixedを使用する。factは完全な文のhostに対する属性であり、内側の条件節を実行済み行動とする証明ではない。 |
| `source_clause_scope:<role>:<start>:<end>:<scope>` | 改変しない各原文節の内部範囲に対する回想対象・回想host・現在の不明対象/host・条件・変化・残存の役割と時点。独立した入力、保存件数、実行済み行動、原因関係を追加しない。 |
| `source-temporal-material:0:1` / `source-temporal-material:1:0` | 既存COMPOSITEの二対象を、現在の変化→不明、または既存focusに従う不明→現在の変化の順に本文化する内部marker。source順・意味役割は交換しない。 |

採用は完全な二節の組に限定する。節単体のparserが文法を認識できることを、単独節の採用・選択対応へ読み替えない。別欄の独立行動は従来の実行証明を必要とする。required関係・未知保持を一律に緩めず、欄順だけを根拠とする関係を因果として出力しない。寄与分配は従来のsealed claim・非空・排他・全量条件を維持する。

現行の共有owner snapshotは変更した5ownerへ整合し、historical fixture/receiptは変更しない。公開合成検査は `ai/tests/test_cmee_emlis_q3_thread.py`、現行owner snapshotは `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` を使用する。検証実績と未確認は正本06/API既存handoffへ記録する。

証明済みの残存節が丁寧形で終わる場合、HRの名詞化前に現在進行の連体形へ活用する。Surfaceの原文表示は保ち、独立inverseも同じ時制・相・否定を照合する。丁寧形へそのまま「こと」を付けない。source_clause_scopeはOP内部の範囲記録であり、下流は全節原文とprofile・markerを再照合する。独立の多時点推論器を追加したものではない。

### 2026-09-13 継続 — 暫定的な変化と結論を断定できる程度の否定を保つ

公開wire・意味schema field・enum・source segmentation/encoding・保存profileは変更しない。完全な原文に対する以下の区別を既存attribute_codesに記録する。

| 内部表現 | 保持する意味・範囲 |
|---|---|
| `lexical:source_provisional_degree` | 本人の現在の暫定比較と、結論を断定できる程度の否定を含む完全な表現。既存change / fact / mixed / current_inputを使用する。factは両方の留保を含む発話全体に対する属性で、内側の変化・結論の確定ではない。 |
| `source_clause_scope:comparison:<start>:<end>:past_comparison` | 現在と比較される以前の範囲。発話全体を過去の感情へ移さない。 |
| `source_clause_scope:change:<start>:<end>:under_tentative_host` / `source_clause_scope:tentative:<start>:<end>:present_tentative` | 変化が現在の暫定的な認識に従属している範囲。変化の独立断定を許可しない。 |
| `source_clause_scope:assertion:<start>:<end>:under_negative_degree` / `source_clause_scope:degree:<start>:<end>:present_negative_degree` | 結論と、その結論を言える程度に達していない現在の否定の範囲。原因不明・回答拒否・新しい意味核を追加しない。 |

OPは既存の原文・ID・証拠を保ち、下流は完全な原文・profile・markerを再照合する。内部scope記録だけを独立の推論許可にしない。既存の完全表現group選択、原文名詞化、有限文、sealed claimの非空・排他・全量分配を使用する。別欄の行動は既存の実行証明を必要とし、原文内の逆接を欄間の因果へ昇格しない。

Observationの敬体活用も独立inverseで照合し、全文一致を証明した場合だけ暫定比較をchange内容の保持として扱う。保証語の例外は、完全な名詞構文内で否定に従属する結論の文字範囲に限定する。新しい回復判断・一律の保証語除外はない。現行の共有owner snapshotのみを変更した4ownerから再導出し、歴史的なfixture・receipt・判定基準は保持する。


### 2026-09-13 継続 — 対照する二つの評価と独立行動の保持

公開 wire、schema field、enum、保存 profile は変更しない。完全な三spanの原文を証明した場合だけ、既存 attribute_codes へ次の内部区別を記録する。

| 内部 marker | 証明する意味 |
|---|---|
| `lexical:source_appraisal_tentative` | 対象への形容詞評価が現在の暫定 host に従属する。既存 event/state と neutral を保持し、modality は uncertain。新たな不明対象を追加しない。 |
| `lexical:source_appraisal_alternative` | 有限の行動候補を名詞化した評価。既存 event/state・fact・neutral を保持し、実行、拒否行動、意図へ変換しない。 |

選択 group は、この両核に加えて required／user-stated contrast と既存の別欄行動証明を必要とする。optional な接続詞が observation-owned inventory から外れても、原文全域の証明と必須関係は保持する。source group を候補保持と深さ選択の両方へ渡し、関係なしの COMPOSITE の制約は緩めない。既存の対照 realization と RR4 aggregate を使用するため、新しい名詞化 marker は追加しない。

独立 inverse は、各観測引用に暫定 host／行動候補の評価が全体として残ることを原文から検査する。別の layer や残った形容詞だけでは省略を補償しない。現行 shared-owner snapshot だけを実装から再導出し、過去の固定期待値・閾値・receipt は保持する。

### 2026-09-13 継続 — 独立した判断対象と検討開始時期を保つ

公開wire・schema field・enum・保存profileは変更しない。既存attribute_codesと内部名詞化markerに、原文全域の証明を持つ次の区別を記録する。

| 内部表現 | 範囲 |
|---|---|
| `lexical:source_independent_decision_choice` | 現在の肯定進行の迷い。uncertainty / uncertain / neutral / present。 |
| `lexical:source_independent_decision_timing` | 独立した検討開始時期の未決。uncertainty / uncertain / negative / present。 |
| `source_decision_scope:<role>:<start>:<end>` | object・host、および時期側のproposal・consideration・timeの原文内範囲。新しい推論許可ではない。 |
| `source-independent-decision:0:1` / `:1:0` | 既存COMPOSITEの二対象とfocus順。完全な節とprofileを再照合する。 |

二つの既存source_explicit_epistemic_limitは、各一核・同じ証拠span・hedge_onlyを保持する。neutralのUNKNOWN carrier追加条件は完全なchoice hostと既存の一意owner・qualifier・寄与・証拠を必要とし、neutralラベルだけでは結べない。完成本文の有限hostを完全一致で証明した場合だけ、一般的な未知語markerに依存せず未決の保持を認める。深さの閾値を変えない。

現行shared-owner snapshotのみを変更した5ownerから再導出し、過去の期待値・閾値・receiptを保持する。検証は正本06/API既存handoffに集約する。

## u281 — 組別private Reception対応（2026-10-15）

新しいprivate `ComponentReceptionOpportunityV1` exact7（schema_version、opportunity_ref、move_ref、reception_act、component_ref、basis_contribution_refs、bound_relation_refs）を、選択済みwhole・component・既存Move・全所有根拠へbindする。同じact分類でも別opportunity／claim／traceを持つ。旧RetainedReceptionActRow exact3と旧validatorを保持し、新versionだけdispatchする。独立closureはsource Move、target/support、組、relation、basisとparent/envelopeの分類を照合する。訂正後の3成分のうちReception対象は2成分で、第三Moveは追加しない。既存意味型／内容型・Human Reception作者・独立gateを使い、公開API/DTO/DB/RN、source認識、各上限は変更しない。

適用資格・本文限界は8/28意味設計末尾u281、file責務は01A末尾u281。TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。

## u284 — 同一対象の評価とreceived組を結ぶprivate契約（2026-10-16）

`GroupedAppraisalReceivedConfigurationV1`はschema_version 1.1。既存7fieldに、appraisal_event_ref／appraisal_ref／received_event_ref／reaction_ref、appraisal_relation_ref／received_relation_ref／outer_contrast_relation_ref、target_reference_qualifier_refs、reason_ref／reason_relation_refを追加した閉じた別型。4役割はdistinct、任意理由を含め端点4/5・関係3/4。外側関係はreceived eventをgroup anchorとし、内側event→reactionを必須にする。参照先とrangeのqualifierはexact2、raw node ownerとの対応を独立に照合する。

`EmlisSharedTargetExperienceAppraisalContent`はcocolon.cmee.emlis.shared_target_experience_appraisal.v1。既存appraisal6fieldにschema、4役割binding、3関係、参照qualifier2件を持つ。RELATIONAL_NONCOLLAPSE／PRESERVE_BOTH_ENDPOINTS、appraised exact4、protected exact0、focalは外側関係。通常の二項contentを四項へ緩めず、正確な型でdispatchする。logical manifestは73。

source_shared_target_slot／node_owner／reference_event／reference_range／outer_markerは新source証明に限る。全原文役割と意味方向の所有が合わなければ選択しない。古い型・field・schema・公開wire・checkpoint保存形式は不変。旧sourceを厳密再導出する互換分岐を用い、旧IDを新意味に流用しない。訂正で失格になればgroup全体の証明と外側関係を解除する。

適格範囲は8/28設計u284、実検証は06/API handoff u284。PRODUCT_NOT_CLEAR、正式0/3、未配置。

実装commit：[81f52ef](https://github.com/MassyuRed/mashos-api/commit/81f52ef02cc74cd889904ff80d0185bd0a7d3fee)。API16pathのremote全文・blob SHA・変更集合・親commitを照合済み。


## u294 — 承認済みの未変更received経験を更新後LIMITEDへ保持（2026-10-16 JST）

2026-10-16 11:26 JST、Mashがu293の限定案の実装を明示承認した。u293の未承認記載は提案時の履歴として保持し、現在の承認状態は本節を優先する。承認対象は、別欄の理由なし満足を当時の否定へ訂正する場合、または理由0/1の評価だけを撤回する場合に、未変更receivedの経験内容を更新後LIMITEDへ結ぶ資格とprivate内容対応の追加である。満足やreceivedの意味を再承認へ戻していない。

新private型を旧型から分離して追加した。

| 型／schema | 境界 |
|---|---|
| `RetainedReceivedExperienceEligibilityV1`／`cocolon.cmee.retained_received_experience_eligibility.v1` | source prefix・checkpoint・原入力／回答source・canonical原核／原関係・accepted更新・Move・thread controlを持つ。別欄exact1の完全更新とreceived未変更を現在sourceから再証明する。 |
| `RetainedReceivedExperienceContentV1`／`cocolon.cmee.retained_received_experience_content.v1` | eligibility、current preimage／aggregate seal・claim／命題参照、meaning outcome／reception binding／grounding、局所命題・basis・qualifier・局所sealを持つ。wholeのbasisと局所exact2を区別する。 |
| `SelectedRetainedReceivedExperienceDecisionV1` | 旧 `SelectedSubjectiveReceptionDecisionV1` のschema fieldを変更せず、別型へ `retained_received_experience` を追加する。識別hashを除く既存decision内容fieldは保持し、対象12の `decision_ref`／`input_ref` は新局所内容を含むhashへ変わる。旧decisionへ一括で新資格を与えない。 |

局所はATTENTION／ATTEND_TO、RELATIONAL_NONCOLLAPSE／PRESERVE_BOTH_ENDPOINTS、両端exact2／contrast exact1／当該contributionとqualifierへ閉じる。global LIMITED、単一aggregate命題、既存claim／trace／projection sealを上書きしない。局所sealは現在のaggregate・projection・Moveとの結合を含み、ref／seal再計算だけでは改変が通らないよう、原sourceの再admit・既存更新処理と現在planを再照合する。source candidate／contribution ID、qualifier三軸、roleとbinding refsも現sourceから再導出し、全hashを再計算した改変を拒否する。

公開wire・API/DTO/DB/RN・意味checkpoint保存形式・source属性・global plan markerは変更しない。旧型／旧aggregateと保存済み本文の読取を維持する。適用資格・除外は8/28設計u293/u294、実装file責務は01A u294、実結果は06／API handoff u294。

TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置を維持する。限定箇所の保持確認を§9.2/9.4全体、本人実機または正式Product Readの合格へ換算しない。


## u300 — 未成立三点＋received二点の既存型再利用案（2026-10-17 JST、未承認）

**PROPOSED_NOT_APPROVED、schema／製品変更0。** 初回の未成立fact＋実行対象＋肯定無程度満足と、別の本人received対比を二成分で比較する資格追加案。対象・除外・承認境界は8/28意味設計u300、実本文と診断はAPI handoff／06 u300。

既存`ComponentReceptionOpportunityV1` exact7／二機会と、通常`EmlisAppraisalContent`の三binding・protected0・focal対比を再利用する。receivedは別の二bindingと焦点対比を所有する。exact2の評価内容型を三点へ緩めない。whole候補／ReadingConsequence各exact1と既存独立closureを維持する。新schema／内容型／registry／上限は提案しない。u294の更新後LIMITED専用carrierを初回三点へ転用しない。

型追加がなくてもu262/u281の選択資格変更であり、source不変／checkpoint一致からselectedや本文不変を主張しない。保存済み本文の非再生成と、checkpoint保存後・本文保存前の再試行・旧質問回答・legacyの互換を分けて検証する。既存型でlosslessに結べない場合や新しいretry／保存契約を要する場合は、この案の外として具体化する。公開API／DTO／DB／RN wireは不変予定。実装済み契約として扱わず、承認までは現行資格を維持する。


## u301 — 初回三点＋二点の既存契約接続（2026-10-17 JST）

2026-10-17 08:16:47 JST、Mashがu300の初回限定案に「うん、進めていいよ。」と明示承認した。Rule18 §11.3の追加資格承認は成立済み。u300の未承認表記は提案時の履歴であり、現在は本節を優先する。同じ承認を再要求しない。

新schema／内容型／registry／上限は0。既存ComponentReceptionOpportunityV1二機会と通常EmlisAppraisalContentを再利用し、未成立三点とreceived二点に別binding／焦点対比を持たせる。全required五点・三辺・二Move・二spanを閉じ、既存whole／ReadingConsequence各exact1を維持する。u294の更新後LIMITED専用内容は流用しない。

既存GroundedSemanticComponentProjection.scope_key（GroundedInterpretationProjection.component_rows内）は、承認済み未成立appraisal成分をsourceから証明できる場合に限りscope:source_bounded_result_appraisalとなる。未成立／対象／満足の全facetへ一貫して持たせ、receivedは従来値。ID・原文・順番の区別子でなく固定の意味領域である。独立validatorはsourceから再導出し、消去・借用を拒否する。schema field追加、signature tuple変更、ENDPOINT_COLLAPSE／mutation義務緩和は行わない。資格／所有closureだけでは二つのRIGHT反応が衝突したため必要になった既存source leafの保持であり、追加の対象範囲ではない。

現source plan／checkpointは不変だがselected・branch・内容hash・本文は変わる。旧保存DTOは非再生成、旧checkpointからのretryは同一sourceの完全checkpointを保って現行本文を生成することを実serviceで確認。公開API／DTO／DB／RN wire、保存version・retry契約は不変。identity fixtureは現行shared ownerだけ更新し、歴史fixture不変。詳細は8/28設計／06／API handoff u301、地図01A、weekly§5.6.51。

TECHNICAL_CREDIT / PRODUCT_NOT_CLEAR。初回一体単位未完了、正式受入0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。NORMALや回帰成功を商品合格へ換算しない。


## u307 — 更新後LIMITEDに保持する理由三点のprivate内容（2026-10-17 JST・承認済み）

Mashの2026-10-17 11:25:59 JST承認でu306を実装。原5required核／3辺・別二経験、当時のreceived反応だけのpositive REVISE exact1・round1・完全RESOLVEDを必要条件とする。u304の既存義務証明を変更せず使い、実envelopeから元source／更新とaggregateを独立再導出する。初回・legacy・履歴/frame・後続round・他更新・共有対象／追加材料は資格外。

| private型／内容 | 契約 |
| --- | --- |
| RetainedReasonedExperienceEligibilityV1 | schema_version、source_prefix_ref、checkpoint_ref、original_source_ref、answer_source_ref、original_nuclei（required exact5のcanonical JSON）、original_relations（exact3）、受理update、move_ref、thread_control |
| RetainedReasonedExperienceContentV1 | schema_version、上記資格、projection_preimage_ref、aggregate_projection_seal_ref、aggregate_claim_ref、aggregate_proposition_ref、meaning_outcome_ref、reception_binding_ref、grounding_ref、basis_rows／qualifier_rows各exact3、reason/event/evaluation_binding_ref、reason/appraisal_relation_ref、evaluation_kind=satisfaction、polarity=positive、reason_time／evaluation_time各pastまたはpresent、reception_configuration=EXPLICIT_REASON_GROUNDS_EXPERIENCED_FULFILMENT、seal_ref |
| SelectedRetainedReasonedExperienceDecisionV1 | 既存decision全field＋retained_reasoned_experience。既存aggregateはLIMITED／ATTENTION／ATTEND_TO／focalなし／whole basisのまま。全selectedを現在sourceから再導出して照合 |

局所内容は初回NORMAL型やu294exact2型を継承・流用しない。既存content／decision検査は保持、現行論理契約manifestへ二型を追加し74→76。新型は非公開で保存せず、公開API／DTO／DB／RN／意味checkpoint schemaは不変。唯一の既存作者・独立有限readerが選択された三点内容にだけ既承認の経験文法を使う。received訂正文、全required義務、未知、Observationは不変。

完成済み保存本文はGET/start／再送時に非再生成。本文未完成current checkpointは意味を保持して現行本文へ再開し、既存意味／ANSWER events・operation／旧OBSERVATIONを保持する。旧文面の世代固定を意味checkpointに持たせない。詳細と実測は06／API handoff u307。PRODUCT_NOT_CLEAR、正式0/3・candidate_ready=false・automatic_progression=false。

## u315 — 追加回答後も理由付き満足を経験として保持（2026-10-17 JST）

Mashが2026-10-17 16:46:17 JSTにu314限定案を承認した。別received経験への一度の追加回答（現在／当時×肯定／否定）後も、未変更の理由・対象・満足を満足Moveの局所経験内容として保持する。全体LIMITED・aggregate・意味核辺・checkpoint・Observation・元反応／回答本文は不変。旧u307の当時肯定REVISE資格を維持する。

原required5核3辺・一意な原source2出現、独立した理由三点／received二点、round1・各回答1・RESOLVED・ADD exact1、原失効0・原核辺不変、追加回答核1／ABOUT1辺を出典から検証する。accepted／changed／evidence・subject・時点bindingと全required被覆、肯定3／否定2 Movesのtarget／support／evidenceを照合。現在のanchorも原本envelopeとし、時点証拠を回答へ結ぶ。PARTIAL・unknown・history/frame／legacy・複数／後続回答・共有対象・余剰材料・plain／unfinished・他更新は新資格外。

`RetainedReasonedExperienceEligibilityV1`／`RetainedReasonedExperienceContentV1`／`SelectedRetainedReasonedExperienceDecisionV1`の既存fieldsをそのまま用い、局所三basis／三qualifier／二contributionと二方向関係を結ぶ。基底EmlisAppraisalContent、全体LIMITED／ATTENTION／ATTEND_TO／focalなしは維持。source replayでprepared／Plan全体を照合し、旧aggregateから全selectedを再導出して再封印されたforeign Move／checkpoint／aggregateも拒否する。新型・新schema・論理契約manifestの増分は0、契約validatorの弱化は0。

`STRUCTURE_MAP_DELTA_PRESENT`。既存private V1三型を再利用し、field／schema／manifest／validatorは変更しない。`emlis_answer_update.py`のREVISE証明、作者／有限reader、公開API／DTO／DB／RN、各上限、新file／依存、01B/C・Piece/Analysisの責務は不変。完成済み保存本文は非再生成、未完成current checkpointは同じ受理意味・operation・既存履歴を保って現行本文へ再開する。

101比較は対象60（必須48＋語／時点変種8＋程度4）だけの局所内容／selected型／Reception／text変更、非対象41は取得全record一致。checkpoint95例の意味・核辺・Move・Observation等は全一致。実service73ケース／RN146 DTO、保存38種全文をrootが読解した。主回帰と境界拒否の詳細は06／API handoff u315を参照。native stubによる合成RNで本人実機の追加確認ではない。

最新結果は06／API handoff u315、再開順はweekly §5.6.65。今回の追加承認を待ち直さない。説明の長さ・対象／語尾の反復など本文品質は残件。PRODUCT_NOT_CLEAR・初回一体単位未完了・正式0/3・candidate_ready=false・automatic_progression=false・Draft/open/unmerged・未配置。


## 2026-10-18 u339 — 承認済み初回の本人過去不明への限定拡張

Mashの「進めていいよ」というu338限定案への個別承認を、weekly20261017のu339承認節に製品変更前に保存した（27ae3b8）。従来の本人・現在のepistemic unknown契約を、以下の完全sourceを証明した本人・過去認識だけに加算拡張する。既存現在経路は不変。

- 初回memo全体が、既存wh対象＋後置の明示SELF＋任意の既存程度語＋「わからなかった／分からなかった」の独立完全節だけ、または適格な既存u332 pairの後ろにその一節を置いたもの。完全field／span／source owner／required・explicit／current original envelopeと一意性を再証明する。
- 核はuncertainty／current_user／negative／uncertain／past。`source_past_self_unknown:v1` と対応するsource qualifier版が必要。版だけでは資格としない。唯一のsource_explicit_epistemic_limit境界のaffected nucleus・evidence span・hedge_onlyと同じ対象を結ぶ。UNKNOWNを残す。
- 既存UNFINISHED／PRESENT_UNFINISHED／NO_RELATION_CLAIMを維持し、時制はpast qualifierで分離する。単独は既存UNFINISHED_OPENNESS／LEAVE_UNFINISHED、pair三対象は既存MATERIAL_WEIGHT／RECEIVE_AS_MATERIALとu334のlocal保持を当該完全sourceへ限定拡張する。現在も未完という事実を付加しない。新enum・型・DIRECT_STATE写像なし、論理contract79不変。
- 原文の内側の対象「何が嫌なのか」を「何が嫌だったのか」に書き換えない。外側の「わからなかった」と所有者・肯否・程度を作者と独立readerの両方で保持し、今も不明／解決済み／原因を推測しない。聞き手へのSELF人称変換だけを許す。
- source→checkpoint→plan→selected／aggregate→実本文まで照合する。past readerはselected必須・move decision一意・全appraisal basis／contributionの既知根拠内包含・対象のresponse／primary所属とpast軸を照合し、作者を呼ばず原文全体を復元する。専用reader失敗時に汎用経路へ落とさない。
- 旧checkpointは過去資格を無効にした旧modeで全体一致する場合のみ復元し、旧plan／selected／artifactまたは旧停止を保つ。旧IDへ新意味を付け替えない。旧完成は保存DTOを非再生成で読む。
- 初回・回答なし・round0・更新／失効／未解決partsなしに限定する。対象入力はEND。回答・訂正・撤回の新資格は作らない。既存実在質問を持つ更新は回帰対照。
- 丁寧過去、時間prefix、先頭／暗黙SELF、他者、引用／報告／疑問／条件、追加material、不明先行・不完全pair、一般AFFECT／STANCE／原因補完は対象外。別の拡張へ本承認を流用しない。

既存production9owner内の実装。source adapter本体は変更せずprojectionで境界を再証明し、Q1入口を同じprepared planへ接続した。公開wire／DB／RN／依存／外部AI／費用／配置は不変。商品合格・次Gate・merge／deployの承認を兼ねない。実装・検証と現在位置は正本06末尾u339、以下監査を参照。

[Cocolon_EmlisAI_u339_PastSelfUnknown_Implementation_20261018.md](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u339_PastSelfUnknown_Implementation_20261018.md)。


## u348 — 混在する独立現在不明を初回と一更新後へ保持するprivate V2（2026-10-18）

Mashがu347監査の限定案を承認した。既存本人の安堵・不確かな予想と現在の寂しさのpair、独立した既存received一経験、末尾の独立current SELF wh不明一つ、という順序の完全原文を再証明できる場合に限る。初回の不明責務選択から、別received経験への既受理ADD／反応REVISE／event WITHDRAW一更新、実本文、旧checkpoint互換、保存再表示までが同じ承認範囲である。新しい問い・質問数・回答grammar・任意多段・前置／複数／第三者／原因／過去不明への拡張は含まない。

初回の原文にはrequired核が五つあるが、応答対象はpair二点と不明一点の三対象／二責務だけである。received二核はObservationで必須のままReceptionには未選択とする。初回は既存`RetainedReliefCognitionEligibilityV1`／`RetainedReliefCognitionContentV1`を用い、全体LIMITED・一claim・三対象、pair局所二basis／二qualifierを維持する。

更新後はpair二点、受理回答またはevent撤回後の残存反応一点、不変の不明一点の四対象／三責務とする。全体LIMITED／ATTENTION／ATTEND_TO／MATERIAL_WEIGHT／RECEIVE_AS_MATERIALの一claimは維持し、pair局所二対象と独立不明を混同しない。旧`RetainedUpdatedReliefCognitionEligibilityV1`／`RetainedUpdatedReliefCognitionContentV1`の三対象／二責務を緩めず、新しいexact型へ分ける。

### Canonical fields / version / identity

以下はEmlis専用のrequest-local private型である。列挙fieldはすべてrequiredであり、optional追加はない。EligibilityV2は旧EligibilityV1の十三fieldを同じ順序で持ち、末尾に不明核／不明Moveの二参照を追加する。ContentV2は既存local内容の十三fieldを同じ順序で持ち、eligibilityのexact型をV2にする。

| 型 | Required fields（定義順） |
| --- | --- |
| `RetainedUpdatedReliefCognitionEligibilityV2` | `schema_version`, `source_prefix_ref`, `checkpoint_ref`, `original_source_ref`, `answer_source_ref`, `relief_nucleus_ref`, `loneliness_nucleus_ref`, `contrast_relation_ref`, `received_event_ref`, `received_reaction_ref`, `answer_update`, `move_ref`, `thread_control`, `unknown_nucleus_ref`, `unknown_move_ref` |
| `RetainedUpdatedReliefCognitionContentV2` | `schema_version`, `eligibility`, `projection_preimage_ref`, `aggregate_projection_seal_ref`, `aggregate_claim_ref`, `aggregate_proposition_ref`, `meaning_outcome_ref`, `reception_binding_ref`, `grounding_ref`, `proposition`, `basis_rows`, `qualifier_rows`, `seal_ref` |

- 両型の`schema_version`はexact string `2.0`。class identityと合わせてV2を選び、旧V1のschema文字列やfieldを上書きしない。ref／schema／seal fieldsはstring、`answer_update`／`thread_control`は既存ownerから再導出する受理更新／thread control、`proposition`は`SubjectivePropositionV2`、`basis_rows`／`qualifier_rows`は既存型のtuple各exact2である。ContentV2の`eligibility`はexact `RetainedUpdatedReliefCognitionEligibilityV2`を必要とする。
- `unknown_nucleus_ref`はpair・receivedの各核とは異なる不変の原不明核、`unknown_move_ref`はpair Moveとは異なる独立`stay_with_current_burden` Moveを指す。全selectedは異なる三Moveを持つ。不明Moveは当該核だけをtargetとしsupportなし、独立contribution exact1を所有する。pairと不明の局所寄与を重複させず、全体claim／meaning outcome／reception binding／basis／qualifierとの一致を保つ。
- V2 local sealは`retained-updated-relief-cognition-v2:`に、`seal_ref`だけを空文字へ置換した内容の`stage1_canonical_json_bytes`のSHA-256を付ける。V1 seal prefixは不変。refやsealを再計算しただけの改変を認めず、全source／更新／plan／selectedの再導出結果との一致を必要とする。
- 既存`SelectedRetainedReliefCognitionDecisionV1`のcarrierを再利用し、新decision型は追加しない。logical contract manifestへ上記二型を`retained-updated-relief-cognition-v2` family／`POST_SELECTION_LOCAL_CONTENT`として追加し、private logical countは81から83になる。§1 shared catalog、公開API schema、Piece／Analysis契約へ昇格しない。

### Source proof / checkpoint compatibility

初回の完全source資格は、pair・received・不明の原文／span／順番／主体／時点／肯否／独立性を結ぶ。receivedは既存有限projectionの全原文から型・scalar range・linkまで再導出する。不明はcurrent SELF wh一核・required／explicitで、optionalを含む関係接続を持たない。`source_mixed_relief_unknown_retention:v1`はこの証明を通過した原不明核だけへ付ける。marker単独では資格を与えない。

更新資格は回答exact1・round1・完全RESOLVED・MATERIAL_UPDATE・受理更新exact1を要求し、既存receivedだけへの上記更新と、原pair／不明の不変を確認する。不明やpair自身の訂正／撤回、未解釈回答、意味変更なし、複数回答・履歴／frameは新資格外である。旧不明を新しい現在として復活させない。作者用の不明原文証明も実original envelopeを再受理して元planと不明・pairを比較し、回答source exact1に限定する。selected内容の検査はそれとは別に原入力と受理更新を再受理し、全plan・全selectedを再導出して照合する。

新原plan witnessと`source_mixed_relief_unknown_update_retention:v1`によって新意味identityを区別する。旧u347 checkpointは`_legacy_mixed_relief_unknown=True`で新witnessだけを無効にした原planから再導出し、旧checkpointの全identityが一致する場合だけ復元する。Prepared全体に新legacy flagを加えて既存u344/u346保持まで失効させない。独立source replayも`prepare_emlis_meaning`を経由し、保存checkpointの版を尊重したうえでactual envelope・全span／qualified refsとplan／selectedを照合する。

比較原本はu347完了版であり、同じ旧checkpointの全意味・plan・selectedとu347の生成本文／停止を保持する。u346／u347の完成済み本文は保存DTOのまま非再生成で返す。同一意味checkpointから、行構成だけ異なるu346とu347両世代の未完成本文を区別して復元するとは主張しない。意味保存前／後の確定中断と再試行は別に検証する。

`STRUCTURE_MAP_DELTA_PRESENT`。既存production owner内のprivate契約追加であり、新production file・依存・外部AI・公開wire／DTO／DB／RNのfield・意味checkpoint保存schema・配置は変更しない。検証結果・実本文・限界は[u348監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u348_MixedUnknownRetention_20261018.md)と正本06／API handoffに記録する。PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。

補足：current SELF whの「自分でも」はu335既存のkind／predicate二field補正をnewmixed完全原文資格の成立時だけ適用する。relation・属性・時点の修正はしない。legacy modeでは補正を抑止。NO_MATERIAL_UPDATEはV2資格外であり、保存済み初回V1本文を既存UNCHANGED経路で再使用する。新mixed Q1だけにも既存reuse outcomeを適用し、旧checkpointの挙動は維持する。

## u350 — 安堵pair・received一経験・任意現在不明の私有保持契約（2026-10-18）

u349監査の限定案はMashが本会話で「進めていいよ」と承認済み。既存SELFの安堵・不確かな予想と現在の寂しさ、その後の独立received一経験、任意の末尾current SELF wh不明一つを、初回から既受理一更新・旧保存互換・再表示まで同じ単位で保持する。新しい質問・回答文法・任意多段・追加経験・前置／複数／第三者／過去不明は含まない。以下は既存owner内のrequest-local private型で、公開schema登録・DB保存fieldの変更ではない。

### Canonical fields / finite values

全fieldはconstructor上requiredで省略しない。表のnullable fieldだけ`None`を許し、値がないこととfield省略を同一視しない。既存V1/V2の型・schema・seal・対象数条件は変更しない。

| 新logical型 | Required fields（継承を含む定義順） |
| --- | --- |
| `RetainedReliefReceivedEligibilityV1` | `schema_version`, `source_prefix_ref`, `checkpoint_ref`, `original_source_ref`, `relief_nucleus_ref`, `loneliness_nucleus_ref`, `received_event_ref`, `received_reaction_ref`, `unknown_nucleus_ref`, `contrast_relation_ref`, `received_relation_ref`, `answer_nucleus_ref`, `answer_relation_ref`, `operation`, `move_ref`, `received_move_ref`, `unknown_move_ref`, `thread_control`, `update`, `answer_source_ref` |
| `RetainedUpdatedReliefReceivedEligibilityV1` | `schema_version`, `source_prefix_ref`, `checkpoint_ref`, `original_source_ref`, `relief_nucleus_ref`, `loneliness_nucleus_ref`, `received_event_ref`, `received_reaction_ref`, `unknown_nucleus_ref`, `contrast_relation_ref`, `received_relation_ref`, `answer_nucleus_ref`, `answer_relation_ref`, `operation`, `move_ref`, `received_move_ref`, `unknown_move_ref`, `thread_control`, `update`, `answer_source_ref` |
| `RetainedReliefReceivedPairContentV1` | `schema_version`, `eligibility`, `projection_preimage_ref`, `aggregate_projection_seal_ref`, `aggregate_claim_ref`, `aggregate_proposition_ref`, `meaning_outcome_ref`, `reception_binding_ref`, `grounding_ref`, `proposition`, `basis_rows`, `qualifier_rows`, `seal_ref` |
| `RetainedReliefReceivedExperienceContentV1` | `schema_version`, `eligibility`, `projection_preimage_ref`, `aggregate_projection_seal_ref`, `aggregate_claim_ref`, `aggregate_proposition_ref`, `meaning_outcome_ref`, `reception_binding_ref`, `grounding_ref`, `proposition`, `basis_rows`, `qualifier_rows`, `seal_ref`, `reception_configuration`, `event_ref`, `reaction_ref`, `answer_ref`, `relation_refs`, `original_proposition` |

| Field group | 型・値・identity上の意味 |
| --- | --- |
| 各`schema_version` | exact string `1.0`。初回と更新はschema文字列でなくexact class identityでも区別 |
| Eligibilityのsource／checkpoint／原核／原関係／Move参照 | string。`received_event_ref`／`received_reaction_ref`／`received_relation_ref`は原経験の核／関係IDであり、撤回後も原source資格の識別として保持する。active roleの有無はcontent側と操作で区別 |
| Eligibilityのnullable refs | `unknown_nucleus_ref`, `answer_nucleus_ref`, `answer_relation_ref`, `unknown_move_ref`, `answer_source_ref`は`Optional[str]`。unknown核とMoveは同時に存在／不在 |
| `thread_control` | 宣言型`Any`、実source再受理では既存`EmlisThreadInputV1`と照合。`prepared_meaning_checkpoint_ref`を当該checkpointへ固定 |
| `update` | 宣言型`Any`、初回は`None`。更新時は既存answer ownerが受理したexact1 itemをそのまま照合し、新しい回答解釈を作らない |
| `operation`／`reception_configuration` | stringの有限値`INITIAL`, `ADD`, `REVISE`, `WITHDRAW_EVENT`, `WITHDRAW_REACTION`。新enum classは追加しない。contentのconfigurationはeligibility.operationと一致 |
| Contentの`eligibility` | exact `RetainedReliefReceivedEligibilityV1`またはexact `RetainedUpdatedReliefReceivedEligibilityV1`。旧資格型や任意subclassは通さない |
| Contentのbinding refs | string。全体projection preimage／seal、claim／proposition、meaning outcome、reception binding、groundingを同じselected aggregateへ結ぶ |
| `proposition`／`basis_rows`／`qualifier_rows` | 既存`SubjectivePropositionV2`と既存basis／qualifier型のtuple。pairはexact2 basis・exact2 qualifier・exact1 contribution。receivedは選択寄与に所属する全row（manifest上1..4）を保持し、semanticな有効端点数を操作別に別途拘束 |
| `event_ref`, `reaction_ref`, `answer_ref` | `Optional[str]`のsemantic node ref。active roleだけを指し、撤回／訂正済みの旧roleは`None`。Eligibilityの原核IDとは参照空間が異なる |
| `relation_refs` | semantic relation refのtuple。INITIAL=原contrast一つ、ADD=原contrast＋既受理ABOUT、REVISE=既受理ABOUT一つ、片側撤回=空tuple。順序・全source再導出も照合 |
| `original_proposition` | `Optional[SubjectivePropositionV2]`。INITIALはreceived局所propositionと一致。ADDは原event／reactionの一contributionから再導出した旧二端点経験。REVISEと両WITHDRAWは`None` |

初回資格は`operation=INITIAL`かつ回答核・ABOUT・update・回答sourceがすべて`None`。更新資格は既存の回答exact1・round1・完全RESOLVED・MATERIAL_UPDATE・受理item exact1であり、updateと回答sourceが必要。ADD／REVISEは回答核と実在するABOUT参照を必要とし、WITHDRAWは両参照を持たない。元pairと任意不明は完全一致で残ることを要求する。

| 操作 | 全体response objects（不明なし／あり） | received active roles | received relations |
| --- | --- | --- | --- |
| INITIAL | 4／5 | event＋原reaction | 原contrast |
| ADD | 5／6 | event＋原reaction＋answer | 原contrast＋既受理ABOUT |
| REVISE | 4／5 | event＋answer | 既受理ABOUT |
| WITHDRAW_EVENT | 3／4 | 原reactionのみ | なし |
| WITHDRAW_REACTION | 3／4 | eventのみ | なし |

ADDの肯定／否定、回答時点／元出来事時点は既存受理itemのtemporal bindingからそのまま保持する。3端点を旧received localの2 basis／2 qualifiersへ偽装しない。INITIALは既存received二端点localを使う。更新後のreceivedは選択された全roleの`MATERIAL_WEIGHT`／`RECEIVE_AS_MATERIAL`局所propositionを持ち、ADDだけ原二端点propositionを別途保持する。REVISEは既存update ownerが実際に作ったABOUTだけを使い、本文のためのcontrastを作らない。

### Selected carrier / aggregate / seals

新HR carrier `SelectedRetainedReliefReceivedDecisionV1`は、既存`SelectedSubjectiveReceptionDecisionV1`の14 fieldに`retained_relief_received`一つを追加する。全required fieldの定義順は`decision_ref`, `branch`, `meaning_outcome_ref`, `reception_binding_ref`, `projected_claim_ref`, `selected_opportunity_ref`, `move_id`, `reception_act`, `target_nucleus_ids`, `support_nucleus_ids`, `selected_contribution_refs`, `subjective_proposition`, `basis_rows`, `qualifier_rows`, `retained_relief_received`。追加fieldの宣言型は`Any`だが、検証時は上記pairまたはexperience contentのexact型・完全sourceを要求する。pairとreceivedの二decisionを同じ資格から一体でcarryし、独立不明は既存decisionを使う。

全体はLIMITED・一claim、`ATTENTION`／`ATTEND_TO`、aggregate appraisalは`MATERIAL_WEIGHT`／`RECEIVE_AS_MATERIAL`、focal relationなし。全decisionは同じaggregate／claim／meaning outcome／reception binding／basis／qualifierを共有する。各Moveのselected contributionsをpair・received・任意不明へ重複なしで分割し、その和がaggregateの全target contributionに一致する。各局所semantic roleとMove target／supportの集合も一致させる。pair局所appraisalだけは既存`EmlisReliefCognitionAppraisalContent`を使い、独立不明やreceivedへ混同しない。

- pair local sealは`retained-relief-received-pair:`、experience local sealは`retained-relief-received-experience:`に、`seal_ref=''`としたcontent全体の`stage1_canonical_json_bytes`のSHA-256を連結する。`schema_version`と資格・全binding・local内容もhash材料である。
- `aggregate_proposition_ref`は既存`retained_relief_cognition_aggregate_ref`を使い、local化前の全aggregateに結ぶ。projectionのpreimage／sealとmeaning causal traceもcompositionで照合する。
- carrierの`decision_ref`は既存`selected-reception-decision:`規則で自身だけ空にした全fieldをhashする。追加contentも材料になる。全selectedの`input_ref`も既存`selected-reception-input:`規則で再計算する。sealを作り直しただけの内容改変はsource replayを通らない。
- logical manifestには上記4型を`relief-received-retention-v1` family／`POST_SELECTION_LOCAL_CONTENT`として登録し、private logical83→87。HR carrierはこの4型とは別の既存HR owner内型であり、logical countへ重複加算しない。shared catalog・公開API・Piece／Analysis契約へ昇格しない。

### Complete source / checkpoint / reader responsibility

`_source_relief_received_group`は既存本人pairとreceived原文全体、任意末尾current SELF wh不明を再証明する。原文順序・全span集合・source field・明示主体・時点・肯否・関係・scalar range・received linkを照合し、別材料や余分な接続を認めない。完全資格の成立した原安堵核だけへ`source_relief_received_retention:v1`を付ける。これはcheckpoint identityの区別であり、marker単独で選択・本文を許可する仕組みではない。

`_retained_relief_received_update_source`／`_retained_relief_received_duties`は既存受理一更新と、その有効／失効核・関係・固有時点を照合する。pair／unknown自身の変更、未解釈、複数回答、history／frameでは新資格を失効する。`NO_MATERIAL_UPDATE`は更新型の対象外であり、Q1/Q3の既存`UNCHANGED`経路で保存済み本文を再使用する。

`validate_retained_relief_received_source`は`ThreadEvidenceSpanResolver`のactual original／answer envelopeを再受理し、保存checkpointを尊重する`prepare_emlis_meaning`へ戻す。全envelope・span・qualified ref・全plan・資格を比較し、全aggregateとpair／receivedの両carrierを再導出した全selectedとの一致を必要とする。一つのlocal contentを別のlocal contentのsource証明に流用しない。source構造の検査と作者の有限本文生成、作者を呼ばない独立readerは別の責務である。

旧u348は`_legacy_relief_received_retention=True`で新witnessと新選択だけを無効にした原planから再構築し、旧checkpoint／旧質問の全identityが一致する場合に復元する。Preparedへ新しい汎用legacy flagを増やしてu348 mixed unknownや既存u344/u346保持まで失効させない。旧u347以前のlegacy分岐も維持する。完成済み本文を再生成して旧DTOを書き換える契約ではない。

receivedは`attention`、独立unknownは`felt_response`を持つ別Moveである。最大3 Move／Reception最大3文を維持する。追加回答の3端点は同一received責務で表現し、反応撤回後のevent単独はこの資格内でのみsource-ownedな事実として受け取る。独立readerは元sourceへ戻して主体・時点・肯否・関係・欠落・撤回済み素材の復活を検査し、感情や原因の補完を許可しない。

`STRUCTURE_MAP_DELTA_PRESENT`。既存production10owner、新production0。公開wire／DTO／DB／RN／Safety／依存／外部AI／配置の変更はない。01／01AとEmlis／CMEE current map、8/28意味設計を同期する。実本文・旧比較原本・検証結果・限界は[u350監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u350_ReliefReceivedRetention_20261018.md)と正本06／API handoffのownerとし、ここに未確認の合格数を置かない。PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。


## u353 — 初回の本人説明と元経験を一体保持する私有契約（2026-10-19）

u352の個別承認に基づく実装。旧u350の二端点INITIALと旧validator/sealのexact型集合を変更せず、新family `initial-personal-meaning-v1`／derivation `POST_SELECTION_LOCAL_CONTENT` の3logical型を追加する。logical count87→90。公開schemaではない。

### Canonical fields / finite values

`InitialReceivedPersonalMeaningEligibilityV1`（schema1.0）のfield順：`schema_version, source_prefix_ref, checkpoint_ref, original_source_ref, received_event_ref, received_reaction_ref, initial_meaning_ref, received_relation_ref, received_move_ref, relief_nucleus_ref, loneliness_nucleus_ref, contrast_relation_ref, relief_move_ref, unknown_nucleus_ref, unknown_move_ref, thread_control`。Pの4Optional refはall-or-none、Uの2Optional refもall-or-none。核・関係refはgrounded planのID、move refは同planのReception moveを参照する。元source・checkpoint・controlを完全再導出する。

`InitialReceivedPersonalMeaningContentV1` は既存の局所封印基底13field `schema_version, eligibility, projection_preimage_ref, aggregate_projection_seal_ref, aggregate_claim_ref, aggregate_proposition_ref, meaning_outcome_ref, reception_binding_ref, grounding_ref, proposition, basis_rows, qualifier_rows, seal_ref` に、`event_ref, reaction_ref, initial_meaning_ref, received_relation_ref, original_proposition` を追加。ここでevent/reaction/Mはsemantic node ref、received relationはsemantic edge refであり、eligibility側の核IDとはselected mappingで対応付ける。basis3／qualifier3／selected contribution2。元R一contributionの二role propositionは既存candidateから再導出し、M singletonと混同しない。

`InitialReceivedPersonalMeaningPairContentV1` は同じ13fieldと新eligibilityを持ち、既存Pのbasis2／qualifier2／contribution1を維持する。新eligibilityにanswer・update・ABOUT・回答時点は存在しない。

### Selected carrier / aggregate / seals

HRの`SelectedInitialReceivedPersonalMeaningDecisionV1`は既存decision14field＋`initial_received_personal_meaning`を保持し、logical数に重複計上しない。全体はLIMITED一claim、ATTENTION／ATTEND_TO、MATERIAL_WEIGHT／RECEIVE_AS_MATERIAL。対象3+2P+U、責務1+P+U、contribution2+P+U、順序received→P→U。各責務は共通aggregateを参照し、contributionは完全・互いに重複なし。全体propositionを新局所propositionへ置換しない。

sealはcanonical JSONのseal_ref空版に対するSHA256。received prefix `initial-personal-meaning:`、pair prefix `initial-personal-meaning-pair:`。compositionは元claim・causal trace・preimage・projection sealを照合してから新型を構成。旧型の型許可集合・sealは変更しない。

### Complete source / checkpoint / reader responsibility

初回round0、answer／accepted update／失効／history／frameなし。元memo全体からR一経験＋直後M、P0/1、current SELF wh不明0/1を証明。Mは知覚内側と外側の過去感情の別scalar範囲を保持し、外側から肯否を再導出する。別主体・引用報告・仮定・追加received・複数説明・自由順序・余分なfieldを新資格へ昇格しない。

原envelopeを再admitし、original・更新plan・resolver全span/qualified refs・資格・aggregate・selected全体を比較する。局所sealだけを原文の代用にしない。専用IRはevent/reaction/M三slotと元contrastのみで、回答grammarへ変換しない。実本文の独立readerは作者なしで意味保持と欠落／事実化／現在化／原因化を検査する。

旧u352初回は新source資格を無効にした全旧sourceから復元。実pendingの新implicit過去ADDは既存retention版へ入り、旧IDは既存legacy経路で旧plan・selected・本文／停止を復元する。旧完成DTO非再生成と、旧未完成checkpoint再開を別々に検証する。

## 2026-10-23 — P1内部準備schema（public／意味schemaと独立）

`cocolon.cmee.internal_preparation.v1`はprocess-localのprivate材料。新型は`PreparedRequest`／`CandidateReceipt`の2つで、既存`GenerationRequest`、意味checkpoint、artifact、公開wireの版を変えない。active Emlisのlogical90へP1の未接続型を混算しない。

- request：`core/task/tier`、独立した`sources`（元7field、ID／版／役割／親、記録時点、text_fields、元根拠）、`period`、実`control`、既存方針の投影、core別出力条件、`adoption_state=NOT_ADOPTED`。全体をcanonical JSONで凍結し、`prep-`＋SHA256をrequest IDとする。元JSONの保持とcanonicalなidentity表現を区別する。
- probe：E02-Bだけの固定材料は`SUPPLEMENTAL_PROBE`、`thread_answer_admitted=false`、native envelope／版／時刻はnull。元の本人補足役割を別fieldへ保持し、実問いを発明しない。
- responseの仮構造：`{"candidate": {"...": "未採用内容"}, "evidence": [{"source_id":"...", "field_path":"memo", "start":0, "end":1, "quote":"原"}]}`。candidateはP2意味schemaを先取りしないJSON object。根拠はfield相対Unicode scalar座標。request側のnative EvidenceRefのUTF-8座標を上書きしない。
- receipt：同じrequest IDとrequest内容hashを照合。raw文字列と構造化できたcandidate JSON、provider/model/revision/usage/終了理由/所要時間を別保持。未提供はnull。全状態NOT_ADOPTEDで、採用setter／Engine hook／保存処理はない。

| status | 意味 |
|---|---|
| CANDIDATE_UNREVIEWED | JSON形と根拠引用の位置一致まで。意味採用0 |
| EMPTY | 正常終了でも本文なし |
| INVALID_FORMAT | JSON不正／重複key／非有限数／候補形不正 |
| INVALID_EVIDENCE | source／field／範囲／quote不一致。構造化候補は未採用で保持 |
| TIMEOUT / TOKEN_LIMIT / PROVIDER_ERROR | 終了理由が正常JSONより優先。途中候補も採用しない |
| UNKNOWN_FINISH | 未提供・未対応の終了理由。正常扱いしない |

別requestへの付替え、不正metadataは明示例外。位置照合は各candidate claimの充足検査ではなく、意味の妥当性・自然さ・Safetyの一般検証ではない。provider固有の終了理由・usage形式の正規化は実接続時の未実装事項。実値を固定stub値へ読み替えない。

<a id="cmee-p2-schema"></a>

## 2026-10-23 — P2意味候補の具体的対応schema案（PROPOSED_ONLY）

**DESIGN_MAPPING_COMPLETE / RUNTIME_ADMISSION_NOT_IMPLEMENTED。** Mashの「P2を進めて」に基づき、P1の未採用候補と三中核の既存型を対応させる案を具体化した。本節は既存schemaの撤回・guard緩和・native型追加・保存field追加の実施ではない。P1の既存2型・22件検証はそのまま、今回API byte変更0。新語彙を現native enumへ追加したものでもない。

候補例の版名は`cocolon.cmee.semantic_mapping_proposal.v1`。P1の`{candidate, evidence}`をそのまま使い、candidate内部に次を提案する。例のraw JSONと実P1受取、native field照合は[semantic_mapping_inspection.json](../../../observation_learning/trials/2026-10-23-current-four/semantic_mapping_inspection.json)。手作業の設計例で、モデル生成物ではない。

| 提案field | 形と意味 | 対応時の条件 |
|---|---|---|
| `candidate.schema_version/core` | 上記提案版、emlis/piece/analysis | P1 requestのcore・task・source集合へ束縛。別coreの候補や未来補足を混ぜない |
| `claims[].claim_id/kind/text/evidence_indexes` | 候補内ID、claim種別、未採用の内容、根拠index列 | modelローカルIDはnative IDではない。kindは提案語彙。元sourceを全文言換えしてSOURCE_EXPLICITにするfieldではない |
| `claims[].subject` | `{binding, source_entity, evidence_indexes}`。bindingはEXPLICIT/OMITTED/UNRESOLVED、entityは原文の対象またはnull | 原文「私」が従属節にあるだけなら主文の主体へ拡張しない。「自分の仕事」の所有者を主語「自分」に変えない。省略をSELFで自動補完しない |
| `claims[].predicate` | `{surface, arguments}`。引数は`{role,text,claim_ref,evidence_indexes}` | 各引数と格にも根拠を付ける。「に」を受取人・場所・原因と自動決定せず、例ではWRITTEN_に等で原格を保持。複合節は複数claim／scopeへ分ける。空のexample argumentsは引数不存在の確定ではない |
| `claims[].polarity` | `{value, scope_refs, evidence_indexes}` | 否定の対象をclaim／関係／引用内の範囲へ固定。「理由の否定」を「感情の否定」にしない。否定済み理由の内部命題を実事実として独立採用しない |
| `claims[].modality` | `{value,evidence_indexes}` | 事実報告、本人感情、希望、可能性、否定された理由への言及を区別。希望は実現／未実現のどちらも自動確定しない。現native語彙に無ければその差を保持 |
| `claims[].about_time` | `{kind,expression,anchor_source_id,evidence_indexes}` | 元語・時制・どのsourceに属する相対時点かを残す。recorded_atはsourceの記録時刻であり、このfieldへコピーして出来事日時を作らない。絶対時刻の解決は未実装 |
| `claims[].qualifiers`／`relations[].qualifiers` | `[{kind,text,scope_refs,evidence_indexes}]` | 程度「少し」、限定否定「わけではない」、報告・埋込み・条件・時点のscopeを落とさない。native fieldが無いなら保留／未対応、自由attributeで迂回しない |
| `relations[]` | `{relation_id,type,from_claim_id,to_claim_id,polarity,scope_refs,qualifiers,evidence_indexes}` | 両端の根拠と関係自体のmarker／scope根拠を分離。単なるfield順・record順・「て」を因果や同時性へ変えない。否定された理由は関係のNEGATEDを一重で保持 |
| `unknowns[]` | `{unknown_id,target_claim_refs,dimension,description,origin,resolution_state,evidence_indexes}` | originはPERSON_STATED／NOT_OBSERVED_IN_MATERIAL／UNRESOLVED_READINGを区別。本人の「まだ曖昧」と、材料に他者の回答が無いことは別。「聞いていない」から本人が絶対に知らないとは言わない |
| `conflicts[]` | `{conflict_id,claim_refs,conflict_kind,status,evidence_indexes}` | 二claim・対象・時点・scopeを特定。両価感情、別の日の役割、本人訂正、論理的矛盾を混同しない。conflict無しは空配列でよい |
| `updates[]` | `{operation,target_claim_refs,new_claim_refs,answer_source_id,prior_meaning_ref}` | 実回答source、既存active claim、依存範囲と時点を特定してからADD/REVISE/WITHDRAWへ対応。自己申告だけで更新しない。E02-Bは実pending無しprobeなので実更新はN/A、例のupdatesは空 |

`evidence`各要素はP1の`source_id/field_path/start/end/quote`を維持。`evidence_indexes`はこの配列の0始まりindex。版・role・元field・native envelopeは、自己申告候補ではなく同じ凍結requestから解決する。候補のfield相対Unicode scalarをnative envelope絶対UTF-8座標へそのまま代入しない。既存ledgerより狭いrangeは候補側で保持し、native span/ownerの生成方針はsource owner側の実装判断とする。

### 型の対応と、採否は別の判定

| 判定 | 具体的条件 | 結果の意味 |
|---|---|---|
| REJECT | source／request／親／owner／版／期間／quote/rangeが不一致、生成本文を本人sourceとして使用 | 不正な候補。原入力保存を取り消す理由にはしない |
| HOLD | 根拠位置はあるが主体・否定scope・対象・時点・複数の読みを確定できない、既存意味との対応が未確定 | raw候補・対象・不明を保持。モデルconfidenceや自己採点で採用しない |
| UNSUPPORTED | 必要意味の格納field・enum・admission・作者・safe表示／保存が現profileに無い | 入力不足や意味の誤りと読み替えず、具体的な型／検査差分を返す。sourceを削って成功させない |
| ADOPT（将来の意味採用処理だけ） | 対象の承認済みsemantic profileがあり、source照合、claim/引数/関係/qualifier/unknownの対応・被覆、coreの意味採用条件、実更新資格、snapshot／version束縛を満たしたもの | provisionalな解釈の採用と本人明示事実を分離。本文成功、保存成功、商品合格を意味しない。**P2では到達0、実装0** |

現parserとの不一致だけではREJECTしない。型を構築できてもADOPTではない。四例は全NOT_ADOPTEDで、上表のHOLD／UNSUPPORTEDは手作業の設計上の分類であり、新しいruntime判定器が実行した結果ではない。P1のCANDIDATE_UNREVIEWEDもP2 schema／意味を検査しない。P2の共通proposalは最低保持項目の案で、任意の言語理解を機械的に証明する保証ではない。

### 将来profileに必要な版・保存差分（今回は導入しない）

旧profileは旧source→旧意味→旧plan／問い／traceの再導出を維持。新profileを実装する場合は、採用済みの意味内容、core/profile/admission/adapterの版、source/requestの内容identity、claim対応、保留／未対応部分をひとまとまりのimmutable snapshotとして保持する。checkpointにはその内容identityを結合し、再開・再読で実モデルを再推論して旧意味を作り直さない。旧完成本文の非再生成と、旧未完成checkpointの原版再導出を維持する。

現`EmlisMeaningCheckpointV1`に任意候補全体の保存fieldはない。追加先は既存service/store/serializerの実contractと照合する必要があり、P2からDB変更不要・既存JSONへ自由に保存可能と断定しない。公開DTOにprivate候補を混ぜない。Piece canonical text・Analysis graphの保存版とnative renderer/readerも同じ新profileを理解する必要がある。

一般モデルの読解・言換えの正しさは位置・型検査だけでは保証できない。新profileでモデル解釈をどの範囲で暫定採用し、どの条件で保留するかは商品contractの具体的変更点である。別のLLMによる自己採点器や常時の人手承認をP2の隠れた前提にせず、実候補と既存評価で品質・誤採用を確認し、変更範囲を示して判断する。

<a id="cmee-p3-snapshot-schema"></a>

## 2026-10-23 — P2後の新規Emlis限定snapshot案（提案時）

**提案時：PROPOSED_ONLY / IMPLEMENTATION_APPROVAL_PENDING。現在はMash承認済み、実型は後続[cmee-p3-actual-schema](#cmee-p3-actual-schema)。** [限定範囲・実owner・検証条件](01_shared_kernel_and_runtime_contracts.md#cmee-p3-bounded-proposal)は設計01、型と版の案は本節を唯一ownerとする。既存型・SEMANTIC_SCHEMA定数・SQL・保存内容は今回変更0。

### 版と入出力

| 対象 | 新版の提案 | 互換・責任 |
|---|---|---|
| 意味profile | `emlis_candidate_snapshot.v1` | runtime_profileのQ2/Q3値とは別軸。内部offline開始時だけ指定しthread中固定。旧threadの欠落は既存legacy形へだけ解決 |
| snapshot | `cocolon.cmee.emlis_semantic_snapshot.v1` | source／候補／正規化意味／対応・保留をimmutableな一内容として保持 |
| 新checkpoint | `cocolon.cmee.emlis_answer_meaning.v2` | 旧V1を上書きせず別版でdispatch。既存checkpoint fieldに新snapshot全体と内容refを加える案 |
| 内部request | `EmlisThreadInputV1`の新private入力 | semantic_profileと処理modeを明示。FRESH_CANDIDATEは未採用receipt、RESUME_ADOPTEDは保存snapshot必須、READ_NONADOPTEDは保存評価参照。raw client指定・公開DTOには出さない |
| admission結果 | `decision: ADOPT / HOLD / UNSUPPORTED / REJECT` | P1 receiptは常にNOT_ADOPTEDを維持。ADOPT結果だけが採用済みsnapshotを作る。残りはcandidate/理由/未対応refを保持しsnapshotを偽造しない |

新checkpointの各名称は実装前の案であり、新旧型を同じfield集合へ曖昧にunionしない。未知版・余剰field・RESUME_ADOPTEDに保存snapshotなし・core／source不一致は拒否する。FRESH_CANDIDATEはsnapshot作成前の入口で、当該prefixの採用済みsnapshot持込みを拒否する。旧public DTOへprivate candidate・引用・snapshotを混ぜない。

### snapshotに保持する内容

| field群（提案） | 内容／拘束 |
|---|---|
| `schema_version / semantic_profile / core` | 上記版とemlis。profile・checkpoint・requestの組を一致させる |
| `admission_version / adapter_version` | 採用条件とnative投影の版。provider model名・runtime_profileで代用しない |
| `request_ref / source_prefix_ref / source_bindings` | P1 request内容identityと正規sourceのID・版・role・親・原文identity。適格履歴は当回と別roleで保持 |
| `candidate_receipt / candidate_content` | 元候補・根拠配列・未提供をnullで残したprovider/model/revision/usage等。候補の説明や生成文を本人sourceにしない |
| `normalized_meaning / claim_mapping` | 必要なclaim・主体／引数・時点・否定scope・qualifier・関係・unknown.origin・conflictとnative参照の対応。raw anchorと暫定解釈を区別。P2共通schemaから必要項目を黙って落とさない |
| `prior_snapshot_ref / accepted_update / inactive_claim_refs` | 初回priorはnull。実pendingとANSWER、prior active claim、ADD/REVISE/WITHDRAW、依存失効を束縛。元sourceを上書きしない |
| `unresolved_parts / unsupported_parts` | 既存型で安全に保持できる未確定と、native型／作者に載らない必要意味を区別。後者を削ってADOPTしない |
| `snapshot_ref` | 既存canonical JSON規約に従う意味内容identity。schema/profile/admission/adapter版、request/sourceの意味材料、normalized_meaning、claim_mapping、prior/update/inactiveと表現済みunknownを算入。自身のref、providerのusage／finish・所要・実行metadata・raw出力の書式差は算入しない。同sourceでも異なる採用意味・版・更新には異なるref |

`normalized_meaning`は自由なJSONを後段へ無検査で渡すfieldではない。P2の閉じた構造を検証し、既存native語彙への写像と全軸の消費が成立する範囲に限定する。複数claimの同一根拠共有を許しても、別意味を一claimへ潰さない。snapshotは意味の再現性を確保するものであり、解釈の真実性を証明しない。`ADOPT ⇒ unsupported_partsは空`、`unresolved_partsは既存nativeで表現済みのunknownのみ`を拘束する。候補receiptの非意味metadataも保存するが意味identityへ混ぜず、再開時は保存値をそのまま復元してcheckpoint全内容の一致を検査する。

### checkpoint・保存の結合

新checkpointはsource prefix・snapshot ref・有効plan ref・回答更新を一緒に束縛する。旧V1は従来のfield・ID・再導出を保持し、完成済み旧DTOを再生成しない。新profileの再開は同snapshotを復元し、現モデルや現finite parserで意味を差し替えない。同一prefixのADOPT後はimmutable。同prefix／同schemaで別読みのcheckpointを追加・上書きしない。実ANSWERによりprefixが進んだ時だけprior_snapshot_refを持つ次snapshotを作る。

`emlis_thread_service._process`のMEANING_UPDATE payload内へsnapshot全体を保存する案とする。既存`emlis_input_threads.data`には意味profileを別fieldとして保持し、runtime_profileは維持する。source SQLはjsonb payloadを保存可能だが、これだけで保存成功は確定しない。serializer→store→隔離SQL→復元→同checkpoint／DTOの検証が必要。SQL DDL・ACL・RLS・稼働table・公開RPC引数の変更は本限定案に含めない。

非採用評価は既存OPERATION eventのprivate payload内へ`semantic_profile / attempted_source_prefix_ref / prior_active_snapshot_ref / decision / candidate_receipt / reason_codes / unresolved_refs`を保存し、thread dataの`semantic_evaluation_ref`へ結ぶ。新MEANING_UPDATEやsnapshotは作らず、evaluated_prefix_refを新prefixへ進めない。初回priorはnull。回答後のprior snapshotは旧prefixの履歴としてのみ保持し、実ANSWERと未反映理由を残す。新prefixのcurrentな読み・成功本文へ付け替えず、下流へ成功handoffしない。再開時のREAD_NONADOPTEDは保存評価を再読し、勝手な候補再採用をしない。本文失敗後の意味確定と、意味未確定の回答保留を混同しない。raw候補を公開DTOへ返さず、既存events／結果記録の範囲を使い、新しい台帳・保存serviceを増やさない。

P1の2型・P2例28claim/60quote・既存22件の結果は履歴として保持。本案で新たなruntime型・新admission・schema検査・意味採用が成立した件数は0。

<a id="cmee-p3-actual-schema"></a>
## 2026-10-23 — 限定offline Emlisの実型・保存版

本節が実装済みのfield owner。前節の未実装案は提案時の記録。旧`GenerationRequest`／`EmlisThreadControl`／`EmlisMeaningCheckpointV1`のfieldと旧schemaは変更しない。`emlis_semantic_admission.py`に次のprivate型を置き、通常APIで受け付けるfieldは追加しない。

| 実型／版 | field・役割 |
|---|---|
| `SemanticInput` | frozen/slots、`mode,receipt=None,snapshot_json=None,prior_snapshot_json=None`。Engine／prepareのkeyword-only引数。FRESH_CANDIDATEはreceipt必須・既存checkpoint ref禁止、回答時prior必須。RESUME_ADOPTEDはsnapshotのみ |
| `SnapshotCheckpoint(EmlisMeaningCheckpointV1)` | 旧fieldを継承し、`semantic_schema_version=cocolon.cmee.emlis_answer_meaning.v2`、`semantic_profile=emlis_candidate_snapshot.v1`、`semantic_snapshot`（canonical JSON str）、`snapshot_ref`を追加 |
| `SnapshotPreparedMeaning(PreparedEmlisMeaning)` | `semantic_snapshot`と凍結P1材料`semantic_material_json`を追加。既存作者への入力にだけ使用 |
| `SemanticNotAdopted(ValueError)` | `decision`=REJECT/HOLD/UNSUPPORTED、閉じた`reason_code`、private `receipt`。本文の成功へ変換しない |

snapshot schemaは`cocolon.cmee.emlis_semantic_snapshot.v1`。全keyは`schema_version,semantic_profile,admission_version,adapter_version,request_ref,source_prefix_ref,source_bindings,packet,prior_ref,prior_snapshot,receipt,answer_count,question_control,claim_mapping,snapshot_ref`。admission/adapter版は各文字列`1`。packetはP2 proposalのcandidate＋evidence、receiptは元P1診断も含む。source_bindingsはsource_id/version/role/envelope_id/commitment。claim_mappingは候補IDからCMEE導出native IDへの対応。prior_snapshotは過去active意味と累積更新の再構成用に保持する。

snapshot_refはcanonicalな上記意味内容（schema/profile/各版/request/prefix/source_bindings/packet/prior_ref/answer_count/question_control/claim_mapping）のSHA256。receiptのraw JSON書式やusage/時間/provider診断は意味identityから除外し、receiptそのものは保存する。priorはprior_refへ束縛し、再開時は原sourceから各過去prefixを復元して検証。checkpoint IDはprefix＋snapshot refへ束縛する。同prefixを別候補で上書きしない。snapshotは生成された自由strの語彙拡張ではなく、現native enumと既存lexical責務に閉じた読みの固定である。

新thread.dataへsemantic_profileとOFFLINE_CANDIDATE modeを保存し、runtime_profileはq2.free.one_round.v1／q3.plan.sequential.v1のまま。MEANING_UPDATE.payloadの既存jsonbへ新版checkpointを保存する。非採用は既存OPERATION.payloadのstage=SEMANTIC_NOT_ADOPTED、attempted_source_prefix_ref／prior_active_snapshot_ref／decision／reason_codes／candidate_receipt（取得未完了ならnull）を持つ。READ_NONADOPTEDは新公開modeや型を作らず、この保存評価を既存service内で再読する分岐として実装した。新table/column/migration、公開DTO fieldは0。

## 2026-10-23 — adapter2実装版と、次のprivate binding案

実装済み：現profile/snapshot/checkpoint版とadmission_version=1は不変。FRESH adapter_version=2、RESUME許可は保存1/2。裸時点語/はだけのlexical範囲を修復し、も/程度/本当は/否定/全raw claimは保持。意味identityにadapter版を含め、旧1は全outcome再現。前節の「両版とも1」は初版の履歴。

以下は提案作成時のPROPOSED_ONLY。現在は同追加範囲を承認済みで、後続の実装型節を参照。[次限定案](01_shared_kernel_and_runtime_contracts.md#cmee-targeted-unknown-action-proposal)の型owner。profile=emlis_candidate_snapshot.v2、snapshot=cocolon.cmee.emlis_semantic_snapshot.v2、checkpoint=cocolon.cmee.emlis_answer_meaning.v3を別にし、そのadmission/adapterは各1から開始する案。旧profile/旧型は維持。dispatch keyは(profile,snapshot schema,admission版,adapter版)の組とし、新profileのadapter1は旧profileのadapter2時点修復を基底にする。同番号を旧実装へのaliasにしない。新snapshotは現packet/source/control/priorにnative_bindingsを加え全体を意味identityへ含める。

| 新profile専用private型案 | 必須field/保持条件 |
|---|---|
| SnapshotSourceSliceBindingV2 | slice_ref,claim_ref,nucleus_ref,source_ref,source_version,native_span_ref,field_path,raw_field_start,raw_field_end,lexical_start,lexical_end,quote,subject_binding,source_entity。field/実span内座標を分離し、OMITTEDと暫定SELFを別保持 |
| SnapshotCaseArgumentBindingV2 | argument_ref,owning_nucleus_ref,written_role,text,source_slice_refs。今回WRITTEN_で/に/を/までだけ。native ArgumentRoleを自由文字列で拡張しない |
| SnapshotPersonStatedUnknownBindingV2 | unknown_ref,statement_nucleus_ref,target_nucleus_refs,origin,dimension,resolution_state,statement_polarity,statement_modality,statement_time_scope,target_time_scope,evidence_slice_refs。PERSON_STATED/JOY_ASPECT/SOURCE_STATEMENT_RETAINED、喜びpast/曖昧さは記述present。SOURCE_EXPLICIT記述/PROVISIONAL読み/UNKNOWN部分を混ぜない |
| SnapshotWrittenLinkBindingV2 | relation_ref,source_type,from_nucleus_ref,to_nucleus_ref,marker_slice_refs,scope_refs,polarity。TE_LINKとjoy→unknown CONCESSIONだけ。teを厳密順序/原因/同時へしない |

P2unknownにはstatement_claim_refがないため、同evidenceのEXPLICIT_UNKNOWN claimが一意に完全一致する場合だけ解決し、複数ならHOLD。targetはactive joyへ束縛。claim→核→graph/componentは明示対応と被覆を確認し、同span同kindを値文字列や候補IDだけで区別しない。P2 listen14:22は原quoteを保持し、native lexical14:21との差は終端「。」に限って型へ記録する。snapshotに格/対象を保存しただけで作者未消費のまま通す案は不採用。内部構成の整合修正を新たな採用範囲拡大へ変えない。

次案の座標はraw_field_*が元field相対、lexical_*が実native spanのnormalized_raw_text相対のUnicode scalar半開区間。UTF-8座標へ直接流用しない。unknown statementの命題はAFFIRMED/ASSERTED_AS_WRITTENで、native uncertaintyの感情方向はneutral/modality uncertainへ対応させる案。原文の明示記述SOURCE_EXPLICIT、主体/対象への読みPROVISIONAL_INTERPRETATION、未確定な側面UNKNOWNを別roleに保持し、喜びや曖昧さをNEGATEDへ書換えない。

新案のsnapshotはclaim/nucleus/sliceまでをhashへ固定し、graph_node_refを含めない。graph IDは現sourceでcheckpointに依存するため、snapshot→checkpoint→graph→snapshotの循環を作らない。checkpoint確定後にprojection ownerがnucleus→graph nodeの明示対応を導出/照合し、component/traceへ渡す。保存再開は同snapshot/checkpointから同対応を再導出する。


## 2026-10-23 — 新profile2の実装型

snapshot schemaは`cocolon.cmee.emlis_semantic_snapshot.v2`、checkpointは`cocolon.cmee.emlis_answer_meaning.v3`、admission/adapter各1。旧profileはFRESH adapter2・保存1/2をそのまま再現する。namespace tupleと全prior edgeの同profileを照合する。native_bindingsは意味hashへ含め、graph IDはhashへ含めない。checkpoint確定後のclaim→nucleus→nodeとnative relation→edgeを明示導出し、同span二actionを別核・別nodeとして保持する。

前表の四型を実装した。WrittenLink.relation_refはnative semantic-relation ID、scope_refsは候補上の元scopeを保持。新SnapshotSourceQualifierRowV2はnode_ref／qualifier_refsとsnapshot_ref／checkpoint_ref／四family／nucleus_node_bindings／relation_edge_bindingsを持つ。旧GroundedSourceQualifierRowへnull fieldを足さない。SnapshotBindingConsumptionV2はsnapshot_ref／binding_kind／binding_ref／nucleus_refs／graph_node_refs／graph_edge_refs／source_slice_refs／section／visible_scalar_start/endを持ち、既存artifact private traceへ追加する。範囲はsection相対Unicode scalar半開区間で、source field座標と混ぜない。

新専用SnapshotEvidenceSpanResolverV2は同snapshotから復元した四typed tupleを既存resolverへ渡す内部adapterで、別作者・Engine・runnerではない。source sliceはlisten raw14:22／native lexical14:21を保持し、終端「。」だけを除外。新unknown carrierは声明present/neutral/uncertainと対象joy past/positive/feeling、元evidenceと一意なgraph対応をexact照合する。

原E02の有限文法と既受理event/feelingの併存に閉じる。一般unknown/ACTION、新要素自身の変更・解消・依存削除はHOLD/UNSUPPORTED。旧Q2 cap4では混在更新の5 contributionを提供できず意味保存後BODY_UNAVAILABLEとなる制限を残し、capを緩めない。現在のQ3実serviceでの隔離SQL/RPC保存・中断再開成功と区別する。実モデル／有料推論／重み／学習／本人DB／Render／通常application有効化／公開API・DTO・RN変更／merge／deployは0。限定TECHNICAL_CREDIT、STRUCTURE_MAP_DELTA_PRESENT、product_credit=0／PRODUCT_NOT_CLEAR／正式Product Read0/3／candidate_ready=false／automatic_progression=false。
