/** PCE-8 B10 review surface with a bounded RN image-layout prototype.
 * The host provides a freshly checked display view from readPiecePreviewDisplay.
 * Forwards an explicit initial save only when the host supplies canSave=true
 * and onSave. This surface never grants renderer admission, performs HTTP,
 * or creates a save key. The current host/admission supplier remains separate.
 */
import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PieceVisualCard from './PieceVisualCard';
import Button from '../CocolonButton';
import { useTheme } from '../../theme/ThemeContext';
import { PIECE_THEME_COLORS, PIECE_THEME_LABELS } from '../../features/piece/piecePalette';

const element = React.createElement;
const formats = { short_essay: 'エッセイ', quote: '引用', declaration: '宣言' };
const plans = { free: 'Free', plus: 'Plus', premium: 'Premium' };
const branding = { required_small: '小さく表示', required_subtle: '控えめに表示', off: '表示なし' };
const themes = PIECE_THEME_LABELS;

export default function PiecePreviewModal({ visible = false, display, onClose, onRetry, onRefreshSource, onRestartExpired, onVisualChange, onFormatChange, onReturnToFormat, onCancel, onOpenSaved, onSave, onSaveFitChange }) {
  const { colors } = useTheme();
  if (visible !== true || !display || display.phase === 'hidden') return null;
  const received = display.phase === 'received' && display.hashVerified === true && display.preview;
  const preview = received ? display.preview : null;
  const selection = preview ? { theme_id: preview.visual_recipe.theme.theme_id,
    aspect_ratio: preview.visual_recipe.aspect_ratio, branding_mode: preview.visual_recipe.branding.branding_mode } : null;
  const candidateIdentity = preview ? {
    preview_id: preview.preview_id, preview_revision: preview.preview_revision,
    visual_recipe_hash: preview.visual_recipe_hash,
  } : null;
  const changeVisual = (field, value) => onVisualChange({ ...selection, [field]: value }, candidateIdentity, display.visualToken);
  const formatPicker = preview?.plan_capabilities.format_selection === 'eligible_choice' &&
    preview.eligible_formats.length > 1 && typeof onFormatChange === 'function'
    ? element(View, { testID: 'piece-format-options', style: { marginTop: 12 } },
      element(Text, { style: { fontSize: 16, color: colors.TEXT_ON_LIGHT } }, '文章の形式'),
      ...preview.eligible_formats.map(format => {
        const selected = preview.format_type === format;
        return element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 }, key: format, title: `${formats[format]}${selected ? '（選択中）' : ''}`,
          accessibilityLabel: `形式：${formats[format]}`, accessibilityState: { selected, disabled: selected },
          disabled: selected, onPress: () => onFormatChange(format, candidateIdentity, display.visualToken) });
      })) : null;
  const choices = (label, field, values, labels) => values.length > 1 && typeof onVisualChange === 'function'
    ? element(View, { key: field, testID: `piece-visual-${field}`, style: { marginTop: 12 } },
      element(Text, { style: { fontSize: 16, color: colors.TEXT_ON_LIGHT } }, label),
      ...values.map(value => {
        const selected = selection[field] === value;
        return element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 }, key: value,
          title: `${labels?.[value] || value}${selected ? '（選択中）' : ''}`,
          accessibilityLabel: `${label}：${labels?.[value] || value}`,
          accessibilityState: { selected, disabled: selected },
          disabled: selected,
          onPress: () => changeVisual(field, value),
        });
      })) : null;
  const paletteOptions = preview?.plan_capabilities.theme_ids;
  const palettePicker = paletteOptions?.length > 1 && typeof onVisualChange === 'function'
    ? element(View, { testID: 'piece-visual-theme_id', style: { marginTop: 12 } },
      element(Text, { style: { fontSize: 16, color: colors.TEXT_ON_LIGHT, marginBottom: 8 } }, '背景と文字色'),
      element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } },
        ...paletteOptions.map(value => {
          const { canvas, surface, text, border } = PIECE_THEME_COLORS[value];
          const selected = selection.theme_id === value;
          return element(Pressable, { key: value, accessibilityRole: 'button',
            accessibilityLabel: `テーマ：${themes[value]}`, accessibilityState: { selected, disabled: selected },
            disabled: selected, onPress: () => changeVisual('theme_id', value),
            style: { flexBasis: '46%', flexGrow: 1, minHeight: 44, padding: 5, borderRadius: 8,
              borderWidth: 2, borderColor: selected ? '#202020' : '#D1D5DB', backgroundColor: canvas } },
            element(View, { testID: `piece-theme-swatch-${value}`, accessible: false,
              accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants',
              style: { padding: 4, backgroundColor: canvas, borderColor: border, borderWidth: 1, borderRadius: 5 } },
              element(Text, { style: { padding: 4, textAlign: 'center', backgroundColor: surface, color: text } }, themes[value])),
            selected ? element(Text, { style: { marginTop: 2, textAlign: 'center', color: text, backgroundColor: surface } }, '選択中') : null);
        }))) : null;
  const saving = display.loadingKind === 'save' || display.retryKind === 'save';
  // canSave is a host projection, not a conclusion from quota/hash/native
  // inspection. The controller must recheck current admission at the click.
  const canSave = !!preview && !saving && display.canSave === true &&
    !!display.visualToken && typeof onSave === 'function';
  const saveIdentity = canSave ? Object.freeze({ preview_id: preview.preview_id,
    preview_revision: preview.preview_revision, visual_recipe_hash: preview.visual_recipe_hash }) : null;
  const saveToken = display.visualToken;
  const loading = display.loadingKind === 'save' ? 'Pieceを保存しています。' : display.loadingKind === 'cancel' ? '候補を取り消しています。' :
    display.loadingKind === 'visual' ? '画像設定を更新しています。' :
    display.loadingKind === 'format' ? '選んだ形式でPieceを作成しています。' :
    display.loadingKind === 'recover' ? '最新のプレビューを取得しています。' : 'Pieceを取得しています。';
  const retryLabel = display.retryKind === 'save'
    ? display.saveQuotaRejected === true ? '保存枠を確認して再試行' : '同じ保存要求で結果を確認'
    : display.retryKind === 'cancel' ? '同じ候補の取消を再試行' :
    display.retryKind === 'recover' ? '最新のプレビューを取得' : '同じ要求で再試行';
  return element(Modal, {
    visible: true, animationType: 'slide', presentationStyle: 'fullScreen', onRequestClose: onClose,
  }, element(SafeAreaProvider, { style: { flex: 1, backgroundColor: colors.BG_SILVER } },
    element(SafeAreaView, { edges: ['top', 'right', 'bottom', 'left'], mode: 'padding',
      style: { flex: 1, backgroundColor: colors.BG_SILVER } },
    element(View, { style: { flex: 1, padding: 20 }, accessibilityViewIsModal: true },
      element(Text, { accessibilityRole: 'header', style: { fontSize: 24, lineHeight: 32, fontWeight: '600', color: colors.TEXT_ON_LIGHT, marginBottom: 20 } }, saving ? 'Pieceの保存' : 'Pieceのプレビュー'),
      element(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 24 } },
        display.phase === 'loading' ? element(ActivityIndicator, { accessibilityLabel: loading }) : null,
        display.phase === 'loading' ? element(Text, { style: { color: colors.TEXT_ON_LIGHT, fontSize: 16 }, accessibilityLiveRegion: 'polite' }, loading) : null,
        display.visualUpdated === true ? element(Text, { accessibilityRole: 'alert', accessibilityLiveRegion: 'polite',
          style: { color: colors.TEXT_ON_LIGHT, fontSize: 16, marginBottom: 12 } }, '画像設定を更新しました。') : null,
        display.formatNotice ? element(Text, { accessibilityLiveRegion: 'polite',
          style: { color: colors.TEXT_ON_LIGHT, fontSize: 16, marginBottom: 12 } }, display.formatNotice) : null,
        preview ? element(PieceVisualCard, { display, onSaveFitChange }) : null,
        preview ? element(Text, { testID: 'piece-canonical-text', selectable: true,
          style: { fontSize: 16, lineHeight: 27, fontWeight: '400', color: colors.TEXT_ON_LIGHT, marginTop: 16, marginBottom: 24 } }, preview.piece_text) : null,
        preview ? element(Text, { style: { color: colors.TEXT_ON_LIGHT, fontSize: 16, marginBottom: 16 } },
          `${formats[preview.format_type]} / ${themes[preview.visual_recipe.theme.theme_id]} / ${preview.visual_recipe.aspect_ratio}`) : null,
        preview ? element(View, { testID: 'piece-plan-details', style: { marginBottom: 16 } },
          element(Text, { style: { color: colors.TEXT_ON_LIGHT, fontSize: 16 } },
            `${plans[preview.quota.subscription_tier]}プランで利用できる設定`),
          element(Text, { style: { color: colors.TEXT_SUBTLE, fontSize: 14, lineHeight: 22 } },
            preview.plan_capabilities.format_selection === 'fixed' ? '形式：エッセイ（固定）' :
              preview.plan_capabilities.format_selection === 'automatic' ? '形式：入力に合う形式を自動選択' :
                `選択できる形式：${preview.eligible_formats.map(format => formats[format]).join(' / ')}`),
          element(Text, { style: { color: colors.TEXT_SUBTLE, fontSize: 14, lineHeight: 22 } },
            paletteOptions.length > 1 ? `背景と文字色：${paletteOptions.length}種類` : `テーマ：${themes[paletteOptions[0]]}`),
          element(Text, { style: { color: colors.TEXT_SUBTLE, fontSize: 14, lineHeight: 22 } },
            `画像比率：${preview.plan_capabilities.aspect_ratios.join(' / ')}`),
          element(Text, { style: { color: colors.TEXT_SUBTLE, fontSize: 14, lineHeight: 22 } },
            `ブランド表記：${preview.plan_capabilities.branding_modes.map(mode => branding[mode]).join(' / ')}`),
          element(Text, { testID: 'piece-save-quota', style: { color: colors.TEXT_ON_LIGHT, fontSize: 16, marginTop: 8 } },
            `${preview.quota.month_key}（日本時間）の保存枠：${preview.quota.remaining_count === null
              ? '回数制限なし' : `残り${preview.quota.remaining_count}回 / ${preview.quota.save_limit}回`}`),
          element(Text, { style: { color: colors.TEXT_SUBTLE, fontSize: 14, lineHeight: 22 } },
            '取得時点の情報です。保存時に残り回数を確認します。'),
          formatPicker,
          palettePicker,
          choices('画像比率', 'aspect_ratio', preview.plan_capabilities.aspect_ratios),
          choices('ブランド表記', 'branding_mode', preview.plan_capabilities.branding_modes, branding),
        ) : null,
        preview?.content_status === 'adjusted' ? element(Text, { style: { color: colors.TEXT_ON_LIGHT, fontSize: 16, marginBottom: 16 } },
          '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
        display.phase === 'saved' ? element(Text, { accessibilityLiveRegion: 'polite',
          style: { fontSize: 18, color: colors.TEXT_ON_LIGHT } }, 'Pieceを保存しました。') : null,
        ['unavailable', 'cancelled'].includes(display.phase) ? element(Text, { accessibilityRole: 'alert',
          style: { fontSize: 16, color: colors.TEXT_ON_LIGHT } }, display.message) : null,
        (canSave || saving || display.phase === 'saved') ? element(Text,
          { style: { fontSize: 14, lineHeight: 22, color: colors.TEXT_SUBTLE, marginTop: 20 } },
          '画像の書き出し・共有は、保存したPieceの詳細画面から行えます。') : null,
      ),
      element(View, { style: { paddingTop: 12 } },
        canSave ? element(Button, { variant: 'primary', style: { marginTop: 8 },
          testID: 'piece-initial-save', title: 'Pieceを保存',
          accessibilityLabel: 'このPieceを自分用に保存',
          onPress: () => onSave(saveIdentity, saveToken),
        }) : null,
        display.phase === 'saved' && typeof onOpenSaved === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: '保存したPieceを確認', accessibilityLabel: '保存したPieceを確認', onPress: onOpenSaved }) : null,
        display.canRetry === true ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: retryLabel, onPress: onRetry, accessibilityLabel: retryLabel }) : null,
        display.sourceRefreshToken && typeof onRefreshSource === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: '保存入力を確認し直す', accessibilityLabel: '保存入力を確認し直す',
          onPress: () => onRefreshSource(display.sourceRefreshToken),
        }) : null,
        display.previewRestartToken && typeof onRestartExpired === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: '同じ記録から作り直す', accessibilityLabel: '同じ記録から作り直す',
          onPress: () => onRestartExpired(display.previewRestartToken),
        }) : null,
        display.formatRecoveryToken && typeof onReturnToFormat === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: '前のプレビューに戻る', onPress: () => onReturnToFormat(display.formatRecoveryToken),
          accessibilityLabel: '前のプレビューに戻る',
        }) : null,
        preview && typeof onCancel === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 },
          title: '候補を取り消す', accessibilityLabel: 'このPiece候補を取り消す',
          onPress: () => onCancel({ preview_id: preview.preview_id,
            preview_revision: preview.preview_revision, visual_recipe_hash: preview.visual_recipe_hash }, display.visualToken),
        }) : null,
        element(Button, { variant: 'secondary', style: { marginTop: 8, minHeight: 44, paddingVertical: 10 }, title: '閉じる', onPress: onClose, accessibilityLabel: 'Pieceの画面を閉じる' }),
      ),
    ),
  )));
}


