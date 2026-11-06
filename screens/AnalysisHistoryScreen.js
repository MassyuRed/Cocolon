import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { supabase } from "../lib/supabase";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { useSubscription } from "../SubscriptionContext";
import { apiJson, apiFetch } from "../lib/apiClient";
import { getHistoryRetentionLabel } from "../lib/historyRetentionLabel";
import { useAuth } from "../AuthContext";
import { useEmlisThread } from "./input/useEmlisThread";
import EmlisThreadModal from "./input/EmlisThreadModal";
import { useAppRuntime } from "../AppRuntimeContext";
import { supportsPieceBitmapCreation } from "../features/piece/pieceRenderer";

const EMOTION_SECRET_URL = "/emotion/secret";
const EMOTION_HISTORY_SEARCH_URL = "/emotion/history/search";

// Phase2: no infinite scroll yet (Phase3). Keep this modest.
const PAGE_LIMIT = 50;

function getDeviceTimeZone() {
  try {
    const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone;
    return typeof tz === "string" && tz ? tz : "UTC";
  } catch {
    return "UTC";
  }
}

function parseIsoToDate(iso) {
  if (!iso) return null;
  let s = String(iso);

  // Supabase/Postgres の戻りが 'YYYY-MM-DD HH:MM:SS' 形式になるケースに備えて正規化
  if (/^\d{4}-\d{2}-\d{2} \d/.test(s)) {
    s = s.replace(" ", "T");
  }

  // タイムゾーン情報がない場合は UTC として扱う（端末ローカル時間に変換して表示するため）
  const hasTz = /[zZ]$/.test(s) || /[+-]\d{2}:\d{2}$/.test(s);
  if (!hasTz) s = `${s}Z`;

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatTimeLabel(iso) {
  const d = parseIsoToDate(iso);
  if (!d) return "";
  return d.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// -------------------------
// Phase4 UI helpers
// -------------------------

const _RE_UI_DAY = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
const _RE_UI_MONTH = /^(\d{4})[-/](\d{1,2})$/;

function _pad2(n) {
  const v = String(Number(n) || 0);
  return v.length >= 2 ? v : `0${v}`;
}

function _normalizeDateToken(token) {
  const t = String(token || "").trim();
  if (!t) return null;

  const mDay = t.match(_RE_UI_DAY);
  if (mDay) {
    const y = mDay[1];
    const mo = _pad2(mDay[2]);
    const d = _pad2(mDay[3]);
    return { kind: "day", label: `${y}-${mo}-${d}` };
  }

  const mMonth = t.match(_RE_UI_MONTH);
  if (mMonth) {
    const y = mMonth[1];
    const mo = _pad2(mMonth[2]);
    return { kind: "month", label: `${y}-${mo}` };
  }

  return null;
}

function _normalizeStrengthToken(token) {
  const raw = String(token || "").trim();
  if (!raw) return null;
  const t = raw.toLowerCase();

  // JP
  if (raw === "強" || raw === "強い" || t === "strong") return { key: "strong", label: "強" };
  if (raw === "中" || raw === "普通" || t === "medium") return { key: "medium", label: "中" };
  if (raw === "弱" || raw === "弱い" || t === "weak") return { key: "weak", label: "弱" };

  return null;
}

function parseSearchTokensForUi(rawQuery) {
  const s = String(rawQuery || "").trim();
  const tokens = s ? s.split(/\s+/) : [];

  const keywords = [];
  const strengthLabels = [];
  let dateLabel = null;
  let dateRank = 0; // month=1, day=2

  for (const tok of tokens) {
    const dt = _normalizeDateToken(tok);
    if (dt) {
      const rank = dt.kind === "day" ? 2 : 1;
      // Prefer more specific date; if same rank, keep the latest one
      if (rank >= dateRank) {
        dateRank = rank;
        dateLabel = dt.label;
      }
      continue;
    }

    const st = _normalizeStrengthToken(tok);
    if (st) {
      if (!strengthLabels.includes(st.label)) strengthLabels.push(st.label);
      continue;
    }

    const kw = String(tok || "").trim();
    if (kw) keywords.push(kw);
  }

  return { keywords, strengthLabels, dateLabel };
}

function _escapeRegExp(str) {
  return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildHighlightRegex(terms) {
  const list = Array.isArray(terms) ? terms.filter(Boolean).map((t) => String(t).trim()).filter(Boolean) : [];
  if (!list.length) return null;

  // Prefer longer tokens first to avoid fragment highlighting (e.g., "a" inside "abc")
  const uniq = Array.from(new Set(list)).sort((a, b) => b.length - a.length).slice(0, 8);

  try {
    return new RegExp(`(${uniq.map(_escapeRegExp).join("|")})`, "gi");
  } catch {
    return null;
  }
}

function renderHighlightedText(text, rx, highlightStyle) {
  const s = String(text || "");
  if (!s) return s;
  if (!rx) return s;

  try {
    rx.lastIndex = 0;
  } catch {}

  // Fast path: no match
  if (!rx.test(s)) return s;

  try {
    rx.lastIndex = 0;
  } catch {}

  const parts = s.split(rx);
  return parts
    .map((part, idx) => {
      if (part === "") return null;
      const isHit = idx % 2 === 1; // captured group
      return (
        <Text key={`h_${idx}`} style={isHit ? highlightStyle : undefined}>
          {part}
        </Text>
      );
    })
    .filter(Boolean);
}

export default function AnalysisHistoryScreen({ onBack, navigation }) {
  const { session } = useAuth();
  const { isFeatureEnabled } = useAppRuntime();
  const emlisThread = useEmlisThread({ userId: session?.user?.id || "" });
  const [query, setQuery] = useState(""); // 入力中（未実行でも変わる）
  const [executedQuery, setExecutedQuery] = useState(""); // 最後に実行した検索語
  const [secretFilter, setSecretFilter] = useState("all"); // all | public | secret
  const [order, setOrder] = useState("desc"); // 'desc' 新しい順 / 'asc' 古い順

  const [rows, setRows] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);


  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { themeName, colors } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const { tier: subscriptionTier, loading: subscriptionLoading } = useSubscription();
  const isDark = themeName === "dark";
  const historyRetentionLabel = useMemo(
    () => getHistoryRetentionLabel(subscriptionTier),
    [subscriptionTier]
  );
  const showHistoryRetentionLabel = !subscriptionLoading && !!historyRetentionLabel;
  // Every theme now uses the same semantic style bindings.
  const themed = {};


  // -------------------------
  // Phase4: condition summary + highlight
  // -------------------------
  const parsedUi = useMemo(() => parseSearchTokensForUi(executedQuery), [executedQuery]);

  const highlightRegex = useMemo(
    () => buildHighlightRegex(parsedUi.keywords),
    [parsedUi.keywords]
  );

  const highlightStyle = useMemo(
    () => ({
      fontWeight: "600",
      color: colors.ON_SURFACE_TONAL,
      backgroundColor: colors.SURFACE_TONAL,
    }),
    [isDark, colors]
  );

  const renderHitText = useCallback(
    (text) => renderHighlightedText(text, highlightRegex, highlightStyle),
    [highlightRegex, highlightStyle]
  );

  const conditionSummary = useMemo(() => {
    const hasAnyCondition =
      parsedUi.keywords.length > 0 ||
      parsedUi.strengthLabels.length > 0 ||
      !!parsedUi.dateLabel ||
      secretFilter !== "all" ||
      order !== "desc";

    if (!hasAnyCondition) return "";

    const parts = [];

    if (parsedUi.keywords.length) parts.push(parsedUi.keywords.join(" "));
    if (parsedUi.strengthLabels.length) parts.push(parsedUi.strengthLabels.join("+"));
    if (parsedUi.dateLabel) parts.push(parsedUi.dateLabel);

    // Always show secret mode in the condition bar (structural)
    parts.push(
      secretFilter === "public"
        ? "公開のみ"
        : secretFilter === "secret"
        ? "Secretのみ"
        : "すべて"
    );

    // Show sort only when non-default (keep UI minimal)
    if (order !== "desc") {
      parts.push(order === "asc" ? "古い順" : "新しい順");
    }

    return parts.join(" / ");
  }, [parsedUi, secretFilter, order]);

  const mapApiRow = useCallback((d) => {
    return {
      id: d?.id,
      createdAt: d?.created_at,
      date: formatTimeLabel(d?.created_at),
      emotions: Array.isArray(d?.emotions) ? d.emotions : [],
      memo: d?.memo || "",
      memoAction: d?.memo_action || "",
      categories: Array.isArray(d?.category) ? d.category : [],
      details: Array.isArray(d?.emotion_details) ? d.emotion_details : [],
      strengthAvg:
        typeof d?.emotion_strength_avg === "number" ? d.emotion_strength_avg : null,
      isSecret: !!d?.is_secret,
    };
  }, []);

  const load = useCallback(
    async ({
      q,
      secretFilter: secretOverride,
      order: orderOverride,
      offset: offsetArg = 0,
      limit = PAGE_LIMIT,
      showLoading = true,
      append = false,
    } = {}) => {
      setErrorMsg("");
      if (showLoading) setLoading(true);

      const effectiveQuery =
        typeof q === "string" ? q.trim() : String(executedQuery || "").trim();
      const effectiveSecretFilter =
        typeof secretOverride === "string" ? secretOverride : secretFilter;
      const effectiveOrder = typeof orderOverride === "string" ? orderOverride : order;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        if (!accessToken) {
          setErrorMsg("認証情報がありません（ログインしてください）");
          setRows([]);
          setHasMore(false);
          setOffset(0);
          return;
        }

        const timezone = getDeviceTimeZone();

        // API: POST /emotion/history/search
        const basePayload = {
          query: effectiveQuery ? effectiveQuery : null,
          timezone, // global対応（IANA TZ）
          secret_filter: effectiveSecretFilter,
          order: effectiveOrder,
          offset: Number(offsetArg) || 0,
          limit: Number(limit) || PAGE_LIMIT,
        };

        const doFetch = async (payload) => {
          return await apiFetch(EMOTION_HISTORY_SEARCH_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
          });
        };

        let res = await doFetch(basePayload);
        let textIfError = "";
        if (!res.ok) {
          textIfError = await res.text().catch(() => "");
          // Backward-compat: server側が timezone フィールド未対応の場合に備えてリトライ
          if (res.status === 422 && /timezone/i.test(textIfError || "")) {
            const retryPayload = { ...basePayload };
            delete retryPayload.timezone;
            res = await doFetch(retryPayload);
            if (!res.ok) {
              textIfError = await res.text().catch(() => textIfError);
            } else {
              textIfError = "";
            }
          }
        }

        if (!res.ok) {
          const msg =
            (textIfError || "").trim().slice(0, 800) ||
            `検索に失敗しました（${res.status}）`;
          throw new Error(msg);
        }

        const json = await res.json().catch(() => null);

        const items = Array.isArray(json?.items) ? json.items : [];
        const meta = json?.meta || {};

        const mapped = items.map(mapApiRow).filter((r) => !!r?.id);

        const nextHasMore = !!meta?.has_more;
        const nextOffset =
          nextHasMore
            ? Number(
                meta?.next_offset ??
                  (Number(offsetArg || 0) + Number(limit || PAGE_LIMIT))
              )
            : Number(offsetArg || 0) + mapped.length;

        setHasMore(nextHasMore);
        setOffset(Number.isFinite(nextOffset) ? nextOffset : 0);

        if (!append || Number(offsetArg || 0) === 0) {
          setRows(mapped);
        } else {
          // merge (dedupe by id) — keep order as returned by API
          setRows((prev) => {
            const seen = new Set((prev || []).map((r) => String(r?.id)));
            const out = Array.isArray(prev) ? [...prev] : [];
            for (const r of mapped) {
              const id = String(r?.id || "");
              if (!id) continue;
              if (!seen.has(id)) {
                seen.add(id);
                out.push(r);
              }
            }
            return out;
          });
        }

        // UIの「現在条件」を保存（refreshや並び替えに使う）
        setExecutedQuery(effectiveQuery);
      } catch (e) {
        setErrorMsg(String(e?.message || e));

        // If this was a "load more" request, preserve current rows and paging state.
        if (!append || Number(offsetArg || 0) === 0) {
          setRows([]);
          setHasMore(false);
          setOffset(0);
        }
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [executedQuery, secretFilter, order, mapApiRow]
  );

  // 初回は最新を読む（クエリ無し / all / desc）
  useEffect(() => {
    load({ q: "", offset: 0, showLoading: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load({ offset: 0, showLoading: false });
    setRefreshing(false);
  }, [load]);

  const handleSearch = useCallback(async () => {
    await load({ q: query, offset: 0, showLoading: true });
  }, [load, query]);

  const applyOrder = useCallback(
    async (nextOrder) => {
      if (nextOrder === order) return;
      setOrder(nextOrder);
      await load({ order: nextOrder, offset: 0, showLoading: true });
    },
    [order, load]
  );

  const applySecretFilter = useCallback(
    async (nextFilter) => {
      if (nextFilter === secretFilter) return;
      setSecretFilter(nextFilter);
      await load({ secretFilter: nextFilter, offset: 0, showLoading: true });
    },
    [secretFilter, load]
  );

  const updateSecret = useCallback(
    async (row) => {
      const nextVal = !row.isSecret;
      setUpdatingId(row.id);
      setErrorMsg("");
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token ?? null;
        if (!accessToken) {
          setErrorMsg("認証情報がありません（ログインしてください）");
          return;
        }

        const res = await apiFetch(EMOTION_SECRET_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            emotion_id: row.id,
            is_secret: nextVal,
            created_at: row.createdAt,
          }),
        });

        if (!res.ok) {
          const t = await res.text();
          setErrorMsg(`更新に失敗しました: ${t || res.status}`);
          return;
        }

        // フィルタに合わなくなった場合は除外（Phase2: 再検索まではしない）
        if (secretFilter === "public" && nextVal === true) {
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          return;
        }
        if (secretFilter === "secret" && nextVal === false) {
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          return;
        }

        setRows((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, isSecret: nextVal } : r))
        );
      } catch (e) {
        setErrorMsg(String(e?.message || e));
      } finally {
        setUpdatingId(null);
      }
    },
    [secretFilter]
  );

  const deleteRow = useCallback(async (row) => {
    setDeletingId(row.id);
    setErrorMsg("");
    try {
      await apiJson(`/emotion/history/${encodeURIComponent(String(row.id))}`, {
        method: "DELETE",
      });
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      emlisThread.reset();
    } catch (e) {
      setErrorMsg(String(e?.message || e));
    } finally {
      setDeletingId(null);
    }
  }, []);

  const confirmDelete = useCallback(
    (row) => {
      Alert.alert("履歴を削除しますか？", "この操作は取り消せません。", [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => deleteRow(row),
        },
      ]);
    },
    [deleteRow]
  );

  const emptyText = useMemo(() => {
    const hasCondition = !!(executedQuery?.trim() || secretFilter !== "all");
    return hasCondition ? "一致する履歴がありません" : "履歴がありません";
  }, [executedQuery, secretFilter]);

  const handleClear = useCallback(async () => {
    setQuery("");
    // クリアは「検索実行」と同義（全件=最新ページ）
    await load({ q: "", offset: 0, showLoading: true });
  }, [load]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return;
    if (loading || refreshing || loadingMore) return;
    if (loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      await load({
        offset,
        append: true,
        showLoading: false,
      });
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [hasMore, loading, refreshing, loadingMore, load, offset]);

  const listHeader = (
    <View style={styles.controls}>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBar,
              themed.searchBar,
              { marginLeft: 0, marginRight: 0 },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={ui?.text?.description ?? colors.TEXT_SUBTLE}
              style={styles.searchIcon}
            />
            <TextInput
              accessibilityLabel="履歴の検索キーワード"
              style={[styles.searchInput, themed.searchInput]}
              placeholder="履歴を検索（メモ/行動メモ・感情・カテゴリ・日付・強/中/弱）"
              placeholderTextColor={ui?.text?.description ?? colors.TEXT_SUBTLE}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              autoCorrect={false}
            />

            {!!query ? (
              <TouchableOpacity
                onPress={handleClear}
                accessibilityRole="button" accessibilityLabel="検索条件をクリアする"
                style={styles.iconButton}
                disabled={loading || refreshing}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={ui?.text?.description ?? colors.TEXT_SUBTLE}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleSearch}
              accessibilityRole="button" accessibilityLabel="履歴を検索する"
              style={styles.iconButton}
              disabled={loading || refreshing}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={22}
                color={ui?.text?.description ?? colors.TEXT_SUBTLE}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Secret filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => applySecretFilter("all")}
            accessibilityRole="button" accessibilityState={{ selected: secretFilter === "all", disabled: loading }}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "all" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "all" && {
                backgroundColor: colors.SURFACE_TONAL,
                borderColor: colors.ON_SURFACE_TONAL,
              },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                styles.filterText,
                themed.filterText,
                { color: colors.TEXT_ON_LIGHT },
                secretFilter === "all" && {
                  color: colors.ON_SURFACE_TONAL,
                  fontWeight: "600",
                },
              ]}
            >
              すべて
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applySecretFilter("public")}
            accessibilityRole="button" accessibilityState={{ selected: secretFilter === "public", disabled: loading }}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "public" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "public" && {
                backgroundColor: colors.SURFACE_TONAL,
                borderColor: colors.ON_SURFACE_TONAL,
              },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                styles.filterText,
                themed.filterText,
                { color: colors.TEXT_ON_LIGHT },
                secretFilter === "public" && {
                  color: colors.ON_SURFACE_TONAL,
                  fontWeight: "600",
                },
              ]}
            >
              公開のみ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applySecretFilter("secret")}
            accessibilityRole="button" accessibilityState={{ selected: secretFilter === "secret", disabled: loading }}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "secret" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "secret" && {
                backgroundColor: colors.SURFACE_TONAL,
                borderColor: colors.ON_SURFACE_TONAL,
              },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                styles.filterText,
                themed.filterText,
                { color: colors.TEXT_ON_LIGHT },
                secretFilter === "secret" && {
                  color: colors.ON_SURFACE_TONAL,
                  fontWeight: "600",
                },
              ]}
            >
              Secretのみ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort order */}
        <View style={styles.orderRow}>
          <TouchableOpacity
            onPress={() => applyOrder("desc")}
            accessibilityRole="button" accessibilityState={{ selected: order === "desc", disabled: loading }}
            style={[
              styles.orderBtn,
              themed.orderBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              order === "desc" && [styles.orderBtnOn, themed.orderBtnOn],
              order === "desc" && {
                backgroundColor: colors.SURFACE_TONAL,
                borderColor: colors.ON_SURFACE_TONAL,
              },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                styles.orderText,
                themed.orderText,
                { color: colors.TEXT_ON_LIGHT },
                order === "desc" && {
                  color: colors.ON_SURFACE_TONAL,
                  fontWeight: "600",
                },
              ]}
            >
              新しい順
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applyOrder("asc")}
            accessibilityRole="button" accessibilityState={{ selected: order === "asc", disabled: loading }}
            style={[
              styles.orderBtn,
              themed.orderBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              order === "asc" && [styles.orderBtnOn, themed.orderBtnOn],
              order === "asc" && {
                backgroundColor: colors.SURFACE_TONAL,
                borderColor: colors.ON_SURFACE_TONAL,
              },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                styles.orderText,
                themed.orderText,
                { color: colors.TEXT_ON_LIGHT },
                order === "asc" && {
                  color: colors.ON_SURFACE_TONAL,
                  fontWeight: "600",
                },
              ]}
            >
              古い順
            </Text>
          </TouchableOpacity>
        
