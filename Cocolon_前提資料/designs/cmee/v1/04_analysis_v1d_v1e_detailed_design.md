# CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計

- document id: `cocolon.cmee.v1d_v1e.analysis_route.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- observed-route runtime state: `SPECIFIC_DEVELOPMENT_API_DEPLOYED`; u102〜u118 content correctionは未配置
- IF-route runtime state: `NOT_IMPLEMENTED`
- Analysis activation: `STORAGE_APPROVED_AND_APPLIED_2026_10_04_JST`; API315f5b5…配置済み、Mashが6201実機確認OKを報告
- API source effect: V2保存・read分岐実装、default off
- DB effect: dedicated table 1 / migration 20261003204421 applied
- production runtime activation effect: 指定開発配置のみ。global cutover/正式公開は未完了
- RN source effect: versioned safe DTO receiver / renderer implemented; 6201送信済み、実機OKはMash報告

---

## 0. Product result

**u199 内容修正（2026-10-11 JST・未配置）**：否定決定の後の「落ち着きました／嬉しかったです／うれしかったです」が欠落するu198残件を、共有の報告prefix判定内で補修。明示SELF・完全な名詞格項・既存の否定決定/準備4形だけを区別し、感情・否定・原文・明示順序を文章/図/保存再読に保持する。Analysis4＋共有限定感情1suite **987 tests／4434 subtests PASS**、共有identity1成功。合成8例の前後比較と生成全文、実RN表示model一致、実service＋合成RPC保存再読6ルートを確認。STRUCTURE_MAP_DELTA_NONE。共有owner1変更、API/DTO/DB/RN製品変更0。一般の省略主体・修飾語/連体形、本人生成→保存再表示・商品受入れは残る。詳細は04 §3.29、06/API handoff末尾u199。

**u168 内容修正（2026-10-08 JST・未配置）**：「まだ昨日の方針が決まっていない」等の昨日を名詞区間に保ち、現在の未完了状態が分析から抜ける問題を補正。共有の既存未完了判定内で完全名詞/現在否定hostと帰属境界を証明し、時制と属性を同期。Analysisのmarker必須・原文・否定・主体非推定・更新/比較/保存は維持。分析324＋identity1 PASS、共有限定35 PASS/開始版でも同じ既存6 FAIL。合成8全文と実RN表示model一致。STRUCTURE_MAP_DELTA_NONE、API/DB/DTO/RN製品変更0。未配置・実DB/実機/商品受入れ未確認。詳細は06／API handoff末尾u168。u167の昨日名詞付き未完了4例の保留は当時の状態であり、今回この限定範囲を回復。

**u167 内容修正（2026-10-08 JST・未配置）**：変化／未完了の「今日疑問」「今日方針」等を名詞へ吸収して確定する誤解析を補正。結果にまだ時点parserがないため未解析部分を保留し、別の完全な場面・行動・原文証拠を保持する。「今日の疑問」「昨日分の疑問」等の完全な名詞境界と既存の行動／場面の日語解析は維持。共有witnessで元から保留される昨日付き未完了は未対応のまま。Analysis3suite 323 tests／2087 subtests PASS、合成8全文と実RN表示model一致、保存再表示を確認。STRUCTURE_MAP_DELTA_NONE、共有owner・API/DB/DTO/RN製品変更0。実DB・実機・商品受入れ未確認。詳細は06／API handoff末尾u167。

**u166 内容修正（2026-10-08 JST・未配置）**：4文目以降の完全な本人過去所在が表示優先度だけで分析から抜け、「場面は未確定」となる不一致を補正。既存Analysisの場面証拠判定でrequired/shouldを同等に扱い、optional・不確実な帰属・不完全節は従来どおり保留する。肯否定・今日/昨日・明示順序・原文証拠・補足/訂正/撤回を保持。分析3suite計320 tests／2050 subtests PASS、合成7全文と実RN表示model一致、再生成を禁止した保存再表示を確認。STRUCTURE_MAP_DELTA_NONE。共有owner・API/DB/DTO/RN製品変更0。実DB・実機・商品受入れ未確認。詳細は06／API handoff末尾u166。過去u110/u111/u118のSCENE required限定は当時の実装記録であり、この限定修正後の条件ではない。

**u165 内容修正（2026-10-08 JST・未配置）**：「俺は／おれは」の明示本人記述が分析に出ない表記漏れを修正。既存Analysisの8箇所と共有Planの属格希望・読点付き現在負荷の2箇所へ本人表記だけを追加し、有限節・原文出典・主体・肯否定・順序を保持する。最終対象548 tests PASS（Analysis316・共有231・identity1）、2027 subtests PASS。合成10全文と実RN表示model一致、保存後の再生成禁止readを確認。STRUCTURE_MAP_DELTA_NONE。全日本語表現対応・実DB・実機・商品受入れ未確認。詳細は06／API handoff末尾u165。

**u164 内容修正（2026-10-08 JST・未配置）**：「良い職場にいた／いなかった」の「良い」を独立valueと誤認し、所在と後続行動の順序を失う問題を修正。既存共有Planの分類とoperator判定で、完全名詞句＋過去所在5形に属する修飾だけを区別する。独立評価・未閉包host・原文出典・Safety／Analysis witnessは維持。最終472 tests PASS（分析316・共有155・identity1）、合成10全文と実RN表示model一致、再生成禁止の保存再表示を確認。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れ未確認。旧0066等の失敗は今回未再検証。詳細は06／API handoff末尾u164。

**u163 内容修正（2026-10-08 JST・未配置）**：「私は悪い職場にいた／いなかった」を自己評価と誤認する停止を修正。既存共有Safetyの名詞修飾判定を、完全な過去所在5形と文末に限定して補正し、所在・否定・昨日・後続行動の順序を文章と図へ保持する。SELF／人prefix・独立自己否定・緊急/支援・未閉包hostは従来判定を維持。最終465 tests PASS／既存Emlis1 FAIL（開始版と同一診断）、分析315件・合成9全文のRN表示model一致・再生成禁止の保存再表示を確認。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れ未確認。「良い職場」の別value誤分類は残件。詳細は06／API handoff末尾u163。

分析構造のCMEE connectionは、期間sourceから現在よく通る自己構造routeを根拠付きで形にし、希望時だけ観測routeとは別identityのIF routeを作る。

```text
period source set
-> event frames and evidence graph
-> evidence-bound observed route
-> protective / burden annotations and unknown gaps
-> text + visual projection
-> ObservedSelfStructureMap

ObservedSelfStructureMap + user-owned branch intent
-> separate HypotheticalScenarioGraph candidate set
-> parallel IF route artifacts
-> optional SavedRouteIntent
```

current Watashi Mapのfixed presentation routeをtruth graphへ昇格しない。IFは未来予測、正解、命令、最適化ではない。

## 1. Activation boundary

**u162 内容修正（2026-10-08 JST・未配置）**：「家族の悪い取り組みを守りたい＋つらい」を本人の自己否定と誤認して分析が止まる問題を補正。共有SafetyとPlanの自己評価検出で、完全な名詞句＋属格連鎖＋「を」に属する「悪い」だけを名詞修飾として区別する。SELF／人を表す語で始まる名詞、独立自己評価、他の自己否定、緊急・支援は従来判定を保持。最終対象460 tests PASS、既存Emlis検査1 FAILは開始版でも同一診断。分析314件を含み、合成9全文と実RN表示model一致、再生成禁止の保存再表示を確認。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u162。

**u161 内容修正（2026-10-07 JST・未配置）**：「家族の新しい生活を守りたい＋つらい」等の生成停止と「資料の詳しい振り返りを調べたい＋つらい」の負荷欠落を補正。共有Planの目的語各名詞区間に、既存Analysisと同じ任意1個の連体修飾を許可し、修飾位置を含む対象全体を保持する。実出力は10語、11語の構文判定を確認。「悪い」は別の既存Safety／自己評価判定で保留し、今回の対応完了には含めない。Analysis313 tests／1853 subtests、共有129 tests、identity1件PASS。合成10全文と実RN表示model一致、再生成を禁止した保存再読を確認。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u161。

**u160 内容修正（2026-10-07 JST・未配置）**：「家族の気持ちを守りたい＋つらい」の生成停止と「資料の振り返りを調べたい＋つらい」の負荷欠落を補正。共有Planの希望目的語に既存の仮名入り名詞と属格連鎖の完全一致を適用し、名詞内の感情語を別の述語と誤認しない。Analysis311 tests／1810 subtests、共有98 tests、identity1件PASS。合成10本文を全読し実RN表示modelの全文・図用データと一致、保存後の再生成なし再表示を確認。一般の仮名・別主体・伝聞等の保留は維持。旧contracts残差は今回未再検証。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u160。

**u159 内容修正（2026-10-07 JST・未配置）**：「家族の時間を守りたい＋つらい」の生成停止を補正。共有Planが目的語内の「の」を別の話し手と誤認する箇所を、明示SELF・限定属格目的語・完全な現在希望へ限定して修正。Analysisの根拠条件を維持し、意向と負荷を同じ文章・図へ保持する。Analysis310 tests／1787 subtests、対象共有86 testsとidentity確認PASS、合成8全文と実RN表示model一致、合成保存再表示を確認。旧契約の86 subfail／1 setup errorは開始版と全診断一致。STRUCTURE_MAP_DELTA_NONE、API／DB／RN変更0、実DB・本人実機・商品受入れ未確認。ひらがなを含む「家族の気持ち」等は残件。詳細は06／API handoff末尾u159。

**u158 内容修正（2026-10-07 JST・未配置）**：「私は家族を守りたいけれど、私はつらい」が分析不能になる問題を補正。既存Analysis内で共有根拠のある完全な希望・負荷の対比に限り保護意向の節を受理し、同じ希望へPROTECTIVEとBURDENを保持する。原文・全文訂正／撤回・集約・期間比較を維持。関連308 tests／1759 subtests PASS、合成7全文と実RN表示model一致、実service＋合成RPCで保存後再生成なし再表示を確認。STRUCTURE_MAP_DELTA_NONE、共有owner／API／DB／RN変更0。実DB・本人実機・商品受入れ未確認。「家族の時間」の共有別分岐は保留。詳細は06／API handoff末尾u158。

**u157 内容修正（2026-10-06 JST・未配置）**：「私は仕事を続けたいけれど、私は、つらい。」で主語読点だけにより負荷注記が落ちる問題を補正。既存共有planとAnalysis内の完全一致を、明示本人5表記＋和文読点＋半角／全角空白＋現在肯定のつらい／辛い／苦しい（任意のです）に限定して追加し、共有witnessの要求を維持。原文出典・正確な訂正対象を保ち、読点差の期間比較は差分なし。Analysis元fieldのタブは保留し、Emlisの既存ledger空白正規化は維持する。Analysis303 tests／1707 subtestsと共有contrast選択74 tests PASS、合計377 tests。合成7全文と実RN表示model一致、実service＋合成RPCで保存後再生成なし再表示を確認。STRUCTURE_MAP_DELTA_NONE、共有既存parserの変更あり・owner変更なし。実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u157。

**u156 内容修正（2026-10-06 JST・未配置）**：「私は仕事を続けたいけれど、私は辛い／辛いです」の負荷注記の読み落としを補正。共有根拠のある本人希望と本人現在感情の明示対比だけを対象に、完全一致した辛いの意味lemmaをつらいへ揃える。原文表記・出典・訂正対象は保持し、味覚や一般感情へ拡張しない。表記だけの期間差は0、苦しい・別希望は区別。vertical227／storage56／saved-period16＝299検査PASS、1637 subtests PASS。合成7全文と実RN表示model一致、実service＋合成RPCで保存後再生成なし再表示を確認。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u156。

**u155 内容修正（2026-10-06 JST・未配置）**：今朝／今週／今月／今年を含む未対応認知により同fieldの独立した正常節まで失う不一致を補正。共有側が消費した「今」1字を、既存時点prefix一致と完全有限節・未解析scope確認の下で元本文境界へ戻す。認知自身は保留し、証明済みの別記述と原文出典だけを保持する。認知名詞の受理・時点解釈・順序推測は拡張しない。vertical225／storage55／saved-period16＝296検査PASS、1594 subtests PASS。合成7全文と実RN表示model一致、実service＋合成RPCで保存後再生成なし再表示を確認。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れ未確認。独立reviewの条件限定指摘を修正済み。詳細は06／API handoff末尾u155。

**u154 内容修正（2026-10-06 JST・未配置）**：「今週資料／今年仕事」などの未対応時点を対象名詞に取り込む誤読を補正。既存Analysisの名詞保留判定に今週／今月／今年／先月／来月／昨年／来年を追加し、読める独立節と未確定表示を保持する。「今週の資料／今年を記録」と、完全な年度・月号名詞は従来どおり保持し、行動の日付へ転換しない。vertical222／storage55／saved-period16＝293検査PASS、1568 subtests PASS。合成7本文を全文確認し実RN表示modelと一致、実service＋合成RPCで保存後の再生成なし再表示を確認。独立read-only reviewに具体的blockerなし。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れは未確認。詳細と既存の認知保留境界は06／API handoff末尾u154。

**u153 内容修正（2026-10-06 JST・未配置）**：共有根拠が成立している「ぼくは」の記述をAnalysisが読み落とす不一致を修正。既存7主語regexと読取入口1箇所へ「ぼく」を追加し、「僕は」と同じ明示本人節として原文・否定・希望・場面・担当・認知・順序・注記を保持する。複数主体や省略を補完せず、共有未成立の敬体名詞変化は保留。vertical220／storage55／saved-period16＝291検査PASS、1492 subtests PASS。合成7全文と実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。独立read-only reviewに具体的blockerなし。STRUCTURE_MAP_DELTA_NONE、実DB・本人実機・商品受入れは未確認。詳細は06／API handoff末尾u153。

**u152 内容修正（2026-10-06 JST・未配置）**：行動後の「嬉しかった／うれしかった」の表記差だけで期間比較が内容差になる欠陥を修正。既存PAST_FEELINGの2表記だけを同じ意味keyで扱い、原命題・原文出典・表示表記は維持する。別感情・主体の明示／未確定・行動対象・順序は区別し、別episodeを統合しない。vertical217／storage54／saved-period16＝287検査PASS、1451 subtests PASS。合成6全文と実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。既存期待緩和0、STRUCTURE_MAP_DELTA_NONE。実DB・本人実機・商品受入れは未確認。詳細は06／API handoff末尾u152。

**u151 内容修正（2026-10-06 JST・未配置）**：「私は職場にいなかったです／私は会議を担当しなかったです」を、既存の所在・担当の否定過去として文章と図へ保持する。Analysisの2正規表現と2否定判定だけを補正し、通常行動・埋込認知・共有ownerは不変。memoのみの既存根拠境界、原文出典・時点・補足／訂正／撤回・明示順序・競合・期間比較を保持。vertical215／storage53／saved-period16＝284検査PASS、1441 subtests PASS。合成8全文と実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。既存期待緩和0、STRUCTURE_MAP_DELTA_NONE。実DB・本人実機・商品受入れは未確認。詳細は06／API handoff末尾u151。

**u150 内容修正（2026-10-06 JST・未配置）**：「資料を調べなかったです」等の過去非行動が読み落とされる不一致を、既存Analysisの独立文有限形へ限定して補正。既存9動詞の否定・過去・対象・原文証拠を文章と図へ保持し、希望や実行済みと区別する。埋込認知の有限形表はu149と同一。対象280methodは279PASS＋新storage期待1件訂正後の当該1PASS、1403 subtests PASS。合成8全文と実RN表示model一致、合成RPCで保存後再生成なし再表示を確認。既存期待緩和0、STRUCTURE_MAP_DELTA_NONE、共有owner／API／DB／RN変更0、実DB・実機・商品受入れ未確認。詳細は06／API handoff末尾u150。

**u149 内容修正（2026-10-05 JST・未配置）**：長文の読点／固定長分割で後半の否定・不確実性を落とし、通常行動・希望を確定表示する適用漏れを補正。既存Analysisの元field上の完全文確認を全claimへ適用する。独立した別文、通常節のセミコロン、原文出典と未確定表示、証明済みcompoundを維持。vertical209／storage51／saved-period16＝276検査PASS、1367 subtests PASS。合成6全文と実RN表示model一致、合成RPCで保存後再生成なし再表示を確認。STRUCTURE_MAP_DELTA_NONE、共有owner／API／DB／RN変更0、実DB・実機・商品受入れ未確認。任意の長文理解は未完了。詳細は06／API handoff末尾u149。

**u148 内容修正（2026-10-05 JST・未配置）**：夢・聞いた話・読んだ内容の中の行動や希望を、本人の現実の事実として表示する適用漏れを補正。既存Analysisのrecord単位の帰属判定を通常行動・希望・認知等にも適用し、独立した別recordの明示行動と未確定表示を保持する。vertical206／storage50／saved-period16＝272検査PASS、1344 subtests PASS。合成6全文と実RN表示model一致、実service＋合成RPCで保存後再生成なし再表示、夢／伝聞だけの生成失敗時commitなしを確認。STRUCTURE_MAP_DELTA_NONE、共有owner／API／DB／RN変更0。実DB・実機・商品受入れ未確認。同一record内で現実へ戻る境界は引き続き判別せず保留。詳細は06／API handoff末尾u148。

**u147 内容修正（2026-10-05 JST・未配置）**：「たくありません／たくありませんでした」の否定希望が読み落とされる不一致を、既存Analysisの有限形2行で補正。既存9動詞の対象・格・否定・現在／過去・原文証拠を文章と図へ保持し、非行動や行動順序へ変換しない。vertical203／storage49／saved-period16、計268検査PASS・1306 subtests PASS。合成8全文と実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。既存期待／共有owner／API契約／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。plain幾は疑問と不定数量を今回判別できず一律拒否しない。実DB・実機・商品受入れ未確認。詳細は06／API handoff末尾u147。

**u146 内容修正（2026-10-05 JST・未配置）**：既存9動詞の「たかったです／たくなかったです」を過去の希望として文章・図へ保持する。Analysisの有限形一覧2行だけを補い、肯否定・過去・格付き対象・原文出典を維持。常体との差を期間差にせず、希望を実行済みや行動順序へ昇格しない。vertical201／storage48／saved-period16、計265検査PASS・1273 subtests PASS。合成8本文を全文確認し実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。既存期待の変更0、独立read-only最終reviewに具体的blockerなし。共有owner／API契約／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u146。

**u145 内容修正（2026-10-05 JST・未配置）**：「私は何を調べた」「私は誰の資料を見た」を確定した行動へ変換していた問題を、既存Analysisの未解析名詞判定で補正。何／誰で始まる名詞部分は認知内側も保留し、併存する読める節と未確定表示を残す。未知節を越す順序や訂正対象を作らない。通常の幾何学／幾何は維持し、plain幾の判別は別残件。vertical198／storage47／saved-period16の261検査PASS後、保存失敗2例を当該methodで追加確認。合成7本文を全文読取し実RN表示model一致、保存後の再生成なし再表示を確認。共有owner／API契約／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。実DB・本人実機・商品受入れ未確認。詳細は06／API handoff末尾u145。

**u144 内容修正（2026-10-05 JST・未配置）**：本人主語の読点で「私は、資料を調べるかもしれないと思う」が分析不能になる不一致を既存Analysis parser内で補正。共有根拠が認める読点（、／ASCII ,）だけを原文出典へ含め、内側の可能性・主体未確定・否定・時制を文章と図へ保持する。行動の事実や因果へ昇格しない。vertical195／storage47／saved-period16、計258検査PASS。合成8本文を全文確認し実RN表示modelと一致、保存後の再生成なし再表示を確認。共有owner／Emlis／Piece／API／DTO／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。本人実機・実DB・商品受入れは未確認。詳細は06／API handoff末尾u144。

**u143 内容修正（2026-10-05 JST・未配置）**：行動後の「私は、安心しました」等が本人主語の読点だけで分析不能になる問題を既存Analysis parser内で補正。明示主語・既存感情形・原文出典・順序を文章と図へ保持し、原因や改善を推測しない。単独感情、別主体、否定、伝聞等の保留は維持。vertical192／storage47／saved-period16、計255検査PASS。合成8本文を全文確認し実RN表示modelと一致、保存後の再生成なし再表示を確認。共有owner／Emlis／Piece／API／DTO／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。本人実機・実DB・商品受入れは未確認。詳細は06／API handoff末尾u143。

**u142 内容修正（2026-10-05 JST・未配置）**：本人主語の読点で「私は、資料を調べてから、不安が減りました」の行動・変化が読み落とされる問題を修正。Analysisの従属te節と既存共有の敬体増減・復帰witnessで、読点1個＋半角／全角空白を受理する。原文全節・出典・明示順序を保持し、敬体増減・復帰の共有witnessはneutralのまま。因果や感情所有者を補わない。共有変更が影響するEmlisの既存作者／独立readerもtopic省略時の読点を処理し、具体的なepisodeを本文へ保持する。対象417検査を確認（初回416PASS＋新検査の表示空白期待1件補正後1PASS）、Analysis189／storage47／saved-period16を含む。合成Analysis8本文と実RN表示model一致、Emlis3全文確認、保存後の再生成なし再表示を確認。API／DTO／DB／RN／Piece source不変、STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れは未確認。詳細は06／API handoff末尾u142。

**u141 内容修正（2026-10-05 JST・未配置）**：本人主語直後の読点だけで「私は、家族を守りたい」が分析不能になる問題を既存Analysis compilerで補正。読点1個と半角／全角空白を原文座標へ保持し、対象・現在の希望を文章と図へ反映する。実際に守れているという結果へ転換しない。共有wish根拠・全文照合・safe再解析と保留条件は不変。vertical185／storage47／saved-period16、計248検査PASS。合成7本文を全文確認し実RN表示modelと一致、保存後再生成なし再表示を確認。共有owner／Emlis／Piece／API／DTO／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れは未確認。詳細は06／API handoff末尾u141。

**u140 内容修正（2026-10-05 JST・未配置）**：明示された本人行動の後の「減りました／増えました／戻りました」を、共有ownerの完全節・原文境界の証拠とAnalysisの命題解析で保持する。疑問・引用・伝聞・仮定・否定・別主体・属格・未対応時点は新共有証拠へ昇格しない。変化はneutral、Analysisでは対象・肯定過去・明示順序を保持し、所有者／原因／改善を推測しない。共有変更でEmlisへ生じた「行動が支えている」という評価は、既存source-owned受取と独立inverseの限定補正で元の順序を保つ文章へ修正。品質閾値は不変。対象381検査PASS（Analysis245を含む）、合成Analysis8本文＋実RN model一致、Emlis6本文確認。別途旧generic0058の期待1件は修正前でも同一失敗、期待は変更しない。既存owner内の補正でAPI／DTO／DB／RN／Piece source不変、STRUCTURE_MAP_DELTA_NONE。本人実機・実DB・商品受入れは未確認。詳細は06／API handoff末尾u140。

**u139 内容修正（2026-10-05 JST・未配置）**：共有根拠が成立している行動後の「変わりました」を既存Analysis compilerで受理し、対象・明示順序・原文出典を文章と図へ保持する。常体との期間差0、補足・訂正／撤回、保存後の再生成なし再表示を確認。vertical179／storage46／saved-period16、計241検査PASS、合成7本文と実RN表示model一致。共有根拠が未成立の「減りました／増えました／戻りました」は未対応。感情所有者・原因・改善を推測せず、属格feeling等の保留を維持。共有owner／realizer／API／DTO／DB／RN変更0、STRUCTURE_MAP_DELTA_NONE。本人実機・実DB・商品受入れは未確認。詳細は06／API handoff末尾u139。

**u138 内容修正（2026-10-05 JST・未配置）**：行動の後の「不安が減った／気持ちが変わった／気持ちメモが増えた」が共有分類のfeelingだけで分析不能になる不一致を補正。完全解析済みの名詞の過去変化と既存bounded-change証拠に限り受け取り、対象・出典・明示順序を文章と図へ保持する。本人の感情所有者・因果・改善を推測しない。新分岐の属格（友人の不安／私の不安等）は保留し、既存fact属格・有限感情述語の照合は維持。vertical176／storage46／saved-period16、計238検査PASS。合成7本文と実RN表示model全文一致、実service＋合成RPC保存後再表示を確認。独立静的reviewにblockerなし。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れの確認なし。u137の共有witness未成立という説明は、witness自体は存在し分析側のmodality照合で拒否していた、と訂正する。詳細は06／API handoff末尾u138。

**u137 内容修正（2026-10-05 JST・未配置）**：既存の仮名入り名詞一語に漢字・カタカナの接尾部分が続く「振り返りメモ／気持ちメモ／学びノート／取り組み方」等を一つの対象として文章・図へ保持する。名詞全体・連体修飾・格・否定・希望・時点・訂正／撤回・期間差を維持。新しい接尾境界でも未対応時点・疑問語を確定名詞へ吸収しない。vertical172／storage45／saved-period16、計233検査PASS。合成8本文の全文確認と実RN表示model一致、実service＋合成RPCで保存後の再生成なし再表示を確認。独立静的reviewにblockerなし。共有witnessの未対応、任意かな・主語省略は保留。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れの今回確認なし。前回u136の大文書2本の転送省略は復元し、実git取得と一致を確認した。詳細は06／API handoff末尾u137。

**u136 内容修正（2026-10-05 JST・未配置）**：既存の完全な名詞句で「新しい／古い／大きい／小さい／長い／短い／詳しい／難しい／易しい／良い／悪い」の連体形を一区間一つだけ保持する。「新しいメモ帳」等を落とさず、否定・希望・時点・訂正／撤回・比較の差へ反映。修飾の背後にある未対応時点・疑問語を確定名詞にしない。vertical167／storage44／saved-period16、計227検査PASS。合成8本文の全文確認と実RN表示model一致、実service＋合成RPCの保存後再表示を確認。独立静的reviewにblockerなし。共有witnessの未対応、副詞・形容詞の否定／過去形・主語省略は保留。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れの今回確認なし。詳細は06／API handoff末尾u136。

**u135 内容修正（2026-10-05 JST・未配置）**：漢字とカタカナが連続する名詞（仕事メモ／メモ帳等）を未解析にしていた既存名詞文法を補正。明示された行動・場面・担当・結果・希望・認識の名詞全体を原文の出典とともに文章・図へ保持する。任意のひらがな修飾、主語省略の本人補完、未対応時点の推定は追加しない。vertical161／storage43／saved-period16、計220検査PASS、既存214の期待変更0。合成8本文と実RN表示modelの文章・identity・node／edge／unknown／注記一致、実service＋合成RPCの保存→再生成なし再表示を確認。独立静的reviewにblockerなし。STRUCTURE_MAP_DELTA_NONE。実DB・実機・商品受入れは未確認。詳細は06／API handoff末尾u135。

**u134 内容修正（2026-10-05 JST・未配置）**：本人の過去の場面／担当でも、主語直後の読点を原文座標のまま保持する。「私は、職場にいた」「私は、会議を担当した」が文章・図へ出るようになり、否定、今日／昨日、明示順序、補足／訂正／撤回を維持した。読点差だけの比較差0。vertical156／storage42／saved-period16、計214検査PASS。合成6本文を読み、実RN表示modelの全文・identity・node／edge／unknown対象一致を確認。STRUCTURE_MAP_DELTA_NONE。実DB／実機／商品受入れは未確認。詳細は06／API handoff末尾u134。

**u133 内容修正（2026-10-05 JST・未配置）**：明示本人主語の直後の読点「私は、資料を調べた」等を未解析にしていた箇所を補正。既存9動詞の行動・否定・希望に、読点1個と直後の半角／全角spaceを原文座標のまま保持する。明示順序、既存行動→変化・希望＋負荷、補足／訂正／撤回も確認。読点差だけで期間差を作らない。vertical152／storage41／saved-period16、計209検査PASS、合成8本文の実RN表示model一致。場面／担当等の別parser、主語省略、tab・改行跨ぎへは拡張しない。STRUCTURE_MAP_DELTA_NONE。詳細は06／API handoff末尾u133。

**u132 内容修正（2026-10-05 JST・未配置）**：未解析の原入力をraw nodeへ採用し、読めた別の記述までsafe表示不能にする問題を補正。完全に解釈できたnodeと既存の未確定表示を文章・図へ残す。未解析originalの訂正／撤回対象への昇格を止め、補足・置換全文の保留、負荷注記、改竄拒否を保持。vertical146／storage41／saved-period16、計203検査PASS。合成6本文と実RN表示modelの全文・identity・node／edge・unknown対象一致。未解析内容の意味理解、実DB／実機／商品受入れは未成立。STRUCTURE_MAP_DELTA_NONE。詳細は06／API handoff末尾u132。

**u131 内容修正（2026-10-05 JST・未配置）**：「明日職場」「来週会議」「今朝資料」等の時点語を名詞へ吸収して確定表示する欠陥を補正。実測した明日／明後日／一昨日／今朝／昨夜／先週／来週の7語を対象に、完全解析候補の名詞連結を保留し、同じ原入力の読める別節と未確定表示を残す。「明日の会議／明日の資料／明日を記録した」は名詞の意味を保持。時点を新しく推定しない。141検査PASS、合成6本文のbackend／RN表示model一致。固有名詞「明日香」等も保留する制約、元々解析不能な「明日ノート」の表示拒否は残る。STRUCTURE_MAP_DELTA_NONE。詳細は06／API handoff末尾u131。

**u130 内容修正（未配置）**：本人の過去の場面・担当でも、主語直後の「今日／昨日」を独立した時点として保持する。「私は昨日職場にいた」「私は今日、会議の司会を担当した」が文章と図へ出るようになり、否定・原文出典・補足の訂正／撤回を保持した。時間接尾・日語の重複・接続語との併用・無区切りの「…の…」は保留し、場面／担当の「今日の…」も日付へ変換しない。vertical136検査PASS、合成6本文のbackend／RN表示modelで全文・identity・node順・edge一致。実機未検証。STRUCTURE_MAP_DELTA_NONE、既存compiler以外の意味owner・API／DB／RN経路は不変。隣接する既存欠陥「明日職場」の誤名詞化は未修正で次対象。詳細は06／API handoff末尾u130。

**u129 内容修正（未配置）**：既存9動詞の本人有限節で、主語直後の「今日／昨日」を対象名詞へ混入させず、原文の時点・否定・希望を文章と図へ保持する。前置型との語順差だけで期間差を出さない。「今日の資料」は名詞修飾のまま。時間接尾／範囲／日の細分と、日語後に区切りなしで続く「…の…」は保留（「昨日仕事の資料」も現段階は保留。「昨日、仕事の資料」は保持）。補足・訂正・撤回の出典も確認。vertical131検査PASS、合成6本文のbackend／RN表示modelの全文・identity・node順・edge一致。実機／React suiteの今回再検証ではない。変更は既存Analysis compiler内、共有owner／DTO／DB／RN経路は不変。詳細は06／API handoff末尾u129。

稼働状態はcurrent03のu128配置記録を参照。以下のu118未配置等は当時の履歴で、今回のu129〜u134コードは未配置。

**2026-10-04 u118 candidate**（§3.19）：場面・担当の完全な本人過去節に付く「今日/昨日/その後/それから」を文章・図へ接続し、場面→担当→行動の明示順序を保持。関連181検査・606 subtests、RN13検査、合成6本文の一致を確認。u102〜u118未配置。u117の比較SQLは未適用・既定OFF、指定版の実機OKはMashの既報。

2026-10-03 u94更新：latest weekly §6.6〜6.10に沿い、offline source→部分graphに補足の明示引用訂正・撤回と本人向けsafe text／visual projectionを追加した。RNに閉じたDTOのvalidatorと専用renderer、latest／viewerのversion dispatchを実装。合成入力のbackend26検査、実RN componentを使う11検査、旧表示互換2検査PASS。全追加・変更fileの正本は`current_structure/03_analysis_current_structure.md` §4.5。u95で認証済みsaved period loader→ASTOR明示V2生成entryを追加し、13検査＋既存26検査PASS。u96/u97で専用保存と既存API接続を実装し、承認済みtableを実DBへ適用・照合した。稼働API配信・実ユーザー入力での実行・実機は未実施。

専用保存先のMash判断はu96で承認され、§15.1.2の実装・DB適用まで完了した。次は指定API版の開発配置と本人入力から開発画面で読む一往復を進める。原文節を含むprivate previewを公開DTOへ昇格しない。IF／SavedRouteIntent／外部exportはHOLD。以下の旧順序は設計時の履歴であり、Emlis/Pieceの文章品質全体完了をV1-D開始の待機条件に戻さない。

設計時の順序：

1. Emlis V1-A actual proof
2. V1-B Emlis Question operational proof
3. V1-C Piece visual operational proof
4. V1-D observed routeのimplementation / migration approval
5. observed mapのProduct Read / lifecycle proof
6. V1-E IF routeの別implementation / safety approval

設計のみの旧段階を越えてRN/API sourceを変更し、専用DB schemaを適用した。稼働API配置・global cutoverは未実施。

## 2. Source model

`SourceEnvelope`へ入れてよいのはauthentic input materialだけである。

```text
ORIGINAL_INPUT
SUPPLEMENTAL_ANSWER
PERIOD_METADATA
USER_CORRECTION
SIMULATION_SESSION_MATERIAL
```

`PERIOD_RECORD_IDENTITY`は本文を持つ`SourceEnvelope` roleではなく、`AnalysisSourceSet.members[].member_role`のmembership metadataである。record childの`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`だけをmeaning-bearing SourceEnvelopeにする。

period source-set memberはsaved record identityを持ち、そのchild commitmentとして`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`を別`SourceEnvelope`でfreezeする。question decision / option / skip等のcontrol lineageとEmlis visible bodyはmeaning source 0である。

次はsource roleではなくderived artifact / lineage refである。

```text
AnalysisClaimRef
ObservedSelfStructureMapRef
IfScenarioArtifactRef
SavedRouteIntentRef
```

`observed_analysis_claim`、`simulated_route_material`、`saved_route_intent`をsource namespaceへ戻さない。simulation-session materialはobserved period sourceへ混ぜない。

Analysis lifecycle ownerがDBからowner-authenticated saved recordを取得してrequest-local private materialを渡す。CMEEはsourceをadmitするだけで、DB read policy、DB owner、storage writeを持たない。

## 3. Proposed future module topology

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py
```

