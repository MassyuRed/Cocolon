import { apiFetch } from "../apiClient";

async function request(path, { body, signal, expectedUserId } = {}) {
  // Source-bearing error bodies never enter the generic monitoring pipeline.
  const response = await apiFetch(path, {
    method: body ? "POST" : "GET", signal, expectedUserId, timeoutMs: 35000,
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
  get: (id, signal, expectedUserId) => request(`/emlis/threads/by-input/${encodeURIComponent(id)}`, { signal, expectedUserId }),
  answer: (id, body, signal, expectedUserId) => request(`/emlis/threads/${encodeURIComponent(id)}/answers`, { body, signal, expectedUserId }),
  frame: (id, body, signal, expectedUserId) => request(`/emlis/threads/${encodeURIComponent(id)}/frames`, { body, signal, expectedUserId }),
  action: (id, body, signal, expectedUserId) => request(`/emlis/threads/${encodeURIComponent(id)}/actions`, { body, signal, expectedUserId }),
};
