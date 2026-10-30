# 最新状態（2026-10-30）：承認済み5区間の一回実行を不採用閉鎖

当初案はMashが承認し、[限定実装](implementation_20261030/README.md)・CPU gate後19更新/保存reload/実3callまで実施済み。[全実結果・全file地図](result_20261030/README.md)を現在の再開先とする。新2意味/本人本文0/2・旧9NOT_RUN、原本/初期/新重み保全、retry=false。下記は実装前のCPU studyと当初未承認案の履歴であり、未承認待ちへ戻さない。

---

# 5区間方式のCPU実現性確認と一回案

2026-10-30 JST。**CPU実現性確認のみ完了。新しい生成方式・GPU一回は未承認、未実行です。**

現在の未完了はBOOK／SHOPの長い候補を自律完結させ、意味・更新・本人本文をCMEEへ渡すことです。前回§119は同じSHOP prefixの二経路が同じ不適合tokenを選びました。cache全般の正常性は証明していませんが、この地点の失敗をcache固有原因へ帰属できません。型制約だけでもfield誤配・反復が残った§114、17更新後も両TOKEN_LIMITだった§117を保持し、同重みの一括再生成・新grammar・上限延長を選びません。

## 今回の実確認

current PR30はc8e3d059b7550f17cfe8779bf18a0ec5ff07d345、API PR3は7acff07421c0cfa458ec6cf75616187379311854。mainは8月の旧版で、今回の作業ownerではありません。全機能原本全文、作業入口・CURRENT_RULES・Rule18・恒久incident全文、全体設計01/02・分冊と全file地図のrouting、CMEE map、最新weekly§117〜119、学習目的と既存実sourceを参照しました。全歴史map／全weekly／全blobの全文再監査とはしません。System Contextは最新cache未生成の既存状態で、原本の直接読取を使用しました。

同Jupyterへ直接接続。GPUはRTX A5000、1MiB/0％で稼働保持、管理console/API・Stop/restart/delete0。実行はCPU4.656087083974853秒、exit0。モデルload/forward/更新/自由生成/新CMEEは全0です。

既存rehearsal13の完成教師2件だけを、元の13位置（root0..3＋c0..8）へ重複なく割り当てました。root5列とc9列の元順、全値・null・空配列・引用・関係・全更新・本文をそのまま結合すると、教師JSON全bytesへ2/2完全一致します。新しい意味や本人向け文章は作っていません。

| 区間 | 担当する元field | BOOK教師＋EOS | SHOP教師＋EOS |
|---|---|---:|---:|
| 1 | version2個、alias、引用表 | 492 | 523 |
| 2 | claims、conflicts、core | 899 | 1,094 |
| 3 | relations、schema、unknowns | 283 | 236 |
| 4 | updates | 267 | 291 |
| 5 | question、prose | 220 | 293 |

各区間の入力には全原材料・実prior・requestを維持し、前段だけを渡します。今回の10学習例の前段は**教師由来・学習用**です。実推論に教師を与えた証拠、4Bが解けた証拠ではありません。初回から後段の正解を先取りしていません。

保存tokenizer・固定revisionを使った教師前段での最大prompt＋候補capはBOOK6,802、SHOP7,285／8,192です。capは順にBOOK640/1152/512/512/384、SHOP768/1280/384/512/512。実model前段は長さ・値が変わるため、将来の各call直前に実token数を検査し、超過なら切捨てず停止します。

**総生成量を減らす方式ではありません。** 教師側合計はBOOK2,161／SHOP2,437tokenでほぼ元と同じです。入力合計は27,845／29,244token、元一括promptの約6.48／6.58倍です。各連続出力を短くする仮説であり、速度・原価・意味品質の改善は未実証。過去A/Bは補助学習後も一括評価が失敗し、補助A/B自体も失敗済みです。5分割だけで解けると断定しません。

欠落段、余剰重複段、先頭2段の交換を拒否しました。交換はarity差で拒否しただけで、一般順序・意味・来歴検査の成功には数えません。Pod外で全8memberのCRC/bytes/SHA、実sourceと全10例の元材料/prior/spec保持・将来段非漏出・2件全bytes再結合を独立照合。tokenizerをPod外で再実行したとはしません。

## 未承認の一回案：教示だけでなく実生成も5区間にする

これは新しいoffline生成方式の採否と有料実行の判断であり、Rule18 §11.3 LEVEL3です。今回の継続指示をこの案への承認として先取りしません。

目的は、未修復の実model出力だけから新2件を完結させ、既存CMEEの意味・本人本文・保存再読を成立させられるか、一回で確認することです。通常アプリへの導入ではありません。

