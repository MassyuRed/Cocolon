/** PCE-8 B10 detached React Native host for the existing request controller.
 * Not imported by InputScreen yet. `context` must come from the future trusted
 * saved/terminal source + effective-flag owner; it is not inferred from text.
 * The host only reads body-free request/session identity. No raw input/Emlis
 * body, runtime flag activation, key generation, quota default, save or export.
 */
import React from 'react';
import { AppRuntimeContext } from '../../AppRuntimeContext';
import { AppState, View, Button, Text } from 'react-native';
import { createPieceCreateController } from '../../features/piece/PieceCreateController';
import { preparePiecePreviewRequest } from '../../features/piece/pieceApi';
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

export default class InputPieceActionArea extends React.Component {
  static contextType = AppRuntimeContext;

  constructor(props) {
    super(props);
    this.state = { revision: 0, open: false };
    this.mounted = false;
    this.controller = null;
    this.boundStamp = null;
    this.foreground = false;
    this.expiryTimer = null;
    this.unsubscribe = null;
    this.appSubscription = null;
    this.start = this.start.bind(this);
    this.retry = this.retry.bind(this);
    this.close = this.close.bind(this);
    this.changed = this.changed.bind(this);
  }

  componentDidMount() {
    // Create anew on every mount, including development StrictMode remounts.
    this.mounted = true;
    this.foreground = AppState.currentState === 'active';
    this.boundStamp = null;
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
        this.controller.close();
        this.setState({ open: false });
      } else this.controller.refresh();
    });
    this.syncContext();
    this.setState({ open: false });
  }

  componentDidUpdate() { this.syncContext(); }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.expiryTimer);
    this.expiryTimer = null;
    this.unsubscribe?.();
    this.appSubscription?.remove();
    this.controller?.dispose();
    this.controller = null;
    this.boundStamp = null;
  }

  syncContext() {
    if (!this.mounted || !this.controller) return;
    const stamp = contextStamp(this.props.context);
    if (stamp === this.boundStamp) return;
    this.boundStamp = stamp;
    // The render boundary already hides the old view before this lifecycle runs.
    this.controller.setContext(this.props.context);
    this.setState({ open: false });
  }

  isCurrent() {
    return this.mounted && this.foreground && this.controller &&
      this.props.context?.enabled === true && this.boundStamp === contextStamp(this.props.context);
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
    if (!this.isCurrent() || this.controller.getView().phase !== 'idle') return;
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
    this.controller?.close();
    this.setState({ open: false });
  }

  render() {
    // A changed account/source/key/selection is concealed in this render,
    // not one effect later. There is no render-time mutation or HTTP call.
    if (!this.isCurrent()) return null;
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
