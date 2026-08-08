# Stage A Inspector V2 direct gate publication receipt v1

Date: 2026-08-08
Repository: `MassyuRed/Cocolon`
Branch: `main`
Authority: `SEPARATE_MASH_UI_ATTESTED_WORK_ULTRA_CYCLE001_INSPECTOR_V2_GATE_CLOSURE_AUTHORITY_V1`
Authority SHA-256: `5d00c7142e3ff7041b88277c6d08cf88a5097173f251318da35168cb5e5aea08`
Approval package SHA-256: `5c654b772144a942fa6fb519ed522616b53eaeb83c9c1cfec88efd016297deeb`
Scanner SHA-256: `087c8afdcbb278d7fc0c3d01c322bd64b2c168cec05840403ff4d046a5ff1c45`
Lifecycle at this checkpoint: `ACTIVATED_EXACT1_CONSUMED_EXACT1_STAGE_A_QA_PENDING`
Automatic progression: `false`

## Confirmed facts

- Work UI and Ultra execution-mode attestation were supplied in the approving message.
- The approval ZIP contained exact2 regular mode0600 members. Authority and scanner identities matched the approved values before activation.
- Accepted entry Cocolon head/tree: `162898d85100aeed58a97d2e3006361475b98d2c` / `8f280185966d41f87ffff7f55eddb75e5d2c57db`.
- Observed mashos-api head: `65284fef36936d7091262e758e0cc9282909601b`; Karen write count: `0`.
- Current-rule identities passed `16/16`; owner preimages passed `4/4`; immutable lineage passed `4/4`; authorized add-target absence passed `8/8`.
- Immutable bundle blob `98af979468f124f8afeca6a119b5092fe3bf3260` was fetched exactly once from containing commit `fe3b040836c94967db7a2c3c3dd5cf6c1594fd66`. UTF-8 raw roundtrip create-blob returned the same blob.
- Bundle schema was `v16_inspector_v2_single_create_failure_bundle_v1`. Exact4 ordered artifact attestations returned the frozen blobs below without regeneration, edit, replacement, or refreeze.

| role | Git blob | SHA-256 | bytes | LF |
|---|---|---|---:|---:|
| V4 postverification receipt | `1411f304d1a97569c28f049589d73f60a9f28ab8` | `d6d621414cd8ebb336ccd0c11e6f5c453eb05f7eab3984338ae00a245f1fe9d5` | 3635 | 52 |
| Inspector V2 | `f45082cd3970e69f980c15e598ace3f49e404003` | `db7c36351070487d98c34d6d34710f25ce010bb54f33d744102e00f5fcf5fc31` | 60190 | 1583 |
| synthetic harness | `99ac7d5b996489060ef7e9f72f95d7d382009855` | `6950bf08242c42d96e2bab53d3dca845cec2b261298e2268cce6a52ffd9734ad` | 8962 | 212 |
| implementation-freeze receipt | `23e86d6dc3ee01640917b994ebfc5d0b056c1aad` | `eb862bdb03dd64e8765721af30261290f158a244290766d584b461548657bf06` | 3608 | 48 |

- Stage A targets1-5 were reflected sequentially as exact new files with mode100644 and the expected blobs.

| target | commit | blob | disposition |
|---|---|---|---|
| approved authority | `6ba8ee74f8c9fd5a9ec60c334c0f29b7c6c40e9d` | `ade058821d872cd7f645dd6fb16054a2db4c7e59` | confirmed; one metadata reconciliation; resend0 |
| frozen scanner | `aeafc9cefe4633d47b827dd0dd618502df844ed0` | `ae0648a1af4ad2f4b189bfcda27d84bce66a45c1` | confirmed |
| frozen Inspector V2 | `aae58626670acea6fbcaff8e5c07b9b2a95710cc` | `f45082cd3970e69f980c15e598ace3f49e404003` | confirmed; body-suppressed transport |
| frozen harness | `4b3cb9ec8e4b44af816b2d647f992c4ba362a8fb` | `99ac7d5b996489060ef7e9f72f95d7d382009855` | confirmed; body-suppressed transport |
| freeze receipt | `57c885a3c72bf4c1d0da5b655aa3f427f8df291a` | `23e86d6dc3ee01640917b994ebfc5d0b056c1aad` | confirmed; body-suppressed transport |

- Specification-source materialize/stat/hash/open/read/execute counts are all `0`.
- QA and B_R1-B_R4 reviews are `PENDING`; technical credit and Cycle001 acceptance credit are `0` at Stage A.

## Inference

The frozen technical inputs are now reachable through the intended GitHub paths. Published-byte QA and independent review remain necessary before the Inspector V2 gate can close.

## Karen judgment

Stage A targets1-5 are suitable inputs for the authorized QA/review stage. No source-read, real Inspector execution, exact C01-C04 claim, V3 action, runtime claim, or acceptance claim is made here.

## Exact Stage B action

After target6 and the four Stage A owner postimages are remotely verified, fetch the published scanner, Inspector V2, and harness through Git object plumbing into one fresh non-repository QA root; run the fixed syntax, pre-import scanner, and 71-assertion harness checks; complete Karen B_R1 plus three independent B_R2-B_R4 reviews; then publish one review receipt and the final owner4 postimages. PASS requires all QA checks and all four reviews to pass. Retry, artifact edit, source access, and automatic progression remain prohibited.
