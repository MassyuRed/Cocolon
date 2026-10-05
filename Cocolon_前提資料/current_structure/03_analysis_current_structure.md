---
doc_id: cocolon_analysis_current_structure
title: "分析構造 — Current Structure"
revision_date: "2026-10-06 JST"
document_role: "ANALYSIS_CURRENT_STRUCTURE_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
implementation_effect: 0
if_route_activation_effect: 0
automatic_progression: false
---

# 分析構造 — Current Structure

## 0. Current conclusion

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

**直前の配置確認（u128）**：空期間を422にしていた処理の修正版API `1a42b9ebc25ba9765bdb17658cf47dd631d9f40d` は、既存Renderのdeploy dep-db146o2d0e5s73e1bc3gでJST21:16:55 live。healthz/bootstrap200、未認証status401を確認。u122正常空画面修正を含む **TestFlight 1.0（6401）** もJST21:35:58送信成功。run64/37201625245、実source `166343c0b160e787b857a7b9d407b6f0afce756d`、archive/export/uploadとrun全体success。次は新版の端末導入と、記録のない状態で「現在表示できるわたしマップはありません。」の正常表示確認。Apple側利用可能/端末導入・本人実応答は未確認。生成・保存再表示・比較の実成功とは分ける。詳細はAPI運用§32・06末尾u128。

**配置済みの基盤**：比較SQLはu120で共有DBへ適用・照合済み（実履歴20261004051211）。上記APIにu102〜u118の内容修正版・u124診断・u127空期間処理を含む。development2値はMashの設定手順報告で、値の独立取得はしていない。u127のAPI191/RN17検査成功は合成検証として継承。6401は正常空表示修正を含み、旧6301とは区別する。商品受入れ・IF/global cutoverは未成立。以下のlegacy経路/過去節の未配置記述は当時の履歴で、最新状態はこの結論を参照する。

current RN／backendのWatashi Mapに加え、CMEE V1-Dのoffline observed-map実装を開始した。
2026-10-03 weekly review §6.6〜6.10とMashの「分析構造の実装に進んで」に基づく。Emlis/Pieceの文章品質全体完了を開始条件にしない。
u94で保存補足の明示的な訂正・撤回、owner向けsafe projection、同一artifactの文章と図を読むRN受信・表示経路を追加した。合成入力からbackend生成DTOを実際のRN component／latest・viewerへ渡す検査まで成立。u95で既存の本人認証・保存入力RPCを使う期間loaderと、ASTOR内の明示V2生成entryを追加した。合成DB応答→実loader／CMEE→safe文章・図の検査まで成立。u96/u97で承認済み専用tableを実DBへ適用し、immutable保存と既存APIへのV2接続を実装・検証した（§4.7）。稼働APIの配置・機能有効化、実ユーザー入力での実行、実機Product Readは未実施。
private previewは原文節を含む開発内部出力として分離し、watashi.map.v2は閉じたsafe DTOだけを専用rendererへ渡す。safeは認証された本人向け商品表示で、匿名共有ではない。現行Watashi Mapの稼働経路の置換、IF、SavedRouteIntentは未実施。
このmapがAnalysisのcurrent ownerであり、旧混在資料01Bは歴史参照とする。Draft branch上の実装と稼働中productを区別する。

## 1. 商品目的

分析構造は、保存入力の期間蓄積から、本人が現在よく通る自己構造を根拠付きで読める形へ変える。

中心となるrouteは次である。

    scene
      -> role
      -> attention / thought
      -> action / non-action
      -> immediate result / aftermath

そのrouteへ、守っているもの、負荷、unknown、conflict、期間差を別claimとして添える。

将来のIF routeは、observed current routeを上書きする正解、未来予測、命令、最適化ではない。
observed routeをbaseとし、ユーザーが選んだbranch intent／constraintから、別identityの仮想候補を並列提示する。

## 2. Current actualとfuture design

| Capability | Current actual | Designed future |
|---|---|---|
| period reports | Kokoro Weather／Analysis report routeあり | evidence graphとperiod comparabilityを強化 |
| self structure | Watashi Map、role_switches、routes、crossroads、unknown_areas | evidence-bound ObservedSelfStructureMap |
| route semantics | presentation-oriented fixed four-step／generic fallbackを含む | claim／edgeごとのexact evidence refs、partial route |
| protective／burden | formal typed visible ownerは未実装 | direct observationとinterpretive hypothesisを型分離 |
| IF route | owner pathなし、runtime exact0 | HypotheticalScenarioGraph + IfRouteSimulation |
| saved intent | owner pathなし | SavedRouteIntentをobserved／simulatedと別identityで保存 |
| visual | current Watashi Map cards | observed／IF／unknownを見分けられるgraph + accessible text |

上表のCurrent actualは稼働経路を示す。Draftのoffline observed実装は§4.5に分離する。

Current frontend／backendにIF route authorityはない。future designをcurrent runtimeへ数えない。

## 3. Current product flows

### 3.1 Analysis report／Kokoro Weather

    eligible period material
      -> analysis engine aggregation
      -> report material / generation
      -> validity gate
      -> API latest / history / detail
      -> RN Analysis report screens

### 3.2 Current Watashi Map

    self-structure eligible material
      -> signal / rule / fusion builders
      -> astor self-structure report
      -> watashi_map_service presentation model
      -> self-structure API latest / history / detail
      -> WatashiMapRenderer

Current watashi_map_service.pyはpresentation-orientedなfixed four-step routeを生成し、generic fallbackを含む。これはfuture CMEEのsource-grounded truth graph authorityではない。

### 3.3 Future observed and IF route

    period source-set freeze
      -> event-frame extraction
      -> cross-record evidence graph
      -> observed route induction
      -> protective / burden annotations
      -> period comparison
      -> optional user-requested IF scenario
      -> text + visual projection
      -> grounding / epistemic gates

## 4. Current architecture components and files

### 4.1 Cocolon RN

| Responsibility | Path | Lifecycle |
|---|---|---|
| stack | navigation/AnalysisStackNavigator.js | CURRENT_ACTUAL |
| Analysis shell | screens/AnalysisScreen.js | CURRENT_ACTUAL |
| route model | screens/analysis/analysisRouteModel.js | CURRENT_ACTUAL |
| report actions | screens/analysis/useAnalysisReportActions.js | CURRENT_ACTUAL |
| self-structure actions | screens/analysis/useAnalysisSelfStructureActions.js | CURRENT_ACTUAL |
| report home／viewer／history | screens/AnalysisContentFirstScreen.js、screens/AnalysisReportViewerScreen.js、screens/AnalysisReportHistoryScreen.js、screens/AnalysisHistoryScreen.js | CURRENT_ACTUAL |
| self-structure current／generate／viewer／history | screens/AnalysisSelfStructureScreen.js、screens/SelfStructureReportGenerateScreen.js、screens/SelfStructureReportViewerScreen.js、screens/SelfStructureReportHistoryScreen.js | CURRENT_ACTUAL |
| Watashi Map renderer | components/selfStructure/WatashiMapRenderer.js | CURRENT_ACTUAL |
| access policy | components/selfStructure/watashiMapAccessPolicy.js | CURRENT_ACTUAL |
| formatters | components/selfStructure/watashiMapFormatters.js | CURRENT_ACTUAL |
| route wire owner | lib/compat/legacyWireContracts.js | CURRENT_ACTUAL |

