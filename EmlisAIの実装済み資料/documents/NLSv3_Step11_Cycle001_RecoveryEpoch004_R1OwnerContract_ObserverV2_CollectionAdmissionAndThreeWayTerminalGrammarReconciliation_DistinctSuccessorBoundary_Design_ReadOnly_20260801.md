# NLS v3 Step 11 Cycle001 Recovery Epoch004

## R1 owner-contract observer-v2 collection admission / three-way terminal grammar reconciliation / distinct successor boundary Design Result

Date: 2026-08-01  
Repository scope: `MassyuRed/Cocolon`, `MassyuRed/mashos-api`  
Authority scope: `DESIGN_ONLY`  
Automatic progression: `false`

---

## 0. Approved authority and completion condition

Mash様が承認したauthorityは次です。

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_R1_OWNER_CONTRACT_CURRENT_ONE_SHOT_AUTHORITY_CLOSED_CONSUMED_TERMINAL_R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP_CURRENT_RESULT_IMMUTABLE_NONCREDIT_FULL_R1_RESULT_UNKNOWN_PRESERVED_NO_RETROACTIVE_REPARSE_RECLASSIFICATION_OR_CREDIT_CHILD_STRUCTURED_EVIDENCE_SESSIONSTART_EXACT1_COLLECTION_FINISH_EXACT1_COLLECTED_NODE_IDS_EXACT_SINGLE_ADMITTED_NODE_EXACT1_SETUP_PASS_CALL_FAIL_TEARDOWN_PASS_EXACT1_EXACT1_EXACT1_CALL_PHASE_R1_STRUCTURED_TERMINAL_EVENT_OWNER_IMPLEMENTATION_ABSENT_RED_SIGNATURE_EXACT1_SESSIONFINISH_EXACT1_EXIT1_PRIOR_OBSERVER_V1_EXACT_NODEID_PREDICATE_MATCHING_TARGET_MODULE_COLLECT_REPORTS_EMPTY_PRESERVED_AS_DIAGNOSTIC_FACT_ONLY_DISTINCT_OBSERVER_V2_AND_CONTROLLER_TERMINAL_GRAMMAR_RECONCILIATION_DESIGN_ONLY_COLLECTION_ADMISSION_V2_DEFINED_BY_SESSIONSTART_EXACT1_COLLECTION_FINISH_EXACT1_AND_COLLECTED_NODE_IDS_EXACTLY_EQUAL_ORDERED_SINGLE_ADMITTED_NATIVE_REPOSITORY_RELATIVE_NODE_ID_TARGET_MODULE_COLLECT_REPORTS_EXCLUDED_FROM_OBSERVER_V2_REQUIRED_SCHEMA_KEYSET_AND_ALL_ADMISSION_CREDIT_AND_TERMINAL_CLASSIFICATION_PREDICATES_PYTEST_COLLECTREPORT_HOOK_NOT_REQUIRED_OBSERVER_V2_BODY_FREE_SCHEMA_KEYSET_EVENT_COUNTS_PHASE_SIGNATURE_EXIT_AND_THREE_WAY_TERMINAL_MAPPING_FROZEN_OWNER_STATIC_DESIGN_VERIFICATION_EXACT1_INDEPENDENT_STATIC_DESIGN_VERIFICATION_EXACT1_PRODUCTION_CODE_ANY_TEST_EXISTING_D1_CHANGE_EXACT0_TARGETED_OR_OTHER_PYTEST_INVOCATION_FRAMEWORK_ENTRY_IMPORT_COLLECTION_NODE_CALL_EXACT0_RUNTIME_DISCOVERY_PROBE_ROLE_SMOKE_REPAIR_REMATERIALIZATION_OR_CHANGE_EXACT0_NETWORK_CHALLENGE_REMOTE_EXECUTION_EXACT0_RETRY_FALLBACK_INTERPRETER_SWITCH_DEPENDENCY_INSTALL_EXACT0_BODY_FREE_DESIGN_RESULT_RECEIPT_HANDOFF_PLAN_LATEST_POSTVERIFICATION_ONLY_STOP_AFTER_DESIGN_DISTINCT_LATER_ONE_SHOT_OBSERVER_V2_EXECUTION_SUCCESSOR_TOKEN_ISSUANCE_EXACT1_DEFINED_INACTIVE_AUTOMATIC_PROGRESSION_FALSE
```

```text
authority token SHA-256:
25a10d1601956c8b15c7b066f7ed5cfe2cbbd1f66f22f1b73446a5531f981dcb

