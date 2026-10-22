import React from 'react';
import { Alert, AppState, View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { useAppRuntime } from '../AppRuntimeContext';
import { useTutorial } from '../TutorialContext';
import { createPieceOwnerHistoryController } from '../features/piece/PieceOwnerHistoryController';
import PieceOwnerCard from '../components/piece/PieceOwnerCard';
import PieceVisualCard from '../components/piece/PieceVisualCard';
import PieceExportCanvas from '../components/piece/PieceExportCanvas';

const h = React.createElement;
const flagNames = ['piece_v2_owner_read_enabled', 'piece_v2_visibility_toggle_enabled',
  'piece_v2_public_write_enabled', 'piece_v2_delete_enabled', 'piece_v2_export_enabled'];

export class PieceOwnerHistoryHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { revision: 0 };
    this.mounted = false; this.foreground = false; this.controller = null; this.binding = null;
    this.requestedSavedTarget = null; this.exportAttempt = null; this.exportMessage = null; this.exportSerial = 0;
  }
  savedTarget() {
    const value = this.props.savedPiece;
    if (!value || typeof value !== 'object' || Array.isArray(value) ||
        Object.keys(value).sort().join() !== 'expectedUserId,pieceId' ||
        typeof value.pieceId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value.pieceId) ||
        value.pieceId === '00000000-0000-0000-0000-000000000000' ||
        typeof value.expectedUserId !== 'string' || !value.expectedUserId.trim()) return null;
    return { pieceId: value.pieceId, expectedUserId: value.expectedUserId };
  }
  targetKey() {
    return this.props.savedPiece == null ? null : JSON.stringify(this.savedTarget() || 'invalid');
  }
  stamp() {
    return JSON.stringify([this.props.owner, this.props.enabled, this.props.flags, this.targetKey()]);
  }
  current() {
    return this.mounted && this.foreground && this.props.enabled === true &&
      !!this.props.owner && this.binding === this.stamp() &&
      (this.props.savedPiece == null || this.savedTarget()?.expectedUserId === this.props.owner);
  }
  componentDidMount() {
    this.mounted = true; this.foreground = AppState.currentState === 'active';
    this.controller = createPieceOwnerHistoryController({ onFeatureDisabled: () => {
      if (this.current()) return this.props.refreshRuntime?.();
    } });
    this.unsubscribe = this.controller.subscribe(() => {
      this.syncExportContext();
      if (this.mounted) this.setState(s => ({ revision: s.revision + 1 }));
    });
    this.appSubscription = AppState.addEventListener('change', state => {
      this.foreground = state === 'active'; this.binding = null; this.cancelExport(); this.sync();
    });
    this.sync();
  }
  componentDidUpdate() { this.sync(); }
  componentWillUnmount() {
    this.mounted = false; this.cancelExport(); this.unsubscribe?.(); this.appSubscription?.remove(); this.controller?.dispose();
  }
  sync() {
    if (!this.mounted) return;
    this.syncExportContext();
    const next = this.stamp();
    if (next === this.binding) return;
    this.binding = next;
    const target = this.savedTarget(), targetKey = this.targetKey();
    if (targetKey === null) this.requestedSavedTarget = null;
    // A target-only route change must also hide/abort the previous record.
    this.controller.close();
    this.controller.setContext({ enabled: this.current(), expectedUserId: this.props.owner,
      flags: this.props.flags, savedPieceId: target?.pieceId });
    // The navigation tap requests this read once. Background/flag refresh drops
    // the body; coming back offers an explicit same-ID read, not an auto retry.
    if (target && this.current() && this.controller.getView().phase !== 'hidden' &&
        this.requestedSavedTarget !== targetKey) {
      this.requestedSavedTarget = targetKey;
      void this.controller.openDetail(target.pieceId);
    }
    this.setState(s => ({ revision: s.revision + 1 }));
  }
  openSavedDetail(targetKey, pieceId) {
    if (this.current() && targetKey === this.targetKey() && pieceId === this.savedTarget()?.pieceId) {
      return this.act('openDetail', pieceId);
    }
  }
  act(action, ...args) { if (this.current()) return this.controller[action](...args); }
  exportCurrent(attempt) {
    const view = this.controller?.getView();
    return !!attempt && this.exportAttempt === attempt && this.current() &&
      this.props.flags?.piece_v2_export_enabled === true && view?.phase === 'detail' &&
      view.record === attempt.displayed && this.stamp() === attempt.stamp;
  }
  cancelExport() {
    const old = this.exportAttempt; this.exportAttempt = null; this.exportMessage = null;
    if (old) { old.abort.abort(); void old.asset?.dispose().catch(() => {}); }
  }
  syncExportContext() {
    if (this.exportAttempt && !this.exportCurrent(this.exportAttempt)) this.cancelExport();
    if(this.exportMessage && (!this.current() || this.controller?.getView().record!==this.exportMessage.displayed ||
        this.stamp()!==this.exportMessage.stamp))this.exportMessage=null;
  }
  async prepareExport(record) {
    if (!this.current() || this.props.flags?.piece_v2_export_enabled !== true ||
        this.controller?.getView().phase !== 'detail' || this.controller.getView().record !== record ||
        this.exportAttempt?.busy) return;
    this.cancelExport();
    const attempt = { displayed: record, stamp: this.stamp(), abort: new AbortController(), serial: ++this.exportSerial, busy: true };
    this.exportAttempt = attempt;
    this.setState(s => ({ revision: s.revision + 1 }));
    try {
      const { preparePieceExportPrototype } = require('../features/piece/pieceExport');
      const job = await preparePieceExportPrototype({ pieceId: record.piece_id, expectedUserId: this.props.owner,
        signal: attempt.abort.signal, isCurrent: () => this.exportCurrent(attempt) });
      if (!this.exportCurrent(attempt)) return;
      const identity = value => JSON.stringify([value.piece_id, value.row_version, value.piece_text_hash,
        value.content_payload_hash, value.visual_recipe_hash, value.renderer_version]);
      if (identity(job.record) !== identity(record)) throw new Error('PIECE_TEMPORARILY_UNAVAILABLE');
      attempt.job = job; attempt.busy = false;
      attempt.onTarget = (target, previous) => {
        if (!this.exportCurrent(attempt)) return;
        if (target) attempt.target = target;
        else if (!previous || attempt.target === previous) attempt.target = null;
        this.setState(s => ({ revision: s.revision + 1 }));
      };
      attempt.onUnavailable = () => {
        if (this.exportCurrent(attempt)) {
          this.cancelExport(); this.exportMessage = {text:'画像を準備できませんでした。もう一度お試しください。',displayed:attempt.displayed,stamp:attempt.stamp};
          this.setState(s => ({ revision: s.revision + 1 }));
        }
      };
      this.setState(s => ({ revision: s.revision + 1 }));
    } catch {
      if (this.exportCurrent(attempt)) {
        this.cancelExport(); this.exportMessage = {text:'画像を準備できませんでした。もう一度お試しください。',displayed:attempt.displayed,stamp:attempt.stamp};
        this.setState(s => ({ revision: s.revision + 1 }));
      }
    }
  }
  async exportImage(attempt, action) {
    if (!this.exportCurrent(attempt) || attempt.busy || !attempt.job ||
        !['saveToPhotos', 'openShare'].includes(action) || !attempt.target?.isCurrent()) return;
    attempt.busy = true; this.setState(s => ({ revision: s.revision + 1 }));
    try {
      attempt.asset = await attempt.job.capture(attempt.target);
      if (!this.exportCurrent(attempt)) { await attempt.asset.dispose(); return; }
      const result = await attempt.asset[action]();
      if (this.exportCurrent(attempt)) {
        this.cancelExport();
        this.exportMessage = {displayed:attempt.displayed,stamp:attempt.stamp,text:result.outcome === 'saved_to_photos' ? '写真に保存しました。'
          : result.outcome === 'cancelled' ? '共有をキャンセルしました。' : '共有画面を閉じました。'};
        this.setState(s => ({ revision: s.revision + 1 }));
      }
    } catch {
      if (this.exportCurrent(attempt)) {
        this.cancelExport(); this.exportMessage = {text:'画像を保存・共有できませんでした。権限や接続を確認して、もう一度お試しください。',displayed:attempt.displayed,stamp:attempt.stamp};
        this.setState(s => ({ revision: s.revision + 1 }));
      }
    }
  }
  confirmVisibility(record) {
    const scope = record.visibility_scope === 'public' ? 'private' : 'public';
    Alert.alert(scope === 'public' ? 'Pieceを公開しますか？' : 'Pieceを非公開にしますか？',
      scope === 'public' ? 'このPieceが公開範囲の利用者に表示されます。' : 'Cocolonでは自分だけが見られます。すでに外部に保存・共有された画像は回収できません。',
      [{ text: 'キャンセル', style: 'cancel' }, { text: scope === 'public' ? '公開する' : '非公開にする', onPress: () => {
        if (this.current() && this.controller.getView().record === record) this.act('setVisibility', scope);
      } }]);
  }
  confirmDelete(record) {
    Alert.alert('Pieceを削除しますか？',
      'Cocolon内のこのPieceを削除します。すでに端末へ保存・外部共有された画像は回収できません。削除しても保存回数は戻りません。',
      [{ text: 'キャンセル', style: 'cancel' }, { text: '削除する', style: 'destructive',
        onPress: () => this.act('deleteConfirmed', record) }]);
  }
  render() {
    const view = this.current() ? this.controller.getView() : null;
    const available = view && view.phase !== 'hidden';
    const record = available ? view.record : null;
    const target = this.savedTarget(), targetKey = this.targetKey();
    const attempt = this.exportCurrent(this.exportAttempt) ? this.exportAttempt : null;
    const exporting = !!attempt?.busy, exportReady = !!attempt?.target?.isCurrent();
    const exportMessage=this.current()&&record===this.exportMessage?.displayed&&this.stamp()===this.exportMessage?.stamp
      ? this.exportMessage.text : null;
    return h(SafeAreaView, { style: { flex: 1, backgroundColor: '#FFFFFF' } },
      h(View, { style: { flex: 1, padding: 20 } },
        h(Text, { accessibilityRole: 'header', style: { color: '#202020', fontSize: 22, marginBottom: 12 } }, '自分のPiece'),
        h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 20 } },
          !available ? h(Text, { accessibilityRole: 'alert', style: { color: '#202020', fontSize: 16 } }, '現在、自分のPieceを確認できません。') : null,
          available && view.message ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16, marginBottom: 12 } }, view.message) : null,
          available && view.phase === 'loading' ? h(ActivityIndicator, { accessibilityLabel: 'Pieceを確認中' }) : null,
          available && view.phase === 'history' && view.items.length === 0 ? h(Text, { style: { color: '#202020', fontSize: 16 } }, '保存済みのPieceはありません。') : null,
          ...(available ? view.items.map(item => h(PieceOwnerCard, { key: item.piece_id, record: item, onOpen: () => this.act('openDetail', item.piece_id) })) : []),
          record ? h(PieceVisualCard, { savedRecord: record }) : null,
          record ? h(PieceOwnerCard, { record }) : null,
          record && this.props.flags?.piece_v2_export_enabled === true ? h(Button, {
            title: attempt ? '画像を準備し直す' : '画像の保存・共有を準備', disabled: exporting,
            onPress: () => this.prepareExport(record) }) : null,
          attempt?.job ? h(View, { pointerEvents: 'none', accessible: false,
            accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants',
            style: { position: 'absolute', left: -10000, top: 0, width: 1080 } },
            h(PieceExportCanvas, { key: attempt.serial, savedRecord: attempt.job.record, onCaptureTargetChange: attempt.onTarget, onCaptureUnavailable: attempt.onUnavailable })) : null,
          attempt?.job ? h(Button, { title: '写真に保存', disabled: exporting || !exportReady,
            onPress: () => this.exportImage(attempt, 'saveToPhotos') }) : null,
          attempt?.job ? h(Button, { title: '画像を共有', disabled: exporting || !exportReady,
            onPress: () => this.exportImage(attempt, 'openShare') }) : null,
          exportMessage ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16 } }, exportMessage) : null,
          record && view.permissions.visibility && (record.visibility_scope === 'public' || view.permissions.publish)
            ? h(Button, { title: record.visibility_scope === 'public' ? '非公開にする' : '公開する', onPress: () => this.confirmVisibility(record) }) : null,
          record && view.permissions.delete ? h(Button, { title: 'このPieceを削除', onPress: () => this.confirmDelete(record) }) : null,
          available && view.canRetryDelete ? h(Button, { title: '同じ削除要求で結果を確認', onPress: () => this.act('retryDelete') }) : null,
          available && target && (view.phase === 'idle' ||
            view.phase === 'unavailable' && view.code === 'PIECE_TEMPORARILY_UNAVAILABLE') ? h(Button, {
            title: '保存したPieceを読み込む', onPress: () => this.openSavedDetail(targetKey, target.pieceId) }) : null,
          available && view.phase !== 'loading' ? h(Button, { title: record ? '履歴に戻る' : target ? '履歴を読み込む' : '保存済みPieceを読み込む', onPress: () => this.act('loadHistory') }) : null,
          available && view.phase === 'history' && view.nextCursor ? h(Button, { title: '続きを読み込む', onPress: () => this.act('loadMore') }) : null,
          h(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22, marginTop: 16 } }, this.props.flags?.piece_v2_export_enabled === true ? '保存済み本文と画像レイアウトを確認できます。' : '保存済み本文を確認できます。詳細では、対応する画像レイアウトも確認できます。画像の保存・共有は、まだ利用できません。'),
        ),
        h(Button, { title: '戻る', onPress: () => { this.controller?.close();
          this.props.navigation?.setParams?.({ savedPiece: null }); this.props.navigation?.goBack?.(); } }),
      ),
    );
  }
}

export default function PieceOwnerHistoryScreen({ navigation, route }) {
  const { session } = useAuth();
  const runtime = useAppRuntime();
  const { isTutorialMode } = useTutorial();
  const focused = useIsFocused();
  const flags = Object.fromEntries(flagNames.map(name => [name, runtime.isFeatureEnabled(name, false) === true]));
  return h(PieceOwnerHistoryHost, { navigation, savedPiece: route?.params?.savedPiece, owner: session?.user?.id || '', flags,
    enabled: focused && !isTutorialMode && flags.piece_v2_owner_read_enabled,
    refreshRuntime: runtime.refreshAppRuntime });
}
