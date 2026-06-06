---
title: "02A_Cocolon_国家システム資料_Input_Save_Dispatch系"
revision_date: "2026-06-06"
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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

# 2026-05-05 差分追記: Input Save直後のEmlisAI current path

`InputScreen.js -> /emotion/submit -> emotion_submit_service.py` の後、EmlisAI immediate reply は `input_feedback.comment_text` として返る。

現行EmlisAIは、保存完了通知ではなく、現在入力を材料にした即時理解応答である。処理は次の境界で分ける。

| 工程 | owner | 役割 |
|---|---|---|
| 入力材料 | `emotion_submit_service.py` | `memo` / `memo_action` / `emotion_details` / category を current input として渡す |
| context | `emlis_ai_context_service.py` | tierに応じたhistory / summary / user model material を束ねる |
| 読解 | `emlis_ai_user_word_anchor_service.py` / `emlis_ai_phrase_shaping_service.py` | raw入力からanchorを取り、会話文に使えるphraseへ整形する |
| 意味分解 | `emlis_ai_input_meaning_block_service.py` / `emlis_ai_understanding_frame_service.py` | 汎用意味カテゴリ、意味ブロック、理解frameへ変換する |
| 構成 | `emlis_ai_response_composition_service.py` | 長文入力では、入口 / 背景 / 緊張・限界 / 気づき / 新しい向き / 安心文を組む |
| 生成 | `emlis_ai_observation_kernel.py` | composition orderとmeaning blockからreply line候補を作る |
| 確定 | `emlis_ai_reply_service.py` | render / final review / quality gate / safe fallback / meta付与を行う |

`api_emotion_submit.py` のpublic response contractは、`input_feedback.comment_text` を維持し、`input_feedback.emlis_ai` はadditive metaとして拡張する。


# 2026-05-07 差分追記: Input -> immediate reply value observation flow

国家システム上、value observationは `Input Gate -> Save API -> immediate reply` の中で、保存直後のEmlisAI返答とPiece previewの品質を補助するadditive layerとして読む。

```text
current_input
  -> emlis_ai_user_word_anchor_service / emlis_ai_input_meaning_block_service
  -> cocolon_value_observation_service
  -> emlis_ai_world_model_service / emlis_ai_observation_kernel
  -> emlis_ai_reply_service -> input_feedback.emlis_ai.meta.value_observation

emotion_piece preview
  -> cocolon_value_observation_service
  -> emotion_piece_generation_service
  -> piece_generation_policy -> piece_core / policy meta
```

value observation signalは、保存APIやDB write pathを変更しない。返答・preview・分析validityのmetaをadditiveに補強するだけであり、public response shapeを破壊しない。


# 2026-05-09 差分追記: Today Question input/save/dispatch flow

| file | input/save/dispatch上の役割 |
|---|---|
| `mashos-api/ai/services/ai_inference/today_question_personal_candidate_service.py` | emotion入力の `memo` / `memo_action` を読み、短いliteral anchorを候補化する。重い内容や危険な内容はpersonal候補から除外する |
| `mashos-api/ai/services/ai_inference/today_question_personal_question_service.py` | candidateをquestion insert payloadへ変換し、choices snapshot と source_anchor_json を保存可能にする |
| `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` | Home gateway経由の回答保存で personal guard fields を受け渡す |
| `mashos-api/ai/services/ai_inference/home_gateway/command_gateway.py` | `today_question.answer.create` payloadから `question_origin` / `personal_question_id` / `source_anchor_hash` をstoreへ渡す |
| `Cocolon/features/home/useHomeActions.js` | RN側回答payloadに personal guard fields を入れる |

personal回答は既存answer保存の拡張です。`today_question_answers.question_id` はpersonal回答ではnullを許容し、`personal_question_id` と `source_anchor_snapshot_json` で根拠を固定します。


# 2026-05-09 実ファイル再照合: current owner補正

この表は `Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と、この資料内の current 参照を照合した補正です。
旧本文内の `active` / `shared` / `legacy-live` 表記よりも、この表を優先します。旧名称はDB physical name / compat / 旧route説明として保管できるが、current実ファイルownerとしては扱いません。

| 旧参照path | 実ファイル照合 | current owner / 読み方 |
|---|---|---|
| `Cocolon/components/EmotionReflectionPreviewModal.js` | local snapshot未収録 | Cocolon/components/EmotionPiecePreviewModal.js |
| `Cocolon/lib/api/home/emotionReflectionApi.js` | local snapshot未収録 | Cocolon/lib/api/home/emotionPieceApi.js |
| `Cocolon/lib/emotionReflectionApi.js` | local snapshot未収録 | Cocolon/lib/api/home/emotionPieceApi.js。root legacy façadeは今回local snapshotには存在しない。 |
| `Cocolon/screens/DeepInsightScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js / Cocolon/screens/AnalysisContentFirstScreen.js。DeepInsight単独screenは今回local snapshotには存在しない。 |
| `Cocolon/screens/EchoesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js |
| `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Discoveries screenは存在しない。RankingTop / PieceResonanceRanking / backend ranking viewsを優先する。 |
| `Cocolon/screens/MyModelEchoesRankingScreen.js` | local snapshot未収録 | Cocolon/screens/PieceResonanceRankingScreen.js |
| `Cocolon/screens/MyModelQuestionsRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Questions screenは存在しない。RankingTop / InputCountRanking / InputLengthRanking / PieceResonanceRankingを優先する。 |
| `Cocolon/screens/MyModelReflectionsScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyModelScreen.js` | local snapshot未収録 | Cocolon/screens/PieceScreen.js / Cocolon/screens/PieceEntryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyWebEnsureClient.js` | local snapshot未収録 | Cocolon/screens/AnalysisEnsureClient.js |
| `Cocolon/screens/MyWebHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisHistoryScreen.js |
| `Cocolon/screens/MyWebReportHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportHistoryScreen.js |
| `Cocolon/screens/MyWebReportViewerScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportViewerScreen.js |
| `Cocolon/screens/MyWebScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js |

# 2026-05-09 差分追記: Input entry shell分割後のInput / Save境界

`InputScreen.js` はentry shellとして残り、Input UI / helper / hook は `screens/input/*` に分割されています。これはRN display / local state / modal制御の分離であり、Input Save APIやdispatch契約は変更しません。

