# 10/27 — 損失配分30更新一回の最終結果

**RUN_CLOSED_REJECTED_CANDIDATE。承認された一回を完了。意味7/15・本文6/15へ低下、新6件の本文は0/6のため新重みは通常利用へ採用しない。**

Mashが1cb47cffの同15教材・30更新→保存/再読込→15件確認、最大45分/$0.21処理按分（準備/回収/保持等別）へ「進めていいよ。」と明示承認。planの許可3項目だけをsource `7e3f6bca5ae9027077862ef10ea17bde25f3a8ef`へ固定し、同A5000/PID44914で一回だけ起動した。APIは`6b043880504912481a6b10d93c9128ec4995b70b`。

## 同quote15での比較

| 確認 | 前回interleaved30 / 1d218763 | 今回balanced30 / 228edccf |
|---|---:|---:|
| 更新 / 保存後生成 | 30 / 15 | 30 / 15 |
| EOS | 15/15 | 13/15 |
| JSON解析 | 15/15 | 11/15 |
| CMEE意味採用 | 11/15 | 7/15 |
| CMEE本文成立 | 9/15 | 6/15 |
| 旧9の意味 / 本文 | 9/9・9/9 | 6/9・6/9 |
| 新6の意味 / 本文 | 2/6・0/6 | 1/6・0/6 |
| 採用snapshot cold-file | 11/11、失敗0 | 7/7、失敗0 |

今回cold7は本文6件と本文なしREPOT1件を含む。本文7件完成とは数えない。旧9も椅子/日常の二language familyを別identityで扱った既知FITであり、9題の未知一般化ではない。新6も今回学習した既知教師。after回答priorは凍結教師由来で、実モデル初回からの動的threadではない。実service/SQL/HTTP/Auth/RN本人端末/商品受入れは今回0。

旧45779起点・同15教材/同30順序・seed・LR5e-5・32LoRA・prompt/eval/cap・API/readerを保ち、single-forwardの損失をfull .5＋S/F/U群平均 .5へ変えた一回。本文係数を増やしたことを観測品質改善へ換算しない。この固定条件では、長い訂正packet/根拠/本文の同時保持を達成できなかった。全ての加重学習方式が無効、4Bの能力上限、唯一の原因確定とは扱わない。

## 実15件の採否

| case/group | 意味 / 本文 | 最終の主な理由 |
|---|---:|---|
| CHAIR初回3 | 3/3・3/3 | parsed packet全体と実本文が教師一致。ASK3 |
| CHAIR01訂正 | 0/0 | 外側schema_version欠落、引用12→10。INVALID_FORMAT |
| CHAIR02訂正 | 0/0 | 余分な閉じ/末尾でJSON解析不能、INVALID_FORMAT |
| CHAIR03訂正 | 0/0 | 引用12→9、参照範囲外。model_evidence_out_of_scope |
| DAILY3 | 3/3・3/3 | parsed packet全体と実本文が教師一致。END3 |
| BOOK初回 | 0/0 | 3712tokenで未閉鎖。TOKEN_LIMIT |
| BOOK回答後 | 0/0 | 3712tokenの反復/構造破損。TOKEN_LIMIT |
| SHOP初回 | 0/0 | model_evidence_collection_invalid |
| SHOP回答後 | 0/0 | INVALID_EVIDENCE、semantic_receipt_not_validated |
| REPOT | 1/0 | 意味/引用は教師一致、本文model_surface_not_validated |
| KNIT | 0/0 | EOSでもJSON不正、INVALID_FORMAT |

受領CANDIDATE_UNREVIEWEDと意味採用は別である。全receipt/意味/本文/実問い・cold-fileは[diagnosis/diagnosis.json](diagnosis/diagnosis.json)。不正rawを補修したり、教師へ置換したり、readerを緩めたりして成功にしていない。

## 全原文・教師・raw・実本文の読解

