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
