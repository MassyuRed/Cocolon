export const HIDDEN_SCREENS = new Set([]);
export const MAIN_TAB_ROUTES = new Set(["Input", "Analysis", "Piece", "RankingTop", "Settings"]);

export const SELF_STRUCTURE_LATEST_STATUS_POLL_MS = 20 * 1000;
export const SELF_STRUCTURE_BANNER_AUTO_HIDE_MS = 4500;
export const SCREEN_PREFETCH_MIN_INTERVAL_MS = 2 * 60 * 1000;
export const SCREEN_PREFETCH_DEFER_MS = 1200;
export const UNREAD_PREFETCH_MIN_INTERVAL_MS = 15 * 1000;
export const EMOTION_LOG_UNREAD_POLL_MS = 30 * 1000;
export const ANALYSIS_STARTUP_WARMUP_MIN_INTERVAL_MS = 60 * 1000;
export const ANALYSIS_STARTUP_REVALIDATE_DELAY_MS = 1800;
export const ANALYSIS_SELF_STRUCTURE_LATEST_SEEN_VERSION_KEY = "cocolon:selfStructureLatestSeenVersion";
export const ANALYSIS_SELF_STRUCTURE_HISTORY_FETCH_LIMIT = 200;
export const ANALYSIS_REPORT_READ_STATUS_CHUNK_SIZE = 60;

export const PIECE_SUB_ROUTES = new Set([
  "ResonanceHistoryList",
  "ResonanceHistoryDetail",
  "PieceLibrary",
  "PieceLibraryScreen",
  "PieceHistory",
  "EmotionLog",
  "TutorialFlow",
]);