V1-Eで初めてmaterializeする候補:

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/if_route_realizer.py
```

event framing、route induction、annotation、period comparisonは`intent_compiler.py`のAnalysis-owned責任として最初のverticalで閉じ、必要性をactual codeで示した場合だけ分割する。第1phaseでIF empty stubを置かない。exact pathはV1-D / V1-EそれぞれのPhase fit-gapで再固定する。

### 3.1 Current owner integration disposition

| Repository | Current / proposed path | V1-D disposition |
|---|---|---|
| mashos-api | `ai/services/ai_inference/astor_material_snapshots.py` | `SAVED_PERIOD_LOADER_IMPLEMENTED_READ_ONLY`: 認証・tier・元入力／補足・生成後再確認 |
| mashos-api | `ai/services/ai_inference/analysis_engine_adapter.py` | `KEEP_MATERIAL_NORMALIZATION_PREIMAGE_ONLY / NOT_GRAPH_ORCHESTRATION_OWNER` |
| mashos-api | `ai/services/ai_inference/astor_self_structure_report.py` | `EXPLICIT_READ_ONLY_V2_ENTRY_IMPLEMENTED`: u95内部preview。保存lifecycleはanalysis_observed_serviceへ分離、cutover未実施 |
| mashos-api | `ai/services/ai_inference/watashi_map_service.py` | `HISTORICAL_V1_GENERATOR / RETIRE_ACTIVE_AT_V1D_CUTOVER` |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | `KEEP_PUBLISH_VALIDITY_GUARD / NOT_MEANING_OR_ROUTE_AUTHORITY / EXTEND_FOR_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/api_analysis_reads.py` | `MUST_MAP_BEFORE_CUTOVER`: tier / access / unread / refresh semanticsを保護 |
| mashos-api | `ai/services/ai_inference/api_analysis_reports.py` | `MUST_MAP_BEFORE_CUTOVER`: report familyとのversion / identity境界を固定 |
| mashos-api | `ai/services/ai_inference/api_self_structure.py` | `IMPLEMENTED_DEFAULT_OFF`: latest/status/monthly V2保存read分岐 |
| mashos-api | `ai/services/ai_inference/analysis_observed_service.py` / `report_artifact_read_service.py` / `api_report_reads.py` | `IMPLEMENTED_DEFAULT_OFF`: immutable保存、safe読取、旧履歴統合、unread同一ID |
| mashos-api | `ai/services/ai_inference/api_self_structure_reports.py` | `DELEGATES_TO_UPDATED_READ_SERVICE`: existing route/response shape保持 |
| Cocolon RN | `components/selfStructure/WatashiMapRenderer.js` | `KEEP_HISTORICAL_V1_READ_RENDERER` |
| Cocolon RN | `components/selfStructure/watashiMapFormatters.js` | `KEEP_V1_FORMATTER / DO_NOT_INTERPRET_V2_AS_V1` |
| Cocolon RN | `screens/AnalysisSelfStructureScreen.js` | `REVIEWED_EXISTING_CALLER`: v2受信はgenerate／viewer側 |
| Cocolon RN | `screens/AnalysisContentFirstScreen.js` | `REVIEWED_EXISTING_EMBEDDED_GENERATE_CALLER` |
| Cocolon RN | `screens/analysis/useAnalysisSelfStructureActions.js` | `MUST_MAP_BEFORE_CUTOVER`: generation / refresh / navigation actionをV2 identityへ接続 |
| Cocolon RN | `screens/SelfStructureReportGenerateScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: 有効DTO／許可modeのみ既読。API source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportViewerScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: private／未知／不正JSONを旧本文へ戻さない。保存identity lifecycle source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportHistoryScreen.js` | `EXISTING_UUID_READER_REUSED`: V2 UUIDを同じhistory/detailで使用 |
| Cocolon RN | `components/selfStructure/watashiMapAccessPolicy.js` | `KEEP_ACCESS_OWNER / VERIFY_SAFE_V2_PROJECTION` |
| Cocolon RN | `lib/compat/legacyWireContracts.js` | `MUST_MAP_BEFORE_CUTOVER`: v2をv1 aliasへsilent変換しない |
| Cocolon RN | `components/selfStructure/WatashiMapV2Renderer.js` | `IMPLEMENTED_SAFE_V2_RENDERER_SOURCE_ONLY` |
| Cocolon RN | `components/selfStructure/watashiMapV2Contract.js` | `IMPLEMENTED_CLOSED_DTO_AND_TEXT_GRAPH_MODEL` |
| Cocolon RN | `components/selfStructure/WatashiMapRouteGraph.js` | `NOT_MATERIALIZED`: 現段階のgraphはV2Renderer内。分割の必要性待ち |
| Cocolon RN | `tests/analysis-watashi-map-v2-contracts.test.js`、`tests/fixtures/analysis-watashi-map-v2-synthetic.json` | `IMPLEMENTED_SYNTHETIC_BACKEND_TO_RN_TEST` |

V1-D Phase fit-gapはfresh caller / writer / reader graphとexact filenamesを再確認し、上表からのdeltaをapprovalへ出す。V1-EのIF source、storage、API、RN filesは別approvalまでmaterialize 0である。

### 3.2 u94 implementation limits

引用付き補足の対象occurrenceは親recordの完全節へ一意にbindし、元の主体／伝聞／疑問scopeを検証してから集約前に撤回・置換する。answerのnew clauseは元answerのfield/hash/scalar/byteを保持するparser viewで、派生文を新sourceにしない。元の否定・願望は置換へ継承しない。未解釈の補足は期間全体をUNAVAILABLEとする。

safeラベルは格を持つ名詞項と有限述語の型から再構成する。現段階は9動詞と限定名詞grammarの明示本人節のみで、任意の修飾／時点接頭句／複文は未対応。意味を削ってsafe化しない。生成不可を将来のlifecycle callerが扱う必要がある。annotations／conflict／期間比較と順序線のpositive cohortは未完了。

safe projectionは認証された本人向けのSELF_ONLY商品表示で、匿名telemetryではない。意味項としてsource-bound名詞を保つが、原bodyやprivate source/evidence識別子は含めない。unknown／注記／競合は対象refを保持して図と文章へ出し、ラベルだけの重複排除で対象を消さない。端末側のtier検査は認証・server access policyの代用ではない。

### 3.3 u102 通常補足と同一意味の集約

**u189 表記差の同義照合漏れを補修（2026-10-11 JST・未配置）**：既存PAST_FEELINGの「嬉しい／うれしい」の意味正規化を通常補足の対立判定にも使用する。原入力対回答だけでなく回答内の二節も対象。主体・様相・時制・compatible_arguments・別日境界は保持し、原文命題/証拠/表示表記は書き換えない。同極性や別感情を拒否せず、明示訂正/撤回は既存の対象指定に従う。曖昧な補足を生成/保存せず、入力不足の正常案内へも変換しない。新しい文法・API/DTO/保存契約の追加なし。検証は06/API handoff末尾u189。

既存intent_compiler内で、引用訂正/撤回以外の通常補足も、共有semantic frameと既存の完全節grammarが全文を解釈できる場合に採用する。元回答のexact scalar evidenceが全文を覆うことを確認し、未解釈/訂正混在を部分採用しない。親recordを同じ一機会とし、質問/生成文はsourceへ入れない。矛盾する同一候補の記述はどちらかへ決めずUNAVAILABLEを保持する。

同じSELF主語・格/名詞・述語・極性・modality・時点は、格の語順や丁寧語の違いで分割しない。全evidenceを保持し、record件数と共起は独立記録を基準にする。関係・順序・原因を追加回答から推測しない。既存26＋追加7＝33検査PASS、合成生成本文3組を確認。通常日本語全般/複数補足/annotations/期間比較/IFの完成ではなく、API/DB/DTO/RN契約は不変。

### 3.4 u103 明示された記録内順序の限定実装

既存有限節の接頭辞「その後」「それから」を型と元evidence位置に保持する。同一source/fieldに隣接する完全SELF過去fact節で、間が文末区切り/空白だけの場合に限りOBSERVED_ORDERを作る。接続語もsafe表示で区別する。否定を保持し、希望は行動順序にしない。単なる列挙/共起/保存時刻は順序の根拠にせず、因果関係を表示しない。

順序の両端はevidence occurrenceで区別し、A→B→Aを3node/2edgeとして保つ。別recordの順序は集約せず、順序外の同一意味集約だけをu102から継承する。未解釈の中間節、別field/source、元入力と補足、撤回/置換箇所を橋渡ししない。通常補足内で成立する順序は元answerの出典へbindする。成立pairの不足表示だけを解消し、接続先不明はunknownのまま。

§3.2の順序positive未完了をこの限定範囲で更新する。vertical42/storage10/saved period13/API6＝71 PASS、A→B→Aの保存・再読取と既存RN contract/view modelの本文一致を確認。新規API/DTO/DB/RN契約なし。一般時点表現/任意複文、複数記録での反復route解釈、annotations/conflict/期間比較/IFは未完了。未配置sourceの技術成立であり、正式商品受入れではない。

### 3.5 u104 今日/昨日のsource-bound解釈

既存の完全SELF有限節に付く単一接頭辞「今日」「昨日」を、relative_dayとsource_partsへ保持する。有限述語のpast/current_input、極性、fact/wishを上書きせず、「昨日＋現在の希望」は保留する。safe表示は「この記述時点の今日/昨日」とし、閲覧当日や推定した年月日に変換しない。

日語付き観測はsource envelope＋明示日で分離し、同一source/同日の文法上同一内容だけをu102方式で集約する。順序参加節はu103のoccurrence分離を優先する。原入力のcreated_atを補足の記述日時へ流用しない。原入力と回答では異なる日語でも同じ実日を指す可能性があるため、対立する候補を日語だけで通さない。同一回答内の明示今日/昨日だけは別日として区別する。

日語だけから順序edgeを作らず、後続節へ日を暗黙継承しない。引用訂正/撤回は日語を含む完全節へbindし、置換後の日は回答出典から解釈し直す。vertical50/storage11/saved period13/API6＝80 PASS、RN契約とbackend本文の一致を確認。§3.2の時点未対応をこの限定範囲で更新する。一般日時、主語後の日修飾、複数修飾/複文、annotations/conflict/比較/IFは残る。契約変更なし、source未配置。

### 3.6 u105 可能性の補文と現在の認識host

共有Stage1の_source_current_cognition/_partsが認定する現在の認識のうち、明示SELF・背景なし・可能性補文・現在の思う/考えるhostをAnalysisへ接続する。共有parserの広い文字列slotをそのままsafe化せず、内側も既存9動詞と格付き名詞grammarで完全に解釈する。補文限定inventoryは同じ動詞の過去/否定過去と辞書形/否定形を扱い、主文grammarは拡張しない。

内部possible_contentはactor=UNSPECIFIED、modality=possibilityであり、省略された行為主体を本人と推測しない。外側はSELF・neutral/fact/current_inputの認識で、ATTENTION_OR_THOUGHTとして表示する。内側の否定・時制・対象と外側hostの継続/非意図性を集約とsafe表面へ保ち、実行済み事実や結果へ昇格しない。内側過去形から順序edgeを作らない。

認定済み認識の完全範囲だけを可能性拒否の例外にし、同fieldにある別の確定行動を失わない。未認定/未解釈の可能性scope、他者・引用・条件・否定/過去hostは保留する。通常補足は全文解釈を要求し、引用訂正/撤回では外側/内側の旧scopeを置換後へ継承しない。補足が単なる可能性なら、元の確定記述を勝手に訂正せず別の考えとして保持する。

vertical58/storage12/saved period13/API6＝89 PASS、既存RN契約との文章一致を確認。保存serializerのallowlistと閉じたDTOは変更せず、旧artifact読取を再解釈しない。一般認識/過去host、任意の補文、場面/役割/結果の接続、annotations/conflict/比較/IFは残る。新規owner/契約/配置効果なし。

### 3.7 u106 現在の未成立結果

共有_final_source_unfinished_result_nucleiが認定する単一memo完全節を消費する。explicit/explicit_current_input/required/event、negative/fact、現在の時点、present_unfinishedのmarker、部分投影/依存関係なしを揃え、同共有完全節helperとAnalysisの既存名詞/の連結・は/が/も・見つかる/決まる/定まるの現在否定状態の解析を両方要求する。疑問名詞、未解釈接頭辞/修飾/複文、過去/肯定/二重否定/引用/伝聞/条件を切り落として通さない。

actorはUNSPECIFIEDであり共有frameのcurrent_user既定値を本人の行為へ昇格しない。result_state=NOT_YET、名詞/助詞、否定、current_inputと元scalar/UTF-8証拠を保持し、IMMEDIATE_RESULT_OR_AFTERMATHへ接続する。safe表示は「まだ〜っていない（この記述時点）」。未実行・失敗・原因・順序・永続的不可能を作らず、解釈可能な結果だけを不足表示から除く。

集約は同じ内容の丁寧語だけを束ね、助詞/名詞/述語を区別。通常補足/訂正/撤回と元出典を既存経路で保持。期間内の共起は無方向、現在結果を過去行動の順序へ混ぜない。保存serializerとDTOは変更せず、内部型は非公開。vertical65/storage13/saved period13/API6＝97 PASS、合成6本文と既存RN本文が一致。共有ownerの変更0、未配置。一般結果・場面/役割・複文/比較/IFの完成ではない。

**u169 限定補正（2026-10-08 JST）**：u168の昨日名詞付き未完了と完結した本人書字の併存を、共有 `_source_prefix_opens_report` の既存責務内で区別する。明示SELF7表記＋は/が/も＋任意の読点/半角・全角空白＋既存単一名詞区間＋を＋書いた/書きましただけを閉じた書字と証明する。一般属格/別主体/主語なし/報告内容/次・以下等は保留、別文/別fieldの報告は残す。Analysisの正規present_unfinished、否定/current_input/UNSPECIFIED、exact evidence・更新・比較・保存・同一文/図の条件は不変。既存owner/route内の修正でSTRUCTURE_MAP_DELTA_NONE。Emlis複合文の受取能力は別残件、検証と制約は06/API handoff u169。

**u174 限定補正（2026-10-08 JST）**：上記u169の目的語1項に、同じ単一名詞文法の場所/媒体1項（に/で）を前後どちらかに追加できる。「考えをノートに書いた／ノートに考えを書いた／職場で記録を書きました」が後続未完了を伝聞化しない。前後両方・3項・格重複は保留し、既存の何/誰/次/以下/上記/下記/話/発言/引用/説明/報告/内容の拒否を目的語と場所/媒体の全区間へ適用する。一般属格/他者/引用/未閉包・他文/別fieldの報告条件、書いた/書きましたへの限定は不変。未完了は現在否定・主体未指定のまま、書字との因果/順序を推定しない。文章/図・補足/訂正/撤回・期間比較・保存再読を確認し、限定398 tests PASS。新しい文法ownerや依存方向は増やさずSTRUCTURE_MAP_DELTA_NONE。Emlis複合出力の既存停止は未解消。詳細は06/API handoff u174。

**u175 限定補正（2026-10-08 JST）**：「まだ気持ちが定まっていない／まだ不安の原因が見つかっていない」は既存の現在未完了に該当する。共有Planが名詞内の感情語でreaction/feelingへ分類していた不一致を、同じ未完了owner内で補正する。まだ＋完全な既存名詞/属格＋は/が/も＋見つかる/決まる/定まるの現在否定、原文/範囲/explicit根拠、reaction/feeling/negativeの一致を満たす場合だけevent/factへ戻し、operator:feelingを除く。疑問名詞の何/誰/幾、独立感情、未閉包/過去/推量/疑問/引用/夢/伝聞と別field帰属は新分岐で昇格しない。昨日/昨日分は既存の完全名詞内時点の条件のみ継承。Analysisのactor=UNSPECIFIED、現在否定・原文/出典、補足/訂正/撤回・比較・保存を維持し、原因/順序/本人感情を推測しない。STRUCTURE_MAP_DELTA_NONE、共有owner/既存文法内の補正。Emlisの感覚への定型化と複合生成停止は別残件。検証結果は06/API handoff末尾u175。

### 3.8 u107 過去行動の後の有限変化

**u176後続順序の限定補正（2026-10-08 JST・未配置）**：`_explicit_order_pairs`は、既存`_action_change_pair`で全文を証明し、両端を`_fragment`で実際に受理した非撤回の複合文について、末尾がBOUNDED_CHANGE/fact/pastかつ全文証拠の終端と一致する場合だけ、その末尾を既存の後続順序候補へ加える。次節は従来どおり同一fieldの完全な過去factで「その後／それから」を明記し、間が文末区切り/空白だけであることが必要。初めの行動片へ直結せず、未解析文・希望・別field/source・撤回/置換箇所を飛び越えない。PAST_FEELINGの後続接続と複合文の前方接続は拡張しない。

内部順序の両端＋元全文3証拠と、後続線の末尾＋次節2証拠を保持する。成立した線だけを元field/scalar順で表示し、配列順から新しい順序や原因を作らない。期間意味比較は線の表示ID/配列順を意味差にしない。既存保存結果は再生成しない。最終Analysis345 tests／2369 subtests PASS、7合成本文・実RN model一致、保存後再読確認。契約/共有owner/DB/RN製品変更0。詳細は06/API handoff末尾u176。

同一memo spanの完全なSELF過去行動＋後/あと（に）読点＋名詞の有限変化に限定する。共有Stage1のaction/change 2核、explicit/required/explicit_current_input・fact/past、action_before_change、source_fragmentのexact範囲とrequired user_stated_relation/typed_projection:perfective_action_before_bounded_changeを要求する。同じmarkerは夢/伝聞の長いhostにも付くため、全文を両端と接続語で完全に解釈できなければaction片側も採用しない。

左端は既存の有限動詞/格と明示SELF、肯定の過去factだけ。右端は既存名詞/の連結・は/が/もと減った/増えた/変わった/戻ったを型付けし、result_state=BOUNDED_CHANGE、actor=UNSPECIFIED、positive（文法上の肯定）/fact/pastとして結果nodeへ置く。名詞の所有者を本人と補わず、増減を改善/悪化と評価しない。両端の疑問名詞（何/誰/幾）は保留。safe labelは「疑問が減った（記録された変化）」等に再構成する。

shared action_supports_changeを因果として輸入せず、実際の後接続を根拠に既存OBSERVED_ORDERだけを作る。接続語を含む元の全文evidenceをedgeへ加え、各端点もexact scalar/UTF-8/hashを維持する。両端をoccurrenceとして分離し、反復した行動を一つにまとめない。通常補足は両端の解釈成立時だけconnectorを含む全文を被覆する。訂正/撤回は元の完全な2節span全体を対象にし、部分引用へ広げない。置換後の証拠は回答原文へ戻す。

vertical71/storage14/saved period13/API6＝104 PASS、合成6本文と既存RN表示が一致。保存DTO/serializer、API/RN/共有ownerを変更せず旧artifactを再生成しない。たら/てから/3節、右端feeling、否定行動のpair、共有側が2核化しない進んだ、一般日本語/比較/IFは対象外。u106/u107は当初の自動審査停止後、Mashの明示公開許可を受けPR3/PR30へ反映・照合済み。新規owner/契約/配置効果なし。

### 3.9 u108 「てから」の依存時制と完全な過去結果

既存9動詞のte活用（書いて/調べて/試して/見て/作って/残して/記録して/メモして/続けて）は、通常の主文_propositionには加えない。専用の内部解析ではtemporal_scope=dependentとして、原文のte形・格・明示SELFと全source partsを保持する。原文を過去形へ置換した仮想証拠を作らない。

_action_change_pairでu107の共有2核/required typed relation/exact範囲と、右端の4述語のpast fact、実際のから接続を全て確認した場合だけ左端をpastへ束縛し、private dependent_form=TE_BEFORE_PAST_CHANGEを付ける。各consumerはfragmentから同じ解釈を受け取り、単独teの再解析で意味を作り直さない。safe側はte原文の再解析に加え、その行動からpastの結果へ向かうOBSERVED_ORDERと、同一envelope/field/spanの両端およびexact全文evidenceを要求する。marker単独、別記録、順序なしでは実行済み表示へ変換しない。

補足全文の被覆、全文引用訂正/撤回、元回答座標と反復occurrenceをu107経路で維持。単独teへの置換は旧結果を返さず保留。夢/3節/非過去/否定/他者/疑問名詞を切り落として通さない。未対応の願望は既存private ATTENTIONが残り得るが、実行済み行動・順序・safeラベルとして出さない。従属形は意味上の別の出来事を増やす集約keyにはせず、既存のevidence occurrenceで区別する。

vertical76/storage15/saved period13/API6＝110 PASS。6合成本文と既存RN本文が一致。新private fieldはserializerのallowlistから外れ、保存DTO/API/RN/共有ownerの変更なし。既存「てから」拒否1例は今回のpositive cohortへ移し、他の保留期待は維持。未配置。たら/3節/右端feeling/一般場面/役割/比較/IFの解釈は未完了。

### 3.10 u109 行動後の過去感情

**u191 明示接続語前の単独否定感情を保持（2026-10-11 JST・未配置）**：既存の否定過去感情用の広い後続「と」拒否から、「ところで/とりあえず」直後に「、/，/,」がある場合だけを除外する。引用助詞との誤認を補修し、感情の否定・本人・時制・原文証拠は維持する。接続語を含む後続文を解釈/採用する文法ではなく、unknownと接続先不明を保持する。未知話者・未区切り語頭・帰属/撤回・通常補足の全文要件は維持。共有owner/Emlis/compound/公開契約は変更しない。未区切り「とても」とcompound側は今回未解消。STRUCTURE_MAP_DELTA_NONE。検証は06/API handoff末尾u191。

**u190 後続の帰属・撤回を保持（2026-10-11 JST・未配置）**：単独過去感情の後ろに句点等を挟んで「と私は思う／と友人が言った／のは嘘だった」等が続くとき、そのhostを捨てて本人感情へ確定しない。既存の共通continuation判定に、既存SELF/名詞句＋は/が/もを伴う認知・伝達hostと「のは/のも/なんて/などと」を追加する。「とても/ところで/とりあえず」の独立文を広く拒否せず、否定の既存専用境界は保持する。帰属内容自体を新しく解釈せず未読scopeへ保留し、別の完全な本人行動・原文証拠を残す。保留した感情からの順序線は作らない。通常補足の全文要件と入力不足の正常案内は既存どおり。新しい公開契約・保存構造なし、STRUCTURE_MAP_DELTA_NONE。検証は06/API handoff末尾u190。

**u188 主体未確定を表示へ保持（2026-10-11 JST・未配置）**：PAST_FEELINGのSELF/UNSPECIFIEDは内部に保持されていたが、公開labelが同じだった。既存realizerの型再照合を通ったUNSPECIFIEDだけ、肯定・否定とも「（誰の気持ちかは未確定）」と表示する。SELFは「（記録された気持ち）」を維持。「書かれていません」と原文の欠落を断定せず、分析で主体を確定していない状態を示す。行動側の本人を感情側へ補完せず、感情の内容自体や否定を不確定にしない。

新規生成の本文・図・順序線の端点は同じlabelを使う。主体明示への訂正とその逆、主体差の非集約と期間差、同一主体の丁寧同義比較を保持する。新規保存は新表示、旧保存の本文・図・identityは再読時に再解釈せず維持。受理文法、private graph、共有意味owner、公開schema、保存lifecycleは変更しない。生成8全文と実RN表示modelの全文/identity/node順/edge/比較が一致。検査の詳細は06/API handoff末尾u188。STRUCTURE_MAP_DELTA_NONE。本人の生成→保存再表示は未完了、本修正は未配置。

**u187 行動後の否定過去感情（2026-10-11 JST・未配置）**：u186で保留したcompoundを、既存完全SELF行動＋後/あと/てから＋同じ12否定有限形に限って受理する。共有Planは全文・帰属・境界を証明し、negative/negationと専用source_proven_negative_feeling_sequenceを保持、positive_changeを付けない。Analysisは共有2核/required typed relation、原文scalar/UTF-8/hash/whole evidenceを照合し、PAST_FEELING/negative/feeling/pastへ保持する。右端の省略主語はUNSPECIFIEDを維持し、苦痛/失敗/改善/原因を補わない。先頭/後続の明示順序は既存隣接条件だけへ接続する。

否定行動・たら・程度/疑問/推測・他者・引用/夢/報告/後続認知/撤回hostは保留。通常補足の矛盾を暗黙訂正にせず、訂正/撤回/未知文/別field/sourceを橋渡ししない。同義の常体/丁寧形は期間差を作らず、肯否定の差は保持する。Emlisの観測作者/受取作者/独立readerも同じ限定根拠に接続し、原文端点と接続語を保つ。否定された感情を「変化」「支えている」へ転換せず、本文の完全な意味検査を通らない否定関係は拒否する。

Analysis4suite391 tests／3386 subtests成功、共有限定154・identity1・短文品質保留1成功、既存実保存fixture3skip。Analysis9全文と実RN表示modelが一致、実service＋合成RPCで追加8caseの保存再読を確認。短いEmlis一文は意味検証を通過した候補も既存echo品質gateで未生成になり、閾値を緩めて通さない。STRUCTURE_MAP_DELTA_NONE、既存ownerの責務はcurrent03 §4.15へ明示。DB/API/DTO/RN/Safety/製品依存変更0。本人の分析生成→保存後再表示は未完了、本修正は未配置。下記u186のcompound保留は履歴とし、この有限範囲だけ更新する。詳細は06/API handoff末尾u187。

**u186 単独の否定過去感情（2026-10-11 JST・未配置）**：u178/u179の単独明示SELFに、安心しなかった/落ち着かなかった/嬉しくなかった/うれしくなかった、各「です」形と対応する「ませんでした/ありませんでした」の計12有限形を追加する。既存7本人主語＋完全節、memo単独span、explicit/current-input claim、required/should、共有核の主体/種類/negative/negationを照合し、PAST_FEELING/SELF/negative/feeling/pastと原文scalar/UTF-8/hash/source_partsを保持。安心はvalue/value/fact、他形はreaction/feeling/feelingの既存根拠を使い、共有核を書き換えない。

realizerは否定の過去形を表示し、安心の不在を苦痛や行動失敗と推論しない。後続の明示順序は既存隣接条件だけで保持し、因果/改善を補わない。引用/報告/夢/疑問/推測、句点後の認知/報告/撤回host、主語省略/他者/程度を保留する。行動後compoundの共有否定証明は未成立のため、本追加をcompoundへ適用しない。通常の矛盾補足を暗黙訂正にせず、訂正/撤回/未知文/別sourceを橋渡ししない。丁寧さ/同義表記差は同義比較、肯否定差は内容差として保持。従来節の「否定は未対応」は履歴として残し、この単独有限範囲だけ更新する。

最終Analysis 4suite389 tests／3282 subtests成功（47.13秒）、生成7全文と実RN表示modelの本文/identity/node順一致、実service＋合成RPCで否定5例の保存→再生成なし再読を確認。STRUCTURE_MAP_DELTA_NONE。共有/Emlis/公開契約/DTO/DB/RN変更0。入力不足の正常案内と省略主語分岐撤回を維持。実DB/本人実機/商品受入れは未確認。最新weeklyの実機生成→保存再表示を活用追加の完成待ちにしない。詳細は06/API handoff末尾u186。

**u184 内容修正（2026-10-09 JST・未配置）**：先頭「その後/それから」付き常体の行動後3感情/名詞3変化を全文根拠に限定して保持。marker内の助詞誤認と、Emlisで順序をsupport断定へ変える連動問題を既存3owner内で補修した。引用/伝聞/夢/後続hostは保留し、丁寧形・原文/主体/前後順序・訂正/撤回/比較/保存再読を維持。Analysis370＋共有限定432 tests／3099 subtests、current identity1成功、既存実保存fixture3skip。Analysis8全文と実RN表示model一致、Emlis4全文と全recovery/独立inverseを確認。STRUCTURE_MAP_DELTA_NONE。配置/本人実機/商品受入れは未確認。次は追加活用網羅より指定修正版の生成→保存再表示の実機到達を優先する。詳細は06/API handoff末尾u184。

**u183 読点なしmarkerの格誤認補修（2026-10-09 JST・未配置）**：既存全文証明済みの丁寧3感情/名詞3変化compoundについて、明示SELFに先行する単一markerを格検索範囲から除く。`それから` 内の「から」を助詞と取り違える欠落を直し、原文/全operator/証拠座標は変更しない。generic endpointの検索位置は0不変。常体への試行拡張はEmlisのsupport断定を実測したため不採用とし、別残件を明示。Analysis370＋共有312、3013 subtests、identity1成功、実保存runtime未設定3skip。合成8全文/RN一致、合成RPC保存再読と訂正/撤回/読点差比較、独立readerを確認。STRUCTURE_MAP_DELTA_NONE。未配置・実DB/本人実機/商品受入れ未確認。詳細は06/API handoff末尾u183。

**u182 先頭marker＋丁寧形の共有根拠（2026-10-09 JST・未配置）**：u181の別残件だった「その後／それから」で始まる完全SELF行動＋後/てから＋丁寧3感情、または減りました/増えました/戻りましたを、共有finalの有限形判定で認定する。原文scalar/全文/帰属/required pairを保持し、Analysis既存u181の前後順序へ接続する。新prefix付き名詞変化では夢・両field報告・後続の認知/撤回hostも拒否し、旧prefixなし経路を拡大しない。Emlis作者と独立readerはmarkerを残して直後のSELFだけ省略し、原source bytesへ復元する。因果/supportは追加せず、感情の省略主体や名詞の「自分」を改変しない。

Analysis370＋共有256 tests／2970 subtests、current identity1成功、実保存runtime未設定の既存3 skip。合成8本文/RN model本文・identity一致、実service＋合成RPC保存再読。未配置・実DB/本人実機/商品受入れ未確認。読点なし「それから私は…」等へ成功範囲を一般化しない。過去節の未完了記録は履歴として保持し、本有限範囲だけ更新する。詳細は06/API handoff末尾u182。

**u181 compoundへの前方明示順序（2026-10-09 JST・未配置）**：§3.8/本節の「前方接続は未対応」を、既存共有exact2核・required typed relationで全文証明済みの範囲だけ更新する。Analysisの行動側に既存2marker（その後/それから）を許容し、te形もmarkerを含む元source_partsを保持する。完全pairの両端/whole evidence一致後、初端を既存隣接判定へ登録することで前件→行動→結果→後続を同じ意味・原文で表示する。compound間も前の末端から次の初端へ接続し、出来事を集約して消さない。

前件のないmarkerを補完せず、内部順序と未確定表示を残す。未知文/希望/別field/source/撤回・訂正を橋渡ししない。teの過去表示は内部3証拠線に依存し、前方線だけでは認定しない。共有Plan/Emlis/API/DB/RN変更0。先頭marker＋丁寧3感情や一部名詞変化等の共有pair未成立は別残件。Analysis366 tests／2927 subtests＋identity1成功、8全文/RN一致、合成RPC保存再読を確認。未配置・実DB/本人実機/商品受入れ未確認。詳細は06/API handoff末尾u181。

**u180 丁寧形の行動後compound（2026-10-09 JST・未配置）**：明示SELFの完全な実行済み行動＋後/あと（に）、またはて/でから、＋落ち着きました／嬉しかったです／うれしかったですを共有final pairへ限定追加する。格付き名詞1〜2項、原文全文一致・文境界・帰属・有限活用を証明し、引用/報告/夢/疑問/句点後の認知・撤回hostを保留する。Analysis compiler変更0で既存PAST_FEELING/feeling/past、右端の省略主体非推定、OBSERVED_ORDERと原文証拠、後続の明示順序、補足/訂正/撤回/期間比較を維持する。

Emlisは既存source-owned action/changeの原文順序を全recoveryで実現し、行動によるsupportへ広げない。MATERIAL_WEIGHT、または新3形だけのRELATIONAL_NONCOLLAPSEを、既存作者のfocal関係検査と独立readerの同一関係検査で受ける。有限丁寧語尾を常体へ戻し、感情の明示SELFをEmlis自身の発話にしない。既存名詞変化の右端「自分」などは除去しない。最終5suite565 PASS／2889 subtests／3 SKIP、合成8全文/RN model一致、保存再読を確認。u179のcompound見送りは履歴として保持し、この有限範囲を更新する。実DB/本人実機/商品受入れ未確認。詳細は06/API handoff末尾u180。

**u179 丁寧形の単独過去感情（2026-10-08 JST・未配置）**：u178の単独明示SELFに、落ち着きました／嬉しかったです／うれしかったですを追加する。前者は共有global positive語形に不在でreaction既定negativeとなるため、既存shared finalのno-projection部で、explicit/current-input claim、required/should、memo単独span、current_user/reaction/feeling/negative/feeling/current_inputと全文有限形を照合してpositive/positive_change/current_changeへ補正する。global keyword regex・pair投影・Safetyは変更しない。

新3形全てのAnalysis受理に、同じshared source-host証明（明示本人主語、原source一致、文境界、引用/報告/夢/疑問/後続依存接尾の保留）を要求する。既に共有positiveの嬉/うれ2形も報告prefix検査を省略しない。PAST_FEELING/SELF/positive/feeling/past、原文出典、既存の後続明示順序を保ち、丁寧さだけを期間差にしない。主語省略/程度/否定/他時点を推測しない。

行動後compoundの3丁寧形追加は未採用。試行でEmlisに「行動が感情を支えている」という根拠のないsupport断定が新たに生じたため、pair追加を撤去して従来の保留を維持した。この欠落とsupport説明の修正を一体の残件とする。Analysis358 tests／2799 subtests、共有限定134＋current identity1成功、8全文/RN model一致、保存再読とEmlis6全文を確認。実DB/本人実機/商品受入れは未確認。詳細は06/API handoff末尾u179。

**u178 明示SELFの単独過去感情（2026-10-08 JST・未配置）**：この節の従来の単独感情保留を、完全な本人主語（私/僕/ぼく/俺/おれ/わたし/自分は、既存主語読点可）＋既存5有限形に限り更新する。memo単独span・全文境界・explicit/current-input claim・required/should、current_user/positive、安心はvalue/value/fact、他形はreaction/feeling/feeling、positive_change/current_change等の共有witnessを照合する。fragment/range/thread/dependency付き核は保留。pastは全文有限形から確定し、共有current_inputを現在時制にせず、actor既定値から主語省略をSELFにしない。元のscalar/UTF-8/hash/source_partsとPAST_FEELING/feeling/pastを保持する。

この完全SELF感情の証拠IDを、既存の同一field・隣接・明示「その後／それから」・後続fact/pastによる順序起点へ追加する。未知文・希望・別source・撤回/訂正を橋渡しせず、原因や改善を補わない。句点/改行/semicolon等の直後に「わけではない／と思う／とは言えない」等の依存接尾が続くときは、新しい単独許可だけを保留して未解析hostを切り捨てない。これは任意の後文による訂正の一般理解ではない。主語省略、落ち着きました等の未認定形、否定/程度修飾、夢/伝聞等の既存境界は維持する。

Analysis355 tests／2685 subtests PASS、7合成全文と最終実RN model一致、実保存service＋合成RPCの再生成なし再読を確認。公開契約/共有owner変更0、未配置・実DB/本人実機/商品受入れ未確認。詳細は06/API handoff末尾u178。

**u177 感情末尾の後続順序（2026-10-08 JST・未配置）**：u176の後続接続条件へ、既存完全pair内の末尾PAST_FEELING/feeling/pastを追加する。非撤回・両端fragment受理・全文終端一致の下で、その証拠IDだけを感情の起点として認め、次の完全fact/past節に同一fieldの「その後／それから」と文末区切りだけの隣接根拠がある場合に接続する。感情をfactへ変換せず、SELF/UNSPECIFIED、内部3証拠/後続2証拠を保持する。単独感情・未認定活用・他者・推量・未解析介在・別source・撤回/訂正への橋渡しはしない。原因や改善を補わない。

u176 §3.8のPAST_FEELING保留は本範囲で更新し、複合文への前方接続は未対応を維持。既存保存結果の再生成や公開契約変更はしない。Analysis349 tests／2417 subtests PASS、7合成全文と実RN model一致、実保存service＋合成RPCで再生成なし再読を確認。未配置・実DB/本人実機/商品受入れ未確認。詳細は06/API handoff末尾u177。

既存の共有action/change完全pairを消費する同じcompiler/realizer内で、右端の安心した/安心しました・落ち着いた・嬉しかった/うれしかったを有限形として解釈する。明示本人主語はSELF、省略主語はUNSPECIFIEDを保つ。Analysisの結果型はPAST_FEELING/feeling/past。共有側で安心はfact、他3lemmaはfeelingとなるwitnessを正確に照合し、一律factへ変更しない。

元全文2核・required relation・exact範囲・明示接続の条件を維持する。safeラベルは型から「〜（記録された気持ち）」と再構成し、本人の実行、改善/悪化評価、原因へ昇格しない。te形の実行表示は同一source/field/spanの自身の順序線と右端過去結果・元全文証拠が必要。PAST_FEELINGは既存結果nodeへ投影する内部型で、公開DTO/DB/RN契約へfieldを追加しない。

補足全文、全文引用訂正/撤回、反復episode、保存後の再生成なしを既存経路で維持。共有未認定形（ほっとした/落ち着きました）、程度修飾、否定、夢/伝聞/推測、単独感情、たら/3節はこの解釈を許可しない。関連116検査・6合成出力の既存RN本文一致を確認。一般感情理解・商品受入れ・稼働配置は未完了。

### 3.11 u110 明示された本人の過去の所在

既存compiler/realizerで「私/僕/わたし/自分は＋既存名詞句＋に＋いた/いました/いなかった/いませんでした」の完全節だけをSCENEへ接続する。内部scene_state=PAST_PRESENCE、actor=SELF、modality=fact、time=pastを保つ。共有側はrequired/explicit/current_input scope、memo単独span、event predicate/current_user/fact、肯定neutralまたは否定negative、past/current_input時制が必要。fragment/range/dependency付き核は対象外。shared actor既定値やni格単独から所在を推論しない。pastは全文有限形から読む。

ledgerの全文span一致に加え、parser field上の前後が句点/改行/field端に接することを確認する。72字超の読点・固定長分割や関係prefixで切られた断片を、夢/修飾から独立した事実にしない。全文訂正時のparser viewは既存の対象証明を継承し、証拠scalar/UTF-8は原回答のまま保つ。

表示は「職場にいた／いなかった（記録された場面）」等を型から再構成。行動・勤務・所属・役割・因果は補わない。後続する本人過去行動の「その後/それから」は既存明示順序の条件だけで接続する。通常補足の完全解釈、同じ所在の反対極性の保留、全文訂正/撤回、独立記録件数、保存後の再生成なしを維持する。公開DTO/DB/RNに内部型を追加しない。

今日/昨日/その後付き所在、現在/未来/願望、他者/疑問名詞/夢/引用/伝聞/推測/未解釈修飾、memo_actionは対象外。ROLEは未実装。関連124検査・305 subtests、6合成本文の既存RN一致を確認。一般場面理解・商品受入れ・稼働配置は未完了。

### 3.12 u111 明示された本人の過去の担当

**u173共有側補正（2026-10-08 JST・未配置）**：過去所在（§3.11）と担当の完全名詞修飾「難しい」を、独立した難しさ/制約と区別する。既存共有Planのkind選択とoperator生成で同じ判定を使い、完全名詞＋に＋過去所在5形、または完全名詞＋を＋過去担当5形だけはconstraintへ分類しない。難しくない等の別形、無理/制約/限界、独立述語、未閉包・格違いは従来判定を維持。Analysisの原文・主体・極性・時点・帰属条件は緩めず、修飾を削除したり遂行能力/負担へ変換したりしない。旧「難しいイベント企画を担当した」の保留期待1件を、今回回復した完全なROLE・対象・肯定過去の確認へ更新。最終422限定検査PASS、合成Analysis9全文と実RN表示model一致、保存再読/Emlis5全文確認。未配置・実DB/実機/商品受入れ未確認。詳細はAPI handoff/06末尾u173。



既存compiler/realizerで「私/僕/わたし/自分は＋既存名詞句＋を＋担当した/担当しました/担当しなかった/担当しませんでした」を完全解釈し、内部role_state=PAST_RESPONSIBILITY、SELF/fact/pastと正負をROLEへ投影する。担当関係は述語が根拠であり、名詞の職業/肩書き分類表や「私はNです」から推測しない。safe表示は「〜を担当した／担当しなかった（記録された担当）」で、恒久身分・能力・責任感・担当対象の実行完了を補わない。

u110の共有generic event witnessと文境界処理を共通化。explicit/current_input claim scope、memo単独span、event predicate/current_user/fact、対応する極性、past/current_input時制、fragment/dependencyなし、完全な本人有限節と元scalar/UTF-8証拠が必要。ROLEだけretention=required/shouldを許可する。共有保持ownerは4節以上で普通の明示本文をshouldへ下げており、grounding/claim scope/certaintyとは独立している。共有retentionを書き換えず、optional断片は拒否し、SCENEのrequired条件も変えない。

場面/役割/考え/行動/結果を同じ記録から残しても、段階の順序を自動生成しない。後続「その後/それから＋本人過去行動」や既存action/change pairだけが既存の明示順序へ接続する。補足全文・同じ担当の反対極性保留・全文訂正/撤回・独立記録件数・正負別node・保存後の同一文章/図を維持。内部型はDB/公開DTO/RNへ追加しない。

前置時点、現在/未来/願望/可能、他者/疑問/引用/伝聞/推測/夢/未解釈修飾、memo_actionは対象外。「記録を担当した」のような名詞keyword由来のshared actionも今回保留。関連129検査・359 subtests、6合成本文の既存RN一致を確認。一般ROLE理解、注記/比較/IF、商品受入れと稼働配置は未完了。


**u170限定更新（2026-10-08 JST・未配置）**：上記u111の「記録を担当した」保留は当時の状態。既存の完全なPAST_RESPONSIBILITYについてのみ、共有kind/predicate_kindがaction/actionでoperator:actionを持つ一貫した根拠も受理する。名詞の記録/メモに由来する共有分類差で本人過去担当を落とさない。全節/原文証拠、explicit/current_input claim、required/should、memo単独span、current_user/fact、対応極性、past/current_input、fragment/dependency拒否と帰属境界は維持。ROLEは「担当する」から作り、shared performed_actionを担当対象の実行完了へ投影しない。SCENEのevent/event条件は不変。既存の読点/相対日/属格対象・更新/比較/保存にも同じ限定修正を適用し、旧保留4期待をpositiveへ変更。最終Analysis330 tests／2176 subtests、合成9全文と実RN表示model一致。一般ROLE理解・実機・商品受入れの完了ではない。詳細はAPI handoff/06末尾u170。


**u172共有側補正（2026-10-08 JST・未配置）**：完全名詞＋を＋既存過去担当5形で閉じる場合、名詞修飾の良いは独立valueへ、名詞の記録/メモ等はactionへ分類しない。共有Planのkindとoperatorを同じ判定に揃え、memoの担当はevent/event・肯定neutral/否定negative・action/performed_actionなしで保持する。u170のaction分類の説明は当時の状態であり今回この限定範囲を更新。Analysis専用sourceの根拠条件は変更0、u170のcoherent action受理と改変拒否検査も保持する。実書字/独立value/未閉包hostとmemo_actionの既存条件は不変。最終392限定検査、合成Analysis9全文と実RN model一致、Emlis5全文確認。担当の意味を作業実行に置換しない。詳細はAPI handoff/06末尾u172。


### 3.13 u112 同じ原入力内の肯定・否定と未確定な機会

既存のconflict_badges契約へ、同じ原入力source/field/相対日にある、完全命題が同じSELF過去factの正負を接続する。対象は既存SCENE/ROLE/ACTION_OR_NONACTION。元の記録を同じ機会だと断定せず、真偽を選ばず、両nodeを対象とした未確定表示にする。別record/field/day/対象、明示順序参加、接続語、従属形、願望/認識は除外する。通常補足の正負不一致は従来どおり保留し、引用訂正/撤回の除外を比較より先に適用する。

ObservedConflictはtarget_refs・exact evidence_refs・閉じたreasonを持つAnalysis内部型。private保存は証拠位置とhash等のallowlistだけで、原文/名詞/propositionを加えない。safe DTOは既存conflict_ref/target_refs/visible_labelだけ。本文は同じDTOから組み、既存RNと一致させる。保存validatorは非空badgeの形・2対象・重複・表示文を確認し、旧空badgeの読取時再生成は行わない。DB/DTO/RN契約変更なし。

135検査・379 subtestsと既存RN11検査PASS、6合成出力の同じ本文/identity/順序/badge件数を確認。Auth/DB I/Oは合成で、今回の修正版は未配置。§3.2のconflict未接続をこの限定範囲で更新する。一般的矛盾・注記・期間比較・IFの完成ではない。

### 3.14 u113 希望と明示された現在負荷の非連続注記

§8のSOURCE_EXPLICIT_ANNOTATIONを最小範囲で接続。既存願望grammarのSELF/current/positive/wishと、明示SELFのつらい/苦しい（です形含む）が一文で対比される場合に限る。shared exact2、finite contrast feeling、contrast relation、元文の完全境界と接続語を照合する。negative極性だけで負荷を推測しない。負荷をroute node/順序edge/因果へせず、対象の希望nodeにBURDENを付ける。

Analysis内部ObservedAnnotationは対象、原文両端と対比全文の3 evidence、SOURCE_EXPLICIT_ANNOTATION、原因/継続期間の未確定、禁止昇格、更新refを保持する。同一対象/同一述語のbadgeは集約するが各source証拠を残す。型付き負荷核だけを消費し、他の未知scopeを消さない。通常補足の全文coverageと全文訂正/撤回へ同じ完全pair証明を使う。撤回されたsourceだけを除外し、別記録の注記を消さない。

safe DTOは既存annotation_ref/target_ref/kind/visible_labelのみ。原節/述語/対象/3証拠を照合して表示文を再構成し、既存RNと同じ順で本文へ含める。private保存はraw/source_labels/predicate_lemmaを含めない。保存validatorはBURDEN/既存thought対象/閉じた表示文/重複/shapeを確認し、旧空注記も読取時再生成しない。DB/DTO/RN契約変更なし。

関連143検査・447 subtests、既存RN11、6合成本文/identity/注記target一致。Auth/DBは合成、未配置。PROTECTIVE・解釈仮説・一般の負荷理解・期間比較・IFは対象外。複数記録で重複する既存未確定表示は別の具体的改善候補として残す。

### 3.15 u114 同一未確定表示の期間集約

**u185限定表示更新（2026-10-09 JST・未配置）**：以下u114のscope完全一致だけの表示集約を、既存の通常不足段階に限り拡張する。同一の順序付きbetween_node_refs・NOT_ESTABLISHED_FROM_SOURCE・NODE_KINDSの複数scopeを、初出gap_ref/表示位置に「確定していない項目：場面、考え・注意。」のように全項目を列挙してまとめる。複数記録から別々の不足が来る場合もあるため、同一記録で全項目が同時に欠けたと断定しない。単一scopeは旧文面を保持。別対象/対象順/理由、SOURCE_SCOPE、ROUTE_CONNECTIONはこの束ねへ入れず、従来の完全一致dedupeだけを継承する。private全gap・graph・証拠・訂正/撤回・比較意味・DTO形・保存readは変更しない。新生成のprivate/safe projectionのみへ適用し、旧保存本文/identityを再生成しない。実例の訂正後6→5行、撤回後5→3行、同じ希望の2記録4→1行（private8gap維持）。最終集合374 tests／3103 subtests成功、生成8＋旧保存1全文と実RN表示model一致、訂正/撤回後の実service＋合成RPC保存再読を確認。実DB/実機/正式商品受入れ未確認。詳細は06/API handoff末尾u185。

**u171表示補正（2026-10-08 JST・未配置）**：ROUTE_CONNECTIONのうちEXPLICIT_PREDECESSOR_NOT_ESTABLISHEDは「この記述がどの内容に続くのかは、この記録からは確定していません。」と表示する。二つの内容の順序不明を表すONLY_EXPLICIT_ORDER_IS_SHOWNとは別の不明点として保持し、統合/削除しない。対象・ID・順序・重複判定・private graph・期間比較は変更0。新生成時のprivate/safe表示だけに適用し、既存の保存済み文面を再生成/書換えしない。最終Analysis333 tests／2185 subtests、合成6全文と実RN表示model一致。実DB/実機/商品受入れ未確認。

同じnodeへ集約された複数記録から、対象/不足範囲/理由が同じ未確定項目を繰り返し表示しない。ObservedGraphとprivate保存は全gapを保ち、生成時のprivate/safe projectionだけで順序付きbetween_node_refs・missing_scope・reason_codeの完全一致を初出gap_refへまとめる。ラベルだけのdedupeは禁止を維持し、別対象・別理由・対象順の差を消さない。

safe DTOの構造、文章/図の単一artifact、元の証拠と記録件数を変更しない。_text_from_visualや保存readへこの集約を適用しないため、旧保存artifactは旧本文/DTO/identityのまま読める。欠番のあるgap_refは既存API/RN contract内。原graphの再解釈、旧保存の書換えは行わない。

2記録の同じ希望でvisible8→4/private8保持を確認。別対象/未読内容、理由/対象順、新規保存再読取、旧保存互換を含め関連148検査・447 subtests、既存RN11 PASS。新規3＋旧保存形式1の本文/identity/unknown対象をRNと照合。Auth/DBは合成、修正版未配置。§3.14で残した重複表示の不足をこの範囲で解消する。

### 3.16 u115 明示された現在の保護意向

明示SELF（私/僕/わたし/自分）は＋既存名詞句＋を＋守りたい/守りたいですを全文解析する。共有explicit/current-input/requiredまたはshould、wish nucleus、current_user/positive/wish/current_inputとoperator:wishを要求。共有predicate_kindはwish、または名詞「気持ち」等でoperator:feelingも存在するfeelingに限定する。文の一部、他者発言/伝聞/夢の未解決な帰属、否定/過去/推測/未解釈修飾/複文、memo_actionからこの意向を作らない。共有意味ownerや一般の守る活用文法は変更しない。

希望nodeと同じ全文証拠でPROTECTIVE / SOURCE_EXPLICIT_ANNOTATIONを作り、対象別に集約して全記録と更新refを保持する。原文にない保護成果、他の行動の動機、原因、性格、診断、route順序へ変換しない。通常補足と完全引用訂正/撤回は既存のsource更新を通し、撤回された原spanを再利用しない。

safe表示は対象nodeを「家族を守ることへの希望」等、注記を「守りたいという意向の記録です。実際に守れているかは確定していません。」とする。RN見出しは「守る対象」。realizerは対象の完全希望形・意味・同一全文証拠、保存validatorは希望対象と規定表示を照合する。既存4key annotation DTO、単一artifactの文章/図、private evidence分離、旧保存readを維持。別対象のBURDENとの共存は可能だが、一般的な保護行動や複文の保護意向の解釈は未実装。

関連156検査・509 subtests、RN12 PASS。6合成本文の全文読取とbackend/RN本文・identity・node順・注記target照合、実生成→合成RPC commit→再生成なしreadを確認。Auth/DB I/Oは合成、修正版未配置。一般の注記/期間比較/IFの完了や商品受入れへ換算しない。

### 3.17 u116 同じ条件の二期間を比較する開発preview（当時の履歴）

内部AnalysisObservedMapRequestにoptional comparison_previous_requestを追加し、既存engine.generate入口で同じruntime/policyの現在/前期間を独立生成する。生成済み保存本文/DTOや旧policyのartifactを入力として再解釈しない。別owner、入れ子比較、不正/空/安全に表示できない前期間は拒否/UNAVAILABLE。現在artifactを初めて外へ返す前に§9.1のtyped PeriodComparisonをinline保持し、前artifactもprivate outcome.previous_artifactへ保持する。既存公開DTOへ前artifact ref/source locatorを流さない。

COMPARABLEはUTC正規化した等長の直前隣接半開区間に限定。長さ違い、逆順、重複、非隣接、同一included record identityの再使用はNOT_COMPARABLE・理由あり・change_claims0。changeは既存4kind、両artifact/source-set refと差分を支えるevidence IDを持つ。nodeは命題の対象/格/述語/型/極性/様相/時制/相対日・明示接続、edgeは方向付き順序または無方向共起、注記はkind/対象意味/述語、不一致は対象意味集合を比較する。ID、source位置、丁寧形、成立pastへ解決済みのte依存形、記録件数差そのものを差分にしない。

unknownは仮anchorや表示用の隣接pairから偽差分を作らず、不足scope/reasonの種類集合に限定する。明示先行欠落だけは実際にその記述へ結び付くため対象意味も比較する。原graphの対象/全証拠は保持し、未読内容全体や反復頻度を比較済みとはしない。差分なしの説明は「今回比較した記述内容では差分を検出していません」とし、本人の状態が不変とは言わない。差分ありも記録上の違いとし、改善/悪化/原因/達成へ変換しない。

ASTOR既存prepare_saved_analysis_observed_mapは任意の前期間boundsを同じauth/report_modeで読み、両source snapshotを既存recheckで再確認してからsafe本文/DTOを返す。これは認証付きread-only開発entryで、公開HTTP routeや保存writerを追加しない。RNは既存比較3keyの4kind/理由をカードと同一本文へ表示。NO_PREVIOUSでは旧本文を変えない。

関連166検査・541 subtests、RN13 PASS。両期間の原入力/補足/権限変化で結果を保留し、6合成本文のbackend/RN一致を確認。Auth/DB I/Oは合成、未配置。現在の保存guard/read/無効化は当該一期間だけを守るため、保存validatorのNO_PREVIOUS限定は維持する。比較の永続保存/API接続には前期間の訂正/削除/期限切れも反映する依存処理が必要であり、previewの二度読みで保存競合を閉じたとは扱わない。

### 3.18 u117 比較のimmutable保存と既存APIへの接続候補

既存analysis_observed_artifacts一表のまま、直前等長期間を内部導出するcomparison_snapshot RPCを追加。単一statementで両source集合を取得し、両guardを比較専用namespaceへ結合する。既存commitは元のREAD COMMITTED/auth→source table lock内で再確認、readは両期間の鮮度・tier・保持期限を確認し保存済本文を返す。無効化triggerは前期間の原入力/補足の追加・変更・削除も対象にする。旧単期guard/行/RPC署名/public DTOは維持する。

private-evidence.v2はcurrentのallowlisted graph/source_membersにcomparison_dependencyとtyped比較、previous_evidenceをinlineで加える。前artifact/source-set参照を同一行で解決でき、原文/命題/visible labelをprivateへ追加しない。current/previousの公開投影を混在させず、API/RNは既存比較3keyだけを扱う。空前期間はNO_PREVIOUSでも依存を保持し、後日追加で失効する。前期間に実記録があるが生成不能の場合は失敗を保つ。

前期間だけが保持期限外のときは明示comparison_eligible=falseとし、現在の単期分析を利用可能にする。保存済比較の期限切れはguard不一致で非表示。一般の認可/通信/生成エラーから単期へfallbackしない。等長計算はUTCに限定し、既存単期guardのsession timezone契約は変更しない。

serviceの比較生成flagはCOCOLON_ANALYSIS_PERIOD_COMPARISON_MODE、developmentだけ有効、既定off。新migration20261004041627は未適用で、稼働DB/API/端末への効果0。対応SQL→対応API→有効化の順で個別対象の判断が必要。flag offは新規比較生成の停止で、旧API版の比較read互換を保証しない。関連173検査・548 subtests、隔離PGlite58項目、RN13検査、3保存本文の一致を確認。live DBや独立同時接続での競合・実機の商品受入れは未検証。全file/責務はcurrent03 §4.23、実行記録は06/API handoff末尾u117。


### 3.19 u118 場面/担当に付く記述時点と明示接続

既存PAST_PRESENCE/PAST_RESPONSIBILITYの完全SELF過去節へ、単一の今日/昨日/その後/それからを接続する。解析入口とfragment witness入口を同じprefix保持関数へ揃え、全文の元source_partsを維持。TODAYの共有presentは記述日のwitnessとして限定許可し、有限形のpast/正負は不変。SCENE retention・ROLE required/shouldの既存条件を維持する。safeの場面/担当にも同じprefixを投影し、元の完全命題へ再照合する。

日語はsource-boundで、別sourceや後続節へ継承しない。日語だけで順序を作らず、既存の隣接完全節と明示接続からのみOBSERVED_ORDERへ接続。A→B→Aは3occurrence、訂正/撤回後の中間を橋渡ししない。開いた伝聞/夢や主語後の日語を名詞として誤採用する形は保留する。複数prefix/主語後日時/一般日時を新対応としない。

関連181検査・606 subtests、既存RN13検査、合成6本文の同一text/identity/node・edge順を確認。保存/再読取は実service＋合成Auth/DB I/O、実機未検証。新規path/共有owner/API/DTO/RN/SQL/依存変更0。u117の未適用SQL/対応API配置を完了とはしない。全file/責務はcurrent03 §4.24、実行記録は06/API handoff末尾u118。

### 3.20 2026-10-10 直前の文法拡張方針を撤回

Mashの18:19 JSTの訂正により、直前に追加した行動欄の省略主語・仮名反復過去形の分岐を撤回した。API `4bb37a0afdc020576b0c1e33fa454674fd5b36c7` は配置候補ではない。compiler/realizerと専用vertical検査を直前の631c状態へ戻し、生成条件を緩めない。旧検証結果はAPI運用記録§37の経緯としてのみ保持する。

### 3.21 2026-10-10 分析に必要な入力不足の正常な待ち状態

既存engineがsource freezeとgraph compileを終えた後、現在期間のnodeが0件で `UNAVAILABLE`／`analysis_observed_route_not_established`／artifactなしを返した場合だけ、保存serviceは「まだ分析を表示できる情報がない」状態として扱う。件数・文字数の新しい閾値を設けず、分析要素を補って生成しない。

latest/月次ensureはHTTP200・status=ok・reason=insufficient_input・skip_reason=analysis_insufficient_input、refreshed/has_visible_content/history_saved=false、本文/meta/title/生成時刻nullを返す。保存commit・未完成map・不足案内のDB保存は行わない。既存の正常空期間、ensure=false/read_onlyの保存不在はno_visible_contentを維持する。内部処理/前期比較/無効source/権限/通信・保存障害は情報不足へ変換しない。force再生成の不足で古い結果をfallback表示しない。

RNの既存わたしマップ画面は、整合した不足状態だけに「入力情報が少ないため、まだ分析を表示できません。」を通常表示する。分析renderer/出力/既読登録を呼ばず、後日の成立結果へ通常更新できる。HTTP失敗や矛盾したDTOをこの文言で隠さない。今回の変更は保存schema・共有意味作者・語彙を変えず、既存API値と画面分岐の追加に限定する。検証と指定配置・nativeビルドはAPI運用記録§38。


### 3.22 u192 名詞内部の相手・場所との関係を保つ過去行動

「同僚からの資料を調べた」「家族への手紙を書いた」等について、既存共有意味根拠を持つ明示SELFの完全な過去事実節をAnalysisへ接続する。名詞内部のからの/への/との/でのは一つの対象の一部として意味identityと原文に残し、別の相手・場所の項へ読み替えない。否定を保持し、対象の方向が異なれば同じnodeに集約しない。同じ期間の意味一致は既存方式で集約し、順序は元記録に明記された範囲だけ、共起は無方向のままとする。

過去事実以外の希望/認識内容/te依存節、未解釈の時点・範囲、疑問、他者の発言・否認等は拡張対象外。新規に読める過去節にも前後の帰属/否認確認を適用する。runtime owner/API/DTO/DB/RNは追加しない。新規検査fileの責務はcurrent Analysis §4.25、実行証拠は06/API handoff u192を参照。元の28日例の未対応と全体ルートUI、本人生成→保存再表示は未完了。

### 3.23 u193 明示順序の後にある本人の過去感情を保持

既存の有限過去感情が「その後／それから」付きの単独本人節でも欠落しないよう、完全なSELF主語・有限形・共有根拠と原文座標を保持する。日語との複合、主体省略、他者、引用・伝聞・否認、compound右端内の接続語追加は新たに解釈しない。順序線の右端に使えるのは、既存の全文/同一field/隣接/時制/撤回条件を満たす過去感情だけ。接続語があっても相手の節が確定しなければ接続先不明を表示し、原因・支援・改善を推定しない。

共有の3丁寧形の肯定根拠は同じ二接続語と完全SELF節に限定し、先行話者・後続の明示話者/否認とsource bytesを確認する。既存Emlis品質gate、語彙全体、主体推定を広げない。本文と図は同一命題から接続語・肯否定を表示し、訂正/撤回後に古い線を復活させない。実行証拠は06/API handoff u193。STRUCTURE_MAP_DELTA_NONE。

### 3.24 u194 対象を明記した本人の過去決定を保持

「私は同僚と分担を決めた」等の完全SELF節に対して、決めた/決めました/決めなかった/決めなかったです/決めませんでしたの5形と、原文にある「を」対象を解析する。肯定は共有performed-actionと過去、否定は共有action/negationと完全な過去有限形を要求する。required/shouldを同じ意味根拠として扱い、後半の記述を表示優先度だけで落とさない。既存の今日/昨日・順序・名詞内部の関係を保持し、別fieldの先行話者も両方向に確認する。

既存9動詞の希望/認知内容/te inventoryは増やさず、決定のcompound、準備相、主体省略、未閉包hostは保留する。明示隣接順序・訂正/撤回・集約・比較・保存は既存ownerで処理し、決定の実行を達成、改善または相手との合意へ昇格しない。製品変更はAnalysis intent_compiler.pyだけ。STRUCTURE_MAP_DELTA_NONE。実行証拠と未対応の主語後「昨日、分担」・否定決定後の感情witnessは06/API handoff u194。本人実機・全体ルートUI・商品受入れは別残件。

### 3.25 u195 明示本人の過去準備を通常決定と区別して保持

既存Analysis compilerの過去決定inventoryへ「決めておいた／決めておきました／決めておかなかった／決めておかなかったです／決めておきませんでした」を追加。lemmaを「決めておく」とし、準備相を本文と意味identityに保持する。単なる「決める」と同一化せず、準備をしなかったことから決定自体の不存在を推定しない。完全SELF・を対象・共有行動/否定根拠・原文全文・帰属/否認を既存境界で検証する。compound、意図、希望、推量、主語省略、副詞の新解釈へ拡大しない。

調べた→決めておいた→安心したの同入力は2node/0edgeから3node/2edge、6節例は4node/2edgeから6node/5edgeとなった。期間比較では通常決定との違いを保持し、訂正/撤回後の古いnode/線を復活させない。分析4suite 421 tests／4149 subtests PASS、合成10例の前後全文比較、生成8例と実RN表示modelの全文一致、実service＋合成RPCの保存→再生成なし再読を確認。共有owner/realizer/API/DTO/DB/RN/製品依存は変更0、STRUCTURE_MAP_DELTA_NONE。主語省略等の元28日例・全体ルートUI・本人実機・商品受入れは残件。詳細は06/API handoff末尾u195。

### 3.26 u196 日付後の複合名詞と暦接尾辞の境界（2026-10-11・未配置）

「私は昨日、分担を決めておいた」「私は昨日、分室にいた」「私は今日、分類を続けたい」の先頭名詞を、日付接尾辞の「分」と取り違えない。既存compilerの行動/希望と場面/担当で同じ判定を共用し、区切りあり・一致が分だけ・後続漢字/カタカナを持つ完全名詞に限定する。既存全文文法、SELF、日付、肯否定、準備相、各node型と原文座標は維持する。無区切り/分単独/分の/朝/午前/以前等は従来の保留を維持する。

日付を解釈できても話者が本人とは限らないため、日付付き同名詞には既存の前後hostと別field帰属判定を適用する。前置き日付も同じ保護対象。希望を実行済みへ変換せず、後続へ日付を継承せず、未読文/別記録/訂正/撤回を越える順序を作らない。新しいsubject推定、API/DTO/DB/RN契約は追加しない。

最終4suite 426 tests／4263 subtests PASS。合成12例の実出力比較、生成9全文の実RN表示model一致、実service＋合成RPCで4ルートの保存後再生成禁止readを確認。詳細は06/API handoff末尾u196。STRUCTURE_MAP_DELTA_NONE。未配置・本人実機未確認・商品受入れ未完了。主語省略/副詞と全体ルートUIは未対応であり、本修正を実機確認の新しい前提にしない。

### 3.27 u197 主語未確定の決定と書かれた修飾の保持（2026-10-11・未配置）

既存Analysisの過去決定/準備形と完全な「を」対象を再利用し、主語省略時だけactor=UNSPECIFIEDとして内容を保持する。共有frameのcurrent_user既定値を本人の証拠にしない。明示SELFは従来どおり区別し、希望/能力/義務/推量/他者の報告/否認や未対応形を完了行動へ変換しない。全文有限節、共有performed/否定witness、原文座標、前後/別fieldの帰属判定を維持する。

「今回は」「事前に」を既存private propositionのwritten_modifiersに保持し、意味identityとsafe labelへ反映する。今回は日付に変換せず、事前にから関係先や因果を作らない。主体未確定なら「（誰の行動かは未確定）」と表示する。対象文は「今回は、事前に同僚と分担を決めておく（実行済み）（誰の行動かは未確定）」となる。新分岐で消費できない/重複した「事前に」を名詞項へ転用しない。

主体未確定の決定はevidenceごとに別nodeとして保持し、同じ人の反復や矛盾とみなさない。明示SELFでも「今回」はsource単位に分ける。期間比較は原文の意味を比較する既存keyを維持し、source/evidence IDを意味へ混入しない。書かれた順序だけを接続し、別field/別記録/未読内容/訂正や撤回を越える線を作らない。訂正後のactor/修飾/肯否定と保存後の文章/図の一致を確認する。

4suite 433 tests／4371 subtests PASS。実engineの合成12入力を前後比較し、生成10全文と実RN表示modelが一致。実service＋合成RPCの3ルートを保存し、再生成禁止readで同一本文/図を確認。詳細は06/API handoff末尾u197。STRUCTURE_MAP_DELTA_NONE：既存compiler/realizerの解釈・表現責務内で、公開DTO・保存schema・routeを追加しない。元28日/14記録全体と実機は再検証していない。一般的な主語省略行動・別修飾語順・全体ルートUI・本人生成→保存再表示・正式商品受入れは残件。

### 3.28 u198 完全な過去決定と報告の前置きの区別（2026-10-11・未配置）

「その後、私は同僚と分担を決めませんでした」の「の…でした」が共有の保守的な報告判定に一致し、後続の感情を落としていた。感情frameのvalue/current_inputは既存の許容形であり、それ自体が原因ではない。

Analysisの先行節判定では、既存の完全命題parserで明示SELF・過去決定/準備・fact/past・肯否定を確認できた節だけを報告導入から除外する。各節を独立に確認し、真の報告節と別fieldの話者は従来判定へ渡す。同じ判定を感情と後続決定へ適用する。未解釈名詞/時点、省略主体、他動詞、感情witness、原文座標、後続否認の扱いを拡大しない。

再現例は「調べた→決めなかった→安心した」の3node/2順序線を同一の文章/図へ保持する。不明な文を挟む場合は感情を残しつながりを補わない。訂正・撤回で古い感情と線を戻さず、保存再読でも再生成しない。

4suite 436 tests／4398 subtests成功、合成4全文の読解、実service＋合成RPC保存再読6ルートを確認。共有owner/公開契約/RN製品コードは変更せず、新規隔離CIだけをcurrent03 §4.26へ記載。共有の丁寧感情hostも通る「落ち着きました／嬉しかったです／うれしかったです」は今回の否定prefixに対して未修正。実機/正式商品受入れは未完了。06/API handoff u198参照。

### 3.29 u199 否定決定後の丁寧感情を共有hostで保持（2026-10-11・未配置）

u198のAnalysis内判定だけでは、共有の丁寧感情hostが同じprefixを再判定し、落ち着きました/嬉しかったです/うれしかったですを落としていた。共有Planの名詞報告検出分岐の内部で、任意の既存順序語1個＋明示SELFは＋完全名詞の格項1〜4個（を/に/で/と、重複なし・を必須）＋既存の否定決定/準備4形の全文一致を確認する。「の」名詞と各格項の「との」連体形1回までを許容し、一般否定語尾だけで報告を閉じない。

各先行節と別fieldを独立に判定するため、真の報告の前後に否定決定があっても感情を本人の事実へ昇格しない。後続否認・引用訂正/撤回・exact source/UTF-8/hash・既存の感情witnessは維持する。4形は決めませんでした/決めなかったです/決めておきませんでした/決めておかなかったですに限定し、日付・自由な副詞・省略主体・他動詞・からの/への/でのを追加しない。

調べた→否定決定→丁寧感情を3node/2順序線に保持し、unknownを挟むと感情は残し、未読区間をまたぐ線は作らない。Analysis4＋共有限定感情1suite 987 tests／4434 subtests PASS、current共有identity1成功。合成8例の前後と実RN表示modelを照合し、実service＋合成RPC保存再読6ルートを確認。共有owner1変更、STRUCTURE_MAP_DELTA_NONE。実DB/本人実機/正式商品受入れは未確認。06/API handoff u199参照。

### 3.30 u200 主語が書かれていない過去行動の保持（2026-10-11・未配置）

既存9動詞（書く/調べる/試す/見る/作る/残す/記録する/メモする/続ける）で、完全なを対象と過去肯否定が書かれた節を、actor=UNSPECIFIEDとして保持する。共有frameの既定current_userからSELFを推定せず、既存safe labelで「誰の行動かは未確定」を明示する。対象の内部関係、日付、原文証拠、肯否定を保持する。主体省略であることを理由に事実の内容全体を捨てず、主体が明示された節とは区別する。

新範囲は既存有限文法と共有explicit/fact/polarity・完全source境界を併用する。希望/非過去/認知/te複合文、自由副詞、今回/事前付き一般行動、を対象なしは対象外。未完主題「私は、」が改行/句点で分断された入力は、日/順序prefix付きも含め主体省略として採用しない。前後/両方向の別fieldの帰属、報告/夢/否認を保持する。省略否定行動をの…でしたの報告前置きと誤認するAnalysis内の判定だけを補修し、共有の丁寧感情判定へ拡張しない。

主体未確定の各occurrenceは集約せず、同一人物の反復/矛盾へ変換しない。明示された隣接順序、訂正/撤回、期間比較、保存再読は既存責任を再利用する。4suite447 tests／4529 subtests成功、合成8例の前後全文と実RN model一致、合成RPC保存再読4ルートを確認。STRUCTURE_MAP_DELTA_NONE、製品変更は既存compiler1だけ。実DB/実機/正式商品受入れは未確認。実行結果・既存期待の更新理由・残件は06/API handoff u200を参照。

### 3.31 u201 否定過去行動後の丁寧感情の保持（2026-10-11・未配置）

u200の省略主体の行動後でも、共有報告判定が「の…でした／です」を誤検出し、丁寧感情3形を落としていた。共有Planの既存名詞述語分岐だけで、既存9動詞・ませんでした/なかったです・完全なを対象と重複なしの独立格1〜4個・名詞内の/からの/への/との/での連結を持つ完全節を区別する。省略主体または明示SELF、任意その後/それから1個。これは先行節が報告を開始しないという判定であり、先行主体や後続感情の本人帰属を補完するものではない。

真の報告・他者・未完主題・前後/別field・訂正/撤回は従来どおり確認する。新しい日付/自由副詞/他動詞/主語省略の決定文法は追加せず、漢字名詞＋に等の既存格解析は維持。Analysis4suite451 tests/4558 subtests、共有対象76、owner identity1成功。合成8例の前後16本文と実RN、合成保存再読6ルートを照合。共有Plan1変更、STRUCTURE_MAP_DELTA_NONE。実行結果・共有Emlis影響・残件は06/API handoff u201を参照。

### 3.32 u202 日付付き否定行動後の本人丁寧感情（2026-10-11・未配置）

今日/昨日付きの完全な否定行動後で「の…でした」が報告と誤判定され、本人の丁寧感情3形だけ欠落していた。共有Planの通常否定行動分岐に、日→区切り→SELF、日→SELF、SELF→日→区切り、日→区切り→省略主体の4配置を追加。既存9動詞・否定2形・完全格項を維持し、日付は既存compilerだけで保持、感情へ日付/主体/原因を補わない。

日付重複/順序語混用・改行・他者・時刻/範囲・未解析時点/疑問名詞は新日分岐で保留する。SELFが日と対象を隔てる「朝の資料」、分担、明日の資料、今月号/今年度の完全名詞と、日付なしの既存文法は維持。訂正/撤回・真の報告・別fieldは既存帰属条件を通す。最終Analysis4suite455 tests/4628 subtests、共有対象49、owner identity1成功。前後16分析本文/実RN・合成保存再読9ルート・共有Emlis前後6全文を確認。共有Plan1変更、STRUCTURE_MAP_DELTA_NONE。日付付き決定等の残件・実出力・反映結果は06/API handoff u202参照。

## 3.33 u203 日付付き否定決定・準備後の本人感情（2026-10-11・未配置）

共有Planの報告判定が、日付付き決定の「の…でした」を話の紹介と誤認していた。既存の本人否定決定・準備4形に今日/昨日の3配置（day→SELF、day→区切り→SELF、SELF→day→区切り）を追加し、u202の日境界/未解析名詞判定を共用する。明示SELF、完全格項、否定、決める/決めておくの区別を保持し、後続の丁寧感情3形へ日付/原因/主体を補わない。

省略主体の決定・他者・改行・重複日語/順序混用・真の報告・未解析時刻/範囲/疑問名詞は保留。完全名詞の分担、明日の分担、今月号等は維持。通常行動と日付なし決定の文法は不変。Analysis compiler/realizer/API/DTO/DB/RN製品変更0、共有Plan1のみの製品補修、STRUCTURE_MAP_DELTA_NONE。

正常3例は1node/0edge→2node/1edge、不明文/別fieldは感情を保持して線を補わない。前後12生成全文と実RN表示model、実service＋合成RPC保存再読6ルート、Emlis前後6全文を確認。限定58 tests/89 subtestsと共有identity1成功。最終回帰・CI・remote照合と未完了範囲は06/API handoff u203参照。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.34 u204 省略主体の否定決定・準備後の本人感情（2026-10-11・未配置）

共有の報告判定が、完全な省略主体決定の「の…でした」を報告前置きと誤認し、後続の明示SELF感情（丁寧3形・常体安心した）を落としていた。既存SELF分岐を変えず、prefixなし/その後/それから/今日昨日＋区切り、既存否定4形、完全格項1〜4個・を必須・格重複なしの省略決定分岐を追加。新分岐では日付なしでも既存名詞検査を適用し、未解析時点/疑問名詞・日語重複/区切り不足・時刻/範囲・真の報告を保留する。

先行決定はUNSPECIFIEDと否定/準備相/日付を保持し、後続の明示本人感情へactor/day/causeを継承しない。未知区間/別fieldを越す線を作らず、報告・他者・感情の主語省略・訂正/撤回を維持する。Analysisは既存共有fallbackを利用でき、compiler/realizer/API/DTO/DB/RN製品変更0。STRUCTURE_MAP_DELTA_NONE。

実engine合成11入力の前後18生成全文と実RN表示model、実service＋合成RPCの保存再読4ルート、共有Emlis前後6全文を確認。対象65 tests／91 subtests、共有identity1成功。最終回帰・CI・remote照合、既存1020probe同値と残件は06/API handoff u204を参照。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.35 u205 関係を含む本人の書字後の感情（2026-10-11・未配置）

「私は家族への手紙を書いた。その後、私は落ち着きました」の後半を報告内容として保留していた共有判定を補修。既存の単純名詞書字分岐は保持し、明示SELF＋目的語内「への／との／での」＋書いた/書きましたの完全一致を追加する。任意の単純場所/媒体1項は目的語の前後に置ける。新分岐の全名詞segmentで既存の未解析時点/疑問名詞検査を行い、裸の「の／からの」、場所/媒体内の関係、日付/順序prefix、主体省略、他者、複数場所、報告/引用/説明/指示語へ広げない。

名詞内関係・SELF・原文・独立した後続感情と現在未完了の根拠を保持する。順序は原因へ変えず、未知区間/別fieldを橋渡ししない。訂正/撤回後と保存再読でも本文/図/identityを維持。Analysisは既存共有fallbackを使用し、compiler/realizer/API/DTO/DB/RN製品変更0。STRUCTURE_MAP_DELTA_NONE。

実engine合成13入力の前後22生成全文と実RN表示model、実service＋合成RPCの保存再読4ルート、Emlis前後6全文を確認。対象76 tests／100 subtests、共有identity1成功。Emlisの追加汎用文は新保持の感情を対象とする必須Moveのため維持し、反復は既存Receptionの残件とする。最終回帰・CI・remote照合、旧364probe同値と残件は06/API handoff u205を参照。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.36 u206 順序語付きの本人書字後の感情（2026-10-11・未配置）

共有Planの `_source_prefix_opens_report` が「その後、私は家族への手紙を書いた」を報告前置きと誤認し、後続の明示本人感情が欠ける原因を修正した。書字の完全一致判定内だけで「その後／それから」1個を区別する。単純名詞または目的語内の「への／との／での」、書いた/書きました、明示SELF、単純な場所/媒体の前後1項という既存境界を使用し、新受理の単純名詞にも未解析日付/疑問名詞検査を適用する。prefixなしの既存単純分岐・旧completed fallback・source座標は保持する。

Analysis compiler/realizerを変えず、通常例は場面→書字→感情の3node/2順序線になる。未知文/別fieldを越す接続や、感情への主体/日付/原因補完はしない。重複順序語/日付混用/主体省略/他者/報告/裸の属格/二重場所等は保留。u205の順序付き書字1拒否fixtureは肯定側へ移し、16境界例を追加した。

実engine合成11入力の前後16生成全文と実RN表示model、実service＋合成RPC保存再読2ルート、Emlis前後6全文を確認。対象103 tests／131 subtestsと共有identity1成功。Emlisの追加1文は明記された感情への応答であり、既存の汎用Reception品質は未解消。最終CI・remote照合・範囲と残件は06/API handoff u206。STRUCTURE_MAP_DELTA_NONE。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.37 u207 日付付きの本人書字後の感情（2026-10-11・未配置）

共有Planの `_source_prefix_opens_report` が、今日/昨日付きの完全な本人書字を報告前置きと誤認し、後続感情を落とす原因を修正した。明示SELFの「は」と日語3配置（日→SELF直結、日→区切り→SELF、SELF→日→区切り）を、書字判定内だけで区別する。後置日の区切りは必須で、空白等の後戻りによる未解析時点の受理を禁止する。既存の単純/関係付き目的語・場所/媒体1項・書いた/書きましたと未解析名詞検査を使用し、順序語混用・重複日付・主体省略/他者・裸属格・報告等は広げない。

Analysis compiler/realizerを変えず、行動の日付/SELF/原文と感情の独立した根拠を保持する。日付を感情へ継承せず、明示順序だけを線にする。未知文/別fieldの橋渡し、場面から行動への未記載の順序や原因を補わない。旧単純書字/順序付き書字/completed fallbackは保持する。

合成Analysis13入力の前後20生成全文と実RN表示model、実service＋合成RPC保存再読3ルート、Emlis前後6全文を確認。対象139 tests／187 subtests、共有identity1成功。u205の日付付き書字1拒否fixtureは肯定側へ移し、日付境界/報告等26例を追加。最終CI・反映・残件は06/API handoff u207。STRUCTURE_MAP_DELTA_NONE。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.38 u208 主語省略の書字後の本人感情（2026-10-11・未配置）

共有Planの `_source_prefix_opens_report` が「家族への手紙を書いた」等の完全な主語省略書字を報告前置きと誤認し、後続の明示SELF感情を落とす原因を修正した。既存書字の主語を任意にし、prefixなし/その後/それから/今日昨日＋区切り、単純名詞/目的語内の「への／との／での」、書いた/書きました、単純な場所/媒体1項に限定する。新受理の省略形には既存名詞検査を適用し、未解析時点/疑問名詞を取り込まない。日付付き明示SELFは従来の「は」の範囲を保持する。

書字のactorはUNSPECIFIED、後続感情は独立した明示SELFとして保持し、日付/actor/原因を継承しない。未知文/別fieldを越す接続や別記録の不明行為者の統合を禁止し、不完全topic、報告/他者/否認/訂正/撤回、日付と順序語の混用等の境界を保持する。Analysis compiler/realizer/API/DTO/DB/RN製品変更0。STRUCTURE_MAP_DELTA_NONE。

合成Analysis12入力の前後16生成全文と実RN表示model、実service＋合成RPC保存再読3ルート、Emlis前後6全文を確認。対象177 tests／275 subtests、共有identity1成功。旧拒否5例を意図した肯定側へ移し、肯定3例と拒否32例を追加。日付付き省略分岐が「私が／私も」まで通すreview指摘を修正済み。最終CI・remote照合・実装経緯・残件は06/API handoff u208。未配置・実DB/本人実機・正式商品受入れ未確認。

## 3.39 u209 関係を含む場所・媒体での書字後の本人感情（2026-10-11・未配置）

「私は家族との会議でメモを書いた」等を報告前置きと誤認し、後続の明示SELF感情を落とす原因を共有Plan `_source_prefix_opens_report` 内で修正した。既存fallbackの名詞パターンを共通化し、「への／との／での」を目的語だけでなく、その前後いずれか1個の場所・媒体でも保持する。旧単純書字分岐、whole-clause完全一致、二重場所の禁止、全名詞の報告/未解析時点/疑問語検査、actor/日付/順序語の既存制限は維持する。

省略書字actorはUNSPECIFIED、後続感情は独立した明示SELFのまま、日付/actor/原因を継承しない。未知文/別fieldを越す順序接続を追加せず、真の報告/他者/否認/訂正/撤回を保持。Analysis compiler/realizer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。

合成Analysis12入力の前後20全文と実RN表示model、実service＋合成RPC保存再読3ルート、Emlis前後6全文を確認。対象205 tests／331 subtests、共有identity1成功。共有初回受領に肯定7例・拒否18例を追加し、旧拒否期待を弱めていない。同環境read-only補助reviewで具体的blocking findingなし。最終回帰/CI・remote照合・残件は06/API handoff u209。未配置・稼働DB/本人実機・正式商品受入れ未確認。

## 3.40 u210 明示本人が自身の考え等を書いた後の感情（2026-10-11・未配置）

「私は自分の考えを書いた」の後続本人感情が落ちる原因を、共有Plan `_source_prefix_opens_report` のwriting fallback内で修正。明示SELFの書き手がいる場合に限り、目的語と、任意で付く前後どちらか1個の場所・媒体の先頭へ `私／僕／自分／俺＋の` を認める。名詞本体と関係は既存の有限文法を再利用し、所有prefixを除いた本体にも未解析時点/疑問語検査を適用。whole-clause完全一致・一項制限・報告語検査を保持する。

原文の所有表現、行動の日付、後続感情の独立したSELF/肯否定を保持。新範囲で主語省略、仮名所有代名詞、他者所有、一般の「の／からの」、任意の入れ子を拡張しない。未知文/別fieldを越す順序線や原因を補わず、訂正/撤回も保持。旧単純書字分岐と他発話にも使うcompleted fallbackは不変で、その既存残差は今回解消したと扱わない。

Analysis前後26全文と実RN model、実service＋合成RPC保存再読3ルート、Emlis前後6全文を確認。対象239 tests／387 subtestsと共有identity1成功。同環境read-only補助reviewで具体的blocking findingなし。最終CI・実装経緯・remote照合・残件は06/API handoff u210。Analysis compiler/realizer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。未配置・稼働DB/本人実機・正式商品受入れ未確認。

## 3.41 u211 仮名の本人所有表現を含む書字と後続感情（2026-10-12・未配置）

実engineで「私はわたしの考えを書いた。それから、私は落ち着きました。」がUNAVAILABLEとなる欠陥を確認。Analysisの一般名詞文法は仮名の所有代名詞を認識せず、共有Planも本人所有prefixを漢字4形に限定していた。

既存 `_finite_proposition` 内で、明示SELF・肯定・過去・書くに限り、先頭の本人所有を持つ完全格項を補完解析する。`わたし／ぼく／おれ＋の` の原綴りとsource位置を保持し、目的語必須、場所/媒体は前後どちらか1個まで、全格項は既存の有限名詞と「への／との／での」に限定する。一般名詞、書く以外の動詞、否定書字、wish/cognition/te、省略主体へ拡張しない。日付直後の無区切り所有名詞を曖昧なまま採用せず、名詞内の未解析時点/疑問語も既存検査へ通す。

新たに読める仮名所有書字は既存のsource-host帰属検査を必須にし、memo/memo_action両方向の先行報告、後続引用/否認を尊重する。共有 `_source_prefix_opens_report` の明示本人用prefixも同じ3形を追加し、後続本人感情/現在未完了を保持。旧completed fallbackは不変。「説明」等の名詞を含む書字自体が読めても、後続感情まで本人のものと確定するわけではない。

通常3例で生成不能から行動＋感情2node/明示順序1edgeへ、場面付きは1node/0edgeから3node/2edgeへ変わった。未知文・別fieldを橋渡しせず、日付は書字だけに所属し、原因を補わない。合成12入力の前後24結果のうち生成10全文をrootが読解し、実RN modelの本文/identity/順序/各要素数が一致。実service＋合成RPCの保存再読3ルートとEmlis前後6全文も確認した。最終回帰/CI、反映、残件は06/API handoff u211。新規repo file0、renderer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。本人実機・稼働DB・正式商品受入れは未確認。

## 3.42 u212 省略主体の本人所有書字と独立した後続感情（2026-10-12・未配置）

「自分の考えを書いた。それから、私は落ち着きました。」では、既存Analysisは書字を主体未確定として解析するが、共有Planがそれを報告前置きと判定して後続感情を落としていた。既存 `_source_prefix_opens_report` のwriting fallbackで、省略主体の場合に限り `私／僕／自分／俺＋の` を名詞内の所有表現として保持する。明示SELFの漢字/仮名所有範囲、肯定過去書字・目的語必須・前後どちらか1個の場所/媒体、既存有限名詞と「への／との／での」、未解析時点/疑問/報告語の検査は維持する。所有を行為者の証明にせず、UNSPECIFIEDの行動と独立したSELF感情を区別する。旧completed fallbackは変更しない。

通常5例は1node/0edge→2node/1edge、場面付きは2/1→3/2。未知文/別field/現在未完了は2node/0edgeで、日付・主体・因果や未知の接続を補わない。報告/仮名所有の省略主体は両版UNAVAILABLE、明示SELF/否定書字は不変。報告の両field方向を保持するが、memo=書字／memo_action=感情の逆配置で感情が採用されない既存制限は今回の解消範囲に含めない。感情直後の引用/否認が感情だけを除外する既存scopeも維持する。

合成13入力の前後26結果のうち生成22全文をrootが読解し、実RN modelの本文/identity/順序/各要素数が一致。実service＋合成RPC保存再読3ルートとEmlis前後6全文を確認した。Emlisは既存Receptionの追加が対象1例にあり、商品品質合格ではない。最終回帰/CI・反映・残件は06/API handoff u212。新規repo file0、Analysis compiler/realizer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。稼働DBでの生成・保存再読、本人実機、正式商品受入れは未確認。


## 3.43 u213 仮名所有・省略主体の完全書字（2026-10-12・未配置）

「わたしの考えを書いた。それから、私は落ち着きました。」等がUNAVAILABLEになる欠落を補修。既存 `_finite_proposition` の仮名所有fallbackを、SELFとUNSPECIFIEDの完全な肯定過去書字に限定して共用する。仮名所有3形、目的語必須、前後どちらか1個の場所/媒体、有限名詞と「への／との／での」の境界は維持。所有を行為者の根拠にせず、原綴り・source範囲・肯否・日付を保持する。一般名詞/他動詞/否定書字/wish/cognition/teへは拡張しない。共有報告判定も既存の漢字/仮名7所有prefixを共用する。

既存unattributed_actionとsource-host検査を通し、報告の両field方向、引用/否認、未完主題、曖昧な日付や未解析の時点/疑問語を保持する。別recordの不明行為者は統合せず、原文内の順序を因果に変換しない。通常4例はUNAVAILABLE→2node/1edge、場面付きは1node/0edge→3node/2edge、未知文/別field/現在未完了は2node/0edge。報告/他者は両版UNAVAILABLE、明示SELF/漢字所有省略は不変。

「ぼくの気持ちを書きました。それから、私は安心しなかった。」は感情だけ1nodeで、書字欠落は残る。漢字所有/所有なしの省略主体にもあった、共有Planが目的語内の気持ちをreaction/feelingと扱う別原因。次の因果ownerは `_FEELING_RE` からoperator/kind、clause signals、semantic frameへの経路であり、Analysisのframe保護検査を緩めて回避しない。

合成13入力の前後26結果のうち14生成全文、実RN modelの本文/identity/順序/各要素数、実service＋合成RPC保存再読3ルート、Emlis前後6全文を確認。Emlisの汎用Reception/復唱は未解消。最終回帰/CI・反映は06/API handoff u213。新規repo file0、realizer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。稼働DBでの生成・保存再読、本人実機、正式商品受入れは未確認。


## 3.44 u214 書字の名詞内感情語と述語の区別（2026-10-12・未配置）

「ぼくの気持ちを書きました。それから、私は安心しなかった。」で後者だけが残る原因は、共有Planが目的語の気持ちをreaction/feelingへ分類することだった。完全な肯定過去書字・必須目的語・前後どちらか1個の場所/媒体について、既存有限名詞と本人所有/「への／との／での」の区間を確認し、そこにある感情語だけをspan operatorから除外する。kindも同じoperator集合を使う。書き手を所有表現から補わず、Analysisのunattributed_action/source-hostガードを維持する。

補正には原field/座標/全span一致と独立節境界が必要。両fieldの報告・伝聞・引用・否認・疑問・未完話題を除外し、sourceなし/不一致/sliceでは旧判定を保つ。text-only試作で発生したEmlisの報告内容への行動断定は採用せず、原sourceのscope確認後にだけ補正する。句点付き「私は、。」も除外し、報告例と未完話題例のEmlis全文が元に戻ることを確認した。否定書字・希望・非完結/埋込述語は拡張しない。

合成16入力の前後32結果のうち26生成全文を読解。通常6例は1node/0edge→2node/1edge、場面付きは2/0→3/2、未知文/現在未完了付きは1/0→2/0。別fieldは2/0のまま、報告・他者・埋込はUNAVAILABLEのまま。原文・UTF8/hash・主体・日付・否定感情・明示順序を保持し、因果を補わない。実RN modelの26投影と、実service＋合成RPC保存再読3ルートも確認した。

Emlis5入力の前後10結果（8生成全文）も読解。通常書字/明示SELFの2例でObservationとReceptionの選択が変わるが、報告と考えの対照は全文一致。汎用応答・復唱の品質合格とはしない。「私は不安だった」がAnalysisで落ちる既存残件は今回の語彙補正で解消したとしない。最終回帰/CI・反映・次の因果ownerは06/API handoff u214。新規repo file0、Analysis compiler/realizer/API/DTO/DB/RN製品変更0、STRUCTURE_MAP_DELTA_NONE。稼働DB・本人実機・正式商品受入れは未確認。


## 3.45 u215 明示本人の過去の不安（2026-10-12・未配置）

「私は不安だった」が採用されず、後続「私は安心しなかった」だけ残る欠落を補修する。共有Planにはreaction/feeling・negative affectの本人証拠が既にある。Analysisの既存有限過去表へ「不安だった／不安でした」→「不安だ」を追加し、経験を述べた文法positiveと負情動を示すshared negativeを区別する。本人7表記・完全な独立過去節だけを扱い、source/原文範囲/UTF8/hashを保持する。

standalone witnessはexplicit scope・retention・memo単一span・本人・reaction/feeling・許可時点・feeling operatorを要求し、negation/positive_change/current_changeがあれば拒否する。既存の両field source-host検査を適用し、報告/引用/否認/疑問や別人の話を本人の事実にしない。複合action-change pairの証拠では採用しない。省略/他者主体・日付/程度/現在・否定不安・複合節は未対応として保持する。

独立した不安と安心不成立を2nodeで残し、明示順序だけを1edgeで表す。行動の効果/原因は追加せず、未知文/別field/別recordの接続を補わない。訂正/撤回で古い感情と順序を取り除き、丁寧形を同じ意味へ集約する一方、不安と安心不成立を同一視しない。

合成14入力の前後28結果（20生成全文）で8入力改善・6対照不変。実RN modelと合成RPC保存再読4入力を確認。ローカル5suite **1345 tests／5409 subtests PASS**。固定source/最終CIと次の否定不安等の残件は06/API handoff u215。既存compiler1・test2のみのsource変更、共有Plan/Emlis/realizer/API/DTO/DB/RN製品変更0、新規repo file0、STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB保存再読・正式商品受入れは未確認。


## 3.46 u216 明示本人の過去の不安の否定（2026-10-12・未配置）

u215で未対応だった「では／じゃ」×「なかった／なかったです／ありませんでした」の6形を、既存有限過去否定表で「不安だ」・文法negativeとして扱う。本人7表記と完全な独立過去節に限定し、表示形「不安ではなかった」、原文範囲/UTF8/hash、否定と帰属を保持する。共有Planは既に全6形の負情動とnegation証拠を持っているため変更しない。

不安のstandalone witnessは肯定ならnegationなし・否定ならありの一致を必要とし、両方でpositive_change/current_changeを拒否する。u215の本人/explicit/retention/単一span/memo/feeling/時点とsource-hostの条件を維持する。複合pairには流用せず、省略/他者主体・日付/程度/現在・報告/引用/否認/不確実は今回広げない。

「不安ではなかった」を安心・改善・行動の効果に読み替えず、「安心しなかった」とも別nodeで保持する。明示順序のみを結び、未知文/別field/別recordを橋渡ししない。明示訂正/撤回は旧claimと依存順序を除去し、通常補足を暗黙訂正にしない。期間比較では6形を同義、肯定不安・安心/安心不成立を別意味とする。

合成18入力の前後36結果（24生成全文）で12入力の欠落が減り、6対照の本文/node/edgeは不変。実RN modelと実service＋合成RPC保存再読2入力、対象8 tests／167 subtestsを確認。固定source・最終回帰/CI・残件は06/API handoff u216。source変更は既存compiler1・test2のみ。STRUCTURE_MAP_DELTA_NONE、新規repo file/外部契約変更0。未配置、稼働DB保存再読・本人実機・正式商品受入れは未確認。


## 3.47 u217 明示本人の過去の不安に書かれた程度（2026-10-12・未配置）

「私は少し不安だった／不安でした」の共有Planは既に本人のreaction/feelingを持つが、Analysisの有限過去文法が程度語を読めず感情が欠けていた。既存7種の明示SELF直後の「少し」1個と肯定過去2形だけを扱い、原文の程度範囲を既存private written_modifiersのDEGREE_SLIGHTに保持する。有限述語の範囲と分離し、safe realizerで「少し不安だった」と表す。数値強度・安心・改善・原因には読み替えない。

既存のmeaning identityに程度を含め、丁寧形同士は同義、程度なし/否定不安とは別の意味にする。訂正・撤回・原UTF8/hash・明示された記述順序を保持する。報告/引用/否認・別field・未知区間・複合節の境界は従来どおり検査する。shared degree=source_boundedは裸の不安にもあるため強度の証明には使わない。「少し不安ではなかった」は否定との作用域が未証明で保留し、他程度/他感情/省略主体/現在形/日付付きへ一般化しない。safe再解析で程度の除去・別修飾へのすり替えを拒否する。

合成16入力の前後32結果（24生成全文）をrootが読解し、8入力で欠落解消、8対照の本文・node/edgeは不変。実RN model24投影、実service＋合成RPC保存再読3入力、対象13 tests／246 subtestsを確認。固定source・最終回帰/CIは06/API handoff u217。製品compiler/realizer2file・既存test2のみ。STRUCTURE_MAP_DELTA_NONE。共有Plan/Emlis・外部契約変更0。未配置、本人実機・稼働DB保存再読・正式商品受入れは未確認。本修正を最新weeklyの本人実機確認の新たな前提にはしない。

## 3.48 u218 過去の不安に書かれた程度4語（2026-10-12・未配置）

u217の少し専用判定で落ちる「とても／かなり／やや／ちょっと」＋肯定過去不安2形を補修する。共有Planは8形全てで原文1span・明示本人・required reaction/feeling・負情動・operator:feelingを保持しており、共有sourceは変更しない。既存compilerの有限程度表を5語へし、元のSLIGHT identityを保ったまま、新4語を各々別のprivate written_modifiersへ保持する。realizerは原綴りを戻す。語同士の同義推定・数値序列・強度増減・改善を加えない。

既存7種SELF・主語直後の程度1個・完全な肯定過去2形に限定する。同じ語の常体/丁寧形は同義、別語・無修飾は別記述として集約/期間比較する。原文UTF8/hash、訂正/撤回、明示順序、safe再解析を保持。程度付き否定の作用域・引用/報告/否認・他者/省略主体・複合節・日付/現在形・助詞付き/二重程度は従来の保留を維持する。未知文/別field/別recordを順序で橋渡ししない。

合成22入力の前後44結果（30生成全文）をrootが読解し、14入力で欠落解消・8対照不変。実RN model30投影、実service＋合成RPCで新4語の12入力を保存再読。対象15 tests／487 subtests成功。固定source・最終回帰/CI・残件は06/API handoff u218。既存compiler/realizer2・既存test2のみ、STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB保存再読・正式商品受入れは未確認。最新weeklyの実機確認を今回の有限補修に従属させない。

## 3.49 u219 明示本人の現在の不安（2026-10-12・未配置）

過去専用の有限感情文法から落ちていた、明示SELF＋程度なしの肯定「不安だ／不安です」を既存Analysis compiler/realizer内で扱う。現在の共有reaction/feeling根拠と完全節を照合し、private CURRENT_FEELING/current_input、表示「不安だ（この記述時点の気持ち）」で過去と分離する。負情動を文法否定へせず、現在までの継続・性格・原因・行動の効果を加えない。

原文座標、7種SELF/主語読点、記載された順序語、報告/引用/否認・後続host・別field境界を保持する。currentの共有時点はcurrent_inputを要求し、過去/過去の順序条件は拡張しない。現在の「だ／です」は同義、過去形は別記述として集約/期間比較する。訂正・撤回・補足・safe再解析を維持。現在否定・程度付き現在形・日付/省略主体/複合節は別残件である。

合成14入力の前後28結果（19生成全文）で8入力の欠落解消・6対照不変。実RN model19投影、実service＋合成RPC保存再読3入力を確認。固定source・最終回帰/CIは06/API handoff u219。既存compiler/realizer2・test2のみ。STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB保存再読・正式商品受入れは未確認。この修正を最新weeklyの実機確認の新たな前提にしない。

## 3.50 u220 明示本人の現在の不安の否定（2026-10-12・未配置）

既存compiler/realizerで現在否定6形（不安ではない／ではないです／ではありません／じゃない／じゃないです／じゃありません）を明示SELF・程度なしの完全節として採用。CURRENT_FEELING/current_input/negativeを保持し、「不安ではない（この記述時点の気持ち）」を返す。共有Planの負情動を文法否定と混同せず、operator:negation一致・current_input・完全な原文証拠を要求する。安心/改善・継続は推定しない。

6形は同義集約し、現在肯定・過去否定等と区別する。明示訂正/撤回を反映し、逆極性の通常補足は保留。同一原入力の肯否は両方保持するが現在感情の競合badgeや時制をまたぐ順序は未証明のまま。報告/引用/否認/他者/省略/程度付き/複合節等の境界は維持。合成18入力で12改善・6対照不変、24生成全文と実RN model、現在否定9入力の保存再読を確認。最終回帰/CI・source反映は06/API handoff u220。STRUCTURE_MAP_DELTA_NONE、共有/API/DTO/DB/RN製品変更0。本人実機・稼働DB・正式商品受入れは未確認。次は程度付き現在形等。

## 3.51 u221 現在の不安の程度を原綴りで保持（2026-10-12・未配置）

既存compilerで明示SELF＋既存5程度語（少し／とても／かなり／やや／ちょっと）1個＋現在肯定2形（不安だ／不安です）を採用。CURRENT_FEELING/current_input・written_modifiers・程度と有限述語それぞれの原文範囲を保持する。current witnessは修飾ありなら肯定かつ既知単一コードのみ認め、完全な原文と共有current_inputを要求。既存realizerで原綴りを復元するためrealizer/共有Plan変更0。

同じ程度語の常体/敬体だけを同義に扱い、他程度/無修飾/過去/現在否定と区別。数値強度・順位・増減・改善は推定しない。訂正/撤回・通常補足を区別し、程度付き否定・二重程度・助詞付き・日付/省略/引用/否認/複合節等は引き続き保留。現在を含む順序は未証明。合成22入力で16改善・6対照不変、27生成全文と実RN model、程度付き現在形12入力の保存再読を確認。最終回帰/CI・source反映は06/API handoff u221。STRUCTURE_MAP_DELTA_NONE、外部契約変更0。本人実機・稼働DB・正式商品受入れは未確認。次は日付付き本人感情等。

## 3.52 u222 本人の過去感情に書かれた今日・昨日（2026-10-12・未配置）

既存compilerで明示SELFの前/直後にある今日/昨日1個を過去感情のrelative_dayと原文座標へ保持する。standalone witnessはTODAY/present・YESTERDAY/pastの一致を要求し、有限述語は過去のまま。既存realizer・source内同日集約・期間比較を使う。日語付き肯定にも報告/否認境界を適用し、複合episode右端の日語を拒否する。日語を後続へコピーせず、実日付・改善/原因・記録間順序を補わない。

肯否/程度・原文・訂正/撤回・未知区間/別field/別recordを保持。日語付き現在形、重複日や細かい時点、省略主体、程度付き否定、複合節は保留。日語付き「落ち着きました／嬉しかったです／うれしかったです」は共有source-host witnessの別制限で保留し、今回の対応完了には含めない。合成20入力で12改善・8対照不変、23生成全文と実RN model、日語付き6入力の保存再読を確認。最終回帰/CI・反映は06/API handoff u222。STRUCTURE_MAP_DELTA_NONE、共有/realizer/外部契約変更0。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.53 u223 日語付き本人過去感情の敬体3形（2026-10-12・未配置）

共有Planの既存source-host helperで、明示SELFの前/直後の今日/昨日1個と「落ち着きました／嬉しかったです／うれしかったです」を完全節として保持する。極性defaultの補正は原文日語と共有time_scope（今日/present・昨日/past・無日/current_input）が一致する場合だけ。frame時点や過去の有限述語は書換えず、Analysisの既存日語/原文/本人保持へ接続する。

日語付きにも前後/別fieldの報告・否認境界を適用。日語の転用・実日付化・原因/改善を補わず、二重日、日語＋順序語、細かい時間、省略主語/他者、未解析の程度、引用/報告/否認/複合節は保留。compound分岐、共有語彙regex、Analysis compiler/realizerは変更0。合成18入力で10改善・8対照不変、25生成全文と実RN model、7入力の保存再読、訂正/撤回・期間比較を確認。共有Emlis前後16全文では2入力の感情応答追加・6本文不変。Emlisの定型文品質は未解消。

最終回帰/CI・current shared-owner snapshotの導出更新・反映は06/API handoff u223。STRUCTURE_MAP_DELTA_NONE。日語付き現在感情、程度付き否定等は残件。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.54 u224 「今日」付き本人の現在の不安（2026-10-12・未配置）

Analysis compilerで日語付きCURRENT_FEELINGの一律拒否を解消し、明示SELFの完全な独立節・既存の不安の現在形・TODAYだけを採用する。原文「今日」と同じ節の共有present witnessを必須にし、命題はCURRENT_FEELING/current_inputとTODAYを別々に保持する。無日現在形・今日の過去形と集約/期間比較で混同しない。「不安だ／不安です」、既存否定6形、肯定の程度5語が対象で、原文・本人・日語・時制・肯否・程度を保持する。共有Plan/realizer/DTO/RNの製品変更はない。

昨日の現在形を過去/現在へ自動補正せず保留。程度付き否定、複数程度、細かい時間、二重日、日語＋順序語、省略主語/他者、報告/引用/否認/推量/質問/複合節も範囲外。日語を実日付化/他節へ転用せず、否定を安心・改善へ変換せず、現在→過去や別field/未知区間の順序を補わない。合成20入力で12改善・8対照不変、29生成全文と実RN model、10入力の保存再読、訂正/撤回・集約/比較・時点不一致/投影改変拒否を確認。

最終回帰/CIと反映は06/API handoff u224。STRUCTURE_MAP_DELTA_NONE。次は程度語と否定の作用域確認。一般意味理解・実機確認等は未完了。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.55 u225 強調語付き本人の不安の否定（2026-10-12・未配置）

Analysis compilerで、明示SELFの完全な不安の否定形に「全く／まったく／全然」の1語を保持する。既存の現在否定6形・過去否定6形と無日/今日/昨日の既存範囲を用い、昨日の現在形は保留のまま。単独節の共有frame・感情/否定operator・原文/時点の一致を要求し、原文の修飾語・否定・時制・日語をprivate命題と文章/図へ保つ。肯定の程度5語と否定に伴う3語を分け、程度辞書の一律開放はしない。

「全く」と「まったく」はmeaning keyだけを共通化し、表記差だけで集約/期間比較の差を作らない。source_parts・命題の原表記・表示は変更しない。「全然」や無修飾の否定、異なる日語/時制は別に保持する。否定を安心・改善へ変換せず、強度の数値化・順位付けを行わない。「少し＋否定」「あまり／あんまり＋否定」、肯定の全然、二重否定/修飾、他者/省略主語、報告/夢/質問/否認/複合節は今回の採用範囲に含めない。

合成18入力で10改善・8対照不変、16生成全文と実RN model、9入力の合成保存再読を確認。訂正/撤回・同義集約・期間比較、原文と感情/否定根拠の欠落・改変拒否も検査した。明示された過去の独立節間の順序は保持し、現在→過去・未知区間・別field/recordに線を補わない。最終回帰/CIと反映は06/API handoff u225。STRUCTURE_MAP_DELTA_NONE。共有Plan/Emlis/API/DTO/DB/RN製品変更なし。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.56 u226 本人の不安の部分否定を保持（2026-10-12・未配置）

既存Analysis compiler/realizerで「あまり／あんまり」を部分否定の修飾として保持する。明示SELFの完全な不安の現在否定6形・過去否定6形と既存日語範囲に限定し、同じ節の共有感情/否定operator・時点の一致を要求する。共有frameのcurrent_user既定値だけを本人の証明にせず、原文の完全節を確認する。修飾語・否定・時制・日語・原文証拠はprivate命題と文章/図へ維持する。

2語はmeaning keyのみ同義化し、原文と表示の「あまり／あんまり」は保持する。全く/全然/無修飾の否定、肯定の「少し不安だった」とは集約しない。文法的negativeだけで不安の不在や残存量を断定せず、安心・改善・強度増減へ変換しない。作用域が未確定な「少し＋否定」、あまりにも/助詞/二重修飾/二重否定、他者/省略主語、報告/夢/質問/否認/複合節、昨日の現在形は保留。共有Planを変更しない。

合成20入力で10改善・10対照不変、18生成全文と実RN model、6入力の合成保存再読、訂正/撤回・集約/比較・原文と修飾の改変拒否を確認。明示された独立過去節の順序は保持し、現在→過去や未知区間/別field/recordの線は補わない。最終回帰/CIは06/API handoff u226。STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.57 u227 「少しも／ちっとも」を伴う本人の不安の否定（2026-10-12・未配置）

既存Analysis compiler/realizerで2語を否定専用modifierとして保持する。「少し」と「少しも」の接頭語衝突は、既知修飾語の最長一致で分離する。後続の有限形完全一致と肯否別allowlistは維持し、「も」を一般に除去しない。明示SELF、不安の現在否定6形/過去否定6形、無日/今日/昨日の既存範囲と、同一節の共有感情/否定operator・時点根拠を要求する。共有Planは変更しない。

原綴り・修飾語の全座標・否定・時制・日語を文章/図へ保持する。2語相互や全く/全然/無修飾、あまりの部分否定、少しの肯定とは別の記述として集約・比較し、数値強度や改善を推定しない。同じ語の常体/敬体は同義。少しも/ちっともを肯定へ付けた場合や、少しは/少しだけ/少しもは/二重修飾/二重否定、他者/主語省略、報告/夢/質問/否認/複合節、昨日の現在形、「不安はない」の別構文は保留する。

合成22入力で10改善・12対照不変、22生成全文と実RN model、6入力の合成保存再読を確認。訂正/撤回・補足・集約/比較・否定根拠欠落/修飾語改変拒否を検査。書かれた独立過去節の順序を保持し、現在→過去や未知区間/別field/recordの線は補わない。最終回帰/CIは06/API handoff u227。STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.58 u228 本人が書いた不安の存在否定（2026-10-12・未配置）

既存Analysis compiler/realizerに、明示SELFの「不安＋は/が＋ない/ないです/ありません/なかった/なかったです/ありませんでした」を接続する。共有の感情/否定/時点証拠を要求し、predicate `ある`と名詞/助詞argument、原文座標、否定、現在/過去、既存の日語を保持する。「不安ではない」と同義化せず、は/がを区別し、同じ助詞の常体/敬体だけを集約する。安心・改善・行動の効果・別の感情は補わない。

現在は記述時点を示す。既存原文再解析を表示前に要求し、命題改変を拒否する。主語省略/他者/属格/報告/質問/推量/二重否定、未対応助詞・修飾語との複合、肯定存在、複合節、昨日の現在形は保留。旧action→feelingの複合経路には採用せず、「不安だ」と存在否定をまたぐ矛盾判定も未対応である。

合成22入力で10欠落解消・12対照不変。18生成全文と実RN model、合成RPCによる6入力の保存再読を確認。訂正/撤回/補足、同助詞内の語形集約・助詞/構文間の区別、期間比較、原文証拠・改変拒否を既存testに追加。明示された独立過去節の順序を保持し、時制違い/未知区間/別field/recordをまたぐ線は作らない。最終ローカル5suiteは1575 tests／7634 subtests PASS、共有identity1 PASS。source・検証詳細は06/API handoff u228。STRUCTURE_MAP_DELTA_NONE。未配置・本人実機/稼働DB/正式商品受入れ未確認。

## 3.59 u229 本人が書いた不安の肯定存在（2026-10-12・未配置）

既存Analysis compiler/realizerで、明示SELFの「不安＋は/が＋ある/あります/あった/ありました」を接続する。u228の存在構文表を肯否共通にし、名詞/助詞argument・predicate `ある`・原文座標・文法的肯否・現在/過去・既存の日語を保持する。共有frameの負感情分類と文法的否定を分離し、肯定はnegation operator不在、否定は存在、双方とも同一節の感情/時点根拠を要求する。

肯定の存在構文にも前置/別field報告・後続引用/否認の帰属確認を適用する。表示はある/あったとない/なかったを区別し、完全原文再解析を要求する。既存の否定12形・修飾/省略主体/他者/複合節/昨日の現在形等の保留を維持。通常補足の肯否対立は保留し、明示訂正・撤回は反映。同助詞/肯否/時制の常体/敬体は集約し、は/が・肯否・「不安だ」系は同一化しない。原入力内の感情矛盾表示と構文をまたぐ矛盾判定は未完成。

合成24入力で10欠落解消・14対照不変。18生成全文と実RN model、肯否12入力（新規肯定6）の合成保存再読、訂正/撤回・補足対立・集約/比較・根拠欠落/命題改変拒否を確認。独立過去節の明示順序だけを線にし、改善や因果を推定しない。対象検査6 tests／202 subtests PASS。固定source、最終回帰/CIは06/API handoff u229。STRUCTURE_MAP_DELTA_NONE。未配置、本人実機・稼働DB・正式商品受入れは未確認。

## 3.60 u230 程度語付き不安の存在肯定（2026-10-12・未配置）

既存compilerで、不安の前に「少し／とても／かなり／やや／ちょっと」の1語がある本人の完全な存在肯定を接続する。程度語の原文座標を追加し、名詞/はが/有限形の座標を程度語の後へ移す。明示SELF・肯定8形・同一節の共有感情/時点根拠と否定operator不在を要求する。既存realizerと意味比較を使用し、原綴り・助詞・現在/過去・日語を文章/図へ保持。同程度/助詞/時制の常体/敬体だけを集約し、無修飾・別程度・は/が・形容構文とは区別する。

否定との合成、後置・助詞付き程度・積み重ね・読点跨ぎ、他者/省略主体/報告/推量/複合節等は保留。通常補足の程度付き存在肯定と無修飾存在否定は両方向で保留し、明示訂正/撤回を反映。部分否定との整合や原入力内/構文間の感情矛盾判定は未完成。数値強度・改善・因果は推定しない。

合成26入力で12欠落解消・14対照不変、22生成全文/実RN model、15入力の合成保存再読、原文座標・訂正出典・集約/比較・根拠欠落/命題改変拒否を確認。対象11 tests／424 subtests PASS。固定source・最終回帰/CIは06/API handoff u230。STRUCTURE_MAP_DELTA_NONE。未配置、最新修正版の本人実機・稼働DB・正式商品受入れは未確認。

## 3.61 u231 不安の存在肯定の後置程度語（2026-10-12・未配置）

不安＋は/がの直後に既存5語（少し／とても／かなり／やや／ちょっと）のうち1語がある完全な肯定8形を、既存compilerで解釈する。前置degreeがない場合だけ後置を調べ、残り全体を既存有限形tableで完全一致させる。source_partsは名詞→助詞→degree→述語の原文順・実座標で保持し、既存realizerの安全再生一致後に後置語順を表示する。共有Plan/witness/strict host/意味キーは不変。

本人・程度・助詞・肯否・時制・日語等が同じ前後置は同じ意味へ集約し、最初の代表文の語順と両原文のevidenceを残す。前後置を逆順にした集約/比較、訂正回答の語順・出典、通常補足の同義集約を検査。別degree・は/が・無修飾・copular・時制/日語の差を維持する。否定との合成、助詞付きdegree、二重/stack、他者/引用/報告/省略主体/複合節等は保留。通常補足の肯定degreeと無修飾存在否定も両方向で保留し、部分否定の両立条件へ拡張しない。数値強度・改善・原因は推定しない。

合成27入力で12欠落解消・15対照不変、26生成全文/実RN model、前後置30入力の合成保存再読、原文範囲・座標改変拒否を確認。対象12 tests／650 subtests PASS。固定source・最終回帰/CIと残件は06/API handoff u231。STRUCTURE_MAP_DELTA_NONE。未配置、最新修正版の本人実機・稼働DB・正式商品受入れは未確認。

## 3.62 u232 存在否定の修飾と部分否定を含む通常補足（2026-10-12・未配置）

既存否定修飾7語（全く／まったく／全然／あまり／あんまり／少しも／ちっとも）1語を、不安＋は/がの前後に置いた完全な存在否定12形へ接続する。最長一致・有限形完全一致・明示SELF・既存の日語条件・同一節の共有感情/否定/時点witnessを要求する。肯定5語と否定7語の許可を有限形の肯否で分け、原綴り・原文順・全座標・助詞・時制・日語を保持する。realizerは既存の完全再解析と語順再現を用い、変更しない。

通常補足の同一actor/predicate/modality/時制・互換argumentの比較に限り、あまり/あんまりの部分否定と、無修飾または少し/やや/ちょっとの肯定を、肯否差だけでは保留しない。「不安だ」系と存在「ある」系それぞれの同じ構文内で両方向を扱い、2記述/2出典を保持する。両立から残量を推定せず、1命題へ統合せず、強度・安心・改善・因果を作らない。全否定と肯定、部分否定ととても/かなり、構文をまたぐ一般矛盾の解決へ拡張しない。

同じ修飾意味/助詞/肯否/時制/日語の前後置と既存同義綴りは集約/比較でき、代表文の語順と全出典を保持する。明示訂正/撤回、通常補足内の連続記述、感情/否定witness欠落、偽造modifier/肯否/座標の拒否を検査。積み重ね・追加助詞・二重否定・他者/報告/引用/推量/省略主体/複合節は既存の保留を維持する。

合成26入力で11欠落/生成停止解消・1対立補足の片側表示修正・14対照不変。20生成全文と実RN modelを照合。実engine/service＋合成RPCでは前後置の72入力（既存肯定30＋新規否定42）と、部分否定を含む補足4組の保存再読を再生成なしで検査した。固定source・最終CIは06/API handoff u232。STRUCTURE_MAP_DELTA_NONE。原入力内/別構文間の感情矛盾、一般意味理解、全体ルートUI/IF/Saved、最新修正版の本人実機・稼働DB・正式商品受入れは残件で、未配置。

## 3.63 u233 原入力内の感情の肯否併記を不一致表示へ接続（2026-10-12・未配置）

§3.13の既存conflict_badgesへ、独立した明示SELFのPAST_FEELING/pastまたはCURRENT_FEELING/current_inputを追加する。既存parserと共有witnessで成立した感情nodeだけを消費し、同じ原入力source/field、actor・構文/述語・argument・modality・時制・相対日を要求する。順序に参加するevidence、接続語付き・従属形は除外し、訂正/撤回の除外後に比較する。別record/field/助詞・copular/存在・現在/過去・別日は同一視しない。

無修飾の既存感情の肯否対に加え、不安の完全否定（無修飾、全く／まったく／全然／少しも／ちっとも）と感情肯定（無修飾、少し／とても／かなり／やや／ちょっと）を、「不安だ」系または存在構文それぞれの同じ構文内で照合する。modifierを除く照合はこの不安の関係判定内だけに限定し、元命題・原綴り・表示・集約/期間比較の意味キーを変更しない。「あまり/あんまり」の部分否定は、強い肯定との組合せでも今回の不一致表示へ昇格しない。

両node・exact evidenceを既存ObservedConflictへ結び、「同じ記録に肯定と否定の記述があります。同じ機会のことかは確定していません。」を文章/図へ出す。真偽・心理的葛藤・改善・原因を決めず、順序線を追加しない。通常補足の保留とu232の限定両立は不変。期間比較のCONFLICT_STATE_CHANGED、private証拠保存、再生成しない読取、旧空badgeの互換は既存責務を使う。DB/DTO/RN/realizer変更なし。

合成30入力で12件の表示欠落解消・18対照不変。54生成全文と実RN modelの本文・identity・対象label等が一致し、感情6入力を加えた既存保存test（計7入力）で再生成なしの本文/図/ID再読を確認。既存期待は新しく成立する対象pairだけ変更し、部分否定はbadge対象から除外。検査結果・固定source/CIは06/API handoff u233。STRUCTURE_MAP_DELTA_NONE。一般的な矛盾判断、未解釈の複合節、全体ルートUI/IF/Saved、最新修正版の本人実機・稼働DB・正式商品受入れは残件で、未配置。

## 3.64 u234 独立した感情推量文の横で明示内容を保持（2026-10-12・未配置）

原入力の同一fieldに「かもしれ/かも知れ」がある場合の一律保留を限定修正する。既存共有witness付きの完全なcognitive命題は従来通り扱い、それ以外は、既存SELF感情構文に完全な「かもしれない/かも知れない」が付き、source上で独立した文として閉じる場合だけ、その推量文の作用域を認識する。nominal現在形の「不安かもしれない」は作用域照合時に限り仮のcopulaを補って既存parserへ渡す。原文・命題・座標・表示に補完語は入れない。句読点の一般対応拡大はせず、句点（。/.）のみ。読点・改行・semicolon・72文字切断を文境界に昇格しない。

推量文そのものはobserved nodeにせず、SOURCE_SCOPE / UNSUPPORTED_OR_UNCERTAIN_SOURCE_SCOPEを保持する。別の明示節は従来の共有witness・host検査を通ったものだけ採用する。後置の引用/否定host、場全体の引用/報告/夢/条件、主語省略/他者/順序付き推量、未解釈推量は従来の保留。先行する明示節同士の成立した順序は保持し、推量を越して後続へ橋渡ししない。推量から不一致badgeを作らない。

通常補足・訂正置換の全文coverageは緩めず、既知節と未解釈推量を混ぜた回答は全体を保留する。原入力の既知節の明示訂正/撤回は適用し、未知範囲は残す。期間比較は未知範囲の差として扱い、推量から観察routeや不一致状態の差を作らない。文章/図・保存/再読は既存契約を使用。合成28入力で8件の欠落解消・20対照不変、12全文と実RN model、5入力の合成保存再読を確認した。固定source/CI・初回検査修正・残件は06/API handoff u234。STRUCTURE_MAP_DELTA_NONE。一般的な推量/引用作用域の解決、推量自体の表示、全体ルートUI/IF/Savedと本人実機・稼働DB・正式商品受入れは残件。未配置。

## 4. Period source-set freeze

`AnalysisObservedMapRequest`:

```text
request_id
authenticated_owner_scope
period_start / period_end
members[]:
  saved_record_ref
  saved_record_version
  member_role = PERIOD_RECORD_IDENTITY
  source_commitment
  inclusion_status
  inclusion_or_exclusion_reason
  child_source_envelope_refs[]:
    ORIGINAL_INPUT exact1
    optional SUPPLEMENTAL_ANSWER exact1
