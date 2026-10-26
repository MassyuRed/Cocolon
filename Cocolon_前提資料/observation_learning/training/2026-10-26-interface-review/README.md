# 10/26 — 既存教材のinterface再検討（CPUのみ）

準備source：Cocolon `0c821cebcfd35c1aa8a8e405cd696bbcb5c6b7a6`／API `4002b4577838d1ed6671278a19585b61e7ccd10e`。bridge13は不採用・閉鎖のまま。

Mashの「4B学習＋CMEE接続を続けて」に基づき、既存generic/native教材の対応と根拠形式をCPUで確認する。root華恋／Codex Work／GPT-6が単一実行・writer。read-only二agentは原本照合の補助で、正式Pro／Ultra／human Product Readではない。Rule18 standing delegation内の可逆的な教材候補・結果記録。新GPU一回の承認ではない。

対象pathは当directory、全体現在地00、観測入口README、全file地図01A、最新weekly20261024の関連差分のみ。旧教師・runner・consumer・admission・reader・製品契約・保存・公開API／DB／RNを変更しない。STRUCTURE_MAP_DELTA_NONE。

`audit_interfaces.py`は凍結native9からcandidate全体と根拠行順序を保ち、既存quote schemaへ投影する一回CPU probe。既存build_model_messages→receive_candidate→意味採用→Engine本文再開を旧教師と比較する。根拠欠落・配列外参照・存在しない引用は従来どおり拒否されることを確認する。失敗モデルrawの変換・救済に使わない。固定tokenizerのみで8192context／2560生成枠を確認し、4B重み読込／forward／更新／生成／SQL0。追加依存0。source不一致／意味本文差／不正候補採用で停止する。

これは教材形式の実行可能性確認であり、4Bの品質改善・通常CMEE有効化・未知一般化・商品受入れを示さない。新有料学習のplanや自動進行は作らない。結果と次の一手はCPU確認後に更新する。
