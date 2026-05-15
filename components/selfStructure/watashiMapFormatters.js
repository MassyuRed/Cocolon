import {
  canViewWatashiMapDetailReport,
  formatWatashiMapReportModeLabel,
  getWatashiMapDetailLockLabel,
  normalizeWatashiMapReportMode,
  normalizeWatashiMapTier,
} from "./watashiMapAccessPolicy";

export function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

export function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function firstText(...values) {
  for (const value of values) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const s = asText(item);
        if (s) return s;
      }
    } else {
      const s = asText(value);
      if (s) return s;
    }
  }
  return "";
}

export function normalizeReportMode(mode) {
  return normalizeWatashiMapReportMode(mode);
}

export function normalizeViewerTier(tier, reportMode = "standard") {
  const raw = String(tier || "").trim().toLowerCase();
  if (raw === "premium" || raw === "plus" || raw === "free") return raw;
  const mode = normalizeReportMode(reportMode);
  if (mode === "light") return "free";
  if (mode === "deep") return "premium";
  return normalizeWatashiMapTier(raw || "plus");
}

export function formatReportModeLabel(mode) {
  return formatWatashiMapReportModeLabel(mode);
}

export function getObjectLabel(value, fallback = "") {
  const obj = asObject(value);
  if (!obj) return fallback;
  return (
    asText(obj.label) ||
    asText(obj.label_ja) ||
    asText(obj.labelJa) ||
    asText(obj.target_label_ja) ||
    asText(obj.targetLabelJa) ||
    asText(obj.role_label_ja) ||
    asText(obj.roleLabelJa) ||
    asText(obj.template_role_label_ja) ||
    asText(obj.templateRoleLabelJa) ||
    asText(obj.title) ||
    asText(obj.key) ||
    fallback
  );
}

function scoreToDots(score, evidenceCount) {
  const val = asNumber(score);
  const count = asNumber(evidenceCount);
  if (val >= 0.75 || count >= 8) return "●●●";
  if (val >= 0.35 || count >= 3) return "●●";
  if (val > 0 || count > 0) return "●";
  return "—";
}

function readTargetKey(item) {
  const obj = asObject(item) || {};
  return firstText(obj.target_key, obj.targetKey, obj.context_key, obj.contextKey, obj.key, obj.target) || "overall";
}

function readTargetLabel(item) {
  const obj = asObject(item) || {};
  return firstText(
    obj.target_label_ja,
    obj.targetLabelJa,
    obj.context_label,
    obj.contextLabel,
    obj.label_ja,
    obj.labelJa,
    obj.label,
    obj.target,
    obj.key,
    "場面"
  );
}

function readTargetKind(item) {
  const obj = asObject(item) || {};
  return firstText(obj.target_type, obj.targetType, obj.kind, "environment");
}

function readRoleKey(item) {
  const obj = asObject(item) || {};
  return firstText(obj.role_key, obj.roleKey, obj.template_role, obj.templateRole, obj.templateRoleKey, obj.key, obj.role) || "role";
}

function readRoleLabel(item) {
  const obj = asObject(item) || {};
  const label = firstText(
    obj.role_label_ja,
    obj.roleLabelJa,
    obj.template_role_label_ja,
    obj.templateRoleLabelJa,
    obj.top_role_label_ja,
    obj.topRoleLabelJa,
    obj.label_ja,
    obj.labelJa,
    obj.label,
    obj.role,
    "役割"
  );
  return label.includes("役割") || label === "役割" ? label : `${label}の役割`;
}

function patternLabel(item, fallback = "行動を選ぶ") {
  const obj = asObject(item) || {};
  return firstText(obj.label_ja, obj.labelJa, obj.action_label_ja, obj.actionLabelJa, obj.text, obj.label, obj.key, fallback);
}

