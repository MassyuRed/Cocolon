---
title: "02A_Cocolon_国家システム資料_Input_Save_Dispatch系"
revision_date: "2026-04-30"
---

# 02A. Input / Save / Dispatch系

この章では入力 gate、save API、Home gateway、dispatch、immediate reply、Home read-write 境界を扱う。

## A1. RN input gates / Home orchestration

### `Cocolon/features/home/useHomeActions.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN feature hook module. Current system: Home orchestration hook.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/features/home/useHomeState.js` — import
  - `Cocolon/lib/api/home/noticeApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/home/noticeApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `Cocolon/screens/InputScreen.js`

### `Cocolon/features/home/useHomeState.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN feature hook module. Current system: Home orchestration hook.
- 上流:
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/AppRuntimeContext.js` — import
  - `Cocolon/lib/api/home/homeStateApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/AppRuntimeContext.js`
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/lib/api/home/homeStateApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `Cocolon/screens/InputScreen.js`

### `Cocolon/screens/DeepInsightScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Analysis input surface.
- 上流:
  - なし
- 下流:
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/InputCountRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Home / input surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_count
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`

### `Cocolon/screens/InputLengthRankingScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Home / input surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_length
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`

### `Cocolon/screens/InputScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Home / input surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/CocolonSwitch.js` — import
  - `Cocolon/components/EmotionReflectionPreviewModal.js` — import
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/components/TodayQuestionModal.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/components/TutorialStartModal.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/features/home/useHomeState.js` — import
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — import
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/CocolonSwitch.js`
  - `Cocolon/components/EmotionReflectionPreviewModal.js`
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/components/TodayQuestionModal.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/components/TutorialStartModal.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/NoticeHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: RN screen module. Current system: Home / input surface.
- 上流:
  - `Cocolon/App.js` — import
- 下流:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/lib/noticeApi.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/lib/noticeApi.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/screens/TodayQuestionHistoryScreen.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN screen module. Current system: Home / input surface.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 下流:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/todayQuestionApi.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/todayQuestionApi.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`


## A2. RN Home shared save/read UI

### `Cocolon/components/EmotionReflectionPreviewModal.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Home shared UI.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`

### `Cocolon/components/NoticeModal.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Home shared UI.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/lib/noticeActionRuntime.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`

### `Cocolon/components/NoticeRichText.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Home shared UI.
- 上流:
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 下流:
  - `Cocolon/lib/noticeActionRuntime.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/lib/noticeActionRuntime.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`

### `Cocolon/components/TodayQuestionCard.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Home shared UI.
- 上流:
  - `Cocolon/components/TodayQuestionModal.js` — import
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TodayQuestionModal.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`

### `Cocolon/components/TodayQuestionModal.js`
- repo: `Cocolon`
- 国家システム区分: `Gate`
- 現行状態: `shared`
- 国家システム上の役割: RN shared component module. Current system: Home shared UI.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/components/TodayQuestionCard.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/TodayQuestionCard.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/theme/ThemeContext.js`


## A3. Frontend Home boundary / endpoint callers

### `Cocolon/lib/api/client.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: frontend API boundary.
- 上流:
  - `Cocolon/lib/api/account/profileApi.js` — import
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — import
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — import
  - `Cocolon/lib/api/home/homeStateApi.js` — import
  - `Cocolon/lib/api/home/noticeApi.js` — import
  - `Cocolon/lib/api/home/todayQuestionApi.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/account/profileApi.js`
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `Cocolon/lib/api/home/homeStateApi.js`
  - `Cocolon/lib/api/home/noticeApi.js`
  - `Cocolon/lib/api/home/todayQuestionApi.js`

### `Cocolon/lib/api/home/emotionReflectionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper for /emotion/reflection/cancel, /emotion/reflection/preview, /emotion/reflection/publish, /emotion/reflection/quota.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/cancel
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/preview
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/publish
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — endpoint /emotion/reflection/quota
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/client.js`
  - `Cocolon/screens/InputScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`

### `Cocolon/lib/api/home/emotionSubmitApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper for /emotion/submit.
- 上流:
  - `Cocolon/screens/InputScreen.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — endpoint /emotion/submit
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/client.js`
  - `Cocolon/screens/InputScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`

### `Cocolon/lib/api/home/homeStateApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper. Current system: Home API client wrapper.
- 上流:
  - `Cocolon/features/home/useHomeState.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/client.js`

