const FRONTEND_OBSERVATION_DIAGNOSTIC_VERSION = "emlis.frontend_observation_diagnostic.v1";
const FRONTEND_OBSERVATION_DIAGNOSTIC_SOURCE = "rn_input_screen";
const FRONTEND_OBSERVATION_DIAGNOSTIC_LOG_PREFIX = "emlis_observation_frontend_result";

const TRUE_ENV_VALUES = new Set(["1", "true", "yes", "on"]);
const FORBIDDEN_TEXT_PAYLOAD_KEYS = new Set([
  "raw_input",
  "rawInput",
  "memo",
  "current_input",
  "currentInput",
  "comment_text",
  "commentText",
  "input_feedback_comment",
  "public_comment_text",
]);

function normalizeString(value) {
  return String(value || "").trim();
}

function normalizeBoolean(value) {
  return value === true;
}

function getEnvFlagValue(name) {
  if (typeof process === "undefined" || !process?.env) return "";
  return normalizeString(process.env[name]).toLowerCase();
}

function isTruthyEnvFlag(name) {
  return TRUE_ENV_VALUES.has(getEnvFlagValue(name));
}

function isFrontendDiagnosticRuntimeAllowed() {
  if (typeof __DEV__ === "undefined") return true;
  return __DEV__ === true;
}

export function isEmlisObservationFrontendDiagnosticLogEnabled() {
  return (
    isFrontendDiagnosticRuntimeAllowed() &&
    (isTruthyEnvFlag("EXPO_PUBLIC_EMLIS_OBSERVATION_DIAGNOSTIC_LOG") ||
      isTruthyEnvFlag("EXPO_PUBLIC_COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOG"))
  );
}

function getInputFeedbackAI(submitResult, inputFeedbackAI) {
  if (inputFeedbackAI && typeof inputFeedbackAI === "object") return inputFeedbackAI;
  const inputFeedback = submitResult?.input_feedback || submitResult?.inputFeedback || null;
  const ai = inputFeedback?.emlis_ai || inputFeedback?.emlisAi || null;
  return ai && typeof ai === "object" ? ai : {};
}

function getTraceId(meta) {
  const diagnostic = meta?.diagnostic_summary || meta?.multi_perspective?.diagnostic_summary || {};
  return normalizeString(
    meta?.observation_trace_id ||
      meta?.trace_id ||
      diagnostic?.observation_trace_id ||
      diagnostic?.trace_id ||
      ""
  );
}

function getObservationStatus(meta) {
  return normalizeString(meta?.observation_status || meta?.observationStatus || "");
}

function getEmotionLogId(submitResult) {
  return normalizeString(
    submitResult?.id ||
      submitResult?.emotion_log_id ||
      submitResult?.emotionLogId ||
      submitResult?.emotion?.id ||
      submitResult?.record?.id ||
      ""
  );
}

export function buildEmlisObservationFrontendDiagnostic({
  submitResult,
  inputFeedbackText,
  inputFeedbackAI,
  openedObservation,
} = {}) {
  const meta = getInputFeedbackAI(submitResult, inputFeedbackAI);
  const textLength = normalizeString(inputFeedbackText).length;

  return {
    version: FRONTEND_OBSERVATION_DIAGNOSTIC_VERSION,
    source: FRONTEND_OBSERVATION_DIAGNOSTIC_SOURCE,
    emotion_log_id: getEmotionLogId(submitResult),
    trace_id: getTraceId(meta),
    observation_status: getObservationStatus(meta),
    comment_text_length: textLength,
    comment_text_present: textLength > 0,
    modal_opened: normalizeBoolean(openedObservation),
    raw_input_included: false,
    comment_text_included: false,
  };
}

function assertNoForbiddenTextPayloadKeys(value, path = "record") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_TEXT_PAYLOAD_KEYS.has(key)) {
      throw new Error(`Emlis observation frontend diagnostic must not include ${path}.${key}`);
    }
    if (child && typeof child === "object") {
      assertNoForbiddenTextPayloadKeys(child, `${path}.${key}`);
    }
  }
}

export function dumpEmlisObservationFrontendDiagnostic(record = {}) {
  assertNoForbiddenTextPayloadKeys(record);
  const safeRecord = {
    ...record,
    raw_input_included: false,
    comment_text_included: false,
  };
  return JSON.stringify(safeRecord);
}

export function logEmlisObservationFrontendDiagnostic(args = {}, logger = console) {
  if (!isEmlisObservationFrontendDiagnosticLogEnabled()) return null;
  const record = buildEmlisObservationFrontendDiagnostic(args);
  const serialized = dumpEmlisObservationFrontendDiagnostic(record);
  const log = typeof logger?.info === "function" ? logger.info : logger?.log;
  if (typeof log === "function") {
    log.call(logger, `${FRONTEND_OBSERVATION_DIAGNOSTIC_LOG_PREFIX} ${serialized}`);
  }
  return record;
}
