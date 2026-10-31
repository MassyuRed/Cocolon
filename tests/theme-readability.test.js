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

test('the established default burgundy palette is unchanged', () => {
  assert.deepEqual(palettes.default, {
    BG_SILVER: '#F6F1E8', PANEL_BG: '#F9F9F9', FIELD_BG: '#FFFFFF',
    BORDER_GOLD: '#800020', GOLD_BUTTON: '#5A1020', GOLD_BUTTON_BORDER: '#430814',
    TITLE_GOLD: '#800020', BRAND_GOLD: '#800020', TEXT_ON_LIGHT: '#111827',
    TEXT_ON_DARK: '#F2F2F2', TEXT_SUBTLE: '#BFC3C7', CARD_BORDER: '#D7D2C9',
    ACCENT_TEXT: '#FFFFFF',
  });
});

test('light/dark backgrounds, decoration, buttons, and other text colors are unchanged', () => {
  const expected = {
    light: {
      BG_SILVER: '#FFFFFF', PANEL_BG: '#FFFFFF', FIELD_BG: '#FFFFFF',
      BORDER_GOLD: '#D4AF37', GOLD_BUTTON: '#B8860B', GOLD_BUTTON_BORDER: '#8B6914',
      TEXT_ON_LIGHT: '#111827', TEXT_ON_DARK: '#F9FAFB', TEXT_SUBTLE: '#6B7280',
      CARD_BORDER: '#E5E7EB', ACCENT_TEXT: '#FFFFFF',
    },
    dark: {
      BG_SILVER: '#000000', PANEL_BG: '#000000', FIELD_BG: '#000000',
      BORDER_GOLD: '#1E3A8A', GOLD_BUTTON: '#0B1120', GOLD_BUTTON_BORDER: '#1E3A8A',
      TEXT_ON_LIGHT: '#F9FAFB', TEXT_ON_DARK: '#111827', TEXT_SUBTLE: '#9CA3AF',
      CARD_BORDER: '#1F2937', ACCENT_TEXT: '#FFFFFF',
    },
  };
  for (const theme of ['light', 'dark']) {
    const { TITLE_GOLD, BRAND_GOLD, ...unchanged } = palettes[theme];
    assert.deepEqual(unchanged, expected[theme]);
  }
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
  test(`${theme}: heading text reaches 4.5:1 on each existing theme surface`, () => {
    for (const surface of SURFACES) assertReadable(palette.TITLE_GOLD, palette[surface], `${theme} heading/${surface}`);
  });
  test(`${theme}: header text, including the small subtitle, reaches 4.5:1`, () => {
    for (const surface of SURFACES) assertReadable(palette.BRAND_GOLD, palette[surface], `${theme} header/${surface}`);
  });
  test(`${theme}: runtime retry label stays readable when TITLE_GOLD is its background`, () => {
    assertReadable(palette.PANEL_BG, palette.TITLE_GOLD, `${theme} retry label`);
  });
}

test('GlobalFrameLayout retains the actual header foreground/background bindings', () => {
  const source = read('components/GlobalFrameLayout.js');
  assert.match(source, /backgroundColor:\s*colors\.BG_SILVER/);
  assert.equal((source.match(/color:\s*colors\.BRAND_GOLD/g) || []).length, 2);
  assert.match(source, /borderBottomColor:\s*colors\.BORDER_GOLD/);
});

test('runtime blocking screen retains inverse label/spinner colors and retry controls', () => {
  const source = read('runtime/AppRuntimeBlockingScreen.js');
  assert.match(source, /backgroundColor:\s*colors\.TITLE_GOLD/);
  assert.match(source, /<Text style=\{\{ color:\s*colors\.PANEL_BG/);
  assert.match(source, /<ActivityIndicator size="small" color=\{colors\.PANEL_BG\}/);
  assert.match(source, /onPress=\{onRetry\}/);
  assert.match(source, /disabled=\{retrying\}/);
  assert.match(source, /opacity:\s*retrying\s*\?\s*0\.65\s*:\s*1/);
});

test('shared UI tokens keep body text, spacing, type sizes, and press motion', () => {
  const source = read('ui/uiTokens.js').replace(/export\s+(const|function)\s+/g, '$1 ');
  const makeUiTokens = Function(source + '\nreturn makeUiTokens;')();
  for (const [theme, palette] of Object.entries(palettes)) {
    const ui = makeUiTokens(palette, theme);
    assert.equal(ui.text.primary, palette.TEXT_ON_LIGHT);
    assert.equal(ui.text.accentOnButton, palette.ACCENT_TEXT);
    assert.equal(ui.text.description, theme === 'dark' ? palette.TEXT_SUBTLE : '#4B5563');
    assert.deepEqual(ui.spacing, { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 });
    assert.deepEqual(ui.font, { sectionLabel: 14, body: 15, description: 10, button: 15, title: 22 });
    assert.deepEqual(ui.motion, { pressScale: 0.97, pressDurationMs: 100 });
  }
});