### `Cocolon/lib/api/home/noticeApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper for /notices/popup-seen, /notices/read.
- 上流:
  - `Cocolon/features/home/useHomeActions.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — endpoint /notices/popup-seen
  - `mashos-api/ai/services/ai_inference/api_notice.py` — endpoint /notices/read
- 落とすと漏れる関連ファイル:
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/lib/api/client.js`
  - `mashos-api/ai/services/ai_inference/api_notice.py`

### `Cocolon/lib/api/home/todayQuestionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend API wrapper for /today-question/answers, /today-question/settings.
- 上流:
  - `Cocolon/features/home/useHomeActions.js` — import
  - `Cocolon/features/home/useHomeState.js` — import
- 下流:
  - `Cocolon/lib/api/client.js` — import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — endpoint /today-question/answers
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — endpoint /today-question/settings
- 落とすと漏れる関連ファイル:
  - `Cocolon/features/home/useHomeActions.js`
  - `Cocolon/features/home/useHomeState.js`
  - `Cocolon/lib/api/client.js`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`

### `Cocolon/lib/apiClient.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Frontend helper / boundary module. Current system: frontend API boundary.
- 上流:
  - `Cocolon/App.js` — import
  - `Cocolon/lib/nexusApi.js` — import
  - `Cocolon/lib/reportDistributionApi.js` — import
  - `Cocolon/lib/subscriptionApi.js` — import
  - `Cocolon/screens/AccountScreen.js` — import
  - `Cocolon/screens/DeepInsightScreen.js` — import
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/EmotionLogScreen.js` — import
  - `Cocolon/screens/EmotionRankingScreen.js` — import
  - `Cocolon/screens/FollowListScreen.js` — import
  - `Cocolon/screens/InputCountRankingScreen.js` — import
  - `Cocolon/screens/InputLengthRankingScreen.js` — import
  - `Cocolon/screens/LoginStreakRankingScreen.js` — import
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — import
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — import
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — import
  - `Cocolon/screens/MyModelReflectionsScreen.js` — import
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/MyWebEnsureClient.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/ProfileCreateScreen.js` — import
  - `Cocolon/screens/RankingTopScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
  - `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` — document reference
- 下流:
  - `Cocolon/lib/supabase.ts` — import
- 落とすと漏れる関連ファイル:
  - `Cocolon/App.js`
  - `Cocolon/lib/nexusApi.js`
  - `Cocolon/lib/reportDistributionApi.js`
  - `Cocolon/lib/subscriptionApi.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/DeepInsightScreen.js`
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/EmotionLogScreen.js`
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/MyModelReflectionsScreen.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/MyWebEnsureClient.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/ProfileCreateScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md`

### `Cocolon/lib/emotionReflectionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `Cocolon/lib/inputDraftStorage.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: Home local runtime helper.
- 上流:
  - `Cocolon/lib/accountLocalCleanup.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/accountLocalCleanup.js`

### `Cocolon/lib/noticeActionRuntime.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `shared`
- 国家システム上の役割: Frontend helper / boundary module. Current system: Home local runtime helper.
- 上流:
  - `Cocolon/components/NoticeModal.js` — import
  - `Cocolon/components/NoticeRichText.js` — import
  - `Cocolon/screens/InputScreen.js` — import
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/NoticeModal.js`
  - `Cocolon/components/NoticeRichText.js`
  - `Cocolon/screens/InputScreen.js`
  - `Cocolon/screens/NoticeHistoryScreen.js`

### `Cocolon/lib/noticeApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 上流:
  - `Cocolon/screens/NoticeHistoryScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/NoticeHistoryScreen.js`

### `Cocolon/lib/todayQuestionApi.js`
- repo: `Cocolon`
- 国家システム区分: `Boundary`
- 現行状態: `legacy-live`
- 国家システム上の役割: Frontend helper / boundary module. Current system: frontend compat API wrapper.
- 上流:
  - `Cocolon/screens/MyWebScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`


## A4. Save / Home public API adapters

### `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `legacy-live`
- 国家システム上の役割: New Reflection flow driven by the current emotion input only.
- 上流:
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/cancel
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/preview
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/publish
  - `Cocolon/lib/api/home/emotionReflectionApi.js` — endpoint /emotion/reflection/quota
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/home/emotionReflectionApi.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`

### `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `legacy-live`
- 国家システム上の役割: Emotion Submit API for Cocolon
- 上流:
  - `Cocolon/lib/api/home/emotionSubmitApi.js` — endpoint /emotion/submit
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py` — from import
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py` — from import
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py` — from import
  - `mashos-api/ai/services/ai_inference/api_subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/cron_run_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/home/emotionSubmitApi.js`
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_app_bootstrap.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_report_distribution_settings.py`
  - `mashos-api/ai/services/ai_inference/api_subscription.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/cron_run_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_auth_token_cache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`

