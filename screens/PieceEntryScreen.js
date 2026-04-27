import React from "react";

import PieceScreen from "./PieceScreen";
import NexusScreen from "./NexusScreen";

export default function PieceEntryScreen(props) {
  const hasLinkPayload = !!props?.linkPayload;

  if (hasLinkPayload) {
    return <PieceScreen {...props} />;
  }

  return <NexusScreen {...props} />;
}
