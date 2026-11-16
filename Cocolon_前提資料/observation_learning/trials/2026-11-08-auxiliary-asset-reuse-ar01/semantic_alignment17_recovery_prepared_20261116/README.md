# Analysis既存依存参照の修復（11/16・未送付／未実行）

A5一回は提供停止前のCPU preflightで停止した。既存作者の原入力を再構成する`prepare_semantic_map`が`analysis_cumulative_service`をimportし、`fastapi.HTTPException`を要求したが、A5 launcherは既存`client-runtime-deps`を参照していなかった。私の起動処理の漏れであり、教材・EOS・モデル品質の失敗ではない。17教師のremote HF列/EOS/mask照合も未完で、過去のlocal非生成結果とは分ける。

原ZIP3entry/1657byte/SHA39792077…47b2cとログ・receiptを回収し、CRC/全byte/metadataを独立照合。モデル生成・学習・提供停止・再試行0、元PID131491/start235250260/health200・120u重み不変、A5 launcher終了、execution/baseline/fit/after無し、B5 root無し。A5起動一回は消費済みで巻き戻さず、B5も前提不成立のまま起動しない。旧4file/原本/教材/driverは無変更で保持。

修正版は次の**新2ファイル・46,542byte**。新しい明示承認前に送付・起動しない。教材/driverの再送なし、同Podの既存ファイルをSHA照合して再利用する。

- `semantic_alignment17_recovery_once.py`：A6、12,236byte。既存client依存408file/tree07c2ac87…e1b41を確認して、preflight/baseline/train/after共通で参照する。推論高速部品はbaseline/afterだけで、学習環境へ追加しない。提供停止前に元環境とclient参照環境でML6moduleの実import元とversionをCPUで各30秒以内に照合し、既存driverのHF列等のfull preflightへ進む。新しい環境の構成は未実行で、import確認済みと主張しない。
- `full12_sql_alignment17_recovery_once.py`：B6、34,306byte。B5から新A6/B6 rootのlocatorだけを変更し、全関数/埋込driver/意味条件/13回上限/原SQL源泉/元提供復元は維持。

A6は失敗A5の無生成ログと元状態を確認した上で、専用新root`/workspace/semantic-alignment17-recovery-20261116-once`を一回だけ使う。17教材を最大34更新、未学習前2＋候補後5の最大7応答、学習600秒・生成累積900秒・作業1620秒・復元込み1800秒。新CPU確認も同じ全体枠に含み、上限や失敗は未完として停止・復元する。既存120uからfresh optimizer、追加retryなし。

候補後5応答を原文/raw/図/本文/unknownまで独立全文照合し、適切な場合だけB6で新12LEAF+MERGE最大13応答、復元込み1020秒・一回。実行先は`/workspace/full12-sql-alignment17-recovery-20261116-once`。B6全13rawの独立照合後に、適切な同じ最終rawを一回SQL保存→別process非生成再読→通常native/model identity/map・IF境界/自然・Piece profile/API・worker整合まで進めて該当単位を閉じる。旧B5やfailed A5 rootを流用する実行ではない。

既存client依存は同Podにあり、新規install/downloadは不要。既存認証情報/起動環境は同Pod内認証と元状態復元だけに使う。`next_action_scope.json`にexact2file/hash/bytesと未実行状態、`preparation_verification.json`に2Python compile/B6関数・driver維持/locatorとhash照合、`independent_preparation_review.json`に独立確認を保存。通常API/worker24bc228d双方Live・DB38migration/最新20261115011424をfresh read-only確認し、本人記録読取/設定変更0。worker900・selector/研究重み未採用・配布保留、本単位/補助全体/正式受入れ未完を維持する。