function normalizeVisibility(rawVisibility, reportMode, viewerTier) {
  const mode = normalizeReportMode(reportMode);
  const tier = normalizeViewerTier(viewerTier, mode);
  const raw = asObject(rawVisibility) || {};

  const detailAllowedByTier = canViewWatashiMapDetailReport(tier, mode);
  const defaultDeepVisible = detailAllowedByTier;
  const routesVisible = !!((raw.routes_visible ?? raw.routesVisible ?? defaultDeepVisible) && detailAllowedByTier);
  const crossroadsVisible = !!((raw.crossroads_visible ?? raw.crossroadsVisible ?? defaultDeepVisible) && detailAllowedByTier);
  const detailReportVisible = !!((raw.detail_report_visible ?? raw.detailReportVisible ?? defaultDeepVisible) && detailAllowedByTier);

  const lockedSet = new Set(
    asList(raw.locked_sections || raw.lockedSections)
      .map((item) => asText(item))
      .filter(Boolean)
  );
  if (!routesVisible) lockedSet.add("routes");
  if (!crossroadsVisible) lockedSet.add("crossroads");
  if (!detailReportVisible) lockedSet.add("detail_report");

  return {
    viewer_tier: tier,
    summary_visible: raw.summary_visible ?? raw.summaryVisible ?? true,
    role_switches_visible: raw.role_switches_visible ?? raw.roleSwitchesVisible ?? true,
    routes_visible: routesVisible,
    crossroads_visible: crossroadsVisible,
    unknown_areas_visible: raw.unknown_areas_visible ?? raw.unknownAreasVisible ?? true,
    detail_report_visible: detailReportVisible,
    locked_sections: Array.from(lockedSet),
    lock_label: asText(raw.lock_label || raw.lockLabel) || getWatashiMapDetailLockLabel(tier, mode),
  };
}

function normalizeOverview(rawOverview, roleSwitches) {
  const overview = asObject(rawOverview) || {};
  const activeContexts = asList(overview.active_contexts || overview.activeContexts)
    .map((item) => {
      const obj = asObject(item);
      if (!obj) return null;
      const label = getObjectLabel(obj, "");
      if (!label) return null;
      return {
        key: asText(obj.key) || label,
        label,
        share_label: asText(obj.share_label || obj.shareLabel),
      };
    })
    .filter(Boolean);

  const activeRoles = asList(overview.active_roles || overview.activeRoles)
    .map((item) => {
      const obj = asObject(item);
      if (!obj) return null;
      const label = getObjectLabel(obj, "");
      if (!label) return null;
      return { key: asText(obj.key) || label, label };
    })
    .filter(Boolean);

  const actionTendencies = asList(overview.action_tendencies || overview.actionTendencies)
    .map((item) => {
      const obj = asObject(item);
      if (!obj) return null;
      const label = getObjectLabel(obj, "");
      if (!label) return null;
      return { key: asText(obj.key) || label, label };
    })
    .filter(Boolean);

  if (activeContexts.length === 0) {
    roleSwitches.slice(0, 3).forEach((item) => {
      const ctx = asObject(item.context);
      const label = getObjectLabel(ctx, "");
      if (label && !activeContexts.some((x) => x.label === label)) {
        activeContexts.push({ key: asText(ctx?.key) || label, label, share_label: "よく見えています" });
      }
    });
  }

  if (activeRoles.length === 0) {
    roleSwitches.slice(0, 3).forEach((item) => {
      const role = asObject(item.role);
      const label = getObjectLabel(role, "");
      if (label && !activeRoles.some((x) => x.label === label)) {
        activeRoles.push({ key: asText(role?.key) || label, label });
      }
    });
  }

  const observation = asObject(overview.observation_amount || overview.observationAmount) || {};

  return {
    title: asText(overview.title) || "今のわたしマップ",
    summary: asText(overview.summary),
    active_contexts: activeContexts,
    active_roles: activeRoles,
    action_tendencies: actionTendencies,
    observation_amount: {
      level: asText(observation.level) || "low",
      label: asText(observation.label) || (roleSwitches.length > 0 ? "少し見えてきました" : "まだ少なめです"),
    },
  };
}

function normalizeRoleSwitches(rawRoleSwitches, visibility) {
  const roleLimit = visibility.viewer_tier === "free" ? 2 : null;
  const roleSwitches = asList(rawRoleSwitches)
    .map((item, idx) => {
      const obj = asObject(item);
      if (!obj) return null;
      const context = asObject(obj.context) || obj;
      const role = asObject(obj.role) || obj;
      const contextLabel = getObjectLabel(context, readTargetLabel(obj));
      const roleLabel = getObjectLabel(role, readRoleLabel(obj));
      if (!contextLabel && !roleLabel) return null;
      return {
        key: asText(obj.key) || `${asText(context.key) || contextLabel || "context"}-${asText(role.key) || roleLabel || idx}`,
        context: {
          key: asText(context.key) || readTargetKey(obj),
          label: contextLabel || "場面",
          kind: asText(context.kind) || readTargetKind(obj),
        },
        role: {
          key: asText(role.key) || readRoleKey(obj),
          label: roleLabel || "役割",
        },
        tendency_label: asText(obj.tendency_label || obj.tendencyLabel) || "立ち上がりやすい",
        score_display: asText(obj.score_display || obj.scoreDisplay) || scoreToDots(obj.score, obj.evidence_count || obj.evidenceCount),
        evidence_count: obj.evidence_count ?? obj.evidenceCount ?? null,
        route_preview: asText(obj.route_preview || obj.routePreview),
        safe_note: asText(obj.safe_note || obj.safeNote) || "これは性格タイプではなく、この場面で見えた動き方です。",
      };
    })
    .filter(Boolean);
  return roleLimit ? roleSwitches.slice(0, roleLimit) : roleSwitches;
}

