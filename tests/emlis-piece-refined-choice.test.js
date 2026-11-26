// Run with NODE_PATH pointing to the pinned RN contract-test dependencies.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const INPUT = '20000000-0000-4000-8000-000000000002';
const ANSWER = '30000000-0000-4000-8000-000000000003';
const OTHER_ANSWER = '30000000-0000-4000-8000-000000000004';
const OBSERVATION = '40000000-0000-4000-8000-000000000004';
const CREATE = 'この回答を含めてピースを作成';
const CREATE_CORRECTED = '説明を含めてピースを作成';
const CORRECTION = '50000000-0000-4000-8000-000000000005';
const INITIAL_OBSERVATION = '40000000-0000-4000-8000-000000000001';

function loadModal(native = {}) {
  const filename = path.resolve(__dirname, '../screens/input/EmlisThreadModal.js');
  const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, configFile: false, babelrc: false,
    presets: [require.resolve('@babel/preset-react')],
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code;
  const module = { exports: {} };
  Function('require', 'module', 'exports', code)(name => {
    if (name === 'react-native') return { StyleSheet: { create: x => x }, ...native };
    if (name === '../../ui/uiTokens') return { MODAL_ORIENTATIONS: ['portrait'] };
    if (name === '../../runtime/interpretationCorrectionUi') return require('../runtime/interpretationCorrectionUi');
    if (name === '../../components/CocolonButton') return p => React.createElement('Button', p, p.children);
    if (name === 'react-native-safe-area-context') return { SafeAreaView: 'SafeAreaView' };
    return require(name);
  }, module, module.exports);
  return module.exports;
}

function refined(text = '私は寂しかった。') {
  return {
    schema_version: 'cocolon.emlis_thread.application.v1', thread_id: 'saved-thread', revision: 6,
    state: 'COMPLETED', body_state: 'REFINED', can_write: true,
    original: { id: INPUT, memo: '褒められたのに、嬉しくなかった。' },
    current_observation: { event_id: OBSERVATION, text: 'Emlisが生成した返事です。' },
    timeline: [
      { event_id: 'initial', kind: 'OBSERVATION', round_index: 0, stage: 'INITIAL', is_current: false, text: '初回の返事です。' },
      { event_id: 'question-event', kind: 'QUESTION', round_index: 1, question_id: 'logical-question', text: 'どう受け取りましたか。' },
      { event_id: ANSWER, kind: 'ANSWER', round_index: 1, question_id: 'logical-question', text },
      { event_id: OBSERVATION, kind: 'OBSERVATION', round_index: 1, stage: 'REFINED', is_current: true, text: 'Emlisが生成した返事です。' },
    ],
    answer_saved: true, answer_assessment: 'RESOLVED', meaning_updated: true,
    pending_question: null, can_continue: false, can_retry: false, failure_code: null, issued_count: 1,
  };
}

function original() {
  const dto = refined();
  return { ...dto, state: 'AWAITING_ANSWER', body_state: 'PRE_QUESTION', answer_saved: false,
    answer_assessment: 'NOT_APPLICABLE', meaning_updated: false,
    timeline: dto.timeline.filter(e => e.kind !== 'ANSWER'), pending_question: dto.timeline[1] };
}

function corrected() {
  return { ...refined(), revision: 8, body_state: 'FINAL', answer_saved: false,
    answer_assessment: 'NOT_APPLICABLE', meaning_updated: false, issued_count: 0,
    correction_saved: true, correction_assessment: 'UNASSESSED',
    timeline: [
      { event_id: INITIAL_OBSERVATION, kind: 'OBSERVATION', stage: 'INITIAL', round_index: 0,
        is_current: false, is_disputed: true, text: '以前のAIの読みです。' },
      { event_id: CORRECTION, kind: 'CORRECTION', round_index: 0, assessment: 'UNASSESSED',
        text: '私は家族を守りたい。', target_event_id: INITIAL_OBSERVATION, target_text: '以前のAIの読み' },
      { event_id: OBSERVATION, kind: 'OBSERVATION', stage: 'CORRECTED', round_index: 0,
        is_current: true, text: '説明後のEmlisの返事です。' },
    ] };
}

