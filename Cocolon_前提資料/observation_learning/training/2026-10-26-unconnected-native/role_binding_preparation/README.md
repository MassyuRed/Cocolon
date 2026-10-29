# role・引用・附属更新・終了の13補助課題 — 2026-10-29

**現在：接続不要の教材投影まで完了。Jupyter接続先の承認待ち。実tokenizer・GPU学習・生成・CMEE新採否は未実施。**

前回[joint_transfer11](../joint_transfer11/README.md)は閉鎖済み・新4ee不採用。全文BOOK/SHOPの意味・本人本文0/2、旧9 after-only 8/9/cold8はそのまま保持する。今回も追加観測会は不要で、既存完成教師の対応を教える。13行を新しい観測事例13件・学習13回とは数えない。

## 対象と差分

開始原本はPR30 `c2dafc54afe08a33ce68e1d5f19d0eb286877c9e`、API PR3 `7b9ee073de03940ba71587297d8600b2b6094dd1`。全機能原本、作業ルール、全体設計01、全file地図01A/B/C、共通/Emlis/CMEE map、観測学習の目的、最新weekly§99、実run/prepare/consumeを確認した。System Contextの既知索引停止は再実行せず、fresh原本を直接読んだ。rootはGPT-6 Codex Work単一writer、read-only補助は正式Pro/Ultra/human受入れではない。

原4補助行は `../staged_pair9/auxiliary_train_messages.jsonl`、104198bytes、Git blob `cb4bc5abbf6ee5d370320b09ddb755e8a7f07cf7`、SHA256 `3c80fa6c1c9b47df8efc84aa9f899af4ffb6ef436c0403fdb1bb0646f88f1654`。元A/B部分木は完全に再結合できる。今回の投影では既存の一部だけをtargetにし、新しい引用・意味・関係・本文を作らない。

| 課題 | BOOK | SHOP | targetと条件 |
|---|---|---|---|
| 意味と引用6行 | no_contact／statement_concession／returned_concession | perceived_realization／answer_joy／felt_distance | 既存claim又はrelation1個＋time/mode/polarity/subjectを含む全ev引用。gold意味は入力しない |
| 附属ADD5行 | no_contact／continuing_concern | perceived_realization／felt_distance／answer_sadness | 正解Aを条件に、claimと附属relationを含む元ADD1個の全replace/evを保持 |
| 終了2行 | 最終GAP＋question/prose | 最終GAP＋question/prose | 正解A＋全ADDを条件に、GAP1個から3本文/bindsへ進む。入力へGAP/最終本文を渡さない |

従来Aは全引用/意味、Bは全更新/本文を一括で返した。今回は実際に誤対応した役割、関係が付くADD、最後の境界を独立targetにする。gold A/ADDを与えた条件付きFITは、元全文の自由生成成功ではない。独立relation課題の端点IDは維持するが、完全候補としてCMEEへ渡さない。

## 今回実施したこと

- `prepare_role_bindings.py`をstdlibだけで実行し、13行220748bytesを生成。SHA256 `4aec0be06138ec94b52534148219372cfc608de93b2ba0b13cbabf24e814707f`。
- 各targetは原教師の部分木と一致。元material/prior/request_ref/semantic_profileを保持し、nested ev依存を取り落とさない。終端は元ADD列＋GAPへ再構成し、question/prose全値も一致。
- AST構文確認、13行のsource条件/役割/終端確認、不正なnested evとGAP二重化の拒否2件を確認。これは静的構造確認であり、tokenizer/mask/context8192/実CMEEの新検証ではない。
- 独立read-only reviewで、元specの全件生成指示と局所課題指示の衝突を検出し修正。最終13行は課題別specだけを使い、元source/prior等52項目の独立比較も一致した。v1は学習投入0で不採用、最終v2だけを保存する。
- 教材原本・評価・全文prompt・API/wire/reader/採用基準・旧重みへの変更0。生成行のassistantは215〜1284文字で、token数・総系列短縮・所要時間の実測とは扱わない。

再生成は次の一回限りの投影コマンド。出力先は新規directoryを指定する。GPU実行の入口はない。

```bash
python -B prepare_role_bindings.py \\
  --source ../staged_pair9/auxiliary_train_messages.jsonl \\
  --source-sha256 3c80fa6c1c9b47df8efc84aa9f899af4ffb6ef436c0403fdb1bb0646f88f1654 \\
  --out /new/output/directory
```

## 接続後に行う直接作業

1. Mashが示す又は承認する稼働中Jupyterへ直接接続。同Podの既存file/base/tokenizer/保存重みを照合し、管理console/APIやGPU lifecycleを操作しない。
2. 固定tokenizerと既存`encode_training`で全13行＋実学習順の全target/EOS/mask/contextを確認する。投影が小さいことだけから8192以内と推測しない。今回の原4行以外の元15/eval/全文2promptも同一確認する。
3. 既存afaa開始・通常全文assistant＋EOS CE・LR5e-5を維持し、13局所行＋旧chair初回/訂正/dailyの3anchor＋元全文2の計18更新を検討する。これは未実装・未実行の候補順序で、実token/所要/保存先を確定する前に開始しない。新量は前回11より増えるため、前回run/lock/承認枠へ流用しない。
4. 新しい別保存・112F32非学習reload後、**元全文BOOK/SHOP各1＋旧9の固定11自由生成**を無補助で行い、原rawを既存`consume_transfer11.read_raw`相当の同じreceiver/Engineへ通す。補助JSONの結合/修復・reader緩和・生成上限延長はしない。成立snapshotだけcold全outcomeを比較する。
5. BOOK6ADD＋1GAP、SHOP7ADD＋1GAPだけでなく、引用重複/role対応、全関係・否定・知覚、3本文とbindを全文で読む。旧9beforeは今回も未取得ならafter-onlyと明示し、維持/改善率を出さない。CHAIR01訂正の更新別evidence混入は独立に確認する。

新GPU実行plan・runner・量/順序の最終固定・予算消費は0。検討する処理上限は既存同Pod表示$0.28/hに対し最大2700秒/$0.21処理按分（準備/CPU/回収/保持/保存/通信/税等別）。今回の接続拒否後に現単価/稼働を再確認したという主張はしない。上限内の完了保証・自動再試行・次run開始0。

## 接続停止と保存境界

今回ブラウザはblankのみで、接続済みJupyterタブはなかった。引継ぎ・現GitHub・過去文脈にexact URLはなく、記録されたPod IDに基づく直接Jupyter接続は、当該originへの許可を確立できないとして自動承認レビューが拒否した。alternate origin/管理画面/HTTP/別経路からの回避0。credential取得/入力0、Jupyter terminal/子process/モデル処理0。次は接続先の明示又は当該Jupyter originへの承認が必要。

今回は投影sourceと再現できる13行を保存した準備結果に限る。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、新観測会不要。GPUのStop/restart/delete0。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。primary=TECHNICAL_CREDITは教材投影sourceと構造照合に限定し、モデル品質creditは0。
