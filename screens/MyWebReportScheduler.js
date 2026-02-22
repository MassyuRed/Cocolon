// MyWebReportScheduler.js
// ------------------------------------------------------------
// MyWeb「感情構造分析レポート」配布スケジューラ（JST固定）
//
// ✅ 目的
// - 日報: 毎日 00:00（日本時間）
// - 週報: 毎週 日曜 00:00（日本時間）
// - 月報: 毎月 1日 00:00（日本時間）
//
// ✅ 実装方針
// - 「その時刻に配布されているべき最新の“履歴レポート”」が存在しなければ生成して保存（upsert）
// - 日本時間は JST(UTC+9) 固定として計算（端末のタイムゾーンに依存しない）
// - アプリが起動している/復帰したタイミングで生成（※アプリ完全終了中に“厳密に0時に実行”は不可）
//
// 注意:
// - アプリが完全に閉じている間も厳密に0時に配布したい場合は、
//   サーバー側のCron（Supabase Scheduled Functions / Edge Functions など）で生成するのが確実。

import { AppState } from "react-native";
import { supabase } from "../lib/supabase";
import { getCurrentUserId } from "../lib/user";

// MyWebCrossLinkSection 側のユーティリティを流用（存在する前提）
// ※もし未導入の場合でも壊れないように try/catch で利用する
import {
  buildSelfStructureTopics,
  formatCrossTopicsText,
} from "./MyWebCrossLinkSection";

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

const EMOTIONS = [
  { key: "joy", label: "喜び" },
  { key: "sadness", label: "悲しみ" },
  { key: "anxiety", label: "不安" },
  { key: "anger", label: "怒り" },
  { key: "calm", label: "平穏" },
];

const EMO_LABEL = EMOTIONS.reduce((acc, e) => {
  acc[e.key] = e.label;
  return acc;
}, {});

const JP_TO_KEY = {
  喜び: "joy",
  悲しみ: "sadness",
  不安: "anxiety",
  怒り: "anger",
  平穏: "calm",
};

