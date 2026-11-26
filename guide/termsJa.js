import { CATEGORY_OPTIONS } from "../screens/input/inputOptions";

export const guideTermsJa = Object.freeze({
  emotion_input: {
    termId: "emotion_input",
    display: "感情入力",
    reading: "かんじょうにゅうりょく",
    shortDef: "今の思考・行動・感情をまとめて記録する入力です。",
    longDef:
      "「考えたこと・感じたこと」「出来事・行動」のどちらか一方、または両方を書き、感情と内容カテゴリを選んで保存します。",
    examples: [
      "感じたことを書き、感情と強さを選んで保存する",
      "実際に起きた出来事を書き、近い内容カテゴリを選ぶ",
    ],
    relatedTerms: [
      "thought_content",
      "action_content",
      "content_category",
      "self_insight_mode",
      "emotion_notifications",
    ],
  },
  thought_content: {
    termId: "thought_content",
    display: "思考内容",
    reading: "しこうないよう",
    shortDef: "考えていることや感じたことを書く欄です。",
    longDef:
      "思考内容は、頭の中で考えていること、感じたこと、出来事への解釈などを残す欄です。実際に起きたこととは別に、自分の内側で起きている反応を記録できます。",
    examples: [
      "なぜ不安になったのかを書いておく",
      "相手の言葉をどう受け取ったかを残す",
    ],
    relatedTerms: ["emotion_input", "action_content", "content_category"],
  },
  action_content: {
    termId: "action_content",
    display: "行動内容",
    reading: "こうどうないよう",
    shortDef: "実際に起きた出来事や自分がしたことを書く欄です。",
    longDef:
      "行動内容は、何が起きたか、何をしたか、結果どうなったかを残す欄です。思考内容と分けて書くことで、出来事と感じ方を後から見比べやすくなります。",
    examples: [
      "仕事で予定より遅れてしまったことを書く",
      "人と話した、移動した、休んだなどの行動を残す",
    ],
    relatedTerms: ["emotion_input", "thought_content", "content_category"],
  },
  content_category: {
    termId: "content_category",
    display: "内容カテゴリ",
    reading: "ないようカテゴリ",
    shortDef: "入力内容がどのテーマに近いかを選ぶ分類です。",
    longDef:
      `内容カテゴリは、入力した思考内容や行動内容がどのテーマに近いかを選ぶものです。${CATEGORY_OPTIONS.join("・")}の${CATEGORY_OPTIONS.length}種類から、入力内容に近いものを1つ以上選びます。複数選択もできます。`,
    examples: [
      "仕事の出来事なら「仕事」を選ぶ",
      "体調や睡眠の話なら「健康」を選ぶ",
    ],
    relatedTerms: ["emotion_input"],
  },
  self_insight_mode: {
    termId: "self_insight_mode",
    display: "自己理解",
    reading: "じこりかい",
    shortDef: "自分についての気づきを残したいときに使う感情項目です。",
    longDef:
      "自分について分かったことを残すときに選びます。「自己理解」を一つだけ選び、本文に気づいたことを書きます。",
    examples: [
      "自分の考え方の癖に気づいたときに選ぶ",
      "同じ反応を繰り返す理由が見えたときに残す",
    ],
    relatedTerms: ["emotion_input", "self_analysis"],
  },
  emotion_notifications: {
    termId: "emotion_notifications",
    display: "今回だけ感情通知を送らない",
    reading: "かんじょうつうちをおくらない",
    shortDef: "この記録の感情通知を止める設定です。",
    longDef:
      "今回の感情入力をフォロワーに知らせずに残したいときは、保存する前にオンにします。",
    examples: [
      "今回は自分の中だけで整理したいときにオンにする",
    ],
    relatedTerms: ["follow", "emotion_log", "emotion_input"],
  },
  emlis_reply: {
    termId: "emlis_reply",
    display: "Emlisからの応答",
    reading: "エムリスからのおうとう",
    shortDef: "保存した記録に対するEmlisの応答です。",
    longDef:
      "入力を保存したあと、その記録に対して用意されたEmlisの応答を読めます。保存済みの応答は入力履歴から同じ内容を読み返せます。応答を用意できない場合も、保存された入力は残ります。",
    examples: [
  "入力後にEmlisの応答を読む",
  "入力履歴から保存済みの応答を開く"
],
    relatedTerms: ["emotion_input", "emotion_input_history"],
  },
  deep_insight: {
    termId: "deep_insight",
    display: "わたしを知る問い",
    reading: "わたしをしるとい",
    shortDef: "Emlisの問いを通じて、自分の考えや判断をふりかえる機能です。",
    longDef:
      "「テーマから考える」は全プランで使えます。初回はすぐに、次回からは前の問いを受け取ってからFreeは7日後、Plus・Premiumは24時間後に、新しい問いを受け取れます。「記録をふりかえる」はPremiumで使え、Emlisが記録や過去の回答から確かめたいことを見つけたときに問いが届きます。回答するまで同じ問いが残ります。回答は今後の問いやわたしマップに使われます。",
    examples: [
      "出来事を見返して、そのとき何を大事にしたかを書く",
      "気になるテーマを選び、普段の考え方を言葉にする",
    ],
    relatedTerms: ["analysis"],
  },
  emotion_input_history: {
    termId: "emotion_input_history",
    display: "入力履歴",
    reading: "にゅうりょくりれき",
    shortDef: "過去の感情入力を一覧で振り返る履歴です。",
    longDef:
      "これまでに行った感情入力を見返せる履歴です。いつ、どのような内容を残したかを確認し、過去の感情や出来事の流れを追うために使います。「通常のみ」「Secretのみ」は自分が保存した記録内の絞り込みで、本文を他のユーザーへ公開する設定ではありません。感情通知を送るかどうかとも別です。",
    examples: [
      "最近どんな入力をしていたかを見返す",
      "特定の時期に書いた内容を探す",
    ],
    relatedTerms: ["emotion_input", "emlis_reply"],
  },
  analysis_report: {
    termId: "analysis_report",
    display: "分析レポート",
    reading: "ぶんせきレポート",
    shortDef: "入力の積み重ねから見える傾向を整理したレポートです。",
    longDef:
      "感情入力や内容カテゴリの蓄積をもとに、自分の傾向や流れを整理します。分析画面のわたしマップで、文章や図として確認できます。",
    examples: [
      "最近の感情の偏りをつかむ",
      "繰り返し現れるテーマやパターンを見つける",
    ],
    relatedTerms: ["emotion_input", "analysis", "emotion_analysis", "self_analysis"],
  },
  analysis: {
    termId: "analysis",
    display: "分析",
    reading: "ぶんせき",
    shortDef: "入力状況、感情分析、わたしマップを振り返る画面です。",
    longDef:
      "こころグラフで気持ちの変化を、わたしマップで記録から見えた自分の選び方を振り返ります。",
    examples: [
      "今週の感情の推移を見る",
      "わたしマップの履歴を確認する",
    ],
    relatedTerms: ["emotion_analysis", "self_analysis"],
  },
  emotion_analysis: {
    termId: "emotion_analysis",
    display: "こころグラフ",
    reading: "こころグラフ",
    shortDef: "記録した感情の変化を見るグラフです。",
    longDef:
      "「今日・週・月」を切り替えて、記録した感情とその強さの集計を全プランで見られます。",
    examples: [
      "こころグラフ（日）を見る",
      "こころグラフ（週）で1週間の感情の流れを見る",
    ],
    relatedTerms: ["analysis", "emotion_input"],
  },
  self_analysis: {
    termId: "self_analysis",
    display: "わたしマップ",
    reading: "わたしマップ",
    shortDef: "記録から、自分がどんなことを大切にして選んできたかを振り返る分析です。",
    longDef:
      "蓄積した記録から確認できた選び方を文章や図で見られます。保存された月のマップは、そのときの内容を今のマップと見比べられます。",
    examples: [
  "今のわたしマップを見る",
  "保存されたわたしマップを見返す"
],
    relatedTerms: ["analysis", "emotion_input"],
  },
  piece_screen: {
    termId: "piece_screen",
    display: "ピース画面",
    reading: "ピースがめん",
    shortDef: "自分の保存済みピースや、投稿・感情通知・共鳴を扱う場所です。",
    longDef:
      "「自分のピースを開く」から自分が保存したピースを見返せます。投稿・感情通知・共鳴の各タブでは、公開された投稿やフォロー中ユーザーの情報、共鳴履歴を確認できます。",
    examples: [
  "自分のPieceを開いて保存済みの作品を見る",
  "共鳴タブから共鳴した投稿を見返す"
],
    relatedTerms: ["piece", "kyomei", "follow", "emotion_log"],
  },
  piece: {
    termId: "piece",
    display: "ピース",
    reading: "ピース",
    shortDef: "保存した感情入力から作り、自分で残したり共有したりできる言葉の断片です。",
    longDef:
      "保存した記録の文章を整えて画像にできます。プレビューで内容やデザインを確認し、非公開で保存できます。",
    examples: [
  "Emlisの応答画面からピースを作る",
  "「自分のピースを開く」から見返す"
],
    relatedTerms: ["piece_screen", "follow"],
  },
  profile_create: {
    termId: "profile_create",
    display: "ProfileCreate",
    reading: "プロフィールクリエイト",
    shortDef: "固定質問から自己紹介を整える旧機能の名称です。",
    longDef:
      "ProfileCreateは固定質問から自己紹介を整える旧機能です。現在の通常画面からは利用できません。ピースとは別の機能です。",
    examples: [
      "固定質問から自己紹介を整える旧機能",
      "現在の通常画面には利用入口がありません",
    ],
    relatedTerms: ["piece", "piece_screen"],
  },
  kyomei: {
    termId: "kyomei",
    display: "共鳴",
    reading: "きょうめい",
    shortDef: "他ユーザーのピースに強く響いたときのリアクションです。",
    longDef:
      "内容に深く重なった、似た感覚を持った、強く理解できたと感じたときに使うリアクションです。単なる「いいね」よりも、感覚の重なりや理解の深さを示すニュアンスがあります。",
    examples: [
      "自分も同じ感情の流れを経験したとき",
      "相手の言葉が自分の感覚にぴったり重なったとき",
    ],
    relatedTerms: ["piece", "reaction_history", "piece_screen"],
  },
  reaction_history: {
    termId: "reaction_history",
    display: "共鳴履歴",
    reading: "きょうめいりれき",
    shortDef: "共鳴したピースを見返すための履歴です。",
    longDef:
      "ピース画面の「共鳴」タブで、自分が共鳴したピースを見返せます。自分が作成して非公開で保存したピースの一覧とは別です。",
    examples: [
      "最近どのピースに共鳴したかを見る",
      "自分が響いた内容の傾向を確認する",
    ],
    relatedTerms: ["kyomei", "piece_screen", "piece"],
  },
  follow: {
    termId: "follow",
    display: "フォロー機能",
    reading: "フォローきのう",
    shortDef: "気になる人の投稿や感情通知を受け取るためのつながりです。",
    longDef:
      "相手のアカウント画面からフォローできます。相手があなたに公開したピースの投稿や感情通知は、ピース画面で見られます。",
    examples: [
      "気になるユーザーをフォローしてピースを読む",
      "感情の流れも受け取りたい相手だけ通知をオンにする",
    ],
    relatedTerms: ["emotion_log", "emotion_notifications", "piece"],
  },
  emotion_log: {
    termId: "emotion_log",
    display: "感情通知",
    reading: "かんじょうつうち",
    shortDef: "フォロー中の人が公開した感情入力を知らせる通知です。",
    longDef:
      "フォロー中の人があなたに感情通知を送ると、ピース画面の「感情通知」で感情・強さ・時刻を確認できます。受け取る相手はフォローリストのベルで選べます。メモ本文は本人の記録に残ります。",
    examples: [
      "最近の相手の気持ちの流れを見る",
      "フォロー中ユーザーごとに通知のON/OFFを切り替える",
    ],
    relatedTerms: ["follow", "emotion_input", "emotion_notifications"],
  },
  private_account: {
    termId: "private_account",
    display: "非公開",
    reading: "ひこうかい",
    shortDef: "フォロー時に承認が必要になる公開設定です。",
    longDef:
      "アカウントを非公開にすると、新しくフォローされる際に承認が必要になります。保存したピースごとの公開状態とは別です。",
    examples: [
      "フォローされる相手を自分で承認したいときに非公開にする",
    ],
    relatedTerms: [
  "follow",
  "piece_screen"
],
  },
  
});

export function getGuideTerm(termId) {
  if (!termId) return null;
  const normalizedId = String(termId).trim();
  if (!normalizedId) return null;
  return guideTermsJa[normalizedId] || null;
}
