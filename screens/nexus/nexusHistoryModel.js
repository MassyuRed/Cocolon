import { readShareCode } from "../../lib/compat/legacyWireContracts";
import { HISTORY_ORDER_OLDEST } from "./nexusRouteModel";

export function resolvePieceQInstanceId(item) {
  return String(item?.q_instance_id || item?.qInstanceId || "").trim();
}

export function resolvePieceQKey(item) {
  return String(
    item?.question?.q_key || item?.question?.qKey || item?.q_key || item?.qKey || ""
  ).trim() || null;
}

export function resolvePieceOwnerUserId(item) {
  return (
    String(
      item?.owner?.user_id ||
        item?.owner?.userId ||
        item?.owner_user_id ||
        item?.ownerUserId ||
        ""
    ).trim() || null
  );
}

export function buildResonanceHistoryItemFromPiece(item, savedAtValue = null) {
  const qInstanceId = resolvePieceQInstanceId(item);
  if (!qInstanceId) return null;

  const owner = item?.owner && typeof item.owner === "object" ? item.owner : {};
  const question =
    item?.question && typeof item.question === "object" ? item.question : {};
  const metrics = item?.metrics && typeof item.metrics === "object" ? item.metrics : {};
  const viewerState =
    item?.viewer_state && typeof item.viewer_state === "object"
      ? item.viewer_state
      : item?.viewerState && typeof item.viewerState === "object"
      ? item.viewerState
      : {};
  const title = String(question?.title || item?.title || "—").trim() || "—";
  const qKey = resolvePieceQKey(item) || String(item?.q_key || "").trim() || "";
  const ownerUserId = resolvePieceOwnerUserId(item);
  const ownerDisplayName =
    String(
      owner?.display_name ||
        owner?.displayName ||
        item?.owner_display_name ||
        item?.ownerDisplayName ||
        item?.display_name ||
        readShareCode(owner, readShareCode(item, "")) ||
        "ユーザー"
    ).trim() || "ユーザー";
  const savedAt = String(savedAtValue || new Date().toISOString()).trim();
  const createdAt =
    String(item?.created_at || item?.createdAt || item?.generated_at || savedAt || "").trim() ||
    null;
  const body = String(item?.body || item?.piece_body || item?.answer || "").trim();
  const views = Number(metrics?.views ?? item?.views ?? 0) || 0;
  const resonances = Number(metrics?.resonances ?? item?.resonances ?? 0) || 0;

  return {
    ...item,
    qInstanceId,
    q_instance_id: qInstanceId,
    q_key: qKey,
    title,
    ownerDisplayName,
    ownerUserId,
    owner_user_id: ownerUserId,
    savedAt,
    saved_at: savedAt,
    source_type:
      String(item?.source_type || item?.sourceType || "emotion_generated").trim() ||
      "emotion_generated",
    owner: {
      ...owner,
      user_id: ownerUserId,
      display_name: ownerDisplayName,
    },
    question: {
      ...question,
      q_key: qKey,
      title,
    },
    body,
    created_at: createdAt,
    metrics: {
      ...metrics,
      views,
      resonances,
    },
    viewer_state: {
      ...viewerState,
      is_resonated: true,
      can_resonate:
        viewerState?.can_resonate === false || viewerState?.canResonate === false
          ? false
          : true,
    },
  };
}

export function resolveHistorySavedAt(item) {
  return String(
    item?.saved_at ||
      item?.savedAt ||
      item?.resonated_at ||
      item?.resonatedAt ||
      item?.created_at ||
      item?.createdAt ||
      ""
  ).trim();
}

export function sortHistoryItems(items, order) {
  const rows = Array.isArray(items) ? [...items] : [];
  const oldestFirst = order === HISTORY_ORDER_OLDEST;
  rows.sort((a, b) => {
    const aKey = `${resolveHistorySavedAt(a)}:${resolvePieceQInstanceId(a)}`;
    const bKey = `${resolveHistorySavedAt(b)}:${resolvePieceQInstanceId(b)}`;
    if (aKey === bKey) return 0;
    if (oldestFirst) return aKey < bKey ? -1 : 1;
    return aKey > bKey ? -1 : 1;
  });
  return rows;
}