function mapKey(jp) {
  if (!jp) return null;
  return JP_TO_KEY[jp] || null;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/**
 * UTC ms を JST の “表示用” に変換してフォーマット（端末TZ非依存）
 */
export function formatJstDateTime(utcMs) {
  try {
    const d = new Date(Number(utcMs) + JST_OFFSET_MS);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const hh = d.getUTCHours();
    const mm = d.getUTCMinutes();
    return `${y}/${pad2(m)}/${pad2(day)} ${pad2(hh)}:${pad2(mm)}（JST）`;
  } catch {
    return "";
  }
}

export function formatJstDateOnly(utcMs) {
  try {
    const d = new Date(Number(utcMs) + JST_OFFSET_MS);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    return `${y}/${pad2(m)}/${pad2(day)}`;
  } catch {
    return "";
  }
}

function getJstPartsFromUtcMs(utcMs) {
  const d = new Date(Number(utcMs) + JST_OFFSET_MS);
  return {
    y: d.getUTCFullYear(),
    mo: d.getUTCMonth(), // 0-based
    da: d.getUTCDate(),
    dow: d.getUTCDay(), // 0=Sun
    hh: d.getUTCHours(),
    mm: d.getUTCMinutes(),
    ss: d.getUTCSeconds(),
  };
}

function getJstMidnightUtcMs(y, mo0, da) {
  // JST 00:00 を UTC ms に変換（JST=UTC+9 なので -9h）
  return Date.UTC(y, mo0, da, 0, 0, 0, 0) - JST_OFFSET_MS;
}

function getLastDistributionUtcMs(reportType, nowUtcMs = Date.now()) {
  const p = getJstPartsFromUtcMs(nowUtcMs);
  const todayMidnightUtcMs = getJstMidnightUtcMs(p.y, p.mo, p.da);

  if (reportType === "daily") {
    return todayMidnightUtcMs;
  }

  if (reportType === "weekly") {
    // 直近の「日曜 00:00（JST）」
    // JST上で今日が何曜日か(dow)分だけ戻す
    return todayMidnightUtcMs - p.dow * DAY_MS;
  }

  if (reportType === "monthly") {
    // 直近の「当月1日 00:00（JST）」
    return getJstMidnightUtcMs(p.y, p.mo, 1);
  }

  return todayMidnightUtcMs;
}

export function getNextDistributionUtcMs(reportType, nowUtcMs = Date.now()) {
  const last = getLastDistributionUtcMs(reportType, nowUtcMs);

  if (reportType === "daily") return last + DAY_MS;
  if (reportType === "weekly") return last + 7 * DAY_MS;

  if (reportType === "monthly") {
    const p = getJstPartsFromUtcMs(nowUtcMs);
    const y = p.y;
    const mo = p.mo;
    const nextMo = mo === 11 ? 0 : mo + 1;
    const nextY = mo === 11 ? y + 1 : y;
    return getJstMidnightUtcMs(nextY, nextMo, 1);
  }

  return last + DAY_MS;
}

function getTargetPeriod(reportType, nowUtcMs = Date.now()) {
  const distUtcMs = getLastDistributionUtcMs(reportType, nowUtcMs);
  const periodEndUtcMs = distUtcMs - 1; // 直前まで

  if (reportType === "daily") {
    const startUtcMs = distUtcMs - DAY_MS;
    const startIso = new Date(startUtcMs).toISOString();
    const endIso = new Date(periodEndUtcMs).toISOString();

    // 表示用: 対象日 = start のJST日付
    const titleDate = formatJstDateOnly(startUtcMs);
    const title = `日報：${titleDate}（1日分）`;
    return {
      reportType,
      distUtcMs,
      periodStartUtcMs: startUtcMs,
      periodEndUtcMs,
      periodStartISO: startIso,
      periodEndISO: endIso,
      title,
    };
  }

  if (reportType === "weekly") {
    const startUtcMs = distUtcMs - 7 * DAY_MS;
    const startIso = new Date(startUtcMs).toISOString();
    const endIso = new Date(periodEndUtcMs).toISOString();

    const s = new Date(startUtcMs + JST_OFFSET_MS);
    const e = new Date(periodEndUtcMs + JST_OFFSET_MS);
    const titleRange = `${s.getUTCMonth() + 1}/${s.getUTCDate()} ～ ${
      e.getUTCMonth() + 1
    }/${e.getUTCDate()}`;
    const title = `週報：${titleRange}（7日分）`;
    return {
      reportType,
      distUtcMs,
      periodStartUtcMs: startUtcMs,
      periodEndUtcMs,
      periodStartISO: startIso,
      periodEndISO: endIso,
      title,
      titleRange,
    };
  }

  // monthly（28日）
  const startUtcMs = distUtcMs - 28 * DAY_MS;
  const startIso = new Date(startUtcMs).toISOString();
  const endIso = new Date(periodEndUtcMs).toISOString();
  const e = new Date(periodEndUtcMs + JST_OFFSET_MS);
  const titleMonth = `${e.getUTCFullYear()}/${e.getUTCMonth() + 1}`;
  const title = `月報：${titleMonth}（28日分）`;
  return {
    reportType,
    distUtcMs,
    periodStartUtcMs: startUtcMs,
    periodEndUtcMs,
    periodStartISO: startIso,
    periodEndISO: endIso,
    title,
    titleMonth,
  };
}

async function fetchEmotionRows(userId, startIso, endIso) {
  const { data, error } = await supabase
    .from("emotions")
    .select("created_at, emotions, emotion_details")
    .eq("user_id", userId)
    .gte("created_at", startIso)
    .lte("created_at", endIso)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

function normalizeDetails(row) {
  const details = Array.isArray(row?.emotion_details)
    ? row.emotion_details
    : Array.isArray(row?.emotions)
    ? row.emotions.map((t) => ({ type: t, strength: "medium" }))
    : [];
  return details;
}

function buildDaysFromRowsFixed7(rows, periodStartUtcMs) {
  // 7日分、0埋めで作る（JST日境界に一致するよう periodStartUtcMs を基準にする）
  const buckets = Array.from({ length: 7 }).map((_, i) => {
    const utcStartMs = periodStartUtcMs + i * DAY_MS;
    const j = new Date(utcStartMs + JST_OFFSET_MS);
    const y = j.getUTCFullYear();
    const m0 = j.getUTCMonth();
    const da = j.getUTCDate();
    const dateKey = `${y}-${pad2(m0 + 1)}-${pad2(da)}`;
    return {
      dateKey,
      label: `${m0 + 1}/${da}`,
      utcStartMs,
      joy: 0,
      sadness: 0,
      anxiety: 0,
      anger: 0,
      calm: 0,
      dominantKey: null,
    };
  });

  for (const row of rows) {
    const t = new Date(row.created_at).getTime();
    if (Number.isNaN(t)) continue;
    const idx = Math.floor((t - periodStartUtcMs) / DAY_MS);
    if (idx < 0 || idx >= buckets.length) continue;
    const bucket = buckets[idx];

    const details = normalizeDetails(row);
    for (const it of details) {
      const k = mapKey(it.type);
      if (!k) continue;
      const w = STRENGTH_SCORE[it.strength] || 0;
      bucket[k] += w;
    }
  }

  // 支配的感情
  for (const b of buckets) {
    let domKey = null;
    let maxVal = 0;
    for (const e of EMOTIONS) {
      const v = b[e.key];
      if (v > maxVal) {
        maxVal = v;
        domKey = v > 0 ? e.key : null;
      }
    }
    b.dominantKey = domKey;
  }

  return buckets;
}

function buildWeeksFromRowsFixed4(rows, periodStartUtcMs) {
  const buckets = [
    { index: 0, label: "第1週", joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0, total: 0 },
    { index: 1, label: "第2週", joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0, total: 0 },
    { index: 2, label: "第3週", joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0, total: 0 },
    { index: 3, label: "第4週", joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0, total: 0 },
  ];

  for (const row of rows) {
    const t = new Date(row.created_at).getTime();
    if (Number.isNaN(t)) continue;
    const idxRaw = Math.floor((t - periodStartUtcMs) / (7 * DAY_MS));
    const idx = Math.min(3, Math.max(0, idxRaw));
    const bucket = buckets[idx];

    const details = normalizeDetails(row);
    for (const it of details) {
      const k = mapKey(it.type);
      if (!k) continue;
      const w = STRENGTH_SCORE[it.strength] || 0;
      bucket[k] += w;
      bucket.total += w;
    }
  }

  return buckets;
}

function computeWeeklyMetrics(days) {
  const totals = { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 };
  days.forEach((d) => {
    totals.joy += d.joy;
    totals.sadness += d.sadness;
    totals.anxiety += d.anxiety;
    totals.anger += d.anger;
    totals.calm += d.calm;
  });

  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);
  const share = {};
  const sharePct = {};
  if (totalAll > 0) {
    EMOTIONS.forEach((e) => {
      const p = (totals[e.key] || 0) / totalAll;
      share[e.key] = p;
      sharePct[e.key] = Math.round(p * 100);
    });
  } else {
    EMOTIONS.forEach((e) => {
      share[e.key] = 0;
      sharePct[e.key] = 0;
    });
  }

  const top = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  // 感情の切り替わり率
  let changes = 0;
  let prev = null;
  const domSeq = [];

  days.forEach((d) => {
    if (!d.dominantKey) return;
    domSeq.push(d.dominantKey);
    if (prev && prev !== d.dominantKey) changes += 1;
    prev = d.dominantKey;
  });

  const transitions = Math.max(domSeq.length - 1, 0);
  const alternationRate = transitions > 0 ? changes / transitions : 0;

  // 簡易モチーフ（悲しみ→平穏→喜び）
  let motifSCJ = 0;
  for (let i = 0; i + 2 < domSeq.length; i++) {
    if (
      domSeq[i] === "sadness" &&
      domSeq[i + 1] === "calm" &&
      domSeq[i + 2] === "joy"
    ) {
      motifSCJ += 1;
    }
  }
  const motifs = { "sadness-calm-joy": motifSCJ };

  // 1日ごとの総量から揺らぎを測る（標準偏差）
  const dailyTotals = days
    .map((d) => d.joy + d.sadness + d.anxiety + d.anger + d.calm)
    .filter((v) => v > 0);
  let intensityStd = 0;
  if (dailyTotals.length > 1) {
    const mean = dailyTotals.reduce((a, b) => a + b, 0) / dailyTotals.length;
    const variance =
      dailyTotals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
      dailyTotals.length;
    intensityStd = Math.sqrt(variance);
  }

  // エントロピーと Gini-Simpson
  let entropy = 0;
  let giniSimpson = 0;
  if (totalAll > 0) {
    const ps = Object.values(share);
    ps.forEach((p) => {
      if (p > 0) entropy -= p * Math.log(p);
    });
    if (entropy > 0) entropy = entropy / Math.log(EMOTIONS.length);
    else entropy = 0;

    const sumSq = ps.reduce((a, b) => a + b * b, 0);
    giniSimpson = 1 - sumSq;
  }

  return {
    totals,
    totalAll,
    share,
    sharePct,
    top,
    alternationRate,
    motifs,
    intensityStd,
    entropy,
    giniSimpson,
    hasData: totalAll > 0,
  };
}

function buildWeeklyNarrative(metrics) {
  if (!metrics.hasData) {
    return {
      structuralLines: [
        "・今週は感情の入力が記録されていなかったため、まだ構造のリズムを十分には観測できていません。",
        "・観測が始まると、ここに1週間分の感情の動きや揺らぎが、静かに積み重なっていきます。",
      ],
      gentleLines: [
        "・無理に毎日入力しなくても大丈夫です。思い出したときに、印象に残った場面だけ少しメモしてみるところからで十分です。",
      ],
      nextPoints: [
        "来週は「特に印象に残った日」だけでも1〜2件、感情を記録してみると、リズムの輪郭が見えやすくなります。",
      ],
    };
  }

  const structuralLines = [];
  const gentleLines = [];
  const nextPoints = [];

  const top = metrics.top || [];
  const sharePct = metrics.sharePct || {};
  const motifs = metrics.motifs || {};
  const alternationRate = metrics.alternationRate || 0;

  const first = top[0] || [];
  const second = top[1] || [];
  const topKey1 = first[0];
  const topKey2 = second[0];

  if (topKey1) {
    const label1 = EMO_LABEL[topKey1] || topKey1;
    const p1 = sharePct[topKey1] || 0;
    let line = `・今週は「${label1}」が中心で、全体のおおよそ ${p1}% を占めていました。`;
    if (topKey2) {
      const label2 = EMO_LABEL[topKey2] || topKey2;
      const p2 = sharePct[topKey2] || 0;
      line += ` 一方で「${label2}」も ${p2}% ほど現れており、感情の重心は一方向に固定されず、いくらか揺れを含んだ状態でした。`;
    }
    structuralLines.push(line);
  }

  if (alternationRate > 0.6) {
    structuralLines.push(
      "・日ごとの主な感情が切り替わる場面が多く、比較的短い周期でリズムが揺れていました。構造としては、内側でこまめに調整を続けていた週だったように見えます。"
    );
  } else if (alternationRate > 0.3) {
    structuralLines.push(
      "・主な感情はときどき入れ替わりつつも、大きくは似たトーンが続いており、適度な揺らぎを含んだリズムになっていました。"
    );
  } else {
    structuralLines.push(
      "・主な感情の顔ぶれはあまり変わらず、ゆっくりめのリズムで一週間が進んでいました。構造としては、一定の状態を保ちながら様子を見ているような週でした。"
    );
  }

  if ((motifs["sadness-calm-joy"] || 0) > 0) {
    structuralLines.push(
      "・「悲しみ → 平穏 → 喜び」という流れがいくつか観測されており、いったん沈み込んだあとに、少しずつ整え直すような補正ループが働いていました。"
    );
  }

  gentleLines.push(
    "・どの感情が多かったとしても、それは今のあなたの構造が「こう感じ取っている」という情報であって、良い・悪いを決めるラベルではありません。"
  );
  gentleLines.push(
    "・もししんどさや揺らぎを感じていたとしても、それに気づいて記録できている時点で、すでに一つの自己保護の動きが始まっています。"
  );

  if (topKey1 === "sadness" || topKey1 === "anxiety") {
    nextPoints.push(
      "似たトーンが続きそうなときは、少しでも「安心した」「ほっとした」瞬間があれば、その場面だけメモしておくと、平穏側の動きも見えやすくなります。"
    );
  } else if (topKey1 === "joy" || topKey1 === "calm") {
    nextPoints.push(
      "今の落ち着きや喜びのリズムが続くかどうか、その中に新しい感情の動きが生まれてくるかを、一緒にゆっくり観測していけると良さそうです。"
    );
  } else {
    nextPoints.push(
      "次の一週間も、印象に残った感情の場面を少しだけメモしておき、「どんなリズムで揺れているか」を一緒に見ていけると良さそうです。"
    );
  }

  return { structuralLines, gentleLines, nextPoints };
}

function buildWeeklyReportText({ titleRange, metrics, narrative, crossTopics }) {
  const lines = [];
  lines.push(`週報：${titleRange || ""}（7日分）`);
  lines.push("");

  lines.push("【概要】");
  if (metrics?.hasData) {
    const topText = (metrics.top || [])
      .filter(([, v]) => v > 0)
      .slice(0, 3)
      .map(([k, v]) => `${EMO_LABEL[k] || k}（${v}）`)
      .join("、 ");
    lines.push(`・出現感情トップ：${topText || "（なし）"}`);
    const dist = EMOTIONS.map(
      (e) => `${e.label} ${metrics.sharePct?.[e.key] || 0}%`
    ).join(" / ");
    lines.push(`・感情分布：${dist}`);
  } else {
    lines.push(
      "・この期間の入力がなかったため、まだ分布を観測できていません。"
    );
  }

  lines.push("");
  lines.push("【構造バランス分析（今週の観測）】");
  (narrative?.structuralLines || []).forEach((l) => lines.push(l));
  lines.push("");
  lines.push("やさしいコメント");
  (narrative?.gentleLines || []).forEach((l) => lines.push(l));
  lines.push("");
  lines.push("次週への観測ポイント");
  (narrative?.nextPoints || []).forEach((l) => lines.push(`・${l}`));

  let crossText = "";
  try {
    crossText = formatCrossTopicsText(crossTopics, "weekly");
  } catch {
    crossText = "";
  }
  if (crossText) {
    lines.push("");
    crossText.split("\n").forEach((l) => lines.push(l));
  }

  return lines.join("\n");
}

function computeMonthlyMetrics(weeks) {
  const totals = { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 };
  weeks.forEach((w) => {
    totals.joy += w.joy;
    totals.sadness += w.sadness;
    totals.anxiety += w.anxiety;
    totals.anger += w.anger;
    totals.calm += w.calm;
  });

  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);
  const sharePct = {};
  if (totalAll > 0) {
    EMOTIONS.forEach((e) => {
      const p = (totals[e.key] || 0) / totalAll;
      sharePct[e.key] = Math.round(p * 100);
    });
  } else {
    EMOTIONS.forEach((e) => {
      sharePct[e.key] = 0;
    });
  }

  return {
    weeks,
    totals,
    totalAll,
    sharePct,
    hasData: totalAll > 0,
  };
}

