> Current continuation: the final 2026-10-09 section adds authenticated-session bootstrap refresh and synchronizes the pending Piece entry/current map/manifest. Source-reference GET adoption and its code reflection are retained; production registration, activation and device acceptance are still excluded.

# Piece source_ref transport — inactive implementation candidate

Date: 2026-10-08 JST. Execution owner: Karen / GPT-6 Astra Pro / CHAT_PRO_OK.
State: TESTED_CANDIDATE_PATCHES_ONLY. These files are not applied to application source.

## What is ready, and what is not

The candidate connects an explicit authenticated source-reference GET to the existing RN preview request, controller, and full-text display. It does not add a production route, enable a feature, change InputScreen, deploy, migrate a database, or generate a native image.

The frozen PCE-6 API table does not define a source-reference retrieval URL. PCE-2 explicitly leaves the exact API response key/public route to a later binding. The proposed URL below therefore needs Mash's adoption decision; this record does not silently amend the frozen API contract. The user request to continue Piece work is not recorded as approval of this newly specified URL.

## Exact proposed binding

`GET /emotion/piece/source-ref/{saved_input_id}`

- Bearer authentication through the existing API owner; the existing saved-source adapter checks source ownership, current observation state, and revalidation.
- Canonical nonzero UUID path parameter. No query parameters or request body.
- Response is exactly the existing seven source_ref fields: source_input_id, source_input_version, source_input_bundle_commitment, emlis_observation_stage, emlis_observation_result_identity, question_need_decision_identity, supplemental_answer_identity.
- Original-only normal/pre-question stages. No supplemental answer, caller-owned tier, eligibility flag, raw input, Emlis body, Analysis inference, or owner ID in the response.
- Closed existing error codes and Cache-Control: no-store. No automatic retry, preview generation, database mutation, or quota consumption from this GET.
- A later preview POST independently revalidates. This response is not ongoing access, safety approval, renderer admission, save authority, or an effective feature flag.

The backend candidate uses a separate source_ref_router. Neither api_piece_v2.router nor app.py includes it. The RN candidate has an explicit requestPieceSourceRef method; no existing screen calls it. The original preview POST request, response and retry-key contract are retained.

## Candidate files and application bases

Apply only after scope adoption and fresh preimage checks, separately per repository. Do not treat the existence of these patch files as source application.

| Patch | Target repository / base | Target source/test paths |
|---|---|---|
| Piece_SourceRef_HTTP_Candidate_20261008.patch | MassyuRed/mashos-api at 93c26f7c6f76963a10dc349dce2ef7b81654f96f | New ai/services/ai_inference/piece_v2_source_ref_http.py and ai/tests/piece_v2/test_b05_source_ref_http_candidate.py |
| Piece_SourceRef_RN_Candidate_20261008.patch | MassyuRed/Cocolon at c78b0b1f8a7eee0cb7a7ef46f0500f93d121570d | Modify features/piece/pieceApi.js; add tests/piece-v2-source-ref.test.js |
| Piece_SourceRef_DocSync_Candidate_20261008.patch | Same Cocolon base | Existing Piece read-first, current structure map, and manifest; no older evidence removed |

The documentation patch is also unapplied. It records the already reflected internal source_ref, unregistered preview POST, detached RN display, and separately the newly tested transport candidate. It does not create approval or a new Gate.

## Actual checks

- HTTP candidate: 36 tests passed using FastAPI/Starlette ASGI. The remote bearer verifier and saved-adapter result boundary are test doubles. Existing api_piece_v2.py full bytes match a395b19e33d9718f3e31189553fa8dcb35ef0bfa, and the contract matches e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa. The imported store copy is older 80ab568b2189b267c8cee39d1258b7c4ccf4cac9, not current 07cb82b113c0c8158e1b080e30095024d9fdad72; no store operation is called in this scope. This is not a full-current-backend integration result.
- RN candidate: 198 tests passed, comprising all unchanged prior 162 tests plus 36 new source-reference tests. No prior expectation was changed.
- Cross-language probe: the actual ASGI JSON response was consumed by five linked ESM application modules, then an explicit preview POST reached the existing modal with the exact full text and all three hashes matching. HTTP/session IO, React/RN primitives, lifecycle and time are doubles. VM Modules emitted its experimental warning.
- All three patches passed git apply --check and application to their exact local preimages; every resulting target byte sequence matched the tested/generated candidate.
- The first local HTTP run used shared-helper excerpts and passed 36 tests. That supplemental result is distinct from the later run using the full matching API file.
- The transferred HTTP patch has one additional ASCII space before its second diff header. Its remote blob is 07ce24ca73662b5401cdbf09f9c512937b4ff0c5. That exact transferred representation passed git apply --check and replay; both resulting source/test files are byte-identical to the tested candidate. No application code changed through this transport difference.

