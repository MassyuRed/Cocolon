import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ActivityIndicator, AppState, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext';
import { useSubscription } from '../../SubscriptionContext';
import { useTheme } from '../../theme/ThemeContext';
import { SHOW_INTERPRETATION_CORRECTION } from '../../runtime/interpretationCorrectionUi';
import { apiGet, apiPost } from '../../lib/apiClient';
import { getEmotionRecordRevision, subscribeEmotionRecordChanges } from '../../lib/emotionRecordChanges';
import { SELF_STRUCTURE_WIRE, buildSelfStructureReportDetailPath } from '../../lib/compat/legacyWireContracts';
import { getWatashiMapHistoryRetentionLabel } from './watashiMapAccessPolicy';
import WatashiMapV2Renderer from './WatashiMapV2Renderer';
import SemanticWatashiMap from './SemanticWatashiMap';
import AnalysisIfRouteDialog from './AnalysisIfRouteDialog';
import MapInterpretationCorrectionDialog from './MapInterpretationCorrectionDialog';
import { checkedMapAccess, checkedMapRow, checkedCurrentResult, isLegacySemanticDowngrade } from './cumulativeMapContract';
import { makeUiTokens } from '../../ui/uiTokens';
import CocolonButton from '../CocolonButton';
import CocolonBackButton from '../CocolonBackButton';

const dateLabel = value => value ? new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '';
const monthLabel = value => value ? `${value.slice(0, 4)}年${Number(value.slice(5, 7))}月` : '';
const REFRESH_POLL_MS = 3000;
const pendingRefresh = value => value === 'queued' || value === 'running';
const mapScope = row => row ? `${row.id}:${row.map_subscription_tier || ''}:${!!row.map_plan_scoped}:${!!row.retained_previous}` : null;
const insufficientAnalysis = data => data.reason === 'insufficient_input'
  || ['analysis_insufficient_input', 'analysis_primary_structure_unavailable'].includes(data.skip_reason);
function readRefreshStatus(data) {
  const value = data?.refresh_status;
  if (value == null || ['queued', 'running', 'failed'].includes(value)) {
    return value === 'failed' && insufficientAnalysis(data) ? null : value || null;
  }
  throw new Error('analysis_refresh_status_invalid');
}
const temporarilyUnavailable = error => {
  const status = Number(error?.status);
  return (Number.isInteger(status) && status >= 500 && status <= 599)
    || error?.name === 'TimeoutError'
    || (error?.name === 'TypeError' && /network|fetch/i.test(String(error?.message || '')));
};
function canReuseCurrentMap(saved, key, recordRevision, status) {
  if (!saved || saved.state.key !== key || saved.state.recordRevision !== recordRevision) return false;
  if (!status || status.checkedAt <= saved.startedAt) return true;
  if (status.accessDenied) return false;
  const { state } = saved;
  const refreshStatus = readRefreshStatus({ refresh_status: status.refreshStatus, skip_reason: status.skipReason });
  return status.hasContent === Boolean(state.row) &&
    status.versionKey === (state.row?.content_json?.watashiMap?.projection_of || null) &&
    (!!state.row?.retained_previous === (status.skipReason === 'analysis_previous_map_retained')) &&
    (!status.tier || status.tier === state.mapSubscriptionTier) &&
    refreshStatus === state.refreshStatus &&
    (!!state.row || insufficientAnalysis({ skip_reason: status.skipReason }) === state.insufficient);
}