### `mashos-api/ai/services/ai_inference/api_global_summary.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `legacy-live`
- 国家システム上の役割: Global Summary API
- 上流:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`

### `mashos-api/ai/services/ai_inference/api_home_state.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /home/state
- 上流:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`

### `mashos-api/ai/services/ai_inference/api_input_summary.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `legacy-live`
- 国家システム上の役割: FastAPI route module for GET /input/summary
- 上流:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/api_notice.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /notices/current, GET /notices/history, POST /notices/read, POST /notices/popup-seen
- 上流:
  - `Cocolon/lib/api/home/noticeApi.js` — endpoint /notices/popup-seen
  - `Cocolon/lib/api/home/noticeApi.js` — endpoint /notices/read
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/tests/contract/test_notice_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/home/noticeApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/tests/contract/test_notice_contracts.py`

### `mashos-api/ai/services/ai_inference/api_profile_create.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `legacy-live`
- 国家システム上の役割: ProfileCreate API
- 上流:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/mymodel_entitlements.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`

### `mashos-api/ai/services/ai_inference/api_today_question.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: FastAPI route module for GET /today-question/current, GET /today-question/status, POST /today-question/answers, GET /today-question/history, PATCH /today-question/history/{answer_id}, GET /today-question/settings, PATCH /today-question/settings, POST /cron/today-question/push
- 上流:
  - `Cocolon/lib/api/home/todayQuestionApi.js` — endpoint /today-question/answers
  - `Cocolon/lib/api/home/todayQuestionApi.js` — endpoint /today-question/settings
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/active_users_store.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `Cocolon/lib/api/home/todayQuestionApi.js`
  - `mashos-api/ai/services/ai_inference/active_users_store.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`


## A5. Dispatch planner / Home gateway

### `mashos-api/ai/services/ai_inference/home_gateway/__init__.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home write gateway for the national system.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/home_gateway/cache_invalidator.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: cache invalidator.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`

### `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: command gateway.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`

### `mashos-api/ai/services/ai_inference/home_gateway/command_types.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: command types.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/home_gateway/dispatch_planner.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: dispatch planner.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: emotion reflection publish service.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`

### `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `legacy-live`
- 国家システム上の役割: Home gateway runtime module. Current role: emotion submit service.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`

### `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: notice command service.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/notice_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/notice_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`

### `mashos-api/ai/services/ai_inference/home_gateway/read_model_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: read model service.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_home_state.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_home_state.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`

### `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Home gateway runtime module. Current role: today question command service.
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`


## A6. Immediate reply / EmlisAI path

### `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_bootstrap_store.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/test_emlis_ai_greeting_state_store.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_prompt.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - なし
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - なし

### `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_observation_kernel.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_style_profile_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
  - `mashos-api/ai/tests/test_emlis_ai_observation_kernel.py`
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/test_emlis_ai_user_model_store.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_world_model_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: Backend support module. Current system: EmlisAI / immediate reply runtime.
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`

### `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `legacy-live`
- 国家システム上の役割: Shared helpers for emotion persistence flows.
- 上流:
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py` — import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_submit_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_emlis_ai_contracts.py`

### `mashos-api/ai/services/ai_inference/input_feedback_text_templates.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `shared`
- 国家システム上の役割: 感情入力直後コメント（input_feedback.comment_text）の文面テンプレ管理と
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`


## A7. Home persistence / input stores

### `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `active`
- 国家システム上の役割: Deterministic preview generator for the new emotion-generated Reflection flow.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`

### `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: Store helpers for the new emotion-generated Reflection flow.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_reflection.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`

### `mashos-api/ai/services/ai_inference/notice_store.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - `mashos-api/ai/services/ai_inference/api_notice.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py` — from import
  - `mashos-api/ai/tests/contract/test_notice_contracts.py` — import
- 下流:
  - `mashos-api/ai/services/ai_inference/client_compat.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_notice.py`
  - `mashos-api/ai/services/ai_inference/client_compat.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/notice_command_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_notice_contracts.py`

