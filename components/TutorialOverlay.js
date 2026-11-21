import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useTheme } from "../theme/ThemeContext";

const DEFAULT_DIM_OPACITY = 0.62;
const DEFAULT_TARGET_PADDING = 8;
const DEFAULT_TARGET_RADIUS = 16;
const DEFAULT_CARD_SIDE_MARGIN = 12;
const DEFAULT_CARD_BOTTOM_MARGIN = 0;
const DEFAULT_CARD_EDGE_OFFSET = 4;
const DEFAULT_CARD_FALLBACK_HEIGHT = 220;
const DEFAULT_CARD_MIN_HEIGHT = 72;
const DEFAULT_CARD_MAX_HEIGHT = 520;
const DEFAULT_CARD_MAX_HEIGHT_RATIO = 0.74;
const DEFAULT_CARD_PLACEMENT_SWAP_BUFFER = 16;
const DEFAULT_ACTION_HINT = "スポットライトの場所を押してください";
const DEFAULT_NEXT_LABEL = "次へ";
const DEFAULT_TARGET_TOUCH_PADDING = 8;
const DEFAULT_TARGET_HIT_SLOP = 12;
const DEFAULT_TARGET_GAP = 12;
const DEFAULT_MEASURE_TOLERANCE = 0.75;
const DEFAULT_SETTLE_FRAMES = 2;
const DEFAULT_MAX_MEASURE_ATTEMPTS = 3;

function getCardAnchors({
  safeTop,
  safeBottom,
  cardBottomMargin = DEFAULT_CARD_BOTTOM_MARGIN,
}) {
  const resolvedCardBottomMargin = Number.isFinite(Number(cardBottomMargin))
    ? Number(cardBottomMargin)
    : DEFAULT_CARD_BOTTOM_MARGIN;

  return {
    topBase: Math.max(0, Number(safeTop) || 0) + DEFAULT_CARD_EDGE_OFFSET,
    bottomOffset:
      Math.max(0, Number(safeBottom) || 0) + Math.max(0, resolvedCardBottomMargin),
  };
}

// Insets are window-relative; this overlay can begin below the app header or
// inside a safe-area modal. Reuse the measured window rect for local edges.
function resolveOverlaySafeInsets({ safeInsets, overlayWindowRect, windowWidth, windowHeight }) {
  const insets = {
    top: Math.max(0, Number(safeInsets?.top) || 0),
    right: Math.max(0, Number(safeInsets?.right) || 0),
    bottom: Math.max(0, Number(safeInsets?.bottom) || 0),
    left: Math.max(0, Number(safeInsets?.left) || 0),
  };
  const rect = normalizeMeasuredRect(overlayWindowRect);
  if (!rect || !(windowWidth > 0) || !(windowHeight > 0)) return insets;
  return {
    top: clamp(insets.top - rect.y, 0, rect.height),
    right: clamp(rect.right - (windowWidth - insets.right), 0, rect.width),
    bottom: clamp(rect.bottom - (windowHeight - insets.bottom), 0, rect.height),
    left: clamp(insets.left - rect.x, 0, rect.width),
  };
}

function getCardAvailableHeights({
  holeRect,
  screenHeight,
  cardTopBase,
  cardBottom,
  targetGap = DEFAULT_TARGET_GAP,
}) {
  const resolvedScreenHeight = Math.max(0, Number(screenHeight) || 0);
  const resolvedCardTopBase = Math.max(0, Number(cardTopBase) || 0);
  const resolvedCardBottom = Math.max(0, Number(cardBottom) || 0);
  const bottomAnchorY = Math.max(0, resolvedScreenHeight - resolvedCardBottom);
  const fullHeight = Math.max(0, bottomAnchorY - resolvedCardTopBase);

  if (!holeRect) {
    return {
      fullHeight,
      topHeight: fullHeight,
      bottomHeight: fullHeight,
    };
  }

  const gap = Math.max(8, Number(targetGap) || DEFAULT_TARGET_GAP);

  return {
    fullHeight,
    topHeight: Math.max(0, holeRect.y - resolvedCardTopBase - gap),
    bottomHeight: Math.max(0, bottomAnchorY - holeRect.bottom - gap),
  };
}

function getCardHeightCap(screenHeight) {
  const compactMaxHeight = Math.floor(
    Math.max(0, Number(screenHeight) || 0) * DEFAULT_CARD_MAX_HEIGHT_RATIO
  );

  return Math.max(
    DEFAULT_CARD_MIN_HEIGHT,
    Math.min(DEFAULT_CARD_MAX_HEIGHT, compactMaxHeight || DEFAULT_CARD_MAX_HEIGHT)
  );
}

