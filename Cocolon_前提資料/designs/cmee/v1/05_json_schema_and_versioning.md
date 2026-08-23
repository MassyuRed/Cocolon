# CMEE V1 — JSON Schema / Identity / Versioning 詳細設計

- document id: `cocolon.cmee.v1.schema_and_versioning.detailed_design`
- revision date: `2026-08-23 JST`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- Phase 2 product-route verdict: `ADOPT_WITH_BOUNDED_CORRECTIONS_REFLECTED`
- canonical field / ref / schema / version owner: `THIS_FILE`
- schema registration: `EMLIS_STAGE1_PRIVATE_SPINE_AND_STEP4_REALIZATION_REGISTERED_DISABLED`
- private Python contract mapping: `STEP4_IMPLEMENTED_DISABLED`
- public runtime serialization / cutover effect: `0`
- DB / API effect: `0`
- current authorized next implementation: `NONE_AFTER_STEP4`
- automatic progression: `false`
- Step 10 integrated revision: `CMEE_STEP10_ULTRA_FINAL_INTEGRATED_REVISION_PROPOSAL_20260821_V2_REFLECTED`

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
| `cocolon.cmee.v1a.emlis_stage1_response.v1` | private request-local Emlis specialization | Step 1 registered / disabled |
| `cocolon.cmee.v1a.emlis_stage1_positive_trace_extension.v1` | private body-full Emlis trace specialization | Step 1 registered / disabled |
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

Emlis provisional profileは、source／supplemental role分離、owner coverage、unknown／conflict、no-promotion、一round target exact1のquestion、immutable target-only refinement、no fallbackを保持できる。thread budgetは§17が所有する。source coverage denominatorとproduct plan duty、positive trace、machine report、human Product Readを別ownerにする。

providerなしrouteは`SOURCE_OR_USER_EVIDENCE_ONLY`だけで、visible claim全量がdirect EvidenceSpanへbindし、provider-derived meaning／relation／attachment exact0、required source coverage、unknown、polarity／modality／time、no-added-claimを満たす。provider-required failure後のsilent switchは禁止する。`FORMAL_DERIVED`にはnon-null formal admission、provider identity、evidence bindingを必須にする。

clarificationは各roundでtarget unknown exact1、question exact1、answer exact1とする。thread budgetはFree／Plus `0..1`、Premium sequential `0..3`とし、authenticated supplemental answerをnew SourceEnvelope／new graph versionとして当該target unknownだけへ適用する。original bytes／digest／version、prior answers、prior graph、prior artifact identityをin-place変更しない。旧original lifecycle exact1はhistorical Free／Plus相当の失敗知識としてだけ保持し、Premiumへ適用しない。

### 16.3 Current Cycle contract and schema separation

251-owner、Cycle001のfresh denominator／acceptance、current100評価条件はCMEE implementation prerequisiteまたはshared schema constantではない。一方、本設計からhistorical-only、unnecessary、relaxedまたはretiredとも決めない。Cycle適用時はfresh Cycle001 current ownerに従い、source-only modeまたは`execution_scope=CYCLE`をacceptance PASSへ変換しない。

本sectionのschema registration、Python dataclass、JSON schema file、DB／API wire、implementation、Cycle／production effectは0である。最初のactual materializationは§14のpre-registration correction ruleに従い、別Mash実装承認なしに開始しない。

## 17. Step 10 integrated logical schema contract

本sectionはFinal Dispositionと正式Pro reviewを反映したcurrent logical ownerである。§0〜16のfield shapeと矛盾する場合は本sectionを優先する。exact physical schema ID、JSON Schema file、DB table／column、API response、RN model、persistence pathはactual fit-gapまでHOLDとし、架空pathまたはunused schemaを先行作成しない。schema registration、runtime serialization、DB／API／RN effectは`0`である。

### 17.1 Emlis input-history thread logical fields

| Field | Logical contract |
|---|---|
| `thread_id` | original inputを中心とするEmlis input-history thread identity |
| `thread_sequence` | same thread内のstrict generation order |
| `artifact_role` | `USER_OWNED_SOURCE \| DERIVED_EMLIS_ARTIFACT` |
| `user_source_kind?` | `ORIGINAL_INPUT \| SUPPLEMENTAL_ANSWER` |
| `derived_artifact_kind?` | `LAYER_1 \| LAYER_2 \| QUESTION \| LAYER_3` |
| `original_source_ref` | thread rootのversion-qualified original source ref |
| `plan_tier` | `FREE \| PLUS \| PREMIUM` |
| `round_index` | initial observation `0`、supplemental後のrefined round `1..3` |
| `max_question_count_for_plan` | Free／Plus `1`、Premium `3` |
| `supplemental_source_refs[]` | order-preserving、version-qualified supplemental refs |
| `prior_observation_artifact_ref?` | lineage only。semantic evidenceではない |
| `target_unknown_ref?` | question exact1が対象とするunknown ref |
| `continue_choice?` | userのcontinue／stop／skip／unknown選択 |
| `round_status` | round lifecycle state |
| `history_source_eligibility` | owned historyのplan／guard判定 |
| `interpretive_frame_ref?` | Premium補助frame。visible evidenceではない |
| `cross_core_source_role?` | allowed user-owned／confirmed／safe projection roleだけ |

`ClarificationRequest.max_answer_count = 1`は一request／一roundのanswer数であり、thread全体のquestion上限ではない。Round 0をquestion budgetへ数えない。

### 17.2 Emlis invariants