source_set_version
dedupe_policy_version
comparability_policy_version
analysis_policy_version
locale = ja-JP
```

source adapter minimum duties:

- same-owner entitlement
- period inclusion / exclusion reason
- record version freeze
- duplicate detection
- source ordering evidence
- privacy class
- conflict / missing source preservation
- Piece / Emlis bodyとsimulation outputのsource mixing拒否

`members[]`はparallel arrayにせず、record identity / version / membership role / commitment / include-exclude reason / child envelope refsを一objectへ束ねる。`PERIOD_RECORD_IDENTITY`はSourceEnvelope roleではない。included recordのoriginal / supplemental childだけを別meaning-bearing SourceEnvelope refとして持つ。

一件の記録を傾向へ昇格しない。record countだけでroute edgeを作らない。

## 5. Event frame

各recordから次のtyped frameを作る。

```text
scene
role
attention_or_thought
action_or_nonaction
immediate_result_or_aftermath
participants
temporal_scope
polarity / modality
unknown fields
source evidence refs
conflict refs
```

欠けたstepをfixed labelやgeneric resultで補わない。partial frameはvalid resultである。

## 6. `GroundedMeaningGraph` and `HypotheticalScenarioGraph`

`GroundedMeaningGraph`はsource-grounded observed / derived / user-confirmed / user-corrected / unknown / conflictだけを持つ。

```text
epistemic_state:
  SOURCE_EXPLICIT
  FORMAL_DERIVED
  USER_CONFIRMED
  USER_CORRECTED
  UNKNOWN
  CONFLICT
