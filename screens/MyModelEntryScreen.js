import React from "react";

import MyModelScreen from "./MyModelScreen";
import NexusScreen from "./NexusScreen";

export default function MyModelEntryScreen(props) {
  const hasLinkPayload = !!props?.linkPayload;

  if (hasLinkPayload) {
    return <MyModelScreen {...props} />;
  }

  return <NexusScreen {...props} />;
}
