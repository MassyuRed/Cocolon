import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Supabase
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";

// 既存
import MyWebHistoryScreen from "./MyWebHistoryScreen";
import WeeklyReportMockScreen from "./WeeklyReportMockScreen";
import MonthlyReportMockScreen from "./MonthlyReportMockScreen";
import MyWebReportHistoryScreen from "./MyWebReportHistoryScreen";
import MyWebReportViewerScreen from "./MyWebReportViewerScreen";
import DeepInsightScreen from "./DeepInsightScreen";
import MyModelCreateScreen from "./MyModelCreateScreen";
import SelfStructureReportHistoryScreen from "./SelfStructureReportHistoryScreen";
import SelfStructureReportViewerScreen from "./SelfStructureReportViewerScreen";
import SelfStructureReportGenerateScreen from "./SelfStructureReportGenerateScreen";

// 🎨 テーマコンテキスト
import { useTheme } from "../theme/ThemeContext";

// 🔴 Unread badge state (screen ⇄ bottom tab)
import { useUnread } from "../UnreadContext";
import { useSubscription } from "../SubscriptionContext";

// UI (Design System)
import CocolonPressable from "../components/CocolonPressable";
import { makeUiTokens } from "../ui/uiTokens";


// Home / MyModel の見た目に合わせたパネル高さ（だいたいの値）
const PANEL_MIN_HEIGHT = 690;

// Phase2: MyWeb（配布/生成）はMashOS側でensure（オンデマンド）
const MYMODEL_API_BASE_URL =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const MYWEB_REPORTS_ENSURE_ENDPOINT = `${MYMODEL_API_BASE_URL}/myweb/reports/ensure`;

function useThemedStyles() {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";
  return { styles, colors, themeName, isDark, ui };
}

