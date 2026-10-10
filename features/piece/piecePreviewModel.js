/**
 * B10 pure request/received-preview state. No network, storage or renderer.
 * The caller must use the returned frozen request/key and the same ticket.
 * Closing, disabling, switching accounts or selecting another source clears
 * the state; a delayed completion cannot repopulate it. Never reuse the old
 * state after those events. Transport receipt is NOT hash/render/save approval.
 */
import { PieceApiError, preparePiecePreviewRequest, readPiecePreviewSnapshot } from "./pieceApi";

const frozen = value => Object.freeze(value);
const plain = phase => frozen({ phase, operation: null, ticket: null, preview: null, code: null });
export const createPiecePreviewState = () => plain('idle');
export const closePiecePreview = () => plain('idle');

const same = (a, b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(k => Object.prototype.hasOwnProperty.call(b, k) && same(a[k], b[k]));
};
const pending = (state, ticket) => state?.phase === 'loading' && ticket !== null && state.ticket === ticket;
const denied = () => frozen({ ...plain('unavailable'), code: 'PIECE_AUTH_REQUIRED' });
const failure = (state, code) => frozen({ ...state, phase: 'unavailable', preview: null, code });

export function beginPiecePreview(state, request, options = {}) {
  if (options?.enabled !== true) return frozen({ state: plain('disabled'), ticket: null });
  const operation = preparePiecePreviewRequest(request, options);
  if (state?.phase === 'loading') return frozen({ state, ticket: null });
  // Do not silently reuse a key for a new source/format/visual selection.
  const previous = state?.operation;
  if (previous?.expectedUserId === operation.expectedUserId &&
      previous.idempotencyKey === operation.idempotencyKey && !same(previous.request, operation.request)) {
    throw new PieceApiError('PIECE_CONFLICT');
  }
  const chosen = previous && same(previous, operation) ? previous : operation;
  const ticket = frozen({}); // Identity is local to this single in-flight attempt.
  return frozen({ state: frozen({ phase: 'loading', operation: chosen, ticket, preview: null, code: null }), ticket });
}

// Parse the server's offset timestamp without normalizing its stored string.
// Fractional microseconds are floored to milliseconds: never extend expiry.
function expiryMilliseconds(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!m) return NaN;
  const [year, month, day, hour, minute, second] = m.slice(1, 7).map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return NaN;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, Number((m[7] || '').slice(0, 3).padEnd(3, '0')));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return NaN;
  const offset = m[8];
  if (offset === 'Z') return date.getTime();
  const hours = Number(offset.slice(1, 3)), minutes = Number(offset.slice(4, 6));
  if (hours > 23 || minutes > 59) return NaN;
  return date.getTime() - (offset[0] === '+' ? 1 : -1) * (hours * 60 + minutes) * 60000;
}

export function completePiecePreview(state, ticket, result, { expectedUserId, nowMs = Date.now() } = {}) {
  if (!pending(state, ticket)) return state;
  if (!expectedUserId || expectedUserId !== state.operation.expectedUserId) return denied();
  try {
    const preview = readPiecePreviewSnapshot(result);
    const expires = expiryMilliseconds(preview.expires_at);
    if (!Number.isFinite(nowMs) || !Number.isFinite(expires)) return failure(state, 'PIECE_TEMPORARILY_UNAVAILABLE');
    if (nowMs >= expires) return failure(state, 'PIECE_PREVIEW_EXPIRED');
    return frozen({ ...state, phase: 'received', preview, code: null });
  } catch {
    return failure(state, 'PIECE_TEMPORARILY_UNAVAILABLE');
  }
}

export function failPiecePreview(state, ticket, error, { expectedUserId } = {}) {
  if (!pending(state, ticket)) return state;
  if (!expectedUserId || expectedUserId !== state.operation.expectedUserId) return denied();
  if (error?.name === 'AbortError') return closePiecePreview();
  const code = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
  return code === 'PIECE_AUTH_REQUIRED' ? denied() : failure(state, code);
}

export function retryPiecePreview(state, options = {}) {
  if (options?.enabled !== true) return frozen({ state: plain('disabled'), ticket: null });
  if (!state?.operation || options.expectedUserId !== state.operation.expectedUserId) {
    return frozen({ state: denied(), ticket: null });
  }
  if (state.phase !== 'unavailable' || state.code !== 'PIECE_TEMPORARILY_UNAVAILABLE') {
    return frozen({ state, ticket: null });
  }
  return beginPiecePreview(state, state.operation.request, { ...state.operation, enabled: true });
}

export function readPiecePreviewView(state, { enabled = false, expectedUserId, nowMs = Date.now() } = {}) {
  const base = { phase: 'hidden', preview: null, message: '', canRetry: false,
    canSave: false, canExport: false, hashVerified: false };
  if (enabled !== true) return frozen(base);
  if (state?.operation && (!expectedUserId || expectedUserId !== state.operation.expectedUserId)) {
    return frozen({ ...base, phase: 'unavailable', message: new PieceApiError('PIECE_AUTH_REQUIRED').message });
  }
  if (state?.phase === 'received') {
    const expires = expiryMilliseconds(state.preview.expires_at);
    if (!Number.isFinite(nowMs) || !Number.isFinite(expires) || nowMs >= expires) {
      const code = Number.isFinite(nowMs) && Number.isFinite(expires) ? 'PIECE_PREVIEW_EXPIRED' : 'PIECE_TEMPORARILY_UNAVAILABLE';
      return frozen({ ...base, phase: 'unavailable', message: new PieceApiError(code).message });
    }
    return frozen({ ...base, phase: 'received', preview: state.preview });
  }
  if (state?.phase === 'unavailable') return frozen({ ...base, phase: 'unavailable',
    message: new PieceApiError(state.code).message,
    canRetry: !!state.operation && state.code === 'PIECE_TEMPORARILY_UNAVAILABLE' });
  return frozen({ ...base, phase: state?.phase === 'loading' ? 'loading' : 'idle' });
}

