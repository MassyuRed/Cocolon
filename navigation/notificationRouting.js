import { ANALYSIS_WIRE } from "../lib/compat/legacyWireContracts";
import { requestOpenRoute } from "./navigationRef";

const LEGACY_ANALYSIS_ROUTE_NAME = ["My", "Web"].join("");

export function buildAnalysisNotificationParams(data) {
  const now = Date.now();
  const type = String(data?.type || "").trim().toLowerCase();
  const openMode = String(data?.open_mode || "").trim();
  const reportType = String(data?.report_type || "").trim().toLowerCase();
  const selfReportType = String(data?.self_report_type || "").trim().toLowerCase();

  if (type === "report_distribution") {
    if (openMode === "reportHistory" && ["daily", "weekly", "monthly"].includes(reportType)) {
      return {
        openReportHistory: true,
        openReportHistoryType: reportType,
        openReportHistoryAt: now,
      };
    }
    if (openMode === "selfReportHistory" && selfReportType === "monthly") {
      return {
        openSelfReportHistory: true,
        openSelfReportHistoryAt: now,
      };
    }
    return {
      openDistributionHome: true,
      openDistributionHomeAt: now,
    };
  }

  if (["daily", "weekly", "monthly"].includes(reportType)) {
    return {
      openReportHistory: true,
      openReportHistoryType: reportType,
      openReportHistoryAt: now,
    };
  }

  return {
    openDistributionHome: true,
    openDistributionHomeAt: now,
  };
}

export function resolveNotificationTargetRoute(remoteMessage) {
  const data = remoteMessage?.data || {};
  const type = String(data?.type || "").trim().toLowerCase();
  const screen = String(data?.screen || "").trim();

  if (type === "today_question" || screen === "Input") {
    return { name: "Input" };
  }
  if (type === "report_distribution") {
    return { name: "Analysis", params: buildAnalysisNotificationParams(data) };
  }
  if (type === ANALYSIS_WIRE.routes.reportType || screen === "Analysis" || screen === LEGACY_ANALYSIS_ROUTE_NAME) {
    return { name: "Analysis", params: buildAnalysisNotificationParams(data) };
  }
  return { name: "Piece", params: { screen: "EmotionLog" } };
}


export function requestOpenRouteFromNotification(remoteMessage) {
  requestOpenRoute(resolveNotificationTargetRoute(remoteMessage));
}
