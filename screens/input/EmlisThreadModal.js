import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CocolonButton from "../../components/CocolonButton";

export function threadStatus(dto) {
  if (!dto || dto.state === "NOT_CREATED") return "この記録の観測はまだありません。";
  if (dto.failure_code === "save_result_unknown") return "処理の完了を確認できません。保存状況を確認してください。";
  if (dto.failure_code === "separate_safety_owner_required") return "この回答は通常の観測として扱えません。";
  if (dto.body_state === "MEANING_UPDATED_BODY_UNAVAILABLE") return "回答と意味の訂正は保存されています。更新後の本文はまだ用意できていません。";
  if (dto.state === "INITIALIZING") return "記録をもとに観測を準備しています。";
  if (dto.state === "REFINING") return "回答は保存済みです。観測を更新しています。";
  if (dto.body_state === "ANSWER_UNREFLECTED") return "回答は保存されています。観測にはまだ反映できていない部分があります。";
  if (dto.body_state === "PARTIALLY_REFINED") return "回答の確認できた部分を反映しました。まだ読み取れていない部分も残っています。";
  if (dto.body_state === "UNCHANGED") return "回答は保存済みです。観測を変える新しい材料はなかったため、本文はそのままです。";
  if (dto.state === "RESPONSE_FAILED") return "観測の本文を用意できませんでした。";
  if (dto.body_state === "REFINED") return "回答を受けて観測を更新しました。";
  if (dto.pending_question) return "答えられる範囲で大丈夫です。質問はスキップできます。";
  return "この記録の観測です。";
}
function dateLabel(value) {
  if (!value) return "";
  const normalized = /(?:Z|[+-]\d\d:\d\d)$/i.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("ja-JP");
}

export default function EmlisThreadModal({ thread, colors }) {
  const { dto, busy, error, draft, uncertain } = thread;
  const textStyle = { color: colors.TEXT_ON_LIGHT };
  return <Modal visible={thread.visible} transparent animationType="fade" onRequestClose={thread.close}>
    <KeyboardAvoidingView style={s.backdrop} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[s.card, { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER }]}>
        <Text style={[s.title, { color: colors.TITLE_GOLD }]}>Emlisの観測</Text>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
          {dto?.original ? <View style={s.section}>
            <Text style={textStyle}>元の記録 · {dateLabel(dto.original.created_at)}</Text>
            {!!dto.original.memo && <Text selectable style={[s.body, textStyle]}>{dto.original.memo}</Text>}
            {!!dto.original.memo_action && <Text selectable style={[s.body, textStyle]}>{dto.original.memo_action}</Text>}
          </View> : null}
          {(dto?.timeline || []).map(event => <View key={event.event_id} style={s.section}>
            <Text style={[s.label, textStyle]}>{event.kind === "QUESTION" ? "Emlisからの質問"
              : event.kind === "ANSWER" ? `あなたの回答 · ${dateLabel(event.authored_at || event.recorded_at)}`
                : event.is_current ? "現在の観測" : "以前の観測"}</Text>
            <Text selectable style={[s.body, textStyle]}>{event.text}</Text>
          </View>)}
          <Text accessibilityLiveRegion="polite" style={[s.body, textStyle]}>{error || threadStatus(dto)}</Text>
          {busy && <ActivityIndicator accessibilityLabel="保存状態を確認中" color={colors.TITLE_GOLD} />}
          {dto?.pending_question && <View style={s.content}>
            <TextInput multiline value={draft} onChangeText={thread.setDraft} editable={!busy && !uncertain}
              maxLength={4000} accessibilityLabel="Emlisへの回答" placeholder="この質問への回答"
              placeholderTextColor={colors.TEXT_ON_LIGHT} textAlignVertical="top"
              style={[s.input, textStyle, { borderColor: colors.CARD_BORDER }]} />
            <Text style={textStyle}>{[...draft].length} / 2000文字</Text>
            <CocolonButton disabled={busy || thread.pendingAction || (uncertain && !thread.reconciled) || !draft.trim() || [...draft].length > 2000} onPress={thread.sendAnswer}>
              {uncertain ? "同じ回答を再送する" : "回答を送る"}
            </CocolonButton>
            <CocolonButton variant="secondary" disabled={busy || uncertain} onPress={() => thread.action("skip")}>今回はスキップ</CocolonButton>
          </View>}
          {dto?.can_retry && <CocolonButton disabled={busy || uncertain} onPress={() => thread.action("retry_response")}>本文を再試行する</CocolonButton>}
          {uncertain && thread.pendingAction && <CocolonButton disabled={busy || !thread.reconciled} onPress={thread.replayPending}>同じ操作を再送する</CocolonButton>}
          <CocolonButton variant="secondary" disabled={busy} onPress={thread.refresh}>保存状況を確認</CocolonButton>
        </ScrollView>
        <CocolonButton variant="secondary" onPress={thread.close} accessibilityLabel="Emlisの観測を閉じる">閉じる</CocolonButton>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}
const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 },
  card: { maxHeight: "90%", borderWidth: 1, borderRadius: 20, padding: 18, gap: 14 },
  title: { fontSize: 20, fontWeight: "700" }, content: { gap: 14, paddingBottom: 12 },
  section: { gap: 6, paddingVertical: 10 }, label: { fontSize: 13, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 26 }, input: { minHeight: 100, maxHeight: 200, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, lineHeight: 24 },
});
