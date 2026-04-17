---
doc_id: cocolon_naming_lexicon
title: "Cocolon 命名体系"
revision_date: "2026-04-17"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 238
purpose: "華恋が Mash の指示語を current code に安全に写像する"
---

# 1. 目的

現状のコードは、**表示名の整理** と **internal canonical 名** がズレている。  
そのため華恋は、指示語をそのまま文字列置換せず、**語彙ごとの層** を持って読む必要がある。

# 2. まず current fact

## 2-1. tab label
```js
          tabBarLabel: ({ focused, color }) => {
            let label;
            switch (route.name) {
              case "Input": label = "Home"; break;
              case "MyWeb": label = "Analysis"; break;
              case "MyModel":
              case "MyProfile": label = "Piece"; break;
              case "RankingTop": label = "Ranking"; break;
              case "Settings": label = "Settings"; break;
              default: label = route.name;
```

## 2-2. Piece 領域の入口
```js
import React from "react";

import MyModelScreen from "./MyModelScreen";
import NexusScreen from "./NexusScreen";

export default function MyModelEntryScreen(props) {
  const hasLinkPayload = !!props?.linkPayload;

  if (hasLinkPayload) {
    return <MyModelScreen {...props} />;
  }

  return <NexusScreen {...props} />;
```

## 2-3. ProfileCreate API
```python
# -*- coding: utf-8 -*-
"""api_mymodel_create.py

MyModel Create (template Q&A) API
--------------------------------

Provides:
  - GET  /mymodel/create/questions
  - POST /mymodel/create/answers

This is the "Create" entry screen for the new fixed-question Q&A architecture.

Key rules (2026-04)
  - ProfileCreate uses the fixed free question set only (5 questions).
  - Users may leave questions unanswered.
  - Answers are always readable by the owner.
  - Editing existing answers is allowed for all plans.
  - Secret answers remain hidden from other users on Account.
```

```python
    @app.get("/account/profile-create", response_model=AccountProfileCreateResponse)
    async def account_profile_create(
        target_user_id: Optional[str] = Query(default=None, description="Target user id for Account display."),
        authorization: Optional[str] = Header(default=None, alias="Authorization"),
    ) -> AccountProfileCreateResponse:
        access_token = _extract_bearer_token(authorization)
        if not access_token:
            raise HTTPException(status_code=401, detail="Authorization header with Bearer token is required")

        viewer_user_id = await _resolve_user_id_from_token(access_token)
        resolved_target_user_id = str(target_user_id or viewer_user_id or "").strip() or str(viewer_user_id)
        is_self = resolved_target_user_id == str(viewer_user_id)

        try:
            await touch_active_user(viewer_user_id, activity="account_profile_create")
        except Exception as exc:
            logger.warning("Failed to touch active_users: %s", exc)

        questions = await _fetch_questions(build_tier=LIGHT_BUILD_TIER)
        question_ids: Set[int] = set()
        for q in questions:
            try:
                question_ids.add(int(q.get("id")))
            except Exception:
                continue

        answers = await _fetch_answers(user_id=resolved_target_user_id, question_ids=question_ids)
        items, answered_count = _build_account_profile_items(
            questions=questions,
            answers=answers,
            is_self=is_self,
        )

        return AccountProfileCreateResponse(
            items=items,
            meta={
                "viewer_user_id": viewer_user_id,
                "target_user_id": resolved_target_user_id,
                "is_self": bool(is_self),
                "total_questions": int(len(question_ids)),
                "answered_count": int(answered_count),
                "visible_answered_count": int(len(items)),
                "can_edit": bool(is_self),
                "label": "ProfileCreate",
                "engine": "account.profile_create.v1",
            },
        )


    @app.post("/mymodel/create/answers", response_model=MyModelCreateAnswersResponse)
```

