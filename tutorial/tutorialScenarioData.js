const GENERATED_AT = "2026-05-02T09:30:00.000Z";

export const TUTORIAL_TOTAL_STEPS = 17;

export const TUTORIAL_INPUT_SAMPLE = Object.freeze({
  memo:
    "なんか少しだけ気分が軽い。\nやること全部はできてないけど、ひとつ片づいたからまあいいかって感じ。\nこういう小さいことで落ち着く日もあるんだな。",
  memoAction:
    "机の上を少し片づけた。\n好きな飲み物を用意して、少しゆっくりした。",
  emotions: Object.freeze([
    Object.freeze({ type: "平穏", strength: "medium" }),
    Object.freeze({ type: "喜び", strength: "weak" }),
    Object.freeze({ type: "不安", strength: "weak" }),
  ]),
  categories: Object.freeze(["生活", "健康", "価値観"]),
  sendEmotionNotification: true,
});

export const TUTORIAL_EMLIS_REPLY = Object.freeze({
  contextLabel: "感情入力から生成された応答",
  generatedBy: "emlis_ai_v2",
  commentText: `{displayName}さん、こんにちは。Emlisです。
今回は、平穏（中）を中心に、書いてくれた言葉そのものを見ながら受け取ります。
なんか少しだけ気分が軽いという出来事を、まずそのまま受け取りました。
中心としては平穏（中）を見ていますが、喜び（弱）、不安（弱）もなかったことにせず一緒に受け取ります。
その喜びは、小さく流さずに、一緒に大事なものとして受け取りたいです。
いつでも、あなたの言葉をEmlisは受け取ります。`,
});

const SELF_PIECE_BODY =
  "全部を終わらせられない日でも、ひとつ整えられたことを受け止める。小さな行動で気持ちを落ち着かせる時間を大切にしています。";

export const TUTORIAL_SELF_PIECE = Object.freeze({
  id: "tutorial-piece-self-20260502",
  q_instance_id: "tutorial-q-self-20260502",
  q_key: "generated:q:1046d3b900e70b3bab162096ecb96d44",
  title: "大切にしていることは？",
  question: "大切にしていることは？",
  body: SELF_PIECE_BODY,
  piece_text: SELF_PIECE_BODY,
  answer_display_text: SELF_PIECE_BODY,
  answer_display_state: "ready",
  answer_norm_hash:
    "515d1d48a4af852499056ebe1d82320870b478b41864a4f9fbfdeff2db6ed287",
  owner_user_id: "tutorial-self",
  display_name: "自分",
  share_code: "YOU",
  is_tutorial: true,
  tutorial_kind: "self",
  created_at: GENERATED_AT,
  resonances: 0,
  views: 0,
  is_new: true,
});

export const TUTORIAL_PIECE_PREVIEW = Object.freeze({
  preview_id: "tutorial-preview-self-20260502",
  question: TUTORIAL_SELF_PIECE.title,
  title: TUTORIAL_SELF_PIECE.title,
  q_key: TUTORIAL_SELF_PIECE.q_key,
  reflection_text: SELF_PIECE_BODY,
  piece_text: SELF_PIECE_BODY,
  answer_display_text: SELF_PIECE_BODY,
  answer_display_state: "ready",
  quota: Object.freeze({
    tier: "free",
    publish_limit: 5,
    remaining_count: 5,
    is_unlimited: false,
    display_text: "今月のPiece生成回数: Freeの５回",
  }),
  meta: Object.freeze({
    source_input_scope: "current_emotion_input",
    generated_from: "tutorial-fixed-sample",
  }),
});

const FOLLOWED_USER_PIECE_BODY =
  "全部が進んだわけではなくても、ひとつ整えられた感覚を大事にする。小さな落ち着きが、次の自分を支えてくれると思っています。";

export const TUTORIAL_FOLLOWED_USER_PIECE = Object.freeze({
  id: "tutorial-piece-user-20260502",
  q_instance_id: "tutorial-q-user-20260502",
  q_key: "generated:q:1046d3b900e70b3bab162096ecb96d44",
  title: "大切にしていることは？",
  question: "大切にしていることは？",
  body: FOLLOWED_USER_PIECE_BODY,
  piece_text: FOLLOWED_USER_PIECE_BODY,
  answer_display_text: FOLLOWED_USER_PIECE_BODY,
  answer_display_state: "ready",
  answer_norm_hash:
    "b7b251a6ed0331d6f23e329e491e8a1bac1a912927774eb86489b593025c0c9b",
  owner_user_id: "tutorial-follow-1",
  display_name: "User",
  share_code: "USER",
  is_tutorial: true,
  tutorial_kind: "mock",
  created_at: "2026-05-02T09:20:00.000Z",
  resonances: 4,
  views: 12,
  is_new: true,
});

