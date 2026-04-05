import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { applyTypographyTokens } from "../../ui/applyTypographyTokens";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function asList(value) {
  return Array.isArray(value) ? value : [];
}

function asText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function scoreToDots(score, maxScore) {
  const safeScore = asNumber(score);
  const safeMax = asNumber(maxScore);
  if (safeScore <= 0 || safeMax <= 0) return "・";
  const ratio = safeScore / safeMax;
  if (ratio >= 0.75) return "●●●";
  if (ratio >= 0.5) return "●●";
  if (ratio >= 0.25) return "●";
  return "・";
}

function targetLabel(item) {
  if (!item || typeof item !== "object") return "対象";
  return asText(item.target_label_ja) || asText(item.targetLabelJa) || asText(item.target_key) || asText(item.targetKey) || "対象";
}

function roleLabel(item) {
  if (!item || typeof item !== "object") return "役割";
  return asText(item.role_label_ja) || asText(item.roleLabelJa) || asText(item.template_role_label_ja) || asText(item.templateRoleLabelJa) || asText(item.role_key) || asText(item.roleKey) || asText(item.template_role) || asText(item.templateRole) || "役割";
}

function buildPalette(colors, isDark) {
  return {
    cardBg: colors?.PANEL_BG || (isDark ? "#111827" : "#FFFFFF"),
    mutedBg: colors?.BG_SILVER || (isDark ? "#1F2937" : "#F9FAFB"),
    border: colors?.CARD_BORDER || "#E5E7EB",
    text: colors?.TEXT_ON_LIGHT || (isDark ? "#F9FAFB" : "#111827"),
    subtle: colors?.TEXT_SUBTLE || (isDark ? "#9CA3AF" : "#6B7280"),
    accent: colors?.GOLD_BUTTON || "#D4AF37",
    accentText: colors?.ACCENT_TEXT || "#111827",
    chipBg: isDark ? (colors?.BG_SILVER || "#263244") : "#F3F4F6",
    chipBorder: colors?.CARD_BORDER || "#E5E7EB",
  };
}

