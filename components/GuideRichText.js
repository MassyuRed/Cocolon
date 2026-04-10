import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";

const TERM_PATTERN = /\[\[term:([a-zA-Z0-9_-]+)\|([^[\]]+)\]\]/g;

function buildInlineNodes(text, onPressTerm, styles, keyPrefix) {
  TERM_PATTERN.lastIndex = 0;
  const source = String(text || "");
  const nodes = [];
  let cursor = 0;
  let match = TERM_PATTERN.exec(source);

  while (match) {
    const [raw, termId, label] = match;
    const start = match.index;

    if (start > cursor) {
      nodes.push(source.slice(cursor, start));
    }

    nodes.push(
      <Text
        key={`${keyPrefix}-${termId}-${start}`}
        accessibilityRole="link"
        onPress={() => onPressTerm?.(termId)}
        style={styles.termLink}
        suppressHighlighting
      >
        {label}
      </Text>
    );

    cursor = start + raw.length;
    match = TERM_PATTERN.exec(source);
  }

  if (cursor < source.length) {
    nodes.push(source.slice(cursor));
  }

  TERM_PATTERN.lastIndex = 0;
  return nodes;
}

function renderListItem({ item, index, kind, styles, onPressTerm }) {
  const bullet = kind === "ol" ? `${index + 1}.` : "・";

  return (
    <View key={`${kind}-${index}`} style={styles.listItemRow}>
      <Text style={styles.listBullet}>{bullet}</Text>
      <Text style={styles.listItemText}>
        {buildInlineNodes(item, onPressTerm, styles, `list-${kind}-${index}`)}
      </Text>
    </View>
  );
}

export default function GuideRichText({ blocks = [], onPressTerm }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      {blocks.map((block, index) => {
        const type = String(block?.type || "p").trim().toLowerCase();

        if (type === "h2") {
          return (
            <Text key={`block-${index}`} style={styles.heading}>
              {buildInlineNodes(block?.text, onPressTerm, styles, `heading-${index}`)}
            </Text>
          );
        }

        if (type === "ul" || type === "ol") {
          const items = Array.isArray(block?.items) ? block.items : [];
          return (
            <View key={`block-${index}`} style={styles.listBlock}>
              {items.map((item, itemIndex) =>
                renderListItem({
                  item,
                  index: itemIndex,
                  kind: type,
                  styles,
                  onPressTerm,
                })
              )}
            </View>
          );
        }

        if (type === "note") {
          return (
            <View key={`block-${index}`} style={styles.noteCard}>
              <Text style={styles.noteText}>
                {buildInlineNodes(block?.text, onPressTerm, styles, `note-${index}`)}
              </Text>
            </View>
          );
        }

        return (
          <Text key={`block-${index}`} style={styles.paragraph}>
            {buildInlineNodes(block?.text, onPressTerm, styles, `paragraph-${index}`)}
          </Text>
        );
      })}
    </View>
  );
}

function createStyles(colors) {
  const guideDarkSubtext = "#374151";

  return StyleSheet.create({
    paragraph: {
      fontSize: 14,
      lineHeight: 24,
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 14,
    },
    heading: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: colors.TITLE_GOLD,
      marginTop: 6,
      marginBottom: 10,
    },
    listBlock: {
      marginBottom: 14,
    },
    listItemRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    listBullet: {
      width: 18,
      fontSize: 14,
      lineHeight: 24,
      fontWeight: "700",
      color: colors.TITLE_GOLD,
    },
    listItemText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 24,
      color: colors.TEXT_ON_LIGHT,
    },
    noteCard: {
      marginBottom: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.PANEL_BG,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    noteText: {
      fontSize: 13,
      lineHeight: 22,
      color: guideDarkSubtext,
    },
    termLink: {
      color: colors.TITLE_GOLD,
      textDecorationLine: "underline",
      fontWeight: "700",
    },
  });
}
