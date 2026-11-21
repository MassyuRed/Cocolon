import { useCallback, useState } from "react";

import {
  ROUTE_HOME,
  ROUTE_SELF_STRUCTURE,
} from "./analysisRouteModel";

export function useAnalysisRouteState({ navigation }) {
  const [route, setRoute] = useState(ROUTE_HOME);
  const [selectedSelfReport, setSelectedSelfReport] = useState(null);
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
    selectedSelfReport,
    setSelectedSelfReport,
    selfReportGenerateBackRoute,
    setSelfReportGenerateBackRoute,
    selfReportHistoryBackRoute,
    setSelfReportHistoryBackRoute,
    selfReportGenerateMode,
    setSelfReportGenerateMode,
    clearExternalOpenParams,
  };
}
