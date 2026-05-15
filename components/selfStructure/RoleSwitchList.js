import React from "react";
import { Text, View } from "react-native";
import { asList, asObject, asText } from "./watashiMapFormatters";

export default function RoleSwitchList({ roleSwitches, localStyles }) {
  const items = asList(roleSwitches).filter((item) => asObject(item));
  if (items.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>役割スイッチ</Text>
        <Text style={localStyles.sectionSubtitle}>場面ごとに立ち上がりやすい役割を見ます</Text>
      </View>

      {items.map((item, index) => {
        const context = asObject(item.context) || {};
        const role = asObject(item.role) || {};
        const key = asText(item.key) || `${asText(context.key) || "context"}-${asText(role.key) || index}`;
        const contextLabel = asText(context.label) || "場面";
        const roleLabel = asText(role.label) || "役割";
        const tendency = asText(item.tendency_label || item.tendencyLabel) || "立ち上がりやすい";
        const dots = asText(item.score_display || item.scoreDisplay);
        const preview = asText(item.route_preview || item.routePreview);
        const safeNote = asText(item.safe_note || item.safeNote) || "これは性格タイプではなく、この場面で見えた動き方です。";
        return (
          <View key={key} style={localStyles.roleSwitchCard}>
            <View style={localStyles.roleSwitchTopRow}>
              <View style={localStyles.contextChip}>
                <Text style={localStyles.contextChipText}>{contextLabel}</Text>
              </View>
              {dots ? <Text style={localStyles.dotsText}>{dots}</Text> : null}
            </View>
            <Text style={localStyles.roleSwitchTitle}>{roleLabel}</Text>
            <Text style={localStyles.roleSwitchBody}>
              {contextLabel}の場面では、{roleLabel}が{tendency}ように見えます。
            </Text>
            {preview ? <Text style={localStyles.roleSwitchPreview}>{preview}</Text> : null}
            {safeNote ? <Text style={localStyles.safeNote}>{safeNote}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}
