import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CocolonBackButton from "../components/CocolonBackButton";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";
import { useTheme } from "../theme/ThemeContext";

const API_BASE = "https://mashos-api.onrender.com";
const EMOTION_SECRET_URL = `${API_BASE}/emotion/secret`;
const EMOTION_HISTORY_SEARCH_URL = `${API_BASE}/emotion/history/search`;

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

export default function MyWebHistoryScreen({ onBack }) {
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
  const isDark = themeName === "dark";
  const themed = useMemo(() => {
    if (!isDark) return {};
    return {
      container: { backgroundColor: colors.BG_SILVER },
      header: {
        backgroundColor: colors.BG_SILVER,
        borderBottomColor: colors.CARD_BORDER,
      },
      backText: { color: colors.TEXT_ON_LIGHT },
      searchBar: {
        backgroundColor: colors.FIELD_BG,
        borderColor: colors.CARD_BORDER,
      },
      searchInput: { color: colors.TEXT_ON_LIGHT },
      orderBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      orderBtnOn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      orderText: { color: colors.TEXT_ON_LIGHT },

      filterBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      filterBtnOn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      filterText: { color: colors.TEXT_ON_LIGHT },

      row: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      date: { color: colors.TEXT_ON_LIGHT },
      emotions: { color: colors.TEXT_ON_LIGHT },
      memo: { color: colors.TEXT_SUBTLE },
      memoLabel: { color: colors.TEXT_SUBTLE },
      secretBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      secretBtnOn: {
        backgroundColor: colors.BORDER_GOLD,
        borderColor: colors.BORDER_GOLD,
      },
      secretText: { color: colors.TEXT_ON_LIGHT },
      deleteBtn: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      listEmptyText: { color: colors.TEXT_SUBTLE },
      noticeText: { color: colors.TEXT_SUBTLE },
      conditionBar: {
        backgroundColor: colors.PANEL_BG,
        borderColor: colors.CARD_BORDER,
      },
      conditionText: { color: colors.TEXT_SUBTLE },
    };
  }, [isDark, colors]);


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
      fontWeight: "800",
      color: isDark ? colors.BORDER_GOLD : "#6366F1",
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
          return await fetch(EMOTION_HISTORY_SEARCH_URL, {
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

        const res = await fetch(EMOTION_SECRET_URL, {
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
      const userId = await getCurrentUserId();
      if (!userId) {
        setErrorMsg("ユーザー情報を取得できませんでした（ログインしてください）");
        return;
      }

      // NOTE:
      // - PostgREST は条件に一致する行が 0 件でもエラーにならない（204）ため、
      //   「画面上は消えたがDBからは消えていない」状態を避けるために、
      //   delete の戻り（deletedRows）で実際に削除できたかを判定する。
      const { data: deletedRows, error } = await supabase
        .from("emotions")
        .delete()
        .eq("id", row.id)
        .eq("user_id", userId)
        .select("id");

      if (error) {
        setErrorMsg(String(error.message || "削除に失敗しました"));
        return;
      }

      // 0件なら、権限（RLS）/条件不一致などで削除できていない可能性が高い
      if (!Array.isArray(deletedRows) || deletedRows.length === 0) {
        setErrorMsg("削除できませんでした（権限設定/RLSをご確認ください）");
        return;
      }

      setRows((prev) => prev.filter((r) => r.id !== row.id));
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

  return (
    <SafeAreaView style={[styles.container, themed.container]}>
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
              color={isDark ? colors.TEXT_SUBTLE : "#6B7280"}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, themed.searchInput]}
              placeholder="履歴を検索（メモ/行動メモ・感情・日付・強/中/弱）"
              placeholderTextColor={isDark ? colors.TEXT_SUBTLE : "#9CA3AF"}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              autoCorrect={false}
            />

            {!!query ? (
              <TouchableOpacity
                onPress={handleClear}
                style={{ paddingHorizontal: 4, paddingVertical: 2 }}
                disabled={loading || refreshing}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={isDark ? colors.TEXT_SUBTLE : "#9CA3AF"}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleSearch}
              style={{ paddingHorizontal: 4, paddingVertical: 2 }}
              disabled={loading || refreshing}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={22}
                color={isDark ? colors.TEXT_SUBTLE : "#6B7280"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Secret filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => applySecretFilter("all")}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "all" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "all" && {
                backgroundColor: colors.BORDER_GOLD,
                borderColor: colors.BORDER_GOLD,
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
                  color: colors.ACCENT_TEXT,
                  fontWeight: "700",
                },
              ]}
            >
              すべて
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applySecretFilter("public")}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "public" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "public" && {
                backgroundColor: colors.BORDER_GOLD,
                borderColor: colors.BORDER_GOLD,
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
                  color: colors.ACCENT_TEXT,
                  fontWeight: "700",
                },
              ]}
            >
              公開のみ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applySecretFilter("secret")}
            style={[
              styles.filterBtn,
              themed.filterBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              secretFilter === "secret" && [styles.filterBtnOn, themed.filterBtnOn],
              secretFilter === "secret" && {
                backgroundColor: colors.BORDER_GOLD,
                borderColor: colors.BORDER_GOLD,
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
                  color: colors.ACCENT_TEXT,
                  fontWeight: "700",
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
            style={[
              styles.orderBtn,
              themed.orderBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              order === "desc" && [styles.orderBtnOn, themed.orderBtnOn],
              order === "desc" && {
                backgroundColor: colors.BORDER_GOLD,
                borderColor: colors.BORDER_GOLD,
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
                  color: colors.ACCENT_TEXT,
                  fontWeight: "700",
                },
              ]}
            >
              新しい順
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => applyOrder("asc")}
            style={[
              styles.orderBtn,
              themed.orderBtn,
              { backgroundColor: colors.PANEL_BG, borderColor: colors.CARD_BORDER },
              order === "asc" && [styles.orderBtnOn, themed.orderBtnOn],
              order === "asc" && {
                backgroundColor: colors.BORDER_GOLD,
                borderColor: colors.BORDER_GOLD,
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
                  color: colors.ACCENT_TEXT,
                  fontWeight: "700",
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
              color={isDark ? colors.TEXT_SUBTLE : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[styles.conditionText, themed.conditionText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {conditionSummary}
            </Text>
          </View>
        ) : null}

        {hasMore ? (
          <Text style={[styles.noticeText, themed.noticeText]}>
            下にスクロールして続きを読み込み
          </Text>
        ) : null}
      </View>

      {/* リスト */}
      {errorMsg ? <Text style={styles.error}>取得エラー: {errorMsg}</Text> : null}

      {loading && rows.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator
            size="small"
            color={isDark ? colors.TEXT_ON_LIGHT : undefined}
          />
        </View>
      ) : (
        <FlatList
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
                            : "#374151"
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
                              : "#374151"
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
                    style={[styles.deleteBtn, themed.deleteBtn]}
                    activeOpacity={0.85}
                    disabled={updatingId === item.id || deletingId === item.id}
                  >
                    {deletingId === item.id ? (
                      <ActivityIndicator
                        size="small"
                        color={isDark ? colors.TEXT_ON_LIGHT : "#B91C1C"}
                      />
                    ) : (
                      <View style={styles.secretBtnInner}>
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color={"#B91C1C"}
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
            </View>
          )}
          ListEmptyComponent={
            !errorMsg ? (
              <Text
                style={[
                  { padding: 16, color: "#666" },
                  isDark && themed.listEmptyText,
                ]}
              >
                {emptyText}
              </Text>
            ) : null
          }
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 18 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 10,
  },
  backText: {
    marginLeft: 2,
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 8,
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 6,
    color: "#111827",
  },
  searchIcon: { marginHorizontal: 6 },

  filterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginLeft: 8,
    backgroundColor: "#F3F4F6",
  },
  filterBtnOn: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  filterText: { fontSize: 12, color: "#374151" },
  filterTextOn: { color: "#fff", fontWeight: "700" },

  orderRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
  orderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginLeft: 8,
    backgroundColor: "#F3F4F6",
  },
  orderBtnOn: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  orderText: { fontSize: 12, color: "#374151" },
  orderTextOn: { color: "#fff", fontWeight: "700" },

  noticeText: { marginTop: 6, fontSize: 12, color: "#6B7280" },

  conditionBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  conditionText: { flex: 1, fontSize: 12, color: "#6B7280" },

  error: { padding: 12, color: "#B91C1C" },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowActions: { flexDirection: "row", alignItems: "center" },
  secretBtnSpacer: { marginRight: 8 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  deleteText: {
    fontSize: 12,
    color: "#B91C1C",
    fontWeight: "700",
  },
  secretBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  secretBtnOn: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  secretBtnInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  secretText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "700",
  },
  secretTextOn: {
    color: "#FFFFFF",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  date: { fontWeight: "700", marginBottom: 4, color: "#111827" },
  emotions: { color: "#374151" },
  memoBlock: { marginTop: 6 },
  memoLabel: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  memo: { color: "#6B7280", marginTop: 4, fontStyle: "italic" },
});
