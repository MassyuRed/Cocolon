// Owner-facing product projection only. No API calls, raw-source fallback or export.
const SCHEMA = 'cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1';
const NODE_LABELS = Object.freeze({
  SCENE: '場面', ROLE: '役割', ATTENTION_OR_THOUGHT: '考え・注意',
  ACTION_OR_NONACTION: '行動・非行動', IMMEDIATE_RESULT_OR_AFTERMATH: '結果・余韻',
});
const COMPARISON_CHANGES = Object.freeze({
  ROUTE_EVIDENCE_CHANGED: '読み取れた内容・つながり',
  ANNOTATION_EVIDENCE_CHANGED: '守る対象・負荷の記述',
  UNKNOWN_SCOPE_CHANGED: '確定できない部分',
  CONFLICT_STATE_CHANGED: '一致していない記述の組み合わせ',
});
const COMPARISON_REASONS = Object.freeze({
  PERIOD_LENGTH_MISMATCH: '期間の長さが異なります。',
  PREVIOUS_PERIOD_NOT_EARLIER: '比較対象が前の期間ではありません。',
  PERIOD_OVERLAP: '二つの期間が重なっています。',
  PERIOD_NOT_ADJACENT: '直前の期間ではありません。',
  SHARED_RECORD_IDENTITY: '同じ記録が両方の期間に含まれています。',
});
function comparisonLines(comparison) {
  if (comparison.state === 'NO_PREVIOUS') return [];
  if (comparison.state === 'NOT_COMPARABLE') return ['期間比較：この二つの期間は比較できません。',
    ...comparison.reason_codes.map((code) => COMPARISON_REASONS[code] || '比較条件を確認できません。')];
  const changes = comparison.safe_change_kinds;
  if (!changes.length) return ['期間比較：今回比較した記述内容では差分を検出していません。'
    + '記録の件数や、読み取れていない内容の変化は判断していません。'];
  return ['期間比較：前の同じ長さの期間と比べ、' + changes.map((kind) => COMPARISON_CHANGES[kind]).join('、')
    + 'が異なります。', '記録上の違いであり、改善・悪化や原因を示すものではありません。'];
}
const object = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = (x) => typeof x === 'string' && x.trim().length > 0;
const unique = (xs) => new Set(xs).size === xs.length;
const keys = (x, names) => object(x) && Object.keys(x).length === names.length
  && names.every((name) => Object.prototype.hasOwnProperty.call(x, name));
const strings = (xs) => Array.isArray(xs) && xs.every(text) && unique(xs);

function parseWatashiMapContent(value) {
  if (value == null || value === '') return null;
  if (object(value)) return value;
  if (typeof value === 'string') {
    if (!value.trim()) return null;
    try {
      const parsed = JSON.parse(value);
      if (parsed === null || object(parsed)) return parsed;
    } catch { /* A malformed declared result must never become legacy text. */ }
  }
  return { wire_kind: 'watashi.map.unsupported' };
}

function mapCandidate(contentJson) {
  if (!object(contentJson)) return { kind: 'LEGACY', payload: null };
  const direct = Object.prototype.hasOwnProperty.call(contentJson, 'wire_kind')
    || Object.prototype.hasOwnProperty.call(contentJson, 'projection_of')
    || String(contentJson.schema_version || '').startsWith('cocolon.cmee.analysis_')
    || String(contentJson.version || '').startsWith('watashi.map.');
  if (direct && Object.prototype.hasOwnProperty.call(contentJson, 'watashiMap')) {
    return { kind: 'UNSUPPORTED', payload: null };
  }
  const payload = direct ? contentJson : contentJson.watashiMap;
  if (payload == null) return { kind: 'LEGACY', payload: null };
  if (!object(payload)) return { kind: 'UNSUPPORTED', payload: null };
  if (payload.wire_kind === 'watashi.map.v2' && payload.schema_version === SCHEMA) {
    return { kind: 'V2', payload };
  }
  if (Object.prototype.hasOwnProperty.call(payload, 'wire_kind')
      && payload.wire_kind !== 'watashi.map.v1') {
    return { kind: 'UNSUPPORTED', payload: null };
  }
  const declared = payload.wire_kind || payload.version;
  if ((!declared || declared === 'watashi.map.v1') && !payload.projection_of
      && !String(payload.schema_version || '').startsWith('cocolon.cmee.analysis_')) {
    return { kind: 'LEGACY', payload };
  }
  return { kind: 'UNSUPPORTED', payload: null };
}

