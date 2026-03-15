import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

const DEFAULT_DIM_OPACITY = 0.62;
const DEFAULT_TARGET_PADDING = 8;
const DEFAULT_TARGET_RADIUS = 16;
const DEFAULT_CARD_SIDE_MARGIN = 16;
const DEFAULT_CARD_BOTTOM_MARGIN = 16;
const DEFAULT_CARD_FALLBACK_HEIGHT = 188;
const DEFAULT_ACTION_HINT = "スポットライトの場所を押してください";
const DEFAULT_NEXT_LABEL = "次へ";

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function normalizeTargetRect(rect, screenWidth, screenHeight, padding) {
  if (!rect) return null;
  const rawX = Number(rect.x ?? rect.left ?? 0);
  const rawY = Number(rect.y ?? rect.top ?? 0);
  const rawWidth = Number(rect.width ?? 0);
  const rawHeight = Number(rect.height ?? 0);

  if (
    !isFiniteNumber(rawX) ||
    !isFiniteNumber(rawY) ||
    !isFiniteNumber(rawWidth) ||
    !isFiniteNumber(rawHeight) ||
    rawWidth <= 0 ||
    rawHeight <= 0
  ) {
    return null;
  }

  const x = Math.max(0, rawX - padding);
  const y = Math.max(0, rawY - padding);
  const right = Math.min(screenWidth, rawX + rawWidth + padding);
  const bottom = Math.min(screenHeight, rawY + rawHeight + padding);

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

/**
 * targetRef をチュートリアル用に測定する helper。
 *
 * 使い方の基本:
 * - 画面rootに ref を付ける
 * - スポットライト対象にも ref を付ける
 * - measureTutorialTarget(targetRef, rootRef)
 *
 * rootRef が渡された場合は root 基準のローカル座標で返します。
 * rootRef が無い場合は window 座標を返します。
 */
export function measureTutorialTarget(targetRef, rootRef) {
  return new Promise((resolve) => {
    const targetNode = targetRef?.current ?? targetRef ?? null;
    const rootNode = rootRef?.current ?? rootRef ?? null;

    if (!targetNode) {
      resolve(null);
      return;
    }

    const finish = (x, y, width, height) => {
      if (
        !isFiniteNumber(x) ||
        !isFiniteNumber(y) ||
        !isFiniteNumber(width) ||
        !isFiniteNumber(height)
      ) {
        resolve(null);
        return;
      }

      resolve({
        x: Number(x),
        y: Number(y),
        width: Number(width),
        height: Number(height),
        right: Number(x) + Number(width),
        bottom: Number(y) + Number(height),
      });
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
      } catch {
        // noop
      }

      fail();
    });
  });
}

/**
 * TutorialOverlay
 *
 * - 画面の最後の child として重ねて使う共通コンポーネント
 * - info モード: 対象UIは押せず、下部カードの「次へ」で進む
 * - action モード: 対象UIだけ押せる（穴あきスポットライト）
 *
 * 注意:
 * - Modal は使っていません
 * - 透過した穴を通して underlying UI を押せるようにするため、
 *   各 screen 内に absolute overlay として配置してください
 */
