import { EMOTIONS, coerceNum, safeParseJson } from "./analysisReportFormatters";

export const KOKORO_WEATHER_VERSION = "kokoro.weather.v1";

export const WEATHER_LABELS = Object.freeze({
  clear: "ひらけ気味",
  partly_cloudy: "うすぐもり",
  cloudy: "くもり",
  soft_rain: "しっとり",
  windy: "風あり",
  mixed: "変化多め",
  unknown: "観測少なめ",
});

export const WEATHER_ICONS = Object.freeze({
  clear: "sunny-outline",
  partly_cloudy: "partly-sunny-outline",
  cloudy: "cloud-outline",
  soft_rain: "rainy-outline",
  windy: "navigate-outline",
  mixed: "swap-horizontal-outline",
  unknown: "ellipse-outline",
});

const EMOTION_LABELS = Object.freeze(
  EMOTIONS.reduce((acc, emotion) => {
    acc[emotion.key] = emotion.label;
    return acc;
  }, {})
);

const REPORT_LABELS = Object.freeze({
  daily: "こころ天気（日）",
  weekly: "こころ天気（週）",
  monthly: "こころ天気（月）",
});

const KOKORO_WEATHER_VERSION_KEYS = Object.freeze([
  "kokoro_weather_version",
  "kokoro_weather_legacy_version",
  "standard_kokoro_weather_version",
  "standard_report_kokoro_weather_version",
]);

const ANALYSIS_REPORT_TYPES = Object.freeze(["daily", "weekly", "monthly"]);

function hasKokoroWeatherVersionAlias(source) {
  const raw = asObject(source);
  return KOKORO_WEATHER_VERSION_KEYS.some(
    (key) => asString(raw[key], "") === KOKORO_WEATHER_VERSION
  );
}

function hasDisplayableKokoroWeatherPayload(payload) {
  const raw = asObject(payload);
  if (asString(raw.version, "") !== KOKORO_WEATHER_VERSION) return false;
  const items = asArray(raw.items);
  const summary = asObject(raw.summary);
  return items.length > 0 || Object.keys(summary).length > 0;
}

export function extractKokoroWeatherPayloadFromContentJson(contentJsonLike) {
  const contentJson = asObject(safeParseJson(contentJsonLike));
  const direct = contentJson.kokoroWeather || contentJson.kokoro_weather;
  if (direct && typeof direct === "object" && !Array.isArray(direct)) return direct;

  const standard = contentJson.standardReport || contentJson.standard_report;
  if (standard && typeof standard === "object" && !Array.isArray(standard)) {
    const nested = standard.kokoroWeather || standard.kokoro_weather;
    if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested;
  }

  return null;
}

