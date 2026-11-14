import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { analysisMapCorrectionApi } from '../../lib/api/analysisMapCorrectionApi';
import { mapCorrectionTargets, validMapCorrectionQuote } from './mapCorrectionContract';
import { makeUiTokens, MODAL_ORIENTATIONS } from '../../ui/uiTokens';
import CocolonButton from '../CocolonButton';

const operationKey = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
  const value = Math.floor(Math.random() * 16);
  return (character === 'x' ? value : (value & 3) | 8).toString(16);
});

export default function MapInterpretationCorrectionDialog({ visible, onClose, onSaved, ownerId,
  projection, kind, targetRef, colors = {}, themeName = 'light' }) {
  const targets = useMemo(() => mapCorrectionTargets(projection, kind, targetRef), [projection, kind, targetRef]);
  const preferred = targets.find(target => target.field === 'explanation') || targets.find(target => target.field === 'summary') || targets[0];
  const scope = `${ownerId}:${projection?.projection_of || ''}:${kind}:${targetRef}`;
  const current = useRef({ scope, visible: !!visible });
  current.current = { scope, visible: !!visible && !!ownerId };
  const sequence = useRef(0), controller = useRef(null), operation = useRef(null), mounted = useRef(true);
  const savedCallback = useRef(onSaved); savedCallback.current = onSaved;
  const [state, setState] = useState({ scope: null });
  const [field, setField] = useState(preferred?.field || ''), [targetText, setTargetText] = useState(preferred?.text || '');
  const [explanation, setExplanation] = useState('');
  const ui = useMemo(() => makeUiTokens(colors, themeName), [colors, themeName]);
  const styles = useMemo(() => makeStyles(colors, ui), [colors, ui]);
  const abort = () => { sequence.current += 1; controller.current?.abort(); controller.current = null; };
  useEffect(() => {
    abort(); operation.current = null;
    setField(preferred?.field || ''); setTargetText(preferred?.text || ''); setExplanation('');
    setState({ scope, phase: 'editing' });
    return abort;
  }, [scope]);
  useEffect(() => {
    if (!visible) {
      abort();
      setState(previous => previous.scope === scope && operation.current
        ? { ...previous, phase: 'unknown' } : previous);
    }
  }, [visible]);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; abort(); operation.current = null; };
  }, []);
  const active = token => mounted.current && current.current.visible && current.current.scope === scope && sequence.current === token;
  const update = change => setState(previous => previous.scope === scope ? { ...previous, ...change } : previous);
  const displayed = targets.find(target => target.field === field);
  const show = state.scope === scope ? state : { phase: 'editing' };
  const locked = show.phase !== 'editing';
  const validQuote = displayed && validMapCorrectionQuote(displayed.text, targetText);

  const submit = async (confirm = false) => {
    if (!current.current.visible || controller.current || show.phase === 'saved') return;
    let captured = operation.current;
    if (!captured) {
      if (!validQuote || !explanation.trim()) return;
      captured = { artifact_ref: projection.projection_of, kind, ref: targetRef, field,
        target_text: targetText, explanation: explanation.trim(), idempotency_key: operationKey() };
      operation.current = captured;
    }
    const token = ++sequence.current, pending = new AbortController(); controller.current = pending;
    update({ phase: 'submitting', error: null });
    try {
      const result = await analysisMapCorrectionApi[confirm ? 'confirm' : 'create'](captured,
        { expectedUserId: ownerId, signal: pending.signal });
      if (!active(token)) return;
      operation.current = null;
      update({ phase: 'saved', result });
      // Failure to refresh a view cannot undo the confirmed source save.
      try { Promise.resolve(savedCallback.current?.(result)).catch(() => {}); } catch {}
    } catch (error) {
      if (!active(token)) return;
      if (confirm && error?.status === 404) {
        update({ phase: 'unconfirmed', error: 'まだ保存を確認できませんでした。同じ訂正を、もう一度送信できます。' });
      } else if (!Number.isInteger(error?.status) || error.status >= 500) {
        update({ phase: 'unknown', error: '保存の結果を確認できませんでした。同じ訂正の保存状況を確認できます。' });
      } else {
        operation.current = null;
        update({ phase: 'editing', error: '訂正を保存できませんでした。表示されている内容と、現在の閲覧範囲を確認してください。' });
      }
    } finally { if (controller.current === pending) controller.current = null; }
  };

  if (!visible || !ownerId || !targets.length || state.scope !== scope) return null;
  return <Modal visible transparent animationType="fade" onRequestClose={onClose} supportedOrientations={MODAL_ORIENTATIONS}>
    <SafeAreaProvider><SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.overlay}>
      <View style={styles.dialog} accessibilityViewIsModal testID="analysis-map-correction-dialog">
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
          <Text style={styles.title} accessibilityRole="header">マップの読み取りを訂正する</Text>
          <Text style={styles.text}>訂正は本人の説明として保存し、これからの読み取りに使います。過去の月次マップは当時のまま残ります。</Text>
          {show.phase === 'saved' ? <Text style={styles.notice} accessibilityLiveRegion="polite">
            {show.result?.source_state === 'STALE' ? '訂正を保存しました。現在のマップとは版が異なるため、この保存だけで現在の読み取りが変わったことにはなりません。'
              : show.result?.refresh_status === 'failed'
                ? '訂正を保存しました。分析の更新を確認できませんでした。マップ画面から再取得してください。'
                : '訂正を保存しました。読み直した分析結果は、更新が完了してから確認できます。'}
          </Text> : <>
            <Text style={styles.label}>どの内容ですか？</Text>
            <Text style={styles.meta}>訂正したい文章を選び、その中から該当する部分を残してください。</Text>
            <View style={styles.options}>{targets.map(target => <CocolonButton key={target.field}
              testID={`map-correction-field-${target.field}`} title={target.label}
              variant={field === target.field ? 'primary' : 'secondary'} disabled={locked}
              accessibilityState={{ selected: field === target.field }} onPress={() => {
                setField(target.field); setTargetText(target.text); setExplanation('');
              }} />)}</View>
            <Text style={styles.original} selectable>{displayed?.text}</Text>
            <TextInput testID="map-correction-target" accessibilityLabel="訂正したい内容" multiline maxLength={2000}
              style={styles.input} value={targetText} onChangeText={setTargetText} editable={!locked} />
            {targetText && !validQuote ? <Text style={styles.error}>選んだ文章の中で、対象が一つに決まるように指定してください。</Text> : null}
            <Text style={styles.label}>どう違いましたか？</Text>
            <TextInput testID="map-correction-explanation" accessibilityLabel="どう違いましたか" multiline maxLength={2000}
              style={styles.input} value={explanation} onChangeText={setExplanation} editable={!locked} />
            {show.phase === 'editing' ? <CocolonButton testID="map-correction-submit" title="訂正を保存"
              disabled={!validQuote || !explanation.trim()} onPress={() => submit(false)} /> : null}
            {show.phase === 'unknown' || show.phase === 'unconfirmed' ? <CocolonButton testID="map-correction-confirm"
              title="同じ訂正の保存状況を確認" onPress={() => submit(true)} /> : null}
            {show.phase === 'unconfirmed' ? <CocolonButton testID="map-correction-resend" title="同じ訂正をもう一度送信"
              onPress={() => submit(false)} /> : null}
          </>}
          {show.phase === 'submitting' ? <ActivityIndicator color={colors.TITLE_GOLD} accessibilityLabel="訂正の保存を確認しています" /> : null}
          {show.error ? <Text style={styles.error} accessibilityRole="alert">{show.error}</Text> : null}
          <CocolonButton variant="secondary" title="閉じる" onPress={onClose} />
        </ScrollView>
      </View>
    </SafeAreaView></SafeAreaProvider>
  </Modal>;
}