No claim is made for real Auth, Supabase/PostgREST, saved-state semantics, CMEE generation, native layout/image export, current full backend, CI, independent review, real device, product acceptance, or the October 10 milestone. The preceding backend 23-case projection result is history, not newly rerun evidence.

## Formal-document source verification

Recovered copies match these branch blobs:

- Cocolon_Piece/00_read_first.md: 5923b970b5bdfc2567a17b951ec393081b28c8ff
- Cocolon_Piece/manifest.json: ef62e730f69d09e87ae8c7d25907eb333f7e7f9f
- Cocolon_前提資料/current_structure/02_piece_current_structure.md: e83b25d8b6ece7176cf411763470cb0535eace45

The complete copies were used to generate and replay the bounded synchronization patch, preserving earlier sections. This does not assert that the entire application's historical maps were reread end-to-end, that fresh System Context prepare succeeded, or that formal document bodies have been remotely updated.

## Next bounded work

Obtain the adoption decision for this exact source-reference GET binding. Then apply and verify the candidate in each repository, connect server-effective flags and the saved/terminal input boundary to the existing InputPieceActionArea, and complete the same-input development-screen path. No synthetic enabled/eligible values may become application configuration.

Native visual preview and image extraction/save/share, capabilities/quota, and actual Auth/device checks remain unfinished. Approval of the GET binding alone is not approval for deployment, migration, production activation, payment, release, or changes to Emlis/Analysis ownership. automatic_progression=false.

## 2026-10-08 continuation — runtime prerequisite, separate from GET adoption

The runtime-only continuation applies the previously uploaded, locally tested B14-B candidate to three application/test paths in the same commit as this appendix. It does not apply any of the three source-reference candidate patches above. Their adoption status, API URL boundary and prior checks remain unchanged.

Base: Cocolon `f2e9343da68e32b512beb0bd39ce1ba8622f6ec7`, tree `a6c309efbc85cbd0c1608e9618e6e336392ff25e`. The four commits after the earlier `c78b0b1f` baseline added only these source-reference handoff files. Fresh checks preserved all eight prior preview source/test blobs and verified the existing AppRuntimeContext preimage `720cd7a747061adf280ff8c12f654d4e1a6be1a2` and absence of the two new runtime paths.

| Applied path | Verified resulting Git blob | Scope |
|---|---|---|
| AppRuntimeContext.js | 2b61828af315bdbfa87715461cc0dc529bdfe79b | Existing bootstrap projection: exact Piece flags default OFF; pending/failure invalidation; latest-started refresh wins. Non-Piece defaults/version/child placement retained. |
| features/piece/pieceRuntime.js | 9e32f43671f975f53c1eb1998d3e0a40bcecfb9b | Pure RN presentation projection of the eight existing PCE-7 names. Missing, invalid and unknown Piece flags cannot inherit generic fallback=true. No authorization or readiness computation. |
| tests/piece-v2-runtime.test.js | 923a566c080c36ceab1a56bd20df6bb255cf5e0b | Previous candidate's 27 cases, unchanged; not 27 newly written tests in this continuation. |

Re-executed in this continuation with Node v22.16.0:

```text
node --test tests/piece-v2-contracts.test.js tests/piece-v2-state-models.test.js tests/piece-v2-preview-display.test.js tests/piece-v2-runtime.test.js
189 passed / 0 failed / 0 skipped / 0 cancelled
```

This is the unchanged prior 162 plus the prior runtime candidate's 27. It is separate from the earlier source-reference candidate's 198-case result above; they are not combined or presented as a new HTTP integration run. React hooks, JSX linkage, HTTP and native primitives are test doubles. Git blob identities tie the applied code to the locally tested full bytes. Real React reconciliation, Hermes/native device, live HTTP/Auth/DB, CI, full repository and independent review remain unverified.