function DeepSectionTitle({ title, subtitle, localStyles }) {
  if (!asText(title)) return null;
  return (
    <View style={localStyles.sectionHeader}>
      <Text style={localStyles.sectionTitle}>{title}</Text>
      {asText(subtitle) ? <Text style={localStyles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function SummaryCard({ summaryCard, localStyles }) {
  const card = asObject(summaryCard);
  if (!card) return null;

  const headline = asText(card.headline);
  const coreTarget = asObject(card.core_target) || asObject(card.coreTarget);
  const coreRole = asObject(card.core_role) || asObject(card.coreRole);
  const coreGeneratedRole = asObject(card.core_generated_role) || asObject(card.coreGeneratedRole);
  const chips = asList(card.chips).map((item) => asText(item)).filter(Boolean);

  if (!headline && !coreTarget && !coreRole && !coreGeneratedRole && chips.length === 0) {
    return null;
  }

  return (
    <View style={localStyles.card}>
      <DeepSectionTitle
        title="今回の見立て"
        subtitle="固定的な性格ではなく、場面で立ち上がる自己を見ています"
        localStyles={localStyles}
      />
      {headline ? <Text style={localStyles.summaryHeadline}>{headline}</Text> : null}

      <View style={localStyles.summaryMetaRow}>
        {coreTarget ? (
          <View style={localStyles.metaBlock}>
            <Text style={localStyles.metaLabel}>中心の対象</Text>
            <Text style={localStyles.metaValue}>{targetLabel(coreTarget)}</Text>
          </View>
        ) : null}
        {coreRole ? (
          <View style={localStyles.metaBlock}>
            <Text style={localStyles.metaLabel}>立ち上がりやすい役割</Text>
            <Text style={localStyles.metaValue}>{roleLabel(coreRole)}</Text>
          </View>
        ) : null}
      </View>

      {asText(coreGeneratedRole?.description) ? (
        <Text style={localStyles.generatedDescription}>{asText(coreGeneratedRole.description)}</Text>
      ) : null}

      {chips.length > 0 ? (
        <View style={localStyles.chipRow}>
          {chips.map((chip) => (
            <View key={chip} style={localStyles.chip}>
              <Text style={localStyles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function RoleSwitchMapCard({ roleSwitchMap, localStyles }) {
  const map = asObject(roleSwitchMap);
  if (!map) return null;

  const targets = asList(map.targets).filter((item) => asObject(item));
  const roles = asList(map.roles).filter((item) => asObject(item));
  const cells = asList(map.cells).filter((item) => asObject(item));
  const maxScore = asNumber(map.max_score ?? map.maxScore);
  const dominant = asList(map.dominant_by_target || map.dominantByTarget)
    .filter((item) => asObject(item))
    .reduce((acc, item) => {
      const key = asText(item.target_key) || asText(item.targetKey);
      if (key) acc[key] = item;
      return acc;
    }, {});

  if (targets.length === 0 || roles.length === 0 || cells.length === 0) {
    return null;
  }

  const cellMap = {};
  cells.forEach((cell) => {
    const tKey = asText(cell.target_key) || asText(cell.targetKey);
    const rKey = asText(cell.role_key) || asText(cell.roleKey);
    if (!tKey || !rKey) return;
    cellMap[`${tKey}__${rKey}`] = cell;
  });

  return (
    <View style={localStyles.card}>
      <DeepSectionTitle
        title="何に触れたとき、どの役割が出やすいか"
        subtitle="対象ごとの役割スイッチを地図として見ます"
        localStyles={localStyles}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
        <View style={localStyles.mapTable}>
          <View style={localStyles.mapHeaderRow}>
            <View style={[localStyles.mapCell, localStyles.mapTargetCell, localStyles.mapHeaderCell]}>
              <Text style={localStyles.mapHeaderText}>対象</Text>
            </View>
            {roles.map((role) => {
              const rKey = asText(role.role_key) || asText(role.roleKey) || roleLabel(role);
              return (
                <View key={rKey} style={[localStyles.mapCell, localStyles.mapHeaderCell]}>
                  <Text style={localStyles.mapHeaderText}>{roleLabel(role)}</Text>
                </View>
              );
            })}
          </View>

          {targets.map((target) => {
            const tKey = asText(target.target_key) || asText(target.targetKey) || targetLabel(target);
            const dominantItem = dominant[tKey];
            return (
              <View key={tKey} style={localStyles.mapRow}>
                <View style={[localStyles.mapCell, localStyles.mapTargetCell]}>
                  <Text style={localStyles.mapTargetText}>{targetLabel(target)}</Text>
                  {dominantItem ? (
                    <Text style={localStyles.mapDominantText}>主役: {roleLabel(dominantItem)}</Text>
                  ) : null}
                </View>
                {roles.map((role) => {
                  const rKey = asText(role.role_key) || asText(role.roleKey) || roleLabel(role);
                  const cell = cellMap[`${tKey}__${rKey}`];
                  const score = asNumber(cell?.score);
                  return (
                    <View key={`${tKey}-${rKey}`} style={localStyles.mapCell}>
                      <Text style={localStyles.mapDots}>{scoreToDots(score, maxScore)}</Text>
                      <Text style={localStyles.mapScore}>{score > 0 ? score.toFixed(2) : "-"}</Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function BehaviorCardsSection({ behaviorCards, localStyles }) {
  const cards = asList(behaviorCards).filter((item) => asObject(item));
  if (cards.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <DeepSectionTitle
        title="この場面では、こう動きやすい"
        subtitle="役割単体ではなく、対象つきの行動パターンで見ます"
        localStyles={localStyles}
      />

      {cards.map((card, idx) => {
        const thinking = asList(card.thinking).filter((item) => asObject(item));
        const actions = asList(card.actions).filter((item) => asObject(item));
        const cardKey = asText(card.target_key) || asText(card.targetKey) || `behavior-${idx}`;
        return (
          <View key={cardKey} style={localStyles.subCard}>
            <Text style={localStyles.subCardTitle}>{targetLabel(card)}</Text>
            <Text style={localStyles.subCardRole}>{roleLabel(card)}</Text>
            {asText(card.generated_role_description || card.generatedRoleDescription) ? (
              <Text style={localStyles.subCardBody}>{asText(card.generated_role_description || card.generatedRoleDescription)}</Text>
            ) : null}

            {thinking.length > 0 ? (
              <View style={localStyles.patternBlock}>
                <Text style={localStyles.patternLabel}>思考</Text>
                <View style={localStyles.chipRow}>
                  {thinking.map((item, itemIdx) => {
                    const label = asText(item.label_ja) || asText(item.labelJa) || asText(item.key);
                    if (!label) return null;
                    return (
                      <View key={`${cardKey}-thinking-${itemIdx}`} style={localStyles.chip}>
                        <Text style={localStyles.chipText}>{label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {actions.length > 0 ? (
              <View style={localStyles.patternBlock}>
                <Text style={localStyles.patternLabel}>行動</Text>
                <View style={localStyles.chipRow}>
                  {actions.map((item, itemIdx) => {
                    const label = asText(item.label_ja) || asText(item.labelJa) || asText(item.key);
                    if (!label) return null;
                    return (
                      <View key={`${cardKey}-action-${itemIdx}`} style={localStyles.chip}>
                        <Text style={localStyles.chipText}>{label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {asNumber(card.evidence_count || card.evidenceCount) > 0 ? (
              <Text style={localStyles.evidenceText}>観測数: {asNumber(card.evidence_count || card.evidenceCount)}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function RoleGapSection({ roleGapCards, localStyles }) {
  const cards = asList(roleGapCards).filter((item) => asObject(item));
  if (cards.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <DeepSectionTitle
        title="自己認識と現実 / 理想のズレ"
        subtitle="苦しさを感情だけでなく、役割のギャップとして見ます"
        localStyles={localStyles}
      />

      {cards.map((card, idx) => {
        const primaryGap = asObject(card.primary_gap) || asObject(card.primaryGap);
        const cardKey = asText(card.target_key) || asText(card.targetKey) || `gap-${idx}`;
        return (
          <View key={cardKey} style={localStyles.subCard}>
            <Text style={localStyles.subCardTitle}>{targetLabel(card)}</Text>

            <View style={localStyles.gapColumns}>
              <View style={localStyles.gapColumn}>
                <Text style={localStyles.gapLabel}>自己認識</Text>
                <Text style={localStyles.gapValue}>{roleLabel(card.self_role || card.selfRole)}</Text>
              </View>
              <View style={localStyles.gapColumn}>
                <Text style={localStyles.gapLabel}>現実</Text>
                <Text style={localStyles.gapValue}>{roleLabel(card.real_role || card.realRole)}</Text>
              </View>
              <View style={localStyles.gapColumn}>
                <Text style={localStyles.gapLabel}>理想</Text>
                <Text style={localStyles.gapValue}>{roleLabel(card.desired_role || card.desiredRole)}</Text>
              </View>
            </View>

            {primaryGap ? (
              <View style={localStyles.gapNoteBox}>
                {asText(primaryGap.note) ? <Text style={localStyles.gapNoteText}>{asText(primaryGap.note)}</Text> : null}
                {asNumber(primaryGap.gap_score ?? primaryGap.gapScore) > 0 ? (
                  <Text style={localStyles.gapScoreText}>gap: {asNumber(primaryGap.gap_score ?? primaryGap.gapScore).toFixed(2)}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function UnknownAreaSection({ unknownArea, localStyles }) {
  const area = asObject(unknownArea);
  const items = asList(area?.items).filter((item) => asObject(item));
  if (items.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <DeepSectionTitle
        title="まだ見え切っていない場所"
        subtitle="断定しすぎず、次の観測ポイントを残します"
        localStyles={localStyles}
      />

      {items.map((item, idx) => {
        const itemKey = asText(item.target_key) || asText(item.targetKey) || `unknown-${idx}`;
        return (
          <View key={itemKey} style={localStyles.subCard}>
            <Text style={localStyles.subCardTitle}>{targetLabel(item)}</Text>
            {asText(item.kind_label_ja || item.kindLabelJa) ? (
              <Text style={localStyles.subCardRole}>{asText(item.kind_label_ja || item.kindLabelJa)}</Text>
            ) : null}
            {asText(item.reason) ? <Text style={localStyles.subCardBody}>{asText(item.reason)}</Text> : null}
            {asText(item.hint) ? <Text style={localStyles.unknownHint}>次に見る問い: {asText(item.hint)}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}

export default function SelfStructureDeepRenderer({ contentJson, colors, isDark }) {
  const visual = asObject(asObject(contentJson)?.selfStructureDeepVisual);
  const schema = asText(visual?.schema);
  const palette = useMemo(() => buildPalette(colors, !!isDark), [colors, isDark]);
  const localStyles = useMemo(() => createStyles(palette), [palette]);

  if (!visual || !schema) return null;

  return (
    <View style={localStyles.wrapper}>
      <SummaryCard summaryCard={visual.summaryCard} localStyles={localStyles} />
      <RoleSwitchMapCard roleSwitchMap={visual.roleSwitchMap} localStyles={localStyles} />
      <BehaviorCardsSection behaviorCards={visual.behaviorCards} localStyles={localStyles} />
      <RoleGapSection roleGapCards={visual.roleGapCards} localStyles={localStyles} />
      <UnknownAreaSection unknownArea={visual.unknownArea} localStyles={localStyles} />
    </View>
  );
}

function createStyles(palette) {
  return StyleSheet.create(
    applyTypographyTokens(
      {
        wrapper: {
          marginHorizontal: 12,
          marginBottom: 14,
        },
        card: {
          marginBottom: 14,
          borderWidth: 1,
          borderColor: palette.border,
          borderRadius: 14,
          backgroundColor: palette.cardBg,
          padding: 14,
        },
        sectionHeader: {
          marginBottom: 10,
        },
        sectionTitle: {
          color: palette.text,
          fontSize: 15,
          fontWeight: "800",
        },
        sectionSubtitle: {
          marginTop: 4,
          color: palette.subtle,
          fontSize: 12,
          lineHeight: 18,
        },
        summaryHeadline: {
          color: palette.text,
          fontSize: 15,
          fontWeight: "700",
          lineHeight: 24,
        },
        summaryMetaRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
        },
        metaBlock: {
          minWidth: 140,
          marginRight: 10,
          marginBottom: 10,
          padding: 10,
          borderRadius: 12,
          backgroundColor: palette.mutedBg,
          borderWidth: 1,
          borderColor: palette.border,
        },
        metaLabel: {
          color: palette.subtle,
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 4,
        },
        metaValue: {
          color: palette.text,
          fontSize: 14,
          fontWeight: "800",
        },
        generatedDescription: {
          marginTop: 10,
          color: palette.text,
          fontSize: 13,
          lineHeight: 20,
        },
        chipRow: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 10,
        },
        chip: {
          marginRight: 8,
          marginBottom: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: palette.chipBorder,
          backgroundColor: palette.chipBg,
        },
        chipText: {
          color: palette.text,
          fontSize: 12,
          fontWeight: "700",
        },
        mapTable: {
          minWidth: 420,
          borderWidth: 1,
          borderColor: palette.border,
          borderRadius: 12,
          overflow: "hidden",
          marginTop: 4,
        },
        mapHeaderRow: {
          flexDirection: "row",
          backgroundColor: palette.mutedBg,
        },
        mapRow: {
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: palette.border,
        },
        mapCell: {
          width: 84,
          minHeight: 60,
          paddingHorizontal: 8,
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          borderLeftWidth: 1,
          borderLeftColor: palette.border,
        },
        mapHeaderCell: {
          minHeight: 52,
        },
        mapTargetCell: {
          width: 132,
          alignItems: "flex-start",
          justifyContent: "center",
          borderLeftWidth: 0,
        },
        mapHeaderText: {
          color: palette.text,
          fontSize: 11,
          fontWeight: "800",
          textAlign: "center",
        },
        mapTargetText: {
          color: palette.text,
          fontSize: 13,
          fontWeight: "800",
        },
        mapDominantText: {
          marginTop: 4,
          color: palette.subtle,
          fontSize: 11,
          lineHeight: 16,
        },
        mapDots: {
          color: palette.text,
          fontSize: 15,
          fontWeight: "900",
          lineHeight: 20,
        },
        mapScore: {
          marginTop: 4,
          color: palette.subtle,
          fontSize: 11,
        },
        subCard: {
          marginTop: 10,
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.mutedBg,
        },
        subCardTitle: {
          color: palette.text,
          fontSize: 14,
          fontWeight: "800",
        },
        subCardRole: {
          marginTop: 4,
          color: palette.accentText,
          fontSize: 12,
          fontWeight: "800",
          backgroundColor: palette.accent,
          alignSelf: "flex-start",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
        },
        subCardBody: {
          marginTop: 10,
          color: palette.text,
          fontSize: 13,
          lineHeight: 20,
        },
        patternBlock: {
          marginTop: 10,
        },
        patternLabel: {
          color: palette.subtle,
          fontSize: 11,
          fontWeight: "800",
        },
        evidenceText: {
          marginTop: 8,
          color: palette.subtle,
          fontSize: 11,
        },
        gapColumns: {
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 10,
        },
        gapColumn: {
          flexGrow: 1,
          minWidth: 86,
          marginRight: 8,
          marginBottom: 8,
          padding: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.cardBg,
        },
        gapLabel: {
          color: palette.subtle,
          fontSize: 11,
          fontWeight: "700",
          marginBottom: 4,
        },
        gapValue: {
          color: palette.text,
          fontSize: 13,
          fontWeight: "800",
          lineHeight: 18,
        },
        gapNoteBox: {
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.cardBg,
        },
        gapNoteText: {
          color: palette.text,
          fontSize: 13,
          lineHeight: 20,
        },
        gapScoreText: {
          marginTop: 6,
          color: palette.subtle,
          fontSize: 11,
          fontWeight: "700",
        },
        unknownHint: {
          marginTop: 10,
          color: palette.text,
          fontSize: 12,
          lineHeight: 18,
        },
      },
      { fontSize: "m" }
    )
  );
}
