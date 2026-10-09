/** PCE-8 B10 detached React Native host for the existing request controller.
 * Not imported by InputScreen yet. The existing resolved `context` mode is
 * retained. `savedInput` mode explicitly reads the saved ID, then waits for a
 * separate preview action; it requires the existing live runtime predicate.
 * The host only reads body-free request/session identity. No raw input/Emlis
 * body, runtime flag activation, key generation, quota default, save or export.
 */
import React from 'react';
import { AppRuntimeContext } from '../../AppRuntimeContext';
import { AppState, View, Button, Text } from 'react-native';
import { createPieceCreateController } from '../../features/piece/PieceCreateController';
import { PieceApiError, preparePiecePreviewRequest, requestPieceSourceRef } from '../../features/piece/pieceApi';
import { readPiecePreviewDisplay } from '../../features/piece/piecePreviewModel';
import PiecePreviewModal from '../../components/piece/PiecePreviewModal';

const element = React.createElement;
function contextStamp(value) {
  if (value?.enabled !== true) return 'disabled';
  try {
    const snapshot = preparePiecePreviewRequest(value.request, value);
    const ordered = v => Array.isArray(v) ? v.map(ordered) : v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map(k => [k, ordered(v[k])])) : v;
    return JSON.stringify(ordered(snapshot));
  } catch { return 'invalid'; }
}

// This is a body-free host binding, not a new wire DTO or an eligibility
// decision. Do not retain arbitrary parent props, an input body or a token.
function savedInputStamp(props) {
  const value = props.savedInput;
  if (Object.prototype.hasOwnProperty.call(props, 'context') || !value ||
      typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).length !== 3 ||
      !['savedInputId', 'expectedUserId', 'idempotencyKey'].every(key =>
        Object.prototype.hasOwnProperty.call(value, key))) return null;
  const { savedInputId, expectedUserId, idempotencyKey } = value;
  if (typeof savedInputId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(savedInputId) ||
      savedInputId === '00000000-0000-0000-0000-000000000000' ||
      typeof expectedUserId !== 'string' || !expectedUserId.trim() ||
      /[\uD800-\uDFFF]/u.test(expectedUserId) ||
      typeof idempotencyKey !== 'string' ||
      !/^[\x21-\x7e](?:[\x20-\x7e]*[\x21-\x7e])?$/.test(idempotencyKey)) return null;
  return JSON.stringify([savedInputId, expectedUserId, idempotencyKey]);
}

export default class InputPieceActionArea extends React.Component {
  static contextType = AppRuntimeContext;

  constructor(props) {
    super(props);
    this.state = { revision: 0, open: false };
    this.mounted = false;
    this.controller = null;
    this.boundStamp = null;
    this.boundRuntime = null;
    this.savedMode = false;
    this.sourceAttempt = null;
    this.sourcePhase = 'idle';
    this.sourceCode = null;
    this.foreground = false;
    this.expiryTimer = null;
    this.unsubscribe = null;
    this.appSubscription = null;
    this.start = this.start.bind(this);
    this.retry = this.retry.bind(this);
    this.close = this.close.bind(this);
    this.changed = this.changed.bind(this);
    this.resolveSavedInput = this.resolveSavedInput.bind(this);
  }

  componentDidMount() {
    // Create anew on every mount, including development StrictMode remounts.
    this.mounted = true;
    this.foreground = AppState.currentState === 'active';
    this.boundStamp = null;
    this.boundRuntime = null;
    this.clearSource();
    this.controller = createPieceCreateController({ onFeatureDisabled: () => {
      // Props may have changed before componentDidUpdate; an old response must
      // not close or refresh the next account/source's runtime presentation.
      if (!this.isCurrent()) return;
      this.setState({ open: false });
      // Existing runtime refresh clears cached Piece flags synchronously. No
      // new resolver, event bus, auth payload, preview retry or legacy fallback.
      try { return Promise.resolve(this.context?.refreshAppRuntime?.()).catch(() => {}); }
      catch { return undefined; }
    } });
    this.unsubscribe = this.controller.subscribe(this.changed);
    this.appSubscription = AppState.addEventListener('change', next => {
      if (!this.mounted) return;
      this.foreground = next === 'active';
      if (!this.foreground) {
        if (this.savedMode) {
          this.clearSource();
          this.controller.setContext({ enabled: false });
        } else this.controller.close();
        this.setState({ open: false });
      } else this.controller.refresh();
    });
    this.syncContext();
    this.setState({ open: false });
  }

