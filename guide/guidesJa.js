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
    title: "ホーム",
    summary:
      "思考・行動・感情を記録し、Emlisの応答やピース作成につなげる入り口です。",
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
    "type": "p",
    "text": "ホームは、今の状態を [[term:emotion_input|感情入力]] として残す場所です。[[term:thought_content|思考内容]] と [[term:action_content|行動内容]] を分けて書けます。"
  },
  {
    "type": "h2",
    "text": "入力する内容"
  },
  {
    "type": "ul",
    "items": [
      "「考えたこと・感じたこと」（思考内容）には、考えていること・感じたこと・出来事への解釈を書きます。",
      "「出来事・行動」（行動内容）には、実際に起きた出来事・自分がしたこと・その結果を書きます。",
      "感情は、喜び・悲しみ・怒り・不安・平穏から複数選択できます。選んだ感情ごとに、強さを弱・中・強から選びます。",
      "[[term:self_insight_mode|自己理解]] は他の感情と同時に選ばず、単体で使います。自己理解には強さを選ぶ操作はありません。",
      `[[term:content_category|内容カテゴリ]] は${CATEGORY_OPTIONS.join("・")}の${CATEGORY_OPTIONS.length}種類です。入力内容に近いものを1つ以上選び、複数選択もできます。`
    ]
  },
  {
    "type": "h2",
    "text": "入力の保存とEmlisの応答"
  },
  {
    "type": "ul",
    "items": [
      "「この内容でOK」で入力を保存します。応答が用意されると「Emlisからの応答」が開きます。",
      "入力履歴から過去の記録を開き、保存済みの [[term:emlis_reply|Emlisの応答]] を読み返せます。応答が用意できない場合も、保存された入力は残ります。",
      "入力履歴の「通常のみ」「Secretのみ」は自分が保存した記録の絞り込みです。本文を他のユーザーへ公開する設定や、感情通知の送信設定とは別です。",
      "「[[term:emotion_notifications|感情通知を送らない]]」をオンにすると、その入力はフォロー中ユーザーへ通知されません。"
    ]
  },
  {
    "type": "h2",
    "text": "ピースを作る"
  },
  {
    "type": "ul",
    "items": [
      "応答画面の「ピースの作成」から、対応する保存済み記録を [[term:piece|ピース]] にできます。",
      "作成画面で本文とデザインを確認し、非公開で保存します。",
      "「背景と文字色」が表示される場合は、色見本から好きな組み合わせを選べます。",
      "Premiumで「文章の形式」が表示される場合は、その記録に合う形式の中から選び直せます。",
      "保存したピースは、ピース画面の「自分のPieceを開く」から見返せます。対応端末では画像の保存・共有もできます。"
    ]
  },
  {
    "type": "note",
    "text": "長文でなくても構いません。[[term:today_question|今日の問い]] や入力履歴もホームから開けます。"
  }
],
  },
  analysis: {
    title: "分析",
    summary:
      "今日・週・月の感情の推移と、わたしマップを確認する場所です。",
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
          "「今日の感情」では、今日0:00から現在までに入力した感情を、円グラフと時間帯ごとの内訳で振り返れます。[[term:emotion_analysis|こころグラフ]] は感情の推移と短い結果説明、[[term:self_analysis|わたしマップ]] は蓄積した入力からの分析を表示します。",
      },
      {
        type: "h2",
        text: "感情分析",
      },
      {
        type: "ul",
        items: [
          "こころグラフ（日）・こころグラフ（週）・こころグラフ（月）は「今日・週・月」で切り替えます。週と月は日ごとの積み上げ棒グラフで、選択した日の感情の内訳を確認できます。",
          "割合には、選んだ感情と強さ（弱1・中2・強3）を反映します。自己理解タグは感情の割合へ含めません。記録のない時間・日は補わず、未来の感情は予測しません。",
          "前後の矢印で閲覧範囲内の過去期間へ移動できます。「履歴を見る」では保存済みのこころグラフ（日/週/月）も確認できます。",
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
          "現在のマップは、蓄積した入力全体を対象に全プラン共通で表示します。解析できていない範囲がある場合は、件数を案内します。",
          "記録から確認できる範囲を表示し、入力が足りない場合はその旨を案内します。",
          "各月で最初に正常取得できた累積マップを、その月の版として保存します。保存済みの月を選び、当時の文章・図と現在のマップを見比べられます。保存のない過去月は作り直しません。",
          "月次履歴の閲覧はFreeが直近2回分、Plusが直近12回分、Premiumが全期間です。プラン変更だけで保存済みのマップを削除することはありません。元入力の削除・退会に伴う削除は別です。",
          "「根拠の記録を見る」から、その観測に結び付いた原入力や補足を確認できます。分析後に記録が編集されている場合は、現在の内容であることを表示します。",
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
      "保存した自分のピースを見返し、投稿・感情通知・おすすめ・共鳴を確認する場所です。",
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
    "type": "p",
    "text": "[[term:piece|ピース]] は、入力した自分の言葉を残したり、画像として持ち出したりするためのものです。自分だけで保存することと、アプリ内へ公開することは別です。"
  },
  {
    "type": "h2",
    "text": "自分のピースを見返す"
  },
  {
    "type": "ul",
    "items": [
      "「自分のPieceを開く」から、保存した自分のピースの一覧と詳細を開けます。",
      "入力した本文をもとに、必要に応じて読みやすく整えます。選択した感情の説明文は追加しません。",
      "対応端末では、詳細の「画像の保存・共有を準備」から画像を用意し、「写真に保存」または「画像を共有」を選べます。"
    ]
  },
  {
    "type": "h2",
    "text": "4つのタブ"
  },
  {
    "type": "ul",
    "items": [
      "「投稿」では、自分とフォロー中ユーザーの投稿を確認できます。",
      "「[[term:emotion_log|感情通知]]」では、フォロー中ユーザーが入力した感情の流れを確認できます。",
      "「おすすめ」では、フォロー候補のユーザーを確認できます。",
      "「[[term:reaction_history|共鳴]]」では、自分が共鳴したピースを見返せます。自分が保存したピースの一覧とは別です。"
    ]
  },
  {
    "type": "h2",
    "text": "フォローと表示の切り替え"
  },
  {
    "type": "ul",
    "items": [
      "右上の人アイコンから [[term:follow|フォローリスト]] を開けます。ユーザーごとに感情通知の受信を切り替えられます。",
      "投稿の表示対象は「自分 + フォロー中」「自分のみ」「特定のフォロー中ユーザー」から選べます。",
      "投稿と共鳴履歴は、新しい順・古い順に切り替えられます。",
      "右上の更新ボタンで、表示中の内容を読み直せます。",
      "アカウントを [[term:private_account|非公開]] にすると、新しくフォローされる際に承認が必要になり、おすすめにも表示されなくなります。"
    ]
  },
  {
    "type": "note",
    "text": "外部へ保存・共有した画像は、アプリ内のピースを削除・非公開にしても回収できません。感情通知の画面には感情・強さ・時刻を表示し、メモ本文は表示しません。"
  }
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
          "感情通知の画面には感情・強さ・時刻を表示し、メモ本文は表示しません。",
      },
      {
        type: "note",
        text:
          "その入力の感情通知を送りたくないときは、Home 側の [[term:emotion_notifications|感情通知を送らない]] を使って調整できます。",
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
