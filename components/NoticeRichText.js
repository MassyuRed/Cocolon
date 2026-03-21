import React, { useMemo } from "react";
import { Text } from "react-native";

import {
  findNoticeActionByKey,
  normalizeNoticeBodySegments,
  normalizeNoticeActions,
} from "../lib/noticeActionRuntime";

export default function NoticeRichText({
  body,
  bodySegments,
  actions,
  textStyle,
  linkStyle,
  onPressAction,
}) {
  const normalizedActions = useMemo(
    () => normalizeNoticeActions(actions, null),
    [actions],
  );
  const segments = useMemo(
    () => normalizeNoticeBodySegments(bodySegments, body),
    [body, bodySegments],
  );

  return (
    <Text style={textStyle}>
      {segments.map((segment, index) => {
        const type = String(segment?.type || "text").trim().toLowerCase();
        const text = String(segment?.text || "");
        if (!text) return null;

        if (type === "action") {
          const action = findNoticeActionByKey(normalizedActions, segment?.action_key);
          if (!action || typeof onPressAction !== "function") {
            return <Text key={`notice-segment-${index}`}>{text}</Text>;
          }
          return (
            <Text
              key={`notice-segment-${index}`}
              style={linkStyle}
              accessibilityRole="link"
              suppressHighlighting
              onPress={() => onPressAction(action)}
            >
              {text}
            </Text>
          );
        }

        return <Text key={`notice-segment-${index}`}>{text}</Text>;
      })}
    </Text>
  );
}
