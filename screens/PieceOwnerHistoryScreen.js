import React from 'react';
import { Alert, AppState, View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { useAppRuntime } from '../AppRuntimeContext';
import { useTutorial } from '../TutorialContext';
import { createPieceOwnerHistoryController } from '../features/piece/PieceOwnerHistoryController';
import { supportsPieceSavedImage } from '../features/piece/pieceLayout';
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
    this.requestedSavedTarget = null; this.deletedSavedTarget = null; this.exportAttempt = null; this.exportMessage = null; this.exportSerial = 0;
    this.exportOperation = null;
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
    return JSON.stringify([this.props.owner, this.props.enabled, this.props.flags, this.targetKey(), this.props.runtimePending === true]);
  }
  current() {
    return this.mounted && this.foreground && this.props.enabled === true &&
      this.props.runtimePending !== true &&
      !!this.props.owner && this.binding === this.stamp() &&
      (this.props.savedPiece == null || this.savedTarget()?.expectedUserId === this.props.owner);
  }
  componentDidMount() {
    this.mounted = true; this.foreground = AppState.currentState === 'active';
    this.controller = createPieceOwnerHistoryController({ onFeatureDisabled: () => {
      if (this.current()) return this.props.refreshRuntime?.();
    } });
    this.unsubscribe = this.controller.subscribe(() => {
      const deleted = this.controller.getView().deletedPieceId;
      if (deleted && this.current() && deleted === this.savedTarget()?.pieceId) {
        this.deletedSavedTarget = this.targetKey();
      }
      this.syncExportContext();
      if (this.mounted) this.setState(s => ({ revision: s.revision + 1 }));
    });
    this.appSubscription = AppState.addEventListener('change', state => {
      this.foreground = state === 'active';
      if (!this.foreground && this.exportOperation?.phase === 'running') this.exportOperation.suspended = true;
      this.binding = null; this.cancelExport(); this.sync();
    });
    this.sync();
  }
  componentDidUpdate() { this.sync(); }
  componentWillUnmount() {
    this.mounted = false; this.exportOperation = null; this.cancelExport(); this.unsubscribe?.(); this.appSubscription?.remove(); this.controller?.dispose();
  }
  sync() {
    if (!this.mounted) return;
    this.syncExportContext();
    const next = this.stamp();
    if (next === this.binding) return;
    this.binding = next;
    const target = this.savedTarget(), targetKey = this.targetKey();
    if (targetKey === null) this.requestedSavedTarget = null;
    if (this.deletedSavedTarget !== targetKey) this.deletedSavedTarget = null;
    // A target-only route change must also hide/abort the previous record.
    this.controller.setContext({ enabled: this.current(), expectedUserId: this.props.owner,
      suspended: this.presentationActive() === true &&
        (!this.foreground || AppState.currentState !== 'active' || this.props.runtimePending === true),
      flags: this.props.flags, savedPieceId: target && target.expectedUserId === this.props.owner ? target.pieceId : null });
    // The navigation tap requests this read once. Background/flag refresh drops
    // the body; coming back offers an explicit same-ID read, not an auto retry.
    if (target && this.current() && this.controller.getView().phase !== 'hidden' &&
        this.requestedSavedTarget !== targetKey && this.deletedSavedTarget !== targetKey) {
      this.requestedSavedTarget = targetKey;
      void this.controller.openDetail(target.pieceId);
    }
    this.setState(s => ({ revision: s.revision + 1 }));
  }
  openSavedDetail(targetKey, pieceId) {
    if (this.current() && targetKey === this.targetKey() && targetKey !== this.deletedSavedTarget &&
        pieceId === this.savedTarget()?.pieceId) {
      return this.act('openDetail', pieceId);
    }
  }
  act(action, ...args) {
    if (!this.current()) return;
    if (action === 'openDetail' && this.exportOperation &&
        args[0] !== this.exportOperation.pieceId) this.exportOperation = null;
    return this.controller[action](...args);
  }
  exportIdentity(record) {
    return JSON.stringify([record.piece_id, record.row_version, record.piece_text_hash,
      record.content_payload_hash, record.visual_recipe_hash, record.renderer_version]);
  }
  exportFlags() {
    return JSON.stringify(flagNames.map(name => this.props.flags?.[name] === true));
  }
  presentationActive() {
    return this.props.presentationActive ?? this.props.enabled;
  }
  ownsExportOperation(operation) {
    if (!operation) return false;
    const settled = this.foreground && AppState.currentState === 'active' && this.props.runtimePending !== true;
    const record = this.controller?.getView().record;
    return this.mounted && this.presentationActive() === true && this.props.owner === operation.owner &&
      this.targetKey() === operation.targetKey && (!settled ||
        this.props.enabled === true && this.exportFlags() === operation.flags) &&
      (!record || this.exportIdentity(record) === operation.identity);
  }
  syncExportOperation() {
    if (!this.ownsExportOperation(this.exportOperation)) this.exportOperation = null;
    else if (this.exportOperation?.phase === 'running' &&
        (!this.foreground || this.props.runtimePending === true)) this.exportOperation.suspended = true;
  }
  exportOperationFor(record) {
    const operation = this.exportOperation;
    return this.ownsExportOperation(operation) && record &&
      operation.identity === this.exportIdentity(record) ? operation : null;
  }
  exportOutcomeMessage(outcome, action) {
    if (outcome === 'unconfirmed') return action === 'saveToPhotos'
      ? '写真への保存結果を確認できませんでした。写真アプリで保存済みか確認できます。'
      : '共有結果を確認できませんでした。';
    return outcome === 'saved_to_photos' ? '写真に保存しました。'
      : outcome === 'cancelled' ? '共有をキャンセルしました。' : '共有画面を閉じました。';
  }
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
    this.syncExportOperation();
    if (this.exportAttempt && !this.exportCurrent(this.exportAttempt)) this.cancelExport();
    if(this.exportMessage && (!this.current() || this.controller?.getView().record!==this.exportMessage.displayed ||
        this.stamp()!==this.exportMessage.stamp))this.exportMessage=null;
  }
  rereadExportRecord(record) {
    if (!this.current() || this.controller?.getView().record !== record ||
        this.exportMessage?.displayed !== record || this.exportMessage?.needsReread !== true ||
        this.exportMessage.stamp !== this.stamp()) return;
    return this.act('openDetail', record.piece_id);
  }
  async prepareExport(record) {
    if (!this.current() || this.props.flags?.piece_v2_export_enabled !== true ||
        this.controller?.getView().phase !== 'detail' || this.controller.getView().record !== record ||
        !supportsPieceSavedImage(record.renderer_version) || this.exportAttempt?.busy ||
        (this.exportMessage?.displayed === record && this.exportMessage?.needsReread === true) ||
        this.exportOperationFor(record)?.phase === 'running') return;
    this.exportOperation = null;
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
      if (identity(job.record) !== identity(record)) {
        attempt.needsReread = true;
        throw new Error('PIECE_TEMPORARILY_UNAVAILABLE');
      }
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
        this.cancelExport(); this.exportMessage = {
          text: attempt.needsReread === true
            ? '保存済みのPieceが更新されています。同じPieceを読み直してから画像を準備してください。'
            : '画像を準備できませんでした。もう一度お試しください。',
          needsReread: attempt.needsReread === true, displayed:attempt.displayed,stamp:attempt.stamp};
        this.setState(s => ({ revision: s.revision + 1 }));
      }
    }
  }
  async exportImage(attempt, action) {
    if (!this.exportCurrent(attempt) || attempt.busy || !attempt.job ||
        !['saveToPhotos', 'openShare'].includes(action) || !attempt.target?.isCurrent()) return;
    attempt.busy = true; this.setState(s => ({ revision: s.revision + 1 }));
    let operation;
    try {
      if (!attempt.asset) attempt.asset = await attempt.job.capture(attempt.target);
      if (!this.exportCurrent(attempt)) { await attempt.asset.dispose(); return; }
      // Keep only completion identity when lifecycle invalidation drops the
      // record, canvas and asset. Native effects are never replayed on resume.
      operation = { owner: this.props.owner, pieceId: attempt.displayed.piece_id,
        identity: this.exportIdentity(attempt.displayed), flags: this.exportFlags(),
        targetKey: this.targetKey(), action, phase: 'running', outcome: null, suspended: false };
      this.exportOperation = operation;
      const result = await attempt.asset[action]();
      this.syncExportOperation();
      if (this.exportOperation === operation) {
        if (['saved_to_photos', 'cancelled', 'share_result_returned'].includes(result?.outcome)) {
          operation.phase = 'complete';
          // A missing/contradictory share response does not establish that the
          // native session ended, even while this screen remained active.
          operation.outcome = attempt.asset.nativeStatus === 'unknown'
            ? 'unconfirmed' : result.outcome;
        } else this.exportOperation = null;
        if (this.mounted) this.setState(s => ({ revision: s.revision + 1 }));
      }
      if (this.exportCurrent(attempt)) {
        this.cancelExport();
        this.exportMessage = {displayed:attempt.displayed,stamp:attempt.stamp,
          text:this.exportOutcomeMessage(result.outcome)};
        this.setState(s => ({ revision: s.revision + 1 }));
      }
    } catch (error) {
      this.syncExportOperation();
      if (operation && this.exportOperation === operation) {
        if (operation.suspended && ['started', 'unknown'].includes(attempt.asset?.nativeStatus)) {
          operation.phase = 'complete'; operation.outcome = 'unconfirmed';
        } else this.exportOperation = null;
        if (this.mounted) this.setState(s => ({ revision: s.revision + 1 }));
      }
      if (this.exportCurrent(attempt)) {
        const { PieceExportReceiptRetryError } = require('../features/piece/pieceExport');
        if (typeof PieceExportReceiptRetryError === 'function' && error instanceof PieceExportReceiptRetryError) {
          attempt.busy = false;
          this.exportMessage = {text:'画像の確認結果を受け取れませんでした。接続を確認して、もう一度お試しください。',displayed:attempt.displayed,stamp:attempt.stamp};
          this.setState(s => ({ revision: s.revision + 1 }));
          return;
        }
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
    const imageSupported = record && supportsPieceSavedImage(record.renderer_version);
    const exportEnabled = imageSupported && this.props.flags?.piece_v2_export_enabled === true;
    const targetKey = this.targetKey();
    const target = targetKey === this.deletedSavedTarget ? null : this.savedTarget();
    const attempt = this.exportCurrent(this.exportAttempt) ? this.exportAttempt : null;
    const operation = this.exportOperationFor(record);
    const pendingOperation = operation?.phase === 'running';
    const exporting = !!attempt?.busy || pendingOperation, exportReady = !!attempt?.target?.isCurrent();
    const exportMessage = operation?.phase === 'complete' ? this.exportOutcomeMessage(operation.outcome, operation.action)
      : this.current() && record === this.exportMessage?.displayed && this.stamp() === this.exportMessage?.stamp
        ? this.exportMessage.text : null;
    const needsReread = this.current() && record === this.exportMessage?.displayed &&
      this.stamp() === this.exportMessage?.stamp && this.exportMessage?.needsReread === true;
    return h(SafeAreaView, { style: { flex: 1, backgroundColor: '#FFFFFF' } },
      h(View, { style: { flex: 1, padding: 20 } },
        h(Text, { accessibilityRole: 'header', style: { color: '#202020', fontSize: 22, marginBottom: 12 } }, '自分のPiece'),
        h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 20 } },
          !available ? h(Text, { accessibilityRole: 'alert', style: { color: '#202020', fontSize: 16 } }, '現在、自分のPieceを確認できません。') : null,
          available && view.message ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16, marginBottom: 12 } }, view.message) : null,
          available && view.phase === 'loading' ? h(ActivityIndicator, { accessibilityLabel: 'Pieceを確認中' }) : null,
          available && view.phase === 'history' && view.items.length === 0 ? h(Text, { style: { color: '#202020', fontSize: 16 } }, '保存済みのPieceはありません。') : null,
          ...(available ? view.items.map(item => h(PieceOwnerCard, { key: item.piece_id, record: item, onOpen: () => this.act('openDetail', item.piece_id) })) : []),
          imageSupported ? h(PieceVisualCard, { savedRecord: record }) : null,
          record ? h(PieceOwnerCard, { record }) : null,
          record && !imageSupported ? h(Text,
            { style: { color: '#494949', fontSize: 14, lineHeight: 22, marginBottom: 8 } },
            'この端末では、このPieceの画像を表示・保存・共有できません。') : null,
          exportEnabled ? h(Text,
            { style: { color: '#494949', fontSize: 14, lineHeight: 22, marginBottom: 8 } },
            '保存・共有した画像は、Cocolonで削除・非公開にしても回収できません。') : null,
          exportEnabled ? h(Button, {
            title: attempt ? '画像を準備し直す' : '画像の保存・共有を準備', disabled: exporting || needsReread,
            onPress: () => this.prepareExport(record) }) : null,
          needsReread ? h(Button, { title: '同じPieceを読み込み直す',
            onPress: () => this.rereadExportRecord(record) }) : null,
          attempt?.job ? h(View, { pointerEvents: 'none', accessible: false,
            accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants',
            style: { position: 'absolute', left: -10000, top: 0, width: 1080 } },
            h(PieceExportCanvas, { key: attempt.serial, savedRecord: attempt.job.record, onCaptureTargetChange: attempt.onTarget, onCaptureUnavailable: attempt.onUnavailable })) : null,
          attempt?.job ? h(Button, { title: '写真に保存', disabled: exporting || !exportReady,
            onPress: () => this.exportImage(attempt, 'saveToPhotos') }) : null,
          attempt?.job ? h(Button, { title: '画像を共有', disabled: exporting || !exportReady,
            onPress: () => this.exportImage(attempt, 'openShare') }) : null,
          pendingOperation ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16 } },
            operation.action === 'saveToPhotos' ? '写真への保存結果を待っています。' : '共有画面の終了を待っています。') : null,
          exportMessage ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16 } }, exportMessage) : null,
          record && view.permissions.visibility && (record.visibility_scope === 'public' || view.permissions.publish)
            ? h(Button, { title: record.visibility_scope === 'public' ? '非公開にする' : '公開する', onPress: () => this.confirmVisibility(record) }) : null,
          record && view.permissions.delete ? h(Button, { title: 'このPieceを削除', onPress: () => this.confirmDelete(record) }) : null,
          available && view.canRetryDelete ? h(Button, { title: '同じ削除要求で結果を確認', onPress: () => this.act('retryDelete', view.deleteRetryToken) }) : null,
          available && view.canRetryDetail ? h(Button, { title: target ? '保存したPieceを読み込む' : '同じPieceを読み込み直す',
            onPress: () => this.act('retryDetail', view.detailRetryToken) }) : null,
          available && target && !view.canRetryDelete && !view.canRetryDetail && (view.phase === 'idle' ||
            view.phase === 'unavailable' && view.code === 'PIECE_TEMPORARILY_UNAVAILABLE') ? h(Button, {
            title: '保存したPieceを読み込む', onPress: () => this.openSavedDetail(targetKey, target.pieceId) }) : null,
          available && view.phase !== 'loading' && !view.canRetryDelete ? h(Button, { title: record ? '履歴に戻る' : target ? '履歴を読み込む' : '保存済みPieceを読み込む', onPress: () => this.act('loadHistory') }) : null,
          available && view.phase === 'history' && view.nextCursor ? h(Button, { title: '続きを読み込む', onPress: () => this.act('loadMore', view.nextCursor) }) : null,
          h(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22, marginTop: 16 } },
            record && !imageSupported ? '保存済み本文を確認できます。' :
              this.props.flags?.piece_v2_export_enabled === true ? '保存済み本文と画像レイアウトを確認できます。' :
                '保存済み本文を確認できます。詳細では、対応する画像レイアウトも確認できます。画像の保存・共有は、まだ利用できません。'),
        ),
        h(Button, { title: '戻る', onPress: () => { this.exportOperation = null; this.controller?.close();
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
    presentationActive: focused && !isTutorialMode,
    runtimePending: runtime.runtime?.loading === true || runtime.runtime?.loaded !== true,
    refreshRuntime: runtime.refreshAppRuntime });
}
