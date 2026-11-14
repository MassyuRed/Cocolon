# 保存raw構造照合・構文制約方式の現在地

**2026-10-30最新：** [実学習と派生推論の入力・保存encodingのCPU照合](alignment_cpu/README.md)を同Jupyterで一回完了（0.081736963秒/exit0、model処理0）。教師token＋EOSは保存encoding上で対象に含まれ、旧9全row同一、意図した5 owner path群の差を確認。今回範囲で新しい決定的不整合は見つからず、自由生成の失敗を直す箇所は未確定。追加有料試行を選ぶ因果的根拠なし。§114の[構文支援2生成](syntax2b_result_20261030/README.md)は両TOKEN_LIMIT・意味/本人本文0/2・不採用閉鎖を保持。新学習/生成/CMEE0、GPU保持、商品credit0。旧syntax2の[CPU停止](cpu_stop_20261030/README.md)は履歴として不変。

## 以下は先行§112の保存raw比較記録

2026-10-30 JST。同Jupyterへ直接接続し、compare_saved.pyをGitHub64c1111eから取得・SHA照合後、既存4原本をCPUで読取比較した。0.011652405秒、exit0。モデルload/forward/追加学習/生成/CMEE実行/重み変更は0。前回の意味・本人本文0/2と不採用閉鎖は不変。

| 確認 | BOOK | SHOP |
|---|---|---|
| c先頭の完全member | 3cellのtime断片 | 3cellのtime断片 |
| その確認可能位置（Unicode文字offset、0-based end） | 805 | 1086 |
| 正解c[0] | 10cellのclaim行×10 | 10cellのclaim行×11 |
| 宣言されず参照されたalias（raw文字列走査） | @p0/@p1 | @p0 |
| 後半の反復 | 同じ観測文26回 | explanation change129回 |
| BOOK用英語句 | raw0回 | raw1回、SHOP自身のprose_requirementsに逐語一致 |

これは最初の意味誤りの位置を証明したものではない。標準JSONDecoderで未修復raw中の完全memberだけを読み、未完了箇所を修復・採用していない。SHOPは最初のroot配列が15memberで早く閉じ、その後に余分なdataがある。BOOKは未閉鎖。実CMEE拒否は引き続きfinish優先TOKEN_LIMITで、上の静的欠陥を後段意味検査の実測拒否へ書き換えない。

正解教師は以前の実tokenizerでEOS込み2148/2424token、現caps3712/3584以内。単純な必要長不足と同義ではない。SHOPのBOOK句は現在入力のspec内にもあるため、別caseの学習記憶が原因とは断定できない。階層不正、引用・参照、更新割当、自然な本人本文は別々に残る。

## 原本・確認範囲

- [compare_saved.py](compare_saved.py)：一回限りの保存raw読取計数。receiver/repair/grammar/model runnerではない。
- [result.json](result.json)：Jupyterの未修復CPU結果4240bytes。SHA256 6d070d501e19544d03c323b3f1aded994b81d61db27cdcd6894787ff9205b418。
- [verification.json](verification.json)：GitHub原本と全4input hash・全case結果が一致、回収同一性。ローカルCPUの秒数/installed package差は比較対象外。
- [jupyter_proof.jpg](jupyter_proof.jpg)：実CPU結果、追加生成0、A5000保持の画面。
- [syntax2_proposal.md](syntax2_proposal.md)：§112時点の未承認提案本文を保持。Mash承認後のCPU停止は§113/上段の結果を参照。

Download APIはtimeoutを返したが、実fileの到着を確認した。再download/CPU再実行0。回収原本の4hashと全case値を、GitHubから取得した無変更原本に対するrootローカル読取結果と一致照合した。

GPUはNVIDIA RTX A5000/24564MiB/使用1MiB/0％を実確認し稼働保持。transformers5.19.0/tokenizers0.23.3/torch2.8.0+cu128はmetadataのみ確認。grammar系3packageは未導入。追加のGPU処理按分0だが保持料金等は別。live単価照会/管理console/API/Stop/restart/delete0。

全体設計と全file地図の今回対象、三core/current maps、全機能00全文、最新weekly§111、学習意図・規則・恒久incident・System Context入口/PR37のblocked状態を確認。生成cacheは成功扱いせずfresh原本直接読取。API7acff074の既存fixed_rows受領sourceは読取のみ。通常ModelCandidateSource/receiver/型/API/DTO/DB/RN/Render/Supabase/依存/merge/deployは変更0、STRUCTURE_MAP_DELTA_NONE。

開始単位は本人回答後の意味・本人本文0/2を妨げる早期構造不正と指示コピーのCPU切分け、分類OBSERVED_BLOCKER_MINIMAL_FIX/LEVEL1読取診断。source書込みと原本計数はroot華恋一人、補助はread-only。実環境GPT-6 Codex Workで、正式Pro/Ultra/human受入れは称さない。今回primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。現2題の追加観測会は不要。学習材料の一般十分性や4B能力限界は未確定。

同じ指示文小修正の有料反復を止め、実行方式の変更はRule18のnew method familyとして別判断に置く。構文を支えれば意味と本人本文まで成立するかは未検証で、これが次の単一提案。