function resolveCardPlacement({
  preferredPlacement,
  holeRect,
  availableTopHeight,
  availableBottomHeight,
  estimatedCardHeight,
  minUsableHeight = DEFAULT_CARD_MIN_HEIGHT,
}) {
  const preferred =
    preferredPlacement === "top" || preferredPlacement === "bottom"
      ? preferredPlacement
      : availableBottomHeight >= availableTopHeight
        ? "bottom"
        : "top";

  if (!holeRect) {
    return preferred;
  }

  const alternate = preferred === "top" ? "bottom" : "top";
  const preferredHeight = preferred === "top" ? availableTopHeight : availableBottomHeight;
  const alternateHeight = alternate === "top" ? availableTopHeight : availableBottomHeight;
  const comfortableHeight = Math.min(
    Math.max(0, Number(estimatedCardHeight) || DEFAULT_CARD_FALLBACK_HEIGHT),
    Math.max(0, Number(minUsableHeight) || DEFAULT_CARD_MIN_HEIGHT)
  );

  if (preferredHeight >= comfortableHeight) {
    return preferred;
  }

  if (alternateHeight >= comfortableHeight) {
    return alternate;
  }

  if (
    preferredPlacement !== "auto" &&
    preferredHeight >= alternateHeight - DEFAULT_CARD_PLACEMENT_SWAP_BUFFER
  ) {
    return preferred;
  }

  return alternateHeight > preferredHeight ? alternate : preferred;
}

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function clamp(value, min, max) {
  if (!isFiniteNumber(value)) return min;
  return Math.min(Math.max(Number(value), min), max);
}

function normalizeMeasuredRect(rect) {
  if (!rect) return null;

  const x = Number(rect.x ?? rect.left ?? 0);
  const y = Number(rect.y ?? rect.top ?? 0);
  const width = Number(rect.width ?? 0);
  const height = Number(rect.height ?? 0);

  if (
    !isFiniteNumber(x) ||
    !isFiniteNumber(y) ||
    !isFiniteNumber(width) ||
    !isFiniteNumber(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return {
    x,
    y,
    width,
    height,
    right: x + width,
    bottom: y + height,
  };
}

function rectsAlmostEqual(a, b, tolerance = DEFAULT_MEASURE_TOLERANCE) {
  if (!a || !b) return false;
  const t = Math.max(0.25, Number(tolerance) || DEFAULT_MEASURE_TOLERANCE);
  return (
    Math.abs(a.x - b.x) <= t &&
    Math.abs(a.y - b.y) <= t &&
    Math.abs(a.width - b.width) <= t &&
    Math.abs(a.height - b.height) <= t
  );
}

function normalizeTargetRect(rect, screenWidth, screenHeight, padding) {
  const safeRect = normalizeMeasuredRect(rect);
  if (!safeRect) return null;

  const x = clamp(safeRect.x - padding, 0, screenWidth);
  const y = clamp(safeRect.y - padding, 0, screenHeight);
  const right = clamp(safeRect.right + padding, 0, screenWidth);
  const bottom = clamp(safeRect.bottom + padding, 0, screenHeight);

  const width = Math.max(0, right - x);
  const height = Math.max(0, bottom - y);

  if (width <= 0 || height <= 0) return null;

  return {
    x,
    y,
    width,
    height,
    right,
    bottom,
  };
}

export function waitForTutorialFrames(frameCount = DEFAULT_SETTLE_FRAMES) {
  const total = Math.max(1, Math.floor(Number(frameCount) || DEFAULT_SETTLE_FRAMES));

  return new Promise((resolve) => {
    let remaining = total;

    const step = () => {
      requestAnimationFrame(() => {
        remaining -= 1;
        if (remaining <= 0) {
          resolve();
          return;
        }
        step();
      });
    };

    step();
  });
}

function measureTutorialTargetLegacyOnce(targetRef, rootRef) {
  return new Promise((resolve) => {
    const targetNode = targetRef?.current ?? targetRef ?? null;
    const rootNode = rootRef?.current ?? rootRef ?? null;

    if (!targetNode) {
      resolve(null);
      return;
    }

    const finish = (x, y, width, height) => {
      resolve(
        normalizeMeasuredRect({
          x,
          y,
          width,
          height,
        })
      );
    };

    const fail = () => resolve(null);

    requestAnimationFrame(() => {
      try {
        if (rootNode && typeof targetNode.measureLayout === "function") {
          targetNode.measureLayout(rootNode, finish, fail);
          return;
        }

        if (typeof targetNode.measureInWindow === "function") {
          targetNode.measureInWindow(finish);
          return;
        }

        if (typeof targetNode.measure === "function") {
          targetNode.measure((x, y, width, height) => {
            finish(x, y, width, height);
          });
          return;
        }
      } catch {
        // noop
      }

      fail();
    });
  });
}

function measureNodeRectInWindowOnce(nodeRef) {
  return new Promise((resolve) => {
    const node = nodeRef?.current ?? nodeRef ?? null;

    if (!node) {
      resolve(null);
      return;
    }

    const finish = (x, y, width, height) => {
      resolve(
        normalizeMeasuredRect({
          x,
          y,
          width,
          height,
        })
      );
    };

    const fail = () => resolve(null);

    requestAnimationFrame(() => {
      try {
        if (typeof node.measureInWindow === "function") {
          node.measureInWindow((x, y, width, height) => {
            finish(x, y, width, height);
          });
          return;
        }

        if (typeof node.measure === "function") {
          node.measure((x, y, width, height, pageX, pageY) => {
            finish(
              isFiniteNumber(pageX) ? pageX : x,
              isFiniteNumber(pageY) ? pageY : y,
              width,
              height
            );
          });
          return;
        }
      } catch {
        // noop
      }

      fail();
    });
  });
}

async function measureNodeRectInWindow(nodeRef, options = {}) {
  const maxAttempts = Math.max(
    1,
    Math.floor(Number(options.maxAttempts) || DEFAULT_MAX_MEASURE_ATTEMPTS)
  );
  const settleFrames = Math.max(0, Math.floor(Number(options.settleFrames) || 0));
  const tolerance = Math.max(
    0.25,
    Number(options.tolerance) || DEFAULT_MEASURE_TOLERANCE
  );

  let previousRect = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0 || settleFrames > 0) {
      await waitForTutorialFrames(attempt > 0 ? Math.max(1, settleFrames) : settleFrames);
    }

    const rect = await measureNodeRectInWindowOnce(nodeRef);
    if (!rect) {
      return previousRect;
    }

    if (previousRect && rectsAlmostEqual(previousRect, rect, tolerance)) {
      return rect;
    }

    previousRect = rect;
  }

  return previousRect;
}

