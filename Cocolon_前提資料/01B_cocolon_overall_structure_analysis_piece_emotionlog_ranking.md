> **11/6・最新§238：既存23／v10の一回23更新・14stopは完走したが、HC01／02が退行して新b8d096候補は不採用、元a2eを維持。HC生成8→6／全14生成12→10・mapped16→12、棄却source4→9。HC04–09＋既知control4の意味は保持。NLL低下を品質改善にしない。** [実結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-existing23-v10-bounded-20261106)／[本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/existing23_v10_trial_results.json)。新GPU／新教師は未選定、CPU欄診断もlocal／Jupyterで完了。STRUCTURE_MAP_DELTA_NONE。

> **11/6・最新§237：既存23教師のCPU audit／v10入力準備を完了。元target／source不変、candidate23／非生成再読23、typed12／unsupported11、実tokenizerとmask／予算を確認。LM／更新／DB0・private pack不採用、新runnerはsource完成・実行前review済、prepare／run未実行。新2診断sourceと本文なし集計の実file地図は末尾§237。** [結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-existing-teacher-v10-cpu-20261106)。STRUCTURE_MAP_DELTA_NONE（CPU診断・準備のみ）。

> **11/6・最新§236：固定v10／a2eの実4Bは10stop／1load／学習0。baseline API5efdは7要求が文章・図へ到達し、保存projectionのmock RPC28read一致。HC01の引用位置曖昧を既存admissionだけで修復したAPI c1502415は、同rawのCPU比較で4node／mapped2／未解析1へ到達し、不正modifierと他9件の結果を保持。local497 PASS＋11subtests、CI42217456387全工程success。修正版Jupyter同raw比較はexit0、保存reader32readも一致。** [実結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-heterogeneous-v10-live-20261106)／[本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/heterogeneous_scope_v10_results.json)。実file差分は末尾§236。STRUCTURE_MAP_DELTA_NONE（既存の位置束縛修復）。

> **11/6・§235時点：API 5efdafabはordinary本人補足の単一SELF希望を、自身の完全根拠で既存consumerへ接続。実file地図は末尾§235、320 PASS／CI42205450639全工程success。同packet10/10・候補reload10／mock RPC保存reader40read、モデル／DB0、Jupyter新結果は当時未回収。** [当時の範囲](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-supplement-wish-own-evidence-20261106)／[本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/supplement_wish_own_evidence_results.json)。STRUCTURE_MAP_DELTA_PRESENT（既存consumer責務の限定拡張、公開型／作者／文法／DB／RN／通常profile・transport不変）。

> **11/5開始・分析の履歴（第9回§214）：新規隔離targetで4vendor kernel bindingを実確認。固定API100c1bb／元a2eの3要求はwarmup候補保持、v7は6欄中field1だけで旧raw同一、v8は23秒signal14で未返却。1load／3開始／2stop、速度改善・全欄保持・意味品質は未証明。global base／商品source／通常選択を維持し、通常採用なし。version8保存済み。** [実結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-optional-kernel-diagnostic-20261105)。

> **11/3・分析の最新（第9回§112–113）：** 旧78教材/106順と初期9dcを保持し、学習入力をv3へ整合。106更新/156測定/53新stop/2loadを840.273622秒/exit0で完了。理由対照は2→4/4、元RU02の生成再現とCQ04範囲重複を修復。ROLE9pairは全文bytes保持。一方OA01 carrier退行/OD01誤時点/MD02不明→結果等が残り、新2c01は通常/次初期値不採用。全53/106保存再読・827元memberを照合保全。[全結果/原本/再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-aligned-v3-78-result-20261103)。次は適格本人source/回答条件→既存材料入力/意味gateの対応確認へ戻り、追加GPU未固定。通常HTTP/DB/RN/配置不変、本人基準/記録間接続は未完。

---
title: "01B_Cocolon_全体構造資料_Analysis_Piece_EmotionLog_Ranking系"
revision_date: "2026-05-26"
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `legacy-live`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `active`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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
- 現行状態: `retired-current-reference`
- 旧記載状態: `shared`
- 2026-05-09 実ファイル再照合: `Cocolon(138).zip` / `mashos-api_2(26).zip` にはこのpathは存在しない。current作業では、この旧sectionを直接の実ファイルownerとして扱わず、同doc末尾の current owner補正表を優先する。
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


# 2026-05-09 差分追記: self_structure / EmlisAI / 感情通知 current boundary

| file | 追加・更新された読み方 |
|---|---|
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | 今日の問い回答をself_structure素材に含める。`question_origin` / `personal_question_id` / `question_type` / `source_anchor` / hidden_meta をself-onlyで渡す。public snapshotへは出さない |
| `mashos-api/ai/services/ai_inference/analysis_engine_adapter.py` | `source_anchor` / `source_anchor_text` / `source_anchor_id` / `source_anchor_field` / `optional_free_text` を分析へadditive forwardingする |
| `mashos-api/ai/services/ai_inference/api_emotion_submit.py` | 感情通知Pushは、local/API-onlyではqueue defaultを高負荷mode依存にする。queue modeではAPI側Firebase credential gateでjob作成を止めない |
| `mashos-api/ai/services/ai_inference/.env.worker.example` | local/single worker例は `ASTOR_WORKER_PROFILE=all` とし、notification job `send_fcm_push_v1` をconsumeできる前提にする |

personal_followupで作られた問いは、ユーザー入力に実在する短い `anchor_text` を根拠にします。EmlisAIや分析で使う場合も、AIの解釈をユーザー発言として扱いません。


# 2026-05-09 実ファイル再照合: current owner補正

この表は `Cocolon(138).zip` / `mashos-api_2(26).zip` の実ファイル一覧と、この資料内の current 参照を照合した補正です。
旧本文内の `active` / `shared` / `legacy-live` 表記よりも、この表を優先します。旧名称はDB physical name / compat / 旧route説明として保管できるが、current実ファイルownerとしては扱いません。