### `mashos-api/ai/services/ai_inference/today_question_store.py`
- repo: `mashos-api`
- 国家システム区分: `Save`
- 現行状態: `shared`
- 国家システム上の役割: Backend support module. Current system: backend support / misc.
- 上流:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`


## A8. 2026-04-22 差分更新 (EmlisAI reader boundary)

### 差分更新: `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: EmlisAI SourceBundle builder。route module ではなく `emlis_ai_readers.py` から canonical read payload を受ける。
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/ai_inference/today_question_store.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_greeting_state_store.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_types.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_user_model_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_history_search_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/ai_inference/today_question_store.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: EmlisAI 用の meaning-layer read adapter。input summary と Analysis summary artifact を route 非依存で引き渡す。
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/analysis_summary_reader.py` — from import
  - `mashos-api/ai/services/ai_inference/input_summary_reader.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/input_summary_reader.py`

### `mashos-api/ai/services/ai_inference/input_summary_reader.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: canonical input summary snapshot を route file 非依存で読む reader。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

### `mashos-api/ai/services/ai_inference/analysis_summary_reader.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch`
- 現行状態: `active`
- 国家システム上の役割: MyWeb home summary artifact を read-side owner 契約で読む reader。EmlisAI immediate reply と Analysis read の共通部。
- 上流:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py` — from import
- 下流:
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_readers.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`

# 2026-04-25 差分追記: Input / Save / Dispatch current補正

- Home / emotion input の current preview は EmotionPiece です。RN側は `EmotionPiecePreviewModal.js` / `emotionPieceApi.js`、backend側は `api_emotion_piece.py` / `emotion_piece_generation_service.py` / `emotion_piece_store.py` を見ること。
- 旧 `emotion_reflection_*` / `api_emotion_reflection.py` は compat façade / legacy path として残っており、DB/contract retirement 前に削除しません。

# 2026-04-28 差分追記: Input / Save / Dispatch / Gate補正

## 三大中核構造のDispatch定義

国家システム上、三大中核構造は `core_contract_registry.py` で固定された `EmlisAI構造`、`分析構造`、`Piece構造` である。

- `EmlisAI構造`: `POST /emotion/submit` 保存直後の即時応答とquality gate
- `分析構造`: analysis / self-structure report生成とvalidity gate
- `Piece構造`: emotion piece preview / publish とsafety policy

## 新規国家システム file block

### `mashos-api/ai/services/ai_inference/core_contract_registry.py`
- repo: `mashos-api`
- 国家システム区分: `Dispatch / Contract`
- 現行状態: `active`
- 国家システム上の役割: 三大中核構造のinput_owner、output_owner、primary_route、storage_owner、quality_gate、safety_gate、publish_policyを固定する。
- 上流:
  - なし
- 下流:
  - `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
  - `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
  - `mashos-api/ai/services/ai_inference/piece_generation_policy.py`

### `mashos-api/ai/services/ai_inference/emlis_ai_quality_gate.py`
- repo: `mashos-api`
- 国家システム区分: `Gate`
- 現行状態: `active`
- 国家システム上の役割: EmlisAI immediate reply の履歴利用、証拠充足、診断/断定抑制、長文化抑制を判定する。
- 上流:
  - `mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py`
- 下流:
  - なし
- 落とすと漏れる関連ファイル:
  - `mashos-api/ai/services/ai_inference/emlis_ai_capability.py`
  - `mashos-api/ai/services/ai_inference/emotion_submit_service.py`
  - `mashos-api/ai/tests/contract/test_new_national_core_emlis_contracts.py`

### `mashos-api/ai/services/ai_inference/piece_generation_policy.py`
- repo: `mashos-api`
- 国家システム区分: `Gate / Publish`
- 現行状態: `active`
- 国家システム上の役割: Piece preview前に公開安全性・変換モード・status・hashを固定し、publish時に本文を再生成しない契約を支える。
- 上流:
  - `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_piece_store.py`
- 下流:
  - `mashos-api/ai/services/ai_inference/api_emotion_piece.py`
- 落とすと漏れる関連ファイル:
  - `Cocolon/components/EmotionPiecePreviewModal.js`
  - `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`

## 既存 file の差分

- `mashos-api/ai/services/ai_inference/api_emotion_submit.py` は Input hot pathでの直接FCM送信を避け、`fcm_push_queue.py` へenqueueする。
- `mashos-api/ai/services/ai_inference/emotion_submit_service.py` は EmlisAI応答にtimeout budgetを持ち、遅延時はfallback commentへ逃がす。
- `mashos-api/ai/services/ai_inference/api_emotion_piece.py` は `piece_text` を正式出力にし、`reflection_text` を互換として残す。
