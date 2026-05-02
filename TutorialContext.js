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
import {
  TUTORIAL_HAS_VALID_FIXTURES,
  TUTORIAL_PIECES,
} from "./tutorial/tutorialScenarioData";

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
  tutorialResetToken: 0,
});

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

function cloneTutorialPieceItems(items = []) {
  return Array.isArray(items)
    ? items.filter(Boolean).map((item) => cloneTutorialPieceItem(item))
    : [];
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
  const [tutorialResetToken, setTutorialResetToken] = useState(
    INITIAL_TUTORIAL_STATE.tutorialResetToken
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
    if (!TUTORIAL_HAS_VALID_FIXTURES) {
      console.warn("TutorialContext: tutorial fixtures are not valid; tutorial start aborted");
      return false;
    }
    setIsTutorialMode(true);
    setTutorialCompleted(false);
    setTutorialSkipped(false);
    clearTutorialData();
    setTutorialPieces(cloneTutorialPieceItems(TUTORIAL_PIECES));
    return true;
  }, [clearTutorialData]);

  const endTutorial = useCallback(async () => {
    setIsTutorialMode(false);
    setTutorialCompleted(true);
    setTutorialSkipped(false);
    clearTutorialData();
    setTutorialResetToken((prev) => prev + 1);
    await syncTutorialFlagsToProfile({
      tutorial_completed: true,
      tutorial_skipped: false,
      tutorial_completed_at: new Date().toISOString(),
    });
  }, [clearTutorialData, syncTutorialFlagsToProfile]);

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

  const ensureTutorialPiecesSeed = useCallback(() => {
    setTutorialPieces((prev) => {
      const safePrev = cloneTutorialPieceItems(prev);
      const nextItems = [...safePrev];
      let changed = false;

      cloneTutorialPieceItems(TUTORIAL_PIECES).forEach((seedItem) => {
        const seedId = String(seedItem?.q_instance_id || seedItem?.id || "").trim();
        const exists = nextItems.some((item) => {
          const itemId = String(item?.q_instance_id || item?.id || "").trim();
          return seedId && itemId === seedId;
        });
        if (!exists) {
          nextItems.push(seedItem);
          changed = true;
        }
      });

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
      tutorialResetToken,
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
      tutorialResetToken,
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
