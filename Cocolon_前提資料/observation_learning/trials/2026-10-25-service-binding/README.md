# 正規service束縛学習と実保存再読

**fresh ID02で、実4B→既存Emlis service→隔離SQLの初回/訂正後保存・意味保存後中断/明示再開・非生成再読まで成立しました。** API95d00b・offline180秒/source150秒、通常30秒/SQL期限/CASは不変。最新の全経過は[weekly§36](../../../weekly_reviews/Cocolon_Weekly_Review_20261024.md#20261025-service-binding-fit12)。

| 原本 | 実結果 |
|---|---|
| `fit12/` | 同chair1題2段階×3identity=6教師へ12更新。JSON6/6・意味/本文5/6。残る訂正のend5値が不正 |
| `identity_eval1/` | 学習外ID01、実model2call。初回保存再読は成立、訂正は根拠表欠落/座標/参照不正で不採用。終了・再実行0 |
| `focused_fit6/` | 同じ凍結6教師へ根拠表/参照lossで6更新。既存成功5raw不変、残るend5値だけ直り意味/本文6/6。本文表現は不変 |
| `identity_eval02/` | fresh ID02、実model2call/SQL30RPC/210.940秒。ASK→訂正3更新→意味commit後中断→明示resume→REFINED/COMPLETED/END、保存済みGET/startと同key回答で再生成0 |

raw/teacher/reader/採用条件を修復・緩和せず、実serviceのUUID・問い・actual priorを使いました。同processでの保存後中断/再開です。cold restart、未知言語品質、通常application/Auth/HTTP/RN/本人端末、商品受入れは未確認。独立した言語事例は1題のまま、正式0/3・54.50％据置、product credit0。

`summary.json`が今回の機械的な集約です。`focused_fit6/fixed_fit_consumer_index.json`と6caseは元consumer JSONをlossless再構成でき、元bytes/hashの一致を検証しています。保存重みは76309b86…、元base4B全重みとoptimizer/RNGは含まないので、単独完全モデルや厳密途中再開とは扱いません。旧9b845/adae重み・旧教師・旧評価を保持します。

新source/計画は[学習pack](../../training/2026-10-25-emlis-service-binding/README.md)。今回の観測会は不要。GPUは稼働保持、STOP/再起動/削除0。STRUCTURE_MAP_DELTA_NONE。