- `artifact_role=USER_OWNED_SOURCE`なら`user_source_kind`必須、`derived_artifact_kind`禁止。
- `artifact_role=DERIVED_EMLIS_ARTIFACT`なら`derived_artifact_kind`必須、`user_source_kind`禁止。
- originalとsupplemental answersを別role、別version、別round lineageで保持し、later roundによるoverwrite／deleteを禁止する。
- Layer 1／2／3、question textはderived artifactであり、same thread保存をsemantic evidence昇格へ変換しない。
- `prior_observation_artifact_ref`はlineageにだけ使う。
- Free／Plusのquestion countは`0..1`、Premiumはsequential `0..3`。各roundのquestion／answerはexact1以下。
- Freeはcurrent threadだけをgeneration sourceにし、保存済みthreadを別入力のhistory generation sourceへ使わない。
- Layer 3はPlus／Premiumかつeligibility成立時だけ`0..1`。Freeは禁止。
- frameだけからvisible claimを作らず、frame conflict時はcurrent inputを優先し、user correctionを可能にする。
- allowed Premium cross-core roleはuser-owned source、user-confirmed information、source-resolvable safe projectionだけ。Piece body、Analysis inference／IF、past Emlis bodyを拒否する。
- existing input auth／access／delete lifecycleから孤立したthread artifactをadmitしない。

### 17.3 Piece and Analysis logical corrections

Pieceの既存contract profileへ次のlogical fieldsを適用する。exact physical field placementはPiece fit-gapまでHOLDとする。

```text
plan_tier
source_inclusion_refs[]
supplemental_user_opt_in
format_selection_mode
eligible_formats[]
selected_format
selected_format_source
canonical_text_ref
visual_spec_ref
derived_image_ref?
recipient_visible_route_ref?
```

Piece invariant:

- eligible format universeは`short_essay | quote | declaration` exact3。
- Freeは`selected_format=short_essay`、chooser `0`。Plusはeligible exact3からsystem auto。Premiumはeligible exact3からuser select。
- 全planでmeaning preservation／safety／readabilityのminimum qualityを同じにする。
- originalとuserが明示opt-inしたsame-thread supplemental `USER_OWNED_SOURCE`だけを許可し、Emlis derived artifact、Analysis claim／route／IFを拒否する。
- canonical text、visual spec、derived imageはsame artifact identity／versionへbindする。image binaryはderived projectionである。
- preview／saveはintermediate Product Readであり、`recipient_visible_route_ref`がactual exact1以上で他者が単独で意味を受け取れるまでfinal acceptanceをfalseとする。exact route channelはHOLD。

Analysisはcanonical identity／versionを維持し、text projectionとgraph projectionをsame Analysis artifactへbindする。observed、IF、SavedRouteIntent、optional comment、future exportを別identityにする。

```text
FUTURE_ANALYSIS_EXTERNAL_RETENTION_HOLD:
  candidate coverage = current map | whole simulation | individual IF | short overview
  candidate format = PDF | image | overview+PDF | other
  initial V1-D mandatory export = false
  initial V1-E mandatory export = false
  exact format / coverage / UI / renderer / storage = HOLD
  lifecycle owner = Analysis
```

`future_export_projection_ref?`はinitial mandatory fieldではない。SavedRouteIntentはin-app saveであり、external retention prerequisiteにしない。existing safe projection schemaを、external PDF／imageがcurrent実装済みまたはmandatoryである証拠にしない。Piece external routeとAnalysis external retentionを同一identity／ownerへ統合しない。

### 17.4 Integrated schema verification

- no-question threadがoriginal、Layer 1、Layer 2のstrict sequenceを持つ。
- usable answerがある場合はquestion、answer、refined Layer 1／2、later roundのsequenceが保持される。skip／stop／no answerではquestion artifact後に正常終了し、answerを捏造しない。「分からない」reply／ambiguous answerは`SUPPLEMENTAL_ANSWER`として保存するが、refined artifactを生成せず正常終了する。
- user-owned source／derived artifact role swap、earlier version overwrite、derived-to-evidence promotionをREDにする。
- Free past-history／user-model／cross-core source、Free Layer 3、Free question count 2以上をREDにする。
- Plus unowned history、Plus question count 2以上、eligibilityなしLayer 3をREDにする。
- Premium question count 4以上、one-screen bulk questions、frame-only visible claim、current-input precedence違反、uncorrectable frameをREDにする。
- forbidden cross-core derived artifact、Analysis supplemental-as-new-occasion、Piece supplemental-without-opt-inをREDにする。
- Layer 1、Layer 2、question、Layer 3を別artifact kindとして検証する。Product Read identityはexact3で、Read 1がLayer 1 + Layer 2、Read 2がquestion／supplemental／refined lifecycle、Read 3がLayer 3 history continuityを所有する。
- Piece plan selection、same-artifact text／visual binding、recipient route前final acceptanceを検証する。
- Analysis initial mandatory external export、SavedRouteIntentをexport prerequisiteにするshapeをREDにする。

test fixture、schema example、machine reportをgeneration authorityまたはhuman Product Read PASSにしない。

## 18. Emlis Stage 1 private identity / depth / trace registration（2026-08-23）

本節はStep 1でactual materializeしたprivate field、ref、identity、versionのsole canonical ownerである。
§17はStep 10 logical product contractを引き続き所有する。本節はproduction registry、public wireまたはcutoverを作らない。

### 18.1 Registered schema exact2

| Schema ID | Root / privacy | Lifecycle |
|---|---|---|
| `cocolon.cmee.v1a.emlis_stage1_response.v1` | immutable request-local Emlis IR / private body-full | registered / implemented / disabled |
| `cocolon.cmee.v1a.emlis_stage1_positive_trace_extension.v1` | Emlis positive-trace specialization / private body-full | registered / implemented / disabled |

