// uiTokens.js
// Cocolon UI tokens (Design System) - JS版

// Match the orientations enabled by the iOS app; Android keeps its manifest setting.
export const MODAL_ORIENTATIONS = Object.freeze([
  "portrait", "landscape-left", "landscape-right",
]);

export const MAX_BUTTON_WIDTH = 520;
export const DARK_GRAY_DESC = "#4B5563";

export function makeUiTokens(colors, themeName) {
  const isDark = String(themeName || "").toLowerCase() === "dark";

  return {
    layout: {
      maxButtonWidth: MAX_BUTTON_WIDTH,
    },

    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },

    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      card: 24,
      button: 24,
      pill: 999,
    },

    font: {
      // InputScreen 基準
      sectionLabel: 14,
      body: 16,
      description: 12,
      button: 15,
      title: 22,
    },

    // 操作・長文・ブランドを混ぜず、必要な表示へ明示適用する。
    typography: {
      screenTitle: { fontSize: 26, lineHeight: 34, fontWeight: "600" },
      sectionTitle: { fontSize: 18, lineHeight: 26, fontWeight: "600" },
      modalTitle: { fontSize: 22, lineHeight: 30, fontWeight: "600" },
      body: { fontSize: 16, lineHeight: 27, fontWeight: "400" },
      input: { fontSize: 16, lineHeight: 27, fontWeight: "400" },
      description: { fontSize: 14, lineHeight: 22, fontWeight: "400" },
      meta: { fontSize: 12, lineHeight: 18, fontWeight: "400" },
      button: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
    },

    text: {
      primary: colors.TEXT_ON_LIGHT,
      sectionLabel: colors.TEXT_ON_LIGHT,
      // 「説明文系」はダークグレー。ただし dark テーマでは可読性優先で TEXT_SUBTLE を使う
      description: colors.TEXT_SUBTLE || (isDark ? colors.TEXT_SUBTLE : DARK_GRAY_DESC),
      subtle: colors.TEXT_SUBTLE,
      accentOnButton: colors.ACCENT_TEXT,
    },

    motion: {
      pressScale: 0.97,
      pressDurationMs: 100,
    },

    // 「ほんの少し浮く（上品）」 shadow/elevation
    shadow: {
      float: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      },
      pressed: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      },
      disabled: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
      },
    },
  };
}

