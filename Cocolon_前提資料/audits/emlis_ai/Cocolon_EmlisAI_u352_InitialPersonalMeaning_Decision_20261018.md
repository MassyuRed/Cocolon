# u352 — 初回に既述の本人説明を受け取る一体案

記録日：2026-10-18 JST。状態は**診断・具体案。新しい初回内容／選択契約は未承認・未実装**。今回のrepository変更は文書6fileだけで、production／test／fixture変更は0。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式Product Read0/3／candidate_ready=false／automatic_progression=falseを維持する。

開始先端はmashos-api `fcfbf899872d53d869a2f64749a2832b8d48be99`（Draft PR3）、Cocolon `989aac18779e8826c3d6b937d7dfd759aa394bc9`（Draft PR30）。u351の同一treeから継続し、全体01、全file地図01A/B/C、三中核入口、Emlis／CMEE current map、意味・時点・保存の詳細設計、最新weekly20261017とE04〜E09、u349承認範囲・u350・u351を照合した。今回も00_read_first、Rule18 §11.3、恒久商品無視incident全文を確認。全repositoryの全byteを再精読したとの報告ではない。System Contextは既存決定どおり任意補助とする。

必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK。今回得たのは不足の診断と実装単位の具体化であり、製品改善の成功数・合格率へ加算しない。主担当が実生成・原典確認・文書編集・GitHub反映を行い、Work内の補助担当は読取りのみ。別model Pro／Ultraによる正式な二重評価や正式Product Readを実施した扱いにはしない。

## 初回と実際の回答を比較した結果

公開合成入力の部品を次のように定める。実ユーザー記録を引用したものではない。

- P：友達からの誘いを断って、一人で休めたことにほっとした。でも、もう誘ってもらえなくなるかもしれないと思うと寂しい。
- R：褒められたのに、嬉しくなかった。
- M：期待されているように感じて、重かった。
- U：何が不安なのか、私にもまだわからない。

初回7構成を現行engineのQ3_PREMIUMで実生成した。Mをあらかじめ書くと質問は終了するが、その説明がReceptionに残らない。

| 初回原文 | 実状態／問い | 実Receptionの対象 |
| --- | --- | --- |
| R＋M | GENERATED／END | Rだけ。Mが欠落 |
| R＋M＋U | LIMITED／END | Rだけ。MとUが欠落 |
| P＋R＋M | GENERATED／END | Pだけ。RとMが欠落 |
| P＋R＋M＋U | LIMITED／END | Pだけ。RとMとUが欠落 |
| P＋M＋U | LIMITED／END | Pだけ。MとUが欠落。この構成は下記の新received資格外 |
| P＋R＋「その時は」M＋U | LIMITED／END | Pだけ。時点語を足すだけでは解消しない |
| P＋R＋「仕事を頼まれて、重かった。」＋U | QUESTION_PENDING／ASK | Pだけ。別件をRの説明とみなして質問を止めない境界を確認 |

上のEND6件の理由は`no_bound_personal_meaning_target`。最後のASKは`source_bound_event_personal_meaning_missing`で、実際の質問は `「褒められた」は、あなたにはどんな意味として届きましたか。` である。

R＋Mの未加工Reception：

> 褒められたことと嬉しくなかったことの両方を、その違いも含めて小さくせずに受け止めています。

P＋R＋M＋Uの未加工Observation：

> 「友達からの誘いを断って、一人で休めたことにほっとした」の一方で「もう誘ってもらえなくなるかもしれないと思うと寂しい」とあります。
> 「褒められた」と「嬉しくなかった」が、異なる向きのまま同時にあります。
> 「期待されているように感じて、重かった」と「何が不安なのか、私にもまだわからない」が、同じ入力の中で一つの流れになっています。

同じ例の未加工Reception：

> ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。

Mの意味核はreaction／SELF／negative feelingだがtime_scopeはcurrent_inputで、過去の本人説明としてreceived経験に結ばれていない。後続Uとはsource順由来の`uncertain_connection`が作られる。語尾だけの修正では、Mの選択欠落とUとの不要な接続を解決できない。