function normalizeRoutes(rawRoutes) {
  return asList(rawRoutes)
    .map((item, idx) => {
      const obj = asObject(item);
      if (!obj) return null;
      const steps = asList(obj.steps)
        .map((step) => {
          const s = asObject(step);
          if (!s) return null;
          const label = asText(s.label) || "項目";
          const text = asText(s.text) || asText(s.body);
          if (!text) return null;
          return { label, text };
        })
        .filter(Boolean);
      if (steps.length === 0) return null;
      return {
        key: asText(obj.key) || `route-${idx}`,
        title: asText(obj.title) || "よく通るルート",
        steps,
      };
    })
    .filter(Boolean);
}

function normalizeCrossroads(rawCrossroads) {
  return asList(rawCrossroads)
    .map((item, idx) => {
      const obj = asObject(item);
      if (!obj) return null;
      const context = asObject(obj.context) || obj;
      return {
        key: asText(obj.key) || `crossroad-${idx}`,
        context: {
          key: asText(context.key) || readTargetKey(obj),
          label: getObjectLabel(context, readTargetLabel(obj)) || "場面",
        },
        self_role: { label: getObjectLabel(obj.self_role || obj.selfRole, "自己認識の役割") },
        observed_role: { label: getObjectLabel(obj.observed_role || obj.observedRole || obj.real_role || obj.realRole, "実際に出やすい役割") },
        desired_role: { label: getObjectLabel(obj.desired_role || obj.desiredRole, "こうありたい役割") },
        note: asText(obj.note),
      };
    })
    .filter(Boolean);
}

function normalizeUnknownAreas(rawUnknownAreas) {
  return asList(rawUnknownAreas)
    .map((item, idx) => {
      const obj = asObject(item);
      if (!obj) return null;
      const label = asText(obj.label) || asText(obj.title) || readTargetLabel(obj) || "まだ地図にない場所";
      return {
        key: asText(obj.key) || `unknown-${idx}`,
        label,
        reason: asText(obj.reason) || "入力がまだ少なく、役割を言い切らない状態です。",
        next_observation_hint: asText(obj.next_observation_hint || obj.nextObservationHint || obj.hint),
      };
    })
    .filter(Boolean);
}

