/** B11 owner-only lifecycle. No body/cache persistence, source or public feed. */
import { PieceApiError, isPieceHistoryRecordOlder, requestPieceOwner } from './pieceApi';
import { readPieceOwnerDisplay, pieceOwnerPermissions } from './pieceOwnerModel';

export function createPieceOwnerHistoryController(configuration = {}) {
  const listeners = new Set();
  const empty = () => ({ phase: 'idle', items: [], record: null, nextCursor: null, message: '', code: null });
  let state = empty(), context = null, active = null, deletion = null, disposed = false, blocked = false;
  const deleteUncertainMessage = '削除の結果を確認できませんでした。同じ削除要求で結果を確認できます。';
  const permissions = () => pieceOwnerPermissions(context?.flags);
  const emit = () => { for (const fn of [...listeners]) { try { fn(); } catch {} } };
  const enabled = () => !disposed && !blocked && context?.enabled === true && permissions().read;
  function clear(keepDeletion = false) {
    const previous = active;
    active = null;
    deletion = keepDeletion && deletion ? { ...deletion, token: Object.freeze({}) } : null;
    state = empty();
    previous?.abort.abort();
    if (deletion) state = { ...empty(), phase: 'unavailable',
      code: 'PIECE_TEMPORARILY_UNAVAILABLE', message: deleteUncertainMessage };
  }
  function setContext(next) {
    const snapshot = { enabled: next?.enabled === true && typeof next?.expectedUserId === 'string' && !!next.expectedUserId,
      expectedUserId: next?.expectedUserId, savedPieceId: typeof next?.savedPieceId === 'string' ? next.savedPieceId : null,
      exportEnabled: next?.flags?.piece_v2_export_enabled === true,
      suspended: next?.suspended === true, flags: pieceOwnerPermissions(next?.flags) };
    // Compare effective permissions, not mutable caller-owned objects.
    const stamp = JSON.stringify(snapshot);
    if (context?.stamp === stamp) return;
    // Preserve only the body-free idempotency identity across a temporary
    // lifecycle/runtime pause. A settled permission or owner/route change
    // discards it; the stored request never includes a record body.
    const keepDeletion = !!deletion && context?.expectedUserId === snapshot.expectedUserId &&
      context?.savedPieceId === snapshot.savedPieceId && (snapshot.flags.delete || snapshot.suspended);
    blocked = false;
    context = { stamp, enabled: snapshot.enabled, expectedUserId: snapshot.expectedUserId,
      savedPieceId: snapshot.savedPieceId,
      flags: { piece_v2_owner_read_enabled: snapshot.flags.read,
        piece_v2_visibility_toggle_enabled: snapshot.flags.visibility,
        piece_v2_public_write_enabled: snapshot.flags.publish, piece_v2_delete_enabled: snapshot.flags.delete } };
    clear(keepDeletion);
    emit();
  }
  const current = ticket => enabled() && active === ticket && context === ticket.context;
  function getView() {
    if (!enabled()) return Object.freeze({ ...empty(), phase: 'hidden', permissions: pieceOwnerPermissions(), canRetryDelete: false, canRetryDetail: false });
    const canRetryDelete = !active && !!deletion && state.code === 'PIECE_TEMPORARILY_UNAVAILABLE' && permissions().delete;
    const canRetryDetail = !active && !deletion && !!state.detailRetry && state.code === 'PIECE_TEMPORARILY_UNAVAILABLE';
    const { detailRetry, ...display } = state;
    return Object.freeze({ ...display, items: Object.freeze([...state.items]), permissions: permissions(),
      canRetryDelete, deleteRetryToken: canRetryDelete ? deletion.token : null,
      canRetryDetail, detailRetryToken: canRetryDetail ? detailRetry.token : null });
  }
  function newDeleteKey() {
    const bytes = new Uint8Array(24);
    globalThis.crypto.getRandomValues(bytes);
    return 'piece-delete-' + Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
  }
  async function run(action, value, key = null, notice = '') {
    if (!enabled() || active) return;
    let abort;
    try { abort = new AbortController(); } catch { return; }
    const ticket = { abort, context };
    active = ticket;
    const previousPage = action === 'history' && value.cursor !== null ? state : null;
    // Hide stale data while reading/mutating; never display a write as done
    // until the closed server acknowledgement has passed validation.
    state = { ...empty(), phase: 'loading' }; emit();
    if (!current(ticket)) return;
    try {
      const result = await requestPieceOwner(action, value, { expectedUserId: context.expectedUserId,
        idempotencyKey: key, signal: abort.signal });
      if (!current(ticket)) return;
      if (action === 'history') {
        const incoming = result.items.map(readPieceOwnerDisplay);
        const priorItems = previousPage?.items;
        if (priorItems && incoming.length &&
            !isPieceHistoryRecordOlder(incoming[0], priorItems[priorItems.length - 1])) {
          throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
        }
        const items = priorItems ? [...priorItems, ...incoming] : incoming;
        if (new Set(items.map(item => item.piece_id)).size !== items.length) throw new PieceApiError('PIECE_TEMPORARILY_UNAVAILABLE');
        state = { ...empty(), phase: 'history', items, nextCursor: result.next_cursor };
      } else if (action === 'detail') {
        state = { ...empty(), phase: 'detail', record: readPieceOwnerDisplay(result), message: notice };
      } else if (action === 'delete') {
        deletion = null;
        state = { ...empty(), phase: 'idle', deletedPieceId: result.piece_id,
          message: 'Pieceを削除しました。保存回数は戻りません。' };
      } else {
        // Fetch the current saved record after visibility acknowledgement.
        active = null;
        await run('detail', { piece_id: value.piece_id }, null, '公開範囲を変更しました。');
        return;
      }
    } catch (error) {
      if (!current(ticket)) return;
      const code = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
      if (previousPage && error instanceof PieceApiError && error.ownerHistoryTransportUncertain === true) {
        state = { ...previousPage, message: '続きを読み込めませんでした。もう一度お試しください。' };
        active = null; emit(); return;
      }
      state = { ...empty(), phase: 'unavailable', code, message: new PieceApiError(code).message };
      if (action === 'detail' && code === 'PIECE_TEMPORARILY_UNAVAILABLE') {
        // A failed GET drops the old body, but keeps only this already-selected
        // target and its known acknowledgement for an explicit fresh read.
        state.detailRetry = { pieceId: value.piece_id, notice, token: Object.freeze({}) };
      }
      if (code === 'PIECE_TEMPORARILY_UNAVAILABLE') state.message = action === 'delete'
        ? deleteUncertainMessage
        : action === 'visibility'
          ? '公開範囲の変更結果を確認できませんでした。履歴を読み直して確認してください。'
          : 'Pieceを読み込めませんでした。もう一度読み込んでください。';
      if (code !== 'PIECE_TEMPORARILY_UNAVAILABLE') deletion = null;
      if (code === 'PIECE_CONFLICT' && (action === 'visibility' || action === 'delete')) {
        active = null;
        await run('detail', { piece_id: value.piece_id }, null, '状態が変わっていたため、最新のPieceを取得しました。内容を確認してから操作してください。');
        return;
      }
      if (code === 'PIECE_FEATURE_DISABLED' || code === 'PIECE_AUTH_REQUIRED') {
        blocked = true; deletion = null;
        if (code === 'PIECE_FEATURE_DISABLED') {
          try { Promise.resolve(configuration.onFeatureDisabled?.()).catch(() => {}); } catch {}
        }
      }
    }
    if (active === ticket) { active = null; emit(); }
  }
  function loadHistory() {
    if (!enabled() || active || deletion) return;
    return run('history', { cursor: null });
  }
  function loadMore(cursor = state.nextCursor) {
    if (state.phase === 'history' && cursor && cursor === state.nextCursor) return run('history', { cursor });
  }
  function openDetail(id) {
    if (!enabled() || active || deletion) return;
    // A saved-entry target is independently owner-authenticated by detail GET;
    // it does not require fetching every history page to locate the new record.
    if (id !== context?.savedPieceId && id !== state.record?.piece_id &&
        !state.items.some(item => item.piece_id === id)) return;
    return run('detail', { piece_id: id });
  }
  function setVisibility(scope) {
    const record = state.record;
    if (state.phase !== 'detail' || !record || !permissions().visibility ||
        !['private', 'public'].includes(scope) || scope === record.visibility_scope ||
        scope === 'public' && !permissions().publish) return;
    return run('visibility', { piece_id: record.piece_id, expected_row_version: record.row_version, visibility_scope: scope });
  }
  function retryDetail(token) {
    if (!getView().canRetryDetail || token !== state.detailRetry.token) return;
    const { pieceId, notice } = state.detailRetry;
    return run('detail', { piece_id: pieceId }, null, notice);
  }
  // The UI must pass the exact record the user confirmed, not a later record.
  function deleteConfirmed(record) {
    if (!enabled() || active || state.phase !== 'detail' || record !== state.record || !permissions().delete) return;
    try {
      deletion = { value: { piece_id: record.piece_id, expected_row_version: record.row_version },
        key: newDeleteKey(), token: Object.freeze({}) };
    } catch {
      state = { ...empty(), phase: 'unavailable', message: '削除を開始できませんでした。履歴からもう一度確認してください。' }; emit(); return;
    }
    return run('delete', deletion.value, deletion.key);
  }
  function retryDelete(token = deletion?.token) {
    if (getView().canRetryDelete && token === deletion.token) return run('delete', deletion.value, deletion.key);
  }
  function close() { clear(); emit(); }
  function dispose() { disposed = true; clear(); listeners.clear(); context = null; }
  return Object.freeze({ setContext, getView, loadHistory, loadMore, openDetail, retryDetail, setVisibility,
    deleteConfirmed, retryDelete, close, dispose,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); } });
}
