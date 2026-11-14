const { readSemanticMapProjection } = require('./semanticMapContract');
const nonblank = value => typeof value === 'string' && !!value.trim();

function mapCorrectionTargets(content, kind, ref) {
  const map = readSemanticMapProjection(content);
  if (!map) return [];
  let target, definitions;
  if (kind === 'overview' && ref === 'overview') {
    target = map.overview; definitions = [['title', '全体の見出し'], ['summary', '全体の読み']];
  } else if (kind === 'node') {
    target = map.nodes.find(node => node.node_ref === ref);
    definitions = [['title', '項目の見出し'], ['summary', '項目の要点'], ['explanation', '詳しい説明']];
  } else if (kind === 'edge') {
    target = map.edges.find(edge => edge.edge_ref === ref);
    definitions = [['label', '関係の見出し'], ['explanation', '関係の説明']];
  }
  if (!target) return [];
  const result = definitions.filter(([field]) => nonblank(target[field]))
    .map(([field, label]) => ({ field, label, text: target[field] }));
  if (kind === 'node' && Array.isArray(target.unknowns)) {
    target.unknowns.forEach((text, index) => {
      if (nonblank(text)) result.push({ field: `unknowns.${index}`, label: `まだ分からないこと ${index + 1}`, text });
    });
  }
  return result;
}

function validMapCorrectionQuote(displayedText, targetText) {
  return nonblank(displayedText) && nonblank(targetText) && targetText.length <= 2000
    && !/[\uD800-\uDFFF]/u.test(targetText)
    && displayedText.indexOf(targetText) >= 0
    && displayedText.indexOf(targetText) === displayedText.lastIndexOf(targetText);
}

function checkedMapCorrectionResult(value, expected) {
  const fields = ['schema_version', 'correction_id', 'artifact_ref', 'kind', 'ref', 'field', 'target_text',
    'explanation', 'recorded_at', 'source_state', 'refresh_status'];
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.keys(value).length !== fields.length || !fields.every(field => Object.prototype.hasOwnProperty.call(value, field))
      || value.schema_version !== 'cocolon.analysis.map_correction.response.v1'
      || typeof value.correction_id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value.correction_id)
      || !['ACTIVE', 'STALE'].includes(value.source_state)
      || ![null, 'queued', 'running', 'failed'].includes(value.refresh_status)
      || typeof value.recorded_at !== 'string' || !Number.isFinite(Date.parse(value.recorded_at))
      || !expected || !['artifact_ref', 'kind', 'ref', 'field', 'target_text', 'explanation'].every(field => value[field] === expected[field])) {
    throw new Error('analysis_map_correction_contract_invalid');
  }
  return value;
}

function checkedMapCorrectionEvidenceItems(items) {
  if (!Array.isArray(items)) throw new Error('analysis_map_correction_evidence_invalid');
  const known = new Map();
  const fields = ['correction_id', 'text', 'recorded_at', 'target_artifact_ref', 'target_kind', 'target_ref', 'version_state'];
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)
        || (item.evidence_scope !== undefined && item.evidence_scope !== 'MAP_CORRECTION_CONTEXT')) {
      throw new Error('analysis_map_correction_evidence_invalid');
    }
    if (item.map_corrections === undefined) continue;
    if (!Array.isArray(item.map_corrections)) throw new Error('analysis_map_correction_evidence_invalid');
    for (const correction of item.map_corrections) {
      if (!correction || typeof correction !== 'object' || Array.isArray(correction)
          || Object.keys(correction).length !== fields.length || !fields.every(field => Object.prototype.hasOwnProperty.call(correction, field))
          || typeof correction.correction_id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(correction.correction_id)
          || !nonblank(correction.text) || typeof correction.recorded_at !== 'string' || !Number.isFinite(Date.parse(correction.recorded_at))
          || typeof correction.target_artifact_ref !== 'string' || !/^artifact:[0-9a-f]{32}@1$/.test(correction.target_artifact_ref)
          || !['overview', 'node', 'edge'].includes(correction.target_kind)
          || (correction.target_kind === 'overview' ? correction.target_ref !== 'overview'
            : !(correction.target_kind === 'node' ? /^n[1-9][0-9]*$/ : /^e[1-9][0-9]*$/).test(correction.target_ref))
          || !['CURRENT', 'EDITED_SINCE_ANALYSIS'].includes(correction.version_state)) {
        throw new Error('analysis_map_correction_evidence_invalid');
      }
      const previous = known.get(correction.correction_id);
      if (previous && !fields.every(field => previous[field] === correction[field])) {
        throw new Error('analysis_map_correction_evidence_invalid');
      }
      known.set(correction.correction_id, correction);
    }
  }
  return items;
}

function mapCorrectionEvidence(items) {
  return [...new Map((items || []).flatMap(item => item.map_corrections || [])
    .map(correction => [correction.correction_id, correction])).values()];
}

module.exports = { mapCorrectionTargets, validMapCorrectionQuote, checkedMapCorrectionResult,
  checkedMapCorrectionEvidenceItems, mapCorrectionEvidence };