export const TUTORIAL_PIECES = Object.freeze([
  TUTORIAL_SELF_PIECE,
  TUTORIAL_FOLLOWED_USER_PIECE,
]);

function buildTutorialReport({ type, title, periodStart, periodEnd, contentText }) {
  const reportContent = String(contentText || "").trim();
  return Object.freeze({
    report_type: type,
    title,
    period_start: periodStart,
    period_end: periodEnd,
    generated_at: GENERATED_AT,
    updated_at: GENERATED_AT,
    viewer_tier: "plus",
    content_text: reportContent,
    content_json: JSON.stringify({
      standardReport: {
        title,
        contentText: reportContent,
      },
    }),
  });
}

export const TUTORIAL_ANALYSIS_COUNTS = Object.freeze({
  today: 4,
  week: 21,
  month: 72,
});

export const TUTORIAL_ANALYSIS_REPORTS = Object.freeze({
  daily: buildTutorialReport({
    type: "daily",
    title: "日報：小さく整えた一日",
    periodStart: "2026-05-02",
    periodEnd: "2026-05-02",
    contentText:
      "この日は「平穏」と「喜び」が中心に現れていました。\n時間帯の雰囲気として、朝は「平穏」が多く見られました／昼は「喜び」が多く見られました／夜は「平穏」が多く見られました。\nメモから少しだけ：\n「窓を開けたら、少し気分が軽くなった。」\n「好きな飲み物を用意できて、少しうれしかった。」\n「やることが残っていて少し気になった。」\n1日おつかれさまでした。あなたの感じたことは、ここにちゃんと残っています。\n明日も、無理なく一言だけでも記録してみてください。",
  }),
  weekly: buildTutorialReport({
    type: "weekly",
    title: "週報：小さな切り替えが増えた週",
    periodStart: "2026-04-27",
    periodEnd: "2026-05-03",
    contentText:
      "この週は 平穏/喜び が中心に観測された。\n1週間、おつかれさまでした。小さな観測が積み上がっています。\n最近の週と比べて、切り替わりに大きな差は見られませんでした。\n最近の週と比べて、感情の強弱に大きな変化は見られませんでした。\n過去と比べて、分布の偏りに大きな変化は見られませんでした。\n補正ループ（不安→平穏→喜び）が2回観測されました。これまでと同様の構造が見られます。\n来週も同じ観測リズムを続けると、傾向がクリアになります。",
  }),
  monthly: buildTutorialReport({
    type: "monthly",
    title: "月報：整える行動が感情を支えた月",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    contentText:
      "今月は不安と平穏が中心に現れ、全体を通して緩やかなリズムが続いた。 第2週を境に、重心が不安から平穏方向へと移行した兆しがある。 モチーフ（peace→joy→peace）が月内で18回観測され、整え直す動きが印象的だった。\n今月も観測を続けられたこと自体が大切です。無理のないリズムで大丈夫です。\n主要なモチーフの出現回数を上に反映しました。\n重心の移動は段階的に進みました。\n来月は、今月の落ち着きがどの週で再現されるかを軽く観測してみましょう。",
  }),
});

export const TUTORIAL_CONNECTION_ROWS = Object.freeze([
  Object.freeze({
    title: "Emlisからの応答",
    description:
      "入力した独り言をEmlisが受け取り、その場で短く返答します。",
    example: "今回の入力から実生成した応答を表示します。",
  }),
  Object.freeze({
    title: "分析レポート",
    description:
      "入力が積み重なると、日報・週報・月報として振り返れます。",
    example: "日々入力したユーザーを想定した実生成レポートを表示します。",
  }),
  Object.freeze({
    title: "Piece",
    description:
      "ラフな独り言が、問いと答えとして読みやすい形に整えられます。",
    example: "今回の入力から実生成した問いと答えを表示します。",
  }),
]);

export const TUTORIAL_SELF_ANALYSIS_GUIDE = Object.freeze({
  title: "自己分析レポート",
  body:
    "自己分析レポートでは、日々の感情入力をもとに、自分の考え方や感情の傾向をより深く振り返ることができます。\nこのレポートは、サブスク加入後に閲覧できます。",
});


export const TUTORIAL_OTHER_ELEMENTS_GUIDE = Object.freeze({
  title: "その他の機能",
  body: `Emlisには、感情通知やランキングなど、入力後に広がる機能もあります。
ここではすべてを細かく説明しません。チュートリアル後に、ご自身のペースで確認してみてください。`,
});