```

IFは別graphである。

```text
HypotheticalScenarioGraph
  scenario_graph_id
  scenario_graph_version
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  scenario_nodes[]
  scenario_edges[]
  unmodelled_factors[]
  status
```

observed graphをIF nodeでmutationしない。IF graphのstepはoriginを必須とする。

```text
OBSERVED_ANCHOR
USER_CHOICE
SIMULATED_EXTENSION
UNKNOWN
```

## 7. Observed route model

### 7.1 Path nodes

Observed route pathのnode kindは次だけである。

```text
SCENE
ROLE
ATTENTION_OR_THOUGHT
ACTION_OR_NONACTION
IMMEDIATE_RESULT_OR_AFTERMATH
```

protective、burden、unknownはpath nodeへ混ぜない。

### 7.2 Observed edges

```text
OBSERVED_ORDER
REPEATED_COOCCURRENCE
```

- `OBSERVED_ORDER`: same-record等のexplicit order evidenceがある。
- `REPEATED_COOCCURRENCE`:複数sourceで一緒に現れるが、direction / causalityを主張しない。

共起を矢印因果へ変換しない。

`SOURCE_EXPLICIT` / `FORMAL_DERIVED` claimと上記edgeにはexact evidence refsを必須とする。evidenceなしobserved claimを`UNKNOWN`で代替しない。

### 7.3 Unknown gap

`UNKNOWN_GAP`は別identityで、次を持つ。

```text
gap_id
between_node_refs[]
missing_scope
reason_code
source_set_ref
```

unknownはobserved factではなく、足りない範囲を示す非矢印markerである。

## 8. Protective / burden annotations

protectiveとburdenはroute pathではなくnon-sequential annotation claimである。

```text
AnalysisAnnotationClaim
  annotation_id
  kind = PROTECTIVE | BURDEN
  target_node_or_edge_ref
  annotation_state = SOURCE_EXPLICIT_ANNOTATION | EVIDENCE_BOUND_INTERPRETIVE_HYPOTHESIS
  evidence_refs[]
  uncertainty
  alternative_explanations[]
  forbidden_promotions[]