次に、Mを含まない初回が**実際に発行した質問**へ、同じMを一回答として渡した。作った質問や、END後の架空回答は使用していない。意味を準備し、そのcheckpointを指定して公開engineへ渡した最終比較は次の4件。

| 初回→実pending回答 | 意味更新 | 公開本文／問い |
| --- | --- | --- |
| R→M | RESOLVED／MATERIAL_UPDATE／ADD | GENERATED／END |
| P＋R→M | 同上 | UNAVAILABLE／END |
| P＋R＋U→M | 同上 | UNAVAILABLE／END |
| P＋R＋U→「次も同じ成果を求められるようで、重かった。」 | 同上 | UNAVAILABLE／END |

成功したR→Mの未加工Reception：

> 褒められたのに、嬉しくなかったし、その時は期待されているように感じて、重かったのですね。

この回答理解は既存`_PERCEIVED_REACTION`の範囲内であり、新規承認へ戻さない。混在3件は`emlis_refined_body_unavailable`で、本文成功に数えない。いずれも元出来事時点への意味束縛はあるが明示時点根拠のtupleは空で、既存混在保持資格が要求する明示根拠との不一致が原因候補にある。下位例外まで切り分けた唯一の確定原因とはしない。

診断scriptの初回実行では、準備したcheckpoint参照を公開生成requestに渡し忘れ、4件とも`emlis_checkpoint_reference_required`となった。requestを既存契約どおり修正して上表を再採取した。productionの契約や検証は緩めていない。初回7件・実pending4件は診断件数であり、pytest合格11件という意味ではない。

## 否定訂正の停止原因も切り分けた

P＋R＋Uの実発行質問への一回答：

> 「何が不安なのか、私にもまだわからない」ではなく「現在は嬉しくない」です。

u351により意味はpresent／negative／ANSWER_TIMEへ正しく束縛される。実作者が生成したが独立検証で拒否されるReceptionは次のとおり。これは利用者へ提供された完成本文ではない。

> 回答した時点で嬉しくないことを小さくせずに受け止めています。その反応が重なる中で、その気持ちともう一方の向きとの違いを受け止めています。

surface検証のissuesは空。独立inverseの直接失敗は`body_inverse_nominal_cognition_feeling_object_missing:rm2`だけで、gateも同じ失敗を受けて拒否する。作者失敗や時点誤読を直接原因とした以前の仮説は採用しない。generic MATERIAL_WEIGHTに残ったpairが照応へ縮められ、完全な二対象の要求を満たしていない。

read-onlyの一時processで、意味選択・source・検証を変えず、最終reference modeだけを明示へ変更した診断では、既存作者が次を出す。

> 回答した時点で嬉しくないことを小さくせずに受け止めています。友達からの誘いを断って、一人で休めたことにほっとしたという気持ちともう誘ってもらえなくなるかもしれないと思うと寂しいこととの違いを受け止めています。

この場合もinverseは同じrm2を拒否する。既存pair readerはRELATIONAL_NONCOLLAPSE専用で、全体3対象のgeneric MATERIAL_WEIGHTに対応していない。最初にresponse builderの返却値だけを変えたprobeは後続`_explicit_unknown_object_reception`のpair照応指定に戻され、最終参照を変更できていなかった。最終ownerの返却後へ一時probeを移して上の完全二対象を確認した。planだけをsurface直前で変更した別probeは`emlis_thread_plan_checkpoint_mismatch`で拒否されており、その検査も回避していない。

修復候補は、専用資格が失効したgeneric moveへ旧照応指定を残さないことと、選択されたcontribution内の両basis・qualifier・元contrast・完全な可視対象を独立readerが検証することを一緒に扱う既存契約内の整合修復（LEVEL2候補）。全体3対象をpairだけへ書き換えたり、u350の専用保持資格を復活させたり、旧照応文を許可する緩和ではない。完全対象化すると「その反応が重なる中で」も既存作者から消え、別の接続文補修は不要だった。今回はproductionへ反映せず、旧checkpoint・本文・保存を含む検証は未実施。新初回契約の承認がなければこの既存不整合まで修復禁止、という意味ではない。