function classifyWatashiMapVersion(contentJson) {
  return mapCandidate(contentJson).kind;
}

function readWatashiMapV2Projection(contentJson) {
  const candidate = mapCandidate(contentJson);
  if (candidate.kind !== 'V2') return null;
  const p = candidate.payload;
  if (!keys(p, ['schema_version', 'wire_kind', 'projection_of', 'artifact_version',
    'period_label', 'period_comparison', 'nodes', 'edges', 'annotation_badges',
    'unknown_gaps', 'conflict_badges', 'accessibility_linear_order'])
      || !/^artifact:[^@\s]+@[1-9]\d*$/.test(p.projection_of)
      || !Number.isInteger(p.artifact_version) || p.artifact_version < 1
      || !p.projection_of.endsWith('@' + p.artifact_version) || !text(p.period_label)) return null;
  const comparison = p.period_comparison;
  const changes = ['ROUTE_EVIDENCE_CHANGED', 'ANNOTATION_EVIDENCE_CHANGED',
    'UNKNOWN_SCOPE_CHANGED', 'CONFLICT_STATE_CHANGED'];
  if (!keys(comparison, ['state', 'reason_codes', 'safe_change_kinds'])
      || !['NO_PREVIOUS', 'COMPARABLE', 'NOT_COMPARABLE'].includes(comparison.state)
      || !strings(comparison.reason_codes) || !strings(comparison.safe_change_kinds)
      || !comparison.safe_change_kinds.every((x) => changes.includes(x))
      || (comparison.state !== 'COMPARABLE' && comparison.safe_change_kinds.length)
      || (comparison.state === 'NOT_COMPARABLE' && !comparison.reason_codes.length)) return null;
  if (!Array.isArray(p.nodes) || !p.nodes.length || !p.nodes.every((n) =>
    keys(n, ['node_ref', 'node_kind', 'visible_label', 'evidence_badge_count'])
    && /^n[1-9]\d*$/.test(n.node_ref)
    && Object.prototype.hasOwnProperty.call(NODE_LABELS, n.node_kind)
    && text(n.visible_label) && Number.isInteger(n.evidence_badge_count)
    && n.evidence_badge_count >= 1)) return null;
  const refs = p.nodes.map((n) => n.node_ref);
  const endpoints = (xs, min = 1, max = Infinity) => strings(xs)
    && xs.length >= min && xs.length <= max && xs.every((ref) => refs.includes(ref));
  if (!unique(refs) || !endpoints(p.accessibility_linear_order, refs.length, refs.length)) return null;
  if (!Array.isArray(p.edges) || !p.edges.every((e) => {
    if (!object(e) || !/^e[1-9]\d*$/.test(e.edge_ref) || !text(e.visible_label)) return false;
    if (e.edge_kind === 'OBSERVED_ORDER') return keys(e,
      ['edge_ref', 'edge_kind', 'from_ref', 'to_ref', 'visible_label'])
      && endpoints([e.from_ref, e.to_ref], 2, 2);
    return e.edge_kind === 'REPEATED_COOCCURRENCE' && keys(e,
      ['edge_ref', 'edge_kind', 'endpoint_refs', 'visible_label'])
      && endpoints(e.endpoint_refs, 2);
  }) || !unique(p.edges.map((e) => e.edge_ref))) return null;
  const targets = [...refs, ...p.edges.map((e) => e.edge_ref)];
  if (!Array.isArray(p.annotation_badges) || !p.annotation_badges.every((a) =>
    keys(a, ['annotation_ref', 'target_ref', 'kind', 'visible_label'])
    && text(a.annotation_ref) && targets.includes(a.target_ref)
    && ['PROTECTIVE', 'BURDEN'].includes(a.kind) && text(a.visible_label))
    || !unique(p.annotation_badges.map((a) => a.annotation_ref))) return null;
  if (!Array.isArray(p.unknown_gaps) || !p.unknown_gaps.every((g) =>
    keys(g, ['gap_ref', 'between_node_refs', 'visible_label']) && text(g.gap_ref)
    && endpoints(g.between_node_refs, 1, 2) && text(g.visible_label))
    || !unique(p.unknown_gaps.map((g) => g.gap_ref))) return null;
  if (!Array.isArray(p.conflict_badges) || !p.conflict_badges.every((c) =>
    keys(c, ['conflict_ref', 'target_refs', 'visible_label']) && text(c.conflict_ref)
    && strings(c.target_refs) && c.target_refs.length
    && c.target_refs.every((ref) => targets.includes(ref)) && text(c.visible_label))
    || !unique(p.conflict_badges.map((c) => c.conflict_ref))) return null;
  // Every nested shape above is closed. Return an independent projection.
  return JSON.parse(JSON.stringify(p));
}