```

direct source statementとinterpretive hypothesisを分ける。`INTERPRETIVE_HYPOTHESIS` edgeはannotation graphだけに存在し、observed route edgeへ入れない。

## 9. `ObservedSelfStructureMap`

```text
ObservedSelfStructureMapPayload
  kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  wire_kind = watashi.map.v2
  source_set_ref
  period
  route_graph
  annotation_claims[]
  unknown_gaps[]
  conflict_refs[]
  comparison_availability = NO_PREVIOUS | COMPARISON_PRESENT
  period_comparisons[] = exact0..1, canonical payload内へinline
  text_projection_ref
  visual_projection_ref

ObservedSelfStructureMap = GenerationArtifactBundle<ObservedSelfStructureMapPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  epistemic_partition = OBSERVED
  semantic_graph_ref
  experience_plan_ref
  primary_artifact = ObservedSelfStructureMapPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

各period artifactは別identityである。latest pointer、history item、detail、text、graphは同じcanonical `artifact_id@version`へresolveする。comparison objectも同じimmutable stored artifactに含め、別のunresolved private locatorへ逃がさない。

### 9.1 Period comparison

```text
PeriodComparison
  comparison_id
  current_artifact_ref
  current_source_set_ref
  previous_artifact_ref
  previous_source_set_ref
  comparability_state = COMPARABLE | NOT_COMPARABLE
  reason_codes[]
  change_claims[]:
    change_kind = ROUTE_EVIDENCE_CHANGED
                | ANNOTATION_EVIDENCE_CHANGED
                | UNKNOWN_SCOPE_CHANGED
                | CONFLICT_STATE_CHANGED
    current_ref
    previous_ref
    evidence_refs[]
```

