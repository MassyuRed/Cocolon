import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";
import { applyTypographyTokens } from "../ui/applyTypographyTokens";

/**
 * AnalysisCrossLinkSection
 * --------------------
 * Analysis（感情構造レポート）→ Piece / Self Structure への交差リンク用UI。
 *
 * v0.1（Step 4）:
 * ・週報 / 月報の末尾に「自己構造トピック候補」を提示
 * ・タップで Piece へ遷移（親から onOpenPieceDeepDive が渡っていればそれを呼ぶ）
 * ・未接続の場合は、アラートに「おすすめ質問」を表示して代替
 *
 * ※ 動的リンク（Self Structure の特定アンカーへフォーカスなど）は後回し。
 */

const EMO_JP = Object.freeze({
  joy: "喜び",
  sadness: "悲しみ",
  anxiety: "不安",
  anger: "怒り",
  calm: "平穏",
});

function labelForPeriod(reportType) {
  if (reportType === "monthly") return "今月";
  if (reportType === "weekly") return "今週";
  return "この期間";
}

function pickTopKeys(metrics) {
  if (!metrics) return [];

  // weekly: metrics.top = [[key, score], ...]
  if (Array.isArray(metrics.top)) {
    return metrics.top
      .filter((it) => Array.isArray(it) && it.length >= 2)
      .filter(([, v]) => Number(v || 0) > 0)
      .map(([k]) => String(k));
  }

  // monthly: metrics.totals = { joy: n, ... }
  if (metrics.totals && typeof metrics.totals === "object") {
    return Object.entries(metrics.totals)
      .sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0))
      .filter(([, v]) => Number(v || 0) > 0)
      .map(([k]) => String(k));
  }

  return [];
}

function topic(id, title, blurb, suggestedQuestion) {
  return {
    id,
    title,
    blurb,
    suggestedQuestion,
  };
}

/**
 * 感情構造（週/月）→ 自己構造の「深掘り候補トピック」を生成
 * ※ 初期は静的ルールベースでOK（動的/生成AIは後回し）
 */
