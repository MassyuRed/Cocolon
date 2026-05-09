import { useCallback, useState } from "react";

import {
  ROUTE_EMOTION_ANALYSIS,
  ROUTE_HOME,
  ROUTE_INPUT_HISTORY,
  ROUTE_SELF_STRUCTURE,
} from "./analysisRouteModel";

export function useAnalysisRouteState({ navigation }) {
  const [route, setRoute] = useState(ROUTE_HOME);
  const [reportType, setReportType] = useState("weekly");
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSelfReport, setSelectedSelfReport] = useState(null);
  const [reportHistoryBackRoute, setReportHistoryBackRoute] = useState(ROUTE_EMOTION_ANALYSIS);
  const [reportViewBackRoute, setReportViewBackRoute] = useState(ROUTE_EMOTION_ANALYSIS);
  const [historyBackRoute, setHistoryBackRoute] = useState(ROUTE_INPUT_HISTORY);
  const [todayQuestionHistoryBackRoute, setTodayQuestionHistoryBackRoute] = useState(ROUTE_INPUT_HISTORY);
  const [selfReportGenerateBackRoute, setSelfReportGenerateBackRoute] = useState(ROUTE_SELF_STRUCTURE);
  const [selfReportHistoryBackRoute, setSelfReportHistoryBackRoute] = useState(ROUTE_SELF_STRUCTURE);
  const [selfReportGenerateMode, setSelfReportGenerateMode] = useState("standard");

  const clearExternalOpenParams = useCallback(
    (patch) => {
      try {
        navigation?.setParams?.(patch);
      } catch {
        // noop
      }
      try {
        const parentNav =
          typeof navigation?.getParent === "function" ? navigation.getParent() : null;
        parentNav?.setParams?.(patch);
      } catch {
        // noop
      }
    },
    [navigation]
  );

  return {
    route,
    setRoute,
    reportType,
    setReportType,
    selectedReport,
    setSelectedReport,
    selectedSelfReport,
    setSelectedSelfReport,
    reportHistoryBackRoute,
    setReportHistoryBackRoute,
    reportViewBackRoute,
    setReportViewBackRoute,
    historyBackRoute,
    setHistoryBackRoute,
    todayQuestionHistoryBackRoute,
    setTodayQuestionHistoryBackRoute,
    selfReportGenerateBackRoute,
    setSelfReportGenerateBackRoute,
    selfReportHistoryBackRoute,
    setSelfReportHistoryBackRoute,
    selfReportGenerateMode,
    setSelfReportGenerateMode,
    clearExternalOpenParams,
  };
}
