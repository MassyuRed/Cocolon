/** Native inspection of the Text instance actually used by PieceVisualCard.
 * Results are local drawing evidence, never server fit/save/export authority.
 */
import { NativeModules, Platform, findNodeHandle } from 'react-native';

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
  for (let i = 0; i < encoded.length; i += 4) {
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
  const used = new Uint8Array(unique), rows = new Array(count), n = value.boundaries.length - 1;
  let i = 0, seen = 0;
  for (let start = 0; start < n; start++) for (let end = start + 1; end <= n; end++) {
    const index = indices.getUint32(i * 4, true);
    if (index >= unique) throw measurementError();
    if (!used[index]) { used[index] = 1; seen++; }
    const row = [start, end];
    for (let j = 0; j < 5; j++) row.push(metrics.getFloat64(index * 40 + j * 8, true));
    rows[i++] = row;
  }
  if (seen !== unique) throw measurementError();
  return rows;
}

export async function measurePieceCandidates(node, text, fontSize) {
  const tag = findNodeHandle(node), module = NativeModules.PieceTextMetrics;
  if (!Number.isInteger(tag) || tag <= 0 || typeof module?.measureCandidates !== 'function') throw measurementError();
  let value;
  try { value = await module.measureCandidates(tag, text, fontSize); }
  catch { throw measurementError(); }
  const packed = value?.version === 'piece.native_candidates.v2';
  const indexed = value?.version === 'piece.native_candidates.v3';
  const fields = ['version', 'platform', 'font_size', 'utf16_length', 'boundaries', 'glyph_check',
    ...(indexed ? ['metric_count', 'metrics_f64le', 'row_indices_u32le'] : [packed ? 'rows_f64le' : 'rows'])];
  if (!value || Object.keys(value).sort().join() !== fields.sort().join() ||
      !['piece.native_candidates.v1', 'piece.native_candidates.v2', 'piece.native_candidates.v3'].includes(value.version) ||
      value.platform !== Platform.OS || !['ios', 'android'].includes(Platform.OS) ||
      value.glyph_check !== 'no_missing_observed' || value.utf16_length !== text.length ||
      !finite(value.font_size) || Math.abs(value.font_size - fontSize) > 0.5) throw measurementError();
  // The planner validates exact boundary/row coverage and every metric.
  return { boundaries: value.boundaries, rows: indexed ? unpackIndexedCandidateRows(value)
    : packed ? unpackCandidateRows(value.rows_f64le, value.boundaries) : value.rows };
}