export function isKokoroWeatherReportRecord(report) {
  if (!report || typeof report !== "object" || Array.isArray(report)) return false;

  const type = asString(report.report_type || report.reportType, "").toLowerCase();
  if (type && !ANALYSIS_REPORT_TYPES.includes(type)) return false;

  if (hasKokoroWeatherVersionAlias(report)) return true;

  const contentJsonPresent = Object.prototype.hasOwnProperty.call(report, "content_json") ||
    Object.prototype.hasOwnProperty.call(report, "contentJson");
  const contentJson = report.content_json ?? report.contentJson;
  if (!contentJsonPresent) return false;

  const payload = extractKokoroWeatherPayloadFromContentJson(contentJson);
  return hasDisplayableKokoroWeatherPayload(payload);
}

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asString(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function asNumber(value, fallback = null) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function pickNumber(source, keys, fallback = null) {
  const raw = asObject(source);
  for (const key of keys) {
    if (raw[key] != null) {
      const n = asNumber(raw[key], null);
      if (n != null) return n;
    }
  }
  return fallback;
}

function normalizeKey(value) {
  const key = asString(value, "unknown");
  return WEATHER_LABELS[key] ? key : "unknown";
}

export function formatKokoroTemperature(value, fallbackDisplay = "") {
  if (value === undefined || value === null || value === "") return fallbackDisplay || "—";
  if (typeof value === "string") {
    const text = value.trim().replace(/℃/g, "°");
    if (!text) return fallbackDisplay || "—";
    if (text.endsWith("°")) return text;
    const numeric = Number(text.replace("°", ""));
    if (Number.isFinite(numeric)) return `${Math.round(numeric * 10) / 10}°`;
    return text;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return fallbackDisplay || "—";
  return `${Math.round(n * 10) / 10}°`;
}

export function resolveWeatherVisual(weatherKey, labelFallback = "") {
  const key = normalizeKey(weatherKey);
  return {
    key,
    label: labelFallback || WEATHER_LABELS[key] || WEATHER_LABELS.unknown,
    iconName: WEATHER_ICONS[key] || WEATHER_ICONS.unknown,
  };
}

export function resolveKokoroWeatherIconName(weatherKey) {
  return resolveWeatherVisual(weatherKey).iconName;
}

export function resolveKokoroWeatherLabel(itemLike) {
  const raw = asObject(itemLike);
  const weather = asObject(raw.weather);
  const key = raw.weatherKey || raw.weather_key || weather.key;
  const label = raw.weatherLabel || raw.weather_label || weather.label;
  return resolveWeatherVisual(key, asString(label, "")).label;
}

export function normalizeEmotionSharePct(rawShare) {
  const raw = asObject(rawShare);
  const out = {};
  for (const emotion of EMOTIONS) {
    out[emotion.key] = Math.max(0, Math.min(100, Math.round(coerceNum(raw[emotion.key]))));
  }
  return out;
}

export function getTopKokoroEmotionPairs(rawSharePct, limit = 2) {
  const share = normalizeEmotionSharePct(rawSharePct);
  return EMOTIONS.map((emotion) => ({
    key: emotion.key,
    label: emotion.label,
    value: share[emotion.key] || 0,
    sharePct: share[emotion.key] || 0,
  }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.max(1, Number(limit) || 2));
}

export function buildEmotionShareText(rawSharePct, limit = 2) {
  const pairs = getTopKokoroEmotionPairs(rawSharePct, limit);
  return pairs.map((pair) => `${pair.label}${pair.value}%`).join(" / ");
}

export function normalizeObservationMemo(rawMemo) {
  const raw = asObject(rawMemo);
  const visible = Boolean(raw.visible);
  return {
    visible,
    label: asString(raw.label, visible ? "観測メモあり" : ""),
    detail: asString(raw.detail || raw.text || raw.message, ""),
  };
}

function normalizeDominant(rawDominant, sharePct) {
  const raw = asObject(rawDominant);
  const top = getTopKokoroEmotionPairs(sharePct, 1)[0] || null;
  const key = asString(raw.key, top?.key || "");
  const label = asString(raw.label, key ? EMOTION_LABELS[key] || key : top?.label || "");
  const share = Math.max(0, Math.min(100, Math.round(coerceNum(raw.share_pct ?? raw.sharePct ?? top?.value ?? 0))));
  return { key, label, sharePct: share, value: share };
}

function normalizeTemperature(source) {
  const raw = asObject(source);
  const nested = asObject(raw.temperature);
  const current = pickNumber(nested, ["current", "value", "temperature"], null) ?? pickNumber(raw, ["temperature_current", "temperatureCurrent", "temperature"], null);
  const high = pickNumber(nested, ["high", "temperature_high", "temperatureHigh"], null) ?? pickNumber(raw, ["temperature_high", "temperatureHigh"], null);
  const low = pickNumber(nested, ["low", "temperature_low", "temperatureLow"], null) ?? pickNumber(raw, ["temperature_low", "temperatureLow"], null);
  return {
    current,
    high,
    low,
    display: asString(nested.display || raw.temperature_display || raw.temperatureDisplay, formatKokoroTemperature(current ?? high, "—")),
    highDisplay: asString(nested.high_display || nested.highDisplay || raw.temperature_high_display || raw.temperatureHighDisplay, formatKokoroTemperature(high, "—")),
    lowDisplay: asString(nested.low_display || nested.lowDisplay || raw.temperature_low_display || raw.temperatureLowDisplay, formatKokoroTemperature(low, "—")),
  };
}

function normalizeWeatherLike(raw, fallbackKind, index) {
  const source = asObject(raw);
  const share = normalizeEmotionSharePct(source.emotion_share_pct || source.emotionSharePct || source.sharePct || source.share || source.emotions || {});
  const weather = asObject(source.weather);
  const visual = resolveWeatherVisual(source.weather_key || source.weatherKey || weather.key, asString(source.weather_label || source.weatherLabel || weather.label, ""));
  const temperature = normalizeTemperature(source);
  const label = asString(source.label || source.date_label || source.week_label || source.bucket_label || source.bucketLabel, `${fallbackKind}${Number(index) + 1}`);
  return {
    id: asString(source.id || source.key || source.date_key || source.dateKey || source.week_key || source.weekKey || source.bucket_key || source.bucketKey, `${fallbackKind}-${index}`),
    kind: asString(source.kind, fallbackKind),
    key: asString(source.key || source.date_key || source.dateKey || source.bucket_key || source.bucketKey, `${fallbackKind}-${index}`),
    dateKey: asString(source.date_key || source.dateKey, ""),
    bucketKey: asString(source.bucket_key || source.bucketKey || source.bucket || source.key, ""),
    label,
    weatherKey: visual.key,
    weatherLabel: visual.label,
    iconName: visual.iconName,
    temperature,
    temperatureDisplay: temperature.display,
    temperatureHighDisplay: temperature.highDisplay,
    temperatureLowDisplay: temperature.lowDisplay,
    emotionSharePct: share,
    dominantEmotion: normalizeDominant(source.dominant_emotion || source.dominantEmotion, share),
    inputCount: Math.max(0, Math.round(coerceNum(source.input_count ?? source.inputCount ?? source.count))),
    observationMemo: normalizeObservationMemo(source.observation_memo || source.observationMemo),
    raw: source,
  };
}

export function normalizeKokoroWeatherTimeBucket(raw, index = 0) {
  return normalizeWeatherLike(raw, "time_bucket", index);
}

export function normalizeKokoroWeatherItem(raw, index = 0) {
  const item = normalizeWeatherLike(raw, asObject(raw).date_key || asObject(raw).dateKey ? "day" : asObject(raw).kind || "period", index);
  const source = asObject(raw);
  item.timeBuckets = asArray(source.time_buckets || source.timeBuckets).map((bucket, bucketIndex) => normalizeKokoroWeatherTimeBucket(bucket, bucketIndex));
  return item;
}

export function normalizeWeatherItem(raw, index = 0) {
  return normalizeKokoroWeatherItem(raw, index);
}

export function normalizeKokoroWeatherSummary(rawSummary) {
  return normalizeWeatherLike(rawSummary, "summary", 0);
}

export function normalizeKokoroWeatherPayload(raw, fallbackReportType = "") {
  const source = asObject(raw);
  if (!Object.keys(source).length) return null;
  const reportType = asString(source.report_type || source.reportType, fallbackReportType);
  return {
    version: asString(source.version, KOKORO_WEATHER_VERSION),
    status: asString(source.status, "ok"),
    reportType,
    periodLabel: asString(source.period_label || source.periodLabel, ""),
    summary: normalizeKokoroWeatherSummary(source.summary || {}),
    items: asArray(source.items).map((item, index) => normalizeKokoroWeatherItem(item, index)),
    timeBuckets: asArray(source.time_buckets || source.timeBuckets).map((bucket, index) => normalizeKokoroWeatherTimeBucket(bucket, index)),
    raw: source,
  };
}

export const normalizeKokoroWeather = normalizeKokoroWeatherPayload;

export function getKokoroWeatherItems(kokoroWeather) {
  const weather = kokoroWeather?.raw ? kokoroWeather : normalizeKokoroWeather(kokoroWeather);
  if (!weather) return [];
  if (Array.isArray(weather.items) && weather.items.length > 0) return weather.items;
  if (Array.isArray(weather.timeBuckets) && weather.timeBuckets.length > 0) return weather.timeBuckets;
  return [];
}

export function getKokoroWeatherDetailBuckets(itemLike) {
  const item = itemLike?.raw ? itemLike : normalizeKokoroWeatherItem(itemLike || {});
  if (Array.isArray(item?.timeBuckets) && item.timeBuckets.length > 0) return item.timeBuckets;
  return item ? [item] : [];
}

export function isKokoroWeatherRenderable(kokoroWeather) {
  const weather = kokoroWeather?.raw ? kokoroWeather : normalizeKokoroWeather(kokoroWeather);
  if (!weather || weather.status === "no_observation") return false;
  if (getKokoroWeatherItems(weather).length > 0) return true;
  if (weather.summary?.inputCount > 0) return true;
  return Boolean(weather.summary?.temperatureDisplay && weather.summary.temperatureDisplay !== "—");
}

export function formatDominantEmotion(dominantEmotion) {
  const dom = asObject(dominantEmotion);
  const label = asString(dom.label || EMOTION_LABELS[dom.key], "");
  const share = Math.round(coerceNum(dom.sharePct ?? dom.share_pct ?? dom.value));
  if (!label) return "";
  return share > 0 ? `${label}${share}%` : label;
}

export const formatKokoroDominantEmotion = formatDominantEmotion;

export function getKokoroWeatherReportLabel(reportType) {
  return REPORT_LABELS[asString(reportType, "")] || "こころ天気";
}

export function buildKokoroWeatherDetailTitle(item, reportType = "") {
  const normalized = item?.raw ? item : normalizeKokoroWeatherItem(item || {});
  const label = asString(normalized?.label, "この期間");
  if (String(reportType || "") === "daily") return `${label} のこころ天気`;
  return `${label} のこころ天気`;
}
