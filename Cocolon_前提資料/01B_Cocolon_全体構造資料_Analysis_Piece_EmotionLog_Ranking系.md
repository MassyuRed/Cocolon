---
title: "01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系"
revision_date: "2026-05-07"
---

# 01B. Analysis / Piece / EmotionLog / Ranking系

この章では Analysis(MyWeb) / Self Structure / Piece(Nexus) / EmotionLog / Ranking / history surfacing と、それを支える backend derived-state runtime をまとめて扱う。

## B1. Analysis / MyWeb / Self Structure surfaces

### `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `shared`
- 役割: RN shared component module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/ui/applyTypographyTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/ui/applyTypographyTokens.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/DeepInsightScreen.js`
- repo: `Cocolon`
- system: `Analysis input surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis input surface.
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - DeepInsight input flow and analysis entry

### `Cocolon/screens/MyWebContentFirstScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/ui/applyTypographyTokens.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebCrossLinkSection.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebEmotionAnalysisScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebEnsureClient.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: MyWebEnsureClient.js
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebHistoryScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `shared`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebInputHistoryMenuScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebMenuCommon.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `shared`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js` — import
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js` — import
  - `Cocolon/screens/MyWebSelfStructureScreen.js` — import
  - `Cocolon/screens/MyWebTopScreen.js` — import
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — import
  - `Cocolon/screens/SettingsOtherScreen.js` — import
  - `Cocolon/screens/SettingsScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js`
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js`
  - `Cocolon/screens/MyWebSelfStructureScreen.js`
  - `Cocolon/screens/MyWebTopScreen.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `Cocolon/screens/SettingsOtherScreen.js`
  - `Cocolon/screens/SettingsScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebReportHistoryScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `legacy-live`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/screens/MyWebReportScheduleUtils.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebReportScheduleUtils.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebReportScheduleUtils.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebReportViewerScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `legacy-live`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/todayQuestionApi.js` — import
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportViewerScreen.js` — import
  - `Cocolon/screens/MyWebSelfStructureScreen.js` — import
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportViewerScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/latest/status
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — endpoint /myweb/home-summary
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — endpoint /myweb/reports/ensure
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/todayQuestionApi.js`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebEmotionAnalysisScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebInputHistoryMenuScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebSelfStructureScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportViewerScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebSelfStructureScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/MyWebScreen.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/MyWebTopScreen.js`
- repo: `Cocolon`
- system: `Analysis / Self Structure surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Analysis / Self Structure surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
- 修正対象になりうる変更:
  - MyWeb / self-structure UI, report history/viewer, analysis read-side

### `Cocolon/screens/SelfStructureReportGenerateScreen.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `shared`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/latest/status
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebContentFirstScreen.js` — import
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/MyWebContentFirstScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/screens/SelfStructureReportHistoryScreen.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_report_reads.py` — endpoint /report-reads/mark
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_report_reads.py`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/screens/SelfStructureReportViewerScreen.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `active`
- 役割: RN screen module. Current system: app support / misc.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/selfStructure/SelfStructureDeepRenderer.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - misc app support change


## B2. Piece / Nexus surfaces

### `Cocolon/lib/nexusApi.js`
- repo: `Cocolon`
- system: `Piece / Nexus API wrapper`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: Piece / Nexus API wrapper.
- 直接関係ファイル:
  - `Cocolon/lib/apiClient.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/NexusScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/screens/NexusScreen.js`
- 修正対象になりうる変更:
  - Piece/Nexus frontend -> backend boundary

### `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — endpoint /ranking/mymodel_discoveries
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelEchoesRankingScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — endpoint /ranking/mymodel_resonances
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelEntryScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyModelScreen.js` — import
  - `Cocolon/screens/NexusScreen.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/MyModelScreen.js`
  - `Cocolon/screens/NexusScreen.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelMenuCommon.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `shared`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/UnreadBadge.js` — import
  - `Cocolon/screens/MyWebMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelReactionHistoryScreen.js` — import
  - `Cocolon/screens/RankingAllUsersScreen.js` — import
  - `Cocolon/screens/RankingMyModelMenuScreen.js` — import
  - `Cocolon/screens/RankingPersonalUsersScreen.js` — import
  - `Cocolon/screens/SettingsScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/UnreadBadge.js`
  - `Cocolon/screens/MyModelReactionHistoryScreen.js`
  - `Cocolon/screens/MyWebMenuCommon.js`
  - `Cocolon/screens/RankingAllUsersScreen.js`
  - `Cocolon/screens/RankingMyModelMenuScreen.js`
  - `Cocolon/screens/RankingPersonalUsersScreen.js`
  - `Cocolon/screens/SettingsScreen.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelPromptTemplates.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `legacy-live`
