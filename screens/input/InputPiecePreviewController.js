import React from "react";

import EmotionPiecePreviewModal from "../../components/EmotionPiecePreviewModal";

export default function InputPiecePreviewController({
  visible,
  previewPayload,
  pieceQuota,
  publishLoading,
  onClose,
  onPublish,
  hideCancelButton,
}) {
  return (
    <EmotionPiecePreviewModal
      visible={visible}
      preview={{
        ...(previewPayload || {}),
        quota: previewPayload?.quota || pieceQuota || null,
      }}
      publishLoading={publishLoading}
      onClose={onClose}
      onPublish={onPublish}
      hideCancelButton={hideCancelButton}
    />
  );
}
