import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

let __pendingOpenRouteFromNotification = null;
let __notificationOwner = { userId: null, phase: "initializing" };

export function setNotificationNavigationOwner(userId, ready = true) {
  const owner = String(userId || "").trim() || null;
  const phase = ready
    ? "ready"
    : __notificationOwner.phase === "initializing" ? "initializing" : "unavailable";
  __notificationOwner = { userId: ready ? owner : null, phase };
  const expected = __pendingOpenRouteFromNotification?.expectedUserId;
  if (expected && (phase === "unavailable" || (phase === "ready" && expected !== owner))) {
    __pendingOpenRouteFromNotification = null;
  }
  tryOpenRouteIfPending();
}

function hasRouteName(state, targetName) {
  if (!state) return false;
  const routes = state?.routes;
  if (!Array.isArray(routes)) return false;
  for (const r of routes) {
    if (r?.name === targetName) return true;
    if (hasRouteName(r?.state, targetName)) return true;
  }
  return false;
}

export function canNavigateToRoute(targetName) {
  try {
    const rootState = navigationRef.getRootState();
    return hasRouteName(rootState, targetName);
  } catch {
    return false;
  }
}

export function buildAnalysisRootNavigationParams(params) {
  return {
    screen: "Analysis",
    params: params || undefined,
  };
}

export function tryOpenRouteIfPending() {
  const target = __pendingOpenRouteFromNotification;
  if (!target?.name) return;
  if (target.expectedUserId) {
    if (__notificationOwner.phase === "initializing") return;
    if (__notificationOwner.phase !== "ready" || __notificationOwner.userId !== target.expectedUserId) {
      __pendingOpenRouteFromNotification = null;
      return;
    }
  }
  if (!navigationRef.isReady()) return;
  if (!canNavigateToRoute(target.name)) return;

  try {
    if (target.name === "Analysis") {
      navigationRef.navigate("Analysis", buildAnalysisRootNavigationParams(target.params));
    } else {
      navigationRef.navigate(target.name, target.params || undefined);
    }
    __pendingOpenRouteFromNotification = null;
  } catch {}
}

export function requestOpenRoute(target) {
  if (target?.expectedUserId && (__notificationOwner.phase === "unavailable"
    || (__notificationOwner.phase === "ready" && __notificationOwner.userId !== target.expectedUserId))) return;
  __pendingOpenRouteFromNotification = target || null;
  tryOpenRouteIfPending();
}