export default function MyWebScreen({ onOpenMyProfile, navigation, onTabUnreadChange }) {
  const { setUnreadGroup, getFeatureUnread } = useUnread();
  const { ensurePaid, ensurePremium, isPaid, loading: subscriptionLoading } = useSubscription();

  // 'home' | 'history' | 'reportHistory' | 'reportView' | 'selfReportHistory' | 'selfReportView' | 'selfReportGenerate' | 'weekly' | 'monthly' | 'deepInsight' | 'mymodelCreate'
  const [route, setRoute] = useState("home");
  const [reportType, setReportType] = useState("weekly"); // 'weekly' | 'monthly'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedSelfReport, setSelectedSelfReport] = useState(null);

  // 未読バッジ（●）用：MyWeb（週/月）ごとの未読状態
  const [unreadByType, setUnreadByType] = useState(() => ({
    weekly: !!getFeatureUnread("MyWeb", "weekly"),
    monthly: !!getFeatureUnread("MyWeb", "monthly"),
    selfStructure: !!getFeatureUnread("MyWeb", "selfStructure"),
  }));

  // MyModel Create 未完バッジ（●）
  const [unreadMyModelCreate, setUnreadMyModelCreate] = useState(() => !!getFeatureUnread("MyWeb", "mymodelCreate"));

  // 起動時プリロード（App側の prefetch）と画面状態を同期
  // - App 起動直後に UnreadContext が更新された場合でも、画面内バッジが遅れて点灯しないようにする
  useEffect(() => {
    const next = {
      weekly: !!getFeatureUnread("MyWeb", "weekly"),
      monthly: !!getFeatureUnread("MyWeb", "monthly"),
      selfStructure: !!getFeatureUnread("MyWeb", "selfStructure"),
    };

    setUnreadByType((prev) => {
      const p = prev || { weekly: false, monthly: false, selfStructure: false };
      if (
        p.weekly === next.weekly &&
        p.monthly === next.monthly &&
        p.selfStructure === next.selfStructure
      ) {
        return p;
      }
      return next;
    });

    const nextCreate = !!getFeatureUnread("MyWeb", "mymodelCreate");
    setUnreadMyModelCreate((prev) => {
      if (!!prev === nextCreate) return prev;
      return nextCreate;
    });
  }, [getFeatureUnread]);



  // (hooks moved to the top of the component)

  // BottomTab の未読バッジ（赤丸）連動
  useEffect(() => {
    // 自己構造（selfStructure）は Plus/Premium のみ未読バッジ対象
    const effectiveSelfStructureUnread = !subscriptionLoading && !!isPaid && !!unreadByType.selfStructure;

    const hasUnread = !!(
      unreadByType.weekly ||
      unreadByType.monthly ||
      effectiveSelfStructureUnread ||
      unreadMyModelCreate
    );

    try {
      if (typeof onTabUnreadChange === "function") {
        onTabUnreadChange(hasUnread);
      }
    } catch {
      // noop
    }

    try {
      // UnreadContext: "MyWeb" タブの赤●を画面内の未読バッジと同期
      setUnreadGroup("MyWeb", {
        weekly: !!unreadByType.weekly,
        monthly: !!unreadByType.monthly,
        selfStructure: !!effectiveSelfStructureUnread,
        mymodelCreate: !!unreadMyModelCreate,
      });
    } catch {
      // noop
    }
  }, [
    unreadByType.weekly,
    unreadByType.monthly,
    unreadByType.selfStructure,
    unreadMyModelCreate,
    isPaid,
    subscriptionLoading,
    onTabUnreadChange,
    setUnreadGroup,
  ]);

  const { styles, colors, isDark } = useThemedStyles();

  // ------------------------------------------------------------
  // Tab reselect → MyWeb "home" に戻す
  // - MyWeb は画面内で route state を持っているため、
  //   同じタブを再タップしたときにメイン（home）へ戻す。
  // ------------------------------------------------------------
  const routeRef = useRef(route);
  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // タブ切替（他タブ→MyWeb）ではなく「MyWebを表示中の再タップ」だけに反応する
      const focused =
        typeof navigation?.isFocused === "function" ? navigation.isFocused() : false;
      if (!focused) return;

      if (routeRef.current && routeRef.current !== "home") {
        try {
          e?.preventDefault?.();
        } catch {
          // noop
        }
        // 選択状態もクリアしておく（homeへ戻ったときの混入を防ぐ）
        setSelectedReport(null);
        setSelectedSelfReport(null);
        setRoute("home");
      }
    });

    return unsubscribe;
  }, [navigation]);


  // レポートを開いた時に既読登録（report_reads に upsert）
  const markReportRead = useCallback(async (report) => {
    const reportId = report?.id || null;
    if (!reportId) return;

    try {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const { error } = await supabase
        .from("report_reads")
        .upsert(
          { user_id: userId, report_id: reportId },
          {
            onConflict: "user_id,report_id",
            ignoreDuplicates: true,
          }
        );

      if (error) throw error;
    } catch (e) {
      // 既読付けに失敗しても致命的ではないので握りつぶす（ログだけ）
      console.warn("MyWebScreen: failed to mark report read", e);
    }
  }, [isPaid]);

  // MyWeb（日/週/月）の未読状態を更新
  const refreshUnreadBadges = useCallback(async () => {
    const TYPES = ["weekly", "monthly"];
    const LIMIT = 20; // 直近N件の中に未読があるかを見る

    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setUnreadByType({ weekly: false, monthly: false, selfStructure: false });
        return;
      }

      // 1) 各タイプの直近レポートIDを取得
      const idsByType = {
        weekly: [],
        monthly: [],
        selfStructure: [],
      };

      await Promise.all(
        TYPES.map(async (t) => {
          const { data, error } = await supabase
            .from("myweb_reports")
            .select("id")
            .eq("user_id", userId)
            .eq("report_type", t)
            .order("generated_at", { ascending: false })
            .order("updated_at", { ascending: false })
            .limit(LIMIT);

          if (error) throw error;

          idsByType[t] = (Array.isArray(data) ? data : [])
            .map((r) => r?.id)
            .filter(Boolean);
        })
      );

      // 1b) 自己構造（月次）の直近レポートIDを取得
      // - Free では未読バッジ対象外のため取得しない（RLS/負荷対策）
      if (isPaid) {
        try {
          const { data: selfData, error: selfErr } = await supabase
            .from("myprofile_reports")
            .select("id")
            .eq("user_id", userId)
            .eq("report_type", "monthly")
            .order("period_end", { ascending: false })
            .order("generated_at", { ascending: false })
            .order("updated_at", { ascending: false })
            .limit(LIMIT);

          if (!selfErr) {
            idsByType.selfStructure = (Array.isArray(selfData) ? selfData : [])
              .map((r) => r?.id)
              .filter(Boolean);
          } else {
            idsByType.selfStructure = [];
          }
        } catch (e) {
          // best-effort: selfStructure は取得できなくても週/月の未読判定は続行する
          idsByType.selfStructure = [];
        }
      } else {
        idsByType.selfStructure = [];
      }

      const allIds = Array.from(
        new Set([
          ...idsByType.weekly,
          ...idsByType.monthly,
          ...idsByType.selfStructure,
        ])
      );

      // 2) 直近レポートIDの中で、既読済みIDをまとめて取得
      let readSet = new Set();
      if (allIds.length > 0) {
        const { data: reads, error: rErr } = await supabase
          .from("report_reads")
          .select("report_id")
          .eq("user_id", userId)
          .in("report_id", allIds);

        if (rErr) throw rErr;

        readSet = new Set(
          (Array.isArray(reads) ? reads : [])
            .map((r) => r?.report_id)
            .filter(Boolean)
        );
      }

      // 3) タイプ別に「未読が1つでもあるか」を判定
      setUnreadByType({
        weekly: idsByType.weekly.some((id) => !readSet.has(id)),
        monthly: idsByType.monthly.some((id) => !readSet.has(id)),
        selfStructure: idsByType.selfStructure.some((id) => !readSet.has(id)),
      });
    } catch (e) {
      console.warn("MyWebScreen: failed to refresh unread badges", e);
      setUnreadByType({ weekly: false, monthly: false, selfStructure: false });
    }
  }, []);

  // MyModel Create（未完バッジ）を更新
  const refreshMyModelCreateBadge = useCallback(async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token ?? null;
      if (!accessToken) {
        setUnreadMyModelCreate(false);
        return;
      }

      // まず Light を取得（Free でも必ず存在する想定）
      const resLight = await fetch(
        `${MYMODEL_API_BASE_URL}/mymodel/create/questions?build_tier=light`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!resLight.ok) {
        setUnreadMyModelCreate(false);
        return;
      }

      const jsonLight = await resLight.json().catch(() => null);

      let answeredCount = Number(jsonLight?.meta?.answered_count ?? 0);
      let totalQuestions = Number(jsonLight?.meta?.total_questions ?? 0);

      const subscriptionTier = String(jsonLight?.meta?.subscription_tier ?? "").toLowerCase();
      const isPaid = subscriptionTier === "plus" || subscriptionTier === "premium";

      // 将来：サブスク加入で追加質問（standard）が増えたときも、全回答までバッジを出す
      if (isPaid) {
        try {
          const resStd = await fetch(
            `${MYMODEL_API_BASE_URL}/mymodel/create/questions?build_tier=standard`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (resStd.ok) {
            const jsonStd = await resStd.json().catch(() => null);
            answeredCount += Number(jsonStd?.meta?.answered_count ?? 0);
            totalQuestions += Number(jsonStd?.meta?.total_questions ?? 0);
          }
        } catch {
          // ignore (fallback to light only)
        }
      }

      // MyModel Create を「開く前に存在を知らせる」ため、
      // 0/10 でも未回答があればバッジを出す（全回答で消える）。
      const hasUnanswered = totalQuestions > 0 ? answeredCount < totalQuestions : false;

      setUnreadMyModelCreate(!!hasUnanswered);
    } catch {
      setUnreadMyModelCreate(false);
    }
  }, []);

  const openReportHistory = (type) => {
    setReportType(type);
    setSelectedReport(null);
    setRoute("reportHistory");
  };

  const openSelfReportHistory = useCallback(async () => {
    try {
      const ok = await (typeof ensurePremium === "function" ? ensurePremium() : false);

      if (ok) {
        setSelectedSelfReport(null);
        setRoute("selfReportHistory");
        return;
      }

      // free -> subscription誘導（文言を明確化）
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
        "自己構造分析レポート",
        "自己構造分析レポートはPlus会員以上で利用できます。\n\nPlus会員以上で本文の閲覧とPDF保存が可能になります。",
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
  }, [ensurePaid, navigation]);

  const openSelfReportView = useCallback((report) => {
    setSelectedSelfReport(report || null);
    setRoute("selfReportView");
  }, []);

  const openReportView = useCallback(
    (report) => {
      setSelectedReport(report || null);
      setRoute("reportView");
      // 既読付けは裏で実行（画面遷移の体感を優先）
      markReportRead(report);
    },
    [markReportRead]
  );

  // ✅ Paywall CTA: SubscriptionSelect へ遷移（ナビが無い場合も落とさない）
  const openSubscriptionSelect = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // no-op
    }
    Alert.alert("プラン確認", "加入画面を開けませんでした。もう一度お試しください。");
  }, [navigation]);

  // ✅ Deep Insight: Premium only
  const openDeepInsight = useCallback(async () => {
    try {
      const ok = await (typeof ensurePremium === "function" ? ensurePremium() : false);

      if (ok) {
        setRoute("deepInsight");
        return;
      }

      // free -> subscription誘導（自己構造分析レポートと同様にポップアップを挟む）
      Alert.alert(
        "Deep Insight",
        "Deep InsightはPremium会員以上で利用できます。\n\nPremium会員以上で本文の閲覧が可能になります。",
        [
          { text: "閉じる", style: "cancel" },
          { text: "プランを見る", onPress: openSubscriptionSelect },
        ]
      );
    } catch {
      Alert.alert(
        "プラン確認",
        "プラン情報を取得できませんでした。通信状況を確認してもう一度お試しください。"
      );
    }
  }, [ensurePaid, openSubscriptionSelect]);

  // MyModel タブへ移動（ナビが無い場合も落とさない）
  const openMyModelBuild = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("MyModel");
        return;
      }
    } catch {
      // no-op
    }

    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("MyModel");
        return;
      }
    } catch {
      // no-op
    }

    Alert.alert("移動できませんでした", "MyModelを開けませんでした。もう一度お試しください。");
  }, [navigation]);


  // Cocolonガイド（MyWeb）
  const openGuide = useCallback(() => {
    try {
      if (navigation?.navigate) {
        navigation.navigate("CocolonGuide", { screenId: "myweb" });
        return;
      }
    } catch {
      // no-op
    }

    // Fallback: parent navigation（念のため）
    try {
      const parent =
        typeof navigation?.getParent === "function" ? navigation.getParent() : null;
      if (parent && typeof parent.navigate === "function") {
        parent.navigate("CocolonGuide", { screenId: "myweb" });
      }
    } catch {
      // no-op
    }
  }, [navigation]);


  // Phase2: MyWebを開いたタイミングで、サーバ側の配布状態をオンデマンドで追いつかせる
  // （端末タイマーによる自動生成は停止し、MashOS主導へ移行）
  const ensuredRef = useRef(false);
  useEffect(() => {
    if (ensuredRef.current) return;
    ensuredRef.current = true;

    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        if (!accessToken) return;

        const res = await fetch(MYWEB_REPORTS_ENSURE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            types: ["weekly", "monthly"],
            force: false,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          console.warn("MyWebScreen: myweb/reports/ensure failed", res.status, t);
        }
      } catch (e) {
        console.warn("MyWebScreen: myweb/reports/ensure failed", e);
      } finally {
        // 生成/配布の追いつかせ後に、未読バッジを更新
        refreshUnreadBadges();
        refreshMyModelCreateBadge();
      }
    })();
  }, [refreshUnreadBadges, refreshMyModelCreateBadge]);

  // Home に戻ったタイミングでも更新
  useEffect(() => {
    if (route === "home") {
      refreshUnreadBadges();
      refreshMyModelCreateBadge();
    }
  }, [route, refreshUnreadBadges, refreshMyModelCreateBadge]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      {route === "history" ? (
        <MyWebHistoryScreen onBack={() => setRoute("home")} />
      ) : route === "reportHistory" ? (
        <MyWebReportHistoryScreen
          reportType={reportType}
          onBack={() => setRoute("home")}
          onOpenReport={openReportView}
          onGenerateLatest={() => setRoute(reportType)}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "reportView" ? (
        <MyWebReportViewerScreen
          report={selectedReport}
          onBack={() => setRoute("reportHistory")}
          onOpenMyProfile={onOpenMyProfile}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "selfReportHistory" ? (
        <SelfStructureReportHistoryScreen
          reportType="monthly"
          onBack={() => setRoute("home")}
          onOpenReport={openSelfReportView}
          onGenerateLatest={() => setRoute("selfReportGenerate")}
        />
      ) : route === "selfReportView" ? (
        <SelfStructureReportViewerScreen
          report={selectedSelfReport}
          onBack={() => setRoute("selfReportHistory")}
        />
      ) : route === "selfReportGenerate" ? (
        <SelfStructureReportGenerateScreen
          onBack={() => setRoute("selfReportHistory")}
        />
      ) : route === "weekly" ? (
        <WeeklyReportMockScreen
          onBack={() => setRoute("reportHistory")}
          onOpenMyProfile={onOpenMyProfile}
        />
      ) : route === "monthly" ? (
        <MonthlyReportMockScreen
          onBack={() => setRoute("reportHistory")}
          onOpenMyProfile={onOpenMyProfile}
        />
      ) : route === "mymodelCreate" ? (
        <MyModelCreateScreen
          onBack={() => setRoute("home")}
          onOpenSubscription={openSubscriptionSelect}
        />
      ) : route === "deepInsight" ? (
        <DeepInsightScreen onBack={() => setRoute("home")} />
      ) : (
        <MyWebHome
          styles={styles}
          colors={colors}
          onOpenGuide={openGuide}
          onOpenHistory={() => setRoute("history")}
          onOpenWeekly={() => openReportHistory("weekly")}
          onOpenMonthly={() => openReportHistory("monthly")}
          onOpenSelfReport={openSelfReportHistory}
          onOpenMyModelBuild={openMyModelBuild}
          onOpenMyModelCreate={() => setRoute("mymodelCreate")}
          onOpenDeepInsight={openDeepInsight}
          unreadWeekly={unreadByType.weekly}
          unreadMonthly={unreadByType.monthly}
          unreadSelfStructure={!subscriptionLoading && isPaid ? unreadByType.selfStructure : false}
          unreadMyModelCreate={unreadMyModelCreate}
        />
      )}
    </SafeAreaView>
  );
}


// --- Home ---
function MyWebHome({
  styles,
  colors,
  onOpenGuide,
  onOpenHistory,
  onOpenWeekly,
  onOpenMonthly,
  onOpenSelfReport,
  onOpenMyModelBuild,
  onOpenMyModelCreate,
  onOpenDeepInsight,
  unreadWeekly,
  unreadMonthly,
  unreadSelfStructure,
  unreadMyModelCreate,
}) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* パネルヘッダー：MyWeb */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>MyWeb</Text>
            <CocolonPressable
              style={styles.guideButton}
              onPress={onOpenGuide}
              accessibilityLabel="MyWebのガイドを開く"
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.TEXT_ON_LIGHT}
              />
            </CocolonPressable>
          </View>
        </View>

        {/* タイルセクション（縦一列） */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>履歴とレポート</Text>
          <View style={styles.tilesColumn}>
            <QuickLink
              styles={styles}
              colors={colors}
              icon="time-outline"
              label="履歴"
              onPress={onOpenHistory}
            />
            <QuickLink
              styles={styles}
              colors={colors}
              icon="bar-chart-outline"
              label="感情構造分析レポート（週）"
              subtitle="毎週日曜日 0時配信"
              onPress={onOpenWeekly}
              showBadge={!!unreadWeekly}
            />
            <QuickLink
              styles={styles}
              colors={colors}
              icon="calendar-outline"
              label="感情構造分析レポート（月）"
              subtitle="毎月1日 0時配信"
              onPress={onOpenMonthly}
              showBadge={!!unreadMonthly}
            />
            <QuickLink
              styles={styles}
              colors={colors}
              icon="document-text-outline"
              label="自己構造分析レポート（月）"
              subtitle="毎月1日 0時配信"
              onPress={onOpenSelfReport}
              showBadge={!!unreadSelfStructure}
            />

            <View style={{ marginTop: 6, marginBottom: 6 }}>
              <Text style={[styles.sectionLabel, { fontWeight: "700" }]}>
                MyModelを構築
              </Text>
            </View>

            <QuickLink
              styles={styles}
              colors={colors}
              icon="create-outline"
              label="MyModel Create"
              onPress={onOpenMyModelCreate}
              showBadge={!!unreadMyModelCreate}
            />
          </View>
        </View>

        {/* Deep Insight CTA */}
        <View style={[styles.section, styles.deepInsightSection]}>
          <Text style={[styles.deepInsightLead, { fontWeight: "700" }]}>
            自己理解を深めたい方はこちら
          </Text>
          <QuickLink
            styles={styles}
            colors={colors}
            icon="sparkles-outline"
            label="Deep Insight"
            onPress={onOpenDeepInsight}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function QuickLink({
  styles,
  colors,
  icon,
  label,
  subtitle,
  onPress,
  showBadge,
}) {
  return (
    <CocolonPressable
      style={styles.linkItem}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.linkInner}>
        <View style={styles.linkIconWrap}>
          <Ionicons
            name={icon}
            size={22}
            color={colors.TEXT_ON_LIGHT}
          />
        </View>
        <View style={styles.linkTextWrap}>
          <Text numberOfLines={1} style={styles.linkLabel}>
            {label}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.linkSubtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.TEXT_SUBTLE}
        />

        {showBadge ? (
          <View
            pointerEvents="none"
            style={styles.unreadDot}
          />
        ) : null}
      </View>
    </CocolonPressable>
  );
}

