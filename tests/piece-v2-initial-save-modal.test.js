'use strict';
/**
 * Bounded source tests for the initial-save presentation seam.
 * Run: node --test tests/piece-v2-initial-save-modal.test.js
 * Actual PiecePreviewModal module; React element creation/native components
 * and PieceVisualCard are test doubles. No renderer admission, HTTP, DB,
 * native drawing, full host flow, or device acceptance is asserted here.
 * PIECE_TEST_ROOT permits running the identical tests against a pinned baseline.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = process.env.PIECE_TEST_ROOT || path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'components/piece/PiecePreviewModal.js'), 'utf8');
// Follow the existing Piece source-test harness: strip only the four known
// single-line imports and the default export. Do not need experimental VM
// modules, a new dependency, a runtime flag, or a replacement product module.
const renderPromise = Promise.resolve((() => {
  const imports = source.match(/^import .*;$/gm) || [];
  assert.deepEqual(imports, [
    "import React from 'react';",
    "import { Modal, View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';",
    "import { SafeAreaView } from 'react-native-safe-area-context';",
    "import PieceVisualCard from './PieceVisualCard';",
  ]);
  const marker = name => ({ component: name });
  const context = vm.createContext({
    React: { createElement: (type, props, ...children) => ({ type, props: props || {}, children }) },
    ...Object.fromEntries(['Modal', 'View', 'Text', 'ScrollView', 'Button', 'ActivityIndicator',
      'SafeAreaView', 'PieceVisualCard'].map(name => [name, marker(name)])),
  });
  const executable = source.replace(/^import .*;$/gm, '').replace(/^export default /gm, '');
  vm.runInContext(executable + '\nglobalThis.renderModal = PiecePreviewModal;', context,
    { filename: 'components/piece/PiecePreviewModal.js' });
  return context.renderModal;
})());

function fixture(overrides = {}) {
  const preview = {
    preview_id: '11111111-1111-4111-8111-111111111111', preview_revision: 3,
    visual_recipe_hash: 'a'.repeat(64), piece_text_hash: 'b'.repeat(64), content_payload_hash: 'c'.repeat(64),
    format_type: 'short_essay', content_status: 'original', piece_text: 'テスト用の本文です。\n順番を変えずに保持します。',
    eligible_formats: ['short_essay'], content_payload: { body_blocks: ['テスト用の本文です。', '順番を変えずに保持します。'] },
    visual_recipe: { theme: { theme_id: 'soft_paper' }, aspect_ratio: '4:5', branding: { branding_mode: 'required_small' } },
    quota: { subscription_tier: 'free', month_key: '2026-10', remaining_count: 2, save_limit: 5 },
    plan_capabilities: { format_selection: 'fixed', theme_ids: ['soft_paper', 'quiet_night'],
      aspect_ratios: ['4:5', '9:16'], branding_modes: ['required_small', 'off'] },
  };
  return { phase: 'received', hashVerified: true, preview, visualToken: Object.freeze({}),
    canSave: true, canRetry: false, ...overrides };
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...(tree.children || []).flatMap(nodes)];
}
function text(tree) {
  if (typeof tree === 'string') return tree;
  if (!tree || typeof tree !== 'object') return '';
  return (Array.isArray(tree) ? tree : tree.children || []).map(text).join('\n');
}
function initial(tree) { return nodes(tree).filter(node => node.props?.testID === 'piece-initial-save'); }
function button(tree, title) { return nodes(tree).find(node => node.type?.component === 'Button' && node.props.title === title); }
async function render(display, props = {}) {
  const component = await renderPromise;
  return component({ visible: true, display, onSave() {}, ...props });
}

// Positive cases are explicit synthetic host projections, not proof that the
// current product host supplies true or that the prototype is admitted.
test('explicit admitted projection exposes one initial-save action without calling it on render', async () => {
  let calls = 0;
  const tree = await render(fixture(), { onSave() { calls++; } });
  assert.equal(initial(tree).length, 1);
  assert.equal(initial(tree)[0].props.title, 'Pieceを保存');
  assert.equal(initial(tree)[0].props.accessibilityLabel, 'このPieceを自分用に保存');
  assert.equal(calls, 0);
});
test('one press forwards only the exact preview identity and the same opaque display token', async () => {
  const display = fixture();
  const calls = [];
  const tree = await render(display, { onSave(...args) { calls.push(args); } });
  assert.equal(initial(tree).length, 1);
  initial(tree)[0].props.onPress();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].length, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0][0])), {
    preview_id: display.preview.preview_id, preview_revision: 3, visual_recipe_hash: 'a'.repeat(64),
  });
  assert.equal(Object.isFrozen(calls[0][0]), true);
  assert.equal(calls[0][1], display.visualToken);
});
test('the rendered save callback retains its original identity/token, not later mutations', async () => {
  const display = fixture(), token = display.visualToken, calls = [];
  const tree = await render(display, { onSave(...args) { calls.push(args); } });
  assert.equal(initial(tree).length, 1);
  display.preview.preview_id = '22222222-2222-4222-8222-222222222222';
  display.preview.preview_revision = 99;
  display.preview.visual_recipe_hash = 'd'.repeat(64);
  display.visualToken = Object.freeze({ replacement: true });
  initial(tree)[0].props.onPress();
  assert.equal(calls[0][0].preview_id, '11111111-1111-4111-8111-111111111111');
  assert.equal(calls[0][0].preview_revision, 3);
  assert.equal(calls[0][0].visual_recipe_hash, 'a'.repeat(64));
  assert.equal(calls[0][1], token);
  // Rejection of stale identities remains the controller/host's responsibility.
});
test('ready save presentation does not simultaneously say Piece saving is unavailable', async () => {
  const tree = await render(fixture());
  assert.equal(initial(tree).length, 1);
  assert.ok(text(tree).includes('画像の書き出し・共有は、まだ利用できません。'));
  assert.ok(!text(tree).includes('Pieceの保存・画像の書き出し・共有は、まだ利用できません。'));
});

for (const [label, canSave] of [['missing', undefined], ['false', false], ['number', 1], ['string', 'true'],
  ['object', {}], ['array', []], ['null', null]]) {
  test(`no save action for non-strict canSave: ${label}`, async () => {
    assert.equal(initial(await render(fixture({ canSave }))).length, 0);
  });
}
for (const [label, onSave] of [['missing', undefined], ['null', null], ['true', true], ['string', 'save']]) {
  test(`no save action without a function handler: ${label}`, async () => {
    assert.equal(initial(await render(fixture(), { onSave })).length, 0);
  });
}
for (const phase of ['idle', 'hidden', 'loading', 'unavailable', 'cancelled', 'saved', 'unknown']) {
  test(`no initial save outside received phase: ${phase}`, async () => {
    assert.equal(initial(await render(fixture({ phase, message: 'test' }))).length, 0);
  });
}
for (const [label, hashVerified] of [['false', false], ['missing', undefined], ['string', 'true']]) {
  test(`no initial save without strict hash verification: ${label}`, async () => {
    assert.equal(initial(await render(fixture({ hashVerified }))).length, 0);
  });
}
for (const [label, visualToken] of [['missing', undefined], ['null', null], ['false', false], ['empty', '']]) {
  test(`no initial save without a display token: ${label}`, async () => {
    assert.equal(initial(await render(fixture({ visualToken }))).length, 0);
  });
}
for (const field of ['loadingKind', 'retryKind']) {
  test(`save-in-progress/recovery never creates an initial save even with contradictory received data: ${field}`, async () => {
    assert.equal(initial(await render(fixture({ [field]: 'save' }))).length, 0);
  });
}
test('no initial save without the preview', async () => {
  assert.equal(initial(await render(fixture({ preview: null }))).length, 0);
});
test('no initial save in a closed modal', async () => {
  assert.equal(await render(fixture(), { visible: false }), null);
});
test('native inspection and remaining quota cannot create canSave', async () => {
  const display = fixture({ canSave: undefined, native_checked: true, layout_state: 'fit' });
  display.preview.quota.remaining_count = null;
  assert.equal(initial(await render(display)).length, 0);
});
test('the existing not-yet-enabled host projection keeps the unavailable explanation', async () => {
  const tree = await render(fixture({ canSave: false }));
  assert.equal(initial(tree).length, 0);
  assert.ok(text(tree).includes('Pieceの保存・画像の書き出し・共有は、まだ利用できません。'));
});

// Existing modal responsibilities are retained. No host/controller/renderer
// behavior is inferred from these element and callback checks.
test('canonical text and the existing visual-card input remain unchanged', async () => {
  const display = fixture(), tree = await render(display);
  const canonical = nodes(tree).find(node => node.props?.testID === 'piece-canonical-text');
  const card = nodes(tree).find(node => node.type?.component === 'PieceVisualCard');
  assert.equal(canonical.children[0], display.preview.piece_text);
  assert.equal(canonical.props.selectable, true);
  assert.equal(card.props.display, display);
});
test('cancel uses the existing identity/token callback without saving', async () => {
  const display = fixture(), calls = [];
  let saves = 0;
  const tree = await render(display, { onSave() { saves++; }, onCancel(...args) { calls.push(args); } });
  button(tree, '候補を取り消す').props.onPress();
  assert.equal(saves, 0);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0].preview_id, display.preview.preview_id);
  assert.equal(calls[0][1], display.visualToken);
});
test('visual setting changes preserve the existing callback', async () => {
  const display = fixture(), calls = [];
  const tree = await render(display, { onVisualChange(...args) { calls.push(args); } });
  button(tree, '静かな夜').props.onPress();
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0].theme_id, 'quiet_night');
  assert.equal(calls[0][0].aspect_ratio, '4:5');
  assert.equal(calls[0][2], display.visualToken);
});
test('close remains independent of save and retry', async () => {
  let close = 0, save = 0, retry = 0;
  const tree = await render(fixture(), { onClose() { close++; }, onSave() { save++; }, onRetry() { retry++; } });
  button(tree, '閉じる').props.onPress();
  assert.deepEqual([close, save, retry], [1, 0, 0]);
});
test('uncertain save outcome offers only the existing same-request recovery', async () => {
  let retries = 0, saves = 0;
  const display = fixture({ phase: 'unavailable', retryKind: 'save', canRetry: true, preview: null, message: '結果不明' });
  const tree = await render(display, { onRetry() { retries++; }, onSave() { saves++; } });
  assert.equal(initial(tree).length, 0);
  button(tree, '同じ保存要求で結果を確認').props.onPress();
  assert.deepEqual([retries, saves], [1, 0]);
});
test('saved outcome keeps the existing saved-detail action', async () => {
  let opens = 0;
  const tree = await render(fixture({ phase: 'saved', retryKind: 'save', preview: null }), { onOpenSaved() { opens++; } });
  assert.equal(initial(tree).length, 0);
  button(tree, '保存したPieceを確認').props.onPress();
  assert.equal(opens, 1);
  assert.ok(text(tree).includes('Pieceを保存しました。'));
});
test('saving spinner and message remain the existing save outcome UI', async () => {
  const tree = await render(fixture({ phase: 'loading', loadingKind: 'save', preview: null }));
  assert.equal(initial(tree).length, 0);
  assert.equal(nodes(tree).filter(node => node.type?.component === 'ActivityIndicator').length, 1);
  assert.ok(text(tree).includes('Pieceを保存しています。'));
});
