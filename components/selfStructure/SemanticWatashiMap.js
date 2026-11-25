import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { buildSemanticMapLayout, readSemanticMapProjection } from './semanticMapContract';
import { MODAL_ORIENTATIONS } from '../../ui/uiTokens';

const scopeLabels = {
  across_records: 'いくつかの場面に共通すること',
  self_report: 'ご自身が気づいたこと',
  in_this_record: 'この場面から見えること',
};

function StructureRelations({ structures, relations, styles }) {
  if (!relations?.length) return null;
  return <View testID="semantic-structure-relations" style={styles.structure}>
    <Text accessibilityRole="header" style={styles.sectionTitle}>選び方のつながり</Text>
    {relations.map(({ kind, first_index, second_index, description }, index) => {
      const first = structures[first_index].title;
      const second = structures[second_index].title;
      const priority = kind === 'PRIORITY';
      const label = priority ? '優先' : '両立';
      return <View key={`${kind}:${first_index}:${second_index}:${index}`} style={styles.structureRelation}>
        <Text style={styles.body}>{description}</Text>
        <View style={styles.structureDiagram} accessible accessibilityLabel={priority
          ? `${first}を${second}より優先した関係` : `${first}と${second}が両立した関係`}>
          <View style={styles.structureNode}>
            {priority ? <Text style={styles.eyebrow}>優先したこと</Text> : null}
            <Text style={styles.structureNodeTitle}>{first}</Text>
          </View>
          <View style={styles.structureLink}><Text style={styles.actionLabel}>{label}</Text></View>
          <View style={styles.structureNode}><Text style={styles.structureNodeTitle}>{second}</Text></View>
        </View>
      </View>;
    })}
  </View>;
}