  componentDidUpdate() { this.syncContext(); }

  componentWillUnmount() {
    this.mounted = false;
    this.clearSource();
    clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    this.unsubscribe?.();
    this.appSubscription?.remove();
    this.controller?.dispose();
    this.controller = null;
    this.boundStamp = null;
    this.boundRuntime = null;
  }

  savedEnabled() {
    try {
      return this.context?.runtime != null &&
        this.context?.isFeatureEnabled?.('piece_v2_preview_enabled', false) === true;
    } catch { return false; }
  }

  clearSource() {
    const previous = this.sourceAttempt;
    this.sourceAttempt = null;
    this.sourcePhase = 'idle';
    this.sourceCode = null;
    // Fence identity before aborting: transport cancellation is not authority.
    previous?.abort.abort();
  }

  syncContext() {
    if (!this.mounted || !this.controller) return;
    const savedMode = Object.prototype.hasOwnProperty.call(this.props, 'savedInput');
    const sourceStamp = savedMode ? savedInputStamp(this.props) : null;
    const stamp = savedMode
      ? this.savedEnabled() && sourceStamp !== null ? 'saved:' + sourceStamp : 'saved-disabled'
      : contextStamp(this.props.context);
    const runtime = savedMode ? this.context?.runtime : null;
    if (stamp === this.boundStamp && runtime === this.boundRuntime && savedMode === this.savedMode) return;
    // While the same account/runtime remains current, close only the local
    // preview so the existing controller can reject a changed request with the
    // same key. Disabling here would erase that request/key binding.
    const previous = this.savedMode && this.boundStamp?.startsWith('saved:')
      ? JSON.parse(this.boundStamp.slice(6)) : null;
    const next = sourceStamp !== null ? JSON.parse(sourceStamp) : null;
    const retainBinding = savedMode && this.savedMode && this.savedEnabled() &&
      runtime === this.boundRuntime && previous && next && previous[1] === next[1];
    this.clearSource();
    this.savedMode = savedMode;
    this.boundStamp = stamp;
    this.boundRuntime = runtime;
    // The render boundary hides old data before this lifecycle runs. A source
    // read does not occur on mount, context change, refresh or re-enable.
    if (retainBinding) this.controller.close();
    else this.controller.setContext(savedMode ? { enabled: false } : this.props.context);
    this.setState({ open: false });
  }

  isCurrent() {
    if (!this.mounted || !this.foreground || !this.controller) return false;
    const savedMode = Object.prototype.hasOwnProperty.call(this.props, 'savedInput');
    if (savedMode !== this.savedMode) return false;
    if (!savedMode) return this.props.context?.enabled === true &&
      this.boundStamp === contextStamp(this.props.context);
    const stamp = savedInputStamp(this.props);
    return stamp !== null && this.savedEnabled() &&
      this.boundRuntime === this.context?.runtime && this.boundStamp === 'saved:' + stamp;
  }

