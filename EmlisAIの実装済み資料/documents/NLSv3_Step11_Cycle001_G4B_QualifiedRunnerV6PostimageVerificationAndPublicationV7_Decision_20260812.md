---
doc_id: nlsv3_step11_cycle001_g4b_v7_qualified_runner_verification_publication_decision
date: "2026-08-12"
status: "CLOSED_CONSUMED_CORRECTION_PASS"
primary_outcome: "TECHNICAL_CREDIT"
body_free: true
automatic_progression: false
---

# G4-B V7 qualified-runner verification and exact3 publication Decision

## 1. Decision

Mashの「このセッションで問題を解決しGitHub反映まで進める」という直接指示に基づき、V6を再開せずV7 successorとして実行しました。Work user namespaceでは不可能だったfixed UID/GID 65534のactual-DAC proofを、同一job内で必要条件をfresh admissionできるqualified isolated runnerで実行し、検証済みexact3をmashos-api mainへ反映しました。

V7 lifecycleは`CLOSED_CONSUMED_CORRECTION_PASS`です。primary outcome `TECHNICAL_CREDIT`はconsumer-side source / contract / portable test / actual-DAC evidenceに限定します。V6は`CLOSED_CONSUMED_CORRECTION_STOP`のhistorical immutableであり、そのapproval、activation、consumption、retry、fallback、repairをV7へ継承していません。

## 2. Root cause and correction

V6のWork namespaceは`/proc/self/setgroups=deny`、uid/gid mapはinside ID 0だけでした。このため最初の`setgroups([])`がEPERMとなり、fixed UID/GID 65534もmap外でした。capability bit不足やsource順序の問題ではありません。

V7はsecurity contractを弱めず、same-UID substituteも使いません。runnerは同じauthoritative job内で`setgroups=allow`、UID/GID 65534 mapping、必要capability、CPython 3.12.13と固定interpreter bytesを確認しました。exec後bootstrapのruntime relocationと一時descriptor cleanupを補正し、production capture前のnonstdio descriptor setをFD9だけに戻してからactual-DAC proofを完了しました。

## 3. Authoritative verification

```text
staging branch: agent/g4b-v7-exact3-verification-r8
staging commit / tree: d204df94b21acef430bd3142a791a51a560c08b5 / 92806c50981f347ad12ab8c239552d5e5114d4af
workflow run / job: 31608210201 / 94152538969
runner: ubuntu-24.04
control interpreter SHA-256: 9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488
portable stdlib unittest: 18 PASS / 0 FAIL / 0 ERROR / 0 SKIP / RC0
portable stdout SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
portable stderr SHA-256: 92fa9df2805dcb9d7895c25cf8f9f2763c83465b7c296e8a188b5f4abb034e3
privileged actual-DAC exact1: PASS / RC0
privileged stdout SHA-256: 8ae31e36990085e4817f3770b7187a2ca1c6525ed110b2d13c26bef8cd7a19f7
privileged stderr SHA-256: 31f526c858bacf895d9462b4478efa547a064d93c699dd1fe372f3f318b78009
EXECVE_REQUESTED: exact1
POSTEXEC_ENTERED: exact1
diagnostic: exact0
retry / fallback / repair: 0 / 0 / 0
```

## 4. mashos-api publication

Pre-head/tree: `e96df82e790d32779940d7972a340be319553137` / `f5411c83851b042d0bb0f2203646858716d3cc9f`

Final head/tree: `99afecb1a30880bf42b9fde4932e5bba7e01e7d4` / `6f92113264ffef515bd2feba3c7e8ba82d0c0188`

Changed paths are MODIFY exact3:

1. `ai/tools/emlis_nls_v3_s11_g4b_runtime_preparation_contract_v1.py`
   - bytes: 73834
   - SHA-256: `966587a6457dc6376d53272e96019909d4c11ec98acc4c85d337f300ea462816`
   - blob: `61a502cde4f3d515507ff774e460ac33b94b6ee7`
2. `ai/tools/emlis_nls_v3_s11_g4b_runtime_acquisition_v1.py`
   - bytes: 43593
   - SHA-256: `de39e53edf88018c0c87179e0a5760986f995537867c588102679a704e5b007b`
   - blob: `2cda248b3b9364415fdde91f14553f3dfc67261f`
