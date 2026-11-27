const emotionColors = [
  ["joy", "喜び", "16,185,129", "#065F46"],
  ["sadness", "悲しみ", "99,102,241", "#3730A3"],
  ["anger", "怒り", "239,68,68", "#7F1D1D"],
  ["anxiety", "不安", "56,189,248", "#0369A1"],
  ["calm", "平穏", "234,179,8", "#A16207"],
];

export const EMOTION_COLORS = Object.freeze(emotionColors.map(([key, label, channels, text]) =>
  Object.freeze({
    key,
    label,
    color: `rgb(${channels})`,
    bg: `rgba(${channels},0.12)`,
    text,
  })
));

export function emotionTint(emotion, defaultTextColor) {
  return EMOTION_COLORS.find(({ label }) => label === emotion) ||
    { bg: "rgba(107,114,128,0.12)", text: defaultTextColor };
}