function buildMonthlyNarrative(metrics) {
  const weeks = metrics.weeks || [];
  const totals = metrics.totals || {};
  const totalAll = metrics.totalAll || 0;
  const sharePct = metrics.sharePct || {};
  const hasData = metrics.hasData;

  if (!hasData) {
    return {
      longToneLines: [
        "・今月は、まだ感情ログが十分には記録されておらず、月全体の流れを観測するにはこれからの積み重ねが必要な状態でした。",
        "・ログが増えていくと、ここに「どのようなリズムで1か月が進んでいたか」が、物語のように現れていきます。",
      ],
      weekSnapshots: [
        "第1〜4週を通じて、明確なトーンはまだ定まりきっていない月でした。",
      ],
      nextPoints: [
        "来月は、特に印象に残った週や出来事だけでも少しメモしておくと、月単位の流れがつかみやすくなります。",
      ],
    };
  }

  const longToneLines = [];
  const weekSnapshots = [];
  const nextPoints = [];

  const half = Math.floor(weeks.length / 2);
  const posVal = (w) => w.joy + w.calm;
  const negVal = (w) => w.sadness + w.anxiety;

  const firstHalf = weeks.slice(0, half);
  const secondHalf = weeks.slice(half);

  const posFirst = firstHalf.reduce((a, w) => a + posVal(w), 0);
  const posSecond = secondHalf.reduce((a, w) => a + posVal(w), 0);
  const negFirst = firstHalf.reduce((a, w) => a + negVal(w), 0);
  const negSecond = secondHalf.reduce((a, w) => a + negVal(w), 0);

  const posDelta = totalAll > 0 ? (posSecond - posFirst) / totalAll : 0;
  const negDelta = totalAll > 0 ? (negSecond - negFirst) / totalAll : 0;

  const topEntries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const topKey1 = topEntries[0] ? topEntries[0][0] : null;
  const topKey2 = topEntries[1] ? topEntries[1][0] : null;

  if (topKey1) {
    const label1 = EMO_LABEL[topKey1] || topKey1;
    const p1 = sharePct[topKey1] || 0;
    let line = `・今月は「${label1}」が全体のトーンとしてよく現れており、おおよそ ${p1}% 程度を占めていました。`;
    if (topKey2) {
      const label2 = EMO_LABEL[topKey2] || topKey2;
      const p2 = sharePct[topKey2] || 0;
      line += ` それに加えて「${label2}」も月を通じて顔を出しており、感情の重心には一つの方向性だけでなく、いくつかの色合いが混ざっていました。`;
    }
    longToneLines.push(line);
  }

  if (posDelta > 0.05) {
    longToneLines.push(
      "・前半と比べて後半にかけて、「喜び」や「平穏」といった安定寄りの感情が少しずつ増えていく流れが見られました。内側の調整が進み、ゆっくりと落ち着きの方向へ重心が動いていた月だったように見えます。"
    );
  } else if (negDelta > 0.05) {
    longToneLines.push(
      "・月の後半には「悲しみ」や「不安」といった感情が目立つ場面が増えており、負荷や揺らぎを抱えながら進んでいった流れも観測されました。構造としては、今の状態をどう受け止めるかを模索していた月だったのかもしれません。"
    );
  } else {
    longToneLines.push(
      "・前半と後半で大きなトーンの切り替えは少なく、比較的似たリズムのまま一か月が進んでいきました。穏やかな中にも、ときおり感情の波が立ち上がるような動きが重なっていた月だったように見えます。"
    );
  }

  weeks.forEach((w) => {
    if (!w.total) {
      weekSnapshots.push(
        `${w.label}：この週のログは少なく、トーンはこれから見えてくる段階でした。`
      );
      return;
    }
    const weekTotals = {
      joy: w.joy,
      sadness: w.sadness,
      anxiety: w.anxiety,
      anger: w.anger,
      calm: w.calm,
    };
    const entries = Object.entries(weekTotals).sort((a, b) => b[1] - a[1]);
    const wkKey1 = entries[0] ? entries[0][0] : null;
    const label1 = wkKey1 ? EMO_LABEL[wkKey1] || wkKey1 : "感情";

    const pJoyCalm =
      w.total > 0 ? Math.round(((w.joy + w.calm) / w.total) * 100) : 0;
    const pSadAnx =
      w.total > 0
        ? Math.round(((w.sadness + w.anxiety) / w.total) * 100)
        : 0;

    let desc = `${w.label}：${label1}がよく現れていた週でした。`;
    if (pJoyCalm >= 50) {
      desc +=
        " 内側の落ち着きや、ささやかな喜びの時間が下支えになっていたような印象があります。";
    } else if (pSadAnx >= 50) {
      desc +=
        " 悲しみや不安といった感情が中心にあり、負荷を抱えながらもなんとか歩みを続けていたような週でした。";
    } else {
      desc +=
        " いくつかの感情が入り混じりつつ、状況に応じてトーンを変えながら過ごしていたような週でした。";
    }
    weekSnapshots.push(desc);
  });

  if (topKey1 === "sadness" || topKey1 === "anxiety") {
    nextPoints.push(
      "来月も同じようなトーンが続きそうなときは、「少し楽だった日」や「ほっとした瞬間」があれば、その場面だけでもメモしておくと、補正の動きが見えやすくなります。"
    );
  } else if (topKey1 === "joy" || topKey1 === "calm") {
    nextPoints.push(
      "今の安定したリズムや、ささやかな喜びの流れがどのように続いていくかを、一緒に観測していけると良さそうです。変化があったときも、それを責めるのではなく「構造の揺れ」として眺めていけますように。"
    );
  } else {
    nextPoints.push(
      "次の一か月も、特に印象に残った週や出来事を少しだけメモしておき、「どんな流れで重心が動いているか」を見ていくと、自分のリズムがつかみやすくなります。"
    );
  }

  return { longToneLines, weekSnapshots, nextPoints };
}

