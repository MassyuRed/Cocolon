import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { buildWatashiMapV2ViewModel, NODE_LABELS } from './watashiMapV2Contract';

export default function WatashiMapV2Renderer({ contentJson, colors, isDark = false }) {
  const model = useMemo(() => buildWatashiMapV2ViewModel(contentJson), [contentJson]);
  const styles = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);
  if (!model) return (
    <View style={styles.card} accessibilityRole="alert">
      <Text style={styles.body}>この分析結果は表示できません。もう一度取得してください。</Text>
    </View>
  );
  return (
    <View style={styles.root} testID="watashi-map-v2">
      <Text style={styles.title} accessibilityRole="header">記録から見えるわたし</Text>
      <Text style={styles.subtle}>{model.periodLabel}</Text>
      <Text style={styles.subtle}>記録に書かれた内容をもとにしています。原因や未来の予測ではありません。</Text>
      <View style={styles.lane}>
        <Text style={styles.section} accessibilityRole="header">観測された内容</Text>
        {model.nodes.map((node) => (
          <View key={node.node_ref} style={styles.card} accessible
            accessibilityLabel={`${NODE_LABELS[node.node_kind]}。${node.visible_label}。${node.evidence_badge_count}件の記録。`}>
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
        <Text style={styles.kind}>{badge.kind === 'PROTECTIVE' ? '守っているもの' : '負荷'}</Text>
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
      <Text style={styles.subtle}>{model.comparisonState === 'NO_PREVIOUS'
        ? '前の期間との比較はありません。' : model.comparisonState === 'NOT_COMPARABLE'
          ? 'この期間は前回と比較できません。' : '前の期間と比較できる条件を満たしています。'}</Text>
      <View style={styles.card}>
        <Text style={styles.section} accessibilityRole="header">文章で読む</Text>
        <Text style={styles.body}>{model.text}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors, dark) {
  const ink = colors?.TEXT_ON_LIGHT || (dark ? '#f9fafb' : '#17212b');
  const muted = colors?.TEXT_SUBTLE || (dark ? '#cbd5e1' : '#526171');
  const border = colors?.CARD_BORDER || (dark ? '#64748b' : '#c4ced8');
  const paper = colors?.PANEL_BG || (dark ? '#17212b' : '#ffffff');
  return StyleSheet.create({
    root: { padding: 12, gap: 12 },
    title: { color: ink, fontSize: 21, fontWeight: '700' },
    section: { color: ink, fontSize: 16, fontWeight: '700', marginBottom: 8 },
    body: { color: ink, fontSize: 16, lineHeight: 25 },
    subtle: { color: muted, fontSize: 13, lineHeight: 20 },
    kind: { color: muted, fontSize: 13, fontWeight: '700', marginBottom: 5 },
    lane: { borderLeftWidth: 3, borderColor: border, paddingLeft: 12, gap: 8 },
    card: { backgroundColor: paper, borderColor: border, borderWidth: 1, borderRadius: 12, padding: 14, gap: 5 },
    unknown: { borderStyle: 'dashed' },
    gap: { borderTopWidth: 1, borderColor: border, borderStyle: 'dashed', paddingTop: 8, marginTop: 8 },
    connection: { alignItems: 'stretch', paddingVertical: 6 },
    endpoint: { borderWidth: 1, borderColor: border, borderRadius: 8, padding: 10 },
    connector: { alignSelf: 'center', alignItems: 'center', height: 24 },
    line: { width: 2, height: 22, backgroundColor: border },
    arrow: { position: 'absolute', bottom: 1, width: 8, height: 8,
      borderBottomWidth: 2, borderRightWidth: 2, borderColor: border, transform: [{ rotate: '45deg' }] },
  });
}
