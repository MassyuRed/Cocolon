import { Alert } from "react-native";
import { useCallback } from "react";

import {
  normalizeSelfStructureMode,
  ROUTE_SELF_REPORT_GENERATE,
  ROUTE_SELF_REPORT_HISTORY,
  ROUTE_SELF_REPORT_VIEW,
  ROUTE_SELF_STRUCTURE,
} from "./analysisRouteModel";

export function useAnalysisSelfStructureActions({
  ensurePaid,
  navigation,
  setRoute,
  setSelectedSelfReport,
  setSelfReportGenerateMode,
  setSelfReportGenerateBackRoute,
  setSelfReportHistoryBackRoute,
}) {
  const openSelfStructureRoute = useCallback(
    async ({ targetRoute, backRoute = "home" }) => {
      try {
        const ok = await (typeof ensurePaid === "function" ? ensurePaid() : false);

        if (ok) {
          setSelectedSelfReport(null);
          setSelfReportGenerateBackRoute(backRoute);
          setRoute(targetRoute);
          return;
        }

        const goSubscription = () => {
          try {
            if (navigation?.navigate) {
              navigation.navigate("SubscriptionSelect");
              return;
            }
          } catch {
            // no-op
          }

          Alert.alert("プラン確認", "加入画面を開けませんでした。もう一度お試しください。");
        };

        Alert.alert(
          "自己分析レポート",
          "自己分析レポートはPlusプラン以上で利用できます。\n\nPlusプラン以上で本文の閲覧が可能になります。",
          [
            { text: "閉じる", style: "cancel" },
            { text: "プランを見る", onPress: goSubscription },
          ]
        );
      } catch {
        Alert.alert(
          "プラン確認",
          "プラン情報を取得できませんでした。通信状況を確認してもう一度お試しください。"
        );
      }
    },
    [ensurePaid, navigation, setRoute, setSelectedSelfReport, setSelfReportGenerateBackRoute]
  );

  const openSelfReportLatest = useCallback(
    (nextMode = "standard", backRoute = ROUTE_SELF_STRUCTURE) => {
      setSelfReportGenerateMode(normalizeSelfStructureMode(nextMode));
      openSelfStructureRoute({
        targetRoute: ROUTE_SELF_REPORT_GENERATE,
        backRoute,
      });
    },
    [openSelfStructureRoute, setSelfReportGenerateMode]
  );

  const openSelfReportHistory = useCallback(
    (backRoute = ROUTE_SELF_STRUCTURE) => {
      const nextBackRoute = backRoute || ROUTE_SELF_STRUCTURE;
      setSelfReportHistoryBackRoute(nextBackRoute);
      openSelfStructureRoute({
        targetRoute: ROUTE_SELF_REPORT_HISTORY,
        backRoute: nextBackRoute,
      });
    },
    [openSelfStructureRoute, setSelfReportHistoryBackRoute]
  );

  const openSelfReportView = useCallback(
    (report) => {
      setSelectedSelfReport(report || null);
      setRoute(ROUTE_SELF_REPORT_VIEW);
    },
    [setRoute, setSelectedSelfReport]
  );

  return {
    openSelfStructureRoute,
    openSelfReportLatest,
    openSelfReportHistory,
    openSelfReportView,
  };
}