| split file | 国家システム上の読み方 |
|---|---|
| `screens/input/useInputDraftPersistence.js` | 未送信下書きの端末内local state。Save APIとは別境界 |
| `screens/input/InputActionArea.js` | emotion submit / Piece preview / notification action UI。API payload shapeは変更しない |
| `screens/input/InputPiecePreviewController.js` | EmotionPiecePreviewModal接続。preview / publish API契約は変更しない |
| `screens/input/InputStartupModals.js` | Notice / Today Question / draft restore modal表示。startup/read-side契約は変更しない |
| `screens/input/InputFeedbackReplyModal.js` | EmlisAI immediate replyの表示。`input_feedback.comment_text` の意味は変更しない |

Input関連を触る場合は、`features/home/useHomeState.js` / `features/home/useHomeActions.js` と `lib/api/home/*` を引き続き同時確認します。

# 2026-05-09 差分追記: Emlisの観測 multi-perspective current path

`InputScreen.js -> /emotion/submit -> emotion_submit_service.py` の後、EmlisAI immediate replyは `Emlisの観測` として扱う。最新実ファイルでは、保存直後に `emlis_ai_reply_service.render_emlis_ai_reply()` が次の順序で動く。

| 段階 | owner | 国家システム上の役割 |
|---|---|---|
| source bundle | `emlis_ai_context_service.py` | current input / display_name / capability / historyを束ねる |
| evidence | `emlis_ai_evidence_ledger_service.py` | 原文根拠を `EvidenceSpan` として台帳化する |
| observers | `emlis_ai_perspective_observers.py` | 明示内容、感情、葛藤、圧迫、限界、自己認識、価値、相手モデル、安全境界を分離観測する |
| board | `emlis_ai_perspective_board.py` | `PerspectiveReport` を集約する |
| graph | `emlis_ai_observation_integrator_service.py` | `ObservationGraph` へ統合する |
| composer | `emlis_ai_conversation_composer_service.py` | 観測構造から会話文を作る |
| judges | `emlis_ai_listener_reader_judge.py` / `emlis_ai_grounding_judge.py` / `emlis_ai_template_echo_guard.py` | 読解可能性・根拠・テンプレ/復唱を判定する |
| display | `emlis_ai_display_gate.py` | `passed` 以外は `comment_text` を空にする |

`emotion_submit_service.py` はEmlis観測生成がtimeout/errorになった場合も固定文fallbackを出さず、`observation_status=unavailable` と `rejection_reasons=["emlis_ai_timeout_or_error"]` をmetaに入れて `comment_text` を空にする。保存処理と観測表示可否は分離する。

RN側では `InputScreen.js` が `input_feedback.emlis_ai.observation_status` を `useInputFeedbackModal.js` へ渡す。`useInputFeedbackModal.js` と `InputFeedbackReplyModal.js` は、`passed` 以外のstatusや空本文を表示しない。

# 2026-05-10 差分追記: Input Save後 Emlis観測 Phase8品質境界

`/emotion/submit` のsave / dispatch境界は変更しません。Phase8は、保存後に返る `input_feedback` の本文品質を backend 側で改善・判定する範囲です。

| 段階 | current owner | 役割 |
|---|---|---|
| current input保存 | `emotion_submit_service.py` | 感情入力を保存し、Emlis観測生成を試す。失敗しても保存成功を優先する |
| evidence作成 | `emlis_ai_evidence_ledger_service.py` | 実入力の根拠を保持し、Phase8 profile判定の材料にする |
| limited composer | `emlis_ai_limited_composer_client.py` | 根拠spanをPhraseUnitへ圧縮し、ObservationProfile / SentencePlanに変換する |
| Japanese coherence | `emlis_ai_limited_sentence_quality_guard.py` | 感情ラベルだけの行や未完了断片を落とす |

RN側は `InputFeedbackReplyModal.js` の表示条件を維持します。Phase8のためにユーザーへ追加操作や開発者操作を求めない。


# 2026-05-11 差分追記: Input後文章生成の共通Core接続

Input / Save / Dispatch系では、EmlisAI immediate reply と Piece preview が共通文章生成基盤へ接続されています。

- EmlisAI: `emlis_ai_limited_composer_client.py` が候補文を `EmlisObservationComposer` adapter経由で共通Coreへ通す。`emlis_ai_reply_service.py` はmetaをadditiveに残す。
- Piece: `emotion_piece_generation_service.py` が `evaluate_piece_composer` を呼び、共通Coreでrejectされた回答は空本文・blockedへfail-closedする。publish時再生成は行わない。
- RN側のInput screen / modal / routeは今回変更なし。

# 2026-05-15 差分追記: EmlisAI immediate reply Step15-20 dispatch境界

`/emotion/submit` 後のEmlisAI immediate replyでは、Step15-20がdispatch後の候補生成・Gate・meta集計にadditive接続されている。入力保存・emotion_log保存・Home gatewayのwrite pathは変更しない。

| file | 構造上の意味 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/stabilization.py` | Step15 共通Core安定化。CoreTextPayload / TextGenerationResult / Guard結果 / used_evidence_span_ids / quality_flags が共通形式かをmeta化し、中核別出力目的・public契約・DB名を共通Coreへ移さないことを確認する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_rollout_metrics_service.py` | Step16 段階リリース計測。attempted / passed / rejected / unavailable / safety_blocked / primary_reason / coverage_group / composer_model をdeveloper/QA metaへ集計する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_ap0_migration_decision_service.py` | Step18 A-P0移行判定。coverage matrix / rollout metrics / diagnostic_summary / Guard結果から、Step19へ進むかB案の戻り先Stepへ返すmetaを作る。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_a_plan_equivalent_composer_service.py` | Step19 A案相当Composer導入。A-P0 green時だけ `cocolon_emlis_observation_composer.a1.v1` へpromoteし、B案Gate / scoped graph / fail-closed / passed-onlyを維持する。 |
| `mashos-api/ai/services/ai_inference/emlis_ai_long_term_quality_service.py` | Step20 長期品質。previous output similarity、surface variation、history/cross core evidence-only、distance boundary、QA metricsをdeveloper/QA metaへ残す。 |

## dispatch上の読み方

- Step15はCommon Coreのshape確認であり、Emlisの出力責務をCommon Coreへ移さない。
- Step16はrelease gateとdiagnostic_summaryを計測化する。passed率だけではなく、rejected/unavailable/safety_blockedを残す。
- Step18は未達時に戻り先Stepを返す。Step19へ無条件進行しない。
- Step19はA-P0 greenとrollout条件がそろった時だけcomposer_modelをA案相当名へ切り替える。
- Step20は履歴/cross coreの過剰補完を検出する。履歴を「本心の補完」に使わない。