`NOT_COMPARABLE`では`change_claims` exact0、reason exact1以上とする。`COMPARABLE`でも差分を改善、悪化、原因、達成へ自動昇格しない。

previous artifactがない初回は`comparison_availability=NO_PREVIOUS`、`period_comparisons` exact0とする。safe projectionも`NO_PREVIOUS`を明示し、架空のprevious / change claimを作らない。

## 10. IF route

### 10.1 Request

```text
AnalysisIfRouteRequest
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  requested_candidate_count = 1..3
  analysis_if_policy_version
```

branch point / intent / constraintが足りない場合、Analysis ownerが`ClarificationRequest`を決める。Emlis question policyを流用しない。answerはsimulation-session sourceであり、period observed sourceへ入れない。

### 10.2 Scenario candidates

Analysis ownerはmeaningの異なるscenarioを1–3含む`IfScenarioCandidateSet`をexact1作れる。

- candidate間をsuccess / improvement / likelihoodでrankしない。
- best routeを自動選択しない。
- 1–3を並列提示する。
- required conditions、frictions、unknown、unmodelled factorsを表示する。
- result probability、future guarantee、optimality scoreを生成しない。

CMEE comparatorが選べるのは、同じscenario graphの`RealizationCandidateSet`だけである。意味の異なるscenarioをsurface qualityで一つへ選ばない。

