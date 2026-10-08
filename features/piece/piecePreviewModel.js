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
