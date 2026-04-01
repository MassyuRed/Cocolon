import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  Linking,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { useTheme } from "../theme/ThemeContext";
import { apiFetch, apiGet } from "../lib/apiClient";

// MyProfile（現在の自己構造）: latest viewer
const API_BASE =
  process.env.EXPO_PUBLIC_MYMODEL_API_URL || "https://mashos-api.onrender.com";
const MYPROFILE_LATEST_ENDPOINT = `${API_BASE}/myprofile/latest`;

// Subscription (plan/tier)
const SUBSCRIPTION_ME_ENDPOINT = `${API_BASE}/subscription/me`;

// ---- MyProfile: 3 modes (Light/Standard/Deep) ----
const TIER_PERMISSION_MAP = Object.freeze({
  free: [],
  plus: ["standard"],
  premium: ["standard", "deep"],
});
const MODE_LABEL = Object.freeze({ standard: "Standard", deep: "Deep" });

function normalizeSubscriptionTier(tier) {
  const t = String(tier || "").toLowerCase().trim();
  if (t === "free") return "free";
  if (t === "plus") return "plus";
  if (t === "premium") return "premium";
  if (t === "pro") return "premium";
  if (t === "paid") return "plus";
  return "free";
}

function normalizeMyProfileMode(mode) {
  const m = String(mode || "").toLowerCase().trim();
  if (m === "light" || m === "standard" || m === "deep") return m;
  return "standard";
}

function subscriptionTierLabel(tier) {
  const t = normalizeSubscriptionTier(tier);
  if (t === "premium") return "Premium会員";
  if (t === "plus") return "Plus会員";
  return "無料会員";
}


function coerceAllowedModes(maybeAllowedModes, tier) {
  if (Array.isArray(maybeAllowedModes) && maybeAllowedModes.length > 0) {
    const cleaned = maybeAllowedModes
      .map((x) => normalizeMyProfileMode(x))
      .filter((x) => x === "standard" || x === "deep");
    const uniq = [];
    cleaned.forEach((m) => {
      if (!uniq.includes(m)) uniq.push(m);
    });
    return uniq.length > 0 ? uniq : TIER_PERMISSION_MAP[normalizeSubscriptionTier(tier)] || ["standard"];
  }
  return TIER_PERMISSION_MAP[normalizeSubscriptionTier(tier)] || ["standard"];
}

function defaultModeForTier(tier, allowedModes) {
  const allowed = Array.isArray(allowedModes) && allowedModes.length > 0 ? allowedModes : ["standard"];
  if (allowed.includes("standard")) return "standard";
  return allowed[0] || "standard";
}

async function fetchSubscriptionMe(accessToken, signal) {
  if (!accessToken) {
    return { tier: "free", allowedModes: TIER_PERMISSION_MAP.free, raw: null };
  }

  const res = await apiFetch(SUBSCRIPTION_ME_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  const tier = normalizeSubscriptionTier(json?.subscription_tier || json?.tier || json?.plan);
  const allowedModes = coerceAllowedModes(
    json?.allowed_myprofile_modes || json?.allowed_modes || json?.allowed_report_modes,
    tier
  );

  return { tier, allowedModes, raw: json };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function exportTextToPdf(title, text) {
  const safeTitle = String(title || "report");
  const safeText = String(text || "");

  const RNHTMLtoPDF = NativeModules?.RNHTMLtoPDF;

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif; padding: 18px; }
        h1 { font-size: 18px; margin: 0 0 12px 0; }
        pre { white-space: pre-wrap; font-size: 12px; line-height: 1.5; }
        .meta { font-size: 10px; color: #666; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(safeTitle)}</h1>
      <div class="meta">Exported from Cocolon / MyProfile</div>
      <pre>${escapeHtml(safeText)}</pre>
    </body>
  </html>`;

  if (RNHTMLtoPDF && typeof RNHTMLtoPDF.convert === "function") {
    try {
      const fileName = safeTitle.replace(/[\\\/:*?"<>|]/g, "_").slice(0, 60);

      const res = await RNHTMLtoPDF.convert({
        html,
        fileName: fileName || "report",
        base64: false,
      });

      const filePath = res?.filePath || res?.file || res?.path;
      if (!filePath) {
        Alert.alert("PDF保存", "PDFは生成しましたが保存先の取得に失敗しました。");
        return;
      }

      const uri = String(filePath).startsWith("file://")
        ? String(filePath)
        : `file://${filePath}`;

      try {
        const can = await Linking.canOpenURL(uri);
        if (can) {
          await Linking.openURL(uri);
        } else {
          Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
        }
      } catch {
        Alert.alert("PDF保存", `PDFを生成しました。\n保存先: ${uri}`);
      }

      return;
    } catch (e) {
      Alert.alert("PDF保存エラー", String(e?.message || e));
      return;
    }
  }

  Alert.alert(
    "PDF保存（セットアップが必要）",
    "この端末環境ではPDF生成モジュールが未導入のため、いったんテキスト共有で保存できます。\n\nPDF保存を有効化したい場合は react-native-html-to-pdf の導入をご検討ください。",
    [
      {
        text: "テキスト共有",
        onPress: async () => {
          try {
            await Share.share({ title: safeTitle, message: safeText });
          } catch (e) {
            Alert.alert("共有エラー", String(e?.message || e));
          }
        },
      },
      { text: "OK" },
    ]
  );
}