authority consumption:
exact1 DESIGN_ONLY

owner static design verification:
exact1 VALID

independent static design verification:
exact1 VALID

targeted or other pytest invocation:
exact0
```

完了条件は、observer-v2 child schema、collection admission、full causal-RED
predicate、prelaunch precedence、postlaunch three-way mapping、later execution boundaryを
body-free資料へ固定し、Cocolon mainへexact5で反映後にbytesとchanged pathsを再照合して
STOPすることです。

## 1. Immutable current boundary

公開済みobserver-v1 one-shotは次のままです。

```text
authority:
CLOSED_CONSUMED_NONCREDIT

controller terminal:
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP

current full R1:
R1_RESULT_UNKNOWN_STOP

causal RED / GREEN / credit:
NOT_ESTABLISHED / NOT_ESTABLISHED / NOT_ESTABLISHED

historical reparse / reclassification / credit promotion:
exact0 / exact0 / exact0
```

observer-v1 childにはsession start、collection finish、ordered single target node、setup
pass、call fail、teardown pass、expected signature exact1、session finish、exit1がありました。
ただし、v1が`report.nodeid == TARGET_RELATIVE_PATH`に一致するmodule collect-report
passed exact1をrequired predicateへ入れ、そのpredicate-matching listがemptyだったため、
frozen v1 classifierはnoncreditを返しました。全module collect-reportが0だったことは
観測していません。v2を旧childへ適用して結果を変更しません。

## 2. Why observer-v2 is necessary

collection admissionを証明するために必要なのは、pytest sessionが開始し、collectionが
完了し、実際のsession itemsがauthority-bound target node exact1だけであることです。
collector reportのnodeid表現は、この三事実に追加してcreditを強くしません。

したがってv2は、module collector representationへの依存を削除しながら、ordered
single-node admission、phase、signature、exitの厳密性を維持します。これは条件緩和では
なく、collection事実とowner-contract causal RED事実を別predicateへ正規化する修正です。

## 3. Observer-v2 child contract

### 3.1 Schema and hook surface

```text
child schema:
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.r1_owner_contract_private_pytest_event_observation.v2

top-level keyset:
exact15, no optional or extra key

observer hook surface:
exact6
```

Top-level exact15 keys are:

```text
collected_node_ids
expected_signature
expected_signature_exact_match_count
logical_pytest_argv_sha256
phase_reports
pytest_collection_finish_count
pytest_invocation_count
pytest_return_code
pytest_sessionfinish_count
pytest_sessionstart_count
runner_failure
runtest_call_hook_count
schema_version
session_exit_status
target_node_id
```

Normative hook surface exact6 is:

```text
pytest_sessionstart
pytest_collection_finish
pytest_runtest_call
pytest_runtest_makereport
pytest_runtest_logreport
pytest_sessionfinish
```

```text
pytest_collectreport hook:
ABSENT exact0

target_module_collect_reports state / field:
ABSENT exact0
```

`collection_admission_v2`はchild自己申告fieldにせず、controllerが上記の基礎fieldから
再導出します。

### 3.2 Nested exact schemas

Each `phase_reports` row has exact8 keys:

```text
exception_message_sha256
exception_present
exception_type
expected_signature_exact_match
node_id
outcome
phase
was_xfail
```

`runner_failure` has exact3 keys:

```text
class
safe_code
stage
```

Count and exit fields require a JSON integer of the exact value. JSON booleans are rejected even
where a host language would otherwise compare `true == 1`.

### 3.3 Frozen constant bindings

```text
target node ID:
ai/tests/test_emlis_nls_v3_recovery_epoch004_r1_structured_terminal_event_ledger_contract_red.py::test_r1_structured_terminal_event_owner_contract_or_red

target node ID SHA-256:
12c11c21c0b7b5e7818a1a1050002e126a5d2faba2ecc213aeaac4c4fdf9b1d0

expected signature:
R1_STRUCTURED_TERMINAL_EVENT_OWNER_IMPLEMENTATION_ABSENT_RED

