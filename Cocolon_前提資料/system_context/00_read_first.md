# Cocolon System Context — V1 current technical management entry

status: CURRENT_TECHNICAL_OWNER__V1_MANAGEMENT_ENTRY_ACTIVE_ON_PR37_WORKING_LINEAGE
revision_date: 2026-09-02
scope: Cocolon System Context Steps 1–7 plus Step 9 management entry and V1 implementation freeze
step8_status: SKIPPED_BY_MASH_DECISION
management_entry_activation: 1
v1_implementation_freeze: 1
operator_proof_activation: 0
operator_actual_proof_completion_claim: null
product_credit: 0
technical_credit: 0
primary_outcome: ADMINISTRATIVE_ONLY
automatic_progression: false

## Purpose

This file is the single current System Context technical entry routed from
`Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt` on the
PR #37 working lineage. It does not replace the general work-attitude owner,
the original files, product canonical owners, current-structure maps, Mash
decisions, or Cycle001 navigation.

Mash explicitly skipped Step 8 and activated Step 9 on 2026-08-22. The current
admission is:

```text
STEP7_BOUNDED_IMPLEMENTATION_COMPLETE
+ MASH_EXPLICIT_STEP8_SKIP_AND_STEP9_ACTIVATION
```

This activates the management entry and freezes the V1 implementation. It does
not claim `SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE`.

## Standard flow

```text
work-attitude 00_read_first
→ this V1 technical entry
→ exact workspace resolve and freshness
→ task Context compile
→ operator / Pro / Ultra / collaboration navigation
→ actual original full-text read
→ human judgment
```

Run the V1 entry from the PR #37 implementation checkout. The implementation
root and the material roots are deliberately separate: the executing tools and
embedded payloads come from the exact PR #37 checkout, while `--repo-root`
selects the exact PR #30 Cocolon material checkout and
`--external-workspace-root` contains the exact PR #3 `mashos-api` material
checkout. They are never overlaid into one synthetic Git tree.

Open the implementation checkout with `.devcontainer/devcontainer.json` and
verify the locked toolchain before preparing Context:

```bash
python3 -m tools.cocolon_context doctor

python3 -m tools.cocolon_context prepare \
  --workspace cmee_working \
  --task cmee \
  --repo-root "$COCOLON_MATERIAL_ROOT" \
  --system-context-root "$PWD/Cocolon_前提資料/system_context" \
  --external-workspace-root "$EXTERNAL_MATERIAL_ROOT"
```

`doctor` verifies the exact Python, Node, TypeScript, SCIP providers and locked
test dependencies recorded by the repository. A missing or mismatched tool is
a fail-closed stop, not a warning or a syntax-only success.

The command resolves the exact `Cocolon` and `mashos-api` refs pinned by
`workspace_profiles.json`, rejects a dirty material checkout, compares the
saved workspace lock and execution-input fingerprint, verifies same-ref bytes,
derives
added/modified/deleted/renamed/type-changed paths for changed refs, refreshes
only the causally affected layers or uses the bounded full-rebuild fallback,
and writes the current result to a regenerable cache outside the tracked
historical snapshot. The default cache root is
`<PR37-implementation-root>/.cocolon-context-cache`; `--cache-root` may select
an equivalent explicit local cache root.

```text
<cache-root>/cmee_working/prepare_summary.json
<cache-root>/cmee_working/prepare_summary.md
<cache-root>/cmee_working/task_context/cmee/
```

The actual original full-file reading order is:

```text
<cache-root>/cmee_working/task_context/cmee/full_text_read_order.md
```

Standard stdout is a bounded brief receipt containing identities, freshness,
proof state, counts and cache paths. `--output-format full` is an explicit
diagnostic view. The exact logical outputs, transport manifests and full
original-reading order remain in the cache; stdout reduction does not remove
or truncate their evidence.

`prepare` is complete only after the execution owner has read the applicable
actual original files in that order before making a Cocolon judgment. The
generated order is navigation evidence, not a claim that every file was
permanently memorized or that its meaning was machine-approved.

## Freshness and fallback

### Same exact refs

Existing inventory, code index, route graph and task Context may be reused only
when their manifests, logical output hashes, transport manifests and context
fingerprint verify. The fingerprint covers the exact material refs and the
implementation tools, embedded payloads, profiles, schemas and fixed
environment lock. A mismatch is rejected; it is not converted into PASS.

Input freshness, output freshness and remote proof status are separate states.
A fresh local rebuild is not mislabeled stale merely because remote proof is
pending, and pending proof is not converted into freshness. Exact refs and
clean worktrees are checked at both start and end; movement during execution
stops without retry or publication.

### Changed refs

Modified non-code paths refresh Inventory and Task Context while rebinding the
saved semantic provider payloads. Ordinary modified source paths reindex the
source and its transitive reverse dependents, then refresh only the affected
RN/API/backend/test closure. Add/delete/rename/type changes, provider or schema
changes, and global route-owner changes use the bounded full-rebuild fallback.

### Fresh clone and direct read fallback

A remotely sealed generated result must pass exact-ref verification from a
distinct fresh clone and produce no generated diff. Missing, stale, tampered or
unverifiable Context fails closed. The original tracked files remain canonical
and directly readable; System Context failure never prohibits direct original
read.

