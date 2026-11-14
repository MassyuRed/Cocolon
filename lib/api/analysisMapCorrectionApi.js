import { apiFetch } from '../apiClient';
import { checkedMapCorrectionResult } from '../../components/selfStructure/mapCorrectionContract';

const path = '/self-structure/map-corrections';

async function request(payload, options, confirm) {
  if (!options?.expectedUserId || typeof payload?.idempotency_key !== 'string') {
    throw new Error('analysis_map_correction_request_invalid');
  }
  const response = await apiFetch(confirm ? `${path}?idempotency_key=${encodeURIComponent(payload.idempotency_key)}` : path, {
    method: confirm ? 'GET' : 'POST', expectedUserId: options.expectedUserId, signal: options.signal,
    timeoutMs: confirm ? 15000 : 35000, headers: { 'Cache-Control': 'no-store' },
    ...(!confirm ? { body: JSON.stringify(payload) } : {}),
  });
  if (!response.ok) {
    // Source-bearing bodies never enter the generic error/monitoring path.
    const error = new Error('analysis_map_correction_request_failed');
    error.status = response.status;
    throw error;
  }
  return checkedMapCorrectionResult(await response.json(), payload);
}

export const analysisMapCorrectionApi = {
  create: (payload, options) => request(payload, options, false),
  confirm: (payload, options) => request(payload, options, true),
};