1. **限定offline実装とCPU確認。** このdirectoryの新 `prepare_stage5.py`、`run_stage5_once.py`、`consume_stage5.py` に閉じます。実準備は既存loader/tokenizer/adapter保存再読込・既存receiver/Engine/coldを再利用し、新汎用framework・新依存・本番API変更を作りません。最終実装のsource/入力/上限を固定し、CPUで教師再結合と既存意味/本文/全更新・保存再読、旧形式の既存保存raw9件を確認します。CPU不成立ならGPUを開始せず、一回を閉じます。
2. **同一意味の区間10教材＋旧9教材＝19更新。** 既存の成功旧9を持つ保存11446641から開始。元11教材は不変、派生10行は今回保存例を基礎に仕様のfield名を明示する最小補正だけとします。各区間教師は元値をそのまま保持し、前段正解は学習時だけ。順序はB1/S1/旧0/旧1、B2/S2/旧2/旧3、B3/S3/旧4/旧5、B4/S4/旧6/旧7、B5/S5/旧8。全文assistant＋EOS CE、既存112F32/r8、LR5e-5/clip1/seed20261024/fresh AdamWを維持。厳密途中再開とは呼びません。
3. **別保存→別model objectへの非学習再読込。** 全112tensorの値・dtype・有限性・no-grad、元重みと教材の不変を照合。新候補を通常採用へ昇格しません。
4. **BOOK／SHOPそれぞれ最大5段、計最大10call。** 各caseの初段は元材料だけ、次段へ渡せるのは同caseで実modelが出した前段候補だけです。教材・gold前段・教師の要素数を推論へ注入しません。中間結果はJSON/必要な型・参照の検査を通った未採用候補であり、意味snapshotや本人本文成功ではありません。1段が不成立ならそのcaseを終了し、次の独立caseだけを既定順で確認します。局所再生成・repair・不足値補完・追加callなし。
5. **最後だけ全体を結合・既存CMEEへ渡す。** 各段の未修復raw/finish/token/usage/elapsed/messages identity、同じmodel/revision/adapterを全て保存します。結合は固定13位置を一度ずつ入れるだけで、欠落・誤順・identity不一致は停止。組立packetは `LOCAL_STAGED_MODEL_PROJECTION` という比較用の派生出力として、単一model rawと明確に区別します。既存receiptは派生packetを検査したものとし、元stage全原本・組立規則との対応を同じ完全archiveへ保存します。single-call native成功、通常ModelCandidateSource接続、商品採用には加算しません。現受口でこの区別が保存・再読できない場合は契約を迂回せずCPUで停止します。
6. **新2が全意味・本人本文・全7/8更新と別process保存再読に成功した時だけ旧9を新候補で各1生成。** 最大19生成。旧9全9/9維持が必要です。失敗した候補は不採用で一回閉鎖。全raw/本文はroot華恋が読み、FIT成功を未知一般化や商品品質へ換算しません。

GPUは同Pod/A5000、model load最大2（学習＋非学習reload）、更新最大19、新段階生成最大10、条件付き旧9最大9。各生成180秒以内、**全GPU処理最大2700秒（45分）／按分$0.21**、履歴$0.28/hによる上限です。準備・親外CPU・回収・保持・保存・通信・税等は別。live単価再照会や新GPU契約はしません。親2690秒＋kill10秒・内部2700秒、各call直前に残時間も検査。CPU準備は最大600秒＋停止猶予5秒、追加GPU処理0です。

identity不一致、非有限、OOM、期限、stage/前段chainの不整合、既存source/provenance保存不能で停止し、同条件retry・次の有料runへ自動進行しません。GPUは指示まで稼働保持。新4B採用／本統合／単一呼出しと同等の本番原価・商品品質をこの一回で決めません。

実装前のこの案は `PROPOSED_NOT_APPROVED`。`study.py` はCPU分析だけで、GPU runnerや段階来歴受口はまだありません。CPUだけで技術成立／商品向上を自己認定せず、実model結果への最小の同一一回案として提示します。

## 原本と全file責務

| file | 責務 |
|---|---|
| study.py | 実行した一回限りCPU分割・再結合・token長測定。model runnerではない |
| report.json | 実4.656秒、2件全bytes復元、各段token/cap、元教材/両重み不変、モデル処理0 |
| stage_train10.jsonl | 原2教師の派生5区間×2。gold前段は学習/CPU測定専用 |
| original_teachers2.json | 使用した既存2row全原本。新教材追加ではない |
| stage5-cpu.log / stage5-cpu.exit | 実CPU原log / exit0 |
| execution.json | CPU command、モデル0、GPU読取、準備上の失敗/操作の区別 |
| manifest.json / originals.zip | 7payload＋manifestの完全原本、43,170bytes、SHA61d6108bb30edfb8aecdd6cb82e81d0686edf956954f738834f6fe159db95126 |
| verification.json | Pod外全CRC/size/hash・独立再結合/前段照合、source末尾LF差と検査限界 |
| proof.jpg | 実Jupyter完了画面 |
| README.md | 実結果、限界、未承認案、全file地図 |

準備のread-only表示ではlist rootへのitems呼出しと未parse文字列へのitems呼出しが各1回失敗し、文字列全字を誤列挙した表示もありました。結果file作成・モデル効果はありません。upload chooser timeoutでruntimeを再取得後、terminal pasteで配置。末尾LF1個が追加された実sourceをそのまま回収し、最初のPod外source完全一致assertの停止と、差を特定した後の全原本照合を区別しています。CPU本体は一回成功、GPU/CMEE retry0。

Renderはworkspace未選択の読取応答まで、稼働照会/変更0。Supabaseはproject一覧read-onlyでcocolon-project ACTIVE_HEALTHY、本人row/SQL/設定変更0。現2題の追加観測会は不要です。未知評価・自然な受け取り・Piece/Analysis教師の十分性とは分けます。

通常source/receiver/意味型/三core/API/DB/RNの変更0、STRUCTURE_MAP_DELTA_NONE（今回はCPU案・資料のみ）。前回新2意味/本人本文0/2・旧9NOT_RUN・商品0/正式0/3/54.50％を維持。primary=ADMINISTRATIVE_ONLY、technical_credit=0、product_credit=0、candidate_ready=false、automatic_progression=false。root華恋が単一writer/executor/judge、補助read-only、実環境Codex Workで正式Pro/Ultra/human受入れではありません。
