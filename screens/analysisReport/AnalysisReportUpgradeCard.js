import React from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AnalysisReportUpgradeCard({
  visible,
  tierLoading,
  copy,
  styles,
  themed,
  isDark,
  colors,
  ui,
  disableActions,
  onOpenSubscription,
}) {
  if (!visible) return null;
  const cardCopy = copy || {};

  return (
    <View style={[styles.chartCard, themed.chartCard]}>
      {tierLoading ? (
        <View style={{ paddingVertical: 10 }}>
          <ActivityIndicator color={isDark ? colors.TEXT_ON_LIGHT : undefined} />
        </View>
      ) : (
        <>
          {cardCopy.badge ? (
            <View style={[styles.paywallTrialBadge, themed.paywallTrialBadge]}>
              <Text style={[styles.paywallTrialBadgeText, themed.paywallTrialBadgeText]}>
                {cardCopy.badge}
              </Text>
            </View>
          ) : null}

          {cardCopy.headline ? (
            <Text style={[styles.paywallTrialHeadline, themed.paywallTrialHeadline]}>
              {cardCopy.headline}
            </Text>
          ) : null}

          <Text style={[styles.paywallLead, themed.paywallLead]}>{cardCopy.lead}</Text>
          <Text style={[styles.paywallBodyStrong, themed.paywallBodyStrong]}>
            {cardCopy.bodyStrong}
          </Text>
          {cardCopy.note ? (
            <Text style={[styles.paywallNote, themed.paywallNote]}>{cardCopy.note}</Text>
          ) : null}
        </>
      )}

      {!tierLoading ? (
        <TouchableOpacity
          style={[styles.paywallBtn, themed.paywallBtn]}
          disabled={disableActions}
          onPress={() => {
            if (disableActions) return;
            if (typeof onOpenSubscription === "function") {
              try {
                onOpenSubscription?.();
              } catch {
                // no-op
              }
              return;
            }
            Alert.alert(
              "プラン確認",
              "加入画面を開けませんでした。もう一度お試しください。"
            );
          }}
          activeOpacity={disableActions ? 1 : 0.85}
        >
          <Text style={[styles.paywallBtnText, themed.paywallBtnText]}>
            {cardCopy.ctaLabel}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={
              isDark
                ? colors.ACCENT_TEXT || colors.TEXT_ON_LIGHT
                : ui?.text?.accentOnButton ?? colors.ACCENT_TEXT
            }
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
