import tutorialFixtures from "./generated/tutorialFixtures.generated.json";

export const TUTORIAL_TOTAL_STEPS = 19;

const FIXTURES = tutorialFixtures && typeof tutorialFixtures === "object" ? tutorialFixtures : {};
const FIXTURE_INPUT = FIXTURES.input && typeof FIXTURES.input === "object" ? FIXTURES.input : {};
const FIXTURE_PIECE = FIXTURES.piece && typeof FIXTURES.piece === "object" ? FIXTURES.piece : {};
const FIXTURE_ANALYSIS = FIXTURES.analysis && typeof FIXTURES.analysis === "object" ? FIXTURES.analysis : {};
const FIXTURE_SELF_STRUCTURE = FIXTURES.self_structure && typeof FIXTURES.self_structure === "object" ? FIXTURES.self_structure : {};

const FALLBACK_MEMO =
  "なんか少しだけ気分が軽い。\nやること全部はできてないけど、ひとつ片づいたからまあいいかって感じ。\nこういう小さいことで落ち着く日もあるんだな。";
const FALLBACK_MEMO_ACTION =
  "机の上を少し片づけた。\n好きな飲み物を用意して、少しゆっくりした。";
const DISPLAY_NAME_PLACEHOLDER = "__DISPLAY_NAME__";

function freezeClone(value) {
  try {
    return Object.freeze(JSON.parse(JSON.stringify(value)));
  } catch {
    return Object.freeze(value);
  }
}

function compact(value) {
  return String(value || "").trim();
}

const EMLIS_WITH_READING_PATTERN = /Emlis\uFF08\u30A8\u30E0\u30EA\u30B9\uFF09/g;

function withoutEmlisReading(value) {
  const raw = compact(value);
  if (!raw) return "";
  return raw.replace(EMLIS_WITH_READING_PATTERN, "Emlis");
}

function readFirstObject(...values) {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }
  return {};
}

function parseMaybeJsonObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value !== "string") return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function parseJsonObject(value) {
  return parseMaybeJsonObject(value);
}

function normalizeReport(report, reportType) {
  const safe = readFirstObject(report);
  return Object.freeze({
    ...safe,
    report_type: compact(safe.report_type) || reportType,
    title: compact(safe.title),
    content_text: compact(safe.content_text),
  });
}

function normalizeWatashiMapReport(report) {
  const safe = readFirstObject(report);
  const contentJson = parseJsonObject(safe.content_json || safe.contentJson);
  return Object.freeze({
    ...safe,
    report_type: compact(safe.report_type) || "self_structure",
    title: compact(safe.title) || "今のわたしマップ",
    report_mode: compact(safe.report_mode || safe.reportMode) || "light",
    viewer_tier: compact(safe.viewer_tier || safe.viewerTier) || "free",
    period_label: compact(safe.period_label || safe.periodLabel) || "直近28日",
    content_text: compact(safe.content_text || safe.contentText),
    content_json: freezeClone(contentJson),
  });
}

const fixturePreview = readFirstObject(FIXTURE_PIECE.preview);
const fixturePublish = readFirstObject(FIXTURE_PIECE.publish);
const fixtureEmlisReply = readFirstObject(FIXTURES.emlis_reply, fixturePublish.input_feedback);
const fixtureEmlisMeta = readFirstObject(fixtureEmlisReply.emlis_ai);
const fixtureEmlisObservationStatus = compact(fixtureEmlisMeta.observation_status).toLowerCase();
export const TUTORIAL_HAS_DISPLAYABLE_EMLIS_REPLY = Boolean(
  fixtureEmlisObservationStatus === "passed" && compact(fixtureEmlisReply.comment_text)
);
const fixtureFeedItems = Array.isArray(FIXTURE_PIECE.feed_items)
  ? FIXTURE_PIECE.feed_items.filter(Boolean)
  : [];

export const TUTORIAL_HAS_VALID_FIXTURES =
  FIXTURES?.validation?.passed === true &&
  compact(fixturePreview.piece_text) &&
  fixtureFeedItems.length >= 2;

export const TUTORIAL_INPUT_SAMPLE = Object.freeze({
  memo: compact(FIXTURE_INPUT.memo) || FALLBACK_MEMO,
  memoAction: compact(FIXTURE_INPUT.memo_action) || FALLBACK_MEMO_ACTION,
  emotions: freezeClone(
    Array.isArray(FIXTURE_INPUT.emotions) && FIXTURE_INPUT.emotions.length
      ? FIXTURE_INPUT.emotions
      : [
          { type: "平穏", strength: "medium" },
          { type: "喜び", strength: "weak" },
          { type: "不安", strength: "weak" },
        ]
  ),
  categories: freezeClone(
    Array.isArray(FIXTURE_INPUT.category) && FIXTURE_INPUT.category.length
      ? FIXTURE_INPUT.category
      : ["生活", "健康", "価値観"]
  ),
  sendEmotionNotification: FIXTURE_INPUT.send_emotion_notification !== false,
});

