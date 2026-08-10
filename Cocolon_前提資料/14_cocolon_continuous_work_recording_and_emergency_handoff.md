---
doc_id: cocolon_continuous_work_recording_and_emergency_handoff
title: "Cocolon continuous durable work recording and emergency handoff"
revision_date: "2026-08-10"
normative_status: "CURRENT"
status: "PHASE4_PREPARED_NOT_PUBLISHED"
effective_when: "PHASE5_CHECKPOINT_B_ATOMIC_CURRENT_OWNER_CUTOVER_REMOTE_POSTVERIFIED"
decision_owner: "Mash"
operational_owner: "Karen"
automatic_progression: false
---

# Purpose

This is the canonical rule for preserving Cocolon work against sudden context limits, Work/Codex termination, tool failure, or forced session changes. A session-ending request from Mash is not a prerequisite for preservation.

# 1. Durable accumulation is part of the work

Work is not complete merely because a local file was created, a hash was calculated, a review was performed, or a STOP was reported. Reusable work exists only after the result and its reconstruction inputs are stored in an approved durable destination and verified by a fresh read.

SHA-256 proves identity of available bytes; it is not storage and cannot reconstruct missing bytes.

# 2. Incremental recording requirement

Karen must record work state during the task, not only at a planned session end.

Create or update a durable checkpoint whenever any of the following occurs:

- a new artifact is created or frozen;
- a review identifies a blocker or changes the next action;
- an authority is approved, activated, consumed, stopped, or closed;
- an execution produces a result that later work depends on;
- the current/invalid/superseded status of an artifact changes;
- the local state required to reconstruct the work is no longer already present in GitHub;
- the work has continued long enough that sudden session loss would cause material rework.

Do not defer all recording until Mash asks for a handoff. Do not assume the current session, chat context, scratch path, cached container, or subagent messages will remain available.

Use the smallest canonical owner that preserves the fact. A lifecycle event does not automatically create a separate Result, Handoff, comparison, Plan append, and `07` append. Authority terminal, current-state replacement, milestone history, and emergency reconstruction have different owners defined below.

# 3. Required reconstruction-checkpoint contents

When a conditional Result, Handoff, or other reconstruction checkpoint is required, it must include enough information to resume without chat-only facts:

1. current public repository commit/tree and relevant external repository identity;
2. last safe public/technical checkpoint;
3. current authority lifecycle and exact STOP/PASS state;
4. authoritative, invalid historical, superseded, and proposed artifacts clearly separated;
5. exact relative path, role, bytes, LF/CR/final-LF, mode, and SHA-256 for every local-only dependency;
6. actual artifact bytes or a lossless durable bundle; a manifest pointing only to an ephemeral path is insufficient;
7. confirmed facts, unconfirmed facts, non-reusable evidence, and prohibited inferences;
8. exact next action, required approval boundary, and no-automatic-progression state;
9. privacy classification and the durable locator for any artifact that cannot be public;
10. GitHub commit SHA, final branch/head, exact changed paths, and fresh postwrite content verification.

A terminal body-free Receipt follows its frozen authority / Receipt contract and does not duplicate all reconstruction content merely to satisfy this section. Missing reconstruction facts are added through the conditional owner below, not by expanding every Receipt into a Handoff.

# 4. Canonical recording lanes

## 4.1 Authority terminal — Receipt mandatory

Each authority terminal has, in principle, one body-free Receipt exact1. The Receipt records exact scope, denominator / identity, performed effects and exact zero-effects, lifecycle, terminal reason, reusable / non-reusable evidence, and exactly one primary outcome classification:

```text
PRODUCT_CREDIT
TECHNICAL_CREDIT
BLOCKER_NARROWED
ADMINISTRATIVE_ONLY
```

Machine GREEN, Product Read, and runtime readiness are separate claims and separate credits. A Receipt must not convert one into another. When `BOUNDED_MECHANICAL_REPAIR` is used, the Receipt also records prior failure closure, the Mash-approved new authority exact1, repair count, fresh rerun count, new-root / no-reuse boundary, and success or terminal STOP. A second failure is `DETOUR_RISK_STOP`, not another repair record.

