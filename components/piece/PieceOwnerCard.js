import React from 'react';
import { View, Text } from 'react-native';
import Button from '../CocolonButton';
import { PIECE_THEME_LABELS } from '../../features/piece/piecePalette';

const h = React.createElement;
const formats = { short_essay: 'エッセイ', quote: '引用', declaration: '宣言' };

/** Full canonical saved text. This is not the fixed native image renderer. */
export default function PieceOwnerCard({ record, onOpen, colors = {}, ui, detail = false }) {
  const visibility = record.visibility_scope === 'private' ? '非公開（自分のみ）' : '公開';
  const body = h(Text, { selectable: true, testID: 'piece-owner-text',
    style: { ...ui?.typography?.body, color: colors.TEXT_ON_LIGHT, marginBottom: detail ? 16 : 0 } }, record.piece_text);
  return h(View, { testID: 'piece-owner-card', style: { padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.CARD_BORDER, borderRadius: 24, backgroundColor: colors.PANEL_BG } },
    detail ? body : null,
    h(Text, { accessibilityLabel: '公開範囲：' + visibility, style: { ...ui?.typography?.button, color: colors.TEXT_ON_LIGHT } }, visibility),
    h(Text, { style: { ...ui?.typography?.description, color: colors.TEXT_SUBTLE, marginVertical: 8 } },
      `${new Date(record.saved_at).toLocaleString()} / ${formats[record.format_type]} / ${PIECE_THEME_LABELS[record.visual_recipe.theme.theme_id]} / ${record.visual_recipe.aspect_ratio}`),
    record.content_status === 'adjusted' ? h(Text, { style: { ...ui?.typography?.description, color: colors.TEXT_SUBTLE, marginBottom: 8 } },
      '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
    detail ? null : body,
    onOpen ? h(Button, { variant: 'secondary', style: { marginTop: 16 }, title: '詳細を開く', accessibilityLabel: 'このPieceの詳細を開く', onPress: onOpen }) : null,
  );
}