The current API branch was rechecked at `93c26f7c6f76963a10dc349dce2ef7b81654f96f`. Its `api_app_bootstrap.py` still returns no Piece flags. This RN change therefore leaves Piece OFF; it neither supplies nor enforces server flags and does not make InputScreen or native image export usable. Foreground/session bootstrap refresh and PIECE_FEATURE_DISABLED handling also remain unfinished. The existing provider placement and bootstrap gate files are unchanged.

Formal-document synchronization remains incomplete: this appendix updates the existing handoff, not the canonical Piece entry/current map/manifest or overall map bodies. The source-reference DocSync patch remains unapplied and must be reconciled with this runtime addition, not blindly replayed as a complete synchronization. Current entry identity was freshly checked, but the recovered local entry/manifest copies in this continuation did not match the current entry/manifest identities; they were not written over the remote originals. Overall maps were retrieved and relevant roles/path indexes checked, but not every historical map line was reread. Fresh System Context prepare was not executed. None of these missing checks is credited as complete.

Next work stays on the same saved-input-to-preview path: reconcile canonical documentation, obtain the separately required GET-binding decision before applying that candidate, implement server-effective flag supply/enforcement, and connect the saved/terminal input boundary to InputScreen. No source_ref, enabled or eligible value may be fabricated from raw/Emlis text. Native image creation/extraction/save/share and actual device checks remain unfinished. The October 7 screen connection and October 10 completion targets are not credited by this runtime-only step.

This continuation changes no backend, database, environment variable, dependency, deployment, build, production feature activation, main branch, merge, user data, Emlis or Analysis ownership. automatic_progression=false. Branch publication and subsequent remote verification are recorded in the continuation result; blob creation alone is not treated as a branch update.


## 2026-10-08 continuation — foreground bootstrap refresh

Execution owner: Karen / GPT-6 Astra Pro / CHAT_PRO_OK. Base: `b03311fdfce6c26c2790d86c43f4639aa6e40baf`. This is the existing PCE-7 section 12 foreground-freshness requirement, within Rule 18 section 0 / existing Piece delegation. It does not adopt the pending source-reference URL or activate Piece.

The existing AppRuntimeContext now observes AppState. Leaving active invalidates the eight Piece presentation flags and fences pending bootstrap results. Returning active starts one existing `/app/bootstrap` read; duplicate active events and background events start no additional read. Piece remains OFF until a successful current active-state response. Initial active startup remains with the existing AppRuntimeBootstrapGate. The effect cleanup removes its listener and fences late results without writing React state; an interrupted bootstrap is restarted on effect setup replay so the existing gate's single-flight guard cannot leave loading stuck.

No Piece preview is generated, retried, saved or exported by a lifecycle event. The existing full-text host is only composed with this runtime in tests, not mounted into InputScreen. AppRuntimeContext retains its public interface, provider/child placement, non-Piece defaults and version parsing. The shared bootstrap now refreshes normal app metadata on foreground as well; a pre-boundary response is ignored as a whole, not just its Piece fields. This impact is explicit, not claimed to be a Piece-only network payload.

Changed existing code/test paths and tested blobs:

| Path | Git blob |
|---|---|
| AppRuntimeContext.js | ad9bb85fd56a7863ce7f1b1b1afb0327d2a93bd7 |
| tests/piece-v2-runtime.test.js | 77e6417cc3646989add93621d9eea4f6f57a4aa2 |

The third changed path is this existing handoff. The eight earlier preview paths and the pure pieceRuntime owner are unchanged. STRUCTURE_MAP_DELTA_NONE for this bounded extension: the same existing bootstrap/provider/Piece projection owners, application interfaces, routes and test owner remain; only lifecycle-triggering inside AppRuntimeContext changes, using the already installed React Native AppState. This statement does not erase the earlier uncompleted registration of runtime/preview owners in the canonical documents.

