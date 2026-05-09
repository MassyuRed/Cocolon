export const TABS = [
  { key: "piece", label: "投稿" },
  { key: "emotion_log", label: "感情通知" },
  { key: "recommend", label: "おすすめ" },
  { key: "history", label: "共鳴" },
];

export const PIECE_TUTORIAL_STEP_START = 13;
export const PIECE_TUTORIAL_STEP_END = 16;

export const OWNER_FILTER_ALL = "all";
export const OWNER_FILTER_SELF = "self";
export const OWNER_FILTER_USER = "user";

export const PIECE_ORDER_LATEST = "latest";
export const PIECE_ORDER_OLDEST = "oldest";
export const HISTORY_ORDER_LATEST = "newest";
export const HISTORY_ORDER_OLDEST = "oldest";

export function hasRouteNameInState(state, routeName) {
  if (!state) return false;

  const routeNames = state?.routeNames;
  if (Array.isArray(routeNames) && routeNames.includes(routeName)) return true;

  const routes = state?.routes;
  if (Array.isArray(routes)) {
    for (const r of routes) {
      if (r?.state && hasRouteNameInState(r.state, routeName)) return true;
    }
  }
  return false;
}

export function resolvePieceLibraryRouteName(navigation) {
  const candidates = ["PieceLibrary", "PieceLibraryScreen"];

  const root = navigation?.getRootState?.();
  const local = navigation?.getState?.();

  for (const name of candidates) {
    if (hasRouteNameInState(root, name) || hasRouteNameInState(local, name)) {
      return name;
    }
  }
  return "PieceLibrary";
}
