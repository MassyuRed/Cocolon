import { HISTORY_ORDER_OLDEST } from "./nexusRouteModel";

export function isPieceV2Post(item) {
  return (item?.source_type ?? item?.sourceType) === "piece_v2";
}

export function readPieceViewerState(item) {
  const state = item?.viewer_state ?? item?.viewerState;
  return state && typeof state === "object" ? state : {};
}

export function isPieceResonated(item) {
  const viewer = readPieceViewerState(item);
  return (viewer.is_resonated ?? viewer.isResonated ?? item?.is_resonated ?? item?.isResonated) === true;
}

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

export function applyPieceResonanceReceipt(row, { resonated, resonances, views }) {
  return {
    ...row,
    viewer_state: { ...readPieceViewerState(row), is_resonated: resonated },
    metrics: { ...row?.metrics, resonances, ...(views == null ? {} : { views }) },
  };
}

export function reconcileResonanceHistory(rows, receipts, order, limit) {
  const remaining = rows.flatMap((row) => {
    const receipt = receipts.get(resolvePieceQInstanceId(row));
    if (!receipt) return [row];
    if (!receipt.resonated) return [];
    return [applyPieceResonanceReceipt(row, receipt)];
  });
  return sortHistoryItems(remaining, order).slice(0, limit);
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