3. `ai/tests/test_emlis_nls_v3_s11_g4b_runtime_preparation_controller_v1.py`
   - bytes: 127056
   - SHA-256: `24a4fc72ec454f1a32d1d91a602ddd8e7cc98712076677213c67a4aeebe420f0`
   - blob: `7d3c5e5e90afc34948ba1ccb8b5a85ab65040654`

Fresh postverification confirmed direct-child ancestry, changed paths exact3, exact remote blobs, protected exact10 unchanged and unauthorized change exact0. The staging workflow was not added to main.

## 5. Cocolon synchronization

Cocolon pre-head/tree: `bda9f951f80210f86727d2553250290b54232de5` / `881bb83faab24127afa20a6ee9cbf44f23d1e9c9`. This Decision and paired body-free Receipt are ADD exact2; current owners are synchronized as MODIFY exact9. V6 Receipt, Rule18 and the role-alignment Receipt are unchanged. Cocolon changed paths are exact11 and the two-repository union is exact14.

Final Cocolon head/tree and the physical blob identities determined by that same tree are intentionally not embedded here. GitHub objects own them and they are reported externally after publication.

## 6. Terminal poststate

```text
CURRENT_PRECEDENCE_EFFECTIVE_DATE = 2026-08-12
CURRENT_NAVIGATION_OWNER = Cocolon_前提資料/08_cycle001_current_state.md
CURRENT_SELECTED_METHOD = GATE_B_RUNTIME_PREPARATION_CONTROLLER_FAMILY_V1_USING_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_THEN_GITHUB_TRACKED_RUNTIME_ADMISSION_CHECKER_V1
FUNCTIONAL_PREPARATION_STATE = CONTROLLER_FAMILY_V1_FUNCTIONAL_EXACT7_WITH_PLATFORM_OPENED_EXEC_TIME_INHERITED_READ_ONLY_FD_MAPPING_V1_IMPLEMENTED_VERIFIED_REMOTE_POSTVERIFIED
LIVE_RUNTIME_EXECUTION_STATE = UNEXECUTED
CURRENT_BLOCKER = PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ALL_OTHER_ONE_SHOT_LIVE_PRECONDITIONS_NOT_FRESHLY_ESTABLISHED
CURRENT_AUTHORITY = NONE
LATER_LIVE_AUTHORITY = NOT_AUTHORED_NOT_APPROVED
NEXT_EXACT1 = NLS_V3_STEP11_CYCLE001_G4_GATE_B_PLATFORM_EXEC_TIME_FD_MAPPING_SURFACE_AND_ONE_SHOT_LIVE_NETWORK_RUNTIME_READINESS_ADMISSION_CANDIDATE
NEXT_CANDIDATE_CLASS = TECHNICAL_AUTHORITY_CANDIDATE
NEXT_CANDIDATE_SCOPE = LEVEL_3_MASH_DECISION_AND_APPROVAL_REQUIRED_SCOPE
NEXT_CANDIDATE_STATE = DEFINED_INACTIVE_SEPARATE_MASH_APPROVAL_REQUIRED
RUNTIME_READY = FALSE
READINESS_OBSERVATION_ID = NOT_DERIVED
GATE_B = OPEN
READINESS_GATE_B_TECHNICAL_PRODUCT_CREDIT = 0 / 0 / 0
GATE_C = NOT_AUTHORIZED
AUTOMATIC_PROGRESSION = FALSE
```

V7の`TECHNICAL_CREDIT`はconsumer-side source / contract / portable test / actual-DACの再利用可能な補正証拠だけを指します。Gate-B admissionのtechnical creditではなく、上記のGate creditは`0 / 0 / 0`のままです。

Evidence:
- mashos-api final head / tree: `99afecb1a30880bf42b9fde4932e5bba7e01e7d4` / `6f92113264ffef515bd2feba3c7e8ba82d0c0188`
- qualified-runner Actions run / job: `31608210201` / `94152538969`
- V7 Decision: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_Decision_20260812.md`
- V7 Receipt: `EmlisAIの実装済み資料/documents/NLSv3_Step11_Cycle001_G4B_QualifiedRunnerV6PostimageVerificationAndPublicationV7_BodyFree_Receipt_20260812.json`

No live platform source open, live FD9 mapping, live controller/checker/product network, product/live-runtime PyPI or wheel use, readiness admission, Gate B closure, Gate C or later-Gate effect was performed. GitHub Actions control-plane checkout, pinned interpreter archive fetch and pinned pip-wheel fetch were disclosed verification-runner provisioning effects only, not live product/runtime evidence. Report, then STOP.
