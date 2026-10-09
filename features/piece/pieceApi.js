/**
 * B10 development-only Piece v2 preview transport (PCE-8's RN API owner).
 * Connects to api_piece_v2.py at 0c6cb565; no legacy client or runtime caller
 * is changed. Importing this module performs no network operation.
 *
 * This is a detached wire snapshot, NOT renderer admission or a complete
 * preview UI. Formal structure-map/manifest synchronization remains pending.
 * Hashes are carried unchanged, not recomputed here. The current
 * backend response lacks PCE-6 capabilities/quota; those and the source CTA,
 * effective flags, preview model and native renderer still need integration.
 * No default entitlement, expiry, renderer, safety verdict or key is invented.
 */
import { apiFetch, getAccessToken } from "../../lib/apiClient";

const PATH = '/emotion/piece/preview';
const FORMATS = ['short_essay', 'quote', 'declaration'];
const SOURCE_FIELDS = [
  'source_input_id', 'source_input_version', 'source_input_bundle_commitment',
  'emlis_observation_stage', 'emlis_observation_result_identity',
  'question_need_decision_identity', 'supplemental_answer_identity',
];
const PREVIEW_FIELDS = [
  'api_contract_version', 'piece_contract_version', 'preview_id',
  'preview_revision', 'row_version', 'expires_at', 'visibility_scope',
  'content_status', 'format_type', 'eligible_formats', 'content_payload',
  'content_payload_hash', 'piece_text', 'piece_text_hash', 'visual_recipe',
  'visual_recipe_hash', 'renderer_version',
];
const STATUS = Object.freeze({
  PIECE_REQUEST_INVALID: 400, PIECE_AUTH_REQUIRED: 401,
  PIECE_SOURCE_NOT_FOUND: 404, PIECE_NOT_FOUND: 404,
  PIECE_PREVIEW_STALE: 409, PIECE_PREVIEW_EXPIRED: 409,
  PIECE_CONFLICT: 409, PIECE_HASH_MISMATCH: 409,
  PIECE_SOURCE_NOT_ELIGIBLE: 422, PIECE_FORMAT_NOT_ELIGIBLE: 422,
  PIECE_VISUAL_SELECTION_NOT_ALLOWED: 422, PIECE_SAFETY_UNAVAILABLE: 422,
  PIECE_TEMPORARILY_UNAVAILABLE: 503, PIECE_FEATURE_DISABLED: 503,
});
const MESSAGES = Object.freeze({
  PIECE_FEATURE_DISABLED: 'Pieceは現在利用できません。',
  PIECE_REQUEST_INVALID: 'Pieceの要求を確認できませんでした。',
  PIECE_AUTH_REQUIRED: 'ログイン状態が変わった可能性があります。アカウントを確認してください。',
  PIECE_SOURCE_NOT_FOUND: 'この入力は現在利用できません。',
  PIECE_NOT_FOUND: 'このPieceは現在利用できません。',
  PIECE_PREVIEW_STALE: 'プレビューが更新されています。',
  PIECE_PREVIEW_EXPIRED: 'プレビューの有効期限が切れています。',
  PIECE_CONFLICT: '入力またはプレビューの状態が変わっています。',
  PIECE_HASH_MISMATCH: 'プレビューの内容を確認できませんでした。',
  PIECE_SOURCE_NOT_ELIGIBLE: 'この入力からは現在Pieceを作成できません。',
  PIECE_FORMAT_NOT_ELIGIBLE: 'この形式は現在選択できません。',
  PIECE_VISUAL_SELECTION_NOT_ALLOWED: 'この画像設定は現在選択できません。',
  PIECE_SAFETY_UNAVAILABLE: '伝えたい内容を保ったPieceを作成できませんでした。',
  PIECE_TEMPORARILY_UNAVAILABLE: '結果を確認できませんでした。同じ要求で再試行できます。',
});

export class PieceApiError extends Error {
  constructor(code) {
    const safeCode = Object.prototype.hasOwnProperty.call(STATUS, code) ? code : 'PIECE_TEMPORARILY_UNAVAILABLE';
    super(MESSAGES[safeCode]);
    this.name = 'PieceApiError';
    this.code = safeCode;
    this.status = STATUS[safeCode];
  }
}

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => object(value) && Object.keys(value).length === keys.length &&
  keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