- 役割: MyModelPromptTemplates.js
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelQuestionsRankingScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/mymodel_questions
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelReactionHistoryScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/screens/MyModelMenuCommon.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelReflectionsScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/MyModelScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `shared`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/lib/user.ts` — import
  - `Cocolon/screens/MenuActionCardCommon.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
  - `Cocolon/screens/MyModelEntryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/lib/user.ts`
  - `Cocolon/screens/MenuActionCardCommon.js`
  - `Cocolon/screens/MyModelEntryScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/NexusScreen.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/components/CocolonButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/nexusApi.js` — import
  - `Cocolon/screens/nexus/NexusReflectionCard.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelEntryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/TutorialContext.js`
  - `Cocolon/components/CocolonButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/nexusApi.js`
  - `Cocolon/screens/MyModelEntryScreen.js`
  - `Cocolon/screens/nexus/NexusReflectionCard.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/nexus/NexusEmotionRankingCard.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side

### `Cocolon/screens/nexus/NexusReflectionCard.js`
- repo: `Cocolon`
- system: `Piece / Nexus surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: Piece / Nexus surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/NexusScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/screens/NexusScreen.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - Piece/Nexus UI, reflection list/view, QnA/read-side


## B3. EmotionLog / Ranking / history surfaces

### `Cocolon/lib/historyRetentionLabel.js`
- repo: `Cocolon`
- system: `app support / misc`
- 現行状態: `shared`
- 役割: Frontend helper / boundary module. Current system: app support / misc.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `Cocolon/screens/EchoesHistoryListScreen.js` — import
  - `Cocolon/screens/MyWebHistoryScreen.js` — import
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — import
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — import
  - `Cocolon/screens/TodayQuestionHistoryScreen.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/EchoesHistoryListScreen.js`
  - `Cocolon/screens/MyWebHistoryScreen.js`
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `Cocolon/screens/TodayQuestionHistoryScreen.js`
- 修正対象になりうる変更:
  - misc app support change

### `Cocolon/screens/DiscoveriesHistoryDetailScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/DiscoveriesHistoryListScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/EchoesHistoryDetailScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/EchoesHistoryListScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/SubscriptionContext.js` — import
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/historyRetentionLabel.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/SubscriptionContext.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/historyRetentionLabel.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/EmotionLogScreen.js`
- repo: `Cocolon`
- system: `EmotionLog / social surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: EmotionLog / social surface.
- 直接関係ファイル:
  - `Cocolon/TutorialContext.js` — import
  - `Cocolon/UnreadContext.js` — import
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/components/TutorialOverlay.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/TutorialContext.js`
  - `Cocolon/UnreadContext.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/components/TutorialOverlay.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
- 修正対象になりうる変更:
  - follow / emotion-log timeline and social read-side

### `Cocolon/screens/FollowListScreen.js`
- repo: `Cocolon`
- system: `EmotionLog / social surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: EmotionLog / social surface.
- 直接関係ファイル:
  - `Cocolon/AuthContext.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/follow-requests/approve
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — endpoint /myprofile/follow-requests/reject
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/AuthContext.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
- 修正対象になりうる変更:
  - follow / emotion-log timeline and social read-side

### `Cocolon/screens/LoginStreakRankingScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonBackButton.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/login_streak
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonBackButton.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/RankingAllUsersScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/RankingMyModelMenuScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/RankingPersonalUsersScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/screens/MyModelMenuCommon.js` — import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyModelMenuCommon.js`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing

### `Cocolon/screens/RankingTopScreen.js`
- repo: `Cocolon`
- system: `ranking / history surface`
- 現行状態: `active`
- 役割: RN screen module. Current system: ranking / history surface.
- 直接関係ファイル:
  - `Cocolon/components/CocolonPressable.js` — import
  - `Cocolon/lib/apiClient.js` — import
  - `Cocolon/lib/supabase.ts` — import
  - `Cocolon/theme/ThemeContext.js` — import
  - `Cocolon/ui/applyTypographyTokens.js` — import
  - `Cocolon/ui/uiTokens.js` — import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — endpoint /ranking/mymodel_questions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_count
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/input_length
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — endpoint /ranking/login_streak
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — endpoint /ranking/mymodel_resonances
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/components/CocolonPressable.js`
  - `Cocolon/lib/apiClient.js`
  - `Cocolon/lib/supabase.ts`
  - `Cocolon/theme/ThemeContext.js`
  - `Cocolon/ui/applyTypographyTokens.js`
  - `Cocolon/ui/uiTokens.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
- 修正対象になりうる変更:
  - ranking read-side and history surfacing


## B4. Analysis / MyWeb / Self Structure backend

