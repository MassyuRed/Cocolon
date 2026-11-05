import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../AuthContext';
import { useSubscription } from '../../SubscriptionContext';
import { useTheme } from '../../theme/ThemeContext';
import { apiGet, apiPost } from '../../lib/apiClient';
import { SELF_STRUCTURE_WIRE, buildSelfStructureReportDetailPath, buildSelfStructureEvidencePath } from '../../lib/compat/legacyWireContracts';
import { getWatashiMapHistoryRetentionLabel } from './watashiMapAccessPolicy';
import WatashiMapV2Renderer from './WatashiMapV2Renderer';
import { checkedMapRow, checkedCurrentResult } from './cumulativeMapContract';

const dateLabel = value => value ? new Date(value).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '';
const monthLabel = value => value ? `${value.slice(0, 4)}年${Number(value.slice(5, 7))}月` : '';
export default function CumulativeWatashiMapView({ reportId = null, month = null, onBack, onLatestSeenVersion, embedded = false, hideHeader = false }) {
  const { session } = useAuth();
  const { tier, loading: planLoading } = useSubscription();
  const { colors, themeName } = useTheme();
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
  const ink = colors?.TEXT_ON_LIGHT || '#17212b';
  const paper = colors?.BG_SILVER || '#fff';

  const load = useCallback(async (withCurrent = false) => {
    const seq = ++request.current;
    evidenceRequest.current += 1;
    setState({ key, loading: true });
    setEvidence(null);
    if (!owner) { setState({ key, error: 'ログインしてから、もう一度開いてください。' }); return; }
    const active = () => currentKey.current === key && request.current === seq;
    try {
      let row, now = null, comparisonFailed = false;
      if (reportId) {
        const data = await apiGet(buildSelfStructureReportDetailPath(reportId, month), { expectedUserId: owner });
        if (!active()) return;
        row = checkedMapRow(data?.item);
        if (row.id !== reportId || (month && row.snapshot_month !== month)) throw new Error('analysis_month_mismatch');
      } else {
        const data = await apiGet(`${SELF_STRUCTURE_WIRE.routes.latest}?ensure=true`, { expectedUserId: owner, timeoutMs: 60000 });
        if (!active()) return;
        row = checkedCurrentResult(data);
        if (!row) {
          if (active()) setState({ key, empty: true, insufficient: data.reason === 'insufficient_input', coverage: data?.map_context });
          return;
        }
      }
      if (withCurrent && reportId) {
        try {
          const data = await apiGet(`${SELF_STRUCTURE_WIRE.routes.latest}?ensure=true`, { expectedUserId: owner, timeoutMs: 60000 });
          if (!active()) return;
          now = checkedCurrentResult(data);
        } catch (error) {
          if (!active()) return;
          const status = Number(error?.status);
          const temporarilyUnavailable = (Number.isInteger(status) && status >= 500 && status <= 599)
            || error?.name === 'TimeoutError'
            || (error?.name === 'TypeError' && /network|fetch/i.test(String(error?.message || '')));
          if (!temporarilyUnavailable) throw error;
          comparisonFailed = true;
        }
      }
      if (active()) {
        setState({ key, row, now, comparisonUnavailable: withCurrent && !now, comparisonFailed });
      }
    } catch {
      if (active()) setState({ key, error: 'マップを取得できませんでした。通信状況や現在の閲覧範囲を確認して、再取得してください。' });
    }
  }, [key, owner, reportId, month]);

  useEffect(() => {
    setCompare(false);
    setEvidence(null);
    if (!planLoading) load(false);
    return () => { request.current += 1; evidenceRequest.current += 1; };
  }, [load, planLoading]);

  useEffect(() => {
    if (state.key !== key || !state.row || planLoading) return;
    if (reportId) {
      apiPost('/report-reads/mark', { report_id: state.row.id,
        report_table: 'analysis_observed_artifacts', report_scope: 'myprofile' },
      { expectedUserId: owner }).catch(() => {});
    } else if (typeof seenCallback.current === 'function') {
      try { Promise.resolve(seenCallback.current(state.row.content_json.watashiMap.projection_of)).catch(() => {}); } catch {}
    }
  }, [state, key, reportId, owner, planLoading]);

  const showEvidence = useCallback(async (row, nodeRef) => {
    const seq = ++evidenceRequest.current;
    setEvidence({ key, loading: true });
    try {
      const data = await apiGet(buildSelfStructureEvidencePath(row.id, nodeRef, row.snapshot_month), { expectedUserId: owner });
      if (currentKey.current === key && evidenceRequest.current === seq) setEvidence({ key, items: data?.items || [] });
    } catch {
      if (currentKey.current === key && evidenceRequest.current === seq) setEvidence({ key, error: true });
    }
  }, [key, owner]);
  const closeEvidence = () => { evidenceRequest.current += 1; setEvidence(null); };

  const coverage = value => value ? <View style={styles.notice}>
    <Text style={{ color: ink }}>対象：感情入力の記録{value.source_count}件と、その本人補足。構造に反映できた記録：{value.mapped_count}件。</Text>
    {value.unparsed_count || value.excluded_count ? <Text style={{ color: ink }}>
      未解析の範囲があります（全体または一部を読み取れていない記録{value.unparsed_count}件、通常分析の対象外{value.excluded_count}件）。
    </Text> : null}
    {value.stale_supplement_count ? <Text style={{ color: ink }}>編集前の入力に結び付いた補足は、現在の入力の説明には使用していません（{value.stale_supplement_count}件）。</Text> : null}
  </View> : null;

  const renderMap = row => <View>
    <Text style={[styles.meta, { color: ink }]}>分析日時：{dateLabel(row.generated_at)}</Text>
    {row.captured_at ? <Text style={[styles.meta, { color: ink }]}>月次保存日時：{dateLabel(row.captured_at)}</Text> : null}
    {coverage(row.content_json?.map_context)}
    <WatashiMapV2Renderer contentJson={row.content_json} colors={colors} isDark={themeName === 'dark'}
      onOpenEvidence={node => showEvidence(row, node)} />
  </View>;

  const visible = state.key === key && !planLoading;
  const Container = embedded ? View : SafeAreaView;
  return <Container style={[styles.root, { backgroundColor: paper }]}>
    {!hideHeader ? <View style={styles.header}>
      <TouchableOpacity onPress={onBack} accessibilityRole="button"><Text style={[styles.action, { color: ink }]}>閉じる</Text></TouchableOpacity>
      <Text style={[styles.title, { color: ink }]}>{reportId ? `${monthLabel(month)}のわたしマップ` : '今のわたしマップ'}</Text>
    </View> : null}
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={[styles.meta, { color: ink }]}>{getWatashiMapHistoryRetentionLabel(tier)}</Text>
      {!visible || state.loading ? <ActivityIndicator accessibilityLabel="マップを読み込んでいます" /> : null}
      {visible && state.error ? <Text style={{ color: ink }} accessibilityRole="alert">{state.error}</Text> : null}
      {visible && state.empty ? <><Text style={{ color: ink }}>{state.insufficient ? '入力情報から構造を十分に読み取れていないため、まだマップを表示できません。' : '現在表示できるわたしマップはありません。'}</Text>{coverage(state.coverage)}</> : null}
      {visible && state.row ? <>
        {reportId ? <Text style={[styles.meta, { color: ink }]}>その月に保存した当時の分析です。現在の内容で書き換えていません。</Text> :
          <Text style={[styles.meta, { color: ink }]}>これまでの入力全体から、構造とルートを確認できます。現在のマップの内容は全プラン共通です。</Text>}
        {reportId ? <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={() => { setCompare(!compare); load(!compare); }}>
          <Text style={[styles.action, { color: ink }]}>{compare ? '当時のマップだけを見る' : '現在のマップと見比べる'}</Text>
        </TouchableOpacity> : null}
        {compare ? <Text style={[styles.title, { color: ink }]}>当時：{monthLabel(month)}</Text> : null}
        {renderMap(state.row)}
        {compare && state.now ? <><Text style={[styles.title, { color: ink }]}>現在</Text>{renderMap(state.now)}</> : null}
        {compare && state.comparisonUnavailable ? <Text style={{ color: ink }} accessibilityRole={state.comparisonFailed ? 'alert' : undefined}>
          {state.comparisonFailed
            ? '現在のマップを取得できませんでした。当時のマップは保存されています。再取得で確認できます。'
            : '現在のマップはまだ表示できません。当時のマップは保存されています。'}
        </Text> : null}
      </> : null}
      {visible && !state.loading ? <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={() => load(compare)}>
        <Text style={[styles.action, { color: ink }]}>再取得</Text>
      </TouchableOpacity> : null}
    </ScrollView>
    <Modal visible={!!evidence && evidence.key === key} transparent animationType="fade" onRequestClose={closeEvidence}>
      <SafeAreaProvider><SafeAreaView style={styles.overlay}><View style={[styles.dialog, { backgroundColor: paper }]}>
        <Text style={[styles.title, { color: ink }]}>根拠の記録</Text>
        <ScrollView>
          {evidence?.loading ? <ActivityIndicator /> : null}
          {evidence?.error ? <Text style={{ color: ink }}>記録を取得できませんでした。</Text> : null}
          {evidence?.items?.map(item => <View key={item.id} style={styles.notice}>
            <Text style={[styles.meta, { color: ink }]}>{dateLabel(item.created_at)}</Text>
            {item.version_state !== 'CURRENT' ? <Text style={{ color: ink }}>この記録は分析後に編集されています。以下は現在の内容です。</Text> : null}
            {item.memo ? <Text style={[styles.record, { color: ink }]}>{item.memo}</Text> : null}
            {item.memo_action ? <Text style={[styles.record, { color: ink }]}>{item.memo_action}</Text> : null}
            {item.answers?.map((answer, index) => <Text key={index} style={[styles.record, { color: ink }]}>補足：{answer}</Text>)}
          </View>)}
        </ScrollView>
        <TouchableOpacity style={styles.button} accessibilityRole="button" onPress={closeEvidence}><Text style={[styles.action, { color: ink }]}>閉じる</Text></TouchableOpacity>
      </View></SafeAreaView></SafeAreaProvider>
    </Modal>
  </Container>;
}

const styles = StyleSheet.create({
  root: { flex: 1 }, header: { padding: 16, gap: 12 }, title: { fontSize: 19, fontWeight: '700' },
  body: { padding: 16, gap: 16, paddingBottom: 40 }, meta: { fontSize: 13, lineHeight: 21 },
  action: { fontSize: 16, fontWeight: '600' }, button: { padding: 14, borderWidth: 1, borderColor: '#9ca3af', borderRadius: 10, alignItems: 'center' },
  notice: { padding: 12, gap: 8, borderBottomWidth: 1, borderColor: '#9ca3af' }, record: { fontSize: 16, lineHeight: 25 },
  overlay: { flex: 1, backgroundColor: '#0008', padding: 20, justifyContent: 'center' },
  dialog: { maxHeight: '90%', padding: 16, borderRadius: 16, gap: 12 },
});