export const TUTORIAL_PIECE_PREVIEW = freezeClone({
  ...fixturePreview,
  preview_id: compact(fixturePreview.preview_id) || "tutorial-preview-self",
  question: compact(fixturePreview.question || fixturePreview.title),
  title: compact(fixturePreview.title || fixturePreview.question),
  piece_text: compact(fixturePreview.piece_text || fixturePreview.answer_display_text),
  answer_display_text: compact(
    fixturePreview.answer_display_text || fixturePreview.piece_text
  ),
  quota: readFirstObject(fixturePreview.quota),
});

export const TUTORIAL_EMLIS_REPLY = Object.freeze({
  contextLabel: "",
  commentText: TUTORIAL_HAS_DISPLAYABLE_EMLIS_REPLY
    ? withoutEmlisReading(fixtureEmlisReply.comment_text)
    : "",
  meta: freezeClone(fixtureEmlisMeta),
});

export function getTutorialEmlisReplyText(displayName) {
  const name = compact(displayName) || "あなた";
  const raw = compact(TUTORIAL_EMLIS_REPLY.commentText);
  if (!raw) return "";
  return raw
    .replaceAll(DISPLAY_NAME_PLACEHOLDER, name)
    .replaceAll("{displayName}", name);
}

function normalizeTutorialPiece(item, fallbackKind) {
  const safe = readFirstObject(item);
  const owner = readFirstObject(safe.owner);
  const question = readFirstObject(safe.question);
  const metrics = readFirstObject(safe.metrics);
  const viewerState = readFirstObject(safe.viewer_state);
  const title = compact(safe.title || question.title || safe.question);
  const body = compact(safe.body || safe.piece_text || safe.answer_display_text);
  return Object.freeze({
    ...safe,
    id: compact(safe.id || safe.q_instance_id),
    q_instance_id: compact(safe.q_instance_id || safe.id),
    q_key: compact(safe.q_key || question.q_key),
    title,
    question: title,
    body,
    piece_text: body,
    answer_display_text: body,
    owner_user_id: compact(safe.owner_user_id || owner.user_id),
    display_name: compact(safe.display_name || owner.display_name) || "ユーザー",
    share_code: compact(safe.share_code || owner.share_code),
    created_at: compact(safe.created_at),
    resonances: Number(safe.resonances ?? metrics.resonances ?? 0) || 0,
    views: Number(safe.views ?? metrics.views ?? 0) || 0,
    is_new: safe.is_new === true || viewerState.is_new === true,
    is_tutorial: true,
    tutorial_kind: fallbackKind,
  });
}

export const TUTORIAL_SELF_PIECE = normalizeTutorialPiece(
  fixtureFeedItems[0],
  "self"
);
export const TUTORIAL_FOLLOWED_USER_PIECE = normalizeTutorialPiece(
  fixtureFeedItems[1],
  "followed"
);
export const TUTORIAL_PIECES = Object.freeze([
  TUTORIAL_SELF_PIECE,
  TUTORIAL_FOLLOWED_USER_PIECE,
]);

export const TUTORIAL_ANALYSIS_COUNTS = Object.freeze({
  today: Number(FIXTURE_ANALYSIS?.counts?.today || 0) || 4,
  week: Number(FIXTURE_ANALYSIS?.counts?.week || 0) || 21,
  month: Number(FIXTURE_ANALYSIS?.counts?.month || 0) || 72,
});

export const TUTORIAL_ANALYSIS_REPORTS = Object.freeze({
  daily: normalizeReport(FIXTURE_ANALYSIS?.reports?.daily, "daily"),
  weekly: normalizeReport(FIXTURE_ANALYSIS?.reports?.weekly, "weekly"),
  monthly: normalizeReport(FIXTURE_ANALYSIS?.reports?.monthly, "monthly"),
});

const fixtureWatashiMapLatest = normalizeWatashiMapReport(
  FIXTURE_SELF_STRUCTURE.latest ||
    FIXTURE_ANALYSIS?.watashi_map ||
    FIXTURE_ANALYSIS?.watashiMap
);
const fixtureWatashiMapContentJson = readFirstObject(fixtureWatashiMapLatest.content_json);
const fixtureWatashiMap = readFirstObject(
  fixtureWatashiMapLatest.watashiMap,
  fixtureWatashiMapContentJson.watashiMap
);

