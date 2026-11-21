import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { buildSemanticMapLayout, readSemanticMapProjection } from './semanticMapContract';
import { MODAL_ORIENTATIONS } from '../../ui/uiTokens';

export default function SemanticWatashiMap({ contentJson, colors, isDark = false, onOpenEvidence, onExploreIf, onCorrectMap }) {
  const projection = useMemo(() => readSemanticMapProjection(contentJson), [contentJson]);
  const [width, setWidth] = useState(340);
  const [selection, setSelection] = useState(null);
  const [linear, setLinear] = useState(false);
  const pendingEvidence = useRef(null);
  const currentProjection = useRef(projection?.projection_of);
  const evidenceCallback = useRef(onOpenEvidence);
  const ifCallback = useRef(onExploreIf), correctionCallback = useRef(onCorrectMap);
  const mounted = useRef(true);
  currentProjection.current = projection?.projection_of;
  evidenceCallback.current = onOpenEvidence;
  ifCallback.current = onExploreIf;
  correctionCallback.current = onCorrectMap;
  const styles = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);
  const layout = useMemo(() => projection ? buildSemanticMapLayout(projection, width) : null, [projection, width]);
  useEffect(() => { pendingEvidence.current = null; setSelection(null); setLinear(false); }, [projection?.projection_of]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; pendingEvidence.current = null; };
  }, []);
  if (!projection || !layout) return null;
  const chosen = selection?.projectionOf === projection.projection_of
    ? (selection.kind === 'overview' ? projection.overview
      : selection.kind === 'node' ? projection.nodes.find(n => n.node_ref === selection.ref)
      : projection.edges.find(e => e.edge_ref === selection.ref)) : null;
  const choose = (kind, ref) => {
    pendingEvidence.current = null;
    setSelection({ projectionOf: projection.projection_of, kind, ref });
  };
  const nodeName = ref => projection.nodes.find(n => n.node_ref === ref)?.title || '';
  const accent = colors?.TITLE_GOLD || '#800020';
  const dismissDetail = () => { pendingEvidence.current = null; setSelection(null); };
  const detailDismissed = () => {
    const pending = pendingEvidence.current;
    pendingEvidence.current = null;
    if (mounted.current && pending && pending.projectionOf === currentProjection.current) {
      if (pending.action === 'if') ifCallback.current?.(pending.targetRef);
      else if (pending.action === 'correction') correctionCallback.current?.(pending.kind, pending.targetRef);
      else evidenceCallback.current?.(pending.nodeRef);
    }
  };
  const openEvidence = ref => {
    // UIKit cannot present the parent's evidence modal during this modal's
    // dismissal. iOS provides onDismiss after that native transition finishes.
    pendingEvidence.current = Platform?.OS === 'ios'
      ? { projectionOf: projection.projection_of, nodeRef: ref } : null;
    setSelection(null);
    // Android has no onDismiss contract, so preserve its direct handoff.
    if (Platform?.OS !== 'ios') evidenceCallback.current?.(ref);
  };
  const openParentAction = (action, kind, ref) => {
    pendingEvidence.current = Platform?.OS === 'ios'
      ? { projectionOf: projection.projection_of, action, kind, targetRef: ref } : null;
    setSelection(null);
    if (Platform?.OS !== 'ios') {
      if (action === 'if') ifCallback.current?.(ref);
      else correctionCallback.current?.(kind, ref);
    }
  };
  return <View testID="watashi-map-v3" style={styles.root}>
    <View style={styles.intro}>
      <Text style={styles.eyebrow}>記録をつないで見えること</Text>
      <Text style={styles.title} accessibilityRole="header">{projection.overview.title}</Text>
      <Text style={styles.overview} numberOfLines={3}>{projection.overview.summary}</Text>
      <TouchableOpacity testID="semantic-overview-open" accessibilityRole="button"
        style={styles.secondaryAction} onPress={() => choose('overview', 'overview')}>
        <Text style={styles.actionLabel}>全体の読みを開く</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.hint}>気になるところや線のことばをタップすると、詳しく読めます。</Text>
    <View testID="semantic-map-graph" style={styles.canvasShell} onLayout={event => {
      const next = event.nativeEvent.layout.width;
      if (Number.isFinite(next) && next >= 280 && Math.abs(next - width) >= 1) setWidth(next);
    }}>
      <View style={{ width: '100%', height: layout.height }}>
        <Svg width="100%" height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={StyleSheet.absoluteFill} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {layout.edges.map(edge => <Path key={edge.edge_ref} d={edge.path} fill="none"
            stroke={accent} strokeWidth={1.7} opacity={0.5}
            strokeDasharray={edge.relation_kind === 'SELF_OUTSIDE_GAP' || edge.relation_kind === 'CONTEXT_CONTRAST' ? '5 5' : undefined} />)}
        </Svg>
        {layout.nodes.map(node => <TouchableOpacity key={node.node_ref} testID={`semantic-node-${node.node_ref}`}
          accessibilityRole="button" accessibilityLabel={`${node.title}。${node.summary}。詳しい説明を開く`}
          onPress={() => choose('node', node.node_ref)} style={[styles.node, {
            left: node.box.x, top: node.box.y, width: node.box.width, height: node.box.height },
            node.perspective === 'OBSERVED_INTERACTION' ? styles.outsideNode : null]}>
          <Text style={styles.nodeTitle} numberOfLines={3} maxFontSizeMultiplier={1.2}>{node.title}</Text>
          <Text style={styles.openHint} maxFontSizeMultiplier={1.2}>詳しく見る</Text>
        </TouchableOpacity>)}
        {layout.edges.map(edge => <TouchableOpacity key={edge.edge_ref} testID={`semantic-edge-${edge.edge_ref}`}
          accessibilityRole="button" accessibilityLabel={`${nodeName(edge.from_ref)}と${nodeName(edge.to_ref)}：${edge.label}。関係の説明を開く`}
          onPress={() => choose('edge', edge.edge_ref)} style={[styles.relation, {
            left: edge.labelBox.x, top: edge.labelBox.y, width: edge.labelBox.width, height: edge.labelBox.height }]}>
          <Text style={styles.relationText} numberOfLines={2} maxFontSizeMultiplier={1.2}>{edge.label}</Text>
        </TouchableOpacity>)}
      </View>
    </View>
    <TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: linear }}
      style={styles.secondaryAction} onPress={() => setLinear(!linear)}>
      <Text style={styles.actionLabel}>{linear ? '一覧を閉じる' : '項目を一覧で読む'}</Text>
    </TouchableOpacity>
    {linear ? <View style={styles.linear}>
      {projection.accessibility_linear_order.map(ref => {
        const node = projection.nodes.find(n => n.node_ref === ref);
        return <TouchableOpacity key={ref} accessibilityRole="button" style={styles.linearItem} onPress={() => choose('node', ref)}>
          <Text style={styles.sectionTitle}>{node.title}</Text><Text style={styles.body}>{node.summary}</Text>
        </TouchableOpacity>;
      })}
      {projection.edges.map(edge => <TouchableOpacity key={edge.edge_ref} accessibilityRole="button"
        style={styles.linearItem} onPress={() => choose('edge', edge.edge_ref)}>
        <Text style={styles.sectionTitle}>{edge.label}</Text>
        <Text style={styles.body}>{nodeName(edge.from_ref)} ／ {nodeName(edge.to_ref)}</Text>
      </TouchableOpacity>)}
    </View> : null}
    <Modal visible={!!chosen} transparent animationType="fade" onRequestClose={dismissDetail} onDismiss={detailDismissed}
      supportedOrientations={MODAL_ORIENTATIONS}>
      <SafeAreaProvider><SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.overlay}>
        <View style={styles.dialog} accessibilityViewIsModal>
          <View style={styles.dialogHeader}>
            <Text style={[styles.sectionTitle, { flex: 1 }]} accessibilityRole="header">{selection?.kind === 'edge' ? chosen?.label : chosen?.title}</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="詳しい説明を閉じる"
              onPress={dismissDetail} style={styles.close}><Text style={styles.closeText}>閉じる</Text></TouchableOpacity>
          </View>
          <ScrollView key={`${projection.projection_of}:${selection?.kind}:${selection?.ref}`} contentContainerStyle={styles.detailBody}>
            {selection?.kind === 'edge' && chosen ? <Text style={styles.context}>{nodeName(chosen.from_ref)} ／ {nodeName(chosen.to_ref)}</Text> : null}
            {selection?.kind === 'node' && chosen ? <>
              <Text style={styles.summary}>{chosen.summary}</Text>
            </> : null}
            <Text style={styles.body}>{selection?.kind === 'overview' ? chosen?.summary : chosen?.explanation}</Text>
            {selection?.kind === 'overview' ? <View style={styles.relatedNodes}>
              <Text style={styles.sectionTitle}>地図の項目</Text>
              {projection.accessibility_linear_order.map(ref => <TouchableOpacity key={ref}
                testID={`semantic-overview-node-${ref}`} accessibilityRole="button" style={styles.evidenceButton}
                onPress={() => choose('node', ref)}><Text style={styles.evidenceText}>{nodeName(ref)}</Text></TouchableOpacity>)}
            </View> : null}
            {selection?.kind === 'node' && chosen?.unknowns.length ? <View style={styles.unknown}>
              <Text style={styles.sectionTitle}>この記録では決められないこと</Text>
              {chosen.unknowns.map((item, index) => <Text key={index} style={styles.body}>{item}</Text>)}
            </View> : null}
            {selection?.kind === 'node' && chosen && onOpenEvidence ? <TouchableOpacity accessibilityRole="button"
              style={styles.evidenceButton} onPress={() => openEvidence(chosen.node_ref)}>
              <Text style={styles.evidenceText}>根拠の記録を見る</Text>
            </TouchableOpacity> : null}
            {selection?.kind === 'edge' && chosen && onOpenEvidence ? [chosen.from_ref, chosen.to_ref].map(ref =>
              <TouchableOpacity key={ref} accessibilityRole="button" style={styles.evidenceButton}
                onPress={() => openEvidence(ref)}><Text style={styles.evidenceText}>{nodeName(ref)}の根拠を見る</Text></TouchableOpacity>) : null}
            {chosen && ['node', 'edge'].includes(selection?.kind) && onExploreIf ? <TouchableOpacity
              testID="semantic-if-open" accessibilityRole="button" style={styles.evidenceButton}
              onPress={() => openParentAction('if', selection.kind, selection.ref)}>
              <Text style={styles.evidenceText}>この分岐を考える</Text>
            </TouchableOpacity> : null}
            {chosen && onCorrectMap ? <TouchableOpacity testID="semantic-correction-open" accessibilityRole="button"
              style={styles.evidenceButton} onPress={() => openParentAction('correction', selection.kind, selection.ref)}>
              <Text style={styles.evidenceText}>この読み取りを訂正する</Text>
            </TouchableOpacity> : null}
          </ScrollView>
        </View>
      </SafeAreaView></SafeAreaProvider>
    </Modal>
  </View>;
}

