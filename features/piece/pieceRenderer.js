/** Native inspection of the Text instance actually used by PieceVisualCard.
 * Results are local drawing evidence, never server fit/save/export authority.
 */
import { NativeModules, Platform, findNodeHandle } from 'react-native';
import { PIECE_NATIVE_PREVIEW_V4_VERSION, PIECE_NATIVE_PREVIEW_V5_VERSION } from './pieceLayout';

const pieceNoStart = new Set(Array.from('、。，．,？！!?：；:;)]）］｝】〉》」』〕〗〙〛ー々ぁぃぅぇぉっゃゅょァィゥェォッャュョ'));
const pieceNoEnd = new Set(Array.from('([（［｛【〈《「『〔〖〘〚'));
const measurementError = () => new Error('PIECE_NATIVE_MEASUREMENT_UNAVAILABLE');
const finite = value => typeof value === 'number' && Number.isFinite(value);

export function readPieceTextInspection(value, { text, fontSize, box, lineEnds, platform }) {
  const fields = ['version', 'platform', 'font_size', 'width', 'height', 'utf16_length', 'boundaries', 'line_ends', 'ink', 'glyph_check'];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() || value.version !== 'piece.native_text.v1' ||
      value.platform !== platform || !['ios', 'android'].includes(platform) || value.glyph_check !== 'no_missing_observed' ||
      value.utf16_length !== text.length || !finite(value.font_size) || Math.abs(value.font_size - fontSize) > 0.5 ||
      !finite(value.width) || !finite(value.height) || Math.abs(value.width - box.width) > 0.5 ||
      Math.abs(value.height - box.height) > 0.5 || !Array.isArray(value.boundaries) ||
      value.boundaries[0] !== 0 || value.boundaries[value.boundaries.length - 1] !== text.length ||
      value.boundaries.some((v, i, a) => !Number.isInteger(v) || v < 0 || v > text.length || i > 0 && v <= a[i - 1]) ||
      !Array.isArray(value.line_ends) || JSON.stringify(value.line_ends) !== JSON.stringify(lineEnds) ||
      !Array.isArray(value.ink) || value.ink.length !== 4 || !value.ink.every(finite) ||
      value.ink[2] <= value.ink[0] || value.ink[3] <= value.ink[1]) throw measurementError();
  const boundaries = new Set(value.boundaries);
  let wrapViolation = false;
  for (const end of value.line_ends) {
    if (!boundaries.has(end)) throw measurementError();
    if (end !== text.length) {
      const left = Array.from(text.slice(0, end)).pop(), right = Array.from(text.slice(end))[0];
      if (pieceNoEnd.has(left) || pieceNoStart.has(right)) wrapViolation = true;
    }
  }
  // Only a fully validated native response can request a smaller catalog
  // size. Unknown glyphs, broken graphemes and bridge failures still throw.
  // A forbidden break never authorizes display at the current size.
  // Do not call these pixel bounds a font availability guarantee. OS fallback,
  // B9 soft wrap equivalence and capture/device acceptance remain separate.
  return Object.freeze({ overflow: value.ink[0] < 0 || value.ink[1] < 0 ||
    value.ink[2] > box.width || value.ink[3] > box.height,
    wrapViolation, platform, glyphCheck: value.glyph_check, ink: Object.freeze([...value.ink]) });
}

export async function inspectPieceText(node, expected) {
  const tag = findNodeHandle(node), module = NativeModules.PieceTextMetrics;
  if (!Number.isInteger(tag) || tag <= 0 || typeof module?.inspect !== 'function') throw measurementError();
  let result;
  try { result = await module.inspect(tag, expected.text, expected.fontSize); }
  catch { throw measurementError(); }
  return readPieceTextInspection(result, { ...expected, platform: Platform.OS });
}

// v5 inspects one mounted selected line. Independent CoreText coordinates
// guard its dimensions; TextKit ink remains the placement coordinate source.
export function readPieceSelectedLineInspection(value, expected) {
  const fields = ['version', 'platform', 'font_size', 'width', 'height', 'utf16_length', 'boundaries',
    'line_ends', 'ink', 'glyph_check', 'independent_metrics_f64le'];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      value.version !== 'piece.native_selected_line.v1' || expected.platform !== 'ios' ||
      JSON.stringify(expected.lineEnds) !== JSON.stringify([expected.text.length]) ||
      JSON.stringify(value.line_ends) !== JSON.stringify([expected.text.length])) throw measurementError();
  const { independent_metrics_f64le: encoded, ...textEvidence } = value;
  const inspected = readPieceTextInspection({ ...textEvidence, version: 'piece.native_text.v1' }, expected);
  const bytes = unpackBytes(encoded, 40), independentMetrics = Array.from({ length: 5 }, (_, i) => bytes.getFloat64(i * 8, true));
  if (!independentMetrics.every(finite) || independentMetrics[0] < 0 ||
      independentMetrics[3] < independentMetrics[1] || independentMetrics[4] < independentMetrics[2]) throw measurementError();
  return Object.freeze({ ...inspected, version: value.version, fontSize: value.font_size,
    independentMetrics: Object.freeze(independentMetrics) });
}