function SemanticMapDiagram({ projection, nodeRefs, colors, styles, choose, compact = false }) {
  const [width, setWidth] = useState(340);
  const layout = useMemo(() => buildSemanticMapLayout({
    nodes: projection.nodes.filter(node => nodeRefs.includes(node.node_ref)),
    edges: projection.edges.filter(edge => nodeRefs.includes(edge.from_ref) && nodeRefs.includes(edge.to_ref)),
    accessibility_linear_order: projection.accessibility_linear_order.filter(ref => nodeRefs.includes(ref)),
  }, width), [projection, nodeRefs, width]);
  const nodeName = ref => projection.nodes.find(node => node.node_ref === ref)?.title || '';
  const accent = colors?.TITLE_GOLD || '#800020';
  const Target = choose ? TouchableOpacity : View;
  const targetProps = (kind, ref, label) => choose
    ? { accessibilityRole: 'button', accessibilityLabel: label, onPress: () => choose(kind, ref) }
    : { accessible: true, accessibilityLabel: label };
  const canvas = <View style={{ width: layout.width, height: layout.height }}>
        <Svg width="100%" height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`}
          style={StyleSheet.absoluteFill} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {layout.edges.map(edge => <Path key={edge.edge_ref} d={edge.path} fill="none"
            stroke={accent} strokeWidth={1.7} opacity={0.5}
            strokeDasharray={edge.relation_kind === 'SELF_OUTSIDE_GAP' || edge.relation_kind === 'CONTEXT_CONTRAST' ? '5 5' : undefined} />)}
        </Svg>
        {layout.nodes.map(node => <Target key={node.node_ref} testID={`semantic-node-${node.node_ref}`}
          {...targetProps('node', node.node_ref, compact ? `${node.title}${choose ? '。読み取りを訂正する' : ''}`
            : `${node.title}。${node.summary}。詳しい説明を開く`)} style={[styles.node, {
            left: node.box.x, top: node.box.y, width: node.box.width, height: node.box.height },
            node.perspective === 'OBSERVED_INTERACTION' ? styles.outsideNode : null]}>
          <Text style={styles.nodeTitle} numberOfLines={3} maxFontSizeMultiplier={1.2}>{node.title}</Text>
          {!compact ? <Text style={styles.openHint} maxFontSizeMultiplier={1.2}>詳しく見る</Text> : null}
        </Target>)}
        {layout.edges.map(edge => <Target key={edge.edge_ref} testID={`semantic-edge-${edge.edge_ref}`}
          {...targetProps('edge', edge.edge_ref, `${nodeName(edge.from_ref)}と${nodeName(edge.to_ref)}：${edge.label}${compact
            ? (choose ? '。読み取りを訂正する' : '') : '。関係の説明を開く'}`)} style={[styles.relation, {
            left: edge.labelBox.x, top: edge.labelBox.y, width: edge.labelBox.width, height: edge.labelBox.height }]}>
          <Text style={styles.relationText} numberOfLines={2} maxFontSizeMultiplier={1.2}>{edge.label}</Text>
        </Target>)}
      </View>;
  return <View testID="semantic-map-graph" style={styles.canvasShell} onLayout={event => {
      const next = Math.floor(event.nativeEvent.layout.width);
      if (Number.isFinite(next) && next > 0) setWidth(next);
    }}>
      {width < layout.width ? <ScrollView horizontal>{canvas}</ScrollView> : canvas}
    </View>;
}

export default function SemanticWatashiMap({ contentJson, mapSubscriptionTier = null, colors, isDark = false, onExploreIf, onCorrectMap }) {
  const projection = useMemo(() => readSemanticMapProjection(contentJson, mapSubscriptionTier), [contentJson, mapSubscriptionTier]);
  const [expandedStructure, setExpandedStructure] = useState(null);
  const [selection, setSelection] = useState(null);
  const [linear, setLinear] = useState(false);
  const pendingAction = useRef(null);
  const currentProjection = useRef(projection?.projection_of);
  const ifCallback = useRef(onExploreIf), correctionCallback = useRef(onCorrectMap);
  const mounted = useRef(true);
  currentProjection.current = projection?.projection_of;
  ifCallback.current = onExploreIf;
  correctionCallback.current = onCorrectMap;
  const styles = useMemo(() => makeStyles(colors, isDark), [colors, isDark]);
  useEffect(() => { pendingAction.current = null; setSelection(null); setExpandedStructure(null); setLinear(false); }, [projection?.projection_of, mapSubscriptionTier]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; pendingAction.current = null; };
  }, []);
  if (!projection) return null;
  const compact = mapSubscriptionTier === 'free';
  const structures = projection.overview.primary_structures || [];
  const hasStructures = structures.length > 0;
  if (mapSubscriptionTier && !hasStructures) {
    return <View testID="watashi-map-v3" style={styles.root}>
      <Text style={styles.body}>{projection.overview.summary}</Text>
    </View>;
  }
  const activeStructure = expandedStructure?.projectionOf === projection.projection_of
    ? structures[expandedStructure.index] : null;
  const listedNodeRefs = projection.accessibility_linear_order.filter(ref =>
    !structures.some(structure => structure.node_refs.includes(ref)));
  const listedEdges = projection.edges.filter(edge => !structures.some(structure =>
    structure.node_refs.includes(edge.from_ref) && structure.node_refs.includes(edge.to_ref)));
  const hasListedItems = !compact && (listedNodeRefs.length > 0 || listedEdges.length > 0);
  const listLabel = hasStructures ? 'ほかの項目・関係を読む' : '項目を一覧で読む';
  const chosen = selection?.projectionOf === projection.projection_of
    ? (selection.kind === 'overview' ? projection.overview
      : selection.kind === 'node' ? projection.nodes.find(n => n.node_ref === selection.ref)
      : projection.edges.find(e => e.edge_ref === selection.ref)) : null;
  const choose = (kind, ref) => {
    pendingAction.current = null;
    setSelection({ projectionOf: projection.projection_of, kind, ref });
  };
  const nodeName = ref => projection.nodes.find(n => n.node_ref === ref)?.title || '';
  const dismissDetail = () => { pendingAction.current = null; setSelection(null); };
  const toggleStructure = (index, expanded) => {
    dismissDetail();
    setExpandedStructure(expanded ? null : { projectionOf: projection.projection_of, index });
  };
  const detailDismissed = () => {
    const pending = pendingAction.current;
    pendingAction.current = null;
    if (mounted.current && pending && pending.projectionOf === currentProjection.current) {
      if (pending.action === 'if') ifCallback.current?.(pending.targetRef);
      else if (pending.action === 'correction') correctionCallback.current?.(pending.kind, pending.targetRef);
    }
  };
  const openParentAction = (action, kind, ref) => {
    pendingAction.current = Platform?.OS === 'ios'
      ? { projectionOf: projection.projection_of, action, kind, targetRef: ref } : null;
    setSelection(null);
    if (Platform?.OS !== 'ios') {
      if (action === 'if') ifCallback.current?.(ref);
      else correctionCallback.current?.(kind, ref);
    }
  };
  return <View testID="watashi-map-v3" style={styles.root}>
    {structures.map((structure, index) => {
      const expanded = activeStructure === structure;
      const diagramAction = expanded ? '図を閉じる' : '関係する部分を図で見る';
      return <View key={structure.title} style={styles.structure}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>{structure.title}</Text>
        <Text style={styles.body}>{structure.description}</Text>
        {!compact ? <Text style={styles.eyebrow}>{scopeLabels[structure.scope]}</Text> : null}
        {structure.node_refs.length ? <TouchableOpacity testID={`semantic-structure-toggle-${index}`} accessibilityRole="button"
          accessibilityLabel={`${diagramAction}。${structure.title}`}
          accessibilityState={{ expanded }} style={styles.structureButton}
          onPress={() => toggleStructure(index, expanded)}>
          <Text style={styles.actionLabel}>{diagramAction}</Text>
        </TouchableOpacity> : null}
        {expanded && structure.node_refs.length ? <SemanticMapDiagram projection={projection} nodeRefs={structure.node_refs}
          styles={styles} colors={colors} compact={compact} choose={compact ? onCorrectMap : choose} /> : null}
      </View>;
    })}
    <StructureRelations structures={structures} relations={projection.overview.structure_relations} styles={styles} />
    {compact && onCorrectMap ? <TouchableOpacity testID="semantic-overview-correction" accessibilityRole="button"
      style={styles.secondaryAction} onPress={() => onCorrectMap('overview', 'overview')}>
      <Text style={styles.actionLabel}>読み取りを訂正する</Text>
    </TouchableOpacity> : null}
    {!compact ? <View style={hasStructures ? null : styles.intro}>
      {!hasStructures ? <>
        <Text style={styles.eyebrow}>記録をつないで見えること</Text>
        <Text style={styles.title} accessibilityRole="header">{projection.overview.title}</Text>
        <Text style={styles.overview} numberOfLines={3}>{projection.overview.summary}</Text>
      </> : null}
      <TouchableOpacity testID="semantic-overview-open" accessibilityRole="button"
        style={styles.secondaryAction} onPress={() => choose('overview', 'overview')}>
        <Text style={styles.actionLabel}>全体の読みを開く</Text>
      </TouchableOpacity>
    </View> : null}
    {hasListedItems ? <TouchableOpacity testID="semantic-items-toggle" accessibilityRole="button" accessibilityState={{ expanded: linear }}
      style={styles.secondaryAction} onPress={() => setLinear(!linear)}>
      <Text style={styles.actionLabel}>{linear ? '一覧を閉じる' : listLabel}</Text>
    </TouchableOpacity> : null}
    {hasListedItems && linear ? <View style={styles.linear}>
      {listedNodeRefs.map(ref => {
        const node = projection.nodes.find(n => n.node_ref === ref);
        return <TouchableOpacity key={ref} testID={`semantic-node-${ref}`} accessibilityRole="button"
          style={styles.linearItem} onPress={() => choose('node', ref)}>
          <Text style={styles.sectionTitle}>{node.title}</Text><Text style={styles.body}>{node.summary}</Text>
        </TouchableOpacity>;
      })}
      {listedEdges.map(edge => <TouchableOpacity key={edge.edge_ref} testID={`semantic-edge-${edge.edge_ref}`} accessibilityRole="button"
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
            {selection?.kind === 'overview' && !hasStructures ? <View style={styles.relatedNodes}>
              <Text style={styles.sectionTitle}>地図の項目</Text>
              {projection.accessibility_linear_order.map(ref => <TouchableOpacity key={ref}
                testID={`semantic-overview-node-${ref}`} accessibilityRole="button" style={styles.detailAction}
                onPress={() => choose('node', ref)}><Text style={styles.detailActionText}>{nodeName(ref)}</Text></TouchableOpacity>)}
            </View> : null}
            {selection?.kind === 'node' && chosen?.unknowns.length ? <View style={styles.unknown}>
              <Text style={styles.sectionTitle}>この記録では決められないこと</Text>
              {chosen.unknowns.map((item, index) => <Text key={index} style={styles.body}>{item}</Text>)}
            </View> : null}
            {chosen && ['node', 'edge'].includes(selection?.kind) && onExploreIf ? <TouchableOpacity
              testID="semantic-if-open" accessibilityRole="button" style={styles.detailAction}
              onPress={() => openParentAction('if', selection.kind, selection.ref)}>
              <Text style={styles.detailActionText}>この分岐を考える</Text>
            </TouchableOpacity> : null}
            {chosen && onCorrectMap ? <TouchableOpacity testID="semantic-correction-open" accessibilityRole="button"
              style={styles.detailAction} onPress={() => openParentAction('correction', selection.kind, selection.ref)}>
              <Text style={styles.detailActionText}>この読み取りを訂正する</Text>
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
    canvasShell: { width: '100%', maxWidth: 440, alignSelf: 'center',
      backgroundColor: tonal, borderRadius: 28, overflow: 'hidden' },
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
    structure: { gap: 7, paddingVertical: 12, borderTopWidth: 1, borderColor: border },
    structureRelation: { gap: 8, paddingVertical: 6 },
    structureDiagram: { maxWidth: 440, width: '100%', alignSelf: 'center', padding: 12,
      backgroundColor: tonal, borderRadius: 20 },
    structureNode: { alignItems: 'center', padding: 10, backgroundColor: paper,
      borderRadius: 12, borderWidth: 1, borderColor: border },
    structureNodeTitle: { color: ink, fontSize: 15, lineHeight: 23, fontWeight: '600', textAlign: 'center' },
    structureLink: { minHeight: 34, marginLeft: '50%', borderLeftWidth: 1, borderColor: accent,
      paddingLeft: 9, justifyContent: 'center' },
    structureButton: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
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
    detailAction: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: tonal, borderRadius: 24, justifyContent: 'center' },
    detailActionText: { color: accent, fontSize: 15, lineHeight: 24, fontWeight: '600', textAlign: 'center' },
  });
}
