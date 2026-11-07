'use strict';
// Execute the real screen with its API and native UI replaced. This checks
// recovery/paging behavior, not React Native layout or device rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');
const ROOT = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(ROOT, 'screens/TodayQuestionHistoryScreen.js'), 'utf8');
const compiled = ts.transpileModule(source, { fileName: 'TodayQuestionHistoryScreen.tsx',
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
const tick = () => new Promise(resolve => setImmediate(resolve));

function screen(responses) {
  const slots = [], pendingEffects = [], requests = [];
  let cursor = 0, dirty = false, tree;
  const same = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], next => { slots[i] = typeof next === 'function' ? next(slots[i]) : next; dirty = true; }];
    },
    useMemo(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i].deps, deps)) slots[i] = { deps, value: fn() };
      return slots[i].value;
    },
    useCallback(fn, deps) { return React.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!slots[i] || !same(slots[i], deps)) { slots[i] = deps; pendingEffects.push(fn); }
    },
  };
  const native = new Proxy({
    Platform: { OS: 'ios' }, StyleSheet: { create: value => value },
    Alert: { alert() {} }, useWindowDimensions: () => ({ width: 390, height: 844, fontScale: 1 }),
  }, { get: (target, key) => key in target ? target[key] : String(key) });
  const colors = new Proxy({}, { get: () => '#312436' });
  const typography = new Proxy({}, { get: () => ({ fontSize: 16, lineHeight: 27, fontWeight: '400' }) });
  const imports = {
    react: { ...React, default: React }, 'react-native': native,
    'react-native-safe-area-context': { SafeAreaView: 'SafeAreaView' },
    'react-native-vector-icons/Ionicons': { default: 'Ionicons' },
    '../theme/ThemeContext': { useTheme: () => ({ colors, themeName: 'default' }) },
    '../ui/uiTokens': { makeUiTokens: () => ({ typography }) },
    '../ui/applyTypographyTokens': { applyTypographyTokens: value => value },
    '../SubscriptionContext': { useSubscription: () => ({ isPaid: false, tier: 'free', loading: false }) },
    '../AppRuntimeContext': { useAppRuntime: () => ({ isFeatureEnabled: () => true }) },
    '../lib/historyRetentionLabel': { getHistoryRetentionLabel: () => null },
    '../lib/todayQuestionApi': {
      getTodayQuestionHistory: async request => {
        requests.push(JSON.parse(JSON.stringify(request)));
        const result = responses.shift();
        if (result instanceof Error) throw result;
        assert.ok(result, 'unexpected history request');
        return result;
      },
      patchTodayQuestionAnswer: async () => { throw new Error('unexpected write'); },
    },
  };
  for (const name of ['CocolonButton', 'CocolonBackButton', 'CocolonPressable']) imports['../components/' + name] = { default: name };
  const context = { exports: {}, require: name => { assert.ok(name in imports, name); return imports[name]; }, console: { warn() {} } };
  vm.runInNewContext(compiled, context, { filename: 'TodayQuestionHistoryScreen.js' });
  function render() {
    cursor = 0; dirty = false;
    tree = context.exports.default({ onBack() {} });
    pendingEffects.splice(0).forEach(fn => fn());
  }
  async function settle() {
    for (let i = 0; i < 6; i++) { await tick(); if (dirty) render(); }
  }
  function nodes(node = tree, out = []) {
    if (Array.isArray(node)) node.forEach(n => nodes(n, out));
    else if (node && typeof node === 'object') { out.push(node); nodes(node.children, out); }
    return out;
  }
  function text(node = tree) {
    if (Array.isArray(node)) return node.map(text).join('');
    if (node == null || typeof node === 'boolean') return '';
    return typeof node === 'object' ? text(node.children) : String(node);
  }
  render();
  return { settle, text, requests, nodes, retry: () => nodes().find(n => n.props.title === 'もう一度読み込む').props.onPress(),
    more: () => nodes().find(n => n.props.accessibilityLabel === 'さらに履歴を読み込む').props.onPress() };
}

test('initial history failure is distinct from empty history and retries without a write', async () => {
  const h = screen([new Error('offline'), { items: [{ answer_id: 'a', question_text: '最初の問い', free_text: '保存した回答', answer_mode: 'free_text' }], has_more: false }]);
  await h.settle();
  assert.match(h.text(), /履歴を取得できませんでした/);
  assert.doesNotMatch(h.text(), /まだ今日の問いの履歴はありません/);
  await h.retry(); await h.settle();
  assert.deepEqual(h.requests, [{ limit: 60, offset: 0 }, { limit: 60, offset: 0 }]);
  assert.match(h.text(), /保存した回答/);
  assert.doesNotMatch(h.text(), /履歴を取得できませんでした/);
});

test('load-more failure keeps visible answers and retries the same page with deduplication', async () => {
  const a = { answer_id: 'a', question_text: '最初の問い', answer_mode: 'free_text', free_text: '元の回答' };
  const b = { answer_id: 'b', question_text: '次の問い', answer_mode: 'free_text', free_text: '次の回答' };
  const h = screen([{ items: [a], has_more: true, next_offset: 60 }, new Error('offline'), { items: [a, b], has_more: false }]);
  await h.settle(); await h.more(); await h.settle();
  assert.match(h.text(), /続きの履歴を取得できませんでした/);
  assert.match(h.text(), /元の回答/);
  assert.doesNotMatch(h.text(), /まだ今日の問いの履歴はありません/);
  await h.retry(); await h.settle();
  assert.deepEqual(h.requests, [{ limit: 60, offset: 0 }, { limit: 60, offset: 60 }, { limit: 60, offset: 60 }]);
  assert.equal((h.text().match(/元の回答/g) || []).length, 1);
  assert.match(h.text(), /次の回答/);
  assert.doesNotMatch(h.text(), /続きの履歴を取得できませんでした/);
});