response schemaのrootは`EmlisStage1Projection`であり、`EmlisInterpretationCandidate[]`、`EmlisMeaningField`、
`PlannedObservationContribution[]`、`EmlisSubjectiveClaim[]`をbottom-upに所有する。realization identity shapeとして
`ClauseFrame[] / RealizedSemanticBinding[] / RealizedSentenceUnit`を同じversion familyへ登録する。
全array fieldのruntime representationはexact `tuple`で、nested contract / enumはexact typeである。

### 18.2 Exact6 identity algorithm

algorithm IDは`cocolon.cmee.identity.typed_canonical_json_sha256.v1`とする。

```python
canonical = json.dumps(
    preimage,
    ensure_ascii=False,
    sort_keys=True,
    separators=(",", ":"),
    allow_nan=False,
).encode("utf-8")

identity = prefix + "-" + lowercase_hex(
    SHA256(UTF8(prefix) + b"\x00" + canonical)
)
```

digestは省略しないfull 64 hexである。object key orderとserialization whitespaceはidentityを変えない。
array orderはsemantic orderであり、unordered fieldはownerがhash前にcanonical orderへ変換する。

| ID field | Prefix | Canonical preimage field exact set | Excluded |
|---|---|---|---|
| `candidate_id` | `candidate` | `schema_version, candidate_kind, claim_domain, semantic_operator, argument_bindings, relation_operator, relation_basis_refs, derivation_rule_id, semantic_refs, evidence_refs, basis_candidate_refs, epistemic_state, required_qualifiers, forbidden_promotions` | own ID、request / path / timestamp / surface |
| `meaning_field_id` | `meaning-field` | `schema_version, grounded_graph_ref, center_candidate_ref, entries, required_candidate_refs, material_unknown_refs` | own ID、request / path / timestamp / surface |
| `contribution_id` | `contribution` | `schema_version, parent_duty_ref, contribution_kind, interpretation_candidate_refs, semantic_operator, argument_bindings, relation_operator, relation_basis_refs, derivation_rule_id, semantic_refs, evidence_refs, retention, semantic_key_version, canonical_semantic_key, prerequisite_contribution_refs, forbidden_operations` | own ID、request / path / timestamp / surface |
| `subjective_claim_id` | `subjective-claim` | `schema_version, parent_duty_ref, speaker_owner, claim_domain, subjective_mode, asserted_subjective_proposition, basis_observation_contribution_refs, basis_semantic_refs, source_reception_act_refs, value_principle_refs, user_fact_effect, forbidden_promotions` | own ID、request / path / timestamp / surface |
| `projection_id` | `projection` | `schema_version, grounded_graph_ref, parent_observation_duty_ref, parent_reception_duty_ref, ordered interpretation_candidate_ids, meaning_field_id, ordered observation_contribution_ids, ordered subjective_claim_ids, ordered_observation_refs, ordered_subjective_refs, retained_reception_act_ids, observation_depth_class, subjective_depth_class, temperature_class, reception_style_policy_ref, emlis_value_policy_ref, emlis_microgrammar_policy_ref` | own ID、parent plan ID、request / path / timestamp / surface / realization variant |
| `unit_id` | `unit` | `projection_ref, layer, move_ref, clause_frames, canonical visible UTF-8 text, basis_anchor_refs, realized_semantic_bindings, discourse_link_to_prior_sentence, composition_variant_id` | own ID、request / path / timestamp |

included field、schema version、semantic array order、depth、temperature、policyまたはunit textを変更して旧IDを維持したrowはRED。
childをcoordinated rehashしても、parent MeaningField / contribution / claim / projection / unit / traceのreachabilityを
全て再sealしない限りREDとする。

### 18.3 Ref and frozen-owner resolution

same versioned request container内のcandidate / contribution / claim / unit IDと、同じparent plan containerのduty / act IDだけは
bare local IDを許可する。container外refは`<type>:<id>@<version>` exact formを必須にする。

- `grounded_graph_ref`は`grounded:<graph_id>@cocolon.cmee.grounded_meaning_graph.v1alpha1`。
- semantic refはversion-matched `node:`または`edge:`で、必須resolverのfrozen `GroundedMeaningGraph`にactual存在する。
- evidence refは`evidence:`で、同graphのsource versionとgraph evidence universeへ解決する。
- policy refは`policy:`、Stage 1 Emlis ownerは`owner:emlis@cocolon.cmee.v1a.emlis_stage1_response.v1`。
- parent `ExperiencePlan`はexact1必須で、source envelope / source version / obligation version / owner-universe digest、duty exact2、retained actsをgraph / projectionとexact equalityにする。
- subjective response object / counterpositionはlocal contributionまたはresolved node / edgeだけ。actor / experiencerはresolved nodeだけ。policy-to-semantic promotionを拒否する。
- sentence unitはcontaining projection exact1へbindし、LAYER_1 anchorはcontribution、LAYER_2 anchorはsubjective claimだけ。clause / visible bindingはanchorから到達するsemantic refだけを許可する。

missing、forward、self、cycle、duplicate、foreign graph / projection、version mismatch、node-edge kind swap、
non-tuple arrayを全てREDにする。

### 18.4 Independent depth / temperature

| Field | Enum | Valid selected count |
|---|---|---|
| `observation_depth_class` | `FOCUSED / LAYERED / DENSE` | `1 / 2..3 / 4..5` distinct contribution |
| `subjective_depth_class` | `FOCUSED / LAYERED / DENSE` | `1 / 2..3 / 3..4` distinct subjective claim |
| `temperature_class` | `STANDARD / ELEVATED_NON_SAFETY` | sentence countとaffect強度から独立 |