# 2026-05-15 差分追記: Input / immediate reply 限定Composer拡張 Step0-11

Input保存後のEmlisAI immediate replyは、保存APIやHome gatewayの契約を変えず、内部Composerの診断とGate traceだけを拡張しています。

| Step | 国家システム上の読み方 |
|---|---|
| 0-1 | 候補生成前に止まったのか、接続後にrejectionしたのかを `diagnostic_summary` で分ける。 |
| 2-3 | raw入力本文なしで、failed_stage / coverage_group / SentenceBinding有無を読む。 |
| 4-5 | 本文化前のPhraseUnit材料とrelation taxonomyを整え、入力専用テンプレにしない。 |
| 6-7 | Grounding / Display traceがbinding情報を持つが、Gate条件は緩めない。 |
| 8 | 限定Surface Realizerは文法部品を選ぶだけで、固定完成文を増やさない。 |
| 9-11 | scorecard、passed-only E2E契約、Exit Gateで完全Composer初期版へ進めるかを判定する。 |

禁止: save route、Home read/write、RN modal表示条件、DB write pathをこの差分で変更しない。

# 2026-05-16 差分追記: Input / immediate reply 完全Composer初期版 Commit1-13

Input保存後のEmlisAI immediate replyは、public route / response key を変更せず、内部でComplete Composer初期版の層を通せる状態になった。国家システム上は `Save -> Dispatch -> internal composer -> Display Gate -> RN passed-only display` の境界を維持する。

| 層 | current owner | 国家システム上の役割 |
|---|---|---|
| 入口判定 | `emlis_ai_ap0_migration_decision_service.py`, `emlis_ai_complete_composer_initial_meta.py` | 完全Composer初期版へ進めるかをAP0 reportとしてmeta化する。 |
| 材料化 | `emlis_ai_complete_material_service.py` | EvidenceSpan / PhraseUnitから本文化可能材料だけを作り、根拠不足をここで止める。 |
| Coverage選択 | `emlis_ai_complete_focus_selector.py` | 入力全部の要約ではなく、Emlisの観測として出す核を選ぶ。 |
| Relation保持 | `emlis_ai_complete_relation_graph_service.py` | relation_typeを本文生成前の制約として保持する。 |
| 文計画 | `emlis_ai_complete_sentence_planner.py` | 2〜5文のSentencePlan 2.0を生成する。 |
| 表層生成 | `emlis_ai_complete_surface_realizer.py` | 文法部品から自然文を組む。固定完成文テンプレは使わない。 |
| 根拠判定 | `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py` | sentence bindingに基づき、根拠・phrase・relationを判定する。 |
| 自己修復 | `emlis_ai_complete_self_repair_service.py` | Gate reasonに応じて最大2回だけ安全にrepairする。 |
| client統合 | `emlis_ai_complete_composer_client.py`, `emlis_ai_composer_client_registry.py` | AP0 green / rollout許可時のみComplete初期版clientを解決する。 |
| reply接続 | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_reply_service.py` | diagnostics / repair trace / scorecard eventをadditive接続する。 |

境界維持:
- DB physical name、既存API route、public response key、RN表示名 `Emlisの観測` は変更しない。
- `input_feedback.comment_text` は `observation_status=passed` かつ本文ありの場合だけ表示する。
- 外部AIレンタル、ローカルLLM、固定完成文テンプレ、入力専用テンプレは追加しない。
- raw user input を改善資料として要求しない。改善は diagnostic_summary / Gate reason / coverage / binding / repair trace / scorecard event で行う。
- これは完全Composer商品品質版ではなく、限定Composerの安全境界を土台にした完全Composer初期版のAlpha実装として読む。

# 2026-05-16 差分追記: Input / immediate reply 商品品質版接続 Step0-7

最新実ファイル `Cocolon_8(11).zip` / `mashos-api_8(16).zip` では、Input保存後 immediate reply の public flow は維持したまま、Complete Composer初期版の品質接続層が Step0-7 まで入っています。Cocolon側に変更はなく、mashos-api側で `15` 件追加・`18` 件変更があります。

| Step | immediate reply上の読み方 | owner |
|---|---|---|
| Step0 binding_used契約整理 | `binding_used` は存在ではなく使用を示す。pre-connectionはfalse、Grounding/Displayはbinding-aware時にtrueになり得る。 | `emlis_ai_display_gate.py`, `emlis_ai_reply_service.py`, `test_emlis_ai_gate_binding_contract_v2.py` |
| Step1 coverage suite拡張 | `short_daily` / `long_meaning_arc` / `conflict` / `recovery` / `pressure` / `desire_fear` / `relationship` をProduct Quality coverageとして集計する。 | `emlis_ai_complete_scorecard_service.py`, `emlis_ai_complete_focus_selector.py`, `emlis_ai_complete_sentence_planner.py` |
| Step2 Grounding強化 | unsupported、relation_not_expressed、phrase_unit_missing、weak_material、raw_echo、overclaimをsentence_id単位で渡す。 | `emlis_ai_complete_grounding_binding.py`, `emlis_ai_complete_grounding_service.py`, `emlis_ai_grounding_judge.py` |
| Step3 Surface variation強化 | connector / ending / surface_signature を持ち、Template/Echo Guardへ渡す。 | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_template_echo_guard.py` |
| Step4 Self-Repair強化 | `meaning_added=false` / `gate_relaxed=false` / evidence_ids_preserved / relation_ids_preservedをtraceへ残す。 | `emlis_ai_complete_self_repair_service.py` |
| Step5 Tone Engine | TonePolicyをSurface前制約として組み込み、diagnostic/advice/over-empathy/generic comfortをGuardする。 | `emlis_ai_complete_tone_policy.py`, `emlis_ai_complete_surface_realizer.py` |
| Step6 Scorecard / Blind QA | `ProductQualityScorecard`、machine metrics、Blind QA rubricをdiagnostic / multi_perspectiveへmeta-only接続する。 | `emlis_ai_complete_product_quality_scorecard_service.py`, `emlis_ai_reply_service.py` |
| Step7 Release ladder | Step6 scorecardから release ladder guard / criteria を作る。public releaseは適用しない。 | `emlis_ai_complete_release_ladder_service.py`, `emlis_ai_reply_service.py` |

