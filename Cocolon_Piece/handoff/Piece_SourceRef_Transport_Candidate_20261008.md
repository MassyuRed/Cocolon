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