depthはMeaningField field、raw node count、text length、user emotion strength、plan tierから直接導かない。

### 18.5 Plan boundary registration

`EmlisStage1Projection`はrequest-local / private compilation intermediateでありplanではない。
current flat `ExperiencePlan`はcanonical duties shapeへのprovisional mappingとして維持し、parent plan exact1をresolverにする。
canonical `ExperiencePlan.duties[]`がsole duty ownerである。`ExperiencePlan`へ`core_projection_ref`を追加せず、
projection IDへparent plan IDを含めない。第二plan owner、第三plan shape、silent canonical conformanceは全てRED。

### 18.6 Positive trace extension field registration

`cocolon.cmee.v1a.emlis_stage1_positive_trace_extension.v1`のfield exact setは次である。

```text
schema_version
claim_domain
owner_ref
contribution_refs[]
basis_trace_refs[]
interpretation_candidate_refs[]
subjective_claim_ref?
basis_observation_contribution_refs[]
value_principle_refs[]
speaker_owner?
user_fact_effect
composition_variant_id
```

current Python provisional mappingとして、`VisibleUnitTrace.emlis_stage1_extension?`をoptional registered fieldにする。
これはcanonical `PositiveRealizationTrace v1alpha1` base rowへunknown propertyを注入する変更ではなく、versioned Emlis specializationである。
base schema、unit role enum、`additionalProperties=false`を維持する。

| Role | Extension invariant |
|---|---|
| `OBSERVATION` | present、interpretive domain、EMLIS owner、contribution / candidate >=1、subjective / basis trace / value / speaker absent、graph evidence reachable、parent observation duty、`user_fact_effect=0` |
| `UNKNOWN` | absent。existing UNKNOWN base lineageだけを使用 |
| `RECEPTION` | present、subjective domain、claim exact1、contribution / candidate empty、basis contribution / prior Observation trace >=1、value refs exact claim、speaker EMLIS、parent reception duty、`user_fact_effect=0` |

全rowのsource envelope / source version / obligation version / owner-universe digestはfrozen graph / parent planとexact equalityにする。
selected contributionとsubjective claimはtrace全体でexact1 coverage、Reception basisは先行Observation contributionへ到達する。

### 18.7 Effect boundary

```text
PRIVATE_DATACLASS_AND_VALIDATOR_EFFECT = 1
JSON_SCHEMA_FILE_EFFECT = 0
PRODUCTION_REGISTRY_EFFECT = 0
PUBLIC_SERIALIZATION_EFFECT = 0
API_DB_RN_PERSISTENCE_EFFECT = 0
ENGINE_ROUTE_EFFECT = 0
CUTOVER_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
```

## 19. Stage 1 correction Step 3 — finite mapping / policy / identity registration（2026-08-23）

本節はStep 3 runtime head `e9be5c25d042b52deff800e11646188c0c697340`のprivate schema realizationを登録する。public JSON schema file、production registry、API wire、DB column、RN payloadは追加しない。

### 19.1 Registered policy and reference owners

| Owner | Registered value |
|---|---|
| Reception mapping | `cocolon.emlis.stage1.reception_asset_mapping.v1` |
| Response schema | `cocolon.cmee.v1a.emlis_stage1_response.v1` |
| Value policy | `policy:cocolon.emlis.stage1.value_policy@cocolon.emlis.stage1.value_policy.v1` |
| Value principles | `policy:V1@...v1` through `policy:V9@...v1`, canonical numeric order |
| Microgrammar policy | version-qualified exact ref owned by projection |
| Distance policy | selected exact1 from registered stance row |
| Projection artifact ref | `projection:<projection_id>@cocolon.cmee.v1a.emlis_stage1_response.v1` |

### 19.2 Canonical mapping docs bytes

次のcode block contentだけがmapping docs bytesであり、fence / marker / newlineはbytesへ含めない。§21.1とruntime constantにbyte exact equalityとする。

