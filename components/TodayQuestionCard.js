import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import CocolonButton from "./CocolonButton";
import CocolonPressable from "./CocolonPressable";

export default function TodayQuestionCard({
  question,
  answerSummary = null,
  loading = false,
  submitting = false,
  compact = false,
  hideHeader = false,
  embedded = false,
  showHistoryButton = false,
  onSubmit,
  onOpenHistory,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { height: windowHeight } = useWindowDimensions();
  const isIOS = Platform.OS === "ios";
  const [mode, setMode] = useState("choice");
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [selectedChoiceKey, setSelectedChoiceKey] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [freeTextContentHeight, setFreeTextContentHeight] = useState(44);

  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;
    return Math.max(260, Math.floor(h * 0.75));
  }, [windowHeight]);

  useEffect(() => {
    setMode("choice");
    setSelectedChoiceId(null);
    setSelectedChoiceKey(null);
    setFreeText("");
    setFreeTextContentHeight(44);
  }, [question?.question_id, question?.version]);

  const choices = Array.isArray(question?.choices) ? question.choices : [];
  const isAnswered = !!answerSummary;

  const canSubmitChoice = mode === "choice" && !!selectedChoiceId;
  const canSubmitFreeText =
    mode === "free_text" && typeof freeText === "string" && freeText.trim().length > 0;
  const canSubmit = !isAnswered && !submitting && (canSubmitChoice || canSubmitFreeText);

  const submitPayload = () => {
    if (typeof onSubmit !== "function" || !question?.question_id) return;
    if (mode === "free_text") {
      onSubmit({
        question_id: question.question_id,
        answer_mode: "free_text",
        free_text: freeText.trim(),
      });
      return;
    }
    onSubmit({
      question_id: question.question_id,
      answer_mode: "choice",
      selected_choice_id: selectedChoiceId,
      selected_choice_key: selectedChoiceKey || undefined,
    });
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact, embedded && styles.cardEmbedded]}>
      {!hideHeader ? (
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="help-circle-outline"
              size={18}
              color={colors.TITLE_GOLD}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.badgeText}>今日の問い</Text>
          </View>
          {loading ? <ActivityIndicator size="small" color={colors.TEXT_SUBTLE} /> : null}
        </View>
      ) : null}

      {question?.text ? <Text style={styles.questionText}>{question.text}</Text> : null}

      {isAnswered ? (
        <View style={styles.answeredWrap}>
          <Text style={styles.answeredTitle}>今日は回答済みです</Text>
          {answerSummary?.answer_mode === "choice" && answerSummary?.label ? (
            <Text style={styles.answeredBody}>回答: {answerSummary.label}</Text>
          ) : null}
          {answerSummary?.answer_mode === "free_text" && answerSummary?.text ? (
            <Text style={styles.answeredBody}>{answerSummary.text}</Text>
          ) : null}
          {showHistoryButton ? (
            <CocolonPressable
              style={styles.linkButton}
              onPress={onOpenHistory}
              accessibilityLabel="今日の問い履歴を見る"
            >
              <Text style={styles.linkText}>履歴を見る</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.TEXT_SUBTLE} />
            </CocolonPressable>
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.modeRow}>
            <CocolonPressable
              style={[styles.modeChip, mode === "choice" && styles.modeChipOn]}
              onPress={() => setMode("choice")}
              accessibilityLabel="選択式で答える"
            >
              <Text style={[styles.modeChipText, mode === "choice" && styles.modeChipTextOn]}>
                選択で答える
              </Text>
            </CocolonPressable>
            {question?.free_text_enabled !== false ? (
              <CocolonPressable
                style={[styles.modeChip, mode === "free_text" && styles.modeChipOn]}
                onPress={() => setMode("free_text")}
                accessibilityLabel="自由回答で答える"
              >
                <Text
                  style={[
                    styles.modeChipText,
                    mode === "free_text" && styles.modeChipTextOn,
                  ]}
                >
                  自由回答
                </Text>
              </CocolonPressable>
            ) : null}
          </View>

          {mode === "choice" ? (
            <View style={styles.choiceList}>
              {choices.map((choice) => {
                const cid = String(choice?.choice_id || "");
                const active = cid && cid === selectedChoiceId;
                return (
                  <CocolonPressable
                    key={cid || String(choice?.choice_key || Math.random())}
                    style={[styles.choiceItem, active && styles.choiceItemOn]}
                    onPress={() => {
                      setSelectedChoiceId(cid);
                      setSelectedChoiceKey(String(choice?.choice_key || "") || null);
                    }}
                    accessibilityLabel={String(choice?.label || "選択肢")}
                  >
                    <Text style={[styles.choiceText, active && styles.choiceTextOn]}>
                      {String(choice?.label || "")}
                    </Text>
                  </CocolonPressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.freeTextCard}>
              <TextInput
                style={[
                  styles.memoInput,
                  {
                    flex: 0,
                    width: "100%",
                    height: Math.min(
                      Math.max(freeTextContentHeight || 44, 44),
                      inputMaxHeight,
                    ),
                  },
                ]}
                placeholder="ここに書いてください。"
                {...(isIOS ? { defaultValue: freeText } : { value: freeText })}
                onChangeText={setFreeText}
                {...(isIOS
                  ? {
                      onChange: (e) => setFreeText(e?.nativeEvent?.text ?? ""),
                    }
                  : {})}
                multiline
                scrollEnabled
                textAlignVertical="top"
                placeholderTextColor={colors.TEXT_ON_LIGHT}
                onContentSizeChange={(e) => {
                  const h = e?.nativeEvent?.contentSize?.height ?? 0;
                  if (h) setFreeTextContentHeight(h);
                }}
              />
            </View>
          )}

          <View style={styles.actionRow}>
            <CocolonButton
              variant="primary"
              onPress={submitPayload}
              disabled={!canSubmit}
              loading={submitting}
              accessibilityLabel="今日の問いに回答する"
            >
              回答する
            </CocolonButton>
          </View>
        </>
      )}
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    card: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 14,
      paddingVertical: 14,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    cardCompact: {
      marginTop: 0,
    },
    cardEmbedded: {
      backgroundColor: "transparent",
      borderWidth: 0,
      paddingHorizontal: 0,
      paddingVertical: 0,
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      elevation: 0,
      borderRadius: 0,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "800",
      color: COLORS.TITLE_GOLD,
      letterSpacing: 0.2,
    },
    questionText: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 12,
    },
    modeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    modeChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      marginRight: 8,
    },
    modeChipOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    modeChipText: {
      fontSize: 12,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
    },
    modeChipTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    choiceList: {
      marginBottom: 12,
    },
    choiceItem: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 11,
      marginBottom: 8,
    },
    choiceItemOn: {
      backgroundColor: COLORS.GOLD_BUTTON,
      borderColor: COLORS.GOLD_BUTTON_BORDER,
    },
    choiceText: {
      fontSize: 14,
      lineHeight: 20,
      color: COLORS.TEXT_ON_LIGHT,
      fontWeight: "600",
    },
    choiceTextOn: {
      color: COLORS.ACCENT_TEXT,
    },
    freeTextCard: {
      backgroundColor: COLORS.FIELD_BG,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
      minHeight: 120,
      marginBottom: 12,
    },
    memoInput: {
      flex: 1,
      minHeight: 90,
      fontSize: 14,
      color: COLORS.TEXT_ON_LIGHT,
    },
    actionRow: {
      marginTop: 2,
    },
    answeredWrap: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.CARD_BORDER,
      backgroundColor: COLORS.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    answeredTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: COLORS.TEXT_ON_LIGHT,
      marginBottom: 6,
    },
    answeredBody: {
      fontSize: 13,
      lineHeight: 19,
      color: COLORS.TEXT_ON_LIGHT,
    },
    linkButton: {
      marginTop: 12,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
    },
    linkText: {
      fontSize: 13,
      fontWeight: "700",
      color: COLORS.TEXT_ON_LIGHT,
      marginRight: 4,
    },
  });
}