## 2-4. Input 起点の別 Piece flow
```python
# -*- coding: utf-8 -*-
"""api_emotion_reflection.py

New Reflection flow driven by the current emotion input only.

Endpoints
---------
- POST /emotion/reflection/preview
- POST /emotion/reflection/publish
- POST /emotion/reflection/cancel
- GET  /emotion/reflection/quota
"""

from __future__ import annotations

```

# 3. 命名 lexicon

| 語 | 現在の位置づけ | current code fact | 華恋の解釈ルール |
|---|---|---|---|
| Analysis | public UI 名 | `App.js` と `MyWebScreen.js` で使用 | `MyWeb` 領域として読む |
| MyWeb | internal canonical | route / file / API で残存 | public UI 名に戻さず、そのまま internal 名として扱う |
| Piece | public UI 名 + public 概念名 | `App.js` / `NexusScreen.js` / guides / Input copy に出る | 修飾なしなら原則「Piece単体」を指す。`Piece画面` は Nexus surface |
| Nexus | internal system 名 | `MyModelEntryScreen -> NexusScreen`, `lib/nexusApi.js`, `api_nexus.py` | Piece 画面全体システムを指す内部名 |
| ProfileCreate | public UI 名 | `MyModelCreateScreen`, `/account/profile-create` | 固定プロフィール資産 |
| MyModel | legacy 名 | route / file / API canonical に大量残存 | 旧名として扱う。無視しないが新設計名には使わない |
| Reflection | backend canonical | `reflection_*`, `generated_reflection_*`, `api_mymodel_qna.py` 等に残る | visible copy では Piece に寄せるが、storage/read-side canonical として読む |
| EmotionLog | internal 画面/API 名 | `EmotionLogScreen.js`, `/emotion-log/*`, `api_friends.py` | internal 名として使う |
| 感情通知 | public UI 名 | `NexusScreen` / `EmotionLogScreen` の copy | 実装探索は EmotionLog / friends / emotion-log で行う |
| EmotionGeneratedPiece | 華恋用補助用語 | repo official term ではない | Input 起点 `/emotion/reflection/*` flow を指す |

# 4. 解釈ルール

## 4-1. 「Piece画面を変更したい」
→ **Nexus surface** の変更として解釈する。  
主対象:
- `screens/MyModelEntryScreen.js`
- `screens/NexusScreen.js`
- `screens/MyModelScreen.js`
- `screens/MyModelReflectionsScreen.js`
- `lib/nexusApi.js`
- `api_nexus.py`
- `api_mymodel_qna.py`

## 4-2. 「Pieceの仕様を変更したい」
→ **Piece単体 / generated reflection / qna read-side** の変更として解釈する。  
画面全体とは分ける。

## 4-3. 「ProfileCreateを変更したい」
→ 固定プロフィール資産として解釈する。  
主対象:
- `screens/MyModelCreateScreen.js`
- `screens/AccountScreen.js`
- `api_mymodel_create.py`

## 4-4. 「Inputから作るPieceを変更したい」
→ **EmotionGeneratedPiece** として解釈する。  
主対象:
- `screens/InputScreen.js`
- `components/EmotionReflectionPreviewModal.js`
- `lib/emotionReflectionApi.js`
- `api_emotion_reflection.py`
- `emotion_reflection_store.py`

# 5. いま rename をどう扱うか

## 5-1. すでに進んだのは visible copy
今回の current snapshot で進んだのは主にこの層。

- `MyWeb` → `Analysis`（表示）
- `Reflection / Reflections` → `Piece`（表示）
- `MyModelCreate / ReflectionCreate` → `ProfileCreate`（表示）
- `Setting` → `Settings`（表示）

## 5-2. まだやっていないのは file / route / storage canonical rename
今まだ残る層:

- `screens/MyWeb*.js`
- `screens/MyModel*.js`
- `api_myweb_*.py`
- `api_mymodel_*.py`
- `reflection_*`
- `generated_reflection_*`
- public registry の `/myweb/*`, `/mymodel/*`

