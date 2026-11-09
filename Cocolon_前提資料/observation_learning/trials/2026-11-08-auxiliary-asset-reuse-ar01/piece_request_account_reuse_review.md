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