expected signature SHA-256:
9611720beabaf4b9bdb191ec76efff91139c607bd3d9a9c792acfbee43e9b649

logical pytest argv SHA-256:
9200bdd6a1a08db5de7a41c9a1783ca239724f1990287f9755ea4b2cf484836a
```

Target equality is the full native repository-relative node ID. Prefix rewrite, basename match,
suffix match, human pytest display parsing are prohibited.

## 4. Collection admission v2

`C` is frozen as exactly the following three typed conditions:

```text
C :=
  pytest_sessionstart_count is JSON integer 1
  AND pytest_collection_finish_count is JSON integer 1
  AND collected_node_ids == [TARGET_NODE_ID]
```

The list comparison is ordered and exact-single. `schema_version`, module collect-report,
phase reports, signature, session finish, pytest exit and process exit are not added to `C`.
They are validated separately by the child envelope or full causal-RED predicate.

## 5. Full causal-RED predicate

`R` is true only when all conditions below are true:

1. Child result is a JSON object with the v2 schema ID and exact15 top-level keys.
2. Target node, expected signature and logical pytest argv bindings match the frozen constants.
3. `pytest_invocation_count`, session start, collection finish, runtest-call hook and session
   finish are typed integer exact1.
4. `C` is true.
5. `phase_reports` is an ordered exact3 list; every row is an object with exact8 keys and the
   same exact target node.
6. Setup is `passed`, no exception, no xfail; call is `failed`, direct exception type `Failed`,
   exact signature hash/match, no xfail; teardown is `passed`, no exception, no xfail.
7. Stored signature exact-match count is typed integer exact1 and equals the row-derived count.
8. `runner_failure` is exact3 and equals `NONE / NONE / NONE`.
9. Pytest return code, session exit status and outer process exit are typed integer `1 / 1 / 1`.
10. Outer launch failure is `NONE`, and the exclusively written child observation raw identity
    is bound into the controller result.

Static invariant: `R implies O and C`.

## 6. Controller-v2 and total terminal grammar

```text
controller postlaunch schema:
cocolon.emlis.nls_v3.step11.cycle001.recovery_epoch004.r1_owner_contract_gate_c_private_controller_result.v2

postlaunch top-level keyset:
exact16, same body-free field names as controller-v1

