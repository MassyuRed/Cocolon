const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const Renderer = require('react-test-renderer');
const { androidBitmap } = require('./native/piece-rn-canvas-fixtures.cjs');

const root = path.join(__dirname, '..');
const clone = value => JSON.parse(JSON.stringify(value));

function layout(os) {
  const files = ['piecePalette', 'pieceApi', 'piecePreviewModel', 'pieceOwnerModel', 'pieceLayout'];
  const source = files.map(name => fs.readFileSync(path.join(root, 'features/piece', name + '.js'), 'utf8')
    .replace(/^import .*;$/gm, '').replace(/^export /gm, '')).join('\n');
  return vm.runInNewContext(source + '\n({ preparePieceNativeCard, preparePieceNativePreview, supportsPieceSavedImage, ' +
    'createPieceNativeMeasurement, recordPieceNativeMeasurement });', { Platform: { OS: os } });
}

test('Android bitmap fixtures require explicit local Card entry and verified source identity', () => {
  const android = layout('android'), ios = layout('ios');
  const sizes = new Set();
  for (const fixture of androidBitmap) {
    const props = clone(fixture.props), p = props.display.preview;
    props.display.visualToken = {};
    const input = android.preparePieceNativeCard(props);
    assert.ok(input, fixture.name);
    assert.equal(input.rendererVersion, 'piece.rn_android_bitmap_preview.prototype.v1');
    assert.equal(input.candidateProfile, input.rendererVersion);
    assert.deepEqual(clone(input.blocks), p.content_payload.body_blocks);
    assert.equal(input.brandingText, 'Emlis');
    sizes.add(`${input.width}x${input.height}`);
    assert.equal(android.preparePieceNativePreview(props.display), null);
    assert.equal(android.preparePieceNativeCard({ display: props.display }), null);
    assert.equal(android.preparePieceNativeCard({ ...props, exportCanvas: true }), null);
    assert.equal(android.supportsPieceSavedImage(input.rendererVersion), false);
    assert.equal(ios.preparePieceNativeCard(props), null);
    assert.equal(android.preparePieceNativeCard({ ...props, savedRecord: {} }), null);
    props.display.preview.piece_text += '偽';
    assert.equal(android.preparePieceNativeCard(props), null);
  }
  assert.deepEqual([...sizes].sort(), ['1080x1350', '1080x1920']);
  assert.equal(android.supportsPieceSavedImage('piece.rn_native_preview.prototype.v3'), true);
});

test('Android bitmap source rows use the real content width and preserve the exact one-line text', () => {
  const api = layout('android');
  const { props } = clone(androidBitmap[0]);
  props.display.visualToken = {};
  const base = api.preparePieceNativeCard(props);
  const input = { ...base, blocks: ['書いた本文'], plannedRows: true, brandingMode: 'off' };
  const state = { ...api.createPieceNativeMeasurement(input), plan: { totalHeight: 75 } };
  const ticket = { key: input.key, sizeIndex: 0, generation: state.generation };
  const lines = [{ text: input.blocks[0], x: 0, y: 0, width: 200, height: 54 }];
  const withLine = api.recordPieceNativeMeasurement(input, state, ticket, 0, 'lines', lines);
  const accepted = api.recordPieceNativeMeasurement(input, withLine, ticket, 0, 'box',
    { width: input.contentWidth, height: 54 });
  assert.equal(accepted.phase, 'geometry_checked');
  assert.equal(accepted.canSave, false);
  assert.equal(accepted.canExport, false);
  assert.equal(api.recordPieceNativeMeasurement(input, withLine, ticket, 0, 'box',
    { width: input.width, height: 54 }).reason, 'invalid_bitmap_source');
  assert.equal(api.recordPieceNativeMeasurement(input, state, ticket, 0, 'lines',
    [{ ...lines[0], text: '変更された本文' }]).reason, 'text_mismatch');
});

test('standalone Android harness verifies the same target PNG and releases only its own temporary file', async () => {
  const calls = [], registry = new Map();
  const safeUri = 'file:///private/cache/piece-capture/piece-test_42.png';
  const target = { width: 1080, height: 1350, isCurrent: () => true,
    capture: async () => { calls.push(['capture']); return safeUri; } };
  const Card = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({ getAndroidRasterTarget: () => target }));
    return React.createElement('Card', props);
  });
  const values = {
    react: React,
    'react-native': { AppRegistry: { registerComponent: (name, entry) => registry.set(name, entry) },
      Button: 'Button', Platform: { OS: 'android' }, ScrollView: 'ScrollView', Text: 'Text', View: 'View' },
    'react-native-file-access': { Dirs: { CacheDir: '/private/cache' },
      FileSystem: {
        stat: async file => { calls.push(['stat', file]); return { size: 300 }; },
        readFileChunk: async (...args) => { calls.push(['read', ...args]); return 'data'; },
        hash: async (...args) => { calls.push(['hash', ...args]); return 'a'.repeat(64); },
      } },
    'react-native-view-shot': { releaseCapture: uri => calls.push(['release', uri]) },
    '../../app.json': { name: 'Emlis' },
    '../../components/piece/PieceVisualCard': Card,
    '../../features/piece/pieceExportPngProfile': {
      verifyPieceExportPngStructure: async file => {
        calls.push(['verify', file.size, file.width, file.height]);
        assert.equal(await file.readChunk(0, 33), 'data');
      },
    },
    './piece-rn-android-bitmap-fixtures.json': androidBitmap,
  };
  const fileName = 'tests/native/piece-rn-android-bitmap-entry.js';
  const { outputText } = ts.transpileModule(fs.readFileSync(path.join(root, fileName), 'utf8'), {
    fileName: fileName + '.tsx',
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  const exports = {};
  vm.runInNewContext(outputText, { exports, require: name => {
    assert.ok(Object.hasOwn(values, name), name); return values[name];
  }, console: { log: (...args) => calls.push(['log', ...args]) } });
  assert.deepEqual([...registry.keys()], ['Emlis']);
  let ui;
  await Renderer.act(async () => { ui = Renderer.create(React.createElement(registry.get('Emlis')())); });
  assert.equal(ui.root.findByType('Card').props.androidRasterPrototype, true);
  const tap = () => ui.root.findAllByType('Button').find(x => x.props.title === '同じ描画のPNGを検証').props.onPress();
  await Renderer.act(tap);
  assert.deepEqual(calls.map(x => x[0]), ['capture', 'stat', 'verify', 'read', 'hash', 'log', 'release']);
  assert.deepEqual(calls[2], ['verify', 300, 1080, 1350]);
  assert.deepEqual(calls.at(-1), ['release', safeUri]);
  target.capture = async () => 'file:///unrelated/piece-not-ours.png';
  await Renderer.act(tap);
  assert.equal(calls.length, 7, 'an outside path is neither read nor released');
  await Renderer.act(async () => ui.unmount());
});
