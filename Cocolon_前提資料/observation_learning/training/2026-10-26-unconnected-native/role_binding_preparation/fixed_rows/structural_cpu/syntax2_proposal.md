> **2026-10-30現在：** この提案はMashが「進めていいよ。」と明示承認した。e22f1101で実装しCPUを一回実行したが、追加token12個のbyte対応不足でexit1。CPU不成立時終了の条件に従いGPU未実行で閉鎖。[実結果](cpu_stop_20261030/README.md)／[後続の承認済み修正案・実結果への入口](added_tokens_proposal.md)。以下はd3ece5f2の承認前提案本文の履歴で、「未承認・未実装」は当時の状態。

# 構文制約つき2生成 — 具体提案、未承認・未実装

日付：2026-10-30 JST。status=PROPOSED_NOT_APPROVED。新しい生成方式の提案であり、閉鎖済みprior_rows2の再起動・承認流用ではない。

## 目的と判断

現在の未完了は、BOOK/SHOPの本人回答後に4B自身が意味・更新・本人向け本文を一つの候補として作り、既存CMEEが採用・同一保存再読できること。学習の目的はMashの観測技術の継承で、構文成功だけで達成とはしない。

前回は両TOKEN_LIMITだが、正解教師はEOS込み2148/2424tokenで、既存cap3712/3584内に収まる。今回CPUではc先頭の階層誤りをBOOK805字/SHOP1086字までに確認し、後半に26/129回の反復を確認した。正解の必要長だけでは説明できない。prior表示や短い説明の再調整・出力cap増加・同じloss配分の反復は推奨しない。

推奨は、既存fixed_rowsのJSON構文・列数・型だけを生成時に制約し、構文支援下で意味・更新・本人向け本文を自律生成できるか、追加学習なしの同じ2入力で確認する一回。構文だけで引用、主体、知覚、更新割当、参照宣言、自然さや文字列内の反復が直る保証はない。これは一般観測品質・未知評価・商品受入れではない。

## 承認を求める範囲

Rule18 §11.3の「new method family / contract / acceptance / quality condition / Safety / privacy / public boundary」のうちnew method familyに該当する。現行の継続指示はCPUの保存raw比較として使用し、新方式の実装・有料生成へ自動拡大しない。

承認対象は、下記の限定CPU実装・検証と、全条件成立時だけの1load/0更新/2生成・既存CMEE確認・採用snapshotだけの別process保存再読。CPU不成立時はGPUを実行せず終了する。この具体範囲の承認後は、scopeを変えない内部実装詳細やsource確定だけを理由に再承認を要求しない。範囲を変える必要が生じた場合だけ止める。

## 方式と不変条件

生成時に、既存Transformers 5.19.0のgenerateに渡すprefix_allowed_tokens_fnまたは同じ既存LogitsProcessorのtoken maskを使う。現在の標準generate・greedy・temperature・モデルforward・EOSの仕組みを置換しない。新しい外部依存・grammar package・外部serviceは追加しない。現Podにxgrammar/llguidance/outlinesはmetadata上存在しないため、それらの導入は範囲外。

grammarはAPI7acff074のfixed_rows_reference_wire.pyのFIELDSと既存型検査だけから定義する。生成時コードはteacher、期待全文、case ID別の値、material内のrole_order/正解引用/claim数/更新数を正解の制約として読まない。teacherと保存rawはCPU試験の入力としてだけ扱い、grammarやtoken候補へ混入させない。

| 要素 | 制約するもの | モデルが決めるもの |
|---|---|---|
| root/c/claim/time等 | JSONの括弧・区切り、既存列数、既存scalar/list型 | 全文字列値・明示参照名・意味軸・引用・本人本文 |
| a/q/claims/relations/updates | listと各行の既存型/列数 | 行数、ID、引用、ADD/GAP等の値、対象・割当・順序 |
| prose/bind | prose4列、bind3又は4列、既存型 | 全本文、cr/rr/ur、section文字列、bind件数 |
| question/entity/任意list | 既存decoderの許容JSON値/list | nullか他の値か、空か非空か、内容 |

rootは外側5列（FIELDS.rootはvalue[1:]用4列）。c9/claim10/time4/mode2/polarity3/pred2/subject3/relation8/update7/prose4、q4/alias2、bind3又は4。型が任意のセルをteacherに合わせてnull・空配列へ固定しない。enumの正解、引用の正解、gap IDや更新件数を外から供給しない。rootのversion/schema文字列も生成結果を既存receiverが検査する。grammarによる意味値の補完・改名・再採番・不足列paddingはしない。

promptはprior_rows2/eval_inputs11.jsonの先頭2件と完全同一。SHOPに含まれる他題材説明も今回は変更せず、生成時構文制約だけの差として比較する。既知の指示汚染を直した効果と混同しない。元11教師/旧9/全prior/元材料/型/receiver/検査閾値は不変。

保存114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66と固定base851bf6e8を非学習loadする。不採用重みを商品採用へ変えず、元f493へ戻した別試行にもすり替えない。

## CPU実装・検証と実行順

