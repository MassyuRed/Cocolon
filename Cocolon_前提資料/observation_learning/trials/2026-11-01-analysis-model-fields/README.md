# Analysis — 実4B直前の最小field接続

2026-11-01 JST。開始原本：Cocolon PR30 `1c66add4fdf8f5ded18f7443d6b91b1771998244`、API PR3 `36713940ea82e217fab8a7c0a738a33f21df1c4d`。Mashの分析残件開始とweekly§45.4に従う。Codex Work/GPT-6、root華恋が実装/統合/反映、別文脈agentはread-only監査のみ。独立Pro/Ultra又はhuman品質受入れとは呼ばない。System Context最新cacheは未成立のまま、fresh原本fallbackを使用。

## 今回成立したこと

新private `analysis_model_fields.v1` で完全な本人原入力fieldを要求し、受信JSON→既存ObservedGraph→唯一realizer→通常累積projection/private根拠→隔離SQL commit/readへ通す最小接続。実4B・新学習・稼働APIへの有効化はまだ0。

モデルが返すのは各fieldの五種node又はUNRESOLVEDという分類候補。全文quoteを原sourceから再束縛し、部分引用、原文変更、owner/版/guard違い、欠落/重複/余分、bool座標、自由label/原因等を拒否。finish_reasonはstopだけを許可。新typed quoted fieldは主体・否定・時点・留保を全文に保持し、独立して解決済みの命題へしない。省略主体を本人へ補わず、分類自体の正しさを検査済みとはしない。

新armの本人限定表示は末尾「（原文・分類候補）」を付ける。旧finite safe_projectionの原文非コピー保証を保ち、新profileだけの明示原文引用表示とする。全対象はunparsedに残し、mappedは可視候補nodeを持つrecord数に過ぎない。関係/因果/同義統合/反復推定は加えない。全UNRESOLVEDのrecordはcoverageへ残し、他recordへ結ぶ空gapを作らない。

比較・適格補足/訂正ありは明示UNSUPPORTED。古い原入力版に属するANSWERは既存source adapterに従って利用せず、stale件数を保持。完全sourceの既存Safety検査を維持する。通常ensureはmodel_inputを渡さず旧経路のまま。新API/DTO shape/DB/RN/依存/本番設定変更なし。

## CPU確認と限界

最終対象10file：**785 passed / failed0 / skipped0、95.91秒**。新profile33＋旧分析/累積/補足/P5の752。既存Pydantic非推奨warning1。別の反復検査/本文採取/subtestsは加算しない。最終test環境分岐を整えた新33も3.75秒/FAIL0/SKIP0で再実行成功。785へ重複加算しない。

実compilerの従来結果ではmapなしの架空2record・3fieldに合成候補を与えると、正常な既存safe projectionを作り、2可視record/未解析2を維持。通常private evidence allowlistへ新raw本文を足さず、隔離PGliteの実累積SQLへ保存した同じ文章/図/IDを、Engine.generate禁止状態でcurrentとmonthlyから再読した。元入力削除による派生物purgeも確認。合成候補を実4B生成、一般読解成功、本人実機又は商品受入れへ換算しない。

read-only監査で見つかった空refs gap、finish未検査、stale件数固定の3点を修正。新補助systemや旧assertion緩和は追加していない。全量分割、subclause意味、一般補足/訂正、複数recordの根拠ある関係/共通点、IF/Saved、常時提供/原価は残件。

## 次の実4B一回の具体案

GPU準備前の計画で、実行0。`probe_requests.json`の架空AF01/AF02を使い、固定baseと保存fit38を各一回、**2入力×2条件=最大4生成・追加学習0・再試行0**で比較する。これはschemaと原文保持の機構probeで、盲検品質評価や新教師ではない。入力はCPU確認で既見、モデルの新出力はまだない。

- model：`Qwen/Qwen3.5-4B`、固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`。base条件はadapterなし。保存fit38条件はweights SHA256 `ad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a`、config SHA256 `ef4b1aef621fb4e234ce6a05601efb62a987c3cf5d40f3995ca1b72200bab145`。旧不採用candidateの再開/学習/製品採用はしない。
- 既存API `ai/tools/serve_emlis_natural_reply.py`の検証済みload_generatorを使う。BF16/SDPA、non-thinking、greedy、context8192/max2048、要求各23秒。実tokenizerで全入力を確認し、超過時は切捨てず停止。既存pinsを保持し、学習を有効化しない。
- 推奨環境：Runpod RTX A5000等24GB×1枚、Jupyter接続可能。現存停止Podの再利用が可能ならそれを使う。新たなGPU作成/再起動/チャージを華恋が先行しない。
- 上限：モデル読込/推論process合計最大1800秒。各条件でAF01→AF02を一回ずつ、両条件のraw/finish/時間を回収して終了。形式不正は補修/再生成しない。実4Bが全てUNRESOLVEDならそれも原結果として読む。
- 単価はレンタル画面で確定。GPU単価$0.60/h以下の場合、1800秒のprocess按分は最大$0.30。準備/取得/待機/回収/継続保持/保存/通信/税等を含む請求総額ではない。公式A5000紹介ページは24GB/$0.27/hからを表示するが、空き/現Pod単価/総額を保証しない（2026-11-01確認： https://www.runpod.io/gpu-models/rtx-a5000 ）。
- 接続：probeのmessagesをそのままモデルへ渡し、実rawとfinish_reasonをAnalysisModelFieldsInputへ渡す。固定snapshotからprepare_cumulative_model_fieldsを再導出し、dataclasses.replace(prepared,raw=actual_raw,finish_reason=actual_finish)→build_cumulative_map(...,model_input=...)。実raw/metadataと同じprojection/private/textを回収し、保存再読と分類の内容を主担当が確認する。モデル生成本文を本人原入力へしない。
- 回収物：4call以下の実raw/finish/時間/モデル・adapter identity、各JSON採否/理由、同じ図/文章/coverage、保存再読結果。資格情報/本人データは使用しない。終了時は所有する推論processを停止してGPU processを確認し、Pod自体のStop/削除/継続保持はMashの指示を優先する。

最小CPU準備は終了し、次はGPUを用意して実出力確認へ進む。大きな意味解析機構を先に作り切る追加段階は置かない。実4Bを呼ぶまでは接続品質/一般理解の成立を報告しない。

API反映commit：`59489814a924eec29f4ee61386e6daa3bec1a49a`（既存PR3、製品5＋test1）。