export async function inspectPieceSelectedLine(node, expected) {
  const tag = findNodeHandle(node), module = NativeModules.PieceTextMetrics;
  if (Platform.OS !== 'ios' || !Number.isInteger(tag) || tag <= 0 ||
      typeof module?.inspectSelectedLine !== 'function') throw measurementError();
  let result;
  try { result = await module.inspectSelectedLine(tag, expected.text, expected.fontSize); }
  catch { throw measurementError(); }
  return readPieceSelectedLineInspection(result, { ...expected, platform: Platform.OS });
}

// v9 is a separate, closed contract. Local alpha chooses placement; only the
// placed response can establish drawing evidence. Coordinates use the fixed
// logical canvas at scale 1, including its fractional translation phase.
export function readPieceSelectedLineV2Inspection(value, expected) {
  const extra = ['stage', 'tag', 'canvas_tag', 'canvas_frame', 'content_frame', 'raster_scale', 'snapshot_token'];
  const fields = ['version', 'platform', 'font_size', 'width', 'height', 'utf16_length', 'boundaries',
    'line_ends', 'ink', 'glyph_check', 'independent_metrics_f64le', ...extra];
  const rect = v => Array.isArray(v) && v.length === 4 && v.every(finite) && v[2] > 0 && v[3] > 0;
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      value.version !== 'piece.native_selected_line.v2' || expected.platform !== 'ios' ||
      !['local', 'placed'].includes(expected.stage) || value.stage !== expected.stage ||
      !Number.isInteger(expected.tag) || expected.tag <= 0 || value.tag !== expected.tag ||
      !Number.isInteger(expected.canvasTag) || expected.canvasTag <= 0 || value.canvas_tag !== expected.canvasTag ||
      expected.tag === expected.canvasTag || value.raster_scale !== 1 ||
      typeof value.snapshot_token !== 'string' || !value.snapshot_token.length || value.snapshot_token.length > 128 ||
      !rect(value.canvas_frame) || !rect(value.content_frame) ||
      value.canvas_frame[2] !== value.width || value.canvas_frame[3] !== value.height) throw measurementError();
  if (expected.stage === 'placed' && (!expected.local ||
      value.snapshot_token !== expected.local.snapshotToken || !rect(expected.canvasFrame) ||
      value.canvas_frame.some((n, i) => Math.abs(n - expected.canvasFrame[i]) > 0.5) ||
      value.content_frame.some((n, i) => n !== expected.local.contentFrame[i]) ||
      value.width !== expected.local.canvasFrame[2] || value.height !== expected.local.canvasFrame[3])) throw measurementError();
  const legacy = { ...value, version: 'piece.native_selected_line.v1' };
  extra.forEach(key => delete legacy[key]);
  const inspected = readPieceSelectedLineInspection(legacy, expected);
  if (expected.stage === 'placed' && inspected.independentMetrics.some((n, i) =>
      !Object.is(n, expected.local.independentMetrics[i]))) throw measurementError();
  return Object.freeze({ ...inspected, version: value.version, stage: value.stage, tag: value.tag,
    canvasTag: value.canvas_tag, canvasFrame: Object.freeze([...value.canvas_frame]),
    contentFrame: Object.freeze([...value.content_frame]), rasterScale: value.raster_scale,
    snapshotToken: value.snapshot_token });
}

export async function inspectPieceSelectedLineV2(node, expected) {
  const tag = findNodeHandle(node), canvasTag = findNodeHandle(expected.canvasNode), module = NativeModules.PieceTextMetrics;
  if (Platform.OS !== 'ios' || !Number.isInteger(tag) || tag <= 0 || !Number.isInteger(canvasTag) ||
      canvasTag <= 0 || tag === canvasTag || !finite(expected.expiresAt) || Date.now() >= expected.expiresAt ||
      !['local', 'placed'].includes(expected.stage) || typeof module?.inspectSelectedLineV2 !== 'function') throw measurementError();
  let value;
  try { value = await module.inspectSelectedLineV2(tag, expected.text, expected.fontSize, {
    stage: expected.stage, canvas_tag: canvasTag, expires_at_ms: expected.expiresAt,
    snapshot_token: expected.stage === 'placed' ? expected.local?.snapshotToken : null,
  }); } catch { throw measurementError(); }
  if (Date.now() >= expected.expiresAt) throw measurementError();
  return readPieceSelectedLineV2Inspection(value, { ...expected, tag, canvasTag, platform: Platform.OS });
}

