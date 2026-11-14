import { apiFetch } from '../apiClient';
import { checkedIfApplicationResult, checkedIfList } from '../../components/selfStructure/ifRouteContract';

const routes = {
  scenario_set: '/analysis/if-route/scenario-sets',
  saved_intent: '/analysis/saved-route-intents',
};

async function request(kind, { id, body, method = 'GET', signal, expectedUserId, offset = 0 } = {}) {
  if (!routes[kind] || !expectedUserId) throw new Error('analysis_if_request_invalid');
  const path = routes[kind] + (id ? `/${encodeURIComponent(id)}`
    : method === 'GET' ? `?limit=60&offset=${offset}` : '');
  const response = await apiFetch(path, {
    method, signal, expectedUserId, timeoutMs: method === 'POST' ? 220000 : 15000,
    headers: { 'Cache-Control': 'no-store' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    const error = new Error('analysis_if_request_failed');
    error.status = response.status;
    throw error;
  }
  const result = await response.json();
  if (method === 'DELETE') {
    if (result?.deleted !== true || result.id !== id || Object.keys(result).length !== 2) {
      throw new Error('analysis_if_contract_invalid');
    }
    return result;
  }
  return method === 'GET' && !id ? checkedIfList(result, kind) : checkedIfApplicationResult(result, kind);
}

export const analysisIfRouteApi = {
  create: (body, options) => request('scenario_set', { ...options, body, method: 'POST' }),
  save: (body, options) => request('saved_intent', { ...options, body, method: 'POST' }),
  list: (kind, options) => request(kind, options),
  get: (kind, id, options) => request(kind, { ...options, id }),
  delete: (kind, id, options) => request(kind, { ...options, id, method: 'DELETE' }),
};
