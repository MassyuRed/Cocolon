import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const TUTORIAL_COMPLETED_STORAGE_PREFIX = "cocolon:tutorialCompleted";
const TUTORIAL_SKIPPED_STORAGE_PREFIX = "cocolon:tutorialSkipped";

function buildTutorialLocalFlagKey(prefix, userId) {
  const normalizedUserId = String(userId || "").trim();
  return normalizedUserId ? `${prefix}:${normalizedUserId}` : null;
}

async function readTutorialLocalFlag(prefix, userId) {
  const key = buildTutorialLocalFlagKey(prefix, userId);
  if (!key) return false;

  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === "true";
  } catch (e) {
    console.warn("TutorialContext: failed to read local tutorial flag", e);
    return false;
  }
}

async function writeTutorialLocalFlags(userId, values = {}) {
  const completedKey = buildTutorialLocalFlagKey(
    TUTORIAL_COMPLETED_STORAGE_PREFIX,
    userId
  );
  const skippedKey = buildTutorialLocalFlagKey(
    TUTORIAL_SKIPPED_STORAGE_PREFIX,
    userId
  );
  const writes = [];

  if (completedKey && typeof values.completed === "boolean") {
    writes.push(AsyncStorage.setItem(completedKey, values.completed ? "true" : "false"));
  }
  if (skippedKey && typeof values.skipped === "boolean") {
    writes.push(AsyncStorage.setItem(skippedKey, values.skipped ? "true" : "false"));
  }

  if (!writes.length) return;

  try {
    await Promise.all(writes);
  } catch (e) {
    console.warn("TutorialContext: failed to write local tutorial flags", e);
  }
}

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
  tutorialCompletionInProgress: false,
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
  const [tutorialCompletionInProgress, setTutorialCompletionInProgress] = useState(
    INITIAL_TUTORIAL_STATE.tutorialCompletionInProgress
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
      setTutorialCompletionInProgress(false);
      return () => {
        cancelled = true;
      };
    }

    setTutorialFlagsLoaded(false);

    (async () => {
      const userId = session?.user?.id ?? null;
      if (!userId) {
        if (!cancelled) {
          setTutorialCompleted(false);
          setTutorialSkipped(false);
          setTutorialFlagsLoaded(true);
        }
        return;
      }

      const [localCompleted, localSkipped] = await Promise.all([
        readTutorialLocalFlag(TUTORIAL_COMPLETED_STORAGE_PREFIX, userId),
        readTutorialLocalFlag(TUTORIAL_SKIPPED_STORAGE_PREFIX, userId),
      ]);

      let remoteCompleted = false;
      let remoteSkipped = false;
      let remoteLoaded = false;

      try {
        const json = await getAccountProfileMe();
        remoteCompleted = json?.tutorial_completed === true;
        remoteSkipped = json?.tutorial_skipped === true;
        remoteLoaded = true;
      } catch (e) {
        console.warn("TutorialContext: failed to load tutorial flags", e);
      }

      const nextCompleted = localCompleted || remoteCompleted;
      const nextSkipped = !nextCompleted && (localSkipped || remoteSkipped);

      if (!cancelled) {
        setTutorialCompleted(nextCompleted);
        setTutorialSkipped(nextSkipped);
        setTutorialFlagsLoaded(true);
      }

      if (remoteLoaded) {
        if (remoteCompleted && !localCompleted) {
          await writeTutorialLocalFlags(userId, { completed: true, skipped: false });
        } else if (remoteSkipped && !localSkipped && !nextCompleted) {
          await writeTutorialLocalFlags(userId, { skipped: true });
        } else if (localCompleted && !remoteCompleted) {
          void syncTutorialFlagsToProfile({
            tutorial_completed: true,
            tutorial_skipped: false,
            tutorial_completed_at: new Date().toISOString(),
          });
        } else if (localSkipped && !remoteSkipped && !nextCompleted) {
          void syncTutorialFlagsToProfile({
            tutorial_completed: false,
            tutorial_skipped: true,
            tutorial_completed_at: null,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, recoveryMode, syncTutorialFlagsToProfile]);

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
    setTutorialSkipped(false);
    clearTutorialData();
    setTutorialPieces(cloneTutorialPieceItems(TUTORIAL_PIECES));
    return true;
  }, [clearTutorialData]);

  const endTutorial = useCallback(async () => {
    const userId = session?.user?.id ?? null;
    const completedAt = new Date().toISOString();
    const payload = {
      tutorial_completed: true,
      tutorial_skipped: false,
      tutorial_completed_at: completedAt,
    };

    setTutorialCompletionInProgress(true);
    try {
      await writeTutorialLocalFlags(userId, { completed: true, skipped: false });
      setTutorialCompleted(true);
      setTutorialSkipped(false);
      clearTutorialData();
      setTutorialResetToken((prev) => prev + 1);
      setIsTutorialMode(false);
    } finally {
      setTutorialCompletionInProgress(false);
    }

    void syncTutorialFlagsToProfile(payload).then((synced) => {
      if (!synced) {
        console.warn("TutorialContext: failed to sync tutorial completion flags");
      }
    });
  }, [clearTutorialData, session?.user?.id, syncTutorialFlagsToProfile]);

  const skipTutorial = useCallback(async () => {
    const userId = session?.user?.id ?? null;
    const payload = {
      tutorial_completed: false,
      tutorial_skipped: true,
      tutorial_completed_at: null,
    };

    setIsTutorialMode(false);
    setTutorialCompleted(false);
    setTutorialSkipped(true);
    clearTutorialData();
    setTutorialResetToken((prev) => prev + 1);
    await writeTutorialLocalFlags(userId, { completed: false, skipped: true });
    void syncTutorialFlagsToProfile(payload);
  }, [clearTutorialData, session?.user?.id, syncTutorialFlagsToProfile]);

  const resetTutorial = useCallback(() => {
    setIsTutorialMode(INITIAL_TUTORIAL_STATE.isTutorialMode);
    setTutorialCompletionInProgress(INITIAL_TUTORIAL_STATE.tutorialCompletionInProgress);
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
      tutorialCompletionInProgress,
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
      tutorialCompletionInProgress,
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
