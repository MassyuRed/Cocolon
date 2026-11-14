import { useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../AuthContext";
import { useOwnerRequestScope } from "../../hooks/useOwnerRequestScope";
import { apiGet } from "../../lib/apiClient";
import { ANALYSIS_WIRE } from "../../lib/compat/legacyWireContracts";

const EMOTIONS = ["joy", "sadness", "anger", "anxiety", "calm"];
const isDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isCount = value => Number.isInteger(value) && value >= 0;
function isAggregate(item) {
  return item && isCount(item.input_count) && typeof item.description === "string" &&
    ["ok", "no_observation", "future", "outside_history"].includes(item.status) &&
    EMOTIONS.every(key => isCount(item.emotion_weights?.[key]) && isCount(item.emotion_share_pct?.[key]) && item.emotion_share_pct[key] <= 100) &&
    EMOTIONS.reduce((sum, key) => sum + item.emotion_share_pct[key], 0) === (item.input_count ? 100 : 0);
}
function isWeather(data, period) {
  return data?.version === "kokoro.weather.live.v1" && data.period === period &&
    isDate(data.start_date) && isDate(data.end_date) &&
    [data.previous_anchor, data.next_anchor].every(value => value === null || isDate(value)) &&
    isAggregate(data.summary) && isCount(data.summary.recorded_days) &&
    Array.isArray(data.items) && data.items.length >= 1 && data.items.length <= 31 &&
    data.items.every(item => isAggregate(item) && isDate(item.date)) &&
    Array.isArray(data.time_buckets) && (period !== "today" || data.time_buckets.length === 4) &&
    data.time_buckets.every(item => isAggregate(item) && typeof item.key === "string" && typeof item.label === "string" && typeof item.hours === "string" &&
      Array.isArray(item.records) && item.records.every(record => typeof record.created_at === "string" && !Number.isNaN(Date.parse(record.created_at)) &&
        Array.isArray(record.emotions) && record.emotions.every(emotion => EMOTIONS.includes(emotion.key) && isCount(emotion.weight) && emotion.weight > 0)));
}

export function useKokoroWeather(period, anchor, refreshRevision = 0) {
  const { user, authOwnerGeneration } = useAuth();
  const { scope, isCurrent } = useOwnerRequestScope(user?.id, authOwnerGeneration);
  const focused = useIsFocused();
  const sequence = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const key = `${period}:${anchor || "current"}`;
  const [day, setDay] = useState(() => new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10));
  useEffect(() => {
    // Refresh at JST midnight even if this screen stays open overnight.
    const nextMidnight = Date.parse(`${day}T00:00:00+09:00`) + 86400000;
    const timer = setTimeout(() => setDay(new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10)), Math.max(1000, nextMidnight - Date.now()));
    return () => clearTimeout(timer);
  }, [day]);
  useEffect(() => {
    const currentSequence = ++sequence.current;
    let disposed = false;
    const fresh = () => !disposed && sequence.current === currentSequence && isCurrent(scope);
    if (!focused || !isCurrent(scope)) return undefined;
    // A previous successful response must not mask a failed refresh or deletion.
    setResult({ scope, key, loading: true, data: null, error: false });
    (async () => {
      try {
        const query = `?period=${encodeURIComponent(period)}${anchor ? `&anchor=${encodeURIComponent(anchor)}` : ""}`;
        const data = await apiGet(`${ANALYSIS_WIRE.routes.kokoroWeather}${query}`, scope.options);
        if (!fresh()) return;
        if (!isWeather(data, period)) {
          throw new Error("Invalid weather response");
        }
        setResult({ scope, key, loading: false, data, error: false });
      } catch {
        if (fresh()) setResult({ scope, key, loading: false, data: null, error: true });
      }
    })();
    return () => { disposed = true; };
  }, [scope, isCurrent, focused, period, anchor, key, attempt, refreshRevision, day]);
  const visible = result?.scope === scope && result?.key === key && isCurrent(scope) ? result : null;
  return {
    data: visible?.data || null,
    loading: !!user?.id && (!visible || visible.loading),
    error: !!visible?.error,
    retry: useCallback(() => setAttempt(value => value + 1), []),
  };
}
