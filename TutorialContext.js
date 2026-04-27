import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAccountProfileMe,
  patchAccountProfileMe,
} from "./lib/api/account/profileApi";
import { useAuth } from "./AuthContext";

const TutorialContext = createContext(undefined);

const INITIAL_TUTORIAL_STATE = Object.freeze({
  isTutorialMode: false,
  tutorialFlagsLoaded: false,
  tutorialCompleted: false,
  tutorialSkipped: false,
  tutorialStep: 0,
  tutorialEmotions: [],
  tutorialPieces: [],
  tutorialEmotionLogFeed: [],
});


const TUTORIAL_PIECE_QUESTION = "理想の休日の過ごし方は？";
const DEFAULT_TUTORIAL_SELF_PIECE = Object.freeze({
  id: "tutorial-piece-self",
  q_instance_id: "tutorial-q-self",
  q_key: "tutorial-holiday",
  title: TUTORIAL_PIECE_QUESTION,
  body:
    "静かな場所でゆっくり休みつつ、好きなことに時間を使える休日が理想です。",
  owner_user_id: "tutorial-self",
  display_name: "自分",
  share_code: "YOU",
  is_tutorial: true,
  tutorial_kind: "self",
  created_at: "2026-01-01T09:10:00.000Z",
  resonances: 0,
  views: 0,
  is_new: true,
});
const DEFAULT_TUTORIAL_MOCK_PIECES = Object.freeze([
  {
    id: "tutorial-piece-mock-1",
    q_instance_id: "tutorial-q-mock-1",
    q_key: "tutorial-holiday",
    title: TUTORIAL_PIECE_QUESTION,
    body:
      "朝は少しゆっくり起きて、好きな音楽を流しながらコーヒーを飲みます。午後は本屋か静かなカフェで過ごして、夜は早めに眠れる休日が理想です。",
    owner_user_id: "tutorial-follow-1",
    display_name: "User",
    share_code: "HANAKO123",
    is_tutorial: true,
    tutorial_kind: "mock",
    created_at: "2026-01-01T09:00:00.000Z",
    resonances: 4,
    views: 12,
    is_new: true,
  },
]);

function cloneInitialArrays() {
  return {
    tutorialEmotions: [],
    tutorialPieces: [],
    tutorialEmotionLogFeed: [],
  };
}


function cloneTutorialPieceItem(payload) {
  return payload ? JSON.parse(JSON.stringify(payload)) : payload;
}

function buildDefaultTutorialSelfPiece(body) {
  const nextBody = String(body || "").trim();
  return {
    ...cloneTutorialPieceItem(DEFAULT_TUTORIAL_SELF_PIECE),
    body: nextBody || DEFAULT_TUTORIAL_SELF_PIECE.body,
  };
}

export function TutorialProvider({ children }) {
  const { session, recoveryMode } = useAuth();
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
  const [tutorialPieces, setTutorialPieces] = useState(
    cloneInitialArrays().tutorialPieces
  );
  const [tutorialEmotionLogFeed, setTutorialEmotionLogFeed] = useState(
    cloneInitialArrays().tutorialEmotionLogFeed
  );

  const syncTutorialFlagsToProfile = useCallback(async (patch) => {
    try {
      await patchAccountProfileMe(patch);
      return true;
    } catch (e) {
      console.warn("TutorialContext: failed to sync tutorial flags", e);
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!session || recoveryMode) {
      setTutorialCompleted(false);
      setTutorialSkipped(false);
      setTutorialFlagsLoaded(false);
      return () => {
        cancelled = true;
      };
    }

    setTutorialFlagsLoaded(false);

    (async () => {
      try {
        const userId = session?.user?.id ?? null;
        if (!userId) {
          if (!cancelled) {
            setTutorialCompleted(false);
            setTutorialSkipped(false);
            setTutorialFlagsLoaded(true);
          }
          return;
        }

        const json = await getAccountProfileMe();
        if (!cancelled) {
          setTutorialCompleted(json?.tutorial_completed === true);
          setTutorialSkipped(json?.tutorial_skipped === true);
          setTutorialFlagsLoaded(true);
        }
      } catch (e) {
        console.warn("TutorialContext: failed to load tutorial flags", e);
        if (!cancelled) {
          setTutorialCompleted(false);
          setTutorialSkipped(false);
          setTutorialFlagsLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, recoveryMode]);

  const clearTutorialData = useCallback(() => {
    setTutorialEmotions([]);
    setTutorialPieces([]);
    setTutorialEmotionLogFeed([]);
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

  const addTutorialPiece = useCallback((payload) => {
    setTutorialPieces((prev) => [...prev, payload]);
  }, []);

  const addTutorialEmotionLogFeedItem = useCallback((payload) => {
    setTutorialEmotionLogFeed((prev) => [payload, ...prev]);
  }, []);

  const ensureTutorialPiecesSeed = useCallback((options = {}) => {
    const nextSelfBody = String(options?.selfBody || "").trim();

    setTutorialPieces((prev) => {
      const safePrev = Array.isArray(prev)
        ? prev.filter(Boolean).map((item) => cloneTutorialPieceItem(item))
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
        nextItems = [buildDefaultTutorialSelfPiece(nextSelfBody), ...nextItems];
        changed = true;
      } else if (
        nextSelfBody &&
        String(nextItems[selfIndex]?.body || "").trim() !== nextSelfBody
      ) {
        nextItems[selfIndex] = {
          ...nextItems[selfIndex],
          title:
            String(nextItems[selfIndex]?.title || "").trim() ||
            TUTORIAL_PIECE_QUESTION,
          body: nextSelfBody,
        };
        changed = true;
      }

      if (!hasMock) {
        nextItems = [
          ...nextItems,
          ...DEFAULT_TUTORIAL_MOCK_PIECES.map((item) =>
            cloneTutorialPieceItem(item)
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
      tutorialPieces,
      tutorialEmotionLogFeed,
      hasTutorialEmotionLog: tutorialEmotionLogFeed.length > 0,
      setIsTutorialMode,
      setTutorialFlagsLoaded,
      setTutorialCompleted,
      setTutorialSkipped,
      setTutorialStep,
      setTutorialEmotions,
      setTutorialPieces,
      setTutorialEmotionLogFeed,
      startTutorial,
      endTutorial,
      skipTutorial,
      resetTutorial,
      clearTutorialData,
      addTutorialEmotion,
      addTutorialPiece,
      addTutorialEmotionLogFeedItem,
      ensureTutorialPiecesSeed,
    }),
    [
      isTutorialMode,
      tutorialFlagsLoaded,
      tutorialCompleted,
      tutorialSkipped,
      tutorialStep,
      tutorialEmotions,
      tutorialPieces,
      tutorialEmotionLogFeed,
      startTutorial,
      endTutorial,
      skipTutorial,
      resetTutorial,
      clearTutorialData,
      addTutorialEmotion,
      addTutorialPiece,
      addTutorialEmotionLogFeedItem,
      ensureTutorialPiecesSeed,
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
