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
  for (const end of value.line_ends) {
    if (!boundaries.has(end)) throw measurementError();
    if (end !== text.length) {
      const left = Array.from(text.slice(0, end)).pop(), right = Array.from(text.slice(end))[0];
      if (pieceNoEnd.has(left) || pieceNoStart.has(right)) throw measurementError();
    }
  }
  // Do not call these pixel bounds a font availability guarantee. OS fallback,
  // B9 soft wrap equivalence and capture/device acceptance remain separate.
  return Object.freeze({ overflow: value.ink[0] < 0 || value.ink[1] < 0 ||
    value.ink[2] > box.width || value.ink[3] > box.height,
    platform, glyphCheck: value.glyph_check, ink: Object.freeze([...value.ink]) });
}

export async function inspectPieceText(node, expected) {
  const tag = findNodeHandle(node), module = NativeModules.PieceTextMetrics;
  if (!Number.isInteger(tag) || tag <= 0 || typeof module?.inspect !== 'function') throw measurementError();
  let result;
  try { result = await module.inspect(tag, expected.text, expected.fontSize); }
  catch { throw measurementError(); }
  return readPieceTextInspection(result, { ...expected, platform: Platform.OS });
}
