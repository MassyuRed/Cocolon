import { Linking } from "react-native";

import { API_BASE_URL, apiFetch } from "../lib/apiClient";
import { buildPublicProfileByShareCodePath } from "../lib/compat/legacyWireContracts";
import { requestOpenRoute } from "./navigationRef";

const SHARE_PROFILE_API_BASE_URL = API_BASE_URL;
const APP_LINK_PREFIXES = ["cocolon://", "https://emlis.app", "http://emlis.app"];

export function extractShareCodeFromIncomingUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return "";

  const patterns = [
    /^https?:\/\/emlis\.app\/u\/([^/?#]+)/i,
    /^cocolon:\/\/u\/([^/?#]+)/i,
    /^cocolon:\/\/emlis\.app\/u\/([^/?#]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }

  return "";
}

export async function resolveSharedProfileUserId(shareCode) {
  const code = String(shareCode || "").trim();
  if (!code) return null;

  try {
    const url = `${SHARE_PROFILE_API_BASE_URL}${buildPublicProfileByShareCodePath(code)}`;
    const res = await apiFetch(url, {
      method: "GET",
      auth: false,
      headers: { accept: "application/json" },
    });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    const userId = String(json?.user_id || "").trim();
    return userId || null;
  } catch (e) {
    console.warn("resolveSharedProfileUserId error:", e);
    return null;
  }
}

export function requestOpenSharedAccountRoute(viewedUserId) {
  const userId = String(viewedUserId || "").trim();
  if (!userId) return;

  requestOpenRoute({
    name: "Piece",
    params: {
      screen: "Account",
      params: { viewedUserId: userId },
    },
  });
}

export async function handleIncomingAppUrl(rawUrl) {
  const shareCode = extractShareCodeFromIncomingUrl(rawUrl);
  if (!shareCode) return false;

  const userId = await resolveSharedProfileUserId(shareCode);
  if (!userId) return true;

  requestOpenSharedAccountRoute(userId);
  return true;
}

export const appLinking = {
  prefixes: APP_LINK_PREFIXES,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (!url) return null;

    const handled = await handleIncomingAppUrl(url);
    return handled ? null : url;
  },
  subscribe(listener) {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      Promise.resolve(handleIncomingAppUrl(url))
        .then((handled) => {
          if (!handled) listener(url);
        })
        .catch(() => {
          listener(url);
        });
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {}
    };
  },
};