function buildMonthlyReportText({ titleMonth, metrics, narrative, crossTopics }) {
  const lines = [];
  lines.push(`月報：${titleMonth || ""}（28日分）`);
  lines.push("");

  lines.push("【概要】");
  if (metrics?.hasData) {
    const topText = Object.entries(metrics.totals || {})
      .sort((a, b) => b[1] - a[1])
      .filter(([, v]) => v > 0)
      .slice(0, 3)
      .map(([k, v]) => `${EMO_LABEL[k] || k}（${v}）`)
      .join("、 ");
    lines.push(`・出現感情トップ：${topText || "（なし）"}`);
    const dist = EMOTIONS.map(
      (e) => `${e.label} ${metrics.sharePct?.[e.key] || 0}%`
    ).join(" / ");
    lines.push(`・感情分布（月合計）：${dist}`);
  } else {
    lines.push(
      "・この月に記録された感情ログがまだ少ないため、分布の傾向はこれから見えてきます。"
    );
  }

  lines.push("");
  lines.push("【構造変動のロングトーン分析】");
  (narrative?.longToneLines || []).forEach((l) => lines.push(l));

  lines.push("");
  lines.push("【週ごとのスナップショット】");
  (narrative?.weekSnapshots || []).forEach((l) => lines.push(`・${l}`));

  lines.push("");
  lines.push("【次月への観測ポイント】");
  (narrative?.nextPoints || []).forEach((l) => lines.push(`・${l}`));

  let crossText = "";
  try {
    crossText = formatCrossTopicsText(crossTopics, "monthly");
  } catch {
    crossText = "";
  }
  if (crossText) {
    lines.push("");
    crossText.split("\n").forEach((l) => lines.push(l));
  }

  return lines.join("\n");
}

