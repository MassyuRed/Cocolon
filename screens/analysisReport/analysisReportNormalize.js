import {
  EMOTIONS,
  SELF_INSIGHT_LABELS,
  STRENGTH_SCORE,
  TIME_BUCKET_ORDER,
  coerceNum,
  emotionLabelJa,
  mapKey,
} from "./analysisReportFormatters";

export function normalizeEmotionMap(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    joy: coerceNum(src.joy),
    sadness: coerceNum(src.sadness),
    anxiety: coerceNum(src.anxiety),
    anger: coerceNum(src.anger),
    calm: coerceNum(src.calm) + coerceNum(src.peace),
  };
}

export function computeDominantKey(weightedCounts) {
  const counts = normalizeEmotionMap(weightedCounts);
  let dominantKey = null;
  let maxVal = 0;
  EMOTIONS.forEach((emotion) => {
    const v = coerceNum(counts[emotion.key]);
    if (v > maxVal) {
      maxVal = v;
      dominantKey = v > 0 ? emotion.key : null;
    }
  });
  return dominantKey;
}

export function normalizeTimeBucketRows(raw) {
  if (!Array.isArray(raw)) return [];

  const normalized = TIME_BUCKET_ORDER.map((bucket) => ({
    bucket,
    label: bucket,
    inputCount: 0,
    weightedTotal: 0,
    counts: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    weightedCounts: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    sharePct: { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 },
    dominantKey: null,
  }));

  raw.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const bucketKey = String(item.bucket || item.label || item.bucketKey || "").trim();
    const idx = TIME_BUCKET_ORDER.indexOf(bucketKey);
    if (idx === -1) return;

    const counts = normalizeEmotionMap(item.counts);
    const weightedCounts = normalizeEmotionMap(item.weightedCounts || item.weighted_counts);
    const sharePctRaw = normalizeEmotionMap(item.sharePct || item.share_pct);
    const weightedTotalRaw = coerceNum(item.weightedTotal ?? item.weighted_total);
    const weightedTotal =
      weightedTotalRaw > 0
        ? weightedTotalRaw
        : Object.values(weightedCounts).reduce((sum, value) => sum + coerceNum(value), 0);

    let sharePct = sharePctRaw;
    const hasSharePct = Object.values(sharePctRaw).some((value) => coerceNum(value) > 0);
    if (!hasSharePct && weightedTotal > 0) {
      sharePct = EMOTIONS.reduce((acc, emotion) => {
        acc[emotion.key] = Math.round((coerceNum(weightedCounts[emotion.key]) / weightedTotal) * 100);
        return acc;
      }, {});
    }

    const dominantKey =
      mapKey(item.dominantKey || item.dominant_key || item.dominant) ||
      computeDominantKey(weightedCounts);

    normalized[idx] = {
      bucket: bucketKey,
      label: String(item.label || bucketKey),
      inputCount: coerceNum(item.inputCount ?? item.input_count),
      weightedTotal,
      counts,
      weightedCounts,
      sharePct: normalizeEmotionMap(sharePct),
      dominantKey: dominantKey || null,
    };
  });

  return normalized;
}

export function extractStandardTimeBuckets(contentJson, standardReport) {
  const candidates = [
    standardReport?.features?.timeBuckets,
    standardReport?.features?.time_buckets,
    standardReport?.timeBuckets,
    standardReport?.time_buckets,
    contentJson?.timeBuckets,
    contentJson?.time_buckets,
    contentJson?.metrics?.timeBuckets,
    contentJson?.metrics?.time_buckets,
  ];

  for (const candidate of candidates) {
    const rows = normalizeTimeBucketRows(candidate);
    if (rows.length > 0) return rows;
  }
  return [];
}

export function normalizeDeepTransitionEdges(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const fromLabelJa = String(item.fromLabelJa || item.from_label_ja || emotionLabelJa(item.fromLabel || item.from_label) || "");
      const toLabelJa = String(item.toLabelJa || item.to_label_ja || emotionLabelJa(item.toLabel || item.to_label) || "");
      const routeLabel =
        String(item.routeLabel || item.route_label || "").trim() ||
        (fromLabelJa && toLabelJa ? `${fromLabelJa} → ${toLabelJa}` : "");
      return {
        routeLabel,
        count: coerceNum(item.count),
        share: coerceNum(item.share),
        meanMinutes: coerceNum(item.meanMinutes ?? item.mean_minutes),
        dominantTimeBuckets: Array.isArray(item.dominantTimeBuckets || item.dominant_time_buckets)
          ? (item.dominantTimeBuckets || item.dominant_time_buckets)
          : [],
      };
    })
    .filter((item) => item.routeLabel)
    .sort((a, b) => b.count - a.count);
}