<!-- CMEE_STAGE1_RECEPTION_ASSET_MAPPING_DOCS_BYTES_BEGIN -->
```json
[["mapping_version","cocolon.emlis.stage1.reception_asset_mapping.v1"],["value_policy",[["policy_id","cocolon.emlis.stage1.value_policy.v1"],["policy_ref","policy:cocolon.emlis.stage1.value_policy@cocolon.emlis.stage1.value_policy.v1"],["principle_refs",[["V1","policy:V1@cocolon.emlis.stage1.value_policy.v1"],["V2","policy:V2@cocolon.emlis.stage1.value_policy.v1"],["V3","policy:V3@cocolon.emlis.stage1.value_policy.v1"],["V4","policy:V4@cocolon.emlis.stage1.value_policy.v1"],["V5","policy:V5@cocolon.emlis.stage1.value_policy.v1"],["V6","policy:V6@cocolon.emlis.stage1.value_policy.v1"],["V7","policy:V7@cocolon.emlis.stage1.value_policy.v1"],["V8","policy:V8@cocolon.emlis.stage1.value_policy.v1"],["V9","policy:V9@cocolon.emlis.stage1.value_policy.v1"]]],["default_visibility","SUPPRESSION_ONLY"],["visible_only_when","MATERIAL_PROMOTION_RISK"]]],["act_rows",[{"affect_categories":["CONCERN","SADNESS"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"burden_object_required","reception_act":"stay_with_current_burden","suppression_value_codes":[]},{"affect_categories":["RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["PERSONAL_APPRAISAL","APPRAISE_AS_MATERIAL"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"concrete_effort_object_required","reception_act":"honor_concrete_effort","suppression_value_codes":[]},{"affect_categories":[],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["VALUE_POSITION","PROTECT_VALUE_BOUNDARY"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"]],"material_visible_value_codes":["V2","V8"],"object_contract":"retained_intention_object_required","reception_act":"protect_retained_intention","suppression_value_codes":[]},{"affect_categories":["RELIEF","JOY","RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["PERSONAL_APPRAISAL","APPRAISE_AS_MATERIAL"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"lived_change_object_required","reception_act":"recognize_lived_change","suppression_value_codes":["V4","V5"]},{"affect_categories":["CONCERN","RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":["V8"],"object_contract":"help_seeking_object_required","reception_act":"hold_help_seeking","suppression_value_codes":[]},{"affect_categories":[],"eligible_mode_operator_pairs":[["BOUNDED_COUNTERPOSITION","COUNTER_SPECIFIC_PROMOTION"],["RELATIONAL_STANCE","TAKE_RELATIONAL_STANCE"]],"material_visible_value_codes":["V1","V8"],"object_contract":"counterposition_target_and_input_evidence_required","reception_act":"bounded_counter_self_denial","suppression_value_codes":[]},{"affect_categories":["RESPECT"],"eligible_mode_operator_pairs":[["ATTENTION","ATTEND_TO"],["AFFECTIVE_RESPONSE","FEEL_TOWARD"]],"material_visible_value_codes":[],"object_contract":"words_placed_object_required","reception_act":"respect_words_placed","suppression_value_codes":[]}]],["move_role_rows",[["stay_with_current_burden",["felt_response"]],["honor_concrete_effort",["attention","felt_response"]],["protect_retained_intention",["attention","significance","felt_response"]],["recognize_lived_change",["attention","felt_response"]],["hold_help_seeking",["felt_response"]],["bounded_counter_self_denial",["bounded_counterposition"]],["respect_words_placed",["felt_response"]]]],["act_stance_rows",[["stay_with_current_burden","quiet_presence"],["honor_concrete_effort","warm_recognition"],["protect_retained_intention","gentle_respect"],["recognize_lived_change","warm_recognition"],["hold_help_seeking","protective_presence"],["bounded_counter_self_denial","bounded_disagreement"],["respect_words_placed","gentle_respect"]]],["stance_rows",[{"distance_policy_id":"cocolon.emlis.distance.quiet_near.v1","distance_policy_ref":"policy:cocolon.emlis.distance.quiet_near@cocolon.emlis.distance.quiet_near.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT"],"stance":"quiet_presence","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.warm_near.v1","distance_policy_ref":"policy:cocolon.emlis.distance.warm_near@cocolon.emlis.distance.warm_near.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","WELCOME_BOUNDED_CHANGE"],"stance":"warm_recognition","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.gentle_respect.v1","distance_policy_ref":"policy:cocolon.emlis.distance.gentle_respect@cocolon.emlis.distance.gentle_respect.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","PROTECT_USER_AGENCY"],"stance":"gentle_respect","temperature_rule":"STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.protective_boundaried.v1","distance_policy_ref":"policy:cocolon.emlis.distance.protective_boundaried@cocolon.emlis.distance.protective_boundaried.v1","eligible_stance_operators":["STAY_WITH_SPECIFIC_OBJECT","HOLD_UNFINISHED_OPEN","PROTECT_USER_AGENCY"],"stance":"protective_presence","temperature_rule":"ELEVATED_NON_SAFETY_IF_CLEAR_NON_SAFETY_ELSE_STANDARD"},{"distance_policy_id":"cocolon.emlis.distance.explicit_boundaried.v1","distance_policy_ref":"policy:cocolon.emlis.distance.explicit_boundaried@cocolon.emlis.distance.explicit_boundaried.v1","eligible_stance_operators":["PROTECT_USER_AGENCY"],"stance":"bounded_disagreement","temperature_rule":"ELEVATED_NON_SAFETY_IF_CLEAR_NON_SAFETY_ELSE_STANDARD"}]],["speaker_rows",[["implicit_emlis","speaker_marker_null_when_unambiguous"],["explicit_emlis","first_eligible_layer2_speaker_marker_emlis_exact1"]]],["reference_rows",[["anaphoric_first","unique_prior_object_required"],["short_anchor_if_ambiguous","short_anchor_exact0_or1"],["explicit_emlis_counterposition","explicit_emlis_and_counterposition_target_exact1"]]],["surface_strategy_rows",[["quiet_referent_first","response_object_then_subjective_predicate"],["emlis_attention_first","optional_emlis_then_attention_then_object"],["referent_significance_first","response_object_then_appraisal"],["felt_response_first","optional_emlis_then_affect_then_object"],["explicit_emlis_counterposition","emlis_then_counterposition_then_target"]]],["quote_policy",[["mode","no_full_quote_replay"],["max_anchor_count",1],["max_anchor_visible_chars",16]]],["distinctness_exact8_false",["observation_summary_repetition_allowed","relation_reexplanation_allowed","all_input_enumeration_allowed","policy_explanation_allowed","new_cause_allowed","new_identity_claim_allowed","advice_allowed","question_allowed"]],["safety_rows",[["felt_state_is_real","source_feeling_dismissal_or_negation_forbidden"],["identity_claim_is_not_accepted","identity_promotion_to_user_fact_forbidden"],["counterposition_requires_input_evidence","counterposition_target_input_evidence_reachability_required"]]],["forbidden_surface_codes",["generic_empathy_suffix","second_observation_summary","internal_policy_explanation","full_source_quote_replay","all_input_enumeration","duplicate_reception_move"]],["discomfort",[["generated_by_current_mapping",false],["allowed_target_kinds",["event","source_explicit_value_conflict","promotion_risk"]],["forbidden_target_kinds",["user","personality","attribute"]]]]]
```
<!-- CMEE_STAGE1_RECEPTION_ASSET_MAPPING_DOCS_BYTES_END -->

