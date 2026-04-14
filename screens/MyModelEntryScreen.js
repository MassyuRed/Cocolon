import React from "react";

import { useTutorial } from "../TutorialContext";
import MyModelScreen from "./MyModelScreen";
import NexusScreen from "./NexusScreen";

export default function MyModelEntryScreen(props) {
  const { isTutorialMode } = useTutorial();
  const hasLinkPayload = !!props?.linkPayload;

  if (isTutorialMode || hasLinkPayload) {
    return <MyModelScreen {...props} />;
  }

  return <NexusScreen {...props} />;
}