Verification: Node v22.16.0, `node --test tests/piece-v2-contracts.test.js tests/piece-v2-state-models.test.js tests/piece-v2-preview-display.test.js tests/piece-v2-runtime.test.js`: **203 passed, 0 failed, 0 skipped, 0 cancelled**. This is prior 189 plus 14 new regression cases. The original 27 runtime test bodies and expectations are byte-unchanged; their harness gained explicit AppState and effect-scheduling doubles. Before the implementation, the first 13 new cases failed while those 27 passed. The first implementation passed 202 total; the added interrupted-bootstrap case then failed (runtime-only 40 pass / 1 fail), and its production fix produced the final 203. No existing expectation was weakened. A separate preimage patch replay passed git apply --check, produced the same three target byte sequences, and passed the same 203; repeat runs are not added together.

React hooks, JSX linkage, effect replay, AppState, HTTP and native UI primitives are doubles. The simulation is not real React reconciliation/StrictMode, Hermes, actual OS lifecycle, device, actual HTTP/Auth/DB, CI, full-repository or independent-review evidence. There was no live session, user input, configuration activation, dependency installation or backend modification.

Source reading used the current work-attitude entry/Rule 18, permanent incident, System Context direct-original fallback, three-core/Piece maps, overall AppRuntime roles, October 3 weekly plan already read in this conversation and its latest-entry check, current source/handoff and the matching prior full-byte artifacts. A fresh System Context prepare and full historical-map audit were not completed. Canonical Piece entry/current-map/manifest synchronization remains outstanding, separately from this in-place foreground extension. The pending source-reference DocSync patch must include both runtime continuations when reconciled; it remains unapplied.

Next direct work remains the saved-input-to-preview connection: canonical document synchronization, adoption of the already prepared source-reference GET binding, server-effective flags and per-operation enforcement, and InputScreen wiring. Authenticated-session refresh and PIECE_FEATURE_DISABLED handling are still incomplete; foreground freshness alone does not close B14-B. Native image creation/extraction/save/share, actual device checks, formal product acceptance and the October 10 completion target remain uncompleted. No backend/DB/env/deploy/build/main/merge/activation/legacy Q&A/Emlis/Analysis changes. automatic_progression=false.


## 2026-10-08 continuation — source-reference GET applied to non-running code

Execution owner: Karen / GPT-6 Astra Pro / CHAT_PRO_OK. The current continuation
followed the immediately preceding proposal to adopt the exact GET binding and
apply its prepared candidate to non-running code, explicitly excluding live DB,
deployment and activation. It is used only for that bounded scope, not as blanket
approval of other API contracts, effective server flags, production registration
or release. Earlier adoption-pending statements above describe earlier turns.
The additional API binding is recorded in the existing PCE-6 API document,
`pce6_api_db_rn_migration/Piece_API_CleanCutover_Design_20260808.md` section 11.

API application: `0312a0fc3b07f8e46344d5746cafd7760458badd`, parent
`93c26f7c6f76963a10dc349dce2ef7b81654f96f`. The branch update and its two-path
compare were read back. RN application is included in this Cocolon revision,
whose parent is `467cc5890055caa6366eede3f602248b14e55c13`.

| Applied path | Exact Git blob |
|---|---|
| API ai/services/ai_inference/piece_v2_source_ref_http.py | 0f4471d519438b985c8b56c05ddc041d1a2dee9e |
| API ai/tests/piece_v2/test_b05_source_ref_http_candidate.py | e40e26774159f99b117fe072cf0bceca0d158a58 |
| RN features/piece/pieceApi.js | f549579d37ac6e986b1d90adf9883d7762880208 |
| RN tests/piece-v2-source-ref.test.js | 0f600d9ada528294b11d858d5b86443f0033500e |

The GET returns only the existing seven original-source references after shared
HTTP authentication and the existing saved adapter's current-state revalidation.
It accepts neither source body nor caller owner/tier/eligibility. It creates no
preview, record or quota effect. Missing/extra/malformed responses are rejected.
RN checks its expected session before and after IO, preserves the reference
snapshot, and can pass it to the unchanged preview request on a separate explicit
action. Existing POST request/key semantics, full-text model/controller/modal,
strict flags and foreground refresh are retained; their source bytes are unchanged
apart from the explicitly listed pieceApi transport extension.

### Actual execution evidence

