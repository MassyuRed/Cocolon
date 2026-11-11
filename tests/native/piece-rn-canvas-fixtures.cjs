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
// Actual fictional AR-04 SQL artifacts, with the existing synthetic HTTP
// envelope. Only preview expiry is projected to the test clock. Canonical
// body, recipe, three hashes and ios.v2 renderer remain the recorded values.
const ar04Fixtures = [
  ['ar04_recorded_viewpoint', require('./piece-ar04-adopted-native.json')],
  ['ar04_current_wire_activity', require('./piece-rn-canvas-current-wire.json')],
  ...require('./piece-rn-canvas-passive-role.json').cases.map(c => [c.native_case_name, c]),
];
for (const [baseName, ar04] of ar04Fixtures) {
  const ar04Preview = JSON.parse(JSON.stringify(context.makePreview(ar04.preview.format_type)));
  for (const key of ['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
    'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version',
    'preview_id', 'preview_revision', 'row_version', 'eligible_formats']) {
    ar04Preview[key] = JSON.parse(JSON.stringify(ar04.preview[key]));
  }
  ar04Preview.expires_at = '2099-12-31T23:59:59Z';
  ar04Preview.quota = { ...ar04Preview.quota, subscription_tier: 'free', save_limit: 5,
    saved_count: 2, remaining_count: 3 };
  ar04Preview.plan_capabilities = { format_selection: 'fixed', theme_ids: ar04.preview.visual_recipe.theme.theme_id === 'quiet_night' ? ['soft_paper', 'quiet_night'] : ['soft_paper'],
    aspect_ratios: ['4:5'], branding_modes: ['required_small'] };
  admittedCases.push(
    { name: `admitted_preview_${baseName}`, evidence_set: 'admitted_preview',
      test_profile: 'bitmap-v1', props: { display: { phase: 'received', preview: ar04Preview, hashVerified: true } } },
    { name: `admitted_saved_${baseName}`, evidence_set: 'admitted_saved',
      test_profile: 'bitmap-v1', props: { savedRecord: JSON.parse(JSON.stringify(ar04.detail)) } },
  );
}
const admittedTrap = JSON.parse(JSON.stringify(admittedCases[0]));
admittedTrap.name = 'admitted_host_crop_trap'; admittedTrap.evidence_set = 'admitted_host_trap'; admittedTrap.controlled_host_crop = true;
admittedCases.push(admittedTrap); module.exports.admitted = admittedCases;
// Independent export group preserves all historical input bytes and expectations.
const exportCases=admittedCases.filter(c=>c.evidence_set==='admitted_saved').map(c=>{
  const f=JSON.parse(JSON.stringify(c));f.name=c.name.replace('admitted_saved_','export_saved_');
  f.evidence_set='export_saved';f.props.exportCanvas=true;return f;
});
for(const mode of ['clear','removed','token','binding','multiple','during']){
  const f=JSON.parse(JSON.stringify(exportCases[0]));f.name='export_reject_'+mode;
  f.evidence_set='export_trap';f.export_trap=mode;delete f.retain_after_deadline;exportCases.push(f);
}
module.exports.export=exportCases;
const androidBitmapCases = bitmapCases.filter(c => c.evidence_set === 'bitmap_preview').map(original => {
  const fixture = JSON.parse(JSON.stringify(original));
  fixture.name = fixture.name.replace(/^bitmap_/, 'android_bitmap_');
  fixture.evidence_set = 'android_bitmap_prototype';
  fixture.test_profile = 'android-bitmap-v1';
  fixture.props.androidRasterPrototype = true;
  fixture.props.display.preview.renderer_version = 'piece.rn_android_bitmap_preview.prototype.v1';
  return fixture;
});
module.exports.androidBitmap = androidBitmapCases;
// The recorded 344a multiblock works form their own native denominator. Keep
// the production ios.v2 renderer and every canonical artifact field; only the
// synthetic Premium HTTP envelope and preview expiry are projected here.
const model73CanonicalFields = ['format_type', 'piece_text', 'piece_text_hash', 'content_payload',
  'content_payload_hash', 'visual_recipe', 'visual_recipe_hash', 'renderer_version'];