| 旧参照path | 実ファイル照合 | current owner / 読み方 |
|---|---|---|
| `Cocolon/screens/DeepInsightScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js / Cocolon/screens/AnalysisContentFirstScreen.js。DeepInsight単独screenは今回local snapshotには存在しない。 |
| `Cocolon/screens/DiscoveriesHistoryDetailScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js。Discoveries専用history detailはcurrent fileとして存在しない。 |
| `Cocolon/screens/DiscoveriesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js。Discoveries専用history listはcurrent fileとして存在しない。 |
| `Cocolon/screens/EchoesHistoryDetailScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryDetailScreen.js |
| `Cocolon/screens/EchoesHistoryListScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js |
| `Cocolon/screens/MyModelDiscoveriesRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Discoveries screenは存在しない。RankingTop / PieceResonanceRanking / backend ranking viewsを優先する。 |
| `Cocolon/screens/MyModelEchoesRankingScreen.js` | local snapshot未収録 | Cocolon/screens/PieceResonanceRankingScreen.js |
| `Cocolon/screens/MyModelEntryScreen.js` | local snapshot未収録 | Cocolon/screens/PieceEntryScreen.js |
| `Cocolon/screens/MyModelMenuCommon.js` | local snapshot未収録 | Cocolon/screens/PieceMenuCommon.js |
| `Cocolon/screens/MyModelPromptTemplates.js` | local snapshot未収録 | 今回local snapshotには存在しない。PromptTemplate専用screenはcurrent surfaceから外れている。 |
| `Cocolon/screens/MyModelQuestionsRankingScreen.js` | local snapshot未収録 | current ranking surfaceでは単独Questions screenは存在しない。RankingTop / InputCountRanking / InputLengthRanking / PieceResonanceRankingを優先する。 |
| `Cocolon/screens/MyModelReactionHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/ResonanceHistoryListScreen.js / Cocolon/screens/ResonanceHistoryDetailScreen.js |
| `Cocolon/screens/MyModelReflectionsScreen.js` | local snapshot未収録 | Cocolon/screens/PieceLibraryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyModelScreen.js` | local snapshot未収録 | Cocolon/screens/PieceScreen.js / Cocolon/screens/PieceEntryScreen.js / Cocolon/screens/NexusScreen.js |
| `Cocolon/screens/MyWebContentFirstScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisContentFirstScreen.js |
| `Cocolon/screens/MyWebCrossLinkSection.js` | local snapshot未収録 | Cocolon/screens/AnalysisCrossLinkSection.js |
| `Cocolon/screens/MyWebEmotionAnalysisScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisEmotionScreen.js |
| `Cocolon/screens/MyWebEnsureClient.js` | local snapshot未収録 | Cocolon/screens/AnalysisEnsureClient.js |
| `Cocolon/screens/MyWebHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisHistoryScreen.js |
| `Cocolon/screens/MyWebInputHistoryMenuScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisInputHistoryMenuScreen.js |
| `Cocolon/screens/MyWebMenuCommon.js` | local snapshot未収録 | Cocolon/screens/AnalysisMenuCommon.js |
| `Cocolon/screens/MyWebReportHistoryScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportHistoryScreen.js |
| `Cocolon/screens/MyWebReportScheduleUtils.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportScheduleUtils.js |
| `Cocolon/screens/MyWebReportViewerScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisReportViewerScreen.js |
| `Cocolon/screens/MyWebScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisScreen.js |
| `Cocolon/screens/MyWebSelfStructureScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisSelfStructureScreen.js |
| `Cocolon/screens/MyWebTopScreen.js` | local snapshot未収録 | Cocolon/screens/AnalysisTopScreen.js |
| `Cocolon/screens/RankingAllUsersScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js と各ranking screen。AllUsers専用screenはcurrent fileとして存在しない。 |
| `Cocolon/screens/RankingMyModelMenuScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js |
| `Cocolon/screens/RankingPersonalUsersScreen.js` | local snapshot未収録 | Cocolon/screens/RankingTopScreen.js と current ranking screen群。PersonalUsers専用screenはcurrent fileとして存在しない。 |
| `Cocolon/screens/nexus/NexusReflectionCard.js` | local snapshot未収録 | Cocolon/screens/nexus/NexusPieceCard.js |
| `mashos-api/ai/services/ai_inference/api_ranking_mymodel_discoveries.py` | local snapshot未収録 | 今回local snapshotには存在しない。current ranking ownerは api_ranking.py / api_ranking_piece_views.py / api_ranking_piece_resonances.py / api_ranking_mymodel_views.py / api_ranking_mymodel_resonances.py。 |

# 2026-05-09 差分追記: Analysis / Nexus / Piece screen split boundary

RN巨大画面分割により、Analysis / Nexus / AnalysisReportViewer / PieceScreen は entry shell + submodule 構造として読む。route名、API route、DB境界は変更しない。

## Nexus split

| path | current role |
|---|---|
| `Cocolon/screens/NexusScreen.js` | Nexus entry shell。API呼び出しとstate ownerとして残る |
| `Cocolon/screens/nexus/nexusConstants.js` | Nexus tab / sort / label等の定数 |
| `Cocolon/screens/nexus/nexusNormalize.js` | feed / ranking / emotion log / recommendのnormalize |
| `Cocolon/screens/nexus/nexusRouteModel.js` | tab / route / owner filter / sort境界 |
| `Cocolon/screens/nexus/nexusHistoryModel.js` | history item構築とsort境界 |
| `Cocolon/screens/nexus/NexusHeader.js` | Nexus header表示 |
| `Cocolon/screens/nexus/NexusTodayEmotionSummary.js` | 今日の全体感情summary表示 |
| `Cocolon/screens/nexus/NexusTabBar.js` | Nexus tab表示 |
| `Cocolon/screens/nexus/NexusPieceFeedSection.js` | Piece feed UI section |
| `Cocolon/screens/nexus/NexusEmotionLogSection.js` | EmotionLog UI section |
| `Cocolon/screens/nexus/NexusRecommendSection.js` | recommend users UI section |
| `Cocolon/screens/nexus/NexusHistorySection.js` | history UI section |
| `Cocolon/screens/nexus/NexusOwnerPickerModal.js` | owner picker modal |
| `Cocolon/screens/nexus/NexusPieceCard.js` / `NexusEmotionRankingCard.js` | 既存card component。引き続きnexus配下で読む |

## Analysis report viewer split

| path | current role |
|---|---|
| `Cocolon/screens/AnalysisReportViewerScreen.js` | report viewer entry shell |
| `Cocolon/screens/analysisReport/analysisReportAccessPolicy.js` | subscription tier / paywall表示判定 |
| `Cocolon/screens/analysisReport/analysisReportConstants.js` | report viewer定数 |
| `Cocolon/screens/analysisReport/analysisReportFormatters.js` | emotion label、時間、JSON、range等のformat helper |
| `Cocolon/screens/analysisReport/analysisReportNormalize.js` | report payload正規化 |
| `Cocolon/screens/analysisReport/analysisReportHtmlExport.js` | HTML/PDF export helper |
| `Cocolon/screens/analysisReport/AnalysisReportCharts.js` | chart表示component |
| `Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js` | upgrade誘導card |

## Analysis screen split

| path | current role |
|---|---|
| `Cocolon/screens/AnalysisScreen.js` | Analysis entry shell |
| `Cocolon/screens/analysis/analysisRouteModel.js` | report type / menu route / self-structure mode helper |
| `Cocolon/screens/analysis/useAnalysisRouteState.js` | route stateと外部open params cleanup |
| `Cocolon/screens/analysis/useAnalysisUnreadBadges.js` | daily/weekly/monthly/selfStructure unread管理 |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | latest report取得、cache、home summary更新 |
| `Cocolon/screens/analysis/useAnalysisSelfStructureActions.js` | self-structure paywall guard / latest / history / view遷移 |
| `Cocolon/screens/analysis/useAnalysisTutorialOverlay.js` | tutorial step 8〜12とspotlight同期 |

## Piece home split

| path | current role |
|---|---|
| `Cocolon/screens/PieceScreen.js` | Piece home entry shell |
| `Cocolon/screens/piece/usePieceHomeGlobalSummary.js` | 全体活動summary取得 |
| `Cocolon/screens/piece/usePieceHomeTutorial.js` | tutorial create / overlay / tutorial piece保存 |
| `Cocolon/screens/piece/usePieceRecommendUsers.js` | recommend users取得・prefetch・Account遷移 |
| `Cocolon/screens/piece/PieceHomeActionCard.js` | Piece home action card wrapper |
| `Cocolon/screens/piece/PieceHomeMainActions.js` | main actions UI |
| `Cocolon/screens/piece/PieceTutorialCreateModal.js` | tutorial作成modal |
| `Cocolon/screens/piece/PieceRecommendModal.js` | recommend modal |

## 未分割として残るPieceLibrary

`Cocolon/screens/PieceLibraryScreen.js` は今回のcurrent snapshotではまだ分割未実施です。PieceLibrary作業では、設計書Phase 3の方針を別工程として扱い、NexusやPieceScreenの分割済みsubmoduleと混同しない。

# 2026-05-09 差分追記: Analysis / Report / Nexus / Piece 分割 current boundary

## AnalysisScreen split

| file | 役割 |
|---|---|
| `Cocolon/screens/analysis/analysisRouteModel.js` | report type / route / self-structure mode / date label helper |
| `Cocolon/screens/analysis/useAnalysisRouteState.js` | Analysis画面内route stateと外部open params cleanup |
| `Cocolon/screens/analysis/useAnalysisUnreadBadges.js` | daily / weekly / monthly / selfStructure unreadと既読登録 |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | latest report / report cache / home summary / today question summary更新 |
| `Cocolon/screens/analysis/useAnalysisSelfStructureActions.js` | self-structure paywall guard / latest / history / view遷移 |
| `Cocolon/screens/analysis/useAnalysisTutorialOverlay.js` | tutorial step 8〜12 / spotlight / Piece遷移 |

## AnalysisReportViewer split

| file | 役割 |
|---|---|
| `Cocolon/screens/analysisReport/analysisReportConstants.js` | report viewer用定数 |
| `Cocolon/screens/analysisReport/analysisReportAccessPolicy.js` | subscription tier / standard / deep 表示gate |
| `Cocolon/screens/analysisReport/analysisReportNormalize.js` | report payload / emotion map / time bucket / monthly phase 正規化 |
| `Cocolon/screens/analysisReport/analysisReportFormatters.js` | 日付・分数・JSON parse・range format等 |
| `Cocolon/screens/analysisReport/analysisReportHtmlExport.js` | PDF / HTML export helper |
| `Cocolon/screens/analysisReport/AnalysisReportCharts.js` | chart表示component |
| `Cocolon/screens/analysisReport/AnalysisReportUpgradeCard.js` | standard upgrade card表示 |

## Nexus split

| file | 役割 |
|---|---|
| `Cocolon/screens/nexus/nexusConstants.js` | Nexus tab / sort / owner filter定数 |
| `Cocolon/screens/nexus/nexusRouteModel.js` | tab / route / owner filter model |
| `Cocolon/screens/nexus/nexusNormalize.js` | piece / ranking / emotion log / recommend user正規化 |
| `Cocolon/screens/nexus/nexusHistoryModel.js` | history item / owner / sort helper |
| `Cocolon/screens/nexus/NexusHeader.js` | header表示 |
| `Cocolon/screens/nexus/NexusTodayEmotionSummary.js` | 今日の全体感情summary表示 |
| `Cocolon/screens/nexus/NexusTabBar.js` | tab UI |
| `Cocolon/screens/nexus/NexusPieceFeedSection.js` | Piece feed表示 |
| `Cocolon/screens/nexus/NexusEmotionLogSection.js` | EmotionLog表示 |
| `Cocolon/screens/nexus/NexusRecommendSection.js` | recommend user表示 |
| `Cocolon/screens/nexus/NexusHistorySection.js` | history表示 |
| `Cocolon/screens/nexus/NexusOwnerPickerModal.js` | owner picker modal |

## PieceScreen split

| file | 役割 |
|---|---|
| `Cocolon/screens/piece/usePieceHomeGlobalSummary.js` | Piece home全体活動summary取得 |
| `Cocolon/screens/piece/usePieceHomeTutorial.js` | tutorial create / overlay / tutorial piece保存 |
| `Cocolon/screens/piece/usePieceRecommendUsers.js` | recommend users取得・prefetch・Account遷移 |
| `Cocolon/screens/piece/PieceHomeActionCard.js` | Piece home action card wrapper |
| `Cocolon/screens/piece/PieceHomeMainActions.js` | Library / EmotionLog / tutorial等のmain action UI |
| `Cocolon/screens/piece/PieceTutorialCreateModal.js` | tutorial作成modal |
| `Cocolon/screens/piece/PieceRecommendModal.js` | recommend modal |

`AnalysisScreen.js`、`AnalysisReportViewerScreen.js`、`NexusScreen.js`、`PieceScreen.js` はentry shellとして残ります。API route、request / response shape、navigation route名、UnreadContext key、tutorial fixture境界は変更しません。`PieceLibraryScreen.js` はこのcurrent基準では未分割の主要ownerとして残る。


# 2026-05-11 差分追記: PieceComposer / AnalysisComposer 接続

`mashos-api_15(2).zip` では、PieceとAnalysisの文章出力に共通文章生成基盤が接続されています。これはEmlisの話しかけ文体を流用する変更ではありません。

| 中核 | 接続file | 読み方 |
|---|---|---|
| Piece | `cocolon_text_generation_core/adapters/piece_composer.py` / `piece_composer_input_contract.py` / `emotion_piece_generation_service.py` / `piece_generation_policy.py` | `question` と `answer` を分け、`source_claims` / `must_keep_signal_keys` / `overcompression_risk` を保持して共通Guardへ通す。`piece_text` と preview/publish同一性は維持 |
| Analysis | `cocolon_text_generation_core/adapters/analysis_composer.py` / `analysis_composer_input_contract.py` / `analysis_report_validity_gate.py` / `api_analysis_reports.py` | `emotion_structure` と `self_structure` の素材domainを分け、診断・断定・人格決めつけ表面をGateで落とす。`content_json` / `standardReport` / `contentText` は維持 |

Piece作業時は過圧縮防止、Analysis作業時は非診断・非断定を最初に確認する。

# 2026-05-12 差分追記: Analysis こころ天気 current boundary

`Cocolon_6(29).zip` / `mashos-api_6(13).zip` では、Analysisの感情分析側に「こころ天気」UIとpayloadが追加されています。これはAnalysis visible名やroute名の変更ではなく、感情分析レポートの **表示名・要約・視覚化** の拡張です。

## RN追加 / 変更owner

| file | current role |
|---|---|
| `Cocolon/screens/analysisReport/KokoroWeatherCurrentCard.js` | Analysisトップに表示する「今のこころ天気」カード。`ok` / `no_observation` / `error` をfail-closed表示する |
| `Cocolon/screens/analysisReport/KokoroWeatherForecastStrip.js` | レポート内の横並びこころ天気図。`content_json.kokoroWeather.items` を日/週/月の粒度で表示する |
| `Cocolon/screens/analysisReport/KokoroWeatherDetailModal.js` | 対象日/週をタップした時の時間帯別こころ天気Modal。深夜/朝/昼/夜を横スクロールで表示する |
| `Cocolon/screens/analysisReport/kokoroWeatherFormatters.js` | `weather_key`、温度表示、感情比率、観測メモ、fallback文言、`isKokoroWeatherReportRecord` の正式表示対象判定境界 |
| `Cocolon/screens/AnalysisContentFirstScreen.js` | `entryMeta.currentWeather` を受け取り、トップ上部にCurrentCardを表示。日/週/月タブの表示名をこころ天気へ更新 |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | `content_json.kokoroWeather` が成立する時だけForecastStripとDetailModalを表示。旧感情分析本文へfallbackしない |
| `Cocolon/screens/AnalysisEmotionScreen.js` / `AnalysisReportHistoryScreen.js` | 感情分析メニュー・履歴の表示名を `こころ天気（日/週/月）` へ更新 |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | `/analysis/home-summary` から `current_weather` を取得し、`entryMeta.currentWeather` へ保持 |

## Backend追加 / 変更owner

| file | current role |
|---|---|
| `mashos-api/ai/services/ai_inference/kokoro_weather_service.py` | こころ天気生成の集約service。current_weather、report kokoroWeather、time buckets、観測メモ判定、温度表示を提供する |
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | `/analysis/home-summary` に `current_weather` をadditive追加。既存 `weekly` / `monthly` / `input_status` は維持 |
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | 日/週/月レポート生成時に `content_json.kokoroWeather` をadditive追加し、タイトルを `こころ天気（日/週/月）` 表示へ寄せる |
| `mashos-api/ai/services/ai_inference/api_cron_distribution.py` | レポート配布Push文言をこころ天気表示へ寄せる。cronの生成・queue境界は維持 |

## 読み方

- こころ天気化する対象は感情分析のみです。`SelfStructure*` / 自己分析は既存の自己分析・自己構造として読む。
- `daily` / `weekly` / `monthly` は内部キーとして維持します。表示名だけ `こころ天気（日）` / `こころ天気（週）` / `こころ天気（月）` へ寄せます。
- `current_weather` と `kokoroWeather` は additive field です。既存レポートや旧フロントが無視しても壊れない構造として読む。
- `観測メモあり` は注意報ではありません。未来予測ではなく、過去〜現在の揺れ幅・切り替わり・混在を示す観測ラベルです。

# 2026-05-13 差分追記: Analysis 旧感情分析レポート非表示 owner

`Cocolon_4(22).zip` / `mashos-api_4(16).zip` では、こころ天気として成立していない旧感情分析レポートを、最新表示・履歴・detail・weekly-days・unread・cacheから外す実装が入っています。新規fileは増えておらず、既存ownerの責務が更新されています。

## Backend変更owner

| file | current role |
|---|---|
| `mashos-api/ai/services/ai_inference/api_analysis_reports.py` | `KOKORO_WEATHER_SCHEMA_VERSION = "kokoro.weather.v1"` と `_is_kokoro_weather_report_row` を持つ。ready projection / include_body latest / detail APIで旧感情分析レポートを除外し、cache keyへ `kokoro_weather_only` とversionを入れる |
| `mashos-api/ai/services/ai_inference/api_analysis_reads.py` | `/analysis/reports/{report_id}/weekly-days` で `kokoroWeather` 不成立の旧週レポートを404にする。`current_weather` は従来どおり `/analysis/home-summary` で返す |
| `mashos-api/ai/services/ai_inference/api_report_reads.py` | `analysis-unread-status` の daily / weekly / monthly 抽出でこころ天気レポートだけを未読対象にする。projection aliasでも判定し、cache keyへ `kokoro_weather_only` とversionを入れる |
| `mashos-api/ai/tests/test_analysis_report_kokoro_weather.py` | helper、ready projection、ready latest body、detail、weekly-days、unreadの旧レポート除外を確認する |
| `mashos-api/ai/tests/contract/test_publish_governance.py` / `test_contract_snapshots_phase6e.py` | ready artifact / unread / contract fixtureがこころ天気成立payloadを持つ前提へ更新されている |

## Frontend変更owner

| file | current role |
|---|---|
| `Cocolon/screens/analysisReport/kokoroWeatherFormatters.js` | `isKokoroWeatherReportRecord(report)` を追加。`content_json.kokoroWeather`、snake_case互換、`standardReport`内payload、projection aliasを読んで表示可否を判定する |
| `Cocolon/screens/analysis/useAnalysisReportActions.js` | latest cache namespaceを `cocolon:kokoroWeatherLatestReport:v1` に変更。旧 `cocolon:analysisLatestReport` は読まず、cache read/writeもこころ天気成立レポートだけ対象にする |
| `Cocolon/screens/AnalysisReportHistoryScreen.js` | ready API結果を受けた後もfrontend側で保険filterし、開く/Export時はdetail APIで本体を取り直す。旧レポートは「現在の表示対象外」として開かない |
| `Cocolon/screens/AnalysisReportViewerScreen.js` | 遷移stateで旧レポートが渡っても `content_text` / `standardReport.contentText` を表示しない。weekly-days fallbackも表示対象外では呼ばない |
| `Cocolon/screens/AnalysisContentFirstScreen.js` / `AnalysisScreen.js` | latestReportsやcacheから旧レポートへfallbackしない |
| `Cocolon/lib/accountLocalCleanup.js` | 退会後cleanupで旧 `cocolon:analysisLatestReport` と新 `cocolon:kokoroWeatherLatestReport:v1` の両prefixを削除する |
| `Cocolon/lib/compat/legacyWireContracts.js` | analysis detail path helperを追加し、weekly-days pathをdetail path helperから組み立てる |
| `Cocolon/tests/rn-screen-contracts.test.js` | cache namespace、history / viewer fail-closed、formatter guard、cleanup、detail path helperのcontractを確認する |

この差分以後、`content_json.kokoroWeather` がない旧感情分析レポートは、こころ天気画面の「互換表示」ではなく「表示対象外」として扱う。DB rowの物理削除やDB名renameは行わない。

## 2026-05-13 差分追記: Analysis / わたしマップ current owner

最新実ファイルでは、自己分析のユーザー向け surface は `わたしマップ` として読ませる。内部上は引き続き `SelfStructure*` screen、`/self-structure/*` API、`myprofile_reports` physical name を保持する。

### 追加 frontend owner

| file | current owner / relation | 同時確認 |
|---|---|---|
| `Cocolon/components/selfStructure/WatashiMapRenderer.js` | `content_json.watashiMap` の表示 owner。overview / role_switches / routes / crossroads / unknown_areas / lock card を構成する。 | `SelfStructureReportGenerateScreen.js`, `SelfStructureReportViewerScreen.js`, `AnalysisContentFirstScreen.js`, `watashiMapFormatters.js` |
| `Cocolon/components/selfStructure/WatashiMapOverviewCard.js` | `今のわたしマップ` の概要カード。場面・役割・行動傾向・観測量を表示。 | `WatashiMapRenderer.js` |
| `Cocolon/components/selfStructure/RoleSwitchList.js` | `役割スイッチ` 一覧。場面×役割×観測量を表示。 | `watashiMapFormatters.js` |
| `Cocolon/components/selfStructure/RoutePatternCard.js` | `よく通るルート` の step 表示。 | `WatashiMapRenderer.js` |
| `Cocolon/components/selfStructure/CrossroadCard.js` | `迷いやすい分かれ道` の表示。 | `WatashiMapRenderer.js` |
| `Cocolon/components/selfStructure/UnknownAreaCard.js` | `まだ地図にない場所` の表示。 | `WatashiMapRenderer.js` |
| `Cocolon/components/selfStructure/watashiMapFormatters.js` | `watashiMap` normalize、旧 `selfStructureDeepVisual` adapter、content_text fallback、lock projection。 | `WatashiMapRenderer.js`, Generate / Viewer screens |
| `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` | tier / history / detail / mode label の境界。History / Viewer の import path と一致。root `components/watashiMapAccessPolicy.js` は同内容の互換copy。 | `SelfStructureReportHistoryScreen.js`, `SelfStructureReportViewerScreen.js`, `rn-screen-contracts.test.js` |

### 変更 frontend owner

| file | 差分 |
|---|---|
| `Cocolon/screens/AnalysisContentFirstScreen.js` | self tab を `わたしマップ` 表示にし、Free でも `light` 概要を表示する。 |
| `Cocolon/screens/AnalysisSelfStructureScreen.js` | メニュー見出しと導線を `わたしマップ` / `今のわたしマップ` / `わたしマップの履歴` に寄せる。 |
| `Cocolon/screens/analysis/useAnalysisSelfStructureActions.js` | latest は Free を完全遮断しない。detail/history は tier 別 lock に寄せる。 |
| `Cocolon/screens/SelfStructureReportGenerateScreen.js` | `WatashiMapRenderer` を使い、`概要 / 標準マップ / 深いマップ` を表示する。 |
| `Cocolon/screens/SelfStructureReportViewerScreen.js` | `watashiMap` 優先表示、旧 payload fallback、detail report lock を扱う。 |
| `Cocolon/screens/SelfStructureReportHistoryScreen.js` | Free/Plus/Premium の履歴境界と PDF 表記を `わたしマップ` に寄せる。 |
| `Cocolon/guide/guidesJa.js`, `guide/termsJa.js`, `tutorial/*` | 旧 `自己分析` 直出しを減らし、`わたしマップ` の説明・fixture を追加する。 |

# 2026-05-15 差分追記: わたしマップaccess policy配置補完 / Analysis Home refresh signal

最新実ファイル `Cocolon_7(10).zip` では、わたしマップとAnalysis Home refreshに関係するRN pathを前提資料へ明示する。

| file | 構造上の意味 |
|---|---|
| `Cocolon/components/selfStructure/watashiMapAccessPolicy.js` | わたしマップの tier / report_mode / history / detail lock policy。`SelfStructureReportHistoryScreen.js` と `SelfStructureReportViewerScreen.js` が参照する現行配置。root copyと同内容で、前回のimport path mismatch watchは解消済みとして読む。 |
| `Cocolon/lib/analysisHomeSummaryRefreshSignal.js` | 入力保存後にAnalysis Home Summaryをbest-effortでdirty化し、`AnalysisScreen.js` 側でconsumeするRN local refresh signal。API route / DB / 保存構造は変更しない。 |

## 読み方

- `components/selfStructure/watashiMapAccessPolicy.js` は、`SelfStructureReportHistoryScreen.js` / `SelfStructureReportViewerScreen.js` が参照する現行owner。前回資料にあった「root配置とimport pathの不一致」watchは、最新zipではselfStructure配下にも同一policyがあるため解消済みとして読む。
- `lib/analysisHomeSummaryRefreshSignal.js` は保存後のHome/Analysis表示更新を助けるlocal signalであり、Analysis report生成・DB write path・API routeを変更しない。


# 2026-05-26 差分追記: Piece / Analysis へのEmlisAI状態回答温度流入禁止境界

Phase10横断contractでは、EmlisAI状態回答と人間的フォローのmaterialをPiece / Analysisへ流さない境界が追加されています。これはPiece / Analysisの機能追加ではなく、中核別Composerの役割分離を守るための回帰固定です。

| owner | 境界 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer.py` | Pieceは公開可能な一問一答・核保持のためのComposerであり、Emlisの感想文や状態回答フォロー層を表示文体として使わない。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/piece_composer_input_contract.py` | Piece input contractへEmlisAI state answer / human follow / special handling materialを混ぜない。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py` | Analysisは期間観測・構造整理のComposerであり、EmlisAIの「Emlisには」等の話しかけ温度を流用しない。 |
| `mashos-api/ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer_input_contract.py` | Analysis input contractへEmlisAI state answer materialを混ぜない。 |
| `tests/contract/test_emlis_state_answer_phase10_cross_contract_regression.py` | Piece / AnalysisがEmlisAI状態回答materialをimportしないこと、public responseにinternal material keyを出さないことを固定する。 |

禁止: PieceをEmlisの観測文へ寄せる、Analysisを単発状態回答へ寄せる、`Emlisには` / `Emlisは` / `Emlisの感想` 系の温度をPiece / Analysisへ流用する、状態回答materialをpublic key化する。


### 2026-10-22 Piece P-W1：明示iOS版preview/savedの共通描画

STRUCTURE_MAP_DELTA_PRESENT。新tracked fileは増やさず、次の既存ownerへ責務を置く。

| 既存path | 今回のsource責務 |
|---|---|
| `features/piece/pieceLayout.js` | 新外部renderer identityと内部bitmap profileの対応、preview/saved別key、同じcatalog/B9/描画入力。旧saved v3を保持。 |
| `features/piece/piecePalette.js` | 11/4追加。テーマID・名前・固定の背景色と文字色の組を、API応答検証・作成画面・本人履歴・画像描画で共有。既存2組の値を維持し、対応版の有料プランに10組を追加。 |
| `features/piece/pieceExportPngProfile.js` | 対応APIで書き出し記録が有効な場合、iOS出力の寸法・PNGのsRGBメタデータを確認する。本文・画像の転送なし。 |
| `features/piece/pieceRenderer.js` | 閉preview/hash/expiry/catalog・iOS・必要native interfaceを純粋に確認するeligibility predicate。HTTPや描画を行わない。 |
| `components/piece/PieceVisualCard.js` | 同profileのpreview/saved描画と失効。元8秒内の完成を要求し、preview fit期限を維持。新formal savedの完成像だけは8秒後も保持し、saved fitを発行しない。 |
| `screens/InputScreen.js`／`screens/input/InputPieceActionArea.js` | 既存hostへのpredicate供給と、既存same mount/token fit・owner/flag/quotaの保存直前二重確認。 |
| `features/piece/pieceExport.js` | 新formal版exportを明示拒否し、旧v3 exportを維持。 |

付随検証は `tests/piece-v2-renderer.test.js`、`tests/piece-v2-input-screen.test.js`、`tests/piece-v2-initial-save-host.test.js`、`tests/piece-v2-export.test.js` と既存native entry/fixtures/iOS XCTest/runnerの8path。旧195/新44・旧RN13/bitmap12の期待を保持し、新版preview8/saved8/crop1とsaved完了後8秒超保持の条件を追加する。native製品、API/DTO/DB/SQL/稼働構成は変更しない。local964 PASS、JSX/runner/旧fixture不変確認、新source一度CIはPENDING。詳細はPiece入口§110／map§65.55／weekly§5.6.35であり、source準備を通常保存/画像共有/本人実機の商品完成へ換算しない。


## 2026-10-22 Piece P-W2：通常本人詳細と新iOS版全canvas書出し

STRUCTURE_MAP_DELTA_PRESENT。

| 既存owner | 今回の責務 |
|---|---|
| screens/PieceOwnerHistoryScreen.js | 明示準備/fresh同record、本人/実効flag/lifecycle、準備失敗とPhotos/Share結果の元record帰属 |
| components/piece/PieceExportCanvas.js | 既存固定canvasとcurrent/失敗通知 |
| components/piece/PieceVisualCard.js | 明示saved export、同root/bitmap/artifact/snapshot/generationのcapture target、期限内完成後保持 |
| features/piece/pieceLayout.js | 新明示iOS版savedの同profile全canvas export、旧版/未知/Android境界 |
| features/piece/pieceExport.js | fresh owner再取得、実renderer metadata、private token/binding付きPNG、既存Photos/Share/cleanup |
| ios/tempCocolon/PieceTextMetrics.mm | bitmap viewのprivate capture identity。新bridge methodは追加しない |
| patches/react-native-view-shot+5.1.1.patch | Piece-only private option二項、同native blockの前後token/config/子所属検査。旧caller保持 |
| tests/piece-v2-{export,owner-history,renderer}.test.js | 同record/flag/本人/lifecycle/結果帰属/失効と完成saved8秒超の検査 |
| tests/native/piece-rn-canvas-{entry.js,fixtures.cjs,ios.m}/run-piece-rn-canvas-ios.sh | 旧3group不変、新export14を別検証。offscreen実view-shotと同saved PNG/RGBA、native拒否6 |

local13suite979成功。新一度CIは未実行、元8秒・native195/44・旧RN期待を維持する。API/DTO/DB/env/flag/deploy/実OS/配布/main変更0。全変更pathはmanifest、詳細は入口§111/map§65.56/weekly§5.6.36。


## 2026-11-01 累積わたしマップの接続差分

通常latest→API analysis_cumulative_service→全期間source→既存CMEE compiler/作者→immutable analysis_observed_artifacts(cumulative.v1)→analysis_cumulative_months。月indexで当時の同一文章/図を保存し、現在map共通/月次閲覧2/12/全・プラン変更保存維持を実装。詳細はcurrent_structure/03と設計04#analysis-cumulative-monthly-v1、最新weekly§44。

新規file地図：
- Cocolon `components/selfStructure/CumulativeWatashiMapView.js`：現在/当時/比較/根拠の共通画面。Generate/Viewer通常入口から接続。
- Cocolon `components/selfStructure/cumulativeMapContract.js`：累積profile/件数/保存identity/projectionのclient境界。
- Cocolon `tests/analysis-cumulative-map.test.js`：React実表示とowner/tier/月/根拠の遅着検査。
- mashos-api `ai/services/ai_inference/analysis_cumulative_service.py`：全期間生成/保存/再読/履歴/根拠のowner。
- mashos-api `supabase/migrations/20261101080144_cumulative_watashi_map.sql`：累積RPC/月参照と閲覧rank/削除寿命。
- mashos-api `ai/tests/test_analysis_cumulative.py`・`test_analysis_cumulative_jobs.py`・`analysis_cumulative_sql.cjs`：実compiler/SQL/Q3/既存jobの検証。

既存変更owner：api_self_structure/reports、report_artifact_read_service、astor_material_snapshots、emlis_thread_service、intent_compiler、astor_self_structure_report、api_emotion_submit、astor_worker、api_cron_distribution、appの旧infer分岐、subscription_bootstrap_store。RNはGenerate/History/Viewer/V2Renderer、wire/access、analysis入口、guide/terms、iapRuntimeCatalog。旧periodやこころ天気/他coreを新累積の受入れへ昇格しない。実配置/配布/残件はweekly§44に分離。


## 2026-11-01 Analysis model field probe — 全変更file地図

新production fileは0。API既存5owner：`ai/services/ai_inference/analysis_cumulative_service.py`（明示prepare/model_inputと実graph coverage）、`cocolon_meaning_experience_engine/engine.py`（明示private型dispatch）、同`cores/analysis/semantic_admission.py`（完全source要求/受信/Safety/全field/finish拒否）、同`intent_compiler.py`（ObservedQuotedField/任意quoted node）、同`observed_route_realizer.py`（artifact owner/集合/member/版/全文根拠照合から本人限定分類候補表示）。旧有限/P5/default経路は維持。

新test：API `ai/tests/test_analysis_model_fields.py`（束縛/変異/補足訂正比較Safety/未解析/実SQL保存非生成再読）。新資料：`Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/{README.md,probe_requests.json}`（未実行GPU案と完全架空要求2件）。詳細設計01/04/05/06、current maps03/04、全機能00、最新weeklyを同期。対象785PASS、実4B/通常有効化/DB/RN変更0、商品品質未成立。STRUCTURE_MAP_DELTA_PRESENT。

## 2026-11-02 — Analysisの番号・分類だけの明示offline接続

前回の位置/長ID転記による実raw受理0/4を受け、CPU側に新private `analysis_model_field_kinds.v1` を接続。モデルは入力順1..Nの番号とnode_kindだけ、元原文/位置/根拠は既存sourceから再導出する。実call前のrequest/messages hashと返却raw/finish/hashをtrusted callerが保存し、別request/版/guardやraw差替えを新受口で拒否する。署名/自己認証ではない。v1 raw修復/自動fallbackなし。

API `f7a1389679f15dbb9f24c40c0c5ac0058423c106` の既存製品3owner：`ai/services/ai_inference/analysis_cumulative_service.py`（明示prepare/build）、`cocolon_meaning_experience_engine/engine.py`（新exact型dispatch）、同`cores/analysis/semantic_admission.py`（新private input/response型2・strict reader・既存graph構築共有）。既存intent_compiler/唯一realizer/storage ownerを維持。全unparsed/関係0/AS_WRITTEN_UNRESOLVED/分類候補表示、通常ensure/旧finite/P5/公開API/DB/RNは不変。

新file地図：API `ai/tests/test_analysis_model_field_kinds.py`（call/元source束縛・strict番号/JSON・旧互換・実隔離SQL保存再読）。Cocolonの既存trial配下に `field_kinds_probe_requests.json`（新形式の既見架空AF01/02）、`field_kinds_probe.py`（未実行の新4call/600秒one-shot）、`field_kinds_cpu_example.json`（合成graph/文章/coverage）、`field_kinds_cpu_results.json`（重複除外のCPU実結果）を追加。新production owner/別作者/公開wire/DB/RN/依存定義0。

最終819PASS（新34＋旧785）、共有owner identity別1PASS、FAIL/SKIP0。合成candidate→既存graph→隔離SQL commit→同図/文章/IDの生成禁止current/monthly再読・元source削除purgeを確認。実4B改善/意味品質/商品合格ではない。次GPUは新4生成/追加学習0/最大600秒の具体案まで、今回実行0。詳細はAnalysis04#analysis-model-field-kinds-v1、trial README#field-kinds-cpu-20261102、weekly§48。STRUCTURE_MAP_DELTA_PRESENT（新明示private wire/inputと既存graph責務の接続）、限定TECHNICAL_CREDIT/商品0/正式0/3/54.50％据置。


## 2026-11-02 — 意味単位の設計候補と説明file（runtime変更0）

既存Analysis設計04へ[analysis-model-units-proposal-20261102](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#analysis-model-units-proposal-20261102)を提案として追加。新fileは `Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/semantic_units_cpu_example.json`（公開済み架空例の手設定unit/qualifierを元source座標へ戻した説明用データ、実モデル/教師/新受口ではない）。新production owner0。source/graph/唯一realizerの既存5ownerを使う将来のCPU実装案であり、新private契約は承認前・未実装。通常ObservedGraph/safe projection/P5/field-kinds/DB/RNは変更しない。現在地は00/current03/04/weekly§50。STRUCTURE_MAP_DELTA_NONE（提案navigationと説明fileのみ）。


## 2026-11-02 — private意味候補の全変更file地図

API fa995a44、STRUCTURE_MAP_DELTA_PRESENT。新production fileは0。通常累積/API/DB/RNは未切替。

| exact path（mashos-api） | 責務/接続 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | analysis_model_units.v1、新input/response、部分引用/親/qualifierのsource再束縛、private file state |
| 同`intent_compiler.py` | immutableな候補graph/field/unit/qualifier。通常ObservedGraphへ混ぜない |
| 同`observed_route_realizer.py` | 唯一作者の全文併記private候補arm、保存表現の照合 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py` | 新exact input型の明示offline dispatch |
| `ai/services/ai_inference/analysis_cumulative_service.py` | 新prepare/build、全coverage付き同file serialize/reload。通常ensureは不変 |
| `ai/tests/test_analysis_model_units.py` | 合成41件、引用/従属/全文/改竄/生成禁止再読/coverage。教師や商品受入れではない |

実結果/再開は[trial](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#semantic-units-implemented-20261102)とweekly§51。今回の前提資料差分は全機能00/本01B/current03/04/設計04/05/weekly/trialと実行runner/要求/CPU結果に置く。


11/2後続API cddf1855：上記semantic_admission/service/testの既存3file内で指示版baseline/clarifiedと保存v1/v2を分離。新production file/作者/storage ownerは追加しない。旧実artifact再読と対象113件成功、実分解品質は未成立。trial/weekly§52へ。


11/2隔離学習のsource地図：`observation_learning/trials/2026-11-01-analysis-model-fields/semantic_units_teaching8_plan.json`が新架空8教材/未使用4入力/16更新の定義、`semantic_units_teaching8_run.py`が固定base→新LoRA→保存非学習reload→前後比較を同じJupyterで実行する一回用runner。新production owner/通常API接続なし。旧教材/weightsは保全。trial/weekly§53へ。


11/2隔離学習継続の地図差分：trial `semantic_units_teaching8_results.json` は初回16更新/実生成/意味読解/重みidentity、`semantic_units_teaching16_plan.json` は既存8＋新8教師/開発既見4＋新診断4/32更新、`semantic_units_teaching16_run.py` は先のAnalysis adapterから別保存への継続owner。既存adaptive_loss.pyをexact SHAで再利用。商品source/通常接続の新ownerなし。trial/weekly§54参照。


11/2第二継続の地図：trial `semantic_units_teaching16_results.json` が32更新/全8raw読解/identity、`semantic_units_teaching32_plan.json` が旧16＋新16/64更新/開発8＋教師自由生成4、`semantic_units_teaching32_run.py` が保存Analysisから別adapterへ継続するowner。既存production owner/DB/RN接続変更なし。trial/weekly§55。


11/2局所予測点検の地図：trial `semantic_units_teaching32_results.json` は64更新/開発8＋学習済み4の全読解、`semantic_units_alignment_plan.json` は固定元fileSHA/同重み/6forward、`semantic_units_alignment_probe.py` は既存serving loaderのmodel/tokenizerで非学習token予測を読む限定runner。新商品owner/通常接続なし。trial/weekly§56。


11/2固定教材適合の地図：trial `semantic_units_alignment_results.json` が6forwardの全token局所予測/元失敗/解釈、`semantic_units_fixed32_plan.json` が同32教師完全不変/128更新/DEV8＋学習済み4、`semantic_units_fixed32_run.py` が保存Analysisから別重みへ一回継続。通常source/DB/RN owner変更なし。trial/weekly§57。


11/2最終実結果の地図：trial `semantic_units_fixed32_results.json` が固定32/128更新/全12raw読解/10保存再読/71file保全/重みidentityの結果owner。既存 `semantic_units_fixed32_plan.json` と `semantic_units_fixed32_run.py` のrunは完了済み、再実行しない。旧分析用重みを含むprivate原本はtrial/weekly§58から辿る。通常source/DB/RNの新ownerなし。


## 2026-11-02 — 親quoteをsource内部位置へ束縛する明示private契約

API86d19b6d、STRUCTURE_MAP_DELTA_PRESENT。通常の累積mapは不変。新analysis_model_units_quoted_parents.v1は親の逐語quoteを同field返却unit exact1へ対応させ、source側が内部list位置を導出して既存private候補graph/compiler/唯一realizerへ渡す。新exact Input/Response/ref/schema/state/file、全source/guard/raw/messages束縛、親cycle/depth/UNKNOWN根/引用一意性を保持。旧rawの補修・旧形式fallbackなし。新形式の実4B/学習は未実行、全unparsed/actor未解決/route0、通常HTTP/DB/RNへ未接続。

変更owner：`ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py`（新要求/strict受口・専用保存再読）、`ai/services/ai_inference/cocolon_meaning_experience_engine/engine.py`（新exact型dispatch）、`ai/services/ai_inference/analysis_cumulative_service.py`（新専用prepare/build/serialize/reload）。新production file0、新test `ai/tests/test_analysis_model_quoted_parent_units.py`。compiler/realizerの意味型・通常責務は不変。CPU対象283PASS/3WASM SKIP、旧実87保存payload再読と新56合成派生の同field/文章/図/coverageを確認。実モデル品質・商品受入れではない。設計はAnalysis04#analysis-quoted-parent-units-plan-20261102、全結果/限界/次工程はtrial#analysis-quoted-parent-units-cpu-20261102とweekly§66。

新trial file地図（observation_learning/trials/2026-11-01-analysis-model-fields配下）：`semantic_units_scope56_plan.json`・`semantic_units_scope56_run.py`・`semantic_units_scope56_cpu.json`・`semantic_units_scope56_results.json`は56教材GPU比較の準備/実行/結果。semantic_units_quoted_parent_targets.jsonは同旧56合成教師の親quote形式派生（GPU計画ではない）、semantic_units_quoted_parent_cpu.jsonはCPU実検証と旧保存互換記録、semantic_units_quoted_parent_cpu_example.jsonは合成9unit/7qualifierの専用file保存例。実raw/重み152原本はprivate保存先をresults.json/READMEで参照し、GitHub本文へmodelrawを複製しない。


11/2 mixed60のtrial file地図（同trial配下・商品runtime owner追加なし）：`semantic_units_mixed60_prepare.py`は旧58不変＋MX2/MD2のCPU束縛/保存再読/実tokenizer、`semantic_units_mixed60_plan.json`は60教材/20評価/固定66順/上限、`semantic_units_mixed60_cpu.json`は実確認結果、`semantic_units_mixed60_run.py`は一候補の有限GPU比較、`semantic_units_mixed60_supervisor.py`は既存source/初期値/旧16before照合・CPU候補と全原本/重み回収。実結果は`semantic_units_mixed60_results.json`、保存reader検証は`semantic_units_mixed60_saved_replay.py/json`、次のCPU教材は`semantic_units_other_actor_cpu_run.py`と`semantic_units_other_actor_cpu.json`（root合成2例と同保存payload）。意味と次の再開点はtrial README#analysis-mixed60-result-20261102/weekly§74。STRUCTURE_MAP_DELTA_NONE（既存private内容比較の実験file案内）。


11/2 other62のtrial file地図（同trial配下）：`semantic_units_other62_prepare.py`は旧60不変＋OA2/OD2のCPU束縛/実保存非生成再読/実tokenizer、`semantic_units_other62_plan.json`は62教材/24評価/68順/初期f982/上限、`semantic_units_other62_cpu.json`は62件実確認、`semantic_units_other62_run.py`は68更新/新28生成の一候補、`semantic_units_other62_supervisor.py`はsource2134/loader/初期値/旧20before照合と全原本/112重み回収。trial README#analysis-other62-plan-20261102/weekly§75。GPUは準備時点未実行、STRUCTURE_MAP_DELTA_NONE（商品runtime owner追加なし）。


11/2 other62完了の地図：同trial `semantic_units_other62_results.json`は68更新/28生成/全48rawの読解と全270原本/112重みidentity、`semantic_units_other62_saved_replay.py/json`は別CPU process保存45candidate/3拒否の非生成照合。prepare/plan/runner/supervisorのGPUrunは完了、再実行しない。次のactor/predicate文脈別診断は本結果checkpoint後に別計画へ固定する段階。README#analysis-other62-result-20261102/weekly§76、STRUCTURE_MAP_DELTA_NONE（商品owner変更なし）。


11/2 actor/predicate診断のtrial file地図（同trial配下）：`semantic_units_actor_predicate_prepare.py`は2元文脈×主語2×動詞2のsource/ref生成と4保存結果identity/実tokenizer、`semantic_units_actor_predicate_plan.json`は8source/6新/4再利用/12新call/2保存重み/300秒、`semantic_units_actor_predicate_cpu.json`は実CPU照合、`semantic_units_actor_predicate_run.py`は追加学習0の一回生成とpartialを含む原本回収。README#analysis-actor-predicate-plan-20261102/weekly§77。準備時GPU未実行、STRUCTURE_MAP_DELTA_NONE。


11/2 actor/predicate診断完了のtrial地図：`semantic_units_actor_predicate_results.json`は新12/再利用4の16raw読解・局所scope比較・全66原本identity、`semantic_units_actor_predicate_saved_replay.py/json`は別CPU processの保存7candidate/9拒否照合。runは完了、再実行しない。次の`semantic_units_scope_contrast_cpu_run.py/json`は旧62不変で新actor/2文脈×否定/肯定/名詞対象SC6のstrict/実file非生成再読/実tokenizerと合成payloadを保有。次GPU計画/新製品ownerではない。README#analysis-actor-predicate-result-20261102/weekly§78、STRUCTURE_MAP_DELTA_NONE。

<a id="analysis-selected-category-context-files-20261102"></a>
## 2026-11-02 — 選択カテゴリ接続の変更file地図

API2c259f0e、STRUCTURE_MAP_DELTA_PRESENT。新production file/ownerなし。API `2c259f0e33abcd70cf353a8f53af3dc3b06eb63e`へコード反映済み。[既存CI 41437730142](https://github.com/MassyuRed/mashos-api/actions/runs/41437730142)は全工程success（Analysis1644＋12020subtests、shared-owner1、累積/Q3/API24＋2subtests、月次SQL201原本/15月参照）。指定commitを配置したRender `dep-dbk7l2uc6qcc73dp5d70`は11/2 11:58:13 UTC（20:58:13 JST）Live。配置後healthz/app bootstrap200、未認証latest/reports-history401、Piece private5ON/public3OFFを確認。配置開始〜12:00 UTCの取得範囲にapp error0。本人端末のカテゴリ表示は未確認。 設計・表示・互換・検証範囲は[Analysis04最新節](designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#analysis-selected-category-context-20261102)。

| 既存path（mashos-api/ai/配下） | 今回の責務差分 |
|---|---|
| `services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py` | request方針、原record/version付きカテゴリ取得、親補足継承 |
| `services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | private node文脈とカテゴリ集合別の集約 |
| `services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py` | 根拠再束縛、既存label内の表示、カテゴリ付き比較と新旧混在拒否 |
| `services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | 明示4B新prompt/保存state版、fieldカテゴリ渡しと旧再読互換 |
| `services/ai_inference/analysis_observed_service.py` | カテゴリprefixを除いたprotective基底labelの既存検査 |
| `services/ai_inference/analysis_cumulative_service.py` | 通常カテゴリ方針、新4B prepare/build/save/reload dispatch、旧current一度更新/旧月次維持 |
| `tests/test_cmee_analysis_v1d_vertical.py` | 新10対象：集約/多選択/補足/根拠/比較/新旧prompt保存 |
| `tests/test_analysis_cumulative.py` | 旧current更新と再利用、月次不変、protective保存投影の新2対象 |

公開wire/RN/DB schema/依存/こころ天気の変更なし。新4B実行0、旧実験fileは旧promptの履歴として保持する。


<a id="analysis-scope68-files-20261103"></a>
## 2026-11-03 — 隔離scope68研究の実file地図

通常Analysisのowner・型・保存/API/RN/依存・稼働構造は変更なし。以下は既存trial `observation_learning/trials/2026-11-01-analysis-model-fields/` 内の研究/回収fileで、通常接続の新subsystemではない。STRUCTURE_MAP_DELTA_NONE。全結果は同README#analysis-scope68-result-20261103。

| file | 責務 |
| --- | --- |
| semantic_units_scope68_prepare.py | 旧62辞書保持＋SC6対比、68strict/file再読/tokenizerと近接SD2準備 |
| semantic_units_scope68_run.py | 明示89ba初期値、74更新/40新生成/900秒の一回の比較 |
| semantic_units_scope68_supervisor.py | 旧269member/24before/2134source/初期重み照合、単一起動、原本保全 |
| semantic_units_scope68_saved_replay.py | 64応答の別CPU process再読、saved reader生成禁止 |
| recover_scope_api.py | 旧manifestに属するtest1fileを正確な原本へ戻す。product sourceの変更なし |
| collect_scope68.py | 元archiveを変えず、CPU/復元/再読の原本を集める |
| export_scope68_numeric.py | 通常ZIP回収失敗時の既存text/数値tensor回収。model/load/生成/更新0 |
| semantic_units_scope68_results.json | body-freeな実結果・局所意味実読・保持退行・採否・private原本参照 |


### 2026-11-03 — 同68/74順CE68比較（隔離研究）

通常Analysisのowner/型/API/DB/RN/依存/稼働構造不変、STRUCTURE_MAP_DELTA_NONE。既存trial内に以下6fileを追加。詳細は同README#analysis-ce68-result-20261103、本文/教師/重み全原本はprivate archiveへ保持。新b2a5は通常/次初期値未採用。

| file | 役割 |
| --- | --- |
| semantic_units_ce68_prepare.py | 同68教師/74順・before32 identityをCPU照合しprepared-v2へ固定 |
| semantic_units_ce68_run.py | 既存plain CE、上限74更新/136測定/2load/32after。更新前NLL/dropout0・112重み保存再読 |
| semantic_units_ce68_supervisor.py | 2134source/旧原本/89ba/before32を照合し一回実行、timeout/partial/compute保全 |
| semantic_units_ce68_saved_replay.py | 別CPU processで64応答59候補一致/5拒否維持、保存readerの生成/compiler/author禁止 |
| export_ce68_numeric.py | CRを保つJSON text/F32 uint32 bit列のlossless回収材料を出す |
| semantic_units_ce68_results.json | body-free全実数値・意味読解・保持/退行・未採用・private原本参照・次CPU |

原run268/manifest267、source276member/112重みbytes-SHA一致、private ZIP281member。全体現在地/Analysis map/最新weekly§85訂正・§86/trialを同期。形式受理/教材再現を一般意味品質にしない。


### 2026-11-03 — 再掲3枠比較と新組合せ2件のCPU（隔離研究）

通常Analysis owner/型/API/DB/RN/依存/稼働構造不変、STRUCTURE_MAP_DELTA_NONE。以下は既存trial内の新7fileで、別の通常subsystemではない。詳細はREADME#analysis-replay68-result-20261103。本文/教師/重みはprivate archive、publicはgeneric実行code/本文なし結果だけ。

| file | 役割 |
| --- | --- |
| semantic_units_replay68_prepare.py | 同68教師・3再掲位置/74順・before32の原本同一性をCPU照合 |
| semantic_units_replay68_run.py | plain CE/74更新/136測定/2load/32after、更新前NLL/dropout0と112保存再読 |
| semantic_units_replay68_supervisor.py | 267旧manifest/2134source/89ba/before32を照合、一回上限710+10・partial/compute保全 |
| semantic_units_replay68_saved_replay.py | 64保存応答58候補一致/6拒否維持、保存readerの生成/compiler/author禁止 |
| export_replay68_numeric.py | CR付きUTF-8/uint32 bit列を元bytes-SHAで回収する材料 |
| semantic_units_replay68_results.json | 本文なし実結果/不採用/次CPU2/private原本と未選定GPU |
| semantic_units_combination2_cpu.py | private新source2件を実strict/serialize/file非生成reload/実tokenizerでCPU確認。初回の過大patchをbuild部分だけ除去しv2成功 |

今回3枠比較に新意味改善なし、MD01構造退行あり通常未採用。新CPU2はモデル品質/70教材planへ昇格しない。原run267/manifest266・source273/112重みbytes-SHA、CPU2の4member/manifest再読を確認。全体現在地/Analysis map/最新weekly§88/trialを同期。


## 2026-11-03 — Analysis private材料context入力版の差分

API5d7f43a8：`analysis_cumulative_service.py`の既存`prepare_cumulative_category_units(..., prompt_version=...)`が旧selected_categories.v1を既定で保持し、明示selected_material.v2を選べる。`cores/analysis/semantic_admission.py`の既存Input型/quoted-parent経路が原record対応・記録UTC時刻・選択感情/強さ・カテゴリ・field所属・分析終点を生成し、専用request/messages/state identityへ束縛する。旧2版messages/ref/state/非生成再読を変更しない。新規Engine/入力型/response型/service/HTTP/DB/RNは追加しない。本文外metadataをquote/evidenceへ流用しない。testは既存`ai/tests/test_analysis_model_quoted_parent_units.py`内の新8case、対象142PASS/2SKIP。通常ensureと既存compiler/唯一realizerは不変、全未解析/主体未解決/route0を維持。実4Bの8回比較と残件は[trial](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-context8-plan-20261103)。STRUCTURE_MAP_DELTA_PRESENT（private prompt/state版のみ）。


### 2026-11-03 — combination70完了とmaterial context8の全trial file差分

通常商品ownerの追加なし。下記は既存trial `observation_learning/trials/2026-11-01-analysis-model-fields/` の研究/回収file。学習比較はSTRUCTURE_MAP_DELTA_NONE、API5d7f43a8のprivate入力版だけ上節のPRESENT。全体結果と再開点は[trial](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-context8-result-20261103)。

| file | 責務 |
| --- | --- |
| semantic_units_combination70_prepare.py | 旧68辞書/74順部分列/最後14とRC2・before32同一性をCPU照合 |
| semantic_units_combination70_run.py | 明示89ba、70教材/78更新/140測定/36新生成の一回比較 |
| semantic_units_combination70_supervisor.py | 固定source/原本/初期重み検査、単一起動/timeout/partial保全 |
| semantic_units_combination70_saved_replay.py | 68保存応答の64候補一致/4拒否、保存reader生成/compiler/author禁止 |
| collect_combination70.py | 元run/CPU/再読/実行原本を収集 |
| export_combination70_numeric.py | UTF-8原文/F32 bit列のlossless外部回収材料 |
| semantic_units_combination70_results.json | 本文なし結果/局所意味改善/残件/全原本・重み保存参照 |
| material_context8_run.py | API5d7f43a8の同4source×2入力版8生成、学習0・実strict/保存再読 |
| material_context8_supervisor.py | child/Git blob/初期重み同一性、470+10秒上限と終了・compute確認 |
| collect_material_context8.py | 48原本/API固定3source/実test・実行log/CPU再読を収集 |
| material_context8_results.json | 全8実読後の新版不採用、版差/保存結果/未達/次の再開点 |

combination70の112重みまで全bytes/SHA照合・保存済み。材料比較は意味改善なし・通常未採用、6候補保存一致/2拒否維持を商品成功に加算しない。二run重複起動なし、全未解析/主体未解決/route0。新しいperson meaning/記録間関係の通常接続は未実装であり、本mapの既存残件へ戻る。


<a id="analysis-written-role-files-20261103"></a>
## 2026-11-03 — 明記役割partial frameの実file差分

API88078cdb、STRUCTURE_MAP_DELTA_PRESENTは明示offline経路のみ。新production file/Engine/graph/論理型0。通常ensure/HTTP/DB/RN/稼働は変更しない。[結果/原本/再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-written-role-result-20261103)。

| 既存path（mashos-api/ai/配下） | 新しい責務 |
| --- | --- |
| services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py | quoted-parent応答と全文role witnessの採用、元候補を変更しない専用保存state、保存graph復元/意味・文章図の検証 |
| services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py | 明記SELF/役割関係/過去肯否の全文witness、既存ROLE1node/4gap/辺0、保存値検査。旧normal finiteを拡張しない |
| services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py | 唯一authorのWRITTEN_PAST_ROLE表示arm、同一文章/図とartifact identity |
| services/ai_inference/analysis_cumulative_service.py | 明示build/serialize/reload、実graphのmapped1/unparsed0を限定source範囲に束縛 |
| tests/test_analysis_model_quoted_parent_units.py | source/actor/否定/候補不一致・旧normal不変・3prompt保存・改変拒否・Engine/compiler/authorなし再読 |

同trial内の新research fileはwritten_role8_run.py（8新生成/学習0）、written_role8_supervisor.py（単一起動/timeout/exit）、collect_written_role8.py（採用file再読/7拒否/原本回収）、written_role4_cpu.py（新4原source対比のstrict/map/file/tokenizer、モデル0）、written_role8_results.json（本文なし確定結果/原本/次の再開点）。通常新subsystemではない。


<a id="analysis-written-role74-files-20261103"></a>
## 2026-11-03 — 役割4教材を加えた隔離比較のfile地図

通常Analysisのsource/owner/型/HTTP/DB/RN/依存/稼働構造不変、STRUCTURE_MAP_DELTA_NONE。この差分は既存trial `observation_learning/trials/2026-11-01-analysis-model-fields/` 内だけ。[条件と実行状態](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-written-role74-plan-20261103)。

| file | 責務 |
| --- | --- |
| semantic_units_written_role74_prepare.py | 旧70辞書/旧78順部分列/末尾18と新T4、同a5 before42を実strict/保存再読/tokenizerでCPU照合 |
| semantic_units_written_role74_run.py | 明示a5初期値、74教材/86更新/148測定/新50生成・3load/900秒の一回比較と元raw保持 |
| semantic_units_written_role74_supervisor.py | 2script SHA/固定API88078/旧5adapter対を検証、単一起動/890+10秒/終了・compute・原本manifest保全 |
| semantic_units_written_role74_saved_replay.py | 別CPU processで前後92応答を照合。保存readerのEngine/両compiler/両author禁止、役割24判定を候補92判定と分離 |
| export_written_role74_numeric.py | UTF-8原本とF32 uint32 bit列を元bytes/SHAで外部回収。モデル/load/新生成/更新0 |

GPU実行はCPU成功後に一回完了。全46 source/rawの読解により、役割は対応1→3/4へ改善したが旧5退行のため新重みを通常/次初期値へ未採用とした。原reportを改変しない。一般本人基準・記録間関係・通常保存の完成へ換算しない。


同trialの追加 `semantic_units_written_role74_results.json` は本文なし確定結果、役割の局所改善/旧5退行/非採用/92保存応答再読/元718member・112重みのidentityとprivate原本参照を保持する。上表の5scriptと合わせて今回のpublic研究file6件。外部回収helper/recovery identity/後読解review/全sourceはprivate archive内へ保持し、通常product ownerへ追加しない。[実結果と現在の再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-written-role74-result-20261103)、weekly§94、STRUCTURE_MAP_DELTA_NONE。


<a id="analysis-semantic-boundaries-files-20261103"></a>
## 2026-11-03 — 意味境界指示版と一回比較のfile地図

API dc05dc35、通常product owner追加なし。既存 `semantic_admission.py` が明示semantic_boundaries.v2のsystem追記/newref/専用保存state、既存 `analysis_cumulative_service.py` が明示prepare/build/save/reload同版dispatch、既存 `ai/tests/test_analysis_model_quoted_parent_units.py` が旧互換/版束縛/改変拒否/非生成再読を検査する。元strict/意味型/graph/Engine/HTTP/DB/RN/通常既定は不変。private版のみSTRUCTURE_MAP_DELTA_PRESENT。

既存trial `observation_learning/trials/2026-11-01-analysis-model-fields/` の追加3研究file：

| file | 責務 |
| --- | --- |
| semantic_boundaries46_prepare.py | 同73eeの旧46原本・旧baseline互換・new systemだけの差・同user本文・実strict/保存非生成再読/tokenizerをCPU照合 |
| semantic_boundaries46_run.py | 学習0/保存73ee/1load/新46生成/900秒の一回比較、元raw保持とtyped-role/保存再読 |
| semantic_boundaries46_supervisor.py | 固定source/SHA/API/旧6adapter対を照合、890+10秒上限/partial/終了・compute・manifest保全 |

結果・再開点は[trial](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-semantic-boundaries46-plan-20261103)、weekly§95。今回比較を新しい通常subsystemや一般意味品質へ昇格しない。


同trialの `semantic_boundaries46_collect.py` は完了後の別CPU processでbefore/after92保存応答とrole24判定を照合し、Engine/両compiler/両authorなしの実保存復元を確認する。元UTF-8 file群とbyte/SHA付き回収材料だけを出し、モデル/load/生成/更新0、新重みコピーなし。API dc05の対象5fileは666PASS/2SKIP、114.14秒。


同trial追加 `semantic_boundaries46_results.json` は本文なしの確定実結果・役割/旧保持の退行・不採用・92保存応答の照合・400原本/終了log2/private保存先を保持する。上記4scriptと合わせてpublic研究file5件。元教師22/a5原出力34の派生参照と実読reviewはprivate archive内に置き、通常product ownerへ追加しない。[全結果と現在の再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-semantic-boundaries46-result-20261103)、weekly§96。API dc05のprivate版は保持するが通常採用せず、旧既定・strict・ROLE scope・HTTP/DB/RN構造は不変。


### 2026-11-03 — 既存private役割接続の74教材入力整合比較

[aligned74実結果](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-aligned74-result-20261103)は86更新/46新生成・role4/4と教示4/4、保存非生成再読まで完了。通常/次学習は未採用、本人基準/記録間関係/通常累積接続の残件を保持する。新private graph/作者/型/通常route/DB/RNは追加せず、既存dc05 profileとtyped-role ownerを使用。trial内aligned74 prepare/run/supervisor/collectはCPU整合/学習比較/一回制限/原本保存、role_transfer4 prepare/run/supervisorは新4のCPU参照/旧新8call/一回制限の実行記録用で、商品ownerではない。STRUCTURE_MAP_DELTA_NONE。追加転移4の比較も完了、本人役割1→2/2とscope拒否2/2維持、全8raw/3ROLEと保存readerを照合済み。この転移4の履歴結果と再開はtrial/weekly§99へ戻る。


11/3の74教師scope監査は全対象独立化を現行義務とせず、明記理由/文脈と独立不明の組合せへ次比較を限定する。trialのsemantic_units_aligned74_teacher_scope_audit.jsonは本文なし監査、semantic_units_reason_unknown76_prepare.py/run.py/supervisor.py/collect.pyは旧74＋原文対照2のCPU準備/一回学習比較/上限・原本保持/終了後100保存再読と全原本梱包用。既存private候補owner/typed ROLEを使い、商品graph/作者/通常routeは追加しない。新比較の実結果はtrial/weekly§101以降を確認。STRUCTURE_MAP_DELTA_NONE。


11/3・理由2×2診断はsemantic_units_reason_transfer3.py（CPU参照/新3生成/1既存再利用/原本保全）とsemantic_units_reason_transfer3_supervisor.py（段階/上限/16file保持）をtrialへ追加。semantic_units_role_boundary_audit.jsonは旧ROLE5教師/正常10例/複数文候補境界の本文なし監査。通常owner/型/graph/DB/RNは変更しない。最新の診断結果と再開はtrial/weekly§103以降へ戻る。STRUCTURE_MAP_DELTA_NONE。


11/3の理由診断は元教材を含む4条件でWRITTEN_REASON未再現を確認。次にsemantic_units_boundary78_prepare.py/run.py/supervisor.py/collect.pyをtrialへ追加し、旧76不変＋新ROLE/ACTION順序対照2、理由/文脈と役割境界の重点学習・53生成・106保存再読/原本保全を扱う。通常owner/型/DB/RNの変更なし、STRUCTURE_MAP_DELTA_NONE。最新はtrial/weekly§104–105以降を参照。


11/3 private入力版の差分：mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py がsemantic_boundaries.v3・別request identity/専用保存stateを所有し、旧v2指示へ理由のpublic対照を追加。既存service/Engine/compiler/author/normal既定は不変。既存test_analysis_model_quoted_parent_units.pyへ互換/保存境界検査を追加。trialのsemantic_units_reason_v3_probe53.pyと_supervisor.pyはCPU53旧版再読/新版rebind/新53生成/106保存再読/全原本保全のみ。新採用owner/型/通常route/DB/RNは追加しない。private版のみSTRUCTURE_MAP_DELTA_PRESENT、最新結果はweekly§107以降を確認。


11/3・次入力監査の地図：trialのsemantic_units_v3_teachers78_audit.pyは既存78source/target/106順を不変にして、新旧strict/保存readerとv3学習renderer・CPU tensor/label/shift境界/終端を確認するCPU専用helper。audit/archive二段で完了又はpartial原本を保全し、モデルforward/生成/学習は行わない。最新の結果・再開はtrial/weekly§109以降。通常owner/型/受口/DB/RNは追加変更しない、STRUCTURE_MAP_DELTA_NONE。


11/3・v3学習入力整合の地図：trialのsemantic_units_aligned_v3_78_prepare.py/run.py/supervisor.py/collect.pyは、旧78source/target/106順と旧9dcの研究初期を保持し、v3へ学習messagesを揃える比較専用。CPUaudit原本・今回v3 before53を再利用し、106更新/156NLL/53新生成/112tensor保存reload/106保存応答再読/全原本保全を扱う。新商品owner/型/既定route/受口/DB/RNは追加しない、STRUCTURE_MAP_DELTA_NONE。最新条件・結果はtrial/weekly§110以降。


11/3 v3整合比較の結果：semantic_units_aligned_v3_78_results.jsonは本文なし最終採否・全原本参照・既存残件ownerの索引。4scriptの106更新/53生成は完了、理由4対照とCQ04は修復する一方で旧保持未達のため新重みは通常/次学習不採用。CPU監査/完了GPUを再実行せず、source_adapter/selected_material既存入力とsemantic_admission→ObservedPropositionの条件対応へ戻る。新owner/型/通常接続/DB/RNの追加はなくSTRUCTURE_MAP_DELTA_NONE。最新はtrial/weekly§112–113。


<a id="piece-android-bitmap-files-20261104"></a>
### 2026-11-04 — Piece Android固定寸法描画のファイル差分

| ファイル | 責務 |
|---|---|
| `android/app/src/main/java/com/anonymous/cocolonmvp/piece/PieceTextMetricsModule.java` | 既存Paperの文字計測に加え、検証用 `PieceAndroidBitmapCanvas` を登録。固定寸法への配置・画素検査・表示・一時PNGを同じBitmapに結ぶ。 |
| `features/piece/pieceLayout.js`、`features/piece/pieceRenderer.js`、`components/piece/PieceVisualCard.js` | 検証専用の版と3ハッシュの照合、計測行の組立て、ネイティブ結果の検査、対象が変わった時の無効化。 |
| `tests/native/piece-rn-android-bitmap-entry.js`、`tests/native/piece-rn-canvas-fixtures.cjs` | 通常起動と分離したAndroid確認画面と合成8ケース。既存の検証グループを保持する。 |
| `tests/piece-v2-android-bitmap-harness.test.js`、`tests/piece-v2-renderer.test.js` | 検証専用の入口、描画元の行、失効とPNG取得・回収のJS検査。 |
| mashos-api `ai/services/ai_inference/piece_v2_generation.py` | 既存の原文から画像本文を作る経路に「受け取り」「閉め」の明示動作を追加。 |

[Piece現行構造](current_structure/02_piece_current_structure.md#piece-android-bitmap-prototype-20261104)


<a id="piece-paragraph-os-result-srgb-files-20261104"></a>
### 2026-11-04 — Pieceの原文段落・OS操作結果・PNGのファイル差分

| 既存ファイル | 責務の差分 |
|---|---|
| mashos-api `ai/services/ai_inference/piece_v2_generation.py`・`piece_v2_content_policy.py`、同階層の `cocolon_meaning_experience_engine/piece_source.py`・`piece_v1c.py` | 同じ保存欄の完成した文の改行を、原文の位置・欄と照合した段落へ保持。本文作者と独立検査が同じ段落順・否定・句点を照合する。 |
| screens/PieceOwnerHistoryScreen.js／features/piece/pieceExport.js | OSへ渡した操作の進行と結果を本文なしで保持。本人・権限の再確認と明示的な同じ保存版の再読後に結果を表示し、実行中の二重開始を防ぐ。 |
| `android/app/src/main/java/com/anonymous/cocolonmvp/piece/PieceTextMetricsModule.java`、`features/piece/pieceExportPngProfile.js`、`tests/native/piece-rn-android-bitmap-entry.js` | Android試作の不透明sRGB Bitmapと旧OSへの標準色宣言、既存検査の不透明RGB指定を接続。 |

通常起動経路・描画版・公開DTO・依存・DBスキーマは既存のownerを使用する。[Piece現行構造](current_structure/02_piece_current_structure.md#piece-paragraph-os-result-srgb-20261104)

<a id="piece-source-delete-exclamation-files-20261104"></a>
<a id="piece-literal-save-detail-cache-files-20261104"></a>
### 2026-11-04 — Pieceの保存・詳細再読・原文保持・途中PNGのファイル地図

| 既存ファイル | 現在の責務の差分 |
|---|---|
| `screens/input/InputPieceActionArea.js`、`features/piece/PieceCreateController.js`、`features/piece/piecePreviewModel.js`、`components/piece/PiecePreviewModal.js` | 確定した保存元競合のGETと新しい作成を分ける。保存枠の確定拒否は元の要求・キーで明示再試行でき、未保存と結果不明の案内を分ける。 |
| `navigation/MainTabs.js`の既存`createPieceSaveRecovery` | 元の作成・保存の要求とキーに、本文なしの保存枠拒否状態だけを結び付ける。再試行開始で拒否状態を解除し、本人変更と破棄は従来どおり。 |
| `features/piece/PieceOwnerHistoryController.js`、`screens/PieceOwnerHistoryScreen.js` | 同一削除要求の復帰に加え、選択済み詳細GETの一時失敗から同じIDへの明示再取得を提供する。公開変更の既知の完了案内は最新詳細の取得後に表示する。 |
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py`・`piece_v1c.py` | 既存の明示一人称の有限表現を原文保持し、願望・比喩や宣言へ新しく分類しない。空の本文や既知の文法要素だけからなる本文は採用しない。自己理解の動作文の感嘆符も保持する。 |
| `patches/react-native-view-shot+5.1.1.patch` | Piece専用iOS PNGの書込み失敗で、JSへ返らない途中ファイルをnative側で回収する。通常caller・成功分岐を保持する。 |
| 既存`piece-v2-owner-history`・`preview-display`・`state-models`・`export`試験、API `test_b05a_piece_saved_original_generation.py`・`test_piece_natural_context_sql.py` | ホスト・保存復旧の通常復帰、原文保持・空述語拒否、実ASGI／隔離DBの保存・再読・保存枠を確認する。nativeの書込み失敗実行や端末成功の証拠とは分ける。 |

既存の画面・保存復旧情報・HTTP経路を使用し、新規ファイル・API・DBスキーマ・描画版は追加しない。[Piece現行構造](current_structure/02_piece_current_structure.md#piece-literal-save-detail-cache-20261104)

### 2026-11-05 — 分析v5 aligned16の実学習・生成結果の地図

通常production owner/型/意味gate/compiler/唯一作者/ensure/HTTP/DB/RNは不変、STRUCTURE_MAP_DELTA_NONE。既存trialのmaterial_v5_aligned16_trial.pyを変更せず、16更新・32測定・新30生成と保存再読を実行した。新しい本文なし結果索引は同trial内のmaterial_v5_aligned16_results.json、全条件/失敗回復/比較/原本はREADME#analysis-material-v5-aligned16-result-20261105と最新weekly§175。新重みはprivate原本に保存し通常/次初期値へ未採用。00/current03の再開入口を同結果へ更新した。新product code/ownerなし。

### 2026-11-05 — 既存教師の実誤分岐を修復する研究結果の地図

既存trial内のmaterial_v5_branch16_trial.py（CPU準備/8分岐測定/16更新/30生成/保存再読）とmaterial_v5_branch16_plan.json（固定条件）、material_v5_branch16_results.json（本文なし実結果）を追加。全原本はprivate保存、結果/限界/途中誤報告の訂正/次の残件はREADME#analysis-material-v5-branch16-result-20261105と最新weekly§176。旧19表示を全保持、修飾2例を修復、理由・対象の2例は未解消。通常採用/次初期値自動採用false。通常product owner/型/意味gate/compiler/唯一作者/ensure/HTTP/DB/RN不変、STRUCTURE_MAP_DELTA_NONE。

<a id="analysis-material-v5-residual2-files-20261105"></a>
### 11/5 — 未解消2件だけを追加枝CEへ残す比較のファイル地図

既存trialのmaterial_v5_residual2_trial.pyは既存16教師不変のCPU準備・既修復2件の追加枝項除外・残2件の4forward再測定・16更新・30生成・保存非生成再読を所有。material_v5_residual2_plan.jsonは固定条件、material_v5_residual2_results.jsonは本文なし実結果とprivate原本参照。新しい商品ownerは追加しない。AT24を修復、YREASON01は理由marker不足と新しい従属否定qualifier欠落により新重み不採用。旧19表示とAT11/17を保持。[全結果と次条件](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-v5-residual2-result-20261105)、最新weekly§177。通常source/型/意味gate/compiler/唯一作者/ensure/HTTP/DB/RN不変、STRUCTURE_MAP_DELTA_NONE。

### 11/5 — 欠落2注記の同時学習のファイル差分

既存trialのmaterial_v5_qualifier2_trial.pyは実tokenizerのoffsetから既存教師2 object＋先行commaに交差する21 tokenを同時選択し、16更新/30生成/保存再読を行う一回runner。material_v5_qualifier2_plan.jsonは固定条件、material_v5_qualifier2_results.jsonは本文なし実結果・private原本参照。時計変数修正前のCPU原本も保全。既知RU02を修復し、AT4と旧19表示を保持。通常product owner/型/意味gate/compiler/唯一作者/ensure/HTTP/DB/RNは不変、STRUCTURE_MAP_DELTA_NONE。[全結果・次条件](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-v5-qualifier2-result-20261105)、weekly§178。

### 11/5 — 未学習4文の旧/新比較のファイル地図

既存trialのmaterial_v5_qualifier_near4_probe.pyはprivateな新4入力を元90/現16/30と重複確認し、0587と新7ba4で追加学習0/8生成/2load/保存非生成再読を行う一回比較。material_v5_qualifier_near4_plan.jsonは固定条件、material_v5_qualifier_near4_results.jsonは本文なし実結果とprivate原本参照。原文/保持条件/rawはpublic GitHubへ入れない。既知修復と新4文の未達を区別し、通常owner/型/意味gate/compiler/唯一作者/ensure/HTTP/DB/RN不変、STRUCTURE_MAP_DELTA_NONE。[全結果・次条件](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-v5-qualifier-near4-result-20261105)、weekly§179。

### 11/5 — 組合せ教材の限定学習と再現未達

既存trial内のmaterial_v5_composition24_trial.pyは旧16・原90再利用4・独立教示4を24更新/48測定/旧30＋held4＋学習4の38生成で比較し、保存再読/回収する一回runner。material_v5_composition24_plan.jsonは固定条件、material_v5_composition24_results.jsonは本文なし実結果/private原本参照。原文/target/raw/追加重みは公開GitHubへ載せない。旧19表示とRU02/AT4一致は保持したが新4教示/held4未達、新27e9不採用。SC01のNEG引用範囲後退とCP04の原文外quote拒否を記録する。新product owner/通常実装の変更0、STRUCTURE_MAP_DELTA_NONE。[全結果](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-v5-composition24-result-20261105)、weekly§180。


### 11/5 — 既存組合せ教師の意味object全体へのloss比較

既存trial内のmaterial_v5_composition_unit24_trial.pyは教材24/初期7ba4と既存RU02項を保ち、CP4の理由・思考/内容/独立行動のcomplete object unionを追加CEへ選び、CPU実tokenizer/24更新/48測定/保存後38生成/非生成保存再読を行う一回runner。material_v5_composition_unit24_plan.jsonは固定条件、material_v5_composition_unit24_results.jsonは本文なし最終判定/private原本参照。QF01とCP03に局所改善、CP02の重複親とCP04の発話帰属に新退行があり新a6b5不採用。新product owner/型/通常実装変更0、STRUCTURE_MAP_DELTA_NONE。[全結果と再開点](observation_learning/trials/2026-11-01-analysis-model-fields/README.md#analysis-material-v5-composition-unit24-result-20261105)、weekly§181。


### 11/5 — component2の一回比較と通常帰属境界のCPU対照

既存trialにmaterial_v5_component2_trial.py／material_v5_component2_plan.json／material_v5_component2_results.jsonを追加。前回同24教材へ理由末尾/発話内容pairの追加lossのみで比較し、CP02/04未修復・CP03/OA01退行により新重み不採用。[全結果](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-material-v5-component2-result-20261105)。private原本には初回CPU停止/修正後run/通常Engineの二件対照を含める。新しい商品型/owner/経路/DB/RN/配置変更0、STRUCTURE_MAP_DELTA_NONE。


### 11/5 — 閉じた発話に隣接する本人行動の取りこぼし修正

APIの既存intent_compiler.pyで、単一の閉じた肯定過去発話の外に直接隣接するSELF過去行動だけを採用し、引用内容は既存SOURCE_SCOPEへ残す。元source/座標/順序根拠と既存作者/公開wireを保持。新ai/tests/test_analysis_closed_quote_self_action.pyを既存Analysis CIへ接続。owner/商品型/DB/RN追加0、STRUCTURE_MAP_DELTA_PRESENT（意味採用範囲の限定修正）。API0dd31ce7、Jupyter495成功・実4対照、配置未実施。[結果と限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-closed-quote-self-result-20261105)。


### 11/5 — 明記役割節と後半未読を分ける既存ownerの差分

| mashos-api のpath | 責務の差分 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 元fieldの全文hash/boundsを保持した、先頭SELF過去役割節の部分根拠とSOURCE_SCOPE。後半の行動は採用しない |
| 同階層 `semantic_admission.py` | 明示clause=Trueの既存Input/Response検査・別state/identity・保存非生成再読 |
| 同階層 `observed_route_realizer.py` | 元category recordを再freezeして節の根拠を照合し、既存文章/図へ表示 |
| `ai/services/ai_inference/analysis_cumulative_service.py` | 既存build/serialize/reloadの明示clause選択、mapped1/unparsed1の併存 |
| `ai/tests/test_analysis_model_role_clause.py` | 公開合成66ケース。原本4B rawを教師へ転記しない |
| `.github/workflows/analysis-observed-content.yml` | 既存CIに新/旧モデル経路回帰を登録し、pytest基点をcheckoutに固定 |

入力型/graph型/商品owner追加0。private role_stateとstate/file/identityの限定版はschema owner05に追記。公開DTO/HTTP/DB/RN/通常ensure不変。[結果・限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-written-role-clause-result-20261105)。


### 11/5 — モデル候補を通常マップへ渡す行動接続のファイル差分

| 既存owner / path | 責務の差分 |
|---|---|
| API `cores/analysis/intent_compiler.py` | 既存の元source全体のgraphを検査。完全なSELF過去行動と実候補root/注記が一致する場合だけ採用。node/evidence/gapを保持し、必要時に未読scopeを追加。旧ROLE_ACTIONと候補検査を共有 |
| API 同階層 `semantic_admission.py` | 既存quoted-parent応答の完全bindingと原入力1件/補足・比較なしの資格を検査。通常の型/保存形式へ渡す明示caller経路 |
| API 同階層 `observed_route_realizer.py` | 既存ordinary UUID map constructorを共有。表示作者・graph型を増やさない |
| API `analysis_cumulative_service.py` | 既存build_cumulative_mapの明示model_input分岐。stale件数を既存coverageから保持し、通常ensure/HTTPを有効化しない |
| API `ai/tests/test_analysis_model_observed_actions.py` / 既存Analysis workflow | 合成49ケースを既存回帰へ接続 |
| 既存trial `model_observed_actions_replay.py` / `model_observed_actions_results.json` | 元v4応答22件の一回比較と、本文なし実集計/独立合成例。private rawや実本人原文を公開しない |

新しい型/state/file/DB/RNなし。通常保存は既存rowとprivate-evidence v1。実DB保存やモデルrawの意味再検証を、file＋mock RPCによる非生成再読の成功へ混ぜない。[全結果](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-model-observed-actions-result-20261105)。


### 11/5 — 肯定の明記役割文を発話導入へ誤分類しない限定修正

API intent_compiler.pyの既存_analysis_prefix_opens_reportで、既存_written_role_propositionが節全文へ一致する場合だけ、その節自身を閉鎖済みとして次の節へ進める。前後の発話・引用・夢等のscope検査、元source/行動証明は維持する。共有owner/文法/ROLE node/型/保存版は増やさない。新test_analysis_model_closed_role.py（合成38）を既存CIへ接続し、前runの10分設定/cancelledと実測所要に基づき同じworkflowの枠を15分へ変更。既存trialのmodel_observed_actions_replay.pyは任意の隔離root/基点期待を受ける同じ一回runnerへ更新、新本文なし結果model_closed_role_results.jsonへ同22前後を保存。[実結果と限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-model-closed-role-result-20261105)。STRUCTURE_MAP_DELTA_PRESENT、商品credit0。

### 11/5 — 証明済みROLEを通常モデルconsumerへ接続する差分

| path | 今回の責務 |
|---|---|
| API `cores/analysis/semantic_admission.py` | 既存generate_analysis_model_observed_actions内で、1欄は既存ROLE→ROLE_CLAUSE、2欄は既存ROLE_ACTIONのsource証明へ渡す。成立しなければ従来の独立行動を検査。元responseと全文source binding、原入力/category1・補足/比較なしの条件を維持 |
| API `ai/tests/test_analysis_model_observed_roles.py` | 新51の合成検査。役割肯否/欄交換、未読、誤候補非昇格、本人・版・カテゴリ・hash、通常UUID/保存非生成再読 |
| API `ai/tests/test_analysis_model_closed_role.py` | 元38ケース中、完全役割＋独立行動の期待を既存2nodeへ更新。モデルなしの有限経路は旧1行動のまま比較 |
| API `.github/workflows/analysis-observed-content.yml` | 同じ既存CIに新検査を追加。その他の工程/上限は維持 |
| 既存trial `model_observed_roles_replay.py` / `model_observed_roles_results.json` | 同22保存応答の前後比較・旧35保存再読と本文なし集計/独立合成3例。実原文/rawは非公開保全 |

API3433d807。ObservedGraph/唯一作者/通常rowを共用し、新型/state/file版/DB/RNを増やさない。ROLE_ACTIONは辺0とROUTE_CONNECTION gap、ROLE_CLAUSEは後半未読とSOURCE_SCOPE。Engineの候補分岐・通常ensure/HTTPは自動有効化しない。[結果・限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-model-observed-roles-result-20261105)。STRUCTURE_MAP_DELTA_PRESENT、商品credit0。

## 11/5 JST — 通常ensureの明示モデル受口（第9回§188）

| 既存path / 追加test | 責務差分 |
|---|---|
| API `ai/services/ai_inference/analysis_cumulative_service.py` | `ensure_map(..., model_source=None)`。再構築時だけ最新snapshotからv4入力を準備し、明示async callerの既存Responseを受け、既存build/commit/readへ渡す。HTTP/cronは引数なしの既定経路を維持 |
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | consumerの既存単記録資格を`require_analysis_model_observed_scope`へ共用。応答取得前と採用時で同じ原入力1/category1・補足/比較なしを拘束 |
| API `ai/tests/test_analysis_cumulative_model_source.py` | 独立合成応答の実SQL通常保存/月次不変/CAS拒否・実補足の非呼出し、ref/messages/raw/hash不正/時計差/別owner/読取境界の22検査 |
| API 既存 `.github/workflows/analysis-observed-content.yml` | 新22検査を既存PGlite導入済み累積API工程へ追加 |
| trial `model_ensure_replay.py` / `model_ensure_results.json` | 元v4の22応答を元snapshotのまま通常ensureへ再読。本文なし実集計と、独立合成3例のSQL文章図を保持 |

APIb77c380e。Input/Response/graph/作者/DTO/row/profile/DB/RN追加0。既存現在値にcallerを付けるだけで強制再生成しない。再構築が必要な場合だけ取得する。[全結果・限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-ensure-model-source-result-20261105)。

## 11/5 — 同欄の役割と独立した本人行動（第9回§189）

| owner path | 差分責務 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 既存ROLE_CLAUSE証明と元source全体の共有有限ACTION証明を、同じmemoの2nodeへ渡す。候補fieldを切直さず、後半unit/qualifierだけ元座標で照合する |
| API 同dir `semantic_admission.py` | 明示モデルconsumerで、単独ROLE→同欄ROLE＋ACTION→旧ROLE_CLAUSEの順に既存証明を試す。不正/欠落ACTION候補は旧role-onlyへ残す |
| API 同dir `observed_route_realizer.py` | 旧role-only未読形を保持。2nodeは元二文・明記SELF・正確な後半根拠・既存gap/辺なしを再確認して既存作者へ渡す |
| API `ai/tests/test_analysis_model_same_field_role_action.py` | 合成38例。肯否/句点/元位置/qualifier/不採用/旧保存/改変拒否。全角句点の未対応も保持 |
| API `ai/tests/test_analysis_cumulative_model_source.py` / 既存workflow | 同欄の実SQL通常保存・強制更新後の月次不変を追加し、既存CIへ登録 |
| trial `same_field_role_action_trial.py` / `same_field_role_action_results.json` | 新しい合成4sourceの実4B1load/4応答→通常ensure、同じ応答の前API比較、旧22保持。公開結果は原本rawを除く比較文章図 |

APIf1048a8f。新graph/type/作者/role_state/保存版/公開DTO/DB/RNは追加しない。private clause=Trueは旧role-onlyのまま。STRUCTURE_MAP_DELTA_PRESENT（既存consumerの同欄構成責務）。[全結果と制限](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-samefield-role-action-result-20261105)。

### 11/5 §194：適格ordinary補足の担当＋決定 — 限定4構成を商品graphへ接続

APIbb121484は、§192のordinary補足plain ACTIONと§193のopt-in `selected_material.v6`を継承し、ANSWER自身に明記された過去SELFの担当ROLE＋決定ACTIONの完全2nodeを既存商品経路へ接続した。原入力用の完全field証明を共用し、全親原入力＋ANSWER集合を先に既存compilerで検証して、回答自身のenvelope／根拠／元labelだけで同じ証明を行う。新prompt/profile/state・意味型・作者・有限文法は追加せず、誤kind再ラベル／欠落unitやNEGのraw修復／source-only代替は0。

実4Bの新source構成AC01〜04を各1回、保存a2e/config006e・固定Qwen3.5-4B revision851bf6e/既存pinsで生成し、新4stop/1load/学習0・53.891208秒で4保存・5record mapped/未解析0。node数3/3/2/4、辺1/0/0/1。旧8efd07e6へ全く同じ4request/messages/rawを0生成で渡すとAC01〜03は未対応、AC04は独立r2の否定ACTIONだけを保存（1/2record mapped・未解析1）した。旧版を全例無出力とせず、回答側2nodeとそれを持つ親recordのcoverageが商品差分である。

AC01/04の明記順序は回答自身の担当→決定だけで、原因／親→回答／回答→別回答／別recordの辺を作らない。AC02は担当・決定それぞれの否定と順序なしの接続不明を保持。AC03は同意味の無順序重複を2nodeへ集約し、各nodeに原入力＋回答の2根拠を残す一方、同記録のcount/badgeは1。全ケースで元カテゴリ・不明を保持し、回答を別の機会へ数えない。2構成は§193の節を補足へ置き直した新source構成で、独立held-outの一般言語率ではない。

旧／新consumerと新版replayで全4request/response/rawが一致し、新版の0生成/0load再読1.019909秒は本文・coverage・新規artifact UUID以外の全projectionが一致した。各保存artifact内のcurrent/月次/readonlyは本文/図/ID/coverageが完全一致し、生成を禁止して再読した。保存は実ensure/build/commit/read＋隔離mock RPCで、実DBや本人端末の成功ではない。prepareは入力tokens3283/3284/3287/3387＋予約2048<8192・5.403826秒/model0。Jupyter5suiteは316 PASS/SQL依存13 SKIP/既存warning1・30.25秒、CI42015033971全step成功（生成/保存2240 PASS・旧SQL1 SKIP・12048 subtests、共有owner1 PASS、累積/Q3/jobs124 PASS、隔離SQL201原本/15月参照）。

原文／親版／owner／既存QUESTION/ANSWERのround資格／選択カテゴリとsource_set_refは全集合のまま保持する。省略主語を親やownerからSELFへ補完せず、全補足claimのSELF資格・訂正／撤回／未解決対立・比較の拒否、親private ROLE_CLAUSEの未対応を維持。一般複数節補足や単独担当ROLE、暗黙役割・判断基準／理由／性格、担当対象作業の完了や決定対象の実行達成へ拡げない。親の未対応本文はSOURCE_SCOPEとして残す。旧v4 messages/保存版と通常ensure既定v4は不変、v6はopt-in・モデル重みは通常未採用。通常HTTP/cronの4B接続、transport/採用重み、一般本人基準・記録間意味関係、IF/Saved/観測会・本人端末／配置は残件で、一般分析品質・正式商品受入れは未判定。

変更は既存API3path：`ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py`（原入力の担当／決定完全field証明を`_model_role_decision_field_graph`へ共用化し、`compile_model_supplement_role_decision`で全集合から回答自身の根拠を抽出）、同`semantic_admission.py`（`_compile_model_observed_record`で回答局所ref/辺を既存record graphへ束縛し、明記順序の両端の根拠IDとcanonical重複を維持）、`ai/tests/test_analysis_cumulative_model_source.py`（肯否／順序／無順序重複／未解析／主体・field・根拠変異／private clause拒否／保存版／SQL lifecycle）。source_adapter・保存原版／round owner・唯一realizer・service/profile/state・DB/RN/既存workflowの責務追加0。trial `supplemental_role_decision_trial.py`（runner6ad7c0f5）は新4要求・同raw旧／新consumer比較・保存非生成再読を、`supplemental_role_decision_results.json`は公開合成入力と旧新の全表示／集計を所有する。

[全結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-supplemental-role-decision-result-20261105)。§193の2題比較・失敗候補・原本は[前回記録](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-role-choice-prompt-result-20261105)に保持する。

## 11/5 §195 — 明示モデル更新の実行寿命（既存2path）

| owner path | 差分責務 |
|---|---|
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 同一process/loop・本人・callable・force/月次viewの並行task共有、独立DTO、完了cacheなし。60秒の協調的source期限、503/504・cancel・mode再確認を保存前に限定。既存snapshot/guard/CAS/read ownerを継承 |
| API `ai/tests/test_analysis_cumulative_model_source.py` | 一回snapshot/保存・返却独立性、timeout/transport失敗と明示再試行、片方/全waiter cancel、遅延応答拒否、mode変更/本人・callable・view分離、実SQL同時forceと失敗後current/月次維持 |

新しい意味owner/型/作者/公開contract/DB/RN/依存追加0。通常HTTP factoryと分散重複抑止は残件。API286cb1e6、STRUCTURE_MAP_DELTA_NONE（既存service内部）。[全検証・限界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-model-source-lifecycle-20261105)。

## 11/5 §196 — 通常設定のAnalysis HTTP source/factory

| owner path | 差分責務 |
|---|---|
| API新 `ai/services/ai_inference/analysis_model_source.py` | Analysis専用HTTPS transport・単一provider・既存material.v4/Response結合。private設定ごとの安定factoryと設定変更確認。既定OFF、Emlis本文/設定を代用しない |
| API既存 `ai/services/ai_inference/analysis_cumulative_service.py` | 明示sourceなしの通常callerへ条件付きfactoryを中央選択。取得前source資格と既存build/save/read、保存前設定一致を継承 |
| 既存 `ai/tests/test_analysis_cumulative_model_source.py` / `test_analysis_observed_api.py` | protocol/期限/失敗/設定変更/認証と通常HTTPからの保存・実SQLの同時更新、設定喪失後の保存再読 |
| 既存 `.github/workflows/analysis-observed-content.yml` | 新transport pathも既存の生成/保存/累積SQL CIの起動対象とする |

各API/worker/cronの別writer追加0、意味型/作者/保存版/公開DTO/DB/RN/商品依存追加0。通常設定接続のコードと、実4Bの提供/採用/有効化/配置は区別。APIfbbda209、STRUCTURE_MAP_DELTA_PRESENT。[全結果・制限](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-application-model-source-20261105)。


## 11/5 §197 — 実通信・隔離SQL一巡の検証ファイル（商品構造不変）

| owner path | 当回差分 |
|---|---|
| API既存 `ai/tests/test_analysis_cumulative_model_source.py` | 実127.0.0.1 TLS serverで未信頼CA拒否・専用SSLContext受理・元packet/Response一致を検証。製品runtime変更なし |
| trial新 `application_model_https_trial.py` | 既存generic handler/loaderをlocalhost限定TLSで再利用。通常ASGI API＋合成認証・当回隔離SQL・固定a2e/4要求600秒・原本checkpoint・保存非生成再読を検証。production serverではない |
| trial新 `application_model_https_results.json` | 華恋合成4構成の元入力と本文を含まないcoverage・呼出し/保存集計・表示hash。全表示・model raw・秘密鍵は公開しない |

実4B新4stop/1load/学習0、4保存/各2node/未解析0・47.111880秒。元service/source SHA不変、STRUCTURE_MAP_DELTA_NONE。一般意味品質・通常採用・外部/常時HTTPS・本番DB/認証/端末/配置は未成立。

[全結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-actual-https-sql-20261105)。

## 11/5 §198 — 既存モデルconsumerの主体未確定・複数行動接続

| owner path | 当回の責務差分 |
|---|---|
| API既存 `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | `_check_model_action_units`/`_model_complete_observed_action`が元sourceのUNSPECIFIEDを保持。`compile_model_observed_actions`内の完全複数行動照合が元graph・全unit・明記順序を再利用。文法・型・作者・edge種別は追加しない |
| API既存 `ai/tests/test_analysis_model_observed_actions.py` / `test_analysis_model_closed_role.py` | 主体未確定・所有/別欄役割からの本人化禁止・原文座標/否定・複数節全保持と未読/誤unit拒否・保存非生成再読。旧全体拒否期待を主体未確定保持へ更新 |
| API既存 `ai/tests/test_analysis_cumulative_model_source.py` | 隔離SQLで主語未確定1行動・本人2行動・明記順序2行動の通常commit／current/月次/readonly一致を確認 |
| trial `ordinary_prose_trial.py` / `ordinary_sequence_transfer_trial.py` / `ordinary_prose_results.json` | 元8と別6の実4B各一回・同raw旧新版比較・非生成保存再読。公開集計からmodel rawを除外、全原本はprivate保存 |

API意味bytes5a78eaa9・最終test1f4b304f。STRUCTURE_MAP_DELTA_NONE、既存semantic source/ensure/transport/作者/公開wire/DB/RNのowner追加0。新14stop/2load/学習0で元8は旧0→新4、別6も旧0→新4の限定接続差。一般読解/本人基準/暗黙役割/記録間、通常採用・本番・端末・配置は未達。[全結果・失敗・原本](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-ordinary-prose-20261105)。


## 11/5 §199 — 所有対象／動作主のprivate profile差分と全変更path

| repository path | 責務 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | opt-in v7の教示・request identity・state/非生成reader。旧v4/v6 bytes保持 |
| API `ai/services/ai_inference/analysis_cumulative_service.py` | v7のカテゴリ付きsource再束縛。通常ensure既定v4保持 |
| API `ai/tests/test_analysis_model_actor_profile.py` | 省略・所有・明記主体・反復代名詞・理由/意向・prompt実例のsource束縛と再読 |
| API `ai/tests/test_analysis_model_role_decision.py` | 新旧profile混用拒否／v7保存state再読 |
| API `.github/workflows/analysis-observed-content.yml` | 上記新testを既存合成回帰へ追加 |
| trial `actor_ownership_trial.py`／`actor_ownership_results.json` | 同一source v6/v7実4B一回比較・原本参照と本文なし集計 |

新private profile/stateのみSTRUCTURE_MAP_DELTA_PRESENT、通常transport/意味型/compiler/作者/公開wire/DB/RN不変。API4d744e36／最終CI42052701621成功。一般読解・本人基準・記録間・通常採用は未達。詳細はweekly§199。


## §200 — 既存Analysis owner内の学習比較と全追加path

| trial内path | 責務 |
|---|---|
| `actor_ownership_ce20_trial.py` | 原N8保持・OT6の既存CE20更新/28NLL/18stop、private source/候補/同map保存再読 |
| `actor_ownership_seen_fit_trial.py` | 同教師OT03/06をa2e/b7で4回だけ自由生成し、既見再現と転移不足を区別 |
| `actor_ownership_followup6_sources.json` | evalを教師化しない独立OC6。所有・主体・否定・一意引用 |
| `actor_ownership_followup6_prepare.py` | 旧14保持/全20受理・保存・実tokenizer mask、保存rawの再tokenize差分。学習0 |
| `actor_ownership_ce20_results.json` | 不採用/原本参照/次CPU現在地。model raw/重みの公開0 |

既存共用入口/semantic admission/intent compiler/作者/API/DB/RNのowner追加0。§199のopt-in v7は保持し、通常v4不変。新b7は理由の候補退行と所有転移未達で通常/次初期未採用。STRUCTURE_MAP_DELTA_NONE。詳細はweekly§200。

## §201–202 — 48更新の保全と明示v7 transportの全差分path

| repository path | 当回の責務 |
|---|---|
| API `ai/services/ai_inference/analysis_model_source.py` | constructorだけ明示v4/v7を許可、既知exact型のprofile取得と送信前一致。通常factory/既定v4は保持 |
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 保存済み再利用後の再構築分岐で上記profileを選択。旧callback/保存read不変 |
| API `ai/tests/test_analysis_cumulative_model_source.py` | 実TLS v4/v7、版不一致の通信前拒否、明示v7の通常ensure/SQL保存再読、既存AsyncMock互換 |
| trial `actor_ownership_balanced48_trial.py` / `actor_ownership_balanced48_results.json` | 旧20＋理由/不明anchor2、初期a2eの48更新/14新stop比較と不採用を含む全読集計。raw/新重みはprivate |
| trial `explicit_v7_model_https_trial.py` / `explicit_v7_model_https_results.json` | 合成認証/隔離SQL/実loopback TLS、研究6c879の4要求240秒上限、通常API保存非生成再読。通常採用ではない |

API db311746。元semantic profile/state/meaning compiler/作者/公開wire/DB/RNのowner追加0、STRUCTURE_MAP_DELTA_NONE。通常v4、研究候補未採用、本番/端末/配置0。詳細はweekly§201–202。

## §203–206 — 新対照・入力上限・履歴比較の全差分path

| repository path | 当回の責務 |
|---|---|
| RN `components/selfStructure/CumulativeWatashiMapView.js` | 月次自身の検証後、current比較の一時通信失敗で履歴表示を保持。認証/不正DTO/旧本人遮断と明示再取得を維持 |
| RN `tests/analysis-cumulative-map.test.js` | 実Reactで失敗後の履歴保持・再取得・権限/本人/不正DTOの回帰 |
| 前提 `validation/2026-11-05-analysis-history-comparison/results.json` | 修正前1FAIL/修正後11PASSの証拠・公開ハッシュ |
| trial `actor_ownership_matrix6_sources.json` / `actor_ownership_matrix6_prepare.py` | 旧22の不変と独立6のCPU strict/保存/tokenizer確認 |
| trial `actor_ownership_matrix6_compare.py` / `actor_ownership_matrix6_results.json` | 同6のa2e/6c比較12応答、印刷のtyped対象外と原文主体/否定評価の区別 |
| trial `actor_ownership_metadata4_trial.py` / `actor_ownership_metadata4_results.json` | 同じ否定文で時刻×感情詳細を交差させる一回4生成。API保存なし |
| trial `cumulative_model_token_budget.py` / `cumulative_model_token_budget_results.json` | 全1/20/50/100/201件を実tokenizer/実JSON本文で測るCPU処理。モデル/切断なし |

新意味owner/型/作者/DTO/DB/商品依存は追加していない。通常v4と研究候補未採用を保持。全履歴の実モデル分割・本番/端末/buildは未完。詳細はweekly§203–206。

## §207 — 全record保持の入力予算planner（offline準備）

| repository path | 当回の責務 |
|---|---|
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 既存service内の入力予算型・計画型・明示offline分割。全量資格を先に検査し、完全record/全欄/適格補足と全量guardを保持。通常ensure/factory未選択 |
| API `ai/tests/test_analysis_cumulative_model_source.py` | 全201件/原欄/最大3補足/Unicode/欄なしrecord・上限/型・全量拒否/途中計画なし・旧bytesの54追加対象。0018は補足fixtureのcanonical emotionだけ補正 |
| trial `cumulative_model_partition_budget.py` | 実tokenizer/実JSON encoderの12 CPU計画・488実測、全record/field/envelope/evidence/guard対応と元snapshot/source不変を照合。生成・通信・API/DB0 |

API0018f5bf、CI42086930254成功。入力予算準備だけで、出力2048適合・60秒全量処理・意味合成/保存/本番成功は未証明。通常既定v4を保持し、公開contract/DB/RN/配置/buildの変更0。STRUCTURE_MAP_DELTA_NONE（既存service内のoffline準備）。後続のbatch合成契約は本節と別に検証する。

公開集計はtrial `cumulative_model_partition_budget_results.json`、私的原本はweekly§207を参照する。

## §208 — 原応答を保つprivate batch INPUTと全量の明示offline合成

| owner path | 当回差分 |
|---|---|
| API `.../cores/analysis/semantic_admission.py` | private batch INPUT型/stateと全parent/child/record/fieldのexact検査・input保存再束縛。既存singleと共通のrecord compile/全量集約・最後の一回authorを使用 |
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 明示offlineのbuild／serialize INPUT／reload INPUTの3wrapper。元snapshot・全量coverageを維持。通常ensure/factory/HTTP/保存不変 |
| API新 `ai/tests/test_analysis_cumulative_model_batches.py` | 合成応答55対象。201child対全量logical oracle、部分未解析/欄なし・補足/ROLE・input往復・全体拒否・旧9profile保持 |
| API既存 `.github/workflows/analysis-observed-content.yml` | 既存の累積/API/jobs suiteに新moduleを追加。build/配置なし |

APIfc7563b9、CI42091295426全工程成功。新private INPUT/stateとoffline合成の責務追加としてSTRUCTURE_MAP_DELTA_PRESENT。通常／公開DTO／保存map／DB／RN契約は不変。raw連結・巨大Response再構成はせず、通常分割取得・実4B全量処理・出力2048/全体60秒・一回commitは本節の完了対象ではない。


trial `cumulative_model_batch_live.py`は全20件の一回3生成と各raw/拒否理由を非公開保持する研究専用runner。`cumulative_model_batch_composition_results.json`と`cumulative_model_batch20_results.json`が公開集計。通常のmodel factory／ensure／公開DTO／DB／RNの責務は不変。

## 11/5 §210 — 既存sourceが証明する明記SELFの希望をconsumerへ接続

| owner path | 当回の責務差分 |
|---|---|
| API既存 `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | `compile_model_observed_actions`から狭い`_model_complete_observed_plain_wishes`へ接続。一原record／原memo一欄・明記SELF・肯定・既存9動詞のwish current_input／pastと同欄の過去行動を、元graph・根拠・時点・未確定のまま保持。全文座標／hash／unit／root kindを照合し、純粋な過去行動helper・有限文法・語彙は不変 |
| API既存 `ai/tests/test_analysis_model_observed_actions.py` | 新27対象。v4/v7時点・元graph一致、20record根拠、誤kind／operator削除／欠落／偽注釈等、他者／省略／否定／認知／順序／未読／別欄・補足の採用拡張禁止、compiler／作者を禁止した保存map再読を検証 |

API09b65013658c661cbc33a3857bd2e360e6f4c424、新27を含むJupyter185 PASS、CI42095168200全工程成功。元fc756で生成した同じ実4Bの4応答を0モデルで旧新版再読し、WH02過去希望のみNoneから「希望（当時）」1nodeへ接続。WH01誤kind／WH03主体省略／WH04否定注釈不足は未対応を保持。別の正規合成20record INPUTはmapped0→20／unparsed0／2nodeだが、実3childの欠落rawを修復した結果ではない。既存owner内の限定proof接続としてSTRUCTURE_MAP_DELTA_NONE。型／state／作者／通常設定／公開DTO／DB／RNの追加変更0。通常全量取得・実全欄出力・一般品質・本番採用は未証明。

[原本・実測・境界・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-model-plain-wish-20261105)。wire24はCPU準備完了。実GPU対照の経過・結果は本節の成果に含めない。


公開集計は既存trialの`plain_wish4_results.json`。モデルraw・元Response・保存INPUTは非公開原本へ保持する。

## 11/5 §211 — 研究専用wire24比較と欄欠落・主体退行の切分け

| 既存trial path | 当回の責務・結果 |
|---|---|
| `observation_learning/trials/2026-11-01-analysis-model-fields/multirecord_wire_prepare.py` | 元18のencoded identityを保持し、T01/T02の完全recordから新規complete合成snapshotのMW6を作り、全member集合由来の合成用guardを付ける。実DB snapshot／guardではない。既学習sourceのHN／既知非学習診断sourceのHX、cached旧6のexact request束縛、全教師の非生成再読とtoken予算を確認 |
| `observation_learning/trials/2026-11-01-analysis-model-fields/multirecord_wire_run.py` | 既存a2eから24更新・NLL20・新16stop／3loadを一度実行。原raw・request／Responseを保持し、wire／strict候補／直接private mapを別評価。13候補state／37fieldを非生成再読。通常ensure／保存writerは変更しない |
| `observation_learning/trials/2026-11-01-analysis-model-fields/multirecord_wire_plan.json` | 更新／生成／測定枠と比較群を固定。MW6 after-only、HN／HX前後、cached成功4＋既知欠落2の評価範囲を分け、一般精度や全20件成功へ換算しない |

API09b650固定。MW6 after-onlyの18field一致は新しい改善率ではなく、matched8で全欄改善0、B20の11field欠落を維持、AE05だけ原文外actor追加で拒否へ退行。AP07／AP08／OP02は保持。新3f937251／configede2ce81は通常・次学習初期とも不採用。研究runnerだけの差分としてSTRUCTURE_MAP_DELTA_NONE。商品owner／意味型／作者／公開DTO／DB／RN／配置／buildの追加変更0。[全結果・境界・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-multirecord-wire24-20261105)。後続v8・100c1bbは候補コードcheckpoint／テスト中と2要求予定の段階で、本節の実行成果に含めない。

公開集計は既存trialの`multirecord_wire_results.json`。元本文・人物・model raw・重みは非公開原本へ保持する。

## 11/5 §212 — 欄一覧を明記するprivate v8と未返却の実試行

| owner path | 当回の責務差分 |
|---|---|
| API既存 `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | private selected_material.v8／独立ref・state variantを追加。v7 system全文＋実field一覧／総数tailのみ、user完全同一。v7/v8 Response・state混用を拒否。通常constructor／既定v4／planner／batch envelopeの許可集合は不変 |
| API既存 `ai/tests/test_analysis_model_actor_profile.py` | 旧v4/v6/v7 bytes保持、全原欄＋最大3回答の一覧、state非生成往復・混用拒否、6/7欄の欠落拒否・全欄empty未解析、通常選択の非拡張を検証 |
| 非公開研究原本内 `v8_fieldcount_trial.py` | 既知7/6fieldの元v7 bindingとcached原応答を保持し、元a2eでv8の一回比較を準備。FC01開始後signal14終了・raw0、FC03未実行、再実行0を原本へ保持 |
| 既存trial新 `v8_fieldcount_results.json` | CPU予算・CI・未返却／未実行・version6原本参照hashを本文なしで保存。人物／原文／model rawは含めない |

API100c1bb、Jupyter384 PASS／PG未設定19 SKIP、CI42105775747全工程成功。実試行は1load／開始1／原raw0／新生成0／学習0、34.607942907秒・child -14で、全欄改善／意味品質／strict受理は判定不能。private profile／ref／state variantの追加だけをSTRUCTURE_MAP_DELTA_PRESENTとして記録し、通常設定／planner／batch選択／意味型／作者／公開DTO／DB／RNは不変。optional kernel未導入・速度未証明、後続negativewishコードは成果除外。[原本・実結果・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-v8-fieldcount-20261105)。

## 11/5 §213 — 元全文で否定を保つplain wishの限定接続

| owner path | 当回の責務差分 |
|---|---|
| API既存 `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 既存の`_model_complete_observed_plain_wishes`にSELF／negative／wishのcurrent_input／pastを追加。元sourceの完全proofとroot全文の否定を照合して元graphを返す。NEG注釈欠如をraw修復で補わず、shared checker／grammar／作者は不変。併存ACTIONは従来の肯定過去のみ |
| API既存 `ai/tests/test_analysis_model_observed_actions.py` | v4/v7・否定希望の現在／過去・単独／行動併存・NEG注釈あり／なし、raw不変・元graph一致、否定削除／誤kind／偽注釈と他者／省略／認知／順序／別欄・補足拒否、保存非生成再読を検証 |
| 既存trial `observation_learning/trials/2026-11-01-analysis-model-fields/negative_wish_replay.py` | 元fc756の4原Responseを旧100c1bb／新5c9606へ0モデル再読。tuple/list比較誤差はcanonical JSON比較1点だけを修正し、失敗rootも保存。原request／source／rawは変更しない |

API5c9606、Jupyter241 PASS、CI42109915846全工程成功。fresh replay2でWH04だけNone→否定希望1node、WH02肯定pastのgraph／文章／図／coverageを保持し、WH01／03未対応を維持。NEG注釈欠如による意味欠落ではなく、旧consumerの肯定限定を切り分けた。raw修復／モデル／DB保存0、STRUCTURE_MAP_DELTA_NONE。通常選択／型／作者／公開DTO／DB／RNは不変。[全結果・境界・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-negative-wish-consumer-20261105)。version7保存済み。

公開集計は既存trialの`negative_wish_results.json`。元本文・人物・rawとfailed replay原本は非公開に保持する。

## 11/5 §214 — 商品sourceを変えない隔離optional runtime検証

| 研究owner／path | 責務と結果 |
|---|---|
| 公開trial v1 `optional_kernel_install.py`／`optional_kernel_control.py`／`optional_kernel_control_plan.json`／`optional_kernel_pypi_metadata.json` | 0.6系の公式metadata／hash固定wheel・隔離target／上限計画とimport-only確認を所有。Triton3.4のgluon.language.extra不足によるmodel0の失敗を保持し、成功版へ置換しない |
| 公開trial v2 `optional_kernel_install_v2.py`／`optional_kernel_control_v2.py`／`optional_kernel_control_plan_v2.json`／`optional_kernel_pypi_metadata_v2.json` | 0.5系／causal1.7／einopsのmetadata・隔離導入計画と4vendor callable実binding、固定API100c1bb／元a2eのwarmup1＋v7/v8各1を所有。global baseを維持し、原raw・開始／返却・timer終了を分ける |
| 非公開環境原本内 manifest／installed-files／probe／request・Response | 導入実体・base／source／target／adapterの不変と原raw・private stateを保持。公開metadataや集計へ原文／人物を転記しない |
| 既存trial新 `optional_kernel_results.json` | runtime版・hash／binding・計時と不変条件、2返却と未返却1・strict欠落拒否を本文なしで集計。速度倍率・通常採用・一般品質へ換算しない |

実結果は1load／3開始／2stop、KW00候補保持・KW01は旧と同じ先頭fieldだけで拒否・KW02は23秒signal14でraw未返却。4vendor実binding成立と、全欄出力／速度・意味品質の未証明を区別する。STRUCTURE_MAP_DELTA_NONE、通常v8 whitelist拡張0、商品owner／意味型／作者／公開DTO／DB／RN／配置／build変更0。version8保存済み。 [全結果・原本・境界](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-optional-kernel-diagnostic-20261105)。


## 11/6 §215 — 既存v7による完全1・2・3記録と教材coverage監査

| path | 責務 |
|---|---|
| trial新 `cardinality123_probe.py` | 既存API100c1bb／元a2e／隔離optional runtimeで完全record prefixをCPU準備し、新3要求を共有60秒・各23秒内で一回生成。原raw／Responseを保持し、既存strict候補と非生成再読を使用 |
| trial新 `cardinality123_results.json` | 全欄／候補／typed mapを分ける本文なし集計。N1/N2の希望誤kindによる未解析と、N3の過去行動＋現在希望2node・各3根拠／辺0を保持 |
| trial新 `cardinality_teacher_audit.json` | 元86poolの正解希望5と最終18更新の希望0、学習v4／検証v7の不一致を記録。継承元の未学習や単一原因は断定しない |

商品source／意味型／作者／通常profile／planner／batch／transport／API／DB／RNに追加変更なし、STRUCTURE_MAP_DELTA_NONE。新3stop／1load／学習0、通常採用なし。source／raw／全19原本・元86packは非公開保持、一般品質・全履歴60秒・DB保存／端末の成功へ広げない。実結果と次の独立事実／希望教示のCPU準備は[weekly§215](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-cardinality123-20261106)へ戻る。


## 11/6 §216 — 事実／願望の二欄proofと試行file地図

[weekly§216](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-fact-wish-fields-20261106)／[分析current](current_structure/03_analysis_current_structure.md)。APIe8f026eで既存原欄proofだけを拡張。全source→既存source graph→memo／memo_action別の完全照合→既存model consumer→既存文章／図、という接続。1record／1envelope・各node唯一根拠を保持し、別欄の原文や主体を借用しない。新source／作者／型／通常経路なし、未読／接続未確定を保つ。source未配置・d22c不採用。STRUCTURE_MAP_DELTA_PRESENT。

| File | 所有する仕事 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | `_model_complete_observed_plain_wishes`の原1–2欄完全proof。原graph不変、欄ごとのspan／unit・主体／時点／肯否の証明 |
| API `ai/tests/test_analysis_model_observed_actions.py` | 二欄／単memo_action・否定／過去・原欄入替え・未読／借用拒否・mock保存再読 |
| 前提資料 `observation_learning/trials/2026-11-01-analysis-model-fields/fact_wish_contrast_prepare.py` | 一回23教師と独立評価6／cached7のCPU準備・実tokenizer／gold検査 |
| 同 `fact_wish_contrast_run.py` | 既存4Bのbefore／23更新／after。一回のみ、原raw保存・上限・不採用維持 |
| 同 `replay_fact_wish_fields.py` | 原応答identityと候補非生成再読、既存typed／mock保存readerのCPU比較 |
| 同 `fact_wish_contrast_results.json` | 本文なし集計・部分失敗と二欄接続の区別 |

全102元fileと全重みは非公開保存。新18返却／cached7を確認、afterN3は23秒未返却。二欄E06は同じ原応答を0モデルで接続した範囲。一般の本人基準・役割・選択・記録間接続、全補足、IF／Saved／実DB／実機は未完了。


## 11/6 §231 — 希望境界研究profileと実ファイル対応

| path | 既存責務への差分 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | 明示v9はv7 material／全指示＋319字の希望境界tail。別request／response／private state variantと非生成再読。意味採用・raw修復は追加しない |
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 明示v9のcandidate／typed map／保存再構築で同じcategory contextを選ぶ。通常transport／既定v4／planner／batch許可集合は拡張しない |
| API `ai/tests/test_analysis_model_actor_profile.py` | v7 user／default保持、v7/v8/v9間のcross-response／state拒否、四希望形の元graph・保存非生成再読、通常transport／batch拒否 |
| trial `wish_boundary_probe.py`／`wish_boundary_v9_results.json` | fixed-a2e・after-only10・学習0／1load／240秒の一回比較と、本文なし結果／private原本参照 |

API17c7078f／CI42182501217全工程成功。現在・過去希望2例が文章・図へ到達、旧成功6保持、否定希望2例は未対応。private profile/ref/state variantをSTRUCTURE_MAP_DELTA_PRESENTとして記録し、一般意味品質・通常採用／本番配置は未成立。[全結果・再開点](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-wish-boundary-v9-20261106)。


## 11/6 §232 — 否定希望説明例の研究差分と実ファイル対応

| path | 既存責務への差分 |
|---|---|
| API `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | v10はv9全system＋独立2例930字。完全述語NEGATIONと各rootの明記主体を示す。別request／private state、元source／raw／型／consumer／作者は維持 |
| API `ai/services/ai_inference/analysis_cumulative_service.py` | 明示v10のcandidate／typed／保存再構築へ既存category contextを継承。通常選択は拡張しない |
| API `ai/tests/test_analysis_model_actor_profile.py` | 実system2例の意味／主体／非生成保存再読、v7/v9/v10のcross拒否、短い否定希望のunsupportedと通常transport／batch拒否 |
| trial `negative_wish_probe.py`／`negative_wish_v10_results.json` | 固定v9 rawをbeforeへ再利用、新v10だけ10生成／1load／学習0／240秒の一回比較。本文なし集計とprivate原本参照 |

API f50acbc／runner1ae1c811、CI42188492957全工程成功。否定希望2例が到達し旧8typed保持、raw一致は6。STRUCTURE_MAP_DELTA_PRESENTはprivate profile/ref/state variantと明示callerだけ。公開DTO／DB schema／意味型／通常transport・全量batch・RN／稼働採用は変更していない。[結果・保存原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-negative-wish-v10-20261106)。


## 11/6 §233 — 現v10対象scopeと保存readerの診断file対応

| path | 責務・実行範囲 |
|---|---|
| trial `target_scope_probe.py` | 元a2eのv7 before N1/N2/N3を固定し、同source／userの現v10を新3生成／1load／学習0／180秒だけ実行。全parentは既存record ownerへ渡し、旧runを再起動しない |
| trial `replay_target_scope_saved.py` | 実生成由来の文章／図／coverage／artifact IDを変えず、mock RPCから実current／月次readerを各2入口で再読。モデル／compiler／作者の生成入口禁止、静的本文照合は維持 |
| trial `target_scope_v10_results.json` | 1/2/3記録のmapped差分、対象子省略と意味保持、保存reader12readの限定、private原本参照 |

API f50acbc・semantic_admission／intent_compiler／cumulative serviceは無変更。通常profile選択・batch合成・DB schema／API／RN構造も不変。STRUCTURE_MAP_DELTA_NONE、map差分は今回の検証範囲更新だけ。[結果・再開点](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-target-scope-v10-20261106)。


## 11/6 §234 — 異内容／補足CPU診断file対応

trial `heterogeneous_scope_cpu.py`は完全合成snapshotとpacketを実prepare／strict／通常mapへ通す診断、`heterogeneous_scope_cpu_results.json`は本文なし集計を所有。新商品owner／通常経路／API／DB／RN構造の変更なし、STRUCTURE_MAP_DELTA_NONE。原希望と補足の局所source view不整合を[weekly§234](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-heterogeneous-scope-cpu-20261106)へ記録。

§234継続：API既存 `semantic_admission._compile_model_observed_record` は原入力専用sourcesとmember child参照の局所viewを整合し、最終source集合を保持する。既存 `test_analysis_model_observed_actions.py` へ26回帰、trial `heterogeneous_scope_probe.py` は固定モデル比較を所有。新商品owner／型／公開DTO／DB／RN構造は追加しない。

§234確定：API db6a571の既存2file修復はCI全工程success。heterogeneous_scope_probe.pyは準備sourceのみ、実model未起動。Jupyter未回収結果と復旧手順はweekly§234末尾。STRUCTURE_MAP_DELTA_NONE（既存局所view修復と診断runner、通常API／DB／RN構造追加0）。

> 継続更新：§234の補足希望未対応／別proof未実装は当時の記録。後続§235で単一SELF希望だけを回答自身の完全根拠で接続した。旧診断と原本は上書きしない。

## 11/6 §235 — 補足自身のplain SELF wish証明と実file地図

API [5efdafab](https://github.com/MassyuRed/mashos-api/commit/5efdafab93f555dc777a07a886d051d72b8fe1a9) の変更は下記既存4file＋新test1file。新product ownerは追加せず、既存consumer責務を限定拡張する。

| 実path | 責務と今回の差分 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 原入力専用wish wrapperを保持し、完全field／全unit照合だけを共用。新 `compile_model_supplement_plain_wish` が全親検証後、補足自身のmemo／版／envelope／座標／hashと再導出したSELF命題で単一希望を証明 |
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | 既存ordinary ACTION／ROLE＋決定に続く第三の回答経路として接続。元カテゴリ・同一recordの機会count・親SOURCE_SCOPEを既存集約へ保持 |
| `mashos-api/ai/tests/test_analysis_model_supplement_wish.py`（新） | 88検査。肯否／現在過去、既存9動詞、canonical代表の再導出、親未読、カテゴリ／複数record／複数回答、根拠改変・更新／衝突／注釈拒否、保存非生成再読 |
| `mashos-api/ai/tests/test_analysis_model_observed_actions.py` | 原入力専用wrapperの補足拒否を直接検査し、新しい別proofとの境界を確認。既存原希望・ordinary ACTION・保存wire回帰を保持 |
| `mashos-api/.github/workflows/analysis-observed-content.yml` | 既存生成保存検査へ新補足wish moduleを追加。通常runtime／配置の有効化ではない |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/replay_heterogeneous_scope_cpu.py`（新） | 元CPU原本SHAを固定し、元10完全snapshot／合成packetを変更せずcandidate／typed map／保存candidate／current・月次projection readerへ通す0モデル診断。10/10・候補reload10／mock RPC reader40read。元の比較器失敗は別原本へ保持 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/supplement_wish_own_evidence_results.json`（新） | 本文なし集計。元f50／直前db6／現5efdの比較、local検査と進行中CI、モデル／実DB0、非公開原本への参照を分離 |

新88＋旧232＝320 PASS、広域282 PASS／SQL環境20 SKIP、CI42205450639全工程success。同packet10/10・4.380014秒、HC09の2nodeは直前db6の回復を保持し今回の新効果へ数えない。新model／raw取得／DB0、Jupyter新結果未回収。元 `heterogeneous_scope_probe.py` は依然実model未実行で、将来使う場合は5efdafabへ固定した別runtimeが必要。STRUCTURE_MAP_DELTA_PRESENT（既存consumer責務）。公開型／唯一作者／共有文法／DB／RN／通常profile・transport不変。[全結果・境界・再開点](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-supplement-wish-own-evidence-20261106)／[本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/supplement_wish_own_evidence_results.json)。

> 継続更新：§235の実model未実行／Jupyter未回収は当時の状態。後続§236で旧原本回収と固定baselineの一回実行を行い、元raw／model packを不変で保持した。

## 11/6 §236 — 実モデル異内容比較と位置束縛修復の実file対応

| 実path | 今回の責務・差分 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | API `c1502415cc5d0e4fb9ff1fd5e1fcbe7a1af848b9`。既存の全field一意引用を優先し、曖昧なv10のdirect-root `CONTENT_TARGET`だけを、全fieldで一意な親引用内の唯一位置へ束縛する。型・既存意味proof・qualifier規則・他profileを変更しない |
| `mashos-api/ai/tests/test_analysis_model_parent_local_content.py`（新） | 13 methods。親／子の一意性、絶対scalar・UTF8座標、従来wire／profile・nested／UNKNOWN等の拒否、合法bare predicateと保存再読、不正過去希望modifierの未解析保持 |
| `mashos-api/.github/workflows/analysis-observed-content.yml` | 既存生成・保存検証へ上記回帰moduleを追加。配置や通常採用の有効化ではない |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/replay_heterogeneous_scope_saved.py`（新） | 元実応答と同raw比較結果を照合し、既存projection／本文／coverageを実current・月次readerへ非生成再読する診断。[source](observation_learning/trials/2026-11-01-analysis-model-fields/replay_heterogeneous_scope_saved.py)、最終SHA `0ab6d58159b267e2cd5eecf59e0185b96e46576cdb630728bd98f5aae8b2864c` |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/heterogeneous_scope_v10_results.json`（新） | [本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/heterogeneous_scope_v10_results.json)。実4B baseline、同rawの旧版／修復版比較、非生成reader、未完了と非公開原本参照を分ける |

実4Bは24field／最大4502入力token、10stop／1load／学習0、child128.340060778秒／parent134.238438373秒・exit0。baseline5efdは7要求／10mapped record／16node、HC01は引用位置曖昧、HC03／10は重複JSON keyで拒否。baselineの同raw f50比較と候補非生成再読、7成功×current／月次各2入口＝mock RPC28read一致を確認した。

位置束縛修復後の同raw CPU比較はHC01だけ候補成立・4node／mapped2／未解析1へ変わり、日記の過去希望に付いた不正modifierは拒否、他9件の全graph／count／拒否を保持。初版の親内強制による合法bare predicate回帰はレビューで検出し、全field一意優先へ訂正した。初期記録は保持する。local497 PASS＋11subtests／失敗・skip0・35.19秒、CI42217456387全工程success。修正版のJupyter同raw比較はexit0、保存reader32read一致。新型／文法／prompt／作者／通常transport・既定／DB／RNの差分0、STRUCTURE_MAP_DELTA_NONE。一般品質・通常採用／実DB／本人端末／IF・Savedは未成立。[最新記録](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-heterogeneous-v10-live-20261106)。


## 11/6 §237 — 既存教師のCPU監査・準備source地図

| 実path | 今回の責務 |
|---|---|
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/audit_existing_teacher_v10.py` | 固定23既存teacher／targetを現c150の旧profileとv10へCPU束縛し、候補・typed・非生成再読／固定tokenizerを監査。15012bytes／SHA `aa778c9225c9b87599c4620d3807f33d73077c662b5b837e232b84b556fac8c1`、checkpoint `bcc541f` |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/prepare_existing_teacher_v10.py` | 元target／sourceを維持し、v10 messages／ref／encodingだけを新private packへ準備。13666bytes／SHA `caca683c0391092e0815f9d5a054efc587b69b2990b801d299b7fcd120c91add`、checkpoint `976ddf`。validateはreceiptのみ |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/existing_teacher_v10_cpu_results.json` | [本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/existing_teacher_v10_cpu_results.json)。23候補／再読とtyped12／未対応11、token／mask、旧学習履歴と未採用・保全先を分離 |

新product owner／型／共有文法／通常profile・transport／DB／RN／作者は追加しない。固定tokenizerで最大input4289／full4510／tail225、prefix／EOS／maskと予算を照合したCPU準備であり、新学習や一般品質の証明ではない。元23target／source不変・評価教師化0・LM／更新／DB0、新private pack不採用、新runnerはsource完成・実行前review済、prepare／run未実行。正しい過去希望F03／F08と選択a2e final18更新の不一致を、教師不存在や全祖先の未学習へ読み替えない。§236のc150／CI42217456387全success・実10応答とsame raw32readはそのまま保持。STRUCTURE_MAP_DELTA_NONE。[最新結果・原本・再開点](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-existing-teacher-v10-cpu-20261106)。


§237・未実行runnerの追加実path：`Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/trial_existing23_v10.py`（42741bytes／SHA `b3e386fdc7bfc812552a9d4ecc5073e3266600eba0ab6f705d66b786e4f4c83a`）。source完成・実行前review済、prepare／run未実行。最大23更新／NLL20／after14／2load／共有900秒・retry0の一回planを所有する。元HC01–10＋v10保持control4の原本照合済み、controlは既知保持でblindではない。原本不足時prepare停止・timeout途中値／未知保持・終了GPU確認・候補自動採用なし。CPU23監査／入力準備の完了をrunnerの学習／生成成功へ読み替えない。[source](observation_learning/trials/2026-11-01-analysis-model-fields/trial_existing23_v10.py)／[planと未完了](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-existing-teacher-v10-cpu-20261106)。


## 11/6 §238 — 既存23／v10試行の結果fileと現在地

`Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/trial_existing23_v10.py` の一回試行は、23更新／NLL20／14stop／2load、747.8081569029018秒・外側750.5726890042424秒／exit0、cleanup空で終了。新しい商品ownerはなく、既存公開sourceへの追加実装もない。新 `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/existing23_v10_trial_results.json` が[本文なし集計](observation_learning/trials/2026-11-01-analysis-model-fields/existing23_v10_trial_results.json)を所有し、実行・退行・保持・根拠の限界・不採用と完了したCPU欄診断を分ける。

HC01／02が退行し、HC03／10はraw同一の重複key拒否を継続。HC04–09＋既知control4のgraph／本文図は保持したが、全14のmapped16→12・棄却source4→9により新b8d096は不採用。元a2eを維持する。4拒否はvalid JSON文法内の同object重複keyで、HC01には欄欠落／混入／誤kindもある。strict reader／raw／元教師を緩和・修復しない。今回23の構成は共通10＋既存希望5＋F8で、旧18＋5とせず、API／評価条件差から唯一原因を断定しない。local CPUの候補binary／41外部file照合と、元a2e・残30外部fileのlive receiptを区別する。通常採用／型／文法／作者／DB／RN／Render／merge変更0、STRUCTURE_MAP_DELTA_NONE。[§238の全結果・保全・次の一作業](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-existing23-v10-bounded-20261106)。CPU欄診断はlocal／Jupyterで完了、新GPU／新教師案は未選定、同23を反復しない。


§238の追加実path：`Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/audit_analysis_wire_fields.py`（18442bytes／SHA `f4c0ed18d753dcd2f69efea92cec11c27898c990d0ec6f7bd1131f046f55bd84`、[checkpoint352b44a5](https://github.com/MassyuRed/Cocolon/commit/352b44a55cfb1490a32f4ca1a00e8f420fcabe11)）。[source](observation_learning/trials/2026-11-01-analysis-model-fields/audit_analysis_wire_fields.py)は保存rawのduplicate key・宣言field列挙・source候補をread-only診断し、local／Jupyterとも28応答／44入力不変、重複6／非重複22・自己確認11 PASS、Jupyter exit0で同一報告SHA `70e7b58c5aaa725966e724413af8d302afcfa13a4fa32060ec94e1375bc7d088` を確認した。宣言field直前対応とdecoded field内座標は診断専用、admission=falseでsource-envelope Evidenceの代替ではない。追加LM／学習／DB・raw修正0、product責務追加0。非公開原本version6は170member／15,869,307bytes／SHA `892775f6407ab07770b4716b2dea210a48d57abd94a047d25a6d16afc5dc27f5` で保存済み。version5全payloadを保持し、最終review・wire原本を追加した。


## 11/6 §239 — v11欄組織指示の全変更file

| 実path | 既存責務内の差分 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | opt-in v11の欄一覧／object境界指示・request/state版。v10意味・親内引用束縛とstrict readerを継承 |
| `mashos-api/ai/services/ai_inference/analysis_cumulative_service.py` | 既存候補build/serialize/reloadとmap分岐のv11受渡し。通常HTTP/batch許可は据置 |
| `mashos-api/ai/tests/test_analysis_model_actor_profile.py` | 版間流用拒否、元材料不変、親内引用／保存再読、欠落・重複拒否と通常選択の境界 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/field_object_prompt_trial.py` | 既存before14・固定a2eを使う学習0／14 after-only／300秒の一回比較と非生成再読 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/field_object_prompt_results.json` | 本文なし結果、局所回復・未達・失敗launchと保全先を分離 |

新商品ownerなし、STRUCTURE_MAP_DELTA_NONE。既知HC03の2recordが4nodeへ回復し、全14の生成12→13（うち1部分成立）・mapped16→18。旧12のraw/本文図保持、13候補再読・14応答再処理一致。HC01過去希望とHC10重複fieldは未達。APIff36d037／CI42234794559全step success、通常採用／DB／RN／Render／merge／deploy変更0。[全結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-field-object-v11-20261106)。


## 11/7 §240 — 研究用生成構造制限の全変更file

| 実path | 既存責務内の差分 |
|---|---|
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/analysis_field_object_mask.py` | field番号・順序・key一回性・型を制限する研究Grammar。引用文字列は自由、意味採用の作者にならない |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/field_object_shape_trial.py` | 固定v11/a2e・旧14入力との一回比較、既存syntax2b／実model EOSの照合、生成前後hash・原raw・非生成再読を保持 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/field_object_shape_results.json` | 本文なしの形式回復／意味保持／未達／保全先の分離集計 |

既存syntax2bとenum参照を改変せず再利用。API変更0・新商品ownerなし、STRUCTURE_MAP_DELTA_NONE。HC10の原入力＋補足3欄が2record／4nodeへ回復、全14の到達13→14（うち1部分成立）・mapped18→20。旧13のraw末尾LF以外／意味／本文図保持、14候補再読・14応答再処理一致。通常未採用、DB／RN／Render／merge／deploy変更0。[全結果・原本・残件](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-field-object-shape-20261107)。


## 11/7 §241 — 過去希望profile比較の全変更file

| 実path | 差分／責務 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/semantic_admission.py` | opt-in v12説明／v13独立例示、固有ref/state、既存親内検証。v13はv11継承、失敗v12を継承しない |
| `mashos-api/ai/services/ai_inference/analysis_cumulative_service.py` | 既存累積経路で研究profile v12/v13を検証。通常profile選択は維持 |
| `mashos-api/ai/tests/test_analysis_model_actor_profile.py` | 新profile、活用4対照、source/ref/state分離、候補再読、補足・親内範囲・通常既定を検査 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/wish_inflection_prompt_trial.py` | v12の旧14＋新control前後10＝24生成を一回比較。失敗rawを保持 |
| 同directoryの`wish_positive_example_trial.py` | 元v11 baseline14と保存control5からv13だけ19生成、CPU事前検査・source/hash固定・非生成再読 |
| 同directoryの`positive_past_wish_results.json` | 本文なしのv12不採用／v13局所回復／中間5unit減少／未採用・保全先 |

資料変更は00／この01B／current_structure03／trial README／最新weekly§241／集計JSON。既存compiler・realizer・serve runtime・shape mask・syntax/enumsは不変。新ownerなし、STRUCTURE_MAP_DELTA_NONE。通常未採用・DB/RN/Render変更0。[実結果・次の一作業](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-positive-past-wish-20261107)。


## 11/7 §242 — 主体未確定の希望・全変更path

| 実path | 同じ既存owner内の責務 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 原入力memo全文に閉じた9動詞4plain希望、UNSPECIFIED、model完全field証明、別recordの不明主体を非集約 |
| 同directoryの`observed_route_realizer.py` | 文章・図共通labelに主体未確定と過去時点を保持 |
| `mashos-api/ai/tests/test_analysis_model_omitted_wish.py` | 36活用条件、source/主体/別record/保存境界。最初の5fixtureを修正、商品source不変 |
| `mashos-api/ai/tests/test_cmee_analysis_nominal_relations.py` | 新scopeに当たる旧拒否一例をwish/UNSPECIFIED/根拠を検証するpositive testへ移し、その他の拒否を保持 |
| `mashos-api/.github/workflows/analysis-observed-content.yml` | 既存回帰jobへ新test一行を追加 |
| `Cocolon/Cocolon_前提資料/observation_learning/trials/2026-11-01-analysis-model-fields/omitted_wish_saved_trial.py` | 取得済み19応答を旧新APIで0生成のまま消費し、raw保持とtyped差分を比較 |
| 同directoryの`omitted_wish_results.json` | 本文なしの局所回復・保持・失敗・未完了・保全先 |

前提資料は00／この01B／current_structure03／詳細設計04／trial README／weekly§242を差分更新。admission／累積service／共有意味／profile／DTO／DB／RNは変更しない。STRUCTURE_MAP_DELTA_PRESENT（既存意味採用とsafe表示範囲の限定拡張、新ownerなし）。[全結果・次の一作業](weekly_reviews/Cocolon_Weekly_Review_20261031.md#analysis-omitted-wish-20261107)。
