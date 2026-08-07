---
doc_id: cocolon_continuous_work_recording_and_emergency_handoff
title: "Cocolon continuous durable work recording and emergency handoff"
revision_date: "2026-08-07"
normative_status: "CURRENT"
decision_owner: "Mash"
operational_owner: "Karen"
automatic_progression: false
---

# Purpose

This is the canonical rule for preserving Cocolon work against sudden context limits, Work/Codex termination, tool failure, or forced session changes. A session-ending request from Mash is not a prerequisite for preservation.

# 1. Durable accumulation is part of the work

Work is not complete merely because a local file was created, a hash was calculated, a review was performed, or a STOP was reported.
Reusable work exists only after the result and its reconstruction inputs are stored in an approved durable destination and verified by a fresh remote read.

# 2. Incremental recording requirement

Karen must record work state during the task whenever any of the following occurs:

- a material artifact is created or frozen;
- a review identifies a blocker or changes the next action;
- an authority is approved, activated, consumed, stopped, or closed;
- an execution produces a result that later work depends on;
- current / invalid / superseded status changes;
- local-only state is required to reconstruct the work;
- sudden session loss would cause material rework.

Do not wait for Mash to request a handoff.

# 3. Standing checkpoint-write authority

For public-safe administrative preservation only, the continuous-recording rule itself is a standing checkpoint-write authority when all conditions below hold:

- the underlying task scope has already been approved by Mash;
- the checkpoint only records or preserves confirmed work state;
- the destination is an existing premise, implemented-document, or task-specific durable owner;
- there is no code / DB / API / RN / migration / runtime change;
- there is no rule / contract mutation;
- there is no scope expansion or new technical owner;
- no secret or body-full private evidence is written to public GitHub.

This standing authority permits preservation only. It does not approve technical execution, product progression, PASS, credit, completion, closure, or automatic progression.

If no approved durable owner exists, or the preservation scope is unclear, do not treat the local artifact as complete. Record an owner/approval gap and STOP.

# 4. Required checkpoint contents

A checkpoint must preserve enough information to resume without chat-only facts:

1. current repository identity;
2. current authority / STOP / PASS lifecycle where relevant;
3. current, invalid, superseded, proposed artifacts separated;
4. actual artifact bytes or lossless durable bundle for local-only dependencies;
5. confirmed facts, unconfirmed facts, non-reuse boundaries;
6. exact next action and approval boundary;
7. privacy classification;
8. GitHub commit/final head/changed paths and fresh postwrite verification.

Do not turn this list into a requirement to create unnecessary ledgers for simple tasks. Preserve only what future continuation materially depends on.

# 5. Public / private boundary

Public-safe work records go to Cocolon GitHub under the applicable durable owner.
Secrets, credentials, body-full private input/output, and prohibited private evidence never go to public GitHub.

# 6. STOP is also durable knowledge

A STOP, failed review, invalid artifact, or noncredit result must not disappear if later work depends on understanding why it stopped.
Keep the blocker and next safe action, but do not promote preserved STOP evidence to success.

# 7. Fresh verification

After GitHub reflection, fetch the changed checkpoint path and confirm content, changed paths, and final head.
A write response alone is not preservation completion.

# 8. Emergency handoff

If context/tool/session failure risk appears, stop new expansion and preserve the latest confirmed state immediately.
The next session resumes from the latest fresh-verified durable checkpoint, not from chat memory or scratch state.

# 9. Relationship to other owners

- `work_attitude_rules_for_karen/00_read_first.txt` owns the small set of active behavior Gates.
- `11_cocolon_github_transport_and_session_continuity.md` owns GitHub reflection mechanics and the standing checkpoint-write boundary.
- this file owns durable-recording cadence and preservation semantics.
- task evidence belongs under the applicable task-specific durable owner, not automatically under EmlisAI documents.