この差分で保存API、DB write path、public route、response key、RN表示名、RN表示条件は変わらない。`comment_text` は引き続き `observation_status=passed` かつ本文ありの場合だけ表示される。

# 2026-05-17 差分追記: Input / immediate reply positive_recovery relation surface contract

`Cocolon_9(8).zip` / `mashos-api_9(8).zip` では、Input保存直後の `Emlisの観測` において、positive_recovery の Reader `relation_not_expressed` を内部relation contractで扱う差分が入っています。`/emotion/submit` の保存契約、Home gateway、DB write path、RN modal表示条件は変更しません。

| Step | Input / Dispatch上の読み方 | owner |
|---|---|---|
| Step0 baseline固定 | 非表示ケースを `stage=reader / primary_reason=relation_not_expressed / coverage_group=positive_recovery` としてfixture化する。 | `test_emlis_ai_positive_recovery_relation_baseline.py` |
| Step1 relation surface contract | Reader / Surface / Self-Repair の共有cue契約を追加する。 | `emlis_ai_relation_surface_contract.py`, `test_emlis_ai_relation_surface_contract.py` |
| Step2 Reader contract化 | recovery relation cueをReaderが検出する。generic cueだけではrecoveryを通さない。 | `emlis_ai_listener_reader_judge.py`, `test_emlis_ai_listener_reader_relation_surface_contract.py`, `test_emlis_ai_listener_reader_relation_not_over_relaxed.py` |
| Step3 Self-Repair marker | `relation_not_expressed` repairで、declared recovery relationだけを明示する。 | `emlis_ai_complete_self_repair_service.py`, `test_emlis_ai_complete_self_repair_positive_recovery_relation.py` |
| Step4 Surface整合 | recovery relation line / connector / surface_signatureをcontractへ整合する。 | `emlis_ai_complete_surface_realizer.py`, `test_emlis_ai_complete_surface_recovery_relation_line.py` |
| Step5 diagnostic接続 | `reader_relation_signal_*` / `self_repair_relation_marker_*` を `diagnostic_summary` へ残す。 | `emlis_ai_complete_reply_diagnostics_service.py`, `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py`, `emlis_ai_types.py` |
| Step6 E2E / regression | positive_recoveryでReader `relation_not_expressed` が消えること、Gateが緩まないことを固定する。 | `test_emlis_ai_complete_product_quality_positive_recovery_e2e.py` |
| Step7 log cleanup | 一時debug logを整理する。 | `emotion_submit_service.py`, `test_emlis_ai_step7_log_cleanup.py`, `Cocolon/screens/InputScreen.js` |

この差分でも、`input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけRNへ表示されます。


# 2026-05-17 差分追記: emotion_submit_service Observation Diagnostic Lockdown 接続

`mashos-api_9(9).zip` では、`emotion_submit_service.py` に Observation Diagnostic Lockdown のbackend一行診断が接続されています。これは保存・dispatch・DB write pathを変えるものではなく、`input_feedback_comment` / `input_feedback_meta` が確定した後に、opt-in時だけmeta-only logを出す変更です。

| owner | 読み方 |
|---|---|
| `_emlis_ai_observation_diagnostic_lockdown_log_enabled()` | `EMLIS_AI_OBSERVATION_DIAGNOSTIC_LOCKDOWN_LOG_ENABLED` / `COCOLON_EMLIS_OBSERVATION_DIAGNOSTIC_LOCKDOWN_LOG_ENABLED` / 旧Step7 debug flagを読む。通常時は診断行を出さない。 |
| `_log_emlis_ai_observation_diagnostic_lockdown(...)` | `build_observation_diagnostic_lockdown(...)` と `dump_observation_diagnostic(...)` を呼び、`emlis_observation_diagnostic_lockdown {json}` を1本出す。 |
| success path | `reply.comment_text` / `reply.meta` 確定後にbackend診断を出す。 |
| exception path | fail-closed後、`observation_status=unavailable` / `emlis_ai_timeout_or_error` metaでbackend診断を出す。 |

出してよいもの:
- `emotion_log_id`
- `created_at`
- `trace_id`
- `observation_status`
- `comment_text_length`
- `stage / primary_reason / secondary_reasons`
- `candidate / gate_results / self_repair / classification`

出してはいけないもの:
- raw input
- memo
- current_input
- public `comment_text` 本文
- candidate text / reply text / preview text

この差分では、`/emotion/submit` のpublic route、request payload、response key、DB physical name、保存成功時の返却構造は変更しません。

# 2026-05-17 差分追記: Input / immediate reply Reader Relation Surface repair接続

`mashos-api_9(10).zip` では、Input保存後の `Emlisの観測` について、Observation Diagnostic Lockdownで確定した Reader rejected 原因を backend の Reader / limited A1 repair で扱う差分が入っています。`/emotion/submit` の保存契約、request / response shape、DB write path、Home gateway、RN modal表示条件は変更しません。

| Step | Input / Dispatch上の読み方 | owner |
|---|---|---|
| Step0 failure再現 | `candidate_generated_but_reader_rejected` の再発条件をtestで固定する。 | `test_emlis_ai_listener_reader_addressee_contract.py`, `test_emlis_ai_limited_reader_repair.py`, `test_emlis_ai_a1_reader_relation_repair_e2e.py` |
| Step1 宛名契約 | `Mash様、Emlisです。` のような valid greeting をReaderが落とさない。敬称なしを広く通さない。 | `emlis_ai_listener_reader_judge.py` |
| Step2 expected relation | sentence binding / relation metaからsurface relation typeをReaderへ渡す。`conflict.e1` のようなedge idは渡さない。 | `emlis_ai_reply_service.py`, `test_emlis_ai_reply_service_expected_relation_types.py` |
| Step3 previous reason | limited/A1 payloadの `composition_contract.previous_rejection_reasons` を読む。 | `emlis_ai_limited_composer_client.py` |
| Step4 宛名repair | `addressee_not_clear` の場合だけ先頭宛名行をgreeting policyへ揃える。本文意味は増やさない。 | `test_emlis_ai_limited_addressee_repair.py` |
| Step5 relation marker | `relation_not_expressed` の場合だけ relation surface contract の markerを最小追加する。 | `test_emlis_ai_limited_reader_previous_rejection_reasons.py` |
| Step6 core hook | repair後も `_core_checked_response` と core evaluation / Gateを通す。落ちたら従来通り非表示。 | `test_emlis_ai_limited_reader_repair_core_hook.py` |
| Step7 diagnostic meta | `limited_reader_repair_attempted/applied` を本文なしで診断へ出す。 | `test_emlis_ai_limited_reader_repair_diagnostics.py` |
| Step8 test pass | EmlisAI関連全体を通すための import / retry reason / no-fallback regressionを固定する。 | `tests/conftest.py`, `emlis_ai_complete_composer_client.py`, `emlis_ai_reply_service.py` |

この差分でも、`input_feedback.comment_text` は public `observation_status=passed` かつ本文ありの場合だけRNへ表示されます。

# 2026-05-18 差分追記: Input / immediate reply ProductGate Measurement接続

`mashos-api_11(6).zip` の ProductGate Measurement Step0-10 は、`/emotion/submit` の保存処理そのものではなく、保存後のEmlisAI診断行を測定reportへ接続する差分です。`emotion_submit_service.py` のpublic response key、DB write path、RNへ渡す `input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は変更しません。

