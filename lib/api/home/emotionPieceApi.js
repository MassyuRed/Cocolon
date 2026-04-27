import { apiGet, apiPost } from "../client";
import { PIECE_WIRE } from "../../compat/legacyWireContracts";

export async function getEmotionPieceQuota() {
  return apiGet(PIECE_WIRE.routes.emotionPieceQuota);
}

export async function previewEmotionPiece(payload) {
  return apiPost(PIECE_WIRE.routes.emotionPiecePreview, payload);
}

export async function publishEmotionPiece(previewId) {
  return apiPost(PIECE_WIRE.routes.emotionPiecePublish, { preview_id: previewId });
}

export async function cancelEmotionPiece(previewId) {
  return apiPost(PIECE_WIRE.routes.emotionPieceCancel, { preview_id: previewId });
}
