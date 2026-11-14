const keys = (value, names, optional = []) => value && typeof value === 'object' && !Array.isArray(value)
  && names.every(key => Object.prototype.hasOwnProperty.call(value, key))
  && Object.keys(value).every(key => names.includes(key) || optional.includes(key));
const text = value => typeof value === 'string' && !!value.trim() && value.length <= 10000;
const strings = value => Array.isArray(value) && value.every(text);
const artifact = value => typeof value === 'string' && /^artifact:[0-9a-f]{32}@1$/.test(value);
const scenarioRef = value => typeof value === 'string' && /^analysis-if-scenario:[^@]+@[^@]+$/.test(value);
const setRef = value => typeof value === 'string' && /^scenario-set:[^@]+@[^@]+$/.test(value);
const requireValue = value => { if (!value) throw new Error('analysis_if_contract_invalid'); };

function checkedIfProjection(value) {
  requireValue(keys(value, ['schema_version', 'wire_kind', 'projection_of', 'base_observed_map_ref', 'base_route_ref', 'selection_policy', 'scenarios']));
  requireValue(value.schema_version === 'cocolon.cmee.analysis_if_safe_projection.v1alpha1'
    && value.wire_kind === 'watashi.if-route-set.v1' && artifact(value.projection_of)
    && artifact(value.base_observed_map_ref) && /^route:[^@]+@[^@]+$/.test(value.base_route_ref)
    && value.selection_policy === 'PARALLEL_NOT_RANKED' && Array.isArray(value.scenarios)
    && value.scenarios.length >= 1 && value.scenarios.length <= 3);
  const refs = new Set();
  for (const scenario of value.scenarios) {
    requireValue(keys(scenario, ['scenario_ref', 'branch_point_ref', 'visible_label', 'nodes', 'edges', 'required_conditions', 'frictions', 'unmodelled_factors'])
      && scenarioRef(scenario.scenario_ref) && !refs.has(scenario.scenario_ref)
      && text(scenario.branch_point_ref) && text(scenario.visible_label)
      && Array.isArray(scenario.nodes) && scenario.nodes.length >= 1 && Array.isArray(scenario.edges)
      && strings(scenario.required_conditions) && strings(scenario.frictions) && strings(scenario.unmodelled_factors));
    refs.add(scenario.scenario_ref);
    const nodes = new Set(), edges = new Set();
    for (const node of scenario.nodes) {
      requireValue(keys(node, ['node_ref', 'origin', 'visible_label']) && text(node.node_ref)
        && !nodes.has(node.node_ref) && ['OBSERVED_ANCHOR', 'USER_CHOICE', 'SIMULATED_EXTENSION', 'UNKNOWN'].includes(node.origin)
        && text(node.visible_label));
      nodes.add(node.node_ref);
    }
    requireValue(scenario.nodes.some(node => node.origin === 'UNKNOWN'));
    for (const edge of scenario.edges) {
      requireValue(keys(edge, ['edge_ref', 'from_ref', 'to_ref', 'visible_condition_labels'])
        && text(edge.edge_ref) && !edges.has(edge.edge_ref) && nodes.has(edge.from_ref) && nodes.has(edge.to_ref)
        && edge.from_ref !== edge.to_ref && strings(edge.visible_condition_labels));
      edges.add(edge.edge_ref);
    }
  }
  return value;
}

function checkedSavedProjection(value) {
  requireValue(keys(value, ['schema_version', 'wire_kind', 'projection_of', 'source_scenario_set_ref', 'selected_scenario_ref', 'visible_note', 'saved_at'])
    && value.schema_version === 'cocolon.cmee.analysis_saved_intent_safe_projection.v1alpha1'
    && value.wire_kind === 'watashi.saved-route-intent.v1' && artifact(value.projection_of)
    && setRef(value.source_scenario_set_ref) && scenarioRef(value.selected_scenario_ref)
    && (value.visible_note === null || text(value.visible_note))
    && typeof value.saved_at === 'string' && Number.isFinite(Date.parse(value.saved_at)));
  return value;
}

function checkedIfApplicationResult(value, kind) {
  if (value?.status === 'PENDING') {
    requireValue(kind === 'scenario_set' && keys(value, ['status', 'operation_id', 'state', 'reason_codes', 'artifact'])
      && typeof value.operation_id === 'string'
      && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value.operation_id)
      && ['RESERVED', 'CALL_STARTED'].includes(value.state) && value.artifact === null
      && Array.isArray(value.reason_codes) && value.reason_codes.length === 1
      && value.reason_codes[0] === 'analysis_if_result_pending');
    return value;
  }
  if (value?.status === 'QUESTION_PENDING') {
    requireValue(kind === 'scenario_set' && keys(value, ['status', 'reason_codes', 'clarification_request', 'artifact'])
      && strings(value.reason_codes) && value.artifact === null);
    const question = value.clarification_request;
    requireValue(keys(question, ['clarification_id', 'core_id', 'parent_request_ref', 'target_unknown_ref', 'reason_code', 'prompt_private', 'skip_allowed', 'max_answer_count', 'answer_source_role', 'status'])
      && question.core_id === 'ANALYSIS' && question.answer_source_role === 'SIMULATION_SESSION_MATERIAL'
      && question.skip_allowed === true && question.max_answer_count === 1 && question.status === 'PENDING'
      && text(question.prompt_private));
    return value;
  }
  if (value?.status === 'SEPARATE_SAFETY') {
    requireValue(keys(value, ['status', 'reason_codes', 'clarification_request', 'artifact'])
      && strings(value.reason_codes) && value.clarification_request === null && value.artifact === null);
    return value;
  }
  requireValue(['scenario_set', 'saved_intent'].includes(kind)
    && keys(value, ['status', 'id', 'artifact_ref', 'kind', 'content_text', 'projection', 'idempotency_replayed'],
      kind === 'scenario_set' ? ['scenario_set_ref'] : ['selected_scenario_label'])
    && value.status === 'GENERATED' && value.kind === kind
    && typeof value.id === 'string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value.id)
    && value.artifact_ref === `artifact:${value.id.replace(/-/g, '')}@1`
    && typeof value.content_text === 'string' && typeof value.idempotency_replayed === 'boolean');
  const projection = kind === 'scenario_set' ? checkedIfProjection(value.projection) : checkedSavedProjection(value.projection);
  requireValue(projection.projection_of === value.artifact_ref);
  if (kind === 'scenario_set') requireValue(setRef(value.scenario_set_ref));
  if (kind === 'saved_intent' && value.selected_scenario_label !== undefined) requireValue(text(value.selected_scenario_label));
  return value;
}

function checkedIfList(value, kind) {
  requireValue(keys(value, ['status', 'items', 'limit', 'offset']) && value.status === 'ok'
    && Array.isArray(value.items) && Number.isInteger(value.limit) && value.limit >= 1
    && Number.isInteger(value.offset) && value.offset >= 0);
  value.items.forEach(item => checkedIfApplicationResult(item, kind));
  requireValue(new Set(value.items.map(item => item.id)).size === value.items.length);
  return value;
}

module.exports = { checkedIfProjection, checkedSavedProjection, checkedIfApplicationResult, checkedIfList };
