// MyModelPromptTemplates.js
// Prompt syntax definitions for ASTOR (MyModel).
// v0.1 — Structure-accurate, but "answer-forward" wording for human satisfaction.
// NOTE: Avoid date-like keywords (いつ/何日/来月/先週/今日 etc.) because MashOS /mymodel/infer blocks them.

function truncateText(s, maxChars = 2600) {
  const t = String(s || "");
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars) + "\n…（省略）";
}

/**
 * MyModel: Self-structure analysis report (monthly-ish).
 *
 * @param {Object} params
 * @param {string} params.rangeLabel - e.g., "12/1 ～ 12/28（28日）"
 * @param {string} [params.prevReportText] - previous report text for diff section
 * @returns {string} instruction prompt
 */
export function buildMyModelMonthlySelfReportPrompt({ rangeLabel, prevReportText } = {}) {
  const prev = prevReportText ? truncateText(prevReportText, 2600) : "";
  const hasPrev = !!prev;

  const lines = [];
  lines.push("あなたはCocolonの分析AI『ASTOR』です。");
  lines.push("Cocolonの『MyModel』用に、『自己構造分析レポート（月次）』を日本語で作成してください。");
  lines.push("");
  lines.push("【このレポートの役割】");
  lines.push("・MyWeb（感情傾向/感情構造）とは役割が違います。ここでは自己構造（思考/認知/反応パターン）の言語化に集中します。");
  lines.push("・感情の頻度や推移の集計は最小限にし、刺激→認知→感情→行動（反応）としての『構造』を中心に書きます。");
  lines.push("");
  lines.push("【書き方ルール（重要）】");
  lines.push("・診断や断定はしない（『〜の可能性』『〜しやすい』など仮説の形）。");
  lines.push("・一般論/説教で埋めない（観測できる輪郭→具体例→条件の順で）。");
  lines.push("・読み手が『答えを受け取った』と感じるように、冒頭に要点（答え）を短く提示する。");
  lines.push("・ただし『性格の決めつけ』はしない（固定ラベル化しない）。");
  lines.push("・長さは読みやすく。箇条書きを適切に使う。");
  lines.push("");
  lines.push(`対象期間（目安）：${rangeLabel || "直近約1か月"}`);
  lines.push("");
  lines.push("以下のテンプレで出力してください（見出しはそのまま使ってください）。");
  lines.push("");

  lines.push("【自己構造分析レポート（月次）】");
  lines.push("");
  lines.push("【要点（答え）】");
  lines.push("・（この期間の自己モデルの核を1行）");
  lines.push("・（崩れやすい引き金/条件を1行）");
  lines.push("・（安定しやすい条件/整え方を1行）");
  lines.push("");
  lines.push("1. いまの自己モデル（仮説・1〜4行）");
  lines.push("2. 主要な反応パターン（刺激→認知→感情→行動）");
  lines.push("3. 安定条件 / 崩れ条件（それぞれ箇条書き）");
  lines.push("4. 思考のクセ・判断のクセ（あれば）");
  lines.push("5. 領域別メモ（仕事/対人/孤独/挑戦/評価など、見えている範囲で）");
  lines.push("6. 次の観測ポイント（3つ。行動に落ちる形で）");

  if (hasPrev) {
    lines.push("7. 前回との差分（変化点 / 更新点 / 揺れ方の違い）");
    lines.push("8. 感情構造との接続（MyWebに譲る前提で、短く1〜2行）");
    lines.push("");
    lines.push("前回レポート（参考。コピーせず、差分観測の材料として扱ってください）：");
    lines.push("<<PREVIOUS_REPORT_START>>");
    lines.push(prev);
    lines.push("<<PREVIOUS_REPORT_END>>");
  } else {
    lines.push("7. 比較メモ（前回レポートがまだ無い場合は1〜2行）");
    lines.push("8. 感情構造との接続（MyWebに譲る前提で、短く1〜2行）");
  }

  lines.push("");
  lines.push("【追加の注意】");
  lines.push("・『あなたは〜な人』のような人格の断定表現は禁止。");
  lines.push("・専門用語は避け、アプリのユーザーが読んで理解できる言葉で。");
  lines.push("・一貫して『観測→仮説』の順で書く。");

  return lines.join("\n");
}

// Backward-compat alias (legacy name)
export const buildMyProfileMonthlySelfReportPrompt = buildMyModelMonthlySelfReportPrompt;

/**
 * MyModel: Q&A (deep dive) prompt.
 *
 * @param {Object} params
 * @param {string} params.question - user's question
 * @param {"self"|"external"} [params.target] - data scope
 * @returns {string} instruction prompt
 */
export function buildMyModelQnaPrompt({ question, target = "self" } = {}) {
  const q = String(question || "").trim();

  const scopeLine =
    target === "external"
      ? "・これは他者照会（公開範囲）です。推測の断定や、プライベート情報の言及は避けてください。"
      : "・これは自己照会（全入力）です。断定は避けつつ、具体性は落とさないでください。";

  const lines = [];
  lines.push("あなたはCocolonの分析AI『ASTOR』です。");
  lines.push("これはMyModelの『一問一答（深掘り）』です。ユーザーの自己観測を助けるために答えてください。");
  lines.push("");
  lines.push("【前提】");
  lines.push(scopeLine);
  lines.push("・診断ではなく、観測にもとづく仮説として答える。");
  lines.push("・『一般論』『説教』『根拠のない断定』は禁止。");
  lines.push("・短くてもいいので、最初に結論（答え）を明示する。");
  lines.push("・ユーザーが次にやる観測/行動がわかる形で終える。");
  lines.push("");
  lines.push("【出力フォーマット】");
  lines.push("【結論（答え）】");
  lines.push("（1〜3行）");
  lines.push("");
  lines.push("【自己構造の仮説】");
  lines.push("・（刺激→認知→感情→行動の形で、要点を箇条書き）");
  lines.push("");
  lines.push("【根拠（観測として見えていること）】");
  lines.push("・（観測の根拠を2〜4点。『〜が多い』ではなく『〜が起きやすい条件』）");
  lines.push("");
  lines.push("【安定させる微調整】");
  lines.push("・（今すぐ実行できる調整を2〜4点）");
  lines.push("");
  lines.push("【次の観測（2〜3）】");
  lines.push("・（観測メモの型。条件・きっかけ・身体・環境など）");
  lines.push("");
  lines.push("【追加で確認したい点（任意・1〜2）】");
  lines.push("・（答えの精度を上げるために、場面/条件に関する質問）");
  lines.push("");
  lines.push("【質問】");
  lines.push(q ? q : "（質問が空です）");

  return lines.join("\n");
}

// Backward-compat alias (legacy name)
export const buildMyProfileQnaPrompt = buildMyModelQnaPrompt;
