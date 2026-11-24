import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buildWatashiMapV2ViewModel, NODE_LABELS } from './watashiMapV2Contract';
import { readSemanticMapProjection } from './semanticMapContract';

export default function WatashiMapV2Renderer(props) {
  if (readSemanticMapProjection(props.contentJson)) {
    const SemanticWatashiMap = require('./SemanticWatashiMap').default;
    return <SemanticWatashiMap {...props} />;
  }
  return <LegacyWatashiMapV2Renderer {...props} />;
}

function LegacyWatashiMapV2Renderer({ contentJson, colors, isDark = false }) {
  const model = useMemo(() => buildWatashiMapV2ViewModel(contentJson), [contentJson]);
  const styles = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);
  const [expandedProjection, setExpandedProjection] = useState(null);
  if (!model) return (
    <View style={styles.card} accessibilityRole="alert">
      <Text style={styles.body}>この分析結果は表示できません。もう一度取得してください。</Text>
    </View>
  );
  const expanded = expandedProjection === model.projectionOf;
  return (
    <View style={styles.root} testID="watashi-map-v2">
      <Text style={styles.title} accessibilityRole="header">記録から見えるわたし</Text>
      <Text style={styles.subtle}>{model.periodLabel}</Text>
      <Text style={styles.subtle}>記録に書かれた内容をもとにしています。原因や未来の予測ではありません。</Text>
      <Text style={styles.body}>{model.text}</Text>
      <TouchableOpacity testID="watashi-map-v2-items-toggle" accessibilityRole="button"
        accessibilityState={{ expanded }} style={styles.itemsToggle}
        onPress={() => setExpandedProjection(expanded ? null : model.projectionOf)}>
        <Text style={styles.actionLabel}>{expanded ? '一覧を閉じる' : '項目を一覧で読む'}</Text>
      </TouchableOpacity>
      {expanded ? <LegacyWatashiMapV2Items model={model} styles={styles}
        showPeriodComparison={contentJson?.map_context?.profile !== 'cumulative.v1'} /> : null}
    </View>
  );
}

function LegacyWatashiMapV2Items({ model, styles, showPeriodComparison }) {
  return (
    <View style={styles.root}>
      <View style={styles.lane}>
        <Text style={styles.section} accessibilityRole="header">観測された内容</Text>
        {model.nodes.map((node) => (
          <View key={node.node_ref} style={styles.card}>
            <Text style={styles.kind}>{NODE_LABELS[node.node_kind]}</Text>
            <Text style={styles.body}>{node.visible_label}</Text>
            <Text style={styles.subtle}>{node.evidence_badge_count}件の記録</Text>
          </View>
        ))}
      </View>
      {model.edges.map((edge) => (
        <View key={edge.edge_ref} style={styles.card} accessible
          accessibilityLabel={`${edge.visible_label}。${edge.labels.join(edge.ordered ? '、その後、' : '、および、')}。${edge.ordered ? '原因は示していません。' : '順序や原因は確定していません。'}`}>
          <Text style={styles.kind}>{edge.visible_label}</Text>
          <View style={styles.connection} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {edge.labels.map((label, index) => (
              <React.Fragment key={`${edge.edge_ref}-${index}`}>
                {index > 0 ? <View style={styles.connector}>
                  <View style={styles.line} />
                  {edge.ordered ? <View style={styles.arrow} /> : null}
                </View> : null}
                <View style={styles.endpoint}><Text style={styles.body}>{label}</Text></View>
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.subtle}>{edge.ordered ? '原因を示す線ではありません。' : '順序や原因は確定していません。'}</Text>
        </View>
      ))}
      {model.annotations.map((badge) => <View style={styles.card} key={badge.annotation_ref}>
        <Text style={styles.kind}>{badge.kind === 'PROTECTIVE' ? '守る対象' : '負荷'}</Text>
        <Text style={styles.subtle}>関連する観測：{badge.targetLabel}</Text>
        <Text style={styles.body}>{badge.visible_label}</Text>
      </View>)}
      {model.unknownGaps.length ? <View style={[styles.card, styles.unknown]}>
        <Text style={styles.section} accessibilityRole="header">まだ確定していない部分</Text>
        {model.unknownGaps.map((gap) => <View key={gap.gap_ref} style={styles.gap}>
          <Text style={styles.subtle}>関連する観測：{gap.targetLabels.join(' ／ ')}</Text>
          <Text style={styles.body}>{gap.visible_label}</Text>
        </View>)}
      </View> : null}
      {model.conflicts.map((badge) => <View style={[styles.card, styles.unknown]} key={badge.conflict_ref}>
        <Text style={styles.kind}>一致していない記録</Text>
        <Text style={styles.subtle}>関連する観測：{badge.targetLabels.join(' ／ ')}</Text>
        <Text style={styles.body}>{badge.visible_label}</Text>
      </View>)}
      {!showPeriodComparison ? null : model.comparisonState === 'NO_PREVIOUS'
        ? <Text style={styles.subtle}>前の期間との比較はありません。</Text>
        : <View style={styles.card}>
          <Text style={styles.section} accessibilityRole="header">前の期間との比較</Text>
          {model.comparisonText.map((line, index) => <Text style={styles.body} key={index}>{line}</Text>)}
        </View>}
    </View>
  );
}

function makeStyles(colors, dark) {
  const ink = colors?.TEXT_ON_LIGHT || (dark ? '#f9fafb' : '#17212b');
  const muted = colors?.TEXT_SUBTLE || (dark ? '#cbd5e1' : '#526171');
  const border = colors?.CARD_BORDER || (dark ? '#64748b' : '#c4ced8');
  const paper = colors?.PANEL_BG || (dark ? '#17212b' : '#ffffff');
  return StyleSheet.create({
    root: { padding: 0, gap: 16 },
    title: { color: ink, fontSize: 22, lineHeight: 30, fontWeight: '600' },
    section: { color: ink, fontSize: 18, lineHeight: 26, fontWeight: '600', marginBottom: 8 },
    body: { color: ink, fontSize: 16, lineHeight: 27, fontWeight: '400' },
    subtle: { color: muted, fontSize: 14, lineHeight: 22, fontWeight: '400' },
    itemsToggle: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', paddingHorizontal: 4 },
    actionLabel: { color: colors?.TITLE_GOLD || ink, fontSize: 14, lineHeight: 23, fontWeight: '600' },
    kind: { color: muted, fontSize: 14, lineHeight: 22, fontWeight: '600', marginBottom: 5 },
    lane: { gap: 12 },
    card: { backgroundColor: paper, borderColor: border, borderWidth: 1, borderRadius: 24, padding: 20, gap: 8 },
    unknown: { backgroundColor: colors?.SURFACE_TONAL || paper },
    gap: { borderTopWidth: 1, borderColor: border, borderStyle: 'dashed', paddingTop: 8, marginTop: 8 },
    connection: { alignItems: 'stretch', paddingVertical: 6 },
    endpoint: { borderWidth: 1, borderColor: border, borderRadius: 8, padding: 10 },
    connector: { alignSelf: 'center', alignItems: 'center', height: 24 },
    line: { width: 2, height: 22, backgroundColor: border },
    arrow: { position: 'absolute', bottom: 1, width: 8, height: 8,
      borderBottomWidth: 2, borderRightWidth: 2, borderColor: border, transform: [{ rotate: '45deg' }] },
  });
}