const FALLBACK_WATASHI_MAP = Object.freeze({
  version: "watashi.map.v1",
  status: "ok",
  label: "わたしマップ",
  report_mode: "light",
  visibility: Object.freeze({
    viewer_tier: "free",
    summary_visible: true,
    role_switches_visible: true,
    routes_visible: false,
    crossroads_visible: false,
    unknown_areas_visible: true,
    detail_report_visible: false,
    locked_sections: Object.freeze(["routes", "crossroads", "detail_report"]),
  }),
  overview: Object.freeze({
    title: "今のわたしマップ",
    summary: "生活の場面では、整える役割が立ち上がりやすく見えます。",
    active_contexts: Object.freeze([
      Object.freeze({ key: "daily_life", label: "生活", share_label: "少し見えてきました" }),
    ]),
    active_roles: Object.freeze([
      Object.freeze({ key: "organizer", label: "整える役割" }),
    ]),
    action_tendencies: Object.freeze([
      Object.freeze({ key: "prioritize", label: "先に整理する" }),
    ]),
    observation_amount: Object.freeze({ level: "medium", label: "少し見えてきました" }),
  }),
  role_switches: Object.freeze([
    Object.freeze({
      context: Object.freeze({ key: "daily_life", label: "生活", kind: "environment" }),
      role: Object.freeze({ key: "organizer", label: "整える役割" }),
      tendency_label: "立ち上がりやすい",
      score_display: "●●",
      evidence_count: 4,
      route_preview: "身の回りを少し整えて、気持ちを落ち着かせる流れが見えます。",
      safe_note: "これは性格タイプではなく、この場面で見えた動き方です。",
    }),
  ]),
  routes: Object.freeze([
    Object.freeze({
      title: "生活でよく通るルート",
      steps: Object.freeze([
        Object.freeze({ label: "場面", text: "少し散らかった状態に触れる" }),
        Object.freeze({ label: "役割スイッチ", text: "整える役割" }),
        Object.freeze({ label: "選びやすい行動", text: "机の上を少し片づける" }),
        Object.freeze({ label: "起こりやすい結果", text: "気持ちが少し落ち着きやすい" }),
      ]),
    }),
  ]),
  unknown_areas: Object.freeze([
    Object.freeze({
      label: "友人との場面",
      reason: "入力がまだ少なく、役割を言い切らない状態です。",
      next_observation_hint: "次に友人との関わりを入力すると、地図が見えやすくなります。",
    }),
  ]),
  detail_report: Object.freeze({
    title: "詳しい自己分析レポート",
    visible: false,
    lock_label: "詳しい自己分析レポートは Plus プラン以上で読めます。",
  }),
});

export const TUTORIAL_WATASHI_MAP = freezeClone(
  Object.keys(fixtureWatashiMap).length > 0 ? fixtureWatashiMap : FALLBACK_WATASHI_MAP
);

export const TUTORIAL_WATASHI_MAP_REPORT = freezeClone({
  ...fixtureWatashiMapLatest,
  id: compact(fixtureWatashiMapLatest.id) || "tutorial-watashi-map-latest",
  title: compact(fixtureWatashiMapLatest.title) || "今のわたしマップ",
  report_type: compact(fixtureWatashiMapLatest.report_type) || "self_structure",
  report_mode: compact(fixtureWatashiMapLatest.report_mode || fixtureWatashiMapLatest.reportMode) || "light",
  viewer_tier: compact(fixtureWatashiMapLatest.viewer_tier || fixtureWatashiMapLatest.viewerTier) || "free",
  period_label: compact(fixtureWatashiMapLatest.period_label || fixtureWatashiMapLatest.periodLabel) || "直近28日",
  content_text:
    compact(fixtureWatashiMapLatest.content_text || fixtureWatashiMapLatest.contentText) ||
    "人は、相手や場所によって少しずつ違う自分で動いています。",
  content_json: {
    ...fixtureWatashiMapContentJson,
    watashiMap: TUTORIAL_WATASHI_MAP,
  },
});

