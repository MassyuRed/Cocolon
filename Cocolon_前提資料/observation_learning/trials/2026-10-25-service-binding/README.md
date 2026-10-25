# 同chairのservice識別子学習と実保存の診断

最新はweekly§36。frozen chair1題・初回/訂正2段階×3identity＝6teacher。12更新後FITは意味/本文5/6、実service ID01は初回保存再読のみ成立し、訂正はINVALID_EVIDENCEで未採用。

- `fit12/`：12更新/非学習reload/FIT6の原本、consumer全結果、原文比較診断。訂正FITはfrozen teacher priorで、動的一往復ではない。
- `identity_eval1/`：学習外ID01の実model2call、実service/隔離SQL・実prior/問い・初回非生成再読、訂正不採用の全原本。新planとして一度実行し終了、再試行0。

全JSON/EOS成功と意味/本文採用を分ける。原raw/teacher/reader/意味contract/SQLは修復せず、rootが全本文を読んだ。一般言語品質・通常application/実Auth/HTTP/RN/本人端末・商品受入れは未成立。新しい学習候補とID02の実結果は、完了時にここへ追加する。GPUは保持する。