### 4.2 mashos-api analysis engine

| Responsibility | Path family | Lifecycle |
|---|---|---|
| analysis engine | ai/services/analysis_engine/ | CURRENT_ACTUAL |
| baseline／models | ai/services/analysis_engine/baseline.py、ai/services/analysis_engine/models.py | CURRENT_ACTUAL |
| daily／weekly／monthly | ai/services/analysis_engine/emotion_structure_engine/daily.py、ai/services/analysis_engine/emotion_structure_engine/weekly.py、ai/services/analysis_engine/emotion_structure_engine/monthly.py | CURRENT_ACTUAL |
| self builders | ai/services/analysis_engine/self_structure_engine/builders.py | CURRENT_ACTUAL |
| fusion／rules／signals | ai/services/analysis_engine/self_structure_engine/fusion.py、ai/services/analysis_engine/self_structure_engine/rules.py、ai/services/analysis_engine/self_structure_engine/signal_extraction.py | CURRENT_ACTUAL |

### 4.3 mashos-api entry, material, quality, and render

| Responsibility | Path | Lifecycle |
|---|---|---|
| analysis read API | ai/services/ai_inference/api_analysis_reads.py | CURRENT_ACTUAL |
| report API | ai/services/ai_inference/api_analysis_reports.py | CURRENT_ACTUAL |
| self-structure API | ai/services/ai_inference/api_self_structure.py | CURRENT_ACTUAL |
| self-structure history façade | ai/services/ai_inference/api_self_structure_reports.py | CURRENT_ACTUAL |
| material snapshots | ai/services/ai_inference/astor_material_snapshots.py | CURRENT_ACTUAL |
| analysis adapter | ai/services/ai_inference/analysis_engine_adapter.py | CURRENT_ACTUAL |
| self report generation | ai/services/ai_inference/astor_self_structure_report.py | CURRENT_ACTUAL |
| validity gate | ai/services/ai_inference/analysis_report_validity_gate.py | CURRENT_ACTUAL |
| Kokoro Weather | ai/services/ai_inference/kokoro_weather_service.py | CURRENT_ACTUAL |
| Watashi Map presentation | ai/services/ai_inference/watashi_map_service.py | CURRENT_ACTUAL |
| shared text guard adapter | ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer.py | SHARED_SUBSYSTEM |
| shared Analysis input contract | ai/services/ai_inference/cocolon_text_generation_core/adapters/analysis_composer_input_contract.py | SHARED_SUBSYSTEM |

Current AnalysisComposerはcaller-supplied textをguardするadapterであり、ObservedSelfStructureMapまたはIF graphを生成しない。

### 4.4 Representative protected tests

| Contract | Path |
|---|---|
| national core Analysis | ai/tests/contract/test_new_national_core_analysis_contracts.py |
| Kokoro Weather | ai/tests/test_analysis_report_kokoro_weather.py |
| Watashi Map payload | ai/tests/test_self_structure_watashi_map_payload.py |
| Watashi Map service | ai/tests/test_watashi_map_service.py |

current testsは主にpayload／label／presentation contractを守る。evidence-bound observed edgeまたはIF graphのauthority証明ではない。

### 4.5 CMEE V1-D offline implementation／RN受信（2026-10-03 u94）

backend prefixはmashos-apiの`ai/services/ai_inference/cocolon_meaning_experience_engine/`。

| File | Responsibility | State |
|---|---|---|
| `cores/__init__.py`、`cores/analysis/__init__.py` | Analysis専用consumerのpackage境界 | OFFLINE_IMPLEMENTED |
| `cores/analysis/source_adapter.py` | 期間・owner・LIVE・version・補足親identity、重複排除、exact byte/scalar evidence。置換節のparser viewは原answer envelopeの範囲へ戻す | OFFLINE_IMPLEMENTED |
| `cores/analysis/intent_compiler.py` | 部分node／edge／unknown、独立記録の同時出現、対象occurrenceの訂正・撤回、格と有限述語operatorを保持するproposition | PARTIAL_OBSERVED_IMPLEMENTED |
| `cores/analysis/observed_route_realizer.py` | 不変artifact、private previewと本人向けsafe text／visual projectionを別生成。unknown対象を保持 | OFFLINE_SAFE_PROJECTION_IMPLEMENTED |
| `engine.py` | `AnalysisObservedMapRequest`専用dispatch。application modeは未許可 | OFFLINE_ONLY |
| `ai/tests/test_cmee_analysis_v1d_vertical.py`（repo相対） | source／補足→artifact、operator、owner／evidence、safe表現の26検査 | PASS_LOCAL |

RN側はCocolon repo相対。既存のlifecycle ownerを増やさず、受信済みprojectionの解釈と表示を分離する。

| File | Responsibility | State |
|---|---|---|
| `components/selfStructure/watashiMapV2Contract.js` | 閉じたDTO・version・参照整合性を検証し、同一graphから読み順・文章・表示modelを構成 | SOURCE_IMPLEMENTED |
| `components/selfStructure/WatashiMapV2Renderer.js` | 観測node／同時出現／順序、対象を持つunknown／注記／競合、同一内容の読み上げ用文章 | SOURCE_IMPLEMENTED |
| `components/selfStructure/watashiMapFormatters.js` | 旧v1専用。v2／private／不正・未知versionを旧map／旧本文へ戻さない | MODIFIED |
| `components/selfStructure/watashiMapAccessPolicy.js` | 既存tier policyを使いv2のraw modeを検証。Free最新概要・Plus標準・Premium深いmap | MODIFIED |
| `screens/SelfStructureReportGenerateScreen.js` | latest応答のversion dispatch。正しいDTOかつ許可modeのみ既読同期 | MODIFIED_RECEIVER_ONLY |
| `screens/SelfStructureReportViewerScreen.js` | history/detail応答のversion dispatch。履歴／mode制限、不正JSON・privateの旧本文fallback拒否 | MODIFIED_RECEIVER_ONLY |
| `screens/AnalysisContentFirstScreen.js` | latest embedded画面の既存caller | REVIEWED_UNCHANGED |
| `tests/analysis-watashi-map-v2-contracts.test.js` | backend DTO→実component／latest・viewer、参照／tier／fallback／既読の11検査 | PASS_LOCAL |
| `tests/fixtures/analysis-watashi-map-v2-synthetic.json` | backend生成の合成projection／text 2ケース。appのdummyデータではない | SYNTHETIC_TEST_ONLY |

`MAP_AND_EXPLORE / ANALYSIS_OBSERVED_MAP / OFFLINE_CANDIDATE`のみ受理する。本人の明示的な有限節から一部の行動・考えを採用し、場面・役割・結果など未成立部分をunknownとして保持する。同時出現線は無方向で原因を主張しない。順序線にはsource-boundの明示的時間関係が必要で、記録・配列順から生成しない。safe有限節grammarでは「昨日／その後」など時点接頭句は未対応であり、順序線のpositive cohortは未確認。