export function normalizeDeepRecoveryRows(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const fromLabelJa = String(item.fromLabelJa || item.from_label_ja || emotionLabelJa(item.fromLabel || item.from_label) || "");
      const toLabelJa = String(item.toLabelJa || item.to_label_ja || emotionLabelJa(item.toLabel || item.to_label) || "");
      const routeLabel =
        String(item.routeLabel || item.route_label || "").trim() ||
        (fromLabelJa && toLabelJa ? `${fromLabelJa} → ${toLabelJa}` : "");
      return {
        routeLabel,
        count: coerceNum(item.count),
        meanMinutes: coerceNum(item.meanMinutes ?? item.mean_minutes),
        medianMinutes: coerceNum(item.medianMinutes ?? item.median_minutes),
      };
    })
    .filter((item) => item.routeLabel)
    .sort((a, b) => {
      if (a.meanMinutes === b.meanMinutes) return b.count - a.count;
      return a.meanMinutes - b.meanMinutes;
    });
}

export function normalizeControlPatterns(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      patternId: String(item.patternId || item.pattern_id || item.label || "pattern"),
      label: String(item.label || "制御傾向"),
      description: String(item.description || "").trim(),
      routes: Array.isArray(item.transitionRouteLabels || item.transition_route_labels)
        ? (item.transitionRouteLabels || item.transition_route_labels)
        : [],
      memoTriggers: Array.isArray(item.memoTriggers || item.memo_triggers)
        ? (item.memoTriggers || item.memo_triggers)
        : [],
    }))
    .slice(0, 5);
}

export function normalizeMemoThemes(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      themeId: String(item.themeId || item.theme_id || item.themeLabel || "theme"),
      themeHint: String(item.themeHint || item.theme_hint || "generic"),
      themeLabel: String(item.themeLabel || item.theme_label || "前に出ていた言葉"),
      phraseSamples: Array.isArray(item.phraseSamples || item.phrase_samples)
        ? (item.phraseSamples || item.phrase_samples)
        : [],
      linkedRouteLabels: Array.isArray(item.linkedRouteLabels || item.linked_route_labels)
        ? (item.linkedRouteLabels || item.linked_route_labels)
        : [],
      meaningComment: String(item.meaningComment || item.meaning_comment || "").trim(),
      dominantTimeBuckets: Array.isArray(item.dominantTimeBuckets || item.dominant_time_buckets)
        ? (item.dominantTimeBuckets || item.dominant_time_buckets)
        : [],
      count: coerceNum(item.count),
    }))
    .slice(0, 3);
}

export function normalizePatternEpisodes(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      patternId: String(item.patternId || item.pattern_id || "pattern"),
      linkedThemeIds: Array.isArray(item.linkedThemeIds || item.linked_theme_ids)
        ? (item.linkedThemeIds || item.linked_theme_ids)
        : [],
      routeLabels: Array.isArray(item.routeLabels || item.route_labels)
        ? (item.routeLabels || item.route_labels)
        : [],
      recoveryRouteLabel: String(item.recoveryRouteLabel || item.recovery_route_label || "").trim(),
      patternLabel: String(item.patternLabel || item.pattern_label || item.label || "くり返しやすかった流れ").trim(),
      patternComment: String(item.patternComment || item.pattern_comment || item.description || "").trim(),
      count: coerceNum(item.count),
    }))
    .slice(0, 5);
}

const MONTHLY_PHASE_RANK = {
  first_half: 0,
  second_half: 1,
};

export function normalizeMonthlyPhaseItems(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const phaseId = String(item.phaseId || item.phase_id || "").trim();
      const phaseLabel = String(
        item.phaseLabel ||
          item.phase_label ||
          (phaseId === "first_half"
            ? "前半"
            : phaseId === "second_half"
            ? "後半"
            : "この時期")
      ).trim();

      const themeLabels = Array.isArray(item.themeLabels || item.theme_labels)
        ? (item.themeLabels || item.theme_labels)
        : [];
      const phraseSamples = Array.isArray(item.phraseSamples || item.phrase_samples)
        ? (item.phraseSamples || item.phrase_samples)
        : [];
      const routeLabels = Array.isArray(item.routeLabels || item.route_labels)
        ? (item.routeLabels || item.route_labels)
        : [];
      const dominantTimeBucketLabels = Array.isArray(
        item.dominantTimeBucketLabels || item.dominant_time_bucket_labels
      )
        ? (item.dominantTimeBucketLabels || item.dominant_time_bucket_labels)
        : Array.isArray(item.dominantTimeBuckets || item.dominant_time_buckets)
        ? (item.dominantTimeBuckets || item.dominant_time_buckets)
        : [];

      const recoveryRouteLabel = String(
        item.recoveryRouteLabel || item.recovery_route_label || ""
      ).trim();

      const phaseComment = String(
        item.phaseComment || item.phase_comment || ""
      ).trim();

      const phaseFocusLabel = String(
        item.phaseFocusLabel ||
          item.phase_focus_label ||
          themeLabels[0] ||
          routeLabels[0] ||
          ""
      ).trim();

      const count = coerceNum(item.count ?? item.entryCount ?? item.entry_count);

      return {
        phaseId: phaseId || phaseLabel || "phase",
        phaseLabel: phaseLabel || "この時期",
        phaseFocusLabel,
        themeLabels: themeLabels.filter(Boolean).slice(0, 2),
        phraseSamples: phraseSamples.filter(Boolean).slice(0, 2),
        routeLabels: routeLabels.filter(Boolean).slice(0, 2),
        recoveryRouteLabel,
        dominantTimeBucketLabels: dominantTimeBucketLabels.filter(Boolean).slice(0, 2),
        phaseComment,
        count,
      };
    })
    .filter(
      (item) =>
        item.phaseLabel &&
        (item.phaseComment ||
          item.themeLabels.length > 0 ||
          item.phraseSamples.length > 0 ||
          item.routeLabels.length > 0 ||
          item.recoveryRouteLabel)
    )
    .sort((a, b) => {
      const ar = MONTHLY_PHASE_RANK[a.phaseId] ?? 99;
      const br = MONTHLY_PHASE_RANK[b.phaseId] ?? 99;
      return ar - br;
    })
    .slice(0, 2);
}

