# AR-01 — 本人宛の既存教師回収と36件候補の準備

2026-11-09 JST。**準備・独立確認まで。新学習・新生成・新SQL再生は0。** 外部アップロードが自動承認審査で拒否され、候補はRunpodへ未送信。前回の不採用や通常品質未達を変更しない。

## 回収と今回の仮説

前回残した人物・語り手の混同に対し、旧36架空教師を全件確認した。target内の明示的な「あなた」は0件だった。本人の行為は6件が「ご自身」、1件が主語省略で、旧targetは意味上正しい。誤教師の訂正とは呼ばない。

T10／S02A・B／S05A・B／D03A・Bの7targetだけ、書き手を返答相手として明示する表現へ変更する仮説を作った。原36source・metadata・SYSTEM/user messages・source参照は不変、残29targetも不変。全生成へ二人称や全事実再掲を義務化せず、正しい短い返答も保持対象とする。

S06A/Bの原因不明／明記理由、T09/T12の明記された感情時点、D05A/Bの知った時点／出来事時点等を保持する。14件への絞込み案も検討したが、二人称集中と他の保持範囲の縮小を避け、36件保持の一候補にした。14件案は未実行・比較結果なし。

全36sourceは前回conditioning6の二欄原文と文字通り重複しない。一方、S02A/Bは診断V01/V02の意味近傍で、T03/D03B/D05Aは前回ICLで提示済み。未知一般化とは扱わない。明記された感情時点と選択metadataだけを同一出来事で統制する既存対照は見つからず、感情結合の全境界を教材化済みとはしない。評価6source・24生成本文・判断は教師へ移していない。

## 一回の候補と検証済み範囲

| 項目 | 凍結した準備内容 |
|---|---|
| 初期値 | 既存研究db3242 adapter。weight SHA256 db3242c035fa06d538861c3285ff68345ff77629dbe40741351d22266a483f42、config a60d908d2cc636d18f2bdc5d22ce6330bf0211a90e6847d7288f7d362dcd2f83。通常採用重みではない |
| 学習 | 既存assistant-only SFT、36件各1回／36更新、LR1e-5、新optimizer。元44の順序からV8を除外。新方式・同一候補の追加周回なし |
| 実行上限 | 学習90秒／trial300秒、最大34生成、1応答23秒・2048token、未完了で中止・retry0。既存2load／112tensor保存非学習reloadを継承 |
| 比較 | 旧before34本文を再生成せず固定。診断8＋既使用development評価26、全34のid/group/messages/source参照が旧before34と一致。診断V8は今回の学習対象から除外 |
| 比較の限界 | 元dbとの差は36更新候補全体の効果。旧44との差にはV8除外も含み、代名詞だけの因果効果を主張できない |
| 実装差分 | private既存trainerの36件適合、prepare、結果回収。wrapperは子script名のみ変更。normal prompt・本文作者・保存責務・公開API不変 |
| 独立確認 | 原36source不変、target exact7、残29不変、assistant target整合、V8学習外、eval26不変、before34全参照一致、3Python構文有効。実tokenizer CPU preflightは未実行 |
| 実環境の読取 | 既存PodのPID24179、元server source f95fc7ce13ce197916b753b7cebb3946243225a0139d40e528908d62e27b2371、health200。実GPUはRTX4000 Ada Generation／20475MiB、使用9756MiB。記憶上のA5000へ置換しない |
| 実行実績 | 新GPU更新0／新生成0／新model load0／停止・復元0／SQL再生0。旧before34は再利用予定原本で、今回の新生成数に含めない |

同じ既存pause/restore ownerにより、実行時だけ元serverのargv／env／cwdをメモリ内で保ち、source・Analysis重みを照合して同じ通常提供へ復元する計画。まだ停止や復元を実施した事実はない。実請求単価・保持料金は今回未再照会。

## 現在のblockerと保存物

送信予定はコード4本＋架空7表現差分のZIP、17,074bytes、SHA256 `2eed5fa59a68b4dd67cceff2f968cccf2cdeea18bd3c5dfec787ef2f06dafb9b`。ZIP全5memberを読んで実ユーザー入力・認証値・生成結果・重みを含まないことを確認したが、同一アップロードの再審査でも「送信先・payloadのユーザーによる明示承認が必要」と拒否された。送信は未成立。別手段で同じpayloadを渡す回避は行わない。

宛先はMash指定の既存Pod f1lle4xwq3wjlnのJupyter、展開先は `/workspace/ar01f-addressee36-20261109`。次に必要な判断は、この具体的ZIPを同Podへ送信する承認。学習成果の承認や新規GPUレンタル承認と混同しない。

privateに候補コード・旧教材由来・修正7target・準備pack・旧before34・独立reviewを保存。SQL runnerも現c655のprovider／既存serviceへ26評価だけ再投入する準備までで、新rawがないため実行しない。

## 次の同一作業

送信承認後、同ZIPを一回送信し、prepareと実tokenizer CPU preflightを確認してから既存wrapperで一候補を実行する。実出力34件を原sourceと全件照合し、人物／語り手の修復と否定・認識・感情時点・理由・短い自然文の保持を別に読む。候補の26評価だけ既存provider＋隔離SQLへ渡し、本文不変・非生成GETと拒否時の非保存を確認する。実結果・重みはPod外へ回収する。

今回API source・Render・Supabase・RN・build・通常提供変更0。**STRUCTURE_MAP_DELTA_NONE**：研究用教師表現と一候補準備だけで、新owner・型・wire・保存責務はない。既存e14の構造追加は継承する。AR-01・AR-02〜08・全資産活用・通常意味品質・本人端末／正式受入れは未完了。