// Containment v1 keeps V2 intact. Its three independently measured footprints
// cover scale-1 direct paint, unclipped native-scale paint and the natural layer.
// Recompute the exact union here; neither a component nor the supplied union
// can silently narrow the visible footprint. This remains local evidence only.
export function readPieceSelectedLineV3Inspection(value, expected) {
  const fields = ['version', 'platform', 'font_size', 'width', 'height', 'utf16_length', 'boundaries',
    'line_ends', 'ink', 'glyph_check', 'independent_metrics_f64le', 'stage', 'tag', 'canvas_tag',
    'canvas_frame', 'content_frame', 'raster_scale', 'snapshot_token', 'native_raster_scale', 'component_inks'];
  const inkRect = rect => Array.isArray(rect) && rect.length === 4 && rect.every(finite) &&
    rect[2] > rect[0] && rect[3] > rect[1];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      value.version !== 'piece.native_selected_line.v3' || !finite(value.native_raster_scale) ||
      value.native_raster_scale <= 0 || !value.component_inks || Array.isArray(value.component_inks) ||
      Object.keys(value.component_inks).sort().join() !== 'direct,layer,native' ||
      !['direct', 'native', 'layer'].every(key => inkRect(value.component_inks[key])) ||
      !inkRect(value.ink)) throw measurementError();
  const components = ['direct', 'native', 'layer'].map(key => value.component_inks[key]);
  const union = [Math.min(...components.map(rect => rect[0])), Math.min(...components.map(rect => rect[1])),
    Math.max(...components.map(rect => rect[2])), Math.max(...components.map(rect => rect[3]))];
  if (union.some((n, i) => !Object.is(n, value.ink[i])) ||
      expected.stage === 'placed' && (expected.local?.version !== 'piece.native_selected_line.v3' ||
        expected.local.stage !== 'local' || value.native_raster_scale !== expected.local.nativeRasterScale)) throw measurementError();
  const { native_raster_scale: nativeRasterScale, component_inks: componentInks, ...v2Evidence } = value;
  // V2's closed geometry, identity, independent metrics and one-line checks
  // apply unchanged. The bridge entry and retained result version stay V3.
  const inspected = readPieceSelectedLineV2Inspection({ ...v2Evidence, version: 'piece.native_selected_line.v2' }, expected);
  return Object.freeze({ ...inspected, version: value.version, nativeRasterScale,
    componentInks: Object.freeze(Object.fromEntries(['direct', 'native', 'layer'].map(key =>
      [key, Object.freeze([...componentInks[key]])]))) });
}

export async function inspectPieceSelectedLineV3(node, expected) {
  const tag = findNodeHandle(node), canvasTag = findNodeHandle(expected.canvasNode), module = NativeModules.PieceTextMetrics;
  if (Platform.OS !== 'ios' || !Number.isInteger(tag) || tag <= 0 || !Number.isInteger(canvasTag) ||
      canvasTag <= 0 || tag === canvasTag || !finite(expected.expiresAt) || Date.now() >= expected.expiresAt ||
      !['local', 'placed'].includes(expected.stage) || typeof module?.inspectSelectedLineV3 !== 'function' ||
      expected.stage === 'placed' && (expected.local?.version !== 'piece.native_selected_line.v3' ||
        expected.local.stage !== 'local')) throw measurementError();
  let value;
  try { value = await module.inspectSelectedLineV3(tag, expected.text, expected.fontSize, {
    stage: expected.stage, canvas_tag: canvasTag, expires_at_ms: expected.expiresAt,
    snapshot_token: expected.stage === 'placed' ? expected.local.snapshotToken : null,
  }); } catch { throw measurementError(); }
  if (Date.now() >= expected.expiresAt) throw measurementError();
  return readPieceSelectedLineV3Inspection(value, { ...expected, tag, canvasTag, platform: Platform.OS });
}

