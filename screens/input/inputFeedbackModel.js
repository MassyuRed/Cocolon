const STRENGTH_SCORE = Object.freeze({ weak: 1, medium: 2, strong: 3 });

export function strengthScoreForFeedback(strength) {
  return STRENGTH_SCORE[strength] || 0;
}

export function formatEmotionForFeedback(entry) {
  return String(entry?.type || "").trim();
}

export function buildInputFeedbackEmotionMeta(values) {
  const items = Array.isArray(values)
    ? values
        .map((entry) => ({
          type: String(entry?.type || "").trim(),
          strength: String(entry?.strength || "medium").trim() || "medium",
        }))
        .filter((entry) => entry.type)
    : [];

  if (items.length === 0) {
    return {
      emotionSummary: "",
      dominantSummary: "",
      dominantLabel: "",
    };
  }

  let dominant = items[0];
  for (const item of items) {
    if (strengthScoreForFeedback(item.strength) > strengthScoreForFeedback(dominant.strength)) {
      dominant = item;
    }
  }

  const emotionSummary = items
    .map((entry) => formatEmotionForFeedback(entry))
    .filter(Boolean)
    .join("／");
  const dominantLabel = formatEmotionForFeedback(dominant);

  return {
    emotionSummary: emotionSummary ? `選択した感情：${emotionSummary}` : "",
    dominantSummary: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
    dominantLabel: dominantLabel ? `中心として見ている感情：${dominantLabel}` : "",
  };
}

const EMLIS_OBSERVATION_STATUS = Object.freeze({
  PASSED: "passed",
  REJECTED: "rejected",
  UNAVAILABLE: "unavailable",
  SAFETY_BLOCKED: "safety_blocked",
});

const EMLIS_OBSERVATION_REPLY_KIND = Object.freeze({
  ELIGIBLE: "eligible_observation",
  LOW_INFORMATION: "low_information_observation",
});

export function normalizeEmlisObservationStatus(value) {
  const status = String(value || "").trim().toLowerCase();
  if (status === EMLIS_OBSERVATION_STATUS.PASSED) return EMLIS_OBSERVATION_STATUS.PASSED;
  if (status === EMLIS_OBSERVATION_STATUS.REJECTED) return EMLIS_OBSERVATION_STATUS.REJECTED;
  if (status === EMLIS_OBSERVATION_STATUS.UNAVAILABLE) return EMLIS_OBSERVATION_STATUS.UNAVAILABLE;
  if (status === EMLIS_OBSERVATION_STATUS.SAFETY_BLOCKED) return EMLIS_OBSERVATION_STATUS.SAFETY_BLOCKED;
  return "";
}


export function normalizeEmlisObservationReplyKind(value) {
  const replyKind = String(value || "").trim();
  if (replyKind === EMLIS_OBSERVATION_REPLY_KIND.ELIGIBLE) {
    return EMLIS_OBSERVATION_REPLY_KIND.ELIGIBLE;
  }
  if (replyKind === EMLIS_OBSERVATION_REPLY_KIND.LOW_INFORMATION) {
    return EMLIS_OBSERVATION_REPLY_KIND.LOW_INFORMATION;
  }
  return "";
}

function getEmlisObservationMeta(input = {}) {
  const meta =
    input?.emlisAiMeta ||
    input?.emlis_ai ||
    input?.input_feedback?.emlis_ai ||
    input?.ai ||
    input ||
    {};
  return meta && typeof meta === "object" && !Array.isArray(meta) ? meta : {};
}

export function getEmlisObservationReplyKind(input = {}) {
  const meta = getEmlisObservationMeta(input);
  const diagnostic = meta?.diagnostic_summary || meta?.multi_perspective?.diagnostic_summary || {};
  const step10 =
    meta?.step10_observation_display_repair_integration ||
    meta?.observation_display_repair_integration ||
    diagnostic?.step10_observation_display_repair_integration ||
    diagnostic?.observation_display_repair_integration ||
    {};
  const replyMeta =
    meta?.observation_reply_meta ||
    meta?.observation_reply_contract ||
    diagnostic?.observation_reply_meta ||
    diagnostic?.observation_reply_contract ||
    step10?.observation_reply_meta ||
    {};

  return normalizeEmlisObservationReplyKind(
    input?.observationReplyKind ||
      input?.observation_reply_kind ||
      meta?.observation_reply_kind ||
      replyMeta?.observation_reply_kind ||
      step10?.observation_reply_kind ||
      ""
  );
}

export function getEmlisObservationStatus(input = {}) {
  return normalizeEmlisObservationStatus(
    input?.observationStatus ||
      input?.observation_status ||
      input?.emlisAiMeta?.observation_status ||
      input?.emlis_ai?.observation_status ||
      input?.input_feedback?.emlis_ai?.observation_status ||
      ""
  );
}

