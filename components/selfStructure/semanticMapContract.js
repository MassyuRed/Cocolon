const SCHEMA = 'cocolon.analysis.semantic_map.v1';
const NODE_KINDS = ['SELF_POSITION', 'TARGET_MEANING', 'CHOICE_OUTPUT', 'STATE_CONTEXT'];
const RELATION_KINDS = ['SELF_OUTSIDE_GAP', 'CRITERION_EXPRESSION', 'CONTEXT_CONTRAST', 'SHARED_MEANING'];
const object = x => !!x && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && !!x.trim();
const exact = (x, names) => object(x) && Object.keys(x).length === names.length
  && names.every(name => Object.prototype.hasOwnProperty.call(x, name));
const unique = xs => new Set(xs).size === xs.length;
const texts = xs => Array.isArray(xs) && xs.every(text);

function readSemanticMapProjection(content) {
  const p = object(content?.watashiMap) ? content.watashiMap : content;
  if (!exact(p, ['schema_version', 'wire_kind', 'projection_of', 'artifact_version', 'period_label',
    'overview', 'nodes', 'edges', 'accessibility_linear_order']) || p.schema_version !== SCHEMA
    || p.wire_kind !== 'watashi.map.v3' || p.artifact_version !== 1
    || !/^artifact:[0-9a-f]{32}@1$/.test(p.projection_of) || !text(p.period_label)
    || !exact(p.overview, ['title', 'summary']) || !text(p.overview.title) || !text(p.overview.summary)
    || !Array.isArray(p.nodes) || !p.nodes.length || p.nodes.length > 24
    || !Array.isArray(p.edges) || p.edges.length > 48) return null;
  if (!p.nodes.every(n => exact(n, ['node_ref', 'node_kind', 'title', 'summary', 'explanation',
    'perspective', 'context', 'unknowns', 'evidence_badge_count']) && /^n[1-9]\d*$/.test(n.node_ref)
    && NODE_KINDS.includes(n.node_kind) && text(n.title) && text(n.summary) && text(n.explanation)
    && ['SELF', 'OBSERVED_INTERACTION'].includes(n.perspective) && texts(n.context) && texts(n.unknowns)
    && Number.isSafeInteger(n.evidence_badge_count) && n.evidence_badge_count >= 1)) return null;
  const refs = p.nodes.map(n => n.node_ref);
  if (!unique(refs) || !texts(p.accessibility_linear_order) || !unique(p.accessibility_linear_order)
    || p.accessibility_linear_order.length !== refs.length
    || !p.accessibility_linear_order.every(ref => refs.includes(ref))) return null;
  if (!p.edges.every(e => exact(e, ['edge_ref', 'from_ref', 'to_ref', 'relation_kind', 'label', 'explanation'])
    && /^e[1-9]\d*$/.test(e.edge_ref) && refs.includes(e.from_ref) && refs.includes(e.to_ref)
    && e.from_ref !== e.to_ref && RELATION_KINDS.includes(e.relation_kind) && text(e.label) && text(e.explanation))
    || !unique(p.edges.map(e => e.edge_ref))) return null;
  return JSON.parse(JSON.stringify(p));
}

function intersects(a, b, margin = 6) {
  return a.x < b.x + b.width + margin && a.x + a.width + margin > b.x
    && a.y < b.y + b.height + margin && a.y + a.height + margin > b.y;
}