/* 以下、WeeklyReportScreen / MonthlyReportScreen は
   いまはルーティングで使ってないけど、
   getCurrentUserId ベースで Supabase を読むように修正済み。内容は省略せず全部貼っておくね。 */

function getWeeklyRangeForNow() {
  const now = new Date();
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function getMonthlyRangeForNow() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
}

function WeeklyReportScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const { styles } = useThemedStyles();

  const range = useMemo(() => getWeeklyRangeForNow(), []);
  const title = useMemo(() => {
    const s = range.start;
    const e = range.end;
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    return `週報  ${fmt(s)} 〜 ${fmt(e)}`;
  }, [range]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError("ユーザー情報を取得できませんでした");
        setRows([]);
        return;
      }

      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, emotions, memo")
        .eq("user_id", userId)
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [range.start, range.end]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => summarize(rows), [rows]);

  return (
    <View style={styles.reportContainer}>
      <Header title={title} onBack={onBack} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={styles.error}>取得エラー: {error}</Text>
      ) : (
        <ReportBody summary={summary} rows={rows} />
      )}
    </View>
  );
}

function MonthlyReportScreen({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const { styles } = useThemedStyles();

  const range = useMemo(() => getMonthlyRangeForNow(), []);
  const title = useMemo(() => {
    const s = range.start;
    return `月報  ${s.getFullYear()}/${s.getMonth() + 1}`;
  }, [range]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError("ユーザー情報を取得できませんでした");
        setRows([]);
        return;
      }

      const { data, error } = await supabase
        .from("emotions")
        .select("id, created_at, emotions, memo")
        .eq("user_id", userId)
        .gte("created_at", range.start.toISOString())
        .lte("created_at", range.end.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }, [range.start, range.end]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = useMemo(() => summarize(rows), [rows]);

  return (
    <View style={styles.reportContainer}>
      <Header title={title} onBack={onBack} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={styles.error}>取得エラー: {error}</Text>
      ) : (
        <ReportBody summary={summary} rows={rows} />
      )}
    </View>
  );
}

