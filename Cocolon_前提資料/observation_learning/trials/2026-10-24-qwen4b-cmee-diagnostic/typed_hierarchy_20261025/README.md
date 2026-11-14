# stage別階層提示後の保存4B・2FIT実検証

同じ保存adapterを初回と保存prior付き訂正後で各1回生成した、非学習の限定確認。実初回の問いから続く動的一往復ではない。

| 項目 | 結果 |
|---|---|
| source / API | Cocolon `0d509c0903e0ee62c248857059087024e14dc7f5` / API `0037ae59eddab00f4956a7e4c2506db2af8ccc35` |
| base / revision | Qwen/Qwen3.5-4B / `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` |
| 保存adapter SHA256 | `0bdac5e90c79f20129de9a765ac7ee7c59714f3102bc68a2f4aff363c7dd3b78` |
| 実行 | A4500 20GB、seed20261024、greedy、context8192、max_new2048、216.149秒 |
| 追加学習 / optimizer / trainable | 0 / なし / 0、全adapter hash前後不変 |
| peak allocated / reserved | 10.087 / 11.096 GiB |
| 初回 | 3071入力/1875出力、stop・JSON構文成功、INVALID_EVIDENCE |
| 訂正後 | 6091入力/2048出力、length・JSON途中終了、TOKEN_LIMIT |
| 実CMEE | 意味/本文0/2、messages/identity一致2/2 |

初回は外側のsource_id `FT-CHAIR-O`ではなくnested original/envelopeの`src-7554a750377f05e1e107e620`を出し、根拠位置406..460 /489..567等もsource envelopeのUTF-8位置をコピーした。memoなどのfield名だけは正しくなったが、有効なsource_idへの対応がない。core/conflicts欠落、claim.kindへtimeやrelation enumを流用、初回unknown2、出来事/結果/喜び対象の誤分解、説明的な受け取りも残る。先頭のINVALID_EVIDENCE以降を通過したとは扱わない。

訂正後はpretty JSONの更新途中で打切り。生成後のminify/補修、target差替え、上限増加、同条件の自動再試行をしない。[raw.jsonl](raw.jsonl)は回収bytesそのまま、[inference_report.json](inference_report.json)は入力messages・preflight・32tensor非学習reload・hashを含む。[cmee_result.json](cmee_result.json)は固定APIの実consumer結果、[comparison.json](comparison.json)は生出力を変えない診断補助。source/manifest/raw SHAをPod外で照合済み。

表示$0.26/h×216.149秒は約$0.01561。準備/回収/継続保持/税等を除くprocess按分で、請求額やhard capではない。GPUはSTOP/再起動/削除なし。今回は形式提示の改善だけでは採用成立しなかった。観測会は不要。次は外側source_idとminified JSONを明示した同2targetの形式学習を独立に比較する。正式商品0/3・54.50％を維持し、他core教師や自然さ/全般品質の成立へ加算しない。