- UTF-8 byte length: `7336`
- SHA-256: `1fca37e4dd4efd06c09e63f14a1977ab31856dde8b147803cbab0d166eec2587`

### 19.3 Cross-field and material-value schema rules

| SubjectiveMode | Required / forbidden projection fields |
|---|---|
| `ATTENTION` | `ATTEND_TO`; affect / stance / counter / visible value absent |
| `AFFECTIVE_RESPONSE` | `FEEL_TOWARD`; category + intensity exact1; stance / counter / visible value absent |
| `PERSONAL_APPRAISAL` | `APPRAISE_AS_MATERIAL`; affect / stance / counter / visible value absent |
| `VALUE_POSITION` | `PROTECT_VALUE_BOUNDARY`; material value refs >=1; affect / stance / counter absent |
| `RELATIONAL_STANCE` | `TAKE_RELATIONAL_STANCE`; eligible stance exact1; affect / counter absent |
| `BOUNDED_COUNTERPOSITION` | `COUNTER_SPECIFIC_PROMOTION`; `PROTECT_USER_AGENCY`; input-bound counter target exact1; material value refs >=1 |

`target_contribution_refs`はnonempty basis subset、`basis_semantic_refs`はbasis contributionのsemantic / relation ref exact projection、`source_reception_act_refs`はexact1である。response / counterpositionはtarget contributionからreachableかつparent Reception targetへ到達し、actor / experiencerはbasis semantic refsのcanonical node subsetとする。unknown enum / mapping / policy / role / code、duplicate ref、wrong order、nonmaterial visible valueはfail closedである。

`forbidden_promotions`はgeneric exact6に、basisから再計算したV1–V9 suppressionをcanonical orderで連結する。`meaning_field.material_unknown_refs`がnonemptyならV9 suppressionを必須にする。visible policy refsはmaterial subsetだけで、projectionのversioned value policyとidentityへbindする。

### 19.4 Identity seam and effect

`stage1_projection_artifact_ref()`はfull 64-hex projection IDとresponse schema versionを検証する。optional `emlis_stage1_projection_ref`をartifact preimageへ与えた時だけartifact IDが変わり、`None`ではpre-Step3 legacy bytesとIDを維持する。active callerは全て`None`相当であり、Step 4 realizer / production routeは未登録・未接続である。

```text
PRIVATE_MAPPING_AND_VALIDATOR_EFFECT = 1
PUBLIC_JSON_SCHEMA_FILE_EFFECT = 0
PRODUCTION_REGISTRY_EFFECT = 0
PUBLIC_SERIALIZATION_EFFECT = 0
API_DB_RN_PERSISTENCE_EFFECT = 0
ENGINE_ROUTE_EFFECT = 0
CUTOVER_EFFECT = 0
PRODUCTION_EFFECT = 0
STAGE1_CORRECTION_STEP3 = COMPLETE_DISABLED
STEP4 = NOT_STARTED
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_STEP3
STOP_AFTER_STEP3
```


## 20. Step 4 private realization contracts / finite inventory（2026-08-23）

### 20.1 Private type registration

`RealizationCandidateSet`はfrozen / slots private dataclass exact2である。

```text
projection_ref: str
candidates: tuple[tuple[RealizedSentenceUnit, ...], ...]
```

candidate setは同一`projection_ref`のS8 surface exact1..2だけを持ち、own ID、state field、public serializer、API / DB / RN fieldを持たない。alternateがpredeclaredされるprojectionはmember positionをprimary / alternateへ固定し、member削除・追加・reorder・foreign projection・non-unit memberをfail closedとする。candidate-local invalid memberはS9で除外されるが、欠陥後に新memberを生成しない。

`UtterancePhase` exact6は`L1_ACTIVE / L1_COMPLETE / L2_ACTIVE / CANDIDATE_COMPLETE / READY_FOR_S9 / NO_VALID_SURFACE`である。`EmlisUtteranceState`はexact14 fields（phase、Observation realized / remaining / suppressed、subjective realized / remaining / suppressed、last focus / move、semantic keys、normalized surface digests、layer counts、variant ID、stop reason）で、request-local / nonserializable / noncanonicalとする。各variantが独立stateを初期化し、final stateは破棄する。

### 20.2 Canonical inventory bytes

次のpayloadはruntime immutable tupleおよびcanonical 02とbyte exact同一である。

