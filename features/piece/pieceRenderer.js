/** Native inspection of the Text instance actually used by PieceVisualCard.
 * Results are local drawing evidence, never server fit/save/export authority.
 */
import { NativeModules, Platform, findNodeHandle } from 'react-native';
import { PIECE_NATIVE_PREVIEW_V4_VERSION } from './pieceLayout';

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
  const bounded = options !== undefined, width = options?.contentWidth;
  if (bounded && (!options || Object.keys(options).sort().join() !== 'candidateProfile,contentWidth' ||
      options.candidateProfile !== PIECE_NATIVE_PREVIEW_V4_VERSION || Platform.OS !== 'ios' ||
      !finite(width) || width <= 0)) throw measurementError();
  const method = bounded ? 'measureCandidatesForWidth' : 'measureCandidates';
  if (!Number.isInteger(tag) || tag <= 0 || typeof module?.[method] !== 'function') throw measurementError();
  let value;
  try { value = bounded ? await module[method](tag, text, fontSize, width) : await module[method](tag, text, fontSize); }
  catch { throw measurementError(); }
  const packed = value?.version === 'piece.native_candidates.v2';
  const indexed = value?.version === 'piece.native_candidates.v3';
  const fields = ['version', 'platform', 'font_size', 'utf16_length', 'boundaries', 'glyph_check',
    ...(bounded ? ['content_width', 'metric_count', 'full_metric_count', 'metric_records_le', 'row_indices_u32le']
      : indexed ? ['metric_count', 'metrics_f64le', 'row_indices_u32le'] : [packed ? 'rows_f64le' : 'rows'])];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      (bounded ? value.version !== 'piece.native_candidates.v4' || value.content_width !== width
        : !['piece.native_candidates.v1', 'piece.native_candidates.v2', 'piece.native_candidates.v3'].includes(value.version)) ||
      value.platform !== Platform.OS || !['ios', 'android'].includes(Platform.OS) ||
      value.glyph_check !== 'no_missing_observed' || value.utf16_length !== text.length ||
      !finite(value.font_size) || Math.abs(value.font_size - fontSize) > 0.5) throw measurementError();
  // v4 carries its exact width and version through the planner boundary.
  // An overflow row has no ink slots and can never become a drawable row.
  if (bounded) return { version: value.version, contentWidth: width, boundaries: value.boundaries,
    rows: unpackWidthCandidateRows(value, width) };
  // The planner validates exact boundary/row coverage and every metric.
  return { boundaries: value.boundaries, rows: indexed ? unpackIndexedCandidateRows(value)
    : packed ? unpackCandidateRows(value.rows_f64le, value.boundaries) : value.rows };
}
