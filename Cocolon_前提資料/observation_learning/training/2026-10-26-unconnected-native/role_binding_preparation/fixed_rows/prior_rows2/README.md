# モデル向けpriorの表記整合 — CPU完了、追加学習なし2生成案

[rehearsal13](../rehearsal13/result_20261029/README.md)は13更新・保存再読込・11生成を終え、新2意味/本文0/2・旧9=9/9、新11446641不採用で閉鎖した。そのrunや承認を再利用しない。今回の目的は、**出力に固定列配列を求めながら、入力の直前解釈にはnamed objectの具体例を渡していた形式混在**を、意味を変えず取り除いて比較できるかを確かめること。新2の失敗原因の全て、形式干渉の主因性、4Bの限界を確定したものではない。

## 変更したのはモデルへ見せるpriorのコピーだけ

BOOK/SHOPとも、priorの4claim・各time/mode/polarity/pred/subject・2relationがnamed objectだった。実rawはroot/a/qまで一部配列を使ってもclaimからobjectへ戻る。一方、同じ重みは旧quote-object教材9/9を生成できた。内容・長さ・責務も異なるので、これだけで形式干渉を単独原因とは断定しない。

[prepare_prior_rows2.py](prepare_prior_rows2.py)は、既存`output_spec.shape`の列順を用い、**既に存在する**`prior.meaning_packet.a/q/c.claims/各軸/c.relations`だけをrowsへ移す。元の意味値・引用・名前・順序・型・scope・否定・時点・snapshot_ref・vを保持する。外側object、cのfield名、unknowns・conflicts・updates等は原形のまま。元priorにないquestion/proseを足さず、完成output用encoderでnullを埋めない。priorのvは保存元の版情報で、新しい出力形式の例ではない。

同時に、`output_types`中の「priorは元named形式のまま」という1文だけを、変更fieldと不変fieldを正しく示す説明へ置換した。他の意味条件・本人source/material・system・教師assistant・受領形式・意味/本文検査は不変。逆投影と説明1文を戻せば元user JSONのbytesまで同一である。新しい一般carrier/decoder/API契約の導入ではなく、候補pack内のread-only表示コピーの比較に限定する。

旧prior座標除去はquote方式でstart/endを落とす入力整理だった。今回は値を一つも落とさず、既存列順へkeyの表記だけを移す。過去のloss重み調整、prefix補助、短課題増量、固定列のroot/subject表示2点修正を再実行したものではない。

## Jupyter CPU実結果