Input / Save / Dispatch上の読み方:
- backend診断行とRN frontend診断行が揃う場合だけ、表示確認済みとしてscorecardへ数える。
- backend診断行またはRN診断行が欠ける場合、`diagnostic_missing_or_not_captured` 系として扱い、原因層修正に進めない。
- local tool `emlis_observation_product_quality_measurement.py` はlog行を読むだけで、保存API・dispatch・DB・RNを変更しない。
- Exit Gateは「測定接続が成立した」ことの境界であり、Input表示率向上patchやProduct Gate releaseではない。

# 2026-05-20 差分追記: Input / immediate reply Runtime Surface Quality接続

`mashos-api_13(5).zip` の Runtime Surface Quality Step0-12 は、`/emotion/submit` の保存処理そのものではなく、保存後のEmlisAI reply runtimeとProductGate Measurement reportの後段に表示文品質の測定・分岐を接続する差分です。`emotion_submit_service.py` のpublic response key、DB write path、RNへ渡す `input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は変更しません。

Input / Save / Dispatch上の読み方:
- `runtime_surface_source_lock` は、表示文の由来をcomplete_initial / limited / a1_equivalent等で固定するmetaであり、保存APIのstatusではない。
- `surface_signature_id` は、本文を保存するfieldではなく、正規化key列から作る署名です。
- `coverage_group_missing` はmissing blockerとして残し、`short_daily` へ雑に流さない。
- `branch_resolver` は次に触る層を決めるだけで、`/emotion/submit` の表示条件を開かない。
- `runtime_surface_exit_gate` はhandoff-onlyであり、Input表示率向上patchやProduct Gate releaseではない。

# 2026-05-21 差分追記: Input / immediate reply Observation Reply接続

`mashos-api_16(2).zip` の EmlisAI 観測返答 Step0-14 は、`/emotion/submit` の保存処理そのものではなく、保存後の immediate reply に対して `eligible_observation` / `low_information_observation` branchを接続する差分です。`emotion_submit_service.py` のpublic response key、DB write path、RNへ渡す `input_feedback.comment_text` / `input_feedback.emlis_ai.observation_status` は変更しません。

低情報入力の扱い:

| 入力状態 | runtime branch | RN公開契約 |
|---|---|---|
| 現在入力から対象・状態・関係が取れる | `eligible_observation` | `observation_status=passed` + `comment_text` |
| 短文または長文でも対象・出来事・関係が曖昧 | `low_information_observation` | `observation_status=passed` + `comment_text` |
| safety boundary / infrastructure error / Phase7 rollout block / composer pre-connection rollout stop / 非修復AI-generated rejection | 既存 safety / error / fail-closed handling | Step10 repair対象外。`comment_text` を出さない |

低情報時は「応答しない」ではなく、現在見えている範囲の観測と、`unknown_slots` に応じた質問を返す。ただし、段階リリースやpre-connection gateで止まった経路は低情報ではなく実行不可境界として扱い、Step10 repairで `passed + comment_text` に変換しない。ユーザー辞書はFreeで使用せず、サブスクでも現在入力の出来事を断定する材料にはしない。

# 2026-05-21 差分追記: Input Save後 Emlis観測専用辞書 Phase0-5

`mashos-api_6(26).zip` では、Input Save後にEmlisAIへ渡る `current_input` を、Emlis観測専用辞書が読める内部入力束へ整理する層が追加されています。Save API自体、DB insert対象、public response key、RN display条件は変更しない。

| flow | owner | Input / Save / Dispatch上の読み方 |
|---|---|---|
| Save後 current_input | `emotion_submit_service.py` | 既存の `memo` / `memo_action` / `emotion_details` / `category` を保持したまま、EmlisAIへ渡す内部bundleを作る。 |
| 内部入力束 | `emlis_ai_current_input_bundle.py` | `memo -> thought_text`、`memo_action -> action_text`、`emotion_details -> emotions`、`category -> categories` へ正規化する。public payload renameではない。 |
| 構造辞書material | `emlis_ai_observation_structure_material_service.py` | 入力語・複数感情・複数カテゴリ・思考/行動ズレなどからentry / relation / unknown slotをtext-freeに抽出する。 |
| Gate / Composer接続 | `emlis_ai_observation_structure_connection_service.py` | `low_information_boundary_connected` / `overclaim_guard_connected` / `forbidden_inference_boundary_connected` をGate / Composer metaへ渡す。 |
| fixture | `tests/fixtures/emlis_ai_observation_structure_phase5_cases.py` | 低情報・状態と言葉の乖離・自己理解・カテゴリ重なりなどをInput bundle単位で検証する。 |

禁止: `memo` / `memo_action` / `emotion_details` / `category` の保存経路変更、`input_feedback.comment_text` key変更、低情報branchのpublic status追加、構造辞書による完成文直接生成。


# 2026-05-22 差分追記: Input Save後 Emlis観測専用辞書 ActionConversion / UnformedSelfInsight

`mashos-api_8(23).zip` では、Input Save後にEmlisAIへ渡る `current_input` を、ActionConversion / UnformedSelfInsight 用の構造観測辞書材料として読む差分が入っています。Save API自体、DB insert対象、public response key、RN display条件は変更しない。

| flow | owner | Input / Save / Dispatch上の読み方 |
|---|---|---|
| 構造辞書追加 | `config/emlis_observation_structure_dictionary.v1.json` | `言えなかった` / `合わせた` / `我慢した` / `わからない` のentryとrelationを内部辞書へ追加する。 |
| material抽出 | `emlis_ai_observation_structure_material_service.py` | 単語だけで見える範囲のentry / relation候補をtext-freeに抽出する。 |
| connection filter | `emlis_ai_observation_structure_connection_service.py` | memo / memo_action差分、閉じ方根拠、圧力根拠、負荷根拠がないrelationを強接続しない。 |
| meta-only contract | `test_emlis_ai_observation_structure_phase6_forbidden_inference_meta_contract.py` | raw input、public `comment_text`、完成返答文、辞書本文をmaterial / connection metaへ流さない。 |

禁止: `memo` / `memo_action` / `emotion_details` / `category` の保存経路変更、`input_feedback.comment_text` key変更、低情報branchのpublic status追加、構造辞書による完成文直接生成、Step10 rollout blockの表示化。


# 2026-05-24 差分追記: EmlisAI public feedback meta boundary / timeout recovery / low-information prompt / notification uuid boundary

Input Save / Dispatch系では、保存成功後のEmlisAI immediate responseに public feedback meta boundary が接続済みです。これは保存処理そのものの変更ではありません。

| flow | owner | Input / Save / Dispatch上の読み方 |
|---|---|---|
| EmlisAI internal reply | `emotion_submit_service.py` | `reply.meta` を `internal_input_feedback_meta` として受け、observation result / diagnostic lockdownにはinternal metaを渡す。 |
| public feedback meta | `emlis_ai_public_feedback_meta.py` | `build_public_emlis_input_feedback_meta(...)` でRN返却用metaだけを生成する。raw input、memo、evidence、graph、complete diagnostics、public comment本文は返さない。 |
| response inclusion | `api_emotion_submit.py`, `home_gateway/emotion_reflection_publish_service.py` | `should_include_public_input_feedback(...)` により、`comment_text` 非空 + `observation_status=passed` のみ `input_feedback` を返す。 |
| RN timeout handling | `emotionSubmitApi.js`, `InputScreen.js` | `/emotion/submit` timeoutは30000ms。timeout時は「入力の保存処理に失敗しました」と断定せず、Home再読込を一度試し、入力欄/draftを残す。 |
| low-information question | `emlis_ai_low_information_observation_composer.py`, `config/emlis_observation_dictionary.v1.json` | 低情報観測の質問文を `詳しく残せそうなら、〜残してみませんか。` 系にする。 |

禁止: 保存DBを切り替える、`memo` / `memo_action` / `emotion_details` / `category` の保存経路を変える、`input_feedback.comment_text` keyを変える、timeout時に自動再送する、public meta削減を理由にRN表示条件を緩める。


# 2026-05-24 差分追記: Input / immediate reply Visible Surface Acceptance QA接続

`mashos-api_9(16).zip` では、Input保存後の `Emlisの観測` について、Runtime Surface Pre-Return Gateの後段に Visible Surface Acceptance Gate が接続されています。これは `/emotion/submit` の保存処理そのものではなく、保存後のimmediate reply候補が `passed + comment_text` としてRNへ出てよいかを判定する表示前品質境界です。

| 国家システム区分 | owner | 変更後の読み方 |
|---|---|---|
| Gate | `emlis_ai_visible_surface_acceptance_gate.py` | RN中心感情と本文冒頭焦点のズレ、positive-only over-burden、visible malformed surfaceを評価する。 |
| Gate | `emlis_ai_runtime_surface_pre_return_gate.py` | `たりこと` を `malformed_nominalization_tari_fragment` として表示前に止める。 |
| Dispatch | `emlis_ai_reply_service.py` | candidate本文生成後にvisible gate reportを作り、本文/入力本文をmetaに入れない。 |
| Display | `emlis_ai_display_gate.py` | visible gate blockingを表示前fail-closed条件へ入れる。yellow/warnは表示停止しない。 |
| Repair | `emlis_ai_observation_display_repair_integration.py` | low-information repair候補にもvisible gateを通し、通らないものはappliedにしない。 |
| Composer | `emlis_ai_low_information_observation_composer.py` | low-information tone profileを作り、positive_onlyで負荷anchorがなければ重さ系をdefaultにしない。 |
| Boundary | `emlis_ai_public_feedback_meta.py` | visible gate summaryはpublic-safe subsetだけにし、blocking時は `input_feedback` を返さない。 |
| Contract / Test | `rn-screen-contracts.test.js` | RN表示条件が public `observation_status=passed` + `comment_text` non-emptyのままか確認する。 |

不変:

- Input保存APIのDB insert先とDB write pathは変えない。
- `/emotion/submit` route、request key、response keyは変えない。
- `input_feedback.comment_text` は互換keyとして保持する。
- visible gate failureを入力保存失敗errorとしてRNへ返さない。
- `Userさん` はaccount name由来なら問題対象外として扱う。


# 2026-05-25 差分追記: Input / immediate reply Product Visible Surface Reliability接続

`mashos-api_8(27).zip` では、Input保存後の `Emlisの観測` について、Visible Surface Acceptance Gateの後段に koto splice RED固定、relation skeleton修復、一回rerender、表示なし診断分類が接続されています。これは `/emotion/submit` の保存処理そのものではなく、保存後のimmediate reply候補が `passed + comment_text` としてRNへ返ってよいかを判定する表示前品質境界です。

| 国家システム区分 | owner | 変更後の読み方 |
|---|---|---|
| PhraseUnit / Limited Guard | `emlis_ai_phrase_unit_grammar_normalizer.py`, `emlis_ai_limited_sentence_quality_guard.py` | `取らなければこと` / `予感こと` / `ことこと` / 長い節のkoto attachmentをcandidate material段階で止める。 |
| Runtime Gate | `emlis_ai_runtime_surface_pre_return_gate.py`, `emlis_ai_complete_surface_quality_signature.py` | comment_text表面でもkoto splice codeを検出し、`rerender_shallow_v2` またはblockへ進める。 |
| Visible Gate | `emlis_ai_visible_surface_acceptance_gate.py` | C相当はred、B相当は `surface_relation_skeleton_major` / `analytic_register_leak` でrepair_requiredにする。 |
| Composer / Relation | `emlis_ai_limited_composer_client.py`, `emlis_ai_relation_surface_contract.py` | 義務・予定・予感・長いraw clauseを `phrase + こと` へ直結しない。 |
| Repair | `emlis_ai_bounded_repair_reroute.py`, `emlis_ai_reply_service.py` | Visible Gateの `rerender_surface` を一回だけ安全再表面化候補へ回す。 |
| Public / Diagnostic | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `emlis_ai_observation_diagnostic_lockdown.py` | `candidate_blocked_koto_splice` / `candidate_blocked_relation_skeleton` / `candidate_repair_attempted` 等を本文なしで分類する。 |
| RN Contract | `rn-screen-contracts.test.js` | diagnostic meta内のpassedやcandidate本文では表示せず、public `input_feedback.comment_text` + `observation_status=passed` のみ表示する。 |

禁止: 保存DBを切り替える、`input_feedback.comment_text` keyを変える、public metaへraw inputやcandidate本文を入れる、Gateを緩めて危険文を表示する、repair済みでない候補をpassedへ変換する。


# 2026-05-26 差分追記: Input保存後 immediate reply の ESO surface completion境界

Input / Save / Dispatch系では、今回の差分を保存処理変更として扱わない。`/emotion/submit` で入力が保存された後、EmlisAI immediate reply候補がpublic `input_feedback.comment_text` へ到達する前のbackend内部境界が増えたものとして読む。

```text
/emotion/submit save
→ render_emlis_ai_reply
→ conversation composer candidate
→ environment_state_output scope marker completion
→ runtime surface pre-return gate double check
→ public feedback meta sanitizer
→ passed + commentText の場合だけRN表示
```

`environment_state_output_scope_marker_missing` は、辞書不足やRN不具合ではなく、単一入力観測を示すscope markerがcandidate本文に無い表示surface契約違反として扱う。`schema_invalid` / `rejected` / `unavailable` の本文をRNへ救済表示しない。


# 2026-05-26 差分追記: Input / Save / Dispatch側のEmlisAI状態回答境界

Input / Save / Dispatch側では、Phase2-10によるRN入力UI・保存API・dispatch routeの変更はありません。差分は保存後に返すEmlisAI immediate responseの内部materialと表示前Gateに限定されます。

- `memo` / `memo_action` / `emotions` / `category` は、既存の入力材料として扱う。
- `emlis_state_answer_surface_contract` はpublic request keyではない。
- `human_follow_layer` / `ratio_policy` / `special_handling` / `metaphor_policy` はpublic response keyではない。
- low informationやGate block時に、metaだけでRN表示を開かない。
- `passed + comment_text` の既存表示条件を維持する。

禁止: 入力保存のためのDB write pathを変更する、RN表示条件を状態回答materialに寄せる、raw memo / memo_action / evidence textをpublic metaへ入れる、自己否定や怒りのspecial handlingを保存payload名として追加する。


# 2026-05-30 差分追記: Input / Save / Dispatch上のPhase18 EmlisAI商品品質境界

`/emotion/submit` の国家システム境界は、Phase18後も次のまま維持する。

```text
入力保存
  ↓