</View>

        {conditionSummary ? (
          <View style={[styles.conditionBar, themed.conditionBar]}>
            <Ionicons
              name="search-outline"
              size={14}
              color={ui?.text?.description ?? colors.TEXT_SUBTLE}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[styles.conditionText, themed.conditionText]}
            >
              {conditionSummary}
            </Text>
          </View>
        ) : null}

        {showHistoryRetentionLabel ? (
          <Text
            style={[
              styles.historyRetentionText,
              { color: ui?.text?.primary ?? colors.TEXT_ON_LIGHT },
            ]}
          >
            {historyRetentionLabel}
          </Text>
        ) : null}

        {hasMore ? (
          <Text style={[styles.noticeText, themed.noticeText]}>
            下にスクロールして続きを読み込み
          </Text>
        ) : null}
      {errorMsg ? <Text accessibilityLiveRegion="polite" style={styles.error}>取得エラー: {errorMsg}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.container, themed.container]}>
      <EmlisThreadModal thread={emlisThread} colors={colors} navigation={navigation}
        userId={session?.user?.id || ""} pieceEnabled={isFeatureEnabled("piece_v2_preview_enabled", false) === true && supportsPieceBitmapCreation()} />
      {/* ヘッダー（上段：戻る＋検索、右にソート） */}
      <View style={[styles.header, themed.header]}>
        <View style={styles.headerRow}>
          {onBack ? (
            <CocolonBackButton
              onPress={onBack}
              style={[styles.backBtn, { width: 64 }]}
            />
          ) : (
            <View style={{ width: 64 }} />
          )}

          <Text style={[styles.headerTitle, { color: colors.TITLE_GOLD }]}>
            感情入力履歴
          </Text>

          <View style={{ width: 64 }} />
        </View>

      </View>

      {/* リスト */}
      <FlatList
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={listHeader}
          data={rows}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.TEXT_ON_LIGHT}
              colors={[colors.TEXT_ON_LIGHT]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 14 }}>
                <ActivityIndicator
                  size="small"
                  color={isDark ? colors.TEXT_ON_LIGHT : undefined}
                />
              </View>
            ) : (
              <View style={{ height: 12 }} />
            )
          }
          renderItem={({ item }) => (
            <View style={[styles.row, themed.row]}>
              <View style={styles.rowTop}>
                <Text style={[styles.date, themed.date]}>{item.date}</Text>
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    onPress={() => updateSecret(item)}
                    style={[
                      styles.secretBtn,
                      themed.secretBtn,
                      styles.secretBtnSpacer,
                      { display: "none" },
                      item.isSecret && [styles.secretBtnOn, themed.secretBtnOn],
                    ]}
                    activeOpacity={0.85}
                    disabled={updatingId === item.id || deletingId === item.id}
                  >
                    {updatingId === item.id ? (
                      <ActivityIndicator
                        size="small"
                        color={
                          item.isSecret
                            ? isDark
                              ? colors.ACCENT_TEXT
                              : "#FFFFFF"
                            : isDark
                            ? colors.TEXT_ON_LIGHT
                            : ui?.text?.primary ?? colors.TEXT_ON_LIGHT
                        }
                      />
                    ) : (
                      <View style={styles.secretBtnInner}>
                        <Ionicons
                          name={
                            item.isSecret
                              ? "lock-closed-outline"
                              : "lock-open-outline"
                          }
                          size={16}
                          color={
                            item.isSecret
                              ? isDark
                                ? colors.ACCENT_TEXT
                                : "#FFFFFF"
                              : isDark
                              ? colors.TEXT_ON_LIGHT
                              : ui?.text?.primary ?? colors.TEXT_ON_LIGHT
                          }
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={[
                            styles.secretText,
                            themed.secretText,
                            item.isSecret && styles.secretTextOn,
                          ]}
                        >
                          {item.isSecret ? "Secret" : "公開"}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => confirmDelete(item)}
                    accessibilityRole="button" accessibilityLabel="この記録を削除する"
                    accessibilityState={{ disabled: updatingId === item.id || deletingId === item.id, busy: deletingId === item.id }}
                    style={[styles.deleteBtn, themed.deleteBtn]}
                    activeOpacity={0.85}
                    disabled={updatingId === item.id || deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <ActivityIndicator
                        size="small"
                        color={colors.ERROR}
                      />
                    ) : (
                      <View style={styles.secretBtnInner}>
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={colors.ERROR}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.deleteText}>削除</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.emotions, themed.emotions]}>
                {renderHitText(
                  item.details && item.details.length > 0
                    ? item.details
                        .map(
                          (d) =>
                            // 「自己理解」は強度を表示しない（プライベート用途）
                            String(d?.type || "").trim() === "自己理解"
                              ? "自己理解"
                              : `${d.type}（${
                                  d.strength === "weak"
                                    ? "弱"
                                    : d.strength === "medium"
                                    ? "中"
                                    : "強"
                                }）`
                        )
                        .join(", ")
                    : item.emotions.join(", ")
                )}
              </Text>

              {!!item.memo && (
                <View style={styles.memoBlock}>
                  <Text style={[styles.memoLabel, themed.memoLabel]}>思考内容</Text>
                  <Text style={[styles.memo, themed.memo]}>{renderHitText(item.memo)}</Text>
                </View>
              )}
              {!!item.memoAction && (
                <View style={styles.memoBlock}>
                  <Text style={[styles.memoLabel, themed.memoLabel]}>行動内容</Text>
                  <Text style={[styles.memo, themed.memo]}>{renderHitText(item.memoAction)}</Text>
                </View>
              )}
              {!!item.categories?.length && (
                <View style={styles.memoBlock}>
                  <Text style={[styles.memoLabel, themed.memoLabel]}>選択カテゴリ</Text>
                  <Text style={[styles.categoryValue, themed.categoryValue]}>
                    {renderHitText(item.categories.join(" / "))}
                  </Text>
                </View>
              )}
              {emlisThread.enabled && <TouchableOpacity onPress={() => emlisThread.open(item.id, { showNotCreated: true })}
                accessibilityRole="button" accessibilityLabel="この記録のEmlisからの応答を開く" style={styles.replyButton}>
                <Text style={styles.replyText}>Emlisからの応答を開く</Text>
              </TouchableOpacity>}
            </View>
          )}
          ListEmptyComponent={
            loading ? <ActivityIndicator accessibilityLabel="履歴を読み込み中" style={{ padding: 24 }} color={colors.TITLE_GOLD} /> : !errorMsg ? (
              <Text
                style={[
                  { padding: 16, color: ui?.text?.description ?? colors.TEXT_SUBTLE },
                  isDark && themed.listEmptyText,
                ]}
              >
                {emptyText}
              </Text>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
    </SafeAreaView>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.BG_SILVER },
    header: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 12 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerTitle: { ...ui.typography.screenTitle, flex: 1, textAlign: "center", color: COLORS.TEXT_ON_LIGHT },
    backBtn: { minWidth: 44, minHeight: 44 },
    controls: { paddingBottom: 16 },
    listContent: { paddingHorizontal: 20, paddingBottom: 24, width: "100%", maxWidth: 680, alignSelf: "center" },
    searchRow: { flexDirection: "row", alignItems: "center" },
    searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.FIELD_BG, borderRadius: 16, borderWidth: 1, borderColor: COLORS.CARD_BORDER, paddingHorizontal: 8, minHeight: 52, flex: 1 },
    searchInput: { ...ui.typography.input, flex: 1, paddingHorizontal: 6, paddingVertical: 12, color: COLORS.TEXT_ON_LIGHT },
    searchIcon: { marginHorizontal: 4 },
    iconButton: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
    filterRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 12, gap: 8 },
    filterBtn: { minHeight: 44, justifyContent: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG },
    filterBtnOn: { backgroundColor: COLORS.SURFACE_TONAL, borderColor: COLORS.ON_SURFACE_TONAL },
    filterText: { ...ui.typography.description, color: COLORS.TEXT_ON_LIGHT },
    orderRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 8 },
    orderBtn: { minHeight: 44, justifyContent: "center", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG },
    orderBtnOn: { backgroundColor: COLORS.SURFACE_TONAL, borderColor: COLORS.ON_SURFACE_TONAL },
    orderText: { ...ui.typography.description, color: COLORS.TEXT_ON_LIGHT },
    noticeText: { ...ui.typography.meta, marginTop: 8, color: COLORS.TEXT_SUBTLE },
    conditionBar: { flexDirection: "row", alignItems: "flex-start", marginTop: 12, padding: 12, borderRadius: 16, backgroundColor: COLORS.SURFACE_TONAL },
    conditionText: { ...ui.typography.description, flex: 1, color: COLORS.ON_SURFACE_TONAL },
    historyRetentionText: { ...ui.typography.meta, marginTop: 12, color: COLORS.TEXT_SUBTLE },
    error: { ...ui.typography.description, marginTop: 12, padding: 12, borderRadius: 16, color: COLORS.ERROR, backgroundColor: COLORS.ERROR_BG },
    row: { padding: 20, marginBottom: 12, borderRadius: 24, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG },
    rowTop: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 },
    rowActions: { flexDirection: "row", alignItems: "center" },
    date: { ...ui.typography.meta, color: COLORS.TEXT_SUBTLE },
    emotions: { ...ui.typography.description, color: COLORS.TEXT_ON_LIGHT },
    memoBlock: { marginTop: 16 },
    memoLabel: { ...ui.typography.description, fontWeight: "600", color: COLORS.TEXT_SUBTLE },
    memo: { ...ui.typography.body, marginTop: 6, color: COLORS.TEXT_ON_LIGHT, fontStyle: "normal" },
    categoryValue: { ...ui.typography.description, marginTop: 6, color: COLORS.TEXT_SUBTLE },
    replyButton: { minHeight: 44, justifyContent: "center", marginTop: 16 },
    replyText: { ...ui.typography.button, color: COLORS.TITLE_GOLD },
    deleteBtn: { flexDirection: "row", alignItems: "center", minHeight: 44, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG },
    deleteText: { ...ui.typography.description, fontWeight: "600", color: COLORS.ERROR },
    secretBtnSpacer: { marginRight: 8 },
    secretBtn: { minHeight: 44, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: COLORS.CARD_BORDER, backgroundColor: COLORS.FIELD_BG },
    secretBtnOn: { backgroundColor: COLORS.GOLD_BUTTON, borderColor: COLORS.GOLD_BUTTON_BORDER },
    secretBtnInner: { flexDirection: "row", alignItems: "center" },
    secretText: { ...ui.typography.description, color: COLORS.TEXT_ON_LIGHT },
    secretTextOn: { color: COLORS.ACCENT_TEXT },
  });
}
