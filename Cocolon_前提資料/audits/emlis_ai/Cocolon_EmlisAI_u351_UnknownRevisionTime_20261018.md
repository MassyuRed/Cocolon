# EmlisAI u351 — 本人の不明を現在の感情へ訂正するときの時点修復

記録日：2026-10-18。担当：華恋。必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK。primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。

## 判断と範囲

Mashの「全体設計図・全ファイル地図・最新weeklyを確認し、EmlisAIの残件を進める」という指示を受け、作業姿勢規則、全体01・分割地図01A/B/C、three-core/current structure、CMEE詳細設計、最新2026-10-17週報とu350監査を照合した。全repositoryの全byteを今回読み直したという報告ではない。System Contextの生成更新は今回の前提作業にしない。

u350が明記した「unknown自身のREVISEで『その時に今は嬉しい』となる」残件を、既存Q1/Q3契約の時点束縛の不備としてLEVEL2で修復する。初回source資格、質問／回答文法、u350の同時保持条件を拡張しない。完全引用の旧側は訂正対象の特定にだけ使い、新側に既に受理されている現在時点を元出来事へ帰属させない、という既存詳細設計の責務へ戻す。

対象はcurrent_inputのSELF uncertaintyから、既存更新ownerが受理済みの有限感情への明示訂正だけ。「今は／現在は」と既存の区切りを認め、感情部が既存_FEELINGの完全一致で過去形でない場合、ANSWER_TIME・回答envelope・その回答の時点根拠へ束縛する。内容のsource範囲は引用内の感情部分を正確に指す。「今も／現在も」の「も」を捨てないため、今回の修復から除外し旧解釈を保つ。

既存production ownerは `emlis_answer_update.py` 一つ。公開API、DTO、DB、RN、型・schema、private logical87、別ownerへの経路は変えない。STRUCTURE_MAP_DELTA_NONE（既存owner内部の時点修復。新test／fixtureと変更責務は01Aへ登録）。一般の受領反応の訂正、他時点・他主体・未受理置換、任意多段へ一般化しない。

## 原文と実際の本文

公開合成入力：

> 友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。何が不安なのか、私にもまだわからない。

実初回の発行済み質問へ、一回答として次を渡した。

> 「何が不安なのか、私にもまだわからない」ではなく「今は嬉しい」です。

u350のObservation：

> 「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
> その時の気持ちとして、「今は嬉しい」が見えます。

u350のReception：

> これまで、その時に今は嬉しいという気持ちを受け止めています。

u351のObservation：

> 「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。 「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
> 回答した時点の気持ちとして、「嬉しい」が見えます。

u351のReception：

> 回答した時点で嬉しいという気持ちを受け止めています。

Q1/Q3の「私にも／自分でも」肯定4例でこの時点修復を確認する。更新後の問いは従来どおりEND／no_bound_personal_meaning_targetで、自動継続しない。ここで消える不明は本人が訂正した対象であり、u350のpair＋別経験＋不明の同時保持資格は失効したまま。この一文を、残る全経験への深い受け取りが完成した証拠にはしない。

「現在は嬉しくない／今は嬉しくない」の4例は、present・negative・ANSWER_TIMEへ意味の時点を直すが、本文は引き続きUNAVAILABLE／emlis_refined_body_unavailable。肯定本文の成功へ加算しない。静的確認では、unknown自身変更でu350資格を失った後、負形と元pairの共有3対象がgeneric MATERIAL_WEIGHTとなり、pair専用の局所内容に一致しない。下位例外までの実行証明ではないため、これを唯一の確定原因とは断定しない。今回の時点修復に便乗して保持条件を拡張しない。

## 旧版と保存の扱い

新規pendingは現行解釈を使う。保存checkpointが現行の再導出結果に一致しないときだけ、同じoriginal-plan候補についてpre-u351の時点解釈を完全再導出し、checkpointの厳密一致を要求する。旧IDを新意味へ貼り替えない。別IDは拒否する。完成済みの旧本文はserviceの既存GET/start経路から非再生成で返す。

独立比較原本はAPI先端 `2b3a83e2a25445967412e7569332ea308df031ef`、tree `3e0e67f49bc5915e9e69fe113e8d7d3d606a6a7b` の変更前source。主24例は編集前process、追加4例は独立した未変更worktreeから採取した。双方の更新owner SHA-256は `b63a7ecbdf51041ec85f85e7970f5569efcb2a75c4d584dfd652eb3d9961b10d`。主capture SHA-256=`39ecc21ffc37e1d652ab027b183e40e61097ede396205751ee6e26bd0cfefb6d`、追加capture SHA-256=`f6a7f1cf7dc7c939d75b08c09e4708459a8f5642ecb2dd554f5f3a2a04253d10`。

fixtureには28recordの初回質問・終了判定・状態・理由・可視本文、checkpoint／original-plan／accepted／updated-plan／selected／全artifactのcanonical digestを保持する。現行出力を旧期待値にしない。旧u349 fixtureも変更しない。既存u350現行testのunknown_revise二例だけは、今回変えるObservation時点行とReceptionの新期待を明記し、その他fieldの照合と歴史checkpointの完全一致を維持する。

## 実行結果と限界

最終対象は **77 passed／0 failed／skip 0（分割・再実行の重複除外）**。新engine検査65＋既存u349／現行unknown REVISE・WITHDRAW8＋実service／SQL4。65の内訳は旧u350全record28、対象外の現行全record20、現行時点・極性8、独立readerの時点／否定改変拒否4、無関係checkpoint拒否1、区切りと「も」の保持4。旧版はu350の28とu349の4、計32recordを全解釈／本文／停止まで比較した。UNAVAILABLE維持の4例は、検査成功であって本文提供の成功ではない。

