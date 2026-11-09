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

<a id="refined-rn-selected-reuse-20261109"></a>
## AR-04続行：表示した本人補足の明示選択をRNへ接続

2026-11-09 JST。APIca4140abと資料26c4453eを継承し、RN[4a103688](https://github.com/MassyuRed/Cocolon/commit/4a1036880c51983d3088b3132f6ad4b6f48abc1e)のexact7pathへ反映。前回APIのPiece42554294246／Analysis42554294252は両completed／successを確認した。API／SQL／本文意味能力の変更は今回0。

### 本人が何を選ぶか

共用EmlisThreadModalで、current観測がREFINED／round1でCOMPLETED、RESOLVED／meaning_updated、第一QUESTIONとANSWER各1の対応がある場合、本人の回答を別blockで示し「元の記録と、この回答を使います。」と「この回答を含めてピースを作成」を表示する。未回答の従来「ピースの作成」と通常2操作を維持する。回答済みで元入力だけを使う経路は既存serverで不適格であり、選択や確定拒否の代替にしない。DTOにADD操作が無いため、UIのhintだけをADDの証明へ変換しない。

tap時の表示回答event_idを捕捉し、savedInputは従来savedInputId／expectedUserId／idempotencyKeyに、選択時だけsupplementalAnswerIdentityを加える。本文／Emlis返事／質問文は持たず、iOS modal dismiss後の同本人・画面・source、背景化／再開・runtime変化を確認して既存PieceCreateへ渡す。古いrender操作が新しいDTOの回答を勝手に選ばない。

既存pieceApiはexact選択ID query、同じrefined／回答IDの七項目だけを受理し、既存POSTへ渡す。hostは回答IDも既存stampに含め、再試行・明示再確認・期限切れ再作成も同じIDを保持する。別回答・queryなしoriginalへの自動fallback／自動生成なし。旧ownerやsource／selection ABAの遅い結果を遮断する。以前の保存結果が不明なら、元preview／savekeyの同じ確認を優先し、新選択で上書きしない。新controller／永続cache／DTO／DB版は追加しない。

### 同じ保存材料でアプリ側の差を確認

前回の実有限Q2＋隔離SQL A/C原本をそのまま用い、全capture SHA／同じcompleted DTOとsource_refを固定した。clean親26c4453eでは回答済み作成はdisabled／導線0、新版は実Reactで表示回答を選び各1route、同じ回答IDのGET→POST→既存controller／本文指紋確認まで2件成功。API応答は前回service成果物を既存公開mapperとquota／capabilities projectorで投影した合成HTTP、Auth／nativeはdoubleであり、新HTTP実接続やDB保存の成功ではない。quota表示のcount0は前回の新規架空ownerの保存前条件。

本文／payload4fieldは元SQL保存detailと一致し、recipe／hashは初回previewと一致。Cの後から選んだquiet_nightの同版保存は前回server検証の資産として保持し、今回アプリ経由で再検証したとはしない。初回recipeと変更後recipeを混同した進捗文は、その場で訂正した。root／独立担当が原入力・補足・完成本文を再確認し、元の過去否定とAの過去寂しさ／Cの現在喜び、非因果・選択感情非流用を保持。新本文品質の増分は0、今回の差は利用入口である。

### 検証と反映

最終15suite1512 PASS／18.645681秒・FAIL／SKIP0。既存CIと同じMetro bundle検査1件は対象外。新UI45件、client／hostの新旧135件を含み、重複実行は加算しない。標準の限定React環境にMetroが無いため、既存CI同様にbundle検査1件をtest-skip-patternで対象外とした。初回のclient host1失敗はVM由来Arrayのprototypeを直接比較したtestの誤りで、既存copy helperへ直し製品sourceを変えず最終検証した。初回VM比較logはprivate記録へ保全。Metro不足の初回実行は会話内tool outputのみでraw log未保管、最終検査では明示対象外。前回API native11対象外・既存161失敗、RN native V4既存19失敗は今回解消したとしない。

コード7fileは全remote bytes／親／変更集合／head読戻し一致。既存Piece CIへmodal path／新testを追加し、新workflowは作らない。[RN CI42558430844](https://github.com/MassyuRed/Cocolon/actions/runs/42558430844)は同じ4a103688で実行中、成功未確定。同じRN4a103688のCIはJavaScript・Android source／export工程がsuccess、iOS source工程はV4 20件中1成功／19失敗（native129・bitmap44は成功）。refined2例の端末画像確認とは別で、CI全体成功ではない。製品source3／既存test2／新test1／既存CI1だけで、共用hook・Input／履歴caller・PieceCreateScreen／Controller／MainTabs recoveryを再実装しない。

STRUCTURE_MAP_DELTA_PRESENT：共用応答UI→body-free選択→既存client／host。配置／live DB／GPU／学習／署名build／TestFlight0、今回2例のrefined native bitmapは未確認、正式品質credit0。原本ZIPはCocolon_CMEE_AR04_RefinedRNSelection_20261109.zip。次はAPI／migrationの通常反映と対応RNの統合配布、同じ採用画像・本人端末を確認する。一般本文再構成・AR-01反転・全必要資産活用は未完了。


### 2026-11-09 Mash明示 — Pieceでも4Bを使う

MashはPieceの4B利用を明示した。現行APIca4140abの通常／refinedは4Bを呼ばず、有限読取と既存作者を使う。次のAR-04は既存Piece semantic_input／候補受領の限定を改修し、4Bの意味整理・文章候補をCMEE／B8の採用・意味保持検査へ接続する。旧作者canonical完全一致のまま4B本文だけを差し込む方法では成立しない。既存の出所分離・本人／current・Safety・preview／save・同版recipe／画像化・RN選択を継承する。今回の確認で新実装／GPU生成／学習／live変更0。詳しい決定と不足は[weekly§39](../../../weekly_reviews/Cocolon_Weekly_Review_20261107.md#piece-4b-use-direction-20261109)と詳細設計§7.1を参照。STRUCTURE_MAP_DELTA_NONE（実装は未変更）。

<a id="piece-model-candidate-connection-20261109"></a>
## 2026-11-09 — AR-04 Pieceの4B候補を既存CMEE・保存へ接続

API `95e1b5d6c6d68b17fadaae3c982ebaa87eed1d79`、設計先行差分`b2d33ace47a09fc070759775f9bf008cb74a1781`。通常／明示選択refinedの保存sourceを`PIECE_MODEL_BODY`へfreezeし、専用promptのstrict `body_blocks`候補を受領、既存Engineのsemantic_input→CMEE本文意味保持→B8→author-free Safety→B9→通常preview／saveへ接続した。新`PieceModelInputV1`はprivateで、既存PreparedRequest／CandidateReceiptを再利用する。モデルにplan・format・権利・Safetyを決めさせない。

初期modelはshort_essay単独、既存有限source／plan資格と全文保持を確認できる範囲に限る。旧作者との完全一致をmodel armだけ除き、格・voice・否定・時点・留保・感情所有・追加／欠落を検査する。既知の常体／丁寧体差、独立SELF節順、閉じたSELF省略を許容する。実名抽象化・参照・scopeは既存S7を迂回しない。未知書換えは採用しない。一般自由文を4Bへ全面委譲した実装ではなく、AR-01反転・一般再構成は残る。

既存共有4B natural/base経路をPiece専用promptで使い、Analysis adapterや旧Q&A composerを使わない。`PIECE_MODEL_SOURCE=shared_4b.v1`明示選択、default/offは既存作者を保持。provider失敗時の有限作者fallback・自動retryはない。期限240秒／2048token／送信64KiB／受信256KiB。RNはpreview POSTのみ250秒にし、source GET／再読／PATCH・owner切替／cancel境界を維持した。

同processで重なる同owner/key/request/source/runtimeだけ取得を共有し、SQL ACK待機中まで一時receipt leaseを保持する。別指紋は競合、各callerのsource／tier／runtimeを再検証し、cancel済みcallerへlate結果を返さない。全caller cancelなら取得をcancelする。SQLが保存の正本であり、他process間のexactly-onceや永続予約を主張しない。保存後の再読、visual変更、save再送は4B／旧作者を呼ばない。公開wire／DB列／recipe／本文版は変更なし。

CPUの対象17suiteは854 PASS、追加有限scope＋独立変異＋並行処理は70 PASS（集合重複を合算しない）、provider／runtime再確認70 PASS、Safety互換8 PASS。RN6suite490 PASS。normal3planでは旧作者と異なる本文「私は同僚に資料の確認を頼んだ。」が既存隔離SQL保存・再読まで固定され、実Q2 A/C保存補足も別sourceのままmodel receipt→visual変更→保存／再読へ通った。各モデルtransportは初回1回、quota消費1、原入力／Emlis thread/eventsは不変。ここまでのprovider応答は合成固定値で、実4Bの呼出し実績と分ける。

途中のmodel保存5失敗はSavedOriginalの属性名接続を修正して全5成功。広い再検査のnative DB192 setup errorはlocal PostgreSQL未設定による対象選択ミスで、nonnative集合へ修正した。eligibleからshort_essay単独を許容するSafety互換1件を明示変更し、旧有限writerの全3format保持と本文変異拒否を検査した。既知の旧161失敗、前回native V4の同19失敗、live migration／配置／統合配布／同版native画像・本人端末の未完了を今回成功へ含めない。GPU実測結果は直下の実測欄に追記する。

<a id="piece-model-actual-fictional-20261109"></a>
### 実4Bの実測、CI最終結果、今回の到達点

既存warm4B natural/base profileへ、完全新規の架空原入力だけを2件送った。既存保存Q2／過去bundleは送信0。両方HTTP200／finish=stop、model aliasは`cocolon-qwen35-4b-base-851bf6e`。PID26784とserving source SHA f95fc7ce…は前後一致、新load・学習・server変更／再起動・停止0。actual HTTP request／response／rawをprivateに保持し、prompt messagesをlocal準備と全量照合した。実呼出しは既存loopback natural profileへの診断bridgeで、Render→GPU HTTPS本番疎通の実績ではない。usage／revisionは実応答に無くunknown。

| 新規架空材料 | 4B生成時間 | 本文とCMEEの結果 |
|---|---:|---|
| 感情選択なし、依頼文をmemoへ | 1.235734秒 | 原文維持。Engine／B8は既存account資格外として拒否、Safety未到達 |
| 自己理解単独＋medium、同依頼文をmemoへ | 1.293048秒 | 原文維持。厳密source／receipt再bind後にEngine GENERATED、B8生成、fake handoffのauthor-free Safety ready |

両方の実本文は「私は同僚に資料の確認を頼みました。」だった。第二材料の原入力7fieldsは実際の自己理解選択仕様に合わせた完全架空値であり、第一材料を後から自己理解へ書き換えて同じ候補の出所を偽装していない。別UUID／別準備ID／別model callとして保持した。当初、第一の拒否を欄制約と誤認したが、原因は感情選択なしのmode前提と再確認・訂正した。memo／memo_actionのどちらも自己理解modeなら既存資格を通る。モデル出力の意味変化や欄による拒否と混同しない。

この実GPU結果は候補取得→CMEE／B8／Safetyの接続確認までで、保存SQL／本人認証はfake handoffで代替していない。保存・visual変更・再送・再読の実装接続は前節の合成provider＋隔離SQL5件で別に検証した。実4B本文は原文と同じため、文章品質の改善・一般自由文の対応を今回の成功へ数えない。

API final head `41fc29870c42feef8c992159fff90558f86d67e4`は製品`95e1b5d6`からnative test seamだけを修正した。初回run42563477378/job128984792000は対象file30 failed／106 passed、旧fakeが`require_current` keyと`_model_input=None`を受け付けなかった。意味期待やSQL検査を緩めずfake2種を更新し、同型B10 fakeも更新した。再run42564013293/job128986439658は全step success、当該native136 PASS、新model5suite129 PASSを含む。API変更累計18fileで、追加pathは`ai/tests/piece_v2/db/test_b10_preview_application_native.py`。

RN `5ae90a658d1823e37039420165db428f26d6730c`のrun42563870309はJS job128985994991 success、Android source／export、export pods、iOS RN canvasもsuccess。iOS source job128985995073はV4 1PASS／19FAIL。前回job128969267491と19件のfailure名・順序が完全一致し、4a103688→5ae90a65の非前提資料差分はpieceApi.js／source-ref testの2fileだけでnative input／job bodyは不変。既存native129／bitmap44も成功した。同19再現の確認に限り、画像受入れ／一般無退行とは扱わない。

次は通常の日本語への意味対応幅と作品としての表現を改善する。既存source／plan資格と全文意味保持を保った今回の初期範囲から進め、未知書換えを合格扱いしない。live配置・selector有効化・migration適用、統合配布、同版native画像と本人端末、既存161失敗／V4同19失敗・AR-01反転は残件。既存のsource分離／保存／権利／recipe／画像化を継承する。証拠ZIP：`Cocolon_CMEE_AR04_Piece4B_Connection_20261109.zip`。
