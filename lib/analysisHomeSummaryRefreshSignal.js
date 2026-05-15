import AsyncStorage from "@react-native-async-storage/async-storage";

const ANALYSIS_HOME_SUMMARY_DIRTY_KEY = "cocolon:analysisHomeSummaryDirty:v1";

export async function markAnalysisHomeSummaryDirty() {
  try {
    await AsyncStorage.setItem(
      ANALYSIS_HOME_SUMMARY_DIRTY_KEY,
      JSON.stringify({ saved_at: Date.now() })
    );
  } catch {
    // best-effort signal only
  }
}

export async function consumeAnalysisHomeSummaryDirty() {
  try {
    const raw = await AsyncStorage.getItem(ANALYSIS_HOME_SUMMARY_DIRTY_KEY);
    if (!raw) return false;
    await AsyncStorage.removeItem(ANALYSIS_HOME_SUMMARY_DIRTY_KEY);
    return true;
  } catch {
    return false;
  }
}
