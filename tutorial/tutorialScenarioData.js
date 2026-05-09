import tutorialFixtures from "./generated/tutorialFixtures.generated.json";

export const TUTORIAL_TOTAL_STEPS = 19;

const FIXTURES = tutorialFixtures && typeof tutorialFixtures === "object" ? tutorialFixtures : {};
const FIXTURE_INPUT = FIXTURES.input && typeof FIXTURES.input === "object" ? FIXTURES.input : {};
const FIXTURE_PIECE = FIXTURES.piece && typeof FIXTURES.piece === "object" ? FIXTURES.piece : {};
const FIXTURE_ANALYSIS = FIXTURES.analysis && typeof FIXTURES.analysis === "object" ? FIXTURES.analysis : {};

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

function withEmlisReading(value) {
  const raw = compact(value);
  if (!raw) return "";
  return raw
    .replaceAll("Emlis（エムリス）", "Emlis")
    .replaceAll("Emlis", "Emlis（エムリス）");
}

function readFirstObject(...values) {
  for (const value of values) {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  }
  return {};
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

const fixturePreview = readFirstObject(FIXTURE_PIECE.preview);
const fixturePublish = readFirstObject(FIXTURE_PIECE.publish);
const fixtureEmlisReply = readFirstObject(FIXTURES.emlis_reply, fixturePublish.input_feedback);
const fixtureFeedItems = Array.isArray(FIXTURE_PIECE.feed_items)
  ? FIXTURE_PIECE.feed_items.filter(Boolean)
  : [];

export const TUTORIAL_HAS_VALID_FIXTURES =
  FIXTURES?.validation?.passed === true &&
  compact(fixturePreview.piece_text) &&
  compact(fixtureEmlisReply.comment_text) &&
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
  commentText: withEmlisReading(fixtureEmlisReply.comment_text),
  meta: freezeClone(fixtureEmlisReply.emlis_ai || {}),
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

export const TUTORIAL_INTRO_FLOWCHART = Object.freeze({
  lead:
    "Emlis（エムリス）は、感情入力をすることで様々な体験ができるアプリです。\nここでは、感情入力からつながる主要な3つの要素を見ていきます。",
  source: Object.freeze({
    title: "感情入力",
    caption: "今の気持ちを言葉にする",
  }),
  connector: "3つの形で受け取れます",
  nodes: Object.freeze([
    Object.freeze({
      label: "その場で受け取る",
      title: "Emlis（エムリス）からの応答",
    }),
    Object.freeze({
      label: "あとで振り返る",
      title: "分析レポート",
    }),
    Object.freeze({
      label: "考えを届ける・見る",
      title: "ピース",
    }),
  ]),
});

export const TUTORIAL_CONNECTION_ROWS = Object.freeze([
  Object.freeze({
    title: "Emlis（エムリス）からの応答",
    description:
      "入力した気持ちを、その場でEmlis（エムリス）が受け取って返答します。",
    example: "今の言葉を、ひとつの返答として受け取れます。",
  }),
  Object.freeze({
    title: "分析レポート",
    description:
      "入力が続くと、日報・週報・月報として振り返れます。",
    example: "自分の気持ちの流れを、あとから見返せます。",
  }),
  Object.freeze({
    title: "ピース",
    description:
      "あなたの入力内容を、問いと答えに整えて投稿します。",
    example: "自分の価値観や考え方を投稿でき、他者の価値観や考え方を閲覧できます。",
  }),
]);

export const TUTORIAL_SELF_ANALYSIS_GUIDE = Object.freeze({
  title: "自己分析レポート",
  body:
    "自己分析レポートでは、日々の感情入力をもとに、自分の考え方や感情の傾向をより深く振り返ることができます。\nこのレポートは、サブスク加入後に閲覧できます。",
});

export const TUTORIAL_OTHER_ELEMENTS_GUIDE = Object.freeze({
  title: "その他の機能",
  body:
    "Emlis（エムリス）には、感情通知やランキングなど、他にも楽しめる機能があります。\nチュートリアルが終わったら、アプリ内で確認してみてください。",
});
