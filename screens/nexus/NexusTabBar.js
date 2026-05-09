import React from "react";
import { Text, View } from "react-native";

import CocolonPressable from "../../components/CocolonPressable";
import { ScreenUnreadBadge } from "../../components/UnreadBadge";
import { TABS } from "./nexusRouteModel";

export default function NexusTabBar({
  activeTab,
  setActiveTab,
  pieceTabRef,
  pieceTabUnread,
  emotionLogTabUnread,
  styles,
}) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const content = (
          <CocolonPressable
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.key)}
          >
            <View
              style={[
                styles.tabLabelWrap,
                isActive && styles.tabLabelWrapActive,
              ]}
            >
              <View style={styles.tabLabelRow}>
                <Text
                  style={[
                    styles.tabLabelText,
                    isActive && styles.tabLabelTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                <ScreenUnreadBadge
                  visible={
                    (tab.key === "piece" && pieceTabUnread) ||
                    (tab.key === "emotion_log" && emotionLogTabUnread)
                  }
                  style={styles.tabUnreadBadge}
                />
              </View>
            </View>
          </CocolonPressable>
        );

        if (tab.key === "piece") {
          return (
            <View
              key={tab.key}
              ref={pieceTabRef}
              collapsable={false}
              style={styles.tabItemWrap}
            >
              {content}
            </View>
          );
        }

        return (
          <View key={tab.key} style={styles.tabItemWrap}>
            {content}
          </View>
        );
      })}
    </View>
  );
}