export default function CumulativeWatashiMapView({ reportId = null, month = null, onBack, onLatestSeenVersion,
  renderLatestUpdateLabel, mapReadSnapshot, currentMapStatus, embedded = false, hideHeader = false, onOpenGuide }) {
  const { session, authOwnerGeneration } = useAuth();
  const { tier, loading: planLoading } = useSubscription();
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(!['background', 'inactive'].includes(AppState.currentState));
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => makeStyles(colors, ui), [colors, ui]);
  const owner = session?.user?.id || '';
  const recordRevision = useSyncExternalStore(subscribeEmotionRecordChanges,
    () => reportId ? 0 : getEmotionRecordRevision(owner));
  const key = `${owner}:${authOwnerGeneration ?? 0}:${tier}:${reportId || 'current'}:${month || ''}`;
  const currentKey = useRef(key);
  currentKey.current = key;
  const request = useRef(0);
  const mapLoad = useRef(null);
  const seenCallback = useRef(onLatestSeenVersion);
  seenCallback.current = onLatestSeenVersion;
  const lastSeen = useRef(null);
  const localSnapshot = useRef(null);
  const snapshot = mapReadSnapshot || localSnapshot;
  const statusRef = useRef(currentMapStatus);
  statusRef.current = currentMapStatus;
  const [state, setState] = useState(() => !reportId && appActive && !planLoading &&
    canReuseCurrentMap(snapshot.current, key, recordRevision, currentMapStatus)
    ? snapshot.current.state : { key: null, loading: true });
  const [compare, setCompare] = useState(false);
  const [about, setAbout] = useState(false);
  const [ifDialog, setIfDialog] = useState(null);
  const [mapCorrection, setMapCorrection] = useState(null);
  const [correctionNotice, setCorrectionNotice] = useState(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const displayedMapScope = mapScope(state.row);
  const compareRef = useRef(compare);
  compareRef.current = compare;
  const ink = colors?.TEXT_ON_LIGHT || '#17212b';
  const paper = colors?.BG_SILVER || '#fff';

  const load = useCallback(async (withCurrent = false, force = false, readOnly = false) => {
    const seq = ++request.current;
    const startedAt = Date.now();
    mapLoad.current?.abort();
    if (!reportId) snapshot.current = null;
    setState(previous => previous.key === key ? { ...previous, loading: true, error: null, refreshError: false } : { key, loading: true });
    if (!owner) { setState({ key, error: 'ログインしてから、もう一度開いてください。' }); return; }
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    mapLoad.current = controller;
    const active = () => currentKey.current === key && request.current === seq;
    const present = result => {
      const next = { ...result, recordRevision };
      if (!reportId && !pendingRefresh(next.refreshStatus) && next.refreshStatus !== 'failed') {
        snapshot.current = { state: next, startedAt };
      }
      setState(next);
    };
    const readMap = (path, renderer = 'semantic.v3') => apiGet(path, {
      expectedUserId: owner, headers: { 'X-Watashi-Map-Renderer': renderer, 'Cache-Control': 'no-store',
        ...(renderer === 'semantic.v3' ? { 'X-Watashi-Map-Structure-Relations': 'v1' } : {}) },
      signal: controller?.signal, timeoutMs: 15000,
    });
    const observeAccess = value => {
      const { tier: serverTier } = checkedMapAccess(value);
      if (active() && serverTier) setState(previous => previous.key === key && previous.mapSubscriptionTier
        && previous.mapSubscriptionTier !== serverTier ? { key, loading: true, mapSubscriptionTier: serverTier } : previous);
      return serverTier;
    };
    const readDetail = async (id, snapshotMonth, renderer) => {
      const data = await readMap(buildSelfStructureReportDetailPath(id, snapshotMonth), renderer);
      const result = checkedMapRow(data?.item, data);
      if (result.id !== id || (snapshotMonth && result.snapshot_month !== snapshotMonth)) throw new Error('analysis_month_mismatch');
      return result;
    };
    const restoreSemanticMap = async (saved, snapshotMonth = null) => {
      if (!active() || !isLegacySemanticDowngrade(saved)) return saved;
      try {
        let detail = await readDetail(saved.id, snapshotMonth, 'semantic.v2');
        if (!active()) return saved;
        if (isLegacySemanticDowngrade(detail)) detail = await readDetail(saved.id, snapshotMonth, 'semantic.v1');
        if (detail.map_subscription_tier !== saved.map_subscription_tier) throw new Error('analysis_map_access_changed');
        const map = detail.content_json.watashiMap;
        if (!active() || map.wire_kind !== 'watashi.map.v3') return saved;
        return { ...saved, content_text: detail.content_text,
          content_json: { ...saved.content_json, watashiMap: map } };
      } catch (error) {
        if (temporarilyUnavailable(error)) return saved;
        throw error;
      }
    };
    try {
      let row, now = null, comparisonFailed = false, insufficient = false, refreshStatus = null, mapSubscriptionTier;
      if (reportId) {
        row = await readDetail(reportId, month);
        if (!active()) return;
        mapSubscriptionTier = observeAccess(row);
      } else {
        const data = await readMap(`${SELF_STRUCTURE_WIRE.routes.latest}?${readOnly ? 'ensure=false&background=true' : `ensure=true&background=true${force ? '&force=true' : ''}`}`);
        if (!active()) return;
        mapSubscriptionTier = observeAccess(data);
        row = checkedCurrentResult(data);
        refreshStatus = readRefreshStatus(data);
        if (!row) {
          if (active()) present({ key, empty: true, insufficient: insufficientAnalysis(data), coverage: data?.map_context, refreshStatus, mapSubscriptionTier });
          return;
        }
      }
      if (isLegacySemanticDowngrade(row)) {
        // The authenticated first read has a complete, validated text view.
        // Keep that report readable while its compatible graph is fetched.
        const saved = row;
        setState(previous => previous.key === key && previous.row?.id === saved.id
          ? { ...previous, refreshStatus }
          : { key, row: saved, loading: true, semanticRestorePending: true, refreshStatus, mapSubscriptionTier, recordRevision });
        row = await restoreSemanticMap(saved, reportId ? month : null);
      }
      if (withCurrent && reportId) {
        if (!active()) return;
        try {
          const data = await readMap(`${SELF_STRUCTURE_WIRE.routes.latest}?${readOnly ? 'ensure=false&background=true' : 'ensure=true&background=true'}`);
          if (!active()) return;
          const currentTier = observeAccess(data);
          if (currentTier !== mapSubscriptionTier) throw new Error('analysis_map_access_changed');
          const current = checkedCurrentResult(data);
          refreshStatus = readRefreshStatus(data);
          insufficient = !current && insufficientAnalysis(data);
          now = await restoreSemanticMap(current);
        } catch (error) {
          if (!active()) return;
          if (!temporarilyUnavailable(error)) throw error;
          comparisonFailed = true;
        }
      }
      if (active()) {
        present({ key, row, now, comparisonUnavailable: withCurrent && !now, comparisonFailed, insufficient, refreshStatus, mapSubscriptionTier });
      }
    } catch (error) {
      if (active()) setState(previous => previous.key === key && previous.row && temporarilyUnavailable(error)
        ? { ...previous, loading: false, refreshStatus: null, refreshError: true }
        : { key, mapSubscriptionTier: previous.key === key ? previous.mapSubscriptionTier : null,
          error: 'マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。' });
    } finally {
      if (mapLoad.current === controller) mapLoad.current = null;
    }
  }, [key, owner, reportId, month, recordRevision, snapshot]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', next => {
      if (next !== 'active' && !reportId) snapshot.current = null;
      setAppActive(next === 'active');
    });
    return () => listener.remove();
  }, [reportId, snapshot]);

  useEffect(() => {
    compareRef.current = false;
    setCompare(false);
    setAbout(false);
    setIfDialog(null);
    setMapCorrection(null);
    setCorrectionNotice(null);
  }, [key]);

  useEffect(() => {
    setIfDialog(previous => previous?.visible && previous.mode === 'create' && previous.scope !== displayedMapScope
      ? { ...previous, visible: false } : previous);
    setMapCorrection(previous => previous?.visible && previous.scope !== displayedMapScope
      ? { ...previous, visible: false } : previous);
  }, [displayedMapScope]);

  useEffect(() => {
    if (!planLoading && focused && appActive) {
      if (!reportId && canReuseCurrentMap(snapshot.current, key, recordRevision, statusRef.current)) {
        setState(snapshot.current.state);
      } else {
        if (!reportId && snapshot.current) setState({ key, loading: true });
        load(compareRef.current);
      }
    }
    return () => { request.current += 1; mapLoad.current?.abort(); };
  }, [load, planLoading, focused, appActive, reportId, snapshot, key, recordRevision]);

  useEffect(() => {
    if (reportId || planLoading || !focused || !appActive || !snapshot.current || mapLoad.current) return;
    if (canReuseCurrentMap(snapshot.current, key, recordRevision, currentMapStatus)) return;
    snapshot.current = null;
    setState({ key, loading: true });
    load(false, false, currentMapStatus?.hasContent === true);
  }, [currentMapStatus, reportId, planLoading, focused, appActive, snapshot, key, recordRevision, load]);

  useEffect(() => {
    if ((!focused && reportId) || !appActive) setState(previous => (previous.row?.map_plan_scoped || previous.now?.map_plan_scoped)
      && ['plus', 'premium'].includes(previous.mapSubscriptionTier)
      ? { key: previous.key, loading: true, mapSubscriptionTier: previous.mapSubscriptionTier } : previous);
  }, [focused, appActive, reportId]);

  useEffect(() => {
    if (!focused || !appActive || planLoading || state.key !== key || state.loading
        || (reportId && !compare) || !pendingRefresh(state.refreshStatus)) return undefined;
    const seq = request.current;
    let disposed = false, timer;
    const active = () => !disposed && currentKey.current === key && request.current === seq;
    const schedule = () => { timer = setTimeout(poll, REFRESH_POLL_MS); };
    const poll = async () => {
      const startedAt = Date.now();
      try {
        const data = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus, {
          expectedUserId: owner, headers: { 'Cache-Control': 'no-store' }, timeoutMs: 15000 });
        if (!active()) return;
        if (data?.status !== 'ok' || typeof data.has_visible_content !== 'boolean'
            || (data.version_key != null && typeof data.version_key !== 'string')) throw new Error('analysis_refresh_status_invalid');
        const refreshStatus = readRefreshStatus(data);
        const { tier: serverTier } = checkedMapAccess(data);
        if (serverTier && serverTier !== stateRef.current.mapSubscriptionTier) {
          setState({ key, loading: true, mapSubscriptionTier: serverTier });
          await load(compareRef.current, false, true);
          return;
        }
        const displayed = reportId ? stateRef.current.now : stateRef.current.row;
        const version = displayed?.content_json?.watashiMap?.projection_of || null;
        if ((data.version_key || null) !== version || (!!displayed !== data.has_visible_content)
            || !!displayed?.retained_previous !== (data.skip_reason === 'analysis_previous_map_retained')) {
          await load(compareRef.current, false, true);
          return;
        }
        const insufficient = !displayed && insufficientAnalysis(data);
        if (stateRef.current.refreshStatus !== refreshStatus || stateRef.current.insufficient !== insufficient || stateRef.current.refreshError) {
          const previous = stateRef.current;
          if (previous.key !== key) return;
          const next = { ...previous, insufficient, refreshStatus, refreshError: false };
          if (!reportId && !pendingRefresh(refreshStatus) && refreshStatus !== 'failed') {
            snapshot.current = { state: next, startedAt };
          }
          setState(next);
        }
        if (pendingRefresh(refreshStatus)) schedule();
      } catch (error) {
        if (!active()) return;
        if (!temporarilyUnavailable(error)) {
          request.current += 1;
          setState(previous => ({ key, mapSubscriptionTier: previous.mapSubscriptionTier,
            error: 'マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。' }));
          return;
        }
        setState(previous => previous.key === key ? { ...previous, refreshError: true } : previous);
        schedule();
      }
    };
    schedule();
    return () => { disposed = true; clearTimeout(timer); };
  }, [focused, appActive, planLoading, state.key, state.loading, state.refreshStatus, key, owner, reportId, compare, load, snapshot]);

  useEffect(() => {
    if (state.key !== key || state.semanticRestorePending || !state.row || planLoading || !focused || !appActive) return;
    if (reportId) {
      apiPost('/report-reads/mark', { report_id: state.row.id,
        report_table: 'analysis_observed_artifacts', report_scope: 'myprofile' },
      { expectedUserId: owner }).catch(() => {});
    } else if (typeof seenCallback.current === 'function') {
      const version = state.row.content_json.watashiMap.projection_of;
      const saved = snapshot.current;
      const sameSavedRow = saved?.state.key === key && saved.state.row?.id === state.row.id;
      if (state.recordRevision !== recordRevision || (sameSavedRow && saved.seen) ||
          (lastSeen.current?.key === key && lastSeen.current.version === version)) return;
      lastSeen.current = { key, version };
      if (sameSavedRow) saved.seen = true;
      try { Promise.resolve(seenCallback.current(version)).catch(() => {}); } catch {}
    }
  }, [state.key, state.semanticRestorePending, state.row, state.recordRevision, key, reportId, owner, planLoading,
    focused, appActive, snapshot, recordRevision]);

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

  const viewerTier = (state.key === key && state.mapSubscriptionTier) || tier;
  const showMapCorrection = SHOW_INTERPRETATION_CORRECTION && !reportId;
  const renderMap = row => row.content_json?.watashiMap?.wire_kind === 'watashi.map.v3'
      ? <SemanticWatashiMap key={`${key}:${mapScope(row)}`} contentJson={row.content_json}
          mapSubscriptionTier={row.map_plan_scoped ? row.map_subscription_tier : null} colors={colors} isDark={themeName === 'dark'}
          sectionFrame={ui.sectionFrame}
          onExploreIf={!reportId && !row.retained_previous && viewerTier === 'premium' ? branchRef => {
            const map = row.content_json.watashiMap;
            if (currentKey.current !== key || mapScope(stateRef.current.row) !== mapScope(row)) return;
            const target = map.nodes.find(node => node.node_ref === branchRef) || map.edges.find(edge => edge.edge_ref === branchRef);
            if (target) setIfDialog({ key, scope: mapScope(row), visible: true, mode: 'create', baseMapRef: map.projection_of,
              branchPointId: branchRef, branchLabel: target.title || target.label });
          } : undefined}
          onCorrectMap={showMapCorrection && !row.retained_previous ? (kind, targetRef) => {
            const map = row.content_json.watashiMap;
            if (currentKey.current !== key || mapScope(stateRef.current.row) !== mapScope(row)) return;
            setCorrectionNotice(null);
            setMapCorrection({ key, scope: mapScope(row), visible: true, projection: map, kind, targetRef,
              mapSubscriptionTier: row.map_plan_scoped ? row.map_subscription_tier : null });
          } : undefined} />
      : <WatashiMapV2Renderer key={`${key}:${row.id}`} contentJson={row.content_json} colors={colors} isDark={themeName === 'dark'} />;

  const renderMapDetails = row => <View>
    <Text style={[styles.meta, { color: ink }]}>分析日時：{dateLabel(row.generated_at)}</Text>
    {row.captured_at ? <Text style={[styles.meta, { color: ink }]}>月次保存日時：{dateLabel(row.captured_at)}</Text> : null}
    {coverage(row.content_json?.map_context, row.content_json?.watashiMap?.wire_kind === 'watashi.map.v3')}
  </View>;

  const savedCurrent = !reportId && snapshot.current;
  const superseded = savedCurrent && savedCurrent.state === state &&
    !canReuseCurrentMap(savedCurrent, key, recordRevision, currentMapStatus);
  const visible = state.key === key && !planLoading && appActive && !superseded &&
    (Boolean(reportId) || !state.row || state.recordRevision === recordRevision);
  const showCurrentStatus = !reportId || compare;
  const displayedCurrent = reportId ? state.now : state.row;
  const refreshing = showCurrentStatus && pendingRefresh(state.refreshStatus);
  const noAnalysis = showCurrentStatus && !displayedCurrent && state.insufficient && !state.loading && !refreshing;
  const emptyCurrentAnalysis = noAnalysis && !reportId;
  const refreshFailed = showCurrentStatus && state.refreshStatus === 'failed';
  const retryUpdate = !reportId && refreshFailed;
  const canRetry = refreshFailed || state.refreshError || state.error || state.comparisonFailed;
  const Container = embedded ? View : SafeAreaView;
  const Body = embedded ? View : ScrollView;
  return <Container {...(!embedded ? { edges: ['left', 'right'] } : {})}
    style={[embedded ? styles.embeddedRoot : styles.root, { backgroundColor: paper }]}>
    {!hideHeader ? <View style={styles.header}>
      <CocolonBackButton onPress={onBack} accessibilityLabel="わたしマップから戻る" />
      <Text style={[styles.title, { color: colors.TITLE_GOLD }]}>{reportId ? `${monthLabel(month)}のわたしマップ` : '今のわたしマップ'}</Text>
      <View style={{ width: 44 }} />
    </View> : null}
    {!reportId && !(visible && emptyCurrentAnalysis) ? renderLatestUpdateLabel?.(visible ? displayedCurrent?.generated_at : null) : null}
    <Body {...(embedded ? { style: [styles.body, styles.embeddedBody] } : { contentContainerStyle: styles.body })}>
      {visible && displayedCurrent?.retained_previous ? <Text style={[styles.meta, { color: ink }]}>前回の分析を表示しています。</Text> : null}
      {visible && state.row ? <>
        {compare ? <Text style={[styles.sectionTitle, { color: ink }]} accessibilityRole="header">当時：{monthLabel(month)}</Text> : null}
        {renderMap(state.row)}
        {compare && state.now ? <><Text style={[styles.sectionTitle, { color: ink }]} accessibilityRole="header">現在</Text>{renderMap(state.now)}</> : null}
        {reportId && !compare ? <Text style={[styles.meta, { color: ink }]}>{monthLabel(month)}に保存した当時のマップ</Text> : null}
        {reportId ? <CocolonButton variant="secondary" onPress={() => { setCompare(!compare); load(!compare); }}
          title={compare ? '当時のマップだけを見る' : '現在のマップと見比べる'} /> : null}
        {about ? <>
          {compare ? <Text style={[styles.sectionTitle, { color: ink }]} accessibilityRole="header">当時の分析について</Text> : null}
          {renderMapDetails(state.row)}
          {compare && state.now ? <>
            <Text style={[styles.sectionTitle, { color: ink }]} accessibilityRole="header">現在の分析について</Text>
            {renderMapDetails(state.now)}
          </> : null}
        </> : null}
      </> : null}
      {!visible || (state.loading && (!state.semanticRestorePending || compare)) ? <View style={{ gap: 12 }}>
        <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="保存したマップを取得しています" />
        <Text style={[styles.meta, { color: ink }]}>保存したマップを取得しています。</Text>
      </View> : null}
      {visible && refreshing ? <Text style={[styles.meta, { color: ink }]} accessibilityLiveRegion="polite">
        {reportId ? '現在の' : ''}わたしマップを更新中です。{displayedCurrent ? '保存したマップを先に表示しています。' : '更新が終わると表示されます。'}
      </Text> : null}
      {visible && (refreshFailed || state.refreshError) ? <Text style={styles.error} accessibilityRole="alert">
        {retryUpdate ? '更新結果を取得できませんでした。更新を再試行できます。'
          : refreshing ? '更新状況を取得できませんでした。引き続き確認します。'
            : '更新結果を取得できませんでした。再取得で確認できます。'}
      </Text> : null}
      {visible && state.error ? <Text style={styles.error} accessibilityRole="alert">{state.error}</Text> : null}
      {showMapCorrection && correctionNotice?.key === key ? <Text style={[styles.bodyText, { color: ink }]} accessibilityLiveRegion="polite">
        {correctionNotice.text}
      </Text> : null}
      {visible && noAnalysis ? <Text style={[styles.bodyText, { color: ink }]}>分析に必要な情報が足りていません。</Text> : null}
      {visible && state.empty && !state.loading && !refreshing && !emptyCurrentAnalysis ? <><Text style={[styles.bodyText, { color: ink }]}>現在表示できるわたしマップはありません。</Text>{about ? coverage(state.coverage) : null}</> : null}
      {visible && compare && state.comparisonUnavailable && !refreshing && !noAnalysis ? <Text style={[styles.bodyText, { color: ink }]} accessibilityRole={state.comparisonFailed ? 'alert' : undefined}>
        {state.comparisonFailed
          ? '現在のマップを取得できませんでした。当時のマップは保存されています。再取得で確認できます。'
          : '現在のマップはまだ表示できません。当時のマップは保存されています。'}
      </Text> : null}
      {visible && !emptyCurrentAnalysis && (state.row || state.empty) ? <CocolonButton variant="secondary" onPress={() => setAbout(!about)} title={about ? '分析について閉じる' : '分析について'} /> : null}
      {visible && !emptyCurrentAnalysis && about ? <Text style={[styles.meta, { color: ink }]}>{getWatashiMapHistoryRetentionLabel(viewerTier)}</Text> : null}
      {visible && !emptyCurrentAnalysis && about && onOpenGuide ? <CocolonButton variant="secondary" title="分析の使い方を見る" onPress={onOpenGuide} /> : null}
      {visible && !state.loading && !refreshing && canRetry ? <CocolonButton variant="secondary"
        onPress={() => load(compare, retryUpdate)}
        title={retryUpdate ? '更新を再試行' : '再取得'} /> : null}
      {!!owner && !planLoading && !reportId && viewerTier === 'premium' ? <CocolonButton variant="secondary"
        testID="analysis-if-saved-open" title="保存した関心の方向" onPress={() => setIfDialog({ key, visible: true, mode: 'saved' })} /> : null}
    </Body>
    <AnalysisIfRouteDialog visible={!!ifDialog?.visible && ifDialog.key === key && !planLoading && focused && appActive
        && viewerTier === 'premium' && (ifDialog.mode === 'saved' || ifDialog.scope === mapScope(state.row))}
      onClose={() => setIfDialog(previous => previous ? { ...previous, visible: false } : null)}
      ownerId={owner} tier={viewerTier} baseMapRef={ifDialog?.baseMapRef} branchPointId={ifDialog?.branchPointId}
      branchLabel={ifDialog?.branchLabel} mode={ifDialog?.mode} colors={colors} themeName={themeName} />
    {showMapCorrection ? <MapInterpretationCorrectionDialog
      visible={!!mapCorrection?.visible && mapCorrection.key === key && !planLoading && focused && appActive
        && mapCorrection.scope === mapScope(state.row)}
      onClose={() => setMapCorrection(previous => previous ? { ...previous, visible: false } : null)}
      onSaved={result => {
        if (currentKey.current !== key) return;
        setCorrectionNotice({ key, text: result.source_state === 'STALE'
          ? '訂正を保存しました。当時の読み取りへの説明として保持されています。'
          : result.refresh_status === 'failed'
            ? '訂正を保存しました。分析の更新結果を確認できませんでした。'
            : '訂正を保存しました。分析の更新が完了してから、読み直した結果を確認できます。' });
        load(compareRef.current, false, true);
      }}
      ownerId={owner} projection={mapCorrection?.projection} kind={mapCorrection?.kind} mapSubscriptionTier={mapCorrection?.mapSubscriptionTier}
      targetRef={mapCorrection?.targetRef} colors={colors} themeName={themeName} /> : null}
  </Container>;
}

function makeStyles(colors, ui) {
  return StyleSheet.create({
    root: { flex: 1 }, embeddedRoot: { alignSelf: 'stretch' },
    header: { padding: 20, gap: 8, flexDirection: 'row', alignItems: 'center' },
    title: { ...ui.typography.screenTitle, flex: 1, textAlign: 'center' },
    sectionTitle: { ...ui.typography.sectionTitle },
    body: { padding: 20, gap: 16, paddingBottom: 24, width: '100%', maxWidth: 680, alignSelf: 'center' },
    embeddedBody: { padding: 0, paddingBottom: 8 },
    meta: { ...ui.typography.meta }, bodyText: { ...ui.typography.body, color: colors.TEXT_ON_LIGHT },
    error: { ...ui.typography.description, color: colors.ERROR },
    notice: { padding: 16, gap: 8, borderWidth: 1, borderRadius: 16, borderColor: ui.sectionFrame?.borderColor ?? colors.CARD_BORDER, backgroundColor: colors.SURFACE_TONAL },
  });
}