function localizeRectToContainerWindowRect(targetWindowRect, containerWindowRect) {
  const safeTargetRect = normalizeMeasuredRect(targetWindowRect);
  const safeContainerRect = normalizeMeasuredRect(containerWindowRect);

  if (!safeTargetRect || !safeContainerRect) {
    return safeTargetRect;
  }

  return normalizeMeasuredRect({
    x: safeTargetRect.x - safeContainerRect.x,
    y: safeTargetRect.y - safeContainerRect.y,
    width: safeTargetRect.width,
    height: safeTargetRect.height,
  });
}

/**
 * targetRef をチュートリアル用に測定する helper。
 * - rootRef が渡された場合は root 基準のローカル座標で返します。
 * - rootRef が無い場合は window 座標を返します。
 * - 同じ要素を複数フレームで再測定し、値が安定した矩形を優先します。
 */
export async function measureTutorialTarget(targetRef, rootRef, options = {}) {
  const maxAttempts = Math.max(
    1,
    Math.floor(Number(options.maxAttempts) || DEFAULT_MAX_MEASURE_ATTEMPTS)
  );
  const settleFrames = Math.max(0, Math.floor(Number(options.settleFrames) || 0));
  const tolerance = Math.max(
    0.25,
    Number(options.tolerance) || DEFAULT_MEASURE_TOLERANCE
  );
  const overlayWindowRect = normalizeMeasuredRect(
    options.overlayWindowRect || options.coordinateSpaceRect
  );
  const shouldPreferWindowSpace =
    options.coordinateSpace === "window" || !!overlayWindowRect;

  if (shouldPreferWindowSpace) {
    const containerWindowRect =
      overlayWindowRect ||
      (rootRef
        ? await measureNodeRectInWindow(rootRef, {
            maxAttempts,
            settleFrames,
            tolerance,
          })
        : null);

    let previousWindowRect = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (attempt > 0 || settleFrames > 0) {
        await waitForTutorialFrames(
          attempt > 0 ? Math.max(1, settleFrames) : settleFrames
        );
      }

      const nextWindowRect = await measureNodeRectInWindowOnce(targetRef);
      if (!nextWindowRect) {
        return localizeRectToContainerWindowRect(previousWindowRect, containerWindowRect);
      }

      if (previousWindowRect && rectsAlmostEqual(previousWindowRect, nextWindowRect, tolerance)) {
        return localizeRectToContainerWindowRect(nextWindowRect, containerWindowRect);
      }

      previousWindowRect = nextWindowRect;
    }

    return localizeRectToContainerWindowRect(previousWindowRect, containerWindowRect);
  }

  let previousRect = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0 || settleFrames > 0) {
      await waitForTutorialFrames(attempt > 0 ? Math.max(1, settleFrames) : settleFrames);
    }

    const rect = await measureTutorialTargetLegacyOnce(targetRef, rootRef);
    if (!rect) {
      return previousRect;
    }

    if (previousRect && rectsAlmostEqual(previousRect, rect, tolerance)) {
      return rect;
    }

    previousRect = rect;
  }

  return previousRect;
}