function makeStyles(colors, ui) {
  const ink = colors.TEXT_ON_LIGHT || '#17212b';
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: '#0008', padding: 20, justifyContent: 'center', alignItems: 'center' },
    dialog: { width: '100%', maxWidth: 680, maxHeight: '100%', flexShrink: 1, borderRadius: 24,
      backgroundColor: colors.FIELD_BG || '#fff', borderWidth: 1, borderColor: colors.CARD_BORDER || '#ddd' },
    body: { gap: 16, padding: 20, paddingBottom: 28 }, title: { ...ui.typography.screenTitle, color: ink },
    text: { ...ui.typography.body, color: ink }, label: { ...ui.typography.body, fontWeight: '600', color: ink },
    meta: { ...ui.typography.meta, color: colors.TEXT_SUBTLE || '#756c66' }, options: { gap: 8 },
    input: { ...ui.typography.body, color: ink, borderWidth: 1, borderColor: colors.CARD_BORDER || '#ddd',
      borderRadius: 16, minHeight: 100, padding: 14, textAlignVertical: 'top' },
    original: { ...ui.typography.body, color: ink, padding: 16, borderRadius: 16, backgroundColor: colors.SURFACE_TONAL || '#efe1dd' },
    notice: { ...ui.typography.body, color: ink }, error: { ...ui.typography.body, color: colors.ERROR || '#a00' },
  });
}