function makeStyles(colors, dark) {
  const ink = colors?.TEXT_ON_LIGHT || (dark ? '#F9F5EC' : '#17212B');
  const muted = colors?.TEXT_SUBTLE || (dark ? '#D2C7C2' : '#756C66');
  const paper = colors?.PANEL_BG || (dark ? '#20232A' : '#FFFFFF');
  const accent = colors?.TITLE_GOLD || '#800020';
  const tonal = colors?.SURFACE_TONAL || (dark ? '#39232C' : '#EFE1DD');
  const border = colors?.CARD_BORDER || '#D7D2C9';
  return StyleSheet.create({
    root: { gap: 14 }, intro: { gap: 12, paddingTop: 8 },
    eyebrow: { color: muted, fontSize: 13, lineHeight: 21 },
    title: { color: ink, fontSize: 23, lineHeight: 34, fontWeight: '600' },
    overview: { color: ink, fontSize: 16, lineHeight: 28 },
    hint: { color: muted, fontSize: 13, lineHeight: 22 },
    canvasShell: { backgroundColor: tonal, borderRadius: 28, overflow: 'hidden' },
    node: { position: 'absolute', borderWidth: 1.5, borderColor: accent, borderRadius: 20,
      backgroundColor: paper, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', gap: 3 },
    outsideNode: { borderStyle: 'dashed' },
    nodeTitle: { color: ink, fontSize: 14, lineHeight: 19, fontWeight: '600', textAlign: 'center' },
    openHint: { color: muted, fontSize: 10, lineHeight: 14 },
    relation: { position: 'absolute', minHeight: 44, borderWidth: 1, borderColor: border,
      borderRadius: 18, backgroundColor: paper, paddingHorizontal: 9, alignItems: 'center', justifyContent: 'center' },
    relationText: { color: accent, fontSize: 12, lineHeight: 17, textAlign: 'center', fontWeight: '600' },
    secondaryAction: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', paddingHorizontal: 4 },
    actionLabel: { color: accent, fontSize: 14, lineHeight: 23, fontWeight: '600' },
    linear: { gap: 8 }, linearItem: { minHeight: 44, paddingVertical: 12, borderBottomWidth: 1, borderColor: border, gap: 5 },
    sectionTitle: { color: ink, fontSize: 17, lineHeight: 27, fontWeight: '600' },
    body: { color: ink, fontSize: 16, lineHeight: 28 }, summary: { color: ink, fontSize: 17, lineHeight: 29, fontWeight: '500' },
    context: { color: muted, fontSize: 13, lineHeight: 23 },
    overlay: { flex: 1, backgroundColor: 'rgba(20,12,15,0.48)', justifyContent: 'center', padding: 20 },
    dialog: { backgroundColor: paper, borderRadius: 26, maxHeight: '92%', padding: 20, flexShrink: 1 },
    dialogHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingBottom: 12 },
    close: { minWidth: 48, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    closeText: { color: accent, fontSize: 14, fontWeight: '600' },
    detailBody: { gap: 18, paddingBottom: 8 },
    relatedNodes: { gap: 10 },
    unknown: { backgroundColor: tonal, padding: 16, borderRadius: 18, gap: 10 },
    evidenceButton: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: tonal, borderRadius: 24, justifyContent: 'center' },
    evidenceText: { color: accent, fontSize: 15, lineHeight: 24, fontWeight: '600', textAlign: 'center' },
  });
}