function buildErrorMessage(err) {
  if (!err) return "エラーが発生しました。";
  if (err.name === "AbortError")
    return "接続がタイムアウトしました（ネットワークを確認してください）。";
  const msg = String(err.message || err);
  if (/Network/i.test(msg)) return "サーバーへの接続に失敗しました。";
  return `エラー：${msg}`;
}

// NOTE: Phase3 で「閲覧=生成」を廃止し、月次は MashOS 側で生成/保存する。
// そのため、クライアント側のプロンプト組立ロジック（固定文）は不要になった。

async function getAccessToken() {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export default function SelfStructureReportGenerateScreen({ onBack, initialReportMode = "standard", onLatestSeenVersion }) {
  const { themeName, colors } = useTheme();
  const isDark = themeName === "dark";

  // Navigation: open SubscriptionSelect (hidden screen)
  const navigation = useNavigation();

  const openSubscriptionSelect = useCallback(() => {
    try {
      if (navigation && typeof navigation.navigate === "function") {
        navigation.navigate("SubscriptionSelect");
        return;
      }
    } catch {
      // ignore
    }
    Alert.alert(
      "プラン画面を開けません",
      "プラン画面を開けませんでした。もう一度お試しください。"
    );
  }, [navigation]);

  // ★ 画面遷移（履歴へ戻る）をした瞬間に、非同期の setState が走らないようガードする
  const aliveRef = useRef(true);
  const abortRef = useRef(null);

  const markCancelled = useCallback(() => {
    aliveRef.current = false;
    try {
      abortRef.current?.abort?.();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      markCancelled();
    };
  }, [markCancelled]);

  const safeSet = useCallback((fn) => {
    if (!aliveRef.current) return;
    fn();
  }, []);

    // ---- Subscription / report mode (Step7: UI) ----
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [allowedModes, setAllowedModes] = useState(TIER_PERMISSION_MAP.plus);
  const [reportMode, setReportMode] = useState(() => normalizeMyProfileMode(initialReportMode));
  const [tierLoading, setTierLoading] = useState(false);
  const [tierError, setTierError] = useState("");

const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [reportText, setReportText] = useState("");
  const [meta, setMeta] = useState(null);

  const [periodStartISO, setPeriodStartISO] = useState("");
  const [periodEndISO, setPeriodEndISO] = useState("");
  const [titleRange, setTitleRange] = useState("");

  const themed = useMemo(() => {
    if (!isDark) return {};
    return {
      container: { backgroundColor: colors.BG_SILVER },

      headerRow: { backgroundColor: colors.BG_SILVER },
      backIcon: { color: colors.TEXT_ON_LIGHT },
      backText: { color: colors.TEXT_ON_LIGHT },

      smallBtn: {
        borderColor: colors.CARD_BORDER,
        backgroundColor: colors.PANEL_BG,
      },
      smallBtnText: { color: colors.TEXT_ON_LIGHT },

      title: { color: colors.TEXT_ON_LIGHT },

      errorText: { color: "#FCA5A5" },

      bodyCard: {
        borderColor: colors.CARD_BORDER,
        backgroundColor: colors.PANEL_BG,
      },
      p: { color: colors.TEXT_ON_LIGHT },
      empty: { color: colors.TEXT_SUBTLE },
    };
  }, [isDark, colors]);

  const reportTitle = useMemo(() => {
    const base = titleRange
      ? `現在の自己構造：${titleRange}`
      : "現在の自己構造";
    return base;
  }, [titleRange]);

  const handleBack = useCallback(() => {
    // 先に cancel しておく（親の activeView 切替より前に止める）
    markCancelled();
    if (typeof onBack === "function") onBack();
  }, [markCancelled, onBack]);

const run = useCallback(async ({ force = false } = {}) => {
  // 以前のリクエストが残っていたら止める
  try {
    abortRef.current?.abort?.();
  } catch {
    // ignore
  }

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  abortRef.current = controller;

  safeSet(() => {
    setLoading(true);
    setErrorMsg("");
    setReportText("");
    setMeta(null);
  });

  let userId = null;

  try {
    userId = await getCurrentUserId();
    if (!userId) {
      safeSet(() =>
        setErrorMsg("ユーザー情報を取得できませんでした（ログインしてください）")
      );
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      safeSet(() => setErrorMsg("ログイン情報の取得に失敗しました（tokenなし）"));
      return;
    }

    // ---- Subscription (tier) ----
    let tier = subscriptionTier;
    let allowed = allowedModes;

    safeSet(() => {
      setTierLoading(true);
      setTierError("");
    });

    try {
      const sub = await fetchSubscriptionMe(accessToken, controller?.signal);
      tier = sub?.tier || "free";
      allowed =
        Array.isArray(sub?.allowedModes) && sub.allowedModes.length > 0
          ? sub.allowedModes
          : TIER_PERMISSION_MAP[normalizeSubscriptionTier(tier)] || ["standard"];

      safeSet(() => {
        setSubscriptionTier(tier);
        setAllowedModes(allowed);
      });
    } catch (e) {
      tier = "free";
      allowed = TIER_PERMISSION_MAP.free;
      safeSet(() => {
        setSubscriptionTier(tier);
        setAllowedModes(allowed);
        setTierError(String(e?.message || e));
      });
    } finally {
      safeSet(() => setTierLoading(false));
    }

    const desiredMode = normalizeMyProfileMode(reportMode);
    const effectiveMode = allowed.includes(desiredMode)
      ? desiredMode
      : defaultModeForTier(tier, allowed);

    // UIの選択値も「許可されたモード」に寄せる（freeで standard が選ばれてた等）
    if (effectiveMode !== reportMode) {
      safeSet(() => setReportMode(effectiveMode));
    }

    const qs = new URLSearchParams({
      ensure: "true",
      force: force ? "true" : "false",
      report_mode: effectiveMode,
    });

    const fetchOpts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (controller) fetchOpts.signal = controller.signal;

    const res = await apiFetch(`${MYPROFILE_LATEST_ENDPOINT}?${qs.toString()}`, fetchOpts);

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j && j.detail) detail = j.detail;
      } catch {}
      const error = new Error(detail);
      error.httpStatus = res.status;
      throw error;
    }

    const json = await res.json();
    const text = String(json?.content_text || "").trim();
    if (!text) {
      throw new Error("レポート本文が空でした。");
    }

    const sIso = String(json?.period_start || "").trim();
    const eIso = String(json?.period_end || "").trim();

    if (sIso && eIso) {
      try {
        const s = new Date(sIso);
        const e = new Date(eIso);
        safeSet(() => {
          setPeriodStartISO(sIso);
          setPeriodEndISO(eIso);
          setTitleRange(
            `${s.getMonth() + 1}/${s.getDate()} ～ ${e.getMonth() + 1}/${e.getDate()}`
          );
        });
      } catch {
        // ignore
      }
    }

    // ★ ここで画面がもう無い（戻った）なら、以降の setState を行わない
    if (!aliveRef.current) return;

    safeSet(() => {
      setReportText(text);
      setMeta({
        source: "myprofile/latest",
        report_mode: json?.report_mode || effectiveMode,
        subscription_tier_client: tier,
        ensure: {
          refreshed: !!json?.refreshed,
          reason: json?.reason,
          generated_at: json?.generated_at,
        },
        server_meta: json?.meta || null,
      });
    });

    if (typeof onLatestSeenVersion === "function") {
      try {
        const latestStatusJson = await apiGet("/myprofile/latest/status");
        const latestVersionKey = String(latestStatusJson?.version_key || "").trim();
        if (latestVersionKey) {
          await onLatestSeenVersion(latestVersionKey);
        }
      } catch (syncError) {
        console.warn(
          "SelfStructureReportGenerateScreen: failed to sync latest seen version",
          syncError
        );
      }
    }
  } catch (e) {
    // 戻る操作で abort/cancel された場合は握りつぶす（画面はもう無い）
    if (!aliveRef.current) return;
    const status = e?.httpStatus;
    const msg = String(e?.message || e || "");

    const isPaywall =
      status === 402 ||
      status === 403 ||
      /\b402\b/.test(msg) ||
      /\b403\b/.test(msg) ||
      /forbidden/i.test(msg);

    if (isPaywall) {
      Alert.alert(
        "プランが必要です",
        "現在のプランではこの機能を利用できません。\n\nプランを確認しますか？",
        [
          { text: "あとで", style: "cancel" },
          { text: "プランを見る", onPress: openSubscriptionSelect },
        ]
      );
      safeSet(() => setErrorMsg("現在のプランでは利用できません。"));
      return;
    }

    safeSet(() => setErrorMsg(buildErrorMessage(e)));
  } finally {
    if (!aliveRef.current) return;
    safeSet(() => setLoading(false));
  }
  }, [safeSet, reportMode, subscriptionTier, allowedModes, onLatestSeenVersion]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <ScrollView
      style={[styles.container, themed.container]}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {/* ヘッダー */}
      <View style={[styles.headerRow, themed.headerRow]}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backBtn}
          activeOpacity={0.85}
        >
          <Text style={[styles.backIcon, themed.backIcon]}>←</Text>
          <Text style={[styles.backText, themed.backText]}>履歴</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => run({ force: true })}
            style={[styles.smallBtn, themed.smallBtn]}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Ionicons
              name="refresh-outline"
              size={16}
              color={isDark ? colors.TEXT_ON_LIGHT : "#111827"}
            />
            <Text style={[styles.smallBtnText, themed.smallBtnText]}>
              更新
            </Text>
          </TouchableOpacity>

          {/* PDF保存ボタンは非表示 */}
        </View>
      </View>

      {/* タイトル */}
      <Text style={[styles.title, themed.title]}>{reportTitle}</Text>


      {/* 🧭 表示モード（Standard / Deep） */}
      <View style={[styles.modeCard, themed.bodyCard]}>
        <View style={styles.modeHeaderRow}>
          <Text style={[styles.modeTitle, themed.p]}>表示モード</Text>

          {tierLoading ? (
            <ActivityIndicator
              size="small"
              color={isDark ? colors.TEXT_ON_LIGHT : undefined}
            />
          ) : (
            <Text style={[styles.modeTierText, themed.empty]}>
              現在のプラン：{subscriptionTierLabel(subscriptionTier)}
            </Text>
          )}
        </View>

        <View style={styles.modeButtonsRow}>
          {["standard", "deep"].map((m) => {
            const allowed = (allowedModes || []).includes(m);
            const active = reportMode === m;

            const iconName =
              m === "standard" ? "layers-outline" : "analytics-outline";

            const iconColor = !allowed
              ? isDark
                ? colors.TEXT_SUBTLE
                : "#9CA3AF"
              : active
              ? "#FFFFFF"
              : isDark
              ? colors.TEXT_ON_LIGHT
              : "#111827";

            return (
              <TouchableOpacity
                key={m}
                style={[
                  styles.modeBtn,
                  isDark && themed.smallBtn,
                  active && styles.modeBtnActive,
                  active && {
                    backgroundColor: colors.GOLD_BUTTON || "#D4AF37",
                    borderColor: colors.GOLD_BUTTON_BORDER || "#C9A227",
                  },
                  !allowed && styles.modeBtnDisabled,
                ]}
                activeOpacity={0.85}
                onPress={() => {
                  if (!allowed) {
                    const label = MODE_LABEL[m] || m;
                    const msg =
                      m === "deep"
                        ? `「${label}」はPremiumで提供予定です。\n\n※Premiumは準備中です。`
                        : `「${label}」はPlus会員のみ利用できます。\n\nプランを確認しますか？`;
                    Alert.alert("プランが必要です", msg, [
                      { text: "あとで", style: "cancel" },
                      {
                        text: m === "deep" ? "プラン内容を見る" : "プランを見る",
                        onPress: openSubscriptionSelect,
                      },
                    ]);
                    return;
                  }
                  setReportMode(m);
                }}
              >
                <Ionicons
                  name={iconName}
                  size={16}
                  color={iconColor}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.modeBtnText,
                    isDark && themed.smallBtnText,
                    active && styles.modeBtnTextActive,
                    !allowed && styles.modeBtnTextDisabled,
                  ]}
                >
                  {MODE_LABEL[m] || m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!!tierError ? (
          <Text style={[styles.modeErrorText, themed.errorText]}>
            プラン情報を確認できませんでした。利用できる表示モードをご確認ください。
          </Text>
        ) : null}

        <Text style={[styles.modeHint, themed.empty]}>
          ※モード変更後は「更新」を押すと反映されます。DeepはPremiumで提供予定です。
        </Text>
      </View>

      {loading && (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
        </View>
      )}

      {!!errorMsg && (
        <Text style={[styles.errorText, themed.errorText]}>
          取得エラー: {errorMsg}
        </Text>
      )}

      {!loading && !errorMsg && (
        <View style={[styles.bodyCard, themed.bodyCard]}>
          {reportText ? (
            reportText.split("\n").map((line, idx) => (
              <Text key={`l-${idx}`} style={[styles.p, themed.p]}>
                {line}
              </Text>
            ))
          ) : (
            <Text style={[styles.empty, themed.empty]}>内容がありません</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 10,
  },
  backIcon: { fontSize: 18, color: "#374151", marginRight: 4 },
  backText: { color: "#374151", fontSize: 13, fontWeight: "600" },

  headerRight: { flexDirection: "row", alignItems: "center" },
  smallBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  smallBtnText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  // 🧭 mode selector
  modeCard: {
    display: "none",
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
  },
  modeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  modeTierText: { fontSize: 11, color: "#6B7280", fontWeight: "700" },
  modeButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modeBtn: {
    flex: 1,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  modeBtnActive: {
    backgroundColor: "#D4AF37",
    borderColor: "#C9A227",
  },
  modeBtnDisabled: { opacity: 0.45 },
  modeBtnText: { fontSize: 12, fontWeight: "900", color: "#111827" },
  modeBtnTextActive: { color: "#FFFFFF" },
  modeBtnTextDisabled: { color: "#9CA3AF" },
  modeHint: { marginTop: 8, fontSize: 11, lineHeight: 16, color: "#6B7280" },
  modeErrorText: { marginTop: 6, fontSize: 11, lineHeight: 16, color: "#B91C1C" },

  errorText: { paddingHorizontal: 16, paddingBottom: 8, color: "#B91C1C" },

  bodyCard: {
    marginHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
  },
  p: { color: "#374151", fontSize: 14, lineHeight: 20, marginBottom: 4 },
  empty: { padding: 12, color: "#6B7280" },
});
