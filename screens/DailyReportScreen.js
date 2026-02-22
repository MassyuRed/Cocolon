// DailyReportScreen.js
// Phase2.5: クライアント生成を停止し、DB(myweb_reports)にあるレポートを表示するだけにする。
// - 画面表示時: MashOS /myweb/reports/ensure を呼んで不足分をサーバ生成（force=false）
// - その後: Supabase myweb_reports から最新1件を取得して表示（MyWebReportViewerScreen を利用）

import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import MyWebReportViewerScreen from "./MyWebReportViewerScreen";
import { ensureMyWebReports } from "./MyWebEnsureClient";

export default function DailyReportScreen({ onBack, onOpenMyProfile, onOpenSubscription }) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [report, setReport] = useState(null);

  const loadLatest = useCallback(async ({ force = false } = {}) => {
    setLoading(true);
    setErrorMsg("");

    // 1) サーバ側で不足分を生成（失敗しても表示は試みる）
    try {
      await ensureMyWebReports({ types: ["daily"], force: !!force });
    } catch (e) {
      // ここで落とさない（ネットワークなど）
      console.warn("DailyReportScreen: ensureMyWebReports failed", e);
    }

    // 2) DBから最新1件を取得
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setReport(null);
        setErrorMsg("ユーザー情報を取得できませんでした（ログインしてください）");
        return;
      }

      const { data, error } = await supabase
        .from("myweb_reports")
        .select("*")
        .eq("user_id", userId)
        .eq("report_type", "daily")
        .order("period_end", { ascending: false })
        .limit(1);

      if (error) throw error;

      const row = Array.isArray(data) && data.length > 0 ? data[0] : null;
      if (!row) {
        setReport(null);
        setErrorMsg("レポートがまだありません。まずは感情ログを入力してください。");
        return;
      }

      setReport(row);
    } catch (e) {
      setReport(null);
      setErrorMsg(String(e?.message || e || "取得に失敗しました"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  if (loading && !report) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={onBack} title="日報（DB表示）" onReload={() => loadLatest()} />
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.sub}>取得中…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBack={onBack} title="日報（DB表示）" onReload={() => loadLatest()} />
        <View style={styles.center}>
          <Text style={styles.error}>
            {errorMsg || "レポートを取得できませんでした。"}
          </Text>
          <TouchableOpacity
            style={styles.reloadBtn}
            onPress={() => loadLatest()}
            activeOpacity={0.85}
          >
            <Text style={styles.reloadText}>再取得</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <MyWebReportViewerScreen
      report={report}
      onBack={onBack}
      onOpenMyProfile={onOpenMyProfile}
      onOpenSubscription={onOpenSubscription}
    />
  );
}

function Header({ onBack, title, onReload }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => (typeof onBack === "function" ? onBack() : null)}
        style={styles.backBtn}
        activeOpacity={0.85}
      >
        <Text style={styles.backText}>← 戻る</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={onReload}
        style={styles.reloadBtnSmall}
        activeOpacity={0.85}
      >
        <Text style={styles.reloadSmallText}>更新</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  backBtn: { paddingVertical: 4, paddingRight: 8 },
  backText: { fontSize: 13, fontWeight: "700", color: "#374151" },
  headerTitle: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  reloadBtnSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  reloadSmallText: { fontSize: 12, fontWeight: "800", color: "#111827" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  sub: { marginTop: 10, color: "#6B7280", fontSize: 12, fontWeight: "700" },
  error: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 18,
  },
  reloadBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  reloadText: { fontSize: 13, fontWeight: "900", color: "#111827" },
});