補足は共有の引用撤回／置換grammarで、親recordの原fieldに一意の完全節として存在する対象だけを更新する。元発話も明示本人の観測であることを検証し、伝聞・質問を置換後に本人へ付け替えない。cross-record集約前に親occurrenceだけを取り除き、置換の否定・願望・時点を再解釈し、count／同時出現／unknownを再計算する。通常の追加回答、部分一致、曖昧対象、未対応置換はUNAVAILABLEとして旧観測を返さない。

safeラベルは閉じた述語grammar（9動詞）と名詞項・格、極性、実行／願望、時点から再構成し、元節の全文・修飾語を黙って切り落として通さない。未対応意味はsafe projectionを生成できない。現段階は汎用日本語理解の完成ではなく、annotations／conflictの意味生成と期間比較も未完了。

private previewは`cocolon.cmee.analysis_private_preview.v1`／`watashi.map.v2.private-preview`として開発内部だけに保つ。safe DTOはcanonical05の`cocolon.cmee.analysis_watashi_map_safe_projection.v1alpha1`／`watashi.map.v2`に限定し、raw body、private source ID、evidence locator、digestを持たない。意味項として本人入力の名詞を保つため、匿名telemetryや外部共有へ転用しない。source取得の認証・tier・retention・削除再検査は§4.7のAPI/lifecycle ownerが担当し、offline requestのowner文字列を認証と扱わない。

期間loaderのsource接続はu95、immutable保存とlatest／history／detailの同一保存identity解決はu96/u97で実装した。稼働API配信は未実施。RNは応答受信時の準備でありnative画面確認ではない。旧renderer自体は保持し、IF／SavedRouteIntent／外部exportはHOLD。

### 4.6 保存入力からのread-only生成（2026-10-03 u95時点の履歴）

すべてmashos-api repo相対。新しいservice／flag／routeを増やさず、既存material ownerとASTORへ置く。

| File／function | 責任 | 状態 |
|---|---|---|
| `ai/services/ai_inference/astor_material_snapshots.py::load_analysis_saved_period` | 本人認証→tier/mode/期間確認→emotionsのID集合→既存EmlisThreadStore.read。元7fieldと1補足をexactに結合 | IMPLEMENTED_READ_ONLY |
| 同 `recheck_analysis_saved_period` | 生成後に本人・tier・同期間ID集合・原入力commitment・thread revision・補足metadataを再読取 | IMPLEMENTED_READ_ONLY |
| `ai/services/ai_inference/astor_self_structure_report.py::prepare_saved_analysis_observed_map` | 保存source→既存CMEE→safe文章／図。旧builder／upsertへ接続せず、private artifactを返さない | IMPLEMENTED_INTERNAL_ENTRY |
| `.../cores/analysis/source_adapter.py::_time` | DB原入力created_atだけを既存保存owner同様UTCとして読む。naive原文字列・exact commitmentは不変、要求期間はtimezone必須 | MODIFIED |
| `ai/tests/test_analysis_saved_period.py` | 実loader／CMEE／ASTORの13検査、HTTP/RPC・認証・tierのみ合成応答 | PASS_LOCAL |
| `emlis_thread_store.py`、`emlis_thread_service.py`、`supabase_client.py`、`subscription.py`、`publish_governance.py`（同inference配下） | 既存の認証済みsaved source、回答束縛・保持期間・HTTP／tier ownerを再利用 | REVIEWED_UNCHANGED |

ID取得は半開区間と`created_at.asc,id.asc`を固定し、count=exactと101件目で100件超・不完全取得を拒否する。保持期間に収まらない窓は切り詰めずUNAVAILABLE。DBにはsource version／LIVE列を捏造せず、実在本人行と保持期間、原7fieldのcommitmentで束縛する。threadの旧source_snapshot、回答の親／質問／round／event ID不一致を拒否し、Q3複数回答を最後の1件へ切り詰めない。質問は束縛確認にだけ使い、生成Emlis本文・意味checkpointはAnalysis sourceにしない。

再読取は観測可能な競合を拒否するが、DB保存transactionの保証ではない。新entryは未登録・未配置で、`/mymodel/infer`／worker／cronが使う旧builderは変更しない。API39検査（新13＋既存26）PASS。実DBユーザー入力を使った生成は未実行。

保存は`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`。fresh DB catalogで既存myprofile_reportsの本人direct SELECT・全content_json、date uniqueと現行merge-upsertを確認した。private evidenceをそのまま追加できないため、canonical04 §15.1.1のbackend専用immutable table候補をMashの別判断へ出す。loaderまでのコード反映を専用保存の承認・実API接続へ換算しない。

### 4.7 サーバー専用保存と既存API接続（2026-10-04 JST u96/u97）

Mashの専用table承認に基づく。DB適用済み、API/RN sourceはDraft・稼働未配置。u95の保存方式判断待ちは解消した。

| Repository / file | 責任・状態 |
|---|---|
| mashos-api `supabase/migrations/20261003134440_analysis_observed_artifacts.sql` | 新table1、immutable identity、server-only ACL、snapshot/commit/read、source変更無効化。実履歴20261003204421へ適用・照合済み |
| mashos-api `ai/services/ai_inference/analysis_observed_service.py` | 新lifecycle owner。期間source→CMEE→closed evidence/safe文章・図の保存、読取時freshness、mode/期間別latest、既定off |
| 同 `api_self_structure.py` | 認証後latest/status/monthlyのV2分岐。稼働への配置は未実施 |
| 同 `report_artifact_read_service.py` | 旧履歴とV2のaccess後統合、同UUIDの詳細、プラン/不正V2拒否 |
| 同 `api_report_reads.py` | 同じ可読履歴IDをunreadへ接続 |
| mashos-api `ai/tests/test_analysis_observed_api.py`、`test_analysis_observed_storage.py` | 新HTTP 6＋保存9検査、通信だけ合成応答。既存39と計54 PASS |
| mashos-api `ai/tests/analysis_observed_storage_sql.cjs` | 隔離Postgresへの実migrationと保存/ACL/変更・削除/競合前提31項目確認。外部一時test依存、製品依存変更なし |
| Cocolon `screens/SelfStructureReportGenerateScreen.js` | 表示したV2 identityだけを既読化し、後続statusとのraceを除く |
| Cocolon `tests/analysis-watashi-map-v2-contracts.test.js` | 上記既読race期待を更新、実component11 PASS。旧互換2 PASS |

原文節のprivate previewは保存しない。DB専用guardとCMEE commitmentを分離し、commit時は短いSHARE NOWAIT lock内で全source/tierを照合。変更/削除で関連artifactを除去し、読取時も照合する。文章と図は同じ保存identityへ戻り、意味再生成0。Free latest lightのみ／履歴不可、Plus deep不可。read_onlyは有効保存版を維持する。

`COCOLON_ANALYSIS_OBSERVED_MODE=off|read_only|development`（source既定off、稼働設定未変更）。月初半開期間、legacy履歴併存、safe本文一致検証を実装。既存/mymodel・cron・workerの旧builderは変更しておらず、global cutover・配置・本人入力一往復・nativeは次工程。詳細なDB照合・検証・残件はcanonical04 §15.1.2および06/API handoff末尾u96/u97。

