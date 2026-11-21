# Cocolon Piece Card / Image Export 再定義設計メモ

作成日: 2026-07-07 JST  
作成: 華恋  
対象: Cocolon / Piece / 三大中核フロー / EmlisAI / Analysis / 画像export / サブスク差分  
成果物種別: md設計メモ  
実装扱い: 本資料ではコード変更、patch作成、DB変更、RN変更、API route変更、response key変更、json/schema実ファイル化を行わない。  
位置づけ: 既存Piece機能を「Cocolon内投稿」中心から、「ユーザー入力の核を他者に届く表現物へ整える機能」へ再定義するための設計メモ。  

---

## 0. 結論

Pieceは、これまでの「ユーザー入力を一問一答形式に整え、Cocolon内へ投稿する機能」から、次のように再定義する。

```text
Piece =
ユーザー入力の核を、他者に届く表現物へ整える機能。

標準出力 =
画像化できるPiece Card。

Cocolon内表示 =
画像ファイル投稿ではなく、整形済みPiece text + visual_recipe による軽量カード表示。

外部共有 / 端末保存 =
投稿済みPiece recordから、その場でPNG/JPEG等へexportする。
```

今回の再定義では、Pieceを一問一答形式に固定しない。  
一問一答は、将来の表現形式候補のひとつとして扱う。

Piece生成のタイミングは、EmlisAI観測後とする。

```text
ユーザー入力
↓
EmlisAIが観測して応答
↓
ユーザーがPiece生成を選択
↓
Piece構造がexport-safeなPiece text + visual_recipeを作る
↓
公開 / 非公開を選択してPiece recordを作成
↓
必要なら画像としてDL / 外部SNS共有
↓
Analysis更新状態へ接続
```

内部構造として、EmlisAIにPieceとAnalysisを統合しない。  
三大中核は、上位のCocolon Core Flow Orchestratorから接続する。

```text
Cocolon Core Flow Orchestrator
  ├ EmlisAI: 現在入力の即時観測
  ├ Piece構造: 観測後の表現化 / 画像化 / 投稿record生成
  └ Analysis構造: 入力保存後の期間観測更新
```

---

## 1. この資料で扱うこと

本資料では、次を扱う。

```text
・Pieceの再定義
・画像化をPiece標準出力として扱う設計
・Cocolon内投稿と画像exportの分離
・text + visual_recipe による軽量表示
・公開 / 非公開 visibility
・投稿済みPieceからの再DL
・本文編集不可の理由
・Free / Plus / Premium の差分
・三大中核フロー内でのPiece位置づけ
・実装前に確認すべきDB / API / RN / Guard / test候補
```

本資料では、次を行わない。

```text
・実ファイル修正
・DB schema確定
・API route確定
・RN UI確定
・画像exportライブラリ確定
・具体的なテンプレデザイン確定
・既存Piece公開仕様の即時変更
```

---

## 2. 現行Pieceの確認

### 2.1 現行Pieceの役割

現行Pieceは、ユーザー入力から、他者に伝わる問いと答えを作る構造として扱われている。

確認した主な現行資料・実ファイル:

```text
Cocolon_前提資料/00_karen_read_first.md
Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md
Cocolon/components/EmotionPiecePreviewModal.js
mashos-api/ai/services/ai_inference/api_emotion_piece.py
mashos-api/ai/services/ai_inference/emotion_piece_generation_service.py
mashos-api/ai/services/ai_inference/emotion_piece_store.py
mashos-api/ai/services/ai_inference/piece_generation_policy.py
mashos-api/ai/services/ai_inference/piece_generated_display.py
mashos-api/ai/services/ai_inference/piece_text_formatter.py
mashos-api/ai/services/ai_inference/api_nexus.py
mashos-api/ai/services/ai_inference/piece_public_read_service.py
mashos-api/ai/services/ai_inference/piece_generated_access.py
```

現行Pieceには、次の境界がある。

```text
・Pieceは短縮要約ではない
・入力全体の核を、他者に伝わる形へ整える
・preview時本文とpublish時本文の一致を守る
・URL / PII / 攻撃表現 / visibility / publish可否を扱うpolicy境界がある
・piece_textは正式fieldとして扱われ、reflection_textは互換fieldとして残る
```

### 2.2 現行Piece閲覧範囲

現行Piece/Nexusは、誰でも見られる全体公開ではない。  
基本的には、フォロー関係または既存access policyに沿った閲覧範囲で扱われる。

