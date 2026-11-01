export const guideTermsJa = Object.freeze({
  emotion_input: {
    termId: "emotion_input",
    display: "感情入力",
    reading: "かんじょうにゅうりょく",
    shortDef: "今の思考・行動・感情をまとめて記録する入力です。",
    longDef:
      "Cocolon の基本的な記録方法です。思考内容、行動内容、感情、内容カテゴリを組み合わせて、今の状態を残します。保存した入力は、Emlisの応答、分析、ピース作成につながります。",
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
      "内容カテゴリは、入力した思考内容や行動内容がどのテーマに近いかを示す分類です。生活、仕事、人間関係、健康などを選ぶことで、後から分析するときに流れを整理しやすくなります。",
    examples: [
      "仕事の出来事なら「仕事」を選ぶ",
      "体調や睡眠の話なら「健康」を選ぶ",
    ],
    relatedTerms: ["emotion_input", "analysis_report"],
  },
  self_insight_mode: {
    termId: "self_insight_mode",
    display: "自己理解",
    reading: "じこりかい",
    shortDef: "自分についての気づきを残したいときに使う感情項目です。",
    longDef:
      "自己理解は、喜び・悲しみなどの感情とは別に、自分について分かったことや気づきを残したいときに使います。Home では他の感情と同時に選ばず、単体で選択します。",
    examples: [
      "自分の考え方の癖に気づいたときに選ぶ",
      "同じ反応を繰り返す理由が見えたときに残す",
    ],
    relatedTerms: ["emotion_input", "analysis_report"],
  },
  emotion_notifications: {
    termId: "emotion_notifications",
    display: "感情通知を送らない",
    reading: "かんじょうつうちをおくらない",
    shortDef: "その入力をフォロー中ユーザーへ通知しないための設定です。",
    longDef:
      "この設定をオンにすると、その入力はフォロー中ユーザー側へ感情通知として送られません。普段は共有しつつ、一部の入力だけ静かに保存したいときに使えます。",
    examples: [
      "今回は自分の中だけで整理したいときにオンにする",
      "感情は記録したいが、フォロー中ユーザーへ知らせたくないときに使う",
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
    relatedTerms: ["emotion_input", "analysis_report"],
  },
  today_question: {
    termId: "today_question",
    display: "今日の問い",
    reading: "きょうのとい",
    shortDef: "その日ごとに表示される問いです。",
    longDef:
      "Home や Analysis から扱える、その日ごとの問いです。感情入力とは別に、問いに答えることで、その時の考え方や状態を残していけます。",
    examples: [
      "その日のテーマに沿って短く答えを残す",
      "あとから履歴で見返して、その時期の思考を追う",
    ],
    relatedTerms: ["today_question_history", "analysis"],
  },
  emotion_input_history: {
    termId: "emotion_input_history",
    display: "入力履歴",
    reading: "にゅうりょくりれき",
    shortDef: "過去の感情入力を一覧で振り返る履歴です。",
    longDef:
      "これまでに行った感情入力を見返せる履歴です。いつ、どのような内容を残したかを確認し、過去の感情や出来事の流れを追うために使います。",
    examples: [
      "最近どんな入力をしていたかを見返す",
      "特定の時期に書いた内容を探す",
    ],
    relatedTerms: ["emotion_input", "analysis", "analysis_report"],
  },
  today_question_history: {
    termId: "today_question_history",
    display: "今日の問い履歴",
    reading: "きょうのといりれき",
    shortDef: "これまで答えた「今日の問い」を見返す履歴です。",
    longDef:
      "日ごとに答えた問いと答えを振り返るための履歴です。感情入力の履歴とは違い、その日の考え方やテーマに対する答えの変化を追うのに向いています。",
    examples: [
      "以前の自分が同じテーマにどう答えていたかを見る",
      "数週間前の考え方との差を比較する",
    ],
    relatedTerms: ["today_question", "analysis"],
  },
  analysis_report: {
    termId: "analysis_report",
    display: "分析レポート",
    reading: "ぶんせきレポート",
    shortDef: "入力の積み重ねから見える傾向を整理したレポートです。",
    longDef:
      "感情入力や内容カテゴリの蓄積をもとに、自分の傾向や流れを整理するレポートです。分析画面では、こころ天気（日/週/月）やわたしマップとして確認できます。",
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
      "Home で行った入力をあとから整理し、こころ天気（日/週/月）・わたしマップとして確認する場所です。最新レポートを画面内で読み、必要に応じて履歴へ進めます。",
    examples: [
      "今週の感情分析を読む",
      "わたしマップの履歴を確認する",
    ],
    relatedTerms: ["emotion_analysis", "self_analysis", "analysis_report"],
  },
  emotion_analysis: {
    termId: "emotion_analysis",
    display: "感情分析",
    reading: "かんじょうぶんせき",
    shortDef: "感情入力をもとに、こころ天気（日/週/月）を見る分析です。",
    longDef:
      "感情分析では、Home の入力をもとにこころ天気（日）・こころ天気（週）・こころ天気（月）を切り替えて確認できます。最新レポートがある場合は、分析画面内に直接表示されます。",
    examples: [
      "こころ天気（日）を読む",
      "こころ天気（週）で1週間の感情の流れを見る",
    ],
    relatedTerms: ["analysis", "analysis_report", "emotion_input"],
  },
  self_analysis: {
    termId: "self_analysis",
    display: "わたしマップ",
    reading: "わたしマップ",
    shortDef: "場面ごとの役割と行動パターンを見る分析です。",
    longDef:
      "蓄積した入力全体から確認できた場面・役割・考え・行動・結果の構造とルートを見返す場所です。現在の内容は全プラン共通です。月次履歴は当時保存した文章と図を保ち、現在と見比べられます。閲覧範囲はFreeが直近2回分、Plusが12回分、Premiumが全期間です。性格タイプを決めるものではなく、未解析の範囲も表示します。",
    examples: [
  "今のわたしマップを見る",
  "保存されたわたしマップを見返す"
],
    relatedTerms: ["analysis", "analysis_report"],
  },
  piece_screen: {
    termId: "piece_screen",
    display: "ピース画面",
    reading: "ピースがめん",
    shortDef: "自分の保存済みピースや、投稿・感情通知・おすすめ・共鳴を扱う場所です。",
    longDef:
      "「自分のPieceを開く」から自分が保存したピースを見返せます。投稿・感情通知・おすすめ・共鳴の各タブでは、公開された投稿やフォロー中ユーザーの情報、共鳴履歴を確認できます。",
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
      "保存した入力の本文をもとに、必要に応じて読みやすく整えて作るピースです。選択した感情の説明文は追加しません。内容とデザインを確認して非公開で保存し、自分の一覧から見返せます。対応端末では画像として保存・共有できます。外部に保存・共有した画像は、アプリ内で削除・非公開にしても回収できません。",
    examples: [
  "Emlisの応答画面からピースを作る",
  "自分のPieceを開いて写真に保存する"
],
    relatedTerms: ["piece_screen", "kyomei", "reaction_history"],
  },
  profile_create: {
    termId: "profile_create",
    display: "ProfileCreate",
    reading: "プロフィールクリエイト",
    shortDef: "固定的な自己紹介 / プロフィール資産を整える機能です。",
    longDef:
      "提示された固定質問に答えることで、固定的な自己紹介 / プロフィール資産を整える機能です。ピースとは別枠で、アカウント上に表示される自己紹介として使われます。",
    examples: [
      "固定質問に答えてプロフィールを整える",
      "アカウント上に表示される自己紹介を更新する",
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
    shortDef: "他ユーザーのピースや感情通知を見やすくするつながりです。",
    longDef:
      "Cocolon では、人とのつながりをフォロー機能で扱います。フォローすると相手のピースを見やすくなり、必要に応じて感情通知も受け取れます。自分のアカウントは非公開にすることもでき、その場合はフォロー時に承認が必要になります。",
    examples: [
      "気になるユーザーをフォローしてピースを読む",
      "感情の流れも受け取りたい相手だけ通知をオンにする",
    ],
    relatedTerms: ["emotion_log", "emotion_notifications", "private_account", "piece"],
  },
  emotion_log: {
    termId: "emotion_log",
    display: "感情通知",
    reading: "かんじょうつうち",
    shortDef: "フォロー中ユーザーの感情入力の流れを確認するための通知です。",
    longDef:
      "感情通知では、フォロー中ユーザーがどんな感情を入力していたかを時系列で確認できます。メモ本文を読むというより、感情と強さの流れを受け取ることに重心があります。",
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
    shortDef: "フォロー時に承認が必要になり、おすすめに表示されなくなる公開設定です。",
    longDef:
      "アカウントを非公開にすると、新しくフォローされる際に承認が必要になり、おすすめユーザーにも表示されなくなります。保存したピースごとの公開状態とは別です。",
    examples: [
      "フォローされる相手を自分で承認したいときに非公開にする",
      "おすすめユーザーに表示されたくないときに非公開にする",
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