[旧9読解](reading_reviews/old9.json)と[新6読解](reading_reviews/new6.json)にJSONpath/文字位置/原文対比を残した。raw-only時点の採否nullと、最終consumer overlayを分ける。rootが全15の本文/不成立rawと採否を原典から確認し、低品質のProduct ReadをMashへ戻していない。read-only補助2agentの読解は正式Pro/Ultra/human受入れではない。

- 旧9：初回椅子3と日常3はparsed全体が教師一致。訂正3は内部candidateの言葉を保ったものでも外側引用/版/JSONが崩れた。旧9で自然本文の改善はなく、教師由来の喜び語反復/硬い訂正noteも残る。
- BOOK初回：claim_id欠落、時点object平坦化/numeric参照、引用反復で未閉鎖。回答後は現在の気がかりの二表現を長く反復し、正しい全更新へ到達しない。
- SHOP初回：喜び語が本文へ戻る局所差はあるが、「开店」「うれしかったのにも」、内部説明「理由は未記載です」、原文に不要な「お気をつけてください」が残る。
- SHOP回答後：教師8更新に対しADD1。snapshot参照/未定義claim/範囲外evidence、約束否定と本人知覚の不整合が残り、update_noteへsystem指示の連続280文字が露出した。回答再掲と文法崩れも残る。
- REPOT：「最後まで聞かせた」から「最後まで聞いた」へ一部戻ったが、「叔父に…説明し」の主客反転は残る。意味採用と本人向け本文成立は別。
- KNIT：以前の本文の指示露出がその場所から消えても、JSON構造破損・claim/関係断片の反復・未定義不明参照が残り、成功ではない。

## 実行上限と保全

処理1545.998172秒（25分45.998秒）、表示$0.28/h按分$0.120244。2700秒/$0.21処理上限内。準備/回収/保持/保存/通信/税等を含む請求総額ではない。per-call180秒/15callを守り、timeout/OOM/再試行/追加更新/追加生成0。BOOK2件は時間切れではなく出力token上限だった。CPU診断69.327936秒、新model/SQL0。

新adapter SHA256 `228edccf7db10889b303124785f917f1124f94ce23ac0866d18f37697ed00502`。実30logの順序/row/pass/loss/勾配有限、32F32有限、別保存非学習reload・生成前後不変、旧45779と固定source不変、早期最終の同一重みを確認した。

[重み・全原本archive version1](https://chatgpt.com/library?file_id=libfile_ce78cfb0a1648191a4dbbccd160f0590&account_id=personal)：3,785,637bytes、SHA256 `10132741509c831ead6ea5a22ee747d4164895078322b9f11f87f0dcd1baf03f`。全65payload＋manifest/66memberのbytes/hash、32F32、全15rawのcase/source/adapter/usage/EOSをPod外照合。[final_recovery.json](final_recovery.json)／[recovery_manifest.json](recovery_manifest.json)。元4B全重み/optimizer/RNGは非同梱で、厳密な途中resumeではない。

早期version0は399.491650秒/30更新/生成0の不変記録として[early_run.json](early_run.json)と[early_recovery.json](early_recovery.json)へ残す。生成終了の[run.json](run.json)はRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWの原本のまま保持し、最終閉鎖は[result_summary.json](result_summary.json)/[runtime_checkpoint.json](runtime_checkpoint.json)が所有する。AUTHORIZED_ONCE_BOUNDの旧planを新規起動の許可へ読み替えない。

本一回は終了。次は、長い訂正packet/引用・参照/自然な本文を同時に保持する学習方法を、既存原本に戻って見直す。単に追加回数・token上限・検査緩和へ進まない。今回の基本崩れに新観測会は不要で、新しい有料試行へ自動進行しない。

primary=BLOCKER_NARROWED、商品0/正式0/3/54.50%据置、candidate_ready=false/automatic_progression=false。通常API/DTO/DB/RN/Render/Supabase/本人DB/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。GPUのStop/再起動/削除は行わず、稼働保持と保持料金は継続する。
