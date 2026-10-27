# 回答後の更新義務の具体化 — 未適用候補・Jupyter認証待ち

2026-10-28 JST。状態：**STATIC_CANDIDATE_ONLY_JUPYTER_AUTH_BLOCKED**。

Mashの「4B学習＋CMEE接続を進める」「Jupyterへ直接接続」の指示に基づき、前回の[非学習2件原本](../prior_quote_probe2_result/README.md)、凍結教師、APIの実採用処理を照合した。前回の0/2を成功へ変更しない。今回は候補の保存までで、API製品sourceへの適用、Jupyter内CPU確認、モデル処理は未実施。

## 今回確認した不足と最小の修正候補

教師はBOOK回答後の6 ADD＋gap解消1、SHOP回答後の7 ADD＋gap解消1と、本人へ向けた本文を既に持つ。実rawは両方ADD1だけで、gap解消を欠く。BOOKの末尾3引用には自分の生成したsurfaceが入り、SHOPでは引用配列と意味の参照がずれる。単純な番号の一括補正では解消しない。現不具合の解消に新観測会を求める根拠はない。

`model_candidate_source.py`の既存説明は、1要素のshapeと「追加役割ごとに」の文章で更新全件を要求していた。[候補source](model_candidate_source.py)は、既存contractの追加roleと各roleへ入る新relationを、実際の順に列挙する。BOOKは7更新、SHOPは8更新を明示し、末尾のINVALIDATE_GAPを分ける。[前後指示文](input_preview.json)で具体的な差分を確認できる。

追加role・relation名・順序・必要数は、既存`_model_v3_source_contract`と`_model_v3_packet`（API64c6cb1aのemlis_semantic_admission.py:1115〜1219、1307〜1324）の規則から取る。正解の引用、quote index、claim/relation ID、自然本文を注入しない。既存source/意味採否/引用compiler/独立本文reader/教師/重みは変えない。自由生成rawの後処理・補修も追加しない。

変更は既存private quote形式のV3回答後だけ。`explicit_update_roles=False`を既定にし、quote指定時だけ明示する。旧numeric V3と初回、旧chair/dailyへ指示差を広げない。候補はAPI64c6cb1aのsourceから作成した別copyであり、API PR3の製品source自体は不変。

これは更新不足の因果仮説であり、引用の混入・意味のずれ・本文反復まで直ったと判断していない。同じ30更新を再試行する案は採らない。またlocalized30とadaptive30はともに109cから各15教材2回を学習した別runであり、全試行の更新が順に累積しているとは説明しない。

## 実施済みと未実施

[静的確認結果](static_check.json)は、固定15入力のrole/link metadataと明示されたrole_order/written_link_orderを使い、原sourceと候補のspec関数だけをstdlibで実行比較したもの。構文compile、V3初回4件不変、V3回答後2件のupdates文のみ変更、旧numeric V3の既定spec不変を確認した。旧9は変更対象分岐の外であり、新しい実messages生成やモデル評価9件の成功ではない。

BOOK/SHOPの指示文字数はそれぞれ＋124/＋127文字。**token数ではない。** 実tokenizer、実build_model_messages、全target token不変、context8192内の確認は未実施。前回の同2件は出力枠込み7913/8077であり、その数値を今回の値へ流用しない。最初のローカルpreviewでJSON辞書のsort順を用いた誤りは、明示role_order/written_link_orderへ修正してから保存した。候補sourceの処理は一貫して実contract順で、Pod/modelへの効果はなかった。

候補保存はMashの継続指示内の可逆的準備。実行環境はCodex Work/GPT-6、rootだけがwriter、2補助はread-only。正式な別Pro/Ultraモデルまたは人手の商品受入れと報告しない。新しいGPU試行plan・実行許可は作っていない。前回の消費済みplanを再利用しない。

## Jupyter接続の実際と再開先

Mashの添付画面のPodは`94a06hhxu51uy4`、daily_blue_dragonfly。前回のbkj4qvnhwtdqc2とは別であり、前回の重みやcacheが今回も存在すると仮定しない。Jupyterへ直接到達したが、token/password認証画面だった。安全な認証入力の送信後、実画面は**Invalid credentials**。ログイン成功・Lab/terminal到達・GPU実在・base/cache/adapterの実在やhashは今回未確認。credential値を取得・保存していない。

Jupyter/Runpodの専用連携を検索したが利用可能なものは見つからなかった。Runpod管理console/GPU一覧/管理API、Stop/restart/delete/新Pod/chargeへ迂回していない。Jupyter子process0、GPU load/forward/学習/生成0、pytest0、SQL0、Render/Supabase/本人DB/通常API/DTO/RN/merge/deploy変更0。保持指示は継続するが、現在のGPU稼働や料金を独立確認した意味ではない。

認証復旧後、同Jupyterで既存fileと保存d431の保全先を確認する。別Podのため必要fileがなければ既存GitHub/保全archiveから同一bytesを復元し、既存依存の適合を確認する。CPUで実15入力を再構成し、候補が同2件のupdates指示以外を変えないこと、教師全target不変、実tokenizerで8192内を確認する。超過時に切捨て・出力cap縮小・別modelへ自動変更しない。

その結果から、追加学習なし・同保存重みのBOOK/SHOP回答後各1生成の一回案を、現在のPodの実条件・時間・費用とともに具体化する。現時点では新しい有料一回の判断を求めず、認証復旧とCPU確認を先に完了する。得られたrawは同じ未変更CMEEで採否、本文、全更新を確認し、採用snapshotがある場合だけ既存cold-file確認へ渡す。通常有効化・一般化・商品受入れへ拡大しない。

STRUCTURE_MAP_DELTA_NONE（未適用の入力指示候補。商品責務/型/wire/reader/通常経路不変）。商品0、正式0/3、管理54.50％、candidate_ready=false、automatic_progression=false。認証待ちを技術成功・学習効果・実装完了へ数えない。