今回の再定義では、この現行思想を引き継ぎ、Piece単位で以下を持たせる。

```text
公開:
  フォロー中ユーザー、または既存access policyで許可されたユーザーに見える。
  全世界公開ではない。

非公開:
  owner本人だけが見える。
  自分の過去Piece一覧で確認できる。
  画像DL / 再DLはできる。
```

---

## 3. Pieceの再定義

### 3.1 旧Piece

```text
旧Piece:
  ユーザー入力を一問一答形式の投稿文へ整え、Cocolon内に投稿する機能。
```

### 3.2 新Piece

```text
新Piece:
  ユーザー入力の核を、他者に届く表現物へ整える機能。

標準出力:
  画像化できるPiece Card。

出力先:
  ・Cocolon内に公開/非公開で置く
  ・画像として端末保存する
  ・外部SNSへ共有する
  ・投稿済みPieceから後で再DLする
```

### 3.3 一問一答形式の扱い

一問一答形式は必須ではない。

画像Pieceの価値は、問いと答えそのものではなく、ユーザー入力の核を他者に届く表現物へ変換し、保存・共有可能にすることにある。

一問一答は、将来的な表現形式の一候補として扱う。

```text
表現形式候補:
  ・Quote型
  ・Short Essay型
  ・Declaration型
  ・Q&A型
  ・Fragment型
```

初期実装では、Freeの形式を1つに固定してもよい。  
Premiumでは、形式選択をサブスク価値として扱う。

---

## 4. 三大中核フロー内での位置づけ

### 4.1 三大中核は統合しない

EmlisAIが大規模化しているため、EmlisAIを三大中核全体の本体にする案も考えられる。  
しかし、本資料ではそれを採用しない。

理由は次である。

```text
・EmlisAIが肥大化し、責務が曖昧になる
・EmlisAIの人間的フォローや温度がPiece/Analysisへ漏れる危険がある
・Pieceは他者に届く表現物であり、EmlisAIの観測文とは目的が違う
・Analysisは単発観測ではなく期間観測であり、EmlisAI配下に置くと歪む
・既存前提資料でも、EmlisAI / Piece / AnalysisのComposer境界は分けて扱われている
```

### 4.2 採用する構造

採用するのは、上位フローが三大中核を接続する構造である。

```text
Cocolon Core Flow Orchestrator
  ↓
  1. EmlisAI構造
      現在入力を観測して返す

  2. Piece構造
      Emlis観測後、ユーザーが選んだ場合に
      export-safeなPiece text + visual_recipeを生成する

  3. Analysis構造
      入力保存後、期間観測・分析更新へ渡す
```

UX上は、一連の流れとして見せてよい。

```text
Emlisの観測
↓
この入力をPieceにする
↓
Piece Card preview
↓
公開/非公開選択
↓
保存 / DL / 外部共有
↓
分析更新状態
```

内部構造では、EmlisAI / Piece / Analysisを混ぜない。

---

## 5. Piece生成タイミング

Piece生成は、EmlisAI観測後に行う。

```text
1. ユーザーが入力する
2. EmlisAIが観測して応答する
3. ユーザーが「この入力をPieceにする」を選ぶ
4. Piece構造がPiece Cardを生成する
5. 公開/非公開を選んでPiece recordを作成する
6. 必要なら画像DL / 外部共有する
7. Analysis更新へ接続する
```

現行UIでは、入力送信前または送信周辺にPiece preview導線がある。  
再定義後は、Piece生成導線をEmlis観測後へ寄せる。

### 5.1 Emlis観測モーダル内導線

Emlis観測モーダル内に次を置く。

```text
・この入力をPieceにする
・閉じる
```

理由:

```text
Emlis観測を読んだ直後が、最もPiece化したくなるタイミングであるため。
```

### 5.2 閉じた後の補助導線

ユーザーがEmlis観測モーダルを閉じた後も、一定時間だけ導線を残す。

```text
・入力完了画面
・toast
・action area
```

表示例:

```text
今の入力をPieceにする
```

これにより、すぐ閉じたユーザーも後からPiece化できる。

---

## 6. Cocolon内投稿と画像exportの分離

### 6.1 Cocolon内は画像ファイル投稿にしない

Cocolon内feedや過去Piece一覧に、画像ファイルそのものを投稿本体として流さない。

理由:

