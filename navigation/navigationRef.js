import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

let __pendingOpenRouteFromNotification = null;

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
  __pendingOpenRouteFromNotification = target || null;
  tryOpenRouteIfPending();
}
