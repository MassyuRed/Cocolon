# Joint focus9 — actual raw and product-facing reading, 2026-10-28 JST

Root read both complete raw texts, exact source/prior prompts and the two completed teachers. Two read-only helpers independently checked BOOK and SHOP. These checks are not formal Pro/Ultra/human acceptance. No raw or receiver repair. Static observations below are separate from the actual CMEE decision.

## Actual receiver and CMEE

| Case | Tokens / seconds | EOS | Actual receipt / engine | Meaning / body |
|---|---|---|---|---|
| BOOK | 2746 /117.04861651698593 | true | INVALID_FORMAT → REJECT/semantic_receipt_not_validated | 0 /0 |
| SHOP | 3017 /129.16070323099848 | true | INVALID_FORMAT → REJECT/semantic_receipt_not_validated | 0 /0 |

Both stop voluntarily, reach three prose value strings, and omit the final root `}`. String-aware bracket scanning finds only the root object at character0 unclosed; parse errors occur at EOF char9319/10239. We did not add a brace or pass a repaired candidate into CMEE. EOS is not JSON completion. Actual CMEE1.8309825280448422s, model0/SQL0, snapshot0/cold N/A. No semantic refusal beyond the receipt gate is asserted as an actual engine result.

## BOOK static reading

The visibly complete arrays contain q10/claims10/relations7/updates7 and three prose values. Root/s0/s1/p0 and original four claims are retained. Opaque q IDs matching claim names are legal and are not themselves errors. Specified source/field quote matching is9/10; continuing_concern uses nonexistent field `answer_explains_target`. late_awareness and returned duplicate the same answer coordinate47–56, 「本は返したのですが」. A named quote must not multiply one evidence row into separate evidence identities.

Added roles remain wrong: self_statement consumes the whole first explanation, late_awareness becomes the returned-book clause, no_contact becomes counterfactual-plus-current-concern, counterfactual becomes the no-contact clause. Its mode remains COUNTERFACTUAL_APPRAISAL but time is past-general rather than ANSWER_TIME. no_contact.time.expr is the right phrase, but its ev does not contain that time phrase. These are defects in meaning correspondence, not missing teaching material.

Original relation action_link cites the answer rather than the original action connection; memo_link cites a partial clause. answer_explains_target becomes no_contact→no_contact with NEGATED polarity instead of remaining_concern→no_contact/AFFIRMED. returned_concession starts from counterfactual; awareness_time starts from returned. Relation scopes are not adequately quoted.

ADD order improves to self→late→no_contact→returned→counterfactual→continuing, then GAP. Seven unique update IDs and all seven ur bindings correspond, with correct prior/target. But each ADD replacement contains only its claim; required attached relations are all absent, and GAP evidence is wrong. Seven entries do not establish seven valid updates. Typed cr/rr mixing and rr duplication seen previously are absent in this BOOK output.

Observation copies the old memo as a list. Reception enumerates the answer and repeats the no-contact clause. Update_note repeats it again and ends 「…まだちょっと気になる。を解釈しました。」, exposing implementation phrasing and broken grammar. The teacher instead receives the ongoing concern about failing to contact the friend when delay became known, acknowledges the returned book and counterfactual thought, and records the explanation of the concern. Three populated fields are not a natural response.

## SHOP static reading

The visibly complete arrays contain q12/claims11/relations6/updates9 and all three prose values. All12 quote triples match the specified source/field exactly and are unique. s0/s1/p0 are correct; undefined prior_q references disappear. The preceding 「そのように」 loop249 and token limit disappear. These are limited improvements in this fixed pair, not generalization evidence.

Original four claims, additional role text and three PERSON_PERCEPTION modes are mostly retained. But answer_joy includes the connective 「のに」 and uses past-general time instead of WRITTEN_PRESENT_IN_PAST_CONTEXT. The final four claims fail to bind the stated opening-time evidence; felt_distance.time.expr shifts to the period of past shared talk. The two negated claims lack the full negative-scope quote that the teacher supplies.

All six relations are listed, but action/memo quote only portions of the relevant connection. answer_concession cites the shared-talk sentence, answer_explains_target starts from answer_joy rather than felt_left_behind and cites joy, past_reference cites the entire shared-talk statement, and distance_link omits the sadness part of its connection evidence.

Required7ADD+GAP=8 becomes8ADD+GAP=9. Replacement destinations are crossed: shared-talk evidence replaces felt_distance, sadness replaces old memo_link, no_joint_preparation replaces past_reference, and two ADDs have empty replacement. GAP cites the old felt_left_behind quote. Prior/target and all nine ur names correspond, but the updates do not perform the required explanation additions. Reception/update_note cr mixes in relation ID answer_explains_target; update_note also duplicates answerjoy/distance/sadness cr entries. rr/ur point at defined names; namespace improvement does not correct the typed cr errors.

Observation says 「未来が友人側で現実になり」, shifting a personal perception toward objective fact. 「その頃からの距離が置いていかれたように感じた」 conflates perceived distance with feeling left behind. Reception recounts the history instead of receiving the person’s coexisting joy and sadness. Sadness is present as a claim but absent from all three Japanese prose values. Update_note is another chronological restatement instead of recording what the explanation clarified; 「一緒に準備したり、約束したりしなかった」 is also flatter than the original denial of a joint-preparation/promise premise.

## Consequence and next candidate

Compared with updates_first9, SHOP’s repetition and length failure are removed, while BOOK loses full JSON completion and added-role correspondence regresses. The full/ground/prose weighting does not jointly establish exact structure, grounded meaning, valid updates and natural reception. Closing-brace repair alone cannot solve the visible semantic/body defects. No raw repair, reader relaxation, extra generation or repeat training is justified by EOS/entry counts.

Next design work should use the existing teachers to address coherent whole-output closure and grounded role/relation/update correspondence together with a natural person-facing response; do not add another loss coefficient or rename opaque IDs on the unproven assumption that this alone is causal. The run does not prove4B capacity limits, a need for another observation session, or an improvement on unseen cases. New2952 adapter is not adopted. Original284f/d431 and all previous candidates remain intact. This new once-run is closed/consumed; no automatic next GPU run. Product0/formal0/3/54.50%, candidate_ready=false, automatic_progression=false, GPU held.
