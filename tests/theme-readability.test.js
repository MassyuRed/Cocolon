const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

// Read the actual palette declarations; do not copy the colors under test.
// This tests color values/bindings, not React Native rendering or device behavior.
const themeSource = read('theme/ThemeContext.js');
const start = themeSource.indexOf('export const THEME_VARIANTS =');
const end = themeSource.indexOf('const THEME_STORAGE_KEY =', start);
assert.ok(start >= 0 && end > start, 'theme palette declarations must be present');
const { variants, palettes } = Function(
  themeSource.slice(start, end).replace(/export\s+const\s+/g, 'const ') +
  '\nreturn { variants: THEME_VARIANTS, palettes: PALETTES };'
)();

// WCAG 2.2 relative luminance and contrast ratio, using unrounded sRGB values.
// https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
function luminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const linear = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (values[1] + 0.05) / (values[0] + 0.05);
}
function assertReadable(foreground, background, context) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= 4.5, `${context}: ${foreground} on ${background} = ${ratio}, expected >= 4.5`);
}

const SURFACES = ['BG_SILVER', 'PANEL_BG', 'FIELD_BG'];
const COLOR_KEYS = [
  ...SURFACES, 'BORDER_GOLD', 'GOLD_BUTTON', 'GOLD_BUTTON_BORDER',
  'TITLE_GOLD', 'BRAND_GOLD', 'TEXT_ON_LIGHT', 'TEXT_ON_DARK',
  'TEXT_SUBTLE', 'CARD_BORDER', 'ACCENT_TEXT',
  'SURFACE_TONAL', 'ON_SURFACE_TONAL',
  'SURFACE_HIGHLIGHT', 'ON_SURFACE_HIGHLIGHT',
  'ERROR', 'ERROR_BG',
].sort();

test('contrast arithmetic: black/white, equal colors, and old low-contrast pairs', () => {
  assert.equal(contrast('#000000', '#FFFFFF'), 21);
  assert.equal(contrast('#800020', '#800020'), 1);
  assert.ok(Math.abs(contrast('#D4AF37', '#FFFFFF') - 2.1028249983513) < 1e-12);
  assert.ok(Math.abs(contrast('#1E3A8A', '#000000') - 2.027421895252695) < 1e-12);
});