async function mount(t, { dto = refined(), os = 'ios', props = {}, threadState = {} } = {}) {
  const routes = [], appStateListeners = new Set();
  const native = Object.fromEntries(['ActivityIndicator', 'KeyboardAvoidingView', 'Modal', 'ScrollView', 'Text', 'TextInput', 'View'].map(x => [x, x]));
  Object.assign(native, { Platform: { OS: os }, Alert: { alert: () => assert.fail('unexpected alert') },
    AppState: { currentState: 'active', addEventListener(_event, listener) {
      appStateListeners.add(listener); return { remove: () => appStateListeners.delete(listener) };
    } } });
  const Modal = loadModal(native).default;
  let root, thread;
  let values = { userId: 'owner', pieceEnabled: true,
    navigation: { getParent: () => ({ navigate: (...args) => routes.push(args) }), isFocused: () => true }, ...props };
  const render = () => React.createElement(Modal, { thread, colors: {}, ...values });
  thread = { visible: true, dto, draft: '', busy: false, error: '', uncertain: false, rejected: false, pendingAction: false,
    close() { thread = { ...thread, visible: false, dto: null }; root.update(render()); }, ...threadState };
  await act(async () => { root = Renderer.create(render()); });
  t.after(async () => { if (root) await act(async () => { root.unmount(); root = null; }); });
  return {
    get root() { return root; }, routes,
    button(label = CREATE) { return root.root.findAllByType('Button').find(b => b.props.children === label); },
    async thread(patch) { thread = { ...thread, ...patch }; await act(async () => root.update(render())); },
    async props(patch) { values = { ...values, ...patch }; await act(async () => root.update(render())); },
    async dismiss() { await act(async () => root.root.findByType('Modal').props.onDismiss()); },
    async appState(value) { await act(async () => { native.AppState.currentState = value; for (const fn of appStateListeners) fn(value); }); },
    async unmount() { await act(async () => { root.unmount(); root = null; }); },
  };
}

const { selectedPieceSupplementalAnswer } = loadModal();
const { selectedPieceCorrection } = loadModal();
test('a complete first explanation with its current corrected observation is a visible Piece choice', () => {
  const dto = corrected();
  assert.equal(selectedPieceCorrection(dto), dto.timeline[1]);
  assert.equal(selectedPieceSupplementalAnswer(dto), null);
  for (const mutate of [
    d => { d.state = 'REFINING'; }, d => { d.body_state = 'CORRECTION_UNREFLECTED'; },
    d => { d.body_state = 'CONTEXT_CHANGED'; }, d => { d.correction_assessment = 'NEEDS_DETAIL'; },
    d => { d.timeline[1].assessment = 'NEEDS_DETAIL'; }, d => { d.correction_saved = false; },
    d => { d.timeline.push({ ...d.timeline[1], event_id: OTHER_ANSWER }); },
    d => { d.timeline.push(refined().timeline[2]); }, d => { d.answer_saved = true; },
    d => { d.issued_count = 1; }, d => { d.current_observation.event_id = OTHER_ANSWER; },
    d => { d.timeline[2].stage = 'INITIAL'; }, d => { d.timeline[0].is_current = true; },
    d => { d.timeline[1].target_event_id = OTHER_ANSWER; }, d => { d.timeline[1].text = ' '; },
    d => { d.can_retry = true; }, d => { d.failure_code = 'save_result_unknown'; },
  ]) {
    const invalid = corrected(); mutate(invalid);
    assert.equal(selectedPieceCorrection(invalid), null, mutate.toString());
  }
});

for (const os of ['ios', 'android']) test(`the displayed explanation starts one Piece request bound to the corrected OBS (${os})`, async t => {
  const h = await mount(t, { os, dto: { ...corrected(), can_write: false } });
  assert.equal(h.button(CREATE_CORRECTED).props.disabled, false);
  const texts = h.root.root.findAllByType('Text').map(x => x.props.children);
  assert.ok(texts.includes('元の記録と、この説明を使います。'));
  const press = h.button(CREATE_CORRECTED).props.onPress;
  await act(async () => { press(); press(); });
  if (os === 'ios') { assert.equal(h.routes.length, 0); await h.dismiss(); await h.dismiss(); }
  assert.equal(h.routes.length, 1);
  const selected = h.routes[0][1].params.savedInput;
  assert.deepEqual(Object.keys(selected).sort(), ['expectedObservationIdentity', 'expectedStage', 'expectedUserId', 'idempotencyKey', 'savedInputId']);
  assert.equal(selected.expectedObservationIdentity, OBSERVATION);
  assert.equal(selected.expectedStage, 'corrected_observation');
  assert.equal(selected.savedInputId, INPUT);
  assert.doesNotMatch(JSON.stringify(h.routes), /家族|AIの読み|Emlis|50000000|40000000-0000-4000-8000-000000000001/);
});

