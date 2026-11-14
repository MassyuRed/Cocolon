# ID出力条件の明示＋固定198token重点化 — 同15教材30更新の一回案

状態：**EXECUTED_ONCE / CLOSED / DO_NOT_RELAUNCH**。Mashがproposal1cfc0f83の同15/30更新→保存・非学習再読込→15件確認、最大45分/$0.21処理按分の一回を明示承認。[実結果と原本](../localized30_result/README.md)に採否・本文読解・保存先を記録。以下は承認時の具体案とCPU準備の履歴で、追加実行を指示しません。

## 今回変えたことと理由

[診断結果](../token_diagnostic_result/README.md)では、新6件の本文3欄が115/380token不一致、主客・根拠参照・本文binding・全更新にも局所不足が残りました。一方、BOOK初回の意味拒否は、不明内容と根拠の誤読ではなく、日本語unknown_idが既存ASCII64制約に反したことが原因でした。SHOP初回のmissing_reasonは合法な別名で、意味誤りへ数えません。

API `a4b91b4788b2fb29483a4c77869c91b36402ae9f` は `model_candidate_source.py::build_model_messages()` のquote分岐へ、既存unknown_id制約を伝える出力仕様1項目だけ追加しました。ASCII `[A-Za-z0-9_.-]{1,64}`、claim/relation IDとの非衝突、current/priorの正確な参照、descriptionとの区別です。特定の正解IDを指示しません。共通OUTPUT_SPEC/system、legacy_numeric、reader、教師、wire・意味型は不変。残2fileは既存quote/sixrowの回帰テスト追補です。通常app・本番は変更していません。

学習案は、保存109cから同15教師を各2回・計30更新し、診断で既にtop1不一致だった198tokenだけを相対16倍へ重点化します。ID別名のquestion4/unknown1の5tokenは重点対象から外し、全文CEには残します。旧9は重点mask空で、既存helperの全文CE関数をそのまま呼びます。新6の重点数はBOOK初13/後62、SHOP初13/後87、REPOT2、KNIT21です。

各行のtarget総数をN、重点位置集合をEとすると、損失は `Σ[(1+15×1[j∈E])×CE_j] / (N+15|E|)`。全文・EOSの重みは常に正で、全文一様CEの成分は新6で73.18〜96.97％を保持します。これは先のS/F/U群を一律に平均したbalanced30とは違い、既に正しい大半のtokenへ余分な係数を足さない案です。16倍・30更新の最適性や改善は未測定です。

重点位置は旧prompt/保存109cの診断由来です。新指示での誤位置を再測定したものではありません。新promptでもassistant全文/target token列不変を確認し、絶対位置を流用せずnew prefix＋target indexで扱います。指示追補と損失変更の2差分を併用するため、実行後に改善・悪化をどちらか単独の効果と断定しません。

## Jupyterで完了したCPU確認

- [実CPU原本](actual_cpu_check.json)：14.888497235951945秒、全15の旧新messages差は出力仕様の1項目だけ、legacy prompt bytes不変。原source/control/prior/shape、教師本文・全target ID/EOS・prompt mask・学習評価prefixを保持しました。
- 新指示は全15で45token増、全長最大7980/8192、prompt＋従来capは最大8131/8192（余裕61）。切捨て・出力cap変更0。旧9は2560、新6は3712を保持します。
- 全15の同じ教師を既存readerへ通し、意味・本文利用可能、旧CPU記録のobservation/reception/update_note・問い・dispositionと一致しました。全更新は凍結教師bytes不変と既存readerの採用で確認し、別に未測定のstate同一を主張しません。
- 合法別名/64文字を受理、日本語/空/65文字/空白/claim衝突を拒否する21条件を直接確認しました。PytestのないPodのため、pytest実行済みとは報告しません。新APIテストはsource追補・構文確認済みです。
- 診断原本15のhash・target IDs・重点位置を再導出し198一致。空mask CE/勾配一致、重み16の正規化と有限勾配、tiny模擬1forward/causal shiftと勾配、改変4例拒否を確認しました。実4Bではありません。
- [consumer CPU原本](consumer_cpu_check.json)：34.190337334992364秒。全15入力再構成、BOOK回答/SHOP回答/REPOTの**合成教師**3snapshotを別processで完全再読一致。モデル出力・実service・SQL成功ではありません。
- [未承認拒否](pending_execution_check.json)：pending executeを新output作成・実4B処理前に拒否。新GPU outputは不存在です。

最初のCPU確認は、空maskの`sum/N`とnative meanのfloat32丸め差を厳密一致検査で検出して停止しました。検証用の空maskも同じnative meanへ合わせ、上記の再確認を完了しました。旧9の実学習は当初から既存helper直呼びです。初回source477224bdと失敗log、修正版source0b0f99d9とCPU原本を保持し、GPUの再試行とは数えません。

## 一回の具体案