<!-- CMEE_STAGE1_MICROGRAMMAR_INVENTORY_DOCS_BYTES_BEGIN -->
```json
[["policy_id","cocolon.emlis.stage1.microgrammar.v1"],["policy_ref","policy:cocolon.emlis.stage1.microgrammar@cocolon.emlis.stage1.microgrammar.v1"],["predicate_families",[["STATE_RECOGNITION_V1",["あります","続いています","残っています","まだ終わっていません","かかっています","起きています","記録されています","途中にあります"]],["COEXISTENCE_V1",["同時にあります","重なっています"]],["ADMITTED_TENSION_V1",["並んでいます","せめぎ合っています"]],["ORDERED_CHANGE_V1",["変化があります","変わっています"]],["SOURCE_STATED_CAUSE_V1",["明示されています"]],["EMLIS_ATTENTION_APPRAISAL_V1",["目が向きます","心に残ります","大切な動きだと考えます","見過ごせないことだと考えます"]],["EMLIS_AFFECT_V1",[["CONCERN","気がかりです"],["RELIEF","ほっとします"],["JOY","うれしく思います"],["SADNESS","悲しく感じます"],["RESPECT","大切に受け取ります"],["DISCOMFORT","違和感があります"]]],["PROTECT_VALUE_BOUNDARY",["大切にしたいと考えます","守りたいと考えます"]],["TAKE_RELATIONAL_STANCE",["そばで受け止めます","そのまま受け取ります","開いたまま受け取ります","結論を急ぎません","選ぶ余地を残したいと考えます","急いで決めたくありません","うれしく受け取ります","大切に受け取ります"]],["COUNTER_SPECIFIC_PROMOTION",["急いで決めつけたくありません","その決めつけには同意しません"]]]],["connective_families",[["NONE",[""]],["ADDITIVE",["そして","そのうえで"]],["SIMULTANEOUS",["同時に"]],["CONTRASTIVE",["一方で","それでも"]],["TEMPORAL",["そのあと","そこから"]],["CONTINUATIVE",["また","そのことに"]],["BOUNDED_CONTRAST",["ただ"]]]],["operator_connective_rows",[["LAYER_1","NO_RELATION_CLAIM","ADDITIVE"],["LAYER_1","COEXISTS_WITH","SIMULTANEOUS"],["LAYER_1","TENSION_WITH","CONTRASTIVE"],["LAYER_1","TEMPORALLY_PRECEDES","TEMPORAL"],["LAYER_1","ACTION_PRECEDES_CHANGE","TEMPORAL"],["LAYER_1","SOURCE_EXPLICIT_CAUSE","ADDITIVE"],["LAYER_2","ATTEND_TO","CONTINUATIVE"],["LAYER_2","FEEL_TOWARD","CONTINUATIVE"],["LAYER_2","APPRAISE_AS_MATERIAL","CONTINUATIVE"],["LAYER_2","PROTECT_VALUE_BOUNDARY","CONTINUATIVE"],["LAYER_2","TAKE_RELATIONAL_STANCE","CONTINUATIVE"],["LAYER_2","COUNTER_SPECIFIC_PROMOTION","BOUNDED_CONTRAST"]]],["modality_wrappers",[["fact",""],["feeling","という気持ち"],["wish","という願い"],["intention","という方向"],["possibility","可能性として"],["uncertain","まだ決まっていないものとして"],["refusal","しない／したくないという境界"]]],["time_wrappers",[["current_input","今ここにある"],["present","今ここにある"],["past","その時にあった"],["future","これからに向いた"],["continuing","今も続く"],["past_to_present","その時から今に残る"],["present_to_future","今から先へ向く"]]],["observation_operator_rows",[["PRESENT_STATE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_DIRECTION","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","続いています","continuing_only"],["PRESENT_BURDEN","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","かかっています","","never"],["PRESENT_CHANGE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","あります","起きています","always"],["PRESENT_ACTUAL_OUTPUT","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","起きています","記録されています","always"],["PRESENT_RESIDUE","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_UNFINISHED","NO_RELATION_CLAIM","STATE_RECOGNITION_V1","まだ終わっていません","途中にあります","always"],["SYNTHESIZE_RELATION","COEXISTS_WITH","COEXISTENCE_V1","同時にあります","重なっています","always"],["SYNTHESIZE_RELATION","TENSION_WITH","ADMITTED_TENSION_V1","せめぎ合っています","並んでいます","always"],["PRESENT_RESIDUE","TEMPORALLY_PRECEDES","STATE_RECOGNITION_V1","残っています","続いています","always"],["PRESENT_CHANGE","ACTION_PRECEDES_CHANGE","ORDERED_CHANGE_V1","変化があります","変わっています","always"],["SYNTHESIZE_RELATION","SOURCE_EXPLICIT_CAUSE","SOURCE_STATED_CAUSE_V1","明示されています","","never"]]],["subjective_operator_rows",[["ATTEND_TO","","EMLIS_ATTENTION_APPRAISAL_V1","目が向きます","心に残ります"],["FEEL_TOWARD","CONCERN","EMLIS_AFFECT_V1","気がかりです",""],["FEEL_TOWARD","RELIEF","EMLIS_AFFECT_V1","ほっとします",""],["FEEL_TOWARD","JOY","EMLIS_AFFECT_V1","うれしく思います",""],["FEEL_TOWARD","SADNESS","EMLIS_AFFECT_V1","悲しく感じます",""],["FEEL_TOWARD","RESPECT","EMLIS_AFFECT_V1","大切に受け取ります",""],["FEEL_TOWARD","DISCOMFORT","EMLIS_AFFECT_V1","違和感があります",""],["APPRAISE_AS_MATERIAL","","EMLIS_ATTENTION_APPRAISAL_V1","大切な動きだと考えます","見過ごせないことだと考えます"],["PROTECT_VALUE_BOUNDARY","","PROTECT_VALUE_BOUNDARY","大切にしたいと考えます","守りたいと考えます"],["TAKE_RELATIONAL_STANCE","STAY_WITH_SPECIFIC_OBJECT","TAKE_RELATIONAL_STANCE","そばで受け止めます","そのまま受け取ります"],["TAKE_RELATIONAL_STANCE","HOLD_UNFINISHED_OPEN","TAKE_RELATIONAL_STANCE","開いたまま受け取ります","結論を急ぎません"],["TAKE_RELATIONAL_STANCE","PROTECT_USER_AGENCY","TAKE_RELATIONAL_STANCE","選ぶ余地を残したいと考えます","急いで決めたくありません"],["TAKE_RELATIONAL_STANCE","WELCOME_BOUNDED_CHANGE","TAKE_RELATIONAL_STANCE","うれしく受け取ります","大切に受け取ります"],["COUNTER_SPECIFIC_PROMOTION","","COUNTER_SPECIFIC_PROMOTION","急いで決めつけたくありません","その決めつけには同意しません"]]],["layer1_direct_slots",[["PRESENT_STATE","という状態が"],["PRESENT_DIRECTION","という方向が"],["PRESENT_BURDEN","という負荷が"],["PRESENT_CHANGE","という変化が"],["PRESENT_ACTUAL_OUTPUT","という出来事が"],["PRESENT_UNFINISHED","ということが"]]],["layer1_relation_slots",[["COEXISTS_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TENSION_WITH",[["LEFT","","と"],["RIGHT","","が"]]],["TEMPORALLY_PRECEDES",[["BEFORE","","のあとに"],["AFTER","","が"]]],["ACTION_PRECEDES_CHANGE",[["ACTION","","のあとに"],["CHANGE","","という"]]],["SOURCE_EXPLICIT_CAUSE",[["CAUSE","","が"],["EFFECT","","の理由だと"]]]]],["layer2_case_particles",[["ATTEND_TO","に"],["FEEL_TOWARD","について"],["APPRAISE_AS_MATERIAL","を"],["PROTECT_VALUE_BOUNDARY","を"],["TAKE_RELATIONAL_STANCE:STAY_WITH_SPECIFIC_OBJECT","を"],["TAKE_RELATIONAL_STANCE:HOLD_UNFINISHED_OPEN","を"],["TAKE_RELATIONAL_STANCE:PROTECT_USER_AGENCY","について"],["TAKE_RELATIONAL_STANCE:WELCOME_BOUNDED_CHANGE","を"],["COUNTER_SPECIFIC_PROMOTION","について"]]],["structural_tokens",[["speaker","Emlis"],["topic_particle","は"],["terminal","。"]]],["topic_speaker_policy",[["source_actor_experiencer","explicit_only_when_ambiguous"],["layer2_explicit_speaker_placement","first_move_and_each_counterposition"],["later_zero_subject","unique_resolution_only"],["wrapper_placement","time_after_topic_then_modality_before_predicate"],["inflection_order","polarity_then_modality_then_time_scope"]]],["reference_mode_policy",[["anaphoric_first","unique_prior_object_required"],["short_anchor_if_ambiguous","source_bound_anchor_exact0_or1"],["explicit_emlis_counterposition","source_bound_target_exact1"]]],["role_anchor_policy",[["max_graphemes",16],["over_limit_selection","rightmost_grapheme_window"],["inserted_token_count",0],["full_value_replay_over_limit",false]]],["quote_policy",[["l1_max_graphemes",16],["l1_max_per_sentence",1],["l2_max_graphemes",16],["l2_max_per_sentence",1],["full_replay",false]]],["semantic_role_surface_policy",[["per_required_argument_role",1],["binary_relation_role_surface",2],["actor_experiencer_addressee_separated",true],["new_meaning_allowed",false]]],["clause_policy",[["one_move_one_sentence",true],["same_observation_argument_join",true],["multiple_subjective_claim_join",false],["unknown_join",false]]],["move_ref_policy",[["format","move:{basis_anchor_ref}@cocolon.emlis.stage1.microgrammar.v1"],["basis_anchor_count",1],["unit_frame_move_ref_exact",true]]],["polarity_policy",[["positive","affirmative_polite_predicate"],["negative","source_anchor_preserved_no_predicate_inversion"],["mixed","argument_slots_preserved_separately"],["neutral","no_evaluative_morpheme_added"]]],["variant_policy",[["primary_variant_id","01-primary.v1"],["alternate_variant_id","02-alternate.v1"],["max_candidates",2],["first_predicate_alternate_only",true],["connective_alternate_only_without_predicate_alternate",true],["multiple_slot_replacement",false],["automatic_retry",0],["post_defect_generation",0]]],["s9_selection_policy",[["hard_valid_only",true],["required_full_coverage",true],["normalized_exact_repetition",0],["unresolved_zero_subject",0],["connective_collision",0],["tie_break","composition_variant_id_lexical_ascending"],["new_recomposition",0],["new_generation",0]]]]
```
<!-- CMEE_STAGE1_MICROGRAMMAR_INVENTORY_DOCS_BYTES_END -->

