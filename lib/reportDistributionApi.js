import { apiGet, apiPatch } from "./apiClient";

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getReportDistributionSettings(params = {}) {
  const query = buildQuery(params);
  return apiGet(`/report-distribution/settings${query}`);
}

export async function patchReportDistributionSettings(payload) {
  return apiPatch("/report-distribution/settings", payload || {});
}
