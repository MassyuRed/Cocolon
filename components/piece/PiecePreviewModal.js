/** PCE-8 B10 review surface with a bounded RN image-layout prototype.
 * The host provides a freshly checked display view from readPiecePreviewDisplay.
 * No text editing, publication, entitlement defaults, image or save success.
 */
import React from 'react';
import { Modal, View, Text, ScrollView, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieceVisualCard from './PieceVisualCard';

const element = React.createElement;
const formats = { short_essay: 'エッセイ', quote: '引用', declaration: '宣言' };
const plans = { free: 'Free', plus: 'Plus', premium: 'Premium' };
const branding = { required_small: '小さく表示', required_subtle: '控えめに表示', off: '表示なし' };
const themes = { soft_paper: 'ソフトペーパー', quiet_night: '静かな夜' };

export default function PiecePreviewModal({ visible = false, display, onClose, onRetry }) {
  if (visible !== true || !display || display.phase === 'hidden') return null;
  const received = display.phase === 'received' && display.hashVerified === true && display.preview;
  const preview = received ? display.preview : null;
  return element(Modal, {
    visible: true, animationType: 'slide', presentationStyle: 'fullScreen', onRequestClose: onClose,
  }, element(SafeAreaView, { style: { flex: 1, backgroundColor: '#FFFFFF' } },
    element(View, { style: { flex: 1, padding: 20 }, accessibilityViewIsModal: true },
      element(Text, { accessibilityRole: 'header', style: { fontSize: 22, color: '#202020', marginBottom: 12 } }, 'Pieceのプレビュー'),
      element(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 24 } },
        display.phase === 'loading' ? element(ActivityIndicator, { accessibilityLabel: 'Pieceを取得中' }) : null,
        display.phase === 'loading' ? element(Text, { style: { color: '#202020', fontSize: 16 }, accessibilityLiveRegion: 'polite' }, 'Pieceを取得しています。') : null,
        preview ? element(Text, { style: { color: '#202020', fontSize: 16, marginBottom: 16 } },
          `${formats[preview.format_type]} / ${themes[preview.visual_recipe.theme.theme_id]} / ${preview.visual_recipe.aspect_ratio}`) : null,
        preview ? element(View, { testID: 'piece-plan-details', style: { marginBottom: 16 } },
          element(Text, { style: { color: '#202020', fontSize: 16 } },
            `${plans[preview.quota.subscription_tier]}プランで利用できる設定`),
          element(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22 } },
            preview.plan_capabilities.format_selection === 'fixed' ? '形式：エッセイ（固定）' :
              preview.plan_capabilities.format_selection === 'automatic' ? '形式：入力に合う形式を自動選択' :
                `選択できる形式：${preview.eligible_formats.map(format => formats[format]).join(' / ')}`),
          element(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22 } },
            `テーマ：${preview.plan_capabilities.theme_ids.map(theme => themes[theme]).join(' / ')}`),
          element(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22 } },
            `画像比率：${preview.plan_capabilities.aspect_ratios.join(' / ')}`),
          element(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22 } },
            `Cocolonの表記：${preview.plan_capabilities.branding_modes.map(mode => branding[mode]).join(' / ')}`),
          element(Text, { testID: 'piece-save-quota', style: { color: '#202020', fontSize: 16, marginTop: 8 } },
            `${preview.quota.month_key}（日本時間）の保存枠：${preview.quota.remaining_count === null
              ? '回数制限なし' : `残り${preview.quota.remaining_count}回 / ${preview.quota.save_limit}回`}`),
          element(Text, { style: { color: '#494949', fontSize: 14, lineHeight: 22 } },
            '取得時点の情報です。保存時に残り回数を確認します。設定の変更はまだ利用できません。'),
        ) : null,
        preview?.content_status === 'adjusted' ? element(Text, { style: { color: '#202020', fontSize: 16, marginBottom: 16 } },
          '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
        preview ? element(PieceVisualCard, { display }) : null,
        preview ? element(Text, { testID: 'piece-canonical-text', selectable: true,
          style: { fontSize: 18, lineHeight: 29, color: '#202020' } }, preview.piece_text) : null,
        display.phase === 'unavailable' ? element(Text, { accessibilityRole: 'alert',
          style: { fontSize: 16, color: '#202020' } }, display.message) : null,
        element(Text, { style: { fontSize: 14, lineHeight: 22, color: '#494949', marginTop: 20 } },
          'Pieceの保存・画像の書き出し・共有は、まだ利用できません。'),
      ),
      element(View, { style: { paddingTop: 12 } },
        display.canRetry === true ? element(Button, { title: '同じ要求で再試行', onPress: onRetry, accessibilityLabel: '同じ要求で再試行' }) : null,
        element(Button, { title: '閉じる', onPress: onClose, accessibilityLabel: 'Pieceの本文プレビューを閉じる' }),
      ),
    ),
  ));
}
