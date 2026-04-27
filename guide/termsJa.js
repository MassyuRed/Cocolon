export const guideTermsJa = Object.freeze({
  emotion_input: {
    termId: "emotion_input",
    display: "感情入力",
    reading: "かんじょうにゅうりょく",
    shortDef: "その瞬間の感情を記録する入力です。",
    longDef:
      "Cocolon の基本的な記録方法です。今感じている感情と強さを選び、必要に応じてメモも添えて残します。日記のように長く書くためのものというより、感情に気づいた瞬間を捕まえるための入力です。",
    examples: [
      "うれしい出来事があった直後に「喜び」を入力する",
      "少し不安を感じた時点で「不安」を弱めで入力して残す",
    ],
    relatedTerms: ["self_insight_mode", "secret_memo", "emotion_notifications"],
  },
  self_insight_mode: {
    termId: "self_insight_mode",
    display: "自己理解モード",
    reading: "じこりかいモード",
    shortDef: "自分に関する気づきや発見を、言葉で整理して残すための入力モードです。",
    longDef:
      "通常の感情入力が「今の気持ち」を素早く記録するためのものなのに対し、自己理解モードは「自分について分かったこと」を整理するためのモードです。感情選択よりも、メモを通じて気づきを残すことが中心になります。",
    examples: [
      "最近の自分の思考パターンに気づいたときに残す",
      "同じ失敗を繰り返す理由が見えたときに言葉にする",
    ],
    relatedTerms: ["emotion_input", "secret_memo"],
  },
  secret_memo: {
    termId: "secret_memo",
    display: "シークレットメモ",
    reading: "シークレットメモ",
    shortDef: "Piece には出さず、分析には使うメモ設定です。",
    longDef:
      "メモ内容をそのまま公開したくないときに使う設定です。Piece 側には表示されませんが、入力内容としては保持されるため、分析レポートなどには反映されます。公開範囲と分析利用を分けたいときに向いています。",
    examples: [
      "個人的すぎる内容を公開せずに残したいとき",
      "自分だけの振り返りとしてメモを書いておきたいとき",
    ],
    relatedTerms: ["emotion_input", "analysis_report"],
  },
  emotion_notifications: {
    termId: "emotion_notifications",
    display: "感情通知を送らない",
    reading: "かんじょうつうちをおくらない",
    shortDef: "感情入力をフォロー中ユーザーへ通知しないための設定です。",
    longDef:
      "この設定をオンにすると、その入力はフォロー中ユーザー側へ通知されません。感情通知を使いつつ、入力ごとに共有の濃さを自分で調整したいときに便利です。",
    examples: [
      "今回は自分の中だけで整理したいときにオンにする",
      "普段は共有するが、一部の入力だけ非共有にしたいときに使う",
    ],
    relatedTerms: ["follow", "emotion_log", "emotion_input"],
  },
  today_question: {
    termId: "today_question",
    display: "今日の問い",
    reading: "きょうのとい",
    shortDef: "その日ごとに表示される問いです。",
    longDef:
      "Home や Analysis から扱える、その日限定または日単位で積み重なる問いです。感情入力とは別に、問いに答えることでその時の考え方や状態を残していけます。",
    examples: [
      "その日のテーマに沿って短く答えを残す",
      "あとから履歴で見返して、その時期の思考を追う",
    ],
    relatedTerms: ["today_question_history", "analysis"],
  },
  emotion_input_history: {
    termId: "emotion_input_history",
    display: "感情入力履歴",
    reading: "かんじょうにゅうりょくりれき",
    shortDef: "過去の感情入力を一覧で振り返る履歴です。",
    longDef:
      "これまでに行った感情入力を見返せる履歴です。検索やフィルタを使いながら、どんな感情がいつ多かったか、どんな流れだったかを追うために使います。",
    examples: [
      "最近「不安」が増えていたかを見返す",
      "特定の時期に書いたメモを探す",
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
      "数週間前の考え方の差を比較する",
    ],
    relatedTerms: ["today_question", "analysis"],
  },
  analysis_report: {
    termId: "analysis_report",
    display: "分析レポート",
    reading: "ぶんせきレポート",
    shortDef: "入力の積み重ねから見える傾向を整理したレポートです。",
    longDef:
      "感情入力やメモの蓄積をもとに、自分の傾向や流れを読み解くためのレポートです。入力が増えるほど、またメモの内容があるほど、より立体的な振り返りにつながります。",
    examples: [
      "最近の感情の偏りをつかむ",
      "繰り返し現れるテーマやパターンを見つける",
    ],
    relatedTerms: ["emotion_input", "analysis", "secret_memo"],
  },
  analysis: {
    termId: "analysis",
    display: "Analysis",
    reading: "アナリシス",
    shortDef: "入力履歴やレポートを振り返るための画面群です。",
    longDef:
      "Home で行った入力をあとから整理し、分析として確認するための場所です。履歴・検索・レポートなど、蓄積された自己情報を読み解く役割を持っています。",
    examples: [
      "先週の感情入力を見返す",
      "分析レポートから自分の傾向を確認する",
    ],
    relatedTerms: ["emotion_input_history", "today_question_history", "analysis_report"],
  },
  piece_screen: {
    termId: "piece_screen",
    display: "Piece画面",
    reading: "ピースがめん",
    shortDef: "Pieceや関連する反応を扱う場所です。",
    longDef:
      "Piece画面では、公開された断片や他ユーザーとの反応を通じて自分や他者を立体的に扱います。読む・反応する流れを通じて理解を深めていくのが特徴です。",
    examples: [
      "公開されたPieceを読み、自分との重なりを確かめる",
      "他ユーザーの Piece を読んで理解を広げる",
    ],
    relatedTerms: ["piece", "kyomei", "reaction_history"],
  },
  piece: {
    termId: "piece",
    display: "Piece",
    reading: "ピース",
    shortDef: "Home の感情入力から作られる、オリジナルの断片です。",
    longDef:
      "Home で行ったその時の感情入力から生成される、オリジナルの Piece です。ProfileCreate とは別枠で扱われ、公開後は自分や他者の考え方や感じ方を読むための土台になります。",
    examples: [
      "Home の感情入力から作成した Piece",
      "公開された自分や他ユーザーの Piece を読む",
    ],
    relatedTerms: ["piece_screen", "kyomei", "reaction_history"],
  },
  profile_create: {
    termId: "profile_create",
    display: "ProfileCreate",
    reading: "プロフィールクリエイト",
    shortDef: "固定的な自己紹介 / プロフィール資産を整える機能です。",
    longDef:
      "提示された固定質問に答えることで、固定的な自己紹介 / プロフィール資産を整える機能です。Pieceとは別枠で、アカウント上に表示される自己紹介として使われます。",
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
    shortDef: "他ユーザーの Piece に強く響いたときのリアクションです。",
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
    shortDef: "共鳴などの反応の履歴です。",
    longDef:
      "自分が送った反応や受け取った反応を見返すための履歴です。どんな内容に共鳴しやすいかを追うことで、自分の関心や理解の方向も見えてきます。",
    examples: [
      "最近どの Piece に反応したかを見る",
      "自分が受け取った共鳴の傾向を確認する",
    ],
    relatedTerms: ["kyomei", "piece_screen", "piece"],
  },
  follow: {
    termId: "follow",
    display: "フォロー",
    reading: "フォロー",
    shortDef: "他ユーザーを追い、Piece や感情通知の対象にする関係です。",
    longDef:
      "Cocolon では、人とのつながりをフォローで扱います。フォローすると相手の Piece を閲覧でき、必要に応じて感情通知の受信対象にもできます。",
    examples: [
      "気になるユーザーをフォローして Piece を読む",
      "感情の流れも受け取りたい相手だけ通知をオンにする",
    ],
    relatedTerms: ["emotion_log", "emotion_notifications", "emotion_input"],
  },
  emotion_log: {
    termId: "emotion_log",
    display: "感情ログ",
    reading: "かんじょうログ",
    shortDef: "フォロー中ユーザーの感情入力の流れを確認するための一覧です。",
    longDef:
      "フォロー中ユーザーがどんな感情を入力していたかを時系列で見ていくための場所です。メモ本文を読むというより、感情の波を受け取ることに重心があります。",
    examples: [
      "最近の相手の気持ちの流れを見る",
      "しばらく会っていない相手の状態変化を感情から知る",
    ],
    relatedTerms: ["follow", "emotion_input", "emotion_notifications"],
  },
});

export function getGuideTerm(termId) {
  if (!termId) return null;
  const normalizedId = String(termId).trim();
  if (!normalizedId) return null;
  return guideTermsJa[normalizedId] || null;
}
