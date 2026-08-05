---
doc_id: cocolon_continuous_work_recording_and_emergency_handoff
title: "Cocolon continuous durable work recording and emergency handoff"
revision_date: "2026-08-05"
normative_status: "CURRENT"
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

# 3. Required checkpoint contents

Every durable work checkpoint must include enough information to resume without chat-only facts:

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

# 4. GitHub and private evidence boundary

Public-safe Cocolon work records, source drafts, receipts, ledgers, and handoffs are stored in Cocolon GitHub under the existing premise or implemented-document owner.

Secrets, credentials, body-full private input/output, and prohibited private evidence must never be placed in public GitHub. If such bytes are required for reconstruction, store them in an approved durable private destination and record only the non-secret immutable object identity and retrieval owner in GitHub.

Do not omit all durable recording merely because one subset is private. Publish the public-safe checkpoint and explicitly identify the private gap.

# 5. STOP is also recorded

A failed review or consumed STOP is durable project knowledge. Record the exact blocker, affected artifact identity, lifecycle counters, performed and unperformed effects, non-reuse boundary, and next safe action. Do not delete invalid artifacts when they are required to understand lineage. Label them immutable/noncredit instead.

If a checkpoint later needs correction, retain the old checkpoint unchanged and create an additive superseding record that names the old identity, exact error, corrected facts, and current owner. Do not make history disappear by rewriting the prior record.

# 6. Fresh verification before reporting preservation complete

After GitHub reflection, fetch each new or modified checkpoint path from GitHub and compare it to the prepared bytes. Confirm that the write-commit changed-path set contains no unapproved path and that the latest branch/head contains all checkpoint artifacts.

Preservation is incomplete until this fresh remote verification passes.

# 7. Emergency handoff behavior

If a context-limit warning, output-limit failure, tool degradation, or likely forced session transition is observed, stop new technical expansion and immediately flush the current checkpoint using already-confirmed facts. Do not wait for Mash to request a handoff.

If termination happens before the flush completes, the next session must treat everything after the latest verified durable checkpoint as unverified/lost until independently reconstructed.

# 8. Relationship to other owners

- `07_latest_snapshot_diff.md` remains the current technical-state owner.
- `11_cocolon_github_transport_and_session_continuity.md` remains the GitHub reflection method/completion owner.
- this file owns continuous recording cadence, minimum reconstruction content, and emergency handoff behavior.
- detailed task evidence belongs under `EmlisAIの実装済み資料/documents/` or the applicable implemented-document owner.

This rule does not authorize technical execution, product progression, or automatic approval. It only prevents confirmed work from disappearing with a session.