function computeDailyMetrics(rows) {
  const totals = { joy: 0, sadness: 0, anxiety: 0, anger: 0, calm: 0 };
  for (const row of rows) {
    const details = normalizeDetails(row);
    for (const it of details) {
      const k = mapKey(it.type);
      if (!k) continue;
      const w = STRENGTH_SCORE[it.strength] || 0;
      totals[k] += w;
    }
  }
  const totalAll = Object.values(totals).reduce((a, b) => a + b, 0);
  const sharePct = {};
  if (totalAll > 0) {
    EMOTIONS.forEach((e) => {
      const p = (totals[e.key] || 0) / totalAll;
      sharePct[e.key] = Math.round(p * 100);
    });
  } else {
    EMOTIONS.forEach((e) => (sharePct[e.key] = 0));
  }
  const top = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return { totals, totalAll, sharePct, top, hasData: totalAll > 0 };
}

function buildDailyNarrative(metrics) {
  if (!metrics.hasData) {
    return {
      lines: [
        "・今日はまだ感情ログが記録されていなかったため、観測はこれからの状態でした。",
        "・印象に残った出来事があったときだけでも、少しだけ記録してみると、日単位の輪郭が見えやすくなります。",
      ],
      nextPoints: [
        "明日は「少しだけ楽だった瞬間」や「しんどさが軽くなった瞬間」があれば、その場面だけでもメモしておくと補正の動きが見えやすくなります。",
      ],
    };
  }

  const lines = [];
  const nextPoints = [];

  const topKey1 = (metrics.top?.[0] || [])[0];
  if (topKey1) {
    const label1 = EMO_LABEL[topKey1] || topKey1;
    const p1 = metrics.sharePct?.[topKey1] || 0;
    lines.push(
      `・今日は「${label1}」が中心で、全体のおおよそ ${p1}% を占めていました。`
    );
  }

  if (topKey1 === "sadness" || topKey1 === "anxiety") {
    lines.push(
      "・負荷や揺らぎを抱えながらも、構造としては“耐えている”というより“調整し続けている”動きが観測されます。"
    );
    nextPoints.push(
      "明日は、少しでも安心できた瞬間（平穏に寄った瞬間）があれば、その場面だけでも記録しておくと、回復側のループが見えやすくなります。"
    );
  } else if (topKey1 === "joy" || topKey1 === "calm") {
    lines.push(
      "・落ち着きや小さな喜びが、今日の基底音として働いていたように見えます。"
    );
    nextPoints.push(
      "明日も同じトーンが続くか、または別の感情が立ち上がるかを“良し悪し”ではなく“変化”として観測してみてください。"
    );
  } else {
    lines.push(
      "・いくつかの感情が混ざりながら進んだ一日で、状況に応じてトーンが切り替わっていたように見えます。"
    );
    nextPoints.push(
      "明日は、印象に残った出来事があれば一言だけでもメモしておくと、日単位の構造のつながりが見えやすくなります。"
    );
  }

  return { lines, nextPoints };
}