const text = value => typeof value === 'string' && value.trim().length > 0 &&
  !/[\uD800-\uDFFF]/u.test(value);
const hash = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
const positive = value => Number.isSafeInteger(value) && value > 0;
const reject = code => { throw new PieceApiError(code); };

function requestBody(value) {
  if (!exact(value, ['source_ref', 'requested_format', 'visual_selection']) ||
      !exact(value.source_ref, SOURCE_FIELDS) ||
      !exact(value.visual_selection, ['theme_id', 'aspect_ratio', 'branding_mode'])) {
    reject('PIECE_REQUEST_INVALID');
  }
  // Capture before the first await. Never retain mutable caller-owned fields.
  let snapshot;
  try { snapshot = JSON.parse(JSON.stringify(value)); }
  catch { reject('PIECE_REQUEST_INVALID'); }
  if (!exact(snapshot, ['source_ref', 'requested_format', 'visual_selection']) ||
      !exact(snapshot.source_ref, SOURCE_FIELDS) ||
      !exact(snapshot.visual_selection, ['theme_id', 'aspect_ratio', 'branding_mode'])) {
    reject('PIECE_REQUEST_INVALID');
  }
  const source = snapshot.source_ref;
  if (!SOURCE_FIELDS.slice(0, 5).every(key => text(source[key])) ||
      !/^sha256:[0-9a-f]{64}$/.test(source.source_input_bundle_commitment) ||
      !['question_need_decision_identity', 'supplemental_answer_identity']
        .every(key => source[key] === null || text(source[key]))) {
    reject('PIECE_REQUEST_INVALID');
  }
  if (source.source_input_version !== 'emlis.current_input_bundle.v1' ||
      !['normal_observation', 'pre_question_observation'].includes(source.emlis_observation_stage) ||
      source.supplemental_answer_identity !== null) reject('PIECE_SOURCE_NOT_ELIGIBLE');
  if (snapshot.requested_format !== null && !FORMATS.includes(snapshot.requested_format)) {
    reject('PIECE_FORMAT_NOT_ELIGIBLE');
  }
  if (!Object.values(snapshot.visual_selection).every(value => value === null || text(value))) {
    reject('PIECE_VISUAL_SELECTION_NOT_ALLOWED');
  }
  return JSON.stringify(snapshot);
}

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function previewSnapshot(raw) {
  if (!exact(raw, PREVIEW_FIELDS)) reject('PIECE_TEMPORARILY_UNAVAILABLE');
  const value = JSON.parse(JSON.stringify(raw));
  const payload = value.content_payload, recipe = value.visual_recipe;
  const formats = value.eligible_formats;
  if (value.api_contract_version !== 'piece.api.v2' ||
      value.piece_contract_version !== 'piece.record.v2' ||
      typeof value.preview_id !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value.preview_id) ||
      value.preview_id === '00000000-0000-0000-0000-000000000000' ||
      !positive(value.preview_revision) || !positive(value.row_version) ||
      typeof value.expires_at !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value.expires_at) ||
      value.visibility_scope !== 'private' || !['ready', 'adjusted'].includes(value.content_status) ||
      !FORMATS.includes(value.format_type) || !Array.isArray(formats) ||
      formats.length < 1 || formats.length > 3 || new Set(formats).size !== formats.length ||
      !formats.every(format => FORMATS.includes(format)) || !formats.includes(value.format_type) ||
      !text(value.renderer_version) || !/^[A-Za-z0-9_.:\-]{1,128}$/.test(value.renderer_version) ||
      !['piece_text_hash', 'content_payload_hash', 'visual_recipe_hash'].every(key => hash(value[key]))) {
    reject('PIECE_TEMPORARILY_UNAVAILABLE');
  }
  if (!exact(payload, ['schema_version', 'meaning_contract_version', 'safety_contract_version',
    'language', 'format_type', 'title', 'body_blocks']) ||
      payload.schema_version !== 'piece.content_payload.v1' ||
      payload.meaning_contract_version !== 'piece.content_meaning.v1' ||
      payload.safety_contract_version !== 'piece.public_safety_transformation.v1' ||
      !['ja', 'en', 'mixed'].includes(payload.language) || payload.format_type !== value.format_type ||
      payload.title !== null || !Array.isArray(payload.body_blocks) ||
      payload.body_blocks.length < 1 || payload.body_blocks.length > (value.format_type === 'quote' ? 1 : 3) ||
      !payload.body_blocks.every(block => text(block) && !block.includes('\r')) ||
      value.piece_text !== payload.body_blocks.join(value.format_type === 'short_essay' ? '\n\n' : '\n')) {
    reject('PIECE_TEMPORARILY_UNAVAILABLE');
  }
  if (!exact(recipe, ['visual_recipe_version', 'visual_catalog_version', 'format_type', 'template',
    'theme', 'font_style', 'aspect_ratio', 'branding', 'layout_policy_version', 'language']) ||
      recipe.visual_recipe_version !== 'piece.visual_recipe.v1' ||
      recipe.visual_catalog_version !== 'piece.visual_catalog.v1' ||
      recipe.layout_policy_version !== 'piece.long_text_layout.v1' ||
      recipe.format_type !== value.format_type || recipe.language !== payload.language ||
      !['4:5', '9:16'].includes(recipe.aspect_ratio) ||
      !exact(recipe.template, ['template_id', 'template_version']) ||
      !exact(recipe.theme, ['theme_id', 'theme_version']) ||
      !exact(recipe.font_style, ['font_style_id', 'font_style_version']) ||
      !exact(recipe.branding, ['branding_mode', 'branding_mark_id', 'branding_mark_version']) ||
      recipe.template.template_id !== { short_essay: 'essay_frame', quote: 'focus_frame', declaration: 'stance_frame' }[value.format_type] ||
      recipe.template.template_version !== 1 || !['soft_paper', 'quiet_night'].includes(recipe.theme.theme_id) ||
      recipe.theme.theme_version !== 1 || recipe.font_style.font_style_id !== 'system_readable' ||
      recipe.font_style.font_style_version !== 1 ||
      !['required_small', 'required_subtle', 'off'].includes(recipe.branding.branding_mode) ||
      recipe.branding.branding_mark_id !== 'cocolon_text_mark' || recipe.branding.branding_mark_version !== 1 ||
      (recipe.branding.branding_mode === 'required_small' &&
        (recipe.aspect_ratio !== '4:5' || recipe.theme.theme_id !== 'soft_paper'))) {
    reject('PIECE_TEMPORARILY_UNAVAILABLE');
  }
  // Only the supported v1 representation is read here. Entitlement decisions,
  // SHA recomputation, layout fit and native rendering remain separate.
  return freeze(value);
}

