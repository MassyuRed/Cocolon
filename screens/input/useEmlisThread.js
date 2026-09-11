import { useEffect, useRef, useState } from "react";
import { EMLIS_THREADS_ENABLED, emlisThreadApi } from "../../lib/api/emlisThreadApi";

const empty = () => ({ visible: false, dto: null, draft: "", busy: false, error: "", uncertain: false, reconciled: false });
let keySequence = 0;
function operationKey() {
  keySequence += 1;
  return `q2-${Date.now().toString(36)}-${keySequence}-${Math.random().toString(36).slice(2)}`;
}

// Drafts and in-flight payloads exist only in component memory. Each response is
// bound to the requesting account and open window; a late response cannot reopen it.
export function useEmlisThread({ userId, enabled = EMLIS_THREADS_ENABLED, api = emlisThreadApi }) {
  const [state, setState] = useState(empty);
  const context = useRef({ userId, epoch: 0, inputId: null, busy: false, pending: null, controller: null });
  const owner = useRef(userId);
  owner.current = userId;

  function reset() {
    const c = context.current;
    c.controller?.abort();
    context.current = { userId: owner.current, epoch: c.epoch + 1, inputId: null, busy: false, pending: null, controller: null };
    setState(empty());
  }
  useEffect(() => {
    reset();
    return () => { context.current.epoch += 1; context.current.controller?.abort(); };
  }, [userId, enabled]);

  async function perform(method, body) {
    const c = context.current;
    if (!enabled || !userId || owner.current !== c.userId || c.busy || !c.inputId) return false;
    c.busy = true;
    c.controller = new AbortController();
    const epoch = c.epoch;
    const active = () => context.current === c && c.epoch === epoch && owner.current === c.userId;
    setState(s => ({ ...s, busy: true, error: "" }));
    try {
      const dto = method === "get"
        ? await api.get(c.inputId, c.controller.signal)
        : await api[method](body.threadId, body.payload, c.controller.signal);
      if (!active()) return false;
      // A GET that still sees an unanswered question cannot prove that a timed
      // out admission rolled back. Keep the original payload/key for a replay.
      if (method !== "get" || dto.answer_saved || (c.pending && dto.revision > c.pending.payload.expected_revision)) c.pending = null;
      setState(s => ({ ...s, dto, draft: dto.answer_saved ? "" : s.draft,
        uncertain: Boolean(c.pending), reconciled: method === "get", busy: false, error: "" }));
      return true;
    } catch (error) {
      if (!active()) return false;
      if (error?.status === 401 || error?.status === 404 || (method === "get" && error?.status === 409)) {
        c.pending = null;
        setState(s => ({ ...s, dto: null, draft: "", uncertain: false, busy: false,
          error: "この観測は現在参照できません。" }));
      } else {
        setState(s => ({ ...s, busy: false, uncertain: Boolean(c.pending), reconciled: false,
          error: error?.status === 409 ? "保存状態が更新されています。保存状況を確認してください。"
            : "通信結果を確認できませんでした。保存状況を確認してください。" }));
      }
      return false;
    } finally { if (active()) c.busy = false; }
  }

  async function open(inputId) {
    if (!enabled || !userId || !inputId || owner.current !== userId) return false;
    reset();
    context.current.inputId = String(inputId);
    setState({ ...empty(), visible: true });
    await perform("get");
    return context.current.inputId === String(inputId) && owner.current === userId;
  }
  async function sendAnswer() {
    const c = context.current;
    const dto = state.dto;
    if (c.pending && !state.reconciled) return;
    if (!dto?.pending_question || !state.draft.trim() || [...state.draft].length > 2000 || c.busy) return;
    if (!c.pending) c.pending = { method: "answer", threadId: dto.thread_id, payload: {
      expected_revision: dto.revision, question_id: dto.pending_question.question_id,
      idempotency_key: operationKey(), answer_text: state.draft, authored_at: new Date().toISOString(),
    } };
    if (c.pending.method !== "answer") return;
    await perform("answer", c.pending);
  }
  async function action(actionName) {
    const c = context.current;
    const dto = state.dto;
    if (!dto || c.busy || c.pending) return;
    if (actionName === "retry_response" ? !dto.can_retry : !dto.pending_question) return;
    c.pending = { method: "action", threadId: dto.thread_id, payload: {
      action: actionName, expected_revision: dto.revision, idempotency_key: operationKey(),
      ...(actionName === "retry_response" ? { operation_id: dto.operation_id } : { question_id: dto.pending_question.question_id }),
    } };
    await perform("action", c.pending);
  }
  const safeState = context.current.userId === userId && enabled ? state : empty();
  return { ...safeState, enabled, open, close: reset, reset, refresh: () => perform("get"), sendAnswer, action,
    pendingAction: context.current.pending?.method === "action",
    replayPending: () => {
      const pending = context.current.pending;
      if (pending && state.reconciled) return perform(pending.method, pending);
    },
    setDraft: draft => { if (!context.current.pending && !context.current.busy) setState(s => ({ ...s, draft })); },
  };
}