function buildFallbackCardRect({
  overlayHeight,
  safeTop,
  safeBottom,
  cardPlacement,
  cardBottomMargin,
  cardHeight,
}) {
  const fallbackPlacement = cardPlacement === "top" ? "top" : "bottom";
  const { topBase, bottomOffset } = getCardAnchors({
    safeTop,
    safeBottom,
    cardBottomMargin,
  });
  const fallbackCardHeight = Math.max(
    1,
    Math.min(
      Number(cardHeight) || DEFAULT_CARD_FALLBACK_HEIGHT,
      getCardHeightCap(overlayHeight),
      Math.max(0, overlayHeight - topBase - bottomOffset)
    )
  );
  const top =
    fallbackPlacement === "top"
      ? topBase
      : Math.max(topBase, overlayHeight - bottomOffset - fallbackCardHeight);

  return {
    x: 0,
    y: top,
    width: 1,
    height: fallbackCardHeight,
    right: 1,
    bottom: top + fallbackCardHeight,
  };
}

export function buildTutorialViewport({
  overlayMetrics,
  windowHeight,
  safeInsets,
  cardPlacement = "bottom",
  cardBottomMargin = DEFAULT_CARD_BOTTOM_MARGIN,
  targetGap = DEFAULT_TARGET_GAP,
  fallbackCardHeight = DEFAULT_CARD_FALLBACK_HEIGHT,
}) {
  const overlayHeight = Math.max(
    1,
    Number(overlayMetrics?.overlayHeight) || Number(windowHeight) || 1
  );
  const safeTop = Math.max(
    0,
    Number(overlayMetrics?.safeInsets?.top ?? safeInsets?.top ?? 0) || 0
  );
  const safeBottom = Math.max(
    0,
    Number(overlayMetrics?.safeInsets?.bottom ?? safeInsets?.bottom ?? 0) || 0
  );
  const gap = Math.max(8, Number(targetGap) || DEFAULT_TARGET_GAP);
  const cardRect =
    normalizeMeasuredRect(overlayMetrics?.cardRect) ||
    buildFallbackCardRect({
      overlayHeight,
      safeTop,
      safeBottom,
      cardPlacement,
      cardBottomMargin,
      cardHeight:
        Number(overlayMetrics?.cardHeight) ||
        Number(fallbackCardHeight) ||
        DEFAULT_CARD_FALLBACK_HEIGHT,
    });
  const resolvedPlacement =
    overlayMetrics?.cardPlacement || (cardPlacement === "top" ? "top" : "bottom");

  const top =
    resolvedPlacement === "top"
      ? clamp(cardRect.bottom + gap, 0, overlayHeight)
      : clamp(safeTop + gap, 0, overlayHeight);
  const bottom =
    resolvedPlacement === "top"
      ? clamp(overlayHeight - safeBottom - gap, 0, overlayHeight)
      : clamp(cardRect.y - gap, 0, overlayHeight);

  return {
    top,
    bottom: Math.max(top + 1, bottom),
    overlayHeight,
    safeTop,
    safeBottom,
    gap,
    cardRect,
    cardPlacement: resolvedPlacement,
  };
}

function getTutorialScrollDelta(rect, viewport, scrollPadding) {
  const safeRect = normalizeMeasuredRect(rect);
  if (!safeRect || !viewport) return 0;

  const padding = Math.max(0, Number(scrollPadding) || 0);
  const availableHeight = Math.max(0, viewport.bottom - viewport.top - padding * 2);

  // A tall target cannot satisfy both edges. Keep its start visible instead
  // of alternating between top and bottom on each metrics update.
  if (safeRect.height > availableHeight) {
    return safeRect.y - viewport.top - padding;
  }

  if (safeRect.y < viewport.top) {
    return safeRect.y - viewport.top - padding;
  }

  if (safeRect.bottom > viewport.bottom) {
    return safeRect.bottom - viewport.bottom + padding;
  }

  return 0;
}

