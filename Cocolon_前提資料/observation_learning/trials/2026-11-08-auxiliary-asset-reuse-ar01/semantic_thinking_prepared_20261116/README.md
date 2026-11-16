# 11/16 A7・条件付きB7 — 内部整理モードの有限比較（未実行）

A6は完了・不採用、B6は意味条件不成立で未実行。既存作者の複数出来事の状態・場所統合から継続します。送付・GPU・学習・SQL・通常反映は今回0です。今回の4ファイル129,859byteは未送付で、新しい明示承認前に起動しません。

A7は同じA6候補weights2f33/config09ac・原文・messages・schema/parserを使い、同じ作者の1応答内で自然な内部整理の終了後に最終JSONを生成します。思考最大2048と最終JSON4096を別に数え、総context32768内、各応答300秒、全作業1620秒・元提供復元込み1800秒。A6の応答上限210秒とは異なるため、速度・全条件同一の比較とは呼びません。新学習・新モデル・追加注意文・正答注入・再生成・rawの意味修補はありません。

候補後5件の全文意味照合がrootと独立担当で適切な場合だけ、B7の新規12LEAF＋MERGE最大13応答・復元込み1020秒を1回行います。既存840秒pipeline／各210秒は維持し、全13完了は保証しません。全12最終原文照合が適切なら、同じrawを既存SQLへ一回保存し、別processの非生成再読へ進みます。A7／B7の機械成功や保存一致を商品品質へ換算しません。

| 新送付物 | byte | SHA-256 |
|---|---:|---|
| `semantic_thinking_candidate.py` | 68977 | `4aefaa7a4e08d0c391938f6106f82dfc77e5a5d2fae2deb33dd222cae177159f` |
| `semantic_thinking_once.py` | 16987 | `880399e982ca15539f7772a9b8b5d2c236fa96f2ccfd8e08f34dcf91169b498b` |
| `full12_sql_thinking_once.py` | 35240 | `60b9e7ba69e7e0682f16f44bb6491e7c2985c701190178a85c68c17685536afd` |
| `semantic_thinking_plan.json` | 8655 | `da060a0c2750c2f614caee88c8007002b3aa26c171933a6d9a3a10fb3b53c93f` |

送付先は既存Pod `f1lle4xwq3wjln` の `/workspace/`。送付済み教材・学習コード・既存重みは再送しません。A7は`/workspace/semantic_thinking_once.py`、条件付きB7は`/workspace/full12_sql_thinking_once.py`を、それぞれ一回だけ起動します。旧A6／B6を再起動・転用しません。新root・元PID/start/args/env/cwd/source/weights、既存client tree、tokenizerとsourceの不一致は提供停止前に拒否します。起動環境・既存認証情報は同Pod内だけで保持・復元し、外部へ出しません。

過去にもthinkingは実測済みです。旧120uの無制限整理はT01が210.044秒で最終文なし。強制512終了の3件は全stopでも形式1/3で不採用でした。今回も仮説であり、原文・重み保持、自然終端なしの未生成、A6の5件完結とU01/U02改善の保持を確認対象にします。T01は学習済み保持例で、未見の一般化成功率には数えません。

CPU15検査は固定tokenizerとpin817f LMFEを使う合成token再生です。HF model.generate／forward・重みload・GPU・実意味品質は未検証。`preparation_verification.json`は実source5件の再導出・A6 messages一致を確認し、実HF tokenizer preflightはPod提供停止前に別途行います。検証codeをローカルworkspace rootから実行し、`concrete/`・`api/`・回収tokenizer・既存LMFE依存を使用します。

B7は既存wireのFalse／最終4096と、隔離native実効True／2048＋4096を別に記録します。wire計測と実効計測を混同せず、どちらも32768内へ照合します。これは通常接続整合ではありません。通常採用前にはmode・model alias・wire上限とMap専用選択を整合し、IF120uと自然／Piece baseへ波及させない必要があります。

取得前source7hash・plan75daa8・checkpoint801ba068・inputbdb872a5・guard/as_of、既存同raw finalizerは不変。今回API tracked source・DB・RN・Render・通常Pod設定・build／TestFlight／本人実機変更0。本単位／補助全体／正式受入れは未完です。STRUCTURE_MAP_DELTA_NONE（隔離候補のみ）。
