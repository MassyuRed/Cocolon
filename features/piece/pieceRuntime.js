/** PCE-7/PCE-8 B14-B: Piece-only presentation flags from app bootstrap.
 * These booleans never authorize source access, generation, save or export.
 * The server remains the effective-state/operation-enforcement owner.
 * No local override, environment parser, network request or activation.
 */
export const PIECE_FEATURE_FLAGS = Object.freeze([
  'piece_v2_preview_enabled',
  'piece_v2_save_enabled',
  'piece_v2_owner_read_enabled',
  'piece_v2_public_write_enabled',
  'piece_v2_public_read_enabled',
  'piece_v2_visibility_toggle_enabled',
  'piece_v2_export_enabled',
  'piece_v2_delete_enabled',
]);

export const PIECE_FEATURE_DEFAULTS = Object.freeze(
  Object.fromEntries(PIECE_FEATURE_FLAGS.map(name => [name, false])),
);

// Unknown future Piece flags must not inherit the generic fallback=true.
export function isPieceFeatureFlag(name) {
  return typeof name === 'string' && name.startsWith('piece_v2_');
}

export function normalizePieceFeatureFlags(raw) {
  const flags = { ...PIECE_FEATURE_DEFAULTS };
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const name of PIECE_FEATURE_FLAGS) {
      flags[name] = Object.prototype.hasOwnProperty.call(raw, name) && raw[name] === true;
    }
  }
  return Object.freeze(flags);
}

export function withoutPieceFeatureFlags(flags) {
  // Preserve unrelated app flags, removing unknown Piece names as well.
  const result = {};
  if (flags && typeof flags === 'object' && !Array.isArray(flags)) {
    for (const [name, value] of Object.entries(flags)) {
      if (!isPieceFeatureFlag(name)) result[name] = value;
    }
  }
  return { ...result, ...PIECE_FEATURE_DEFAULTS };
}

export function isPieceFeatureEnabled(name, runtime) {
  return PIECE_FEATURE_FLAGS.includes(name) && runtime?.loaded === true &&
    runtime?.loading === false && runtime?.error === null &&
    Object.prototype.hasOwnProperty.call(runtime.featureFlags || {}, name) &&
    runtime.featureFlags[name] === true;
}
