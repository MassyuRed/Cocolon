const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

export function strengthScoreForFeedback(strength) {
  return STRENGTH_SCORE[strength] || 0;
}

export function formatEmotionForFeedback(entry) {
  return String(entry?.type || "").trim();
}

export function buildInputFeedbackEmotionMeta(values) {
  const items = Array.isArray(values)
    ? values
        .map((entry) => ({
          type: String(entry?.type || "").trim(),
          strength: String(entry?.strength || "medium").trim() || "medium",
        }))
        .filter((entry) => entry.type)
    : [];

  if (items.length === 0) {
    return {
      emotionSummary: "",
      dominantSummary: "",
      dominantLabel: "",
    };
  }

  let dominant = items[0];
  for (const item of items) {
    if (strengthScoreForFeedback(item.strength) > strengthScoreForFeedback(dominant.strength)) {
      dominant = item;
    }
  }

  const emotionSummary = items
    .map((entry) => formatEmotionForFeedback(entry))
    .filter(Boolean)
    .join("／");
  const dominantLabel = formatEmotionForFeedback(dominant);

  return {
    emotionSummary: emotionSummary ? `選択した感情：${emotionSummary}` : "",
    dominantSummary: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
    dominantLabel: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
  };
}
