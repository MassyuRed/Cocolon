/** B13 RN-first preview geometry. No capture, persistence or save authority.
 * Catalog values mirror PCE-5 / backend piece_v2_visual.py v1. Native wrapping
 * is a prototype target, not the Python B9 measured-ink algorithm or its proof.
 * onTextLayout supplies line boxes, NOT glyph availability/ink bounds. Thus
 * geometry_checked never means layout_state=fit or canSave/canExport.
 */
import { readPiecePreviewDisplay } from './piecePreviewModel';

export const PIECE_NATIVE_PREVIEW_VERSION = 'piece.rn_native_preview.prototype.v2';
const nativeThemes = {
  soft_paper: { canvas: '#F6F1E8', surface: '#FFFDF8', text: '#111827', secondary: '#4B5563',
    accent: '#800020', border: '#D7D2C9', branding: '#800020', vector_end: '#FFFFFF' },
  quiet_night: { canvas: '#0B1120', surface: '#111827', text: '#F9FAFB', secondary: '#CBD5E1',
    accent: '#D4AF37', border: '#334155', branding: '#D4AF37', vector_end: '#1E293B' },
};
const nativeScales = {
  short_essay: { '4:5': [48, 44, 40, 36], '9:16': [52, 48, 44, 40] },
  quote: { '4:5': [72, 64, 56], '9:16': [80, 72, 64] },
  declaration: { '4:5': [64, 56, 48], '9:16': [72, 64, 56] },
};
const nativeLineRatios = { short_essay: 1.55, quote: 1.35, declaration: 1.42 };
const frozenNative = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(frozenNative); Object.freeze(value); }
  return value;
};

// Independently revalidate hashes/expiry. Only necessary render data reaches
// the canvas; no quota, source, owner, session or visibility is copied into it.
export function preparePieceNativePreview(display, nowMs = Date.now()) {
  const checked = readPiecePreviewDisplay(display, nowMs);
  if (!checked.hashVerified || !checked.preview) return null;
  const p = checked.preview, recipe = p.visual_recipe, ratio = recipe.aspect_ratio;
  const tall = ratio === '9:16', margin = tall ? 108 : 96, brandingZone = tall ? 84 : 72;
  const key = JSON.stringify([PIECE_NATIVE_PREVIEW_VERSION, p.preview_id, p.preview_revision,
    p.row_version, p.expires_at, p.piece_text_hash, p.content_payload_hash, p.visual_recipe_hash, p.renderer_version]);
  return frozenNative({ key, width: 1080, height: tall ? 1920 : 1350, margin, brandingZone,
    contentWidth: 1080 - 2 * margin, contentHeight: (tall ? 1920 : 1350) - 2 * margin - brandingZone,
    blocks: [...p.content_payload.body_blocks], sizes: [...nativeScales[p.format_type][ratio]],
    lineRatio: nativeLineRatios[p.format_type], paragraphRatio: p.format_type === 'short_essay' ? 0.65 : 0,
    alignment: p.format_type === 'quote' ? 'center' : 'left',
    colors: { ...nativeThemes[recipe.theme.theme_id] }, brandingMode: recipe.branding.branding_mode });
}

export function createPieceNativeMeasurement(input) {
  return { key: input?.key ?? null, phase: input ? 'measuring' : 'unavailable', sizeIndex: 0,
    generation: Object.freeze({}), blocks: {}, compositionHeight: null, reason: null, canSave: false, canExport: false };
}

export function pieceNativeTypography(input, sizeIndex) {
  const fontSize = input.sizes[sizeIndex], lineHeight = Math.ceil(fontSize * input.lineRatio);
  return { fontSize, lineHeight, gap: lineHeight * input.paragraphRatio };
}

const nativeFinite = n => typeof n === 'number' && Number.isFinite(n);
const nativeReject = (state, reason) => ({ ...state, phase: 'unavailable', blocks: {}, compositionHeight: null, reason });

// Tickets bind to the exact preview + candidate size, so delayed native events
// cannot validate a replaced candidate. Store only numbers after comparing
// line text; native event text never becomes a second canonical body.
export function recordPieceNativeMeasurement(input, state, ticket, blockIndex, kind, value) {
  if (!input || state.key !== input.key || ticket?.key !== input.key || ticket.sizeIndex !== state.sizeIndex ||
      ticket.generation !== state.generation || state.phase === 'unavailable') return state;
  const branding = blockIndex === input.blocks.length;
  if (!Number.isInteger(blockIndex) || blockIndex < 0 || blockIndex > input.blocks.length ||
      branding && input.brandingMode === 'off') return state;
  let measurement;
  if (kind === 'box') {
    if (!value || !nativeFinite(value.width) || !nativeFinite(value.height) || value.width <= 0 || value.height <= 0) {
      return nativeReject(state, 'invalid_measurement');
    }
    measurement = { width: value.width, height: value.height };
  } else if (kind === 'lines') {
    if (!Array.isArray(value) || !value.length || value.length > 512 || value.some(line => !line ||
        typeof line.text !== 'string' || !line.text.length ||
        !['x', 'y', 'width', 'height'].every(k => nativeFinite(line[k])) || line.width < 0 || line.height <= 0)) {
      return nativeReject(state, 'invalid_measurement');
    }
    if (value.map(line => line.text).join('') !== (branding ? 'Cocolon' : input.blocks[blockIndex])) {
      return nativeReject(state, 'text_mismatch');
    }
    let end = 0;
    measurement = value.map(({ text, x, y, width, height }) => ({ x, y, width, height, end: end += text.length }));
  } else return state;
  const old = state.blocks[blockIndex] || {};
  if (JSON.stringify(old[kind]) === JSON.stringify(measurement)) return state;
  const blocks = { ...state.blocks, [blockIndex]: { ...old, [kind]: measurement } };
  const next = { ...state, phase: 'measuring', blocks, compositionHeight: null, inspection: null };
  const count = input.blocks.length + (input.brandingMode === 'off' ? 0 : 1);
  if (Object.keys(blocks).length !== count || Object.values(blocks).some(b => !b.lines || !b.box)) return next;
  const { gap } = pieceNativeTypography(input, state.sizeIndex);
  const compositionHeight = input.blocks.reduce((total, _, index) => total + blocks[index].box.height, 0) + gap * (input.blocks.length - 1);
  const tolerance = 0.01;
  let overflow = compositionHeight > input.contentHeight + tolerance;
  for (let index = 0; index < count; index++) {
    const { box, lines } = blocks[index];
    if (Math.abs(box.width - input.contentWidth) > tolerance ||
        index === input.blocks.length && box.height > input.brandingZone) overflow = true;
    let bottom = 0;
    for (const line of lines) {
      if (line.x < -tolerance || line.y < -tolerance || line.x + line.width > input.contentWidth + tolerance ||
          line.y + line.height > box.height + tolerance || line.y < bottom - tolerance) overflow = true;
      bottom = line.y + line.height;
    }
  }
  if (overflow) return state.sizeIndex + 1 < input.sizes.length
    ? { ...createPieceNativeMeasurement(input), sizeIndex: state.sizeIndex + 1 }
    : nativeReject(next, 'font_floor_overflow');
  return { ...next, phase: 'geometry_checked', compositionHeight };
}