### 4.8 通常補足の分析採用と同一意味の集約（2026-10-04 u102）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 通常補足の全文・本人・既存grammar解釈、exact evidence被覆、対立記述の保留。同じ意味の格順/丁寧語表記を一観測へ束ね、全evidenceと独立record件数を保持 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 追加7＋既存26＝33 PASS。文章/図、補足出典、非重複件数、無方向共起、未解釈/訂正混在/反対極性を確認 |

通常補足も親recordの一機会で、別入力件数にしない。引用訂正/撤回の優先経路は維持。全文が読めない回答や矛盾の意図が未確定な回答を都合よく部分採用しない。新規path/owner/DB/DTO/RN/依存追加0。語彙は既存9動詞/名詞項に限定され、一般日本語・複数補足・意味annotation/比較/IFは残る。u102 sourceは未配置。実機OKはu101版に対するMash報告であり、修正版の本人実行や保存UUIDの華恋による照合ではない。

### 4.9 明示された記録内順序と出来事の保持（2026-10-04 u103）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 接頭接続語を型と元位置に保持。同一source/fieldの隣接する完全SELF過去factだけを順序へ接続。両端をoccurrenceで保持し、撤回/未解釈節を橋渡ししない |
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py` | 「その後」「それから」を区別してsafe表示へ再構成。否定/希望を保持 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存33＋追加9＝42 PASS。exact evidence、反復、願望、補足出典、訂正/撤回、未確定接続を確認 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存9＋追加1＝10 PASS。A→B→Aの3node/2edgeを保存・再読取で同一のまま保持、意味再生成/内部proposition漏出なし |

saved period13/API6と合わせ71 PASS。既存RN validator/view modelへ新DTOを渡す一回の照合でbackend本文と完全一致。source/fieldを跨ぐ順序、記載順からの推測、因果化、独立recordを跨ぐ反復route集約は行わない。順序以外のu102同一意味集約は維持し、成立pair以外の不足を残す。新規file/契約/DB/RN変更0、source未配置。詳細はcanonical04 §3.4と06/API handoff末尾u103。

### 4.10 明示された今日/昨日を記述時点へ保持（2026-10-04 u104）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 完全SELF節の今日/昨日接頭辞をrelative_dayとexact source partsへ保持。元source/明示日ごとに集約し、別記録/補足の相対日を混ぜない。同一回答内の明示異日だけ対立候補を区別 |
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py` | 「この記述時点の今日/昨日」と表示。閲覧日・推定年月日へ置換せず、時制/否定/希望を保持 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存42＋追加8＝50 PASS。全節/evidence被覆、source別集約、補足対立、順序非推測、訂正/撤回、未解釈scopeを確認 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存10＋追加1＝11 PASS。相対日を含む保存DTO/文章を再解釈せず再読取、private項目漏出なし |

saved period13/API6と合わせ80 PASS。既存RN contract/view modelでsafe DTOとbackend文章が一致。日語なしのu102集約とu103の順序occurrenceを継承。「昨日＋現在の希望」、任意時点/複数修飾は保留し、日語だけで順序や原因を作らない。新規path/owner/API/DB/DTO/RN/依存変更0、未配置。詳細はcanonical04 §3.5と06/API handoff末尾u104。