test('theme IDs, storage key, labels, and palette shape stay compatible', () => {
  assert.deepEqual(variants, { DEFAULT: 'default', LIGHT: 'light', DARK: 'dark' });
  assert.deepEqual(Object.keys(palettes).sort(), ['dark', 'default', 'light']);
  assert.match(themeSource, /const THEME_STORAGE_KEY = "cocolon\.themeName";/);
  for (const label of ['デフォルト', 'ホワイト＆ゴールド', 'ブラック＆ネイビー', 'White & Gold', 'Black & Navy']) {
    assert.ok(themeSource.includes(`"${label}"`));
  }
  for (const palette of Object.values(palettes)) {
    assert.deepEqual(Object.keys(palette).sort(), COLOR_KEYS);
    for (const color of Object.values(palette)) assert.match(color, /^#[0-9a-f]{6}$/i);
  }
});

test('light/dark backgrounds and decorative color families stay compatible', () => {
  const expected = {
    light: {
      BG_SILVER: '#FFFFFF', PANEL_BG: '#FFFFFF', FIELD_BG: '#FFFFFF',
      BORDER_GOLD: '#D4AF37', GOLD_BUTTON_BORDER: '#8B6914',
      TEXT_ON_LIGHT: '#111827', TEXT_ON_DARK: '#F9FAFB',
      CARD_BORDER: '#E5E7EB', ACCENT_TEXT: '#FFFFFF',
    },
    dark: {
      BG_SILVER: '#000000', PANEL_BG: '#000000', FIELD_BG: '#000000',
      BORDER_GOLD: '#1E3A8A', GOLD_BUTTON_BORDER: '#1E3A8A',
      TEXT_ON_LIGHT: '#F9FAFB', TEXT_ON_DARK: '#111827',
      CARD_BORDER: '#1F2937', ACCENT_TEXT: '#FFFFFF',
    },
  };
  for (const theme of ['light', 'dark']) {
    const { TITLE_GOLD, BRAND_GOLD, GOLD_BUTTON, TEXT_SUBTLE, SURFACE_TONAL, ON_SURFACE_TONAL, SURFACE_HIGHLIGHT, ON_SURFACE_HIGHLIGHT, ERROR, ERROR_BG, ...unchanged } = palettes[theme];
    assert.deepEqual(unchanged, expected[theme]);
  }
});

test('default keeps Mash burgundy and ivory brand colors', () => {
  const palette = palettes.default;
  assert.deepEqual(Object.fromEntries(['BG_SILVER', 'PANEL_BG', 'FIELD_BG', 'BORDER_GOLD',
    'GOLD_BUTTON', 'GOLD_BUTTON_BORDER', 'TITLE_GOLD', 'BRAND_GOLD', 'TEXT_ON_LIGHT', 'CARD_BORDER']
    .map(key => [key, palette[key]])), {
    BG_SILVER: '#F6F1E8', PANEL_BG: '#F9F9F9', FIELD_BG: '#FFFFFF', BORDER_GOLD: '#800020',
    GOLD_BUTTON: '#5A1020', GOLD_BUTTON_BORDER: '#430814', TITLE_GOLD: '#800020',
    BRAND_GOLD: '#800020', TEXT_ON_LIGHT: '#111827', CARD_BORDER: '#D7D2C9',
  });
});

test('readable text stays in the gold and navy/blue color families', () => {
  for (const token of ['TITLE_GOLD', 'BRAND_GOLD']) {
    const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const [lr, lg, lb] = channels(palettes.light[token]);
    const [dr, dg, db] = channels(palettes.dark[token]);
    assert.ok(lr > lg && lg > lb, `light ${token} should remain gold, not neutral`);
    assert.ok(db > dg && dg > dr, `dark ${token} should remain blue, not neutral`);
  }
});

for (const theme of ['default', 'light', 'dark']) {
  const palette = palettes[theme];
  test(`${theme}: body, secondary labels, and selected controls remain readable`, () => {
    for (const surface of [...SURFACES, 'SURFACE_TONAL']) {
      assertReadable(palette.TEXT_ON_LIGHT, palette[surface], `${theme} body/${surface}`);
      assertReadable(palette.TEXT_SUBTLE, palette[surface], `${theme} secondary/${surface}`);
    }
    assertReadable(palette.ON_SURFACE_TONAL, palette.SURFACE_TONAL, `${theme} tonal selection`);
    assertReadable(palette.ON_SURFACE_HIGHLIGHT, palette.SURFACE_HIGHLIGHT, `${theme} question surface`);
    assertReadable(palette.ACCENT_TEXT, palette.GOLD_BUTTON, `${theme} button label/spinner`);
    assertReadable(palette.ERROR, palette.ERROR_BG, `${theme} error panel`);
    for (const surface of SURFACES) assertReadable(palette.ERROR, palette[surface], `${theme} inline error/${surface}`);
  });
  test(`${theme}: heading text reaches 4.5:1 on each existing theme surface`, () => {
    for (const surface of SURFACES) assertReadable(palette.TITLE_GOLD, palette[surface], `${theme} heading/${surface}`);
  });
  test(`${theme}: header text, including the small subtitle, reaches 4.5:1`, () => {
    for (const surface of SURFACES) assertReadable(palette.BRAND_GOLD, palette[surface], `${theme} header/${surface}`);
  });
  test(`${theme}: runtime retry uses the readable shared primary button pair`, () => {
    assertReadable(palette.ACCENT_TEXT, palette.GOLD_BUTTON, `${theme} retry label/spinner`);
  });
}

test('GlobalFrameLayout retains the actual header foreground/background bindings', () => {
  const source = read('components/GlobalFrameLayout.js');
  assert.match(source, /backgroundColor:\s*colors\.BG_SILVER/);
  assert.equal((source.match(/color:\s*colors\.BRAND_GOLD/g) || []).length, 1);
  assert.match(source, /borderBottomColor:\s*colors\.BORDER_GOLD/);
});

test('runtime blocking screen keeps retry and busy/disabled wiring through the shared button', () => {
  const source = read('runtime/AppRuntimeBlockingScreen.js');
  assert.match(source, /import CocolonButton from "\.\.\/components\/CocolonButton"/);
  assert.match(source, /<CocolonButton/);
  assert.match(source, /onPress=\{onRetry\}/);
  assert.match(source, /disabled=\{retrying\}/);
  assert.match(source, /loading=\{retrying\}/);
  const button = read('components/CocolonButton.js');
  assert.match(button, /backgroundColor: isDisabled \? colors\.FIELD_BG : isPrimary \? colors\.GOLD_BUTTON/);
  assert.match(button, /color: isDisabled \? colors\.TEXT_SUBTLE : isPrimary \? colors\.ACCENT_TEXT/);
  assert.match(button, /<ActivityIndicator color=\{isDisabled \? colors\.TEXT_SUBTLE : isPrimary \? colors\.ACCENT_TEXT/);
  assert.match(button, /const isDisabled = !!disabled \|\| !!loading/);
});

test('explicit typography roles replace weight and leading without altering artwork or unmapped styles', () => {
  const tokenSource = read('ui/uiTokens.js').replace(/export\s+(const|function)\s+/g, '$1 ');
  const makeUiTokens = Function(tokenSource + '\nreturn makeUiTokens;')();
  const source = read('ui/applyTypographyTokens.js').replace(/export\s+function\s+/g, 'function ');
  const apply = Function(source + '\nreturn applyTypographyTokens;')();
  const ui = makeUiTokens(palettes.default, 'default');
  const original = { content: { fontSize: 18, fontWeight: '800', lineHeight: 20, color: '#312436' }, icon: { fontSize: 32 }, brand: { fontFamily: 'CormorantGaramond-Bold', fontSize: 38 } };
  const legacy = apply(original, ui);
  const mapped = apply(original, ui, { content: 'body' });
  assert.deepEqual(mapped.content, { ...original.content, ...ui.typography.body });
  assert.deepEqual(mapped.icon, legacy.icon);
  assert.deepEqual(mapped.brand, legacy.brand);
  assert.equal(original.content.fontWeight, '800');
});

test('shared UI tokens keep body text, spacing, type sizes, and press motion', () => {
  const source = read('ui/uiTokens.js').replace(/export\s+(const|function)\s+/g, '$1 ');
  const makeUiTokens = Function(source + '\nreturn makeUiTokens;')();
  for (const [theme, palette] of Object.entries(palettes)) {
    const ui = makeUiTokens(palette, theme);
    assert.equal(ui.text.primary, palette.TEXT_ON_LIGHT);
    assert.equal(ui.text.accentOnButton, palette.ACCENT_TEXT);
    assert.equal(ui.text.description, palette.TEXT_SUBTLE);
    assert.deepEqual(ui.spacing, { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 });
    assert.equal(ui.typography.body.fontWeight, '400');
    assert.ok(ui.typography.body.fontSize >= 16);
    assert.ok(ui.typography.body.lineHeight >= ui.typography.body.fontSize * 1.6);
    assert.ok(ui.typography.screenTitle.fontSize > ui.typography.body.fontSize);
    assert.deepEqual(ui.motion, { pressScale: 0.97, pressDurationMs: 100 });
  }
});

