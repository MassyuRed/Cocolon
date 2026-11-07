# 実forward／lossと新raw分岐点のCPU確認

2026-10-30 JST。CPU確認後のSHOP二経路比較は承認受領し、一回完了・閉鎖しました。**現在の実結果・全数値原本・file地図は[result_20261030/README.md](result_20261030/README.md)。** 以下のCPU原本と当初案は§118時点の経緯を保持します。前回新2の意味/本文0/2、旧9 NOT_RUNは不変です。

## 確認した現物と結果

current Cocolonは85daf93b2cf378323a9db1f36b8c3a5a69be84dc。全機能原本、作業ルールと恒久incident、全体設計／全file分冊のrouting、三core／CMEE map、最新weekly§117と実source／保存原本を照合しました。巨大な歴史map／weekly全体の読了とは扱いません。System Contextは最新cache未生成の既存状態を保持し、fresh原本の直接読取を使用。新索引／checker／依存は作っていません。

同Jupyterからinstalled transformers5.19.0の実sourceを回収しました。modeling_qwen3_5.pyは88051bytes／SHAaac2a1bcca88829afc6dbdf83f97155ebf64d800ee9d703af3802a9aebcfcd18、loss_utils.pyは8540bytes／SHA83db16b24ce5c3a0642097624aa9a0ae7eb72445c41d8b4d5059a129862fdbbeです。

実helper run_pilot.py:176–199はpromptを保持し、最初の教師tokenの直前からtail logitsとlabelsを対応させます。installed modelの1724–1729／1869–1876はhidden statesのtailをlm_head前に切り、loss_utils.py:61–64は一tokenだけshiftします。有効な対はfull／tailとも `logit[p−1:n−1] → label[p:n]` で同じです。保存・再読込ownerも全adapter値／112F32／学習可否を検査しています。**この範囲に決定的な添字ずれ、旧重みの誤読込、学習modeのままの推論は見つかりませんでした。** 実4Bの数値同値やcache正常性を証明した意味ではありません。同じ合成loss比較を追加していません。

[既存syntax2b](../syntax2b.py)（SHA28e78eb120f07aef0806ddb1159e8257fb83e4972515eed63ec48b33cf205dc5）のbyte／型／列parserを変更せず、新7fcca3ceの保存rawに一回の成功CPU読取を実施しました。入力・重み・rawの原本ownerは[continuation17実結果](../../continuation17/result_20261030/README.md)、完全重み保存IDはlibfile_9514b319e18881918ed8a8b963a4fa51です。成功回は7.903162448秒、CUDA未初期化。元教師2は旧syntax2b確認時と同一なので、その既存教師対照を再利用し、新しいCMEE成功へ加算していません。

| 対象 | 教師との最初のtoken差 | 最初に型・列構造から外れるtoken | その直前の全入力長 |
|---|---:|---:|---:|
| BOOK | 283：`_extra`に対して`_remaining` | 520：time行を4列で閉じず、余分なcellへ進むtoken | 4815 |
| SHOP | 292：`_extra`に対して`_no` | 473：q行のstringを置く位置へ入る`[[` | 4920 |

**位置は全て0始まりです。** 最初の逐語差は引用ID名の一部であり、それ自体を意味誤りとしません。型・列構造違反も、一般JSON parserの最初の拒否位置とは別です。SHOPの裸`@s0`より前に、この固定列parserは拒否しています。モデル出力の修復、closer追加、教師値の補完は0です。

rootはPod外で保存encodedのprompt／教師token列と実rawから全4prefixの長さ・全token列hash、最初の逐語分岐、最初の不適合token境界を独立照合しました。原本ZIPは31713bytes、8member／7payload、SHA118a44284fefdc6d2a31612984ab391c45d78fb559c08957a072db250f4619d3、全CRC/member/bytes/SHA一致です。

## 既存token診断との違いと判断限界

10/27のtoken_diagnostic_resultは保存109c3dda、旧quote形式、15教材各一回の**use_cache=False**な教師文脈forwardです。BOOK／SHOP回答後の3178／3561targetで最初のtop1不一致656／744を測定し、自由生成との最初の分岐tokenが新6中5件一致したという履歴を持ちます。今回の新7fcca3ce・固定列2146／2422本文tokenとは重み・入力／教師形式・位置が異なります。旧診断は同一prefixをcacheあり／なしで直接比べていませんが、過去にも自由生成失敗が非cache側の選択と一致した事実を無視しません。

平均CE低下と自由生成失敗だけをcache不具合の証拠にしません。今回のCPU確認だけでは原因・修正箇所は確定していません。旧syntax2bを新重みへ付け直す有料再生成も、型適合prefixのままfield誤配・反復した旧実結果から、改善の根拠が弱いと判断しました。追加学習量・新grammar・受理緩和は提案しません。

read-only補助は、有料一回の必要性への根拠はなお弱いという慎重な意見です。rootも実装bugがあるとは判断していません。その留保を保持した上で、次の学習／生成を選ぶ前に、**現重みの同じ失敗直前prefixで、計算経路の違いが選択を変えるかだけを一題で区別する**下記の小さい案を選びました。未実測であることを、GPU実行の自動許可へ変換しません。

## §118時点の一回案（§119で承認後実行・閉鎖）：SHOPの同一prefixだけを比較