function checkAbort(signal) {
  if (signal?.aborted) {
    const error = new Error('Pieceの要求を中止しました。');
    error.name = 'AbortError';
    throw error;
  }
}

async function requireSession(expectedUserId) {
  try {
    if (!text(expectedUserId) || !await getAccessToken(expectedUserId)) reject('PIECE_AUTH_REQUIRED');
  } catch {
    reject('PIECE_AUTH_REQUIRED');
  }
}

async function requestPieceData(value, options = {}, savedInputId = null) {
  let signal;
  try {
    if (!object(options)) reject('PIECE_REQUEST_INVALID');
    const { expectedUserId, idempotencyKey } = options;
    signal = options.signal;
    checkAbort(signal);
    const sourceRead = savedInputId !== null;
    if (sourceRead && (typeof savedInputId !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(savedInputId) ||
        savedInputId === '00000000-0000-0000-0000-000000000000')) reject('PIECE_REQUEST_INVALID');
    const body = sourceRead ? undefined : requestBody(value);
    if (!text(expectedUserId)) reject('PIECE_AUTH_REQUIRED');
    // Keys use an unchanged HTTP-visible representation. Reject values that
    // Fetch could trim/reject; never trim, replace or generate a retry key.
    if (!sourceRead && (typeof idempotencyKey !== 'string' ||
        !/^[\x21-\x7e](?:[\x20-\x7e]*[\x21-\x7e])?$/.test(idempotencyKey))) reject('PIECE_REQUEST_INVALID');
    await requireSession(expectedUserId);
    checkAbort(signal);
    const endpoint = sourceRead ? `/emotion/piece/source-ref/${encodeURIComponent(savedInputId)}` : PATH;
    const response = await apiFetch(endpoint, {
      method: sourceRead ? 'GET' : 'POST', auth: true, expectedUserId,
      headers: sourceRead ? { 'Cache-Control': 'no-store' } : { 'Idempotency-Key': idempotencyKey },
      body, signal,
    });
    checkAbort(signal);
    const result = await response.json();
    // An old in-flight result must not enter the next account's preview state.
    await requireSession(expectedUserId);
    checkAbort(signal);
    if (response.status !== 200) {
      const sourceCodes = ['PIECE_REQUEST_INVALID', 'PIECE_AUTH_REQUIRED', 'PIECE_SOURCE_NOT_FOUND',
        'PIECE_SOURCE_NOT_ELIGIBLE', 'PIECE_CONFLICT', 'PIECE_TEMPORARILY_UNAVAILABLE', 'PIECE_FEATURE_DISABLED'];
      reject((!sourceRead || sourceCodes.includes(result?.code)) && exact(result, ['code']) && Object.prototype.hasOwnProperty.call(STATUS, result.code) &&
        STATUS[result.code] === response.status ? result.code : 'PIECE_TEMPORARILY_UNAVAILABLE');
    }
    if (sourceRead) {
      // This endpoint returns the existing seven fields, not a new
      // eligibility/flag decision. Reuse the preview request's closed reader.
      let request;
      try { request = JSON.parse(requestBody({ source_ref: result, requested_format: null,
        visual_selection: { theme_id: null, aspect_ratio: null, branding_mode: null } })); }
      catch { reject('PIECE_TEMPORARILY_UNAVAILABLE'); }
      const ref = request.source_ref;
      if (ref.source_input_id !== savedInputId ||
          (ref.emlis_observation_stage === 'normal_observation' ? ref.question_need_decision_identity !== null
            : !text(ref.question_need_decision_identity))) reject('PIECE_TEMPORARILY_UNAVAILABLE');
      return freeze(ref);
    }
    return previewSnapshot(result);
  } catch (error) {
    checkAbort(signal);
    if (error instanceof PieceApiError) throw error;
    if (error?.name === 'AccountChangedError') reject('PIECE_AUTH_REQUIRED');
    // No body, cause, raw message, token, provider detail, logging or auto retry.
    reject('PIECE_TEMPORARILY_UNAVAILABLE');
  }
}

