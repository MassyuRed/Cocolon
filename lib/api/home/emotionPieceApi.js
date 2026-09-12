import { apiGet, apiPost } from "../client";
import { PIECE_WIRE } from "../../compat/legacyWireContracts";

export async function getEmotionPieceQuota() {
  return apiGet(PIECE_WIRE.routes.emotionPieceQuota);
}

export async function previewEmotionPiece(payload, { expectedUserId } = {}) {
  return apiPost(PIECE_WIRE.routes.emotionPiecePreview, payload, { expectedUserId });
}

export async function publishEmotionPiece(previewId, { expectedUserId } = {}) {
  return apiPost(PIECE_WIRE.routes.emotionPiecePublish, { preview_id: previewId }, { expectedUserId });
}

export async function cancelEmotionPiece(previewId, { expectedUserId } = {}) {
  return apiPost(PIECE_WIRE.routes.emotionPieceCancel, { preview_id: previewId }, { expectedUserId });
}
