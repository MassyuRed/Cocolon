import React from "react";
import { Text, View } from "react-native";
import { asList, asObject, asText } from "./watashiMapFormatters";

export default function RoutePatternCard({ routes, localStyles }) {
  const items = asList(routes).filter((item) => asObject(item));
  if (items.length === 0) return null;

  return (
    <View style={localStyles.card}>
      <View style={localStyles.sectionHeader}>
        <Text style={localStyles.sectionTitle}>よく通るルート</Text>
        <Text style={localStyles.sectionSubtitle}>役割スイッチが入った後の行動の流れです</Text>
      </View>

      {items.map((route, routeIndex) => {
        const key = asText(route.key) || `route-${routeIndex}`;
        const steps = asList(route.steps).filter((step) => asObject(step));
        return (
          <View key={key} style={localStyles.routeCard}>
            <Text style={localStyles.routeTitle}>{asText(route.title) || "よく通るルート"}</Text>
            {steps.map((step, stepIndex) => {
              const stepKey = `${key}-${stepIndex}`;
              return (
                <View key={stepKey} style={localStyles.routeStepRow}>
                  <View style={localStyles.routeStepMarkerColumn}>
                    <View style={localStyles.routeStepDot} />
                    {stepIndex < steps.length - 1 ? <View style={localStyles.routeStepLine} /> : null}
                  </View>
                  <View style={localStyles.routeStepTextColumn}>
                    <Text style={localStyles.routeStepLabel}>{asText(step.label) || "項目"}</Text>
                    <Text style={localStyles.routeStepText}>{asText(step.text) || asText(step.body)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
