# 8更新後の原出力6件 — 全文読解

2026-10-29 JST。root華恋が6原raw、本人source/回答、既存教師、実run/CMEE診断を読んだ。独立補助はB2件と全文SHOPをread-onlyで確認。実環境はGPT-6 Codex Work、正式Pro/Ultra/human受入れではない。JSON補修・意味補完・追加生成・reader緩和0。

8更新・別保存・112F32の非学習reload・固定6生成を755.144773秒で完了。保存afaa2c2e、元2dfd不変。以下の静的所見を、実CMEEが未到達の意味検査の拒否理由へ読み替えない。補助Bは正解Aを与えた条件付きで、独立した全文能力の評価ではない。

## 補助4件

| 課題 | token | EOS | strict JSON | literal教師一致 | 読解 |
|---|---:|---|---|---|---|
| A BOOK | 2181 | 有 | 可 | 不一致 | 10claimの主なrole文字列は戻る。16quote名中returned_concessionが重複、relation根拠が単一claim断片へ縮退。counterfactualのmodeがtime内へ入り、claim自身はASSERTEDのまま |
| B BOOK | 625 | 有 | 可 | 不一致 | 11→6ADD＋GAPへ改善、単独relation ADDと長い参照反復は解消。ただしstatement_concessionをlate_awarenessへ、returned_concessionをreturnedへ付ける等の誤り。説明relationは更新から欠落するのに本文bindでは参照 |
| A SHOP | 2349 | 有 | 不可 | 判定なし | claimのcid/ev/kind等をtimeへ入れ、重複keyを出す。time.exprは文字列null。7relationでもrid重複・shared_talkへ根拠集中・説明自己辺が残る |
| B SHOP | 800 | 有 | 可 | 不一致 | 12→9ADD＋GAPへ改善するが正解7ADDにならない。distance_link/answer_concessionを単独ADD、past_referenceと説明relationの更新欠落。GAP根拠とur全件対応は改善 |

前の非学習4件と比べEOS2→4/4・strict1→3/4、literal0/4は同じ。literal一致は意味採用のGateにしていない。補助4件は部分射影なのでCMEE採用へ提出していない。

B BOOKのObservationは一人称回答の再掲で、旧4意味をbindしながら新回答内容を語る。update_noteは「連絡しなかったこと」を「自己の遅れへの気づき」へ変え、気掛かりの対象を保てない。B SHOPは語りかけへ戻るが喜びが落ち、本人の知覚を「理解」「現実」へ強める。「具体的に一緒に準備をしていたわけでも、約束していたわけでも」を「一緒に準備も約束もなかった」へ広げる。update_noteはObservationの完全重複。形式の前進を本人向け応答の成立へ換算しない。

## 元全文BOOK

3712tokenで上限、EOSなし、本文未到達。実receiver TOKEN_LIMIT、意味更新REJECT/semantic_receipt_not_validated、意味/本文0、snapshot0。cold対象なし。

閉じたq配列を原文のまま静的に読むと15名/一意15、実source欄への一意な引用位置は14/15。returned_qは「本は返した」を原入力memo_actionへ置くが、そこには返却遅延と謝罪しかなく、返した事実は本人回答の方にある。引用名の一意性だけではsource帰属は正しくならない。

late_awarenessは「遅くなると分かった」ではなく「伝えておけばよかったな」へ変わり、counterfactualと混同。remaining_concernのclaimが無いままrelationで参照する一方、returned_concession/statement_concession/awareness_time/concern_contentという関係や時点のroleを余分なclaimへ複製する。continuing_concern.time.evが配列でなく説明quote名の文字列になる。relationの件数/端点の一部は戻るが、全接続作用域を示す根拠がclaim断片に縮む。

updatesは既存の原入力意味まで再ADDし、関係/時点をclaimとして追加した後、先頭のADD列を反復する。$idでなく同じuid missing_explanation_1を繰り返し、GAP後も終わらず再ADDへ戻る。全文7更新と本人向け3本文を完成できない。今回の実拒否はTOKEN_LIMITであり、これら静的な契約/意味不備を実意味検査の到達結果とは扱わない。

## 元全文SHOP

3367token/EOSあり・strict JSON完結、実receiver INVALID_FORMAT、意味更新REJECT/semantic_receipt_not_validated、意味/本文0、snapshot0/cold対象なし。元の上限未完結は解消したが採用は成立しない。

15quoteすべてのfがshared_talk/joy等のrole名になり、実sourceのmemo/memo_action/answer_text_privateを指さないため位置一致0/15。shared_talk_quoteは本人回答の語句を@s0へ誤帰属。全11claimのtimeへ契約外source_role_timeを追加し、time.ev3件を文字列へ変える。未変更named decoderを静的に再読した最初のエラーはunknown_candidate_key:source_role_time。これは原rawを変えずに行った構文検査で、実consumerの一般INVALID_FORMATを特別な意味判定へ置き換えない。

11claim/6relationのIDと6relation端点は教師に対応する局所改善。一方、felt_distance.timeを@s0/過去の頃へ誤配し、perceived_realization.time.exprには時点でなく知覚の内容を入れる。7ADD＋GAPへ到達してもshared_talk/no_joint_preparationを重複ADDし、旧felt_left_behindまで再ADDする。past_referenceをshared_talkへ付け、answer_concession/distance_link/answer_explains_targetはreplaceへ入らず、add_allへclaimを束ねる。本文urは8件中add_answer_concessionを欠く。

本文へ祝い・喜び・寂しさ・準備/約束の否定は戻る。しかし「気がした」「ようで」「と感じた」を落とし、「少し置いていかれた」「未来が現実になっていた」「離れてしまった」へ事実化する。Receptionは同じ未来を反復し、update_noteはReception完全同文。Observationはperceived_realizationを語るがcrに無く、Receptionはfelt_distanceを語るがcrに無く、update_noteは準備/約束の否定を語るが両crに無い。本文の自然さと根拠対応の双方が残件。

## 判断と再開先

今回一回は閉鎖・消費済み。新重みafaa2c2eは未採用、旧2dfd/284f/d431と過去全候補を保持。元15/評価/補助4教師/指示/API/reader不変、旧9回帰は今回未検証。通常有効化・本番/SQL/Render/Supabase/RN変更・GPU停止等0。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false、STRUCTURE_MAP_DELTA_NONE。

現2件には元の出所付き完成教師と中間教師があり、追加観測会は不要。補助だけ2周する単位では中間課題の閉鎖改善が全文のrole/field/時点/更新/本文へ移らなかった。次候補は、既存補助A/Bと元全文の責務対応を結ぶ学習設計へ見直し、旧anchor保持と旧9回帰も同時に確認すること。追加の補助周回や上限延長を自動開始しない。新しい学習量・順序・評価範囲は未固定であり、この結果を成功扱いして次runへ移らない。

保存物はresult_summary.json/external_verification.json/external_manifest.json。重み込み原本18,305,028bytes・323payload＋manifestを全CRC/hash/size、112F32/3,833,856parameterの形状・有限性・全112変化、6rawのhash/tokenと途中回収4rawの不変までPod外照合。Library libfile_4df0fff22010819189901162df474e4f version0へ保全。処理按分$0.058733482（A5000表示$0.28/h、準備/CPU/回収/継続保持/保存/通信/税等別）。実CMEE CPU1.862758秒、事前CPU12.855981秒は学習/生成時間に合算しない。