function Header({ title, onBack }) {
  const { styles } = useThemedStyles();

  return (
    <View style={styles.headerRow}>
      <CocolonPressable onPress={onBack} style={styles.backBtn} accessibilityLabel="戻る">
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color="#374151"
        />
        <Text style={styles.backText}>MyWeb</Text>
      </CocolonPressable>
      <Text style={styles.reportTitle}>{title}</Text>
      <View style={{ width: 64 }} />
    </View>
  );
}

function summarize(rows) {
  const count = rows.length;
  const emotionCounts = {};
  for (const r of rows) {
    const arr = Array.isArray(r.emotions) ? r.emotions : [];
    for (const e of arr) emotionCounts[e] = (emotionCounts[e] || 0) + 1;
  }
  const top = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return { count, top };
}

function ReportBody({ summary, rows }) {
  const { styles } = useThemedStyles();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>この期間のまとめ</Text>
        <Text style={styles.summaryItem}>入力件数：{summary.count}</Text>
        <Text style={styles.summaryItem}>
          主要感情：
          {summary.top
            .map(([k, v]) => `${k}(${v})`)
            .join(" / ") || "—"}
        </Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.dateText}>
              {new Date(item.created_at).toLocaleString("ja-JP", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text style={styles.emotionsText}>
              {(item.emotions || []).join(", ")}
            </Text>
            {!!item.memo && (
              <Text style={styles.memoText}>{item.memo}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ padding: 12, color: "#374151" }}>
            この期間の入力はありません
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};

  return StyleSheet.create({
    // ルート
    container: { flex: 1, backgroundColor: COLORS.PANEL_BG },

    // MyWeb Home 用
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      alignItems: "stretch",
      paddingHorizontal: 18,
    },

    // Emlis ロゴ
    appTitleWrapper: {
      alignItems: "center",
      marginBottom: 14,
    },
    appTitleText: {
      fontFamily: "CormorantGaramond-Bold",
      fontSize: 24,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 1.2,
    },
    appSubtitleText: {
      fontFamily: "CormorantGaramond-Regular",
      marginTop: 4,
      fontSize: 11,
      color: COLORS.BRAND_GOLD,
      letterSpacing: 0.8,
    },

    // メインパネル
    panel: {
      width: "94%",
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: COLORS.BORDER_GOLD,
      paddingHorizontal: 18,
      paddingVertical: 20,
      shadowColor: "#000",
      shadowOpacity: 0.24,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
      height: PANEL_MIN_HEIGHT,
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    panelTitle: {
      fontSize: font.title ?? 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },


    panelTitleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    guideButton: {
      width: 36,
      height: 32,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginLeft: 10,
    },

    section: {
      marginBottom: 18,
    },
    sectionLabel: {
      fontSize: font.sectionLabel ?? 12,
      color: text.sectionLabel ?? text.primary ?? COLORS.TEXT_ON_LIGHT,
      marginBottom: 8,
    },

	    // Deep Insight CTA
	    deepInsightSection: {
	      marginTop: 10,
	    },
	    deepInsightLead: {
	      fontSize: font.sectionLabel ?? 12,
	      color: text.description ?? COLORS.TEXT_ON_LIGHT,
	      marginBottom: 10,
	    },
    tilesColumn: {
      marginTop: 4,
      flexGrow: 1,
      justifyContent: "space-between",
    },
    linkItem: { marginBottom: 10 },
    linkInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    linkIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      backgroundColor: COLORS.PANEL_BG,
    },
    linkTextWrap: {
      flex: 1,
    },
    linkLabel: {
      fontSize: font.body ?? 13,
      fontWeight: "600",
      color: text.primary ?? COLORS.TEXT_ON_LIGHT,
    },
    linkSubtitle: {
      marginTop: 2,
      fontSize: font.description ?? 9,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },

    // 未読バッジ（●）
    unreadDot: {
      position: "absolute",
      top: 10,
      right: 36,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.BORDER_GOLD,
    },

    // report 系（Weekly / Monthly 共通）
    reportContainer: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
      paddingHorizontal: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingRight: 10,
    },
    backText: {
      marginLeft: 2,
      color: "#374151",
      fontSize: 13,
      fontWeight: "600",
    },
    reportTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
    error: { padding: 12, color: "#B91C1C" },

    summaryCard: {
      marginTop: 6,
      marginBottom: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderRadius: 12,
      backgroundColor: "#F9FAFB",
    },
    summaryTitle: {
      fontWeight: "700",
      color: "#111827",
      marginBottom: 6,
    },
    summaryItem: { color: "#374151", marginBottom: 2 },

    row: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: "#EEE",
    },
    dateText: { fontWeight: "700", color: "#111827", marginBottom: 4 },
    emotionsText: { color: "#374151" },
    memoText: { color: "#374151", marginTop: 4, fontStyle: "italic" },
  });
}

