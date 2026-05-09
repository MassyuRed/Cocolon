import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Platform } from "react-native";

import {
  clampMemoInputVisibleHeight,
  FOCUSED_INPUT_SCROLL_OFFSET,
  MEMO_INPUT_INITIAL_HEIGHT,
  normalizeMemoInputContentHeight,
} from "./inputLayoutModel";

export function useInputKeyboardAwareMemo({ windowHeight, scrollRef }) {
  const memoInputRef = useRef(null);
  const memoActionInputRef = useRef(null);
  const [memoContentHeight, setMemoContentHeight] = useState(MEMO_INPUT_INITIAL_HEIGHT);
  const [memoActionContentHeight, setMemoActionContentHeight] = useState(MEMO_INPUT_INITIAL_HEIGHT);
  const memoRawContentHeightRef = useRef(MEMO_INPUT_INITIAL_HEIGHT);
  const memoActionRawContentHeightRef = useRef(MEMO_INPUT_INITIAL_HEIGHT);
  const memoVisibleHeightRef = useRef(MEMO_INPUT_INITIAL_HEIGHT);
  const memoActionVisibleHeightRef = useRef(MEMO_INPUT_INITIAL_HEIGHT);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const memoFocusedRef = useRef(false);
  const focusedFieldRef = useRef(null);
  const lastFocusTargetRef = useRef(null);
  const scrollToFocusedInputFrameRef = useRef(null);

  const resetMemoInputHeights = useCallback((memoHeight = MEMO_INPUT_INITIAL_HEIGHT, memoActionHeight = MEMO_INPUT_INITIAL_HEIGHT) => {
    const nextMemoHeight = normalizeMemoInputContentHeight(memoHeight);
    const nextMemoActionHeight = normalizeMemoInputContentHeight(memoActionHeight);

    memoRawContentHeightRef.current = nextMemoHeight;
    memoActionRawContentHeightRef.current = nextMemoActionHeight;
    memoVisibleHeightRef.current = nextMemoHeight;
    memoActionVisibleHeightRef.current = nextMemoActionHeight;
    setMemoContentHeight(nextMemoHeight);
    setMemoActionContentHeight(nextMemoActionHeight);
  }, []);

  const inputMaxHeight = useMemo(() => {
    const h = windowHeight || 0;
    if (!h) return 520;

    if (keyboardInset > 0) {
      const remaining = h - keyboardInset;
      return Math.max(160, Math.floor(remaining - 60));
    }

    return Math.max(260, Math.floor(h * 0.75));
  }, [keyboardInset, windowHeight]);

  const updateMemoInputVisibleHeight = useCallback((field, rawHeight) => {
    const rawHeightNumber = Number(rawHeight);
    if (!Number.isFinite(rawHeightNumber) || rawHeightNumber <= 0) {
      return false;
    }

    const normalizedRawHeight = normalizeMemoInputContentHeight(rawHeightNumber);
    const nextVisibleHeight = clampMemoInputVisibleHeight(normalizedRawHeight, inputMaxHeight);

    if (field === "memo") {
      memoRawContentHeightRef.current = normalizedRawHeight;
      if (Math.abs(memoVisibleHeightRef.current - nextVisibleHeight) < 1) {
        return false;
      }
      memoVisibleHeightRef.current = nextVisibleHeight;
      setMemoContentHeight(nextVisibleHeight);
      return true;
    }

    memoActionRawContentHeightRef.current = normalizedRawHeight;
    if (Math.abs(memoActionVisibleHeightRef.current - nextVisibleHeight) < 1) {
      return false;
    }
    memoActionVisibleHeightRef.current = nextVisibleHeight;
    setMemoActionContentHeight(nextVisibleHeight);
    return true;
  }, [inputMaxHeight]);

  const scrollToFocusedInput = useCallback((extraOffset = FOCUSED_INPUT_SCROLL_OFFSET) => {
    const sv = scrollRef?.current;
    const target = lastFocusTargetRef.current;
    if (!sv || !target) return;
    try {
      sv.scrollResponderScrollNativeHandleToKeyboard(target, extraOffset, true);
    } catch {
      // noop
    }
  }, [scrollRef]);

  const scheduleScrollToFocusedInput = useCallback((extraOffset = FOCUSED_INPUT_SCROLL_OFFSET) => {
    if (scrollToFocusedInputFrameRef.current) {
      cancelAnimationFrame(scrollToFocusedInputFrameRef.current);
    }

    scrollToFocusedInputFrameRef.current = requestAnimationFrame(() => {
      scrollToFocusedInputFrameRef.current = null;
      scrollToFocusedInput(extraOffset);
    });
  }, [scrollToFocusedInput]);

  useEffect(() => {
    updateMemoInputVisibleHeight("memo", memoRawContentHeightRef.current);
    updateMemoInputVisibleHeight("memoAction", memoActionRawContentHeightRef.current);
  }, [inputMaxHeight, updateMemoInputVisibleHeight]);

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardInset(h);
      scheduleScrollToFocusedInput();
    };

    const onHide = () => {
      setKeyboardInset(0);
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [scheduleScrollToFocusedInput]);

  useEffect(() => {
    return () => {
      if (scrollToFocusedInputFrameRef.current) {
        cancelAnimationFrame(scrollToFocusedInputFrameRef.current);
        scrollToFocusedInputFrameRef.current = null;
      }
    };
  }, []);

  return {
    keyboardInset,
    inputMaxHeight,
    memoInputRef,
    memoActionInputRef,
    memoContentHeight,
    memoActionContentHeight,
    memoFocusedRef,
    focusedFieldRef,
    lastFocusTargetRef,
    resetMemoInputHeights,
    updateMemoInputVisibleHeight,
    scheduleScrollToFocusedInput,
  };
}

export default useInputKeyboardAwareMemo;
