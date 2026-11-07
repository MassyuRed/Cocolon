# 引用形式のprior座標修復・承認済み2件診断の起案記録（実行済み）

状態：**承認済み非学習2件診断は実行済み・閉鎖**。[最終結果](../prior_quote_probe2_result/README.md)が現在の結果ownerです。学習0/生成2/EOS2/strict2、意味・本文0/2。以下は起案時CPUと承認案の履歴です。API [64c6cb1a](https://github.com/MassyuRed/mashos-api/commit/64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4)でモデル向け入力の取り落としを修正しました。前回adaptive30は意味11/15・本文9/15、新6本文0/6で閉鎖・新d431不採用のままです。CPU確認を品質改善へ換算しません。

## 見つかったことと修正

quote形式ではモデルへ数値座標を出さないよう指示し、元source側の証拠用座標も隠していました。一方、回答後に渡す`prior_adopted_interpretation.meaning_packet.evidence`には旧nativeの`start/end`が残っていました。固定15件では回答後5件×6引用＝30行、60座標項目です。SHOP回答後の実rawが禁止された座標を18引用へ再出力したことと整合しますが、混在がその原因だと実モデルで確定したわけではありません。

`model_candidate_source.py`のquote branchで、**モデル向けpriorのコピーからstart/endだけを除去**します。旧numeric形式・初回・元source・保存済みprior・意味候補・ID・引用文/順序・問い・更新・OUTPUT_SPEC・CMEE readerは変更しません。source1fileと既存quote test末尾の回帰確認1件だけがAPI差分です。通常API・DB・RN・依存・配置へ変更しません。

## Jupyterの実CPU確認

[actual_cpu_check.json](actual_cpu_check.json)：**6.912890955秒**、直接assertで全15件を確認しました。

- quote入力の初回10件は全message bytes不変、回答後5件だけ60座標項目を除去。意味・引用・順序・原情報・OUTPUT_SPECは不変。
- 旧numeric形式15件、元の保存済みprior、凍結教材/全15assistantのtarget token IDs・EOS/終端改行を保持。
- prior30引用は原欄で一意で、除去前のstart/endを原文と引用から完全再導出可能。一般の重複引用まで同じと保証しません。
- BOOK回答後の入力4257→4201token、SHOP4419→4365。従来3712出力枠込み7913/8077で8192以内。旧椅子訂正3件も57tokenずつ短縮します。
- 元API copyは不変、新API copyの変更集合はsource1＋回帰test1だけ。tokenizerは既存と同じ`trust_remote_code=False`、offline/cache限定。model load/forward/学習/生成・production SQL・GPU lifecycleは0。

Podにpytestがないため、既存2suiteと追加pytest caseの実行は**未実施**です。依存の追加installはしていません。直接assertによる実15件確認と、pytest PASSを区別します。新testの保存だけをテスト成功数に加算しません。

最初のCPU確認は私のhelper戻り値の参照誤りで2回停止しました。次はpytest未導入で停止。各code・起動・logを保存しています。その後の直接assertは全15件成功しましたが、不要だったtrust_remote_code=Trueの指定を既存どおりFalseへ戻して再確認した上記最終結果を正本とします。いずれも実モデル処理・再学習・生成0で、GPU試行の再実行ではありません。

## 今回採らなかった案

prefix不一致、causal shift、教師/evalのchat template差は見つかりませんでした。参照先を先に出力する順序案は旧`ordered30_preparation`で既試行です。静的には定義前参照454→0にできますが、当時の実GPUは意味/本文3/15へ退行しました。初期重み/32tensor等が違うため現在112での反証ではありませんが、「未試行の新案」として同じ有料反復を推奨しません。今回の座標除去と順序変更を混ぜません。

BOOK/SHOP回答後は元4claimとsnapshot_refを保ちつつ、根拠番号・複数namespace・必要7/8更新の組立てで破綻しています。priorなし初回4件の本文失敗は今回の修正対象外です。全不良の共通原因や4B能力上限、教材不足とは断定しません。新観測会は今は不要です。

## 起案時の一回案 — 追加学習なし・回答後2件だけ（実行済み）

[probe2.plan.json](probe2.plan.json)はMashの今回承認を2ab02db3で結び、一回実行済みの原本としてAUTHORIZED_ONCE_BOUNDを凍結保存しています。再利用用ではありません。未承認executeは**output作成・モデル処理より前に拒否**され、[pending_execution_check.json](pending_execution_check.json)へ記録しました。前回の消費済み30更新planは再起動しません。

| 項目 | 固定範囲 |
|---|---|
| 重み | 保存d431a07c、112F32/3,833,856parameterを非学習load。新しい重み/optimizerを作らない。不採用候補の診断利用で、通常採用ではない |
| 件数 | BOOK・SHOPの回答後を各1回、計最大2自由生成。初回と旧9の新生成は0、beforeは前回保存rawを参照 |
| 入力差 | 上のprior start/end除去だけ。同じ元情報・凍結prior・出力条件・3712cap、temperature等は既存helperのまま |
| 上限 | **600秒（10分）・処理按分$0.047**、$0.28/h。外側590秒＋kill10秒、各生成180秒。準備・CPU・回収・保持・保存・通信・税等は別、総請求額ではない |
| 採否 | raw無補修で同CMEE。本文・根拠・全7/8更新・重複キー/座標を読む。採用snapshotのみ既存workerで別process cold-file再読 |
| 終了 | 再試行0。異常は部分raw/logを保全し一回閉鎖。追加学習/生成へ自動進行しない。GPUはStop/restart/deleteせず保持 |

[run_probe2.py](run_probe2.py)は既存loader/評価だけをread-only再利用し、旧executeは呼びません。[consume_probe2.py](consume_probe2.py)は従来の未変更reader/APIa4b91b4を使い、モデル向け入力版64c6cb1aと区別して記録します。2件成功でも旧9退行なし・全15成功・新初回4件の改善・動的一往復・通常service保存・商品採用は証明しません。比較の目的は、この入力の取り落としの除去が**既知回答後2件**に与える影響だけです。

承認後、固定sourceとplanの承認3項目以外の不変を照合し、下記を2ab02db3で一回実行済みです。再実行用の指示ではありません。

```bash
HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 timeout --signal=TERM --kill-after=10s 590s python -B /workspace/cocolon_prior_quote_pack_20261027/run_probe2.py --pack /workspace/cocolon_prior_quote_pack_20261027 --execute --source-commit <承認記録を含む固定commit>
```

## 原本・現在地

CPU原本は25payload＋manifest/26member、60,852bytes、SHA256 `0ecb5023e9df49ce4aa682ff38cf236c8d5562ca3067b90ef4a255d2664af399`。Pod外でCRC/全bytes/hashを照合し、[manifest](runtime_archive_manifest.json)の各memberをbytes不変で保存しました。新しい重みは含みません。診断用d431重みと前回全原本は[adaptive30結果](../adaptive30_result/README.md)に保全済みです。

全体00・観測入口・学習owner・01A/CMEE地図・weekly§79へ差分反映します。STRUCTURE_MAP_DELTA_NONE（既存モデル入力projectionの取り落とし修復、責務/意味型/wire/reader/通常接続不変）。rootが単一writer/実行owner、補助はread-onlyの所見で、正式Pro/Ultra/人手商品受入れではありません。商品0/正式0/3/54.50％、candidate_ready=false、automatic_progression=false。このGPU診断は実行・閉鎖済みで、追加試行は自動開始しません。