### 10.3 IF scenario set artifact

```text
IfRouteSimulationPayload
  kind = ANALYSIS_IF_ROUTE_SIMULATION
  wire_kind = watashi.if-route.v1
  scenario_artifact_ref
  base_observed_map_ref
  base_route_ref
  branch_point_id
  scenario_graph_ref
  branch_intent_source_ref
  condition_refs[]
  unmodelled_factor_refs[]
  text_projection_ref
  visual_projection_ref
  scenario_display_label

IfScenarioCandidateSetPayload
  kind = ANALYSIS_IF_SCENARIO_SET
  wire_kind = watashi.if-route-set.v1
  candidate_set_id
  base_observed_map_ref
  base_route_ref
  scenarios[] = IfRouteSimulationPayload, exact1..3
  display_order[] = scenario_artifact_ref exact set
  selection_policy = PARALLEL_NOT_RANKED

IfScenarioCandidateSet = GenerationArtifactBundle<IfScenarioCandidateSetPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_IF_SCENARIO_SET
  epistemic_partition = HYPOTHETICAL
  semantic_graph_ref = candidate_set_id
  experience_plan_ref
  primary_artifact = IfScenarioCandidateSetPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

scenario candidateの意味identityはcandidate set内で保ち、Bundleの`companion_artifacts`へ曖昧に並べない。全scenarioは同一`base_observed_map_ref` / `base_route_ref`へbindする。`display_order`は表示順でありrankではない。

branch point / intent / constraint不足時は`EngineOutcome(status=QUESTION_PENDING, artifact_bundle=null, clarification_request=...)`を返し、空の`HypotheticalScenarioGraph`やIF artifactを作らない。

## 11. `SavedRouteIntent`

userが明示保存した関心方向は、IF artifactともobserved mapとも別identityである。

```text
SavedRouteIntentPayload
  kind = ANALYSIS_SAVED_ROUTE_INTENT
  wire_kind = watashi.saved-route-intent.v1
  source_scenario_set_ref
  selected_scenario_ref
  selection_source_ref
  user_note_source_ref?
  saved_at

