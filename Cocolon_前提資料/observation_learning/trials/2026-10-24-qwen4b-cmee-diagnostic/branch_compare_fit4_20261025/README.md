# 保存済み不採用4更新candidateの局所分岐比較

完了。source c5eee230693229f2b438b1f40a3ab8394a090616、実sourceはpack/branch_check/compare_fit4.py（SHA256 50758bfe2db8e2a1e29a8ca9a57274bde1779cf632c2307ba512cd3d40adbc30）。保存e3743dの固定訂正input5018token＋実生成prefix1116tokenを1forwardだけ評価。生成0/学習0/optimizerなし、10.957347936555743秒。

actual「ようになった」はlogit16.875/p0.4538724720478058/rank1、teacher「ようになって」は16.5/p0.3119416832923889/rank2。gap0.375、元a8のgap0.75に対し-0.375。argmaxは元実生成と一致し、重み全3file不変/32tensor有限。出力と全identityはresult.json、SHA256 cf0e5b537db5b798e67153565c668a144de4a0ac41f272fe65e206d8c88a1a6e。

方向は教師へ近づいたが順位は不変。局所測定を生成成功や一般能力へ換算しない。e3743dの不採用は維持。元a8からLRだけを変えた別scopeの4更新結果は[reception_fit4_lr5_20261025](../reception_fit4_lr5_20261025/README.md)。この閉じた診断を再実行しない。

公開済み架空chairだけ、本人DB/Diary/credential送信0。GPU停止/再起動/削除/新Pod/charge/新依存/通常有効化/merge/deploy0。STRUCTURE_MAP_DELTA_NONE、商品credit0/正式0/3/54.50％据置。
