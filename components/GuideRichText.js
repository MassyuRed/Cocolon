import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { applyTypographyTokens } from "../ui/applyTypographyTokens";
import { useTheme } from "../theme/ThemeContext";
import { makeUiTokens } from "../ui/uiTokens";

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
  const { colors, themeName } = useTheme();
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => createStyles(colors, ui), [colors, ui]);

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

function createStyles(colors, ui) {
  const text = ui?.text || {};

  return StyleSheet.create(applyTypographyTokens({
    paragraph: {
      color: colors.TEXT_ON_LIGHT,
      marginBottom: 16,
    },
    heading: {
      color: colors.TEXT_ON_LIGHT,
      marginTop: 12,
      marginBottom: 12,
    },
    listBlock: {
      marginBottom: 16,
    },
    listItemRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
      gap: 8,
    },
    listBullet: {
      color: colors.TEXT_SUBTLE,
      minWidth: 18,
      flexShrink: 0,
    },
    listItemText: {
      flex: 1,
      color: colors.TEXT_ON_LIGHT,
      minWidth: 0,
    },
    noteCard: {
      marginBottom: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.CARD_BORDER,
      backgroundColor: colors.SURFACE_TONAL,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    noteText: {
      color: colors.TEXT_ON_LIGHT,
    },
    termLink: {
      color: colors.TITLE_GOLD,
      textDecorationLine: "underline",
      fontWeight: '600',
    },
  }, ui, {"paragraph":"body","heading":"sectionTitle","listBullet":"body","listItemText":"body","noteText":"body"}));
}