### 4.11 可能性についての現在の考えを表示へ接続（2026-10-04 u105）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 共有source_current_cognitionの完全節witnessと既存9動詞/格の補文解釈を両方要求。内側UNSPECIFIED/possibilityと外側SELF/current_inputを区別しATTENTIONへ。内側の極性/時制/対象とhost差を集約に保持 |
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py` | 型付けされた補文と現在hostから「〜かもしれないと思っている（この記述時点の考え）」等へ再構成。実行済み・確定結果にしない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存50＋追加8＝58 PASS。inner/outer分離、完全evidence、同fieldの実行保持、補足/訂正/撤回、未認定scopeの保留 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存11＋追加1＝12 PASS。保存した考えの文章/DTOを再生成せず読取、内部possible_contentの漏出なし |

saved period13/API6と合わせ89 PASS。既存RN contract/view modelとbackend本文が一致。共有意味ownerは変更せず既存認定helperを参照。限定補文でのみ同じ9動詞の辞書形/否定形も扱い、主文の有限grammarは維持。場面/役割/結果、一般認識、過去/否定host、背景・複文の完成ではない。新規file/契約/DB/RN/依存変更0、未配置。canonical04 §3.6と06/API handoff末尾u105を参照。

### 4.12 明記された未成立の結果を表示へ接続（2026-10-04 u106）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 共有present_unfinished完全節witnessと限定名詞/格/否定状態解釈を両方要求。actor未指定のNOT_YETを結果nodeへ接続し、全出典/助詞/述語を保持 |
| 同 `observed_route_realizer.py` | 未成立状態を「まだ〜っていない（この記述時点）」として再構成。実行/未実行や原因を補わない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存58＋追加7＝65 PASS。型/全文evidence、未知部分、非順序、集約、補足/訂正/撤回、共有witness必須、疑問/未解釈scope保留 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存12＋追加1＝13 PASS。結果の文章/DTOをcommit後も同一identityで再読取、再生成0・内部型の非漏出 |

saved period13/API6と合わせ97 PASS。合成6出力の既存RN view modelとbackend本文が一致。対応はmemoの完全な「まだ＋名詞句＋は/が/も＋見つかる/決まる/定まるの現在否定状態」。主体/先行行動/因果/順序は推測しない。共有意味owner/API/DB/DTO/RN/依存変更0、未配置。一般結果・複文・場面/役割・annotations/conflict/比較/IFは未完了。canonical04 §3.7と06/API handoff末尾u106を参照。

### 4.13 明示された行動の後の変化を接続（2026-10-04 u107、PR反映済み）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 同一memo spanの2核・required typed relation・exact範囲・完全なSELF過去行動と名詞の有限変化・後/あと接続を全て要求。片側未解釈なら行動だけも採らない。順序の元全文証拠、occurrence分離、補足全文と全文訂正/撤回を保持 |
| 同 `observed_route_realizer.py` | 型から「疑問が減った（記録された変化）」等へ再構成。増減を改善/悪化と評価せず、既存の原因を主張しない順序表示を利用 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存65＋追加6＝71 PASS。2端点と接続詞のexact証拠、反復、補足、全文訂正/撤回、shared witness欠落、夢/伝聞/疑問/否定等の保留 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存13＋追加1＝14 PASS。行動・変化・順序のcommit/再読取、同一DTO/文章、再生成0、内部型非漏出 |

saved period13/API6を合わせ104 PASS。6合成本文をrootが読み、既存RN view modelとbackend本文が完全一致。右端は既存名詞/の連結＋は/が/も＋減った/増えた/変わった/戻った、actor未指定のaffirmative/fact/past。両端の何/誰/幾を含む疑問名詞を保留。たら/てから、3節、一般的な感情変化、否定行動のpair、進んだ等は未対応。共有owner/API/DB/DTO/RN/依存変更0。地図全体のfile配置は不変、上記既存責務だけを更新。canonical04 §3.8、06/API handoff末尾u107へ同期。u106/u107はPR反映済み、未配置。

### 4.14 「てから」の行動と過去変化を表示へ接続（2026-10-04 u108）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 既存9動詞のte形を時制未定として解析。共有2核・past結果・exactから接続を揃えたpair内だけで過去へ束縛。fragmentが文脈付きpropositionを持ち、元teのsource partsと通常補足/全文訂正/撤回を保持 |
| 同 `observed_route_realizer.py` | te形の再解析に加え、そのnode自身から同一source/field/spanの過去結果へ向かう順序とexact全文evidenceがある場合だけ実行済み表現へ再構成 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 既存71＋追加5＝76 PASS。9活用の証拠・依存時制、順序context欠落、補足/訂正/撤回、反復、単独te/夢/非過去/願望等の不昇格 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 既存14＋追加1＝15 PASS。te形pairのcommit/再読取・文章/DTO一致・再生成0・private marker非漏出 |

saved period13/API6と合わせ110 PASS、6合成出力の既存RN本文がbackendと一致。通常の主文有限grammarにteを加えず、同じ9動詞と4結果述語の範囲を維持。疑問名詞/否定/未解釈scopeの保留も維持する。共有owner/API/DB/DTO/RN/依存の変更0、file配置不変。canonical04 §3.9と06/API handoff末尾u108へ同期。たら/3節/一般感情変化/場面/役割/比較/IFは残る。u102〜u108は未配置。

### 4.15 行動後の過去の気持ちを表示へ接続（2026-10-04 u109）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 既存共有pair右端の5有限形を完全解釈しPAST_FEELINGへ。共有fact/feeling差を照合し、明示SELF/主体省略と元全文証拠を保持 |
| 同 `observed_route_realizer.py` | 「記録された気持ち」として再構成し、te形自身の同一source順序contextへ感情結果を含める。原因/改善を補わない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 81 PASS。有限形/主体/証拠/共有witness、未解釈scope、補足/全文訂正/撤回、反復、te context欠落 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 16 PASS。過去感情pairの保存/再読取・同一文章/DTO・再生成0・内部型非漏出 |

saved period13/API6と合わせ116 PASS、242 subtests PASS。6合成本文の既存RN表示modelとbackend本文が一致。安心した/安心しました、落ち着いた、嬉しかった/うれしかったの5形と省略/明示SELFに限定。単独感情、未認定のほっとした/落ち着きました、程度修飾、否定、夢/伝聞/推測は今回の認定へ含めない。新規file/共有owner/API/DB/DTO/RN/依存変更0、file配置不変。詳細はcanonical04 §3.10と06/API handoff末尾u109。u102〜u109は未配置。

### 4.16 本人が明記した過去の所在を場面表示へ接続（2026-10-04 u110）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 明示SELF＋既存名詞句＋に＋いた/いました/いなかった/いませんでしたを全文解釈。共有event/fact/極性と原文境界を照合し、内部PAST_PRESENCEからSCENEへ。長文の読点/固定長分割を完全節と扱わない |
| 同 `observed_route_realizer.py` | 所在の肯定/否定を「〜にいた／いなかった（記録された場面）」へ型から再構成。実行/勤務/役割を補わない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 88 PASS。4形/SELF/出典、共有witness、未解釈scopeと長文分割、明示順序、補足/全文訂正/撤回、件数と正負分離 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 17 PASS。場面正負と後続行動順序の保存/再読取、文章/DTO/identity一致、再生成0、内部型非漏出 |

saved period13/API6と合わせ124 PASS、305 subtests PASS。6合成本文の既存RN表示modelとbackendが一致。単なる隣接から順序は作らず、後続「その後/それから＋本人過去行動」の明示接続だけ既存順序処理へ渡る。「〜で調べた」の「で」から場所を推測しない。共有default actorだけで本人とせず、共有current_input時制は完全有限形のpastで具体化する。今日/昨日/その後を前置した所在、現在/未来/願望/推測/他者/夢/引用/未解釈修飾、memo_actionからの所在は今回含めない。

新規file/共有owner/API/DB/DTO/RN/依存変更0、file配置不変。詳細はcanonical04 §3.11と06/API handoff末尾u110。ROLE、一般場面、annotations/conflict/比較/IFは未完了。u102〜u110は未配置。

### 4.17 本人が明記した過去の担当を役割表示へ接続（2026-10-04 u111）

| Repository / existing file | 更新した責務 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 明示SELF＋既存名詞句＋を＋担当した/担当しました/担当しなかった/担当しませんでしたを全文解釈。共有event/factと文境界を確認し内部PAST_RESPONSIBILITYからROLEへ。ROLEだけrequired/shouldを許可しoptionalは拒否 |
| 同 `observed_route_realizer.py` | 「会議の司会を担当した／担当しなかった（記録された担当）」等へ型から再構成。担当対象を実行完了/能力/身分へ変換しない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 93 PASS。4形/主体/全文証拠、共有witness、未解釈scopeと長文境界、補足/全文訂正/撤回、同一内容と正負分離、5種類のnodeと明示順序 |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 17 PASS。既存SCENE正負を維持しROLE正負の保存/再読取を追加。文章/DTO/identity一致、再生成0、内部型非漏出 |

saved period13/API6と合わせ129 PASS、359 subtests PASS。6合成本文の既存RN表示modelとbackendが一致。共有retentionは4節以上で通常本文をshouldへ下げる保持優先度であり、明示された担当を不確かな内容と扱わない。SCENEのrequired条件は従来どおり。5種類がそろっても段階間の順序/原因は推測せず、明示された接続だけを描く。

名詞copula「私は司会者です」からROLEを推論しない。現在/未来/願望/可能/推測/伝聞/他者/引用/夢/未解釈修飾/疑問名詞、今日/昨日/その後付き担当、memo_actionの担当は今回対象外。「私は記録を担当した」は共有側が名詞keyword由来でactionにするため未対応として保留。新規file/共有owner/API/DB/DTO/RN/依存変更0、file配置不変。詳細はcanonical04 §3.12と06/API handoff末尾u111。一般ROLE・注記/conflict/期間比較/IFは未完了。u102〜u111は未配置。


### 4.18 同じ原入力の肯定・否定を対象付き未確定表示へ接続（2026-10-04 u112）

既存intent_compilerが同じ原入力の正負を別nodeとして保持しても不一致を表示しない不足を修正。SELF・past factのSCENE/ROLE/ACTION_OR_NONACTIONに限定し、同source/field/相対日・完全な命題内容で肯否だけが違う記述をObservedConflictへ結ぶ。別record、別field/day/対象、願望/認識、明示順序の参加evidence、接続語付きnode、従属形は比較しない。

両nodeとexact evidenceを保持し、「同じ記録に肯定と否定の記述があります。同じ機会のことかは確定していません」と既存conflict_badgesへ表示。真偽・同一機会・心理的葛藤を決めず、訂正/撤回を先に適用する。通常補足の正負不一致の保留は維持。既存observed_route_realizerのprivate/safe文章・図、analysis_observed_serviceのprivate evidence allowlist/保存validatorへ接続し、旧空badgeも再生成なしで読める。

vertical97/storage19/saved period13/API6＝135 PASS、379 subtests PASS。既存RN11 PASS、6合成出力のbackend/RN本文・identity・順序・badge件数一致。2件read-only reviewでblocking指摘なし。Auth/DBは合成検証。新規path/DTO/RN/SQL/依存変更0、未配置。一般的な矛盾理解、protective/burden注記、期間比較、IFは残る。詳細はcanonical04 §3.13と06/API handoff末尾u112。

### 4.19 希望と対比して明示された現在の負荷を注記表示へ接続（2026-10-04 u113）

既存共有意味のexact2核・finite contrast feeling witness・contrast relationから、明示SELF現在肯定願望と明示SELFのつらい/苦しい（丁寧形含む）の完全な一文だけを採用する。両端と接続を含む全文、元の文境界を要求し、否定/過去/推測/伝聞/他者/修飾/別文の隣接は負荷へ昇格しない。表示は「この希望と対比して、つらいと記述されています。原因や続いている期間は確定していません」。route nodeや順序線を増やさず、非連続の対象付き注記とする。

| 既存file | u113の責務差分 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | ObservedAnnotation、SOURCE_EXPLICIT_ANNOTATION、希望target、両端/全文の3証拠。同じ対象/述語の集約、補足の全文coverage、訂正/撤回と更新ref、その他の未知scope温存 |
| 同 `observed_route_realizer.py` | 原節/有限形/対象/証拠を照合し既存annotation_badgesへ投影。同じDTOからRNと一致する本文を構成 |
| mashos-api `ai/services/ai_inference/analysis_observed_service.py` | private evidence allowlist、非空注記の保存validator、空注記の旧artifact互換。原文/内部意味型をAPIへ漏らさない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py` | 103 PASS。完全根拠、境界/witness、集約、未知scope、補足/訂正/撤回、safe replay |
| mashos-api `ai/tests/test_analysis_observed_storage.py` | 21 PASS。保存/再読取の同一DTO・本文・identity、再生成0、private非漏出、破損注記拒否 |