export function normalizeMonthlyShiftItems(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      shiftId: String(item.shiftId || item.shift_id || "shift").trim(),
      fromPhaseLabel: String(
        item.fromPhaseLabel || item.from_phase_label || "前半"
      ).trim(),
      toPhaseLabel: String(
        item.toPhaseLabel || item.to_phase_label || "後半"
      ).trim(),
      shiftLabel: String(item.shiftLabel || item.shift_label || "").trim(),
      shiftComment: String(item.shiftComment || item.shift_comment || "").trim(),
      emergingThemeLabels: Array.isArray(item.emergingThemeLabels || item.emerging_theme_labels)
        ? (item.emergingThemeLabels || item.emerging_theme_labels).filter(Boolean).slice(0, 2)
        : [],
      settlingThemeLabels: Array.isArray(item.settlingThemeLabels || item.settling_theme_labels)
        ? (item.settlingThemeLabels || item.settling_theme_labels).filter(Boolean).slice(0, 2)
        : [],
      emergingRouteLabels: Array.isArray(item.emergingRouteLabels || item.emerging_route_labels)
        ? (item.emergingRouteLabels || item.emerging_route_labels).filter(Boolean).slice(0, 2)
        : [],
      settlingRouteLabels: Array.isArray(item.settlingRouteLabels || item.settling_route_labels)
        ? (item.settlingRouteLabels || item.settling_route_labels).filter(Boolean).slice(0, 2)
        : [],
      fromRecoveryRouteLabel: String(
        item.fromRecoveryRouteLabel || item.from_recovery_route_label || ""
      ).trim(),
      toRecoveryRouteLabel: String(
        item.toRecoveryRouteLabel || item.to_recovery_route_label || ""
      ).trim(),
    }))
    .filter(
      (item) =>
        item.shiftLabel ||
        item.shiftComment ||
        item.emergingThemeLabels.length > 0 ||
        item.settlingThemeLabels.length > 0 ||
        item.emergingRouteLabels.length > 0 ||
        item.settlingRouteLabels.length > 0
    )
    .slice(0, 1);
}

export function extractStructuralReport(contentJson) {
  const structural = contentJson?.deepReport || contentJson?.structural_report;
  return structural && typeof structural === "object" ? structural : null;
}

export function getTopEmotionPairs(sharePct, limit = 2) {
  const src = normalizeEmotionMap(sharePct);
  return EMOTIONS.map((emotion) => ({
    key: emotion.key,
    label: emotion.label,
    pct: coerceNum(src[emotion.key]),
  }))
    .filter((item) => item.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit);
}

export function buildDaysFromRows(rows) {
  const map = {};

  for (const row of rows || []) {
    const d = new Date(row.created_at);
    const y = d.getFullYear();
    const m = d.getMonth();
    const day = d.getDate();
    const dateKey = `${y}-${String(m + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const label = `${m + 1}/${day}`;

    if (!map[dateKey]) {
      map[dateKey] = {
        dateKey,
        label,
        date: new Date(y, m, day, 0, 0, 0, 0),
        joy: 0,
        sadness: 0,
        anxiety: 0,
        anger: 0,
        calm: 0,
        dominantKey: null,
      };
    }

    const bucket = map[dateKey];

    const details = Array.isArray(row.emotion_details)
      ? row.emotion_details
      : Array.isArray(row.emotions)
      ? row.emotions.map((t) => ({ type: t, strength: "medium" }))
      : [];

    for (const it of details) {
      if (SELF_INSIGHT_LABELS.has(String(it?.type || "").trim())) continue;
      const k = mapKey(it?.type);
      if (!k) continue;
      const w = STRENGTH_SCORE[it?.strength] || 0;
      bucket[k] += w;
    }
  }

  const buckets = Object.values(map).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // 支配的感情キー
  for (const b of buckets) {
    let domKey = null;
    let maxVal = 0;
    EMOTIONS.forEach((e) => {
      const v = b[e.key];
      if (v > maxVal) {
        maxVal = v;
        domKey = v > 0 ? e.key : null;
      }
    });
    b.dominantKey = domKey;
  }

  return buckets;
}