// Candidates are shaped with an immutable snapshot of the mounted Text's
// font. They guide B9 selection; each selected Text is inspected again.
function candidateRowCount(boundaries) {
  const n = Array.isArray(boundaries) ? boundaries.length - 1 : 0;
  if (n < 1 || n > 420) throw measurementError();
  return n * (n + 1) / 2;
}
function unpackBytes(encoded, byteLength) {
  if (typeof encoded !== 'string' || encoded.length !== Math.ceil(byteLength / 3) * 4) throw measurementError();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const codes = new Int16Array(128).fill(-1);
  for (let i = 0; i < alphabet.length; i++) codes[alphabet.charCodeAt(i)] = i;
  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  // Only the final quartet can contain padding. Decode every preceding
  // quartet without repeating the tail rules, still rejecting every invalid
  // character (including non-ASCII and misplaced '=').
  const tail = encoded.length - 4;
  for (let i = 0; i < tail; i += 4) {
    const a = codes[encoded.charCodeAt(i)], b = codes[encoded.charCodeAt(i + 1)],
      c = codes[encoded.charCodeAt(i + 2)], d = codes[encoded.charCodeAt(i + 3)];
    if (!(a >= 0 && b >= 0 && c >= 0 && d >= 0)) throw measurementError();
    bytes[offset++] = (a << 2) | (b >> 4);
    bytes[offset++] = ((b & 15) << 4) | (c >> 2);
    bytes[offset++] = ((c & 3) << 6) | d;
  }
  for (let i = Math.max(0, tail); i < encoded.length; i += 4) {
    const a = codes[encoded.charCodeAt(i)], b = codes[encoded.charCodeAt(i + 1)];
    const pad2 = encoded[i + 2] === '=', pad3 = encoded[i + 3] === '=';
    const c = pad2 ? 0 : codes[encoded.charCodeAt(i + 2)], d = pad3 ? 0 : codes[encoded.charCodeAt(i + 3)];
    if (!(a >= 0 && b >= 0 && c >= 0 && d >= 0) || pad2 && !pad3 ||
        (pad2 || pad3) && i + 4 !== encoded.length || pad2 && (b & 15) || pad3 && !pad2 && (c & 3)) throw measurementError();
    bytes[offset++] = (a << 2) | (b >> 4);
    if (!pad2) bytes[offset++] = ((b & 15) << 4) | (c >> 2);
    if (!pad3) bytes[offset++] = ((c & 3) << 6) | d;
  }
  if (offset !== byteLength) throw measurementError();
  return new DataView(bytes.buffer);
}
function unpackCandidateRows(encoded, boundaries) {
  const count = candidateRowCount(boundaries), view = unpackBytes(encoded, count * 56), rows = new Array(count);
  for (let i = 0; i < count; i++) {
    const row = new Array(7);
    for (let j = 0; j < 7; j++) row[j] = view.getFloat64((i * 7 + j) * 8, true);
    rows[i] = row;
  }
  return rows;
}

function unpackIndexedCandidateRows(value) {
  const count = candidateRowCount(value.boundaries), unique = value.metric_count;
  if (!Number.isInteger(unique) || unique < 1 || unique > count) throw measurementError();
  const metrics = unpackBytes(value.metrics_f64le, unique * 40);
  const indices = unpackBytes(value.row_indices_u32le, count * 4);
  // Decode each exact representative once; every ordered range still gets
  // its complete row and the planner validates every value as before.
  const decoded = new Float64Array(unique * 5);
  for (let j = 0; j < decoded.length; j++) decoded[j] = metrics.getFloat64(j * 8, true);
  const used = new Uint8Array(unique), rows = new Array(count), n = value.boundaries.length - 1;
  let i = 0, seen = 0;
  for (let start = 0; start < n; start++) for (let end = start + 1; end <= n; end++) {
    const index = indices.getUint32(i * 4, true);
    if (index >= unique) throw measurementError();
    if (!used[index]) { used[index] = 1; seen++; }
    const offset = index * 5;
    rows[i++] = [start, end, decoded[offset], decoded[offset + 1], decoded[offset + 2],
      decoded[offset + 3], decoded[offset + 4]];
  }
  if (seen !== unique) throw measurementError();
  return rows;
}