function buildDailyReportText({ titleDate, metrics, narrative, crossTopics }) {
  const lines = [];
  lines.push(`日報：${titleDate || ""}（1日分）`);
  lines.push("");

  lines.push("【概要】");
  if (metrics?.hasData) {
    const topText = (metrics.top || [])
      .filter(([, v]) => v > 0)
      .slice(0, 3)
      .map(([k, v]) => `${EMO_LABEL[k] || k}（${v}）`)
      .join("、 ");
    lines.push(`・出現感情トップ：${topText || "（なし）"}`);
    const dist = EMOTIONS.map(
      (e) => `${e.label} ${metrics.sharePct?.[e.key] || 0}%`
    ).join(" / ");
    lines.push(`・感情分布：${dist}`);
  } else {
    lines.push("・この日の入力がなかったため、まだ分布を観測できていません。");
  }

  lines.push("");
  lines.push("【今日の観測】");
  (narrative?.lines || []).forEach((l) => lines.push(l));

  lines.push("");
  lines.push("【明日への観測ポイント】");
  (narrative?.nextPoints || []).forEach((l) => lines.push(`・${l}`));

  let crossText = "";
  try {
    crossText = formatCrossTopicsText(crossTopics, "daily");
  } catch {
    crossText = "";
  }
  if (crossText) {
    lines.push("");
    crossText.split("\n").forEach((l) => lines.push(l));
  }

  return lines.join("\n");
}