function adaptLegacyDeepVisual(visual, options = {}) {
  const v = asObject(visual) || {};
  const reportMode = normalizeReportMode(options.reportMode || "deep");
  const visibility = normalizeVisibility(null, reportMode, options.viewerTier || "premium");
  const summaryCard = asObject(v.summaryCard) || {};
  const roleMap = asObject(v.roleSwitchMap) || {};
  const dominantRows = asList(roleMap.dominant_by_target || roleMap.dominantByTarget || roleMap.items || roleMap.cells);

  const roleSwitches = normalizeRoleSwitches(
    dominantRows.map((row) => {
      const obj = asObject(row) || {};
      return {
        context: { key: readTargetKey(obj), label: readTargetLabel(obj), kind: readTargetKind(obj) },
        role: { key: readRoleKey(obj), label: readRoleLabel(obj) },
        score_display: scoreToDots(obj.score, obj.evidence_count || obj.evidenceCount),
        evidence_count: obj.evidence_count || obj.evidenceCount,
        route_preview: `${readTargetLabel(obj)}の場面では、${readRoleLabel(obj)}が立ち上がりやすく見えます。`,
      };
    }),
    visibility
  );

  const behaviorCards = asList(v.behaviorCards);
  const routes = normalizeRoutes(
    behaviorCards.map((card, idx) => {
      const obj = asObject(card) || {};
      const contextLabel = readTargetLabel(obj);
      const roleLabel = firstText(obj.generated_role_description, obj.generatedRoleDescription, readRoleLabel(obj));
      const actions = asList(obj.actions).map((item) => patternLabel(item)).filter(Boolean);
      return {
        key: `legacy-route-${idx}`,
        title: `${contextLabel}でよく通るルート`,
        steps: [
          { label: "場面", text: `${contextLabel}に触れる` },
          { label: "役割スイッチ", text: roleLabel },
          { label: "選びやすい行動", text: firstText(actions, "行動を選ぶ") },
          { label: "起こりやすい結果", text: "その場で見えた動き方が表れやすくなります" },
        ],
      };
    })
  );

  const crossroads = normalizeCrossroads(
    asList(v.roleGapCards).map((card, idx) => {
      const obj = asObject(card) || {};
      return {
        key: `legacy-crossroad-${idx}`,
        context: { key: readTargetKey(obj), label: readTargetLabel(obj) },
        self_role: asObject(obj.self_role || obj.selfRole) || { label: "自己認識の役割" },
        observed_role: asObject(obj.real_role || obj.realRole || obj.observed_role || obj.observedRole) || { label: "実際に出やすい役割" },
        desired_role: asObject(obj.desired_role || obj.desiredRole) || { label: "こうありたい役割" },
        note: asText(asObject(obj.primary_gap || obj.primaryGap)?.note) || "自己認識・実際・理想の間に分かれ道が見えます。",
      };
    })
  );

  const unknown = asObject(v.unknownArea) || {};
  const unknownAreas = normalizeUnknownAreas(asList(unknown.items));

  const overview = normalizeOverview(
    {
      title: "今のわたしマップ",
      summary: firstText(summaryCard.headline, summaryCard.summary, summaryCard.text, summaryCard.title),
      active_contexts: asObject(summaryCard.core_target || summaryCard.coreTarget)
        ? [summaryCard.core_target || summaryCard.coreTarget]
        : [],
      active_roles: asObject(summaryCard.core_role || summaryCard.coreRole)
        ? [summaryCard.core_role || summaryCard.coreRole]
        : [],
    },
    roleSwitches
  );

  return {
    version: "watashi.map.v1",
    status: overview.summary || roleSwitches.length > 0 ? "ok" : "not_enough_observation",
    label: "わたしマップ",
    period_label: asText(options.periodLabel) || "直近 28 日",
    report_mode: reportMode,
    report_mode_label: formatReportModeLabel(reportMode),
    visibility,
    overview,
    role_switches: roleSwitches,
    routes: visibility.routes_visible ? routes : [],
    crossroads: visibility.crossroads_visible ? crossroads : [],
    unknown_areas: unknownAreas,
    detail_report: {
      title: "詳しい自己分析レポート",
      visible: !!visibility.detail_report_visible,
      source: "content_text",
      text: null,
      lock_label: visibility.detail_report_visible ? null : getWatashiMapDetailLockLabel(visibility.viewer_tier, reportMode),
    },
  };
}