## 新しく判断が必要な差分

u349承認案とu350の初回資格は、P＋R（＋U）の4／5対象に限定されている。正本05はINITIALをevent＋原reactionの二roleと定め、回答核・ABOUT・updateはすべてなしとしている。追加Mをその二端点内容へ混ぜたり、初回に架空answer_refを与えたりすると契約が変わる。

今回必要なのは、**初回の原文に既にある本人説明を、元経験の第三roleとして読み、受け取りの対象へ選ぶ差分**である。Rule18 §11.3 LEVEL_3（contract・選択と既説明scopeの拡張）に該当するため、実装前のMash判断を求める。一般的な残件継続指示をu350の明示した有限境界を変更する個別承認と読み替えない。診断・既存修復の検討・この具体案のGitHub記録は先に完了する。

## 推奨する一つの実装単位

目的は、本人が既に書いた意味を聞き直さず、元の経験とともに本文へ残すこと。許可対象は既存received一経験＋元反応＋直後の本人説明一つ。Pの前置は0／1、末尾の独立current SELF wh不明は0／1とする。説明は既存回答のPERCEIVED_REACTION相当の本人知覚（「ようで」「ように感じて」等）と有限過去感情を元memo全体から証明できる形に限る。「その時は」の有無でも同じ原文の過去形を捨てない。

1. **初回sourceと内容。** event・原reaction・本人説明の三roleを保持する。本人の「期待されているように感じた」を他者の意図の事実へ変えず、「重かった」を現在へずらさない。回答用ABOUT・時点根拠・回答sourceを初回へ転用しない。旧二端点内容とは別の限定private版として区別する。
2. **全体の選択。** received・既存P・任意Uの最大3責務を同じ元sourceから選び、どれかを落とさない。M→Uを原文順だけで一つの流れや因果にしない。Pの寂しさの可能性や未確定性も保持する。
3. **問いと既存回答の整合。** Mが既述の初回は現行どおりEND。同じMを実pendingへ答える既存経路と内容・過去の時点を照合し、混在一回答の不足も同じ単位で扱う。初回sourceと回答sourceの区別を維持し、質問数や質問文法を増やさない。
4. **実際に到達できる訂正／撤回。** 説明なし初回の実pendingに対する第1回答で、元反応の完全引用REVISE／WITHDRAWを確認する。例は `「嬉しくなかった」ではなく「期待されているように感じて、重かった」です。` で、既存受理grammarをそのまま使う。この組合せの実本文はまだ未検証。説明回答後にENDとなった単一received／u350混在へ第2回答を作らない。別targetが残る既存Q3では本人continue→実質問から前説明全文を訂正／撤回できる経路の互換を守り、今回の混在資格を任意多段へ広げない。「重かった」だけを複合説明全文の引用としない。
5. **旧版と保存。** 新source資格・選択を旧IDへ貼り替えず、変更前の独立比較原本から旧checkpointの全解釈・plan・selected・本文／停止を再現する。完成済みDTOの非再生成と、本文未完成checkpointの中断再開は分けて確認する。新初回END・実pending一更新を実service／隔離SQLに通し、意味保存前後の中断再試行、GET/start、同一DTOの現行画面再表示まで確認する。

P＋R＋M＋Uに対する可視本文の比較案。**未実装の案であり、実生成成功や固定正解文字列ではない。**

> 褒められたのに嬉しくなく、期待されているように感じて重かったのですね。
> ほっとしたと聞いて、私も少し安心しましたが、その寂しさにも、今、耳を傾けていたいです。
> 何が不安なのか、あなたにもまだわからないのですね。

