import { guideTermsJa } from "./termsJa";
import { CATEGORY_OPTIONS } from "../screens/input/inputOptions";

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

  return lower;
}

export const guidesJa = Object.freeze({
  home: {
    title: "感情入力",
    blocks: [
      {
        type: "h2",
        text: "気持ちや出来事を記録する",
      },
      {
        type: "ul",
        items: [
          "ホームの [[term:emotion_input|感情入力]] では、「考えたこと・感じたこと」に自分の思いや受け取り方を、「出来事・行動」に起きたことや自分がしたことを書きます。本文はどちらか一方だけでも保存できます。",
          "喜び・悲しみ・怒り・不安・平穏から当てはまる感情を複数選べます。それぞれの強さは弱・中・強から選びます。自分についての気づきを残すときは [[term:self_insight_mode|自己理解]] を単独で選べます。",
          `[[term:content_category|内容カテゴリ]] は${CATEGORY_OPTIONS.join("・")}から1つ以上選びます。「この内容でOK」で保存し、「入力履歴」から見返せます。`,
        ],
      },
      {
        type: "h2",
        text: "Emlisからの応答と問い",
      },
      {
        type: "ul",
        items: [
          "Emlisは、保存した記録から読み取った気持ちや気づきに沿って言葉を返します。用意できた [[term:emlis_reply|Emlisからの応答]] は「入力履歴」からも読めます。",
          "ホームで「Emlisからの問いを受け取る」をオンにすると、必要に応じて今回の記録について問いが届きます。答えると、その言葉を踏まえた応答を受け取れます。「今回はスキップ」で回答を省けます。",
          "問いは一度に1つで、1件の記録につき最大3問です。設定をオフにしてもEmlisの応答は受け取れます。",
        ],
      },
    ],
  },
  analysis: {
    title: "分析",
    blocks: [
      {
        type: "h2",
        text: "こころグラフ",
      },
      {
        type: "p",
        text: "[[term:emotion_analysis|こころグラフ]] は「今日・週・月」で切り替えます。「今日の感情」は当日の感情の内訳、週・月の棒グラフは選んだ日の内訳を確認できます。日・週・月のグラフは全プランで見られます。",
      },
      {
        type: "h2",
        text: "わたしマップ",
      },
      {
        type: "p",
        text: "[[term:self_analysis|わたしマップ]] では、自分が何を大切にして場面ごとにどう選んできたかを、記録をもとに文章や図で振り返れます。",
      },
      {
        type: "h2",
        text: "もしもルート",
      },
      {
        type: "p",
        text: "今のわたしマップの図で、考えたい項目や関係を開き、「この分岐を考える」を選びます。別の選択をした場合に考えられる条件を見比べ、気になる案は「この方向を保存」で残せます。",
      },
      {
        type: "note",
        text: "もしもルートはPremiumプラン限定です。",
      },
    ],
  },
  piece: {
    title: "ピース",
    blocks: [
      {
        type: "h2",
        text: "画像を編集する",
      },
      {
        type: "ul",
        items: [
          "Emlisからの応答画面の「ピースの作成」から、保存した記録を [[term:piece|ピース]] にできます。",
          "対応するiOS版では、プレビューの「配色」などから見た目を変えられます。Freeでは「ソフトペーパー」「静かな夜」の2色から選べます。",
        ],
      },
      {
        type: "note",
        text: "配色の追加、文字サイズ・文字の配置・比率・ロゴの変更はPlus・Premiumプラン限定です。書体・文字色・背景・枠・飾りの変更はPremiumプラン限定です。",
      },
      {
        type: "h2",
        text: "保存したピースを開く",
      },
      {
        type: "p",
        text: "「保存」で自分用に非公開で残せます。ピース画面の「自分のピースを開く」から見返せます。対応端末では「画像を保存」から写真への保存や共有に進めます。",
      },
    ],
  },
  emotionlog: {
    title: "フォロー機能",
    blocks: [
      {
        type: "h2",
        text: "フォローする",
      },
      {
        type: "p",
        text: "気になる人を [[term:follow|フォロー]] するには、相手のプロフィールで「フォローする」を押します。非公開アカウントは相手の承認が必要です。自分のフォローリストは、設定の「アカウント」で「フォロー数」か「フォロワー数」を押すと開けます。",
      },
      {
        type: "h2",
        text: "ピースの投稿を見る・投稿する",
      },
      {
        type: "ul",
        items: [
          "ピース画面の「投稿」では、自分が投稿したピースと、フォロー中の人があなたに公開したピースを読めます。",
          "自分のピースのプレビューや詳細に「アプリ内に投稿する」が表示される場合は、投稿先を確認して進めます。自分と、投稿の公開を許可したフォロワーが読めます。詳細の「投稿を取り下げる」で公開を取り消せます。",
        ],
      },
      {
        type: "h2",
        text: "感情通知を受け取る・送る",
      },
      {
        type: "ul",
        items: [
          "フォロー中の人から感情通知が届くと、ピース画面の「[[term:emotion_log|感情通知]]」で感情・強さ・時刻を確認できます。メモ本文は本人の記録に残ります。",
          "自分の感情通知は、公開を許可し、受け取る設定もオンにしているフォロワーに届きます。その記録だけ止めたいときは、ホームで「[[term:emotion_notifications|今回だけ感情通知を送らない]]」をオンにします。",
        ],
      },
      {
        type: "h2",
        text: "相手ごとの設定",
      },
      {
        type: "ul",
        items: [
          "フォローリストの「フォロー中」で、相手からの感情通知をベルのボタンでオン・オフにできます。",
          "「フォロワー」の三点ボタンからは、自分のピース投稿と感情通知を、その相手に公開するか個別に設定できます。",
        ],
      },
    ],
  },
  unknown: {
    title: "ガイド",
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
