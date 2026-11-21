# Full CE9 — actual raw, meaning and person-facing prose, 2026-10-28 JST

Root read both entire raw texts and exact source/prior/teacher inputs. One read-only helper independently reviewed both outputs; another helper hit model capacity and supplied no new output review. Neither helper review is formal Pro/Ultra/human acceptance. No output repair, teacher change or reader relaxation.

## Actual result and the narrower decoder diagnostic

| Case | Tokens / seconds | EOS / ordinary JSON | Actual receipt → engine | Meaning / body |
|---|---|---|---|---|
| BOOK | 2710 /122.82842515397351 | true / complete | INVALID_FORMAT → REJECT/semantic_receipt_not_validated | 0 /0 |
| SHOP | 3489 /156.48039048002101 | true / complete | INVALID_FORMAT → REJECT/semantic_receipt_not_validated | 0 /0 |

Both restore root JSON closure compared with joint_focus9 and reach three prose fields without repetition loops. Actual CMEE CPU1.9522868969943374s/model0/SQL0, adopted snapshots0, cold N/A. Ordinary JSON completion is not the named candidate contract. A separate read-only call of the exact unchanged strict named decoder against the untouched raw gives BOOK `undefined_named_reference` and SHOP `duplicate_or_invalid_quote_name`. It neither repairs outputs nor reruns semantic admission. Semantic issues below are static reading, not later engine refusals that never occurred.

## BOOK

q10 uses ten unique legal names; quote names matching claim names are legal. Nine quotes match a specified source/field; continuing_concern wrongly uses nonexistent field `answer_explains_target`. late_awareness and returned duplicate the same answer coordinate47–56, 「本は返したのですが」. The original four claims and s0/s1/p0 identities are retained, but additional roles are misbound: self_statement gets the entire first explanation, late_awareness gets the returned-book clause, no_contact gets counterfactual/current-concern text, counterfactual gets the weekend-return statement. no_contact.time.expr is the right time phrase but its evidence contains a different clause. Counterfactual time recovers ANSWER_TIME compared with joint_focus9, while the assigned meaning remains wrong.

Seven relations are written. answer_explains_target now correctly starts from remaining_concern with AFFIRMED polarity, and returned_concession starts from returned. These correct the previous self-edge/NEGATED and wrong source role. But action_link still cites an answer quote instead of the original action connection, memo_link cites a partial clause, awareness_time is backed by the wrong returned-book quote, statement_concession starts from counterfactual instead of self_statement, and connection scopes remain insufficient.

Six ADDs in expected order and one INVALIDATE_GAP use correct prior/target and unique update IDs with matching ur7. Each ADD replaces only its claim. Required attached relations for no_contact and continuing_concern are absent. GAP.ev contains relation ID `answer_explains_target`, which has no q definition, producing the unchanged decoder’s first error. Additional evidence/field defects remain even if that first error were fixed; no repaired candidate is evaluated.

Observation restates the original memo instead of the newly clarified concern. Reception replays the person’s answer in first person, including fragments 「ことです。本は返したのですが。」, and is not a response addressed to that person. Update_note lists added raw facts rather than naturally recording that the lingering concern is failing to contact the friend when delay became known. Three completed values are not person-facing reception. cr/rr/ur names remain within their expected defined namespaces, but their underlying meanings are wrong.

## SHOP

All15 quote triples locate exactly in their specified source/field, with distinct quote coordinates. However, q names felt_left_behind/shared_talk/perceived_realization each occur twice. Claims15 have the same three repeated IDs (12 unique); relations6 have answer_concession twice (5 unique), and original action_link is missing. This is a regression in identity/role coherence from the previous q12/claims11/relations6 unique output.

Meaning is fragmented: perceived_realization is split into a time phrase and a partial realization clause; shared_talk is repeated as the fragment 「二人で話していた未来が」; felt_distance becomes only 「あの話を一緒にしていた頃から」. A connection is incorrectly added as claim answer_explains_target with invalid modality value ANSWER_EXPLAINS_TARGET. answer_joy includes 「のに」 and uses the wrong time kind. The full negative scope for the two denied premises is not quoted. Duplicating felt_left_behind from both old memo and answer also makes preservation of the original perception ambiguous.

Eight updates contain seven ADDs and GAP, matching the expected count only. Five ADD bodies are identical except for$id: shared_talk/perceived_realization evidence replaces past_reference/answer_concession repeatedly. These are not the required seven added roles; denied joint preparation/promise, joy, distance and sadness do not receive the corresponding additions. Other replacements omit claims or mix relations; GAP evidence mixes old/answer perceptions. Correct prior/target and unique update IDs do not establish valid updates.

Observation copies the past shared-conversation sentence and the later realization/perception sentence, omitting the preparation/promise denial, Reception copies the joy/sadness sentence, and update_note repeats Reception’s latter clause. The first-person endings 「あるんです」「感じました」「寂しかったです」 remain the person’s voice. Sadness, absent from the previous three prose values, now appears, but this is raw replay rather than an Emlis response receiving both joy and sadness. The teacher’s distinction between shared conversation and denied joint preparation/promise disappears from the prose. Binds do not cure missing/duplicate underlying claims or relation ambiguity.

## What the contrast establishes

Under the same15 exact prompt/teacher bytes, original284f, API7b9, nine update order/LR and two generation conditions, removing custom weighting restores JSON closure but does not establish grounded role/quote/update correspondence or natural reception. No adoption improves. This is not proof that more ordinary-CE steps, a different initial adapter, unseen inputs or4B in general would give the same result. Training losses from this ordinary CE and the previous weighted objective are not numerically interchangeable.

The next one-factor candidate is to examine original d431 initialization instead of284f while retaining the current teacher/API/full CE/schedule.284f already includes a failed old-named13 learning stage; inherited role errors are a hypothesis to isolate, not a proven cause. d431 itself had new6 body0, so rollback is not a success prediction. No such new GPU run is prepared/started here. Another coefficient/LR/step change would not follow from this contrast alone.

Additional observation is not needed to supply the fixed cases’ expected meaning or prose: the completed teachers already contain them. General observation quality, unseen evaluation and Piece/Analysis material gaps remain separate. New0ec6 is NOT ADOPTED and is preserved with all originals; original284f/d431/previous candidates remain untouched. Closed once-run/no retry/extra generation/automatic next run. Product0/formal0/3/54.50%, candidate_ready=false, automatic_progression=false, GPU held/lifecycle0.

## Reporting correction

During progress reporting, root misread the screen’s intermediate optimizer count as7 instead of5, and BOOK tokens as2869 instead of2710. Both were corrected after reading the screen/raw, with no change to execution or raw evidence. Final values here come from the recovered structured originals: actual9 updates, BOOK2710, SHOP3489. These reporting errors are not alternative run results.