counters keyset:
exact26, same counter names as controller-v1
```

The postlaunch exact16 keys remain:

```text
admission_count
admission_record_id
admission_record_raw_sha256
authority_consumption_count
automatic_progression
causal_red_established
child_observation_raw_sha256
consumption_record_raw_sha256
counters
diagnostic_only_process_output
failure
historical_full_r1
launch_contract
process_exit_code
schema_version
terminal
```

The `counters` object has these exact26 keys:

```text
admitted_node_count
call_fail_count
challenge_count
collection_count
d1_full_exact8_pytest_invocation_count
d1_import_count
dependency_install_count
fallback_count
gate_evidence_consumption_count
interpreter_switch_count
network_execution_count
os_child_start_count
postadmission_pytest_version_probe_count
postadmission_role_smoke_count
production_change_count
published_red_test_change_count
pytest_start_count
rematerialization_count
remote_observation_count
retry_count
runtime_repair_count
setup_pass_count
signature_exact_match_count
targeted_pytest_invocation_count
teardown_pass_count
test_call_count
```

The controller uses typed safe extraction. Non-object values, malformed lists and non-object
phase rows must not cause an uncaught classifier exception. After prelaunch precedence, every
post-consumption state maps to exactly one terminal.

### 6.1 Precedence 0: separate prelaunch terminal

Before gate evidence and authority consumption, runtime/source/node/helper/controller identity,
admission creation/readback or other Gate C failure maps to:

```text
R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP
```

If Gate C identity fails before admission creation, admission, gate-evidence consumption,
authority consumption, OS child and targeted pytest are all exact0. If the exclusive admission
write succeeds but readback identity fails, admission is exact1 while gate-evidence consumption,
authority consumption, OS child and targeted pytest remain exact0.

It has no admission-to-launch credit. A failure after the consumption record is exclusively
written does not return to this prelaunch terminal.

### 6.2 Post-consumption three-way mapping

`O` means that the child result is a readable JSON object and the outer process exit is observed
as a JSON integer. A JSON boolean is not an integer for this predicate.

1. If the child result or outer process exit is absent or unreadable, or `C` is false:

```text
R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP
causal_red_established = false
```

2. If `O` is true, `C` is true and `R` is true:

```text
OWNER_CONTRACT_CAUSAL_RED_ESTABLISHED_STOP
causal_red_established = true
```

3. If `O` is true, `C` is true and `R` is false, including schema/keyset/phase/signature/session-finish/
runner-failure/exit mismatch:

```text
R1_STRUCTURED_TERMINAL_OWNER_CONTRACT_CAUSAL_RED_NOT_ESTABLISHED_NONCREDIT_STOP
causal_red_established = false
```

These branches are mutually exclusive and exhaustive. `target_module_collect_reports` and
`pytest_collectreport` are not read by any admission, credit or terminal predicate.

## 7. Private implementation boundary for the later successor

This design does not create or execute observer-v2 or controller-v2. A later, separately approved
one-shot may create exactly one private observer-v2 helper and exactly one private controller-v2
helper outside Cocolon, mashos-api and the retained runtime. Before admission, owner and independent
static conformance verification must each be VALID exact1 and the helper raw identities must be
bound into the fresh admission envelope.

Admission and consumption remain fresh authority-bound private envelopes; this design does not
change their public contract. Consumption is exclusively written before one OS launch request and
is never rolled back. A post-consumption launch failure consumes the one-shot and maps through the
postlaunch grammar. No retry is allowed.

## 8. Static design verification

Owner verification exact1 and independent verification exact1 checked:

- exact15 / exact8 / exact3 child schema closure and exact6 hook surface;
- typed integer versus boolean separation;
- module collect-report and collectreport-hook absence on every normative v2 surface;
- `C` exact3 conditions and `R implies C`;
- full phase/signature/runner/exit predicate;
- prelaunch precedence and mutually exclusive, exhaustive postlaunch mapping;
- typed-safe total classification;
- immutable v1 noncredit and inactive later successor boundary.

```text
owner verdict:
VALID exact1

independent verdict:
VALID exact1

blocker:
exact0
```

## 9. Zero effects

```text
observer-v2 / controller-v2 helper creation or execution:
exact0 / exact0

targeted or other pytest invocation:
exact0

framework entry / import / collection / node call:
exact0 / exact0 / exact0 / exact0

runtime discovery / probe / role smoke / repair / rematerialization / change:
exact0 / exact0 / exact0 / exact0 / exact0 / exact0

network execution / challenge / remote observation:
exact0 / exact0 / exact0

retry / fallback / interpreter switch / dependency install:
exact0 / exact0 / exact0 / exact0

