# 実学習と派生推論の入力・保存encoding照合 — 2026-10-30 JST

同Jupyterへ直接接続し、保存11446641が学習したrehearsal13と後続prior_rows2の派生copy、syntax2bの既存rawをCPUで一回照合した。exit0、内0.08173696300946176秒／外0.12868495809379965秒。今回照合した範囲で新しい決定的不整合は見つからず、自由生成の失敗を直す箇所は未確定。この結果だけでは次の有料試行を選ぶ因果的根拠は得られなかった。

## 確認したこと

| 保存原本の照合 | BOOK | SHOP |
|---|---:|---:|
| 実学習rehearsal13のprompt tokens | 4295 | 4447 |
| 派生prior_rows2の推論prompt tokens | 4152 | 4304 |
| 保存encodingで学習対象となる教師＋EOS tokens | 2148 | 2424 |
| 保存された予定順序内の更新回数 | 2 | 2 |
| 正解claims／updates | 10／7 | 11／8 |
| 既存rawの最初のclaim list件数 | 1 | 12 |
| rawで未完了となった最後のc field | relations | conflicts |

systemとassistant正解教師は両copyで同一、旧9全rowも同一。旧9は予定順序内で各1回、合計13更新。今回の実学習回数は0。正解はp0宣言、role順、claim10列／update7列、完結rootを保持する。保存encodingではprompt labels=-100、教師側labels=input_ids、EOS248046を1個含む。tokenizer・モデルを再実行しておらず、習得・勾配反映・自由生成能力を確認したものではない。

入力差は次の5 owner path群。個々のclaim／quote行を含む変更node数とは別で、全差分pathはalignment.jsonに残す。prior_rows2で意図して行った可逆表記変更であり、新しいserializer不具合とは扱わない。影響が無害とも原因とも確定していない。

- prior_adopted_interpretation.meaning_packet.a
- prior_adopted_interpretation.meaning_packet.q
- prior_adopted_interpretation.meaning_packet.c.claims
- prior_adopted_interpretation.meaning_packet.c.relations
- output_spec.output_types

rawは完全memberだけを読んだ。closer補完、gold値注入、意味・本文の修復は0。BOOKのclaim1件での早期閉鎖とSHOPの任意JSON欄内反復は既に§114で読了しており、今回新発見の原因や改善へ数えない。新2の固定行形式と旧9のquote object形式の混在も因果的証明ではない。過去の正解文脈のteacher-forced診断で構造・EOSがtop1一致しても自由生成は失敗していたため、同じ診断や有料学習の反復を自動追加しない。

## 原本と全file責務

| file | 責務 |
|---|---|
| [read_alignment.py](read_alignment.py) | frozen入力5hash、保存encoding、既存rawを読む一回限りの標準library CPU source。モデル・受領・repair・生成runnerではない |
| [alignment.json](alignment.json) | Jupyterの未修復結果。全5input前後hash、差分、予定順序、保存labels、raw完結member計数、adapter/GPU読取 |
| [execution.json](execution.json) | 実行source commit/hash、外経過、exit0、retry=false |
| [cpu.log](cpu.log)／[cpu.exit](cpu.exit) | 実行原ログ・exit |
| [evidence.json](evidence.json) | 上の結果・execution・log・exitの4payloadをexact UTF-8で保全した回収wrapper |
| [verification.json](verification.json) | 回収全payload・source・画面のbytes/SHA照合範囲と限界 |
| [proof.jpg](proof.jpg) | Jupyter完了表示とGPU保持の実画面 |
| README.md | 結果、責務、判断限界・継続状態 |

実行sourceは27557501c1a544d669e15d7f069facc6a4e3420c、SHA256 1de54c5ccd15f622590ab1d242f376e711d7e5fdcc769b5a908f63b9437dc2ce。GitHub取得bytesを照合後、CUDA_VISIBLE_DEVICES=''、HF/Transformers offline、timeout60秒／kill5秒で一回実行。alignment.jsonは8776bytes、SHA256 4d1d9ea7e91f8d64f0e6801cc9e165454f4cd464a24283650ea65f62415f890c。回収wrapperの全4payloadのbytes/SHAをPod外で照合。Download APIのtimeout後に実file到着を確認し、再download・CPU再実行0。

## 現在地と限界

model load／forward／追加学習／生成／新CMEEは全0。新raw・新receipt・新snapshot・新cold対象は0で、前回の意味／本人本文0/2、不採用閉鎖、旧9の履歴FIT9/9は不変。教師cold成功や過去のreceipt replayを今回のモデル成果へ加算しない。

入力5hashは前後一致、adapter_model SHA114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66。全tensor／全旧frozenの新規全検査は行っていない。GPUはA5000 24564MiB・使用1MiB/0％の読取確認、稼働保持。GPU処理按分0だが保持・準備・回収等は別。管理console/API・Stop/restart/delete0。

現2題には正しい教師があり、追加観測会を要する根拠は今回得られていない。材料一般の十分性や4B能力限界は未確定。新しい有料forward・追加学習・別grammar・生成helperの提案／実行は0。通常ModelCandidateSource／receiver／意味型／三core／API／DTO／DB／RN／Render／Supabase／依存／merge／deployの構造差分0、STRUCTURE_MAP_DELTA_NONE。

primary=ADMINISTRATIVE_ONLY、TECHNICAL_CREDIT=0、PRODUCT_CREDIT=0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。root華恋が単一writer/executor/judge、補助はread-only。実環境Codex Workで、正式Pro／Ultra／human受入れは実施していない。前提00・観測学習README・全file地図01A・最新weekly§115へ同期する。
