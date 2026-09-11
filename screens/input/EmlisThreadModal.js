import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CocolonButton from "../../components/CocolonButton";

export function threadStatus(dto) {
  if (!dto || dto.state === "NOT_CREATED") return "この記録の観測はまだありません。";
  if (dto.body_state === "CONTEXT_CHANGED") return "参照できる記録や解釈が変わっています。以前の観測は履歴として表示しています。";
  if (dto.failure_code === "save_result_unknown") return "処理の完了を確認できません。保存状況を確認してください。";
  if (dto.failure_code === "separate_safety_owner_required") return "この回答は通常の観測として扱えません。";
  if (dto.body_state === "MEANING_UPDATED_BODY_UNAVAILABLE") return "回答と意味の訂正は保存されています。更新後の本文はまだ用意できていません。";
  if (dto.state === "INITIALIZING") return "記録をもとに観測を準備しています。";
  if (dto.state === "REFINING") return "回答は保存済みです。観測を更新しています。";
  if (dto.body_state === "ANSWER_UNREFLECTED") return "回答は保存されています。観測にはまだ反映できていない部分があります。";
  if (dto.body_state === "PARTIALLY_REFINED") return "回答の確認できた部分を反映しました。まだ読み取れていない部分も残っています。";
  if (dto.body_state === "UNCHANGED") return "回答は保存済みです。観測を変える新しい材料はなかったため、本文はそのままです。";
  if (dto.state === "RESPONSE_FAILED") return "観測の本文を用意できませんでした。";
  if (dto.state === "AWAITING_CONTINUE") return dto.can_continue ? "回答を受けた観測です。必要なら、もう一点だけ続けられます。" : "回答後の観測です。この記録で追加できる質問はありません。";
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

function FrameEditor({ frame, thread, textStyle, borderColor }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(frame.correction_text || "");
  const disabled = thread.busy || thread.uncertain;
  return <View style={s.section}>
    <Text style={[s.label, textStyle]}>あなたの言葉からの仮の理解</Text>
    <Text style={textStyle}>{dateLabel(frame.recorded_at)}の「{frame.trigger}」について</Text>
    <Text selectable style={[s.body, textStyle]}>{frame.status === "REVISED" ? frame.correction_text : frame.received_meaning}</Text>
    <Text style={textStyle}>{frame.status === "REJECTED" ? "この理解は今後使いません。" : frame.status === "REVISED" ? "あなたの訂正を保存しました。次の観測から参照します。" : "今回も同じ受け止めとは決めません。違うところは直せます。"}</Text>
    {frame.status === "TENTATIVE" && <CocolonButton disabled={disabled} onPress={() => thread.updateFrame(frame, "CONFIRMED")}>この理解で合っています</CocolonButton>}
    <CocolonButton variant="secondary" disabled={disabled} onPress={() => setEditing(!editing)}>理解を直す</CocolonButton>
    {editing && <>
      <TextInput value={value} onChangeText={setValue} multiline editable={!disabled} maxLength={2000}
        accessibilityLabel="解釈の訂正" style={[s.input, textStyle, { borderColor }]} />
      <CocolonButton disabled={disabled || !value.trim()} onPress={async () => {
        if (await thread.updateFrame(frame, "REVISED", value)) setEditing(false);
      }}>訂正を保存</CocolonButton>
    </>}
    {frame.status !== "REJECTED" && <CocolonButton variant="secondary" disabled={disabled} onPress={() => thread.updateFrame(frame, "REJECTED")}>この理解は使わない</CocolonButton>}
  </View>;
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
            <Text style={[s.label, textStyle]}>{event.kind === "QUESTION" ? `Emlisからの質問${event.round_index ? ` · ${event.round_index}問目` : ""}`
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
          {dto?.state === "AWAITING_CONTINUE" && <View style={s.content}>
            {dto.can_continue && <CocolonButton disabled={busy || uncertain} onPress={() => thread.action("continue")}>もう一点続ける</CocolonButton>}
            <CocolonButton variant="secondary" disabled={busy || uncertain} onPress={() => thread.action("stop")}>ここで終える</CocolonButton>
          </View>}
          {!!dto?.thread_id && <Text style={textStyle}>発行済み{dto.issued_count}問。開始時の上限は{dto.started_question_limit}問です。プランを上げてもこの記録の上限は増えず、下げた場合は現在のプランの範囲で続けます。</Text>}
          {(dto?.interpretive_frames || []).map(frame => <FrameEditor key={`${dto.thread_id}:${frame.frame_key}`} frame={frame} thread={thread} textStyle={textStyle} borderColor={colors.CARD_BORDER} />)}
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
