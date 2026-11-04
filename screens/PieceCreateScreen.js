import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { useAppRuntime } from '../AppRuntimeContext';
import { useTutorial } from '../TutorialContext';
import { useTheme } from '../theme/ThemeContext';
import CocolonBackButton from '../components/CocolonBackButton';
import InputPieceActionArea from './input/InputPieceActionArea';
import { isPieceBitmapSaveAdmitted, supportsPieceBitmapCreation } from '../features/piece/pieceRenderer';

// Navigation contains only the saved ID, expected owner and opaque request key.
// The saved-source API remains authoritative; no response text is Piece input.
export default function PieceCreateScreen({ route, navigation }) {
  const { session } = useAuth();
  const { colors } = useTheme();
  const { isTutorialMode } = useTutorial();
  const { isFeatureEnabled } = useAppRuntime();
  const focused = useIsFocused();
  const host = useRef(null);
  const consumed = useRef(new Set());
  const savedInput = route?.params?.savedInput;
  const owner = session?.user?.id || '';
  const bound = !isTutorialMode && !!owner && savedInput?.expectedUserId === owner;
  const creationSupported = supportsPieceBitmapCreation();
  const active = bound && creationSupported && focused && isFeatureEnabled('piece_v2_preview_enabled', false) === true;

  useEffect(() => {
    if (!savedInput || !active || !host.current || consumed.current.has(savedInput.idempotencyKey)) return;
    // Consume the explicit navigation request before starting any IO. A return
    // to the tab, runtime refresh or account change never repeats creation.
    consumed.current.add(savedInput.idempotencyKey);
    void host.current.createFromSavedInput();
  }, [savedInput, active]);

  return <SafeAreaView style={[styles.page, { backgroundColor: colors.FIELD_BG }]}>
    <View style={styles.header}>
      <CocolonBackButton onPress={() => navigation.goBack()} />
      <Text style={[styles.title, { color: colors.TITLE_GOLD }]}>ピースの作成</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content}>
      {/* Keep same-request save/cancel recovery through runtime/focus changes. */}
      {bound && creationSupported ? <InputPieceActionArea ref={host} savedInput={savedInput}
        navigation={navigation} active={active} creationMode
        isSaveAdmitted={isPieceBitmapSaveAdmitted} />
        : <Text accessibilityRole="alert" style={{ color: colors.TEXT_ON_LIGHT }}>
          {bound ? 'この端末ではピースの画像を作成できません。' : '現在、この記録からピースを作成できません。'}
        </Text>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  page: { flex: 1 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  title: { fontSize: 22, fontWeight: '700' }, content: { padding: 20, gap: 16 },
});