```text
・DB容量が重くなる
・Storage転送量が増える
・feed表示が重くなる
・キャッシュ管理が複雑になる
・端末通信量が増える
・画像読み込み待ちがUXを悪化させる
```

### 6.2 Cocolon内では軽量Piece Cardとして表示する

Cocolon内では、画像そのものではなく、次の情報を保存してRN側でカード表示する。

```text
piece_text
visual_recipe
format_type
template_id
template_version
theme_id
font_style_id
aspect_ratio
branding_mode
visibility_scope
piece_text_hash
```

これにより、Cocolon内表示は軽く保つ。

### 6.3 画像は必要時にexportする

画像ファイルは、次の場合にその場で生成する。

```text
・端末保存
・外部SNS共有
・過去Pieceからの再DL
```

画像を常時DBやfeedに保持しない。

### 6.4 投稿済みPieceから再DLする

Piece recordが残っていれば、ユーザーは後から対象Pieceを開いて再DLできる。

```text
過去Piece一覧
↓
対象Pieceを選択
↓
カード表示
↓
ダウンロード
↓
その場で画像export
```

再DLには、`visual_recipe` と `template_version` が必要である。

---

## 7. visual_recipe設計候補

### 7.1 目的

`visual_recipe` は、画像そのものを保存せず、Piece Cardを再現するための表示レシピである。

```text
visual_recipe =
Piece textをどの形式・テンプレ・テーマ・比率・brandingで表示するかの軽量設定。
```

### 7.2 候補構造

```json
{
  "format_type": "quote",
  "template_id": "soft_paper_01",
  "template_version": 1,
  "theme_id": "calm",
  "font_style_id": "gentle",
  "aspect_ratio": "4:5",
  "branding_mode": "required_small",
  "branding_position": "bottom_right"
}
```

初期実装では `branding_position` をユーザー選択にしない。  
Premiumでも、初期は「branding OFF可」までに留め、表示位置選択は入れない。

### 7.3 template_versionの必要性

テンプレートは将来更新される可能性がある。  
そのため、過去Pieceの見た目が勝手に変わらないように、`template_version` を保存する。

```text
template_id:
  どのテンプレを使ったか。

template_version:
  当時の表示仕様を再現するためのversion。
```

---

## 8. 公開 / 非公開 visibility

### 8.1 基本方針

Piece作成時に、公開 / 非公開を選択できる。

```text
公開:
  フォロー中ユーザー、または既存access policyで許可されたユーザーに見える。
  誰でも見える全体公開ではない。

非公開:
  owner本人だけが見える。
  過去Piece一覧に残る。
  画像DL / 再DLはできる。
  Nexus / follower向けfeedには出ない。
```

### 8.2 投稿後の切替

投稿後も、対象Pieceを選択して公開 / 非公開を切り替えられるようにする。

```text
自分のPiece一覧
↓
対象Piece
↓
公開状態
↓
公開 / 非公開を切替
```

非公開にした場合、Cocolon内の他者向けfeedからは消える。  
公開に戻した場合、既存access policyに沿って再び見える。

### 8.3 外部共有済み画像の扱い

Cocolon内の公開 / 非公開を変更しても、すでに端末保存・外部SNS共有された画像はCocolon側で回収できない。

ユーザー向けにも、次の趣旨を示す必要がある。

```text
Cocolon内の公開状態は変更できます。
ただし、保存済み・外部共有済みの画像はCocolon側では取り消せません。
```

---

## 9. 本文編集不可

### 9.1 方針

画像化されるPiece本文は、ユーザーが自由編集できない。

```text
ユーザー入力
↓
Cocolon側で文章整形
↓
安全確認
↓
export-safe Piece text
↓
preview
↓
投稿 / 画像export
```

### 9.2 理由

本文編集不可とする最大の理由は、安全化と公開品質を守るためである。

```text
・個人情報を出さない
・暴力的表現を出さない
・攻撃表現を調整する
・規制対象になりうる表現を排除する
・他者に伝わる文章へ整える
・Cocolonが生成したexport-safe textとして責任範囲を保つ
```

ユーザーが自由編集できると、これらの安全化・整形の意味が崩れる。

### 9.3 元入力との関係

元入力は正本として保持する。  
画像Pieceは、元入力を上書きするものではない。

```text
元入力:
  ユーザーが最初に置いた記録。

Piece text:
  外部共有・他者閲覧に耐えるよう整えた表現物。

禁止:
  Piece textで元入力そのものを書き換えた扱いにすること。
```

---

## 10. 文章整形の目的

