/** PCE-8 B10 review surface with a bounded RN image-layout prototype.
 * The host provides a freshly checked display view from readPiecePreviewDisplay.
 * Forwards an explicit initial save only when the host supplies canSave=true
 * and onSave. This surface never grants renderer admission, performs HTTP,
 * or creates a save key. The current host/admission supplier remains separate.
 */
import React from 'react';
import { Alert, Modal, View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PieceVisualCard from './PieceVisualCard';
import Button from '../CocolonButton';
import { useTheme } from '../../theme/ThemeContext';
import { makeUiTokens, MODAL_ORIENTATIONS } from '../../ui/uiTokens';
import { PIECE_THEME_COLORS, PIECE_THEME_LABELS, PIECE_THEME_IDS } from '../../features/piece/piecePalette';

const element = React.createElement;
const formats = { short_essay: 'エッセイ', quote: '引用', declaration: '宣言' };
const plans = { free: 'Free', plus: 'Plus', premium: 'Premium' };
const branding = { required_small: 'あり', required_subtle: 'あり', off: 'なし' };
const themes = PIECE_THEME_LABELS;

export default function PiecePreviewModal({ visible = false, retainDismiss = false, onDismiss, display, onClose, onRetry, onRefreshSource, onRestartExpired, onVisualChange, onFormatChange, onReturnToFormat, onCancel, onOpenSaved, onSave, onSaveFitChange }) {
  const { colors, themeName } = useTheme();
  const ui = makeUiTokens(colors, themeName);
  if (visible !== true || !display || display.phase === 'hidden') {
    // Keep the same native iOS Modal until its dismissal ACK, with no private
    // body or child tree after close. The host owns any body-free handoff.
    return retainDismiss === true ? element(Modal, { supportedOrientations: MODAL_ORIENTATIONS,
      visible: false, animationType: 'slide', presentationStyle: 'fullScreen',
      onRequestClose: onClose, onDismiss }) : null;
  }
  const received = display.phase === 'received' && display.hashVerified === true && display.preview;
  const preview = received ? display.preview : null;
  const selection = preview ? { theme_id: preview.visual_recipe.theme.theme_id,
    aspect_ratio: preview.visual_recipe.aspect_ratio, branding_mode: preview.visual_recipe.branding.branding_mode } : null;
  const candidateIdentity = preview ? {
    preview_id: preview.preview_id, preview_revision: preview.preview_revision,
    visual_recipe_hash: preview.visual_recipe_hash,
  } : null;
  const freePlan = preview?.quota.subscription_tier === 'free';
  const showLockedSetting = () => Alert.alert(freePlan ? 'サブスク加入者限定です' : '画像設定を選択できません',
    freePlan ? 'サブスクに加入すると、すべてのカラー・画像の比率・Emlisロゴの有無を選べます。'
      : '現在、この画像設定は利用できません。時間をおいて、もう一度お試しください。');
  const changeVisual = (field, value) => {
    if (typeof onVisualChange === 'function') {
      onVisualChange({ ...selection, [field]: value }, candidateIdentity, display.visualToken);
    }
  };
  const optionStyle = selected => ({ minHeight: 44, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 18, borderWidth: 1, borderColor: selected ? colors.ON_SURFACE_TONAL : colors.CARD_BORDER,
    backgroundColor: selected ? colors.SURFACE_TONAL : colors.FIELD_BG, maxWidth: '100%',
    justifyContent: 'center' });
  const formatPicker = preview?.plan_capabilities.format_selection === 'eligible_choice' &&
    preview.eligible_formats.length > 1 && typeof onFormatChange === 'function'
    ? element(View, { testID: 'piece-format-options', style: { marginTop: 12 } },
      element(Text, { style: { ...ui.typography.description, color: colors.TEXT_ON_LIGHT, marginBottom: 8 } }, '文章の形式'),
      element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } }, ...preview.eligible_formats.map(format => {
        const selected = preview.format_type === format;
        return element(Pressable, { style: optionStyle(selected), key: format, accessibilityRole: 'button',
          accessibilityLabel: `形式：${formats[format]}`, accessibilityState: { selected, disabled: selected },
          disabled: selected, onPress: () => onFormatChange(format, candidateIdentity, display.visualToken) },
          element(Text, { style: { ...ui.typography.button, color: selected ? colors.ON_SURFACE_TONAL : colors.TEXT_ON_LIGHT } },
            `${selected ? '✓ ' : ''}${formats[format]}`));
      }))) : null;
  const choices = (label, field, values, allowed, labels) =>
    element(View, { key: field, testID: `piece-visual-${field}`, style: { marginTop: 12,
      paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.CARD_BORDER } },
      element(Text, { style: { ...ui.typography.description, color: colors.TEXT_ON_LIGHT, marginBottom: 8 } }, label),
      element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } }, ...values.map(value => {
        const selected = selection[field] === value;
        const locked = freePlan || !allowed.includes(value);
        const disabled = !locked && (selected || typeof onVisualChange !== 'function');
        return element(Pressable, { style: { ...optionStyle(selected && !locked),
          ...(locked ? { backgroundColor: colors.CARD_BORDER, opacity: 0.65 } : {}) }, key: value,
          testID: `piece-option-${field}-${value}`, accessibilityRole: 'button',
          accessibilityLabel: `${label}：${labels?.[value] || value}${locked ? '、変更できません' : ''}`,
          accessibilityHint: locked ? 'タップすると利用条件の案内を表示します。' : undefined,
          accessibilityState: { selected, disabled }, disabled,
          onPress: () => locked ? showLockedSetting() : changeVisual(field, value),
        }, element(Text, { style: { ...ui.typography.button,
          color: locked ? colors.TEXT_SUBTLE : selected ? colors.ON_SURFACE_TONAL : colors.TEXT_ON_LIGHT } },
          `${selected ? '✓ ' : ''}${labels?.[value] || value}`));
      })));
  const paletteOptions = preview?.plan_capabilities.theme_ids;
  const palettePicker = preview
    ? element(View, { testID: 'piece-visual-theme_id', style: { marginTop: 12 } },
      element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 10 } },
        element(Text, { style: { ...ui.typography.description, color: colors.TEXT_ON_LIGHT } }, '背景と文字色'),
        element(Text, { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE } }, `${paletteOptions.length}色を選択できます`)),
      element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } },
        ...PIECE_THEME_IDS.map(value => {
          const { canvas, surface, text, border } = PIECE_THEME_COLORS[value];
          const selected = selection.theme_id === value;
          const locked = !paletteOptions.includes(value);
          const disabled = !locked && (selected || typeof onVisualChange !== 'function');
          return element(Pressable, { key: value, accessibilityRole: 'button',
            testID: `piece-theme-option-${value}`,
            accessibilityLabel: `テーマ：${themes[value]}${locked ? '、サブスク加入者限定' : ''}`,
            accessibilityHint: locked ? 'タップすると利用条件の案内を表示します。' : undefined,
            accessibilityState: { selected, disabled }, disabled,
            onPress: () => locked ? showLockedSetting() : changeVisual('theme_id', value),
            style: { flexBasis: '22%', flexGrow: 1, minWidth: 64, maxWidth: '100%', minHeight: 44,
              padding: 4, borderRadius: 18, borderWidth: 2, opacity: locked ? 0.65 : 1,
              borderColor: selected ? colors.TITLE_GOLD : colors.FIELD_BG, backgroundColor: colors.FIELD_BG } },
            element(View, { testID: `piece-theme-swatch-${value}`, accessible: false,
              accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants',
              style: { padding: 4, backgroundColor: canvas, borderColor: border, borderWidth: 1,
                borderRadius: 17 } },
              element(Text, { style: { padding: 4, fontSize: 18, lineHeight: 24,
                textAlign: 'center', backgroundColor: surface, color: text } }, 'Aa')),
            element(Text, { style: { ...ui.typography.meta, marginTop: 6, textAlign: 'center',
              color: selected ? colors.ON_SURFACE_TONAL : colors.TEXT_SUBTLE } }, `${selected ? '✓ ' : ''}${themes[value]}`),
            locked ? element(Text, { testID: `piece-theme-lock-${value}`, accessible: false,
              style: { position: 'absolute', top: 2, right: 2, fontSize: 12, lineHeight: 20,
                paddingHorizontal: 3, borderRadius: 10, backgroundColor: colors.FIELD_BG } }, '🔒') : null);
        }))) : null;
  const aspectPicker = preview ? choices('画像の比率', 'aspect_ratio', ['4:5', '9:16'],
    preview.plan_capabilities.aspect_ratios) : null;
  const brandingPicker = preview ? choices('Emlisロゴ', 'branding_mode',
    [selection.branding_mode === 'required_small' ? 'required_small' : 'required_subtle', 'off'],
    preview.plan_capabilities.branding_modes, branding) : null;
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
  const recoveryActions = [
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
    preview && typeof onCancel === 'function' ? element(Button, { variant: 'secondary', style: { marginTop: 8,
      minHeight: 44, paddingVertical: 10, borderWidth: 0, backgroundColor: colors.FIELD_BG, shadowOpacity: 0, elevation: 0 },
      title: '候補を取り消す', accessibilityLabel: 'このPiece候補を取り消す',
      onPress: () => onCancel({ preview_id: preview.preview_id,
        preview_revision: preview.preview_revision, visual_recipe_hash: preview.visual_recipe_hash }, display.visualToken),
    }) : null,
  ].filter(Boolean);
  return element(Modal, {
    supportedOrientations: MODAL_ORIENTATIONS,
    visible: true, animationType: 'slide', presentationStyle: 'fullScreen', onRequestClose: onClose, onDismiss,
  }, element(SafeAreaProvider, { style: { flex: 1, backgroundColor: colors.BG_SILVER } },
    element(SafeAreaView, { edges: ['top', 'right', 'bottom', 'left'], mode: 'padding',
      style: { flex: 1, backgroundColor: colors.BG_SILVER } },
    element(View, { style: { flex: 1, padding: 20, width: '100%', maxWidth: 680, alignSelf: 'center' }, accessibilityViewIsModal: true },
      element(Text, { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE,
        textAlign: 'center', letterSpacing: 1.8, marginBottom: 2 } }, 'PIECE'),
      element(Text, { accessibilityRole: 'header', accessibilityLabel: saving ? 'Pieceの保存' : 'Pieceのプレビュー',
        style: { ...ui.typography.sectionTitle, color: colors.TEXT_ON_LIGHT, textAlign: 'center', marginBottom: 14 } },
        saving ? 'Pieceの保存' : 'ことばを、一枚に。'),
      element(ScrollView, { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 24 } },
        display.phase === 'loading' || display.visualUpdated === true || display.formatNotice ||
          display.phase === 'saved' || ['unavailable', 'cancelled'].includes(display.phase)
          ? element(View, { style: { padding: 16, borderRadius: 24, backgroundColor: colors.SURFACE_TONAL,
            gap: 8, marginBottom: 16 } },
            display.phase === 'loading' ? element(ActivityIndicator, { accessibilityLabel: loading, color: colors.TITLE_GOLD }) : null,
            display.phase === 'loading' ? element(Text, { style: { ...ui.typography.body, color: colors.ON_SURFACE_TONAL }, accessibilityLiveRegion: 'polite' }, loading) : null,
            display.visualUpdated === true ? element(Text, { accessibilityRole: 'alert', accessibilityLiveRegion: 'polite',
              style: { ...ui.typography.description, color: colors.ON_SURFACE_TONAL } }, '画像設定を更新しました。') : null,
            display.formatNotice ? element(Text, { accessibilityLiveRegion: 'polite',
              style: { ...ui.typography.description, color: colors.ON_SURFACE_TONAL } }, display.formatNotice) : null,
            display.phase === 'saved' ? element(Text, { accessibilityLiveRegion: 'polite',
              style: { ...ui.typography.sectionTitle, color: colors.ON_SURFACE_TONAL } }, 'Pieceを保存しました。') : null,
            ['unavailable', 'cancelled'].includes(display.phase) ? element(Text, { accessibilityRole: 'alert',
              style: { ...ui.typography.body, color: colors.ON_SURFACE_TONAL } }, display.message) : null,
          ) : null,
        // The fixed pedestal affects preview scale; the logical canvas stays 1080 wide.
        preview ? element(View, { testID: 'piece-artwork-stage', style: { width: '100%', maxWidth: 350,
          alignSelf: 'center', paddingHorizontal: 39, paddingTop: 17,
          borderRadius: 28, backgroundColor: colors.SURFACE_TONAL } },
          element(PieceVisualCard, { display, onSaveFitChange, colors, ui, showInspectionLabels: false })) : null,
        preview ? element(Text, { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE,
          textAlign: 'center', marginTop: 11, marginBottom: 15 } },
          `${formats[preview.format_type]} · ${preview.visual_recipe.aspect_ratio}`) : null,
        preview ? element(View, { testID: 'piece-plan-details', style: { padding: 16, borderRadius: 24,
          backgroundColor: colors.FIELD_BG, marginBottom: 16 } },
          element(View, { style: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 8, marginBottom: 8 } },
            element(Text, { style: { ...ui.typography.sectionTitle, color: colors.TEXT_ON_LIGHT } }, '画像の設定'),
            element(Text, { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE } }, `${plans[preview.quota.subscription_tier]}プラン`)),
          element(Text, { style: { ...ui.typography.description, color: colors.TEXT_SUBTLE } },
            preview.plan_capabilities.format_selection === 'fixed' ? '形式：エッセイ（固定）' :
              preview.plan_capabilities.format_selection === 'automatic' ? '形式：入力に合う形式を自動選択' :
                `選択できる形式：${preview.eligible_formats.map(format => formats[format]).join(' / ')}`),
          formatPicker,
          palettePicker,
          aspectPicker,
          brandingPicker,
        ) : null,
        preview ? element(View, { style: { paddingHorizontal: 4, paddingBottom: 16, gap: 6 } },
          element(Text, { testID: 'piece-save-quota', style: { ...ui.typography.description, color: colors.TEXT_ON_LIGHT } },
            `${preview.quota.month_key}（日本時間）の保存枠：${preview.quota.remaining_count === null
              ? '回数制限なし' : `残り${preview.quota.remaining_count}回 / ${preview.quota.save_limit}回`}`),
          element(Text, { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE } },
            '取得時点の情報です。保存時に残り回数を確認します。'),
        ) : null,
        (canSave || saving || display.phase === 'saved') ? element(Text,
          { style: { ...ui.typography.meta, color: colors.TEXT_SUBTLE, marginBottom: 16 } },
          '画像の書き出し・共有は、保存したPieceの詳細画面から行えます。') : null,
        recoveryActions.length ? element(View, { testID: 'piece-recovery-actions', style: recoveryActions.length > 1
          ? { padding: 16, borderRadius: 24, backgroundColor: colors.FIELD_BG, marginBottom: 16 }
          : { marginBottom: 16 } },
          recoveryActions.length > 1 ? element(Text, { style: { ...ui.typography.description, color: colors.TEXT_SUBTLE } }, '候補と保存の操作') : null,
          ...recoveryActions) : null,
        preview ? element(View, { style: { padding: 16, borderRadius: 24, backgroundColor: colors.FIELD_BG } },
          element(Text, { style: { ...ui.typography.description, color: colors.TEXT_SUBTLE, marginBottom: 8 } }, '本文（全文）'),
          element(Text, { testID: 'piece-canonical-text', selectable: true,
            style: { ...ui.typography.body, color: colors.TEXT_ON_LIGHT } }, preview.piece_text),
          preview?.content_status === 'adjusted' ? element(Text, { style: { ...ui.typography.description,
            color: colors.TEXT_SUBTLE, marginTop: 12 } }, '伝えたい内容を保ちながら、共有に向けた調整がされています。') : null,
        ) : null,
      ),
      element(View, { style: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.CARD_BORDER } },
        canSave ? element(Button, { variant: 'primary', style: { minHeight: 54,
          shadowOpacity: 0, elevation: 0 },
          testID: 'piece-initial-save', title: 'Pieceを保存',
          accessibilityLabel: 'このPieceを自分用に保存',
          onPress: () => onSave(saveIdentity, saveToken),
        }) : null,
        element(Button, { variant: 'secondary', style: { marginTop: 4, minHeight: 44, paddingVertical: 10,
          borderWidth: 0, backgroundColor: colors.BG_SILVER, shadowOpacity: 0, elevation: 0 },
          title: '閉じる', onPress: onClose, accessibilityLabel: 'Pieceの画面を閉じる' }),
      ),
    ),
  )));
}


