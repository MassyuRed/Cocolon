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
  p.renderer_version = c.saved ? 'piece.rn_native_preview.prototype.v3' : 'piece.rn_native_preview.prototype.v8';
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
if (require.main === module) process.stdout.write(JSON.stringify(module.exports, null, 2) + '\n');