- HTTP: 36 passed, zero failures. Python 3.13.5, FastAPI 0.128.2, Starlette 0.50.0,
  httpx 0.28.1, pytest 9.0.2. Actual ASGI routing and handler; remote bearer and
  saved-adapter result boundaries are doubles. The unrelated top-level
  cancel_piece_preview store import is a never-call double in the local runner.
  Current api_piece_v2.py full bytes match a395b19e33d9718f3e31189553fa8dcb35ef0bfa,
  and full piece_v2_contract.py matches e4d20c9d0994b0a05f086ff6543de9d5cf2f31aa.
  This does not execute the current real store, real saved adapter, DB or CMEE.
- RN: 239 passed, zero failures/skips/cancellations, Node v22.16.0. This combines
  unchanged prior 203 tests and the previously prepared source-ref candidate's
  36 tests; it is not 36 newly repaired defects. Command: node --test
  tests/piece-v2-contracts.test.js tests/piece-v2-state-models.test.js
  tests/piece-v2-preview-display.test.js tests/piece-v2-runtime.test.js
  tests/piece-v2-source-ref.test.js. No existing expectation was relaxed.
- The real ASGI normal/pre-question responses were also consumed by four real
  linked ESM modules: pieceApi, piecePreviewModel, PieceCreateController and
  PiecePreviewModal. Both stages preserved the complete displayed text, content
  payload and three hashes after a separate explicit preview POST. Session/HTTP,
  React/RN primitives, the preview response and time were synthetic. VM Modules
  reported its experimental warning. This is not InputScreen or native evidence.

The original HTTP/RN candidate patches remain historical and must not be reapplied
to these source paths. The code comments distinguish unregistered implementation
from a live endpoint. The separate source_ref_router remains absent from both
api_piece_v2.router and app.py. Existing InputScreen has no new caller. No server
flag is supplied or enabled by this change.

### Documentation and remaining work

The PCE-6 API document and this existing handoff are updated. Canonical Piece
entry/current-map/manifest synchronization is still NOT APPLIED. Complete matching
preimages were recovered, and a revised three-document patch and full resulting
files were prepared with prior history retained. Their hashes and exact patch are
included in the continuation artifact. Preparation is not canonical publication;
no current navigation/manifest success is claimed. The earlier remote DocSync
patch predates both runtime continuations and GET adoption and must not be blindly
applied. Reconcile that pending synchronization with the actual source blobs above.

System Context prepare was attempted and failed because the partial materialized
copy lacks tools.cocolon_context. The existing technical owner's direct-original
fallback was used. Current rules and mandatory incident, the October 3 weekly
policy, app/current maps and relevant real source were consulted; a fresh complete
System Context or whole historical-map/source audit is not claimed.

Next direct work is authoritative server-effective flag supply/enforcement and
saved-input InputScreen wiring along the same preview path, with canonical document
synchronization still owed. Session-change refresh, PIECE_FEATURE_DISABLED handling,
capabilities/quota, native image creation/extraction/save/share, live Auth/DB/device
checks and product acceptance remain unfinished. Source references cannot stand in
for enabled/eligible/safety or renderer decisions. No DB/env/deploy/build/dependency/
main/merge/activation/user-data/Emlis/Analysis change. The October 10 completion
milestone is not credited. automatic_progression=false.


## 2026-10-09 continuation — authenticated-session bootstrap freshness

Execution owner: Karen / GPT-6 Astra Pro / CHAT_PRO_OK, single execution owner.
Base Cocolon: `8297b2a76c172ec6550424accd62506dfa896b2d`.
Code reflected and read back: `1492c9c875485809789b4ebaf7fa33403b2ea2fe` (source/test exact2).
The four documentation paths are synchronized in this following revision.
Base API read-only check: `fa174b8ffd308be1374cc4bacc108e3eff0e2c6b`.
The Cocolon compare since `df88a0e0` contained only the three Analysis documents;
all preceding Piece code is preserved. The API compare since `0312a0fc` contains
Emlis/Analysis changes, not a new Piece route/flag implementation. No API write
belongs to this continuation.

### Scope fixed before publication

This closes the existing PCE-7 section 12 client-session-refresh gap within the
October 3 weekly review's same-input-to-preview path, not a new auth subsystem.
Only AppRuntimeContext.js, tests/piece-v2-runtime.test.js, this existing handoff,
Cocolon_Piece/00_read_first.md, Cocolon_前提資料/current_structure/02_piece_current_structure.md
and Cocolon_Piece/manifest.json are publication targets. The latter three also
reconcile the preceding continuation's still-unapplied document patch. Existing
history is retained. Source-ref HTTP/RN patches must not be reapplied.

