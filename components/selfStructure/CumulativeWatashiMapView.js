import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext';
import { useSubscription } from '../../SubscriptionContext';
import { useTheme } from '../../theme/ThemeContext';
import { apiGet, apiPost } from '../../lib/apiClient';
import { SELF_STRUCTURE_WIRE, buildSelfStructureReportDetailPath, buildSelfStructureEvidencePath } from '../../lib/compat/legacyWireContracts';
import { getWatashiMapHistoryRetentionLabel } from './watashiMapAccessPolicy';
import WatashiMapV2Renderer from './WatashiMapV2Renderer';
import SemanticWatashiMap from './SemanticWatashiMap';
import AnalysisIfRouteDialog from './AnalysisIfRouteDialog';
import MapInterpretationCorrectionDialog from './MapInterpretationCorrectionDialog';
import { checkedMapCorrectionEvidenceItems, mapCorrectionEvidence } from './mapCorrectionContract';
import { checkedMapRow, checkedCurrentResult } from './cumulativeMapContract';
import { makeUiTokens, MODAL_ORIENTATIONS } from '../../ui/uiTokens';
import CocolonButton from '../CocolonButton';
import CocolonBackButton from '../CocolonBackButton';

const dateLabel = value => value ? new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '';
const monthLabel = value => value ? `${value.slice(0, 4)}年${Number(value.slice(5, 7))}月` : '';
const REFRESH_POLL_MS = 3000;
const pendingRefresh = value => value === 'queued' || value === 'running';
function readRefreshStatus(data) {
  const value = data?.refresh_status;
  if (value == null || ['queued', 'running', 'failed'].includes(value)) return value || null;
  throw new Error('analysis_refresh_status_invalid');
}
const temporarilyUnavailable = error => {
  const status = Number(error?.status);
  return (Number.isInteger(status) && status >= 500 && status <= 599)
    || error?.name === 'TimeoutError'
    || (error?.name === 'TypeError' && /network|fetch/i.test(String(error?.message || '')));
};
export default function CumulativeWatashiMapView({ reportId = null, month = null, onBack, onLatestSeenVersion, embedded = false, hideHeader = false }) {
  const { session } = useAuth();
  const { tier, loading: planLoading } = useSubscription();
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(!['background', 'inactive'].includes(AppState.currentState));
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => makeStyles(colors, ui), [colors, ui]);
  const owner = session?.user?.id || '';
  const key = `${owner}:${tier}:${reportId || 'current'}:${month || ''}`;
  const currentKey = useRef(key);
  currentKey.current = key;
  const request = useRef(0);
  const evidenceRequest = useRef(0);
  const seenCallback = useRef(onLatestSeenVersion);
  seenCallback.current = onLatestSeenVersion;
  const [state, setState] = useState({ key: null, loading: true });
  const [evidence, setEvidence] = useState(null);
  const [compare, setCompare] = useState(false);
  const [about, setAbout] = useState(false);
  const [ifDialog, setIfDialog] = useState(null);
  const [mapCorrection, setMapCorrection] = useState(null);
  const [correctionNotice, setCorrectionNotice] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const compareRef = useRef(compare);
  compareRef.current = compare;
  const ink = colors?.TEXT_ON_LIGHT || '#17212b';
  const paper = colors?.BG_SILVER || '#fff';

  const load = useCallback(async (withCurrent = false, force = false, readOnly = false) => {
    const seq = ++request.current;
    evidenceRequest.current += 1;
    setState(previous => previous.key === key ? { ...previous, loading: true, error: null, refreshError: false } : { key, loading: true });
    setEvidence(null);
    if (!owner) { setState({ key, error: 'ログインしてから、もう一度開いてください。' }); return; }
    const active = () => currentKey.current === key && request.current === seq;
    try {
      let row, now = null, comparisonFailed = false, refreshStatus = null;
      if (reportId) {
        const data = await apiGet(buildSelfStructureReportDetailPath(reportId, month), {
          expectedUserId: owner, headers: { 'X-Watashi-Map-Renderer': 'semantic.v1' }, timeoutMs: 15000 });
        if (!active()) return;
        row = checkedMapRow(data?.item);
        if (row.id !== reportId || (month && row.snapshot_month !== month)) throw new Error('analysis_month_mismatch');
      } else {
        const data = await apiGet(`${SELF_STRUCTURE_WIRE.routes.latest}?${readOnly ? 'ensure=false&background=true' : `ensure=true&background=true${force ? '&force=true' : ''}`}`, {
          expectedUserId: owner, headers: { 'X-Watashi-Map-Renderer': 'semantic.v1' }, timeoutMs: 15000 });
        if (!active()) return;
        row = checkedCurrentResult(data);
        refreshStatus = readRefreshStatus(data);
        if (!row) {
          if (active()) setState({ key, empty: true, insufficient: data.reason === 'insufficient_input', coverage: data?.map_context, refreshStatus });
          return;
        }
      }
      if (withCurrent && reportId) {
        try {
          const data = await apiGet(`${SELF_STRUCTURE_WIRE.routes.latest}?${readOnly ? 'ensure=false&background=true' : 'ensure=true&background=true'}`, {
            expectedUserId: owner, headers: { 'X-Watashi-Map-Renderer': 'semantic.v1' }, timeoutMs: 15000 });
          if (!active()) return;
          now = checkedCurrentResult(data);
          refreshStatus = readRefreshStatus(data);
        } catch (error) {
          if (!active()) return;
          if (!temporarilyUnavailable(error)) throw error;
          comparisonFailed = true;
        }
      }
      if (active()) {
        setState({ key, row, now, comparisonUnavailable: withCurrent && !now, comparisonFailed, refreshStatus });
      }
    } catch (error) {
      if (active()) setState(previous => previous.key === key && previous.row && temporarilyUnavailable(error)
        ? { ...previous, loading: false, refreshStatus: null, refreshError: true }
        : { key, error: 'マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。' });
    }
  }, [key, owner, reportId, month]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', next => setAppActive(next === 'active'));
    return () => listener.remove();
  }, []);

  useEffect(() => {
    compareRef.current = false;
    setCompare(false);
    setAbout(false);
    setEvidence(null);
    setIfDialog(null);
    setMapCorrection(null);
    setCorrectionNotice(null);
  }, [key]);

  useEffect(() => {
    const version = state.row?.content_json?.watashiMap?.projection_of;
    setIfDialog(previous => previous?.visible && previous.mode === 'create' && previous.baseMapRef !== version
      ? { ...previous, visible: false } : previous);
    setMapCorrection(previous => previous?.visible && previous.projection?.projection_of !== version
      ? { ...previous, visible: false } : previous);
  }, [state.row?.content_json?.watashiMap?.projection_of]);

  useEffect(() => {
    setEvidence(null);
    if (!planLoading && focused && appActive) load(compareRef.current);
    return () => { request.current += 1; evidenceRequest.current += 1; };
  }, [load, planLoading, focused, appActive]);

  useEffect(() => {
    if (!focused || !appActive || planLoading || state.key !== key || state.loading
        || (reportId && !compare) || !pendingRefresh(state.refreshStatus)) return undefined;
    const seq = request.current;
    let disposed = false, timer;
    const active = () => !disposed && currentKey.current === key && request.current === seq;
    const schedule = () => { timer = setTimeout(poll, REFRESH_POLL_MS); };
    const poll = async () => {
      try {
        const data = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus, { expectedUserId: owner, timeoutMs: 15000 });
        if (!active()) return;
        if (data?.status !== 'ok' || typeof data.has_visible_content !== 'boolean'
            || (data.version_key != null && typeof data.version_key !== 'string')) throw new Error('analysis_refresh_status_invalid');
        const refreshStatus = readRefreshStatus(data);
        const displayed = reportId ? stateRef.current.now : stateRef.current.row;
        const version = displayed?.content_json?.watashiMap?.projection_of || null;
        if ((data.version_key || null) !== version || (!!displayed !== data.has_visible_content)) {
          await load(compareRef.current, false, true);
          return;
        }
        if (stateRef.current.refreshStatus !== refreshStatus || stateRef.current.refreshError) {
          setState(previous => previous.key === key ? { ...previous, refreshStatus, refreshError: false } : previous);
        }
        if (pendingRefresh(refreshStatus)) schedule();
      } catch (error) {
        if (!active()) return;
        if (!temporarilyUnavailable(error)) {
          request.current += 1;
          evidenceRequest.current += 1;
          setEvidence(null);
          setState({ key, error: 'マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。' });
          return;
        }
        setState(previous => previous.key === key ? { ...previous, refreshError: true } : previous);
        schedule();
      }
    };
    schedule();
    return () => { disposed = true; clearTimeout(timer); };
  }, [focused, appActive, planLoading, state.key, state.loading, state.refreshStatus, key, owner, reportId, compare, load]);

  useEffect(() => {
    if (state.key !== key || !state.row || planLoading || !focused || !appActive) return;
    if (reportId) {
      apiPost('/report-reads/mark', { report_id: state.row.id,
        report_table: 'analysis_observed_artifacts', report_scope: 'myprofile' },
      { expectedUserId: owner }).catch(() => {});
    } else if (typeof seenCallback.current === 'function') {
      try { Promise.resolve(seenCallback.current(state.row.content_json.watashiMap.projection_of)).catch(() => {}); } catch {}
    }
  }, [state.key, state.row, key, reportId, owner, planLoading, focused, appActive]);

  const showEvidence = useCallback(async (row, nodeRef) => {
    const seq = ++evidenceRequest.current;
    setEvidence({ key, loading: true });
    try {
      const data = await apiGet(buildSelfStructureEvidencePath(row.id, nodeRef, row.snapshot_month), { expectedUserId: owner });
      const items = checkedMapCorrectionEvidenceItems(data?.items || []);
      if (currentKey.current === key && evidenceRequest.current === seq) setEvidence({ key, items });
    } catch {
      if (currentKey.current === key && evidenceRequest.current === seq) setEvidence({ key, error: true });
    }
  }, [key, owner]);
  const closeEvidence = () => { evidenceRequest.current += 1; setEvidence(null); };

  const coverage = (value, isSemantic = false) => value ? <View style={styles.notice}>
    <Text style={[styles.bodyText, { color: ink }]}>{isSemantic
      ? `対象の記録${value.source_count}件／根拠として結び付いた記録${value.mapped_count}件。`
      : `対象：感情入力の記録${value.source_count}件と、その本人補足。構造に反映できた記録：${value.mapped_count}件。`}</Text>
    {value.unparsed_count || value.excluded_count ? <Text style={[styles.bodyText, { color: ink }]}>
      {isSemantic
        ? `図に結び付けていない記録${value.unparsed_count}件／分析に使っていない記録${value.excluded_count}件。`
        : `未解析の範囲があります（全体または一部を読み取れていない記録${value.unparsed_count}件、通常分析の対象外${value.excluded_count}件）。`}
    </Text> : null}
    {value.stale_supplement_count ? <Text style={[styles.bodyText, { color: ink }]}>編集前の入力に結び付いた補足は、現在の入力の説明には使用していません（{value.stale_supplement_count}件）。</Text> : null}
  </View> : null;

  const renderMap = row => <View>
    {row.content_json?.watashiMap?.wire_kind === 'watashi.map.v3'
      ? <SemanticWatashiMap key={`${key}:${row.id}`} contentJson={row.content_json} colors={colors} isDark={themeName === 'dark'}
          onOpenEvidence={node => showEvidence(row, node)}
          onExploreIf={!reportId && tier === 'premium' ? branchRef => {
            const map = row.content_json.watashiMap;
            if (currentKey.current !== key || stateRef.current.row?.content_json?.watashiMap?.projection_of !== map.projection_of) return;
            const target = map.nodes.find(node => node.node_ref === branchRef) || map.edges.find(edge => edge.edge_ref === branchRef);
            if (target) setIfDialog({ key, visible: true, mode: 'create', baseMapRef: map.projection_of,
              branchPointId: branchRef, branchLabel: target.title || target.label });
          } : undefined}
          onCorrectMap={!reportId ? (kind, targetRef) => {
            const map = row.content_json.watashiMap;
            if (currentKey.current !== key || stateRef.current.row?.content_json?.watashiMap?.projection_of !== map.projection_of) return;
            setCorrectionNotice(null);
            setMapCorrection({ key, visible: true, projection: map, kind, targetRef });
          } : undefined} />
      : <WatashiMapV2Renderer key={`${key}:${row.id}`} contentJson={row.content_json} colors={colors} isDark={themeName === 'dark'}
          onOpenEvidence={node => showEvidence(row, node)} />}
    {about ? <View style={{ marginTop: 16 }}>
      <Text style={[styles.meta, { color: ink }]}>分析日時：{dateLabel(row.generated_at)}</Text>
      {row.captured_at ? <Text style={[styles.meta, { color: ink }]}>月次保存日時：{dateLabel(row.captured_at)}</Text> : null}
      {coverage(row.content_json?.map_context, row.content_json?.watashiMap?.wire_kind === 'watashi.map.v3')}
    </View> : null}
  </View>;

  const visible = state.key === key && !planLoading;
  const Container = embedded ? View : SafeAreaView;
  const Body = embedded ? View : ScrollView;
  return <Container {...(!embedded ? { edges: ['left', 'right'] } : {})}
    style={[embedded ? styles.embeddedRoot : styles.root, { backgroundColor: paper }]}>
    {!hideHeader ? <View style={styles.header}>
      <CocolonBackButton onPress={onBack} accessibilityLabel="わたしマップから戻る" />
      <Text style={[styles.title, { color: ink }]}>{reportId ? `${monthLabel(month)}のわたしマップ` : '今のわたしマップ'}</Text>
      <View style={{ width: 44 }} />
    </View> : null}
    <Body {...(embedded ? { style: [styles.body, styles.embeddedBody] } : { contentContainerStyle: styles.body })}>
      {!visible || state.loading ? <View style={{ gap: 12 }}>
        <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="保存したマップを取得しています" />
        <Text style={[styles.meta, { color: ink }]}>保存したマップを取得しています。</Text>
      </View> : null}
      {visible && pendingRefresh(state.refreshStatus) ? <Text style={[styles.meta, { color: ink }]} accessibilityLiveRegion="polite">
        わたしマップを更新中です。{state.row ? '保存したマップを先に表示しています。' : '更新が終わると表示されます。'}
      </Text> : null}
      {visible && (state.refreshStatus === 'failed' || state.refreshError) ? <Text style={styles.error} accessibilityRole="alert">
        更新結果を取得できませんでした。再取得で確認できます。
      </Text> : null}
      {visible && state.error ? <Text style={styles.error} accessibilityRole="alert">{state.error}</Text> : null}
      {correctionNotice?.key === key ? <Text style={[styles.bodyText, { color: ink }]} accessibilityLiveRegion="polite">
        {correctionNotice.text}
      </Text> : null}
      {visible && state.empty && !pendingRefresh(state.refreshStatus) ? <><Text style={[styles.bodyText, { color: ink }]}>{state.insufficient ? '今回の記録から、表示できる分析を作成できませんでした。' : '現在表示できるわたしマップはありません。'}</Text>{about ? coverage(state.coverage) : null}</> : null}
      {visible && state.row ? <>
        {reportId ? <Text style={[styles.meta, { color: ink }]}>{monthLabel(month)}に保存した当時のマップ</Text> : null}
        {reportId ? <CocolonButton variant="secondary" onPress={() => { setCompare(!compare); load(!compare); }}
          title={compare ? '当時のマップだけを見る' : '現在のマップと見比べる'} /> : null}
        {compare ? <Text style={[styles.sectionTitle, { color: ink }]}>当時：{monthLabel(month)}</Text> : null}
        {renderMap(state.row)}
        {compare && state.now ? <><Text style={[styles.sectionTitle, { color: ink }]}>現在</Text>{renderMap(state.now)}</> : null}
        {compare && state.comparisonUnavailable && !pendingRefresh(state.refreshStatus) ? <Text style={[styles.bodyText, { color: ink }]} accessibilityRole={state.comparisonFailed ? 'alert' : undefined}>
          {state.comparisonFailed
            ? '現在のマップを取得できませんでした。当時のマップは保存されています。再取得で確認できます。'
            : '現在のマップはまだ表示できません。当時のマップは保存されています。'}
        </Text> : null}
      </> : null}
      {visible && (state.row || state.empty) ? <CocolonButton variant="secondary" onPress={() => setAbout(!about)} title={about ? '分析について閉じる' : '分析について'} /> : null}
      {visible && about ? <Text style={[styles.meta, { color: ink }]}>{getWatashiMapHistoryRetentionLabel(tier)}</Text> : null}
      {visible && !state.loading && !pendingRefresh(state.refreshStatus) ? <CocolonButton variant="secondary"
        onPress={() => load(compare, !reportId && (!!state.row || state.refreshStatus === 'failed'))}
        title={!reportId && (state.row || state.refreshStatus === 'failed') ? '分析を更新' : '再取得'} /> : null}
      {!!owner && !planLoading && !reportId && tier === 'premium' ? <CocolonButton variant="secondary"
        testID="analysis-if-saved-open" title="保存した関心の方向" onPress={() => setIfDialog({ key, visible: true, mode: 'saved' })} /> : null}
    </Body>
    <Modal visible={!!evidence && evidence.key === key} transparent animationType="fade" onRequestClose={closeEvidence} supportedOrientations={MODAL_ORIENTATIONS}>
      <SafeAreaProvider><SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.overlay}><View style={styles.dialog}>
        <Text style={[styles.modalTitle, { color: ink }]}>根拠の記録</Text>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ gap: 16 }}>
          {evidence?.loading ? <ActivityIndicator color={colors.TITLE_GOLD} /> : null}
          {evidence?.error ? <Text style={styles.error}>記録を取得できませんでした。</Text> : null}
          {evidence?.items?.map(item => <View key={item.id} style={styles.notice}>
            {item.evidence_scope === 'MAP_CORRECTION_CONTEXT' ? <Text style={styles.label}>訂正対象の分析で参照した記録</Text> : null}
            <Text style={[styles.meta, { color: ink }]}>{dateLabel(item.created_at)}</Text>
            {item.version_state !== 'CURRENT' ? <Text style={[styles.bodyText, { color: ink }]}>この記録は分析後に編集されています。以下は現在の内容です。</Text> : null}
            {item.memo ? <><Text style={styles.label}>思考内容</Text><Text style={[styles.record, { color: ink }]}>{item.memo}</Text></> : null}
            {item.memo_action ? <><Text style={styles.label}>行動内容</Text><Text style={[styles.record, { color: ink }]}>{item.memo_action}</Text></> : null}
            {item.answers?.length ? <Text style={styles.label}>本人補足</Text> : null}
            {item.answers?.map((answer, index) => <Text key={index} style={[styles.record, { color: ink }]}>補足：{answer}</Text>)}
          </View>)}
          {mapCorrectionEvidence(evidence?.items).length ? <View style={styles.notice}>
            <Text style={styles.label}>本人によるマップ訂正</Text>
            {mapCorrectionEvidence(evidence?.items).map(correction => <View key={correction.correction_id} style={{ gap: 8 }}>
              <Text style={[styles.meta, { color: ink }]}>{dateLabel(correction.recorded_at)}</Text>
              {correction.version_state !== 'CURRENT' ? <Text style={[styles.bodyText, { color: ink }]}>訂正の対象となる記録やマップの状態が変わっています。以下は当時保存した本人の説明です。</Text> : null}
              <Text style={[styles.record, { color: ink }]}>{correction.text}</Text>
            </View>)}
          </View> : null}
        </ScrollView>
        <CocolonButton variant="secondary" onPress={closeEvidence} title="閉じる" />
      </View></SafeAreaView></SafeAreaProvider>
    </Modal>
    <AnalysisIfRouteDialog visible={!!ifDialog?.visible && ifDialog.key === key && !planLoading && focused && appActive
        && (ifDialog.mode === 'saved' || ifDialog.baseMapRef === state.row?.content_json?.watashiMap?.projection_of)}
      onClose={() => setIfDialog(previous => previous ? { ...previous, visible: false } : null)}
      ownerId={owner} tier={tier} baseMapRef={ifDialog?.baseMapRef} branchPointId={ifDialog?.branchPointId}
      branchLabel={ifDialog?.branchLabel} mode={ifDialog?.mode} colors={colors} themeName={themeName} />
    <MapInterpretationCorrectionDialog
      visible={!!mapCorrection?.visible && mapCorrection.key === key && !planLoading && focused && appActive
        && mapCorrection.projection?.projection_of === state.row?.content_json?.watashiMap?.projection_of}
      onClose={() => setMapCorrection(previous => previous ? { ...previous, visible: false } : null)}
      onSaved={result => {
        if (currentKey.current !== key) return;
        setCorrectionNotice({ key, text: result.source_state === 'STALE'
          ? '訂正を保存しました。当時の読み取りへの説明として保持されています。'
          : result.refresh_status === 'failed'
            ? '訂正を保存しました。分析の更新結果は、再取得して確認してください。'
            : '訂正を保存しました。分析の更新が完了してから、読み直した結果を確認できます。' });
        load(compareRef.current, false, true);
      }}
      ownerId={owner} projection={mapCorrection?.projection} kind={mapCorrection?.kind}
      targetRef={mapCorrection?.targetRef} colors={colors} themeName={themeName} />
  </Container>;
}