SavedRouteIntent = GenerationArtifactBundle<SavedRouteIntentPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_SAVED_ROUTE_INTENT
  epistemic_partition = USER_SAVED_INTENT
  semantic_graph_ref = selected scenario graph
  parent_artifact_refs includes source scenario set
  source_commitments includes user selection source + optional note only
  experience_plan_ref
  primary_artifact = SavedRouteIntentPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

SavedRouteIntentは`ANALYSIS_SAVE_ROUTE_INTENT` operationでCMEEがcompileし、Analysis lifecycle serviceがauth、retrieval、persistence、read accessを所有する。userがscenarioを選択した操作を`SIMULATION_SESSION_MATERIAL` SourceEnvelope exact1としてcommitし、optional noteも別sourceにする。scenario set / simulation / scenario graphはderived parentでありsource commitmentではない。`selected_scenario_ref`はsource set member exact1でなければREJECTする。

saved intentをobservedへ自動昇格しない。後続記録との比較をachievement / failure / causal proofへしない。

## 12. Text / visual projection

CMEE shared graph projection protocolはsemantic edgeを発明しない。Analysis compilerが作ったtyped graphを表示planへ投影するだけである。

`AnalysisVisualPlan`:

```text
projection_id
projection_of = artifact_id@version
node_specs[]
edge_specs[]
lane_specs[]
group_specs[]
evidence_badges[]
unknown_badges[]
branch_markers[]
style_tokens:
  theme_ref
  layout_policy_ref
  accessibility_policy_ref
accessibility_linear_order[]
text_fallback_ref
```

V1-D observed mapでは`branch_markers` exact0でよい。V1-E scenarioではbranch point / user-selected branchを`branch_markers`で明示する。`group_specs`はvisual groupingだけを表し、semantic edgeやscenario rankを作らない。

visual semantics:

- observed route: solid + label
- simulated route: clearly labelled dashed + icon
- unknown gap: broken / dotted + unknown label
- user-selected branch: explicit marker
- 色だけに依存しない

RN rendererはAnalysis product ownerである。text / graph / accessible linear viewは同じcanonical artifactへresolveする。

canonical stored `watashi.map.v2` artifactはprivateで、exact evidence / source refsを保持する。API / RNへはaccess ownerがversioned safe projectionを作り、`projection_of = artifact_id@version`、visible node / edge / badge、anonymous evidence count、unknown / conflict / period comparison stateだけを渡す。raw body、private source ID、private evidence locator、source digestはprojection 0である。latest / history / detailが同じcanonical identityへresolveすることは、private stored JSONと全audience向けprojection bytesが同一であることを意味しない。

projectionでも`OBSERVED_ORDER`だけが`from_ref / to_ref`を持つ。`REPEATED_COOCCURRENCE`はunordered `endpoint_refs[]`で表し、矢印化しない。annotation / unknown / conflictはvisible labelだけのstring listにせず、safeな`target_ref` / `between_node_refs`を保持してgraph上の対応を失わない。

V1-E safe projectionは`watashi.if-route-set.v1`、SavedRouteIntent safe projectionは`watashi.saved-route-intent.v1`を使う。IF projectionはscenario origin、required condition、friction、unmodelled factorを保ち、rank / score / probabilityを持たない。SavedRouteIntent projectionはowner-authorized exact1で、選択scenarioとoptional noteだけを返す。どちらもobserved safe projectionへ混ぜない。

## 13. Safety and epistemic gates

hard reject:

- unsupported diagnosis / personality / hidden cause
- one record -> trend
- cooccurrence -> causal order
- observed / simulated / saved identity mixing
- protective / burden -> fact promotion
- future / probability / optimality claim
- filler step / generic result
- evidence ref absent observed claim / edge
- hidden conflict / insufficient data
- high-care IF without required confirmation
- Piece / Emlis voice or body reuse

valid failure resultはpartial map、unknown gap、conflict表示、IF unavailableである。fixed four-step fallbackへ戻さない。

## 14. Verification

V1-D proposed tests:

```text
ai/tests/test_cmee_analysis_v1d_source_adapter.py
ai/tests/test_cmee_analysis_v1d_intent_compiler.py
ai/tests/test_cmee_analysis_v1d_observed_route_realizer.py
ai/tests/test_cmee_analysis_v1d_vertical.py
ai/tests/test_cmee_analysis_v1d_negative_contracts.py
```

V1-E proposed tests:

```text
ai/tests/test_cmee_analysis_v1e_if_route_realizer.py
ai/tests/test_cmee_analysis_v1e_identity_separation.py
ai/tests/test_cmee_analysis_v1e_negative_contracts.py
```

machine acceptance:

- visible observed claim / edge evidence ref coverage 100%
- filler step / result 0
- observed graph simulation mutation 0
- simulated step origin label 100%
- future / causal / diagnosis / personality / optimality assertion 0
- text / visual / pointer / history identity mismatch 0
- unknown / conflict concealment 0
- safe projectionのraw body / private source ID / private evidence locator / source digest leakage 0
- policy-external projection read 0

Human Product Read:

- 観測・仮想・unknownを区別できる。
- 現在のrouteとして読めるが、人格診断に見えない。
- protectiveとburdenが原因断定に見えない。
- IFが正解や予測として押し付けられていない。
- actual RN表示でroute / branch / evidence / unknownが読める。

## 15. Migration and cutover

### 15.1 Stored artifact and wire identity

V1-D first storage candidateはcurrent self-structure report familyへimmutable `watashi.map.v2` JSONをadditive保存する。

```text
wire kind = watashi.map.v2
stored raw user body = 0
stored evidence refs = required
stored artifact_id@version = canonical
latest pointer / history item / detail / text / graph = same stored artifact
view-time meaning or route regeneration = 0
API / RN = audience-authorized safe projection_of canonical artifact
```

implementation前にfresh DB row contract、payload bytes、read/write latency、index / history cost、retention、RLS / accessをpreflightする。current table boundary内で成立しない場合、evidenceを落として通さず`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`とし、child tableまたはdedicated artifact storageをseparate Mash decisionへ出す。

existing tier、access、unread、dirty / refresh semanticsをregression gateに含める。historical `watashi.map.v1`はread-only version dispatchで既存rendererへ渡す。global V1-D activationがOFFの間はv1 generationを選べるが、V1-D active requestの失敗からv1へper-request fallbackしない。v2 payloadをv1 shapeとして解釈しない。

V1-Eのfirst storage candidateは、Analysis lifecycle ownerが`watashi.if-route-set.v1`と`watashi.saved-route-intent.v1`をobserved mapとは別artifact kind / namespaceでimmutable保存する。parent observed map、scenario set、selected scenarioのversion refを固定し、view-time regeneration 0とする。DB / RLS / payload size / latency / retention / read-policy preflightで安全に分離できなければ`NO_SAFE_ANALYSIS_V1E_STORAGE_STOP`とし、observed `watashi.map.v2`へ混ぜて通さない。

V1-E safe projectionはcanonical IF / Saved identityからAnalysis access ownerが生成する。IF / SavedのAPI / RN pathとstorage exact ownerはV1-E separate approvalでfresh固定し、それまでmaterialize 0である。

### 15.1.1 u95 actual storage fit-gapと別判断候補（当時未承認、u96承認済み）

2026-10-03にSupabase `cocolon-project` のcatalog／columns／constraints／grants／policies／view定義だけをread-only確認した。ユーザー行・入力本文は読んでいない。

- `myprofile_reports`はRLS enabled、authenticatedのown SELECT policyがあり、content_jsonを含む本人行の直接読取が可能。safe API serializerを通さずprivate evidenceを取得できてしまう。
- `self_structure_reports`は同tableの全列view、security_invoker=true、service_role SELECTのみ。viewが限定されても基底tableの本人direct SELECTは残る。
- uniqueは`(user_id,report_type,period_start,period_end)`、期間列はdate。既存latest writerは固定1970期間へmerge-upsert、monthly writerも同uniqueへupsert／旧schema行削除を行う。private immutable versionの格納先にはそのまま使えない。
- `emotions`のcreated_atはtimestamp without time zone、既存saved-input ownerはUTCと定義。version／deleted_at列はなく、exact7field commitmentと実在本人行を使う。
- byte／latency／history costの実測や新schema validationは未実行。既に確認できたprivate read／immutabilityの不成立に対し、無関係な前段測定を増やさない。

従って現行tableへの格納は`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`。上の§15.1に従い、次の**1案をMashの別判断へ出す**。この段落は承認済みschemaへの変更ではなくreviewable proposalで、SQL／table／flagはまだ追加・適用していない。

| 候補 | 内容 |
|---|---|
| 保存先 | 同じSupabaseのbackend専用`analysis_observed_artifacts` table 1つ。外部service追加なし |
| identity／access | immutable artifact_id＋version、本人owner、期間、report mode。user削除へ連動、RLS enabled、anon／authenticated直接権限なし、service_roleのみ |
| 内容 | raw user body 0。closed serializerでcanonical evidence refs／source commitments／graph identityと、生成時のsafe projection／textを保存。`asdict(current artifact)`による原文label保存は禁止 |
| freshness／削除 | commit時に本人・tier・source set／version／補足revisionを同transactionで再照合。元記録・補足の変更／削除時は影響artifactを無効化／削除し、readでも検証。request-local再読取をatomic writeと扱わない |
| API | 既存self-structure latest／history／detailのV2分岐だけへ接続。同じ保存identityからsafe projectionを返し、view-time意味再生成0。Free履歴不可・Plus deep不可をserverでも実施 |
| legacy | 旧myprofile_reportsと旧rendererを履歴用に維持。MyProfile互換はcanonicalへdelegate。`/mymodel/infer`／cron／workerの旧builderにprivate metaを共通追加しない |
| 進め方 | この保存方式の判断後にmigration／serializer／保存RPCとAPI差分を実装・検証。現在のPR反映からDB適用・公開cutoverへ自動進行しない |

既存tableのdirect SELECT権限と全旧writerを変える方式より、分析専用の1 tableへ限定する方が変更範囲が小さいため推奨する。旧table全体の権限を黙って剥奪して設計条件を満たしたことにはしない。

### 15.1.2 u96/u97 承認済み保存実装・DB適用

Mashの同じDBへのserver専用table1追加承認により、上記案を実装した。実migration `20261003204421 / analysis_observed_artifacts`、source `supabase/migrations/20261003134440_analysis_observed_artifacts.sql`。14列・14制約・4 index・6関数・5 triggerを事後照合し、関数body全文一致。RLS有効、anon/authenticated直接権限0。private evidenceのsource refs/commitmentと既に生成したsafe text/projectionを保存し、原入力JSON/private node labelは保存しない。

新owner `analysis_observed_service.py` がSQL snapshot→既存CMEE→closed serializer→atomic commit→safe readを担当。DB guardはCMEE commitmentと別namespace。READ COMMITTED＋auth KEY SHARE NOWAIT＋4source表SHARE NOWAITで全cohort/tierを再照合する。生成はlock外。競合409・ACK不明503。source/補足変更・削除、account削除で関連artifactを除去し、read時も再照合。table lockは他user書込にも短く競合し得る。

既存latest/status/monthly/history/detail/unreadへ同じ保存identityを接続。読取で意味を生成し直さず、保存text/graphの一致を検証。旧履歴はaccess後に混在表示し、Free履歴とPlus deepをserverで拒否する。status/latestはmode＋期間で選別してからlimit。RN既読は表示したprojection_ofに固定。

`COCOLON_ANALYSIS_OBSERVED_MODE`はoff既定／read_only保存読取／development生成保存。稼働envは未変更。monthly include_secret=false/now_isoは未対応400。旧/mymodel・cron/workerは今回変更しておらず、下記global単一owner cutoverの完了ではない。

Python54、RN11＋旧互換2、隔離PGlite31項目PASS。実ユーザー入力の生成・稼働APIの保存往復・複数接続負荷・nativeは未確認。適用応答待ちの停止からの再開経緯、実権限、既知範囲、次の指定API開発配置は06/API handoff末尾u96/u97に記録。全file mapはAnalysis map §4.7。

### 15.2 One-owner cutover

V1-D activation packet:

```text
new observed-map generation owner exact1
current Watashi Map v1 generation owner active ingress 0
per-request silent fallback 0
dual-write / dual-render truth owner 0
```

old renderer / API shapeをcompatibility projectionとして使う場合も、truth generation ownerはexact1とする。安全なmigrationができなければ`NO_SAFE_ANALYSIS_V1D_CUTOVER_STOP`。

V1-E activationはV1-D後の別packetで行う。V1-DとIFを一度にactivateしない。

## 16. Completion

```text
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
```

requires:

- period sourceからpartialを許すevidence-bound observed routeを作る。
- observed / annotation / unknown / conflict identityが分離する。
- latest / history / detail / text / visualがcanonical identityへ一致する。
- current generic fallback ownerがactive ingress 0になる。
- Product Readとactual RN proofを通過する。

```text
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
```

requires:

- observed mapをmutationせず1–3 scenarioを作る。
- candidate set exact1内でsame base map / routeを持ち、表示順をrankへ昇格しない。
- scenarioをrank / optimal選択しない。
- observed / hypothetical / saved identityが分離する。
- user selection sourceとderived scenario parentを分離する。
- IF / Savedのseparate immutable storage / safe projectionを通過する。
- simulation safety / clarification / display proofを通過する。

V1-DまたはV1-Eをthree-core completionへ自動変換しない。