### Implemented behavior

The existing provider observes the existing Supabase client without changing
AuthProvider or provider order. An auth event synchronously clears the eight
Piece presentation flags and fences pre-event bootstrap results. A zero-delay
callback makes the existing auth:false bootstrap read outside the auth callback.
The callback never inspects or retains session payloads, tokens, user IDs or
metadata, and no auth event grants authorization or supplies an effective flag.

Event bursts replace one queued callback. Explicit/foreground refreshes cancel
the pending duplicate. Backgrounding and cleanup cancel it; obsolete callbacks
cannot clear a later timer or send requests. Effect setup replay restarts an
interrupted queued refresh as well as the already supported in-flight refresh.
Failures remain OFF without auto-retry. Non-Piece defaults/version semantics and
child placement are unchanged. Shared bootstrap metadata is refreshed too.

The existing preview host hides a displayed body after invalidation. A later
bootstrap success permits only a new explicit action, never automatic preview
regeneration, save, export or resurrection of the previous body. The source-ref,
POST body/key, canonical text/content/recipe and three-hash contracts are unchanged.

| Changed source/test | Exact resulting Git blob |
|---|---|
| AppRuntimeContext.js | a066c2e8b2002992bff718c3e371824fcac71a22 |
| tests/piece-v2-runtime.test.js | 4e182649cd2e039a6f32c688bf1d35c2d4027012 |

### Actual verification and limits

Node v22.16.0. Baseline five-suite run: 239 PASS. Final five-suite run: 260 PASS,
FAIL/SKIP/cancelled 0. New cases: 21. The first 20 cases produced 16 FAIL / 4 PASS
against the prior source, while the existing runtime 41 all passed. One later
obsolete-timer case failed against the first implementation (61 PASS / 1 FAIL)
and passed after the timer identity fix. Prior test bodies/expectations are
unchanged; only the existing runtime harness gains auth/timer doubles. The final
identical 21 new cases were also rerun against the original source: 17 FAIL /
4 PASS, while all 239 pre-existing cases passed (243 PASS / 17 FAIL total). Repeated
runs and patch replay are not added to these counts.

React hooks/JSX, auth event delivery, timers, HTTP and native components are
synthetic boundaries. This is not real Supabase authentication, React/StrictMode,
Hermes, OS lifecycle, actual HTTP/DB, CI, full-repository, independent-review or
product-acceptance evidence. The earlier HTTP36 and ASGI-to-ESM results are history,
not newly executed API results in this continuation.

Supabase's official onAuthStateChange reference was checked for the synchronous
callback and unsubscribe interface. The changelog markdown fetch was rejected by
the web transport and the HTML index was unavailable; no claim of a complete
changelog review is made. No SDK version or dependency is changed.

### Documentation, read scope and remaining work

The complete pending document preimages match the fresh GitHub identities:
entry 5923b970b5bdfc2567a17b951ec393081b28c8ff;
map e83b25d8b6ece7176cf411763470cb0535eace45;
manifest ef62e730f69d09e87ae8c7d25907eb333f7e7f9f.
Their old content and the supplied pending source-ref sections are retained, with
this new state appended. The manifest binds the resulting complete entry/map.
Publication success is established only by the subsequent branch/path/blob readback.

The mandatory incident, current work rules/Rule18, System Context technical
entry/direct-original fallback, current three-core/Piece maps, applicable overall
map entries, October 3 weekly policy and relevant source were consulted. Fresh
prepare failed: tools.cocolon_context is absent from this partial materialization.
No fresh full historical-map or whole-source audit is claimed.

Next direct gaps: authoritative server-effective flag supply and operation-time
enforcement, saved-input InputScreen wiring and PIECE_FEATURE_DISABLED handling.
Capabilities/quota, real Auth/DB/device flow, native image creation/extraction/
save/share, release cutover and formal product acceptance remain unfinished.
The October 10 target and B14-B as a whole are not credited. No live DB, env,
deploy, build, dependencies, main/merge, activation, user data, old Q&A, Emlis or
Analysis writes. automatic_progression=false.
