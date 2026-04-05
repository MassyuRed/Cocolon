import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { supabase } from "./lib/supabase";

const TutorialContext = createContext(undefined);

const INITIAL_TUTORIAL_STATE = Object.freeze({
  isTutorialMode: false,
  tutorialFlagsLoaded: false,
  tutorialCompleted: false,
  tutorialSkipped: false,
  tutorialStep: 0,
  tutorialEmotions: [],
  tutorialReflections: [],
  tutorialFriendFeed: [],
});

function cloneInitialArrays() {
  return {
    tutorialEmotions: [],
    tutorialReflections: [],
    tutorialFriendFeed: [],
  };
}

export function TutorialProvider({ children }) {
  const [isTutorialMode, setIsTutorialMode] = useState(
    INITIAL_TUTORIAL_STATE.isTutorialMode
  );
  const [tutorialFlagsLoaded, setTutorialFlagsLoaded] = useState(
    INITIAL_TUTORIAL_STATE.tutorialFlagsLoaded
  );
  const [tutorialCompleted, setTutorialCompleted] = useState(
    INITIAL_TUTORIAL_STATE.tutorialCompleted
  );
  const [tutorialSkipped, setTutorialSkipped] = useState(
    INITIAL_TUTORIAL_STATE.tutorialSkipped
  );
  const [tutorialStep, setTutorialStep] = useState(
    INITIAL_TUTORIAL_STATE.tutorialStep
  );

  const [tutorialEmotions, setTutorialEmotions] = useState(
    cloneInitialArrays().tutorialEmotions
  );
  const [tutorialReflections, setTutorialReflections] = useState(
    cloneInitialArrays().tutorialReflections
  );
  const [tutorialFriendFeed, setTutorialFriendFeed] = useState(
    cloneInitialArrays().tutorialFriendFeed
  );

  const syncTutorialFlagsToProfile = useCallback(async (patch) => {
    try {
      let userId = null;

      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        userId = data?.user?.id ?? null;
      } catch (authError) {
        const { data: sessionData } = await supabase.auth.getSession();
        userId = sessionData?.session?.user?.id ?? null;
      }

      if (!userId) return false;

      const { data: updatedRow, error: updateError } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", userId)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;
      if (!updatedRow?.id) {
        throw new Error("profiles row not found for tutorial flag update");
      }

      return true;
    } catch (e) {
      console.warn("TutorialContext: failed to sync tutorial flags", e);
      return false;
    }
  }, []);

  const clearTutorialData = useCallback(() => {
    setTutorialEmotions([]);
    setTutorialReflections([]);
    setTutorialFriendFeed([]);
    setTutorialStep(0);
  }, []);

  const startTutorial = useCallback(() => {
    setIsTutorialMode(true);
    setTutorialCompleted(false);
    setTutorialSkipped(false);
    clearTutorialData();
  }, [clearTutorialData]);

  const endTutorial = useCallback(async () => {
    setIsTutorialMode(false);
    setTutorialCompleted(true);
    setTutorialSkipped(false);
    await syncTutorialFlagsToProfile({
      tutorial_completed: true,
      tutorial_skipped: false,
      tutorial_completed_at: new Date().toISOString(),
    });
  }, [syncTutorialFlagsToProfile]);

  const skipTutorial = useCallback(async () => {
    setIsTutorialMode(false);
    setTutorialCompleted(false);
    setTutorialSkipped(true);
    await syncTutorialFlagsToProfile({
      tutorial_completed: false,
      tutorial_skipped: true,
      tutorial_completed_at: null,
    });
  }, [syncTutorialFlagsToProfile]);

  const resetTutorial = useCallback(() => {
    setIsTutorialMode(INITIAL_TUTORIAL_STATE.isTutorialMode);
    clearTutorialData();
  }, [clearTutorialData]);

  const addTutorialEmotion = useCallback((payload) => {
    setTutorialEmotions((prev) => [...prev, payload]);
  }, []);

  const addTutorialReflection = useCallback((payload) => {
    setTutorialReflections((prev) => [...prev, payload]);
  }, []);

  const addTutorialFriendFeedItem = useCallback((payload) => {
    setTutorialFriendFeed((prev) => [payload, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      isTutorialMode,
      tutorialFlagsLoaded,
      tutorialCompleted,
      tutorialSkipped,
      tutorialStep,
      tutorialEmotions,
      tutorialReflections,
      tutorialFriendFeed,
      hasTutorialFriendLog: tutorialFriendFeed.length > 0,
      setIsTutorialMode,
      setTutorialFlagsLoaded,
      setTutorialCompleted,
      setTutorialSkipped,
      setTutorialStep,
      setTutorialEmotions,
      setTutorialReflections,
      setTutorialFriendFeed,
      startTutorial,
      endTutorial,
      skipTutorial,
      resetTutorial,
      clearTutorialData,
      addTutorialEmotion,
      addTutorialReflection,
      addTutorialFriendFeedItem,
    }),
    [
      isTutorialMode,
      tutorialFlagsLoaded,
      tutorialCompleted,
      tutorialSkipped,
      tutorialStep,
      tutorialEmotions,
      tutorialReflections,
      tutorialFriendFeed,
      startTutorial,
      endTutorial,
      skipTutorial,
      resetTutorial,
      clearTutorialData,
      addTutorialEmotion,
      addTutorialReflection,
      addTutorialFriendFeedItem,
    ]
  );

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);

  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }

  return context;
}