function buildWatashiMapV2ViewModel(contentJson) {
  const p = readWatashiMapV2Projection(contentJson);
  if (!p) return null;
  const index = new Map(p.nodes.map((node) => [node.node_ref, node]));
  const nodes = p.accessibility_linear_order.map((ref) => index.get(ref));
  const lines = nodes.map((n) => NODE_LABELS[n.node_kind] + '：' + n.visible_label
    + '（' + n.evidence_badge_count + '件の記録）');
  const edges = p.edges.map((edge) => {
    const ordered = edge.edge_kind === 'OBSERVED_ORDER';
    const labels = (ordered ? [edge.from_ref, edge.to_ref] : edge.endpoint_refs)
      .map((ref) => index.get(ref).visible_label);
    lines.push(ordered ? '記録内の順序：' + labels.join(' → ') + '。原因を示す線ではありません。'
      : '複数の記録で一緒に現れた内容：' + labels.join(' ／ ') + '。順序や原因は確定していません。');
    return { ...edge, ordered, labels };
  });
  const targetLabel = (ref) => index.has(ref) ? index.get(ref).visible_label
    : edges.find((e) => e.edge_ref === ref).labels.join(' ／ ');
  const unknownGaps = p.unknown_gaps.map((g) => ({ ...g,
    targetLabels: g.between_node_refs.map(targetLabel) }));
  const annotations = p.annotation_badges.map((a) => ({ ...a, targetLabel: targetLabel(a.target_ref) }));
  const conflicts = p.conflict_badges.map((c) => ({ ...c, targetLabels: c.target_refs.map(targetLabel) }));
  lines.push(...unknownGaps.map((g) => '未確定（' + g.targetLabels.join(' ／ ') + '）：' + g.visible_label));
  lines.push(...annotations.map((a) => '注記（' + a.targetLabel + '）：' + a.visible_label),
    ...conflicts.map((c) => '一致していない記録（' + c.targetLabels.join(' ／ ') + '）：' + c.visible_label));
  const comparisonText = comparisonLines(p.period_comparison);
  lines.push(...comparisonText);
  return { projectionOf: p.projection_of, periodLabel: p.period_label,
    comparisonState: p.period_comparison.state, comparisonText, nodes, edges,
    annotations, unknownGaps, conflicts,
    text: lines.join('\n') };
}

module.exports = { SCHEMA, NODE_LABELS, parseWatashiMapContent, classifyWatashiMapVersion,
  readWatashiMapV2Projection, buildWatashiMapV2ViewModel };
