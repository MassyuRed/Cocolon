import React from "react";
import { Text, View } from "react-native";
import { asList, asObject, asText } from "./watashiMapFormatters";

export default function UnknownAreaCard({ unknownAreas, localStyles }) {
  const items = asList(unknownAreas).filter((item) => asObject(item));
  if (items.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>まだ地図にない場所</Text>
        <Text style={localStyles.sectionSubtitle}>観測が少ない場所は、言い切らずに残します</Text>
      </View>

      {items.map((item, index) => {
        const key = asText(item.key) || `unknown-${index}`;
        return (
          <View key={key} style={localStyles.unknownCard}>
            <Text style={localStyles.unknownTitle}>{asText(item.label) || "まだ地図にない場所"}</Text>
            <Text style={localStyles.unknownReason}>{asText(item.reason) || "入力がまだ少なく、役割を言い切らない状態です。"}</Text>
            {asText(item.next_observation_hint || item.nextObservationHint) ? (
              <Text style={localStyles.unknownHint}>{asText(item.next_observation_hint || item.nextObservationHint)}</Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
