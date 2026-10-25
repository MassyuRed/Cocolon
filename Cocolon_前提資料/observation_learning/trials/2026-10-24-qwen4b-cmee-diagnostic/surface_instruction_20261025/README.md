# 4B保存adapter：出力指示の最小修復を初回1件で確認（2026-10-25）

**結果：自然文欄の型はobject/nullからstringへ変わったが、CMEE採用/本文は0/1。指示補足だけでは接続不正を解消できなかった。** 追加学習0、保存重み不変。同じ既知chair初回fitの確認であり、未知入力評価・商品品質改善ではない。

## 固定条件と実行

- Cocolon `6dbd250e36c8a43cc455fb6eada5193866bba4d1`、API `7b649a23a6cdbfb5d55576a6ce58446ff24b414a`。
- `Qwen/Qwen3.5-4B@851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`。既存A4500保存adapter `0bdac5e90c79f20129de9a765ac7ee7c59714f3102bc68a2f4aff363c7dd3b78`。
- 新directoryへ既存runpod.sh fetch/validate、cache-only prepare。既存run_pilot.load_saved_adapterでis_trainable=False、32tensor有限/学習parameter0、同evaluate関数へFIT-FT-CHAIR-INITIALだけを渡した。
- seed20261024、非thinking、greedy、BF16/SDPA、context8192/max_new2048。process上限900秒。optimizer/gradient updateなし。旧run/adapter/resultへ上書きなし。
- 実993token、正常stop/JSON。生成50.873663秒、prepare/reloadを含む58.846217秒。peak allocated9.328224/reserved9.652344GiB。実入力3110token、保存3filehashは前後不変。
- 表示$0.26/hのprocess時間按分は約$0.00425。Pod保持課金・準備/回収/待機・税・他Pod保存費を含む実請求ではない。GPUは停止/削除/再起動せず稼働保持。

## 回収と採用結果

[raw.jsonl](raw.jsonl)は生成token IDs/原raw/metadataを含む回収原本。Pod側のraw file SHA256とPod外の全bytes SHA256を照合した。[inference_report.json](inference_report.json)も回収し、source/adapter/input messages/dataset hash/32tensor/非学習を確認。[cmee_result.json](cmee_result.json)は固定APIの既存consume_rawで未修正rawを消費した実結果。[comparison.json](comparison.json)は前回同adapterの初回rawとの派生比較。

messages/model/adapterは一致した。根拠は入力material.sources[0].evidenceのSOURCE_ENVELOPE座標utf8_start/endを、要求する欄内scalar_start/endの代わりに使っている。実欄内座標はmemo 0..18 / memo_action 0..26で、sourceの同evidenceにも明示されている。field_path=text_fields.memo / text_fields.memo_action、source envelopeのUTF-8位置406..460 / 489..567を指してINVALID_EVIDENCEとなる。欄内memo / memo_actionとUnicode位置を要求する既存条件は変更していない。

型だけ見るとobservation/receptionがstringになったが、両方に同じ原文復唱を出している。candidate.core/conflictsとsubject.source_entityは欠落、conflictsがclaim内部へ混入、初回4役割を2claimへ結合、関係方向不整合、bindingsのsectionもrepair_result/solo_joyで既存名と異なる。根拠が通った後の意味/本文合格を主張しない。生データへ必須fieldや座標を足して成功にしない。

## 次に扱う不足

この原rawを不合格のまま保持し、自然な受け取りの追加観測会より先に、型・階層・field_path・座標単位・意味の分け方を曖昧にしない出力提示/形式学習を直す。現OUTPUT_SPECの説明文とfield名一覧だけでは、JSONの階層と実値を安定して出せないことが今回も残った。次の最小候補は同じ既存schemaを具体的な階層/値型として示し、field_pathはtext_fieldsのキーそのもの、座標は当該欄のscalar位置で、SOURCE_ENVELOPEのutf8_*やfield_utf8_*を転用しないと明示する指示へ整理し、正解本文をpromptへ漏らさず、旧teacher/source/priorを保持してCPUで全入力一致・最大長を再確認すること。新schemaや採用条件の緩和、raw自動補修、元教材の教師gold化、無根拠な追加epochへ進めない。現teacherは1family/2行/2updateであり、これを学習不足の量や4B能力上限の確定根拠にしない。

今回の1生成は終了。追加生成/訂正後生成/再学習は0。観測会は今回の形式問題には不要。自然な完成受け取り、通した訂正実演、Piece/Analysis完成教材・独立評価の不足は残す。商品受入れ0/3、PRODUCT_NOT_CLEAR、全体54.50％は据置。STRUCTURE_MAP_DELTA_NONE（既存注入境界の指示だけ、採用側/型/公開API/DB/RN/Render変更0）。CPU最小修復の限定TECHNICAL_CREDITと、実モデルの不合格を分ける。
