export const MEMO_INPUT_INITIAL_HEIGHT = 44;
export const FOCUSED_INPUT_SCROLL_OFFSET = 110;

export function normalizeMemoInputContentHeight(height) {
  const nextHeight = Number(height);
  if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
    return MEMO_INPUT_INITIAL_HEIGHT;
  }
  return Math.max(MEMO_INPUT_INITIAL_HEIGHT, Math.ceil(nextHeight));
}

export function clampMemoInputVisibleHeight(height, maxHeight) {
  const maxHeightNumber = Number(maxHeight);
  const safeMaxHeight = Number.isFinite(maxHeightNumber) && maxHeightNumber > 0
    ? maxHeightNumber
    : 520;

  return Math.min(
    normalizeMemoInputContentHeight(height),
    Math.max(MEMO_INPUT_INITIAL_HEIGHT, safeMaxHeight)
  );
}