export function buildSelfStructureTopics({ reportType = "weekly", metrics }) {
  const topKeys = pickTopKeys(metrics);
  const top1 = topKeys[0] || null;
  const top2 = topKeys[1] || null;

  // データが少ないときは汎用候補
  if (!top1) {
    return [
      topic(
        "baseline_trigger",
        "刺激 → 反応パターン（ベースライン観測）",
        "最近よく起きる刺激に対して、内側がどう動くかを整理する",
        "最近よく起きる刺激（状況/人/作業）に対して、私はどんな反応パターンになりやすい？"
      ),
      topic(
        "baseline_reward",
        "報酬の発生条件（やる気の起動）",
        "小さくても動ける条件を言語化してみる",
        "私はどんな条件で「動ける/やる気が出る」状態に入りやすい？"
      ),
      topic(
        "baseline_recovery",
        "回復ループ（整え方）",
        "乱れたときに戻ってくる手順を観測する",
        "私が乱れたとき、どういう手順で落ち着きに戻りやすい？"
      ),
    ];
  }

  // 感情の中心に応じた候補
  if (top1 === "anxiety") {
    return [
      topic(
        "uncertainty_safety",
        "不確実性への反応（安心条件）",
        "未確定・待機・予定変更などで、内側はどう動く？",
        "最近、不確実性が高い状況で私はどう反応している？安心に戻る条件は何？"
      ),
      topic(
        "anticipation_control",
        "先回り思考とコントロールの使い方",
        "予測で守ろうとしているもの／恐れているものを観測する",
        "私は何を守るために先回りしている？先回りが役立つ時と、疲れる時の違いは？"
      ),
      topic(
        "sensitivity_boundary",
        "感受性と境界線（刺激の過量）",
        "刺激が多いとき、どこで飽和して崩れやすい？",
        "刺激が多い日に、私はどこで飽和して崩れやすい？境界線を引くサインは？"
      ),
    ];
  }

  if (top1 === "sadness") {
    return [
      topic(
        "loss_meaning",
        "喪失感／意味の揺れ（何が抜けた？）",
        "悲しみの核にある「欠けたもの」を特定する",
        "最近の悲しみは、何が抜けた/失った感覚から来ている？本当は何を求めている？"
      ),
      topic(
        "fatigue_need",
        "疲労と必要量（回復の設計）",
        "負荷の種類と回復の種類が噛み合っているかを見る",
        "私の疲れは「何の負荷」から来てる？回復に必要な条件（睡眠/孤独/会話/運動）は？"
      ),
      topic(
        "self_talk",
        "自己対話（内側の言葉づかい）",
        "自分への言葉が、構造を支えているか削っているか",
        "私は自分にどう話しかけている？その言葉は構造を支える？それとも削る？"
      ),
    ];
  }

  if (top1 === "anger") {
    return [
      topic(
        "boundary_violation",
        "境界線の侵害（何が許せない？）",
        "怒りが出る地点＝大事にしている価値を観測する",
        "最近の怒りは、どんな境界線が侵害された時に出た？私は何を大事にしている？"
      ),
      topic(
        "expectation_gap",
        "期待と現実の差（どこでズレた？）",
        "期待値の設計と、ズレの扱い方を言語化する",
        "私は何を期待していた？どこで現実とズレた？期待をどう調整すると楽になる？"
      ),
      topic(
        "assertion_style",
        "主張スタイル（出し方の設計）",
        "言えない/言いすぎる、の構造をほどく",
        "私は主張を出すとき、言えなくなる？言いすぎる？その分岐条件は？"
      ),
    ];
  }

  if (top1 === "joy") {
    return [
      topic(
        "reward_engine",
        "報酬エンジン（何で活性化する？）",
        "喜びが出る条件を、再現可能な形で整理する",
        "私は何をしている時に喜びが出やすい？その条件を再現するには何が必要？"
      ),
      topic(
        "growth_loop",
        "成長ループ（伸びる順序）",
        "気持ちよく伸びる順序（学習/挑戦/休息）を観測する",
        "私はどんな順序で挑戦すると気持ちよく伸びる？休息はどこに挟むと良い？"
      ),
      topic(
        "sharing_style",
        "共有／表現（出力の形）",
        "外に出すときの得意な形・疲れる形を見分ける",
        "私はどんな形で表現/共有すると楽しい？逆に疲れる出力は何？"
      ),
    ];
  }

  if (top1 === "calm") {
    return [
      topic(
        "stability_conditions",
        "安定の条件（何が整っている？）",
        "平穏が出る環境・ルーティン・関係性の要素を抽出する",
        "最近、平穏でいられた時の条件は何？環境/人/タスクの共通点は？"
      ),
      topic(
        "maintenance_cost",
        "維持コスト（何を削ると崩れる？）",
        "安定を保つために必要なコストを把握する",
        "安定を保つために、私は何をしている？何を削ると崩れやすい？"
      ),
      topic(
        "safe_challenge",
        "安全な挑戦（揺れを起こす範囲）",
        "安定を壊さずに刺激を入れる方法を設計する",
        "今の安定を壊さずに刺激を入れるなら、どんな小さな挑戦が良さそう？"
      ),
    ];
  }

  // その他（top2 が使えそうなら少し補正）
  const label1 = EMO_JP[top1] || top1;
  const label2 = top2 ? EMO_JP[top2] || top2 : null;

  return [
    topic(
      "mixed_core",
      `${label1}${label2 ? ` × ${label2}` : ""}の混合トーンの核`,
      "混合トーンの中心にある「刺激」と「反応」を整理する",
      `最近の${label1}${label2 ? `と${label2}` : ""}は、どんな刺激で出ている？反応パターンは？`
    ),
    topic(
      "mixed_switch",
      "切り替わり条件（スイッチの入力）",
      "トーンが変わるきっかけ＝自己の輪郭を観測する",
      "トーンが切り替わる瞬間は何が起きている？入力（出来事/言葉/身体状態）は？"
    ),
    topic(
      "mixed_recovery",
      "戻り方（補正ループ）",
      "揺れた後に戻る手順を設計する",
      "揺れたあと、私はどう戻っている？戻りやすくするために今できる最小の補正は？"
    ),
  ];
}