  async resolveSavedInput() {
    if (!this.savedMode || !this.isCurrent() || this.sourceAttempt ||
        !(this.sourcePhase === 'idle' || this.sourceCode === 'PIECE_TEMPORARILY_UNAVAILABLE')) return;
    // Capture the exact saved ID, owner and future POST key before any await.
    const [savedInputId, expectedUserId, idempotencyKey] = JSON.parse(this.boundStamp.slice(6));
    let abort;
    try { abort = new AbortController(); }
    catch {
      this.sourcePhase = 'unavailable';
      this.sourceCode = 'PIECE_TEMPORARILY_UNAVAILABLE';
      this.changed();
      return;
    }
    const attempt = { abort };
    this.sourceAttempt = attempt;
    this.sourcePhase = 'loading';
    this.sourceCode = null;
    this.changed();
    if (this.sourceAttempt !== attempt || !this.isCurrent()) return;
    try {
      const source_ref = await requestPieceSourceRef(savedInputId, { expectedUserId, signal: abort.signal });
      if (this.sourceAttempt !== attempt || !this.isCurrent()) return;
      const prepared = preparePiecePreviewRequest({ source_ref, requested_format: null,
        visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } },
      { expectedUserId, idempotencyKey });
      this.sourceAttempt = null;
      this.sourcePhase = 'ready';
      this.sourceCode = null;
      this.controller.setContext({ ...prepared, enabled: true });
      // An equivalent retained controller context deliberately emits nothing.
      // The source-read phase still changed and must publish its own UI update.
      this.changed();
      // Deliberately do not start(). GET and preview remain separate actions.
    } catch (error) {
      if (this.sourceAttempt !== attempt || !this.isCurrent()) return;
      this.sourceAttempt = null;
      this.sourcePhase = 'unavailable';
      this.sourceCode = error instanceof PieceApiError ? error.code : 'PIECE_TEMPORARILY_UNAVAILABLE';
      this.changed();
      if (this.sourceCode === 'PIECE_FEATURE_DISABLED' && this.isCurrent()) {
        this.setState({ open: false });
        try { await this.context?.refreshAppRuntime?.(); }
        catch { /* A failed refresh cannot authorize a source retry. */ }
      }
    }
  }

  changed() {
    if (!this.mounted) return;
    clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    if (this.isCurrent()) {
      const display = readPiecePreviewDisplay(this.controller.getView());
      if (display.expiresAtMs !== null) {
        const delay = Math.min(2147483647, Math.max(0, display.expiresAtMs - Date.now()));
        this.expiryTimer = setTimeout(() => {
          this.expiryTimer = null;
          if (this.mounted && this.foreground) this.controller?.refresh();
        }, delay);
      }
    }
    // Do not store a body-bearing view in React state or event callbacks.
    this.setState(previous => ({ revision: previous.revision + 1 }));
  }

  start() {
    if (!this.isCurrent() || (this.savedMode && this.sourcePhase !== 'ready') ||
        this.controller.getView().phase !== 'idle') return;
    this.setState({ open: true });
    void this.controller.start();
  }

  retry() {
    if (!this.isCurrent() || !this.state.open) return;
    const display = readPiecePreviewDisplay(this.controller.getView());
    if (display.canRetry) void this.controller.retry();
  }

  close() {
    if (!this.mounted) return;
    if (this.sourceAttempt) this.clearSource();
    this.controller?.close();
    this.setState({ open: false });
  }

  render() {
    // A changed account/source/key/selection is concealed in this render,
    // not one effect later. There is no render-time mutation or HTTP call.
    if (!this.isCurrent()) return null;
    if (this.savedMode && this.sourcePhase !== 'ready') {
      const unavailable = this.sourcePhase === 'unavailable';
      const canRead = this.sourcePhase === 'idle' ||
        (unavailable && this.sourceCode === 'PIECE_TEMPORARILY_UNAVAILABLE');
      return element(View, { testID: 'piece-saved-input-source-area' },
        this.sourcePhase === 'loading' ? element(Text, { accessibilityLiveRegion: 'polite' },
          '保存入力を確認しています。') : null,
        unavailable ? element(Text, { accessibilityRole: 'alert' }, new PieceApiError(this.sourceCode).message) : null,
        canRead ? element(Button, { title: '保存入力を確認', onPress: this.resolveSavedInput,
          accessibilityLabel: 'Pieceに使う保存入力を確認' }) : null,
      );
    }
    const display = readPiecePreviewDisplay(this.controller.getView());
    if (display.phase === 'hidden') return null;
    return element(View, { testID: 'piece-input-action-area' },
      display.phase === 'idle' ? element(Button, {
        title: 'この入力をPieceにする', onPress: this.start, accessibilityLabel: 'この入力をPieceにする',
      }) : null,
      display.phase === 'unavailable' && !this.state.open ? element(Text, { accessibilityRole: 'alert' }, display.message) : null,
      element(PiecePreviewModal, { visible: this.state.open, display, onClose: this.close, onRetry: this.retry }),
    );
  }
}
