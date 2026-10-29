# suffix2 全文・意味・本人本文の読取 — 2026-10-29 JST

現在：全文2の静的読取済み、全11生成・実CMEE・冷再読の終了結果待ち。本fileは最終結果ではない。

## 同じ条件の比較

起点f493、同base851bf6e8・同helper/依存/元評価prompt・context8192・greedy・旧capの全文2＋旧9。前回の正解prefix条件付き4callとは条件が違うため比較率へ混ぜない。今回のbefore11はf493で測定済みであり、より古いafaaのbefore欠測と混同しない。

元全文teacherのinput_idsは不変、BOOK601/SHOP711tokenだけへsuffix CEを置いた2更新。学習時は正解上流を受けるが、評価時は意味から自分で全文を作る。loss0.218359798/0.320283741は更新直前の教師条件値であり、学習後の改善率や自由生成成功率ではない。共有重みが変わるため上流保存の保証はない。

## 全文2の原raw・全更新・本文

| 対象 | before→after | 原文で確認した未成立 |
|---|---|---|
| BOOK | 2770/EOS/JSON不正→1886/EOS/duplicate_json_key | 旧4claimとno_contactが全欠落し後退。引用fieldがanswer_text_privateからno_contact/returned等の意味名へ変化。time.expr重複・分類名混入、counterfactual modeがASSERTEDへ後退。6ADD＋GAPの件数だけは一致するが、returned_concession単独やrelation-only ADDが残り、proseはbindsのみで本文3欄がない |
| SHOP | 3391/EOS/JSON不正→3140/EOS/strict JSON成立 | prose階層と本人宛て表現は局所改善。ただし引用表と全updates配列はbeforeと文字列完全同一。7ADDはfelt_distance累積replaceのままでshared_talk/no_joint_preparation/no_promiseのADDがない。time.exprがnull→文字列"null"に8claimで後退、answer_sadnessの明示時点が消え、answer_concession relation欠落なのにReceptionが参照 |

BOOKは両runとも意味・本文が完成せず、単に短くなったことを改善としない。SHOPは「共同準備/約束をしていない」という否定自体と、友人側で現実になったという本人の知覚は本文へ残るが、短い語りかけになったことと全意味保持を区別する。Observation.crは祝いmessage等を含む全11claimをbindする一方、本文ではそれらを全て表現していない。update_noteは寂しさを述べながらanswer_sadnessをcrへ束縛せず、Reception.rrのanswer_concessionは未定義。Receptionは喜び/寂しさの近い言い換え中心であり、完成した人間的受け取りとして採用しない。

rootと独立read-only補助が元2教師・before/after全4raw、全claim/軸/更新/参照/本人本文を確認。無効JSON深部は静的読取であり、実CMEEの拒否理由とは分ける。raw補修・括弧追加・式の修復・採用reader緩和なし。

## 次の方向（未実行）

純suffix-onlyの追加反復/時間延長を次案にしない。元全文2教師の正の全文CEを保ち、その上で更新〜末尾へ重点を置く候補をCPUで具体化する。過去localized30/adaptive30やnamed方式の既存実結果との差、起点、重点量、更新量、全文/旧9の比較条件を先に確認する。同じ閉鎖run・枠は再利用せず、新GPUを自動開始しない。この2更新だけでmaskが後退の唯一原因と断定したり、一般4B能力不足と判定したりしない。

現2題の正しい教師は既にあり、この欠陥修正のための新観測会は不要。一般化用の独立未知評価、Piece/Analysisの完成教師不足は別残件。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。
