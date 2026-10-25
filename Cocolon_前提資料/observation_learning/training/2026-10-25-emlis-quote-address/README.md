# 4Bの引用選択と、CMEEの位置計算を分ける候補

状態：**Mash承認済み・接続実装/CPU確認済み・実tokenizer確認前・GPU学習未開始**。2026-10-25 JST。

[承認対象の全仕様・変更path・CPU条件・18更新/成功時2call](../../../designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md#cmee-quote-address-offline-proposal)を正本とする。

前回focus12は意味7/9・本文6/9。今回は原raw9件の引用78か所を原文欄と照合し、すべて一意であることを確認した。残る位置不良は3整数、受け取り差は3件。元rawの不良は残したまま、4Bが選んだ完全引用の位置を機械で求める新形式の候補へ進める理由を具体化した。受け取り不足は引き続き学習対象で、readerの拒否は妥当。

| file | 内容・現在の意味 |
|---|---|
| train_messages.proposed.jsonl | 原chair6は行bytes不変。日常3だけ新top/schemaとquote表へ可逆投影。本文・意味・根拠順は元教師不変。まだ学習未使用 |
| cpu_feasibility.json | 教師/原rawのhash、9件78引用の一意性、元teacherへの復元9/9、候補3/3可逆性、overlap例。製品テスト・モデル生成・新receipt採用ではない |
| plan.proposed.json | 新形式/旧互換・CPU後の新18更新/FIT9/全件成功時2保存再読の上限。implementation_authorized=false、gpu_run_authorized=false |

旧9行、旧18/12plan、旧重み、原raw、readerは不変。新source/API/runnerは未実装。候補のsource解釈は既存実装の範囲で、引用一致から意味の正しさを推論しない。別ID2件も学習外identity/語彙の有限確認で、独立した一般品質評価へ数えない。

実行環境Codex Work/GPT-6。root華恋がsingle owner、別文脈agent2枠は読み取り意見のみ。今回の現在指示を診断/案/候補保存の根拠とし、新しいモデル出力契約やGPU実行の承認へ広げない。新観測会は今回不要。GPU停止/再起動/削除/新Pod/charge/新model call/追加学習0。今回live GPU状態を再照会しておらず、直前の稼働確認はfocus12の終了記録。

Supabase list_projectsで対象cocolon-projectのACTIVE_HEALTHY表示を確認したが、本人データ/SQL読書き0。Renderはworkspace一覧だけでservice/deploy/healthの今回確認0。これらをモデル接続成功や本番品質の根拠にしない。保存先は引き続き隔離SQLの限定試験であり、本番DB変更案ではない。

今回primary=BLOCKER_NARROWED。78引用の一意性と、位置計算を既存ownerへ移す具体的な責務/互換条件が増えた。新しい品質合格・TECHNICAL_CREDITは0、商品0/正式0/3/54.50％は維持。STRUCTURE_MAP_DELTA_NONE（未承認案だけ）。

## 承認後の接続実装・CPU checkpoint

Mashは「接続実装・18更新・全9件成功時の2件保存再読」へ「進めていいよ」と明示承認。[API4002b457](https://github.com/MassyuRed/mashos-api/commit/4002b4577838d1ed6671278a19585b61e7ccd10e)の既存2source＋新test1へ実装し、3blob全文を読み戻し照合した。旧形式を既定に保ち、新形式だけ完全引用をnative座標へcompile、原raw保存/receipt再導出/曖昧拒否/形式fallback禁止を確認。独立本文reader/意味採用/公開API/DB/RN不変。

限定CPUは重複除外197ケースの成功を確認（既存4file＋新quote1file）。初回195成功、SQL中断2variant追加後は32成功/2失敗。失敗は初回meaning保存と回答更新DTOのmeaning_updatedを混同したtest期待であり、保存意味IDの存在/不変を直接確認する期待へ直した。該当3SQL再検査は成功。反復を件数へ加算せず、実検査の履歴はcpu_validation.jsonに保持。合成9教師も無補修raw→native→意味→実本文9/9、旧chair6行bytes不変。これは実モデルFIT成功ではない。

実行用sft_examples.jsonl/train_messages.jsonl/dataset_manifest.json、許可済みplan.json、run_quote_address_fit.py/consume_quote_fit_raw.pyを固定した。新daily promptの旧relations文言『with exact full-field coordinates』だけは新形式と矛盾するため数値不要へ明確化し、実build_model_messagesのcanonical JSONと一致させた。本文/意味/原source/根拠順/旧chairは不変。proposed3fileは当時の案として残し、実行には新plan.jsonだけを使う。

既存GPUのJupyterへ接続でき、A4500/20470MiB/使用1MiBを実確認。管理consoleはrate limit表示だが、既存workloadのJupyterは使用可能。STOP/再起動/削除/新Pod/charge/install0。次は同じ承認範囲の実tokenizer確認後に一回だけ18更新/FIT9。全9成功時だけ別ID2保存再読へ進み、失敗時は回収して終了する。今回STRUCTURE_MAP_DELTA_PRESENT（privateモデルwireと位置compile責務）、限定TECHNICAL_CREDITはCPU接続/再導出の範囲だけ。商品0/正式0/3/54.50％を維持。
