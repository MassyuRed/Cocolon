// uiTokens.js
// Cocolon UI tokens (Design System) - JS版

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
    },

    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      pill: 999,
    },

    font: {
      // InputScreen 基準
      sectionLabel: 12,
      body: 14,
      description: 9,
      button: 15,
      title: 20,
    },

    text: {
      primary: colors.TEXT_ON_LIGHT,
      sectionLabel: colors.TEXT_ON_LIGHT,
      // 「説明文系」はダークグレー。ただし dark テーマでは可読性優先で TEXT_SUBTLE を使う
      description: isDark ? colors.TEXT_SUBTLE : DARK_GRAY_DESC,
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
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
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
