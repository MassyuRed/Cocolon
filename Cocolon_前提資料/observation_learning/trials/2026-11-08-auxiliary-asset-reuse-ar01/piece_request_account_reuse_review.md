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

<a id="piece-model-evaluation-reuse-20261109"></a>
## 2026-11-09続行 — 既存の本人評価readerをPieceの4B本文意味保持へ再利用

**現在の差分：** API `41b5df885c7f6b8a66223d5954cdd09cd7c94cc8`（親`41fc29870c42feef8c992159fff90558f86d67e4`）。同じ実4B出力6件を比較して、採用3件→5件。追加の2件は正しい価値観本文の誤拒否解消であり、文章品質・一般日本語理解の改善認定ではない。主成果TECHNICAL_CREDIT、正式商品品質credit0。AR-04・全補助資産の活用は継続中。

### 回収した能力と実装境界

既存`cocolon_meaning_experience_engine.piece_source._personal_evaluation_shapes`の本人評価読取を`piece_v2_content_policy._piece_model_evaluation`へ接続。大切／大事／重要／必要／好き／苦手の既知base、明示SELF、評価構文・正確な対象、程度、肯否、現在／過去、留保を比較する。丁寧／常体差と同じ明示視点での倒置を扱う。評価の主体省略を追加せず、既存source／plan資格、named／reference／scopeのS7検査、各fieldのpartitionと命題数を保持する。新model reader呼出し・後付け文章修復・fallback・通常prompt変更はない。

独立点検で、条件／理由等の外側文を付けても内側評価だけが一致して通る抜けを発見し修復した。`_SCOPED_EXPRESSION`／`_TEMPORAL_EVALUATION`の既存範囲除外に加え、読取frameのspeaker／predicate／target spanが外側全文matchと完全に対応することを確認する。正しい過去・否定・留保をそのまま保つ対照も確認。一般構文の読取完了や、未知文法への拡大は主張しない。

### 実4Bの同材料比較

新規架空6材料を、既存warm4Bのnatural/base loopback HTTPへ現Piece promptで送信。続いて同じ6材料に編集指示を足した研究版を一度だけ比較した。新規材料の私的原文／messages／request／raw／receipt対応はprivate JSONに保存、Karen-Diary・既存保存Q2・本人原文の送信0。

| 材料ID | 親CMEE | 新CMEE | 実本文の読解 |
|---|---|---|---|
| VALUE | 未判定・不採用 | 採用 | 原文の価値観を維持。既存評価読取の未接続が誤拒否の原因 |
| MODAL | 採用 | 採用 | 否定・過去・留保の保持、原文の語を維持 |
| PREFERENCE | 採用 | 採用 | 苦手の過去・好きの現在を保持、原文の語を維持 |
| DEGREE | 未判定・不採用 | 採用 | 程度を含む価値観を保持。今回の読取接続で誤拒否解消 |
| TWOFIELD | 拒否 | 拒否 | 二欄を一blockに結合。source partitionを緩めず不採用 |
| CONTROL | 採用 | 採用 | 既成功の本人→同僚への依頼を保持、原文の語を維持 |

全12callはHTTP200／finish=stop。現prompt6callのloop実測8.392149秒、編集版6call8.564712秒、合計16.956861秒。これは生成要求loopの累積時計でありGPU総レンタル時間・請求ではない。model aliasは`cocolon-qwen35-4b-base-851bf6e`、usage／revisionは応答に無くunknown。PID26784／serving source SHA `f95fc7ce13ce197916b753b7cebb3946243225a0139d40e528908d62e27b2371`は前後一致。学習・新load・再起動・自動retry・追加model reader0。

編集版と現版の各本文は全6件同一で、編集指示案は採用していない。同じ指示追加の周回を終了する。短文の原文維持を悪化と断定しないが、今回の試行には文章の再構成品質が上がった実績はない。二欄結合の問題も残る。Render→GPU HTTPS経路の実測ではない。

