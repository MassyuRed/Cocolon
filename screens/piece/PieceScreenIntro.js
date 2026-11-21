import React from "react";
import CocolonScreenIntro from "../../components/CocolonScreenIntro";

export default function PieceScreenIntro({ titleRef, colors, ui }) {
  return (
    <CocolonScreenIntro
      eyebrow="ひとりひとりの記録から"
      title="ことばを、分け合う。"
      description="言葉や気持ちにふれて、共鳴を届ける。"
      titleRef={titleRef}
      colors={colors}
      ui={ui}
    />
  );
}
