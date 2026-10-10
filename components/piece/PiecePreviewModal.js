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

export default function PiecePreviewModal({ visible = false, display, onClose, onRetry, onVisualChange, onCancel }) {
  if (visible !== true || !display || display.phase === 'hidden') return null;
  const received = display.phase === 'received' && display.hashVerified === true && display.preview;
  const preview = received ? display.preview : null;
  const selection = preview ? { theme_id: preview.visual_recipe.theme.theme_id,
    aspect_ratio: preview.visual_recipe.aspect_ratio, branding_mode: preview.visual_recipe.branding.branding_mode } : null;
  const choices = (label, field, values, labels) => values.length > 1 && typeof onVisualChange === 'function'
    ? element(View, { key: field, testID: `piece-visual-${field}`, style: { marginTop: 12 } },
      element(Text, { style: { fontSize: 16, color: '#202020' } }, label),
      ...values.map(value => element(Button, { key: value,
        title: `${labels?.[value] || value}${selection[field] === value ? '（選択中）' : ''}`,
        accessibilityLabel: `${label}：${labels?.[value] || value}`,
        accessibilityState: { selected: selection[field] === value, disabled: selection[field] === value },
        disabled: selection[field] === value,
        onPress: () => onVisualChange({ ...selection, [field]: value }, {
          preview_id: preview.preview_id, preview_revision: preview.preview_revision,
          visual_recipe_hash: preview.visual_recipe_hash,
        }, display.visualToken),
      }))) : null;
  const loading = display.loadingKind === 'cancel' ? '候補を取り消しています。' :
    display.loadingKind === 'visual' ? '画像設定を更新しています。' :
    display.loadingKind === 'recover' ? '最新のプレビューを取得しています。' : 'Pieceを取得しています。';
  const retryLabel = display.retryKind === 'cancel' ? '同じ候補の取消を再試行' :
    display.retryKind === 'recover' ? '最新のプレビューを取得' : '同じ要求で再試行';
  return element(Modal, {
    visible: true, animationType: 'slide', presentationStyle: 'fullScreen', onRequestClose: onClose,
  }, element(SafeAreaView, { style: { flex: 1, backgroundColor: '#FFFFFF' } },
    element(View, { style: { flex: 1, padding: 20 }, accessibilityViewIsModal: true },
      element(Text, { accessibilityRole: 'header', style: { fontSize: 22, color: '#202020', marginBottom: 12 } }, 'Pieceのプレビュー'),
      element(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 24 } },
        display.phase === 'loading' ? element(ActivityIndicator, { accessibilityLabel: loading }) : null,
        display.phase === 'loading' ? element(Text, { style: { color: '#202020', fontSize: 16 }, accessibilityLiveRegion: 'polite' }, loading) : null,
        display.visualUpdated === true ? element(Text, { accessibilityRole: 'alert', accessibilityLiveRegion: 'polite',
          style: { color: '#202020', fontSize: 16, marginBottom: 12 } }, '画像設定を更新しました。') : null,
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
            '取得時点の情報です。保存時に残り回数を確認します。文章の形式変更はまだ利用できません。'),
          choices('テーマ', 'theme_id', preview.plan_capabilities.theme_ids, themes),
          choices('画像比率', 'aspect_ratio', preview.plan_capabilities.aspect_ratios),
          choices('Cocolonの表記', 'branding_mode', preview.plan_capabilities.branding_modes, branding),
        ) : null,
        preview?.content_status === 'adjusted' ? element(Text, { style: { color: '#202020', fontSize: 16, marginBottom: 16 } },
          '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
        preview ? element(PieceVisualCard, { display }) : null,
        preview ? element(Text, { testID: 'piece-canonical-text', selectable: true,
          style: { fontSize: 18, lineHeight: 29, color: '#202020' } }, preview.piece_text) : null,
        ['unavailable', 'cancelled'].includes(display.phase) ? element(Text, { accessibilityRole: 'alert',
          style: { fontSize: 16, color: '#202020' } }, display.message) : null,
        element(Text, { style: { fontSize: 14, lineHeight: 22, color: '#494949', marginTop: 20 } },
          'Pieceの保存・画像の書き出し・共有は、まだ利用できません。'),
      ),
      element(View, { style: { paddingTop: 12 } },
        display.canRetry === true ? element(Button, {
          title: retryLabel, onPress: onRetry, accessibilityLabel: retryLabel }) : null,
        preview && typeof onCancel === 'function' ? element(Button, {
          title: '候補を取り消す', accessibilityLabel: 'このPiece候補を取り消す',
          onPress: () => onCancel({ preview_id: preview.preview_id,
            preview_revision: preview.preview_revision, visual_recipe_hash: preview.visual_recipe_hash }, display.visualToken),
        }) : null,
        element(Button, { title: '閉じる', onPress: onClose, accessibilityLabel: 'Pieceの本文プレビューを閉じる' }),
      ),
    ),
  ));
}
