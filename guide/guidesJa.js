import { guideTermsJa } from "./termsJa";

export function normalizeGuideScreenId(raw) {
  const source = String(raw || "").trim();
  if (!source) return "unknown";

  const lower = source.toLowerCase();

  if (lower === "home" || lower === "input" || lower.includes("input")) {
    return "home";
  }
  if (lower === "myweb" || lower.includes("myweb")) {
    return "myweb";
  }
  if (lower === "mymodel" || lower.includes("mymodel")) {
    return "mymodel";
  }
  if (
    lower === "friend" ||
    lower === "friends" ||
    lower.includes("friend")
  ) {
    return "friend";
  }
  if (lower === "ranking" || lower.includes("ranking")) {
    return "ranking";
  }

  return lower;
}

export const guidesJa = Object.freeze({
  home: {
    title: "Home",
    summary:
      "今の感情や気づきを記録する入り口です。感情の流れを残し、自分をあとから振り返りやすくします。",
    relatedTerms: [
      "emotion_input",
      "self_insight_mode",
      "secret_memo",
      "friend_notifications",
      "today_question",
    ],
    blocks: [
      {
        type: "p",
        text:
          "Home は、[[term:emotion_input|感情入力]]を行う場所です。今この瞬間の気持ちを残すことで、あとから自分の流れを振り返りやすくなります。",
      },
      {
        type: "h2",
        text: "できること",
      },
      {
        type: "ul",
        items: [
          "感情とその強さを選び、その時点の状態を記録する",
          "必要に応じてメモを書き、内容を [[term:secret_memo|シークレットメモ]] として扱う",
          "[[term:today_question|今日の問い]] を確認し、その日の問いに答える",
        ],
      },
      {
        type: "h2",
        text: "使い分け",
      },
      {
        type: "p",
        text:
          "気づきや発見を言葉で整理したいときは [[term:self_insight_mode|自己理解モード]] が向いています。通常の感情入力は「今の気持ち」を素早く残すためのもの、自己理解モードは「自分について分かったこと」を丁寧に残すためのものです。",
      },
      {
        type: "note",
        text:
          "フレンドへの共有を抑えたいときは「[[term:friend_notifications|フレンドに通知しない]]」を切り替えて使います。",
      },
    ],
  },
  myweb: {
    title: "MyWeb",
    summary:
      "入力した内容やレポートを振り返る場所です。過去の記録を見直し、自分の傾向を確認できます。",
    relatedTerms: [
      "myweb",
      "emotion_input_history",
      "today_question_history",
      "analysis_report",
    ],
    blocks: [
      {
        type: "p",
        text:
          "[[term:myweb|MyWeb]] は、入力した自己情報や履歴を見返すための場所です。日々の積み重ねを後から整理したいときに使います。",
      },
      {
        type: "h2",
        text: "できること",
      },
      {
        type: "ul",
        items: [
          "[[term:emotion_input_history|感情入力履歴]] を確認し、過去の入力を検索する",
          "[[term:today_question_history|今日の問い履歴]] を開き、その日に答えた内容を見返す",
          "[[term:analysis_report|分析レポート]] を読み、入力傾向から見える特徴を確認する",
        ],
      },
      {
        type: "h2",
        text: "見方のコツ",
      },
      {
        type: "p",
        text:
          "履歴だけでも流れは追えますが、メモも一緒に残していくと [[term:analysis_report|分析レポート]] の密度が上がり、振り返りの解像度も高くなります。",
      },
      {
        type: "note",
        text:
          "「あとで見返す場所」という感覚で使うと、Home で行った入力と役割の違いが分かりやすくなります。",
      },
    ],
  },
  mymodel: {
    title: "MyModel",
    summary:
      "入力した自己情報をもとに作られた自己モデルを扱う場所です。問いと答えを通じて、自分や他者への理解を深めます。",
    relatedTerms: [
      "mymodel",
      "reflection",
      "reflection_create",
      "kyomei",
      "hakken",
      "reaction_history",
    ],
    blocks: [
      {
        type: "p",
        text:
          "[[term:mymodel|MyModel]] は、入力した自己情報をもとに構築された自己モデルを扱う場所です。問いに答えたり、他ユーザーの内容を読んだりすることで、理解を深めていきます。",
      },
      {
        type: "h2",
        text: "できること",
      },
      {
        type: "ul",
        items: [
          "[[term:reflection_create|ReflectionCreate]] で問いに答え、新しい [[term:reflection|Reflection]] を作る",
          "自分やフォロー中ユーザーの [[term:reflection|Reflection]] を読む",
          "内容に対して [[term:kyomei|共鳴]] や [[term:hakken|発見]] を送り、反応を残す",
          "受け取った反応や自分の反応を [[term:reaction_history|履歴]] で確認する",
        ],
      },
      {
        type: "h2",
        text: "使い方のイメージ",
      },
      {
        type: "p",
        text:
          "Home や MyWeb に蓄積された情報が土台になり、MyModel ではそれを「問いと答え」の形で立体的に扱います。読むだけでも使えますが、答えていくほど自分の輪郭が見えやすくなります。",
      },
      {
        type: "note",
        text:
          "MyModel は単なる閲覧画面ではなく、問いに答えたり、他者に反応したりしながら育っていく場所です。",
      },
    ],
  },
  friend: {
    title: "Friend",
    summary:
      "フレンド登録やフレンドログを扱う場所です。相手の感情入力を、言葉を介しすぎずに受け取れます。",
    relatedTerms: [
      "friend",
      "friend_log",
      "emotion_input",
      "friend_notifications",
    ],
    blocks: [
      {
        type: "p",
        text:
          "[[term:friend|Friend]] は、他ユーザーとのつながりを扱う場所です。フレンドになると、相手が行った [[term:emotion_input|感情入力]] の情報を受け取れるようになります。",
      },
      {
        type: "h2",
        text: "できること",
      },
      {
        type: "ul",
        items: [
          "フレンド申請や承認を行う",
          "[[term:friend_log|フレンドログ]] で、フレンドの感情入力の流れを確認する",
          "相手の状態変化を、言葉よりも感情のレベルで受け取る",
        ],
      },
      {
        type: "h2",
        text: "知っておきたいこと",
      },
      {
        type: "p",
        text:
          "フレンドに共有されるのは主に感情選択の情報で、メモの本文までそのまま渡るわけではありません。必要以上に言語化せず、感情だけを受け取れるのが特徴です。",
      },
      {
        type: "note",
        text:
          "自分の入力を共有したくないときは、Home 側の [[term:friend_notifications|フレンドに通知しない]] を使って調整できます。",
      },
    ],
  },
  ranking: {
    title: "Ranking",
    summary:
      "ランキングを閲覧する画面です。上位ユーザーやアクティブなユーザーを見つけることができます。",
    relatedTerms: [],
    blocks: [
      {
        type: "p",
        text:
          "Ranking は、アプリ内での活動状況を一覧で見る場所です。上位ユーザーを見つけたいときに使います。",
      },
      {
        type: "ul",
        items: [
          "複数のランキング項目を切り替えて閲覧する",
          "気になるユーザーを見つけてアカウントページへ進む",
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