saved period13/API6と合わせ143 PASS・447 subtests PASS。既存RN11 PASS、6合成本文のbackend/RN本文・identity・node順・注記target一致。DB/auth I/Oは合成。新規path/共有owner/API契約/DTO/RN/SQL/依存変更0。PROTECTIVE・解釈仮説・一般の負荷・期間比較・IFは残る。複数記録で同じ未確定項目が重複する既存表示は次の直接改善候補として記録。詳細はcanonical04 §3.14と06/API handoff末尾u113、未配置。

### 4.20 同じ対象・不足範囲・理由の未確定表示を集約（2026-10-04 u114）

u113実出力で、同じ希望へ集約した2記録から同じ未確定項目が8行表示されていた。既存 `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py` の生成projectionだけで、順序付きbetween_node_refs・missing_scope・reason_codeの完全一致を初出gap_refへまとめ、同例は4行とする。文言だけではまとめず、別対象・別理由・対象順の差を保持する。

ObservedGraph/private保存の8gapと各record/evidenceは全て残す。private previewとsafe表示に同じhelperを使い、文章と図は同じDTOから作る。_text_from_visualとread_savedは変更しないので、旧保存の8重複gap/本文/identityはそのまま読める。API/RNはgap_refの連番を要求しない。新しいpathやcontract、compiler/共有意味/保存service/RN source/DB/依存の変更はない。

既存vertical106/storage23/saved period13/API6＝148 PASS・447 subtests PASS、RN11 PASS。新規3本文と旧保存形式1本文のbackend/RN本文・identity・node順・unknown対象を照合。独立read-only reviewでblocking指摘なし。Auth/DB I/Oは合成、未配置。詳細はcanonical04 §3.15と06/API handoff末尾u114。次は未接続PROTECTIVEの最小明示根拠を既存共有意味と照合する。

### 4.21 本人が明記した守る対象を希望と注記へ接続（2026-10-04 u115）

「私は家族を守りたい」の共有wishは、従来Analysisのsafe表示へ到達していなかった。明示SELF＋既存名詞句＋を＋守りたい/守りたいですの全文を、既存ATTENTION_OR_THOUGHTとPROTECTIVE注記へ接続する。現在の肯定希望、共有の明示根拠、元の文境界が必要。対象を名詞から推測せず、成果/原因/行動の動機/性格へ昇格しない。過去/否定/推測/伝聞/夢/他者/未解釈複文/memo_actionはこの新注記の対象外。

| 既存file | u115の責務差分 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 完全有限形と共有wishを照合。PROTECTIVE対象nodeと同じ全文証拠、集約、更新refを保持。通常補足/明示訂正/撤回に接続 |
| 同 `observed_route_realizer.py` | 対象/希望意味/全証拠を再照合し、守る意向と未確定な実効を既存safe DTOへ投影 |
| mashos-api `ai/services/ai_inference/analysis_observed_service.py` | PROTECTIVEの対象と表示を保存readで検証。private evidence分離と既存保存互換を維持 |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py`・`ai/tests/test_analysis_observed_storage.py` | 全文証拠、共有witness、帰属/時制/文境界、集約と更新、実生成→合成RPC保存→再読取、破損DTO拒否 |
| Cocolon `components/selfStructure/WatashiMapV2Renderer.js`・`tests/analysis-watashi-map-v2-contracts.test.js` | PROTECTIVEの見出しを「守る対象」へ。意向を達成済みと読ませず、対象と未確定の説明を表示 |

vertical112/storage25/saved period13/API6＝156 PASS・509 subtests PASS、RN12 PASS。rootが6合成本文を全文読み、backend/RNの本文・identity・node順・注記target一致を確認。独立read-only reviewの伝聞/夢prefix指摘を再現して修正。共有の名詞「気持ち」によるfeeling分類とwishの重なりは、完全な現在希望の条件を維持して局所対応した。Auth/DB I/Oは合成、未配置。新規path/共有owner/API契約/DTO/SQL/依存変更0。詳細はcanonical04 §3.16と06/API handoff末尾u115。

### 4.22 二期間の記述差を認証付き開発previewへ接続（2026-10-04 u116時点の履歴）

既存の期間比較欄はNO_PREVIOUS固定だった。本人の現在期間と明示した前期間を同じCMEE実装で別artifactとして生成し、等長の直前隣接期間だけを比較する。重複/逆順/長さ違い/非隣接/同一record再使用は理由付きNOT_COMPARABLE・差分0。別owner、比較の連鎖、不正/空/未解釈の前期間は結果を返さない。

| 既存file | u116の責務差分 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py` | 内部request末尾にoptional comparison_previous_request。真正な保存入力requestだけを受け、公開DTO/生成文章を意味sourceにしない |
| 同 `intent_compiler.py` | PeriodComparison/PeriodChangeを型化。node意味と極性/時制/様相、順序/無方向共起、対象付き注記、不一致を比較。unknownの表示用anchorを意味差にしない |
| 同 `observed_route_realizer.py` | 現在artifactを外へ返す前にinline比較を固定。前artifactはrequest-local private outcomeへ保持。既存safe DTOの比較3keyと同じ本文へ投影 |
| mashos-api `ai/services/ai_inference/astor_self_structure_report.py` | 既存prepare_saved_analysis_observed_mapへ前期間boundsを追加。同auth/modeで両期間を取得し、両方を返却直前に再確認する。HTTP route/保存writerは追加しない |
| mashos-api `ai/tests/test_cmee_analysis_v1d_vertical.py`・`test_analysis_saved_period.py`・`test_analysis_observed_storage.py` | 意味差/同義形式/period条件/全証拠、両期間の読取/再確認、訂正/削除/権限変化、単一期間保存への比較DTO拒否 |
| Cocolon `components/selfStructure/watashiMapV2Contract.js`・`WatashiMapV2Renderer.js`・`tests/analysis-watashi-map-v2-contracts.test.js` | 既存4差分類を本人向け説明へ変換し、比較不可理由/検出差分なしをカードと同じ文章へ表示。旧NO_PREVIOUS本文は保持 |

