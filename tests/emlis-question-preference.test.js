// Pinned emlis-q2-tools dependencies; real React hooks, explicit local storage.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const Renderer = require('react-test-renderer');
const babel = require('@babel/core');
const { act } = Renderer;
const ROOT = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
function load(relative, mocks) {
  const filename = path.join(ROOT, relative);
  const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, configFile: false, babelrc: false,
    presets: [require.resolve('@babel/preset-react')],
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code;
  const module = { exports: {} };
  Function('require', 'module', 'exports', code)(name => Object.hasOwn(mocks, name) ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
function fixture(overrides = {}) {
  const values = new Map(), calls = [];
  const storage = {
    async getItem(key) { calls.push(['get', key]); return overrides.getItem ? overrides.getItem(key, values) : values.get(key) ?? null; },
    async setItem(key, value) { calls.push(['set', key, value]); if (overrides.setItem) await overrides.setItem(key, value, values); else values.set(key, value); },
  };
  const persistence = load('lib/emlisQuestionPreferenceStorage.js', { '@react-native-async-storage/async-storage': { __esModule: true, default: storage } });
  const { useEmlisQuestionPreference } = load('screens/input/useEmlisQuestionPreference.js', {
    '../../lib/emlisQuestionPreferenceStorage': persistence,
  });
  let value, root, props = { userId: 'A', enabled: true };
  const renders = [];
  function Harness(p) { value = useEmlisQuestionPreference(p); renders.push({ owner: p.userId, enabled: p.enabled, ready: value.ready, value: value.value, capture: value.capture() }); return null; }
  return { calls, values, persistence, renders, get value() { return value; },
    async mount(next = props) { props = next; await act(async () => { root = Renderer.create(React.createElement(Harness, props)); }); },
    async update(next) { props = { ...props, ...next }; await act(async () => { root.update(React.createElement(Harness, props)); }); },
    async unmount() { await act(async () => root.unmount()); },
    async flush() { await act(async () => tick()); },
  };
}
const key = owner => `cocolon.emlisQuestionPreference.v1:${owner}`;

test('first use is ON; saved OFF survives a new screen and is separate for each account', async () => {
  const f = fixture(); await f.mount();
  assert.equal(f.value.ready, true); assert.equal(f.value.capture(), true);
  await act(async () => f.value.setValue(false));
  assert.equal(f.values.get(key('A')), 'false');
  await f.unmount(); await f.mount();
  assert.equal(f.value.capture(), false);
  await f.update({ userId: 'B' }); assert.equal(f.value.capture(), true);
  await f.update({ userId: 'A' }); assert.equal(f.value.capture(), false);
  for (const render of f.renders.filter((r, i, all) => i === 0 || all[i - 1].owner !== r.owner)) {
    assert.equal(render.ready, false, 'owner changes conceal the previous owner before effects');
    assert.equal(render.capture, null);
  }
  await f.unmount();
});

test('A to B to A ignores stale read completions and never submits the provisional default', async () => {
  const first = deferred(); let aReads = 0;
  const f = fixture({ getItem: async ownerKey => ownerKey === key('A') && ++aReads === 1 ? first.promise : 'false' });
  await f.mount(); const old = f.value;
  assert.equal(old.capture(), null);
  await f.update({ userId: 'B' }); assert.equal(f.value.capture(), false);
  await f.update({ userId: 'A' }); assert.equal(f.value.capture(), null);
  first.resolve('true'); await f.flush();
  assert.equal(f.value.capture(), false);
  await act(async () => old.setValue(true));
  assert.equal(f.calls.filter(x => x[0] === 'set').length, 0);
  assert.equal(old.capture(), null);
  await f.unmount();
});

test('a returning screen reads after the same owner unfinished write', async () => {
  const write = deferred();
  const f = fixture({ setItem: async (ownerKey, value, values) => { await write.promise; values.set(ownerKey, value); } });
  await f.mount(); const pending = f.value.setValue(false); await f.flush();
  assert.equal(f.value.ready, false); assert.equal(f.value.capture(), null);
  await f.unmount(); await f.mount();
  assert.equal(f.value.capture(), null);
  assert.equal(f.calls.filter(x => x[0] === 'get').length, 1, 'read remains behind pending write');
  write.resolve(); await act(async () => pending); await f.flush();
  assert.equal(f.value.capture(), false);
  await f.unmount();
});

test('read failure blocks submission and retry recovers the saved OFF choice', async () => {
  let failed = true;
  const f = fixture({ getItem: async () => { if (failed) throw Error('storage unavailable'); return 'false'; } });
  await f.mount();
  assert.equal(f.value.ready, false); assert.equal(f.value.capture(), null);
  assert.equal(f.value.error, '問いの設定を読み込めませんでした。');
  failed = false; await act(async () => f.value.retry()); await f.flush();
  assert.equal(f.value.capture(), false); assert.equal(f.value.error, '');
  await f.unmount();
});

test('write failure keeps the selected value, blocks submission and retries that same choice', async () => {
  let failed = true;
  const f = fixture({ setItem: async (ownerKey, value, values) => { if (failed) throw Error('storage unavailable'); values.set(ownerKey, value); } });
  await f.mount(); await act(async () => f.value.setValue(false));
  assert.equal(f.value.value, false); assert.equal(f.value.capture(), null);
  assert.equal(f.value.error, '問いの設定を保存できませんでした。');
  failed = false; await act(async () => f.value.retry()); await f.flush();
  assert.equal(f.value.capture(), false); assert.equal(f.values.get(key('A')), 'false');
  await f.unmount();
});

test('tutorial and signed-out lifetimes do no storage IO and stale callbacks cannot alter preferences', async () => {
  const f = fixture(); await f.mount(); const normal = f.value;
  const initialCalls = f.calls.length;
  await f.update({ enabled: false });
  await act(async () => { normal.setValue(false); f.value.setValue(false); });
  assert.equal(f.calls.length, initialCalls); assert.equal(normal.capture(), null);
  await f.update({ userId: '', enabled: true }); assert.equal(f.value.capture(), null);
  assert.equal(f.calls.length, initialCalls);
  await f.unmount();
});

test('corrupt values and non-boolean writes never coerce to an ON setting', async () => {
  const f = fixture(); f.values.set(key('A'), '0'); await f.mount();
  assert.equal(f.value.capture(), null); assert.ok(f.value.error);
  await assert.rejects(f.persistence.saveEmlisQuestionPreference('A', 'false'), /boolean_required/);
  await assert.rejects(f.persistence.loadEmlisQuestionPreference(''), /owner_required/);
  assert.equal(f.calls.filter(x => x[0] === 'set').length, 0);
  assert.equal(f.value.canChange, true, 'the user can explicitly replace a corrupt setting');
  await act(async () => f.value.setValue(false));
  assert.equal(f.value.capture(), false);
  assert.equal(f.values.get(key('A')), 'false');
  await f.unmount();
});

test('switch and retry use the existing action area, remain independent from notification and hide in tutorial', async () => {
  const native = { Platform: { OS: 'ios' }, Text: 'Text', View: 'View' };
  const ActionArea = load('screens/input/InputActionArea.js', { 'react-native': native,
    'react-native-vector-icons/Ionicons': { __esModule: true, default: 'Icon' },
    '../../components/CocolonButton': { __esModule: true, default: 'Button' },
    '../../components/CocolonSwitch': { __esModule: true, default: 'Switch' },
  }).default;
  const questions = [], notifications = []; let retried = 0, root;
  const preference = { value: false, ready: true, canChange: true, setValue: v => questions.push(v), retry: () => retried++ };
  const props = { colors: {}, styles: {}, emlisQuestionPreference: preference,
    setSendEmotionNotification: v => notifications.push(v), doNotSendEmotionNotification: false };
  await act(async () => { root = Renderer.create(React.createElement(ActionArea, props)); });
  const receive = () => root.root.findAllByType('Switch').find(x => x.props.accessibilityLabel === 'Emlisからの問いを受け取る');
  assert.equal(receive().props.value, false); assert.equal(receive().props.disabled, undefined);
  await act(async () => receive().props.onValueChange(true));
  assert.deepEqual(questions, [true]); assert.deepEqual(notifications, []);
  await act(async () => root.update(React.createElement(ActionArea, { ...props, submitting: true })));
  assert.equal(receive().props.disabled, true);
  await act(async () => root.update(React.createElement(ActionArea, { ...props, emlisQuestionPreference: { ...preference, ready: false, canChange: false, error: '問いの設定を保存できませんでした。' } })));
  assert.equal(receive().props.disabled, true);
  await act(async () => root.root.findAllByType('Button').find(x => x.props.accessibilityLabel === '問いの設定を再確認する').props.onPress());
  assert.equal(retried, 1);
  await act(async () => root.update(React.createElement(ActionArea, { ...props, isTutorialMode: true })));
  assert.equal(receive(), undefined);
  await act(async () => root.unmount());
});