production code / any test / existing D1 / mashos-api change:
exact0 / exact0 / exact0 / exact0
```

GitHub確認とCocolon反映はtarget execution networkとは別のtransport namespaceです。

## 10. 確認した事実、推測、華恋の意見

### 10.1 確認した事実

- v1 one-shotはclosed consumed noncreditで、full R1は`R1_RESULT_UNKNOWN_STOP`です。
- v1 child lifecycleはsingle-node collectionからexpected call failure、teardown、session
  finishまで存在します。
- v1の追加module-report predicateがfalseであり、全module reportの有無は未観測です。
- 今回は設計と静的検証だけで、helper、runtime、pytest、sourceには触れていません。

### 10.2 推測

collector nodeid representationを除外したv2でfresh one-shotを行えば、v1で観測済みの
phase/signature lifecycleを正しいterminal grammarで分類できる可能性が高いです。
ただしlater one-shotは未実行であり、causal REDはまだ成立していません。

### 10.3 華恋の意見

今回の修正で守るべきなのは「REDへ通しやすくすること」ではなく、collection事実と
owner-contract failure事実を別々の十分な根拠で判定することです。module reportを外す一方、
typed counts、ordered phase、direct signature、three exits、total classifierを固定することで、
厳密さを落とさず誤ったSTOPだけを除けます。

次はこの設計へ一致するprivate helper exact2を作り、同じruntime/source identityが
prelaunchで再導出できた場合にだけfresh one-shot exact1へ進むべきです。runtimeが保持
されていなければ、このauthority内で再materializeせずtyped prelaunch STOPにします。

## 11. Exactly one distinct later execution successor

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH004_R1_OWNER_CONTRACT_OBSERVER_V2_TERMINAL_GRAMMAR_RECONCILIATION_DESIGN_POSTVERIFIED_CURRENT_DESIGN_AUTHORITY_CLOSED_CONSUMED_DESIGN_ONLY_OWNER_STATIC_VALID_EXACT1_INDEPENDENT_STATIC_VALID_EXACT1_CHILD_SCHEMA_V2_KEYSET_EXACT15_PHASE_KEYSET_EXACT8_RUNNER_FAILURE_KEYSET_EXACT3_CONTROLLER_SCHEMA_V2_POSTLAUNCH_KEYSET_EXACT16_COUNTER_KEYSET_EXACT26_COLLECTION_ADMISSION_TYPED_EXACT3_PHASE_SIGNATURE_EXIT_AND_TOTAL_THREE_WAY_TERMINAL_MAPPING_FROZEN_PRIOR_OBSERVER_V1_ONE_SHOT_CLOSED_CONSUMED_TERMINAL_R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP_IMMUTABLE_NONCREDIT_FULL_R1_RESULT_UNKNOWN_PRESERVED_NO_RETROACTIVE_REPARSE_RECLASSIFICATION_OR_CREDIT_DISTINCT_LATER_OBSERVER_V2_ONE_SHOT_EXECUTION_LOCAL_PRIVATE_AUTHORITY_BOUND_OBSERVER_V2_HELPER_CREATION_EXACT1_CONTROLLER_V2_HELPER_CREATION_EXACT1_OUTSIDE_COCOLON_MASHOS_API_AND_RETAINED_RUNTIME_PYTEST_COLLECTREPORT_HOOK_EXACT0_TARGET_MODULE_COLLECT_REPORTS_FIELD_EXACT0_RAW_IDENTITIES_AND_FROZEN_DESIGN_CONFORMANCE_OWNER_AND_INDEPENDENT_STATIC_VALID_EXACT1_EXACT1_BEFORE_ADMISSION_PRELAUNCH_SAME_READINESS_OBSERVATION_SHA256_8138978339A65C5EC2D32299A326EE8525F470572526F053FD9866F532203E69_SAME_RUNTIME_INSTANCE_OBSERVATION_ID_695A5ADF4134966C741491312D0B05887EE2F1DA4571132DC06107010DA55D80_BASE_37EEE88C_TREE_3891B841_PLUS_REMOTE_315813C7_TREE_A641510E_POSTFETCH_VERIFIED_OVERLAY_EXACT1_NOT_CLAIMED_CLEAN_MAIN_REQUIRED_SOURCE_EXACT6_PRODUCTION_OWNER_ABSENT_PUBLISHED_RED_TEST_BLOB_9A1CF8A0343D6A391CE6D520CA686F7310EF22D0_RAW_EA8498B79FD9AA028FF913FB4D99BEB205D2736A3D0AE783A435CBCCF32575CC_UNCHANGED_EXISTING_D1_UNCHANGED_TARGET_NODE_ID_SHA256_12C11C21C0B7B5E7818A1A1050002E126A5D2FABA2ECC213AEAAC4C4FDF9B1D0_REDERIVED_VALID_OR_R1_LAUNCHER_OR_ENVIRONMENT_IDENTITY_INVALID_NONCREDIT_STOP_ADMISSION_GATE_EVIDENCE_CONSUMPTION_AUTHORITY_CONSUMPTION_TARGET_OS_CHILD_TARGETED_PYTEST_INVOCATION_EXACT0_EXACT0_EXACT0_EXACT0_EXACT0_WHEN_GATE_C_IDENTITY_INVALID_BEFORE_ADMISSION_OR_ADMISSION_EXACT1_GATE_EVIDENCE_CONSUMPTION_AUTHORITY_CONSUMPTION_TARGET_OS_CHILD_TARGETED_PYTEST_INVOCATION_EXACT0_EXACT0_EXACT0_EXACT0_WHEN_ADMISSION_READBACK_INVALID_FRESH_EXCLUSIVE_SINGLE_USE_PRELAUNCH_ADMISSION_RECORD_EXACT1_GATE_EVIDENCE_CONSUMPTION_EXACT1_AUTHORITY_CONSUMPTION_EXACT1_WRITE_BEFORE_LAUNCH_NO_ROLLBACK_WHEN_VALID_PRELAUNCH_STATIC_LOCAL_GIT_STATUS_PROCESS_EXACT1_DIRECT_ADMITTED_ABSOLUTE_EXECUTABLE_EMPTY_NONREPOSITORY_CWD_SHELL_PATH_SEARCH_GENERIC_INTERPRETER_EXACT0_TARGET_OS_CHILD_AND_PYTEST_MAIN_AND_TARGETED_PYTEST_INVOCATION_EXACT1_EXACT1_EXACT1_WHEN_REACHED_EXPLICIT_OBSERVER_V2_PLUGIN_SAME_CHILD_ONLY_ADMITTED_NATIVE_REPOSITORY_RELATIVE_NODE_EXACT1_OTHER_PYTEST_INVOCATION_EXACT0_COLLECTION_ADMISSION_TYPED_SESSIONSTART_EXACT1_COLLECTION_FINISH_EXACT1_COLLECTED_NODE_IDS_EXACTLY_ORDERED_SINGLE_ADMITTED_NODE_FULL_CAUSAL_RED_TYPED_PHASE_SIGNATURE_RUNNER_AND_EXIT_PREDICATE_EXACT1_OR_POSTCONSUMPTION_OBSERVATION_O_FALSE_OR_COLLECTION_ADMISSION_C_FALSE_R1_PYTEST_LAUNCH_OR_COLLECTION_NONCREDIT_STOP_OR_OBSERVATION_O_TRUE_AND_COLLECTION_ADMISSION_C_TRUE_AND_FULL_CAUSAL_RED_R_FALSE_R1_STRUCTURED_TERMINAL_OWNER_CONTRACT_CAUSAL_RED_NOT_ESTABLISHED_NONCREDIT_STOP_OR_OBSERVATION_O_TRUE_AND_COLLECTION_ADMISSION_C_TRUE_AND_FULL_CAUSAL_RED_R_TRUE_OWNER_CONTRACT_CAUSAL_RED_ESTABLISHED_STOP_TYPED_SAFE_TOTAL_CLASSIFIER_NO_UNCAUGHT_EXCEPTION_PYTEST_COLLECTREPORT_AND_TARGET_MODULE_COLLECT_REPORTS_EXCLUDED_FROM_SCHEMA_ADMISSION_CREDIT_AND_TERMINAL_PREDICATES_EXISTING_D1_RAW_BYTE_READ_EXACT1_RAW_SHA256_AND_GIT_BLOB_SHA1_VALIDATION_PASS_EXACT1_EXACT1_D1_IMPORT_PYTHON_EXECUTION_AND_D1_FULL_EXACT8_PYTEST_EXACT0_NETWORK_CHALLENGE_REMOTE_OBSERVATION_RETRY_FALLBACK_INTERPRETER_SWITCH_DEPENDENCY_INSTALL_RUNTIME_DISCOVERY_VERSION_PROBE_ROLE_SMOKE_REPAIR_REMATERIALIZATION_OR_CHANGE_EXACT0_PRODUCTION_PUBLISHED_RED_TEST_EXISTING_D1_AND_ANY_MASHOS_API_SOURCE_CHANGE_EXACT0_HUMAN_PYTEST_PRESENTATION_DIAGNOSTIC_ONLY_RAW_OUTPUT_ABSOLUTE_LOCATOR_AND_HELPER_BODY_UNPUBLISHED_BODY_FREE_RESULT_RECEIPT_HANDOFF_PLAN_LATEST_POSTVERIFICATION_ONLY_EXECUTION_AUTHORITY_CLOSED_CONSUMED_WHEN_GATE_EVIDENCE_CONSUMPTION_REACHED_NO_RETRY_NO_AUTOMATIC_SUCCESSOR_EXECUTION_AUTOMATIC_PROGRESSION_FALSE
```

```text
state:
DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED

automatic progression:
false
```

## 12. Stop

```text
OBSERVER_V2_TERMINAL_GRAMMAR_RECONCILIATION_DESIGN_POSTVERIFIED_ONLY_LATER_ONE_SHOT_DEFINED_INACTIVE_STOP
```
