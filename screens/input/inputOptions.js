export const SELF_INSIGHT = "自己理解";

export const VALID_STRENGTHS = new Set(["weak", "medium", "strong"]);

// 感情ボタンの配置（2段構成：自己理解は平穏の隣）
export const EMOTION_ROWS = Object.freeze([
  Object.freeze(["喜び", "悲しみ", "怒り"]),
  Object.freeze(["不安", "平穏", SELF_INSIGHT]),
]);

export const CATEGORY_OPTIONS = Object.freeze([
  "生活",
  "仕事",
  "趣味",
  "人間関係",
  "恋愛",
  "健康",
  "学習",
  "価値観",
  "人生",
]);

export const INPUT_TUTORIAL_STEP_START = 2;
export const INPUT_TUTORIAL_STEP_END = 7;