/** Existing POST contract; no automatic source read or changed retry key. */
export async function requestPiecePreview(value, options = {}) {
  return requestPieceData(value, options);
}

/** Unregistered PCE-9C transport. No existing screen calls it yet.
 * A source read is an explicit GET, not generation, saved-state authority,
 * feature activation or permission to reuse Emlis/Analysis text.
 */
export async function requestPieceSourceRef(savedInputId, options = {}) {
  if (savedInputId === null || savedInputId === undefined) reject('PIECE_REQUEST_INVALID');
  return requestPieceData(null, options, savedInputId);
}

// B10 state model uses the same closed wire readers as the transport.
// These snapshots are not authentication, hash verification or render approval.
export function preparePiecePreviewRequest(value, options = {}) {
  if (!object(options)) reject('PIECE_REQUEST_INVALID');
  const body = requestBody(value);
  const { expectedUserId, idempotencyKey } = options;
  if (!text(expectedUserId)) reject('PIECE_AUTH_REQUIRED');
  if (typeof idempotencyKey !== 'string' ||
      !/^[\x21-\x7e](?:[\x20-\x7e]*[\x21-\x7e])?$/.test(idempotencyKey)) reject('PIECE_REQUEST_INVALID');
  return freeze({ request: JSON.parse(body), expectedUserId, idempotencyKey });
}

export function readPiecePreviewSnapshot(value) {
  try { return previewSnapshot(value); }
  catch { reject('PIECE_TEMPORARILY_UNAVAILABLE'); }
}