export async function syncTutorialSpotlightTarget({
  enabled = true,
  targetRef,
  rootRef,
  scrollRef,
  currentScrollYRef,
  overlayMetrics,
  windowHeight,
  safeInsets,
  cardPlacement = "bottom",
  cardBottomMargin = DEFAULT_CARD_BOTTOM_MARGIN,
  targetGap = DEFAULT_TARGET_GAP,
  scrollPadding = 24,
  settleFrames = DEFAULT_SETTLE_FRAMES,
  measureOptions,
}) {
  if (!enabled) return null;

  const resolvedMeasureOptions = {
    ...(measureOptions || {}),
    coordinateSpace: "window",
    overlayWindowRect:
      normalizeMeasuredRect(overlayMetrics?.overlayWindowRect) ||
      normalizeMeasuredRect(measureOptions?.overlayWindowRect),
  };

  const firstRect = await measureTutorialTarget(targetRef, rootRef, resolvedMeasureOptions);
  if (!firstRect) return null;

  const viewport = buildTutorialViewport({
    overlayMetrics,
    windowHeight,
    safeInsets,
    cardPlacement,
    cardBottomMargin,
    targetGap,
  });

  const delta = getTutorialScrollDelta(firstRect, viewport, scrollPadding);
  if (Math.abs(delta) < 1) {
    return firstRect;
  }

  const scrollNode = scrollRef?.current;
  if (!scrollNode || typeof scrollNode.scrollTo !== "function") {
    return firstRect;
  }

  const currentY = Number(currentScrollYRef?.current ?? 0) || 0;
  const nextScrollY = Math.max(0, currentY + delta);

  try {
    scrollNode.scrollTo({ y: nextScrollY, animated: false });
    if (currentScrollYRef && typeof currentScrollYRef === "object") {
      currentScrollYRef.current = nextScrollY;
    }
  } catch {
    return firstRect;
  }

  await waitForTutorialFrames(Math.max(1, Number(settleFrames) || DEFAULT_SETTLE_FRAMES));

  return (
    (await measureTutorialTarget(targetRef, rootRef, {
      ...resolvedMeasureOptions,
      settleFrames: 0,
    })) || firstRect
  );
}

/**
 * TutorialOverlay
 *
 * - 画面の最後の child として重ねて使う共通コンポーネント
 * - info モード: 対象UIは押せず、下部カードの「次へ」で進む
 * - action モード: 対象UIだけ押せる（穴あきスポットライト）
 * - onTargetPress が渡された action モードでは、穴の上に透明な proxy Pressable を置きます
 */