test('an unreflected or additional correction cannot fall back to an original Piece action', async t => {
  for (const mutate of [d => { d.correction_saved = false; }, d => { d.body_state = 'CORRECTION_UNREFLECTED'; },
    d => { d.correction_assessment = 'NEEDS_DETAIL'; }, d => { d.timeline.push({ ...d.timeline[1], event_id: OTHER_ANSWER }); }]) {
    const dto = corrected(); mutate(dto);
    const h = await mount(t, { dto });
    assert.equal(h.button(CREATE_CORRECTED), undefined);
    assert.equal(h.button('ピースの作成').props.disabled, true);
    await act(async () => h.button('ピースの作成').props.onPress()); await h.dismiss();
    assert.equal(h.routes.length, 0); await h.unmount();
  }
});

test('an observed corrected DTO change invalidates dismissal even if an old DTO returns', async t => {
  const a = corrected(), h = await mount(t, { dto: a });
  const press = h.button(CREATE_CORRECTED).props.onPress;
  await act(async () => press());
  const b = corrected(); b.revision++; b.current_observation.event_id = OTHER_ANSWER; b.timeline[2].event_id = OTHER_ANSWER;
  await h.thread({ dto: b }); await h.thread({ dto: a });
  await h.dismiss(); assert.equal(h.routes.length, 0);
});
test('saved first answer is selected by its event identity, independently of the logical question identity', () => {
  const dto = refined();
  assert.equal(selectedPieceSupplementalAnswer(dto), dto.timeline[2]);
  assert.notEqual(dto.timeline[2].event_id, dto.timeline[2].question_id);
  assert.equal(selectedPieceSupplementalAnswer(original()), null);
});

const ineligible = {
  'unfinished update': d => { d.state = 'REFINING'; },
  'additional round offered': d => { d.state = 'AWAITING_CONTINUE'; d.can_continue = true; },
  'partial meaning': d => { d.body_state = 'PARTIALLY_REFINED'; },
  'unresolved answer': d => { d.answer_assessment = 'UNRESOLVED'; },
  'no meaning update': d => { d.meaning_updated = false; },
  'missing assessment': d => { delete d.answer_assessment; },
  'missing saved answer flag': d => { d.answer_saved = false; },
  'missing current observation': d => { d.current_observation = null; },
  'stale current observation identity': d => { d.current_observation.event_id = OTHER_ANSWER; },
  'initial observation marked current': d => { d.timeline[3].stage = 'INITIAL'; },
  'observation is round two': d => { d.timeline[3].round_index = 2; },
  'no current timeline observation': d => { d.timeline[3].is_current = false; },
  'two current observations': d => { d.timeline[0].is_current = true; },
  'pending question': d => { d.pending_question = d.timeline[1]; },
  'retryable failure': d => { d.can_retry = true; },
  'failure marker': d => { d.failure_code = 'save_result_unknown'; },
  'second question issued': d => { d.issued_count = 2; },
  'second answer present': d => { d.timeline.push({ ...d.timeline[2], event_id: OTHER_ANSWER, round_index: 2 }); },
  'second question present': d => { d.timeline.push({ ...d.timeline[1], event_id: 'second-question', round_index: 2 }); },
  'question identity differs': d => { d.timeline[2].question_id = 'different-logical-question'; },
  'answer is round two': d => { d.timeline[2].round_index = 2; },
  'question is round two': d => { d.timeline[1].round_index = 2; },
  'answer has no text': d => { d.timeline[2].text = '  '; },
  'answer identity is absent': d => { delete d.timeline[2].event_id; },
  'answer identity is not canonical': d => { d.timeline[2].event_id = ANSWER.toUpperCase().replace('30000000', 'AAAAAAAA'); },
  'zero answer identity': d => { d.timeline[2].event_id = '00000000-0000-0000-0000-000000000000'; },
};
for (const [name, change] of Object.entries(ineligible)) test(`refined choice is absent for ${name}`, () => {
  const dto = refined(); change(dto); assert.equal(selectedPieceSupplementalAnswer(dto), null);
});