export function normalizeWatashiMapPayload(contentJson, options = {}) {
  const cj = asObject(contentJson) || {};
  const existing = asObject(cj.watashiMap);
  const reportMode = normalizeReportMode(options.reportMode || existing?.report_mode || cj.report_mode || cj.reportMode);
  const visibility = normalizeVisibility(existing?.visibility, reportMode, options.viewerTier);

  if (existing) {
    const roleSwitches = normalizeRoleSwitches(existing.role_switches || existing.roleSwitches, visibility);
    const payload = {
      version: asText(existing.version) || "watashi.map.v1",
      status: asText(existing.status) || "ok",
      label: asText(existing.label) || "わたしマップ",
      period_label: asText(existing.period_label || existing.periodLabel) || asText(options.periodLabel) || "直近 28 日",
      report_mode: reportMode,
      report_mode_label: formatReportModeLabel(reportMode),
      visibility,
      overview: normalizeOverview(existing.overview, roleSwitches),
      role_switches: roleSwitches,
      routes: visibility.routes_visible ? normalizeRoutes(existing.routes) : [],
      crossroads: visibility.crossroads_visible ? normalizeCrossroads(existing.crossroads) : [],
      unknown_areas: visibility.unknown_areas_visible ? normalizeUnknownAreas(existing.unknown_areas || existing.unknownAreas) : [],
      detail_report: asObject(existing.detail_report || existing.detailReport) || {},
      empty_title: asText(existing.empty_title || existing.emptyTitle),
      empty_body: asText(existing.empty_body || existing.emptyBody),
      empty_action_label: asText(existing.empty_action_label || existing.emptyActionLabel),
    };
    if (!asText(payload.detail_report.title)) payload.detail_report.title = "詳しい自己分析レポート";
    payload.detail_report.visible = !!visibility.detail_report_visible;
    if (visibility.detail_report_visible) {
      payload.detail_report.lock_label = null;
    } else if (!payload.detail_report.lock_label) {
      payload.detail_report.lock_label = visibility.lock_label || getWatashiMapDetailLockLabel(visibility.viewer_tier, reportMode);
    }
    return payload;
  }

  const legacyVisual = asObject(cj.selfStructureDeepVisual);
  if (legacyVisual) {
    return adaptLegacyDeepVisual(legacyVisual, {
      reportMode,
      viewerTier: options.viewerTier,
      periodLabel: options.periodLabel,
    });
  }

  const text = asText(options.contentText);
  if (text) {
    const firstLine = text.split("\n").map((line) => asText(line)).find(Boolean) || "";
    return {
      version: "watashi.map.v1",
      status: firstLine ? "ok" : "not_enough_observation",
      label: "わたしマップ",
      period_label: asText(options.periodLabel) || "直近 28 日",
      report_mode: reportMode,
      report_mode_label: formatReportModeLabel(reportMode),
      visibility,
      overview: normalizeOverview({ summary: firstLine }, []),
      role_switches: [],
      routes: [],
      crossroads: [],
      unknown_areas: [],
      detail_report: {
        title: "詳しい自己分析レポート",
        visible: !!visibility.detail_report_visible,
        source: "content_text",
        text: null,
        lock_label: visibility.detail_report_visible ? null : getWatashiMapDetailLockLabel(visibility.viewer_tier, reportMode),
      },
    };
  }

  return {
    version: "watashi.map.v1",
    status: "not_enough_observation",
    label: "わたしマップ",
    period_label: asText(options.periodLabel) || "直近 28 日",
    report_mode: reportMode,
    report_mode_label: formatReportModeLabel(reportMode),
    visibility,
    overview: normalizeOverview({}, []),
    role_switches: [],
    routes: [],
    crossroads: [],
    unknown_areas: [
      {
        key: "not-enough",
        label: "まだ地図にない場所",
        reason: "入力がまだ少なく、役割を言い切らない状態です。",
        next_observation_hint: "次に相手や場所との関わりを入力すると、地図が見えやすくなります。",
      },
    ],
    detail_report: {
      title: "詳しい自己分析レポート",
      visible: false,
      source: "content_text",
      text: null,
      lock_label: getWatashiMapDetailLockLabel(visibility.viewer_tier, reportMode),
    },
    empty_title: "まだ地図にできる観測が少なめです",
    empty_body: "入力が増えると、場面ごとの役割スイッチや、よく通るルートが見えやすくなります。",
    empty_action_label: "今日の入力をする",
  };
}

export function hasWatashiMapSource(contentJson) {
  const cj = asObject(contentJson) || {};
  return !!(asObject(cj.watashiMap) || asObject(cj.selfStructureDeepVisual));
}

export function isLocked(payload, sectionKey) {
  const visibility = asObject(payload?.visibility) || {};
  const locked = asList(visibility.locked_sections || visibility.lockedSections)
    .map((item) => asText(item))
    .filter(Boolean);
  return locked.includes(sectionKey);
}

export function lockLabel(payload) {
  const visibility = asObject(payload?.visibility) || {};
  const detail = asObject(payload?.detail_report || payload?.detailReport) || {};
  return (
    asText(detail.lock_label || detail.lockLabel) ||
    asText(visibility.lock_label || visibility.lockLabel) ||
    "詳しい自己分析レポートは Plus プラン以上で読めます。"
  );
}

export function hasWatashiMapRenderableContent(contentJson) {
  return hasWatashiMapSource(contentJson);
}


export function adaptSelfStructureDeepVisualToWatashiMap(visual, options = {}) {
  return adaptLegacyDeepVisual(visual, options);
}

export function normalizeWatashiMap(contentJson, options = {}) {
  return normalizeWatashiMapPayload(contentJson, options);
}
