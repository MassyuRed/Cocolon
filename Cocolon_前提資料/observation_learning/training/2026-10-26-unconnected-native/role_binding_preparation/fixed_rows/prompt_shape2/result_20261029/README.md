# 指示表記修正後の非学習2生成 — 0/2・不採用で一回終了

Mashがfcdfd211具体案へ「進めていいよ」と明示承認。bd2ad852でplan status/approvalだけを同期し、root華恋がJupyterへ直接接続して一回実行した。runnerは承認前のblob b56bb29aと同一。CPU教師2/旧9の一致と、実モデルの未達を分ける。

## 実結果

| ケース | prompt | 生成token | EOS | 秒 | CMEE受領／意味・本文 |
|---|---:|---:|---|---:|---|
| BOOK回答後 | 4295 | 3712（cap） | なし | 162.31713635707274 | TOKEN_LIMIT→REJECT、0/1 |
| SHOP回答後 | 4447 | 3584（cap） | なし | 154.53084394498728 | TOKEN_LIMIT→REJECT、0/1 |

非学習1load・学習forward/update0・2生成。処理327.6659622420557秒（約5分28秒）、前回同Pod表示$0.28/hによる按分$0.02548513039660433。最大600秒/$0.047以内。live単価再照会なし。親外CMEE CPU1.9397111010039225秒、準備/回収/保持/保存/通信/税等は別。各生成180秒以内、timeoutなし、GPU/CMEE/既存CPUの終了codeは全0。

実receiverは両TOKEN_LIMIT、実意味入口はREJECT/semantic_receipt_not_validated。意味/本人本文0/2、採用snapshot0・cold対象0。元raw/format/finish/model/base/adapter/usage/elapsedによるreceipt replayは両件一致。本人向け本文は形成されていない。[cmee_diagnosis.json](cmee_diagnosis.json)と[summary.json](summary.json)へ記録。

## rootによる全2rawの読解

両JSONLのraw_textを先頭から末尾までrootが読んだ。出力の書換え・自動修復・切出し・旧形式fallbackは0。

- BOOKはformatに続くvへ、本来のnamed候補版ではなくcocolon.cmee.internal_preparation.v1を出した。alias部分を文字列として開き、@p0,a0から連番の反復が続いて上限に到達。意味候補・全更新・proseには届いていない。
- SHOPはvはnamed候補版だが、alias相当を文字列化し、q相当もobject列を含む文字列として始めた。@p0（prior snapshot）を引用sourceへ、shared_talk（意味名）をfieldへ使い、同じ開店・未来の引用を繰り返す。共同準備/約束の否定文を肯定的な短い断片へ切っている箇所も見えるが、実意味として採用されたのではない。
- これらは未完rawの静的所見。実際の拒否はfinish優先のTOKEN_LIMITであり、後段意味検査がこの引用・version不備を個別にUNSUPPORTED判定したとは報告しない。根拠付きの意味・自然な本人本文の評価段階へ到達していない。

前回同じf493・同capのbefore2も両cap未完・意味/本文0/2であり、今回のroot/subject表記2点だけの修正では全文成立は増えなかった。rawは変わったが成功ではない。未学習の固定列形式、既習named/quoteとの混在、教示量/構造のどれがどの程度の原因かは今回だけで確定しない。4B全般の能力限界や新しい観測教材不足を証明した結果でもない。

同じ説明文の小修正だけの有料試行は追加しない。次は、今回反復するalias/qと既習形式の差を踏まえ、形式切替の教え方と旧成功を保つ学習範囲をCPUで検討する。現2題の追加観測会は今は不要。新しいGPU/学習条件/再試行を実行せず、今回の一回を閉じる。

## 元重み・入力・回収

元f4932d3a2bac1d8e78d0bf86579868e29546914512234d31556840eb28a85c19は推論前後不変。112F32/3,833,856parameter全finite、loaded表の名前/shape/dtypeを照合した。全172frozen、CPU3cc1ff07d6aba5f1013fedc2f284efe1317ba9b0144fb02a671c6c9417848b1f、eval c302b2617e8d9a6895fe7fa5ff12e8da31778404f91dd316facda2d7869008a8は一致。新重み0。前回f811は不採用のまま。旧9は今回再生成0であり、元f493の過去7/9やf811の6/9を今回結果へ付け替えない。

全原本ZIP cocolon-shape2-originals-20261029.zip は59721291bytes、SHA256 f23346c5aaf362017e58930cb0c23029f0d9906293a755595f2ba5d11408bc33、204payload＋manifest=205member。Jupyter作成時と回収後にCRC/全長さ/SHA一致を確認し保管済み。[external_verification.json](external_verification.json)。run/raw2/token IDs/metadata/loaded112、承認source/launch/plan、CPU入力・全encoded/mask・教師saved/cold、全frozen sourceと既存adapter、比較before2を含む。base重みやoptimizer/RNGは含まず、完全な単独モデル・厳密学習再開archiveではない。

raw run.jsonのRAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWは当時の原本として保持。回収後判定はsummaryのCLOSED_NOT_ADOPTED_NO_RETRYへ記録し、current planも同statusへ閉じて再実行を拒否する。承認時planはbd2ad852と回収source内に不変保持する。

primary outcome=BLOCKER_NARROWED、実モデル候補不採用、商品0/正式0/3/54.50％・candidate_ready=false・automatic_progression=false。実行source/API/受領/意味型/通常ModelCandidateSource/公開API/DB/RN/Render/Supabase・新依存・新GPU契約・merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE。retryなし、GPU保持、Stop/restart/delete/管理API0。
