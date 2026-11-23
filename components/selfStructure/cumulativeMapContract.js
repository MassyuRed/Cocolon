const { readWatashiMapV2Projection } = require('./watashiMapV2Contract');
const { readSemanticMapProjection } = require('./semanticMapContract');

function checkCoverage(c) {
  if (!c || c.profile !== 'cumulative.v1') return false;
  const keys = ['source_count', 'processed_count', 'mapped_count', 'unparsed_count', 'excluded_count', 'stale_supplement_count'];
  return keys.every(k => Number.isSafeInteger(c[k]) && c[k] >= 0)
    && c.source_count === c.processed_count + c.excluded_count
    && c.mapped_count <= c.processed_count && c.unparsed_count <= c.processed_count;
}

function checkedMapRow(row) {
  const projection = readSemanticMapProjection(row?.content_json) || readWatashiMapV2Projection(row?.content_json);
  if (row?.source_profile !== 'cumulative.v1' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(row.id || '')
    || !projection || projection.projection_of !== `artifact:${row.id.replace(/-/g, '')}@1`
    || !checkCoverage(row.content_json.map_context)) throw new Error('analysis_saved_artifact_invalid');
  return row;
}

function checkedCurrentResult(data) {
  if (data?.status !== 'ok' || data.source_profile !== 'cumulative.v1' || typeof data.has_visible_content !== 'boolean') {
    throw new Error('analysis_saved_artifact_invalid');
  }
  if (!data.has_visible_content) {
    if (data.meta != null || data.content_text != null || (data.map_context != null && !checkCoverage(data.map_context))) {
      throw new Error('analysis_saved_artifact_invalid');
    }
    return null;
  }
  return checkedMapRow({ id: data.report_id, generated_at: data.generated_at,
    content_json: { watashiMap: data.meta, map_context: data.map_context },
    source_profile: data.source_profile, snapshot_month: null });
}

function isLegacySemanticDowngrade(row) {
  const map = row?.content_json?.watashiMap;
  // The older server's renderer conversion flattens semantic maps into this legacy shape.
  return map?.wire_kind === 'watashi.map.v2'
    && map.period_comparison.state === 'NO_PREVIOUS' && !map.period_comparison.reason_codes.length
    && [map.edges, map.annotation_badges, map.unknown_gaps, map.conflict_badges].every(items => !items.length)
    && map.nodes.length > 0
    && map.nodes.every(node => node.node_kind === 'ATTENTION_OR_THOUGHT'
      && node.visible_label.startsWith('読み取り：') && node.visible_label.includes('\n'));
}

module.exports = { checkCoverage, checkedMapRow, checkedCurrentResult, isLegacySemanticDowngrade };