function unpackWidthCandidateRows(value, width) {
  const count = candidateRowCount(value.boundaries), unique = value.metric_count, full = value.full_metric_count;
  if (!Number.isInteger(unique) || unique < 1 || unique > count ||
      !Number.isInteger(full) || full < 0 || full > unique) throw measurementError();
  const records = unpackBytes(value.metric_records_le, unique * 9 + full * 32);
  const indices = unpackBytes(value.row_indices_u32le, count * 4), decoded = new Array(unique);
  let offset = 0, fullSeen = 0;
  for (let index = 0; index < unique; index++) {
    if (offset + 9 > records.byteLength) throw measurementError();
    const tag = records.getUint8(offset++), advance = records.getFloat64(offset, true); offset += 8;
    if (!finite(advance) || advance < 0 || tag !== 0 && tag !== 1) throw measurementError();
    if (tag === 1) {
      if (advance <= width) throw measurementError();
      decoded[index] = [advance, 'width_overflow'];
    } else {
      if (advance > width || offset + 32 > records.byteLength) throw measurementError();
      const metric = [advance];
      for (let j = 0; j < 4; j++, offset += 8) metric.push(records.getFloat64(offset, true));
      if (!metric.every(finite) || metric[3] < metric[1] || metric[4] < metric[2]) throw measurementError();
      decoded[index] = metric; fullSeen++;
    }
  }
  if (offset !== records.byteLength || fullSeen !== full) throw measurementError();
  const used = new Uint8Array(unique), rows = new Array(count), n = value.boundaries.length - 1;
  let i = 0, seen = 0;
  for (let start = 0; start < n; start++) for (let end = start + 1; end <= n; end++) {
    const index = indices.getUint32(i * 4, true);
    if (index >= unique) throw measurementError();
    if (!used[index]) { used[index] = 1; seen++; }
    const metric = decoded[index];
    rows[i++] = metric.length === 2 ? [start, end, metric[0], 'width_overflow']
      : [start, end, metric[0], metric[1], metric[2], metric[3], metric[4]];
  }
  if (seen !== unique) throw measurementError();
  return rows;
}

export async function measurePieceCandidates(node, text, fontSize, options) {
  const tag = findNodeHandle(node), module = NativeModules.PieceTextMetrics;
  const exploration = options?.candidateProfile === PIECE_NATIVE_PREVIEW_V5_VERSION;
  const bounded = options !== undefined && !exploration, width = options?.contentWidth;
  if (options !== undefined && (Platform.OS !== 'ios' || (exploration
    ? Object.keys(options).join() !== 'candidateProfile'
    : !options || Object.keys(options).sort().join() !== 'candidateProfile,contentWidth' ||
      options.candidateProfile !== PIECE_NATIVE_PREVIEW_V4_VERSION || !finite(width) || width <= 0))) throw measurementError();
  const method = exploration ? 'measureExplorationCandidates' : bounded ? 'measureCandidatesForWidth' : 'measureCandidates';
  if (!Number.isInteger(tag) || tag <= 0 || typeof module?.[method] !== 'function') throw measurementError();
  let value;
  try { value = bounded ? await module[method](tag, text, fontSize, width) : await module[method](tag, text, fontSize); }
  catch { throw measurementError(); }
  const packed = value?.version === 'piece.native_candidates.v2';
  const indexed = value?.version === 'piece.native_candidates.v3' || exploration;
  const fields = ['version', 'platform', 'font_size', 'utf16_length', 'boundaries', 'glyph_check',
    ...(bounded ? ['content_width', 'metric_count', 'full_metric_count', 'metric_records_le', 'row_indices_u32le']
      : indexed ? ['metric_count', 'metrics_f64le', 'row_indices_u32le'] : [packed ? 'rows_f64le' : 'rows'])];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      (exploration ? value.version !== 'piece.native_candidates.v5'
        : bounded ? value.version !== 'piece.native_candidates.v4' || value.content_width !== width
        : !['piece.native_candidates.v1', 'piece.native_candidates.v2', 'piece.native_candidates.v3'].includes(value.version)) ||
      value.platform !== Platform.OS || !['ios', 'android'].includes(Platform.OS) ||
      value.glyph_check !== 'no_missing_observed' || value.utf16_length !== text.length ||
      !finite(value.font_size) || Math.abs(value.font_size - fontSize) > 0.5) throw measurementError();
  // v4 carries its exact width and version through the planner boundary.
  // An overflow row has no ink slots and can never become a drawable row.
  if (bounded) return { version: value.version, contentWidth: width, boundaries: value.boundaries,
    rows: unpackWidthCandidateRows(value, width) };
  if (exploration) return { version: value.version, boundaries: value.boundaries, rows: unpackIndexedCandidateRows(value) };
  // The planner validates exact boundary/row coverage and every metric.
  return { boundaries: value.boundaries, rows: indexed ? unpackIndexedCandidateRows(value)
    : packed ? unpackCandidateRows(value.rows_f64le, value.boundaries) : value.rows };
}
