# 回答後の更新義務の具体化 — Jupyter CPU準備完了・GPU一回の確認待ち

2026-10-28 JST。状態：**CPU_READY_GPU_AWAITING_MASH_APPROVAL**。

Mashの「4B学習＋CMEE接続」「Jupyterへ直接接続」を継続し、実Jupyterで入力・tokenizer・保存重み・CMEE再生を確認した。新しいpretrained model読込・forward・学習・生成は0。候補入力によるモデル改善は未測定。[前回2件原本](../prior_quote_probe2_result/README.md)は意味採用0/2・本人向け本文0/2のまま。商品0、正式0/3、管理54.50％、candidate_ready=false、automatic_progression=false。

## 不足と最小候補

教師はBOOK回答後の6 ADD＋gap解消1、SHOP回答後の7 ADD＋gap解消1と本人へ向けた本文を既に持つ。実rawは両方ADD1だけでgap解消を欠く。BOOKの末尾3引用には自分の生成したsurfaceが入り、SHOPでは引用配列と意味参照がずれる。単純な番号補正では解消しない。現段階で新観測会を求める根拠はない。

[候補source](model_candidate_source.py)は、既存contractの追加roleと各roleへ入る新relationを実順に列挙し、BOOKの7更新・SHOPの8更新と末尾INVALIDATE_GAPを明示する。[前後指示文](input_preview.json)で差分を確認できる。更新不足への因果仮説であり、引用混入・意味のずれ・本文反復まで解消したとは判断しない。

情報はAPI `64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4` の既存 `_model_v3_source_contract` / `_model_v3_packet` から取る。正解引用、quote index、claim/relation ID、自然本文を注入しない。private quote形式のV3回答後だけが対象で、`explicit_update_roles=False` が既定。旧numeric・初回・chair/dailyは不変。API製品sourceへ未適用の別copyであり、意味採否・引用compiler・独立本文reader・教師・重み・raw後処理は変更しない。

localized30とadaptive30はともに保存109cから各15教材2回を学習した別runであり、全試行の更新が順に累積しているとは説明しない。同じ30更新の再試行案ではない。

## 実Jupyterで完了したこと

指定Pod `94a06hhxu51uy4`（daily_blue_dragonfly）のRunpod認証は、指示どおりGitHubを試みた後Googleで回復し、JupyterLab terminalへ到達した。認証値・token・OAuth URLは保全しない。前回の別Podからの引継ぎを仮定せず、空だった `/workspace` へ固定原本を復元した。管理consoleは認証と当該PodのJupyter接続に必要な範囲で使用し、その後の作業はJupyter内。Stop/restart/delete/新Pod/charge操作0。

