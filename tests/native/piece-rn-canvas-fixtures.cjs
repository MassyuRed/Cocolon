'use strict';
// Synthetic render inputs, using the existing closed preview fixture shape.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const context = vm.createContext({ require, __dirname: path.join(root, 'tests') });
const existing = fs.readFileSync(path.join(root, 'tests/piece-v2-preview-display.test.js'), 'utf8');
vm.runInContext(existing.split('function deferredPieceResponse')[0] + '\nglobalThis.makePreview = response;', context);
const canonical = x => Array.isArray(x) ? x.map(canonical) : x && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, canonical(x[k])])) : x;
const digest = x => crypto.createHash('sha256').update(x).digest('hex');
// An explicit candidate profile selects V4; the default retains old V3 fixtures.
const outputGridV4 = process.env.PIECE_RN_CANVAS_PROFILE === 'output-grid-v4';
const containmentProfile = outputGridV4 ? 'piece.rn_native_preview.containment.prototype.v2' : 'piece.rn_native_preview.containment.prototype.v1';
const cases = [
  { name: 'essay_paragraphs', format: 'short_essay', ratio: '4:5', theme: 'soft_paper', brand: 'required_small',
    blocks: ['私は、静かに考える時間を大切にしています。', 'ただし、一人で決めたいわけではありません。相手の考えにも耳を傾けたいです。'] },
  { name: 'quote_unicode', format: 'quote', ratio: '9:16', theme: 'quiet_night', brand: 'required_subtle',
    blocks: ['  café・が・👩‍👩‍👧‍👦・👍🏽・🇯🇵。違いを大切にして、一緒に歩みたい。  '] },
  { name: 'declaration_no_brand', format: 'declaration', ratio: '9:16', theme: 'soft_paper', brand: 'off',
    blocks: ['私は、自分の言葉で伝えます。', '迷う時間も大切にしながら、一歩ずつ進みます。'] },
  { name: 'essay_max420', format: 'short_essay', ratio: '4:5', theme: 'soft_paper', brand: 'required_small',
    blocks: ['考える時間と対話を大切にしながら、自分の言葉で伝えたい。'.repeat(20).slice(0, 419) + '。'] },
];
cases.push({ ...cases[0], name: 'saved_essay_canvas', saved: true });
// Additional cases preserve the historical strings. The original five above
// remain the baseline denominator, including their existing stress input.
cases.push(
  { name: 'suffix_latin_ligature', supplemental: true, format: 'quote', ratio: '4:5', theme: 'soft_paper', brand: 'required_subtle',
    blocks: ['office affinity AV To'] },
  { name: 'suffix_arabic', supplemental: true, format: 'quote', ratio: '4:5', theme: 'soft_paper', brand: 'required_subtle',
    blocks: ['مرحبا بالعالم'] },
  { name: 'suffix_max420_a', supplemental: true, format: 'short_essay', ratio: '4:5', theme: 'soft_paper', brand: 'required_small',
    blocks: ['あ'.repeat(420)] },
);

module.exports = cases.map((c, index) => {
  const p = JSON.parse(JSON.stringify(context.makePreview(c.format)));
  p.preview_revision = index + 1;
  p.expires_at = '2099-12-31T23:59:59Z';
  p.content_payload.body_blocks = c.blocks;
  p.piece_text = c.blocks.join(c.format === 'short_essay' ? '\n\n' : '\n');
  p.visual_recipe.aspect_ratio = c.ratio;
  p.visual_recipe.theme.theme_id = c.theme;
  p.visual_recipe.branding.branding_mode = c.brand;
  p.renderer_version = c.saved ? 'piece.rn_native_preview.prototype.v3' : containmentProfile;
  p.piece_text_hash = digest(p.piece_text);
  p.content_payload_hash = digest(JSON.stringify(canonical(p.content_payload)));
  p.visual_recipe_hash = digest(JSON.stringify(canonical(p.visual_recipe)));
  if (c.brand !== 'required_small') {
    p.quota = { ...p.quota, subscription_tier: 'premium', save_limit: null, remaining_count: null };
    p.plan_capabilities = { format_selection: 'eligible_choice', theme_ids: ['soft_paper', 'quiet_night'],
    aspect_ratios: ['4:5', '9:16'], branding_modes: ['required_subtle', 'off'] };
  }
  if (!c.saved) return { name: c.name, evidence_set: c.supplemental ? 'supplemental_card' : 'baseline_card', props: { display: { phase: 'received', preview: p, hashVerified: true } } };
  const shared = ['api_contract_version', 'piece_contract_version', 'format_type', 'piece_text', 'piece_text_hash',
    'content_payload', 'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version', 'row_version', 'content_status'];
  const savedRecord = { ...Object.fromEntries(shared.map(k => [k, p[k]])),
    export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
    render_reproducibility_version: 'piece.render_reproducibility.v1',
    piece_id: '40000000-0000-4000-8000-000000000004', public_id: 'piece:40000000-0000-4000-8000-000000000004',
    lifecycle_status: 'saved', visibility_scope: 'private', saved_at: '2026-10-13T00:00:00Z' };
  return { name: c.name, evidence_set: 'baseline_card', props: { savedRecord, exportCanvas: true } };
}).concat([
  // These exact inputs are below the Piece body minimum. They are raw RN
  // Text/B9 measurement diagnostics, not valid Piece responses or Card fit.
  { name: 'suffix_spaces_raw', evidence_set: 'raw_text_diagnostic', raw_text: '  keep spaces  ' },
  { name: 'suffix_hebrew_raw', evidence_set: 'raw_text_diagnostic', raw_text: 'שלום עולם' },
  { name: 'suffix_mixed_bidi_raw', evidence_set: 'raw_text_diagnostic', raw_text: 'abc (אבג) 12' },
]);

