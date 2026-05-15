import React from "react";
import { Text, View } from "react-native";
import { asList, asObject, asText } from "./watashiMapFormatters";

function LabelList({ label, items, localStyles }) {
  const values = asList(items)
    .map((item) => asText(asObject(item)?.label) || asText(item))
    .filter(Boolean);
  if (values.length === 0) return null;
  return (
    <View style={localStyles.infoRow}>
      <Text style={localStyles.infoLabel}>{label}</Text>
      <Text style={localStyles.infoValue}>{values.join(" / ")}</Text>
    </View>
  );
}

export default function WatashiMapOverviewCard({ overview, payload, localStyles }) {
  const data = asObject(overview) || {};
  const observation = asObject(data.observation_amount || data.observationAmount) || {};
  const summary = asText(data.summary);
  const emptyTitle = asText(payload?.empty_title || payload?.emptyTitle);
  const emptyBody = asText(payload?.empty_body || payload?.emptyBody);

  return (
    <View style={[localStyles.card, localStyles.overviewCard]}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>{asText(data.title) || "今のわたしマップ"}</Text>
        {asText(payload?.period_label || payload?.periodLabel) ? (
          <Text style={localStyles.sectionSubtitle}>{asText(payload?.period_label || payload?.periodLabel)}</Text>
        ) : null}
      </View>

      <Text style={localStyles.explainText}>
        人は、相手や場所によって少しずつ違う自分で動いています。
        わたしマップでは、あなたがどんな場面でどんな役割になりやすいか、そしてそのとき選びやすい行動を見ていきます。
      </Text>

      {summary ? <Text style={localStyles.summaryText}>{summary}</Text> : null}
      {!summary && emptyTitle ? <Text style={localStyles.summaryText}>{emptyTitle}</Text> : null}
      {!summary && emptyBody ? <Text style={localStyles.bodyText}>{emptyBody}</Text> : null}

      <View style={localStyles.infoPanel}>
        <LabelList label="見えている場面" items={data.active_contexts || data.activeContexts} localStyles={localStyles} />
        <LabelList label="立ち上がりやすい役割" items={data.active_roles || data.activeRoles} localStyles={localStyles} />
        <LabelList label="選びやすい行動" items={data.action_tendencies || data.actionTendencies} localStyles={localStyles} />
        <View style={localStyles.infoRow}>
          <Text style={localStyles.infoLabel}>観測量</Text>
          <Text style={localStyles.infoValue}>{asText(observation.label) || "まだ少なめです"}</Text>
        </View>
      </View>
    </View>
  );
}