実機はNVIDIA RTX A5000 1基、24564 MiB、確認時使用1 MiB。表示料金$0.28/時。Python3.12.3、既設torch2.8.0+cu128を維持し、専用venvへtransformers5.19.0 / peft0.21.2 / accelerate1.15.0 / safetensors0.8.0を導入した。Qwen/Qwen3.5-4B固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` のtokenizer・config・index・model filesを取得しただけで、pretrained modelは読込んでいない。[base files取得log](logs/cocolon_restore_base.log)とexit0を保全した。

- [実入力CPU結果](actual_cpu_check.json)：実build_model_messagesの15件比較。変更2件は回答後updates指示のみ、13件不変。全15教師target token ID・EOS・旧messages・native prior不変、切捨て0。所要6.450秒、CUDA未初期化。
- BOOKはprompt4201→4235（＋34 tokens）、target3178、cap3712、prompt＋cap7947。SHOPは4365→4401（＋36）、target3561、cap3712、合計8113。最大8113/8192。前回値の流用ではない。
- [保存重みCPU結果](adapter_cpu_check.json)：d431の112 F32 tensors・全有限値・全key/shape・3,833,856 parameters・56 modulesを照合。meta上の構造生成1、pretrained model読込0、所要5.673秒。重み不変。
- [保留実行の拒否](pending_execution_check.json)：plan検査return0後、未承認planの--executeは `new_update_probe2_mash_approval_required_before_output_or_model` によりreturn1。出力directory作成前・model読込前に停止し、出力directoryは存在しない。
- [旧rawのCMEE CPU再生](consumer_cpu_smoke/diagnosis.json)：bytes/hashを固定した前回2件を未変更API64 readerへ渡し、BOOKはREJECT/semantic_receipt_not_validated、SHOPはUNSUPPORTED/model_evidence_out_of_scope、意味0/2・本文0/2を再現。採用snapshotがないためcold確認0。新モデル呼出0、所要1.711秒。

CPU準備と旧rawの再生は、新候補rawの成功、新規initial/旧9を含むGPU15件の回帰成功、人手の商品受入れではない。pytest0、SQL0、Render/Supabase/本人DB/通常API/DTO/RN/merge/deploy変更0。Codex Work/GPT-6でrootが統合し、分担した文書以外の補助監査はread-only。正式な別Pro/Ultraモデルまたは人手受入れとは報告しない。

## 次に確認を求める新しい一回

[固定plan](probe2.plan.json)は **PREPARED_AWAITING_MASH_APPROVAL / gpu_run_authorized=false / approval_basis=null**。前回の一回は終了済みであり、その許可を新入力へ再利用しない。Mashの新しい確認後にだけ実行する。

1. 同Podで保存d431を学習なしで一度読込む。追加学習0、固定base、requires_grad=false、112 tensor照合を維持する。
2. BOOK/SHOP回答後を各1生成、最大2呼出。cap3712、context8192、各生成最大180秒、全体最大600秒。外側実行上限590秒＋TERM後kill10秒、内部上限600秒。自動再試行なし。
3. 原rawを補修せず、未変更CMEEで意味・本文・全更新を確認する。採用snapshotがある場合だけ、独立processの既存cold-file確認（最大60秒）へ渡す。通常有効化や別Gateへ自動進行しない。

処理時間の料金按分上限は$0.047（$0.28/時×最大10分。準備・回収・保持・他のRunpod課金は別）。GPUライフサイクル操作0、production SQL0。GPUはMashの保持指示を継続する。

[runner](run_update_probe2.py)はplan・source・実CPU結果・eval入力・adapter CPU結果・固定114復元filesのhashとsource commitを束縛する。[consumer](consume_update_probe2.py)はraw来歴とhashを確認して既存readerへ渡す。planのapi_candidate_commitは元API64c6cb1aを指す欄で、別候補はcandidate_source_sha256と復元manifestで識別する。Cocolon実行source commitは確認後に固定し、消費済みの旧prepare/executeは呼ばない。

## 原本と来歴

- [静的確認](static_check.json)、[実CPU checker](check_cpu.py)、[eval入力](eval_inputs.json)、[復元114file manifest](restore_payload.json)。静的previewの最初の辞書sort順は保存前に明示role_order/written_link_orderへ修正済み。候補実処理は一貫してcontract順。
- [入力CPU原本ZIP](cpu_runtime_originals.zip)：41,272 bytes、SHA256 `837afb746382c21ff6d64a95d25d065cbf4dcbdf65fd3b7a4fbc72bdbb966816`、11members/10payload、CRC・全payload hash確認済み。
- [adapter復元来歴](adapter_recovery.json)、[CPU checker](check_adapter_cpu.py)、[adapter CPU原本ZIP](adapter_cpu_runtime_originals.zip)：4,031 bytes、SHA256 `d5f92e20a09b7bf0d7c017d24bde6576e6e83d1f61b3052ae2a9a7564392bfab`、7members/6payload、全hash確認済み。元保存archiveは14,841,180 bytes、SHA256 `39ac2ff058fe65a961b70f8477c2561306ca2daa1029a1bf3bb33f620c0df342`。正規保全fileから同一bytesを回復し全76payload照合後に使用。weightをGitHubへ複製していない。
- [最終CPU原本ZIP](final_cpu_runtime_originals.zip)：14,287 bytes、SHA256 `84d522047bbe22f491de8dfda4a02a5e7ece3261e50d8ff77652ddb6df4b3114`、10members/9payload。CRC・[manifest](final_cpu_archive_manifest.json)の全bytes/hashとrunner/consumer/planの同一性確認済み。拒否時tracebackも原本のまま保全した。

STRUCTURE_MAP_DELTA_NONE：未適用入力候補と検証原本の追加。商品責務/型/wire/reader/通常経路不変。認証復旧・CPU準備を学習効果・商品完成へ換算しない。
