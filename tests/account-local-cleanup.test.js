const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const ROOT = path.resolve(__dirname, '..');
function load(relative, mocks) {
  const filename = path.join(ROOT, relative);
  const code = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, configFile: false, babelrc: false,
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code;
  const module = { exports: {} };
  Function('require', 'module', 'exports', code)(name => {
    assert.ok(Object.hasOwn(mocks, name), `unexpected dependency ${name}`);
    return mocks[name];
  }, module, module.exports);
  return module.exports;
}

test('deleted account cleanup removes its question preference after in-flight writes without affecting another owner', async () => {
  const values = new Map(), calls = [];
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const key = owner => `cocolon.emlisQuestionPreference.v1:${owner}`;
  values.set(key('B'), 'false');
  const storage = {
    async getItem(k) { return values.get(k) ?? null; },
    async setItem(k, value) { await pending; values.set(k, value); calls.push(['set', k]); },
    async removeItem(k) { values.delete(k); calls.push(['remove', k]); },
    async getAllKeys() { return [...values.keys()]; },
    async multiRemove(keys) { for (const k of keys) values.delete(k); },
  };
  const storageMock = { __esModule: true, default: storage };
  const preference = load('lib/emlisQuestionPreferenceStorage.js', { '@react-native-async-storage/async-storage': storageMock });
  const cleanup = load('lib/accountLocalCleanup.js', {
    '@react-native-async-storage/async-storage': storageMock,
    './inputDraftStorage': { clearInputDraft: async owner => calls.push(['draft', owner]) },
    './emlisQuestionPreferenceStorage': preference,
  });
  const writing = preference.saveEmlisQuestionPreference('A', false);
  const deleting = cleanup.clearDeletedAccountLocalState('A');
  finish(); await Promise.all([writing, deleting]);
  assert.equal(values.has(key('A')), false);
  assert.equal(values.get(key('B')), 'false');
  assert.deepEqual(calls.filter(c => c[1] === key('A')), [['set', key('A')], ['remove', key('A')]]);
  assert.equal(await preference.loadEmlisQuestionPreference('A'), true);
});

test('local cleanup failures do not block completed account deletion', async () => {
  let clearedOwner;
  const cleanup = load('lib/accountLocalCleanup.js', {
    '@react-native-async-storage/async-storage': { __esModule: true, default: {
      removeItem: async () => { throw Error('storage failure'); },
      getAllKeys: async () => { throw Error('storage failure'); },
    } },
    './inputDraftStorage': { clearInputDraft: async () => { throw Error('storage failure'); } },
    './emlisQuestionPreferenceStorage': { clearEmlisQuestionPreference: async owner => { clearedOwner = owner; throw Error('storage failure'); } },
  });
  await cleanup.clearDeletedAccountLocalState(' A ');
  assert.equal(clearedOwner, 'A');
  clearedOwner = null; await cleanup.clearDeletedAccountLocalState('');
  assert.equal(clearedOwner, null);
});