export default function TutorialOverlay({
  visible,
  targetRect,
  title,
  message,
  step,
  totalSteps,
  showStepPill = true,
  mode = "info", // "info" | "action"
  nextLabel = DEFAULT_NEXT_LABEL,
  onNext,
  onTargetPress,
  onMetricsChange,
  primaryDisabled = false,
  showPrimaryButton,
  actionHint = DEFAULT_ACTION_HINT,
  footerText,
  targetPadding = DEFAULT_TARGET_PADDING,
  targetRadius = DEFAULT_TARGET_RADIUS,
  targetTouchPadding = DEFAULT_TARGET_TOUCH_PADDING,
  targetHitSlop = DEFAULT_TARGET_HIT_SLOP,
  dimOpacity = DEFAULT_DIM_OPACITY,
  cardSideMargin: requestedCardSideMargin = DEFAULT_CARD_SIDE_MARGIN,
  cardBottomMargin = DEFAULT_CARD_BOTTOM_MARGIN,
  cardPlacement = "bottom", // "bottom" | "top" | "auto"
  blockBackgroundTouches = true,
  testID,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const overlayRootRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(DEFAULT_CARD_FALLBACK_HEIGHT);
  const [overlayLayout, setOverlayLayout] = useState({ width: 0, height: 0 });
  const [overlayWindowRect, setOverlayWindowRect] = useState(null);
  const handleBlockedPress = useCallback(() => {}, []);

  const screenWidth = Math.max(1, overlayLayout.width || windowWidth);
  const screenHeight = Math.max(1, overlayLayout.height || windowHeight);
  const localInsets = useMemo(
    () => resolveOverlaySafeInsets({ safeInsets: insets, overlayWindowRect, windowWidth, windowHeight }),
    [insets, overlayWindowRect, windowWidth, windowHeight]
  );
  const cardSideMargin = Math.max(
    Number.isFinite(Number(requestedCardSideMargin))
      ? Math.max(0, Number(requestedCardSideMargin)) : DEFAULT_CARD_SIDE_MARGIN,
    16 + localInsets.left,
    16 + localInsets.right,
    (screenWidth - 640) / 2
  );

  const targetX = targetRect?.x ?? targetRect?.left;
  const targetY = targetRect?.y ?? targetRect?.top;
  const targetWidth = targetRect?.width;
  const targetHeight = targetRect?.height;
  const hasTargetRect = !!targetRect;
  const holeRect = useMemo(
    () => normalizeTargetRect(
      hasTargetRect ? { x: targetX, y: targetY, width: targetWidth, height: targetHeight } : null,
      screenWidth,
      screenHeight,
      Math.max(0, Number(targetPadding) || 0)
    ),
    [hasTargetRect, targetX, targetY, targetWidth, targetHeight, screenWidth, screenHeight, targetPadding]
  );

  const effectiveShowPrimaryButton =
    typeof showPrimaryButton === "boolean"
      ? showPrimaryButton
      : mode !== "action";

  const rawDimOpacity = Number(dimOpacity);
  const resolvedDimOpacity = Number.isFinite(rawDimOpacity)
    ? rawDimOpacity
    : DEFAULT_DIM_OPACITY;
  const overlayOpacity = Math.min(0.9, Math.max(0, resolvedDimOpacity));
  const overlayColor =
    overlayOpacity <= 0
      ? "rgba(0, 0, 0, 0)"
      : `rgba(0, 0, 0, ${overlayOpacity})`;

  const highlightBorderColor = colors.TITLE_GOLD;
  const cardBackgroundColor = colors.FIELD_BG;
  const cardBorderColor = colors.CARD_BORDER;
  const titleColor = colors.TEXT_ON_LIGHT;
  const bodyColor = colors.TEXT_ON_LIGHT;
  const subtleColor = colors.TEXT_SUBTLE;
  const buttonBackgroundColor = colors.GOLD_BUTTON;
  const buttonTextColor = colors.ACCENT_TEXT;
  const stepPillBackground = colors.SURFACE_TONAL;

  const { topBase: cardTopBase, bottomOffset: cardBottom } = useMemo(
    () =>
      getCardAnchors({
        safeTop: localInsets.top,
        safeBottom: localInsets.bottom,
        cardBottomMargin,
      }),
    [localInsets.top, localInsets.bottom, cardBottomMargin]
  );

  const { fullHeight: fullAvailableHeight, topHeight: topAvailableHeight, bottomHeight: bottomAvailableHeight } = useMemo(
    () =>
      getCardAvailableHeights({
        holeRect,
        screenHeight,
        cardTopBase,
        cardBottom,
      }),
    [holeRect, screenHeight, cardTopBase, cardBottom]
  );

  const softCardHeightCap = useMemo(() => getCardHeightCap(screenHeight), [screenHeight]);
  const minimumVisibleCardHeight = effectiveShowPrimaryButton ? 116 : 72;

  const resolvedCardPlacement = useMemo(
    () =>
      resolveCardPlacement({
        preferredPlacement: cardPlacement,
        holeRect,
        availableTopHeight: topAvailableHeight,
        availableBottomHeight: bottomAvailableHeight,
        estimatedCardHeight: softCardHeightCap,
        minUsableHeight: minimumVisibleCardHeight,
      }),
    [
      cardPlacement,
      holeRect,
      topAvailableHeight,
      bottomAvailableHeight,
      softCardHeightCap,
      minimumVisibleCardHeight,
    ]
  );

  const resolvedAvailableHeight =
    resolvedCardPlacement === "top" ? topAvailableHeight : bottomAvailableHeight;
  // Information steps can describe a section taller than the viewport. In
  // that case the readable card takes priority over keeping the whole hole free.
  const needsInfoCardSpace =
    mode !== "action" && !!holeRect &&
    Math.max(topAvailableHeight, bottomAvailableHeight) < minimumVisibleCardHeight;
  const resolvedCardMaxHeight = Math.max(
    1,
    Math.min(
      softCardHeightCap,
      holeRect && !needsInfoCardSpace ? resolvedAvailableHeight : fullAvailableHeight
    )
  );
  const measuredCardHeight = Math.min(cardHeight, resolvedCardMaxHeight);
  const resolvedCardTop =
    resolvedCardPlacement === "top"
      ? cardTopBase
      : Math.max(cardTopBase, screenHeight - cardBottom - measuredCardHeight);
  const resolvedCardRect = useMemo(
    () => ({
      x: cardSideMargin,
      y: resolvedCardTop,
      width: Math.max(0, screenWidth - cardSideMargin * 2),
      height: measuredCardHeight,
      right: Math.max(cardSideMargin, screenWidth - cardSideMargin),
      bottom: resolvedCardTop + measuredCardHeight,
    }),
    [cardSideMargin, resolvedCardTop, screenWidth, measuredCardHeight]
  );

  const cardPositionStyle =
    resolvedCardPlacement === "top"
      ? { top: cardTopBase }
      : { bottom: cardBottom };

  const shouldUseProxyTarget =
    visible && mode === "action" && typeof onTargetPress === "function" && !!holeRect;

  const proxyTargetRect = useMemo(() => {
    if (!holeRect) return null;

    const expandBy = Math.max(0, Number(targetTouchPadding) || 0);
    const left = clamp(holeRect.x - expandBy, 0, screenWidth);
    const top = clamp(holeRect.y - expandBy, 0, screenHeight);
    const right = clamp(holeRect.right + expandBy, 0, screenWidth);
    const bottom = clamp(holeRect.bottom + expandBy, 0, screenHeight);

    return {
      left,
      top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }, [holeRect, screenWidth, screenHeight, targetTouchPadding]);

  const syncOverlayWindowRect = useCallback(async () => {
    if (!visible) {
      setOverlayWindowRect(null);
      return;
    }

    const nextRect = await measureNodeRectInWindow(overlayRootRef, {
      maxAttempts: 2,
      settleFrames: 0,
      tolerance: DEFAULT_MEASURE_TOLERANCE,
    });

    setOverlayWindowRect((prev) => {
      if (!nextRect) return prev ?? null;
      return rectsAlmostEqual(prev, nextRect, DEFAULT_MEASURE_TOLERANCE) ? prev : nextRect;
    });
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) {
      setOverlayWindowRect(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      await waitForTutorialFrames(1);
      if (cancelled) return;

      const nextRect = await measureNodeRectInWindow(overlayRootRef, {
        maxAttempts: 2,
        settleFrames: 0,
        tolerance: DEFAULT_MEASURE_TOLERANCE,
      });

      if (cancelled) return;

      setOverlayWindowRect((prev) => {
        if (!nextRect) return prev ?? null;
        return rectsAlmostEqual(prev, nextRect, DEFAULT_MEASURE_TOLERANCE)
          ? prev
          : nextRect;
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    visible,
    screenWidth,
    screenHeight,
    insets.top,
    insets.right,
    insets.bottom,
    insets.left,
  ]);

  useEffect(() => {
    if (typeof onMetricsChange !== "function") return;

    onMetricsChange(
      visible
        ? {
            overlayWidth: screenWidth,
            overlayHeight: screenHeight,
            overlayWindowRect,
            cardHeight: measuredCardHeight,
            cardRect: resolvedCardRect,
            cardPlacement: resolvedCardPlacement,
            holeRect,
            safeInsets: {
              top: localInsets.top,
              right: localInsets.right,
              bottom: localInsets.bottom,
              left: localInsets.left,
            },
          }
        : null
    );
  }, [
    visible,
    onMetricsChange,
    screenWidth,
    screenHeight,
    measuredCardHeight,
    resolvedCardRect,
    resolvedCardPlacement,
    holeRect,
    localInsets.top,
    localInsets.right,
    localInsets.bottom,
    localInsets.left,
  ]);

  if (!visible) return null;

  return (
    <View
      ref={overlayRootRef}
      collapsable={false}
      pointerEvents="box-none"
      testID={testID}
      style={styles.overlayRoot}
      onLayout={(e) => {
        const nextWidth = Number(e?.nativeEvent?.layout?.width) || 0;
        const nextHeight = Number(e?.nativeEvent?.layout?.height) || 0;

        if (
          nextWidth > 0 &&
          nextHeight > 0 &&
          (overlayLayout.width !== nextWidth || overlayLayout.height !== nextHeight)
        ) {
          setOverlayLayout({ width: nextWidth, height: nextHeight });
        }

        syncOverlayWindowRect();
      }}
    >
      {holeRect ? (
        <>
          <Pressable
            onPress={handleBlockedPress}
            style={[
              styles.scrim,
              {
                left: 0,
                top: 0,
                right: 0,
                height: holeRect.y,
                backgroundColor: overlayColor,
              },
            ]}
          />

          <Pressable
            onPress={handleBlockedPress}
            style={[
              styles.scrim,
              {
                left: 0,
                top: holeRect.y,
                width: holeRect.x,
                height: holeRect.height,
                backgroundColor: overlayColor,
              },
            ]}
          />

          <Pressable
            onPress={handleBlockedPress}
            style={[
              styles.scrim,
              {
                left: holeRect.right,
                top: holeRect.y,
                right: 0,
                height: holeRect.height,
                backgroundColor: overlayColor,
              },
            ]}
          />

          <Pressable
            onPress={handleBlockedPress}
            style={[
              styles.scrim,
              {
                left: 0,
                top: holeRect.bottom,
                right: 0,
                bottom: 0,
                backgroundColor: overlayColor,
              },
            ]}
          />

          {mode !== "action" ? (
            <Pressable
              onPress={handleBlockedPress}
              style={[
                styles.holeBlocker,
                {
                  left: holeRect.x,
                  top: holeRect.y,
                  width: holeRect.width,
                  height: holeRect.height,
                  borderRadius: Math.max(0, Number(targetRadius) || DEFAULT_TARGET_RADIUS),
                },
              ]}
            />
          ) : null}

          {shouldUseProxyTarget && proxyTargetRect ? (
            <Pressable
              onPress={onTargetPress}
              hitSlop={Math.max(0, Number(targetHitSlop) || DEFAULT_TARGET_HIT_SLOP)}
              style={[
                styles.proxyTarget,
                {
                  left: proxyTargetRect.left,
                  top: proxyTargetRect.top,
                  width: proxyTargetRect.width,
                  height: proxyTargetRect.height,
                  borderRadius:
                    Math.max(0, Number(targetRadius) || DEFAULT_TARGET_RADIUS) +
                    Math.max(0, Number(targetTouchPadding) || 0),
                },
              ]}
            />
          ) : null}

          <View
            pointerEvents="none"
            style={[
              styles.highlight,
              {
                left: holeRect.x,
                top: holeRect.y,
                width: holeRect.width,
                height: holeRect.height,
                borderRadius: Math.max(0, Number(targetRadius) || DEFAULT_TARGET_RADIUS),
                borderColor: highlightBorderColor,
                shadowColor: highlightBorderColor,
              },
            ]}
          />
        </>
      ) : blockBackgroundTouches ? (
        <Pressable
          onPress={handleBlockedPress}
          style={[styles.fullScrim, { backgroundColor: overlayColor }]}
        />
      ) : (
        <View
          pointerEvents="none"
          style={[styles.fullScrim, { backgroundColor: overlayColor }]}
        />
      )}

      <View
        style={[
          styles.card,
          {
            left: cardSideMargin,
            right: cardSideMargin,
            maxHeight: resolvedCardMaxHeight,
            backgroundColor: cardBackgroundColor,
            borderColor: cardBorderColor,
          },
          cardPositionStyle,
        ]}
        onLayout={(e) => {
          const h = e?.nativeEvent?.layout?.height ?? 0;
          if (h > 0 && h !== cardHeight) {
            setCardHeight(h);
          }
        }}
      >
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={styles.cardScrollContent}
          bounces={false}
          alwaysBounceVertical={false}
          nestedScrollEnabled
          showsVerticalScrollIndicator={cardHeight >= resolvedCardMaxHeight - 1}
        >
          {showStepPill && typeof step === "number" && typeof totalSteps === "number" ? (
            <View
              style={[
                styles.stepPill,
                {
                  backgroundColor: stepPillBackground,
                  borderColor: cardBorderColor,
                },
              ]}
            >
              <Text style={[styles.stepText, { color: colors.ON_SURFACE_TONAL }]}>Step {step} / {totalSteps}</Text>
            </View>
          ) : null}

          {title ? <Text style={[styles.title, { color: titleColor }]}>{title}</Text> : null}

          {message ? (
            <Text style={[styles.message, { color: bodyColor }]}>{message}</Text>
          ) : null}

          {mode === "action" && actionHint !== null ? (
            <View
              style={[
                styles.actionHintWrap,
                {
                  backgroundColor: stepPillBackground,
                  borderColor: cardBorderColor,
                },
              ]}
            >
              <Text style={[styles.actionHintText, { color: colors.ON_SURFACE_TONAL }]}>
                {actionHint || DEFAULT_ACTION_HINT}
              </Text>
            </View>
          ) : null}

          {footerText ? (
            <Text style={[styles.footerText, { color: subtleColor }]}>{footerText}</Text>
          ) : null}

        {effectiveShowPrimaryButton ? (
          <Pressable
            onPress={onNext}
            accessibilityRole="button"
            accessibilityState={{ disabled: !onNext || primaryDisabled }}
            disabled={!onNext || primaryDisabled}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: !onNext || primaryDisabled ? colors.FIELD_BG : buttonBackgroundColor,
                borderColor: !onNext || primaryDisabled ? colors.CARD_BORDER : highlightBorderColor,
                opacity: pressed && onNext && !primaryDisabled ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: !onNext || primaryDisabled ? colors.TEXT_SUBTLE : buttonTextColor }]}>
              {nextLabel || DEFAULT_NEXT_LABEL}
            </Text>
          </Pressable>
        ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

function createStyles(colors, ui) {
return StyleSheet.create(applyTypographyTokens({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  fullScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    position: "absolute",
  },
  holeBlocker: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  proxyTarget: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  highlight: {
    position: "absolute",
    borderWidth: 2,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
      position: "absolute",
      borderRadius: 24,
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingVertical: 20,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
  cardScroll: {
      flexGrow: 0,
      flexShrink: 1,
      minHeight: 0,
    },
  cardScrollContent: {
      paddingBottom: 0,
    },
  stepPill: {
      alignSelf: "flex-start",
      borderRadius: 999,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginBottom: 12,
      maxWidth: '100%',
    },
  stepText: {
      letterSpacing: 0,
      flexShrink: 1,
    },
  title: {
      minWidth: 0,
    },
  message: {
      marginTop: 8,
    },
  actionHintWrap: {
      marginTop: 12,
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
  actionHintText: {
    },
  footerText: {
      marginTop: 8,
    },
  primaryButton: {
      marginTop: 12,
      minHeight: 52,
      borderRadius: 24,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
  primaryButtonText: {
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },
}, ui, {"stepText":"meta","title":"modalTitle","message":"body","actionHintText":"description","footerText":"description","primaryButtonText":"button"}));
}
