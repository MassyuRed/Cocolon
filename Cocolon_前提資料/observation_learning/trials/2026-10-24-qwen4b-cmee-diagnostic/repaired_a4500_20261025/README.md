# 修正版4B診断 — RTX A4500 20GB（2026-10-25）

Mashの「4B採用・リリースまでRunpod学習、今日の最安空きGPU確保と学習」の新指示に基づく一回。旧診断の承認/adapterへ追加epochしたものではありません。

**20GBでのLoRA学習・保存再load・重み回収は成立しました。CMEEの意味/本文採用は前後0/2で、商品品質は未成立です。** GPUは今日の確保指示どおり稼働保持中です。

| 項目 | 実結果 |
|---|---|
| Pod | y0eb0w0qn6nks0、RTX A4500 20GB／Secure On-demand／EU-RO-1、RAM62GB/12vCPU、container50GB、追加volumeなし |
| 料金 | compute $0.25/h＋container表示$0.007/h、合計表示$0.26/h。2h=$0.52、24h保持=$6.24、税/他Pod保存費別 |
| 実環境 | driver595.91.07、Torch2.8.0+cu128/CUDA12.8、CUDA実計算/BF16 true、free19.3574GiB、disk free49.9845GiB。/workspaceはcontainer上で独立persistent mountではない |
| pin | Cocolon e703befa0d8a60777b4b8657bb846bf365db851c、API1dabc4f196ae283264bf5e364e117a5d571af6a7、Qwen/Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a |
| 依存 | Transformers5.19.0／PEFT0.21.2／Accelerate1.15.0／Safetensors0.8.0。追加最適化kernelなし、公式PyTorch fallback |
| 実学習 | run 20261025-011309-9f0c8622、2教師×1epoch/2update、保存adapterの非学習reload。before/after各NLL2・生成8 |
| 時間/容量 | 1223.757秒（20分23.76秒）、peak allocated14.970050/reserved17.587891GiB。16GB成功の証明ではない |
| 変化 | token加重NLL0.2511168473→0.2451889939、raw6/8変化。32F32 tensor有限・保存hash/先行回収版/非学習再load後hash一致 |
| 出力 | before8/8 stop/JSON、after6/8 stop/JSON。EFREE-E02/E05は2048token lengthで不完JSON。FIT2は両stage stop |
| CMEE | fixed clean APIでmessages/model/adapter一致、意味/本文before0/2→after0/2。proxy6を正式意味評価へ数えない |
| 回収 | 先行archive22member→最終24memberを全hash照合、32tensor有限性/不変をPod外で確認し永続保管。元base全重み/optimizer状態は含まない |
| 保持 | 学習後もPod Uptime/Stop/料金を確認し保持。Stop/Terminate/再起動/追加Pod/追加run/追加epoch/追加chargeなし |

## 原本と集計

- [run.json](run.json)：実環境・plan・pin・target module・tensor再load・時間・peak。
- [before.jsonl](before.jsonl)／[after.jsonl](after.jsonl)：回収原raw8件ずつ。token IDsを含め元bytesを変更していません。
- [cmee_verification_summary.json](cmee_verification_summary.json)：固定APIでの実consumer結果。重複rawを省いた派生集計で、元raw/全consumer reportのSHA、全caseの採否/理由を残します。追加model call/DB0。
- [learning_summary.json](learning_summary.json)：2step/loss/NLL、全生成stop/parse状態、回収hash/finite検査と費用概算。商品合格とは区別します。

最終重み入りarchive：`cocolon_4b_checkpoint_20261025-011309-9f0c8622.tar.gz`、3,363,569bytes、SHA256 `db552321a39b28fbd48fce6f1eff24e988c1a78246c85f66fb2eebed79954984`。adapter_model.safetensors SHA256 `0bdac5e90c79f20129de9a765ac7ee7c59714f3102bc68a2f4aff363c7dd3b78`。重みbinaryはGitHubへ公開せず保持しています。archive内のPod外受領falseは作成時点の記録で、受領後照合は本集計に分けます。

## 本文・意味の評価

初回FITの根拠位置は406..460/489..567から正しい欄内0..18/0..26へ改善し、拒否はINVALID_EVIDENCEからsemantic_shape_invalidへ進みました。しかし自然文であるべき本文欄がobject/null、必須shape不足、喜び対象と感情の統合・関係誤読・任意問い欠落が残ります。訂正FITのrawは前後完全一致で、友人の教示/共同修理/再使用への喜びへ更新されません。

proxyには説明文字列から入力に沿う文章への局所変化がありますが、E02/E05は重複構造が膨らみ打切りへ悪化しました。loss低下・raw変更数を観測品質改善と呼ばず、既存教師だけで三中核が完成したとも扱いません。Piece/Analysis完成教師0は不変です。

**次の直接作業は、同じ初回FITで必須shapeと自然文surfaceを実4Bから契約どおり出し、既存consumerを通す最小修復です。** 採用条件緩和・教師の無制限増量・単純な追加epochを自動実行しません。

## 移行と未完了

Runpodは計算環境で、固定base全重み/config/tokenizer/chat templateとLoRAを揃えれば学習結果を別GPU/PCへ持ち出せます。M4候補では統合HF→MLX形式/4bit変換→実品質/速度/同時利用を確認します。学習を最初からやり直すことと形式変換は別です。現archiveは追加重みと設定/原rawを保持し、base全重みは別に揃える必要があります。現runnerはoptimizer等を保存せず、厳密な途中再開にも未対応です。

今回成立したのは20GBの限定学習・保存reload・回収の技術実績です。通常接続、動的一往復、本人端末、三中核商品品質、M4の変換/連続運用は未成立。診断process上限5400秒/計画$1はPod自動Stop/請求上限ではなく、今日のGPU保持は表示$0.26/hで継続します。

[全機能現在地](../../../../00_cocolon_current_product_and_state.md)／[最新weekly §24](../../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-a4500-training-and-portable-weights)。STRUCTURE_MAP_DELTA_NONE（既存trial owner内の証拠、production接続/型/contract変更なし）、限定TECHNICAL_CREDIT、product_credit=0、正式0/3、PRODUCT_NOT_CLEAR、candidate_ready=false、automatic_progression=false、全体54.50％据置。