| 項目 | 固定範囲 |
|---|---|
| 実行 | 同Pod bkj4qvnhwtdqc2/RTX A5000、Jupyterへ直接接続、root華恋が一回だけ起動 |
| 元4B/初期重み | Qwen3.5-4B/revision851bf6e、保存109c3dda…・112F32/3,833,856parameter。既存56module範囲、全値照合load |
| 教材/入力 | 同15のassistant全文不変、新promptは既存ID条件1項目だけ。新教師・新題材・正解prefixを付けた評価0 |
| 学習 | 固定198tokenの上式、同15各2回/30更新、既存order/LR1e-5/seed20261024/clip1/AdamW weight_decay0。fresh optimizerで厳密途中再開ではない |
| 保存・再読込 | 別directoryへ保存し、同OS process内の新model objectで非学習reload。全112tensor key/shape/値・no-gradを照合 |
| 生成 | before0、空assistantから各1回・最大15生成、従来cap2560/3712・温度0・1生成最大180秒。重みを変える追試・追加診断forward0 |
| 採否・読解 | 無補修rawを同じCMEE readerへ通す。全15の意味・全本文/問い/全更新と旧9退行を読む。採用snapshotだけ別process cold-file再読。新モデルcall/SQL0 |
| 時間・費用 | 読込/30更新/保存/非学習reload/最大15生成/最終照合を含め最大2700秒。$0.28/h按分上限$0.21。準備・CPU・回収・保持・保存・通信・税等は別 |
| 停止 | 外側timeout2690秒＋kill10秒と内部2700秒。hash/入力/112tensor/no-grad不整合、非有限、OOM、時間超過で停止・retry0。全15完了保証はしない |
| 保全 | 中途停止なら追加forwardなしにpartial adapterを別保存し、不成立/保全失敗を明記。GPU参照解放後に原source/初期109c/新保存重みを照合。元109c・旧runは不変 |

推奨はこの一回で、回数・LRだけの反復や層追加、cap延長、reader緩和へ戻しません。全15の意味/本文成立と、BOOK7/SHOP8の必要更新・主客/根拠保持、旧9維持を確認できなければ通常候補として採用しません。成功しても既知FITだけです。未知一般化、実初回出力からの動的prior、本人端末、Piece/Analysis品質、正式商品受入れの成功へ加算しません。

実行sourceは `d54ea1db19ab8fb3c3a57fc07b5a20566f245591`。承認済みplan/runner/損失/maskと教師は実行identityとして保持し、閉鎖のために書き換えません。次のcommandは当該一回の履歴で、再実行しません。

```bash
timeout --signal=TERM --kill-after=10s 2690s python /workspace/cocolon_localized30_pack_20261027/run_localized30.py --pack /workspace/cocolon_localized30_pack_20261027 --execute --source-commit d54ea1db19ab8fb3c3a57fc07b5a20566f245591
```

## 承認と保護範囲・原本

今回の可逆source/CPU/GitHub反映は、Mashの続行指示と既存Rule18 §11.3の範囲で進めました。実行環境はCodex Work/GPT-6系、root単一writer/実行owner、補助2名はread-onlyレビューです。正式Pro/Ultra/human受入れと偽りません。

この具体案へのMash明示承認後、Jupyterへ直接接続して一回を実行しました。承認記録のJSON再直列化でgradient_clipの1.0を1へ崩した最初のwrapperは、output作成・実4B読込/更新/生成前に型検査で拒否された。原案の形式を保ち承認3項目だけを変更して修正。wrapper起動2・事前拒否1、実モデルrun1・モデル再試行0で、最初の失敗logも保全した。承認範囲と最大45分/$0.21は拡張せず終了。旧承認の流用・失敗要求再call・GPU再起動はありません。

[準備全原本ZIP](preparation_evidence_20261027.zip) は325368bytes、SHA256 `757770c7331e02d2cc6a8c346aac80c8e06b29ed73a1cf97084afd799f64869e`。29payload＋manifest/30memberのCRC・size・hashをPod外照合しました。[manifest](preparation_manifest.json)と[外側照合](recovery_verification.json)にidentityを保存しています。新旧CPU log/launch、固定source/plan/mask、新入力/評価、実CPU、pending拒否、consumer合成cold3の全原本、API変更3sourceを含みます。重みは不変の既保存109cを参照し、今回ZIPには同梱しません。

30更新・新保存・112F32/3,833,856parameterの非学習再読込を完了。自由生成15/15、EOS15・strict JSON14、同CMEEの意味11/15・本文9/15（旧9意味/本文9/9、新6意味/本文2/0）。採用snapshotの別process cold-fileは11/11完全一致、失敗0。処理1524.400948秒・$0.118565按分（準備/CPU/回収/保持/保存/通信/税等別）。新937233a0は通常不採用。意味11/本文9・新6本文0で前回から本文成立は増えていない。 既存教師で長い意味・全更新・根拠・自然本文を同時に保持する学習設計をCPU準備から見直す。新観測会は今は不要。同じ回数/LRだけの有料反復や閉鎖run再起動へ自動進行しない。 同15教師/全文/target IDsと元109c、reader/採用条件/APIa4b91b4は不変。新指示と重点lossの効果は個別帰属しない。既知FITの測定であり、未知一般化・実初回からの動的prior・通常service/SQL・本人端末・Piece/Analysis品質・正式商品受入れは未成立。商品0/正式0/3/54.50％、PRODUCT_NOT_CLEAR、candidate_ready=false、automatic_progression=false。製品責務/型/wire/通常接続は不変でSTRUCTURE_MAP_DELTA_NONE。GPUは稼働保持し、Stop/restart/delete・追加有料run・merge/deploy0。
