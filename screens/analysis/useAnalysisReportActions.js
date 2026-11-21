import { useCallback, useRef, useState } from "react";
import { apiGet } from "../../lib/apiClient";
import { SELF_STRUCTURE_WIRE } from "../../lib/compat/legacyWireContracts";
import { resolveSelfStructureUpdatedAt } from "./analysisRouteModel";

export function useAnalysisReportActions() {
  const refreshSequence = useRef(0);
  const [entryMeta, setEntryMeta] = useState({ selfStructureLatestDate: null });

  const refreshHomeSummaries = useCallback(async () => {
    const sequence = ++refreshSequence.current;
    try {
      const status = await apiGet(SELF_STRUCTURE_WIRE.routes.latestStatus);
      if (sequence !== refreshSequence.current) return;
      setEntryMeta({
        selfStructureLatestDate: status?.has_visible_content ? resolveSelfStructureUpdatedAt(status) : null,
      });
    } catch (error) {
      if (sequence === refreshSequence.current) {
        console.warn("AnalysisScreen: failed to refresh self-structure latest status", error);
      }
    }
  }, []);

  return { entryMeta, refreshHomeSummaries };
}
