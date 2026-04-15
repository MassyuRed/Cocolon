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


const TUTORIAL_REFLECTION_QUESTION = "理想の休日の過ごし方は？";
const DEFAULT_TUTORIAL_SELF_REFLECTION = Object.freeze({
  id: "tutorial-reflection-self",
  q_instance_id: "tutorial-q-self",
  q_key: "tutorial-holiday",
  title: TUTORIAL_REFLECTION_QUESTION,
  body:
    "静かな場所でゆっくり休みつつ、好きなことに時間を使える休日が理想です。",
  owner_user_id: "tutorial-self",
  display_name: "自分",
  friend_code: "YOU",
  is_tutorial: true,
  tutorial_kind: "self",
  created_at: "2026-01-01T09:10:00.000Z",
  resonances: 0,
  discoveries: 0,
  views: 0,
  is_new: true,
});
const DEFAULT_TUTORIAL_MOCK_REFLECTIONS = Object.freeze([
  {
    id: "tutorial-reflection-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_REFLECTION_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: "User",
    friend_code: "HANAKO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    discoveries: 2,
    views: 12,
    is_new: true,
  },
]);

function cloneInitialArrays() {
  return {
    tutorialEmotions: [],
    tutorialReflections: [],
    tutorialFriendFeed: [],
  };
}


function cloneTutorialReflectionItem(payload) {
  return payload ? JSON.parse(JSON.stringify(payload)) : payload;
}

function buildDefaultTutorialSelfReflection(body) {
  const nextBody = String(body || "").trim();
  return {
    ...cloneTutorialReflectionItem(DEFAULT_TUTORIAL_SELF_REFLECTION),
    body: nextBody || DEFAULT_TUTORIAL_SELF_REFLECTION.body,
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

  const ensureTutorialReflectionsSeed = useCallback((options = {}) => {
    const nextSelfBody = String(options?.selfBody || "").trim();

    setTutorialReflections((prev) => {
      const safePrev = Array.isArray(prev)
        ? prev.filter(Boolean).map((item) => cloneTutorialReflectionItem(item))
        : [];

      let changed = false;
      let nextItems = [...safePrev];
      const selfIndex = nextItems.findIndex(
        (item) => String(item?.tutorial_kind || "") === "self"
      );
      const hasMock = nextItems.some(
        (item) => String(item?.tutorial_kind || "") === "mock"
      );

      if (selfIndex < 0) {
        nextItems = [buildDefaultTutorialSelfReflection(nextSelfBody), ...nextItems];
        changed = true;
      } else if (
        nextSelfBody &&
        String(nextItems[selfIndex]?.body || "").trim() !== nextSelfBody
      ) {
        nextItems[selfIndex] = {
          ...nextItems[selfIndex],
          title:
            String(nextItems[selfIndex]?.title || "").trim() ||
            TUTORIAL_REFLECTION_QUESTION,
          body: nextSelfBody,
        };
        changed = true;
      }

      if (!hasMock) {
        nextItems = [
          ...nextItems,
          ...DEFAULT_TUTORIAL_MOCK_REFLECTIONS.map((item) =>
            cloneTutorialReflectionItem(item)
          ),
        ];
        changed = true;
      }

      return changed ? nextItems : prev;
    });
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
      ensureTutorialReflectionsSeed,
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
      ensureTutorialReflectionsSeed,
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