### `mashos-api/ai/services/ai_inference/api_myprofile.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure public API`
- 現行状態: `legacy-live`
- 役割: MyProfile ID (share) API for Cocolon (MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /myprofile/latest/status
  - `Cocolon/screens/AccountScreen.js` — endpoint /myprofile/follow
  - `Cocolon/screens/AccountScreen.js` — endpoint /myprofile/unfollow
  - `Cocolon/screens/FollowListScreen.js` — endpoint /myprofile/follow-requests/approve
  - `Cocolon/screens/FollowListScreen.js` — endpoint /myprofile/follow-requests/reject
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myprofile/latest/status
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js` — endpoint /myprofile/latest/status
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py` — import
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/AccountScreen.js`
  - `Cocolon/screens/FollowListScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportGenerateScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_api_contract_headers.py`
  - `mashos-api/ai/tests/contract/test_myprofile_latest_regression.py`
- 修正対象になりうる変更:
  - analysis reports, self-structure latest/history, read status

### `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure public API`
- 現行状態: `legacy-live`
- 役割: FastAPI route module for GET /myprofile/reports/history, GET /myprofile/reports/{report_id}
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`
- 修正対象になりうる変更:
  - analysis reports, self-structure latest/history, read status

### `mashos-api/ai/services/ai_inference/api_myweb_reads.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure public API`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /myweb/home-summary, GET /myweb/reports/{report_id}/weekly-days
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_input_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myweb/home-summary
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py` — from import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebScreen.js`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_input_summary.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/emlis_ai_context_service.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`
- 修正対象になりうる変更:
  - analysis reports, self-structure latest/history, read status

### `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure public API`
- 現行状態: `legacy-live`
- 役割: Phase1: MyWeb ensure API (on-demand, per-user)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /myweb/reports/ensure
  - `Cocolon/screens/MyWebScreen.js` — endpoint /myweb/reports/ensure
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - analysis reports, self-structure latest/history, read status

### `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: myprofile_section_text_templates.py (Phase9+)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/ai_inference/myweb_report_schema.json`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Config / schema / text asset used by current backend support or contract flow.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/__init__.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `shared`
- 役割: Analysis engine module. Current role inferred from file name:   init  .
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/baseline.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/examples/demo.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/baseline.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
  - `mashos-api/ai/services/examples/demo.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/baseline.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Analysis engine module. Current role inferred from file name: baseline.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `shared`
- 役割: Analysis engine module. Current role inferred from file name: daily.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `legacy-live`
- 役割: Analysis engine module. Current role inferred from file name: monthly.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `legacy-live`
- 役割: Analysis engine module. Current role inferred from file name: weekly.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/models.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `shared`
- 役割: Analysis engine module. Current role inferred from file name: models.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
  - `mashos-api/ai/services/analysis_engine/baseline.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/baseline.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Analysis engine module. Current role inferred from file name: builders.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Analysis engine module. Current role inferred from file name: fusion.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Analysis engine module. Current role inferred from file name: rules.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `legacy-live`
- 役割: Analysis engine module. Current role inferred from file name: signal extraction.
- 直接関係ファイル:
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly


## B5. Piece / Nexus / reflection backend

### `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `legacy-live`
- 役割: MyModel 一問一答（新構造）API
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /mymodel/qna/unread-status
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `mashos-api/ai/services/ai_inference/access_policy/piece_access_policy.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `legacy-live`
- 役割: Deterministic public-display builder for Premium generated reflections.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `shared`
- 役割: Helpers for Premium generated Reflection public identity.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_generation_service.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `shared`
- 役割: Backfill / cleanup helpers for Premium generated reflections.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
  - `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
  - `mashos-api/scripts/backfill_generated_reflection_display_cleanup.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `legacy-live`
- 役割: Helpers for generated Piece totals and rankings.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/reflection_publish_entitlements.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `shared`
- 役割: Monthly publish quota rules for the new emotion-generated Reflection flow.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display

### `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
- repo: `mashos-api`
- system: `Piece / Nexus public API & reflection runtime`
- 現行状態: `shared`
- 役割: Deterministic formatter for MyModel Create -> Reflections public display text.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/tests/contract/test_mymodel_reflection_display_contracts.py`
- 修正対象になりうる変更:
  - Piece/Nexus QnA, generated reflection, reflection display


## B6. EmotionLog / Ranking / ASTOR derived-state backend

### `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: FastAPI route module for DELETE /emotion/history/{emotion_id}
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_emotion_history_search.py`
- repo: `mashos-api`
- system: `backend support / misc`
- 現行状態: `active`
- 役割: Emotion History Search API (server-side)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
- 修正対象になりうる変更:
  - misc backend support change

### `mashos-api/ai/services/ai_inference/api_friends.py`
- repo: `mashos-api`
- system: `EmotionLog / social runtime`
- 現行状態: `legacy-live`
- 役割: Legacy Friends / EmotionLog API for Cocolon (MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/App.js` — endpoint /emotion-log/feed
  - `Cocolon/App.js` — endpoint /emotion-log/unread-status
  - `Cocolon/App.js` — endpoint /emotion-log/unread/read-feed
  - `Cocolon/screens/SettingsAppSettingsScreen.js` — endpoint /emotion-notifications/settings
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/App.js`
  - `Cocolon/screens/SettingsAppSettingsScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - follow/emotion-log backend read/write runtime

### `mashos-api/ai/services/ai_inference/api_ranking.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `legacy-live`
- 役割: Ranking API for Cocolon (MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/EmotionRankingScreen.js` — endpoint /ranking/emotions
  - `Cocolon/screens/InputCountRankingScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/InputLengthRankingScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js` — endpoint /ranking/mymodel_questions
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/mymodel_questions
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/MyModelQuestionsRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `shared`
- 役割: Ranking API for Cocolon (MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/EmotionRankingScreen.js` — endpoint /ranking/emotions
  - `Cocolon/screens/InputCountRankingScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/InputLengthRankingScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/LoginStreakRankingScreen.js` — endpoint /ranking/login_streak
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_count
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/input_length
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/login_streak
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/EmotionRankingScreen.js`
  - `Cocolon/screens/InputCountRankingScreen.js`
  - `Cocolon/screens/InputLengthRankingScreen.js`
  - `Cocolon/screens/LoginStreakRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `shared`
- 役割: MyModel QnA Discoveries Ranking API (Cocolon / MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — endpoint /ranking/mymodel_discoveries
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyModelDiscoveriesRankingScreen.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `shared`
- 役割: MyModel QnA Resonances Ranking API (Cocolon / MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyModelEchoesRankingScreen.js` — endpoint /ranking/mymodel_resonances
  - `Cocolon/screens/RankingTopScreen.js` — endpoint /ranking/mymodel_resonances
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyModelEchoesRankingScreen.js`
  - `Cocolon/screens/RankingTopScreen.js`
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `active`
- 役割: MyModel QnA Views Ranking API (Cocolon / MashOS / FastAPI)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/api_report_reads.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure public API`
- 現行状態: `shared`
- 役割: FastAPI route module for GET /report-reads/status, POST /report-reads/mark, GET /report-reads/myweb-unread-status
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/publish_governance.py` — from import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `Cocolon/screens/MyWebReportHistoryScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/MyWebReportViewerScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/MyWebScreen.js` — endpoint /report-reads/mark
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js` — endpoint /report-reads/mark
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` — from import
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py` — import
  - `mashos-api/ai/tests/contract/test_publish_governance.py` — import
- 修正時に必ず同時確認するファイル:
  - `Cocolon/screens/MyWebReportHistoryScreen.js`
  - `Cocolon/screens/MyWebReportViewerScreen.js`
  - `Cocolon/screens/MyWebScreen.js`
  - `Cocolon/screens/SelfStructureReportHistoryScreen.js`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/publish_governance.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/startup_snapshot_store.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/tests/contract/test_contract_snapshots_phase6e.py`
  - `mashos-api/ai/tests/contract/test_publish_governance.py`
- 修正対象になりうる変更:
  - analysis reports, self-structure latest/history, read status

### `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Shared helper for enqueuing ASTOR account status refresh jobs.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `active`
- 役割: Account Status summary generation kernel for ASTOR (Phase 1).
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Storage helpers for ASTOR account status summary artifacts.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_account_status.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_core.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: ASTOR Core v0.1
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_structure_matcher.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/astor_structure_matcher.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
- repo: `mashos-api`
- system: `EmotionLog / social runtime`
- 現行状態: `legacy-live`
- 役割: Shared helper for enqueuing ASTOR emotion log feed refresh jobs.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- 修正対象になりうる変更:
  - follow/emotion-log backend read/write runtime

### `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
- repo: `mashos-api`
- system: `EmotionLog / social runtime`
- 現行状態: `legacy-live`
- 役割: EmotionLog feed generation kernel for ASTOR (Phase 1).
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - follow/emotion-log backend read/write runtime

### `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
- repo: `mashos-api`
- system: `EmotionLog / social runtime`
- 現行状態: `legacy-live`
- 役割: Storage helpers for ASTOR EmotionLog feed summary artifacts.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_friends.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_friends.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - follow/emotion-log backend read/write runtime

### `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Shared helper for enqueuing ASTOR global summary refresh jobs.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_history_manage.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: Global Summary generation kernel for ASTOR (Step 1).
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: Storage helpers for ASTOR global summary artifacts.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_global_summary.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Phase 6: DB-backed job queue for ASTOR heavy processing
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_secret.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: Phase X: Central Material Snapshot Generator (v1)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/reflection_text_formatter.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `active`
- 役割: ASTOR MyModel Persona Context v0.1
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: ASTOR MyProfile（月次）自己構造分析レポート生成
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py` — from import
  - `mashos-api/ai/services/ai_inference/structure_dict.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription.py` — from import
  - `mashos-api/ai/services/ai_inference/subscription_store.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myprofile.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_cron_distribution.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myprofile.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/myprofile_section_text_templates.py`
  - `mashos-api/ai/services/ai_inference/structure_dict.py`
  - `mashos-api/ai/services/ai_inference/subscription.py`
  - `mashos-api/ai/services/ai_inference/subscription_store.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/rules.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: ASTOR MyWeb Insight v0.3
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_patterns.py` — from import
  - `mashos-api/ai/services/ai_inference/structure_dict.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/app.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_patterns.py`
  - `mashos-api/ai/services/ai_inference/structure_dict.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_patterns.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: ASTOR 用の「構造語パターン集約ストア」。
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_persona.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_myweb_insight.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `shared`
- 役割: Storage helpers for ASTOR ranking board artifacts.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py` — from import
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_ranking.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_login_streak.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_resonances.py`
  - `mashos-api/ai/services/ai_inference/api_ranking_mymodel_views.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/astor_ranking_enqueue.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `shared`
- 役割: Shared helper for enqueuing ASTOR ranking board refresh jobs.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py` — from import
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py` — from import
  - `mashos-api/ai/services/ai_inference/api_activity_login.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/account_delete_service.py`
  - `mashos-api/ai/services/ai_inference/api_account_visibility.py`
  - `mashos-api/ai/services/ai_inference/api_activity_login.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
- repo: `mashos-api`
- system: `ranking runtime`
- 現行状態: `active`
- 役割: Ranking board generation kernel for ASTOR (Phase 1).
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_metrics.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - ranking backend read/write/refresh runtime

### `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Premium Reflection generation engine (v1)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_maintenance_contracts.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: Premium Reflection store layer (v1)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py` — from import
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py` — from import
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py` — import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_worker.py`
  - `mashos-api/ai/services/ai_inference/emotion_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_maintenance.py`
  - `mashos-api/ai/tests/contract/test_generated_reflection_display_contracts.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_snapshot_enqueue.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `shared`
- 役割: Shared helper for enqueuing ASTOR material snapshot refresh jobs.
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_profile_create.py` — from import
  - `mashos-api/ai/services/ai_inference/api_today_question.py` — from import
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_profile_create.py`
  - `mashos-api/ai/services/ai_inference/api_today_question.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/today_question_command_service.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_structure_matcher.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `active`
- 役割: ASTOR 用の「構造語マッチング」モジュール。
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/astor_core.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/astor_worker.py`
- repo: `mashos-api`
- system: `ASTOR snapshot / worker / derived-state runtime`
- 現行状態: `legacy-live`
- 役割: Phase 6: ASTOR heavy processing worker (Render Background Worker)
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` — from import
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py` — from import
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py` — from import
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generation_lock.py` — from import
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py` — from import
  - `mashos-api/ai/services/ai_inference/request_metrics.py` — import
  - `mashos-api/ai/services/ai_inference/response_microcache.py` — import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
  - `mashos-api/ai/services/analysis_engine/__init__.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py` — from import
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py` — from import
  - `mashos-api/ai/services/analysis_engine/models.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py` — from import
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py`
  - `mashos-api/ai/services/ai_inference/api_emotion_submit.py`
  - `mashos-api/ai/services/ai_inference/api_myweb_reports.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_account_status_store.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_friend_feed_store.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_enqueue.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_global_summary_store.py`
  - `mashos-api/ai/services/ai_inference/astor_job_queue.py`
  - `mashos-api/ai/services/ai_inference/astor_material_snapshots.py`
  - `mashos-api/ai/services/ai_inference/astor_myprofile_report.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_boards.py`
  - `mashos-api/ai/services/ai_inference/astor_ranking_kernel.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_engine.py`
  - `mashos-api/ai/services/ai_inference/astor_reflection_store.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generation_lock.py`
  - `mashos-api/ai/services/ai_inference/report_distribution_push_store.py`
  - `mashos-api/ai/services/ai_inference/request_metrics.py`
  - `mashos-api/ai/services/ai_inference/response_microcache.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
  - `mashos-api/ai/services/analysis_engine/__init__.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/daily.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/monthly.py`
  - `mashos-api/ai/services/analysis_engine/emotion_structure_engine/weekly.py`
  - `mashos-api/ai/services/analysis_engine/models.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/builders.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/fusion.py`
  - `mashos-api/ai/services/analysis_engine/self_structure_engine/signal_extraction.py`
- 修正対象になりうる変更:
  - snapshot generation, queue, worker, derived state, publish pipeline

### `mashos-api/ai/services/ai_inference/mashlogic_profile_enhancer.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Deep-mode enhancer for MyProfile monthly reports.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/ai_inference/mashlogic_qa_enhancer.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: Deep-mode enhancer for MyProfile Q&A responses.
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/ai_inference/persona_engine.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: 既存 app.py 内の compose_response / detect_lang / contains_date_like_adv 相当を
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py` — from import
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/guards/date_guard.py`
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly

### `mashos-api/ai/services/ai_inference/report_text_templates.py`
- repo: `mashos-api`
- system: `analysis / report generation support`
- 現行状態: `active`
- 役割: report_text_templates.py (Phase9)
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - なし
- 修正時に必ず同時確認するファイル:
  - なし
- 修正対象になりうる変更:
  - analysis engine, report schema, persona/text assembly


## B7. 2026-04-22 差分更新 (Analysis / Piece 完了反映)

### `mashos-api/ai/services/ai_inference/report_artifact_read_service.py`
- repo: `mashos-api`
- system: `Analysis / Self Structure read service`
- 現行状態: `active`
- 役割: MyWeb / Self Structure の family 別 history/detail 読取を 1 つの artifact read service に集約する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py` — from import
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py`
  - `mashos-api/ai/services/ai_inference/access_policy/viewer_access_policy.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - Analysis / Self Structure history/detail, publish governance, artifact read

### `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
- repo: `mashos-api`
- system: `Piece / Nexus public read service`
- 現行状態: `active`
- 役割: canonical public Piece body owner。`emotion_generated` source 固定で list/detail/unread-status を組み立てる。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/api_nexus.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py`
- 修正対象になりうる変更:
  - Piece/Nexus public list/detail/unread-status, canonical schema, compat routing

### `mashos-api/ai/services/ai_inference/piece_public_read_store.py`
- repo: `mashos-api`
- system: `Piece / Nexus public read service`
- 現行状態: `active`
- 役割: Piece public read 用の route-neutral repository helper。metrics / reads / profile lookup / followed-owner lookup を保持する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/supabase_client.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
  - `mashos-api/ai/services/ai_inference/supabase_client.py`
- 修正対象になりうる変更:
  - Piece/Nexus read repository, metrics/read-state/profile lookup

### `mashos-api/ai/services/ai_inference/piece_generated_reflection_access.py`
- repo: `mashos-api`
- system: `Piece / Nexus public read service`
- 現行状態: `active`
- 役割: generated reflection の access decision と canonical row resolve を route-neutral に持つ helper。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py` — from import
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py` — from import
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — from import
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/api_mymodel_qna.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_display.py`
  - `mashos-api/ai/services/ai_inference/generated_reflection_identity.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_service.py`
  - `mashos-api/ai/services/ai_inference/piece_public_read_store.py`
- 修正対象になりうる変更:
  - Piece/Nexus access policy, canonical public row resolve, generated reflection identity

### `mashos-api/ai/services/ai_inference/api_nexus_compat.py`
- repo: `mashos-api`
- system: `Piece / Nexus compatibility boundary`
- 現行状態: `active`
- 役割: canonical public surface から外した discoveries route を 410 の quarantined compat route として隔離する。
- 直接関係ファイル:
  - なし
- このファイルを直接参照するファイル:
  - `mashos-api/ai/services/ai_inference/app.py` — from import
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/services/ai_inference/app.py`
  - `mashos-api/ai/services/ai_inference/api_nexus.py`
- 修正対象になりうる変更:
  - Piece/Nexus retired public route, compat quarantine

### 差分更新まとめ: 既存 file の current override
- `Cocolon/lib/nexusApi.js` — canonical public Piece wrapper。discoveries 互換 shaping を外し、`views` / `resonances` 中心の canonical schema に固定した。
- `Cocolon/screens/NexusScreen.js` — canonical public Piece surface。discovery detail UI と compatibility state を持たない。
- `Cocolon/screens/MyModelReflectionsScreen.js` — owner-side reflection / Echoes 管理 screen。public list/detail/unread は `nexusApi` を経由し、discoveries owner-side surface を外した。
- `Cocolon/screens/MyModelScreen.js` — owner-side menu surface。`globalDiscoveryCount` 表示を外し、discovery を現役 surface とみなさない。
- `Cocolon/screens/RankingMyModelMenuScreen.js` — resonance only の ranking menu。questions / discoveries 導線を持たない。
- `Cocolon/screens/RankingTopScreen.js` — canonical ranking entry。input count / input length / login streak / resonances のみを案内する。
- `Cocolon/screens/MyModelQuestionsRankingScreen.js` — hot path から外れた retired-hold screen。`/ranking/mymodel_questions` 410 前提の hold file として扱う。
- `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` — hot path から外れた retired-hold screen。`/ranking/mymodel_discoveries` 410 前提の hold file として扱う。
- `Cocolon/screens/DiscoveriesHistoryListScreen.js` / `DiscoveriesHistoryDetailScreen.js` — retired-hold history placeholder。canonical public / owner-side flow では使わない。
- `mashos-api/ai/services/ai_inference/api_nexus.py` — canonical public Piece route owner。discoveries canonical route は持たず、public list/detail/unread-status を `piece_public_read_service.py` と組で成立させる。
- `mashos-api/ai/services/ai_inference/api_mymodel_qna.py` — compatibility / reaction / owner-side layer。public list/detail/unread-status body は持たず、canonical public source owner でもない。
- `mashos-api/ai/services/ai_inference/api_myprofile.py` — status / trigger façade。latest/monthly refresh は `astor_myprofile_report.py` shared refresher へ寄せた。
- `mashos-api/ai/services/ai_inference/api_myprofile_reports_read.py` — façade only。history/detail read 本体は `report_artifact_read_service.py` へ委譲する。
- `mashos-api/ai/services/ai_inference/api_myweb_reads.py` — artifact-only read。home summary と weekly-days は raw recompute を持たず、reader/service 契約で読む。
- `mashos-api/ai/services/ai_inference/api_myweb_reports.py` — projection-first runtime only。production module から legacy ready builder / flag を外した。
- `mashos-api/ai/services/ai_inference/astor_myprofile_report.py` — latest/monthly shared refresher + builder owner。
- `mashos-api/ai/services/ai_inference/api_ranking.py` — `mymodel_questions` surface は 410 retired route に縮退。
- `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` — discoveries ranking surface は 410 retired route に縮退。

# 2026-04-25 差分追記: Analysis / Piece / EmotionLog current補正

- RN surface は current 名へ寄りました。主な current screen は `Cocolon/screens/Analysis*`、`Cocolon/screens/Piece*`、`Cocolon/screens/Resonance*`、`Cocolon/screens/NexusScreen.js`、`Cocolon/screens/nexus/NexusPieceCard.js` です。
- backend current owner 本体化は DB rename 前段として完了扱いです。正本は `api_analysis_reads.py` / `api_analysis_reports.py` / `api_follow.py` / `api_emotion_log.py` / `api_emotion_notification_settings.py` / `api_self_structure.py` / `api_self_structure_reports.py` / `api_piece_runtime.py` / `api_emotion_piece.py` / `api_nexus.py` / `api_ranking_piece_*` です。
- `api_myweb_*`、`api_friends.py`、`api_myprofile.py`、`api_mymodel_qna.py`、`api_emotion_reflection.py` は runtime 本体ではなく legacy compat façade として残します。

# 2026-04-28 差分追記: 三大中核構造 / Analysis / Piece補正

この資料でいう **三大中核構造** は、`EmlisAI構造`、`分析構造`、`Piece構造` の3つである。旧表現の `Piece生成機構` は、`Piece構造` の生成・preview・publish工程を指す。

## 新規 file block

### `mashos-api/ai/services/ai_inference/analysis_capability.py`
- repo: `mashos-api`
- system: `分析構造 / capability profile`
- 現行状態: `active`
- 役割: Free / Plus / Premium の分析能力差分を plan名直接判定ではなく capability profile として固定する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_analysis_reports.py`
  - `mashos-api/ai/services/ai_inference/api_self_structure.py`
  - `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`

### `mashos-api/ai/services/ai_inference/analysis_report_validity_gate.py`
- repo: `mashos-api`
- system: `分析構造 / report validity gate`
- 現行状態: `active`
- 役割: 分析成果物の材料充分性、domain分離、診断風表現、overclaim、表示妥当性、保存可否を判定する。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_analysis_reports.py`
  - `mashos-api/ai/services/ai_inference/api_self_structure.py`
  - `mashos-api/ai/services/ai_inference/astor_self_structure_report.py`
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_new_national_core_analysis_contracts.py`

### `mashos-api/ai/services/ai_inference/piece_generation_policy.py`
- repo: `mashos-api`
- system: `Piece構造 / preview-publish safety policy`
- 現行状態: `active`
- 役割: `piece_text`、`visibility_status`、`generation_status`、`transform_mode`、`safety_level`、`safety_flags`、`piece_text_hash` をpreview前に固定し、publish時の本文再生成を防ぐ。
- 直接関係ファイル:
  - `mashos-api/ai/services/ai_inference/api_emotion_piece.py`
  - `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py`
  - `mashos-api/ai/services/ai_inference/emotion_piece_store.py`
  - `mashos-api/ai/services/ai_inference/home_gateway/emotion_reflection_publish_service.py`
- 修正時に必ず同時確認するファイル:
  - `mashos-api/ai/tests/contract/test_new_national_core_piece_contracts.py`
  - `Cocolon/components/EmotionPiecePreviewModal.js`

## 既存 file の差分

- `mashos-api/ai/services/ai_inference/api_emotion_piece.py` は `piece_text` を正式fieldとしてadditive追加し、`reflection_text` を互換fieldとして残す。
- `mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py` は URL / PII / 攻撃表現などをpreview前に安全化し、policy metaを返す。
- `mashos-api/ai/services/ai_inference/emotion_piece_store.py` は preview本文hashとpublish本文hashの一致を守る。
- `mashos-api/ai/services/ai_inference/piece_generation_store.py` は共有Supabase client寄せとPiece storage契約を反映する。
- `mashos-api/ai/services/ai_inference/api_analysis_reports.py` / `api_self_structure.py` / `astor_self_structure_report.py` は `reportValidity` metaをadditive接続する。

# 2026-05-05 差分追記: Piece communicative core / display guard current

Piece生成は、`短くまとめる` ことではなく、感情入力から生まれた考えを **他者に伝わる一問一答** へ整える構造として読む。

## current owner

| file | 現状の役割 |
|---|---|
| `emotion_piece_generation_service.py` | Piece previewのquestion / raw answer / core answer / policy metaを作る中心。カテゴリ一般質問より、入力全体のcommunicative coreを優先する |
| `piece_generated_display.py` | stored row / preview display の正規化・表示文生成・hash・quality flagsを扱う |
| `piece_generation_policy.py` | URL / PII / 攻撃表現 / visibility / publish可否 / hash契約を扱う |
| `piece_text_formatter.py` | 表示可能なPiece本文へ整える formatter |
| `emotion_piece_store.py` / `home_gateway/emotion_reflection_publish_service.py` | preview -> publish の本文hash一致と保存経路 |

## 現行ルール

- `emotion_piece_generation_service.py` は、例文由来の固定回答ではなく、入力から抽出した汎用semantic flagsでquestion / answerを作る。
- `focus_key` は表示生成側と一致させる。core answerが作れている場合、display layerで `人間関係です` のような汎用文へ潰さない。
- `できることをです` のようなbroken phraseは返答前に修復・遮断する。
- `piece_core.communicative_core_ok` は、壊れた日本語がないことだけでなく、core answerが過圧縮・カテゴリ汎用化されていないことも見る。
- `piece_generation_policy.py` のpreview/publish safetyとhash契約は維持する。

## 追加・更新された回帰test

- `mashos-api/ai/tests/test_emotion_piece_generation_long_input_core.py`
- `mashos-api/ai/tests/test_emotion_piece_generation_self_and_others_happiness.py`

これらは例文の固定正解文を要求するためではなく、未知入力でも `入力全体の核 -> 他者伝達可能な問い/答え` の構造を通ることを確認するために使う。


# 2026-05-07 差分追記: Piece / Analysis value observation境界

Pieceは短縮要約ではなく、ユーザーが言いたいことを他者に伝わる形へ昇華する構造です。今回の差分では、`cocolon_value_observation_service.py` のsignalをPieceCoreQuestionAnswerPlanへ接続し、答えを不必要に短く潰さないためのmetaを追加した。

| file | 現状の役割 | 同時確認 |
|---|---|---|
| `emotion_piece_generation_service.py` | value observation signalからquestion / answerを作り、`must_keep_signal_keys` / `source_claims` / `answer_preservation_policy` / `overcompression_risk` をpiece_core metaへ保持 | `piece_generation_policy.py`, `piece_generated_display.py` |
| `piece_generation_policy.py` | `overcompression_risk` / `overcompression_blocked` / `value_observation_signal_keys` をpolicy metaへ追加し、短縮しすぎによる核消失を検出する | `api_emotion_piece.py`, `emotion_piece_store.py` |
| `analysis_report_validity_gate.py` | `value_observation_signal_keys` を抽出し、self_structure素材として扱えるようにする。emotion domainへmemo_action/self_structure素材を混ぜない | `api_analysis_reports.py`, `api_self_structure.py` |
| `emlis_context_anchor_service.py` | cross-core context anchor境界。value observationを人格断定として渡さない | `emlis_ai_world_model_service.py` |
| `test_emotion_piece_generation_value_observation.py` | Pieceのvalue observation生成と過圧縮防止を検証する | `emotion_piece_generation_service.py` |
| `test_analysis_value_observation_boundary.py` | Analysis validity gateのdomain境界を検証する | `analysis_report_validity_gate.py` |

Piece本文の長さは固定しない。禁止するのは長さではなく、`ユーザーが言いたい核が消えること` と `公開安全性を壊すこと` です。長文自己理解入力では、複数文の答えを許容し、source-scaled detailとして扱う。