## 4.2 Result / Handoff / comparison — conditional

```text
Result:
  Create only when the Receipt cannot by itself restore the cause, judgment,
  or restart condition.

Handoff:
  Create only when actor, environment, or session changes and `08` + Receipt
  cannot safely resume the work.

standalone comparison:
  Create only when an acceptance gate requires it as independent evidence.
```

Absence of a conditional Result, Handoff, or comparison is not evidence loss when the Receipt and current owners are sufficient. Do not duplicate the same event across all three.

## 4.3 Current state / milestone / Plan

```text
08_cycle001_current_state.md:
  current-only full replace; no suffix / override accumulation.

07_latest_snapshot_diff.md:
  milestone-only append; never the next-action owner.

current Execution Plan:
  route / evidence / historical artifact; not a daily current-state owner and
  not an append target for every authority or helper event.
```

Git history preserves the replaced `08` preimage. `07` receives only formal Gate closure, RC or production-owner change, material Product Read judgment, Cycle acceptance, or formal owner / workflow cutover. Helper STOP, authority creation, one-off probe, and publication verification do not by themselves require a `07` append.

# 5. GitHub and private evidence boundary

Public-safe Cocolon work records, source drafts, receipts, ledgers, and handoffs are stored in Cocolon GitHub under the existing premise or implemented-document owner.

Secrets, credentials, body-full private input/output, and prohibited private evidence must never be placed in public GitHub. If such bytes are required for reconstruction, store them in an approved durable private destination and record only the non-secret immutable object identity and retrieval owner in GitHub.

Do not omit all durable recording merely because one subset is private. Publish the public-safe checkpoint and explicitly identify the private gap.

# 6. STOP is also recorded

A failed review or consumed STOP is durable project knowledge. Record the exact blocker, affected artifact identity, lifecycle counters, performed and unperformed effects, non-reuse boundary, and next safe action. Do not delete invalid artifacts when they are required to understand lineage. Label them immutable/noncredit instead.

If a historical Receipt / Result / Handoff later needs correction, retain it unchanged and create an additive superseding record that names the old identity, exact error, corrected facts, and current owner. Correct `08` by current-only replacement and retain its preimage in Git history; do not add a correction suffix or make history disappear.

# 7. Fresh verification before reporting preservation complete

After GitHub reflection, fetch each new or modified checkpoint path from GitHub and compare it to the prepared bytes. Confirm that the write-commit changed-path set contains no unapproved path and that the latest branch/head contains all checkpoint artifacts.

Preservation is incomplete until this fresh remote verification passes.

# 8. Emergency handoff behavior

If a context-limit warning, output-limit failure, tool degradation, or likely forced session transition is observed, stop new technical expansion and immediately flush the current checkpoint using already-confirmed facts. Do not wait for Mash to request a handoff.

If termination happens before the flush completes, the next session must treat everything after the latest verified durable checkpoint as unverified/lost until independently reconstructed.

# 9. Relationship to other owners

- the current long-term roadmap owns the product destination and current product Phase.
- immutable original designs plus their current alignment owners own technical and product-quality norms.
- the original Execution Plan plus Current Closure Route own the Cycle route and remaining Gate structure.
- `08_cycle001_current_state.md` is the sole current navigation owner and is maintained by current-only replacement.
- actual source / test / body-free Receipt own execution facts.
- `07_latest_snapshot_diff.md` is milestone history only; it does not own current next action.
- the current Execution Plan is not the daily current-state owner.
- `11_cocolon_github_transport_and_session_continuity.md` remains the GitHub reflection method/completion owner.
- this file owns continuous recording cadence, minimum reconstruction content, and emergency handoff behavior.
- detailed task evidence belongs under `EmlisAIの実装済み資料/documents/` or the applicable implemented-document owner.

Actual implementation, machine GREEN, or runtime behavior is not promoted into approved design by recording it. This rule does not authorize technical execution, product progression, or automatic approval, and it does not return routine monitoring of runtime, manifests, helpers, scanners, or Receipts to Mash. It only prevents confirmed work from disappearing with a session.