source [9b91ef7f](https://github.com/MassyuRed/Cocolon/commit/9b91ef7fb87862f2f7481351b15536a0bdbb3430)をJupyter端末へ配置・SHA照合後、一回実行。**4.674841582秒、exit0、モデルload/forward/学習/生成/新CMEE実行はすべて0。** 既存依存のみ、GPU不可視・offline。

| 題材 | prior bytes（変更前→後） | prompt token（前→後） | prompt＋元cap | 教師assistant＋EOS |
|---|---:|---:|---:|---:|
| BOOK | 3246→2326 | 4295→4152 | 7864≤8192 | 2148、完全同一 |
| SHOP | 3341→2421 | 4447→4304 | 7888≤8192 | 2424、完全同一 |

- 全2priorを元の全値・名前・型・順序・bytesへ完全復元し、説明を戻した元user本文全bytesも一致。
- 全11train/eval prefix、入力mask、assistant＋EOSを実tokenizerで確認。旧9はmessages全体・実token/labelsまで不変。
- 旧176frozenと保存11446641のREADME/config/weightsを前後照合。不採用状態は維持。
- 教師は変更しておらず、既存rehearsal13 CPUの教師2意味/本文/cold/replay全outcomeを同一bytesで保持した。**今回新しいCMEE/coldを実行したとはしない。** 実モデル改善は未確認。

[cpu_summary.json](cpu_summary.json)に計数、`cpu_full.json.gz`に完全reportと既存教師全outcomeを保持する。完全report SHA256 `13e6c81ba43616d47922c82e5f897842a933714ec7a17a7993f44841296c81ad`。回収ZIP102525bytes/8member、SHA256 `4f4013abcb55e983667f300dbcada844e0d9fb16249fbdfdbbc4095419dda683`。全member/CRC/size/SHA/sourceをPod外で照合し、全payloadをこのdirectoryへ保存した。Download APIは失敗を返し接続runtimeがresetしたが、実fileは到着しており再download0。[external_verification.json](external_verification.json)参照。

## 次の具体案 — 未承認・GPU未実行

[plan.json](plan.json)と[run_prior_rows2.py](run_prior_rows2.py)に次を固定した。未承認statusはモデルimport/OUT作成前に拒否し、[guard_verification.json](guard_verification.json)で確認済み。rootが編集・実行・判断し、補助はread-onlyの原典/コード確認だけ。実環境はGPT-6 Codex Work、正式Pro/Ultra/human受入れを称さない。

1. **保存11446641を非学習1load、追加学習0**。新promptでBOOK/SHOPを各1回、計2自由生成だけ行う。旧9は再生成しない。過去のrehearsal13の新2=0/2を比較原本とし、同じbaselineを再生成しない。
2. 同Pod/RTX A5000、固定Qwen3.5-4B/base851bf6e/112F32、greedy/非thinking、context8192、元cap3712/3584、各180秒。文法拘束・意味prefix・raw修復・fallback・検査緩和なし。
3. 親timeout590秒＋kill10秒＝**最大10分**。前回同Pod表示$0.28/hによる**処理按分最大$0.047**、live単価再照会なし。準備・親外CMEE CPU・回収・保持・保存・通信・税等別。
4. GPU解放後、既存consumerの`--phase before`で2rawの採否・本人本文・元receipt replayを確認し、成立snapshotは別process cold全outcomeを確認する。親外CPU150秒、各cold60秒上限。raw/token IDs/finish/identity/loaded表/sourceを回収する。
5. 両件の意味/本人本文/cold/replay成立とrootの全raw/本文読了を成功条件とする。成功でも入力表記を変えたこの固定2件の診断であり、原因の完全分離、未知一般化、old9の新しい実測、商品採用ではない。
6. timeout/不成立ではその一回を不採用で閉鎖。retry・追加更新・追加call・次runは行わない。保存重み・旧原本は変更せず、GPUはMashの指示まで保持する。

直前解釈をどう見せるかが4Bの実出力に影響するかを、重みを変えず最小2件で確認する案である。rehearsal13の11446641は診断用に保持した不採用重みで、比較への使用を商品採用に読み替えない。前回の一回承認は消費済みで、**この新条件の有料確認は別の一回承認対象**。現在のモデル生成/追加費用按分0（稼働保持等は継続）、追加観測会は現2題では不要。

## 全ファイル地図

| file | 責任 |
|---|---|
| prepare_prior_rows2.py | Jupyter CPU一回source。既存fieldだけの可逆表示変換、全値/全教師/旧9/token/mask/EOS/重み照合 |
| train_messages11.jsonl / eval_inputs11.json | 新2のprior表示だけを派生した11教材。旧9と全教師は不変 |
| cpu_summary.json / cpu_full.json.gz | 実4.674842秒/モデル0の計数、完全report・不変教師2全outcome |
| cpu.log / cpu.exit / archive_manifest.json / external_verification.json | 元ログ・exit0、完全8member回収とPod外照合 |
| run_prior_rows2.py / plan.json / guard_verification.json | 別承認の非学習1load/2生成案、未承認拒否の確認 |
| README.md | 実結果・判断限界・次の有限条件・この地図 |

通常ModelCandidateSource/receiver/native意味型/三core/公開API/DTO/DB/RN/Render/Supabase・新依存・merge/deploy/lifecycle操作0。`STRUCTURE_MAP_DELTA_NONE`（候補pack内表示比較のみ）。primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％・candidate_ready=false・automatic_progression=false。モデル向け表示だけのCPU成立を、実4Bの意味/本文改善へ換算しない。