async function reportExists({ userId, reportType, periodStartISO, periodEndISO }) {
  const { data, error } = await supabase
    .from("myweb_reports")
    .select("id")
    .eq("user_id", userId)
    .eq("report_type", reportType)
    .eq("period_start", periodStartISO)
    .eq("period_end", periodEndISO)
    .limit(1);
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

async function upsertReport(payload) {
  const { error } = await supabase.from("myweb_reports").upsert(payload, {
    onConflict: "user_id,report_type,period_start,period_end",
  });
  if (error) throw error;
}

const _locks = {
  daily: false,
  weekly: false,
  monthly: false,
};

async function ensureOneType({ userId, reportType, nowUtcMs = Date.now() }) {
  if (_locks[reportType]) {
    return { reportType, status: "skipped", reason: "locked" };
  }
  _locks[reportType] = true;
  try {
    const target = getTargetPeriod(reportType, nowUtcMs);

    const exists = await reportExists({
      userId,
      reportType,
      periodStartISO: target.periodStartISO,
      periodEndISO: target.periodEndISO,
    });
    if (exists) {
      return {
        reportType,
        status: "exists",
        periodStartISO: target.periodStartISO,
        periodEndISO: target.periodEndISO,
      };
    }

    // 生成
    const rows = await fetchEmotionRows(
      userId,
      target.periodStartISO,
      target.periodEndISO
    );

    if (reportType === "daily") {
      const metrics = computeDailyMetrics(rows);
      const narrative = buildDailyNarrative(metrics);

      let crossTopics = null;
      try {
        crossTopics = buildSelfStructureTopics({ reportType: "daily", metrics });
      } catch {
        crossTopics = null;
      }

      const titleDate = formatJstDateOnly(target.periodStartUtcMs);
      const contentText = buildDailyReportText({
        titleDate,
        metrics,
        narrative,
        crossTopics,
      });

      const payload = {
        user_id: userId,
        report_type: "daily",
        period_start: target.periodStartISO,
        period_end: target.periodEndISO,
        title: target.title,
        content_text: contentText,
        content_json: {
          metrics,
          narrative,
          cross_topics: crossTopics,
        },
        generated_at: new Date().toISOString(),
      };
      await upsertReport(payload);
      return {
        reportType,
        status: "generated",
        periodStartISO: target.periodStartISO,
        periodEndISO: target.periodEndISO,
      };
    }

    if (reportType === "weekly") {
      const days = buildDaysFromRowsFixed7(rows, target.periodStartUtcMs);
      const metrics = computeWeeklyMetrics(days);
      const narrative = buildWeeklyNarrative(metrics);

      let crossTopics = null;
      try {
        crossTopics = buildSelfStructureTopics({ reportType: "weekly", metrics });
      } catch {
        crossTopics = null;
      }

      const contentText = buildWeeklyReportText({
        titleRange: target.titleRange,
        metrics,
        narrative,
        crossTopics,
      });

      const payload = {
        user_id: userId,
        report_type: "weekly",
        period_start: target.periodStartISO,
        period_end: target.periodEndISO,
        title: target.title,
        content_text: contentText,
        content_json: {
          metrics,
          narrative,
          days,
          cross_topics: crossTopics,
        },
        generated_at: new Date().toISOString(),
      };
      await upsertReport(payload);
      return {
        reportType,
        status: "generated",
        periodStartISO: target.periodStartISO,
        periodEndISO: target.periodEndISO,
      };
    }

    // monthly
    const weeks = buildWeeksFromRowsFixed4(rows, target.periodStartUtcMs);
    const metrics = computeMonthlyMetrics(weeks);
    const narrative = buildMonthlyNarrative(metrics);

    let crossTopics = null;
    try {
      crossTopics = buildSelfStructureTopics({ reportType: "monthly", metrics });
    } catch {
      crossTopics = null;
    }

    const contentText = buildMonthlyReportText({
      titleMonth: target.titleMonth,
      metrics,
      narrative,
      crossTopics,
    });

    const payload = {
      user_id: userId,
      report_type: "monthly",
      period_start: target.periodStartISO,
      period_end: target.periodEndISO,
      title: target.title,
      content_text: contentText,
      content_json: {
        metrics,
        narrative,
        cross_topics: crossTopics,
      },
      generated_at: new Date().toISOString(),
    };
    await upsertReport(payload);
    return {
      reportType,
      status: "generated",
      periodStartISO: target.periodStartISO,
      periodEndISO: target.periodEndISO,
    };
  } catch (e) {
    return {
      reportType,
      status: "error",
      error: String(e?.message || e),
    };
  } finally {
    _locks[reportType] = false;
  }
}

/**
 * いまの時刻(JST固定)から見て「配布されているべき」日/週/月レポートが無ければ生成する
 */
export async function ensureDueMyWebReports({ reportType } = {}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "ユーザー情報がありません（ログインしてください）" };
  }

  const types = reportType ? [reportType] : ["daily", "weekly", "monthly"];
  const nowUtcMs = Date.now();

  const results = [];
  for (const t of types) {
    // eslint-disable-next-line no-await-in-loop
    const r = await ensureOneType({ userId, reportType: t, nowUtcMs });
    results.push(r);
  }

  return { ok: true, results };
}