const model73Cases = [];
for (const recorded of require('../fixtures/piece-ar04-344a-multiblock.json').cases) {
  const selected = recorded.selected_preview || recorded.preview;
  const preview = JSON.parse(JSON.stringify(context.makePreview(selected.format_type)));
  for (const key of [...model73CanonicalFields, 'preview_id', 'preview_revision', 'row_version',
    'eligible_formats', 'visibility_scope']) preview[key] = JSON.parse(JSON.stringify(selected[key]));
  preview.expires_at = '2099-12-31T23:59:59Z';
  preview.content_status = selected.safety_state;
  preview.quota = { ...preview.quota, subscription_tier: 'premium', save_limit: null, remaining_count: null };
  preview.plan_capabilities = { format_selection: 'eligible_choice', theme_ids: ['soft_paper', 'quiet_night'],
    aspect_ratios: ['4:5', '9:16'], branding_modes: ['required_subtle', 'off'] };
  model73Cases.push(
    { name: `model73_preview_${recorded.native_case_name}`, evidence_set: 'model73_preview',
      test_profile: 'bitmap-v1', source_case_id: recorded.source_case_id,
      props: { display: { phase: 'received', preview, hashVerified: true } } },
    { name: `model73_saved_${recorded.native_case_name}`, evidence_set: 'model73_saved',
      test_profile: 'bitmap-v1', source_case_id: recorded.source_case_id,
      props: { savedRecord: JSON.parse(JSON.stringify(recorded.detail)) } },
    { name: `model73_export_${recorded.native_case_name}`, evidence_set: 'model73_export',
      test_profile: 'bitmap-v1', source_case_id: recorded.source_case_id,
      props: { savedRecord: JSON.parse(JSON.stringify(recorded.detail)), exportCanvas: true } },
  );
}
module.exports.model73 = model73Cases;
// One recorded A/B pair, exercised as a real waiting parent flow and as a
// separate retained-Card regression. No third server revision is invented.
const transitionRecorded = require('../fixtures/piece-ar04-344a-multiblock.json').cases.find(c => c.source_case_id === 'B53-007');
const transitionB = JSON.parse(JSON.stringify(model73Cases.find(c => c.name === 'model73_preview_ar04_344a_refined_three_blocks').props.display.preview));
const transitionA = JSON.parse(JSON.stringify(transitionB));
for (const key of [...model73CanonicalFields, 'preview_id', 'preview_revision', 'row_version',
  'eligible_formats', 'visibility_scope']) transitionA[key] = JSON.parse(JSON.stringify(transitionRecorded.preview[key]));
transitionA.content_status = transitionRecorded.preview.safety_state;
const transitionCases = ['parent_loading_remount', 'retained_card_regression'].map(mode => ({
  name: `visual_transition_${mode}`, mode, source_case_id: 'B53-007', evidence_set: 'visual_transition', test_profile: 'bitmap-v1',
  preview_a: JSON.parse(JSON.stringify(transitionA)), preview_b: JSON.parse(JSON.stringify(transitionB)),
  controller_context: {
    enabled: true, saveEnabled: false, expectedUserId: '8765147c-ca5f-4dd2-8062-12a51d9e4bb5',
    idempotencyKey: 'synthetic-visual-controller-007',
    request: { source_ref: { source_input_id: 'e6618997-2037-4d1b-9cbe-c43ac07ab287',
      source_input_version: 'emlis.current_input_bundle.v1',
      source_input_bundle_commitment: 'sha256:de77ecfc93fdb94034941488349cedb8b3b664db83575912297d60e38201ac23',
      emlis_observation_stage: 'refined_observation', emlis_observation_result_identity: 'b24f7127-19b9-4477-9f16-ce1535815203',
      question_need_decision_identity: '4d97c8df-c1e6-4482-b299-af0831f0be00', supplemental_answer_identity: 'c7047e9d-5035-4fd8-b506-5dabb429616a' },
      requested_format: 'short_essay', visual_selection: { theme_id: 'soft_paper', aspect_ratio: '4:5', branding_mode: 'required_subtle' } },
  },
}));
module.exports.visualTransition = transitionCases;
if (require.main === module) process.stdout.write(JSON.stringify(process.env.PIECE_RN_ANDROID_BITMAP_GROUP === '1' ? androidBitmapCases
  : process.env.PIECE_RN_VISUAL_TRANSITION_GROUP === '1' ? transitionCases
  : process.env.PIECE_RN_MODEL73_GROUP === '1' ? model73Cases
  : process.env.PIECE_RN_EXPORT_GROUP === '1' ? exportCases : process.env.PIECE_RN_ADMITTED_GROUP === '1' ? admittedCases
    : process.env.PIECE_RN_BITMAP_GROUP === '1' ? bitmapCases : module.exports, null, 2) + '\n');