/**
 * レポート本文（content_text）に埋め込む用の整形
 */
export function formatCrossTopicsText(topics, reportType) {
  const label = labelForPeriod(reportType);
  const arr = Array.isArray(topics) ? topics : [];

  const lines = [];
  lines.push("【自己構造トピック候補（Pieceで深掘り）】");

  if (arr.length === 0) {
    lines.push(`・${label}はまだ十分なログがないため、自己構造トピックはこれから見えてきます。`);
    return lines.join("\n");
  }

  arr.slice(0, 3).forEach((t, i) => {
    lines.push(`・${i + 1}. ${t.title}`);
    if (t.suggestedQuestion) lines.push(`  - おすすめ質問: ${t.suggestedQuestion}`);
  });

  return lines.join("\n");
}

export default function AnalysisCrossLinkSection({
  reportType = "weekly",
  topics = [],
  onOpenPieceDeepDive,
}) {
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);
  const label = labelForPeriod(reportType);

  const list = useMemo(() => {
    const arr = Array.isArray(topics) ? topics : [];
    return arr.slice(0, 3);
  }, [topics]);

  const openTopic = (topic) => {
    // 親側がタブ切替 / ナビゲーションを持っている場合はそれを呼ぶ
    if (typeof onOpenPieceDeepDive === "function") {
      onOpenPieceDeepDive({
        source: "analysis",
        reportType,
        target: "piece",
        // v0.1: Piece側の実装に合わせて今後拡張
        section: "self_structure_report",
        topic: topic || null,
        topic_id: topic?.id || null,
        suggested_question: topic?.suggestedQuestion || null,
      });
      return;
    }

    // 未接続の場合は、ユーザーが手動で深掘りできるように補助文を出す
    const q = topic?.suggestedQuestion
      ? `\n\nおすすめ質問:\n${topic.suggestedQuestion}`
      : "";
    Alert.alert(
      "Pieceで深掘り",
      `Pieceを開いて「自己構造レポート」または「Pieceライブラリ」で深掘りしてみてください。${q}`
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>【自己構造トピック候補】</Text>
        <Text style={styles.sub}>
          {label}の感情構造から、自己構造（Piece）で触れると良さそうな論点
        </Text>
      </View>

      {list.length === 0 ? (
        <Text style={styles.empty}>
          まだ十分なログがないため、トピックはこれから見えてきます。
        </Text>
      ) : (
        <>
          {list.map((t, idx) => (
            <TouchableOpacity
              key={String(t.id || idx)}
              style={styles.row}
              onPress={() => openTopic(t)}
              activeOpacity={0.85}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.rowTitle} numberOfLines={2}>
                  {idx + 1}. {t.title}
                </Text>
                {t.blurb ? (
                  <Text style={styles.rowSub} numberOfLines={2}>
                    {t.blurb}
                  </Text>
                ) : null}
                {t.suggestedQuestion ? (
                  <Text style={styles.rowHint} numberOfLines={2}>
                    例）{t.suggestedQuestion}
                  </Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity
        style={styles.openBtn}
        onPress={() => openTopic(list[0] || null)}
        activeOpacity={0.85}
      >
        <Ionicons
          name="person-circle-outline"
          size={18}
          color="#111827"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.openText}>Pieceで深掘りする</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(COLORS, ui) {
  return StyleSheet.create(applyTypographyTokens({
  card: {
    marginHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
  },
  header: { marginBottom: 8 },
  title: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    fontSize: 16,
  },
  sub: { fontSize: 12, color: "#6B7280", lineHeight: 18 },

  empty: { color: "#374151", lineHeight: 20 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  rowTitle: { fontSize: 13, fontWeight: "800", color: "#111827" },
  rowSub: { marginTop: 2, fontSize: 12, color: "#374151", lineHeight: 18 },
  rowHint: { marginTop: 4, fontSize: 11, color: "#6B7280", lineHeight: 16 },

  openBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  openText: { fontSize: 13, color: "#111827", fontWeight: "800" },
  }, ui));
}