Pieceの文章整形には、優先順位がある。

```text
第1目的:
  個人情報・暴力的表現・攻撃表現・規制対象になりうる表現を排除/緩和し、公開・外部共有に耐える形へする。

第2目的:
  ユーザー入力の核を潰さず、他者に伝わる文章へ整える。

第3目的:
  画像カードとして読みやすい長さ・構成へ整える。
```

短くすること自体を目的にしない。  
禁止するのは、長さではなく、核が消えることである。

---

## 11. サブスク差分

### 11.1 Free

```text
回数:
  月5回。

品質:
  低め〜標準。

形式:
  固定形式。

テンプレ:
  固定テンプレ。

デザイン選択:
  なし。

branding:
  必須。
  小さめ表示だが、Cocolon名は残す。

保存 / 共有:
  可能。
```

Freeは、Piece画像化を体験できる導線として扱う。  
ただし、サブスク価値を残すため、回数・形式・テンプレを制限する。

### 11.2 Plus

```text
回数:
  月30回。

品質:
  標準。

形式:
  基本は自動おすすめ。

テンプレ:
  少数の背景テーマ選択を候補とする。

デザイン選択:
  初期では控えめ。
  「別の雰囲気にする」程度は候補。

branding:
  控えめ表示必須。

保存 / 共有:
  可能。
```

Plusは、日常的に使えるPiece画像化体験として扱う。  
月30回は、ほぼ毎日1回使える感覚を作る。

### 11.3 Premium

```text
回数:
  無制限。

品質:
  高品質。

形式:
  形式候補を選択可能。

テンプレ:
  背景選択可能。

文字デザイン:
  文字スタイル選択可能。

比率:
  SNS向け比率選択可能。

branding:
  OFF可能。
  初期では表示位置選択は入れない。

保存 / 共有:
  可能。
```

Premiumは、「自分の言葉を作品として仕上げる」体験を強くする。

---

## 12. branding方針

### 12.1 基本方針

Piece画像の主役は、Cocolonではなくユーザーの言葉である。  
そのため、brandingは控えめにする。

```text
Free:
  小さなCocolon branding必須。

Plus:
  控えめbranding必須。

Premium:
  branding OFF可能。
```

### 12.2 表示位置

初期実装では、表示位置選択は入れない。

理由:

```text
・UIが複雑になる
・実装とQA負荷が増える
・テンプレ崩れの原因になる
```

初期は、右下または下部など、Cocolon側で安全な位置に固定する。

---

## 13. 表現形式とユーザー選択

### 13.1 内容形式と見た目形式を分ける

Piece画像化では、内容形式と見た目形式を分ける。

```text
内容形式:
  文章の整え方。
  例: Quote / Short Essay / Declaration / Q&A / Fragment。

見た目形式:
  画像上のレイアウト。
  例: 中央大文字 / 余白多め / 手紙風 / 本文カード / タイトル付き。

テーマ:
  雰囲気。
  例: 静か / 夜 / 朝 / 花 / 水彩 / 紙 / 淡色。
```

### 13.2 自動おすすめ

初期体験では、ユーザーに最初から細かく選ばせない。  
Cocolonが入力内容に合わせておすすめ形式を選ぶ。

```text
短く核が強い入力:
  Quote型。

自己理解や反省が中心:
  Short Essay型。

決意や境界線が中心:
  Declaration型。

他者に説明したい内容:
  Q&A型。

感情の断片:
  Fragment型。
```

### 13.3 サブスク別選択範囲

```text
Free:
  形式固定。
  ユーザー選択なし。

Plus:
  基本は自動おすすめ。
  背景テーマ少数選択や別案生成を候補とする。

Premium:
  形式・背景・文字スタイル・比率を選択可能。
```

---

## 14. ユーザーフロー

### 14.1 基本フロー

```text
1. ユーザーが入力する
2. 入力を保存する
3. EmlisAIが観測して応答する
4. Emlis観測モーダル内に「この入力をPieceにする」を表示する
5. ユーザーがPiece生成を選ぶ
6. Piece構造がexport-safe Piece textを生成する
7. Piece Card previewを表示する
8. ユーザーが公開 / 非公開を選ぶ
9. Piece recordを作成する
10. 必要ならその場で画像DL / 外部共有する
11. 後から過去Piece一覧で再DLできる
```

### 14.2 閉じた後の導線

