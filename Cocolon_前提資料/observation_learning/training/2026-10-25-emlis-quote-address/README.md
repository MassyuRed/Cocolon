# 4Bの引用選択と、CMEEの位置計算を分ける候補

状態：**未承認・製品未実装・新GPU試行0**。2026-10-25 JST。

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