比較は記述の意味集合を対象とする。raw evidence ID、node連番、語尾、件数差そのものから本人の変化を作らない。欠落段階/未読部分/表示上隣接する未接続部分は不足scope/reasonの種類集合に限定し、明示先行欠落のみ対象意味も保持する。一般の未読内容や反復頻度の比較は未実装。

vertical118/storage26/saved period16/API6＝166 PASS・541 subtests、RN13 PASS。6合成本文をrootが全文読み、backend/RNの本文・identity・node順・比較文一致を確認。独立reviewで依存形とunknown仮anchorによる偽差分を指摘され、再現・修正して回帰検査へ追加。最終blocking指摘0。Auth/DB I/Oは合成で、実機/稼働APIは未検証。

現在の保存SQLのguard/read/無効化は一期間だけを対象にしている。比較入りcurrentを保存すると前期間の訂正/削除/閲覧期限が追えないため、保存serviceはNO_PREVIOUS限定を維持する。開発previewの二度読みはtransactional保存・継続的な閲覧権限の保証ではない。比較を保存/APIへ接続する前に、両期間の依存と失効を同じ保存境界で扱う必要がある。新規path/外部API・DTO/SQL/依存変更0。詳細はcanonical04 §3.17、06/API handoff末尾u116。

### 4.23 期間比較の保存・既存API接続候補（2026-10-04 u117）

u116のread-only比較を既存lifecycleへ接続する。新しいHTTP route/public DTO/tableは追加しない。直前等長期間をDBとserviceが内部導出し、二期間を同じsnapshot statementで読む。比較guardは両source guardから生成し、旧単期保存とidentityが衝突しない。

| File | u117の責務差分 |
|---|---|
| mashos-api `supabase/migrations/20261004041627_analysis_period_comparison.sql`（新規・未適用） | comparison_snapshot RPC1、既存commit/read/invalidatorの両期間対応、private v2許容。旧migration/既存保存行は書換えない |
| mashos-api `ai/services/ai_inference/analysis_observed_service.py` | `COCOLON_ANALYSIS_PERIOD_COMPARISON_MODE=development`時だけ比較生成。既定off。前artifactのallowlisted evidenceと比較をinline保存、既存safe比較3keyを読取検証 |
| mashos-api `ai/tests/test_analysis_observed_storage.py`・`test_analysis_observed_api.py`・`analysis_observed_storage_sql.cjs` | 実CMEE/service/API、隔離PostgreSQLで旧行互換/比較identity/両期間失効/ACL/保持期限/UTC期間を確認 |
| Cocolon `components/selfStructure/watashiMapV2Contract.js`・`WatashiMapV2Renderer.js` | u116の既存実装を変更せず、保存本文3ケースと同一text/identityを確認 |

private v2はcurrentの既存証拠にperiod_comparison、previous_evidence、comparison_dependencyを追加する。前artifact/source-set refを同一行の閉じた証拠へ結び、raw本文/命題/labelは保存しない。publicには前artifact IDや証拠locatorを出さない。commitは既存auth→source table lock順を維持して両guardを再確認、readも両期間を再確認し再生成しない。前期間の原入力/補足の更新・削除・追加で比較行が失効する。

前期間0件はNO_PREVIOUSを保存できるが、空の前期間も依存に残す。前期間に記録があり意味生成不能なら失敗を単期へ隠さない。前期間だけが保持期限外ならcomparison_eligible=falseとして現在の単期生成を保つ。一般のアクセス/通信/生成エラーをfallbackしない。保存済比較が後日期限外になれば返さず、単期本文へ改造しない。等長演算はUTC、guardの旧session timezone契約は維持する。

vertical118/storage32/API7/saved period16＝173 PASS・548 subtests、既存Pydantic非推奨warning1。隔離PGlite58項目、RN13 PASS。比較あり/差分なし/初回の保存本文3ケースをrootが全文確認し、RNの本文/identityと一致。独立read-only reviewで前期間の保持期限によるcurrent消失を修正。SQL実行で元CHECK名とtimezoneを修正し、同じ期待を維持して再検証した。PGliteは単一接続の合成DBでありlive DB・同時接続・実機確認ではない。

SQL候補は未適用。適用→対応API配置→比較flagの有効化を個別対象付きで進める必要があり、今回の実装を適用承認にしない。比較flagをoffへ戻すと新規比較生成が止まり、既存比較readはこの対応版が担当する。旧API版へ戻すと比較行を扱えないため、offだけを旧版rollback成立とはしない。詳細はcanonical04 §3.18と06/API handoff末尾u117。


### 4.24 場面・担当の日語と明示順序（2026-10-04 u118）

既存の完全なSELF過去所在/担当節に、単一の今日/昨日/その後/それからを保持する。日語・接続語を含む全文source_partsと共有event witnessを、同じcompilerの解析入口/証拠検査入口で確認する。共有presentは全文TODAYに限定し、有限形のpastや正負を変えない。SCENEのretention条件は維持する。

| 既存file | 責務差分 |
|---|---|
| mashos-api `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py` | 日語/接続語付きの場面・担当を同じ完全解釈へ接続。開いた伝聞/夢、主語後の日語の名詞化を保留。既存順序・補足・訂正・撤回を保持 |
| 同 `observed_route_realizer.py` | 場面/担当のsafeラベルにも記述時点の日と接続語を保持。既存完全命題再照合と共通表示を使用 |
| `ai/tests/test_cmee_analysis_v1d_vertical.py`・`test_analysis_observed_storage.py` | 3段階順序、正負、日語、反復、source座標、訂正/撤回、期間比較、保存再読取を確認 |

日語だけの順序・後続節への日継承・原因・恒久身分・担当仕事の完了は作らない。元の役割を撤回/置換した場合は順序を橋渡ししない。3node/2順序の合成例を文章/図へ接続し、関連181検査・606 subtests、RN13検査、6合成本文のbackend/RN一致を確認。Auth/DB I/Oは合成、新規owner/API/DTO/RN/SQL/依存変更0。u102〜u118未配置。u117の比較SQL適用・対応API配置は残り、今回修正をその新しい前提条件にしない。詳細はcanonical04 §3.19と06/API handoff末尾u118。

## 5. Source and artifact identity

### 5.1 Grounded sources