const tutorialWatashiMapOverview = readFirstObject(TUTORIAL_WATASHI_MAP.overview);
const tutorialWatashiMapRoleSwitch = readFirstObject(
  Array.isArray(TUTORIAL_WATASHI_MAP.role_switches) ? TUTORIAL_WATASHI_MAP.role_switches[0] : null,
  Array.isArray(TUTORIAL_WATASHI_MAP.roleSwitches) ? TUTORIAL_WATASHI_MAP.roleSwitches[0] : null
);
const tutorialWatashiMapContext = readFirstObject(tutorialWatashiMapRoleSwitch.context);
const tutorialWatashiMapRole = readFirstObject(tutorialWatashiMapRoleSwitch.role);
const tutorialWatashiMapAction = readFirstObject(
  Array.isArray(tutorialWatashiMapOverview.action_tendencies)
    ? tutorialWatashiMapOverview.action_tendencies[0]
    : null,
  Array.isArray(tutorialWatashiMapOverview.actionTendencies)
    ? tutorialWatashiMapOverview.actionTendencies[0]
    : null
);
const tutorialWatashiMapObservation = readFirstObject(
  tutorialWatashiMapOverview.observation_amount,
  tutorialWatashiMapOverview.observationAmount
);

export const TUTORIAL_WATASHI_MAP_PREVIEW = freezeClone({
  title: compact(tutorialWatashiMapOverview.title) || "今のわたしマップ",
  summary:
    compact(tutorialWatashiMapOverview.summary) ||
    "生活の場面では、整える役割が立ち上がりやすく見えます。",
  contextLabel: compact(tutorialWatashiMapContext.label) || "生活",
  roleLabel: compact(tutorialWatashiMapRole.label) || "整える役割",
  actionLabel: compact(tutorialWatashiMapAction.label) || "先に整理する",
  observationLabel: compact(tutorialWatashiMapObservation.label) || "少し見えてきました",
});

export const TUTORIAL_INTRO_FLOWCHART = Object.freeze({
  lead:
    "Emlis（エムリス）は、感情入力をすることで様々な体験ができるアプリです。\nここでは、感情入力からつながる主要な4つの要素を見ていきます。",
  source: Object.freeze({
    title: "感情入力",
    caption: "今の気持ちを言葉にする",
  }),
  connector: "4つの形で受け取れます",
  nodes: Object.freeze([
    Object.freeze({
      label: "その場で受け取る",
      title: "Emlisの観測",
    }),
    Object.freeze({
      label: "あとで振り返る",
      title: "こころ天気",
    }),
    Object.freeze({
      label: "自分の動き方を見る",
      title: "わたしマップ",
    }),
    Object.freeze({
      label: "考えを届ける・見る",
      title: "ピース",
    }),
  ]),
});

export const TUTORIAL_CONNECTION_ROWS = Object.freeze([
  Object.freeze({
    title: "Emlisの観測",
    description:
      "入力した気持ちを、その場でEmlisが観測して言葉にします。",
    example: "今の言葉を、ひとつの観測として受け取れます。",
  }),
  Object.freeze({
    title: "こころ天気",
    description:
      "入力が続くと、こころ天気（日/週/月）として振り返れます。",
    example: "自分の気持ちの流れを、天気のようにあとから見返せます。",
  }),
  Object.freeze({
    title: "わたしマップ",
    description:
      "場面ごとの役割スイッチと、選びやすい行動の流れを見られます。",
    example: `${TUTORIAL_WATASHI_MAP_PREVIEW.contextLabel}の場面では、${TUTORIAL_WATASHI_MAP_PREVIEW.roleLabel}が立ち上がりやすく見えます。`,
  }),
  Object.freeze({
    title: "ピース",
    description:
      "あなたの入力内容を、問いと答えに整えて投稿します。",
    example: "自分の価値観や考え方を投稿でき、他者の価値観や考え方を閲覧できます。",
  }),
]);

export const TUTORIAL_SELF_ANALYSIS_GUIDE = Object.freeze({
  title: "わたしマップ",
  body: [
    "人は、相手や場所によって少しずつ違う自分で動いています。",
    "わたしマップでは、あなたがどんな場面でどんな役割になりやすいか、そしてそのとき選びやすい行動を見ていきます。",
    `例：${TUTORIAL_WATASHI_MAP_PREVIEW.summary}`,
    "これは性格タイプではなく、入力から見えた場面ごとの動き方です。",
    "入口はFreeプランでも見られ、詳しい自己分析レポートはPlusプラン以上で読めます。",
  ].join("\n"),
  watashiMap: TUTORIAL_WATASHI_MAP,
});

export const TUTORIAL_OTHER_ELEMENTS_GUIDE = Object.freeze({
  title: "その他の機能",
  body:
    "Emlisには、感情通知やランキングなど、他にも楽しめる機能があります。\nチュートリアルが終わったら、アプリ内で確認してみてください。",
});
