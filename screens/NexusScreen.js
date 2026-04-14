import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonButton from "../components/CocolonButton";
import CocolonPressable from "../components/CocolonPressable";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import {
  getNexusDiscoveriesReflections,
  getNexusEchoesReflections,
  getNexusEmotionLog,
  getNexusEmotionRanking,
  getNexusRecommendUsers,
  getNexusReflectionDetail,
  getNexusReflections,
  getNexusTrendingQuestions,
} from "../lib/nexusApi";
import NexusEmotionRankingCard from "./nexus/NexusEmotionRankingCard";
import NexusReflectionCard from "./nexus/NexusReflectionCard";

const TABS = [
  { key: "reflection", label: "Reflection" },
  { key: "emotion_log", label: "感情通知" },
  { key: "recommend", label: "おすすめ" },
  { key: "history", label: "履歴" },
];

function normalizeEmotionRankingItems(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.rows)
    ? json.rows
    : Array.isArray(json)
    ? json
    : [];
  return items.slice(0, 5).map((item, index) => ({
    label:
      String(
        item?.emotion_label ||
          item?.emotion ||
          item?.emotion_type ||
          item?.label ||
          item?.name ||
          `感情 ${index + 1}`
      ).trim() || `感情 ${index + 1}`,
    value: Number(item?.count ?? item?.total ?? item?.value ?? item?.score ?? 0) || 0,
  }));
}

function normalizeEmotionLogItems(json) {
  const rows = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
    ? json
    : [];
  return rows.map((row, index) => {
    const items = Array.isArray(row?.items)
      ? row.items
      : Array.isArray(row?.emotions)
      ? row.emotions
      : [];
    const ownerName = String(row?.ownerName || row?.owner_name || "ユーザー").trim() || "ユーザー";
    const timeLabel = String(row?.timeLabel || row?.created_at || row?.createdAt || "").trim();
    return {
      id: String(row?.id || `emotion-log-${index}`),
      ownerName,
      timeLabel,
      items: items.map((item) => ({
        type: String(item?.type || "").trim(),
        strength: String(item?.strength || "").trim(),
      })),
    };
  });
}

function normalizeRecommendUsers(json) {
  const users = Array.isArray(json?.users)
    ? json.users
    : Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return users.map((user, index) => ({
    id: String(user?.id || user?.user_id || `user-${index}`),
    displayName: String(user?.display_name || user?.name || user?.friend_code || "ユーザー").trim() || "ユーザー",
    friendCode: String(user?.friend_code || "").trim() || null,
  }));
}

function normalizeTrendingQuestions(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return items.map((item, index) => ({
    qKey: String(item?.q_key || `q-${index}`),
    title: String(item?.title || "—").trim() || "—",
    views: Number(item?.views || 0) || 0,
    resonances: Number(item?.resonances || 0) || 0,
  }));
}

function normalizeSavedReflections(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return items.map((item, index) => ({
    qInstanceId: String(item?.q_instance_id || `saved-${index}`),
    title: String(item?.title || "—").trim() || "—",
    ownerDisplayName: String(item?.owner_display_name || "ユーザー").trim() || "ユーザー",
    ownerUserId: String(item?.owner_user_id || "").trim() || null,
    savedAt: String(item?.saved_at || "").trim(),
  }));
}

function formatDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return d.toLocaleString("ja-JP", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function NexusScreen({ navigation }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const isDark = themeName === "dark";

  const [activeTab, setActiveTab] = useState("reflection");
  const [historyMode, setHistoryMode] = useState("echoes");

  const [rankingState, setRankingState] = useState({ loading: true, items: [] });
  const [reflectionState, setReflectionState] = useState({ loading: true, items: [], error: "" });
  const [emotionLogState, setEmotionLogState] = useState({ loading: false, loaded: false, items: [], error: "" });
  const [recommendState, setRecommendState] = useState({
    loading: false,
    loaded: false,
    users: [],
    questions: [],
    error: "",
  });
  const [historyState, setHistoryState] = useState({
    loading: false,
    loadedModes: {},
    echoes: [],
    discoveries: [],
    error: "",
  });

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const loadRanking = useCallback(async () => {
    try {
      const json = await getNexusEmotionRanking(5);
      setRankingState({ loading: false, items: normalizeEmotionRankingItems(json) });
    } catch (e) {
      console.warn("NexusScreen: loadRanking failed", e);
      setRankingState({ loading: false, items: [] });
    }
  }, []);

  const loadReflections = useCallback(async () => {
    setReflectionState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusReflections({ sort: "latest", limit: 20, following_only: true });
      const items = Array.isArray(json?.items) ? json.items : [];
      setReflectionState({ loading: false, items, error: "" });
    } catch (e) {
      console.warn("NexusScreen: loadReflections failed", e);
      setReflectionState({ loading: false, items: [], error: String(e?.message || "Reflectionを読み込めませんでした。") });
    }
  }, []);

  const loadEmotionLog = useCallback(async () => {
    setEmotionLogState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json = await getNexusEmotionLog(20);
      setEmotionLogState({
        loading: false,
        loaded: true,
        items: normalizeEmotionLogItems(json),
        error: "",
      });
    } catch (e) {
      console.warn("NexusScreen: loadEmotionLog failed", e);
      setEmotionLogState({
        loading: false,
        loaded: true,
        items: [],
        error: String(e?.message || "感情通知を読み込めませんでした。"),
      });
    }
  }, []);

  const loadRecommend = useCallback(async () => {
    setRecommendState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const [usersJson, questionsJson] = await Promise.all([
        getNexusRecommendUsers(8),
        getNexusTrendingQuestions(8),
      ]);
      setRecommendState({
        loading: false,
        loaded: true,
        users: normalizeRecommendUsers(usersJson),
        questions: normalizeTrendingQuestions(questionsJson),
        error: "",
      });
    } catch (e) {
      console.warn("NexusScreen: loadRecommend failed", e);
      setRecommendState({
        loading: false,
        loaded: true,
        users: [],
        questions: [],
        error: String(e?.message || "おすすめを読み込めませんでした。"),
      });
    }
  }, []);

  const loadHistory = useCallback(async (mode) => {
    const safeMode = mode === "discoveries" ? "discoveries" : "echoes";
    setHistoryState((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const json =
        safeMode === "discoveries"
          ? await getNexusDiscoveriesReflections(20)
          : await getNexusEchoesReflections(20);
      const normalized = normalizeSavedReflections(json);
      setHistoryState((prev) => ({
        ...prev,
        loading: false,
        loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
        [safeMode]: normalized,
        error: "",
      }));
    } catch (e) {
      console.warn("NexusScreen: loadHistory failed", e);
      setHistoryState((prev) => ({
        ...prev,
        loading: false,
        loadedModes: { ...(prev.loadedModes || {}), [safeMode]: true },
        [safeMode]: [],
        error: String(e?.message || "履歴を読み込めませんでした。"),
      }));
    }
  }, []);

  useEffect(() => {
    void loadRanking();
    void loadReflections();
  }, [loadRanking, loadReflections]);

  useEffect(() => {
    if (activeTab === "emotion_log" && !emotionLogState.loaded && !emotionLogState.loading) {
      void loadEmotionLog();
    }
    if (activeTab === "recommend" && !recommendState.loaded && !recommendState.loading) {
      void loadRecommend();
    }
    if (
      activeTab === "history" &&
      !historyState.loadedModes?.[historyMode] &&
      !historyState.loading
    ) {
      void loadHistory(historyMode);
    }
  }, [
    activeTab,
    emotionLogState.loaded,
    emotionLogState.loading,
    historyMode,
    historyState.loadedModes,
    historyState.loading,
    loadEmotionLog,
    loadHistory,
    loadRecommend,
    recommendState.loaded,
    recommendState.loading,
  ]);

  const handleOpenOwner = useCallback((userId) => {
    const viewedUserId = String(userId || "").trim();
    if (!viewedUserId) return;
    try {
      navigation?.navigate?.("Account", { viewedUserId });
    } catch {
      // noop
    }
  }, [navigation]);

  const handleOpenReflection = useCallback(async (item) => {
    const qInstanceId = String(item?.q_instance_id || item?.qInstanceId || "").trim();
    if (!qInstanceId) return;

    setDetailVisible(true);
    setDetailLoading(true);
    try {
      const detail = await getNexusReflectionDetail(qInstanceId, {
        markViewed: true,
        includeMyDiscoveryLatest: true,
      });
      setDetailData(detail && typeof detail === "object" ? detail : null);
      setReflectionState((prev) => ({
        ...prev,
        items: Array.isArray(prev.items)
          ? prev.items.map((row) => {
              if (String(row?.q_instance_id || "") !== qInstanceId) return row;
              return {
                ...row,
                viewer_state: { ...(row?.viewer_state || {}), is_new: false },
                metrics: {
                  ...(row?.metrics || {}),
                  views: Number(detail?.views || row?.metrics?.views || 0) || 0,
                  resonances: Number(detail?.resonances || row?.metrics?.resonances || 0) || 0,
                  discoveries: Number(detail?.discoveries || row?.metrics?.discoveries || 0) || 0,
                },
              };
            })
          : prev.items,
      }));
    } catch (e) {
      console.warn("NexusScreen: load reflection detail failed", e);
      setDetailData({
        title: item?.question?.title || item?.title || "Reflection",
        body: item?.body || "",
        views: Number(item?.metrics?.views || 0) || 0,
        resonances: Number(item?.metrics?.resonances || 0) || 0,
        discoveries: Number(item?.metrics?.discoveries || 0) || 0,
      });
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const renderReflectionTab = () => {
    if (reflectionState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (reflectionState.error) {
      return <Text style={styles.errorText}>{reflectionState.error}</Text>;
    }
    if (!Array.isArray(reflectionState.items) || reflectionState.items.length <= 0) {
      return <Text style={styles.emptyText}>フォロー中ユーザーのReflectionはまだありません。</Text>;
    }
    return reflectionState.items.map((item) => (
      <NexusReflectionCard
        key={String(item?.q_instance_id || Math.random())}
        item={item}
        onPress={() => handleOpenReflection(item)}
        onPressOwner={() => handleOpenOwner(item?.owner?.user_id)}
      />
    ));
  };

  const renderEmotionLogTab = () => {
    if (emotionLogState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (emotionLogState.error) {
      return <Text style={styles.errorText}>{emotionLogState.error}</Text>;
    }
    if (!emotionLogState.items.length) {
      return <Text style={styles.emptyText}>感情通知はまだありません。</Text>;
    }
    return emotionLogState.items.map((row) => (
      <View key={row.id} style={styles.simpleCard}>
        <View style={styles.simpleCardHeader}>
          <Text style={styles.simpleCardTitle}>{row.ownerName}</Text>
          <Text style={styles.simpleCardMeta}>{formatDateLabel(row.timeLabel)}</Text>
        </View>
        <Text style={styles.simpleCardBody}>
          {(row.items || [])
            .map((item) => {
              const type = String(item?.type || "").trim();
              const strength = String(item?.strength || "").trim();
              return strength ? `${type}（${strength}）` : type;
            })
            .filter(Boolean)
            .join(" / ") || "感情入力"}
        </Text>
      </View>
    ));
  };

  const renderRecommendTab = () => {
    if (recommendState.loading) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (recommendState.error) {
      return <Text style={styles.errorText}>{recommendState.error}</Text>;
    }
    return (
      <View>
        <Text style={styles.subsectionTitle}>おすすめユーザー</Text>
        {recommendState.users.length <= 0 ? (
          <Text style={styles.emptyText}>おすすめユーザーはまだありません。</Text>
        ) : (
          recommendState.users.map((user) => (
            <CocolonPressable
              key={user.id}
              style={styles.simpleCard}
              onPress={() => handleOpenOwner(user.id)}
            >
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardTitle}>{user.displayName}</Text>
                {user.friendCode ? <Text style={styles.simpleCardMeta}>{user.friendCode}</Text> : null}
              </View>
            </CocolonPressable>
          ))
        )}

        <Text style={styles.subsectionTitle}>いま見られている問い</Text>
        {recommendState.questions.length <= 0 ? (
          <Text style={styles.emptyText}>表示できる問いはまだありません。</Text>
        ) : (
          recommendState.questions.map((question) => (
            <View key={question.qKey} style={styles.simpleCard}>
              <Text style={styles.simpleCardTitle}>{question.title}</Text>
              <Text style={styles.simpleCardMeta}>
                views {question.views} / echoes {question.resonances}
              </Text>
            </View>
          ))
        )}
      </View>
    );
  };

  const currentHistoryItems =
    historyMode === "discoveries" ? historyState.discoveries : historyState.echoes;

  const renderHistoryTab = () => {
    if (historyState.loading && !historyState.loadedModes?.[historyMode]) {
      return <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />;
    }
    if (historyState.error && !currentHistoryItems.length) {
      return <Text style={styles.errorText}>{historyState.error}</Text>;
    }
    return (
      <View>
        <View style={styles.historySwitchRow}>
          <CocolonPressable
            style={[styles.historySwitchChip, historyMode === "echoes" && styles.historySwitchChipActive]}
            onPress={() => {
              setHistoryMode("echoes");
              if (!historyState.loadedModes?.echoes) {
                void loadHistory("echoes");
              }
            }}
          >
            <Text style={[styles.historySwitchText, historyMode === "echoes" && styles.historySwitchTextActive]}>
              共鳴履歴
            </Text>
          </CocolonPressable>
          <CocolonPressable
            style={[styles.historySwitchChip, historyMode === "discoveries" && styles.historySwitchChipActive]}
            onPress={() => {
              setHistoryMode("discoveries");
              if (!historyState.loadedModes?.discoveries) {
                void loadHistory("discoveries");
              }
            }}
          >
            <Text style={[styles.historySwitchText, historyMode === "discoveries" && styles.historySwitchTextActive]}>
              発見履歴
            </Text>
          </CocolonPressable>
        </View>

        {!currentHistoryItems.length ? (
          <Text style={styles.emptyText}>保存された履歴はまだありません。</Text>
        ) : (
          currentHistoryItems.map((item) => (
            <CocolonPressable
              key={item.qInstanceId}
              style={styles.simpleCard}
              onPress={() => handleOpenReflection(item)}
            >
              <View style={styles.simpleCardHeader}>
                <Text style={styles.simpleCardTitle}>{item.title}</Text>
                <Text style={styles.simpleCardMeta}>{formatDateLabel(item.savedAt)}</Text>
              </View>
              <Text style={styles.simpleCardBody}>{item.ownerDisplayName}</Text>
            </CocolonPressable>
          ))
        )}
      </View>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "emotion_log":
        return renderEmotionLogTab();
      case "recommend":
        return renderRecommendTab();
      case "history":
        return renderHistoryTab();
      case "reflection":
      default:
        return renderReflectionTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Nexus</Text>
          <CocolonPressable
            style={styles.refreshButton}
            onPress={() => {
              void loadRanking();
              if (activeTab === "reflection") void loadReflections();
              if (activeTab === "emotion_log") void loadEmotionLog();
              if (activeTab === "recommend") void loadRecommend();
              if (activeTab === "history") void loadHistory(historyMode);
            }}
            accessibilityLabel="Nexusを再読み込みする"
          >
            <Ionicons name="refresh-outline" size={18} color={colors.TEXT_ON_LIGHT} />
          </CocolonPressable>
        </View>

        <Text style={styles.descriptionText}>
          フォロー中ユーザーのReflectionや感情の動き、発見をまとめて見られる場所です。
        </Text>

        <NexusEmotionRankingCard items={rankingState.items} loading={rankingState.loading} />

        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <CocolonPressable
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab.label}
                </Text>
              </CocolonPressable>
            );
          })}
        </View>

        <View style={styles.tabContent}>{renderActiveTab()}</View>
      </ScrollView>

      <Modal
        visible={detailVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.detailBackdrop}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>
                {String(detailData?.title || "Reflection").trim() || "Reflection"}
              </Text>
            </View>

            {detailLoading ? (
              <ActivityIndicator style={styles.loader} color={colors.TITLE_GOLD} />
            ) : (
              <ScrollView style={styles.detailBodyScroll} contentContainerStyle={styles.detailBodyContent}>
                <Text style={styles.detailBodyText}>
                  {String(detailData?.body || "表示できる内容がありません。").trim() || "表示できる内容がありません。"}
                </Text>

                <View style={styles.detailMetricsRow}>
                  <Text style={styles.detailMetricText}>views {Number(detailData?.views || 0) || 0}</Text>
                  <Text style={styles.detailMetricText}>echoes {Number(detailData?.resonances || 0) || 0}</Text>
                  <Text style={styles.detailMetricText}>discoveries {Number(detailData?.discoveries || 0) || 0}</Text>
                </View>

                {detailData?.my_discovery_latest?.category ? (
                  <View style={styles.detailDiscoveryCard}>
                    <Text style={styles.detailDiscoveryLabel}>あなたの最新の発見</Text>
                    <Text style={styles.detailDiscoveryText}>
                      {String(detailData?.my_discovery_latest?.category || "").trim()}
                    </Text>
                    {detailData?.my_discovery_latest?.memo ? (
                      <Text style={styles.detailDiscoveryMemo}>
                        {String(detailData?.my_discovery_latest?.memo || "").trim()}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </ScrollView>
            )}

            <View style={styles.detailActionRow}>
              <CocolonButton
                variant="secondary"
                onPress={() => setDetailVisible(false)}
                accessibilityLabel="Reflection詳細を閉じる"
              >
                閉じる
              </CocolonButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  const font = ui?.font || {};
  const text = ui?.text || {};
  return StyleSheet.create(applyTypographyTokens({
    container: {
      flex: 1,
      backgroundColor: COLORS.PANEL_BG,
    },
    scrollContainer: {
      paddingTop: 16,
      paddingBottom: 32,
      paddingHorizontal: 18,
      alignItems: "stretch",
    },
    panelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 26,
      lineHeight: 32,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.8,
    },
    refreshButton: {
      width: 40,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.FIELD_BG,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
    },
    descriptionText: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TEXT_SUBTLE,
      marginBottom: 14,
    },
    tabBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 14,
      marginHorizontal: -4,
    },
    tabChip: {
      marginHorizontal: 4,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    tabChipActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    tabChipText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    tabChipTextActive: {
      color: COLORS.ACCENT_TEXT,
    },
    tabContent: {
      marginTop: 2,
    },
    loader: {
      marginTop: 24,
      marginBottom: 24,
    },
    emptyText: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TEXT_SUBTLE,
    },
    errorText: {
      fontSize: 13,
      lineHeight: 20,
      color: "#B91C1C",
    },
    subsectionTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 8,
      marginTop: 2,
    },
    simpleCard: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    simpleCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    simpleCardTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      paddingRight: 10,
    },
    simpleCardMeta: {
      fontSize: 11,
      color: COLORS.TEXT_SUBTLE,
    },
    simpleCardBody: {
      fontSize: 13,
      lineHeight: 20,
      color: COLORS.TEXT_ON_LIGHT,
    },
    historySwitchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    historySwitchChip: {
      marginRight: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
    },
    historySwitchChipActive: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    historySwitchText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
    },
    historySwitchTextActive: {
      color: COLORS.ACCENT_TEXT,
    },
    detailBackdrop: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.38)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    detailCard: {
      width: "100%",
      maxWidth: 380,
      maxHeight: 640,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.BORDER_GOLD,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    detailHeader: {
      marginBottom: 12,
    },
    detailTitle: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      textAlign: "center",
    },
    detailBodyScroll: {
      width: "100%",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      maxHeight: 400,
    },
    detailBodyContent: {
      paddingHorizontal: 18,
      paddingVertical: 18,
    },
    detailBodyText: {
      fontSize: 15,
      lineHeight: 24,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "600",
    },
    detailMetricsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 14,
    },
    detailMetricText: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "700",
      color: COLORS.TEXT_SUBTLE,
      marginRight: 12,
      marginBottom: 4,
    },
    detailDiscoveryCard: {
      marginTop: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    detailDiscoveryLabel: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 6,
    },
    detailDiscoveryText: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    detailDiscoveryMemo: {
      marginTop: 6,
      fontSize: font.description ?? 12,
      lineHeight: 18,
      color: text.description ?? COLORS.TEXT_SUBTLE,
    },
    detailActionRow: {
      marginTop: 16,
      width: "100%",
    },
  }, ui));
}
