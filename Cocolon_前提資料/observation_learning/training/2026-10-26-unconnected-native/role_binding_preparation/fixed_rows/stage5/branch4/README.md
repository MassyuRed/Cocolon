# branch4一回完了 — 両経路で初分岐の誤tokenが優勢

2026-10-30 JST。Mash承認の保存ad8b・非学習1load/計4forwardをJupyterで一回完了。BOOK S3とSHOP S2は教師全文/prefixの両方で過去の誤tokenが単独1位・正token2位、margin0.75/2.875。全文NLLは前回fit38保存値と完全一致し、低い平均に隠れた局所教師不適合を確認した。今回比較した数値条件差による選択逆転はない。cache付き生成の再現やS5解消・商品合格ではない。

runner14.9035秒/前回単価按分約$0.0012（準備/回収/保持等別）、親16.0258秒/exit0。更新/生成/新CMEE0、275原本/保存重み不変。全14原本の元bytes/SHAを回収照合し、GPUは稼働保持。承認は消費済み、再試行/次runへの自動進行0。[全実結果・全20file地図](execution_20261030/README.md)。以下のCPU準備・具体案は承認時の履歴で、再起動の指示ではない。

## CPUで確定したこと

| 対象 | 初めて異なる出力token（0始まり） | 教師／実出力ID | 入力の一致 | 意味 |
| --- | ---: | --- | --- | --- |
| BOOK S3 | 264 | 1293 / 7664 | messages完全一致・5686token | 7関係で閉じる代わりに8関係目を追加 |
| SHOP S2 | 555 | 30812 / 6333 | messages完全一致・5027token | 否定scopeの根拠q_extra_8を別の引用へ置換 |

予測logit位置はBOOK5949／SHOP5581、分岐直前prefix長5950／5582、教師全文長5969／6121。CPU原本は58434bytes/SHA3bee403589c03ae3591aab26bb08fe27879c6cb8c62f7bd55c4bfd4d4fbcdcda。Jupyter原本とPod外回収bytes/hashを一致確認。既存266＋今回9＝275fileを固定し、新重みad8b89e8は参照のみです。

新10行4598label tokenの合計CE257.5617609のうちS5二行は215.7151910、83.7528％。BOOK S3の平均0.01182166でも合計CEは約3.3455であり、少数の重要tokenを間違えることと矛盾しません。平均NLLの低さを完全な自由生成の証明にしません。各学習行は平均CEで別々に更新しており、上記の集計だけから学習重み付けの不具合を断定しません。

SHOP S5は実前段が教師と異なり、出力の最初の分岐もtoken6です。今回その原因を一つに決めません。全8rawは前回原本と対応させて確認しました。教師/実入力の一致、label連続窓と実installed helperを静的照合し、label shiftの明白な不具合は特定していません。

## 次の一回の具体案と実装順

1. 新しい明示承認をproposal/runnerのSHAへ結び、保存ad8bを診断専用・非学習で1loadします。学習初期値や製品への採用ではありません。
2. BOOK S3、SHOP S2の順に、それぞれ実helperと同じ教師全文/loss窓と、同じ分岐直前prefixを計算します。計4forward、eval/inference、use_cache=false。全文は元のlabels slice/logits_to_keep=countを保ち、対象位置のlogitだけを取り出します。
3. 教師tokenと過去の誤tokenの順位・logprob・logit、top10、明示argmaxと同率数、1/2位差、全文NLL、二経路のlogit差を保存します。全固定原本/重み不変を確認し閉じます。

最大10分、前回単価$0.28/hによる処理按分$0.0466667（約$0.047）、準備/回収/保持/保存/通信/税等は別、現在単価は未照会。親timeout590秒＋kill10秒、再試行なし。失敗・不一致・非有限・timeoutは部分結果を保持して停止します。実学習、生成、CMEE、旧9評価、受信/教師/prompt/合否/依存変更、Runpod管理画面/API・Stop/restart/delete、Render/Supabase変更、merge/deployは0です。

両経路とも誤token優勢なら局所fit不足と整合します。全文だけ正解なら計算条件による数値差を観測したことになります。両経路とも正解なら前回cache付き生成の差が未説明で残ります。どの場合もcache付き生成の再現試験ではなく、原因や次の修正を自動確定しません。新しい品質threshold・受入れ条件は作りません。

## 全8fileと実原本束の地図

| file | 責務 |
| --- | --- |
| README.md | 実CPU結果、非学習一回案、順序、費用、停止、全地図 |
| prepare_branch4.py | stdlibだけで既存原本/encoded token/実raw/前段を照合した一回CPU source |
| cpu_report.json | 実CPU原本、全8stageの分岐、一致条件、275hash、installed helper source |
| loss_window.json | 実helperのlabel/logit窓、回収原本のPod側hash/size |
| proposal.json | 未承認の1load/4forward/学習0/生成0/10分のexact案 |
| run_branch4_once.py | 新承認が必要な診断実装。実model/GPUは未実行 |
| launch_branch4_once.py | 新承認と一回lock、親timeout、部分log/exitの保持 |

作業開始範囲：current gate=新2件の初破綻、exact work=CPUで最初の分岐を特定し最小非学習比較を準備、scope=effect0読取/可逆準備、basis=Mashの継続指示・必要なら前提差分更新指示、owner=root華恋単一writer/executor/judge（補助はread-only）、success=初分岐と比較条件確定、completion=CPU照合/原本回収/未実行コード構文確認/同単位記録、stop=不一致または新有料処理前、prohibited=上記、next Mash decision=新GPU一回、sources=fit38@81284665/同実原本、maps=01A/current Emlis/CMEE、STRUCTURE_MAP_DELTA_NONE。新paid envelopeはRule18§11.3の個別判断対象。実環境はCodex Workで正式Pro/Ultra/human authorityを申告しません。root本文確認と補助静的照合は商品受入れではありません。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。今回の基本不成立に追加観測会は不要です。

| approved_plan.json | 明示承認の消費済み閉鎖版。実行時原本はexecution_20261030/runtime/approved_plan.jsonへ不変保存 |
| execution_20261030/ | 実原本14と照合・所見等の全20file束。現状態は同READMEを優先 |
