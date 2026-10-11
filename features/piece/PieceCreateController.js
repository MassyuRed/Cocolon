/**
 * PCE-8 B10 request lifecycle owner: existing API -> model -> view invalidation.
 * This is the headless part of PieceCreateController, not a React component.
 * The input action host uses it; importing/constructing it sends nothing.
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
 *   An explicit cancelPreview keeps a body-free terminal/unknown cancellation
 *   across close and can only retry the same DELETE, never the original POST.
 * - savePreview is an unconnected preparation seam. A future admitted host
 *   supplies strict saveEnabled, isSaveAdmitted and an explicit save key.
 *   close retains only the save intent/receipt; retry never returns to preview
 *   POST. Revoking saveEnabled alone keeps the intent but stops requests.
 *   General disable, changed context or dispose clears it. The future host
 *   handles same-selection runtime/foreground suspension via setSaveAvailability.
 *   Initial save controls and the actual admission supplier remain unconnected.
 *
 * Visual-only changes use the received candidate and a local display ticket.
 * Unknown outcomes recover via the original POST/key, never a PATCH retry.
 * Receipt alone is NOT hash verification or renderer/save/export admission.
 * The display reader and native renderer own their separate checks.
 */
import { PieceApiError, preparePiecePreviewRequest, preparePieceVisualChange, requestPiecePreview, requestPiecePreviewVisualChange, requestPiecePreviewCancellation, requestPieceSave } from './pieceApi';
import { createPiecePreviewState, closePiecePreview, beginPiecePreview, completePiecePreview, failPiecePreview, retryPiecePreview, readPiecePreviewView, readPiecePreviewDisplay, verifyPieceArtifactHashes, expirePiecePreview } from './piecePreviewModel';