EmlisAI reply生成 / 表示判定
  ↓
public feedback sanitizer
  ↓
passed + comment_text non-empty の時だけ input_feedback
  ↓
RNは既存commentTextを表示
```

Phase18で追加されたE2Eは、低情報入力、Complete Initial generated-but-display-rejected、meta boundary、timeout recoveryをpublic response境界で固定する。表示なしケースでRN表示用feedbackを作らず、保存成功と表示fail-closedを分けることが重要である。

禁止: rejected / unavailable / timeoutのinternal metaをRN表示用feedbackとして返す、`observation_text` / `reception_text` を追加する、Phase18 metaだけで表示条件を開く。
# 2026-06-01 差分追記: Input / Save / Dispatch上のPhase20 EmlisAI観測返答境界

`/emotion/submit` の国家システム境界は、Phase20後も次のまま維持する。

```text
RN input submit
 -> backend /emotion/submit
 -> save path / dispatch path
 -> EmlisAI reply service
 -> public feedback sanitizer
 -> RN receives input_feedback only when observation_status=passed + comment_text non-empty
```

Phase20で追加されたbackend内部境界は、保存成功やpublic response shapeを変えるものではない。`response_kind`、`safety_triage_kind`、`material_quality`、`visible_material_slots`、`unknown_slots`、Gate recovery attempts、post-final gate recovery、Gate Recovery surface bindingは、EmlisAI内部の判断・diagnostic・test用materialとして読む。

Aの実機再確認修正では、低情報materialが成立している場合に限り、scope-only blockerを最終無応答理由として扱わずlow-information observation branchへ進める。これはSafety Gate、AP0、rollout、infra、実際の品質Gateを緩めるものではない。

禁止: rejected / unavailable / emergency safety / infraをRN表示用feedbackとして偽装する、`observation_text` / `reception_text` public keyを追加する、Phase20 internal metaだけでRN modalを開く。

Phase20-12〜20-15後は、`/emotion/submit` の保存・dispatch・public response契約を変えず、EmlisAI reply内部だけで次を補強している。

```text
- 旧fail-closed説明コメントを、displayable response kindではbounded repair / recoveryを通す説明へ更新。
- final pre-return gate後にnormal / low_information / limited_groundingが落ちても、safety / infraでない限り空白終了へ戻さないpost-final recoveryを追加。
- Gate Recovery surfaceがfixed fallback化していないことを、本文ではなくbinding meta / repetition QAで検出。
```

禁止: `phase20_13_post_final_gate_recovery` や `phase20_15_gate_recovery_surface_binding` をpublic response keyやRN表示条件にしない。raw input / generated candidate / comment_text bodyは引き続きpublic metaへ入れない。



# 2026-06-04 差分追記: `/emotion/submit` immediate reply User Label Connection接続

`mashos-api_11(15).zip` では、`/emotion/submit` の保存後EmlisAI immediate reply flowに、User Label Connection Observation v1 のmeta-only integrationとlimited visible surface connectionがbackend内部で接続されている。保存API、DB write path、public route、request key、response top-level shape、RN modal条件は変更しない。

国家システム上の読み方:

```text
InputScreen submit payload
↓
/emotion/submit save path
↓
normalize_emlis_current_input
↓
render_emlis_ai_reply
↓
User Label Connection material / candidate / gate / surface plan
↓
Phase7 meta-only safe summary
↓
Phase8 limited visible connection（既存Gate群を再評価して通った場合だけcomment_textへ接続）
↓
public meta sanitizer
↓
input_feedback.comment_text / input_feedback.emlis_ai
↓
RN passed + commentText non-empty modal表示
```

固定境界:

```text
- Freeはcurrent_input_onlyで、history edge / history surfaceを作らない。
- Plus/PremiumでもUser Fact Grounding Boundary、low_information、safety/self-denial/target judgement境界を通らない場合は通常履歴surfaceへ進めない。
- visible connection後もreader / grounding / template echo / runtime pre-return / visible surface acceptance / display decisionを再評価する。
- public metaにはraw current input、raw history input、memo、memo_action、comment_text body、candidate body、surface bodyを含めない。
```


# 2026-06-04 差分追記: `/emotion/submit` immediate reply Product Quality Measurement Phase0-8接続

`mashos-api_9(27).zip` では、`/emotion/submit` の保存後EmlisAI immediate reply flowを変えず、その出力を内部QA用の `ProductQualityEventV1` / `MeasurementRunV1` へ正規化して、Blocker Matrix、Blind QA Integration、Release Decision、Validation Planへ接続する構造が追加されている。保存API、DB write path、public route、request key、response top-level shape、RN modal条件は変更しない。

保存後flowでの読み方:

```text
/emotion/submit save path
↓
render_emlis_ai_reply
↓
public feedback meta / should_include_public_input_feedback
↓
ProductQualityEventV1（本文なし）
↓
Measurement Runner summary
↓
Blocker Matrix / Generation Repair Design / Blind QA Integration
↓
Release Decision / Validation Plan（内部判断のみ）
```

禁止: RunnerやRelease Decisionの結果を、保存成功payload、public `input_feedback`、RN表示source、DB保存物へ昇格しない。


# 2026-06-04 差分追記: Input / Save / Dispatch上のEmlisAI Product Quality Measurement境界

`mashos-api_9(27).zip` では、`/emotion/submit` の保存後 immediate reply flowを商品品質計測へ接続するためのbackend internal QA materialが追加されている。ただし、この追加は保存API・DB write path・dispatch・public route・request key・response top-level shape・RN modal条件を変更しない。

国家システム上は、次のように読む。

```text
Input Save /emotion/submit runtime flow
  -> 既存 render_emlis_ai_reply / public feedback meta / input_feedback.comment_text 契約を維持

