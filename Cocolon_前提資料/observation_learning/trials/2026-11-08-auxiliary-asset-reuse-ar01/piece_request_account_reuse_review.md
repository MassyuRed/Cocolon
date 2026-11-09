# AR-04 — 依頼・相談・伝達の原文保持と保存再読

2026-11-09 JST。詳細設計§7.1／§9に従い、[前回e8b7](https://github.com/MassyuRed/mashos-api/commit/e8b7e46c70269a40317fe2ec6ee8362c4086e619)の有限依頼5本文を継承し、現候補[f3b5e93e](https://github.com/MassyuRed/mashos-api/commit/f3b5e93e837a01c726ea9d0ca1caa4c39f396add)で相談・伝達にも既存の役割読取を回収した。**新8入力は生成不可→原文を保持した本文となり、新旧18作品を既存サービスと隔離SQLで保存・非生成再読した。** 配置・本人端末・native画像の完了ではない。

## 改修と意味の境界

piece_source._finite_self_person_action_account（旧名_finite_self_request_account）は、既存natural_reply_meaningの有限節／活用／格／人役読取を使う。今回の正の差分は許可述語を「頼む／相談する／伝える」へ限定拡張したことだけ。共通reader自体、意味型、作者、公開DTO・DB・RN・権利・quotaを変更しない。piece_v1cの既存KEEP_COMPLETE_SOURCE_CONTEXTへ接続し、原文の時点・主体・相手・能受動・否定・語調・二欄と留保を維持する。相談から助言・承諾・解決、伝達から理解や受領を創作しない。

全文を読めた単一節、明示SELF、肯否過去のfact、既存人役の相手1と「を」対象1、句点という前回条件を維持。能動は「に」、受動は既存readerで一意に読める格だけ。特に「伝えられた」の「に」受動は可能表現との曖昧さを既存readerが拒否し、迂回しない。省略人物・代名詞・人物疑問・未証明人名・非過去・引用／条件／伝聞・未知文法へ広げず、宣言適格を足さない。

## 同一20入力の前後と全文読解

独立担当が相談／伝達の能受動×肯否、SELF6表記、書かれた時点、丁寧語、二欄留保を含む架空8recordを作成。前回12recordは全7fieldをそのまま再利用した。新8は全て不可→生成、旧10成功はmeaning／plan／artifact／candidate／recipe／serialized hashまで同一、旧2拒否も同reason。合計10→18生成で、18を新規改善とは数えない。新作例は開発用でありblind一般化評価ではない。

root／独立担当が全20原入力と前後全文を読んだ。相談の送り手・受け手、伝達の方向、未実行、過去、昨日／今朝／先日、二欄の未決定は全て書かれたまま。新8の本文は原文KEEPであり、一般的な本文再構成の完成とはしない。83実行sourceの変更は当該2pathだけ。

## 実サービスから保存済み作品まで

既存Q3Database（PGlite0.5.8）にQ2／Q3／related-contextとPiece M1～M4・visual-change／quota-read／natural-context／paletteの原本SQLを適用した。実行SQL11と既存helper／test3はfresh e8b7のblob bytesに全一致。legacy表・roles・認証は架空。先行Emlisは合成providerを既存serviceへ渡して成功completionを保存し、本文をPiece素材へ流用しない。

全20を実PieceSavedSourceAdapter→PiecePreviewService.issue_original→実review_prepared_original→piece_issue_preview_v2→PieceSaveService→piece_save_v2→PieceOwnerService.detailへ通した。Free比較で18保存／2拒否、最終process2.221914秒。本文／payloadはFreeのpure結果と一致。SQL用UUID・日時表現は別投影として保全し、pureとのsource identity同一を主張しない。

18全件で本文／body_blocks、3hash、format、recipe、rendererの8fieldをpreview→保存行→detailで照合し、4contract版を含む計12fieldは保存行→detailで照合。初回後は生成入口・CMEE Engine／作者／compiler・reviewを禁止し、fresh serviceのpreview再読、save同key再送、detail再読を実行した。各作品の保存消費は1、明示再送は同じconsumption、拒否2はPiece／quota件数差0。原入力とPiece開始後のEmlis thread／eventsは不変。候補生成入口の1callを、内部の既存binding再実現まで含む作者処理1回と表現しない。

Auth・先行Emlis provider・PostgREST envelopeは合成／SQL callback、service-roleはBYPASSRLSのテスト構成。実Auth／実PostgREST／ASGI・本番DB・native並行lock／RLSの新実証ではない。同じrenderer文字列と描画材料の受渡しを、実bitmap・fit・文字欠け・同一PNG・写真保存／共有へ換算しない。

## 検証、修正した測定、反映

最終sourceで既存test拡張＋新保存一巡test＋Piece近傍6suiteは**3351 PASS／27.94秒、既存warning1、FAIL／SKIP0**。9caseで依頼／相談／伝達×3planの保存一巡を確認。初期のtest期待は曖昧な「伝える＋に」受動も通ると誤っていたため、既存拒否を維持して「から」の正例と「に」の拒否例へ訂正した。製品readerを緩めて成功化していない。最初の未存在Engine symbol指定、比較scriptのcandidate hashキー不存在とtierによる適格format差の誤比較は検査側を訂正し、failure logを保持した。途中成功や反復を最終件数へ加算しない。

APIは既存source2／既存test1／新test1のexact4pathのみ。全remote bytes・差分集合・親／tree・headを読戻し確認。既存CIは[Piece42545974787](https://github.com/MassyuRed/mashos-api/actions/runs/42545974787)／[Analysis42545974764](https://github.com/MassyuRed/mashos-api/actions/runs/42545974764)、同じf3b5e93eでPieceはcompleted／success、Analysisは実行中。新workflow／手動rerunは追加しない。

## 継承と次作業

前回の依頼新規5本文・旧成功5不変・3218局所PASS・両CI成功はe8b7の完了履歴として保持。今回の8本文増分と18保存を重複計上しない。AR-01の役割反転／対象状態・現作者の問題は未解決、研究候補通常不採用を維持。新model call／学習／load／server変更・再起動／配置／実DB／RN／build0。

AR-04の一般本文再構成・別sourceのrefined、対応候補の通常稼働とnative同版画像・実機・正式受入れは未完了。次はこの保存可能な本文能力を維持し、既存Piece正本に沿ってrefinedの原入力／本人補足を別sourceとして扱う不足へ進む。適格補足をoriginalへ連結する短絡はしない。AR-01〜08・全必要資産活用は継続中、正式商品品質credit0。

[本文なし集計](piece_request_account_reuse_summary.json)。全private原入力・前後本文・保存行／再読・root／独立読解・失敗log・source identityはCocolon_CMEE_AR04_PersonActionSavedReuse_20261109.zipへ保全済み（19member／80956bytes、全CRC・member hash一致）。Git反映済み製品source／testの重複backupは含めない。


<a id="refined-separate-sources-20261109"></a>
## AR-04続行：原入力と適格本人補足を分離したrefined候補

2026-11-09 JST。直前の通常original 18作品の保存再読を保持し、詳細設計§7.1／§11のrefined未接続へ進んだ。API `1e76599f8aeaae967589b9f80669c622f3e0e01a`（親f3b5e93e）のsource5／test2／既存CI1、計8pathへ反映。新しい通常作者・公開DTO・DB・RNは作らず、既存CMEE Engineの明示offline入力へ限定する。

### 回収と実装

既存`freeze_supplemental_answer`のmetadata frame・source role・scalar/UTF8根拠、Q2のQUESTION/ANSWER/ADDとcurrent prefix、既存Piece source→plan→唯一作者→author-free保持検査を回収した。`PieceSavedSourceAdapter.resolve_refined_handoff`は本人の明示opt-inと指定ANSWERから、currentなINITIAL→QUESTION→ANSWER→RESOLVED/MATERIAL_UPDATE/ADD→REFINED→正常終了を検証する。初回一回答だけ、訂正・撤回・superseded/affected dependency・未解決・複数回答・古い結果は拒否する。再認可時はfreshな保存状態とhandoff全体を比較する。

新private `piece_refined.py`は原入力と補足を別snapshot／別envelopeとして持つ。補足の文法解析に既存parserの一時text viewを使うが、そのviewはsemantic sourceとして保存せず、全node/edge/owner/evidenceを実SUPPLEMENTAL_ANSWER envelopeへ結び直す。文字座標はanswer field内、UTF8根拠はmetadata frameを含む実byte座標。原入力のsaved JSON・選択感情へ補足を書き戻さず、質問文・Emlis本文・推定を作品sourceへ渡さない。

原入力と完全な明示SELFのADD補足をそれぞれ既存作者に通し、原入力のblock→補足のblockの短文エッセイとして構成する。sourceを跨ぐ指示語、訂正／撤回の解決、関係・因果の推論、quote/declarationは今回未対応。原入力側の旧18成功と、補足側の限定SELF願望・評価の実証範囲を混同しない。pure constructor自身は認証ではなく、eventの真正な対応と権利・current性は保存adapterの取得／fresh再検証が担当する。単語の訂正cue拒否だけで一般のADD意味を証明したとはしない。

### 実際の本文と保存

独立担当の架空8入力＋補足から8作品を生成し、root／独立担当が全原入力・補足・完成本文を全文比較した。既存の焦点→一人称編集・条件・本人・方向・否定・時点を保持し、承諾・解決・因果を追加しない。一方、硬い時点表現や、補足自体で具体内容のない対象は残り、一般単独伝達品質の完成ではない。単純な原文連結ではなく両sourceが既存作者と保持検査を通るが、意味融合や高度な再構成の成功とも呼ばない。

各8作品は完全なsource・版・計画・同じ本文をprivate JSONへ保存し、Engine／source parser／answer freeze／compiler／作者を禁止した再読で全artifact一致。8生成＋private保存再読は0.085551597秒（CPU部分）、GPU/model call0。これはprivate file保存であり、通常Piece preview/save RPC・quota・recipe・native bitmap・写真・共有・実機の成功ではない。

旧20入力と独立8原入力、計28を親f3b5e93eと新版で比較し、meaning／plan／artifact／reasonまで完全一致。旧20は成功18・拒否2、独立原入力8も同一。通常originalの一巡9caseは広範囲検査内で成功し、今回refinedの通常保存へ換算しない。

### 実保存資格との接続の限界

既存Q2 CMEE＋隔離PGlite0.5.8で実生成・保存したADD回答の取得／再認可を検証し、thread/events不変を確認した。完全SELF補足を使う成功controlは合成の保存controlであり、Emlisがその意味を採用した証明ではない。

追加CPU3試行は一回ずつ：1件は実RESOLVED/ADD・refined取得まで成立したがPieceは`expression_meaning_not_admitted`、他2件は既存`answer_target_time_unresolved`で未解決・取得拒否。受理条件を変更・成功を注入しない。最初の3試行は完全SQL snapshotを保存しておらず同じ実handoffの最終版再生成は未確認。実Q2→refined Piece本文の一貫成功は0のまま。別の最終CPU切分けでも、当該完全SELF感情文のsource読取と作者の作品資格は別であることを確認した。

### 検証・残件

新core34＋新saved handoff64＋旧saved state83＝181 PASS、19.13秒、FAIL/SKIP0・既存warning1。独立の実frame等6変異と、再hash済みの役割・肯否・時点・追加・順序交換・欠落6変異は全拒否し、作者を再実行せず保持検査した。serializerのtuple拒否は初回4失敗/30成功で検出し、既存canonical契約を緩めずprivate tuple→JSON arrayへ直して再検証した。

広いB8／P4／保存回帰は6475 PASS／161 FAIL、57.77秒。161失敗の全node IDを親f3b5e93eの原source・原testへ戻し、全161が同じく失敗、4.05秒。旧minimum length等の期待差を含む未解消失敗であり、全suite成功・今回修復済みとはしない。今回新規失敗ID0という範囲に限定する。中間log・独立読解・actual8・旧新28・保存8・変異・実3試行・再現scriptをprivate原束へ保全。

既存CIへ新2suiteを追加。新[Piece42549029993](https://github.com/MassyuRed/mashos-api/actions/runs/42549029993)はcompleted/success。[Analysis42549030023](https://github.com/MassyuRed/mashos-api/actions/runs/42549030023)は実行中で、成功扱いしない。前回f3b5e93eのAnalysis42545974764もcompleted/successと確認済み。

STRUCTURE_MAP_DELTA_PRESENT：既存保存adapterのread-only補足資格と、CMEE内private多source入力／計画・保存形式、既存作者のfield text座標アクセスを追加。通常preview／HTTP／source_ref／review／save／SQL/RLS・RN・画像版・権利・料金・quotaは変更0。配置／実DB／build／GPU／学習0。primary TECHNICAL_CREDIT、正式商品品質credit0、AR-01役割反転・AR-04一般本文／refined通常保存と同版画像・全資産活用は継続中。

次は今回の出所分離を保持し、実Q2で採用された完全SELF補足から現作者が作品資格を成立させる不足を局所修復する。その後、既存source_ref／review／preview／save／同版画像へrefinedを通す。補足を原入力へ連結する、未解決をADD扱いする、private保存を通常保存と呼ぶ方法へ戻らない。


<a id="refined-q2-feeling-reuse-20261109"></a>
## AR-04続行：実保存ADDの感情文をrefinedの既存候補口へ接続

2026-11-09 JST。親API1e76599f／資料2900c36fから、上記の実Q2→作品未成立を継承した。新APIfc7dc299（source3／test3／既存CI1の7path）で、補足自身に完全な明示SELFがある有限感情文を、既存KEEP dutyと唯一作者へ接続した。

### 回収と変更

既存emlis_answer_update._FEELINGの語彙・肯否／時制／degree・_NOWと、Piece既存_written_feeling_expressionを再利用する。単なる「かった」等の文末許可ではなく、明示SELFの後にある述語全文を有限文法で照合する。対象は実SUPPLEMENTAL_ANSWER型のみで、原入力の選択感情・saved JSON資格を補足へ借用しない。全補足節が成立する時だけKEEPへ進み、省略主体・他者・伝聞／推測・疑問・未知形容詞・未対応混在は引き続き拒否する。現在の明示prefixは原文のまま保持し、記録時刻から感情時点を作らない。共有文法ownerの改変、新しい作者／本文template・宣言適格・新private型／保存版の追加は0。

既存piece_v2_generation.generate_piece_candidateがprivateのPieceRefinedSourceSnapshotも受け取り、Engine結果を同じ2sourceから再導出したmeaning／plan／canonical artifactへ再束縛するようにした。既存のsource/plan/artifact差替え拒否を保持し、同義の別表記でも唯一作者のcanonical出力へ勝手に置換しない。refinedの既存作者呼出しはpure関数へ整理してこの照合でも使い、新作者を増やしていない。最後に既存author-free保持検査も行う。公開request、HTTP source-ref、preview発行、review資格、SQL／save／quotaは変更しない。

### 実保存2件の同一材料比較

既存Q2 service＋CMEE＋PGlite0.5.8で、同じ過去原入力に対し、互いに別threadの補足A/Cを2件だけ採取した。Aは同じ元の機会の別感情、Cは明記された現在の感情で、元の過去否定を上書きしない。実checkpointは双方RESOLVED／MATERIAL_UPDATE／ADD、A=ORIGINAL_OCCASION、C=ANSWER_TIME、未解決／supersessionなし。QUESTION／ANSWER／元7field／thread／全events／context／tier／now・DTO・frozen handoff全bytesをprivate保存した。Auth／PostgRESTは合成seam／SQL callbackであり、実Authや本番DBではない。実Q2の意味採用自体を成功注入していない。

採取中にPiece sourceが編集中だったため、採取時Piece結果を固定親版の比較へ使わない。raw採取物とmixed source identityの注意を保持し、別のcleanな親1e76599f checkoutと最終候補で、同じ全保存snapshotをread-only再取得した。この再比較ではQ2生成・provider呼出し0、原入力・thread/eventsは不変、snapshot SHA・別commitment・投影source identityは全て前後一致。

親は2件ともexpression_meaning_not_admitted／本文0、新版は2件とも本文生成。rootと独立担当が全原入力・本人補足・本文を比較し、元の過去否定、Aの併存感情、Cの明示現在を保持し、原因・人物意図・承諾／解決を補っていない。選択されている別感情も追加していない。Cの文体には硬さが残るため、一般単独伝達品質の完成とはしない。

両件は新core→既存B8候補口で同じcontent payload／本文hash、既存recipe検証と合成metric layoutで全2blockの文字列復元が一致。private fileへ同じartifact／sourceと候補＋recipeを保存し、Engine／source reader／compiler／作者／answer freeze禁止の再読でも同一。最終CPU replay2件・candidate照合・recipe／合成layout／private再読の部分は0.130193517秒。native font／fit／bitmap／PNG／通常preview・Piece record・quota／写真・共有・本人端末の成功ではない。

### 保持確認・反映・次

親1e76599fと新版で旧28原入力のmeaning／plan／artifact／candidateが完全一致。旧refined8も新生成結果のprivate保存bytesが旧保存bytesに一致し、生成を禁止した旧版fileの再読も同artifact。過去の18通常保存と旧品質残件を消さない。

最終確認で既存_FEELINGのoptional subject枠に二重SELFが入る抜け2件を検出した。parse-only viewでそのsubject枠を既に占有し、実sourceを変えず述語だけを照合するよう修正。二重SELF2件は生成→拒否となり、正常8／実保存2／旧作品を保持した。初版72cc4f5fと後続fc7dc299のユニーク変更集合は7pathで、final head全7bytesを読戻し一致。

最終11fileの関連検証は707 PASS／35.33秒、FAIL/SKIP0・既存warning1。新しい独立感情24／B8置換11と、実Q2＋SQLの3構成（旧省略回答の取得だけ1、完全SELFの作品化2）を含む。異なるsuite／反復を加算しない。全source/plan／再hashした本文・肯否／時点／degree・欠落の拒否、本文の同義表記差替え、owner不一致、保存非生成を検証した。既知の広範囲161失敗は前回の親版再現として引き継ぎ、今回は再実行・修復をしていない。

API[fc7dc299](https://github.com/MassyuRed/mashos-api/commit/fc7dc299ebea2a0b0064afdd1909f22ae0f0b1f4)のexact7を全bytes／親／変更集合で読戻し一致。前段72cc4f5fの[Piece42551259870](https://github.com/MassyuRed/mashos-api/actions/runs/42551259870)はcompleted/success。最終fc7dc299の[Analysis42551959891](https://github.com/MassyuRed/mashos-api/actions/runs/42551959891)は実行中で、成功扱いしない。前回Analysis42549030023は全step successを確認した。private原本はCocolon_CMEE_AR04_RefinedQ2FeelingReuse_20261109.zip。

STRUCTURE_MAP_DELTA_PRESENTは既存Piece ownerの補足有限資格とB8手渡し／検査の拡張だけ。新型／新wire／DB／RN／通常設定／配置／build／GPU／学習0。primary TECHNICAL_CREDIT、正式商品品質credit0。次は明示opt-in・別supplement commitment・current guardを既存通常source-ref／review／preview／saveと同じ版で束縛する不足へ進み、同じ採用画像／実機を確認する。通常資格を飛ばした発行・未解決のADD化・補足原文のoriginal連結はしない。AR-01役割反転・AR-04一般再構成・全資産活用は継続中。

<a id="refined-normal-saved-reuse-20261109"></a>
## AR-04続行：別sourceのrefinedを通常サーバー保存へ接続

2026-11-09 JST。親APIfc7dc299／資料591ea49eから継承。今回APIca4140abのexact13pathで、前回の有限補足本文を既存通常source-ref／Safety／preview／saveへ接続した。新モデル・作者・意味能力・UIは追加しない。

### 本人選択と既存保存境界

既設GETにexact1のsupplemental_answer_identity queryを指定した時だけ、同じ本人・第一回答exact1・RESOLVED ADD・current REFINEDの保存資格を検証し、同じ七項目参照を返す。queryなしoriginalは維持、回答本文／owner／tier／stage／適格flag・重複／未知queryは拒否する。後続preview要求のrefined stage＋exact回答指定が明示選択であり、最新回答を自動選択しない。

private handoffの全bindingを検証して既存DB exact8top／5source／7observationへ投影。元と補足のcommitmentは別に保持する。既存previewのprepare／review／issue／restart／visual変更と初回saveを同じstageへ束縛。Safetyは2sourceの別scanと既存meaning／plan／author-free本文検査を行い、作者を再実行しない。保存済みowner再読と保存同key再送は既存成果物だけを使う。

SQL migration20261109024943は、既存issue／visual／saveの3source fenceだけを適合した。実ANSWERのmetadata frameとUTF8本文長から指紋／envelope refを再計算し、current question・ADD checkpoint・観測・成功finishを照合する。元のoriginal／natural・Q3履歴検証、signature／ACL／search_path／RLS／schema／quota、保存済み再送をsource再検査より先に返す順序は維持。固定CLI3.0.0のlocal migration newで作成し、live適用なし。

### 同じ保存材料の前後と実サービス一巡

実有限Q2 start／answerを各case1回、計2start／2answerで、外部provider／GPU0でA/Cの解決済みADDを採取した。AuthとRPC envelopeは合成、意味採用／保存は既存CMEEと隔離PGlite0.5.8。原入力／全thread／events／前後DTOをprivate保存した。同じsnapshotと七項目参照をclean親fc7dc299と新版で0Q2／0provider再読比較し、親はpreview資格拒否2（生成入口0）、新版はprepare2成功。元／補足commitment・source ref・snapshot SHAは同一、本文／payloadは実SQL保存物と一致する。

Aは元の過去否定と本人の過去の寂しさ、Cは元の過去否定と『今』の喜びを別blockで保持。root／独立担当が原入力・補足・完成全文を読み、原因・相手意図・選択感情の追加がないことを確認した。既存の2本文の保存接続であり、新たな2本文品質改善・一般単独伝達や意味融合の完成へ重複加点しない。

2件とも既存Piece service→実review→preview RPC→保存RPC→owner detail。Aは初回recipe、Cは生成入口／Engine／作者禁止下で実visual serviceを呼びquiet_nightへrevision1→2、期限不変、本文／payload4field同一。Cの再reviewは必要な既存安全検査として2回、本文生成入口は1回のまま。fresh serviceのpreview再読と、保存／同key再送／detail2回は作者／Engine／compiler／reviewer禁止下で同一保存成果物。消費各1、原入力とEmlis thread／events不変。描画材料の一致をnative bitmap／写真／共有へ換算しない。

### 検証と修正した測定

最終関連3813 PASS／107.77秒＋新SQL適用後の通常保存3planが3 PASS／3.17秒、重複除外計3816成功・FAIL／SKIP0（native11件明示除外、既存warning237）。新SQL suiteは19変異×3操作の原子的拒否、byte escaping、既存pre-question／natural3plan、権限catalogを検証する。既存11native caseはローカル専用DB URL未設定のため実行前guardで停止し、最終local検査では明示除外。新しいnative並行lock／RLSの実証はない。前回の広い161既存失敗も未解消として継承し、全suite成功としない。

初回SQL負例では期待したPIECE_CONFLICT後のテスト橋RESET ROLEが失敗し連鎖終了した。新test内のSQL subtransactionで実RPC例外を捕捉する方法へ訂正した。次の失敗はactive_attemptだけを変えた無効fixtureが既存DB制約に拒否されたため、整合したREFINING状態へ直し全UPDATEの成功をassertした。製品guard／schemaを緩めず、初期logを保全した。独立reviewが見つけたruntime_profile NULL判定漏れはIS NOT TRUE相当のfail-closed条件へ修正し負例を追加した。

### 反映・限定・次

API[ca4140ab](https://github.com/MassyuRed/mashos-api/commit/ca4140ab1fee8be8da55cefcee1b72011e85354e)へexact13path、全remote bytes／変更集合／親／headを再取得確認。同じca4140abの[Piece42554294246](https://github.com/MassyuRed/mashos-api/actions/runs/42554294246)／[Analysis42554294252](https://github.com/MassyuRed/mashos-api/actions/runs/42554294252)は実行中（成功未確定）。全private材料・比較script・失敗log・最終検査はCocolon_CMEE_AR04_RefinedNormalSavedReuse_20261109.zipへ保全。

STRUCTURE_MAP_DELTA_PRESENT：既存通常owner間のstage接続と既存SQL3関数のsource fence。新controller／workflow／型／schema／料金／権利なし。配置／live DB／GPU／学習／RN／build0、正式商品品質credit0。次はRNの明示補足選択UI、通常API／migration反映、同じ採用native画像・本人端末を確認する。AR-01反転・一般本文再構成・全必要資産活用は未完了。
