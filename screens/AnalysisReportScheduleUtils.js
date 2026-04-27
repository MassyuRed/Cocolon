const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function pad2(n) {
  return String(n).padStart(2, "0");
}

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

function getJstPartsFromUtcMs(utcMs) {
  const d = new Date(Number(utcMs) + JST_OFFSET_MS);
  return {
    y: d.getUTCFullYear(),
    mo: d.getUTCMonth(),
    da: d.getUTCDate(),
    dow: d.getUTCDay(),
  };
}

function getJstMidnightUtcMs(y, mo0, da) {
  return Date.UTC(y, mo0, da, 0, 0, 0, 0) - JST_OFFSET_MS;
}

function getLastDistributionUtcMs(reportType, nowUtcMs = Date.now()) {
  const p = getJstPartsFromUtcMs(nowUtcMs);
  const todayMidnightUtcMs = getJstMidnightUtcMs(p.y, p.mo, p.da);

  if (reportType === "daily") return todayMidnightUtcMs;
  if (reportType === "weekly") return todayMidnightUtcMs - p.dow * DAY_MS;
  if (reportType === "monthly") return getJstMidnightUtcMs(p.y, p.mo, 1);
  return todayMidnightUtcMs;
}

export function getNextDistributionUtcMs(reportType, nowUtcMs = Date.now()) {
  const last = getLastDistributionUtcMs(reportType, nowUtcMs);

  if (reportType === "daily") return last + DAY_MS;
  if (reportType === "weekly") return last + 7 * DAY_MS;
  if (reportType === "monthly") {
    const p = getJstPartsFromUtcMs(nowUtcMs);
    const nextMo = p.mo === 11 ? 0 : p.mo + 1;
    const nextY = p.mo === 11 ? p.y + 1 : p.y;
    return getJstMidnightUtcMs(nextY, nextMo, 1);
  }
  return last + DAY_MS;
}