// ------------------------------------------------------------
// Auto distribution（アプリ実行中）
// ------------------------------------------------------------
let _started = false;
let _timers = { daily: null, weekly: null, monthly: null };
let _appStateSub = null;

function clearTimers() {
  Object.keys(_timers).forEach((k) => {
    if (_timers[k]) {
      clearTimeout(_timers[k]);
      _timers[k] = null;
    }
  });
}

function scheduleType(reportType, onGenerated) {
  if (_timers[reportType]) {
    clearTimeout(_timers[reportType]);
    _timers[reportType] = null;
  }

  const now = Date.now();
  const next = getNextDistributionUtcMs(reportType, now);
  const delay = Math.max(1_000, next - now + 1_500); // +α

  _timers[reportType] = setTimeout(async () => {
    try {
      await ensureDueMyWebReports({ reportType });
      if (typeof onGenerated === "function") onGenerated(reportType);
    } finally {
      scheduleType(reportType, onGenerated);
    }
  }, delay);
}

/**
 * アプリが動いている間に「0時配布」をなるべく再現するためのタイマー。
 * - foreground のとき: 次の配布時刻に setTimeout
 * - resume のとき: missed分があれば即生成
 */
export function startMyWebReportAutoDistribution({ onGenerated } = {}) {
  if (_started) {
    // 多重起動を避ける
    return () => {};
  }
  _started = true;

  const kick = async () => {
    try {
      await ensureDueMyWebReports();
    } catch {
      // UIは壊さない（静かに失敗）
    }
  };

  const scheduleAll = () => {
    scheduleType("daily", onGenerated);
    scheduleType("weekly", onGenerated);
    scheduleType("monthly", onGenerated);
  };

  kick();
  scheduleAll();

  // 復帰時に missed を拾う
  _appStateSub = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      kick();
      scheduleAll();
    }
  });

  return () => {
    clearTimers();
    try {
      _appStateSub?.remove?.();
    } catch {
      // ignore
    }
    _appStateSub = null;
    _started = false;
  };
}
