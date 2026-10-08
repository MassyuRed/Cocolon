/**
 * PCE-8 B10 request lifecycle owner: existing API -> model -> view invalidation.
 * This is the headless part of PieceCreateController, not a React component.
 * No existing screen imports it yet; importing/constructing it sends nothing.
 *
 * Host contract:
 * - One instance per mounted preview host. Subscribe, read getView(), and call
 *   dispose() on unmount. Subscriptions invalidate; they carry no cached body.
 * - Supply the resolved effective enabled flag and a body-free saved/terminal
 *   source request through setContext BEFORE starting or exposing that context.
 *   On owner/source/selection changes or disable, call setContext synchronously;
 *   stale results are fenced even if the transport ignores local cancellation.
 * - start/retry are explicit actions. Their promises resolve without a body or
 *   success flag; read getView() after settlement. A changed request needs a new
 *   idempotency key. The controller never generates, normalizes or replaces it.
 * - Refresh on host clock/foreground changes. getView rechecks expiry; this file
 *   does not install an expiry timer, AppState hook, Auth or runtime subscription.
 * - close() abandons the local attempt, NOT a server DELETE. Reopening the same
 *   context can replay the same server request/key; disable/dispose clears it.
 *
 * Receipt is NOT hash verification, renderer admission, save/export authority
 * or completed B10 UI. Native rendering, capabilities/quota and source CTA
 * integration remain outside this bounded continuation. No new dependencies.
 */
import { PieceApiError, preparePiecePreviewRequest, requestPiecePreview } from './pieceApi';
import { createPiecePreviewState, closePiecePreview, beginPiecePreview, completePiecePreview, failPiecePreview, retryPiecePreview, readPiecePreviewView, expirePiecePreview } from './piecePreviewModel';

export function createPieceCreateController(configuration = {}) {
  const now = typeof configuration?.now === 'function' ? configuration.now : Date.now;
  const listeners = new Set();
  let state = createPiecePreviewState();
  let operation = null;
  let enabled = false;
  let boundaryCode = null;
  let active = null;
  let disposed = false;

  // Both sides are detached JSON snapshots made by the existing API reader.
  // Key order does not create a new intent or change exact retry bytes.
  function equivalent(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(key =>
      Object.prototype.hasOwnProperty.call(b, key) && equivalent(a[key], b[key]));
  }

  function clock() {
    try { return now(); } catch { return NaN; }
  }

  function notify() {
    if (disposed) return;
    for (const listener of [...listeners]) {
      if (disposed || !listeners.has(listener)) continue;
      // A view subscriber must not replace a successful network result with
      // its own rendering exception. No private message is logged or retained.
      try { listener(); } catch { /* The host owns its rendering errors. */ }
    }
  }

  function clearAttempt() {
    const previous = active;
    active = null;
    state = closePiecePreview();
    // Invalidate identity BEFORE notifying the underlying AbortSignal. Even a
    // synchronous/reentrant abort observer sees the cleared current attempt.
    if (previous) previous.abort.abort();
  }

  function getView() {
    const view = readPiecePreviewView(state, {
      enabled: !disposed && enabled,
      expectedUserId: operation?.expectedUserId,
      nowMs: clock(),
    });
    if (!disposed && enabled && boundaryCode) {
      return Object.freeze({ ...view, phase: 'unavailable', preview: null,
        message: new PieceApiError(boundaryCode).message, canRetry: false });
    }
    return view;
  }

  function setContext(value = {}) {
    if (disposed) return;
    if (value?.enabled !== true) {
      enabled = false;
      operation = null;
      boundaryCode = null;
      clearAttempt();
      notify();
      return;
    }
    let next;
    try { next = preparePiecePreviewRequest(value.request, value); }
    catch (error) {
      enabled = true;
      operation = null;
      boundaryCode = error instanceof PieceApiError ? error.code : 'PIECE_REQUEST_INVALID';
      clearAttempt();
      notify();
      return;
    }
    if (operation?.expectedUserId === next.expectedUserId &&
        operation.idempotencyKey === next.idempotencyKey &&
        !equivalent(operation.request, next.request)) {
      // Keep the previous body-free binding while rejecting this conflict, so
      // repeating the same invalid context cannot erase the key's binding.
      enabled = true;
      boundaryCode = 'PIECE_CONFLICT';
      clearAttempt();
      notify();
      return;
    }
    if (enabled && !boundaryCode && equivalent(operation, next)) return;
    enabled = true;
    operation = next;
    boundaryCode = null;
    clearAttempt();
    notify();
  }

  function current(attempt) {
    return !disposed && enabled && !boundaryCode && active === attempt &&
      state.ticket === attempt.ticket;
  }

  async function run(begun) {
    if (!begun.ticket) return;
    state = begun.state;
    let abort;
    try { abort = new AbortController(); }
    catch (error) {
      state = failPiecePreview(state, begun.ticket, error, { expectedUserId: operation?.expectedUserId });
      notify();
      return;
    }
    const attempt = { ticket: begun.ticket, abort };
    const captured = state.operation;
    active = attempt;
    notify();
    // A subscriber may have closed, disabled, unmounted or selected a different
    // input in response to loading. Do not start HTTP for that obsolete action.
    if (!current(attempt)) return;
    try {
      const result = await requestPiecePreview(captured.request, {
        expectedUserId: captured.expectedUserId,
        idempotencyKey: captured.idempotencyKey,
        signal: abort.signal,
      });
      if (!current(attempt)) return;
      state = completePiecePreview(state, attempt.ticket, result, {
        expectedUserId: operation?.expectedUserId, nowMs: clock(),
      });
    } catch (error) {
      if (!current(attempt)) return;
      state = failPiecePreview(state, attempt.ticket, error, { expectedUserId: operation?.expectedUserId });
    }
    // Clear BEFORE notification. A subscriber may start a new intent here;
    // there is deliberately no old finally block that could clear that intent.
    active = null;
    if (state.code === 'PIECE_AUTH_REQUIRED') {
      operation = null;
      boundaryCode = 'PIECE_AUTH_REQUIRED';
    }
    notify();
  }

  async function start() {
    if (disposed || !enabled || !operation || boundaryCode || state.phase !== 'idle') return;
    await run(beginPiecePreview(state, operation.request, { ...operation, enabled: true }));
  }

  async function retry() {
    if (disposed || !enabled || !operation || boundaryCode) return;
    await run(retryPiecePreview(state, { enabled: true, expectedUserId: operation.expectedUserId }));
  }

  function close() {
    if (disposed) return;
    // A conflict/invalid context remains blocked until a valid context update.
    // Retain only the current body-free request/key; drop the received body.
    clearAttempt();
    notify();
  }

  function subscribe(listener) {
    if (disposed) return () => {};
    if (typeof listener !== 'function') throw new TypeError('Piece listener must be a function.');
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }

  function refresh() {
    if (disposed) return;
    state = expirePiecePreview(state, clock());
    notify();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.clear();
    enabled = false;
    operation = null;
    boundaryCode = null;
    clearAttempt();
  }

  return Object.freeze({ setContext, getView, start, retry, close, subscribe, refresh, dispose });
}
