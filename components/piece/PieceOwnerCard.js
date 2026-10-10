import React from 'react';
import { View, Text, Button } from 'react-native';

const h = React.createElement;
const formats = { short_essay: 'エッセイ', quote: '引用', declaration: '宣言' };
const themes = { soft_paper: 'ソフトペーパー', quiet_night: '静かな夜' };

/** Full canonical saved text. This is not the fixed native image renderer. */
export default function PieceOwnerCard({ record, onOpen }) {
  const visibility = record.visibility_scope === 'private' ? '非公開（自分のみ）' : '公開';
  return h(View, { testID: 'piece-owner-card', style: { padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#C8C8C8', borderRadius: 12, backgroundColor: '#FFFFFF' } },
    h(Text, { accessibilityLabel: '公開範囲：' + visibility, style: { color: '#202020', fontWeight: '600', fontSize: 16 } }, visibility),
    h(Text, { style: { color: '#494949', fontSize: 14, marginVertical: 8 } },
      `${new Date(record.saved_at).toLocaleString()} / ${formats[record.format_type]} / ${themes[record.visual_recipe.theme.theme_id]} / ${record.visual_recipe.aspect_ratio}`),
    record.content_status === 'adjusted' ? h(Text, { style: { color: '#494949', fontSize: 14, marginBottom: 8 } },
      '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
    h(Text, { selectable: true, testID: 'piece-owner-text', style: { color: '#202020', fontSize: 18, lineHeight: 29 } }, record.piece_text),
    onOpen ? h(Button, { title: '詳細を開く', accessibilityLabel: 'このPieceの詳細を開く', onPress: onOpen }) : null,
  );
}