export function createPieceCreateController(configuration = {}) {
  const now = typeof configuration?.now === 'function' ? configuration.now : Date.now;
  const onFeatureDisabled = typeof configuration?.onFeatureDisabled === 'function'
    ? configuration.onFeatureDisabled : null;
  const listeners = new Set();
  let state = createPiecePreviewState();
  let operation = null;
  let enabled = false;
  let boundaryCode = null;
  let active = null;
  let disposed = false;
  let visualRecovery = null;
  let visualUpdated = false;
  let cancelIntent = null;
  let cancelPhase = null;
  let cancelCode = null;
  let saveEnabled = false;
  let saveIntent = null;
  let savePhase = null;
  let saveCode = null;
  let savedReceipt = null;
  const recoverable = ['PIECE_TEMPORARILY_UNAVAILABLE', 'PIECE_PREVIEW_STALE',
    'PIECE_CONFLICT', 'PIECE_VISUAL_SELECTION_NOT_ALLOWED'];

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

  function clearAttempt(keepCancellation = false, keepSave = false) {
    const previous = active;
    active = null;
    visualRecovery = null;
    visualUpdated = false;
    if (!keepSave) {
      saveIntent = null;
      savePhase = null;
      saveCode = null;
      savedReceipt = null;
    } else if (savePhase === 'loading') {
      savePhase = 'unavailable';
      saveCode = 'PIECE_TEMPORARILY_UNAVAILABLE';
    }
    if (!keepCancellation) {
      cancelIntent = null;
      cancelPhase = null;
      cancelCode = null;
    } else if (cancelPhase === 'loading') {
      cancelPhase = 'unavailable';
      cancelCode = 'PIECE_TEMPORARILY_UNAVAILABLE';
    }
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
    if (!disposed && enabled && saveIntent) {
      return Object.freeze({ ...view, phase: savePhase, preview: null,
        loadingKind: 'save', retryKind: 'save', savedReceipt,
        canRetry: saveEnabled && savePhase === 'unavailable' && saveCode === 'PIECE_TEMPORARILY_UNAVAILABLE',
        message: savePhase === 'saved' ? 'Pieceを保存しました。' :
          saveCode === 'PIECE_TEMPORARILY_UNAVAILABLE'
            ? '保存結果を確認できませんでした。同じ保存要求で結果を確認できます。'
            : saveCode ? new PieceApiError(saveCode).message : '' });
    }
    if (!disposed && enabled && cancelIntent) {
      return Object.freeze({ ...view, phase: cancelPhase, preview: null,
        loadingKind: 'cancel', retryKind: 'cancel',
        canRetry: cancelPhase === 'unavailable' && cancelCode === 'PIECE_TEMPORARILY_UNAVAILABLE',
        message: cancelPhase === 'cancelled' ? '候補を取り消しました。保存回数は消費していません。' :
          cancelCode === 'PIECE_TEMPORARILY_UNAVAILABLE'
            ? '取消結果を確認できませんでした。同じ候補の取消を再試行できます。'
            : cancelCode ? new PieceApiError(cancelCode).message : '' });
    }
    if (visualRecovery && view.phase === 'unavailable' && recoverable.includes(state.code)) {
      return Object.freeze({ ...view, canRetry: true, retryKind: 'recover',
        message: '変更結果を確認できませんでした。最新のプレビューを取得してください。' });
    }
    return Object.freeze({ ...view, visualUpdated: visualUpdated && view.phase === 'received',
      visualToken: view.phase === 'received' ? state.ticket : null,
      loadingKind: visualRecovery && view.phase === 'loading' ? active?.mutation ? 'visual' : 'recover' : 'preview' });
  }

  function setContext(value = {}) {
    if (disposed) return;
    const nextSaveEnabled = value?.enabled === true && value?.saveEnabled === true;
    const saveFlagChanged = saveEnabled !== nextSaveEnabled;
    saveEnabled = nextSaveEnabled;
    // Revoke before abort: a synchronous abort listener may call retry().
    if (saveFlagChanged && !saveEnabled && saveIntent) clearAttempt(false, true);
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
    // A repeated stale true/source/key must not clear a server-disabled result.
    // A genuine disable/re-enable boundary or different intent can reset it;
    // neither begins a request automatically.
    if (enabled && (!boundaryCode || boundaryCode === 'PIECE_FEATURE_DISABLED') && equivalent(operation, next)) {
      if (saveFlagChanged) notify();
      return;
    }
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

  // A visual response/recovery may refresh quota, but must never replace the
  // body, expiry or renderer. Compare actual content as well as all three hashes.
  function checkVisualResult(result, mutation) {
    if (!visualRecovery) return;
    try { verifyPieceArtifactHashes(result); }
    catch { throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE'); }
    for (const key of ['api_contract_version', 'piece_contract_version', 'preview_id',
      'expires_at', 'visibility_scope', 'content_status', 'format_type', 'eligible_formats',
      'content_payload', 'content_payload_hash', 'piece_text', 'piece_text_hash', 'renderer_version']) {
      if (!equivalent(result[key], visualRecovery[key])) throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
    }
    const delta = result.preview_revision - visualRecovery.preview_revision;
    if (delta < 0 || result.row_version - visualRecovery.row_version !== delta ||
        mutation && delta !== 1 || !delta && !equivalent(result.visual_recipe, visualRecovery.visual_recipe)) {
      throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
    }
    // All non-selectable recipe fields must remain exactly the same too.
    const expectedRecipe = JSON.parse(JSON.stringify(visualRecovery.visual_recipe));
    expectedRecipe.theme.theme_id = result.visual_recipe.theme.theme_id;
    expectedRecipe.aspect_ratio = result.visual_recipe.aspect_ratio;
    expectedRecipe.branding.branding_mode = result.visual_recipe.branding.branding_mode;
    if (!equivalent(expectedRecipe, result.visual_recipe)) throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
    if (mutation && (result.visual_recipe.theme.theme_id !== mutation.visual_selection.theme_id ||
        result.visual_recipe.aspect_ratio !== mutation.visual_selection.aspect_ratio ||
        result.visual_recipe.branding.branding_mode !== mutation.visual_selection.branding_mode)) {
      throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
    }
  }

  async function run(begun, mutation = null) {
    if (!begun.ticket) return;
    state = begun.state;
    let abort;
    try { abort = new AbortController(); }
    catch (error) {
      state = failPiecePreview(state, begun.ticket, error, { expectedUserId: operation?.expectedUserId });
      notify();
      return;
    }
    const attempt = { ticket: begun.ticket, abort, mutation };
    const captured = state.operation;
    const operationAtStart = operation;
    active = attempt;
    notify();
    // A subscriber may have closed, disabled, unmounted or selected a different
    // input in response to loading. Do not start HTTP for that obsolete action.
    if (!current(attempt)) return;
    try {
      const result = mutation ? await requestPiecePreviewVisualChange(mutation, {
        expectedUserId: captured.expectedUserId, signal: abort.signal,
      }) : await requestPiecePreview(captured.request, {
        expectedUserId: captured.expectedUserId,
        idempotencyKey: captured.idempotencyKey,
        signal: abort.signal,
      });
      if (!current(attempt)) return;
      checkVisualResult(result, mutation);
      state = completePiecePreview(state, attempt.ticket, result, {
        expectedUserId: operation?.expectedUserId, nowMs: clock(),
      });
      if (state.phase === 'received' && visualRecovery) {
        visualUpdated = state.preview.preview_revision > visualRecovery.preview_revision;
        visualRecovery = null;
      }
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
    const featureDisabled = state.code === 'PIECE_FEATURE_DISABLED';
    if (featureDisabled) boundaryCode = 'PIECE_FEATURE_DISABLED';
    if (state.phase !== 'received' && !recoverable.includes(state.code)) visualRecovery = null;
    notify();
    // Notify only for the still-current settled intent, never for an obsolete
    // request, disposed host or a new context selected by a subscriber.
    if (featureDisabled && !disposed && enabled && operation === operationAtStart &&
        boundaryCode === 'PIECE_FEATURE_DISABLED' && onFeatureDisabled) {
      try { Promise.resolve(onFeatureDisabled()).catch(() => {}); }
      catch { /* Runtime refresh failure cannot convert disabled into retry. */ }
    }
  }

  async function start() {
    if (disposed || !enabled || !operation || boundaryCode || cancelIntent || saveIntent || state.phase !== 'idle') return;
    await run(beginPiecePreview(state, operation.request, { ...operation, enabled: true }));
  }

  async function retry() {
    if (disposed || !enabled || !operation || boundaryCode) return;
    if (saveIntent) {
      if (saveEnabled && savePhase === 'unavailable' && saveCode === 'PIECE_TEMPORARILY_UNAVAILABLE') await runSave();
      return;
    }
    if (cancelIntent) {
      if (cancelPhase === 'unavailable' && cancelCode === 'PIECE_TEMPORARILY_UNAVAILABLE') await runCancellation();
      return;
    }
    if (visualRecovery) {
      if (state.phase !== 'unavailable' || !recoverable.includes(state.code)) return;
      // Replay only the original POST/key. Never resend a mutation or invent a
      // new key/body after an ambiguous commit or stale revision.
      await run(beginPiecePreview(state, operation.request, { ...operation, enabled: true }));
      return;
    }
    await run(retryPiecePreview(state, { enabled: true, expectedUserId: operation.expectedUserId }));
  }

  async function changeVisual(selection, identity, visualToken) {
    if (disposed || !enabled || !operation || boundaryCode || active || visualRecovery || cancelIntent || saveIntent) return;
    if (!visualToken || visualToken !== state.ticket) return;
    const display = readPiecePreviewDisplay(getView(), clock());
    if (display.phase !== 'received' || !display.hashVerified) return;
    const preview = display.preview;
    if (!identity || identity.preview_id !== preview.preview_id ||
        identity.preview_revision !== preview.preview_revision ||
        identity.visual_recipe_hash !== preview.visual_recipe_hash) return;
    let mutation;
    try {
      mutation = preparePieceVisualChange({ preview_id: preview.preview_id,
        expected_preview_revision: preview.preview_revision, visual_selection: selection });
      const choice = mutation.visual_selection, caps = preview.plan_capabilities;
      if (!caps.theme_ids.includes(choice.theme_id) || !caps.aspect_ratios.includes(choice.aspect_ratio) ||
          !caps.branding_modes.includes(choice.branding_mode)) return;
      if (choice.theme_id === preview.visual_recipe.theme.theme_id && choice.aspect_ratio === preview.visual_recipe.aspect_ratio &&
          choice.branding_mode === preview.visual_recipe.branding.branding_mode) return;
    } catch { return; }
    visualRecovery = preview;
    visualUpdated = false;
    await run(beginPiecePreview(state, operation.request, { ...operation, enabled: true }), mutation);
  }

  async function runCancellation() {
    if (active || !cancelIntent) return;
    const intent = cancelIntent, captured = operation;
    // Retain only the body-free cancellation identity, never the old preview.
    state = closePiecePreview();
    visualUpdated = false;
    cancelPhase = 'loading';
    cancelCode = null;
    let abort;
    try { abort = new AbortController(); }
    catch {
      cancelPhase = 'unavailable';
      cancelCode = 'PIECE_TEMPORARILY_UNAVAILABLE';
      notify();
      return;
    }
    const attempt = { abort };
    active = attempt;
    const isCurrent = () => !disposed && enabled && !boundaryCode &&
      active === attempt && cancelIntent === intent && operation === captured;
    notify();
    if (!isCurrent()) return;
    try {
      const result = await requestPiecePreviewCancellation(intent.request, {
        expectedUserId: captured.expectedUserId, signal: abort.signal,
      });
      if (!isCurrent()) return;
      if (result.row_version !== intent.rowVersion + 1) throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
      cancelPhase = 'cancelled';
    } catch (error) {
      if (!isCurrent()) return;
      cancelPhase = 'unavailable';
      cancelCode = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
      if (cancelCode === 'PIECE_AUTH_REQUIRED') {
        operation = null;
        boundaryCode = cancelCode;
        cancelIntent = null;
      }
    }
    active = null;
    notify();
  }

  async function cancelPreview(identity, displayToken) {
    if (disposed || !enabled || !operation || boundaryCode || active || visualRecovery || cancelIntent || saveIntent ||
        !displayToken || displayToken !== state.ticket) return;
    const display = readPiecePreviewDisplay(getView(), clock());
    if (display.phase !== 'received' || !display.hashVerified) return;
    const preview = display.preview;
    if (!identity || identity.preview_id !== preview.preview_id ||
        identity.preview_revision !== preview.preview_revision ||
        identity.visual_recipe_hash !== preview.visual_recipe_hash) return;
    cancelIntent = Object.freeze({ request: Object.freeze({ preview_id: preview.preview_id,
      expected_preview_revision: preview.preview_revision }), rowVersion: preview.row_version });
    await runCancellation();
  }

  // Preparation only: no current product host supplies isSaveAdmitted or
  // saveEnabled. The future renderer owner must bind actual admission/fit to
  // this exact preview/token. Quota, native_checked and version strings alone
  // are not admission. This seam does not promote canSave/canExport.
  async function savePreview(identity, displayToken, idempotencyKey) {
    if (disposed || !enabled || !saveEnabled || !operation || boundaryCode || active ||
        visualRecovery || cancelIntent || saveIntent || !displayToken || displayToken !== state.ticket ||
        typeof idempotencyKey !== 'string' || !/^[\x21-\x7e](?:[\x20-\x7e]*[\x21-\x7e])?$/.test(idempotencyKey)) return;
    const display = readPiecePreviewDisplay(getView(), clock()), captured = operation;
    if (display.phase !== 'received' || !display.hashVerified) return;
    const preview = display.preview;
    if (!identity || identity.preview_id !== preview.preview_id ||
        identity.preview_revision !== preview.preview_revision ||
        identity.visual_recipe_hash !== preview.visual_recipe_hash) return;
    try {
      if (typeof configuration.isSaveAdmitted !== 'function' ||
          configuration.isSaveAdmitted(preview, displayToken) !== true) return;
    } catch { return; }
    // Admission code can synchronously close, revoke, or change the context.
    if (disposed || !enabled || !saveEnabled || operation !== captured || boundaryCode || active ||
        saveIntent || cancelIntent || visualRecovery || state.ticket !== displayToken ||
        readPiecePreviewDisplay(getView(), clock()).phase !== 'received') return;
    saveIntent = Object.freeze({ idempotencyKey, request: Object.freeze({
      preview_id: preview.preview_id, expected_preview_revision: preview.preview_revision,
      piece_text_hash: preview.piece_text_hash, content_payload_hash: preview.content_payload_hash,
      visual_recipe_hash: preview.visual_recipe_hash, visibility_scope: 'private',
    }) });
    await runSave();
  }

  async function runSave() {
    if (active || !saveIntent || !saveEnabled) return;
    const intent = saveIntent, captured = operation;
    // No private body or renderer object is retained by the retry intent.
    state = closePiecePreview();
    visualUpdated = false;
    savePhase = 'loading'; saveCode = null;
    let abort;
    try { abort = new AbortController(); }
    catch {
      savePhase = 'unavailable'; saveCode = 'PIECE_TEMPORARILY_UNAVAILABLE'; notify(); return;
    }
    const attempt = { abort };
    active = attempt;
    const isCurrent = () => !disposed && enabled && saveEnabled && !boundaryCode &&
      active === attempt && saveIntent === intent && operation === captured;
    notify();
    if (!isCurrent()) return;
    try {
      const result = await requestPieceSave(intent.request, { expectedUserId: captured.expectedUserId,
        idempotencyKey: intent.idempotencyKey, signal: abort.signal });
      if (!isCurrent()) return;
      savedReceipt = result;
      savePhase = 'saved';
    } catch (error) {
      if (!isCurrent()) return;
      savePhase = 'unavailable';
      saveCode = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
      if (saveCode === 'PIECE_AUTH_REQUIRED' || saveCode === 'PIECE_FEATURE_DISABLED') {
        boundaryCode = saveCode;
        if (saveCode === 'PIECE_AUTH_REQUIRED') { operation = null; saveIntent = null; }
      }
    }
    active = null;
    notify();
    if (saveCode === 'PIECE_FEATURE_DISABLED' && !disposed && enabled && operation === captured &&
        boundaryCode === 'PIECE_FEATURE_DISABLED' && onFeatureDisabled) {
      try { Promise.resolve(onFeatureDisabled()).catch(() => {}); } catch {}
    }
  }

  // The saved-input host may suspend a body-free cancellation during runtime
  // refresh. It must check the same saved ID/owner/key before resuming. This
  // never restores preview content or begins HTTP; transport reauthenticates.
  function setCancellationEnabled(value) {
    if (disposed || !cancelIntent || !operation || boundaryCode) return false;
    enabled = value === true;
    clearAttempt(true);
    notify();
    return true;
  }

  // Update save permission without discarding a received preview. Preserve an
  // existing save intent across the same saved-input host's
  // runtime/foreground suspension. The host must clear on owner/input/key
  // changes. Neither resuming flags nor a saved receipt grants fresh admission.
  function setSaveAvailability(value = {}) {
    if (disposed || !operation || boundaryCode || cancelIntent) return false;
    const nextEnabled = value?.enabled === true;
    const nextSaveEnabled = nextEnabled && value?.saveEnabled === true;
    if (!saveIntent) {
      // Preview visibility/lifecycle remains owned by setContext/close.
      if (value?.preservePreview !== true || enabled !== nextEnabled) return false;
      saveEnabled = nextSaveEnabled;
      notify();
      return true;
    }
    enabled = nextEnabled;
    saveEnabled = nextSaveEnabled;
    clearAttempt(false, true);
    notify();
    return true;
  }

  function close() {
    if (disposed) return;
    // A conflict/invalid context remains blocked until a valid context update.
    // Retain only the current body-free request/key; drop the received body.
    // Cancellation or save is terminal/uncertain for this original request.
    // Closing drops display data, but cannot restore POST or retry another ID.
    clearAttempt(!!cancelIntent, !!saveIntent);
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

  return Object.freeze({ setContext, getView, start, retry, changeVisual, cancelPreview, savePreview, setCancellationEnabled, setSaveAvailability, close, subscribe, refresh, dispose });
}