for (const os of ['ios', 'android']) for (const answerText of ['私は寂しかった。', '今は、私は嬉しい。']) {
  test(`explicit displayed answer reaches Piece once without body material (${os}, ${answerText})`, async t => {
    const h = await mount(t, { os, dto: { ...refined(answerText), can_write: false } });
    const texts = h.root.root.findAllByType('Text').map(x => x.props.children);
    assert.ok(texts.includes(answerText));
    assert.ok(texts.includes('元の記録と、この回答を使います。'));
    assert.equal(h.root.root.findAllByType('Button').length, 2);
    assert.equal(h.button().props.disabled, false);
    assert.equal(h.routes.length, 0, 'display alone does not navigate');
    const press = h.button().props.onPress;
    await act(async () => { press(); press(); });
    if (os === 'ios') { assert.equal(h.routes.length, 0); await h.dismiss(); await h.dismiss(); }
    assert.equal(h.routes.length, 1);
    const [tab, route] = h.routes[0], target = route.params.savedInput;
    assert.equal(tab, 'Piece'); assert.equal(route.screen, 'PieceCreate');
    assert.deepEqual(Object.keys(target).sort(), ['expectedUserId', 'idempotencyKey', 'savedInputId', 'supplementalAnswerIdentity']);
    assert.equal(target.savedInputId, INPUT); assert.equal(target.expectedUserId, 'owner');
    assert.equal(target.supplementalAnswerIdentity, ANSWER);
    assert.match(target.idempotencyKey, /^piece-preview-[0-9a-f]{32}$/);
    assert.doesNotMatch(JSON.stringify(h.routes), /褒められた|寂しかった|嬉しい|Emlisが|logical-question/);
  });
}

test('unanswered source keeps the existing original action and exact three route fields', async t => {
  const h = await mount(t, { dto: original() });
  assert.equal(h.button(), undefined);
  assert.equal(h.button('ピースの作成').props.disabled, false);
  await act(async () => h.button('ピースの作成').props.onPress()); await h.dismiss();
  assert.deepEqual(Object.keys(h.routes[0][1].params.savedInput).sort(), ['expectedUserId', 'idempotencyKey', 'savedInputId']);
});

test('an answered source cannot fall back to an enabled original-only action', async t => {
  const dto = refined(); dto.answer_assessment = 'UNRESOLVED';
  const h = await mount(t, { dto });
  assert.equal(h.button(), undefined);
  assert.equal(h.button('ピースの作成').props.disabled, true);
  await act(async () => h.button('ピースの作成').props.onPress()); await h.dismiss();
  assert.equal(h.routes.length, 0);
});

for (const threadState of [{ busy: true }, { uncertain: true }, { rejected: true }, { pendingAction: true }, { error: '保存状態を確認できません。' }]) {
  test(`uncertain or pending thread cannot select its cached answer: ${Object.keys(threadState)[0]}`, async t => {
    const h = await mount(t, { threadState });
    assert.equal(h.button().props.disabled, true);
    await act(async () => h.button().props.onPress()); await h.dismiss();
    assert.equal(h.routes.length, 0);
  });
}

test('a stale rendered action cannot choose an answer from a later DTO', async t => {
  const h = await mount(t);
  const oldPress = h.button().props.onPress;
  const later = refined('今は、私は嬉しい。'); later.timeline[2].event_id = OTHER_ANSWER; later.revision++;
  await h.thread({ dto: later });
  await act(async () => oldPress()); await h.dismiss();
  assert.equal(h.routes.length, 0);
  await act(async () => h.button().props.onPress()); await h.dismiss();
  assert.equal(h.routes[0][1].params.savedInput.supplementalAnswerIdentity, OTHER_ANSWER);
});