つまり、**いまは visible copy cleanup phase であり、canonical rename phase ではない**。

# 6. 華恋がいま絶対に守ること

1. `Piece` と `Nexus` を同義で潰さない  
2. `ProfileCreate` と `EmotionGeneratedPiece` を同じ作成機能にしない  
3. `Analysis` と `MyWeb` を file rename 済みだと思わない  
4. `MyModel` を新設計名だと思わない。ただし current code では現役なので検索対象から外さない

# 7. current snapshot での補助コード断面

## 7-1. ProfileCreate 画面
```js
          <View style={styles.panelHeader}>
            <CocolonBackButton onPress={onBack} style={{ width: 72 }} />

            <Text style={styles.panelTitle}>ProfileCreate</Text>

            <View style={{ width: 72 }} />
          </View>

          {/* 説明 */}
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>5つの問いに答えて、プロフィールを作成</Text>
            <Text style={styles.introText}>
              {introSubscriptionBenefit}{"\n"}
              Account 画面で編集される、固定的な自己紹介 / プロフィール資産です。{"\n"}
              他ユーザーには、回答済みの項目だけが表示されます。{"\n"}
              全てに答える必要はありません。{"\n"}
              「保存する」を押すと、答えた内容だけが更新されます。{"\n"}
              {introSecretToggleNote}
            </Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                回答済み：{answeredCount}/{totalQuestions}
              </Text>
            </View>
```

## 7-2. Input からの Piece 作成
```js

                  </View>
                ) : null}

                {!isTutorialMode ? (
                  <View style={styles.buttonWrapper}>
                    <CocolonButton
                      variant="secondary"
                      onPress={handlePreviewReflection}
                      disabled={!canPreviewReflection}
                      loading={reflectionPreviewLoading}
                      accessibilityLabel="Pieceを作成する"
                    >
                      Pieceを作成する
                    </CocolonButton>
                  </View>
                ) : null}

                <View
                  ref={okButtonRef}
                  collapsable={false}
                  style={styles.buttonWrapper}
                >
                  <CocolonButton
                    variant="primary"
                    onPress={handleOk}
```

## 7-3. publish 時の UI copy
```js
    if (!previewId || reflectionPublishLoading) return;

    setReflectionPublishLoading(true);
    try {
      const publishResult = await publishEmotionReflection(previewId);
      const inputFeedbackText = String(
        publishResult?.input_feedback?.comment_text || ""
      ).trim();

      await clearPersistedInputDraft();
      setPendingInputDraft(null);
      setDraftRestoreModalVisible(false);

      setSelectedEmotions([]);
      setMemo("");
      setMemoAction("");
      setSelectedCategories([]);
      setShowMemoSection(false);
      setActiveField(null);
      setMemoContentHeight(44);
      setMemoActionContentHeight(44);
      setIsSecret(false);
      Keyboard.dismiss();

      setReflectionPreviewVisible(false);
      setReflectionPreviewPayload(null);

      const nextQuota = publishResult?.quota && typeof publishResult.quota === "object"
        ? publishResult.quota
        : null;
      if (nextQuota) {
        setReflectionQuota(nextQuota);
      } else {
        void refreshReflectionQuota();
      }

      void refreshHomeCounts();
      void fetchGlobalSummary({ force: true });

      if (inputFeedbackText) {
        openInputFeedbackModal({
          commentText: inputFeedbackText,
          dominantLabel: "Pieceを作成しました",
        });
      } else {
        showToast("Pieceを作成しました");
      }
    } catch (e) {
      console.warn("InputScreen: publishEmotionReflection failed", e);
      Alert.alert(
        "Pieceの作成",
        String(e?.message || "Pieceの作成に失敗しました。")
```

# 8. rename phase の判断は別資料へ

ファイル名変更の判断は `06_Cocolon_ファイル名変更保留台帳.md` を見る。  
ここでは **語の意味を固定すること** だけを扱う。