ブラウザのdownload通知はtimeoutしたため、Jupyter editorで観測した応答metadataとlocal同一requestを対応づけ、request SHAを12件すべて照合してprivate原本JSONを復元した。復元後の全JSON SHAはterminal表示と一致（現版`022bd67dfafaf26560554e1c36b4a7706ea73c87991a7bf963f5f2d794ccbcd2`、編集版`949a6a6005bb32c617b8fc6699fa452bf33c8fd2d08e905837acc286389cda95`）。download成功とは記録しない。初回のsource SHA手入力不一致は送信前assertで止まりcall0、修正後に各版6callだけ実行した。

### 保存・再読と検証範囲

採用5実本文を、同じ架空文を持つ**合成owner／入力ID／時点へ厳密再bind**し、既存source／prepare／receiptとreview→preview→saveへ接続。Free／Plus／Premiumの15組を既存PGlite隔離SQLで保存・再読した。preview初回の作者／review各1、同key保存再送でもquota各1、保存後は作者／Engine／review／compilerを禁止して同／新serviceから非生成再読、保存行と詳細12field一致、原入力／Emlis thread／events不変。実4Bの原要求IDをそのまま実DBへ保存した証明でも、ライブAuth／PostgREST・画像描画の実績でもない。元のrequest identityに対する旧新比較は前表で別に行った。

最終対象7fileは299 PASS／18.44秒、FAIL／SKIP0、既存Pydantic warning1。新評価単体164＋新保存6を含み、別実行の件数を重複加算しない。既存model source／独立変異／有限scope／並行処理／保存を同集合で確認した。広めの既存評価テストでは19失敗を検出し、変更前の親`piece_v2_content_policy.py`をoverlayした同じ環境でも全19件を再現。参照評価16、短文非padding／自己連続参照／scope各1で、今回未修復・期待変更／skip化0。過去のnative V4同19失敗とは別集合。全Piece試験の成功とは報告しない。