// A static layout keeps the same relationships in the same place after a tap.
// Links are deliberately undirected: a model reading is not a causal arrow.
function buildSemanticMapLayout(p, availableWidth = 340) {
  const width = Math.max(280, Math.round(availableWidth));
  const nodeWidth = Math.min(166, (width - 48) / 2);
  const nodeHeight = 112;
  const rowPitch = 216;
  const adjacency = new Map(p.nodes.map(n => [n.node_ref, []]));
  p.edges.forEach(e => { adjacency.get(e.from_ref).push(e.to_ref); adjacency.get(e.to_ref).push(e.from_ref); });
  const seen = new Set();
  const layers = [];
  const isolated = [];
  p.accessibility_linear_order.forEach(root => {
    if (seen.has(root)) return;
    if (!adjacency.get(root).length) { isolated.push(root); seen.add(root); return; }
    let frontier = [root]; seen.add(root);
    while (frontier.length) {
      for (let i = 0; i < frontier.length; i += 2) layers.push(frontier.slice(i, i + 2));
      const next = [];
      frontier.forEach(ref => adjacency.get(ref).forEach(neighbor => {
        if (!seen.has(neighbor)) { seen.add(neighbor); next.push(neighbor); }
      }));
      frontier = next;
    }
  });
  for (let i = 0; i < isolated.length; i += 2) layers.push(isolated.slice(i, i + 2));
  const positions = new Map();
  layers.forEach((layer, row) => layer.forEach((ref, column) => positions.set(ref, {
    x: row === 0 && layer.length === 1 ? (width - nodeWidth) / 2
      : column === 0 ? 12 : width - nodeWidth - 12,
    y: 16 + row * rowPitch, width: nodeWidth, height: nodeHeight, row,
  })));
  const boxes = [...positions.values()];
  const labels = [];
  let height = (layers.length - 1) * rowPitch + nodeHeight + 48;
  const edges = p.edges.map(edge => {
    const from = positions.get(edge.from_ref), to = positions.get(edge.to_ref);
    const labelWidth = Math.min(136, width - 32);
    const candidates = [];
    const minRow = Math.min(from.row, to.row), maxRow = Math.max(from.row, to.row);
    const lower = to.row >= from.row ? to : from;
    const upper = to.row >= from.row ? from : to;
    const targetCenter = lower.x + lower.width / 2;
    for (let row = minRow; row < Math.max(minRow + 1, maxRow); row += 1) {
      [28, 78].forEach(offset => [targetCenter, width / 2, width * 0.25, width * 0.75].forEach(center => {
        candidates.push({ x: Math.max(8, Math.min(width - labelWidth - 8, center - labelWidth / 2)),
          y: 16 + row * rowPitch + nodeHeight + offset - 22, width: labelWidth, height: 44 });
      }));
    }
    const middle = maxRow === minRow ? from.y + nodeHeight + 52 : lower.y - 52;
    candidates.sort((a, b) => Math.abs(a.y + 22 - middle) - Math.abs(b.y + 22 - middle));
    let label = candidates.find(c => !boxes.some(b => intersects(c, b)) && !labels.some(b => intersects(c, b)));
    if (!label) {
      label = { x: (width - labelWidth) / 2, y: height, width: labelWidth, height: 44 };
      height += 64;
    }
    labels.push(label);
    height = Math.max(height, label.y + label.height + 16);
    const mx = label.x + label.width / 2, my = label.y + label.height / 2;
    const tx = lower.x + lower.width / 2;
    let path;
    if (minRow === maxRow) {
      const sx = from.x + from.width / 2, tx2 = to.x + to.width / 2;
      path = `M ${sx} ${from.y + from.height} L ${sx} ${my} L ${mx} ${my} L ${tx2} ${my} L ${tx2} ${to.y + to.height}`;
    } else {
      const centered = Math.abs(upper.x + upper.width / 2 - width / 2) < 2;
      const left = upper.x < width / 2;
      const track = centered ? width / 2 : left ? 6 : width - 6;
      const sx = centered ? width / 2 : left ? upper.x : upper.x + upper.width;
      const sy = centered ? upper.y + upper.height : upper.y + upper.height / 2;
      path = `M ${sx} ${sy} L ${track} ${sy} L ${track} ${my} L ${mx} ${my} L ${tx} ${my} L ${tx} ${lower.y}`;
    }
    return { ...edge, labelBox: label, path };
  });
  return { width, height, nodes: p.accessibility_linear_order.map(ref => ({
    ...p.nodes.find(n => n.node_ref === ref), box: positions.get(ref),
  })), edges };
}

module.exports = { SCHEMA, NODE_KINDS, RELATION_KINDS, readSemanticMapProjection, buildSemanticMapLayout };
