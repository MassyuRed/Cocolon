import { apiGet, apiPost } from "./apiClient";

export function getSubscriptionBootstrap(opts = {}) {
  return apiGet("/subscription/bootstrap", { ...opts, auth: false });
}

export function getSubscriptionMe(opts = {}) {
  return apiGet("/subscription/me", opts);
}

export function postSubscriptionUpdate(payload, opts = {}) {
  return apiPost("/subscription/update", payload || {}, opts);
}