```text
Emlis観測を閉じた後:
  入力完了画面 / toast / action area に
  「今の入力をPieceにする」を一定時間表示する。
```

### 14.3 過去Pieceからの再DL

```text
自分のPiece一覧
↓
対象Piece
↓
Piece Card表示
↓
ダウンロード
↓
画像export
```

---

## 15. Analysis更新との関係

UX上の流れは、以下として見せる。

```text
観測
↓
Piece生成 / 画像化
↓
Analysis更新
```

ただし、内部処理として、Analysis更新をPiece完了まで完全に待たせる必要はない。

```text
入力保存後:
  Analysis更新queue / dirty flagを立ててもよい。

ユーザー操作:
  Emlis観測を読む。
  Pieceにするか選ぶ。

表示上:
  最後にAnalysis更新状態を見せる。
```

大事な境界:

```text
AnalysisはPiece生成に依存しない。
PieceはAnalysis更新に依存しない。
どちらも元入力・保存済み記録を起点に動く。
```

---

## 16. API / DB / RN 影響候補

本資料では確定しないが、実装時に影響候補となるものを列挙する。

### 16.1 DB候補

```text
piece_records / mymodel_reflections等の既存Piece storageに対して、additiveに以下を検討:

visibility_scope:
  public / private

piece_text:
  export-safeな整形済み本文

visual_recipe:
  表示レシピJSON

format_type:
  quote / short_essay / declaration / qna / fragment など

template_id:
  使用テンプレID

template_version:
  使用テンプレversion

theme_id:
  背景/雰囲気テーマ

font_style_id:
  文字スタイル

aspect_ratio:
  1:1 / 4:5 / 9:16 等

branding_mode:
  required / subtle / off

piece_text_hash:
  preview / record / export一致確認用

export_count:
  DL / share回数の計測候補
```

### 16.2 API候補

```text
POST /emotion/piece/preview:
  Emlis観測後の入力IDからPiece previewを作る候補。

POST /emotion/piece/publish:
  Piece record作成。
  visibility_scopeを受け取る。

PATCH /emotion/piece/{piece_id}/visibility:
  公開/非公開切替候補。

GET /emotion/piece/{piece_id}:
  owner向け詳細取得候補。

POST /emotion/piece/{piece_id}/export:
  backend exportを採る場合の候補。
```

API route名は未確定である。  
既存routeとcontractを確認してから決める。

### 16.3 RN候補

```text
Emlis観測モーダル:
  「この入力をPieceにする」導線追加。

Input完了後action area:
  一定時間「今の入力をPieceにする」を表示。

Piece Card preview:
  整形済み本文、テンプレ、公開/非公開、DL、投稿確定を表示。

Piece一覧 / 自分の過去Piece:
  過去Pieceをカード表示。
  再DL可能。
  公開/非公開切替可能。

Export renderer:
  RN上でviewを画像化するか、backend生成画像を受け取るかは未決定。
```

---

## 17. 画像export実装方針候補

画像exportは、RN側かbackend側かを実装前に決める必要がある。

### 17.1 RN側export

利点:

```text
・端末保存 / share導線と相性がよい
・DB/Storageへ画像を常時保存しなくてよい
・Cocolon内カード表示と同じViewからexportできる
```

懸念:

```text
・iOS/Androidでレンダリング差が出る
・フォント/改行/余白が端末依存になりやすい
・長文時の崩れ検証が必要
```

### 17.2 backend側export

利点:

```text
・出力品質を統一しやすい
・同じPieceを再現しやすい
・将来的なテンプレ管理がしやすい
```

懸念:

```text
・サーバー負荷が増える
・画像生成/保存/一時URL管理が必要になる
・Storage設計が必要になる
```

### 17.3 初期候補

初期は、RN側exportを第一候補とする。  
ただし、実機で品質差が大きい場合はbackend側exportを検討する。

---

## 18. 安全境界

### 18.1 raw inputを画像化しない

画像化対象は、raw inputではない。

```text
禁止:
  raw inputをそのまま画像化する。

採用:
  Cocolonが整形・安全確認したexport-safe Piece textのみ画像化する。
```

### 18.2 ユーザー編集不可

ユーザーが本文を自由編集できないようにする。  
編集可能にすると、安全化と公開品質が崩れる。

### 18.3 public metaへ漏らさない

画像export・Piece public surface・metadataへ、以下を漏らさない。

```text
・raw input
・comment_text body
・PII
・hidden meta
・safety判定の内部詳細
・User Label Connection等の内部語
・EmlisAI内部観測材料
```