// PCE-6 preview display admission. This does not change transport's received
// state, authorize save/export, or assert that a native image renderer fits.
// Only the closed v1 payload/recipe accepted above are canonicalized; do not
// reuse this as a general JSON hash (e.g. arbitrary floating-point values).
const pieceSha256K = Object.freeze([
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
]);
function pieceUtf8Digest(value) {
  const bytes = [];
  for (const scalar of value) {
    const c = scalar.codePointAt(0);
    if (c >= 0xd800 && c <= 0xdfff) throw new PieceApiError('PIECE_HASH_MISMATCH');
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | c >>> 6, 0x80 | c & 63);
    else if (c < 0x10000) bytes.push(0xe0 | c >>> 12, 0x80 | c >>> 6 & 63, 0x80 | c & 63);
    else bytes.push(0xf0 | c >>> 18, 0x80 | c >>> 12 & 63, 0x80 | c >>> 6 & 63, 0x80 | c & 63);
  }
  const bits = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const high = Math.floor(bits / 0x100000000), low = bits >>> 0;
  for (const word of [high, low]) for (let shift = 24; shift >= 0; shift -= 8) bytes.push(word >>> shift & 255);
  const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const r = (x, n) => x >>> n | x << (32 - n);
  for (let offset = 0; offset < bytes.length; offset += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      w[i] = bytes[j] << 24 | bytes[j + 1] << 16 | bytes[j + 2] << 8 | bytes[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15], b = w[i - 2];
      w[i] = (w[i - 16] + (r(a,7) ^ r(a,18) ^ a >>> 3) + w[i - 7] + (r(b,17) ^ r(b,19) ^ b >>> 10)) | 0;
    }
    let [a,b,c,d,e,f,g,z] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (z + (r(e,6) ^ r(e,11) ^ r(e,25)) + (e & f ^ ~e & g) + pieceSha256K[i] + w[i]) | 0;
      const t2 = ((r(a,2) ^ r(a,13) ^ r(a,22)) + (a & b ^ a & c ^ b & c)) | 0;
      z=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    [a,b,c,d,e,f,g,z].forEach((word, i) => { h[i] = (h[i] + word) | 0; });
  }
  return h.map(word => (word >>> 0).toString(16).padStart(8, '0')).join('');
}
function pieceCanonicalValue(value) {
  if (Array.isArray(value)) return value.map(pieceCanonicalValue);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
    .map(key => [key, pieceCanonicalValue(value[key])]));
  return value;
}

// Shared by preview and saved-owner display. No expiry or current-plan rules.
export function verifyPieceArtifactHashes(value) {
  if (pieceUtf8Digest(value.piece_text) !== value.piece_text_hash ||
      pieceUtf8Digest(JSON.stringify(pieceCanonicalValue(value.content_payload))) !== value.content_payload_hash ||
      pieceUtf8Digest(JSON.stringify(pieceCanonicalValue(value.visual_recipe))) !== value.visual_recipe_hash) {
    throw new PieceApiError('PIECE_HASH_MISMATCH');
  }
}

export function readPiecePreviewDisplay(view, nowMs = Date.now()) {
  const base = { phase: 'hidden', preview: null, message: '', canRetry: false,
    canSave: false, canExport: false, hashVerified: false, expiresAtMs: null };
  if (!view || view.phase === 'hidden') return frozen(base);
  if (view.phase !== 'received') return frozen({ ...base,
    phase: ['idle', 'loading', 'unavailable', 'cancelled'].includes(view.phase) ? view.phase : 'unavailable',
    message: typeof view.message === 'string' ? view.message : '',
    canRetry: view.phase === 'unavailable' && view.canRetry === true,
    retryKind: ['recover', 'cancel'].includes(view.retryKind) ? view.retryKind : 'preview',
    loadingKind: ['visual', 'recover', 'cancel'].includes(view.loadingKind) ? view.loadingKind : 'preview' });
  try {
    const preview = readPiecePreviewSnapshot(view.preview);
    const expiresAtMs = expiryMilliseconds(preview.expires_at);
    if (!Number.isFinite(nowMs) || !Number.isFinite(expiresAtMs)) throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
    if (nowMs >= expiresAtMs) throw new PieceApiError('PIECE_PREVIEW_EXPIRED');
    verifyPieceArtifactHashes(preview);
    return frozen({ ...base, phase: 'received', preview, hashVerified: true, expiresAtMs,
      visualUpdated: view.visualUpdated === true, visualToken: view.visualToken || null });
  } catch (error) {
    const code = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
    return frozen({ ...base, phase: 'unavailable', message: new PieceApiError(code).message });
  }
}

// Commit an observed expiry on host timer/foreground refresh. A later local
// clock rollback must not revive a preview already observed to have expired.
export function expirePiecePreview(state, nowMs = Date.now()) {
  if (state?.phase !== 'received') return state;
  const expires = expiryMilliseconds(state.preview.expires_at);
  if (!Number.isFinite(nowMs) || !Number.isFinite(expires)) return failure(state, 'PIECE_TEMPORARILY_UNAVAILABLE');
  return nowMs >= expires ? failure(state, 'PIECE_PREVIEW_EXPIRED') : state;
}
