import { guideTermsJa } from "./termsJa";

export function normalizeGuideScreenId(raw) {
  const source = String(raw || "").trim();
  if (!source) return "unknown";

  const lower = source.toLowerCase();

  if (lower === "home" || lower === "input" || lower.includes("input")) {
    return "home";
  }
  if (lower === "analysis" || lower.includes("analysis")) {
    return "analysis";
  }
  if (
    lower === "piece" ||
    lower.includes("piece") ||
    lower === "nexus" ||
    lower.includes("nexus")
  ) {
    return "piece";
  }
  if (
    lower === "emotionlog" ||
    lower === "emotion_log" ||
    lower === "emotion-log" ||
    lower.includes("emotionlog") ||
    lower.includes("emotion_log") ||
    lower.includes("emotion-log")
  ) {
    return "emotionlog";
  }
  if (lower === "ranking" || lower.includes("ranking")) {
    return "ranking";
  }

  return lower;
}

export const guidesJa = Object.freeze({
  home: {
    title: "ホーム",
    summary:
      "思考・行動・感情を記録し、Emlisの観測やピース生成につなげる入り口です。",
    relatedTerms: [
      "emotion_input",
      "thought_content",
      "action_content",
      "content_category",
      "self_insight_mode",
      "emotion_notifications",
      "piece",
      "today_question",
      "emlis_reply",
    ],
    blocks: [
      {
        type: "p",
        text:
          "Home は、今の状態を [[term:emotion_input|感情入力]] として残す場所です。[[term:thought_content|思考内容]] と [[term:action_content|行動内容]] を分けて書けるので、頭の中で考えていることと、実際に起きたことを整理しながら記録できます。",
      },
      {
        type: "h2",
        text: "入力する内容",
      },
      {
        type: "ul",
        items: [
          "思考内容には、考えていること・感じたこと・解釈したことを書きます。",
          "行動内容には、実際に起きた出来事・自分がしたこと・その結果を書きます。",
          "感情は複数選択できます。[[term:self_insight_mode|自己理解]] は他の感情と同時に選ばず、単体で使います。",
          "思考内容または行動内容を書いた場合は、近い [[term:content_category|内容カテゴリ]] を1つ以上選びます。",
        ],
      },
      {
        type: "h2",
        text: "保存とピース生成",
      },
      {
        type: "ul",
        items: [
          "「この内容でOK」を押すと入力が保存され、[[term:emlis_reply|Emlisの観測]] を確認できます。",
          "「ピースを生成する」を押すと、入力内容から公開用の [[term:piece|ピース]] を作る流れに進みます。",
          "「[[term:emotion_notifications|感情通知を送らない]]」をオンにすると、その入力はフォロー中ユーザーへ通知されません。",
          "[[term:today_question|今日の問い]] と入力履歴も、Home から確認できます。",
        ],
      },
      {
        type: "note",
        text:
          "長文でなくても大丈夫です。短い言葉でも、思考・行動・感情・カテゴリがそろうほど、後から分析やピースに活かしやすくなります。",
      },
    ],
  },
  analysis: {
    title: "分析",
    summary:
      "感情分析のこころ天気とわたしマップを切り替えながら、最新レポートと履歴を確認する場所です。",
    relatedTerms: [
      "analysis",
      "emotion_analysis",
      "analysis_report",
      "self_analysis",
      "emotion_input_history",
      "today_question_history",
    ],
    blocks: [
      {
        type: "p",
        text:
          "分析画面では、Home に積み重なった入力を [[term:emotion_analysis|感情分析]] のこころ天気と [[term:self_analysis|わたしマップ]] に分けて確認できます。最新の内容がある場合は、画面の中に直接レポートが表示されます。",
      },
      {
        type: "h2",
        text: "感情分析",
      },
      {
        type: "ul",
        items: [
          "こころ天気（日）・こころ天気（週）・こころ天気（月）を切り替えて、期間ごとの [[term:analysis_report|分析レポート]] を確認できます。",
          "最新レポートがまだない場合は、入力後にレポートが作成されるとこの画面に表示されます。",
          "各タブの「履歴を見る」から、過去のこころ天気（日/週/月）を見返せます。",
        ],
      },
      {
        type: "h2",
        text: "わたしマップ",
      },
      {
        type: "ul",
        items: [
          "人は、相手や場所によって少しずつ違う自分で動いています。わたしマップでは、あなたがどんな場面でどんな役割になりやすいか、そしてそのとき選びやすい行動を見ていきます。",
          "わたしマップは性格タイプを決めるものではなく、入力から見えた場面ごとの役割と行動パターンを整理する場所です。",
          "わたしマップの入口はFreeプランでも見られます。Plusプラン以上では、役割スイッチの一覧、よく通るルート、詳しい自己分析レポートを読めます。",
          "入力が少ない場面は、まだ地図にない場所として表示し、無理に断定しません。",
          "わたしマップの履歴から、過去の詳しい自己分析レポートも見返せます。",
        ],
      },
      {
        type: "note",
        text:
          "[[term:today_question_history|今日の問い履歴]] や [[term:emotion_input_history|入力履歴]] も、振り返りに使えます。",
      },
    ],
  },
  piece: {
    title: "ピース",
    summary:
      "投稿・感情通知・おすすめ・履歴を切り替えて、ピースとフォロー中ユーザーの流れを見る場所です。",
    relatedTerms: [
      "piece_screen",
      "piece",
      "kyomei",
      "follow",
      "emotion_log",
      "emotion_notifications",
      "reaction_history",
      "private_account",
    ],
    blocks: [
      {
        type: "p",
        text:
          "ピース画面は、公開された [[term:piece|ピース]] と [[term:follow|フォロー機能]] を中心に使う場所です。自分やフォロー中ユーザーの投稿を読み、必要に応じて [[term:kyomei|共鳴]] できます。",
      },
      {
        type: "h2",
        text: "4つのタブ",
      },
      {
        type: "ul",
        items: [
          "投稿では、自分とフォロー中ユーザーのピースを一覧で確認できます。",
          "[[term:emotion_log|感情通知]] では、フォロー中ユーザーが入力した感情の流れを確認できます。",
          "おすすめでは、フォロー候補のユーザーを確認できます。",
          "[[term:reaction_history|履歴]] では、自分が共鳴したピースを新しい順・古い順で見返せます。",
        ],
      },
      {
        type: "h2",
        text: "フォロー機能",
      },
      {
        type: "ul",
        items: [
          "ユーザーをフォローすると、そのユーザーのピースや感情通知を見やすくなります。",
          "右上の人アイコンから、自分のフォローリストを開けます。",
          "フォロー中ユーザーごとに、感情通知のON/OFFを切り替えられます。",
          "アカウントを [[term:private_account|非公開]] にすると、フォロー時に承認が必要になり、おすすめにも表示されなくなります。",
        ],
      },
      {
        type: "h2",
        text: "表示の切り替え",
      },
      {
        type: "ul",
        items: [
          "投稿タブでは、表示ユーザーを「自分 + フォロー中」「自分のみ」「特定のフォロー中ユーザー」から選べます。",
          "投稿は新しい順・古い順、履歴も新しい順・古い順で表示を切り替えられます。",
          "右上の更新ボタンで、ピース・感情通知・おすすめ・履歴を再読み込みできます。",
        ],
      },
      {
        type: "note",
        text:
          "感情通知に表示されるのは主に感情と強さです。メモ本文がそのまま表示されるわけではありません。共有したくない入力は、Home の「[[term:emotion_notifications|感情通知を送らない]]」で調整できます。",
      },
    ],
  },
  emotionlog: {
    title: "感情通知",
    summary:
      "感情通知は、ピース画面のタブとしてフォロー中ユーザーの感情の流れを確認する機能です。",
    relatedTerms: [
      "follow",
      "emotion_log",
      "emotion_input",
      "emotion_notifications",
    ],
    blocks: [
      {
        type: "p",
        text:
          "[[term:emotion_log|感情通知]] では、[[term:follow|フォロー機能]] でつながっているユーザーの [[term:emotion_input|感情入力]] の流れを確認できます。現在は、ピース画面の「感情通知」タブにまとまっています。",
      },
      {
        type: "h2",
        text: "できること",
      },
      {
        type: "ul",
        items: [
          "フォロー中ユーザーの感情入力を通知として受け取る",
          "ピース画面の感情通知タブで、感情の流れを確認する",
          "フォローリストで、ユーザーごとに感情通知の受信を切り替える",
        ],
      },
      {
        type: "h2",
        text: "知っておきたいこと",
      },
      {
        type: "p",
        text:
          "通知に共有されるのは主に感情選択の情報で、メモの本文までそのまま渡るわけではありません。必要以上に言語化せず、感情だけを受け取れるのが特徴です。",
      },
      {
        type: "note",
        text:
          "自分の入力を共有したくないときは、Home 側の [[term:emotion_notifications|感情通知を送らない]] を使って調整できます。",
      },
    ],
  },
  ranking: {
    title: "ランキング",
    summary:
      "複数のランキングをカードで確認し、上位プレビューから全表示へ進める画面です。",
    relatedTerms: ["ranking_preview", "kyomei", "private_account"],
    blocks: [
      {
        type: "p",
        text:
          "Ranking は、アプリ内の活動状況をランキングカードで確認する場所です。各カードには上位の [[term:ranking_preview|プレビュー]] が表示され、「全表示」から詳細画面へ進めます。",
      },
      {
        type: "h2",
        text: "見られるランキング",
      },
      {
        type: "ul",
        items: [
          "連続ログイン日数ランキング",
          "入力数ランキング",
          "入力文字数ランキング",
          "[[term:kyomei|共鳴]] 数ランキング",
        ],
      },
      {
        type: "h2",
        text: "表示の見方",
      },
      {
        type: "ul",
        items: [
          "各カードでは、上位ユーザー・順位・数値をまとめて確認できます。",
          "ユーザーが [[term:private_account|非公開]] の場合は、名前の横に盾アイコンが表示されます。",
          "集計の区切りは日本時間（JST）0:00です。",
        ],
      },
    ],
  },
  unknown: {
    title: "ガイド",
    summary: "この画面の説明はまだ準備中です。",
    relatedTerms: [],
    blocks: [
      {
        type: "p",
        text:
          "この画面のガイドはまだ準備中です。今後のアップデートで内容を追加します。",
      },
    ],
  },
});

export function getGuideContent(screenIdRaw) {
  const screenId = normalizeGuideScreenId(screenIdRaw);
  return guidesJa[screenId] || guidesJa.unknown;
}

export function getKnownGuideTermIds() {
  return Object.keys(guideTermsJa);
}