Product Quality Measurement Runner
  -> local product QA profileで、実入力familyをEmlisAI経路へ流す内部計測経路
  -> raw input / comment_text bodyはrenderer入力として一時利用されるが、run materialへ保持しない
  -> ProductQualityEventV1 / Blocker Matrix / Blind QA Integration / Release Decision / Validation Planへmeta-onlyで接続
```

今回追加されたPhase0〜8は、`/emotion/submit` runtimeの保存成功・保存失敗・dispatch・queue・DB publishを変えるものではない。計測Runnerが `/emotion/submit` 相当経路を使う場合も、それは商品品質QA用の内部実行であり、public response keyやRN表示sourceを増やす意味ではない。

固定境界:

```text
- `input_feedback.comment_text` と `input_feedback.emlis_ai.observation_status` の表示契約を維持する。
- Composer無効は商品品質QA成功ではなく `composer_generation_path_not_open_for_product_qa` blockerとして扱う。
- `display_not_reached` や `blind_qa_review_required` はrelease blockerであり、保存APIの失敗やRN非表示条件の緩和理由ではない。
- validation planはテスト実行順の内部materialであり、実行済みでない検証をgreen扱いしない。
```

# 2026-06-05 差分追記: `/emotion/submit` immediate reply Gate Recovery public boundary接続

`mashos-api_13(8).zip` では、`/emotion/submit` 保存直後のEmlisAI immediate replyに、Gate Recovery public surface leak repair P0〜P12が接続されている。これは保存API、dispatch、DB write path、public response shapeを変える変更ではない。

Input / Save / Dispatch上の重要点:

| 境界 | 読み方 |
|---|---|
| Save API | 入力保存の成功可否、カテゴリ、感情、memo等の保存契約は変更しない。 |
| EmlisAI reply runtime | Gate failure後の回復を、固定骨格文ではなくpublic candidate source選択へ回す。 |
| Gate Recovery material surface | `phase20_5` / `phase20_13` はdiagnostic-onlyとして扱い、public `comment_text` へ昇格しない。 |
| low-information recovery | 低情報・限定groundingは `low_information_observation_composer` 由来の本文だけを候補にする。 |
| bounded original repair | 元Composer候補がある場合だけ、bounded repair / re-render候補として再接続する。 |
| no public candidate | 無理に表示せず、diagnostic blocker / ProductQuality blockerとして保持する。 |

禁止:

```text
- `/emotion/submit` のresponse keyをP0〜P12用に追加する。
- RN表示条件をGate Recovery metaやsurface_originへ寄せる。
- Gate Recovery material surfaceを「仮表示」や「安全fallback文」としてpublicに出す。
- F/E/G実機fixtureに合わせた保存route / dispatch branch /専用surfaceを追加する。
```


# 2026-06-06 差分追記: `/emotion/submit` immediate reply normal observation rebuild接続

`mashos-api_10(25).zip` では、`/emotion/submit` 保存後のEmlisAI immediate reply flowに、通常・高情報量入力向けの `normal_observation_rebuild_candidate` が接続されている。保存API、DB write path、public route、request key、response top-level shape、RN modal条件は変更しない。

保存後flowでの読み方:

```text
/emotion/submit save path
↓
render_emlis_ai_reply
↓
original composer candidate generated / ai_generated
↓
surface_grammar / relation_skeleton / visible_surface failure
↓
Gate Recovery public candidate builder
↓
normal_observation_rebuild_candidate
↓
Runtime / Visible / Display Gate再評価
↓
passed + comment_text の場合だけ public input_feedback に含める
```

接続条件:

```text
- original_composer_candidate が存在する。
- original source が ai_generated である。
- low_information / limited_grounding ではない。
- safety / emergency / infra / source unavailable / composer disabled ではない。
- Gate Recovery material surface lineageではない。
```

禁止:

```text
- input_feedback.comment_text が空でもRNにタイトルだけ出す。
- non-passedをRNで表示する。
- Gate Recovery material surfaceを仮表示文として返す。
- composer disabledやsource unavailableをnormal rebuildで補う。
```