for (const change of [d => { d.revision++; }, d => { d.original.id = OTHER_ANSWER; },
  d => { d.current_observation.event_id = OTHER_ANSWER; }, d => { d.timeline[2].event_id = OTHER_ANSWER; }]) {
  test(`dismissal rejects a changed hidden source: ${change.toString()}`, async t => {
    const h = await mount(t);
    await act(async () => h.button().props.onPress());
    const later = refined(); change(later); await h.thread({ dto: later });
    await h.dismiss(); assert.equal(h.routes.length, 0);
  });
}

test('owner and runtime changes discard a pending selection even when restored before dismissal', async t => {
  for (const patch of [{ userId: 'other-owner' }, { pieceEnabled: false }]) {
    const h = await mount(t);
    await act(async () => h.button().props.onPress());
    await h.props(patch); await h.props({ userId: 'owner', pieceEnabled: true });
    await h.dismiss(); assert.equal(h.routes.length, 0); await h.unmount();
  }
});

test('backgrounding, reopening, or unmounting discards the pending selected source', async t => {
  const background = await mount(t);
  await act(async () => background.button().props.onPress());
  await background.appState('background'); await background.appState('active');
  await background.dismiss(); assert.equal(background.routes.length, 0);
  const reopened = await mount(t);
  await act(async () => reopened.button().props.onPress());
  await reopened.thread({ visible: true, dto: refined() });
  await reopened.thread({ visible: false, dto: null });
  await reopened.dismiss(); assert.equal(reopened.routes.length, 0);
  const unmounted = await mount(t);
  const dismiss = unmounted.root.root.findByType('Modal').props.onDismiss;
  await act(async () => unmounted.button().props.onPress()); await unmounted.unmount();
  await act(async () => dismiss()); assert.equal(unmounted.routes.length, 0);
});


function correctedHistory() {
  const d = corrected(), final = '40000000-0000-4000-8000-000000000009';
  d.revision += 2;
  d.timeline[2].is_current = false;
  d.timeline.push({event_id:OTHER_ANSWER,kind:'CORRECTION',round_index:0,assessment:'UNASSESSED',
    text:'「私は資料を調べた」は取り消します。',target_event_id:OBSERVATION,target_text:'説明後のEmlisの返事'},
    {event_id:final,kind:'OBSERVATION',round_index:0,stage:'CORRECTED',is_current:true,text:'二回目の訂正後の返事です。'});
  d.current_observation = {event_id:final,text:'二回目の訂正後の返事です。'};
  return d;
}
test('multiple explanations are selected only with the complete chronological current observation chain',()=>{
  const d=correctedHistory();
  assert.equal(selectedPieceCorrection(d),d.timeline[3]);
  for(const mutate of [x=>{x.timeline[3].target_event_id=INITIAL_OBSERVATION;},
    x=>{x.timeline[1].assessment='NEEDS_DETAIL';},x=>{[x.timeline[1],x.timeline[3]]=[x.timeline[3],x.timeline[1]];},
    x=>{x.timeline[1].round_index=1;},x=>{x.timeline.splice(2,1);},x=>{x.timeline[0].is_current=true;}]){
    const invalid=correctedHistory();mutate(invalid);assert.equal(selectedPieceCorrection(invalid),null);
  }
});
test('all actual explanations are shown and creation remains bound to the final displayed OBS',async t=>{
  const d=correctedHistory(),h=await mount(t,{dto:d});
  const texts=h.root.root.findAllByType('Text').map(x=>x.props.children);
  assert.ok(texts.includes(d.timeline[1].text));assert.ok(texts.includes(d.timeline[3].text));
  await act(async()=>h.button(CREATE_CORRECTED).props.onPress());await h.dismiss();
  assert.equal(h.routes.length,1);
  assert.equal(h.routes[0][1].params.savedInput.expectedObservationIdentity,d.current_observation.event_id);
});

