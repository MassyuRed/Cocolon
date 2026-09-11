import { apiFetch } from "../apiClient";

// Q2 is a development application candidate. Opt in locally only after applying
// the migration to a development database and enabling the API development gate.
const Q2_DEVELOPMENT_OPT_IN = false;
export const EMLIS_THREADS_ENABLED = typeof __DEV__ !== "undefined" && __DEV__ && Q2_DEVELOPMENT_OPT_IN;

async function request(path, { body, signal } = {}) {
  // Source-bearing error bodies never enter the generic monitoring pipeline.
  const response = await apiFetch(path, {
    method: body ? "POST" : "GET", signal, timeoutMs: 35000,
    headers: { "Cache-Control": "no-store" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const error = new Error("emlis_thread_request_failed");
    error.status = response.status;
    throw error;
  }
  const result = await response.json();
  if (result?.schema_version !== "cocolon.emlis_thread.application.v1") {
    throw new Error("emlis_thread_contract_unavailable");
  }
  return result;
}

export const emlisThreadApi = {
  get: (id, signal) => request(`/emlis/threads/by-input/${encodeURIComponent(id)}`, { signal }),
  answer: (id, body, signal) => request(`/emlis/threads/${encodeURIComponent(id)}/answers`, { body, signal }),
  frame: (id, body, signal) => request(`/emlis/threads/${encodeURIComponent(id)}/frames`, { body, signal }),
  action: (id, body, signal) => request(`/emlis/threads/${encodeURIComponent(id)}/actions`, { body, signal }),
};
