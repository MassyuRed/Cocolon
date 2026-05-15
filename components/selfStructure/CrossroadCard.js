import React from "react";
import { Text, View } from "react-native";
import { asList, asObject, asText } from "./watashiMapFormatters";

function AxisBlock({ label, value, localStyles }) {
  if (!asText(value)) return null;
  return (
    <View style={localStyles.axisBlock}>
      <Text style={localStyles.axisLabel}>{label}</Text>
      <Text style={localStyles.axisValue}>{value}</Text>
    </View>
  );
}

export default function CrossroadCard({ crossroads, localStyles }) {
  const items = asList(crossroads).filter((item) => asObject(item));
  if (items.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>迷いやすい分かれ道</Text>
        <Text style={localStyles.sectionSubtitle}>自己認識・実際の動き・こうありたい役割を並べて見ます</Text>
      </View>

      {items.map((item, index) => {
        const context = asObject(item.context) || {};
        const key = asText(item.key) || `crossroad-${index}`;
        const selfRole = asText(asObject(item.self_role || item.selfRole)?.label);
        const observedRole = asText(asObject(item.observed_role || item.observedRole)?.label);
        const desiredRole = asText(asObject(item.desired_role || item.desiredRole)?.label);
        return (
          <View key={key} style={localStyles.crossroadCard}>
            <Text style={localStyles.crossroadContext}>{asText(context.label) || "場面"}</Text>
            <View style={localStyles.axisRow}>
              <AxisBlock label="自分では" value={selfRole} localStyles={localStyles} />
              <AxisBlock label="実際には" value={observedRole} localStyles={localStyles} />
              <AxisBlock label="本当は" value={desiredRole} localStyles={localStyles} />
            </View>
            {asText(item.note) ? <Text style={localStyles.crossroadNote}>{asText(item.note)}</Text> : null}
          </View>
        );
      })}
    </View>
  );
}
