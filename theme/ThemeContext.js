import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Cocolon / Emlis 用テーマコンテキスト
 *
 * Theme variants:
 * - default       : いままでの Mash バーガンディテーマ（"Default"）
 * - light  (白系) : White & Gold / ホワイト＆ゴールド
 * - dark   (黒系) : Black & Navy / ブラック＆ネイビー
 */

export const THEME_VARIANTS = {
  DEFAULT: "default",
  LIGHT: "light", // White & Gold
  DARK: "dark",   // Black & Navy
};

const PALETTES = {
  [THEME_VARIANTS.DEFAULT]: {
    // いま使っているデフォルト（バーガンディ）テーマ
    BG_SILVER: "#F6F1E8",
    PANEL_BG: "#F9F9F9",
    FIELD_BG: "#FFFFFF",
    BORDER_GOLD: "#800020",
    GOLD_BUTTON: "#5A1020",
    GOLD_BUTTON_BORDER: "#430814",
    TITLE_GOLD: "#800020",
    BRAND_GOLD: "#800020",
    TEXT_ON_LIGHT: "#111827",
    TEXT_ON_DARK: "#F2F2F2",
    TEXT_SUBTLE: "#BFC3C7",
    CARD_BORDER: "#D7D2C9",
    // アクセント（ボタン・チップ）上の文字色
    ACCENT_TEXT: "#FFFFFF",
  },

  [THEME_VARIANTS.LIGHT]: {
    // White & Gold / ホワイト＆ゴールド テーマ
    // 背景：ホワイト
    BG_SILVER: "#FFFFFF",
    PANEL_BG: "#FFFFFF",
    FIELD_BG: "#FFFFFF",

    // 各画面内容の枠：ゴールド
    BORDER_GOLD: "#D4AF37", // ゴールド

    // ボタン系：暗いゴールド
    GOLD_BUTTON: "#B8860B", // Dark Goldenrod 系
    GOLD_BUTTON_BORDER: "#8B6914",

    // ロゴ文字＆タイトル文字：ゴールド
    TITLE_GOLD: "#D4AF37",
    BRAND_GOLD: "#D4AF37",

    TEXT_ON_LIGHT: "#111827",
    TEXT_ON_DARK: "#F9FAFB",
    TEXT_SUBTLE: "#6B7280",
    CARD_BORDER: "#E5E7EB",

    // アクセント（ボタン・チップ）上の文字色
    ACCENT_TEXT: "#FFFFFF",
  },

  [THEME_VARIANTS.DARK]: {
    // Black & Navy / ブラック＆ネイビー テーマ
    // 背景：ブラック
    BG_SILVER: "#000000",
    PANEL_BG: "#000000",
    FIELD_BG: "#000000",

    // 各画面内容の枠：ネイビー
    BORDER_GOLD: "#1E3A8A", // ネイビー

    // ボタン系：暗いネイビー
    GOLD_BUTTON: "#0B1120",
    GOLD_BUTTON_BORDER: "#1E3A8A",

    // ロゴ文字＆タイトル文字：ネイビー
    TITLE_GOLD: "#1E3A8A",
    BRAND_GOLD: "#1E3A8A",

    TEXT_ON_LIGHT: "#F9FAFB",
    TEXT_ON_DARK: "#111827",
    TEXT_SUBTLE: "#9CA3AF",
    CARD_BORDER: "#1F2937",

    // アクセント（ボタン・チップ）上の文字色（＝白）
    ACCENT_TEXT: "#FFFFFF",
  },
};

const THEME_STORAGE_KEY = "cocolon.themeName";

const ThemeContext = createContext({
  themeName: THEME_VARIANTS.DEFAULT,
  setThemeName: (_name) => {},
  colors: PALETTES[THEME_VARIANTS.DEFAULT],
});

export function ThemeProvider({ children }) {
  const [themeName, setThemeNameState] = useState(THEME_VARIANTS.DEFAULT);

  // 起動時に保存済みテーマを復元（なければ default）
  useEffect(() => {
    let cancelled = false;

    const loadSavedTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (cancelled) return;

        // 保存値が不正な場合は無視して default のまま
        if (saved && PALETTES[saved]) {
          setThemeNameState(saved);
        }
      } catch (e) {
        console.warn("ThemeProvider: load theme failed", e);
      }
    };

    loadSavedTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  // テーマ更新時に永続化（SettingsScreen から setThemeName が呼ばれる想定）
  const setThemeName = useCallback((next) => {
    setThemeNameState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      const normalized = PALETTES[resolved] ? resolved : THEME_VARIANTS.DEFAULT;

      if (normalized !== prev) {
        AsyncStorage.setItem(THEME_STORAGE_KEY, normalized).catch(() => {
          // noop
        });
      }
      return normalized;
    });
  }, []);

  const value = useMemo(() => {
    const colors = PALETTES[themeName] || PALETTES[THEME_VARIANTS.DEFAULT];
    return { themeName, setThemeName, colors };
  }, [themeName, setThemeName]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// UI 表示用ラベル（日本語）
export const THEME_LABELS_JA = {
  [THEME_VARIANTS.DEFAULT]: "デフォルト",
  [THEME_VARIANTS.LIGHT]: "ホワイト＆ゴールド",
  [THEME_VARIANTS.DARK]: "ブラック＆ネイビー",
};

// UI 表示用ラベル（英語 / 将来の英語版UI向け）
export const THEME_LABELS_EN = {
  [THEME_VARIANTS.DEFAULT]: "Default",
  [THEME_VARIANTS.LIGHT]: "White & Gold",
  [THEME_VARIANTS.DARK]: "Black & Navy",
};

// 必要ならパレット自体を参照できるようにエクスポート
export const THEME_PALETTES = PALETTES;