export const guideTermsJa = Object.freeze({
  emotion_input: {
    termId: "emotion_input",
    display: "感情入力",
    reading: "かんじょうにゅうりょく",
    shortDef: "今の思考・行動・感情をまとめて記録する入力です。",
    longDef:
      "Cocolon の基本的な記録方法です。思考内容、行動内容、感情、内容カテゴリを組み合わせて、今の状態を残します。保存した入力は、Emlisの観測、分析レポート、ピース生成などにつながります。",
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
    display: "Emlisの観測",
    reading: "エムリスからのへんとう",
    shortDef: "保存した入力に対してEmlisが返すコメントです。",
    longDef:
      "Home で入力を保存したあと、Emlisの観測を確認できます。入力した内容や選んだ感情をもとに、その時点の状態や言葉同士の関係を見つめる文として表示されます。",
    examples: [
      "この内容でOKを押したあとに返答を読む",
      "入力直後の自分の状態を言葉で受け取る",
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
      "わたしマップは、あなたをタイプ分けするものではありません。場面ごとに立ち上がりやすい役割と、そのとき選びやすい行動を整理します。入口はFreeプランでも見られ、Plusプラン以上ではよく通るルートや詳しい自己分析レポートを読めます。入力が少ない場面は、まだ地図にない場所として表示します。",
    examples: [
      "今のわたしマップを見る",
      "役割スイッチを見る",
      "よく通るルートを見返す",
    ],
    relatedTerms: ["analysis", "analysis_report"],
  },
  piece_screen: {
    termId: "piece_screen",
    display: "ピース画面",
    reading: "ピースがめん",
    shortDef: "投稿・感情通知・おすすめ・履歴を扱う場所です。",
    longDef:
      "ピース画面では、公開されたピースを読む、共鳴する、感情通知を確認する、おすすめユーザーを見る、共鳴履歴を振り返る、という流れをまとめて扱います。",
    examples: [
      "投稿タブで自分やフォロー中ユーザーのピースを読む",
      "感情通知タブでフォロー中ユーザーの感情の流れを見る",
    ],
    relatedTerms: ["piece", "kyomei", "follow", "emotion_log"],
  },
  piece: {
    termId: "piece",
    display: "ピース",
    reading: "ピース",
    shortDef: "Home の感情入力から作られる、公開用の断片です。",
    longDef:
      "Home で行ったその時の感情入力から生成される、公開用のピースです。公開後は、自分やフォロー中ユーザーが読み、共鳴できる対象になります。",
    examples: [
      "Home の感情入力からピースを生成する",
      "公開された自分やフォロー中ユーザーのピースを読む",
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
    display: "履歴",
    reading: "りれき",
    shortDef: "共鳴したピースを見返すための履歴です。",
    longDef:
      "自分が共鳴したピースを見返すための履歴です。どんな内容に共鳴しやすいかを追うことで、自分の関心や理解の方向も見えてきます。",
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
      "ピースの公開設定を非公開にすると、新しくフォローされるときに承認が必要になります。また、おすすめユーザーにも表示されなくなります。ランキングなどでは、非公開アカウントであることを示す盾アイコンが表示されることがあります。",
    examples: [
      "フォローされる相手を自分で承認したいときに非公開にする",
      "おすすめユーザーに表示されたくないときに非公開にする",
    ],
    relatedTerms: ["follow", "piece_screen", "ranking_preview"],
  },
  ranking_preview: {
    termId: "ranking_preview",
    display: "ランキングプレビュー",
    reading: "ランキングプレビュー",
    shortDef: "ランキングカード内に表示される上位ユーザーの簡易一覧です。",
    longDef:
      "ランキング画面では、各ランキングカードに上位ユーザーのプレビューが表示されます。詳しく見たい場合は、そのカードの「全表示」から詳細画面へ進みます。",
    examples: [
      "入力数ランキングの上位だけをカードで確認する",
      "共鳴数ランキングの全表示へ進む",
    ],
    relatedTerms: ["kyomei", "private_account"],
  },
});

export function getGuideTerm(termId) {
  if (!termId) return null;
  const normalizedId = String(termId).trim();
  if (!normalizedId) return null;
  return guideTermsJa[normalizedId] || null;
}
