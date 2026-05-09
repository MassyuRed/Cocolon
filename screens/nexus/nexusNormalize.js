import { readShareCode } from "../../lib/compat/legacyWireContracts";

export const STRENGTH_LABEL = {
  weak: "弱",
  medium: "中",
  strong: "強",
};

export function emotionTint(emotion, defaultTextColor) {
  switch (emotion) {
    case "喜び":
      return { bg: "rgba(16,185,129,0.12)", text: "#065F46" };
    case "悲しみ":
      return { bg: "rgba(99,102,241,0.12)", text: "#3730A3" };
    case "怒り":
      return { bg: "rgba(239,68,68,0.12)", text: "#7F1D1D" };
    case "不安":
      return { bg: "rgba(56,189,248,0.12)", text: "#0369A1" };
    case "平穏":
      return { bg: "rgba(234,179,8,0.12)", text: "#A16207" };
    default:
      return { bg: "rgba(107,114,128,0.12)", text: defaultTextColor };
  }
}

export function normalizeEmotionRankingItems(json) {
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

export function normalizeEmotionLogItems(json) {
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
    const ownerName =
      String(
        row?.ownerName || row?.owner_name || row?.ownerNameLabel || ""
      ).trim() || "ユーザー";
    const timeLabel =
      String(row?.timeLabel || "").trim() ||
      formatDateLabel(row?.created_at || row?.createdAt || null);
    return {
      id: String(row?.id || `emotion-log-${index}`),
      ownerName,
      timeLabel,
      createdAt: String(row?.createdAt || row?.created_at || "").trim() || null,
      items: items.map((item) => ({
        type: String(item?.type || item?.emotion || "").trim() || "感情",
        strength: String(item?.strength || "").trim(),
      })),
    };
  });
}

export function normalizeRecommendUsers(json) {
  const users = Array.isArray(json?.users)
    ? json.users
    : Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return users.map((user, index) => ({
    id: String(user?.id || user?.user_id || `user-${index}`),
    displayName:
      String(
        user?.display_name || user?.name || readShareCode(user, "") || "ユーザー"
      ).trim() || "ユーザー",
    shareCode: readShareCode(user, null),
  }));
}

export function normalizeFollowListUsers(json) {
  const rows = Array.isArray(json?.rows)
    ? json.rows
    : Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json?.users)
    ? json.users
    : Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
    ? json
    : [];

  const seen = new Set();
  const users = [];
  rows.forEach((user, index) => {
    const id = String(user?.id || user?.user_id || user?.userId || "").trim();
    if (!id || seen.has(id)) return;
    seen.add(id);

    const displayName =
      String(
        user?.display_name ||
          user?.displayName ||
          user?.name ||
          readShareCode(user, "") ||
          `ユーザー ${index + 1}`
      ).trim() || `ユーザー ${index + 1}`;
    const friendCode =
      String(
        user?.friend_code ||
          user?.share_code ||
          user?.connect_code ||
          user?.myprofile_code ||
          ""
      ).trim() || null;

    users.push({ id, displayName, friendCode });
  });

  return users;
}

export function normalizeSavedPieces(json) {
  const items = Array.isArray(json?.items)
    ? json.items
    : Array.isArray(json)
    ? json
    : [];
  return items.map((item, index) => {
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

    const qInstanceId =
      String(item?.q_instance_id || item?.qInstanceId || "").trim() ||
      `saved-${index}`;
    const qKey =
      String(question?.q_key || question?.qKey || item?.q_key || item?.qKey || "").trim() ||
      `saved-q-${index}`;
    const title =
      String(question?.title || item?.title || item?.question_title || "—").trim() ||
      "—";
    const ownerUserId =
      String(
        owner?.user_id ||
          owner?.userId ||
          item?.owner_user_id ||
          item?.ownerUserId ||
          ""
      ).trim() || null;
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
    const savedAt = String(item?.saved_at || item?.savedAt || "").trim();
    const createdAt =
      String(
        item?.created_at ||
          item?.createdAt ||
          item?.piece_created_at ||
          item?.pieceCreatedAt ||
          item?.generated_at ||
          item?.generatedAt ||
          savedAt ||
          ""
      ).trim() || null;
    const body =
      String(
        item?.body ||
          item?.piece_body ||
          item?.pieceBody ||
          item?.answer ||
          item?.answer_body ||
          ""
      ).trim() || "";
    const views = Number(metrics?.views ?? item?.views ?? 0) || 0;
    const resonances = Number(metrics?.resonances ?? item?.resonances ?? 0) || 0;
    const canResonate =
      viewerState?.can_resonate === false || viewerState?.canResonate === false
        ? false
        : true;

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
        can_resonate: canResonate,
      },
    };
  });
}

export function normalizeTutorialPieceItems(items) {
  const rows = Array.isArray(items) ? items : [];
  return rows.map((item, index) => ({
    q_instance_id:
      String(item?.q_instance_id || "").trim() ||
      `piece:tutorial-${index}`,
    source_type: "emotion_generated",
    owner: {
      user_id:
        String(item?.owner_user_id || item?.owner?.user_id || "").trim() ||
        `tutorial-user-${index}`,
      display_name:
        String(
          item?.display_name || item?.owner?.display_name || "ユーザー"
        ).trim() || "ユーザー",
      share_code: readShareCode(item, null) || readShareCode(item?.owner, null),
    },
    question: {
      q_key:
        String(item?.q_key || item?.question?.q_key || "").trim() ||
        `tutorial-q-${index}`,
      title:
        String(item?.title || item?.question?.title || "ピース").trim() ||
        "ピース",
    },
    body: String(item?.body || "").trim(),
    created_at: String(item?.created_at || "").trim() || null,
    metrics: {
      views: Number(item?.views || item?.metrics?.views || 0) || 0,
      resonances:
        Number(item?.resonances || item?.metrics?.resonances || 0) || 0,
    },
    viewer_state: {
      is_new:
        item?.viewer_state?.is_new === true || item?.is_new === true,
    },
    is_tutorial: true,
  }));
}

export function normalizeDetailResonanceCount(value) {
  return Number(value || 0) || 0;
}

export function formatDateLabel(value) {
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