const CREATE_ANSWER_CORRECTED = '回答と説明を含めてピースを作成';
function answeredCorrected(rounds = 1, corrections = 1) {
  const id = n => `70000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
  const d = corrected(), timeline = [{ event_id: id(1), kind: 'OBSERVATION', stage: 'INITIAL', round_index: 0,
    is_current: false, text: '初回の返事です。' }];
  for (let i = 1; i <= rounds; i++) timeline.push(
    { event_id: id(10 + i), kind: 'QUESTION', question_id: `issued-${i}`, round_index: i, text: `質問${i}` },
    { event_id: id(20 + i), kind: 'ANSWER', question_id: `issued-${i}`, round_index: i, text: `私は回答${i}を伝えた。` },
    { event_id: id(30 + i), kind: 'OBSERVATION', stage: 'REFINED', round_index: i, is_current: false, text: `回答後${i}の返事です。` });
  for (let i = 1; i <= corrections; i++) {
    const target = timeline[timeline.length - 1];
    timeline.push({ event_id: id(40 + i), kind: 'CORRECTION', round_index: rounds, assessment: 'UNASSESSED',
      text: `本人説明${i}。`, target_text: target.text, target_event_id: target.event_id },
    { event_id: id(50 + i), kind: 'OBSERVATION', stage: 'CORRECTED', round_index: rounds,
      is_current: i === corrections, text: `訂正後${i}の返事です。` });
  }
  return { ...d, issued_count: rounds, answer_saved: true, answer_assessment: 'RESOLVED', meaning_updated: false,
    timeline, current_observation: { event_id: timeline[timeline.length - 1].event_id, text: timeline[timeline.length - 1].text } };
}
for (const rounds of [1, 2, 3]) for (const corrections of [1, 2]) {
  test(`corrected choice co-selects the latest real answer and current OBS (${rounds}/${corrections})`, async t => {
    const d = answeredCorrected(rounds, corrections), h = await mount(t, { dto: d });
    const answer = d.timeline.filter(e => e.kind === 'ANSWER').at(-1);
    assert.equal(selectedPieceSupplementalAnswer(d), answer);
    assert.equal(selectedPieceCorrection(d), d.timeline.filter(e => e.kind === 'CORRECTION').at(-1));
    const texts = h.root.root.findAllByType('Text').map(e => e.props.children);
    assert.ok(texts.includes(answer.text));
    for (const c of d.timeline.filter(e => e.kind === 'CORRECTION')) assert.ok(texts.includes(c.text));
    for (const a of d.timeline.filter(e => e.kind === 'ANSWER').slice(0, -1)) assert.ok(!texts.includes(a.text));
    assert.equal(h.button(CREATE_ANSWER_CORRECTED).props.disabled, false);
    await act(async () => h.button(CREATE_ANSWER_CORRECTED).props.onPress()); await h.dismiss();
    const target = h.routes[0][1].params.savedInput;
    assert.equal(target.supplementalAnswerIdentity, answer.event_id);
    assert.equal(target.expectedObservationIdentity, d.current_observation.event_id);
    assert.equal(target.expectedStage, 'corrected_observation');
    assert.equal(Object.keys(target).length, 6);
    assert.doesNotMatch(JSON.stringify(target), /本人説明|回答後|訂正後|issued-/);
  });
}
for (const mutate of [
  d => { d.answer_saved = false; }, d => { d.answer_saved = 1; },
  d => { d.meaning_updated = true; }, d => { delete d.meaning_updated; },
  d => { d.answer_assessment = 'UNRESOLVED'; }, d => { d.issued_count = 4; },
  d => { d.timeline[1].question_id = 'different'; }, d => { d.timeline[2].round_index = 2; },
  d => { d.timeline[3].stage = 'CORRECTED'; }, d => { d.timeline[4].target_event_id = d.timeline[0].event_id; },
  d => { d.timeline[4].round_index = 0; }, d => { d.timeline[5].round_index = 0; },
  d => { [d.timeline[2], d.timeline[3]] = [d.timeline[3], d.timeline[2]]; },
  d => { d.timeline.splice(1, 1); }, d => { d.timeline[0].is_current = true; },
]) test('an incomplete answer/correction chain cannot offer either partial source choice', () => {
  const d = answeredCorrected(); mutate(d);
  assert.equal(selectedPieceCorrection(d), null, mutate.toString());
  assert.equal(selectedPieceSupplementalAnswer(d), null, mutate.toString());
});