新sourceはこのdirectoryのsyntax2.py（構文状態/byte token mask/CPU試験）とrun_syntax2.py（既存非学習runnerの限定派生）の最大2file。新API module/receiver/永続運用機構は作らない。

1. fresh GitHub/API/prompt/adapterを確認し、上の仕様と実装の差がないことをrootが確認。単一writer/executorはroot華恋、補助はread-only。
2. 実tokenizerと既存decode挙動に対し、token byte列、suffix開始境界、Unicode/escape/\u、複数JSON記号入りtoken、特殊token/EOSを照合。単独tokenのdecodeが置換文字になる結果をそのまま文法判定へ使わない。値の自動修復0。
3. 両正解教師の全token prefixで、元のnext tokenが許可されることを確認。完全root前のEOS拒否・終了後のEOS許可、root後の非空追加JSON拒否を確認。teacherの丸暗記whitelistは禁止。
4. teacher外の異なるID/文字列/意味値/任意list長、bind3/4、question/entityの非null、任意listの非空を、既存decoderの型範囲なら通す。構文適合でも意味が誤る変異を既存CMEEが拒否することを確認する。意味条件をmaskが肩代わりしない。
5. 今回のraw実token列に沿い、最初に許容型/階層を逸脱するtokenを特定し拒否することを確認。閉じ記号を足して成立へ修復しない。
6. 構築時間、全prefix replay時間、平均/p95/最大mask時間、メモリを測る。構築60秒、CPU一式300秒以内。既存SHOP154秒と180秒上限の余裕約26秒を踏まえ、cap×実測平均maskが各20秒以内の見込みを満たすこと。これを完走保証としない。tokenごとの全vocab再decodeや別基盤の追加が必要なら中止する。
7. CPU全成立・source/prompt/重み不変確認後だけ新root/lockで一回起動。旧run/lockは使わない。run状態と実際のload/call数を保存する。
8. 生成raw/token IDs/finish/EOS/adapter/時刻/処理秒をそのまま保存。既存fixed_rowsのreceiver→CMEEへ渡し、実receipt/replay、意味・本人本文を確認。採用snapshotだけ別processで保存再読し全outcomeを比較する。rawと復元named textを交換しない。
9. rootが全2rawと成立した全本人本文を読み、全引用/意味軸/7又は8更新/参照/本人向け日本語を原材料へ照合。syntax成功だけでは合格にしない。結果・原本・費用・重み不変を回収しGitHub/private既存保存先へ必要範囲で保存して一回を閉じる。

この提案段階では、grammar実装・token-mask成功・速度・実4B改善を実測済みとはしない。新方式source自体はまだ存在しない。

## 実行上限・費用・停止

- 既存Pod vgkm402msgroiu/RTX A5000、Jupyterへ直接接続。管理console/API、新GPU契約、Stop/restart/deleteは0。GPUはMashの停止指示まで保持。
- 非学習1load、forwardは生成だけ、0更新、BOOK/SHOP各1生成の計2call。旧9再生成0。履歴FIT9/9を新実測の分母へ加算しない。
- context8192、caps3712/3584、各180秒、全process590秒＋kill10秒で最大600秒。新cap/期限延長、追加call、同runのrepair/retry/fallback、後続run自動開始は0。
- GPU処理按分最大$0.047。前回同Pod表示$0.28/hに基づく600/3600×0.28=$0.0466667の丸め上限。今回live単価再照会なし。CPU準備/回収/保持/保存/通信/税等は別。
- mask空・byte照合不成立・source/入力/重み不一致・OOM・非有限logits・各/全期限でabort。JSON自動補修、教師値の注入、無制約generateへの切戻しはしない。上限内完走保証なし。
- 意味/本人本文/coldが2/2でも限定既知FITのみ。旧9・通常service・本人端末・他core・未知一般化は未確認のまま。商品0/正式0/3/54.50％、candidate_ready=false、automatic_progression=false。

## 他案との比較・今回の決定待ち

説明句だけの小修正：汚染源候補は確認できるが、先頭階層不正・未宣言参照・更新割当を解消する根拠が弱く、有料追加は推奨しない。
上限増加：正解全文は既存cap内で、反復が観測済みのため推奨しない。
同lossの追加学習／正解prefix：実施済み系列と重なる。履歴の不採用を再開しない。
生成時構文制約：意味の成功保証は弱いが、既存契約を弱めず、構文の誤生成を分けた自律意味/本文の限定診断になるため、この一案だけを提案する。

Transformersの公式generate資料に当該拡張点があることは確認した。ただしmainの資料であり、現installed5.19.0の実接続成功の代用にしない。CPU段階で現installed source/呼出しを照合する。
参考：https://huggingface.co/docs/transformers/main_classes/text_generation

read-only補助は設計候補のレビューだけ。正式Pro/Ultra/human評価は未実施。STRUCTURE_MAP_DELTA_NONE（現実装・通常経路を変えていない）。primaryは今回CPU診断のBLOCKER_NARROWEDで、新methodの採用/承認/creditは未成立。
