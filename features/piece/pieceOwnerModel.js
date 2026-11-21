/** Saved artifacts have no preview expiry or current-plan admission. */
import { readPieceOwnerSnapshot } from './pieceApi';
import { verifyPieceArtifactHashes } from './piecePreviewModel';

export function readPieceOwnerDisplay(raw) {
  const record = readPieceOwnerSnapshot(raw);
  verifyPieceArtifactHashes(record);
  return record;
}

export function pieceOwnerPermissions(flags = {}) {
  const read = flags.piece_v2_owner_read_enabled === true;
  return Object.freeze({
    read,
    visibility: read && flags.piece_v2_visibility_toggle_enabled === true,
    publish: read && flags.piece_v2_visibility_toggle_enabled === true && flags.piece_v2_public_write_enabled === true,
    delete: read && flags.piece_v2_delete_enabled === true,
  });
}
