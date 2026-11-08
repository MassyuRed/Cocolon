import { MODAL_ORIENTATIONS } from "../../ui/uiTokens";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CocolonButton from "../../components/CocolonButton";
import { SafeAreaView } from "react-native-safe-area-context";

export function threadStatus(dto) {
  if (dto?.state === "NOT_CREATED") return dto.can_write === false ? "この記録への返事はまだ用意されていません。現在は返事の更新を一時停止しています。" : "この記録への返事はまだ用意されていません。";
  if (!dto || dto.state === "NOT_CREATED") return "この記録への返事はまだ用意されていません。";
  if (dto.body_state === "CONTEXT_CHANGED") return "参照できる記録や解釈が変わっています。以前の返事は履歴として表示しています。";
  if (dto.failure_code === "save_result_unknown") return "処理の完了を確認できません。「応答を確認する」から保存状態を確認できます。";
  if (dto.can_write === false && (!dto.current_observation || dto.pending_question || dto.can_continue)) return "応答の更新を一時停止しています。保存済みの本文と回答は確認できます。";
  if (dto.failure_code === "safe_state_answer_owner_required") return "この内容への専用の返事はまだ用意できていません。記録は保存されています。";
  if (dto.failure_code === "separate_safety_owner_required") return "この内容は通常の返事とは別の対応が必要です。";
  if (dto.body_state === "MEANING_UPDATED_BODY_UNAVAILABLE") return "回答と意味の訂正は保存されています。更新後の本文はまだ用意できていません。";
  if (dto.state === "INITIALIZING") return "記録をもとにEmlisの返事を準備しています。";
  if (dto.state === "REFINING") return "回答は保存済みです。Emlisの返事を更新しています。";
  if (dto.body_state === "ANSWER_UNREFLECTED") return "回答は保存されています。返事にはまだ反映できていない部分があります。";
  if (dto.body_state === "PARTIALLY_REFINED") return "回答の確認できた部分を反映しました。まだ読み取れていない部分も残っています。";
  if (dto.body_state === "UNCHANGED") return "回答は保存済みです。返事を変える新しい材料はなかったため、本文はそのままです。";
  if (dto.state === "RESPONSE_FAILED") return "Emlisの返事を用意できませんでした。記録は保存されています。";
  if (dto.state === "AWAITING_CONTINUE") return dto.can_continue ? "回答を受けた返事です。必要なら、もう一点だけ続けられます。" : "回答後の返事です。この記録で追加できる質問はありません。";
  if (dto.body_state === "REFINED") return "回答を受けてEmlisの返事を更新しました。";
  if (dto.pending_question) return "答えられる範囲で大丈夫です。質問はスキップできます。";
  return "";
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
  const disabled = thread.busy || thread.uncertain || thread.rejected || thread.dto?.can_write === false;
  return <View style={[s.section, { borderColor }]}>
    <Text style={[s.label, textStyle]}>あなたの言葉からの仮の理解</Text>
    <Text style={[s.description, textStyle]}>{dateLabel(frame.recorded_at)}の「{frame.trigger}」について</Text>
    <Text selectable style={[s.body, textStyle]}>{frame.status === "REVISED" ? frame.correction_text : frame.received_meaning}</Text>
    <Text style={[s.body, textStyle]}>{frame.status === "REJECTED" ? "この理解は今後使いません。" : frame.status === "REVISED" ? "あなたの訂正を保存しました。次の観測から参照します。" : "今回も同じ受け止めとは決めません。違うところは直せます。"}</Text>
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

export default function EmlisThreadModal({ thread, colors, navigation, userId = "", pieceEnabled = false }) {
  const { dto, busy, error, draft, uncertain } = thread;
  const textStyle = { color: colors.TEXT_ON_LIGHT };
  const pendingPiece = useRef(null);
  const live = useRef(null);
  live.current = { thread, navigation, userId, pieceEnabled };
  useEffect(() => () => { pendingPiece.current = null; live.current = null; }, []);
  const [appState, setAppState] = useState(AppState?.currentState);
  const [readStopped, setReadStopped] = useState(false);
  const polling = useRef(null);
  useEffect(() => {
    const listener = AppState?.addEventListener?.("change", setAppState);
    return () => listener?.remove();
  }, []);
  useEffect(() => {
    if (!thread.visible) { polling.current = null; if (readStopped) setReadStopped(false); return; }
    const inputId = dto?.original?.id;
    if (!inputId) return;
    if (!polling.current || polling.current.inputId !== inputId) {
      const startedAt = Date.now();
      polling.current = { inputId, startedAt, deadlineAt: startedAt + 35000,
        serverDeadlineBound: false, attemptId: null, stopped: false };
    }
    const budget = polling.current;
    if (dto.attempt_id) {
      if (budget.attemptId && budget.attemptId !== dto.attempt_id) budget.stopped = true;
      budget.attemptId = dto.attempt_id;
    }
    const serverDeadline = Date.parse(dto.processing_deadline_at || "");
    if (!budget.serverDeadlineBound && dto.attempt_id && Number.isFinite(serverDeadline)) {
      if (serverDeadline > budget.startedAt) budget.deadlineAt = Math.max(budget.deadlineAt, Math.min(serverDeadline, budget.startedAt + 270000));
      budget.serverDeadlineBound = true;
    }
    if (error || uncertain || thread.rejected || dto.can_write === false) budget.stopped = true;
    const pending = (dto.state === "NOT_CREATED" && thread.waitForInitial)
      || ["INITIALIZING", "REFINING"].includes(dto.state);
    if (pending && Date.now() >= budget.deadlineAt) {
      if (!readStopped) setReadStopped(true);
      return;
    }
    if (!pending || budget.stopped || appState !== "active" || busy || thread.pendingAction) return;
    const timer = setTimeout(() => {
      if (Date.now() >= budget.deadlineAt) setReadStopped(true);
      else if (AppState?.currentState === "active" && !budget.stopped) thread.refresh();
    }, 1000);
    // Do not abort the hook's shared controller: it may own an answer POST.
    return () => clearTimeout(timer);
  }, [thread.visible, thread.waitForInitial, dto, busy, error, uncertain, thread.rejected, thread.pendingAction, appState, thread.refresh, readStopped]);
  useEffect(() => { if (thread.visible) pendingPiece.current = null; }, [thread.visible, dto?.original?.id]);
  const readOnly = dto?.can_write === false;
  const blocked = readOnly || thread.rejected;
  const history = (dto?.timeline || []).filter(event =>
    !(dto?.current_observation && event.event_id === dto.current_observation.event_id)
    && !(event.kind === "QUESTION" && dto?.pending_question && event.question_id === dto.pending_question.question_id));

  const canCreatePiece = value => !!value && value.pieceEnabled === true && !!value.userId &&
    typeof value.navigation?.getParent?.()?.navigate === "function" && value.navigation?.isFocused?.() !== false && value.thread.visible &&
    !!value.thread.dto?.current_observation && !value.thread.dto.answer_saved &&
    ["FINAL", "PRE_QUESTION"].includes(value.thread.dto.body_state) &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value.thread.dto.original?.id || "") &&
    !value.thread.busy && !value.thread.error && !value.thread.uncertain &&
    !value.thread.rejected && !value.thread.pendingAction;
  const openPiece = () => {
    const request = pendingPiece.current;
    pendingPiece.current = null;
    const current = live.current;
    if (!request || !current || current.thread.visible || current.navigation?.isFocused?.() === false || request.owner !== current.userId ||
        request.navigation !== current.navigation || current.pieceEnabled !== true) return;
    try {
      current.navigation.getParent().navigate("Piece", {
        screen: "PieceCreate", params: { savedInput: request.savedInput }, initial: false,
      });
    } catch { Alert.alert("ピースの作成", "作成画面を開けませんでした。もう一度お試しください。"); }
  };
  const createPiece = () => {
    const current = live.current;
    if (pendingPiece.current || !canCreatePiece(current) || current.thread.dto !== dto) return;
    try {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      const savedInput = Object.freeze({ savedInputId: dto.original.id, expectedUserId: current.userId,
        idempotencyKey: "piece-preview-" + Array.from(bytes, v => v.toString(16).padStart(2, "0")).join("") });
      pendingPiece.current = { savedInput, owner: current.userId, navigation: current.navigation };
      current.thread.close();
      // iOS must finish dismissing this native modal before Piece opens its own.
    } catch {
      pendingPiece.current = null;
      Alert.alert("ピースの作成", "作成の準備ができませんでした。もう一度お試しください。");
    }
  };
  useEffect(() => {
    if (Platform.OS !== "ios" && !thread.visible) openPiece();
  }, [thread.visible]);
  const status = error || (readStopped && ["NOT_CREATED", "INITIALIZING", "REFINING"].includes(dto?.state)
    ? "応答の準備が続いています。「応答を確認する」から保存状態を確認できます。" : threadStatus(dto));

  return <Modal visible={thread.visible} transparent animationType={Platform.OS === "ios" ? "fade" : "none"}
    onRequestClose={thread.close} onDismiss={openPiece} supportedOrientations={MODAL_ORIENTATIONS}>
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={s.safeArea}>
    <KeyboardAvoidingView style={s.backdrop} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[s.card, { backgroundColor: colors.FIELD_BG, borderColor: colors.CARD_BORDER }]}>
        <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
          <Text style={[s.title, { color: colors.TITLE_GOLD }]}>Emlisからの応答</Text>
          {dto?.current_observation && <View style={[s.section, { borderColor: colors.CARD_BORDER }]}>
            <Text style={[s.label, textStyle]}>応答内容</Text>
            {(busy || error || uncertain || thread.rejected) && <Text style={[s.body, textStyle]}>前回確認した内容です。反映状況はまだ確認できていません。</Text>}
            <Text selectable style={[s.body, textStyle]}>{dto.current_observation.text}</Text>
          </View>}
          {dto?.pending_question && <View style={[s.section, { borderColor: colors.CARD_BORDER, backgroundColor: colors.SURFACE_TONAL }]}>
            <Text style={[s.label, textStyle]}>Emlisからの質問</Text>
            <Text selectable style={[s.body, textStyle]}>{dto.pending_question.text}</Text>
          </View>}
          {!!status && <Text accessibilityLiveRegion="polite" style={[s.body, textStyle]}>{status}</Text>}
          {busy && <ActivityIndicator accessibilityLabel="保存状態を確認中" color={colors.TITLE_GOLD} />}
          {(!dto?.current_observation || readStopped || error || uncertain || thread.rejected
            || ["INITIALIZING", "REFINING"].includes(dto?.state)) &&
            <CocolonButton variant="secondary" disabled={busy || !!thread.pendingAction}
              onPress={() => { polling.current = null; setReadStopped(false); thread.refresh(); }}>
              応答を確認する
            </CocolonButton>}
          {dto?.pending_question && <View style={s.content}>
            <TextInput multiline value={draft} onChangeText={thread.setDraft} editable={!busy && !uncertain && !blocked}
              maxLength={4000} accessibilityLabel="Emlisへの回答" placeholder="この質問への回答"
              placeholderTextColor={colors.TEXT_ON_LIGHT} textAlignVertical="top"
              style={[s.input, textStyle, { borderColor: colors.CARD_BORDER, backgroundColor: colors.FIELD_BG }]} />
            <Text style={[s.description, textStyle]}>{[...draft].length} / 2000文字</Text>
            <CocolonButton disabled={blocked || busy || thread.pendingAction || (uncertain && !thread.reconciled) || !draft.trim() || [...draft].length > 2000} onPress={thread.sendAnswer}>
              {uncertain ? "同じ回答を再送する" : "回答を送る"}
            </CocolonButton>
            <CocolonButton variant="secondary" disabled={blocked || busy || uncertain} onPress={() => thread.action("skip")}>今回はスキップ</CocolonButton>
          </View>}
          {dto?.state === "AWAITING_CONTINUE" && <View style={s.content}>
            {dto.can_continue && <CocolonButton disabled={blocked || busy || uncertain} onPress={() => thread.action("continue")}>もう一点続ける</CocolonButton>}
            <CocolonButton variant="secondary" disabled={blocked || busy || uncertain} onPress={() => thread.action("stop")}>ここで終える</CocolonButton>
          </View>}
          {dto?.can_continue && <Text style={[s.description, textStyle]}>この記録では、あと{Math.max(0, dto.question_limit - dto.issued_count)}問まで続けられます。</Text>}
          {(dto?.interpretive_frames || []).map(frame => <FrameEditor key={`${dto.thread_id}:${frame.frame_ref}`} frame={frame} thread={thread} textStyle={textStyle} borderColor={colors.CARD_BORDER} />)}
          {dto?.can_retry && <CocolonButton disabled={blocked || busy || uncertain} onPress={() => thread.action("retry_response")}>本文を再試行する</CocolonButton>}
          {uncertain && (thread.pendingAction || !dto?.pending_question) && <CocolonButton disabled={blocked || busy || !thread.reconciled} onPress={thread.replayPending}>
            {thread.pendingAction ? "同じ操作を再送する" : "同じ回答を再送する"}
          </CocolonButton>}
          {!dto?.current_observation && <View style={s.content}>
          {dto?.original ? <View style={[s.section, { borderColor: colors.CARD_BORDER }]}>
            <Text style={[s.description, textStyle]}>元の記録 · {dateLabel(dto.original.created_at)}</Text>
            {!!dto.original.memo && <View style={s.originalField}>
              <Text style={[s.label, textStyle]}>考えたこと・感じたこと</Text>
              <Text selectable style={[s.body, textStyle]}>{dto.original.memo}</Text>
            </View>}
            {!!dto.original.memo_action && <View style={s.originalField}>
              <Text style={[s.label, textStyle]}>出来事・行動</Text>
              <Text selectable style={[s.body, textStyle]}>{dto.original.memo_action}</Text>
            </View>}
          </View> : null}
          {history.map(event => <View key={event.event_id} style={[s.section, { borderColor: colors.CARD_BORDER }]}>
            <Text style={[s.label, textStyle]}>{event.kind === "QUESTION" ? `Emlisからの質問${event.round_index ? ` · ${event.round_index}問目` : ""}`
              : event.kind === "ANSWER" ? `あなたの回答 · ${dateLabel(event.authored_at || event.recorded_at)}`
                : "以前の返事"}</Text>
            <Text selectable style={[s.body, textStyle]}>{event.text}</Text>
          </View>)}
          </View>}
        <CocolonButton disabled={!canCreatePiece(live.current)} onPress={createPiece}>ピースの作成</CocolonButton>
        <CocolonButton variant="secondary" onPress={thread.close} accessibilityLabel="Emlisからの応答を閉じる">閉じる</CocolonButton>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  backdrop: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 520, maxHeight: "100%", flexShrink: 1, borderWidth: 1, borderRadius: 24, padding: 20, gap: 14 },
  title: { fontSize: 22, lineHeight: 30, fontWeight: "600" }, content: { gap: 20, paddingBottom: 16 },
  section: { gap: 8, padding: 16, borderWidth: 1, borderRadius: 16 }, label: { fontSize: 14, lineHeight: 22, fontWeight: "600" },
  description: { fontSize: 14, lineHeight: 22, fontWeight: "400" }, originalField: { gap: 8 },
  body: { fontSize: 16, lineHeight: 27, fontWeight: "400" }, input: { minHeight: 100, maxHeight: 200, borderWidth: 1, borderRadius: 16, padding: 16, fontSize: 16, lineHeight: 27, fontWeight: "400" },
});