export function getEmlisObservationCommentText(input = {}) {
  return String(
    input?.commentText ||
      input?.comment_text ||
      input?.input_feedback?.comment_text ||
      ""
  ).trim();
}

export function isPassedEmlisObservationReply(input = {}) {
  return (
    getEmlisObservationStatus(input) === EMLIS_OBSERVATION_STATUS.PASSED &&
    Boolean(getEmlisObservationCommentText(input))
  );
}

export function buildPassedEmlisObservationModalPayload(input = {}) {
  const observationStatus = getEmlisObservationStatus(input);
  const commentText = getEmlisObservationCommentText(input);
  if (observationStatus !== EMLIS_OBSERVATION_STATUS.PASSED || !commentText) {
    return null;
  }
  return {
    commentText,
    observationStatus,
    emotionSummary: String(input?.emotionSummary || "").trim(),
    dominantSummary: String(input?.dominantSummary || input?.dominantLabel || "").trim(),
    contextLabel: String(input?.contextLabel || "").trim(),
  };
}

export const EMLIS_OBSERVATION_RELEASE_PHASE = 10;
export const EMLIS_OBSERVATION_REQUIRED_PHASES = Object.freeze([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
]);
export const EMLIS_OBSERVATION_RELEASE_REQUIRED_CHECKS = Object.freeze([
  "phase9_frontend_passed_only",
  "phase10_fixed_string_regression",
  "phase10_structure_reading_grounding_guard",
  "phase10_template_echo_guard",
  "phase10_screenshot_regression",
  "phase10_unverified_phase_not_passed",
]);

function normalizeReleaseChecks(checks) {
  if (!checks || typeof checks !== "object" || Array.isArray(checks)) return {};
  return EMLIS_OBSERVATION_RELEASE_REQUIRED_CHECKS.reduce((acc, key) => {
    acc[key] = checks[key] === true;
    return acc;
  }, {});
}

function normalizeCompletedPhases(value) {
  return Array.isArray(value)
    ? value.map((phase) => Number(phase)).filter(Number.isFinite)
    : [];
}

export function getEmlisObservationPhaseGate(input = {}) {
  const meta = input?.emlisAiMeta || input?.emlis_ai || input?.input_feedback?.emlis_ai || input || {};
  const phaseGate =
    meta?.multi_perspective?.phase_gate ||
    meta?.phase_gate ||
    input?.phaseGate ||
    input?.phase_gate ||
    {};
  return phaseGate && typeof phaseGate === "object" && !Array.isArray(phaseGate)
    ? phaseGate
    : {};
}

export function getEmlisObservationCompletedPhases(input = {}) {
  const phaseGate = getEmlisObservationPhaseGate(input);
  return normalizeCompletedPhases(
    input?.completedPhases ||
      input?.completed_phases ||
      phaseGate?.completed_phases ||
      phaseGate?.completedPhases
  );
}

function getEmlisObservationReleaseChecks(input = {}) {
  const phaseGate = getEmlisObservationPhaseGate(input);
  return normalizeReleaseChecks(
    input?.checks ||
      input?.releaseChecks ||
      input?.release_checks ||
      phaseGate?.release_checks ||
      phaseGate?.releaseChecks
  );
}

export function buildEmlisObservationReleaseDecision(input = {}) {
  const phaseGate = getEmlisObservationPhaseGate(input);
  const completedPhases = getEmlisObservationCompletedPhases(input);
  const allPhasesComplete = EMLIS_OBSERVATION_REQUIRED_PHASES.every((phase) =>
    completedPhases.includes(phase)
  );
  const checks = getEmlisObservationReleaseChecks(input);
  const failedChecks = EMLIS_OBSERVATION_RELEASE_REQUIRED_CHECKS.filter(
    (key) => checks[key] !== true
  );
  const passedOnlyModalVerified = Boolean(
    input?.passedOnlyModalVerified === true ||
      phaseGate?.phase9_frontend_display_control_ready === true ||
      phaseGate?.frontend_display_control_ready === true
  );
  const backendDisplayGateVerified = Boolean(
    input?.backendDisplayGateVerified === true ||
      phaseGate?.display_gate_release_ready === true ||
      phaseGate?.display_gate_ready === true
  );
  const backendReleaseReady = Boolean(
    input?.releaseReady === true ||
      input?.release_ready === true ||
      phaseGate?.release_ready === true
  );
  const releaseReady = Boolean(
    backendReleaseReady &&
      allPhasesComplete &&
      failedChecks.length === 0 &&
      passedOnlyModalVerified &&
      backendDisplayGateVerified
  );

  return {
    releaseReady,
    releasePhase: EMLIS_OBSERVATION_RELEASE_PHASE,
    completedPhases,
    allPhasesComplete,
    passedOnlyModalVerified,
    backendDisplayGateVerified,
    backendReleaseReady,
    failedChecks,
  };
}

export function isEmlisObservationReleaseReady(input = {}) {
  return buildEmlisObservationReleaseDecision(input).releaseReady;
}

