# 10/28 — Mash承認後named形式接続・CPU確認と、一回の13更新試験

状態：**CPU_COMPLETE_GPU_PENDING_AUTHORIZED_ONCE**。本checkpointは一回GPUを開始する直前の固定点。後続の実結果は同作業の `../../named_reference_result/README.md` へ戻る。閉鎖後にこの実行前状態・planを再利用しない。

Mashは起案67910d91の「接続実装・CPU検証と、成功時13更新→保存再読込→BOOK／SHOP各1生成」の一回を2026-10-28 JSTに「進めていいよ」と明示承認した。600秒/$0.047のGPU処理按分上限（準備/CPU/回収/保持/保存/通信/税等別）を維持する。元の未承認案/planは親dirへ凍結保持、新しい実行planは本dirの `named13.plan.json` だけ。

## 実装・CPU結果

API `a8be7a9bceed35a9f3cb843f22de05bbd5bc6e18`、基点API64、private4source＋新test1。全5fileのGitHub全文/blob/変更集合、Pod/hostの同一bytesを確認。preparationの明示named受領と実raw保持、model sourceの新教示、semantic ownerのsource由来BOOK/SHOP説明回答guard、新strict codecだけを変更した。型追加0、旧default/receipt bytes・一意quote位置・native意味/本人本文/問い/全更新readerは維持。通常application/API/DTO/DB/RN/Render/Supabase/公開/merge/deploy変更0。

最終pytest **347成功、FAIL0/SKIP0、20.122433秒**。SQL専用12件は選択外。初回346成功後にempty quoteの構文拒否を明確化し新検査1を加え、最終集合を再確認した。旧test/fixtureの期待は変更していない。CPU保存検証はfileのみ、SQL0。test依存のpytest8.4.1等は別フォルダへ隔離し、GPU用既存環境の固定ML packageは変更しない。

準備CPU **43.875633秒**。旧API64の別processから15baselineを取得し、新APIの旧default receipt/意味snapshot/full outcomeが全15完全一致。新2だけ形式投影し、実named rawを直接新receiverへ渡し、同candidate_json/native意味・binding・本文・問い・全7/8更新を確認。新保存snapshotは別process cold2/2完全一致。新旧wireのraw/receipt-linked ID差は保持し、見かけのsnapshot bytes一致を装わない。残13prompt/target IDs不変、canonical15と元d431不変、model load/forward/追加学習/生成/SQL0、CUDA未初期化。

| 回答後教材 | 実prompt | 正解target | 全系列 | 明示cap | prompt+cap/8192 |
|---|---:|---:|---:|---:|---:|
| BOOK | 4422 | 2913 | 7335 | 3712 | 8134 |
| SHOP | 4586 | 3238 | 7824 | 3584 | 8170 |

起案CPUよりprompt各+1。最終実API messages/固定tokenizerで切捨て0/EOS/prompt maskと上限適合を確認した。速度・600秒内完走・実4B改善はまだ未実証。CPUでteacherが通ることを実モデルの品質へ換算しない。

## 一回の実行条件

原d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684/112F32から新AdamW。失敗候補c7baから継続しない。旧9各1＋named BOOK/SHOP回答後各2＝13更新、既存順序/LR1e-5/decay0/clip1/seed20261024、旧9CE/新2adaptive extra15/gamma2、全assistant＋EOS/prompt除外。別保存後、112tensor完全一致・全parameter no-gradで再読込して同2各1生成だけ。before0/最大2call、各180秒、全体600秒（外側590＋kill10）、温度0、BOOK3712/SHOP3584。

actualrawはそのまま明示named receiverへ渡し、意味/本人向け本文/全ADD-GAPと関係・留保・主客・時点を全文読む。採用snapshotだけ別process cold再読する。採用0なら対象なし。CPU/source/hash/context失敗、OOM/非有限、期限/長さ/意味/本文不採用で終了。retry、reader緩和、意味補完、LR/回数探索、上限延長、次run自動開始なし。原d431・新/失敗重み・原raw/logを保全してPod外回収する。GPUはStop/restart/deleteせず保持。

既知2だけの有限適合試験。旧9学習は旧9回帰の成功ではない。新初回4/全15の新GPU評価、実初回からの動的thread、未知一般化、実service/SQL/本人端末/他core/商品受入れは含めない。新観測会は今回の基本欠陥には不要。

## 原本と再構成

`cpu_originals.zip` は459,970bytes、SHA256 `616ae24c961742b09219642fcf80977852867730dc98b98e44fd8a76e65406c2`、32payload＋manifest/33member。全CRC/hash/sizeを照合。`pack/` に実train_messages/eval_inputs・CPU結果・旧15baseline・新教師cold結果・3runner/既存loss/教師投影・最終と旧CPUcode/logを含み、API実装4source＋新test1とruntime source manifestも同梱。本dirの `named13.plan.json` と `api_source_manifest.json` を展開packへ加えると、Jupyter実行時の固定packとなる。旧GPU runを起動し直さない。

実装/CPUのread-onlyレビューで重大な不整合なし。root華恋が単独write/実行owner、別文脈agentはread-only照合で、独立Pro/Ultra/human受入れとは呼ばない。STRUCTURE_MAP_DELTA_PRESENT、型追加0、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。前回aligned13の意味/本文0/2/c7ba不採用と重み保全は不変。