function makeStyles(colors, ui) {
  return StyleSheet.create({
    root: { flex: 1 }, embeddedRoot: { alignSelf: 'stretch' },
    header: { padding: 20, gap: 8, flexDirection: 'row', alignItems: 'center' },
    title: { ...ui.typography.screenTitle, flex: 1, textAlign: 'center' },
    sectionTitle: { ...ui.typography.sectionTitle }, modalTitle: { ...ui.typography.modalTitle },
    body: { padding: 20, gap: 16, paddingBottom: 24, width: '100%', maxWidth: 680, alignSelf: 'center' },
    embeddedBody: { padding: 0, paddingBottom: 8 },
    meta: { ...ui.typography.meta }, bodyText: { ...ui.typography.body, color: colors.TEXT_ON_LIGHT },
    error: { ...ui.typography.description, color: colors.ERROR },
    label: { ...ui.typography.description, fontWeight: '600', color: colors.TEXT_SUBTLE },
    notice: { padding: 16, gap: 8, borderWidth: 1, borderRadius: 16, borderColor: colors.CARD_BORDER, backgroundColor: colors.SURFACE_TONAL },
    record: { ...ui.typography.body },
    overlay: { flex: 1, backgroundColor: '#0008', padding: 20, justifyContent: 'center', alignItems: 'center' },
    dialog: { width: '100%', maxWidth: 640, maxHeight: '100%', flexShrink: 1, padding: 20, borderRadius: 24, gap: 16, backgroundColor: colors.FIELD_BG, borderWidth: 1, borderColor: colors.CARD_BORDER },
  });
}