不合格は「期待されていたから嬉しくなかった」と事実化・原因化すること、「今は重い」と現在化すること、「その重さが不安の正体」と不明を解消すること、説明・別経験・独立不明の欠落、既述意味の再質問。作者を呼ばない独立読解で、可視本文の主体・知覚の内側・時点・肯否・関係と欠落を確認する。意味がsourceどおりでも定型的で浅い本文なら、技術検証成功を深い理解の達成としない。

別件、他者の感情、引用報告、条件・仮定、追加received、自由な順序、任意の思考文、複数説明、P＋M＋Uのreceivedなし構成は新資格外とする。既存source／質問がそれらにどう応答するかは互換境界として比較し、新資格のために一般化しない。

## 変更責務・完了・停止

実装時の中心は既存のsource plan、answer update／projection、private contracts、subjective content／composition、Human Reception／sentence surface／独立gate。u350と同じ意味→選択→作者→独立読解→保存の経路を使う。新subsystem、外部AI、公開API／DTO、DB migration、RNの質問・訂正UI、Safety、依存、配置を追加する提案ではない。具体的なprivate型・差分pathは承認後の初期設計で既存ownerに固定し、承認範囲外のfamilyが必要なら実装前に止める。

増える作業は、初回説明roleのsource資格と内容・選択、既存混在回答との整合、独立本文読解、旧互換・保存再表示を一体で実装検証する一単位。今回まだ設計・実装時間を実測していないため、日数や工数を確約しない。新しい外部利用料・継続費用を伴う提案ではない。単なる文末変更より作業範囲が増えることを明示し、検証用の新しい管理機構は増やさない。

完了には代表初回4構成（P0/1×U0/1）の実本文、元経験と同じ説明を実pendingへ渡した結果、到達可能な訂正／撤回、独立読解、旧未完成再開と旧完成非再生成、新保存DTO再表示を同じsourceで確認する。件数だけで合格とせず、欠落・事実化・現在化・不明解消・再質問を含む失敗を原文と本文で報告する。関係ない既存failureを消した扱いにしない。

承認がなければ新初回意味／選択の実装に進まない。実装中に初回ENDへ新しい質問や回答を作る必要、最大3責務を超える必要、他者意図の推測、旧IDの新意味への貼替え、保護fixtureの上書き、別subsystemが必要となった場合も停止し差分を提示する。旧有限資格を緩める近道は採用しない。両読取レビューと主担当の推奨は、既存経験を保持するこの一体単位で進めること。

## 今回の全変更file

STRUCTURE_MAP_DELTA_NONE。新実装構造・型はまだないため、01／01B/C／current map／正本05を実装済みとして更新しない。今回の6fileだけを明示して反映する。

| repository | path | 責務 |
| --- | --- | --- |
| mashos-api | `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | u352診断・次の承認対象・既存不整合の引継ぎ |
| Cocolon | `Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u352_InitialPersonalMeaning_Decision_20261018.md` | 本記録。実原文・本文・失敗・提案と境界 |
| Cocolon | `Cocolon_前提資料/01A_cocolon_overall_structure_app_foundation_home.md` | 文書6fileの地図と未実装の明示 |
| Cocolon | `Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md` | 次単位・診断・停止点の同期 |
| Cocolon | `Cocolon_前提資料/weekly_reviews/Cocolon_Weekly_Review_20261017.md` | 最新週報へ実結果と次判断を追記 |
| Cocolon | `Cocolon_前提資料/07_latest_snapshot_diff.md` | 最新差分 |

今回pytest／実SQL／UI／本人実機は実行していない。u351の77成功と8保存DTOをu352の検証数として再使用しない。初回7件＋実pending4件と否定訂正1例の診断・一時参照probeのみ。否定訂正は修復候補の実行確認であり完成ではない。E04〜E09、深い理解、一般入力、本人実機は残件。Piece/Analysis主枠53.25％、10/20方式判断・10/31管理線・12/18公開目標は再評価しない。Draft PR3／PR30へ反映し、merge／deployは行わない。
