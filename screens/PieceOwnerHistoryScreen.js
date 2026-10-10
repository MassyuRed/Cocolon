import React from 'react';
import { Alert, AppState, View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { useAppRuntime } from '../AppRuntimeContext';
import { useTutorial } from '../TutorialContext';
import { createPieceOwnerHistoryController } from '../features/piece/PieceOwnerHistoryController';
import PieceOwnerCard from '../components/piece/PieceOwnerCard';

const h = React.createElement;
const flagNames = ['piece_v2_owner_read_enabled', 'piece_v2_visibility_toggle_enabled',
  'piece_v2_public_write_enabled', 'piece_v2_delete_enabled'];

export class PieceOwnerHistoryHost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { revision: 0 };
    this.mounted = false; this.foreground = false; this.controller = null; this.binding = null;
  }
  stamp() {
    return JSON.stringify([this.props.owner, this.props.enabled, this.props.flags]);
  }
  current() {
    return this.mounted && this.foreground && this.props.enabled === true &&
      !!this.props.owner && this.binding === this.stamp();
  }
  componentDidMount() {
    this.mounted = true; this.foreground = AppState.currentState === 'active';
    this.controller = createPieceOwnerHistoryController({ onFeatureDisabled: () => {
      if (this.current()) return this.props.refreshRuntime?.();
    } });
    this.unsubscribe = this.controller.subscribe(() => {
      if (this.mounted) this.setState(s => ({ revision: s.revision + 1 }));
    });
    this.appSubscription = AppState.addEventListener('change', state => {
      this.foreground = state === 'active'; this.binding = null; this.sync();
    });
    this.sync();
  }
  componentDidUpdate() { this.sync(); }
  componentWillUnmount() {
    this.mounted = false; this.unsubscribe?.(); this.appSubscription?.remove(); this.controller?.dispose();
  }
  sync() {
    if (!this.mounted) return;
    const next = this.stamp();
    if (next === this.binding) return;
    this.binding = next;
    this.controller.setContext({ enabled: this.foreground && this.props.enabled,
      expectedUserId: this.props.owner, flags: this.props.flags });
    this.setState(s => ({ revision: s.revision + 1 }));
  }
  act(action, ...args) { if (this.current()) return this.controller[action](...args); }
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
    return h(SafeAreaView, { style: { flex: 1, backgroundColor: '#FFFFFF' } },
      h(View, { style: { flex: 1, padding: 20 } },
        h(Text, { accessibilityRole: 'header', style: { color: '#202020', fontSize: 22, marginBottom: 12 } }, '自分のPiece'),
        h(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 20 } },
          !available ? h(Text, { accessibilityRole: 'alert', style: { color: '#202020', fontSize: 16 } }, '現在、自分のPieceを確認できません。') : null,
          available && view.message ? h(Text, { accessibilityLiveRegion: 'polite', style: { color: '#202020', fontSize: 16, marginBottom: 12 } }, view.message) : null,
          available && view.phase === 'loading' ? h(ActivityIndicator, { accessibilityLabel: 'Pieceを確認中' }) : null,
          available && view.phase === 'history' && view.items.length === 0 ? h(Text, { style: { color: '#202020', fontSize: 16 } }, '保存済みのPieceはありません。') : null,
          ...(available ? view.items.map(item => h(PieceOwnerCard, { key: item.piece_id, record: item, onOpen: () => this.act('openDetail', item.piece_id) })) : []),
          record ? h(PieceOwnerCard, { record }) : null,
          record && view.permissions.visibility && (record.visibility_scope === 'public' || view.permissions.publish)
            ? h(Button, { title: record.visibility_scope === 'public' ? '非公開にする' : '公開する', onPress: () => this.confirmVisibility(record) }) : null,
          record && view.permissions.delete ? h(Button, { title: 'このPieceを削除', onPress: () => this.confirmDelete(record) }) : null,
          available && view.canRetryDelete ? h(Button, { title: '同じ削除要求で結果を確認', onPress: () => this.act('retryDelete') }) : null,
          available && view.phase !== 'loading' ? h(Button, { title: record ? '履歴に戻る' : '保存済みPieceを読み込む', onPress: () => this.act('loadHistory') }) : null,
          available && view.phase === 'history' && view.nextCursor ? h(Button, { title: '続きを読み込む', onPress: () => this.act('loadMore') }) : null,
          h(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22, marginTop: 16 } }, '保存済み本文を確認する画面です。画像表示・画像の保存・共有は、まだ利用できません。'),
        ),
        h(Button, { title: '戻る', onPress: () => { this.controller?.close(); this.props.navigation?.goBack?.(); } }),
      ),
    );
  }
}

export default function PieceOwnerHistoryScreen({ navigation }) {
  const { session } = useAuth();
  const runtime = useAppRuntime();
  const { isTutorialMode } = useTutorial();
  const focused = useIsFocused();
  const flags = Object.fromEntries(flagNames.map(name => [name, runtime.isFeatureEnabled(name, false) === true]));
  return h(PieceOwnerHistoryHost, { navigation, owner: session?.user?.id || '', flags,
    enabled: focused && !isTutorialMode && flags.piece_v2_owner_read_enabled,
    refreshRuntime: runtime.refreshAppRuntime });
}