SourceEnvelopeへ置けるのは、owner／period／version／privacyが固定された真正入力だけ。

- period saved inputs
- allowed supplemental source
- simulation session material
- user-confirmed branch intent／constraints

observed claim、simulated route、saved intentをgrounded source roleへ入れない。

### 5.2 Derived artifacts

| Artifact | Identity boundary |
|---|---|
| ObservedSelfStructureMap | period source-setにbindしたsource-grounded claim graph |
| HypotheticalScenarioGraph | observed map／route versionとbranch pointをparentに持つ別graph |
| IfRouteSimulation | scenario graphを投影した別artifact。observedへ逆流しない |
| SavedRouteIntent | userが保存した関心方向。observed factへ自動昇格しない |
| AnalysisVisualPlan | canonical artifact id／versionの宣言的visual projection |

latest pointer、history item、detail、text、graphは同じcanonical artifact_id@versionへ解決する。period artifact同士を同じidentityにしない。

future `watashi.map.v2`では、private canonical stored artifactとAPI / RN向けsafe projectionを分ける。projectionは`projection_of = artifact_id@version`で同一identityへ戻れるが、raw body、private source ID、private evidence locator、source digestを持たない。access policyはAnalysis ownerに残り、audienceごとのprojection bytesがprivate stored JSONと同一である必要はない。

## 6. Observed／annotation／IFの型分離

### Observed path nodes

- scene
- role
- attention／thought
- action／non-action
- immediate result／aftermath

### Observed edge

- OBSERVED_ORDER
- REPEATED_COOCCURRENCE

共起を順序または原因へ変換しない。observed claim／edgeにはexact evidence refsが必須であり、unknownをevidence代替に使わない。

### Annotation

- protective
- burden
- interpretive hypothesis

route path nodeではない。direct observationとinterpretive hypothesisを区別する。

### Unknown

missing reasonとscopeを持つ別claim／gap marker。observed factを作るための穴埋めではない。

### IF graph

- SIMULATED_TRANSITIONはHypotheticalScenarioGraphだけに置く。
- scenario candidate exact1〜3を意味の違う候補として並列提示する。
- scenario同士をbest／optimalへrankしない。
- common comparatorが選べるのは同じscenarioの文章／visual／layout realization差だけ。

## 7. Protected invariants

### Meaning and epistemics

- user-visible observed claim／edgeの100%をexact evidence refsへ結ぶ。
- filler step、generic result、evidenceなし因果、人格、診断、未来予測を作らない。
- insufficient、conflict、unknownを隠さない。
- protective／burdenを原因断定にしない。
- one recordをtrendへ、category／intensityをcauseへ昇格しない。

### Observed／simulated／saved separation

- observed routeをsimulationでmutationしない。
- simulated step originをobserved_anchor、user_choice、simulated_extension、unknownに区別する。
- IFにsuccess probability、improvement score、正解、命令、最適化を付けない。
- SavedRouteIntentをobserved factまたはachievement／failureへ昇格しない。
- IF clarification answerはsimulation session materialでありperiod observed sourceではない。

### Visual and accessibility

- observedはsolid lane、simulatedは明示label付きdashed lane、unknownはbroken／dottedで分ける。
- 色だけで区別せずlabel、icon、textを併用する。
- graphとaccessible linear textを同じartifact identityから投影する。
- actual deviceで観測／仮想／unknownを判別できることをProduct Readする。

### Lifecycle and acceptance

- tier、latest、history、detail、refreshの既存product lifecycleはAnalysis ownerに残す。
- machine verification、human Product Read、runtime readinessを相互変換しない。
- high-careでunsupported IFは生成停止またはAnalysis固有の短い問いへ進む。

## 8. Product／design owners

| Role | Path | Lifecycle |
|---|---|---|
| broad mixed structure source | Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md | HISTORICAL_DETAILED_REFERENCE。current entryではない |
| Analysis policy source | Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md | HISTORICAL_PRODUCT_DESIGN_REFERENCE |
| future role alignment | Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md | PROSPECTIVE_NOT_ACTIVATED |
| current structure owner | 本file | CURRENT when merged |

ユーザー提供のAnalysis roadmapは設計参照として確認したが、同名のdurable GitHub ownerはcurrent treeで確認できなかった。
本mapはそのproduct方向をcurrent／future分離付きでdurable化する。詳細roadmap activationやimplementation authorityを代替しない。

## 9. Current gaps

1. V1-Dの生成・safe表示・補足・保存/API/RN接続とu102〜u118の内容修正版は配置済み。許可された集計で今回期間の不在を確認し、空snapshotを422にしていたAPIをu127で補正。修正版APIの配置とu122画面修正を含む6401のTestFlight送信はu128で成功。新版の端末導入・正常空表示の実機確認が残る。実生成は本人の通常入力後に別途確認する。
2. current Watashi Mapはpresentation-orientedで、claim／edge evidence graph authorityではない。
3. 五種類の限定node、原証拠、不一致の未確定表示、明示現在負荷と守る意向の注記を接続済み。一般的な各段階/矛盾/負荷/保護理解と解釈仮説は未完了。期間比較は永続保存/API接続まで実装し、SQL適用済み。development手順はMash報告、本人生成/期間比較の実機成功は未成立。
4. IF route／HypotheticalScenarioGraph／SavedRouteIntentのruntime ownerはexact0。
5. Analysis専用Product Read packetとactual-device IF map verificationは未実行。
6. 保存identityの独立した実照合、修正版の実DB/端末検証、旧経路からのglobal cutoverと正式商品受入れは未完了。機械検証を商品完成へ換算しない。

CMEE Analysis detailed design candidate:

[CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計](../designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md)

このpointerはcurrent Watashi Mapの置換、observed／IF runtime activation、API／DB／RN変更を承認しない。

## 10. History pointers

- Cocolon_前提資料/01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md
- Cocolon_Piece/handoff/Cocolon_Piece_Analysis_ProFirst_Design_Workstream_Handoff_20260807/part_02_piece_and_analysis_policy.md
- Cocolon_Piece/handoff/Cocolon_Piece_Analysis_RoleAlignment_Overlay_20260812.md
- Git history for screens/Analysis*、components/selfStructure/、ai/services/analysis_engine/、analysis API／service files

追加のphase mapを作らず、このfileをreplace-currentで更新する。

## 11. Map update triggers

次を変更するworkは、このfileを同じwrite unitで更新する。

- Analysis entry／API／RN／DB owner
- period source-set eligibility／comparability
- event taxonomy／route edge semantics
- observed／annotation／unknown／IF／saved identity
- current Watashi MapのretirementまたはCMEE cutover
- visual projection／accessibility／latest／history contract
- Analysis roadmap activation state

内部logicのみで構造が不変ならSTRUCTURE_MAP_DELTA_NONEと理由を記す。

## 12. Last verified refs

    Cocolon PR30 u118作業前head（Draft/open/unmerged）
      b9f3041a9ea0eecffd6a733663976b7d0de9e598

    mashos-api PR3 u118作業前head（Draft/open/unmerged）
      aa87c02fcebc7e950e3dabdb4a289cb53141a3bf

次回はfresh refと実fileを再確認する。
