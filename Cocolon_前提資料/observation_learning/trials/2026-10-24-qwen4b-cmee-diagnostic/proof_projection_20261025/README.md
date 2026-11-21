# 証明metadataを除いた同保存4Bの実推論

source d6f8febd8f90e2f60df2936aa7c0d270b3afa7ab / API32dc3b3137ddc0a4401d2d1d045123f7da17683a。保存済み06ca6381…LoRAを非学習reloadし、初回／保存prior付き訂正後FIT各1を生成した。176.212555秒、更新/optimizer0、32tensor有限・trainable0、旧adapter3hash不変。

| 場面 | 入力token | 出力token | 形式/CMEE |
|---|---:|---:|---|
| 初回 | 1409（旧3094） | 1307・stop | 重複キー消失、JSON成功。ただし引用文は原文どおりだが、終端29/20が実欄長27/19を超えINVALID_EVIDENCE。意味/本文不採用 |
| 訂正後 | 3526（旧6114） | 2048・length | pretty JSONで打切り、TOKEN_LIMIT。意味/本文不採用 |

CMEE意味/本文0/2。実messages/identity各2/2一致、原raw無補修。初回はcore欠落、kindとabout_timeの混同、3claimへの結合、理由方向・unknown対象の不正、原文復唱のreceptionも残る。訂正後は無効化すべきsoloを現claimへ残す断片が見られるが、途中断片を完成した理解や本文へ昇格しない。入力短縮・構文改善を商品採用へ換算せず、観測会は今回不要。

rootの保存先誤読により、推論前にadapter_three_files_requiredで3回起動失敗した。途中の補正コマンドにも引用符エラーがあり、誤ったscriptが再起動された。いずれもモデルロード/生成/学習前、モデル呼出し0。最初の失敗記録は同名の診断出力で上書きされており、残る2失敗JSONを保存した。実在するadapterフォルダと3fileを一覧照合して補正し、実生成は2件のみ行った。失敗を隠したり、モデル推論失敗3件へ加算したりしない。

Downloadの待機ツールはtimeoutしたがファイルは到着し、再Download0。raw/report/script/plan/残る失敗JSONのsize/hashと実入力・保存重みidentityをPod外照合した。推論logだけはread_textによるCR正規化があり、原bytes一致とは扱わずinference_log_normalized.txtへ区別した。全対応はintegrity.json。秘密値・本人DBは含まない。

API source/test2file、packのmessages/hash/CPU結果を同期。backend65/pack13成功。最初のpytest収集は既存venvのfastapi不足で失敗し、pure対象2fileを--noconftestで実行した。全suite/SQL/実機の成功ではない。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT（投影/接続の因果修復）、商品credit0/正式0/3/54.50％据置。追加学習は次の明示した32update一回で、旧runの再実行ではない。GPU停止/再起動/削除/新Pod/チャージ0、保持指示を継続。
