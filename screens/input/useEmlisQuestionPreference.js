import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadEmlisQuestionPreference,
  saveEmlisQuestionPreference,
} from "../../lib/emlisQuestionPreferenceStorage";

export function useEmlisQuestionPreference({ userId, enabled = true }) {
  const owner = String(userId || "").trim();
  const lifetime = useRef(null);
  const [, redraw] = useState(0);
  if (!lifetime.current || lifetime.current.owner !== owner || lifetime.current.enabled !== enabled) {
    lifetime.current = {
      owner, enabled, active: false, loaded: false, value: true,
      saving: false, error: "", operation: 0, hasSelection: false,
    };
  }
  const current = lifetime.current;
  const owns = () => lifetime.current === current && current.active;
  const notify = () => { if (owns()) redraw((value) => value + 1); };

  const read = useCallback(async () => {
    if (!owns() || !current.enabled || !current.owner || current.saving) return;
    const operation = ++current.operation;
    current.loaded = false;
    current.error = "";
    notify();
    try {
      const value = await loadEmlisQuestionPreference(current.owner);
      if (!owns() || current.operation !== operation) return;
      current.value = value;
      current.loaded = true;
    } catch {
      if (!owns() || current.operation !== operation) return;
      current.error = "問いの設定を読み込めませんでした。";
    }
    notify();
  }, [current]);

  const write = useCallback(async (value) => {
    if (!owns() || !current.enabled || !current.owner || (!current.loaded && !current.error) ||
        current.saving || typeof value !== "boolean") return;
    const operation = ++current.operation;
    current.value = value;
    current.hasSelection = true;
    current.saving = true;
    current.error = "";
    notify();
    try {
      await saveEmlisQuestionPreference(current.owner, value);
      if (!owns() || current.operation !== operation) return;
      current.loaded = true;
    } catch {
      if (!owns() || current.operation !== operation) return;
      current.error = "問いの設定を保存できませんでした。";
    }
    current.saving = false;
    notify();
  }, [current]);

  useEffect(() => {
    current.active = true;
    if (current.enabled && current.owner) void read();
    return () => { current.active = false; };
  }, [current, read]);

  const retry = useCallback(() => {
    if (!owns()) return;
    if (current.loaded || current.hasSelection) void write(current.value);
    else void read();
  }, [current, read, write]);
  const capture = useCallback(() => (
    owns() && current.enabled && current.loaded && !current.saving && !current.error
      ? current.value : null
  ), [current]);

  return {
    value: current.value,
    ready: current.loaded && !current.saving && !current.error,
    canChange: current.enabled && !!current.owner && !current.saving && (current.loaded || !!current.error),
    loading: !current.loaded && !current.error,
    saving: current.saving,
    error: current.error,
    needsSelection: !current.loaded && !!current.error,
    setValue: write,
    retry,
    capture,
  };
}