export default function TutorialOverlay({
  visible,
  targetRect,
  title,
  message,
  step,
  totalSteps,
  mode = "info", // "info" | "action"
  nextLabel = DEFAULT_NEXT_LABEL,
  onNext,
  primaryDisabled = false,
  showPrimaryButton,
  actionHint = DEFAULT_ACTION_HINT,
  footerText,
  targetPadding = DEFAULT_TARGET_PADDING,
  targetRadius = DEFAULT_TARGET_RADIUS,
  dimOpacity = DEFAULT_DIM_OPACITY,
  cardSideMargin = DEFAULT_CARD_SIDE_MARGIN,
  cardBottomMargin = DEFAULT_CARD_BOTTOM_MARGIN,
  cardPlacement = "bottom", // "bottom" | "top" | "auto"
  testID,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [cardHeight, setCardHeight] = useState(DEFAULT_CARD_FALLBACK_HEIGHT);

  const holeRect = useMemo(
    () =>
      normalizeTargetRect(
        targetRect,
        screenWidth,
        screenHeight,
        Math.max(0, Number(targetPadding) || 0)
      ),
    [targetRect, screenWidth, screenHeight, targetPadding]
  );

  const effectiveShowPrimaryButton =
    typeof showPrimaryButton === "boolean"
      ? showPrimaryButton
      : mode !== "action";

  const overlayColor = `rgba(0, 0, 0, ${Math.min(
    0.9,
    Math.max(0.1, Number(dimOpacity) || DEFAULT_DIM_OPACITY)
  )})`;

  const highlightBorderColor =
    colors?.GOLD_BUTTON_BORDER || colors?.TITLE_GOLD || "#D4AF37";
  const cardBackgroundColor = colors?.FIELD_BG || colors?.PANEL_BG || "#FFFFFF";
  const cardBorderColor = colors?.CARD_BORDER || "rgba(255,255,255,0.14)";
  const titleColor = colors?.TITLE_GOLD || colors?.TEXT_ON_LIGHT || "#111827";
  const bodyColor = colors?.TEXT_ON_LIGHT || "#111827";
  const subtleColor = colors?.TEXT_SUBTLE || colors?.TEXT_ON_LIGHT || "#6B7280";
  const buttonBackgroundColor = colors?.GOLD_BUTTON || colors?.TITLE_GOLD || "#A16207";
  const buttonTextColor = colors?.ACCENT_TEXT || "#FFFFFF";
  const stepPillBackground = colors?.PANEL_BG || "rgba(255,255,255,0.08)";

  const cardBottom = Math.max(insets.bottom, cardBottomMargin) + 8;
  const cardTopBase = Math.max(insets.top, 12) + 12;

  const shouldMoveCardToTop = useMemo(() => {
    if (!holeRect) return cardPlacement === "top";
    if (cardPlacement === "top") return true;
    if (cardPlacement === "bottom") {
      const cardTopIfBottom = screenHeight - cardBottom - cardHeight;
      return holeRect.bottom > cardTopIfBottom - 12;
    }
    // auto
    const cardTopIfBottom = screenHeight - cardBottom - cardHeight;
    return holeRect.bottom > cardTopIfBottom - 12;
  }, [holeRect, cardPlacement, screenHeight, cardBottom, cardHeight]);

  const cardPositionStyle = shouldMoveCardToTop
    ? { top: cardTopBase }
    : { bottom: cardBottom };

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      testID={testID}
      style={styles.overlayRoot}
    >
      {holeRect ? (
        <>
          <Pressable
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
      ) : (
        <Pressable
          style={[styles.fullScrim, { backgroundColor: overlayColor }]}
        />
      )}

      <View
        style={[
          styles.card,
          {
            left: cardSideMargin,
            right: cardSideMargin,
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
        {typeof step === "number" && typeof totalSteps === "number" ? (
          <View
            style={[
              styles.stepPill,
              {
                backgroundColor: stepPillBackground,
                borderColor: cardBorderColor,
              },
            ]}
          >
            <Text style={[styles.stepText, { color: subtleColor }]}>
              Step {step} / {totalSteps}
            </Text>
          </View>
        ) : null}

        {title ? (
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        ) : null}

        {message ? (
          <Text style={[styles.message, { color: bodyColor }]}>{message}</Text>
        ) : null}

        {mode === "action" ? (
          <View
            style={[
              styles.actionHintWrap,
              {
                backgroundColor: stepPillBackground,
                borderColor: cardBorderColor,
              },
            ]}
          >
            <Text style={[styles.actionHintText, { color: subtleColor }]}>
              {actionHint || DEFAULT_ACTION_HINT}
            </Text>
          </View>
        ) : null}

        {footerText ? (
          <Text style={[styles.footerText, { color: subtleColor }]}>
            {footerText}
          </Text>
        ) : null}

        {effectiveShowPrimaryButton ? (
          <Pressable
            onPress={onNext}
            disabled={!onNext || primaryDisabled}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: buttonBackgroundColor,
                borderColor: highlightBorderColor,
                opacity: !onNext || primaryDisabled ? 0.5 : pressed ? 0.88 : 1,
              },
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: buttonTextColor }]}>
              {nextLabel || DEFAULT_NEXT_LABEL}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  highlight: {
    position: "absolute",
    borderWidth: 2,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
    position: "absolute",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  stepPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 22,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  actionHintWrap: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionHintText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  footerText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});
