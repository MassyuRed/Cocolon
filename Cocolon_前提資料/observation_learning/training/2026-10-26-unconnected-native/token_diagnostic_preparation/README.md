# 保存109c・同15教材の語単位診断 — 追加学習0・新規生成0の一回候補

状態：**CPU_READY / PREPARED_AWAITING_MASH_APPROVAL / GPU_NOT_AUTHORIZED**。既存の30更新と15生成は閉鎖済みです。この候補は別outputで、旧承認・残時間・予算を再利用しません。

## 今回解消する不足

利用者へ、元の経験と本人の説明を保った自然な観測・受け取りを返すための原因診断です。[前回](../expanded15_recovery_result/README.md)は意味11/15・本文9/15、新6本文0/6で、保存109cを通常不採用としました。学習回数・損失配分・出力順・対象層の変更だけでは改善していません。

凍結15件の学習入力と評価入力は一致し、assistantとEOSだけが学習対象です。保存112tensorは全て更新・有限、非学習再読込も全値一致でした。そのため入力取り違え・未学習・重み未適用を今回の原因とはしません。ただし正しいprefixから測る平均誤差は、自由生成の成否を保証しません。

旧出力との照合では、REPOTは本文の「説明してもらい／聞いた」が「説明し／聞かせた」へ反転し、BOOK/SHOPは不明の対象IDや根拠参照から外れます。KNITは短い教師でも3712tokenまで反復します。長さ上限だけを原因とせず、正解語の順位・誤差がどの箇所に残るかを先に調べます。

## 実行案

| 項目 | 固定範囲 |
|---|---|
| 対象 | 同Pod bkj4qvnhwtdqc2、RTX A5000。Jupyterへ直接接続、root華恋だけが起動 |
| 重み | 保存109c3dda…、112F32/3,833,856parameter。非学習load1、全parameter no-grad |
| 元4B | Qwen3.5-4B、revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、既存固定依存・loader |
| 教材 | 前回と同じ凍結15件・同messages・同JSON全文・同tokenizer。新教師0、target変更0 |
| 処理 | 正解prefixから各語を選ぶ確率の診断を各教材1forward、最大15forward。追加学習0、generate0 |
| 出力 | 各tokenの正解順位/誤差/top1一致、field別集計、誤token/EOSのtop5、既存自由生成との最初の分岐 |
| 時間・費用 | 読込・診断・最終照合を含め最大900秒。$0.28/h×900秒=$0.07処理按分上限。準備・CPU確認・回収・保持・保存・通信・税等は別 |
| 終了 | 15件を回収し、不明ID・主客・全更新・本文・EOSのどこへ誤差が集中するかを読む。追加学習へ自動進行しない |
| 停止 | hash/入力/依存/112tensor/no-grad不整合、900秒、OOM/forward例外で終了。retry・同output再利用0 |

これは**学習診断専用**です。正解prefixをモデルへ渡した値を通常推論の成功、意味採用、本文成立、未知一般化、商品品質へ加算しません。通常評価は従来どおり正解なしの空assistantから行い、その条件も変更しません。平均誤差から有効な学習方式を断定せず、観測した局所誤差に対応する最小修正を次に選びます。

## SourceとCPU確認

`run_token_diagnostic.py`と`token_diagnostic.plan.json`が実行範囲を所有し、未承認の`--execute`は新output作成・実4B読込より前に拒否します。`source_bindings.json`は同109c/教材/過去15rawを束縛します。`candidate_focus_loss.py`は既存JSON span parserのbytes不変copyで、損失再配分のためには使用しません。

`verify_token_diagnostic_cpu.py`で実tokenizer15件・切捨て0・入力一致・全fieldのtoken区間・causal shift/正解順位・承認前拒否を確認します。fieldを跨ぐtokenは境界として明示し、単一fieldの誤差へ誤計上しません。実CPU原本は[actual_cpu_check.json](actual_cpu_check.json)。source ae9ac364のJupyter直接実行は**4.935140502988361秒**で成功、15件/max7935、causal shift/CE/正解順位・同点・EOS top5、不正4例（長さ/NaN/教師token/重複JSON key）拒否、pending executeのoutput前拒否、CUDA未初期化を確認。source5fileとPodから回収したreportのhashを外側でも照合しました。4Bの実重み読込/forward/生成/追加更新/採否/SQLは全て0です。

旧9のJSON内容は教師と一致し、厳密token列には終端差があるため、内容分岐として数えません。新6の既存自由生成の分岐位置は次のとおりです。token番号は0始まり、charは一致した先頭文字数で、追加生成の結果ではありません。

| 教材 | 最初の分岐token | 一致先頭文字 | 教師側の項目 |
|---|---:|---:|---|
| BOOK初回 | 577 | 2206 | question_proposal |
| BOOK回答後 | 656 | 2491 | claims |
| SHOP初回 | 596 | 2224 | question_proposal |
| SHOP回答後 | 744 | 2730 | claims |
| REPOT | 761 | 2915 | observation（主客反転） |
| KNIT | 118 | 419 | claims |

このCPU確認は4Bの確率測定ではありません。確率・順位・局所NLLは新一回の承認後だけ実測します。GPU起動には外側の `timeout --signal=TERM --kill-after=10s 890s` を必ず付け、内側900秒と合わせてworker全体を900秒以内に制限します。停止対象は今回のworkerだけで、Podは稼働保持します。完走/停止を問わず原本を回収し、新学習へ自動進行しません。

配置の最初の複数行入力は改行が落ちたためshell構文エラーで未実行となり、正しいpasteで配置しました。新model処理・既存原本変更は0。browser download待機はtimeout表示でしたが、実downloadされたreport57,149bytes/SHA256 `0281ce6b29f0cb7794bd230fdaed1f0fb7d734b825882fac95cd952f3c4c19be` を確認して回収しています。

## 判断・保護範囲

今は新観測会を必要条件にしません。既存教師への適合自体が未成立で、教材不足・モデルの能力上限は確定していないためです。Piece/Analysisの完成教師・独立未知評価・本人端末は別の未完了として保持します。

今回の可逆source/CPU/GitHub反映は、Mashの続行指示とRule18 §11.3の既存範囲です。実行環境は確認できるCodex Work/GPT-6系として記録し、正式Pro/Ultra/human reviewと偽りません。root華恋が最終判断・単一writer/実行owner、補助は調査と候補作成です。新しい実4B load/forwardは費用を伴う別一回の明示承認後だけです。

製品責務・意味型・wire・採用reader・API6b043880・DTO・DB・RN・Render・Supabase・本人DB・通常app・価格・依存・モデル選定・merge/deployは変更0。**STRUCTURE_MAP_DELTA_NONE**。source/CPUの限定TECHNICAL_CREDITだけで、商品0・正式0/3・54.50％・candidate_ready=false・automatic_progression=falseを維持します。
