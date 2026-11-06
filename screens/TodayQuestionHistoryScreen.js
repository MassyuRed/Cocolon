import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useSubscription } from "../SubscriptionContext";
import { useAppRuntime } from "../AppRuntimeContext";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";
import CocolonButton from "../components/CocolonButton";
import CocolonBackButton from "../components/CocolonBackButton";
import CocolonPressable from "../components/CocolonPressable";
import {
  getTodayQuestionHistory,
  patchTodayQuestionAnswer,
} from "../lib/todayQuestionApi";

const HISTORY_PAGE_LIMIT = 60;

export default function TodayQuestionHistoryScreen({ onBack }) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const { isFeatureEnabled } = useAppRuntime();
  const todayQuestionHistoryEnabled = isFeatureEnabled("today_question_history_enabled", true);
  const {
    isPaid,
    tier: subscriptionTier,
    loading: subscriptionLoading,
  } = useSubscription();
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const { height: windowHeight } = useWindowDimensions();
  const isIOS = Platform.OS === "ios";
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [editState, setEditState] = useState({});
  const [freeTextContentHeights, setFreeTextContentHeights] = useState({});
  const [loadError, setLoadError] = useState(null);

  const isDark = themeName === "dark";
  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight]);
  const historyRetentionLabel = useMemo(
    () => getHistoryRetentionLabel(subscriptionTier),
    [subscriptionTier]
  );
  const showHistoryRetentionLabel = !subscriptionLoading && !!historyRetentionLabel;

  const load = useCallback(async ({ append = false, offset = 0 } = {}) => {
    setLoadError(null);
    if (!todayQuestionHistoryEnabled) {
      setItems([]);
      setHasMore(false);
      setNextOffset(null);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const json = await getTodayQuestionHistory({
        limit: HISTORY_PAGE_LIMIT,
        offset,
      });
      const rows = Array.isArray(json?.items) ? json.items : [];
      setItems((prev) => {
        if (!append) return rows;
        const existing = new Set(
          (prev || []).map((item) => String(item?.answer_id || "")),
        );
        const merged = [...(prev || [])];
        for (const row of rows) {
          const id = String(row?.answer_id || "");
          if (!id || existing.has(id)) continue;
          existing.add(id);
          merged.push(row);
        }
        return merged;
      });
      setHasMore(Boolean(json?.has_more));
      setNextOffset(
        typeof json?.next_offset === "number"
          ? json.next_offset
          : json?.next_offset != null
            ? Number(json.next_offset)
            : null,
      );
    } catch (e) {
      console.warn("TodayQuestionHistoryScreen: load failed", e);
      setLoadError({ append, offset });
      if (!append) {
        setItems([]);
        setHasMore(false);
        setNextOffset(null);
      }
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, [todayQuestionHistoryEnabled]);

  useEffect(() => {
    load({ append: false, offset: 0 });
  }, [load]);

  const ensureEditState = useCallback((item) => {
    const answerId = String(item?.answer_id || "");
    if (!answerId) return;
    setEditState((prev) => {
      if (prev[answerId]) return prev;
      return {
        ...prev,
        [answerId]: {
          mode: item?.answer_mode === "free_text" ? "free_text" : "choice",
          selectedChoiceId: item?.selected_choice_id || item?.selected_choice_key || null,
          selectedChoiceKey: item?.selected_choice_key || null,
          freeText: item?.free_text || "",
        },
      };
    });
  }, []);

  const openItem = useCallback(
    (item) => {
      const answerId = String(item?.answer_id || "");
      ensureEditState(item);
      setExpandedId((prev) => (prev === answerId ? null : answerId));
    },
    [ensureEditState],
  );

  const updateLocalEdit = useCallback((answerId, patch) => {
    setEditState((prev) => ({
      ...prev,
      [answerId]: {
        ...(prev[answerId] || {}),
        ...(patch || {}),
      },
    }));
  }, []);

  const updateFreeTextContentHeight = useCallback((answerId, height) => {
    const nextHeight = Number(height || 0);
    if (!answerId || !nextHeight) return;
    setFreeTextContentHeights((prev) =>
      prev?.[answerId] === nextHeight
        ? prev
        : {
            ...(prev || {}),
            [answerId]: nextHeight,
          },
    );
  }, []);

  const saveEdit = useCallback(
    async (item) => {
      const answerId = String(item?.answer_id || "");
      const cur = editState[answerId] || {};
      if (!answerId) return;
      if (!isPaid) {
        Alert.alert("今日の問い", "編集はPlusプラン以上で利用できます。");
        return;
      }

      let payload = null;
      if (cur.mode === "free_text") {
        const text = String(cur.freeText || "").trim();
        if (!text) {
          Alert.alert("今日の問い", "自由回答を入力してください。");
          return;
        }
        payload = { answer_mode: "free_text", free_text: text };
      } else {
        if (!cur.selectedChoiceId) {
          Alert.alert("今日の問い", "選択肢を選んでください。");
          return;
        }
        payload = {
          answer_mode: "choice",
          selected_choice_id: cur.selectedChoiceId,
          selected_choice_key: cur.selectedChoiceKey || undefined,
          free_text: String(cur.freeText || "").trim() || undefined,
        };
      }

      setSavingId(answerId);
      try {
        await patchTodayQuestionAnswer(answerId, payload);
        await load({ append: false, offset: 0 });
        Alert.alert(
          "今日の問い",
          "回答を更新しました。",
        );
      } catch (e) {
        console.warn("TodayQuestionHistoryScreen: patch failed", e);
        Alert.alert("今日の問い", String(e?.message || "更新に失敗しました。"));
      } finally {
        setSavingId(null);
      }
    },
    [editState, isPaid, load],
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || nextOffset == null) return;
    await load({ append: true, offset: nextOffset });
  }, [loading, loadingMore, hasMore, nextOffset, load]);

  if (!todayQuestionHistoryEnabled) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.BG_SILVER}
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <CocolonBackButton
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel="前の画面に戻る"
            />
            <Text style={styles.headerTitle}>今日の問い履歴</Text>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={styles.helpText}>
            現在、今日の問い履歴は一時的に利用できません。
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.BG_SILVER}
      />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <CocolonBackButton
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel="前の画面に戻る"
            />
            <Text style={styles.headerTitle}>今日の問い履歴</Text>
            <View style={styles.headerSpacer} />
          </View>

          {!isPaid ? (
            <Text style={styles.helpText}>
              履歴の閲覧は全員可能です。編集はPlusプラン以上で利用できます。
            </Text>
          ) : (
            <Text style={styles.helpText}>
              過去の回答を確認・編集できます。
            </Text>
          )}

          {showHistoryRetentionLabel ? (
            <Text style={styles.historyRetentionText}>
              {historyRetentionLabel}
            </Text>
          ) : null}

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
              <Text style={styles.loadingText}>履歴を読み込み中…</Text>
            </View>
          ) : items.length === 0 && !loadError ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                まだ今日の問いの履歴はありません。
              </Text>
            </View>
          ) : (
            items.map((item) => {
              const answerId = String(item?.answer_id || "");
              const expanded = expandedId === answerId;
              const edit = editState[answerId] || {};
              const choices = Array.isArray(item?.choices) ? item.choices : [];
              const sourceAnchorSummary = item?.source_anchor_summary || null;
              const optionalFreeTextEnabled =
                String(item?.question_origin || "") === "personal_followup";
              const itemAnswerText =
                item?.answer_mode === "free_text"
                  ? item?.free_text || "自由回答"
                  : [item?.selected_choice_label || "選択回答", item?.free_text]
                      .filter((part) => String(part || "").trim())
                      .join(" / ");
              return (
                <View key={answerId} style={styles.itemCard}>
                  <CocolonPressable
                    style={styles.itemHeader}
                    onPress={() => openItem(item)}
                    accessibilityLabel="履歴詳細を開く"
                    accessibilityState={{ expanded }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemDay}>
                        {item?.service_day_key || "—"}
                      </Text>
                      <Text style={styles.itemQuestion}>
                        {item?.question_text || "今日の問い"}
                      </Text>
                      <Text style={styles.itemAnswer}>{itemAnswerText}</Text>
                    </View>
                    <Ionicons
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.TEXT_SUBTLE}
                    />
                  </CocolonPressable>

                  {expanded ? (
                    <View style={styles.itemBody}>
                      <Text style={styles.metaText}>
                        回答日時: {item?.answered_at || "—"}
                      </Text>
                      {item?.edited_at ? (
                        <Text style={styles.metaText}>
                          編集日時: {item.edited_at}
                        </Text>
                      ) : null}
                      {sourceAnchorSummary?.anchor_text ? (
                        <Text style={styles.metaText}>
                          入力: 「{sourceAnchorSummary.anchor_text}」
                        </Text>
                      ) : null}

                      {isPaid ? (
                        <>
                          <View style={styles.modeRow}>
                            <CocolonPressable
                              accessibilityLabel="選択式で答える"
                              accessibilityState={{ selected: edit.mode !== "free_text" }}
                              style={[
                                styles.modeChip,
                                edit.mode !== "free_text" && styles.modeChipOn,
                              ]}
                              onPress={() =>
                                updateLocalEdit(answerId, { mode: "choice" })
                              }
                            >
                              <Text
                                style={[
                                  styles.modeChipText,
                                  edit.mode !== "free_text" &&
                                    styles.modeChipTextOn,
                                ]}
                              >
                                選択式
                              </Text>
                            </CocolonPressable>
                            <CocolonPressable
                              accessibilityLabel="自由回答で答える"
                              accessibilityState={{ selected: edit.mode === "free_text" }}
                              style={[
                                styles.modeChip,
                                edit.mode === "free_text" && styles.modeChipOn,
                              ]}
                              onPress={() =>
                                updateLocalEdit(answerId, { mode: "free_text" })
                              }
                            >
                              <Text
                                style={[
                                  styles.modeChipText,
                                  edit.mode === "free_text" &&
                                    styles.modeChipTextOn,
                                ]}
                              >
                                自由回答
                              </Text>
                            </CocolonPressable>
                          </View>

                          {edit.mode === "free_text" ? (
                            <View style={styles.freeTextCard}>
                              <Text style={styles.optionalFreeTextLabel}>自由回答</Text>
                              <TextInput
                                accessibilityLabel="今日の問いへの自由回答"
                                style={[
                                  styles.memoInput,
                                  {
                                    flex: 0,
                                    width: "100%",
                                    height: Math.min(
                                      Math.max(
                                        freeTextContentHeights?.[answerId] || 44,
                                        44,
                                      ),
                                      inputMaxHeight,
                                    ),
                                  },
                                ]}
                                placeholder="ここに書いてください。"
                                {...(isIOS
                                  ? { defaultValue: edit.freeText || "" }
                                  : { value: edit.freeText || "" })}
                                onChangeText={(next) =>
                                  updateLocalEdit(answerId, { freeText: next })
                                }
                                {...(isIOS
                                  ? {
                                      onChange: (e) =>
                                        updateLocalEdit(answerId, {
                                          freeText: e?.nativeEvent?.text ?? "",
                                        }),
                                    }
                                  : {})}
                                multiline
                                scrollEnabled
                                textAlignVertical="top"
                                placeholderTextColor={colors.TEXT_SUBTLE}
                                onContentSizeChange={(e) => {
                                  const h = e?.nativeEvent?.contentSize?.height ?? 0;
                                  if (h) updateFreeTextContentHeight(answerId, h);
                                }}
                              />
                            </View>
                          ) : (
                            <>
                              <View style={styles.choiceList}>
                                {choices.map((choice) => {
                                  const cid = String(choice?.choice_id || "");
                                  const active =
                                    cid && cid === edit.selectedChoiceId;
                                  return (
                                    <CocolonPressable
                                      accessibilityState={{ selected: !!active }}
                                      accessibilityLabel={String(choice?.label || "選択肢")}
                                      key={
                                        cid || String(choice?.choice_key || "")
                                      }
                                      style={[
                                        styles.choiceItem,
                                        active && styles.choiceItemOn,
                                      ]}
                                      onPress={() =>
                                        updateLocalEdit(answerId, {
                                          selectedChoiceId: cid,
                                          selectedChoiceKey:
                                            String(choice?.choice_key || "") ||
                                            null,
                                        })
                                      }
                                    >
                                      <Ionicons name={active ? "checkmark-circle" : "ellipse-outline"} size={20}
                                        color={active ? colors.ON_SURFACE_TONAL : colors.TEXT_SUBTLE} style={{ marginRight: 10 }} />
                                      <Text
                                        style={[
                                          styles.choiceText,
                                          active && styles.choiceTextOn,
                                        ]}
                                      >
                                        {String(choice?.label || "")}
                                      </Text>
                                    </CocolonPressable>
                                  );
                                })}
                              </View>
                              {optionalFreeTextEnabled ? (
                                <View style={styles.optionalFreeTextCard}>
                                  <Text style={styles.optionalFreeTextLabel}>
                                    任意でひと言だけ書けます。
                                  </Text>
                                  <TextInput
                                    accessibilityLabel="任意のひと言"
                                    style={styles.optionalFreeTextInput}
                                    placeholder="ここに書いてください。"
                                    {...(isIOS
                                      ? { defaultValue: edit.freeText || "" }
                                      : { value: edit.freeText || "" })}
                                    onChangeText={(next) =>
                                      updateLocalEdit(answerId, { freeText: next })
                                    }
                                    {...(isIOS
                                      ? {
                                          onChange: (e) =>
                                            updateLocalEdit(answerId, {
                                              freeText: e?.nativeEvent?.text ?? "",
                                            }),
                                        }
                                      : {})}
                                    multiline
                                    textAlignVertical="top"
                                    placeholderTextColor={colors.TEXT_SUBTLE}
                                  />
                                </View>
                              ) : null}
                            </>
                          )}

                          <CocolonButton
                            variant="primary"
                            onPress={() => saveEdit(item)}
                            loading={savingId === answerId}
                            disabled={savingId === answerId}
                            accessibilityLabel="回答を更新する"
                          >
                            回答を更新する
                          </CocolonButton>
                        </>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              );
            })
          )}

          {loadError && !loading && !loadingMore ? (
            <View style={styles.emptyCard}>
              <Text accessibilityLiveRegion="polite" style={[styles.helpText, { color: colors.ERROR }]}>
                {loadError.append ? "続きの履歴を取得できませんでした。表示中の回答はそのまま確認できます。" : "履歴を取得できませんでした。もう一度お試しください。"}
              </Text>
              <CocolonButton variant="secondary" onPress={() => load(loadError)} title="もう一度読み込む" />
            </View>
          ) : null}

          {loadingMore ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} />
            </View>
          ) : hasMore && !loadError ? (
            <CocolonPressable
              style={styles.loadMoreBtn}
              onPress={loadMore}
              accessibilityLabel="さらに履歴を読み込む"
            >
              <Text style={styles.loadMoreText}>さらに表示</Text>
            </CocolonPressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.BG_SILVER,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    scrollContent: {
      paddingBottom: 24,
      width: "100%",
      maxWidth: 640,
      alignSelf: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      flex: 1,
      textAlign: "center",
    },
    headerSpacer: {
      width: 44,
    },
    helpText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
    historyRetentionText: {
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "600",
      marginBottom: 12,
    },
    loadingWrap: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
    },
    loadingText: {
      marginTop: 8,
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    emptyCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    emptyText: {
      fontSize: 13,
      color: COLORS.TEXT_ON_LIGHT,
    },
    itemCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      marginBottom: 12,
      overflow: "hidden",
    },
    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    itemDay: {
      fontSize: 11,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      marginBottom: 4,
    },
    itemQuestion: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    itemAnswer: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.TEXT_ON_LIGHT,
    },
    itemBody: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    metaText: {
      fontSize: 11,
      lineHeight: 16,
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 4,
    },
    modeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 10,
      flexWrap: "wrap",
    },
    modeChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      marginRight: 8,
      minHeight: 44,
      justifyContent: "center",
      marginBottom: 8,
    },
    modeChipOn: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.ON_SURFACE_TONAL,
    },
    modeChipText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    modeChipTextOn: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    choiceList: {
      marginBottom: 12,
    },
    choiceItem: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
    },
    choiceItemOn: {
      backgroundColor: COLORS.SURFACE_TONAL,
      borderColor: COLORS.ON_SURFACE_TONAL,
    },
    choiceText: {
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "600",
      flex: 1,
    },
    choiceTextOn: {
      color: COLORS.ON_SURFACE_TONAL,
    },
    loadMoreBtn: {
      marginTop: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.FIELD_BG,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    loadMoreText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    optionalFreeTextCard: {
      backgroundColor: COLORS.PANEL_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    },
    optionalFreeTextLabel: {
      fontSize: 12,
      lineHeight: 17,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "700",
      marginBottom: 6,
    },
    optionalFreeTextInput: {
      minHeight: 54,
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.TEXT_ON_LIGHT,
      padding: 0,
    },
    freeTextCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: {width:0,height:2},
      elevation: 1,
      minHeight: 120,
      marginBottom: 12,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
  }, ui, {
  "headerTitle": "screenTitle",
  "helpText": "description",
  "historyRetentionText": "meta",
  "loadingText": "description",
  "emptyText": "description",
  "itemDay": "meta",
  "itemQuestion": "sectionTitle",
  "itemAnswer": "body",
  "metaText": "meta",
  "modeChipText": "button",
  "choiceText": "body",
  "loadMoreText": "button",
  "optionalFreeTextLabel": "description",
  "optionalFreeTextInput": "input",
  "memoInput": "input"
}));
}
