# role・引用・附属更新・終了の13補助課題 — 2026-10-29

**現在：承認後にJupyterへ直接接続し、role18の実CPU確認まで完了。新しい一回の条件を固定し、source保存後に開始する。モデル処理・新採否はこの記録時点で未実施。**

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


## 2026-10-29 role18 — 実CPUと新一回条件

上の未接続/未固定記述は準備段階の履歴。現在は本節を優先する。

Mashの「承認するから進めろ。」の後、Jupyterへ直接接続。Pod vgkm402msgroiu/RTX A5000・24564MiB/使用1MiB/Python3.12.3と初期afaa3file hash一致を確認した。管理画面/管理API/credential/GPU lifecycle操作0。前回同Pod表示$0.28/hを按分に使い、今回live単価を再照会したという主張はしない。

runtime18の新source3/planを転送・hash照合し、実CPUを一回実施。14.057451742秒、18系列80137token/最大7777、prompt mask/全target＋EOS/既存causal window/112F32有限性、元11prompt一致/正解教師意味本文11/11が成立。完全CPU1837871bytes/SHA118faa4004e779d83c9c7eedf954c2bb31b1db293fbb4ecbe15f9ef025aef35aはZIP download一回失敗後、Jupyter Editor全文コピーで無変更回収・hash一致。cpu_check.index.json＋11partで完全再構成でき、cpu_summary.jsonが要約を所有する。実モデルload/forward/更新/生成/SQL0、CPU再実行0。

新一回は初期afaa/元helper/全文assistant＋EOS CE/LR5e-5/seedを保ち、13局所各1＋CHAIR01初回/訂正＋DAILY01＋元BOOK/SHOP＝18一意更新。旧19行は不変、新13をメモリ上で追加し32行。別adapter保存/112F32非学習reload後、元全文2＋旧9の固定11自由生成を原形式rawのまま既存CMEEへ通し、成立snapshotだけ別process cold全outcome比較。旧9各2560/BOOK3712/SHOP3584/context8192/各180秒/最大2700秒/$0.21処理按分、親2690秒＋kill10秒。準備/CPU/回収/保持/保存/通信/税等別、期限/OOM/非有限/identity不一致で終了。無効role18.plan.jsonと今回runtime_authorized_plan.jsonを分離し、source保存・readback後に一回開始する。旧run/枠再利用、retry/上限延長/次run自動開始0。旧9before欠測から維持/改善率を出さない。

独立read-only reviewでsource3とplan全hash/18順/32行/評価11/caps/初期afaa/前後bounds/consumer18counterを確認、blockingなし。root GPT-6 Codex Work単一writer/executorで正式Pro/Ultra/human受入れではない。新採否は実行後に原rawから判定。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、現2題の新観測会不要。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy/lifecycle変更0、STRUCTURE_MAP_DELTA_NONE。