実SQL4ケースはfree／premium×現行／u350完成本文を直列実行。隔離PGlite 0.5.8上で実migration／RPC／serviceを使い、保存された元記録と完成本文、GET/startの非再生成、一回答後の問い終了を確認した。完成済み旧本文の再読であり、本文未完成のSQL中断再開や任意多段は今回確認していない。HTTP/RPC境界の差し替えを除き保存処理を辞書mockで代用しない。

同じ8保存DTO（各caseの初回と更新後）を、現行apiClient→emlisThreadApi→useEmlisThread→EmlisThreadModalへ通し、各2回のclose/reopenで本文・問い・状態・元記録・履歴の一致と閉じた後の消去を確認した。HTTP／Auth／runtime flag／native viewはstub。本人実機、公開server、本番DB、配置の検証ではない。

今回のSQL実時刻のINITIALは5.394〜6.638秒、REFINEDは0.254〜0.315秒。30秒attempt期限・時計・service／SQLは変更していない。この限定例の低負荷観測であり、u350の並行高負荷競合3件を解決した証拠でも本番性能保証でもない。

runtimeはprimary Python 3.12.14／Pydantic 2.14.0、既存pytest 8.4.1、Node v24.19.0と既存React/Babel/PGlite依存を使用。新しい依存の取得・installは0。通常conftestのcollectは、今回対象外のFB172移行pluginがFastAPIを要求し、未導入で停止した。対象moduleに必要な既存pathだけを指定し、`--noconftest`の限定実行を行った。FB172、全backend suite、route/authの検証成功とは扱わない。

失敗履歴は消さない。初回engine runは53 pass／8 failで、test側が存在しない `AnswerTemporalBindingV1.evidence_refs` を参照していた。正しい `time_expression_evidence_refs` と更新のevidenceの等値へ修正した。次の20対象runは16 pass／4 failで、Q1の保存ref追加により意図的に変わるrequest-controlも丸ごと同一と要求したtest不備だった。checkpoint・original-plan・accepted・updated-planの解釈同一を検証するよう直し、対象8再実行は8 pass。後者の16成功と重なる4を二重計上せず、53＋16＋8−4＋SQL4=77とした。両失敗のためproductionの判定や旧fixtureを緩めていない。

実行対象は `test_cmee_emlis_unknown_revision_time.py` 全65、既存 `test_cmee_emlis_relief_received.py` のunknown_revise／unknown_withdraw8、`test_cmee_emlis_unknown_revision_delivery.py` 全4。UIは8件の同一保存DTOを対象とする。全suite成功、formal Product Read、深い理解の完成へ数を転用しない。

## 初回理解・問いの次の残件

代表例を修復後の実engineで再生成した（Q3_PREMIUM、公開合成例。合格件数へ加算しない）。

原文：

> 友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。褒められたのに、嬉しくなかった。期待されているように感じて、重かった。何が不安なのか、私にもまだわからない。

未加工Observation：

> 「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
> 「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
> 「期待されているように感じて、重かった」と「何が不安なのか、私にもまだわからない」が、同じ入力の中で一つの流れになっています。

未加工Reception：

> ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。

状態はLIMITED／FINAL、質問なし、decision=END／no_bound_personal_meaning_target。本人の受け取り方を既に述べているため質問の終了は妥当だが、Receptionは安堵pairだけで、受領経験・期待と重さ・独立不明を受け取れていない。Observationにも後半二項を『一つの流れ』に束ねる定型性が残る。初回一体単位は未完成である。

本人が既に書いた受け取り方を再質問するのではなく、その意味と重さを初回本文へ残す必要がある。次の単位は、本人の受け取り方がある混在初回から、必要な既存一更新・訂正／撤回・旧互換・保存再表示までを一体で具体化する。追加素材はu350の有限資格外なので、内容・選択契約の拡張が必要なら差分案を明示する。u350承認済み範囲を未承認へ戻すこととは区別する。

## 全変更fileの地図

今回はAPI6file、Cocolon5file、計11file。

| repository | path | 責務 |
|---|---|---|
| mashos-api | `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | 既受理unknown訂正の現在時点とsource範囲、保存済み旧時点解釈の厳密再導出 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_revision_time.py` | 旧28record全体、非対象20record、現行時点・極性、source・独立本文読解、別checkpoint拒否 |
| mashos-api | `ai/tests/test_cmee_emlis_unknown_revision_delivery.py` | 実service／SQLで新旧完成本文を保存し、非再生成GET/startと同一DTOを確認 |
| mashos-api | `ai/tests/fixtures/cmee_emlis_u350_unknown_revision_time_v1.json` | 独立u350比較原本28record |
| mashos-api | `ai/tests/test_cmee_emlis_relief_received.py` | 現行unknown訂正の意図した本文差分だけを同期。旧fixture・歴史比較は保持 |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 現在地・実測・残件の引継ぎ |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u351_UnknownRevisionTime_20261018.md` | 本記録。原文、本文、互換、検証境界、全path |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | owner内部修復と新test／fixtureの地図 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 実装順序・検証・次作業の同期 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週報の継続差分 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 最新差分 |

全体01・01B/C・Emlis/CMEE current map・05の構造／型に差分はないため重複追記しない。Piece/Analysisの主枠53.25％、10/20方式判断・10/31管理線・12/18公開目標は再評価しない。一般入力、任意多段、否定訂正の本文、過去不明混在、定型性・深い理解、E04〜E09、本人実機は未完。Draft PR3／PR30へ反映し、merge／deployは行わない。