目的は、保存7fcca3ce・SHOPの同じ全入力に対する一括計算と実generateの逐次cache計算を、292／473の二地点だけで比較することです。新たな回答や意味候補を作る試行ではありません。

- 同Pod／A5000、非学習1load。保存rawの先頭474tokenだけを実generateのprocessorでそのまま選ばせます。元rawにないtoken／EOSを足さず、返るtoken列は保存raw[:474]と全一致が必須です。
- 292／473のtokenを選ぶ直前のcached logitsを記録し、max_new_tokens=474で通常終了。generate／PEFT／decode最適化contextを抜けた後、同じprefixをinstalled準備処理で全入力・cacheなしで各一回計算します。referenceをdecode callback内へネストしません。
- **474 cached＋2 uncached＝最大476 core forward、generate API一回、固定prefix再生一回、自由生成0、学習0、新CMEE0。** 全476成立はまだ未検証です。
- 各地点の全F32 logit vector、観測tokenのrank、top5／margin、最大／平均差、実forward件数を保存します。syntax地点へ教師の同位置tokenを正解として押し付けません。
- **最大180秒（3分）／GPU処理按分$0.014**。履歴$0.28/h、live単価再照会なし。親170秒＋kill10秒、内部180秒。準備・回収・保持・保存・通信・税等は別です。
- BF16の小差や僅差argmax反転だけでbug判定しません。両経路が同じ不適合tokenを選べば、その地点の失敗をcache原因とはできません。一題・二地点の一致を全4B／全生成の正常性へ一般化しません。
- 成功またはtimeout／identity・非有限値・件数・callback不一致等で一回閉じ、全logit／途中reportを回収します。追加学習・自由生成・修復・retry・次の有料試行へ自動進行しません。

`run_cache_prefix_shop.py`はこの一回だけの既存生成経路の計測runnerです。構文compileと未承認拒否をCodex hostで確認しました。実4Bを読む前にexit1で止まり、出力directoryは作りません。read-onlyの最終source reviewで具体的なblocking flawは見つかりませんでした。そこで残った上限停止の実装依存は、実DeferredStopCheckのinitがmax_lengthを保持し、callがlength>=max_lengthで即座にstoppingを返す原本をrootが追加確認し、source/identityを2148bytesのZIPへ回収・CRC/SHA照合しました。これは実GPU成立を保証するものではありません。当初planはPROPOSED_NOT_APPROVEDでした。a79f2525の個別承認原本から一回実行済みで、親`plan.json`は閉鎖状態です。実行時planはresult/runtimeへ保存しています。

## 全fileの地図・失敗履歴

| file | 責務 |
|---|---|
| README.md | 実確認、未確認、旧診断との差、未承認一回案と全file地図 |
| prefix_points.json | 成功CPU原本：全2caseの実token位置／prefix長／全token列hash／parser状態、成功回7.903秒とモデル0 |
| cpu_command.sh | 成功CPU確認に実際に使用した一回限りのsource。旧syntax2bを変更しない |
| execution.json | source回収scope、GPU保持読取、CPU準備2失敗とJSON download通知timeoutの区別 |
| cpu_originals.zip | installed model／loss sourceとmanifest、prefix原本、CPU command、実generation準備／sample source、executionの全7payload＋manifest |
| deferred_stop_originals.zip | 実DeferredStopCheck classとgeneration/utils.pyのidentity。通常max length停止のsource確認、2member／2148bytes |
| verification.json | 全ZIP CRC/bytes/hash、Pod外保存encodingからの全4prefix照合、compile／未承認拒否の実範囲 |
| run_cache_prefix_shop.py | 提案する非学習1load／同prefix2地点・最大476forwardだけの計測。GPU未実行 |
| plan.json | 個別承認と一回完了を保持した閉鎖plan。再実行不可 |
| approval_guard.log | Codex hostの未承認exit1原log。実GPU失敗ではない |
| proof.jpg | 実JupyterのCPU結果とGPU保持画面 |

CPU準備では、local materialized sourceへ余分な最終LFが付いた照合値を使って最初のassertで停止し、次にtokenizerのdefault BatchEncodingをlistへ加算して停止しました。いずれも結果file未作成／4B処理0です。原本と同じhashと実helperと同じreturn_dict=False指定へ訂正後の成功を、失敗履歴と分けて保存しました。成功回7.903秒を全準備総時間とは呼びません。JSON単独downloadのイベントはtimeoutしたため、その通知と完全ZIPの実到着・照合を区別します。

GPUはJupyterのread-only確認でRTX A5000／1MiB／0％、稼働保持。管理console/API／Stop/restart/delete0。初期・新重み・教材・受領条件・通常ModelCandidateSource／三core／API／DB／RN／Render／Supabase／依存／merge／deploy変更0、STRUCTURE_MAP_DELTA_NONE。現2題の追加観測会は不要、一般教材十分性は未確定です。

primary=BLOCKER_NARROWEDは最初の不適合位置の局所化のみ。TECHNICAL_CREDIT=0、PRODUCT_CREDIT=0、正式0/3、54.50％、candidate_ready=false、automatic_progression=false。root華恋が単一writer／executor／judge、補助read-only、実環境Codex Work、正式Pro／Ultra／human受入れは未実施です。
