const { readWatashiMapV2Projection } = require('./watashiMapV2Contract');

function checkCoverage(c) {
  if (!c || c.profile !== 'cumulative.v1') return false;
  const keys = ['source_count', 'processed_count', 'mapped_count', 'unparsed_count', 'excluded_count', 'stale_supplement_count'];
  return keys.every(k => Number.isSafeInteger(c[k]) && c[k] >= 0)
    && c.source_count === c.processed_count + c.excluded_count
    && c.mapped_count <= c.processed_count && c.unparsed_count <= c.processed_count;
}

function checkedMapRow(row) {
  const projection = readWatashiMapV2Projection(row?.content_json);
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

module.exports = { checkCoverage, checkedMapRow, checkedCurrentResult };