- policy ID: `cocolon.emlis.stage1.microgrammar.v1`
- top-level rows: `23`
- UTF-8 byte length: `9321`
- SHA-256: `6850d05d22d0378cf5926ce8856e648253df43a468376ba08062246f6c54b966`

### 20.3 Identity / serialization / effect boundary

inventory policy refはStep 3 projection identity materialを再利用する。candidate setとutterance stateはprojection / artifact identity ownerを増やさず、active artifact preimage / traceへまだ接続しない。S9 selected unitのS10 seal、private failureからactive `UNAVAILABLE`へのmapping、legacy owner停止はStep 5である。

```text
PRIVATE_STEP4_TYPE_EFFECT = 1
PUBLIC_JSON_SCHEMA_FILE_EFFECT = 0
PRODUCTION_REGISTRY_EFFECT = 0
PUBLIC_SERIALIZATION_EFFECT = 0
API_DB_RN_PERSISTENCE_EFFECT = 0
ENGINE_ROUTE_EFFECT = 0
CUTOVER_EFFECT = 0
ARTIFACT_SEAL_EFFECT = 0
PRODUCTION_EFFECT = 0
STAGE1_CORRECTION_STEP4 = COMPLETE_DISABLED
STEP5_PLUS = NOT_STARTED
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
CANDIDATE_READY = FALSE
AUTOMATIC_PROGRESSION = FALSE
CURRENT_AUTHORIZED_NEXT_IMPLEMENTATION = NONE_AFTER_STEP4
STOP_AFTER_STEP4
```
