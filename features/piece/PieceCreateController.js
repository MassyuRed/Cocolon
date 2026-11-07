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
 *   A definitive original-POST rejection keeps only its body-free refusal and
 *   permits explicit source recheck instead of replaying that rejected request.
 *   An explicit cancelPreview keeps a body-free terminal/unknown cancellation
 *   across close and can only retry the same DELETE, never the original POST.
 * - The existing input host supplies strict saveEnabled, the admitted iOS
 *   renderer's isSaveAdmitted predicate and an explicit save key.
 *   close retains only the save intent/receipt; retry never returns to preview
 *   POST. Revoking saveEnabled alone keeps the intent but stops requests.
 *   General disable, changed context or dispose clears it. The input host
 *   handles same-selection runtime/foreground suspension via setSaveAvailability.
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
  // The host binding stays fixed while explicit draft replacements change
  // the active request/key within that same owner and saved source.
  let contextOperation = null;
  let operation = null;
  let enabled = false;
  let boundaryCode = null;
  let active = null;
  let disposed = false;
  let visualRecovery = null;
  let visualUpdated = false;
  let lastDisplaySettings = null;
  let formatIntent = null;
  let formatNotice = null;
  let cancelIntent = null;
  let cancelPhase = null;
  let cancelCode = null;
  let saveEnabled = false;
  let saveIntent = null;
  let saveRecoveryEntry = null;
  let savePhase = null;
  let saveCode = null;
  let savedReceipt = null;
  const recoverable = ['PIECE_TEMPORARILY_UNAVAILABLE', 'PIECE_PREVIEW_STALE',
    'PIECE_CONFLICT', 'PIECE_FORMAT_NOT_ELIGIBLE', 'PIECE_VISUAL_SELECTION_NOT_ALLOWED'];
  const sourceRefreshCodes = ['PIECE_CONFLICT', 'PIECE_FORMAT_NOT_ELIGIBLE',
    'PIECE_VISUAL_SELECTION_NOT_ALLOWED'];
  const retryableSave = code => code === 'PIECE_TEMPORARILY_UNAVAILABLE' || code === 'PIECE_QUOTA_EXHAUSTED';

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

  function clearAttempt(keepCancellation = false, keepSave = false, keepPreviewRequest = false) {
    const previous = active;
    active = null;
    visualRecovery = null;
    visualUpdated = false;
    if (!keepPreviewRequest) lastDisplaySettings = null;
    formatIntent = keepPreviewRequest && formatIntent ? { ...formatIntent, previous: null } : null;
    formatNotice = null;
    if (!keepSave) {
      saveIntent = null;
      saveRecoveryEntry = null;
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
    const saveBlocked = savePhase === 'unavailable' && saveRecoveryEntry &&
      !canResumeSharedSave(saveEnabled);
    const visibleBoundary = boundaryCode || (saveBlocked ? 'PIECE_FEATURE_DISABLED' : null);
    if (!disposed && enabled && visibleBoundary) {
      return Object.freeze({ ...view, phase: 'unavailable', preview: null,
        ...(saveIntent ? { loadingKind: 'save', retryKind: 'save' } : {}),
        message: new PieceApiError(visibleBoundary).message, canRetry: false });
    }
    if (!disposed && enabled && saveIntent) {
      return Object.freeze({ ...view, phase: savePhase, preview: null,
        loadingKind: 'save', retryKind: 'save', savedReceipt,
        saveQuotaRejected: savePhase === 'unavailable' && saveCode === 'PIECE_QUOTA_EXHAUSTED',
        canRetry: saveEnabled && savePhase === 'unavailable' && retryableSave(saveCode) &&
          canResumeSharedSave(saveEnabled),
        message: savePhase === 'saved' ? 'Pieceを保存しました。' :
          saveCode === 'PIECE_TEMPORARILY_UNAVAILABLE'
            ? '保存結果を確認できませんでした。同じ保存要求で結果を確認できます。'
            : saveCode === 'PIECE_QUOTA_EXHAUSTED'
              ? '今月のPiece保存回数の上限に達したため、このPieceは保存されていません。保存枠が変わった後に、同じ保存要求で再試行できます。'
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
    const fallback = view.phase === 'unavailable' && state.code === 'PIECE_TEMPORARILY_UNAVAILABLE'
      ? previousFormatDisplay() : null;
    const expired = view.phase === 'unavailable' &&
      expirePiecePreview(state, clock()).code === 'PIECE_PREVIEW_EXPIRED';
    return Object.freeze({ ...view, visualUpdated: visualUpdated && view.phase === 'received',
      ...(expired && contextOperation ? { previewRestartToken: state.ticket } : {}),
      ...(view.phase === 'unavailable' && sourceRefreshCodes.includes(state.code) &&
        !active && !visualRecovery && contextOperation
        ? { sourceRefreshToken: state.ticket, sourceRefreshCode: state.code } : {}),
      ...(fallback?.phase === 'received' ? { formatRecoveryToken: state.ticket,
        formatRecoveryExpiresAtMs: fallback.expiresAtMs } : {}),
      visualToken: view.phase === 'received' ? state.ticket : null,
      formatNotice: view.phase === 'received' ? formatNotice : null,
      loadingKind: view.phase === 'loading' && formatIntent ? 'format' :
        visualRecovery && view.phase === 'loading' ? active?.mutation ? 'visual' : 'recover' : 'preview' });
  }

  function setContext(value = {}) {
    if (disposed) return;
    const nextSaveEnabled = value?.enabled === true && value?.saveEnabled === true;
    const saveFlagChanged = saveEnabled !== nextSaveEnabled;
    saveEnabled = nextSaveEnabled;
    if (value?.enabled !== true) {
      enabled = false;
      contextOperation = null;
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
      contextOperation = null;
      operation = null;
      boundaryCode = error instanceof PieceApiError ? error.code : 'PIECE_REQUEST_INVALID';
      clearAttempt();
      notify();
      return;
    }
    if ([contextOperation, operation].some(prior => prior?.expectedUserId === next.expectedUserId &&
        prior.idempotencyKey === next.idempotencyKey && !equivalent(prior.request, next.request))) {
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
    if (enabled && (!boundaryCode || boundaryCode === 'PIECE_FEATURE_DISABLED') && equivalent(contextOperation, next)) {
      // This branch keeps the current binding. All other branches establish
      // their new context before aborting: a synchronous abort observer may
      // select another owner/source or disable the host, which must not be
      // overwritten by this older setContext call when the observer returns.
      if (saveFlagChanged && !saveEnabled && saveIntent) clearAttempt(false, true, true);
      if (saveFlagChanged) notify();
      return;
    }
    enabled = true;
    contextOperation = next;
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

  function selectedVisual(recipe) {
    return { theme_id: recipe.theme.theme_id, aspect_ratio: recipe.aspect_ratio,
      branding_mode: recipe.branding.branding_mode };
  }

  function rememberDisplaySettings() {
    if (state.phase !== 'received') return;
    try {
      verifyPieceArtifactHashes(state.preview);
      lastDisplaySettings = { operation, selection: selectedVisual(state.preview.visual_recipe) };
    } catch { lastDisplaySettings = null; }
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
      if (formatIntent) {
        const recipe = result.visual_recipe;
        const selection = captured.request.visual_selection;
        if (result.preview_id === formatIntent.previousId || result.preview_revision !== 1 ||
            result.row_version !== 1 || result.renderer_version !== formatIntent.renderer ||
            result.quota.subscription_tier !== 'premium' || result.format_type !== captured.request.requested_format ||
            recipe.theme.theme_id !== selection.theme_id || recipe.aspect_ratio !== selection.aspect_ratio ||
            recipe.branding.branding_mode !== selection.branding_mode) {
          throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
        }
        try { verifyPieceArtifactHashes(result); }
        catch { throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE'); }
      }
      state = completePiecePreview(state, attempt.ticket, result, {
        expectedUserId: operation?.expectedUserId, nowMs: clock(),
      });
      rememberDisplaySettings();
      if (state.phase === 'received' && formatIntent) {
        formatIntent = null;
        formatNotice = '文章の形式を変更しました。';
      }
      if (state.phase === 'received' && visualRecovery) {
        visualUpdated = state.preview.preview_revision > visualRecovery.preview_revision;
        visualRecovery = null;
      }
    } catch (error) {
      if (!current(attempt)) return;
      state = failPiecePreview(state, attempt.ticket, error, { expectedUserId: operation?.expectedUserId });
    }
    expirePreviousFormat();
    if (state.code === 'PIECE_FORMAT_NOT_ELIGIBLE') {
      restorePreviousFormat(new PieceApiError('PIECE_FORMAT_NOT_ELIGIBLE').message);
    }
    if (formatIntent && state.code !== 'PIECE_TEMPORARILY_UNAVAILABLE') formatIntent = null;
    // Clear BEFORE notification. A subscriber may start a new intent here;
    // there is deliberately no old finally block that could clear that intent.
    active = null;
    if (state.code === 'PIECE_AUTH_REQUIRED') {
      operation = null;
      boundaryCode = 'PIECE_AUTH_REQUIRED';
    }
    const featureDisabled = state.code === 'PIECE_FEATURE_DISABLED';
    if (featureDisabled) boundaryCode = 'PIECE_FEATURE_DISABLED';
    // A PATCH conflict/unknown result still needs the original POST/key for
    // recovery. If that explicit POST itself reports a definitive source
    // conflict or current plan/visual rejection, use its existing fresh-source
    // action instead of replaying it forever. A format failure that can restore
    // the previous candidate has already done so above. No ambiguous mutation,
    // save or cancellation is released here.
    if (!mutation && sourceRefreshCodes.includes(state.code)) visualRecovery = null;
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
      if (saveEnabled && savePhase === 'unavailable' && retryableSave(saveCode)) await runSave();
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

  async function restartExpired(token, idempotencyKey) {
    if (disposed || !enabled || !operation || !contextOperation || boundaryCode || active || cancelIntent ||
        saveIntent || !token || token !== state.ticket || idempotencyKey === operation.idempotencyKey ||
        idempotencyKey === contextOperation.idempotencyKey) return;
    const expired = expirePiecePreview(state, clock());
    if (expired.code !== 'PIECE_PREVIEW_EXPIRED') return;
    let next;
    try {
      const request = operation.request;
      const visual_selection = lastDisplaySettings?.operation === operation
        ? lastDisplaySettings.selection : request.visual_selection;
      next = preparePiecePreviewRequest({ ...request, visual_selection }, {
        expectedUserId: operation.expectedUserId, idempotencyKey,
      });
    } catch { return; }
    const begun = beginPiecePreview(expired, next.request, { ...next, enabled: true });
    operation = next;
    formatIntent = null;
    formatNotice = null;
    visualRecovery = null;
    visualUpdated = false;
    await run(begun);
  }

  function enterExpired(captured, error) {
    const expired = beginPiecePreview(state, captured.request, { ...captured, enabled: true });
    state = failPiecePreview(expired.state, expired.ticket, error, { expectedUserId: captured.expectedUserId });
  }

  function selectedPreview(identity, displayToken) {
    if (!displayToken || displayToken !== state.ticket) return null;
    const display = readPiecePreviewDisplay(getView(), clock());
    if (display.phase !== 'received' || !display.hashVerified) return null;
    const preview = display.preview;
    if (!identity || identity.preview_id !== preview.preview_id ||
        identity.preview_revision !== preview.preview_revision ||
        identity.visual_recipe_hash !== preview.visual_recipe_hash) return null;
    return preview;
  }

  function previousFormatDisplay() {
    const nowMs = clock();
    return readPiecePreviewDisplay(readPiecePreviewView(formatIntent?.previous, {
      enabled: !!formatIntent?.previous, expectedUserId: operation?.expectedUserId, nowMs,
    }), nowMs);
  }

  function expirePreviousFormat() {
    if (formatIntent?.previous && expirePiecePreview(formatIntent.previous, clock()).phase !== 'received') {
      formatIntent.previous = null;
    }
  }

  function restorePreviousFormat(notice) {
    expirePreviousFormat();
    if (previousFormatDisplay().phase !== 'received') return false;
    const previous = formatIntent.previous;
    const restored = beginPiecePreview(state, previous.operation.request, { ...previous.operation, enabled: true });
    const restoredState = completePiecePreview(restored.state, restored.ticket, previous.preview, {
      expectedUserId: previous.operation.expectedUserId, nowMs: clock(),
    });
    if (restoredState.phase !== 'received') return false;
    operation = previous.operation;
    state = restoredState;
    rememberDisplaySettings();
    formatIntent = null;
    formatNotice = notice;
    return true;
  }

  function returnToFormat(token) {
    if (disposed || !enabled || boundaryCode || active || !token || token !== state.ticket ||
        state.phase !== 'unavailable' || state.code !== 'PIECE_TEMPORARILY_UNAVAILABLE') return;
    if (restorePreviousFormat('前のプレビューに戻りました。')) notify();
  }

  async function changeFormat(format, identity, displayToken, idempotencyKey) {
    if (disposed || !enabled || !operation || boundaryCode || active || visualRecovery || formatIntent ||
        cancelIntent || saveIntent || idempotencyKey === operation.idempotencyKey ||
        idempotencyKey === contextOperation?.idempotencyKey) return;
    const preview = selectedPreview(identity, displayToken);
    if (!preview || preview.quota.subscription_tier !== 'premium' ||
        preview.plan_capabilities.format_selection !== 'eligible_choice' ||
        format === preview.format_type || !preview.eligible_formats.includes(format)) return;
    const recipe = preview.visual_recipe;
    let next;
    try {
      next = preparePiecePreviewRequest({
        source_ref: operation.request.source_ref, requested_format: format,
        visual_selection: selectedVisual(recipe),
      }, { expectedUserId: operation.expectedUserId, idempotencyKey });
    } catch { return; }
    // A format change reauthors the same source into a distinct draft. The
    // previous artifact cannot be saved while the new request is unresolved.
    const begun = beginPiecePreview(state, next.request, { ...next, enabled: true });
    formatIntent = { previousId: preview.preview_id, renderer: preview.renderer_version, previous: state };
    formatNotice = null;
    visualUpdated = false;
    operation = next;
    await run(begun);
  }

  async function changeVisual(selection, identity, visualToken) {
    if (disposed || !enabled || !operation || boundaryCode || active || visualRecovery || cancelIntent || saveIntent) return;
    const preview = selectedPreview(identity, visualToken);
    if (!preview) return;
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
    formatNotice = null;
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
      if (cancelCode === 'PIECE_PREVIEW_EXPIRED') {
        // Cancel replay succeeds before the RPC checks a draft's expiry.
        enterExpired(captured, error);
        cancelIntent = null;
        cancelPhase = null;
        cancelCode = null;
      } else if (cancelCode === 'PIECE_AUTH_REQUIRED') {
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

  // The existing iOS host binds actual renderer admission and mounted fit to
  // this exact preview/token. Quota, native_checked and version strings alone
  // are not admission. This controller does not promote canSave/canExport.
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
    const intent = Object.freeze({ idempotencyKey, request: Object.freeze({
      preview_id: preview.preview_id, expected_preview_revision: preview.preview_revision,
      piece_text_hash: preview.piece_text_hash, content_payload_hash: preview.content_payload_hash,
      visual_recipe_hash: preview.visual_recipe_hash, visibility_scope: 'private',
    }) });
    const store = configuration.getSaveRecovery?.();
    if (store) {
      const entry = Object.freeze({ operation: captured, intent,
        visualSelection: Object.freeze(selectedVisual(preview.visual_recipe)) });
      if (!store.remember(entry)) {
        restoreSaveRecovery({ expectedUserId: captured.expectedUserId,
          savedInputId: captured.request.source_ref.source_input_id,
          idempotencyKey: contextOperation.idempotencyKey, saveEnabled });
        return;
      }
      saveRecoveryEntry = { store, entry };
    }
    saveIntent = intent;
    await runSave();
  }

  function restoreSaveRecovery({ savedInputId, expectedUserId, idempotencyKey, saveEnabled: allowSave }) {
    if (disposed || saveIntent || cancelIntent) return false;
    const store = configuration.getSaveRecovery?.();
    const entry = store?.find(expectedUserId, savedInputId);
    if (!entry) return false;
    const captured = entry.operation;
    const binding = preparePiecePreviewRequest(captured.request, { expectedUserId, idempotencyKey });
    enabled = false;
    contextOperation = null;
    operation = null;
    clearAttempt();
    contextOperation = binding;
    operation = captured;
    enabled = true;
    saveEnabled = allowSave === true;
    lastDisplaySettings = { operation, selection: entry.visualSelection };
    saveRecoveryEntry = { store, entry };
    boundaryCode = canResumeSharedSave(saveEnabled) ? null : 'PIECE_FEATURE_DISABLED';
    saveIntent = entry.intent;
    savePhase = 'unavailable';
    saveCode = boundaryCode || (store.isQuotaExhausted?.(entry) === true
      ? 'PIECE_QUOTA_EXHAUSTED' : 'PIECE_TEMPORARILY_UNAVAILABLE');
    notify();
    return true;
  }

  function forgetSaveRecovery() {
    if (saveRecoveryEntry) saveRecoveryEntry.store.forget(saveRecoveryEntry.entry);
    saveRecoveryEntry = null;
  }

  function canResumeSharedSave(eligible, runtimeRefresh = false) {
    return !saveRecoveryEntry || saveRecoveryEntry.store.canResume(saveRecoveryEntry.entry,
      configuration.getRuntimePublication?.(), eligible, runtimeRefresh);
  }

  async function runSave() {
    if (active || !saveIntent || !saveEnabled) return;
    if (!canResumeSharedSave(saveEnabled)) {
      boundaryCode = 'PIECE_FEATURE_DISABLED';
      savePhase = 'unavailable';
      saveCode = boundaryCode;
      notify();
      return;
    }
    const intent = saveIntent, captured = operation;
    const runtime = configuration.getRuntimePublication?.();
    if (saveRecoveryEntry) saveRecoveryEntry.store.setQuotaExhausted?.(saveRecoveryEntry.entry, false);
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
      forgetSaveRecovery();
      savedReceipt = result;
      savePhase = 'saved';
    } catch (error) {
      if (!isCurrent()) return;
      saveCode = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
      if (saveCode === 'PIECE_FEATURE_DISABLED' && saveRecoveryEntry) {
        saveRecoveryEntry.store.markDisabled(saveRecoveryEntry.entry, runtime);
      }
      if (saveCode === 'PIECE_QUOTA_EXHAUSTED' && saveRecoveryEntry) {
        saveRecoveryEntry.store.setQuotaExhausted?.(saveRecoveryEntry.entry, true);
      }
      if (!['PIECE_TEMPORARILY_UNAVAILABLE', 'PIECE_QUOTA_EXHAUSTED', 'PIECE_FEATURE_DISABLED', 'PIECE_AUTH_REQUIRED'].includes(saveCode)) {
        forgetSaveRecovery();
      }
      if (saveCode === 'PIECE_PREVIEW_EXPIRED') {
        // The save API checks committed same-key replay before expiry. This
        // result releases the save intent and keeps only the create request.
        enterExpired(captured, error);
        saveIntent = null;
        savePhase = null;
        saveCode = null;
      } else {
        savePhase = 'unavailable';
        if (saveCode === 'PIECE_AUTH_REQUIRED' || saveCode === 'PIECE_FEATURE_DISABLED') {
          boundaryCode = saveCode;
          if (saveCode === 'PIECE_AUTH_REQUIRED') { operation = null; saveIntent = null; }
        }
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
    clearAttempt(true, false, true);
    notify();
    return true;
  }

  // Update save permission without discarding a received preview. Preserve an
  // existing save intent across the same saved-input host's
  // runtime/foreground suspension. The host must clear on owner/input/key
  // changes. Neither resuming flags nor a saved receipt grants fresh admission.
  // A server stop may arrive after commit: retain its request/key, but only a
  // fresh runtime publication can reopen explicit same-request confirmation.
  function setSaveAvailability(value = {}) {
    if (disposed || !operation || cancelIntent ||
        boundaryCode && !(saveIntent && boundaryCode === 'PIECE_FEATURE_DISABLED')) return false;
    const nextEnabled = value?.enabled === true;
    const nextSaveEnabled = nextEnabled && value?.saveEnabled === true;
    if (!saveIntent) {
      if (value?.preserveSelectedFormat === true && state.phase === 'unavailable' &&
          sourceRefreshCodes.includes(state.code) && !visualRecovery) {
        // Keep only a definitive original-POST rejection on this same saved
        // input. Closing or suspending cannot turn it into an ordinary replay.
        // PATCH rejection/unknown recovery still owns its original POST below.
        enabled = nextEnabled;
        saveEnabled = nextSaveEnabled;
        state = Object.freeze({ ...state, ticket: Object.freeze({}) });
        notify();
        return true;
      }
      const selectedFormat = value?.preserveSelectedFormat === true && operation.request.requested_format !== null;
      if (selectedFormat) state = expirePiecePreview(state, clock());
      if (state.code === 'PIECE_PREVIEW_EXPIRED' &&
          (enabled !== nextEnabled || value?.runtimeRefresh === true || selectedFormat)) {
        // Preserve only the expired request on the same host binding. A
        // callback from before suspension must not start the replacement.
        enabled = nextEnabled;
        saveEnabled = nextSaveEnabled;
        state = Object.freeze({ ...state, ticket: Object.freeze({}) });
        notify();
        return true;
      }
      if (selectedFormat) {
        // Keep the selected POST/key, never its displayed body. Definitive
        // source/eligibility failures remain terminal; an uncertain PATCH
        // still recovers through that original POST instead of a new source.
        enabled = nextEnabled;
        saveEnabled = nextSaveEnabled;
        if (state.phase === 'unavailable' && state.code !== 'PIECE_TEMPORARILY_UNAVAILABLE' &&
            !(visualRecovery && recoverable.includes(state.code))) {
          state = Object.freeze({ ...state, ticket: Object.freeze({}) });
        } else clearAttempt(false, false, true);
        notify();
        return true;
      }
      // Preview visibility/lifecycle remains owned by setContext/close.
      if (value?.preservePreview !== true || enabled !== nextEnabled) return false;
      saveEnabled = nextSaveEnabled;
      notify();
      return true;
    }
    if (boundaryCode === 'PIECE_FEATURE_DISABLED' && value?.runtimeRefresh === true && nextSaveEnabled &&
        canResumeSharedSave(nextSaveEnabled, true)) {
      boundaryCode = null;
      saveCode = 'PIECE_TEMPORARILY_UNAVAILABLE';
    }
    enabled = nextEnabled;
    saveEnabled = nextSaveEnabled;
    clearAttempt(false, true, true);
    notify();
    return true;
  }

  function close(options = {}) {
    if (disposed) return;
    const rejectedPost = options?.resetSelectedFormat !== true &&
      !active && !saveIntent && !cancelIntent && !visualRecovery &&
      state.phase === 'unavailable' && sourceRefreshCodes.includes(state.code) ? state : null;
    if (options?.resetSelectedFormat === true && !saveIntent && !cancelIntent && contextOperation && operation &&
        operation.request.requested_format !== null) {
      // A different navigation binding abandons that selected-format intent,
      // but keeps the original context/key guard against changed source bytes.
      operation = contextOperation;
      formatIntent = null;
      lastDisplaySettings = null;
    }
    // A conflict/invalid context remains blocked until a valid context update.
    // Retain only the current body-free request/key; drop the received body.
    // Cancellation or save is terminal/uncertain for this original request.
    // Closing drops display data, but cannot restore POST or retry another ID.
    clearAttempt(!!cancelIntent, !!saveIntent, true);
    if (rejectedPost) {
      // The host's closed message is not the owner of this request boundary.
      // Retain its body-free refusal and rotate the local control ticket.
      state = Object.freeze({ ...rejectedPost, preview: null, ticket: Object.freeze({}) });
    }
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
    expirePreviousFormat();
    notify();
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    listeners.clear();
    enabled = false;
    contextOperation = null;
    operation = null;
    boundaryCode = null;
    clearAttempt();
  }

  return Object.freeze({ setContext, getView, start, retry, restartExpired, changeVisual, changeFormat, returnToFormat, cancelPreview, savePreview, restoreSaveRecovery, setCancellationEnabled, setSaveAvailability, close, subscribe, refresh, dispose });
}

