# 全10rawの本文確認と判断 — 不採用・閉鎖

root華恋がBOOK/SHOP各S1〜S5の全10rawを全文で読み、全実messages/前段候補、既存19教師、出力token/終了理由、診断原本と照合。read-only補助の独立読取とも一致した。rawの修復・再生成・失敗raw教師化・受信合否の緩和は行っていない。

## 完了した計算と、成立しなかった接続

同19行/messages/encoded/元終端列/mask/完全CEを不変に、現10各2＋旧9各1＝29更新が全て有限loss/gradientで完了。指定順・29 training forward/optimizer step、2load・保存非学習再読、同19行NLL一回を原本確認。新adapter ed298856は112有限F32/3,833,856params。実runnerは初期ad8bから全112tensor変更を記録し、保存後・生成後のbytes不変を確認している。独立binary検査は保存重みの112有限F32とSHAを確認した。

新2件の全5段、計10生成は全てJSONとして完結しEOS到達。今回はcap/時間の打切りではない。しかし最終prose rowは必要な4cell（binds,observation,reception,update_note）に対しBOOK2cell、SHOP1cellで`prose_type`となる。両件は結合・受信の前で停止した。新CMEE採用/保存/cold呼出し0、意味/本人本文0/2・saved/cold0、旧9は新2全成功条件不成立によるNOT_RUN。実CMEEが却下した、旧9自由生成が退行した、商品が完成したとはしない。

## BOOK

S1の17引用は全て元sourceの部分文字列だが、q_awareness_timeが「本は返したのですが…まだ気になっています」という返却後の譲歩文へ、q_returned_concessionが「自分から…連絡しなかったことです」という自己発言/無連絡文へ誤割当されている。引用文字列の正しさと引用名が担う関係scopeの正しさは別である。

S2/S3/S4のJSON値は教師と一致する。S3の7関係は閉じられ、前回の余計な第8関係は出ていない。一方、実messagesはS1の差で既にgold prefixと異なり、後段の同じ参照名が誤ったscopeを指す。従ってS2〜4の教師値一致を意味保持成功へ昇格しない。

S5は203token/EOS。proseはbind rowsと文章配列の2cellで、bindもcr/rr/sectionの形ではない。「友人に謝ってもらえて」は本人が友人へ謝った主体を逆転する。「遅れていた本を返すのを知っていた」も元の経験と異なる。複数の「…残っていますか？」は説明済みなのに問いへ戻し、質問枠外でもある。同じ気掛かりの文を反復し、本人へ返す3本文として成立しない。

## SHOP

S1は16引用。q_answer_joy/q_answer_sadness/q_past_referenceを出していないのに、S2は前二者、S3は後者、S4はq_answer_joy/q_past_referenceを参照する。未宣言引用は計3種類、後段出現2/1/2個。全16文字列自体は元sourceにあるが、全引用/意味の保持にはならない。

S2の否定2行が完全な共有否定文q_extra_9を使い、後半4claimが開店時点を明示する局所差はある。しかしanswer_sadnessのtime kindは教師のWRITTEN_PAST_UNRESOLVED_OCCASIONでなくWRITTEN_PRESENT_IN_PAST_CONTEXTで、未宣言引用も残る。

S3ではq_answer_explains_targetが「開店したと聞いたとき」という時点だけを指し、本人が説明した気持ちの対象scopeを保持していない。S4はadded rolesの対応順/根拠が崩れ、answer_joyに当たる更新でfelt_distanceを追加し、answer_sadnessの追加がなく旧felt_left_behindを追加する等の不整合がある。

S5は221token/EOS。proseがsection/textを内蔵する3bind状の配列1cellであり、必要な3本文cellとur bindsを持たない。日本語は本人の一人称の再掲が中心で、本人へ向けた観測・受け取りではない。update_noteも「離れてしまった理由」へ強め、元の「少し離れてしまったよう」という本人の知覚/程度と気持ちの説明を保たない。

## NLLの境界と結論

token加重NLLは新10が0.0560160420→0.0343684359、旧9が0.0011822046→0.0006581820、全19が0.0137765392→0.0084008139。BOOK S3は0.0118216285→0.0002821228、S5はBOOK0.3382960→0.1880588/SHOP0.4822187→0.3226773。一方SHOP S1は0.00929981→0.01125808、S3は0.00617778→0.03258258と悪化。平均適合改善を全行改善・自由生成の維持・意味/自然本文・商品品質へ換算しない。

この一回は不採用で閉鎖する。全EOSでもS5の本文型と内容が崩れ、初段の引用scope/未宣言参照も残るため、cap延長や今回の平均NLL低下だけで解決済みとはしない。基本課題には既存の正しい教師があり、追加観測会は不要。新ed298856を製品または次の初期値へ自動採用しない。追加学習・再生成・次の有料runは実行しない。通常受信/意味型/API/DB/RN/Render/Supabase/依存/merge/deploy変更0、STRUCTURE_MAP_DELTA_NONE。primary=BLOCKER_NARROWED、商品credit0・正式0/3・54.50％・candidate_ready/automatic_progression=false。