[Piece CI42569189244](https://github.com/MassyuRed/mashos-api/actions/runs/42569189244)は同じAPI41b5df88で全工程success。model stepは299 PASS／既存warning1／26.93秒。[Analysis CI42569189246](https://github.com/MassyuRed/mashos-api/actions/runs/42569189246)も全工程successを確認。

新file2と既存source1／workflow1の計4pathだけをAPIへ反映、remote bytes／commit親／変更集合／PR3 headを読戻し確認。既存CIのmodel試験stepへ2fileを追加し、新job／Gateを作らない。STRUCTURE_MAP_DELTA_PRESENT。RN・SQL schema・公開registry・設定・料金・quota・提供modelは不変。

### 稼働と次の同一商品作業

RenderのAPIはautoDeploy OFF、既存live commit`497f7008fec8935885d09d2e430499892189b5bb`を継続。Supabaseは読み取りによる既存3関数signature確認だけで、schema／個人row／DML変更0。今回の本番反映・selector有効化・署名build・配布・native画像／本人端末確認0。

次は、一般文章の意味を保つ再構成と二欄のsource分離を保持する生成へ進む。既存readerを一般理解の代役へ広げず、読取不足と実modelの出力不足を分けて修正する。AR-01方向反転、AR-02以後、既存migration／API反映、RN統合配布・同版画像／本人端末、正式受入れは未完了。同じ成功数の再検証・同種編集指示の周回だけを次の作業にしない。

私的原本は`Cocolon_CMEE_AR04_Evaluation4B_20261109.private.json`。公開側は本節と本文なしsummaryを既存trialへ置き、新handoff系列や追加運用基盤は作らない。

<a id="piece-model-field-slots-20261109"></a>
## 2026-11-09続行 — 欄名付きprivate候補と既存FOCUS読取の再利用

API `1ed4ca27da71ddca510d1ad035b1f0fd7703b1ab`（親41b5df88）で7path、その後`cfd3d60d476a1e6f7fbff16b86897f9614504cd3`で3path、重複除外9path。主成果TECHNICAL_CREDIT、正式商品品質credit0。補助経路全体・AR-04の完了ではない。新しいservice／作者／public DTO／DB schemaを作らず、既存の明示candidate_formatによる変換責務をPieceへ適合した。

### 故障箇所・不採用案・回収した能力

前回TWOFIELDの元partitionは正しく、4Bが二欄を一つのarray文字列へ結合していた。最初に各partition項目へexact literal／source_roleを併記し、現warm4Bで旧4＋併記6の計10callを比較したが、全5複数block材料の結合が残った。単欄controlは保持、refinedの末尾句点だけの差があり、分離の改善はなかった。局所314 PASSでも採用理由にせず、その案はprivate保全後に製品sourceから撤回した。同種SYSTEM追加の周回をしていない。

稼働中PID26784のserving sourceはrepo `ai/tools/serve_emlis_natural_reply.py`と同じSHA `f95fc7ce13ce197916b753b7cebb3946243225a0139d40e528908d62e27b2371`。actual自然profileはadapterを無効化したbaseのtokenizer→model.generateへ通り、本文を自動コピーする処理ではないことをread-onlyで確認した。server source／設定／process／重みは変更していない。

既存`preparation.receive_candidate(candidate_format=...)`の形式変換と旧receipt互換の方式を、Piece専用receiverへ再利用。新providerだけ`piece.field_slots.v1`を明示し、field_blocksのkey集合をserver由来のslotとexact照合、モデルkey順ではなく元partition順でcanonical body_blocksへ投影する。名前はfield＋global indexから固定、元のsource ID／role／scalar範囲を保持する。全source／七項目は削らず、PreparedRequest bytes／IDは不変。raw_outputは元の文字列のまま保持する。これはcodecの決定的投影で、受信後の文章split・修補・生成ではない。

旧format=Noneは旧body_blocksだけ、新formatはfield_blocksだけを受理し、形式の自動判定／旧形式fallbackをしない。重複・過不足・未知slot・非文字列／空／改行・不正Unicodeを拒否。slotが揃っても値の入替／連結／追加命題は既存CMEEが拒否する。canonical候補の存在やslot名一致を意味採用へ昇格させない。

### 同材料の実4B結果

最終6材料は、新規架空4と前回架空2。前回2の旧rawを再利用し、新4は旧形式を今回各1call。これとliteral案6callの計10callが第一比較、欄名付き形式は同6材料へ各1call。新6は既使用開発比較であり、blind／未知一般化の実績ではない。source／prepared IDsを対応付け、別promptの実績へ旧rawを付け替えていない。

| 材料ID | 旧形式のCMEE | 欄名付きraw | FOCUS補完後のCMEE |
|---|---|---|---|
| TWOFIELD（前回材料） | partition拒否 | 二欄を分離、留保と相談過去を保持 | GENERATED |
| MODAL（前回control） | GENERATED | 単欄、否定・過去・留保持続 | GENERATED |
| NEW_FIELDS | partition拒否 | 二欄を分離、受動否定過去を保持 | GENERATED |
| NEW_PAST | partition拒否 | 二欄を分離、苦手過去・依頼否定過去を保持 | GENERATED |
| NEW_LINES | partition拒否 | memo別2行＋行動の3本文を分離 | GENERATED |
| NEW_REFINED | partition拒否 | 原入力と本人回答を別slotへ | GENERATED |

欄名付き形式だけの中間段階では5/6受理、NEW_REFINEDは意味未判定だった。原因は第1slotの正しい原焦点形を、旧S7が旧作者の直述語順だけへ制限していたこと。既存`piece_v2_generation._FOCUS`全文をmodel readerへ接続し、SELF／predicate全文／object全文を保持して比較した。任意の原文一致を許可せず、実名・参照・scopeは従来どおりS7へ戻す。独立点検でもsource資格が成立する名前／名詞参照／条件scopeの3例を用い、迂回拒否を確認した。新生成0で同じ6rawを再受領し、最終1→6/6受理となった。

実16callは全HTTP200／stop。第一10call16.267773秒、欄名付き6call13.356560秒、計29.624333秒の要求loop時計。欄名付き個別は1.494390〜2.784156秒。総レンタル時間／請求・usage／revisionは未測定／unknown。新load／学習／自動retry／追加model reader／server restart0。全本文の語は原文を維持している。欄の分離と誤拒否の解消を、一般文章の再構成品質の向上へ換算しない。出力形式と送信viewを同時に変更し、slot名だけの単独因果は分離していない。

準備段階で通常の過去感情＋現在感情二欄1件が既存source資格外と判明し、0callで別の適格材料へ変更した。draftを保全し、最終6を無選別の一般入力評価とは扱わない。質問文／Karen-Diary／本人原文の送信0、全材料は架空である。

### 保存・再読・互換・限界

通常5実本文×Free／Plus／Premiumの15組を、同じ架空文を持つ合成owner／入力ID／時点へ厳密再bindした既存PGlite隔離SQLで保存・非生成再読。実responseのrawは無修正、provider初回1、作者／review／preview各1、save再送でもquota各1、保存後は作者／Engine／compiler／reviewを禁止して再読。行／detail12fieldと本文・recipe一致、原入力／Emlis thread／events不変。元のGPU要求IDの実DB保存やlive Auth／PostgRESTの実証ではない。合成focal原表面3planの通常保存・非生成再読も追加した。

NEW_REFINEDの新架空実rawはtyped Engine fixtureでのCMEE受理まで。**11/9後続訂正：この材料自体は現通常QUESTION／回答時点の条件を満たさず、通常SQL保存に適格なrefined sourceではない。** 診断で旧offline `serialize_refined_piece`へ渡すと、旧作者語順を要求する旧S7が拒否した。この旧checkpointをmodel保存の正本へ転用・緩和しておらず、この結果を通常SQL保存の成功／失敗へ換算しない。既存Q2-A/Cの新slot形式での通常保存は合成固定providerの回帰として成功し、新架空実rawの保存とは別の実績である。

最終対象8fileは368 PASS／18.74秒・FAIL／SKIP0、既存Pydantic warning1。旧299に新codec33・FOCUS33・保存3を加えた集合で、途中332／365／他の重複実行を合算しない。初回test helperのEngine引数と、JSON key順を元partition順として扱った合成provider接続を修正したが、期待する意味・本文・保存条件を弱めていない。前回親source overlayでも再現した旧評価19失敗、既知native V4同19失敗は別集合で未修復、今回再実行していない。全Piece試験の成功ではない。

private resultはJupyter editorで観測したmetadata／rawをclipboardから取得し、localと同じrequestを対応付けて16 request SHAを照合、全JSON SHAもterminal表示と一致（第一`dbd95eb73d522e5084e8b99d8bbd8a2676f0d9d5754a4cce3b9d15e2b0fb2fb7`、欄名付き`a41ac238691d4133e5a85e86714b2e3020b55f8354895197a0fff086fb0b8067`）。download成功とは主張しない。保全は`Cocolon_CMEE_AR04_FieldSlots4B_20261109.private.json`。公開側にはraw本文を追加しない。

### 現在地と次

本番配置／selector有効化・SQL schema変更・RN／署名build・配布・native画像／本人端末確認0。既存通常保存・原入力／本人補足の分離・同版本文とrecipeを継承。STRUCTURE_MAP_DELTA_PRESENT、正式商品品質credit0。

次は一般文章の意味を保つ再構成品質と、新しい適格refined実rawの通常SQL保存確認。今回修復した欄名付き受口と焦点読返しを土台にする。元原文がそのまま使える短文へ無理な言換えを強制せず、長い文の整理・単独伝達を実本文で比較する。AR-01方向反転、他AR、live API／migration・RN統合配布・同版画像／本人端末、正式受入れの残件も保持する。

CI確定分：[Piece42575709183](https://github.com/MassyuRed/mashos-api/actions/runs/42575709183)は全工程success、model step368 PASS／既存warning1／26.87秒。[Analysis42575709081](https://github.com/MassyuRed/mashos-api/actions/runs/42575709081)も全工程successを確認。

<a id="piece-eligible-refined-4b-20261109"></a>
## 11/9 正規本人補足・相対時点を既存4B本文／保存へ接続

API `5c042ed5107d15aef43ff6149279c796d5c45808`、8path。既存`emlis_answer_update._THEN/_FEELING`の時点・感情文法をPieceの本人補足へ再利用した。完全明示SELF感情の「その時」等を原文・根拠に残し、参照例外は認定済み補足の時点prefix内だけ。原入力の資格、他の指示語、他者や不明な感情を拡張しない。完成本文ではTHEN prefix全文も照合し、NOW化・削除・別時点・は／も・肯否・時制・程度変更を拒否する。公開DTO／DB／取得回数／Emlis・Analysis ownerは不変。STRUCTURE_MAP_DELTA_PRESENT。

新架空「誘われたのに、嬉しくなかった。」を実Emlis serviceのQUESTION→回答→RESOLVED・MATERIAL_UPDATE全ADD→exact回答選択へ通した。合成固定providerではPAST／NOW×3planの通常preview・visual変更・SQL save・非生成再読が6/6成功。別に既存warm4Bへ同2材料を単発生成し、PASTは元／回答を別slotで保持、NOWは回答をmemoへ結合し回答slotを欠落した。実rawを無修補で新しい等価な合成sourceへ厳密再bindし、PASTは3plan保存・再送・再読成功、NOWは3planともpreview前拒否・保存行／quota増加0。実GPUの同じPreparedRequest identityを実DBへ保存した証明ではなく、隔離PGlite・合成Auth／HTTPの通常owner接続である。

前回NEW_REFINEDはtyped Engine fixtureのCMEE受理だけで、通常保存に適格なsourceではなかった。原焦点希望から現EmlisはQUESTIONを出さず、回答希望にも現時点根拠がない。前回の「通常SQL未検証」という分類を訂正し、今回の別材料の成功を旧材料の保存成功へ換算しない。旧offline serializerを通常model保存の正本へ転用しない。

既存native編集planをprivate入力へ添える案も3新架空例×旧／新の6実callで比較したが、本文は全3組同一。整形改善0のためoptional schema／service／prompt変更を通常コードから撤回し、未採用patchとrawだけをprivate原本へ保全した。同種prompt追加の反復は行わない。今回計8call、全HTTP200／stop、比較loop11.137208秒＋補足loop4.013212秒、usage／revision／請求unknown、学習／新load／restart／retry0。一般文章の再構成品質は未改善。

最終16file559 PASS／46.06秒・既存warning1、FAIL／SKIP0。9file model CI対象は新THEN testを追加。中間／独立集合は重複加算しない。既知の旧評価19失敗と別のnative V4同19失敗は未修復。配置／live DB／RN／build／配布・native画像／本人端末確認0、TECHNICAL_CREDIT・正式商品品質credit0。次は一般文章の再構成と、NOW補足のslot結合を起こす生成側の修正。

実raw2件はPAST2.238746秒／NOW1.772286秒。PASTはsource本文と回答本文を各1slotへ保持し、その本文をpreview→見た目変更→save／同key再送→新service detailまで固定した。NOW rawの回答slot不足は専用receiverでINVALID_FORMAT、通常serviceはPIECE_TEMPORARILY_UNAVAILABLEとして拒否。各3planの記録済みraw照合を確認し、recorded file不足時の合成応答への切替を保存証拠に混ぜない。

原本：`Cocolon_CMEE_AR04_EligibleRefined4B_20261109.private.json`。全8送信messages／exact raw／finish／source資格probe／正規Q2状態／保存再読／拒否時DB・quota不変／不採用編集案と原本digestを同梱。新材料は開発用架空値でblindではなく、Mash正式受入れとは別。

[Piece CI42580879839](https://github.com/MassyuRed/mashos-api/actions/runs/42580879839)は全工程success、job129039028812のmodel9fileは399 PASS／既存warning1／25.00秒。[Analysis CI42580879705](https://github.com/MassyuRed/mashos-api/actions/runs/42580879705)も後続確認で全工程success。

<a id="piece-ordered-decoder-20261109"></a>
## 11/9 既存decoder制約と補足先行の生成順をPieceへ再利用

API `a08c003c50919db33076dfc66e1a582e5488c354`、6path。既存Analysis servingのLMFE817f944／TokenizerData／prefix token maskをPiece専用の明示private `candidate_format=piece.field_slots.v1`へ再利用。field_slotsから必須1〜3key集合・追加key禁止・非空の自由stringを導き、Pieceだけ本人補足→元欄global index順を生成中に固定する。原文enum・旧作者正文・欄別追加推論・prompt追加・受領後のsplit／修補／fallbackはない。公開canonical本文は従来のpartition順へ戻し、PreparedRequest／全source／legacy receiver／保存後0生成を保持する。

新providerは実適用markerの一致を必須とし、旧serverの要求無視・marker欠落をPROVIDER_ERRORで拒否する。marker無しの通常Emlis／Analysisの引数形と応答bytesは維持。Pieceは既存natural鍵・同base、2048token／8192context／既存23秒推論枠・queueを用い、model.generateは各HTTP一回。LMFE未初期化なら生成前拒否。共有model/adapter/認証値/起動引数は保持し、GPU提供コードを同重みで2回差替えた。最終PID31933／source SHA256 `5e3d43637ab8c8c541c1e56a74401c5d6d17dcedcdc5aa187448055cb2a3bcd3`、health正常。APIのRender配置・selector有効化は行っていないため、アプリ通常提供の反映完了ではない。

実12call＝旧契約baseline2＋順不同mask4＋補足先行mask6、全HTTP200／stop。baselineの同PAST／NOW rawは前回と完全一致。順不同maskは4/4必須欄を出したが、元NOWはmemo内混入＋回答重複が残り、隔離SQLで3planとも保存前拒否・quota0。既存field-order制御で補足を先に生成すると、同NOWの本文を原入力・回答へ正しく分離できた。最終6例（refined4／normal2）は全て意味保持し、同じ実rawを新しい等価な合成sourceへ厳密再bindして6×3plan＝18件のpreview→save→再送／新service非生成再読に成功。refined12件は見た目変更後も同本文。本文・recipe等は保存版を維持、各quota1、原入力／Emlis不変。実GPUのoriginal PreparedRequest IDを実DBへ保存した証明ではなく、隔離PGlite・合成Auth／HTTPで既存通常ownerを通した確認である。

形式を満たす値の意味まではdecoderが保証しない。欄内混入、否定・時点・程度・他者・追加等は現在のreceiver／CMEE／S7で引き続き独立拒否する。今回の同6例は開発材料でblind一般化ではない。本文の語は原文維持で、一般文章の整形品質改善やMash正式受入れへ換算しない。旧不適格NEW_REFINEDを通常保存成功へ戻さない。

最終19file637 PASS／51.89秒・既存warning1、FAIL／SKIP0。既存GPU用の固定parser依存だけをCIのCPU検証にも使い、Render依存は増やさない。中間630／独立138等は加算しない。生成loopは18.335122秒＋18.901216秒、起動は各約19.015秒、model load／提供再起動各2、学習／自動retry0、usage／revision／総請求unknown。STRUCTURE_MAP_DELTA_PRESENT、限定TECHNICAL_CREDIT・正式商品品質credit0。一般再構成・広い材料／欄混合の残差、API本番／RN統合／同版native画像／本人端末、他ARは残件。

比較の因果：同じ旧2messages・source bytes・重みで、baselineのPAST成功／NOW欄欠落が完全再現した。第一変更は生成時のexact key制約だけで、NOWの欄は揃うが値の混入が残った。第二変更は同じschemaの生成順だけを補足先行へ固定し、同NOWの混入・回答重複を解消した。新否定／程度例とnormal二欄／焦点例も意味を保持。raw objectのkey順が変わっても、公開本文・保存本文の元→回答順は維持した。表示品質を原文コピーから一般作品へ改善した比較ではない。

旧録画responseはmarkerを自動追加しないため、新providerでは旧契約として拒否される。今回のdecoder実適用証拠は、新serverのmarker付きHTTP response／exact rawと対応sourceだけに限定。既存保存済み本文やlegacy CandidateReceiptを再生成・再判定へ戻さない。

原本：`Cocolon_CMEE_AR04_OrderedDecoder4B_20261109.private.json`。全12request／raw、旧比較、入力資格、段階別SQL再読／拒否、同重み差替え情報・最終source digestと検証を収録。最終sourceはAPI commitへ参照し、Git管理の製品コードを別保存の正本へ複製しない。

[Piece CI42584857085](https://github.com/MassyuRed/mashos-api/actions/runs/42584857085)は全工程success、job129052116528のmodel10fileは442 PASS／既存warning1／42.13秒。新parserは実pinned依存でskipせず実行。Analysis CI42584857044は確認時点で実行中。