// Two explicit containment additions. The clip trap is a controlled test-only
// shared-paint fault in the real RN view, never a naturally observed font bug.
module.exports.push({ name: 'containment_native_clip_trap', evidence_set: 'containment_addition',
  raw_text: 'Controlled native clip trap', controlled_native_clip_trap: true });
const brandingOpacityCase = JSON.parse(JSON.stringify(module.exports.find(c => c.name === 'suffix_latin_ligature')));
brandingOpacityCase.name = 'containment_branding_opacity08';
brandingOpacityCase.evidence_set = 'containment_addition';
module.exports.push(brandingOpacityCase);

// Keep the former 13 names, order and input bytes. Raw measurements have no
// preview DTO, so record their selected test profile explicitly.
if (outputGridV4) for (const fixture of module.exports) {
  fixture.test_profile = 'output-grid-v4';
  if (typeof fixture.raw_text === 'string') fixture.candidate_profile = containmentProfile;
}

// A separate group leaves the historical 13 output bytes and denominator intact.
const bitmapProfile = 'piece.rn_bitmap_preview.prototype.v1';
const bitmapCases = module.exports.filter(c => c.props?.display).map(c => {
  const fixture = JSON.parse(JSON.stringify(c));
  fixture.name = `bitmap_${fixture.name}`; fixture.evidence_set = 'bitmap_preview'; fixture.test_profile = 'bitmap-v1';
  fixture.props.display.preview.renderer_version = bitmapProfile;
  return fixture;
});
bitmapCases.push(...module.exports.filter(c => c.evidence_set === 'raw_text_diagnostic').map(c => ({
  name: `bitmap_${c.name}`, evidence_set: 'bitmap_raw', raw_text: c.raw_text,
  candidate_profile: bitmapProfile, test_profile: 'bitmap-v1',
})));
const bitmapTrap = JSON.parse(JSON.stringify(bitmapCases[0]));
bitmapTrap.name = 'bitmap_host_crop_trap'; bitmapTrap.evidence_set = 'bitmap_host_trap'; bitmapTrap.controlled_host_crop = true;
bitmapCases.push(bitmapTrap);
module.exports.bitmap = bitmapCases;
// The explicit renderer keeps all former fixtures byte-identical and adds
// preview/saved pairs from the same canonical artifact without preview fields.
const admittedVersion = 'piece.rn_bitmap_renderer.ios.v1';
const admittedCases = [];
for (const original of bitmapCases.filter(c => c.evidence_set === 'bitmap_preview')) {
  const preview = JSON.parse(JSON.stringify(original));
  const baseName = original.name.slice('bitmap_'.length);
  preview.name = `admitted_preview_${baseName}`; preview.evidence_set = 'admitted_preview';
  preview.props.display.preview.renderer_version = admittedVersion;
  admittedCases.push(preview);
  const p = preview.props.display.preview;
  const shared = ['api_contract_version', 'piece_contract_version', 'format_type', 'piece_text', 'piece_text_hash',
    'content_payload', 'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version', 'row_version', 'content_status'];
  const savedRecord = { ...Object.fromEntries(shared.map(k => [k, p[k]])),
    export_contract_version: 'piece.export_contract.v1', render_interface_version: 'piece.render_interface.v1',
    render_reproducibility_version: 'piece.render_reproducibility.v1',
    piece_id: '40000000-0000-4000-8000-000000000004', public_id: 'piece:40000000-0000-4000-8000-000000000004',
    lifecycle_status: 'saved', visibility_scope: 'private', saved_at: '2026-10-13T00:00:00Z' };
  admittedCases.push({ name: `admitted_saved_${baseName}`, evidence_set: 'admitted_saved', test_profile: 'bitmap-v1',
    ...(baseName === 'essay_paragraphs' ? { retain_after_deadline: true } : {}), props: { savedRecord } });
}
const admittedTrap = JSON.parse(JSON.stringify(admittedCases[0]));
admittedTrap.name = 'admitted_host_crop_trap'; admittedTrap.evidence_set = 'admitted_host_trap'; admittedTrap.controlled_host_crop = true;
admittedCases.push(admittedTrap); module.exports.admitted = admittedCases;
if (require.main === module) process.stdout.write(JSON.stringify(process.env.PIECE_RN_ADMITTED_GROUP === '1' ? admittedCases
  : process.env.PIECE_RN_BITMAP_GROUP === '1' ? bitmapCases : module.exports, null, 2) + '\n');