The tracked `current/cmee_working/**` bytes remain the historical frozen
snapshot during this hardening step. They are not deleted, rewritten or used as
the standard writable cache.

## Current verification ownership

The three PR-triggered System Context workflows are read-only exact-head
verifiers. They build the fixed environment from the small `.devcontainer`
context, mount the exact Draft head read-only at runtime, run `doctor`, compile
the bounded active Python entries and execute their assigned tests without
runtime network access. They use `contents: read` and `pull-requests: read`, do
not commit or push, and verify the open Draft PR head before and after tests.
Automatic writer count is 0.

A generated current update, if separately authorized later, belongs to an
explicit execution owner using the whole-workspace transaction and remote
postverification. It is not performed by Step 9.

## Publication transport

Canonical large JSONL output remains canonical logical bytes. Files exceeding
the Git single-file limit are represented by ordered `.partNNNN` files and a
`publication_transport.json` manifest. Workspace and nested task-context
transports are independently owned and verified. Missing, reordered,
duplicate, undeclared or modified parts are rejected.

## Step 8 skip and proof boundary

Step 8 status is `SKIPPED_BY_MASH_DECISION`. Its durable actual-task evidence
exact3, Pro actual-use confirmation, Ultra actual-use confirmation, and Mash
burden-nonincreasing confirmation were not performed and are not Step 9
admission requirements.

The frozen Step 7 generated snapshot intentionally retains:

```text
operator_v1_activation_approved = false
v1_activation = 0
completion_claim = null
```

Those values prevent the generated candidate from self-awarding Operator
actual-proof completion. They do not negate the human-approved management-entry
switch. The generated `HOLD_AFTER_STEP7_UNTIL_EXPLICIT_NEXT_APPROVAL` restart
code is a frozen Step 7 terminal snapshot, not the current Step 9 navigation
owner. No Step 9 actual-use refresh or Operator-value PASS is claimed.

`account_profile_read_only` remains an ephemeral read-only proof task. Step 9
does not activate persistent non-CMEE profiles or broaden their scope.

## Original and retirement boundary

System Context is the management, discovery, current-owner-candidate, task
Context, and impact entry. Originals remain canonical. No manual navigation,
index, rule, or original file is automatically deleted, renamed, rewritten, or
retired.

Because Step 8 actual-use evidence was skipped:

```text
retirement_candidates = []
manual_navigation_deleted = 0
reason = NO_SAFE_RETIREMENT_WITHOUT_ACTUAL_USE_EVIDENCE
```

Any later retirement requires a separate Mash decision.

## V1 implementation freeze and future enhancement

Step 7 source, tests, profiles, workflows, and generated actual at
`92e4ad913f61c064e42320bd62ab13fa0ba97fa7` remain the frozen V1 behavior and
evidence baseline. Mash's 2026-09-02 decision authorizes only the bounded
execution hardening documented above: exact implementation/material identity,
fixed environment validation, freshness/cache correction and lightweight
stdout. It does not reopen product behavior or Operator actual-proof claims.

A future enhancement is allowed only when all exact4 conditions hold:

```text
actual taskで観測したpain point exact1
+ System Contextの因果不足
+ より小さい既存手段なし
+ Pro／Ultraの作業負担をactualに減らす
```

Changing the frozen scope requires a new explicit Mash decision. New external
service, DB, daemon, dashboard, recurring cost, automatic rank, automatic
selection mutation, and automatic owner mutation remain 0 by default.

## Current terminal and boundaries

```text
STEP7_BOUNDED_IMPLEMENTATION = COMPLETE
STEP8_STATUS = SKIPPED_BY_MASH_DECISION
STEP9_MANAGEMENT_ENTRY_MIGRATION_AND_V1_FREEZE = COMPLETE
MANAGEMENT_ENTRY_ACTIVATION = 1
V1_IMPLEMENTATION_FREEZE = 1
SYSTEM_CONTEXT_V1_MANAGEMENT_ENTRY_ACTIVATED_AND_IMPLEMENTATION_FROZEN = TRUE
SYSTEM_CONTEXT_V1_OPERATOR_CONTEXT_ACTUAL_PROOF_COMPLETE = NOT_CLAIMED
OPERATOR_PROOF_ACTIVATION = 0
OPERATOR_GENERATED_COMPLETION_CLAIM = null
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
PRIMARY_OUTCOME = ADMINISTRATIVE_ONLY
AUTOMATIC_PROGRESSION = false
STRUCTURE_MAP_DELTA_NONE
```

This entry changes no RN behavior, API/public contract, DB/migration,
production dependency, CMEE/EmlisAI/Piece/Analysis output, default-branch
state, ready state, merge state, deployment, release, or `mashos-api` byte.
It is active on the PR #37 working lineage only.

The bounded final claims are:

```text
STEP9_MANAGEMENT_ENTRY_MIGRATION_AND_V1_FREEZE_COMPLETE
SYSTEM_CONTEXT_V1_MANAGEMENT_ENTRY_ACTIVATED_AND_IMPLEMENTATION_FROZEN
```

`SYSTEM_CONTEXT_V1_COMPLETE`, Operator actual-proof completion, Operator value
PASS, Product Read, merge-ready and release-ready are not claimed. Step 9 does
not automatically start any next work.
