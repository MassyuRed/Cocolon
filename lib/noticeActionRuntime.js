import { Linking } from "react-native";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asString(value) {
  const text = String(value || "").trim();
  return text || "";
}

function normalizeKind(value) {
  const kind = asString(value).toLowerCase() || "none";
  if (kind === "url" || kind === "internal_route") return kind;
  return "none";
}

function normalizePlacement(value) {
  const placement = asString(value).toLowerCase() || "button";
  if (placement === "inline" || placement === "button" || placement === "both") {
    return placement;
  }
  return "button";
}

export function normalizeNoticeAction(raw, fallbackKey = null) {
  const obj = asObject(raw);
  const kind = normalizeKind(obj.kind);
  const label = asString(obj.label);
  const route = asString(obj.route) || null;
  const url = asString(obj.url) || null;
  const key = asString(obj.key) || (fallbackKey ? String(fallbackKey) : null);
  const params = asObject(obj.params);
  const placement = normalizePlacement(obj.placement);

  if (!label || kind === "none") return null;
  if (kind === "url" && !url) return null;
  if (kind === "internal_route" && !route) return null;

  return {
    key,
    label,
    kind,
    route,
    params,
    url,
    placement,
  };
}

export function normalizeNoticeActions(rawActions, fallbackCta = null) {
  const source = Array.isArray(rawActions) ? rawActions : [];
  const out = [];
  const seen = new Set();

  source.forEach((raw, index) => {
    const action = normalizeNoticeAction(raw, `action_${index + 1}`);
    if (!action) return;
    const signature = `${action.key || ""}|${action.kind}|${action.route || ""}|${action.url || ""}|${action.label}`;
    if (seen.has(signature)) return;
    seen.add(signature);
    out.push(action);
  });

  if (!out.length) {
    const fallback = normalizeNoticeAction(
      {
        ...asObject(fallbackCta),
        key: asObject(fallbackCta).key || "cta_fallback",
        placement: asObject(fallbackCta).placement || "button",
      },
      "cta_fallback",
    );
    if (fallback) out.push(fallback);
  }

  return out;
}

export function normalizeNoticeBodySegments(rawSegments, fallbackBody = "") {
  const segments = Array.isArray(rawSegments) ? rawSegments : [];
  const out = [];
  segments.forEach((segment) => {
    const obj = asObject(segment);
    const type = asString(obj.type).toLowerCase() || "text";
    const text = String(obj.text || "");
    if (!text) return;
    const item = {
      type: type === "action" ? "action" : "text",
      text,
    };
    const actionKey = asString(obj.action_key);
    if (actionKey) item.action_key = actionKey;
    out.push(item);
  });

  if (out.length) return out;

  const bodyText = String(fallbackBody || "");
  if (!bodyText) return [];
  return [{ type: "text", text: bodyText }];
}

export function getNoticeButtonActions(rawActions, fallbackCta = null) {
  return normalizeNoticeActions(rawActions, fallbackCta).filter((action) => {
    const placement = normalizePlacement(action?.placement);
    return placement === "button" || placement === "both";
  });
}

export function findNoticeActionByKey(rawActions, key) {
  const safeKey = asString(key);
  if (!safeKey) return null;
  const actions = normalizeNoticeActions(rawActions, null);
  return actions.find((action) => asString(action?.key) === safeKey) || null;
}

export async function openNoticeAction(action, { openInternalRoute } = {}) {
  const normalized = normalizeNoticeAction(action);
  if (!normalized) return false;

  if (normalized.kind === "url") {
    await Linking.openURL(normalized.url);
    return true;
  }

  if (normalized.kind === "internal_route") {
    const opened = typeof openInternalRoute === "function"
      ? openInternalRoute(normalized.route, normalized.params || {})
      : false;
    if (!opened) {
      throw new Error("遷移先を開けませんでした。");
    }
    return true;
  }

  return false;
}
