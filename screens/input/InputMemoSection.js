import React, { useCallback } from "react";
import { Text, TextInput, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import CocolonPressable from "../../components/CocolonPressable";
import { MEMO_INPUT_INITIAL_HEIGHT } from "./inputLayoutModel";

function compactOneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function InputMemoField({
  field,
  iconName,
  label,
  hint,
  value,
  setValue,
  inputRef,
  contentHeight,
  inputMaxHeight,
  activeField,
  setActiveField,
  isTutorialMode,
  registerInputInteraction,
  lastFocusTargetRef,
  memoFocusedRef,
  focusedFieldRef,
  scheduleScrollToFocusedInput,
  updateMemoInputVisibleHeight,
  styles,
  colors,
}) {
  const isExpanded = isTutorialMode || activeField === field;

  const openField = useCallback(() => {
    if (isTutorialMode) return;
    registerInputInteraction?.();
    setActiveField(field);
    requestAnimationFrame(() => {
      try {
        inputRef?.current?.focus?.();
      } catch {
        // noop
      }
    });
  }, [field, inputRef, isTutorialMode, registerInputInteraction, setActiveField]);

  return (
    <View style={styles.heroFieldBlock}>
      <Text style={styles.heroFieldLabel}>{label}</Text>
      <Text style={styles.heroFieldHint}>{hint}</Text>
      {isExpanded ? (
        <View style={[styles.memoCard, styles.memoCardExpanded]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.memoInput,
              {
                flex: 0,
                width: "100%",
                height: Math.min(
                  Math.max(contentHeight || MEMO_INPUT_INITIAL_HEIGHT, MEMO_INPUT_INITIAL_HEIGHT),
                  inputMaxHeight
                ),
              },
            ]}
            placeholder="ここに書いてください。"
            {...(isTutorialMode ? { value } : { defaultValue: value })}
            onChangeText={isTutorialMode ? undefined : setValue}
            editable={!isTutorialMode}
            multiline
            scrollEnabled={contentHeight >= inputMaxHeight}
            disableFullscreenUI
            textAlignVertical="top"
            placeholderTextColor={colors.TEXT_ON_LIGHT}
            onFocus={(e) => {
              if (isTutorialMode) return;
              registerInputInteraction?.();
              lastFocusTargetRef.current = e?.target ?? e?.nativeEvent?.target ?? null;
              memoFocusedRef.current = true;
              focusedFieldRef.current = field;
              scheduleScrollToFocusedInput();
            }}
            onBlur={() => {
              memoFocusedRef.current = false;
              focusedFieldRef.current = null;
              lastFocusTargetRef.current = null;
              if (!isTutorialMode) setActiveField(null);
            }}
            onContentSizeChange={(e) => {
              const h = e?.nativeEvent?.contentSize?.height ?? 0;
              const didHeightChange = updateMemoInputVisibleHeight(field, h);
              if (!didHeightChange || focusedFieldRef.current !== field) return;
              scheduleScrollToFocusedInput();
            }}
          />
        </View>
      ) : (
        <CocolonPressable
          style={[styles.memoCard, styles.memoCardCollapsed]}
          onPress={openField}
          accessibilityLabel={`${label}を入力する`}
        >
          <View style={styles.collapsedRow}>
            <View style={styles.collapsedLeft}>
              <Ionicons
                name={iconName}
                size={18}
                color={colors.TEXT_SUBTLE}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.collapsedText,
                  !compactOneLine(value) && styles.collapsedTextPlaceholder,
                ]}
                numberOfLines={1}
              >
                {compactOneLine(value) || "ここに書いてください。"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.TEXT_SUBTLE} />
          </View>
        </CocolonPressable>
      )}
    </View>
  );
}

export default function InputMemoSection({
  sectionRef,
  activeField,
  setActiveField,
  memo,
  setMemo,
  memoAction,
  setMemoAction,
  memoInputRef,
  memoActionInputRef,
  memoContentHeight,
  memoActionContentHeight,
  inputMaxHeight,
  isTutorialMode,
  registerInputInteraction,
  lastFocusTargetRef,
  memoFocusedRef,
  focusedFieldRef,
  scheduleScrollToFocusedInput,
  updateMemoInputVisibleHeight,
  styles,
  colors,
}) {
  return (
    <View ref={sectionRef} collapsable={false} style={styles.heroMemoInputGroup}>
      <InputMemoField
        field="memo"
        iconName="create-outline"
        label="思考内容（考えていること）"
        hint="何を思った／どう感じた／どう解釈した？"
        value={memo}
        setValue={setMemo}
        inputRef={memoInputRef}
        contentHeight={memoContentHeight}
        inputMaxHeight={inputMaxHeight}
        activeField={activeField}
        setActiveField={setActiveField}
        isTutorialMode={isTutorialMode}
        registerInputInteraction={registerInputInteraction}
        lastFocusTargetRef={lastFocusTargetRef}
        memoFocusedRef={memoFocusedRef}
        focusedFieldRef={focusedFieldRef}
        scheduleScrollToFocusedInput={scheduleScrollToFocusedInput}
        updateMemoInputVisibleHeight={updateMemoInputVisibleHeight}
        styles={styles}
        colors={colors}
      />
      <InputMemoField
        field="memoAction"
        iconName="walk-outline"
        label="行動内容（実際に起こった出来事）"
        hint="何が起きた／何をした／結果どうなった？"
        value={memoAction}
        setValue={setMemoAction}
        inputRef={memoActionInputRef}
        contentHeight={memoActionContentHeight}
        inputMaxHeight={inputMaxHeight}
        activeField={activeField}
        setActiveField={setActiveField}
        isTutorialMode={isTutorialMode}
        registerInputInteraction={registerInputInteraction}
        lastFocusTargetRef={lastFocusTargetRef}
        memoFocusedRef={memoFocusedRef}
        focusedFieldRef={focusedFieldRef}
        scheduleScrollToFocusedInput={scheduleScrollToFocusedInput}
        updateMemoInputVisibleHeight={updateMemoInputVisibleHeight}
        styles={styles}
        colors={colors}
      />
    </View>
  );
}
