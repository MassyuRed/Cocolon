import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analysisIfRouteApi } from '../../lib/api/analysisIfRouteApi';
import { makeUiTokens, MODAL_ORIENTATIONS } from '../../ui/uiTokens';
import CocolonButton from '../CocolonButton';

const originLabel = { OBSERVED_ANCHOR: '元のマップの読み取り', USER_CHOICE: '本人が考えた選択',
  SIMULATED_EXTENSION: 'もしもの選択・仮定', UNKNOWN: 'まだ分からないこと' };
const operationKey = () => `if-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
const unknownResult = error => !Number.isInteger(error?.status) || error.status >= 500;

export default function AnalysisIfRouteDialog({ visible, onClose, ownerId, tier, baseMapRef = null,
  branchPointId = null, branchLabel = '', mode = 'create', colors = {}, themeName = 'light' }) {
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => makeStyles(colors, ui), [colors, ui]);
  const scope = `${ownerId}:${tier}:${baseMapRef || ''}:${branchPointId || ''}:${mode}`;
  const current = useRef({ scope, visible });
  current.current = { scope, visible: !!visible && tier === 'premium' && !!ownerId };
  const sequence = useRef(0), controllers = useRef(new Set()), operations = useRef(new Map()), inFlight = useRef(null);
  const [state, setState] = useState({ scope: null, panel: mode === 'saved' ? 'saved_intent' : 'form' });
  const [intent, setIntent] = useState(''), [constraint, setConstraint] = useState('');
  const [noConstraints, setNoConstraints] = useState(false), [count, setCount] = useState(2), [note, setNote] = useState('');
  const abortAll = () => { sequence.current += 1; inFlight.current = null; controllers.current.forEach(controller => controller.abort()); controllers.current.clear(); };
  useEffect(() => {
    abortAll();
    setState({ scope, panel: mode === 'saved' ? 'saved_intent' : 'form' });
    setIntent(''); setConstraint(''); setNoConstraints(false); setCount(2); setNote('');
    return abortAll;
  }, [scope]);
  useEffect(() => {
    if (!visible || tier !== 'premium' || !ownerId) { abortAll(); setState(previous => ({ ...previous, busy: false })); }
    return () => { if (visible) abortAll(); };
  }, [visible, tier, ownerId]);
  useEffect(() => { operations.current.clear(); }, [ownerId, tier, baseMapRef]);
  useEffect(() => () => { abortAll(); operations.current.clear(); }, []);
  const active = token => current.current.scope === scope && current.current.visible && sequence.current === token;
  const update = change => setState(previous => previous.scope === scope ? { ...previous, ...change } : previous);
  const options = controller => ({ expectedUserId: ownerId, signal: controller.signal });
  const createContext = `create:${scope}`;
  const pendingOperation = [...operations.current.entries()].find(([, operation]) => operation.scope === scope);
  const busy = state.scope === scope && !!state.busy;

  const mutation = async (context, method, payload) => {
    if (busy || inFlight.current !== null || !current.current.visible) return;
    let operation = operations.current.get(context);
    if (!operation) {
      operation = { method, scope, payload: JSON.parse(JSON.stringify({ ...payload, idempotency_key: operationKey() })) };
      operations.current.set(context, operation);
    }
    const token = ++sequence.current, controller = new AbortController();
    inFlight.current = token;
    controllers.current.add(controller);
    update({ busy: true, error: null, recovery: { context, method }, message: null });
    try {
      const result = await analysisIfRouteApi[operation.method](operation.payload, options(controller));
      if (!active(token)) return;
      if (result.status === 'PENDING') {
        update({ busy: false, recovery: { context, method }, message: 'まだ結果を確認中です。同じ内容で、もう一度結果を確認できます。' });
        return;
      }
      operations.current.delete(context);
      if (result.status === 'QUESTION_PENDING') {
        update({ busy: false, recovery: null, question: result.clarification_request.prompt_private, result: null });
      } else if (result.status === 'SEPARATE_SAFETY') {
        update({ busy: false, recovery: null, question: null, error: 'この内容は、ここで選択肢として扱えませんでした。' });
      } else if (operation.method === 'save') {
        update({ busy: false, recovery: null, message: '関心の方向を保存しました。', saved: result });
      } else {
        update({ busy: false, recovery: null, question: null, result, detail: null });
      }
    } catch (error) {
      if (!active(token)) return;
      const uncertain = unknownResult(error);
      if (!uncertain) operations.current.delete(context);
      update({ busy: false, recovery: uncertain ? { context, method } : null,
        error: uncertain ? '結果を確認できませんでした。同じ内容で確認できます。'
          : 'この内容では続けられませんでした。マップや閲覧範囲を確認してください。' });
    } finally { controllers.current.delete(controller); if (inFlight.current === token) inFlight.current = null; }
  };

  const loadList = async (kind, append = false) => {
    if (busy || inFlight.current !== null || !current.current.visible) return;
    const token = ++sequence.current, controller = new AbortController(); controllers.current.add(controller);
    inFlight.current = token;
    const previous = append && state.panel === kind ? state.items || [] : [];
    update({ panel: kind, busy: true, error: null, question: null, result: null, detail: null, recovery: null });
    try {
      const result = await analysisIfRouteApi.list(kind, { ...options(controller), offset: previous.length });
      if (active(token)) update({ busy: false, items: [...new Map([...previous, ...result.items].map(item => [item.id, item])).values()], more: result.items.length === result.limit });
    } catch { if (active(token)) update({ busy: false, error: '保存した内容を取得できませんでした。', listFailed: true }); }
    finally { controllers.current.delete(controller); if (inFlight.current === token) inFlight.current = null; }
  };

  useEffect(() => {
    if (visible && tier === 'premium' && ownerId && mode === 'saved') loadList('saved_intent');
  }, [scope, visible]);

  const openDetail = async (kind, id) => {
    if (busy || inFlight.current !== null) return;
    const token = ++sequence.current, controller = new AbortController(); controllers.current.add(controller);
    inFlight.current = token;
    update({ busy: true, error: null, recovery: null });
    try {
      const detail = await analysisIfRouteApi.get(kind, id, options(controller));
      if (active(token)) update({ busy: false, detail, result: kind === 'scenario_set' ? detail : null });
    } catch { if (active(token)) update({ busy: false, error: '保存した内容を取得できませんでした。' }); }
    finally { controllers.current.delete(controller); if (inFlight.current === token) inFlight.current = null; }
  };

  const remove = async (kind, id) => {
    if (busy || inFlight.current !== null) return;
    const token = ++sequence.current, controller = new AbortController(); controllers.current.add(controller);
    inFlight.current = token;
    update({ busy: true, error: null });
    try {
      await analysisIfRouteApi.delete(kind, id, options(controller));
      if (active(token)) update({ busy: false, detail: null, result: null, deleting: null,
        items: (state.items || []).filter(item => item.id !== id), message: '削除しました。' });
    } catch (error) {
      if (active(token)) update(error?.status === 404
        ? { busy: false, detail: null, result: null, deleting: null, items: (state.items || []).filter(item => item.id !== id), message: 'この内容は削除されています。' }
        : { busy: false, error: '削除の結果を確認できませんでした。同じ内容の削除をもう一度確認できます。' });
    } finally { controllers.current.delete(controller); if (inFlight.current === token) inFlight.current = null; }
  };

  if (!visible || !ownerId || tier !== 'premium') return null;
  const show = state.scope === scope ? state : { panel: mode === 'saved' ? 'saved_intent' : 'form' };
  const recovery = show.recovery || (pendingOperation ? { context: pendingOperation[0], method: pendingOperation[1].method } : null);
  const formLocked = busy || !!recovery;
  const result = show.result;
  const resetForm = () => update({ panel: 'form', result: null, detail: null, items: [], error: null, message: null, question: null, recovery: null });
  const restartDifferent = () => {
    abortAll();
    if (recovery) operations.current.delete(recovery.context);
    update({ panel: 'form', busy: false, result: null, detail: null, error: null, message: null, question: null, recovery: null });
  };
  return <Modal visible transparent animationType="fade" onRequestClose={onClose} supportedOrientations={MODAL_ORIENTATIONS}>
    <SafeAreaProvider><SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.overlay}>
      <View style={styles.dialog} accessibilityViewIsModal testID="analysis-if-dialog">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
          <Text style={styles.title} accessibilityRole="header">{show.panel === 'form' ? 'もし別の選択をするとしたら' : show.panel === 'saved_intent' ? '保存した関心の方向' : '考えた選択肢'}</Text>
          <Text style={styles.text}>予測や正解ではなく、考えるための選択肢です。元のマップや実行した記録とは分けて表示します。</Text>
          <View style={styles.actions}>
            <CocolonButton variant="secondary" title="保存した方向" onPress={() => loadList('saved_intent')} disabled={busy} />
            <CocolonButton variant="secondary" title="考えた選択肢" onPress={() => loadList('scenario_set')} disabled={busy} />
          </View>
          {show.panel === 'form' && !result && baseMapRef && branchPointId ? <>
            {branchLabel ? <Text style={styles.section}>{branchLabel}</Text> : null}
            {show.question ? <Text style={styles.notice} accessibilityLiveRegion="polite">{show.question} 入力した内容を見直して、もう一度教えてください。</Text> : null}
            <Text style={styles.label}>どうしてみたいですか？</Text>
            <TextInput testID="analysis-if-intent" accessibilityLabel="どうしてみたいですか" multiline maxLength={2000}
              style={styles.input} value={intent} onChangeText={setIntent} editable={!formLocked} />
            <Text style={styles.label}>大切にしたい条件・避けたいこと</Text>
            <TextInput testID="analysis-if-constraints" accessibilityLabel="大切にしたい条件や避けたいこと" multiline maxLength={2000}
              style={styles.input} value={constraint} onChangeText={setConstraint} editable={!formLocked && !noConstraints} />
            <View style={styles.switchRow}><Text style={[styles.text, { flex: 1 }]}>今は特にありません</Text>
              <Switch testID="analysis-if-no-constraints" accessibilityLabel="大切にしたい条件は今は特にありません"
                value={noConstraints} onValueChange={setNoConstraints} disabled={formLocked} /></View>
            <Text style={styles.label}>並べて考える数</Text>
            <View style={styles.actions}>{[1, 2, 3].map(number => <CocolonButton key={number}
              testID={`analysis-if-count-${number}`} title={`${number}案`} variant={count === number ? 'primary' : 'secondary'}
              accessibilityState={{ selected: count === number }} onPress={() => setCount(number)} disabled={formLocked} />)}</View>
            <CocolonButton testID="analysis-if-create" title="選択肢を考える" disabled={formLocked || !intent.trim() || (!constraint.trim() && !noConstraints)}
              onPress={() => mutation(createContext, 'create', { base_observed_map_ref: baseMapRef,
                branch_point_id: branchPointId, branch_intent_text: intent.trim(), constraint_texts: noConstraints ? [] : [constraint.trim()],
                constraints_confirmed: noConstraints || !!constraint.trim(), requested_candidate_count: count })} />
          </> : null}
          {result ? <>
            <Text style={styles.notice}>並び順はおすすめの順位ではありません。</Text>
            {result.projection.scenarios.map(scenario => <View key={scenario.scenario_ref} style={styles.card}>
              <Text style={styles.section}>{scenario.visible_label}</Text>
              {scenario.nodes.map(node => <View key={node.node_ref} style={styles.node}>
                <Text style={styles.meta}>{originLabel[node.origin]}</Text><Text style={styles.text}>{node.visible_label}</Text>
              </View>)}
              {scenario.edges.length ? <View style={styles.node}><Text style={styles.label}>仮に進むつながり</Text>
                {scenario.edges.map(edge => <Text key={edge.edge_ref} style={styles.text}>
                  {scenario.nodes.find(node => node.node_ref === edge.from_ref)?.visible_label} → {scenario.nodes.find(node => node.node_ref === edge.to_ref)?.visible_label}
                  {edge.visible_condition_labels.length ? `（${edge.visible_condition_labels.join('／')}）` : ''}
                </Text>)}</View> : null}
              {[['required_conditions', 'この選択で必要になる条件'], ['frictions', '引っかかりそうなこと'], ['unmodelled_factors', 'まだ分からないこと']].map(([field, label]) =>
                <View key={field} style={styles.node}><Text style={styles.label}>{label}</Text>
                  {scenario[field].length ? scenario[field].map((item, index) => <Text key={index} style={styles.text}>{item}</Text>) : <Text style={styles.meta}>この候補では、まだ具体的に挙げられていません。</Text>}
                </View>)}
              <CocolonButton testID={`analysis-if-save-${scenario.scenario_ref}`} title="この方向を保存" disabled={busy || !!recovery}
                onPress={() => mutation(`save:${scope}:${scenario.scenario_ref}`, 'save', {
                  source_scenario_set_ref: result.scenario_set_ref, selected_scenario_ref: scenario.scenario_ref,
                  user_note: note.trim() || null })} />
            </View>)}
            <Text style={styles.label}>保存する方向に添えるメモ（任意）</Text>
            <TextInput testID="analysis-if-note" accessibilityLabel="保存する方向に添えるメモ" multiline maxLength={2000}
              style={styles.input} value={note} onChangeText={setNote} editable={!busy && !recovery} />
            <Text style={styles.meta}>保存しても、実行した・達成したという記録には変わりません。</Text>
            {baseMapRef && branchPointId ? <CocolonButton variant="secondary" title="入力から考え直す" onPress={resetForm} disabled={busy || !!recovery} /> : null}
          </> : null}
          {show.panel !== 'form' && !show.detail ? <>
            {(show.items || []).map(item => <View key={item.id} style={styles.card}>
              <Text style={styles.section}>{item.kind === 'saved_intent' ? item.selected_scenario_label || '保存した関心の方向' : item.projection.scenarios.map(s => s.visible_label).join('／')}</Text>
              {item.kind === 'saved_intent' && item.projection.visible_note ? <Text style={styles.text}>{item.projection.visible_note}</Text> : null}
              <CocolonButton variant="secondary" title="保存した内容を開く" onPress={() => openDetail(item.kind, item.id)} disabled={busy} />
            </View>)}
            {!busy && show.items?.length === 0 ? <Text style={styles.text}>保存した内容はまだありません。</Text> : null}
            {show.more ? <CocolonButton variant="secondary" title="さらに読む" onPress={() => loadList(show.panel, true)} disabled={busy} /> : null}
            <CocolonButton variant="secondary" title="一覧を再取得" onPress={() => loadList(show.panel)} disabled={busy} />
          </> : null}
          {show.detail?.kind === 'saved_intent' ? <View style={styles.card}>
            <Text style={styles.section}>{show.detail.selected_scenario_label || '保存した関心の方向'}</Text>
            {show.detail.projection.visible_note ? <Text style={styles.text}>{show.detail.projection.visible_note}</Text> : null}
            <Text style={styles.meta}>{new Date(show.detail.projection.saved_at).toLocaleString('ja-JP')}</Text>
            <Text style={styles.text}>この時に残した関心の方向です。実行や達成を示すものではありません。</Text>
          </View> : null}
          {show.detail ? <>
            <CocolonButton variant="secondary" title="一覧へ戻る" onPress={() => update({ detail: null, result: null, deleting: null })} disabled={busy} />
            <CocolonButton variant="secondary" title="この保存を削除" onPress={() => update({ deleting: { kind: show.detail.kind, id: show.detail.id } })} disabled={busy} />
          </> : null}
          {show.deleting ? <View style={styles.notice}><Text style={styles.text}>この内容を削除しますか？{show.deleting.kind === 'scenario_set' ? 'ここから保存した関心の方向も削除されます。' : ''}</Text>
            <CocolonButton title="削除する" onPress={() => remove(show.deleting.kind, show.deleting.id)} disabled={busy} />
            <CocolonButton variant="secondary" title="戻る" onPress={() => update({ deleting: null })} disabled={busy} />
          </View> : null}
          {busy ? <ActivityIndicator accessibilityLabel="内容を確認しています" color={colors.TITLE_GOLD} /> : null}
          {show.message ? <Text style={styles.notice} accessibilityLiveRegion="polite">{show.message}</Text> : null}
          {show.error ? <Text style={styles.error} accessibilityRole="alert">{show.error}</Text> : null}
          {!busy && recovery ? <CocolonButton testID="analysis-if-retry-same" title="同じ内容で結果を確認"
            onPress={() => mutation(recovery.context, recovery.method)} /> : null}
          {!busy && recovery?.method === 'create' ? <CocolonButton testID="analysis-if-restart-different"
            variant="secondary" title="別の条件で考え直す" onPress={restartDifferent} /> : null}
          <CocolonButton variant="secondary" title="閉じる" onPress={onClose} />
        </ScrollView>
      </View>
    </SafeAreaView></SafeAreaProvider>
  </Modal>;
}

function makeStyles(colors, ui) {
  const ink = colors.TEXT_ON_LIGHT || '#17212b', muted = colors.TEXT_SUBTLE || '#756c66';
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: '#0008', padding: 20, justifyContent: 'center', alignItems: 'center' },
    dialog: { width: '100%', maxWidth: 680, maxHeight: '100%', flexShrink: 1, borderRadius: 24,
      backgroundColor: colors.FIELD_BG || '#fff', borderWidth: 1, borderColor: colors.CARD_BORDER || '#ddd' },
    body: { padding: 20, paddingBottom: 28, gap: 16 }, title: { ...ui.typography.screenTitle, color: ink },
    section: { ...ui.typography.sectionTitle, color: ink }, text: { ...ui.typography.body, color: ink },
    label: { ...ui.typography.body, color: ink, fontWeight: '600' }, meta: { ...ui.typography.meta, color: muted },
    error: { ...ui.typography.body, color: colors.ERROR || '#a00' },
    input: { ...ui.typography.body, color: ink, borderWidth: 1, borderColor: colors.CARD_BORDER || '#ddd',
      borderRadius: 16, minHeight: 100, padding: 14, textAlignVertical: 'top' },
    card: { padding: 16, gap: 14, borderRadius: 20, borderWidth: 1, borderColor: colors.CARD_BORDER || '#ddd' },
    node: { gap: 6 }, notice: { ...ui.typography.body, color: ink, padding: 16, borderRadius: 16,
      backgroundColor: colors.SURFACE_TONAL || '#efe1dd' },
    actions: { gap: 8 }, switchRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  });
}
