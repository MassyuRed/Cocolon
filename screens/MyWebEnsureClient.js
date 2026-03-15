// MyWebEnsureClient.js
// Phase2.5: クライアント側の「生成/集計/保存」を廃止し、MashOS(MyWeb ensure API)に寄せるための薄いAPIクライアント

import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/apiClient";

// MashOS base
const API_BASE =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL ||
  process.env.EXPO_PUBLIC_MASHOS_URL ||
  "https://mashos-api.onrender.com";

const ENSURE_ENDPOINT = `${API_BASE}/myweb/reports/ensure`;

async function getAccessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

/**
 * MashOS: MyWebレポート ensure（不足があればサーバ側で生成してDBへupsert）
 * @param {Object} args
 * @param {Array<"daily"|"weekly"|"monthly">} args.types
 * @param {boolean} args.force
 * @param {AbortSignal=} args.signal
 */
export async function ensureMyWebReports({ types, force = false, signal } = {}) {
  const t =
    Array.isArray(types) && types.length > 0
      ? types
      : ["daily", "weekly", "monthly"];

  const accessToken = await getAccessToken();

  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await apiFetch(ENSURE_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ types: t, force: !!force }),
    signal,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) detail = String(j.detail);
    } catch {
      // ignore
    }
    const err = new Error(detail);
    err.httpStatus = res.status;
    throw err;
  }

  return await res.json();
}