### 18.4 公開/非公開と外部共有の限界

Cocolon内の非公開化は、Cocolon内の閲覧範囲を制御する。  
外部共有済み画像の回収はできない。

---

## 19. 回帰test / contract候補

実装時には、少なくとも次を検証する。

```text
1. Piece生成がEmlis観測後に発生すること。
2. EmlisAIのcomment_textや観測温度をPiece本文へそのまま流用しないこと。
3. Piece textがexport-safeであること。
4. ユーザー本文編集ができないこと。
5. preview時Piece textとrecord保存時Piece textのhashが一致すること。
6. Cocolon内feedが画像ファイルではなくtext + visual_recipeで表示できること。
7. 過去Pieceから再DLできること。
8. 非公開Pieceが他者feedに出ないこと。
9. 公開Pieceが既存access policyに沿って見えること。
10. 投稿後に公開/非公開を切り替えられること。
11. Free月5回制限が守られること。
12. Plus月30回制限が守られること。
13. Premium無制限が想定どおり動くこと。
14. Premium branding OFFが反映されること。
15. Free/Plusではbrandingが必須であること。
16. visual_recipeにtemplate_versionが保存されること。
17. raw input / hidden meta / safety内部詳細がpublic surfaceへ出ないこと。
18. 長文Pieceでも画像カードが崩れないこと。
19. iOS/Androidで画像export結果が許容範囲に収まること。
```

---

## 20. 未決定事項

現時点で未決定として残すもの。

```text
・画像exportをRN側で行うかbackend側で行うか
・初期テンプレ数
・Free固定形式をどの形式にするか
・Plusで背景選択を初期から入れるか
・Premiumの文字スタイル選択範囲
・Premiumの比率選択範囲
・Cocolon内Piece Cardの最終UI
・公開/非公開切替APIの具体route
・既存Piece storageへadditive拡張するか、新tableを用意するか
・export_count / share_countを計測するか
・外部共有時のOGP/誘導文をどう扱うか
・画像保存時のファイル名規則
・画像サイズと解像度
・長文時の分割 / 文字サイズ自動調整ルール
```

Plus回数は、月30回で確定候補とする。  
Freeは月5回、Premiumは無制限で確定候補とする。

---

## 21. ロードマップ反映候補

Piece画像化は、単なるUI装飾ではない。  
Cocolonの外部拡散、ユーザー資産化、サブスク価値に直結する可能性がある。

ロードマップへ入れる場合は、次のように扱う。

```text
Piece再定義:
  Cocolon内投稿中心から、表現物生成・画像化・外部共有へ拡張。

三大中核フロー:
  EmlisAI観測後にPiece生成を接続する。

実装優先度:
  EmlisAI/P7/P8本体と競合しないよう、設計メモとして先に固定し、実装順は別途判断。

収益接続:
  Free月5回、Plus月30回、Premium無制限/高品質/branding OFF/デザイン選択。

拡散接続:
  外部SNS共有と端末保存。

負荷対策:
  Cocolon内は画像ファイルではなくtext + visual_recipeで軽量表示。
```

---

## 22. 華恋の判断

この再定義は、Cocolonにとってかなり有効である。

理由は次である。

```text
1. PieceがCocolon内だけで閉じない。
2. ユーザーが自分の言葉を画像資産として持てる。
3. 外部SNSへの拡散導線になる。
4. Cocolonの宣伝効果が自然に生まれる。
5. サブスク差分を作りやすい。
6. 既存Pieceの核保持・安全化・preview/publish契約を活かせる。
7. 画像ファイルをCocolon内投稿本体にしないため、DB/feed負荷を抑えられる。
```

ただし、これは既存Pieceの小修正ではない。  
Pieceの定義を変える大きな設計変更である。

そのため、実装前には必ず以下を行う。

```text
・現行Piece storage / access / policy / preview / publish contractの再確認
・DB/API/RN影響範囲の洗い出し
・EmlisAI / Piece / Analysis の三大中核境界確認
・public safety / raw input non-leak / visibility切替の回帰test設計
・サブスクquotaの運用コスト確認
```

Pieceは、ユーザーの入力をただ投稿文にする機能ではなくなる。

```text
Piece =
自分の内側にあったものを、
他者に届く表現物として持ち出せる形にする機能。
```

この方向は、Cocolonの収益・拡散・保存資産価値のすべてに接続する可能性がある。

以上。
