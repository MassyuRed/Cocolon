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
