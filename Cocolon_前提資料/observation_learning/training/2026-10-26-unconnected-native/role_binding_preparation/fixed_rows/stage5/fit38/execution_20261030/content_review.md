# fit38の全8実出力・本文確認 — 2026-10-30 JST

root華恋がBOOK3出力とSHOP5出力を全文読んだ。BOOKはJupyter表示と回収原本SHA、SHOPは回収原本を確認し、補助の独立した静的読取と一致した。全8messages/records/raw、35引用のsource/field/literal位置、train19の同一性も照合した。これはCodex Work上のroot内容確認であり、正式Pro/Ultra/human Product Readの代替ではない。

| 実出力 | 確認した内容 |
| --- | --- |
| BOOK S1 | 教師JSON値と完全一致。17引用と3alias/採用済prior参照が揃い、引用は原文に全て存在 |
| BOOK S2 | 教師JSON値と完全一致。10claim、全claim10cell、subjectは正しいstringのOMITTED |
| BOOK S3 | EOSで終わったがstrict JSON不正。schemaの前でrootが閉じExtra data（line1 column1128）。教師7関係に対し8番目のtemporal行を余分に出し、returned_concession IDを再使用。S4/S5未実行 |
| SHOP S1 | 教師JSON値と完全一致。18引用、前回欠落した完全否定q_extra_8と開店時点q_extra_11を保持、全引用原文一致 |
| SHOP S2 | 全11subjectの型は修正されたが、否定2行のevは完全否定q_extra_8から部分句へ変化。perceived_realization/answer_joy/felt_distance/answer_sadnessの時点exprを落とし、answer_joyの時制も変更 |
| SHOP S3 | 教師JSON値と完全一致 |
| SHOP S4 | 8更新の順序/ID/targetは保つが、更新4のpast_reference/対応ev、更新6のanswer_explains_target、更新7のanswer_concession/distance_link/対応evを落とす |
| SHOP S5 | 日本語observation/reception/update_noteとbindではなくADD/update行を反復し壊れた文字列へ混入。512token・length・EOS未到達。末尾の打切りだけでなく、先頭付近で既にstrict JSON不正 |

全8件で実messagesは同じbuilderと自分の実前段だけから再構築した値に一致。BOOK S1/S2/S3、SHOP S1/S2は学習時gold前段promptそのものと完全一致している。したがってBOOK S3の初破綻とSHOP S2の意味差は、悪い実前段だけでは説明できない。SHOP S3/S4/S5にはgold前段との差があり、その影響と教師条件fitを区別する。

3時点の同19行測定では、新10区間のtoken加重NLLは0.0968247931→0.0860945479→0.0560160420。S5はBOOK0.576638→0.508039→0.338296、SHOP0.757854→0.692507→0.482219へ下がった。一方BOOK S3は0.003879→0.001145→0.011822、旧9加重値は0.001086→0.000843→0.001182と最終に悪化もある。低い平均NLLが一回の自由生成の厳密な構造・意味・本人本文を保証するわけではなく、今回も未成立だった。旧9の実生成維持は未確認。

両件とも5段候補の完成条件前で失敗したため、13path結合・新CMEE receipt/意味採用・保存/coldへの新呼出しは0。CMEEが実際に却下した結果とは表現しない。新意味/本人本文0/2、saved/cold0、旧9は条件不成立によるNOT_RUN。raw修復/補完/上限延長/追加epoch/再生成/receiver再呼出し0。

両S1の完全引用とBOOK S2は局所的に改善した。残件はBOOK関係の終端、SHOP否定/時間scopeと更新根拠、最終段の構造と自然な本人向け本文。単に教材や観測会が足りないとの根拠はなく、現2題の正しい教師は既存。今回の結果だけから4Bの能力上限や38更新の最適性も決めない。新ad8b重みは失敗した隔離実験の保存物であり、製品/次の初期値へ自動採用しない。
