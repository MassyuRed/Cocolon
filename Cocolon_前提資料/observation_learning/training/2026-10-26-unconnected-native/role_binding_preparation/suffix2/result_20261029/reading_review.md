# suffix2 全文・意味・本人本文の読取 — 2026-10-29 JST

最終：2更新/2load/11EOS、全文意味/本人本文0/2、旧9は7→4/9へ後退、成立4のcold全outcome同値。新45a101ecは不採用、一回は閉鎖。

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

## 実CMEE採否と旧9の退行

BOOKはREJECT/semantic_receipt_not_validated、SHOPはREJECT/model_evidence_collection_invalid。後者も深部の全静的不備を実CMEEが検査したという意味ではない。

| 旧9 | 実判定 | 原本で確認した差 |
|---|---|---|
| CHAIR01初回＋DAILY3件 | 意味/本文4/4・cold4同値 | 全4raw_textがbefore完全同一。新たな文章改善ではない |
| CHAIR01訂正（退行） | REJECT/semantic_receipt_not_validated、INVALID_FORMAT | schema_version欠落。深部はrelation更新へ訂正marker根拠、GAPへ共同修理等の根拠混載 |
| CHAIR02初回（退行） | UNSUPPORTED/model_evidence_out_of_scope | 教師/前回との差は連結引用「して、」→「して」だけ |
| CHAIR03初回（退行） | REJECT/semantic_receipt_not_validated、INVALID_EVIDENCE | 全6引用source_idと4claim時点anchorを実IDからliteral material.sources[0].source_idへ変化、連結引用も短縮 |
| CHAIR02訂正（継続不成立） | REJECT/semantic_receipt_not_validated | schema欠落、joy欠落、1更新なのに本文は5更新参照 |
| CHAIR03訂正（継続不成立） | HOLD/model_update_not_prior_or_source_bound | 6claim/引用/対象は回復したがrelation/GAPの更新別根拠混載が残る |

rootは全文2原文・教師・全更新/本文と旧9全更新/本文・成立4の実artifactを読み、独立補助は旧9全after/before/教師/診断を全文比較した。成功したCHAIRは修理・再使用と一人で直せた喜び、DAILY3件は帰宅後の調理・食事と少しの落ち着き。4件とも前回本文の保持であり商品品質の増分とはしない。

## 重複した次案の撤回とCPU比較

中間で候補に挙げた「正の全文CEを残しsuffix重点化」は、既存localized30（全CE＋198位置16倍）、adaptive30（全CE＋誤り依存1〜16倍）、jointfocus9（全文0.5/参照0.25/本文終端0.25）、fullce9（同284fの純全文CE）との照合で撤回した。起点違いだけで同種の有料試行を足す根拠にしない。純suffix-only反復・上限延長も行わない。compact9はq/$idの短名化であり、staged_pair9の単発全文生成やgold A条件付きBも、今すぐ自律2callを採用する証拠ではない。

追加GPUなしで、全leaf値・明示名・全更新・bind・本文を保った汎用column-record carrierをCPU比較した。元JSONへbyte完全復元し元CMEE教師outcome2/2同値、recordの値数不一致1例を拒否（列定義改変や意味的欠落全般の検証ではない）。実13.304903秒、model load/forward/update/gen0。単独output文字列のtoken数はBOOK2911→2828（83/2.85％減）、SHOP3236→3141（95/2.94％減）だけ。これはchat全context/capやモデル能力の評価ではない。marker/headerの負担が大きく、通常接続/新GPU学習へ推奨・採用しない。source・完全結果は../carrier_comparison_cpu/。通常decoder/reader/入力spec/contract変更0。

今回のprimary=BLOCKER_NARROWED。同種の有料loss調整の追加は停止。次の技術的な検討対象は、全意味値をモデルが明示する責任を維持しながら、固定型の行表現などで反復する構造表記と汎用wrapperを減らす仕様候補。元named形式への全値復元/同じCMEE教師結果/入力を含めた実token量を先に比較し、明確な削減を確認するまで新GPUを始めない。この具体仕様・decoder・学習/評価条件は未固定、未採用であり、通常契約の変更にはしない。教師条件lossが低くても自由生成は不成立という事実を保持し、一般4B能力不足/教材不足を確定しない。

現2題の正しい教師は既にあり、この欠陥修正のための新観測会は不要。一般化用の独立未知評価、Piece/Analysisの完成教師不足は別残件。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。

## 回収・費用・閉鎖

source d79b0737/PID123107の一回。処理991.976650176秒/$0.077153739458按分、CMEE CPU42.680259945秒、準備CPU3.869429秒、carrier CPU13.304903秒（準備/回収/保持等別）。今回live単価再照会なし。新45a101ecの112F32/3,833,856parameterは全112変化、初期f493/全凍結入力は不変。

ZIP46,811,766bytes/SHA3e49b3c8125a65d4d6bbb9108b0aa48f81557d43421574da28feee5a4c546101、348payload＋manifest349memberを全CRC/hash/size、112F32有限/形状、11before hash、全11EOS、cold4全outcome同値までPod外照合。追加重み・起点・元bundle・CMEE source・全raw/保存再読はLibrary libfile_1a5c146f11a481918792a37429a2f5acへ保存。base/tokenizer本体・optimizer/RNG厳密resume stateは含まない。原run.jsonのpending statusは実行時原本として保持し、result_summary.jsonが閉鎖を所有する。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy/lifecycle変更0、GPU保持、STRUCTURE_MAP_DELTA_NONE。
