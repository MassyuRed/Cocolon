> **11/22 JSTの現行方針。** EmlisAI、Piece、わたしマップv24、DeepInsightをCMEE＋4Bの一単位として並行して進める。着手点・共有する根拠・具体的な修正と通常反映の確認は[§9.227](#cmee-four-feature-normal-adoption-20261122)。

> **11/20 JST　Pieceの通常4Bへの切替、三中核の保存確認とiOS配布。** iPhone版1.0（8102）はAppleで処理完了し、内部グループ「Emlis テスト版配布」のiOS欄でTestingを確認。本人端末での起動・画像保存・通知受信は未確認。 [今回の実測・残件・GPU借り替え](#three-core-device-and-pod-20261120)。 12件のわたしマップの通常保存は [§9.204](#analysis-b61-normal-background-map-20261120)。

> **11/18 JST・A30は7応答。読書会の図と全文を取得し、原文との二者照合で不適合、照明はNODESの途中で停止した。** 読書会では下書きから消した対象が変わり、同じ内容を繰り返した項目の文末に構造文字列が露出した。元120uは復元済み。残る3入力と後対照は未実行。B30は条件不成立で起動せず、全12記録の実保存・非生成再読・通常反映は未完。補助設計§9.133に記録した。

> **11/18 JST・A29は読書会の3段階を受信し、公開図の構成時に停止しました。** 分類だけ異なる2項目の本文が同一で、重複の検査が作動しました。原文の「写真から二階を使えると予想したこと」も「予約済み会場が二階から一階に変わったこと」のように書かれていました。前対照を含め5応答、追加学習0。元120uを復元済み。公開図・全文は0件、残り4入力・後対照・B29は未実行で、12記録の保存再読と通常反映は未完です。開発版b02ae51eは重複防止と予想／確定の区別を追加し、369試験・Analysis／Pieceの両CIが成功。A30と条件付きB30を凍結しました。送付・実行は未着手です。詳細は補助設計§9.132。

> **11/18 JST・FIT28は66更新、損失計測4回と保存再読一致を確認。A28は4件目の項目生成後に停止し、通常採用に至らなかった。** 5件のうち図と説明が完成した先頭3件は、原文との独立照合で全件不適合。読書会は送信と下書きの順、照明は確認希望と実行、修理は本人と弟の行動を取り違えた。4件目の取消は同一引用の重複で停止した。5件目と後対照には到達していない。実応答は13回。元120u提供を復元し、B28は条件不成立で起動していない。開発候補13e35effに記録日時と根拠の扱い・重複禁止を反映。関連162試験とAnalysis／Piece両CIが成功し、次の生成比較A29／条件付きB29を凍結した。送付と実行は未着手。実4Bでの新候補・全12記録の保存と非生成再読・通常DB/API反映は未完。詳細は補助設計§9.131。

> **11/18 JST・FIT27は学習前CPU確認で停止。実依存で66行を再確認し、新28の一回分を準備しました。** 承認済みRESTORE27は23.948631秒で元120u受口をPID569／start1320991・health200へ復元。FIT27は既存clientを加えた実依存2.11.7／core2.33.2と旧proof2.13.5／2.46.5の差をguardが拒否し、提供停止・学習前で0更新・新生成0、A27／B27未実行だった。事後比較ではCPUとFIT／試行提供側の全8依存版・9import元が一致し、順序変更だけでは直らないと確認。Podを変えず実8版で66行・36,182token／全EOSをCPU再確認し、1,715全集合・gold等の旧一致、private全encode／厳密loaderの正系と旧artifact拒否も確認した。新候補は送付8file・530,712byte＋同Pod内copy16file・5,013,117byte、RESTORE28なし。FIT28は66更新／4計測・復元込み20分、A28は同5入力最大19応答・30分、全5独立全文適合時だけB28は同12記録最大43応答・17分。独立最終確認は阻害事項0で完了し、新28は未承認・未送付・未実行。CPU確認を学習成功・意味改善・通常採用へ換算せず、全12・同raw保存再読・通常反映と補助全体は未完、build／TestFlight／本人実機保留。詳細は§9.130。STRUCTURE_MAP_DELTA_NONE。

> §9.129と§9.130は準備・前回実行の履歴です。FIT28／A28の実行結果は§9.131を参照してください。

> **11/18 JST・学習と本番生成制約の不整合を修復し、次の一回分を準備。通常反映は未完了。** 旧FIT26/A26の消費済み・全5件意味不適合・53ab不採用・B26未起動を維持する。全span索引・mandatory複合claim・REL原quote全文再掲は元の入力／共有4096枠で容量退行するため採用しない。現bound_roots.v2と3取得を保ち、private fresh-fitを本番許可token集合内のconditional CEへ修復した。元66を保持し、別revisionでは2targetの「鞄」を同じJSON値のUnicode escapeへ表記、自由文で不許可だった3位置だけを同wireのtoken分割へ合わせた。本人source・全messages・全parsed target・他65行のencodeは保持。本番と同じLMFE全21source／依存で66行・36,182token／全EOSの許可をCPU確認し、厳密loaderと独立レビューも完了。これは意味改善の実証ではない。新GPU・学習・生成・SQL・通常設定変更0。Pod読取では旧復元PIDが既に不在、8000は接続拒否だったため、新試行には元120u仕様の一回復元も含める。保存再読用PGlite0.5.8の既存依存はローカル復元済み。新実行は未承認・未送付・未実行で、全5実意味→条件成立時全12→同raw保存再読・通常DB/API反映を残す。build/TestFlight保留。詳細は補助設計§9.129。STRUCTURE_MAP_DELTA_NONE（製品source・公開型・owner配置は不変）。

> **11/18 JST・FIT26／A26の実行と全文照合：両方の一回枠を完了し、元提供へ正常復元しました。意味は全5件不適合で、B26の条件は不成立です。** 同Podへ承認済み新12file 2,087,291byteを送付し、既存9file 3,286,728byteをPod内copy、全21のbyte/hashを照合。FIT26は66更新・4損失計測・112個F32tensorの保存fresh reload一致、復元込み412.121秒。A26は同5入力・15phase＋前後4対照の19応答を完了し、対照の全body一致、復元込み808.570秒。rootと独立担当が19記録／38欄・全15raw・公開図／全文を照合し、読書会の初回未送信の欠落、照明の購入／留保／条件差の欠落、修理の旧未確認の現在化、取消理由の強化、T01概要の恋人非面会への反転を確認。T01の10独立nodeと取消後の再応募意向なし等の改善は保持し、全5適合や一般品質へ換算しません。新重み53ab4293は不採用、B26未起動・同実raw SQL保存／通常API・worker変更0。追加学習を既定とせず、既存作者の選定・時点・派生表現の一体修復を具体化する段階です。元単位／補助全体・通常反映は未完、build／TestFlight／本人実機保留。詳細は補助設計§9.128、承認前の準備記録は§9.127。

> **11/17最新実績：承認済みFIT25は54更新・4回の損失計測、112 tensorの保存／fresh reload一致、元提供復元を完了。続くA25も全5件・三段階15phase＋前後4対照の19応答を一回で完了しましたが、rootの全文照合で全5件が意味不適合となり、通常不採用です。** 独立担当者の全5件の全文照合も完了し、全5件不適合で一致しました。FIT25は復元込み592.445476秒、新weights5b36fe0a／configb1f2d89b。A25は復元込み844.331987秒、元120uのPID36492／start99185008・別health200、候補18008閉鎖・B25root不存在を確認。B25は全5適合条件不成立で起動0、実全12・実rawのSQL保存／非生成再読・通常反映0です。新17file4,818,633byte送付＋同Pod copy4file118,409byteと派生scope7fe32f73を原本へ保持し、FIT25／A25の一回は消費済み、未使用B25を別試行へ流用しません。候補APIe58c1e49・準備／既存CI／合成SQLの記録は§9.125、今回実績と残件は§9.126。通常24bc228d／DB20261115011424は前回確認記録の継承で、今回fresh Live照会ではありません。元単位／補助全体未完、build／TestFlight／本人実機保留を維持します。



> **11/16前回候補：fresh16教師32更新は完走したがA14は不適合で失敗閉鎖。既存作者をnode_local.v3へ改修し、候補コード・局所検査・独立review・GitHub反映まで完了。実4B・保存・通常採用は未実施。** AF1は306.882秒／復元込み341.020秒、新73f5／configfb2eを保持。A14は前対照2＋読書会1の3応答、反復・15未使用・後日事実欠落が残り、図／本文・残4件・後対照／B14／SQL／通常反映0。305.217秒で元native d678fe2c・PID13576/start100524246へ復元、別health200・18008閉鎖。新private候補APIc95d17dはnode根拠付きunitから同じ公開graphへ投影し、旧v1／v2・guard／cohort／権利・保存／RNを保持。対象回帰314成功／skip0、最終新2suite47成功とnative既存303成功は重複のため合算しない。独立reviewにblockingなし。両CIは実行中で未成功。A15／新GPUは区切り前に開始せず、同5入力→全12→同raw保存再読→通常反映は次に残す。Render認証による通常接続未確認、元単位／補助全体未完・配布保留。詳細は補助設計§9.109。

> **11/16前回source修復：A10失敗原本から既存v2作者へ完成正例を復元し、候補API7bb605bへ反映。実4B改善・通常反映は未確認。** 確認待ち→翌日確認済みと、別人の残る未確認を分離した入力／完成JSON例を既存指示定数内へ戻した。定数以外の製品ASTはb14960eと一致、原5入力／guard／固定時点／同12記録24欄・同6組を保持。最終33件成功、送信時最大LEAF16,379byte。247sourceのremote blob一致と既存実行コードの材料読込、既存finalizerの8source／SQL原本4件の非生成束縛を確認。新scope6c2c2a51・新6file3,039,282byte／同Pod内copy3file、全9file3,139,037byteのA11/B11を準備した。A11最大9応答30分、全5件独立全文適合時だけB11最大11応答17分、各一回。個別未承認・未送付・未実行。A10消費済み／B10条件不成立を転用しない。両CI結果は同候補ci_verification.jsonを参照。通常API／worker24bc228d Live・autoDeployOFF、DB38migration／20261115011424をfresh再確認。worker900は現deployの既存起動log再取得で確認し、今回変更0。元単位／補助全体未完、配布保留。詳細は補助設計§9.103。

> **11/16前回準備（後続実績§9.102・現候補§9.103）：既存v2作者の意味条件を復元し、候補source b14960eへ反映。実4Bでの改善・通常反映は未確認。** 生成指示定数だけで、確認済み／不明、前後・状態別event、同義項目の反復抑制、線の両端根拠の和集合を明示した。既存170件と実行境界22件／28subtest成功、最終指示3632byte（旧3436＋196）で同じ全12記録・6分割を維持。原入力／guard／固定時点／native／保存条件は不変。A10/B10の新候補はscopef68618f0、新送付6file3,039,091byte・同Pod内copy3file、全9file3,138,846byte。A10最大9応答30分、全5独立全文適合時だけB10最大11応答17分、各一回・失敗時閉鎖。個別未承認／未送付／未実行で、旧repair1の承認・rawは流用しない。通常24bc228d／DB20261115011424は前回確認記録の継承。本単位／補助全体／正式受入れ未完、build／TestFlight／本人実機保留。詳細は補助設計§9.101。

> **11/16前回実績（後続修復候補は§9.101）：修正版A9は起動を通過したが、最初の読書会rawが意味・参照とも不適合で不採用。元120uへ復元し、B9は未実行。** 個別承認後、新2file42,201byteを送付、既送付7fileを同Pod内copyして全SHA照合。前対照2＋分析1の実3応答を受領し、確認済みの送信・了解・会場確認をunknownへ移す誤り、24項目／21線への反復、11線の根拠範囲外参照を確認した。図／本文・残り4件・後対照は未生成／未実行。停止復元込み287.516223秒、PID139472／healthz200・候補listener停止・B9root不存在を確認。原本13fileと独立照合を保全し、scope75d8633dは終了条件で閉鎖、追加修正／retry／次scope準備0。通常API／worker24bc228d Live・DB20261115011424、学習／SQL保存／通常反映0。本単位／補助全体／正式受入れ未完・配布保留。詳細は補助設計§9.100。

> **11/16前回実績・修正準備時点の履歴（後続実績は§9.100）：A9は候補起動時のargv照合で停止、応答0件のまま元120uへ復元。B9未実行・通常反映未完。** 承認済み9file3,133,443byte／scope b53ac4d9は遠隔全SHA一致。実HF preflight5件を通過後、取得前にcandidate_provider_argv_changedとなり、29.388062秒でPID138365／healthz200へ復元。原本11fileの回収・CRC／byte一致と別読取の候補listener停止・B9root不存在を確認した。CPUで起動直後の空cmdlineを再現したが、A9の観測値は未保存で同原因とは断定しない。空だけを同じ期限内で待ち、非空不一致を拒否する既存helper修正を7＋15件で検証。新2file42,201byte／scope75d8633d・同Pod内copy7fileの限定一回は未承認／未送付／未実行。通常API／worker24bc228d Live・DB20261115011424をfresh確認、元作業単位／補助全体／正式受入れ未完・配布保留。詳細は補助設計§9.99。

> **11/16前回準備：A8原本の留保・判断・達成状態とreading根拠を、既存作者内のevent-plan v2候補へ修復。実4B・通常反映は未確認。** API80d94db7で、未確認事項は原文引用のまま表示し、本人判断／希望／決定済予定／実行済経験を先に区別、reading根拠は一度の指定からcompilerへ継承する。回帰824件・現行source等51件・runner15件、合成7応答の一回SQL保存／別process非生成再読を確認。旧A8 raw・拒否条件・原入力／guard／as_of／月次は不変。新scope b53ac4d9の9file3,133,443byteを確定、A9最大9応答30分・条件付きB9は全12記録6LEAF＋MERGEと4対照で最大11応答17分、各一回・学習／retry0。未承認／未送付／未実行、既存A8消費済み／B8未成立の枠は転用しない。通常API／worker24bc228d Live・DB20261115011424をfresh確認、配布保留・本単位／補助全体未完。詳細は補助設計§9.98。

> **11/16前回実績：承認済みA8は実2分析で停止、元120uへ復元。B8は条件不成立で未実行、通常採用0。** 確定9file3,127,144byte／scopee84f40b9を同Podへ送付し全SHA一致。Emlis／IFの前対照2件と分析2件の計4応答を受領。読書会はHTTP200／stop・GENERATEDだが問い合わせの送信者／宛先を逆転、照明はHTTP200／stop後にreading参照範囲不整合で拒否。残り3件・後対照は未実行。復元込み397.503209秒で元argv／env／cwd・source／重みへ戻し、PID136765／healthz200・候補停止・B8root不存在を確認。学習／retry／SQL保存／通常反映0。通常API／worker24bc228d Live・DB20261115011424をfresh確認。本単位／補助全体未完、build／TestFlight／本人実機保留。詳細は補助設計§9.97。

> **11/16前回実績：承認済みA7は最初の1件で思考2048token上限に達し、最終JSON未生成で停止。B7は条件不成立で未実行。** 新4file129859byteを同Podへ送付・全SHA一致、実HF preflight5件を通過。同A6重み／読書会messagesで1call105.1615秒、子process127.4212秒、自然な整理終端なしのsemantic_thinking_budget_exceededで残り4件へ進まず、復元込み160.9508秒で元120u／PID134586／health200へ復元した。raw／図／本文0で意味品質は評価不能、候補は通常不採用。原本9member／ZIP10450byteを回収照合、追加学習／retry／B7新12LEAF／MERGE／SQL保存／通常反映0。A7一回は消費済み・未使用枠を転用しない。通常API-worker24bc228d／DB20261115011424の前回確認記録・worker900／配布保留、本単位／補助全体未完を維持。 [詳細§9.95](#analysis-bounded-thinking-actual-20261116)。

> **11/15最新：応答への二入力本人訂正からPiece作成・保存再読、通常DB／API反映までの限定単位を完了。** 初回訂正1件・ANSWER0の完全引用REVISE／WITHDRAWを既存source更新能力から導出し、未変更原節と本人の有効置換だけを既存作者・独立S7へ渡す。原文七項目と本人説明を別sourceで保持し、AI対象文を作者材料へ混ぜない。RNは表示していた同CORRECTED OBSを明示選択し、別訂正への取得・結果不明保存復元を拒否。API／worker e5a1dc6双方Live、7作品の隔離保存再読と検証範囲・失敗履歴は§9.69。一般自由文・複数訂正／回答併存、一般本文品質・native画像・本人利用・補助全体は未完。build／TestFlight／本人実機保留、model selector OFF・新GPU／学習0を維持。 [今回の実装・通常反映§9.69](#piece-corrected-observation-source-20261115)。

> **11/15先行比較の履歴（修復後の実結果は§9.67）：承認済み通常IF3の一回を完了、条件保持は成立したが、3案のgraphが同じ本人意向コピーのため商品不採用。** 実3POST全受領、通常Emlis／Analysis対照の前後全文一致、実行本体167.909910秒・追加学習／再試行0。受領rawは旧CPUでGENERATEDだが、見出しの違いだけを3ルート成立へ数えず候補SQL保存／通常API反映0。意向を選択候補から外す修正をAPI候補7f51a64e6cb58668ad5d418480b7de4499bfe6faへ反映し171件成功。新修正の実生成は未実施、28,480bytes・2fileの追加一回を準備。通常API／workerはc7968c6、Podは前回承認で差替えたd3のIF2関数版。配布／本人実機保留・補助全体未完を維持。 [実結果・原因・新準備§9.66](#if-standard-three-actual-proposal-fix-20261115)。

> **11/14準備時点の履歴（後続実結果は§9.66／67）：通常入力の自動3案・条件保持の修復をGitHubへ反映、実4B送付は審査で停止。** 候補d3daee5／関連168件成功。実生成・通常反映は未実施、稼働はc7968c6を維持。 [実施範囲・具体送付・再開§9.65](#if-standard-three-conditions-prepared-20261114)。

> **11/14本人提示3案の先行実績（標準自動3案の後続実績は§9.67）：実4B出力を無修補で採用し、隔離DB保存・別プロセス再読・明示Saved・既存RN受口まで接続。** 通常API／worker `c7968c658277ec190c32d5e3913dbde13c01d68a` がLive。先行1／2候補の原本も同版保持。本人案がそろう1〜3候補の限定接続単位は完了。本人案なしの標準RN経路の実3案、条件表示・一般日本語品質・本人利用・AR-07／補助全体は未完。 [実結果・範囲・次§9.64](Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#if-person-three-fixed-slots-normal-rollout-20261114)。

> **11/14・修正起動の明示承認後、実2取得・復元・同状態の保存再読まで完了。本文反復の改善は0。** 送信済み62,086byte・3fileは無変更／再送付0、1child／1loadで新2＋前後4対照＋health2GET、閉鎖後105.175913秒。通常／Analysis前後全文bytes一致、元args／env／cwd／2鍵・source／重みを保ってPID98755へ復元。新2 rawは旧2と全byte同一で、3省略候補は未使用。実raw無修補の2独立fork保存・非生成再読、canonical8／3hash・quota各1・原source／Emlis不変。旧保存ともcanonical8同一のため新native実行0。通常selector OFF、一般編集品質・通常経路／本人端末は未完。 [詳細§9.53](#piece-topic-editorial2-actual-unchanged-20261114)。

> **11/14・62,086byteの3file送付後、華恋の起動コマンド引数誤りで比較処理前に停止。** 必須ACK前の区切りを抜かし、main内の引数解析で終了。新model／HTTP／提供停止0、元提供PID95100／start217338131を維持、実行ROOT未作成。3fileの全byte／SHAは承認時と一致。追加実行はせず、区切りだけ直したargvを純粋parserで確認した。作業規則R10.3により修正後の新一回は明示承認待ち。新2本文は未取得・比較／保存／画像は未完、通常selector OFF。 [詳細§9.52](#piece-topic-editorial2-cli-stopped-20261114)。

> **11/14・同じ本人の主語を省略する候補3箇所をsourceへ拘束：** API99dbdaabで生成材料とmodel opt-in S7を整合。原七項目／Prepared／SYSTEM・重み不変、旧TRUE材料との違いはeditorial_choices3箇所だけ。関連1,488件（新35）成功。旧実raw2の保存・再読維持と合成省略2の保存を確認したが、新実4B本文は未取得で、反復改善の証拠ではない。通常FALSEの生成messagesは同一、model S7のsource-proven省略受理範囲は広がる。新送付62,086byte・3fileで新2＋前後4対照＋2GET、復元込み600秒・一回・学習／再試行0を準備。前回の一回は消費済み、今回の送付・実行は確認待ち。通常selector OFF・STRUCTURE_MAP_DELTA_NONE。 [詳細§9.51](#piece-topic-editorial2-prepared-20261114)。

---
doc_id: cocolon.cmee.auxiliary_asset_reuse.implementation_design.20261108
title: "CMEE 補助経路の活用作業 — 全必要資産の回収・改修・商品接続 詳細設計"
revision_date: "2026-11-18 JST"
decision_owner: Mash
implementation_owner: Karen
status: IN_PROGRESS_AR01_TO_AR08_COMPLETION_FOCUS
working_lineage: "Cocolon PR30 / mashos-api PR3"
product_spec_owner: "../../00_cocolon_current_product_and_state.md and each core canonical owner"
continuation_instruction: "補助経路の活用作業を進めて"
current_next: "Section 9.197 records the prepared B61 source. The model can select contrast, progress on the same request, different subjects, or insufficient evidence using judgments grounded in both records. The actual B61 choice, paired review, qualifying same-ID save and reread, and ordinary rollout remain pending."
runtime_effect_of_this_document: 0
---

> **11/14・取得済み344aの段落／二欄2件の誤拒否を修復し、本文無修補で保存・非生成再読・同版native画像へ到達。** API1237bc21／最終04153c52。4原本の同checkpoint再照合は3保存／1拒否、氏名が残るbase二欄は拒否を維持。保存canonical8／3hash・quota各1・原source／Emlis不変、追加model／学習0。研究e098efda・iOSシミュレーター6画面、最長4.556秒、各作品の3PNG全byteと実view-shot画素／SHA一致。局所1,404件と既存CI成功、通常selector OFF。本文反復・一般編集品質、通常経路／本人端末は未完。 [修正・画像・原本・残件§9.50](#piece-coherent2-register-saved-native-20261114)。

> **11/14・取得済み実4B2作品を、同じ保存本文から通常hostのpreview／saved／exportへ接続。iOSシミュレーター6画面成功、最長2.124秒。各作品の3画面PNG全byte一致・実view-shot画素／SHA一致、native dismiss後の保存画面遷移を確認。追加生成／学習／本番変更0。一般整形品質・本人端末は未完、通常selector OFF。** [同版画像・実書出し§9.45](#piece-latest-answer-native6-20261114)。


> **11/14・最新一回答のPiece実4B2作品を94.076319秒で取得し、同checkpointで保存・再読2件一致。原入力＋第2/3回答の最新一件を保持し、先行回答の混入なし。実本文は原文と同文のため整形品質改善は未実証。前後4応答・health2GET成功、学習／再試行／再起動0。通常selector OFF、本番・native画像・本人端末は未完。** [実結果・確認範囲§9.44](#piece-latest-later-add-actual-20261114)。

> **11/13・別記録の反復判断対象を実4Bで比較、本文新2は不採用：** 承認50,496byteを一回実行し、研究4＋前後4応答は全200/stop、health2GETも200。ZIP閉鎖まで97.762331秒、通常／Analysis前後全response bytesと同PID/starttimeを維持した。再修正側は今回の悲しみを落として過去へ結合し、不使用側は過去の重さ・戸惑いと未記載の自責傾向を追加した。同じnew2 checkpointで実receipt保存・別service非生成再読2成功、再取得0。保存成功と本文品質は別判定で、通常selector OFFを維持する。 [実原本・採否§9.42](#emlis-cross-record-frame-target-actual-20261113)。

> **11/13・別記録の反復判断対象を実4Bで比べる準備完了、未実行：** 新しいCを使った再修正／不使用の2分岐を、対象未結合・結合済みの計4応答へ固定した。3送信fileは50,496byte、通常／Analysis前後4対照・health2GET込み最大300秒・一回、学習／再試行／再起動なし。固定合成本文の同checkpoint保存・非生成再読は2成功、実4B生成とPod送信は0。新しい一回分の承認待ちで、旧承認を再利用しない。b8466c6aの両CIは初回成功。 [準備原本・意味・限界§9.41](#emlis-cross-record-frame-target-prepared-20261113)。

> **11/13・frame本人判断の対象結合を実5応答で比較、本文不採用：** 承認83,777byteを一回実行し、旧2＋新3と前後4対照は全200/stop、health前後2GETも200。98.032635秒で完了し、同PID/starttimeと通常／Analysis前後の生response全byte一致を確認。新3は拒否／修正済みmappingを無留保で再使用し、本人判断を優先した本文の達成0/3で不採用。同じ新3checkpointで実receipt保存・新service同本文の非生成再読3/3、再取得0。保存frameの除外／修正は保持した。一般品質・live／端末は未完、通常selector OFF・新10b563不採用を維持する。 [実結果・採否§9.38](#emlis-frame-feedback-target-context-actual-20261113)。

> **11/13・16教材32更新と17比較を一回完了、品質未達で通常不採用：** 承認207,620byteを既存Podで実行し、新規31応答＋前後4対照、全stop、再試行0。復元・対照終了237.196491秒／ZIP close237.885058秒、元提供PID83325→84398へ元args/env/cwdで復元、通常／Analysisの前後全response一致・独立health200。112tensor保存／fresh reload一致と原本・重み回収を確認。先生→妹の格崩れ・本人一人称の貼返しが残り、通常保持T06には未記載の支配状態を付加したため新10b563候補を採用しない。旧3＋新4の同source隔離保存・新service非生成再読は7成功、独立比較7UNASSESSED。通常OFFを維持する。 [実原本・採否・次](#emlis-correction-independent16-fit32-actual-20261113)。

> **11/13・資格固定3件の実4B生成と同じ源泉の保存・再読を完了：** 承認38,631byteを一回実行し、Piece3＋提供前後4確認、学習／retry0、復元込み114.971199秒。元提供PID79715→80025、引数／環境／作業場所／既存2鍵・source／両adapterを保持し、通常／Analysisの前後全response一致を確認。無修補の3rawが既存CMEE／S7を通り、凍結済み同checkpoint・source／prepared／messagesからFree3保存・新service非生成再読、本文／payload／recipe／renderer／hash一致、元source／Emlis不変・quota各1。normal2 rawは前回既知rawと同一で、新たな編集改善やA/Bには加算しない。合成Auth／先行Emlis・隔離PGliteの結果であり、通常option／selector OFF、一般品質・live／本人端末・正式受入れ・全補助経路は未完。画像側test構文1箇所を修正し、研究24f7ba8b／既存CI43350232403は成功。9frameの同版PNGと実書出し一致、最大2.61秒を確認。自然参照画像全体のRGBA一致は未成立で、通常採用へは広げない。 [実原本・同source保存・次](<#piece-qualified-source-actual3-saved-20261113>)。

> **11/13・Piece編集候補の実6応答を完了、全3組で差分0のため不採用：** 承認14,489byteを既存Podで一回実行し52.420284秒、全6 HTTP200／stop／attempt1。PID77140と前後health200を保持、学習・retry・提供再起動0。段落・二欄・refinedの旧新全response／rawは各組完全一致・全欄原文copy、8編集選択の可視効果0。二欄では氏名が残り公開役割化も未達。原本のexact CPU再演は4 GENERATED／二欄2 UNAVAILABLEだが作品品質合格ではない。候補・通常optionはOFF、今回のSQL／native保存0、追加生成・S7緩和・raw補修なし。実原本と不採用理由を保全した。 [実比較・判定](<#piece-editorial-choices-actual6-20261113>)。

> **11/13・Pieceの既存編集判断を現作者へ移す候補：** API `ec4bd668`で焦点構文・同本人参照継続・評価語順の既存判断をprivate作者材料へ接続。関連5file296 PASS。新optionは既定OFF、現configured取得・SYSTEM・独立S7は不変。既存一般3型はmessages無差分のため再生成しない。架空3型の旧新6要求・14,489byte・最大7分／1回／学習・retry・提供再起動なしの案を準備したが、未承認・未送信・実生成0。一般編集品質・同本文保存／画像・通常採用は未成立。AR-03実4不採用も継承。 [候補・固定scope](<#piece-editorial-choices-prepared-20261113>)。

> **11/13・AR-03の評価対象／時点候補を実4応答で比較、限定的短縮はあるが通常不採用：** 承認38,004byteを既存Podで一回実行し、8.890746秒・全4 HTTP200／stop、PID77140・前後health200を維持。学習／再試行／提供再起動0。ORIGINAL_OCCASION候補は「その時」の所属が曖昧なまま、未記載の「その言葉」へ評価対象を狭めた。ANSWER_TIME候補は不要な原因探索・問い掛けを除き短縮したが、「そして今は」と続け、過去記録への回答時点と今回の別記録を区別できていない。全4は既存形式検査を通るが意味合格ではない。通常support OFF／history-plan opt-in default falseを維持。今回一回の承認は消費済み、新本文SQL保存・live反映／本人端末・AR-03／全補助経路は未完。 [実原本・判定・再開点](<#auxiliary-history-active-binding-actual4-20261113>)。

> **11/12・固定実3件の意味読取拒否を修復：** API87512ddaで、既存述語／本人評価／感情／literal-self資産を、型付きoperatorと完全保持spanの独立比較へ回収。保存344aの同じ実raw3件は3拒否→3採用、旧73件の採否・全artifact・prepared／messages／rawは修正前後同一。新GPU・学習0。3plan計9件の隔離SQL保存・非生成再読、本文／recipe／renderer一致とquota各1を確認。Free refinedは元の適格ADD snapshot、Plus／Premiumは同じ全入力・回答から既存ownerでtier別資格を再導出。合成Auth／source・mock HTTP framingであり、実HTTP／live DB／本人端末ではない。新70を含む局所1774と既存SQL56が成功。Piece CI43174913229はattempt1・39step成功、model集合2021に新70を含む（重複加算なし）。生成本文自体は従来の常体化が中心で、一般編集品質・同じ新本文のnative画像・通常採用・AR-04／全補助経路は未完。 [修復・原本・確認範囲](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general3-operator-review-repair-20261112)。


> **11/12・保存344aの新3件実行：** 保存344aで同じ新3件を一回実生成し、段落／二欄／適格refinedともstop。候補3＋前後対照4の計7call、追加学習／retry0、復元込み内部116.995875秒・ZIP close後の外側完了観測181.715秒。元提供PID73476へ復元し、引数／環境／作業場所／両認証情報の保持とnormal／Analysis前後response一致を確認。実本文は常体化が中心で、原入力との全体読取では意味変異を見つけていないが、現CMEEは3/3をpiece_model_meaning_unassessed_or_changedで拒否。保存／追加S7／同版画像0、通常採用は保留。全file／全仕様確認と一般編集品質・live接続・本人端末・正式受入れは未完。 [実原本・拒否位置・再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general3-344a-actual-20261112)。


> **11/12・先行する通常画像実証の履歴：** 研究36335452/run43146249187はattempt1・新同1method成功。両作品のpreview/saved/export全6frameで本文/native canvas/alpha/元8秒が成立し、手動ACKなしの閉要求→native ACK後遷移→saved mountと両actual export PNG一致を確認。実検証は研究363のsourceで、同じ製品2/単体2fileを今回通常Draftへ採用する。native harnessは採用せず、新normal headのCI成功は主張しない。既存474PASS（独立18含む）・full JSXも継承。STRUCTURE_MAP_DELTA_PRESENT。native581/guard/renderer/8秒不変、model selector OFF/重み未採用・旧V4失敗14→26は未解決。AR-04一般編集品質/実Auth/API/DB/本人端末・正式0/3/他ARは未完。 [既存natural観測の接続と現在地](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-normal-host-save-export-20261112)。

> **11/10・AR-04最新：** 引用内stopを持つ新4件＋保持GENERAL07の現builder送信messagesを固定し、13,140byte・2memberの無学習比較packetを準備。構文compile／CRC／member照合は成功、実モデル生成・送信・提供停止0。非環境の稼働確認はhealth200。起動環境全体の読取りは認証情報を含み得るとして自動承認審査に拒否され、未実行。新packet送信と、完全復元に必要な環境内再利用の具体承認待ち。API5816f2d0／f6dae研究候補・通常selector OFF・本番未反映を維持。 [具体packet・確認範囲・再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-quote-stop-inference-prepared-20261110)。

> **11/10・AR-04最新：** API5816f2d0で既存の引用対応文分割をPiece source／S7へ再利用し、一組の「」内の句点・疑問符・感嘆符を完全なKEEPとして保持。固定CPU4例は受付不可→採用、3plan計12保存／非生成再読。凍結実4B69照合行と、別照合した直近5応答の採否／本文／messagesは不変。Unicode空白の既存互換も保持。追加GPU生成／学習0、f6dae研究候補・通常selector OFF、本番未反映。 [引用内stopの実装・検証と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-quote-internal-stops-20261110)。

> **11/10・AR-04最新：** API2ec79ad0で時点付き本人「は」好み評価の同本人省略を既存S7継続へ接続。明示承認後、保存f6daeで新3＋保持2の実4B本文を1回・学習0で確認。GENERAL01の自然な2文目省略が旧比較で保留されたため、同block・隣接・同じ本人表記の既存条件だけを再利用し、5/5採用・3plan計15保存／非生成再読。保持2の前回request／raw／revisionと凍結69照合行の採否／本文／messagesは不変。9HTTP・97.268秒で元提供復元／health／前後control一致。f6dae研究候補・通常selector OFF、本番未反映。 [実4B新3・保存と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-model3-inference-result-20261110)。


# CMEE 補助経路の活用作業 — 詳細設計

> **2026-11-12・AR-02の採用仕様と実装現在地：** [Emlis問い・応答の決定](v1/02_emlis_v1a_detailed_design.md#emlis-question-policy-20261112)を構築仕様とする。全plan最大3問・source-bound問い／回答更新は§9.2の新natural候補、初期ON・本人別前回保持・入力保存時の受取選択固定は§9.3のAPI／RN候補へ接続した。二入力訂正のコード接続は後続§9.28、一般自由文の問い判断・実4B品質・通常提供／端末は未完。AR-04の既存実績は継承する。

## 0. 今回の決定と、この設計の責任

2026-11-08、Mashは、華恋が必要と判断した旧補助経路の能力・資産を、改修規模を理由に諦めず、使える形にして最大限活用することを承認した。先に挙げた数項目だけに対象を限定せず、必要な資産すべてを回収する。その実装・検証・接続を詳細設計し、GitHubへ保存し、後日の短い指示から継続できるようにすることが今回の依頼である。

本書は、その活用方法、移管先、変更箇所、実施順、完了条件、再開位置の正本とする。EmlisAI・Piece・分析構造の商品仕様、一般作業規則、GitHub反映契約を二重所有しない。現在の商品契約に合わせて旧能力を改修する。古い文型や5段packet・3本文を新natural応答の必須形式へ戻さない。

**目的は、現在の返答・作品・地図の意味保持と伝わり方を改善することである。** 原文や実行対象の取り違えを防ぐ既存能力、問題の共通原因を見つける知識、修正前後の比較、履歴・訂正・失効の扱いも、この目的に接続して回収する。回収は、既存symbolの直接利用、責務の移管、必要部分の抽出、検査例・失敗知識の移植、現owner内での再実装を含む。

元の承認・実行・証明を管理する外殻は現役経路へ戻さない。その中に使える比較・計測・再現入力の部品があれば抽出対象にする。「外殻を退役」と「内包する能力まで全廃」を同一視しない。必要な能力は規模で除外せず、不要な統制は規模に関わらず再開しない。

最初の設計保存時点では設計と参照導線のみで、製品実装等は未開始だった。その後Mashの続行指示でAR-01を着手した。現在の実装・実生成・不採用と未完了は§11を正本とし、最初の設計保存を活用完了へ換算しない。

## 1. 正本、確認版、現在の不足

### 1.1 読む原本

- [全体現在地](../../00_cocolon_current_product_and_state.md)、[current rules](../../work_attitude_rules_for_karen/CURRENT_RULES.md)、[恒久incident](../../audits/emlis_ai/Cocolon_EmlisAI_ProductNeglect_and_CMEE_ProductReadFailure_20260816.md)。
- [8/14 全体活用計画](../../Cocolon_Quality_Intelligence_Foundation_CrossCore_ApplicationPlan_20260814.md)、[旧32系列の監査](../../audits/emlis_ai/Cocolon_EmlisAI_安全装置全履歴_20260701_20260813.md)、[NLSv3→CMEE Disposition D01–D51](NLSv3_to_CMEE_Disposition_Phase1_20260817.md)。
- [CMEE Final Design](Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)、[詳細設計入口](v1/00_read_first.md)、[CMEE map](../../current_structure/04_cmee_current_structure.md)。
- [Emlis map](../../current_structure/01_emlis_ai_current_structure.md)、[Piece map](../../current_structure/02_piece_current_structure.md)、[Analysis map](../../current_structure/03_analysis_current_structure.md)。
- [最新weekly §17–19](../../weekly_reviews/Cocolon_Weekly_Review_20261107.md#three-core-quality-backlog-20261108)、[観測学習の目的](../../observation_learning/README.md#observation-learning-intent-and-assumptions)。
- Karen-Diaryと構造知識は判断の前提として照合する。私的会話を公開設計へ転載せず、日記や知識の存在を実装済み・学習利用許可へ変換しない。

調査固定点はCocolon PR30 `89a9594dbeb91668436f82b48832025bab49a0e1`、API PR3 `497f7008fec8935885d09d2e430499892189b5bb`。これは本書の確認版であり、後日の実行版を固定する命令ではない。再開時にfresh headと対象差分を確認する。mainが古い間は、mainだけから現在を判断しない。

### 1.2 現在の実利用と不足

API pathは、特記以外 `ai/services/ai_inference/` を起点とする。

本書の短縮名は次のpathへ解決する。文脈のない同名fileを新規作成しない。

| 短縮名 | repository内の場所 |
|---|---|
| `source_kernel.py`、`emlis_thread_source.py`、`emlis_thread_history.py`、`emlis_answer_update.py`、`emlis_question.py`、`emlis_stage1_*`、`piece_source.py`、`piece_v1c.py`、`piece_semantic_admission.py`、`preparation*`、`contracts.py`、`engine.py` | `ai/services/ai_inference/cocolon_meaning_experience_engine/`配下 |
| `cores/analysis/*` | `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/`配下 |
| `emlis_ai_*.py`、`emlis_thread_service.py`、`emlis_thread_store.py`、`emlis_thread_config.py`、`piece_v2_generation.py`、`analysis_cumulative_service.py`、`analysis_observed_service.py`、`analysis_semantic_map.py` | `ai/services/ai_inference/`直下 |
| `cocolon_text_generation_core/*` | `ai/services/ai_inference/cocolon_text_generation_core/`配下 |

| 現owner | 確認済みの接続 | 本作業で減らす不足 |
|---|---|---|
| `cocolon_meaning_experience_engine/natural_reply.py` | `prepare_natural_reply`→`admit_emlis_thread`→原文・履歴・本人回答の出所確認と独立Safety。`validate_reply`は型、source参照、非空、長さ、内部記号等を確認 | 現自由文の主体・対象・否定・時点・認識・留保を、完成した本文で意味比較する責務が未接続 |
| `emlis_thread_service.py` | naturalを`_process_natural`へ先に分岐。初回本文の保存・非生成再読。`_hydrate`は`related_context`を使用 | 旧Engineの意味更新・本文逆検査を通らない。新naturalでの任意問い／回答後更新／frame訂正と分析材料が未完。観測artifactは`analysis_state=NOT_GENERATED` |
| `source_kernel.py` | 旧`normalize_emlis_current_input`、`build_evidence_ledger`、原文locatorを実利用 | 原文位置の一致と、主体・否定等の解釈の正しさを区別したまま現出力へ生かす |
| `emlis_stage1_response.py`と旧grounded owner群 | 意味・計画・Sentence Surface・Reception・本文逆検査の責務継承あり | 専用文型／計画依存を分解し、現自由文へ適合。旧作者を第二の通常作者にしない |
| `piece_v2_generation.py`、`piece_source.py`、`piece_v1c.py` | CMEE Engine、旧意味ブロック、原文→plan→本文、独立意味保持検査を実利用 | 有限文法、単独伝達、補足を使うrefined、画像までの同一意味。既存画像・保存の成功は継承 |
| `analysis_cumulative_service.py`→`analysis_semantic_map.py`→Engine→Analysis admission/compiler/realizer | 4B関係mapをCMEE本体へ統合。通常保存・実機表示に到達した記録あり | 引用一致だけでは残る解釈誤り、本人基準・記録間関係・長履歴・補足訂正・IF/Saved |

履歴候補取得は現naturalで既に接続されている。「履歴未接続」と過去資料の文をそのまま使わず、関連候補取得と妥当な履歴理解の残件を分ける。source Safetyの存在を、完成本文の意味検査済みと呼ばない。

## 2. 回収の単位と採否

回収単位は「能力＋実装／知識／検査例＋現在の商品での用途」。file数やimport数を回収率にしない。旧32系列、D01–D51、8/14計画の各層を付録で照合し、同じ資産の重複計上を避ける。D51件は46責務・資産＋5判断／不足であり、51個の実装moduleとは扱わない。

| 処置 | 実施方法 | 完了の観測 |
|---|---|---|
| 継続利用 | 現ownerの実利用を維持し、後続との不足だけ修正 | 現呼出しと、同じ原情報からの商品結果が保たれる |
| 改修して移管 | 現目的へ合う比較単位・入出力・検査例に変え、既存ownerへ接続 | 現商品出力の誤り減少／更新成立、保存再読、必要回帰 |
| 知識・検査例として利用 | 旧失敗・変異・修正前後・比較条件を現在の教材／評価へ移す | 実モデル／作者を直し、再発と別題材への影響を確認。知識登録だけで閉じない |
| 内部部品のみ抽出 | 比較・計測・再現性の必要部分を使い、元のcontrollerを起動しない | 対象商品試行で取り違えや不要な再実行を防ぎ、実出力確認まで進む |
| 履歴保持・非採用 | 重複作者、旧運用chain、使わない方式をGit履歴に残す | 復活させず、採用した現ownerが明確。未精査を非採用理由にしない |

「必要な資産すべて」は本表を固定した短い選抜にしない。実装中に有効な旧symbol、失敗vector、比較器が見つかれば、本書の対応行へ追記して同じ商品単位で利用する。新しい独立台帳・scanner・承認段階は作らない。未精査symbolは未精査と書き、存在／全文理解／商品効果を分ける。

## 3. 共通の入力・意味・商品の条件

1. `memo`と`memo_action`の片欄／両欄、9カテゴリの複数選択、5感情それぞれの弱中強・同時選択を保持する。自己理解は通常感情と排他的で強度UIなし、wire mediumは互換値。欄名だけで実行済み行動を認定しない。
2. 本人／他者／引用者、行為者／対象／感情の所有者、事実／本人認識／推測／希望／予定／未実行／不明を分ける。記録日時を出来事時点へ置き換えない。
3. 原入力、適格な本人回答、訂正・撤回、本人frame feedback、閲覧権利内の履歴は別source。AIの問いは文脈、AIの応答・Piece・分析推定は生成物として扱う。
4. Free当回、Plus適格本人履歴、Premium本人frame・本人続行等の既存権利を継承する。原入力保存を生成成功へ従属させず、補足を新規入力数／国家event／課金へ再加算しない。
5. 原文一致・quote・hash・型成立は意味の正しさを保証しない。modelが自己申告したclaimや根拠refも検証前の候補である。
6. Emlisは本人宛、Pieceは本人の作品、分析は観測・解釈・IFの区別を持つ。共通化は意味と出所の必要部分まで。声・選択・作者・保存・公開の責任を各coreに残す。
7. 短い受取り・一度の言い換え・自然な省略を許す。文数、深さ、新発見、助言、問い、観測対フォロー比の固定を加えない。必要な意味を残す責任と、原入力全部を再掲する義務を混同しない。
8. source Safety、生成物の危険な断定・漏出、意味保持、商品としての自然さは別の判断。旧Safety ownerと公開境界を保つ。新意味検査で通常Safetyを解除しない。

## 4. 実装する責務と接続の形

### 4.1 現ownerへ組み込む構成

| 責務 | 入力／出力 | 実装先と境界 |
|---|---|---|
| 有効な本人sourceの確定 | 原入力・回答・訂正・撤回・権利→現在有効なsource集合 | 既存thread source/history/answer_update、Piece saved source、Analysis source adapter。modelに権利や有効版を決めさせない |
| sourceの意味候補と根拠 | source→主体・述語・対象・否定・時点・留保等の候補 | 既存意味ownerから使える抽出を回収。確定できない項目は未確定。原文位置だけから意味を確定しない |
| 生成 | 現sourceから本人宛本文／作品／map候補 | 現natural・Piece作者・Analysis compiler/realizerを使う。旧作者との二重通常生成を追加しない |
| 完成物の読み返し | 実際の完成本文／図→その出力が述べた意味の候補 | 作者のplanを正解としてコピーせず、完成物そのものを読む。有限reader／候補modelの限界を明記 |
| 比較と失敗局所化 | source意味と完成物意味→一致範囲・衝突・未判定 | 下記の限定された比較。誤り原因を教材・指示・意味owner・作者の修正へ返す |
| 保存と再読 | 採用した同一成果物と既存lineage | 現store・artifact・RPC。保存再読で新生成を行わず、旧確定保存物を黙って置換しない |

先に巨大な共通抽象APIを完成させる工程は置かない。Emlisで実商品改善と必要な共通責務を一緒に実装し、Piece／Analysisで二度目の実用途が成立した時に共有境界を確定する。旧回路を呼ぶだけのwrapperをCMEE統合と呼ばない。

### 4.2 比較に必要なprivateデータ

次は新しい公開DTOやDB schemaではなく、実装時に既存型へ対応させる論理項目である。新private型が必要なら現CMEE package内の最小型にし、persistent schemaへ無条件追加しない。

| 論理項目 | 持つ情報 | 注意 |
|---|---|---|
| Review context | core、元source集合と版／owner／権利、実本文と作者版、比較方式版 | 既存guard／source_prefix／artifact identityを参照。新しい証明chainを作らない |
| Meaning claim | source role、speaker、actor、predicate、arguments、polarity、time、modality、epistemic status、感情所有、scope、原文／本文位置 | 各項目に既知／不明と根拠。model推定を本人確認済みへ昇格しない |
| Comparison item | 比較対象、確認できた関係、衝突理由、根拠位置、未判定理由、検査対象範囲 | source/本文のどちらが誤った読取か未確定なら、確定衝突へしない |
| Comparison result | 判定、比較済み範囲、未対応範囲、source／本文の対応、実行時間 | 全体の品質点や一般正解率を作らない。機械所見は正式Product Readではない |

### 4.3 判定の契約

| 判定 | 意味 | 動作 |
|---|---|---|
| `CONFLICT` | 確認できたsourceと完成物の間に、説明可能な主体反転・肯否反転・時点改変・不確定の確定化等がある | 開発では原因を修正して正しい実出力まで確認。通常での拒否は実証済み範囲だけに限定 |
| `NO_CONFLICT_IN_CHECKED_SCOPE` | 明記した対応範囲では衝突を見つけなかった | 未対応範囲を併記。全文意味合格・安全・商品受入れとはしない |
| `UNASSESSED` | 読取未対応、意味が曖昧、比較根拠不足、補助処理の時間切れ等 | 誤りと断定せず、既存source／Safety／形式検査の判断を維持。分析材料の資格を付与しない |

どの判定にもcoverageを残す。部分比較の正常を全文正常へしない。source owner不一致、失効、改竄、認証・Safety不成立は`UNASSESSED`へ弱めず、既存ownerで拒否する。比較器が意味を読めないことと、元情報が不正なことを分ける。

モデルによる読取候補だけで通常応答を強制拒否・自動修復しない。同じmodelの生成と自己説明が一致しても独立の正しさは成立しない。機械で確定できる範囲、候補判定、人間の原文／本文読解を分ける。

### 4.4 比較する意味と、正常とする差

| 境界 | 検出する意味変化 | 正常として保護するもの |
|---|---|---|
| 主体・所有者・引用 | 他者の経験を本人へ、本人推測をEmlisの事実説明へ移す | 省略しても指示先が明確な文、直接話法と間接話法の妥当な変換 |
| 否定・述語・scope | 行為未実行を予定未定へ変更、現在否定を肯定へ変更、否定範囲の移動 | 同じ否定を自然に言い換える、返答で触れない出来事を省く |
| 時点・変化 | 記録時刻への置換、事前認識を事後認識へ、再参加を初参加へ | 元の順序を保つ文統合、出来事と現在の受取りを区別する |
| 認識・不確定 | 「そう感じた／まだ不明」を確定事実・確定因果へする | 原文の留保保持、Emlisの受取りとして明示する範囲 |
| 関係・因果 | 共起だけから原因・約束・義務・人格を作る | 原文にある理由・条件・対比、原文が確定しない両立 |
| 感情・強さ | 本人の選択と他者感情を混ぜる、複数感情を一つへ固定 | 選択と本文の時点差、自己理解の互換medium、全感情を毎回列挙しない自然さ |
| 受取り・声 | 本人の内語をEmlisの返事として貼り返す、一般共感の反復 | 短い受取り、必要十分な言換え、問い・助言を出さない返答 |

旧文型への一致は補助情報にとどめる。旧二段見出し、行数、anchorの字面、固定のEmlis文句を新naturalの合格条件にしない。未出力の項目は、各coreが実際に必要とする意味の欠落である時だけ不足へ数える。

### 4.5 読取・対応付け・比較の処理順

1. source側は、admission済みの完全な原文から、旧`SemanticFrame`、`EvidenceRef`、proposition等を使って候補を作る。原文の逐語位置、項目ごとのspeaker／actor／time／否定scopeを保存する。有限parserが確認した範囲、人間が確認した教材上の範囲、model解釈だけの範囲を混ぜない。
2. 出力側は、完成した本人宛本文の各文・節・引用を読む。元の作者planから同じ意味をコピーしてreader結果にしない。二人称、省略された本人、Emlisの一人称、引用者を解決できる範囲で分け、複数解釈なら保持する。
3. 述語・対象・scope・時点・参照先の対応候補を列挙する。単語共通数だけで一つに決めず、対応先が一意でない時は未判定にする。同一原文の別sourceや、別時点の同じ表現を混ぜない。
4. 対応した各意味軸を比較する。主体・対象・時点を揃えた上で肯否等が両立しない時にだけ`CONFLICT`。単に根拠が見つからない、文法未対応、意味が省略された、という理由で確定衝突にしない。
5. source側の未出力範囲と、出力側の未評価命題を別coverageにする。未出力が商品固有の必須意味であれば不足として修正へ戻すが、短い受取りに全文再掲を要求しない。
6. 対応済みの純粋readerでは、同じsource・同じ本文・同じ方式版から同じ比較結果を返す。random IDや実行日時を意味判定に使わない。時間切れ時は終わった範囲だけを報告する。

例として、「参加しなかった」から同じ主体・対象・時点の「参加した」は確定衝突にできる。一方、不安と期待が書かれた入力への不安だけに触れる返答は省略であり、反対の断定ではない。「期待はなかった」と実際に述べた場合は別に比較する。以前と今の気持ちは時点が違えば併存できる。

旧`guards/grounding.py`、`must_keep_coverage.py`、`template_echo.py`等の字面・ngram・類似・反復の知識も抽出対象とする。ただし、原文類似度が低いから意味不一致、高いから意味正解、とはしない。正常な短い受取りを一律復唱FAILにせず、実本文と集合の反復傾向を読む。

## 5. Emlis自然応答への実装詳細

### 5.1 最初の変更位置

- `natural_reply.py::prepare_natural_reply`：既存admission・Safetyを保ち、現入力材料を意味比較にも同じ版で使う。sourceの全内容を本文への再掲義務へしない。
- 同`validate_reply`：現形式契約を維持する。形式検査と意味比較を別責務とし、既存返却型を不用意に変えない。
- `emlis_thread_service.py::_process_natural`：完成candidateを形式確認した後、OBSERVATIONを確定する前に比較する接点。比較を通ったと偽るreceiptを作らず、既存受領候補と採用済み本文を区別する。
- `source_kernel.py`、`emlis_thread_source.py`、`emlis_answer_update.py`：原文根拠・source role・有効版の既存owner。旧grounded plan／surface／gateから必要な比較・reader・vectorを抽出する。

候補private関数は `compare_reply_meaning(context, reply)` 相当。名前・型の最終形は実装時に既存責務と照合する。これは新service、外部API、常駐checkerではない。重複する現helperがあれば改修して使う。

### 5.2 開発適用から通常適用へ

1. 現提供版と、現在残る誤読／正常例を同じsourceで生成・保存する。旧失敗群と現6境界、既にCPU準備された語順／二欄8教材を再利用する。旧36教師と保存候補の由来を保持し、未採用候補を通常重みにしない。
2. 旧資産から比較責務を入れ、誤りだけでなく正常な省略・言換えも読む。誤検出と見逃しを原文・本文から分類する。readerの指摘が誤っている場合はreaderを直す。
3. 検出した共通原因を、既存教材・指示・意味owner・作者へ戻して修正する。検査を厳しくして無出力が増えただけでは終了しない。修正後の実返答と既成功の保持まで同じ単位で確認する。
4. 実証済みの検査範囲だけ通常保存前へ採用する。追加model callが必要な方式は、まず既存試行の中で比較し、精度・誤拒否・時間・費用を測る。未実証の自由文readerを通常全件の必須条件へしない。
5. 採用版で保存した同じ本文を非生成再読する。旧completed保存物は当時版のまま読み、現checkerが増えたことを理由に一括再生成しない。

通常のcandidate生成数は現行どおり1、追加model callは既定0。候補比較／多様性／tournament資産は開発時の明示された有限比較へ先に使う。通常で複数生成する採用は、具体的な品質改善と既存応答期限・費用内での実証がある場合だけ行う。暗黙の無限再生成や別provider fallbackは追加しない。

### 5.3 中断・保存・失敗の扱い

- 受領済みcandidateがある再開では、同じsource／contextを確認し、純粋比較だけを再開する。model HTTPを再送しない。受領記録を意味合格と解釈しない。
- 比較結果を将来永続化する必要がある場合は、既存private OPERATION等の保存先と版互換を先に確認する。新table・RPC・公開fieldは本書から自動作成しない。未保存所見を過去に実施済みとしない。
- 通常強制拒否を導入する際は、確定衝突だけ既存の失敗／未生成処理へ対応させる。入力保存・既存の保存応答は保護し、generic filler、旧template、本文の改竄を代わりに返さない。
- 未対応文法・曖昧さ・比較予算不足は、そのscopeの`UNASSESSED`として記録する。source認可・Integrity・Safety・形式エラーは従来のエラーのまま伝播させ、広いcatchで未判定へ弱めない。予期しない比較器の不具合は、privateな`CHECKER_ERROR`等の別理由で未実施範囲とともに残す。比較成功や全文正常の件数へ含めず、比較器の修正対象にする。例外本文や本人原文をlogへ出さない。
- 現在のprovider timeout、thread deadline、残時間予約を尊重する。比較のため新しい待ち時間を無条件上乗せしない。候補model方式の通常採用前に待ち時間とGPU競合を実測する。

### 5.4 保存reportと時間の実装契約

private reportを保存する場合の最小情報は、既存`source_prefix_ref`／`context_ref`、materialとreplyのdigest、比較方式版、参照したsource dependency版、各claimの本文位置・根拠・評価軸・判定・理由、source／reply各coverage、未判定理由、実行時間である。既存identityで表せる項目は参照し、別の恒久証明系列を作らない。本人ID／原文／本文をpublic logへ出さない。

現readerは受領したreply辞書を`NaturalReply(**reply)`として再構築するため、新reportをその辞書へ任意keyとして混ぜない。既存private payloadのsibling等へ置けるかRPC／serializer／再読で確認する。採用時は同じsource・context・replyに対応するreportと本文を既存commit境界で保存する。古い保存物にreportがなくても、破損や意味検査済みへ読み替えない。

調査版の自然応答providerは240秒、service attemptは270秒、保存用の残時間予約は既存3秒。これらを本書で延長しない。実装では現在のdeadlineから保存余白と比較予算を引き、providerや比較に使える時間を計算する。CPU比較の予算値は実測で決め、正規化・認可・guard確認を予算不足で省略しない。新readerの時間、追加call数、誤拒否／未判定は未測定である。

## 6. 本人回答・訂正・履歴と分析材料

### 6.1 問い・回答・訂正の一往復

**2026-11-12採用決定：** [全プラン最大3問・問い設定・回答後応答](v1/02_emlis_v1a_detailed_design.md#emlis-question-policy-20261112)を構築仕様とする。旧Free／Plus 0..1、Premiumだけ0..3の制限は今後の目標として置き換える。元入力1件のthreadで全plan最大3問、一問ずつ必要性を見直し、0／1／2問でも終了する。無制限にはしない。

入力画面の「感情通知を送らない」近くに「Emlisからの問いを受け取る」を置き、初期ON・前回選択保持とする。OFFは今回の問いを出さず応答する設定であり、既存の履歴参照や保存済み本人補足の取消しではない。保存先・端末間等の具体的保持方式は既存入力／設定ownerへ適合させる。

旧Q1/Q3の問い・skip・終了・本人続行・訂正・撤回・frame処理を回収し、現naturalへ接続する。問い機構を新設せず、短い受け止め→重要な一点→本人回答から必要時次問／十分なら応答という順序へ改修する。初回や各roundで完成した全文応答を先に出すことを前提にせず、問い前後の全文比較を目的にしない。

旧解釈、本人の肯定／修正／否定／撤回、新有効意味を比較し、訂正された対象だけ更新する。訂正に含まれない出来事・時点・感情を消さない。訂正の対象が曖昧ならmodelだけで全過去を失効させず、残枠と本人選択の範囲の一点確認／不明保持へ戻す。無効になったsourceからのclaimや問いを現在へ再利用しない。

設計採用時のnaturalは初回FINAL／COMPLETEDだったが、§9.2の新Q3 natural policyでは既存source-bound question／answer ownerを現作者へ接続した。公開設定と保存入力への固定は§9.3へ接続した。以下は採用した処理の責務であり、通常反映・一般自由文の問い判断・実4B品質まで成立したとは扱わない。

| 操作・判断 | AR-02で実現する処理 | 既存接続先／状態 |
|---|---|---|
| ONかつ重要な不足がある | 短い受け止め＋一点の問い。対象・根拠・残枠を既存候補／bindingで扱い、完成した全文応答を必須にしない | QUESTION event、AWAITING_ANSWER。受け止め／本文／質問の表示・保存契約は既存ownerで具体化 |
| OFFまたは問い不要 | 有効な本人材料から応答し終了 | 既存OBSERVATION保存、COMPLETED |
| 本人が回答する | 元入力と別ANSWERを保存し、意味を更新。回答で次の問いの必要性を選び直す | ANSWER→REFINING。十分なら応答、重要な不足と残枠があれば本人続行の次問 |
| 全planの次の問い候補 | 回答ごとに必要性と残枠を見直し、本人が続ける／終了する選択を保つ。既回答の聞き直しや3問固定進行をしない | 既存continuation_question／AWAITING_CONTINUEを接続候補とする。毎問に別continue操作を必須にするかは現UIと整合して具体化 |
| skip／本人終了／3問到達 | その時点の有効な本人情報で応答。不明を埋めず、終了理由を区別。skipの言換え再質問・本文に隠す4問目なし | 既存終了処理を適合。旧初回本文を残すだけで新仕様の応答成立とは扱わない |
| 訂正／撤回 | 既存更新ownerを使い対象sourceと残る意味を確定 | 既存の更新・失効・再読境界を維持 |

有効意味checkpointと有限source-bound問い、短い受け止め／回答後応答の保存・DTOは§9.2、公開の設定保持は§9.3の候補へ接続した。一般自由文の問い判断と完了後の二入力訂正は引き続きAR-02で扱う。旧有限checkpointを全自然応答の必須入力にしない。既に保存されたNaturalReply／QUESTION／ANSWERを壊さず、旧clientでの読取・本人境界・再開を確認する。

確認材料には0問、1／2問終了、3問、回答で次の焦点が変わる例、OFF／skip／終了、上限時の不明保持、初期ON／前回選択保持を含める。問い文の自然さに加えて、問いを出す必要性・終了判断を確認する。採用決定の架空3問例は華恋作の説明例であり、Mash逐語教師や実4B成功へ換算しない。

#### 2026-11-12 採用 — 応答後の具体的な本人訂正

[Emlisの仮説・訂正方針](v1/02_emlis_v1a_detailed_design.md#emlis-interpretation-correction-20261112)をAR-02の構築へ追加する。本人への表示は「どの内容ですか？」と「どう違いましたか？」に分け、対象と本人の説明を受け取る。「違う」だけや説明任意では訂正完了にせず、不足点を確認して、モデルが本人の正しい理由・意図を補わない。説明が足りない間は訂正内容を未確定とし、否定された読みを確定した本人特徴として再利用しない。

原入力、AI解釈、本人訂正を分け、説明が示す範囲で読み直し、訂正されていない意味を残す。保存だけで完了にせず、後続応答への有効参照・失効と再読まで既存ownerへ接続する。旧Q1/Q3の補足・撤回やPremium frameの資産は回収対象だが、現naturalの完了後に任意の本文誤解を指摘し直す経路が既にあるとは扱わない。

新導線は設計決定の記録段階。先の全plan最大3問、初期ON・前回選択保持、問い前に完成全文を要求しない順序は維持する。11/12の対話だけでは具体化していなかった対象・保存／API・再生成・問い上限／プラン境界は、11/13の判断委任に基づく§9.28で構築方針へ具体化した。

### 6.2 履歴の関連性と版

現`related_context`と保持期間・件数選択を継承し、P5／P6の連続性・差異・未確定・版比較を、今回に関係する意味を読むために使う。キーワード一致を同じ場面・同じ役割・同じ気持ちの証明にしない。履歴言及率を上げることを目的にしない。

本人切替、権利変更、削除・秘匿・撤回、source guard変更時は、現在の利用資格と生成前の版を既存ownerで再確認する。取消済み材料をcacheから再利用しない。保存済み作品／月次の当時性と、現在表示の再認可はそれぞれの既存契約を保つ。過去保存物の消去や履歴の書換えを本作業から自動実行しない。

### 6.3 Emlisから分析への材料

新naturalの`NOT_GENERATED`を、本人sourceから根拠を持つ観測材料を生成できた時だけ更新する。Emlisの返答を再解析して本人の事実にしない。引き渡すのは原入力・適格本人補足・有効な訂正と、根拠・未確定・source roleを保った意味候補である。

限定意味比較reportができただけでは`analysis_state`を更新しない。実際の意味材料artifactのschema・参照・生成成功を確認する。意味材料の生成状態、Analysis mapの生成・保存状態、比較reportの有無は別である。現thread.dataとOBSERVATION.artifact双方に関連状態があるため、将来変更時は同じ保存境界で整合させる。

Analysisの既存source adapter→semantic admission→compiler→唯一realizerへ渡す。元記録ID／版／owner、両欄、カテゴリ、感情と強度、時点、否定・留保、解析済み／未解析範囲を保持する。原文引用が一致しても、ROLE／判断／選択／因果の解釈は別に確認する。

材料生成が失敗しても、保存済み入力や自然応答を失わない。分析は未生成／未解析を保持する。独立したAnalysis通常経路が有効な時、Emlis材料の全面完成待ちにしない。EM-04とAN-02／08のsource責任を一致させる。

## 7. Piece・分析へ適用する詳細

### 7.1 Piece

**11/12・新しい一般材料の実4B確認：** 稼働中base4Bで架空の段落／二欄／適格refinedの3件を一回実生成し、全3が原文維持だった。CMEE／S7・隔離Free保存／再読は成立したが編集改善0、保存344a・live Auth／DB／端末の成功ではない。保存候補の同じ独立材料3件は、その後の承認済み一回で実行完了した。現CMEEは全3件を未評価として拒否し、保存／同版画像へ進めていない。次は実rawと原入力を固定し、既存意味読取・S7の未対応箇所を保全条件に沿って扱う。未評価節への一括語尾置換で採用を通さない。全file／全仕様の確認は継続中とし、古い状態表だけで全体進捗・終了日・未実装範囲を断定しない。 [実原本と次の比較](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general3-base-actual-20261112)。

**11/12・動作文に続く同本人評価の省略読取：** 既存private `_piece_model_read_block`の、同block内の明示SELF継続・同じ本人表記を確認済みの分岐で、既存 `_piece_model_evaluation`を再利用する。評価対象「読書が」を汎用subject判定が別の主語として拒否する前に、完全な既存評価文法で読む。不成立なら従来のsubject拒否／feeling・finite処理へ進む。sourceの全節明示SELF資格とsource／本文の全key比較を維持し、一時読取viewをrawや確定本文へ書き戻さない。FOCUSの「が」や価値評価の「にとって」は補完しない。新文法・作者・prompt・S7・公開型／DB／通常selectorの変更はない。合成CPUの誤拒否修復であり、実4Bの品質改善実証ではない。 [実装・検証](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-model-evaluation-continuity-20261112)。

**11/12・通常画像経路とV4の責務：** `pieceLayout.js`のios.v1/v2はbitmap profileへ写像され、`PieceVisualCard`のfixedRaster→`inspectBitmapDrawing`→`renderBitmapCanvas`を使う。V4 `inspectSelectedLineV4`の自然snapshotはこの通常経路の必須条件ではない。API `_preview_renderer_runtime`のrenderer交渉と`piece_model_source._settings/application_piece_model_source`のmodel選択も別である。bitmapの証拠をV4自然layer/reference logical1 exactの証拠へ換算せず、V4固有の能力は未解決・未採用として残す。共有v5/TextKit/paint/予算と今回V4前の初回timeoutは通常側にも関係し得るため残件とする。

**11/12・次の直接実証：** 研究36335452/run43146249187はattempt1・新同1method成功。両作品のpreview/saved/export全6frameで本文/native canvas/alpha/元8秒が成立し、手動ACKなしの閉要求→native ACK後遷移→saved mountと両actual export PNG一致を確認。実検証は研究363のsourceで、同じ製品2/単体2fileを今回通常Draftへ採用する。native harnessは採用せず、新normal headのCI成功は主張しない。既存474PASS（独立18含む）・full JSXも継承。STRUCTURE_MAP_DELTA_PRESENT。native581/guard/renderer/8秒不変、model selector OFF/重み未採用・旧V4失敗14→26は未解決。AR-04一般編集品質/実Auth/API/DB/本人端末・正式0/3/他ARは未完。 58b62ffcの失敗は履歴として保持。36335452の実native ACK順序と6frame成功を回収し、同じ製品2/単体2fileを通常Draftへ採用する。次は一般編集品質と同経路の実Auth/API/本人端末を既存要件に沿って確認する。

**11/10・API1ce24b8c／全文有限動作の生成条件：** `piece_model_source._source_action_constraint`は、既存`piece_source._finite_self_person_action_account`の全文資格と`natural_reply_meaning._clauses/_FORMS/_arguments`の一意な完全節読取を再利用する。各source partの全sentenceが既知の明示SELF・頼む／相談する／伝えるの事実過去として成立した場合だけ、欄別`control.authoring_constraints.field_slots.<key>.required_actions`へ本人表記、原文活用形／述語、肯否、時点、事実性、voice、相対日、格と相手／対象、scalar範囲を渡す。その適格partの受動文を含むfieldでは、各有限eventへ原文source_literalと既存MeaningWitnessのsubject／agent／counterpartを同じfield／scalar範囲へ追加する。同fieldの能動eventにも固有の役割を対応させ、同partの別fieldは独立させる。役割は否定された述語内の関係であり、依頼の実在、本人の拒否／承諾、対象作業の実行は推論しない。active-only fieldは旧wireを保持する。評価・感情・opaque文・未決定を含む混在partは従前の送信内容を保持し、既存の名前・評価条件も失わない。原requestからのPreparedRequest再導出一致、原入力7fieldと本人の補足の分離、SYSTEM、条件なし既定送信bytes、独立採否／S7、保存後非生成再読、公開DTO／DB、selector既定OFFは維持する。期待正文、生成後修補、新しい受理文法、別作者は追加しない。

**11/9・混在本文と欄／補足の語り手：** 旧S7の全part・source／plan／欄境界と、既存有限本文readerの完全key比較を同じKEEP検査へ接続。明示SELF・単一の既知能動事実過去だけとし、該当nodeの名前・参照・scopeを迂回しない。原文保持のopaque文と、別欄の意味を保った語尾編集を併用する。通常nativeのliteral条件と公開契約は保持。欄先頭／本人補足の語り手と公開役割は独立教材で候補修復し、意味退行を拒否・未採用のまま記録する。

**11/9・名前抽象化と過去2動作の独立読取：** 原文の明記役割を学ぶ新24行で作者候補を改修。旧body inverseの本人継続と既存finite活用／格の必要部分をPiece完成本文の読取へ移し、単一欄・明示SELF・2能動過去・一つの読点を全節照合する。肯否は動作ごとに保持し、別本人／条件／受動／非過去／別欄借用は拒否する。原文・期待正文・raw・採否閾値を緩めず、結果は§11とtrialを正本とする。

**11/9・原文から成立した生成条件の回収：** 原requestと再導出したPreparedRequestの完全一致を確認し、既存本人評価frame・公開役割bindingをsource／欄／scalar位置を保持したprivate `control.authoring_constraints`へ投影する。原文・SYSTEM・期待正文・採否検査は変更せず、sourceの意味条件だけを作者へ渡す。設定された4B providerに限って通常preview／共有初回取得へ接続し、未対応は条件を捏造しない。独自callback、同key共有、保存後非生成再読、selector既定OFFは維持する。実効果・限界は§11と既存trialへ記録する。

**11/9続行・本人の一人称と評価対象の伝達：** 変更は既存private model reader・その一人称検証・既存workflowを起点とする。`piece_model_source.SYSTEM_MESSAGE`の追加2指示は比較で不採用となったため完全撤回し、元ad417と同じSYSTEMを維持する。private model readerは意味上のactor=SELFを維持したまま、各欄に書かれた一人称を別の比較要素として保持する。同一欄の既に成立した本人継続でだけ、その直前の本人表記を省略読取へ用い、別欄からの本人表記借用・raw補修はしない。評価対象「は」の受理文法は拡張しない。公開型・DB・source資格・原入力／補足・S7／native経路の既存保護境界は変えない。 既存FOCUS文法が認定する原語順と終端copula組、およびnativeで成立済みの明記した同本人の隣接自己評価の主語省略を、model private読取へ限定接続した。native既定の意味保持契約は不変である。参照先・全scope・本人視点・元一人称・評価base／程度／肯否／時点／留保を独立照合し、先頭省略・にとって脱落・別field・OTHER・異なる本人表記・肯否変更等は拒否する。既存evaluation-reuse testの同作者省略を常時拒否する1期待だけを、このnative由来の正期待へ整合させた。同じ新22rawは16→20採用、旧22rawは最終readerでも16採用。未知の語義や意味欠落を許可する差分ではない。

#### 2026-11-09 Piece 4B接続の実装差分（今回の実装正本）

Mashの「Pieceでも4Bを使う」指示を通常生成の候補取得へ具体化する。保存済みsourceを確定した後、既存共有4Bのnatural/base経路から文章候補を一度取得し、CMEEが原入力・本人補足と本文を独立に照合してから既存B8→Safety→B9→preview／saveへ渡す。4Bは候補を作る責務、CMEEは採否と確定本文を作る責務を持つ。旧作者との文字列完全一致はmodel候補の採否条件にしない。旧P4 offline受口とmodel未選択時の既存作者は互換用の別armとして保持し、model失敗時に旧作者へ切り替えない。

- private入力は既存`PreparedRequest`、受領は`CandidateReceipt`、接続は`PieceModelInputV1`を使う。原入力7fieldと、本人が明示選択した適格な補足回答を別sourceに保ち、`block_partition`で各本文blockのsource／field対応を固定する。公開request／responseとDB保存列にraw、prompt、token、内部判定を追加しない。
- `piece_model_source.py`が専用promptを既存`EMLIS_NATURAL_REPLY_*`接続へ送る。現在は明示`candidate_format=piece.field_slots.v1`で`field_blocks`を受領し、serverのpartition順で既存canonical body_blocksへ投影する。旧format=Noneのbody_blocks受領は旧private互換として保持し、新providerからのfallbackにはしない。旧Q&A composer、180文字切捨て、Emlis二段応答prompt、Analysis専用adapterを使わない。モデルはformat／プラン／権利／Safetyを決定しない。選択は`PIECE_MODEL_SOURCE=shared_4b.v1`、未選択はOFF。設定追加のlive反映やGPU再起動はこのコード更新の実施実績に含めない。
- 最初のadmissionは`short_essay`一形式と、source／本文を全節読める有限範囲に限る。主体・相手格・voice・述語・否定・時点・条件／留保・感情所有を照合し、既知の丁寧体差・節順・閉じたSELF省略等を許容する。既存S7が原文KEEPを全量確認できるblockはその責務を再利用する。未知の書換え、欠落、追加、読み残しは未判定／不採用。一般自由文の意味同値が成立したとは扱わない。groundingやモデル自己採点だけで採用しない。modelではeligible_formatsをshort_essay単独とし、author-free Safetyも全文意味保持が成立するその制限を許容する。未選択時の既存format候補一覧は変更しない。
- B8とauthor-free Safetyは同じ完成本文の意味保持境界を確認し、保存済み本文の再読、画像設定変更、save再送では4Bも旧作者も呼ばない。既存owner／current版／補足資格／hash／recipe／SQL fence／quotaを維持する。生成後にもsourceを再検証する。
- 初回同一owner・idempotency keyの並行処理は既存service内の一時in-flight共有に閉じる。同じrequest／source／runtime設定だけ候補を共有し、異なる指紋は競合にする。各待機者の認証・source・現runtimeを再検証してから保存へ進む。DB予約、永続cache、新controllerを追加しない。cancelした待機者へ結果を返さず、全待機者cancel時は取得を中止する。
- 共有GPU待ちを含む取得期限240秒、推論上限2048token、context8192、temperature0、非stream、thinking無効、送信64KiB／受信256KiBまで。既存shared lockの待ちと推論時間を区別する。RNの初回preview POSTのみ250秒に合わせ、source取得・再読・PATCH等の通常期限は保持する。自動再試行、別モデル／有限作者へのfallbackはしない。
- 実検証は原入力→raw出力→採否→確定本文→保存／再読をprivateに対応づけ、正常な旧作者と異なる文と、主体／否定／留保／版の変異を確認する。既存有限Q2材料、合成provider、実4B、隔離SQL、native画像、本人端末の実績を分けて記録する。モデルrevision／usageが実応答に無い場合はunknownとし、推定で埋めない。

**11/9続行・本人評価readerの回収：** `piece_v2_content_policy._piece_model_evaluation`から、既存`cocolon_meaning_experience_engine.piece_source._personal_evaluation_shapes`の本人視点・構文・対象・評価base・程度・肯否・時点・留保を再利用する。大切／大事／重要／必要／好き／苦手の既知表現で常体／丁寧体、同じ明示SELFの倒置を照合する。既存source／plan資格は拡張せず、評価主体省略・実名／参照・条件／時点scopeはこの経路で緩めない。全文の外側一致と既存frameのspan一致を必要とし、内側評価だけを拾って追加された条件／理由を捨てない。既存S7、source partition、receipt identity、Safety、保存のownerを保持する。新model reader call、schema、service、通常promptの変更はない。一般意味同値の完成ではなく、既存能力の未接続部分を同じ商品境界へ接続した差分である。

以下の従来記録でいう「現行／次」は上記実装前の状態を表す。今回の実装結果・接続の有無・未反映は§11とcurrent structureへ差分更新する。

**11/9続行設計・欄名付きprivate候補：** literal併記だけの送信案は実4Bで二欄結合が残り不採用。既存`preparation.receive_candidate(candidate_format=...)`の明示形式→canonical候補投影をPiece専用receiverへ適合する。`piece.field_slots.v1`をprovider側が選び、原入力・PreparedRequestを維持した送信viewへ、partition順から決めた`memo_0`／`memo_action_1`等とexact原文・出所を提示する。モデルrawは`field_blocks` objectだけとし、重複・不足・余分なslot・空値・別形式を拒否した後、serverのpartition順で既存body_blocksへ投影する。rawは無修正、slotラベルを本文に足さず、本文の同値は既存CMEEが独立に検査する。旧format=Noneのarray専用受領と旧receipt bytes、保存済み非生成再読を保持し、新旧形式の自動判定／fallbackをしない。公開DTO・DB・作者・取得回数・Emlis／Analysisの生成方式は変えない。設計・実装・実4Bの実効果を分け、結果は§11.2と既存trialへ戻す。

**11/9編集計画併記案の結果：** 既存native duty／source spanだけを明示private guidanceへ投影する案を、旧入力との3組6実callで比較した。全3組本文同一で整形改善が無く、通常service／prompt／schemaへの差分は撤回した。実験の成立と商品品質の改善を区別し、未採用patch／rawを既存private原本へ残す。

**11/9続行設計・生成時の欄完全性：** 既存`serve_emlis_natural_reply.py`のAnalysis用LMFE／token maskを、明示private `candidate_format=piece.field_slots.v1`のPiece profileへ適合する。原入力と別本人回答の全材料・promptは維持し、requestのfield_slotsから必須key集合と追加key禁止・自由な非空stringのshapeだけを導く。原文や旧作者正文のenum・欄別追加推論・raw修補はしない。通常natural／Analysisを変更せずPieceだけ同じbase・2048token／8192context／既存期限で1回generateし、実適用markerをresponseで確認する。旧serverの無視・未知format・適用marker欠落は採用せずfallbackなし。生成制約は欄完全性だけを担い、各値の混入・意味・空疎な作品は既存receiver／CMEE／S7が独立照合する。実runtimeで同じ旧失敗材料とcontrolを比較し、形式成立と本文採否を分ける。必要な提供コード更新は同じ重み・adapter・秘密を保持した1回の差替えとし、既存応答の回帰を確認する。

**同単位の生成順比較：** 必須欄制約だけでは元NOW例のmemo内混入が残ったため、既存LMFEの`force_json_field_order`をPieceに限り使用し、補足欄を先、原欄をglobal index順として比較する。schemaのproperty／requiredは入力objectの順に依存させない。自由本文・全source／prompt・一回generateは保持し、出力key順は公開canonical本文順へ影響させない。これは追加推論や本文修補でなくtoken maskの生成順制御であり、既存CMEEが意味を独立確認する。同じ重み・設定での2回目の差替えとし、成功前に欄混入の解消と認定しない。

**11/9続行・本人補足の相対時点感情：** 現回答ownerの`_THEN/_FEELING`をPiece supplemental読取へ接続する。完全明示SELFの感情文でのみ時点prefixを認定し、`piece_v1c`の参照例外はそのprefix内へ限定する。原文・evidenceと相対時点を保持し、絶対日時への推定／prefix削除をしない。model本文の意味比較にもTHEN全文を保持し、NOW化・時点やは／もの変更を拒否する。通常原入力や任意の指示語の資格、QUESTION／ANSWER／RESOLVED ADD／currentの保存fenceは変更しない。

**2026-11-09 Mash明示：Pieceでも4Bを使って処理する。** 現行通常／refinedのB8は4Bを呼ばず、CMEEの有限読取・plan・既存作者とcanonical完全一致検査を通る。既存Emlis／Analysisの4B接続を、そのままPiece接続済みとは扱わない。次のAR-04は、既存Piece semantic_input／prepare_piece／候補受領・保存再読の必要部分を改修し、4Bの意味整理・文章候補をCMEEの採用／意味保持検査へ渡す接続へ進める。現在のoffline受口は限定構文中心でrefined未対応、B8は旧作者との完全一致を要求するため、4B本文を差し込むだけでは成立しない。本人補足の分離、owner／版／current資格、Safety、preview／save再送、同版本文・recipe・画像化とRN選択は継承する。有限規則・検査の必要部分を改修して使い、全再実装へ戻さない。今回の方針確認時点でPiece4B実装・GPU生成・学習・live反映0。


`piece_source.py::build_piece_source_meaning`、`piece_v1c.py`の既存plan／唯一作者、`piece_v2_generation.py::generate_piece_candidate`と独立`validate_source_meaning_preservation`を改修の起点にする。旧意味ブロック・語彙／scope・参照先の知識から、一般本文の対応幅と単独伝達を改善する。

本人の核・背景・条件・否定・引用主体を保ち、人物名の抽象化で命題を変えない。原文KEEPを機械的成功へ数えるだけで終わらせず、その作品だけで伝わるか読む。通常感情／自己理解、片欄／両欄、original／適格refinedを扱う。補足を使った場合は元と補足を別sourceとし、生成物をsourceに戻さない。

文章と画像は、採用されたcanonical本文・同版recipe・同一bitmapの対応を確認する。文字欠け、順序、留保の脱落、誤った本文への画像差替えを見逃さない。画像内ブランド、配色・比率・ロゴ権利、保存／再読／写真保存の成立資産を継承する。今回の承認済み4B候補経路をこの既存境界へ接続する。Android等の未成立部分を今回成功へ含めない。

**11/10・同版画像の実結果：** RN54113b85の既存実RN／iOS simulatorでc634の通常3作品＋refined1作品の16PNGが作品内一致。今回のtest fixture接続とFree palette補正は製品renderer／作者・DB・公開契約を変えない。旧WholeCanvas／V4検査失敗と、通常統合／本人端末・一般品質未完を保持する。詳細は[同版native結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-c634-native-same-version-20261110)。

### 7.2 Analysis

**11/12採用：** [Analysisの仮説・本人訂正](v1/04_analysis_v1d_v1e_detailed_design.md#analysis-interpretation-correction-20261112)をAR-05/06へ追加する。項目・関係線を対象に「どの内容ですか？」「どう違いましたか？」を分け、本人の具体説明から読みを見直す。原記録編集・根拠参照・単なる分析更新とは区別し、対象と訂正内容が特定できない間はモデルで埋めない。現在の理解と、書き換えない月次当時版を区別し、原入力・AI解釈・本人訂正の出所を保って後続分析へ接続する。11/14、現在mapの二入力訂正・対象版束縛・保存／再入場・更新queueと次回分析材料への導線を実装し、通常DB／APIへ反映した。月次当時版と独立した本人説明を保持する。一般訂正理解・配布／本人利用は未完（§9.62）。

`cores/analysis/source_adapter.py`、`semantic_admission.py`、`intent_compiler.py`、`observed_route_realizer.py`を現ownerとする。旧source・根拠台帳・grounded plan・関係方向・unknownの知識を回収し、4B意味候補の誤りと図の対応を改善する。application側に第二のmap作者を作らない。

確認対象は本人／他者、役割、注意・判断・選択、行動／非行動、結果・その後、条件・負荷・不明、および記録間の再出現・違い・変化。役割を明記された担当名だけへ狭めない。共起・類似語を因果・本人の固定人格・同じ基準へ昇格させない。

各点・線・説明が元記録と両端根拠に戻れ、図と文章で意味・方向が一致することを確認する。引用照合成功と意味採用を区別する。現在の全期間対象・月次当時版・閲覧権利・カテゴリ文脈を維持する。分割時は未解析範囲と跨ぐ関係を落とさず、直近N件へ無断切捨てしない。

具体的な変更位置は、`semantic_admission.py::prepare_analysis_semantic_map`／`generate_analysis_semantic_map`、`intent_compiler.py::compile_analysis_semantic_map`と`AnalysisSemanticMapGraph`、`observed_route_realizer.py::AnalysisSemanticMapArtifact.private_evidence()`。overview、nodeのtitle／summary／explanation／unknowns、edgeのlabel／explanationで実際に述べる命題を、同じgraphとsourceに対応付けて比較する。本人記載の前提、modelによる解釈、関係についての解釈は別に扱う。前提だけ確認できてもnode全体を確認済みにしない。

既存の`ObservedProposition`、`_proposition`、`_self_propositions`、`_active_sources`等は、完全source・主体・scopeの前提が成立する時に再利用する。4Bの一般mapを全て旧ROLE/ACTION有限文法へ押し込めない。private evidenceの拡張は現SQLとreaderの互換を検証し、公開`watashi.map.v3`や8fieldのmap_contextへ内部判定を無断追加しない。`mapped_count`は根拠付きでmapへ入った記録数であり、全命題の意味確認数ではない。

原入力の編集は現在guardを変え、当時月次は当時版を保つ。実削除／source owner移動については、現`analysis_observed_invalidate`がdependent artifactと月参照へ作用する契約を継承する。一般編集と実削除を同じ全消去操作にしない。新reportの依存も同じsource memberへ結び、別失効serviceは作らない。`EDITED_SINCE_ANALYSIS`等の既存表示を保ち、現在の原文を当時解析した版へ偽装しない。

確定衝突があるmap候補は、その所見と実出力を品質修正へ戻す。自動再生成・新しい修復loopを本書から起動しない。未判定の解釈は本人記載の事実へ格上げせず、既存商品の解釈としての表示と原文／本文の読解で扱う。旧月次を開いた際に新readerで黙って再判定しない。

IFは仮想、SavedRouteIntentは本人の選択意向として保つ。実行・達成・観測済み事実へ戻さない。IF／Savedは既決未実装の残件であり、基礎部品を今回設計に含めるが、実装済みとも発売前新必須条件とも認定しない。こころグラフの感情数値集計へ、文章意味推論を混ぜない。

## 8. 教材・失敗分析・比較・再現性の利用

### 8.1 教材と評価の分離

**11/12教示を反映：** [観測・分析のすり合わせ記録](../../observation_learning/README.md#observation-calibration-20261112)を読む。結果から意図まで決めず、本人の説明と実際の結果を別に扱う。行動を比べる際は、その時点の依頼・可視情報など条件の違いも確認し、差だけで意欲・人格・原因を確定しない。仮説の根拠と範囲、本人の具体的訂正による読み直しを残す。この記録を完成教師や実モデル品質改善へ数えない。

- 原対話／Mash逐語、華恋編集、架空草案、model出力、本人による訂正を出自別に保つ。既存の学習利用条件を継承し、Karen-Diary原文を自動で教師化しない。
- 旧current100・failure family・mutation・修正前後・現6境界を、現在の入力仕様へ対応させる。旧感情／カテゴリ形の互換変換は原本を残し、変換後を別版として扱う。
- 原入力を変えずに作る誤答例と、否定・主体・時点等を変えた別入力を区別する。失敗したmodel出力を正解教師にしない。修正教師は根拠を読み、採用状況を明記する。
- 学習用、既使用評価、保持確認、未学習別題材を分ける。同じ旧失敗を教材にも使った場合、その後を未知入力成功と数えない。
- 既に準備された教師・重み・生成原本を保つ。学習再開と、保存重みから新optimizerで別学習することを分ける。

### 8.2 失敗の原因を修正へ返す

出力の反転箇所、source解釈の誤り、生成時の意味変化、readerの誤読、権利／版の不整合、保存／描画の差を区別する。単語一つずつの修復を無制限に積まず、同じ原因の自然な入力群をまとめて扱う。旧causal comparison、negative／positive例、candidate comparator、diversity、version diffは、ここで実際の選択・修正・再読へ使う。

同一入力の修正前後、別題材、既成功を並べ、本文・画像・図を全文／目視で読む。自然さ・入力固有性・読まれた感・単独伝達は機械一致だけで決めない。短文を全て深掘り対象にせず、反復・定型化・不要な問いも確認する。

### 8.3 取り違え防止と計測部品

旧runtime/distribution/file比較、provider・token・duration測定、artifact版・保存再読の部品は、現試行の入力／重み／作者／結果を取り違えない範囲で回収する。既存runnerと保存先へ組み込む。実行可能性を証明するためのchecker／FD／authority chainを再構築しない。

学習時間、生成時間、読込・待機、レンタル時間、請求は別に記録する。以前の$按分を今回請求額にしない。追加model readerや複数候補は既存生成と比較し、誤拒否、無出力、p50／p95、token数、追加call、GPU競合、実費を確認する。未測定値を0や上限以内と認定しない。

既存の追加月額上限1万円、provider・model・データ境界を維持する。大改修許可を無制限の課金／レンタル／新サービス採用へ変換しない。利用可能な承認済み環境で通常の改修・比較を進め、既承認の小作業を毎回再承認へ戻さない。

### 8.4 複数候補・競合解釈・選択の具体化

これは省略しない回収能力である。初期の通常生成1callとは別に、既存の開発比較runnerで明示した有限候補集合を扱う。

1. 同じsource／context／意味条件に対し、prompt・model／adapter・表現候補の違いを識別する。入力意味そのものを変えた候補は、同義表現の競争と別群にする。
2. source・形式・Safetyの既存資格を先に確認し、明確に誤った候補を選択対象から外す。意味比較が未判定の候補は「意味合格」へ格上げしない。競合した解釈を流暢さやID順だけで一つの事実へ固定しない。
3. 同じ意味を保つ候補同士で、本人宛／作品としての自然さ、重要な対象、不要反復、入力に合う密度・長さ、伝わり方を比較する。旧selectorのhard／soft分離を回収し、旧比率や旧定型句に有利な点数は移さない。
4. 全不適格、同点、比較不能、別解釈が併存する状態を残す。開発時は実本文の読解から候補採否を決め、比較器の選択と違った理由も修正へ返す。通常での自動選択を採用する時は、既存の一候補との同材料比較で誤選択・意味の変化・費用／遅延を確認する。
5. inputごとの選択後もbatch全体を見る。同じ書出し・文骨格・締め・受取り対象へ集中していないかを確認し、原因を教師分布・生成指示・候補選択へ戻す。多様性を増やすため正しい短文や意味保持を壊さない。

AR-01で既存試行の候補比較を再利用し、AR-04／05では作品・mapに合わせた選択軸を使う。runtimeの複数生成が不要と判断した場合も、開発比較能力を廃止したことにはしない。通常採用しない理由は測定結果と用途の違いとして残す。

開発時の比較入力は、case／source／context版、各候補の実本文・作者／model／prompt／adapter版、finish結果、各意味比較結果、教師／評価露出、計測値からなる。出力は候補別の適格／不適格／未判定、採用／非採用理由、意味の差、集合の反復／偏り、原因仮説、修正先、実修正後の対応結果。同点・全不適格・意味解釈が競合・評価未実施を異なる結果にする。公開summaryには私的原文を含めない。

接続先は、既存trialの生成比較runnerと、`ai/tools/emlis_nls_v3_batch_run.py::load_validated_batch`／`_previous_by_case`／`run_batch`、旧`evaluate_and_select_reception_candidate_v2`のhard／soft分離、current100の`PRODUCT_READ_SHARED_CAUSE_CODES`／`build_current100_product_read_pair`。旧専用型・文型・現在の固定版と合わない箇所は、現trialの同じ結果束へadapterを置いて改修する。旧runnerを無条件再起動せず、旧human判定を作成する処理にも変えない。比較・選択・cause修正のownerは当該coreの既存品質作業、通常の本文作者は変更しない。

検証では、意味の誤った流暢な候補が既知の正しい候補に勝たないこと、意味が競合する候補を字面順で事実化しないこと、全不適格・未判定を区別すること、同じ本文反復への偏りが実修正で減ること、変更対象以外の意味と既成功が保たれることを確認する。AR-01で実Emlis比較、AR-04／05で各商品候補、AR-08で通常採用範囲の判断まで接続する。表を作っただけの完了にはしない。

### 8.5 意味変異・共通原因・版差分の処理

既存`apply_counterfactual_mutation`、旧relation matrix、current100のshared-cause分類、batchの前版対応を起点に、次を同じ実結果束で行う。

- 原sourceを固定したまま、完成物の主体・否定・時点・不明等だけを変え、比較器がその差を検出するか確認する。別にsourceの意味を一つ変えた対照入力を作り、生成物の該当箇所が変わり、非対象の意味が保持されるかを確認する。
- 失敗を、元材料の選択、source解釈、意味採否、更新、表現、reader、保存／描画のどこで発生したかへ分ける。shared-cause codeは仮説の分類であり、自動原因発見済みとしない。
- 原因仮説に対して、別題材の同型例と、その仮説なら誤らないはずの反例を比較する。修正後の実商品差が仮説に対応しなければ、原因認定を更新する。
- 同じsource ID／版を対応付け、保持・追加・消失・確定化した意味、出力有無、自然さ・集合偏り、時間／費用を前後で比較する。入力変更の効果とモデル変更の効果を混ぜない。学習履歴やoptimizerの条件が違う場合は純粋効果比較としない。
- 変更原因に関係する群、既成功controls、別題材を既存corpusから選ぶ。表記だけを変えた派生を未見題材と数えず、必要な節目で既存の広い回帰集合へ戻る。

### 8.6 能力群と実装単位の対応

| 回収する能力群 | 最初に使う単位 | 後続の実用途 |
|---|---|---|
| source／Evidence／権利／版／privacy | AR-01の同一材料比較 | AR-02/03/04/05/06/08の更新・保存・失効 |
| 意味候補・競合解釈・unknown・選択 | AR-01の意味保持 | AR-02/03の補足／履歴、AR-04作品、AR-05/07 map／IF |
| 自由文reader・意味比較・変異試験 | AR-01 | AR-04の本文、AR-05のnode／edge／全文、AR-06の跨ぐ関係 |
| 複数候補・自然化・Reception・分布 | AR-01の既存モデル／prompt比較 | AR-03履歴応答、AR-04作品比較、AR-08の通常採用範囲 |
| 共通原因分析・positive対照・版差分・corpus選択 | AR-01の修正前後 | 全単位の実修復と既成功保持 |
| 問い・訂正・撤回・frame | AR-02 | AR-03/04/05/06で有効本人sourceとして利用 |
| 図・画像・根拠・観測／IFの区分 | AR-04/05 | AR-06/07の蓄積・当時版・仮想／選択意向 |
| 再現入力・重み／依存比較・計測・中断結果 | 各単位で現実に必要な時 | AR-08の通常待ち時間／費用／復帰。旧全環境証明は前提にしない |

これらを先に別systemとして作り終える順序にはしない。必要な能力の深い改修を許容しつつ、その単位の商品結果へ直接使う。

## 9. 実施する商品単位と依存

次の単位は作業の順路であり、新しい承認Gate・実行管理system・発売条件ではない。必要部分が既実装なら再実装せず現結果を確認する。各単位は原情報→修正前商品→回収／改修→修正後商品→保存再読・残差までを含む。

| ID | 実施内容・既存残件 | 具体的な完了確認 | 依存／状態 |
|---|---|---|---|
| AR-01 | 現naturalの主体・所有者・否定・時点・留保を、旧失敗・意味比較・共通原因分析で改善。EM-01a/b | 現6境界と正常な短文／省略で、同入力の誤読を解消または明確に減らし、自然さ・別題材・既成功・保存再読を保持。検出増加／無出力だけでは完了しない | 継続中。新24実生成の4版は通常不採用。c6555fd5で疑問符なしの確認質問の保存抜けを修復、250局所PASS。同24rawは旧24保存→新22保存／2拒否、受理本文不変。全体の意味修復は未完 |
| AR-02 | 現naturalの任意問い・回答・訂正・撤回・frameと、完了応答後の具体的な本人訂正。11/12採用仕様は§6.1。EM-02a/b、03b | 全plan最大3問、初期ON・前回選択保持、短い受け止め→回答後応答、0／1／2問終了・skip・上限時の不明保持、訂正対象と本人説明の二つの入力、説明不足時の未確定保持、対象だけ更新、撤回後の残存意味、同版再読、既存参照権利 | 最大3問・設定・二入力訂正・有効更新／失効と下流接続は通常DB／API反映済み（§9.55／62）。一般問い判断・本人説明の読取・自然な本文と本人一巡は未完。研究hint未採用 |
| AR-03 | 適格履歴の意味ある利用。EM-03a/b | 同一／別場面・変化・無関係・訂正前を区別し、適切な履歴が今回へ効く。失効材料を使わない | 現related_contextと失効材料の再認可を継承。今回の意味利用全体は未完 |
| AR-04 | 一人称・欄・役割等の限定改善、最新適格回答／訂正の意味を既存Piece作者と独立保存検査へ接続 | 原材料→本文→保存再読・同版画像、一般文章化・単独伝達と有効更新の保持 | §9.68／69を継承し、§9.71で複数のproperな本人訂正をPieceへ接続し通常反映。異なる原節の完全引用REVISE／WITHDRAW・ANSWER0の限定範囲。ANSWER併存・置換節再訂正・一般本文品質・model通常採用・本人一巡は残る |
| AR-05 | 分析の本人基準・役割／選択・記録間関係と、項目・関係線への本人訂正。AN-03a/b/c、04 | 原記録→意味→図／全文→両端根拠の対応、再出現／変化／不明の正しさ、訂正対象と本人説明からの読み直し・再読 | source duties・有効訂正、項目／線への二入力訂正と次回分析材料・独立根拠を実装し通常DB／APIへ反映（§9.62）。本人基準・条件差・記録間意味の品質、配布／本人一巡は未完 |
| AR-06 | 専用試験所有者の通常MAPは共有時間枠で最終統合が打ち切られ、503・保存0 | §9.203。最初の受付から834.486秒。最終応答は1〜128トークンで、共有トークン残枠は1,152以上 | 通常コード・時間設定は未変更、通常保存・同一ID再読が残る |
| AR-07 | IF／Saved等の商品固有の残る意味保持責務。既存AN／PC残件 | 仮想・本人選択意向・観測を分離し、成立した経路で出力と保存を確認 | 本人提示の実1／2／3候補各1set・Saved各1件を継承。本人案なし標準自動3案も実4B限定1set・同raw隔離保存再読・Saved1件・既存RN受口と7f51通常反映まで§9.67で成立。条件／負荷／未知は既存表示、同display内の確認済みSaved印は§9.68。一般品質・本人利用・AR-07全体は未完 |
| AR-08 | B53後の通常用120uはPID 42240、開始tick 17581293 | 復元まで933.373秒、試験ポートの閉鎖を確認 | §9.182 |

現在の実施順と作業単位は§9.1を正本とする。AR-04の固定実3件の読取拒否修復・9隔離保存／非生成再読は完了として継承し、一般編集品質・同版画像・通常適用等の残件を、他coreの能力移管と並行して減らす。旧73生成・先行native成功・今回の実7callを繰り返さない。

既存の品質作業・新教師8件・保存重みの継続点を使う。GPUに現実の接続障害がある場合、取得できた事実、未実行の生成、回収済み原本、次の同一単位を記録し、CPUの合成成功を実モデル改善へ換算しない。接続復旧や既存の別core実装を必要範囲で進め、無関係な補助機構開発へ変えない。

### 9.1 2026-11-12 — 局所修正の直列進行から、既存能力群の移管と三中核での利用へ変更

**11/14追補：本節の方針を具体的な完了範囲・四作業・現在再開先へ落とした現行計画は§9.54と第11回§5。以下の11/12時点の実施順を、最新の局所試行だけへ狭めて再開しない。**

Mashの「これまでと同じ禁止」「進め方を決めろ」を受け、AR-04の一つの不採用文から次の不採用文へ進む順序を、補助経路の活用全体の進行軸から外す。直前のoperator比較修復は有効な部分成果として保持するが、全体依頼の区切りにしない。本節は実施順と作業単位の変更であり、実装完了・通常採用・商品受入れを増やす記録ではない。

旧補助経路は既存の実装・教材・失敗知識・比較手段を持つ。回収対象は§13/14と8/14原本の能力群であり、三大中核の一般的な機能追加に置き換えない。既存呼出しは継承し、未接続・現商品に適合しない責務を、現owner内で直接利用・抽出・改修・再実装する。旧外殻の再稼働、先行する巨大共通framework、新しい台帳・承認段階は追加しない。

**実装と検証をまとめる単位は「旧能力群→現ownerの実呼出し→修正前後の商品全文／図／画像→保存・再読」。** 個別の文法修正、数件の通過、test数、資料更新だけでこの単位を完了にしない。

| 並行して進める範囲 | 今回の能力移管と現owner | 閉じる商品結果 |
|---|---|---|
| AR-01/04/05：返答・作品・地図の品質 | 意味責務・競合解釈・内容選択・完成物の独立逆読取、候補比較と共通原因分析を、現natural／Piece author・policy／Analysis admission・compilerへ組み込む | 主体・対象・否定・時点・条件・不明を保った自然な返答、単独で伝わる作品、根拠と関係が一致する図・本文。検出・拒否だけでなく生成結果を改善する |
| AR-02/03：本人回答・訂正・履歴 | 既存question／answer_update／thread source・historyと旧意味更新知識を、現naturalへ接続する。AR-01の一般品質完成を前提にしない | 採用済みの問い仕様、回答後応答、「どの内容ですか？」「どう違いましたか？」による対象を特定した訂正、撤回・失効・適格履歴が本文に反映され、保存後も同じ結果を読める |
| AR-06/07：蓄積・記録間関係・IF/Saved | 上記の有効本人source・版と既存Analysisの関係／unknown資産を、既存の商品条件に従い利用する。必要な依存部分が成立したところから接続する | 条件の異なる行動を混同せず、結果から意図を確定せず、原記録・本人補足・AI解釈・観測・仮想・選択意向を分けた蓄積と当時版再読 |
| AR-08：通常経路への適用 | 各能力群で成立した現ownerを既存の通常呼出し・保存・表示へ接続する。全coreの全品質完成を一括切替の前提にしない | 実際にどの通常経路で使われ、同版の本文・図・画像が残るか、待ち時間・費用・復帰を確認する。開発試行だけを通常利用済みとはしない |

最初の実装範囲は、意味責務・内容選択・独立逆読取・共通原因修正を一組として、現natural、Piece、Analysisの未接続箇所へ移すこと。同時に本人回答・訂正・履歴の既存owner接続を進める。source確認は各変更に必要な既存対応行と実symbolで行い、全旧資料の再棚卸しを新しい着手前段階にしない。共有ownerの変更と統合は一人の担当で扱い、独立した各coreの実装・読取reviewは並行する。GPU提供・重み変更・有料実行は一担当に集約し、並行化を理由に追加消費しない。

代表入力群は現在の入力欄・主体・時点・条件・希望／未実行・引用・補足／履歴等を含め、既存失敗と正常な省略・言換え、既成功、別題材をまとめて比較する。失敗文に合わせた教師追加や有限reader拡張を進行軸にしない。商品全文を読んで、理解・選択・生成・検査のどこで失ったかを分け、生成の不足は現4B生成条件／必要な学習・作者へ戻す。複数候補比較は既存開発runnerを使い、効果・費用の判断なしに通常推論回数を増やさない。

§11の完了条件をそのまま適用する。必要と採用を決めた能力の未実装・未接続・実商品への未適用が残る間は全体未完。局所修復を全体の完了報告や毎回の続行指示待ちの区切りにせず、移管・実出力・保存再読を含む単位で継続する。Mashの正式受入れを代行せず、未実測を完了にしない。

<a id="auxiliary-crosscore-transfer-20261112"></a>
### 9.2 2026-11-12 — 既存能力を三中核の現在ownerへ移管した実装候補

実装はAPI `eea4761f7b5009128d497b2b69e1b1d0766ad57d`。製品9file、既存RPCの追加migration1、新旧test5、既存workflow2の計17fileを変更した。公開schema・通常のAnalysis v1・既存保存物の非生成再読は保持する。新規4B実呼出し、通常採用、live DB適用、Render配置、本人端末・正式受入れはいずれも0であり、補助経路全体の完了ではない。

| 回収する既存責務 | 現在の実呼出しと実装結果 | 成立した範囲／残る範囲 |
|---|---|---|
| D26/27・D02/08：本人に確かめる一点、回答・訂正・撤回、出所と不明 | `emlis_thread_service._prepare_natural_question`→既存`original_meaning_plan/question_candidate/prepare_emlis_meaning`。現naturalの短い受け止め→別QUESTION→ANSWER→実checkpoint→回答後応答を接続。新Q3 natural policyだけ全plan最大3問。不要時0問、本人続行、skip/終了、結果不明・中断復帰、同版再読を継承 | 旧有限ownerで根拠付き質問が成立する入力を対象とする。一般自由文を有限checkpointへ強制しない。実SQLと合成単一providerで処理確認。公開の問いON/OFF・前回選択保持は後続§9.3で候補へ接続。完了後の「どの内容ですか？」「どう違いましたか？」の二つの入力は未実装 |
| D27・D07/21：回答で有効になった意味と失効した意味 | `natural_reply.prepare_natural_reply(prepared_meaning=...)`→既存の原文locatorと`final_reception_source_anchor_text`。active/inactiveのclaim anchor、肯否・時点・modality、関係失効・未確定を現作者へ渡す | カテゴリ・感情選択を文章の出来事／反応へ昇格しない。全spanは周辺文脈、typed anchorが当該claim。原入力と本人補足は別。既定FINALの旧wireは保持。実4Bでの自然さ・反映品質は未測定 |
| D04/10：必要意味・内容選択・参照／scope依存 | `piece_model_source._piece_content_selection`で現Piece planの全required duty、欄／source／scalar範囲、読取group、関係・scopeとcontext_onlyを、既存のconfigured取得へ渡す | source全文・prepared・旧SYSTEM・既存authoring条件は保持。requiredを予算で脱落させず、出力文数や原文丸写しを固定しない。既存Engine/S7の意味採否は独立。実4Bの表現・単独伝達の改善は未測定、selector/重みの通常採用は行っていない |
| D06/07/08/45・D21：source意味責務、条件比較、図／本文の逆確認 | 既存Analysis observed compilerの完全source読取を、明示`semantic_map.source_duties.v2`の生成材料へ接続。原文全体は一度だけ送り、意味軸とfield/span参照を追加。現在のadmission/compiler/唯一realizerを使用 | 同じ記録に書かれた場面・担当、引用根拠内の時点・希望等を図と同じ本文へ保持。場面を行動の原因／条件と認定しない。唯一対応する完全命題の肯否／時点／modalityだけを独立比較し、一般解釈はUNASSESSED。旧v1既定・保存・月次当時版・IF境界は保持 |

追加migration `20261112080628_emlis_natural_bound_questions.sql`は、現在の`20261101010000`のRPCを基礎にする。既存naturalの履歴期間例外とconnected frame条件を保持し、既存threadのpolicy／started limitを不変としたまま、新native-bound policyに限り全plan最大3問を認める。service_role専用・security invoker、owner/source/revision/attemptとtransaction条件を維持した。有効な回答後のREFINEDで終了する場合は同じ保存本文を保持し、追加生成しない。保存直前の履歴削除／編集は同RPCの既存context lockで拒否し、明示的に再操作した時だけ現在の情報でFINALを取得する。稼働DBへは適用していない。

検証：新規4moduleの一括検証は53件成功。別集合の既存natural/Q2/Q3 125、Piece関連235（新13を含む）、Analysis72（新16・実隔離SQL2を含む）は各範囲の結果として保持し、重複加算しない。最終API eea4761fのPiece CI43185991522/job131073156216（39工程）とAnalysis CI43185991451/job131073155937（19工程）は両方success。既存CIに新検証を加えた同headの結果で、実モデルやlive環境の成功ではない。合成Auth/source/providerを含む隔離検証であり、実4B・live Auth/API/DB・本人端末の結果へ換算しない。

RN source互換も確認した。`useEmlisThread.js`の続行は`dto.can_continue`、`EmlisThreadModal.js`の残問表示は`question_limit-issued_count`を使い、RN独自のPremium制限はない。本文とpending questionは既存の別表示で扱う。実機成功ではない。一方、同ModalのPiece補足選択は依然QUESTION/ANSWER各1件を必要とし、原入力Pieceも回答後は対象外のため、2〜3回答後のPiece作成は未対応の残件としてAR-04へ保持する。今回の全plan3問を複数回答からPieceまでの完成へ換算しない。

#### 実4B比較の準備・承認待ちの履歴（後続§9.4で実行済み）

既存Runpod `f1lle4xwq3wjln`のJupyterへ到達し、既存提供PID73476とlocalhost:8000のhealth200を読取確認した。環境全体の取得、鍵の表示、提供停止・再起動、重み変更は行っていない。3中核の固定した架空要求7件（naturalの問い前／回答後／撤回後3、Piece旧新2、Analysis旧新2）を一回比較する77,300byteのscriptを準備したが、外部uploadは自動承認審査に拒否され、送信・実4B生成は0。拒否理由は、既存の二つのnamed credential fileを同Pod内localhost API認証へ使う処理について、送信先・内容の明示承認がないという判定である。迂回実行はしない。

実行候補は最大540秒、再試行・追加学習・新規レンタル・提供停止／再起動・モデル／重み変更なし。既存鍵は同Pod内認証だけに使い、値／全環境を出力・保存・外部転送しない。source/prompt/rawとactual generationの区別を保ち、受領後に同じ現ownerと隔離SQLへ戻す。token数・context適合も未測定のまま。

準備原本：`Cocolon_CMEE_AuxiliaryTransfer_Prepared_20261112.zip`、Library ID `libfile_fde3_f-934d5411db408191ace1365dfb04eaa6_2f7470f963808191aaebf050935e72de`、68,717bytes、SHA256 `0248a2c80ea56a61685b6a0b4ad4a9328e7228e4073ffac5ff63c5143c2746a7`。script単体SHA256 `38e5ef347e6e8f93c509b871475e18a2ed0e0365496d5d422550b72ba00da3d9`。架空要求・SQL snapshot・既存経路へのreplay手順を含み、認証値とGit-backed製品sourceの複製は含まない。未実行archiveを実生成証拠と呼ばない。

次はこの実4B比較の具体的承認後の実行と、AR-02の具体的本人訂正、AR-03の意味ある履歴利用、AR-06/07/08の既存依存に沿う実装を進める。必要な未実装・未接続が残る間は全体継続中。有限ownerの適合範囲と一般品質、実装候補・通常提供・本人受入れを分ける。

<a id="emlis-question-receiving-20261112"></a>
### 9.3 2026-11-12 — 問い設定を入力画面・保存入力・新規応答へ接続

API `dc6dfad00cccc4345d00508c7851a06e288ddadf`、RN `e6aabd332970b3cf159d5e8a495ecb67aed92f5f`。採用済みの「Emlisからの問いを受け取る」を既存入力導線へ接続した。旧質問・本人回答・source更新の移管に続くAR-02の実装候補であり、通常反映・実4B品質・本人端末やAR-02全体／補助経路全体の完了ではない。

| 既存owner | 接続した責務 |
|---|---|
| `InputActionArea`／`InputScreen` | 感情通知の近くに独立した問いSwitchを追加。初回ON、通常入力で保存確認済みのboolを送信前に固定。tutorialでは永続設定を操作しない |
| `useEmlisQuestionPreference`／`emlisQuestionPreferenceStorage` | 同じ端末の本人別AsyncStorageキー `cocolon.emlisQuestionPreference.v1:<uid>` へ前回選択を保持。owner変更の世代と同ownerの未完操作を扱い、古い読込・保存が別本人へ混入しない。下書き復元／入力成功resetから独立 |
| 既存 `POST /emotion/submit`→gateway→`persist_emotion_submission` | 任意の厳密boolean `receive_emlis_questions`（省略true）を既存emotion INSERTへ渡す。入力保存と同時に今回の選択を固定し、thread admission前の中断後も取得できる。新start endpointや自動submit再送保証は追加しない |
| `emlis_thread_read`→`EmlisThreadService.start` | 新列をprivate snapshot siblingとして読み、新規Q3のprivate dataへ固定。naturalは既存constructor許可とのAND。新finite Q3でもOFFならQUESTION／続行を発行せずFINAL本文を保存し、既存問数上限は変えない |
| `accountLocalCleanup` | logoutでは本人別選択を保持。account削除では同じ保存queueの先行write後に本人keyを消し、他本人は消さない |

読込・保存が未確認／失敗した間は、仮のONを送信しない。設定破損や読込失敗では再確認・本人による明示選択から保存し直して復旧でき、恒久的に入力不能へ閉じ込めない。送信中の入力はcaptured値のまま扱う。設定を後で変更しても、既存threadのpolicy、保存済み回答、履歴参照権利、感情通知を変更しない。端末間同期・再インストール後の復元は保証していない。

DDLはCLI `migration new` で生成した `20261112092202_emlis_question_receiving_preference.sql`。既存emotionsへboolean NOT NULL DEFAULT trueを追加し、既存read RPCのsource7key・owner／閲覧期間条件・INVOCER・OID／ACLを維持する。設定はoriginal source・意味prefix・model本文材料・公開DTOへ混ぜない。公開API registryとschema05へ任意request fieldを記録し、旧caller省略true、string／number／nullはINSERT前に拒否する。

検証は新規API21件を含む実隔離SQL集合63件成功。ASGIの公開submit→既存gateway／保存→factoryのbackground起動→private read→新natural／finite Q3→保存／非生成再読を確認した。provider本文・Auth／PostgREST transportは合成で、live DB／実4Bではない。INSERT後admission前停止から新ownerで開始したOFF保持、既存threadの後変更非反映、owner／ACL／source分離も含む。追加の既存Q2／natural／submit pending・通知・public meta回帰は、不足した既存辞書／queue sourceを同parentから復元して失敗箇所を再実行し、失敗残件0。集合の重複は加算しない。

RNは新規10件（本物React hooks／storage／設定component・削除処理）と既存InputScreen83件（追加3を含む）を一括し93件成功、fail／skip0。初回／前回値、遅延A→B→A、失敗復旧、削除時の先行保存、OFFと通知の独立、下書き復元／入力成功後の保持、読込中の旧handler抑制、送信中の固定値を確認した。既存CIのReact集合へ新2module、APIの既存隔離集合へ新moduleを追加した。native画面・本人端末の結果ではない。

GitHub CIの確認：API dc6dfad00のPiece run43192216034/job131094116606はattempt1・39工程success（新21件を含む入力集合171成功）、Analysis run43192216486/job131094117395はattempt1・19工程success。RN e6aabd33のrun43192045940ではJS job131093548943がsuccess（既存source集合1453とReact集合301、fail／skip0）、Android source／exportもsuccess。一方iOS source job131093548878はsimctl起動中のMach error -308／server died後にcancelledとなり、native assertionとartifactは得ていない。構文／patch／plist検査はsuccess。09:43:42 UTC時点でcanvas job131093548998とexport Pods job131093549218は実行中・未判定。追加待機・再実行なし。当該standalone metrics／Piece canvas hostは今回のInputScreen／新hookをimportせず、native／renderer／harness／依存の変更もないため、今回のJS変更による障害とは確認していない。RN workflow全体を成功やnative品質合格として扱わない。

独立source reviewの指摘2点（finite OFFでPRE_QUESTIONが残る状態不整合、壊れた設定から本人が復旧できない導線）は是正済み。今回の再利用可能な成果は実装・隔離検証の `TECHNICAL_CREDIT`。`STRUCTURE_MAP_DELTA_PRESENT`（入力設定の2ownerと既存保存／read責務）。生成品質・正式商品受入れへ換算しない。

**通常反映順はmigration→API→RN。** 旧APIへ新RNのfieldを先行させるとOFFが無視され得るため、この順序を守る。稼働DB適用・Render配置・build／配布・本人端末確認は実施していない。既存運用feature flagをONへ変更していない。

未完は完了後の二入力訂正、一般自由文を含む問い判断／回答後の実4B品質、AR-03の意味ある履歴、他ARの未接続能力、通常反映・実機。§9.2の7要求scriptは後続§9.4で具体的承認後に一回実行した。設定実装と実比較、作者品質の改善・通常採用は別の結果として扱う。

<a id="auxiliary-crosscore-actual7-20261112"></a>
### 9.4 2026-11-12 — 承認済み実4B7件の一回比較と、撤回後の問い保存抜け修復

Mashが、準備済み77,300byte scriptを既存Runpod `f1lle4xwq3wjln`へ送り、既存二つのnamed鍵を同Pod内localhost API認証だけに使い、架空7件を最大9分・一回、学習／再試行なしで比較することを明示承認した。§9.2のupload拒否後に得た具体的承認であり、迂回や前承認の拡張ではない。

script SHA256 `38e5ef347e6e8f93c509b871475e18a2ed0e0365496d5d422550b72ba00da3d9`、送信後も77,300bytes・同hashを確認。事前の出力folder不存在、提供PID73476・health200を確認し、外側`timeout 540s`も付けて一回実行した。**7/7 HTTP200・finish_reason stop、98.35132192610763秒。** retry／training／provider restart／weight変更／新規レンタルは0。前後PID73476とhealth200/200を維持した。鍵値／全環境の表示・保存・外部転送は0。tokenizerはOSErrorで利用できず、実input token数・context余裕・金銭原価は未測定。HTTP成功・stopだけで品質合格にしない。

| 条件 | 実model・現ownerを通した結果 | 本文・保存の限界 |
|---|---|---|
| Natural・問い前 | 実rawを現provider parser→service→実隔離SQLへ通し、PRE_QUESTION本文＋別QUESTIONを保存。再読後のprovider呼出し0 | 記録・感情・カテゴリ・不明を説明する4行で、短い本人宛受け止めとして弱い |
| Natural・回答後 | 元入力と本人回答の意味を基本保持し、新REFINED保存／非生成再読 | 原文と回答のほぼ復唱で、自然な受け取り・観測価値の改善は未実証 |
| Natural・撤回後 | 実modelは既発行QUESTIONを本文へ再出力。修復前はCOMPLETED／REFINEDとして新OBSERVATION保存。修復後は同rawを拒否し、新対応OBSERVATION0・RESPONSE_FAILED／本文UNAVAILABLEへ | 有効な撤回後応答は未取得。拒否を本文品質改善や完成へ数えない。旧観測を成功へ算入せず、保存済み本人回答・更新sourceを保持 |
| Piece・旧／内容選択追加 | 同じ原2欄の完全コピーで旧新response/本文byte同一。現receipt→Engineは両方piece_model_meaning_unassessed_or_changedでUNAVAILABLE | 新意味変異は見つからないが編集改善0。共通authoring instructionの氏名→public role抽象化も未実行。氏名残存が複合拒否の唯一原因とは断定しない。S7や氏名条件を緩めて通さない |
| Analysis・v1／source duties v2 | 旧新とも2recordから2node/1edge、図と同本文を生成しartifact serialization／再読が非生成一致。v2の両場面引用とedge文脈注記を保持 | 旧edgeの自宅行動の否定誤記は新rawで消えたが、新側に反復・誤字・記録間関係の説明不足・同じ資料という未根拠identityが残る。node_kind変更を役割理解の成立へ数えず、private visible reviewはUNASSESSEDを保持 |

Piece送信bodyは8,809→12,140bytes、Analysisは6,064→8,333bytes。これは同一一組の実測であり、一般品質・速度優位を示す反復実験ではない。自然応答には修正前model alias `cocolon-qwen3-4b-base-851bf6e` のexportがあったが、承認scriptが提供引数から実alias `cocolon-qwen35-4b-base-851bf6e` を入れた。その他のmessages・source・生成条件は不変。実rawのmodel bindingと実request SHAへ厳密に照合し、元exportのwire bytesが無変更とは主張しない。 Pieceの現SDK replayは実送信scriptとJSON key順だけが異なり、request JSON／messages／全生成値は一致するがwire byte同一ではない。両SHAとfalseのkey-order一致結果をprivate原本へ保持する。Natural／Analysisのreplayは実wire SHAにも一致した。最初のoffline alias不整合replayは無効記録として隔離し、品質・保存結果から除外した。実モデル7callを増やしていない。

#### 実測された問い分離の保存抜けへの最小是正

実modelの過去丁寧形の質問が、既存`_QUESTION_ENDING`の現在形だけの有限範囲を抜けて保存された。API `4183126d00c2ed4238c526cf17f6b28cdbb18dc6`で既存判定へ`ましたか／でしたか`を追加した。既存のquote mask、malformed quote fallback、source／公開wire／DB／RN／作者promptは不変。本文修補・代替文・追加生成はない。

同じ実rawと実wire／sourceを用いた隔離SQLの前後比較で、初回・回答後2件の保存と同本文再読を維持し、撤回後だけ誤質問の新保存を拒否した。matching RECEIVED以降の新OBSERVATION seq・current sourceprefix・DTO eventを検査し、前からある初回観測を成功へ数えていない。現自然系3moduleの関連103件成功、fail／skip0、既存Pydantic warning1。追加8正負対照は実測文・過去丁寧疑問・引用・平叙を含む。独立source reviewと16境界対照にblockingなし。これは既存保存境界の修復で、任意の日本語の質問を完全検査できるという主張ではない。

CI最終結果：修復API4183126dのPiece run43198325424/job131114907252はattempt1・39工程success（既存入力集合179／model集合2034成功、局所103との重複は加算しない）。Analysis run43198325584/job131114907684もattempt1・19工程success。両方とも同じ修復headの結果であり、実modelの追加生成・通常採用・live／端末の成功ではない。

#### 保存・再読のscopeと不成立事項

Naturalは元のfrozen source7key、ID、時刻、questions／answersを保持し、旧fixtureにある列だけをINSERTして新配送設定列はDB既定trueへ委ねた。歴史的RUNNING attemptだけを隔離fixtureで中断へ解放し、既存明示retry ownerを経由して、取得済み実rawをMockTransportで一回受領する。これはGPUの再実行やproduction retryではない。

Pieceのexported owner／input IDは非UUID、Analysisのguard／as_ofは固定fixtureである。**この4要求のexact SQL保存は未実施。** 別UUIDやfresh guardへ置換したSQL成功を、実送信した同一PreparedRequestの保存成功へ読み替えていない。一次結果は元packet／messagesと実rawの現owner採否、Analysisは同artifactの非生成serialization roundtripまで。live Auth/API/DB、実機・native画像は未確認。

独立本文レビューで、原文と同じPieceに別回帰例の程度／留保が脱落したという誤所見が一度出たが、source_kwargsとactual2欄の再照合で撤回した。原文完全コピーが正しい記録で、raw／採否は不変。別sourceの意味を混ぜて改善・誤拒否を判断しない。

実原本は `Cocolon_CMEE_AuxiliaryTransfer_Actual4B_20261112.zip`、Library ID `libfile_fde3_f-21b9eebf426c81919fcc7b8670d6dbca_2f7470f963808191aaebf050935e72de`、132,723bytes・18members、SHA256 `583ce5b3d64093366424cf84be7bee69922c33eef210f774891feff591de70fe`。実results JSON 65,188bytesのSHA256は`f685b813995712c0fd3dca59aa2d41046fdf0bd3ebf26b086c5cd9be7005b838`。実wire/raw、前後SQL再読、invalid alias replay、独立本文所見、元packetとone-off再生手順を保持。認証値／全環境／Git-backed製品sourceは含めない。元Prepared archiveも実行前の原本として保持する。

Primary outcomeは`TECHNICAL_CREDIT`、一般生成品質のhuman acceptance／通常採用は0。`STRUCTURE_MAP_DELTA_NONE`（既存質問判定の活用範囲だけを修復しowner/公開contractを追加しない）。三中核の返答・作品・地図の品質未達、二入力訂正、意味ある履歴、適格sourceでのPiece／Analysis SQL保存、他ARと通常反映・端末は残件。新しい承認Gate・共通framework・controller・checkerを追加せず、今回の拒否修復だけを補助経路全体の完了にしない。

<a id="auxiliary-history-answer-meaning-20261112"></a>
## 9.5 2026-11-12 — 過去の本人回答・撤回を現naturalの研究入力へ移管（準備時点の記録・後続6応答完了）

**11/12・AR-03履歴更新の移管候補：** API `eab40e2fce5420d3ee00e8b64d7890b2d776e2a3`。既存owned-historyの全回答再導出と本人回答active／inactive投影を、naturalの研究明示`use_meaning_support=True`へ接続。原入力・全回答・対応する問いは保持し、最新回答が未対応なら過去の解決済みcheckpointへ戻さずUNASSESSED。補助だけを既存5800byte全messages予算へ収め、超過時は原sourceを削らず補助を外す。自然応答系3module117件成功（既存警告1）。通常提供は未変更。架空履歴3組の旧新6応答・45,136byteの一回比較を準備、Pod送信／実4B生成／学習／再試行／提供再起動0。実出力の改善・通常採用・AR-03完了は未成立。

### 回収した能力と維持する境界

`emlis_thread_history.admitted_history_plans`が各適格過去記録の最新の全回答から`prepare_emlis_meaning`を再導出し、RESOLVEDだけを返す既存責務を再利用する。`natural_reply._answer_meaning_material`で同じ過去request／admitted sourceに結び付く原文anchor・位置を取得し、その過去record内の`answer_meaning`へ置く。新しい作者、classifier、checkpoint保存先、公開DTO／route／SQLは追加しない。

同じ`input_id`の当時の意味だけを扱い、現在の性格・意図へ移さない。本人が訂正したclaim／relationだけをinactiveとして扱い、訂正されていない出来事・選択・感情を消さない。未対応の最新回答はrawの全回答とUNASSESSEDを保持し、古い解釈・AI本文・saved meaning checkpointから補わない。原source認可、権利、履歴選択、source guard、Safety、frame feedbackの現責務は不変。

履歴補助と現在source witnessは既存5800byteの全messages予算を共有する。超過時は既存履歴順の後ろから補助だけ外す。元source自体が上限を超える場合も原文を切らず従来入力を維持する。この上限は任意補助の採否で、原source全体の新しい拒否条件ではない。通常serviceは引き続き`use_meaning_support=False`で、今回の候補を通常生成・保存済み本文へ自動採用しない。

### 今回確認したこと

- 旧新とも同じ隔離SQL／RPCで保存した原入力・本人回答を使う。Freeでは履歴0、Plus／Premiumでは同じ適格履歴だけを使用。
- 新9対照は撤回／更新／未対応×3plan。原入力・全回答・ai_question_contextの完全保持、原文位置、過去保存原本不変、公開DTOへの補助非露出、非生成再読を確認。予算1への強制対照では補助だけ外れ、通常materialへ完全一致。
- 自然応答系3moduleは117 passed／FAIL0／SKIP0、28.63秒、既存Pydantic非推奨警告1。初回は検証fixtureのsnapshot全体比較が可変`now`／変更済みtierまで含めて失敗し、保存原本・thread・eventsだけの不変検査へ是正した。製品sourceの失敗とは数えない。
- 独立読取reviewで補助が既存予算を迂回する問題を確認し、上記の予算共有へ修復。最終reviewにblockingなし。これは別modelのProduct Read・正式商品合格ではない。

### 次の具体的な一回比較

架空の撤回／更新／未対応履歴3組で、同じsourceの補助なし／候補ありの6要求。compact messagesは3,979→5,702、3,961→5,784、3,943→4,578bytes。実tokenizer数・実出力・速度・金銭原価は未測定。既存稼働Pod `f1lle4xwq3wjln`の自然応答用model aliasを提供引数から取得し、同Podの127.0.0.1だけに送る。

一回script45,136bytes、SHA256 `70db62ff7e8e4eb3a1080197247f3f6252cbe9d9bc86170706e8f6a03ffa8a28`。最大420秒・6生成・各60秒期限、学習／再試行／提供停止再起動／重み変更0。既存`EMLIS_NATURAL_REPLY_API_KEY`一鍵だけを同Pod内認証へ使い、全環境の読取・鍵値の表示／保存／外部出力はしない。前後healthとPIDを確認し、専用出力folderの再利用を拒否する。前回7callの承認は完了・消費済みで、新しい一回へ流用しない。新しい具体承認前のPod送信／生成は0。

準備原本 `Cocolon_CMEE_AR03_HistoryMeaning_Prepared_20261112.zip`、Library ID `libfile_fde3_f-e61ca84c43ac819183e9e3c7f762275f_2f7470f963808191aaebf050935e72de`、17,406bytes／4members、SHA256 `43c49f7e74290610bd041516f6fd6f23c8d0cf37c64aff511d073ee166b42c81`。Git-backed製品source・認証値・全環境は含まない。実行後は6本文を原文と比較し、意味保持・撤回復活・別時点混同・自然さ・反復を華恋が全件読み、改善が成立した場合だけ通常採用を検討する。不成立時に同じprompt試行を自動反復しない。

STRUCTURE_MAP_DELTA_PRESENT（研究明示時の履歴意味投影に既存ownerを再利用）。商品品質の改善・human acceptance・通常採用は未成立。二入力訂正、一般生成品質、Piece／Analysisの適格SQL保存、live／本人端末、他ARは残件。

<a id="auxiliary-history-answer-actual6-20261112"></a>
## 9.6 2026-11-12 — 承認された履歴3組の実4B旧新6応答・通常採用を見送り

**11/12・AR-03の実4B比較6応答を完了・通常採用は見送り：** 承認された45,136byteのscriptを既存Podへ送り、架空履歴3組の旧新6応答を一回・17.846694秒で取得。全HTTP200／stop、学習・再試行・提供再起動0、PID73476／health200を前後維持。候補は撤回例の一部未根拠説明を減らしたが復唱中心で、追加回答例では過去だけの「重かった」が今回の気持ちとして読める記録・時点の曖昧さを残した。現parserは4受理／旧2質問拒否、受理4の非生成artifact再読は一致したが意味比較は全UNASSESSED。実Q3 SQL保存／通常採用／本番反映・端末は未実施。API eab40e2の既存2CIは成功。原本を同じ保存IDのversion1へ更新し、次は作者材料の過去／今回の所属を明瞭にする修正へ戻す。AR-03／全補助経路は未完。

### 実行と原本

Mashが§9.5のscript45,136byte・架空3組／旧新6応答・最大420秒・一回、学習／再試行／提供再起動0、既存一鍵の同Pod内認証だけの使用を具体承認した後に実行。送信後にbyte数・SHA256 `70db62ff7e8e4eb3a1080197247f3f6252cbe9d9bc86170706e8f6a03ffa8a28`・結果folder不存在を確認した。Jupyterの端末入力timeoutは実行開始前の操作であり、モデル再試行ではない。新端末で`timeout 420s python3 -u`を一回実行した。

全6要求を既存の`cocolon-qwen35-4b-base-851bf6e`へ送信し、全HTTP200／stop、17.846693731844425秒。前後PID73476／health200を維持。学習・モデル再送・提供停止再起動・重み変更・新規レンタル0。名前を指定した既存自然応答用一鍵だけを同Pod内認証に使い、全環境の読取・鍵の表示／保存／外部転送は0。金銭原価・正確なtoken数は未測定。

同じ保存ID `libfile_fde3_f-e61ca84c43ac819183e9e3c7f762275f_2f7470f963808191aaebf050935e72de` の `Cocolon_CMEE_AR03_HistoryMeaning_Prepared_20261112.zip` をversion1へ更新。準備時の4原本を変更せず、実response6、集約results／summary、現parserとartifact再読結果、root／独立読取所見、offline再生scriptを追加した。45,783bytes／20members、SHA256 `ed72f0e76497019535e044bea464cf373b2fa913109e47e8ce57f53cdd821a72`。集約実resultsのSHA256 `6a457643bd2472382ae71808210ca54731891d3506c81fa69a24150deb895480`。version0の準備時hash／17,406bytesはその版の履歴であり、現version1のサイズと混同しない。認証値・全環境・browser screenshot・Git-backed製品sourceは含めない。

### 本文の全件読取

| 条件 | 旧応答 | 候補応答と判断 |
|---|---|---|
| 過去の撤回 | 今回の「嬉しくなかった」を言い換え、不安から言葉の重みへの敏感さ等を補う | 未根拠な敏感さ等は消えた。一方、今回の原文の復唱・記録解説が中心。過去の撤回を正しく活用した本文の証拠ではなく、一般品質の成立にしない |
| 過去の追加回答 | 今回の引用の直後に「その時…重かったのでしょうか」と質問する | 過去回答だけにある「重かった」を、今回引用の直後の「その時」へ留保付きで接続する。過去の記録への明示的帰属がなく、今回の感情を補った読みになる／少なくとも曖昧。「ようです」だけで時点・sourceの結合は修復されないため通常不採用 |
| 過去の未対応回答 | 「どのような意味として届いたのでしょうか」と未分離の問いを出す | 「どのような意味として届いたのか、少し気になります」へ変更。本人の「はい」から感情を創作していないが、自然な完了応答・意味ある履歴利用の改善は未成立。この句だけを新しい質問guardの根拠にしない |

rootと別agentが全6本文を各原入力／過去回答と照合した。現在の入力自体にある「嬉しくなかった」は撤回されていない。過去撤回から反対の喜びを作らず、過去の重さを現在の気持ちや意図へ移さないという比較基準を維持した。正式human Product Read、品質合格率、商品受入れへ変換しない。

### 現providerと保存・再読の確認範囲

全6のprepared source prefix／material／messagesと実wire JSONを照合し、現`SelfHostedNaturalReplySource`へ同じ実rawをMockTransportで再生した。追加GPU呼出し0。現parserは4受理、旧追加回答／旧未対応回答の2件は`natural_reply_invalid`で拒否。受理4は同じ`NaturalReply`をlocal artifactへserializeし、現validateによる非生成再読で全文・model・source prefix一致。有限意味比較は4件ともUNASSESSEDで、時点間の感情転用を検査済みとしない。SDKと元runnerはJSON key順が違うため、request JSON一致とwire-byte一致を混同しない。

この確認はQ3の実SQL／RPC保存ではない。今回の6要求に対応する完全なthread／guard snapshotを準備原本へ保存していなかったため、同じsource prefixのSQL保存成功は未成立。別thread／guardへ置換して同一実requestの成功と扱わず、品質未達の候補を通常保存へ進めない。live Auth／DB／Render／本人端末・native確認0。

API source `eab40e2fce5420d3ee00e8b64d7890b2d776e2a3` の既存Piece CI43202945908とAnalysis CI43202946051はsuccess。local117成功は準備時の結果として保持し、追加6生成や新規検証117件とは数えない。今回製品source／testの変更・CI再実行0。

### 次へ残す原因候補と境界

候補の過去意味は正しい過去input_id配下にあるが、再利用されたrecord-local fragmentには`CURRENT_INPUT`、actorには`current_user`が残る。これらは元記録内のsource役割・本人を表す内部値であり、現在時点の根拠ではない。作者側が場面を混ぜた原因候補として記録するが、この一組から単独原因と断定しない。

次は既存作者に渡す過去解釈の記録・場面への所属と、過去／今回の出来事・感情の区別を明瞭にする最小修正へ戻す。原source role／locatorを改竄せず、作者用投影・指示の既存ownerで扱う。新しいchecker、強制拒否器、第二作者、履歴削除、旧controllerは追加しない。同じprompt試行・新GPU／学習・通常採用へ自動進行しない。今回承認の6callは完了・消費済み。

STRUCTURE_MAP_DELTA_NONE（今回の実行・読取・状態更新で製品owner／route／DTO／DB／source責務は変更0。§9.5の研究候補における既存能力移管は継承）。AR-03・二入力訂正・一般応答品質・Piece／Analysisの適格SQL保存・通常接続／端末・全補助経路は未完。

<a id="auxiliary-history-record-scope-prepared-20261112"></a>
## 9.7 2026-11-12 — 過去の意味を所属記録へ明示する作者用投影（比較前の記録・後続実6完了）

**11/12・AR-03の過去記録への所属を作者材料へ明示（比較前候補）：** API `493cd728c542384b8ab00877d7cbac2dbd02b484`。研究明示時の過去answer_meaningを専用私的版へ分け、admittedな過去envelopeからsource_record_idを付与。CURRENT_INPUT／current_userはその過去記録内の呼称と説明し、過去の気持ちを今回へ足さないよう明示。元のrole／actor／locator／active・inactive／原入力・全回答は保持し、通常material・SYSTEMと前回6要求の再現性も維持。関連118件成功、最新第2回答が未対応の際に旧解決済み解釈へ戻らないことも確認。3組×旧新6要求を全thread／guard原本付きで準備し、合成providerで実隔離SQL保存・非生成再読6件成功。前回実6の通常不採用を継承。新実4B・Pod送信0、通常適用・商品改善は未成立。

### 前回の実失敗へ戻した修正

§9.6で過去だけの「重かった」が今回の引用直後へ結び付いたため、作者用の過去意味へ所属recordを明示する。`natural_reply.py`の既存研究分岐内で、意味を`natural_history_answer_meaning.v1`として区別し、`past.original.envelope.source_record_id`を`source_record_id`へ付与する。これは既存admissionで原入力ID／guardとの一致を確認した後の投影で、model・本人入力から所属を受理しない。

元のsource_fragmentsにあるCURRENT_INPUTはその過去記録内の原入力、actorのcurrent_userもその記録者を表すと作者へ説明する。原role／actor／locator／claim／relationを改名・改変せず、activeな過去の気持ちを今回へ足さない。同文の過去と今回が同一出来事か不明であることと、別出来事と断定することを分ける。過去を使う場合は文章上も場面を区別し、inactiveを復活させず、UNASSESSEDは読取未確定のまま保つ。記録日時を出来事日時へ変えない既存SYSTEMも維持する。

旧`natural_answer_meaning.v1`の過去SYSTEMを残し、前回の固定6要求を再現可能にする。今回のcurrent回答の同schema・指示は不変。通常serviceは引き続き`use_meaning_support=False`であり、新しい私的schemaは研究時の作者用投影だけ。公開DTO／RPC／DB／RN／Safety／履歴資格・選択／source prefix／保存済み本文を変えない。任意補助は所属を含む一式で5800byte予算へ従い、超過時に原入力・回答を切らず補助だけ外す。

### 今回の確認

- 最終sourceに対する自然応答系3moduleは118 passed／FAIL0／SKIP0、25.40秒、既存Pydantic非推奨警告1。前回117に新1を加えた集合で、繰り返し実行・subtestを加算しない。新1は解決済み第1回答に続く第2回答が「はい」で未対応となった履歴を実保存し、旧RESOLVEDへ戻らず全2回答＋UNASSESSEDを渡すことを確認。
- 既存9対照を新しい所属・予算へ更新し、過去IDと今回IDの分離、原入力・全回答・原文位置・inactiveの保持、Free履歴0、公開非露出、予算不足時の完全な通常material fallbackを確認。
- 前回の保存済み6要求は、SYSTEM／materialの完全一致を維持。次の3組では旧API eab40e2のcanonical blob `b619894bd1976b74508d5ac7fee7a23af767c9cd`を読み込み、通常material／SYSTEM／source prefixが修正前と一致することを確認した。
- rootと別agentの読取reviewでblockingなし。inactiveの復活禁止と通常SYSTEMの一致assertを補った。通常利用や別model Pro Product Read・商品受入れの成立ではない。

### 保存・再読へつながる次の6要求

前回と同じ本文を使う架空の撤回／追加回答／未対応の3組を、新しい隔離SQLのsource／thread／時刻で具体化し、前回不採用v1と今回のscoped版を一組ずつ比較する。これは前回6要求と同一IDの再送ではない。各組内は同じ原入力・全回答・問い・ID／時刻・guard・source prefixを共有し、差は作者用schema／所属field／対応SYSTEMだけ。前回の保存rawを今回版の実出力へ読み替えない。

currentは問いOFFのFINALとして準備し、過去の問い・本人回答はsourceに残す。AI bootstrap本文はmodel材料に入れない。旧／新messagesは撤回5701／5705、追加回答5784／5788、未対応4578／4582bytesで、全6が既存5800byte以内。

前回欠けていた`before CALL_STARTED`の完全なthread・原入力・全events・履歴guard・所有者の隔離原本を、既存CaptureStore／dump_rowsの方法で保持した。次のrawを現SelfHosted provider→既存service action→同じsourceのSQLへ再生できるよう、6要求の合成providerリハーサルでwire bytes／source prefix一致、実隔離SQL保存と別serviceの非生成再読を確認。ここで使った本文は合成fixtureであり、実4Bや商品品質の成功に数えない。通常serviceの準備に対し研究promptをoffline providerへ明示注入する確認で、研究版の通常採用でもない。

歴史的なactive attemptの解放は隔離fixture内のworker_interrupted遷移だけ。source／event ID、回答、guardを変更せず、既存retry actionが現在のDB時計で新attemptを取得する。live SQLへの遷移・実GPU再試行はない。前回6件について欠けた原本を後付けで生成し、前回のSQL保存成功とすることもしない。

### 実行準備と未実施

一回script50,167bytes、SHA256 `f2e7fe6c88bf870623fe783657af0d2eb935e2251674407aa5b90f4a6672c51a`。既存Pod `f1lle4xwq3wjln`へ旧新6要求、最大420秒／各60秒、追加学習／再試行／提供停止再起動／重み変更0。既存自然応答用一鍵だけを同Podの127.0.0.1認証へ使い、全環境読取・鍵の表示／保存／外部出力0。前後health／PID確認、redirect／proxyなし、専用folderの再利用拒否を維持。Pod送信・新実4B生成0で、新しい具体承認前には実行しない。前回6callの完了承認は流用しない。

準備原本 `Cocolon_CMEE_AR03_HistoryScope_Prepared_20261112.zip`、Library ID `libfile_fde3_f-3cb503c7691c8191b4a2cc3dde580427_2f7470f963808191aaebf050935e72de`、42,476bytes／9members、SHA256 `b19add959a4e8bf7471ab33c1b1b6bf1bb96f4345a90c1729b399e8094b02183`。全frozen rows・request・一回script・合成SQL往復・再生手順を保存し、Git-backed製品source／認証値／実本人入力／browser screenshotは含めない。含まれるfrozen requestを再生する際はbuilderを再実行してIDを作り直さない。

STRUCTURE_MAP_DELTA_PRESENT（既存研究作者投影に所属記録を持つ私的版を追加。新作者／controller／reader／公開型・route／DB・fileは追加0）。旧実6の不採用、通常flag OFF、意味・自然さ・履歴利用の実4B未達、AR-02二入力訂正・他AR／live・本人端末・正式受入れは維持する。CPU／合成SQL成功を可視品質改善へ換算しない。

<a id="auxiliary-history-record-scope-actual6-20261112"></a>
## 9.8 2026-11-12 — 所属修正版の実6応答・同sourceのSQL保存再読を完了、通常不採用

**11/12・AR-03所属修正版の実6応答を完了・通常不採用：** 承認された50,167byteの一回scriptで旧新6応答を13.914481秒、全HTTP200／stop。学習・再試行・提供再起動0、前後PID73476／health200維持。同じ原入力・回答・guard・source prefixと実wire／rawを保ち、現provider→既存service／実隔離SQL保存→別serviceの非生成再読を全6で確認。一方、修正版も過去だけの「重かった」を今回の感覚へ結び付け、撤回は復唱、未対応は長い記録・不明説明が残る。意味比較は全UNASSESSED。通常flag OFF／商品受入れ0を維持。原本をversion1へ更新し、同類のSYSTEM追記試行を止め、既存教示・学習資産で場面帰属をどう教えているかの照合と有限教示案へ戻す。新学習・追加GPUは未実施、AR-03／全補助経路は未完。

### 承認範囲と実行結果

Mashが50,167byte・架空3組の旧新6応答・最大7分／一回・学習／再試行／提供再起動なし・既存一鍵の同Pod内認証だけを具体承認した後に実行。送信後にbyte数・SHA256 `f2e7fe6c88bf870623fe783657af0d2eb935e2251674407aa5b90f4a6672c51a`・結果folder不存在を照合し、`timeout 420s python3 -u`で一回実行した。6/6 HTTP200／stop、13.914480649866164秒。前後PID73476とhealth200/200、model alias `cocolon-qwen35-4b-base-851bf6e`を保持。

学習・候補再送・提供停止再起動・重み変更・新レンタル0。自然応答用の名前を指定した既存一鍵だけを127.0.0.1認証に使い、全環境読取・鍵値の表示／保存／外部転送0。結果取得中のbrowser transport一時切断は既存tabで復旧し、modelを再実行していない。正確なtoken数・金銭原価・一般性能は未測定。

### 原入力と全6本文の読取

| 対照 | 旧v1補助 | 所属明示版と判断 |
|---|---|---|
| 過去の撤回 | 今回の嬉しくなかったことと中程度の不安を記録として解説 | 今回の「嬉しくなかった」を短く復唱。今回を誤って撤回しない点は保持するが、過去撤回の適切な利用を実証した本文ではない |
| 過去の追加回答 | 「褒められた時に嬉しくなかった、その時は重かった」と過去回答だけの評価を曖昧に接続 | 「褒められたのに嬉しくなかった、その感覚は重かったんですね」と今回の感覚へ接続。source_record_idと説明を付けても同じ場面混同が残り、通常採用しない |
| 過去の未対応回答 | 不安から言葉の裏の意味・期待が潜むという根拠薄い推測を加える | 推測の断定は減ったが、感情・記録・不明点を5行で説明する。自然な完了応答と意味ある履歴利用の改善は未成立 |

rootと別agentが3組の全原入力／過去回答と6実本文を独立に照合した。過去だけの重さを今回の気持ちへ移さず、過去撤回を今回の否定へ広げず、「はい」から説明を補わない基準を維持する。今回の反復・自然さ・場面帰属の不足を、本文の短さやmachine成功で薄めない。局所的な推測減少を全候補の品質合格へ換算せず、正式Product Read／human acceptanceは追加0。

### 同一source・実rawのSQL保存と非生成再読

§9.7で保持した各組の完全なbefore-CALL_STARTED rowsとsnapshotを、6件それぞれの独立隔離SQLへ復元した。原入力・全回答／問い・所有者・全ID／時刻・履歴guard・source prefixを維持し、現`SelfHostedNaturalReplySource`へ取得済み実rawをMockTransportで一回ずつ再生。実request JSONとwire SHA、実response SHAを照合し、既存retry action→service→実SQL/RPCの新OBSERVATION保存と、別service GETの非生成再読が全6で成立した。本文は既存adapterの外側strip以外で修補していない。追加GPU呼出し0。

歴史的active attemptの解放は、既存の隔離fixture内のworker_interruptedへの最小遷移だけ。source・event IDやguardを書き換えず、既存actionが現在のDB時計でattemptを取得する。新しく保存された同source OBSERVATIONとDTO eventを照合し、過去に残った観測を今回の成功へ算入しない。

通常serviceのsource admissionと保存責務を維持し、研究promptはoffline providerへ明示注入している。これは同sourceの隔離保存成立であり、通常serviceへの研究生成の採用やlive Auth／Supabase DB／Render・本人端末の成功ではない。6件の有限意味比較は全てUNASSESSEDで、過去の評価の現在への混入を検査済みとしない。形式検査・保存の成功は、今回の通常不採用を覆さない。

API source／test変更0。準備API493cd728の既存local118成功を保持し、今回の新118件とは数えない。Piece CI43227044634はsuccess、Analysis43227044779は最終照会時in_progressで成功を主張しない。CI dispatch／rerun0。

### 実原本と次の判断

同じ `Cocolon_CMEE_AR03_HistoryScope_Prepared_20261112.zip`／Library ID `libfile_fde3_f-3cb503c7691c8191b4a2cc3dde580427_2f7470f963808191aaebf050935e72de` をversion1へ更新。準備時の9membersを保持し、実raw6／集約results／public summary、actual SQL replayの保存snapshot・DTO、全件所見を追加した。74,027bytes／20members、SHA256 `803ea49251eaec98b1f5c7391afb8a2185c163e6ac422b1eebc0364ec34da630`。実results40,404bytesのSHA256 `5bfd5e095bd8af87bc2c872fdd1b28107cbef39c8a5d96d35b66eb9302d29e59`。準備時version0の42,476bytes／旧hashと混同しない。認証値・全環境・browser screenshot・Git-backed製品sourceは含めない。

今回の所属field・説明だけでは、前回と同じ場面混同を解消していない。これ以上の同類SYSTEM追記・新拒否器・同じ試験の自動反復へ進まない。次は既存4B教示／学習／候補比較資産を読み、今回と過去の同じ語句、過去だけの追加評価、過去撤回と今回の保持、未対応回答がどのように教えられているかを先に照合する。その範囲で必要な最小のsource対照・自然応答教示案と、別表現／別場面の未学習対照を具体化する。

実失敗rawは評価証拠として保持し、正しい教師本文やMash逐語教師へ変換しない。教示候補の作成・学習必要性・GPU学習の実施・通常重み採用は別状態であり、今回の結果から追加学習の必要性や実施を確定しない。今回6call承認は完了・消費済み。新GPU／fit／retry／新weights／通常採用・本番反映へ自動進行しない。

STRUCTURE_MAP_DELTA_NONE（実行・読取・保存再読・状態更新で製品owner／public型／route／DB／ファイル責務の変更0）。既存研究候補は保持するが通常flag OFF。AR-03・AR-02二入力訂正・一般応答品質・他中核／他AR・本番／本人端末／正式受入れは未完。


<a id="auxiliary-history-teaching-cpu-20261112"></a>
## 9.9 2026-11-12 — 既存44教師と場面帰属を照合、教示8件・限定対照4件のCPU準備

**11/12・AR-03の既存44教師照合と教示草案をCPU準備：** 実44行は全て当回だけで、過去記録／本人回答／answer_meaningの直接教示0。華恋作成の架空教示8件と限定開発対照4件を、現API493cd728の既存SQL／service／source ownerで実発行問い・回答付き履歴から準備。別題材案8件は問いが発行されず未準備を保持。準備12件の意味補助は7件UNASSESSED／5件容量省略でRESOLVED0、原入力・全回答は保持。学習効果・通常採用の証拠ではない。GPU／model load／学習0、実tokenizer・初期base／LoRAは未確定。先行実6の場面混同・通常不採用を維持し、次は既存encoding部品で今回12件の学習範囲・長さを具体化する。新学習／GPUへ自動進行しない。

### 既存資産と、今回の教示候補

MixedReplay44の実原本を取得し、全44行のsystem／user／assistantを確認した。past_user_records／current_answers／user_frame_feedbackが全て空で、answer_meaningもない。同一記録内の昔／今日、怒りの否定、共存する感想は扱うが、記録をまたぐ本人回答・訂正・撤回の直接教示はこのpackにはない。全既存教材に教示がない、不具合の原因が教材不足、追加学習すれば直る、とは断定しない。

旧runnerはfree・events=[]・補助OFFと旧不採用重みを固定するため丸ごと再実行しない。既存encode_training／teacher_lossのassistant-only、単一終端、無切詰めの部品を再利用候補として確認した。旧44教師・重み・source prefixは変更せず、今回の履歴source identityは現ownerから導出した。

教示T01–T08は全て華恋の架空草案で、Mashの逐語教師・実入力・承認済み正解ではない。過去だけの評価／今回明示の評価、同文の別場面／明示回想、過去の原文反応撤回／今回の同文保持、未対応回答／明示された過去との接続を扱う。T02・T04・T08では使える履歴を使い、全履歴無視を成功へ数えない。譲歩を因果へ変えない本文に修正し、本文としてrootと独立agentが読んだ。過去の原文反応の撤回を、別sourceの選択感情の全撤回へ広げない。

先行する実失敗「褒められた／過去だけ重かった」の3組は既露出の評価証拠として保持し、教師やMash教示へ変換していない。別題材H01–H08は、現serviceが問いを発行しなかったため想定回答付き履歴を準備できず、原案を未準備で保持した。手作りQUESTIONや回答・RESOLVEDの注入は0。D01–D04は既存の過去の誘い／依頼文型を使い、今回の場面・表現を変えた限定開発対照である。教師と語彙・責務が重なるため、完全に独立した未知品質や広い一般化評価とは扱わない。

### 現ownerで成立したCPU範囲と不足

API493cd728の既存Q3隔離SQL/RPC・serviceで、実発行問い→本人役の回答保存→完了履歴→今回問いOFF→hydrate／source admission→ordinaryと研究用materialを導出した。T8＋D4の全12件で、過去入力と全回答、二欄・感情ごとの強度・複数カテゴリ、原文と補助のsource prefix一致を確認。関係する製品6fileと既存fixture2fileのGit blobは同headと一致する。前回以前のsource prefixを新しい入力へ流用していない。

T8の意味補助は4件UNASSESSED・4件が既存5800byte予算による省略。D4は3件UNASSESSED・1件省略で、**準備12件のRESOLVED補助は0**。全原入力・回答は保持し、補助が落ちた入力を短く修補して補助付き成功にしていない。この草案は原履歴を読むための教示であり、active／inactive補助の利用成功・検査精度・学習効果を実証していない。

bootstrapの合成応答はライフサイクル用で、teacher targetでも実4B rawでもなく、モデル入力から除外する。保存snapshotはmaterial導出用で、完全なSQL全表復元原本や、実model rawの保存・非生成再読とは呼ばない。実RN入力・live Auth／Supabase／Render／本人端末・正式受入れも未確認。

草案探索と修正後の最終準備をCPUで実施した。model load／GPU call／学習更新0、tokenizer・template・mask・token長は未確認。製品source／test変更0、先行118成功を今回の新件数へ加算しない。Analysis CI43227044779を同API493cd728のcompleted/successとして再照会、Piece43227044634の先行成功も保持。dispatch／rerun0。

### 保存と次の一作業

新原本 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip` をLibrary `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` version0へ保存。41,262bytes／8members、SHA256 `c53eeb21a9aca42b33e22ac9742327de00e205f310ce829fabfc66af9b190e36`。草案全20件、実発行問い・未準備理由・準備済み12messages／snapshot／source prefix、旧44のsource形照合、未改変の既存encoding部品、CPU準備source、関係するGit identityと限界を保持。認証情報・全環境・画像・Git-backed製品sourceを含めない。旧MixedReplay44教師SHA256は `e1872344ce3842c0d59ed13fc82c1ca99a3a83b33514d2d91ac5a9e4d12db2f9`、原本Library v0を不変参照する。

次は凍結したT8＋D4のmessages／source prefix／snapshotを保ち、実cached tokenizer／chat templateと初期base／LoRAの選択を具体化し、既存encode_trainingでassistant-only mask・単一終端・無切詰め・context長を確認する。旧44runner全体や新しい学習基盤・checkerへ置き換えない。その確認前にfit承認を求めず、更新数・比較数・時間枠・実行承認は今回から生成しない。先行実6の承認は消費済みで、新GPU／fit／提供再起動／重み変更／通常採用へ自動進行しない。

primary BLOCKER_NARROWED。STRUCTURE_MAP_DELTA_NONE（製品owner／route／公開型／DB／RN／Safety変更0）。先行実6の品質失敗・通常flag OFF、AR-03・AR-02二入力訂正・一般品質・他AR／三中核・本人端末・正式商品受入れの未完を維持する。



<a id="auxiliary-history-tokenizer-fit-prepared-20261112"></a>
## 9.10 2026-11-12 — 実tokenizer・学習範囲を確認、16更新の一回案を準備して承認待ち

**11/12・AR-03の実tokenizer確認を完了、16更新比較案は未実行：** 凍結T8＋D4を既存PodのCPUで5.025885秒、同851bf6eの非thinking templateと既存encoding部品で確認。全12入力・source prefix不変、T8のassistant-only mask／単一終端／無切詰め成立。最大prompt1213・training1238、GPU／model load／学習／提供再起動0、PID73476／health200維持。同じ固定baseからfresh LoRAを作る一回案を23,353byteへ具体化し、T8の16更新＋前後22比較・提供前後4確認を復元込み最大600秒に固定。packet未送信／未実行・個別承認待ち。準備12件のRESOLVED補助0・H8未準備・先行場面混同・通常flag OFFは不変。

### 実CPU確認

既存Podのcached Qwen3_5Tokenizer／固定851bf6e、transformers5.19.0／tokenizers0.23.3／torch2.8.0+cu128を使用した。旧44runner全体を動かさず、未改変の既存encode_trainingとassistant_loss_windowだけを呼び、凍結T8＋D4の12messages／source prefix一致、T8のprompt完全mask・assistant本文＋単一終端・切り詰めなしを確認。最大prompt1213＋生成予約2048＝3261でcontext8192内、最大training1238、教師の学習対象は13～25token。template／tokenizer filesのhashは前後同一。

CPU処理5.02588485297747秒／上限120秒、CUDA未初期化、model load／GPU call／学習／提供再起動0。前後PID73476、health200/200。鍵ファイル・全起動環境を読み取らず、後続の復元対象についてはprocessの非秘密な識別情報と既存adapter hash／GPU使用量を読み取った。元提供・既存重み・通常設定の変更0。

Pod原本48,921bytes／4members／SHA256 `c19816827a0095acb3cd5f3f5ded40c0155d0ee1983990a2bc6a8b4afea5fc31` を回収し、CRC・全12入力・token配列／mask／loss範囲をPod外照合。inputs57,194bytesのSHA256 `85ff5bc3bf3dbf8729b58ae273abf8010201616b53196892452ada913b11d850`。このtechnical creditはtokenizer／mask／長さだけで、4Bのforwardや学習効果・商品品質ではない。

### 初期化と一回比較の具体案

fresh API493の通常naturalはbase_inference_contextでAnalysis adapterを無効にする設計。一方、稼働PodはPiece用の派生serverであり、model aliasやhealthだけでlive source／全base重みをcurrent Gitと同一認定しない。今回の初期候補は、同じ固定base851からfresh LoRAを作る方式とする。旧db／replay44の不採用重みは引き継がない。

既存fit24のr8／alpha16／dropout0、56module／112tensor／3,833,856parameter、assistant-only CEを再利用する。これらは既存実設定で、今回の新adapterを作成済みとはしない。seed42／AdamW／LR1e-5／weight_decay0／clip1は今回の候補で、最適性・改善を保証しない。

| 実行対象 | 固定する件数 |
|---|---:|
| 架空T8 | 各2回、16更新だけ |
| 限定D4＋既露出scoped失敗3 | 前後14生成 |
| 既使用plain4の保持 | 前後8生成 |
| 元提供のnatural／Analysis | 停止前各1＋復元後各1、4生成 |
| 上限 | 研究22＋提供4＝26生成、再試行0 |

plain4は日常の喜び／未入会・未決定／兄と本人の所有／原因不明を扱う。現source ownerから再導出し、旧messages・source prefixと一致。既失敗3のmessagesは前回凍結原本から変更0、教師化0。D4は既存文型からの限定対照で、広い未知評価へ数えない。教師全8件の追加生成は行わず、loss前後は非生成の診断として分離する。

全体600秒を一つの時計で管理し、研究処理を開始から330秒、学習を180秒へ制限。子終了、元提供の一回復元に最大180秒、前後確認とarchive時間を先取りする。停止前にCPU準備・全prompt長・元source／adapter・前確認を終える。停止前の失敗では元提供へ触れず、停止要求後は同じPIDの終了を確認してから、元argv／起動環境／cwdで一度だけ復元。SIGTERM後の一時health200を復元完了とせず、二重起動・候補の通常登録・追加runをしない。

実行時に限り、認証情報を含み得る起動環境全体を同Pod内メモリだけへ一時保持して元提供の復元へ使う。既存natural／Analysisの名前を指定した2鍵を同Pod127.0.0.1の前後確認認証にだけ使用。環境・鍵値のログ／artifact保存・外部転送0、学習子は固定した必要環境のみ。新規レンタル・依存install・本番設定／DB変更0。読み取り時のGPUはRTX4000 Ada／20,475MiB／使用10,886MiB。新学習のVRAM／所要は未測定で、完走を保証しない。

独立code reviewで、fresh reload前のGPU参照残存、SIGTERM後の復元分岐、終了競合による復元漏れを修正した。syntax・件数・凍結入力・同梱hashを確認したが、新runnerのGPU／停止復元runtimeは未実行。実22本文は原文と並べて全読し、過去評価の今回への転送・撤回scope逸脱・「はい」からの補完・本人の受け取りの事実／相手意図化・plainの退行があれば不採用。D04で履歴を無視しただけなら意味ある履歴利用は未成立。loss・EOS・保存reload・UNASSESSEDは意味品質の証明ではない。

### 保存・承認境界と残件

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion1へ更新。127,415bytes／16members／SHA256 `793ed2dda26dbaaaa8e58e843bdb14084d4c1e0ff4166677e729fcf43cdebadf`。version0のsource7membersを原bytesで保持し、旧READMEも別名で保持。CPU原本・所見・source・UIで読んだ復元対象の非秘密な識別情報・未実行の一回packetを追加した。browser screenshot・credential・環境・Git-backed製品sourceは含めない。

送信候補packet `ar03_history_fit16_prepared_20261112.zip` は23,353bytes／5members、SHA256 `0031bd6d17934bfe06f3e9a5b762672c6fcfac275733df5b8823ff19e0dcda6e`。未送信／未実行。追加学習と提供の停止・復元は、消費済みの学習／再起動なし6call承認を超えるため、上の具体scopeでMashの個別承認を待つ。今回の準備からGPU／fitへ自動進行しない。

primary TECHNICAL_CREDITは実tokenizer／mask／入力長の成立に限定。STRUCTURE_MAP_DELTA_NONE。準備12件のRESOLVED補助0、UNASSESSED7／容量省略5、H8未準備、先行実6の場面混同・通常flag OFFを維持。AR-03・二入力訂正・一般品質・他AR／三中核・live反映／本人端末・正式商品受入れは未完。実rawのSQL保存・非生成再読も、今後のGPU比較結果とは別に確認する。



<a id="auxiliary-history-fit16-preflight-alias-failure-20261112"></a>
## 9.11 2026-11-12 — 承認済み一回がmodel照合で停止、引数一項目の修正版は新承認待ち

**11/12・AR-03の16更新案は開始前照合で停止、model引数だけを修正：** 承認済み23,353byteを送信・原本照合して一回起動したが、Analysis controlの仮model名が実設定へ結び付いておらずAssertionError。華恋の準備ミスで、学習／研究生成／提供対照／停止・再起動0、鍵・全環境読取0、PID73476／health200維持。失敗原本を回収し、model1項目とpack hashだけを修正した23,350byteの別packetを準備。教師・比較・code・上限は不変、未送信／未実行。旧一回承認では再実行せず、新しい一回の具体承認待ち。品質は未評価、通常flag OFF・全補助経路未完を維持。

### 実行した一回と確認結果

Mashが§9.10の23,353byte・T8の16更新・研究前後22＋提供前後4確認・元提供の停止復元込み最大600秒／一回／再試行なしを承認。既存Podへ送信後、byte数とSHA256 `0031bd6d17934bfe06f3e9a5b762672c6fcfac275733df5b8823ff19e0dcda6e`、CRC、5fileの内容hash、新folder不存在を照合して一回だけ起動した。

実行は `run_and_restore.py` のcontrol model名照合でAssertionErrorとなった。Analysis要求に仮の `observed_provider_alias` が残り、実設定 `cocolon-qwen3.5-4b-analysis-semantic-120u` と不一致。natural modelは一致。華恋が、前の比較scriptが送信直前に実設定から埋めるmodel名を、今回の固定packへ反映し忘れた準備ミスである。modelの理解品質、GPU容量、鍵や提供の障害としない。

read-onlyの事後確認で、PID73476／health200、元source hashと5fileの凍結bytes一致、started marker／fit_started／restoration記録／candidate adapterの全不存在、control artifact0を確認。sourceの処理順も照合し、全環境・鍵ファイル読取、provider control、停止、学習子より前の停止と確認した。学習・研究生成・対照生成・停止／再起動は全て0。今回22本文はなく、改善・保持・意味品質は全て未評価。失敗を復元成功やGPU実行成功へ読み替えない。再試行0。

失敗Pod原本 `failed_attempt.original.zip` は24,119bytes／7members、SHA256 `64aeda1cbfc1ad7d58baeb6b7b0e1bb1733c49fb0302ba2cd6105dd3d546d07d`。回収JSONのexact値を根拠とし、CRC・承認済み5fileのbyte一致をPod外でも確認。旧承認packetと失敗folderは変更しない。正確な処理秒数・原価は未測定で、稼働保持の料金を0とはしない。

### 最小の引数修正と次の一回

別packet `ar03_history_fit16_alias_fixed_prepared_20261112.zip` を準備。23,350bytes／5members、SHA256 `ef99b2cad3bb79437153d2a73cbcd592188a84ae8f9cf0138cdb27c95dde00f6`。変更は `controls[id=analysis].body.model` の一項目を回収した実設定へ結び付けることと、`files.json`内のpack digest更新だけ。実行code2file・READMEはbyte同一、plan・教師T8・比較11・他control・全messages／source prefixは変更0。独立agentもJSON leaf差分1、code bytes、5members／CRC／全digest一致を確認した。

T8の16更新、研究22＋提供4＝26生成、全体600秒／研究330秒／学習180秒、元提供一回復元、既存2鍵の同Pod認証、認証情報を含み得る起動環境を同Pod内メモリだけに一時保持して復元へ使う範囲、通常採用falseは維持する。新method／loss、教材や比較の差替え、追加生成、既存重みの採用へ広げない。

新packetは未送信／未実行。旧承認が一回・再試行なしのため、失敗した一回を自動再実行せず、この具体修正後の新しい一回についてMash承認を待つ。実行時は旧失敗folderと別のfresh folderへ展開する。今回の修正確認は引数不一致までで、新GPU／学習／復元のruntime成立を主張しない。

### 保存と状態

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion2へ更新。181,214bytes／22members、SHA256 `c5fe1a1970fb65fb4b85f2c5ac525d6546bb1d502b1c81682eaa2cc9809439d4`。version1の旧原本・CPU結果・23,353byte packetを不変保持し、旧READMEも別名保管。失敗原本／事後確認JSON／最小修正版／差分と承認境界を追加。秘密・全環境・browser screenshot・Git-backed製品sourceは含めない。

primary BLOCKER_NARROWED。先行する実tokenizer／mask／長さのcreditは保持し、新GPU・商品credit0。製品source／test／API／DB／RN／Render／Supabase変更0、STRUCTURE_MAP_DELTA_NONE。通常flag OFF、準備12件のRESOLVED補助0、H8未準備、先行実6の場面混同、AR-03・二入力訂正・一般品質・他AR／三中核・live反映／本人端末・正式受入れの未完を維持する。


<a id="auxiliary-history-fit16-control-timeout-20261113"></a>
## 9.12 2026-11-13 — 修正版一回はAnalysis前対照でTimeoutError、待受と保存順序を修正

**11/13・AR-03の修正版一回は提供前Analysisの時間切れで終了：** 承認済み23,350byteを一回実行し、33.20332144200802秒でTimeoutError。自然前対照1を取得、続くAnalysis要求の本文・終了理由は未取得。学習／研究前後22／提供停止・再起動0、PID73476／health200維持。既知の同要求36.901秒より短い25秒待受を設定した華恋の準備ミス。一次JSONに基づき、目視誤読のAssertionError説明を訂正。待受60秒・全体600秒内の復元後137秒予約・検査前raw保存に限定修正した24,639byteを準備し、CPU模擬8件成功、未送信／未実行。旧一回を再試行せず、新しい一回の具体承認待ち。前後品質未評価、通常flag OFF・全補助経路未完を維持。

### 今回の一次原本と、実行しなかった範囲

Mashが§9.11の修正版23,350byte／T8の16更新／前後22応答＋提供前後4／停止復元込み600秒・一回・再試行なしを承認。既存Podへ送信し、size・SHA256 `ef99b2cad3bb79437153d2a73cbcd592188a84ae8f9cf0138cdb27c95dde00f6`・CRC・凍結5file・fresh folderを照合して一回だけ起動した。再試行0。

一次`restoration.json`は `trial_failure_type=TimeoutError`、`elapsed_seconds=33.20332144200802`、`control_calls=1`、`restoration=NO_STOP_NO_RESTART`、`fit_completed=false`、`original_identity_unchanged=true`。事後read-only確認はPID73476／health200。prepause CPUで比較11の長さを確認したが、元提供停止・再起動、新model load、学習16更新、研究前後22応答、候補adapterは0。既存起動環境・2鍵はwrapper順序上同Pod内で読み取り済みで、鍵値・全環境のartifact化や外部転送はない。停止していないため復元成功の実績にはしない。

natural前対照はHTTP200／stopで保存され、続くAnalysisは要求したが応答本文・終了理由・model側の処理完了は未確認。旧`control_calls`は検査通過数であり、全HTTP試行数を1と数えない。Analysisの切断後処理やPod保持料金も0としない。接続／受信のどの段階の時間切れか、Analysisがstop／length／不正JSONだったかは確定できない。

回収した`inspection_results.original.zip`は26,971bytes、SHA256 `2dc7ba23816ec6adb5c5c3c29fe3334beb0ec955b1646bd2310434d8700696ba`。内側`results.zip`は9members／CRC正常、承認済み5fileは全bytes一致。最初に華恋が小さいUIを前のAssertionErrorと誤読して説明し、派生public_summaryにも誤記した。一次JSON回収後にMashへ訂正済み。外側原本の誤記は根拠にせず、原本bytesを残したまま`public_summary.corrected.txt`を一次JSONから導出し、Pod表示も訂正した。

取得natural本文は「先月の妹への散歩の誘い」で原文「妹に朝の散歩へ誘われた」の方向を逆に読ませ、未記載の期待不在も補っている。過去だけの嫌さを今回へ足す誤りは、この一本文では見つけていない。これは前対照一件の読取であり、学習前後22の比較、改善・保持・一般品質の評価は未実施。

### 待受修正と、次の一回の境界

Analysis requestは先行実比較の`analysis_old`（HTTP200／stop、36.901秒）とbody全体が一致。一方、今回の待受25秒は既知所要より短かった。新しい本文の難しさや提供故障とせず、華恋の時間設定の準備ミスとして修正する。旧controlはstatus／JSON／finish検査の後にrawを保存する順序だったため、返却された不合格応答も欠落し得た。今回返却されなかった本文を復元したとは扱わない。

別packet `ar03_history_fit16_control_deadline_prepared_20261113.zip` は24,639bytes／5members、SHA256 `121ad1ed69ba7d8a72ee1da3f9f232343d7bdb06f696b5e97ea584bc84a4d13f`。待受を60秒とし、open＋read全体をSIGALRMで制限してfinallyで解除。全体600秒／研究330秒／学習180秒を維持し、復元後2対照120＋archive12＋余裕5＝137秒を予約。復元health期限はmin(起動から180秒, 全体期限−137秒)で、研究が330秒に達すれば子終了等を引く前でも復元枠は最大133秒。180秒を満額確保したとはしない。

同じcontrol内で送信試行・受信・検査通過を分け、認証値を含まない要求・時刻、受信HTTP状態／raw bytes／hashを検査前に保存する。Timeoutは型と時刻を残す。非stop／不正JSON／HTTP不合格／提供前後本文差は従来どおり失敗で、再送や受入れ緩和はない。教師T8・比較11・全要求body・trainer・generation設定・16更新／前後22＋提供前後4の上限は不変。既存2鍵の同Pod内認証、元argv／全起動環境／cwdを同Pod内メモリに保持して一回復元する範囲と、秘密非保存・非転送を維持する。

既存control closureだけを抽出したCPU模擬8件（stop／nonstop／不正JSON／HTTP201／HTTP503／復元後不一致／open timeout／open＋read合算timeout）が成功。単一試行、受信原本保存、秘密非保存、alarm解除を確認した。独立reviewで時間2項目だけのpack差、trainer bytes・全要求body不変を確認。ネット・GPU・model・提供操作0の検証で、実応答・学習・復元成功を主張しない。

新packetは未送信・未実行。今回の承認は一回・再試行なしで終了しており、新しい具体承認後だけ別fresh folderで実行する。現行flag OFF、新重み未採用。§9.11は当時の失敗・修正履歴として残し、本節を再開位置とする。

### 保存と残件

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion3へ更新。240,791bytes／31members、SHA256 `113d193f3c25d6c002dab39ce5509edb1d1ef555455b9369c4677091b8096083`。従前22members・旧READMEを保持し、今回原本／一次JSON／誤記訂正／未実行修正版／CPU検証を追加。鍵値・全環境・browser screenshot・Git-backed製品sourceは含めない。

primary BLOCKER_NARROWED。教師候補・実tokenizer／mask／長さの既存creditは保持するが、新学習・商品改善credit0。製品source／test／API／DB／RN／Render／Supabase変更0、STRUCTURE_MAP_DELTA_NONE。前後22品質未評価、準備12のRESOLVED補助0、H8未準備、先行場面混同、二入力訂正・AR-03／他AR／三中核／live反映／本人端末・正式受入れは未完。


<a id="auxiliary-history-fit16-actual-nonadoption-20261113"></a>
## 9.13 2026-11-13 — 16更新・22応答・元提供復元は完了、場面帰属と履歴利用が未達で不採用

**11/13・AR-03の16更新と前後22応答を実行、品質未達で通常不採用：** 承認済み24,639byteを一回・再試行なしで実行。16更新／前後22応答は全stop、提供前後4は全HTTP200／stop・同response bytes。元提供はPID76736／health200へ一回復元、旧source・Analysis adapter不変。内部210.486313秒、archive閉鎖211.145507秒はUI観測。新候補112tensorの保存・fresh reload一致を確認し実weightsを回収。本文は5組変化／6組不変、D02／D03で余計な解釈が減る一方、過去の重さの所属・明示履歴利用は未達、新しい確認質問は既存本文検査で拒否。通常flag OFF・重み未採用、次は既存教材の内容と配分の見直し。一般品質・全補助経路は未完。

### 今回の一回と元提供への復元

Mashが§9.12の24,639byte／16更新／前後22応答＋提供前後4／停止復元込み600秒・一回・再試行なしを具体承認。packet SHA256 `121ad1ed69ba7d8a72ee1da3f9f232343d7bdb06f696b5e97ea584bc84a4d13f`、CRC、凍結5fileとfresh folderを照合し、既存Podの`ar03-history-fit16-control60-20261113-once`で一回実行した。再試行・追加生成・本文修補0。

一次restoration.jsonは`RESEARCH_CLOSED_NOT_ADOPTED`、fit_completed=true、control_attempts／control_responses_received／control_callsは各4、elapsed_seconds=210.4863132541068。archive閉鎖後の211.14550683818663秒は成功時stdoutをUIで観測した値で、JSON原本と区別する。600秒以内で完走。元PID73476を停止し、メモリ内で保持した元argv／起動環境／cwdで一回起動、PID76736へ復元。事後の非生成確認はPID76736／health200、元server sourceと旧Analysis adapterのhash不変・提供adapterは旧pathのまま。鍵値・全環境はartifact化／外部転送していない。元提供へ新候補を登録していない。

natural／Analysisの前後4対照は全HTTP200／stop、同requestとresponse bytesが前後完全一致。Analysisは前36.6207秒／後37.8309秒で60秒以内。これは元提供の復元確認で、学習候補の商品品質を証明しない。新規レンタル・install・deploy・DB変更0。Pod保持料金は0としない。

### 更新・保存・再読と原本回収

T01〜T08を順に2周、step1〜16。新LoRAの全lossは有限、学習＋保存30.189632944064215秒。前11＋後11の22応答は全stop。比較11のmessages／source prefixは凍結packと一致、前後のprompt IDsも完全一致。teacher8のNLLは全件低下したが、意味品質の合格には使わない。

候補weightsは15,351,792bytes、SHA256 `434a0c719c7145d89ca9341f5b9e36b81828a2a4fa6844a0137f6b2d86eb12ac`、configはSHA256 `d5fb827f3571c1711d95b693120fcdebe522ce12c048afee2cac64fca162382c`。実行時に112tensor全値の保存一致・fresh baseへのreload一致と112tensorの更新を確認。回収後CPUでも112個／3,833,856param／F32／全値有限／連続offset／同hashを確認した。optimizer／RNGを含む厳密な途中再開状態の保存ではない。

外側`postcheck_results.original.zip`は14,278,499bytes、SHA256 `e98368f11214a4fce6f5b0af55ee9e9c22853c2a5e8bc213c7c7a26dc3571849`。内側results.zipは27members／CRC正常、承認済み5fileは全bytes一致。全22raw・16更新・前後4対照の受信bytes・元入力／messages／prompt／生成tokenと実weightsを回収。fit.log／提供log／鍵／全環境／base重み／repositoryは含めない。

### 原文と全22本文を読んだ結論

華恋と独立agentが全11の原文・過去回答を前後22本文と並べて読んだ。本文変化5組／不変6組。D4は限定開発対照、旧失敗3とplain4は既露出、H8は適格な発行問いがなく未準備。広い未知評価ではない。

| 対照 | 実本文の前後読取 |
|---|---|
| D01 | 同文。妹から本人への誘いが「妹への誘い」と逆に読め、未記載の期待不在も補う。未達。 |
| D02 | 過去訂正の再説明が消え、今回の喜べなさを保持。局所改善で、履歴活用の成立ではない。 |
| D03 | 根拠薄い嬉しさの定義／本人の内面の説明が消える。局所改善だが復唱と選択説明が中心。 |
| D04 | 同文。「全部背負うように感じた」という本人の受け取りを利用できず、今回未記載の嬉しくなさも共通化。明示された過去との接続を使う正対照は未達。 |
| known_withdrawn_scoped | 同文。今回の嬉しくなさを保持。過去撤回を理解して活用した証明にはしない。 |
| known_updated_scoped | 「その感覚は重かった」→「その時、その言葉は重かった」。過去記録との区別が曖昧で、「言葉」という対象も補う。所属の問題は未解消。 |
| known_unsupported_scoped | 長い不明説明は減るが、「どんな意味で届いたのでしょうか」という確認質問が新たに出る。初回本文の問い禁止に違反。 |
| retention_T01 | 同文。水やり・新しい葉・本人の喜びを保持。 |
| retention_T02 | 短くなるが、未入会・未決定を実行済み／決定済みへ変えていない。 |
| retention_T03 | 同文。兄の合格と本人の喜びを混同していない。 |
| retention_T06 | 同文。「嫌なことがあった」と未確定の出来事を補う。不明保持の旧誤りが残り、保持4件全合格とはしない。 |

既存API493cd728のnatural_reply.py（Gitblob`182e8da280e8120b8253eb89b3b3d3121afc0470`）をfresh取得してlocalと一致確認し、同22rawを修補せず既存validate_replyへ通した。前11通過→後10通過／1拒否。known_unsupported_scoped後の「でしょうか。」は既存の問い検査でnatural_reply_invalid。新checker／拒否条件／SYSTEM追加0。本文形式・問い検査だけの結果で、10件の意味合格やsource admission／SQL保存／live成功ではない。今回rawのexact SQL保存・非生成再読は未実施。

D02／D03の余計な解釈の減少は観測したが、目的だった過去評価の所属とD04の有用な履歴利用は成立せず、新しい確認質問もあるため通常不採用。短縮・全stop・loss低下・保存／reload一致を品質合格へ換算しない。更新数不足等の原因も一比較から確定しない。

### 保存と次の作業

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion4へ更新。14,535,561bytes／37members、SHA256 `4707bb44602edc22ba668cc799fb2d5c26e83a536c5f76e8b312144279c90a8b`。従前31membersと旧READMEを不変保持し、今回の原本・実weights・CPU検証・11組の全文読取を追加。秘密・全環境・browser screenshot・Git-backed製品sourceは含めない。§9.11／9.12は当時の失敗・承認待ち履歴として残し、本節を再開位置とする。

次は、既存assistant-only学習部品を使う教材の内容・配分を見直す。明示された過去の本人の受け取りを適切に使う正例、不明な事情を作らない返事、初回本文の問い境界、人物・場面の保持を合わせて扱う。旧失敗の語句だけを正解として教師へ注入せず、H8未準備を未知8件成功へ数えない。同じ重みの追加再生成、新しいSYSTEM／拒否規則、未具体化の追加GPUへ自動進行しない。

primary BLOCKER_NARROWED。今回の学習・保存・復元を技術実績として追加し、商品品質credit0を維持。通常flag OFF、新重み未採用。製品source／API／DB／RN／Render／Supabase変更0、STRUCTURE_MAP_DELTA_NONE。全file／全仕様理解の完了実績ではない。AR-03・本人履歴の一般利用・二入力訂正・他AR／三中核／live反映／本人端末・正式受入れは未完。


<a id="auxiliary-history-rebalanced16-fit32-prepared-20261113"></a>
## 9.14 2026-11-13 — 既存資産から履歴targetと配分を見直し、16教材・32更新案を準備

**11/13・AR-03の教材を16件へ改訂、32更新案は実行前：** 前回T8では過去回答だけの内容が必要なtargetは1件。履歴8のSYSTEM／全原文／回答／source prefixを保ちtarget4だけを改訂し、過去限定比較3＋今回明示接続1へ変更。既存plain8を現ownerで結び直し、合計16件を準備。実tokenizerのCPU一回確認は5.587439秒、全16mask・無切詰め、最大prompt1436／training1239、model／GPU／学習／提供再起動0、PID76736／health200維持。26,293byteの新32更新packetを準備し、前後22＋提供前後4・全体600秒／一回／再試行なしの具体承認待ち。未送信・未実行。通常flag OFF、前回候補不採用・一般品質／全補助経路未完を維持。

### 前回の原本から見た教示内容と、今回の改訂

§9.13の全22本文読取と不採用を継承する。T8を再読すると、5targetは当回だけ、T02の怖さ・T04の回想する寂しさ／嫌さも当回に全文があり、過去回答だけの固有内容が必要なのはT08の1例だった。この偏りは教示内容の確認であり、前回不採用の原因や更新数不足を確定したものではない。

旧T8の保存snapshotをAPI493cd728の_request／prepare_natural_replyで再導出し、全SYSTEM・user原文／回答・source prefixの完全一致を確認したうえで、T01／T03／T06／T08のassistant targetだけを改訂。T01の過去の怖さ、T03の過去の嫌さ、T06の過去の寂しさは過去の場面へ限定し、今回の別場面・人物・反応と分ける。T08は今回の明示接続に基づき、過去の本人の受け取りを使う。過去回答必須1→4の内訳は過去限定比較3＋今回明示接続1で、明示接続4ではない。

独立読取で初稿の「のに」欠落を指摘され、T01／T03／T06の今回を「誘われたのに／頼まれたのに」へ復元。T03の時点を過去の補足へ限定した。最終4targetと全16を再読し、人物の方向、過去／今回、本人の受け取り／相手の実意図を保持した案として確認。実モデル品質やMashの商品受入れの認定ではない。

旧44のS02A/B・S05A/B・S06A/B・既存改訂済T09・T12の8件を再利用し、元の二欄・複数感情と強度・カテゴリを保って現Q3隔離SQL／service／source ownerで結び直した。能受動方向、母と本人の感情、理由不明と明示理由、過去の怒りと今の否定・未納得、映画の面白さと後の寂しさを扱う。targetは旧44準備済み原本と同一。固定評価4と原文が同じ旧T01／T02／T03／T06は教師へ戻さず、固定比較11のcurrent原文・二欄・選択との重複もない。

旧44原本SHA256 `e1872344ce3842c0d59ed13fc82c1ca99a3a83b33514d2d91ac5a9e4d12db2f9`、旧T8・target・実行結果を保持。全教師は華恋の架空案で、Mashの実入力／承認済み正解ではない。合成本人Premium・今回問いOFFの既存fixtureを使い、本人live DBは使っていない。bootstrapの合成本文は教師入力に含まれない。発行問い・回答・意味claimを手作りしていない。履歴8の補助4UNASSESSED／4省略、H8未準備0/8を維持する。

### 実CPU確認と、未実行の一回

既存Podの`ar03-rebalanced16-tokenizer-cpu-20261113`で16teacher＋固定比較11を一回確認。Qwen3_5Tokenizer／851bf6e・同chat template、未改変のencode_training／assistant_loss_windowを再利用。全16でprompt・assistant-only mask・完全chat template・無切詰め・loss windowが一致し、最大prompt1436、最大training1239、教師target監督13〜34token。生成予約2048を加えて8192以内。全27のmessages／source prefixは新packと一致。

一次summaryのelapsed_seconds=5.587439466966316、CUDA未初期化、model load／GPU call／学習／提供restart0、PID76736・health200を前後維持。CPU入力115,065bytes、SHA256 `4e0564b8b9ebc9dffbe019ac3a89d68b95ae390d55c349bd564720a676b5d779`。結果原本62,720bytes／4members、SHA256 `b5a0556a68bfca244f4ac81a4d643737b5b48f42e94918467d0e95947605402e`、CRC・全入力・encoded／maskを回収照合。source準備時のpreparation.private.jsonのNOT_RUNは履歴で、現在のtokenizer結果は回収summaryを優先。CPU成功を学習効果や商品品質へ加算しない。

新`ar03_rebalanced16_fit32_prepared_20261113.zip`は26,293bytes／5members、SHA256 `c3c7c1b81271cc5787822469930f468e66155988860f16533044ca90aeb07221`、未送信／未実行。履歴／plainを交互に16件、同じ順を2周＝32更新。fresh baseから新LoRA、旧不採用重みは初期値に使わない。trainer差分は件数に対応する5counterだけで、既存CE／mask／LoRA／seed42／LR1e-5／保存・fresh reload・生成条件は不変。復元wrapperは前回control60実行版とbyte同一、比較11・提供対照の全要求bodyも不変。独立reviewで5members／CRC／digest、16順×2と32更新、全source一致を照合した。

前後22＋提供前後4＝26生成を上限とし、教師追加再生成0。全体600秒／研究330秒／学習180秒、control60秒、復元後137秒予約を維持。元argv／認証情報を含み得る起動環境／cwdを同Pod内メモリで保持し、一時停止後に一度だけ元提供へ戻す。既存natural／Analysisの2鍵は同Pod127.0.0.1認証だけ、秘密の保存／外部転送なし。候補を提供へ登録しない。再試行・追加更新・選択再生成・本文修補なし。

target改訂・plain8追加・16→32更新の複合変更であり、結果をtarget単独の効果へ分解しない。過去評価の転送、D04の明示履歴未利用、未知事情、人物方向、新質問、保持退行が残れば通常不採用。全件良好でも一般品質・本人端末・正式受入れは別確認。前回16更新の一回は終了済みで、今回32更新の実行にはこの具体packetの新しい一回承認が必要。

### 保存・再開位置

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion5へ更新。14,668,391bytes／47members、SHA256 `8ef4b41f848ec9aaa1f270c82959c88fffea1a68c01052408e23b66713d7d0bc`。従前37membersと旧READMEを不変保持し、改訂16の全source／target、source準備、CPU原本、次の具体packetを追加。秘密・全環境・browser screenshot・Git-backed製品sourceは含めない。

次は具体packetの一回承認後、別fresh folderで32更新／前後22＋提供前後4を行い、全本文を原文照合して採否を判断する。現時点では新学習0。通常flag OFF・前回候補不採用、製品source／test／API／DB／RN／Render／Supabase変更0、新guard／SYSTEM追加0。STRUCTURE_MAP_DELTA_NONE。primary BLOCKER_NARROWED、商品品質credit0。全file／全仕様理解の完了や、AR-03／他AR／三中核・一般品質・live反映／本人端末・正式受入れの完成は主張しない。本節を最新再開位置とし、§9.13の不採用を履歴として保持する。


<a id="auxiliary-history-rebalanced32-actual-nonadoption-20261113"></a>
## 9.15 2026-11-13 — 改訂16教材32更新を実行、通常不採用と確定補助の省略位置

**11/13・AR-03の改訂16教材32更新を一回完走、新候補も通常不採用：** 前後22応答は全stop、提供前後4はHTTP200／stop・response bytes一致。内部235.783163秒、archive閉鎖約236.436507秒はUI観測。元提供はPID77140／health200へ復元、旧source・Analysis adapter不変。112tensorの保存・fresh reload一致と実weightsを回収。質問は消えたが、撤回済み過去感情の復活・根拠薄い内面推測があり、D04の正しい履歴利用も未達。追加CPUでT05／D02は現ownerが撤回対象を失効済みと再導出する一方、補助付き6100／6179byteが既存5800byteを超え、補助が生成材料から省かれることを確認。補助で直る因果は未証明。次は既存補助の受渡しを具体化し、追加学習へ自動進行しない。通常flag OFF、一般品質・全補助経路未完。

### 一回の実行・復元・原本回収

Mashが§9.14の26,293byte・架空16教師の32更新・前後22応答＋提供前後4確認・停止復元込み600秒／一回／再試行なしを承認。packet SHA256 `c3c7c1b81271cc5787822469930f468e66155988860f16533044ca90aeb07221`、CRC、凍結5file、新folderを照合し、既存Podの`ar03-rebalanced16-fit32-20261113-once`で一回実行した。再試行・追加生成・本文修補0。

一次restoration.jsonは`RESEARCH_CLOSED_NOT_ADOPTED`、fit_completed=true、control_attempts／control_responses_received／control_calls各4、elapsed_seconds=235.78316273796372。archive閉鎖約236.436507秒は成功時stdoutのUI観測でJSON原本と区別する。600秒以内で完走。元PID76736を停止し、メモリ保持した元argv／起動環境／cwdで一回復元、PID77140／health200を事後確認。旧sourceとAnalysis adapterのhash・提供adapter pathは不変。既存2鍵は同Pod内認証、鍵値・全環境の保存／外部転送0。新候補を提供へ登録していない。

natural／Analysisの前後4確認は全HTTP200／stop、同requestとresponse bytesが前後一致。Analysis所要は前39.6715秒／後38.7457秒。新規レンタル・依存install・deploy・live DB／Render／Supabase／RN変更0。Pod保持料金は0としない。

外側postcheck_results.original.zipは14,311,445bytes、SHA256 `bff6fbd96e96d0e86cb8a00e7e75c8bb407a6e371568fe12fb8e149e67e9df56`。内側results.zipは26members／CRC正常、承認5file全bytes一致。22raw・全32更新・前後4受信原本・messages／source prefix／prompt／生成tokens・実weightsを回収。fit.log／提供log／鍵／全環境／base重み／repositoryは含めない。

### 更新・保存再読と、前回16更新との比較条件

履歴／plain16を交互に2周、step1〜32・全loss有限、学習＋checkpoint保存46.66297569102608秒。前11＋後11の22は全stop。全比較のmessages／source prefixは凍結packと一致し、前後prompt IDsも一致。teacher16の実encodedは先行CPU原本と全値一致。前回fit16のbefore11と今回before11はmessages／prefix／prompt IDs／生成token IDs／本文まで同一。

候補weightsは15,351,792bytes、SHA256 `66491f8ed76ce4279f1f4501e6255d5c3821c96ac00675e05db5738912f96a42`、configはSHA256 `b37b786bbbba69c490090311728a164ddd933796896dd64e7f2a36d19f9d6e37`。実行時に112tensorの更新・保存全値一致・fresh baseへのreload全値一致。CPUでも112個／3,833,856param／F32／全値有限／連続offset／同hashを確認。前回configとの差は同じtarget_modules集合の配列順だけ。optimizer／RNGを含む厳密な途中再開状態の保存ではない。16教師のNLLは全件低下したが、品質合格には使わない。

### 全22本文の読取と、旧16afterからの退行

華恋と独立agentが全11原文・過去回答、新前後22本文、旧16afterを読み比べた。新前後の本文は9組変化／2組不変。新afterが旧16afterと同文なのはknown_updated／花／兄の3組。変化数を改善数とはしない。

| 対照 | 今回の意味・自然さと旧16案との差 |
|---|---|
| D01 | 履歴省略で妹への誘いの方向逆転・未記載期待不在は消えるが、正しい履歴利用の実証ではない。「体験会を誘われた」は格が不自然 |
| D02 | 旧16afterから退行。訂正済み過去の「嬉しくなかった」を事実として復活 |
| D03 | 旧16afterで消えた内面推測が再発。「自分自身への期待や、その場への関心が低い」という根拠薄い解釈を補う |
| D04 | 語順変更にとどまり、「全部背負うように感じた」という本人の受け取りを利用せず、今回未記載の嬉しくなさも共通化 |
| known_withdrawn_scoped | 今回感情は保持するが原文の復唱。過去撤回理解の成功ではない |
| known_updated_scoped | 旧16afterと同文。「その時」の所属は曖昧なまま、「その言葉」という対象追加も残る |
| known_unsupported_scoped | 旧16afterの質問は消え、今回の記録だけを返す限定改善。復唱が中心 |
| retention_T01 | 新前後・旧16afterとも同文。水やり・新しい葉・本人喜びを保持 |
| retention_T02 | 通う未決定と未入会を実行済みにしないが、未入会の事実を入会未決定へ置換。厳密な同義ではない |
| retention_T03 | 新前後・旧16afterとも同文。兄の合格と本人喜びを保持 |
| retention_T06 | 未確定の「嫌なことがあった」が「ようです」から「のですね」へ確定的になる。不明保持未達 |

同22rawを既存API493cd728のvalidate_replyへ無修補で通し、前11／後11が本文形式・問い検査を通過。旧16afterの問い1拒否は消えたが、意味誤りは残るため、CMEE意味合格・採用率11/11とは扱わない。新checker／拒否規則／SYSTEM追記0。今回rawのexact SQL保存・非生成再読、liveサービス／本人端末は未確認。

過去評価の所属・D04の正しい履歴活用は未達で、撤回復活・内面推測の退行もあるため、新66491候補も通常不採用。target4改訂・plain8追加・16→32更新の複合候補で、個々の効果や失敗原因を分離・確定しない。D4は限定開発対照、旧失敗3／plain4は既露出、H8は準備済み0/8、改訂履歴教師8＋D4に載ったRESOLVED補助は0（教師4UNASSESSED／4省略、D4は3UNASSESSED／1省略）。既露出known_withdrawn／known_updated比較にはRESOLVED補助が実際に入っている。広い未知品質へ加算しない。

### 追加CPUで区別できた、撤回の確定と作者材料での省略

T05／D02の凍結snapshotを既存ownerで純CPU再導出すると、admitted_history_plansは各1、checkpointはRESOLVED、更新全体dispositionはMATERIAL_UPDATE、active2／inactive1。失効した原文は各「悲しかった」「嬉しくなかった」。個別WITHDRAW操作と更新全体のMATERIAL_UPDATEは別で、この2例を撤回reader未対応とは扱わない。

既存の根拠付き補助を加えたmessagesは6100／6179byteで、既存5800byteを超える。現prepareでは補助全体が省かれ、raw原文・回答は保持されることと、実送信messagesが凍結sourceと完全一致することを確認した。手書きのclaim／RESOLVEDは使わない。source Gitblobはemlis_thread_history.py `6dcbdf0fe1d7939f1c276f9d3daf19136d9e36dd`、natural_reply.py `182e8da280e8120b8253eb89b3b3d3121afc0470`で現API493cd728と一致。新model／GPU／network／SQL呼出し0、製品変更0。

これは既に確定できた補助が作者へ届かない位置の実確認で、補助を載せれば生成が直ることや、予算省略が学習失敗の原因だったことを証明しない。他のUNASSESSED例の未確定と、この2例の予算省略を一括りにしない。known_updatedではRESOLVED補助が届いていても所属の曖昧さが残るため、省略だけを全失敗の原因とはしない。

### 保存と次の作業

既存 `Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`／Library `libfile_fde3_f-9e0e8945ad208191a053021e810be6d6_2f7470f963808191aaebf050935e72de` をversion7へ更新。28,998,969bytes／54members、SHA256 `d28a5af890aafa14b92249993125e227fb8ead0d8592e7c9fe3ea3c627245e08`。旧47membersとREADMEを不変保持し、新32原本・実weights・CPU検証・全11比較・補助省略の再導出結果を追加。秘密・全環境・browser screenshot・Git-backed製品sourceは含めない。

同じ方式の追加有料学習・同じ重みの追加再生成へ進めない。次は、全原文・全回答・出所・上限を保ち、既存の根拠付き補助の受渡しを具体化する。原文と補助の材料同一性、撤回／有効／未確定の区別を維持し、新guard／SYSTEM追加や手書きclaimで埋めない。新しい実比較は未準備・未実行で、今回一回の承認を流用しない。

通常flag OFF、新66491・旧434a候補とも通常不採用。製品source／test／API／DB／RN／Render／Supabase変更0、STRUCTURE_MAP_DELTA_NONE。primary BLOCKER_NARROWED、商品品質credit0。全file／全仕様理解の完了や、AR-03／他AR／三中核・一般品質・live反映／本人端末・正式受入れは未完。本節を最新再開位置とし、§9.14の実行前記録を履歴として保持する。



<a id="auxiliary-history-locator-handoff-prepared-20261113"></a>
## 9.16 2026-11-13 — 確定済み履歴補助を原文locatorで渡す修復、6応答比較は準備済み・未実行

### 目的・変更責務と実装

§9.15で実測したT05／D02の補助全省略を、意味判定の変更や追加学習ではなく、既存natural_replyの作者向け投影内で修復する。今回の未完了条件はEM-02bの撤回後の残存意味保持とEM-03aの妥当な履歴利用へ接続する。latest weeklyは11/7終了版、全体現在地・全体図・全ファイル地図と三中核mapの接続を再確認した。全repositoryの全blobの意味理解完了とはしない。

API `bd4b017a9ba937a0f4c28941e059d290f34a9be4`（親493cd728、変更exact2）はnatural_reply.pyと既存test_emlis_natural_question_application.pyだけ。既存5800byteを超える研究要求で、補助を落とす前にprivate `natural_history_answer_meaning.v2`を試す。重複source_fragmentsを同一source_record_id内の共有表へまとめ、各claim／relationからsource_fragment_refsで参照する。共有表は`original.memo`／`original.memo_action`または`answers.text＋answer_id`とscalar_rangeで、同じ記録に残す完全原文へ束縛する。原source_role・field・span・textへ戻せる。別記録・欄・回答の同じ字面を混ぜない。

claim_anchor・kind・actor・polarity・modality・time_scope、全active／inactive claim、失効relationと両端、assessment／disposition／unresolved_parts、source_record_idを落とさない。本人原文・全回答・問い文脈・順序・ID／時刻・カテゴリ・感情／強度・source prefixは全保持。選択感情をmemoの撤回対象へ巻き込まない。意味の確定は現ownerのまま、手書きclaim／RESOLVED・新guard／checker／controller・新SYSTEM本文0。

既に収まるv1要求はbytes不変。v2を試しても超過する場合は既存どおり補助全体だけを省く。通常use_meaning_support=False、現在回答の投影、Safety・履歴資格・公開API／DB／RN・保存契約・既存5800byte上限は不変。新v2にも既存のscoped-history指示文そのものを選び、原文や指示文を削って空きを作らない。

### 実検証と限界

関連5test fileで247件成功、既存Pydantic deprecation警告1。追加2例は既存SQL／serviceで過去原文→発行問い→本人撤回→今回入力を構築し、locatorを実原文から展開すると現ownerの完全補助と全値一致すること、予算、raw不変、超過fallback、過去保存原本・event非生成再読の不変を確認した。既存updated対照では回答由来のlocatorとexact answer_idも往復一致。最新UNASSESSEDを旧RESOLVEDへ戻さない既存検証も通過。初回は追加testの括弧誤りでcollection停止、修正後53件成功、その後UTF-8比較と回答出所の検証を加えた247件を最終結果とする。重複合算しない。

前回と同じ20凍結snapshot（改訂16教師＋D4）を純CPUで旧493cd728／新候補へ再導出。通常material／source prefix／Safetyは20/20全同一。研究messagesが変わるのはR_T05／D02だけ、残り18は完全同一。旧研究要求4068／4099byteには補助がなく、新5699／5751byteにはv2を搭載。旧完全補助を含めると6100／6179byteだった2例の全意味情報は、保持原文から完全復元できた。model／GPU／network／SQLへの新生成要求0。20は新しい未知例20件ではない。

CPU搭載・可逆性は、4Bがlocator／参照表を理解して意味と自然さを改善した証明ではない。known_updatedは既存v1が届いていても所属誤読が残るため、省略だけを全失敗の原因にしない。新model本文の生成、exact SQL保存・非生成再読、通常採用・live反映／本人端末・商品受入れは未確認。旧434a／66491学習候補の不採用を撤回せず、今回は追加学習へ戻らない。

### 保存済みの次回比較と承認の境界

`locator_handoff_prepared/ar03_history_locator_handoff_20261113_once.py`を49,471bytes、SHA256 `8a2ca9ba54d5a8bf147f85cc331bb98c5dc570f7bc305acde3df3c72890fb444`で固定。入力は既存の架空sourceのみ。T05／D02の旧新4応答と、known_updatedの同一v1 prompt対照2応答、合計6要求。対照の二要求は完全同一で、既存に届く補助の読み誤りも区別する。教師target・新学習済みadapterは送らない。

候補実行は既存の自然文4B提供をそのまま使い、最大420秒・一回・各call最大60秒・max_tokens2048・temperature0。元提供health／PIDを前後照合し、学習・再試行・依存install・model／adapter変更・提供停止／再起動・他providerへのfallbackは0。既存のnatural鍵1つを同Pod内127.0.0.1認証だけに使い、全起動環境読取／鍵の保存・外部出力は行わない。新しい一回用folderは既存時に失敗し、同じpacketを再試行しない。

前回26,293byteの承認は32更新／22＋4確認を完了して消費済み。今回の49,471byte／6要求へ流用せず、未送信・未実行で保留する。実比較前に追加の学習・形式再変更を重ねない。実比較後も全本文を原文／訂正と読み比べ、通常採用や生成改善を形式成功から自動認定しない。

既存`Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`は同Library IDのversion8として保存。29,019,790bytes／59members、SHA256 `0ce5476e35ff2e3c1ec4ec0f7ffc33db952dd5f362b234e4f880c8ba81db68d9`。旧54membersのREADME以外は不変、旧READMEはREADME.v7.mdに退避し、新README・CPU20原本・固定6要求・runner・説明を追加。旧実weights／fit32原本を保持し、credential・全環境・browser screenshot・Git-backed製品sourceを加えない。

STRUCTURE_MAP_DELTA_NONE：既存natural_reply投影ownerの表現修復で、新owner・新path・公開経路・責任境界は増やしていない。現在地mapの関連差分だけを更新。実装反映とCPU受渡し検証は成立したが、商品品質改善・AR-03／全補助経路の完了ではない。本節を最新再開位置とし、§9.15は不採用と実測根拠の履歴として保持する。


<a id="auxiliary-history-locator-handoff-actual6-20261113"></a>
## 9.17 2026-11-13 — 補助locatorの実6応答、送達成立・品質退行により通常不採用

### 承認された一回の実行と原本照合

Mashが§9.16の49,471byte／架空2例の旧新4応答＋同一入力対照2応答、最大7分・一回・学習／再試行／提供再起動なし、既存鍵1つは同Pod内認証だけに使う実行を明示承認。承認scriptのサイズ・SHA256 `8a2ca9ba54d5a8bf147f85cc331bb98c5dc570f7bc305acde3df3c72890fb444`をlocalとPodで照合し、既存提供に対して一回実行した。元起動環境読取・復元や提供停止は行っていない。

実原本summaryはelapsed_seconds=12.17454383103177、http_generation_calls=results_recorded=6、retry=training=provider_restart各0、始終PID77140、前後health200／status ok。全6 HTTP200／finish_reason stop／attempt1。モデルは既存natural alias `cocolon-qwen35-4b-base-851bf6e`で、新学習候補のload／adapter変更・依存install・新規rentalは0。鍵は127.0.0.1認証だけに用い、秘密・全環境を結果へ含めない。既存Podの保持料金が0という意味ではない。

回収original_results.zipは35,381bytes／9members、SHA256 `64e75112199490a54fc9394a8442bb3c0a895152a3cb52ca6dee283d6d0d9c39`、CRC正常。同梱scriptは承認bytesに完全一致し、個別response1〜6と集約rowも全同一。全requestは準備bodyへ同じruntime model指定を付けたものと全値一致し、wire bytes／request hash／全raw response hashを華恋と独立agentが照合した。

| 要求 | 実messages UTF-8 byte | 受信 |
|---|---:|---|
| R_T05 before／candidate | 4068／5699 | 両200／stop |
| D02 before／candidate | 4099／5751 | 両200／stop |
| known_updated before／candidate | 5788／5788 | 両200／stop、request・raw response bytesとも完全同一 |

T05／D02は原文・全回答・出所・prefixと生成設定を保持したまま、欠落していた確定補助を搭載できた。ただし旧は補助なしSYSTEM、新は補助追加に伴い既存scoped-history説明が有効になる。新SYSTEM本文を発明した変更は0だが、補助payloadだけを変えた純粋比較とは扱わない。

### 全6本文の原文／訂正との読取

華恋と独立agentが全6本文と元の本人原文・回答・新旧pairを読んだ。過去の記録を歴史的に引用することと、訂正後も有効な共通感情として使うことを分けた。

| 対照 | 旧の実本文と候補の判定 |
|---|---|
| T05 | 旧は今回の知人からの食事への誘いと本人の悲しさを短く保持するが復唱が中心。候補は今回の悲しさを消してはいないものの、「どのような背景や理由があるのでしょうか」と新質問を追加。本文に問いを含めない既存契約へ違反し、退行。過去映画の感情撤回の正しい活用は実証しない |
| D02 | 旧は過去の嬉しくなかったが誤りとして修正されたことを明記し、今回の冊子づくりで喜べなかったことを保持。候補第1文の過去記載の引用だけなら誤りと確定しないが、第3文で「どちらも」頼まれたことへの喜べなさと共通化し、撤回済みの過去反応を有効な共通感情として復活。退行 |
| known_updated | 旧新とも「褒められたのに嬉しくなかった、その感覚は重かったんですね。」でrawまで同一。過去回答の重さを今回の感覚と区別しておらず所属の曖昧さが残る。今回の本文には「言葉」という対象追加はない。改善0 |

同じ6rawを現API `bd4b017a9ba937a0f4c28941e059d290f34a9be4`の既存validate_replyへ無修補で照合し、T05 candidateをnatural_reply_invalidで拒否、他5を形式通過。5/6を意味合格・CMEE採用率・保存成功へ変換しない。新guard／拒否rule／SYSTEM追記・本文修補0。新生成本文のexact SQL保存・非生成再読、通常enablement、live API／DB／Render／Supabase／RN配置と本人端末は未実施。

### 判断・保存・再開点

locator候補は通常不採用。通常use_meaning_support=Falseを維持し、前回434a／66491学習候補の不採用も継承する。CPUで意味を完全復元でき、実際に補助が届いても、本文で撤回／残存意味／過去現在の所属を正しく利用できなかった。受渡し成立は技術確認に限り、商品品質改善とはしない。失敗をlocator構文だけの原因や、追加学習で直る根拠へ確定しない。既存v1が届いている対照でも所属の曖昧さが残ることを保つ。

今回の一回承認は6要求の実行で消費済み。同じ比較の再試行、追加生成／追加学習、新promptや新比較の準備・実行へ自動進行しない。次の未解決条件は、既存の作者経路で本人訂正による失効範囲と残る意味を使い分け、返事本文に新質問を混ぜず、過去の受け取りを今回へ足さないこと。搭載率・test件数をその改善へ換算しない。

既存`Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`を同Library IDのversion9へ更新。29,062,939bytes／64members、SHA256 `8889b8a7fe988e25d44f4c25ccd2603b6f246af72d65abef2f2747929cd647e4`。旧59membersのREADME以外は不変、旧READMEはREADME.v8.mdとして保持し、新actual原本ZIP・CPU技術照合・全3組6本文の意味review・説明を追加。旧実weights／失敗／準備原本も保持する。秘密・全環境・browser screenshot・Git-backed製品sourceは加えていない。

製品source／test／API変更は今回0、API headはbd4b017aのまま。前提資料の現在地4箇所を差分更新。STRUCTURE_MAP_DELTA_NONE：新owner／path／公開経路／責任境界を追加していない。primaryは候補NOT_ADOPTED、商品品質credit0。§9.16の未実行記録は承認前の履歴として保持し、本節を最新再開位置とする。AR-03／他AR・三中核／全補助経路・一般品質・通常反映・本人受入れは未完。


<a id="auxiliary-history-active-binding-prepared-20261113"></a>
## 9.18 2026-11-13 — 有効な評価の対象・時点を現作者へ回収、2組4応答は準備済み・未実行

### 実測後の欠落と、今回の変更範囲

Mashの新しい継続指示を受け、§9.17の全6実本文・不採用と、freshな全体現在地・設計図・ファイル地図・最新11/7 weeklyを照合。本文に新質問を入れたT05は既存validate_replyが拒否済みで、新しい検出ruleは作らない。旧candidate selector／content-selectionの巨大型をそのまま再稼働せず、詳細設計§9.1／§14に従い既存意味ownerから欠けた責務だけを現作者へ戻した。

既存`admitted_history_plans`は`prepare_emlis_meaning→build_updated_grounded_plan`を呼び、訂正／撤回後の有効planを既に返す。一方、従来`_answer_meaning_material`はactive／inactive claimとinactive relationのみを渡し、有効な`evaluation_about_event`と、どの時点への回答かを落としていた。既存planの評価がどの出来事についてかという意味結合は、単なるclaimのtime_scopeとは別である。この欠落を、D02／T05の全失敗原因と確定しない。

API `a0a6746e233b09d8cdfbd94b5d17ee5af9587946`（親bd4b017a、変更exact2）は既存natural_reply.pyと既存question application testだけ。private引数`use_history_answer_plan=False`は既存研究supportと併用する場合だけ有効。historyの有効な評価関係・生存する両端anchor・qualified原文fragmentを、既存更新後planから投影する。exact1のupdate_ref結合がある場合だけ、typed temporal bindingのabout_timeと実anchorを付与し、相対関係／interval／timezoneが非空なら保持する。時点根拠は同じqualified fragment配列内のtime_span_indicesとして保持し、既存v2 locator化後も同じ位置へ対応する。

about_timeとsource anchorを同じものと扱わない。今回ANSWER_TIMEの実owner値もanchorはoriginalであり、about_timeからanswer_idへ手書き補完していない。「今は重い」はその過去記録への回答時点の主張で、今回の別記録へ無条件に足さず、終了したとも推定しない。元の出来事当時・回答時点・今回を分けて実本文を読む。

関係0ならactive_relationsキーを増やさず、既存v1／v2処理を保持する。失効内容・全原文／全回答・出所・問い文脈・順序・ID／時刻・選択・prefixを落とさない。最新UNASSESSEDを旧RESOLVEDへ戻す選択は変えない。新SYSTEM本文・新guard／checker・旧巨大selector・dependency・公開API／DB／RN・通常providerの変更0。5800byteを上げず、なお収まらなければ既存どおり補助だけを省く。通常flag OFF／新opt-in default false。retentionを今回必ず過去へ言及する指示として投影せず、全planや完全なcontent-selection subsystemの移管完了とはしない。

### CPU実検証と、新4要求の意味

関連5test fileで249件成功、既存Pydantic deprecation警告1。追加2例は既存SQL／serviceで原入力→実発行問い→本人回答→今回の別記録を構築し、原文・source prefix・Safety・既存claim／失効／unknownを保持した上で、有効関係とtyped about_time／実anchor／時点のqualified根拠の一致、locator往復、5800byte、SYSTEM同一、超過fallbackを確認した。

旧20凍結snapshotをbd4b017aと新候補で純CPU再導出。通常material／prefix／Safety、旧研究messages、新opt-inを付けたmessagesも全同一。開始時localの古い2fileはfresh bd4原本へ同期し、他229fileはfresh Git blob一致を確認してから実施した。これを全repositoryの全本文・全仕様理解と同一視しない。既存の構造mapと原本・依存を分担確認した範囲を守る。

| 架空の既露出派生対照 | 旧→候補のmessages byte | ownerが持つ意味 |
|---|---:|---|
| その時は重かった | 5788→5762 | 過去の「褒められた」→「重かった」、ORIGINAL_OCCASION |
| 今は重いです | 5777→5796 | 同じ過去イベント→回答時点の「重いです」、ANSWER_TIME／answer_deictic_now |

2組は独立した未知事例2題ではない。旧新で本人の原文・全回答・問い・選択・ID／時刻・prefix・SYSTEM本文を固定し、同じexisting natural 4Bへ渡す作者材料候補全体を比較する。旧v1全文fragmentから候補の既存v2共有locatorへの圧縮も同時に起こるため、有効関係だけの純粋効果とは認定しない。

前回T05／D02は新flagでも要求が同一であり、その質問追加・撤回復活を今回直したとは扱わない。既存readerが回答付き記録を除外することも確認したが、検出・拒否を追加するだけの別修正は行っていない。CPU一致／搭載・249成功は実4Bの理解・自然さ・商品品質改善、通常採用、新生成本文のSQL保存・非生成再読、live反映／本人端末の成功ではない。

### 保存済みpacket・未実行境界と次

`active_binding_prepared/ar03_history_active_binding_20261113_once.py`は38,004bytes、SHA256 `6a30f9c6a1a6cc0b2bfb389cd10a71dc302bba9112c9261bb0aa6006bdb86577`。既存SQLからのsource snapshots、準備4要求、CPU20再導出、実行scope説明を同時保存した。2組のbefore／candidate計4応答、最大300秒・一回・各call最大60秒・max_tokens2048・temperature0。既存natural鍵1つを同Pod内127.0.0.1認証だけに使い、全環境読取／鍵保存・外部出力0。学習・再試行・model／adapter変更・提供停止／再起動・新rental・dependency install・他provider fallback0で、前後health／PIDを記録する。

今回Pod操作／送信／model呼出し0。直近PID77140／health200は§9.17の観測で、現在再観測済みとはしない。前回49,471byte／6要求の一回承認は消費済みで、今回4要求へ流用せず未送信・未実行。実行時は全4本文を、元場面と回答時点・今回への足し込み／未記載の継続終了・自然さ・復唱・質問追加まで読む。意味が変わる候補を流暢さで採用しない。通常採用や追加学習へ自動進行しない。

既存`Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`を同Library IDのversion10へ保存。29,089,093bytes／71members、SHA256 `f8b3d11372aea3b43e97ce4a66b67b5e422b5d5b9af601c62d1954996b9d0986`。旧64membersのREADME以外は不変、旧READMEはREADME.v9.mdに保持し、今回準備6fileを追加。旧重み／全実原本・不採用理由を保持し、秘密・全環境・browser screenshot・Git-backed製品sourceは加えない。

STRUCTURE_MAP_DELTA_NONE：既存natural投影owner内の責務回収で、新owner／新path／公開経路／責任境界を増やしていない。現在地4箇所だけ関連差分更新。実装反映・CPU準備は成立したが、実商品品質の改善・AR-03／他AR／三中核・全補助経路の完了ではない。§9.17の不採用を継承し、本節を最新再開位置とする。


<a id="auxiliary-history-active-binding-actual4-20261113"></a>
## 9.19 2026-11-13 — 有効な評価対象／時点候補の実4応答、短縮はあるが所属未達で通常不採用

### 承認された一回の実行と技術結果

Mashが§9.18の38,004byte／架空2組の旧新4応答、最大5分・一回・学習／再試行／提供再起動なし、既存鍵1つは同Pod内認証だけに使う実行を明示承認。localとPodのscriptサイズ・SHA256 `6a30f9c6a1a6cc0b2bfb389cd10a71dc302bba9112c9261bb0aa6006bdb86577`を照合して一回実行した。

原本summaryのelapsed_seconds=8.890745714074、http_generation_calls=results_recorded=4、全attempt1／HTTP200／finish_reason stop。始終PID77140、前後health200／status ok、retry=training=provider_restart各0。モデルは既存natural alias `cocolon-qwen35-4b-base-851bf6e`で、新しい学習候補のload・model／adapter変更・依存install・新rental・提供停止／再起動は0。既存named natural鍵は127.0.0.1認証だけに使い、鍵・全環境を結果へ保存／外部出力していない。既存Podの保持料金が0という意味ではない。

回収original_results.zipは28,491bytes／7members、SHA256 `5c87a62776baeeb9b4802cb0484f1f270d6ce200986996cff819b3035d16ff3d`、CRC正常。華恋と独立agentが、同梱scriptの承認bytes一致、個別response1〜4と集約rowの一致、全prepared bodyへの同じruntime model指定と実wireの一致、request bytes／hash・全raw response hashを確認した。

| 対照 | before／candidateの実messages UTF-8 byte | 受信 |
|---|---:|---|
| original_occasion | 5788／5762 | 両200／stop |
| answer_time | 5777／5796 | 両200／stop |

各pairのSYSTEM本文は実requestでも同一。raw原文・全回答・問い・選択・出所・prefixは準備どおりで、有効な評価関係とtyped時点根拠は上限内に届いた。ただしv1全文fragment→既存v2共有locatorへの表現変更も含むため、有効関係だけの純粋効果と認定しない。2組は既露出の架空派生対照で、未知事例2題の一般化成功へ加算しない。

### 全4本文を原文・元場面／回答時点／今回と照合した結果

華恋と独立agentが全4実本文を読んだ。両原文に書かれた「嬉しくなかった」の共通性と、過去回答の「重さ」を今回へ足すことを区別した。

| 対照 | 旧から候補への意味・自然さ |
|---|---|
| original_occasion | 旧は「その時、褒められたこと自体が『重かった』」と返すが、過去の出来事か今回か本文で明確でない。候補も「その時」の所属を区別せず、「その言葉は『重かった』」と未記載の対象へ評価を狭める。対象／時点の改善は確認できない |
| answer_time | 旧は回答の「今は重いです」を今回の心境の補強へ結び、「なぜそのような感情が生まれているのか、その重さの正体は何か。」と原因探索・問い掛けを付加。候補はこれを除き一文へ短縮する限定改善があるが、「そして今は重く感じている」と接続し、過去記録への回答時点と今回の別記録を明示的に分けていない |

ANSWER_TIMEを元の出来事当時と読み替えたり、回答の「今」を今回へ無条件に足したりしない。今回の本文は継続／終了や診断を新たに明言はしていないが、必要な対象・時点の所属と、復唱を越えた自然な受け取りは未達。短くなったことを、この意味保持の合格へ変換しない。

同じ4rawを現APIa0a6746eの既存validate_replyへ無修補で照合し、全4が形式通過。旧answer_timeの「〜何か。」という問い掛け断片も通るため、4/4を意味合格・CMEE採用率・保存成功とは扱わない。新guard／拒否rule／SYSTEM追記・本文修補0。今回の新生成本文を商品SQLへ保存・非生成再読する実行、通常enablement、live API／DB／Render／Supabase／RN反映と本人端末確認は未実施。

### 判断・保存・現在の再開点

今回の有効関係／時点候補も通常不採用。不要な問い掛けの除去・短縮という限定的差は記録するが、対象と時点の所属が未達なので採用しない。通常use_meaning_support=False、新use_history_answer_planのdefault falseを維持し、§9.17 locator候補・旧434a／66491学習候補の不採用も継承する。CPUで保持・復元できる意味を実際に渡しても、4B本文がその区別を正しく利用した証明にはならない。型や注釈を追加すれば直る、または学習回数を増やせば直ると原因を確定しない。

今回の一回承認は4要求で消費済み。同じ比較の再試行・追加生成・新prompt／新guard候補の追加・追加学習へ自動進行しない。残る条件は、既存作者経路で出来事への評価対象と元場面／回答時点／今回を分け、不要な問い・未記載対象を補わず自然に返すこと。検出・搭載率・件数だけをこの品質改善へ換算しない。

既存`Cocolon_CMEE_AR03_HistoryTeaching_Candidates_20261112.zip`を同Library IDのversion11へ更新。29,125,000bytes／76members、SHA256 `c3ddaaeac37680a4ef353a7242e3f176d568e40eafdbc9cb569eb4bea9bd9c40`。旧71membersのREADME以外は不変、旧READMEはREADME.v10.mdとして保持し、今回actual原本ZIP・CPU技術照合・全2組4本文の意味review・説明を追加。旧重み／実原本・不採用と準備結果も保持し、秘密・全環境・browser screenshot・Git-backed製品sourceは加えない。

今回の製品source／test／API変更0、API headはa0a6746eのまま。前提資料の現在地4箇所だけを差分更新。STRUCTURE_MAP_DELTA_NONE：新owner／path／公開経路／責任境界は増えていない。primaryは候補NOT_ADOPTED、通常採用・商品受入れcredit0。§9.18の未実行は承認前の履歴として保持し、本節を最新再開位置とする。AR-03／他AR・三中核・全補助経路・一般品質・通常反映・本人受入れは未完。


<a id="piece-editorial-choices-prepared-20261113"></a>
## 9.20 2026-11-13 — Pieceの既存編集判断を現作者へ移す候補、3型6要求を準備（準備履歴）

> 本節は承認前の準備履歴。後続§9.21で新しい一回承認後の実行と不採用まで完了。

週次§6.11と本書§9.1に沿い、AR-03の不採用比較・学習の反復を次の主枠に戻さず、Pieceの本文編集へ進む。Analysisの実表示、AR-02訂正・複数回答のPiece接続等の残件は維持する。今回の候補が広い一般編集品質や全補助経路を完成させたという扱いはしない。

[API ec4bd668](https://github.com/MassyuRed/mashos-api/commit/ec4bd668309d05e86ea66d036128bc5fb643d6c2)は既存製品 `piece_model_source.py` と既存 `test_piece_model_content_selection.py` の2pathだけ。親a0a6746e、exact parent／changed paths／remote全文を確認。既存 `piece_v1c._focal_parts` と `_adjacent_self_continuations` による焦点構文の直接表現化・参照を保った同本人反復の省略、既存 `piece_source._EVALUATIVE_FOCUS` による評価語順の選択を、現builderの `editorial_choices` へ回収した。source／欄／scalar／nodeへ束縛し、必須命題・順序・公開役割化・肯否／時点／留保を保つ。既存chooserは重複判断に短い評価表現を内部比較する場合があるが、期待完成本文や旧finite artifactを生成材料へ送らない。

`build_piece_model_messages(include_editorial_choices=False)` と `Shared4BPieceModelSource(use_editorial_choices=False)` の明示private候補。現configured取得は新optionを指定せず既定OFFであり、現在の実model呼出しへ採用していない。SYSTEM・原入力7項目・PreparedRequest・元／補足の分離・独立Engine/S7・raw無修補・保存／renderer／通常selectorは不変。nativeの省略資格を広げず、別欄／段落／別本人／補足から主語を借りない。既に対象が先行する評価や、編集選択のない欄へ空metadataを増やさない。

### CPU確認と限界

関連5file296 PASS、FAIL0。MockTransportによる一取得、rawそのままの既存意味採否、希望→実行済みの拒否、native参照chainと重複時の省略保留、過去／否定／留保、欄・段落・source分離、既定wire不変を確認。初期の現文法外の正例・chain材料誤りは適格な架空材料へ修正し、source grammar／validatorは変更していない。部分checkoutの不足test／fixtureはexact親blobへ復元した。authoring_application統合集合は別の不足依存で未実行、296へ含めない。API ec4bd668の自動push CI [43332056239](https://github.com/MassyuRed/mashos-api/actions/runs/43332056239)は準備記録の確認時点では実行中で未判定（§9.21でsuccess確認）。PR限定一覧の0runを全workflow未起動と一般化せず、全suite成功とはしない。追加dispatch／rerun0。

既存一般3型（段落／二欄／refined）は新optionでも全messagesがbyte同一だった。今回の編集能力の対象外であり、同じ3を再生成しない。新しいモデル本文・SQL保存・同版画像・通常採用は0。本文の一般品質改善は未証明。

### 固定した実比較案 — 未承認・未送信・未実行

架空の段落・二欄・refined各1を旧新比較する6要求を凍結。二欄はactual7で露出済みの同じ材料で、beforeは既取得piece_new要求と同一、候補との同時対照として一回再取得する案。段落は既存架空文脈からの改訂、refinedも合成private sourceであり、独立未学習holdout3件やlive保存回答の資格証明とは呼ばない。段落の未決定、二欄のおれ／僕、refined原入力の僕と別補足のわたし・否定希望／過去否定好みを保持する。旧新SYSTEM／原source／生成条件は同一、差分は8つの編集選択だけ。全原文・範囲と6埋込要求を独立静的review済み、blocking指摘なし。効果は実出力で未確認。

script `ar04_piece_editorial_choices_20261113_once.py` は14,489byte、SHA256 `d3daf72bc4e9be5f58c492a826003ee1bfdee572a6758663164f22a295c83727`。既存Pod f1lle4xwq3wjln、既存base提供、外側 `timeout 420s` 必須・内側410秒、最大6生成・1回。学習／再試行／提供停止・再起動／重み変更なし。既存natural鍵1つは同Pod内RAMからloopback認証だけに使い、表示／保存／外部転送せず全環境も読まない。返却データに鍵が一致すれば保存前に停止する。各messages 10,354–14,094byte、既存request byte上限内だが実token数は未測定で、context適合を断定しない。

前回38,004byte一回の承認は消費済み。この新payload／6要求は具体的承認後に実行する。未実行原本は[既存ZIPの追補version4](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)へ保存。234,138byte／53member、SHA256 `08e05c42c06cc281579231038fbd02957c3efc9355274242d7fca133c433c4ae`。旧46memberは全byte維持、新7memberは今回の準備・CPU確認・再現scriptだけ。Git-backed製品source・秘密・browser screenshotは同梱しない。

承認後の閉じる単位は、現4Bの全6raw→原文と全文意味／自然さの比較→独立S7→成立した同本文の既存保存・非生成再読／同版画像。原文コピーや単なる常体化のままなら改善採用にしない。追加fit、prompt周回、採否緩和、失敗raw修補へ自動進行しない。STRUCTURE_MAP_DELTA_NONE：既存private作者入力内の既定OFF候補で、新owner／公開route／DTO／DB／保存schema／rendererは増えていない。AR-03不採用と全補助経路未完を維持する。



<a id="piece-editorial-choices-actual6-20261113"></a>
## 9.21 2026-11-13 — 承認済みPiece編集候補の実6応答、全3組無差分で不採用

§9.20の準備後、Mashは固定14,489byteを既存Podへ送り、架空の段落・二欄・補足付き3組の旧新6応答を、最大7分・一回、学習・再試行・提供再起動なしで比較し、既存鍵1つを同Pod内認証だけへ使うことを明示承認した。前回38,004byteの消費済み承認を流用せず、この新しい一回を実行した。**今回の承認も実行済み・消費済み。**

### 実行と原本

送信後も14,489byte・SHA256 `d3daf72bc4e9be5f58c492a826003ee1bfdee572a6758663164f22a295c83727`一致を確認。既存base提供に外側`timeout 420s`・内側410秒で一回だけ実行。実測52.42028413480148秒、全6 HTTP200／finish_reason stop／attempt1、前後PID77140・health200／status okを維持した。学習／再試行／提供停止・再起動／重み操作0。実model aliasは`cocolon-qwen35-4b-base-851bf6e`、responseのrevision／usageはunknown。aliasから実重みhashやinput token数・原価を推定しない。

既存natural鍵1つは同Pod内RAMからloopback認証だけへ使用し、値・全環境を原本へ出していない。入力途中のUI不調は未実行を確認して操作方法／terminalを変えたもので、比較の再試行ではない。比較後のZIP作成を含むUI操作がtimeoutになったが、再開時に完了出力・閉じたZIPを確認し、modelやZIP作成を再実行していない。52.42秒は比較scriptの時間で、UI入力・回収の作業時間を含めない。

回収original_results.zipは44,820byte／9member、SHA256 `243b432f1fd20746d2d896e3467b8559edb929781bc52c0a355d73110b4d7431`。CRC／安全なpath、同梱scriptと承認packet、個別response1〜6とaggregate、元request／PreparedRequest／旧新messages／request・response hashesを完全照合。初回のhash assertは画面のhex転記誤りを訂正し、原本bytesを変えていない。

### 全文比較・独立再演

| 型 | 実本文の旧新比較と意味 | 判定 |
|---|---|---|
| 段落 | 全response／raw一致・全欄原文copy。条件と「気がする」の留保、読書の過去好み、未決定を保持。焦点語順・反復・話題接続・参加先不明は未改善 | 旧新ともGENERATEDだが編集改善0 |
| 二欄 | 全response／raw一致・全欄原文copy。おれ／僕、欄、対象参照、価値視点、過去否定を保持。氏名が残り既存公開役割化は未達 | 旧新ともUNAVAILABLE、`piece_model_meaning_unassessed_or_changed` |
| refined | 全response／raw一致・全欄原文copy。原入力の僕／別補足のわたし、それぞれの参照、否定希望・過去否定を保持。文章構成・反復整理は未改善 | 旧新ともGENERATEDだが編集改善0 |

rootと独立担当が全3source・全6rawを全文照合。新しい意味反転／対象移動は見つけていないが、原文維持やHTTP成功を作品品質へ換算しない。§9.20の8編集選択を届けても今回可視効果0で、氏名残存も解消せず、候補は**NOT_ADOPTED**。3独立未学習holdoutとは呼ばず、既知二欄beforeは完了actual7のpiece_newと同じ要求の対照再取得として記録する。

API ec4bd668の依存9fileをGit blobで照合し、実rawを無修補で既存receipt→Engine/S7へ再演。4 GENERATED／2 UNAVAILABLE、成立artifactは実rawのblocksと一致。full有限artifact作者・外部HTTP・subprocess fallbackを禁止し、既存chooser内の短句重複比較だけを許可。新provider call／SQL0。意味判定は既存範囲の結果で、source copyのGENERATEDを商品合格や通常採用へ昇格しない。

API ec4bd668の自動push [CI43332056239](https://github.com/MassyuRed/mashos-api/actions/runs/43332056239)／job131578906583はexact head・attempt1・39工程すべてsuccess。local296 PASSは準備時の完了として継承、今回新pytest／dispatch／rerun0。CIが通ることと編集効果0を区別する。

### 保存と残件

今回SQL保存・native画像0。原文copyを下流の件数だけのため再保存しない。refinedは合成private sourceでqualified_saved_snapshotがなく、CPU成立をauthenticatedな保存資格へ変換しない。normalの合成ID再束縛や先行general3の9保存・native成功を、今回のartifact保存成功へ転用しない。S7修正・raw修補へ進む根拠もない。

同じ[既存原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)をversion5へ更新。340,035byte／68member、SHA256 `0d1301827d14da16499e3dd8539f66467409d7f3e2cfff2be3b8d9c1cdece86c`。旧53memberは全byte保持し、実原本ZIP／展開9原本・exact再演／意味review・CI確認・再現script／READMEを追加。秘密・全環境・browser screenshot・Git-backed製品sourceは同梱しない。§9.20の未実行記述は当時の準備履歴として保持する。

今回の製品source／test変更0、APIはec4bd668のまま。既定OFFと通常selectorを維持する。STRUCTURE_MAP_DELTA_NONE：実比較と不採用の記録だけで、新owner／公開route／DTO／DB／保存schema／rendererの責務は変わらない。primaryは候補NOT_ADOPTED、商品品質・正式受入れcredit0。AR-04一般編集品質・採用本文の保存／画像・通常適用、AR-03不採用・他AR・全補助経路は未完。

この比較は閉じる。同じ要求の再試行、注釈・promptの追加周回、学習回数／時間延長、通常有効化は自動実行しない。次は、既存作者の仕事指定・教材と現在の保全材料を照合し、具体的編集判断が本文で実行されない不足を作者側の改修単位へ戻す。metadataが存在すれば能力移管の実商品効果も成立したとは扱わない。


<a id="piece-selected-author-editorial-prepared-20261113"></a>
## 9.22 2026-11-13 — 保存Piece344a×現編集3入力の準備（実行前の記録、§9.23で一回完了）

### 確認した不足と既存作者の境界

§9.21の全copyを、生成後の差戻しやS7が原文copyを強制した結果へ読み替えない。既存Podでpidfileが示す稼働processのinterpreter／script pathと非秘密flag名だけを読み、script全文を取得した。元環境・鍵の値は読まず、model call／提供停止・再起動／重み変更0。

- 実script `/workspace/new-fictional-self-piece4b-once-20261109/piece_ordered_server.py` のSHA256は `5e3d43637ab8c8c541c1e56a74401c5d6d17dcedcdc5aa187448055cb2a3bcd3`。
- `--analysis-service --semantic-json --adapter --adapter-weights-sha256 --adapter-config-sha256 --model-name --natural-reply-model` の存在と、`--piece-adapter`不在を確認。Pieceは`base_inference_context`でAnalysis adapterを外す。`profile=piece`は固定JSON欄の自由な非空stringを生成し、literal enum・raw修補・copy rollback・有限作者fallbackはない。
- current Git providerのSHA256 `a8fdfbe1bd510a6e21177b60a379ed10d2a8789019274bbb260fd040f52601ef`とは版が異なる。current側には、別に選んだPiece adapterの読込／切替／Analysisへの復元とrevision返却が既にある。新しい提供機構を追加する不足ではない。

従って前回Base6の編集効果0は確定し、その一回は閉じる。一方、保存344aを今回初めて接続するという説明も誤り。別general3では同じcurrent generator・`profile=piece`・344aを既に用い、全3で常体化が主だった。今回の具体的編集選択を含む3messagesとの組合せが未確認である。

344aはf6dae重みの継続学習ではなく、元教師を保ったfresh学習の系譜。既存73artifactに限定焦点表現の保持例はあるが、FRESH03の本人再掲も残る。全反復省略・全焦点評価・一般構成能力の保持を主張しない。今回3入力は以前のgeneral3や旧73と同一messagesではないが、独立未学習holdoutとは呼ばない。

### 固定した次の一回

| 項目 | 固定範囲 |
|---|---|
| 送信物 | `ar04_editorial_selected344a_20261113_once.py`、38,745byte、SHA256 `c1d17cc867bd71a1f9e222e51f15944a1c33ac9ae2e37ff16d2a0f6c0c366f43` |
| 作者材料 | §9.21のcandidate側3messagesをbyte同一で再利用。新SYSTEM／metadata／教師／期待完成本文を追加しない |
| 比較 | 既存Base6のcandidate側3rawと、保存344aの新3raw。同一messagesの作者差の比較であり、344aのbeforeがないため8編集選択単独の因果効果ではない |
| 新生成上限 | Piece候補3＋元提供のnormal／Analysis各前後2の4確認、計7。Base6・旧73・別general3の再生成0 |
| 時間・実行 | 停止・復元・証跡保存込み最大600秒、復元枠120秒、一回、追加学習／再試行0。元PID77140・source・現generator・両adapterのhash不一致は停止前に拒否 |
| 保存作者 | 既存 `344a9defd0c890982d9718805d8b630b5d48719475c998aa9a57ed6df6bfc337`、config `24f34137fd7b0aca0366c1a76fb280216d810565e4062974d12dd2096f93d12c` |
| 元環境・鍵 | 実行時だけ元argv／env／cwdを同Pod親RAMへ保持し同提供の復元へ再利用。全値の書出し／外部送出なし。既存2鍵はlocalhost controlだけ、proxy・redirectなし。候補childはnamed runtime pathsだけを受け、鍵／HTTP serverなし |
| 完了境界 | raw無修補→独立全文比較→既存S7。copy／常体化だけなら不採用として閉じ、同型比較・新学習・通常採用へ自動進行しない |

固定wireは39,022byte・SHA256 `b21fcc9e4d81f58fa593cabeaef75d71a598b208d3e21a14489c893f84e21968`。一ファイル内へ圧縮固定し、既存actual6のcandidate3 messagesと完全一致をCPU確認。親／childの構文確認と独立static reviewを実施し、proxy／redirectを使わないloopback通信を固定した。構文・static確認をPod実行や復元成功へ換算しない。

**以下は準備時点の記録。固定一回は承認後、§9.23で実行済み・承認消費済み。** この別の一回は元提供の一時停止と認証情報を含み得る起動環境の同Pod内保持・復元を伴い、消費済み14,489byte／6応答の承認は流用しない。具体的承認後に固定3候補だけを一回取得する。期待された操作の実行個数ではなく、原文の意味・自然さ・反復・公開役割化を本文から判定する。結果が良くても一般作品品質やmetadata単独効果へ広げない。

今回の製品source／test／提供設定の変更0、API ec4bd668を保持。通常option／selector OFF、S7・raw無修補・保存資格を維持し、保存／同版画像／通常適用・正式受入れ・AR-04／他AR／全補助経路の完了は未成立。STRUCTURE_MAP_DELTA_NONE。既存正本の意味保持と編集責務、fresh 00／rules／incident／地図の関係owner／最新weeklyを再確認した。巨大file地図の全本文・全repositoryの理解を主張せず、6MB manifestの取得不能も全読へ換算しない。

同じ[既存原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)をversion6へ更新。369,448byte／74member、SHA256 `92b3af21523c94c3589ae5da01045dc0d643849e0030f85a990ecbc070cd03c2`。旧68memberは全byte保持し、固定実行物・凍結messages・範囲・live読取hash・独立static review・READMEの6fileを追加。秘密／全環境／browser screenshot／Git-backed製品sourceは追加しない。

<a id="piece-selected-author-editorial-actual3-20261113"></a>
## 9.23 2026-11-13 — 保存Piece344a×現編集材料の実3応答、限定編集改善・通常保留

### 承認された一回の実行・復元

Mashは§9.22の固定38,745byteについて、保存済みPieceモデル3応答＋提供前後の確認計4応答を、停止・復元込み最大10分・一回・追加学習／retryなし、既存2鍵は同Pod内認証、起動環境は同Pod内復元だけに使うことを明示承認した。Pod送信後もbyte数とSHA256 `c1d17cc867bd71a1f9e222e51f15944a1c33ac9ae2e37ff16d2a0f6c0c366f43`を確認し、外側`timeout 600s`で一回実行。**この一回承認は実行済み・消費済み。**

| 観測 | 実結果 |
|---|---|
| 新生成 | 保存344a direct候補3／全stop、通常とAnalysisの前後control計4 HTTP200／stop。合計7で追加取得・Base6／旧73／別general3の再生成0 |
| 時間 | script記録111.84152465499938秒。停止・復元と証跡ZIP書込を含み、UI入力・回収時間は別 |
| 作者 | current generator SHA `a8fdfbe1…601ef`、既存Piece weights `344a9def…fc337`／config `24f34137…d12c`、`profile=piece`、model load1。候補childはHTTP server／API鍵0 |
| context | input token2444／3047／3517、出力枠2048込み4492／5095／5565で8192内。HTTP usageや原価は推定しない |
| 提供復元 | 元PID77140を停止しGPU解放、child79597を解放後、元提供をPID79715へ復元。argv／env／cwd・両認証情報を完全比較して保持、元source／Analysis／Piece重みも不変 |
| 対照 | normal／Analysis各前後の全requestと全responseが一致、health正常。control本文の商品品質の合格とは別 |
| 原本 | 回収ZIP27,298byte／7member、SHA256 `b58681b5f80739c6f2ec655aab734cd93378c81b84c90937f7beeba3576a21ea`。CRC・path・aggregate／各原本・凍結wire／3messagesを完全照合 |

既存2鍵はproxy／redirectのないloopback controlだけへ使用。元argv／env／cwdは同Pod親RAMだけへ保持して同提供の復元に使い、全値や鍵を証跡へ出していない。候補は同Podの既存cacheと指定した保存重みだけを使用し、新download／学習／重み変更／retry0。

### 原文・Base・実本文の全文比較

| 型 | 実rawに現れた差 | 保持／限界 |
|---|---|---|
| 長い段落 | 丁寧体→常体だけ | 仕事の比較希望、急ぐ返事の条件、「気がする」、読書の過去好み、未決定を保持。焦点構文・文順・本人再掲・話題接続は元のままで構成改善0 |
| 思考／行動二欄 | 「同僚の森さん→同僚」の原文明記役割化、2回目「おれは」の省略、「僕にとって、…が重要だ」への評価語順整理 | おれ／僕・欄・その時間の対象、希望の未実行、視点、過去否定を保持。全焦点を直接語順へ変えた結果ではない |
| 原入力＋別補足 | 原入力／補足それぞれの2回目本人主語を省略 | 僕／わたし・別source、それぞれのその時間、肯定希望／否定希望・過去否定を保持。source間の統合や因果を創作していない |

rootと独立担当が全原入力／全3raw／Base候補側3rawを全文比較。新しい主体・対象・希望・否定・時点・留保・出所の意味変化は見つけていない。二欄／refinedの2/3ではcopy／常体化だけを越える**限定的な編集改善**が観測され、段落1/3はstyle-only。操作指示の達成個数を品質得点にせず、焦点構文を保持した自然な表現も誤りとは扱わない。一方、一般段落構成・全8編集成立・単独作品品質の完成は主張しない。

3messagesは前回Base6のcandidate側とbyte同一で、Base6は再取得していない。344aのbeforeはないため、8編集選択単独の因果効果は切り分けられない。Base対保存作者という差を含む接続結果であり、344aの初接続、f6dae全能力の保持、独立未学習holdoutの証明にも換算しない。

### 無修補S7・保存資格・残件

API ec4bd668の依存9blobをfresh照合し、exact raw→既存receipt→Engine／独立S7を一回CPU再演。**3 GENERATED／拒否0**、全artifactの本文は実raw固定slotの内容と完全一致。source／prepared／receipt／rawは不変。直generator取得なのでprovider model／HTTP revisionはnullのまま、HTTP由来の証拠を創作しない。全有限artifact作者・外部HTTP・subprocess fallbackを禁止し、追加model call0。新pytest／CI dispatch／rerun0、既存ec4 CI成功を今回の新実行へ加算しない。

今回SQL／同source保存／native画像は0。normalの比較用sourceは`ar04-synthetic-owner`／`ar04-synthetic-record`という非UUIDで、fresh ec4の`piece_v2_source_adapter.py` blob `3cbf86c094e8142130a279301cad1e61196b81ee`とローカルが一致し、既存`PieceSavedSourceAdapter._resolve_original_with_snapshot`のowner／saved_input UUID条件を満たさない。これは静的な資格判定で、実Auth／DB拒否を観測したという主張ではない。refinedも合成sourceで`qualified_saved_snapshot`を持たない。旧SQL helperのuuid4再束縛やcreated_at変更を、同source保存の証拠へ使わず、S7採用と保存資格を区別する。

製品source／test／提供設定の恒久変更0、API ec4bd668、通常option／selector OFF、raw無修補／独立S7／保存資格を維持。STRUCTURE_MAP_DELTA_NONE：既存作者の実比較・限定効果と原本の記録で、新owner／公開型／route／DB／rendererの責務変更はない。限定編集は観測できたが、通常採用・一般作品品質・保存／同版画像・本人端末・正式受入れ・AR-04／他AR／全補助経路は未完。

次は今回現れた公開役割化・本人継続省略を保持して、長い段落の構成・焦点編集の未達へ戻す。保存／画像へ通す材料は既存保存元ownerの資格を持つ原入力から確定し、今回rawを別sourceへ付け替えない。同型再比較・SYSTEM／metadata増量・新学習・通常有効化へは自動進行しない。

同じ[既存原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)をversion7へ更新。442,137byte／89member、SHA256 `177ccad5e95e9c00d79cfe390d06cf8e66dc6368c08e60519c33b821d43bed7c`。旧74memberの全byteを保持し、actual ZIP／展開7原本・再演script/report・独立全文review・原本照合・保存資格境界・README／承認実行記録を追加。秘密／全環境／browser screenshot／Git-backed製品sourceは追加していない。

<a id="piece-qualified-source-checkpoint-prepared-20261113"></a>
## 9.24 2026-11-13 — 資格成立済み源泉を先に固定し、同sourceの生成・保存をつなぐ準備

### 今回直接扱った不足

製品の保存元→Piece作者→CMEE／S7→preview／save／owner再読は既に接続済み。前回§9.23の実rawを別UUIDや時刻へ付け替えて、同source保存の成功にすることはできない。今回は**新しい架空の保存元を生成前に既存ownerで資格成立させ、その同じDB状態から取得後に再開する検証経路**を実装した。製品の資格検査や作者を増やす修正ではない。

normalは保存済みEmlisのFINAL／成功finishを、refinedは実Q2の質問→明示回答→MATERIAL_UPDATE／ADD→current REFINEDを既存ownerが保存した後にsource_refを導出する。UUIDだけで資格を代行せず、SQLの`emlis_parent_source(e)`が返した七項目全体を最初の原本として固定した。Auth／先行Emlis providerは合成・DBは隔離PGliteであり、live資格の実証とは区別する。

### 実装と検証

API `67757447ddea1a63f74bc71eabee1f43124d47f6`でtest系6file、続く `d86f1eb2b47cf57b47d16b1779aac61da73d2efa`で既存CI1fileへ接続。合計7path、製品source／selector／DB schema／依存／renderer変更0。

| 既存owner・path | 今回の差分 |
|---|---|
| `ai/tests/helpers/emlis_q2_postgres.cjs`／`test_emlis_q2_application.py::Database` | pinned PGliteの明示checkpoint dump/load。新規private fileだけへ書き、復元時にDDL／migration／sourceを再seedしない。既定の新規DB動作は維持 |
| `test_cmee_piece_request_saved_pipeline.py` | `_prepare_saved_request`／`_finish_saved_request`へ分離。SQL七項目・owner/input UUID・時刻・thread/events・source_refを保持し、取得前に完全比較。従来wrapperは維持 |
| `piece_v2/test_b05_refined_preview_saved_pipeline.py` | 実Q2 ADD由来のprepare／finishへ分離。回答identity／原本／checkpoint/resultを作り直さず同じ資格で再開 |
| `piece_v2/test_b05_piece_model_saved_pipeline.py` | normalのDB close/reopen→同PreparedRequest／messages→Application source_request→保存・再読。原文／観測identity差替えはprovider前に拒否するCPU test |
| 新 `piece_v2/test_b05_piece_qualified_checkpoint.py` | refinedの実ADD履歴・別回答・生成材料をDB再開後も保持し、再度Emlis start／answerせず既存保存へ通すCPU test |
| 既存 `.github/workflows/piece-b2b-isolated-postgres.yml` | 関係helper／新testのpath triggerと既存model試験stepへの追加だけ。新workflow／job／権限／依存なし |

localはnormal/helper集合45 PASS（39.81秒）＋refined／checkpoint集合3 PASS（20.73秒）＝重複なし48 PASS。初回の不足module／migrationはpartial checkoutの原本不足で、exact ec4の原本を取得・blob照合して解消し、製品修正や合格へ算入しない。新しいtest用固定CPU応答を使い、旧actual rawを新sourceへ再bindしていない。独立担当が既存5原本との差と新file全文を確認しblocking0。

最新[Piece CI43343955206](https://github.com/MassyuRed/mashos-api/actions/runs/43343955206)／job131618680124はexact `d86f1eb2`・attempt1・全39工程success。新checkpoint testは既存model commandへ組み込まれた。前段677の自動run／local件数を重複加算せず、manual dispatch／rerun0。全7pathのGitHub readbackとchanged pathsetを確認した。

### 最初から資格が成立した架空3材料・予行

`qualified_pipeline.py --prepare`でFreeの架空3源泉を新規作成し、全Piece record／quota0の時点でDB checkpointを固定。normal2は既知の長段落／二欄本文で、独立未学習holdoutや新題材とは呼ばない。refined1は「上司の長谷川さんに褒められたのに、嬉しくなかった。」＋実Q2 ADD「その時、私は少し寂しかった。」の正規資格を使う。前回の未資格refinedを昇格していない。

DB checkpointは4,881,732byte・SHA256 `54723033aee127fd45d1540423f77f0408c55b7e77fb57b692e28c5c1dfe304b`。別processで復元し、原七項目・UUID／時刻・thread/events・source_ref・prepared ID／private_json／messagesの完全一致を確認した。実モデルcall0。

固定CPU応答の予行では同じ初期checkpointを使って3件すべて保存・新service非生成再読、各quota1、元source／Emlis不変、本文／payload／recipe／renderer／hash一致。これは**CPU固定材料の3保存**であり、実4Bの新本文保存やnative画像ではない。期待CPU本文はGPU packetへ入らない。

### 固定した実4Bの次の一回（未承認・未実行）

| 項目 | 固定範囲 |
|---|---|
| 送信物 | `ar04_qualified_source_piece344a_20261113_once.py`、38,631byte、SHA256 `a5b9ce6d669b7e7f208082527d6a62eaf18380f93a9d1904cc00574f5cf47c03` |
| 材料 | 同じ資格済みsourceからの段落／二欄／refined3要求、Freeのみ。wire34,555byte・SHA256 `20955eb69acc7129aea6eccb14b8b8df7c018e6d5c24ed4ed5901b3ce9a8745a`。新SYSTEM／editorial metadata／教師0 |
| 取得 | 既存保存Piece344a、候補3＋提供前後4確認＝最大7生成、一回、追加学習／retry0。既存Base6／旧73の再生成やA/Bは行わない |
| 時間 | 停止・復元込み最大600秒、復元枠120秒。前回復元PID79715と元source／両adapter hash不一致は停止前に終了 |
| 同Pod境界 | 既存2鍵はproxy／redirectのないlocalhost確認だけ。元argv／env／cwdは同Pod親RAMで同提供復元だけへ使用。候補childは鍵／HTTP server0 |
| 送らない物 | DB checkpoint／private資格state／合成Auth token／CPU期待本文／元起動環境／秘密。固定messagesと実行codeだけを送る |
| 取得後 | 全原文・raw独立比較→同checkpoint復元→同source／prepared／messagesを確認した新rawだけを無修補で既存S7／保存・再読へ。拒否時のS7緩和・raw補修・別source付替えなし |

固定script親子ASTと独立static reviewは成功・blocking0。確認は実行成功や提供復元の証明ではない。**未送信・model実行0・一回の具体承認待ち。** 前回38,745byteの実行済み承認は流用しない。

画像は、同じ新rawの正規preview／save／detail DTOが成立してから、既存研究363の通常host harnessへ接続する次の工程。閉local transport／合成session／隔離SQL／研究iOSという範囲と元8秒を保ち、独自rendererを追加しない。新native／実Auth/API/DB／本人端末は未実施。通常option／selector OFF、一般作品品質・正式受入れ・AR-04／他AR／全補助経路は未完。

長段落style-onlyという観測は維持する。ただし今回原文に仕事・読書・参加日の因果や参加先がなく、元の自然な焦点構文や読書の別命題を保つことを即不良とはしない。構成能力は未確認のまま、文脈の橋渡しや焦点変更を必須修正として新SYSTEM／metadata／fitを周回しない。

[既存原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)をversion8へ更新。5,198,944byte／104member、SHA256 `4c1cff4bd07b4ad98cd75676c8552f731f619064a947c276f944ff65eec7169a`。旧89memberの全byteを保持し、新規架空資格state／DB checkpoint／凍結wire／予行3保存／review／CI／再開scriptを追加。Git-backed製品・test code、browser screenshot、実ユーザー／実認証情報は追加していない。

STRUCTURE_MAP_DELTA_NONE_FOR_PRODUCT。test支援の新fileとprepare／resume責務は既存01A全file地図／Piece mapへ同単位で記録する。新source／public route／DTO／DB／作者／renderer ownerはない。

<a id="piece-qualified-source-actual3-saved-20261113"></a>
## 9.25 2026-11-13 — 資格固定3件を実生成し、同じ源泉で保存・非生成再読まで確認

### 承認した一回の実行結果

Mashが§9.24の38,631byteを具体的に承認した後、同じscript／wireを既存Podで一回実行。実Piece3応答＋提供前後4確認＝7生成、追加学習／retry0、最終記録114.97119931690395秒で最大600秒以内。候補childは既存344aを一度loadし、同Podのdirect generator／Piece profileで取得した。候補HTTP server／鍵保持0、HTTP model/revisionは発行していないため偽装しない。

元PID79715から80025へ復元。元引数／全環境／cwd／既存2鍵と元source／Analysis／Pieceのweight・configは不変。通常／Analysisの前後requestと全responseはそれぞれ一致、4確認は200／stop、health正常。起動環境は親RAMで同Pod復元だけに使用し、鍵はproxy／redirectなしlocalhost認証だけに使用した。一回の承認は完了・消費済みで、追加GPU／fit／再試行へ流用しない。

実取得ZIPは28,226byte・SHA256 `9e26013357440480cfa2471b362c2dbdfb432d71bf61a5ee8dd32cf1d0316dba`。Jupyterで記録を閲覧した際の自動checkpointを含む8memberで、正本execution／resultは一致する。途中の目視報告110.97秒は誤読であり、最終原本の114.971199秒へ訂正した。

### 原文との全件照合

| 新case／源泉 | 実本文の観測 | 成立しない主張 |
|---|---|---|
| QUALIFIED-PARAGRAPH／normal | 条件・「気がする」・過去の読書好み・参加日未決定を保持。主に常体化 | 一般構成能力や新しい編集改善ではない。原文にない仕事／読書／参加の因果を補わない |
| QUALIFIED-TWO-FIELDS／normal | 森さんを同僚へ役割化し、同じ本人の反復主題を省略。おれ／僕の欄別表記、評価の「にとって」、読書の過去否定を保持し語順整理 | この限定例から全題材の編集能力へ広げない |
| QUALIFIED-REFINED／実Q2 ADD | 長谷川さんを上司へ役割化し、「褒められたのに嬉しくなかった」を保持。別回答「その時、私は少し寂しかった」を別blockに保持 | 回答を元の記録へ混ぜず、意図・原因・現在状態を創作しない |

独立担当と華恋が原入力・補足・全rawを照合し、意味逸脱を見つけなかった。normal2のrawは前回の既知rawと文字列一致、messagesは別であり、未見holdout／同入力A/B／metadataの因果効果とは呼ばない。今回新たに成立したのは生成前から固定した正規資格の同source取得と後段接続であり、前回の2/3限定編集を再加算しない。

### 同checkpointからの保存・非生成再読

保存済み4,881,732byteの初期DB checkpointを再開し、全原七項目／UUID／日時・thread／events・source_ref・prepared ID／private_json／messagesを取得時の材料へ完全一致させた。sourceを再seedしたり、前回rawを別sourceへ付け替えたりしていない。refinedは同じ実Q2 ADDの回答identityを使う。

新3rawは無修補で既存CMEE／S7へ受領し、Free3件ともpreview→save／同key再送→新serviceのowner非生成再読へ到達。本文／content payload／visual recipe／rendererと各hashはpreview・保存行・detailで一致し、hashも独立再計算一致。元source／Emlis不変、quota各1。再読時の作者／compile／reviewは既存禁止blockで0、取得後の追加モデルcall0、有限whole-author fallback／S7緩和0。

| case | 保存Piece ID | blocks／保存枠 |
|---|---|---|
| QUALIFIED-PARAGRAPH | `c256b793-e506-15f6-5838-c2c1e63d1a7b` | 1／1 |
| QUALIFIED-TWO-FIELDS | `6173b8e4-70f2-a617-ce45-cf65fa7259f2` | 2／1 |
| QUALIFIED-REFINED | `2e5758ad-bf00-50f0-2a78-5135c2b9bba3` | 2／1 |

合成Auth／先行Emlis provider・隔離PGliteを使った同source経路であり、live Auth／API／DBや本人端末の成功ではない。refinedのsnapshot差は読取時計だけで、原本／thread／eventsは不変。既存API d86f1eb2とCI43343955206を継承し、今回API製品／test／schema／依存変更0、新API CI／dispatch／rerun0。

### 同じ新本文の画像と継続範囲

既存研究branchの36335452を基に、研究source22e96b4c81481e7d93ba9656a576a6098c6db667で既存fixtureと同一XCTest methodの2fileだけを新3件／9frameへ変更した。本文・source_ref・回答identity・保存receipt／detail・8項目artifactと3hashを保持し、block数は1／2／2。製品・renderer・他method・8秒／90秒guard・閉5API transportは不変。16field内部previewは既存public mapperと明示Free quota／capabilityを使って19fieldへ投影した。テスト用previewの期限だけ2099年へ投影し、原記録や実TTL更新を主張しない。owner detailを既存export応答形へ投影する閉local transport／合成sessionであり、live API／Authや独立HTTP export取得の実証ではない。

[研究native初回CI43347803091](https://github.com/MassyuRed/Cocolon/actions/runs/43347803091)／source22e96b4c／job131631270210はattempt1・TEST BUILD FAILED／exit65。追加した1393行のXCTAssertEqualObjectsへcommaを含むObjC messageを直入れし、macro引数が分断されたこちらの構文ミスだった。XCTest開始0、9frame／画像／書出し0。phase6の別run43347803088成功をnative成功へ混ぜない。artifact14003561243（26,743byte、SHA256 `3adeef9e56855f7c7cb14264fd34596ff9648619bb5c7e0496c48f14f60aba7b`）と全logを保持した。先の独立静的reviewもこの不具合を見落としており、静的成功をcompile成功にしない。

研究修正source `24f7ba8bbccb14bdbb14bd4ff67754a235e42347` は文字列生成を直前のNSString変数へ分けた旧1行→新2行だけ。fixture／期待値／9報告／block1・2・2／renderer／PNG／8秒・90秒guardは不変。全文差分・独立再確認・GitHub readbackと1path一致を確認した。[修正版の既存native CI43350232403](https://github.com/MassyuRed/Cocolon/actions/runs/43350232403)／job131639242393はexact source・attempt1・全実工程success、XCTest既存1method成功。phase6別run43350232521もsuccessだが件数を混ぜない。既存継続指示・設計§12・Rule18§11.3の同test目的内の内部修正として実行し、消費済みPod一回承認は流用していない。新renderer／controller／workflow／job／追加GPU／再生成0。

取得artifact14003928740（2,476,902byte、SHA256 `ecb5d40e3513890768ecd1c8da8d6c524587faf3f6e741a56e08b9888c71e8ed`）の全54memberを保存。実9reportは同source SQL保存3件の本文・8項目artifact・3hashと完全一致し、各作品のpreview／saved／export PNGがbyte一致、実view-shot書出しも画素・asset SHA一致。全9は534.73〜2609.01msで元8秒内。native close ACK→navigate→saved mount、各閉5API／合成session10／source・回答identity／scope破棄も一致した。独立確認と代表3画像の全本文目視で、可視の欠落・重なりは見つからなかった。

自然描画参照PNGと画像全体のRGBAは9/9で異なる。既存instrumentationのnative canvas／全cell判定成功、同版PNG／実書出し一致と混同せず、自然参照画像全体の完全一致は未成立と記録する。これを新Gateにせず、旧V4失敗・製品renderer未採用・正式受入れ未完を維持する。合成Auth／閉transport／隔離SQL／研究iOS／preview期限投影の限定であり、実Auth/API/DB・本人端末・Photos/Shareの証明ではない。

実原本・凍結材料・同source保存／再読・独立reviewは[同じ原本ZIP](https://chatgpt.com/library?file_id=libfile_fde3_f-f30655de312c8191978daec9b93b7008_2f7470f963808191aaebf050935e72de&account_id=personal)version9へ保存。5,293,067byte／120member・SHA256 `d1cfff34b2b3e56e02550513c1ca31a2443b5ee30a866694a69e4d1285cb9e5d`。旧104memberの全byteを保持し、実取得・復元記録・3保存／再読・reviewを16member追加した。Git-backed codeとbrowser screenshotは追加していない。

native初回失敗と最小構文修正の独立reviewは同ZIP version10へ追加。5,419,078byte／131member、SHA256 `ca5f105015d0a42aa581183842daec3072bb7f1cd4a0966334021d5aebb2c33b`、旧120member全byteを保持。Git-backed native source／fixtureとbrowser screenshotは追加していない。

成功した同source画像9frame・PNG／実書出し・全ログ・xcresult・独立reviewは同ZIP version11へ追加。10,515,396byte／193member、SHA256 `8a4662801f62388c69b2e440cb7cd8947e4fea833af4ebe1a4c714eb77bbc149`。旧131memberの全byteを保持し、新62memberを追加。初回失敗の履歴を成功へ上書きせず、Git-backed code／fixtureとbrowser screenshotは追加していない。

STRUCTURE_MAP_DELTA_NONE_FOR_PRODUCT。既存作者／source owner／公開型／route／DB／renderer／通常selectorに変更なし。一般編集品質・通常採用・live反映／本人端末・正式受入れ0/3・AR-04／他AR／全補助経路は未完。今回の7生成を繰り返さず、同じ新本文の既存画像経路と未解消の三中核品質へ接続する。


<a id="piece-frame-solid-paint-candidate-20261113"></a>
## 9.26 2026-11-13 — 同版画像の枠帯を研究版で解消、旧作品互換のため通常採用は保留

前セッションで待機していた研究native run43350232403は成功済みとfresh再照会し、同3作品の実raw→隔離保存8項目／3hash→9frame→各実view-shot一致を独立再確認した。旧7生成／同nativeを未完として繰り返していない。

旧実画像の枠内には幅広い段階状の帯があり、自然参照は2pxの細い単色枠だった。原PNGの画素行を再計算すると、本文位置の自然参照との差は0〜1px程度で、大幅な段落移動は確認しない。実canvasとview-shotはともにrenderInContextで、既存PieceVisualCardのsurface＋borderWidth:2のViewを含む。自然参照はborder色矩形と2px内側surface色矩形を塗る。文字bitmapは透明な文字だけを合成し、帯をV4文字変換の累積とする証拠はない。RN内部の正確なbacking原因は未確定。

研究source [0b6d212f](https://github.com/MassyuRed/Cocolon/commit/0b6d212fc43c0d13bff107940ad551bc0147f5df)で既存components/piece/PieceVisualCard.jsだけを変更。margin/2のborder色外矩形と2px内側のsurface色矩形へ分け、現12テーマの不透明palette・寸法・z順を保持した。本文／計測／bitmap／recipe／renderer版／8秒guard／fixture／native method／依存は不変。この無条件共通部品の変更は通常sourceへ採用していない。

Node24.22.1で構文成功、既存renderer189件は188成功＋partial checkoutのuiTokens不足1失敗後、同ref原本を補完しその1件だけ再確認成功。重複なし最終189成功。独立事前reviewで阻害事項なし。[既存native run43357602783](https://github.com/MassyuRed/Cocolon/actions/runs/43357602783)／job131663248153はexact source・attempt1・success、同じ既存1method／3作品9frameを実行。phase6 run43357602772の別successを件数へ混ぜない。

取得artifact14007444370は2,282,689byte／54member、SHA256 6207e4fd83e1ab1905a183114ef2966b95fe699f91f1a539480a359d5574e810。CRC・全原本を回収し、全9で保存artifact8項目・再計算3hash、本文／block／行分割／字体寸法／配置・inspection座標が旧SQLと一致した。各作品preview／saved／exportのPNGはbyte一致、実view-shotはRGBA一致。閉transport／source・回答・保存identity／native close ACK後遷移は保持し、exportの画像SHAだけが新画像へ変わった。全9は414.08〜3500.18msで元8秒内。旧2.61秒より速いという主張はしない。

独立画像照合では、各本文ink矩形を2px広げた領域以外の計11,504,562画素における指定palette／自然参照との差は0。旧背景は作品ごと1frameあたり572,227／588,782／601,881画素が相違していた。rootも左右余白strip各100,000画素が旧100,000差→新0差、2px枠／内面の色と3画像の帯除去・欠落／重なりなしを確認した。本文色の画素位置は旧新同一。自然参照との全RGBA差はparagraph87,266／87,265／87,260、二欄各53,538、refined各18,306が残り、すべて上記文字領域内。全画像一致や一般文字renderer解決へ拡げない。この画素診断を新しい受入れGateにはしない。

### 通常採用を保留する具体的な互換境界

[Piece_Render_Reproducibility_Contract_20260808.md §7–8](../../../Cocolon_Piece/pce5_visual_recipe_export/Piece_Render_Reproducibility_Contract_20260808.md#7-renderer-version-rule)は、visual outputが変わるbug fixでrenderer versionを上げ、旧作品の見た目をlatestへ暗黙置換しないと定める。pieceLayoutのsaved読取も保存時のidentity／appearanceを保持する。今回共通枠Viewをそのまま通常へ移すと、ios.v1/v2・旧prototype等も変わるため、通常sourceへ採用しない。研究fixtureのios.v2標識は比較のための既存原本であり、新しい正式renderer版の採用や旧作品上書きの実績ではない。後続の採用は旧版へ元の描画を残し、新しいrenderer版だけへ候補を結ぶ単位が必要。

同じ原本ZIPはversion12で旧193memberを全bytes保持し、候補／実行中checkpointを3member追加済み。今回の成功原本・全54member・rawZIP・run/job/log・root／独立比較をversion13へ追加し、旧196memberも全bytes保持。256member／15,226,461byte、SHA256 148e2f675d04a8223d202305d3ff4692a089fe6facf55d6828963fbd1606bd51。Git-backed source／秘密／browser screenshotは含めない。

STRUCTURE_MAP_DELTA_NONE：研究の既存背景描画owner内の技法のみで、通常の型／接続／責任／fileを加えない。primary TECHNICAL_CREDITは研究の枠帯修復と同版保存画像の保持に限定。一般作品編集品質／通常source採用／新renderer版接続／live／本人端末／Photos・Share／正式受入れ／全補助経路は未完。AR-02の二入力訂正が次の直接未接続であることも維持する。今回native一回は完了し、完了したGPU／nativeを繰り返さない。追加GPU／学習／DB／Render変更0。



<a id="piece-latest-only-frame-adoption-20261113"></a>
## 9.27 2026-11-13 — リリース前は最新だけ動かす方針を採用し、実証済み枠描画を通常sourceへ接続

### Mashの今回の決定と、旧版の扱い

Mashは「まだリリースしておらず、アプリを使っている人はいない」「旧版を使えなくなって困る人はいない」「リリースするまで最新の状態さえ動けばよい」と明示した。旧版を仕組み上動かした方がよい場合は既存部品を使ってよいが、現利用者を守るためだけの旧版維持は不要とする。これは今回受領した運用方針であり、本人データ・権利・source／保存の照合は従来のまま扱う。

この決定は、§9.26で通常採用を止めていた旧作品の見た目維持・bugfix時の新renderer版要求に、正式リリースまでの範囲で優先する。既存の再現性契約§7–8へ同じ境界を反映した。新しい互換systemや旧版維持のためだけのrenderer v3／native capability／header／SQL migrationを追加しない。途中のv3案は原本確認までで取りやめ、API／native／DB source変更・migration作成／適用は0。

### 今回採用する実装と、確認済みの結果

通常開発branchのcomponents/piece/PieceVisualCard.jsだけを、研究0b6d212fc43c0d13bff107940ad551bc0147f5dfの検証済みblob a78b9a6a8595b2d3e90b2efa4e9ee00fa8e182b9へ揃えた（通常採用commit85752002098ce0aa31f278e00c591e662a88bbb8）。borderWidth:2の単一Viewを、同じmargin/2のborder色外矩形と2px内側surface矩形へ分ける。既存12テーマ・本文・文字計測／bitmap・renderer識別子・recipe／3hash・保存／source／権利・8秒guardは維持する。通常の新しいsourceで再描画した画像が最新の背景表現になる。

先行のexact同一製品sourceでのnative run43357602783はattempt1・success、3作品9画面の本文／保存8項目／3hash・行割り／配置と各preview／saved／export PNG・実view-shot一致、414.08〜3500.18ms、枠帯除去を確認済み。今回の採用sourceで既存renderer189件は189成功・FAIL／SKIP0。先行runや再確認を合算して件数を増やさず、新通常headのnative／全suite成功へ読み替えない。v3・旧版互換を証明するための追加native runは不要となり、完了した同3作品のGPU／nativeを繰り返さない。

通常採用commit85752002のRN契約CIは1453件＋301件すべて成功、phase6契約checkも成功。iOS source／native canvas自動jobは確認時点で実行中で、完了済み研究9画面と混同しない。

通常branchの既存CIはsource反映に伴う自動起動の結果を確認する。旧V4の既知失敗、自然参照との文字領域のRGBA差、一般編集品質・model selector OFFは継承する。今回の通常source採用はコード上の接続で、署名アプリbuild／TestFlight／本人端末／Render配置／live API・DB適用ではない。追加GPU／学習0。

STRUCTURE_MAP_DELTA_NONE：既存背景描画ownerの内部実装だけで、新しい型／route／DB／file／責任分界はない。全file地図・Piece mapの既存ownerを継承し、関連する現在地と本設計・再現性契約を同単位で更新する。AR-02の完了応答後の二入力訂正、他ARの品質・通常反映・本人端末と全補助経路は未完。


<a id="emlis-post-reply-correction-20261113"></a>
## 9.28 2026-11-13 — 完了した通常応答へ、対象と本人説明の二入力訂正を接続

**11/13・Mashから華恋へ判断を委任された提供方針：** 今回の応答への訂正・読み直しはFree／Plus／Premiumすべてに提供する。次回以降への活用は既存権利に合わせ、Freeは当回、Plusは適格履歴、Premiumは適格履歴と本人フレームを差にする。誤解を伝える入口や当回の読み直しを課金で閉じない。新料金・月間quota・問数増加は追加しない。Premium本人フレームへの新しい訂正の反映は構築目標であり、接続済みとはしない。

API f5d2ce59a5625f738bc1b277cff755548556ba98で完了natural応答の二入力訂正を接続した。既存SQL／合成providerで147件成功、RNは既存CIと同じMetro bundle検証除外で47件成功（新4件を含む）。実4Bによる訂正後本文品質・稼働DB／Render・配布／本人端末は未確認。


通常CIの追加確認（実装head固定）: API f5d2ce59a5625f738bc1b277cff755548556ba98 の43366400986/job131691713496は全工程success（新訂正検証を既存保存系suiteに含む）。RN 81975f78cc7cd22d593d109586231c5267ac63fc の43366761638/job131692868573は1453件＋305件すべて成功。phase6／既存System Context検証も成功。当時実行中だったAnalysis43366400970はsuccess、RN iOS sourceは既存V4の19失敗で終了した。最終状態と実4Bは後続§9.29を参照し、全CI成功・意味品質合格・live／本人端末成功へ換算しない。
### 実装と利用者の一往復

同じ応答Modalで「違うと感じた内容を伝える」を開き、「どの内容ですか？」「どう違いましたか？」を別々の必須欄にする。対象欄は当該応答の抜粋を指定し、同じ文字列が複数箇所なら前後も含める。送信は既存本人・thread revision・current observation event ID・一意なexact部分文字列へ束縛し、別応答・古い版・空欄を受け付けない。本人・入力・表示版変更で旧formを失効させ、backgroundでは送信しない。新しい独立画面や旧client向け分岐は追加しない。

POST /emlis/threads/{thread_id}/correctionsを既存application ownerへ追加した。既存のQUESTIONへの回答、Premiumのframe_feedbackとは別commandであり、架空のQUESTIONやframeを発行しない。訂正OPERATIONはstage=INTERPRETATION_CORRECTION、私有InterpretationCorrectionSourceとして原入力／AI対象抜粋／本人説明を分離する。source prefixには同じ保存済み訂正を含め、原入力・入力件数・課金quotaを追加消費せず、issued_count・受取ON/OFFも変更しない。

対象を指定して「違う」等だけを送った場合も、異議を保存する。NEEDS_DETAILとして旧応答をcurrentから外し、本人の具体説明を求めるformを残す。説明を追加するまでmodelを呼ばない。具体説明を受けた後も機械的に意味をRESOLVEDとせず、UNASSESSEDを維持して、本人が述べた範囲で既存natural ownerに読み直しを依頼する。AI対象抜粋は本人事実の根拠にせず、反対の意図・理由を補わない。本文の有限意味比較、旧回答checkpoint、追加QUESTIONで訂正済みを偽らない。

既存commitのCAS／本人／source／期限とOPERATION journalを利用する。保存ACK不明は同commandの実保存を読み、同attempt／prefix／payloadを照合して再開する。受領済みmodel本文は既存receiptから保存し、providerを取り直さない。C1の後にC2が成立してからC1を再送しても、最新の本文を戻さない。生成失敗時も旧対象をcurrentへ復活させない。同じ保存本文のGETは非生成で、元の応答・訂正対象・本人説明の出所を区別する。対象previewも旧bodyのcontext権利を再確認し、timelineで隠した古い全文を再露出させない。

### 履歴、保存と未接続範囲

CLIで作成した20261113041739_emlis_interpretation_correction_history.sqlは、既存emlis_thread_related_contextの同identityを置換する。検索材料に本人の説明だけを加え、履歴eventでは指定stageのOPERATIONだけをQUESTION／ANSWERと併せて返す。AI本文・他OPERATION・provider receiptを履歴材料へ混ぜない。security invoker／空search_path、service_role限定ACL、本人／保持期間／plan／guardを保持し、新table・event CHECK・commit RPCの変更は不要だった。適用順はmigration→API→RN。稼働DBには未適用。

保存済み訂正はcurrentだけでなくpast recordの再構築にも入り、Freeの次回履歴0、Plus／Premiumの既存参照権利内で本人説明を引き継ぐ。過去threadのrevision変更で、既に旧historyを参照した返答はCONTEXT_CHANGEDとなる。訂正を読めない旧有限history planやhintから、否定された理解を再確定しない。原入力と本人回答はそのまま保ち、naturalには原文と説明を別sourceで渡す。

Premium本人フレーム、Analysis／ASTOR材料、Pieceへ新しい訂正を伝える経路は後続AR-06等の残件。既存frame全体をREJECTEDにしたり、本人説明を原入力／回答へ上書きしたりしない。訂正後のPiece作成は現在のsource資格へ昇格させず、RNからの誤ったhandoffを止める。実4Bでの意味反映・自然さ、説明が曖昧な一般文の理解精度は今回の合成検証では証明していない。

STRUCTURE_MAP_DELTA_PRESENT：既存Modal／hook／API client、application service／DTO／source／history／natural／有限比較、既存履歴RPCの責務を更新した。新製品fileは0、新test1とmigration1。Emlis／CMEE map、01A／01C全file地図、全体現在地、Emlis商品仕様を同じ反映単位で更新する。新料金・運用flag変更・GPU／学習・Render配置・署名build／配布は0。

### 前回の通常枠採用CIの最終状態

85752002の通常CI43362106823は全6job終了・全体failure。RN／Android sourceは成功。iOS sourceはcompile成功後に既存V4の19失敗、native canvasは6method中5成功・旧WholeCanvas1失敗。独立照合では旧run39727150432とsourceの19失敗名・順序が一致し、canvasのsnapshot本文を除くfailure記載119件も一致した。今回の枠修正による新規assert failureは検出していないが、全CI成功や既存負債解消にはしない。同sourceの研究9画面の成功は継承し、GPU／nativeの手動再実行は行っていない。

<a id="emlis-post-reply-correction-actual4b-20261113"></a>
## 9.29 2026-11-13 — 訂正後の実4B本文を原入力照合し、同じsourceで保存・再読

実装はAPI `f5d2ce59a5625f738bc1b277cff755548556ba98`／RN `81975f78cc7cd22d593d109586231c5267ac63fc`を維持する。実4Bで訂正を受けた本文を確認したが、意味保持は未達であり生成指示の二候補は通常不採用とした。初回の誤ったAI応答は試験用の合成fixtureであり、実4Bの初回→訂正のlive一往復を証明したものではない。

| trial | 実4Bの3訂正応答 | 原入力と全文を照合した結果 | 保存・非生成再読 |
|---|---|---|---|
| v2・現実装 | 8.350098823秒、3 HTTP200/stop | intentで助けた側と助けられた側を反転し過去の助けを今回へ移動。uncertaintyで一回の記述を「考えてしまいがち」へ拡張 | UI回収がprovider待受期限に間に合わず保存未成立。3保存成功に数えない |
| v3・役割／時点／習慣の共通指示 | 8.039397989秒、3 HTTP200/stop | 役割反転と習慣追加はなくなったが、uncertaintyで発表中の表情を発表後へ移した。intentの語りも報告文寄り | 凍結した同source・要求へ実rawを無修補で戻し、3件の既存SQL保存／新service非生成再読が一致 |
| v4・訂正後の応答目的と時点分離 | 10.436295715秒、3 HTTP200/stop | intentに性別未記載の「彼」を追加。uncertaintyの時点混同と、本人未記載の「事実と想像の境界線が曖昧」という認知評価を追加。conditionsは準備条件と緊張を保持するが反復が残る | 同sourceの3件保存／新service非生成再読が一致。別processへcheckpointを復元した非生成再読も照合 |

計9実応答、model `cocolon-qwen35-4b-base-851bf6e`、PID80025を全trialで維持し前後health200。学習・retry・提供再起動0。初回の別aliasによるpreflight停止は生成前の0callとして分ける。3trialは同じ架空本文・model・decodingだが新しいIDと記録時刻を持ち、trial間の厳密byte同一A/Bとはしない。「同source保存」は各trial内の凍結要求から同じ隔離SQLへの保存に限る。

v3/v4では原入力不変、元の合成応答を保存維持、QUESTION／ANSWER追加0、NEEDS_DETAIL後も説明だけでRESOLVEDにせずUNASSESSEDを維持した。Free／Plus／Premium各1題材であり、各題材を全3planへ広げた試験ではない。Auth・HTTP framingは合成、DBは隔離PGlite、生成だけが既存Podの実4B。32 CPU成功は不採用候補の動作確認であり意味品質に換算しない。全文・request／response SHA・checkpoint・保存原本・不採用候補差分は[実結果一式](https://chatgpt.com/library?file_id=libfile_fde3_f-033c04b501088191bab8063ebceb9a8d_2f7470f963808191aaebf050935e72de&account_id=personal)へ保持する。

### 故障を限定できた既存接続と次の再開位置

`admit_emlis_thread`は訂正の出所・版・全文をprefixへ束縛するが、説明の役割・時点・留保はまだ意味読取りへ移していない。`natural_reply_meaning._source_witnesses`は訂正付きrecordを有限比較から外し、説明自体も読んでいない。`_process_natural`も訂正時の独立比較を未実施としてUNASSESSEDへ退避する。保存成立や形式検査だけで意味成功にしない現状と、今回の実誤読は区別する。

次は§4.5／§5.1の責務に従い、このsource意味読取り→作者材料／完成本文の独立逆読取りの未接続部分を既存ownerへ移す。移管元は既存の役割・肯否・finite時制reader、`read_cognition_clause`の認識時点／内容時点の別range、`_answer_nucleus`の「旧文は対象指定、新説明だけが意味を持つ」責務である。実ANSWER前提の関数を丸呼出ししたり、訂正を架空QUESTION／ANSWERへ変換したりしない。AI対象抜粋はlocator/controlのまま、未対応を本人の説明不足・意味合格・反対の意図へ変えない。新たなSYSTEM追加比較や学習を自動再開しない。

通常の二入力訂正のコードは維持し、v3/v4の生成指示候補を撤回した。STRUCTURE_MAP_DELTA_NONE：今回の製品owner／公開型／route／DB／RN／Safety変更0。前回§9.28の構造追加を取り消すものではない。Premium frame／Analysis／ASTOR／Pieceへの訂正伝播、live DB適用・Render配置・配布／本人端末・一般品質・全補助経路は未完。Analysisは全plan・全保存期間の既存累積範囲を維持し、自然応答の履歴件数上限を移さない。

通常CIの最終確認：API保存系43366400986とAnalysis43366400970はsuccess。RN81975f78の契約1453＋305はsuccess、iOS sourceのV4は既存19失敗で全体failure。旧job131677782190と現131692868647の該当21行は一致し、新規のassert failureは検出していない。既存V4負債を解消したとはしない。手動native／GPU旧要求の再実行は行わない。

<a id="emlis-correction-meaning-reader-20261113"></a>
## 9.30 2026-11-13 — 本人訂正説明を別sourceの意味読取りへ接続、生成補助は実4B未達で通常不採用

API `0985877fb27935ef9510daa93f64a8ec1d1a4ed8`。§9.29の未接続だった訂正説明を、既存の有限役割読取り・認識時点読取りとprivate完成本文比較へ接続した。新作者／controller／route／DB／RNは追加しない。実4Bで生成への効果も確認したが安定せず、生成補助の通常接続は撤回した。意味読取りの接続を、本人へ返す文章の品質成功へ換算しない。

### 接続した既存責務と、未対応の保持

`natural_reply_meaning._correction_reader_sources`はadmission済みの`user_explanation`全文だけを独立したsourceとして扱う。MeaningWitness／MeaningCheckとcognitionのrangeに、USER_INTERPRETATION_CORRECTION、correction_id、親input_id、説明の記録時点、field pathとscalar／UTF-8座標を保持する。AI対象文は一切readerへ渡さず、本人の事実・人物・肯否・時点の根拠にしない。訂正済み原入力を有限比較から外す既存処理は維持し、原入力と全説明は作者材料から削らない。

同recordの訂正が複数、説明に未確定・引用・更新文脈がある場合は新しい限定読取りを行わない。単なる否定から反対の意図を作らず、記録日時から出来事時点を補わない。未読の後続文を持つ説明も生成hintへ使わない。研究用に渡せるのは全説明を読めたcurrentのEXPLICIT_FOCUSだけで、広いfinite補助・過去の生成hintは有効化しない。訂正由来cognitionはsourceの別rangeとして保持するが、下記の実退行により研究でも生成投影しない。未訂正原入力の既存研究cognitionとは区別する。

`emlis_thread_service._process_natural`の訂正時の一律比較skipを外し、読めた説明に対して既存`compare_reply_meaning`を実行する。役割・肯否の限定比較であり、未対応・複数候補はUNASSESSED、部分一致もfull coverage／RESOLVED／本人確認済みにならない。結果は既存private artifactだけへ保存し、公開DTO・QUESTION数・課金quota・receipt再開を変更しない。新しい保存拒否gate・再試行・本文修補は追加していない。

### 実4Bの同source比較と、通常候補の不採用

| 実行 | 実本文で確認できたこと | 採否と保存範囲 |
|---|---|---|
| 架空3件のbase／supported各1、計6応答 | 11.561497559秒。focus_agentは両方とも姉→先生を保持し大差なし。focus_recipientのsupportedでは格崩れが一度解消。knowledge_daysのsupportedは未記載の休館実現と、その後の第二の認識を追加 | cognition投影は不採用。supported3件の同source隔離SQL保存・新service非生成再読は一致するが、意味品質合格ではない |
| 上記の役割補助だけを接続した通常owner候補、新sourceの2応答 | 2.935671504秒。focus_agentは「先生が姉を呼び止めていた」で明確反転。focus_recipientは「妹が先生を呼び止められた」という格崩れと、母の未提示の逐語発言を引用する創作が再発 | 通常hint接続も撤回。2件保存・非生成再読は不採用原本の保持であり、通常提供の成功にしない |

計8応答はHTTP200／stop、model `cocolon-qwen35-4b-base-851bf6e`／PID80025と前後health200を維持。学習・retry・提供再起動0。最初の3組は同じsource prefix／ID／時刻／全原文の厳密対で、hintとその説明だけが差。次2件はfresh ID／時刻を持つため、trial間のbyte同一A/Bではない。初回の誤応答は合成fixture、訂正後8応答だけが実4B。選択カテゴリ・各感情と強度も入力票とSQL／送信材料で一致させた。Auth／HTTP framingは合成、DBは隔離PGliteで、live Supabase／Render／配布・本人端末ではない。

実8本文は今回の独立比較でも全て未判定であり、語尾・複文・引用・時点の自由文逆読取り不足を残す。旧9本文も新しい生成なしで照合し、全てUNASSESSEDのままで一般修復していない。最終sourceの関連3suite167件成功、試行中の広い集合337／339成功と区別する。API0985877fの通常保存系[43379453153](https://github.com/MassyuRed/mashos-api/actions/runs/43379453153)とAnalysis[43379453416](https://github.com/MassyuRed/mashos-api/actions/runs/43379453416)はともにsuccess。原入力不変、架空ANSWER／QUESTION追加0、訂正assessmentはUNASSESSEDのまま。全文・hash・凍結要求・5保存と再読・checkpointは[実結果原本](https://chatgpt.com/library?file_id=libfile_fde3_f-c28bb6de53b881919bb8974a4eee1a03_2f7470f963808191aaebf050935e72de&account_id=personal)へ保持した。

### 現在の状態と次

生成hintは既存の明示研究flagだけで、通常のSYSTEM／全材料は補助なしを維持する。今回の接続は限定source読取／private比較の技術範囲であり、訂正後の自然な文章・一般品質・正式受入れは未達。通常候補の失敗を単なる保存成功や一度の改善で覆わず、同じhint追加比較・再生成・学習を周回しない。次は実本文で未対応の語尾・複文・引用を、既存のsource意味責務と完成文の逆読取り／作者へ移す。旧二段表示前提のbody inverseを丸ごと適用せず、役割や時点を正しく渡した後の文章化の誤りも別に直す。

STRUCTURE_MAP_DELTA_PRESENT：既存natural_reply_meaning／natural_reply／emlis_thread_service内の訂正source読取・研究作者材料・private比較の責務を更新。新製品file0、新公開型／route／DB／migration／RN変更0。00現在地、Emlis詳細、Emlis／CMEE map、01A地図を同期し、01CはAPI／DB境界が変わらないため差分なし。Premium本人frame／Analysis／ASTOR／Pieceへの訂正伝播、live／本人端末・他AR／全補助経路は未完。Analysis全plan・全保存期間、Cocolon全仕様のリリース前latest-only方針を保持する。

<a id="emlis-ai-target-context-prepared-20261113"></a>
## 9.31 2026-11-13 — AI訂正対象と本人説明の生成上の出所分離候補・実3要求の準備（実行前記録、後続§9.32で完了）

API [3b727b3f6f3b9d9024f2fd0fee2960ad9f936ab9](https://github.com/MassyuRed/mashos-api/commit/3b727b3f6f3b9d9024f2fd0fee2960ad9f936ab9)。§9.30から続行。逆向きになった実応答の冒頭が旧AI対象文と一致する現物と、旧AI文と本人説明を同じuser JSONへ入れる現作者材料を確認した。混入原因の仮説であり、これだけで原因確定や品質回復とはしない。曖昧な訂正から対象文を削除すると何を直すか失うため、全文を保った出所分離を採る候補とした。既存_answer_nucleusの対象指定/controlと本人説明/sourceを分ける責務の移管で、旧二段body parserや新作者は追加しない。

`build_natural_reply_messages`は既存NaturalReplyInput.material_json/source prefixを変更せず、明示研究option時だけtarget_ai_interpretationをassistant contextへ移す。本人の原入力・全説明・記録順・各recordの資格は不変。AI対象の全文とparent/correction/event/field/refを残し、user側には対応locatorを置く。曖昧・複数訂正も文脈を失わせず、意味確定や反対意図を作らない。SYSTEMとoptional hintは増やさず、通常optionはOFF。自由文の推測語尾や進行相を削って比較をCONFLICTへ変える修正は行わない。

現稼働HTTPは2message専用で、そのまま3messageを送ると受付できない。既存serve_emlis_natural_replyに、明示CLI時のnaturalだけ3messageを受ける候補を追加した。AI側と本人側の全locatorが一対一対応するものだけ許し、任意assistant履歴／参照不一致、Analysis/Pieceの3messageを拒否。通常2message、認証・lock・context/output枠・adapter/重みは保持する。server候補は未配置。

関連4suite187 PASS（初回8を内包、既存warning1）と、独立したserver suite20 PASS。新source/test4pathはGitHub全文と変更pathの一致を確認。新GPU0、学習0、通常採用0、live DB／Render／RN変更0。既存8と旧9の意味品質・自由文比較未達を継承する。

### 具体化した一回と、まだ行っていないこと

前回pairedの補助なしbase3（姉→先生、先生→妹、昨日の認識と今日の休館予定）について、同じsource/ID/記録時刻/prefix/全材料・SYSTEM・decodingを固定した。撤回済みhintを持つnormal研究2件の材料へは戻さず、旧base3の要求／応答hashを再利用して旧生成を繰り返さない。新候補3要求とrunnerは計31,471byte。既存Pod f1lle4xwq3wjln、最大600秒・復元120秒先取り、候補3＋元natural/Analysis前後4の最大7生成、追加学習／retry0の一回を準備した。未送信・未実行で、過去の消費済み一回承認は再利用しない。

停止前に元PID80025/source5e3d・args/cwd・既存adapter/両鍵とcached tokenizerの3message/8192枠を確認し、不一致なら中止する。元envは同Pod親RAMだけで保持し、子へ資格情報を渡さない。元提供停止後、元sourceの既存load_generatorをnatural profileで直接3回呼び、元args/env/cwd/鍵で提供を復元して前後4対照を全文照合する。source/重み編集や新server公開は行わない。取得方法は直接generatorへ変わり、再load・限定子環境もあるため、旧HTTPとの同process厳密A/Bや新3message HTTP受付の実GPU成功とは言わない。

### 保存準備と限界

旧隔離checkpointの期限切れと未知結果再取得禁止を確認し、別の隔離分岐で処理deadlineだけを更新した。原入力・説明・訂正ID/時刻/prefix/全材料を一致させ、既知の旧rawを既存受領eventへ入れ、受領後の非生成処理から3保存／新service再読を確認した。未知のGPU結果の再取得、旧source改変、本番の期限切れ再開ではない。新候補の実raw保存や品質改善として加算しない。新結果は無修補で全3本文を原入力と読み比べ、同じsourceの隔離保存・非生成再読を採否と分けて行う。

STRUCTURE_MAP_DELTA_PRESENT：既存natural_replyのmessage責務と既存serverの明示研究受付を更新。新製品file／公開DTO／route／DB／migration／RN追加0。00現在地、01A、Emlis/CMEE mapを同期、01B/01CはPiece/Analysis・account/public DB境界不変のため差分なし。AR-02/全補助経路は未完。Premium frame/Analysis/Pieceの訂正伝播・live/本人端末・正式受入れは未完。

<a id="emlis-ai-target-context-actual3-20261113"></a>
## 9.32 2026-11-13 — 承認済み実3比較・元提供復元と同source保存、役割品質未達で通常不採用

§9.31の31,471byteをMashの具体承認後に既存Podで一回実行。候補3は既存sourceのload_generator/profile=naturalから直接取得、全stop/attempt1。元natural/Analysisの前後4HTTP対照は全200/stopで各前後の全response一致。学習/retry/source/weights編集0、86.14497409574687秒（600秒上限、復元120秒先取り）で完了。元提供PID80025→83325、元args/env/cwd/既存2鍵とsource/adapter不変・health正常を確認。環境全量と資格情報は同Pod内に留め、生成子へ鍵を渡していない。この一回は完了・承認消費済み。

### 全3本文の原入力対照

| case | 同sourceの実本文から分かったこと | 採否 |
|---|---|---|
| focus_agent：姉が先生を呼び止めた | 先生が姉を呼び止めていた、と逆向きに生成。旧baseは姉→先生を保持していた | 明確な役割反転で不採用 |
| focus_recipient：先生から呼び止められたのは妹 | 母の未提示逐語引用は消えたが、先生を呼び止められた、という格・態になり、訂正した先生→妹の向きを明瞭に保てない。可能の読みなら逆向きにもなる | 引用の縮小だけで合格にせず不採用 |
| knowledge_days：昨日朝に今日午後の休館予定を知った | 昨日朝に休館予定を知っていた、と保持。未記載の休館実現や後の第二の認識を追加しない | 新しい明確な意味変異は見つけていないが、旧baseも時点は正しく、品質回復とは加算しない。理解しましたという更新説明寄りの自然さも残る |

原入力の忘れ物・本人不在・今日午後等を全て復唱させる条件は追加しない。単なる省略を反転/意味欠落と決めず、役割の明確な変異、未提示引用、予定と実現/認識の混同を分けて全原文と照合した。短縮や一つの引用改善だけで候補を通常採用しない。新3message/再load/限定子環境という取得差があり、差の原因をmessage分離だけへ断定できない。新HTTP受付の実GPU受入れ・厳密同process A/Bの証明ではない。

### 原本・同source保存と未成立

新3要求/本文hash、全stop/attempt1を照合。Pod原文表示から回収したcandidate/execution/controlsのUTF-8ファイルはPodのsha256sumと一致し、原本を修補していない。Download通知は取得できず同ファイルの原文表示へ切り替えた。起動環境/両鍵/サーバーログは回収していない。

凍結した補助なし旧base3と同じsource/ID/時刻/prefix/materialを使い、既存の受領event後処理から3件の隔離PGlite保存・新service非生成再読を確認。旧checkpointの処理deadlineだけを隔離分岐内で更新し、既知rawの受領を導入した方法で、実Auth/live Supabaseや期限切れ本番再開ではない。原入力不変、QUESTION/ANSWER追加0、保存時/再読時のモデル再取得0。不採用本文の保存は検証原本の保全であり、品質受入れではない。独立意味比較は全3UNASSESSED、公開correction_assessmentもUNASSESSED、meaning_updated=falseを維持する。

今回の製品source/test変更0、新CI/dispatch/rerun0。API3b727b3fの前回local187＋server20、保存系43383703283/Analysis43383702864両CI successを継承する。人による実本文reviewを新test数や機械比較合格へ換算しない。

### 現在の状態と次

出所分離候補は通常不採用・既定OFF、server候補も未配置。sourceの役割を正しく分けただけでは今回の自然文の反転/格崩れは解消しなかった。同じSYSTEM/hint/出所表示を加える比較を周回せず、保存済みの実失敗を既存の本人訂正読取・4B文章化・完成文逆読取の責務へ戻し、既存教材/生成結果との対応から不足を絞る。追加学習の必要性や原因を断定せず、今回の一回を次のGPU/fit/retryへ流用しない。この実比較終了時点では新たな学習/比較packetは未準備・未承認（後続§9.33で独立教材案を準備）。Premium本人frame/Analysis/ASTOR/Pieceへの訂正伝播、一般意味/自然さ・通常採用/live/本人端末・正式受入れ/全補助経路は未完。

STRUCTURE_MAP_DELTA_NONE：今回は実行/原本回収/本文review/隔離保存/状態更新だけ。既存2製品fileの研究option/責務地図は§9.31から不変。00現在地・01A・Emlis/CMEE mapの状態を同期し、01B/01C/公開DTO/route/DB/RN境界は差分なし。

<a id="emlis-correction-independent16-fit32-prepared-20261113"></a>
## 9.33 2026-11-13 — 本人訂正の独立8教師・既存保持8、32更新の研究一回を具体化（実行前記録、後続§9.34で完了）

§9.32の実3不採用から、現行sourceの本人説明到達、既存文章化、逆読取、実教材を照合した。本人説明は現在の通常author材料に届いており、単純なprovider呼出し漏れではない。AI対象指定はcontrol、本人説明は別のInterpretationCorrectionSourceとして保存される。既存answer更新の核は本物のQUESTION/ANSWER/source spanを必要とするため、訂正を架空のANSWERへ置き換えて既存処理を通す修正は行わない。読取報告の対象範囲を広げただけで実4Bの役割・格の品質回復とはしない。

回収済みMixedReplay44のprepared_teachers原本（SHA256 e1872344ce3842c0d59ed13fc82c1ca99a3a83b33514d2d91ac5a9e4d12db2f9）とAR03のrebalanced16を照合し、interpretation_corrections／target_ai_interpretation／user_explanationを直接含む教師は双方0と確認した。この2束の直接教師の欠落であり、全学習履歴やbase事前学習に同能力がないこと、追加学習が必須・有効なことの証明ではない。現serverのnaturalはAnalysis adapterを外したbaseを使う。旧AR03の不採用重みを現行学習済みnormalと呼ばず、新候補の初期値にも使わない。

### 固定した教材と比較

Karen作成の架空草案8件を、(1)役割・受身と伝聞の出所、(2)未確認推測と確認済み報告、(3)将来予定の事前認識と出来事後の初回認識、(4)明記条件と未整理の理由、の4対にした。対ごとのtier／category／emotion_detailsは同一。元評価の姉・妹・先生・休館等を教師へ移さず、配送の受け渡し／倉庫設備／断水／工作の別場面を使う。未提示の逐語引用・原因・感情・反対意図・予定の実現を補わず、全入力の復唱や参考文への文字一致を合格条件にしない。Mash承認済みの応答ラベルではない。

元44のT04/T06/T09/T12/S05A/S05B/S06A/S06Bは全messages・prefix・教師本文をbyte同一で保持。新8と交互に並べ、各2回の16教師・32更新とする。既存AR03 fitのassistant-only CE、非切断chat template、単一終端、fixed base/revision/tokenizer、fresh r8 LoRA112tensor、有限loss/gradient、保存とfresh reload全tensor照合を再利用。新optimizer方式・新作者・本番経路は追加しない。

| 比較群 | 件数 | 学習露出と取得 |
|---|---:|---|
| 別場面の新訂正評価 | 4 | 今回教師には含めない。学習前後を新規取得 |
| 既知の実訂正base | 3 | 今回教師には含めない。元HTTP要求／応答のhash一致で前結果を再利用し、後だけ新規取得 |
| 通常文の保持 | 8 | 教師と同一の既露出入力。保持・忘却の診断であり独立評価ではない。前後新規取得 |
| 既知の過去回答／撤回scope | 2 | 今回教師には含めない。前後新規取得 |

17件すべてを未見・独立評価とは呼ばない。前新規14＋後新規17＝研究生成31、旧HTTP前結果3を加えて比較記録34。元natural／Analysisの前後対照4を合わせ、新規生成は最大35。旧HTTPと新しい直接load候補にはprocess／取得方法差があり、旧3の比較を厳密同process A/Bとはしない。評価human_reference／review_axesはGPU packから除外。ID／日時を除いた実質材料でも保持8以外の教師・比較重複0を確認した。

### CPUで終えた準備と、まだ行っていないこと

API3b727b3fの実Q3 SQL/RPCとcorrect_interpretationを通し、架空の初回本文を対象に訂正8＋評価4の12要求を固定。原入力・対象版・訂正全文・時刻・source prefixを保持したまま、全12の合成受領保存／新service非生成再読、原入力不変、QUESTION/ANSWER追加0、公開UNASSESSED／meaning_updated=falseを確認した。合成原本24受領であってモデル24応答ではない。外部call・live DB・GPU・学習0。さらに凍結した受領前checkpointから、処理leaseだけを隔離分岐内で更新し、新評価4の合成raw受領後処理／再読を確認した。同手段で、実結果取得後に新4＋旧実3の訂正原本を保存できるよう具体化したが、実候補7保存は未実行。

runnerの旧HTTP再利用検査は原要求／rawの改変・欠測8種を拒否。既存loss/NLL/baseのAST、optimizer更新から保存・fresh reloadまでのsource bytesは旧ownerと一致。wrapperの変更は起動先、停止前pack検査と元提供以外のGPU processがないことの確認のみ。製品source/test変更0、新CI/dispatch/rerun0。前回API3b727b3fの187＋20成功・両CI successを継承し、今回のCPU準備件数へ足さない。

### 具体的な次の一回と境界

送信対象はpack.private.json 178,197byte、fit_correction_once.py 14,810byte、run_and_restore.py 14,331byte、files.json 282byte、計207,620byte。既存Pod f1lle4xwq3wjlnでfresh baseから16教師32更新、新規31研究生成＋元提供前後4対照を最大600秒・一回・再試行なしで行う案。研究枠330秒、学習内上限180秒、残る270秒を復元・後対照へ確保する。後対照137秒を予約するため、研究枠を使い切った場合の元server待受確認枠は最大133秒。各生成23秒×31の最悪値は研究枠を超えるので、完走保証はせず期限優先・未完不採用で復元し、追加retry/fitへ進めない。

送信／同Pod内2既存鍵のcontrol認証と全起動環境の親RAM一時保持・元args/env/cwd復元再利用／学習を含む今回分の具体承認待ち。前回31,471byte・学習なしの承認は完了消費済みで流用しない。元source5e3d、Analysis adapter、provider argv/cwd/identity、同Pod GPU占有とcached tokenizer/全16教師・17評価の8192枠を停止前に確認し、不一致や期限不足では停止・学習へ進めない。cached tokenizerによる実token数はまだ未確認。生成子へ鍵や全環境を渡さず、同Pod内の既存primitiveとcached modelだけを使い、旧source／重みを書き換えない。新候補は検証専用・通常不採用のまま、raw無修補で全17の原文対照を行う。NLL低下／tensor一致／保存成立だけで品質合格にしない。

Piece側も別途sourceを照合し、現refinedが単一の実回答ADD／round1だけで、natural profileと複数回答のactive-plan/lineage/SQL fenceは未接続と確認した。最新回答を選ぶ・連結する・架空一回答へ畳む修正はしていない。この調査をPieceの接続完了や今回の研究品質へ加算しない。

STRUCTURE_MAP_DELTA_NONE：今回の変更はprivateな教材・既存一回trainerの限定適応・隔離CPU検証・前提資料の状態更新。公開DTO/route/DB/RN、製品sourceと意味確定／独立比較／保存の責務は不変。全補助経路・自然さ・役割安定・Premium frame/Analysis/Piece伝播、通常採用/live/本人端末・正式受入れは未完。全fileのtree/hash照合と全仕様本文理解を同一視せず、全file意味読了の既存未完を解消したとは報告しない。

<a id="emlis-correction-independent16-fit32-actual-20261113"></a>
## 9.34 2026-11-13 — fresh16教師32更新・17件比較を完了、本人向けの声と意味保持が未達で通常不採用

§9.33の207,620byteをMashの「進めろ。」の明示承認後に既存Podへ一回送信。Pod側の4ファイルbyte数・SHA256が準備原本と一致し、現API3b727b3f・前提資料8bc3f1aの同headを確認した。初回はJupyterの古い表示で結果反映が止まっていたため画面接続を一回更新し、現PID83325／source5e3d／health200／GPU使用者一致を確認してから実行した。学習や提供停止の再試行ではない。

### 実行・復元と重み原本

cached tokenizer停止前検査は全16教師688〜1149token、17比較prompt最大1380tokenで、出力2048を足して8192枠内。固定source/adapter・元argv/cwd・GPU占有・依存版／既存primitiveを照合後、元natural/Analysis対照2を取得して提供を一時停止。fresh base/r8の16教師を固定順に各2回、正確に32更新。新規前14＋後17＝研究生成31、再利用した元HTTP前3と合わせ比較記録34、全stop。対照は前後4HTTP、全200/stop/attempt1。新規モデル生成は計35、再試行／追加更新0。旧HTTP前3には過去に観測していないtoken IDを作らず、固定tokenizerによる再計算と明記している。旧HTTPと新直接loadの3比較は厳密同process A/Bではない。

学習・checkpointは44.8580334559083秒、全112tensorが変化し、全値有限・F32・3,833,856parameter。保存してからfresh baseへ再loadし全tensor一致。重みSHA256 10b563154c7b05faf7f84264312328611724cf31ff834d9924337761c5513788、config 27e58c46d301a8c647737e683cb636365f217a924b04b1e4dff4d97b66418ebb。全16教師のNLLは低下（平均1.4815368168→1.3254003078）したが、生成品質合格とはしない。実token列からassistant-onlyの連続tail／切断なしを確認し、保持8件では学習時のmasked promptと実生成promptの全token IDも一致した。単純な教材／生成prefix違いを原因とする証拠はない。

元提供を元args/env/cwdで一回復元しPID84398。復元・後対照まで237.1964910151437秒、ZIP closeまで237.8850578442216秒で600秒内。両controlの各前後は生HTTP全bytes一致、独立health200／pidfile・GPU PID一致。元source／Analysis adapter不変、資格情報と全環境は同Pod内だけ、生成子へ鍵を渡さず保存・回収0。通常のnaturalはbaseのまま、new候補を提供へ採用していない。

### 全17本文の原文対照

新評価4、既知実3、訓練露出済保持8、既知履歴2の区別を維持した。15本文が変わり2本文が同一だが、変更数を改善数へ換算しない。逐語教師一致や原入力の全復唱を求めず、役割・時点・未知・本人向けの声をbefore/afterと原材料から読んだ。

| 対象 | 実本文から分かったこと | 判断 |
|---|---|---|
| 既知focus_agent | 姉→先生を保持し短縮。旧baseも向きは正しかった | 新たな役割修復には数えない |
| 既知focus_recipient | 妹が先生を呼び止められた、という格・態崩れが残り、私はその場にいなかった、と本人の一人称を返す | 未解消・不採用理由 |
| 新役割評価 | 舞台監督→音響スタッフと出演者の伝聞は保持するが、私は現場にいなかったようです、と本人発話を無標識で貼り返す | 役割の保持と宛先の声を分ける。通常応答未達 |
| 既知knowledge_days | 昨日朝の認識を保ち、今日午後の利用不可も明示 | 限定的な内容保持。旧baseも認識時点は正しかった |
| 新推測評価 | 原因未確認は維持するが、推測しました／確かめていませんでした、と本人行動の叙述が残る | 原因確定の修復や本人向け自然応答の完成とはしない |
| 新予定／条件評価 | 花火延期と荷物の経路条件の2本文は前後byte同一 | 今回の改善0。延期されたという語だけで花火の実開催済みとは判定しない |
| 保持T06 | 元からあった嫌なことがあったという補完に加え、重さが今を支配している、と未提示の状態を付加 | 明確な追加・退行。不採用理由 |
| 保持T09 | 選択された怒りweakを昨日の怒りへ割り当てる | 前後に共通する未達であり、新規退行とは呼ばない |
| 保持T04/S06A/S06B・既知撤回履歴 | 後本文がcurrent.memoの全文copyに一致（計4件）。S06Aでは余計な原因探索・助言は消えた | 縮小と本人向け返事を区別し、copyだけで品質回復にしない |
| その他保持・未確定履歴 | 保持T12の少しへの程度変更は前から存在。S05では主体の保持と新しい文脈づけを別に確認。未確定履歴の不要な探索説明は短縮 | 全17の意味合格・一般品質成立へ拡張しない |

今回の新候補は通常不採用。別sourceの訂正を直接教師へ含めたこと、NLL低下、112tensor変化／再load一致だけでは、誤った格と本人一人称の貼返し、根拠のない状態付加を解消できなかった。原文やrawを修補したり、比較readerを緩めて合格へ換えたりしない。通常OFF、既存server/source/adapterを保持する。

### 原本回収・同source保存と未成立

Podのresults.zip 14,320,864byteを原bytesで回収し、Pod側SHA256 e77d87a8232d0d4a6c9689f02c5f3918f5aa118c8a84da1b9841a04277e1a03cと一致。全34生成／32step／16mask／初期化／保存再load／control4生応答と、候補重み・設定を含む。全memberの破損なしを確認した。wrapperのZIP close後秒数はrestoration.jsonへ再dumpされないため、終了stdout stateを別のpostcheck_result.jsonへ保存して区別した。JSON単体のDownload通知は得られず、同じファイルの原文表示から回収した。provider log／全環境／鍵は回収していない。

実後rawの新訂正4＋旧実3を、凍結済みの同source/ID/時刻/prefix/通常messagesへ束縛し、既存受領event後処理から7件の隔離PGlite保存・新service非生成再読を確認した。更新したのは隔離分岐の期限切れ処理leaseだけで、原入力・本人訂正・対象版は不変。QUESTION/ANSWER追加0、保存・再読時の新モデル呼出し0。7件の独立比較は全UNASSESSED、公開correction_assessmentもUNASSESSED、meaning_updated=falseを維持。不採用原本の保存であり、意味合格・live Supabase/Auth・本番期限切れ再開・本人端末ではない。

今回source/test変更0、追加CI dispatch/rerun0。前回API3b727b3fのlocal187＋server20成功／両CI successは継承であり、今回のGPU品質や保存7件へ加算しない。私的CPU保存helperは回収先のactualディレクトリを読むだけに適応し、承認済みPod送信4ファイルは変更していない。

### 現在の再開位置

この207,620byte・16/32・最大35新規生成の一回は完了し承認消費済み。新10b563重み／実本文／失敗は非公開で永続保全するが通常不採用。次は、保持教材と同じprompt tokenでも本人向けの声にならず、未知を未提示状態へ強めた実本文を、既存natural教材／生成／完成文の独立比較の責務へ戻して不足を絞る。今回の結果だけから教師増量・同じprompt追記・追加fit・再生成を開始しない。学習不足やbase限界を原因と断定せず、実モデル取得と一般品質、source保存、machine比較を分ける。

STRUCTURE_MAP_DELTA_NONE：今回の実行／原本回収／人の全文review／隔離保存／資料状態更新だけ。製品source/公開型/route/DB/RN、作者・意味確定・保存の責務は不変。Premium frame/Analysis/Piece訂正利用、長文・二欄・本人補足の一般品質、通常統合/live/同版画像/本人端末、全補助経路は未完。全tree/hash確認と全仕様意味読了も同一視しない。


<a id="analysis-semantic-alignment17-prepared-20261116"></a>
## 9.91 11/16 — 既存作者の教材を現行出力へ整合し、34更新・前後比較と条件付き全12を準備（未実行）

第11回§5・§9.54の全体主枠を継承する。§9.90のA4は意味・完結未達でB4条件不成立、A3/A4を消費済みとして維持する。baseへ切り替えるだけで解決したとは認定しない。実意味→同raw保存再読→通常DB/API反映が現在の未完単位であり、準備完了を該当単位の完了へ換算しない。

既存9教師の原文・全target・旧24/56/40更新runnerを確認した。assistant末尾のEOSは学習対象、prompt maskとloss/gradient整合・120u保存112tensor再読は成立しており、「EOS未学習」「学習無効」「A3誤文を教えた」とは言えない。旧教師のJSON順序（初回edges/nodes/overview/schema_version、後続schema_version/overview/nodes/edges）と現行schema_version/nodes/edges/overviewは不一致、T01の6引用は現上限4を超える。9件は同一記録日中心で、T09の同一欄内過去/現在はあるが、同一対象の後日確認で未知を更新する別記録例はない。これらは整合対象で、A3/A4誤りの単独原因とは未確定。

既存作者・schema/core b489・native7ae06f31・parser661fdf31・schema29fe72a2を変えず、既存120uから別候補を学習する新一回を具体化した。教材・コード・検証・限界は[trial README](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_alignment17_prepared_20261116/README.md)。

| 要素 | 確定した準備内容 |
|---|---|
| 教材 | 旧9の現行順序/引用上限/本人の出来事の語り方を整合した9行＋架空新2題材（録音複製・録画講座）の通常/2LEAF/MERGE各4行＝17表示形・独立11エピソード。原9は無変更、Mash作成教材・正式受入れではない |
| 学習 | 120uからfresh AdamW、17行各2回/最大34更新、assistant全体+EOS、最大5076token<8192。112tensor保存照合。旧optimizer/RNGの厳密再開ではない |
| A5 | 未学習U01修理/U02取消の前2＋候補後5（A3読書会/照明2・U01/U02同prompt2・既存T01保持1）＝最大7応答。A3対象・U01/U02は教師から除外。T01は未見や同prompt前後の得点へ数えない |
| 期限 | A5一回、更新600秒・生成累積900秒・作業1620秒・復元込み1800秒。学習は各更新前後/完了前+timerで検査。到達時は未完として停止・復元し、34更新/7完遂を保証しない |
| B5 | A5候補後5件の全原文/raw/図/本文/unknownを独立照合し適切だった場合のみ、新12LEAF+MERGE最大13応答、一回・復元込み1020秒。A5完了/新adapter bytes/元提供復元も検査、技術成立を意味PASSにしない |
| 送付 | 同Pod f1lle4xwq3wjlnへ新4file420016byte。plan356925、driver19283、A5launcher9520、B5launcher34288。全SHAはtrial next_action_scope.json。新依存/モデル取得・再試行なし、既存認証情報/起動環境は同Pod内認証/元状態復元だけ |
| 実績 | 全17の現行schema/完全一致引用/受口/EOS列、A4実測2入力とのtoken数校正、19source再導出、3Python compile、B5 native関数維持/main13回制限と両argv形式変換、固定hashと独立準備reviewを非生成で確認。送付0/学習0/model0/SQL0/通常変更0 |

ローカルは同じ固定tokenizer資材とJinjaの列検証で、実HF wrapper/実LMFE/GPU生成品質の合格ではない。Pod内CPU preflightが全19prompt/17教師のHF token列hash・mask/EOSを提供停止前に再照合する。新2教師はメモ最大281字、A3長段落の照明は未学習の診断として残す。形式/引用/語り方/時点教材を同時に変えるため、成功しても個々の因果は分離しない。

**現時点は新しい学習/GPU実行の明示承認待ち。** A4の学習なし一回承認、未実行B3/B4を新34更新/A5/B5へ転用しない。A5後5件の独立全文意味照合が不適切、未完、期限/例外ならB5は起動しない。B5実行後も全13rawを独立原文照合し、適切な同じ最終rawの一回SQL保存→別process非生成再読→通常nativeのmodel identity・map/IF選択境界・自然/Piece profile・API/worker整合までが残件。旧source7hash/全12源泉/取得前plan75daa8/SQLcheckpoint801ba068/guard a000deb9/as_ofは不変で、旧raw再束縛なし。

通常API/worker24bc228d双方Live・DB最新20261115011424（38migration）はfresh read-only確認、本人記録読取/設定変更0。worker900・selector/研究重み未採用、build/TestFlight/本人実機保留を維持する。三中核の本人更新・意味活用・累積/IF/Saved・通常反映の四仕事、全体の未完範囲、補助全体未完と正式受入れ未認定は変更しない。


<a id="analysis-alignment17-preflight-stop-recovery-20261116"></a>
## 9.92 11/16 — A5はCPU照合の依存参照漏れで停止、全段階の参照を修復して別一回を準備（未実行）

Mashの明示承認後、新4file420016byteを同Podへ送付し全SHA一致、元提供health200・A5/B5root未作成を確認してA5を一回起動した。既存作者の原入力を再導出する`validate_pack→prepared_row→prepare_semantic_map→analysis_cumulative_service:22`で`fastapi.HTTPException`のimportが失敗した。A5 launcherの`training_env`を継承したCPU環境には、旧A3/B5が参照していた既存client-runtime-depsへの接続がなかった。私の起動処理の参照漏れであり、教材・EOS・モデル能力の失敗ではない。前回の独立source確認でもこの依存を見落としていた。

launcher83行のpreflight return code assertで終了し、execution.json作成・元提供停止・baseline/train/afterの前で停止した。**生成/学習/提供停止/再試行0、A5一回は消費済み、B5は前提不成立で未実行・転用不可。** remote全19prompt/17fullのHF列/EOS/mask検証は未完で、§9.91のlocal準備成功とは分ける。元PID131491/start235250260/health200と120u weights ecbdd0d1を保持、launcher132251終了、execution/baseline/fit/afterとB5root不在を確認。原ZIP3entry1657byte/SHA39792077f007efff264df8fc6d0a919ff6548b042d3236f3a6104ea69ce47b2c、元preflight log f5e22ada…5bfff/launch log/receiptを回収し、CRC・全byte・metadata/停止位置を独立照合した。原本は既存引継ぎに無修補保存、[公開の実績とhash](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_alignment17_preflight_stopped_20261116/observed_result.json)。未記録の実行全体秒数は補わない。

不足したAPI依存は同Podの`/workspace/semantic-history-20261115-once/client-runtime-deps`に既存配置済みで、新install不要。408file/tree07c2ac87f67cdcc531966906085813fe125b8efbda81d2ab7907d0c200de1b41、FastAPI0.116.1/Pydantic2.11.7/httpx0.28.1等、Torch/transformers/peft/accelerate/safetensors/tritonのpackage無しをread-only確認した。

**新しい別一回の準備：2launcher・46542byte、未送付/未実行・新しい明示承認待ち。** [修復準備README/固定scope](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_alignment17_recovery_prepared_20261116/README.md)。A5の既存4file/failed root/原本を変更せず、教材plan356925byte SHA58a1c90d・driver19283byte SHAe2a79409は同Podの送付済み原本を照合して再利用、再送なし。新A6/B6は専用fresh rootに分離する。R10.3の一ファイル機械修正例外として二ファイルを扱わず、両launcherの正確な新範囲を承認対象へ含める。

| 修復・範囲 | 確定した新準備 |
|---|---|
| A6 launcher | semantic_alignment17_recovery_once.py 12236byte SHA585343e63ac7694156a97bd28558d319c6dd2893d394dcac128ccc208214a78f。既存client依存をpreflight/baseline/train/afterの共通参照へ接続、推論DEPSはbaseline/afterだけ、学習へ追加しない |
| CPU確認 | 提供停止前に元環境/client参照環境のML6module実import元/versionを各30秒以内で照合→既存driver full preflight。追加CPU確認も全体1620/1800秒枠内。新環境の実確認は未実行 |
| A6 | 同17教材/最大34更新、未学習前2＋候補後5の最大7応答、一回。更新600秒/生成累積900秒/作業1620秒/復元込み1800秒。教材/driver/語り方/比較対象/元重み・学習ロジックは不変 |
| B6 launcher | full12_sql_alignment17_recovery_once.py 34306byte SHAf36cc0eb4f1cbd8f6ab73c7f18abcdc6d4bfb16a39a43f0cf8dd52472ab7f8b4。旧B5からfresh A6/B6root locatorだけ変更、全関数/埋込driver/制約/復元は不変 |
| B6条件 | 候補後5件の全原文/raw/図/本文/unknownの独立照合が適切な場合だけ、新12LEAF+MERGE最大13応答、一回・復元込み1020秒。新規学習/追加モデル取得/再試行なし |

新2Python compile・B6全関数/埋込driver維持・fresh root整合・既存plan/driverとclient参照hash、全2file46542byte/両SHAと独立source reviewを確認。これをremote preflight成功や実品質改善にしない。新A6/B6送付/起動/学習/生成0。既存認証情報と起動環境は同Pod内の認証/元状態復元だけに使い、外部へ出さない。

B6全13rawも独立照合後、適切な同じ最終rawを一回SQL保存→別process非生成再読→通常native/model identity/map・IF境界/自然・Piece profile/API・worker整合までが未完。source7hash/全12源泉/取得前plan75daa8/SQLcheckpoint801ba068/guard a000deb9/as_ofを変えず旧raw再束縛なし。通常API/worker24bc228d双方Live・DB38migration/最新20261115011424をfresh read-only確認、本人記録読取/設定変更0。worker900・selector/研究重み未採用、build/TestFlight/本人実機保留、四仕事/第11回§5、本単位/補助全体/正式受入れ未完を維持する。


<a id="analysis-alignment17-recovery-actual-20261116"></a>
## 9.93 11/16 — A6の34更新・7応答・復元を完了、状態逆転と場所移動が残り通常不採用

Mashの明示承認後、同Podへ新2file46542byteを送付し、旧plan/driverを含む全4SHAを照合。教材/driverの再送0、A6を一回起動した。§9.92の全段階client依存参照の修復は働き、元/client環境のML6module import元/versionは完全一致、既存driverによる19prompt/17fullのHF列/EOS/mask preflightを通過した。学習は17表示形（旧9保持＋新2題材の各4形）を各2回、最大34更新を完了。追加install/model取得/retryなし。

| 実測 | 結果と範囲 |
|---|---|
| 学習 | 34更新451.467500949秒<600、学習process498.419228661秒。120uからfresh optimizer、exact optimizer/RNG resumeではない。保存112tensorのRAM一致、新規読込/非学習状態を確認 |
| 学習前 | 未学習U01/U02の2応答、両stop/CMEE GENERATED、生成合計164.140483225秒 |
| 候補後 | A3対象2＋U01/U02同prompt2＋既存T01保持1の5応答、全stop/GENERATED、生成合計417.387533536秒。DIRECT_CURRENT_NATIVEであり7HTTP200とは記録しない |
| 上限 | 合計7応答・生成581.528016761秒<900、最長196.116305772秒<210。復元込み1177.244417483秒<1800、3phase exit0 |
| 復元 | 元args/env/cwd/元120uへ復元。PID133674/start235925816/health200、初期weights ecbdd0d1不変。B6root無し |
| 新候補 | weights2f33f9bedce06dffa07dad4301650a0ec47c5fc50ffe56994569628ee2b2d47b、config09ac18caef48bd66914f80f521d3df6034bac4657862d7aaafeab56e30ac8750。15351792byte/112F32/3833856parameter、全finiteを独立CPU数値確認。通常不採用、次の初期値へ自動採用しない |

候補後の全原文・raw・図/本文・unknownsをrootと独立担当で全文照合した。**B6条件不成立の直接理由は、読書会の既知状態逆転/内部矛盾と、照明の試用場所の移動。** 完結・引用・record被覆成功を意味品質へ昇格しない。

| 対象・候補後秒数 | 原文と生成物の最終照合 |
|---|---|
| 読書会44.194568521 | 後日案内を修正送信済みなのにoverview/edgeは未送信。同じraw n2説明は送信済みで内部矛盾。初日下書きのn1未送信は時点を限れば支持。椅子問い合わせのunknown/未開催は正しく、予約/一人返信の省略自体を別拒否理由にしない |
| 照明61.650510473 | 店で持参ノートを使った試用をn2.summaryが自分の机での試用へ移す。今回はA4の同項目9回反復・未完が起こらず完結、購入後の30分描画はoverviewに保持。棚の足は原文に存在し、語の創作とは数えない |
| U01修理52.102165914 | 完了連絡/明日の受取予定/未受取/未動作確認/弟の別端末と相談不明を保持。前の受取未定/店へ電話したという混同は消失。修理完了未確認の表現は現物未確認とも読め、連絡未着へ戻ったとは断定しない |
| U02取消63.323982856 | 候補→海辺一枚応募/受領→取消/再応募意図なし/友人へ取消未伝達を保持、前の友人の再応募予定という主体飛躍は消失。初日の未決定を後で決める選択へ強め、unknownは述語がなく曖昧 |
| T01保持196.116305772 | 12項目5線/10record被覆で主な事実は保持。ただし落ち着いた経験へ望みを付加、未特定の受け取り対象を未発言相談の内容へ固定。意味重複/冗長さあり。学習済みsource・前比較なしで、未見や一般化成功率へ数えない |

[公開の実行/独立review](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_alignment17_recovery_actual_20261116/independent_review.json)。原本は21memberの元ZIP14283397byte/SHA dd3406a8abd9c132e5fc05a407b7a5e09462100e9e2eacc0e92d11f4599ea171と展開物/新重みを回収し、全CRC/byte/receipt17file SHAを独立照合。別UI読取after/baseline/fitも全byte一致。after SHA98f0021d6c40b2d33829f1d2b77d70e77d5dac91a11acc5227fac9a8656bdcf2、baseline SHA7d628676bc75dfc89c9d6484114b42eacb39cd776fd1c096b84b85d4576b834b。無修補原本/重み/復元画面は既存引継ぎへ保持。実稼働native ad3d301d…370beの42367byte原本も回収し、583a診断参照原本と混同しない。

**A6の有限一回は終了・消費済み、B6は送付済みでも起動/新12LEAF/MERGE0・条件不成立/転用不可。** SQL保存/同raw実再読/通常反映0、新重み不採用。format/引用/語り方/時点教材が同時に変わった一回で、個々の原因や一般品質を断定しない。通常接続のmap専用model選択案はscratchだけでAPI tracked source/Pod/設定へ適用0。未評価のIFへ新重みを広げず、既存自然/PieceのbaseとIF120uを維持する。

第11回§5/四仕事を維持し、次の未完は既存作者が複数記録の既知状態と場所/対象を一貫した図本文にすること。新しいreader/controller/注意文・別Gateの追加を意味改善の代用にせず、原本/教材/既存作者の責務から再開する。新GPU/学習案は未準備/未実施で、A6/B6を再利用しない。適切な全12結果→同raw一回SQL保存→別process非生成再読→通常native/model identity/map・IF境界/自然・Piece profile/API/worker整合までは未完。source7hash/全12源泉/取得前plan75daa8/SQLcheckpoint801ba068/guard a000deb9/as_ofを維持する。通常API/worker24bc228d双方Live・DB38migration/最新20261115011424をfresh read-only確認、設定/本人記録読取0。worker900・selector/研究重み未採用、build/TestFlight/本人実機保留、本単位/補助全体/正式受入れ未完。


<a id="analysis-bounded-thinking-prepared-20261116"></a>
## 9.94 11/16 — 既存作者の意味不整合を照合し、追加学習なしの内部整理候補を準備（未送付・未実行）

A6の原文・全5raw・図／本文、7ae／通常ad3のsourceと現作者指示を独立分担で照合した。読書会はnode2説明に送信済みがあるのにedge／overviewが未送信、照明はtitleが店なのにsummaryが自分の机であり、raw自体の不整合。全5のraw主要欄→projectionと本文再導出は同文で、正しい引用候補も残る。原文欠落・保存反転・overview生成順不足、eval／grad・attention mask・明示KV持越しの実装不具合を原因と認定できない。source_dutiesは当該2件でclaims／relations0、profile接続だけを修復にしない。既存instructionは出来事ごとの主体・場所・状態／後続確認／overview同状態を既に要求し、追加注意文を選ばない。

既存同4B作者の内部modeを比較する仮説へ絞った。新nativeは7aeのload_generator／mainだけを変え、他関数はbyte不変。自然な整理終端の後から同LMFEへ進み、思考2048／最終JSON4096を別計数、context32768。終端なし・自然EOS・上限は未生成で、強制終了記号・再生成・raw意味修補は0。default0・自然／Piece／IFの既存動作を保持する隔離opt-inで、通常採用ではない。

旧120u thinkingは最終文なし210.044秒、強制512終了の3件は形式1/3で不採用。今回はA6候補2f33／09acと現decoderの新組合せで、効果は未実証。原文／messages／重みは同じだが、A7各応答300秒（旧210）と思考枠が加わるので全条件同一・速度比較とは呼ばない。

[確定送付物と全SHA／手順](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_thinking_prepared_20261116/README.md)。新4file129859byte、A7最大5応答・復元込み1800秒を1回。後5件の全原文／raw／図本文の独立意味照合が適切な時だけ、B7の新12LEAF＋MERGE最大13応答・復元込み1020秒を1回。B7の既存840 pipeline／210 native期限は維持し、完走保証はしない。送付済み教材・学習code・重みの再送、学習・retry・新依存は0。新しい明示承認前の送付／起動0。A6の承認は消費済み、B6を転用しない。既存認証情報／環境は同Pod内だけで復元へ使う。

固定tokenizer receipt／pin817f LMFE全sourceを照合したCPU合成token15成功と、実source5件再導出・A6 messages一致、B7継続binding／argv／wire互換と実効容量を確認。HF forward／model.generate／重みload／GPU／意味品質は未検証。B7はwireFalse／4096を保持しprivate native実効True／6144と計測を別記録する。通常採用前に実mode／wire／model alias・Map専用選択とIF120u／自然Piece baseを整合する必要が残る。

source7hash・取得前plan75daa8／SQLcheckpoint801ba068／inputbdb872a5／guard a000deb9／as_ofと同raw finalizerは不変。適切な全12結果→同raw一回SQL保存→別process非生成再読→通常整合／API-worker反映まで同単位で継続する。通常の24bc228d／DB38・20261115011424／worker900は前回確認記録、今回live再照会／変更0。build／TestFlight／本人実機保留、本単位／補助全体／正式受入れ未完。STRUCTURE_MAP_DELTA_NONE（隔離既存decoder候補のみ）、商品品質加点0。


<a id="analysis-bounded-thinking-actual-20261116"></a>
## 9.95 11/16 — 承認済みA7を一回実行、自然な整理終端へ到達せず最初の1件で停止・元提供へ復元

Mashは§9.94の新4file129859byte、A7無学習・最大5応答／復元30分一回、全5応答の独立全文意味照合が適切な場合だけB7新12LEAF＋MERGE最大13／復元17分一回を明示承認した。元PID133674/start235925816/health200、新2root不存在を確認し、同Podへ4fileだけを送付・全SHA一致。旧教材・学習code・重みは再送せず、一回のA7をPID134472で起動した。

実HF tokenizer preflightは5件の元／thinking prefixとcontext余裕、同messages／基準raw SHAを照合して成功。旧17教材や追加fitは実行しない。nativeはA6候補2f33／09acを112tensor一致・非学習でloadする既存処理を使い、最初のbookだけ実model.generateへ入った。105.161514679秒でsemantic_thinking_budget_exceeded。生成suffixに自然close IDがなく2048tokenへ達した枝で、JSON相へ移行していない。強制close・別generate・再試行0。after process127.421170031秒／exit1、after state INCOMPLETE_NOT_ADOPTED、raw／図／本文／採用artifactは0。残り4件は呼ばれなかった。

親はDIAGNOSTIC_INCOMPLETE_NOT_ADOPTEDを保存し、元args／全env／cwd／120uへ160.950753844秒で復元。PID134586/start236359682、health200と初期weights ecbdd0d1／config4389a598・元native ad3d301d、候補weights/config不変を独立確認した。環境・既存認証情報は同Pod内だけで保持・復元。回収する選択出力内に既知2認証値が含まれないことを確認し、この確認を任意の全設定の非漏出証明へ広げない。private thinking textは保存・出力していない。

元ZIP10450byte／SHA95d133a9826bc54e7a66214e0c6a98287c3f5a3382a29ce8b9a9a8b1c2b670aaの9memberを回収し、全CRC／展開byte・receipt6file SHA一致。A7のbook messages／request_ref／hashと候補adapterはA6後bookと完全一致。原execution／preflight／after／logs／launch／復元画面を既存private引継ぎへ保持する。公開body-free実行・独立確認は既存trialのsemantic_thinking_actual_20261116へ置く。

**A7一回は停止して消費済み。B7は5件完結／全文意味条件を満たさず未起動、root未作成・新12LEAF／MERGE0。** 未実行4件やB7枠を他試行へ転用しない。学習／retry／新weights／SQL保存／同raw実再読／通常反映0。最終JSONがないため意味改善・悪化やA6の意味誤り原因は評価できず、内部整理modeは通常不採用。CPU15成功は境界処理の確認で、実完結・意味品質へ換算しない。

本単位の未完は、既存作者による複数記録の既知状態・場所／対象の一貫した図本文と、適切な全12→同raw一回SQL保存→別process非生成再読→通常mode／wire／model・Map／IF境界／API-worker整合。今回の事実だけで思考枠引上げ・強制close・追加学習の新試行を自動選定しない。A6全原文/rawと既存資産／作者の責務へ戻り、新GPU／学習scopeは未準備・未実施。source7hash／SQL plan75daa8／checkpoint801ba068／inputbdb872a5／guard／as_ofと原本は不変。通常API／worker24bc228d・DB38/20261115011424・worker900は前回確認記録（今回Render/Supabase再照会0）、Pod元提供の今回復元と分ける。build／TestFlight／本人実機保留、本単位／補助全体／正式受入れ未完。STRUCTURE_MAP_DELTA_NONE、商品品質加点0。

<a id="analysis-event-plan-prepared-20261116"></a>
## 9.96 11/16 — 事実文の参照を共有する既存作者内の隔離候補（実4B未実行・未採用）

§9.93のA6は原文全文と正しい引用候補が届いていても、読書会のnodeでは送信済み、edge／overviewでは未送信と別々に記述し、照明では店頭試用を自宅へ移す誤りが残った。§9.95のA7は自然な整理の2048上限で最終JSONなし。A7を再起動せず、上限増量・強制close・追加学習・注意文の増殖を新しい修復根拠にしない。

新候補は既存作者の私的応答契約を `semantic_map.event_plan.v1`／`cocolon.analysis.semantic_map.event_plan.model.v1` として明示分離する。eventsが根拠付きの事実文と未知範囲を一度だけ生成し、readingsが参照した出来事からの読みを記す。nodes／edges／overviewは同じevents／readingsを参照し、既存compilerがその同じ文を既存の表示項目へ展開する。受領した誤文の修補、記録時刻だけによる最新優先、旧有限readerへの全履歴差替えではない。見出し・関係名・読み自体の意味誤りはなお起こり得るため、この構造だけで意味整合・一般日本語品質を保証しない。

API候補は[実装c258cf0e](https://github.com/MassyuRed/mashos-api/commit/c258cf0e5a6ba59429553638c4765fe7c17b561a)。変更ownerは既存 `semantic_admission.py`、`intent_compiler.py`、`serve_emlis_natural_reply.py`、`analysis_model_source.py`、`analysis_if_model_source.py` と既存Analysis CI／4試験file。新しい商品service・reader・controller・DB型・RN rendererは加えない。原raw SHA／messages／profileを束縛し、private evidenceへ元planを残す。全eventの根拠・参照scope・提示原文範囲・訂正全文・既存公開容量を検査し、削除や切詰めで通さない。decoderがsyntax上生成できても、重複／scope違反／容量超過等はcompilerで拒否され得る。旧compiler本文は改名前後でbyte同一、従来profileは従来packetのまま通す。

通常接続の候補境界も同じsourceに置いた。完全一致model alias `cocolon-qwen3.5-4b-analysis-event-plan-v1` と同private schemaをAnalysis認証で指定した時だけ、別名・別SHAでloadした候補adapterを選ぶ。IFは共有設定が同aliasでも元 `cocolon-qwen3.5-4b-analysis-semantic-120u` へ送る。nativeは元120uをdefaultに保持し、候補使用後はdefault／eval／勾配OFFへ戻す。復元失敗時は提供を止める。自然Emlis／Pieceの既存base経路、設定4項目のidentity、未指定・未知aliasの従来動作は保持する。これらの配置・alias有効化は0。

局所検証は449件（新参照・source／compiler／SQL・history／model alias／native HTTP・adapter復元／IFを含む）と、重複しない既存4B packet26件、計475件成功。候補commitの既存Analysis CI 43795890260／Piece CI 43795890312もattempt1でsuccess。初回packet4件はasync plugin指定漏れで実行不能だったため、既存runtimeのpluginを明示した再実行26件の成功と区別する。既存Pydantic警告1を保持し、実モデルの意味成功・正式受入れへ換算しない。独立したsource差分reviewでは具体的な誤採用／旧経路の破壊は検出されず、自由な見出し・読みとdecoder完結性は実生成未検証と確認した。

同じ架空12記録のinput `bdb872a5`、guard `a000deb9`、as_ofと取得前SQL checkpoint `801ba068`・旧plan `75daa8` は保持する。新profileから取得前parent／messages／計画を再導出し、旧request_ref／receiptへ新rawを再束縛しない。既存plannerは新しい短い指示から6LEAF＋1MERGEを導出し、全12記録を含む。旧12LEAFへ人為的に固定しない。保存用の既存finalizerも新profile／source／planの束縛へ限定適合し、合成7応答の一回commit・月参照1・同版の別process非生成再読を事前確認した。原checkpoint／原source／受領bytesは保持する。この合成保存を実4Bの保存完了と呼ばない。

実行物の独立照合では、一時serverへの通常通信混入、B8のJSON再直列化によるbyte不一致、B8意味照合前の保存という3点を送付前に検出し、Pod内loopback専用・native9／11call上限・所有listener確認、元request.content保持、SQL開始前の実結果／7raw／図／本文／source／as_of／planに束縛した二者照合へ修復した。runner14件（別途17subtest）とfinalizer20件を実運用と同じfresh processで確認。両試験を同一processへまとめた試行は既存module cacheのpath確認1件で失敗し、source切替を許容する緩和はせず別processで再確認した。assertを無効化する起動は処理前に拒否する。これらも実4B品質の証明ではない。

新しい具体的な送付物と一回の実行範囲は、同trialの `semantic_event_plan_prepared_20261116/execution_scope.json` を正本とする。初期9file3,127,144byte／scope SHA e84f40b9c3d70c551344ccbae900116ca520e2f6e12344865bd1614be901a76e。後続A8照合記録は適切時だけ4,096byte以内のstate・担当role・実結果SHA・5raw SHAを追加送付する。既存Pod `f1lle4xwq3wjln` のA8は新5map＋前後Emlis／IF4対照の最大9応答、停止復元込み1800秒。対照は候補runtime内の前後一致を確認し、元提供の復元はargv／env／cwd／source・重みhashとhealthで確認する。この範囲を元nativeとの全応答比較へ拡張しない。一回の全5について原文／raw／図／本文をrootと独立担当が適切と確認できた場合だけ、B8は新6LEAF＋MERGEの7mapと同4対照の最大11応答、既存内側840秒／停止復元込み1020秒で一回。後から作るA8判定は結果hashと5raw hashに束縛する。学習・retry・thinking・新依存・旧A7／B7枠転用は0。既存鍵と元argv／env／cwdは同Pod内の認証・復元だけに使い、送付物／公開結果へ出さない。新しい具体scopeの承認前には送付・起動しない。

適切な全12の実結果が得られて初めて、同rawの一回SQL保存・別process非生成再読を行い、private profile／wire／model／MapとIFの境界を確認して通常native・API／workerの同版へつなぐ。通常配置は互換nativeとAPI／workerを先に用意し、候補aliasを後から有効化する順序。元worker900は840秒の外側の取得・保存等を含む既存leaseとの整合が残り、既存1800への変更案を継承する。現稼働は今回もAPI／worker24bc228dがLive、DB最新20261115011424、healthz／app bootstrap200。source候補の反映と通常稼働を混同しない。新GPU／SQL実保存／通常反映／build／TestFlight／本人実機0、本単位・補助全体・正式受入れ未完。

STRUCTURE_MAP_DELTA_PRESENT：既存Analysis作者内部にprivate事実参照契約と展開を追加し、既存model source／nativeの明示alias・adapter選択を分離。公開v3、source／rights／cohort／guard、最終一回保存、月次当時性、唯一realizer、RNの責務は不変。


<a id="analysis-event-plan-a8-actual-20261116"></a>
## 9.97 11/16 — A8を一回実行、意味と参照範囲の不成立でB8へ進まず元提供へ復元

Mashの新しい明示承認後、§9.96の確定9file・3,127,144byteを既存Pod f1lle4xwq3wjlnの専用folderへ送付し、scope SHA e84f40b9c3d70c551344ccbae900116ca520e2f6e12344865bd1614be901a76eと全payloadのbyte数／SHAを照合してA8を一回起動した。元PID134586／start236359682・healthz200、A8／B8の新root不存在を確認。既存原文・二欄・guard・凍結時点・A6重みを変えず、新profileの全5messages／request refsと実tokenizer preflightを束縛した。API候補c258cf0e／native3555e17a／driverfbe0109aと送付ZIP246sourceの同一性も独立確認した。

| 対象 | 実結果 | 原文・raw・表示の独立照合 |
|---|---|---|
| Emlis／IF前対照 | 各HTTP200／stop、11.477615秒／81.343091秒 | 候補runtime内の前対照だけ。後対照は未実行で、前後全文一致とは認定しない |
| 読書会 | HTTP200／stop、48.465545秒、CMEE GENERATED・図／本文あり | 後日案内送信、一人の了解、全員既読不明、会場返信参照・一階確認は保持。一方、椅子の問い合わせを共同担当者が送ったかという不明を、共同担当者へ送られたかへ変更。raw e2.unknownsの送信者／宛先逆転が同じまま図・本文に出る。意味不適合 |
| 照明 | HTTP200／stop、201.367194秒。その後analysis_semantic_event_plan_invalid、図／本文なし | n1はe1／e2だけを選ぶが、r1はe1／e2／e3を必要とする。未変更raw／compilerで最初の参照範囲拒否をCPU再現。4node・4edgeに参照範囲不整合がある。これとは別にraw e5／r2は、店員の評価を保証にしなかった本人の判断を、保証になるか不明へ変える。n4は説明できる形で買えた満足を、そうしたいという希望へ変える。完成図の意味合否とは扱わない |
| 修理・応募・T01、後対照 | 未実行 | 照明の参照拒否で同一A8を停止。未取得3件を合格／失敗へ数えず、最大9の残枠を再試行へ使わない |

lightingでも購入・30分使用・長期の使用感が不明という保持点はある。前回の店頭試用の自宅への移動が今回も起きたとは断定しない。読書会も前回と同じ後日送信状態逆転と一括しない。2件とも最終JSONは完結しており、A7の思考上限・最終JSON未生成とは異なる。参照文を共有する仕組みは、元の事実文・未知・見出し自体の意味正当性を保証しない。誤りを受領後の書換えや検査の緩和で通していない。

実呼出しは前対照2＋map2の計4、map1だけ図／本文まで成立。driverは343.050576秒でINCOMPLETE_NOT_ADOPTEDとなり、停止・元提供への復元込み397.5032085888088秒で承認上限1800秒以内に完了。元argv／全env／cwd、元sourceと両adapterのweights／config SHAを照合してPID136765／start237021687へ戻した。復元後healthz200、候補PID135811不存在、B8root不存在を別の読取で確認した。鍵と全環境の外部保存0。独立技術確認は原本・入力・messages／wire／raw・preflightの束縛とCPU拒否再現までで、新GPU再実行ではない。

全5件の独立全文照合適合というB8条件は不成立。B8起動／6LEAF／MERGE／追加判定送付0、A8の一回は消費済み。学習／retry／同raw SQL保存／非生成実再読／通常native採用／Render変更・配備0。元SQL checkpoint801ba068、入力bdb872a5、旧plan75daa8、新取得前plan af8a1a75、guard／as_of・月次当時版を保持する。残枠・未使用B8・旧A7／B7を次の実行許可へ転用しない。

原actual112,295byte／SHA256 6f91630aff9d1bf2ec1b6f7c94e8bc835285a1c0e3bc2a9ea50d379b3c499158。原本13memberのZIP30,152byte／SHA256 4967e4c2e2107aeb5b9ba8359df491ae56c57d4dfbb03902ba6eeaf91c0c3961を回収しCRCと遠隔ZIPのbyte完全一致を確認。private原本・実行log・source引用を含む意味reviewは既存Cocolon_CMEE_ConcreteReading_20261115.zipへ追記保全し、公開trialのsemantic_event_plan_actual_20261116には本文を含まない実行・技術・意味結果を置く。

fresh読取で通常API dep-dbsgn8t6e07s739qfk50／worker dep-dbsgnet6e07s739qg5a0は双方24bc228dbf54abc983906323c0ae7d937fae1fd6・Live、Supabase最新migration20261115011424（38件）を確認した。worker900・selector／model alias・重みは変更していない。候補sourceのCI成功・合成保存の既績を通常反映の完了へ数えない。

primary outcomeはBLOCKER_NARROWED。今回のA8実行・復元・原本保全は終えたが、作者rawの主体／未知／達成状態と参照scopeに未達がある。次の修復対象はこの受領原本にある具体的不整合であり、既存作者・compiler責務の範囲で検証する。新しいGPU試行scopeは未準備／未実施。適切な全12実結果→同raw一回SQL保存→別process非生成再読→互換native／API-workerの通常配置・alias有効化という同じ未完単位を維持する。build／TestFlight／本人実機は保留。本作業単位・補助経路全体・正式受入れは未完である。

STRUCTURE_MAP_DELTA_NONE：§9.96候補の実行結果だけを追記。商品owner／公開v3／source・rights／DB型／RN renderer／唯一realizer／月次保存の構造変更はない。

<a id="analysis-event-plan-v2-prepared-20261116"></a>
## 9.98 11/16 — A8の留保・判断・参照根拠を既存作者内で修復（実4B未実行・通常未採用）

§9.97の受領原本・全原文・独立reviewから、問い合わせの送信者／宛先逆転はunknownsを疑問文へ作文した時点、照明のscope不整合はreadingと項目／線の同じ根拠を二度指定した時点にあると確認した。本人が保証として扱わなかった判断の不明化、買えた満足の希望化も作者rawの課題として保持し、保存／受口の問題へ転記しない。旧A8 rawを新形式へ修補せず、旧v1のstrict拒否条件を維持する。

API候補[80d94db7833e9fa0039ac581fb73151b0767dda4](https://github.com/MassyuRed/mashos-api/commit/80d94db7833e9fa0039ac581fb73151b0767dda4)へ既存作者・native・compilerの差分を反映した。private profileはsemantic_map.event_plan.v2、schemaはcocolon.analysis.semantic_map.event_plan.model.v2、exact map aliasはcocolon-qwen3.5-4b-analysis-event-plan-v2。公開watashi.map.v3・唯一realizer・DB／RN型・商品ownerを増やさない。

| 既存責務 | 修復した内容と限界 |
|---|---|
| semantic_admission.py の作者材料 | 全fieldsを変えず、RECORDED／PERSON_JUDGMENT／PERSON_WISH／DECIDED_PLANを選んでからfactを作る。3つの架空例を含む3436byteの指示。modeはモデルの未評価解釈であり、本人の事実・意味適合を認定しない |
| serve_emlis_natural_reply.py の既存native schema／parser | unknownsは同event根拠内・同fieldの一意な原文引用source_quote／source_field、最大240字。主体を含む隣接文の候補も根拠側へ同じように提示し、選べない留保を作らない。本人訂正の根拠は全文を維持。引用は表示時に言い換えず、どの引用が適切かは実rawの全文照合が必要 |
| intent_compiler.py の既存expand／compile | readingのevent_refsを一度指定。nodes／edges／overviewは表示したいe／rのunit_refsを順に選び、根拠closureだけをcompilerが継承する。未選択の事実文を詳細へ追加しない。表示の未知件数・根拠件数・文字数・source／rights／両端scope・orphan拒否は維持 |
| analysis_model_source.py／analysis_if_model_source.py | exact alias2だけでv2を選び、IFは元120u。旧alias1／通常Analysis・自然Emlis／Pieceのprofile・重みを維持。通常設定はまだ変更しない |
| test_analysis_semantic_event_plan_v2.py／既存Analysis CI | 原文留保・全訂正根拠・表示選択と根拠の分離・6根拠・unknown集約上限・旧profile混入拒否・native alias／IF境界を検証 |

初回の拡張回帰は813成功／11失敗だった。うち10件は旧汎用parserにschema_versionがない場合のKeyErrorで、新v2処理のmarker参照だけをoptionalへ直した。1件は6根拠の合成fixtureが既存record網羅順へ従わないためで、先に二recordを網羅する並びへ修正し、native網羅規則を緩めていない。修復後の回帰824件成功。現在の3436byte指示と保存前意味reviewの束縛51件、runner15件、完全source抽出のfresh importも成功した。件数は重複するため加算しない。Pydantic非推奨warningは残る。候補CIは下記verificationで別記し、いずれも実4B品質の証明へ換算しない。

最初のv2指示4913byteでは既存plannerが12LEAFを導出した。原入力は削らず、重複説明を整理して3436byteへ短縮した結果、同plannerから6LEAF＋MERGE=7生成を再導出した。分割数を強制せず、停止前preflightで新plan／scopeの分割数・map数・control数・総数を照合する。全12の入力bdb872a5・元checkpoint801ba068・旧plan75daa8・guard／凍結as_ofはbyte不変、新取得前planはa41950c09689400663af6b22a7e6c0c075022655d261207602cb414492b50dc8である。全九カテゴリ・感情／強度・二欄・本人回答／訂正を提示sourceと時点のまま保持する。

既存finalizerをv2へ合わせ、新しく作った明示CPU合成7応答で一回SQL保存・artifact1／月次参照1、別processでservice/current/detail/monthとHTTPの同ID・図・本文・coverage・private再読を確認した。元checkpointは不変、実model／tokenizer／hosted DB呼出し0。これは新形式の保存経路だけの事前検証で、実4Bの意味品質・本人受入れではない。非synthetic保存ではexact B9／profile2／alias2と、全7raw／projection／text／12原文・guard／as_of・planへ束縛されたroot＋独立reviewをSQL forkの構築前に要求し、実httpx送信bytesのままreplayする。未評価rawの自動SQL保存、旧raw再束縛、受領後の修補は行わない。

新scope SHA256 **b53ac4d90b45631608451c47dc1163265af0b53498bdabdf241d1d0c8743c6fd**。初期9file合計 **3,133,443byte**、247完全source／展開12,593,607byteはAPI80d94db7／tree3310733bの全git blobと一致し、IFの明示moduleも含む。全payloadとscope自身のbytes／SHAを独立検証した。正本は同trialのsemantic_event_plan_v2_prepared_20261116。

| file | bytes | SHA256 |
|---|---:|---|
| execution_scope.json | 6344 | b53ac4d90b45631608451c47dc1163265af0b53498bdabdf241d1d0c8743c6fd |
| event_plan_execution.py | 31819 | 567d085a6aa580bccc3e65111dffb41c8e4ec9bb65aeb4f4b0344bbf8458d123 |
| current_api_sources.zip | 2584300 | 06f8e7f507b4f0d18ab6180d21c9b57b4139d9499ef4539bf1d5d01ae7775bad |
| source_manifest.json | 191064 | 830912476146aa9237ea17418f13995248f5fdbab9fcdf5256384b098ad45c84 |
| input_cases.json | 22769 | abf97a901194c152c3ec0b5bc3453900eb73e7856c07e0aea6f2bbc4d5e3a3a1 |
| diagnostic_preparation.json | 55355 | f09ae60106c04276cea5ef465d8abd9ed9a7557ad8d391ef51078a675b4096c8 |
| full12.input.json | 59146 | bdb872a588c42206f664e175a8c918c780da57a52353de378e738c7d0e72916d |
| full12_pre_acquisition.plan.json | 164806 | a41950c09689400663af6b22a7e6c0c075022655d261207602cb414492b50dc8 |
| controls.json | 17840 | 29fc6271f0e62166328e3be54c619ae46655eca776f15c741ab605d771feb362 |

- A9：同Pod f1lle4xwq3wjlnへ上記9fileを送り、同じ架空5件＋候補内前後4対照、最大9応答・停止復元込み30分、一回・学習／retry0。新rootは/workspace/semantic-event-plan-v2-diagnostic-20261116-once。
- B9：A9全5件の原文／raw／図／本文がroot＋独立全文照合で適切な場合だけ、4KB以内の結果SHA／5rawSHA／reviewer役割を同Podへ追加。全12記録の6LEAF＋MERGE＋前後4対照、最大11応答・停止復元込み17分、一回・学習／retry0。新rootは/workspace/semantic-event-plan-v2-full12-20261116-once。

直近の元提供はA8復元PID136765／start237021687。停止直前に現proc／argv／env／cwd／source／両weights-configを再照合し、既存鍵・全envは同Pod内認証と元提供の復元だけに使う。秘密値の外部送付・保存0。両scopeは未承認／未送付／未実行で、A8の消費済み一回・未成立B8は転用しない。実tokenizerのMERGE容量は新LEAF原本を使いPOST前に確認する。

fresh読取では通常API／worker双方24bc228d Live・autoDeploy off、DB38migration／最新20261115011424。新deploy／DB変更／本人記録読取0。適切な新全12実結果→同raw一回保存→別process非生成再読→互換native配置→worker stale1800のSave-only→exact新commit worker／API→map alias2有効化（IF120u・自然／Piece保持）まで同じ未完単位で進める。build／TestFlight／本人実機は保留のまま、通常反映も補助全体も正式受入れも未完である。

primary outcomeはTECHNICAL_CREDIT。source修復・合成保存・実行前の完全byte境界に再利用可能な検証結果が増えたが、PRODUCT_CREDITや実商品出力の意味改善へ換算しない。STRUCTURE_MAP_DELTA：既存Analysis作者／native／compiler内のprivate形式v2・内部根拠継承とexact alias選択をcurrent analysis mapへ追記。新reader／controller／authority／公開型／DB／RN構造の追加はない。

<a id="analysis-event-plan-v2-startup-stop-repair1-20261116"></a>
## 9.99 11/16 — A9は起動確認で応答取得前に停止・復元、起動guardだけの新限定修正を準備（準備時点の履歴、実績は§9.100）

Mashの明示承認後、§9.98の確定9file3,133,443byte／scope b53ac4d90b45631608451c47dc1163265af0b53498bdabdf241d1d0c8743c6fdを同Pod f1lle4xwq3wjlnの新payload folderへ送り、遠隔側でも全byte／SHAを照合してA9を一回起動した。元PID136765／start237021687と両新root不存在を確認し、launcher PID138358へ束縛した。source80d94db7／native d678fe2c／driver567d085aと全元入力は確定時と同じである。

| 実工程 | 確認した結果と限界 |
|---|---|
| 全5件の実HF preflight | request refs／messages hash一致。input tokensは1526／3025／1451／1583／2544、予約4096・32768context内。CPUのpreflight通過でありモデル応答の意味品質ではない |
| 候補Popen直後 | trial_health_wait line191のargv照合がcandidate_provider_argv_changedで停止。observed argv値は原本に保存されていない。candidate-provider.logは0byte。起動後のモデルload完了は確認していない |
| 応答取得／B9 | acquire前で新model呼出し0・raw／図／本文0、after.result／driver.logなし。全5意味適合条件は成立せず、B9起動／LEAF／MERGE0。意味評価は不適合ではなく評価不能 |
| 元提供の復元 | finallyで元argv／全env／cwd・source／両weights-configを照合し、29.388061529025435秒で元120u PID138365／start237571631へ復元。別の読取でもhealthz200、18008listenerなし、B9root不存在を確認 |

原executionのstate=PREPARED_NOT_ADOPTEDは、起動例外時に更新されなかった残値である。原本を書換えず、実際の終端はSTARTUP_ARGV_REJECTED_ZERO_RESPONSES_RESTOREDとして記録する。原A9の一回は終了・消費済みで、未成立B9や残応答枠を再試行へ転用していない。学習／retry／同raw SQL保存／通常反映0である。

原本11fileのZIP8,945byte／SHA256 55da0f7d170fd989293e81cf92b914808e60c5401c151d1b5cc1aaef5ca6df88を回収し、CRC・各member byte・scope/source/prompt束縛を独立確認した。kernel-proofはA8原本と同一、env・鍵値は外部保存しない。既存private引継ぎのversion17へ15entryを追加し、先行398entryを全byte保持した。公開trialのsemantic_event_plan_v2_actual_20261116には本文を含まない実行・独立確認・原本identity・通常読取状態だけを置く。

独立ローカルCPU観測では、生存childの起動直後に/proc/cmdlineが空となる事象を1500回中119回・2.12秒で再現し、非空不一致／読取errorは0だった。この観測は空の開始状態が起こり得る証拠であり、observed argv未保存のA9も同じ原因だったという証明ではない。再度の実生成・Pod probe・provider再起動はしていない。

既存event_plan_execution.py一つの起動guardに、**空cmdlineだけを同じ60秒の期限内で最大0.05秒待つ**差分を用意した。非空の不一致は即拒否し、秘密値を含まない個数／hashをerrorへ残す。完全一致する前にsocket／health／認証POSTへ進めず、PID生存・自分のloopback listener所有・healthの既存条件を保持する。ほかのコード差分は新scopeのfresh rootsだけで、production source80d94db7／作者・重み・入力／比較／意味採否／最終保存条件は変えない。

旧guardの空cmdline即拒否、新guardの空→一致・非空不一致・空→不一致・空の期限切れ・listener未所有・child終了をCPU7件で確認し、既存runner15件も成功した。テストは新しい実4Bの意味適合・runtime readinessではない。これはR10.3に列挙された4種類の機械的修復へ自動適合させるものではなく、Rule18の個別承認を要する起動guardの新限定修正として扱う。規則の適用範囲を広げない。

新しい具体scopeは同trialのsemantic_event_plan_v2_prepared_20261116/repair1。**新送付2file合計42,201byte**、scope SHA256 **75d8633d9d5005386c6f82c28425535af0e4ac60fb50fdb659d977c9ebd8713e**。event_plan_execution.pyは32,195byte／SHA75254429efe91bf70654feb3c402d188e7106a4856d43562be1839b72ec62d5f、execution_scope.jsonは10,006byte。全準備は9file3,137,481byteだが、source ZIP／manifest／input5／diagnostic preparation／full12input／full12plan／controlsの既送付7fileは同Pod内で新folderへbyte不変copyし、外部再送しない。旧helper／scope／root／原本は変更しない。

- 新payload：/workspace/semantic-event-plan-v2-payload-repair1-20261116。
- 新A9 root：/workspace/semantic-event-plan-v2-diagnostic-repair1-20261116-once。同じ架空5件＋前後4対照、最大9応答・停止復元込み1800秒、一回。
- 新B9 root：/workspace/semantic-event-plan-v2-full12-repair1-20261116-once。全5件の新原文／raw／図／本文がroot＋独立全文照合で適切な場合だけ、4KB以下のhash判定1fileを同Podへ追加。全12の同6LEAF＋MERGEと前後4対照、最大11応答・停止復元込み1020秒、一回。

新scopeは**未承認／未送付／未実行**で、元提供PID138365／start237571631へ新たに束縛する。学習／retry0、追加dependency／外部service0、既存鍵と全envは同Pod内認証・元提供復元だけに使う。次の失敗後に同scope内で追加修復・自動retryをしない。B9の新raw・exact profile2／alias2・全12独立意味reviewをSQL構築前に要求する既存finalizerと、旧checkpoint／guard／凍結as_of／月次当時版は保持する。

fresh読取では通常API／workerは双方24bc228d Live、DB38migration／最新20261115011424。新deploy／DB変更／本人記録読取0。適切な新全12実結果→同raw一回SQL保存→別process非生成再読→互換native／exact API-worker・map alias2の通常反映（IF120u・自然／Piece保持）まで同じ未完単位で続ける。build／TestFlight／本人実機は保留。

primary outcomeはBLOCKER_NARROWED。今回の応答は0件で、実4B品質・通常採用のcreditは増えていない。source／CI／合成保存の既績と、起動guard差分の検証をその代わりにしない。STRUCTURE_MAP_DELTA_NONE：商品owner／公開型／DB／RN／唯一realizer／保存構造は変わらず、一時実行helperの修正準備だけである。本単位／補助全体／正式受入れは未完。

<a id="analysis-event-plan-v2-repair1-actual-stop-20261116"></a>
## 9.100 11/16 — 修正版A9は起動通過後、最初のrawが既知／不明・参照・反復で不適合、復元して限定scope終了

§9.99の準備へMashが個別承認した事実をd4aaf02bfd87be074e501f9f57fe774bf7725778へ記録し、同Pod f1lle4xwq3wjlnで一回だけ実行した。新送付はhelper32,195＋scope10,006＝42,201byteの2file。既送付7fileは同Pod内で新payloadへ同一byteのままcopyし、全9file3,137,481byte・全SHA一致を起動前確認した。scope SHA75d8633d9d5005386c6f82c28425535af0e4ac60fb50fdb659d977c9ebd8713e、driver SHA75254429efe91bf70654feb3c402d188e7106a4856d43562be1839b72ec62d5f。旧A9・A8の承認／rawを流用しない。

### 実受領と停止

修正した起動guardは通過した。前対照Emlis2.074555秒、IF72.113623秒、読書会book_club_two_day156.942805秒の**計3model呼出し**を受領し、全てHTTP200。読書会はfinish_reason=stop、raw7,893byte／SHAa4d3bc5579536c6bd56eb96d61618976b60b5505ed24f814fc59a27630ec6082だが、現compilerのanalysis_semantic_event_plan_invalidで拒否された。図／本文は0。残り4件・後対照は未実行。全5件の独立全文適合条件が満たされず、B9はroot作成・LEAF・MERGEとも0。古いfresh_model_calls=0欄は実呼出し数を表さず、実測new_model_calls=3／map_calls=1を正とする。driver231.251157秒、停止／復元込み287.516223秒で、上限1800秒以内。

### 原入力4欄・raw全文の独立照合

- 確認済みの招待送信と一人の了解、会場返信の読了と部屋／時刻確認をe2.unknownsへ選んだ。既知の事実と、まだ分からない全員の既読／椅子の照会を区別できていない。e1にも既知の思考・書いて消した行動をunknownとして引用する曖昧さがあるが、外部の空室状況自体が未確定であることとは区別する。
- 2events／1readingから24nodes／21edgesへ反復し、同一title＋unit_refsの重複6群、全nodeがe1かe2だけを選択し、r1は未使用。異なる複数の事実を大きなeventにまとめたまま、その文面を何度も項目化している。
- 最初の実拒否はedge7のn1→n8。両端のevent根拠はe1だけなのに線はe1＋e2を指定した。端点範囲外参照はedge7/8/9/10/14/15/16/18/19/20/21の11本。原messages／同rawを現80d94db7へCPU再演して同拒否を再現し、誤拒否とは扱わない。
- e2.factには後日の会場確認・修正版招待送信が残り、引用は原文完全一致だった。ただし椅子の問い合わせ主体・送付先の不明節そのものは選ばれていないため、A8の方向反転が直ったとは認定しない。「参加者が読んだか不明」は全員という範囲を弱め、一人の了解との区別も不十分。担当者の返事待ちは、未受領の会場返信と受領済みの同僚の謝意を限定せず曖昧にする。

node2完了offset1297、edge1完了offset3805（Unicode文字・終端exclusive）で、同じnative parserが終了の]と続行の,をともに許すことをCPUで確認した。native制約が24項目／21線を強制したとは言えず、生成理由全体の確定にはしない。追加model／tokenizer／Pod／SQL呼出し0、raw・source・拒否条件は不変。図／本文がないため、rawの所見を最終mapの適合へ読み替えない。未実行4件／全12／本人訂正の意味品質も評価していない。

### 復元・原本保全・終了条件

元120uを同argv／全env／cwd・source／両重み／設定で復元した。PID139472／start237826333、別読取healthz200・候補18008listener停止・B9root不存在。結果SHA c83465792524a5cdd2441477878adca3445b1d8d5a2a7308474ec7b1d2ad904d、元13file・CRC／全byte一致のZIP23,616byte／SHA27aa266d21e4bcc144eacb24e30f3bc394b173d758d7cb2a7aff26c903cec52cを既存非公開原本束へ追記した。旧413entryを全byte保持し、既存archiveの同一identityへversion18として保存。公開の本文なし受領・独立照合・manifestは同trialのsemantic_event_plan_v2_repair1_actual_20261116/に記録する。

承認scopeのreadiness_guard_correction.terminal（次の失敗でrepair1を閉じ、追加修正・自動retryなし）に従い、今回の一回は消費済み・閉鎖。B9条件不成立の未使用枠は転用しない。次helper・次scope・追加学習・再試行は準備／実行しない。R10.3へ自動適合とはしない。A8と今回の間にA9の起動停止があるため、R10.2の同一原因二連続という認定も行わない。

次に修復すべき対象は、**既存作者が確認済み／不明を区別し、異なる事実を適切なeventへ分け、必要なnode／edgeだけを同じ事実の根拠へ束縛し、反復を避けること**。guard緩和、raw書換え、重複除去で意味適合を作らない。今回の閉鎖作業では製品source変更・新しい試行方式の追加を行っていない。

fresh読取で通常API dep-dbsgn8t6e07s739qfk50／worker dep-dbsgnet6e07s739qg5a0は双方24bc228dbf54abc983906323c0ae7d937fae1fd6 Live、DB38migration／最新20261115011424。新deploy／migration／本人記録読取0。候補source80d94db7は不変・通常未採用で、既存824件／51件／runner15件・両CI／合成SQLは実商品品質へ換算しない。学習／retry／実rawのSQL保存／通常反映0。primary outcome=BLOCKER_NARROWED、PRODUCT_CREDIT=0。STRUCTURE_MAP_DELTA_NONE。適切な全12実結果→同raw一回SQL保存→別process非生成再読→互換native／exact API-worker・map alias2の通常反映は未完。IF120u・自然／Pieceの既定経路、月次当時版、build／TestFlight／本人実機保留を維持し、本単位／補助全体／正式受入れは未完。

<a id="analysis-event-plan-v2-author-semantics-restore-20261116"></a>
## 9.101 11/16 — 既存v2作者の意味条件を復元し、新A10/B10の個別承認候補を確定

Mashの「続きから再開」指示に基づき、§9.100の実行・原本保全・資料更新済み地点から再開した。旧repair1の失敗時終了は保持し、新たなmodel／Pod操作はしない。全体設計・current資料／三中核とAnalysis地図・第11回§5・既存実装と原rawを照合し、既存作者を直接修復するbounded source作業（OBSERVED_BLOCKER_MINIMAL_FIX／既存Rule18 LEVEL_2）として実施した。新しい試行方式・reader・補助route・guard緩和は追加しない。

### 原因箇所と最小source差分

v1にあった具体的な出来事の分離条件と「確認済みの行動・返信を不明へ戻さない」という条件が、v2の短縮時に抽象化／脱落し、引用候補の文字境界が説明の中心になっていた。これはsource差分として確認できるが、実rawの失敗原因がこの脱落だけとは断定しない。

API **b14960e1e546643942be7786ed4e487274e4422e**／tree393d052d0abd072311594350cab7ebd3f7583c8dは、既存cores/analysis/semantic_admission.py内の_SEMANTIC_MAP_EVENT_PLAN_V2_INSTRUCTION定数だけを変更した。source SHA d1772ef4bfe0ebe74de8c2f5a25c4357dc9949fa015adfb0e8b930db277a1583、git blob c0c27e2bff17bfb6498208228684d2e87afe1d43。確認済みの行動・返信・結果／本人判断・非行動自体をunknownへ戻さず未確認がなければ[]、版・主体・状態・時点や前後確認を別eventとし、同じ意味の分類別反復を避け、edgeの全e／r.event_refsを両端nodeの根拠和集合へ限定する説明を復元・明確化した。全readingの表示使用も保持する。

schema／compiler／guard／native／モデル・重み／入力と二欄／資格4enum／引用と本人訂正の全文・内側留保／公開v3／唯一realizer／DB／RN／保存owner／月次当時版は不変。ASTはこの定数以外一致、新production／test file0。旧rawを修補・新messagesへ再束縛しない。STRUCTURE_MAP_DELTA_NONE。現在地とAnalysis地図へ同じ既存fileの責務差分を追記し、全ファイルの地図の新path追加は不要。

### 検証・容量・実品質の限界

最初のpytestは手元にないpytest_subtests.plugin指定で収集前停止し、成功へ数えない。既存runtimeのpytest9.2.0（subtests内蔵）で169成功・SQL設定不足1skip、既存PGliteを設定した残り1件も成功し、計170既存testを確認。新実行候補へ既存runner15＋startup7の22件／28subtestも成功した。新test・dependency／学習・model／tokenizer／Pod操作0。

長い中間案4818byteは既存plannerの6→12分割を生んだため不採用。最終3632byteは旧3436＋196で、同12記録・同6record_groups、最大LEAF16376byte（既存目標16384以内）を維持する。全5件の原入力・USER message／source_guard／request_refは同じで、SYSTEMと全messages hashだけが変わる。同profile内の指示差分ではrequest_refが変わらないという実測を正とし、messages hashとsource identityで新取得を束縛する。旧SQL input／plan／checkpoint／receipt、guard／固定as_ofは不変。引用一致・機械検証・source修復を実4B意味改善や商品品質へ換算しない。

### 新しく具体化した個別承認対象（未承認・未送付・未実行）

同trialのsemantic_event_plan_v2_author_restore_20261116/を新候補の正本とする。**新送付6file合計3,039,091byte**（driver／247module source ZIP／manifest／diagnostic preparation／full12plan／scope）。既送付のcontrols.json・input_cases.json・full12.input.jsonの3fileは同Pod f1lle4xwq3wjln内でbyte不変copyし、全9file3,138,846byteを既存preflightで照合する。scope SHA **f68618f074eb5ce176491e4a45926b5bfa4e6ebbcbbd8c9d9dcda812d29d0d86**。source ZIPの全247module／asset bytesをAPI b14960eのremote git blobへ照合済み。新driverは既存検証済み動作からROOTSだけを変更し、それ以外のASTは同一。内部unitキーA9/B9は既存入口名として保持し、新scopeと新rootでA10/B10を識別する。

| 候補 | 内容 | 上限・終了 |
|---|---|---|
| A10 | 同じ架空5件＋前後4対照 | 最大9応答・停止復元込み1800秒、一回 |
| B10 | A10全5件の原文／新raw／図／本文のroot＋独立全文照合が適切な時だけ、全12記録の同6LEAF＋MERGE＋前後4対照 | 最大11応答・停止復元込み1020秒、一回 |

B10前の追加送付は4KB以下の判定state／reviewer役割／結果SHA・5rawSHAの1fileだけ。学習／retry／旧結果再利用／raw修補／SQL保存／通常採用0、失敗時はその一回を閉じ追加修正・自動retryなし。既存鍵と全envは同Pod内認証・元argv／env／cwd復元だけに使う。元提供の直近記録PID139472／start237826333へ束縛し、実行直前に現proc／argv／socket／source／両重みを既存preflightで再照合する。不一致なら提供停止前に終了。

新payloadは/workspace/semantic-event-plan-v2-payload-a10-20261116、A10 rootは/workspace/semantic-event-plan-v2-diagnostic-a10-20261116-once、B10 rootは/workspace/semantic-event-plan-v2-full12-b10-20261116-once。独立reviewで旧7fileコピーmetadataの残存を発見し、未承認候補から削除してscopeを再凍結した。旧scope原本は変更しない。新候補への個別明示承認前に送付／実行せず、旧repair1終了や未使用B9を転用しない。R10.3の機械的修復としても扱わない。

新実4B意味・全12実統合→同raw一回SQL保存→別process非生成再読→互換native／exact API-worker・map alias2の通常反映は未完。通常API／worker24bc228d・DB38migration／20261115011424は§9.100の確認記録を継承し、今回はfresh再確認・配置・DB変更・本人記録読取0。IF120u／自然・Piece既定、build／TestFlight／本人実機保留を維持する。primary outcome=TECHNICAL_CREDIT（既存作者sourceの限定修復・非生成検証のみ）、PRODUCT_CREDIT=0。本単位／補助全体／正式受入れは未完。


## 9.102 11/16 — 承認済みA10の実2分析を照合し、未使用reading拒否・意味不適合で閉鎖

Mashのcurrent明示承認後、API b14960eのAnalysis CI43820851718とPiece CI43820851867の両successをfresh確認した。送付原本execution_scope.json（SHAf68618f074eb5ce176491e4a45926b5bfa4e6ebbcbbd8c9d9dcda812d29d0d86）はbyte不変。runtimeのscope.jsonはJSON同値のcanonical別表現であり、同一byteとは扱わない。同Pod f1lle4xwq3wjln内で既送付3fileだけをcopyし、新6file3,039,091byteを送付、全9file3,138,846byteの長さ／SHAを照合して一回起動した。新source ZIP247fileもAPI b14960eの全git blobと一致した。内部入口名A9をA10のscope/rootで使用し、旧枠を再使用していない。

| 実取得 | 実結果と本文照合 |
|---|---|
| 前対照Emlis／IFの2件 | HTTP200／stop。2.143232秒／72.880101秒。後対照へは到達しておらず、前後不変の成功には数えない |
| 読書会 | HTTP200／stop、48.445584秒、CMEE GENERATED、実2node／1edgeと本文へ到達。確認済みの会場返信／本人確認をunknownへ戻し、前日の返事待ちを翌日確認後も現在の不明へ残した。会場と椅子の問い合わせを区別できず、本当の不明と送信前後の変化・一人の了解も十分に保持しない。本文／図の反復が残り、root＋独立全文照合とも不適合 |
| 照明 | HTTP200／stop、94.958776秒、raw受領後analysis_semantic_event_plan_orphanで拒否。r1とr2がnode／edge／overviewのunit_refsで一度も使用されず、intent_compiler.py4146の既存条件に不適合。全4eventは到達可能。e2/e4の同義反復、前の店と後の店の混在、購入前後と本人判断・条件の欠落も独立照合で確認。図／本文を捏造せず未生成とする |
| 残3件／後対照2件／B10 | 未実行。全5件適合条件が不成立のためB10取得・判定送付0。未使用枠を別試行へ転用しない |

取得driverは218.862417985秒・exit1、停止と復元込み276.144289257秒。元PID139472/start237826333から、元argv/env/cwdと両重みを照合してPID141466/start238372709へ復元した。別processの読取でhealth200、候補18008listener停止、B10root不存在を確認した。学習／retry／raw修補／同rawSQL保存・再読／通常採用・配置0。新しい修正や次試行の準備は行っていない。A10一回は消費済み・失敗閉鎖、B10は条件不成立で未実行・再利用不可。primary outcome=BLOCKER_NARROWED、PRODUCT_CREDIT=0。通常反映を含む元作業単位・補助全体・正式受入れを完了へ換算しない。

after.result.jsonはSHA51b7808b233c0959c4935d277f98da16e5a8eb15158459e725cdef42f5ad4f52。読書会raw SHA4efbf64d4e5e9f1ccc43192512cc1e24bc4dd95a8aca749d5c14a4513f141f53、照明raw SHA7b3bc527eb6de141324991d66ed1344f5f1074dcafca0d43336457346193749d。scope／messages／request_ref／wire／response／rawの各束縛を独立照合し、別messagesへの再bind0。Pod生成ZIP31359byte／SHA563bc9bc2cb4fa191c84b5773f97f80cfaf832d5539082e5ab2c8624d0f9b18fはCRC・全元member hash一致。UI download待機timeout後、Editorでbase64全文をcopyして同byteを回収した。これは転送方法の変更であり、推論の再実行ではない。

[実行原本・root／独立照合](https://chatgpt.com/library?file_id=libfile_fde3_f-bfc7a4ef5f3c81918b9b8092b19083a3_2f7470f963808191aaebf050935e72de&account_id=personal)を新A10成果物として保存。75,231byte／25member／SHAbff9507c57614b9b572d6a257fc26d8be257e2a244a5dd89ee284cdc5a9cd8a2。旧ConcreteReading各版を置換・削除しない。本文なし記録ownerは同trialのsemantic_event_plan_v2_a10_actual_20261116/。秘密・env値・重み・本人実データ・browser画像を含めない。

通常API srv-d4ppfpm3jp1c73952bj0／worker srv-d6copljh46gs73cmeic0は両Live・commit24bc228dbf54abc983906323c0ae7d937fae1fd6、autoDeploy off。SupabaseはACTIVE_HEALTHY・38migration／最終20261115011424、worker既存stale900。API healthは初回timeout後の一回GETでstatus okを確認した。通常モデル生成成功や本人受入れへ拡張しない。IF120u／natural・Piece既定、公開v3／唯一realizer／原二欄／資格と本人訂正／full_source_semantic_coverage=false／月次当時版は保持。STRUCTURE_MAP_DELTA_NONE（今回は候補の実評価・状態記録だけで製品source／route変更なし）。


## 9.103 11/16 — A10失敗を継承し、既存v2作者へ入力・完成出力の正例を復元（実4B未実行）

A10終了後のMashの新しい「補助経路の活用作業を続けて」に基づく既存作者のsource修復である。A10scopef68618f0の一回は消費済み・失敗閉鎖、B10条件不成立と原本は§9.102のまま保持し、旧rawを修補・再束縛しない。新GPU枠の承認とは扱わない。

### 原本と実装の原因箇所

読書会は後日の本人確認を現在の不明へ戻し、残る全員既読／椅子照会の留保を十分に分離できなかった。照明の全4eventは項目根拠へ到達していたが、r1/r2をnode／edge／overviewのunit_refsへ一度も選ばずorphan拒否になった。出来事到達と読み取り表示を分けて原因を記録する。現在のv2 messages分岐は、既存旧map作者の入力・完成出力を対にしたlessonを使わず、短い自然文の資格例だけを持っていた。旧34更新17教材も旧map schemaであり、現event／reading／unit_refsの完成例ではない。今回のsource不足を確認したもので、モデルの失敗原因をこれだけと断定しない。

### 既存ownerだけの変更と検証

API7bb605b25138e9b9fc70ad8abca10dcfb46cd60bは既存semantic_admission.pyのv2指示定数だけを変更し、無関係な講座申込みの架空完成例を置いた。申込み時の返信待ちは当時のfact、翌日の受付完了返信は確認済み、兄の費用支払いは発言までで実行未確認と分ける。r1は前後e1/e2を根拠にnode／overviewへ表示し、e3も別nodeへ表示する。場所／版／主体／時点／否定／資格と本人訂正全文、非行動から意図・動機を決めないこと、edge端点の根拠範囲を保持。schema／compiler／native／source guard／唯一realizer／公開v3／DB／RN／重みは不変。既存test fileへ正例の実prepare→compiler→図／本文／native decoderと、全event到達済みでもr未選択を拒否する2件を追加した。b14960eとの製品AST差は当該定数だけである。

最終指示はraw3472byte／JSON文字列3650byte（旧3632／3647）。中間3626byte案はJSON内のquote escapeで送信量が157byte増え、6→8LEAFになったため不採用。全12原文24欄／guard a000deb9／as_of2026-11-16T00:32:38.924+09:00と同じ順序の6組を、既存plannerが再導出した。各LEAF送信byteは16132／16143／16173／16081／16295／16379、上限16384内。全5件のUSER／frozen／fields／material／guard／request_refは不変でSYSTEMとmessages hashだけが変わる。既定／v1／source dutiesと動的suffixは不変。

最終既存v2 suiteは33PASS／2.05秒、FAIL／SKIP0。中間sourceの関連260PASS／146.45秒は最終版の件数として流用しない。最終sourceの両CI結果は同候補ci_verification.jsonを正とする。既存Python3.12.14／pytest9.2.0／LMFE Git817f944fcc8851917c40300a47f62d1defc3ffc3／PGlite0.5.8を再利用し、依存install0。247完全module／asset・12,593,643byteのZIPは全memberをremote Git blobへ照合済み。既存builderへ前回同様IF sourceを明示entrypointとして残し、意味・入力契約を変更していない。driverはROOTSだけを新A11/B11へ変更、内部unitキーA9/B9を維持する。

### 保存再読の接続と新しい有限候補

既存finalizerはbyte不変で、最終8source hash／新messages／6組planを元のSQL4原本へload_preで束縛した。最初のlocal checkは新準備metadataの独自state名で拒否され、SQL0のまま終了。新未承認metadataだけを既存SOURCE_ONLY_EVENT_PLAN_PREPARED_NOT_EXECUTED_NOT_ADOPTEDへ戻し、最終束縛を確認した。独立checkの元出力・旧checkpoint／input／receipt／planと拒否条件は不変。これは保存／再読の事前接続確認であり、新実raw保存の成功ではない。全12の新rawが適切な場合だけ、同じ最終rawを一回SQL保存し、別processのcurrent／指定ID／月次／ensure=false HTTPを非生成で再読する。次いで互換native／exact API-worker／map alias2とworker既存stale1800設定を整合反映し、同じ未完単位を閉じる。IF120u／natural・Piece既定、月次当時版とfull_source_semantic_coverage=falseを保持する。

新scope6c2c2a5119ddfc07b3570cc9317c25175e8a2d8533010eab8de9188ae657d7bb、送付新6file3,039,282byte＋同Pod内copy3file、全9file3,139,037byte。新payload=/workspace/semantic-event-plan-v2-payload-a11-20261116、A11 root=/workspace/semantic-event-plan-v2-diagnostic-a11-20261116-once、B11 root=/workspace/semantic-event-plan-v2-full12-b11-20261116-once。

- A11：架空5件＋前後4対照、最大9応答・復元込み30分、一回。
- 全5件の新source／raw／図／本文がroot＋independentの全文照合で適切な場合だけ、既存4KB以下の判定hash1fileを追加し、B11：全12記録6LEAF＋MERGE＋前後4対照、最大11応答・復元込み17分、一回。
- 学習／retry／raw修補／応答再利用0、失敗時は一回を閉じる。既存鍵・全envは同Pod内認証と元提供復元だけに使用。個別承認前の送付／実行0。直近A10復元PID141466/start238372709を前提記録とし、実行前の既存preflightで現procと両weights等が一致しなければ停止前に終了する。

候補と検証原本は同trial semantic_event_plan_v2_author_restore_20261116/a11/。scope／準備hashと完全ZIPを既存builderで再現できる。通常API／worker24bc228d Live・autoDeployOFF、DB38migration／20261115011424を2026-11-16T08:20:26Zにfresh再確認。worker900は現deployの11/15起動logを今回再取得した値で、新起動eventではない。今回はmodel／Pod／SQL／通常配置変更0。STRUCTURE_MAP_DELTA_NONE（既存作者定数と既存testだけ）。全量の実意味→同raw実保存再読→通常反映／正式受入れ／補助全体は未完、build／TestFlight／本人実機保留。


<a id="analysis-independent-scenes-fit26-a26-actual-20261118"></a>
## 9.128 11/18 JST — FIT26／A26の一回を完了・正常復元、全文意味は不採用でB26条件不成立

§9.127の確定範囲に対し、Mashが同Podへの新12file・2,087,291byte送付と既存9file・3,286,728byteのPod内copy、FIT26／A26／条件B26を各一回承認した。旧FIT25／A25の許可は使っていない。実行UTCは11/17、JSTでは11/18である。送付前の元PID36492／start99185008・health200と、copy元／全21fileのbyte・hashを現物照合した。認証・元argv／env／cwdは同Pod内の停止／完全復元に限って再利用し、外へ取り出していない。

### FIT26 — 実66更新と保存再読・元提供復元

同revisionのcached4Bを使い、configだけを継承したfresh LoRA／fresh AdamWを66行一巡・66更新した。順序付き66loss／勾配は全て有限。最短・最長の前後4損失forwardは完了し、2IDのlossは0.196654856→0.099777602、0.527064383→0.458328336であった。損失低下を一般読解品質の証明とはしない。

実fit382.584秒、元提供復元込み412.121131秒で、fit900／work1020／whole1200秒内。peak allocated16.399GiB／reserved22.785GiBだった。今回の最長11,476tokenを無切詰めで完走した事実であり、任意入力のGPU適合保証ではない。追加学習・retry・途中checkpoint採用・旧重みの学習読取・model generationは0。

保存した112個F32tensor・3,833,856parameterをfresh reloadして全tensorの一致を確認した。新weights SHA256 `53ab4293407ffc22be18ecd8399af7c7338035517a5814be6accbf27380f86fc`、config `f45804d7b499486956a01149e867b0498b8c07e8bffc9d7c455592575e756904`。原120u／native／argv／env／cwd／kernel／weightsを復元し、PID42384／start99738202・health200を検査してから、凍結binderで固定8fileのPod内copyと実値だけの2JSONを作成した。派生scope／receiptは計128KiB内、追加upload・モデル呼出し・通常変更0。

training scope SHA `1756ccd2c6e945e8d4d4a163c8507d6e884c0c27592690a905dcc25fb6a96daa`、実fit report `362a1b59a3793d50b05a529d37b849b7108b70aae6f6c4a24d99b8ece67e7cbc`、派生evaluation scope `74e6bdc34da61416c42ef5e8920c6b8486906399d9bb4e09ff47aaf931806ace`。rootと独立担当がscope／data／source／重み実byte・loss・復元来歴を照合し、技術blocking0。独立担当がモデル再loadやGPU試行を追加したものではない。

### A26 — 同5入力・実19応答の完了と正常復元

上記同候補で5入力のPLAN／NODES／RELATIONS全15段階と、Emlis自然応答／IFの前後4対照を一回だけ取得した。全5が構造GENERATED、全phaseがstop。各3段階のcompletion合計は読書会1511、照明3421、修理1445、取消1318、T01 2926で、共有4096内だった。前後対照は全bodyがbyte一致した。これは候補nativeのadapter切替と復帰の証拠であり、旧通常nativeとの任意全応答同一の証明ではない。

A26は復元込み808.569953秒／上限1800秒、driver_exit0。原提供PID43656／start99828479、元native／120u／argv／env／cwd／weightsの復元とhealth200、trial18008停止、B26 root不在を確認した。全文review後にも原PID／health200・原result不変・B26 root不在を再確認した。A26原result SHA256 `b22d292bb01985290a3fb81c2347d8312d448d85214b78576532092b1ff65518`、1,304,786byte。原本archiveと全memberをCRC／byte／SHA照合し、実重みとともに保全した。

rootと独立技術担当は固定入力、request／wire19応答、15rawのhash、PLAN→NODES固定根拠→REL結合、予算、private graphと公開投影、保存本文と凍結formatterの一致、復元を照合した。技術blocking0を意味合格にはしない。CMEEの意味欄はUNASSESSEDのままで、自動合格やraw補修を加えていない。

### 全5の独立全文意味照合 — 全件不適合

原19記録・38欄（非空37欄、空行動1欄を含む）、全15raw、39node／45unit／86固定根拠／7線、private87 literalと所有者、全公開投影・概要・本文をrootと独立担当が別々に照合した。独立担当はcurrent root判定を採否の導出に使っていない。

| 入力 | 不採用の根拠 |
|---|---|
| 読書会 | 初日の下書き保存だけ・参加者へ未送信がPLANから落ち、翌日の確認後送信との重要な経過差が可視出力に残らない。返信見出しの主体も曖昧 |
| 長段落の照明 | 購入実行・配線調整・一度使用の範囲と長期留保・窓際との条件差／効果不明・次回同手順未決定をPLANで落とす。n2／n5に家計の同3根拠を重ね、「今月と来月の使い分け」を線・概要へ加える |
| 修理 | 後日の完了連絡確認を保持しながら、旧記録の修理完了未確認を現在形で並べる。異なる記録の今日と明日の予定を時点限定なく結ぶ |
| 応募取消 | 取消確認・旧受領メール≠現在応募中・再応募意向なし等は回復。しかし「規約を読み直し、取り下げた」という並びを、線・概要の「規約読みによる」で理由へ強める |
| T01・10独立記録 | 全19非空欄を10独立nodeへ置き、関連線は1本へ改善。恋人との夕食もnode本文では保持する一方、REL概要で「友人・恋人との会えなかった日」と非面会へ反転 |

改善した部分を消して全く変化なしとはしない。T01はA25の12node／15field／star12線から、10node／全19field／1線へ変わり、人生のつらさ・未決定も回復した。取消も残る旧メール・再応募しない意向等を可視保持した。ただし全5の判定は不適合であり、品質進捗率・一般入力の合格率・通常採用creditへ換算しない。

### B26と通常反映 — 条件不成立、未実行を保持

全5適合の独立判定fileは作成せず、B26は一度も起動していない。条件B26を別入力の試行やA26の再試行へ転用しない。FIT26／A26の各一回枠は消費済みで、同root再起動・追加学習・retryは0。新53ab重みは不採用で元120uの提供を維持する。同じ全12の新実結果・同最終rawのSQL一回保存・別process非生成再読は今回0で、元単位と補助経路全体は未完。

通常は先行fresh metadataのAPI／worker24bc228d・autoDeployOFF、DB38／最新20261115011424を基準とし、この実行ではRender／稼働SQLを変更していない。採用準備のread-only比較では24bc→e58は38commit ahead・37file（製品9／検証25／workflow2／資料1）、migration追加0。全patchと追加4ownerの静的reviewを保全した。新作者nativeだけでなく、通常semantic全profileのhistory pipeline、v3本文整形、Analysis／IF共用decode等の差分もあり、endpointだけの変更で通常反映完了にはしない。

exact e58の既存SQL依存7file・145,935byteを取得し、byte／SHA256／Git blobを照合。source247と既存finalizerを実行準備へ復元し、元checkpoint `801ba0683d2aed9a7ba46a8e7eb630b7cc810e1279aee6612cd1a0933e374485`不変を確認した。PGlite0.5.8は走査範囲で未配置で、SQL processは起動していない。これは依存準備の事実で、実raw保存再読の成立ではない。

### 次の修復対象 — 追加学習を既定にしない

A25／A26の全5で原field・record metadataと15phaseのsystem本文が同一であることを対比した。fresh54とfresh66という別候補の比較であり、追加12行だけの因果効果を単独証明したものではない。照明3421tokenはstop、24unit枠のうち12unitで重複があり、単なる出力打切りや枠不足を主因と断定しない。既存教師には長段落、時点更新の正例、10独立場面・非star構成も既にあるため、教示が無かったという理由で追加SFTへ直行しない。

残る責務は、PLANの重要内容選定／重複、NODESの主体・肯否・当時と現在／既知の非行動の保持、正しいnodeからRELで新しい意味を作らない派生表現である。既存3段階・既存owner内で原根拠と意味状態を同unitへ結び、最終見出しの直前まで持つprivate作者改修候補を原本対比から記述した。span identity・主体／肯否／時点状態・unit参照の具体型、原文へのlossless復元、教師との互換と4096容量、旧profile／120u／natural／Pieceの境界はCPUで未確定であり、候補を実装済みや改善実証にしない。

統合修復候補の独立reviewはREVISION_REQUIRED_NOT_IMPLEMENTATION_READYである。一つのunit内に複数主体・実行／既知非行動／不明が併存する場合の対応、誤った状態の自己申告を正解にしない意味scope、同じREL呼出しで選択unitを見出し直前へ固定する具体decoder手順、span索引のwire／contextと出力容量、旧66教師／53abとの互換戦略が未確定。新aliasを作る場合はIF120uへ戻す既存`analysis_if_model_source.py`も必須ownerであり、点検だけで済ませない。まず小さい独立複合例のprivate wireと既存native内bindingを具体化し、型を増やしてから問題を解く順序にはしない。提案だけを次の実装／GPU開始条件の成立と扱わない。

新checker・意味自動PASS・field使用率の合格化・引用固定見出し・取得後raw修補・評価入力の教師化・無根拠のnode枠拡大を修復として採らない。新しい実比較は、既存作者の一体修復を具体化し、source／native／入力／予算／復元を凍結した新しい範囲として扱う。FIT27や追加学習の実行をこの記録で既定にしない。通常反映の既存依頼は未承認へ戻さず、意味品質の前提が未成立であるため未実行を保持する。build／TestFlight／本人実機は従来どおり保留。

原本・実重み・root／独立技術reviewと全5意味review・差分比較・依存準備・統合修復候補は既存private継続資材`resume_fit26_a26_actual_20261117/`に保存。STRUCTURE_MAP_DELTA_NONE_PRODUCT_SOURCE：今回の商品source・公開型・DB型・恒久owner変更0。確定した成果は実比較の完了と不採用根拠の特定であり、元単位／通常反映／補助全体の閉鎖ではない。

<a id="analysis-independent-scenes-fit26-prepared-20261117"></a>
## 9.127 11/17 — 独立場面・現在状態・欄内の複数節を教える66段階候補と、新しい一回の具体準備

この節はMash承認前の準備時点の記録である。承認後のFIT26／A26実績とB26条件不成立は§9.128を現在正本とする。

第11回§5と§9.126に従い、A25の全欄が三段階へ届いていた実原本、既存指示と18教師の構成を対比した。既存指示への同趣旨の禁止文追加、原rawの修補、field使用率だけの意味合格化は行っていない。選定・無関係場面の結合・派生文・関係線の偏りは作者の実出力にあり、transport／固定根拠joinの修復を装う変更はしない。今回は既存作者の学習構成を直接補う候補を作成した。

### 追加する内容と、その確認範囲

旧54行のmessages／target／順序を完全保持し、新規架空4群・PLAN／NODES／RELATIONS各4行の12行を追加した。計22群・66行、67記録・134非空欄である。追加は30記録・60欄で、実評価5入力／全12のID・全文欄とは重複しない。旧失敗rawや評価入力の言換えを教師の正解へ変えていない。

| 新規群 | 直接教える構成 |
|---|---|
| 10独立記録のORDINARY | 各記録の思考・行動を同じ場面へまとめ、別場面は混ぜず10nodeへ配置。関係線0、概要は後方nodeも選ぶ |
| 6記録・3組のORDINARY | 別時点は別unitへ分け、条件確認と選択の関係を3つの独立pairへ結ぶ。共通起点へ線を集めない |
| 6独立記録のMERGE | 車両／座席、所有と担当、確認済みの現在情報と残る旧表示、拒否決定と未送信を保持。関係線0 |
| 8記録のMERGE | 後日確認で解消した不明は当時factとして残し、現在unknownへ戻さない。長めの一欄の旧住所・今年の意向・修正済み住所・未提出・比較用保存を2unit／5根拠へ保持 |

新4群・12行を華恋が全文確認した。旧54は前回完了したroot reviewを、同一messages／target／順序の照合で継承しており、今回新たにrootが全54を再読したとはしない。独立担当者は旧18＋新4の全22群・66行を、67記録／134欄・128node／178unit／272root／36edgeと14個の新合成LEAF文脈まで全文照合した。初稿の解消済みunknown、実在を確かめていない水溜まり、住所の修飾移動は凍結前に訂正し、差分を再読した。

最終training_materialは1,634,183byte、SHA256 `25c438aea548e8424c90f4f242b2d1c607e711eb104a983210f4d4a3a9b968bf`。既存v2指示、公開watashi.map.v3、guard／source duties・訂正cohort、保存owner、IF120u／natural／Pieceの境界は変更しない。商品source変更0で、新controller／checker／意味自動PASSは追加しない。

CPUでは現nativeのJSON schema・3phase組立・最終graph／本文投影、新MERGE用14合成LEAFを確認した。構造用completion_tokens=1は合成placeholderであり、実生成・実token値ではない。新教師のexact patched native文字parser確認は未実施。C01の一部公開投影には既存有限readerの主体未特定注記があり、原文／教師の妥当性とreaderの限定を区別する。教師強制・新4群の小規模／短文中心／平穏固定という限界も残す。教材reviewを実モデル改善や一般品質へ換算しない。

### 容量・実行部品の確認

同revision851bf6eのtokenizer3fileを完全hash照合して、66行のprompt loss mask・完全assistant＋EOSを無切詰めで実encodeした。旧54のtoken値は前回と一致。最長11,476token、各群の三段階出力合計は最大3,393／既存4,096内で、context32,768を維持する。FIT25の563.814秒に対する計算量指標別見積りは約722／756／847秒で、fit900秒・work1020秒・復元込み1200秒を候補とする。これは完走保証ではない。

前回GPU peak allocated16.399GiB／reserved19.900GiB、最長列は9,366→11,476で約22.5％増加。固定SDPA・BF16・nonreentrant checkpoint・同じlossを使うが、新列のGPUメモリ適合は未実証である。粗い全量外挿には24GiBを越える値もあり、メモリ内を保証しない。OOM／期限時は元提供へ復元し、retry・縮小・切詰め・途中候補採用を行わない。CPUにtorchを読み込まず、GPU完走を模擬していない。

確定scopeに対する実trainer bound_scope／once scope_read／rows_for_fit／同encoderと外側待機期限の13確認が成功。最終独立検査で旧785秒waitの残存を検出し、fit900秒＋5秒以内、かつ残るwork期限以内のwaitへ修正した。実binder／評価scope関数の合成94確認は、66更新完了・保存reload112・元提供正常復元後だけの束縛と、旧54更新／不採用FIT25重みの拒否を確認した。評価driverのscope_read以外14関数は旧版とAST一致。source247はfresh e58 remote blobと全件一致、既存Analysis CI44072901877／Piece CI44072901970は同e58・attempt1成功をfresh再取得した。変更していないinference sourceに新CI成功を仮造しない。

同e58・同12入力／同取得前plan・同SQLcheckpointの既存合成保存再読は限定技術証拠として継承し、旧onceを再実行しない。今回新実rawのSQL保存／再読は0である。

### 確定した新しい一回の範囲 — 未承認・未送付・未実行

同Pod `xrplcoeb5ec77f`へ新12file **2,087,291byte**を送り、既存FIT25 payloadから同じ内容の9file **3,286,728byte**をPod内copyする。copy元不在・hash不一致時は停止し、追加uploadへ切替えない。

- FIT26：cached同4BをBF16・configのみからfresh LoRA／fresh AdamW、66行一巡・66更新、前後計4損失forward。fit900秒／work1020秒／復元込み20分。全66完了と112tensorの保存fresh reload一致・元提供正常復元を必須とする。
- その実値だけを凍結templateへ束縛。送付／copy済みの固定8fileを同Podの新evalpayloadへcopyし、派生scope／receiptの2JSON計128KiB以下を作成する。追加uploadや架空の重み・PIDは入れない。A26は同5入力の15phase＋前後4対照、最大19応答・復元込み30分・一回。
- 全5の原文全欄・三raw・graph／公開全項目／線・概要・全文がrootと独立照合で適切な場合だけ、hash判定1file4KiB以下を追加しB26。同12記録の新12LEAF＋MERGEと前後4対照、最大43応答・復元込み17分・一回。期限内の全43完了は保証しない。

training scope SHA256 `1756ccd2c6e945e8d4d4a163c8507d6e884c0c27592690a905dcc25fb6a96daa`、evaluation template `5eedb3a61e2f7d68b86fe99860232cb62c6a80b9cbe51883afb0059270fa0da3`、transport manifest `8c59e2f43321d09ec05647119a1a9c98fe2a8dcf77ef8afc1a257cbe7cb602c4`。起動前に前回復元PID36492／start99185008とhelper／kernel／client／native／adapter／argv／env／cwd・healthを現物照合し、不一致では停止する。認証・全起動環境は同Pod内の停止／完全復元だけに一時再利用し、外へ保存しない。内部A9／B9引数は既存protocol名で、新A26／B26 once rootを使用する。旧FIT25／A25消費済み・B25条件不成立は不変。

### 通常反映と、閉じていない範囲

今回はRenderの直接service ID照会でAPI／worker双方の24bc228dbf54abc983906323c0ae7d937fae1fd6・Live／not_suspended／autoDeployOFFをfresh確認。Supabaseは38migration／最新20261115011424をfresh確認した。endpoint／認証／model往復／保存再読とworker期限のfresh照合は未実施で、metadata確認を通常接続成功へ換算しない。環境変更・配置・hosted SQL変更0。

準備原本・教材・review・容量・実CPU結果・確定packetは既存private継続資材の`resume_independent_scenes_fit26_prepared_20261117/`へ保存する。新しい学習・GPUの具体承認はまだなく、旧一回の許可を流用しない。適切な新全12実結果→同じ最終rawの一回SQL保存→別process非生成再読→既存native／mapとIF120u／natural／Piece／API・workerの認証・版・期限整合と通常反映まで、元単位を継続する。今回の教材準備・検査を商品品質credit・元単位閉鎖・補助全体完了へ換算しない。build／TestFlight／本人実機は保留のまま。

STRUCTURE_MAP_DELTA_NONE_PRODUCT_SOURCE：学習構成と既存trial部品の新しい一回の準備で、商品source／公開型／API／DB型／恒久ownerを追加しない。

<a id="analysis-node-local-bound-roots-v2-fit25-a25-actual-20261117"></a>
## 9.126 11/17 — FIT25の54更新とA25の全5件19応答を完了、全5意味不適合でB25条件不成立

Mashの今回の明示承認に基づき、§9.125の凍結17file **4,818,633byte**を同Pod xrplcoeb5ec77fへ送り、既存4file **118,409byte**をPod内copyした。全21memberのbyte／hashと既存generic trainerの一致を確認してから、FIT25とA25を各一回だけ実行した。API sourceはe58c1e49386b28c93a2c74adc6fc50d55ba20936、準備時docsは226670a98902eca7239f7406c320ada136a06899で、原5入力／全12材料・guard／凍結時刻・教材を変更していない。送付前のread-only確認で内側manifestの16memberと外側17fileの数え方を取り違えた箇所は、manifest自体の1fileを分けて確認した。凍結packetの変更・この確認による学習／生成は0。

### FIT25の実完了と学習後束縛

cached同4B／revision851bf6eをBF16で使い、configのみからfresh LoRA・fresh AdamWを作成、旧学習済みtensorを初期値へ流用せず、18group／54行を一巡・**54更新**完了した。学習前後に最短／最長の2行ずつ、計**4回のloss forward**を実施した。fit process563.814秒、元提供復元込み**592.4454757109052秒**で18分枠内。保存した112 LoRA tensor／3,833,856 parameterはF32・有限値で、別model loadのfresh reloadと完全一致した。optimizer／RNGの保存・resume・retry・部分採用はない。元120uはPID34442／start99056577へ復元し、別health200を確認した。

新weightsは `5b36fe0ab67456aea9d9daa6d22a7e0d55e9c52bf06ef8dbc45c54742a868a09`、configは `b1f2d89b964b9fa9990b5e59ec223296d29a153e3ed9ef1032693fae8a1de43b`。前→後の測定損失はPLAN0.1966548562→0.0929216072、長いNODES0.4837111235→0.4256798923。これは指定行のloss変化であり、可視意味改善・汎化・通常採用を証明しない。FIT25独立技術照合は全54更新／4計測・保存構成・限定scope差分に阻害事項なし。

完全54更新・保存reload112・元提供正常復元後の実値だけを固定templateへ束縛した。同Pod内で固定8memberをcopyし、派生2JSON計14,807byte（128KiB以下）を生成、新外部upload0。派生evaluation scope SHA256は `7fe32f736843877e29753e58dd180fe5968b89ed899617192498876b2883c18e`。原入力／source・教材・応答上限を学習後に差し替えていない。

### A25の受領完結と意味判定

派生scopeの同5入力へPLAN／NODES／RELATIONSを各一回、15phase＋Emlis／IFの前後4対照、**19応答**を受領した。全5mapは構造GENERATED、HTTP200／stopで図／全文へ到達。元提供復元込み**844.3319874260342秒**で30分枠内、retry・追加学習・raw事後修補0。Emlis／IF前後のHTTP bodyはそれぞれbyte一致したが、これは既存経路の限定再現性であり、これらの一般商品品質の合格ではない。

華恋と独立担当者は、それぞれ全5の原文全欄／metadata、三raw、private graphと根拠対応、公開全項目・線・概要／unknowns、全文を照合し、**全5件を意味不適合**と判定した。独立担当者の全5件の全文照合も完了し、全5件不適合で一致しました。構造完結を全5適合へ換算せず、現時点でB25の条件は成立しない。

| 実入力 | 保持した点と、残る不適合 |
|---|---|
| 読書会2日 | 後日の予約通知・本人確認・案内送信・一人返信／全員既読不明、本人の問い合わせ非関与等はfactで保持。一方、担当者へ確認箇所を伝えた行為を返信の送信へ変える派生表現、予約・本人確認・案内修正の順序の混同がtitle／線／概要へ伝播。線の両端にも含まれない修正送信をlabelへ使う |
| 購入前後の照明 | 条件・予備金額・購入・自宅試用・選択の満足を一部保持。保証として受け取らないという本人判断の否定を見出し／meaningで失い、安全上の使用中止と非購入決定の区別、購入後の調整、短期使用の限定、比較条件差を選定しない。概要は購入後点灯を述べながら該当nodeを参照せず、無関係場面結合と同文の重複も増える |
| 修理の伝聞／後日 | 完了連絡の確認と未受取／本人動作未確認、明日受取決定はfactで保持。しかし部品を取り寄せるという発言を取得済みとする見出し、端末が店にある所在を店へ連絡する行為へ変える見出し／線がある。弟の後日の相談状況・当日の非訪問選定も不足し、古い未確認を現在形のまま並置 |
| 応募取消 | 海辺の応募・受領から取下げ／取消完了への順序、山写真未送付を保持。取消後に再応募しない本人意向、旧受領メールと現在応募中の区別、友人へ取消未告知の対象差を落とす。申込画面を開かなかった否定も、画面を開く前という表現へ変わる。A24の曖昧な再応募見出しは出ないが、今回の全意味保持は成立しない |
| 手動10記録 | 10記録のカテゴリ・同時感情と強度／自己理解、学習時の理解の進展を保持。思考／行動を同じ出来事としてまとめず別nodeへ分けて12枠を使い、最後に別場面の複数記録を一unitへ詰める。人生のつらさ／今後未決定等が落ち、仕事の確認をほぼ全nodeへ同じ意味として接続する根拠のない反復線と偏った概要が残る。記録同時刻から時系列を捏造したとまでは判定しない |

表は本文非転載の論点要約で、完全な原文・実raw・全出力と個別根拠はprivate継続資材へ保全する。 独立全読記録a25_independent_meaning_review.jsonは25,914byte／SHA256 104cdc19b4fe487a707caa817bc40d933c0d82891333c89172ffb381a9e8027dで、原actualと15phaseへ束縛。private全40node／47unit／83固定根拠／20edgeを確認し、同記録role文脈の追加2参照はPLAN根拠と分けた。一部の旧誤文が出なかった点を認める一方、PLANの選定／結合と派生見出し・線・概要の新しい意味変異／退行もあるため、学習全体が改善したとは判定しない。v2概要順と再教授を同時に変えた候補であり、要因別因果・モデル一般品質はこの一回から断定しない。

### 元提供復元と原本保全

A25は元args／env／cwd・native／120u重みへ復元した。原本回収時の別読取2026-11-17T13:59:44.225343Z（JST22:59:44）と、最終14:06:18.443971Z（JST23:06:18）にPID**36492**／start**99185008**・health**200**、trial18008 listener停止、B25root不存在を確認。認証値／全起動環境の外部保存はない。FIT25とA25の一回は消費済み、**B25起動0・適合判定file送付0・新12LEAF／MERGE0**。未使用B25の43応答／17分枠を別A・追加学習・retryへ転用しない。

FIT25原本は25member／ZIP14,394,748byte・SHA256 `c4163759c1b8a771a79e15c30c10c7e57c688f587410179d7ddb2adf3618cae7`（新adapterを含む）。A25原本は17member／ZIP231,074byte・SHA256 `eb563053dcf204a38b120a2d62a3b53c6879b8d80ac6d2018536ff29848e7bb7`、actual result1,311,054byte・SHA256 `1ebf05fc675e1eb38db7d273310e246feae69a7f3285b241bd74c59edc1f717d`。両archiveのCRC・宣言member hashを照合し、無修補の三raw・原入力・scope・実行log・復元証跡を既存private引継ぎ `Cocolon_CMEE_A13_Continuation_20261116.zip` の `resume_fit25_a25_actual_20261117/` へ保持する。最初のA25回収処理がKilledで終了した原因は未確定。生成は再実行せず、段階表示を追加した同じ回収処理で原本を取得した。cgroup OOMの観測証拠はなく、OOMと断定しない。

### 教師と実生成の構成を原本で対比

全15phaseのsystemは、凍結ORDINARY教師の対応phase本文と一致した。18教師は最大4record／9nodeで、74非空fieldすべてに選定引用があり、139unit中で複数recordを同unitへ結合した例は0。教師のedgeは0〜4／最大接続次数2で、多数の独立場面を10record一括で構成する実演はない。A25のT01は19非空field中15を選定し、12node／13unitへ配置、末尾unitに別場面を結合し、12edgeすべてを仕事nodeの同一起点から張った。照明は12node／12unit、複数recordを同unitへ置く箇所が5ある。使用field数の一致も全文意味保持の代替ではなく、応募取消では全6fieldを使っても取消後の重要節が選定されなかった。

T01は3007／共有4096token、照明3167／4096tokenで全phase stop。今回token打切りはなく、T01のunitも13／最大24なので、12node上限だけが詰込みを強制したとは断定しない。全欄／別時点別unit／無関係結合禁止／関係なし／反復禁止は既に教示されており、教示不足という単純な説明もしない。NODESには正しいteacher PLAN、RELには正しいteacher registryを渡す学習文脈と、実PLANが誤選定・誤編成した後の条件差、および多独立場面の分布差を直接修復の検討対象とする。どの要因の変更が有効かを示す新比較は未実施で、新しいguardやfield使用率だけを意味合格へ換算しない。完全な対比はprivateのfit25_quality_cause_review.md／teacher_composition_review.mdへ保持する。

### 未完単位と次の直接修復対象

今回の限定実行は**不採用で終了**し、実全12、適切な同実rawの一回SQL保存・別process非生成再読、通常native/model identityとmap／IF120u・natural／Piece・API／workerの整合は未完である。§9.125の合成SQL成功を今回実rawの保存に読み替えず、SQL保存／hosted DB変更／通常設定・配置変更は0。通常API／worker24bc228d・DB38／20261115011424・worker900は前回確認記録の継承であり、今回fresh Live照会ではない。build／TestFlight／本人実機保留、商品品質credit・正式受入れ追加0、元単位／補助全体未完を維持する。

次の直接修復対象は、今回の実rawに現れたPLANの出来事・条件選定／別場面結合、教材の構成と実出力の対比、同じ根拠から派生する見出し・線・概要の意味保持である。同趣旨の禁止文を足しただけで改善とはせず、既存指示と教師にも対比／留保の正例がある事実へ戻る。新しい具体的source修正・追加学習・GPU試行は未準備／未実施。未実行B25や消費済みFIT25／A25を新試行の許可へ使わない。必要な商品能力の改善→適切な全12実結果→同raw保存再読→通常反映という元単位を継続し、記録確定を商品完成へ換算しない。

STRUCTURE_MAP_DELTA_NONE_ACTUAL_RESULT：本差分は既存v2の学習／実行・意味不採用の記録で、製品source／新owner／controller／公開型／route／DB型を追加しない。

<a id="analysis-node-local-bound-roots-v2-fit25-prepared-20261117"></a>
## 9.125 11/17 — 概要refs先決めv2と旧18教師の三段階再教授を準備、FIT25／A25・条件B25は未承認

> 以下は準備・公開時点の記録です。その後のMash明示承認、FIT25／A25実行、不採用とB25条件不成立は§9.126を正とします。凍結scope・準備値と当時の未実行状態を履歴として保持します。

§9.124のA24は今回46unit／74rootの対応を保持したが、自由生成の見出し／meaning／線label・概要refs選択に残差があり、4件意味不適合・応募取消表示修復要で通常不採用となった。正しいfact直前の引用を重ねるだけで直したとは考えず、既存三段階作者内の派生表現・内容選択を修復する別opt-in v2を準備する。原文／raw事後修補、引用固定見出し、新guardによる意味合格化は行わない。A24原本・不採用理由と消費状態、B24条件不成立は保持する。同節末尾のv2 PENDINGは当時の準備記録で、現候補と確定値は本節を正とする。

### 候補sourceと検証状況

profile `semantic_map.node_local.v4.bound_roots.v2`、alias `cocolon-qwen3.5-4b-analysis-node-local-v4-bound-roots-v2`、outer `cocolon.analysis.semantic_map.node_local.model.v4.bound_roots.v2`を分離した。内側PLAN／NODES／RELATIONSのv4 schema・NODES固定根拠再掲を保ち、v2だけRELATIONSの概要生成順を**node_refs→title**へ変更。既存指示・完成例とnative decoder順をそろえ、選択内容の範囲から概要を作る仮説である。参照順序だけで意味適合を保証しない。

候補[e58c1e49386b28c93a2c74adc6fc50d55ba20936](https://github.com/MassyuRed/mashos-api/commit/e58c1e49386b28c93a2c74adc6fc50d55ba20936)／tree47db96f2a6060c553b4a1f476ea0cd0a9c78a042は、parent e9046deeの既存製品5owner＋新test＋CI収集の計7pathで、remote bytes／head／parent一致を確認した。広域734成功＋重複しないnative alias4成功＝**738固有test成功、FAIL0／SKIP0**。旧v4／bound_roots.v1の各全5原本の15phase messages／request refs・raw構造採否はCPUで同一を照合し、意味不適合の再分類0。唯一realizer、全量source／rights・訂正cohort／guard、公開watashi.map.v3、SQL保存／月次当時版・RNを維持し、IFは元120uへ束縛する。

[Analysis CI44072901877](https://github.com/MassyuRed/mashos-api/actions/runs/44072901877)／[Piece CI44072901970](https://github.com/MassyuRed/mashos-api/actions/runs/44072901970)はともに同e58・attempt1・completed／success。Analysisの更新時刻2026-11-17T11:36:11Z、Pieceの更新時刻11:44:56Zを、rootが11:45:43.792Zのfresh個別取得で再確認した。成功receiptを確定し、追加dispatch／rerun0。CI成功は新実4Bの意味改善・通常採用ではない。共通packetの確定値は以下へ保存した。sealed CPUの54行・合成19／43応答境界と、同原12の新しい合成39phase／13aggregate一回SQL保存・別process非生成再読を下記のとおり確認した。draftを実行可能な最終版へ数えず、未確定CI／review／scopeは実行入口で停止前に拒否する。新送付／GPU・学習・A25／B25・通常変更0。

### 凍結共通packet（未承認・未送付・未実行）

新送付は**17file／4,818,633byte**、同Pod内copyは**4file／118,409byte**。内訳は既存controls／5input／full12.inputの原3file99,755byteと、既存generic trainer18,654byteである。4番目のgenericが同Pod内に同byte／hashで存在しなければ、追加uploadへ切替えず停止する。FIT25／A25／条件B25はこの共通packetを使い、後続ごとのsource／教材の再送や別版差替えをしない。

| 凍結identity | byte／SHA256 |
|---|---|
| training_scope.json | 44,679byte／`8d1a04ff2b4a48bd1ed09f4634fbaef6d01fdccda385da5076a3b5abedb6dbd6` |
| execution_scope.template.json | 12,292byte／`c6d72cb7ee3be2f33a83b282b1c26d7fd62383e4b75e16e572fe036bcb479541` |
| execution_packet.json | 9,362byte／`c87349db445d69dda1ce2078f01c93c8c2c283db89b413782204050db8304236` |

全17送付memberと4copyのbyte／hashはbody-free JSONのnext_v2.packetへ保持する。FIT25完全保存reload・元提供正常復元後の実weight／config・PID／start等に限定した派生**2file合計128KiB以下**と、全5独立全文適合時だけの判定**1file4KiB以下**を追加できる案である。現時点では派生実値未発生、GPU一回は未承認。合成SQL成功を実model rawの保存や意味合格へ換算しない。

### 凍結packetによるCPU・合成SQL保存再読（実GPU／postfit処理0）

凍結training scope8d1a04ff…に対し、54行／18groupのrow選択・既存encoder全token数・full-assistant／EOS loss AST・元120u configをCPU照合し一致。53行・phase重複・旧profile・更新順逆転は拒否した。trainer.preflight／train・once.mainは呼ばず、Podの固定pathをexact local payloadへ写すCPU用adapterだけを使った。Pod実path存在・GPU版／メモリ／勾配・学習完走・復元を実証したものではない。封印receipt SHA256 `6d74dc6d6b5b00ec5e1b500ea2d540fb1d15c311953d7e5d3712c97333cffdc4`。

同じ凍結eval template c6d72cb7…・transport packet c87349db…に束縛し、既存runnerのpreflight／acquireを合成loopbackでA25相当19HTTP／5map／15phase、B25相当43HTTP／13map／39phaseまで確認した。receipt SHA256 `012bef29f6e1a10d4e7cd4518e1232fcee1fb39466458dab31c516de49d2efa9`。source247blob一致を確認したが、実FIT report／weight／PIDを仮造せず、実postfit helper・model load／GPU・Pod・提供停止復元・SQL呼出し0。実GPUの意味品質や全12適合を先取りしない。

同原12記録・旧guard／凍結as_ofの既存SQL checkpointへ、新しい合成39phase HTTP原本／13aggregateをexactに束縛した。既存consumerで**1commit／1artifact／1月参照**を保存し、dump後の別processでcurrent／detail／month履歴の3serviceと`/self-structure/latest` HTTP200を非生成再読。ID・private根拠／三raw・projection／text／coverageと保存private evidenceの同一、再読SQL write0を確認した。旧SQL input／plan／checkpoint／receiptの4fileはbyte／hash不変。これは合成出力の技術確認であり、実4B rawの保存や意味合格ではない。model／Pod／学習／hosted DB／通常変更0、商品受入れfalseを保持する。

CPU最終summary3300byteのSHA256 `9d47db03c5d9fc09b903b37aa6d47174bae16bebee2addbba13a9c6bff840e98`、SQL final receipt6116byteのSHA256 `7b7516207e056ef2890d6325d7860f7ab044ad71ee8a46442dca0f680bd7675b`、別process再読receipt1504byteのSHA256 `90c1e0f4adb0964cf261b05b84240b9edfd00d7feb1fe3cb51b322166a66d67e`。凍結training scope8d1a04ff…・eval template c6d72cb7…・transport packet c87349db…へ同一に束縛されている。実FIT report／weights／PIDの仮造と実postfit helper実行は0。適切な新実全12・同実rawの保存再読と通常反映は引き続き未完。

最終結合reviewは5159byte／SHA256 `ec28043f4fb2ac2ca3e732c580dbc51cc029d79baaad01faef741a9551da2a5d`。上記54行・合成19／43・SQL非生成再読の全proofと、独立postfit contractの92 mock確認を結合し、CPU検証後も凍結21file（新17＋copy4）が不変であることを確認した。92 mockは実FIT report／学習weight／runtime PIDの仮造や実postfit処理ではなく、実学習54更新も0である。実GPUの可否・正常復元と意味改善は未証明のまま保持する。

### 旧18教師から54phaseへのtraining-only変換

全て架空の旧18source、**37record／74原欄**と既存v3教師のfact／title／meaning／unknown／役割・全根拠／edge／overview値を変えず、PLAN／NODES／RELATIONSの**54行**へ変換した。ORDINARY14・LEAF2・MERGE2。MERGE補助LEAFは旧教師を現文脈へ変換したtraining-context-onlyで、新model rawではない。原5評価・全12のrecord ID／完全な非空原欄は教材と重ならず、除外照合だけへ使用した。

全18原source・旧teacher・全54phase材料／target・全projectionと存在する16全文（2LEAFは本文null）を分担独立全文照合し、新変換の意味blockingなし。100node／139unit／205根拠／33edgeを確認し、別のJSON値照合でも原教師の完全再構成・元fields／records・phase間PLAN／registry／各hash一致を確認した。training_material SHA256 `54bc4bd0589f08c49497fc16dfdb6cc1cf327d1278ac6f58c653ebe39745e6eb`、validation SHA256 `14a7d7d8cb2cf4523681d839630a0f465bd6df4b5e44e64cf10da5f753235fb3`、独立review SHA256 `593a7fa8acba55245c75580436f87ca0a65cf59bb8d2492b79a548a7e0ff5567`。未公開版からの差分はsource_commit metadataだけで、これを戻すと旧全文byte hash66a46127…を再現する。hash／schema一致は意味品質の自動判定ではない。

旧教材には既に意味・時点／主体／未知の対比、L01／L02の非連続8refs概要の正例があり、教示不存在とは主張しない。B03／B04のmeaning再要約・表示重複、A02初日の非行動を別条件で再掲する重なりは継承する。最大4record・選択感情は全て平穏mediumで、10記録の異なるcategory／emotionや全12実品質の代わりにはならない。正しい前段を与えるteacher forcingは誤ったPLANへの頑健性を証明しない。**現三段階文脈での再教授と概要refs先決めを組み合わせた混合候補で、後の改善でも個別効果を分離できない。**

### FIT25と学習後の限定束縛、A25／条件付きB25の提案

- **FIT25：** 同Pod xrplcoeb5ec77fのcached同4B／同revision、BF16 baseからfresh LoRA・fresh optimizerを作り、旧学習済みtensorを初期値へ流用せず、54行を一巡／54更新一回。54更新に加え、最短／最長行を学習前後に計4回計測する（推論応答追加ではなくloss forward）。既存full-assistant＋EOS lossを維持し、新mask・切詰め・resume／retry・部分採用0。fit process780秒／work900秒／復元予約180秒、**復元込み1080秒（18分）**。全54完了後の保存と112 LoRA tensorのfresh reload一致・元提供復元／別health確認が必要で、現在実学習0。
- CPU容量は最大training sequence **9366token**、target **2292token**、一group三phase emitted合計最大 **3393token**。停止前に同tokenizerで全54を再測定する。旧FIT19 whole-process345.488秒からの単指標比例は約307〜595秒だが、新最大sequenceは旧比約1.206で、速度／メモリ・完走を保証しない。OOM／時間不足は停止復元し、短縮・再試行・部分採用をしない。1080秒の全体確認は復元後のelapsed assertionであり、任意のIO停止まで強制中断するhard alarmではない。
- FIT25完全完了後だけ、固定templateへ新weight／config hash、正常復元したPID／start ticks、復元証跡／学習来歴のhash・時刻を限定束縛する。現在evaluation scopeはtemplateであり、A24重みや旧PIDを新学習結果へ流用しない。派生2file合計上限128KiBは同Pod内で生成し、凍結した8memberも同Pod内copyだけでそろえる。学習後の追加外部upload0、原入力／guard／時点・source／教材・応答上限は変更しない。既存鍵／envは同Pod内一時認証と完全復元だけへ使い、値を出力しない。
- **A25：** FIT25の完全完了・保存reload・元提供正常復元を確認した後、同5入力×3phase＋前後4対照、**最大19応答・復元込み30分・一回**。旧A24の適否やrawを新応答へ付替えず、新全原文／三raw／全投影・図／全文をroot＋独立で読む。
- **B25：** 全5が独立全文照合で適切な場合だけ、判定hash1file4KiB以下を追加。同12記録12LEAF＋MERGE×3phaseと前後4対照、**最大43応答・復元込み17分・一回**。840秒の既存pipeline／work900秒内であり、全件完走を保証しない。自動起動・失敗後続行／retry0。

FIT25／A25／B25は**未承認／未送付／未学習／未実行・通常未採用**。A24は消費済み、B24条件不成立の旧枠を転用しない。通常API／worker24bc228d・DB38／20261115011424・worker900は既存稼働記録の継承、hosted SQL／通常設定／main配置変更0。適切な実全12→同じ最終raw一回SQL保存→別process非生成再読→通常native identity・map／IF・natural／Piece・API／worker整合まで元単位を保持する。build／TestFlight／本人実機保留、商品品質credit・正式受入れ追加0、補助全体未完。

STRUCTURE_MAP_DELTA_PRESENT_CANDIDATE_ONLY：既存5製品owner内の別v2 identityとRELATIONS概要順、既存test／CI収集だけ。新公開schema／DB／RN／framework／controllerは追加しない。A24実績body-free JSON内next_v2へ確定済みmetadataと準備状態を保持し、両CI成功とpacket凍結値を保持し、sealed CPUと合成SQL保存／別process非生成再読の最終値を保持する。

<a id="analysis-node-local-bound-roots-a24-actual-20261117"></a>
## 9.124 11/17 — A24は全5件・19応答を完了、根拠対応を保持したが派生表現に誤りが残り通常不採用

Mashの新しい明示承認に基づき、§9.123の新6file **3,214,698byte**を同Pod xrplcoeb5ec77fへ送り、既存payloadの不変3file **99,755byte**をPod内copyした。全9fileと現物identityを既存preflightで照合し、source e9046dee62eecc3e0b121dd20029892d3a95d1e2／tree0521abb6b5be89dcd4e3f1296d52268c8e11d058、同weights5a25／config45c0・原5入力／guard／時点を保持してA24を一回だけ実行した。新学習／retry／raw修補0。A23の旧rawを新応答へ付替えていない。

全5件がPLAN／NODES／RELATIONSを各一回、計15phaseと前後4対照の **19応答**で完了した。全phaseはHTTP200／stop・構造GENERATEDで、図／全文5件を生成。三phase合計tokenは読書会1954、照明2726、修理1265、応募取消1469、10記録2797で各4096以内。Emlis／IFの前後対照はHTTP body全文がbyte一致した。生成完結・対応保持と意味適合は別判定である。

独立構造監査では今回 **46unit／74 assigned root**の固定再掲とPLAN根拠が一致し、原入力・三raw・公開投影／本文の来歴を保持した。A23のようなunit間fact対応ずれは今回観測しなかったが、一般的な意味所有の保証にはしない。T01のn1／n2には、既存compilerが同じ原記録の役割context根拠を各1参照追加している。これはPLAN根拠の置換ではなく、全private根拠をPLANだけと説明しない。

| 実入力 | 全原文・三raw・全項目／線／概要・図／全文のroot＋独立照合 |
|---|---|
| 読書会2日 | 一つの原記録に属する材料を別記録とするmeaningを追加し、公開概要・本文へ伝播。意味不適合 |
| 購入前後の照明 | 購入前の店頭試用を購入後とする線のlabel。概要も購入後を述べながら該当後日nodeを参照せず、既知／未知・判断差の選択不足が残る。意味不適合 |
| 修理の伝聞／後日 | factが保持する非訪問を見出しで訪問へ反転。最新の未実施・別人の未確認の選択不足も残る。意味不適合 |
| 応募取消 | 取消済み・旧メール残存・再応募予定なしの主要意味は保持。見出しで再応募の否定が明瞭でなく、同じ受領事実の重複表示が残る。実行済み再応募の捏造とは判定しない。表示修復要 |
| 手動10記録 | 学習時の理解進展を迷いの進展へ変える見出し、原文にない執筆希望を加える概要、概要refsと選択対象の不一致、fact／meaning重複。意味不適合 |

以上から **B24の全5独立全文適合条件は不成立・未実行**。適合判定1fileも作成・送付していない。部分適合や構造成功を条件成立へ読み替えず、A24一回は消費済み、B24の未使用枠を別候補へ転用しない。実全12／39phase、実rawのSQL保存／非生成再読、通常反映は0である。§9.123の合成39phase／13aggregate SQL証明は合成として保持し、今回実rawの保存実績へ変換しない。

finally復元を含め **875.185216845秒**で元120u提供へ戻し、別読取で2026-11-17T10:46:49.354370ZにPID22555／start98086299・health200、trial18008 listener停止、B24root不存在を確認した。元args／env／cwd・native／両重みの復元証跡を保持し、認証値は公開しない。通常API／worker24bc228d・DB38／20261115011424・worker900は既存稼働記録の継承で、今回fresh通常配置確認や変更ではない。build／TestFlight／本人実機保留、商品品質credit・正式受入れ追加0、元単位／補助全体未完を維持する。

### 原本identityと次の最小修復準備

原本16member／ZIP228336byteと別runtime復元証跡を回収した。actual result SHA256 `e819e85f0b6f99bcf626715eb17d09c2745b76693c85102e5aa2df50fa20a33d`。凍結送付scope SHA256は `5c6aa9619d9d3b5ab3d525340f7b738888e68bb4f5f13d4fc9ed483af5c53067`、result内と値が同じcompact scopeのbyte SHA256は `7023cdc359a8b2310d78568ab9d5580a1bb9fe7bc47306d8ce04f0078bd75bf4`で、同じhashと扱わない。driver SHA256は `2897579899f9620d7dae0210afff553a8de1cd6ae5ee28737e4cdb623dfaf997`。case別raw hash・独立review来歴・消費状態は同trialの`node_local_bound_roots_a24_actual_20261117.json`へbody-freeで保存し、原本文を公開記録へ転記しない。旧§9.122／A23 trial・§9.123準備原本は保持する。

次は正しいfact直前の引用を重ねるだけでなく、既存三段階作者の自由派生表現・内容選択を直接修復するv2別opt-in候補をCPU準備中。RELATIONSで概要参照node_refsを先に確定してからtitleを生成する順序と、既存18架空教師の原source／teacher assertionsを三段階文脈へ変換するtraining-only準備を比較候補とする。既存教師にも意味・時点差・概要subsetの正例はあり、教示不存在とは判断しない。原5評価／全12を教材へ混ぜず、既存full-assistant／EOS学習ownerを利用し、新mask・guard増設・引用固定見出し・raw事後修補で意味合格化しない。

v2 exact source／教材hash／CPU検証／CI／SQL／packet／scopeは **PENDING**。この記録時点では新学習・新GPU承認／送付／実行・通常採用0で、準備完了や実改善を先取りしない。新しい具体的候補の比較で意味改善を確認し、適切な全12結果→同じ最終rawの一回SQL保存→別process非生成再読→通常native identity・map／IF・natural／Piece・API／worker整合まで同じ元単位で閉じる。

STRUCTURE_MAP_DELTA_NONE_ACTUAL_REVIEW：今回のA24実行・照合は既存5ownerの新変更を追加しない。v2の構造差分は確定source後に別途記録する。

<a id="analysis-node-local-bound-roots-candidate-20261117"></a>
## 9.123 11/17 — NODES本文直前へ固定原根拠を再掲する候補、実4B改善・通常適用は未確認

§9.122のA23全5原入力・PLAN／NODES／RELATIONS無修補raw・公開図／本文と独立全文照合から、PLANで選んだ引用を別nodeへ順送りするNODESの対応ずれを、既存作者の因果箇所として修正した。新しい作者・共通framework・checker／controllerを追加せず、同じPLAN→NODES→RELATIONSの固定三段階内へ別opt-in profileを置く。A23の全5不適合・B23条件不成立と、PLAN自体の異話題混在／未選択内容は保持する。この修正だけで全品質が直ったとは判断しない。

| identity／段階 | 候補の変更と保持する境界 |
|---|---|
| private選択 | profile `semantic_map.node_local.v4.bound_roots.v1`、alias `cocolon-qwen3.5-4b-analysis-node-local-v4-bound-roots`、outer `cocolon.analysis.semantic_map.node_local.model.v4.bound_roots.v1`。旧v4のmessages／原本を新候補へ遡及束縛しない |
| PLAN | 内側v4 schema・原fields全文・source duties・有効訂正・全量guard・cohort・原ID／引用を維持。一unitの既存1〜4根拠や複数record能力を一律削減しない |
| NODES | 各unitの先頭へassigned_evidenceを置き、e1等に当該PLAN根拠のsource_quote／source_fieldを固定再掲。その直後のsource_mode／fact／unknownsへ同じunitの事実を文章化する。native schemaは再掲する全引用値・欄番号と生成順序を固定し、admissionは当該PLAN全根拠とのexact一致を再検証する |
| RELATIONS／投影 | 完成したID→根拠→本文の台帳を使う既存方式。joinはPLAN根拠をそのまま使用し、assigned_evidenceは再掲metadataとして公開投影から除外。全三rawを保持し、原引用／本文／ID／線を事後移動・修補しない |
| 他core／公開保存 | IFは共有map設定が新aliasでも元120uへ束縛。唯一realizer、公開watashi.map.v3、SQL保存owner、月次当時版、source／rights・RNを維持。新公開型／DB migration／依存・通常selector変更0 |

候補sourceは[e9046dee62eecc3e0b121dd20029892d3a95d1e2](https://github.com/MassyuRed/mashos-api/commit/e9046dee62eecc3e0b121dd20029892d3a95d1e2)。既存製品5path（analysis_model_source／semantic_admission／native提供／intent_compiler／analysis_if_model_source）、新bound_roots test・既存alias test・Analysis CI収集の計8pathだけを変更し、parent809e9332・remote8path bytes／head一致を確認。[Analysis CI44058384005](https://github.com/MassyuRed/mashos-api/actions/runs/44058384005)／[Piece CI44058384077](https://github.com/MassyuRed/mashos-api/actions/runs/44058384077)は両方同commit・attempt1・completed／successを2026-11-17T10:03:11Zに確認。追加dispatch／rerun0。CI成功を新実4B品質の合格へ換算しない。

関連727件は209.96秒で全PASS、FAIL0／SKIP0、既存warning1。旧v4のA23全5についてmessages・request refのbyte同一と、原rawの既存構造採否をCPUで照合した。原rawの意味不適合を採用へ変更せず、新候補の実応答へ付替えない。固定根拠の再掲一致は構造上の対応だけで、fact／title／meaning・関係線の意味一致を機械的に証明しない。

固定tokenizer851bf6e／transformers5.19.0で、同5入力形状＋全12LEAF＋MERGEの18容量例をCPU測定し、全phaseの既存byte／32768context枠内を確認。MERGE合成例の入力最大30200tokenはRELATIONS時点で、残り出力枠674tokenとの計30874tokenが32768以内。三段階の出力例合計は3549token。compact raw＋EOSの再符号化を用いる容量例で、実modelの生成token再構築・新実4Bの品質／速度成功ではない。source全3回共通220秒・外側225秒・history840秒、三段階実出力合計4096tokenの残量引継ぎを維持し、実材料で各POST前にbyte／token再測定する。容量不足時にsourceを切捨てたり、失敗／length／取消後の後続生成・retry／fallbackへ進まない。

sealed CPUの合成39phase HTTP原本／13aggregateを、既存の同原12記録SQL checkpoint・guard・凍結as_ofへexactに束縛し、既存consumerで1commit／1artifact／1月参照を保存。dump後の別processでcurrent／detail／historyの3serviceと`/self-structure/latest` HTTP200を非生成再読し、ID／private根拠・三raw／projection／text／coverageの同一と再読SQL write0を確認した。旧SQLのinput／plan／checkpoint／receiptの4fileはbyte／hash不変。これは新候補の合成出力による保存／再読証明で、実4B rawの保存や意味合格ではない。model／Pod／hosted DB／通常変更0、商品受入れfalseを維持する。

今回の新GPU／model call／学習／実model rawのSQL保存／通常変更0。A23の一回は消費済み、未実行B23枠を次候補へ転用しない。

### A24／条件付きB24の確定packet（未承認・未送付・未実行）

同Pod xrplcoeb5ec77fへ新6file **3,214,698byte**を送付し、既存A22payloadの不変controls／5input／full12.inputの3file **99,755byte**を同Pod内copyする案を凍結した。候補247sourceはe9046dee／tree0521abb6b5be89dcd4e3f1296d52268c8e11d058へ固定。元入力／guard／凍結as_of・候補weights5a25／config45c0・元120uを保持し、追加学習／retry0。scope SHA256 `5c6aa9619d9d3b5ab3d525340f7b738888e68bb4f5f13d4fc9ed483af5c53067`、driver SHA256 `2897579899f9620d7dae0210afff553a8de1cd6ae5ee28737e4cdb623dfaf997`。全6memberのbyte／hashはbody-free候補JSONに保持し、CI成功とscope／payload一致を実runnerが検査する。

- A24：同5入力×固定3phase＋前後4対照、**最大19応答・復元込み1800秒（30分）・一回**。
- 全5の新実原文／三raw／全項目・線・概要／図・本文がroot＋独立全文確認で適切な場合だけ、判定1file **4096byte以下**を追加し、B24を手動起動する。部分適合や旧rawのreviewを流用しない。
- B24：同12記録→既存plannerの12LEAF＋MERGE×3phase＋前後4対照、**最大43応答・復元込み1020秒（17分）・一回**。preflight／起動／対照を含むwork900秒と復元予約120秒を分け、内部840秒を別枠へ増やさず、全件完走は保証しない。

sealed packetの実preflight／acquireを合成loopbackでA19HTTP／5logical・15phase、B43HTTP／13logical・39phaseまで確認。モデルload／学習／Pod接続・元提供停止／復元・意味合格ではない。PID19109／start97486258はA23復元時の履歴値で、今回のfresh live確認値へ扱わない。新一回の明示承認後も停止前に元process・argv／env／cwd・native／両重みと全送付memberを再照合し、不一致は停止前に中断。既存起動環境と認証情報の利用は同Pod内の一時認証／完全復元に限定し、値を表示・外部保存しない。finally復元と別health確認を保持し、消費済みA23／未実行B23を再利用しない。

次は同じ原5入力の新しい実本文・図を全原文／三raw／全項目・線・概要と独立全文照合し、適切な場合だけ全12実結果へ進む。その後も同じ最終rawの一回SQL保存→別process非生成再読→通常native identity・map／IF・natural／Piece境界・API／worker整合を、元単位の終了条件として保持する。PLAN混在・欠落の残差、実意味品質・全12・実同raw保存再読・通常反映は未完。通常API／worker24bc228d・DB38／20261115011424・worker900、build／TestFlight／本人実機保留を維持し、商品品質credit0・正式受入れ追加0とする。

STRUCTURE_MAP_DELTA_PRESENT_CANDIDATE_ONLY：既存5owner内のprivate固定根拠再掲・別profile／outerとIF選択をcurrent03／04・全体地図へ更新。source／rights・公開型／DB／RN責務は不変。body-free候補記録は同trial/node_local_bound_roots_candidate_20261117.json。旧§9.122とA23 trialは原本として変更しない。

<a id="analysis-node-local-v4-a23-rejected-20261117"></a>
## 9.122 11/17 — A23は全5件・19応答完了、固定根拠と本文の対応ずれで全件不採用

Mashの今回の明示承認で、新6file3,210,593byteをPod xrplcoeb5ec77fへ送り、A22payloadから不変3file99,755byteを同Pod内copyした。全9fileのbyte／SHA、元PID14681／start96402996、元native・両adapter・helper／kernel／client408fileを照合し、scope fe794470／driver74728ad8のA23を一回だけ実行。元入力5件・guard・時点・候補weights5a25／config45c0を保持し、学習／retry0。

全5件がPLAN／NODES／RELATIONSを各一回、計15phaseと前後4対照の19応答を受領し、全HTTP200／stop、図／本文5件・driver634.326905秒で完了した。各mapの三phase合計tokenは読書会1341、照明1939、修理983、応募取消1117、10記録1818で4096以内。前後のEmlis／IF対照はHTTP body全文がbyte一致。長文・10記録の生成完結は改善事実だが、意味合格とは分ける。

| 実入力 | 全原文・三raw・全項目／線・図／本文のroot＋独立全文照合 |
|---|---|
| 読書会2日 | n4.u1/u2へ別unitの確認・送信事実が流入。参加者への案内と一人の返信が、見出しで一人への案内へ狭まる。後日確認・送信は存在し、完全欠落とはしない。不適合 |
| 照明の長い前後記録 | 12node中複数で固定根拠とは別nodeの事実を出力。PLANが選んだ30分描画・限定使用感はNODESで保証書の本文へ置き換わる。関係線の説明も実端点と一致しない。不適合 |
| 修理完了連絡 | n3/n5の本文が固定根拠と入れ替わり、日付・感情文脈も誤結合。本人動作未確認と弟の相談状況の不明が落ちる。不適合 |
| 応募取消 | n6の友人へ取消未伝達の根拠に、n5の山未送信・再応募意向なしが流入。線の説明と実端点も不一致。取消済みを応募中へ戻したとはしない。不適合 |
| T01・10記録 | 広いID入替えで、片づけ本文へ仕事／会議担当、友人の不会へ趣味／強い喜び等が誤結合。PLAN最終nodeの異話題混在・不明／本人価値の欠落も残る。不適合 |

全原引用の範囲・byte・phase受領raw／hash・private phase_artifactと公開組立てを照合した。誤対応はNODES／RELATIONS原本に既に存在し、受信時のquote破損や表示だけの不具合ではない。固定n/uとplan hashが正しくても本文の意味所有を保証していなかった。複数引用を一unitへ置いた後、NODESが引用の事実を別nへ順に展開するずれが複数例にある。一方、PLANの異なる出来事のまとめ方・未選択内容も独立に残るため、NODES一箇所の変更で全品質が直るとは推測しない。

停止・元argv／env／cwd／元source・両adapterの保持復元込み696.135066秒、元120u PID19109／start97486258。別読取でhealth200・候補18008listenerなし・B23root不存在を確認。13原本ZIP210549byte／SHA25622746e877eb4548c6f3ddcefe5ca1480f1ca1629e17aab2f237257f0dd3eb2ae、最終result f9d7734048e07a30eadfa9424cda714b00b2acb31b96ca399f51814ff6051cb6を回収しCRC／result・native・driverのhash一致とscopeのJSON内容一致を確認した。private本文と全照合は既存A13引継ぎ一式のresume_a23_actual_20261117へ保持し、公開記録は同trial/node_local_v4_a23_actual_20261117.jsonのbody-free結果だけとする。認証情報の外部保存0。

全5適合条件が不成立なので、判定fileのPod追加／B23起動／全12生成／SQL保存／通常native・Render設定／deployは0。A23の一回は消費済みで、未実行B23枠を再試行へ流用しない。API809e9332は未採用のまま、通常API／worker24bc228d・DB38migration／20261115011424・worker900、build／TestFlight／本人実機保留を維持。通常反映を含む元作業単位と補助活用全体は未完。

次は全5原本に基づき、既存作者内でPLANの意味単位混在とNODESの根拠位置・本文対応を直接修復する。生成直前へ固定原根拠を置く案は未実装・効果未検証の候補で、同じ注意文を足すだけ・別unitの本文を事後移動する案は採用しない。追加GPU・追加学習・新実行scopeは未準備／未承認。primary outcomeはBLOCKER_NARROWED、商品品質credit0。STRUCTURE_MAP_DELTA_NONE：今回は実行・意味結果の更新のみで、製品source／公開型／DB／RN構造は変更していない。

<a id="analysis-node-local-v4-three-phase-prepared-20261117"></a>
## 9.121 11/17 — A22の誤結合に対する既存作者の三段階候補と、同5／全12の実行準備

§9.120のA22無修補partial、A19他4件の時点・他node借用、全体設計／全file地図・最新weekly・一般rule／既存incidentを再確認した。単純な時間延長では、無関係な根拠の混在、IDと線の内容不一致、同labelの四分類反復を直せない。既存semantic_admission／native作者／intent_compiler／model source内で、private候補semantic_map.node_local.v4を実装した。61回のnode／edge別生成案は採用せず、固定3回の**全体生成**である。nodeごとのKV文脈隔離や意味借用の機械的排除を成立済みとしない。

| 段階 | 作者の入力と確定内容 |
|---|---|
| PLAN | 元fields全文・既存source_duties・有効訂正・役割辞書から、明示n1…とunit根拠を先に配置。複数record根拠・訂正cohort・本人説明全文を保持 |
| NODES | 同じ原文文脈と確定planで、固定nN/uNへfact／資格／unknown／title／meaningを生成。根拠・unit数の再選択はしない |
| RELATIONS | 原文と、**実際に完成した**ID→根拠→本文の台帳から、from/to→label→relation_kindとoverviewを生成。関係なしの[]を許し、四分類を埋めるための反復を指示しない |

三つのraw／finish／messages hashと実native completion_tokensをprivate phase_artifactへ残し、既存v3形式へ構造だけを正確に組立て、同じ唯一realizerから公開watashi.map.v3を得る。本文／引用／ID／線の付替え、未完JSONを閉じる修補はしない。既存本人更新・Emlis source ID・訂正日時・cohort／提示fragment／source guard・source dutiesのUNASSESSED・月次当時版を維持する。共有設定をv4 aliasへ切替えてもIFは元120uへ写像する。旧v1／v2／v3 messagesの既定bytesは独立採取hashとの一致を確認した。

生成上限は**全3回の実出力合計4096token**で、nativeの実len(tokens)を差し引いた残量を次要求へ渡す。各回4096の3倍枠ではない。sourceは全3回共通の絶対220秒、既存外側225秒、history pipeline840秒を維持し、途中失敗／length／取消／期限／量使切り後は後続生成しない。3prefillの実費・時間と意味品質は未検証で、従来1回と同じ計算量とは扱わない。

候補source [809e933265718bd08260ef0728d7761f7f206554](https://github.com/MassyuRed/mashos-api/commit/809e933265718bd08260ef0728d7761f7f206554)／tree0b820fc1は製品5file＋test2file。remote全文・Git blob・変更path7件・親d610facbを確認した。関連13suite519件成功／FAIL0／SKIP0。[Analysis CI44042667381](https://github.com/MassyuRed/mashos-api/actions/runs/44042667381)／[Piece CI44042667399](https://github.com/MassyuRed/mashos-api/actions/runs/44042667399)は同commit・attempt1で成功。新reader／checker／controller／public API／DB型／RN型／依存は増やしていない。

固定revision851bf6eの3 tokenizer fileとtransformers5.19.0をCPUで使用し、A22同T01の同messages4703tokenを実GPU測定と一致させた。新5＋12LEAF＋MERGEの合成完成例を3phaseずつ測定し、既存32768context／message byte枠内だった。ただし実PLAN／本文で後段token量は変わる。実行時はNODES／RELATIONSの実材料を毎POST前に再測定し、原文を切捨てて枠へ入れない。モデル重みload・新推論・新学習0。

最終runnerを合成loopbackでA19POST／B43POST、論理5／13・native15／39に分けて実行した。Bはexact型の既存model sourceを使用し、誤ってlegacy60秒へ入らない。development指定は隔離driverだけで元provider／復元環境へ入れない。最初のCPU実装では旧件数条件・環境前提・subclassによる誤timeoutを独立reviewで発見し、修正後の最終版を再実行した。無修補39phase HTTP原本→同13aggregate→同UUID／public／本文／privateをreplay照合し、既存SQLへ一回保存・dump・別processの非生成service／HTTP200再読を確認した。別2record合成でもUnicode escape／空白の綴りを持つ三rawをSQL後に完全保持し、明示月を含む4scopeを再読した。いずれもCPU_SYNTHETICであり、実4Bの全12適合・商品品質・通常DB保存を増やさない。旧SQLのdetail既定limitではUNION ALLによる同ID重複を観測し、内容一致とは別の既存制約として保持した。

### 次のA23/B23の具体scope（未承認・未送付・未実行）

同Pod xrplcoeb5ec77fへ新6file **3,210,593byte**を送付し、A22 payloadから不変controls／5input／full12.inputの3file **99,755byte**をPod内copyする。scope SHA fe794470ef4fac258423ba5421b1e79a5f75243456ad5f5118674daf2ab9b1bd、driver74728ad8、source247fileのZIP fef42e6d。元入力／guard／凍結as_of・候補weights5a25／config45c0・元120uを保持し、追加学習／retry／新weights／SQL自動保存0。

- A23：同5入力×3phase＋前後4対照、**最大19応答・復元込み1800秒・一回**。
- 全5の実全原文／三raw／全項目・線・概要／図／本文がroot＋独立全文確認で適切な場合だけ、既存形式の判定1file **4KiB以下**を追加しB23を手動起動。旧raw／消費済みA22承認を転用しない。
- B23：同12記録→現plannerの12LEAF＋MERGE×3phase＋前後4対照、**最大43応答・復元込み1020秒・一回**。作業900秒にはpreflight／起動／対照も含み、内部840秒が丸ごと別枠で保証されるものではない。上限まで完走する保証はない。

PID14681／start96402996はA22最後の復元確認値で、新しいPod現況確認済みとは扱わない。停止前にlive cwd・元native／両重み・既存helper／kernelを確認し、停止直前にlive /procのticks／argv／envを再照合し、不一致ならモデル／提供停止前に止める。既存鍵・全起動環境は同Pod内の認証／復元だけに使い、外部保存しない。finally復元と別health確認を継承する。

通常Render API／workerは今回fresh読取でともに24bc228d・Live、DBは38migration／最新20261115011424。今回の通常配置／hosted SQL変更0。適切な全5→全12の**新実4B結果**→同じ最終rawの一回SQL保存→別process非生成再読→native alias／map-IF境界／自然-PieceとAPI-workerの整合した通常反映を閉じる条件は未成立。build／TestFlight／本人実機は保留。元単位／補助全体／正式受入れ未完を維持する。

STRUCTURE_MAP_DELTA：既存5製品owner内のopt-in private3phase経路をcurrent03／04・全体地図へ記載。公開owner／型／source権限は不変。primary TECHNICAL_CREDITのみで、実4B品質creditは0。

<a id="xrpl-a22-actual-author-coherence-blocker-20261117"></a>
## 9.120 11/17 — A22は容量境界を通過、関係反復・端点不一致とlengthで不採用

Mashの新5file2,963,450byte・同Podcopy4file375,167byte、同重み／同T01＋前後対照、最大5応答・復元込み600秒一回の明示承認を受領。xrplcoeb5ec77fの元PID13620／start96015493・health200とonce root不存在を確認し、全9file3,338,617byte・scopeeebf53ae／driver72ffd688を照合してA22を一回実行した。候補API d610facb・診断native6425b98d・5a25／45c0を保持した。最初の端末入力は改行欠落で未完入力となり、構文エラーで終端してから一行の同内容precheckへ修正した。本体起動・model／提供変更より前の入力不良であり、A22の再試行ではない。実launcherはPID14318。

### 取得・復元の実績と限界

実際は前対照2＋T01の3POST／3HTTP。前対照は200／stop。T01は210.134735965秒でHTTP200／finish_reason=length、途中raw8,106文字／13,584byteを受領して停止した。後対照0、完成JSON／admission／図・本文／保存は0。原本rawを閉じる修補や、長さ拒否を成功へ変換しない。

復元込み332.103563702秒で元120uへ戻し、別読取でもPID14681／start96402996・health200、元native eec418d3・元model一致、試行alias不存在、18008閉鎖・B19root不存在を確認。元argv／env／cwdと両adapterはdriver内の復元照合を通過した。原本ZIP63,989byte／SHA4c3824b78edaa1366987b17b9b20a127a0bdfb8c499bd26d0e135c2daaea7cb4は13data member＋manifest。CRC・全byte／SHA、resulthash1a154e1a、rawhash7c27c840、scope／driver／native／messagesの束縛をrootと独立read-onlyで確認した。private原入力・途中raw・prefix・credentialをpublic GitHubへ転記しない。A22一回は消費済み、残2応答は再利用しない。学習／retry／B19／SQL／通常変更0。

### 実partialが示した作者の残件

完全なnode12件は全10recordを参照し、D21の未参照record1・10で続行不能となった境界を通過した。これは構造的境界の確認で、全欄・全意味の保持ではない。19field中18参照で写真の行動field6は未参照。n12は学習行動・片づけ・選択基準の3recordを混在させ、題・meaningから学習行動を落とした。完成edge29件と30本目途中があり、overviewはまだない。

29edgeすべてがn1起点で、7端点組が同じlabelを4種のrelation_kindへ反復した。n11に日記／予定、n9に恋人との夕食、n8に友人の予定変更、n7に学習の悔しさを記したlabelが付き、実際のnode内容と一致しない。同じ事実の言換えではなく、関係選択の根拠不足と端点ID／内容の誤結合である。独立全文確認も同じ不採用判定だった。時間期限に達する前に既に不適合な内容が確定しており、単純な期限延長を次の一回として提案しない。

### 次の既存ownerと、未採用の分割案

既存作者の局所根拠→node構成、実端点ID／根拠→関係選択・文章化が次の因果箇所。receiver／compilerでpartialを閉じる、edgeを付け替える、ラベルや注意文だけを足す、新checkerで全面非表示へ逃がす方法では元単位を閉じない。A19他4件の時点・局所根拠・関係線の不適合も継承する。

現native generateは全材料を一度encodeして単一model.generateで全node／edgeを書く。既存の局所生成phaseはなく、根拠／時点を選んでから文脈を分けてnode／edgeを作文する案は小さな切替ではない。真に分離する場合、選択1＋node12＋edge48で最大61生成単位となり得る。追加callやKV／token負担を現在の一回承認へ隠して含めず、効果も未実証とする。既存semantic_admission／native作者／intent_compiler内での候補であり、新controllerや恒久gateを増やす案ではない。分割実装・採用・新GPU承認は0。次のGPU packet／scopeは未準備。

通常API／worker24bc228d・Liveは04:55UTC、DB38migration／最新20261115011424は05:25UTCの最終確認値を継承。後続Render読取失敗によるfresh未確認を解消したとはしない。今回の通常配置／SQL操作0。適切な全5／全12の新実結果、同最終raw一回保存・別process非生成再読・通常DB／API反映は未成立。元単位／補助全体／正式受入れは未完、build／TestFlight／本人実機は保留。primary BLOCKER_NARROWED。STRUCTURE_MAP_DELTA_NONE（製品source・公開契約の新変更0、実観測と残件の更新）。

<a id="xrpl-d21-actual-capacity-repair-a22-prepared-20261117"></a>
## 9.119 11/17 — D21実失敗のCPU再現で原因確定、既存parser容量修復とA22準備

MashのD21明示承認に従い、新2file50,933byteを同Pod xrplcoeb5ec77fへ送付、既存7file3,264,431byteをPod内copyし、全9fileのSHA照合後に一回実行した。scope218483af、同5a25／45c0・同T01・前後対照・最大5応答／復元600秒を保持した。前対照2は200／stop、T01は109.230041742092秒で503／ValueError semantic_free_text_tokens:81。実3POST／3応答で停止し、後対照0・raw／図／本文なし。学習／再試行／B19／SQL／通常変更0。

復元込み229.74460114294197秒、元120uのPID13620／start96015493・別health200、元model／native／adapter、試行alias不存在、18008閉鎖・B19root不存在を確認した。private失敗capture35,904byte／SHAa879142b60a8e3a8f89ac828418e3d8dfa7ae3ff793e0df8ccd91273733cc40cを保全。6326token（prompt4703＋generated1623）を同じ固定LMFE/tokenizer/configでCPU再生し、全先行tokenの合法性と最後の許可token0を23.909978862秒で再現した。重みload・追加推論・CUDAなし。上流の許可集合が既に空であり、free-text filterによる消去ではない。

実prefixは12nodeを完成したが、10記録中record1・10が未参照。node上限12で次のcommaが拒否され、全source被覆条件で終端array closeも拒否される組合せが原因だった。型・時間からの推測ではなく実token列と同sourceの再現で結合した。原本ZIP66,826byte／SHA1fc7fe5eb5f88b819b9ffaa745942f4148a582bc33e7d4f77e9a6ffcbe41dd40、15data member＋manifestのCRC／全byte／SHAを照合。result4d4fd22b・CPU report3b6b9e50・private原token列を分離保全し、public GitHubへsource入力／prefix／credentialを転記しない。D21一回は消費済み。

### 既存parserの修復と確認範囲

API PR3候補d610facb9d162a74bc57ef6323b7499f68d0ef1eでは、既存serve_emlis_natural_reply.pyの_semantic_unique_json_schema_parserだけを修復した。残りnode×unit×evidence容量を既存の上限12／2／4から計算し、未参照recordを収められなくなる直前にevidence／unitsの早いcloseを拒否し、必要な時だけ次の根拠候補を未参照recordへ絞る。余裕がある段階の重複参照・複数record nodeは保持する。schema・上限・全被覆条件・model／decoder／messages／HTTP・旧v1／IF／Pieceは不変。raw修補・EOS挿入・制約緩和はない。

固定LMFE commit817f944fcc8851917c40300a47f62d1defc3ffc3で関連5suite247件成功／skip0。新10caseは未参照数1／2／4／5／8、evidence／units close、容量直前の根拠選択と初期重複許可、13／24record、decoder分岐の独立を確認した。旧parserで新回帰2件の失敗も確認。実12node値をJSONの綴りだけ正規化した別CPU構造検査では、修正版が行き止まりより前のcloseを拒否し合法commaを残す。これは原token列の再生成・完成rawの修補や品質適合ではなく、合成の構造検査である。製品source1file＋既存test1fileのremote blob／変更path2件を照合し、[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44023489173)と[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44023489170)は同commitで成功した。

### A19他4件を継承する理由と次の意味owner

独立read-only再確認では、読書会n6のmeaningがn2の返事待ちを借用、照明n4が購入前を後へ変更しn7が電源を抜いた対象を移動、U01が過去の未確認を現在へ戻し、U02の線e2／e3が両端以外の完了を借用していた。いずれも無修補rawに既存であり、表示投影の新失敗ではない。現intent_compilerは引用・所属・形を照合して投影する一方、意味はUNASSESSEDを残す。これを合格へ読み替えない。次の作者改修候補は、既存owner内で根拠・記述時点の選択と局所作文を分け、node説明をその根拠、線説明を両端根拠に限定して実現すること。追加call／費用を伴い得る候補設計であり、未実装・改善未確認。注意文追加だけ、raw自動修補、誤出力の全面非表示で元単位を閉じない。

### 次のA22：修正版で同じT01を一回だけ実生成する候補

新5fileはcurrent_api_sources.zip、source_manifest.json、diagnostic_preparation.json、verify_t01_capacity_once.py、diagnostic_scope.jsonの計2,963,450byte。D21 payloadのcontrols.json／full12.input.json／full12_pre_acquisition.plan.json／input_cases.jsonの既存4file375,167byteを同Pod内copyする。全247sourceのうち既存native parser以外246fileは同一byte、同T01の依頼／messages、原入力／guard／as_of／重みは保持する。scope SHA eebf53ae09ee47cce753c53b2407fdb76752bd64031ff3dfb6f4d88268aaf25f。最大5応答（同T01＋前後4対照）・復元込み600秒一回、学習／再試行／B／SQL／通常採用なし。新しい個別承認前、未送付／未実行でありD21の残枠は使わない。

通常DBは05:25UTCのread-only確認で38migration／最新20261115011424のまま。通常API／worker24bc228d・Liveは04:55UTCの最終確認値で、05:25〜05:26UTCのRender読取2回はInternal errorとなりfresh状態は未確認。今回の配置操作は0。A19他4件の時点／局所根拠／関係線の不適合とB19未成立を維持する。A22がT01で成功しても、全5適合・全12・同最終raw保存／別process非生成再読・通常DB／API反映へ自動換算しない。元単位／補助全体／正式受入れは未完、build／TestFlight／本人実機は保留。primary TECHNICAL_CREDIT（再利用可能なparser修復／CPU回帰／source反映）、商品品質creditは増やさない。STRUCTURE_MAP_DELTA_NONE（既存parser内部修復、公開契約・owner・DTO不変）。

<a id="xrpl-d20-actual-d21-prepared-20261117"></a>
## 9.118 11/17 — D20の実例外位置、CPUの行き止まりと、失敗prefixの再構成準備

Mashから§9.117の新2file47,841byte・同Pod内copy7file3,264,431byte、同じ重み・同じ失敗入力と前後対照、最大5応答・復元込み10分一回の明示承認を受領した。xrplcoeb5ec77fのPID11827／start95478605・health200、新root不存在と全9fileのbyte／SHAを照合してD20を一回実行した。新学習・再試行・B19・SQL保存・通常変更は0。

実際は前対照2＋T01の3POST／3HTTP。前対照は200／stop、T01は102.532154727秒で503／generation_unavailable、raw・finish reason・図本文は未取得、後対照は未実行。実例外ValueErrorの最深位置は診断nativeのsemantic_free_text_tokens:81（元sourceも同じ81行）で、最終allowed listが空になった箇所と一致する。上流allowed集合が既に空だったのか、invalid／free-text filterで空になったのかは区別できない。直前の定期記録は1536token時点のUnionParser／other／allowed51であり、失敗時の正確なprefixやtoken数ではない。OOM・timeout・token上限等を原因と断定しない。

元提供復元まで217.382323316秒、元argv／env／cwdと両adapterの不変をdriver内で照合。別読取でもPID12816／start95872254・health200、元model／native・map試行alias不存在、B19root不存在を確認した。原本ZIP56,031byte／SHA891556263a356dfc9da4985c8232ff238f6fff68b3ef39e7f2ea036d34842f65は12member＋manifestで、CRC・全byte／SHA・result944bba25・D20 scope6c53aefa／driver6dfca45f／nativecdf76dd2を回収照合した。独立reviewでも同じ結論。D20の一回は消費済みであり、残2応答枠を再利用しない。

追加model呼出しなしのCPU確認では、同じnative／既存LMFEで架空2recordのうち1recordだけを参照する12nodeの構文prefixを進め、追加の「,」も終了の「]」も許可されず、残る文字は空白4種だけになる状態を再現した。原本305byte／SHA3d62a7af987494c0d83815d6bbaf8345b7ff95a704fad536d1c7ee2d395fccb0。これはsource coverageとnode上限が行き止まりを作る別CPU実証で、D20の実失敗prefixとの結合は未成立。filter解除・EOS挿入・受理緩和で成功へ置換しない。

### 次のD21：同じT01の失敗prefixをprivateに一度保持し、CPUで再構成する

既存D20 driverのprovider内で既存filterを一回だけ呼ぶ観測wrapperを追加した。元の成功返却値・元例外、nativecdf76dd2、生成・parser・decoder・重み・依頼・復元関数は維持。失敗時だけfictionalなprompt／途中出力のtoken IDsと件数を最大262,144byteのprivate fileへ排他的保存し、source本文・prefix・credential・argv／envをlogへ出さない。保存失敗でも元例外を再送出する。CPU再構成に実重みや追加生成は不要。10項目のCPU確認と独立reviewを通したが、実失敗prefixの取得・原因確定・品質改善はまだ0。

| 内容 | 固定した範囲 |
|---|---|
| 新規送付候補 | diagnose_t01_prefix_once.py 38,425byte／SHA4e6706905ca60e67a2a2867b9222ec3f2dad04f4b3ba5b8e19e7375377cf5eee、diagnostic_scope.json 12,508byte／SHA218483af8df917e9dc6f18dafcdd786bf269516d3a830c6e017b2132108e76f5。計2file50,933byte |
| 同Pod内copy | D20 payloadの既存7file3,264,431byte。新送付には加算しない |
| 実行候補 | 同5a25／45c0、同T01、前後4対照込み最大5応答、復元込み600秒、一回。学習／再試行／B／SQL／通常採用0 |
| 状態 | 新しい個別承認前、未送付・未実行。D20実行済みroot・scope・残枠を再利用しない |

2026-11-17T04:45:44.829Zのfresh通常確認でもAPI／worker双方24bc228d・Live・autoDeploy OFF、DB38migration／最新20261115011424。今回変更0。A19の4件の時点／局所根拠／関係線の意味不適合を診断成功で取り消さず、B19条件不成立を保持する。適切な新全5／全12実結果、同最終raw一回SQL保存、別process非生成再読、map専用aliasとIF120u／natural／Pieceの境界を保つ通常反映は未成立。元単位・補助全体・正式受入れは未完、build／TestFlight／本人実機保留。primary BLOCKER_NARROWED。STRUCTURE_MAP_DELTA_NONE（製品構造・公開契約は変更せず、試行観測と現在状態のみ）。

<a id="xrpl-restore19-actual-20261117"></a>
## 9.117 11/17 — 新Podの実復元・18教材36更新とA19不採用、T01の未記録例外から継続

§9.116の確定33file／21,779,197byte・scope `0511b114b8202194a091d8183768d32c2fa895f7c89ea1fc8d79e870eaa2883e`に対する具体承認を受領し、同Pod xrplcoeb5ec77fへ送付・全byte照合後、段階ごとに実原本を確認して各一回を進めた。§9.116と以前の準備・旧5mk接続不能の履歴は保持する。旧Pod用16file／scopeb5bd60f7が未実行だったこと、FIT18／A18消費済み・B18条件不成立を、新19の成果へ付け替えない。

| 段階 | 実際に成立した範囲 | 成立していない範囲 |
|---|---|---|
| RESTORE19 | 299.24121572298463秒で元4B／default120u提供を確立。実PID1111／start95238372・health200、固定公開base・新kernel proof82696a4e・helpera1a3b610・runtime capture137cd120とFIT bound scope95a51738を独立照合 | 応答0・学習更新0で、復元を本文品質へ換算しない。PID1111はFIT前の時点 |
| FIT19 | 18件×2周36更新を345.488秒で完走、元提供復元込み372.94514700898435秒。36連続stepと有限loss／gradient、fresh base／新LoRA・新AdamW、旧learned weights未読、保存再load tensor一致、configの意味一致を独立確認。復元PID9327／start95332524・health200 | 応答0・通常採用0。途中18更新を採用せず、学習完走・loss低下だけで実意味改善を認定しない |
| A19 | 同候補で前対照2＋同5分析の7POST・7HTTP応答。先4分析はHTTP200／stop／GENERATED、T01は108.38382733799517秒でHTTP503 generation_unavailable。実行結果INCOMPLETE_NOT_ADOPTED、model再試行0 | T01のraw／finish reason／図本文なし。後対照2件は未実行で前後全文一致は未確認。4件の形式受付を意味適合へ換算しない |
| 復元・B19 | A19全体605.4548653420061秒で元120uへ復元。別読取でPID11827／start95478605・health200、元argv／port／同Pod鍵・kernel保持とB19root不存在を確認 | 全5適合の条件は不成立でB19未実行。未使用2応答枠を再試行に流用しない |

FIT19候補はweights `5a25a1429a823bfac55ada102384a27b869b72503283e26fe87dee012706af53`／config `45c08258bc83b69aa5f6a9bad852e60db43b1d788c61c71f9480481081b64b2e`。API source `5af8625599aa80f90c983cdec34144e88a133d1e`・native d502b3c5、教材59978e6c、同5／全12原入力・guard／as_of／SQL取得前checkpointを保持した。post-FIT A19 scopeは `aabcac2555c36f275b57ceab4cdda08a57ece9231b579bda7fbaea23d5d4417c`。RESTORE原本ZIP8c08e6b4／11member、FIT原本ZIP02c4d819／11member、A19原本ZIPd7f8835b／12memberを回収照合し、A19 result SHA9cbdbdeeを正本とする。後から加えた独立reviewは元ZIP member数に加算しない。

最初のoperator呼出しでは、起動引数のhash2文字を逆に転記し、scope照合の入口で停止した。unit root不存在・HTTP要求0・提供変更0を確認し、原scope・実重み・実行codeが不変であることを回収照合した後、引数だけを訂正してA19本体を新rootで一回実行した。誤引数の元logと原scopeの双方をprivate引継ぎへ保持し、履歴を消さない。

T01で観測したのはHTTP503とgeneration_unavailableであり、既存native handlerがbounded要求では例外をHTTP503へ集約して既存generation_failureを呼んでおらず、型・発生箇所・原因は未確定である。108.383827秒という経過時間だけでnative timeout、CUDA OOM、生成token上限、parser failure等へ断定しない。A19一回は不採用で終了したが、意味品質・同raw保存再読・通常反映を含む元作業単位を完了とはしない。

### 次の限定D20：同じT01の既存failure locatorをboundedでも使う

既存native `make_handler` のexceptで既存 `generation_failure` を囲んでいた `if not max_requests` ガードだけを外す固定1block変換を用意した。bounded要求でも既存locatorを呼び、型・発生関数・行番号・monotonicだけをlogする。例外message・source・prefix・credential・rawは出さず、元のHTTP503とbodyを維持する。生成関数そのもの、parser／decoder、provider／main／lifecycle等の他native関数AST、他246sourceのbyteは変更しない。これは診断用native変種であり、API Git source5af・モデル・重み・依頼内容を修復した実績ではない。

| 確定内容 | D20の範囲 |
|---|---|
| 新規送付 | driver `diagnose_t01_generation_once.py` 35,674byte／SHA 6dfca45fe3b0dba325ab56863836ea0ec8c326133b10109fb4a301c1010506d3 とscope `diagnostic_scope.json` 12,167byte／SHA 6c53aefab04d56b076d1ff132c09f9ab30abc7950e82766754ee523e2bee10af。計2file／47,841byte |
| 同Pod内copy | 既送付A19 payloadから7file／3,264,431byteをcopyして照合する。これを新たな送付byteへ加算しない。全9fileは3,312,272byte。診断native cdf76dd2bab1523d6532c304b67eb2e01776837c8bb0542d43926eab9be71a09 は既存source native d502b3c5から同Pod内で作る固定変種で、第三の新規送付fileではない |
| 同一条件 | 新36更新5a25a142重み／config45c08258、同T01のrequest・messages・wire。実際の生成内容やHTTP結果を変えるpatchを混ぜず、未観測の型・発生箇所を観測する |
| 一回の実行 | T01一件＋前後4対照の最大5応答、元提供復元込み600秒／10分、一回・再試行なし。新学習0・B19／全12生成0・SQL0・通常変更0 |
| 現在の状態 | 新しい個別承認前。D20の送付・実行・実例外型取得0。A19の未使用応答枠・旧18／19 scopeの許可を流用しない |

CPUではlocal fake HTTPのoriginal／診断variant各6要求・計12件でstatus／bodyの一致、同じ生成引数と最大5呼出・6件目429、成功・生成例外・handler完了型不整合、既存locatorの型・発生関数・行番号・monotonicだけのlogとmessage／source／prefix／credentialの非出力を確認した。実T01 request／messages／wire、全copy／hash、生成関数を含むnative他関数AST・他246source byteの保持も照合した。これらはfake generatorのCPU結果であり、実T01の例外型・原因解消・本文改善・通常採用を証明しない。D20は既存wrapper／handler内の観測範囲の最小修正であり、新教師・新学習、同じ禁止文の追加、raw修補、受理条件緩和、新shared controllerは選んでいない。

通常API／workerは2026-11-17T03:59:59.815Zのfresh照会でも双方24bc228d・Live、DB38migration・最新20261115011424で、変更0。autoDeploy OFFは既存状態を保持。今回のSQL保存・別process非生成再読・通常変更0。適切な全12の同最終raw一回SQL保存→別process非生成再読→map専用非base aliasとIF120u／natural base／Pieceの境界・API-worker同版を保つ通常反映、通常から実modelへの到達確認が残る。適切な新全12実結果を成立させた後、通常反映まで継続する。元単位・補助全体・正式受入れ未完、build／TestFlight／本人実機保留。STRUCTURE_MAP_DELTA_NONE。第11回§5の主枠と三中核のownerを変更しない。

### 無修補raw・図本文の意味確認と採否

final result9cbdbdeeに結合したroot評価と独立全文評価は、取得できた4件をともにNOT_ADEQUATEとする。T01はraw未取得なのでNOT_OBSERVABLEと分ける。bookはprefixとfinal callの完全一致、U01／U02はfinal bindingsの再照合を確認した。

| 対象／raw SHA先頭 | 改善・保持された範囲 | 残る不適合 |
|---|---|---|
| 読書会／ef486cfd | A18にあった、写真から二階を想定したことを実際の二階→一階の部屋変更へ昇格する創作は消失。一階予約完了、参加者への送信、一人の了解、椅子問い合わせ状況の未確認、来週未開催は保持 | n6 title／meaningが、自身の非関与＋予約連絡のunitsにない返事待ちを別nodeから借用。本人が返信の写しを読み部屋・開始時刻を確認して修正送信した流れも弱く、全員既読の具体的な不明は本文へ残らない |
| 照明／0a1bf219 | 購入・帰宅後の取付け／配線調整・三十分の描画を保持し、A18の一時間半の創作は見当たらない。完全同一3nodeによる前回の形式拒否も起きず図／本文まで生成。ただし意味適合とは分ける | n4は購入前の条件確認を購入後へ変更、n7は古い照明の電源を抜いた行為を窓際の机へ誤接続。n10／n11は別の日の勧奨と購入後発言を同unitへ混在。n11は1unitなのに別unitを述べ、保証にしなかった本人判断をunknownへ置く。e5／e15等のlabelも実際の両端外を参照 |
| U01修理／f6653a11 | 修理完了の連絡を読んだことと未受取、弟の別相談・状況不明、翌日の受取予定を保持 | n3が初日の未確認を過去時点へ限定せず現在形で残す。n1→n3 labelがn3にない受取未実施を借用。n4 titleの店への電話は端末所在を電話連絡とも読める表現だが、主不採用理由は前2点 |
| U02取下げ／8b7b0ac6 | 海辺の写真の応募・受領、取消完了、旧受領メールを現在の応募中へ戻さない判断、再応募しないfactを保持 | n2→n3 labelは応募完了を、n3→n4 labelは取消完了を、実際の両端外から借用。n6 titleは再応募しない否定意向を明示しないが、この見出しだけを不採用理由にはしない |
| T01 | HTTP503を受領 | raw・finish reason・図本文がなく意味採否を作らない |

空meaningやunknowns=[]、選択的省略、反復だけを一律の新不合格規則にはしていない。主な不適合は、実際の局所根拠とtitle／meaning／edgeの対応、時点、否定、対象の誤りである。18教師と現lessonには時点・確認範囲・理解更新・実交換の正例が既にあり、明確な誤教師や番号変換bugは確認していない。今回を一般ルール不足と断定して禁止文や学習を追加する判断はしていない。4件GENERATED／学習完走を商品改善や通常採用へ置き換えず、A19候補は不採用・B19条件不成立とする。

<a id="xrpl-restore19-prepared-20261117"></a>
## 9.116 11/17 — 新Podのログイン・実環境確認と、元提供復元から未実行19へつなぐ具体準備

§9.115の18教材・候補5af8625・同5／全12の原入力とSQL取得前checkpointを引き継ぐ。Mashが新しく借りたPod `xrplcoeb5ec77f` と安全な入力でのログインを明示し、ログイン後のJupyterLabへ到達した。ログインcredentialの値は読取・記録しない。新PodはNVIDIA RTX A5000／24,564MiB／driver595.91.07／compute8.6、Python3.12.3・CUDA12.8・x86_64・glibc2.39。作業領域は空、空き約49.98GiB、port8000待受なし、復元root／venv／basecacheなし。system torch2.8.0+cu128／triton3.4.0はあるが、モデル依存・重み・旧Podの実行物はない。read-only端末の複数行入力が成立せず、その空の端末だけをUIから閉じ、単一行commandで環境確認を完了した。model load／応答・学習・新file送付／package変更0。旧5mkの停止／消失は依然実証していない。

新Pod用の正確な送付候補は33file／21,779,197byte、scope `0511b114b8202194a091d8183768d32c2fa895f7c89ea1fc8d79e870eaa2883e`。送付ZIPは20,264,058byte／SHA `cc58a6102faf1781e407b73205f326787d95f5b98fe07f7adb37603973567efb`。ZIP内に元提供411member（default120uの重み／config、元native eec418、408client依存）と候補5afの247sourceを含む。旧同Podcopy3fileも今回の確定送付に含み、旧5mkへの接続・旧鍵・旧PID13758・古いkernel証明があることを前提にしない。元の旧Pod用16file／scopeb5bd60f7は不変・未実行の履歴として残し、新scopeへ実行許可を流用しない。

| 一回の段階 | 具体的な実行・上限と次へ進む条件 |
|---|---|
| RESTORE19 | 新専用root、復元全体30分の共有時計。固定依存導入と公式公開Qwen/Qwen3.5-4B revision851bf6eの11file・9,342,816,694byte取得／SHA照合を含む。元native／default120uで4B全重みをloadし提供を起動、healthと実PID／start ticksを確認する。元の人工tensor kernel probeで1752token相当のforward／更新／state parityを確認し、新しいproof／helperを生成する。これはtext応答0・学習0。失敗時は今回の所有processだけを停止、再試行なし |
| FIT19 | RESTORE19末尾でcaptureを再照合して新data-only bindingを作り、新Podの実値を凍結templateへ結合する。RESTORE19完了後、その実runtime／kernel／clientとbinding原本を独立確認してから、FIT19を別に起動する。旧教材・5af source・上限・実行codeは変更しない。18件×2周36更新、fresh LoRA／fresh AdamW・旧learned tensor初期利用0、fit780秒／work900秒／復元込み18分。完全保存再load／config一致と元提供復元が必要、中間18更新の採用なし |
| A19 | 新36更新の実weights／configと復元後PIDを結合した後、同5件＋前後4対照、最大9応答・復元込み30分、一回。旧原文／rawの再利用や修補で結果を作らない |
| 条件付きB19 | A19全5件の全原文・無修補raw・全node／edge／overview／unknowns・図本文がroot＋独立全文照合で適切な時だけ、判定hash最大4KBを追加。全12記録の12LEAF＋MERGE＋前後4対照、最大17応答・復元込み24分・pipeline840秒、一回 |

各段階を自動連続起動せず、実結果と復元を確認して進む。RESTORE19は新しいanalysis／natural認証鍵を同Podで生成し0600 privatefileとprovider環境にだけ保持する。鍵値をprint／外部送付／結果へ保存せず、Jupyterログイン鍵をmodel鍵に転用しない。通常Renderの鍵／endpointは今回変更しない。新Podを用意した指示とログイン承認は受領済みだが、増えた送付・初期復元と新scopeの各一回は具体承認前である。

容量／教材・同5／全12原文・計画は§9.115からbyte不変。独立担当が全33file・scope・元提供411memberと候補247sourceのGit実byteを照合し、境界・条件・上限の具体的blockerなし。起動helper失敗時の別session子process残存を修復し、実PopenのCPU模擬4件（spawn後例外／SIGTERM／receipt後例外／成功）で所有childの回収と無関係sentinel維持を確認した。runtime binder／FIT wrapper／post-FIT scope結合のCPU検証はprivateの実検証receiptを正とする。これらは実GPU復元／実意味品質の成功へ換算しない。

通常API／workerは今回のfresh読取でも双方24bc228d・Live、DB38migration／最新20261115011424。候補5afのexact-head CI Analysis43991420434／Piece43991420308もcompleted／success。新upload／RESTORE19／FIT19／A19／B19／新model応答・学習・SQL／通常変更0、19各一回は未消費。旧FIT18／A18消費済み・B18条件不成立は保持。適切な全12の同raw一回SQL保存→別process非生成再読→通常native／map専用alias／IF120u・自然／Piece／API-worker整合反映が残り、通常への実model到達も未確認。元単位・補助全体・正式受入れ未完、build／TestFlight／本人実機保留。

STRUCTURE_MAP_DELTA_NONE：既存提供と未実行学習の新Pod復元準備だけで、新reader／controller／公開型／API／DB列なし。全体方針は第11回§5を保持。公開trial `xrpl_restore19_prepared_20261117` にbody-free receipt、完全な確定file・復元手順・全reviewは既存private引継ぎの同名checkpointへ保存する。

<a id="analysis-understanding-long-scenes-fit19-prepared-20261117"></a>
## 9.115 11/17 — 理解の更新と実際の交換を分ける完成例、独立長文2件を加えた現v3教師18件

### 同日・処理中断後の再接続確認（FIT19未開始）

再開指示後、source5af8625／前提0971a6e／scopeb5bd60f7／送付ZIP1f5e90da・全16file4,033,458byteをrootと独立担当が再照合し、不一致なし。接続前の候補・資料を再実装／再学習していない。既存Jupyter tab30は`workspace/cocolon_resume_20261117/runtime`を取得できないdialogを表示。閉じても再発し、read-only確認commandの完了は観測できなかった。一回のreload後は画面取得timeout、次の観察は許可外プロトコルというbrowser URL policyにより拒否されたため、その時点で全browser操作を止めた。別URL／API／別surfaceによる迂回はしていない。

これは今回の接続確認不能であり、Pod停止・volume消失・元提供停止の実証ではない。PID13758／health200は前回確認記録で、今回のfresh値には使わない。新送付・FIT19／A19／B19起動・新学習／応答・SQL保存／通常変更0、19の各一回枠は未消費。現在の既存Pod稼働状態と利用可能なJupyter接続を確認し、実runtimeと未使用実行先をfresh確認してから、既存の具体承認条件・確定file・上限に従って再開する。新runtimeへの無検証再束縛、旧18枠流用、payload変更、別Pod送付はしない。通常API／worker24bc228d双方Live・DB38migration／20261115011424は今回再照会、変更0。通常反映・元単位・補助全体は未完、build／TestFlight／本人実機保留。原接続記録は同trialの`understanding_and_long_scene_prepared_20261117/connection_resume.json`、完全引継ぎは既存private最新checkpointへ。


§9.114の実不適合原本と、旧16教材／現作者／通常plannerを確認して続行した。明確な誤教師や変換での複製bugは見つかっておらず、長文量の差だけを失敗原因とは断定しない。既存source_duties.v2をv3へ無検証でONにすること、全記録を一律LEAF化すること、rawの重複除去やcompiler緩和で受理させることはしていない。現作者に欠けた正の対照を既存完成例と教材へ補う修復であり、一般意味検査の新controllerを追加しない。

API候補`5af8625599aa80f90c983cdec34144e88a133d1e`／tree`a2ce64b8e2fb968306760e8f20adee9e403e489b`で、`semantic_admission._semantic_node_local_v3_lesson_instruction`内に、同じ支柱を光沢から金属と思った段階→材質表示で樹脂と確かめた段階と、赤い留め具を外し青へ交換した実行を別nodeで示した。旧whole／MERGE6node＋edgeと旧LEAF3nodeは値を保持。whole／MERGE8node、LEAF5nodeで、LEAFへ後日の確認・交換を持ち込まない。完成例は指示内に留まり本人sourceに混入しない。新しい公開型／保存owner／API／DB列はなく、native・compiler・本文投影／default120u・自然／Pieceは不変。関連204検査成功、同headのAnalysis43991420434／Piece43991420308はcompleted／success。候補の通常配備とは区別する。

| 新しい架空教材 | 教える対照と根拠範囲 |
|---|---|
| L01 写真の撮影月と小箱の表記 | 葉の色からの秋の推測→裏書き・日記から五月と確かめた理解と、付箋を実際に貼り替えた行動を別に保持。全体像22分と後日の裏面13分、作業用切抜きと送付版、母の表記への返答と人物名の未回答、返却日の未定を分ける |
| L02 作業机の交換と各日の作業 | 先週の店頭試用のみ／購入前の金額確認／翌週の購入・実際の机交換／設置後の確認を各sceneへ。旧机で宛名12分と別日の新机で仕分け26分を合算せず、入替え翌朝の妹の返答を入替え発生時刻にしない |

旧16教材の全snapshot・正解assistant rawはbyte同一、旧33記録66欄を保持した。新2件4記録8欄／18node・30unit・非空meaning12・7edgeを、rootと独立2担当が全原文→自node根拠→title／fact／meaning→全図／線／概要／本文まで照合。受取票の受領と検査、色への手応えの創作、別node目的句の借用、未確認と未定、土曜の使用時点、配置順序等の指摘を修正して再確認、未解決の教材指摘0。各9nodeのうち概要8参照を明示し、外した家族nodeも全図・本文には保持。全18件のnative全文字受理・既存compiler・全74欄の根拠・旧16可視内容の保持を確認した。教材SHA`59978e6c05ba3ef24a6e8eb990b1466e2bcb98d0d84d9a6a90fb4de30656a8d9`。これは人が作った正例の適切さで、実モデルの意味改善やblind／一般化評価ではない。

固定revision851bf6eの公式tokenizerをCPUで実測し、過去の同5GPU入力token一致で検量。18件は通常14／LEAF2／MERGE2、最大系列7,767、教師assistant＋EOS最大2,148token、切詰め0。旧FIT18のA5000実308.121秒から全系列／系列二乗／教師量で粗く換算した408／483／411秒は完走保証ではない。旧peak allocated13.055GiB／reserved15.809GiBに対し、教師logits増のメモリは未実証。fit780秒・work900秒・復元込み1080秒の厳密な一回を独立reviewで妥当な限定案とし、OOM／失敗時は停止復元、再試行／自動縮小／切詰めはしない。

新scopeは`b5bd60f7b5fe7396af02f7d797b9d2765eb198c1e37ba8b4be1399da90d49893`、新送付は確定16file／4,033,458byte。新source247fileのclosureを既存builderで再導出し、clean Git各blobとZIP全byteを一致確認した。現ソースから同5依頼と同12記録の親・12LEAF計画を再導出し、原入力／guard／as_of／SQL原checkpointを保持。旧5依頼・plan・rawのhash再束縛はしない。新sourceZIP／manifest／依頼情報等を送り、同Pod内copyは既送付の変更なし対照・5入力・全12入力の3fileだけ。新FIT19／A19／B19各rootは未使用、元PID13758／start243321420／port8000 healthz200をfresh UIで確認した。実行直前に元argv／env／cwd・重み／native／kernel／clientを再確認する。

新学習は既存fresh LoRA／fresh AdamW・seed20261116・LR1e-4・112 float32 tensor／3,833,856param・旧学習済み重み初期利用0・assistant/EOSだけlossの方式を保持。18件×2周36更新を必要とし、中間18更新は採用しない。実学習器のCPU材料検査で18件は通り、17件・旧32更新・逆順は拒否。新wrapper／binder／評価driverの全文差分とpayload境界を独立確認し、実行上限・復元・同Pod認証境界を保持した。GPU実学習は未実施。

具体承認後の限定一回は、FIT19＝18教材36更新・復元込み18分、完全保存再load／config／元提供復元後にだけ実weights／PIDをA19へ結合。A19＝同5件＋前後4対照・最大9応答／復元込み30分。全5件の原文／無修補raw／全図本文がroot＋独立全文照合で適切な時だけ、最大4KBの判定hashを追加してB19＝同12記録12LEAF＋MERGE＋4対照・最大17応答／復元込み24分、既存pipeline840秒を保持。各一回、学習枠の転用／retry／raw修補／旧応答再利用0。FIT18／A18の一回は消費済みでB18は条件不成立、新scopeへ流用しない。

通常API dep-dbsgn8t6e07s739qfk50／worker dep-dbsgnet6e07s739qg5a0はfresh読取で双方24bc228d Live・autoDeploy OFF・unsuspended、DB38migration／最新20261115011424。今回Render／Supabase変更0、worker900／新GPUへの通常実モデル到達の未成立を継承。適切な全12実最終raw→同raw一回SQL保存→別process非生成再読→通常native／map専用alias／IF120u・自然／Piece／API-worker整合反映は未完。build／TestFlight／本人実機保留、元作業単位・補助全体・正式受入れ未完、商品採用credit0。STRUCTURE_MAP_DELTA_NONE：既存private作者完成例とtestだけで公開構造の追加なし。根拠・確定file manifest・再開手順は同trial `understanding_and_long_scene_prepared_20261117` と既存private引継ぎの最新checkpointへ。

<a id="analysis-node-local-v3-fit18-a18-actual-20261117"></a>
## 9.114 11/17 — FIT18は現v3教師32更新を完走、A18実応答は意味不適合・重複で不採用

Mashが§9.113の確定13file721,009byteの既存Pod5mkzaznzir6ygy送付、FIT18教材16件32更新／復元込み18分一回、A18同5件＋前後対照／最大9応答・30分一回、全5件独立全文照合が適切な場合だけB18全12記録／最大17応答・24分一回と判定hash最大4KBを明示承認した。旧A17の承認を流用していない。ZIP98,734byte／SHA96a96877553ecded341a0fd9dfccf918c5ed602942451c25c53db215969fb72bを一回送り、全13member／総展開byte／CRC・全SHAを送付先で一致確認した。既送付eec source247fileのZIP・manifestと凍結評価入力／対照は同Pod内copyで再利用し再送0。元PID6855/start242920362・healthz200、新FIT18root不存在を確認後、scope4bd274663c9bf0186143cf91fcb8fc6ae16a808a78a18fcf20eaf74f5b0a6909で一回起動した。

FIT18は提供停止前の同Pod HF CPU preflightで全16件のprompt／assistant＋EOS tokenが凍結値と一致した。現node_local.v3教材SHA dd81dccc2b4fbe96effa6188351a251468105d042c926b06264ebda5b3b21918、元33記録66欄不変、通常12／LEAF2／MERGE2、全16件×2周32更新を完了した。既存のfresh LoRA／fresh AdamW、同seed・固定base revision851bf6e、112個3,833,856個のfloat32学習param、旧学習済み重みの初期利用0、assistant/EOSのみloss・切詰め0を維持。32更新のloss／gradient normと前後4測定lossは全て有限で、保存後の新base再load＋adapter全112tensor同一、configは元scopeとinference_mode以外同一を確認した。これは実学習・保存の完走で、応答の意味適合ではない。

学習処理308.121秒、元提供復元込み336.232687秒で18分以内。元argv／env／cwd・native eec418d3／120u重みecbdd0d1・config4389a598をPID13085/start243238682へ戻し、別の既存captureでhealth200・kernel proof／client408file・自然／IFの既存設定を確認。新weights a46f3f5003e9c81ad5c150f4538422f6f06ae959348dedd00fafa8bfd3296212、config e1773a619e4d23461d8302319c85417187c575323967520586c4aa90febe6796を保存した。FIT18の15原本＋manifestのZIP14,198,065byte／SHA84ba96a637e2a0be8401c0f4eea63692ac4661eab12b887e766f1ee3ad41c7d2を回収し、全memberのSHA／CRCと実weightsをroot・独立担当が照合、ローカルでも112個float32tensorの全値有限・3,833,856param・全56個のLoRA_B非零を確認した。checkpoint16は採用していない。新最終weightsと原本はprivate引継ぎへ耐久保全した。

別captureのcandidate_adapter_pathは既存fresh32を不変確認する情報であり、新候補の指定ではない。新A18scopeはFIT18のCOMPLETE32・保存再読・完全復元から同Pod内で新weights/configSHAと実復元PID/startへ結合し、SHA8bd43ffb19759e1b121216a9922973e7e3e7905952296d037d5895d47d3e5b1aを凍結。source eec0262b、native d502b3c5、非base alias cocolon-qwen3.5-4b-analysis-node-local-v3、旧default120u／自然／Pieceは元のまま。root＋独立担当が全実原本・新scopeと元templateの差分を照合してから、A18を内部A9入口で一回起動した。

A18は4POSTを行い、前Emlis／IF対照2件と読書会／照明の4応答を受領した。読書会はHTTP200／stop・86.628271秒、9node／6edgeの図・概要・本文へGENERATED。照明はHTTP200／stop・179.848910秒で12node／13edgeのrawを受領したが、既存intent_compiler._compile_analysis_semantic_map_v2の4485行、同一title／summary／explanationの拒否でAnalysisSemanticMapError／analysis_semantic_map_invalidとなり、既存取得処理が終了した。rootからのsignal、native時間切れ、受領不能、model再試行ではない。残3件・後対照0、B18は条件不成立で未実行。A18のunused枠やB18枠を別試行へ流用しない。

| 全原文と実raw／可視出力の照合 | 実際の結果 |
|---|---|
| 読書会で回復・保持した内容 | 一階の予約完了、本人の初日未送信、翌日の送信と一人の了解、全員既読の不明、椅子確認の希望と問い合わせ未確認、来週未開催がfact／図／本文に残った。旧A17の完了→可能の誤変異は今回出なかった |
| 読書会の不適合 | n4.meaningが、写真で二階を使えると思っただけの段階を実際の旧部屋へ昇格させ、一階へ変更されたことと変更が返信確認時点に起きたことを創作。n4自身の根拠も翌日の一階予約連絡・写し確認だけであり、local根拠外。このmeaningはsummary／explanation／関係線説明／概要／本文へ同じまま届く |
| 読書会の補足 | n1titleは返信未着を問い合わせ自体の未着とも読める表現にする。n6title／meaningの一人の了解は全体原文では真だが、そのnode自身のunitは全員既読不明しか支えていない。こちらはn4の創作と区別した根拠外持込み・反復 |
| 照明の意味不適合 | 購入前の別日の窓際一時間と、購入後三十分を合算できないのに、n6title／meaningと関係線が購入後一時間半の描画を作る。n4は購入前の値札→家計確認を購入後へ、n7は購入前の店頭展示試用を購入後へ変える |
| 照明の形式拒否 | n10／n11／n12はunits・引用・fact・unknowns・title・meaningまで完全同一。変換が新しく複製したのではなくrawに既にある。native character parserは引用・wire／参照として完結受理する一方、既存compilerは表示内容の一意制約で拒否。重複を消すだけでも上の意味不適合は解消しない。照明のprojection／本文／採用artifactは作られていない |

読書会raw SHA9e599deeeb9a5679f97f1044c59843cca21825620efe012a719c0df141dff1daと全call objectは途中取得と最終原本で同一。照明raw SHA91343c0c866ee8e6de0aee619218fdd7c424aa07600fdddea56d23f8b8f53f86。両件の全原文・raw、読書会の全node／edge／概要／本文をrootと独立担当が読み、同じ不適合を確認した。照明は独立CPUでも同messages／request_refを凍結原本から導出し、同rawを修正せずにnative完結受理→同4485行拒否を再現した。parser通過を意味適合へ、学習loss減少を商品合格へ換算しない。

現教師16件・82node／109unit／24meaningと現lessonを再監査したが、本人の見込みを実世界の変更へ昇格させる正解、別nodeからmeaning根拠を借用する正解、完全同一nodeの繰返しを教える明確な教材は見つかっていない。24meaningは全て同nodeの前後／範囲2unitsを根拠とし、残58nodeはmeaning空だった。ただし教師の原文量は109〜237token、照明原文は1,688tokenで、長い段落と多い場面を扱う教師の範囲には差がある。これは観測した範囲差で、失敗原因の確定や、追加学習で必ず直る保証ではない。正しいquote／factからtitle／meaning／関係線へ移る段階の資格・時点・根拠範囲の保持と、長い出力での重複が未達である。

現在の通常history plannerでも読書会14,845byte／照明22,838byteは49,152byte以内で0batchとなり、A18のdirect whole-mapは同じ通常経路である。評価だけ不当に分割を外した結果ではない。既存LEAF＋MERGEの利用範囲を広げる案は未実装・未実証。全記録を逐件化するとmax16LEAFと17〜100件以上／本人訂正cohortが衝突し、MERGEはLEAFのfact／meaningでなく全有効原文を再読するため、最終meaning誤変異を隔離だけで直せるとは言えない。分割変更や新guardを現在の実意味修復の代わりに採用しない。

A18は停止・元提供復元込み379.836003秒で30分以内。元native・120u・全argv／env／cwdをPID13758/start243321420へ戻し、別captureでhealth200・client／proofを一致確認。候補PID13460不存在、候補listener18008閉鎖、B18root不存在も別readで確認した。全原本13file＋manifest ZIP47,469byte／SHAffbe5ac7fff609ebe27c2d133e6a2c229081fb3d5bfa502c80000c08bb60392fを全CRC・member SHA一致で回収、after.result SHA6d90710f42e0289bce442802e7c8405f1a4a7379e996fb896805b5fc85517ce3がexecutionに一致した。鍵・全環境は同Pod内認証／復元に留め、出力対象全byteに両鍵値が含まれないことを同Pod内で検査してから回収した。

通常反映へ進むための元SQL plan75daa8b7／receiptafb8ef17／inputbdb872a5は現在Cocolonのworked_map_lesson_prepared_20261116/sql_pre_acquisitionに正しい原本があると確認し、既存checkpoint801ba068と別ローカルpre-rootへ原本を変えずに揃えた。現source／v3 candidate planとのsource-only bindingはCPUで通ったが、適切な新最終rawがないためSQL再生・保存・再読は実行していない。これをSQL成功実績へ換算しない。

通常API dep-dbsgn8t6e07s739qfk50／worker dep-dbsgnet6e07s739qg5a0はfresh確認で双方24bc228d Live、autoDeploy OFF・DB38migration／最新20261115011424。新候補通常採用・Render設定／配備・Supabase変更0。FIT18一回は完走で消費済み、A18一回は不採用で消費済み、B18は条件不成立。build／TestFlight／本人実機保留。本単位・補助全体・正式受入れは未完であり、新source／学習／model scopeはまだ準備・実行していない。次は現作者の意味付けと長文の場面保持へ戻り、未確認の世界変化・合算時間・根拠外meaningを修復する。新scopeを用意する場合は、この不適合rawを診断原本のまま保存し、旧rawの再束縛・raw修補・compiler緩和・unused枠流用は行わない。primary_outcome=BLOCKER_NARROWED、実読書会の個別状態保持は改善したが、商品採用credit0。STRUCTURE_MAP_DELTA_NONE：本番source／公開型／保存ownerの変更なし。

<a id="analysis-node-local-v3-matched-fit18-prepared-20261117"></a>
## 9.113 11/17 — 既存16教師を現node-local.v3で再著述、FIT18／条件付きA18・B18を具体準備

§9.112のA17不採用・元提供復元を継承した。Mashの「補助経路の活用作業を続けて」を受け、全製品／三中核・CMEE／全file地図・第11回§5・現design／現物へ戻った。予約完了の可能化は既にmodel rawにあり、decoderが完了語を置換した結果ではない。現v3指示・架空完成例にも完了を可能へ直す正解はない。新guard／parser緩和／controller／同禁止文の追加やbase切替反復を改善の代用にしない。

確認できた教材と生成形式の差は、直近fresh32の16教師すべてが旧event_plan.v2で、現node_local.v3の教師は0件だった点である。A17のbaseにも誤りが残ったため、この形式差だけが原因とは断定しない。既存作者を現形式で学習する直接的な修復候補として、元の架空16題材・33記録・66欄をbyte同一のsnapshotで再利用し、各時点・場面のfactとnode内比較を親担当が現v3で手書きし直した。旧readingの3〜4eventを2unitへ機械的に縮めたり、評価入力／誤応答を教師へ移したりしていない。

教師は通常12／LEAF2／MERGE2。原sourceのUUID・owner・日付・カテゴリ・感情・as_ofも保持し、全66欄を実根拠へ使った。MERGE用の合成LEAF6件も現v3で作り、各自の元recordだけを引用し、後日の状態・比較を持ち込まない。これらはAGENT_AUTHORED_SYNTHETICで、GPU応答や成功receiptではない。取消完了、変更完了、鍵を借りられる連絡から実受領・道具返却、後日の母の返信とほかの家族の未確認、日が違う出勤可否、予定から実走・雨による中止などの対照を保つ。独立した読みがないnode.meaningは空にした。

原33記録・全fact／title／meaning／edge／overviewと、通常・MERGE14件の図・本文、LEAF2件のcompiled graphをrootと独立担当が全文照合した。前半8件（14記録28欄）＋合成LEAF6件と、後半8件（19記録38欄）を分担した独立照合では、A07の別node間での加熱未実施の重複と、B08の受取りへ原文より細かい「翌朝」を付けた点を直し、修正後の全byteを再照合した。未解決の教材阻害0。現native文字parser・既存compilerとも全16件をraw修補なしで通り、原source／教師の書換え0である。これは教材の適切さで、実modelの意味改善ではない。

固定revision851bf6eの公式tokenizer3fileをCPUで使用し、同Podで観測したtokenizers0.23.3と一致させて16件を測った。A17の5入力3199／4698／3124／3256／4217tokenとの較正も全一致。教師の最大系列7280（最大入力6070＋教師1210）、最大教師1210、全件入力＋4096≤32768・assistant＋EOS＋改行を欠けなく保持し、切詰め0。独立担当も全16件を再計測して一致した。元teacher66欄と凍結5入力38欄／全12記録24欄の完全一致欄・10字以上の一致文・根拠quote混入はいずれも0。評価5入力はこれまで開発時に読んでいるため、未知のblind benchmarkとは呼ばない。

既存A14のfresh trainerを、profile／schema・exact source eec0262b・現在Podのhelper／client／PIDとfile名だけ直して再利用した。新規LoRA／optimizer、旧学習済みtensor初期利用0、同seed・AdamW・assistant/EOSのみloss・16件×2周32更新・保存再load112tensor一致は同じである。学習処理780秒・作業900秒・復元込み1080秒一回、新生成0・再試行0・中間16更新の採用0。前回実fit306.882秒を系列量／二乗系列量／教師量で各別に倍率した粗い見積り351.351／393.578／255.584秒は計算を独立確認したが、GPU backward時のmemory・速度・完走は保証しない。提供を止める前に同PodのHF tokenizerで全16件のtoken一致と残時間を確かめる。

既存GPUはread-onlyでPID6855/start242920362・healthz200と新fit root不存在を確認した。初回確認は誤って/healthを読み404だったため、実ownerの/healthzへ直して200を確認しただけで、提供変更・model呼出し0である。training launcherは元argv／env／cwd・native／120u・kernel proof／clientを照合してから停止し、finallyで同一状態へ復元する既存処理を保つ。前回A17の10file同意を、新教師／新学習へ流用しない。

新FIT18の具体候補は13file721,009byte。private教材／その図本文検証・独立／root照合結果・token計測、既存学習script3件と評価driver、実行範囲template／同Pod準備・結果hash結合scriptを含む。送付先は既存Pod5mkzaznzir6ygyの専用payloadのみ。既送付eec source247fileのZIP・manifestと凍結5／全12／対照等は同Pod内でhash確認してcopyし再送しない。新scopeは4bd274663c9bf0186143cf91fcb8fc6ae16a808a78a18fcf20eaf74f5b0a6909、教師SHA dd81dccc2b4fbe96effa6188351a251468105d042c926b06264ebda5b3b21918。

FIT18がCOMPLETE32・保存再load/config同一・元提供完全復元を満たす場合だけ、同Pod内binderがその新weights/configの実SHAと復元後の実PID/startへA18scopeを結合する。古いfresh32やA17 rawを新候補へ結び直さない。A18は同5入力＋前後対照を最大9応答・復元込み30分で一回。その全原文／raw／全可視出力のroot＋独立全文照合が適切な場合だけ、B18を全12記録12LEAF＋MERGE・前後対照の最大17応答・復元込み24分で一回とする。追加の独立判定hash宣言だけ4096byte以下。準備・結合scriptはmodelや評価を自動起動しない。

この記録時点では新13file未送付、FIT18／A18／B18未実行・学習更新／model応答／SQL／通常反映0。新しい教材送付と学習を含むため、その具体scopeの承認が残る。適切な実5件→全12→同最終raw一回SQL保存・別process非生成再読→通常native／map専用alias／IF120u・自然／Piece／API-worker整合反映まで同じ未完単位として続ける。今回の教材修復は実model改善・通常採用・補助全体完了・正式受入れへ換算しない。build／TestFlight／本人実機保留。STRUCTURE_MAP_DELTA_NONE：商品source／公開型／保存ownerは変更せず、学習準備と記録だけである。

<a id="analysis-node-local-a17-actual-20261117"></a>
## 9.112 11/17 — 承認済みA17の実読書会を不採用、残取得を止め元提供へ復元

Mashが確定10file3,286,846byteの既存Pod5mkzaznzir6ygy送付と、A17最大9応答／復元込み30分一回・全5件独立全文適合時だけB17最大17応答／24分一回・判定hash4KB以下を具体承認した。§9.111の送信前拒否を迂回せず、その新承認後に同ZIP2,697,007byteと準備script5,385byteを送った。遠隔の両SHA・ZIP全9member／CRC・展開合計を確認し、転送は承認byteのまま一回である。

生成前の外側準備では、scriptのinterpreter literalが/optだったためCLIが起動しなかった。実在baselineの/workspace配置へ既存同Podscriptの一行を修正（5,385→5,391byte、修正後SHA265b475822dc52593e2d0da75df098e108fd3a1c9d268e6921dfbb868ca6fc29、追加転送0）。次のCPU事前確認はterminalのHF_HOME未設定によりcached tokenizerを見つけられず、元providerを止める前に終了した。baselineで実測した同じ既存cacheを明示し、失敗CPUstageを別名で保持して再確認した。新download／dependency／model／学習0であり、これらをA17 model再試行や成功実績へ混ぜない。

その後current eec0262bの247source／全8材料hash・同5入力／全12記録・12LEAF＋MERGE計画db43b255を再導出し、cached固定revisionの実tokenizerを確認した。5入力は3199／4698／3124／3256／4217token、12LEAF最大3215tokenで、全件入力＋4096≤32768。元runtimePID5836/start242598228・native eec418d3・120u/fresh32重み／client408file／kernel proofとhealth200をfresh確認。Analysis43968192233／Piece43968192444は同候補headで両completed/success。scope0bb5af44c03a615ceaa4adf9828882abecdb85fd321cac3325c30de7ea4c9fa4を新規凍結し、元8payload全hash・正しいA17/B17 roots・alias・上限・runtime／CIをrootと独立担当が照合した。

A17は内部A9入口で一回起動した。実POST4（前Emlis／IF2＋map2試行）に対し、前対照2と読書会1の3応答を受領。読書会はHTTP200／stop・60.744569秒、CMEE GENERATED、5node／4edgeと本文まで到達した。次の照明は送信済みのまま未受領。rootと独立担当が読書会の全原文・raw・全node／edge／概要／本文を照合し、全5件適合のB条件が成立しないと判断した。

| 読書会の保持と不保持 | 実結果 |
|---|---|
| 保持 | 共同担当者の問い合わせと本人非関与、後日の案内送信、一人の了解・全員既読不明、椅子確認の希望と送信状況不明はfactに残った。unknowns=[]そのものを不合格理由にはしない |
| 完了→可能の変異 | 根拠quoteは「一階の部屋を予約できた」を正しく含むが、同unit.factは「予約可能である」、node.meaningは「予約可能となり」、関係線labelも「一階部屋予約可能」とする。n3／概要／本文へ同じ変異が届く |
| 時点・開催状態 | 「来週・まだ開かれていない」はraw／図／本文に欠ける。初日の送信未実施もn2.meaning／概要で当時の限定が弱く、翌日送信と並ぶ。後日の送信をrawが明示否定したとは記録しない |

読書会raw SHA9f1fe26a3f3e6dda6166904cd86d2017eb6258ca46213fdcea5080ecbd49c405と全call objectは途中取得と最終回収でbyte同一。正しい引用を選べたことを生成factの意味適切へ換算しない。明示base別名・exact native sourceに従う比較だが、基礎モデルへ切替えるだけでは今回の予約完了の誤読は解消しなかった。他4件の品質やfresh32だけが原因だったことは、この部分実行から認定しない。

意味不採用を記録して、既存取得child6813だけへSIGTERMを一回送った。照明の取得はCancelledErrorで終了し、driver.logには既存signal handlerのevent_plan_child_deadlineが現れるが、root_meaning_abort.jsonと操作事実を優先し、native生成期限到達や照明の完成意味不適合とは呼ばない。受領不明後の次POST0、残3入力／後対照／B17・12LEAF／MERGE0。前後対照同値は未成立。A17一回は消費済み・失敗閉鎖、B17は条件不成立で未実行、残枠を次試行へ流用しない。

停止・復元込み374.293216秒、取得child315.330577秒。元argv／env／cwdと元native eec418d3・120u重みecbdd0d1へPID6855/start242920362で復元し、主driverの完全一致検査と別captureでhash／client／proof・health200を確認。候補PID6556不存在・18008閉鎖・B17root不存在を別readで確認した。鍵・全環境は同Pod内の認証／復元だけに使い、原本exportには含めず、export全fileに両鍵値がないことも同Pod内で確認した。

最終after.result SHA cbadc0eba40d783c88b762a2b4331cf38270402a488d2fc56909b8ade7da4b42、11原本ZIP36,646byte／SHA742bdd91ac4d14b186e06bc204f5b55db9099350c388ccf9fc92592679d1b78bを全CRC・元SHA一致で回収した。原文・raw・投影／本文・scope・preflight・log／意味停止理由・別復元確認は既存private引継ぎのresume_a17_actual_20261117へ保持する。公開trialのnode_local_v3_a17_actual_20261117は本文なし採否・counts／hashだけを記録する。

通常API dep-dbsgn8t6e07s739qfk50／worker dep-dbsgnet6e07s739qg5a0はfresh確認で双方24bc228d Live、DB38migration／最新20261115011424。新candidate通常採用／設定／配備・SQL保存／非生成再読・新学習／model再試行0、build／TestFlight／本人実機保留である。適切な最終rawがないため通常反映へ進めず、本単位／補助全体／正式受入れを完了とはしない。

次は既存作者が正しい根拠quoteからfact／meaning／edgeへ移る時の完了／可能・過去／現在・未開催の読取を、現v3契約と実誤文へ戻って修復する。既存指示には状態保持が既にあり、同じ禁止文やbase切替の反復・raw修補・拒否緩和・新controllerを改善の代用にしない。新しいmodel／学習scopeは未準備・未実行。primary outcome=BLOCKER_NARROWED（明示base比較でも同じ完了状態変異が残ることを実測）、商品改善credit0。STRUCTURE_MAP_DELTA_NONE：今回の実評価と記録・復元のみでproduct source／公開型／保存ownerの変更なし。

<a id="analysis-node-local-a17-transfer-blocked-20261117"></a>
## 9.111 11/17 — A15/A16実績からA17の実生成準備へ再開、対象Pod転送は送信前拒否

原本は既存private引継ぎCocolon_CMEE_A13_Continuation_20261116.zipのresume_after_a16_20261117/current_checkpoint.jsonとA15/A16 actualである。§9.110の認証未成立は当時の記録であり、その後JupyterとRenderのログイン、元モデル提供と既存bridge復元は完了した。今回もJupyterの認証済み画面・元nativeプロセスPID5836の稼働を確認した。内部稼働と通常Render経由のモデル疎通は分ける。

A15は前対照2とmap3の5応答を受領し、4map目送信後に原文照合の意味不適合で中止、復元込み462.028秒。A16は前対照2とmap2の4応答、読書会は図／本文へ到達したが予約済みの可能化・関係線の根拠ずれ・未開催等の欠落が残った。照明は同項目反復と後日の購入／設置／使用を落とし既存analysis_semantic_map_invalidで拒否。復元込み379.344秒、元native eec418d3・120u重みecbdd0d1へPID5836/start242598228で戻した。両一回は消費済み、不採用を変更せず、各B／新全12／同raw実保存再読／通常反映0を保持する。

既存API候補eec0262baf833084cd548819a7960adc1b043c4b／tree9c7822fb365532397e463295c9f695198531edd3をfresh取得した。A17はsemantic_map.node_local.v3の同じ指示／容量／原入力で、明示別名cocolon-qwen3.5-4b-analysis-node-local-v3-base-851bf6eだけを既存event_plan_baseへ振り分け、生成中だけadapterをdisableする比較である。fresh32は同byteで読込み・identityを維持するがmap推論には使用しない。IF120uと自然／Piece、旧raw・公開v3／保存型／月次当時版を変更しない。基礎モデルが意味不適合を解決するかは未確認である。

247sourceはcleanなexact candidateのGit blobとarchive全member・manifestを照合。新driverはsource／model／CI／A17・B17実行先を再束縛した。独立reviewでB実行先だけ旧B16の残存を発見し、送付前に修正・再生成、rootもdriverとscope双方の一致と全payload SHAを確認した。5input abf97a90、全12input bdb872a5、plan db43b255はA16とbyte同一で、leaf12＋MERGE1を維持する。今回の実HF token検査とcurrent-source CPU再導出はまだ行っていない。継承された138成功は前sessionの検査記録で、今回の新規pytest成功とは数えない。

確定送付候補は展開後10file3,286,846byte。9fileをまとめたZIPは2,697,007byte／SHAe4b8f0470c49980425668347e46488b3d13bf4b807bd21d7bd7855111d40a4ad、CPU準備scriptは5,385byte／SHAb3c595b387b2882b7f530c38de0f76511421abe7baa73268db81bd54eb9c2ee9。対象は既存Pod5mkzaznzir6ygyの専用新payloadフォルダだけ。中身は公開source closureと架空5／12記録・対照・実行コード・manifest／未凍結templateで、資格情報を含めない。既存鍵／全起動環境は同Pod内の認証と元提供復元だけに使用し、外へ書出さない。

Jupyter filechooserから上記2fileを送ろうとした時、自動承認審査は「specific third-party destinationへのthese filesの開示を具体承認していない」として送信前に拒否した。別経路で迂回せず、新GPUupload／CPU準備／tokenizer／新model・学習／SQL／通常設定・配備0で停止した。execution_scope.jsonは未凍結、A17/B17の一回は未消費である。候補Piece43968192444は同headでcompleted/success、Analysis43968192233はin_progress/null。Analysis successが隔離比較開始に、両successが通常採用に必要であり、未完CIを成功へしない。

具体承認後は、同byteを転送・展開し、新sourceで5件と12LEAFをCPU再導出・cached tokenizerで実測、現在runtimeと最新CIへscopeを凍結する。A17は5件＋前後4対照・最大9応答・復元込み1800秒一回。全5件の原文／raw／全図／本文のroot＋独立全文照合が適切な場合だけ、判定hash4KB以下を同Podへ追加してB17を新12LEAF＋MERGE＋4対照・最大17応答・復元込み1440秒一回。pipeline840秒・work1260秒と各210秒要求、学習／自動retry／raw修補0を維持し、失敗または受領不明後の次POSTを止め元提供へ復元する。適切なB17最終rawだけを元SQL checkpointから一回保存し、別processで非生成再読した後、通常native／map専用model／API-worker exact版へ反映する。

今回fresh読取で通常API dep-dbsgn8t6e07s739qfk50とworker dep-dbsgnet6e07s739qg5a0は双方24bc228d Live、autoDeploy OFF。既存active factory起動を維持しlegacy app:appへ戻さない。DBは38migration／最新20261115011424。通常API／workerから新GPUへの実モデル到達・鍵一致・候補配置は未完。一般意味品質・AR全体・本人受入れを今回準備へ換算しない。STRUCTURE_MAP_DELTA_NONE：実生成のための既存実行物再束縛・状態更新だけで新owner／API／DB型なし。

<a id="analysis-node-local-v3-ci-runtime-recovery-20261117"></a>
## 9.110 11/17 — 候補CI・通常稼働・保存資産を確認、新GPUは認証入力未成立

§9.109のAPI候補`c95d17d840d1955a3a3c2ae5d4682aed989f7213`は変更していない。分析[43883976914](https://github.com/MassyuRed/mashos-api/actions/runs/43883976914)とPiece[43883976919](https://github.com/MassyuRed/mashos-api/actions/runs/43883976919)が同じ候補headで完了し、run／jobのsuccessを確認した。§9.109の「両CI実行中」は当時の観測として保持し、現在はこの最終結果を採用する。CI成功を新private形式の実4B品質・保存・通常採用の証明へ換算しない。現scratchをrepository指定のLMFE commit `817f944f`へ合わせ、新2suite47件と既存native303件を同一groupで実行して350 PASS／0 FAIL／0 SKIPを確認した。以前の検査件数とは合算せず、商品sourceの変更や新model出力の品質改善へ数えない。

### 回収・再確認できたもの

- 保存済みfresh32実行archiveから、weights SHA`73f5fdcb3c8fec59216a40113e2b0e3396b2ef284a5783588cb8dabb26bb6f4a`／config SHA`fb2ef59b128df8d922ada85afa4d78a2e9d5c6b8085eba31e4658239cf72fbec`を回収・照合した。追加学習や新しい重み採用ではない。
- 保存済み`ConcreteReading.zip`から元`pre_acquisition.pglite.gz`を回収し、4,835,570byte・checkpoint SHA先頭`801ba068`を照合した。既存の全12原記録・SQL guard・凍結as_ofを持つ取得前checkpointであり、新しい実4B成果物や保存成功ではない。
- 既存workspace `tea-d4pp61idbo4c73bf4hkg`へのRender構造化読取が成功。通常API deploy `dep-dbsgn8t6e07s739qfk50`とworker deploy `dep-dbsgnet6e07s739qg5a0`は双方Live、commit `24bc228dbf54abc983906323c0ae7d937fae1fd6`、autoDeploy OFF・unsuspendedを確認した。従来のRender認証による**構造化読取**の阻害は解消した。新GPUへの接続・設定値／鍵一致・候補の指定版配置が成立したという意味ではない。
- SupabaseはACTIVE_HEALTHY、最新migration `20261115011424`を再確認した。今回のDB変更・設定変更・配置はない。workerの`stale_after900`は11/15の既存起動logを読み直した値で、新しい起動eventや設定変更ではない。

### sourceだけで確認した取得計画の差

凍結5件の新v3 prepareは6,997〜15,419byteで、現在の16,384byte予算内だった。同じ12記録の現在の既定plannerは、v3のLEAF instructionがv2より476byte増えたため一部の2記録組が予算を超え、旧v2の6LEAF＋MERGE（7call）から9LEAF＋MERGE（10call）へ変わる。これはsourceによる取得前計画の確認だけで、実tokenizer／モデル受領・意味採用ではない。24,576byteの診断では両形式とも4LEAFとなったが、その予算変更は採用していない。旧B14の最大11応答scopeをv3へ流用せず、現在のplanに一致する前後対照込みのcall・待機・復元予算を実行準備へ反映する。新たな商品条件・承認段階を追加する判断ではない。

### 残る新GPU接続と同じ未完単位

Mashが新たにレンタルしたPod `5mkzaznzir6ygy`のJupyterはtoken入力が必要なログイン画面だった。安全入力は`locator_invalid`で2回終了し、認証成功は観測できていない。新Podへのファイル送付・モデル呼出し・学習は0。旧PodのPID／start／鍵・稼働証拠を新runtimeの成立へ移送しない。A15・全12LEAF／MERGE・同raw SQL保存／別process非生成再読・候補の通常native／API-worker反映はすべて未実施である。

再開先は新runtimeへの接続成立後、§9.109の新private契約と同じfresh32重み・凍結5入力で実source／raw／図／本文を照合すること。全5件が適切な場合だけ同12記録の既存cohort分割／統合、同じ最終rawの一回保存・別process非生成再読へ進み、map alias／IF120u／自然Emlis・Piece profileの分離と実構成のbyte／token・呼出数・840秒pipeline／worker期限を確認して通常反映まで閉じる。旧A12／A13／AF1／A14を再実行せず、今回の回収や機械成功を意味改善へ数えない。

STRUCTURE_MAP_DELTA_NONE：今回の商品source・公開graph・保存・DB／RN契約の変更0。候補c95d17dと通常24bc228dの差を維持する。通常反映を含む元作業単位・補助活用全体・正式受入れは未完、build／TestFlight／本人実機保留を継承する。

<a id="analysis-node-local-v3-candidate-20261116"></a>
## 9.109 11/16 — fresh32学習とA14不適合を踏まえ、node-local private契約を実装候補へ反映

### 完了したAF1とA14の実結果

A13の失敗原本と§9.106の旧direct-graph教師との差を踏まえ、本人原文の資格・時点とevent／reading参照を含む新16教師をrootと独立担当が全文確認した。原評価5件は教師へ混ぜていない。AF1は既存trainerでfresh base＋新random LoRA／新optimizerから32更新し、保存・非学習reload一致まで306.882秒、元提供復元込み341.020362568秒で完了した。旧adapter重みを初期値へ読まず、既存configだけを使った別学習である。新weights SHA73f5fdcb3c8fec59216a40113e2b0e3396b2ef284a5783588cb8dabb26bb6f4a／config SHAfb2ef59b128df8d922ada85afa4d78a2e9d5c6b8085eba31e4658239cf72fbecを保存・再読照合し、元提供PID12711へ復元。AF1内の新model生成0、通常採用false。学習完走を意味品質の改善へ換算しない。

続くA14は同b340作者・candidate native569042c2・同5入力／messagesを保ち、このfresh32 adapterを明示event-plan-v2へ選んで一回実行した。scope be6bfee879d87f86ce6cfda3c25e1dd5bdb5fbbcad326e5818430d0a69161b7f。前対照2＋読書会1の実3応答、読書会は165.149517187秒／HTTP200／stopだったがanalysis_semantic_event_plan_orphanで拒否された。result SHAd4a3427adf74e23feacc1fe25307c6e57cfd24b1a5ba1d9f65731584ceade047、raw SHA4fb950c334fed75fe2a07c492ba5c7825420d1e01f824cfeb8ab6bc0c14c8740。

独立全文照合では24eventに対しIDを除く内容は8種類だけで、15eventがnodeへ到達していなかった。edge2本にも両端根拠外の参照があるが、実際の最初のcompiler拒否理由はorphanであり、後段の潜在違反と混同しない。後日の実送信・受領・未開催の保持が欠け、r2の意味も選択根拠に支えられていない。完了形など一部の資格差が回復しても、実意味・図／本文の成立とはしない。残4件／後対照は未実行、B14条件不成立、新全12／SQL保存／非生成再読／通常採用0。学習はAF1で実施済みだが、A14取得内の追加学習／retry0である。

A14は失敗閉鎖し、305.216661125秒で元native d678fe2c・元argv／env／cwd・元120uと同adapter identityへPID13576/start100524246で復元した。別読取でhealthz200・候補18008閉鎖を確認した。AF1とA14の一回は消費済みで、未使用応答やB14枠を次へ転用しない。A13／A12の原本と§9.108／9.107は履歴として保持する。

### 次の最小改修：既存author内のprivate node-local v3

失敗箇所は、事実候補の資格だけでなく、global events／readings／unit_refs間の生成・参照計画に残った。fresh v2学習後も同型の反復・未使用・根拠外参照が残った実結果を根拠に、その表をさらに注意文で補う周回をやめ、各nodeが自分の根拠付きunitと意味を持つ候補へ変更する。形式だけが失敗の唯一の原因と確定したわけではなく、新形式の実品質は未確認である。

新private profileは`semantic_map.node_local.v3`、model schemaは`cocolon.analysis.semantic_map.node_local.model.v3`、明示aliasは`cocolon-qwen3.5-4b-analysis-node-local-v3`。公開`watashi.map.v3`とは別のprivate author契約であり、公開wireの版上げではない。次のA15候補では保存済み同fresh32 weights73f5／configfb2eを使い、追加学習や別重みへの自動切替は行わない。既存v1／event-plan v1／v2は旧schema・orphan拒否・保存raw読取をそのまま保ち、新形式で旧rawを再解釈・修補しない。

| private要素 | 決めた契約と上限 |
|---|---|
| root | `schema_version,nodes,edges,overview`の閉じた4key。global events／readings表とunit_refsは持たない |
| node | `units,node_kind,perspective,title,meaning`。1〜12node、`node_id`はmodel出力に含めず、CMEEが配列位置からn1…を付ける。分類・視点は既存enum、title1〜80字、meaningは空可・240字以内 |
| unit | 各nodeに1〜2unit、合計最大24fact。`evidence,source_mode,fact,unknowns`。fact1〜160字、evidence1〜4の`quote,field`。source_modeは既存4値を維持し、その分類だけで意味確認済みとはしない |
| unknowns | unitごと0〜2の`source_quote,source_field`。同fieldかつ当該unitの採用根拠内にある一意な原文引用・240字以内。2unitでも公開nodeの既存4件上限内に収まり、切り落とさない |
| edge | `from,to,relation_kind,label`。from/toは既出の位置nN、関係は既存enum、labelは既存上限。根拠scopeは両endpoint unitだけ、独立したevent／reading参照表や新事実文を持たない |
| overview | `title,node_refs`。node_refsは既出nodeから重複なし最大8。summaryは選択nodeのsummaryから導出し、新しい事実文を独立生成しない。node本体12件はすべて通常graph／本文へ残す |

compilerは各nodeの全local unitを必ず本文と根拠へ取り込み、内部unit identityをn1.u1…の位置で確定する。node.summaryはmeaningが非空ならそのmeaning、空なら先頭unit.fact、node.explanationは全unit.factを順に改行接続しmeaningが非空なら末尾へ一回加える。edge.explanationはfrom／to両nodeの同じ完成bodyだけ、overview.summaryは選択node_refs順の完成node.summaryを改行接続する。独立した新事実文は生成しない。新しいmodel call、application側の第二作者、生成後の文章修補ではない。旧v2のorphan検査を消して旧不適合rawを通す変更でもない。新profileのnativeではevidence開始時に未使用recordを優先する旧制約を流用せず、提示recordが24件以下の時はnodes配列を閉じる時に全recordの根拠coverageを確認する。24件超は既存nativeのrecord-coverage強制無効の例外を継承する。12node×2unit×4根拠の96枠を、商品側の100件cohortや全入力の新しい上限にしない。全入力とsource guard、部分／UNASSESSED coverage、未解析範囲を保持し、latest Nへ切り捨てない。無関係なrecordを同一nodeへ混ぜる順序は強制せず、引用coverageを全意味理解済みとは扱わない。

変更ownerは既存`semantic_admission.py`のprepare／private author／stage、`intent_compiler.py`のprivate plan→既存`AnalysisSemanticMapGraph`、native `serve_emlis_natural_reply.py`の新marker／grammar／alias、`analysis_model_source.py`の明示model→profileと受口、`analysis_if_model_source.py`のmap alias時のIF120u固定である。source_adapter・唯一observed_route_realizer・公開graph型・DB列・RN・新controller／serviceは増やさない。元owner／guard／二欄／本人回答・訂正／権利と、4設定のfreshness確認を保つ。意味と方向、当時の未確認と後日の確認、希望・判断・予定と実行の区別は新形式でも同じ受入れ条件である。 原planのsource_mode／unknown原文はprivate meaning_reviewのnode_local_plan.planへ保持し、位置unit ID・edgeのunit closure・展開hashを付記する。意味状態はUNASSESSEDで、public DTOへ内部planを追加しない。

### 現在の到達範囲と今回の区切り

- 新候補コード：[c95d17d840d1955a3a3c2ae5d4682aed989f7213](https://github.com/MassyuRed/mashos-api/commit/c95d17d840d1955a3a3c2ae5d4682aed989f7213)。parent21ec7a1、tree a658ebda6b673bc03cf928a7fa13b427054a7866。対象8blobのGitHub／local一致を確認し、候補として反映済み。通常採用ではない。
- 局所検査：PGliteありの対象回帰314 PASS／skip0、163.48秒。最終新2suiteはcore23＋native24の47 PASS／4.78秒。native既存5suiteは303 PASS／43.84秒。各集合は重複するため合算せず、全suite合格とも呼ばない。
- 独立review：blocking0。本人訂正・cohort・LEAFの追加5検査が成功。これも対象検査との重複を加算せず、新private形式の実4B品質や本人受入れへ換算しない。
- 新候補CI：分析[43883976914](https://github.com/MassyuRed/mashos-api/actions/runs/43883976914)／Piece[43883976919](https://github.com/MassyuRed/mashos-api/actions/runs/43883976919)は実行中、成功は未確認。
- 新private形式の実4B・同raw保存再読・通常採用：未実施。A15／新GPU実行は今回の区切り前に始めない。

新契約のコード・局所検査・独立review・GitHub候補反映は完了した。AF1の完走・A14の失敗を新候補の意味品質成功へ移送しない。今回の区切りはこの候補と資料の反映までであり、通常反映を含む元作業単位と補助全体の完了ではない。

次の実行単位では同fresh32・新private契約で元5入力を実生成し、全source／raw／図／本文を照合する。全5件が適切な場合だけ、既存全量・cohort分割器で導出する同12記録のLEAF／MERGEへ進む。旧SQL input／checkpoint／guard／凍結as_ofを保持し、新profileのplan／source identityを明示して、同じ最終rawの一回保存・別process非生成再読を確認する。その後に通常native／APIとworkerの同版・設定・map alias／IF120u・自然／Pieceの分離を反映する。新受口のbyte／token・call／待機・840秒pipelineとworker期限も実際の構成で照合し、形式変更だけで速さや費用の改善を認定しない。

既存bridge復元は保持するが、Renderログインによる通常設定／鍵一致・指定版配置の阻害と新Podの通常Render/API接続未確認は残る。通常API／worker24bc228d・DB20261115011424は最終確認記録のまま。月次当時版・保存後0生成・現在の再認可を維持し、未判定を採用や全量意味coverageへ変えない。STRUCTURE_MAP_DELTA_PRESENT：既存owner内のprivate author profile／schema／model選択の候補実装。公開graph・storage・RN・商品中核は変えない。build／TestFlight／本人実機保留、元単位／補助全体／正式受入れ未完を維持する。

<a id="analysis-stage-aware-a13-prepared-20261116"></a>
## 9.108 11/16 — v2作者の段階別完成例でA13を実行、意味・参照不適合で失敗閉鎖して復元

§9.107のA12失敗原本を引き継ぎ、既存semantic_admission.pyのv2作者へ通常／MERGEとLEAFの完成例を分けて教示した。通常／MERGE例は2記録4欄・9event・2reading・5node・2edge、LEAFは単一記録2欄・2event／2node／edge空。最初の2eventは別記録を一つずつ扱い、既存nativeの原記録coverage順と一致させた。本人の実入力ではない例文は教材として分離し、原5入力／全12記録24欄は書き換えない。compiler／native／schema／guard／権利／DB／通常選択は変更せず、例示だけを既存作者内で修復した。

実装と既存testは[APIb340a0eec503f0371d78fefb541afef380eee32b](https://github.com/MassyuRed/mashos-api/commit/b340a0eec503f0371d78fefb541afef380eee32b)の2file。局所165 PASS／SQL依存25 SKIPで、26件のpacket再確認は部分重複のため加算しない。送付前に分析[43863462728](https://github.com/MassyuRed/mashos-api/actions/runs/43863462728)の全19工程成功と、Piece[43859216881](https://github.com/MassyuRed/mashos-api/actions/runs/43859216881)成功を確認した。分析の実行head[21ec7a1](https://github.com/MassyuRed/mashos-api/commit/21ec7a1a7a1db69e511d03c65ec6b48698e10b91)は既存CIのtimeout-minutesだけ25→40へ変更し、製品・全test・Piece workflowのbytesはb340と同じ。旧分析43859216743の25分枠取消は履歴として保持し、今回の成功へ遡及変更しない。機械成功と実4Bの意味品質を分ける。

同5件の旧既定messages、原input／guard／固定時点、同12記録24欄・同6LEAF組を保持し、新作者からmessagesを再導出した。LEAF最大16,137byte、全量親70,476byteで、親をそのまま送る計画ではない。source ZIPはexact b340の247file／246Python module・12,600,332byte、2,586,057byte／SHA c8d7f982893af63e815f36416c1d0f9e2e4b2a78376bbf389e31b2a28bcac50f。全member／AST、隔離import／prepare、既存driverの5messages・6LEAF一致と、新finalizerのsource8file／immutable SQL原本4file・checkpoint801ba068／guard／凍結as_of束縛は準備時に確認済み。準備の成功をSQL実保存へ換算しない。

scope 4cdec4a7632947d680c1c24007c1334c633c5e1712cffe4cfcd428f402e20b98を一回実行した。新6file3,066,093byteと同Pod内copy3file99,755byte、全9file3,165,848byte。A13の上限は5件＋前後4対照の最大9応答・復元込み1800秒。base851bf6e・明示event-plan-v2-base alias・同helper／native／210秒期限／4096出力・32768contextを維持し、map推論時だけ全LoRAを無効化した。既定Analysis／IF120uと自然／Piece、旧rawは変更しない。A12消費済み・B12不成立の枠は転用していない。

実3応答はEmlis／IFの前対照2件と読書会1件。読書会はHTTP200／finish=stop、97.296969547秒でrawを受領したが、既存compilerがanalysis_semantic_event_plan_orphanで拒否した。e4がnodeから直接にもreading経由にも選ばれず、図／本文は未生成。残4事例と後対照は送信せず、前後全文同値も未成立である。result SHA2326dbc95a262271bcae17c3c65535e611cc65badddf588168c39c5d29db027e、読書会raw SHA60139cb0b636f4475a21ccd6d03f81a67eeded9b634a8e97a57fe9dbb379ec18は途中回収と最終回収で同一だった。

独立担当は原5事例全文と取得済み1rawを照合した。読書会のrawは8event・2reading・5node・3edgeで、後日の本人確認・送信・一人の受領等が現れ、A12と同じ最大反復形ではなかった。ただしr1は後日の変化を述べながら早い時点と別の未確認のeventだけを根拠に選び、既送信を進行中へ、書きかけを完了後へ、予約済みを予約可能へ変える状態差も残った。全員既読が不明という説明も選択根拠へ結び付いていない。e4の参照一つだけを足して適切にできる結果ではなく、raw修補・拒否緩和は行わない。この1件の部分回復を、未実行4件や最終mapの品質改善へ広げない。

全5件適切の条件は成立せず、B13・新全12・SQL保存／別process非生成再読／通常採用は0。A13一回は消費済み・失敗閉鎖で、残応答数やB13未使用枠を新試行へ転用しない。学習／retry／応答再利用0。復元込み229.406770021秒で、元baseline native d678fe2c・元argv／env／cwd・同120u／自然baseへPID7098/start100159506で復元し、旧34weightのファイル不変も確認した。別読取はhealthz200・候補18008閉鎖、B13未実行・SQL0・通常採用falseを確認した。内部protocol名A9は既存driverの名称で、実行した外部枠はA13である。

通常接続の前提として行った既存bridge復元は保持する。handler SHA5f45a1e6d8f7ed591231dc1d50ca0144e74e1e257e9182afc2d46c009ec1b408、JupyterPID6105、ローカル認証分離・元Jupyter認証とcookie保持を5.975秒・model／external requests0で確認した事実であり、A13のmodel3callとは別の操作である。Renderログインが通常設定／鍵一致照合・指定版配置を阻害し、新Podの通常Render/API接続は未確認。通常API／worker24bc228d、DB最終20261115011424は直近の確認記録として維持する。

次は既存作者の内容・資格とevent／reading参照計画を、v2形式のfresh LoRA教材と既存trainerの準備へ接続する。旧34更新の17教師はdirect-graph形式でevents／readingsを含まないという§9.106の事実を踏まえるが、その形式差を失敗の単独原因と確定しない。注意文追加だけの周回・raw修補・guard緩和へ戻さず、同5入力の新実意味を確認し、適切な場合だけ全12→同最終raw一回SQL保存→別process非生成再読→通常native／API-worker整合反映へ続ける。新学習／実生成はまだ実行しておらず、fresh adapterの品質改善も未認定。STRUCTURE_MAP_DELTA_NONE：既存作者内の修復・失敗実績と既存接続の復元に限り、三中核のowner・公開／保存型・受入れ条件は変えない。元単位／補助全体／正式受入れは未完、build／TestFlight／本人実機保留である。

<a id="analysis-event-plan-v2-a12-base-actual-20261116"></a>
## 9.107 11/16 — 新Podで同v2・全LoRA無効のA12対照を実行し、意味不適合／期限打切りで閉鎖

直前に具体提示したA12／条件付きB12へ、Mashが「続きから再開して」と指示したことに基づく一回の続行である。承認根拠はUSER_DIRECTED_RESUMPTION_OF_PRESENTED_A12_B12_SCOPEとして保存し、「A12を承認する」という未発言を捏造しない。A11消費済み／B11不成立の枠は転用していない。API46fff73fe685b6c46d7f4b03c0bdeb003424a5e3のAnalysis43846424667／Piece43846424124両CI・全step成功を実行直前に再確認した。

scope c9aa3d15ea273e02f2de5f9432e171297bdb24c29954bffe01f95711b5ad4624の同9file3,140,114byteを使用した。同Pod内A11 payloadから同3file99,755byteをcopyし、新6file3,040,359byteを送付した。全9file SHA、source ZIP CRCと全247member SHAが確定原本と一致した。新Pod8d6lpvzb35at8xの実行前baselinePID4089/start99099105・argv/env/cwd・native/adapter/client/proofをfresh確認し、既存driverを一回だけ起動した。内部unit名A9は既存driverの名称で、今回の外部枠はA12である。

同5件・前後4対照の最大9応答／復元込み1800秒に対し、実4応答（前対照2＋分析2）で終了した。前対照Emlis／IFはHTTP200/stop、読書会はHTTP200/stopで既存compilerのGENERATEDへ到達した。照明はHTTP200だがfinish=lengthで、既存driverのfinish==stop確認により停止した。残3事例と後対照は送信していない。前後同値成立や全5件評価成功へ換算しない。

読書会raw SHA4ebb330ea484e3bbfca6469bf2688d2019f2c9d310e9c00b4ac763682b273beeは2event／1reading／3node／12edge。途中回収と最終受領のfirst-call全object、元入力／messages／request_ref／raw／body／wire／projection／textは完全一致した。rootと独立担当が元2記録4欄から全文照合し、後日の会場予約・返信を読んだ本人確認・一人からの受領等が選択event根拠に欠け、readingは選択根拠外の送信を述べ、椅子確認だけを開催状態へ使い回す問題を確認した。12線は全3node対×4関係種を埋めるが、同じ2事実の反復であり、異なるラベルは根拠となる意味関係を補っていない。技術的GENERATEDは意味適切の証明ではない。

照明raw SHA15b1c36ac07e4dbfc46fa88e98b691e54e30fe365a7dd4e46bb942342efbbcd7は13,111byte／8,747字。不完全なまま24event・7reading・24node・10完edge＋11件目途中へ膨らみ、overview未到達、図／本文なし。途中にも購入前後の時点・不明対象の置換・同一eventの反復があるが、完成応答の評価とは分ける。native logはtokenize→complete_lengthが210.021秒、HTTP211.453184秒で、既存request210秒期限が打切り原因と判断する。最後のprefixは3328、固定revisionのtokenizerによるdecoded raw再encodeは3353token／roundtrip一致であり、生成token ID列の実測と同一視しない。4096は設定上限で、到達した証拠はない。context超過の証拠もない。期限／token上限緩和、強制JSON閉じ、raw修補で採用へ変換しない。

既存parserへ読書会の原prefixをCPUで順に通すと、最初のedge直後から配列閉じと継続の両方を許可していた。12線を強制しているcharacter parserではない。ただしモデルlogit／token-maskの再実行をしていないため、greedy単独原因や訓練形式差の単独原因までは確定しない。同じv2形式でLoRAを外しても意味品質は適切にならなかった、という実対照の範囲を維持する。

全5件の独立全文適切条件は不成立で、B12は起動しておらず、意味承認receipt／B12rootはない。新12記録の6LEAF＋MERGE、SQL保存／別process非生成再読は0。A12一回は消費済み・失敗閉鎖で、残時間／残応答数／未実行B12を新試行へ振り替えない。新しいGPU試行／学習枠は今回準備・実行していない。

復元込み406.375639863秒（上限1800秒）、driver333.057234141秒。元baselineのargv/env/cwd・同native d678fe2c・元120uと候補34の同weight/configへPID5433/start99553630で復元した。別読取でargv一致／healthz200、候補PID4865停止と18008閉鎖、B12root／意味receipt不存在を確認した。新candidate native569042c2の試行証拠と、baseline d678fe2cへ束縛された新A5000 proof d759203aを区別する。旧private native ad3d301dの有効化や、保存Piece344aの追加はしていない。

遠隔export15file36,895byte／SHA00c62e1c717dca54ca0d2b597623e0f9ebe9c88d9edc2c8cf2ee59e2b779c36f、after.result130,479byte／SHA83b4fdb06b9ff6cf3a61da1d8d11fff9af08d78030940061d1b5fafd5f8dbd04を全CRCと同byteで回収した。原入力／raw／logはprivate実績に、body-free receipt／復元／独立reviewは既存trial内semantic_event_plan_v2_a12_base_actual_20261116へ保存する。診断内16,379の単位はLEAF送信messagesのbyteでありtokenではない。誤記の訂正を別erratumとして添付し、既保存private準備ZIPの原byteは変えていない。

主要adapter・固定baseモデル・必要依存と保存入力は新Podへ復元でき、この続行は可能だった。一方、旧volumeの全データ残存は確認していない。新Podの内部health／隔離対照を、通常Render API／workerの新Pod到達・認証・本人保存成功へ換算しない。通常bridge／鍵／Render設定・配備／DB変更／通常採用は今回0。両CI成功と作者の意味品質を分け、通常反映を含む元単位／補助全体／正式受入れは未完、build／TestFlight／本人実機保留である。

次の判断は既存v2作者の原文選択・時点／人物／不明対象の保持・意味重複の改善へ戻す。単にadapter無効／期限延長で解決したとは扱わない。新controller／guard／拒否緩和は追加しない。STRUCTURE_MAP_DELTA_NONE：隔離実績と復元／再開導線の更新のみで、三中核のowner・公開／保存型は変更しない。

<a id="analysis-event-plan-v2-base-control-prepared-20261116"></a>
## 9.106 11/16 — 同じv2指示・形式を固定して追加学習だけを外す対照の準備

本節は実行前の準備時点の履歴。後続の実行・失敗閉鎖・復元と現在の再開先は§9.107を優先する。

§9.105のA11 rawと現native/schema/parser、17教師の全assistant_target・学習結果来歴を独立全文確認した。現candidate34は旧cocolon.analysis.semantic_map.model.v2の直接nodes/edges/overviewで17件を各2更新したもので、events/readings/unit_refsを出す教師は0件だった。ただしN10/N11には後日の確認済みと残る未確認を分ける良い旧graph教師があり、「後日確認の教材自体がない」とはしない。現作者は別の事実/読み/参照への分解を推論時だけ要求している。A11の全入力とspanは実際に存在し、nativeは既出r1を許していた。切詰め・誤profile・誤adapterの具体bugは未発見で、形式差だけを失敗原因とは認定しない。

A3/A4のexact原本も全読し、同messagesでbaseが読書会の後日送信/一人受領を保持する改善と、未開催なのに二階使用をunknownへ足す誤り、照明9反復lengthが併存したことを確認した。旧A4は旧direct-graph形式/120uとの比較で、現v2/34の品質へ移送できない。このため次は指示文・schema・制約・原入力を増減せず、現v2のまま34LoRAを適用しない対照を準備した。17教師/各actualのidentity、因果の限界はtrial semantic_event_plan_v2_base_control_prepared_20261116/adapter_conditioning_diagnosis.jsonへ保存した。

候補API46fff73fe685b6c46d7f4b03c0bdeb003424a5e3は既存native make_handler/load_generator、既存Analysis model sourceとIF sourceの3製品fileだけを変更した。新base専用名cocolon-qwen3.5-4b-analysis-event-plan-v2-base-851bf6eを既存--event-plan-modelへ明示した場合だけ、Analysis鍵/v2 markerでevent_plan_baseを選ぶ。元v2名との相互送信は拒否し、別のmodel名でbase結果を返さない。同120u/34は読み込んだまま、map生成だけ既存base_inference_contextで全LoRAを無効化する。自然/Pieceの2048/8192分岐へ入れず、同Analysis4096/32768とsemanticJSON・全decoder設定・210秒期限を保つ。終了/例外時のeval・全gradOFFは既存finallyを使う。APIは新名だけ同v2材料へ、IFは元4設定を監視したまま120uへ束縛する。新CLI/controller/guard/依存/公開DTO/DB型、意味の拒否条件緩和は0である。

既存test2fileへ、実loopback HTTPの認証/alias/marker分離・共有9回上限、実load_generator closure/実LMFEを通すCPU stand-inで全adapter無効、28672入力＋4096出力=32768境界/超過拒否、forward例外後復元と元event adapter再使用を確認した。4testfile143 PASS/18.86秒（primaryPython3.12.14、pytest9.2/httpx0.28.1/固定LMFE source）。rootの先行2file56件は部分集合として重複加算しない。nativeの変更関数はmake_handler/load_generatorだけで、schema/parser/context/CLIのASTは前版と一致。独立full diffとcaller reviewにblockerなし。これは実GPU・実重みでの生成/意味改善ではない。

同5入力の全messages/request_ref/guard/固定時点、同12記録24欄・同6組planはA11とbyte一致、diagnosticの差はsource_hashes内の3pathだけ。source247の全memberは公開API46fffのGit blobと同byte、ZIP2,584,579byte/SHAdabed616b974628b94743d629f89d7024dfa5e1cf20e33cd2f6f14fa02d156a5。全ASTと新interpreterでの6module importも成功した。既存driverはROOTS/MODEL定数だけを変更し、15検査3.968秒が成功。新finalizerも既存のactual model名束縛1literalだけを変え、8sourceと元SQL input/checkpoint/plan/receipt4原本・同6組・最大16,379byteへ非生成で束縛できた。SQL実行/保存0、元原本は無変更である。

新scope c9aa3d15ea273e02f2de5f9432e171297bdb24c29954bffe01f95711b5ad4624、9,957byte。全9file3,140,114byteのうち、新Pod8d6lpvzb35at8x内A11 payloadの同3fileをcopyし、新6file3,040,359byteを送る準備をした。A12は5件＋前後4対照・最大9応答/復元込み1800秒一回。全5新実source/raw/projection/textのroot+independent全文照合が適切な場合だけ、B12を同12記録6LEAF＋MERGE＋4対照・最大11応答/復元込み1020秒一回。学習/retry/raw修補0、失敗で閉鎖し、旧A11消費済み/B11不成立の承認は転用しない。新scopeは未承認・未送付・未実行である。候補commitのAnalysis43846424667/Piece43846424124は両方completed/successとなり、各job全stepをfresh再取得してfailure0を確認した。実際の送付/実行直前も同sourceの成功状態を確認する。

baseline helper3e515360/proof d759203aは新Pod実A5000のbaseline native d678fe2cへ束縛したままで、新candidate native569042c2の新warm proofへ偽装しない。PID4089/start99099105はA11復元時の最後の記録であり、実開始前のsame PID/start/argv/env/cwd/native/adapter/client/proofを検査する。今は新Pod操作も0。新exactscopeを承認された後に一回だけ実行し、新全12意味→同最終raw一回disposable SQL保存→別process非生成再読→通常native/API-worker整合反映へ続ける。内部healthを通常4B疎通へ換算せず、現Render endpointと新Pod bridge/認証は未確認のままである。通常設定/配備、SQL保存、通常反映0、元単位/補助全体/正式受入れ未完・build/TestFlight/本人実機保留を維持する。

private5材料と診断の保存原本はtrial/private_material_receipt.jsonへ記録し、実行code/scope/manifestとbody-free検証/独立reviewはGitへ残す。全sourceはexactAPIと既存source builderから再構成し、各member/ZIP SHAを照合する。STRUCTURE_MAP_DELTA_NONE：既存owner内の有限な対照準備のみで、三中核の通常利用目標や責務を変えていない。


<a id="analysis-event-plan-v2-a11-newpod-actual-20261116"></a>
## 9.105 11/16 — 新GPUへ同資産を復元してA11を実行、最初の分析で失敗閉鎖

§9.104の認証待ちは解消した。新Jupyterの安全な認証が完了し、追加tokenは不要である。値はpayload／Git／logへ保存していない。新Pod8d6lpvzb35at8xの実GPUはRTX A5000 24GB、Python3.12.3／torch2.8.0+cu128／triton3.4.0。通常120u ecbdd0d1/4389a598と候補34更新2f33f9be/09ac18caを保存原本と同byteへ復元した。固定Qwen3.5-4B revision851bf6eの11file/9,342,816,694byteを公開原本から取得し、保存manifestの全SHAと一致した。408fileのCPU client tree07c2ac87も一致した。旧全volume残存は未確認だが、この続行に必要な主要保存資産は回収できた。再学習による代替ではない。

既存kernel probeを新実identityへ最小更新し、A5000 capability8.6で7数値parity・有限性、2回の1752token warm、252依存tree不変を確認した。probe81.427326秒、proof d759203a。旧Ada GPU proofを流用しない。既存helper/driver/scopeだけを新PodのbaselinePID1106/start98995881と新proofへ束縛し、実行前原本をCocolon e625f7acへ保存した。driverのAST差分はHELPER_SHAだけで、原5input／guard／固定時点／同12記録24欄・同6組、出力上限、生成数／復元時間は保持した。3fileは新Podへ回収済み同byteからPod内copyした。source247fileはAPI7bb605bの確定原本を使い、Analysis43828489239／Piece43828489257両CI成功を継承した。

同scope6317b267で承認済みA11を一回実行した。新baseline nativeは公開API7bbのd678fe2cで、旧private native ad3d301dの同一復元ではない。元120u adapterと自然base profileを保持し、保存Piece344a候補は元argvにないため追加しなかった。model用一時鍵は新Pod内でのみ生成・使用され、Jupyter認証値と分離して外部へ保存しない。前対照2件はHTTP200/stop、次の読書会もHTTP200/stopで完結rawを受領したが、既存compilerのanalysis_semantic_event_plan_orphanで拒否された。実3応答／最大9、追加学習／retry0。残4件と後対照は未実行で、前後同値成立を主張しない。

読書会の2eventは到達可能だったが、唯一のreading r1が全node/edge/overviewのunit_refsで未選択となり、既存intent_compiler.py:4146の条件で適切に拒否された。原2記録4欄、prepared、受領rawを華恋と独立担当が全文照合した。初日の書きかけ削除が完了した変更へ変わり、翌日の一階予約・会場返信を読んだ確認・案内送信・一人受領がeventから落ちている。参加者受領のnodeは椅子照会eventだけを参照し、readingにも選択event根拠外の本人行為が入る。今回のrawを「後日の確定を明示的に不明へ戻した」とは記録せず、確定事実の欠落と根拠混同を区別する。図／本文は未生成、独立全5件適切条件は不成立であり、B11は起動していない。

復元込み192.170569068秒（上限1800秒）、driver128.331628437秒。新Podの実行前baselineへargv/env/cwd、同native／両adapterを復元し、PID4089/start99099105・health200を確認した。別読取でもargv／adapter一致、候補PID3048不存在・18008閉鎖・B11root不存在を確認した。A11一回は消費済み・失敗閉鎖であり、残時間や未使用B11を追加試行へ振り替えない。新しい具体的GPU試行は未準備／未承認である。

遠隔14file exportは22,927byte／SHA79eda51294b4c37e23e7dd8b5cc325f3d003d18c4a54f70e30c940515b720cf6、全CRCと各memberの同byteを確認した。after.result40,465byte／SHA d5b0103e5820530153fd408746aadb53a3e94dac43a6bf96f740b4e50ec7c266、読書会raw SHA d96f825c3ae828709f2c7f128e4f75278e610801ce4ea05b501877b7530b89eb。受領原本は修補／別messagesへの再束縛なし。公開trial semantic_event_plan_v2_a11_newpod_actual_20261116にbody-free receipt／execution／復元証跡／独立技術・意味reviewを置き、source本文／raw／logはprivate実結果へ保持する。

通常4B接続は別の未確認境界である。内部health200と隔離候補のEmlis/IF前対照を、実アプリ/API/workerの新Pod到達・認証・通常応答成功へ換算しない。最後の通常接続資料は旧Podを指すが、現Render endpointの値はfresh未確定なので旧値の継続も断定しない。旧native42367byte/SHAad3d301dは保存原本で回収一致したが、新Podへの送付／有効化なし。新bridge／通常鍵の移設、Render設定／配備、SQL保存／同raw非生成再読、通常反映は0。新候補は通常不採用のままであり、通常反映を含む元単位／補助全体／正式受入れは未完、配布保留である。

primary outcomeはSAVED_ASSETS_RESTORED_AND_FAILED_ATTEMPT_CLOSED。データ回収と新GPU上の実行・復元は成立したが、作者の意味品質と全12・同raw保存再読・通常接続／反映は成立していない。新controller／新guard／拒否条件緩和で成功へ変換しない。STRUCTURE_MAP_DELTA_NONE：隔離移設と実結果の更新のみで、商品owner／入口／公開型／DB型を追加しない。


## 9.104 11/16 — GPU停止後の保存原本回収と、新Podでの承認済みA11/B11再開

MashはA11／条件付きB11を承認したうえで、残高不足により旧Pod f1lle4xwq3wjlnが停止し、新Pod8d6lpvzb35at8xをレンタルしたと連絡した。「新しいGPUで続きからできるなら進めて」と明示し、GoogleでRunpodへログインする方法を指定した。A11/B11の実行自体はまだ始まっておらず、枠未消費。旧scope6c2c2a51の準備時点の未承認表示を現在の承認不足へ戻さない。

通常120uの実weight ecbdd0d1／config4389a598は保存原本Cocolon_Analysis_Semantic_Map_Training_20261107.zipで回収し、完全SHAを照合した。候補34更新の2f33f9be／09ac18caもConcreteReadingの実memberで一致。保存Piece344a候補は入れ子ZIPまでCRC・SHA一致したが、A10元argvに--piece-adapterはなく、通常Piece/baseと混同しない。A10実原本25memberと入れ子元14member、全12元input bdb872a5／checkpoint801ba068・固定SQL原本、portable SQL／client／LMFE等も回収可能な実体を確認した。全詳細hashは既存trial a11/new_pod_recovery_20261116/recovery_state.jsonに置く。主要adapterを再学習せず同byteへ復元できるが、base全shard／旧全venv・CUDA binaryの保全と、新GPU互換性までは認定しない。

新Jupyterは認証画面を表示。初回の安全なJupyter入力はキャンセル後、Mash指定のGoogle経路でRunpodログインを進めた。Googleと保存accountの選択はbrowserAuthでsubmittedになったが、fresh Runpodページは未ログインのため認証完了としない。Pod内のmount／GPU／ファイルは未確認。旧Podの全volume残存／削除も未確認である。認証を引き継ぎ、新Podへ入れた後に現物を確認する。

新Podへの続行では、旧PID／start／envや旧RTX4000Adaのwarm proofを流用しない。保存済み同weightと既存native・client依存を必要な範囲で復元し、新Podのbaseline提供実PID／start／argv／env／cwdと、新GPUでの既存kernel確認結果へhelper／scopeを最小再束縛する。3入力を旧Pod内copyできなければ手元の同hash原本から送る実態へ更新する。新controller／別method familyは作らず、鍵をpayload／GitHubへ残さない。実行identityだけの移設であり、旧rawを新messagesへ束縛しない。

承認済みA11は5件＋前後4対照・最大9応答／復元込み30分、一回。全5新実source／raw／図／本文がroot＋independent全文照合で適切な場合だけB11を全12記録6LEAF＋MERGE＋前後4対照・最大11応答／復元込み17分、一回。学習／retry／raw修補0。GPU変更を追加の実験枠へ換算しない。適切な新全12実結果→同raw一回SQL保存→別process非生成再読→互換native／exact API-worker通常反映まで同じ未完単位を保持する。API7bb605bのsourceと両CI成功は継承。今回model call／Pod転送／SQL write／通常反映0、正式受入れ／補助全体未完、build／TestFlight／本人実機保留。STRUCTURE_MAP_DELTA_NONE。


## 10. 変更箇所と検証

### 10.1 実装候補の所有箇所

| 対象 | 既存path／symbol群 | 変更方針 |
|---|---|---|
| natural本文 | `cocolon_meaning_experience_engine/natural_reply.py`、`emlis_thread_service.py` | 形式と意味を分離し、実証済み比較を保存前へ。現声・provider契約・受領再開を維持 |
| sourceと更新 | `source_kernel.py`、`emlis_thread_source.py`、`emlis_thread_history.py`、`emlis_answer_update.py`、thread store | 有効本人source／根拠／権利・訂正の既存ownerを再利用。重複作者を追加しない |
| 旧意味・文章・逆検査 | `emlis_ai_grounded_observation_plan.py`、`emlis_ai_grounded_sentence_surface.py`、`emlis_ai_grounded_human_reception.py`、`emlis_ai_grounded_observation_gate.py`、CMEE `emlis_stage1_*` | 能力・supported reader・変異vectorを抽出。旧文型依存は現naturalへ強制しない |
| Piece | `piece_source.py`、`piece_semantic_admission.py`、`preparation_sources.py`、`piece_v1c.py`、`piece_model_source.py`、`piece_v2_generation.py`、既存preview／Safety／source adapter／保存／renderer、RN `features/piece/pieceApi.js` | §7.1の4B候補→CMEE意味保持→既存B8／保存へ接続。画像・権利・保存を別作者へ移さない |
| Analysis | `cores/analysis/{source_adapter,semantic_admission,intent_compiler,observed_route_realizer}.py`、累積／semantic_map service | source→Engine→graph→同図／本文を継承。IF等は既存専用責務に限定 |
| 教材・評価 | 既存`observation_learning/`、API `ai/tests/fixtures/emlis_nls_v3/`、既存生成比較runner | 原本・用途・学習露出を保ったまま現比較へ。独立運用systemを新設しない |

本書の論理型・関数・test名は未実装。実装時は同責務の既存箇所を優先する。API／DB／RNの公開contract変更が必要になった場合は、具体的な差と既存互換を該当正本へ設計する。広い活用許可を理由に仕様境界を黙って変えない。

### 10.2 検証の対象

| 検証 | 必須にする観測 | 避ける読み替え |
|---|---|---|
| 意味の正負対照 | 主体／否定／時点／留保等を変えた誤りを検出し、同義・省略・短い正常返答を誤拒否しない | 旧構文の検出率を自由文全体の意味精度へしない |
| readerの限界 | 未対応・曖昧・片側読取失敗がUNASSESSEDとなり、coverageを欠かさない | 解析不能を誤り／合格に変えない |
| source・更新 | 他人／別版／削除／失効／撤回、両欄・全入力項目、過去と当回 | metadata一致だけで解釈正当性を認めない |
| 生成・回帰 | 同入力前後、別題材、既成功、集合での反復・深さ・問い | loss・件数・拒否率だけを品質改善としない |
| 保存・復帰 | 候補受領後中断、保存ACK不明、同source再開、保存後非生成再読 | 再開で二度model呼出し、旧保存物の黙った置換をしない |
| 他core | Piece核・条件・画像、Analysis関係・根拠・unknown／IF | Emlisの声や必須文型を他coreへ移さない |
| 通常採用 | 追加call・待ち時間・費用・失敗時の挙動と実保存 | offline／stub／隔離SQLを本人端末・本番成功にしない |

既存の `test_emlis_natural_reply_application.py`、`test_emlis_cmee_body_inverse_protected.py`、`test_cmee_nls_v3_relation_authority_inheritance.py`、`test_cmee_historical_failure_axis_receipt.py`、`test_b08_cmee_piece_consumer.py` 等を、対象責務の回帰として選ぶ。新自然文比較の正負対照が既存testで表せない場合、同じAPI test配下へ焦点を絞ったtestを追加する。既存protected fixtureや過去の失敗期待を成功にするため変更しない。

test runnerは既存runtime正本に従う。今回の設計保存では製品test・GPU・DB書込は未実行。文書のリンク、対応表、用語・状態の矛盾、GitHub保存内容だけを検証する。

### 10.3 各実装単位内で現物確認する事項

- Emlis既存commit RPCとreaderが、新しいprivate reportの任意項目を旧保存版と共存させられるか。意味衝突を既存失敗へ接続した時に、RNで不要な再生成を誘発しないか。
- 旧有限readerのどのsymbolを自由な本人宛文へ移せるか。二人称・省略主体・指示語・否定／時点scopeの正負対照で確認する。
- 旧body-free failure軸から、保存された教材原文／実出力まで戻れるか。原文やhuman判定がない箇所は創作せず未取得とする。
- 現4B実出力での見逃し・誤拒否・未判定・実行時間。候補model readerを使う場合の精度・費用・GPU競合。
- source編集／訂正／削除／owner変更／権利失効が、receipt、Piece候補、現在map、月次へ及ぼす実依存と既存保存方針。
- Observed以外のIF／Savedの未実装境界。Observedの保存成功で代用しない。

これらは各商品単位の実装・検証内で確定し、その全部を先に調べ終える独立した前段工程にはしない。

## 11. 完了と進行の記録

### 11.1 「活用できた」の条件

能力ごとに、旧資産の由来、現owner、通常／開発での実呼出し、改善前後の同じ商品結果、回帰・誤検出・未対応、保存再読、採用状態を示す。全部の旧fileをimportすることは条件ではない。回収した能力が役立たなかった場合は、効果なし／誤拒否／費用等の実理由を残し、未実証を成功へしない。

全体は、必要な回収対象を取りこぼさず処置し、採用した能力が該当する現在の三中核の経路で機能し、残る未実装・未採用・未判定を特定できた時点で評価する。全coreの正式商品受入れや既存発売条件を、この作業の文書完了から追加・変更しない。

残件を特定しただけで活用完了とはしない。必要と採用を決めた能力の未実装・未接続、実商品結果への未適用が残る間は継続中とする。個別能力の実証不能／非採用と、必要な残件の放置も区別する。

設計、実装、局所検証、実モデル、通常稼働、実DB／端末、正式受入れを分けて記録する。華恋の全文確認は、明白な不足をMashへ戻さない事前確認であり、本人の正式受入れを代行しない。

<a id="112-現在の進行欄"></a>
### 11.2 現在の進行欄（11/18 JST・A37）

通常MAPは最後の統合が共有時間枠に達し、未完の応答が棄却され保存前に503となった。通常コード・時間設定は変更していない。最終段階に残る時間を確保してから通常生成・本人のDB保存と同一ID再読を確認する。

以下は§9.126時点の履歴。主枠は第11回§5を継承する。候補e58c1e49／凍結17upload＋4copyによりFIT25を54更新・4計測・112保存reload一致／復元まで592.445476秒、A25を全5件19応答／元120u復元まで844.331987秒で各一回完了した。root全5の全文照合は意味不適合で通常不採用、独立全文照合も全5不適合。B25条件不成立・起動0、実全12・同実raw保存再読・通常反映0。候補／教材／738固有test・両CI・合成SQLの準備履歴§9.125とA24実績§9.124を保持し、消費済みFIT25／A25と未使用B25を次試行へ流用しない。元単位／補助全体は未完。

| AR | 現在の成立範囲 | 残件・次の到達点 |
|---|---|---|
| AR-01 | 役割・時点の能力、共有active meaningをnaturalの既定材料へ接続 | 一般本文での役割反転・付加・時点誤読と語り方の改善。研究hint／新重みは未採用 |
| AR-02 | 最大3問・設定・skip／終了、二入力訂正・有効更新／依存失効・OBS同時保存を通常DB／APIへ接続 | 一般自由文の問い判断・回答後本文、配布／本人一巡 |
| AR-03 | 本人原根拠・適格履歴・frame対象と本人判断・下流失効を保持 | 実4Bでの過去／今回と拒否／修正の扱い、一般履歴品質 |
| AR-04 | §9.72の実1〜3回答＋複数proper訂正と最新回答明示選択を既存作者／S7・保存再読へ接続、通常DB／API反映済み | 一般自由文・回答／置換節への再訂正、編集品質・本人利用は未完 |
| AR-05 | source duties・有効訂正、現在mapの項目／線への二入力訂正と次回分析材料・独立根拠表示を通常反映 | 本人基準・条件差・記録間関係の意味品質、配布／本人利用 |
| AR-06 | 本人認証・架空12件の準備と通常MAP単発試行まで実施 | §9.203。生成要求と後続の非生成GETは別々に503を記録。通常保存・同一ID再読は未確認 |
| AR-07 | 適格現在map＋本人意向／制約、必要確認、1〜3候補、Savedと再読削除・受領復帰を通常反映。標準自動3案も§9.67の限定1set・同raw保存再読まで成立 | 条件／負荷／未知と§9.68の同display内Saved印を保持。一般品質・本人利用・AR-07全体は未完 |
| AR-08 | B53後に元の120uをPID 42240で復元し、試験ポート閉鎖を確認 | §9.182 |

以下は§9.126時点の履歴。v2候補・教材／CPU／合成SQL準備は§9.125、A24実績§9.124、v1実装§9.123、A23実績§9.122へ保持する。FIT25の54更新・保存reloadとA25の完結は成立したが、全5意味適合・実同raw保存再読・通常採用は成立していない。教材と概要順の混合効果を分離せず、旧教材の再要約・最大4記録等の限界を保持する。次はPLAN選定／教師構成と実rawの対比を直接修復対象とし、同趣旨の禁止文追加だけを成果にしない。新具体修正／学習／GPU試行は未準備・未実施。

## 12. 今後の指示と再開方法

**11/20 JST・現在の再開先は§9.203。** 通常MAPは最後の統合が共有時間枠に達し、未完の応答が棄却され保存前に503となった。通常コード・時間設定は変更していない。最終段階に残る時間を確保してから通常生成・本人のDB保存と同一ID再読を確認する。

**11/18 JST・§9.128時点の再開記録（履歴）：A26全5原本とroot／独立全文照合を基に、既存作者の選定・時点・派生表現を一体で具体化する。** FIT26／A26は消費済み、B26条件false、53ab不採用。追加学習や旧onceの再実行を既定にせず、実全12・同raw保存再読・通常反映の未完を保持する。下記は前回までの経緯である。

**11/17・現在の再開先：§9.126の実原本・全5不適合から、既存作者のPLAN選定／別場面結合と教材構成、派生表現の意味保持へ戻る直接修復。** FIT25は54更新・4計測・保存reload112／復元、A25は全5件19応答・復元を完了したが、root全5意味不適合、独立全文照合も全5不適合でB25条件不成立。両一回は消費済み・B25未実行、実全12／SQL保存再読／通常反映0。§9.125の準備原本・教材と既存CI／合成SQLの限定技術credit、旧実績は保持する。既存指示・教師の対比を確認し、同じ禁止文を足すだけで実改善とはしない。新具体修正・学習／GPU試行は未準備・未実施であり、未使用B25や消費済み枠を流用しない。適切な全12実結果→同raw実保存再読→通常反映まで元単位を維持する。

適切な全12結果→同じ最終rawの一回SQL保存→別process非生成再読→通常native/model identity・map/IF選択境界・自然/Piece profile・API/worker整合までは未完。旧core b489／旧source7hash／旧取得前plan75daa8は凍結済み原本として保持する履歴であり、A8 rawの現在のsource束縛へ戻さない。A8各rawはAPIc258cf0e／driverfbe0109a／native3555e17aと、diagnostic_preparationの5事例それぞれの元入力／guard／messages／request refへ束縛される。新plan af8a1a75と元SQLcheckpoint801ba068／guard a000deb9／凍結as_ofは、未実行B8の全12記録用準備として保持する。今回rawを別receiptへ再束縛せず、通常修正は適切な新実結果による既存frozen checkpointの保存／再読を先に完了し、未評価のIFへmap候補重みを広げない。通常24bc228d／DB20261115011424・worker900・通常alias未変更、build／TestFlight／本人実機保留、本単位／補助全体／正式受入れ未完を維持する。

[改訂前§12の再開記録](https://github.com/MassyuRed/Cocolon/blob/a770355c7a0518afecdaf80b41a67a323023829c/Cocolon_前提資料/designs/cmee/Cocolon_CMEE_AuxiliaryAsset_Reuse_ImplementationDesign_20261108.md#12-今後の指示と再開方法)は履歴。本人更新・素材の資格／有効版・実本文／図／画像・同版保存・通常適用の未完単位から継続し、各局所比較を毎回の続行指示待ちの区切りにしない。

推奨指示は **「補助経路の活用作業を進めて」**。

この文は、本書に沿って、現在のCMEEへ必要な旧能力・資産を回収・改修・接続し、§9.1の能力群を該当coreへ移管する実装・実出力改善・保存再読・必要検証・GitHub反映まで進める指示として解釈する。設計書の読み直しや追記だけで止まらず、再設計が具体的に必要なら同じ作業内で更新する。

「補助経路の活用作業を続けて」「補助経路の活用の続きから再開して」も同じ意味。現在の会話が本書を指すと明確なら「補助経路を進めて」でも解決する。明確な別対象と衝突する時だけ対象を確認し、毎回方針や既承認の改修許可を問い直さない。

再開時は、全体現在地・current作業規則と恒久incident・最新weekly→本書§11→対象map・fresh実装／保存原本へ戻る。別sessionで完了した単位は繰り返さず、差分から次を選ぶ。System Contextの旧cache再生成や全旧資料の再棚卸しを再開の追加条件にしない。

「8月のG0–G10を再稼働」「旧controller／Inspectorを動かす」「新しい補助system一般を作る」とは解釈しない。費用・本番設定・配置・build・公開等は、該当する既存許可と現在の明示指示で判断する。本書で新たな承認chainを作らない。

## 13. 資産対応表の読み方

以下の付録は回収範囲を確認するための本書内の対応表であり、独立した実行台帳ではない。既存source／symbol／vectorへの対応と、未精査の箇所を区別する。実装時に当該原本を読み、現ownerへ取り込んだ後の実商品結果まで確認する。付録の行があることを回収完了としない。

### 13.1 接続先の略号

- N: ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py。本文確認済み: prepare_natural_reply / _answers / _source_safety / validate_reply / SelfHostedNaturalReplySource.__call__。
- E: 同engine.py。本文確認済み: MeaningExperienceEngine.generate / _generate_original_body / prepare_emlis_update。AnalysisSemanticMapInput exact-type dispatch、Piece、thread、旧offlineの分岐を保持。
- S: 同source_kernel.py、emlis_thread_source.py、emlis_thread_history.py、preparation.py、preparation_sources.py、emlis_answer_update.py、emlis_semantic_admission.py。tree存在。旧source_role資格/通常admissionを再利用する接続先。確認済みsymbolは本書§14、未精査のsymbolは各商品単位で実本文へ戻る。
- M: 同emlis_input_specific_meaning.py / emlis_stage1_composition.py、および上位emlis_ai_grounded_observation_plan.py / emlis_ai_grounded_sentence_surface.py / emlis_ai_grounded_human_reception.py / emlis_ai_grounded_observation_gate.py。旧有限responsibility owner。map §31で責務移管の事実、現自由文での全利用は未成立。
- G: ai/services/ai_inference/cocolon_text_generation_core/ のcomposer.py/evidence.py/sentence_plan.py/guards/*/result.py/types.py/policies.py等。既存common guard、上位meaning authorityへ昇格しない。
- P: 同CMEE piece_source.py / piece_semantic_admission.py、piece_v1c.py、既存Piece compiler/唯一作者/renderer/保存owner。本文/画像用に適合。
- A: 同CMEE cores/analysis/source_adapter.py / semantic_admission.py / intent_compiler.py / observed_route_realizer.py、analysis_cumulative_service.py。model-derived graphをsource/原requestへ再束縛、唯一realizerで図/本文/privateを作る現owner。
- Q: 同emlis_question.py / emlis_answer_update.py / emlis_thread_engine.py / emlis_thread_projection.py、および通常emlis_thread_service.py。新naturalへの問い/補足接続は未完了として設計。
- V: 既存trial/教材/比較runner/current100/継承testsの評価作業。新独立運用製品を作る意味ではない。原入力/4B raw/実本文/採否/保存版/品質判断をprivateに対応づける。
- C: 必要時の再現束。model/adapter/prompt/設定/依存/実行終了理由/時間を再実行可能な最小入力として保持。旧controllerやFD authorityは通常運転させない。

### 13.2 D01–D51の全分類と接続先

現owner欄は現在の責務の受け先と今回の設計先を併記。採用完了を主張する表ではない。sourceの存在、symbol本文確認、現call到達、実品質効果を区別して実装時に埋める。

| ID | 旧責務・asset | 判定 | 既存source/symbol/testの起点 | 現CMEE接続先 | 商品への具体的効果 | 完了証拠 | 重複/境界 |
|---|---|---|---|---|---|---|---|
| D01 | App-Reachable Input / input projection | 採用＋現raw契約へ改造 | emlis_ai_current_input_bundle.py、source_kernel、N._material | S→N、P/Aは各source adapter | 欄/カテゴリ/感情/記録時点と出来事時点を取り違えず実app入力へ接続 | 実RN/API由来shape→同private材料→同出力の対応。架空caseだけを実入力適合へ昇格しない | S07/D02/D03を共有。Emlis固有inputは専用 |
| D02 | original/supplemental/history source role | 採用・接続不足を改造 | S、N._answers / prepare_natural_reply | 三中核source責務＋Q更新 | 補足や過去で原入力を上書きせず本人情報とAI文脈を分離 | 原入力不変、補足別source、問文が本人事実にならない、履歴訂正/失効時の再読 | D27/D29/D50と重複。role検査ownerは一つ |
| D03 | exact evidence span/range/hash/provenance | 採用＋自由文/graphへ適合 | emlis_ai_evidence_ledger_service.py、S.freeze系、P/A source | S＋current品質照合 | 生成の意味を元根拠へ戻す。文字一致だけで意味正解としない | offset/Unicode/同文反復/別欄改変拒否＋主体/否定/時点の実照合 | D15/D28/D50と同じ原文hashを共用 |
| D04 | Semantic Obligation Inventory一般 | 改造 | semantic obligation inventory v3、CMEE SourceOwnerUniverse/ExperiencePlan | Sで根拠付き責務→N/P/A固有採否 | 残す意味・許容省略・unknown・禁止追加を現在の商品に合わせて扱う | 重要意味の追加/消失/確定化を区別、短い受取りや一度の言換えを不当に拒否しない | D10/D12と責務の選択/順序を分離 |
| D05 | Emlis固有観測/Reception/depth | 改造 | Mのgrounded plan/reception、N.SYSTEM_MESSAGE | Emlis候補生成・品質評価 | 本人宛で自然に受け取り、深読み・比率を固定しない | 最低応答基準で全候補読解、同型定型や不要助言の偏りが減る | S08/S10/D17/D24。旧二段強制は復帰しない |
| D06 | semantic units / meaning nodes | 改造＋既存型再利用 | M.emlis_input_specific_meaning、A/P semantic admission | CMEE意味候補/評価の共通責務、各core projection | 語一致でなく誰/何/状態/選択/未確定の単位へ読む | 自然文の省略/言換えを含む未知題材で単位保持、分析graphと本人sourceを区別 | D07/D14/D45。共通schema凍結は実二consumerの一致後 |
| D07 | relation/predicate/argument/scope/polarity/time | 改造・重点 | M、relation inheritance tests、A semantic graph | N意味検査＋A関係＋P意味保持 | 主体反転、否定述語混線、事前/事後、希望と実行の変化を検出/改善 | 単独語一致でも誤る自然な対比群、正しい言換え受理、修正前後のactual差 | D08/D21/D36/positive mutationと一元化 |
| D08 | unknown/open slot/ambiguity | 採用＋自然文へ改造 | source_kernel/M/Q/A UnknownGap系 | 全coreのepistemic責務＋必要問い | 本人認識/推測/不明を事実へ昇格しない | 本人不明と解析不能を分ける、保持すべき不確かさが出力/訂正後にも残る | D09/D22/D26。unknownだけで毎回ASK/全面拒否しない |
| D09 | forbidden inference / negative knowledge | 採用＋対象粒度を改造 | G.overclaim_diagnosis/grounding、M、N.SYSTEM_MESSAGE | core別品質判定/必要なruntime拒否 | 原因/人格/診断/意図/未来の未根拠追加を検出 | 明示事実/本人認識/妥当な受取りを区別。引用のある誤因果も落とす | S10/D20/D51。文体好みを危険判定へ混ぜない |
| D10 | Content Selection一般 | 改造 | content_selection_v3、M candidate selection/ExperiencePlan | 各商品生成前選択＋N候補評価 | 何を返すか/省くか/未決にするかを商品価値に結ぶ | 中心維持と許容省略、重要unknown/対比の欠落、同じ負荷対象偏重を実本文で比較 | D04は責務母集団、D10は今回選択、D19は候補選択 |
| D11 | Emlis sufficiency / depth / NORMAL LIMITED ASK | 改造 | M選択/Q、現N初回reply | Emlis本文/問い判断 | 短い日常には短く、情報量に応じた受取り。問いで弱さを隠さない | 短文/相談/不明で適切な出力、無質問ENDと必要一点ASKを区別 | D05/D26。旧availability率や固定深さを復活させない |
| D12 | plan-before-surface / duty binding | 改造 | M Observation/Sentence/Reception plans、G.sentence_plan | N自由文生成の意味条件、P canonical/visual、A graph projection | 本文へ重要意味が実際に出るよう制約し後付け整合を防ぐ | 同一意味条件→actual本文/図の対応、metadataだけ一致する失敗を検出 | D04/D10/D16。旧5段全packet強制とは別 |
| D13 | Emlis visible block order | 履歴形式は保持・現在の一応答へ改造 | 旧two_stage、N natural reply | 現Emlis表示/保存DTO | 本人宛で読める応答を保ち、不必要な見出しやJSONを出さない | 現実機の同一保存本文が再読され、旧saved DTO互換維持 | S08/D25。同じ二段文面を全coreに要求しない |
| D14 | typed AST / intermediate structures | 必要型採用＋旧AST改造 | contracts.py、M、A/P typed graphs | 責務を分けた内部型 | 本人sourceと候補意味/生成物/品質判断の混同を防ぐ | 型/版/refs検査＋実意味整合。型成立を理解成功に換算しない | D06/D50。旧AST class全bytes移植は不要 |
| D15 | semantic anchors / must-keep | 改造 | G.must_keep_coverage/evidence、M、P/A evidence | 独立意味照合とcore別coverage | 表現が変わっても重要意味・条件・不明が残るか確認 | 同義語/省略許容と意味落ちの境界、surface quoteだけの偽成功をreject | D03/D04/D21/D44/D45で同じ証拠を再計算しない |
| D16 | plan-bound realization一般 | 改造 | M sole author責務、P/A compiler→sole realizer | Nは4B候補＋CMEE採否、P/A現作者 | 最終出力の実意味を本人根拠/採用意味へ結ぶ | 変異した意味が意図した可視箇所へ出て非対象意味が保持される | D12/D28。作者を二重にせずplanメタだけで合格不可 |
| D17 | Japanese naturalization / voice / repetition | 改造 | 旧natural_surface/grounded_sentence/reception、G.coherence/template、N | 4B自由文の学習/生成/比較 | 現在の自然な本人宛応答を改善、旧有限定型へ閉じない | 文法/語り手/一人称/不要反復/異題材偏りの全文読解、短い言換え許容 | D05/D18/D24/D37。旧完全語句期待の正解化を避ける |
| D18 | multi-candidate generation | 改造・保持対象 | 旧NLS candidate set、current runner/realizer知識 | V候補比較→必要時runtime候補生成 | 同じ意味で自然さの異なる候補を比較し単一弱候補への固定を避ける | 同一入力/意味条件/モデル版、候補別意味保持と人読、費用/遅延/多様性 | D19。全通常返信を無条件多callにはしないが能力は省かない |
| D19 | candidate comparator / selection | 改造・保持対象 | 旧candidate comparator、G.result、M selection | CMEE source/意味妥当性→品質選択 | 自然さ点で意味誤りが勝たず、最適な受取りを選ぶ | 意味invalid排除、同義候補同士の選択説明、同点/不明/全不適格の扱い | D10母集団選択と区別。model自己confidenceを唯一根拠にしない |
| D20 | hard semantic validation | 採用＋現構文自由度へ改造 | G guards、M gate、A/P semantic admission | 共通責務＋core専用意味検査 | 意味追加/破壊を見つける。弱い文章をただ全面非表示にしない | 実誤り検出と正常言換え受理の両方、判定不能を正解/誤りへ断定しない | D09/D21/D22。形検査と意味判定を別status |
| D21 | body-only inverse / completed text reverse | 大きく改造可・重点 | emlis_ai_grounded_observation_gate.py / sentence_surface body parser、independence tests | 現4B自由文を独立読取→原入力と照合 | 生成側の自己申告graphが正しくても本文が誤る失敗を防ぐ | 本文だけから主体/述語/否定/時点/留保/感情所有を読み出し、原文比較。forward witness参照禁止の変異試験 | D03/D07/D15。旧632KB gate全体call/旧出力文法の強制は不要 |
| D22 | abstention / UNAVAILABLE / fail closed | 採用＋拒否粒度改造 | EngineOutcome、N provider failures、既存service | 現outcome/保存/表示 | 取得失敗・形式不正・意味不正・判定不能を混ぜず古い本文を新意味として返さない | 中断/再読/明示再試行/未確定結果が整合、入力や保存済み本文を失わない | S19/D08。語法品質の低さを全てhard blockにしない |
| D23 | observation taxonomy | 改造 | 旧観測duty/grounded plan | V教材coverage＋Emlis商品選択 | CURRENT/RELATION/CHANGE/INTENTION/CONSTRAINT等を読み分ける | 分類labelを返すのでなく実本人宛応答/必要問いに効く | D05/D10。分類そのものを商品出力へ貼らない |
| D24 | Human Reception binding | 改造 | grounded_human_reception.py、N current prompt/training | Emlisの自然な受取り | 誰の何を受け止めるか、本人/他者/Emlisの感情を混ぜない | 別題材でも同じ締めに偏らず、観測反復を増やさず本人宛となる | S10/D05/D17。旧target+attention+whyの固定作文は継承しない |
| D25 | observation / Emlis follow product roles | 現在仕様へ改造 | 旧2層契約、N | 現一つの本人宛応答＋saved互換 | 受取りと観測の意味役割を保ち二重説明を避ける | 最新最低線に従う本文読解。長さ/比率/節の固定なし | D13/S08。旧形式の強制は履歴 |
| D26 | question need / one-point / burden | 改造＋新naturalへの接続設計 | emlis_question.py、Q、source未知/曖昧 | 現Emlis問い合わせ責務 | 本人にしか確定できず意味が変わる一点を質問、不要なら終了 | 実pending→本人回答→更新→終了。反復質問・質問圧・原因誘導を検証 | D08/D11/D27。旧ASK率目標や常時質問化は不採用 |
| D27 | supplemental answer refinement | 採用基盤＋接続改造 | emlis_answer_update、Q、N._answers | current natural/thread→P/A本人補足材料 | 回答分だけ理解を更新、原入力/AI文/本人訂正を混ぜない | ADD/REVISE/WITHDRAW/併存・依存関係・保存中断再開・完成非生成再読 | D02/D26/D50。新naturalで未接続の分を完了へ数えない |
| D28 | positive realization trace | 改造 | CMEE VisibleUnitTrace/positive trace、M、A/P evidence | 採用意味→actual可視文/図/画像への対応 | メタだけ生成して本文に出ない問題を検出 | visible単位ごと根拠/意味/版の対応、metadata-only wrappingの拒否 | D03/D12/D15/D16。同じtraceを別台帳へ重複しない |
| D29 | private body-full / public body-free | 採用＋情報最小化 | S01/S02/X01、existing errors、N.NaturalReplyError | private評価束と公開summary | 改善担当は実全文を読めるが公開GitHubへ本人原文/秘密を出さない | private全結果との対応、公開payload漏れ0、error/trace/logの本文漏れ確認 | S01/S02/S11/X01を同一評価保存責務へ |
| D30 | current100 corpus / app input identity | 評価資産として改造 | current100 fixture/manifest/runner、bridge test | V回帰・旧失敗再現群 | 旧教訓と新4B題材の比較母集団を保つ | 由来/既使用/教師/未知を区別、旧100成功を新一般品質へ換算しない | D31/D35/D37。新毎call runtime前提にはしない |
| D31 | batch cumulative regression | 改造 | current100/G8 runner、existing trial runners | Vfocused＋節目batch | 局所修正が既改善を壊さないか確認 | 変更原因群＋既成功controls＋未使用題材。同一case/actual版比較 | D30/D32/RegressionSelector。毎小変更full全量必須は退役 |
| D32 | changed-output reread | 採用 | 旧product read tooling、current reading_review/README | V同一保存版の前後レビュー | 変更本文を実際に読み合否を更新する | 変わった全本文と必要controlsを全文読取、旧reviewを新本文へ流用0 | D34/S11。hash一致だけで読了しない |
| D33 | machine/human separation | 採用 | 旧G6/incident/current outcome/results | 全core受入境界 | 型/保存/JSON/引用一致と本人に伝わる品質を分ける | 機械・華恋screen・Mash受入れ・実機を別欄で記録 | S03/S05/D34。新承認連鎖system不要 |
| D34 | Emlis Product Read axes / full body | 現在基準へ改造 | 旧12/13軸、最新weekly§17/18/19 | V Emlis品質評価 | 意味保持/自然さ/本人宛/不要反復/再利用価値を実文で判定 | 全候補screen・残差・本人受入れを区別、短い返事や一度の言換えを許容 | D05/D17/D32。旧必須depthや観測:follow比は不採用 |
| D35 | recurring failure / before-after / causal localization | 改造・全範囲保持 | G3 failure localization/Gate0 B0–B7/old trial issue families | V→actual owner最小修復 | 復唱/所有/対象/否定/時点/留保/関係等を共通原因へ束ねる | 失敗群→仮説owner→反証的case→修復前後のactual改善と残差 | S06/D36/D37。case名へのpatch列増殖を避ける |
| D36 | lexical/attachment authority matrix / blockers | 知識/negative vectorsへ改造 | NLS relation/attachment/mutation modules、inheritance tests | 意味照合・教材coverage | 日本語の係り受け/引用/省略/開いた役割の失敗を再利用 | 現自由文で正しい省略を通し誤結合を落とす、未解決を明示 | D07/D08。旧251-owner formal admission全体を通常返信必須に戻さない |
| D37 | natural failure / anti-template / severity corpus | 改造 | 旧100/private failure、G.template_echo、最新actual trials | V学習候補/回帰/分布比較 | 自然さと誤読を対比し少数例暗記を避ける | 評価原文→教師への無断流用0、派生/既使用/新規の区別、意味/文法/偏りを別判断 | D17/D30/D35。旧固定正解文への一致を目標にしない |
| D38 | PR2 semantic/relation/mutation overlap | 必要concept/symbol/tests抽出 | PR2旧実装、PR3 inheritance tests | 既存CMEE単一owner | 二重実装を避け旧検証を現在の意味責務へ回収 | symbolごと受け先/削除or参照のみ/変異vectorを記録、現経路で実行 | D06/D07/D14。whole module保持と同義でない |
| D39 | large recovery/natural surface/semantic overlay | 責務を分解改造、塊は履歴 | large recovery builder、old natural surface | D04–D28の各現owner | 有用読解/逆検査/比較を救出し旧出力方式の制約を解く | wrapper/copy/import/callで大型moduleを現役化0、各責務実入出力証拠 | D38/D40/旧8層。内部利用していないだけで放棄認定しない |
| D40 | independent second active NLS engine | 退役/禁止 | PR2 direct ingress、E current dispatcher | CMEE各coreの唯一owner | 混在した候補作者/旧fallback/鏡像生成を防ぐ | 現runtimeの実callgraph/dispatchで単一採否と作者責務、saved互換は別 | D38/D39。code削除より先にunreachable確認 |
| D41 | old steps/RC/snapshots | 履歴保持 | historical baselines/Git history/audit | V知識source | 失敗と採否を復元できる | 原bytesと当時結果維持、現在のnext/authorityに自動復帰しない | D30/D35。必要資料を現複製しない |
| D42 | long Gate/Receipt/authority/handoff chain | 旧常時運用退役、必要記録採用 | S04/S14/S16/S17/S23 | 既存checkpoint/versioned評価束 | 成果消失/結果混同を防ぐ最小記録を残す | 一つの実行結果/参照で再開可能、同eventの多数重複記録なし | S23/D29/D50。記録全廃ではない |
| D43 | G0–G10 checker/controller/executor/FD/transport | shell退役＋有用pure部品を個別改造 | S18–S30、optional C | 比較/再現/結果整理の限定責務 | 環境差・破損・別重み混在の実障害を短く識別 | 差分入力/予想/実値/影響が1回で確認でき、通常生成の前段連鎖なし | 32family表を参照。whole外殻復活0 |
| D44 | reverse verification adapted to Piece | 改造・必要全責務 | P source/semantic/author-free、G must_keep | P canonical text＋recipe＋PNG＋saved/export | 本人の核/条件/否定/人物抽象化と読める画像の一致 | 同版原文→canonical→recipe→PNG→保存/再読/持出し、意味変異/欠け双方を確認 | D03/D15/D21。Emlis文法を共通化しない |
| D45 | reverse verification adapted to Analysis | 改造・必要全責務 | A source/admission/compiler/sole realizer/cumulative | A graph/本文/図/根拠/unknown/IF | 引用が正しくても役割/選択/関係が誤る失敗を見つける | node/edge/方向/時点/留保/撤回/併存→source根拠、図と詳細・累積/月次の同版再読 | D06/D07/D08。IF/Savedは現在未完を維持 |
| D46 | external natural expression provider | 現在承認済4Bへ改造済基盤を採用 | N SelfHostedNaturalReplySource、model_candidate_source | 承認済自己host4Bのみ | 自然文/意味候補を得る。providerを本人事実/意味採用ownerにしない | 実endpoint/model/adapter/prompt/finish/期限/費用と候補の対応。新provider選択は別商品判断 | 旧8/17時点未採用statusを現在へ流用しない |
| D47 | Cycle001 candidate ingress cutover | 独立履歴/契約保持 | 08_cycle001_current_state/old bridge | 現設計の品質改善とCycle契約を分離 | 新能力再利用が旧acceptance条件を書換えない | 必要となる時fresh current ownerで判断。今回の設計だけでCycleをPASSへしない | D30/D40。新全通常経路前提にはしない |
| D48 | production one-owner cutover | 現稼働との整合設計 | service/factory/config/current deployment | 現N/P/Aの必要箇所のみ段階反映 | 新意味検査の誤判定/遅延を実利用へ無検証で持ち込まない | 候補比較→offline適合→必要範囲配置→現版保存再読/中断と品質確認 | 旧I5切替手順をそのまま現runtimeへ当てない |
| D49 | asset migration manifest gap | この全表＋実装時symbol表で閉じる | 原D51/32family/current source/tests | 同一GitHub詳細設計と各実装差分 | 必要assetの取りこぼし/二重owner/設計だけ完了を防ぐ | 全D51/S32/8層crosswalk、exact symbolごと利用/改造/履歴/退役と実test結果 | 独立恒久controller/新Receipt familyを作らない |
| D50 | artifact/schema/version/parent lineage | 採用＋結果比較へ改造 | contracts/artifact identity、source_prefix、saved DTO/RPC | 全core保存とV比較 | 別重み/入力/旧本文の評価を混ぜず訂正前後を扱う | source/prompt/model/adapter/grammar版＋actual出力対応、変更時旧review無効化、保存非生成再読 | D03/D28/D29/S11/X01。hash一致を意味品質へ換算しない |
| D51 | separate Safety triage/owner | 採用・既存owner維持 | emlis_ai_safety_triage、N._source_safety | 現Safety境界＋core責務 | 高配慮材料と通常観測を混ぜず既存動作を壊さない | 原入力/補足/訂正/履歴の実triage、通常/安全outcomeと公開表示の整合 | D09/D22/S10。新安全補助systemを独立構築しない |

### 13.3 原32系列と外殻内の回収対象

S01–S32を全て判定し、X01は原監査同様に横断実装として扱う。『外殻退役』はその中のpure計算/比較/診断/negative testまで廃棄する意味ではない。部品単位で現実の不足、既存重複、採用先、実効果を確認して改造する。

| ID | 原系列 | 判定 | D対応 | 回収する能力/部品 | 現在への適合 | 完了証拠 | 継承しない旧運転 |
|---|---|---|---|---|---|---|---|
| S01 | body-free / public-private | 採用＋形式を現束へ適合 | D29/D50 | 公開payload key/value検査、secret非掲載、本文なしerror | private実全文と公開summaryを別責務で対応。漏れ検査を既存保存/runnerに組込む | 本文/credential/URL等の公開漏れ0、private再読可能 | body-freeだから読了/品質合格という昇格 |
| S02 | local review root/export/scoped allow/purge | privacy責務採用・旧承認shell退役 | D29/D32/D34 | private bundleの保管/保持/削除・対象範囲 | 現在のprivate保管と権限で実全文を扱う。不要な複製を減らし保持根拠を残す | 必要原本の回収/版照合とretention、原文未読を読了扱い0 | 旧R47/R50/R51 allow token/blank sidecarの連鎖 |
| S03 | human provenance | 採用 | D33/D34 | 機械評価/華恋screen/Mash受入れのrole区分 | 現在のtrial/設計/商品判定に同じ区分を使う | AIの評価をMash実受入れへ代作0、誰がどの版を読んだか対応 | 人未供給なら全ての日常開発停止という旧運転 |
| S04 | no-promotion/manual handoff/retry | 原則採用・旧step chain退役 | D22/D33/D42 | 結果種別、未実行/結果不明、適格な明示再試行 | 現service/評価のoutcomeに統合、結果不明の二重生成/二重writeを避ける | actual結果と記録が一致、成功前提の自動再write0 | OP毎Result/Receipt/Handoff/新承認family |
| S05 | P7-PQR actual Product QA | 評価軸/actual material改造、旧Gate退役 | D30–D34 | 本人が読む材料を実際に揃える責務、技術/人読分離 | 現4B出力・図・画像の同版実物をV比較へ渡す | blank sidecarでなく実本文/実画像を読了、残差記録 | I0–I6全起動手順・1797検査を新前提にする |
| S06 | Gate0 FailureClosure B0–B7 | 因果局所化を改造 | D35/D36 | failure taxonomy、owner/reachability、current-owner reproduction | 失敗→共通原因仮説→現実call先→positive対比→修正へ返す | 反例を含む実前後結果で原因仮説を支持/棄却 | 全closure台帳/旧172checkを独立完成目標にする |
| S07 | Evidence Ledger/lineage | 採用＋現sourceへ適合 | D02/D03/D15/D28 | canonical spans/nucleus/relation lookupのpure関数とtests | 既存Sが唯一の本人原文owner。P/A/N評価で同じ参照を使う | Unicode/別field/別version/ref改変検査、意味照合との区別 | 語のlabel/confidenceを本人の意味確定に使う |
| S08 | always two-stage display | 意味役割を改造・literal形式は履歴 | D05/D13/D25 | 観測と受取りの役割、旧saved本文の互換知識 | 現naturalは一つの本人宛応答。保存済み旧表示は再生成せず表示 | 最新表示仕様・同一保存本文の再読。余計な節/重複が増えない | 毎回二段label、固定比率、全core同形式 |
| S09 | restatement/runtime visible guards | 現基準へ改造 | D17/D20/D25 | 台帳読み上げ・不自然反復・空本文・順序診断 | 現一返答の文法/語り手/反復の評価へ。高確度形式のみruntime | 短い受取り/一度の言換えを通し意味誤りを別に検出 | 旧section label各1回、echoだから全面拒否 |
| S10 | Reception distinctness/human voice/Safety | 改造＋既存Safety採用 | D05/D09/D17/D24/D51 | 感情所有/未根拠追加/引用集中/分布/voiceの検査知識 | 現自然文への受取り評価＋batch分布。本人/他者/Emlisを分離 | actual本文で所有・意向・怖さの未根拠化を抑え、自然さを全件読む | 13軸旧比率/長短/closing閾値を無条件runtime化 |
| S11 | hash-bound review/stale invalidation | 採用＋版比較へ改造 | D32/D50 | 評価対象identity、本文変更時のreview無効化 | source/context/prompt/model/adapter/policy/output版をV比較へ結ぶ | 前後本文一致/差分とreview対象が一意、別出力へPASS流用0 | hash一致を品質正解とみなす、公開raw body hash常時要求 |
| S12 | device/runtime/display evidence separation | 採用・既存確認へ統合 | D34/D44/D45/D48 | clipping/scroll/順序/実画像とbackend本文の区分 | iOS/Android採用候補の既存実機確認、同版画像/図/詳細 | local/RN stub/実機/端末保存・共有を別に記録 | 毎小変更Mash実機操作必須、旧representative4/exact8の恒久Gate |
| S13 | NLS candidate/inverse/fail-close | 大幅改造 | D04/D07/D14–D22 | 候補identity、意味/関係/unknown、逆検査独立、no-valid | 現4B自由文の独立読取/候補妥当性/選択。P/Aへ専用改良 | 意味変異と正常言換え、全不適格/判定不能の適切処理 | 旧AST/節数/有限parser/過剰fail-closeをそのまま適用 |
| S14 | Cycle closure/recovery/current route | current記録は保持・旧日常chain退役 | D30/D41/D42/D47 | 唯一の現在地、原本/結果/残件、過去結果不改変 | 現週次・trial・設計の必要記録とCycle外部契約 | fresh資料から再開できる、Cycle未完を勝手にPASS化0 | G0–G10/Epoch全再起動/旧nextの復活 |
| S15 | scope/cardinality/depth/witness | 責務改造 | D04/D10/D12/D15/D28 | optional/required分離、独立検査witnessと選択責務の分離 | 現在の許容省略/意味変化/差分範囲を扱う | 語数やduty数でなく重要意味/非対象意味が保たれる | 旧exact cardinalityやCONTENT_DEPTH_ONLYの権限代用 |
| S16 | RED/protected tests/preimage | 因果試験と原本保持を採用 | D31/D35/D36/D38 | before failure、変更対象意味、negative controls、履歴不改変 | 現自由文のpositive/metamorphic testと実本文比較 | 修正前に失敗/修正後改善＋既改善維持。現仕様への期待変更は理由を残す | freeze/refreeze毎の別承認/Receipt/proof chain |
| S17 | ledger/reservation/owner graph/atomic publication | 有用state責務抽出、旧台帳shell退役 | D27/D42/D50 | 冪等性、二重消費防止、parent版、atomic commit、曖昧成功 | 既存thread/meaning checkpoint/保存RPC/生成jobの現ownerを再利用 | 中断/二重要求で候補/保存枠/更新を二重消費せず同版再読 | exact134等の巨大ledger/success graphを再構築 |
| S18 | source/runtime/manifest identity closure | 必要identityを条件付き抽出 | D03/D43/D50 | source/prompt/model/adapter/依存版比較、hash/manifest差分 | C/Vの候補比較・保存重みreload・実障害再現 | 違う実行条件を同じ改善へ混ぜず、必要bytesから再現可能 | 全root/19identity/full wheel closureを全生成前に要求 |
| S19 | terminal grammar/RESULT_UNKNOWN | 採用・現outcomeへ適合 | D22/D42/D50 | stop/length/timeout/cancel/error/unknown、body-free reason | 現model finish/HTTP/保存/再開の結果整理 | 途中結果を成功としない、保存済み結果を無根拠再生成しない | 一文字stderr差を新authority作業へ変える運用 |
| S20 | GitHub contract/postverification | 現契約採用・旧transport履歴 | D42/D49 | target path/content/version/changed pathの確認 | rootの現GitHub反映contract。商品runtime責務と別 | 保存した設計/変更が対象pathで読める | 特定SSH/exact lease/directchild/fulltreeを必須にする |
| S21 | Publication Guardian | whole退役・pure検査は必要なら抽出 | D43/D49/D50 | strict JSON/duplicate key reject、path/mode/blob整合、untrusted入力をshell展開しないtests | 現candidate parser/保管packの既存検査で不足が実在する時にreuse | 新候補/manifestの重複key/不正path等を確実に拒否、既存との重複なし | Issue/actor approval/Actions publication/remote-first authorityの復活 |
| S22 | model/environment/Work route | 実測/責任区分を採用・旧UI Gate履歴 | D33/D43/D46 | 実使用model/adapter/実行環境、能力を実確認 | C/V比較とrootの現実作業route | 別model生成/学習/CPU診断/実GPUを混同せず版が追える | 旧model名/UI表記そのものを新停止機構にする |
| S23 | durable checkpoint/handoff/current owner | 採用・重複縮小 | D29/D41/D42/D49/D50 | actual bytes保存・最小manifest・明確なresume | 既存trial/週次/設計/GitHubまたはprivate原束 | scratch消失後に原本/結果/次作業を復元、hashだけにしない | event毎にResult/Handoff/Plan/07/08を全部増やす |
| S24 | observer/analyzer/helper/launcher trust | 独立検査思想・pure比較を抽出、chain退役 | D21/D35/D43 | forward結果に依存しない独立reader、差分/投影/正規化検査、negative vectors | 現自由文逆検査/実意味比較とCの必要部分 | forward planを盗用しない検査、同一誤実装の相互承認を避ける | V1–V16 launcher/lock/catalog/authority連鎖・未実証自動原因診断 |
| S25 | Inspector/scanner/harness | whole退役・失敗知識保持・pure部品個別評価 | D35/D43 | bounded入出力・既知failureを未到達と分けるnegative tests、破損検出の知識 | 既存toolに具体的不足があれば小関数/testとして取り出す | 採用symbolの現実効果を別途証明。旧Inspector未実行=品質成功0を維持 | Inspector本体/scan harnessの復活を再利用の目的にする |
| S26 | Gate A/B/C runtime admission | identity照合/独立比較を条件付き抽出、Gate退役 | D43/D50 | 環境差が結果に関わる時の依存/重み/入力比較 | Cの一回比較/実障害診断 | 具体的差と出力への影響が記録され、通常生成を止める新Gateなし | A→B→C readiness連鎖/旧admission authority |
| S27 | installed manifest comparator/mismatch diagnostic | pure comparatorを改造・条件付き採用 | D43/D50 | expected/actual集合、missing/extra/hash mismatch、説明差分 | model/adapter/prompt/評価pack/必要依存の版比較 | 改変/欠落/余分fileを局所化、同一重みのreloadなど実問いへ答える | 一致させること自体を商品完成目標にする/毎回installed全走査 |
| S28 | runtime checker/distribution reconciliation | 有用導出/比較/testsを抽出、whole checker退役 | D43/D50 | distribution側とfilesystem側の違う導出、canonical診断、既知不整合vectors | C/Vの候補bundle/実依存不整合診断 | 自己申告metadataとactual fileを区別して必要差を検出 | exact19/5責務全checkerを自然応答の入口に固定 |
| S29 | runtime preparation controller/acquisition/materialization | 最小再現手順/lock知識採用、controller退役 | D43/D46/D50 | 必要依存固定・重み保存/取得後検証・再取得不要の知識 | 現在GPU/CPU runnerの再現inputsと準備手順 | 候補重み/prompt/adapterを復元して同条件評価できる | 新controller/exact7/exact18/私的egress証明/全runtime準備連鎖 |
| S30 | FD9/credential drop/exec proof | 通常不採用・有用pure境界のみ条件付き | D29/D43 | bounded stdin/stderr、safe error allowlist、secret非漏出、file整合negative tests | 既存HTTP provider/errorとprivate評価toolに必要があれば適合 | エラーに本文/秘密が出ず、切断/過大入力/実file改変が明確 | 現selfhost4BへUID/GID/execve/FD proofを前提追加 |
| S31 | Pro/Ultra/Rule18 lifecycle | 現責任区分採用・旧authority shell履歴 | D33/D42/D49 | 設計/実装/商品判断、承認範囲の区別 | 現ユーザー指示で必要scopeを進める。root最終統合/書込 | 設計のみで実装/配置/受入れに変換せず、既承認の再質問なし | 旧exact approval bytes/activation/consumption連鎖 |
| S32 | necessity/product delta/minimum boundary | 現目的として採用 | 全D/S | 商品結果に効く必要性・既存との重複・中止判断 | 今回ユーザーが必要asset改造の労力を許容。量で切らず価値で採否 | 実本文/画像/図の改善と残差、比較/検査だけの独立完成にしない | 『小さいから可』『大きいから不可』という便宜的範囲制限 |
| X01 | exact100 private/HMAC evidence | 横断部品採用/改造、独立系列に加算しない | S01/S11/S14/S26・D29/D30/D50 | private/public対応・no-overwrite・例外会計・manifest/hmac | Vの必要評価束、重み/生成結果対応 | 原本再読/改変検出/公開summary一致。意味品質は別に全文確認 | 全通常返信でHMAC/fullsource closureを必須化 |

### 13.4 原8層と追加活用案の対応

| 原8層/提案 | 回収/改造する内容 | 今回の現product接続・評価 |
|---|---|---|
| L1 Semantic Evidence / Authority | 原文・本人/他者・述語項・条件/対比・否定/時点・認識/不明・関係のgrounded candidate、競合解釈 | 既存Sを材料正本にN/P/Aの意味保持検査と採用候補へ。生成本文やcategory名を本人事実へしない |
| L2 Plan-Owned Surface | 選ばれた意味が実際に出力へ現れる責務・sole author・後付けspliceの失敗知識 | 現4B自由文を保つ。旧二段/行数/phrase grammarを新packetへ偽装して強制しない。Pは§7.1の4B候補をCMEEが採否確定し、旧作者との文字列一致を要求しない。Aは現compiler／realizerを使う |
| L3 Causal Failure Localization | failure axes→共通原因仮説→実source owner→修復範囲→反例/controls→actual before-after | 単なる問題コード集計から修正までつなぐ。current100コードは人の注釈検証であり自動原因発見済みとはしない |
| L4 Causal RED/GREEN | 意味要素を一つ変え、意図した可視箇所が変わり他が保たれるpositive/metamorphic試験 | 値参照/例外/台帳の一致を本文実現成功の代用にしない。主体・対象・否定述語・時点・認識・unknown・関係方向の変異 |
| L5 Human Product Read | 意味・自然さ・本人宛・関係の読みやすさ・不要反復・伝わり方、machineとの分離 | 現最低線へ適合。長さ/深さ/二段/比率を固定せず、短い受取り・一度の言換えも許容 |
| L6 Batch / Evidence Envelope | 母集団/教師/既使用/新題材の由来、選択/no-valid/unavailable、全出力読解、private/public対応 | 必要なbatchと節目比較。旧case/旧PASS/旧fail-close率を現在の品質へ移さない。分母/再利用/重複を明示 |
| L7 Reproducibility | 入力・prompt・model/adapter・依存/環境・重み・raw・finish・時間/費用・manifest差分の再現 | 実4B比較/保存reload/原因不明差の検証へ使う。全root証明を通常応答前段へ置かない |
| L8 Governance / Publication | 実結果と未確認を分ける状態、保存原本、必要な反映後確認・再開情報 | 既存記録/保存を使う。旧authority activation/consumption/proof-of-proof/controller群は再起動しない |
| candidate tournament | 同一入力/意味条件で複数候補、意味hard validity→自然さ/本人宛/密度等の比較 | Vの比較能力を必ず残す。通常で候補数を増やすかは実際の品質増分・遅延・費用から決める。語尾ランダム化ではない |
| diversity / distribution | opening/文骨格/述語/closing/受取り対象・act集中、同topologyでの意味/表現差 | batchの異題材過集中を検出し教材/選択/生成原因を修復。多様性のため意味や正しい短文を改悪しない |
| semantic/version diff | 保持/追加/消失/確定化した意味、主体/対象/関係/時点/受取りの変化、severity/availability差 | 同一source/version上で比較。原文変更とモデル変更、対象変更と品質変化を混ぜない |
| corpus curator / regression selector | topology/感情/否定/省略/引用/複数欄/長短/unknown/思考行動差/複数人物のcoverage | 変更した意味責務に関係する群＋既成功controlsを選ぶ。全件毎callを必須にしない。教師への評価流用を区別 |
| model/algorithm bench | 同材料・同meaning comparison・同読解基準でprompt/model/adapter/候補選択を比較 | model名/学習loss/JSON成功で採否を決めない。今の自然さと旧意味保持知識を両方使う |
| question need / feedback learning | 未確定の意味が回答で変わる一点、本人補足/訂正/撤回、更新後END、過去frameの暫定性 | new naturalへの実問い・回答後理解更新が未完。解析器の能力不足を本人へ質問転嫁しない |
| longitudinal analysis / change | 同一人物の場面/対象/役割/基準/選択/結果を時点/根拠付きで比較 | 全期間累積/月次当時版、撤回/併存、原記録と推定/IFの区別。P6旧labelを固定性格へしない |
| semantic-to-creative / PieceCandidateLab | 意味の核/形式適合/自然なcanonical/人物抽象化、複数候補比較、recipe/PNGとの整合 | 他者が単独で受取れる作品。原文保存の正常例をechoという理由だけで拒否しない |
| cross-core consistency / source lineage | 原入力/本人補足/生成返答/分析推定/Piece共有物の資格/版/削除/訂正の反映 | EM-04/05とAN-02等の既残件へ結合。Emlis返答を本人事実へ再投入しない。本人/plan/context資格は現ownerに従う |
| complaint/forensic trace | source→候補→採否→実output→保存版の必要な経緯 | 問い合わせや実品質異常に限りprivate原本から辿る。raw本文のpublic複製/恒久trace膨張を避ける |
| quality console/dashboard/design review | 上記の比較/coverage/causeを改善担当が読める同一結果束で表示 | 今回は既存README/trialと必要な比較表示へ統合。独立dashboard構築を商品品質の先行条件にしない。必要な表示は実product修復と同unit |
| app-wide version/tier/history/device | source資格・保存/可視範囲・版・権利・端末のexisting contractと意味材料の整合 | 原計画の全体適用責務を捨てない。今回だけで通知/IAP/全app改造を新規scopeに拡張せず、既残件/現ownerへ接続 |


## 14. 確認済みsource・symbol・既存検査の対応

API `497f7008fec8935885d09d2e430499892189b5bb`で、以下のsource抜粋とsymbolを照合した。tree存在だけを確認したtestはその旨を区別する。testの存在は今回のfresh PASSでも、新naturalへの接続完了でもない。行番号はこの確認版の位置であり、再開時は現symbolを確認する。

| Asset family / D IDs | Verified source/symbol | Existing tests / evidence | Reuse/customization consequence |
|---|---|---|---|
| Source normalization / D01, D02, D03, D29 | `ai/services/ai_inference/cocolon_meaning_experience_engine/source_kernel.py`: `freeze_text_source` L997, `validate_evidence_refs` L161, `build_source_owner_universe` L309; `emlis_thread_source.py`: `freeze_supplemental_answer` L51, `admit_emlis_thread` L170 | `ai/tests/test_cmee_source_kernel_variable_cardinality.py` (tree presence); `test_cmee_nls_v3_batch001_unified_stage1_bridge.py` explicitly imports and uses source_kernel, current_input, ledger L18-75/124-148 | Keep single source admission/ownership/version guard. New evaluators consume immutable admitted material; do not invent a second source normalizer or let model output establish source eligibility. Metadata exactness proves linkage, not truth of interpretation. |
| Evidence lookup / D03, D15, D28 | `ai/services/ai_inference/emlis_ai_evidence_ledger_service.py`: `build_evidence_ledger` L289, `EvidenceSpanResolver` L74, `validate_evidence_ledger` L369, `source_text_for_span` L471 | `test_cocolon_text_generation_core_evidence.py` has span/source/field/hash retention and stable hash tests L21/62 | Reuse raw/source lookup and range duties, avoid treating lexical detected_type/confidence as meaning authority. Any transformed quote/span must resolve to original field/version. |
| Shared evidence conversion / D03, D28, D50 | `cocolon_text_generation_core/evidence.py`: `stable_evidence_hash` L58, `make_source_anchor` L116, `make_evidence_span_like` L162, `usable_evidence_spans` L215 | `test_cocolon_text_generation_core_evidence.py`: `test_emlis_evidence_adapter_preserves_span_id_source_field_and_hash`; `test_source_anchor_and_evidence_helpers_filter_unusable_evidence` | Reuse small pure conversion functions after confirming new CMEE identity compatibility. A stable hash is version linkage and not semantic verification. |
| Meaning obligations / D04, D05, D08-D12, D15 | `ai/services/ai_inference/emlis_ai_semantic_obligation_inventory_v3.py`: `GroundedSourceSnapshot` L515, `InventoryUnknownSource` L411, `build_grounded_source_snapshot` L2423, `build_semantic_obligation_inventory` L3889; `emlis_ai_content_selection_v3.py`: `derive_content_depth` L633, `build_content_selection_plan` L1127 | Current100/bridge and inheritance tests below cover known finite branches; not arbitrary free prose | Extract must-preserve / optional / deferred / unknown / forbidden responsibility. New natural reply need not verbalize every source fact. Distinguish permissible compression from semantic reversal or fabricated certainty. Do not make old full inventory mandatory merely to return a short valid reply. |
| Meaning alternatives / D06-D08, D10-D12, D14 | `cocolon_meaning_experience_engine/emlis_input_specific_meaning.py`: `derive_grounded_situation_view` L773, `derive_foreground_scope_closed` L1473, `derive_difference_configuration_set` L2137, `derive_requirement_bundle_set` L3039 | `test_cmee_final_stage1_exact8_meaning_inheritance.py` explicitly tests required meaning/relation, compound source fragments, source-bound hedged unknown L382/391/409 | Preserve competing readings and explicit unknown. Separate grounded candidate interpretations from confirmed user fact. Reuse representational knowledge and tests; current finite inference code is not already a free-Japanese interpreter. |
| Difference / counterfactual tests / D07, D15, D35-D38 | Same file: `apply_counterfactual_mutation` L3567, `issue_whole_reading_consequence_row` L3602, `_derive_candidate_semantic_loss_codes` L4333, `_evaluate_candidate_hard_validity` L4500 | `test_cmee_nls_v3_relation_matrix_inheritance.py` L733 coordinated endpoint-role laundering, L2041 non-temporal/unsealed action sequence, L2248 visible inverse | Extract mutation axes and causal questions (actor/recipient swap, negation, time, uncertainty, scope, relation). New expected outcomes must match current natural text and accepted semantics. Old schema/hashes alone are not a free-prose semantic oracle. |
| Meaning selection / D10, D11, D18, D19 | Same file `select_input_specific_meaning` L5177: unique nondominated candidate required; returns None when count is not 1 L5204-5205. `project_selected_reading` L5135 retains unresolved alternatives and decision trace | Existing inheritance tests establish old owner relationships, not general quality | Keep hard semantic validity before preference scoring; competing meanings remain unknown/limited rather than selecting via smoothness, ID, or arbitrary order. Build explicit comparison on current candidate format. |
| Multiple natural-surface candidates / D17-D19, D24 | `emlis_ai_grounded_reception_candidate_selector_v2.py`: `evaluate_and_select_reception_candidate_v2` L861 hard-gates every candidate L897-938; scores only passed candidates; no valid candidate returns `v2_no_valid_candidate` L955; runtime_connected=False L963 | Prior V2 source itself is offline; not connected to current natural provider. `test_cmee_grounded_surface_owner_inheritance.py` L527 tests body inverse failure making every candidate invalid | Preserve candidate-set comparison and semantic-hard / naturalness-soft separation. Adapt old surface-plan types/metrics to current free reply; candidate count/cost and whether runtime multi-candidate is necessary must be measured. Failure must not trigger hidden provider fallback or repeat forever. |
| Plan/surface/Reception owner separation / D12-D14, D16, D23-D25 | `emlis_ai_grounded_observation_plan.py` final-stage1 builder; `emlis_ai_grounded_sentence_surface.py`; `emlis_ai_grounded_human_reception.py` (very large). `test_cmee_nls_v3_batch001_unified_stage1_bridge.py` imports exact owner chain L18-75; `test_cmee_grounded_surface_owner_inheritance.py` checks facade no independent surface call L88 and unreachable legacy compiler L492 | Tests present and source excerpts fetched; no execution | Keep who owns meaning, expression, validation, storage distinct. Extract authoring constraints and trace duties rather than restoring old two-section literal output, fixed ratio, or phrase grammar. Current natural recipient reply remains the reply author; independent evaluator cannot rewrite user facts or become hidden second author. |
| Body-only inverse / D20, D21, D44, D45 | `emlis_ai_grounded_observation_gate.py` `evaluate_grounded_surface_body_inverse` L7110; docstring L7118-7123 states body-only parser, independent plan matching, no forward parser witness. It checks exact section order and line count L7148-7153. `evaluate_emlis_model_surface_inverse` L10290 is another finite model-specific seam | `test_cmee_grounded_surface_owner_inheritance.py` L527; `test_cmee_emlis_mixed_unknown.py` L178 `test_body_inverse_rejects_loss_without_using_the_author`, L201 coordinated reseal unknown borrowing/erasure | Strong reuse target, substantial adaptation necessary: old checker requires observation/reception sections and plan counts which current natural reply intentionally lacks. Preserve independent visible-output reading, source-bound meanings/unknown and mutation rejection. New comparator must tolerate correct paraphrase and allowed omission and expose uncertainty of its own reading. |
| Unknown preservation through answers / D08, D26, D27 | `emlis_question.py` `question_candidate` L305, `validate_question_binding` L387, `model_question_candidate` L431; `emlis_thread_source.py` independent supplemental source | `test_cmee_emlis_mixed_unknown.py`: initial qualified unknown L92, answer keeps/expires duty L125, inverse loss L178, updated reader answer reception L234 | Reuse original/answer separation and target-scoped refinement/withdrawal. Current natural first reply does not itself provide live question/refinement capability; design must connect after meaning/update acceptance, preserve explicit unknown that is not the question target, and avoid compulsory questions. |
| History/frame limits / D02, D26, D27 | `emlis_thread_history.py`: `OwnedHistorySourceV1` L15, `FrameFeedbackSourceV1` L22, `InterpretationFrameV1` L37, `admitted_history_plans` L60, `derive_interpretive_frames` L86 | Source symbol presence checked; behavior not fully re-audited in this subtask | Keep eligible source/feedback roles, temporary interpretation and correction. Adapt semantic relevance and version differences; a past label is not current identity/fact. This is necessary future integration, not claimed complete by old structs. |
| Shared guard subsystem / D09, D20, D22 | `cocolon_text_generation_core/composer.py` `CoreTextComposer` L59; `_run_guards` L72 invokes coherence/template/overclaim/grounding/must-keep; `generate` L102 validates caller-supplied candidate and requires all guards | `test_cocolon_text_generation_core_composer.py` (tree presence); `test_cocolon_text_generation_core_guards.py` actual test declarations and imports fetched | Existing common composer is a candidate validator, not meaning generator. Reuse reliable low-cost checks as parts; do not promote this subsystem to CMEE author or assume all old guards suit new natural text. |
| Must-keep coverage / D04, D15, D20 | `guards/must_keep_coverage.py` `guard_must_keep_coverage` L78, helper L46 uses substring or ngram_overlap >=0.24 / head-tail matching L51-61 | `test_cocolon_text_generation_core_guards.py` required role/evidence IDs L140 | Retain structural coverage and test ideas; lexical overlap cannot detect polarity/actor/time correctness. Replace/adapt semantic comparison, evaluate false accept and false reject with valid paraphrases. Do not import threshold as truth guarantee. |
| Template/repetition / D17, D35, D37 | `guards/template_echo.py` `guard_template_echo` L137 uses fixed meta/source/markers, previous similarity >=.72, echo/quote ratios and repeated signatures L157-218 | `test_cocolon_text_generation_core_guards.py` obvious repeated surfaces L71 | Reuse diagnostic features, adapt thresholds and product policy. Current acceptance allows a short receipt and one paraphrase. Piece deliberately preserves source claims. Blanket echo rejection would contradict current specification. Sample-level and batch-level repetition remain useful as separate assessments. |
| Fixed corpus / D30-D32, D35-D37 | `ai/tools/emlis_nls_v3_batch_run.py` `load_validated_batch` L93, `_previous_by_case` L251, `run_batch` L268; fixture `ai/tests/fixtures/emlis_nls_v3/generated/batch_001.jsonl` + `batch_001_manifest.json` | Unified bridge L55/59-61 uses validated original corpus as sole inventory; no copied case table | Retain corpus and case identities as regression assets, distinguish previously used inputs, teacher variants, new unseen topics. Existing Cycle denominator/acceptance remains its separate contract. Current natural regression can use versioned adapters without copying raw private corpus into public docs. |
| Human review / common-cause categories / D32-D35 | `ai/tools/emlis_nls_v3_step11_current100_product_read.py` `PRODUCT_READ_AXES` L54, `PRODUCT_READ_SHARED_CAUSE_CODES` L92, `build_current100_product_read_pair` L703. Tool docstring L5-11 explicitly never makes/revises human decisions | `test_emlis_nls_v3_step11_current100_product_read.py` L266 exact100 pair, L391 shared cause, L424 tamper; source L329-437 validates human rows | Reuse meaning/relation/unknown/naturalness/distribution dimensions and common-cause grouping; adapt obsolete mandatory section-distinctness/depth assumptions to current criteria. Keep evaluator reading versus Mash formal acceptance distinct. The tool validates annotations; it does not discover root cause automatically. |
| Version diff / changed-output re-read / D31,D32,D35,D50 | `batch_run.py::_previous_by_case` and `run_batch`; current100 runner/version parent binding; bridge and frozen old/new snapshots are concrete reusable patterns | Current100 tests parent/source/candidate bindings L486/500; mixed_unknown full prior checkpoint reproduction L84 | Reuse input/version matching, changed/same/availability/meaning deltas. New output means fresh reading; unchanged bytes may reuse a matching earlier reading only when source/context/policy/model conditions needed for that claim are unchanged. Historical PASS is not re-awarded to new output. |
| Privacy/HMAC/body-free evidence / D29,D50 | current100 review `_public_case` L467, `_aggregates` L483, `_review_hmac` L440, `_assert_body_free` L544, `_validate_review_pair` L557 | Current100 test public aggregate/tamper L424, exact0600/no overwrite L526 | Useful governance component retained inside required evidence packaging. Reuse compact sanitization/linkage; no per-step publication authority chain, no HMAC as semantic proof. |


## 15. 設計の確認範囲と未成立事項

- 旧32系列の監査、PostG2の8層／活用案、D01–D51、現在の全体設計・全ファイル地図の関連責務、三中核map、最新weekly、現source／symbol／testsを照合した。Karen-Diaryは確認版の全50fileを分担全文読取し、構造知識と現在の商品仕様を区別した。
- 旧32系列監査の確認blobは`d056dba48c65acb55198b24b021924360171ded0`、[PostG2再利用監査](../../audits/emlis_ai/Cocolon_Cycle001_PostG2_SystemArchitecture_Reusability_Audit_20260814.md)は`8f44b842bd5314b75d5e3fe33c14ec16bd46e7f3`。全体ファイル地図の件数・所在確認と、全blobの意味読解・全画像目視は区別する。
- 巨大な旧migration詳細06の全文と全symbolの意味監査は完了していない。本文取得できた上位設計・Disposition・現map・現sourceを根拠に本書を設計し、各実装単位で必要原本を確認する。未取得を「存在しない」「移管不要」「全文理解済み」にしない。
- 本書は自由文の一般意味検査、通常追加model reader、全三中核の意味品質、実費・待ち時間の改善を実証していない。sourceの正規化／引用一致、表の完全性、文書保存をその代用にしない。
- **最初の設計保存時点**の構造差分は、回収・改修・商品接続の設計と再開導線だけで、その時点では製品の作者・API・DB・RN・provider・稼働設定を変えていなかった。その後のAR-01ではa98c／e14の候補source変更、研究opt-inの実生成比較、private保存・再読へ進んでいる。現在の実装・適用範囲・不採用と残件は[§11.2](#112-現在の進行欄)と最新weekly／既存AR-01 trialを参照する。新しい発売条件、料金、quota、独立した承認／統制systemは追加しない。


<a id="piece-general-prose-register-20261110"></a>
### 11/10追記 — AR-04の一般文診断と既存S7比較への限定接続

**11/10・AR-04最新：** 固定c634・追加学習0で新しい架空8入力を確認し、source資格5／資格外3を分離。資格5＋既使用対照2の実4B7応答を無修補で再受領し、API209b4a27の既存S7 model比較で、完全な本人表記・対象を保つ「たいです／たい」と未決定の場所等の文体差を限定接続、CMEE4→6採用／7。新規5は2→4採用、対照2と旧46本文は不変。新隔離SQL21は18保存／3拒否、保存後0生成。17file1082 PASS／既存warning1。反復表現、理由文1の未判定、source資格外3は残る。元GPU提供46144へ復元・health／前後control一致、c634通常未採用／selector OFF・正式0/3。

新規架空8をsource資格5／資格外3へ分離し、既存c634を1load・学習0で新5＋対照2を生成。現実装の読み取れない構造を、生成誤りや本人への追加質問へ転嫁しない。今回のAPI209b4a27は既存policy／testの2pathだけで、意味保持を緩めず、完全なsource対象／本人文に対する既知敬体差の比較を追加した。STRUCTURE_MAP_DELTA_NONE（既存owner内条件のみ）。quote・修飾source3／opaque理由文1と、選択述語の反復は未解消。旧資産の主体／対象／肯否／時点／unknown保持・変異拒否・独立全文読取・既存保存非生成再読を今回の本文／rawへ適用した。新schema／checker systemや通常生成回数は追加しない。[実装・原本・範囲の正本](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-general-prose-register-20261110)。

次のAR-04は、保存済みc634の新5応答・対照2と旧46、今回のsource資格外3・CMEE未判定1を引き継ぎ、理由・修飾を含む一般文の読取不足と「選ぶ時間を選びたい」の不自然な反復を別の原因として改善する。未判定を意味改変と呼ばず、source／rawの書換えや本人への質問で解析不足を埋めない。同版画像の確認は前回4作品だけで、今回の新5入力（候補本文）へ転用しない。通常統合／本人端末、WholeCanvas／V4の既存失敗、一般品質・AR-01反転と他ARは未完了。c634は通常未採用・selector OFFを維持し、追加fit／通常採用／live配置／署名buildへ自動進行しない。


<a id="piece-literal-reason-register-20261110"></a>
## 11/10 AR-04 — 理由KEEPの完全字面と既知copulaの照合

固定c634の保存済み7rawを追加生成0で再受領し、理由・本人評価を丸ごと保持する既存S7のmodel専用KEEP比較をAPI0c6ad819で限定修復。GENERAL02は未判定→採用となり同7件は6→7採用、旧46の判定／本文と全8入力のsource資格5／資格外3は不変。新隔離SQL21は全保存・保存後0生成、関連17file1129 PASS／既存warning1。原文／raw・source文法・通常selectorは不変、追加学習・GPU操作・live／実DB／build0。反復、引用／修飾等のsource資格外3、一般品質・通常統合／本人端末・正式0/3は残る。

STRUCTURE_MAP_DELTA_NONE（既存S7内のmodel比較のみ）。[原本・全結果](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-literal-reason-register-20261110)。

次のAR-04は、保存済みc634の同7応答と旧46、source資格外3を引き継ぐ。今回のopaque KEEP比較は、完全な同一理由前提／ので／対象／評価語・強調／終端を保持し、肯定非過去の「です／だ」と同一文の同表記本人省略だけを扱う。理由一般の型付き意味理解・否定／過去／推量の拡張とはしない。残る「選ぶ時間を選びたい」の反復、修飾付き評価対象と引用の資格不足を別原因として既存商品ownerで改善する。source／rawの書換えや質問で解析不足を埋めず、通常採用／追加fit／live／署名buildへ自動進行しない。同版画像は前回4作品だけで今回7件への転用不可。


<a id="piece-focal-order-preparation-20261110"></a>
## 11/10 AR-04 — 焦点語順の反復対策候補・実比較未実行

焦点語順を保つ生成条件の候補1baa7977をAPI別branch `agent/piece-focal-order-candidate-20261110`へ保存。既存の資格済み無scope焦点構文から、原文／本人・述語・対象と範囲を同欄の既存条件へ投影し、語順変換に伴う反復を減らす案。関連1158 PASS＋追加operator4 PASS、旧53rawの判定／本文不変。通常API作業正本は0c6ad819のまま。実4B比較用の架空4入力＋実行コードのRunpod送信は自動承認審査で拒否され、upload／新生成／GPU切替0・品質改善未確認。

STRUCTURE_MAP_DELTA_PRESENT_CANDIDATE_ONLY（既存private生成条件境界のみ、通常正本未反映）。[候補・全結果と再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-order-preparation-20261110)。

次は、保存した13,753byteの比較用ZIP（架空新2＋既使用2・比較コード）を既存Runpod f1lle4xwq3wjlnへ送信し、同c634のbefore4／after4と既存提供の前後control4、計最大12HTTP・600秒／復元枠120秒で一回比較する。現在はこの送信・実行への明示承認待ちであり、uploadも生成も再試行していない。原文／raw修補、SYSTEM変更、学習／新レンタル／通常採用／live／実DB／buildは0。修飾付き評価・引用のsource資格外3、一般品質・通常統合／本人端末と他ARは引き続き未完。


<a id="piece-focal-order-actual-20261110"></a>
## 11/10 AR-04 — 実比較完了・焦点条件候補は不採用

承認済みの焦点語順条件を同c634で実比較（架空4入力×前後＝8応答、control4、115.70秒）したが、反復修復0/3・元焦点語順の実現0/4。各版CMEE3/4、FOCAL02の格不成立は両版停止。候補1baa7977は不採用、通常API正本0c6ad819と元提供を維持。隔離保存は24試行＝18保存・非生成再読／6事前拒否。

原提供の復帰と通常／分析control前後一致。追加学習／新weights／retry0。STRUCTURE_MAP_DELTA_NONE_FOR_NORMAL、通常branch／selector／live／実DB／buildの変更0。[全結果と次の作業](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-order-actual-20261110)。

次は既存private保存先から、c634を作った原24教材のsource／messages／target・既存trainer・48更新記録を取得し、焦点構文・活動を含む名詞化対象・格・否定／時点／留保・述語重複の被覆を全24行で監査する。現在のcheckpointにはこの原24教材とfit trainerがなく、被覆件数・原因・次のfit行数はまだ不明。今回の評価4入力を教師へ流用せず、別題材の自然な焦点語順／成立する直接語順を教える最小の学習候補へ戻す。今回の条件追加だけでは改善しなかった事実を保持し、prompt一般や学習原因全体へは断定しない。反復目的のS7緩和や不正raw修補は行わない。修飾・引用のsource資格外3、一般品質、通常統合・本人端末、他ARは未完。


<a id="piece-focal-target-teachers-20261110"></a>
## 11/10 AR-04 — 原24教材監査と希望3targetの最小比較候補

c634の原24教材・元trainer・実48更新・保存weightsを回収照合。焦点source13行は全て直接語順targetで、元語順target0／同述語反復0／大切にしたい0を確認。希望3行のtargetだけを自然な元焦点語順へ変え、全source/messages・他21行を保持した学習比較候補を準備。CPU同意味3／誤意味拒否7・別題材評価4の資格確認済み。新GPU学習／生成／upload0、効果未確認。通常API0c6ad819と1baa不採用を維持。

通常商品source・owner／公開／保存／DB／RN差分0、STRUCTURE_MAP_DELTA_NONE。今回のCPU資格確認・準備を自然さ改善へ換算しない。[原本・候補・再開点](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-target-teachers-20261110)。

次は凍結39792byteの3member ZIP（原24のtarget3だけ変更・架空評価16・一回実行コード）を既存Runpodへ送信し、元trainerのfresh base/config・24行48更新で一回比較する段階。全24の訓練SYSTEM／USERと原入力・他21object、seed20261109／LR1e-4／scopeは不変。新評価4基準＋候補16＋元提供前後control4の最大24HTTP、学習300秒／全600秒・復元120秒、旧c634基準12はexact wire/revisionを確認した原本再利用。前回の4入力・学習0の完了runを再使用せず、今回の具体ファイル送信・学習実行を確認してから進む。通常採用／selector／live／実DB／build0。


<a id="piece-focal-target-learning-result-20261110"></a>
## 11/10 AR-04 — target3の一回学習で反復6・格1を修復

希望3targetの語順だけを変える一回48更新を完了。同16入力の比較で旧反復3＋新反復3を全修復、格不成立1も修復し、CMEE15→16/16。保持8に観測した意味退行0。隔離SQL96は旧45保存／3拒否・新48保存、保存後0生成。全403.40秒で元提供復元・通常／分析control raw前後一致。新f6dae重みと全原本を保存、通常API0c6／selector OFF・本番未反映を維持。

旧作者・期待正文注入・raw修補・意味検査変更なし。新f6daeは研究候補、商品source差分0・STRUCTURE_MAP_DELTA_NONE。[全実結果・限界と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-focal-target-learning-result-20261110)。

次は今回f6daeを保存した研究比較候補として保持し、残るsource資格外3（修飾付き対象・引用）を既存reader／意味型から必要最小の読取へ接続する。原文の対象全体、誰の引用か、肯否・時点・留保を保つ正負例と、広い本人文章での全量source資格・自然な本文・保存再読を確認する。新f6daeで旧53全件の回帰や一般品質、同版画像／通常統合・本人端末は未確認。完了した3target／48更新・24HTTP比較を再実行せず、1baa条件追加も不採用のまま。通常採用／selector有効化／live／実DB／buildの自動実行0。


<a id="piece-modified-preference-reader-20261110"></a>
## 11/10 AR-04 — 修飾付き好み対象を既存readerへ限定接続

API4f343deで、既存の名詞句readerを本人の「は」好み評価へ限定再利用し、修飾付き対象「一人の食事」「静かな朝食」を全体のまま接続。元8sourceの資格は5→7、引用1は拒否維持。保存済み実4B69照合行のmessages／採否／本文を0生成で維持。新2の独立CPU作文は3plan計6保存・再読、保存済みf6dae16応答は別に48保存・再読。新2の実4B応答は未取得。通常モデル／selector OFF・本番未反映を維持。

STRUCTURE_MAP_DELTA_PRESENT：既存source資格とmodel専用S7の接続範囲を変更。`ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py`の`_modified_preference_nominal`は既存`emlis_ai_grounded_observation_plan._WISH_OBJECT_NOMINAL_SOURCE`を再利用し、字面を限定した「静かな」を加え、完全targetを既存`personal_evaluations`へ渡す。`ai/services/ai_inference/piece_v2_content_policy.py`の既存`same_evaluation`／S7内で、明示時間文脈付きの本人「は」好み評価だけを内側の既存typed keyで比較する。新owner／公開DTO／DB・保存schema／API入口／RN追加0。共用`_SIMPLE_NOUN`、他のfocal／価値／動作構文、native既定比較、旧作者fallbackは変更しない。

最終20file1367 PASS／FAIL・skip0、既存warning1。新規81件はsource36＋model45、修正した旧短文期待1件を含むfocused82 PASS。API4f343deのPiece／Analysis CIはattempt1で全成功。Piece run42784359892／job129721787981は全39step成功（model17file1174 PASS、境界選択78 PASS／420 deselected）。Analysis run42784359662／job129721783644は全19step成功。対象head一致、追加実行／rerun0。 [実確認と残件](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-modified-preference-reader-20261110)。

次は引用GENERAL07について、旧引用境界readerと既存人物／評価意味型を照合し、友人の発言・本人の経験と気持ちを分離して原文全体を保持する最小接続を進める。今回資格化したGENERAL01／08の実4B本文と、広い本人文章の意味保持・自然な語りは未確認。前回f6daeは研究候補のまま保持し、完了した48更新／24HTTP比較を再実行しない。引用一般・新f6daeで旧53全件の生成回帰・一般品質・同版画像／通常統合／本人端末は未完。今回の69行再照合は異なる保存済みcohortの照合で、新f6daeによる69生成ではない。1baa条件追加は不採用、通常モデル採用／selector有効化／live／実DB／buildの自動実行0。


<a id="piece-single-quote-context-reader-20261110"></a>
## 11/10 AR-04 — 一組の引用を既存literal経路へ接続

APId7442335で旧引用境界readerをPieceの原sourceへ限定接続。GENERAL07の引用・発言者・くれた・否定条件・可能形・過去感情を既存KEEPで全量保持し、元8sourceの資格7→8。引用内の既存scanner認識名は話者をまたぐ役割誤継承を防ぐため拒否、引用外の既存公開役割は維持。保存済み実4B69照合行のmessages／採否／本文を0生成で維持。直近残件3の独立CPU作文を3plan計9保存・再読。新3の実4B応答は未取得。f6dae研究候補／通常selector OFF・本番未反映を維持。

STRUCTURE_MAP_DELTA_PRESENT：既存source受理境界の変更。`ai/services/ai_inference/piece_v2_generation.py::_sentences`から、既存`emlis_ai_grounded_sentence_surface._body_primary_quote_spans`を再利用する。一組の非empty「」と既存stopで完結する引用外lineだけを通し、内部stop文字`。！？!?`・CR/LF、空／不整合／複数／多重・別quote種は未対応。`ai/services/ai_inference/cocolon_meaning_experience_engine/piece_source.py::_role_bindings`では、既存name scanと引用spanの重なりを確認し、引用内の人名をglobal aliasへ渡さない。既存plan／KEEP作者／S7 literal比較・Safety・保存consumerを変更せず利用。新意味型／公開DTO／保存schema／DB／API入口／RN／作者／checker追加0。

最終関連31file5176 PASS／FAIL・skip0、既存warning1。新quote52件と既存境界等を含む補正focused125 PASS。APId7442335のPiece／Analysis CIは対象head一致・attempt1で全成功。Piece run42799640908／job129773578374は全39step成功（model主要1226 PASS、境界選択78 PASS／420 deselected）。Analysis run42799640715／job129773579066は全19step成功。追加実行／rerun0。 [全結果と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-single-quote-context-reader-20261110)。

次はsource資格化したGENERAL01／07／08の新しい実4B応答を確認し、完全対象・本人表記・時点／肯否・引用と外側の発言者／感情・自然な本文・同版保存を照合する。同3の原7項目・prepared identity・現行builderの送信messagesはprivateに準備済みだが未送信。CPU作文の採用を実モデル改善と呼ばない。引用一般の言い換え、引用内の名前・複数／多重・内部stop／CR/LF、広い一般文章、新f6daeで旧53全件の生成回帰、同版画像／通常統合／本人端末は未完。完了済み48更新／24HTTP比較を再実行せず、1baa条件追加も不採用。通常採用／selector有効化／live／実DB／buildの自動実行0。


<a id="piece-model3-inference-result-20261110"></a>
## 11/10 AR-04 — 実4B新3と時間scope内の同本人継続

API2ec79ad0で時点付き本人「は」好み評価の同本人省略を既存S7継続へ接続。明示承認後、保存f6daeで新3＋保持2の実4B本文を1回・学習0で確認。GENERAL01の自然な2文目省略が旧比較で保留されたため、同block・隣接・同じ本人表記の既存条件だけを再利用し、5/5採用・3plan計15保存／非生成再読。保持2の前回request／raw／revisionと凍結69照合行の採否／本文／messagesは不変。9HTTP・97.268秒で元提供復元／health／前後control一致。f6dae研究候補・通常selector OFF、本番未反映。

STRUCTURE_MAP_DELTA_PRESENT：既存のモデル本文比較境界だけの変更。`ai/services/ai_inference/piece_v2_content_policy.py::validate_source_meaning_preservation` のSOURCE_EXPLICIT_TIME_CONTEXT分岐で、PERSONAL_PREFERENCEかつconstruction=はの既存絞込みを保ち、計算済みsame_authorによるoptional_prefixを既存same_evaluationへ渡す。新しい語り手推論やsource受理armを作らず、原time外側の全文anchor・全対象・肯否／時点／程度／留保・にとってを維持。商品source1path、`ai/tests/test_piece_model_temporal_self_omission.py` 新規29件、`ai/tests/test_piece_model_prose_register.py` の旧省略negativeをpositiveへ整合、`.github/workflows/piece-b2b-isolated-postgres.yml` の既存実行step／path filterへ新testを追加。新意味型／公開DTO／保存schema／DB／API入口／RN／作者／checkerなし。

関連32file5205 PASS、FAIL／skip0、既存warning1。新しい本人継続境界29件を含む。API2ec79ad0のPiece／Analysis CIは対象head一致・attempt1で全成功。Piece run42809225286／job129806123954は全39step成功（model主要1255 PASS、境界選択78 PASS／420 deselected）。Analysis run42809225253／job129806123443は全19step成功。追加実行／rerun0。 [全結果と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-model3-inference-result-20261110)。

次は広い文章での反復・理由／引用などの残件を、既存資産を再利用して進める。今回の新3の実4B・同版保存は完了したため未取得へ戻さない。新3に旧c634のbaselineはなく、f6daeの改善率／学習効果や一般品質の合格に換算しない。引用一般の言換え・複数／多重・内部stop／CR/LF・引用内認識名、新f6daeによる旧53全件の生成回帰、同版画像／通常統合／本人端末は未完。完了済み今回9HTTP／前回48更新は再実行しない。通常採用／selector有効化／Render／live DB／RN／buildの自動変更0。


<a id="piece-quote-internal-stops-20261110"></a>
## 11/10 AR-04 — 引用対応文分割をsource／S7へ再利用

API5816f2d0で既存の引用対応文分割をPiece source／S7へ再利用し、一組の「」内の句点・疑問符・感嘆符を完全なKEEPとして保持。固定CPU4例は受付不可→採用、3plan計12保存／非生成再読。凍結実4B69照合行と、別照合した直近5応答の採否／本文／messagesは不変。Unicode空白の既存互換も保持。追加GPU生成／学習0、f6dae研究候補・通常selector OFF、本番未反映。

STRUCTURE_MAP_DELTA_PRESENT：既存source受理とS7の文境界だけを拡張。`ai/services/ai_inference/piece_v2_generation.py::_sentences`と`ai/services/ai_inference/piece_v2_content_policy.py::validate_source_meaning_preservation`が、既存`emlis_ai_grounded_sentence_surface._body_sentence_spans`を呼ぶ。引用内stopを外側文の境界にせず、元の全文slice・引用者／外側の感情・欄／段落・scalar／UTF-8根拠を維持し、S7は全block被覆・node数・literal KEEP照合を続ける。既存helper／Emlis本体・名前binding・意味型・公開DTO／保存schema／DB／API入口／RN／SYSTEM・通常selectorは変更しない。一組の非empty「」・引用外完全文に限定し、420字とraw stop上限6、引用内CR/LF・複数／多重・別quote種・認識名の拒否を保つ。Unicode空白U+00A0／U+2002／U+2003は候補側もcursorからspan終端までを保持し、正規化で消さない。

最終関連32file5263 PASS、FAIL／error／skip0、既存warning1。固定CPU4例は親2ecで全拒否→全採用、3plan計12保存／非生成再読・原入力／Emlis不変。凍結実4B69行と直近5応答の採否／本文／messagesを追加生成0で維持。最終focused393、別source／空白2file2421は同検証の重複を含むため加算しない。初回の旧拒否期待3失敗のlog／XMLを保持。独立reviewで見つかったUnicode空白退行と、補正testのblock期待・環境不足の経過も記録し、最終検証で成功を確認。新規実4B応答／学習／GPU操作／本番変更0。

API5816f2d0の[Piece CI42813970927](https://github.com/MassyuRed/mashos-api/actions/runs/42813970927)と[Analysis CI42813971055](https://github.com/MassyuRed/mashos-api/actions/runs/42813971055)は、対象head一致・attempt1で全工程success。Piece job129822209000／39step、Analysis job129822209316／19stepを確認。追加run／rerun0。通常配置を行うworkflowではない。

次は、今回資格化した引用内stopを持つ新4例の実4B本文と、引用を含む理由・希望の自然な実現を確認する。新4＋保持1のcurrent builder送信材料はprivateに準備済みだが、未送信・実行runner未準備。今回の固定CPU本文を実4B品質改善へ換算しない。一組引用の字面保持は確認したが、引用一般の言換え・複数／多重・引用内CR/LF・引用内認識名、理由一般の型付き意味理解、広い一般文章、新f6daeによる旧53全件の生成回帰、同版画像／通常統合／本人端末は未完。前回の新3実4B／15保存と9HTTP・48更新は完了済みとして継承し、再実行しない。通常採用／selector有効化／Render／live DB／RN／buildの自動変更0。


<a id="piece-quote-stop-inference-prepared-20261110"></a>
## 11/10 AR-04 — 引用新4＋保持1の具体packetと未実行範囲

引用内stopを持つ新4件＋保持GENERAL07の現builder送信messagesを固定し、13,140byte・2memberの無学習比較packetを準備。構文compile／CRC／member照合は成功、実モデル生成・送信・提供停止0。非環境の稼働確認はhealth200。起動環境全体の読取りは認証情報を含み得るとして自動承認審査に拒否され、未実行。新packet送信と、完全復元に必要な環境内再利用の具体承認待ち。API5816f2d0／f6dae研究候補・通常selector OFF・本番未反映を維持。

新4の原入力7項目は前回固定CPUのFree保存原本と一致。全5のprepared identity／private JSONと現builder messagesは再導出一致、保持GENERAL07は前回の実request／raw／f6dae revisionとも一致。新4は再構成ownerによりsource_refがCPU送信時と異なるため、CPU時のwire完全同一とは呼ばない。期待正文・raw修補を送信材料に加えない。実行は新4＋保持1と通常／分析前後control4の最大9HTTP、学習0・retry0・Piece load1、全600秒／復元枠120秒。停止前に既存cacheの実tokenizerで入力＋2048≦8192を確認し、不一致は提供停止前に拒否する。

STRUCTURE_MAP_DELTA_NONE。今回はprivate実行準備だけで、商品API／source文法／S7／DB／RN／renderer／通常選択／依存・新GPUの変更0。今回の新pytest／CI実行0、API5816f2d0の前回5263 PASS／両CI成功を継承する。環境全体の読取り・hash確認を、別形式／別経路／runner内で承認なしに代行しない。非環境のPID／args／cwd／source・保存重みだけを確認し、environment hashは前回baselineでありfresh確認済みとはしない。元environment完全一致を守れる既存supervisorは確認できず、変数名を選別して同等復元済みとする代替は不採用。

runnerは起動時の明示ack引数がなければdir作成・process読取前に終了するが、その引数自体はユーザー承認の証拠ではない。確認対象は、この13,140byte packetの既存Runpodへの送信と、同Runpod内で元提供を完全復元するための起動環境全体（既存認証情報を含み得る）の一時読取／コピー・再利用、および一回の無学習比較。環境値を意図的に表示・file／networkへ直列化する処理はない。子serving logを保全するため、既存2API鍵scanを任意の全設定の非漏出証明へ拡張しない。承認後もfresh preflightが元PID／args／cwd／source・weights／env baselineの不一致を検出すれば停止前に終了し、別の材料や反復へ自動進行しない。

次はこの具体的な送信・起動環境再利用・一回実行の承認を得てから進む。今回の新4実4B本文は未取得。実行後は完走／復元と別に、保持GENERAL07の旧raw／revision一致、全5本文の意味・自然さ、CMEE採否と3planの保存・非生成再読を確認する。引用一般の言換え／複数／多重／引用内CR/LF／認識名、理由一般の型付き理解、広い一般品質・同版画像／通常統合／本人端末、AR-01と他ARは未完。前回9HTTPと48更新を再実行しない。


<a id="piece-quote-stop-inference-result-20261110"></a>
## 11/10 AR-04 — 新4実4B・12保存／3拒否・元提供復元

Mashの具体承認後、保存f6daeで新4＋保持1を一回・学習0で実確認。新4中3件＋保持1を採用、QUOTE-RUNは引用内強調の句点化と外側本人表記省略で不採用を維持。3plan計15試行は12保存／非生成再読・3事前拒否。9HTTP・108.873秒で元提供のargs／env／cwdを復元し、healthと通常／分析の前後control完全一致。API5816f2d0・f6dae研究候補／通常selector OFF、本番未反映。

凍結13,140byteの架空入力／既存runnerを承認範囲どおり既存Runpodへ送信。新4＋保持GENERAL07の全5requestが凍結messagesと現builderへ一致し、HTTP200／stop。既存tokenizerで最大1562入力token＋2048を停止前に確認。Piece一回load、追加学習／新weights／retry0。元提供への復元後、起動引数・全environment・cwd・既存credentialsの維持、health200、前後natural／Analysisの全response bytes一致を確認。新しい起動環境読取の未承認状態は今回の明示承認により解消し、このpacketの一回実行だけに適用。他payload／再実行や恒久許可へ拡張しない。

| 実入力 | 本文・採否 | 確認した範囲 |
|---|---|---|
| QUOTE-STOP | 採用 | 引用内句点・発言者・外側の否定条件／可能形・過去感情を保持 |
| QUOTE-QUESTION | 採用 | 引用内疑問符と外側の本人経験・感情を保持 |
| QUOTE-RUN | 不採用 | 引用内の二重感嘆符を句点へ変更し、外側の明示一人称を省略 |
| QUOTE-PARAGRAPH | 採用 | 引用段落と本人の感情段落を別slotのまま保持 |
| GENERAL07 | 保持・採用 | 前回のrequest／raw／全response／revision／usageと完全一致 |

rootと独立担当が全5原文・rawを全読。4採用本文は原文の字面維持であり、一般文章の新しい編集品質改善とは呼ばない。QUOTE-RUNは文法上自然だが、引用の強調を変えており既存KEEPへは採用できない。外側本人省略だけから感情所有の友人への反転を認定せず、S7を緩めたりrawを修補しない。新4には旧モデル生成baselineがなく、学習改善率は出さない。

同じ無修補rawを既存保存consumerへ厳密再bindし、Free／Plus／Premiumの15試行で12保存・同／新serviceの非生成再読、3拒否時のrecord／quota不変を確認。保存は元GPU入力ID／時刻と別の同内容synthetic ID／日時を使う隔離SQLであり、live Supabaseや元GPU identityの通常永続化ではない。原入力／Emlis不変・保存後0生成、旧作者fallback禁止・current builder一致・frozen raw／input不変を確認。STRUCTURE_MAP_DELTA_NONE、商品source／source文法／S7／DB／RN／renderer／通常選択変更0。今回新pytest／CI実行0、API5816f2d0の前回5263 PASS・両CI成功を継承する。凍結69と前回新3の完了creditは継承し、今回新規69生成・再照合とはしない。

次は引用内の句読点・強調を平文化する生成側の残差を、既存引用reader・欄別生成条件と原教材の対応から切り分ける。今回の不採用rawを通すS7緩和・原文／raw修補、同じ9HTTPや完了済み48更新の再実行はしない。新4実4Bの取得と同版保存確認は完了として引き継ぐ。引用一般の言換え・複数／多重・引用内CR/LF／認識名、理由一般の型付き読取、広い一般文章品質・同版画像／通常統合／本人端末、AR-01と他ARは未完。通常採用／selector有効化／Render／live DB／RN／buildの自動変更0。


<a id="piece-quote-context-conditions-20261110"></a>
## 11/10 AR-04 — 引用の字面保持を生成側へ渡す候補

APIa67fb6f2で、既存KEEPの引用範囲を欄別4B生成条件へ投影する候補を反映。引用内の全字面・句読点／強調と同欄の引用外本人表記を保持する条件を渡す。SYSTEM・既定messages・source資格・S7は不変。関連32file5287 PASS、保存済み実5の4採用／1拒否と既存69行の採否／本文／messagesを維持。新4B効果は未確認、13,723byteの比較packetは未送信・未実行。f6dae研究候補・通常selector OFF・本番未反映。

STRUCTURE_MAP_DELTA_PRESENT_CANDIDATE_ONLY：既存`ai/services/ai_inference/piece_model_source.py::_authoring_constraints`が、資格済みsource planの`KEEP_COMPLETE_SOURCE_CONTEXT` dutyと既存`emlis_ai_grounded_sentence_surface._body_primary_quote_spans`を再利用する。part別planに対応する元引用のかぎ括弧込みliteralとfield内scalar範囲を、明示opt-in時だけ既存欄条件の`literal_quotes`へ投影。引用のある欄だけに`quote_context_instruction`を付け、引用内文字／記号数と同欄のliteral内の引用外一人称表記を保つ。原文／PreparedRequest／ID／SYSTEMは不変、別欄／段落／原入力と補足を混ぜない。新しいreader・意味型・作者・checker・公開DTO／保存schema・DB・API入口・RN・rendererは追加せず、S7や不正rawの修補は行わない。

変更は商品1pathと既存test2path（`ai/tests/test_piece_model_authoring_constraints.py`、`ai/tests/test_piece_model_authoring_application.py`）だけ。関連32file5287 PASS、FAIL／error／skip0、既存warning1。新24件は引用のexact字面／field座標、非引用／既定OFF不変、段落とrefinedのpart別plan、公開役割、資格外引用の拒否、configured MockTransportへの1取得伝達、句点化・強調削減・本人省略・話者／感情変異の拒否を確認する。初回focused137 PASSは最終回帰と重複するため加算しない。保存済み実5rawの採否と本文は4採用／1拒否を維持し、元の69照合行も採否／本文／messagesを0生成で維持。新5送信候補は原7項目・prepared ID／JSON・SYSTEM／field_slotsを維持し、引用条件だけが追加される。今回の新しい実モデル本文・同版画像／端末検証・live DBは0。

APIa67fb6f2の[Piece CI42826604954](https://github.com/MassyuRed/mashos-api/actions/runs/42826604954)は対象head一致・attempt1で全工程success。job129865467629／39stepを確認。追加run／rerun0。今回の変更pathでAnalysis workflowの新runはなく、Analysis・通常配置の新成功は主張しない。

次は変更した欄別条件で、既取得5入力（問題QUOTE-RUN1＋保持4）を同じf6daeで一回・学習0で比較する。前回の同5rawを旧条件baselineとして再利用し、旧条件の追加生成は0。新packet13,723byte／2member、SHA256 `f5a7989570d95dc2b3d9dcacf65f6bc1978eeab7be80fef383dbe62a7a240cde`。5候補＋通常／Analysis前後control4の最大9HTTP、Piece1load、再試行0、復元込み600秒／復元予約120秒。既存Pod f1lle4xwq3wjlnへ新packet送信と、元提供を同じ状態へ戻すための起動環境全体（認証情報を含み得る）の同Pod内一時読取・再利用は今回の具体確認後に行う。前回の消費済み一回承認へ遡及させず、今回は送信／新生成／停止／起動環境読取0。引用だけ直っても本人省略が残れば採用へ格上げせず、同じS7・全本文読取・3plan保存再読で判定する。広い引用／理由の型付き読取・一般品質・同版画像／通常統合／本人端末と他ARは未完。通常採用／selector有効化／Render／live DB／RN／buildの自動変更0。


<a id="piece-quote-context-actual-result-20261110"></a>
## 11/10 AR-04 — 引用欄条件の実比較・5採用と15保存

承認済みの引用条件比較を同f6daeで一回・学習0で実行。前回失敗したQUOTE-RUNは引用の強調と引用外の本人表記を両方保持し、不採用→採用へ回復。保持4のraw／全responseは完全一致、全5採用・3plan計15保存／非生成再読。9HTTP・102.873秒で元提供のargs／env／cwdを復元し、healthと通常／Analysisの前後response完全一致。APIa67fb6f2／f6dae研究候補・通常selector OFF、本番未反映。

13,723byte／SHA256 `f5a7989570d95dc2b3d9dcacf65f6bc1978eeab7be80fef383dbe62a7a240cde`の新packet送信と、起動環境全体の同Pod内一時読取・再利用についてMashが具体承認した後、既存Runpod f1lle4xwq3wjlnへ送信。元と異なる5入力を増やさず、既取得同5source・同SYSTEM・同重み／revision・同生成設定で、既存USERの引用欄条件だけを変更した。旧5rawをbaselineとして再利用し、旧条件の新生成0。候補5＋通常／Analysis前後control4の実9HTTP、Piece1load、追加学習／新weights／retry0。全600秒／復元予約120秒の枠内で102.872737秒、停止前の最大入力1849token＋生成予約2048は8192以内。元起動引数・全environment・cwd・credentials・既存source／adapter／weightsを保持し、前後controlの全response bytes一致と独立health200を確認。環境値を意図的に表示／直列化せず、原本は既知2API鍵のscanを通過。今回の一回承認は消費済みで、恒久許可／他payload／再実行へ拡張しない。

| 実比較 | 結果 | 確認した範囲 |
|---|---|---|
| QUOTE-RUN | 旧不採用→新採用 | 引用内の二重感嘆符と、引用外の明示本人表記をともに原文どおり保持 |
| QUOTE-STOP／QUESTION | 保持・採用 | 旧raw／全responseと完全一致。引用内stop・発言者・外側本人の経験と過去感情を維持 |
| QUOTE-PARAGRAPH | 保持・採用 | 旧raw／全responseと完全一致。引用段落と本人感情段落を別slotで維持 |
| GENERAL07 | 保持・採用 | 旧request材料は引用条件追加以外exact、旧raw／全response／revision／usageは完全一致 |

rootと独立担当が全5原文・旧新10本文を全読。引用の話者・言ってくれた方向、外側の否定条件／可能形・経験と過去感情・段落を保持し、意味追加や役割反転を認めなかった。既存S7を緩めず、全rawを無修補で判定して5/5採用。全5はsource段落の字面維持であり、新しい一般文章編集品質の合格にはしない。引用と本人表記の条件を同時追加した一回比較なので各条件の単独効果は未分離。新入力への一般化・学習能力・複数回の安定性・速度改善は未証明。

無修補の新5rawを既存consumerへ厳密再bindした隔離SQLはFree／Plus／Premium計15/15保存・同／新serviceで非生成再読。保存後生成0、原入力／Emlis不変、旧作者fallback禁止を確認。GPU側元ID／日時と別の同内容synthetic ID／日時を使う隔離検証であり、live Supabase／実Auth／実端末／native画像の確認ではない。STRUCTURE_MAP_DELTA_NONE（既存a67fb6f2の生成条件の実比較のみ）。今回の商品source／source文法／S7／DB／RN／renderer／通常selector差分0。新pytest／CI実行0、前回a67fb6f2の5287 PASSとPiece CI42826604954／39step全成功を継承。凍結69は前回照合済みとして継承し、今回新規生成／再照合とはしない。

次は引用を含む理由・希望の読取を、既存意味型・引用境界・欄別条件から必要最小で進める。今回の対象5の実4B取得・強調／本人表記回復・同版保存15は完了として引き継ぐ。引用一般の言換え／複数・多重／引用内CRLF／認識名、理由一般の型付き読取、広い一般文章・新f6daeの旧53全生成回帰、同版画像／通常統合／本人端末、AR-01と他ARは未完。今回9HTTPと完了済み48更新を再実行せず、新しいfitやGPU比較を自動選定しない。通常モデル採用／selector有効化／Render／live DB／RN／buildの自動変更0。


<a id="piece-quoted-outer-scope-reader-20261110"></a>
## 11/10 AR-04 — 引用外の理由・本人表記だけを既存scopeへ束縛

APIc34b820bで、引用内の接続詞・一人称を外側の理由／希望へ誤束縛する読取を修復。引用外の既存scope境界だけを原文上へ束縛し、既存scoped dutyの前提内引用にも生成条件を渡す。固定CPU新2は1件の資格拒否を回復し、1件の誤った引用内scopeを外側へ訂正、3plan計6保存／非生成再読。新46を含む39file5729 PASS／既存3 FAIL、親a67でも同3失敗。前回実5と既存69行の採否／本文／messagesは不変。新2の実4Bは未取得、13,703byte比較packet未送信。f6dae研究候補・通常selector OFF、本番未反映。

STRUCTURE_MAP_DELTA_PRESENT：既存`cocolon_meaning_experience_engine/piece_source.py`の`_scoped_expression_match`は、引用がなければ旧`_SCOPED_EXPRESSION.fullmatch`をそのまま返す。引用時は既存`_body_primary_quote_spans`と既存`_SCOPE_RELATIONS`から引用外の接続詞位置を選び、元patternの前提長だけをその位置へ制約して原文上でfullmatchし、一意な外側境界へ束縛する。元の非empty前提を保つためposition>0を必須とし、各group・scalar／UTF-8根拠を元文字列のまま保持。引用外のSELF言及だけを既存同本人検査へ渡す。`piece_v1c.py`と`piece_v2_content_policy.py`の既存読取・S7再導出も同ownerへ揃える。`piece_model_source.py`は既存`literal_quotes`を、資格済みscoped dutyの前提範囲内にある引用へだけ追加投影。引用者の一人称・理由・希望を外側本人へ昇格しない。新意味型／公開DTO／DB／保存schema／作者／checker・通常selectorは追加しない。

固定CPU新2の比較では、引用内に本人表記があるため旧資格拒否された例は新資格成立→同じ原文本文で既存CMEE採用。引用内外に理由がある例は旧scopeが引用内部で切れていたものを、外側の発言全体＋接続詞と外側の本人の希望へ訂正し、全文を保持して採用。明示原入力7項目の保存consumerを通した新2×3planの6保存・同／新serviceの非生成再読、原入力／Emlis不変・quota各1を確認。ここでの本文は独立固定CPU材料で、実4Bの品質改善とは呼ばない。原文／PreparedRequest・欄／段落／元と補足・話者と引用literal・否定／希望／時点の既存境界、quote／declarationへの切出し禁止を保つ。

最終39file5732件は5729 PASS／3 FAIL、error／skip0、既存warning1。新46件は全成功し、引用内外の接続詞／SELF、focal／評価、scope根拠、別欄／refined、空前提拒否、変異拒否と6保存を含む。追加で広く確認した旧scope2fileでは、無引用の時点付きfocal・本人concession付きfocal・理由付き本人価値の3つの旧negative期待が失敗。a67 exact overlayの同2fileも100 PASS／同じ3 FAILで、失敗IDが全一致した。今回この既存3件の期待値や無引用契約を変更せず、5729 PASSだけで全GREENとはしない。初回新test45 PASSと最終46、親100 PASSは重複・別条件のため加算しない。独立reviewで見つかった空前提受理の候補不具合はposition>0で修正し、新negativeを含む最終回帰で確認。前回実4B5行と既存69照合行の採否／全文／messagesを追加生成0で維持した。

APIc34b820bの[Piece CI42835666538](https://github.com/MassyuRed/mashos-api/actions/runs/42835666538)と[Analysis CI42835666566](https://github.com/MassyuRed/mashos-api/actions/runs/42835666566)は対象head一致・attempt1で全工程success。Piece job129897056145／39step、Analysis job129897056096／19stepを確認。追加run／rerun0。両CI成功を、別に広げたlocal39fileの既存3失敗の解消とは呼ばない。通常配置を行うworkflowではない。

次は新2（SCOPE-QUOTE-SELF／REASON）＋保持3（QUOTE-RUN／PARAGRAPH／GENERAL07）の実4B本文と、同じ5のCMEE採否・3plan保存再読を一回・学習0で確認する。原7項目・prepared ID／JSON・現builder送信messagesを固定。保持3は前回case objectと全messagesがexactで、新2に旧モデル生成baselineはない。13,703byte／2memberの架空入力と既存runner流用ZIP、SHA256 `78a97b3546c754be3b54fa7ad813859c4056ce1e67122eb4ba9d40e6a9d83ac1`は未送信／未実行。候補5＋通常／Analysis前後control4の最大9HTTP、Piece1load、学習／新weights／retry0、復元込み600秒／復元予約120秒。新packet送信と認証情報を含み得る起動環境全体の同Pod内一時読取・復元再利用は今回の具体確認後に行い、消費済み前回承認を再利用しない。前回の5採用／15保存／102.873秒復元は完了として継承。一般理由／引用・非transitive希望の文体差／広い文章、新f6daeの旧53生成回帰、同版画像／通常統合／本人端末、既存3失敗と他ARは未完。新GPU／追加学習／通常採用／Render／live DB／RN／buildの自動実行0。

<a id="piece-quoted-outer-scope-actual-20261111"></a>
## 11/11 AR-04 — 引用外scopeの実4B本文・保存再読

APIc34b820bの引用外scope修復を、明示承認された新2＋保持3の実4Bで一回確認。5/5採用、3plan計15保存・非生成再読、保持3の全request／raw／response完全一致。9HTTP・学習／retry0、101.508秒で元提供のargs／env／cwdを復元し、通常／Analysis前後response一致・health200。新2に旧モデル生成baselineはなく、原文保持の確認を一般作文品質の改善率へ換算しない。既存3失敗・同版画像／通常統合／本人端末は残件。f6dae研究候補・通常selector OFF、本番未反映。


Mashの今回の明示承認後、固定13,703byte／2member・SHA256 `78a97b3546c754be3b54fa7ad813859c4056ce1e67122eb4ba9d40e6a9d83ac1`を既存Pod f1lle4xwq3wjlnへ送り、一回だけ実行した。架空新2＋既露出保持3、候補5と通常／Analysis前後control4の9HTTP、Piece1load、追加学習／新weights／retry／SYSTEM変更0。起動環境全体は元提供の完全復元のため同Pod内で一時読取・再利用し、起動環境の全内容・認証値を原本ZIPやGitHubへ出していない。送信packetとrunnerの名前は11/10の凍結時点を維持し、実行日は11/11 JST。

全処理101.508068秒で元base／既存Analysis提供へ復元した。元PID58638→復元PID61979。args／env／cwdと認証値、元source・Analysis adapter・保存Piece重みの前後一致を確認。通常／Analysisの前後requestと全responseはそれぞれ完全一致し、health正常・独立したlocalhost health HTTP200。最大600秒の承認内で、完了済み前回102.873秒の試行を再実行したものではない。新2の入力token1588／1608、保持3は1708／1849／1556、各2048生成予約込み8192以内。

| 実入力 | 今回の結果 | 全文で確認したこと |
|---|---|---|
| SCOPE-QUOTE-SELF | CMEE採用・3plan保存再読 | 引用内の一人称を友人の発言内へ保持し、外側の本人の読書希望と分離 |
| SCOPE-QUOTE-REASON | CMEE採用・3plan保存再読 | 引用内の理由／休みたいを外側へ移さず、発言全体＋外側の理由と本人の読書希望へ束縛 |
| QUOTE-RUN | CMEE採用・3plan保存再読 | 前回の全request／raw／responseと完全一致、引用の強調・本人表記を保持 |
| QUOTE-PARAGRAPH | CMEE採用・3plan保存再読 | 前回の全request／raw／responseと完全一致、引用と外側段落を保持 |
| GENERAL07 | CMEE採用・3plan保存再読 | 前回の全request／raw／responseと完全一致、引用・否定条件・可能形・過去感情を保持 |

current APIの6対象blobと送信messagesを照合し、実rawを修補せず既存receipt→CMEE／S7へ通した。旧作者fallbackを禁止したまま全5 GENERATED／拒否0。隔離SQLの3plan15試行は15保存、同／新service再読は保存本文一致・0再生成、原入力／Emlis不変・quota各1。保存consumerだけに合成owner／ID／日時を使う等価fixtureで、live Supabase／Authや元GPU要求identityそのものの検証ではない。新しい一回用reviewは現公開repo内の既存保存helperを直接利用し、商品source／test／workflowは変更していない。

華恋と独立担当が5原入力と実本文を全文読取。話者・時点・否定・希望・引用の字面を保持し、未記載の出来事／気持ち／相手意図の追加は見られなかった。一方、全5は各slotの原文を保持した出力であり、一般文章の編集・単独伝達品質の改善を証明しない。新REASONの二重「ので」の重さも原文のまま残る。新2には旧model生成baselineがないためモデル前後改善率は算出しない。保持3は前回露出済みで新規holdoutではない。正式Product Read・本人受入れ・商品品質creditは追加しない。

前回c34の新46成功、local39file5729 PASS／既存3 FAILと同親a67の3失敗再現、Piece／Analysis CI成功は前回の条件付き証拠として保持。今回source変更がないため全suite／CIを再実行せず、15保存の成功を既存3失敗の解消へ読み替えない。STRUCTURE_MAP_DELTA_NONE（今回は実結果だけ。前回c34読取修復のPRESENTは履歴として維持）。DB／公開DTO／保存schema／RN／renderer／通常selectorの責務は変わらない。

非公開実原本ZIP SHA256 `415d4210cec837e07f8dc634149a2a7e39e743cf76657c9ca36b0e9807466ec0`、result SHA256 `a1b625e2188e8b6557b9ea07a43887778b25ff4a1393245dacdc0d247bb5ad51`。原本・実5全文・隔離15・独立読取・再開点は同じ既存ファイルを更新して保持する：[原本と再開点](https://chatgpt.com/library?file_id=libfile_fde3_f-673fcfecced481919979fee3a71efe51_2f7470f963808191aaebf050935e72de&account_id=personal)。

次は引用・理由の一般読取、非transitive希望の文体差と広い一般文章を、既存source／意味型／欄別生成条件と保存済み実本文から進める。今回の新2実4B・保持3照合・15保存再読は完了として継承し、この9HTTPを再実行しない。新2の旧model baseline、広い一般品質、新f6daeの旧53全生成回帰、同版画像／通常統合／本人端末、既存無引用3失敗、AR-01と他ARは未完。新しいGPU実行・追加学習・通常採用・selector有効化・Render／live DB／RN／buildを今回の承認から自動実行しない。

<a id="piece-scoped-self-register-20261111"></a>
## 11/11 AR-04 — 理由付き本人希望の文体比較を既存S7へ接続

APIa4bbe636で、既資格の理由／条件／譲歩付き本人希望の原順・全字面を保つ文体比較を修復。固定CPU新3の同じ常体候補は0→3採用、原文対照3・意味変異33拒否を維持し、3plan計9保存／非生成再読。原7項目・prepared／messages・source意味／根拠／planは前後一致、前回の実5本文も0生成で維持。新80成功、関連39fileの重複除外5812件は5809 PASS／既存3 FAIL。両CI成功。新3の実4Bは未取得、13,619byte比較packetは未送信。f6dae研究候補・通常selector OFF、本番未反映。


現物で、既にsource資格とSOURCE_EXPLICIT_REASONのある本人希望は原文なら採用されても、「です」を外しただけの自然な候補がmodel専用S7で未判定になることを固定CPUで確認した。既存 `piece_v2_content_policy.py::validate_source_meaning_preservation` 内の比較だけを修復した。既存patternが失敗し、`_model_register`・scope存在・`topic_kind == 'wish'`の全条件が成立する場合に限り、元文のsource_startからexpression_startまでを引用・接続詞・区切り・横空白込みでanchorする。候補側のmatch終端から末尾までの全量を、既存 `same_literal_self_register(expression, suffix)` へ渡す。本人や対象・述語・肯否・時点・留保・終端は変えず、既存の任意「です」比較を再利用する。原prefix保持のため、旧canonical読点と異なる元の区切り／空白は、文体差のない原文保持でも採用可能になる。区切りの正規化や任意語の許可ではない。

既存pattern成功時、既存canonical語順、native比較、source資格／意味型／作者／WISH_END／SYSTEM／生成条件／公開DTO／DB／保存schema／RN／renderer／通常selectorは変えない。明示本人を落とす候補、外側理由や接続詞の変更、引用内一人称・全字面の変更、希望を否定・過去・実行済み・留保へ変える候補、末尾の強調変更や文追加は拒否する。モデル本文の修補・期待正文の送信・旧作者fallbackは行わない。literal扱いの「休みたい／読みたい」の原順問題、理由付き好みの文体差、前置canonical側の新しい文体差は今回へまとめず残す。

独立固定CPU新3は、雨と家で過ごす希望、余裕と加わりたくない希望、友人の引用と外側の本人希望。旧c34 policyでは原文3採用／常体候補0採用、新版は原文3採用／同じ常体候補3採用。意味変異33は両版全拒否、全7項目・prepared ID／JSON・全messages・source node／scope／根拠／planはcanonical bytesとhashで前後一致。native既定は原文3を通し、文体差3を従来どおり拒否する。旧作者を禁止したままFree／Plus／Premiumの隔離9保存・同／新service非生成再読、原入力／Emlis不変・quota各1を確認した。SQLは合成owner／UUID／現在日時への等価投影で、純粋CPU prepared identityやlive Supabase／本人Authの実証ではない。新4B応答や一般文章の品質改善率には換算しない。

新test80件は全成功。関連39fileの初回5812件は5778 PASS／34 FAILで、内30は復旧環境の既存pinned LMFE不在、1は新testが既存未対応のscope付き補足回答を適格と期待した材料誤り、3は前回からの無引用negative期待だった。LMFEは既存指定commit817f944のlocal test依存を復元し、補足testは既存対応の独立した本人好み回答へ直した。商品文法や補足資格は広げていない。不足依存fileと修正fixtureの57件だけを再確認し全成功。論理IDごとの最新結果で重複除外すると5809 PASS／既存3 FAIL、error／skip0。初回の新75成功を最終新80へ加算しない。既存warning1を保持、現local runtimeのpydantic2.13.4は旧lockやCIの同一環境とは主張しない。独立CPU比較scriptのtuple/list形式比較による初回停止はcanonical bytes比較に直し、履歴を原本へ残した。

前回の実4B5は全rawと原7項目・prepared／現messagesのまま再受領し、採否・reason・全文を維持、追加生成0。既存69照合行は前回のまま保持し、新69生成や今回は未取得の全文再監査へ換算しない。新3の実4B結果・一般品質・同版画像／通常統合／本人端末、既存無引用3失敗と他ARは未完。今回のprimaryは限定TECHNICAL_CREDIT、正式商品受入れ／Product Read／商品品質creditは追加しない。STRUCTURE_MAP_DELTA_NONE（既存model比較owner内だけで、新path／型／入口／保存責務なし）。

APIa4bbe636のPiece CI42913703031／job130170577459／39step、Analysis CI42913702987／job130170577645／19stepは対象head一致・attempt1で全工程success。追加run／rerun0。両CI成功をlocal既存3失敗の解消とはしない。

原本・固定CPU前後・9保存・実5維持・新一回比較準備と再開点は非公開 `Cocolon_CMEE_AR04_ScopedWish_Register_20261111.zip` へ保持。実装・検査2pathは [実装commit](https://github.com/MassyuRed/mashos-api/commit/a4bbe6369575d4c5edd82dc38f0a00f74d2985d4)を参照する。

次はSCOPED-REGISTER-RAIN／NEGATIVE／QUOTEDの新3と、前回SCOPE-QUOTE-REASON／QUOTE-RUNの保持2を、保存f6daeで一回・追加学習0の実4B比較へ通す。各source7項目・prepared ID／JSON・現builder messagesを固定し、保持2は前回全requestとexact、新3には旧model生成baselineがない。凍結13,619byte／2member、SHA256 `63f90d0a3512a17355aa2a145f04a7cb5decc04fe0924e241031efe94a608693`。候補5＋通常／Analysis前後control4の最大9HTTP、Piece1load、学習／新weights／retry0、復元込み600秒／復元予約120秒。新packetの送信と、認証情報を含み得る起動環境全体の同Pod内一時読取・復元再利用は今回の具体承認後に限る。前回の一回承認は消費済みで再利用せず、現在は新送信／新GPU実行／新環境読取0。前回の実5／15保存／101.508秒復元は完了として継承する。

<a id="piece-scoped-self-register-actual-20261111"></a>
## 11/11 AR-04 — 理由付き本人希望の実4B採用回復・保存と復元

承認済み新3＋保持2を保存f6daeで一回・追加学習0の実4B確認。同じ実5rawを旧c34／現a4で比較し、採用2→5（新3の文体差0→3回復、保持2不変）。source意味・plan・prepared／messagesは両版一致、全5の3plan計15保存・非生成再読成功。9HTTP・96.028秒で元提供args／env／cwdを復元、通常／Analysis前後response一致・health200。新3は末尾「です」除去だけを保持し、旧model生成baselineや一般作文改善率はない。APIa4bbe636・f6dae研究候補、通常selector OFF、本番未反映。


Mashの新3＋保持2・起動環境の同Pod内一時読取／復元再利用・追加学習なし復元込み最大10分一回への明示承認後、固定13,619byte／2member packetを既存Pod f1lle4xwq3wjlnへ送り実行した。SHA256 `63f90d0a3512a17355aa2a145f04a7cb5decc04fe0924e241031efe94a608693`、全member／runner／wireは凍結時と一致。候補5＋通常／Analysis前後control4の9HTTP、Piece1load、学習／新weights／retry／SYSTEM／生成条件変更0。元提供停止前に現cacheの固定tokenizerで全5の入力＋2048生成予約が8192以内を確認し、最大入力1708token。新3に期待正文・固定CPU本文・旧rawを送っていない。

全処理96.027656秒で元base／既存Analysis提供へ復元した。元PID61979→復元PID62196、args／全env／cwdと既知認証値の一致、元source／Analysis adapter／保存Piece重みの前後不変を確認。通常／Analysis前後のrequestと全responseは各完全一致、health正常、独立localhost health HTTP200。全起動環境は同Pod内で完全復元に再利用し、全envのserializeは行わない。既知二つのAPIkey値が回収原本へ混入した場合に回収を止める既存runnerを維持した。完了済み前回101.508秒の比較は再実行していない。

| 実入力 | 同じ実rawの旧c34→現a4採否 | 実本文で保持したこと |
|---|---|---|
| SCOPED-REGISTER-RAIN | 未判定→採用 | 雨の継続と本人の在宅希望。末尾「です」だけを除去 |
| SCOPED-REGISTER-NEGATIVE | 未判定→採用 | 余裕がないという理由と、地域の活動へ加わりたくない否定希望を両方保持 |
| SCOPED-REGISTER-QUOTED | 未判定→採用 | 友人の引用内一人称・発言全文と、引用外の本人の在宅希望を分離保持 |
| SCOPE-QUOTE-REASON | 採用→採用 | 前回の全request／raw／response／revision／usageと完全一致 |
| QUOTE-RUN | 採用→採用 | 前回の全request／raw／response／revision／usageと完全一致 |

実原本rawを修補せず受領し、旧c34 policyを独立local processへ読込み、現a4と同じsource／意味／plan／prepared ID・JSON／全messagesで比較した。採用は2/5→5/5、新3だけ0/3→3/3回復、観測した既成功退行0。これは同じ新実rawのreader比較であり、旧モデルと新モデルの生成前後比較ではない。新3に旧model生成baselineはなく、保持2は既露出で新規holdoutではない。旧作者fallbackを禁止したまま、現receipt→CMEE／S7と、Free／Plus／Premiumの実保存consumerへ全5×3planの15試行を通し、15保存・同／新service非生成再読、原入力／Emlis不変・quota各1、保存後0生成を確認した。保存consumerでは合成owner／UUID／現在日時への等価内容投影を用い、元GPU要求identityやlive Supabase／本人Authの往復と混同しない。

華恋と独立担当が全5原7項目・実raw・本文全文を読んだ。新3は元の末尾「です」だけを外した自然な常体で、理由・本人表記・全対象・希望／否定・引用の字面と話者を保持した。友人の場所や待つ対象、本人の感情／行動の完了、相手意図は補っていない。保持2も前回全文一致、二重「ので」の文体の重さや引用の二重感嘆符を原文どおり保つ。一般的な編集能力・広い自然文品質・正式Product Read／本人受入れの成功へ拡張しない。

本回のlocal reviewは初回で成功し、harness修正／商品source／test／workflow変更0、新モデル呼出し0。前回の固定CPU3／9保存、新80成功、39file重複除外5809 PASS／既存3 FAIL、APIa4のPiece CI42913703031／job130170577459／39stepとAnalysis CI42913702987／job130170577645／19stepのattempt1全successは、それぞれ前回の条件付き証拠として保持。今回の15保存で既存3失敗が解消したとはせず、新pytest／CI再実行0。STRUCTURE_MAP_DELTA_NONE（今回は実結果のみ、既存model比較ownerの責務／入口／型／保存schemaは追加しない）。primaryは限定TECHNICAL_CREDIT、商品品質credit／正式受入れは追加しない。

実原本ZIP SHA256 `22c4cf62dfd4a34f059d4d634d99fb713feca665c5ffbe829d2977a685fbdc1b`、result SHA256 `3ca6a40e7cfbd3311d125bea6c8a2bc039b1b56d5d3c918d29a286729efb7cc8`。原本・実5全文・旧policy比較・15保存・独立読取・再開点は同じ既存ファイルへ更新して保持：[原本と再開点](https://chatgpt.com/library?file_id=libfile_fde3_f-6b65ee3d3ec08191ae61912a6c50b719_2f7470f963808191aaebf050935e72de&account_id=personal)。

次は、既資格のliteral扱い「休みたい／読みたい」が原順のまま止まる残差を、既存source／scope／本人全文の保持とnative／canonical互換を維持して最小修復する。理由付き好みの文体差、前置canonical側の文体差、引用／理由一般、広い文章、新f6daeの旧53全生成回帰、同版画像／通常統合／本人端末、既存無引用3失敗と他ARは未完。今回の新3実4B・保持2照合・15保存・96.028秒復元は完了として継承し、この9HTTPを再実行しない。今回の具体一回承認は消費済み。新しいfit／GPU比較／通常モデル採用／selector有効化／Render／live DB／RN／buildを自動実行しない。


<a id="piece-literal-scoped-register-20261111"></a>
## 11/11 AR-04 — literal本人文章の原順・文体比較と次の一回準備

API48bb559aで、既資格literal本人文章「休みたい／読みたい」の原順・全文保持を既存model文体比較へ接続。固定CPU新3は同じ候補0→3採用、意味変異26拒否、前回実5の採否／本文／意味／plan／prepared／messages不変、3plan計9保存・非生成再読。専用548成功、関連39fileは5910 PASS／既存3 FAIL。独立CPU404例では退行0・意味変異33拒否、native／canonical不変。新3実4Bは未取得、13,684byte比較packetは未送信・今回の具体承認待ち。f6dae研究候補・通常selector OFF、本番未反映。

次は、この新3（REST-REASON／READ-CONDITION／READ-QUOTED）＋保持2（SCOPE-QUOTE-REASON／QUOTE-RUN）を、保存f6daeで一回・追加学習0の実4B比較へ通す。固定13,684byte／2member、SHA256 `2ed594826530120ff502019b2f3a4e49b39ea894546e9dbc1baffb00fd51d82d`。候補5＋通常／Analysis前後control4の最大9HTTP、Piece1load、学習／新weights／retry0、復元込み600秒／復元予約120秒。新packet送信と、認証情報を含み得る起動環境全体の同Pod内一時読取・復元再利用は今回の具体承認後に限る。前回の一回承認は消費済みで再利用せず、新送信／新GPU実行／新環境読取0。PID62196は前回復元時の履歴値で、現在の再確認値ではない。前回の実5／15保存／96.028秒復元は完了として継承し、旧runnerを再実行しない。

詳細：[literal原順比較・実証範囲・残差](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-literal-scoped-register-20261111)。


<a id="piece-literal-scoped-register-preflight-failed-20261111"></a>
## 11/11 AR-04 — 一回事前確認の失敗と既存Python指定の修正案

承認済み13,684byte・新3＋保持2のrunnerを一回起動したが、親launcherが稼働用venvではなくsystem Pythonを使ったため、transformers import前の事前確認でModuleNotFoundError、0.088435秒で失敗終了。モデルHTTP／Piece load／学習／提供停止／復元操作は0。元PID62196・args／env／cwd一致、runner health正常と独立health200を確認。新3本文・今回のCMEE採否／保存は未取得。既存稼働Pythonでtransformers／torchの所在を確認し、同じpacketを変えず起動指定だけ直す一回案を準備。再実行は未承認・未実行。API48bb559a・通常selector OFF・本番未反映。

次は、同じ新3＋保持2・同じ13,684byte packet（SHA256 `2ed594826530120ff502019b2f3a4e49b39ea894546e9dbc1baffb00fd51d82d`）を、既存稼働用 `/workspace/cocolon_venv/bin/python`で起動する一回修正案の具体承認後に進める。新root `/workspace/ar04-literal-scoped-register-pythonfix-20261111`を使い、今回の失敗root／原本は変更しない。新しいlauncherだけを送って同Pod上の既存packetを再利用し、runner／wire／原入力／prepared／messages／SYSTEM／生成条件は変更しない。候補5＋通常／Analysis前後control4の最大9HTTP、Piece1load、追加学習／新weights／retry0、復元込み600秒設定・復元予約120秒。認証情報を含み得る全起動環境の同Pod内一時読取・復元再利用も次の一回承認へ含め、今回の承認を再利用しない。

詳細：[事前確認失敗・起動修正案](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-literal-scoped-register-preflight-failed-20261111)。


<a id="piece-literal-scoped-register-actual-20261111"></a>
## 11/11 AR-04 — 稼働用Pythonでの実4B比較・15保存と復元

別の具体承認後、既存稼働Pythonから同じ新3＋保持2を保存f6daeで一回・追加学習0の実4B確認。同じ実5rawの採用は旧a4の2→現48の5（literal原順の新3だけ0→3回復、保持2の全request／raw／response不変）。意味／plan／prepared／messagesは前後一致、全5×3planの15保存・非生成再読成功。9HTTP・97.008秒で元提供へ復元、args／env／cwd・通常／Analysis前後全response一致、独立health200。先行のsystem Python失敗は閉じた原本として保持。API48bb559a・f6dae研究候補・通常selector OFF、本番未反映。

次は、既存の理由付き好み／評価文の原順・文体差の残差へ戻り、source資格・外側scope・本人全文とnative／canonical互換を維持して原因を確認する。前置canonicalの文体差、引用／理由一般、広い文章、新f6daeの旧53全生成回帰、同版画像／通常統合／本人端末、既存無引用3失敗と他ARも未完。今回の新3実4B・保持2照合・15保存・97.008秒復元は完了とし、このrunnerを再実行しない。今回の一回承認も消費済み。新しいfit／GPU比較／通常モデル採用／selector有効化／Render／live DB／RN／buildは自動実行しない。

詳細：[実4B本文・保存・限界](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-literal-scoped-register-actual-20261111)。


<a id="piece-scoped-evaluation-register-prepared-20261111"></a>
## 11/11 AR-04 — 理由・条件・譲歩付き評価の文体比較

API5f3a8d5aで、既資格の理由／条件／譲歩付き本人評価の文体比較を既存S7へ接続。固定CPU新3の同じ常体候補は0→3採用、意味変異41拒否・前回実5本文を追加生成0で保持し、3plan計9保存／非生成再読。source資格／意味／根拠／plan／prepared／messages・native既存比較は維持。新66成功、関連39file5979件は5976 PASS／既存3 FAIL、Piece CI成功・Analysis CI実行中。新3実4Bは未取得。13,983byte比較packet＋2,505byte launcherを稼働用Python指定で準備したが、未送信／未実行。f6dae研究候補・通常selector OFF、本番未反映。

次は新3（PREFERENCE-REASON／VALUE-CONDITION／PREFERENCE-QUOTED-CONCESSION）＋保持2（SCOPE-QUOTE-REASON／QUOTE-RUN）を、保存f6dae・既存稼働用Pythonで一回・追加学習0の実4B比較へ通す。合計16,488byte（packet13,983＋launcher2,505）、packet SHA256 `52ccec341c8aa437a30a4e4afca826559c9c0d6004a50152367d592f9f7f7fb6`。候補5＋通常／Analysis前後control4の最大9HTTP、Piece1load、学習／新weights／retry0、復元込み600秒／復元予約120秒。新packet／launcher送信と、認証情報を含み得る起動環境全体の同Pod内一時読取・復元再利用は、この新3の具体承認後に行う。前回承認は完了済みで再利用せず、新送信／GPU実行／環境読取0。前回実5／15保存／97.008秒復元は完了として継承する。前置canonical／元focal語順の文体差、引用／理由一般、広い文章、新f6daeの旧53生成回帰、同版画像／通常統合／本人端末、既存3失敗と他ARは未完。新fit／通常採用／selector有効化／Render／live DB／RN／buildの自動実行0。

詳細：[修復・検証・未実行範囲](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scoped-evaluation-register-prepared-20261111)。


<a id="piece-scoped-evaluation-register-actual-20261111"></a>
## 11/11 AR-04 — 評価文体の実4B採用回復・15保存と復元

具体承認後、保存f6dae・稼働用Pythonで新3＋保持2を一回・学習0の実4B比較。同じ実5rawの採用は旧48の2→現5fの5、評価文体の新3だけ0→3回復。保持2の全request／raw／responseは前回と完全一致。source意味／plan／prepared／messages不変、15保存・非生成再読成功。9HTTP・96.967秒で元提供へ復元、args／全env／cwd・通常／Analysis前後全response一致、独立health200。API5f3a8d5aのPiece／Analysis両CI成功も確認。今回はsource／test変更・新CI実行0。f6dae研究候補・通常selector OFF、本番未反映。

次は本人前置canonical側の文体差を、保存済み本文と既存source／scope／比較条件から切り分け、原順での今回回復を退行させず進める。評価の元focal語順、引用／理由一般、広い文章、新f6daeの旧53全生成回帰、同版画像／通常統合／本人端末、既存無引用3失敗と他ARは未完。今回の新3実4B・保持2照合・15保存・96.967秒復元は完了とし、このrunnerを再実行しない。今回の一回承認は消費済み。新しいfit／GPU比較／通常採用／selector有効化／Render／live DB／RN／buildは自動実行しない。

詳細：[実本文・保存・限界](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scoped-evaluation-register-actual-20261111)。


## 11/11 AR-04 — 本人前置語順の文体比較を既存S7へ接続

APIeb9cdacdで、既資格の本人文章について、既存の本人前置語順と敬体／常体の差を同じmodel専用比較へ接続。固定CPU新3は0→3採用、3plan計9保存・非生成再読。原7項目／source意味／plan／prepared／messagesとnative全結果は前後一致、前回実4B5件も全結果を維持。追加145検査は全成功、関連39fileは重複除外6124件中6121成功・以前と同じ3失敗。新GPU生成・学習0。f6dae研究候補・通常selector OFF・本番未反映。

本人前置＋文体差の比較修復・固定CPU3件と9保存は完了。次は同じ条件の新規実4B本文での確認と、元focal語順・引用／理由一般などの残差を既存の比較と保存経路で進める。今回、新たなGPU packetの送信・起動・提供停止・起動環境読取・学習・通常採用は行っていない。以前の一回実行は完了済みで再実行しない。広い文章、新f6daeによる旧53全生成回帰、同版画像／通常統合／本人端末、既存3失敗、AR-01と他ARは未完。 [同一材料・保存・限界](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-canonical-fronted-register-20261111)。



<a id="piece-evaluation-focal-register-20261111"></a>
## 11/11 AR-04 — 評価の元焦点語順を保持

API8329a828で、既資格の本人評価を元の焦点語順のまま敬体／常体比較へ接続。固定CPU新3は0→3採用、3plan計9保存・非生成再読。原7項目／source意味／plan／prepared／messages・native全結果と前回実4B5件は維持。新71全成功、関連39fileは6192成功／既存同3失敗。独立27例で退行0。新GPU生成・学習0、f6dae研究候補・通常selector OFF・本番未反映。

次は未実行の本人前置3＋評価焦点3と保持2の計8材料を、一回の実4B比較へまとめて通す。送信候補17,151byte（packet14,702＋launcher2,449）・最大12HTTP・Piece1load・学習／retry0、復元枠を含む600秒の期限設定／復元予約120秒。既存Podへの新packet送信と、認証情報を含み得る全起動環境の同Pod内一時読取・復元再利用は今回の具体承認後に限る。旧実行の一回承認は完了済みで再利用しない。

API8329a828のPiece CI42943673831／job130271199367は全39工程、Analysis CI42943673837／job130271199286は全19工程、双方attempt1・successをfresh確認。追加run／rerun0。 前セッションのAPIeb9cdacdは、Piece CI42936880945全39工程／Analysis CI42936880940全19工程がattempt1・success。反映済みsource3と資料7の全blob／本文をfresh照合し、中断時に未保存だったprivate比較原本を保全した。

[原因・同一候補・保存・未実行範囲](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-evaluation-focal-register-20261111)。


<a id="piece-combined-register-actual-20261111"></a>
## 11/11 AR-04 — 実8応答・24保存と提供復元

API8329a828の本人前置3＋元評価焦点3＋保持2を、具体承認後に保存f6daeで一回・学習0の実4B確認。同じ8rawの旧eb9→現8329採用は6→8、元焦点2だけ回復、保持2の全request／raw／response不変。全8×3planの24保存・非生成再読。12HTTP・103.914秒で元提供args／env／cwdを復元し、通常／Analysis前後response一致・独立health200。Piece／Analysis両CI成功。本人前置3の実rawは前提先行で、その本人前置形自体は未実証。f6dae研究候補・通常selector OFF、本番未反映。

次は一般文章の自然さ・反復・引用／理由等の残差を、元教材・保存済み実本文と既存source／生成条件から切り分ける。今回の8実応答・24保存・103.914秒復元は完了し、この12HTTPと過去の完了済みrunを再実行しない。今回の一回承認は消費済み。新fit／GPU比較を自動選定せず、通常モデル採用／selector有効化／Render／live DB／RN／buildは自動実行しない。

API8329a828のPiece CI42943673831／job130271199367は全39工程、Analysis CI42943673837／job130271199286は全19工程、双方attempt1・successをfresh確認。追加run／rerun0。 [実原本・意味比較・保存・限界](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-combined-register-actual-20261111)。


<a id="piece-breadth53-inference-prepared-20261111"></a>
## 11/11 AR-04 — 旧53照合行の現f6dae比較を準備

旧53照合行を51完全一致要求へ集約し、現f6daeで取得済み10要求を再利用。未取得41＋保持確認2の無学習比較を準備した。全69旧rawの現8329採否／本文と、原source／prepared／messagesは不変。送信候補31,961byte・最大43 Piece／47HTTP、復元枠込み600秒設定。新送信／環境読取／モデル呼出0・具体承認待ち。直近実8応答・24保存・103.914秒復元は完了として継承。通常selector OFF・AR-04未完。

次は旧53照合行の未取得41要求＋既存f6dae保持確認2を、保存f6dae・既存稼働用Pythonで一回・追加学習0の実4B比較へ通す案。packet／launcher合計31,961byte、候補最大43＋通常／Analysis前後control4＝最大47HTTP、復元枠込み600秒設定／復元予約120秒。既存Podへの新送信と、認証情報を含み得る全起動環境の同Pod内一時読取・復元再利用は、この新しい43要求案の具体承認後に限る。480秒のwork期限で途中結果を保持して復元へ戻るため、全43完了を保証しない。前回の一回承認は消費済みで、完了済み8応答の12HTTPを再実行しない。新fit／通常採用／selector有効化／Render／live DB／RN／buildの自動実行0。

全ファイル地図／商品ownerの追加変更なし（STRUCTURE_MAP_DELTA_NONE）。今回の商品source／test／新CI要求0。準備を広い文章品質・正式受入れへ加点しない。 [原本・重複除去・具体packet・次の評価](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-breadth53-inference-prepared-20261111)。


<a id="piece-breadth53-current4b-actual-20261111"></a>
## 11/11 AR-04 — 旧53実生成回帰・51採用と153保存

具体承認後、保存f6daeで未取得41要求＋保持2を一回・学習0で実4B確認。43候補／47HTTP・265.692秒で元提供へ復元、args／全env／cwd・通常／Analysis前後全response一致、独立healthz200／PID一致。既存10を戻した全51要求（旧53照合行）は51採用・3plan計153保存／非生成再読。保持2は前回全応答と同一。原source／prepared／messages・raw不変。全51本文のroot／独立読取で明確な新意味変異は見られず、一人称反復等の文章上の残差は保持。旧53回帰の未取得は0。f6dae研究候補・通常selector OFF・AR-04未完。

次は今回未被覆の理由／譲歩付き完了動作・引用・長い文章の読取と文章化を、元教材・保存済み実本文と既存のfinite動作／source scopeから切り分ける。理由／譲歩付き完了動作は全文KEEPに留まるCPU例があるが、このfamilyの現f6dae実失敗は未確認で、追加学習を選ぶ根拠にはしない。今回の旧53全生成回帰・実43候補・153保存・265.692秒提供復元は完了として継承し、完了runを再実行しない。今回の具体一回承認は消費済み。新GPU／fit／SYSTEM周回・通常採用／selector有効化／Render／live DB／RN／buildを自動実行しない。 本人前置形そのものの実raw、理由／引用と完了動作の一般読取、広い編集品質、同版画像／通常統合／本人端末、既存無引用3失敗とAR-01／他ARは未完。

全ファイル地図／商品ownerの追加変更なし（STRUCTURE_MAP_DELTA_NONE）。商品source／test／新CI要求0。広い文章品質・正式受入れへの加点なし。 [実原本・意味比較・保存と限界](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-breadth53-current4b-actual-20261111)。


<a id="piece-scoped-finite-action-20261111"></a>
## 11/11 AR-04 — 理由／譲歩付き完了動作を接続（実行前の記録・後続実測で更新済み）

API400912d8で、既存finite対人動作読取を明示理由／譲歩のscope・生成条件・S7へ接続。nativeは原文KEEP／非宣言を維持し、内側の能動事実過去だけ同じ意味の敬常体を比較する。固定CPU新6は0→6採用（2mode計0→12）、3plan18保存／非生成再読。保存済み実4B59要求のsource意味／plan／prepared／messages／採否／本文は不変。新71・既存関連1479成功。新6の実model rawは未取得、追加GPU／学習0。約18KBの新6＋保持2比較は未送信／未実行・具体承認待ち。f6dae研究候補・通常selector OFF・AR-04未完。

API400912d8のPiece CI42958167751はattempt1・success、Analysis CI42958167864はattempt1・success。追加run／rerun要求0。

次は、この新6（理由／譲歩付き能動事実過去）＋保持2（SCOPE-QUOTE-REASON／QUOTE-RUN）を、保存f6dae・既存稼働用Pythonで一回・追加学習0の実4B確認へ通す。合計17,929byte（packet15,480＋launcher2,449）、8候補＋通常／Analysis前後control4の最大12 chat HTTP、Piece1load・retry／新weights0、復元枠込み600秒の期限設定／復元予約120秒。新packet／launcher送信と、認証情報を含み得る全起動環境の同Pod内一時読取・復元再利用は、この新材料の具体承認後に限る。64834は前回復元時のPIDで現在のfresh確認値ではない。前回の43候補／47HTTP・265.692秒復元・51要求153保存は完了で、消費済み一回承認を再利用しない。新fit／通常採用／selector有効化／Render／live DB／RN／buildの自動実行0。 受動、引用／名前／外側SELF／複数operatorを含む完了動作、条件・日時の新接続、本人前置形の実raw、長い文章と広い編集品質、同版画像／通常統合／本人端末、既存無引用3失敗とAR-01／他ARは未完。

STRUCTURE_MAP_DELTA_PRESENT：既存source資格・scope／model比較・欄別生成条件を拡張。新公開型／route／DB／作者／controllerなし。 [原因・同一候補・保存・実model未実施範囲](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scoped-finite-action-20261111)。


<a id="piece-scoped-finite-action-actual-20261111"></a>
## 11/11 AR-04 — 完了動作の実8・復元と残る前提変異（指示修正前の実測記録）

API400912d8の新6＋保持2を保存f6daeで承認済み一回実行。Piece8／12HTTP、追加学習・retry0、復元込み106.495秒。元args／全環境／cwdと既存source・adapter不変、通常／Analysis前後の全response一致、独立health200／PID一致。新6は5採用・1拒否、保持2は採用かつ前回全response一致。採用計7×3plan21保存・非生成再読、不採用1×3plan3保存前拒否。残る1は外側の「重なっている」→「重なった」の時制・相の変異。実raw／期待値の修補0、通常selector OFF・AR-04未完。

既存API400912d8のPiece CI42958167751／Analysis CI42958167864は両方attempt1・successの完了結果を継承。今回API source変更0・CI追加run／rerun0。

次は、ACTION-REASON-CONSULTで外側の継続状態が過去事象へ変わった実rawを起点に、既存source_scope生成条件が前提全量の保持を4Bへ伝える接続を点検し、既存ownerの因果箇所だけを修正する。source全文や期待値を出力へ寄せず、S7の不採用を緩めず、新しい作者・別経路・Gateを増やさない。今回の17,929byte送信・全環境同Pod一時読取／復元再利用・一回承認は完了して消費済み。自動GPU再試行／追加学習／新weights／通常採用／selector有効化／Render／live DB／RN／build／配布0。次のGPU比較は未準備・未承認で、自動反復しない。 新familyの全6成立、広い文章編集品質、本人前置形、長文、同版画像／通常統合／本人端末、既存無引用3失敗、AR-01／他ARは未完。

NO_STRUCTURE_MAP_DELTA：今回の実行・読取・保存でsource owner／公開型／route／DB／作者／controllerの変更なし。API400912d8の既存ファイル地図と責務境界を継承し、実測現在地・残件だけを更新。限定TECHNICAL_CREDIT、human acceptance追加0。 [実8の詳細と残る前提変異](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scoped-finite-action-actual-20261111)。


<a id="piece-scope-prefix-instruction-20261111"></a>
## 11/11 AR-04 — 外側前提と内側過去を分ける生成指示（実行前の記録・比較完了）

API74dff9a7で既存scoped_action_instructionだけを修正。source_scope.prefix_literalを同じsource・欄の対応動作直前で逐字保持し、外側の継続状態を内側の完了過去へ合わせないと明示。S7・source読取／資格／投影・SYSTEM・原7項目／preparedは不変。実失敗raw1例を既存変異testへ追加し関連242成功。保存済み67行／65固有要求はsource／plan／prepared／旧raw採否／本文不変、指示変更6行だけ・61行messages一致。前回actual5/6＋保持2、21保存／3拒否・106.495秒復元を完了として継承。新指示の実4B品質は未測定、今回GPU／SQL0。失敗1＋同系5＋引用保持2の約18KB比較を準備、未送信／未実行・具体承認待ち。selector OFF・AR-04未完。

API74dff9a7のPiece CI42963237980はattempt1・success。同headで今回起動を確認した対象はPiece。Analysis CI400912d8のsuccessは過去完了として継承し、74dff9a7の実行結果へ読み替えない。追加dispatch／rerun0。

次は、同じ入力の失敗1例＋同系保持5例＋引用保持2例を、生成指示だけ修正したAPI74dff9a7のmessagesで、保存f6dae・既存稼働用Pythonへ一回通す。新しい架空入力0、原7項目／prepared／SYSTEM／生成設定は同一、引用2の全messagesも同一。合計18,068byte（packet15,631＋launcher2,437）、最大8候補＋通常／Analysis前後4の12HTTP、Piece1load、追加学習／新weights／retry0。復元枠込み600秒／予約120秒。送信と、認証情報を含み得る全起動環境の同Pod内一時読取・復元再利用はこの新一回の具体承認後に限る。PID65745は前回復元時の履歴でfresh確認値ではなく、元identity不一致なら停止前に中断。前回の17,929byte・12HTTP・106.495秒の一回承認は完了・消費済みで再利用しない。通常採用／selector有効化／Render／live DB／RN／build／配布の自動実行0。

外側前提の時制・継続相の実改善、全6成立、広い文章編集品質、本人前置形・長文、同版画像／通常統合／本人端末、既存無引用3失敗、AR-01／他ARは未完。

NO_STRUCTURE_MAP_DELTA：既存build_piece_model_messagesの指示文だけと、既存変異test1例の追加。source owner／scope投影／S7／公開型／route／DB／作者／controllerの責務・ファイル地図は継承。限定TECHNICAL_CREDIT、商品品質delta未測定・human acceptance追加0。 [原因・変更範囲と次の一回](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scope-prefix-instruction-20261111)。


<a id="piece-scope-prefix-actual-20261111"></a>
## 11/11 AR-04 — 指示明確化の実比較は改善なし・実24教材を回収（直前の実測・回収記録）

API74dff9a7の前提指示を実4Bの同じ8入力で一回確認し、全8raw／全responseが前回と一致、可視品質改善0。失敗1は「予定が重なっている」→「重なった」のまま拒否。同系6は5採用／1拒否、引用保持2採用。21隔離保存・非生成再読／3保存前拒否、追加学習・retry0、復元込み107.324秒。元args／環境／cwd・source／adapter保持、通常／Analysis前後全response一致、独立health200／PID66367一致。保存済みf6dae実24教材を回収・照合し、今回の継続前提＋完了動作の直接対0、同型の誤教師0を確認。ただし原因／新学習必要性は未確定。追加prompt試行は止め、次は評価8と分離した教材補完案へ。通常selector OFF・AR-04未完。

API74dff9a7のPiece CI42963237980（39step、attempt1・success）を完了として継承。今回source/test変更0・新CI／dispatch／rerun0。Analysis400912d8の過去successを74dの実行へ読み替えない。

次は、回収済みf6daeの実24教材で未カバーだった「ので／けれど／けれども」の外側継続前提＋内側完了動作について、既存教材・生成読取ownerを再利用した最小の教材補完案を作る。現在の評価8を教師へ移さず、独立した語彙・場面で対照を用意して既存source/S7で意味・肯否・時制・相を確認する段階とし、追加学習の必要性・実施はまだ決定しない。同じprompt追記、source／期待値／raw修補、S7緩和、別作者／経路／Gate追加は行わない。今回18,068byte送信・全環境同Pod一時読取／復元再利用・一回実行の承認は完了・消費済み。次のGPU／fit／新weights／再試行は未準備・未承認で自動実行0。通常採用／selector有効化／Render／live DB／RN／build／配布0。 この1例の時制・相変異、今回family全6成立、広い文章編集品質、本人前置形・長文、同版画像／通常統合／本人端末、既存無引用3失敗、AR-01／他ARは未完。

NO_STRUCTURE_MAP_DELTA：今回は実行・読取・private教材回収・状態更新だけでsource／test／公開型／route／DB／作者／controllerに変更なし。primary BLOCKER_NARROWED、可視品質改善0・human acceptance追加0。 [実測・教材範囲と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scope-prefix-actual-20261111)。


<a id="piece-scope-teacher-complement-20261111"></a>
## 11/11 AR-04 — 独立12件の教材補完案・既存24件保持（補完案確認の完了記録）

評価8と分離した架空の対照教材12件（6対）を補完案として作成。外側の進行形／過去形だけを変え、内側の本人・相手・対象・肯否・過去動作を固定。既存24行を変更せず36行案へ結合。新12件は現source/S7のCPU確認で受理、外側表現・肯否・相手を変えた36候補は拒否。旧24件は再実行していない。評価原文・評価出力との完全一致0。モデル／GPU／SQL／追加学習0、学習要否は未決定。直前の実4Bは同系5/6＋引用2採用のまま、前提の進行形を過去形へ変えた1失敗が残る。通常selector OFF・AR-04未完。

API74dff9a7は変更なし。既存Piece CI42963237980（39step、attempt1・success）を継承し、今回source/test変更・新CI・dispatch・rerun0。

次は、独立12＋保持24の36行補完案を前提に、既存作者で未解消の前提変異へ対処する実モデル試験が必要か、必要なら比較対象・保持評価・上限を具体化する。教材とS7の整合確認を実4Bの改善や追加学習の必要性へ読み替えない。評価8は教師から除外し、同じprompt追記、source／期待値／raw修補、S7緩和、別作者／経路／Gate追加は行わない。前回18,068byte送信・全環境同Pod一時読取／復元再利用の一回は完了・消費済み。新GPU／fit／新weights／再試行の実行準備・承認はなく自動実行0。通常採用／Render／live DB／RN／build／配布0。

NO_STRUCTURE_MAP_DELTA：今回の教材補完案とCPU確認は既存source／意味／準備／受領／S7を再利用し、新公開型・route・DB・作者・controller・Gateを追加していない。商品上の可視改善は未測定・human acceptance追加0、AR-04の未完を維持する。 [教材補完案・確認範囲と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scope-teacher-complement-20261111)。


<a id="piece-scope-complement-fit-prepared-20261111"></a>
## 11/11 AR-04 — 独立補完36件・72更新の比較を準備（実行前の記録・一回完了）

独立12＋保持24の36件で、新しい候補を元baseから72更新（各2回）だけ学習し、未解消1を含む既存8＋独立保持8の計16件を比較する一回を準備。旧f6dae実測16はcurrent messages／生成設定一致を照合し再利用、最大20HTTP。送信55,014byte、fit最大360秒・候補用105秒先取り・復元120秒を含む全体600秒。API9b1b7bb8の既存trainerを36明示時だけ最大72へ限定拡張し、既定24/48を保持。CPU28成功・既存CI42969704329成功。Pod送信・環境読取・GPU・fitは未実行、新学習を含む実行承認待ち。通常selector OFF・AR-04未完。

API9b1b7bb861a8efa359c780895b3d2ed5d8b802dbのsource/test計2pathはremote全文・blob・変更path・head一致を確認。CPU trainer28成功（既存warning1）、既存Piece CI42969704329／job130355058089・attempt1・全39step success。追加dispatch/rerun0。

次は準備済みの36件/72更新・候補16/最大20HTTP・55,014byte・復元枠込み600秒の一回について、新しい学習と起動環境全体の同Pod内一時読取／復元再利用をMashに確認する。過去の推論一回承認は追加学習なしで完了・消費済みのため、新fitへ流用しない。承認後も元PID/args/env/cwd/source/weightsとcached tokenizerの全36教材・評価16件を停止前確認し、不一致／期限不足は実行を進めず、完了した72更新だけを評価する。新重みの通常採用、selector有効化、Render、live DB、RN、build、配布へ自動進行しない。

NO_STRUCTURE_MAP_DELTA：既存training ownerの限定引数拡張であり、新しい公開型・route・DB・作者・controller・Gateは追加しない。意味読取・準備・生成・受領・S7・保存の担当は不変。学習比較が準備できた段階で、モデル改善・商品品質credit・human acceptance追加は0。 [準備・比較範囲と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scope-complement-fit-prepared-20261111)。


<a id="piece-scope-complement-fit-actual-20261111"></a>
## 11/11 AR-04 — fresh36/72候補の前提変異1件回復・実16と48保存

承認済み36件/72更新のfresh候補a1dfを一回作成し、残っていた「予定が重なっている」→「重なった」の前提変異1件が回復。既存8＋保持8の実16は全件意味採用、他15rawは旧f6daeとbyte同一。48隔離保存・非生成再読成功。20HTTP・復元込み464.290秒、元args/env/cwd・source/Analysis・旧weights保持、通常/Analysis前後全response一致、独立health200/PID67361一致。fit319.087秒、retry0。新重みは検証用・通常selector OFF。今回16の限定改善であり、旧65全体・実機・一般品質・AR-04完了ではない。

API9b1b7bb8のCPU trainer28成功と既存Piece CI42969704329/job130355058089・attempt1・全39step successは準備時の完了として継承。今回source/test変更0、新CI/dispatch/rerun0。

次は保存済み新a1df候補について、旧65固有要求のうち今回とcurrent messagesが一致する16を除いた未確認49要求を既存wireから比較対象として具体化し、広い本文・欄混合・refinedの退行を先に確認する。今回完了した36/72学習・16生成を繰り返さず、追加fitへ自動進行しない。承認済み55,014byte送信・全環境同Pod内一時読取/復元再利用の一回は完了・消費済み。新GPU試行・通常採用・selector有効化・Render・live DB・RN・build・配布は未承認/未実行として区別する。

NO_STRUCTURE_MAP_DELTA：今回source/test/公開型/route/DB/作者/controller/Gateに変更なし。primary TECHNICAL_CREDIT、検証候補で1件の可視意味保持改善を確認、正式商品credit/human acceptance追加0。 [実16・48保存・復元と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-scope-complement-fit-actual-20261111)。


<a id="piece-a1df-remaining49-prepared-20261111"></a>
## 11/11 AR-04 — 保存a1df候補の残49要求を比較準備（実行前の記録・一回完了）

保存a1df候補の未確認49要求を具体化。既存67行をcurrent messagesで65要求へ一意化し、実測済み16を除外。現API9b1bで全49のsource／meaning／plan／prepared／messagesと旧rawのCMEE/S7採否・本文一致をCPU確認。通常47／補足2、1slot39／2slot10。送信36,384byte、候補49＋前後対照4・最大53HTTP、学習0・復元枠120秒込み全体600秒・retry0の一回比較を準備。Pod送信・環境読取・GPU・SQLは未実行、今回分の具体承認待ち。a1df実確認は16/65のまま、通常selector OFF・AR-04未完。

前回の16/65実確認と48保存は完了として継承。今回49の新モデル出力・保存・一般品質は未確認。完了済みの学習・16生成を再実行しない。承認後は保存a1dfによる未確認49だけを一回比較し、無修補受領・全本文の原文対照・採用artifactの既存隔離保存／非生成再読へ進める。通常採用・selector・Render・live DB・RN・build・配布は未実行。

NO_STRUCTURE_MAP_DELTA：source/test/公開型/route/DB/作者/controller/Gateは不変。今回の旧raw照合・実行準備を新候補品質改善やAR-04完了へ数えない。 [49要求の準備・比較範囲と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-a1df-remaining49-prepared-20261111)。


<a id="piece-a1df-remaining49-actual-20261111"></a>
## 11/11 AR-04 — 残49実比較・過去好み1件退行、通常採用は保留

保存a1dfの残49要求を一回・学習0で実生成。53HTTPは全200/stop、復元込み274.959660秒・retry0。現CMEE/S7は48採用/1拒否、144隔離保存・非生成再読/3保存前拒否。47rawは旧f6daeと同一、B53-009は本人再掲のみ、B53-051は「農作業が好きだった」→「好きだ」の時制退行で不採用。前回16と合わせた65要求は64採用/1拒否、62raw同一/3変化。前回の前提回復1件は維持したが別の過去形を失い、通常採用へ進めない。元提供PID68559・引数/環境/作業場所・source/Analysis/旧重み保持、通常/Analysis前後全response一致、独立health200/PID一致。通常selector OFF・AR-04未完。

今回の候補49/全53HTTPは完了し、前回16と合わせて既存65固有要求を実確認済み。051の原文/旧新rawに明示された過去→現在の変更を、source資格外やreaderだけの不具合へ読み替えず、通常採用は保留する。CPU照合で051の過去はsource/wireともPASTと確認し、故障を送信後の文章化へ限定。既存36に直接の肯定過去好み教師はないが、原因や追加学習の必要性とは断定しない。次は評価051を教師へ移さず、独立した時制/肯否/欄配置の対照を具体化し、前回回復も保つ最小修正へ戻す。追加fit/GPU/retry、source/raw修補、S7緩和、通常採用/selector、Render、live DB、RN/build/配布は自動実行しない。

NO_STRUCTURE_MAP_DELTA：source/test/公開型/route/DB/作者/controller/Gateは不変。実行と保存は成立したが、候補の全品質改善・AR-04完了・商品受入れは未成立。 [実49・時制退行・144保存と次](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-a1df-remaining49-actual-20261111)。


<a id="piece-v4-inverse-clip-support-20261112"></a>
## 11/12 AR-04 — 小数寸法のclip支持・逆写像配置の隔離比較

研究3646a285／source8c5eのrun43100979745は成功。clipのq支持をCqへ逆写像し、boundsへ伸縮せず配置する候補で、実RN由来高さのstandalone3形状×8対照=24/24（48call、非整列3／clip差2）を確認。途中clip/bounds変更6件は到達1／stage73で拒否、元195・別AR04_4／bitmap44も成功。初回runのstdout欠落は観測fileの先行保存で解消。通常.mm581/pinは不変・未採用、selector OFF・AR-04未完。次は同候補のactual RN自然描画／local／placed／元期限・PNGを既存harnessで照合する。

研究4pathの候補実装と観測保存をGitHubへ保持した。通常作業側の製品.mm581／pin／公開型・route・DB・作者・renderer責務は変更0（STRUCTURE_MAP_DELTA_NONE）。既存ファイル地図の責務は継承する。候補の詳細・初回記録欠落と保存修復・数値は[既存trial](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/piece_request_account_reuse_review.md#piece-v4-inverse-clip-support-20261112)を参照。


<a id="piece-natural-single-answer-connection-20261113"></a>
## 9.35 2026-11-13 — 現naturalの実一回答からPieceへの既存接続を修復

**11/13・現naturalの実一回答をPieceへ渡す接続抜けを修復：** 画面で選べるCOMPLETED/REFINEDの一回答が、旧finite専用のAPI/SQL検査で拒否されていた。原入力と実ANSWERを別sourceのまま既存Pieceへ接続し、3plan×自然終了/本人終了の6経路で生成候補・保存・同一版の非生成再読、quota各1を確認。消費した履歴は新しい7記録で置換せず、改変・削除時は拒否する。新71件は分割実行で全成功、既存248件も成功。提供文とPiece HTTPは合成・DBは隔離PGliteであり、新実4B・live DB・Render・RN/build/本人端末の成功ではない。 実装は[API f7b44e0e](https://github.com/MassyuRed/mashos-api/commit/f7b44e0eb12db168120a0fab5c12e51181db9bfe)へ保存し、変更5pathの全content/SHA・PR3 head一致を確認。API f7b44e0eのPiece CI [43400087856](https://github.com/MassyuRed/mashos-api/actions/runs/43400087856)とAnalysis CI [43400087749](https://github.com/MassyuRed/mashos-api/actions/runs/43400087749)は、ともにattempt1で全工程成功。手動dispatch/rerun0、実DB未適用。

前段の実17比較後の読取りでは、全34実本文の独立readerはparsed count0/UNASSESSEDでCHECKER_ERRORではなかった。有限readerの二つの役割witnessや旧typed文章化を、自然文全般の意味理解・本人向けの新作者へ読み替えない。本人説明の呼出し到達と保持8の学習/生成prompt token一致は確認済みだが、宛先の声・格崩れ・付加を解消する単純な未接続箇所は特定していない。今回のPiece接続修復を、その品質問題の解決として数えない。

### 原因と実装範囲

既存RN `screens/input/EmlisThreadModal.js:selectedPieceSupplementalAnswer` はnaturalも含む一回答のCOMPLETED/REFINEDを選択できる。一方、APIの既存 `resolve_refined_handoff` は古い `context()` とfinite専用checkpoint/OBS条件を使い、現naturalを `PIECE_SOURCE_NOT_ELIGIBLE` で拒否していた。旧sourceで架空の実natural一回答を通して同拒否を再現した。仕様追加で資格を緩めるのではなく、§7.1の適格refinedと§9.1の三中核接続を既存owner内で修復する。

naturalはQ3/`native_bound_question.v1`、実1QUESTION/1ANSWER、round1、RESOLVED、ADDのみの一つのMEANING_UPDATE、初期/最終OBS、各STARTED→RECEIVED receiptがすべて一致する場合に限定する。原入力からの初期prefix、本人の実ANSWERとcurrent checkpointは既存 `prepare_emlis_meaning` で再導出する。自然文の本文は完了確認であり本人sourceにしない。初期naturalに存在しない旧finite checkpointを捏造しない。

現保存cohortは `related_context(..., context_guards=...)` で取得する。両OBSとreceiptを現context ref/guards・prefix・model・artifact・attempt・時系列へ束縛し、本人が一回答後に終了した場合も同じ確定済みOBSだけを使う。二問目、重複receipt、未知policy/profile、失敗終了、改変original/ANSWER/checkpoint、消費履歴の編集/削除はAPIと既存3 SQL操作で拒否する。拒否後の作品・preview・quota不変も確認した。

SQLは保存鎖と再構成した現context、既存source envelope/hash/ADDを検査する。原入力の言語意味とcheckpoint全文の再導出はAPI ownerが担い、SQLだけで同じ意味検査をしたとはしない。canonical保存lineageが持たないprivate `observation.source_prefix_ref` を要求せず、既存thread/checkpoint/receiptでprefixを束縛する。新しい公開fieldは追加しない。

| 変更ファイル（mashos-api） | 現在の責務 |
|---|---|
| `ai/services/ai_inference/piece_v2_source_adapter.py` | 現natural Q3の保存時関連cohortを取得し、原入力＋実ANSWER、独立の初期/最終receipt、ADD意味checkpointの現ownerによる再導出を照合して既存refined handoffへ渡す。 |
| `supabase/migrations/20261113085044_piece_natural_refined_source_fence.sql`（新） | 既存preview issue/save/visualの3 SQL関数へnatural一回答の保存鎖検査を追加。既存NULL-profile有限分岐・署名・table・ACL/RLS・quota/lockを保持し、未知profileは拒否する。実DB未適用。 |
| `ai/tests/piece_v2/test_b05_natural_refined_saved_pipeline.py`（新） | natural実QUESTION/ANSWER/MEANING_UPDATEから既存Piece parser/CMEE/B8/Safety/隔離SQL保存/本人再読までの71検査。 |
| `.github/workflows/piece-b2b-isolated-postgres.yml` / `.github/workflows/analysis-observed-content.yml` | 新suiteとmigrationを既存CIのpaths/実行stepへ登録。 |

### 検証結果と限界

| 確認 | 実績 |
|---|---|
| 新suite | 固有71件が分割実行で全成功。自然一回答6、改変13×SQL3操作39/API13、既存catalog1、旧finite2、natural原入力のみ1、不正終了3、履歴編集/削除×3操作6。重複runを加算しない。 |
| 既存回帰 | refined意味/source/projection/preview/service/SQLとnatural questionの既存8suite、248成功・失敗/skip0、42.520秒。 |
| 六つの正例 | Free/Plus/Premium×自然終了/本人終了。natural合成providerは各2call、Piece固定mock HTTPは各1call。実source/ANSWERは別根拠として同じ既存compiler/parserへ渡す。 |
| 保存と再読 | preview/replay、paid visual、save/replay、別serviceの本人detailを通し、同本文/content/recipe/rendererを保持。保存枠各1、再読時生成0、原入力/Emlis event不変。 |
| 履歴 | paid正例は保存時の一履歴を保持し、その後7件増えて旧contextの候補から外れても同cohortを使用。合成履歴原本の初期回収分と後続7件版は区別する。 |
| 独立review | source/SQLの意味検査強度差、終了条件、履歴無効化、両CI組込みを別担当がread-only確認。保存を止める重大所見なし。 |
| 試験中の訂正 | 第二QUESTIONのfixtureがround1の既存unique制約に当たり、round2へ訂正。paid履歴の初期期待を7新記録へ訂正。最初のSQL候補の非公開prefix参照はcanonical lineageに合わせ除去。これらの途中失敗を本番成功や意味改善へ数えない。 |

合成Auth・natural prose・Piece HTTP framingと隔離PGliteを使った接続/保存検証である。PostgREST/Auth実環境、実4Bの新本文、RN Bitmap/PNG、端末・実書出しは今回未検証。RNの既存選択UIと公開DTO/source型/作者/renderer/rights/quotaは変更しない。STRUCTURE_MAP_DELTA_PRESENT：既存source adapter/SQLのprofile分岐と新migration/test/CI接続を01A/01B/01C・current01/02/04へ反映した。

前回§9.34の新10b563候補不採用・通常model selector OFFを維持する。今回の一回答接続と、AI応答への二欄訂正・複数回答・REVISE/WITHDRAWの伝播は別範囲で、後者は未接続。一般的な応答/編集品質、同じ新本文の端末画像/書出し、全補助経路の受入れは未完。GPU・学習・本番SQL適用・Render配置・RN変更・新build/配布は0。

次は当該headの既存CI結果を確認してこの接続を引き継ぐ。通常反映は累積migrationの依存を確認したDB→APIの順で扱い、実4B本文・同じ作品の保存/画像/再読は残件として区別する。旧finite作者や逆読取を自然文へ無条件に移す処置、本人一人称の機械置換、同じfit/hint/比較の自動反復は行わない。全file tree/責務差分の確認を全仕様意味読了の証明に置き換えない。


<a id="emlis-natural-owned-premium-frames-20261113"></a>
## 9.36 2026-11-13 — Premiumの既存frame表示・本人操作を現naturalへ接続

**11/13・Premiumの既存「仮の理解」をnaturalへ接続：** 本人の過去入力・実回答に根拠を持つ暫定frameを、現naturalの保存artifactと既存画面へ渡す欠落を修復。確認／修正／不使用を保存し、本人修正文を次の作者材料へ渡す。不使用は次のframe候補から除外する。新16件・既存227件、実隔離SQLの保存DTOを既存RN editorへ渡す3検証が成功。natural本文は固定合成であり、4B本文の品質改善・実機稼働の証明ではない。 [実装 d8f6d137](https://github.com/MassyuRed/mashos-api/commit/d8f6d137508d5ba6ec7da620d1dea6576d560dee)。API d8f6d137のPiece CI [43404500570](https://github.com/MassyuRed/mashos-api/actions/runs/43404500570)とAnalysis CI [43404500574](https://github.com/MassyuRed/mashos-api/actions/runs/43404500574)は、ともにattempt1で全工程成功。手動dispatch/rerun0、live DB/Render/RN build・配布・GPU/学習は0。

### 利用者に起きていた欠落と修復

旧finiteの `emlis_thread_surface.py` は既存 `emlis_thread_history.derive_interpretive_frames` を呼ぶが、現 `_process_natural` のOBS artifactには `interpretive_frames` がなかった。そのためPremiumにも公開DTOは常に空配列で、既存RN FrameEditorの確認・修正・不使用の操作へ到達しなかった。同じ架空条件の修正前はFree/Plusの2検査成功、Premium1検査が空配列で失敗した。

既存Q3 Premiumの適格履歴だけを使い、原入力・実ANSWER→既存意味更新/plan/evidence→暫定frame→同じOBS保存→既存DTO/FrameEditorへ接続した。自然文のAI本文・過去のAI本文・保存済み意味checkpointを本人根拠へ昇格しない。有限ownerがRESOLVEDと読めない最新回答、limitedな履歴、二欄訂正付き履歴は既存ownerに従って除外する。さらにnatural Safetyが今回の作者材料から除外した履歴を、frame経由で戻さない。

| 変更file（mashos-api） | 現責務 |
|---|---|
| `ai/services/ai_inference/emlis_thread_service.py` | 新private `_natural_interpretive_frames` がPremium/Q3・当回の二欄訂正なし・Safety採用済み履歴IDの範囲で既存deriveを使用。同じnatural OBSへ非空frameを保存し、当回の二欄訂正があれば旧保存frameも表示しない。 |
| `ai/tests/test_emlis_natural_frames_application.py`（新） | 隔離SQL上のnatural源泉・frame・本人feedback・次応答材料・非生成再読・失効の16検査。 |
| 既存 `.github/workflows/piece-b2b-isolated-postgres.yml`／`analysis-observed-content.yml` | 新suiteを既存path/実行stepへ追加。新workflow／新基盤なし。 |

### 保存した表示と本人操作

| 場面 | 保存DTOと既存RN描画で確認したこと |
|---|---|
| Premium・初回 | 過去記録の日付と「褒められた」についての「重かった」を、**あなたの言葉からの仮の理解**として表示。今回も同じ受け止めとは決めないという既存説明を維持。 |
| 確認 | 本人が押した場合だけCONFIRMED。保存だけではnatural providerを呼ばず、次の本人回答後の材料へ同じ本人feedbackを渡す。無反応は確認へ昇格しない。 |
| 修正 | 本人の「結果だけで判断されたことが気になった。」をそのまま保存・表示し、次の作者材料のUSER_FRAME_FEEDBACKへ渡す。新応答後のframeにも同じ本人修正を保持。 |
| 不使用 | 直後は「この理解は今後使いません。」を表示し、次の応答後のframeは空配列。履歴原文自体は消さない。 |
| Free／Plus | frameは空配列。自然応答・問いの既存経路を保つ。 |

確認・修正・不使用は既存 `frame_feedback`、本人/版/frame_ref/context、既存SQL保存を使う。feedback直後のstatus表示を消さず、古いnatural本文は既存CONTEXT_CHANGEDへ抑止する。GETは保存frameを返すだけで再導出・モデル再呼出しをしない。過去の編集/削除・権利降格で旧frameを隠し、当回の二欄訂正では旧frameを再公開しない。この除外は二欄訂正から新frameを作れたという意味ではない。

### 検証・原本と未成立

- 新規16件は分割で固有16成功。初回13成功/3失敗は既存再送DTOの `requested_operation` をfixture期待から落としていたためで、同fieldを照合する期待へ訂正後に当該3成功。product codeを緩めていない。
- 既存natural application/question/Q3/二欄訂正/natural refined Pieceの5suiteは227成功・skip/失敗0、74.22秒。保存済み意味・旧finite/本人操作の境界を保持。
- 同じ隔離SQL DTOを既存RNへ読み込み、確認/修正/不使用の9表示段階とFree/Plus非表示を描画treeで照合。関連RN3検証成功、native host/HTTP routingはmockで、本人端末・Bitmap/PNGではない。
- 一回のprovider取得から保存した本文を保持し、feedback保存/GETの生成0、回答後だけ既存provider一回を確認。SYSTEM・生成材料のfieldやモデルhintは変更していない。
- private原本は6つの保存DTO/作者材料とRN実描画tree、検証XML/結果を保全する。新公開本文・secret・本番user dataはGitHubへ入れない。
- 独立read-only reviewでSafety採用履歴の積集合、source/本人回答からの導出、訂正除外、feedback/権利/失効・GET非導出と公開契約不拡張を確認。保存を止める重大所見なし。

一時コピーのRN full suite試行では、コピー先からの相対module解決と既存metro依存の欠落で無関係な検査が停止した。この環境失敗を製品修正へ広げず、今回の実DTO表示と既存frame操作に関係する3検証を明示選択して実行した。全RN suite成功とはしない。

Free／Plusにframeを増やさず、新料金・問い数・quota・公開DTO/route・SQL・RN source・prompt・モデルを変更しない。二欄訂正からframeへの意味伝播、Piece／Analysisへの訂正伝播、複数回答Piece、一般応答/編集品質、live／本人端末・正式受入れは未完。新10b563候補不採用と通常model selector OFFを維持する。

STRUCTURE_MAP_DELTA_PRESENT：既存source/meaning ownerからnatural OBS保存・既存public frame/本人操作への接続責務をcurrent01/04、01A/01Cと詳細正本§18.4へ記録。新しい製品owner、型、作者、renderer、DB mechanismは追加しない。前回§9.35の実一回答→Pieceと両CI成功は継承する。旧資格固定3実rawはQ2の別ref/別prepared/messagesであり、現naturalの実4B受領成功へ移し替えない。

当該headの両CI初回成功まで確認した。この既存frame接続を通常API反映・本人端末の残件へ引き継ぐ。自然文がframeにより良くなったという判定、新GPU/fit・同じ不採用比較の反復・通常model採用へ自動進行しない。


<a id="emlis-frame-feedback-target-context-prepared-20261113"></a>
## 9.37 2026-11-13 — frameへの本人判断を対象の仮理解へ結合、実4B一回比較を準備（準備時点の履歴・一回完了）

> 本節は実行前の準備時点の履歴です。「未送信／未実行／承認待ち」および実生成0の記載は当時の状態を示します。Mashの具体承認後の一回は完了し、実結果・同源泉保存・不採用・残差は[§9.38](#emlis-frame-feedback-target-context-actual-20261113)へ更新しました。

**11/13・本人frame判断の対象欠落を修復、実4B比較を準備：** 次の作者材料に確認/不使用/修正のstatusだけが届き、どの仮理解への判断かが落ちていた。Premiumの適格履歴から既存ownerで対象を再導出し、記録ID/frame key/frame refの一意・完全一致と根拠を確認できたものだけAI解釈contextとして添える。後の修正viewや旧版は未確定に残し、本人のstatus/修正文を保持する。新12固有・既存316成功。新3の合成受領保存/新service非生成再読も一致。 [実装 96c2085a](https://github.com/MassyuRed/mashos-api/commit/96c2085acb6913246f324f2eeddb944fffb9ef05)。API 96c2085aのPiece CI [43411618714](https://github.com/MassyuRed/mashos-api/actions/runs/43411618714)とAnalysis CI [43411618653](https://github.com/MassyuRed/mashos-api/actions/runs/43411618653)は、ともにattempt1で全工程成功。追加dispatch/rerun0。

### 実物で見つかった欠落と最小修復

§9.36の保存原本で、初期DTOに対象trigger/received_meaning/frame key/refがある一方、次作者材料のUSER_FRAME_FEEDBACKにはinput_id/status/correction_text/version/updated_atだけが届いていた。確認と不使用は対象本文なし、修正も旧対象なしで、同じ過去記録の複数frameを区別できなかった。前回の表示保存成功は維持し、この未結合を一般応答品質へ数えない。

既存 `natural_reply.py:_frame_feedback_material` で、Safety採用済みの同じ本人履歴に絞ったコピーだけのfeedback/rejected_keysを空にし、既存 `derive_interpretive_frames` から反応前の元frameを得る。原admitted・本人feedback・source prefixは変更しない。記録ID/key/refが全て一致する一つの候補かつ非空evidenceの場合だけBOUNDとし、本人のUSER_FRAME_FEEDBACKと別roleのAI_INTERPRETATION_CONTEXT/PAST_RECORD_FRAMEを添える。REVISEDの本人文は旧対象文に置き換えず、REJECTEDの対象をactive frameへ戻さない。

`frame-view` をbase refと同一視せず、後の修正表示・改変source・未知/非一意・任意current sourceへの未対応をUNRESOLVEDに残す。keyだけや意味の近さで対象を作らない。反復修正では最新feedback行から以前の本人修正文が失われるため、この修復で完全な版復元ができたとはしない。既存source/権利ownerがfeedback自体を先に除外する場合も維持する。

| 変更file（mashos-api） | 現責務 |
|---|---|
| `ai/services/ai_inference/cocolon_meaning_experience_engine/natural_reply.py` | 既存feedback投影へ正当に同定できた対象controlを結合。対象不明でも元status/本人修正文/versionを保持。SYSTEMの文章と既存message builderのコードは無変更。変わるのは対象contextを含むprivate JSON材料である。 |
| `ai/tests/test_emlis_frame_feedback_context.py`（新） | 初回3status、後の2反応、旧版/権利/訂正/Safety/任意導出失敗/feedbackなしの12検査。 |
| 既存Piece/Analysis workflow2本 | 新suiteを既存paths/実行stepへ追加。新workflow/新owner/新authorなし。 |

### 終えたCPU検証と、実生成へ残す範囲

新12固有は分割で全成功（最初9成功/3fixture期待失敗、関連4成功のうちFree1は重複なので合計しない）。変更履歴とPlusは既存ownerがfeedbackを除外すること、過去本文はfeedback変更でCONTEXT_CHANGEDになることにfixtureを合わせた。sourceを緩めていない。既存natural application/frame/question/二欄訂正/意味比較/予算/HTTPの7suiteは316成功・失敗/skip0、54.70秒。

共通の隔離SQL checkpointから3枝を作り、原入力/実ANSWER/源泉ID/本文/サービス制御時計とfeedback時刻を固定した。各SQL event.recorded_atは分岐の実commit時計を保持しており、全event row同一とはしない。比較する作者材料に入るANSWER source payload/時刻/IDは一致する。同じ過去記録内の拒否対象A/Bと本人修正Aを固定し、旧拒否2枝はmessages全byte一致、新3messagesは全て別、全SYSTEM一致を確認した。旧拒否1共有＋旧修正1＋新3で研究生成は5要求とする。

各受領前checkpointはCALL_STARTED保存済/RECEIVEDなし。合成本文で実receipt→既存process→保存→新service GETを3件完了し、原入力/ANSWER/feedback/先行event不変と同本文再読を確認した。拒否A/Bは指定対象だけを除いた2frame、修正Aは本人文へ更新した3frameを保持。モデル生成・raw実効果・独立human評価ではない。

### 準備した一回比較と承認境界

送信対象は3file、合計**83,777byte**。架空材料と既存作者messagesのみで、既存Pod `f1lle4xwq3wjln` の同じ提供へlocalhostで送る。研究は旧2/新3=5生成、normal/Analysisの前後4対照を含めモデルPOST最大9、独立health GET前後2で全HTTP最大11。全体300秒・一回・再試行/学習/提供停止/再起動/重みload/設定変更0。既存PID/starttimeとhealth、対照の生response一致を前後確認し、不一致/期限/形式拒否はFAILED_NO_RETRYへ止める。後確認とcloseに130秒を確保する。

| Podへ置くfile | byte | SHA256 |
|---|---:|---|
| `frame_context_http_once.py` | 18,431 | `9dfe86482e3460a6124baa1e8f3c892f457351fbcd6fc3a3d119d64abc907f38` |
| `wire_requests.private.json` | 65,143 | `6a47b81bdde211a456fdeb93c298d016dd03b3034c3128aa32be9bd21cffd9b8` |
| `files.json` | 203 | `a7477190ca04b1562030084dc3cf84376842d27a89cf655104595ced1dd1b8bb` |

既存2鍵は同Podの指定2fileから該当項目だけをメモリ内で同Pod認証に使い、保存/表示/回収しない。processの環境/argv全読や復元再利用は不要。送信64KiB/受領256KiB、各研究POSTは23秒まで、health GETは5秒まで。新依存/download/外部serviceなし。実tokenizerはlocal固定cacheがなく未確認であり、byteをtokenへ換算しない。各request bodyは10,318–10,907byteだが、8192context/2048出力予約は既存serverが検査し、拒否時に切断/追加tryしない。

候補runnerのmain/モデルPOST/health GET/Pod送信/GPU/fitは全0。上の具体的な新送信は前回の消費済み一回承認へ含めず、別の実行承認待ち。実行前のread-only独立reviewではblocking所見なし。実生成後は全無修補rawを原入力/過去/本人判断と読み、対象の取り違え・拒否の再利用・逆解釈・時点転移・内部label露出・復唱を確認する。機械保存成功を本文品質へ換算せず、成功しないhint/SYSTEM周回や追加fitへ自動進行しない。

SYSTEMの文章・モデル・作者・公開DTO/API・DB/SQL・RN・料金/問い数/quotaは変更しない。対象contextは本人sourceや有効frameではない。一般応答品質、反復修正時の対象復元、二欄訂正→frame/他core伝播、live/本人端末・正式受入れは未完。通常model selector OFF、新10b563不採用を維持する。

STRUCTURE_MAP_DELTA_PRESENT：既存frame ownerからnatural private作者材料への対象結合をcurrent01/04・01A/01C・詳細正本§18.4へ反映。新しいsource type/public contract/DB機構は追加しない。次はこの凍結5研究要求と前後確認の具体承認後に一回だけ実比較し、同じ新3checkpointの無修補受領保存/非生成再読と本文比較へ戻る。


<a id="emlis-frame-feedback-target-context-actual-20261113"></a>
## 9.38 2026-11-13 — 承認済みframe本人判断の実5比較と同源泉3保存、拒否／修正不反映で本文不採用

### 一回の実行と元提供の保持

承認済み83,777byte／3fileを既存Pod f1lle4xwq3wjlnの同じ提供へ一回だけ送信した。旧拒否A/Bはmessages全byteが同じため旧拒否1共有、旧修正1、新拒否A/B・新修正Aの3で研究5要求とした。通常／Analysisの前後4対照を合わせた9model POSTは全HTTP200／stop、独立health前後2GETも200、全HTTP11で上限内だった。実行98.005834247秒、archive close98.032634725秒で全体300秒以内に完了した。

PID84398／starttime212772776は前後不変。通常／Analysisの対照は各前後の生responseが全byte一致した。学習／再試行／提供停止／再起動／重みload／設定変更0、鍵の表示／保存／回収0。この一回は完了し承認消費済みで、別材料・追加比較へ再利用しない。STRICT_LOCAL_VALIDATION_PASSは凍結要求・HTTP・counter・原bytesと提供保持の確認であり、本文品質の合格ではない。

### 無修補rawの採否

| 比較対象 | 実本文の読みと採否 |
|---|---|
| 旧拒否共有 | 現原入力の三つの気持ちと「今は嬉しい」を復唱。拒否対象を直接復活させてはいないが、対象識別を示す応答でもなく、合格へ数えない。 |
| 新拒否A | 拒否した「褒められた→重かった」を他の過去mappingとともに断定し、本人の不使用判断を反映しない。FAIL。 |
| 新拒否B | 拒否した「誘われた→怖かった」を断定し、本人の不使用判断を反映しない。FAIL。 |
| 旧修正A | 旧拒否共有rawと全文同一。本人修正文を反映しない。 |
| 新修正A | 「結果だけで判断されたことが気になった。」という本人修正を反映せず、旧「褒められた→重かった」を再使用。FAIL。 |

新3の達成0/3・FAIL3/3として、本文品質改善候補を不採用とした。rootによる全原文／raw対照と独立read-only確認が同じ不足を確認した。正式な独立human Product Readではない。旧2も合格対照ではなく、異なる新3の表面bytesを対象理解の成功へ数えない。

元の過去ANSWERは実在する。欠陥は「重かった／怖かった／苦しかった」の捏造ではなく、後の本人status／修正文を優先せず、拒否／修正済みのmappingを無留保で再使用することである。過去sourceの存在を、本人判断が反映された証拠にしない。

今回5研究rawは現在の「今は嬉しい」を保持し、明確な肯否反転・時点逆転、内部label／ID／診断露出は認めなかった。一方、前記録と当回の同文記録を区別せず、新3が当回の悲しさ／寂しさを過去mappingへ置換したように読める限界がある。新Aの「その変化を、受け取った。」も、履歴間を一続きの変化として読む表現で、具体訂正を受領した証拠ではない。三つの過去ANSWERの復唱を中心とする不足も残る。

### 同じ新3checkpointへの受領保存・非生成再読

共通準備から凍結した新拒否A/B・新修正Aの各checkpointへ、取得済み実本文を既存NATURAL_REPLY_RECEIVED receiptとして渡し、既存処理で保存した。隔離分岐のprocessing_deadline_atだけを更新して再開し、原入力／ANSWER／feedback／先行eventは変更していない。元REFINED材料／messages／source prefixへ結び、新serviceのGETで保存本文が一致する3/3を確認した。再取得／model callは0。

拒否A/Bは指定frameだけを除いた各2frame、修正Aは本人修正文を反映した3frameを保持した。frame保存・失効の動作は成立し、自然本文には上記不足が残った。保存本文への処置は既存providerと同じ外側空白stripだけで、実response.modelを保持した。生response原bytesは別途そのまま保全し、本文の語句・役割・留保・句読点を修補していない。

この保存は架空source・既存隔離PGliteの同一源泉再開である。live Supabase／実Auth／Render／RN build・本人端末の通常一巡へ拡大しない。初回合成3保存の準備結果と、今回の実raw3保存を分ける。保存成功は本文採用・意味品質合格を示さない。

### 原本・限界・現在の残差

private原本はactual/raw/results.private.jsonと全HTTP生bytes／要求、actual/summary.json、actual/validation.private.json、actual/meaning_review.private.json、prepared/actual_saved_newの3受領再読結果とsummaryにある。公開資料には本文全文・source全文・資格情報を転載しない。実行と原本同一性の確認、全本文の意味対照、隔離保存・非生成再読は別の確認として記録する。

対象情報は作者材料へ届くが、本人status／修正文を優先した本文にならない。この残差を唯一の内部原因へ断定せず、追加hint／SYSTEM／fit比較・同じ不採用runの反復へ進まない。既存12固有＋316成功とAPI96c2085aの両CI初回成功は前回完了として継承し、今回の新test／CI実行へ加算しない。

STRUCTURE_MAP_DELTA_NONE：今回は実比較・同源泉保存再読・採否／残差の記録で、製品source／test／公開DTO/API／DB/SQL／RN／作者／モデル／通常selectorの変更0。対象contextは本人sourceや有効frameではなく、反復修正時の対象復元、二欄訂正→frame／Piece／Analysis伝播、一般応答／編集品質、live／本人端末・正式受入れは未完。通常model selector OFF、新10b563不採用を維持する。


<a id="emlis-repeated-frame-target-same-thread-20261113"></a>
## 9.39 2026-11-13 — 同じthread内の反復frame判断で、本人が見た正確な対象を保持

### 直接修復した接続抜け

§9.38の一般本文品質未達と、既知の反復対象喪失を分けた。既存FrameEditorは修正済みの理解に本人のcorrection_textを表示するが、frame_feedbackの操作記録にはstatusしかなく、最新feedback行の上書き後には以前の本人修正文を復元できなかった。元frameへのref完全一致だけでは二回目がUNRESOLVEDになる。過去に保存していない本人文を推測で作らず、操作時に実際の表示対象を保存する因果箇所だけを修復した。

[API 8cba3e0c](https://github.com/MassyuRed/mashos-api/commit/8cba3e0cce2390288137dab83d94cf0616f49dcf)は既存3製品fileと既存test1fileの変更である。新table・列・migration・RPC・公開DTO/API・RN source・作者・SYSTEM・生成hint・モデル・selectorは追加変更しない。GPU生成・追加学習・Render配置・live DB変更・build・配布は0。

### 責務と全file地図への差分

| 既存owner | 今回の責務 |
|---|---|
| ai/services/ai_inference/emlis_thread_service.py | 現在の保存OBS artifactと公開frame-viewを完全一致させ、FrameEditorが表示していた本文・旧status・根拠・source guardと次feedback versionを既存OPERATION.payloadへ保存する。最新判断のrequest fingerprint/key/ref/input/versionに一意一致する同thread操作だけを_requestへ投影する。 |
| cocolon_meaning_experience_engine/emlis_thread_history.py | FrameFeedbackSourceV1の任意target_context_jsonへ対象contextを運ぶ。本人のfeedback evidence_refから当該AI/UI contextを除外し、既存user-source identityと保存prefix互換を維持する。 |
| cocolon_meaning_experience_engine/natural_reply.py | 既存original frame一致を優先し、後のviewは保存対象・源泉guard・根拠・Safetyが一致した場合だけBOUNDへする。以前の本人修正文はtarget_user_revision／USER_FRAME_REVISION_CONTEXT、AI対象は従来target_ai_interpretationと分離する。対象contextを現在有効なframeや本人特徴へ昇格しない。 |
| ai/tests/test_emlis_frame_feedback_context.py | 既存12件のうち二回目2件の期待を正確な対象保持へ更新し、新10件を追加した計22件。隔離SQL・保存GET・合成providerで接続を確認する。 |

上記2つのCMEE fileはai/services/ai_inference/配下。STRUCTURE_MAP_DELTA_PRESENTとしてcurrent01/04・全file地図01A/01C・商品現在地・Emlis詳細正本18.4・最新weeklyへ同じ範囲を反映する。新しい補助system／checker／controller／authority familyは作らない。

### 実検証と独立確認

最初の関連集合は121成功、追加した二件は2成功、非重複のnatural reply周辺は276成功、計399固有件が成功した。本人修正文をAI対象fieldから分離する最終修正後、対象file全22件も再確認して成功した。この22を399へ上乗せしない。新規は10件、既存反復対象2件は期待更新であり新規件数へ加算しない。既存Pydantic root_validator非推奨警告が各関連集合で1件あり、assert失敗・skipは0だった。

修正→再修正／不使用、REFINED保存後の再修正、対象欠落・version/ref/input/guard不一致・重複、別threadでの未確定保持、feedback identity互換、以前の本人文がSafety不適格の場合を確認した。既存Free/Plus境界・source変更・訂正履歴・問い／回答更新・natural保存再読も関連集合で維持した。新providerは合成で、実4Bの品質評価ではない。独立read-onlyレビューが最終diffと実RN FrameEditorの表示選択を照合し、重大問題なしを確認した。正式human Product Readではない。

### 限界と次の直接残件

今回閉じたのは同じ保存thread内の対象保持である。過去AのframeをBで判断した場合、操作targetはB.eventsに保存される。別thread Cが過去Aだけを取得してもBの操作は渡らないため、反復targetは引き続きUNRESOLVEDとする。全threadへ接続済みとしない。跨threadを閉じる場合は、既存本人権利・最新feedbackに一致する操作targetを既存context読取へ渡す変更の範囲を先に確定する。新tableや別の検索systemを先に作らない。

§9.38の拒否／修正不反映3件は不採用のまま、今回の材料保持成功で実本文の採否を変更しない。実4Bの一般応答品質、二欄訂正→frame／Piece／Analysis伝播、複数回答Piece、通常配置・本人端末・正式受入れは未完。追加hint／SYSTEM／fitの同型比較へ戻らず、既存の不採用run・消費済み承認を再使用しない。通常model selector OFFと新10b563不採用を維持する。全仕様・全file本文の意味理解を、この限定修復やtest件数から全完了とは主張しない。


<a id="emlis-cross-record-frame-target-20261113"></a>
## 9.40 2026-11-13 — 別記録への正確なframe判断対象と、その依存元の失効を接続

### 商品経路と変更範囲

§9.39の残件だった、過去AのframeをBで判断した後、別の現在記録Cへ対象を渡す接続を実装した。Bが既存3／6件の選択履歴に入らなくても、本人が見ていた正確な対象だけをCへ渡す。B本文や全イベントを新しい本人履歴へ追加せず、旧未保存の対象を推測復元しない。

[API b8466c6a](https://github.com/MassyuRed/mashos-api/commit/b8466c6acba694d410a89068c0bc5054123e3116)は既存製品1file、既存test3file、既存workflow2file、新migration2fileの計8path。新table／列／公開API・DTO／RN／model／SYSTEM／生成hint／料金／問い数／履歴枠の変更はない。migrationはCLIで作成し、既存invoker functionのsignature・ACL・RLSを維持する。稼働DB適用・Render配置・GPU生成・学習・build・配布は0。コードとSQL案の接続確認であり、実4Bの本文改善ではない。

### 全file地図と責務

| owner | 今回の責務 |
|---|---|
| ai/services/ai_inference/emlis_thread_service.py | 自threadとRPC投影の同じ操作IDを重複排除する。異なる複数候補は選別前に未確定。fresh開始／本人回答時にframe_target_dependenciesをprivate dataへ固定し、GET／明示再開時の現依存と照合する。非emptyだけcontext identityを拡張し、旧emptyは完全互換。 |
| supabase/migrations/20261113120241_emlis_frame_feedback_target_context.sql | 既存related_contextとcommitを更新。最新feedbackに一致する最大2候補の必要payloadとorigin guardだけを返す。Bの同本人・natural/Q3・source snapshot一致・既存閲覧資格を確認する。commitはB原入力／thread／操作をshare lockした後にRPCで再照合し、判断更新前の状態に対して検査する。 |
| supabase/migrations/20261113120502_piece_frame_target_dependency_fence.sql | 既存Piece issue／visual／saveの3関数へ同じ依存照合を追加。既存一意anchorをpg_get_functiondefで差替え、既存lock／quota／権利条件を維持する。refined用context identityのoptional拡張をPythonと一致させる。 |
| ai/tests/test_emlis_frame_feedback_context.py | 新18件を含む40件。同本人のA→B→C、履歴枠外のB、受取先での再修正と回答、旧未保存・複数候補・他本人・version不一致、B編集／削除／操作消失、生成中の変更、降格、非生成GETとreceipt再開を確認する。 |
| ai/tests/piece_v2/test_b05_natural_refined_saved_pipeline.py | 新7件を含む78件。新contextのrefined→Piece候補／保存／同版再読とquota1を確認し、B編集／削除時の3操作の拒否・Piece状態不変を確認する。 |
| ai/tests/test_emlis_q3_application.py・既存workflow2本 | 隔離DBへ新core migrationを適用。既存CI対象へmigration2pathを追加し、既存test経路を使う。新しいrunner／CI family／手動dispatchは作らない。 |

STRUCTURE_MAP_DELTA_PRESENT。商品現在地、Emlis／Piece／CMEE current maps、全file地図01A/B/C、Emlis詳細18.4、最新weeklyへ同じ責務と限界を反映する。

### 保存・失効・互換

依存はframe key／version／判断元Bの入力ID・原入力digest／操作ID・payload digestの6scalarで、Bの無関係な後続操作やthread revisionだけでは失効させない。作者材料へ渡す対象は最新feedbackのkey/ref/input/version/statusに一致し、Pythonの既存request fingerprint確認とA側の根拠・source guard・Safetyも通った一意な記録だけとする。候補2件の一方を後から選んで依存なしBOUNDにしない。

C生成後にBが編集・削除された場合、または対象操作が失われた場合、保存OBSの表示と再取得資格を抑止する。生成中の変更は保存前に拒否する。受取先C自身で再修正するときは、旧feedbackと旧依存を確認してから最新feedbackを更新し、新操作を保存する。確認済みreceiptは固定context identityで再開し、同じproviderを再取得しない。依存変更後の明示再開も拒否する。

旧empty context identity・公開DTOを維持し、未消費の既存threadへ新targetを黙って付け替えない。新開始／明示更新時に固定する。Piece側にも同じ依存・identityを照合させ、Pythonだけの資格確認をSQL保存へすり抜けさせない。Premiumの履歴は無制限という既存仕様を維持し、有限の期限を新設しない。権利降格時は既存通りframe材料を外す。

### 実検証・途中修正・限界

最終関連集合は219成功＋別のnatural reply周辺276成功＝495固有件、FAIL／SKIP0。新規はframe18＋Piece7＝25件、既存は470件。途中の部分実行・再確認を件数へ上乗せしない。既存Pydantic root_validator非推奨警告は各最終集合で1件。独立read-onlyレビューで、依存照合のupsert順と複数候補選別の隙間を指摘され、同じ単位で修正・回帰を追加した。最終差分に追加の重大欠陥なしを確認した。正式human Product Readではない。

途中のPremium期限切れというtest仮定は既存無制限仕様と不一致のため撤回し、権利降格の回帰へ置き換えた。Piece新fixtureのprovider記録形式の不整合も修正した。これらを製品の意味品質改善やGPU再試行へ換算しない。前回8cba3e0cのPiece CI43420547231／Analysis CI43420547262は両方attempt1で成功済み。今回commitの新CI結果とは分ける。

合成Auth／providerと隔離PGliteでの実SQLの確認であり、live Supabase／PostgREST、実モデル本文、native画像、本人端末、複数接続の実row-lock待機は今回未確認。既存SQLのlockを維持・拡張したことと、今回実lock-waitを検証したことを混同しない。本番へ通す場合はcore migration→Piece migration→APIの適用単位を確認する。今回これらを本番適用したとはしない。

§9.38の実4B新3件不採用、通常selector OFF、新10b563不採用を維持する。次の主な未完は本人判断を優先した実4B本文、二欄訂正→frame／Piece／Analysisの意味伝播、複数回答Piece、通常反映と本人端末である。今回の保存・失効接続を、それらの一般品質・全補助経路完了へ広げない。同じhint／SYSTEM／fit比較や消費済みrunの反復には戻らない。


<a id="emlis-cross-record-frame-target-prepared-20261113"></a>
## 9.41 2026-11-13 — 別記録の反復frame判断対象を実4Bへ渡す比較を準備、未実行

### 今回固定した商品場面と比較の意味

§9.40のAPI b8466c6aを基準に、過去AのframeをBで修正し、さらに再修正／不使用とした後、別の現在Cで返事を受ける2分岐を固定した。BはCの選択履歴へ入らず、Aだけが履歴に入る。Bを履歴枠へ追加した比較ではない。Cには別の出来事と明記した思考・感情欄と出来事・行動欄を持たせ、過去Aと同じ出来事として原因を移さない。今回は問い受信OFFのFINAL本文で、CのQUESTION／ANSWERは0である。

同じ2分岐から対象未結合old／結合済みnewを各1応答、計4応答とする。oldは同じ採用sourceからtarget_context_jsonだけを除いた対照であり、旧版全体や以前の実4B runの再現ではない。原入力・過去回答・SYSTEMは全4要求で共通で、各old／new対では最新status・本人修正文も同一である。新旧差はBOUND／UNRESOLVEDと正確な旧本人修正文contextだけで、追加hint／SYSTEMは0。§9.38の同じ3応答を再生成する作業ではない。

今回Cの悲しさ・弱い不安・記載された同僚の行動・相手の意図不明を保つこと、最新の修正／不使用を優先して旧修正文を無留保に復活させないことを全文で確認する。過去Aの気持ちや理由をCへ転用しない。対象に触れないだけの本文、内部名や修正文の貼返し、全入力の逐語復唱を対象理解の達成へ数えない。意味保持、自然さ、保存再読、提供前後一致の4観点を分ける。

### 凍結原本と新しい一回分の範囲

準備原本は [Cocolon_CMEE_AR03_CrossRecordFrameTarget_Prepared_20261113.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-f0b5317f85b48191a9dd3909b126606c_2f7470f963808191aaebf050935e72de&account_id=personal)。13,746,795byte、SHA256 `caf177436dd230b76d08e1c7202aad9115c38efcd914ae7e282c575e383ed430`、21member。準備v2の完全materials／messages、同源泉checkpoints、CPU保存再読原本、準備・受領再開script、README、送信ZIPとmanifestを含む。資格情報・実ユーザー本文は含まない。

Podへ送るのはrunner／wire／files台帳の3fileだけで、展開後50,496byte、送信ZIPは11,863byte。runner SHA256は `2ea88990f3755929f43dd1e5a320510accee602fbf62e592ef3d18831563a75a`、wireは `2f2bbb077c37b8008dc1ffb923c4da55b2246a477e86fd81aef8b0ed2695046d`。checkpointsは送らない。

既存Pod f1lle4xwq3wjlnの稼働中localhost提供へ、研究4POST＋通常／Analysis前後4POST＋health前後2GET、最大8生成／10HTTP、ZIP閉鎖まで300秒以内、一回のみとする。学習・model load・再起動・停止・再試行は0。既存2鍵は同Pod内の指定fileの指定keyだけを読み、localhost認証のメモリ内headerに限って使う。起動環境全体の読取・保存や鍵の出力／外部送信はしない。proxy／redirectを使わず、started.jsonで一回性を固定する。研究失敗後は次の研究へ進まず前後確認へ閉じる。前後responseは全bytes、提供はPID／starttimeで一致確認する。

状態はPREPARED_NOT_EXECUTEDで、Pod送信・実model呼出・GPU学習はいずれも0。前回の限定承認は実行済みで消費されており、今回の新しい凍結材料へ読み替えない。新しい一回分の承認待ちとする。

### 同じ取得前状態への保存・非生成再読の準備

2branchともCのCALL_STARTED保存済み／RECEIVED未保存の同checkpointを固定した。固定合成本文で既存receipt／commit／process→別service GETの2保存・再読一致を確認し、source／既存event／本人feedback不変、QUESTION／ANSWER追加0、モデル取得・再取得0だった。再修正は最新修正文のframe1件、不使用は0件を維持する。この2件を495固有testへ加算せず、実4B本文品質やlive保存成功とも扱わない。

実本文取得後はnew2だけを元checkpointの使い捨てforkへ戻す。既存provider contractはraw responseをMockTransportでメモリ内再演するだけで、networkへ接続しない。既存処理と同じ外側空白除去以外は本文を補修せず、無修補raw bytesを別途保持する。期限だけprocessing_deadline_at一列を延長し、その差分を記録する。源泉・根拠・identityは書き換えない。

最終summaryはZIP閉鎖後の原本を別fileとして保持し、ZIP内の閉鎖前summaryを上書きしない。actual保存再開には両原本を必須とし、完了status・ZIP閉鎖を含む300秒以内・前後対照・同PID・回数・request／raw bytes／SHA一致を確認する。ZIP閉鎖後だけ期限超過した結果も受け入れない。

### 独立確認・CIと限界

独立read-only確認で、最初のfixtureの回答日時が原記録より前という不整合を検出した。準備v1を廃案にし、新v2でA→本人回答→B→Cを既存service経由で作成し直した。凍結後の原本時刻を上書きしていない。さらに、actual受入れがZIP閉鎖前状態だけを見る隙間を修正し、別途保持した最終summaryとstateの完全一致を必須にした。最終材料・台帳・時系列・受領再開経路に追加の重大問題なしとの確認を得た。正式human Product Readではない。

前回API b8466c6aの [Piece CI43424124958](https://github.com/MassyuRed/mashos-api/actions/runs/43424124958) と [Analysis CI43424124935](https://github.com/MassyuRed/mashos-api/actions/runs/43424124935) は両方attempt1で成功した。今回の準備で製品source／test／DB/SQL／RN／通常作者／モデル／SYSTEMは変更せず、新CI実行も0。

STRUCTURE_MAP_DELTA_NONE。今回は比較準備・CPU受領再開確認と現在地の差分だけで、§9.40の既存責務地図は変更しない。§9.38新3不採用、通常selector OFF、新10b563不採用を維持する。実4B本文品質、二欄訂正→frame／Piece／Analysisの意味伝播、複数回答Piece、同版画像、live／通常反映／本人端末、正式受入れ、全補助経路完了は未確認・未完である。


<a id="emlis-cross-record-frame-target-actual-20261113"></a>
## 9.42 2026-11-13 — 別記録の反復frame判断対象を実4Bで比較、本文新2は不採用

### 承認された一回と実行結果

Mashが§9.41の50,496byte・3file、対象未結合2＋結合済み2、前後4対照、health2GET、最大5分・一回・学習／再試行／再起動なし、既存2鍵の同Pod内認証利用を明示承認した。既存Podの新しい空フォルダーへ3fileだけをUI送信し、全size／SHAとfile集合一致を確認して一回起動した。以前のrunや承認は再使用していない。

研究4＋前後4の計8POSTは全HTTP200／stop／attempt1、health前後2GETも200。終了記録97.739694秒、ZIP閉鎖97.762331秒で上限300秒以内だった。通常／Analysisの前後responseは全文bytes一致、提供PID84398・starttime212772776を保持した。学習・model load・再起動・停止・retryは0。既存2鍵は指定同Pod fileの指定keyをlocalhost認証にだけ使い、記録・外部送信0。凍結runner／wireのhashは§9.41と完全一致した。

結果ZIPと最終summaryを含むfolder archiveをUIで回収し、原ダウンロードを保持した。summary単体のdownloadイベントはタイムアウトしたためfolder archiveで閉鎖後原本を回収した。この回収操作はmodel生成の再試行ではない。ZIP内の閉鎖前summaryは上書きせず、別fileのfinal_summary.jsonと照合した。終了状態の全field一致、全8raw bytes／SHA／完全要求、前後対照、PID、回数を独立read-onlyでも確認した。

### 全4本文と原入力の直接読取

過去Aと、別の出来事と明記された現在Cの原入力・二欄・感情選択・本人回答・最新判断を全4本文へ直接照合した。oldはtarget contextだけを除いた同源泉の対照で、旧版全体の再現ではない。newは正確な以前の本人修正文が届くが、本文が最新判断と時点範囲を優先したとは認められなかった。

| 比較本文 | 実読取と採否 |
|---|---|
| 未結合・再修正 | 今回の悲しみ・弱い不安・意図不明を概ね保持するが、入力の言い換えが中心。対象理解の成立証拠にはしない。 |
| 結合済み・再修正 | 今回の明示した悲しみが落ち、過去Aの記録と今回の不安を「重なっている」と未根拠で結合する。新本文不採用。最新訂正文への未言及だけをFAIL理由にしない。 |
| 未結合・不使用 | 今回に書かれていない、褒められたこと自体の重さを付加する。過去の意味を今回へ転用しており不採用。 |
| 結合済み・不使用 | 過去の戸惑い・重さと今回の感情の繋がりを追加し、未記載の「自分自身を責める傾向」も付加する。新本文不採用。留保語があっても根拠の不足は解消しない。 |

華恋と独立read-only reviewerのpre-screeningでは新2とも不採用で、本文改善の成立は確認できない。対象に触れないだけの応答を成功へ数えず、保存やHTTP成功で採否を変えない。原因を唯一の内部箇所へ断定せず、追加hint／SYSTEM／fitの同型比較や同じ実runの反復へ戻らない。正式human Product Read、human rating、受入PASSではない。

### 同じ取得前checkpointへの実receipt保存・非生成再読

取得したnew2のrawだけを§9.41で凍結した各checkpointの使い捨てforkへ戻した。既存provider contractをMockTransportでメモリ内再演し、既存NATURAL_REPLY_RECEIVED／commit／processで保存した後、別serviceのGETで同本文を再読した。保存2／再読2成功、実modelへの再取得0、外側空白除去以外の本文補修0、QUESTION／ANSWER追加0である。

source・identity・既存eventの全prefix・本人feedbackは保持し、期限だけprocessing_deadline_at一列を延長して前後値を保存した。再修正frameは最新本人文の1件、不使用frameは0件を保持する。両保存artifactのmeaning_comparisonはUNASSESSEDで、本文の正しさを認定しない。独立read-only確認もraw／source／完全messages・先行events・別service GET一致を確認した。SQLの別再実行はしていない。

### 原本・現在地・残件

同じ資料を [Cocolon_CMEE_AR03_CrossRecordFrameTarget_Actual_20261113.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-f0b5317f85b48191a9dd3909b126606c_2f7470f963808191aaebf050935e72de&account_id=personal) へ更新した。14,087,563byte、SHA256 `69b9725c16dc0ebd9240021bc67bdfef7557cf701f70110e74023899f5824ada`、82member。preparedは当時の凍結原本、prepared/actual_saved_newは実2保存再読、actual/rawはHTTP生bytesと閉鎖前／閉鎖後の別summary、actualのdownload ZIPは回収原本である。actual/meaning_review.private.jsonに全4本文と読取、validation.private.jsonに照合範囲、README_Actual.mdに現結果を保存した。公開資料へ全source／本文・資格情報は転載しない。準備時の未実行記載は当時の履歴で、現在は承認一回を実行済み・消費済みである。

STRUCTURE_MAP_DELTA_NONE。製品source／test／SQL／RN／model／SYSTEM／selectorの変更0。API基準はb8466c6a、同commitの両CI初回成功は既知結果として継承し、今回の新CIへ加算しない。terminal primaryはTECHNICAL_CREDIT（限定実行と同源泉保存再読の完了証拠）、product quality creditは0である。

§9.38新3不採用、通常selector OFF、新10b563不採用を維持する。次の直接未完は、本人の最新判断と過去／今回の範囲を実本文が保つこと。二欄訂正からframe／Piece／Analysisへの意味伝播、複数回答Piece、同版画像、live Auth/PostgREST・本番SQL適用・Render配置・本人端末・正式受入れは今回未完／未実行である。全補助経路の完了へ広げず、追加生成に今回の許可を再使用しない。


<a id="piece-latest-later-add-selected-20261113"></a>
## 9.43 2026-11-13 — 第2・第3回答後の最新一回答をPieceへ接続、実2作品は準備済み・未実行

### 選択した残件と意味の境界

§9.42の実新2は不採用を維持する。調査で、frameの不使用／修正は元の過去ANSWERの撤回とは別であり、今回の材料には最新判断と正確な対象まで届いていた。過去ANSWERの削除・無効化や、同じ失敗本文への追加hint／SYSTEM比較へ進まない。

本書§9.2に残る「2～3回答後のPiece作成」のうち、既存の商品契約（原入力exact1＋本人が明示選択した補足exact1）へ収まる最新一回答の接続を進めた。全回答を自動取得する作品ではない。自然応答で第2／3回答まで終えた後、画面で最新回答全文と何問目かを表示し、その一回答だけを既存単一IDで選ぶ。先行回答は原入力の意味が変わっていないことを確認する資格に限り、Pieceの意味source・追加partitionへ渡さない。

全roundが解決済みADDで、既存原入力を訂正・撤回していない場合に限定する。REVISE／WITHDRAW・未解決・二入力訂正・自己完結しない回答・未回答の追加QUESTION・skipによるFINAL再生成は今回対象外のまま。現在のnatural経路の2自然終了／2回答後stop／3自然終了を扱い、旧finite複数回答や任意回答集合の作品化へ拡張しない。

### 現ownerへの移管とファイル地図

[API dbb96aca](https://github.com/MassyuRed/mashos-api/commit/dbb96aca197b76aa024b4a0ef68ce44e840a444d)の7pathは、既存製品3・test2・workflow1・新migration1である。RNは既存Modalと既存testの2pathを同じ変更単位で更新する。

| owner | 限定した責務 |
|---|---|
| ai/services/ai_inference/piece_v2_source_adapter.py | 旧1回答分岐を保持し、2/3の全Q/A・checkpoint再導出・自然receipt/OBS/finish・続行鎖と時点を確認する。先行roundにもADD以外があれば拒否。最新一回答だけを既存handoffへ入れる。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/piece_refined.py | 既存選択回答型が持つround1..3を許可。自己完結・ADD・訂正語拒否・原入力と一回答の2partition・唯一作者・保存形は維持する。 |
| ai/services/ai_inference/cocolon_meaning_experience_engine/preparation_sources.py | 4B材料入口のround1固定も1..3へ限定適合する。元入力＋選択回答、source commitment、JSON形、SYSTEMと内容選択は変えない。 |
| supabase/migrations/20261113131810_piece_natural_later_add_answer.sql | 既存issue/visual/saveのnatural armだけを拡張し、全roundの資格と最新選択を再照合。元のprofile/thread/history/frame-target locks、ACL/RLS、signature・quota・旧finite armを維持する。新table/列/RPCはない。 |
| screens/input/EmlisThreadModal.js | 終了した1..3roundのQ/A対応・ID一意・最終OBSを確認して最新回答一件を選ぶ。『ピースに含めるあなたの回答 · N問目』、全文、『元の記録と、この回答を使います』と既存buttonを表示。選択の最終資格はserverが持つ。 |
| 既存test3fileとPiece workflow | APIのnatural保存testへ正9・prior変異48を追加。既存保存helperの回答counterを実event数と一致させる。既存RN testへ第2/3回答の表示・選択2件を追加し、workflowは新migration pathだけ追加する。 |

単一ANSWER envelopeのcommitment、旧1回答のsource_ref／serialized bytes生成式、公開API／source_ref／lineage形を変えない。新しい意味system、writer、checker、controllerやworkflow familyは作らない。STRUCTURE_MAP_DELTA_PRESENTとしてPiece/CMEE current mapsと全file地図01/01A/01B/01Cへ同じ責務を反映する。

### 検証した結果と限界

最終の非重複集合はPython195＋236＝431成功、別に38subtests。新規は正9＋prior変異48＝57件。最後の137再確認は既存集合の重複で、加算しない。既存Pydantic root_validator非推奨警告が各関連集合で1件、FAIL/SKIP0。RNはrepositoryの既存pin（React/renderer18.3.1・Babel7.25系）で旧45＋新2＝47成功。先行する別version試行を別件数へ加算しない。

9正例は3planそれぞれの2自然終了／2stop／3自然終了で、生成候補・見た目変更（有料）・保存・同一版の非生成再読とquota各1、source／Emlis不変を確認した。prior REVISE・原文改変・prefix・receipt改変・続行欠落・回答source時点不整合は、APIとSQL3操作で拒否しPiece状態を保持する。SQLは既存通り保存関係・envelope・ADDを確認し、Pythonの全言語checkpoint再導出をSQLだけで独立に再実装したとはしない。

独立read-onlyレビューで、回答source.recorded_atの下限を初回finish／対応CONTINUEDへ修正した。authored_atは本人が記した時刻なので同制限を掛けない。最終のsource資格・旧identity互換・表示に追加の重大問題なしを確認した。正式human Product Readではない。

### 同じ保存状態での実4B確認を具体化

準備原本は [Cocolon_CMEE_AR04_LatestAnswer_Piece_Prepared_20261113.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-b1e9007b37fc8191b9be577a53a22038_2f7470f963808191aaebf050935e72de&account_id=personal)。9,572,193byte、SHA256 `3a645dabb9ad8b7c7402c505900a31795adb1b85ce5a0119200edc239283fcd9`、19member。第2/3回答後の自然終了各一件、いずれもFreeの取得前SQL checkpoint・全七項目・Q/A・prepared/messages・source identityを保持する。先行Emlis本文は合成で、Piece意味sourceへ入らない。

送信はrunner・wire・hash台帳の3file49,490byteだけ。既存Podの稼働中4Bへ新2作品＋通常／Analysis前後4応答＋health前後2GET、最大6生成／8HTTP、ZIP閉鎖まで300秒以内、一回、学習／model load／再起動／停止／再試行0とする。既存2鍵は指定同Pod fileの指定keyをlocalhost認証のメモリ内headerにのみ使う。鍵・起動環境全体を保存／出力／外部送信せず、checkpointsもPodへ送らない。SYSTEM／生成hintとモデルを変更しない。前後全response bytes、同PID/starttime、全raw/SHA/完全要求と既存piece.field_slots.v1を確認する。研究失敗後は次研究へ進まず提供後確認だけで閉じる。

同checkpointを閉じて戻す固定CPU preflight2件では、既存4B受領contractをMockTransportで再演し、候補・保存・再読とquota1、source／thread／全events不変を確認した。準備中の要求SHAのJSON順序・合成応答format・trusted source_requestとblock順の機械的不整合を修正して最終一致を確認した。原checkpointと最終送信3fileを固定し、独立read-onlyでも照合済みである。取得後もrawを補修せず、既存partition順で同状態へ保存する。ZIP閉鎖後最終summaryを別原本として必須にし、閉鎖前summaryを上書きしない。

準備時点では新しい一回分の承認待ちで、Pod送信／実4B呼出は0だった。11/14のMash明示承認で実行済みとなり、実2作品の本文対照・同状態保存の結果は§9.44へ更新した。今回分を含め過去の許可は消費済みで再使用しない。実2作品の原入力対照・同版保存は§9.44で確認済み。一般的な整形品質改善、native画像、全planの実4B、live Auth/PostgREST・本番SQL適用・Render配置・本人端末は引き続き未実証／未実行／未確認。CPU候補や表示単体成功を作品品質改善済みとはしない。通常selector OFF、新10b563・§9.38新3・§9.42新2不採用を維持し、全補助経路の完成へ広げない。全file本文・全仕様の意味理解をこの限定変更やtest件数から全完了とは主張しない。


<a id="piece-latest-later-add-actual-20261114"></a>
## 9.44 2026-11-14 — 最新一回答の実4B2作品と、元checkpointからの保存・再読

### 承認一回分の実結果

Mashの「49,490byte・3file、新2作品＋前後4応答＋稼働確認2GET、最大5分・一回・学習／再試行／再起動なし。既存2鍵は同Pod内認証だけ」への明示承認を実行した。凍結したrunner18,774byte・wire30,515byte・台帳201byteの全SHAが送付後も一致し、今回専用directoryでstarted排他を使った。既存Pod f1lle4xwq3wjlnの稼働中localhost提供だけを呼び、新Piece2＋通常／Analysis前後4＝6POST、health2GETを実施。全HTTP200、6応答ともstop／attempt1、ZIP閉鎖まで94.0763195469秒。学習／再試行／再起動／停止／model load0。通常／Analysisの前後全response bytes、PID84398／starttime212772776が一致した。既存2鍵は同Pod内localhost認証のメモリ内headerだけに使い、環境全体・鍵を出力／保存／外部送信しなかった。

### 実本文の判定

Freeの自然終了2回答／3回答後を各1件確認。両件の既存piece.field_slots.v1はmemo_0とanswer_text_private_1の2fieldで、値はそれぞれ原入力と選択した最新回答のliteralに完全一致した。第2回答作品は元の2節と最新の怖さ、第3回答作品は元の3節と最新の寂しさを保持する。嬉しくなかったという否定、過去の反応、最新回答の今、褒められた／誘われた／頼まれたの役割を保持し、先行の嬉しさ／怖さや合成Emlis本文の混入、未記載の原因・意図・感情の追加、過去から現在への連続変化の断定は見られない。

全文照合と独立read-only確認で、この限定2件の意味保持に明確な問題は見つからなかった。一方、可視の文章編集差分は0で、原文の複写を整形品質改善とはしない。元から伝わる短文を維持したこと自体をFAILにもせず、一般的な長文・二欄の作品化、全回答取込、通常モデル採用や正式human Product Readへ広げない。

### 同状態の保存・再読

原取得前checkpoint2件をそのまま復元し、凍結prepared／完全messages／source commitment／最新回答IDが一致することを確認した。取得済みrawを補修せず、既存provider contractへMockTransportで各1回再演した。既存partition順でpreview・保存・非生成GETまで同じ本文・content payload・visual recipeと各hash／renderer版が一致し、各quota1、原入力・thread・既存eventsは不変。保存再開時の新model取得は0。rawのslot並びを変更した再生成や新Emlis start／answerはない。

保存先は隔離PGlite、AuthとSQL callbackは合成で、先行Emlisも合成のまま資格確認だけに用いた。今回の実4BはPiece2作品と前後対照であり、Emlis全会話・全plan実生成、live Auth／PostgREST、本番SQL、native bitmap・端末の成功ではない。

### 原本・到達点・次の未完

原本は [Cocolon_CMEE_AR04_LatestAnswer_Piece_Actual_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-b1e9007b37fc8191b9be577a53a22038_2f7470f963808191aaebf050935e72de&account_id=personal) へ同じfile identityで更新した。9,765,108byte、SHA256 `e92dec0e3d4efc891ff8851eca21310020d95a4868fe83f2233145a43ee07993`、47member。prepared19memberはbyte変更せず、実取得folder archive／results.zip、全raw・完全要求、ZIP閉鎖前summaryと閉鎖後final_summaryの別原本、全文判定、同状態保存2結果を保持する。秘密値やpublic GitHubへのprivate本文追加はない。

API dbb96acaのPiece CI43435593613とAnalysis CI43435593636はどちらもattempt1 successとなった。既報の431固有Python＋38subtests・47固有RNに今回の保存再演を新test数として加算しない。本作業でsource／SQL／RN／SYSTEM／hint／modelは変更せず、STRUCTURE_MAP_DELTA_NONE。実行と残件の差分だけを現在地・本書・weeklyへ反映する。

主な到達点はTECHNICAL_CREDIT：最新独立ADD一回答が実4Bを通り、同版の候補・保存・再読まで接続した。次の直接未完は同版native画像・実機表示と、長め段落／思考・行動二欄の実本文品質。全回答集合や訂正／撤回を含む作品化、本番SQL適用・Render配置・本人端末・正式受入れは未完を維持する。通常selector OFF、新10b563・§9.38新3・§9.42新2不採用は変更なし。今回の一回分の許可は消費済みで、追加生成・再試行・本番反映に再使用しない。

<a id="piece-latest-answer-native6-20261114"></a>
## 9.45 2026-11-14 — 同じ実4B最新一回答2作品のnative6画面と実PNG書出し

### 完了した範囲と実装先

§9.44のFree第2/第3回答作品を再生成せず、取得済み保存detailとcanonical8項目をそのまま既存のInputPieceActionArea→PiecePreviewModal→PieceOwnerHistoryScreen→pieceExport／PieceExportCanvas／PieceVisualCardへ通した。現製品Cocolon c936d789をpreimageに、研究[938ac9ac](https://github.com/MassyuRed/Cocolon/commit/938ac9acf816c297b343615e6163fdcaf3cebfd2)で既存24f7ba8bの同じnative normal-host検証を2作品へ適合した。製品source／renderer／native581／8秒／API／SQL／権利・Safetyは変更0。

研究の変更は既存workflowとnative entry／fixture selector／XCTest／shellの5path、新しい架空作品fixture tests/fixtures/piece-ar04-latest-answer-host.jsonの計6pathだけ。公開済みAPI testの架空原入力・回答と同じ作品のDTO投影で、private checkpoint／Q&A全文／raw HTTP／認証値は公開しない。期限だけtest copyを2099へ投影し、Free quotaと5API／10sessionは合成。旧prepared・取得済みraw・保存checkpointは変更しない。

### 一回の結果と保存版との直接照合

[run43488462958](https://github.com/MassyuRed/Cocolon/actions/runs/43488462958)／job132103035828はattempt1 success。実行したXCTestは既存の同1method、2作品×preview／saved／exportの全6画面がnative_checked。最長2123.207292msで元8秒以内、本文／2block／3hash／recipe／rendererを含むcanonical8項目は原保存detailと全6一致した。各作品の3画面PNGは全byte一致し、実view-shot PNGも同canvasの画素とasset SHAが一致した。

- 第2回答作品の実export SHA256：2d9744f7f9c34f074b4ea1f7f8ba3a2efd5249b845ecb920b0e16f598d18f571
- 第3回答作品の実export SHA256：39b9559c072edd4be73dc93f20daef158d9753d0853649d392bb1d088f3d4e8d

閉要求→native dismissal後の遷移→saved mountが各event index2→3→4で成立。fresh本人詳細／export再読、保存前fit拒否・同版保存許可、capture identityを保持。2作品それぞれの閉local transportは5API／10sessionで完了・消去。rootと独立read-onlyで原保存DTO・PNG bytes／画素・SHA・順序を照合し、両実exportを目視した範囲では文字／否定／最新回答／Emlisロゴの欠け・重なりを見つけなかった。追加のtest・model生成を独立確認として再実行していない。

自然なText参照画像全体とのRGBA一致は全6不成立のまま。実exportと同canvasの一致を自然参照全体の完全一致へ換算しない。旧V4／WholeCanvas失敗や全renderer／全入力／両OSの合格へ広げない。既存phase6契約check43488462836はsuccessだが、広範囲RN／API suiteの新規成功とはしない。

### 本番との差・保存・残件

稼働Supabaseのmigration履歴と対象3関数の定義をread-only照合した。7引数issue／mutate／saveにはnatural_reply.v1 armがある一方、今回のlatest 1..3判定とprior-chain変数はない。旧5引数issueにも今回の処理はない。最新SQLを本番適用した成功は主張せず、SQL変更・user data読取／書込は0。

[同じ実原本](https://chatgpt.com/library?file_id=libfile_fde3_f-b1e9007b37fc8191b9be577a53a22038_2f7470f963808191aaebf050935e72de&account_id=personal)へnative原本／全PNG／report／xcresult／今回研究6file／直接照合結果を追加した。11,600,631byte・106member、SHA256 2678ac145e38dfdc830095637d28bf77b1a13f0d1e338ba2f477c76c3401efb8。前回47memberは旧READMEだけhistoryへbyte不変で保持し、他46は元path／bytes不変。Actions原本artifact14070706738（884,993byte、SHA256 5c7d8360e60d09b3af12f03b5755280dd534fbfc506cbdae9e29865e19738457）も保持した。保存版guardの競合後にfresh原本が同byteであることを再確認し、同identityのversion2へ反映した。2作品の実PNGも個別保存済み。

本作業の追加model取得・GPU・学習・再試行・本番SQL変更・Render配置・配布・Photos／Share・本人端末は0。前回の94.076319秒の一回分は消費済みのまま。STRUCTURE_MAP_DELTA_NONE：既存製品ownerとcontractを維持し、研究検証の対象と実行／保存状態だけの差分。通常selector OFF、新10b563・§9.38新3・§9.42新2の不採用を維持する。

到達点は同版native画像／実PNG書出しの限定TECHNICAL_CREDIT。本文は元から同文であり、一般的な整形品質改善、正式human Product Read、正式商品受入れの追加はない。次の直接残件は、長め段落・思考／行動二欄の実本文編集品質と、最新SQL／API／RNをそろえた通常経路・本人端末の一巡。全回答集合や訂正／撤回を含む作品化、他AR、全補助経路は未完で、画像成功を理由に通常有効化・追加生成・本番反映へ自動進行しない。

<a id="piece-coherent2-base344a-prepared-20261114"></a>
## 9.46 2026-11-14 — 段落／思考・行動二欄を既存baseとPiece344aで比べる一回を準備、未実行

### 選んだ未完と既存資産

§9.45の最新一回答2作品・native6は完了済みの証拠として保持し、再生成しない。残る一般本文編集のうち、段落と二欄での表現を直接比較する。既存編集判断の追加だけでは§9.22で全3組差分0だった一方、§9.23の保存344aでは二欄／refinedの本人反復省略・公開役割化等に限定差分があった。追加hint／SYSTEM／教師／fitを繰り返さず、既存baseと保存Piece344aを同じ作者source・完全messages・decoder・予算で比較する材料へ固定した。旧3件の再生成や既知成功の加算はしない。

### 凍結した新2件とCPU予行

API dbb96acaの既存source adapter／prepared／編集選択option／CMEE／S7／preview／save／owner再読を使用。Freeの新しい架空2人について、183字5文の単一主題段落と思考77字／行動47字の二欄を、全七項目・source_ref・Emlis状態／eventsとともにモデル取得前の隔離SQL checkpointへ固定した。別processで復元し、prepared ID／private JSON／完全messages一致を確認した。段落の過去・希望・未伝達、二欄の「おれ／僕」・昨日／まだ・留保と否定範囲を保持する。九カテゴリ／全planの網羅や長文一般の品質率へ広げない。

固定CPU本文だけによる2独立forkでは、既存CMEE／S7からpreview・private保存・別service非生成再読まで2件成功。canonical8項目・3hash・rendererが一致、元source／Emlis不変・quota各1、model再取得0。これは受領・保存経路の予行で、実4B本文編集・native画像・商品品質改善ではない。Authと先行Emlisは合成、DBは隔離PGliteであり、live Auth／PostgRESTの成功でもない。

試案も隠さず残した。指示語を含む175字のv1段落は原文そのままでもEngine UNAVAILABLE／unresolved_referenceで拒否され、source／Piece／quota不変。v1へGPUは使わない。v2は参照先を最初から明記した別の新規架空記録として新ID・時刻・checkpoint・messagesから作成し、v1との意味同等・参照解決修復・一般段落対応とは数えない。v1の未対応は残件のまま。新refined試案も現Q3 initialがFINAL／issued0で最新ADD2の資格が成立しなかったため、問いを強制せず取得対象から外した。既存最新回答2作品の証拠へ混ぜない。

### 送信と実行の具体scope、準備時点は未承認

原本は [Cocolon_CMEE_AR04_Coherent2_Base344a_Prepared_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-9bb7f6aceeec8191bafb13d6d3264cc1_2f7470f963808191aaebf050935e72de&account_id=personal)。9,374,774byte・27member、SHA256 `cc41757709975d2001b71a8617555ec095134f307196a3fa15d5500d766d37bb`。最終source checkpoint、全材料、CPU保存結果、未送信v1の原本／拒否結果、新refined不成立、受領再開処理、限定比較runnerを保持する。public GitHubへ架空source全文・完全messages・private状態を転載しない。

送信はrunner37,874byte、wire22,300byte、SHA台帳184byteの3file計60,358byteのみ。runner SHA256 `aab48c97081a5c342cb65b2d279946e872e12d6ef0acb5a6bd3ba41429f32914`、wire SHA256 `89e4d1980a91b6758606c7e67285fb4e930ed3d2051d727e4de71414b3a42f6e`。checkpoint／合成Auth／CPU候補／不成立試案／source一式は送らない。

既存Pod f1lle4xwq3wjlnでbase2＋保存Piece344a2の候補4、通常／Analysisの前後4対照、health2GET。最大8生成・6HTTP、比較は2model instanceを順にloadする。両armとも同じ既存a8fdfbe1 generatorのpiece profile、LMFE、greedy、context8192／output2048・同messages。baseは既存disable_adapter、344aは既存の別Piece adapter選択を使用し、同instanceや現稼働HTTP5e3dと同じ実装の比較とは呼ばない。a8実物の全文とhash、既存の選択分岐を直接確認済みで、parser／schema／作者を追加変更しない。

既存提供を一時停止し、元args／全env／cwdで復元する。ZIP閉鎖後の観測まで最大600秒、復元用120秒、一回・追加学習／再試行0。起動環境全体は同Pod親processのRAMで復元だけに再利用し、保存／出力／外部送信しない。既存2鍵は同Pod localhost認証headerだけ、比較childには渡さない。復元identity一致後にPIDFILEを更新してから後healthを行い、通常／Analysisの前後response全文一致も確認する。実行前のread-onlyではPID84398／starttime212772776・稼働source5e3d・Piece指定なし・保存344a／config一致を観測したが、実行直前の同一性確認を省かない。

取得後はresultとZIP閉鎖後final_summaryの両原本、600秒以内・全共有field・wire／source／回数／対照を照合してから、元checkpointの4独立forkへ無修補rawを各1回受領する。CMEE／S7拒否はそのまま残し、sourceや本文を補修せず、保存成功だけを品質へ数えない。独立read-onlyでrunner／受領／same-source条件を確認し、親子構文・実packet validatorのpure callも成功。新GPU・HTTP・停止／復元は0で、実行成功を先取りしない。

STRUCTURE_MAP_DELTA_NONE。製品source／test／SQL／RN／SYSTEM／model／selectorの変更0、新CI0。通常selector OFF、過去の不採用候補と本番SQL／API／RN・本人端末の残件を維持する。商品品質credit・human Product Read・正式受入れの追加は0。準備時点は新しい一回の具体的承認前・Pod送信／実4B生成0だった。11/14のMash明示承認を一回実行した結果は次の§9.47へ更新した。比較は途中停止・元提供復元済みで、この一回分は消費済み。全補助経路の完了は未達のまま。

<a id="piece-coherent2-base344a-stopped-restored-20261114"></a>
## 9.47 2026-11-14 — base2取得後に比較runnerが停止、344a未取得・元提供復元済み

### 承認された一回の実結果

Mashが§9.46の60,358byte・3file、比較4生成＋前後4対照＋health2GET、提供停止／復元込み最大600秒、一回・追加学習／再試行なしを明示承認した。既存Podの新しい送付folderへ3fileだけをUI送付し、全size／SHA一致を確認して一回起動した。runner／wire／SHA台帳は凍結原本とbyte不変である。

base2件はstopで取得したが、1個目のmodel解放後、2個目をloadする前に比較childがValueErrorで停止した。344aのload／生成は0、model loadは1。候補2＋通常／Analysis前後4＝6生成、対照4POST＋health2GET＝6HTTP、学習／再試行0。前後4POSTは全200／stop、各request／response全文bytes一致、health2GETも200だった。

元提供PID84398／starttime212772776からPID94200／starttime217099821へ、元args／全env／cwd／2鍵を保持して復元した。稼働source、Analysis adapter、保存344aとconfigも不変。child終了後GPU inventoryは空で、復元後healthと前後対照を確認して閉じた。ZIP閉鎖前101.93961339024827秒、閉鎖後101.94335399614647秒で600秒以内。比較statusはFAILED_NOT_ADOPTEDであり、復元成功を比較成功へ換算しない。

### 停止原因と実本文の読取

直接の停止条件は、華恋が比較runnerへ追加した `torch.cuda.memory_allocated() == 0`（凍結runner338行）だった。base2の正常生成後、del／gc／empty_cacheを経てもallocated8,519,680byte、reserved9,078,571,008byteが記録され、0条件を満たさず停止した。既存qualified手順は1child／1load後のprocess終了→親release_child／gpu_releasedを使い、この同child内0byte条件はなかった。今回の比較を妨げたのは華恋の比較用処理であり、344a不良・OOM・source／重み不一致・商品意味の拒否と説明しない。残存tensorの所有元までは記録から特定していない。

base段落は13.2022715350613秒、二欄は9.554401481989771秒。全field値が各原入力literalと完全同文だった。183字段落の経験／次回希望／メモ再読希望／未伝達、二欄の「おれ／僕」・昨日／一人・留保／まだ未定・否定範囲を保持する一方、編集差分0で、二欄には架空氏名も残る。原文copyを一般編集品質改善に数えない。全2rawと原七項目・完全messages／prepared／wireの直接照合と独立read-only読取を行ったが、344aとの比較は未成立である。

既存receiverはcomplete4と比較成功を必須とする。失敗statusを成功へ書き換えず、partial2を通すために条件を緩めず、今回のreceiver／CMEE・S7再演／SQL保存・再読／native画像は0とした。事前CPU2成功や旧344aの結果を、この実2本文の保存や新比較の成功へ加算しない。

### 原本・次の範囲

同じ資料identityを [Cocolon_CMEE_AR04_Coherent2_Base344a_Actual_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-9bb7f6aceeec8191bafb13d6d3264cc1_2f7470f963808191aaebf050935e72de&account_id=personal) のversion1へ更新した。9,600,453byte・44member、SHA256 `2da45d179bc289ea593abaed2afb840e4668337c6aa0a06b428ad831bdc2f0ef`。準備原本27memberは元path／bytesのまま全て保持し、Actual README、送付・起動記録、UI回収原本、閉鎖前ZIP／閉鎖後final_summary、全raw／controls／health、直接照合と復元確認画面を追加した。回収原本60,335byteのSHA256は `a50730bae01a2789eaffb3decec8b9cfa2d92f464c72cb332e04e4d352ff9b5d`。元ZIPを閉鎖後に書き換えていない。

root／独立担当とも原本同一性・閉鎖前後共有field・全2raw・4対照／2GET・復元・回数を照合した。独立担当のmodel／HTTP／SQL再実行は0。新しいrunner、追加GPU、再試行は実行していない。この一回分の許可は消費済みであり、次の実行へ流用しない。

次の最小修正は、比較modelごとに既存1child／1loadの終了境界へ戻し、process終了とGPU inventory空を確認して次へ進めること。これは実行方法の修正案で、商品source／SYSTEM／hint／decoder／入力／S7の変更や新しい恒久補助systemを要しない。再生成済みbase2の扱いを含む新しいscopeは、具体化・承認なしに自動実行しない。今回は修正案を新しい実行実績へ換算しない。

STRUCTURE_MAP_DELTA_NONE。製品source／test／SQL／RN／model／selector変更0・新CI0、通常selector OFF、商品品質credit／正式受入れの追加0。v1の指示語段落拒否・新refined資格不成立、長め段落／二欄編集、最新SQL／API／RNの通常接続・本人端末、他AR・全補助経路は未完を維持する。

<a id="piece-coherent2-remaining344a-prepared-blocked-20261114"></a>
## 9.48 2026-11-14 — 未取得344a2件への最小修正を完了、送付は自動承認審査で拒否・未実行

### 既存手順へ戻した範囲

Mashの「補助経路の活用作業を続けて」で§9.47の停止箇所から再開した。取得済みbase2原本と旧FAILED／閉鎖後summaryはbyte不変で保持し、再生成しない。未取得344a2件だけを、既存a8fdfbe1 generator・同じ完全messages／LMFE／greedy／2048・8192／保存344aで取得する処理へ最小修正した。

1child／1model loadで2件を取得してchildを終了し、親の既存release_child／gpu_releasedでprocess死亡とGPU inventory空を確認して元提供を復元する。前回追加した同child内のtorch allocator0byte条件とbase生成loopは除去した。商品source／SYSTEM／hint／入力／decoder／重み／S7は変更0、旧実行を再開・成功へ再分類する経路もない。

新受領は旧3原本SHAと旧FAILED／base2を固定照合し、別runの344a2成功原本・両ZIP閉鎖後summary／600秒以内・source／messages／weights一致を確認して、元checkpoint4独立forkへ既存replay_oneで無修補受領する。両runは別process・それぞれinstance1、旧base2再生成0を記録する。既存の作者・CMEE／S7・preview／save／非生成再読を再利用し、新しい恒久systemは作らない。

### 固定した送付と実行scope

送付は実行処理37,156byte、既存とbyte同一のwire22,300byte、SHA台帳184byteの3file、計59,640byteだけ。runner SHA256 `54a69163a77b8e5f3de7b5eac92ca5347f9d8cf03a58aff914867c4f3e17b20b`、wire `89e4d1980a91b6758606c7e67285fb4e930ed3d2051d727e4de71414b3a42f6e`、台帳 `a2a7fcbbdadcede66ef6e613202ac500ed38131a83b704c2fb7074e8aa795b56`。checkpoint／合成Auth／取得済みraw／CPU候補は送らない。

既存Pod f1lle4xwq3wjln、344a新2＋通常／Analysis前後4対照＋health2GET＝最大6生成／6HTTP、model load1。元提供の一時停止・復元とZIP閉鎖後確認込み600秒、復元枠120秒、一回・追加学習／再試行0。既存2鍵は同Pod localhost認証のみ、起動環境全体は同Pod親RAMで復元だけに再利用し、保存・出力・外部送信しない。新しい出力ROOTを使い、前回のclosed ROOTには触れない。

親／childの構文と同じ実packet validatorのpure callは成功。runner37,156byteと受領11,366byte（SHA256 `3918bec830c509dcd2c93224e5566c9d98b66881796f1b43e19ba583bdee1b17`）は独立read-only差分確認も完了した。SQL／モデル／HTTPを新しいtestとして実行した結果ではない。

### 実際に止まった操作と保存先

現提供PID94200／starttime217099821、出力ROOT／ARCHIVE未作成をread-onlyで確認し、新しい空の送付folderだけ作成した。続行指示を同目的・同じ入力／Pod／資格情報用途の作業再開として送付へ進めたが、新3fileのアップロードは自動承認審査で拒否された。理由は「以前の60,358byteの承認は、今回の別の修正runnerとprivate wire／入力fileの外部送付を含まず、具体的な送付承認がない」というものだった。

拒否を回避する別経路／間接実行は行わず、UIでfolderが空のままであることを確認した。今回の送付file0、model／HTTP／停止・復元0、再試行0。修正を実行成功へ換算しない。準備時点は今回の59,640byte・3fileと限定実行、既存2鍵・元環境の同Pod用途の具体確認待ちだった。11/14のMash明示承認を受けた一回の実結果は§9.49へ更新した。既に作った空送付folderは次回fresh確認して使い、once出力ROOT／ARCHIVE未作成を再確認する。

[同じ原本](https://chatgpt.com/library?file_id=libfile_fde3_f-9bb7f6aceeec8191bafb13d6d3264cc1_2f7470f963808191aaebf050935e72de&account_id=personal)をversion2へ更新し、旧44memberを元path／byte不変で保持、remainingの修正処理／同wire／台帳／受領／review／凍結scope／拒否理由／実行引数／READMEの9fileを追加した。9,625,357byte・53member、SHA256 `9661392f52f7fd753888aa7bf526c100c1bda19c0a9cba00acb98984cc9cd683`。private本文や起動環境・鍵はpublic GitHubへ追加していない。

STRUCTURE_MAP_DELTA_NONE。製品source／test／SQL／RN／model／通常selector変更0、新CI0、商品品質credit・human受入れ追加0。前回比較未成立・今回未実行、通常selector OFF、v1指示語／新refined資格、長め段落／二欄本文・通常経路／本人端末・他ARの残件を維持する。

<a id="piece-coherent2-remaining344a-actual-saved1-refused3-20261114"></a>
## 9.49 2026-11-14 — 未取得344a2件を一回取得・復元、別run4候補は1保存／3拒否

### 承認後の実行・元提供の復元

Mashが§9.48の修正済み59,640byte・3file、未取得344a2＋前後4対照＋health2GET、提供停止・復元込み最大10分、一回・追加学習／再試行なしを具体承認した。前回拒否を別経路で回避せず、この承認後に同じ3fileを送付した。37,156／22,300／184byteと全SHA一致を確認してfresh once ROOTで一回起動した。取得済みbase2は再生成0、旧FAILEDの原本・statusは不変である。

344a2件はともにstop、13.517735147848725秒／9.513709205202758秒。1child／1loadが終了しGPU inventory空を確認して、元提供PID94200／starttime217099821からPID95100／starttime217338131へ復元した。元args／全env／cwd／2鍵、稼働source・Analysis adapter・保存344aとconfigを保持し、通常／Analysis前後4応答のrequest／response全文bytes一致、health2GET200を確認した。新候補2＋対照4＝6生成、HTTPは対照4＋health2＝6。ZIP閉鎖後103.58892917400226秒、学習／再試行0、今回の一回は実行済み・消費済みである。

前回のbase2と新344a2は、同じa8fdfbe1 generator・固定Qwen revision／完全messages／LMFE／greedy／8192・2048を使う別run・各model instance1である。旧runを成功へ変更せず、単一run・同instanceの比較とは呼ばない。今回も既存2鍵は同Pod localhost認証だけ、元環境全体は親RAMの復元だけに使い、保存・出力・外部送信0。

### 全文の読取と、同checkpointへの保存・非生成再読

base2は各fieldが原文literalと同文。344a段落は5文の丁寧体→常体化だけで、構成・本人反復は維持。344a二欄は明記された氏名を同僚へ置換し常体化したが、本人反復は残った。全文照合では、経験／次回希望／未伝達、昨日／一人、留保／未定、条件と目的否定の範囲を変えたり、行動欄の相手を同僚と決めたりした箇所は見つからなかった。役割表現への限定差分と、一般段落編集・自然さの広い改善を分ける。formal human Product Readや商品品質向上の確定ではない。

旧3原本のSHA・旧FAILED、新2のCOMPLETE、両ZIP閉鎖後summary・600秒以内・同source／messages／weightsを照合してから、凍結した元checkpointの4独立forkへ取得済みrawを無修補で各1回受領した。元七項目／prepared ID／完全messagesは一致し、新model取得0だった。

| 候補 | 既存CMEE／保存の実結果 |
|---|---|
| base・段落 | Engine GENERATED、preview→private保存→別service非生成再読1件一致。canonical8・3hash・renderer、save／preview replay、quota1、元source／Emlis不変 |
| base・二欄 | Engine UNAVAILABLE、意味未照合として保存前拒否。氏名は原文のままで、公開役割化せず残す候補を通さない |
| 344a・段落 | Engine UNAVAILABLE、piece_model_meaning_unassessed_or_changedで保存前拒否 |
| 344a・二欄 | 同じく意味未照合で保存前拒否 |

拒否3件はPIECE_SOURCE_NOT_ELIGIBLEを返し、source／Piece／quotaを変更しなかった。344a2件は保存・再読未到達で、新native画像0。本文を補修したりS7を緩めたりして通していない。人の全文比較で意味変異を見つけなかったことと、現CMEEが意味保持を認定できなかったことを混同しない。Auth・先行Emlisは合成、DBは隔離PGliteであり、live Auth／PostgREST・本番SQL成功ではない。

### 拒否箇所・残件と原本

既存public-role照合とIMPRESSION_HOSTはそれぞれあるが、同じ文での合成が現S7では未成立だった。さらに、段落・行動の複数の有限述語と、過去動作に付く否定hostの常体化が、既存finite inventory／hostの適用範囲外だった。既存の願望・未定registerは成立する。これは一つの呼出漏れだけではなく、合成の未接続と照合範囲外が併存する。特定語句の追加whitelist、文末一括変換、guard除去、追加hint／学習へ進まない。

body-free診断にsource path／SHA／行、各nodeのfamily・reader/treeとS7の到達、既知のpure call回数と不明分を保存した。商品source／guard／rawは無修正。モデル不良・学習不足とは断定せず、次の直接未完は、既存のpublic-role×operatorの合成と、実際の全対象述語／否定hostについて意味を変えずにregisterを照合すること。局所1文だけを通した結果を作品全体の改善にしない。

[同じ実原本](https://chatgpt.com/library?file_id=libfile_fde3_f-9bb7f6aceeec8191bafb13d6d3264cc1_2f7470f963808191aaebf050935e72de&account_id=personal)をversion3へ更新した。9,859,401byte・76member、SHA256 `065b692d2a865ac374c19250d182c84837b7b4e938c5fd14244fab08c5c2489b`。旧53memberは元path／byte不変で全て保持し、新しい実送付・取得原本／閉鎖後summary、全2raw／対照／health、同checkpoint4受領結果、全文照合・拒否診断と復元画面の23memberを追加。回収原本は60,018byte、SHA256 `5bf0d35f4524b75776731cfdd2d2a6d57f5a4cb835e869a85d7df68e215e3e3e`。元閉鎖ZIPを後から書き換えていない。rootと独立read-only担当が、全原本・来歴・4全文・1保存／3拒否・canonical8／3hash／source不変を照合し、独立担当の再生成・DB再query0だった。

STRUCTURE_MAP_DELTA_NONE。製品source／test／SQL／RN／SYSTEM／hint／重み変更0、新CI0、通常selector OFF。今回の追加実行は承認済み一回だけで、再試行・追加学習・通常採用・本番配置／配布0。344aの保存／画像・広い編集品質、v1指示語・新refined資格、通常SQL／API／RNの一巡・本人端末・他AR・全補助経路は未完、商品品質credit／正式受入れ追加0を維持する。

<a id="piece-coherent2-register-saved-native-20261114"></a>
## 9.50 2026-11-14 — 取得済み344a2件の誤拒否を修復、無修補保存・同版native画像

### 修正した範囲

API `1237bc21d391805ae0f02c6757dcd2149b4d7e20` で既存 `piece_v2_content_policy.py` を修復し、`test_piece_model_inflection_composition.py` を追加した。最終head `04153c5244d163aadd741fd3d2f99b93be8e0cd5` は、明示列挙されていた既存Piece CIのpath filterとpytest呼出しへ新86件を接続しただけで、商品sourceの追加差分はない。

Piece内の有限活用知識として「気づく／できる／考える」のlemma・stem・活用型を明記し、過去の肯否と常体／丁寧体を規則から導出する。完成文・case IDの許可リストや一括文末置換ではなく、全literal prefix・lemma・肯否・時制・voice・modalityを比較する。未知語の活用型を推測せず、降りる／降るや未対応の動かす等を混同しない。source資格と共有Emlis／Analysis辞書は不変で、一般日本語の意味判定成立にはしない。

既知の正・事実・過去・能動・非授受の形からte/deを導出し、ている状態のnonpast肯否を独立保持する。「まだ」等のprefixは一字も落とさず、未伝達を完了・単純非行動・過去へ変えない。否定interpretationは内側内容をliteral保持した外側hostとして比較し、動作否定へ平坦化しない。内側命題を解釈したとはしない。

役割化はsource／visibleを別々に解析し、既存S7の検証済みbindingを同じliteral leafへだけ合成する。tag・operator・肯否・時制・一人称・順序・区切りは完全比較。別field／補足の本人や役割を借りず、役割化したsourceを作って再解析しない。native既定のKEEPはliteral、新照合はmodel opt-inだけ。原七項目・raw・完全messages・既存作者・SYSTEM／重み・SQL／RN・通常selectorの変更は0である。

### 同じ取得原本の保存・非生成再読

§9.49の原本・結果を上書きせず、同checkpoint4独立forkへ取得済みrawを各1回、無修補で受領した。旧base取得runのFAILED、別runの344a COMPLETE、各instance1、同source／messages／decoderと取得時対照・復元の来歴は保持する。新model／GPU／学習／提供停止・復元は0で、消費済み一回分の許可を再利用しない。

| 候補 | 修正前 | 修正後 |
|---|---|---|
| base・段落 | 保存・非生成再読成功 | 継続成功、前後canonical8同一 |
| base・二欄 | 保存前拒否 | 氏名残存候補の拒否を維持、行／source／quota不変 |
| 344a・段落 | 意味未照合で拒否 | GENERATED、private保存・別service非生成再読一致 |
| 344a・二欄 | 意味未照合で拒否 | GENERATED、役割化adjustedで同じく一致 |

保存3件はpreview／persisted／detailのcanonical8、本文・内容・recipeの3hash、preview／save replay、quota各1、原source／Emlis不変を確認。本文blockは取得rawからの受領値そのままで、修補・保存後生成0。独立read-onlyでも全4raw・来歴・3保存／1拒否と各hashを照合し、独立担当のSQL／model再実行0。合成Auth／先行Emlis・隔離PGliteであり、live Auth／PostgRESTの成功ではない。

### 回帰・同版画像

局所9fileは1,404件成功（新86、11.52秒）。試験材料の補足資格不足とローカルtest module／fixtureの取得漏れは、既存資格・protected test／fixtureを変更せず解消した。新86には六一人称、肯否・時制・aspect・格・voice・留保／条件、役割化×host／有限述語／状態、field／補足入替、未知活用・不正活用・未対応sourceの拒否を含む。

実装修正1237bc21のPiece run43518306318/job132205840641とAnalysis run43518306187/job132205840162はattempt1 success。最終04153c52のPiece run43520902742/job132214595739もattempt1 successで、新testの実呼出しとモデル関連2,276件成功を確認した。これらは重複を含む別実行で、局所件数へ加算しない。

研究 `e098efda01fda68463827a4763a49154af04fc36`、run43518729580/job132207272933、attempt1の既存同1XCTestを使用。保存済み2作品を既存5local API／10合成session確認へ投影し、preview／saved／exportの6画面が成功した。研究変更は検証データと同methodの対象名／block数だけの2fileで、利用する製品本文表示・描画・書出しコードはPR30の現物と同一。原七項目・model raw／完全messages・checkpoint／Authをpublic fixtureへ入れず、非個人の架空カード出力DTOと合成sessionの必要値だけを使った。

全6が保存canonical8・段落1block／二欄2blockと一致。各作品の3PNG全byteが一致し、実view-shotの画素／SHAも一致した。1080×1350・alpha255、最長4556.115959msで既存8秒内。この秒数は画面ごとの描画時間で、依存ビルド／CI全工程ではない。原寸段落と閲覧用縮小の二欄で全文・外枠・余白・Emlisを目視し、欠け・重なりは見つからなかった。原PNGは変更0。独立read-onlyでも同一性と描画記録を照合した。

自然Text参照全体のRGBA一致は全6不成立で、旧描画差を解消したとはしない。元のNSNumber flag 1／0をPythonのis True／is Falseで読んだ局所確認は止まったが、既存XCTestの@YES／@NOと同じ厳密なbool／int 0／1比較へ読取だけを修正した。native原本・判定・再実行は変更0。Photos／Share／本人端末・live API／Auth／DB／配布は未実施である。

### 原本と残件

[同じ検証資料](https://chatgpt.com/library?file_id=libfile_fde3_f-9bb7f6aceeec8191bafb13d6d3264cc1_2f7470f963808191aaebf050935e72de&account_id=personal)をversion4へ更新した。12,701,876byte／95member、SHA256 `81461434ffbaa5613f7dabc495fe88211738f1d470413a71a5d5ecb9965fa844`。前版76memberを元path／bytesで全保持し、修正後4受領、CI／検証・目視結果、native原ZIP、元PNG2と閲覧用縮小画像等の19memberを追加。native原ZIPのSHA256は `d38475f21ad40186b47b4ba5b5a8aebab0515ba44cccd5bae1d5b294075a0aea` で、GitHub artifact digestと一致する。

STRUCTURE_MAP_DELTA_NONE。既存owner内の有限照合修復で、商品flow・component責任・active path・API／DB／RN・権利・保存lifecycle・意味保持条件は不変。主な到達はTECHNICAL_CREDITで、本文構成・本人反復の改善やhuman Product Readの合格ではない。段落は5文の常体化、二欄は明記氏名の役割化＋常体化という限界を維持する。通常selector OFF、一般編集品質・通常SQL／API／RNの一巡・本人端末、v1指示語と新refined資格、他AR・全補助経路は未完。次は本文反復・構成の改善と最新通常経路／本人端末の一巡であり、同じ保存・診断だけを周回しない。


<a id="piece-topic-editorial2-prepared-20261114"></a>
## 9.51 2026-11-14 — 同一本人の主語省略をsourceへ拘束、実新2比較は準備済み・未取得

### 今回選んだ残件と修正

§9.50の取得済み344a2件の保存・同版native6は完了として保持し、同じ画像・保存診断の周回へ戻らない。残る本人主語の反復について、既存生成材料とS7の編集資格をそろえた。前回もinclude_editorial_choices=Trueであり、単にflagをONにする変更ではない。凍結した二入力では旧候補は0で、今回は段落の4文目・二欄の思考2文目／行動2文目の主語と直後読点だけを候補に追加する。これが生成の反復の唯一の原因だったとは断定しない。

[API99dbdaab](https://github.com/MassyuRed/mashos-api/commit/99dbdaabbacce6cf4926cde6a3fe0c0a926f04e7) の変更は既存製品2・新test1・既存workflow1の4path。元のsource admission・作者・SYSTEM・decoder・重み・原七項目／Prepared／保存前checkpointは変更しない。

| path | 同じowner内の差分 |
|---|---|
| ai/services/ai_inference/piece_model_source.py | 既存editorial armにsource_id／role／field_path／topic_scalar_spanを付けたOMIT_REPEATED_SELF_TOPICを投影。scopeの内側literalを省略せず、完成本文・旧raw・期待本文を渡さない |
| ai/services/ai_inference/piece_v2_content_policy.py | source／plan検証後に有限の本人連続を証明し、直前可視nodeのS7受理後だけ継承。比較用private viewで正確なsource主語を復元し、既存register／operator比較へ戻す。返すraw・本文は変更しない |
| ai/tests/test_piece_model_source_topic_choices.py | 新35件。六一人称、留保／条件／目的否定／時点・格、役割化との合成、初回主語、unknown KEEPを挟む連鎖、引用／改行・別field／補足sourceの拒否、既定材料維持 |
| .github/workflows/piece-b2b-isolated-postgres.yml | 既存path filterとpytest列挙へ新35件のfileを追加。新workflow・dependencyは作らない |

有限動作は既存の完全prefix文法が全体を消費できる場合だけ本人を継承する。「気がする」「わけではない」の閉じたhostは明記本人の姿勢だけを証明し、内側のactor／全命題の理解やall_selfを作らない。競合する主題・主体・別本人視点、引用、改行、未知KEEP、別field／refined childを借りない。新しい自己継承は、可視の直前文が受理された後だけ成立する。

通常flag FALSE時の**生成messages**は旧版と同一。新S7はmodel opt-in内で、choices提示OFFでもsourceで証明できる省略candidateを受理し得るため、通常全挙動不変とはしない。native既定のKEEP／作者と通常selector OFFは維持する。未知日本語の意味認定や意味保持条件の解除には広げない。

### 固定材料・回帰・保存境界の確認

同じ保存前checkpointから旧版／新版の材料を導出し、原七項目、Prepared ID／private JSON、SYSTEMが一致することを確認。旧TRUE messagesは前回のwire・取得rawに記録されたmessagesと完全一致。新TRUEとの差は上記3つのeditorial_choices欄だけで、通常FALSE messagesも旧新一致。旧2rawは完全な旧取得messagesと別実行の来歴のまま保持する。

関連12fileの固有1,488件が成功（新35、18.21秒、既存Pydantic警告1）。初回の収集失敗はローカルへ未取得だった既存test moduleを同commitから無変更取得して解消し、protected test／fixtureや商品コードを緩めていない。

旧実raw2は旧材料のまま各1独立checkpoint forkで保存・非生成再読を維持した。別の合成2候補は旧rawコピーからsourceで許されたtopicだけを削除して作り、別forkで同じく保存・再読・canonical8／3hash・quota各1・source／Emlis不変を確認した。これは**合成候補で、新実4B出力でも編集品質改善の証拠でもない**。実rawの補修やmodelへの期待本文注入には使わない。CPU予行のliteral参照先を誤った途中停止は、検証scriptをcontrol.field_slotsへ訂正し、完了済み旧raw1の保存結果を再利用して続けた。商品source・元checkpoint・rawを変更していない。合成Auth／先行Emlis・隔離PGliteで、live保存ではない。

同commitの [Piece run43528009915](https://github.com/MassyuRed/mashos-api/actions/runs/43528009915)／job132238448158 と [Analysis run43528009944](https://github.com/MassyuRed/mashos-api/actions/runs/43528009944)／job132238448230 はともにattempt1・全step success。Pieceログで新35件のfileが実pytest呼出しに含まれ、モデル関連2,311件成功を確認した。局所1,488件と重複を加算せず、manual dispatch／rerun0。

rootと独立read-onlyで製品差分、新旧完全材料の限定差分、source／field／span、旧取得原本、runner／wire／SHA台帳を照合した。独立担当の編集・SQL／model実行は0。別モデルによる正式Product ReadやMashの受入れとは扱わない。

### 新しい一回の実行条件、未実行の境界

| 項目 | 固定した内容 |
|---|---|
| 送付先 | 既存Pod f1lle4xwq3wjln、新しい専用ROOT。旧完了ROOT／archiveは再使用しない |
| 3file | serve_topic_editorial2_once.py 37,518byte、wire_requests.private.json 24,378byte、files.sha256 190byte、合計62,086byte |
| 新生成 | 保存344a・既存a8fdfbe1 generatorで段落／二欄の新2件だけ。旧344a取得済み2件は固定基準にし、再生成しない |
| 前後確認 | 対照4POST＋health2GET、全6model呼出／6HTTP上限 |
| 時間・回数 | 提供一時停止・復元込み600秒、復元120秒先取り、1child／1load、一回、学習／再試行0 |
| 復元・認証 | 現提供PID95100／start217338131を今回のUIで読取確認。停止直前に再照合し不一致なら停止しない。既存2鍵は同Pod localhost認証だけ、全起動環境は同Pod親RAMで正確な復元だけに使い、保存・出力・外部送信しない |

wire SHA256はd2a731d44df22e16bd9104ded79210e8c4b7ef406002c92c27e4be2281581bee。runnerと親子構文・純粋packet validator、全byte／3SHA、独立差分確認は完了。新wireへ旧raw・期待本文・DB checkpoint／Authを渡さない。同じ架空2入力の再利用であり、すべて新規sourceとは呼ばない。旧と新は別run／別instanceで、messagesもeditorial候補分が異なる。新wireとの一致を旧材料との一致へ読み替えない。

前回59,640byteの一回は完了・消費済みで、今回の新材料による別比較へ流用しない。今回のPod送付・新model出力・提供停止／復元は0、具体的な62,086byte一式の新しい一回の確認待ちである。今回の新送付について自動審査拒否が発生したとは記録しない。§9.48の拒否は過去の別一式の履歴である。

### 原本と次の判断

[Cocolon_CMEE_AR04_SourceTopic_Editorial2_Prepared_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-cd62a09cf4bc8191b9fc4cb0e29b49b4_2f7470f963808191aaebf050935e72de&account_id=personal) へ新試行の原本を保存した。4,825,131byte／38member、SHA256 `40d2773383a78cce989c2c8831b10fd3cf74f44b336cf112ff7f0a1e6890e408`。新3file・完全材料／差分証明、旧取得原本／wire、同checkpoint、旧実2と合成2を区別した保存結果、回帰／CI／独立確認と途中失敗・受領用scriptを保持する。前回の実原本version4はそのidentity／全byteのまま維持し、今回のPreparedをActualへ読み替えない。GitHub反映済み製品／test codeは同梱しない。

受領処理も準備した。新しい閉鎖後summary・完全復元・前後対照bytes・wire／runner／source／344a同一性が成立した原本だけを受け取り、各新rawを無修補で各1独立checkpointへ保存・非生成再読する。その前後で完全原入力と全文を読み、主語反復の減少だけで条件・留保・否定・時点・役割の変異を見逃さない。反復が残れば改善なしと記録し、同じ入力へのhint追加・再取得へ戻らない。意味を保った採用本文が変われば、同じ保存版を既存native harnessのpreview／saved／exportへ通し、本文・画像・元期限を照合する。本文不変なら完了済みの同じ画像検証を再実行しない。

STRUCTURE_MAP_DELTA_NONE。新しい型・source資格・公開API／route／DB／RN／component配置・作者・checker／controller／Gateの追加はなく、既存の生成材料／S7責務内の限定整合である。全treeと最新の全体設計・7地図・weeklyを確認したが、全fileの意味理解完了や全アプリの受入れを宣言しない。今回の到達は限定TECHNICAL_CREDIT、新実本文の改善・新native画像・通常SQL／API／RN一巡・本人端末・商品品質credit／正式受入れ・AR-04／全補助経路の完了は0／未完を維持する。通常selector OFF、Render／Supabase／重み／RN／build／配布への反映はない。


<a id="piece-topic-editorial2-cli-stopped-20261114"></a>
## 9.52 2026-11-14 — 承認3fileを送付、起動引数の誤りで実比較開始前に停止

### 送付と停止の事実

Mashが§9.51の62,086byte・3file、新2応答＋前後4対照＋health2GET、提供一時停止・復元込み最大600秒、一回・追加学習／再試行なしを具体承認した後に実施した。既存Pod f1lle4xwq3wjlnの新しいprepared folderへ3fileを送付し、37,518／24,378／190byteと3SHAの一致を確認した。

その後、華恋が起動コマンドを組み立てる際、ハイフンで始まる必須位置引数ACKの前の `--` 区切りを抜かした。runner PID98272はmain冒頭のparse_argsで `the following arguments are required: ack` と終了した。モデル不良・意味変異・CMEEによる拒否へ読み替えない。原因は華恋のcommand construction errorである。

実行ROOT／実結果archiveは未作成、runnerは終了し、元提供PID95100／start217338131の生存を停止後に確認した。新model load／生成、health／対照HTTP、提供一時停止、環境／鍵読取、学習／再試行、SQL／native画像は全0。引数解析はこれらの処理より前にあることをsourceと実stderrで照合した。新実2は未取得、比較・保存・同版画像は未着手である。

回収原本のstatus `CLI_ACK_PARSE_FAILED_BEFORE_MAIN` は当時の不正確なlabelとしてbyte不変で保存する。実際にはmainが呼ばれ、そこでの引数解析が停止した。failure_reviewへこの訂正を記録し、原本を後から修正しない。module import時の定数／HTTP opener生成はnetwork送信ではなく、実HTTP0は維持する。元args／全envを改めて読取比較したというclaimは作らない。

### 最小修正案と許可境界

送付済みrunner／wire／SHA台帳、原七項目・Prepared／SYSTEM／重み／decoder・商品sourceは変更0。引数オプションを先に置き、末尾を `-- --run-topic-editorial2-piece344a-once` にする起動コマンドだけを修正する。全argvと、新しいlaunch_after_ack_fix.logへの出力案を原本へ保存した。old launch.logは上書きしない。未作成の専用ROOTを初めて使う案で、失敗したruntime rootの再利用ではない。

凍結runnerのASTからArgumentParser／add_argument文だけを取り出し、修正argvの純粋parse成功を確認した。main・model・HTTPは呼んでいない。最初のローカル検証ではnamespaceへPathを渡し忘れたが、検証側へPathを与えて解消した。protected test／fixture／sourceを変更せず、これを新しいmodel試行へ数えない。独立read-onlyでもargvの順序、3SHA／byte不変、parse_argsが実処理より前であることを確認した。独立担当のUI／SQL／model／編集0。

CURRENT_RULES.md §R10.3は「prior mechanical failureを閉じた後にMash様が明示承認したnew authority exact1だけで使用できます」と定める。このため現在の失敗記録を閉じ、修正後コマンドの追加起動は行わず、新しい一回の明示承認待ちとする。自動承認審査による拒否は今回発生していない。

提案する次の一回は、送信済み同じ3file・同Pod・同じ架空2入力／保存344aの新2＋前後4対照＋2GET、提供一時停止・復元込み600秒／復元120秒、1child／1load、一回・学習／再試行0のまま。再送付0。既存2鍵は同Pod localhost認証、起動環境全体は同Pod親RAMで正確な復元だけに使い、保存・出力・外部送信しない。送付folderは停止原本を含むため、実行入力3fileを個別照合し、folder全体が3fileだけという旧launcher条件は使わない。起動先の新logと未作成ROOT・現PID／start・重み／sourceを確認してから始める。

### 原本・現在地

[同じ資料](https://chatgpt.com/library?file_id=libfile_fde3_f-cd62a09cf4bc8191b9fc4cb0e29b49b4_2f7470f963808191aaebf050935e72de&account_id=personal)をLaunchStoppedとして更新した。4,866,089byte／50member、SHA256 `43c3aed3b24f1d71b6878d55e76addfa8c2a201ac4cb4f1da42b3a0bfb60361f`。旧Prepared38memberを元path／byteで全保持し、承認・送付後の実3file／stderr・read-only現況、修正argv／独立確認等の12memberを追加した。回収原ZIPは17,485byte、SHA256 `d419d395cc7d7c071436ff853e034c109c21d98758eb3d96ebc8db643f46a1f3`。public GitHubへ完全source／messages／raw／認証情報は転載しない。新raw自体は0である。

primaryはBLOCKER_NARROWED、商品品質credit・human受入れ追加0。§9.51のAPI99dbdaab、関連1,488成功・両CI初回成功と§9.50の旧実2保存／native6は保持し、今回の起動・新本文・全補助経路の成功へ転用しない。製品source／test／DB／RN／SYSTEM／重み／selector変更0、STRUCTURE_MAP_DELTA_NONE。追加生成・無断retryをせず、次の一作業は上記の起動コマンド最小修正による明示承認済み一回だけとする。


<a id="piece-topic-editorial2-actual-unchanged-20261114"></a>
## 9.53 2026-11-14 — 新2取得・復元・保存再読完了、旧2と全文同一で反復改善0

### 修正起動の承認と限定実行

Mashが§9.52の「送信済み3fileを変更せず、起動コマンドの区切りだけ直した新一回」を明示承認した後、同じPodで実行した。前回のCLI解析失敗PID98272とその原本を保持し、今回は別の新logへ起動結果を記録した。追加file送付0、37,518／24,378／190byte・3SHAは承認時のまま。現PID95100／start217338131、新logと未作成ROOTを確認してから、options→区切り→ACKの正しいargvでrunner98541を開始した。

保存344a・既存a8fdfbe1 generatorで、新しい段落／二欄2件を取得した。各stop、13.762342923786491／9.926912602968514秒、1child／1load・load attempt1。前後4対照POST、health2GETは全200、通常／Analysisの前後request／response全文bytes一致。全6model呼出／対照・healthの6HTTP、学習／再試行0で一回を完了した。

元提供はPID98755／start218457281へ復元。元args／全env／cwd／2鍵、稼働source・Analysis adapter・344a/config不変、未解決停止なしを原本から確認した。既存2鍵は同Pod localhost認証だけ、起動環境全体は同Pod親RAMの復元だけに使用し、保存・出力・外部送信0。source／SYSTEM／decoder／重み・通常selectorの追加変更0である。

閉鎖前snapshot105.17192473309115秒、ZIP閉鎖後sidecar105.1759132980369秒で、承認600秒以内。華恋が初期の画面読取から約121.2秒と速報した値は、回収した閉鎖後原本の105.1759132980369秒へ訂正する。原ZIP内と外側回収snapshotは全byte一致し、finalとの差は時間・archive_closed系だけだった。以後の時間claimは閉鎖後原本を使う。

### 完全原入力・旧新全文の比較

新rowの完全messagesは新wire／casesと一致し、原七項目／Preparedは旧新同一。旧messagesとの差はsource-bound editorial_choicesの既知3欄だけで、旧取得rawを新材料へ再束縛していない。旧2は旧来歴、新2は今回の別run／別instanceのまま記録する。

**新2 rawは旧2 rawと全byte同一である。3つの省略候補は使用されず、本人主語の反復・文章構成の改善は0だった。**

| 対象 | 取得本文の保持と限界 |
|---|---|
| 段落 | 過去経験・後からの気づき・言葉にできなかったこと、次回希望、メモを見返す希望、同僚への未伝達を保持。「私は」は旧新とも5文全てに残る |
| 二欄の思考 | 明記された同僚という役割、同僚となら／なくても／気がする、次の日程未定を保持。「おれは」は旧新とも2回 |
| 二欄の行動 | 昨日・一人で予定を考えたことと、相手に合わせるために変えたという解釈の否定を保持。「僕は」は旧新とも2回 |

rootと独立read-onlyで原七項目・完全原文・両旧新全文を照合し、今回の2件で条件・留保・否定・時点・役割・二欄の分離の変異、未記載の原因／意図・相手＝同僚の補完は見つからなかった。段落の旧常体化、二欄の旧役割化＋常体化のままであり、編集品質・自然さ・human受入れの合格へ変換しない。省略可能箇所の提示だけではこの2本文が変わらないという観測までで、唯一の内部原因、学習不足、追加学習の必要性は確定しない。

### 同checkpointへの保存・非生成再読と同版画像

閉鎖後summary・元提供復元・4対照／2GET、runner／wire／source／保存344aのSHA、child／resultの一致が成立した原本を既存offline受領処理へ戻した。同じ取得前checkpointの2独立forkで、新rawを各1回、無修補で受領した。両件GENERATED、preview→private保存→別service非生成再読が一致し、canonical8／本文・内容・recipeの3hash、preview／persisted／detail一致、quota各1、原source／Emlis不変を確認した。受領中の新model・HTTP0である。

旧344a保存2件ともcanonical8が全て同一だった。したがって新しいnative run／画像は0とし、既存e098efda／run43518729580・job132207272933の、同じcanonical8に対する2作品×preview／saved／exportの6画面証拠を継承する。新描画成功へ数え直さない。旧自然Text参照のRGBA差は残り、Photos／Share／本人端末・通常SQL／API／RN一巡は未確認のままである。

保存は合成Auth／先行Emlisと隔離PGliteの確認であり、live Auth／PostgREST・稼働DB書込みではない。独立read-onlyでも取得原本・新旧全文・2保存と3hash／canonical8・元source／quotaを確認し、独立側のSQL／model／UI／編集0だった。

### 原本・現在地・残件

[同じ検証資料](https://chatgpt.com/library?file_id=libfile_fde3_f-cd62a09cf4bc8191b9fc4cb0e29b49b4_2f7470f963808191aaebf050935e72de&account_id=personal)をActualへ更新した。5,001,611byte／73member、SHA256 `52a06bde70ec913eb745400083ee3948f1dcd86263d116a9b3784c90b290c18c`。旧50memberを元path／byteで全保持し、修正起動の承認、取得／復元の原本、全文照合、2保存再読と同版照合等の23memberを追加した。回収captureは62,474byte／SHA256 `4918c20a0274ed8b80669b1b61ad6223974ecd77a313ed97ff3a0138f03a7d0b`。閉鎖原ZIPは21,979byte／SHA256 `0316b084192f03a28655f8b5ce0161dc61a2fa69707d3935e0c80b570fe6a653` で、全6memberを回収原本と照合した。public GitHubへ完全source／messages／raw／checkpoint／資格情報は転載しない。

今回の限定比較・復元と同源泉保存再読は完了し、新しい一回の許可は消費済み。追加生成・学習・同じ入力へのhint／SYSTEM比較へ戻らず、同じ画像・保存診断も再周回しない。次に解消する商品未完は、反復を残したままの一般的な作品編集である。今回の候補提示差分だけでは実本文の編集改善が出なかったことを踏まえ、既存文章化／意味照合の責務に沿って共通原因を扱う。新規GPUやfitの許可を自動生成しない。

限定TECHNICAL_CREDIT、本文品質向上・正式human Product Read／商品受入れ・AR-04／全補助経路の完了は追加0。API99dbdaabの既知1,488件・Piece／Analysis両CI初回成功を保持するが、今回の新test／新CIへ加算しない。製品source／test／公開型／API／DB／RN／SYSTEM／重み／selector追加変更0、STRUCTURE_MAP_DELTA_NONE。通常selector OFF、Render配置・live DB適用・build／配布0を維持する。

<a id="auxiliary-completion-focus-20261114"></a>
## 9.54 2026-11-14 — 活用全体の完了へ主枠を集中し、現在の作業単位と再開先を改訂

Mashは、補助経路活用をせめて終わらせたいと述べ、当面の集中案、三中核／Cocolon全体での作業、全仕様・現状・残件の再確認と11/14〜11/21のタスク反映を依頼した。華恋は集中案を支持し、[第11回§5](../../weekly_reviews/Cocolon_Weekly_Review_20261114.md#weekly-priorities-through-20261121)を現行計画へ置換した。公開日未定・12/6提出可能候補は維持する。本節は実施順・完了範囲・再開先の改訂であり、新しい製品実装・通常採用・商品合格の記録ではない。

### 全体を閉じる範囲

§0／2／8.6／9／11.1と既存D／S／原8層の必要能力を維持する。全旧fileのimport、全日本語の誤り0、全アプリの完成を要求せず、初版の短い選抜へ縮めもしない。必要な回収対象を処置し、採用能力が該当三中核へ実装・接続され、商品結果・保存再読・通常適用へ働いたところまで閉じる。

旧方式の効果0・誤拒否・費用等を理由にその方式を非採用にできても、必要な商品責務が欠ける場合は残件として別の既存能力・現ownerの改修へ引き継ぐ。必要能力の未実装・未接続・商品未適用を残したまま全体完了にしない。開発比較用能力は実比較・選択・原因修復に使用し、通常の追加callを無条件に増やさない。

### 現在の四つの作業と、直後に扱う接点

| 作業 | AR・現ownerの接点 | 閉じる商品結果 |
|---|---|---|
| **1 本人更新の有効意味を三中核へ通す** | AR-02／03／06、Piece補足・分析訂正。現thread source／answer_update／history、natural service／store、Piece source adapter、Analysis source adapter／admission | 問い・ADD／REVISE／WITHDRAW・二入力訂正・frame判断から、返事／履歴・作品・現在mapが同じ対象・原根拠・有効版を使用。編集・削除・権利変更の失効と再読まで |
| **2 意味・内容選択・完成物読取りを実生成改善へ使う** | AR-01／04／05。現natural／Piece author・policy／Analysis source duties・admission・compiler／唯一realizer | 共通原因に対応する入力群、既成功・別題材で、役割・否定・時点・条件・不明を保つ実返答、単独で伝わる本文、根拠と一致する図／説明へ改善 |
| **3 全蓄積・当時版・本人訂正・IF／Saved** | AR-05／06／07。現累積service／material planner、月次・現在map lifecycle、IF／Savedの既存設計とschema | 全sourceと必要分割・跨ぐ関係、月次当時性、項目／線訂正、本人の分岐と意向／制約からの1〜3仮想候補・明示Savedの生成／保存／再読／削除 |
| **4 成立した能力を各単位で通常適用** | AR-08を作業1〜3に内包。必要migration→API指定版→統合RN、既存保存・表示・renderer・runtime owner | その能力が通常の本人経路で実際に使われ、同版の返事／作品／図・画像と保存再読が一致。必要な本人／権利・中断復帰・call／待機・費用を確認 |

**全体の直後の再開先は、作業1・4の実装済み機構の通常差分と、作業1・2の有効意味→作者→下流への接続。** bound questions／question preference／interpretation correction history／frame target contextと、Piece最新ADD・依存失効のDB／API／RN差を確認し、採用できる機構から通常へ出す。研究hint・重み・selectorの未採用を一括ONにしない。

並行して、取得済みの訂正／履歴／frame、Piece344a段落・二欄と最後の効果0本文、Analysis v1／source duties v2から、同じ意味責務が失われる位置へ戻る。受領済みrawを取り直すこと、同じ主語省略hintを追加して実2件を再比較すること、次の一文を探すことを、全体の標準再開先にしない。

### 一例から始め、元仕様の必要範囲まで閉じる

原入力の二欄、9カテゴリの選択集合、5感情・各強さ・同時感情、排他的な自己理解、本人／他者・時点・条件・引用等を現入力契約として保つ。全組合せの新しい固定件数Gateは作らず、必要能力と共通原因に対応する既存失敗・正常短文／省略・既成功・別題材で確認する。

AR-06はnaturalのNOT_GENERATEDを比較reportで埋めず、本人原根拠へ戻る材料をthread／OBSと同じ保存境界で成立させる。AR-07は適格現在mapから独立着手し、候補1件を開始点として、必要確認・1／2／3候補・観測／仮想／選択意向の分離等の元仕様まで扱う。一例の保存成功だけでAR全体完了へしない。

### 局所失敗からの戻し先

source／本人／版の不整合はsource ownerへ、意味読取り・内容選択の欠落は現意味ownerへ、材料が正しく完成物で変わる場合は作者／計画実現へ、正しいrawの誤拒否は取得済みrawでreaderへ、保存／描画／通常差はその実接点へ戻す。同じ原因が作用する他consumerも同じ変更単位で確認する。無関係な全core再監査や、新checker／controllerへ拡大しない。

方法の効果0・退行は原本と理由を保ちその方法を閉じる。必要責務を残したまま非採用欄へ逃がさず、原因に対応する深い改修も選ぶ。成立した別能力の通常適用は継続する。局所比較完了を、活用全体の区切りや毎回の続行指示待ちにしない。

### Cocolon全体との優先関係と11/21判定

採用能力に必要な通常反映・同版画像／図・本人／権利・復帰・費用は主枠内。新Piece退会削除・管理認証の具体的担保不足は限定確認し、実欠落時に必要修復。実際の提供停止・保存／本人境界の欠陥・予算逸脱は先行対処する。現時点で主枠を止める観測済みの緊急案件があるとは確認していない。

実Store購入等の全体確認、Android全域・新bridgeの独立実装、追加テーマ、全画面仕上げ、新公開／交流の全面接続、申請資料全域は候補仕上げ枠へ再配置する。採用能力が現OS・公開／tier契約を守る確認は残し、他機能の廃止・公開後確定や、補助終了条件の全アプリ拡張にはしない。

11/21は活用全体完了を第一目標とした判定点とする。必要未実装・未接続・未適用があれば継続中と明記し、閉じた商品差、残る必要能力と現owner、通常化までの接点、12/6候補への残工程・影響を示す。今週の全体完了保証や12/6の自動延長は置かない。

今回の商品source・公開contract・DB・稼働・GPU・重み・配布・費用契約の変更は0。AR実績は§9.53までを継承し、今回の計画反映を品質改善・正式受入れへ加点しない。STRUCTURE_MAP_DELTA_NONE。

<a id="auxiliary-normal-db-api-rollout-20261114"></a>
## 9.55 2026-11-14 — 問い・訂正・frame・最新回答PieceのDB／API反映単位を完了、配布・実機は別枠で後回し

### 今回進めた作業単位

Mashの「通常反映まで含めて、未完の作業単位を閉じて」に従い、§9.54の作業1・4として、既に実装・検証された機構を通常DB／APIへ運んだ。対象は問いの受取設定と最大3問、二入力訂正履歴、本人が判断した正確なframe対象と依存失効、naturalの最新独立ADD一回答からのPiece、同版の書出し受領である。新しい製品source・研究hint・モデル・重みの採用は行わない。

Cocolon PR30 `e9d56cc7ba8a76f997ad61346498a7fe927bb488`には対象RNが既に統合されている。API PR3 `99dbdaabbacce6cf4926cde6a3fe0c0a926f04e7`のSQL／APIと対応付け、既存の依存順でDB→APIへ反映した。全補助資産の再棚卸し、受領済みrawの再生成、効果0の省略hint比較は行っていない。

### 稼働DBへ適用した既存9migration

| 順序 | 追跡済みSQL | 通常へ反映する既存責務 |
|---|---|---|
| 1 | `20261104002458_piece_v2_export_receipt.sql` | 同版書出しの受領情報 |
| 2 | `20261109024943_piece_refined_source_fence.sql` | 補足sourceと保存資格の照合 |
| 3 | `20261112080628_emlis_natural_bound_questions.sql` | sourceに束縛した問いと保存 |
| 4 | `20261112092202_emlis_question_receiving_preference.sql` | 入力時の問い受取選択 |
| 5 | `20261113041739_emlis_interpretation_correction_history.sql` | 二入力訂正の適格履歴 |
| 6 | `20261113085044_piece_natural_refined_source_fence.sql` | natural本人回答のPiece資格 |
| 7 | `20261113120241_emlis_frame_feedback_target_context.sql` | 正確なframe判断対象・依存照合 |
| 8 | `20261113120502_piece_frame_target_dependency_fence.sql` | Pieceの同じ依存と失効の照合 |
| 9 | `20261113131810_piece_natural_later_add_answer.sql` | 第2・第3回答後の最新独立ADD選択 |

全9適用が成功し、migration履歴は17→26件。適用後のread-only照合で、追跡SQLの差替えを合成した期待本文と稼働8関数の`prosrc`の長さ・SHA256が全件一致した。対象はthreadのcommit／read／related_context、Piece issueの5／7引数、visual変更、export受領、save。問い設定列と既存書出し列、対象tableのRLS、関数ごとの既存invoker／DEFINER区分・ACLを確認し、照合ERRORは0だった。Piece主要3関数の既存DEFINERは維持し、全8関数をinvokerへ変更したという意味ではない。これは稼働構造とsourceの一致であり、本人の実入力・新生成・実Auth／PostgREST保存往復の成功へ換算しない。

### 指定API版の配置と確認

Renderのmashos-apiを旧`497f7008`から指定`99dbdaab`へ配置し、deploy `dep-dbrsoslg1s2s73dgo5s0`は2026-11-14 11:52:10.800906 JSTにLiveとなった。環境変数・提供設定・GPU・重み・研究selectorは変更していない。postdeployの`healthz`とbootstrapはHTTP200、Emlis threadとPiece preview／save／owner-read／export／deleteの既存公開設定を確認した。Pieceのpublic read／write／toggleはfalseを維持する。02:51:30〜02:54:22 UTCの取得範囲にerror logはなかった。形式を満たす合成payloadによる訂正／frameの無認証POSTは、どちらも401 Missing bearer tokenで拒否され、本人データ書込み・モデル呼出し0だった。新しい一般応答品質や本人一巡の証拠とはしない。

対象RN104件、API259件は成功（APIはdeprecation warning1）。RNのMetro依存検証は既存CIの依存分離に従い対象外とし、全RN suite成功とは主張しない。API99dbdaabの既存Piece／Analysis CIは両方成功を確認した。新製品code・fixture・testを変更していない。過去の実4B・隔離保存・native画像は当時の範囲で継承し、今回の新成功へ加算しない。

### DB／API反映単位の閉鎖と、配布・実機を待たない再開先

既存iOS workflowで統合PR30版をbuild・TestFlightへuploadする操作は、外部TestFlight配布の明示承認がないという自動承認審査の理由で、dispatch送信前に拒否された。新しいrun／build／upload／配布は0で、最新内部配布は8001のまま。拒否された操作を別経路で起動していない。これは追加の独自承認段階ではなく、実際に起きた配布操作の停止である。

その後Mashは、配布用アプリbuild・TestFlight送信・実機確認を後回しとし、DB／API反映が完了した現在の単位を閉じて補助経路活用を続けるよう明示した。これに従い、本節の**DB／API通常反映単位はCLOSED**とする。直後は§9.54の本人の有効更新から返答・作品・分析への接続を続け、配布承認・本人端末確認を待機条件にしない。

統合RN配布と、問いON／OFF・回答／二入力訂正、Premium本人判断、最新適格ADDからPieceの保存・再入場・同版画像の通常本人一巡は、別の未確認項目として保持する。これらを確認済みへ変えず、後回しの決定を補助作業全体の停止や、新しい配布操作の許可へ読み替えない。

研究hint・新重み・Piece model selectorは未採用／OFFのまま。一般返答／作品編集／分析の意味品質、本人更新の全下流伝播、AR-06材料・長履歴・AR-07 IF／Saved等は継続中。今回の到達は既存機構の稼働DB／API反映で、本文品質向上、正式human受入れ、AR-01〜08全体完了の追加認定は0。公開日未定・12/6候補と全体管理評価61.625％は維持する。

STRUCTURE_MAP_DELTA_PRESENT（deployment state only）：owner path・公開API／DTO・core責務・rendererの設計は不変。current Emlis／Piece／CMEE mapへ稼働DB／API到達とRN配布未完のpointerを更新し、新しいschema／checker／controller／記録系列は作らない。

### ビルド保留後の接続確認（改修なし）

累積SQLがnaturalのprofile／policyを省略することから、華恋は第2・第3回答が正しく扱われないと初期推測したが、実SQLを通した2／3回答×Free／Plus／Premiumの6条件では、現SQLと完全threadの採用回答数・source prefix・保存材料・source集合・envelope・根拠が全件一致した。過去回答の資格は現在の問い送達上限と別に保持されるため、回答脱落という見立ては撤回した。独立確認もFreeの3回答受理を確認した。この投影差を修復対象にせず、新migration・製品code変更・追加配置は0。本人の具体的訂正／撤回の有効意味をPiece／Analysisへ通す未接続とは分ける。


<a id="analysis-person-correction-source-handoff-20261114"></a>
## 9.56 2026-11-14 — 本人訂正sourceの分析への欠落を修復し、通常保存・再読へ接続

§9.54作業1・4のうち、本人訂正が分析へ届く前に消える接続を一作業単位として扱った。§9.55のDB／API完了済み単位を再実施せず、build・TestFlight・実機保留を継承した。

### 修正前と、今回閉じる範囲

Emlisが訂正1件を受理しても、`_analysis_saved_member`はanswersだけを投影し、訂正前後のAnalysisSavedRecordが完全一致した。さらに実累積SQLはQUESTION／ANSWERしか返さず、訂正イベント自体がsource guardからも落ちていた。単にthread revisionやprofileを直す問題ではない。

API [f73b034f](https://github.com/MassyuRed/mashos-api/commit/f73b034f2b39e3b4900a4c61460fd7b4ff47a2df)は次を同じ変更単位で修復した。

- 累積source snapshotと根拠RPCが、本人訂正OPERATIONと同threadの正確な対象OBSを返す。対象外のAI応答は追加取得しない。訂正なしのsnapshot／guardは旧版と同一。
- AnalysisSavedRecordに既存InterpretationCorrectionSourceの独立tupleを保持。原入力版へ再導出照合し、event／owner／対象OBS／引用の一意性・前後順を検査。本人説明だけをUSER_INTERPRETATION_CORRECTION envelopeへ入れ、AI本文を証拠にしない。対象controlもsource identityへ結ぶ。
- 本人説明が原入力の本人節を完全引用して明示訂正／撤回した場合だけ、既存_active_sourcesの位置・本人・全節の証明を再利用する。無関係な元の記録・時点・感情は保持する。AIへの不一致だけから原入力を反転・失効させない。
- 一般的な説明や対象不明は未解決として当該記録をpending除外し、未訂正版を現在mapへ再利用しない。別の記録は処理を続け、既存coverageへ理由を返す。現在のmodel source経路は適用済み更新も既存のpending境界を維持し、未検証の4B理解へ昇格しない。
- 根拠の既存「本人補足」表示には、そのnodeの証拠に対応する本人説明だけを返す。AI引用は返さない。現mapのguardは変わり、既存月次artifactは当時版の本文・根拠を保つ。

### 現ファイル地図

| owner | 今回の責任 |
|---|---|
| `astor_material_snapshots.py` | 保存threadの訂正・対象の照合と独立source移管 |
| `cores/analysis/source_adapter.py` | 元入力版・source役割・説明だけの証拠envelope |
| `cores/analysis/intent_compiler.py` | 本人の明示全節更新だけ既存証明へ接続 |
| `cores/analysis/semantic_admission.py` | 意味未解決の記録を黙って未訂正版へ戻さない |
| `analysis_cumulative_service.py` | 累積処理のpending理由、nodeに一致する本人説明の根拠表示 |
| `supabase/migrations/20261114032520_analysis_interpretation_correction_sources.sql` | 既存累積snapshot／根拠の2関数を差替え、ACL／invoker／月次保存は保持 |
| `ai/tests/test_analysis_interpretation_correction_sources.py` | 新14条件、実隔離SQLの保存・再読・月次・根拠・source失効 |
| `.github/workflows/analysis-observed-content.yml` | 既存Analysis CIのSQL対象へ新検証を追加 |

上5codeのprefixは`ai/services/ai_inference/`、coresは`cocolon_meaning_experience_engine/cores/analysis/`。新しいproduction owner／型／checker／controller／table／公開route／DTO／RN sourceは追加しない。既存dataclassへ訂正tupleを追加した内部source契約の拡張である。STRUCTURE_MAP_DELTA_PRESENT（既存のEmlis→Analysis source接点）。

### 検証・通常反映

対象284件＋15subtests成功、既存Pydantic deprecation warning1。新14件はこの284内で、月次再読追加後の14再実行も成功したが重複加算しない。最初の新SQL試験はtestがnodeの公開keyをidと誤記し保存後に停止した。実際のnode_refへ修正し、保存・根拠と月次再読まで確認した。元の製品条件を緩めていない。

合成provider・authと隔離PGlite（PostgreSQL）で、Emlis訂正保存→累積source→既存compiler→artifact保存→同版非生成再読／根拠説明→原入力編集後も当時月次本文・private根拠不変を確認した。別owner、対象不在／重複／同引用複数／順序逆転、訂正ID不一致、別原入力／編集前sourceの移植は拒否。一般説明はpending、正常な別記録は残る。訂正なしのSQL結果／guard同一も確認した。新しい実4B・モデル品質・本人端末の成功ではない。

稼働DBへ追跡migration1件を適用、履歴26→27件。snapshot関数2486文字／SHA256 15415ecb30af9af1df34a6959ef3d14b766c73c59e7b4f22605629e27f22f0ce、evidence関数2089文字／SHA256 7fea023552ede3070db2313a312a9cd30cb00f3ae67b7514a743700926f77a35は追跡SQLと一致。両方invoker、postgres／service_roleだけの既存ACLを保持し、本人データを書換えない。API指定版f73b034fの配置dep-dbrtcnm7bikc73f1oml0は12:34:07.027716 JSTにLive、worker同版の配置dep-dbrtdnrrjlhs73chgrj0は12:35:50.562185 JSTにLive。workerは旧497f7008から同版へ揃え、通常の分析裏更新にも修正を反映した。healthz／app/bootstrapはHTTP200、worker startedと通常poll200を確認。12:34:07〜12:37:33 JSTの取得範囲で両serviceのerror log0。環境変数・plan・instance・model設定は変更0。GitHub上の全8変更blob全文はlocalと一致した。Analysis既存CI [run43552052678](https://github.com/MassyuRed/mashos-api/actions/runs/43552052678)はattempt1・全step success。新14件を既存SQL scopeへ追加した。後続eab9b2efは当該testとmigrationのCI起動path2行だけを追加（[skip ci]）、production5file／test／SQL bytesは配置f73b034fと同一で、新しいCI成功へ数えない。

### 未完と次の主線

本人の一般的な説明を対象と意味へ結び付けること、複数の更新の有効版と無関係部分を保つこと、Pieceの訂正／撤回source利用、naturalの根拠付きAnalysis材料生成（NOT_GENERATED解消）は引き続き未完。本修復は比較reportやraw source容器をGENERATEDへ変えず、naturalのanalysis_stateはNOT_GENERATEDを維持する。AR-02／06全体や補助全体の完了ではない。

次は§9.54作業1・2の本人更新→有効意味→下流作者の接続を継続する。今回のpending除外を一般訂正理解の完成へ置換せず、完了した欠落修復と通常化を再周回しない。Piece研究selector／重み未採用、追加GPU・学習・RN変更・build／配布0、本人実機保留を維持する。


<a id="analysis-active-update-semantic-material-20261114"></a>
## 9.57 2026-11-14 — 訂正・撤回後の有効部分を4B分析材料へ渡し、同じ実出力を保存・再読

§9.56で閉じた本人訂正sourceの欠落修復を再実施せず、その次の接点を扱った。既存の原入力中の一節の完全引用による明示REVISE／WITHDRAWは有限compilerへ届いても、通常semantic材料の`_model_fields_source`が更新ありの記録を一律拒否し、正常な別記録だけを残していた。本人の訂正が証明済みの場合にも記録全体がpendingになる欠落である。

API [bd602c35](https://github.com/MassyuRed/mashos-api/commit/bd602c3529d03547a2c0fa2cc7fbf3ab24d1018d)で、既存semantic mapの材料生成だけが有効source更新を扱うようにした。ほかの旧model-fields利用箇所は従来の境界を維持する。

- 全原文envelope・欄hash・原欄境界はそのまま保持し、原欄の有効な連続範囲だけを個別fieldにする。撤回部分をまたぐ連結は行わない。同一文が離れて2回残る場合も、位置の異なるfieldとして識別する。
- REVISEの本人説明は、既存の有効意味処理が証明した差替え節の範囲だけを渡す。旧節、AIの対象引用、訂正定型文を本人の新事実へ混ぜない。説明の記録日時は原入力の記録日時と分離し、いずれも出来事日時とは決めない。
- モデル内の引用座標を全原欄のscalar／UTF8絶対位置へ戻す。既存source dutiesも同じ範囲で照合する。全文原本を短文へ置換した新sourceを作らない。
- 残ったmemo／memo_actionと正常な別記録、カテゴリ・感情は保持する。一般自由文や対象不明の本人説明はpendingのまま、全原文が撤回された記録は空材料として除外する。削除済み節・離れた範囲の連結引用・AI引用は拒否する。
- 通常v1と既存の明示source_duties.v2の両profileを対象にする。更新のない2記録は、変更前後でrequest_ref・material・messages・dutiesが完全一致した。研究profileの通常採用やmodel／重み切替は行わない。

### 現ファイル地図

| 既存owner | 今回の変更 |
|---|---|
| `cores/analysis/source_adapter.py` | 内部parser viewの`scoped_memo_range`を保持。全原文の証拠容器は変更しない |
| `cores/analysis/semantic_admission.py` | 有効連続範囲を別fieldへ切出し、全原欄への根拠座標と本人説明の日時を保持 |
| `cores/analysis/intent_compiler.py` | source dutiesをenvelope／欄だけでなく一意の包含範囲へ結び、元座標へ戻す |
| `ai/tests/test_analysis_active_update_material.py` | 新12条件。両profile、差替え・撤回・二欄・別記録・同文重複・誤引用拒否・空／pendingを確認 |
| `.github/workflows/analysis-observed-content.yml` | 新testを既存CIの起動pathと累積scopeへ追加 |

codeのprefixは`ai/services/ai_inference/cocolon_meaning_experience_engine/`。新production file・class・checker／controller・table・migration・公開route／DTO・RN変更はない。STRUCTURE_MAP_DELTA_PRESENT（既存Analysis source→semantic作者の有効範囲接続）。原入力全体の安全境界と既存の採否・保存責任は維持する。

### 実4B・同版保存と、検証途中の停止

全て架空の2記録・思考／行動二欄・カテゴリ／感情付きの同じfixtureから、差替えと撤回を各1件作った。合成Auth／先行Emlis応答・隔離PGliteを使い、実serviceでの訂正保存→累積SQLのsnapshot・source guard→生成前checkpoint・messages／request_refの固定まで行い、既存Podの稼働中4Bへ2要求を一回送った。今回の実4B2件はv2だけであり、通常v1は材料・回帰確認で、同profileの新4B生成は未実施。比較profileは`semantic_map.source_duties.v2`、提供名は`cocolon-qwen3.5-4b-analysis-semantic-120u`。2応答ともHTTP200／stop、82.455971秒、PID98755とhealth200を維持。学習・提供再起動・model切替・生成再試行0。実利用者データの読取・送付0、鍵は既存Pod内のlocalhost認証だけに使用した。

最初のuploadは、架空fixtureの出自が明示されずprivateデータ送付と判定され、自動承認審査で送信前に拒否された。builderと全decoded fieldの照合、production読取0を独立確認し、架空データの出自を同梱した安全な送付へ変更して許可された。元の拒否操作を別経路で実行していない。最初の起動はserved model名の`cocolon-`接頭辞をscriptが欠いており、鍵読取・POST前のidentity assertionで停止した。messages／snapshotを変えずmodel IDだけを実提供名へ合わせ、別の排他実行場所から上記2要求を取得した。旧起動で生成された応答は0。

取得rawを修補せず、生成前の同checkpointからCMEEへ通し、両方で原文の絶対引用座標を照合した。最初のSQL保存は隔離fixtureに既存semantic wire migrationが欠けていたためSQL23514で停止した。製品や稼働DBの不具合ではなく、検証環境の不足である。元checkpointを再復元し、既存`20261107071033_analysis_semantic_map_wire.sql`だけを隔離DBへ適用し、前後のsource guard／members不変を確認した。同じraw・messages・request_refをそのまま使い、artifact commit→現在版2回・月次版1回の非生成再読→全nodeの根拠読取を両件で成功させた。元checkpoint bytes・本人sourceは不変。再検証のモデル呼出し0、旧失敗記録も保持した。

差替え・撤回ともsource_count／processed_count／mapped_count=2、excluded／unparsed=0。差替えは新本人節と残る5節、撤回は残る5節だけを根拠に使い、旧希望を復活させない。これは隔離SQLと実4Bの技術到達であり、稼働DBへ本人データを書いた実績や本人端末の一巡ではない。実raw・取得前snapshot・checkpoint・根拠・保存再読receiptはprivate証跡`Cocolon_CMEE_AnalysisActiveUpdate_20261114.zip`（SHA256 `1b4f04d28fdebecfa43799144a7d2fa5609e833148a1148e33086d2825067c6f`）へ保存済み。

### 通常反映・検証

関連159件成功（新12件を含み、再実行は重複加算しない）。既存Pydantic deprecation warning1を保持。GitHubの現5変更blobはlocal全文と一致し、差分も同5pathだけだった。既存Analysis CI [run43555588970](https://github.com/MassyuRed/mashos-api/actions/runs/43555588970)は配置と同じbd602c35・attempt1、全19工程success。73件、45件、分析2882件＋12236subtests、owner identity1件、累積1194件＋21subtests（新12を含む）、実SQL201 source／15月次、report408件＋738subtestsがそれぞれ成功した。重なるscopeを合算しない。

通常APIの指定配置`dep-dbru6luk1f9s73fo302g`は13:29:17.278230 JST、裏更新workerの指定配置`dep-dbru7ajl550s73etfof0`は13:30:07.611157 JSTに同じbd602c35でLiveとなった。両方の前版はf73b034f。APIのhealthz／app/bootstrapは13:29:59 JSTにHTTP200、workerは13:30:16 JST起動と新instanceのDB通信200を確認。13:29:17〜13:31:07 JSTの取得範囲で両serviceのerror log0。環境変数・plan・instance数・model／重み・research selectorは変更0。

新しいDB変更は0。稼働migration履歴27件、累積source／根拠2関数のprosrc長・SHA256は§9.56のまま、invokerを維持する。稼働DBは既存semantic v3の対応するpublic／private組の制約を保持しており、隔離fixtureの不足を本番へ追加migrationする処理は行わない。本人データ書換え・RN変更・配布用build・TestFlight0。通常コード反映と隔離SQL／実4Bの検証を、通常認証・通常DB・実4B・本人端末をそろえた一巡へ読み替えない。

### 閉じた範囲と次の主線

今回閉じるのは、既存処理で証明された原入力中の一節の完全引用によるREVISE／WITHDRAWの有効範囲を通常semantic作者へ渡す接続、正確な根拠座標、同じ実rawの保存再読、通常API／裏更新への配置まで。一般訂正の理解や文章品質の完成へ換算しない。

実2本文には、同じ原記録の欄を「別の記録」と呼ぶ誤り、自宅と費用記録を未証明に結び付ける表現、希望を現在の本人基準へ広げる記載が残った。「もう方」「节点」「表れていることはできます」等もあり、全文の意味・関係・自然な日本語の品質合格は0。今回の受渡し・保存成功を、これらの出力品質改善へ加算しない。

次は§9.54作業1・2の残りとして、一般的な本人説明を正確な対象と有効意味へ結び付けること、Pieceへの訂正／撤回source利用、naturalの根拠付きAnalysis材料生成（NOT_GENERATED解消）、実出力に残る関係・場面の過剰な結合と日本語品質を進める。完了したSQL／source欠落／範囲接続の確認だけを再周回しない。AR-02／06・全補助経路は未完。RN変更・配布用build・TestFlight・本人実機はMashの保留を維持する。


<a id="piece-natural-answer-active-source-20261114"></a>
## 9.58 2026-11-14 — 自然一回答の訂正・撤回をPieceへ接続し、通常DB／API反映までの限定技術単位を完了

§9.54作業1・4のうち、共有意味では解決済みの真正な自然Q3一回答REVISE／WITHDRAWが、PieceのADD限定入口で落ちる接点を扱った。§9.55〜57の完了済みSQL／Analysis材料接続を再実施せず、本人原根拠の有効意味から既存Piece作者・保存競合防止・通常配置へ接続した。**このbounded technical unitはCLOSED。新しい実4B3件の作品本文、同実本文の保存再読／画像は未完で、商品結果の全単位や全補助活用の完了ではない。**

### 一回答の適用境界と、原文を変えない作者材料

API [75e526d1a90b969643211b3512b59826e78adbfd](https://github.com/MassyuRed/mashos-api/commit/75e526d1a90b969643211b3512b59826e78adbfd)はproduction11・test3・workflow2・migration1の17path。現共有`prepare_emlis_meaning`を原入力・実QUESTION／ANSWER・保存contextから再導出し、保存current checkpointとのexact一致を条件に既存refined handoffへ渡す。

- 対象はnatural Q3の真正な最初の一回答、共有ownerのRESOLVED／MATERIAL_UPDATE／EXPLICIT_CORRECTION、memo／memo_action内の独立完全文SELF node一つの更新、正確な元節anchorとORIGINAL_OCCASION。残存原意味を少なくとも一つ保持する。REVISEの新節も実ANSWER内の独立完全文SELFである。未証明時点や別sourceから主体を補わない。
- 原入力七項目・全原文envelope・欄hash、実ANSWER全envelope、scalar／UTF8の絶対座標は不変。既存handoff／snapshotに`original_active_ranges`と`supplemental_active_range`を持たせ、新private class `PieceActiveOriginalMeaning` exact1で、全原本と残存nodeを区別する。一般の新source型・新しいsource identity体系は作らない。
- REVISEは原欄の残存範囲＋実ANSWERの差替え本人節だけを作者材料へ渡す。WITHDRAWのmeaning supplementalはNone、回答はcontrol／lineageとして残す。旧節の引用や「ではなく」「取り消す」等の訂正命令を本人の新事実にしない。
- 内部Preparedは全原文を保持するが、model-visible wireには`active_text_ranges`／`literal_ranges`を使い、旧節を含む全文や旧evidenceを再露出しない。離れた原欄範囲を連結した架空sourceは作らず、同一原欄内の複数残存範囲は同じslot内で別範囲として扱う。最大3text slotを増やさない。
- 独立S7は残存する完全文literalを照合し、削除節を挟む旧first→last sliceを使わない。引用内の新節は終端句点を欠く通常形があるため、共有意味ownerが述語・完全文を証明済みのSELF節だけ、parser用`literal + "。"`のgrammar-only viewを使う。**原文・quote・evidence literal・根拠座標には句点を追加しない。** 未証明断片を句点で完全文にしない。
- 元原文と実ANSWERの全文安全確認、既存唯一作者・体裁選択・PUBLIC7参照・source_ref七項目・source_lineage・既存recipe／renderer／再送を保持する。未更新原入力・既存ADD・最新第2／3回答の独立ADDは維持する。

AI応答への一般INTERPRETATION_CORRECTION、複数対象／多段／混合更新、条件・人物評価・名詞参照・役割alias等のnode間依存を跨ぐ更新は未対応で拒否する。真正な実回答の限定REVISE／WITHDRAWを、あらゆる本人訂正の意味理解へ広げない。Emlis本文・質問文を作品の本人sourceへ昇格しない。

### 既存保存境界と全ファイル地図

有効更新だけ、既存RPCの`p_expected_source_state` JSONへexactな`meaning_checkpoint` objectを追加する。原入力／ADDの既存4key状態は不変。既存SQL3関数がsourceをlockして現在のcheckpoint payloadと完全一致を確認し、Python証明後のcheckpoint変更、旧有効更新を偽ADDとして通す迂回も拒否する。新top-level RPC引数・公開route／DTO・table・RN sourceは追加しない。

追跡migrationは`supabase/migrations/20261114051948_piece_natural_answer_active_source.sql`。変更するのは既存`piece_issue_preview_v2`／`piece_mutate_preview_visual_v2`／`piece_save_v2`の3関数だけで、元の署名・lock／再送順・ACL／RLS・quota primitiveを継承する。filenameのversionと、稼働履歴の実適用version `20261114054136`は別である。

全17変更pathと個別責務は[01Bの今回地図](../../01B_cocolon_overall_structure_analysis_piece_emotionlog_ranking.md#piece-natural-answer-active-source-files-20261114)、基盤側は[01A](../../01A_cocolon_overall_structure_app_foundation_home.md#piece-natural-answer-active-source-files-20261114)、構造は[Piece map](../../current_structure/02_piece_current_structure.md#piece-natural-answer-active-source-20261114)／[CMEE map](../../current_structure/04_cmee_current_structure.md#piece-natural-answer-active-source-20261114)。STRUCTURE_MAP_DELTA_PRESENT（既存共有意味→Piece有効sourceと既存保存境界）。03 Analysis mapは本単位で変更しない。

### 検証結果と、中断で消失した証跡の限界

中断前のローカル関連結果は**544 passed／既存Pydantic warning1**。新42件＝core10＋wire11＋integration21を内包し、前段205件や重複再実行を加算しない。integration21の内訳は、3plan×REVISE／WITHDRAWの6件、既存ADD対照1件、未解決拒否2件、SQL3操作×4改変拒否12件である。6件はpreview→適用されるvisual変更→初回save／同key再送→別serviceの非生成同版再読へ通し、原source／Emlis不変・quota各1を確認した。4改変はcheckpoint、active→偽ADD、ANSWER本文、原入力本文で、拒否の無副作用を確認した。先行Emlis応答・Auth／Piece HTTPは合成、SQLは隔離PGliteであり、実4B品質の証明ではない。

途中でSQLのJSON演算子と`||`の優先順位によるNULL、およびWITHDRAWのsupplemental Noneへの無条件role_bindings参照を確認し、前者は両JSON抽出operandの明示括弧、後者はNone分岐へ修復した。資格・S7・安全確認を緩めず、モデル出力の失敗とも扱わない。

ただし処理中断後にscratchが消失し、上記ローカルCPU receipt、Analysis比較raw／checkpoints、未送信Piece ZIP等のlocal-only原本は失われた。**544件等は中断前の結果記録として区別し、失われたreceiptを現存保存済み・再検証済みとは書かない。** 新しく復元したtracked sourceやGitHub CI原本は旧local rawの復旧ではない。回復できた原本だけを照合して採用し、本文・hash・private archiveの再作成を推測で行わない。従前§9.57／weekly§12の実2取得記録を今回7応答やPiece3件の新成功へ付け替えない。

GitHubへ反映した17blobは消失前にlocal全文／変更path一致を確認済み。同commitの既存Analysis CI [43562312172](https://github.com/MassyuRed/mashos-api/actions/runs/43562312172)は全19step、Piece CI [43562312140](https://github.com/MassyuRed/mashos-api/actions/runs/43562312140)は全39step success。中断後に両runのcompleted／success・commit75e526d1一致を再確認し、完全ログを復旧した。新42件のCI成功根拠はこの原本から再確認できる。さらにexact75e526d1のcheckoutと残存runtime／PGliteを復旧し、今回の新42件を一回再実行して**42 passed／既存warning1、12.42秒**をfresh確認した（原log `piece-answer-update-recovery/recovered_new42_pytest.log`）。実model call0であり、中断前544件へ重複加算せず、失われた544件全local receiptの復旧とも扱わない。この遠隔CI・fresh42・tracked source／稼働配置を、失われたbody-full rawとは別の技術証拠として保持する。

### 通常DB／API／裏更新への反映

稼働DBへ上記1migrationをactual `20261114054136`として適用した。中断後の独立再読でも、対象3関数のprosrc SHA256を再取得した。さらに新しい架空fixtureの生成前checkpointを隔離復元し、追跡SQL適用後のpg_proc metadataだけから期待hashを再計算して、fresh liveの3値すべてとの完全一致を確認した。元checkpointは前後SHA256不変、DDL・外部POST・model call0。ACLはpostgres／service_roleだけ、SECURITY DEFINERと`search_path=pg_catalog`を保持していた。API指定配置`dep-dbrvgpdg1s2s73domim0`は2026-11-14 **14:59:21 JST（05:59:21Z）**、worker指定配置`dep-dbrvgv3l550s73f17hpg`は**14:59:04 JST（05:59:04Z）**に、ともに75e526d1でLiveとなった。新モデル・重み・research selectorの採用は行わない。

中断後、API healthzは15:09:50 JST、app/bootstrapは15:09:56 JSTにHTTP200を再確認した。新worker instance `x2xtj`は14:59:11 JST起動〜15:09:40 JSTのpoll200を再読し、14:59:22〜15:10 JSTまでの取得済み範囲で両serviceのerror-level log0を確認した。取得時点より未来の範囲を確認済みとせず、通常配置・通信成功を、通常認証／通常DB／実4B／本人端末をそろえた作品一巡へ変換しない。

### 実Piece3件は送付前停止、Analysis比較候補も通常不採用

新Piece確認はREVISE／WITHDRAW／ADD対照各1の3件を予定したが、ZIP外部送付の自動承認審査が2回とも**送信前に拒否**した。具体的なファイル内容とRunpod／Jupyter宛先への明示承認が不足する、という実際の拒否理由である。架空UUID・固定の架空MEMO／ACTION／ANSWERだけを使い、production本文や鍵値を含まない出自を独立照合した後の同UI再審査でも拒否されたため、再送・別経路・迂回は行わない。

消失前の最終準備物は13,369byte・4fileのZIPだったが、現在も現存・準備済みとは扱わない。復旧した送付物の実byte・内容・宛先を確認できた範囲で提示し、必要な明示承認を解決してから実3件へ戻る。今回のPiece実4B生成0・同実本文の保存再読0・画像0、追加学習・4B提供再起動・新GPU借用0。合成保存6件を実作品3件の代用にせず、元のAnalysis rawや以前のADD画像も流用しない。

本単位への移行前に試したAnalysis本文指示の比較候補v3の4応答・v4の3応答は、指示／方針の本文露出、無関係なsource／actionの欠落、未記載の同日／場面の結合、日本語の崩れ等が残り、品質FAIL／通常不採用とした。比較v3／v4は既存semantic wire schema v3と別であり、通常v1／明示v2とproduction候補差分は元へ復元した。当時の隔離保存の記録を、消失したraw／CPU receiptなしに現在の再検証済み証拠へ昇格しない。品質改善・新しい通常analysis profile採用の追加認定は0。

### 中断後の新しい送付前準備（未送付・未実行）

失われた原本と同じhashを再現したとはせず、exact75e526d1・既存真正Q3 fixtureを使って新UUIDのREVISE／WITHDRAW／ADD各1件を作り直した。原入力は思考「褒められたのに、嬉しくなかった。私は仕事を続けたい。」、行動「私は資料を調べた。」、仕事／不安medium。実ANSWERはREVISE `「私は仕事を続けたい」ではなく「私は家族を守りたい」です。`、WITHDRAW `「私は仕事を続けたい」は取り消します。`、ADD `今は、私は嬉しい。`を固定する。通常application factoryのHTTP POST bodyをMockTransportの503応答で捕捉し、作者の候補本文は作成していない。先行Emlis応答とAuthだけ合成、Q3保存／共有checkpoint／Piece適格性／model材料は既存実装と隔離SQLを使う。

新準備物は`piece-one-answer-rebuilt-input-20261114.zip`、**16,942byte・6file**、SHA256 `a757d2209ca6a5ab4b759989b10f47cb6abbaaee378474e82158f7125ea7ac62`。内訳は`run_once.py`、`wire.private.json`、`provenance.private.json`、`wire/revise.request.json`、`wire/withdraw.request.json`、`wire/add.request.json`。新しい全source／prepared／隔離checkpointは送付ZIPの外で証跡に保持する。旧13,369byte・4fileのZIPとは別物である。

送付先は既存Runpod `f1lle4xwq3wjln` のJupyter。予定実行は同Pod内`127.0.0.1:8000`へ固定3POST＋前後health2GET、最大300秒・一回、学習／再試行／提供再起動／依存追加／model変更0。既存PID98755のprogram・starttime・natural model `cocolon-qwen35-4b-base-851bf6e`を先に照合し、既存`EMLIS_NATURAL_REPLY_API_KEY`は同Pod内loopback認証だけに使う。新送付物も具体的内容と宛先の明示承認が得られるまで送らない。新しい準備であり、実3応答・保存・画像の成功ではない。

新準備3件は、保存snapshotから共有checkpoint・Prepared・通常factory messagesを純CPUで独立再導出し、3件のcanonical HTTP body全byte一致を確認した。新独立監査は`PASS_STATIC_AND_PURE_CPU_PREPARATION_REVIEW`、JSON SHA256 `8c51b1ef178e390fabda386b8033a27d8e294969e24b376ca327732308830ca0`。実4B結果や送付許可ではない。新全source／checkpoint・固定送付ZIP・fresh42 log・両CI完全ログ・DB／稼働metadata・旧監査の再構成要約は[Cocolon_CMEE_Piece_AnswerUpdate_NormalDB_API_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)（5,002,760byte、SHA256 `dc03a9a904776cf21538dd799ba8072ba233005e1e6adb4ab76973e50277d67c`）へ保存した。失われた旧raw／CPU receiptはこの保存物にも復元されていない。

### 閉じた範囲と、次に残る商品結果

primaryは限定TECHNICAL_CREDIT。真正一回答の有効範囲→既存Piece作者、独立S7、同じprivate checkpointによるpreview／visual／save競合防止、合成provider／隔離SQLの保存鎖、通常DB／API／worker配置までのbounded technical unitを閉じる。全補助活用・AR-02／04／06／08全体・一般日本語品質・正式human Product Read・商品受入れは未完である。

この単位の次は、復旧できた具体的な架空3件送付物・宛先についての承認不足を解消し、真正共有checkpointのREVISE／WITHDRAWとADD対照の実4B本文→同raw無修補の保存再読→該当同版画像を確認すること。完了済みsource／SQL／通常配置だけの再周回や、品質FAILのAnalysis候補採用へ戻らない。§9.54の一般訂正・複数更新／依存の有効意味、naturalの根拠付きAnalysis材料生成（NOT_GENERATED解消）、実本文の意味／自然さ、全蓄積・本人マップ訂正・IF／Savedの必要能力は継続する。

RN source／rendererは本単位で変更0。Mashのbuild／TestFlight／本人実機保留を継承し、それらを待機条件にも新実行許可にも変えない。公開日未定・12/6提出可能候補・全体管理評価61.625％は再採点せず維持する。


<a id="piece-answer-update-health-route-stop-20261114"></a>
## 9.59 2026-11-14 — 承認済み一回比較は稼働確認URL不一致で生成前停止、追加実行は未承認

Mashが§9.58の16,942byte・6file、既存Runpod `f1lle4xwq3wjln`、架空3件＋前後health2GET、最大5分・一回、学習／再試行／再起動なし、既存鍵の同Pod内認証だけの使用を明示承認した。先のZIP送付に対する承認不足はこの具体範囲で解消し、送付した。Pod側でもZIP SHA256 `a757d2209ca6a5ab4b759989b10f47cb6abbaaee378474e82158f7125ea7ac62` と6memberを照合し、`/workspace/piece-one-answer-rebuilt-20261114-once`へ展開、一回だけ起動した。runner child PID106308。送付と起動の試行を、モデル生成の成功へ数えない。

### 実測と原因

取得した無修補summaryはcompleted=false、model_posts=0、health_gets=2、elapsed_seconds=0.033345995005220175、初回／終端ともHTTPError。提供PID98755・starttime218457281・program・natural model名は前後一致。学習・再試行・提供再起動・依存追加・model変更・raw修補0。鍵を読む前の最初の稼働確認で止まり、candidate3/raw3は未取得である。

私が準備したrunnerのHEALTH定数は`http://127.0.0.1:8000/health`だった。実serverの`do_GET`原本は`/healthz`だけを認め、ほかは404を返す。この実仕様と準備コードの不一致を原因とする。旧runnerはHTTPErrorの型だけを保存し、HTTP status/body自体を保存していないため、「404受信の生responseを保存済み」とは書かない。404は現handlerの読取から判定した。handler原本SHA256 `867f5557a8a1c32071d71002d1c05827ac75b6589498c9b33a85eb3276c59217`、回収ZIP7,375byte／SHA256 `e80cd9c53feca53893e1b270acdae1399f7dc8ac23c798ea2467801d52bf00b3`。提供を停止・変更していない。

後続のread-only確認では既存process identityとnamed_key関数だけを同Pod内で使い、鍵の存在・形式は画面上でtrueを確認した。値を外部へ表示・保存せず、追加GET／POST0。小metadataのダウンロードはtimeoutし、これは画面観測の記録と区別する。鍵値や取得できなかったmetadata原本を復元したとはしない。

### 一行だけの修正候補（未実行）

private runnerのHEALTH定数だけを`/healthz`へ変更する。8,925→8,926byte、旧runner SHA256 `9319814124d58f9cb3e4234d1e12a6cce6420fd8590de8511ac45148d253ef2f`、新 `acb5665088574cd7d7e27c3b35c0eac9b8cf5959dda5190169790eaa21faf7b1`。ASTは当該定数以外同一、compileと取得済みdo_GETの純CPU契約確認が成功（旧path404／正pathかつ期限内200／期限超過503、ネットワーク0）。新pathの実HTTP成功を確認した結果ではない。

同じ送付済みZIPをSHA／6member照合し、新exclusive directory `/workspace/piece-answer-update-healthz-once-20261114`へ展開して一行patchの旧新SHAを照合する具体launchを準備した。他5file、3POST body、出自・Prepared・checkpointは無変更。旧停止directory／summaryを保持する。親は既存Pythonの`sys.executable`を使い、新しい外部timeout commandや依存を追加しない。runner既存の300秒上限・295秒deadline・299秒alarm、同PID/start/model照合、固定3POST＋前後2GET、named keyの同Pod内loopback認証を維持する。準備launch SHA256 `4cb7ec0ba9c1afbc7b3d0a551616940347bc1bde4e3aa62832eace2a049e2f40`。送付0・実行0で、既存6fileの再送付は不要。

今回指定の「一回・再試行なし」を越えて自動実行せず、この修正を適用した追加一回について具体承認を待つ。先の承認不足を蒸し返して新ZIP送付を求めるのではなく、失敗で終了した一回の次の実行を区別する。

### 保存確認の準備と、保持する現在地

無修補rawを同checkpointから通常factoryへ戻し、body bytes一致→CMEE／S7→preview／同版save・再送／別service非生成再読・quota／原source／Emlis不変を確認するprivate scriptを準備・独立reviewしたが、今回のrawは0件なのでmainは未実行。RN描画入力照合も再構成し、既存架空2fixtureのsmoke／改変拒否だけ確認した。今回の実本文Product Read・同raw保存再読・新native画像・本人端末の成功はすべて0。

停止原本、原因、保持source、修正一行と未実行launch、保存／描画の準備は同じ検証ZIPの保存版1へ追加した。[Cocolon_CMEE_Piece_AnswerUpdate_NormalDB_API_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)、5,035,209byte／SHA256 `2cb6b100ad407a047775ed3887a9846d9de1a5ba500b0646b004c39fb2d86be3`。`LATEST.md`／`manifest_current.json`が現在一覧。§9.58にある旧SHAは前版0のもので、旧原本を保存済みの履歴として保持する。新しい実4B本文を保存したZIPではない。

NO_STRUCTURE_MAP_DELTA：production／公開DTO／route／SQL／RN／renderer／source owner／file地図の構造変更0、稼働DB／API／worker75e526d1の完了は維持。今回の変更はprivate比較runnerの候補と実行状態だけで、新CI・新配置は不要。一般訂正・多段／依存・natural Analysis・長履歴・IF／Saved・一般本文品質、補助全体は未完。build／TestFlight／本人実機は保留のまま、全体評価や期限を再採点しない。


<a id="piece-answer-update-actual3-saved-20261114"></a>
## 9.60 2026-11-14 — 実4B三件の有効意味を保持し、同じ実出力の保存再読・描画入力一致まで完了

Mashは§9.59のHEALTH一行修正、送付済み6file再送なし、同Podで架空3件＋前後2GET、最大5分・追加一回、学習／再試行／再起動なし、既存鍵の同Pod内認証だけの使用を具体承認した。その範囲で既存ZIPを照合し、別exclusive directory `/workspace/piece-answer-update-healthz-once-20261114`へ展開してrunner旧新SHAを確認した。新runner SHA256は`acb5665088574cd7d7e27c3b35c0eac9b8cf5959dda5190169790eaa21faf7b1`、変更はHEALTHの`/health`→`/healthz`だけ。他5file・3POST body・出自・Prepared・生成前checkpointは無変更。旧0件STOPは別に保持した。

### 取得原本と、閉じた範囲

実REVISE／WITHDRAW／ADD各1は全HTTP200／finish_reason=stop。model POST3、前後health GET2はともに200、全体13.307355700060725秒。提供PID98755／starttime218457281、programとnatural model名は前後同一。model名は`cocolon-qwen35-4b-base-851bf6e`、usage／loaded revisionの未提供を推測で埋めない。再送・学習・再試行・提供再起動・依存追加・新model／adapter変更・raw修補0。取得ZIP21,777byte／SHA256 `05516db999584a92d47ed170d27f7c6589ddcd8ae2073323c61de066992362fc`、summary SHA256 `02bc9e5bd63476d74d246ac11410ed6be8f69e4a39ac0e538b0e7c44a0341d7f`。各responseのsize／SHAと固定request bodyの全byte一致も照合した。今回の追加一回は終了・消費済みで、新しい実行へ流用しない。

| 実本文 | 段落 | 原入力・本人回答との照合 |
|---|---:|---|
| REVISE | 3 | 元の対比と資料を調べた過去を保ち、旧「私は仕事を続けたい」を除いて新「私は家族を守りたい」だけを使う |
| WITHDRAW | 2 | 元の対比と行動だけを残し、撤回された希望・回答の訂正命令を作品へ戻さない |
| ADD対照 | 3 | 元memoの希望と行動を保持し、「今は、私は嬉しい。」を別の回答段落として加える |

独立AI全文読取はこの固定3件で主体・過去／今・希望／実行・対比・欄分離の保持を確認し、未記載の因果・意図・感情や日本語の破綻を認めなかった。REVISE新節の終止句点以外は原文の写しに近い。これは限定した意味保持であり、一般編集品質の改善、A/B優位、正式human Product ReadやMash本人の受入れを追加認定しない。

### 同じrawの保存再読と、実稼働既定に合わせたCPU確認

各件で取得前の同checkpointを独立復元し、元source／共有checkpoint／Preparedと既存3SQL関数hashを照合した。通常application factoryが作ったPOST bodyが送付済wireと全byte一致した場合だけ、同じ無修補HTTP responseをlocal MockTransportで一回replayした。receiptはCANDIDATE_UNREVIEWEDから既存CMEE／S7へ進み、全3GENERATED。preview→同版save／同key再送→別serviceの非生成detailが成功し、quota各1、原source／Emlis／checkpoint／rawは不変。保存／再読でモデル再取得0。初版fixtureはpremium／ios.v2で、検証原本SHA256 `6217de0f6b6ae783e7be36e4bccb468c1f415d4fe9f1fde643be83c085be0aa2`、全文本文原本SHA256 `2032d128ef0a5a61f5acea80aeb33faed2e8e52ba2ab4b9c49513cd17ef9cfd5`。

新たに稼働service metadataを読み、起動renderer既定がios.v1であることを確認したため、初版fixtureとの差を別CPUforkで検証した。元のheader無指定を維持し、起動runtime既定v1だけを既存`api_piece_v2._renderer_preferences`へ渡すと自然にv1が選ばれ、同じ3rawの通常factory body一致・CMEE／S7・同版保存再読・quota／source不変も全3成功した。v2 header controlは既存どおりv2を選ぶが、本forkのheaderや期待artifactを強制変更していない。v1検証原本SHA256 `f588445ade629f86f75d3d455baba6055de9fb56a0f83f001b4186073a6f9d47`、profile証明SHA256 `2a948406db4bcce2cf87654c23d3f1ae1ae125d1399f04799d206c06f8aab7c2`。同じ実3応答のCPU再生であり、新6応答と数えない。

両forkともAuthは合成、SQLは隔離PGliteで、本番本人データの読取・書換え0。起動renderer既定を合わせたことを、全live runtime／実端末compiled header／通常認証・通常DBをそろえた本人一巡としない。今回のfixtureはPremiumだけ、旧42件に含む全プランの接続検証は既存creditであり、新しい全プラン実生成へ加算しない。

### 同版描画入力と、未確認の画像

各fork内でpreview／保存／exportのcanonical8・3hash・全段落・JS描画入力（生成keyを除く）が3件すべて一致した。v2入力証跡SHA256 `1006fdd3661906a52a9dc446ad3be9c258f49a81735eb1ecc05bae79f91a1c22`、v1入力証跡SHA256 `46a850f017f2df22500865a9c293cb18475efa9018cafb006a39a43de19164b2`。版を跨ぐ比較は本文／payload／recipe等7項目と3hashが同一で、JS入力差はrendererVersionと既存brandingTextだけ（v1=Cocolon／v2=Emlis）。新profile・RN分岐を製品へ追加していない。native bitmap／PNG・OS共有・本人表示の成功は0で、画像完成とは書かない。

### 証跡と次の主線

固定source／生成前checkpoint、取得raw3、同版保存原本、独立全文読取と両描画入力証跡は同じ検証ZIPの保存版2へ追加した。[Cocolon_CMEE_Piece_AnswerUpdate_NormalDB_API_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-6af69c8803fc8191bf7c35bf7718f6cc_2f7470f963808191aaebf050935e72de&account_id=personal)、5,232,467byte／SHA256 `d0078f7339854739ce03fc00ef86bcbd7c23e3eed1749adca2ff7b7f709f69bc`。`LATEST.md`／`manifest_current.json`が現在一覧。以前のSTOP・修正準備・保存版0／1の履歴を保持する。消失した旧Analysis rawの復元とは別である。

この限定的な実生成→有効意味保持→同版隔離保存再読→JS入力一致の確認単位を閉じる。通常DB／API／worker75e526d1の既完了は継承し、production／SQL／公開契約／RN／file地図構造の追加変更、新CI・DB migration・Render再配置0。NO_STRUCTURE_MAP_DELTA。研究selector／新重みは通常採用しない。

次は§9.54の一般的な本人説明・複数更新／依存の有効意味を三中核へ通す接続、natural Analysisの根拠付き材料とNOT_GENERATED解消、実本文の一般編集・関係／日本語品質、全蓄積・本人map訂正・IF／Savedへ戻る。閉じたsource／SQL／health／送付確認だけを再周回しない。全補助活用と正式商品受入れは未完、build／TestFlight／本人実機保留を継承し、native画像の未確認を他の作業全体の待機条件にしない。全体評価と期限は再採点しない。


<a id="piece-latest-later-answer-update-20261114"></a>
## 9.61 2026-11-14 — 第2・第3回答の明示訂正／撤回をPieceへ接続し、通常DB／API単位を完了

### 修正前と、閉じた範囲

§9.60の実3応答・同raw保存検証を取り直さず、§9.54作業1・4の残りへ進んだ。現物は、一回答REVISE／WITHDRAWにだけ有効範囲があり、第2／3回答はADD限定だった。今回、先行回答がすべて独立ADDで、最新一回答が原入力の正確な一節をREVISE／WITHDRAWする場合を接続した。原入力の二欄・未変更の経験・感情は保持し、訂正対象の旧節を作品へ復活させない。差替え節は最新本人回答の元のscalar／UTF-8座標へ戻る。

原入力＋明示選択された最新一回答という既存の作品仕様を維持する。先行ADDは全roundの発行QUESTION／ANSWER／checkpoint／receipt・時点・版を確認するためだけに使い、作品へ連結しない。先行REVISE／WITHDRAW、先行補足自体を対象にする更新、最新回答に複数種を混在させる更新、一般自由文訂正は未対応のまま拒否する。Analysisは全適格回答を使う別仕様を維持し、Emlis／Analysisの共有意味や作者を変更していない。

### 現ファイル地図と既存能力の利用

| repository／現owner | 差分と責務 |
|---|---|
| mashos-api `ai/services/ai_inference/piece_v2_source_adapter.py` | 全prefixを既存共有意味ownerで再導出し、先行ADDだけを資格確認。最終checkpointの解決済み一更新を既存有効範囲helperへ渡す。回答の固定先を先頭から最新へ変更し、原入力envelope／一節・依存の検査は維持 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/piece_refined.py` | source adapterが確認した第2／3回答を、既存原入力有効範囲・最新補足作者へ通す。原入力＋最新補足の最大2source、既存3slot・S7・rendererを維持 |
| `supabase/migrations/20261114074058_piece_natural_latest_answer_update.sql` | 既存preview発行／見た目変更／saveの3関数で、現在checkpoint完全一致、全prefix由来のaccepted_update_refs初出順一致、先行ADD限定、最終checkpoint一致を確認。関数signature／source lock／ACL／既存lineageを変更しない |
| `ai/tests/piece_v2/test_b05_piece_answer_update_saved_pipeline.py` | 本人更新→source→作者→preview／visual／save→非生成owner再読、3writerの改変拒否、通常モデル選択OFFの既存作者を検証。既存CIの対象fileなのでworkflow追加0 |

STRUCTURE_MAP_DELTA_PRESENT：既存Piece source adapter／refined ownerの受付範囲の限定拡張。新しい作者・保存基盤・公開API・response key・DB table・RN導線は0。

### 検証・通常適用

- 最終関連回帰：**232 PASS**。新規32件を含む更新pipeline53、既存later ADD・refinedの保存境界、共有Piece有効範囲／sourceを同時確認。Python3.12.14／pytest8.4.1／PGlite0.5.8、Auth／Emlis／HTTP model本文は架空。新実4B品質の証拠ではない。
- round2／3 × REVISE／WITHDRAW × Free／Plus／Premiumの12保存再読。旧希望を除き、未変更経験と行動を保持し、REVISEだけ新しい希望を残す。先行ADDは作品材料へ混入せず、元source／Emlis不変、保存quota各1。
- 3writer×6改変の18件は副作用なしで拒否。先行更新の改変、累積参照の欠落／追加／順序、期待checkpoint、元source編集を検査し、変えたcheckpointを要求側でechoしても通さない。
- selector OFFの既存作者でもREVISE／WITHDRAWを生成・保存・非生成再読。4B選択をONにせず、model有効時の失敗を旧作者へ黙ってfallbackする変更はない。
- GitHub API `cb6301ed9a0b77fa7342e71c078d64a9075dad7a` の4changed pathsと全remote bytes一致を確認。既存CI2本は記録時点で実行中、成功とは数えない。
- 通常Supabase `piece_natural_latest_answer_update`（適用version `20261114074859`）を適用し、3関数の最新分岐／先行ADD fenceとACLを読み戻し確認。service_roleのみの実行権限を維持し、旧5引数preview関数の本文MD5は不変。新table／policy／権限追加0。
- Render既存mashos-apiへ指定commitをmanual配置。`dep-dbs16gafngtc73bek5a0`、07:52:33Z開始→**07:53:56Z（16:53:56 JST）Live**。`/healthz`と`/app/bootstrap`は200、private5 ON／public3 OFF、linked main／autoDeploy=no/offを維持。限定07:52:33〜07:55:08Zのapp/errorログ0。Piece APIだけの変更でworker再配置は不要。新RN／build／TestFlight／本人実機0。

### 判定と次の未完

primary outcomeはTECHNICAL_CREDIT。今回の限定source受付・同版保存と通常DB／API配置単位はCLOSED。実認証の本人端末一巡・新しい実4B作品／native画像・一般編集品質・全回答集合／多段訂正の完成へは換算しない。§9.60の実3本文・画像未確認という既存状態は保持する。

次は§9.54の一般本人説明・複数更新／依存を同じ有効意味として三中核へ通す責務、natural Analysisの根拠付き意味材料とNOT_GENERATED解消、実本文の意味／日本語品質、全蓄積・本人map訂正・IF／Saved。閉じたlatest一回答のsource／SQL／配置だけを再周回しない。build／TestFlight／本人実機保留、研究selector／新重み不採用、補助全体未完と既存期限を維持する。


<a id="shared-meaning-map-if-normal-rollout-20261114"></a>
## 9.62 2026-11-14 — 中断した共有有効意味・マップ本人訂正を通常反映、IF実生成の不成立を保存せず継承

### 引継ぎと実装範囲

前回の引継ぎ原本2件とPR3 `97af253d633cf2b168954a671d655984d226cae6`／PR30 `8382ef5dbb7f183df0f919ab62e6dae970f37e21`を取得し、全体現在地・最新weekly・本設計・全体地図・三中核の現ownerから未反映差分を確認した。`main`へ戻さず既存の作業lineageを継承。System Contextは現行入口から原本へ進み、旧cacheを現行全確認へ流用していない。巨大な全repositoryの全行を意味精読したという報告ではない。2補助agentは読取・点検だけ、変更と通常反映はrootが実行した。

| 能力 | 現在成立した接続 | 限界 |
|---|---|---|
| 共有有効意味 | 本人原入力・回答・明示訂正／撤回のactive材料をnaturalの既定profileへ渡し、同じ意味をPiece作者・Analysis source adapterへ接続 | 自由文を有限意味checkpointへ強制しない。未対応の意味更新を推測補完しない。一般本文・frame利用の品質は別に残る |
| natural分析材料 | 原根拠付き材料をOBSと同じ保存境界で保存し、累積source／Piece依存の版と資格を再確認。成立意味GENERATED、未対応／pendingはNOT_GENERATED・未判定 | `coverage.full_source_semantic_coverage=false`、`interpretation_status=UNASSESSED`。AI応答本文を本人事実へ戻さない |
| 現在map本人訂正 | 項目・線から「どの内容ですか？」「どう違いましたか？」を別入力し、map版・対象根拠・本人説明を保存。再入場、既存更新queue、次のsemantic材料、別出所の根拠表示へ接続 | 月次当時版は書き換えない。対象・説明不足をモデルで埋めない。一般訂正理解と本人端末の受入れは未完 |
| IF／Saved | Premium・適格現在map・SELF_ONLY、本人意向／制約・必要確認・1〜3候補・明示保存・note・非生成再読・削除を実装。予約／受領receipt／idempotency／中断復帰をDB ownerへ接続 | runtime実装と通常反映は成立。実4Bの候補意味採用／同raw保存再読は0で未完。選択を行動・達成・人格へ昇格しない |

API cb6301ed→最終da9460bの全53変更pathとRN ownerは[01Aの同日ファイル地図](../../01A_cocolon_overall_structure_app_foundation_home.md#shared-meaning-map-if-file-map-20261114)。共有意味／Piece／Analysis／IF／Savedの作者・採否・保存責任は既存ownerに残す。API・RNの新しい責任を同じ地図へ統合し、ファイル追加だけを活用成功へ数えない。

### 通常DB／API／workerへの反映

| 追跡migration filename | 稼働履歴version | 今回の操作 |
|---|---|---|
| `20261114120000_analysis_if_route_artifacts.sql` | `20261114104332` | 前回適用済みを継承し本文照合 |
| `20261114123000_analysis_emlis_material_handoff.sql` | `20261114104340` | 前回適用済みを継承し本文照合 |
| `20261114124000_piece_shared_analysis_material_fence.sql` | `20261114104350` | 前回適用済みを継承し本文照合 |
| `20261114132000_analysis_map_interpretation_corrections.sql` | `20261114105238` | 今回適用成功 |
| `20261114133000_analysis_map_correction_handoff.sql` | `20261114105248` | 今回適用成功 |

対象21関数の本文hashを追跡SQLと照合。map correction tableのRLS有効、service_roleの限定権限とsecurity-definer RPCの所有者・空search_pathを確認した。今回の分析／IF／共有材料に該当する新しいadvisor WARNは0。既存の別領域のadvisor項目を本単位で解消したとは扱わない。稼働本人データへの架空記録挿入・削除は行っていない。

API／workerを97af253へ先行反映し、続く受口修正 `da9460b926787c5f9e32995293dd232a2a74ab08`へ統一した。

| 対象 | 最終deploy | Live日時 |
|---|---|---|
| 通常API | `dep-dbs4a02fngtc73bm8rug` | 2026-11-14 11:26:02.684508 UTC／20:26:02 JST |
| 裏更新worker | `dep-dbs4bb49v7es73bldu6g` | 2026-11-14 11:28:29.253574 UTC／20:28:29 JST |

両サービスのlinked branch／autoDeploy設定は変更せず、既存手動の指定commit配置で反映。通常health／bootstrapは200。IF一覧・Saved一覧・map correction再読の未認証要求は401で、本人情報を返さない。IF／Savedの401はprivate,no-store。read-only要求のみで本人の生成・保存を実行したとは扱わない。RNは8382ef5のsource統合まで、配布8001と同版ではない。build／TestFlight／本人実機はMashの保留を継承する。

### 実4B受口・原出力・採否

既存4Bのsemantic-120u／natural base-851bf6e、同じadapter・重み・起動引数・cwd・環境と専用鍵の分離を保持し、IF schemaだけを既存受口へ追加した。公開固定sourceから該当関数を取得・hash照合し、独自Piece wrapper等を維持。disk変更だけでは反映されないため制御再起動を行った。旧PID98755→107884、origin束縛修正後108127。2回の前後で通常Emlis／通常Analysisの対照全文response bytes一致、health200。鍵は同Pod内の既存認証・復元だけに使い、値・環境全体を外へ出していない。新Pod・学習・重み／adapter変更・研究selector有効化0。

| 実要求 | CPU ownerの結果 | 保存 |
|---|---|---|
| 架空IF・30分条件の初回 | QUESTION_PENDING、CONSTRAINT_UNCLEAR | 候補artifactなし |
| 読む／見直す比較と午後合計30分・追加費用なしを明示 | 2scenarioのrawを受領したが、本人制約をOBSERVED_ANCHOR／anchor_ref=nullとして出力。`analysis_if_model_anchor_unbound`で拒否 | 0 |
| 同じ明示入力・生成時origin束縛の修正後 | anchor_refは固定されたが、制約文を元map観測として出力する混同が残り同理由で拒否 | 0 |

受口修正はorigin別oneOfでanchor_ref／field全文・参照番号・UNKNOWNを束縛する。固定LMFE0.11.3ではJSON escape入り全文を単純enumで生成できず、maxItems=0でも最初の要素を許す場合があるため、該当する原文は生成可能性を保ち、CPU ownerの完全一致・空配列検査を緩めない。新rawは修補せず、原preparedとmessages hash／raw hashを束縛したreceiptを既存Engineへ渡した。拒否を形式受理・保存成功へ数えない。生成制約の修正がIF意味品質を完成させたとは扱わない。

通常対照のEmlis本文は本人の明示訂正を保持し形式受理、Analysisは元の2入力から図・文章へGENERATED。Analysisの説明の不自然さ・二重否定等は残り、一般品質の合格ではない。実4Bの有効POSTは合計9（通常対照6＋IF3）。別に稼働確認pathの誤り404と、model名の誤指定400が各1あり、どちらも生成前の拒否。学習・自動再試行0。実ユーザーの保存一巡、残りのprepared各case、一般品質の追加比較を実行済みへ数えない。

### 検証の範囲

API97af253のAnalysis CI run43586587356／job132422305633は全step成功。pytest各stepは73／45／2882／1／1403／408の成功で、重複fileを含むため固有件数として合算しない。累積実SQLは201記録・15月次参照、IF／Saved隔離実SQLは予約・受領・同一再送・権利・保存再読・不変性・失効・削除・ACLを確認した。モデル部分は合成providerであり、今回の実IFraw保存成功の証拠ではない。

受口da9460bの影響範囲は既存packet・IF owner・ordinary semantic schemaの75件が成功。実LMFEで誤origin組合せ拒否、真正な改行anchor受理、USER_CHOICEの全文／参照とUNKNOWNの独立owner拒否、ordinary schemaの全byte hash不変を確認。新依存は製品へ追加せず、CPU検証環境にpytest／固定LMFEを用意した。

API97af253のPiece run43586587317は10分上限で取消。step1〜32成功、step33の主要群2424件成功まで到達、後続finite／native群は未実行。後続2群は今回runtime差分なし・前版85609406のrun43583460912で成功を継承するが、最新全CI成功とはしない。da9460bのPiece run43589511197も同上限取消、Analysis run43589511172／job132431059607は最終da9460bの全step成功。無変更のCI時間枠延長・全workflow再実行は行わない。

RN8382ef5の主要source1453件＋UI操作331件は成功。全workflowはiOS source timeoutで取消、iOS canvasの20分失敗を保持し、新build／native／TestFlight成功へ数えない。

実raw・前後対照・prepared・CPU採否とsource hashは非公開の `Cocolon_CMEE_SharedMeaning_Map_IF_NormalRollout_20261114.zip`（43,293bytes、SHA256 `803e73bcf5d1eeea4911496fad26a52547528ebcbb1815e7e84d8120b7e726b8`）へ回収・永続保管した。GitHubには本人本文・認証・環境値・個人原本を転載しない。

### 閉じた単位と次の工事

**共有有効意味・原根拠材料・現在map本人訂正のソース接続と通常DB／API反映単位は完了。IF／Savedのruntime実装・通常配置も完了したが、実候補の意味採用・同raw保存再読を含む単位は未完。** 次は元mapのAI観測anchorと本人セッション材料の混同を実生成で解消し、候補本文・図を原材料と照合した上で保存・再読・明示Savedへ通す。原出力の差替えや意味検査の緩和を成功手段にしない。

§9.54の四作業と全体完了目標を維持する。一般意味／文章化、過去／今回・本人判断の使い分け、長履歴分割・跨ぐ関係、通常採用版・研究重み／selector、統合RNの本人利用は残件。11/21判定・12/6候補、61.625％の管理評価は変更しない。配布／実機保留を他作業の停止条件へ戻さない。STRUCTURE_MAP_DELTA_PRESENT。


<a id="if-exact-quotes-saved-reuse-20261114"></a>
## 9.63 2026-11-14 — 完全引用と本人案の分離を実1／2候補の同raw保存・再読・Savedへ接続

### 今回閉じた範囲と残差

**現4BのIF完全引用と本人案の分離を修復し、実1／2候補setと各setからの明示Savedの隔離DB保存・別プロセス再読・既存RN受口、修正版の通常API／worker反映までを完了した。** これは実際の4B生成原本を使った限定接続単位であり、合成モデル応答の成功だけではない。3候補は不明情報のorigin分類と既知の順序の読取りが未達で拒否・保存0。実認証の本人端末・稼働本人データの保存一巡、一般品質、AR-07／補助全体は未完。

全体主枠§9.54／第11回議事録§5、三中核の現owner、アプリ全体地図と全ファイル地図を継承した。今回の差分は既存IFの生成制約・指示・受領照合の内部で、schema／policy／公開API／DB／RN契約や重みを変更しない。既存のEmlis／Piece／Analysis作者と保存境界を維持。新しい承認条件・発売条件・実行管理systemは追加しない。

### 修復した原因と実装

1. 固定LMFE0.11.3の改行等を含むenumと`maxItems=0`の制約を、**IF専用のprivate module namespace**で修復。JSONにescapeされた完全引用を元の一つのenumとして消費し、空配列を空のまま生成する。通常Emlis／Analysis／Pieceが使うupstream global moduleは変更しない。従来のescaped全文だけfree textへ広げる例外は削除した。
2. IFだけfield順を固定し、観測anchorを先頭、不明をUNKNOWNとして末尾にする。本人が出した各代替案を別scenarioへ分ける指示を追加。CPUの独立採否・原文一致・origin検査は緩めない。
3. 新指示の導入で旧RESERVED／RECEIVEDが詰まらないよう、旧／新の**既知のcanonical指示だけ**からrequest_refとmessages SHAの両方を再導出する。Engineと保存前照合を同じ導出へ接続。旧preparedは旧指示のまま、受領済みrawは生成0で再開し、旧新hashの混在・未知指示・raw改変は拒否する。保存済み本文を新指示へ貼り替えない。

API `edcd2c9c3dcade362b300f40bbcc8d77b8e8b028` → 最終 `f1a7d323efb070da746482b9ab428043cdd5cea9`。da9460bからの差分は7既存pathで、全remote bytesとchanged pathsを照合。owner対応は01Aの同日追記、IF／Savedの責任はcurrent03／04へ反映した。保存形式や公開契約の構造変更なし：STRUCTURE_MAP_DELTA_NONE。

### 現4Bの生成原本と採否

モデルは既存natural base-851bf6e／Analysis semantic-120u。Pod `f1lle4xwq3wjln`、同じ重み・adapter・起動引数・cwd・環境・専用鍵を維持。2鍵は同Pod内の既存認証と復元だけに使い、値・環境全体を保存・転載しない。新Pod・追加学習・重み変更・研究selector変更0。

架空の元記録2件、午後合計30分・追加費用なしという本人制約、読む／要点を書く順序の異なる本人案1／2／3件を用意。**DB native guardは実生成前に作成**し、準備済みrequestと送信messages全byteを照合した。後から生成に都合のよいguardや原文へ差し替えていない。

| 実行 | 受領と採否 | 保存の扱い |
|---|---|---|
| 初回・旧明示材料を同じpreparedで再確認 | 完全引用修復後はGENERATED。ただし本人案2件の分離を十分示さず、この原本を最終保存成果へ換算しない | 最終SQL成果に不使用 |
| 初回・新本人案1／2件 | 原raw受領、anchor欠落で拒否。全体495.075秒の境界で最後の3件要求を取りこぼし、元提供へ復元 | 拒否保存0。最後の要求はACK不明のまま |
| 最終・本人案1件 | stop、42.975秒、1513 response bytes。production transport→EngineでGENERATED | 1scenario set＋明示Saved1件を保存・再読 |
| 最終・本人案2件 | stop、96.565秒、3160 response bytes。別scenario2件としてGENERATED | 1scenario set＋明示Saved1件を保存・再読 |
| 最終・本人案3件 | stop、210.248秒、6470 response bytes。不明文を全てSIMULATED_EXTENSIONへ置きUNKNOWN nodeが欠落。また原案で示した読む順序を未提示とする文がある。`analysis_if_model_packet_invalid`で拒否 | 0。raw修補・型差替え・本文差替えなし |

初回は8POST提出／7原本回収、最終は5POST／5回収（IF3＋通常対照2）。今回計13提出／12原本回収／1ACK不明。全件完了とは数えない。最終batchは402.917秒、追加学習・自動再試行0。初回にチャット上で受領数・時間を目視誤読したため、JSON原記録に照合して訂正済み。

最終の通常Emlis／通常Analysisのresponse全文は、初回変更前の2対照と各byte一致。最終PID108787、提供source SHA256 `a1547b496993cafb8f381aa397ac9ea82166c4d1dafc0c7e785ef57e284c98a5`。最終sourceを提供中であり、初回timeout時の旧版復元と区別する。新しいIFの成功を通常日本語品質の全般合格へ換算しない。

### 保存・再読・アプリ受口

実生成後は追加モデル呼出し0。captured responseをproduction transportとEngineへそのまま渡し、receiptのrequest_ref／messages SHA／raw SHAを照合した。隔離PGliteの既存追跡SQLへ、productionのreserve→start→receive→commit→read／replayを通した。

- 実1／2候補の**2scenario sets**を元raw・本文・図・identityの同版のまま保存した。
- 各setから架空本人の明示選択を別のSavedRouteIntentとして**2件**保存。選択を実行・達成・人格へ昇格させず、元mapは不変。
- PGliteを終了して別processから開き直し、4artifactの同版一致を確認。productionのfrom_storage／safe reader DTOを通し、既存RN `checkedIfApplicationResult`も4件を同じobjectのまま受理した。
- 3候補の拒否を保存成功へ換算せず、稼働Supabaseへの架空ユーザー挿入・削除0。これは隔離DBの実SQL保存であり、本人端末や本番本人データの生成保存を実行した証拠ではない。

### 検証と通常適用

関連115件PASS（packet／IF owner／service／API／ordinary semantic schema）。旧予約は同じlegacy wireを1回だけ呼び、旧受領済みはmodel0で同rawへ復帰すること、混在hash拒否、改行・空配列・通常parser不変を確認。別のPiece受口回帰56件PASS。製品依存の追加変更はない。最新GitHub CIと原本archiveの確定情報は下記の反映記録を正本とする。

| 対象 | 最終版／deploy | 結果 |
|---|---|---|
| 通常API | f1a7d32／`dep-dbs55dafngtc73boees0` | 2026-11-14 12:24:38.579975 UTC／21:24:38 JST Live |
| 裏更新worker | f1a7d32／`dep-dbs55dl6e07s738rsm2g` | 2026-11-14 12:24:03.712265 UTC／21:24:03 JST Live |

linked branch／autoDeploy／環境設定は変更せず、既存manualの指定commit配置を継承。通常health／bootstrap200、IF一覧／Saved一覧の未認証readは401かつprivate,no-store。live生成・保存要求は送らない。DBは§9.62の適用済み5migrationを継承し、本単位で追加DDL0。RN source8382ef5、build／TestFlight／本人実機保留は維持。

最新f1a7d32のGitHub CIは **Analysis run43593816041／job132443978246、Piece run43593816030／job132443978255の両方で全step成功**。旧版の時間枠取消履歴とは区別し、既存workflowの制限延長や無変更再実行はしていない。

実原本・旧新prepared・DB guard／base・production採否・実SQL保存／別process再読・アプリDTO・再現script・最終CI／配置情報は、非公開 `Cocolon_CMEE_IF_ExactQuotes_SaveReuse_20261114.zip` **175,406bytes／SHA256 `01d990110fac9c1f6ff803e9065935099c74afa2fe5991b8530a541b1582eaef`** の同一成果物version1へ永続保存し、ZIP CRC検査済み。初回と最終のrawを両方残し、失敗原本・ACK不明を消していない。鍵・環境全体・DB cache・実ユーザー本文・モデル重みは含まない。GitHubへは原本本文を転載せず、この参照と限定判定を残す。

### 次に残す同じ仕事

1／2候補の完全引用・本人案分離・同raw隔離保存再読・Savedと通常API反映の限定単位は閉じる。次は、受領済み3候補に露出した**既知の順序を未提示にする誤読**と**不明内容のorigin分類**を実生成側で直す。UNKNOWN型を後付けしただけで本文誤読を成功扱いしない。閉じた1／2候補の再生成や同じmigration適用を繰り返さない。

§9.54の一般意味／文章品質、過去／今回・本人判断の使い分け、長履歴分割と跨ぐ関係も残る。11/21判定・12/6候補、61.625％の管理評価は据置き。研究重み通常採用、正式受入れ、AR-07／補助全体の完了は認定しない。


<a id="if-person-three-fixed-slots-normal-rollout-20261114"></a>
## 9.64 2026-11-14 — 本人提示3案を全anchor・UNKNOWNと同raw保存再読・明示Savedへ接続

### 閉じた仕事と採用範囲

**本人案が要求数そろう経路の実3候補を、原出力のまま採用→隔離DB保存→別process非生成再読→明示Saved→production DTO／既存RN受口→通常API／workerまで完了した。** 3scenarioを含む1setとSaved1件であり、3setsではない。先行§9.63の実1／2候補各1set＋Saved各1件も同版で保持し、今回保存後の別process再読まで不変を確認した。

同じ架空の元記録2件、午後合計30分・追加費用なしの制約と、20分→10分／10分→20分／15分→15分の本人案を使用。DB-native guardは元の実生成前に成立したものを保持し、今回都合よく作り直していない。同一開発材料での改訂比較であり、独立未学習holdoutや一般品質の合格率ではない。稼働Supabaseへの架空本人書込・削除0、追加DDL0。本人端末一巡と正式受入れは未確認。

00全文・01／01A／01Bの全体設計図／全ファイル地図・三中核入口・恒久incident・current ruleを読取分担し、最新weekly／本設計と対象の現owner・実sourceを確認した。全repository全blobの意味読了という報告ではない。EmlisAI／Piece／分析のexact3中核、共有有効意味・原根拠・作者・保存と公開の責任を継承。IF仮説やSavedを本人の観測事実・実行・人格へ戻さない。

### 原因・実装・互換

- 指示だけでは未知をSIMULATED_EXTENSIONへ置く、既知順序を未提示とする、本人案の再言い換えで午後→午前・分→点へ壊す問題が残った。形式を受理しただけで本文を採用しない。
- 要求数と同数の**異なる本人案がある場合だけ**、各案の全文をlabel／USER_CHOICEへ束縛し、全anchor各1＋本人案＋UNKNOWN_AFTERMATH、そのanchor群→choice→unknownの仮想接続を既存IFの生成slotへ固定する。不明本文・理由・条件・frictions／factorsはモデルが生成する。本人案の不足・重複、標準RN入力には従来の汎用生成を保持する。
- 固定LMFE0.11.3のprefixItems object tupleを、既にあるIF専用private namespaceのget_parser／list state内で扱う。object専用とし、nested property配列・enum完全引用・空配列・cloneと空白を確認。upstream global parser、ordinary Emlis／Analysis／Pieceは変更しない。生成後のraw修補・UNKNOWN追加・型差替えは0。
- 新指示に加え、旧4版の既知canonicalをrequest_refとmessages SHA双方から再導出する。旧RESERVED／RECEIVEDを旧prepared／同rawのまま再開し、任意promptや混在hashは拒否。CPU採否、公開API／DB／RN・storage schema／policy／artifact版、Safety・権利・依存失効は変更0。

f1a7d32→e540cf9→afe20f6→最終 **c7968c658277ec190c32d5e3913dbde13c01d68a**。変更集合は既存5pathだけで、全remote bytesとchanged pathsを照合。01Aの同日§9.64地図へ責務を反映。新owner／製品依存の追加0、STRUCTURE_MAP_DELTA_NONE。

### 実3要求の原本・採否

| 版／本人3案の1要求 | 実受領 | CPU判定／本文判定 | 保存 |
|---|---|---|---|
| e540・UNKNOWNと既知順序の指示強化 | 178.333秒／stop、5222 response bytes | GENERATEDだが、重ねたSIMULATED_EXTENSIONに午後→午前・分→点、labelに15分→資料半分の誤変換。本文は不採用 | 0 |
| afe・本人案全文とlabelを生成時に保持 | 140.528秒／stop、5007 response bytes | UNKNOWNの意向copy、3案目のUNKNOWN欠落・不在nodeへのedgeでREJECTED。別案の要点／明日の作業がfactors等へ混入 | 0 |
| c796・全anchor／本人案／UNKNOWNと仮想接続を固定 | **91.502秒／stop、4669 response bytes** | GENERATED。3labelと各USER_CHOICEは対応全文、既知順序・分単位・午後／明日の対象を保持。各UNKNOWNはその案の理解度・情報・一覧化に必要な不確定内容。独立した原材料照合でも明確な誤変換・虚偽断定なし | **3scenarioを含む1set＋架空本人の明示Saved1件** |

e540／afeの原本は消さず、不採用・拒否を保存成功へ数えない。最終も日本語全般の完成ではない。required_conditions空／追加費用なしの非再掲は表示coverageの残差であり、費用を要する新行動の提案はない。「未定」等の日本語と、第3案の「一覧にする」を「資料から決定できる情報」とやや狭く捉える説明は残す。これらを正式商品受入れへ換算しない。

最終のlabel・本文・UNKNOWN・全anchor・接続を独立実読し、別案の混入、選択済み／実行済みへの昇格、意図・因果・成功断定がないことを確認。構造検査だけで意味合格へ昇格していない。

### 同版保存・非生成再読

captured HTTP responseからproduction transportで受領receiptを作り、準備済みmessages全byteとrequest_ref／messages SHA／raw SHAを照合。production EngineのGENERATEDを、既存追跡RPCのreserve→start→receive→commit→read／replayへ通した。実生成後のモデル呼出し0。

- 同rawのscenario set1件を隔離PGliteへ保存し、架空本人の明示選択・任意noteを別source／別identityのSaved1件へ保存。
- DBを終了して別processで開き直し、両artifactのraw／本文／graph／identityが同一。元mapは不変。
- production from_storage／safe reader DTOを通し、既存RN checkedIfApplicationResultが両objectを変更せず受理。新build／native描画確認ではない。
- 今回の保存後にも先行1／2の4artifactを別processで再読し、旧本文と保存値の一致を確認。新CPU ownerでの旧実1／2は同storageのGENERATED、旧拒否3はREJECTEDのまま。

通常RNは現時点で本人案配列を送らないため、**今回の明示本人案3件の成立を、標準RN入力からの自動3案品質の成立へ換算しない**。既存公開APIは本人案を受けられるが、本人の実認証生成保存・端末一巡は未確認。

### 4B提供と通常反映

既存Pod f1lle4xwq3wjln、natural base-851bf6e／Analysis semantic-120u、同重み・adapter・args／cwd／環境・専用2鍵の分離を保持。既存Piece wrapperも保持し、IFの2関数だけをhash照合した公開sourceから差し替えた。鍵・環境全体は同Pod内の認証・復元メモリだけに使い、値を外へ保存・送信・転載しない。学習、新Pod、重み／adapter、研究selector変更0。

3実行は各600秒以内の限定実行。総elapsedは267.617／195.813／146.355秒。実要求は5＋3＋3＝11POST、全11原本を回収、ACK不明0。後2実行は直前に完走した対照の原本をbaselineとして保持し、対照の事前再生成を省略した。各実行後の通常Emlis／Analysis response全文はbaselineとbyte一致。最終PID109608、提供source SHA256 `4797918169fd3b9ec70aae8e5eabb32408dc325d260a537518fa6bca4fd2b095`。旧版へ復元済みという意味ではなく、最終版を提供中。

| 対象 | c7968c6のdeploy | Live日時 |
|---|---|---|
| 通常API | `dep-dbs67suc6qcc7389ldjg` | 2026-11-14 13:38:03.350862 UTC／22:38:03 JST |
| 裏更新worker | `dep-dbs6903l550s73filqd0` | 2026-11-14 13:39:58.056724 UTC／22:39:58 JST |

既存manual指定commit方式で反映し、linked branch／autoDeploy／環境設定は変更しない。health／bootstrap200、IF／Saved未認証一覧401かつprivate,no-store。稼働へのread-only確認のみで本人の生成保存は実行しない。13:36:51〜13:41:03 UTCの両app errorログ0。DBは既適用5migrationを継承、追加DDL0。RN source8382ef5、build／TestFlight／本人実機の保留は維持。

### 検証・原本

関連 **182 PASS（Piece受口56を含む）**。1／2anchor、labelとその本人案の対応、tuple欠落／追加／順序・端点、clone・許容空白、部分案／重複案の汎用経路、旧4版のRESERVED／RECEIVED再開と混在hash拒否、ordinary／Piece不変を確認した。新依存は製品へ追加しない。

最終c7968c6の **Piece CI run43599697053／job132461597333、Analysis CI run43599697070／job132461597386は両方全step成功**。途中版の失敗・旧版時間枠取消はその履歴として保持し、最終版へ読み替えない。CI制限延長・無変更の全workflow再実行は行っていない。

途中e540のPiece CIは、初回start()でpending_questionがない状態となる既存質問test1件で失敗。変更対象経路外で、単体1／module34／同じ14file順の307件は成功し再現しなかった。初回DTOがログになく原因未確定であり、後から設定するキャンセル用providerの時間を原因にはしない。製品コードやCI制限を無関係に変更せず、後続の実変更版CIを確認する。

実原本・準備済み材料・独立本文判定・隔離SQL保存／別process再読・DTO／RN結果・最終CI／配置情報を、既存非公開成果物の同一identityへ保全する。`Cocolon_CMEE_IF_ExactQuotes_SaveReuse_20261114.zip` **380,179bytes／SHA256 `eb0b764a1c0c063753d2b4745981102b2024af2269d63ab68986cf9879350755`、同一成果物version3** へ保存し、ZIP CRC検査済み。rootの§9.63原本を残し、three配下へ本節の3版原本・不採用判定・最終SQL／DTO／RN／CI／配置情報を格納。鍵・環境全体・DB cache・実ユーザー本文・重みは含まない。GitHubには原本本文を転載しない。

### 次に残す仕事

本人案がそろう1〜3候補の限定実生成・保存再読・Saved・通常反映は閉じる。次は§9.54の四作業と、本人案なしの標準RN入力からの実3候補、既知条件の表示と日本語の残差、一般意味／過去と今回・本人判断／長履歴の分割と跨ぐ関係を進める。先行成功1／2／今回3を同じ材料で再生成し続けない。AR-07全体・補助全体・正式受入れは未完。11/21判定・12/6候補、61.625％の管理評価を変更しない。配布／本人実機保留を他の補助作業の停止条件に戻さない。


<a id="if-standard-three-conditions-prepared-20261114"></a>
## 9.65 2026-11-14 — 通常入力の自動3案と本人条件の生成時保持を修復、実4B送付は審査で停止

### 成立した範囲と未完

本人案なしの標準RN入力で、全anchor・UNKNOWN・接続が自由生成のまま、既知条件を空欄にでき、CONSTRAINTをUSER_CHOICEへ使える原因を修復した。API候補 **d3daee549a848675cb200b3aa3360be38e94bf8f** の既存5pathへ反映し、全remote内容・変更path・親commitを読み戻して照合した。通常API／workerは先行c7968c6のLiveを継続し、本候補のPod適用・実生成・通常反映は未実施。本単位を閉じていない。

全体設計・全ファイル地図・三中核current owner・最新weekly§5／§19と本設計§9.54／§9.64を照合。共有有効意味・各coreの作者・観測とIF／Savedの分離を保持する。端末／build保留を本単位の停止原因へ戻さない。追加の安全装置・Gate・発売条件を作らない。

### 修復・全ファイル地図

| API既存path | 差分責務 |
|---|---|
| `ai/tools/serve_emlis_natural_reply.py` | 汎用IFも全anchor＋提案＋UNKNOWNと仮想接続を生成slotへ拘束。提案はmodelのSIMULATED_EXTENSION又は完全sourceのUSER_CHOICE。CONSTRAINTを本人選択へ転用しない。既知条件の全文／番号をrequired_conditionsのobject tupleへ固定。部分本人案は候補として保持。追加の仮定はUNKNOWN／frictions／factorsで表示する。 |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/if_route_realizer.py` | 標準生成の意味差・条件・日本語の指示を追加。直前版をFIXED_PERSONとして残し、旧5版のcanonicalをrequest_refとmessages hash双方で再導出。旧RESERVED／RECEIVED・保存rawを新指示へ貼り替えない。 |
| `ai/tests/test_cmee_current_4b_packet.py` | 現生成slotの合成例、全anchor／条件落ち・条件変異・条件のUSER_CHOICE化の拒否、部分本人案と既存実parser／serving closureを検証。 |
| `ai/tests/test_analysis_if_service.py` | 直前FIXED_PERSON版のRESERVED／RECEIVED非生成再開と混在hash拒否を追加。 |
| `ai/tests/fixtures/cmee_current_4b_packet_20261114.json` | IF1caseだけ新canonical指示・対応request／wire identityへ再導出。他5case全値不変。 |

IF専用parserのprivate namespace内で、tupleの提案slotにobjectのみのoneOfを許す。ordinary Emlis／通常Analysis／Pieceのupstream global parser、CPU意味採否、公開API／DB／RN・schema／policy／権利／Safetyを変更しない。新owner・新依存0、STRUCTURE_MAP_DELTA_NONE。三案の意味差・本人意向の反復・未知の適切さはgrammarだけで合格にせず、次の実raw全文読解を必要とする。

### 検証と保存の事前確認

- 最終関連5file **168 PASS／2既存warning**。最初のfixture旧slot期待の不一致と起動時のimport path不足は検証側で訂正し、製品の意味採否を緩めていない。旧actual1／2／最終本人3の3成功artifactと先行拒否3の採否を再演し、成功の全storage／Saved bytes一致・拒否維持を確認。新model call0。
- 通常serviceの_identity→_request→prepareから本人案なしの新requestを固定。元二記録・base・source guardは生成前の既存DBで成立済み。別のfresh隔離DBも追跡SQLだけで再構成し、同じsource guard／base contextを確認（snapshotのnow／period_endは実行時刻に従い異なる）。
- **合成出力だけ**でproduction transport→Engine→reserve/start/receive/commit/read/replay→別process再読→Saved→既存RN受口2artifactを事前確認。元map不変。実4Bの保存成功・本人認証・端末・品質改善へ加算しない。
- 既存Piece CI run43603427255／job132472861524はstep31で2FAIL／305PASSとなり後続step32〜は未実行。失敗はEmlisのinterpretation_corrections欠落／pending_question=None。今回の既存IF5path以外のsourceは変更0で、失敗2件の個別再確認は2PASS、同じ順序の14file全307件も144.56秒・既存warning1で成功。CI上の初回DTO／因果は未確定であり、原因を断定せず無変更全workflow再試行や無関係製品修正をしない。Analysis CI43603427323は記録時点step8進行中、成功未確定。

### 具体的に準備済みの一回と停止理由

| 同Podへ送るfile | bytes | SHA256 |
|---|---:|---|
| `if-standard-three-input.json` | 21,848 | `28e37c5a7d5bdff70fe98b46056791e3fcd254bec4ce2aecd7fbd3cce0c9ee34` |
| `if-standard-three-run.py` | 5,913 | `4ea093ba29a765f5350d86ee9d9847c4bdcdec6bea9a27de1f688f5bf0069bcf` |

既存Runpod `f1lle4xwq3wjln`／Jupyter `https://f1lle4xwq3wjln-8888.proxy.runpod.net/lab`へ合計 **27,761bytes・2file** を送る案。新しい標準入力IF3要求1回＋通常Emlis／Analysisの事後対照2要求、health前後2GET、既存直前の完走対照をbaselineとして使用。最大600秒、一回、追加学習／再試行／新Pod／重み変更なし。現提供PID109608とsource4797918…を起動前に照合し、不一致なら停止。公開GitHubの固定headのIF2関数だけをhash照合して差替え、既存args／env／cwdと2鍵を同Podメモリ内で保持。2鍵の用途はlocalhost認証と同Pod内復元だけ、値・環境全体・起動引数・serverログは回収ZIPへ含めない。失敗時は元sourceと提供条件へ復元する。

**この2fileの送付操作は自動承認審査で送信前拒否。** 理由は「Runpod/Jupyter宛ての実行コード・生成入力にprivate source-derived dataが含まれ得るが、その宛先への具体的な開示承認がない」。送信・起動・model POST・提供停止・再起動・新実本文保存は0。別経路で迂回しない。後続の独立静的照合で、送付入力は既存架空2記録由来のanchor・意向・条件と既存対照2件だけ、実ユーザー本文・鍵・環境値を含まないことを確認した。現Pod実行結果や復元成功は未確認である。

実行前の2file・cases／normal request・元base／guard・compile／SQL手順・関連検証／旧actual再演・合成事前保存再読／RN・審査停止を、非公開 [Cocolon_CMEE_IF_StandardThree_Prepared_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-097030f8a6b08191873a7c3b42532f8b_2f7470f963808191aaebf050935e72de&account_id=personal)（103,988bytes／SHA256 `f011e5d091d920962f23b73089e689b7346e02e349c995b69f8498005decd415`）へ保存。鍵・環境全体・DB page・実ユーザー本文・モデル重みを含めない。旧§9.64の原本archiveは更新しない。

次は上記具体送付・同Pod限定実行の承認を解決し、実3案を全文照合して同raw保存・非生成再読・明示Saved・通常API／workerへ同じ単位で反映する。低品質・意味変異は採用せず、raw補修で成功へ変えない。完了した本人1〜3案の再生成には戻らない。AR-07／補助全体・一般意味／長履歴・正式受入れは未完、61.625％評価・11/21判定・12/6候補、build／TestFlight／本人実機保留を維持する。今回は限定TECHNICAL_CREDIT（source修復と既存保存境界の保持）であり、実商品品質creditは0。


<a id="if-standard-three-actual-proposal-fix-20261115"></a>
## 9.66 2026-11-15 — 通常IF3の実原本はgraph未達で不採用、意向コピーの生成側原因を修復

### 承認された一回の結果

Mashは前回§9.65の27,761bytes・2file送付、既存PodでIF2関数差替え、自動3案＋対照2応答、最大600秒・一回、学習／再試行なし、既存2鍵の同Pod内認証／復元だけの利用を明示承認した。両file全byte／SHAは準備版と一致し、送付後の同Pod上SHA、PID109608と元source4797918…、新dir不存在を確認して一回起動した。前回の審査STOPからの承認解決であり、無承認の迂回・再試行ではない。

| 受領 | 結果 |
|---|---|
| IF-STANDARD-THREE | HTTP200／stop、109.866876秒、5,440response bytes／SHA `10913cf32da8ba1fae42177a2a28e58a7e52592a3357d8875d3e3a8f34a5d9c3` |
| 通常Emlis対照 | stop、1.385758秒、251bytes。先行完走baselineとresponse全byte一致 |
| 通常Analysis対照 | stop、35.819297秒、2,007bytes。先行完走baselineとresponse全byte一致 |
| 実行本体 | 167.909910秒、3POST提出／3原本回収、ACK不明0、学習／再試行0。前後healthと起動待ち確認を通過 |

PID109608→111162、同じargs／cwd／環境／専用2鍵・重み／adapterを保持。公開固定d3daee5のIF2関数だけを差替えたsource SHAは `f51c73df14a5e64405da7e0a13a2ff34b46425a6a475bedb8147446d48702862`。技術実行成功のためrunnerはこのIF版を提供したまま終了し、旧版へ復元したという報告はしない。通常API／workerの配置commitはc7968c6のままであり、d3又は後述7f51の通常API反映完了とは別である。

取得ZIP12,671bytes／SHA `9c2396e2017fbfb81f83cf4790db6cb961bf2af4ee66d71eaca6a68392da4beb` のCRC・全memberを確認し、送信wire・受領全response SHAと前後対照の完全一致をローカルでも再照合。回収はJSONだけで、鍵・env・args・serverログは含めない。

### 原入力と全3案を読んだ採否

本人案なしの意向、今日の午後合計30分・追加費用なし、保存済み元mapのanchorを使用。全3案でanchorと既知条件の全文は残り、午後／分の誤変換・本人の実行済み／成功済みの断定は見つからなかった。

一方、見出しは「要点をノートへ」「区切りごとに読んでまとめる」「全体読後に重要箇所を再読」と異なるが、**全3案のnodesとedgesは値が完全同一**。choiceはすべて本人の「進め方を仮に考えたい」という意向の全文をUSER_CHOICEとし、AIが作った具体的な進め方のSIMULATED_EXTENSIONは0。見出しだけに仮の作業があり、graphにはその道筋がない。UNKNOWNも全3同文で、将来の成果を「書かれていない」と説明する残差と日本語の不自然さがある。

production transport→旧Engineは同rawをGENERATEDとする。これは形式／出所整合の事実であり、3つの意味あるルート成立ではない。rootと独立read-only読解の両方で**商品不採用**。同rawを無修補で負例保存し、候補set／SavedのSQL保存・本人認証保存・通常API反映へ進めない。compileが作ったset／Savedのメモリ内serializationはSQL保存成功へ加算しない。本単位とAR-07／補助全体は未完。

### 共通原因の修復と互換

汎用choice候補にBRANCH_INTENTをUSER_CHOICEとして残していたため、モデルが全案でその文を選べた。既存serve_emlis_natural_reply内の条件を、CONSTRAINT以外ではなく**PERSON_ALTERNATIVEだけ**へ変更。本人案なしのchoiceはSIMULATED_EXTENSIONだけとなり、部分的な真正本人案は全文引用USER_CHOICEとして維持する。見出しとchoiceに同じ具体案を表すこと、未来の未観測と本人の記録不足を区別することを既存IF作者指示へ追加した。

前回d3のcanonical指示全文を_STANDARDとして保持し、旧6版のRESERVED／RECEIVED・同raw再開・混在hash拒否を継承。全anchor／条件固定・公開API／DB／RN・policy／schema／保存の非生成・ordinary parser・権利／Safetyは不変。修復5pathは前節§9.65と同じ既存製品2＋test2＋fixture1で、新owner／依存0、STRUCTURE_MAP_DELTA_NONE。

API候補 **7f51a64e6cb58668ad5d418480b7de4499bfe6fa** へ反映し、全5remote内容・変更path・親d3を照合。関連最終 **171 PASS／2既存warning**、新maskが今回rawを変更せず拒否すること、部分本人案・旧指示再開を確認した。意味本文を後付け補修せず、今回rawを新修正の実4B成功へ昇格しない。新maskでも生成内容の具体性・案の相違・labelとの一致は実raw読解を要し、未実証。

### 次の追加一回を具体化（未送付・未実行）

| 新しい送付対象 | bytes | SHA256 |
|---|---:|---|
| `if-standard-proposal-three-input.json` | 22,535 | `7724fab693a7b801ca0ebcbf9045e4ba5ae4b65a4bde3b3f50f7c16a731c2eff` |
| `if-standard-proposal-three-run.py` | 5,945 | `6907bea627b5d75f97e1c3a6260527a243e25a3d1bc6e195900479046ea7c407` |

合計 **28,480bytes・2file**。同じ架空二記録・本人意向・条件から、通常service _identity→_request→prepareと通常HTTP factory captureを通し、送信wire全値一致。新idempotency keyと新canonical指示、要求数3、本人案配列なし。本文を書き足した候補や新しい私有入力は含めない。新Pod送付・GPU生成・provider差替え0。

宛先は既存Pod f1lle4xwq3wjlnの同Jupyter／workspace。固定7f51公開sourceのIF2関数だけを差替え、source270e9ea…をSHA照合する。期待現提供PID111162／sourcef51c73…不一致は停止。IF3要求1回＋通常Emlis／Analysisの事後対照2要求、直前完走原本をbaselineとし、前後health／起動待ち確認を含め最大600秒・一回・学習／再試行／新Pod／重み変更なし。2鍵は同Pod内メモリのlocalhost認証／復元だけ、外部取得は固定公開GitHub sourceのみ、失敗時は元提供条件へ復元する。

先の一回分の承認は実行済みのため、この修正での追加一回は新しい具体承認を必要とする。受領後、全rawを読み、意味採用できた出力だけ同raw保存／非生成再読／明示Saved／既存RN受口／通常APIとworker反映へ同じ単位で進める。新たな学習・無制限再生成・全体Gateは追加しない。

### 証拠・CI・現在地

先行d3のAnalysis CI43603427323／job132472861742はattempt1・全step successをfresh確認。Piece43603427255のstep31の2失敗と後続未実行は維持し、ローカル同順307成功をCI成功へ換算しない。新7f51はAnalysis run43625900326／job132541511887のstep8、Piece run43625900352／job132541512127のstep31が記録時点で進行中、両結論未確定。旧成功の流用や無変更再試行はしない。

旧preparedを全member保持した同一非公開成果物 [Cocolon_CMEE_IF_StandardThree_Prepared_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-097030f8a6b08191873a7c3b42532f8b_2f7470f963808191aaebf050935e72de&account_id=personal) **version1／208,808bytes／SHA `012aaf86f0c7001b9a3f2bcb0125b8c5f176ca858f0d9d049470d20d0c4216e6`** に、実原本・否採用判定・171検証・新2file／通常prepared／再現手順を保存。actual_20261115とproposal_fix_preparedを分け、合成事前検証を実生成へ混ぜない。鍵・env全体・DB page・実ユーザー本文・重み0。

限定TECHNICAL_CREDITは条件保持の実証と意向コピー経路のsource修復だけ。自動3案の完成・正式商品受入れ・通常反映・補助全体を認定しない。11/21判定・12/6候補・61.625％管理評価、build／TestFlight／本人実機保留は据置き。


<a id="if-standard-proposal-three-normal-rollout-20261115"></a>
## 9.67 2026-11-15 — 標準入力の自動3案を同raw保存・再読・通常反映まで完了

### 承認と実行範囲

Mashが§9.66の新28,480bytes・2fileの送付、同PodでIF2関数差替え、自動3案＋対照2応答、最大600秒・追加一回・学習／再試行なし、既存2鍵の同Pod内認証／復元だけの使用を明示承認した。送付前後の2file全byte／SHA、元PID111162／sourcef51c73df…、新dir不存在を照合して一回だけ起動。承認済み以外のmodel生成・学習・再試行・新Pod・重み変更0。

| 実受領 | 結果 |
|---|---|
| IF-STANDARD-PROPOSAL-THREE | HTTP200／stop、131.220893255秒、6,028bytes／SHA `07891f5a3aae686e39089b6939ffbef257a01e08a07fa225c6074d231d779a15` |
| 通常Emlis対照 | HTTP200／stop、1.424203538秒、251bytes、直前完走原本と全byte一致 |
| 通常Analysis対照 | HTTP200／stop、35.889784782秒、2,007bytes、直前完走原本と全byte一致 |
| 実行全体 | 188.483631987秒、3POST提出／3受領、前後health・起動待ち確認通過。baseline再生成0 |

公開固定7f51 source270e9ea…から_if_output_schema／_if_json_schema_parserだけを差替え。PID111162→111294、提供source SHA `ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be`。同args／cwd／環境／2鍵／重み／adapterを保った。この版を通常提供中で、元のIF関数へ復元したとは記載しない。回収ZIP13,286bytes／SHA `9d896bc52eb6b26fa9c8658d887dcf5f45dbb54b8f7703b080c1eead0349687f`、CRC・全member・送信wire・全応答SHA・対照一致を照合した。JSONのみ回収し、鍵／env／args／serverログを外部へ出していない。

### 全3案の意味読解と限定採用

本人案配列なしの標準入力を使用。前節の同一graph問題に対し、今回はchoice本文自体が次のように異なる。全choiceはSIMULATED_EXTENSION、元anchorと本人条件は全文一致。本人の実行・選択済み・成功・人格・おすすめ順位の断定は見つからなかった。

| 案 | choiceの具体手順 | 未観測として残したもの |
|---|---|---|
| 1 | 読む前の確認→読みながらメモ→読後のまとめ | 得られる情報・理解度の変化 |
| 2 | 先に目的／疑問をノートへ書く→資料を読む | 読む時の焦点・得られる答え |
| 3 | 図表を先に見る→文章を読む | 理解・メモの変化、図表自体の存在と比重 |

UNKNOWNは将来の未観測結果であり、前回の「本人が成果を書いていない」への転換を解消した。案3の図表は観測事実にせず、存在不明をunmodelled_factorsへ明示した仮の経路として限定採用する。rootと独立read-onlyの両者が全raw・原材料・全graphを読み、この架空1setは採用可能と判断。意向文の前置き反復、案1／2の部分重複、硬い表現、分単位の配分なし、図表の適用条件を見出しにif表示していない点は残差として記録。一般品質・本人が実用できたことへ拡大しない。

### 原本を変えず保存・別process再読・既存RN受口

受領rawを無修補でproduction SelfHostedAnalysisIfModelSourceへ返し、prepared送信wire全値一致、Engine GENERATED／analysis_if_model_set_generatedを確認。そのartifactを既存RPCのreserve→start→receive→set_commitへ渡し、**候補set1（3案）と明示Saved1を隔離PGliteへ保存**。別Node processで既存artifacts_readから両行・全storage値が一致し、同operation replayは同id、元observed mapとprivate evidenceは不変。Saved選択は検証用架空の明示入力であり、Mashの本人選択と記載しない。

再読したSQL行からproduction _safe_rowを通し、既存RN checkedIfApplicationResultがscenario_set／saved_intent両DTOを受理。再現／保存／再読でmodel追加call0、実Supabaseへの架空owner／本文書込0。これは既存の通常SQL／API保存実装を使った隔離証拠であり、本人JWTの通常live保存、本人画面、native画像、buildの実証ではない。IFにPiece画像経路を追加しない。

### 通常API／workerへの固定commit反映

既存workspace／2service・元Livec7968・自動配置OFFをfresh確認。MCPのdeploy操作はcommit指定を持たないため、既存DashboardのDeploy a specific commitから検証済み7f51を選択し、両新deploy IDと同commit LiveをMCPと画面の両方で確認した。branch main／autoDeploy noは据置き。

| 通常配置 | 固定commit | deploy／終状態 |
|---|---|---|
| mashos-api | `7f51a64e6cb58668ad5d418480b7de4499bfe6fa` | `dep-dbsakomk1f9s738on9a0` Live、2026-11-14T18:38:47.602024Z |
| mashos-astor-worker | 同上 | `dep-dbsalcbbc2fs73b2bnt0` Live、2026-11-14T18:39:31.617780Z |

反映後healthz／app bootstrapはHTTP200、未認証IF／Saved GETは401・private,no-store。worker新instanceの起動・DBキューpolling・queue statsを確認。ready0／running0／stale0、既存failed171は先行状態と同数で、今回再実行・消去していない。観測窓の新errorログ0。今回の新実job処理成功・過去失敗解消とは報告しない。従来のsubscription URL未設定warningは残る。

### CI・証拠・閉じる範囲

関連171PASS／既存warning2を継承。新7f51のAnalysis CI43625900326はattempt1 **success**を終状態確認。Piece43625900352はstep31の307PASSを含め32まで成功後、step33の89％でcancelled、step34未実行。10分job枠と10分16秒の経過は整合するが、取消理由は断定しない。CI再実行0。同step33を既存環境で同順一回実行し、31file **2424PASS／warning1／241.61秒**、B8選択5file **78PASS／420deselected／1.11秒**。source前後SHA一致。native PostgreSQLを要するstep34は環境未提供のため未実行で、全CI成功へ換算しない。

同一非公開成果物 [Cocolon_CMEE_IF_StandardThree_Prepared_20261114.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-097030f8a6b08191873a7c3b42532f8b_2f7470f963808191aaebf050935e72de&account_id=personal) **version2／325,904bytes／SHA `56d1a8c18f165f71ad7b56d6aef27992812eecda81592931c6a7fea53c1c3a54`** へ、旧68memberを全byte保持し、今回原本・独立読解・SQL再読・RN・配置・CIを追記保存。旧負例／合成preparedと今回actualを分けた。鍵／env／DB page／実ユーザー本文／重み／browser screenshotを含めない。

**本人案なし標準自動3案の限定接続・同raw保存再読・通常反映の作業単位は完了。** 既存公開API／DB／RN／owner配置は変更せず、前節5pathのsource採用でSTRUCTURE_MAP_DELTA_NONE。三中核の通常材料・認証・保存の境界を保持。AR-07の一般品質・正式本人受入れと、他AR／補助全体は未完。次は週次§5に沿う残件を進め、この1setを全体完成に数えない。管理評価61.625％・11/21判定・12/6候補を据置き、build／TestFlight／本人実機保留を再承認条件にしない。今回承認の追加一回は消費済み。


<a id="piece-effective-round-sources-and-if-saved-marker-20261115"></a>
## 9.68 2026-11-15 — 先行本人更新を後続Pieceの有効sourceへ接続し、IF保存意向を候補カードへ表示

### 全体方針と今回の単位

週次§5の本人更新を三中核で一貫して扱う作業と、成立した能力を同じ単位で通常へ出す作業を継承。前節§9.67の標準自動IF3は限定接続単位として完了しており、同じ実生成を繰り返さない。今回は、先行する真正REVISE／WITHDRAWがあるため後続回答からPieceを作れなかった接点を、既存の共有意味・source adapter・作者・SQLへ通す。IFの候補本文・条件／負荷／未知は既に表示されるため表示欠落として新設せず、明示保存後にどの候補を残したかを示す表示だけ補う。

### 有効な本人sourceだけをPiece作者へ渡す

自然Q3の第2／3回答で、選択した最新ANSWERだけを見る旧ADD前提では、先行訂正・撤回の有効状態を作品へ運べなかった。既存Emlis ownerから各round prefixのrequestとcheckpointを再導出し、保存イベント／receipt／順序／ANSWER／QUESTION／操作対象・原根拠／時点・有効／失効の全値一致を確認する。AI応答本文は本人sourceへ採用しない。Analysisのtyped解釈成立をPieceの前提にせず、共有Emlisで解決済みの本人更新を使う。

| 既存owner | 今回の責任 |
|---|---|
| `piece_v2_source_adapter.py` | 真正な2／3prefixを再導出し、残る原入力の節・失効していない先行REVISEの置換節・明示選択した最新補足だけをhandoffへ保持。先行ADDは資格照合だけに使い、無関係な本文へ連結しない。先行置換を後続で再訂正／撤回した場合は有効な節だけ残す |
| `cocolon_meaning_experience_engine/piece_refined.py` | 原入力と各本人回答のenvelope／絶対scalar・UTF8根拠を分離したまま、active originalとprior revisionsを既存意味・planへ渡す。訂正syntax内の旧引用・locatorは新事実にしない |
| `cocolon_meaning_experience_engine/preparation_sources.py`／`piece_model_source.py` | 有効な原入力の範囲と、それぞれのANSWERの原source ID／役割を保持して既存prepared・作者材料へ投影。凍結preparedを変更せず、原入力の偽連結sourceを作らない |
| `piece_v2_store.py`／既存SQL3関数 | private expected source stateに`meaning_checkpoints`（2／3prefix全件）を渡し、source lock下で保存済みの各checkpointと原回答・依存・失効を再照合。preview発行／見た目変更／保存の途中で旧prefixへ戻したり、先行targetをすり替えたりできないよう既存境界へ接続 |

原入力七項目・全ANSWER envelope・元source／record／版・原文hash／絶対根拠範囲・選択した最新回答identityを保持する。全原文は安全確認・lineageに残し、失効節／無関係ADD／旧引用を作者本文へ渡さない。旧ADDのprivate bytesは新fieldを空追加せず保持。既存唯一作者／独立S7、short_essay等の形式資格、最大3body block、recipe／renderer・公開契約・保存／quota責任を変えない。3blockを超える構成、原入力の有効節が0、未解決・複数操作混在・現文法で完全性を証明できない更新等は拒否を維持し、全多段・一般自由文訂正を完成扱いしない。

### SQLと通常経路の証拠

今回のmigration `20261114190006_piece_natural_effective_round_sources.sql` を使い、`piece_issue_preview_v2`／`piece_mutate_preview_visual_v2`／`piece_save_v2` の既存private expectation照合だけを拡張。公開RPC署名・top-level引数・ACL／RLS・table・原入力／eventの保存形は変更しない。従来のlatest-only `meaning_checkpoint` と新all-prefix `meaning_checkpoints` は同時指定しない。

既存正例4構成は、先行REVISE→最新ADD、先行WITHDRAW→最新ADD、先行置換への後続REVISE、先行置換への後続WITHDRAW。正常な作者本文に未変更原節と有効置換／最新補足を含み、失効した旧節を含まないことを確認したうえで、実装の通常preview→明示保存→owner再読へ接続する。初期の4SQL PASSは隔離・合成認証／providerの証拠で、新実4Bや実ユーザー一巡ではない。全最終検証・否定条件・既存回帰の結果は下記に記録する。検証過程の失敗logは保全し、途中成功だけで最終全成功としない。

既存 `.github/workflows/piece-b2b-isolated-postgres.yml` に、`test_b05_effective_round_source_contract.py` と `test_b05_effective_round_sql_fence.py` を既存検証集合として登録する。前工程で同じ既存suiteが10分job枠の途中で取消となったため、job全体の枠だけ10→20分へ変更し、途中までの実行を全成功へ数えず最後まで確認する。これはCI実行枠であり、製品生成・モデル／GPU・一回承認・retry・通常の待機時間上限を変更するものではない。検査内容・採否を緩めず、新しいchecker／workflow familyは追加しない。新commitのCI終状態は最終検証欄に記録する。

- 今回のAPI採用commit：`fc333bff8a76775d6fe14ed299ea769d22d35c9d`
- 最終検証と範囲：最終test head e5784520f640d119b8d0e285e8d2f03cd46032c8で、Piece CI43637154662は全41工程・5,513 PASS、Analysis CI43637154763は全19工程・4,865 PASS＋12,995 subtests PASS。両runともattempt1、FAIL／SKIP／ERROR0、head・終状態・job logを照合済み。各pytest invocationの重複を含む数をunique件数や商品完成率へ加算しない。CI同版PGlite0.5.8の最終localは14file307＋33file2,466＋B8選択78＋直接9の計2,860 PASS。先行0.3.14の結果は補助として分離。Cocolon b2ac790のRN操作契約jobは1,790 PASSだが、同workflowのiOS V4 nativeは1 PASS／19 FAILで全体failure、画像合格未認定・原因未解決。native source変更／再実行0、配布／本人実機保留を維持。
- 必要migration／通常API・worker反映と確認：migration piece_natural_effective_round_sourcesを稼働履歴20261114192124へ一回適用（CLI原本20261114190006）。3既存RPCだけ全prefix expectationへ接続し、4関数の署名／ACL／SECURITY DEFINER／search_pathを前後一致確認、旧5引数preview本文は不変。API dep-dbsbbac9v7es73c7urtgは2026-11-14 19:26:47 UTC、worker dep-dbsbc10ae00c73d3supgは19:27:48 UTCに同じfc333でLive。health／bootstrap200、IF／Saved未認証401＋private,no-store、Piece本人履歴未認証401＋既存no-store。新worker起動とqueue GET200、failed171据置き、限定時間内の新error0を確認。実job成功・実ユーザー保存一巡の確認ではない。締めのread-only確認でも指定2deployのfc333／Live維持と、5GET各1回の200／200／401／401／401・既存cache契約一致を確認した。

model source OFFの既存作者による通常経路と、model用の分離source投影を区別する。後者の材料確認／合成provider保存成功を、実4B本文品質改善へ数えない。今回のGPU生成・学習・再試行0。新しい提供key、別provider、新renderer、新しい意味管理serviceを追加しない。

### IFの保存した関心を同じ候補へ示す

既存RN `components/selfStructure/AnalysisIfRouteDialog.js` は、Saved API応答の`source_scenario_set_ref`／`selected_scenario_ref`が送信した選択と一致した場合だけ、同じ候補カードへ「保存した関心の方向」を表示する。別set／scenarioの成功応答や、結果不明の保存から印を作らない。複数候補の明示保存は共存し、同setの再GET後も確認済み印を保持、削除成功／404で該当印を除く。本人・表示contextの失効時は旧応答を再利用しない。印は同じ表示状態で保存成功を確認したものに限り、別の起動・端末で以前に保存した履歴へ推測で付けない。

Savedは実行・達成・人格へ昇格しない。元観測map／IF候補／保存意向の別identity、任意メモ、非生成再読／削除は既存contractを継承する。RN検証は上記最終結果へ含めるが、build／TestFlight／本人端末確認には換算しない。標準自動3案の実4B1set・同raw保存再読・7f51通常反映は§9.67の成立資産として保持する。

### 最終採用と検査準備の整合

通常DB／API反映までのこの限定単位を完了。製品採用はfc333、RN sourceはb2ac790。診断／検査データの追加a0a5→ef2→e578は既存13testfileだけで、製品5module／新SQLのbytesはfc333から不変である。新しい製品配置・GPU生成を、この検査差分のために繰り返していない。

初回CIの失敗は隠さず記録した。ef2Analysisの4件はAnalysisSourceError／as_of_not_after_sourceの拒否クラスを確認し、他の過去失敗を同原因へ統合していない。共通の保存済み架空入力を分析より前へ置く前提を13file・24source site（INSERT10＋callerSELECT14）で整合し、old親1分前＜後続5秒前、明示future／equality／retention／固定source／actual submit、判定・実時計・deadline・retry／skipを保持。既存Piece2helperの1時間前も維持。共通診断は本文を含めず、正常時の追加DBread0、元DTO・例外・keyword signatureを保つ。独立reviewと143test-module依存追跡で対象クラスの残存・修正必須なしを確認した。途中headの失敗と成功は最終headに合算しない。

検証原本・失敗履歴・source hash・通常反映・最終CIは、[Cocolon_CMEE_Piece_EffectiveRounds_NormalDB_API_20261115.zip](https://chatgpt.com/library?file_id=libfile_fde3_f-b10509fdc35c8191a7584e458fd46c7a_2f7470f963808191aaebf050935e72de&account_id=personal)へ保管。実ユーザー本文・鍵・起動環境・重み・ブラウザ画像は含めない。

### 残る範囲

この単位は、成立済みの本人更新を後続作品へ運ぶ接点と、確認済み保存意向の表示を閉じるものである。一般的な訂正理解・任意の多段／依存を跨ぐ更新、Emlis本人判断／時点の本文品質、Pieceの複写を越える一般編集品質、Analysisの記録間意味・長履歴・本人利用、研究model selector／重みの採用、正式受入れ・補助全体は未完。§5の三中核をまとめる主枠を維持し、単語修正や同じhint比較の直列へ戻さない。build／TestFlight／本人実機の保留、11/21判定・12/6提出可能候補・管理評価61.625％を維持する。

STRUCTURE_MAP_DELTA_PRESENT：既存shared meaning→Piece source adapter／plan／保存競合の有効source境界と、RNのSaved表示状態を更新。新owner・公開API／DB／RN wire・table・依存を増やさず、全体地図01A、Piece02、Analysis03、CMEE04と全製品00を同じ資料単位で更新する。


<a id="piece-corrected-observation-source-20261115"></a>
## 9.69 2026-11-15 — 応答への二入力本人訂正を、別sourceのPiece作成・保存再読へ接続

### 本人更新と三中核の責任

週次§5.3の未接続を進める。問いへのANSWERの更新（§9.68）と、完了したAI応答への「どの内容ですか？／どう違いましたか？」の訂正は別履歴である。今回のproper sourceは既存InterpretationCorrectionSource／USER_INTERPRETATION_CORRECTION。correction_idをanswer_idへ付け替えず、QUESTION・意味checkpointを合成しない。原入力七項目は不変、AI対象文はlocator/controlのまま、本人説明だけを独立envelope・絶対scalar／UTF8根拠へ保持する。

既存Analysis source freezerと_active_sourcesの原根拠更新責務を再利用する。Analysis graphの生成成功をPiece資格の前提にせず、完全な本人節への一意な引用REVISE／WITHDRAWと有効範囲を再導出する。原入力の残存節＋本人の有効置換だけを既存Piece作者・独立S7へ渡し、旧引用／撤回節／AI対象文を本文へ復活させない。Emlis本人宛本文と解釈UNASSESSED／meaning_updated=falseは元receiptのまま、Pieceのsource証明で書き換えない。一般的な訂正理解を完成扱いしない。

### 現ownerと採用範囲

| owner | 差分 |
|---|---|
| piece_v2_source_adapter／preview／source_ref_http | proper corrected handoff、保存済INITIAL→訂正→FINAL receipt→CORRECTED→finishとsource／contextの再導出。7key source_refにcorrected_observationだけを追加しquestion／supplementalはnull、表示対象のOBS identityを保持 |
| piece_refined／piece_source／piece_v1c・semantic_admission／preparation_sources／piece_model_source | corrected専用private snapshot／本人説明meaning。既存作者・S7・serialized再読を使用、作者向け材料は有効sliceだけ。AI targetや旧引用を送信本文にしない。as_ofは資格時刻でsource identityを変えない |
| piece_v2_generation／safety_review／content_policy | 新型dispatch、原入力全文と本人説明の個別scan、親sourceからのS7全体再導出。合法な別訂正のchild／plan借用も拒否。short_essayのみ、最大3body blockと旧形式資格を保持 |
| piece_v2_store／既存3writer／Piece CHECK | private interpretation_correction期待をlocked full events／thread_data／metadata・explanation hashへ照合。prefixを元INITIAL Q3prefix＋proper sourceから独立再導出。既存署名・ACL／RLS・旧5引数preview／quota・時計・context／frame失効を保持 |
| RN EmlisThreadModal／InputPieceActionArea／pieceApi／PieceCreateController | 「説明を含めてピースを作成」。表示OBS・stageとGETの一致を必須にし、取得途中の別訂正・再確認／結果不明POST／保存復元の乗換えを拒否。query・store keyは追加しない |

対象は初回訂正1件・ANSWER0・完了CORRECTED／FINAL、原active節が残る完全引用REVISE／WITHDRAW。複数訂正・ANSWER併存・曖昧な説明・原active0・3block超過・依存／未証明の更新は拒否を維持する。旧normal／pre_question／refinedのsourceとprivate bytesは継承。lineageはcorrected stageだけbody-free interpretation_correction_source（correction_id／metadata source_version／explanation_commitment／target_event_id）を持ち、本人sourceとAI対象を混ぜない。新サービス・作者・table・model provider・rendererは追加しない。

### 商品結果と検証の範囲

修正前はUIとAPIの両方で二入力訂正後のPieceを作成できなかった。修正後はFree／Plus／Premiumの訂正・撤回各1構成（6作品）と、思考／行動二欄＋本人置換の1作品を既存通常作者から作成し、preview→見た目変更→明示保存→非生成再読へ通した。原「私は本を読みたい。私は仕事を続けたい。」への本人置換では未変更の読書と新しい家族を守る希望だけ、撤回では読書だけが残る。二欄では「私は資料を調べた。」も同じ原fieldで保持。保存本文／payload／recipe・hash一致、quota各1、原入力とEmlis events／thread不変。

これは合成Auth／recipient providerと隔離PGlite0.5.8の証拠で、新実4B・liveでの本人保存・native bitmap成功ではない。model selectorはOFF。model用source分離／無修補受領・graft拒否・別process再導出のCPU確認を、4B本文改善へ換算しない。従来のV4 native 19失敗は未解決、build／TestFlight／本人実機保留を維持。

### 最終検証・通常適用

**二入力訂正からPiece作成・保存再読への接続と、通常DB／API反映の限定作業単位は完了。** API sourceは09f1fbc373964cf7f2e965c9e05ef69e2a227434、最終配置版はe5a1dc6895110edfa10928c2470fb8cad98becd6。後者は旧7f51比較fixtureとworkflowの2fileだけを修復し、product14fileは前者と全byte同一。RN sourceは2ccae9c0a3fc53cc55c22c554188a318ee69a536。全remote内容・親commit・変更pathを照合した。

| 検証 | 実結果と境界 |
|---|---|
| 隔離application／SQL | 最終59 PASS＝application14＋SQL45、FAIL／SKIP0。3plan×訂正／撤回の6作品＋二欄1作品を含む。追加5件の受付再確認は重複加算しない。HTTP66件・coreの新53件・RN local231件も個別記録し、総固有件数へ足さない |
| API Piece CI | 最終e5a1のrun43647458738／job132608326397、attempt1、全41工程success。27 invocationで5628 PASS・FAIL／SKIP／ERROR0、420 deselected。呼出し間の重複を含む実行件数で、総固有件数ではない。旧09fのrun43645344333は旧版4moduleと現reader混在によるImportErrorで1失敗。固定7f51とprepared／messages／private保存bytesの3比較を変えず、旧依存10module・旧Request／prepareへ統一し、新自動CIで解消。rerun／dispatch0 |
| API Analysis CI | source09fのrun43645344316は全工程success、4865 PASS＋12995 subtests PASS、FAIL／SKIP／ERROR0。test-only最終e5a1には新Analysis runなし。source14file同一の比較証拠を添え、同headでの新成功とは記載しない |
| RN CI | source2ccのrun43645648148でRN契約1499＋342＝1841 PASS、FAIL／SKIP／cancel0。local231と重複するため合算しない。workflow全体は既存iOS V4 nativeの1成功／19失敗でfailure。失敗IDは先行b2ac790と一致、新ID0だが原因未解決・画像合格未認定。path filterでskipした画像工程も成功へ数えない |

通常DBにはCLI版20261114213309_piece_interpretation_correction_source.sqlを一度適用し、履歴version20261114215806／name=piece_interpretation_correction_sourceを確認。既存3writerの変更後定義から許可した3差分だけを戻すと、適用前の関数MD5に全一致。旧5引数previewは本文MD5も不変。4関数の署名・SECURITY DEFINER・search_path=pg_catalog・ACL、Piece recordsのRLS／FORCE RLS・table ACLを保持。既存CHECK2つを拡張、補足境界CHECKは定義不変、全3つvalidated。advisorsは前後7件／新規0。実本人行の読取・保存は行っていない。

| 通常サービス | 指定版の終状態 |
|---|---|
| API | dep-dbse3p56e07s739jfaug、2026-11-14T22:35:36.883906Z UTCにLive、commit=e5a1dc6895110edfa10928c2470fb8cad98becd6 |
| worker | dep-dbse4bk9v7es73cetf20、2026-11-14T22:36:23.709208Z UTCにLive、commit=e5a1dc6895110edfa10928c2470fb8cad98becd6 |

反映後healthz／bootstrapは200、未認証IF／Saved／Piece source_ref／owner historyは401、各既存no-store契約を確認。worker新instance rnc7mの起動・DB poll200とqueue stats（ready0／running0／stale0／既存failed171）を確認。両serviceの反映後〜22:37:15 UTCの観測窓でerror levelログ0。これは実job成功・既存failedの解消・認証済み生成保存へ換算しない。通常設定・料金・quota・モデル／重み・selectorは変更せず、アプリbuild／配布・本人実機は保留。

証跡はCocolon_CMEE_InterpretationCorrection_Piece_NormalDB_API_20261115.zipへ集約。7作品の本文・hash、最終test／CIと旧失敗履歴、SQL／配置receipt、全変更pathのhashを保持し、製品sourceの複製・本人実データ・鍵／起動環境／重み・ブラウザ画像は含めない。

### 残る必要能力

本単位は二入力訂正のsource未接続を閉じる範囲で、一般自由文の意味理解・複数訂正／回答併存、Emlisの本人判断・時点、Pieceの複写を越える編集品質、Analysisの記録間関係／長履歴、model selector／重み採用、本人利用・補助全体は未完。§5の主枠、11/21判定・公開日未定／12/6候補・管理評価61.625％を保持する。

STRUCTURE_MAP_DELTA_PRESENT：correctedのsource role／stage、private lineage・保存fenceとRN明示選択を既存ownerへ接続。関連地図・PCE契約・全体現在地・本議事録を同じ資料単位で差分更新する。GPU／学習／再試行0。


<a id="piece-v4-normal-adoption-20261115"></a>
## 9.70 2026-11-15 — 未採用のclip参照修復を通常sourceへ回収

### 対象と未完了境界

週次§5.2の同版画像・採用能力の通常適用に接続する。§9.69の二入力訂正→Piece通常DB／API反映は完了済みとして保持し、再施工しない。最新PR30 305255f7／API PR3 e5a1dc68から再開。通常画像検査には既存V4 1成功／19失敗が残り、研究3646a285にはその修復と小数座標24対照の成立資産がある。研究sourceを通常ownerへ採用して同じ検査を実行する限定単位である。

必要性はOBSERVED_BLOCKER_MINIMAL_FIX。実装・最終判断・GitHub反映ownerは華恋、独立担当はread-only差分検査。Mashの補助経路継続・必要改修・通常反映指示の範囲で行う。完了条件は既存V4 20件と小数24件の現行版成功、既存native／bitmap各群の保持、通常sourceと検査pinのremote照合。8秒・32MiB・4096辺／4Mi画素・厳密alpha占有比較・snapshot一回消費を変更しない。未知のWholeCanvas残差を一括完了へ格上げしない。

### 既存ownerへの回収

- `ios/tempCocolon/PieceTextMetrics.mm`の既存`PieceNativeAndLayerV4Ink`だけを研究3646と同一bytesへ採用。source SHA256=8c5e9a37954cf013f6d0e28e72070b24498e6087998effc46d3266d33aed7e4b。観測clip∩boundsのq支持を独立した所有buffer・逆写像extent／CTMで描き、比較canvasへその原点で配置する。expanded Bの寸法へ押し込まない。途中のgrid／bounds変更を拒否する。
- 既存runnerのsource pin・同call診断を対応させる。元104marker・元sourceへのlexical逆投影を保持し、新しい実行器・providerを作らない。
- 既存native harnessへ研究の3小数形状×8対照を移す。元195検査と別分母24を保持し、control成立後の負対照・実fault到達・途中変更拒否を確認する。既存workflowに完全なJSON観測保存・検証部分だけを移し、通常trigger／全job／現行RN契約・fixtureは保持する。研究branch限定や旧test集合をコピーしない。

通常ios.v1／v2 bitmapはこのV4の自然描画gateを通らない。共有native内の未回収修復の採用であり、通常bitmapの文章品質・保存品質の新改善とは呼ばない。WholeCanvasの自然描画未観測・4Mi画素超過は別の残差で、guard拡大・描画捏造・試験skipで解消しない。API／DB・権利・quota・model／selector・新GPU／学習・署名／TestFlight／本人端末の変更は0。

### 現行版の検証

通常source採用commitは[7568f6f0](https://github.com/MassyuRed/Cocolon/commit/7568f6f03c50b0daf0aa578ad8ef7a518c2fff19)、親305255f7。初回変更7pathのremote全文・changed paths・treeをlocal内容と照合した。研究の4pathを丸ごと戻さず、現行RN契約・後続fixture・通常trigger／全jobを保持。独立reviewでは旧native本文を新group／最終return hookから逆投影すると原HEADと全byte一致、製品source／新native testは研究3646と全byte一致を確認した。

[通常CI43651916715](https://github.com/MassyuRed/Cocolon/actions/runs/43651916715)はpush／attempt1／head7568f6f0で実行。iOS source job132622052718はcompile・実TextKit／CoreText・観測保存検査を含む全工程success。

| 検査 | 現行版の実結果 |
|---|---|
| 既存V4 | 20 PASS／FAIL0。先行の1 PASS／19 FAILから回復し、旧20名前・期待を維持 |
| 既存profile195 | 195 unique PASS＝native129（legacy97＋v5_32）＋v9_46＋V4_20。重複分母を再加算しない |
| 別bitmap／AR04固定層 | 44 PASS／4 PASS。固定preview／savedのPNGとRGBAが一致、PNG SHA256=2e7f7e58e3ea6a7348bbeb459f5671f92967513aec99fbbcec4991c1baaa5b8d |
| 小数座標 | 24 unique PASS、3形状すべて非整列、2形状でclip支持とboundsの差を実観測。48callの正常／負対照とfault到達をJSONから照合。保存JSON SHA256=be16c0a1c474b6067a05ce4f4baff4f52f73b77bde34cb798264842837b3acecで先行実証と同一 |
| RN契約 | job132622052967は1499＋342＝1841 PASS、FAIL／SKIP／cancel0。local renderer／wrap／export356 PASSとは重複するので合算しない |
| Android source／export | 各compile job success。新Android通常作成・実機・OS保存の成功ではない |

shell構文・workflow内Python compile、104marker／late_clip_stability73・原source逆投影はlocal成功。完全な24対照の同call数値・V4全20名・固定bitmap結果は[既存trial内の実行原本](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/native_v4_normal_adoption_20261115.public.json)へ保存する。artifact14136008671（84,912bytes／SHA256=0f7f3f2a2d9a58026f50f45990f760e1a5e37514bab7266b791a90d384cd4fc3）を回収し、ZIP CRC・4member・完全24対照JSON・preview／saved全byteをlocalでも照合。1080×1350の透明glyph層の本文3行とEmlisロゴを目視した。背景付きCardの品質確認ではない。機械結果とsource採用のTECHNICAL_CREDITであり、実4Bの自然文品質・一般入力・商品受入れを進めた結果ではない。

### 統合検査と残差

同runは全job終端、**5job success／RN canvas1job failureでworkflow全体はfailure**。canvas job132622052982は6 XCTest中4成功／2失敗、root assertion32件＝retained-card transition23＋WholeCanvas9。成功4methodは通常bitmap group・明示renderer group・保存export group・記録済みmodel73 groupで、全group件数を商品入力の固有数へ合計しない。

- WholeCanvasは元13報告のうち`quote_unicode`だけが未成立。旗絵文字を含む第2行・font80・local V4のraster planが3481×1285＝4,473,085px、4Mi上限超過（mask256／stage15）で拒否。隣接行・brandingのV4は成立。今回のinverse-clip比較不一致ではない。通常.mm581時の広い占有不一致を継承したままとは記録せず、今回の残差をこの資源拒否へ分ける。
- **新たに観測した失敗：** `visual_transition_retained_card_regression_A`が222.224msで`native_candidates_unavailable`。font48／44の候補探索6callが64〜98msで拒否され、plan0・selected0・bitmapなし。8秒timeoutやV4の占有比較失敗に分類しない。同じgroupのparent-loading A／Bとretained Bはnative_checkedで、それぞれ約1232／570／479ms。Aが不成立なのでA→Bの失効・置換・遅延callback検査の成功は認定しない。前回成功を今回へ流用せず、根本原因・変更との因果は未確定とする。
- candidate探索native ownerと通常bitmap作者は親から全bytes不変。変更したV4比較へ到達する前の拒否であることまでは絞れたが、不変sourceだけを理由に既存障害・環境問題・無害へ断定しない。新しい診断機構、描画強制・検査skip、期限／資源緩和、同run再実行は追加していない。

canvas artifact14136619921（75,438,962bytes／SHA256=d29571874ed601a2f7fa050f21b0b52927c7169ec1e51e6af47c89d69feaecdd）を回収しZIP CRCと全6組の実JSONを確認。32assertionのmethod／元source行／冒頭式、各caseのphase／reason／時間、候補拒否6callとevidence JSON hashを上記実行原本へ保存した。実ユーザー本文・鍵・snapshot token・raw内部URLは転載しない。

**既存V4 19失敗の修復・元20対照と小数24対照の現行版成功・通常RN source採用の限定単位は完了。** 全画面画像／visual transitionの合格は未完。通常DB／API反映済みの§9.69を取り消さず、この画像source修復を一般的な訂正理解・追加4B品質の完成へ換算しない。

通常API／workerは前回e5a1dc68の指定2deployがLiveのままと読取確認。稼働DBのpiece_natural_effective_round_sources／piece_interpretation_correction_source履歴は20261114192124／20261114215806を維持。今回API／DBの再配置・migration0。既存比較関数のsource／検査pinを通常RN正本へ反映する単位で、保留中の署名・TestFlight／本人実機を実行していない。

STRUCTURE_MAP_DELTA_NONE：既存比較関数内の計算修復だけで、owner／route／wire／保存形式／renderer選択の責任は変わらない。Piece mapには未採用→通常source採用という状態差と原本への参照だけを更新する。Cocolonの一般自由文・複数訂正／回答併存、Emlis本人判断／時点、Piece編集品質、Analysis記録間関係・長履歴、本人利用・補助全体は未完。次の主線は§5の有効な本人更新と完成物への利用であり、旧prototypeの追加診断・待機／上限緩和へ進行を置き換えない。


<a id="piece-multiple-corrections-normal-rollout-20261115"></a>
## 9.71 2026-11-15 — 複数の本人訂正を失わずPieceへ渡し、通常DB／APIへ反映

### 今回閉じた範囲

週次§5.3／5.6の「本人更新を完成物へ届け、通常適用まで同じ単位で閉じる」を継続。開始時PR30 4dfc5e67／API PR3 e5a1dc68。§9.69の初回訂正・§9.70のV4修復を完了済みとして継承した。初回限定で拒否していた、異なる原節への複数の本人説明をproper sourceのまま既存Piece作者・S7・保存へ通す作業単位である。

- `PieceSavedCorrectedHandoff`／`PieceCorrectedSourceSnapshot`に先行説明tupleを追加。1件の既存private bytes・identityを保つため、先行0件なら保存fieldを出さない。全履歴を既存Analysis active-source ownerへ一度渡し、各原節の失効と各本人置換の有効範囲を導出。先行REVISEをANSWERや原入力へ偽装しない。WITHDRAW後も別の先行REVISEを保つ。
- 全OBSと各START／RECEIVED／FINISH、訂正target・operation／attempt・時刻・contextを照合。各prefixはBASE＋その時点までの順序付き全本人説明から導出する。前応答FINISH以前の本人説明時刻はAPI／SQL双方で拒否。公開source-ref7keysと最新訂正への4keys lineageは保持し、全履歴は複数時だけprivate `prior_sources`へ分離する。
- preparation／model受口は各sourceの現在有効な範囲だけを渡す。旧原節・完全引用の旧側・AI対象文は作者材料へ足さず、安全検査は原入力と全本人説明の全文を読む。既存作者・独立S7で全partitionを検査し、保存再読は再生成しない。
- RNは全説明を順に表示し、全訂正と前後OBSの対応・唯一の最新表示OBSへ作成要求を束縛する。結果不明POST／途中の別更新への乗換え拒否は継承。SQLは既存preview／visual／saveのcorrected分岐だけを全履歴へ拡張する。

対象はANSWER0・COMPLETED／FINAL・最新CORRECTED OBSで、各説明が異なる原入力の完全な節を指定し、既存readerで単一REVISE／WITHDRAWを導出できる範囲。原active nonempty・最大3body block・short_essay・権利差は維持する。訂正件数に問いの3回上限を流用せず、4撤回で原1節を残すCPU対照も成功。一般自由文、ANSWER混在、置換節の再訂正・既撤回節の復活、原active0／3block超過は未対応を維持する。

### 完成物と検証

架空の思考「私は本を読みたい。私は仕事を続けたい。」と行動「私は資料を調べた。」に、仕事→家族を守る希望、資料→約束を守る希望の訂正／撤回を別々に適用した。3plan×4組合せの12作品をプレビュー→画像設定変更→明示保存→新serviceでの非生成再読へ通し、本文・payload・保存したrecipe／renderer・hash一致、quota各1、原七項目・Emlis thread／events不変を確認した。

| 履歴 | 残った本文の内容 |
|---|---|
| 訂正→訂正 | 読書の希望＋家族を守る希望＋約束を守る希望 |
| 訂正→撤回 | 読書の希望＋家族を守る希望 |
| 撤回→訂正 | 読書の希望＋約束を守る希望 |
| 撤回→撤回 | 読書の希望だけ |

各操作は別の原節に対する更新であり、同じ置換内容を再訂正できた証拠ではない。これは合成Auth／recipient provider・隔離PGlite0.5.8／既存通常作者の結果。新実4B・本人の稼働DB保存・新native画像・編集品質改善ではない。原本は既存trialの`piece_multiple_corrections_normal_rollout_20261115.public.json`へ保存し、架空本文と選別したhash／検証結果だけを含める。

localではcoreの最終各case74、application26＋関連128＝154、SQLの最終各case72、RN対象623が成功。件数は重複するため合算しない。SQL新27件は3writer×履歴欠落／入替／重複・中間receipt欠落／完了時計・中間／latest-only prefix偽装・旧対象・本人記録時計の9変異を、保存状態と期待値をそろえた上でも拒否、Piece／quota不変。CPUの独立S7／受領検査では正常候補を採用、旧原節復活・partition入替・AI対象混入・先行欠落・child graftを拒否。初回localの時計対照はUTC／JST文字列比較と同一millisecondでtest setupが失敗したため、時刻をparseし1microsecondの決定的な差を与えて修復。RN initial runはMetro依存不在のbundle検査1件で失敗し、既存CIと同じ除外条件で623件成功、bundle検査を成功へ加算しない。

| 検証 | source固定の実結果 |
|---|---|
| API Piece | d10c3f86／run43656551656／job132636228118、push・attempt1、41step全success。27pytest invocationで5688 PASS、FAIL／ERROR／SKIP0、420 deselected。重複invocationを固有件数へ合算しない |
| API Analysis | d10c3f86／run43656551550／job132636227808、push・attempt1、全工程success。6pytest invocationで4865 PASS＋12995 subtests PASS、FAIL／ERROR／SKIP0、194 deselected。重複を固有件数へ合算しない |
| RN | b142969e／run43656612542、全6job success。RN1499＋344＝1843 PASS、FAIL／SKIP／cancel0。source nativeは既存129＋v9_46＋V4_20、bitmap44・AR04_4・小数24が成功。native群は分母重複あり。canvas／export系の実行工程はpath条件でskipされ、新しい統合画像の成功へ換算しない |

API10pathとRN2pathのremote内容・親commit・tree・changed pathsをlocalと照合。新runのrerun／dispatch0。先行§9.69のCI失敗・§9.70の画像残差は原記録として残す。

### 通常反映

CLI生成の`20261114235041_piece_multiple_interpretation_corrections.sql`を通常DBへ一度適用し、履歴version20261115000750／name=piece_multiple_interpretation_correctionsを確認した。既存3writerの定義から許可した宣言・corrected分岐の2差分だけを戻すと適用前MD5に全一致。旧5引数preview primitiveはMD5も不変。4関数の署名・SECURITY DEFINER・search_path=pg_catalog・ACL、全public tableのACL／RLS、対象5tableのcolumn型／nullabilityを保持。新table／column・quota変更0。security advisorsは前後7group同一、新規0。実本人行の読取・書込0。

| 通常service | 指定版の終状態 |
|---|---|
| API | dep-dbsfm8mk1f9s73959hn0、2026-11-15 09:23:17 JSTにLive、commit=d10c3f8688ae77afd3907a2d1c94db9d58312665 |
| worker | dep-dbsfmcgn74is739o569g、2026-11-15 09:23:09 JSTにLive、同じd10c3f86 |

両serviceは既存main参照・auto deploy OFFを保持し、指定commitを明示して配置。反映後healthz／bootstrap200、未認証のIF／Saved／Piece source-ref／owner history401と既存private no-storeを確認。worker新instance pmtbvの起動・DB poll200・queue stats（ready0／running0／stale0／既存failed171）を確認した。両serviceの09:23:17〜09:24:29 JSTの観測窓でerror levelログ0。実job完了・既存failed解消・認証済み本人生成保存の成功とはしない。料金・設定・quota・model／weights／selector、build／配布は変更しない。

STRUCTURE_MAP_DELTA_PRESENT：全体現在地・01A／01B・Piece／CMEE地図・PCE source契約・本設計・週次を同じ作業単位で差分更新。新service・作者・モデルprovider・table・column・rendererは追加しない。GPU／学習／再試行0、通常model selector OFFを維持。build／TestFlight／本人実機は保留。一般自由文・複雑な本人更新／回答併存、Emlis本人判断／時点、Piece編集品質、Analysis記録間関係／長履歴、本人利用・補助全体は未完。§9.70のWholeCanvas資源拒否とretained-card A候補探索拒否は今回未解決。次も週次§5を主枠とし、今回の限定保存接続を全体完成へ換算しない。


<a id="piece-answer-corrections-normal-rollout-20261115"></a>
## 9.72 2026-11-15 — 回答と、その後の本人訂正を同じPieceへ保ち、通常DB／APIへ反映

### 今回の能力と境界

週次§5.3／5.6を継続し、§9.71のANSWER0・複数訂正を完了済みとして引き継いだ。今回は自然応答で実際に完了した1〜3回答の後に、本人が二入力で訂正・撤回した場合を接続する。最新一回答を明示選択し、元情報の現在有効な節・先行の有効な原節置換・全適格本人説明を既存Piece作者と独立S7へ渡す。過去回答を全部連結しない。新service・作者・model provider・route・公開DTO keyは追加しない。

- 実際のQUESTION／ANSWER／MEANING_UPDATEと各INITIAL／REFINEDの受領・完了・continue／stopを全round照合し、その後の全proper correction／CORRECTED OBSと時系列で接続する。元threadをREFINEDへ書き換えたり、回答や訂正を原入力へ偽装したりしない。最新CORRECTED OBSと最新ANSWERの両IDを、同じ7keys source-refに保持する。
- correctedの本人意味rolesは混在時だけ `original_input / supplemental_answer / interpretation_correction`、制御rolesは `emlis_observation_result / question_need_decision / ai_interpretation_target`。QUESTION IDとANSWER IDは両方non-nullとし、ANSWER0では従来どおり両方null・旧2rolesである。最新本人説明への4keys locatorは保持し、private `interpretation_correction`内に実 `answer_sources`／全round `answer_checkpoints`を追加する。本文なしlineageや公開GETへ私的履歴を流さない。
- ANSWERによるREVISE／WITHDRAWとproper説明は、それぞれ異なる原入力の完全な節を対象にする。先行の独立ADDは自動選択しない。既存共有readerが読めるADDは整合・矛盾照合へ残す。読み切れない**未選択の先行ADD**は履歴制御に限り、本人意味の完全読取へ昇格しない。読み切れない**選択最新ADD**は `piece_correction_selected_answer_pending`で拒否する。読取不成立を取り除いて矛盾を再試行する仕組みにはしない。
- 同じ旧引用が別の普通の回答にも現れる場合、原入力を勝手に対象に選ばず曖昧として拒否する。ANSWER／置換節への再訂正、同原節の再更新、原active0、最大3block超過は対象外。原節nonempty・short_essay・既存tier／Safety／S7は維持し、訂正回数を問いの3回上限へ制限しない。
- RNは最新回答と全本人説明を同時に表示し、「回答と説明を含めてピースを作成」から既存APIを使う。GET queryは既存の選択ANSWERだけ、期待OBS／stageはRN内の照合だけに使う。保存結果不明の復元でも両IDを保持し、同じOBSでも回答が変われば拒否する。

### 完成物と検証

架空の思考・行動二欄、実1〜3回答、資料を調べた原節への訂正／撤回を、3plan×3round×2操作の18作品でpreview→画像設定変更→明示保存→replay→新service非生成再読へ通した。選択回答「私は嬉しかった。」は本文に残り、未選択の先行回答「私は怖かった。」と失効した資料の原節、AI訂正対象文は本文に入らない。REVISEだけ「私は約束を守りたい」を保持する。別の原節へのANSWER REVISE／WITHDRAWとproper訂正／撤回の4構成も同じ保存一巡へ到達した。 先行ANSWER REVISE→最新ADD→別原節のproper WITHDRAWの補足1構成でも、先行の有効置換と最新ADDの両方が残り、保存／新reader再読・quota1・原source不変を確認した（local17.43秒、29case本体とは別）。本文・payload・保存recipe／renderer・hash一致、各quota1、原入力／Emlis thread／events不変を確認した。

これは合成Auth／Emlis providerと隔離PGlite0.5.8、既存作者の結果であり、新実4B・一般編集品質・本人の稼働DB保存・新native画像ではない。架空18作品の全文と選別したartifact／hash・検証結果は既存trialの `piece_answer_corrections_normal_rollout_20261115.public.json`へ保存する。本人ID・token・private lineage／source checkpointは含めない。

| 確認 | 実結果 |
|---|---|
| CPU・既存訂正／保存回帰 | 最終197 PASS、FAIL／SKIP0。旧74coreに新25を含む99、既存application26・SQL72との合計。別に実adapter→source-ref→normal previewの開通1件成功 |
| 新application | 29 PASS：上記18＋4、選択漏れ／旧・別ANSWER／opt-out／旧OBSの5拒否、後続訂正によるstale保存拒否1、実HTTP GETの7keys／no-store1。最新DDLのfresh fixtureでも通常一巡1件成功。重複を固有数へ加算しない |
| 新SQL | 7 PASS内で、3writer×27の81履歴改変transactionと、回答のない実履歴への偽mixed lineage3件を全てPIECE_CONFLICTで拒否。各失敗後Piece／quota不変。各writer正常対照・catalog／ACL／旧5引数primitiveも保持 |
| RN local | 既存Piece13suite1511 PASS、重複しないReact関連4suite172 PASS。対象3suite266は重複するので加算しない。CIの確定結果は後記 |

初回application期待値が既存作者の「私は、仕事…」の句読点に依存して1件失敗し、保持／除去する述語で照合して修復した。MD5事前条件追加時のCASE式の括弧漏れはfresh migration setupで失敗し、DDL適用前に修正した。最終DDLの新fixture適用・通常一巡とSQL7件が成功している。RN初回14失敗はTypeScript不在のsetupであり、CI固定5.2.2をscratchへ配置して1511件成功。Metro bundle検査はlocal成功へ含めない。全て実行前／隔離検証の記録で、通常DBで構文失敗・本人データ更新を起こした記録ではない。

### 通常反映と残件

実装API `24bc228dbf54abc983906323c0ae7d937fae1fd6`、対応RN `70527711e92821c0ae6f8704be5331f6c8011147`。API13path／RN7pathのremote内容と親commit／treeをlocalに照合した。CLI生成migration `20261115005742_piece_answer_and_interpretation_corrections.sql`（SHA256 b539a571c5d3f2bce417aba8a2bfcc0c6eddb9ed43ef11c93f74cbe68cace139）を通常DBへ一回適用し、hosted version20261115011424／name=piece_answer_and_interpretation_correctionsを確認した。

既存preview／visual／saveのcorrected armへ実ANSWER履歴の照合を追加し、2CHECKだけにmixed variantを追加。no-answer旧分岐へ偽mixed lineageを付ける経路は分岐内guardで拒否し、ANSWER IDと原入力IDの分離、stop TERMINALが最初の訂正本人source記録以前である時刻条件も維持する。3writerの許可した宣言・global guard・corrected armの3差分だけを逆投影すると、適用前定義MD5に全一致。適用後MD5はpreview c4dd33b628df9cf6e2672a7d3edfd6bc／visual c3b5eda55f876864351d6dc8bb029628／save d2fbb93975391cbe6f954a8299c51c46でfresh PGliteと一致する。旧5引数primitiveは不変。署名・SECURITY DEFINER・search_path・ACL、対象4tableのcolumn／RLS／policyを保持し、新table／column・quota変更0。全35CHECK validated、security advisor前後7group・新規0、既存Piece行数も不変。本人行の読取・書込0。

| 固定sourceのCI | 確定結果 |
|---|---|
| API Piece | 24bc228d／run43662053792／job132653307233、push・attempt1、41step全success。27pytest invocationで延べ5749 PASS、FAIL／ERROR／SKIP0、420 deselected。最大の2699件は724.56秒。重複suiteを固有件数へ換算しない |
| API Analysis | 同24bc228d／run43662053793／job132653307125、attempt1、全19step success。6invocationで4865 PASS＋12995 subtests PASS、FAIL／ERROR／SKIP0、194 deselected |
| RN | 70527711／run43661799495、attempt2で全6job success。JavaScript1511＋365＝1876 PASS、FAIL／SKIP／cancel0。iOS nativeは既存129＋v9_46＋V4_20の195固有assert、AR04 bitmap4・小数24も成功。legacy97は129の部分集合。新しい混在作品のnative画像成功へは換算しない |

RN attempt1は5job成功後、iOS source job132652535782が10分上限で取消。standaloneアプリのsimctl launch開始後にmain_enteredが出ず、本文検証へ未到達だった。native source／harness／workflowが先行成功版から不変であることを確認し、該当1jobだけ一回再実行した（API両runのrerun／dispatch0）。attempt2のiOS job132655920101はmain起動・全検査・PNG原本書出し・artifact保持までsuccess、他5jobは元成功時刻の結果を継承。起動受渡し不成立が有力だが根本原因の確定とはしない。10分上限・8秒製品条件・画像判定を緩和せず、初回の取消とPNG未生成によるupload失敗も記録へ残す。canvas／exportの統合実行工程はpath条件でskipされており、全画像合格を主張しない。

| 通常service | 指定版の終状態 |
|---|---|
| API | dep-dbsgn8t6e07s739qfk50、2026-11-15 10:34:04 JST Live、commit24bc228dbf54abc983906323c0ae7d937fae1fd6 |
| worker | dep-dbsgnet6e07s739qg5a0、同10:33:28 JST Live、同24bc228d |

両serviceの既存main参照・auto deploy OFF、rootDir／runtime・build／start commandを保持して指定commitを配置した。配置後10:34:39〜10:34:46 JSTにhealthz／bootstrap200、未認証IF／Saved／Piece source-ref／owner historyの4GETは401と既存no-storeを確認。worker新instance ndnvrの起動・DB poll200とready0／running0／stale0／既存failed171を確認した。10:34:05〜10:36:07 JSTの両service error levelログは0。新job完了・既存failedの解消や、認証済み本人の生成保存成功を主張しない。

通常DB／API／worker反映と対応RN sourceの限定機能単位を完了。実認証による本人一巡、build／TestFlight／本人実機は別の未完として保留する。

STRUCTURE_MAP_DELTA_PRESENT：全体現在地・01A／01B・Piece／CMEE地図・PCE source契約・本設計・週次を差分更新する。通常model selector OFF、新GPU／学習0、build／TestFlight／本人実機保留を維持。一般自由文・未対応の複雑な本人更新、回答／置換節への再訂正、Emlis本人判断／時点、Piece編集品質、Analysis記録間関係／長履歴、本人利用・補助全体は未完。旧WholeCanvas4Mi資源拒否とretained-card A候補探索拒否は今回未解決。次も週次§5を主枠に、本人更新が実返答・作品・図へ届く残りを続ける。


<a id="analysis-semantic-history-candidate-20261115"></a>
## 9.73 2026-11-15 — 長履歴を分割して読み、記録間の関係を統合する候補

第11回§5.4〜5.6を継続する。中断前のAPI `f5d8967eb804a6930378b390e6e6e9485e4d01e4`の11変更pathをGitHubから取得し、保存済みmanifestの全bytesと一致した。§9.72の回答＋本人訂正→Piece・通常DB／API反映は先行完了として保持する。旧quoted-only分割を現semanticの完成へ読み替えず、現ownerへLEAF／MERGEを接続した候補である。

### 接続・根拠と保存

`analysis_cumulative_service.prepare_semantic_history_batches/_semantic_history_map`は完全親sourceのmember順・global field番号・guardを保つ。容量超過時は2〜3LEAFに分け、原記録の二欄・適格ANSWER・有効訂正／撤回は不可分とする。複数原記録へ依存するmap本人訂正も同cohortへまとめる。小材料は元messagesの一回生成を維持し、最新N件へ切り詰めない。

既存Engine／admission／compiler／唯一realizerを通す。最終MERGEは子のAI仮解釈だけでなく、実提示する原field断片、カテゴリ／感情／強度／日時、全field manifest・未提示範囲・unknownから記録間関係を読み直す。子の図を単に連結せず、AI文を本人sourceへ昇格しない。最終引用とcompilerが追加するsupport根拠の両方を、親sourceと実提示範囲へ再束縛する。本人map訂正説明は最終図でも独立した全文根拠にする。

**後続§9.83のMERGE v2で改訂。** LEAFのAI自然文とunknownは、元raw・packet・coverage・hashとともにprivate未検証候補として保持し、最終作者の材料や公開nodeへ自動継承しない。本人原文の不明・留保と本人訂正説明の義務は維持する。最終unknownは実提示原文から生成して既存採否を通し、全文理解・未知解消を認定しない。

通常ensureから既存`analysis_cumulative_commit`へ最終artifactだけを一回保存する。途中失敗・容量超過・取消しで部分mapを保存せず、前のcurrentと月次当時版を保つ。公開`watashi.map.v3`・既存SQL／RN／rendererを用い、新table・migration・公開型・model selector・重み変更0。

### 容量と検証の区別

49,152 message UTF-8 bytesは分割目安で、実token数・context適合の保証ではない。取得時のf5d8967は既存提供側の実token＋4096出力検査、要求body262144bytes、全pipeline215秒・最大4call、最終24node／48edge等であった。後続の期限修正候補は下記へ分離し、送付済み版を遡って変更しない。cohort一つや最終MERGEが収まらない時も切捨て保存しない。

中断前の新57固有case（core26・planner9・実SQL application22）、関連376、既存RN38の成功記録とsource一致を照合した。201記録／402欄の3LEAF・跨ぐ根拠・全量guard・部分保存拒否・同時要求共有・取消しを飲む遅延provider・本人訂正cohort・当月固定・非生成再読は合成provider／隔離SQL等の検証である。201記録は合成容量判定を注入しており、実4B容量・意味品質の成功ではない。今回の新再実行へ数え直さない。

固定版f5d8967のPiece CI43668190569はSUCCESS。27pytest invocationの延べ5749 PASS、FAIL／SKIP0、選択420 deselected。Analysis CI43668190490は25分境界でCANCELLED。変更を含むstep13は1513 PASS＋21subtests、月次SQLのstep14は201記録／15月次参照等でSUCCESS。確定済みgroupの延べ4514 PASS＋12257subtests、194 deselectedを保持し、step15の途中52％を成功へ加算しない。未完の最終20file群だけを無変更f5d8967でlocal実行し408 PASS／738subtests、FAIL／SKIP0、40.08秒、既存deprecation2件。既存runtime／pluginのみで追加install・外部DB／model要求0。pytest_asyncioはlocal1.5.0、CI1.2.0との差を記録する。元GitHub runを成功へ変更せず、重複suiteを固有case数へ換算しない。

### 承認済み送付と、生成前の起動停止

架空12記録（memo合計17314字）のSQL sourceから親66329bytesを8記録／4記録の2LEAF（46087／26182bytes）へ分けた入力を準備した。初回7,074,085byte ZIPの既存Pod送付は「具体的送付内容と送信先への明示承認不足」として自動承認審査に拒否され、転送・生成0。依存96file＋driver／架空inputの98fileに縮小した旧ZIPも未送信である。

今回、同じ98file全bytesを照合し、再現可能な日時・圧縮でarchiveを作り直した。**承認を受けて今回送付した内容は98file・1,520,025byte、SHA256 `394458914b5aeaa63902e05ce5aa3a6367978f473fb5d7e0f2475211dd5189f6`**。旧1,534,208byte／SHA b65352e0f67b35b274fbff8661a669391fe005af74aed8d2abd0327f1b5457acとはarchive containerのbytesが異なるが、全98内容fileのSHAは同一である。source96fileはAPI f5d8967の同path／bytesと一致する。

架空input・一回driver・全98fileのhashと実行範囲は[同じtrialの実行内容](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_prepared_20261115/manifest.json)へ保存する。driverとinputも同directoryから再取得できる。秘密値・本人実データは含めない。

Mashの今回明示承認を受け、既存Pod `f1lle4xwq3wjln`へ98file ZIPを一度送付した。Pod上でも1,520,025byte／SHA394458914b5aeaa63902e05ce5aa3a6367978f473fb5d7e0f2475211dd5189f6を確認し、専用folderへ展開した。既存cocolon_venvでdriverを一回起動（PID111894）したが、`analysis_cumulative_service`のimport時に`ModuleNotFoundError: No module named fastapi`で停止した。RESULT／試行消費marker作成・鍵読取・health・4B要求のいずれにも到達せず、model要求0／health0。起動Python・標準PythonにFastAPIがないことを確認した。私がPod側の依存を事前確認しなかった実行不備であり、4Bの拒否や意味品質の実測へ分類しない。元launch.logは同trialのstartup.logへ保存する。再試行なしの承認条件を守り、再起動・再実行・依存install・新GPU／学習・通常配置を行わず停止した。

取得後は同rawを生成前のSQL source／guardに束縛し、原記録と図・全文・両端根拠を照合して、保存・非生成再読・既存RN受口へ通す。採用できる内容だけ通常API／workerへ反映する。初回起動停止時は生成・migration・配置0。現在の通常API／workerは24bc228d Liveのまま。後続追加一回のモデル要求は下記に記録する。

補足候補として、既存の固定検証環境からFastAPI0.116.1／HTTPX0.28.1と依存を回収したclient専用bundleを準備。13distribution・408file、3,203,073byte、SHA256 d85f85b2044f3107a91d9eee37e5d632b8e114244d2382eccf297821f578bd0e。CPython3.12／Linuxx86_64用で、標準site-packagesを無効にしたlocal環境で全実ownerのimport・同親sourceの8／4分割に成功、外部要求0。元98fileの変更・再送は不要。全version／file SHAは同trialのruntime-deps-manifest.json、補足archiveはChatGPT保存file `libfile_fde3_f-a334b9bd6cb48191817c52be178125d9_2f7470f963808191aaebf050935e72de`。この準備後にMashが追加一回を明示承認し、補足送付・専用folderへの隔離展開・一回実行を完了した。詳細は下記。既存提供のPython／依存／重み／設定は変更していない。


### 補足送付後の追加一回 — 本文未受領、許可消費済み

Mashの「送付済み98ファイルは再送せず、補足1ファイル（3,203,073byte）を同Podの専用フォルダへ追加、最大3応答＋前後2GETを最大8分・追加1回」に対する「進めろ」を受けて実行した。補足ZIPのbytes／SHAd85f85b2を照合し、`client-runtime-deps`へ隔離展開。元98file全bytesは不変・再送0、既存依存へのinstall0。clientのimportと8／4分割が成立してから同driverを一回起動した（PID112311、approved-extra-run.marker作成）。

| 観測 | 結果 |
|---|---|
| 実行版 | f5d8967、親request_ref末尾c2528720f72a5b3c6911364f15008a2c3b5a37278a819929c42370a385fb45bc、入力canonical SHA256 baa0c1d1ed2a9970576ec85b0f5cae390f9d71f33dc0044b41ab684242087472 |
| 呼出し | 最初の8記録／16field LEAFだけ1POST、4096tokens指定。210.30546553386375秒でtransport timeout、応答本文0byte・受領0 |
| 全体 | 211.29745450010523秒、HTTPException504。2番目LEAF／MERGE0、artifact／保存／再読／通常反映0 |
| 前後確認 | health_before200（0.1915488699451089秒）／health_after200（211.29745271988213秒）。HTTP疎通の確認であり、生成完了／品質／取消し成功の証明ではない |
| 提供側の同時刻stage | admitted0.205秒、decode0.255秒、prefix3200が207.916秒、complete_length210.235秒、special_count0が210.270秒。結果file mtimeと同Pod monotonicによる近似照合（−2／＋5秒） |
| 変更境界 | 提供PID111294／source SHA ad3d301d2d1abd9226703dc72e3734eb8da79d8e0cf084d4b0666e97298370be。追加学習・再試行・提供再起動・新rental・通常設定変更0 |

無修補の`semantic-history.actual.result.json`、`launch-with-client-deps.log`、`runtime-observed.json`、`provider-deadline-observed.json`を同trialへ保存した。raw driverのstate `NOT_GENERATED`はartifact未生成を指し、推論0の意味へ読み替えない。acquisition stateは`FAILED_OR_ACK_UNKNOWN`、提供側の生成到達は上記stageで確認する。受領本文がないため意味品質・JSON完成度はUNASSESSEDであり、架空12記録を読解できたとはしない。health200だけから提供を復元・取消し完了したとも主張しない。この追加一回の許可は消費済み、以後のモデル要求0。

### 同じ作業で行った非生成の修正候補（Pod未送付・未配置）

今回の停止を単に接続不能とは分類しない。生成は約210秒続き`complete_length`となり、clientも210秒で待機終了していた。受領余裕だけを増やしても未完結のlengthは採用できず、既存のlength拒否は維持する。ライブのschema／parser関数ASTはrepoと一致、handlerのASTは異なり、完全な実行設定・最終token数は未取得。時間切れは強く示唆されるが、唯一の停止条件を断定しない。

候補bdf39198359f7e205b263657442f80215f6b0725の変更は既存6path内に限定する。

| 既存owner | 修正 |
|---|---|
| `ai/tools/serve_emlis_natural_reply.py` | 完全原fieldと旧引用候補を保ち、同field内の一意な連続原文・4000字以下の文候補を追加。引用の対応が不正なら追加せず、引用内句点・ASCII period・escape／制御文字を跨いで文を作らない。map本人訂正は全文必須のため追加対象外 |
| `analysis_model_source.py` | native210秒／bridge215秒より受領猶予を長くするHTTP220秒と、一要求の論理監視225秒を分離。output4096・context検査・length拒否・messages・source guardは不変 |
| `analysis_cumulative_service.py` | 分割計画も含む一つの絶対時計で、actual call数×225秒、最大840秒。小材料225秒、2LEAF＋MERGE675秒、3LEAF＋MERGE840秒上限。段階ごとの総期限リセットなし。準備後に期限を短縮して既に超過している場合はPOST前に拒否 |
| 既存test3file | 実parserの短文引用／元候補／field binding／引用入れ子／重複／escape／本人訂正全文、同sourceでのCMEE採用、通信層の順序、全段階の連続成功・準備含む期限・途中保存禁止を検証 |

元12記録・二欄24fieldの読取診断では、旧96候補を旧順のまま全保持し560文を追加（合計656）。追加文10〜64字・中央値31字で、既存`_body_sentence_spans`の原slice導出と24field全一致。実際に送った第一LEAFの保存messagesもschema呼出し前後で同一。これは候補整合性であり、速度改善・完了・意味品質の実モデル証明ではない。「参加した。というわけではありません。」等で前後の否定／条件が別文にある場合も、全文の意味確認を省略しない。

非生成検証308 PASS（新13件・11file、FAIL／SKIP0。71＋140＋97、既存warning1の再表示）。既存runtimeの実parser依存不足による初回skipと、追加testのTornado import不足は環境／test準備として区別し、既存packageのimport bridgeと静的なbridge期限読取へ修正後に再確認した。依存install・外部DB／モデル呼出し0。既存f5d8967のCI結果は同版の履歴として保持し、新候補のCI成功へ流用しない。新bdf3919のAnalysis43674876139／Piece43674876107は記録時点in_progress、成功未確定。無変更workflow再試行0。

workerの既定staleは900秒、started_at基準でありheartbeatはない。840秒はsemantic処理の有限上限で、source snapshot取得と最終保存はその外側にある。全job900秒以内・実稼働worker設定との一致は未実証。4call全てへ225秒ずつ保証せず、上限時は従来どおり部分保存0で失敗する。通常反映前には実worker設定・周辺処理を含む期限整合が必要。trialの8分許可は新しい840秒上限の実行許可ではない。

新6pathの候補はGitHub保存だけで、元98file／Pod driver・稼働提供・通常API／workerは変更しない。新実4Bは未取得、同raw保存再読・通常反映・本単位／補助全体未完を維持する。次は候補の実行条件と全体上限を具体化してから、別の明示許可による一回で完成応答を確認する。旧許可を再利用しない。

STRUCTURE_MAP_DELTA_PRESENT：現semanticの生成段階と根拠束縛を既存ownerへ接続した候補。全11変更pathは01A同日地図。新しいauthority family・別作者・保存基盤は追加しない。実4B品質・通常採用・本単位／補助全体は未完。build／TestFlight／本人実機保留、既存の管理評価と期限を維持する。


<a id="analysis-semantic-history-evidence-repeat-20261115"></a>
## 9.74 2026-11-15 — 受領した実4Bの根拠反復を特定し、生成内で同一ペアを除く

現指示「通常反映まで含めて未完の作業単位を閉じる」に従い、§9.73から継続。whole-product、最新weekly§5、01系地図・三中核current mapとactualを照合した。build／TestFlight／本人実機は保留し、成立した能力の通常API／worker反映までを対象にする。記憶・tree censusを全履歴本文の理解済みとは扱わない。

### bdf391の新しい一回と観測

前の許可・markerは再利用せず、GitHub保存したone-shot（17e7d7d）で新rootへ一回実行。元98fileのうち96sourceの全bytes、driver／架空inputのhash、12記録・8／4分割・親request_refを停止前に照合した。固定bdf391の2client ownerと提供側semantic_output_schema／短文helperだけを使い、提供のその他関数・args／同Pod内env／cwd・重みを保持。鍵や起動環境値はPod外へ送らない。最大3model POST、driver前後2GET、起動前／起動後／復元時の有限health polling、780秒後に復元時間を残す監視、実行上限900秒。変更前98file／依存の再送・install・学習・新Pod0。

第一LEAFのみ実1POST、HTTP200の生response14428byteを211.2255秒で受領。finish_reason=lengthであり、既存transportはHTTPException503として拒否。2番目LEAF／MERGE0、artifact／保存再読／通常反映0。driver211.2351秒、停止復元込み251.9304秒。元sourceSHA ad3d301d…は不変、元args／env／cwdでPID112828へ復元、health200。これは前後のモデル本文全byte同一の検証ではない。

実raw6350字を全読した。根拠の完成object94個は16種類に留まり、最初の3nodeは各24根拠へ反復充填していた。短文候補は実際に選ばれたが、同一根拠の再選択で出力量が膨らんだ。受信期限不足だけの問題ではなく、待機を延ばすだけでは品質を改善しない。4番目nodeの途中で終わり、全graph・意味品質は未達。rawを削除・重複除去して完成artifactへ修補しない。生原本・stage・復元logは同trialのsemantic_history_bdf391_actual_20261115へ保存する。

### 必要な直接修正

API候補1fb55b49dff0ae9382adcf6d79edea06ea95c8c7は既存serve_emlis_natural_reply.py内のsemantic_json_parserだけへ、同node内で既に選んだ(field,quote)を次のenumから除くparserを接続。別fieldの同じ文、同fieldの別文、別nodeでの再利用は保持し、原source全文・欄番号・24根拠上限・finish=stop要件・既存CMEE／保存判定は不変。項目の意味→根拠の順と、field→quoteの順を既存固定順設定で確定する。IFとPieceとupstream packageへ波及しないよう、既存IFと同じnamespace隔離方式を用いる。uniqueItemsだけでは固定LMFE0.11.3に強制されないことを実parserで再現した。

新しい根拠選択10case（文字／実TokenEnforcerの重複・異なる欄／文・別node・候補枯渇・分岐・namespace隔離）を追加。既存Unicode testは同じ日本語premature-end回帰を現在のtitle先行順で検査。Pieceの既存隔離testは、旧Analysis設定false固定から独立config不変へ更新した。初回175PASS／1旧期待値FAILと、更新後93PASSを区別する。最終同版の関連176件は75.26秒で全PASS、FAIL／SKIP0、既存Pydantic warning1。初回の環境PATH未設定collection error、PGlite未設定skip、修正前の旧期待値FAILを、この最終完走と混同しない。bdf391のAnalysis43674876139／Piece43674876107は両方SUCCESSをfresh確認したが、新候補のCIへ流用しない。

通常workerは1instance、start=astor_worker.py、autoDeploy OFF、最新24bc228dの起動logでstale_after=900秒。semantic840秒の外にsource取得・保存・通知がある。現在単一workerは処理中に自分のjobを再取得しないが、通常反映時は既存設定ASTOR_WORKER_STALE_RUNNING_SECONDS=1800へ合わせる案とする。任意の全履歴を1800秒以内に処理できる保証ではない。DB最新migration20261115011424は維持、新migration不要。

次はこの修正候補を同じ12記録で一回検証し、完成したLEAF／MERGE rawを原入力・全文・両端根拠へ照合する。成功した同rawだけを既存SQLで一回保存・非生成再読し、採用可能な通常API／workerと提供schemaを同版へ揃える。途中失敗は部分保存0、旧提供へ復元し、未完を完了へ変換しない。今回bdf391の一回は終了し、新候補の実測へ流用しない。STRUCTURE_MAP_DELTA_NONE：今回の直接修正は既存decoder内の根拠選択で、商品route／source／artifact／公開型／保存ownerは変更しない。


<a id="analysis-semantic-history-unique-evidence-actual-20261115"></a>
## 9.75 2026-11-15 — 根拠反復は解消、完成JSONのnode参照と事実変異で通常不採用

### 新候補の一回と元提供復元

§9.74とは別の候補1fb55b49を、固定source・旧96file／driver／架空input・12記録8／4分割・親request_refを照合して別rootで一回実行。起動直前のUI runtime resetは未実行応答であり、実launchは一回（PID113009）。native候補PID113012、sourceSHA 6a6ec9419ccc6270f4dc6a0cb3f5e76047e10e029ce60c9edc06eb22edb60488。既存提供の原source、重み、引数、同Pod内メモリの起動環境とcwdは保持し、学習・依存install・再試行0。

第一LEAFだけ実1POST。92.583224秒でHTTP200・finish_reason=stopのJSONを受領し、driver全体94.322696秒。原本の根拠は2個／2種類、同node内重複0。bdf391の94個／16種類・210秒lengthから、反復の除去とJSON終端到達を実確認した。入力と最大4096token・210秒native上限・既存CMEE採否は同じで、期限延長や生成後本文修補による成功ではない。ただし語順も同時変更した比較なので、短縮を根拠重複対策だけの単独効果へ断定しない。

CMEEでAnalysisSemanticMapError(analysis_semantic_map_invalid)となり、2番目LEAF／MERGE、artifact／保存・再読・通常反映は0。停止復元込み135.690145秒、元提供を同じargs／env／cwdでPID113054へ復元し、health200を確認した。元の二つのrunを再起動・再試行せず、成功へ書換えない。driverのprovider_restarts=0はdriver内countで、外側launcherは候補起動と元提供復元を行っている。実影響はexecution.jsonを正とする。

### 受領全文と原入力の照合結果

原入力12記録の全memo・memo_actionを確認した。全件架空、thread=null／events=[]であり、回答・本人訂正を含む実4B実証には数えない。引用の2文は原field1へ正確に一致する。一方、生成nodeはn1だけなのに、6edgeが存在しないn2／n4／n5／n6／n7／n8／n14を参照した。fieldや記録番号から未生成nodeを想定した出力であり、既存拒否は正しい。edgeを削除・番号置換して採用しない。

さらにn1 explanationは、原文「以前聞いた内容だけを今の状態として言い切りかけていた」を「担当者に確かめず以前の内容を言い切った場面」へ変えた。未遂を完了した発言へ昇格した事実変異で、node参照だけを直して通常採用してはならない。記録間比較・条件差・意味品質の完成は成立していない。第一LEAF8記録に対してnode1件という実出力を、全8件／全12件の読解成功へ数えない。

### 保存した原本・検証と現在地

[実原本・実行／復元・読取記録](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_unique_actual_20261115/)へexecution.json、semantic-history.actual.result.json、candidate-provider.log、driver.log、restored-provider.log、review.jsonを保存。受領rawは無修補。localの同raw replayは追加model0で同じCMEE拒否を再現し、保存へ抜ける修正はしない。

APIの直接修正は既存3path（serve_emlis_natural_reply.py、test_analysis_semantic_generation_schema.py、test_piece_model_server_constraints.py）。最終関連176件は全PASS・FAIL／SKIP0、75.26秒。新根拠重複10caseを含む、通常履歴SQL保存・再読、native parser、Piece制約、IF serviceの検証である。新候補CI43677592608／43677592610は最終確認時in_progressで、SUCCESSとは記録しない。bdf391の両SUCCESSは先行版の履歴として維持する。

通常API／workerは24bc228d Live・autoDeploy OFF、worker1instance／stale900秒、DB最新20261115011424のまま。提案したstale1800設定、候補の通常配置、新migration・RN変更・build・TestFlightは今回0。既存研究重み／selectorの採用状態も変えない。未完作業単位は閉じていない。

次の直接修正は、生成済みのnode IDだけをedge候補へ束縛し、node ID重複と1node時の空edgesを扱うこと、同時に未遂／完了の原文条件を完成文へ保つこと。旧bodyのedge削除・意味補修で代用しない。全段階の新rawを原入力・本文・両端根拠へ照合し、成立した同版だけを既存一回SQL保存・非生成再読・通常API／worker／提供schemaへ反映する。新sourceの機械検証だけを商品採用や補助全体完了へ換算しない。追加学習が必要とは今回だけでは確定しない。

STRUCTURE_MAP_DELTA_NONE：既存semantic decoder内の制約修復であり、商品route・source／rights・公開型・保存owner・月次・唯一realizerは不変。build／TestFlight／本人実機の保留と、補助全体未完を維持。

<a id="analysis-semantic-history-quote-first-20261115"></a>
## 9.76 11/15 — 実長履歴の原文欄混同・根拠膨張を、引用先行の生成へ直接修正（通常未採用）

§9.75から、API候補5cf37079a01430bf6dbcb2b99d45a3f849f2c228で生成済みnodeだけへのedge束縛と未遂／完了の生成指示を修正した。別root `/workspace/semantic-history-graph-scope-20261115-once` で一回実行。実launch PID113318、候補提供PID113322、元提供を同じargs／env／cwdでPID113387へ復元した。旧96source・driver・架空12入力・親guardと8／4分割を固定し、既存2runは再実行しない。学習・依存install・新GPU0。

第一LEAFのみ1POST・HTTP200、211.301605秒でfinish_reason=lengthの5740文字を受領した。driverは503／NOT_GENERATED、第二LEAF／MERGE・artifact保存／再読・通常採用0。停止復元込み252.007804秒、前後health200。受領rawを閉じたり補修して採用しない。生成の一部は改善したが、全量読解成功や意味品質向上済みには数えない。

### 全文照合で判明した原因

n1会議の根拠field1は対応するが、n2家族の食事はfield2（R1の行動）、n3展示はfield3（R2の家族memo）、n4照明の初めはfield4（R2行動）、n5荷物整理はfield5（R3展示memo）を選んだ。記録番号と各原文欄番号を混同し、field先行のdecoderが別の原文欄から引用を供給している形である。n3は重複pair0でも異なる引用を24件まで展開し、一文とそれを含む段落を重ねた。JSON途中でnativeの210秒生成上限に到達した（提供ログは位置2560後にcomplete_length、4096token到達の証拠ではない）。

機械的な参照だけの問題ではない。照明の「使用を止める決定もしていません」は原文の旧照明使用停止と逆。荷物整理に別記録の「必ず店へ行くとも決めていません」が混入し、途中で帰ったことも「途中へ参加したこと」へ変わった。本人の事実を強めたり他の場面へ移すため、このrawは商品不採用である。全12記録は架空、thread=null／events=[]で、本人回答・訂正の実4B実証には数えない。

### 同じ既存作者・decoder内の直接修正

新API候補 `ccdd0a6cc955efa806929943e0e3d4845a44336c` は、nativeのevidenceをquote→fieldの順で生成する。原文の連続引用を先に選び、その引用が実在するfieldの整数だけを同じoneOfで許可する。元field全文・全引用候補・公開map／DB／RN・CMEEの既存採否上限24は変えない。生成だけ各項目最大4根拠とし、比較する2記録の思考／行動を各1つ保持できる有限構成へ戻す。生成後の番号置換・根拠削除・本文修補ではない。

既存隔離parser内でnode IDを次の連番へ限定し、完成済みnodeだけをedgeへ渡し、自己線と存在しない端点を生成時に除く。1nodeのedgesは[]。引用の選択状態・完成nodeは分岐ごとに複製し、通常Piece／IF／ライブラリ本体へ影響を出さない。v1／v2共通の既存生成指示に、記録番号とfield番号の区別、未完／完了・否定・時点の保持、unknownsへ未記載の出来事を置かないこと、短い必要な根拠だけを使うことを明示した。一般的な未完相parserや意味検査を完成したとは扱わず、新raw全件の原文照合を保持する。

### 検証・原本・次の直接作業

修正後の関連8suiteは267 PASS／FAIL・SKIP0、85.47秒。実固定LMFE0.11.3の文字／TokenEnforcer、原文欄束縛・重複根拠・連番／端点・分岐、既存履歴SQL保存／非生成再読、source duties、IF、Pieceを含む。先行検査の218／51等と合算しない。既存Pydantic非推奨warning1を保持する。途中のpacket検査はasync plugin指定不足4件と、生成指示変更後の凍結packet不一致1件で失敗した。pluginを明示し、同じbuilderで既存架空packetを更新。原入力全件と他5wireは同一、Analysis wireとそれに依存するIF prepared identityだけを更新して最終成功した。

先行1fb55b49のCI43677592608は1516 PASS／1 FAIL（通常Analysisのfield順Falseという旧期待）、Piece43677592610はSUCCESS。通常Analysisは根拠束縛のため既に順序固定なので、未知markerを付けても元のAnalysis schema／設定が変わらないという元の検査責務へ修正した。5cf37079のCI43679810921／43679810872は後続確認対象で、今回の新候補成功へ転用しない。

[5cf実原本](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_graph_scope_actual_20261115/)にexecution.json・semantic-history.actual.result.json・candidate-provider.log・driver.log・restored-provider.log・review.jsonを無修補保存する。[新一回launcher](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_quote_first_once_20261115.py)は9508byte、SHA256 `31b48eb9ea3ed3ae29d2097b9529e836546ae37bcd53fa5f5d8a11286193e547`。同Podの別root `semantic-history-quote-first-20261115-once` で最大3応答＋前後2GET、停止復元込み900秒・一回、学習／再試行なし。既存98fileと補足依存は再送せず、固定sourceを取得し、既存認証と起動環境は同Pod内だけで使う。

通常API／workerは24bc228d Live、DB20261115011424を維持。workerの放置job再取得期限900→1800秒は未変更で、長履歴成功後の同版反映で扱う。新migration・RN変更・build・TestFlight0。新rawの両LEAF→MERGEを原入力・全本文・両端根拠へ照合し、成立した同版だけを既存一回SQL保存・非生成再読・通常API／worker／提供schemaへ反映する。STRUCTURE_MAP_DELTA_NONE、本単位／補助全体は未完。


<a id="analysis-semantic-history-order-complete-20261115"></a>
## 9.77 11/15 — 第一LEAF完結と第二段階到達、対象混同・項目不足と初期化時の順序解除を修正（通常未採用）

候補ccdd0a6cは別root semantic-history-quote-first-20261115-once、実launch113573／候補113578で一回実行。第一LEAFは31.119025秒・HTTP200／stopのJSONを受領し、CMEEを通って第二LEAFへ進んだ。第二は開始後約27.96秒でHTTP503 generation_unavailable、全driver61.109102秒でNOT_GENERATED。MERGE・artifact保存再読・通常反映0。停止復元込み102.066313秒、元args／env／cwdでPID113612へ復元し前後health200。学習・依存install・再試行0。

第一rawの2引用は正しくfield1に対応するが、本文は不採用。『例の番号を記録』は正しい原文事実である。一方、長い元案から一例を短い送信版へ残し、削った説明は別保存したという対象／版／移動先がsummaryで混ざる。『その説明を次の配布物へ入れるか未決』も、残した例と削った説明を指示語で結び替える。1nodeはR1だけで、overviewに訪問・体調があっても8記録の構造化成功ではない。原入力は同じ全12架空記録、回答／本人訂正の実証にはしない。

第二503のlogはfailed_ValueErrorだけで、原因未確定。原文や例外文をlogへ出して推測補修しない。既存Podの実Qwen tokenizerで第二材料の全field17〜24を、短い正規JSONのCPU TokenEnforcerへ通し8/8成功・2.20秒、model取得／credential読取0。別途複合vocabularyのCPUでもcustom例外は再現せず、これを実生成成功へ数えない。

独立した確定不具合は、固定LMFE0.11.3のTokenEnforcer初期化がparser.configを既定値へ置換し、force_json_field_order=TrueをFalseへ戻していたこと。新API a8abcc5a3dd26ddfd0774e7bc649f7144976ec18は既存load_generator内で初期化直後、最初のtoken探索前にAnalysis／IFの意図した順序だけを復元する。Pieceの実際の設定は変えない。既存生成指示へ対象／版／行為状態の対応保持、各LEAFの全独立話題と各記録の根拠／条件差を残す責務を加えた。新guardや固定node件数は追加しない。失敗時は関数名と行番号だけを記録し、本文・prefix・exception message・locals・認証情報は出さない。

最初の追加検査はtestのprivate_prefix関数へtoken_enforcer属性があると誤認した2件で失敗（205成功）。test側が保持している実Prefix objectへ照会先を直し、関連83件成功。全対象8suiteの最終確認は268 PASS／FAIL・SKIP0、84.42秒（既存warning1）。前の267件や83件と重複加算しない。先行ccddのAnalysis CI43680945790はSUCCESS、Piece43680945750は後続pushでcancelledであり新候補の成功へ転用しない。既存架空packetは同builderで更新し、元入力と他5wireは同一、Analysis指示と派生IF prepared identityだけ変更する。

[無修補の実原本6file](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_quote_first_actual_20261115/)を保存。[新一回launcher](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_order_complete_once_20261115.py)は10601byte、SHA256 78bea5f98145ff14c2566ba9cbefc939bd1f401743a5cfcf11fdbd779487d70c。新root semantic-history-order-complete-20261115-once、最大3応答＋前後2GET、停止復元込み900秒、一回・学習／再試行なし。同Pod内の既存96source・driver・input・依存を固定照合し再送せず、最新4sourceと新launcherだけを固定commitから取得する。元提供の独自handler／IF等は一括置換せず、既存decoder3関数＋失敗位置記録関数、prefix初期化後と既存catch呼出の最小箇所だけ変更する。

次は新rawの両LEAF→MERGEを全原入力・全本文・根拠／関係へ照合し、成立した同版だけを一回SQL保存・非生成再読・通常API／worker／提供schemaへ反映する。通常24bc228d・worker stale900・DB20261115011424、新migration／RN／build／TestFlight0。STRUCTURE_MAP_DELTA_NONE、本単位／補助全体は未完。新実出力を得る前に意味品質の改善や採用を確定しない。


<a id="analysis-semantic-history-unicode-base-comparison-20261115"></a>
## 9.78 11/15 — 実停止prefixからUnicode境界を修復し、同じ4Bの基礎側で全12記録を比較（通常未採用）

§9.77のa8abcc5aは実launch113904／候補113909。第一LEAFは39.39秒でstop受領し、第二LEAFで503となり、driver71.992828秒・停止復元込み112.540339秒、元提供PID113946へ復元した。第一rawは依然R1の1nodeだけで、8記録全体の保持成功ではない。summaryの「その場で確認した答えへ言い直した」は、現在の確認が取れていないと訂正し、休憩後に連絡して昼過ぎに答えを受けた原文と異なる。「窓口未定」も現在未確認から強めている。explanationは言い切りかけた段階を保持し、先行の未遂→完了は再現しない。引用3本はfield1へ完全一致するが、意味は不採用、MERGE・保存／再読・通常反映0。

### 第二段階の実停止状態と原因

新しい一回の `semantic-history-second-prefix-20261115-once` では、同じ第二LEAF4記録だけを一回取得し、失敗直前の生成prefixを保存した。全件架空の固定messages SHA256 `9565f4463952e98faef223e841f15ad7ea934e621ae67ed8a28933db841c305f` に一致した要求だけで採取を許可し、一般の本文・認証情報をlogへ出さない。実launch114079／候補114083、停止復元込み72.451034秒で元提供PID114109へ復元。再試行・学習・依存install0。

実prefixは599文字・260tokenで、field17の引用「必要な条件をノートの一ページにまとめて」の直後に停止した。次の原文文字は「鞄」。実Qwen tokenizerは「鞄」を97271／226へ分割し、それぞれ単独では置換文字になる。tokenizer_alphabetにも「鞄」がなく、literal enumを続けるtoken候補が0になっていた。正しいfield17〜24の最短引用を使った先行CPU8件では、この文字を通っていなかった。sourceや推論上の不明を原因として扱わない。

[同a8実原本6file](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_order_complete_actual_20261115/)と[単独第二LEAF実原本7file](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_second_prefix_actual_20261115/)を無修補保存した。後者には固定架空入力だけのfailed-generated-prefix.jsonを含む。失敗を閉じるJSONや新本文へ修補しない。

### 原引用・全材料を保持する直接修正

API `26fda5792b03e69deab3f69fd32b73df4439be64` の既存Analysis隔離parser内で、tokenizerが直接出せないUnicode文字だけをJSON escapeへする。例は「鞄」→JSON上の `\u9784`、復号後は元の「鞄」で完全一致する。非BMP文字は正しいsurrogate pairへする。元field全文・引用候補文字列・source guard・同一根拠pair・CMEE採否を変えず、引用の削除、代替字、原文の短縮、生成後の修補は行わない。既存IF用のexact JSON enum方式をAnalysisの同じ隔離namespace内へ適用し、Piece／IF／ライブラリ本体は変更しない。

同じ実Qwen tokenizer・固定sourceで、保存した全260tokenを新parserへ再生した。旧停止位置の継続候補は0→2となり、Unicode escapeから残りの原引用・field17・JSON終端・EOSまで通った。復号後の引用は「必要な条件をノートの一ページにまとめて鞄へ入れた。」に完全一致。9.228秒、追加model取得0。これは同じ失敗点の技術修復であり、生成本文や一般意味品質の合格ではない。verification.jsonの原本は次の一回に同版で添付する。

関連3suiteは152 PASS／FAIL・SKIP0、11.83秒。BMP／非BMP、実TokenEnforcer・原field束縛・重複・分岐・元namespace不変、既存PieceとIFを含む。先行a8のAnalysis CI43682465720はSUCCESS、Piece43682465712は2698 PASS／2 FAIL。後者は他suiteの環境値で順序初期値がTrueとなり、テストがFalseを仮定していた不備である。テストのsynthetic_generatorだけで観測したFalseの初期条件を明示し、製品設定を変えず独立再現させた。新候補のCIは別の結果として確認する。

### 既存4Bの基礎側を同じ条件で比較する

学習差分適用版は、明示した全話題保持の指示後もR1の1nodeへ縮んだ。Emlis／Pieceが既に使っている同じQwen/Qwen3.5-4B・revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` の基礎側で、同じ全12架空記録・8／4分割・全field・decoder・4096token／210秒上限・CMEE採否を比較する。別名 `cocolon-qwen3.5-4b-analysis-base-851bf6e` をmodel要求と応答に明示する。既存のadapter任意起動経路を使い、一時候補のAnalysis adapter3組6引数だけを外し、追加学習・新model download・新rental・新selectorを作らない。元引数にPiece adapterがないことも確認した。自然文側のmodel名・既存認証は保持する。

[固定一回launcher](../../observation_learning/trials/2026-11-08-auxiliary-asset-reuse-ar01/semantic_history_base_unicode_once_20261115.py)は11923byte、SHA256 `ebeea8cb15dde6e84d1c5b60aa0337ae810c119c589a0bccb16c89c843fc2824`。別root `semantic-history-base-unicode-20261115-once`、最大3応答＋前後2GET、停止復元込み900秒、一回・学習／再試行なし。既存98file／補足依存は再送せず、固定source4fileを取得する。元args／env／cwdは同Pod内メモリで保持しfinallyで元の学習差分適用提供へ復元する。この比較だけで通常設定や重み採用を変えない。

新raw全段階を全原文・本文・根拠・条件差へ照合し、成立した同版だけを一回SQL保存・非生成再読・通常API／worker／提供schemaへ反映する。通常API／worker24bc228d・DB20261115011424を維持。stale1800設定・配置・新migration・RN変更・build／TestFlightは未実施。STRUCTURE_MAP_DELTA_NONE、本単位／補助全体は未完。



<a id="analysis-semantic-history-source-first-20261115"></a>
## 9.79 11/15 — 実4Bの独立話題欠落と統合容量を修正し、根拠を先に選ぶ同じ履歴統合へ（通常未採用）

**11/15最新：基礎4B・小分割候補の実本文は不採用。根拠を先に選ぶ生成へ修正。** 基礎4Bは第一LEAFが212.47秒でlength、他者理解の創作と分類別反復があり採用しない。学習差分付き139f8a88の3／3／3／3は4件stopだが独立話題欠落・対象／実行状態の変異が残り、MERGEは49,485byteで送信前拒否。元提供PID114967へ復元済み。新候補0df12bb1はhistoryだけ根拠→意味の順序、実提示・引用可能recordの参照保持（24以内）を既存decoderへ接続。LEAF目標24,576・不可分cohort49,152・最大6LEAF、MERGEだけ98,304byteとし、native実token＋4096≤32768・全体840秒・一回保存を維持。関連300件成功は意味成功へ換算しない。同じ架空12記録の新一回を準備。通常API／worker24bc228d・DB20261115011424、本単位／補助全体未完、build／TestFlight／実機保留。詳細§9.79。

### 先行する実結果と採否

- §9.78の基礎4B比較は終了。API26fda579、同じ12記録・8／4、第一LEAFのみHTTP200／length、212.47秒。完成node6＋7件目途中、R1／R2だけを扱い、各話題を4分類へ複製した。他者が本人の基準を尊重・理解したと補い、未確認を未決定、主張が弱くなったように感じたことを実際に弱めたことへ変更しており不採用。第二LEAF・MERGE・保存0、全体253.95秒で元adapter提供PID114625へ復元。baseへの通常切替は行わない。
- 引用Unicode修復の同tokenizer CPU原本は、base_unicode_actual_20261115/unicode-cpu-verification.jsonに保持。実停止260tokenに続く引用・JSON終端・EOSが許され、復号quoteが元「鞄」に一致。追加model0／9.228秒であり、新しい実生成成功ではない。
- API139f8a88はLEAFのpacking目標だけを24,576byte、最大6へ変更。原文・両欄・全本人回答・訂正cohortは分離せず、単独cohortは従来の49,152byteまで保持する。同じ12記録は3／3／3／3、全24fieldを一度ずつ受け取った。
- 実4LEAFは全てHTTP200／stop、受領は開始から27.68／144.25／171.86／208.37秒。LEAF1はR1だけ、LEAF3はR7だけを項目化。LEAF2は材料の収集方法と新品材料との差を別対象へ変え、体調を未伝達のままとした。LEAF4は改修の未決を拒否へ強め、R12の買い物と友人への返事を指す「その二つ」をR10改修判断へ混入した。全文Product Readにより意味不採用。全recordへ送信したこと、stopや根拠数を全意味保持へ換算しない。
- 139版のMERGEを保存wireとrawからCPUで再導出。messages49,485byte／wire body49,648byteで、旧49,152byteを333byte超過。message SHA256は357e3303af9d18cefc30283649a0b791002d7a05f1e69a72c4cd9fdded28386a。原文断片15,662byte、leaf packet11,758byte、未代表record[2,3,8,9,11]。MERGE POST0、実行本体218.78秒、停止復元込み260.06秒で元提供PID114967。終了後の停止要求は新たな生成や再試行を起こしていない。

### 既存ownerへの直接修正

API0df12bb15a937108ca01b72a09382f418c1f2a0e：

1. 既存semantic decoderのhistory段階だけ、nodeのevidenceを表示文より先に生成する。引用→その実field→意味とし、先に書いた別recordの説明へ後から無関係な根拠を添えないようにする。公開v3／model.v2のキー・唯一realizerは変更しない。
2. 実際に提示され、schemaに引用候補が残ったfield.recordだけから参照対象を導出する。対象24記録以内では、未参照recordが残る間はnodesを閉じず、新nodeの最初の根拠を未参照recordへ束縛する。追加根拠は元全候補、全対象参照後の追加nodeも許し、一記録一項目へ固定しない。record=Noneの本人訂正を全cohort参照へ数えず、未提示manifestも既読扱いしない。24超の既存部分coverageは新拒否へ変えない。引用参照の確保は全文意味理解の証明ではない。
3. historyの図／詳細文字予算と、node_kind四種を埋める帳票ではない指示を維持。MERGEにも真になる「実際に提示された元fieldの本文と条件」を読む表現へ整合する。
4. MERGEのmessage-byte上限だけ98,304へ広げ、原文断片・仮読み・manifestを送る。親49,152、LEAF目標24,576、不可分cohortの旧上限、request262,144は維持する。byteはtoken換算ではない。nativeはtruncation=Falseで実token数を測り、入力＋出力予約4096≤32768を生成前に検査する。新MERGEのtoken適合・210秒完走・意味品質は実施後に判定する。
5. 全体840秒、HTTP220／要求225秒、部分保存0・失敗時の以前map保持・guard・月次当時版・プラン権利を維持。worker stale設定／通常提供はまだ変更していない。

### 検証・原本・再開点

関連8suite291件PASS、nativeの実TokenEnforcerで参照保持とEOSまで80件PASS（291の部分集合）、planner9件PASS。合計300の異なるcaseで、実意味採用・通常配置ではない。139のAnalysis CIは古い最大3／packing callback前提のplanner3失敗を確認し、その既存testを更新した。新commitのCI成功は未主張。

原本は同trial配下base_unicode_actual_20261115／compact_leaf_actual_20261115へ保存する。compactのmerge-capacity-diagnostic.jsonはCPU再導出だけで、新model／SQL0。実source・wire・rawは変更しない。

再開はsemantic_history_source_first_once_20261115.py。同じ既存Pod・同じ架空12記録、現adapter／model名を維持し、4LEAF＋MERGE最大5応答・pipeline840秒・停止復元込み960秒以内の別一回。学習・追加GPU契約・自動再試行0。受領全本文を原入力へ照合し、適切な最終mapができた場合だけ同じrawを隔離SQLへ一回保存・非生成再読し、通常API／workerと提供decoderへ反映する。配布・本人実機は別保留で、他の補助作業の開始条件にはしない。


### 9.79 実行後追記 — 3記録引用の達成と意味混同、個別仮読みへの修正

**11/15最新：3記録の引用参照後も家族／友人の意味混同を確認し、不採用。個別仮読みへ進む。** 0df12bb1の第一LEAFは66.11秒／stop、3記録の引用を保持したが、家族の新店を友人へ移し、本人の夜の用事を友人の夕食用事へ変更。既存CMEEは逆向き同種edgeの重複で拒否し、保存0・元提供PID115233へ復元（108.62秒）。新18ec8b47は既存nativeへCMEEと同じedge重複制約を接続。LEAFのpacking目標16,384byte／最大16とし、今回12記録は自然に各1仮読み＋同じMERGEの最大13応答になる。不可分cohort49,152・MERGE98,304・request262,144・native実token＋4096≤32768・全体840秒・一回保存は維持。関連315件成功は意味成功ではない。通常API／worker24bc228d・DB20261115011424、本単位／補助全体未完、配布保留。詳細§9.79追記。

0dfのshape受理は成功したが、stage compilerのintent_compiler.py:4135でunordered(from,to)+relation_kind重複を拒否した。受領rawのSHA256は4f3761cf3c04e446ed409410384f04ee97876758ff673a87f4352e6fbfcd7168。新モデル生成を行わず同じrawから位置を確認した。3record参照と意味保持を分けた実原本／再生診断はsource_first_actual_20261115へ保持する。

18ec8b47bd79de101012b202b09db5749a85b212は既存graphの生成済みedgeを同じ対称keyで保持し、未使用のfrom／to／kind候補だけを生成する。逆向き同種を禁止し、同pair別kind・別pair同kind・途中の空終了・一nodeの空edgesを維持。生成後のedge削除や本文修補はしない。

同時に読ませた3record間で主体と条件が混ざったため、既存LEAFのsoft packing目標だけ16KiBへ下げ、最大16LEAFとする。record／回答／本人訂正cohortを分割せず、単独cohortは旧49,152byte上限のまま。固定の記録数上限や新しいcontroller／pipelineではない。同じ実12recordは各13,098〜13,312byte、二件同時は18,164byte以上なので、全12LEAFへ自然に分かれる。最終MERGEと全量guard、一回保存、非生成再読、月次当時版は維持。最大17stageでも全体840秒を再始動せず、各要求225秒の総和は保証しない。

個別読取・SQL履歴・planner63件、native／Piece／三中核隣接252件の異なる計315件成功。native95件は252の内数。新sourceのCI・実13応答・意味採用・SQL保存・通常配置はまだ未主張。

**現在の再開先：semantic_history_individual_cohort_once_20261115.py。** 同じ架空12record、同じ現adapter、12LEAF＋MERGE最大13応答・前後2GET、pipeline840秒・停止復元込み960秒、学習／新GPU契約／自動再試行0の新一回。旧閉じたtrialは再実行しない。全受領rawを原入力と読み、最終mapが適切な場合だけ隔離SQL同版保存・再読と通常API／worker／decoder反映へ進む。build／TestFlight／本人実機は保留。



<a id="analysis-semantic-history-compact-context-20261115"></a>
## 9.80 11/15 — 全体期限の実測から仮読みを簡潔化し、統合で全有効本文を優先（通常未採用）

**11/15最新：個別仮読みは8件で全体840秒へ到達。不採用を保ち、中間出力と統合文脈を修正。** 18ec8b47は8LEAFがstop、9件目は結果不明で504、MERGE／保存0。元提供PID115633へ復元し、停止復元込み880.54秒。受領本文には主体・対象・確認前後の反転が残る。新8c749361はLEAFだけ短い仮読み・空edges・必要な引用へ絞り、必須訂正の全文／容量は保持。MERGEは実message98,304byte内で全有効parent fieldを優先し、超過時は従来の一連続断片と省略記録を使う。全文提示も意味理解済みとはしない。import時のLMFE既定値に依存したtestも修正し、関連343件成功。新同12記録の実生成は準備段階。通常API／worker24bc228d・DB20261115011424、本単位／補助全体未完、配布保留。詳細§9.80。

### 個別仮読みの実結果

同じ架空12記録、学習差分付き18ec8b47、12LEAF＋MERGE最大13要求で実行。8LEAFをHTTP200／stopで受領したが、9件目の応答確定前に共通840秒へ到達した。受領の累積秒は138.203／158.710／230.199／285.750／397.765／570.115／709.449／834.240。各node数は6／1／2／2／5／7／7／5で、最終統合前の図と関係線を詳述していた。9件目はFAILED_OR_ACK_UNKNOWN、結果は504・840.092298秒。MERGE未実行、保存／再読／通常反映0。元引数・環境・作業場所を同Pod内で保持して元提供PID115633へ復元し、全体880.539783秒で終了した。

受領8本文を全文Product Read。R1は現在情報が資料へ反映されていないと後段の追記・送信を反転。R3は作家の展示を友人の展示、本人の用事を別人へ移した。R4は自由資金の少なさを修理代の少なさへ変更。R5は追加一箱なら動ける判断を動けなさへ反転し、未伝達状態も後へ延長。R6は伝えたい部分が入っているという根拠自体を未知化。R7は内容がそろっていないことを担当者がそろえないへ変えた。R8は本人の不案内を友人へ移した。中国語・英語の混入や同内容反復もあり、stop・引用一致を意味成功へ数えない。R2は初期選定の限定読解に明確な反転を見つけていないが、後段の予約・点検待ち・未実施は未表現。中間はAI仮解釈で本人事実ではなく、最終mapの採否は未到達。

### 最小修正と不変条件

候補API8c74936135c352222118217e3a0d8588932013f0。

- LEAFだけを、後段へ主体・対象・記載時間順・条件・留保を引き継ぐ簡潔な仮読みへ変更。中間のedges=[]、通常は最大2node、根拠2件／node、短い図文・詳細とし、完成図を各記録で作り直す時間を減らす。最終MERGEの図／関係線と公開model.v2／watashi.map.v3は維持する。
- node容量は引用可能record数と全文必須の本人マップ訂正数から最低枠も確保し、8訂正などを固定2nodeへ押し込めない。本人訂正の全文引用は短縮しない。その他は実在・一意の160文字以内の既存文候補があるfieldだけその候補へ絞り、ないfieldは旧合法候補を保持する。元field・本人回答・訂正は一文字も削らない。
- MERGEは同じqualified parentの全有効fieldを、[0,len(text)]／complete=True／UNASSESSEDとしてまずstage化する。最終messages全体をUTF8 JSONで測り、98,304byte以内なら完全な有効本文を提示する。超過時だけ従来の引用±160文字の一連続断片へ戻し、省略範囲を保持する。撤回済み本文・未適格回答・AI対象文は復元しない。再導出で同じstageになることを検証する。
- 全提示でもfull_source_semantic_coverage=False。byte合格も実token合格ではなく、nativeのtruncation=False・入力token＋4096≤32768を別に保持する。親49,152・LEAF目標16,384・不可分cohort49,152・最大16LEAF・request262,144、全体840秒、失敗時の部分保存0・以前map／月次保持を維持。
- 新controller・endpoint・tokenizer依存・writer・生成後修補・weight変更・学習は追加していない。通常／Emlis／Piece／IFの既存ownerを分けたまま、既存semantic ownerとdecoderの必要箇所だけを変える。

### 検証、原本、次の一回

関連9suite343件成功（skip0、既存Pydantic警告1）。LMFE_STRICT_JSON_FIELD_ORDER=trueという他suiteのimport既定値も含めて確認した。先行18ecのAnalysis CIは成功、Piece CIは2698PASS／2FAILで、CPUテストがimport時の既定値をFalseと仮定していた。既存testの実constructor reset条件を明示し、receiverのJSONキー順非依存検査も明示した修正である。production Piece設定を変えたものではない。新commit CI・意味品質はまだ成功としない。

coreの98,304byte実境界はSYSTEM制御文paddingで確認し、本人sourceを巨大化するfixtureは残していない。nativeには短候補なし・全文訂正・複数record／recordNone・参照保持・edge重複・Unicode／EOSの検証を含む。機械検査は原入力と実表示文の全文照合の代わりにしない。

原本はindividual_cohort_actual_20261115のsource／wire／raw／logs／execution.json。first2は先回収prefixと全wire/body一致、残3〜8も全文読了した。同じ12記録は既使用評価で、未知入力へ戻さない。

次はsemantic_history_compact_context_once_20261115.pyによる別一回。既存Pod、同じ架空12記録・現adapter、12LEAF＋MERGE最大13要求＋前後2GET、pipeline840秒・復元込み960秒、学習／新GPU契約／自動retry0。閉じた旧実行は再起動しない。全本文と最終mapを原入力へ照合し、適切な最終結果の同版SQL一回保存・現在版と同IDの非生成再読・通常API／worker／decoder反映まで進める。build／TestFlight／本人実機は別保留で、他の補助作業の開始条件にはしない。


<a id="analysis-semantic-free-unicode-20261115"></a>
## 9.81 11/15 — 仮読みの全体時間を短縮し、自由文のUnicode早期終了を修正（通常未採用）

同じ既使用の架空12記録・24欄・17,314文字を8c749361で一回取得した。9応答はすべてHTTP200／stopだが、8LEAF受入後、9件目のexplanationが生の「鞄」と空白で終わりJSON未閉となった。analysis_semantic_map_invalid、360.310829554秒でNOT_GENERATED。10〜12／MERGE／SQL保存0。元source／argv／env／cwdを同Pod内で保持しPID116049へ復元、health200、停止復元込み404.726044001秒。旧18ecの840秒終了とは原因を分ける。first3のwire/bodyは先回収prefixと全一致。実9本文を原文照合し、主体・条件極性・時点・意向の反転をreview.jsonへ残した。LEAFの参照数／受信stopを最終の意味成功へ数えない。

原因再現は受信raw9の534文字prefixと元messages、合成の分割UTF-8／複合tokenを使うCPU検査。LMFEのfree-text shortcutがparser alphabet外文字を含むtokenを通し、空stack／早期EOSへ至る。同じ位置のJSON Unicode escapeは完全閉鎖し、json.loads後の文字も一致する。実生成token IDsは未記録のため、その列の同定とは報告しない。

新API候補11200b2011fc787ffe015a4463df447b9366574fは、Analysis／IFの全stateでU+FFFDを含むtokenとparser alphabet外文字を含むtokenを除外する。既存blank制限は自由文だけ、Pieceの従来filterは保持する。Analysis／IFのexact enumはalphabet外文字と真のU+FFFD原文をJSON escapeで保持し、原入力／引用内容を置換しない。reader、意味prompt、model／adapter、通常DTO、上限、SQL、RNを変更しない。native128件成功（追加6）、Analysis／IF／semantic連携84件成功。Pieceの同38file通しと新head CIは確認中。

§9.80の「import時のLMFE既定値捕捉」という説明は訂正する。公式817f944のConfigは環境変数を毎回読む。CI8cのPieceは2698成功／2fixture assertion失敗、Analysisは成功。実constructorが解決するConfig factoryを明示制御し、古いpackage参照が併存する条件の2caseを追加、局所59成功／同38file collection下4対象成功。全CI実行順の根本原因を確定したとの報告はしない。

原本はcompact_context_actual_20261115のsource／wire／raw／logs／execution／review。次はsemantic_history_free_unicode_once_20261115.pyの別一回で、同じ既存Pod・同じ12記録と現adapterを使用する。12LEAF＋MERGE最大13POST、前後2GET、pipeline840秒・復元込み960秒、学習／新契約／自動retry0。閉じた旧試行は再起動せず、同一新native版による全体取得を確認する。最終本文を原入力へ照合し、適切な結果の同版SQL一回保存・currentと同IDの非生成再読・通常decoder／API／worker反映まで未完として追跡する。


<a id="analysis-semantic-full-merge-context-20261115"></a>
## 9.82 11/15 — 同版12LEAF受入と全24欄の実容量を確認し、全文MERGEだけ継続（通常未反映）

11200b20／native583a10e8で同じ架空12記録の12LEAFを491.31秒で全受入した。原本文はmemo17,314scalar＋memo_action1,039scalar、計18,353scalar／54,771UTF8byte。従来の17,314はmemo欄だけの数であり二欄合計ではない。raw1〜8は前8cと全byte同一、9はJSON完結し鞄の引用も復号後原文一致。全12本文を原入力へ照合し、主体・意向・条件・既知返信の誤読はreview.jsonへ記録した。これを最終の意味成功には数えない。

MERGEは13番HTTP503、取得本体516.389秒、nativeはtokenize直後のcontext検査で拒否し最終生成0／SQL保存0。元source・argv・env・cwdのままPID116491へ復元、health200、停止復元込み560.238893秒。起動argvに--context-tokensがなく、実sourceのanalysis_service既定16,384が適用されていた。既存CLI上限32,768は変更しない。自然返答／Pieceのbase profileは8,192のまま。

追加model0のCPU検査で、実fallbackは80,209byte／input19,208、12memo field中全文1・未提示9,620scalarを確認。全量候補は24/24fieldが原文と完全一致、omitted0、110,242byte／input24,545。出力4,096を予約して28,641token、32,768内に収まる。全文提示もfull_source_semantic_coverage=False／UNASSESSEDを保持する。全量messages hashは1941a809ef1b00d1d95b31aaa4146869c85ca26f5465f8af0c4d056bf6ee2c4d。新API8ae18c752aee50c4a968857a5c89e80e2d2915efは既存core／transportのMERGE byte枠を98,304→131,072へ揃えた。parent49,152・LEAF16,384目標・16LEAF上限・request262,144・native実token検査／切詰め禁止・output4,096・各要求220/225秒・製品pipeline840秒・失敗時保存0は維持。関連64件は63成功＋旧上限fixtureを新境界へ直した1成功、coreは131,072byteちょうど／1byte超の既存検査を実行した。

検証環境の訂正：公式LMFE817f944のTokenEnforcerはreplace(parser.config,alphabet=...)で既存設定を保持する。旧QA0.11.3の新Configへresetする挙動とは異なる。§9.80／81のimport時既定値捕捉・stale-moduleをCI原因とする説明は根拠とせず、fixtureの仮説patch／2caseを撤去した。通常Piece／AnalysisはTrue→True、Analysis復旧guardだけ明示的False注入で検査する。公式pin使用でnative／Analysis・IF連携212成功、Piece58成功。先行旧QA全38fileは2701成功／旧Gitblob不足1失敗、その1件は7f51原本取得後成功。11200 CIは4fixture失敗／2698成功、Analysis成功確認は別管理。新ff5a2fbbはtestだけ修復し、その後8aeでbyte枠を整合。新head CIは確認中であり、旧QAの全成功を公式pinの全CI成功へ読み替えない。

次のsemantic_history_merge_context_once_20261115.pyは、受入済み同native／同4Bの12exact wire/bodyを再admitし、新full MERGE1POSTだけを生成する。source2fileだけ新8ae／hash固定へ更新、前native全bytes583a10e8は保持、candidateargvに--context-tokens32768だけを加える。新driver300秒・停止復元込み420秒、学習／新契約／自動retry0。旧516.389＋新取得枠300は840秒未満だが、fresh13件一括完走とは区別する。全24field／omitted0／messages hashと実token証跡SHAをPOST前に固定する。適切な最終結果の原入力照合→同版SQL一回保存→currentと同IDの非生成再読→通常decoder／API／worker反映までは未完。build／TestFlight／本人実機は別保留。


<a id="analysis-semantic-source-only-merge-20261115"></a>
## 9.83 11/15 — LEAFの仮読みを最終生成から外し、原文から統合する候補

前候補8ae18c75の全24欄を提示したMERGEはHTTP200で本文を受領したが、finish_reason=lengthで終了した。無修補rawは4380字、10項目完成・11項目目途中でJSON未閉、consumerは503、保存0である。driver256.73263280540004秒、停止復元込み301.9282689928077秒で元提供PID117095へ復元した。「503でrawなし」という初読は誤りとして訂正し、受領済み原本を保持する。全結果はmerge_context_actual_20261115/semantic-history.actual.result.json.gzへ無変更JSONをgzipで収録し、原本SHA256は4d11d2bd88dc53bf540ed24ed609bd1fec19f341459a9a2b2399f1835b70b382。response-13.txtは受領途中本文そのままである。

本文では、LEAF7の説明を再使用して利用者向け情報の宛先を担当者へ逆転し、LEAF12の説明を再使用して既知の「了解」返信を未知へ戻していた。別記録のAI文も混入した。またcompilerは、原根拠の範囲が重なるだけでLEAFのAIunknownを最終nodeへ自動追加していた。privateの未検証表示だけでは、公開本文への混入を防げていなかった。

API候補dca20231ad1791c07a5011d6905340c78d4de0b3は既存semantic owner内でMERGEをsemantic_map.history_synthesis.v2へ変更する。最終作者には本人原文24欄全文と既存source/controlを維持し、LEAF由来の情報は平坦化した完全一致引用索引41件（field／quote／scalar_rangeのみ）と、12受領のrequest／messages／response hashだけを渡す。LEAFのoverview・項目説明・分類・unknownは提示しない。引用位置の一致を意味確認済みとは扱わず、原文から主体・対象・時点・条件・留保と記録間の関係を読み直す。LEAF v1 messagesの同一性を保つ共通instructionの旧キーへの言及は残るが、MERGE v2の材料に旧キーとAI自然文は存在しない。

元LEAFのraw・packet・coverage・hashは、束縛されたreceiptからprivate meaning_review.history_synthesis.leaf_candidatesへ再導出して保持する。scoped_unknownsもprivate未検証候補とし、inherited_unknowns=[]、unknown_handling=PRIVATE_ONLY_UNASSESSEDとする。最終nodeのunknownへ自動追加せず、最終作者自身が原根拠から返して既存採否を通した内容を使う。本人sourceに明記された不明・留保、source duties、本人訂正説明全文の根拠使用義務は維持する。保存済み当時版の自動書換えは行わず、新生成／次のsource更新から新境界を使用する。公開DTO／endpoint／SQL migration／RN変更はない。

LEAF v1 messagesはbyte同一で、既存12receiptを変更せず再検証した。新MERGEは88558bytes、24欄、引用索引41件、receipt12件、省略範囲0、messages SHA256は878eb91858f3b95c30185e3f6aa7e858ad023a453b3687380838e2b71ee21610、stage refはanalysis-semantic-stage:fed68c054d69b79d59bcead7082d25222ea94fbc5fa97014d503368110c124c0。このCPU preflightの新モデル要求は0。原入力はmemo17314＋memo_action1039＝合計18353 Unicode scalar／54771 UTF-8 byteである。全原文の提示と全文の意味理解成立は区別する。

非生成検証はcore／service58件（84.73秒）と既存consumer109件（17.72秒）の計167 PASS。必要な検査は公式LMFE pinを使用した。CIは記録時点で進行中。Piece workflowは先行8aeで2701件＋78件成功後に最終stepが20分上限で取消しとなったため、job上限を35分へ変更した。検査の削除・選択縮小はない。

次のsemantic_history_source_merge_once_20261115.py（SHA256 b6f047d08538333a14593056a89c51f3c59e35e81aad64e83cd773b821beadb6／26063bytes）は、同じ12receiptを使う新MERGE一回だけを取得する。新coreとintentのみ固定hashで取得し、native全bytes583a10e8・transport131072byte枠・同model／adapter／bridgeを維持する。停止前にcached tokenizerで実input＋4096≤32768を確認する。driver320秒、準備・候補取得390秒、取得・復元を含む全体480秒。旧516.389秒と新取得枠320秒は840秒内だが、fresh13件一括完走とは区別する。学習0、再試行0、元argv／env／cwdは同Pod内RAMから復元する。完成rawの意味照合・同版SQL保存再読・通常反映は未成立。通常API／worker24bc228d、DB20261115011424、build／TestFlight／本人実機は保留する。

### §9.83 実施後追記 — 原文境界の修復と作者の意味品質を分けて判定

同controller b6f047d0は予定どおり新規1MERGEのみ取得、旧12wire／bodyは全件byte同一で再利用した。停止前のcached tokenizer実測は入力20235＋出力4096＝24331token、24欄全文／省略0／messages878eb918を確認。dcaのAnalysis CI43703156299とPiece CI43703156238はいずれもsuccessになった。

実MERGEはHTTP200／finish_reason=length、raw4834 Unicode scalar／SHA256 c9d3a2250581d2c1606169b38892ef78bff001feed5bebc5fc3aab445b7e459c、11node完成・12番目途中でJSON未閉。consumer503、driver258.17974476423115秒、停止復元込み334.64427521498874秒で元提供PID117766へ復旧。原本source_only_actual_20261115/semantic-history.actual.result.json.gzの展開後SHA256はb05c4d7428d5a8e00f397c1702be4d04b46f2b1e3c9ee5b2fe93d52d2bd88c94。response-13.txt／execution／logs／reviewも同所に保持する。保存0、JSON修補0、finishの読み替え0。

原文との独立照合ではn3が記録1の同僚のうなずきを記録2の家族の反応へ混同、n10は『終わるまで残ることに予定を変えない』を『終わるまで残る予定を変えない』へ反転、n2は後続の窓口確認を消失、n7は今回読了と次回未読を不明瞭化、n11は実際の片づけを未決定へ戻している。AI LEAF文の混入経路を外しても、作者自身の主体・否定・時点の意味保持は未成立であり、時間枠の解消だけでは採用しない。全candidateを通常へ配置して『境界修復だけ通常完了』と数えることもせず、未採用の長履歴経路は通常未反映のままとする。

実providerはPython3.12.3／Torch2.8.0+cu128／Transformers5.19.0／Triton3.4.0。GatedDeltaNetとcausal_conv1dが最適化部品未導入のため低速参照処理へ切り替わるlogも確認した。既存環境を更新せず、fla-core0.6.0／einops0.8.2の固定wheelを別targetへhash必須・no-depsで導入する候補準備に着手した。導入を意味品質改善の証拠にはしない。実import選択と数値の有限性・参照計算との誤差を検査した後、学習に使わない新規架空2記録を同messagesで、同4B base851bf6eとadapter120u各1回の有限比較へ進める。別model IDと実adapter状態を明記し、通常の自動fallbackや新weights採用にはしない。改善を確認した場合だけ全12原文へ戻す。通常反映・同版保存再読は未完である。

### §9.83 有限比較の実行前記録 — 実GPUに合う隔離kernelを検証済み

fla-core0.6.0はGPU可視時にGluon.extraを要求し、既存Triton3.4.0ではImportErrorとなることを実再現した。CPU非表示時のimport成功だけでは適合と判定しない。旧targetと失敗proofを保持し、既存Torch／Triton／Transformersを変更せず、新target semantic-kernel-deps-compat-20261115へfla-core0.4.1／einops0.8.2／causal-conv1d1.7.0をhash必須・no-depsで導入した。causal wheelはTorch2.8／CUDA12／ABI True／CPython3.12／x86_64に適合する公式原本a1fcd5d0、再downloadせず同原本を再利用した。

実GPUは同provider envでNVIDIA RTX 4000 Ada Generation／SM8.9／20991901696byteと確認した。先行のA5000／SM8.6を前提にした検査条件は誤りであり、通常機種・費用・性能をその記憶から推定しない。失敗compat proofを保持し、新Ada proofは実名とSM8.9へ厳密に束縛して確認した。4関数が実FLA／causalへdispatchし、GDN output／state4比較とconv output／update／state3比較の計7件が有限・基準内。元baseline sourceと隔離deps treeは前後同一、重みロード0・モデル要求0。1752tokenのkernel warm2回は9.293350780848414秒と0.001780638936907053秒、全検査77.10029265098274秒。これは単独kernelの時間であり、アプリ生成速度の改善実測とは区別する。成功proof原本kernel_proof_actual_20261115/warm-ada-proof.json SHA25628908c29ee066397bcc1a3326eefe41453ce159c11a90eec06f691932fc7675e。

次のsemantic_reader_adapter_base_once_20261115.pyはSHA25648df0a65a00233e9a55fc4d04e145799f05c57b9ae1c6a4c6099b6751d4022a6／23120bytes。学習へ混ぜない新規架空2記録／4欄、同messages722924e9／8567byte／実1752tokenを、現120u adapterと同base851bf6eのadapter無効化で各1POSTだけ比較する。base model IDはcocolon-qwen3.5-4b-analysis-base-851bf6e-candidateと明示し、candidate内のanalysis_base profileだけを追加する。両条件は同grammar／4096出力／32768context／90秒上限、nativeもglobal2要求上限。元natural／Pieceの2048／8192と現adapterの通常挙動は維持する。driver220秒、準備取得300秒、元提供復元込み420秒、学習／retry／SQL保存0。元提供117766のargv／env／cwdは同Pod内RAMから復元する。比較結果がよくても全12履歴の成立証明や通常採用とはしない。


<a id="analysis-concrete-reading-adapter-base-20261115"></a>
## 9.84 11/15 — 同じ架空2記録のadapter比較と、具体的な出来事から読む指示への修正

§9.83の準備済み48df0a65スクリプトを一回実行した。原本とproofのSHA、遠隔一回root不存在、元提供PID117766とhealth200をfreshに確認した。既存端末にread-only確認の入力不成立があり、新端末へ接続した。誤入力は比較スクリプトの起動前で、生成・提供変更は0。その後、固定した同一2記録／4欄・messages722924e9／1752入力token、同一grammarと4096出力予約・32768context・90秒上限でadapter120uとbase851bf6eを各1POSTだけ比較した。

| 条件 | 実結果と採否 |
|---|---|
| adapter120u | HTTP200／stop・536scalar・22.098984秒。CMEEで生成受領できたが、overviewの「参加者へ送った未完了」と後日送信済みが矛盾する。会場からの返信を本人も読んだ翌日記録があるのに、返信が来たか未定とする。不採用。二階という引用自体は保持し、階数反転を誤りとして報告しない |
| base851bf6e・adapter無効 | HTTP200／length・2274scalar・90.905477秒。5nodeとedge途中でJSON未閉。本人の「関わっていない」を「関与の拒否」、案内作成を「主導権を握る」へ強めた。不採用。既知の送信や参加者返信が残る部分だけで全意味成功へ換算しない |

取得driver113.089644秒・停止復元込み156.822579秒。元source／argv／environment／cwdを同Pod内で復元し、health200・元提供PID120452。新しいmodel要求2、学習0・retry0・SQL保存0。実原本6file＋独立原文照合review.jsonは既存trialのreader_adapter_base_actual_20261115へ保存する。回収ZIP SHA256 f8b8704b63263a4a2b83234f4c5aaaf9e18caca98d49286dbda6e4594f57b19a。

API候補4ef9d081a09abb6c755b5ef9b52518e0a39af67aは、既存semantic_admissionの共有説明とLEAF／MERGE説明を、誰が・対象・時点・行動の状態→事実と条件→その範囲の読み、という順へ改訂した。診断の正解内容は指示へ埋め込まない。確認前と確認後を区別し、表示文を本人と実際の出来事の記述へ向ける。厳密なJSON形式以降・enum・原文引用・source guard・条件付き本人訂正／撤回・辞書・compiler・native decoder・公開v3・SQL・RNは変更0。

同sourceで履歴core／planner／serviceは65成功・旧LEAF hash2不一致。指示を変えたため、古い「LEAF不変」test名を現在指示への束縛検査へ変更し、新hash2profileを固定。同rawに旧hashを付けた場合のanalysis_semantic_response_unbound拒否を追加して2件成功した。assertion削除や旧12受領の黙示再利用ではない。新しい指示では旧12LEAFを再束縛できないため、限定実本文が改善した場合も全12を新規取得する。新候補CI／実本文の成功は未主張。

次は同じ既存Pod・同adapter120u・互換隔離kernelを保ち、修正版による固定2記録と別の照明2記録を各1POSTで確認する。baseの再実行・学習はしない。改善未確認の全12再試行はしない。適切な全体mapの同版SQL一回保存・別service非生成再読・通常decoder／API／worker反映まで本単位は未完。通常API／worker24bc228d・DB20261115011424、月次当時版・build／TestFlight／本人実機保留を維持する。

STRUCTURE_MAP_DELTA_NONE：既存意味作者の生成指示のみを変更し、source／権利・writer・API／DB／RN・新serviceを追加しない。補助全体の完成・商品受入れへ加点しない。


### §9.84 検証実行の訂正 — 受領記録callbackが旧60秒期限を選ばせたため品質比較無効

凍結f530d4f3 launcher＋c701a2c3 coreを既存Podへ配置し、同adapterで読書会2記録と旧12中の照明2記録を各1POSTとした。実tokenは1782／3281、両入力とも分割なし・原文不変である。しかし検証用に追加したcaptured_source関数が、既存is_semantic_analysis_model_sourceのexact type照合を外した。_model_responseはsemantic225秒ではなく旧callback60秒を選択した。1件目は60.107076秒でFAILED_OR_ACK_UNKNOWNとなり本文未受領。次のPOSTは429busyである。2HTTPを2本文成功へ数えず、修正版の意味採否は判定不能とする。

driver60.135083秒・停止復元込み111.519319秒、元提供PID120737へ復元・health200、SQL保存0。2件とも意味が誤っていた、改善0だったとの結論は出さない。原本7fileと訂正reviewはpositive_reading_invalid_20261115へ保持する。回収ZIP SHA256 2f78ce3cd0ed5195ba692da43eda8a1a7eca5c0411f3b12473fe794c63b64bac。

記録callbackを外し、実source instanceをそのまま既存pipelineへ渡す。HTTP受領の原本は元からacquisitionsに保存されるので、新しい記録callbackは不要である。受領不明時は次のPOSTへ進まず停止復元する。別に通常semantic schemaが最大24node・各詳細3000字を許すことを既存sourceで確認し、4k出力予約に対する内容選択量を既存作者内で修正する。全12の再試行・通常反映は、適切な小規模実本文取得前に進めない。

4ef9d081のAnalysis CI43710129296は表示へ内部分類を出さない指示の文字列assert1失敗、同group2881成功・12236subtests成功。rootは同条件の明示を指示へ復元し、assertionを削除しない。先行の固定LEAF hash2失敗と、この1件と、実比較無効のwrapper不具合は原因を分けて保持する。Cocolonのdocs／診断原本10fileのpublic pushは自動承認審査で公開開示承認不足として拒否され、local6ec86fc3は未push。別経路で公開せず、最終差分を具体化して必要な確認を行う。


### §9.84 最終ローカル候補・通常未反映・承認審査停止

local API候補 `3ee95c9c8eab865cc0c74279eff0ff344e553e60` は4ef9d081を親とし、共有指示の内部語非表示を明示、旧hash拒否を保ったLEAF固定hash、既存semantic_output_schemaの通常生成量と既存検査だけを変更した。通常のtitle60／summary160／detail420／unknown240／overview480／edge説明360を既存MERGE相当とし、短い完全一致引用を優先する。原入力全文・本人map訂正の全文引用は保持。node枠は実record／訂正slotから、edge総枠は利用可能なnode pair数から算出する。これは同じpairの異種関係を禁止する新意味規則ではない。通常property順、公開キー、CMEE受信、LEAF／MERGE schemaは維持した。

最終同sourceのcore／planner／service／native生成／semantic map5file群は248PASS・FAIL／SKIP0、94.26秒、既存Pydantic警告1。先行137 native検査はこの248の部分集合で合算しない。CI4efの内部分類指示assert1失敗は修復済みだが、新local候補のCI／実モデル本文／通常配置成功とはしない。

修復済みdriverは実source instanceをそのまま渡し、受領不明時は次POSTへ進まない。既存native583aのsemantic_output_schemaだけをAST/text predecessor hashで照合し、新関数へ置換する。compileと保持helper一致を確認。`next_action_scope.json`の3file合計225975byte、script1e69a1a5／core39873651／function75eb0aa9、同Pod、最大2POST、driver220秒／準備取得300秒／復元込み420秒、学習／retry／SQL保存0である。

この3file送付は自動承認審査により「外部Runpodへのpotentially sensitive payloadの開示承認不足」で送信前拒否。別経路で転送・起動しない。最終画面で元提供PID120737／health200、新root不存在、3file未配置を確認した。Cocolon docs／原本のpublic pushも先行して同種の開示承認不足で拒否されている。公開前の差分・原本・具体送付範囲をprivateな引継ぎ一式へ保持し、必要な確認を最終段階でまとめる。

再開位置はこのscopeの一回である。最初のadapter／base比較の意味不採用、次のwrapper期限による比較無効、最終候補の未送付を混同しない。小規模実本文で改善が確認できた場合だけ、新指示で全12を新規取得し、適切な最終rawの同源泉SQL保存・別process非生成再読、通常decoder／API／worker反映へ進む。通常24bc228d・DB20261115011424、月次当時版、selector・build／TestFlight／本人実機保留を維持。補助活用全体・本作業単位は未完である。


### §9.84 承認後の一回実行 — 両条件stop、原文照合では不採用

Mashの明示承認により、固定3file225975byte（core39873651／schema function75eb0aa9／launcher1e69a1a5）を既存Pod f1lle4xwq3wjlnへ送り、byte数・SHA・未使用root・元提供PID120737／health200を照合して一回だけ実行した。adapter120u・同重み／設定・互換隔離kernelを維持、学習／retry0。読書会1796tokenと照明3295tokenは、実token＋4096出力予約が32768以内であることを停止前に確認した。前回のwrapperを使わず実source instanceを通した。

| 条件 | 実結果 | 原入力・表示全文の独立照合 |
|---|---|---|
| book_club_two_day | HTTP200／stop・1038scalar。50.127189秒時点で受領、CMEE GENERATED | n1は初日の二階と翌日の一階を区別し、n2は翌日の送信・了解返信を正しく保持。しかしoverviewは「参加者へ送るかは未実行」と述べ、原文の送信済みと自出力n2に矛盾。不採用。edgeは出来事の関係ではなく出力項目の分け方を説明しており不足 |
| lighting_prior_and_later | HTTP200／stop・608scalar。累計83.753586秒時点で受領、CMEE GENERATED | 棚・光・予算という選択条件の記述に明確な事実矛盾は見つからない。ただし唯一の項目は、旧照明の使用停止・購入見送りと、後日の購入・設置・配線調整・三十分使用を保持しない。今回対象の変化の確認には不足。欠落を事実捏造とは報告しない |

2POST・driver84.045769秒、停止復元込み134.688812秒（420秒以内）。元source／argv／env／cwdを同Pod内で復元しPID126071・health200、鍵値／全環境の外部保存0。SQL保存・全12統合・通常配置0。rawは修補せず、acquisitionのHTTP body／投影／private根拠と固定原入力・preflight・execution・logを既存trialのpositive_deadline_actual_20261115へ保存。回収ZIP49631byte・SHA256963c6d0eb01ac4fb0c7e73cef1a0bc44ca2de4bb39f6e6bed730a7a4e0925eb9、actual result SHA256c908122a1a4ec1c26c0ee1ee7bba89c88fd68a70bb3452470cbd7e0a4c4b8ef3。独立reviewはc54d32582d7323707a913ccc864502084929918aafe883c50795e64272d34f20。

準備済み差分の公開保存も同じ明示承認で実施した。API1c9f6f73511dac0f220db1f65297c5d748d7a3feはlocal3ee95c9とtree920f55ab8fe6678aecfa65b40d4583a11ccc2c90が同一、Cocolon720bce102b065025ba7f150717363f28a32d739fはlocalcfb5bb8とtreebc61cd068720fe08586ab3fcc6401fc23639dc20が同一。shell push認証が利用できず、既存connectorで原bytesと親順を保持して作成したためcommit IDだけが異なる。旧headを照合し、強制更新・merge・deployは0。現在の明示承認後も送信前拒否が続いているとは扱わない。

通常候補の生成容量を2node／1edge・短い引用へ狭める変更は、1記録に複数の独立意味や同じpairの異種関係がある入力を落とし得る。今回の限定診断の完結をもって通常へ採用しない。通常24node／48edge、長い完全一致引用、旧文字数上限へ復元し、compact原本は診断専用の凍結bytesとして保持する。概要を最初に書いた後でn2が既知送信を正しく書いている事実から、生成順と指示の不整合を次の修正対象とする。4Bが後日の出来事を全く読めないと一般化せず、Bの2record参照も状態変化を理解した証明へ換算しない。


### §9.84 次の修正候補 — 容量を戻し、根拠・項目の後に概要を生成

local API bf45b93f2a670648457199646d30bd88946c9984（公開済み1c9f6f7を親）は、診断用compactの通常縮小を戻した上で、既存semantic_output_schemaの通常／LEAF／MERGEをschema_version→nodes（evidence先行）→edges→overviewの順へそろえる。通常24node／48edgeと旧文字数上限・長い完全一致根拠、LEAF／MERGEの旧容量・引用選択は保持する。historyのschema bytesは順序の変更分だけ意図して変わるため、旧byte同一とは記録しない。IFの早期分岐・Piece独立parser、意味admission・source guard・本人訂正・SQL・RN・公開keyは変更0。

共有作者指示は、読みを変える前後の行動状態と条件を項目に含め、共通条件だけで後の実行を置き換えず、概要を各項目・関係線と一致させる。作成物の分類や配置の説明を本人の関係の代わりにしない。JSON例も同じ根拠先行・概要後へそろえた。架空例の正解文や名詞を製品sourceへ埋め込まない。

新messagesのLEAF固定hashを再導出し、直前とそれ以前の両receipt hashを同rawへ付けても拒否する対照を残した。旧順と新順のrawはそれぞれ元のexact receiptで受入れ、同じ公開mapになることを確認する。nativeの実文字／token順、旧容量を順序以外同一とする比較、1記録3意味・160字超の根拠・同pair異種関係も確認した。native／core／map3suite215PASS（19.33秒）とplanner／service2suite37PASS（81.42秒）の重複しない計252PASS・FAIL／SKIP0。既存Pydantic警告1、local pytest9.2.0／asyncio1.5.0とCI pin差は維持。途中の容量復元136件は重複する前sourceなので加算しない。独立reviewは具体的な阻害要因なし。実4B改善・同版SQL保存・通常反映の成功とはしない。

次の有限確認はsource_first_prepared_20261115へ固定した3file226769byte、core8193bdf7／function29fe72a2／launcher50f3d576。未送付・未実行であり、前の一回許可を使い回さない。新root semantic-reader-source-first-20261115-once、元提供PID126071、同adapter120u・同2条件、最大2POST／driver220秒／準備取得300秒／復元込み420秒・学習／retry／SQL保存0。直前actual c908122aと復元完了のpredecessorも照合する。候補native583a→ccb2b253の関数transplantをlocalでcompileし、二欄4fieldの新messagesと実source型・受領不明後の次POST停止を照合済み。停止前の実token確認は同Podのcached tokenizerで行い、local推定へ置き換えない。

STRUCTURE_MAP_DELTA_NONE：変更は既存の意味作者指示と既存native生成順・容量復元・関連検査だけであり、新しいservice／source owner／公開contract／DB型を追加しない。normal API／workerとDBのfresh connector確認は従来24bc228d／20261115011424・Live／ACTIVE_HEALTHY。workerのfresh poll logはRender側503で取得できず、今回poll200を確認したとは書かない。

次候補は公開API ef329983723a15cb87d893242b83216b826c4749へ反映し、tree95cd46d94f3128321a4ebab0787ab2bde9676eb1と変更4blobがlocalbf45b93fに完全一致することをGitHubから再取得照合した。これは作業branchへの保存であり、通常API／worker／nativeの配置や新実本文成功ではない。


公開後CIの固定資材差分も修復した。旧1c9f6f7のPiece CIはSUCCESS、Analysis CIはcurrent4B packetの2assert失敗（同群1522成功・21subtests）。次候補ef329983では通常容量2275byteは復元済みだが、旧schema順hashと固定MAP wireの2点は未追随だった。既存fixtureのMAP wire_json／bytes／sha3値だけを現builderへ一致させ、全6原入力と他5caseをexact維持した。IFの生成毎に変わるartifact由来IDは不要な更新として除外し、旧case全体を保持する。schema pinは新順ac39c4f1へ更新し、根拠先行／概要後置のassertも明示。unmarked owner境界は維持する。

最終test資材候補local834a9cf3は26PASS・FAIL／SKIP0、6.34秒。本体core8193bdf7／nativeefaeba2bと次3file226769byteは不変。今回の最終sourceに対するlocal検証は215＋37＋26の重複しない計278件成功。26件の前回runやCIの1522件・21subtestsは加算せず、旧CI失敗を成功へ変更しない。新revisionのCI状況はpublication receiptで区別する。

固定資材修正版を公開API144656a9f312b8b4dce39c03e05da84e190eaf74へ保存し、local834a9cf3とtreeb8eeb6c37fe1935031421adba51c2c53f24d1aef・変更2blobの完全一致を再取得照合した。本体sourceと新3fileはef329983版から不変。最終headの新CIは進行中であり、local278件をCI成功へ読み替えない。


<a id="source-first-sql-preacquisition-resume-20261116"></a>
## 9.85 11/16 — 送付前停止を維持し、取得前SQL固定・同raw保存再読と条件付き全12実行を準備

再開時に公開API144656aとCocolon6558ae3のHEAD／全treeが保存済み候補と一致し、tracked差分なしを確認した。最終APIのAnalysis CI43728862913はSUCCESS、以前の固定packet／schema順hash2失敗を含む群も1524PASS／21subtestsで完了。Cocolonの5CIもSUCCESS。旧ef329983の2失敗と最終headの成功は別revisionとして保持し、local278件や先行CI群を重複加算しない。

準備済み新3file226769byteの送付を試みたが、自動承認審査が、前回承認225975byteと異なる外部送付への明示承認が確認できないとして送付前拒否した。再開指示を新scopeの明示承認へ換算せず、別経路で送付／実行しない。新root不存在・新3file未配置、元提供PID126071／health200をread-onlyで再確認した。今回追加送付・モデル・学習・再試行・本番DB操作は0。§9.84の完了済み一回は再実行しない。

### 取得前SQL状態と元原文の固定

既存Q3Database／PGliteと実Analysis9migrationを使い、既存架空12記録の原文・二欄・選択・時刻をSQLへ保持した。生成前のanalysis_cumulative_source_snapshotからguard a000deb9、snapshot.now／period_start／end、親requestと全12LEAFのmessagesを固定し、4,835,570byteのprecheckpoint801ba068を保存した。新SQL guardは旧full12入力guardと同じであり、旧guardをPython由来と推定しない。時計だけ進んだ別process／移動先復元でも同じguard・原文・凍結材料・全12LEAF messagesが一致する。guardが同じでも、新指示・新as_ofに旧receiptを付け替えない。snapshot／plan／receipt／restart／relocation原本はsource_first_full12_prepared_20261116、binary checkpointは引継ぎ一式に保持する。

### 同raw一回保存・別process非生成再読の準備

full12_same_raw_finalize.pyは、未来の実13応答が完全受領／stop／GENERATEDであり、元input／guard／as_of／messages／wire request bytes／body hashと一致する場合だけ同じ既存pipelineへ再生する。承認された実artifact identityをrealizerだけへ固定してprojection・本文・private根拠・coverageを元取得物と完全比較する。12記録24欄・省略0と全source refsを保持し、元guardと期間のanalysis_cumulative_commitを一回だけ行う。元precheckpoint／actualrawは不変。保存後のcheckpointを別Pythonへ復元し、直接current／detail／monthlyと通常HTTPensure=falseから同じID・本文・投影・coverage・private根拠を読み、モデル／新writeを拒否する。

既存test packet由来の合成13応答で上記dryrunと移動先読取りが成功し、1artifact／1commit／1monthly reference、追加model／hostedDB0を確認した。合成応答を実4B本文・意味品質・商品受入れと数えない。初回の合成packetは全長引用を複製してMERGE131072byte上限で保存前拒否となり、失敗原本を保持した。合成fixtureの引用だけを既存nativeの短い完全一致候補へ変更し、実source／生成容量／保存境界は変更しない。実rawでの保存再読は未実施である。

### 追加実行を一括で確認できる有限scope

| 段階 | 未送付の正確なpayload | 実行上限と条件 |
|---|---|---|
| A | 既存source-first3file226769byte：core8193bdf7／function29fe72a2／launcher50f3d576 | 同じ読書会2記録と照明2記録、最大2応答、停止復元込み420秒・一回 |
| B | 追加2file88972byte：full12_sql_source_first_once.py29826byte／72f5cb7dと、full12-sql.pre_acquisition.input.json59146byte／bdb872a5 | Aの実原文照合で今回対象の意味が適切な場合だけ、新規12LEAF＋MERGE最大13応答。停止復元込み1020秒・一回。A不成立時は送付／実行0 |

最大5file315741byte・最大15応答、各段階の実行復元枠は7分／17分である。照合時間を実行枠へ混同しない。学習／retry／旧応答再利用／新Pod／新重み／新依存0、既存認証と起動環境は同Pod内だけで利用する。A送付物をBで再送せず、4.8MBのSQL checkpointはPodへ送らない。Bは完了したAの実2stop／GENERATED・source／native／driver identityとrestored_pidを必須とし、PID fallbackを持たない。意味の合否は原文と全出力の独立照合で判断し、自動の意味PASS flagやMash正式商品受入れへ置き換えない。

BはSQL由来inputと親ref／全12LEAFをofflineで再導出済み。実cached tokenizerで各LEAFを停止前に検査し、実MERGEも送信前に入力token＋4096≤32768を確認する。native要求上限13・単体210秒、既存typedsource／service840秒・driver850秒・準備取得900秒・復元1020秒。受領不明後は次POSTを止め、finallyで元提供を復元する。両driver・native関数transplant・各payloadのcompile／source-plan照合と独立reviewはPASSだが、実token検査・実生成は未実施。具体範囲・ハッシュはsource_first_full12_combined_scope_20261116.jsonを正とする。前の許可や今回の再開指示だけで新scopeを実行しない。

### 通常反映の期限整合

実worker起動logでstale_after900秒を確認した。840秒の意味pipelineの外に、通常の保存経路ではHTTP7処理（設定値合計54秒）とCPU／thread／JSON処理がある。HTTP timeoutはinactivity／phase値なので、894秒の全job上限や840＜900だけで安全とは証明しない。既存設定ASTOR_WORKER_STALE_RUNNING_SECONDS=1800を品質・同raw保存再読後の最小調整候補とし、workerだけへ指定版と併せて適用・起動log確認する。新controller・API設定・outer deadlineは追加しておらず、1800秒も任意入力の完了保証ではない。17分の隔離試行枠を通常jobのclaim→mark_done実測へ換算しない。

通常API／worker24bc228d・DB20261115011424、selector／重み・月次当時版、build／TestFlight／本人実機保留は今回不変。A／Bの実意味と同raw保存再読が成立してから、既存native／API／workerの版・context・期限と通常反映を閉じる。本単位／補助全体は未完。STRUCTURE_MAP_DELTA_NONE：既存商品source／公開contractの変更0、追加は既存trial内の一回用検証・再読準備だけである。


<a id="ordinary-record-coverage-actual-20261116"></a>
## 9.86 11/16 — 承認済みAの原本照合と、通常分析のrecord被覆適用漏れの修復

Mashの明示承認で§9.85の最大5file315741byte案のAを一回実施した。Aの正確な3file226769byte（core8193bdf7／schema関数29fe72a2／launcher50f3d576）を送付し、同adapter120u・同weights／config／32768context／隔離互換kernelを使用した。既存認証と起動環境は同Pod内だけで利用、学習／retry0。停止前のcached tokenizer実測は読書会1886、照明3385tokenで、4096出力予約との合計は32768以内。driver139.290247秒・停止復元込み191.244379秒、元argv／env／cwdへPID127974で復元しhealth200。以前の送付前拒否は今回の明示承認で解決しており、現在の実行結果を「未送付」とは扱わない。

| 条件 | 原本の実結果 | 独立原文照合 |
|---|---|---|
| 読書会2記録 | HTTP200／stop・1036scalar、CMEE GENERATED | 後日の案内送信・一人の「了解」が明記されているのに「参加者が案内を受け取ったか…未確認」と一般化。全員既読だけが不明である。根拠field1／2はいずれも初日の記録。n2に後日の送信への言及はあり、後日入力が渡っていない原因ではない。非関与は正しく保持したが、今回対象の確認→修正送信→返信を保てず不採用 |
| 照明2記録 | HTTP200／length・2153scalar、edge途中でJSON未閉、consumer503・artifactなし | native90.01秒で終了。4096token消尽ではない。受領prefixの4nodeは前のrecordのfield1だけを引用し、後日購入への言及はunknownにある。最終本文は未成立で、見えていない続きの意味や完成品全体を判定しない |

A1は2HTTP本文受領・1GENERATED／1NOT_GENERATED。両方成功、または照明の最終意味が捏造だったとは記録しない。条件付きB1は未送付・未実行0、全12／SQL保存／通常配置0。原本ZIP f8131896、actual result8d01fcbe、独立review5243f69bを既存trialのsource_first_actual_20261116へ保存し、rawを修補・再束縛しない。

### 既存生成制約内の適用漏れと最小修復

既存semantic_json_parserはhistory_stageがLEAF／MERGEの場合だけ、引用可能field→recordを既存UniqueEvidenceListへ渡していた。通常2記録mapでは空mappingとなるため、引用を初日に偏らせたまま閉じられた。実rawを同じ既存helperへ再生すると、旧通常分岐は読書会rawを完結受入れ、同じquoteable record mappingを渡すだけで2node目の引用にあるraw index427（0始まり）で拒否する。照明prefixもraw index509（0始まり）から違いが出る。これは生成制約の不足の再現であり、record参照が意味理解を保証するという証明ではない。

修復は既存semantic_json_parserのhistory限定分岐を外すだけで、引用可能な正整数recordが24以内なら通常mapにも同じ制約を適用する。被覆前の次nodeは未参照recordから根拠を選び、全対象recordを参照する前にはnodesを閉じない。fieldとrecordは別IDのまま、1recordの独立3意味、同一pair異種関係、通常24node／48edge、長い完全一致引用、本人訂正全文、25record以上の従来partial、未知record、IF早期分岐、Piece独立parserを保持する。共有core8193bdf7・semantic_output_schema関数29fe72a2・既存receiver／admissionはbyte不変。今回の悪い旧rawを後段で新しく拒否できる修正ではなく、生成時の選択を制約する修正である。

API f1ffa8a67699d7b68ac6365f8c86093b070b90caの変更は既存native source、既存generation schema test、受領した架空rawの回帰fixtureの3pathだけ。関連4suite287PASS／20.91秒・既存Pydantic警告1、実raw／wire／messages hashの不変と旧分岐再現を検査した。最終production bytesは当該関数以外不変で、独立reviewに阻害要因なし。新モデルの意味改善・全12・通常反映成功へ加点しない。unknowns表示の既存「まだ記録にないこと：」の表現問題は別の既存残差で、意味修復と偽って同梱しない。

### 新しい有限A2／条件付きB2を具体化（未送付・未実行）

A1は承認された一回を消費済み、B1の意味条件も不成立である。未使用B1の13応答を別のAへ転用せず、元A1／B1のbytesと結果を凍結した。既送付core8193bdf7／schema29fe72a2は同Podで再利用し、次の新規送付候補は4file合計123621byteとする。

| file | byte | SHA256先頭 |
|---|---:|---|
| semantic_json_parser.ordinary_coverage.py | 1450 | 661fdf31 |
| semantic_reader_ordinary_coverage_once.py | 31676 | 83311b9a |
| full12_sql_ordinary_coverage_once.py | 31349 | 78f615ed |
| full12-sql.pre_acquisition.input.json | 59146 | bdb872a5 |

A2は同じ架空2条件・最大2応答・復元込み420秒／一回。元提供PID127974とA1のactual hash8d01fcbe／正確な1GENERATED＋1length／復元完了をpredecessorとし、A1を2GENERATEDと偽らない。native210→forwardHTTP220→typedrequest225秒へ整合し、2条件共通driver265秒・準備取得300秒・復元420秒を使う。265秒は2件合計の期限であり、各210秒を両件へ保証しない。受領不明なら次POSTを止め、期限時もfinallyで元提供を復元する。

A2の全原文と実raw／投影／概要／関係線の独立照合が今回対象で適切な場合だけ、B2を新規12LEAF＋MERGE最大13応答・復元込み1020秒／一回で進める。新A2のexact driver／native／parser identityと2件HTTP200／stop／GENERATED、restored_pidだけを必須としPID fallbackなし。構造条件だけで意味合格を自動宣言せず、Mash正式受入れへ換算しない。native210、service840／driver850／準備取得900／復元1020秒。両段階学習／retry／新weights／新依存0、既存認証と起動環境は同Pod内だけ。新rootを使いA1／B1を再実行しない。

両launcher／embedded driver／native variantは元583a原本とparser predecessor hash照合後のtransplantでcompile済み。A2messages2件はA1とexact同一、B2のSQL guard／parent／全12LEAFも元planと一致、原文改変0。正確な全hashと上限はordinary_coverage_prepared_20261116/ordinary_coverage_payload_offline.jsonを正とし、独立reviewを同folderへ保全する。cached tokenizer実測・実生成・送付は0、具体的な明示承認前に実行しない。

### 同raw保存再読と通常反映への接続

生成前SQL checkpoint801ba068・guard a000deb9・as_of／全12原欄／planは不変。復元したlocal runtimeから再び同じSQL源泉と全12messagesを確認、以前の合成post-saveを別processで通常HTTP200・追加model／SQL write0として再読した。これは実4B保存の代替ではない。正確なLMFE Git817f944f、ClientDeps／PGlite／launcher一式をportable13,242,291byte・SHA012c7ab9として引継ぎへ保存し、Python3.12.14／Node24.22.1を要する。旧QAとの依存差もmanifestへ記録し、旧環境byte同一を装わない。

意味が適切な新13応答からのみ、凍結SQL源泉と同じ最終rawの一回保存・別process非生成再読を行い、既存native／API／workerの版・context・期限を合わせて通常反映を閉じる。通常API／workerのfresh確認は24bc228d・Live／unsuspended／autoDeployOFF、Supabase ACTIVE_HEALTHY・migration20261115011424。worker起動logのstale_after900秒を確認、既存1800秒設定は品質・保存成立後の調整候補で未適用。最初のhealthはtimeout、再確認HTTP200であり原因は断定しない。Render固定commit選択とSave onlyを区別し、通常mainを意図せずdeployしない。

STRUCTURE_MAP_DELTA_NONE：既存native生成制約の適用漏れ修復だけで、新source owner／controller／公開型／API／DB型は増やしていない。既存Analysis mapへ最新の再開先を戻す。EmlisAI・Pieceの既存接続と通常24bcの実績を保持し、今回のCPU検査を三中核全体の品質完成へ換算しない。本単位／補助全体・一般品質・実意味／同raw実保存／通常反映は未完、build／TestFlight／本人実機保留。


<a id="ordinary-coverage-a2-outcome-20261116"></a>
## 9.87 11/16 — record被覆修復後のA2実意味と、既存作者の正例修正

新4file123621byte案へのMashの明示承認後、A2に必要なparser1450byteとlauncher31676byteの計33126byteだけを既存Podへ送付し、一回の2条件を実施した。同120u adapter・weights ecbdd0d1（完全SHAは原本execution）／config4389a598、既送付core8193bdf7／schema関数29fe72a2、同じ全原文・messagesを使用。native210／forwardHTTP220／typedrequest225秒、2条件共通driver265秒の枠内でdriver180.82531058695167秒、停止復元込み234.50742218876258秒。元argv／env／cwdをPID128408へ復元し、health200を確認した。学習・retry0、A2の一回は消費済みである。

| 条件 | 受領・既存制約の結果 | 全原文との独立照合 |
|---|---|---|
| 読書会2記録 | HTTP200／stop・2071scalar、CMEE GENERATED、4node／2edge。field1／2／3で両recordを参照 | 後日送信済みなのにoverviewで「案内は未送信」、確認済み一人の「了解」があるのに参加者の受領を一般的な不明へ戻した。既送信の会場問い合わせと後日の椅子問い合わせを混同し、「本人へ問い合わせ」を原文にない宛先として加え、関係線の説明も実際のnode内容と一致しない。会場問い合わせへの非関与は保持したが、本文全体を不採用 |
| 照明2記録 | HTTP200／stop・2429scalar、CMEE GENERATED、4node／2edge。field1／3で両recordを参照 | 後日に別製品を購入したことと限定した使用感は認めた。一方、局所の候補／寸法記録を「習慣」、条件整理を「具体的な使い方を想像する前」、一つの手段を「後者だけが次の購入へ応用できる」と広げた。購入が完全に欠落したとは記録せず、根拠のない習慣・先後・排他性により不採用 |

両条件のsource／mapped／processedは各2、unparsed0となり、旧通常mapの一方のrecordだけで閉じられる欠落は除かれた。ただし後日のどの事実を選び、否定・既知／不明・相手・時点をどう本文へ統合するかは別である。引用と両recordの参照を意味理解・商品品質の証明へ換算しない。独立reviewはA2_MEANING_REJECTED_B2_CONDITION_NOT_SATISFIED、意味採用0。条件付きB2のfile送付／12LEAF／MERGEは0、SQL保存／同raw実再読／通常反映0とし、未使用B2枠を別試行へ振り替えない。

実原本は既存trialのordinary_coverage_actual_20261116へ保存した。actual result115132byte／SHA e0ececf484bdd6f16bf561773c0167d96924a86f5d0c09eecec30fde7a40501a、ZIP59919byte／SHA b37ec72ae1d29e6bec1c8c254aba378928eda983e43022de9b8b1c48b0a97eb1、独立review e2761f49。ZIPの9memberはCRCと展開原本のbyte一致を確認。最終原本と同じ内容の途中書き出しを、新しいモデル応答や未完本文へ数えない。元raw・wire・messages・guardを修補・再束縛しない。

### source-only診断と既存教材の成立範囲

既存source_dutiesを同じ元原文へ純粋適用したcounterfactual v2では、両条件ともclaims=[]／written_relations=[]・interpretation_status=UNASSESSEDだった。この診断のrequest_refは実v1受領と別で、実rawへ再束縛していない。既存finite／raw frameの出力もそのまま本人事実へは昇格しない。共同担当者の会場問い合わせ節にcoarseなactor=current_userが付く場合があり、intent_compilerの既存ownerもdefault actorだけではSELF所有を証明しないと明記している。8欄111個の既存原文spanの位置indexはactor・状態・肯否・時点を判定せず、実生成には未使用で次候補にも採用しない。モデル／DB呼出し0、意味確認0の診断である。903048byteのfull source-planはprivate handoffに保持し、公開trialには小さいsource_only_diagnostic_summary.jsonと元診断のhashを置く。

現120uの出自は同じ既存9教師を使ったfresh base24更新→保存された追加56→回復40＝有効120更新で、weights ecbdd0d1／config4389a598へつながる。追加57と報告されたうち未保存1更新を加えず、optimizer／RNG非保存のため厳密再開としない。教材はROOT_AUTHORED_SYNTHETICで、Mashの教師・品質受入れ原本ではない。全体mapのcocolon.analysis.semantic_map.model.v2をassistant-only CEで扱い、4held-outにはtargetがなく学習対象外だった。T09_time／T08_other／T06_unfinishedの既存入力・targetは同refの原本から確認し、既存語りに作成方針の文言があることだけを誤りや今回の失敗原因とは認定しない。公開trialにはexisting120u_teacher_provenance.jsonだけを置き、full plan／raw lesson本文を追加複製しない。

API f1ffa8a67699d7b68ac6365f8c86093b070b90caのAnalysis／Piece両CIとCocolon6f681dbbfa2bcd65b68a4f018001001aa9e033e3の5CIは成功。これらは固定公開sourceの検証で、A2本文の採用や次候補の成功ではない。同源泉SQLの取得前snapshot／guard／as_of、別process保存再読の既存準備はreadiness receiptへ残し、実A2本文は保存対象にしない。通常API／worker24bc228d・DB20261115011424、worker stale900、build／TestFlight／本人実機保留を維持する。

### 既存作者に正の完成例を実装

今回の修正は、既存quoted-unitの主体／対象・時点・希望／実行を入力と正例の対で示す教え方を、現在のsemantic map作者へ移すものである。旧units形式や別作者を呼ばず、placeholderだけのJSON例と重複した方針説明を、短い現契約の作成指示と、植物の手入れというA2と異なる架空episodeの完成マップへ置き換えた。実120uの9教師そのものを変更・再学習した修正ではない。教師に方針説明の文があることを今回の失敗原因と断定しない。

full／MERGE例は、土の状態を確かめた本人の水やりの前後、妹が済ませた受け皿洗い、肥料についての妹の希望と残る不明を、2記録・2node・1edgeで示す。LEAF例は最初のrecordだけの2node・edges=[]・unknowns=[]で、後日の水やりや肥料を示さない。出力例のkey順は実nativeと同じschema_version→nodes（evidence先行）→edges→overviewで、単なるsort_keys順へ戻さない。各例の引用は元fieldへ完全一致し、実入力と混ぜない。sourceの実行状態を語る代わりに作成方針を本文へ並べる例にはしない。

API 5108a10f38e9e1da641dc8956d582df9eb245e9aの本体変更は既存semantic_admission.pyの作者指示・正例helper・stage別の既存messages生成だけで、core SHA b489a2204dfe53aa0de30e3573d707af877c9eef62d410c710e706fafdcd80fa／196652byte。新正例testと既存3test／fixtureを含む6pathの差分である。native7d7cb41a／schema関数29fe72a2、receiver／意味admission・source guard・実user fields／role辞書・公開v3・SQL／月次ownerは不変。source更新・本人訂正・emlis handoff等の動的警告suffixもAST一致を確認した。neutral span indexやcoarse frameのactor／状態を生成材料へ追加しない。

新正例のliteralは通常／LEAF／MERGEのnative文字制約・CPU合成token／EOS検査と既存CMEEへ通り、別の実入力へ例の引用を流用すると拒否する。既存6case fixtureはMAPのwire_json／wire_bytes／wire_sha256だけを現builderへ同期し、他5case全体と全元入力は完全保持した。IFのfresh UUID由来のprivate値は更新理由にせず保持。新4LEAF message hashへpinを更新し、前の4hashと以前の8hashを旧receipt拒否の対照として残す。旧rawを新messagesへ付け替えない。

関連7対象の初回は137PASS／旧MAP wire fixture1FAIL、fixtureの3値だけを同期した後のpacket26件は全成功（25件は初回成功と重複）。重複除外138対象を確認済みであり、163件とは数えない。新正例12件はこの集合に含み、先行287件や前revisionの成功を加算しない。最初の古い固定資材の失敗・IF UUID比較が更新前に停止した記録は残した。独立意味reviewと技術reviewに阻害事項なし。ただし新モデル本文の意味改善は未証明である。

### 同じSQL源泉で、取得前の新作者計画と保存再読を確認

pre_acquisition.input.json bdb872a5・checkpoint801ba068・全12原文／二欄／選択／時刻・guard a000deb9・frozen as_of2026-11-16T00:32:38.924+09:00は不変である。新coreだけを反映する別pre-rootへ、同じSQL checkpointと入力をbyte同一で保持し、新12LEAF計画75daa8b75e24216293e11aac9eec2025efcda838c18bbae2e9d0e6326b9fedebを、追加取得前に固定した。原文材料から決まるparent request_refは4654ca3fのままだが、作者指示を含むmessages hashは全12で変わる。source7hashの差はcoreだけで、旧receiptを流用・再束縛していない。SQL復元後の現在時計で凍結materialを上書きしない。

同じ新sourceでの合成13応答は、12記録24欄を省略なしでMERGEへ渡し、一回SQL保存・別processのcurrent／detail／monthlyと通常HTTPensure=falseの同ID／本文／投影／coverage／private根拠再読に成功した。隔離1artifact／1commit／1monthly reference、再読SQL write0、model／hostedDB0。合成raw fe7006b8、post checkpoint97af9458／5038225byte。元checkpointと合成原本は不変。これは実4B意味や実取得物の保存成功ではなく、将来の適切な最終rawを同源泉で一回保存する既存helperの技術確認である。

### 新しい未実行A3／条件付きB3

A2の一回は消費済み、B2は意味条件不成立で未送付・未実行である。既存schema29fe72a2・parser661fdf31・native base583a10e8は同Pod内で再利用し、次の送付候補だけを4file319749byteへ確定した。

| file | byte | SHA256先頭 |
|---|---:|---|
| semantic_admission.worked_lesson.py | 196652 | b489a220 |
| semantic_reader_worked_lesson_once.py | 32609 | ed46be71 |
| full12_sql_worked_lesson_once.py | 31342 | 3ed6df89 |
| full12-sql.pre_acquisition.input.json | 59146 | bdb872a5 |

A3は同じ架空2条件・最大2応答／復元込み420秒を一回。A2 actual e0ececf4の2stop／2GENERATEDとrestored PID128408・core／native／parser／driver hashをpredecessorとして照合するが、その意味不採用を合格へ変更しない。native210→forwardHTTP220→typedrequest225秒、2条件共通driver265／準備取得300／復元420秒、停止直前start_ticks／argv／SERVE hash再確認を保持する。2件とも単体210秒の保証ではなく、共通期限で打切り・再試行なしに復元する。

新A3の全原文・raw・項目・関係線・概要の独立意味照合が今回対象で適切な場合だけ、B3は新規12LEAF＋MERGE最大13応答／復元込み1020秒を一回。新A3のexact identities・両HTTP200／stop／GENERATED・restored_pidだけを必須とし、PID fallbackや自動意味PASSは置かない。service840／driver850／準備取得900／復元1020秒、受領不明後の次POST停止・finally復元、cached tokenizerの実token＋4096≤32768確認を保持する。両段階学習／retry／新weights／新依存0、既存認証・全起動環境は同Pod内だけで利用する。A2／B2の凍結bytesと原本を変更しない。

両launcher・driverとnative7ae06f31／8dc87e9c transplantをcompileし、A3のuser材料とguard／request refsはA2と同一・messagesは新指示、新B3全12messages／refsは取得前の新SQL計画と一致することを独立確認した。停止前cached tokenizer実測・送付・新モデル呼出しは0。正確な全hash・上限・技術reviewはworked_map_lesson_prepared_20261116/worked_lesson_payload_offline.jsonを正とし、具体的明示承認前に実行しない。既存helper・原SQL状態・新plan・runtimeは引継ぎに保全する。

意味が適切な新13応答から同じ最終rawを一回SQL保存し、別processで非生成再読して、既存native／API／workerの版・context・期限を合わせて通常反映を閉じる。通常版24bc228d／DB20261115011424・worker stale900は現状のまま、既存1800調整は品質・保存成立後の候補で全job保証ではない。新codeの公開保存や合成再読を通常反映・本人受入れへ換算しない。本単位／補助全体・一般品質・全12実意味／同raw実保存／通常反映は未完、build／TestFlight／本人実機保留。

STRUCTURE_MAP_DELTA_NONE：既存作者に正の完成例を示す修復だけで、新reader／controller／source owner／公開型／route／DB型は追加していない。元source・意味admission・唯一realizer／保存・月次境界を保持する。


<a id="worked-map-lesson-a3-outcome-20261116"></a>
## 9.88 11/16 — 正例修正版A3の実結果、既知／未知と時点統合の未達

Mashの今回の明示承認に従い、確定4file319749byteを同Podへ送付し、全byte数とSHAを照合してA3を一回だけ実行した。既存120uのweights／config、schema29fe72a2／parser661fdf31と互換隔離kernelを維持した。新指示の実入力tokenは読書会2386／照明3885、原文・二欄・guardは変更しない。両方HTTP200／stop・CMEE GENERATED、source／mapped／processed各2・unparsed0。受領は累計99.509434秒／230.005807秒、driver230.312784秒・停止復元込み282.181677秒である。元argv／env／cwdでPID130379へ復元し、復元後health200を確認した。学習／retry0、鍵・全環境の外部保存0。

| 条件 | 原文と全可視出力の照合結果 |
|---|---|
| 読書会 | summary／overviewの後日送信完了は回復した。一方n2・edge n1→n2・overviewは、本人が翌日に会場返信の写しを読み部屋と時刻を確認した事実を、返信未着／不明へ戻す。n2 unknownsは明示された本人の問い合わせ非関与も不明へ戻す。n1末尾は初日の未送信と後日の送信完了の時点が整合しない。意味不採用 |
| 照明 | n4は後日購入・設置後確認を認め、A2の習慣化・排他的な一般化は今回見当たらない。しかしn3は初日に線を眺めると決めた行動を未決定へ変える。n3／overview／関係線は型調査・予備金額確認を依然今後の未完として置き、後日の確認済み・店頭確認・購入との時点を統合できない。購入が完全欠落したとは記録しない。意味不採用 |

独立担当者と華恋が、原文全欄・model raw・全node／edge／overview／unknowns・projection／textを照合し、A3_MEANING_REJECTED_B3_CONDITION_NOT_SATISFIEDとした。細部省略だけを不合格理由にせず、改善した点と残る意味変異を分ける。誤りは受領rawに既にあり、表示変換だけの不具合ではない。モデル内部やadapter／baseのどちらが原因かは、この実行から断定しない。生成順・被覆制約・正例の機械成立を意味品質へ換算しない。

原actualは130017byte／SHA256 e49505fbfec6cd97bba6510d11ab2f5c8761d699640251ab30add62c656eaabb。元13fileのZIPは81045byte／SHA256 9d968f1acbcc59f72fab4e5fbf2bcd74081371db80535df4cc790e7864d97a77。ZIP CRCとactual／executionの遠隔元byte一致を確認した。全原文・raw・preflight・driver・native・logは既存private引継ぎCocolon_CMEE_ConcreteReading_20261115.zipのverification/worked_map_lesson_actual_20261116/へ保持し、公開trialにはexecutionとbody-free独立reviewを置く。原rawとmessagesは無修補で、SQL源泉・凍結時刻・旧結果・旧計画を上書きしない。

B3用launcherと入力は今回の4file送付に含まれるが、意味条件不成立のためB3起動／新規12LEAF／MERGE0、B3root不存在を復元後に確認した。A3の一回は消費済みで、未実行B3枠を別Aや再試行へ流用しない。SQL保存・同raw実再読・native通常採用・Render設定変更／配備0。通常API／worker双方24bc228d・Live／autoDeployOFFとSupabaseの最新migration20261115011424をfreshに確認した。worker1800調整は未適用、selector・重みとbuild／TestFlight／本人実機保留を維持する。

次は、既存作者が同一対象の後続事実と初期不明を混在させる箇所を、今回の原文と実誤文の対から修復・検証する。現instructionと植物正例には時点・行動状態・確認済みをunknownへ戻さない説明が既にあるため、同趣旨の禁止文を足すだけで改善と扱わない。新方式・追加学習・新しいGPU試行は未準備／未実施で、今回の未使用B3を許可として使わない。安全装置や記録機構の追加を本筋へ挟まない。

primary outcomeはBLOCKER_NARROWED。完結2応答と原raw段階の意味不整合・復元は実測できたが、実保存再読・通常反映が成立していないため、本作業単位も補助経路全体も閉じていない。STRUCTURE_MAP_DELTA_NONE：既存能力の実結果のみで、新owner／controller／API／DB型を追加しない。


<a id="analysis-base-control-prepared-20261116"></a>
## 9.89 11/16 — 同一指示・同一制約でAnalysis追加学習だけを外す対照の準備

§9.88の全原文・A3 raw／projection／textと現生成sourceを再確認した。後日の確定事実は入力全文にあり、誤った未着／不明／未決定は受領rawに既にある。nativeはunknowns=[]を許し、本文へ未着や不明を必須にする制約はない。したがって入力欠落、保存・DTO変換、表示だけを修復対象としない。

既存ROOT_AUTHORED_SYNTHETICの9教師は、元plan f969cd2bと全原入力・targetへ戻って確認した。全recorded_atは2026-11-07T07:29:12、複数記録は別場面比較中心である。T09は同field内の過去／今を分け、T06は未達を恒常的方針へ変えず、T04は返却済みと別の未決定を分けている。A3の誤りを正解として教えた具体例は見つからなかった。一方、同じ対象について後日の確認・実行で以前の不明を解消する複数記録例はない。現植物正例も不実行→後日実行と別対象の不明を示すが、不明→後日確認済みは示さない。この範囲の欠落は事実だが、失敗の原因とは断定しない。

同じ注意文をさらに足す前に、保存A3を比較基準として、同じ4BのAnalysis追加学習だけを一時disableする2生成を準備した。新しいモデルや重みを取得せず、既存base revision851bf6eと既存base_inference_contextを使用する。明示model aliasはcocolon-qwen3.5-4b-analysis-base-851bf6e-candidateで、120uを使ったと偽らない。A3と全messages／原文／guard／request_ref／core b489／schema29fe／parser661f、4096出力・32768context・native210秒／HTTP220秒／typed225秒を保持する。全体待ち時間だけをdriver385秒／準備取得420秒／復元込み540秒へし、2件それぞれ210秒の完走保証は置かない。新しい学習は行わない。

新A4 launcherはA3 actual e49505fb・core／driver／nativeと復元PID130379を照合し、新しい未使用rootだけで最大2POSTを一回実行する。Analysis鍵の明示base aliasだけがanalysis_base profileへ入り、自然鍵での同aliasは拒否される。自然／Pieceの分岐と元profile、意味decoderの容量は変えず、既存disable_adapter context内で推論し、success／failureともeval・勾配OFFへ戻す。元提供はfinallyでargv／env／cwdごと復元する。global要求上限には一時提供へ届く他の有効要求も含まれ、枠を使い切ってもretryしない。

独立原文照合でA4が今回対象に適切な場合だけ、新B4 launcherはA4のexact native／driver／2HTTP200／stop／GENERATEDと明示base model、A4のrestored_pidを検査して起動する。意味PASSの自動判定やPID fallbackは置かない。新規12LEAF＋MERGEの最大13POST、service840／driver850／準備取得900／復元1020秒・一回、受領不明後の次POST停止とfinally復元を保持する。B4でも全原文・全出力の独立意味照合が必要である。

送付候補は既存trial/base_control_prepared_20261116のsemantic_reader_base_control_once.py（35139byte、SHA f40a84cccdcd87bf65b6b2f4b221dca58ccf3bd13b2302dee6ff47d2e98fbb41）とfull12_sql_base_control_once.py（33442byte、SHA 2bae9cc96640a97a3add2a7374a488586af04606f51489d5dda980a2675409ae）の計68581byteだけ。core／schema／parser／SQLinputは同Pod既存byteを照合再利用し再送しない。A3とB3の凍結fileは不変で、A3の消費済み許可・未使用B3枠は転用しない。現時点の新Pod操作・tokenizer・model／学習／retryは0、具体的な新承認前に送付・起動しない。

両launcher・embedded driver・native variantをcompileし、A4全messages／材料／guard／refsのA3一致と、B4全12LEAFの既存plan75daa8一致、SQLcheckpointとsource7hashを確認した。nativeの変更関数はmake_handler／load_generatorだけで、schema／parser／Piece関数／main・既存base contextのASTは同一。fake generatorを使う実loopback HTTPでbase別名、120u既存経路、自然鍵との分離、自然経路、global上限の5ケースを確認し、既存base contextのsuccess／failure復帰も確認した。最初のoffline確認では検証scriptのcheckpoint literalが誤っておりHTTP前に停止、正本receiptのhashとの比較へ直して最終確認した。payloadはその前後で不変。実4Bの意味改善・実tokenizer・SQL保存・通常反映の成功ではない。独立技術reviewに阻害点なし、正確なhash・上限・成立範囲は同folder/base_control_offline.jsonとbase_control_binding_and_routing_review.jsonを正とする。

同sourceのため、入力bdb872a5・SQLcheckpoint801ba068／guard a000deb9・凍結as_of・取得前plan75daa8と7sourcehashは変えない。model別名はplanのmessagesに含まれず、既存finalizerはactualとwire／body間のmodel一致へ拘束するためbase試行と両立する。新13実応答が適切な場合だけ同じ最終rawを一回保存し、別processで非生成再読する。通常nativeのbase profile／model identity整合とAPI／worker反映はその後の未完工程で、旧通常commitへ無検証でbase aliasを送ることはしない。通常24bc228d／DB20261115011424・worker900、selector／重み・配布保留、本単位／補助全体未完を維持する。

STRUCTURE_MAP_DELTA_NONE：既存4Bの推論contextによる有限な対照準備で、商品source／新reader／controller／public型／DB型を追加しない。追加学習済み版が原因とも、baseが解決するとも現段階では認定しない。


<a id="analysis-base-control-actual-20261116"></a>
## 9.90 11/16 — A4の同条件base比較を実行、B4は条件不成立

Mashの今回の明示承認後、§9.89の新2file68581byteを同Podへ送り、確定SHAとbyte数を照合してA4を一回実行した。A3と両条件の全messages・材料・guard・request_ref・input_tokens（2386／3885）の完全一致を回収後にも確認した。core b489／schema29fe／parser661f・4096出力／32768context・native210秒／HTTP220秒／typed225秒は同じで、同4BのAnalysis追加学習のみを既存contextで一時disableし、明示base別名を使った。candidate logにもdisable marker2回がある。学習／retry／新重み取得0、認証・起動環境の外部保存0。

| 条件 | 実結果と原文照合 |
|---|---|
| 読書会 | wireHTTP200／stop・CMEE GENERATED、受領累計109.855277秒。後日の修正送信、一人の返信と全員既読不明の分離、椅子問い合わせの不明、未開催を保持。A3の会場返信・本人非関与の不明化は今回見当たらず、改善を認める。ただしn1／n3 unknownsは未開催なのに「本人が二階部屋を本当に使ったか」を掲げ、n1は本人の写真上の想定を共同担当者の二階予約可否へ移す。n3の本人一階変更unknownも後日の確認・案内修正との対応が不明瞭。全図／本文の意味品質は不採用 |
| 照明 | wireHTTP200／length、累計321.983087秒。rawは5273字／10999byte、n3〜部分n11まで同じ予算・時間項目を9回反復し、文字列途中で切れた不完全JSON。CMEE消費側は非stopを拒否しNOT_GENERATED／failure_status503、projection／textなし。通信HTTP503とは記録しない。未完rawを完成図の意味合否へ換算せず、上限内で完結しなかった実結果として扱う |

独立担当者と華恋が全原文・全受領raw・読書会の全node／edge／overview／unknowns・projection／text・照明failureを照合し、A4_NOT_ADOPTED_B4_CONDITION_NOT_SATISFIEDとした。「待たず」や「不一致」という語だけを不合格根拠にせず、実状態と未知の不整合を根拠にする。読書会の改善をA3と同じ失敗と一括せず、照明の未完を完成物の意味比較やbase品質一般の優劣へ拡張しない。120uだけが原因、教師の欠落が原因、baseなら解決する、といういずれの因果も確定していない。

driver321.985431秒、停止・元argv／env／cwdへの復元込み374.449394秒で、承認上限540秒以内に元提供PID131491へ戻した。health200、candidate PID131010不存在、B4root不存在を復元後に照合。B4用fileも送付済みだが、独立意味・完結条件不成立のため起動0、新12LEAF／MERGE0。A4の一回は消費済み、未使用B4を別試行へ振り替えない。

原actual116563byte／SHA256 15deb23615d562e0c49a05167bb9bbad2c345bedaa2a21779e88499d134b7c2a、execution2029byte／SHA256 1649489bad16f75b7ca290844020589d8ffc6851ab059d892119ef0d9a2c2e3e。元13fileのZIP78799byte／SHA256 a57be7031e08fc11956bd47b2437b61ac42bb67a0f4e5429a1761d6a412f4763をCRC確認し、actual／executionの遠隔元byte一致も確認した。原文・raw・preflight・driver・native・logは既存private引継ぎCocolon_CMEE_ConcreteReading_20261115.zipのverification/base_control_actual_20261116へ無修補で保持。公開trialの同名folderにはexecutionとbody-free独立reviewを記録する。execution内api_commit=dca20231は既存診断来歴のlabelであり、今回のAPI source5108a10fや通常配備24bc228dとは別に保持する。

SQL保存・同raw実再読・native通常採用・Render設定変更／配備0。今回開始時のfresh照会では通常API／worker双方24bc228d・Live、Supabase最新migration20261115011424（38件）。worker900・selector／重みと配布保留を維持する。将来のbase通常採用ではmodel identityとmap専用選択の整合が別に必要で、共有COCOLON_ANALYSIS_MODELを変えるだけではIFまで切り替わるため、今回のmap比較をIFの品質確認へ換算しない。自然／Pieceの既存profileも継承が必要で、今回そこを変更しない。

primary outcomeはBLOCKER_NARROWED。追加学習を外しただけの解決は成立せず、既存作者による後続確定事実・未開催・未知の統合と、反復せず完結する生成が未完である。同じ注意文や新controllerを足して改善扱いせず、新しい学習・GPU試行の具体scopeは未準備／未実施。長履歴の実意味改善・全12・同raw実保存再読・通常反映が未成立のため、本単位も補助全体も閉じていない。STRUCTURE_MAP_DELTA_NONE：隔離実行の結果のみで、新owner／公開型／API／DB型の追加なし。



## 9.129 学習と本番decoderの整合修復（2026-11-18 JST・新GPU未実行）

### 採らない形式と、既存作者内の修復

§9.128の複合claim／直前全文echo案を実装済みとしない。独立確認で、現unit.factでも他者の発言・本人の非行動・当時の不明を同じ自然文へ区別して表せ、A26は型の絶対的な表現不能を示していないと判断した。照明の根拠未選定、修理の旧未確認の現在化、正しいNODESから誤ったREL見出しを作る失敗は、引き続き作者の責務である。

| 試作 | 現枠での結果と判断 |
|---|---|
| 全原文span索引を重ねる | 全12親PLANは18564→57926 prompt token、4096予約込み62022。32768超過のため不採用。原文・候補を削って合わせない |
| mandatory複合claims＋全文echo | 独立小例2件は3088／3648だが、旧22群の楽観的な一旧unit一shadowclaimでも5〜7群が共有4096超過。小例fitを十分性へ一般化しない |
| 現PLAN/NODES保持、RELだけ原quote全文再掲 | 最小配列でもL01=4380／L02=4433／A26照明=4115。元4096へ収まらず不採用 |

同call const束縛等の隔離CPU試作は保持するが、製品への採用・意味合格には転用しない。初期試作に使ったローカルLMFE0.11.3は、実Podのpinned sourceと4file異なっていたため、その結果を本番一致の証明としない。

### 教材の意味を変えず、実際に出せるtoken列へ合わせる

private FIT26のfull-vocabulary CEは、nativeが強制するschema/hash/根拠の再掲や、本番で除外するtokenにも損失を掛ける。新候補は、各教師prefixで実nativeが許可する集合内のconditional CEを、複数選択肢のある位置で平均する。一意の位置は損失0、EOS後のchat-template newlineも対象外。固定表層にも代替BPE選択は残るため、「固定コピーを全て学習しない」「意味だけを学ぶ」とはしない。旧CEがA26の意味失敗の原因だったという証明でもない。

元66（1634183byte／25c438ae…）は不変。別revision（1634231byte／51736766…）はL02 PLAN4箇所・NODES8箇所のU+9784「鞄」を既存nativeのJSON Unicode escapeへ表記しただけで、全本人source・messages・parsed target全値・行順・残り64target bytesを保持する。新しい意味教師や評価5／12の教師化ではない。

canonical BPEには自由文の未完backslash＋uを一tokenへまとめ、本番freetext cacheが許可しない経路もあった。L02 NODESの元tail位置876／1195／1623だけを3642→[59,84]へ分ける固定manifest（fc6d85ee…）を作り、同じwire bytes・prompt IDs・意味を保つ。共有Piece encoderは変更しない。他65行のencoded値は完全同一で、この行のtailのみ2205→2208、EOSまでの出力2207となる。全22groupの共有runtime出力最大3393、最大sequence11476、最大prompt11199で元の4096／32768を維持する。旧rawへの事後修補ではない。

### 本番同一sourceとCPU確認

LMFE公式817f944fcc8851917c40300a47f62d1defc3ffc3の21 Python fileをローカルへ復元し、全Git blob SHAと実Pod側canonical SHA f8084eef865ba6a86367b95e9e84e8627382def82959dfb0f59395ca5c993004の一致を確認した。初回は先頭fを4と転記したが、Podで先頭文字コード102と全hash一致Trueを再表示して訂正し、旧記録も保持した。Podの依存やsourceを別版へ変更していない。transformers5.19.0／tokenizers0.23.3／pydantic2.13.5／pydantic-core2.46.5／interegular0.3.3も一致する。

修復後は66/66行・36182tokenと全EOSが実nativeで許可された（CPU346.67秒、model/Torch/GPU0）。non-singleton27754／singleton8428、EOS後newline66のみ目的関数外。非singleton数を意味理解の箇所数へ換算しない。1715許可集合の同値圧縮・全復元SHA・厳密loader正系を確認し、旧不適合row5条件とpool改変4条件の拒否も確認した。

凍結artifactはnative_allowed_training66.json.gz、340135byte、SHA60ff07b1174b984ca29840f12f11449f662c45d76f7481d27664a821a28fa430。helper5582a26e…／固定token manifestfc6d85ee…／新教材51736766…／本番21source・5依存・tokenizer・全row hashへ束縛する。新trainer4a66be53…の数式・causal shift・scope結合を独立全文レビューし、66更新・4measurement forward・112 F32保存fresh reloadの既存手順を保持した。実Torch小数値検査は次のfit内、GPUメモリ・900秒内完走・実意味改善は未検証。

### 復元、通常反映、完了境界

Podの読取では旧復元PID43656が不在、8000/healthzはConnectionRefusedError errno111だった。A26終了時の正常復元観測と、その後の停止を区別し、停止時刻・原因は未特定。本回の再起動・model load・学習・生成は0である。

新候補は既存120u仕様・既存同Pod private鍵・同kernelを一回復元し、新PID/startを派生scopeへ束縛する。失われた旧processの全環境一致は主張せず、FIT／評価後は新baselineのargv/env/cwdへexact復元する。新鍵・再インストール・新kernel warm・自動FIT・再試行は増やさない。RESTORE27は180秒0生成、FIT27は66更新／4損失計測・復元込み20分、A27は同5入力の最大19応答・復元込み30分、全5独立全文適合時だけB27は同12記録最大43応答・復元込み17分の準備である。旧FIT26/A26の承認や未成立B26条件を新scopeへ流用しない。新準備は送付16file・2265457byte＋同Pod内copy9file・3286728byteの全25fileをbyte/hash固定した。training scope templateはfb83f0f58a1172cd89bfb77322c01b688fa95494673b84f3bbb1ee60e8dd077f、upload ZIPは573573byte。新baseline後のtraining scope/receiptと、完成fit後のevaluation scope/receiptは各131072byte以内の限定派生、B前の独立review記録は4096byte以内。新候補は未承認・未送付・未実行。

保存再読の既存依存PGlite0.5.8は、通常配布のSHA512/SHA1を一致確認してローカル復元した。require/export確認のみで、DB constructor・SQL・稼働DB操作は0。既存7helper／元checkpoint／公開v3／DTO／RN／唯一realizer・保存owner・IF120u分離を保持する。API製品sourceはe58c1e4のまま、STRUCTURE_MAP_DELTA_NONE。通常API／worker／DBの以前のlive metadataを今回のfresh確認へ換算しない。

CPU整合修復・実行準備の成立を、補助経路全体や通常反映の完了にはしない。全5の実原文／三phase raw／図／全文の独立意味照合、条件成立時だけの全12、同raw実保存・非生成再読・同版本文、通常DB/API反映と公開後確認が残る。build／TestFlight／本人実機の保留を他作業の開始条件へ戻さない。

## 9.130 承認済みRESTORE27の復元と、FIT27の学習前停止（2026-11-18 JST）

### 承認範囲と実際に行ったこと

Mashの「承認するから進めて。」を、新16file・2,265,457byte、同Pod内copy9file・3,286,728byte、template `fb83f0f58a1172cd89bfb77322c01b688fa95494673b84f3bbb1ee60e8dd077f` のRESTORE27／FIT27／A27／条件付きB27へ結び付けた。各一回・再試行なし、B27は全5件の実原文／raw／図／全文をrootと独立担当が適切と判断した場合だけという範囲を維持する。

RESTORE27は23.948631秒で完了した。既存の同Pod鍵・source・kernel・元120u重みを使い、新PID569／start1320991、8000の所有とhealth200を確認。新baselineのargv／env／cwdを検証し、training scope `ebdd19ea8b49ef2177fbba143aa1bf66499e1e671602654784d4b5233086398a` を派生した。失われた旧PID43656の全環境一致は主張しない。RESTOREは提供モデルを読み込んだが、学習・新応答生成・新しい鍵や依存の追加は0である。

### FIT27が停止した位置と直接原因

FIT27の一回は提供停止前のCPU preflightで停止した。既存client-runtime-depsがpydantic2.11.7／pydantic-core2.33.2を優先し、元提供側でclientを加えず作成したnative許可artifactの2.13.5／2.46.5とは異なっていた。`native_allowed_decoder_dependency_versions_changed` のguardがValueErrorで拒否した。

事後の同Pod読取で、CPU側のCLIENT→DEPSと、学習／試行提供側のDEPS→CLIENT→DEPSをそれぞれ確認した。両方とも全8依存版・9import元が一致し、pydantic2.11.7／core2.33.2だった。transformers5.19.0／tokenizers0.23.3／interegular0.3.3、annotated-types0.8.0／typing-extensions4.16.0／typing-inspection0.4.5も同じで、LMFEは既存venvから読み込まれた。DEPSを先頭へ置くだけではCLIENTの版が残り、この差を解消しない。記録は3,442byte、SHA256 `d6b2a3634ab24cc3e027769d1b184877eb313c056518a5a7a756c09e5bb36c0f`。metadata読取によるmodel load・生成・学習・再起動は0、PID569／start1320991とhealth200を維持した。

§9.129の「依存一致」は、元提供側と、clientを加える実際のCPU／学習／試行提供側を区別できていなかった。私の実行前の環境確認不足として訂正する。これはguardを弱める理由でも、モデル意味品質の失敗でもない。新trainerの学習・GPU上の損失計測・保存再読・意味改善の成立へ換算しない。

FITのexecution.json／fit report作成、元提供停止、学習開始の前であり、更新0・新生成0。事後読取で元120uはPID569／start1320991のまま、所有8000のhealth200を維持した。A27／B27は起動しておらず、新5件／全12の原応答・SQL保存・実非生成再読は0。RESTORE27／FIT27の一回は消費済みとし、未使用のA27／B27を別試行へ転用しない。

### 原本、実依存での再確認、次の一回分

原本10件はmember manifestと各byte／SHA、ZIP内の同一byteを照合した。archiveは25,769byte、SHA256 `5d218fed61e93c716866f04406f22d0e548cf79eee8c91ae4107bc97898b942e`、10原本＋member manifestの11entryでCRC正常。鍵値・全環境値は出力していない。

Pod側の既存依存・元提供プロセスを変えず、実際の8依存版を隔離ローカルへ再現し、全66行・36,182tokenと全EOSのnative許可を332.873544秒で再確認した。non-singleton27,754／singleton8,428、EOS後newline除外66を保持。独立比較で1,715許可集合の全uint32配列と全prefixの選択、gold tail全ID・損失位置が旧proofと完全一致した。旧promptは全配列を保存していないため、66件のprompt ID SHA一致という範囲で記録する。helper5582a26e…・教材51736766…・固定token manifestfc6d85ee…・本番LMFE全21sourceは不変で、新しい意味教師やraw修補は加えていない。

新artifactは340,748byte、SHA256 `146faf6616691ee29fe8134ddcc91c838a7198328787b840b59a21d03acfd3b6`。privatefit `65125760a5c11d3579f86026783747299f9e914808a5037912c2be2e93ed5013` はこのartifactと実8版へ束縛した。全private encodeと厳密objective loaderは5.636151秒で成功し、旧artifact60ff…は同guardで明示拒否した。依存guardを弱めず、実版へproofを作り直したCPU確認である。これはPod上の全scope preflight・学習・GPUメモリ／900秒内完走・保存reload・モデル意味品質の成功ではない。

新FIT28／A28／条件付きB28の凍結候補は、送付8file・530,712byte、既存同Pod内copy16file・5,013,117byte。全24fileのbyte/hashを固定し、copy不足時は追加送付fallbackせず停止する。training scopeは54,186byte、SHA256 `8319f9f3f78cb0cc74d758fb1f9f80de518e26efe1153a7ee0c46425a1b2ea75`。upload ZIPは388,411byte、SHA256 `5b7a678ce21b399ff54d37d2d0621124508cae724587b1b2604e93ea297a432e`。新しいRESTORE28は行わず、現在の元120u baselineを開始前に再照合し、FIT／評価後は同argv／env／cwdへ復元する。

FIT28は同66行を一巡66更新・4損失計測、GPU処理900秒・復元込み20分。保存fresh reloadの一致と元提供復元が成立した場合だけ、派生scope／receipt合計131,072byte以内で新重みhashと復元PID／startを束縛する。A28は同5入力・15phase＋前後4対照の最大19応答・復元込み30分。全5件をrootと独立担当が原文／三phase raw／図／全文まで適切と判断し、4,096byte以内の同原本hash記録が一致した場合だけ、B28は同12記録の12LEAF＋MERGE・39phase＋4対照の最大43応答・復元込み17分。共有4,096出力token・32,768context、既存全量source／訂正cohort・guard・840秒pipeline・最終一回保存の境界を維持する。各一回・再試行なしで、旧27や未使用枠を流用しない。

新28の独立最終確認は阻害事項0で完了。未承認・未送付・未実行。新しいPod依存install・鍵・kernel warm・提供再起動・新GPU学習／生成・SQL実行は0。適切な実4Bの全5意味照合→条件成立時だけ全12→同raw保存・非生成再読→通常反映の元単位を継続する。

primaryはBLOCKER_NARROWED。元120uローカル受口の復元は成立したが、学習方式の実成功・作者品質の修復・通常採用は0。API製品sourceはe58c1e4のままで、公開v3・唯一realizer・保存／月次・本人source／権利・IF120u分離・対応RNを変更していない。SQL・通常API／worker反映0。今回のread-only再照会ではAPI／workerの配置metadataが双方24bc228dでLive、DB履歴38件・最新20261115011424、project status ACTIVE_HEALTHYを確認した。これは配置metadata・migration履歴の確認であり、API一巡・適用済みSQL本文・モデル品質の確認ではない。鍵値読取・SQL query・DB書込・配置・env変更はいずれも0。元単位／補助活用全体は未完、build／TestFlight／本人実機保留。STRUCTURE_MAP_DELTA_NONE（実行事実と未完状態の更新のみ）。

## 9.131 FIT28の保存再読と、A28の拒否・復元（2026-11-18 JST）

### 学習と元提供の復元

Mashの承認対象は、同Podの送付8ファイル・530,712 byte、Pod内コピー16ファイル・5,013,117 byte、FIT28／A28各1回と、全5件の独立全文適合を条件とするB28の1回である。§9.130で確認した実依存版と許可集合を使い、66行で66更新を完了した。前後各2件の条件付き損失は、料理のPLANで0.199365→0.109836、現在状態のNODESで0.519369→0.415866。保存した112個のF32テンソル・3,833,856パラメータは新規ロード後も一致した。

重みSHA256は `9487ac83b67297eb6948ed31ae1096e17ae9c2666905709ef1311afd4aae9284`、configは `f3bd94394c5521b38d4f1acb839844d20c4d70466c75c39e2cb6bdd763bba431`。FITは元120u提供への復元込み317.535459秒、復元PID2297／start1809493。これらを束縛した評価scopeは `8193aa03a854b307c17e529389ace80c6c3c79706064d6d0d2db5f45045ac243`。

### 実応答・適合と次の対象

A28は前対照2応答、読書会・照明・修理の各3段階9応答、取消のPLANとNODESの2応答、計13応答。先頭3件で図と全文を取得した。取消のNODESはHTTP 200／stopで応答を返したが、続く検査で停止した。取消のRELATIONS、5件目のT01、後対照2応答は未実行。元120u提供へ538.221794秒で復元し、PID3278／start1865732による8000番所有とhealth 200、候補18008番の閉鎖、B28作業先が作られていないことを確認した。

最終評価原本のSHA256は `8f9106759e6c518c450a3f83889c3b9898195b5030282ecdcf32410cea4cc41f`。主担当と独立担当は原入力、取得済み各段階のraw、完成3件の図データと全文を確認し、それぞれ3件すべてを不適合と判定した。

| 入力 | 保持できた事実 | 原文との不一致 |
|---|---|---|
| 読書会 | 初日の下書きと翌日の送信はPLANで区別できた | 図と本文に出た関係線は「参加者への送信から、下書き保存の段階へ」と順が逆。翌日の送信を裏付けない項目見出しにも送信が入った |
| 照明 | 購入の見送りと後日の購入を区別できた | 確認したいという本人の希望を確認済みに変えた。関係線の到着点にない購入後の配線調整を書き、一晩だけの使用感・長期評価と異なる条件の留保を落とした |
| 修理 | 店からの完了連絡、未受取・未検査、翌日の受取予定を区別できた | 本人は弟の端末修理を依頼していない。未確認なのは弟が自分で店に電池の相談をしたかである。出力は二つを「本人は弟の電話まで同じ修理を頼んだかどうかは聞いていません」と合成した |

取消の取得済みPLANは凍結版CPUで受理された。NODESの `n5/u1` は、5番目の欄にある「友人にはまだ取り下げの話をしていない。」を同じ「不明」の根拠リストに2回挙げた。凍結版で同じ `analysis_semantic_node_local_unknown_unbound` の拒否を再現した。本人が友人へ知らせていないこと自体は原文に明記されている。5件目の意味は未評価。

### 生成と受領が食い違った箇所のCPU検証

凍結したLMFEの全21ソースと同じtokenizerの文字集合で、旧nativeは取消のNODES実原本2,329文字を最後まで許した。生成側の候補文法は、同じunitの同じ欄・同じ引用が2回目に始まる文字位置2,191で拒否した。不明の根拠が0件、1件、異なる2件の両順（同じ欄の別引用・異なる欄）は許可し、重複・3件・unit外は拒否した。正負10対照の結果は既存の受領判定と一致した。先頭3件の実NODES原本も候補文法では末尾まで到達。実原本の書換え、拒否検査の緩和、GPUでの再生成は行っていない。

評価5入力に含まれない架空4入力でも、凍結APIの既存構造検査へ正例4件と誤文8件を通した。測定希望／測定済み、鍵の引渡し／第三者の行動が不明という独立の条件で、同じ根拠を使いながら主体または希望・完了を反転した8誤文も通過した。根拠の結合検査だけでは派生文の意味不一致を識別できず、採用には原入力と図・本文の全文照合を要する。

関係線と概要の対象を固定したCPU対照も行った。読書会の逆方向の線、照明の線の両端、照明の概要と参照先の不一致は実原本に束縛し、評価用のまま分けた。評価外のパン・机の教材を使い、正例8件と、向き・参照先など1箇所だけを変えた誤例16件はすべて既存RELATIONS構造検査を通過した。存在しない端点への参照は8件すべてで拒否された。旧教材の22群中19群では概要が全項目を参照していた。実際に書く事実に必要な端点・項目を選び、その根拠が記述を支えるかどうかが、残る作者側の課題である。

### 次の開発候補の経路と容量

開発正本mashos-api `13e35eff3708c56b8629d1e690e82170ae919177`（親e58c1e4）に、既存製品5ファイルと既存pytestの差分を反映した。関連6試験ファイルで162件成功・skip 0。同commitのAnalysis CI（44197372267）は08:30:26 JST、Pieceの隔離PostgreSQL CI（44197372080）は08:33:06 JSTに初回成功した。開発用 `semantic_map.node_local.v4.occurrence.v1` は本人の原入力欄に元の記録日時を添える。異なる日付の記録が同じ出来事を述べるときと、同じ対象で別の行動をしたときを区別する材料を用意し、本人訂正の日時・対象と原記録の日時を分けた。関係線には選んだ両端を、概要には実際に参照した項目を根拠として書く作例と指示を加えた。NODESでは同一unit・同一欄の同じ引用の重複を生成時に防ぐ。既存公開図・保存契約、IF用120uの選択は従来の経路を使う。

通常の作者選択を使い、応答を模擬したCPU検査はMAP5件×3段階、LEAF12件×3段階、MERGE1件×3段階の計54リクエストで成功した。最大の合成MERGEでは、PLANの入力25,298と予約4,096が計29,394、NODESの入力27,555と残り3,607が31,162、RELATIONSの入力28,682と残り2,203が30,885で、各段階とも32,768以内だった。共有4,096出力tokenの実使用分を次段で差し引く方式であり、新規の実生成長や840秒以内のB完走を証明する試験ではない。

候補commit後に、Renderで通常APIとworkerの配備が双方 `24bc228dbf54abc983906323c0ae7d937fae1fd6` でLive、Supabaseで `cocolon-project` がACTIVE_HEALTHYであることを再照会した。これは稼働メタデータの確認で、候補を使う本人入力の一巡・行の読取り・書込みは行っていない。

全5件の独立全文適合条件は不成立。B28・全12記録の同raw保存・非生成再読・候補の通常反映は実施していない。FIT28／A28の一回分は消費済み。元の作業単位は未完で、build／TestFlight／本人実機は引き続き保留する。

### 同じ重みでの次回比較を凍結

同PodのFIT28保存重み9487ac83を使い、新しい追加学習は行わない。送付対象は6ファイル・3,092,979 byte、同Pod内コピーは3ファイル・99,755 byte。送付用ZIPは2,701,756 byte・SHA256 `b3533f68334763d977fa55ab3b9cd018874a72e9deb92e8eb8e4bdb0ea5f8145`、実行scopeのSHA256は `72110b204fc077beec791f42eb5034da456a5c7d8c8a287fca835ea59c012c41`。準備時の送付・起動・学習・新生成は0。

A29は同じ5入力で最大19応答、元提供の復元込み30分、1回。全5件の実原入力・raw・図・全文が主担当と独立担当の双方で適切と確認され、同原本hashに結び付けた判定記録が4,096 byte以内の場合のみ、B29は同じ12記録を最大43応答、復元込み17分、1回で評価する。A28で消費した枠とは別の次回比較で、未実行である。

## 9.132 A29の実行、公開図の重複拒否と原文照合（2026-11-18 JST）

### 生成・元提供の復元

§9.131で凍結した6ファイル3,092,979 byteを同Podへ送付し、既存3ファイル99,755 byteをPod内でコピーした。scopeは `72110b204fc077beec791f42eb5034da456a5c7d8c8a287fca835ea59c012c41`。開発版 `13e35eff` の `occurrence.v1` とFIT28保存重み `9487ac83` で、A29を追加学習なし・1回実行した。

前対照2件は元の応答と一致した。1件目の読書会でPLAN、NODES、RELATIONSの3応答を取得した後、公開図の構成時に `analysis_semantic_map_invalid` で停止した。実応答は合計5、公開図・利用者向け全文は0件。残り4入力と後対照は未実行で、B29の全5件適合条件は不成立。元120uを復元するまで260.390791秒。PID4392／start2299551、8000番の所有とhealth 200、候補18008番の閉鎖、B29作業先が存在しないことを再確認した。

### 取得した原本の照合

最終原本SHA256は `c258387da980b4da5bdf788c8376da09744d445e909f1a95eafc80374cf6801c`。三段階の原応答に同じ公開図構成処理をCPUで適用し、重複項目の既存検査で実行時と同じ拒否を再現した。主担当と独立担当は、原入力2日分の4欄と3応答を照合した。

- n3とn6はPLANの2単位への引用割当が同一で、NODESの分類だけが異なった。見出し、意味、視点、各単位の事実・引用・不明は同一で、概要は両方を選んだ。既存の公開図コンパイラが、この重複を拒否した。
- 原文で二階は本人が写真から使えそうだと推測し、書きかけて消した場所。翌日、一階を予約できたと確認した。n3／n6と概要は、予約済み会場自体が二階から一階へ変更されたように書いた。n4→n3の関係線もn4の見出しを繰り返した。
- 本人と共同担当者の役割、椅子の照会が送られたかは不明であること、初日の案内未送信→翌日の修正送信→一人が返信し、全員が読んだかは不明という区別はrawで保持した。

公開図・全文がないため、1件目の完成品についての適合判定はできない。残る4件は未評価。A29の一回分は終了し、B29は起動していない。全12記録の実raw保存・非生成再読、通常DB/APIへの採用、元の作業単位は未完。build／TestFlight／本人実機の保留を維持する。

復元後に通常環境を再照会した。RenderではAPI・workerとも `24bc228d` がLive、SupabaseはACTIVE_HEALTHY。migration履歴は38件、最新は `20261115011424`。本人データの行読取り・書込み、新配備は0。

### 開発版の作者と生成側を修復

同じ入力を別の分類で二度書いたA29の実原本を使い、既存作者と生成経路に開発候補 `semantic_map.node_local.v4.occurrence.v2` を追加した。mashos-api開発正本は `b02ae51e05dec77091cfa969480282910cf91fbb`、tree `1e8b5e460ada8029cafe355f1d32d57ecc4add0f`。5つの既存製品ファイルと既存の試験ファイルを更新した。

作者には、本人の予想と確認した事実、状態そのものが変化した場合を区別する材料・作例を追加した。生成側ではNODESの公開時の見出し・要約・説明が既出の項目と同じになる場合、生成途中でその重複を拒否する。分類や根拠を変えても表示内容が完全に同じ場合、末尾の重ね句点・横空白だけを変えた場合を含む。同じ出典を使う別の主張、疑問と断定、引用中の句読点は区別して扱う。公開側の重複検査を維持し、受信済みA29のrawに修補・代表項目への間引きは加えていない。

関連pytestは369件成功。同じcommitのAnalysis CIは初回run 44205509341が09:27:28 JST、Piece隔離PostgreSQL CIは初回run 44205509235が09:36:53 JSTにsuccessで完了した。生成側のCPU検証52件と、通常の作者選択経由で応答を模擬した54段階（5 MAP×3、12 LEAF×3、1 MERGE×3）を確認した。元のv1では5 MAP・親入力1・12 LEAFおよびA29で取得した3要求のmessagesが一致した。v2で最大の合成MERGEは、PLAN 25,361＋予約4,096、NODES 27,615＋残り3,607、RELATIONS 28,715＋残り2,203。実際の残量込みの最大31,222はcontext上限32,768以内だった。新しい実生成での意味品質、全12記録の処理時間・実保存は未検証。

### 凍結した次の比較

開発正本のソース、上記両CIの成功、ローカルの実行ファイルと凍結値を照合した。同Podへ送る対象は6ファイル・3,102,987 byte、同Pod内コピーは3ファイル・99,755 byte。送付用ZIPは2,705,060 byte、SHA256 `dc68a097b5083f036faed17a88f5e57e613436b33739a6fa88c871ed67e541db`、scopeは `fb6194a2436407c88b87b7b025c32abd74917f474b0ee24bc3f0550d0ceee0d2`。

A30は同じFIT28保存重みと5入力で最大19応答・復元込み30分・1回。全5件の原入力・三段階raw・図・全文を主担当と独立担当が適切と判定し、同一原本hashに結び付けた4,096 byte以内の判定記録が一致する場合だけ、B30は同じ12記録で最大43応答・復元込み17分・1回。準備では送付・Pod内コピー・起動・追加学習・新生成を行っていない。A29の承認・実行結果はこの比較には転用していない。

## 9.133 A30の実行、読書会の意味照合、照明の途中停止（2026-11-18 JST）

### 実行と復元

§9.132の6ファイル・3,102,987 byteを承認済みの同Podへ送付し、既存3ファイル・99,755 byteをPod内でコピーした。凍結scopeは `fb6194a2436407c88b87b7b025c32abd74917f474b0ee24bc3f0550d0ceee0d2`。FIT28の保存重み `9487ac83` と開発正本 `b02ae51e` の `occurrence.v2` でA30を1回実行した。

前対照2件は元の応答と一致。読書会のPLAN・NODES・RELATIONSの3応答から、図データ1件と表示用全文1件を取得した。照明はPLANの後、NODESの応答がHTTP 200／lengthで終わり、RELATIONSに到達しなかった。実送信は合計7。修理・取消・T01の3入力と後対照は未実行。A30の一回分は消費済み、追加学習・再試行は0。

最終原本のSHA256は `bab55f02a300922e837f2a7e431328f7b3c97faac9c7b39857532bafeaea7f75`、回収ZIPは83,972 byte・SHA256 `f3a429a5f56d2e45cd34a0f16571e4919a5dc2a3bcb4926c5790aac1859f8057`。元120uへの復元込み515.266256秒。復元PID6018／start3020583による8000番の所有とhealth 200、候補18008番の閉鎖、B30作業先・判定ファイルの不在を再確認した。通常Render APIとworkerはともに `24bc228d` がLive、SupabaseはACTIVE_HEALTHYだった。

### 原文・図・全文の照合

唯一の完成品である読書会の図は8項目・関係線1本。三段階の合成rawのSHA256は `6bb66b08d13138b748ea203040d7c57bd946783af14b82bb3b718b25e427e6fe`、表示全文は `db07edb110b3d7e7a5d4eb4a4adfe8b4b81506430f15e9336f780affead13b77`。読書会は、主担当と独立担当の双方が原入力・各段階raw・図・全文を照合して不適合と判定した。前回A29のような公開図での完全重複拒否は起きなかったが、異なる項目が同じ根拠・同じ出来事を繰り返した。元の記録では、二階の部屋を使えそうだと写真から推測して下書きの部屋名を消した。出力は消した対象を部屋自体・案内自体のように表した。項目n7では構造文字列が意味の文末に残り、図と本文にも露出した。初日の未送信、翌日の修正送信、一人の返信、全員の既読は不明という経過は保持した。

照明では、PLANに1,078 tokenを使った後、NODESは残り3,018 tokenのうち2,490を返した。12番目の項目の根拠欄 `source_field` の途中で切れたため、完全な項目集合を確定できなかった。段階開始時の残り時間は164.399秒、通信は165.851秒。原本の終了理由は `length` であり、内部でどの停止条件が先に働いたかは特定できない。RELATIONS、公開図・全文がなく、照明を完成品として判定しない。

全5件の適合条件は不成立。B30は起動せず、全12件の取得・SQL保存・非生成再読・通常DB/API/worker反映は0。元単位・補助全体は未完である。

### A30の実結果を受けたA31の開発・実行準備

開発コミット `6b5d05378271b40f0fe76aa97fcb927c173ff69e` に、分析MAP専用の `semantic_map.node_local.v4.occurrence.v3` を追加した。PLANで各項目が初めて伝える内容を選び、同じ判断の裏付けと別の判断を分ける。NODESとRELATIONSでは、原文の動詞、行為者、対象、肯定・否定を見出し・意味文・関係・概要にも保つ。たとえば「帳面の曜日欄を訂正した」と「予定を変更した」の違いは架空教材で扱い、個別の入力に対する指示は記録の表記と対象を区別する一般則とした。

読書会の原本では、n3とn5は、種類・視点・見出し・明示した読みが同じで、一方の根拠が他方にすべて含まれる。新候補の公開前検査はこの組を拒否した。n7の文末 `。},` も、その項目に割り当てた原文引用にはなく、単独で拒否した。同じ引用から異なる内容を読み取る正例と、根拠の中に実在する記号を含む正例は通過。n4とn6で留保を言い換えて重ねた問題は、引き続き原文・図・全文に対する二者の意味照合で判定する。

旧5プロファイルの5入力・全12記録の親と個別入力・作例を照合し、過去の実19段階のメッセージが一致した。旧v2で読書会の実3応答を再読すると、合成raw、図、全文、網羅情報と非公開根拠が元の結果に一致した。照明でA30の計画と既定の根拠をそのまま使うと、新候補のNODES入力は8,564トークンで295増える。実4Bが同じ時間枠で照明を完走するか、対象・否定の取り違えが解消するかは未確認である。

CPUの回帰384件が合格。模擬応答による54段階（5入力の15段階、12記録の個別処理36段階、統合3段階）で最大入力28,933トークン、実際の出力予約を含めて31,495／32,768トークンだった。同コミットを対象とするAnalysis・Piece両CIは成功した。 [開発コミット](https://github.com/MassyuRed/mashos-api/commit/6b5d05378271b40f0fe76aa97fcb927c173ff69e)、[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44220803903)、[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44220807206)。

A31／条件付きB31には元の5入力・12記録とFIT28の重みを使う。確定した送付分は6ファイル・3,114,301バイト、同じPod `xrplcoeb5ec77f` 内のコピーは3ファイル・99,755バイト。scopeのSHA-256は `1cab4ded2c76b69d864b4521ab194cab0b07c0b5e944cd7e3396bfaae78ac316`。追加学習と再試行は0。A31は同じ5入力、最大19応答、復元込み30分。5件すべての原文・図・全文が主担当と独立担当の照合で適切な場合に限り、4,096バイト以内の判定記録を送り、B31は同じ12記録、最大43応答、復元込み17分。それぞれ新しい一回分として承認待ちで、今回の送付・Pod内コピー・実行は0。

## 9.134 A31の実行と二者照合、照明の途中停止（2026-11-18 JST）

### 実行・復元

承認を受け、同Pod `xrplcoeb5ec77f` へ6ファイル・3,114,301バイトを送り、既存3ファイル・99,755バイトをPod内でコピーした。scopeは `1cab4ded2c76b69d864b4521ab194cab0b07c0b5e944cd7e3396bfaae78ac316`。開発正本 `6b5d0537` の `occurrence.v3` と、FIT28で保存・再読した重み `9487ac83` を用いてA31を1回実行した。追加学習・再試行は0。

実際の応答は7件。Emlisの明示的な訂正とAnalysis IFの前対照2件は基準の応答にバイト単位で一致。読書会はPLAN・NODES・RELATIONSが完了し、公開用の図データと全文を1件取得した。照明はPLAN完了、NODESの途中まで。修理・取消・T01の3入力と後対照に到達しなかった。回収ZIPは79,846バイト、SHA-256 `bc3debc45f0b4827ca78ef3386d97ce7e1310824c354ea8673c84a53e9155e19`、最終結果のSHA-256は `864650e131334885c0a02554a256e77d631bd877372ce78af035950b2a769afc`。ZIP内の11ファイルを照合した。元120uへの復元込み442.818234秒。復元PID7550／start3385418が8000番を所有しhealth 200、候補18008番の閉鎖、B31作業先と判定ファイルの不在を再確認した。

### 完成した読書会の図と全文

読書会の図は6項目・関係線1本。原文、3段階の応答、公開図と全文を主担当と独立担当が照合し、いずれも不適合と判定した。3段階を束ねたrawのSHA-256は `e34c84ad1833326e0ecf83db3c1b5ea6dc95d1ec058adc792f28383ef3381ae7`、表示全文は `ee19066d324b8352b76e33208a29d10c231cb6363359fd996bc9a9dc02aabe70`。この実rawを凍結ソースで再処理すると、図・全文・網羅情報・非公開根拠は元の結果と一致した。

今回は、初日に消した対象を案内に書きかけた二階の部屋名として保持した。初日は参加者に案内を送らず、翌日に修正して送ったこと、一人のみ返信し全員の既読は不明であることも保持。前回の文末に出た構造文字と同題の項目の反復は今回の完成品には見られなかった。

翌日に共同担当者から届いたのは、一階を予約できたという連絡だった。本人が会場の返信の写しで確認したのは部屋と開始時刻。出力の事実文は区別したものの、項目4の題、概要の題、関係線の文では「一階の部屋を予約できると確認」と表現し、予約の成立を可能性に変え、確認の対象もずれた。また、共同担当者が椅子の数を確認したいという希望は既知で、本人が知らないのは問い合わせを実際に送ったかどうかである。画面用の未確認欄は、希望を含めた複文全体を掲出した。

### 照明の応答と通常反映の条件

照明のPLANは975トークン・HTTP 200／stop。NODESは入力8,469トークン、共有出力枠の残り3,121に対して2,633トークン・6,364文字を受信し、HTTP 200／lengthで終了した。第10項目の意味文の途中で切れており、項目集合は未完成。要求上の生成時間は171.374秒、計測した通信時間は173.235秒だった。保存された応答から内部で先に働いた停止条件までは特定できない。凍結経路で同じ応答を再生すると `phase_not_complete` となり、RELATIONS・図・全文は生成されなかった。

照明は、完成したPLANと途中まで受信したNODESをそれぞれ原文と照合した。別の日に異なる2種類を試した場面を一つにまとめ、「机に付けてもらった」試用品を本人が付けたように読める。別の店まで回りたいとは思わなかったという否定は残った。PLANが選んだ12項目・22単位のうち、最後の2項目の4単位はいずれも保証書の場所を記録し、消灯して机から離れた同じ1文を引用。一方、試した型を実際に購入した行為を根拠として選んでいなかった。これらは原文と計画・受信部分で確認した内容である。

5入力すべての原文・図・全文を二者が適切とする条件は不成立。B31は起動せず、12記録の実生成、同rawのSQL保存・別プロセスでの非生成再読、通常DB／API／worker反映はいずれも0。A31の一回分は消費済み。元の作業単位と補助経路全体の通常採用は未完。

### A31の実結果を受けたA32の開発と実行準備

開発正本 `b37fa479002a3b1990d51f43786d6b78d8c31149` に、明示的に選ぶ分析MAP専用の `semantic_map.node_local.v4.occurrence.v4` を追加した。既存のモデル選択、Analysis IF、CMEEの分析受付と応答組み立て、モデル提供の5ファイルと既存試験1ファイルを更新した。ソース束は247ファイル。Emlis・Pieceおよび通常のAnalysisの提供設定は変更していない。

**既知の希望と不明な行為を分ける。** A31の読書会を調べると、元の公開処理は「その問い合わせを送ったかは聞いていない。」を受け付けていたが、生成時にモデルが選べる候補は二つの原文全体に限られていた。v4は、当該項目に割り当てた引用に含まれ、同じ原文欄で一度だけ出る節を追加で選べる。引用符や括弧の内側にある区切りを誤用するケース、別の欄・別の項目・原文外の文などを含む55件の形式検査を実施した。A31の保存済み応答は書き換えず、新しいモデルが短い適切な節を選ぶかは実評価に残した。

**見出しと関係の文に、成立の有無と照合対象を残す。** A31の読書会では誤りがNODESの題に初めて現れ、正しい事実文と原引用も届くRELATIONSで関係線と概要の題に再び現れた。同じ形式検査は誤った題と、原文どおりに書いた比較用の題の双方を受理した。v4では架空の染色と伝票を用い、染色を終えたという報告と、染色が可能だという返事を対照させ、いずれも本人が確認した対象は伝票の枚数だと示した。

**照明のような長い記録で、異なる行為を選ぶ。** A31で重複した末尾の4単位は、実際に切れた第10項目より後ろにある。同じ原文でも「保証書の所在の記録」と「消灯して席を離れたこと」をそれぞれ表示できる正例があるため、PLANで同一引用を一律拒否する規則は設けなかった。通常MAPのPLAN用に、粘土の状態・日時・印の異なる二つの試行と、その後の押印・台帳への登録を区別する架空例を追加した。照明の実行時間や根拠選択が改善したかは未確認。

旧6方式で5入力・12記録と親入力、過去A28〜A31の実24段階の要求を照合し、従来と一致した。CPU回帰400件が合格。通常の生成経路を模擬応答で54段階（5入力の15段階、12記録の個別36段階、統合3段階）通した。最大入力29,121トークン、当該段階に残る出力予約を含めた最大は31,639／32,768トークン。開発正本の両CIは成功した。[開発コミット](https://github.com/MassyuRed/mashos-api/commit/b37fa479002a3b1990d51f43786d6b78d8c31149)・[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44228736857)・[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44228736919)

**隔離したSQLでの保存と再読。** 凍結版のコードと同じ架空12記録を使い、明示的な合成応答39件（個別12件と統合1件の各3段階）と前後の対照4件を処理した。隔離したPostgreSQL互換環境に分析結果1件を保存し、別プロセスでSQL書込みもモデル呼出しもせずに読み戻した。現在の分析、詳細、月次から同じID・本文・図・網羅情報を参照でき、保存した非公開根拠も一致し、HTTPの読取も200で同じ結果を返した。実モデル呼出しと通常DBへの接続は0。12記録について実モデルが作った原本の保存再読・意味の受入れは未検証である。

A32には同じFIT28の保存重みと5入力、条件付きB32には同じ12記録を用いる。同Pod `xrplcoeb5ec77f` への送付予定は6ファイル・3,124,974バイト、同Pod内コピーは3ファイル・99,755バイト。ZIP 2,709,681バイト、SHA-256 `72770f0b479c6854b60193810ffe613017f6eee195d5009c42fec4128d11dbbd`、scope `fa16f2a9b877463bd858adcc3cfa2077f4e0b0e03f69aa5c7c288c2d65615281`。A32は最大19応答・復元込み30分・1回。5入力の原文・3段階のraw・図と全文について主担当と独立担当が全件適切と判定し、同じ原本に対応する判定記録（4,096バイト以内）がある場合だけ、B32は最大43応答・復元込み17分・1回。ここまでの準備でPodへの送付・コピー・起動、追加学習、実モデルの全12記録を使ったSQL保存・通常反映は0。

<a id="analysis-a32-20261118"></a>
## 9.135 A32の実行結果と通常採用の判定（2026-11-18 JST）

開発版 `b37fa479`（分析MAP `semantic_map.node_local.v4.occurrence.v4`）と保存済みのFIT28重み `9487ac83` で、承認されたA32を1回実行した。送付は6ファイル・3,124,974バイト、同Pod内のコピーは3ファイル・99,755バイト。追加学習・再試行はともに0。7応答の内訳は前対照2件、読書会のPLAN・NODES・RELATIONS、照明のPLAN・NODES。元120uへの復元まで420.843901秒。元提供の復元後のPIDは9171、開始tickは3859845で、候補用ポートは閉鎖した。

| 入力 | 実際に取得したもの | 原文と完成物の照合 |
|---|---|---|
| 読書会 | 3段階の生応答、公開用の図と説明全文 | 椅子の数を確認したいという希望と、問い合わせを送ったかは不明という部分を分けられた。一方、初日に案内から消したのは書きかけの部屋名だが、図の項目・概要・関係線では二階の部屋を消したと表現した。翌日の連絡で一階の予約が成立したことは事実文に残った一方、見出しと関係線では予約できるという可能性に変わった。主担当と独立担当ともに不適合。 |
| 照明 | PLAN完了。NODESは12項目のうち10項目を最後まで受信、第11項目の事実文の途中で終了 | 後日に別の型を机の端に付けてもらった試行と、初日に持参した薄いノートを開いた試行を同じ項目で説明した。別の店を回る時間までは使いたくなかったという否定は保てた。終了理由は `length`。RELATIONS・公開図・説明全文は未取得。 |
| 修理・応募取消・10記録の入力 | 未到達 | 評価未実施。後対照も未実施。 |

5入力のうち図と全文が完成したのは1件、二者とも適切とした完成品は0件。条件付きB32は起動していない。全12記録の実生成、その同じ原本のSQL保存・別プロセスでモデルを呼ばない再読、通常DB・API・workerへの反映はいずれも未実施。作業単位と補助経路全体の通常採用は未完。実行原本 `after.result.json` のSHA-256は `b2fdd0ce498ffbce7544f2a1813d1faeacf13157a8b978b2f8a248c17bc66fdb`、回収ZIP（80,920バイト）は `9c10b058041a33389074c3b14b74c25da1ad2ad67a8e32aaebd649db20cf3cd9`。実行前の凍結条件と隔離SQLでの合成応答を用いた検証は§9.134。

<a id="analysis-a33-prepared-20261118"></a>
### A33の開発候補、送付内容、隔離SQLでの検証

開発版 [7405e4de](https://github.com/MassyuRed/mashos-api/commit/7405e4deb98ce7c64a8f4db9af8f3f7c6165bad7) は、分析MAPの項目を生成するとき、最初の段階（PLAN）が割り当てた原文の引用全文を繰り返す処理を、同じPLAN・項目・単位への参照に変えた。原文と計画は4Bの入力に残る。関係線の生成、図・全文の作成、保存に使う根拠は、その計画から原文の引用と欄を復元する。参照の取り違え、別の計画、旧形式の混在を拒否する。新方式は開発版で明示した分析MAPだけに使い、IFは元120uを選ぶ。

A32の照明NODESの受信済み部分を同じトークナイザーで再計算すると、原文を繰り返す旧出力は2,457トークンで、確定済みの引用を新参照に置き換えた同範囲は1,497トークンだった。読書会の完成済みNODESは919から641トークンになった。いずれも出力形式の比較で、照明の全項目が実時間内に完成するかは未確認。読書会の予約成立を可能性に変えた4箇所は原文と照合し、開発用の比較試作を28対照で検査した。これは通常の生成や採否に組み込んでおらず、新候補の意味品質は実モデルでの評価に残る。

既存400試験と新規7試験が合格。架空5入力・12記録の合成応答で計54段階を通し、入力トークンとその段階の出力予約の合計は最大31,613／32,768。開発コミットの[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44236439686)・[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44236439730)はともに初回成功。送付対象の製品ソース247ファイルは同じコミットのGit blobと照合した。

**保存と非生成再読。** 同じ凍結版と架空12記録から、合成応答39件（12件の個別処理と統合1件の各3段階）、前後対照4件を用いた。隔離SQLに同じ生応答から作った分析を1件保存し、別プロセスでモデル呼出し0・SQL書込み0の再読を実施。現在・詳細・月次の参照で同じID・図・全文・網羅情報となり、非公開の根拠も一致した。HTTPの読取は200。本番DB接続と実モデル生成は0。回収処理では、A32の実原本で、凍結時の実行条件ファイルとPodが保存した同じJSONの表現が異なることを確認した。凍結ファイルのハッシュを保ち、Podで保存される正規化表現とも照合する。実原本は受理し、内容や対応先を変更した4対照はすべて拒否した。

**実モデルで未実行の一回分。** A33と条件付きB33には同じPod `xrplcoeb5ec77f` のFIT28重みを使う。送付6ファイル・3,124,470バイト、同PodのA32用ディレクトリからコピー3ファイル・99,755バイト。ZIPは2,709,947バイト、SHA-256 `fb6065f5c92f34f2ca54b708e3899586d7575e3d4121df5b8f07b8e125c6ad7f`。実行条件ファイルのSHA-256は `65b6d10d725b0bf6de2618f5d88356f47dcd885a9fd53e2ad3001ecac459c227`。A33は同じ5入力・最大19応答・復元込み30分で1回。5件すべての原文・3段階の生応答・図と全文を主担当と独立担当がともに適切と判定した場合に限り、同じ原本に対応する判定記録（4,096バイト以内）を送り、B33は同じ12記録・最大43応答・復元込み17分で1回。追加学習・再試行は0。A33・B33の送付、Pod内コピー、実行、実モデルの12記録保存再読、通常反映は未実施。

<a id="analysis-a33-actual-20261118"></a>
## 9.136 A33の5入力の実生成、二者の意味照合と通常採否（2026-11-18 JST）

開発版 `7405e4de` の分析MAP（occurrence.v5）を同じPodで1回実行した。FIT28の保存済み重み `9487ac83` を使用し、送付は6ファイル・3,124,470バイト、Pod内コピーは3ファイル・99,755バイト。追加学習・再試行は0。各入力で計画・項目・関係の3段階を最後まで受信し、5つの図（計35項目・13本の関係線）と説明全文を取得した。実応答は15段階と前後4対照の計19件。Emlisの訂正と分析IFの前後対照は、凍結した基準の応答にバイト単位で一致した。元120uへの復元まで645.733004秒。復元PIDは11212、開始tickは4218451。候補用ポートは閉鎖した。

主担当と独立担当が各入力の原文、3段階の生応答、公開用の図、説明全文をそれぞれ確認した。全5件で両者とも不適合。各行の「項目・線」は完成した公開図の数。

| 入力 | 項目・線 | 原文と一致した点 | 不適合の具体例 |
|---|---:|---|---|
| 読書会 | 5・1 | 案内から消したのは部屋名。初日は下書き、翌日は参加者へ送り一人から返信を受けた。 | 修正して送った案内に一階の部屋名を書いたとは原文にないが、見出しと線で断定した。椅子の問い合わせを実際に送ったかは不明という情報も落ちた。一部の事実文は、同じ単位に割り当てた原文とは別の日の内容だった。 |
| 照明 | 12・2 | A32では途中で切れた項目生成が完了し、後日、試した型を条件と値段を確認して購入したことまで表した。 | 初日に使用を止めたのはちらつく旧照明、後日点けて絵を描いたのは新しく買った照明。概要は、使用を止めた照明を点けたと同一視した。別日に異なる店で受けた説明も、一つの単位にまとめた。 |
| 修理 | 5・1 | 店から画面修理の完了を知らされ、本人が連絡を読んだこと、弟が電池の相談を送ったかは不明なことを保った。 | 現在は携帯電話が店にあるという事実を、見出し・線では「店への電話」と書き換えた。本人は画面の作動をまだ確認していない点も欠落した。 |
| 応募取消 | 3・1 | 写真の提出から受付メールの受領、取消完了画面を保存するまでの順序を保った。 | 取り消した後で今回は再応募するつもりがないこと、友人にはまだ伝えていないことを根拠として受け取っても、図・全文に反映しなかった。残っている受付メールと現在の応募状態の違いも明示されなかった。 |
| 同時刻の独立10記録 | 10・8 | 元記録ごとに項目を分け、会議の担当や本人の選び方の希望を個別に残した。 | 8本の線はすべて「意味を共有」と分類し、線の文言には出発項目の題だけを使った。会議の資料調べと片付けなど、両端の記録が何を共有するかを原文から示せなかった。 |

全件を完走できたことで、途中停止と意味品質を分けて評価できた。B33は二者の全5件適合という条件を満たさず起動していない。全12記録の実生成、その同じ原本のSQL保存・別プロセスでの非生成再読、通常DB／API／workerへの反映は未実施。合成応答を使った前節の隔離SQL検証は準備時の記録として保持する。

A33の実行条件SHA-256は `65b6d10d725b0bf6de2618f5d88356f47dcd885a9fd53e2ad3001ecac459c227`、最終結果 `after.result.json` は `3a00a9980313a426b1ea634ff6dfd828078188dc972cf91d2f4693ba1896826f`。回収ZIPは209,909バイト、SHA-256 `3db67e0341d1cfccfb8d8dffd17807429de89738339b268864cab4d889d46674`。

**実応答の再生と照明の対照例。** 凍結版のコードに同じ15段階の実応答をCPUで再生すると、全5件で公開図・説明全文・網羅情報・非公開根拠が元の結果と一致した。Emlisの訂正と分析IFの前後4対照はすべてHTTP 200で、応答も基準と一致した。照明の原文では、使用を止めたのは古い照明で、購入したのは新しい照明である。研究用の正負例で「古い照明」「新しい照明」の両方を対応する原文に固定しても、「古い照明を購入した」「新しい照明の使用をやめた」と動詞を入れ替えた文は通った。根拠のIDと対象名の一致だけで適合とせず、それぞれの対象にどの動作を結び付けたかを原文と照合する必要がある。この確認で追加生成・学習・通常反映は0。

**通常環境の照合。** A33実行中の13:59と復元後の14:10（ともに11/18 JST）に確認した。通常APIとworkerはいずれも同じ稼働コミット `24bc228dbf54abc983906323c0ae7d937fae1fd6`。Supabaseのマイグレーション履歴は両時点とも38件で、最新は `20261115011424`（`piece_answer_and_interpretation_corrections`）だった。

<a id="analysis-a34-prepared-20261118"></a>
## 9.137 A33の意味照合を受けた項目・関係線の改修とA34の準備（2026-11-18 JST）

A33では5件すべての図と全文が完成したが、原文との照合は二者とも適合0件だった（§9.136）。取消後に再応募する意向がないことは計画の根拠に含まれても本文から抜けた。照明では使用を中止した旧照明と、後日に購入した新照明が概要で同一視された。独立10記録の8本の線は、片側の項目の題を繰り返し、もう一方との関係を説明しなかった。開発候補 occurrence.v6 では、この情報が本文や線になる段階に手を入れた。

**項目の事実文。** NODESは、PLANで各単位に割り当てた原文の引用ごとに、一つずつ対応する文の一部を書く。その順序で連結したものを表示用の事実文とするため、一部の引用を無記入のまま項目を完成させることはできない。各単位の合計上限は160字で、元の引用の長さに応じて各片の枠を配分する。文中では行為者・動作・対象の対応と、意向・実行・未確認の違いを保つよう作者に指示する。本人が述べた内容を正しく書けたかは、各片が存在することだけでは決定できない。

**関係線。** RELATIONSは左右の項目それぞれから、線の説明に使う事実の単位を一つ選ぶ。既存の図と詳細の生成には選んだ両端の根拠を渡し、内部参照IDは公開図へ持ち出さない。ラベルがどちらか片側の題と完全一致する線は受理しない。関係を根拠から説明できない場合は、線を張らず項目を独立して表示できる。

**正しい例と誤った例を同じ条件で検査。** A33の独立10記録から取得した8本の線について、片側の題をそのまま使うラベルは新形式の検査ですべて拒否され、線なしは受理された。一方、架空の「陶器の見本は買わなかった」「後日、別の鉢を注文した」「追加注文の意向はない」を使うと、対象に付く動詞を入れ替えた文や、意向を完了に変えた文は、形式を満たして通った。旧8本の文面への効果と、別の言い回しで起こる読み違いは区別する。項目・線・概要の意味と自然さは、新候補の実生成物を原文と照合するまで未判定。

**互換性と容量。** 開発版でA33の保存済み15段階を再生し、5件の公開図・全文・網羅情報・非公開根拠が元の出力と一致した。隔離DBに保存済みの旧v5の合成結果も、開発版の読取APIで同じID・図・本文・根拠を返した（HTTP 200、モデル呼出し・SQL書込み0）。架空5入力・12記録の個別処理と統合に合成応答を用い、全54段階を通した。計測した入力トークンとその段階の出力予約の合計は最大28,912／32,768。この標準対照の3段階共有出力は最大1,798／4,096トークン。別に、同じ12記録を統合するすべての項目で思考欄と行動欄の両方を引用する合成対照も54段階を通し、入力とその時点の出力予約の合計が最大29,354／32,768、3段階共有出力が最大2,345／4,096であった。A33の実PLANを固定し後段の応答を合成した比較では、3段階合計の最大出力は2,687／4,096トークンだった。実4Bの新生成は0。実時間内の完走と実12記録の保存再読は引き続き未確認。

開発コミット [8f7659c8](https://github.com/MassyuRed/mashos-api/commit/8f7659c8b3419f2ea12a7f6ba24530257754b833) では既存製品5ファイルを更新し、回帰試験 `ai/tests/test_analysis_occurrence_fact_endpoints.py` を追加。422試験が合格し、同じコミットの[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44249031476)・[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44249031491)の成功を確認した。転送対象の製品ソース247ファイルは同じGitツリーの各blobと一致した。

**凍結した候補の保存と再読。** 架空12記録について、個別12件と統合1件の各3段階の合成応答39件および前後4対照を使った。外部認証と通知送信をテスト用に置き換え、通常の生成APIから候補設定を読み、同じ生応答で分析を1件だけ隔離SQLに保存した。合成した関係線では、選択した両端の事実単位が説明に使われた。別プロセスで現在版・詳細・月次を再読すると、同じID、図、全文、網羅情報、非公開根拠が返った。認証済みの読取はHTTP 200、未認証は401。同じIDを別所有者として指定した読取はSQLSTATE 42501で拒否された。再読時のSQL書込み・モデル呼出しはいずれも0。本番DBへの接続は0。14:58 JSTの読取照会で、通常APIとworkerの稼働版はともに `24bc228d`、Supabaseのマイグレーション履歴は38件（最新 `20261115011424`）だった。

**既存版の保存後に更新した対照。** 同じ架空12記録を候補で強制更新した。最後の統合段階で応答が長さの上限に達した対照では、HTTP 503で保存用RPCは0回。既存のID・図・全文・非公開根拠・月次はすべて保持された。別の対照では、原文で「次の提案書には着手していない」とあるのに、合成した概要は「本人は帰宅後に次の提案書を完成させた」とした。新しい取得時刻で通常のAPIを通すとHTTP 200で1回保存され、現在版の新しいIDに誤った概要が表示された。月次と旧IDは元の内容を保持した。形式検査とSQL保存の成功だけでは、原文との意味の一致を判定できない。

**実モデルで未実行の一回分。** 同じPod `xrplcoeb5ec77f` のFIT28保存重みを使う。送付は6ファイル・3,053,005バイト、PodのA33用ディレクトリからのコピーは3ファイル・99,755バイト。ZIPは2,711,529バイト、SHA-256 `2c962aafcbd42eb015ce5714284db3ee71ddfe3727843b07d0fc26f3b22e4d9a`。凍結した実行条件のSHA-256は `1d79ea0738d39b36c17f309b099dae427c545252f568eb19e9b041bb3b524657`。A34は同じ5入力・最大19応答・復元込み30分で1回。全5件の原文・3段階の生応答・図・全文を主担当と独立担当がともに適切と判定した場合だけ、同じ原本に対応する4,096バイト以内の判定記録を送り、B34は同じ12記録・最大43応答・復元込み17分で1回。追加学習・再試行は0。準備段階でPodへの送付・コピー・実行は行っていない。実生成物の意味照合、実12記録の保存再読、通常反映と元の作業単位は未完。

<a id="analysis-a34-actual-20261118"></a>
## 9.138 A34の実生成、二者の原文照合と通常採用の判断（2026-11-18 JST）

**通常採用の判断。** 開発版 `8f7659c8` とFIT28で5入力の図・全文を取得した。主担当と独立担当が、それぞれ元の思考欄・行動欄、PLAN・NODES・RELATIONSの生応答、公開図、全文を照合した。両者とも適合は0/5。引用ごとの本文片と関係線の両端がそろっても、本文では予定が既成事実に変わり、概要や線には記録にない場所・関係が加わった。B34の判定記録の送付・実行は0。全12記録からの実生成・同じ原本の保存再読・通常反映は未完である。

| 入力 | 原文との照合で見つかった差 |
|---|---|
| 読書会 | 一階は予約できた会場。公開項目・線・概要は「一階の部屋で」案内を修正したと書いた。本人が作業した場所は記録されていない。 |
| 照明 | 初回は購入せず帰ったと書かれている。同じ行動を図では「まだ記録にないこと」に分類した。 |
| 修理 | 受付から聞いた「部品を取り寄せる」という予定を、部品を取り寄せたと完了形に変えた。 |
| 応募取下げ | 実際には写真を応募し、受領を確認してから取り下げた。概要・線では応募をせず取り下げたという経過になった。 |
| 独立した10記録 | 明記された「今日は会わなかった」を未記録とした。会議と別の集まりの間に、原文に根拠のない対比線を引いた。 |

**実行と復元。** 16:21 JSTに確認。承認された同Podで、追加学習・再試行なしにA34を1回実行した。5入力×3段階と前後のEmlisAI・分析IFの4対照で計19応答。4対照はすべて基準出力と一致した。元の120u提供への復元まで567.771秒、復元後のhealthはHTTP 200、候補の試験ポートは閉じた。実結果SHA-256は `13ff60f7d39046185e741167827329f8dcca813c2f2d6c18efbe907e6dfb06bf`。

**隔離SQLでの保存・再読。** A34の取得時と隔離SQLで取得し直した時では、元記録の状態を識別する値が異なった。元の値を付けたコミット確認は5件すべて `40001 / analysis_source_changed` で拒否され、保存は0件。隔離SQL自身が返した値を使い、取得時刻を固定して通常の生成APIを通すと、全15段階のリクエストがA34で送ったバイト列と一致した。実際に受領した15応答をそのまま戻して各1件を保存。新しいレポート参照を除いて、図・全文・網羅情報が元の結果と一致した。別プロセスで5件とも同じ保存IDと非公開根拠を再読し、モデル呼出し・再読時SQL書込みは0。認証済みHTTP 200、未認証401、別所有者の読取はSQLSTATE 42501。本番DB接続は0件。これらは5入力について誤りを含む結果も保存できることを示す。

**A34後の開発修正。** 概要の意味検査へ選択外の項目の根拠まで入るため、反対の内容を持つ別記録があると判定が保留される事例を確認した。開発版では選んだ項目の引用に照合範囲を限定した。架空2記録の通常APIと隔離SQLによる対照で、正しい概要は200で保存、選択した根拠と逆の概要は422。誤った更新で保存RPC・通知は0回、元のID・本文・非公開根拠を再読できた。別にA34実応答を再生したところ、5件とも元と同じ図・全文・網羅情報・非公開根拠が生成され、概要の見出し判定は5件とも `UNASSESSED` だった。回帰試験786件が合格した。この修正の効果は、選択した根拠に照らして確認できる誤りに限られる。A34が示した実4Bの読み違いは残る。 [開発コミット d7759d07](https://github.com/MassyuRed/mashos-api/commit/d7759d0786aaf1b20218e46e0dc83a92e3eb53a4)

**次に確かめる箇所。** A34の「未確認」欄18箇所を追跡した。すべてNODESで選ばれた引用がRELATIONSに渡り、公開時にもそのまま表示された。原文から引用できることと、その文が未確認の事柄を述べていることは別の判断である。項目生成時の分類と、その分類を原文の意味で確かめる箇所が次の修正対象になる。

<a id="analysis-a35-prepared-20261118"></a>
## 9.139 わたしマップの未確認欄を、公開前に原文と照合する開発候補（2026-11-18 JST）

**A34から変更した箇所。** A34の5入力では、初日に購入せず帰ったという事実や、後日には解決した返信待ちまで、今も分からない事柄として表示された。§9.138の実応答を追うと、NODESで拾った候補18箇所はRELATIONSへそのまま渡り、原文と一致する引用なら、その内容が現在も未確認かを確かめずに公開できた。

開発候補 occurrence.v7 は、NODESで候補を拾った後、既存の最終段階RELATIONSで全候補を再分類する。元になった欄と引用、各本文片に対応する根拠、元記録の時刻を参照できる。候補ごとに、今も未確認（OPEN）、原文に記載済み（STATED）、以前の時点の話（EARLIER）、重複（DUPLICATE）のいずれか一つを返す。公開するOPENでは、候補と元の欄の両方で一意に見つかる原文の一部分を指定する。ほかの三分類は未確認欄に出さない。公開図・全文に内部の判定キーは出さない。モデル呼出しは従来の3段階のまま。

**A34の原本を用いた二つの対照。** A34の項目と引用を固定し、最終段階の判断を主担当が手で指定すると、未確認欄は次のように変わった。

| 入力 | A34の実表示 | v7の手指定対照 |
|---|---:|---:|
| 読書会 | 3 | 1 |
| 照明 | 2 | 1 |
| 修理 | 5 | 2 |
| 応募取下げ | 0 | 0 |
| 独立した10記録 | 8 | 4 |
| 合計 | 18 | 8 |

5件とも項目の事実文・関係線・概要はA34のままで、予約した場所を編集場所にする等の既知の誤りも残った。この5入力の実PLAN・NODESと手指定の最終応答による比較では、各段階の入力と確保した出力の合計は最大10,671トークン。新しいモデル呼出しは0。

独立担当が同じ原文を読み、別に判断を指定すると、未確認欄に残ったのは7箇所だった。差は修理の「自分の手で画面をつけて確かめたわけではない。」の1箇所。原文は、まだ受け取りに行かず、本人による動作確認もしていないと明記している。この文は「まだ記録にないこと」に出さず、店から届いた修理完了の連絡と、本人が自分で動作を確かめていないことを本文で分ける読みを採る。例えば読書会では「全員が読んだかは分からない」、照明では「比較した時間が全部必要だったかは、今でもはっきり分からない」という本人の文を残せた。反対に、記録済みの「今日は会わなかった」をOPENにしても表示され、本当に分からない「明日の調子はまだわかりません」を閉じても図が完成した。二つの数字は、人が入力した判断に応じて表示が変わることを示す。実4Bの判断精度は未判定である。

**開発版と通常環境。** 開発コミットは [25bfec6c](https://github.com/MassyuRed/mashos-api/commit/25bfec6c393a00a87707965ae134765e794a2fb3)。MAPで明示的にv7を選ぶ仕組み、IFの従来120uへの振り分け、モデルの出力形式、CMEEでの検査と表示組立てに既存の5ファイルを用いた。回帰試験 `ai/tests/test_analysis_occurrence_v7_qualifications.py` を追加し、Analysis CIの試験対象に含めた。ローカルの分析回帰71モジュールは2,734件成功・64件スキップ、サブテスト798件成功。Tornado依存のAnalysis bridgeモジュールはこの件数に含めていない。同じコミットの[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44264777191)と[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44264777761)はいずれも成功。通常環境の読取照会ではRenderのAPIとworkerがともに `24bc228d` で稼働、Supabaseの適用履歴は38件、最新は `20261115011424`。v7の通常反映は未実施。

**12記録の合成応答による保存試験。** 隔離SQLの架空12記録について、通常の生成APIに個別36段階と統合3段階の合成応答を返した。正しい形でそろった場合はHTTP 200で1件保存。最後の統合で必須の判定1個を欠かすとHTTP 503で、誤った更新のSQL書込み・通知予約はいずれも0。元の保存IDと図・全文・網羅情報・非公開根拠を維持した。別プロセスで保存済みのv5・v6・v7をそれぞれ再読でき、再読時のモデル呼出し・SQL書込みは0。実4B呼出し・本番DB接続は0件。

**処理可能な長さ。** 思考欄と行動欄の両方を使い、12記録に計24個の未確認候補を置いた別の合成対照では、統合入力と確保した出力が最大32,408／32,768トークン、統合3段階の合計出力が3,394／4,096トークンだった。この対照の残りはそれぞれ360、702トークン。実モデルの出力量と時間内完走は未確認。

**未実行のA35・条件付きB35。** 同Pod `xrplcoeb5ec77f` に送るファイルを6件・3,060,892バイト、同PodのA34からコピーする既存ファイルを3件・99,755バイトで確定した。ZIPは2,716,009バイト、SHA-256は `356ad5c677d314c7430df4ee1c8ea1e0e04f9f0f16c12f0736c24c9d0f34b93d`。実行条件のSHA-256は `c7d940eaed9bc7af5ebdfc57ae77aa24c2cfe40c60976fb1e37f553d16fb4635`。FIT28の重みでA35は同じ5入力を1回、最大19応答・元提供の復元込み30分。原文・全3段階の生応答・公開図・全文を主担当と独立担当が5件すべて適切と判定した場合だけ、判定記録を4,096バイト以内で送り、従来と同じ12記録でB35を1回、最大43応答・復元込み17分で評価する。追加学習・再試行は0。今回は準備までで、Podへの送付・コピー・実行は0回。

<a id="analysis-a35-actual-20261118"></a>
## 9.140 A35の実4Bによる未確認欄・図・全文の評価（2026-11-18 JST）

**通常採用の判断。** §9.139の開発版 `25bfec6c` とFIT28でA35を1回実行した。主担当と独立担当はそれぞれ、5入力の思考・行動欄、PLAN・NODES・RELATIONSの生応答、図、全文を通して照合し、適合は双方0/5だった。図・全文はすべて完成した。原文の引用がある場合でも、誰が何をしたか、何のための行動か、以前の未確認が今も続くかという区別が表示まで保たれなかった。B35の二者判定条件は不成立。実際の両判定を判定記録の作成処理へ渡すと拒否され、許可記録は作成されなかった。判定記録の送付・B35の起動はいずれも0件。A35の実行枠は終了、通常反映は未実施。

| 入力 | 未確認候補 → 表示 | 原文との照合 |
|---|---:|---|
| 読書会 | 6 → 3 | 本人が消したのは案内の部屋名。概要では部屋を消したように書き、共同担当者による予約と本人による案内の送信が一続きに見える。椅子に関する同じ未確認も2行に分かれた。 |
| 照明 | 5 → 1 | 初回の購入見送りと後日の購入を区別した。一方、配線を留めたのは足で踏まないためなのに、見出しと関係線は紙の端まで光を届けるためとした。 |
| 修理 | 6 → 2 | 店が部品を取り寄せるという発言、店からの修理完了連絡、本人がまだ受け取り・動作確認をしていないことは区別した。弟が店へ相談したかという同じ未確認を二つの欄から重複して表示した。 |
| 応募取下げ | 6 → 0 | 概要では応募・受領の後に取り下げた経過を保った。受領メールを確認した引用には別の写真を送らなかったという文を割り当て、関係線では二つの見出しを継ぎ目なく連結した。 |
| 独立した10記録 | 19 → 5 | 自分で納得して選びたいという引用に別の記録の予定変更への怒りを結び付けた。原文に書かれている友人からの連絡と本人の寂しさも未確認欄に出た。 |

**実際の分類。** 全42箇所でSTATED（記載済み）が31、OPEN（今も未確認）が11、EARLIER（以前の時点）とDUPLICATE（重複）はともに0。公開された11箇所は、最終段階が指定した引用と一致した。A34の原本に人が判定を指定した§9.139の18箇所とは、項目生成から得た候補そのものが異なる。A35で分類の欄を埋められたことと、同じ意味の留保・別の日の事実を正しく見分けられたことは区別する。

**実行と復元。** 実4Bは5件×3段階の15応答、前後のEmlisAIと分析IFの基準対照4応答、合計19応答。4対照はすべて一致した。追加学習・再試行なしで、元の120u提供へ戻るまで688.739秒（11分28.739秒）。復元先PID 16207、開始tick 5632775、候補の試験ポートは閉鎖された。Podから回収したZIPは164,846バイト、SHA-256 `ea9274be4c89e28acdc5f3115ee296d3e7b372f788d02683f9d7e94f4e9be18d`。実結果のSHA-256は `ccaf1db86aa87cef9039b08964c5ab3c5de7dba10b9fa02e999532a3ce91ddf4`。

**実応答の保存・再読。** 5入力を隔離SQL上でそれぞれ取得し直し、通常の生成APIにA35で受領した15応答をそのまま戻した。全5件を1件ずつ新しいIDで保存。公開図は保存先参照を除いて元の図と一致し、全文・網羅情報も一致した。元のGPU結果と保存時の非公開情報を突き合わせると、グラフ・根拠の照合値・記録索引は一致した。保存側では新しいID、元記録の状態を識別する値、網羅情報などが加わった。別プロセスで5件とも保存時の同じIDを再読し、保存した非公開情報も全体が一致した。認証済みの読取はHTTP 200、未認証401、別所有者はSQLSTATE 42501。再読時のモデル呼出し・SQL書込みは0。本番DB接続は0件。個別5件の保存・再読は今回の実績で、全12記録を分割・統合するB35は実行していない。

**生成側に残る課題と教材の確認。** FIT28の既存教材66例（PLAN・NODES・RELATIONS各22例）には、NODESの178単位すべてに根拠と事実文がある。今回のv7で求めるように、引用ごとの番号に対応する本文片を書き分ける例は0で、RELATIONSで未確認候補すべてを見直す例も0だった。A35では本文片に別の引用・記録の行動が入った。この教材の差は確認できたが、原因が教材だけだとは実証していない。新しい架空2例で、後日に同じ対象を確認して不明が解ける場合と、後日確認したのが別の対象で元の不明が残る場合を対にした。各3段階・合計6段階の手書き例をCPUで確認し、出力のトークン列は終端まで許容された。評価5入力の転用、追加学習、新しい実4B応答は0。この対照を使った際の実モデル品質と全12記録の適切な原本・保存再読・通常反映は未完。

<a id="analysis-fit36-prepared-20261118"></a>
## 9.141 引用ごとの本文と未確認の分類を学ぶFIT36の準備（2026-11-18 JST）

**A35の実結果から教材へ。** A35では項目の原文引用に別の記録の本文片が結び付き、同じ未確認が重複したまま公開された（§9.140）。FIT28の旧教材には、178単位に事実文と根拠があったが、今のv7が返す引用ごとの本文片、関係線が参照する両端の単位、未確認候補の再分類を含む実例は0件だった。今回の教材はv7の既存の生成・検査経路で、この三つを原文から書き分けるためのもの。

| 教材の処理 | 例の組数 | 3段階の内訳 |
|---|---:|---|
| 通常の入力を読む | 8 | 計画・項目・関係を各8行 |
| 一つの記録を個別に読む | 5 | 各5行 |
| 個別読取りから複数の記録を統合する | 2 | 各2行 |
| 合計 | 15 | 各15行、計45行 |

事例には、前日に蒸したか分からなかった藍のかせについて、翌日、同じ木札の付いたかせの映像を見た場合と、翌日に確かめたのが別の竹笛だった場合を含めた。同じ対象なら前日の未確認が解消する一方、別の対象を確認しても最初の不明は残る。本人が結んだ木札、織り手の予定、映像で確認した動作について、それぞれどの原文が裏付けるかを教材に含めた。

**教材と評価入力の区別。** 主担当と独立担当が、実際に学習に渡す45行と元の架空記録を照合した。計測用の別事例からは正答・取り違えを対にした4行を用意し、更新対象から外した。本人が誰に何を尋ね、誰が計ったかを取り違えた場合と、後日の確認で当初の予定通りではなかったと分かる場合を含む。教材・独立評価・A/B評価の各原文間で、同一の欄と共通する連続12文字を照合したところ、該当は0。これは確認した原文間の結果で、実4Bが未知の入力を正しく読めるかは未判定。

**原文から図・全文に至る経路での確認。** 主担当・独立担当ともに、各引用と対応する本文片76組、未確認候補の判定21箇所、関係線11本を読んだ。21箇所の内訳はOPEN（今も未確認）9、STATED（記載済み）6、EARLIER（以前の状態）4、DUPLICATE（重複）2。教材の出力を既存の実装で再生すると、通常8組と統合2組で公開図・全文10件、個別5組で内部の図5件が完成した。教材45行は、生成を制約する611通りの許容トークン集合を照合し、正解の出力列は終端を含む計11,432トークンで検証した。CPU上で既知の教材を再生した結果であり、新しい重みでの実生成は0件。製品コードの開発版は `25bfec6c` のまま。

**元の提供状態への復元。** 最初の準備版では、復元した提供プロセスが評価を起動した側のシグナル設定を引き継ぎ、停止操作に対する挙動が変わる場合があった。FIT36とA36・B36の起動処理を修正し、元の提供プロセスでSIGTERMとSIGINTがそれぞれ無視・ブロックされるかを保存し、停止直前と復元後に照合するようにした。LinuxのCPU子プロセスで両シグナルの状態16通りを学習用・評価用の各起動処理に通し、計32通りが元の状態と一致した。この試験でのPod接続・モデル呼出しは0回。

**次の実行条件。** 同Pod `xrplcoeb5ec77f` への新規送付は11ファイル・960,570バイト、同Pod内のA35からのコピーは7ファイル・3,106,459バイト。送付用ZIPは234,490バイト、SHA-256は `c4c9046cd7dd7cd4a69ce6db9c1ff031626e026c96765f068cebcdaf13feacd7`。凍結時点のPodへの送付、学習更新、新規モデル応答はいずれも0。

| 実行 | 成立条件と範囲 |
|---|---|
| FIT36 | 検証済みのFIT28のLoRAから継続し、45行を1周・45更新する。学習前後に学習行2件と独立した正答・誤答2対を計測し、勾配を計算しない評価は前後合計12回。生成0、元の120u提供への復元込み最大20分で1回。候補は別に保存し、学習せず読み直した重みの一致を確認する。 |
| A36 | FIT36の45更新、保存した候補の再読一致、元の提供状態への復元を確認した後、同じ5入力を最大19応答、復元込み30分で1回。 |
| 条件付きB36 | 全5件の原文・3段階の生応答・図・全文を主担当と独立担当がともに適切と判定した場合だけ、同じ原本に対応する4,096バイト以内の判定記録を送る。同じ12記録を最大43応答、復元込み17分で1回。 |

A35の5件は二者とも不適合だった。FIT36の損失や教材再生だけでは、実際の入力で読み違いを直せたことは分からない。A36の実照合、条件が成立した際の12記録の実生成、同じ原本の保存・非生成再読、通常反映までが残る。

<a id="analysis-fit36-actual-20261118"></a>
## 9.142 FIT36の継続学習・保存再読と、評価の起動前に停止した理由（2026-11-18 JST）

**今回成立したこと。** §9.141の最終版を用い、FIT28からv7用の架空教材45行を1周して45回更新した。モデルに新しい文を生成させた回数は0。学習対象のLoRAテンソル112個（3,833,856パラメータ）がすべて親から更新され、保存後、学習せず新たに読み込んだ112個は保存時の値と一致した。候補重みのSHA-256は `37661bc72c42ae4b2f69b76917e8c88e46e5c8963d9d8fcef60c34d6a8ab623e`、設定は `65e1fe7eb9792ea5a23e60cb19bc4e7aabf644572acaf98ee33f0753a3e3918c`。親のFIT28は保持した。元の120u提供に戻るまで444.301秒。復元したプロセスはPID 23735、開始tick 6080946で、SIGTERM・SIGINTの無視・ブロック状態も元と一致し、試験ポートは閉じた。

**学習に使わなかった2対の計測。** 学習行2件と、別に確保した2事例の正答・誤答4行について、更新前後で計12回、勾配を計算せず損失を測った。指定された正解文を順に与え、その位置で許される候補トークンの間で測った値である。各事例の「誤答の平均損失から正答の平均損失を引いた差」は、引用に異なる本文片を対応させる対で0.03520から0.03972、後日の記録と異なる予定を実行済みとする対で0.21362から0.22235となった。2対とも指定した正答のほうが低い損失になった。自由生成した図・全文は0件で、A35の誤読が改善したかは未判定である。

**評価を始められなかった理由。** A36・B36で使う候補を確定する処理は、保存済み設定の `target_modules`（学習対象の名前）を配列として比較した。FIT28・FIT36はいずれも重複のない28名で、集合は一致する一方、うち25名の位置が異なった。ほかの設定項目は一致した。実際のPEFT 0.21.2はこの項目を集合として扱う。CPUで照合すると両設定が選ぶ保存済み56モジュール・112テンソルは同じだった。元の厳密な照合は順序差を拒否して評価用の確定記録を書かず、A36・B36は起動していない。

**回収した原本。** 提供元で確定した全12ファイルのZIPは14,220,185バイト、SHA-256 `d4c281eb6310a23e0a689dc955582bf4affae23a14b247312e1931ad67767718`。候補の重み・設定、学習報告、実行記録はこの回収物から照合した。学習の1回枠は終了。通常環境へのモデル更新はなく、適切な全12記録の実生成・保存再読と通常反映は未完である。

**既存の重みで評価に進むための修正。** 比較時に `target_modules` の並びだけをそろえ、重複や対象名の相違、ほかの設定項目の相違は引き続き拒否する修正版を準備した。追加送付の対象は同Podに1ファイル・5,275バイト、SHA-256 `ff818ae50064598e2a8352d757fbda683f47cb39b04dba625e8529fc9f75730c`。Pod内の元16ファイル（合計4,042,654バイト）にはハードリンクを作り、元ファイルのコピーは0バイト。Pod内で修正後の候補照合処理14,175バイトと評価条件のひな型10,868バイトを作る。新しいひな型のSHA-256は `b17f59dbff73792d634a4ac63b84f6febba48d095cf1b48267277dbbc1f801b9`。回収したFIT36原本を使ってローカルで導いた、候補確定後の評価条件の期待SHA-256は `105339378191fa24da4e69600bccfe54896b67d6d1b1aaabb0b638062c1bf2db`。この値はPodでの候補確定や評価完了を示さない。

追加送付は承認待ちで、FIT36を再実行する必要はない。候補の照合が成立した後の範囲は従来どおりで、A36は同じ5入力を1回、最大19応答・復元込み30分。全5件について主担当と独立担当の双方が原文・3段階の生応答・図・全文を適切と判定した場合だけ、4,096バイト以内の判定記録を送り、B36は同じ12記録を1回、最大43応答・復元込み17分で実行できる。追加学習・再試行は0。

<a id="analysis-a36-actual-20261118"></a>
## 9.143 FIT36の重みを使ったA36の実評価（2026-11-18 JST）

**実行条件の確定。** §9.142の修正版1ファイル（5,275バイト）の追加送付承認を受け、FIT36の評価条件を確定した。以前回収した学習結果と今回の確定済み結果を照合し、保存済みの重み・設定・学習報告・実行記録を引き継いだ。評価条件のSHA-256はローカルで導いた期待値 `105339378191fa24da4e69600bccfe54896b67d6d1b1aaabb0b638062c1bf2db` と一致した。FIT36の再学習・更新は0。

**実モデルで取得した範囲。** 1回のA36で開始前対照2応答と分析MAPの5応答、合計7応答を取得した。開始前のEmlisAIと分析IFの出力はともに基準と一致した。読書会は計画・項目・関係の3段階を受領し、2項目と1本の線からなる図と全文が完成した。照明は計画・項目の2段階の生応答をいずれもHTTP 200・自然終端で受け取ったが、次のRELATIONSのメッセージを組み立てたところで送信前のサイズ検査に止まり、関係線・図・全文は生成されなかった。修理・応募取下げ・独立した10記録の3入力と、終了後の2対照は未実行。全5入力の二者適合というB36の条件は成立しなかった。

**提供の復元。** A36の開始から元120u提供への復元まで357.547秒（5分57.547秒）。復元プロセスはPID 24598、開始tick 6276234。SIGTERM・SIGINTの無視とブロックの状態が元の提供と一致し、試験ポートは閉鎖された。評価時の追加学習・再試行は0。実結果のZIPは63,232バイト、SHA-256 `a9abd2052e7f698204fc8d9c36ebf9cb54d3656c562967e57de9cdb8983ff341`。実応答原本のSHA-256は `633bd4506ec97fbaf48add2808c68bb900d6fc953cd83e6dccde1c64d5cf13bd`。

**原文と実出力の照合。** 完成した読書会1件は主担当・独立担当ともに不適合。原文は初日の下書きの後、翌日「案内を直して参加者へ送り、一人から『了解』と返信を受け取った」と続く。図・全文には初日の未送信が残ったが、翌日の送信と返信が落ちた。照明では公開図に至る前のNODESの項目n7で、初日に窓際で1時間描いたことと、後日に新しい照明の下で30分描いたことが混ざった。図が存在しない照明と、モデルを呼んでいない残り3入力に、完成物の意味判定は付けていない。

**照明で止まった直接原因。** NODESを受領した後、次のRELATIONSに使う通常メッセージはUTF-8で56,682バイトになり、上限49,152バイトを7,530バイト超えたため、モデルに送る前に拒否された。A35の同じ入力・段階は35,530バイトだった。A36は共有出力に766トークン分の余裕を残していた。出力の残りと、次のリクエストに含める材料のバイト上限は別々に効く。元の条件での再試行は0。

**同じ実応答の保存・別プロセスでの再読。** 読書会を隔離SQL上で新たに取得し、通常の生成APIに3段階の実応答を戻すと、新しいレポートIDで1件保存できた。保存先参照を除いて公開図・全文・網羅情報は元の図と一致し、別プロセスで保存時のID・非公開根拠をそのまま再読した。再読時のモデル呼出し・SQL書込みは0、照明と後ろ3入力の保存も0。本番DBへの書込み・通常反映は未実施で、A36の不適合を修正した結果の保存は成立していない。

**照明の入力サイズのCPU対照。** 関係線を作るための入力で、ほかの内訳と重複する計画・関係単位の表を省くと、メッセージは56,682バイトから46,714バイトに縮まった。9,968バイト減り、49,152バイトの上限に2,438バイトの余裕ができた。残した内訳から表を戻した結果は元の材料・生成制約スキーマと一致した。一方、短縮した表示だけを従来のモデル側処理に渡すと `semantic_v4_plan_invalid` で拒否された。製品実装・Pod送信・新規生成は0。この形式を実際に使う際の処理時間・出力トークン・図と本文の意味品質は未検証である。

<a id="analysis-a37-prepared-20261118"></a>
## 9.144 わたしマップの原文の読み取りと関係線の入力を直したA37候補（2026-11-18 JST）

**読書会と照明。** A36の読書会では、初日に下書きを保存し、翌日に送り一人から「了解」と返答があった経過のうち、初日の未送信だけが図と全文に残った。照明では、初日に窓際で描いた1時間と、後日、新しい照明で描いた30分を一つの見出しで混ぜた。v8では、計画を作る4Bへ各記録の思考欄・行動欄への参照をまとめて渡す。実行・見送り・予定は引用から読み取り、後日に同じ対象をどう扱ったか、他者から何が返ったかをたどる。項目を作るときは引用元の記録番号も渡し、同じ場面の道具・時間・行動が対応するよう指示する。別の日の事実は同じ記録に書かれることもあるため、記録番号を出来事の日付として扱わない。

**関係線。** A36の照明で送信前に停止した56,682バイトの入力に、項目一覧から取り出せる計画と関係単位の表が含まれていた。v8は項目一覧と計画の照合値を送り、提供側で計画を復元して照合し、生成制約を組み立てる。元の根拠を二重にモデルへ読ませず、関係線の両端を原文へ戻せる形を保つ。

**保存済みの実応答で確認した範囲。** A35の5件とA36の2件で、当時の計画・項目の実応答から関係線のメッセージを組み直した。7件とも原文の根拠と計画を復元でき、提供側の生成制約が一致した。A36の照明の入力は56,682バイトから46,799バイトへ縮み、上限49,152バイトまで2,353バイトの余裕ができた。§9.143の試算46,714バイトと異なるのは、今回の提供側が実際に用いるメッセージで計測したためである。この7件の照合は以前の実応答を使ったCPU再生で、新しい図・全文の意味品質は未判定。

**通常稼働。** Renderの通常APIとworkerはいずれも `24bc228d` でLive。通常APIの `GET /healthz` は最初の18秒では応答を得られず、次の読取りでHTTP 200。Supabaseは稼働中で適用済みmigrationは38件、最新は `20261115011424`。稼働版から開発版までの差分は47コミット・42ファイルで、今回の変更はそのうち8ファイル。差分全体には保存済み本文の扱いと個別記録から統合への処理も含まれる。新規migration・今回の本番DB書込みは0件。EmlisAIの観測・分析IFはA37の開始前後の実応答で対照し、Pieceや既存月次・保存済みの図を新しいMAP候補の成績へ含めない。

**開発版とHTTPでの検査。** APIの開発版は [28f56425](https://github.com/MassyuRed/mashos-api/commit/28f56425eff50e1ca47944571d2a3deaee8834f0)。照明の46,799バイトのメッセージを、当時の残り出力枠766トークンとともにローカルの実HTTPハンドラーへ送った。リクエスト本文は47,001バイト、応答はHTTP 200で、生成処理の手前に届いたメッセージは送信時と一致した。返答には合成の固定値を使った。GPUでの処理時間・生成トークン数・図と本文への効果は未測定。原文の欄・引用元をたどる条件と、計画の照合値・順序が変わった入力の拒否は新しい回帰試験9件で確認した。

**5入力と12記録の準備。** 5入力のMAP生成15段階と、12記録の個別生成・統合39段階をCPUで最後まで再生した。通常の合成出力では入力と予約出力の最大が29,889トークン、3段階の正解出力の最大が1,803トークン。未確認候補24箇所を含めた合成出力でも54段階を完了し、最大値はそれぞれ31,243／32,768、3,394／4,096だった。これらの値は用意した出力で測ったもので、実4Bが同じ長さ・内容を生成する保証には使わない。

**分析の回帰試験。** 異なるテスト2,822件が成功した。最初の実行は2,812件成功、SQL検査1件が子プロセスでテスト用モジュールを読み込めず停止した。CIと同じPythonの検索パスでその1件と新規9件を実行し直し、10件とも成功した。試験環境の修正で製品コードの変更は0件。

**保存後の再読と二者判定の準備。** 最終条件でA37用の架空5件・15段階を通常のAPIから隔離SQLへ保存し、別プロセスで5件とも同じIDを読み直した。B37用の架空12記録では個別・統合の39段階を経て1件を保存し、別プロセスでID・図・全文・網羅情報・非公開根拠の一致を確認した。未認証はHTTP 401、別所有者はSQLSTATE 42501。二者判定の処理では、旧A36の記録、合成再生、片方が不適合の判定からB37の実行記録を作れないことを確認した。実4Bの保存・判定は未実施。

**次の実行条件。** 開発版28f56425に対するGitHubの分析・PieceのCIは両方成功。送付する6ファイルは3,077,471バイト、既存Pod `xrplcoeb5ec77f` 内でコピーする入力・対照3ファイルは99,755バイト。送付用ZIPは2,718,394バイト（SHA-256 `856a0549aa24fcd15261fe8b59aec990ac0425fa2dde96919d97d8231366d1d3`）、実行条件のSHA-256は `002c6518c7413087f5de1d4c8dd50831a7d2a6e471740edcce59fb9418a90030`。FIT36の保存済み重みを使い、追加学習・再試行は各0回。A37は同じ5入力、前後の対照を含め最大19応答、元の提供への復元込み30分で1回。5件すべての原文・3段階の生応答・図・全文を主担当と独立担当が適切と判定した場合だけ、同じ原本に結び付く判定記録（4,096バイト以内）を送り、B37を同じ12記録・最大43応答・復元込み17分で1回実行する。A36の許可は消費済み。A37・B37の送付・実行・実応答保存は0。

<a id="analysis-a37-result-20261118"></a>
## 9.145 A37の実生成・全文照合と通常反映の判断（2026-11-18 JST）

**読書会。** FIT36の保存重みと開発版 `28f56425` を使い、同じ5入力の評価を1回実行した。A36で抜けていた、初日に下書きを保存し、翌日に案内を送り、一人から「了解」と返信を受けた経過が、A37では図・全文に戻った。一方、計画の引用「読書会は来週なので、まだ開かれていない。」に付くべき本文片を「その問い合わせを送ったかは聞いていません。」へ置き換えた。開催前という事実が落ち、見出しと関係線では、共同担当者から届いた一階の部屋の予約連絡と、本人が案内を送った行動が同じ人の行動のようにつながった。主担当と独立担当が原文・生応答・図・全文を別々に読み、ともに不適合と判定した。

**照明。** 計画は12項目を生成したが、3〜12番の10項目で家計に関する同じ4引用・2単位の組合せを繰り返した。次の項目生成には2,646トークン、生成時間148.432秒を割り当てた。HTTP 200で2,046トークンを受け取ったが、終了理由は `length` で、9番目の項目の `meaning` の途中でJSONが切れた。終了理由だけから、時間切れだったかは特定できない。原本を補わず、関係線・図・全文の生成前に停止した。§9.144で短縮した関係線入力の照明での実生成、窓際で描いた1時間と後日照明で描いた30分の最終表示は未確認。携帯修理・応募取下げ・独立した10記録は未着手。5件すべての二者適合という条件が成立せず、B37の実行は0回。

**実行・復元。** 送付6ファイル3,077,471バイト、同Pod内コピー3ファイル99,755バイト。開始前のEmlisAIと分析IFの対照2応答、読書会の3応答、照明の2応答で計7応答。終了後の対照は未実行。元の120uの提供復元まで402.544秒。復元先はPID 25561、開始tick 6622360。SIGINT・SIGTERMの無視・ブロック状態は元と一致し、試験ポートは閉じた。追加学習・再試行は各0回。回収したZIPは69,339バイト、SHA-256 `5e34cb5a05bcdc6e2fb920401c2b9f9b623bea3e2a5b74e5bb63960946c0dd4e`。実応答原本は `408f51b11890f4215eb9c0b33f75f070d0042e5abff141926edbc1782648fc57`。

**保存・通常反映。** 完成した読書会1件の3段階の実応答を通常APIから隔離SQLに保存した。別プロセスで同じIDの公開図・全文・網羅情報・非公開根拠が保存時と一致した。未認証はHTTP 401、別所有者はSQLSTATE 42501。照明と残る3入力の保存、再読時のモデル呼出し、本番DBへの書込みは各0。全12記録の実生成と同じ原本の保存・再読、通常のモデル選択とAPI・workerへの反映は未完。A37の1回枠は終了した。

<a id="analysis-a38-preparation-20261119"></a>
## 9.146 A37の根拠の取り違え・計画反復を修正したA38候補と新Podの復元準備（2026-11-19 JST）

**A37原本からの修正。** 前回の照明では、家計に関する同じ引用の組を10項目に繰り返し、実際に窓際で1時間描いた場面と、後日照明の下で30分描いた場面を計画に残せなかった。開発版 `26def42fc976a1d1a5802fa23d54cdfb82888002`（occurrence.v9）は、各項目の「単位ごとの引用元欄と引用文」が、前の項目と同じ順番で丸ごと一致する続きを生成の途中で止める。必要な引用を別の出来事でも使う場合や新しい根拠を加える場合は選べる。同じ行動を異なる条件で行ったときは、それぞれの場面・行動・場所・道具・時間・結果を原記録で照合するよう計画に指示した。A35〜37で取得した計画9件の原本で再現し、以前から重複していなかった8件を受け付けた。A37照明は初めて丸ごと重複する第4項目で止まり、異なる根拠を足す続きは選べた。

読書会では、未開催という引用に椅子の問い合わせ状況の文章を付け、関係線でも予約連絡と案内送信の根拠を取り違えた。候補では一つの事実文を書く直前に、割り当てた引用から最大8文字の手がかりを選び、非公開の根拠キーに収める。関係線を書くときも、始点・終点それぞれについて選んだ単位の原文を示す。提供側が選択肢を絞り、CMEEが同じ原文・単位への割当を照合する。原文の手がかりは非公開の実応答に残し、表示は従来と同じ図・本文へ渡す。A37読書会の入力で、隣の引用を選ぶ場合と、異なる関係線端点から送信の引用を持ち込む場合をCPUで拒否できた。正しい引用を選んでいても、続く文章で主体や出来事を正確に書けるかは実4Bの図と全文で判定する。

**容量と互換性。** 以前のA36照明の原文と項目を、この候補の関係線入力として組み立てると47,534バイトで、メッセージ上限49,152バイト以内に入った。段階間で共有する生成予算には530トークンが残り、照明の最後までを表す用意済みの関係線例は339〜341トークンで収まった。実行時間と実際のモデルが返す文章の長さは未測定。FIT36の既存教材15件の計45段階で、通常／統合した公開図10件と統合前の5件の内容を保持した。過去の実応答の書換えと新しいモデル呼出しは各0。

**新しいGPU。** Mashが借りたPod `dqmg1qgolenq7v` にログインし、GPUはRTX 4000 Ada（20,475 MiB、compute capability 8.9）、Python 3.12.3、PyTorch 2.8.0+cu129、GPUメモリの空き19.39 GiB、作業ディスクの空き約50 GiBと確認した。ベースモデルのキャッシュはなく、提供用と試験用のポートはいずれも待受前だった。従来のA5000／cu128用の環境判定を流用せず、新Pod上のtorchとGPUに合わせて確認する。Cocolonの通常提供用120uとA37に使ったFIT36の重み・設定はPod外の保存版から取り出し、実行時のSHA-256と一致した。

**復元の範囲。** RESTORE38は17ファイル・32,990,801バイト、ZIPは31,735,780バイト（SHA-256 `84154328126f4b3d964fe254e179140a26853361ed8e033a030260d1b5fa699d`）。新Pod内で公開ベースモデルの固定版を取得し、元の120uを起動して状態を確認する。FIT36は照合して次の評価用に置く。復元枠は一回・30分で、追加学習、モデル応答の生成、再試行は各0。照合した実行範囲は `511a7b843f0d39ef442e2500f163106b0d24c0f9245df25c6a4816d656ef355c`。A37は§9.145の結果で終了しており、新Podに用意した復元の枠とA38以降の評価は別に扱う。

**検証と通常経路。** GitHub上の候補 `26def42f` の対象5ファイルで47試験が成功。FIT36と以前の受付済み応答の形式を区別し、今回追加した二つの回帰試験をAnalysisのCI対象に含めた。追跡ファイルはCocolonが5,972件、mashos-apiは試験2件の追加で2,680件から2,682件になった。 GitHubのAnalysis（44393694338）とPiece（44393694368）は同じコミットで両方とも成功した。隔離SQLでは用意した模擬応答を通常APIに渡し、5入力は各1件、12記録の分割・統合は1件を保存した。いずれも別プロセスで同じ図と全文を再読できた。この確認でのGPU生成と本番DB書込みは各0。通常のRender API・workerはともに `24bc228dbf54abc983906323c0ae7d937fae1fd6`、Supabaseの最新migrationは `20261115011424`。

**引き継ぎ。** 復元用ファイルを手元で照合した時点で、新Podには送付していない。新Podでの復元一回の具体的な承認後に元120uの起動状態とFIT36の配置を確認する。A38では同じ5入力の原文・生応答・図・全文を二者が照合し、全件適合した場合だけ全12記録の評価へ進む。適切な実出力の同一原本を通常APIから保存して別プロセスで再読し、通常のモデル選択とAPI・workerへの反映を確認する作業が残る。

<a id="analysis-restore38-result-20261119"></a>
## 9.147 新Podの初期復元完了とA38の開始条件（2026-11-19 JST）

**新Podでの復元。** Mashが承認したRESTORE38をPod `dqmg1qgolenq7v` で1回実行した。送付した17ファイル（32,990,801バイト）を照合し、公開ベースモデルQwen3.5-4Bの固定版 `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` を11ファイル・計9,342,816,694バイトで取得、照合した。通常用120uをPod内で起動し、状態確認はHTTP 200。稼働プロセスはPID 1494、開始tick 8820508。SIGINTとSIGTERMはともに無視・ブロックなし。復元全体は185.261秒だった。

**GPU・重みの照合。** RTX 4000 Ada（20,475 MiB）とPyTorch 2.8.0+cu129で、1,752トークン相当の入力と1トークン相当の継続を使いGPUの計算を2回確認した。結果は有限値で、基準計算との数値照合に合格した。提供中の120uの重みは `ecbdd0d113cfcdc38a17be4b17c708678c01c5071ae86c8a30ca9a5de5900495`。評価用FIT36の重み `37661bc72c42ae4b2f69b76917e8c88e46e5c8963d9d8fcef60c34d6a8ab623e` と設定 `65e1fe7eb9792ea5a23e60cb19bc4e7aabf644572acaf98ee33f0753a3e3918c` が保存版と一致した。FIT36は次の評価用に配置し、提供モデルには選択していない。

**受領と残件。** 新Podから復元結果7ファイルを回収した。ZIPは6,732バイト、SHA-256 `07e9df8b680fe8249f930471119752e291c37a279aaea2836288d9f8f91c3173`。Pod外で承認範囲、元120u、FIT36、GPU数値照合、稼働プロセスの記録を照合した。追加学習・文章生成・再試行・通常環境への変更は各0。A38では5入力すべてについて原文・生応答・公開図・全文を主担当と独立担当が評価する。全5件が適切な場合だけB38の12記録の分割・統合へ進む。同一原本を通常APIから保存して別プロセスで再読し、通常API・workerへ反映する工程が残る。

**次の評価範囲。** 開発版 `26def42f`、Podで照合したFIT36、元120uの稼働プロセスとGPU検証結果に結び付けた。確定した送付物は10ファイル・3,192,743バイト、ZIPは2,756,970バイト（SHA-256 `02b2adf5c782ddd7ac71de6eecf744c1648aa3b277561f971c01c627d6f248fd`）、Pod内のファイルコピーは0。実行範囲のSHA-256は `e3800274ef1752ff6c3028e9034d8e38772fcd802cc422fc7ded5feea97e6d24`。A38は5入力・最大19応答・元提供への復元込み30分で1回。全5件が二者適合した場合だけ、4,096バイト以内の判定記録を送り、B38を12記録・最大43応答・復元込み17分で1回実行する。追加学習・再試行は各0。今回、A38・B38の送付と実行は行っていない。

<a id="analysis-a38-result-20261119"></a>
## 9.148 A38が分析IFの対照で終了した結果（2026-11-19 JST）

**実行範囲。** 新Pod `dqmg1qgolenq7v` で承認済みのA38を1回実行した。送付した10ファイル・3,192,743バイトの実行範囲はSHA-256 `e3800274ef1752ff6c3028e9034d8e38772fcd802cc422fc7ded5feea97e6d24`。開発版は `26def42f`、評価用の重みはRESTORE38で照合したFIT36。事前確認で5入力を受け付け、評価用の提供プロセスで対照2応答を生成した。

**最初に差が出た箇所。** EmlisAIの本人訂正対照はHTTP 200で、旧Podの本文とバイト単位で一致した。分析IFの2候補対照も、A37と同一の要求（SHA-256 `54972d8e6a96f635ca5d175d791ee5740688ea794bd9850a1fa1dc45bcf6f15f`）でHTTP 200、終了理由 `stop`。本文のSHA-256は旧Podの `8dd53ecf6e04e43e0ac2ac435fa812e18719aa779679a08751c8e618a1868d96` から `489ebd07f1a553738923ef300729345562b776cb01fc3c0bf599ac724fcc6c35` に変わった。第2案は「ノートの考えを再確認してから資料を読む」から「仕事の進め方を先に考え、残った時間で資料を読む」に変わり、摩擦の記述も1件から2件になった。二者の原文照合では、入力は「資料を読む時間を先に確保して、仕事の進め方を考えたい。」「使える時間は30分です。」。第1案は確保の順を保ち、第2案は読む時間を残り時間に委ねた。第2案の理由欄には「30分から進め方を引いた時間」という意味を取りにくい文もある。旧応答の第2案でも先に読む時間を確保したことは確認できない。新旧の実応答を通常CMEEの入口でCPU再生すると、両方とも `GENERATED` で仮説2件と30分の条件を保持し、追加案をAI由来として扱った。一方、上記の時間配分と説明を根拠に二者は新版を意味の参照原本に採用しなかった。

**判定と復元。** 旧Pod本文と一致することが前段の開始条件だったため、PLAN・NODES・RELATIONSの新規生成は0回。MAP原本・図・全文は0/5件で、主担当と独立担当が5入力それぞれについて、意味を評価する原本が揃っていないと記録した。B38の二者全件適合条件は成立せず、判定記録の送付、12記録の分割・統合、今回の原本のSQL保存・別プロセス再読は各0件。A38の実行は `INCOMPLETE_NOT_ADOPTED` で終了した。所要155.667秒、追加学習・再試行は各0。通常用120uをPID 4196（開始tick 8941888）で復元し、通常用の稼働状態と認証、試験ポート閉鎖、SIGINT・SIGTERMの元の無視／ブロック設定を照合した。受領ZIPは17,003バイト、SHA-256 `3a7e1aa90e9d3b4953982541a8e83adfdec04c988fcc1487d202b4f9dbc95a02`。通常API・workerは `24bc228d`、Supabaseの履歴は38件。今回の通常反映は0回。

**次の確認。** A38で生成したIF応答は候補の提供プロセスを通った。生成部分だけを差し替えて新旧HTTPハンドラをCPU再生すると、EmlisAIはともにbase・入力1,460トークン、IFはともに既定120u・入力1,578トークンで、IFの出力スキーマも一致した。この検査はGPU上の生成時の内部状態や演算差を判定しない。新Podで元120u単独に同じIF要求を送った本文がまだないため、今回の原本だけでは実行環境の違いと候補経路の影響を区別できない。次回は通常用120uを稼働させたまま、同じIF要求を1入力・1応答だけ取得する。処理の前後で同じPIDとポートの所有を確認し、旧Podの原本・A38の原本と比較する。比較結果の採用には、元の入力と2案の文章・条件・未確定事項の意味を別に確かめる必要がある。EmlisAI対照は一致済み。5入力のMAP評価はこの切り分けの後に再開する。

**CAL39の確定範囲。** 同じPodの通常用120uで、既にPodにある同一IF要求（7,796バイト）を最大1応答で1回評価する。新たな送付は `cal39.py` 1ファイル・9,824バイト（SHA-256 `6d1fe640448868302749d1e088f14ff6b533132d42a634ef87e7d0a7457db9c5`）。前後のhealthと稼働プロセス・ポート所有の確認を含め最大4分。学習、再試行、提供切替、再起動は各0回。この区切りでは送付・GPU実行前。

<a id="analysis-cal39-result-20261119"></a>
## 9.149 新Podの通常用120uによる分析IFの比較（CAL39、2026-11-19 JST）

**実行と稼働確認。** Mashの承認を受け、Pod `dqmg1qgolenq7v` の通常用120uへ、A38と同じ分析IFの架空入力を1回送った。送付ファイルは `cal39.py` 1件、9,824バイト。Pod内に保存済みの要求7,796バイトをそのまま使用した（SHA-256 `54972d8e6a96f635ca5d175d791ee5740688ea794bd9850a1fa1dc45bcf6f15f`）。実行前後に同じPID 4196・開始tick 8941888、元120uの重みと稼働状態、ポート8000の所有、試験ポート18008の閉鎖を確認した。提供切替・再起動・学習・再試行は各0回。

**返った原本。** 1応答、HTTP 200、終了理由 `stop`、所要73.109秒。旧Pod・A38・CAL39で要求本文は同一。CAL39の2案を含むHTTP応答本文のSHA-256は `489ebd07f1a553738923ef300729345562b776cb01fc3c0bf599ac724fcc6c35` で、A38の返答と全バイトが一致した。旧Podの返答（`8dd53ecf6e04e43e0ac2ac435fa812e18719aa779679a08751c8e618a1868d96`）とは異なる。回収した結果原本は5,509バイト、SHA-256 `559f6781f26027449120887f1754575da9178dcea7adab569bac619db7eca2cf`。

**元の意向と2案。** 本人の意向は「資料を読む時間を先に確保して、仕事の進め方を考えたい。」、制約は「使える時間は30分です。」。第1案は読む時間を先に確保する。第2案は仕事の進め方を先に考え、読書を残り時間に委ねる。本人の決定として誤って掲げてはいないが、本人が確保したい時間配分を保つ案としては扱えない。「30分から進め方を引いた時間」という理由も不明瞭。元120uの今回の応答でも同じ内容を確認した。通常CMEEの処理（API作業枝 `26def42f`）に、回収した応答を独立に再入力し、予測順位を付けない2案の受理、公開図・全文がA38と一致すること、メモリ内の保存形式からの再構成でも同じ内容を得ることを確認した。第2案の時間配分は図・全文にも現れるが、不明瞭な理由が含まれるのは生応答の `unknown_reasons` のみ。独立再生でのモデル呼出しとDB書込みは各0回。§9.148と同様、今回の2案をIF表示品質の合格例としては採用しない。

**残る作業。** CAL39の1件は、A38の第2案と同じ文面が新Podの元120u稼働時にも現れたことを示す。GPUの数値差、実行順やモデル読込みの影響を個別に特定する記録はない。この原本は新Pod内で元提供との一致を比較できる証跡で、IF文章の品質合格やマップの採用判定は伴わない。今回のわたしマップ生成は0件。次は5入力の原文・生応答・図・全文の二者照合、全件適合時の全12記録、同一原本の通常DB/API保存・別プロセス再読と通常反映が残る。

**次回の実行範囲。** A39・条件付きB39は同じPod向けに準備し、CAL39の承認範囲ではどちらも実行していない。旧PodのIF応答の照合値は保存する。A39ではA38候補とCAL39通常用の原本から一致を再確認したIFを同じPodの前後対照に使い、EMLISの訂正対照も従来どおり照合する。本人自身が挙げた別案が0件のとき、共通の希望と各案の違いを区別し、何が起こるか分からない理由を行動と結果に結び付けるIFの生成指示を、別の修正候補として用意した。関連CPU検査254件が通り、以前の3案とCAL39の2案は当時の要求参照で公開図・全文を再現した。この修正候補は今回のA39・B39には含めず、実モデルでの品質改善は未確認。新規送付2ファイルは計62,955バイト（圧縮18,299バイト、SHA-256 `2ea79ad29da2052de02deeb87c09c137abeef85f100a1d4005280fbf36187d4c`）、同じPodの既存8ファイルは計3,135,848バイト。A39はマップ5入力・前後対照込みでモデル呼出し最大19回、元提供への復元を含め30分。B39は全5件の原文・生応答・図・全文を二者が適合と判定し、各受領原本の照合値、単回実行、元提供の復元、および判定記録（4,096バイト以下）を確認した場合のみ、全12記録と統合1件を評価する。B39は前後対照込みで最大43回、復元を含め17分。各1回、学習・再試行は0回。通常保存・再読の検証と本番反映は残る。

<a id="analysis-a39-result-20261119"></a>
## 9.150 同じPodの前対照を通過したA39の実生成と二者照合（2026-11-19 JST）

**開始条件。** 承認を受け、Pod `dqmg1qgolenq7v` でA39を1回実行した。送付2ファイルは展開時62,955バイト、受け渡し時18,299バイト。同じPodの8ファイル3,135,848バイトを照合して使用した。前対照はともにHTTP 200。EmlisAIの訂正応答は従来の原本、分析IFは§9.149のCAL39の本文にバイト単位で一致した。分析IFの表示品質の判定には§9.149を引き続き適用する。

**読書会。** 「読書会は来週なので、まだ開かれていません。」が図と全文に戻り、共同担当者から一階の予約連絡を受けたこと、本人が案内を送り一人から「了解」と返信を受けたことも区別された。一方、翌日に案内を送った項目より後に、初日を表す「今日は下書きを保存しただけで、参加者には送っていません。」が表示された。共同担当者が椅子の数を問い合わせたか本人には分からないという記述は、計画段階から公開図・全文まで抜けた。原文を個別に確認した二者は、原文の経過と未確認事項の両方を保てていないと判定した。

**照明と残りの3入力。** 照明の計画は12項目を出力し、2,245トークンを使った。計63引用のうち、欄番号と引用の組は17種類で、同じ家計の引用が20回現れた。4〜12項目の最初の単位は同じだった。窓際で1時間描いた場面と、後日購入した照明で30分描いた場面は、どちらも計画に入らなかった。次の項目生成は1,851トークン・78.962秒の残枠で、79.458秒後にHTTP 200・783トークンを返したが、終了理由は `length`。4項目目の本文の途中で切れ、JSONを読めなかった。関係線・図・全文は生成されなかった。受領した生応答には「夜に描く分には暗くなく」という見出しがある。原文では、それほど暗くないのは昼間の窓際で、夜の細い線に困っていた。この逆転は公開表示には達していない。携帯修理・応募取下げ・独立した10記録は実行に至らず、5件すべてで二者の適合を確認するB39の条件は成立しなかった。B39の起動・新規判定記録の送付は0回。

**実行と復元。** 開始前の対照2応答、読書会3応答、照明2応答の計7応答。終了後の対照は未実行。A39は `INCOMPLETE_NOT_ADOPTED` で終了した。元の通常用120u復元まで467.409秒。PID 6368・開始tick 9157188で稼働を確認し、試験ポートを閉鎖した。追加学習・再試行は各0回。結果ZIPは71,414バイト、SHA-256 `6ed0a4db9a8dca8f040bb8cbf09d496b34035a36cef88ca69eddee3704d8e645`。5段階のMAP生応答と前対照を含む `after.result.json` は356,096バイト、SHA-256 `f7e04b13920774fd25ffe0b126a10fa2433e8c4f0c50bdfaec4c4a240e6d0a7c`。

**保存と通常反映。** 読書会で完結した3段階の実応答だけを修正せず通常APIの処理へ再入力し、隔離SQLに1件を保存した。公開図で変わったのは保存先IDへの参照だけで、全文・出典範囲は一致。別プロセスの通常APIは同じ保存IDをHTTP 200で再読し、公開内容・非公開根拠も保存時と一致した。再読時の新規生成・SQL書込みは各0回。未認証はHTTP 401、別所有者のSQL操作はSQLSTATE 42501。照明と残る3件の保存は0件。通常API・workerはいずれも `24bc228d`、Supabaseはmigration 38件で、稼働DBへの書込みと本番反映は各0回。読書会の保存・再読の成立と、意味品質の不適合を個別に記録する。

**次の開発候補。** `occurrence.v10` では、計画を作るときに同じ記録の行動欄を先に読み、未評価の箇所を原文の順に示し、思考欄と照合する。項目生成の入力で各引用に元の記録時刻を結び付ける。読書会の実原本で11引用を確認し、初日の未送信は11月13日、未開催を記した翌日の記録は11月14日と特定できた。別々の項目の先頭引用が同じ原文位置に戻る計画は、アプリ側とモデル提供側の両方で、項目生成に入る前に止める。CPU再生では照明の実計画のうち3〜12番が同じ位置から始まり停止した。読書会の実計画とFIT36の15計画は通過し、既存 `v9` の読書会の図・全文・根拠も同じ原本から再現した。API開発枝 [`7a16aab0`](https://github.com/MassyuRed/mashos-api/commit/7a16aab0ddc59f6f760d20a8b40d7061b90437e5) の差分は実装5・CI 1・検査3の計9ファイルで、関連検査415件と通常／複合条件のCPU検査各54経路が通過。全12記録で24の保留をすべて未解決とするCPU検査は、入力と残り出力枠が最大31,211/32,768トークン、3段階の合計出力は3,930/4,096トークン。実4Bが時系列・照会状況・昼夜・2つの制作場面を保った新しい図を作れるかは未確認。

**A40・条件付きB40の確定範囲。** 開発枝 `7a16aab0` のAnalysisとPieceの両CIが同じコミットで初回成功した（GitHub Actions `44415200668`、`44415200752`）。A40・B40用の新規6ファイルは計3,122,576バイト、送付ZIPは2,728,173バイト（SHA-256 `5fcbc5babe4040d5d88b46b19dfe7a339fa8cf6f4654761d2525e7c96342d4ca`）。同Podの既存4ファイル102,610バイトを照合して再利用する。A39復元後の通常用120u（PID 6368・開始tick 9157188）を開始条件とし、A40はマップ5入力・前後対照込みで最大19応答、元提供への復元を含め30分。B40はA40の全5件の原文・生応答・図・全文が二者照合で適合し、復元と4,096バイト以内の判定原本を確認した場合のみ、同じ12記録の個別生成と統合を実行する。B40は前後対照込み最大43応答、復元を含め17分。各1回、追加学習・再試行は0回。22原本の単独改変をそれぞれ拒否し、A39復元からの継続条件35ケースも検査した。実行範囲のSHA-256は `8f11fc40cc9c3b8fb30bb20c34d4fdaddc7686ffb3fa4a095143783ce3cbef22`。A40・B40のPod送付・実行と、v10の通常反映は未実施。

<a id="analysis-a40-result-20261119"></a>
## 9.151 A40の実生成と原文・図・全文の二者照合（2026-11-19 JST）

**実行条件。** Mashの承認を受け、同じPod `dqmg1qgolenq7v` で、開発枝 `7a16aab0` の `occurrence.v10` を使いA40を1回実行した。事前に§9.150の6ファイル（計3,122,576バイト、ZIP 2,728,173バイト）とPod内の既存4ファイル102,610バイトを照合した。EmlisAIの訂正とCAL39の分析IFは、実行前の両対照ともHTTP 200で元の本文に一致した。

**読書会。** 初日に二階の部屋名を書きかけて消し、下書きを保存しただけで参加者には送らなかったことが、翌日の送信より前に表示された。共同担当者が一階の予約を知らせ、本人が案内を送って一人から「了解」を受けたことも区別できる。共同担当者が椅子の数を問い合わせたかは本人には分からないという留保も戻った。一方、原文にある「読書会は来週なので、まだ開かれていない。」は計画から図・全文まで欠落した。また本文は「予約できた」と記すが、見出しと関係線は「予約できる」に変えている。

**照明。** A39の4項目目で途切れた項目生成は最後まで進み、関係線・図・全文も受領した。計画503トークン、項目1,026トークン、関係線376トークンがすべて `stop` で終わり、4項目・2関係線の図になった。昼間の窓際はそれほど暗くなく、困ったのは夜の細い線という原文の条件が戻った。計画はA39の12項目・63引用（17種類）から4項目・16引用（15種類）になり、3段階の所要時間は170.16秒。窓際で1時間描いたこと、後日買った照明で30分描いたことの2つの実際の制作場面は、図と全文のどちらにも現れない。また、生の本文は以前保存した写真を夜に見たとしているが、項目名では写真を夜に保存したことになった。

**携帯修理。** 店から画面修理完了の連絡を受けたこと、本人は未受取で動作確認もしていないこと、翌日受け取りに行く予定、弟の電池交換の相談が別件であることを保持した。一方、現在までの未受取を本文と公開図で「まだ受け取りには行いません」と書き換えた。後の正しい未受取の記述と併存し、本文の動詞と時制が原文と合わない。

**応募取下げ。** 写真を2枚選び、海辺の1枚だけを応募し、受領メールが来た後で取り下げた順序を保持した。本人が明記した「今回は再応募せず、友人にも取消をまだ伝えていない」を、関係線を作る段階で未解決と分類した。公開画面では同じ文を事実として記しながら「まだ記録にないこと」とも表示した。

**独立した10記録。** 全10記録から根拠を採り、友人に会わなかったことと恋人と食事したことを個別の本文で区別した。一方、友人から予定変更の連絡を受けたという確認済みの出来事を「まだ記録にないこと」に挙げ、実際に分からない友人の気持ちを落とした。図全体の見出しと唯一の関係線は、原文に根拠がないまま、別々に記された友人との予定と恋人との食事を対比した。

**二者の判定。** 主担当と独立担当が同一受領原本を基に、各入力の原文・計画・項目・関係線・公開図・全文を別々に読み、5件とも不適合と判断した。A40は評価対象の5件すべてを生成した。全件適合というB40の条件は成立せず、B40の起動・判定記録の送付、全12記録と統合の新規生成は各0回。

**実行と復元。** 全5入力の計画・項目・関係線で計15応答、実行前後のEmlisAI・分析IFの4対照と合わせ19応答。5件すべてで公開図・全文を生成した。両対照は終了後も元原本にバイト単位で一致。追加学習・再試行は各0回。通常用120uを復元するまで882.682秒、復元後のPIDは10466、開始tickは9533446。元のSIGINT・SIGTERMの取り扱いと試験ポート閉鎖を確認した。受領ZIPは178,073バイト、SHA-256 `2a3cdc1d2618e950d36f562ad3fa9237055e8dbaed87e90b327379df224d24b8`。応答原本 `after.result.json` は1,095,455バイト、SHA-256 `d043a71be61149a52eef368bc6bcd0b8fee3201df2edf2625959d2b531d96415`。

**保存・再読と次の作業。** 全5件・15段階の実要求と実応答をそのまま通常APIの処理に再入力し、それぞれを隔離SQLに保存した。別プロセスで5件とも同じ保存IDをHTTP 200で再読した。公開図の構成・全文・網羅情報・非公開根拠は保存時と一致し、新規モデル呼出し・再読時のSQL書込みはともに0回。各件で未認証はHTTP 401、別所有者のSQL操作はSQLSTATE 42501。稼働DBへの書込み・本番反映は0回。通常API・workerはいずれも `24bc228d`、Supabaseのmigrationは38件。次は原文から別々の重要な行動・状態を選べることと、既知の未実施／未確認を正しく区別できることを検証する。全5入力の意味適合、全12記録の実評価と同一原本の通常保存・別プロセス再読・反映は残る。

<a id="analysis-a41-candidate-20261119"></a>
## 9.152 わたしマップの修正候補とA41の検証範囲（2026-11-19 JST）

以前の計画は各記録を一度引用しても、同じ記録に書かれた別の行動や結果を落としていた。v11は行動とその結果、同じ活動を異なる条件で試した場面、準備の完了と本来の出来事を別々に選ぶよう指示する。入力全体または個別記録では一意に結び付く根拠を短い番号で選べる。統合時は、個別に読んだ段階の引用について、元の欄と文字範囲を確認する。番号がない引用は許された原文のまま扱う。CMEEはその要求で提示した対応表を照合して元の欄・引用に戻し、それを本文と関係線の生成に渡す。モデルが実際に返した番号と文章も照合に残す。

見出しと本文片には、元の欄と結び付く完全な一文が所定の長さなどの条件を満たす場合に、モデルが選んだ原文を使う。引用の途中だけを表示して、否定・予定や他の人からの連絡の意味が変わることを抑える。本人の行動が完了したと既存の読取処理で確定できる場合、その同じ事実を未確認欄に出す判定を拒否する。その他の候補は、対応する原文の述語の手掛かりを添えて、一つずつ判断する。

A40で実際に選ばれた根拠75件を、番号74件と逐語引用1件で元の欄・順序・引用に戻した。A40の原本を使ったCPU対照で、以前の見出し25件はすべて新しい原文選択条件から外れ、修理の未受取を現在の意思に変えた旧本文片も拒否した。元の読書会で抜けた未開催、照明で抜けた二つの制作場面、友人の気持ちは不明という一文は、候補の計画に明示的に選べば次段へ渡せる。同じ5入力で、過去の選択も引き続き許される。旧出力で再応募しない・友人には未通知と明記した文、および友人から届いた予定変更の連絡を「まだ記録にない」とした2箇所は、今回の候補でも選択できる。旧来の選択を保ったままSQLで決まる要求に番号を対応させた場合、5件の計画のトークン数は順に289→217、502→310、309→277、264→223、645→546だった。4Bが初回から必要な根拠を選ぶか、不明と記載済みを区別するかは実生成で照合する。

合成応答で、5入力の15段階・12個別の36段階・統合の3段階を再生した。通常例と保留を増やした例の最大値は、入力＋予約出力がそれぞれ30,337・31,450トークン（上限32,768）、三段階の出力合計が1,790・3,517トークン（上限4,096）だった。24保留をすべてOPENにした統合の合成例は3,871/4,096トークン。確定した10変更ファイルと同一のソースで239件の回帰検査が通った。合成試験では、モデルに送信する前に隔離SQLで当時の入力の照合値と対象期間の始まりを確定し、同じ原文メンバーで保存・再読を照合する。照明の記録の対象期間は入力資料の10月1日から、通常DBで算出した10月10日に変わる。登場する原文は同じ。最終の実行条件で合成応答を通常APIのコードに流し、5入力の15要求について5件を隔離SQLに保存し、別プロセスで同じ保存IDの図・全文を5件とも再読した。12記録＋統合の39要求は統合結果1件を保存し、その同じ保存ID、図・全文・非公開の根拠を別プロセスで再読した。再読はHTTP 200、モデル呼出し・SQL書込みは0回。これらは合成応答による保存経路の検証で、実4Bの意味判定はまだ行っていない。

5入力については原文・計画・項目・関係線の生応答、公開図と全文を二者が照合する。全5件適合後に、同じ12記録と統合に進む。通常反映には、同じ生成原本を通常DB・APIで保存し、別プロセスから同じ結果を再読できることを確認する。A40では二者とも意味適合0/5件だった。

開発枝で候補を選択できるようにした。A41・B41用の実行条件と復元の照合に用いる元原本を確定した。A41・B41の実行回数は0回。通常環境のAPI・workerはともに本番コミット24bc228dを提供し、Supabaseのmigrationは38件、最新は20261115011424。今回の本番書込み・デプロイは0回。追加学習と再試行は各0回の範囲で準備した。

開発コミット 5883c0b1 でAnalysis・Piece両CIの成功を確認した。新規6ファイル計3,180,471バイト（ZIP 2,743,545バイト）を使い、同じPod内にある4ファイル計102,610バイトを照合して再利用する。A41は5入力・前後対照込み最大19応答・通常用120uへの復元込み30分。B41は条件成立時だけ、12個別＋統合・前後対照込み最大43応答・復元込み17分。各1回。実行範囲のSHA-256は `a5b027a646fa921ddb8cb1d46d750c0895c3144d8d3046d5e611c7961c0dde7a`。[開発差分](https://github.com/MassyuRed/mashos-api/commit/5883c0b1eb94f07b989406278617d6dd3ee37297)

<a id="analysis-a41-result-20261119"></a>
## 9.153 A41の実生成、読書会の原文照合と照明の途中終了（2026-11-19 JST）

実行前に、EmlisAIの訂正応答と分析IFの応答が通常用の対照本文に一致した。実4Bからの7応答はこの2対照、読書会の3段階、照明の2段階。修理・応募取り下げ・独立10記録と終了後の2対照は未取得。追加学習・再試行は各0回。433.133秒で通常用120uを復元し、復元後のPID 12802、開始tick 9920128、元のシグナル処理と試験ポートの閉鎖を確認した。取得ZIPは77,695バイト、SHA-256は `e2ace120a7f9d3fdfab510ebd067d16175b91e5b225a11e058ae30b91b498268`。

読書会は2項目・11引用で図と全文を生成した。初日は案内を下書きに保存して参加者には送らず、翌日に一階の部屋を予約できたと連絡を受けてから案内を送り、一人から返信が届いた。全員が読んだかは不明という区別も保った。一方、翌日の説明の中に初日の下書きと会場への問い合わせに関与していないことが入った。椅子の数について共同担当者が問い合わせを送ったかは未確認という記録は、A40では選んでいたがA41の計画から抜けた。読書会そのものは来週でまだ開かれていないという記録も選ばれず、図と全文の両方から二つの状態が欠けた。

照明は昼に窓際で一時間描いた文を第5項目、照明の購入・設置後に三十分描いた文を第9項目へ選んだ。A40で計画から抜けた二つの制作場面が今回は計画にそろった一方、9項目・18場面で異なる引用を72件選んだ。次段に予約した3,141トークンに対し生応答は2,322トークン。生成指定153.475秒、応答に153.948秒を要し、`finish_reason=length` でJSONが途切れた。第1〜5項目は閉じたが、第6項目の途中で終わり、関係線の生成には進まなかった。照明の図・全文は未生成。

照明が選んだ72引用は番号1〜40と47〜78に集中し、18場面がそれぞれ根拠数の上限4件まで埋まった。本文の68箇所は、選んだ原文と同じ一文を出す条件になった。実際に受け取った4,873文字を固定したまま、残りを短い許容値で閉じるCPU例では、本文段階だけで3,248トークンを要し、予約3,141を107上回った。これは一つの補完例で、すべての有効な応答に必要な最小長の測定ではない。実際の停止は出力2,322トークンで、通信時間は指定時間枠に達している。

完成した読書会の3段階の実要求・生応答を通常APIのコードで再生し、隔離SQLに保存した。公開図・全文・非公開の根拠を同じ保存IDから別プロセスで再読できた。再読はHTTP 200、モデル呼出しとSQL書込みは0回。未認証の読取りはHTTP 401、別所有者のSQLは42501だった。不完全な照明や未実行3件は保存していない。

二者が完成した読書会の原文・生応答・図・全文を照合し、ともに不適合と判断した。照明と未実行3件は完成品としての意味判定を行えなかった。5件適合という条件は成立せず、B41の起動、全12記録と統合の実生成、本番DBへの書込み・API／workerへの反映はいずれも0回。通常API・workerはともに24bc228d、Supabaseのmigrationは38件、最新は20261115011424。

次は、独立した行動・結果・未確認を拾いながら、同じ場面の詳細を多数選んで本文の生成枠を使い切る問題を扱う。読書会の未開催と椅子の状態を同時に残せるか、照明の二つの制作場面を実際の図と全文まで届けられるかを確認する。全5入力の意味適合、全12記録の実生成・同一原本の通常保存と別プロセス再読・通常反映は未完。

<a id="analysis-fact-reference-candidate-20261119"></a>
## 9.154 選択した原文の番号表記と、長い関係要求の保存・再読（2026-11-19）

A41の実4B結果は§9.153で確定した。今回の開発候補は、先の計画が選んだ原文を本文生成で繰り返す負担と、次の関係要求の大きさをCPUで検証した。新しい実4B生成・追加学習・本番反映はいずれも0回。

A41で完成した読書会の本文を同じ内容のまま表すと611から459トークンになり、全11片を原文に戻せた。照明の途中までの本文に合成した末尾を付けた比較では3,199から2,112トークンになり、68の番号と4つの自由記述から同じ本文を復元した。異なる欄・要求の番号、真偽値、自由欄の番号だけの値を拒否した。

A41の照明は9項目・18単位・72引用の計画を生成し、本文の6項目目で時間を使い切った。CPUで本文を完結させて初めて、次の関係を作る要求の重複が観測できた。照明の実計画にCPUで本文を構成した例では59,853バイト、実際の応答の冒頭を残して末尾を補った例では63,051バイトとなり、A41実行版5883c0b1と開発版d47124bcの通常APIコードで全体・葉の各段階に適用される49,152バイトを超えた。

上限を超える関係要求の重複を減らしたCPU例では、それぞれ42,555バイト・45,753バイトに収まった。窓際で一時間描いた文と、購入後の照明で三十分描いた文を含む全72引用を元の文に展開した。公開図・全文・非公開の根拠を隔離SQLへ保存し、別プロセスで同じIDから再読できた。再読はHTTP 200、モデル呼出しとSQL書込みは0回。上限に収まっていた要求は従来の表現を維持する。

読書会では、二日分の出来事に翌日の予約だけを題として使い、初日の下書き・会場への問い合わせ非関与を翌日の説明に混ぜた。二日の状態を扱う見出しの候補と、根拠番号の並びに依存する選択の診断を別途CPUで試した。QA担当が試験用に選んだ15箇所では入力欄内の候補順を反転すると15箇所の番号が変わり、同じ欄に一つだけある原文短句からは15箇所すべてを元の文に結び直せた。見出しと根拠選択の変更は次の検討に残した。実4Bによる選択の改善は未評価。

わたしマップは全プラン共通で、本人の全期間の対象記録と適格な補足を使う。月次の閲覧範囲はFreeが直近2回、Plusが12回、Premiumが全期間。別のCPU対照では、1件1文の201件をv11・v12とも15葉・45段階で保持した後、統合PLANの要求が190,750バイトとなり、統合段階の既定上限131,072バイトを超えて停止した。12記録の実生成・保存に関する採用判定は別に残る。

後続コミットと同じツリーを独立に検査し、分析1,160件・11,871サブテストとPiece 666件が成功した。通常の合成2系列では54段階ずつ、全108段階の要求と生応答が親コミットと一致し、A41実行版の5段階を再生し、読書会の完成と照明の途中終了が元の応答に一致した。上限の直前と上限ちょうどでは同じ要求を渡し、削減しても49,371バイト残る合成例では関係要求を送る前に停止した。

開発PR #3には本文の原文参照（`d47124bcef865d3aec6351a0e661fb27fb15adbf`）と関係要求の重複削減（`1c1ea5619ec01f87ab74b9e876c2af0d9c838ccd`）を順に記録した。各コミットのAnalysis・Piece両CIが成功した。A41の7応答・意味判定、通常用120uの復元、B41の判定は§9.153を参照。

次は、読書会は翌週の予定でまだ開かれておらず、椅子の数を共同担当者が問い合わせたかは未確認という二つの状態を計画段階で拾い、初日の下書きと翌日の予約を図と全文で区別する。照明は独立した二つの制作場面を残し、同じ場面の過剰な引用選択も抑えられるかを確かめる。全5入力の実4Bによる意味適合、全12記録と統合の実生成、同一原本の通常保存・別プロセス再読・通常反映は未完。

[d47124bc](https://github.com/MassyuRed/mashos-api/commit/d47124bcef865d3aec6351a0e661fb27fb15adbf) [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44433552540) [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44433552470) [1c1ea561](https://github.com/MassyuRed/mashos-api/commit/1c1ea5619ec01f87ab74b9e876c2af0d9c838ccd) [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44434558268) [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44434558272)

<a id="analysis-a42-candidate-scope-20261119"></a>
## 9.155 原文短句の選択と別記録の見出し、A42・条件付きB42の凍結（2026-11-19）

**11/19・分析MAPの開発版v13で、根拠を原文の短句から選ぶ仕組みと、異なる日の出来事を含む項目の見出しを改めました。** 5入力のA42と、全件で二者が意味適合を確認した場合の12記録のB42の条件を凍結しました。実4Bの最新結果は§9.153のA41です。A42・B42は承認前で、実行と通常反映は未着手です。

分析MAPの開発枝（d65272c85542722abf432ae36e07e86cc4779b78）で、計画が選ぶ本文の根拠を同じ入力欄で一意な原文短句に結び付けた。短句は原文を復元するための値で、根拠の採否は作者が選ぶ。本文生成は以前の短縮表記を引き継ぎ、表に出す図・全文は元の文に展開する。本人補足と訂正を含むCPU例も確認した。

読書会の実A41では初日の下書きと翌日の予約を同じ項目に置き、翌日の予約だけを見出しに引用した。v13は複数記録の各単位に記録日時を添え、片方だけの引用題を項目・概要の両方で拒否する。CPUで作った二日にまたがる見出しは受理し、11月13日と14日の元の本文を図・全文から追えた。A41の計画が拾わなかった椅子の問い合わせと翌週の未開催を実4Bが新たに選ぶかは未確認。

QA担当が5入力から試験用に選んだ57箇所は、各欄内の候補順を反転しても同じ短句から元の根拠に戻った。5件の試験用の計画・本文・関係を通し、選んだ根拠を公開の図と全文まで追い、同じ根を与えたv12・v13で全5件の公開図の項目と全文が一致した。実A41がもともと選んでいたのは読書会8／10、照明9／11で、他の3件は実A41で未生成。旧A41の照明の計画を維持した対照では9項目・72引用がそのまま有効で、冒頭にCPUで末尾を補った本文を使うと、三段階の合計は3,493〜3,768トークンだった。A41で観測した速度を当てはめた照明の所要時間は約239〜257秒で、1件の220秒を上回る。バイト数とトークン数が枠内でも、同じ72引用を選んで時間内に完成するかは未確認。

合成2系列は各54段階（5入力15、12葉36、統合3）。実tokenizerで入力と残り出力予約の最大は通常例30,493、留保を多く含む例31,799／32,768。3段階の出力の最大はそれぞれ1,696、3,233／4,096。関係の24候補をすべて未確認としたCPU例でも、合計3,587／4,096トークンだった。旧v12の同じ2系列は全108段階の要求・生応答・トークンが従来と一致し、旧版で取得したA40の15段階とA41の5段階も元の結果を再現した。確定ソースの独立回帰は分析1,175件と11,871サブテスト、Piece 666件が成功した。先端のAnalysis・Piece両CIも成功した。

凍結後、架空の応答を通常APIのコードで再生した。Aの5入力・15段階では5件を隔離SQLに保存し、別プロセスで同じIDから5件とも再読した。Bの全12記録・統合1件では39段階を再生して1件を保存し、同じIDの図・全文・根拠を別プロセスで再読できた。再読時のモデル呼出し・SQL書込みは0回。Bの再読はHTTP 200、未認証は401、他所有者のSQLは42501。各原文欄と記録時刻をJSTの表示に照合し、日付を削った表示、二者の審査様式の改変など6例を拒否した。これらの合成応答から意味適合の承認記録は発行していない。

承認対象の送付6ファイルは展開後3,225,096バイト（ZIP 2,751,022バイト、SHA-256 `7ffccaa7bbb57cd5d54ae52328de188d3354fc172b4f60cc13d6331301a4a2b2`）。同PodにあるA41の4ファイル102,610バイトをコピーする。スコープSHA-256は `77a11f6b28ef233dc1394e4144ef88fec724797d31dd39df0b9850ecca7bf684`。承認前の送付・GPU・追加学習・再試行は各0回。

通常用の復元と取得の正本へ遡って28ファイルの改変を拒否し、A41の7応答・途中終了との継続38条件、B42の二者確認を含む22条件と復元期限の境界3例をCPUで検査した。単発実行は子プロセスで6正例・22負例、復元時のsignal設定も3条件で確認した。凍結したnativeは全17のPLAN要求を読めた。同一Pod `dqmg1qgolenq7v`、A41で復元した通常用120u（PID 12802、開始tick 9920128）を基準とする。A42は5入力・最大19応答・復元込み30分、条件付きB42は12記録と統合1件・最大43応答・復元込み17分。各試験は1回。B42にはA42の二者による全5件適合の記録が必要で、自動開始しない。

稼働中の通常API・workerは24bc228dbf54abc983906323c0ae7d937fae1fd6、SupabaseはACTIVE_HEALTHY、適用済みmigrationは38件（末尾20261115011424）。今回の本番書込み・通常配置は0回。全期間の長い履歴の統合要求が上限を超える既存境界は§9.154を参照。

次はA42の実行判断です。承認後、同一Podで5入力の根拠選択・時点・図・全文を実4Bで一度評価し、通常用120uを復元する。全5件の原文・生応答・図・全文が二者とも適合した場合に限り、別枠のB42で全12記録と統合の実生成を扱う。同じ原本の通常経路での保存・別プロセス再読、通常反映までが残る。

[開発コミット](https://github.com/MassyuRed/mashos-api/commit/d65272c85542722abf432ae36e07e86cc4779b78) [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44439769378) [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44439769406)

<a id="analysis-a42-actual-result-20261119"></a>
## 9.156 A42実4Bの結果、意味判定と通常用120uの復元（11/19 JST）

**11/19・分析MAPの実4B試験A42は、読書会と照明の図・全文を生成し、修理の本文で終了しました。** 完成した2件は通常APIのコードを通して隔離SQLに保存し、別プロセスで同じIDから再読できました。両者とも原文にある重要な出来事や留保が抜け、二者の判定は2件とも不適合です。残り2件と条件付きB42は未実行。通常用120uは復元済みで、候補の通常採用は0件です。

§9.155で凍結した開発版v13（d65272c85542722abf432ae36e07e86cc4779b78）を同一Podで1回実行した。開始対照はEmlisの明示訂正と分析IFの二候補の2応答で、技術本文は基準と一致。MAPは読書会3段階、照明3段階、修理2段階の8応答で、すべてHTTP 200、finish_reason は stop。受領総数は10応答。修理の本文の受入れが停止した時点で後続を終了し、追加学習・再試行は0回だった。

読書会では初日の下書き・未送信と翌日の予約連絡・案内送信を2項目に分けた。一方、共同担当者が椅子の数を問い合わせたか未確認であることと、翌週の会がまだ開かれていないことは、計画の根拠にも公開図・全文にも出てこない。概要の見出しには翌日の予約だけが現れ、原文にない閉じ波括弧が50個残った。主担当・独立担当ともに不適合と判定した。

照明は8項目・19回の引用（異なる根拠18）で、計画・本文・関係をそれぞれ36.933秒・79.819秒・24.706秒で生成した。A41は9項目・異なる根拠72で本文が時間切れだったが、A42では図・全文まで完成した。一方、A41の計画が選んだ「窓際で約一時間描けた」「新しい照明で約三十分描いた」はA42の計画から落ちた。別日の作業の難しさと保証書をしまった出来事が一つの単位に並び、概要で昼の明るさを夜の細い線にも広げた。次回も同じ手順にするか未定という留保も崩れ、二者とも不適合と判定した。

修理は店の完了連絡を選択したが、本人がまだ受け取らず動作確認もしていないことを、生成した意味欄が実施済みのように書いた。NODESの生JSONは完結したが、n1.u2.e3 の自由本文に返った値は `}},` だった。2文を含む根拠で、この欄は自由記述を受け取る。CMEEが原文にない直列化記号として拒否した（analysis_semantic_authored_serialization_residue）。修理の関係・図・全文は未取得。応募取消と10記録は呼出し前に終了したため、いずれも意味は未評価。

完成した2件は、実3段階ずつの要求が通常APIのコードで作り直したバイト列と一致した。元の応答を使い、本文の整数参照31箇所（読書会12、照明19）を展開して隔離SQLに各1件保存。別プロセスで保存時と同じIDを再読し、2件ともHTTP 200、図・全文・収録範囲・非公開根拠を照合した。再読時の生成・SQL書込みは各0回。未認証は401、別所有者はSQLSTATE 42501だった。公開投影が参照する内部IDは保存時に新たに発行された。

通常用120uの復元まで426.487秒。元のシグナル設定と試験ポートの閉鎖を照合し、復元後はPID 15498・開始tick 10510051、HTTP 200。候補の通常採用、B42の起動、本番への書込み・デプロイは各0。11/19 11:24 JSTの管理面で通常APIとworkerは24bc228dbf54abc983906323c0ae7d937fae1fd6がlive、SupabaseはACTIVE_HEALTHY・migration 38件（末尾20261115011424）。

実際のPLANに対する別のCPU照合では、元の全選択を保ったまま、読書会に椅子の問い合わせと未開催を加えた3項目、照明に二度の制作を加えた10項目がnativeとCMEEを通り、元の文に戻った。これら4箇所は根拠候補に含まれていた。次の比較では同じ1回の計画と時間・トークン枠で、記録ごとに出来事と留保を先に選び、同じ出来事と確認できたものだけをまとめる案を、条件が違う反復・複数記録の裏付け・未確認と未実施・無関係な場面を含む別入力で調べる。CPUの追加選択は今回の実生成数には含まない。

受領原本 `A42-results.zip` は114,701バイト、SHA-256 `fc2bcd64b081aaf8b8cb42d95b4de6a61792f2dc0e375df66f273b6e2869fbfb`。元の凍結スコープ `77a11f6b28ef233dc1394e4144ef88fec724797d31dd39df0b9850ecca7bf684`、判定・再読の対象結果 `a05182f865f02c58bb2769ef84aab1177ee4166a5eceb5db5bc5fff5a406fdeb`。二者が同じ結果・入力5件を照合した。全件適合を要するB42の起動条件は成立しなかった。

次は、読書会の未開催と椅子の問い合わせ状況、照明の二度の制作と作業条件を根拠選択から図・全文まで追い、別日の出来事を混同する見出し・本文、修理の記号だけの本文値と未実施の受け取りの表現を開発側で検査する。後続の実4Bで全5件を二者が適合と判断した場合に、全12記録と統合の実生成、同じ原本の通常経路での保存・別プロセス再読、通常反映へ進む。

<a id="analysis-post-a42-admission-20261119"></a>
## 9.157 開発版v14の原文にない記号の拒否と記録日時の表示（11/19 JST）

**11/19・分析MAPの開発版v14で、根拠のない閉じ括弧を抑え、同じ項目に入った別記録の本文に出典日時を表示するようにしました。** A42の原本を使ったCPU再生と開発枝のCIで確認しました。実4Bの最新結果は§9.156のA42で、v14の実生成・通常採用は0件です。

分析MAPの開発枝 `e934b14629d0959cd9af42bf72df635a146a5204`（tree `228cd91eed159cd010e01e8316ed7c52509eb9fc`）にv14を追加した。A42で実際に使ったv13は `d65272c85542722abf432ae36e07e86cc4779b78` に固定している。v14の確認は実応答のCPU再生と合成の比較で行った。

読書会の概要見出しに付いた50個の閉じ波括弧と、修理の自由本文に返った `}},` を、対応する開き括弧がなく選択した原文にもない書式記号として、nativeの生成制約とCMEEの受入れで退ける。元の選択根拠に実際に書かれた記号や、対応する開き括弧がある正当な表記は専用の対照で受け入れた。修理の根拠は2文を含むので、引き続き自由本文を扱う。実際に別の自然な文を生成するかは未検証。

照明の実A42では、8項目中7項目が10月10日と25日の記録を同じ単位に置いていた。v14は、別記録から得た個々の本文片と原文の対応を一意にたどれるとき、その記録の日時を図・全文に表示する。同じ19箇所の根拠を使ったCPU再生で、該当7項目に両日が現れ、単一記録の項目を維持した。付した日は元の記録日時であり、本文に出る行動の実行日を推定しない。自由にまとめた文、同一の出来事を裏付ける文、日付を帰属できない補足・訂正には機械的に別記録の日付を付さない。

旧v13の同じ2系列は、5入力・12葉・統合を実APIのコードで通し、合計108段階の要求、生応答、トークン数などがA42実行前の記録と一致した。実A42の8段階も同じ版で再現し、完成2件の図・全文・非公開根拠、修理の拒否理由、未実行2件を原本に照合した。

v14のCPU合成試験は通常例と留保が多い例の各54段階（全5入力15、12葉36、統合3）。入力と残り出力予約の最大は順に30,497、31,789／32,768、三段階の出力の最大は1,696、3,243／4,096。留保24候補すべてをOPENとして原文を添えた例は3,597／4,096。A42で保存したSQLの2件は開発版から同じIDで別プロセス再読でき、いずれもHTTP 200、再読モデル呼出し・SQL書込み0だった。

確定した開発ソースで分析1,216件と11,871サブテスト、Piece 666件が成功。共通推論サーバーとEmlisに関わる7ファイルの336件も成功した。先端の両CIも成功した（Analysis #44446605015, Piece #44446605050）。新規の専用2ファイルは38件の回帰を含む。

A42の照明の生応答をv14の新規保存にも使用した。PLANとNODESはそれぞれ参照先を表すハッシュ1箇所を新しい要求に合わせ、RELATIONSは元の文字列をそのまま使った。19箇所の根拠を引き継ぎ、隔離SQLに1件を保存。別プロセスでそのIDを再読して、7項目に10月10日・25日を表示し、図・全文・内部根拠が保存時と一致した。再読時の実モデル呼出しと書込みは0回。

公開したv14とは別に、次の選択規則の比較案をCPUで試した。実3件の通常PLANの説明を1段落だけ差し替えると、どれも入力が375トークン短く、出力予約4,096は同じ。独立検証担当が用意した4例で原文の配置を各2通りに変えても、選んだ根拠を復元できた。この指示案は開発コミットに未統合。実モデルの自発的選択と長い履歴での効果は未評価。

実4Bが取得しなかった根拠の選び方はこの修正の対象外。読書会の椅子の問い合わせと未開催、照明の実制作2件は、実際のPLAN要求の中に既に候補があった（§9.156）。照明の概要で昼の明るさを夜にも広げたこと、選んだ行動を他の日の条件と混同したこと、修理で未実施の受取・確認を完了時点として扱ったことも、新たな実出力での確認が必要。A42の2件不適合・修理未完・残2件未生成、B42未実行という結果は§9.156で確定している。

次は、1回の計画と現行の時間・トークン枠で、元の記録ごとに出来事・行動・留保を選び、同じ出来事と確かめた場合だけをまとめる案を比較する。読書会の未開催と椅子の問い合わせ状況、照明の二度の制作、同条件と別条件の反復・裏付け・未実施を扱う。修理の本人受取と動作確認の時点、全体の見出しも課題として残る。後続の実4Bで全5件の完成品を二者が適合と確認した場合に、全12記録と統合の実生成、通常経路での保存・別プロセス再読、通常反映へ進む。

<a id="analysis-a43-record-first-plan-20261119"></a>
## 9.158 記録ごとに行動・実施状況を読む計画指示とA43・条件付きB43（2026-11-19）

**11/19・分析MAPの開発版v15に、各記録で実行・未実施・未確認を確かめてから根拠をまとめる指示を組み込みました。** A43の5入力と、二者が全件の意味を確認した場合に進むB43の12記録を凍結しました。実4Bでの効果と通常反映は未確認です。

開発枝 `2627fa37ff6918832f565def5f94e89cd5d5e67c`（tree `75fb6590482e2d5d70cc8551056e7df481918a2f`）のv15は通常MAPの計画段階で、各記録の思考欄と行動欄を読み、誰が何をしたか、見送ったか、何をまだ知らないかを確認した後に根拠を選ぶ。条件が違う試行と、後の記録に裏付けがある一回の出来事を分ける。根拠を選ぶのは4Bで、CMEEは選択された短句を原文へ戻す。履歴の分割・統合には従来の計画指示を使う。v14で導入した記号の制約と出典日時の表示はv15に引き継いだ。

A42で実際に呼び出した3件のPLAN要求を復元し、v14とv15で入力を測定した。読書会・照明・修理の順に、3,425→3,057、6,195→5,814、3,280→2,910トークン。各件の出力予約は4,096。読書会の椅子の問い合わせと未開催、照明の窓際と新しい照明の二度の制作を、試験担当が元の計画に加えた例は原文に復元できた。

条件を変えた反復、同じ一回の出来事の裏付け、未実施と不明、別日の無関係な場面、他者の実行と本人の未受取、記録日と実行日が異なる例の6件を、文の配置を変えた各2通りで確認した。12通りはいずれも担当が選んだ根拠を元の主体・単位で復元した。これらはCPUで出力形式と帰属を照合した結果で、4Bが自分で何を拾うかはA43で評価する。

A42の生応答8段階を当時のv13で再現し、図と全文の完成2件、修理の拒否1件、その後の未実行2件を確認。保存済みの読書会と照明は、開発版から別プロセスで元のIDを再読してHTTP 200。図・全文・収録範囲・非公開根拠が一致し、モデル呼出し・書込みは0回だった。A42はv13で実行しており、次の実出力との違いにはv14の記号制約と日時表示も含まれる。

修理でA42の計画は、本人が受け取っておらず、動作も確認していない原文をすでに選んでいた。v15に合わせて参照先を照合し、記号だけの本文欄をその選択済み原文に直したCPU例では、別欄にある「実際に受け取り・動作確認した時点」という元の誤った意味文が生成制約とCMEEの両方を通った。正しい根拠を選んでも、そこから作る説明が実施状況を反転させる場合がある。A43では修理の根拠に加えて、図・全文が未受取・未確認を保つかを二者が読む。

通常例と留保を多く含む例は各54段階（5入力の15段階、12記録の36段階、統合3段階）。v15の入力＋出力予約の最大は通常例30,503、留保多数31,778／32,768。三段階合計の出力は最大1,700、3,251／4,096。留保24候補をすべて未確認とした合成例は3,605／4,096。旧v14の2系列・108段階は前回保存した要求・応答と一致した。旧v13でも2系列の全108段階の要求・応答ハッシュとトークン数が一致した。

前回v14の隔離DBに新規保存した照明1件もv15で再読した。同じIDから保存時の図・全文・非公開根拠を再取得し、別記録の引用がある7項目で10月10日と25日の出典日時を保持した。新しい生成と書込みは0回。

確定ソースの回帰は分析1,220件と11,871サブテスト、Piece 666件、共有推論・Emlis関連336件を確認した。並列実行で隔離DBの起動に失敗した分析5件・Piece 1件は個別の再実行で通過。共有推論・Emlisの初回と並列再実行は途中終了し、同じ7ファイルを最後に逐次実行した。記録別PLANと既存モデル選択の専用試験は33件。

凍結したv15の通常APIコードに架空の生応答を与えた。A43の5入力は15段階を再生し、5件を隔離DBに保存して別プロセスから同じIDで再読した。B43の12記録＋統合は39段階を再生し、統合結果1件を保存。再読はHTTP 200で、図・全文・非公開根拠が一致した。再読時のモデル呼出し・SQL書込みは0回。実4BによるA43の合否やB43の起動条件はこの合成試験では判定していない。

11/19 JSTの管理面確認では、通常APIとworkerはともに `24bc228dbf54abc983906323c0ae7d937fae1fd6` がLiveで、自動配置は無効。デプロイIDはAPI `dep-dbsgn8t6e07s739qfk50`、worker `dep-dbsgnet6e07s739qg5a0`。SupabaseはACTIVE_HEALTHYであり、今回の本番書込み・配置は0。現行の通常提供は120u。開発版の隔離経路では、通常設定でMAPをv15にすると、IFは120uを選ぶ。現行本番のAPI・workerはv15の指定に対応していない。実出力が適合した後、GPUの通常提供、APIとworkerの互換版配置・モデル選択、通常経路での保存・非生成再読を確認する。

開発コミットのAnalysisとPieceのCIが成功した。Piece #44450147729、Analysis #44450147682。

承認対象は同じPod `dqmg1qgolenq7v` への6ファイル 3,220,498バイト（ZIP 2,752,818バイト、SHA-256 `4b1f5c59f1258148735caaf39696571cd22aecdfc6bf9d9161c94ade24e75223`）。送付済み4ファイル 102,610バイトをPod内でコピーする。スコープ SHA-256 `9db8227e6c4220796b25b24751b969dd54b6ef10ab94f9f587dd3dfa9c798573`。A43は5入力・最大19応答・復元込み30分。B43は12記録＋統合1件・最大43応答・復元込み17分で、A43の原文・生応答・図・全文を二者が全5件適合と判定した場合にだけ実行する。B43の開始に使う二者の判定ファイルは4,096バイト以内。どちらも1回、追加学習・再試行0回。

A43の一回分を承認後、同じ5入力で実4Bが選んだ根拠、図、全文を原文と突き合わせる。全5件を主担当・独立担当が適合と判定した場合にB43で12記録と統合結果を検証する。同じ生応答の通常経路での保存、別プロセス再読と通常反映までが残る。

<a id="analysis-a43-actual-result-20261119"></a>
## 9.159 A43の実4B生成・本人原文との意味照合・通常用120uの復元（11/19 JST）

**11/19・実4B試験A43は5入力すべてで図と全文を生成し、隔離DBに保存して別プロセスで再読しました。** 主担当と独立担当は5件すべてを不適合と判定しました。条件付きB43は未実行で、v15の通常採用は0件です。

§9.158の開発版v15（`2627fa37ff6918832f565def5f94e89cd5d5e67c`）を同じPodで1回実行した。受領した分析MAPの段階は15、基準の技術本文が一致した対照は4。分析15段階はすべてHTTP 200、終了理由はstop。実4Bの呼出しは合計19回。追加学習・再試行は各0回。

読書会は、初日の下書き・未送信と、翌日に一階の予約を知って案内を送ったことを区別した。椅子の数を共同担当者が問い合わせたか不明であることと、翌週の会がまだ開かれていないことはA42に続いて計画から抜けた。概要は予約の連絡だけを取り上げ、「来た。、」という不自然な句読点が残った。

照明は、A42で拾えなかった購入後の約30分の下書きを今回の計画が選んだ。初日に窓際で約1時間描いたことは今回も欠落。選んだ原文に対応する15か所の本文片がいずれも半角コンマ1文字になり、図と全文では実際に行った制作を読めなかった。

修理は、店から完了連絡を受けたことと、本人がまだ受け取らず動作確認もしていないことを今回は区別し、図と全文まで生成した。最初の項目に内部書式 `/></fact_parts` が出て、11月12日に届いた完了連絡を、まだ連絡を受けていなかった11月8日にも帰属させる概要になった。

応募取消は、海辺の写真だけを応募したこと、取下げ完了、今回は再応募しないことを本文で保った。原文には「友人にも取消をまだ伝えていない」と明記されているが、関係を作る段階で未確認に分類し、全文は「まだ記録にないこと」と表示した。概要も現在の取下げ完了に達していない。

10記録の分析では、友人と会えなかった記録と、恋人と食事をした際に相談しなかった別の記録を一つの意味にまとめた。机を片付け棚を残した行動が抜け、図と全文の2か所に内部書式 `/></node_kind` が出た。

実応答を通常APIのコードで隔離SQLへ保存した5件は、別プロセスで同じIDから再読して図・全文・非公開根拠が一致した。保存時に発行される成果物IDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読み出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで701.389秒。復元時のPIDは18630、開始tickは11054243。元のシグナル設定と試験用ポートの閉鎖を照合した。

受領原本 `A43-results.zip` は189,876バイト、SHA-256 `cc7354cd1e5ab06b5acf107232b4aecec58f6745d0f88348fd078b401994b632`。凍結スコープ `9db8227e6c4220796b25b24751b969dd54b6ef10ab94f9f587dd3dfa9c798573`、二者の判定対象結果 `70ac20c8dbcfb1f5c97b6e5a2f566e28bc10db29c0a2ed3666957a863ca631aa`。

今回の19回はA43の実出力と前後対照で消費した一回分。B43は5件すべてを二者が適合とする開始条件が成立せず、起動0回。元の12記録の実4Bによる分割・統合、同じ実原本の保存・再読と通常反映は未完。

A43の受領原本で、計画が選ばなかった出来事、選んだのに本文へ届かなかった出来事、明記された未実施を不明に変えた留保を区別して直す。図と全文に出た記号だけの値や内部書式、別の記録を同一の人物・出来事としてまとめる見出しも対象とする。新しい実出力を5件とも二者が適合と判定した後に、12記録と統合を実生成し、同じ原本の保存・別プロセス再読と通常反映へ進む。

<a id="analysis-post-a43-body-and-heading-20261119"></a>
## 9.160 分析MAP開発版v16の本文と見出しの検証（11/19 JST）

**11/19・分析MAPの開発版v16で、A43の照明に出たコンマだけの本文と、修理に出た内部書式を生成・受入れの両方で拒否できることを確認しました。** 受け取ったA43の原本によるCPU再生です。v16の実4B生成・通常採用は0件です。

開発枝 `fe6c63a6daa535ae0387089201066aad90dea5d6`（tree `09ad5b262310d64c1b1370c3fcf6e5e0d75c69c1`）のv16では、計画が選んだ原文に複数の文がある場合、全文または範囲内の完全な一文を本文に指定できる。自由に書いた本文片は、原文にないタグの断片や内容を示さない記号だけでは受け入れない。これらの確認は計画済みの根拠に対する本文の作り方を扱う。

実A43の照明の15か所に出た半角コンマと、修理の1か所に出た `/></fact_parts` を、元の各欄で独立に注入し、nativeの生成制約とCMEEの受入れがいずれも拒否した。照明の15欄のうち12欄で、割り当てた元の文を選択できた。残る3欄は試験担当が根拠内の自然文を用意した。修理の2文を含む根拠でも、その全文を選ぶCPU例が通った。これらを4Bが新たに選んだ実績には数えない。

10記録の実A43で2か所に出た `/></node_kind` も、他方の欄の影響を除いて個別に照合し、v16の生成制約とCMEEの両方で拒否した。同じ2欄に割り当てた原文を参照するCPU例は両方通った。友人と恋人を混同した出来事のまとめ方はこの試験で修正していない。

読書会のA43の概要は、初日・翌日の両項目を参照しながら、翌日の項目の見出しに読点を足しただけだった。v15はこの値を受け入れた。v16で同じ概要を生成制約・CMEEへ渡すと、どちらも拒否した。両日の関係を表す試験用の概要と、1件の記録のみを対象にその見出しを用いる対照は通過した。

修理のA43では、11月12日にだけ記録された店からの完了連絡を、11月8日と12日の両方に帰属させる概要が表示された。保存原本からの再投影で、v16は11月12日の完了連絡と本人の未受取を同日の文に、11月8日の弟の修理未依頼を8日の文に表示した。図の項目はこの比較で一致した。これはA43の原本を使う表示の比較で、v16が新たに出来事の時点を判定した例ではない。

5入力・12記録・統合のCPU再生は通常／留保多数で各54段階。v16の入力＋残り出力予約の最大は30,527／31,813トークン（上限32,768）。三段階合計の出力最大は1,705／3,245（上限4,096）、24候補をすべて未確認とした例は3,599。旧v15の要求・応答は108段階すべて当時の記録と一致した。A42の保存済み2件とA43の5件をv16から同じIDで別プロセス再読し、図・全文・収録範囲・非公開根拠の一致、HTTP 200、生成とSQL書込み0を確認した。

v16用のCPU例2件も通常APIのコードで新規に隔離SQLへ保存した。元のA43の計画を使い、本文は試験担当が選択・記述し、関係の参照ハッシュを対応する本文に合わせた。照明では約30分描いた文、修理では預けた電話と部品取り寄せの2文が保存された。それぞれ別プロセスで同じIDへアクセスし、図・全文・非公開根拠・三段階の生応答が保存時と一致した。再読HTTP 200、モデル呼出し・書込みは0。

確定ソースで分析1,256件と11,871サブテスト、Piece 666件、Emlis・共有推論336件が通過した。本文・見出しに関わる専用試験は67件。

11/19のRender再読では、通常APIとworkerは11/15に手動配置した `24bc228dbf54abc983906323c0ae7d937fae1fd6` がともにLive。実A43のv15・開発版v16とも通常配置は0件。

API開発コミットのCIでAnalysis・Pieceともに成功した（Analysis #44456469313、Piece #44456469297）。

応募取消で「友人にも取消をまだ伝えていない」が「まだ記録にないこと」となった経路をA43の生応答で追跡した。計画と本文片は未連絡を保持していたが、本文段階がこれを未確認候補にも加え、次の関係段階でOPENを選んだ。既存のSTATEDは明記された非行動を扱える。図・全文は実際に選ばれたOPENを表示しており、この例の未確認は表示する前に加わった。

実A43と同じPLAN要求3件で、元の全引用を残して不足した根拠を含めた合成の計画を作った。読書会の椅子の問い合わせと未開催は3項目・14引用、照明の窓際での約1時間は3項目・16引用、10記録の異なる人間関係と机を片付けた場面は10項目・41引用で表現できた。出力は順に337、718、848トークンで、元の上限（12項目、項目ごとに2単位、単位ごとに4引用）内にあり、3件とも生成制約とCMEEを通過した。ここで確かめたのは計画へ収められること。実4Bによる根拠選択や後段の処理時間・説明の妥当性は別途実出力で確認する。

第15版引き継ぎにあるA42・A43の計画比較表は、診断スクリプトが単位名を上書きし、試験名欄に最後の項目名を入れていた。A42欄の `n8.u1` を `A42`、A43欄の `n2.u2` を `A43` に訂正した。比較表のその他のキー・値は両版で一致し、両試験名を元ZIP内の結果と照合した。修正版は引き継ぎの同じファイル名に収録する。

A43の根拠と出力で残った内容を引き継ぐ。読書会の椅子の問い合わせ状況と未開催、照明の窓際での約1時間、本人が記した未実施と未確認の区別、10記録での人物・出来事の切り分けを実際の生成文で確かめる。5件すべての意味が二者の照合を通った後に、全12記録の実生成・同じ原本の保存と別プロセス再読、通常反映へ進む。

<a id="analysis-a44-20261119"></a>
## 9.161 分析MAPの記録別の根拠と未実施の扱い、A44・条件付きB44（11/19 JST）

**11/19・分析MAPの開発版v17で、原記録ごとの先頭項目の根拠と、明記された未実施を未確認として表示する経路を検査しました。** A44の5入力と条件付きB44の12記録＋統合を凍結しました。凍結時点でv17の実4Bによる判定・通常反映は0件です。

API開発コミット `6a30f68d16ece0e854a8280fb253a05715600abf`（tree `7cc341e7b4f9609e43b260780c8bfb78b357eee4`）。通常MAPの1〜12記録で、各記録に使える原文があり、別枠が必要な出典を含めても12項目以内に収まる場合、先頭に原記録順の項目を一つずつ設ける。各先頭項目の最初の引用はその記録の原文、続く引用は同じ記録の欄に限る。記録順と出来事の時系列を区別する。本人訂正の参照先が一つでも、その訂正文を参照先の原文に数えない。後続の追加項目や項目間の関係・概要では、原文が裏付ける一回の出来事に異なる記録が関係しうる。13記録以上、または先頭の別枠が足りない場合は既存の割当を使う。履歴の分割・統合は既存の計画割当を使う。

実A43の5件で、当時のPLANの選択を変えず、候補の識別子と入出力の紐付けをv17に合わせて再生した。修理では別記録の根拠が先頭の記録別項目に混ざり、応募取消と10記録では必要な先頭項目が足りず、生成制約とCMEEが3件を拒否した。読書会と照明のPLANは双方を通過した。椅子の問い合わせ・未開催、窓際での約1時間が抜けたままでも通るため、原文との意味照合はA44の実出力で行う。全5件で、実際に選ばれた異なる根拠をすべて引き継ぎ、記録別に並べ替えた担当作成のPLANは両方を通過した。

読書会・照明・10記録では実A43で選ばれた根拠を重複も含めて全数保ち、不足した原文を担当が加えた。各例は14・16・41引用、3・3・10項目。短い本文と関係を試験用に指定すると、三段階で926・1,707・2,295トークンとなり、共通出力枠4,096内で生成制約・CMEEを通過した。

応募取消の生応答で、計画と本文に選ばれた二つの原文を個別に確認した。本人が取消を友人にまだ伝えていないと書いた行動欄と、同じ記録・同じ相手について取り下げの話をまだしていないと書いた思考欄は、未確認（OPEN）として残せない。原文に明記済み（STATED）とし、「友人の感想」のように実際に知らない内容を未確認として残す例は生成制約とCMEEを通る。記録の一部で一般的な否定語を検出しただけでは当人の未実施を決めない。読書会で参加者全員が読んだかどうか、第三者の文の転記、後文で自分の記憶を撤回する例はOPENを許した。

事例別に作った20通りの計画で、同時刻／異時刻の記録、記録間の裏付け、別の記録の主体の混入、12・13・24記録、訂正と補足の帰属を確認した。実A43の関係判定は、元の候補と判定を引き継ぎ、試験用の概要と空の関係を与えて判定箇所を分離した。読書会の「全員が読んだかは分からない」はOPENを保持し、応募取消の未連絡はOPENを拒否、同じ箇所をSTATEDとした例は受け入れた。

照明の試験用の追加項目で10月10日と25日の原文を併記し、個別の根拠にそれぞれの記録日が付くことを確認した。両記録にまたがる担当作成の本文には片方の日付を付けず、日付の取り違えも検出した。

同じ記録内の共通語で候補箇所を上位3件に絞る方法も、実A43の原文で比較した。椅子の問い合わせと新照明の約30分は候補に出たが、読書会の未開催と窓際の約1時間は出なかった。試験用の長文統合では索引だけで推計727トークン増えた。索引の比較はオフラインの検討結果として記録した。

元の5入力それぞれについて、担当が原文から計画・本文・関係を作成し、v16とv17の通常APIに同じ趣旨の応答を与えた。両版とも5件を隔離DBに保存し、別プロセスの同じIDから公開図・全文・非公開根拠・3段階の元応答を読み戻した。読書会の椅子の問い合わせ状況と未開催、窓際の約1時間と新照明の約30分、修理・受取・動作確認の区別、取消を友人へ伝えていないことと友人の感想が不明なこと、10記録の机・友人・恋人を含む。モデルの自発的な根拠選択はこの10保存件数に含まれない。

5入力、12記録の分割、統合を架空応答で再生した。通常／留保多数で各54段階（MAP 15、LEAF 36、MERGE 3）。入力と出力予約の和の最大は30,513／31,804トークン（上限32,768）。三段階合計の出力最大は1,694／3,242（上限4,096）。未確認候補24件をすべてOPENとした例は3,596。旧v16の要求・応答は通常／留保多数の108段階すべてで既存証跡と一致した。

A42で実生成した保存済み2件、A43の5件、v16で合成した保存済み2件を開発版から別プロセスで同じIDで読み、図・全文・収録範囲・非公開根拠の一致、HTTP 200、モデル呼出しとSQL書込み0を確認した。新しい凍結資材でも、架空応答を通常API経由で隔離DBへ保存し、A44相当5件（15段階）とB44相当の統合1件（12記録と統合の39段階）を別プロセスから同じIDで再読した。

確定ソースの専用・周辺79件、Analysis 1,297件と11,871サブテスト、Piece 666件、Emlis・共有推論336件が通過した。Emlisは7ファイルを別プロセスで検証した。

通常用RenderのAPI・workerはともに手動反映の `24bc228dbf54abc983906323c0ae7d937fae1fd6` でlive。SupabaseはACTIVE_HEALTHY、最新適用は `20261115011424`。この単位の通常用デプロイとDB書込みは0。

開発枝のGitHub CIではPiece #44461998650、Analysis #44461998647が成功した。

同一Pod `dqmg1qgolenq7v` への送付は6ファイル 3,233,276バイト。送付ZIPは2,759,819バイト、SHA-256 `867bec7927a19e44338b8e3106aae0d558276fdf03bd919a606cf06907632903`。同じPod内の既送付原本4ファイル 102,610バイトを再利用する。スコープ SHA-256 `5ebb7fe93e83469bd385250e66456398c266e58db43efbcc30a8ed274bb542b8`。A44は5入力、最大19応答、通常用への復元込み30分。B44は12記録と統合1件、最大43応答、復元込み17分。主担当と独立担当がA44の原文・生応答・図・全文を全5件適合と判定した場合にB44を1回実施できる。各試験は1回限りで、再試行・追加学習は0回。

A44の凍結スコープと実行許可の範囲を照合し、同じ5入力を実4Bで生成する。読書会の椅子の問い合わせ状況と未開催、照明の窓際での約1時間、記録された未実施と未確認、10記録の人物と出来事を原文・生応答・図・全文で二者が照合する。全5件が適合した場合にB44で12記録と統合結果を実生成し、同じ生応答の保存・別プロセス再読、通常反映へ進む。

<a id="analysis-a44-actual-result-20261119"></a>
## 9.162 分析MAPの実4B試験A44の結果、原文との照合と通常用への復元（11/19 JST）

**11/19・分析MAP開発版v17の実4B試験A44で、5件の図と全文を生成し、同じ実応答を隔離DBへ保存して別プロセスで再読しました。** 主担当・独立担当の意味判定はいずれも全5件で不適合でした。B44の実行と通常反映は0件です。

§9.161のAPI開発コミット `6a30f68d16ece0e854a8280fb253a05715600abf`（v17）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析の各段階で15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

5入力すべてでPLAN・NODES・RELATIONSの3段階がHTTP 200、終了理由stopとなり、公開図と全文が生成された。A43と同じ5入力を使用した。主担当と独立担当は、各入力の原文・3段階の生応答・図・全文を照合し、各人とも適合0件、不適合5件と判定した。

読書会は初日の下書き・未送信と翌日の送信・一人の返信、全員の既読は不明という区別を保った。PLANの12引用はA43と同じで、共同担当者が椅子の数を問い合わせたか本人は聞いていないこと、来週の会がまだ開かれていないことを選ばず、図と全文にも出なかった。二日を参照する見出しは翌日の二句を「来た。、案内」でつないだ。

照明の本文18片はすべて原文に対応した文となり、A43のコンマだけの本文は解消した。一方、PLANは二日とも思考欄だけを選び、窓際で約1時間描いたこと、新しい照明を設置・調整して約30分描いたこと、長期使用や作品の完成はまだ分からないことが図と全文から落ちた。後の約30分はA43のPLANでは選ばれていた。

修理は、店から12日に届いた修理完了の連絡と、本人は未受取・未動作確認であること、弟から店に相談を送ったか不明なことを区別した。自由に記述した2欄に内部の参照名と途中で切れた原文の複製が入り、図と全文に出た。8日時点の完了未確認が、12日の完了連絡後にも未確認として残り、翌日に受け取ると決めた原文は選ばれなかった。

応募取消は、候補二枚の選定、海辺の一枚の応募と受領、取下げと再応募しない意向を三項目に分けた。友人に取消をまだ伝えていないという本人の非行動を明記済み（STATED）にし、友人の感想だけを未確認（OPEN）とした点は改善した。三項目を参照した概要の説明には取消があるが、見出しと全文の冒頭は応募・受領で終わり、その後の取消が伝わらなかった。

10記録は10項目に分かれ、机を片付けて棚を残したこと、予定を変えた友人と会わなかったこと、恋人と夕食をとり相談はしなかったことを別々に示した。一方、行動欄には「古い日記を読んだ」、思考欄には「以前思い描いた暮らしと今の暮らしが違って」とある。生成した意味説明はこの二つを結び付け、想像した暮らしを「日記で知った過去の暮らし」に変えた。全体概要は机の片付け一件だけを参照し、友人・恋人の項目などには同じ行動の重複が残った。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで793.245秒。復元時のPIDは22499、開始tickは11703992。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A44-results.zip` は204,915バイト、SHA-256 `f525185ede859783ff40f2412b88634dba2e511d730623f162a3697f42e0bd08`。凍結スコープは `5ebb7fe93e83469bd385250e66456398c266e58db43efbcc30a8ed274bb542b8`、二者の判定に用いた結果本文は `88ffa1b23c5a886c87c2b20e038687d20d8c1b06fa28b0e61d8310b299dd9eec`。

今回の許可に基づくA44の実行は1回。B44の開始に必要な全5件の二者適合に達せず、B44は起動していない。12記録＋統合の新たな実4B出力、そちらの保存・再読、通常反映は未完。

A43の主担当票で読書会の椅子を「初日に尋ねた」と書いた箇所は、日付と行動の誤記だった。原文は翌11月14日に共同担当者が椅子の数を確認したいと話し、本人は問い合わせを送ったかどうかを聞いていない。A43の図と全文はこの問い合わせ状況と会の未開催を落としており、意味判定は不適合のまま。原判定票を保存し、この節に訂正を記録する。

A44実原本を基に、計画で抜けた具体的な行動や未確認・未開催の根拠、本文に混じる内部の参照名、後の連絡で解消された未確認、複数記録の見出し・意味説明の忠実さを検証する。次の実出力で原文・図・全文を二者が全5件適合と判断した場合に全12記録の実生成・統合と同じ原本での保存・別プロセス再読に進む。通常反映はその後に確認する。

<a id="analysis-post-a44-grounded-generation-20261119"></a>
## 9.163 分析MAP開発版v18の根拠選択・本文・見出しとA44原本の再生（11/19 JST）

**11/19・分析MAP開発版v18で、A44の原本を使い、行動欄と考えを対にする根拠選択、本文に漏れた内部参照、複数記録の見出し、本文の重複と過去の未確認の表示を検証しました。** A45の5入力と条件付きB45の12記録＋統合を凍結しました。凍結時点でv18の実4B生成・通常反映は0件です。

開発枝 `dc016ecdd9a75a5877f774cfc341967af38e9447`（tree `5319d3e4bbb93f912977255a7ea7522d13d424a2`）でA44の5入力の全15段階を旧v17として再生した後、要求の識別子と段階の紐付けをv18に合わせ、元の応答を順に与えた。読書会と照明はPLAN、修理はNODES、応募取消はRELATIONSで拒否。10記録は全段階を通過し、行動欄の「古い日記を読んだ」と思考欄の「以前思い描いた暮らしと今の暮らしが違って」を結び付けて、想像した暮らしを日記で知った過去の実生活に変える誤りと、机の1項目だけの概要が残った。4件で拒否したことを、新しい文章を正しく生成できた件数には数えない。

通常MAPの1〜12記録で、完全な本人原文の短い行動欄と長い思考欄が対になる場合、記録別の計画の先頭に行動の全文を含む根拠を求める。行動欄の全文を引用した場合は、補う根拠を同じ記録の思考欄から選ぶ。思考欄の一つの引用が行動全文を含む場合は、その一つでも表現できる。行動欄は160文字以内の1〜4文、思考欄は160文字を超え、単独で選べる異なる原文を含む場合を対象にした。本人訂正、出典の更新や競合、切り出された断片、履歴の分割・統合など、出典の条件が異なる場合は既存の割当を使う。

全対象記録の行動全文と最短の追加思考根拠のUTF-8量を見積もり、合計1,024バイト以内に収まる場合だけこの組合せを要求する。12記録で文字のトークン消費が大きい例では、強制するとPLANだけで7,280トークンになった。既存の割当に戻すと502トークンで適格な計画になり、短い別の12記録では全12組を含む669トークンの計画が成立した。

読書会の既存PLANに短い行動欄の全文を含めるCPU例では、椅子の問い合わせ状況が復元できた。会が未開催であることは、思考欄の別の一文を担当が選んだ例で初めて残った。照明でも行動欄によって新しい照明で約30分描いたことは入るが、窓際での約1時間を入れるには該当する思考欄の選択が要った。担当が選ぶ一文を入れ替えれば、それまで残っていた予約連絡や夜に描ける日の予定が落ちる例もあった。

一方、実A44が選んだ全引用を重複も含めて保持する別の担当作成例では、読書会は12引用を16引用にして5観測点、照明は18引用を24引用にして7観測点すべてを計画に含められた。短い試験用の本文・関係と合わせた三段階の出力は1,127／1,819トークンで、生成制約とCMEEを通過した。

修理の実NODESで自由記述した2欄に漏れた内部参照を同時に、または片欄ずつ再投入した。v17は通したが、v18では生成制約とCMEEがいずれの投入も拒否した。選択原文全体（@0）、選べる原文一文（@2）、出典に沿って担当が書いた言い換えの3例は両方を通過した。

読書会の実見出しは二つの記録を参照しながら、原文の組合せが翌日の句だけだった。この見出しと、句の間の区切りだけを変えた例を、v18の生成制約とCMEEの双方が拒否した。翌日だけを参照する見出し、各日から一つずつ引用する見出し、二日を通した自然な説明はいずれも通過した。応募取消の元見出しも参照先の三項目目を欠くため拒否し、照明と10記録のように一項目だけを参照する題は通った。自由に言い換えた見出しの忠実さ、全体を代表する項目を選べたかは、引き続き生成後の原文照合で確認する。

同じ原記録から作った一項目で、欄、根拠の文字列、参照した表示文、出典の扱いがすべて同じ繰返しは、表示時に一度だけにした。実A44の既存出力を表示処理だけにかけると、読書会の2項目と照明の1項目で重複本文が減った。図のその他の箇所、収録範囲、非公開の計画・生応答・単位ごとの根拠の一致を確認した。

修理の実A44を旧版で再生して保存済みの図と全文を復元した。表示処理を切り替えた例では、11月8日に本人が修理完了をまだ聞いていなかった原文に「当時の未確認（11月8日の記録）」と日付が付き、後日の記録にある弟の相談状況には「まだ記録にないこと」が付いた。前後の記録が同じ問いを解決したかはこの表示処理で決めず、元の3段階の応答と非公開根拠を保持する。

v18の通常APIに、A44の元入力を用いて担当が作成した3段階の応答を与えた。読書会、照明、修理は全文を選ぶ例と一文を選ぶ例の計4件（3入力）を隔離DBに保存し、別プロセスで同じIDから再読した。これらに新しい実4B出力はない。修理の一文を選んだ例の初回は隔離SQLに行を書いた後、一時DBの書き出し中にプロセスが終了した。初回を完了件数から除き、新しい空DBで保存からやり直して再読まで確認した。

通常／留保多数のCPU再生は各54段階（MAP 15、LEAF 36、MERGE 3）。v18の入力と出力予約の和の最大は30,517／31,841トークン（上限32,768）。三段階合計の出力最大は1,694／3,241（上限4,096）、24候補すべてをOPENにした例は3,595。旧v17の108段階の要求と応答は既存証跡と一致した。v17で実生成し保存したA44の5件は、各々別プロセスから同じIDで読み（HTTP GET各1回、読取RPC各2回）、HTTP 200、同じ図・全文・収録範囲・非公開根拠、生成とSQL書込み0を確認した。

確定ソースの専用・周辺90件、Analysis 1,352件と11,871サブテスト、Piece 666件、Emlis・共有推論336件が通過した。並行実行した一回目のAnalysisは隔離DBの準備で3件がエラーとなり、Emlisの最初のプロセスもシグナル9で終了した。上記は確定ソースで完走した再実行の件数。

通常用のRender API・workerは手動反映の `24bc228dbf54abc983906323c0ae7d937fae1fd6` でlive。SupabaseはACTIVE_HEALTHY、既適用38件の最新は `20261115011424`。この開発単位の通常用デプロイと運用DB書込みは0。

開発コミットのGitHub CIはPiece #44469720663、Analysis #44469720664が成功した。

同一Pod `dqmg1qgolenq7v` でA45の5入力と、二者が全5件適合と判断した場合のB45（12記録＋統合）をオフラインで凍結した。送付対象は6点 3,242,375バイト、ZIP 2,764,649バイト・SHA-256 `5aa488bb6ce6e7585076019824dac91462f994b9d97c7fb2902db1f9341e0d52`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `b94f83350c6ad53c20f62e3d773746fdb2afeb5df7abac0c227e3d23f403aad8`。A45は最大19応答・通常用の復元込み30分、B45は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B45を開始する際はA45の原文・生応答・図・全文に紐付けた二者の判定を照合する。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A45相当5件とB45相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。

A45の凍結スコープと実行許可の範囲を照合し、A44で残った原文を用いて、椅子の問い合わせと未開催、照明の異なる二回の制作、修理完了の時点と受取予定、取消後の最終状態、行動欄の「古い日記を読んだ」と思考欄の「以前思い描いた暮らしと今の暮らしが違って」の区別を新しい生成結果で照合する。5件すべてを二者が適合と判断した後に、B45で12記録＋統合の実生成、同じ生応答の保存・別プロセス再読、通常反映へ進む。

<a id="analysis-a45-actual-result-20261119"></a>
## 9.164 分析MAP開発版v18の実4B試験A45、応募取消の意味適合と4件の残件（11/19 JST）

**11/19・分析MAP開発版v18の実4B試験A45で、応募取消の1件は主担当・独立担当とも意味適合と判定しました。** 5件すべての図・全文を生成し隔離DBで保存・再読しました。残る4件は両者とも不適合で、B45と通常反映は実行0件です。

§9.163のAPI開発コミット `dc016ecdd9a75a5877f774cfc341967af38e9447`（v18）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析の各段階で15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

5入力すべてでPLAN・NODES・RELATIONSの三段階がHTTP 200、終了理由stopとなり、図と全文を生成した。A44と同じ元入力を使い、各担当が原文・三段階の生応答・図・全文を照合した。双方とも応募取消が適合、読書会・照明・修理・10記録は不適合と判定した。

実際に返ったNODESの本文は合計85欄。66欄が原文を番号で選び、19欄は自由記述だった。この19欄の全てに内部形式が書かれ、同じ文字列が公開図と全文の双方に出た。件別の自由記述／本文全欄は読書会5/6、照明8/8、修理1/10、応募取消0/16、10記録5/45。生成時の本文にすでに混入しており、受入れと表示の両方を通ったことを原本と照合した。

読書会のPLANには、下書きの未送信、翌日の送信、共同担当者が椅子の数を問い合わせたか本人は聞いていないこと、会は来週で未開催であることが入った。椅子の未確認は公開まで残ったが、本文6欄のうち5欄に内部参照に似た文字列が出て、未送信・送信・未開催が自然な説明として読めなかった。全員が案内を読んだかという留保も消えた。二日間を参照する全体見出しは翌日の一階の予約連絡だけを表した。

照明は、初日に窓際で下書きを描いたこと、後日に新しい照明を購入・設置し配線を調整して約30分描いたことをPLANが選んだ。窓際で描いた時間が約1時間だったことは選ばれなかった。本文8欄の全てに内部の欄名を含む文字列が入り、図と全文から二度の制作の違いを読み取れなかった。初日時点の不確かさと、購入後の感想が一晩に限られることは残った。

修理では、後日、店から画面修理の完了連絡が届いたこと、本人は未受取・未動作確認で、受取を翌日に決めたことが図と全文にそろった。弟が別の相談を送ったか不明なことも区別した。一方、本文10欄のうち1欄に辞書の項目名と角括弧を含む内部形式が出た。初日に本人が弟の携帯の修理まで頼んだわけではないという原文も欠けた。

応募取消は適合。候補二枚の選定、海辺の一枚の応募と受領、その後の取下げ完了という三時点が全体見出しに入り、図と全文でも最終状態を追えた。受領メールが残っていても応募継続を意味しないこと、再応募の意向はなく、友人に取消をまだ伝えていないこと、友人の感想は11月10日時点で未聴取であることを区別した。本文16欄は全て原文を番号で選び、内部形式の露出は0欄だった。

10記録は10項目に分かれた。机の片付けと残した棚、予定を変えた友人との非面会と恋人との夕食を別々に示した。行動欄の「古い日記を読んだ」と、思考欄の「以前思い描いた暮らしと今の暮らしが違って」を区別し、A44にあった、想像した暮らしを日記で知った実生活に変える誤りは解消した。友人・恋人・休息・学習・日記の5項目の本文に `,{17,18},` 等の原文にない数の組が出た。全体見出しと概要は写真の1項目だけを扱った。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで745.852秒。復元時のPIDは24159、開始tickは12110302。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A45-results.zip` は191,083バイト、SHA-256 `eebc462b80b0fd335a7189009c720c302415c7f2827ef5a9d5e66e52d36e887c`。凍結スコープは `b94f83350c6ad53c20f62e3d773746fdb2afeb5df7abac0c227e3d23f403aad8`、二者の判定に用いた結果本文は `f7a822a65e3516757168adf652fd38c5e3702e6c04ae47f4cb5c6ebd7e60b992`。

今回の許可でA45を1回実行した。B45は、全5件の二者適合という開始条件を満たさず、起動0回。12記録＋統合の新規実生成と保存・再読、通常反映は未完。

A45の公開図と全文まで届いた自由記述の内部形式を、生応答の各欄と対応させて修正・検証する。根拠が選ばれても本文に届かない例、窓際での約1時間の選択、複数記録の概要が一記録だけを表す例を再確認し、応募取消の最終状態と時点の扱いも引き継ぐ。新しい実出力で全5件を二者が適合と判断した場合に、12記録＋統合の実生成と同じ原本の保存・別プロセス再読、通常反映に進む。

<a id="analysis-post-a45-source-bound-display-20261119"></a>
## 9.165 分析MAP開発版v19の本文・全体題の出典照合とA45からの再生（11/19 JST）

**11/19・分析MAP開発版v19で、A45の図・全文に漏れた内部形式19個を、生成時とCMEEの公開前にそれぞれ単独で拒否できることを確認しました。** 複数記録の概要題も元の入力と照合し、A46と条件付きB46の実行資材を凍結しました。v19の実4B生成・通常反映は各0件です。

開発コミット `64cbb754c51a3595555351aeeb4c57705626170f`（tree `a99e41e63217e9357b244fbd63e35954d8c57d1d`）で本文・見出しの出典照合を追加した。A45で実生成したモデルの応答は旧v18の原本に保存している。

### A45の実応答と本文・見出しの照合

A45では、5件の事実欄85個のうち、66個が選択した原文への整数参照だった。残る19個の自由記述はすべて、次の欄の名前、辞書の一部、番号の集合といった内部形式を含み、図と全文にそのまま届いた。事実欄ごとの混入は読書会5/6、照明8/8、修理1/10、応募取消0/16、10記録5/45。実4Bの意味適合は、主担当と独立担当のどちらも応募取消の1/5だった（§9.164）。

開発版v19では、選んだ根拠の全文を表示枠に収め、全文または完結した一文を番号で選べる事実欄は、その原文候補から選ぶ。全文が収まらず自由に説明できる欄では、内部の欄名、辞書の断片、番号の集合や数字だけの表記について、対応する元の引用にその表記があるかを生成時とCMEEの公開前の両方で照合する。整数による既存の原文選択は引き継ぐ。

旧v18で実A45の全15段階の生応答を再生した。v19の要求識別子へ結び直した試験では、5件すべての計画が通り、4件は本文を組み立てるNODESで止まった。二者が意味適合とした応募取消は3段階すべてを通った。

担当が原文を確かめて19欄を置き換え、元の整数参照66個を保った例では、5件のNODESが生成制約とCMEEの双方を通過した。その状態から元の内部形式を一つずつ戻すと、19個すべてが各々単独で両方に拒否された。11欄は全文候補を選び、照明の8欄は担当が独立した文を作った。この8欄の表示枠は22〜64字で、作成した文は20〜45字だった。生成時の一文字ずつの検査に加えて、内部形式を1トークンにまとめた5対照では、点数の高い混入候補を落とし、低い点数の正当な文でNODESを完結できた。

読書会の実際の全体題は、両日の記録を参照しながら、翌日の項目題と同文だった。元の計画に引用されていない原文の一文でも、参照した独立記録のどれに属するかを完全な入力欄から確認する。読書会のA45応答をv19で再生すると本文段階で止まるため、実計画を保ち、読書会の混入5欄を全文候補にした上で見出しを単独に試した。元の題と、片方の日だけの別の一文は、v19の生成制約とCMEEの両方が拒否した。翌日だけを明示した題、各日から一文ずつ用いた題、両日の自然な概括は両方が受け入れた。同じ一文が複数の記録にあり得る場合は対応する出典をすべて保つ。自由に言い換えた題の意味と、10記録を一つの写真の話だけで代表した例は、生成後も原文との照合が要る。

### 通常APIの保存・再読と互換性

別の通し試験では、読書会と照明について、A45実生成時の計画・留保・関係線を保ち、混入欄と概要を人手で置き換えた。読書会は5欄を原文参照にし、両日の題を作った。照明は8欄を原文参照3個と手書き要約5個にし、初日だけの概要を両日の題と参照にした。2件とも新しい3段階を通常API経由で隔離SQLに保存し、別プロセスで同じIDの図・全文と非公開の段階別生応答を読み戻した。読書会で全員が読んだか、窓際で何分描いたかは元の計画に含まれず、この試験でも補っていない。

旧v18で実生成したA45の保存済み5件は、各々別プロセスからv19の通常APIで最新記録を読み、返ったID・図・全文・収録範囲を保存時と照合した（HTTP GET各1回、読取RPC各2回）。同じIDの非公開根拠も隔離DBの行から読み出し、一致を確認した。再読時の実モデル呼出しとSQL書込みは0。

通常／留保多数のCPU試験では、各54段階（MAP 15、LEAF 36、MERGE 3）を通した。v19の入力と出力予約の和の最大は30,542／31,825トークン（上限32,768）。三段階共有の合計出力は最大1,697／3,237（上限4,096）、24件すべての留保を表示した例は3,591だった。旧v18は同じ108段階の入力・模擬応答・容量が従来の試験と一致した。

確定ソースの専用・周辺78件、Analysis 1,393件と11,871サブテスト、Piece 666件、Emlis・共有推論336件が通過した。Analysisの先行並行試験では隔離DBの起動時に1件がエラーになった。上記の件数はその後に完走した確定ソースの結果。

開発コミットに対するGitHub CIは、Piece #44477026826、Analysis #44477026963が成功した。

11/19 16:07 JST時点で、通常用のRender API・workerは手動反映の `24bc228dbf54abc983906323c0ae7d937fae1fd6` でlive。SupabaseはACTIVE_HEALTHY、既適用38件の最新は `20261115011424`。今回の開発単位での運用DB書込み・通常用デプロイは0。

### A46と条件付きB46の実行資材

同一Pod `dqmg1qgolenq7v` 向けに、A46の5入力と、二者が全5件適合と判断した場合のB46（12記録＋統合）の実行資材を手元で凍結した。送付対象は6点 3,248,641バイト、ZIP 2,767,159バイト・SHA-256 `0d5d2c0e46fd8b309a61a3d96056ee51573db61ca65e8afed2ea1b65f4c7cdc4`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `8ff8930e9f27955a638af8c3de02592af0e149356703904ef9fad14124854059`。A46は最大19応答・通常用の復元込み30分、B46は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B46を開始する際はA46の原文・生応答・図・全文に紐付けた二者の判定を照合する。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A46相当5件とB46相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。

同一PodでA46の実行許可と凍結スコープを照合し、5件の新しい図・全文で、内部形式が出ず原文の意味が伝わるか、読書会・照明で必要な情報が選ばれるか、修理の予定と応募取消の最終状態が保たれるか、10記録の概要が適切かを二者で判定する。全5件適合ならB46で12件の個別結果と統合結果を新たに生成する。元の12記録と照らした二者の意味判定、同じ生応答の通常経路での保存・別プロセス再読を確認して通常反映へ進む。

<a id="analysis-a46-actual-result-20261119"></a>
## 9.166 分析MAP開発版v19の実4B試験A46、照明の本文8欄に残った内部参照と5件の意味判定（11/19 JST）

**11/19・分析MAP開発版v19のA46は、5件すべてで図と全文を生成し、通常API経由で隔離DBに保存して別プロセスで再読できました。** 意味適合は主担当0/5件、独立担当1/5件（応募取消）、両者が適合としたものは0/5件。照明の本文8欄には新しい形の内部参照が残り、応募取消では選択保留の意味が変わりました。B46の条件は未達で、通常反映は0件です。

§9.165のAPI開発コミット `64cbb754c51a3595555351aeeb4c57705626170f`（v19）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析の各段階で15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

5件の計画（PLAN）・本文（NODES）・関係（RELATIONS）は計15段階すべてがHTTP 200、終了理由stopだった。A45と同じ元入力を用い、主担当と独立担当が原文・3段階の応答・公開図・全文をそれぞれ照合した。意味適合は主担当0/5件、独立担当1/5件（応募取消）。A45では両者とも応募取消の1件を適合としていた。

5件の事実欄は計86個。68個が整数で原文を選び、10個が今回の全文選択（@0）を使い、残り8個が照明の自由記述だった。A45で漏れた19欄と同じ文字列は、対応するA46の公開全文には0個。照明の8欄では異なる記号列がすべて当該項目の図と全文へ漏れた。この記号はNODESの実生成文にすでに含まれていた。

読書会では、初日に共同担当者が会場へ問い合わせ、本人は案内を下書きして未送信だったこと、翌日に本人が予約の返信を確認して案内を直し、送信後に一人から返事を得たことを図と全文で追えた。A45で壊れていた事実欄が読めるようになった。一方、全体題は本人が初日の問い合わせに関わらなかったことだけを扱い、翌日の本人の行動を含まなかった。全員が読んだかは不明で、会は来週でまだ開催されていないという原文の範囲も欠けた。

照明では、計画が初日の窓際での作画と、購入後に配線を整えて約30分描いたことを選んだ。しかし、事実を表示する8欄すべてに「*,e2:/」のような欄参照と途中で切れた語句が入り、図と全文で二度の実際の行動を追えなかった。一晩の感想に限ることと、長期の使用感や作品完成がまだ不明なことは読めた。窓際で約1時間描いた事実は計画の時点で落ち、全体題は初日だけを表した。

修理は、店からの画面修理の完了連絡と、本人がまだ受け取り・動作確認をしていないことを区別した。弟が別件の相談を送ったか不明なことも表示した。一方、本人が受取日を明日に決め、携帯が現在も店にあるという後日の記録が計画に選ばれず、図と全文には未受取という状態しか残らなかった。A45で本文まで届いた受取予定が今回は欠けた。

応募取消の全体題は、候補二枚の選定、海辺の一枚の応募・受領、取消完了の三時点を表した。以前の受領メールが残っていても応募は継続していないこと、再応募の意向がなく、友人へは取消をまだ伝えていないこと、友人の感想は11月10日には未聴取だったことも読めた。初日の原文「どちらを出すかはまだ決めず」に対し、図と全文の要約には「二枚の候補を区別せず」と出た。選択を保留した事実が、二枚を区別しなかったという別の意味に変わった。主担当はこの意味の変化により不適合とした。独立担当は、その直後の事実本文で初日の保留を正しく読めること、応募から取消までの経過と最終状態を通して追えることから適合とした。判定が分かれたのはこの1件だった。

10記録は対応する10項目に分かれ、机を片づけた範囲、会えなかった友人と夕食を共にした恋人の違い、古い日記を読んだ行動と以前想像した暮らしについての感情を区別できた。45個の事実欄はすべて原文を選び、A45で5項目に混入した数字の組は消えた。一方、全体題と概要は写真の1項目だけを取り上げ、10件全体の概要になっていない。友人の記録などには同じ文の繰り返しも残った。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで736.535秒。復元時のPIDは26060、開始tickは12508761。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A46-results.zip` は192,923バイト、SHA-256 `488c4bf430e8be9b5755aa6e04b55056c51f3f2b2cadcb130fb5f6e7b65b6dfc`。凍結スコープは `8ff8930e9f27955a638af8c3de02592af0e149356703904ef9fad14124854059`、二者の判定に用いた結果本文は `5fa3f1fbf8fcd7d861f83c3a19c30a4c3dbeb9a64f7182e6c66cd0acd2d053cb`。

11月19日に通常環境を照合した。RenderのAPIとワーカーはいずれも main の `24bc228dbf54abc983906323c0ae7d937fae1fd6` で稼働し、Supabaseは正常、適用済みマイグレーションは38件（最新 `20261115011424`）。今回の確認に伴うデプロイ起動・本番DB書込みは各0件。

A46は許可された1回を実行した。B46は二者による全5件の適合に達せず、開始許可票の発行・Pod上の起動は各0回。12記録＋統合の新規生成とその保存・再読、および通常反映は未完。

A46の生応答を基に、照明で別の欄を指す記号が表示まで通る条件、計画に必要な記録・留保・予定が選ばれない箇所、全体題と項目要約が原文の範囲や意味を変える箇所を修正・検証する。実生成した全5件で二者が原文との意味適合を確認した後、12記録＋統合の実生成、同じ出力の保存と別プロセス再読、通常反映に進む。

<a id="analysis-post-a46-source-selection-and-display-20261119"></a>
## 9.167 分析MAP開発版v20の根拠選択・本文・全体題とA46からの再生（11/19 JST）

**11/19・分析MAP開発版v20で、A46の原文選択・事実欄・項目要約・全体題を修正しました。** 人が原文を選んだ5件のCPU試験で92欄が該当項目の図と全文に届き、5件を保存して別プロセスで再読できました。稼働版相当の旧APIでは新形式5件の再読が503となり、v20対応APIでは通常用120u設定で全件を再読できました。次のA47・条件付きB47は実行資材を凍結した段階です。v20の実モデル生成・通常反映は各0件です。

開発コミット `368ce1a369e8db8c438efb4c22d1858417c8113a`、tree `f4903f7000a28bd430083409b89140cd802ad791`。MAPの新しいプロファイルで根拠の選択・本文・概要を更新し、元のA46結果と同じ入力に対する再生を記録した。

### A46原本とv20の計画・事実・要約の照合

A46の5件はすべて同じ原本から保存・再読できたが、意味適合は主担当0/5件、独立担当1/5件（応募取消）だった。照明の事実8欄には、別の欄を指す記号と途中で切れた引用が図と全文に出た。読書会・照明・修理では、必要な留保・実行時間・受取予定の一部が計画で抜けた。応募取消の初日の選択保留は要約で別の意味になり、読書会・照明・10記録の総覧は一つの時点または一記録だけを表した（§9.166）。

v20の計画は、原文の思考欄で独立に選べる完結した文が4文以上あり、容量などの条件を満たす場合、段落や文の位置に沿って2〜3の範囲に分ける。各範囲は2文以上を含む。行動欄とともに根拠を選ぶとき、同じ部分の繰り返しや未読の範囲を生成時とCMEEで照合する。どの文を採るかは範囲内の選択に残す。候補文が少ない記録、派生資料を含む入力、必要な記録量が予算に収まらない場合などでは、従来どおり原文を選ぶ。

A46でモデルが選んだ元の計画をv20に通すと、読書会・照明は原文の一部の範囲を選んでおらず、修理は同じ範囲の重複で、生成制約とCMEEがいずれも拒否した。応募取消と10記録の計画は両方を通った。担当が3件の根拠を選び直すと、読書会の「全員が読んだか不明・会は来週」、照明の窓際で約1時間描いた事実、修理の「受取は明日・今は店にある」を含む計画が両方を通った。

事実欄は、短い引用では選んだ原文の全文、長い引用では位置を指定した原文の範囲を使う。長い一文を途中で区切る場合は切れ目に省略記号を付ける。A46の元の計画・項目の意味・全体題を固定して事実欄だけを試したCPU再生では、5件86欄すべてで該当する原文を図の当該項目と全文に確認した。照明の8欄で窓際での制作と購入後の約30分の制作が読めた。元の計画にない窓際の約1時間は、この再生には入らない。

同じ記録の行動欄と思考欄を一項目で扱い、選んだ根拠に条件に合う完結した複文がある場合には、項目要約の候補にその原文を用いる。応募取消の初日の要約について実A46の「二枚の候補を区別せず」だけを戻すと、生成制約とCMEEがそれぞれ拒否した。「どちらを出すかはまだ決めず、申込画面も開かなかった。」を選んだ同じ項目は両方を通った。

複数の独立記録にまたがる全体題は全項目を一度ずつ参照し、目的に合う場合は各記録を他から区別できる原文の言葉を使う。全体を短い題で表しにくい場合は「10件の記録を振り返って」のように記録数を示し、各項目の概要を並べる。統合CPU試験では読書会・照明・10記録について、A46の題だけ、参照だけ、両方を戻したいずれの例も生成制約とCMEEが拒否した。修理は元の題と全3項目の参照で通り、元の2項目参照で拒否。応募取消の3時点を扱う元の題と参照は通った。

5件の統合CPU試験では3件の計画を人が選び直し、残る2件はA46の元の計画を使った。その上で原文に結び付く事実・許容される項目要約と全体題を選んだ。5件の事実欄は9・11・11・16・45の計92個で、すべて該当項目の説明と全文に対応する元の文が出た。実モデルが同じ選択をするか、語句を含む題が自然で正確かは、新しい実出力を原文と照らして確認する。

### 通常APIの保存・再読と回帰

旧v19互換では、A46の実際の15段階すべてで送信内容と応答が原本のバイト列に一致し、5件の図・全文・収録範囲・非公開根拠も一致した。旧v19で保存したA46の5件について、開発版v20の通常APIを別プロセスから呼び、最新記録として返ったIDで詳細を取得した。図・全文・収録範囲・非公開根拠を保存時の内容と照合した。HTTP 200、読取RPC各2回、実モデル呼出しとSQL書込みは各0回だった。

v20で人が選んだ5件のCPU応答も通常APIのHTTP経由で隔離SQLに各1件保存し、保存時と異なるプロセスから同じIDで再読した。5件すべてで図・全文・収録範囲・非公開根拠が一致した。実モデル呼出し、再読時のSQL書込み、運用DBへの接続は各0回。

通常と留保を多く含むCPU試験で各54段階（MAP 15・LEAF 36・MERGE 3）を通した。v20の入力と出力予約の和の最大は30,522／31,937トークン（上限32,768）。3段階で共有する出力は最大1,713／3,464（上限4,096）、24件の留保をすべて開いた場合は3,818。同じ2経路の旧v19では、108段階の要求と模擬応答・計測値が前回と一致した。

確定ソースでは専用・周辺63件、分析1,417件と11,871サブテスト、Piece 666件、Emlis・共有推論336件（7ファイル）が通過した。

公開した開発コミットのGitHub CIは、Piece #44485716429、Analysis #44485716446が成功した。

11月19日時点のGitHub `main` 先端は `2d2f06dad0d373373cdac63e10734385eefb53ca`。RenderのAPIとワーカーは自動デプロイが無効で、通常経路はどちらも前回手動反映した `24bc228dbf54abc983906323c0ae7d937fae1fd6` で稼働している。Supabaseは正常で、適用済み38件、最新は `20261115011424`。実稼働版と開発v20のマイグレーションSQLは38本すべてが同一内容だった。§9.158の通常反映は、A・Bの実出力の意味と保存を確認した後、互換APIとワーカーへ対象コミットを明示して先に配置し、通常GPUでv20のMAP用モデル名を有効にして、通常経路で保存した同じIDを再生成せずに読むまでが対象となる。現在GPUは120uに復元済みで、IFは従来の120uを使う。今回のv20通常デプロイ・本番DB書込みは各0件。

通常反映の順序を、v20で手作成した応答から保存した5件の隔離DBで確かめた。現在稼働中のAPIと同じ `24bc228d` のコードでは、現行・従来の両クライアント相当の最新記録取得が5件ともHTTP 503（`analysis_saved_artifact_invalid`）になった。旧APIの `read_maps` は保存本文と旧形式で組み立て直した本文の一致を要求し、この5件を読み出せなかった。v20対応の `368ce1a3` で生成モデルの設定だけを通常用120uに戻すと、両クライアント相当で同じ5件をHTTP 200で取得し、現行クライアントでは同じIDの図・全文・収録範囲・非公開根拠が一致した。再読でのモデル呼出し・SQL書込み、運用DBへの接続は各0回。

反対方向では、現行稼働版と同じ `24bc228d` の通常APIに架空の2記録と模擬応答を渡し、隔離DBへ1件保存した。v20対応APIの別プロセスは現行形式v3と従来形式v2の両方で、最新記録と同じIDの詳細をすべてHTTP 200で再読した。各形式の図・全文・収録範囲、非公開根拠が保存時と一致し、読取RPCは4回、再生成とSQL書込みは各0回だった。

通常反映時はv20の保存を有効にする前に、読み取り互換のあるAPI・ワーカーを先に配置して旧記録の再読を確認する。v20で保存を始めた後に生成を通常用120uへ戻す場合は、互換のある読取版を維持してモデル指定だけを戻し、保存済みIDの再読を確認する。

### 全ファイル地図とA47・条件付きB47

開発版v20で追加した回帰試験は`ai/tests/test_analysis_v20_bound_fact_ranges.py`、`ai/tests/test_analysis_v20_paired_node_meaning.py`、`ai/tests/test_analysis_v20_plan_reading_regions.py`、`ai/tests/test_analysis_v20_whole_map_overview.py`。GitHubの全ツリーはアプリ・前提資料5,972ファイル、API開発枝は2,706から2,710ファイル（新規4・既存8変更）。System Contextの3,714項目は固定された過去のGitツリー（アプリ1,598・API 2,116）を表す。

同一Pod `dqmg1qgolenq7v` 向けに、A47の5入力と、二者が全5件適合と判断した場合のB47（12記録＋統合）の実行資材を手元で凍結した。送付対象は6点 3,261,836バイト、ZIP 2,773,692バイト・SHA-256 `d73fd26343c94d0c94640c3e301f218872c62f9ffd6800c2b684546f940e7d3a`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `ded791bdcddb0e13f91563c67819ca421b992f08143557045fd10dd40689feae`。A47は最大19応答・通常用の復元込み30分、B47は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B47を開始する際はA47の原文・生応答・図・全文について二者の判定を照合し、両者が全5件を適合とした場合だけ、4,096バイト以内の判定記録を同じPodへ送る。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A47相当5件とB47相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。

同じPodでA47の許可と凍結スコープを照合し、モデル自身が必要な根拠を選び、事実欄と要約・全体題が5件の原文の意味を保つかを新しい図と全文で二者が判定する。両者が5件すべてを適合とした場合にB47で12記録の個別結果と統合結果を生成する。その原文照合と、互換性を確認したAPI・ワーカーの先行配置、同じ応答の通常経路での保存・別プロセス再読へ進む。

<a id="analysis-a47-actual-result-20261119"></a>
## 9.168 分析MAP開発版v20の実4B試験A47、照明の二つの制作時間と5件の意味判定（11/19 JST）

**11/19・分析MAPの実4B試験A47で、照明の図と全文に、窓際で約1時間、購入後に約30分描いた二つの行動が戻りました。** 5件を隔離DBで保存・再読しました。二者とも適合としたのは1/5件（応募取消）です。読書会の未開催、修理で弟が問い合わせたかの留保、全体題の時系列・途中で切れた語句が残件です。B47と通常反映は実行0件です。

§9.167のAPI開発コミット `368ce1a369e8db8c438efb4c22d1858417c8113a`（v20）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析の各段階で15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

5件の計画・本文・関係の15段階を回収した。意味適合は主担当1/5件（応募取消）、独立担当1/5件（応募取消）。両者が適合としたのは1/5件（応募取消）だった。

5件の事実欄は順に6・26・10・17・45の計104欄で、すべて整数で原文を選んだ。照明と10記録で実際の全体題を生成した要求と生応答を同じ開発版で調べた。照明は77文字目の「予」の後、10記録は71文字目の「日」の後で、80文字制限と必須の原文語句の両方を満たす続きがそれぞれ「・配線」「・散歩・日記・納得」だけになった。どちらも総文字数が80になり、その断片が図と全文の先頭に表示された。

読書会では、初日の下書きと未送信、翌日の予約確認・案内送信・一人の返事を区別した。全員が読んだかは不明で、椅子の問い合わせ状況も未確認だと表示した。一方、全体題は翌日の一階の予約を先に置いてから、初日に二階の部屋名を書きかけて消した行動を続けた。読書会は来週でまだ開かれていないという原文の留保は全文に出なかった。

照明では、窓際で約1時間描いたこと、購入後に取り付けと配線を調整して約30分描いたことを、図の該当項目と全文で読めた。長期の使用感と作品完成はまだ不明という留保も出た。A46の照明で表示された8個の内部参照文字列はA47の全文から消えた。新しい全体題は以前の候補選びについての文をつないだ後、「予・配線」で途切れた。

修理では、店の完了連絡と本人がまだ受け取り・動作確認をしていないことが区別された。A46で欠けた明日の受取予定と、携帯が現在も店にあることは今回の項目要約と全文に戻った。初日の「弟の電話の修理は頼んでいない」は残ったが、その後に弟が電池の相談を店に送ったかは聞いていない、という別の留保が図と全文から落ちた。

応募取消は、初日に候補二枚を選んだ段階、後日海辺の写真一枚を応募して受領メールを受けた段階、取消完了の三時点を表した。「どちらを出すかはまだ決めず」と本文に出て、A46の「二枚の候補を区別せず」という要約も消えた。以前のメールが残っていても現在は応募中でないこと、取消を友人にまだ伝えていないこと、友人の感想は11月10日時点で未聴取だったことも区別した。

10記録は10項目で、A46で写真の一件だけを扱った全体題には、机の片づけ、会議、写真、友人、夕食など複数記録の出来事が入った。一方、末尾は「古い日・散歩・日記・納得」という語の列で終わった。古い日記を読んだ項目などでは、同じ文が項目要約と説明で繰り返された。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで813.609秒。復元時のPIDは28945、開始tickは12938860。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A47-results.zip` は204,808バイト、SHA-256 `a1071df548ec8c61addb8fb38e029dcea7f1c49721f6bdf844964c46e1099948`。凍結スコープは `ded791bdcddb0e13f91563c67819ca421b992f08143557045fd10dd40689feae`、二者の判定に用いた結果本文は `8bf9ae21fbbb1a508dd4ec62dbd03cfb55954f4f1947f6c4308a7a9bdb94c62c`。

11月19日に通常環境を照合した。RenderのAPIとワーカーはいずれも main の `24bc228dbf54abc983906323c0ae7d937fae1fd6` で稼働し、Supabaseは正常、適用済みマイグレーションは38件（最新 `20261115011424`）。今回の確認に伴うデプロイ起動・本番DB書込みは各0件。

B47の条件は主担当・独立担当の両者による全5件の適合。A47は許可された1回を消化し、B47の開始用判定記録は発行しなかった。12記録＋統合の実生成・別プロセス再読と通常反映は未完。§9.167で確認した、互換APIとワーカーをv20書込みより先に配置する順序を引き継ぐ。

A47で復元できた照明の二場面、修理の受取予定、応募取消の初日の保留を保持する。読書会の未開催と弟の相談状況が落ちた段階、全体題で原文の時系列が逆転する箇所と語が途中で切れる箇所、同じ文の重複を実応答から切り分ける。修正後は新たな実出力で二者が原文・図・全文を照合し、全5件が適合した時点で12記録＋統合、通常経路での保存・同一IDの再読へ進む。

<a id="analysis-post-a47-source-coverage-and-overview-20261119"></a>
## 9.169 A47で欠けた原文と全体題の修正、A48・条件付きB48の準備（11/19 JST）

**11/19・分析MAP開発版v21で、A47の読書会・修理で抜けた原文と、全体題に残った時系列・語句の断片を修正しました。** 実応答のCPU再生では欠けた2件の計画と3件の題を検出し、10記録の事実説明3項目では重複を解消しました。A48と条件付きB48は実行資材の凍結まで。v21の実4B生成と通常反映は各0件です。

開発コミット `f623658fa8bf3c8e55f76c1c173d09bd6688bf37`（tree `5c6b1ef05f5ec0b40db9d7aeab99fa6f419f8b92`）のv21を、分析MAPのモデル名で選択できる。Emlis・分析IFの通常用は120uで、稼働サービスは§9.167で確認した版を使っている。今回のv21の実4B生成・通常配置・本番DB書込みは各0件。

v21では、原文の同じ文が将来の予定と現在の状態を明示している場合、長い思考欄の該当範囲からその文を選択できるようにした。その範囲に該当する文が一つのときは、その全文を根拠として残す。別の項目と同じ根拠を再利用する前には、同じ記録に未選択の「聞いていない・確認していない」に当たる原文があるかを照合する。A47で実際に返った計画のうち、来週開催で未開催という一文を欠いた読書会と、弟の相談状況を落とした修理の2件は、生成側とCMEEの双方が拒否した。担当者が元の一文を選び直した2例は双方を通った。照明・応募取消・10記録のA47計画は選択を変えずに通った。

複数記録の全体題は、一度作った題案を各記録の原文と照合し、採用可能な題案か、記録件数を示す見出しから仕上げる。A47で実際に出た題を用いたCPU検査では、読書会で二日目の行動が先に来た題、照明の「予・配線」、10記録の「古い日・散歩・日記・納得」を採用候補から外した。修理・応募取消の元の題は採用候補に残った。担当者が原文から作った「下書きの保存から一階の予約確認と案内の修正送信まで」や「10件の記録を振り返って」などの例も確認した。4Bが自分でどの題を選び、ユーザーがどのように読めるかはA48の実生成で評価する。

同一項目の事実説明では、同じ入力欄から同じ扱いで採った完結した文が既に収録されている場合、その文の二重表示を抑える。A47の実応答の再生では10記録中の友人・恋人・学習の3項目で重複が消え、他の4入力の事実説明は同じだった。部分的に一致する文、新しい内容、別の入力欄・扱いの文はそれぞれ保持する。項目題・要約・説明の間にまたがる繰返しは、この確認とは別に残る。

担当者がA47の元応答で読書会の未開催と弟の相談状況に対応する文を選び直し、読書会の項目題1件と各入力の全体題を調整したCPU例では、5件の計画・本文・関係の全15段階を通り、図は順に2・6・2・3・10項目になった。実4B呼出しは0。

保存履歴では、稼働版と同じコードで書いた1件と、A47の実応答を隔離DBに保存した5件について、v21対応APIを別プロセスで起動し、生成モデルの指定をv20・v21・通常用120uに切り替えて再読した。6件×3設定で、現行v3・従来v2の最新取得と同一IDの詳細取得はすべてHTTP 200。図・全文・収録範囲はv20の対照と、非公開根拠は保存時の値と一致した。再生成・SQL書込み・運用DBへの接続は各0回。

v21形式で新しく保存した応募取消1件も確認した。A47の3段階の応答にv21の形式と同じ全体題の題案を設定し、隔離DBに1件保存した。v21対応APIの三つのモデル指定はいずれも同じIDを再読できた。この1件を通常用120u指定のv20対応APIで読んだ場合、現行v3・従来v2の最新取得と詳細取得は4件ともHTTP 200、稼働版と同じ `24bc228d` では4件ともHTTP 503（`analysis_saved_artifact_invalid`）。保存データは双方で一致し、再生成・SQL書込みは各0回。通常反映時は互換API・ワーカーを先に配置し、生成を120uへ戻す場合も読取互換のある版を維持する。

通常例・留保を増やした例は各54段階（MAP 15、分割36、統合3）を再生した。入力と出力予約の合計はそれぞれ最大30,517・31,993トークン（上限32,768）。3段階で共有する出力は最大1,725・3,510（上限4,096）。

確定ツリーの専用・周辺試験98件、分析1,452件と11,871サブテスト、Piece 666件、Emlis・共有推論336件（7ファイル）が通過した。Emlisの1ファイルは初回の並列実行が途中で停止し、単独で34件すべての通過を確認した。GitHubの開発コミットではAnalysis #44495761334、Piece #44495761307が成功した。

開発版v21で追加した回帰試験は`ai/tests/test_analysis_v21_authored_overview.py`、`ai/tests/test_analysis_v21_overlapping_source_facts.py`、`ai/tests/test_analysis_v21_recorded_schedule.py`。アプリ・前提資料は5,972ファイル、API開発枝は2,710から2,713ファイル（既存8変更・新規3）。System Contextの固定地図はアプリ1,598・API 2,116の計3,714項目。

同一Pod `dqmg1qgolenq7v` 向けに、A48の5入力と、二者が全5件適合と判断した場合のB48（12記録＋統合）の実行資材を手元で凍結した。送付対象は6点 3,269,719バイト、ZIP 2,776,797バイト・SHA-256 `7c1f05c18520d682d546e47470b8fdd8bbdfea75de4bba109ab05a2ef5da3014`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `433e7c811f8f149b3b2636e3360ea5a4004cefc4a2657a4b9d8af6f9aa8cd602`。A48は最大19応答・通常用の復元込み30分、B48は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B48を開始する際はA48の原文・生応答・図・全文について二者の判定を照合し、両者が全5件を適合とした場合だけ、4,096バイト以内の判定記録を同じPodへ送る。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A48相当5件とB48相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。

同じPodでA48の新規実行許可を照合し、5入力の実4Bによる計画・本文・全体題を原文・図・全文で二者が判定する。両者が5件すべてを適合とした場合だけB48に進み、12記録の分割・統合の出力と原文を照合する。通常反映時には読取互換のあるAPI・ワーカーを先に配置し、通常経路で保存した同じIDの図・全文・根拠を再生成せずに読む。

<a id="analysis-a48-actual-result-20261119"></a>
## 9.170 分析MAP開発版v21の実4B試験A48、読書会・修理の原文の復元と5件の意味判定（11/19 JST）

**11/19・分析MAPの実4B試験A48で、読書会は来週で未開催という留保と、修理で弟自身が店に相談したかは未確認という原文が図・全文に戻りました。** 5件を隔離DBに保存し同じIDから再読しました。二者がともに適合としたのは1/5件（修理）。照明の初日の制作時間、応募取消後に残る受領メールの意味、全体題・要約と10記録の重複が残り、B48・通常反映は実行0件です。

§9.169のAPI開発コミット `f623658fa8bf3c8e55f76c1c173d09bd6688bf37`（v21）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析の各段階で15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

5件の公開図・全文を回収し、通常APIと隔離DBで5件の保存・再読を確認した。主担当の意味適合は3/5件（読書会・修理・10記録）、独立担当は1/5件（修理）。両者が適合としたのは1/5件（修理）。

5件の項目数は読書会・照明・修理・応募取消・10記録の順に2・2・3・3・10。全体題を決める5件の実要求と生応答をv21の確定ツリーで再生した。読書会・照明・10記録では、モデル自身の題案に対して件数の見出しだけが選択可能で、その題を図と全文に表示した。修理・応募取消では題案と件数の二つから選べ、実際にはいずれもモデル自身の題案を表示した。5件の事実欄は順に9・12・11・15・45の計92欄。すべて整数の参照で原文を選んだ。

読書会では、初日に本人が二階の部屋名を下書きから消して保存し、案内を送らなかったこと、翌日に一階の予約を確かめて案内を修正・送信し、一人が返信したことを区別できた。共同担当者が会場に照会したこと、椅子の数も問い合わせたかは未確認であること、全員が案内を読んだかは不明であることも区別された。A47で抜けた「読書会は来週なので、まだ開かれていない。」が図と全文に戻った。主担当は本人・共同担当者の役割、初日と翌日、未開催を正しく分けた点で適合とした。独立担当は、全体題が件数だけで、概要が問い合わせと予約連絡に限られ、本人の下書きから送信への変化を読み取るには本文が必要だと指摘した。初日の項目題も「私は会場への問い合わせには関わっていない。」で、本人がした行動を示していないため不適合とした。

照明では、初日の未購入、後日の購入・配線調整と約30分の下書き、長期の使用感と作品完成はまだ不明という順序を読めた。一方、A47で表示できた初日の「窓際の机では一時間ほど描けた」と、夜も同じとは限らないという条件は、A48の計画で根拠に選ばれず、図と全文から落ちた。夜に長く描ける日は二日ほどという予定だけが残っても、実際に描けた時間は分からない。

修理では、本人の携帯の修理完了を知らせる店の連絡と、未受取・本人による動作確認前、明日の受取予定、現在は店にあることを区別できた。弟の項目では、最初に弟の分まで修理を頼んだわけではないことと、後日弟自身が電池の相談を店に送ったかは「聞いていない」ことを、11月8日・12日の原文に分けて示した。

応募取消では、最初は候補二枚を保留し、海辺の写真一枚を送って受領メールを受け、後日取消完了を確かめた順序を示した。再応募の意思がないこと、友人にはまだ取り下げを伝えていないことも残った。ただしA47で読めた「以前届いた受領メールは残っているが、それを今も応募中という意味にはしていない」という本人の説明は計画で選ばれず、図と全文から消えた。山の写真と再応募についての文が同じ項目で繰り返された。

10記録は10項目を保ち、件数の見出しで、A47の「古い日・散歩・日記・納得」という断片は消えた。友人に会えなかったことと恋人とは夕食をとったこと、自分では意見を言わなかったことと別の人が方針を決めたことも区別できた。一方、写真を見た・撮った行動を同じ項目で繰り返し、古い日記を読んだ際の気持ちは項目題・要約・説明にまたがって重なった。主担当は10件の人物・行動・留保を混同していないため適合とした。独立担当は、会議に関する原文には資料を調べた事実だけがあるのに要約が「どう調べたか」を予告し、古い日記の同じ感情の一文が一項目内で4回現れ、概要から友人・恋人などの対象も分かりにくい点を理由に不適合とした。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで740.124秒。復元時のPIDは31565、開始tickは13315738。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A48-results.zip` は194,101バイト、SHA-256 `59cb8f3f207a13e53afd0393886e206ae4a3e584c51427829e1b6bf5308b8ac4`。凍結スコープは `433e7c811f8f149b3b2636e3360ea5a4004cefc4a2657a4b9d8af6f9aa8cd602`、二者の判定に用いた結果本文は `c6ce276afa038d14a1e644ad9250d7b3a7a6dbeedaa6860ceacdc1c2b1b05152`。

11月19日に通常環境を照合した。RenderのAPIとワーカーはいずれも main の `24bc228dbf54abc983906323c0ae7d937fae1fd6` で稼働し、Supabaseは正常、適用済みマイグレーションは38件（最新 `20261115011424`）。今回の確認に伴うデプロイ起動・本番DB書込みは各0件。

手元の受領・途中確認・開始条件判定の3ファイルでは、A47の転送目録SHAに含まれる文字「b47」まで版名として置換され、承認済みA48の目録SHAと照合できなかった。元ファイルに戻ってSHA全体を正しい値へ置換し、生成し直した受領関係4ファイルと凍結済みのスコープ・送付ZIPを照合した。Pod側の資材と実応答は同じで、追加のモデル呼出しは0回。

A48は許可された1回を実行した。B48の開始には、原文・実応答・図・全文の二者照合で全5件が適合することが必要で、開始用の判定記録は発行しなかった。12記録＋統合の実4B生成・その保存と同一ID再読、通常環境への採用は未実行。

読書会・修理で戻った原文と全体題の時系列を保ち、照明の「約1時間描けた」という実績と夜の条件、応募取消後にも残った受領メールと現在の状態を、モデルが選択した計画から図・全文まで照合する。複数記録の全体題・概要では本人の行動と対象が伝わるかを確かめ、10記録で要約が原文にない詳しさを予告する箇所や、項目題・要約・説明と事実欄の重複を検査する。次の実出力で二者が全5件適合とした場合に12記録＋統合へ進み、通常反映では互換API・ワーカーを先行配置する。

<a id="analysis-post-a48-source-coverage-and-display-20261119"></a>
## 9.171 A48の原文選択・概要・重複の修正とA49・条件付きB49の準備（11/19 JST）

**11/19・分析MAP開発版v22で、A48の照明で抜けた「窓際の約1時間と夜の条件」、応募取消で抜けた「残る受領メールと今の状態」を根拠として扱えるようにしました。** 実応答を使ったCPU再生で、補った二つの原文が図・全文まで届き、読書会と10記録の概要、文の重複も改善しました。A49と条件付きB49は資材の凍結までで、v22の実4B生成・通常反映は実行0件です。

分析MAPで選択できる開発版v22のコミットは `04a8e8a65262f92af242e043fa1acdec46fd570a`（tree `c5d1d7a1b57294b272eb19766a88313d44ac7dc4`）。通常用Emlis・分析IFの指定は120u。A48の実評価は主担当3/5件、独立担当1/5件、両者の適合は修理だけだった。今回の開発は照明・応募取消の原文の欠落、件数だけの見出しに続く概要、同じ文の重複を対象とした。

照明では二つの制作の実績を原文の完結した文に対応付け、最初の時間に付いた条件も含めて選ぶ。応募取消では、以前の証拠が残ることを現在の状態と同一視しないという本人の文を保つ。A48の5件の計画を生成側とCMEEで再検査すると、照明と応募取消の2件の元計画は必要な根拠が足りず、読書会・修理・10記録の3件はそのまま通った。照明に初日の1文、応募取消に最終日の1文を元の項目へ足した場合と、別項目に置く場合の両方で通過した。A47で既に2回の制作実績を選んでいた照明の6項目の計画もそのまま通過した。

5件のA48原応答を使い、上記2件だけで参照する原文を補って計画・本文・関係の15段階をCPUで再生した。生成済みの題案・項目題・意味文は書き替えず、新しい表示処理を通した。項目数は順に2・2・3・3・10。照明では「窓際の机では一時間ほど描けたが、夜も同じように使えるとは限らない。」が図と全文に戻り、後日の購入・配線調整後の約30分と併読できた。応募取消でも「以前届いた受領メールは残っているが、それを今も応募中という意味にはしていない。」が図・全文に戻った。A48で公開項目に出ていた原文100箇所は、5件すべてで同じ項目と全文にも残った。

件数だけの全体題を選んだ場合、各記録について計画で選んだ原文から、本人の行動が分かる概要を作る。読書会では11月13日の下書き保存と14日の案内送信・一人の返信、10記録では会えなかった友人と夕食を共にした恋人など、各項目の対象を概要で区別できた。10記録の会議では資料を調べた事実を示し、A48で原文にない調査方法を予告していた「どう調べたかが書かれています」という表現は消えた。

同じ原文を同じ入力欄・扱いから採った場合に文単位で重複を整理し、項目題・要約・説明も同じ文を繰り返さないようにした。A48の全文と今回のCPU表示を比べると、古い日記の感情文は4回から1回、最後の価値観の文は2回から1回、応募取消の山の写真と再応募の文は3回から1回になった。

照明の2記録に別の10記録を加えた合成例でも、12記録の原文24欄を保持し、12項目と照明の二つの制作実績を原文で表示できた。11項目に減らした例や最初の制作実績だけを落とす計画は拒否した。12項目のCPU例の3段階出力は合計2,646トークン。実4Bや12記録の分割・統合の使用可否は、A49・B49の実出力で判断する。

上の5件のCPU例は隔離DBに通常APIで各1回保存した。各成果物を別プロセスから現行・従来の最新取得と同一IDの詳細取得で読み、20応答で図・全文・保存時の根拠を照合した。再読時のSQL書込みと実4B呼出しは0件。元のA48実応答のチェックポイント5件は各SHAが一致した。また、v22形式の新規保存5件を通常用120u指定で比較し、v22対応APIでは20応答すべてHTTP 200、v21対応APIと稼働版に相当するコードではそれぞれ20応答すべてHTTP 503となった。

旧形式の全文を従来の関数で再構成する試験で、新表示に使う引数を旧関数も受け取る前提が見つかった。最終コミットではv22の表示を選んだ場合だけその引数を渡し、旧形式の呼出し方を保持した。

稼働版と同じコードで以前保存した1件、A47の実応答から保存した5件、A48で保存した5件の計11件を、まずv21対応APIで読み直し、現行v3・従来v2の最新と詳細の44応答を対照にした。次にv22対応APIを使い、生成の指定をv22・v21・v20・通常用120uに切り替えて同じIDを取得した。176応答がすべてHTTP 200で、各形式の図・全文・収録範囲が対照と、非公開根拠が保存時と一致した。再読での生成・SQL書込みは各0回。

A48の修理の計画・本文・関係の原応答3件を使い、版固有の整合確認値をv22で計算し直して、通常APIから隔離DBへ新しく1件保存した。実4B呼出しは0回。v22対応APIの4通りのモデル指定では、現行・従来の両形式で最新と同一IDの詳細を読めた。この1件を従来のAPIコード・120u指定で再読した結果は、v21は4件ともHTTP 503、v20は4件ともHTTP 503、24bc228は4件ともHTTP 503。SQLの保存内容は照合後も同一だった。通常反映では互換API・ワーカーを先に配置し、生成を120uに戻す場合も、既存データを読める版を使う。

通常例と留保を増やした例で、それぞれ54段階（MAP 15、分割36、統合3）を模擬応答で再生した。入力と出力予約の合計は最大30,516・31,991トークン（上限32,768）、3段階で共有する出力は最大1,723・3,511（上限4,096）。

同じ確定ツリーで分析1,494件と11,871サブテスト、Piece 666件、Emlis・共有推論336件（7ファイル）を再実行してすべて通過した。分析にはv21とv22の専用試験も含めた。GitHubのAnalysis #44506819462は最終コミット、Piece #44506312482は直前の開発コミット `c27372c8` で成功した。最後の変更は分析の表示処理1ファイルだけで、Pieceの実行対象に含まれず、最終コミットでは同ワークフローは起動しなかった。Emlisの最初の1ファイルは共有実行中に途中終了したため、同じツリーで検証を直列化し、そのファイルの34件と各スイートの正常終了を確認した。

開発版v22で追加した回帰試験は`ai/tests/test_analysis_v22_plan_source_coverage.py`、`ai/tests/test_analysis_v22_prior_evidence.py`、`ai/tests/test_analysis_v22_record_overview.py`。アプリ・前提資料は5,972ファイル、API開発枝は2,713から2,716ファイル（既存10変更・新規3）。System Contextの固定地図はアプリ1,598・API 2,116の計3,714項目。

同一Pod `dqmg1qgolenq7v` 向けに、A49の5入力と、二者が全5件適合と判断した場合のB49（12記録＋統合）の実行資材を手元で凍結した。送付対象は6点 3,282,469バイト、ZIP 2,783,645バイト・SHA-256 `76ee8f279836ad8977f0cd9f2fb9173e450a103c964e0cf7350d26adb44dcc2e`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `e8590fa7ae9686317300e8f0633f77f006f1558f46b71e78b5f39a3121465c00`。A49は最大19応答・通常用の復元込み30分、B49は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B49を開始する際はA49の原文・生応答・図・全文について二者の判定を照合し、両者が全5件を適合とした場合だけ、4,096バイト以内の判定記録を同じPodへ送る。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A49相当5件とB49相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。手元の受領用6ファイルはA49の転送明細の正規SHAと一致し、A48の明細SHAと1文字を変えたA49のSHAはともに拒否した。

同じPodでA49の新しい実行許可を照合し、対象5件の実4Bが選んだ根拠・図・全文を原文とともに二者で読む。両者が全5件を適合とした場合のみB49へ進み、12記録の分割・統合、実応答の保存・同一ID再読を確認する。その後、通常用API・ワーカーの読取互換を先に確保して通常反映する。

<a id="analysis-a49-actual-result-20261119"></a>
## 9.172 分析MAP開発版v22の実4B試験A49、原文から戻った事実と二者による5件の意味判定（11/19 JST）

**11/19・分析MAP開発版v22の実4B試験A49を完了しました。** 5件を隔離DBへ保存し、同じIDから再読しました。主担当は3/5件、独立担当は3/5件、二者とも適合は3/5件（修理・応募取消・10記録）でした。読書会と照明の全体題が原文にない意味を加えたため、B49は開始条件に達せず、通常反映は未完です。

§9.171のAPI開発コミット `04a8e8a65262f92af242e043fa1acdec46fd570a`（v22）を同じPodで1回評価した。実4B呼出しは対照を含め19回。分析5件の各3段階から計15件の応答を回収し、対照4件で基準の技術本文が一致した。追加学習・再試行は各0回。

公開図の項目数は読書会2項目、照明7項目、修理2項目、応募取消3項目、10記録10項目。事実欄は計100欄（9・19・11・16・45）。すべて整数の参照で原文を選んだ。実際の要求と関係段階の生応答から全体題の選択肢を再現した。4件（読書会・照明・修理・応募取消）は件数以外の題案も選択可能で、実際に件数以外の題を表示したのは4件（読書会・照明・修理・応募取消）だった。

照明では第5・第6・第7項目の説明内に同じ文が各2回現れた。10記録でも会議を担当したことが本文と同じ記録の担当注記に現れた。原文の反復が減った箇所と、同じ情報が複数箇所に残る場合の両方を確認した。

読書会は、初日の案内が下書き・未送信で、翌日に一階の予約を確認して本人が案内を修正・送信したことを、図の二項目と全文で確認した。一人から返信があったが全員が読んだかは不明で、椅子について問い合わせたかも不明。会は来週で未開催という記述も保った。全体題の「翌日一階の部屋で送った案内」は、予約した部屋を本人が案内を送信した場所に変えている。概要は共同担当者の連絡に寄り、本人の下書きと送信を拾っていない。両担当とも不適合とした。

照明は、A48で欠けた初日の「窓際の机では一時間ほど描けたが、夜も同じように使えるとは限らない。」が計画・図・全文に戻った。後日の購入・配線調整と約三十分の制作、長期使用と作品完成は未確認という記述も残った。全体題は「夜に使える場所を測って決めた照明」とし、必要な明るさ・設置場所の測定と、夜も描けるかという未確認事項を混ぜた。後日の購入を第2項目、初日の約一時間を第7項目に置き、概要の末尾では初日に購入をためらった記述へ戻った。両担当とも不適合とした。

修理は、店からの画面修理完了の連絡と、本人にはまだできていない受取・動作確認を区別した。受取予定は明日で、携帯は今も店にある。弟の電池相談について、A48で表示した「弟が電池の相談を店へ送ったかは聞いていない。」は今回の計画に含まれず、代わりに後日の行動欄にある「弟の相談状況は不明。」を採った。初日の記述と合わせて弟から店への依頼を確定させておらず、両担当とも適合とした。

応募取消は、初日に候補二枚を選ぶ、海辺の一枚を応募して受領メールを確認する、後日取り下げるという三日の順を、計画・図・全文で確認した。A48の全文になかった「以前届いた受領メールは残っているが、それを今も応募中という意味にはしていない。」が第3項目と全文に戻った。山の写真は未送信、今回は再応募せず、友人には取消をまだ話していないことも区別でき、両担当とも適合とした。

10記録では項目と概要が各記録を取り上げた。会議の生成応答には「どう調べたか」という表現が残ったが、公開図と全文には本人が会議を担当し資料を調べたことを表示した。友人の予定変更と恋人との夕食、日記を読んだ現在の気持ちと最後の本人の意向もそれぞれの記録に対応している。日記の感情文の全文出現はA48の4回から1回、最後の意向は2回から1回になった。両担当とも適合とした。

実際に取得した3段階の応答を通常APIから隔離SQLへ保存した5件は、別プロセスで同じIDから再読し、図・全文・非公開根拠が一致した。保存時に発行した成果物を指すIDだけが元の投影と異なる。再読は全件HTTP 200、モデル呼出し・SQL書込みは各0回。未認証の読出しは401、別所有者からのSQLは42501だった。

通常用120uの復元まで826.342秒。復元時のPIDは33481、開始tickは13716116。元のシグナル設定と試験用ポートの閉鎖を照合した。

回収した `A49-results.zip` は206,581バイト、SHA-256 `27e5836f9fef1fe1402837a6aded0d9a0d5e7663562e11275d21cc8b7dd0ea9e`。凍結スコープは `e8590fa7ae9686317300e8f0633f77f006f1558f46b71e78b5f39a3121465c00`、二者の判定に用いた結果本文は `1a5cf8af638c9873c8c50ac9a3a00e514200201031675dc3d9f557c7df4bba72`。

11月19日に通常環境を照合した。RenderのAPIとワーカーはいずれも main の `24bc228dbf54abc983906323c0ae7d937fae1fd6` で稼働し、Supabaseは正常、適用済みマイグレーションは38件（最新 `20261115011424`）。今回の確認に伴うデプロイ起動・本番DB書込みは各0件。分析・ワーカー・Pieceに関係する15テーブルはカタログ上で行レベルセキュリティが有効で、利用者のレコードは読んでいない。

A49は許可された1回を実行した。B49の開始には、原文・実応答・図・全文を両担当が照合して全5件を適合とすることが必要で、今回は開始用レシートを発行しなかった。B49、12記録＋統合の実4B生成と保存・同一ID再読、通常環境への採用はいずれも未実行。

読書会の開催場所と案内の送信場所、照明の設置場所と夜の利用可否を混ぜた題を、原文・項目との照合で検出する。複数記録を扱う図と概要では初日・後日の順、本人の行動と他者からの連絡、実施と未確認を照合する。修理・応募取消・10記録で保った事実と以前の保存履歴の読み戻しも継続して確かめる。次の実4B試験は別の許可で行い、二者の全5件適合を確かめてから12記録＋統合へ進む。通常環境には保存形式を読み取れるAPI・ワーカーを先に配置する。

<a id="analysis-post-a49-source-titles-and-chronology-20261119"></a>
## 9.173 A49で誤った全体題と時系列の修正、A50・条件付きB50の準備（11/19 JST）

**11/19・開発版v23で、A49の読書会と照明で原文にない意味を加えた全体題を検出し、複数記録の概要に日付と本人の行動を表示しました。** A49の5件をCPUで再生し、既存履歴の読取と三中核の回帰を確認しました。A50・条件付きB50は準備済みで、v23の実4B評価と通常反映は未実施です。

分析MAPの開発コミットは `f26e947f8ad51aaaa77b72e873293546de4dda09`（tree `5b8d5710eedd99b494ccb5d0c500fe63032f6016`）。通常用Emlisと分析IFのモデル指定は120u。A49で修理・応募取消・10記録は二者とも適合し、読書会と照明は全体題に原文の裏付けがない意味を加えていたため、B49の開始条件に届かなかった。

全体題は、記録に書かれた文、またはその文の行動・相手・対象・条件を保つ形を、出典の記録に結び付けて確認する。複数記録を「から…まで」でつなぐ場合は元の記録の時刻順も確認する。生成側とCMEEの両方で同じ条件を使い、裏付けを確認できない案の場合も件数題を選択できる。

A49の確定原本から5件を再生し、計画と本文の原文選択はすべてそのまま用いた。関係段階で元の全体題を検査すると、読書会・照明・応募取消の3件で選べず、修理の題と10記録の件数題はそのまま通った。CPUで前者3件の最終選択を件数題にして図と全文を作ったところ、5件で照合した原文28箇所と収録範囲を保った。応募取消はA49で両者適合だった元の題も、v23では自由な言い換えを根拠と結び付けられず件数題になる。

読書会の概要は、11月13日に本人が下書きを保存して共同担当者に確認箇所を伝え、14日に修正・送信して一人の返信を確認した順を示した。照明は10月10日の窓際での約一時間と夜についての留保を第7項目、25日の購入・配線調整後の約三十分を第2項目に、日付付きで表示した。図の項目順そのものは維持した。最初の一時間は図の項目と全文にあり、概要で読めるのは両日の主な行動まで。応募取消の概要は候補選択、応募と受付、取消完了の順を3日分示した。

同じ原文から作った題案28件を生成側・CMEEの両方で検査した。主体、送信先、場所、否定、時期や未実施の状態を取り違えた13案を拒否し、原文と対応する8案を受理した。残る7案は意味が原文と整合しても、記述との対応を確認できず受理されなかった。質問を事実として言い換えた例も拒否した。読書会では「案内の下書きを保存した日と、参加者一人の返信を確認した日」など、原文の事実を含む題でも図・全文を構成できた。照明・応募取消でも、原文に対応する別題が公開図と全文まで届いた。題と表示経路に関係する重点試験190件も通過した。

現行アプリの `SemanticWatashiMap.js`（blob `3c876d31855efaeed9d9eb57387381ef8731c0a1`）と `semanticMapContract.js`（blob `232d99ed07bff0f819e7bda91780b404784d659e`）に対応する解析・配置関数で5図を検査した。図を直接渡す形式と `watashiMap` に包む形式、幅280・340・414で計30通りを照合した。24項目の参照順と枠内配置が一致し、この5図の関係線はいずれも0本。ネイティブ実機での表示試験は未実施。

確定ツリーで分析1,513件、分析のサブテスト11,871件、Piece 666件、Emlis・共有推論336件を再実行し、すべて通過した。分析にはv21・v22・v23の専用試験を含む。GitHubでも同じコミットのAnalysis #44516320483、Piece #44516320399が成功した。

現在の稼働版と同じコードで以前保存した1件、A47・A48・A49の実応答を保存した各5件の計16件を、v23対応APIで読み直した。生成の指定をv23・v22・v21・v20・通常用120uの5通りに設定し、現行・従来の両形式の最新取得と同一IDの詳細取得、計320応答がすべてHTTP 200だった。A49の5件はv22対応APIの同じ20応答も取り直し、16件すべてで図・全文・収録範囲と非公開根拠を照合した。再読時の実モデル呼出し・SQL書込みは各0件。

v23対応コードで生成の版をA49当時のv22に設定し、A49で受領した5件の計画・本文・関係の計15応答を再生した。元の要求と生応答を照合し、元のIDを結び直した5件すべてで図・全文・収録範囲・非公開根拠が一致した。実モデル呼出しは0件。

A49の修理・照明の3段階をもとにCPUで作ったv23形式の2件も、通常APIで隔離DBへ新規保存した。v23対応の同じAPIで5通りの生成指定を試すと、新規2件の40応答はすべてHTTP 200だった。旧コードに切り替え生成指定を通常用120uとした比較では、v22対応APIはHTTP 200が8件、v21対応APIはHTTP 503が8件、v20対応APIはHTTP 503が8件、現在の稼働版と同じコードはHTTP 503が8件だった。元の非公開根拠は保持された。

通常例と留保を増やした例で、それぞれ54段階（MAP 15、分割36、統合3）を模擬応答で再生した。入力と出力予約の合計は最大30,532・32,056トークン（上限32,768）、3段階で共有する出力は最大1,731・3,512（上限4,096）。

開発版v23で追加したファイルは`ai/tests/test_analysis_v23_overview_arguments.py`、`ai/tests/test_analysis_v23_record_summary.py`。GitHubの実ツリーはアプリ・前提資料が5,972ファイル、API開発枝が2,716から2,718ファイル（既存8件を変更、新規2件）。System Contextの固定地図はアプリ1,598、API 2,116の計3,714項目。

同一Pod `dqmg1qgolenq7v` 向けに、A50の5入力と、二者が全5件適合と判断した場合のB50（12記録＋統合）の実行資材を手元で凍結した。送付対象は6点 3,287,135バイト、ZIP 2,785,830バイト・SHA-256 `ce201debb35754630ad35f1d335d700854ce173444452f7f5f123158ab60c095`。同じPod内の原本4点 102,610バイトを再利用する。スコープ SHA-256 `438293d57ded66a6447cb3a337e19720a6954f316658d5b42482859952f27b49`。A50は最大19応答・通常用の復元込み30分、B50は最大43応答・復元込み17分。各1回、追加学習・再試行は各0回。B50を開始する際はA50の原文・生応答・図・全文について二者の判定を照合し、両者が全5件を適合とした場合だけ、4,096バイト以内の判定記録を同じPodへ送る。

凍結済みの実行資材について、架空応答で5入力の15段階、12記録＋統合の39段階を再生した。A50相当5件とB50相当の統合1件を通常API経由で隔離DBへ保存し、別プロセスから同じIDで再読した。この通し試験の実4B呼出しは0。手元の受領用6ファイルはA50の転送明細の正規SHAと一致し、A49の明細SHAと1文字を変えたA50のSHAはともに拒否した。

同じPodでA50の新しい実行許可を照合してから、5件の原文と実4Bが出した計画・本文・関係、公開図・全文を二者で評価する。両者が全5件を適合とした場合のみB50へ進み、12記録の分割・統合と実応答の保存・同一ID再読を確かめる。通常反映では新形式を読み取れるAPI・ワーカーを先行させる。

<a id="analysis-a50-actual-result-20261119"></a>
## 9.174 A50の実4B評価と保存再読（11月19日）

開発版v23（API `f26e947f8ad51aaaa77b72e873293546de4dda09`）で5入力を新規生成した。主担当と独立担当が原記録、PLAN・NODES・RELATIONSの生応答、公開図、全文を個別に読み、同じ4件を適合と判定した。

| 入力 | 二者の判定 | 原本との照合 |
|---|---|---|
| 読書会 | 適合 | 初日の下書き・未送信、翌日の本人による修正・送信、返信一人を日付順に表示。一階の部屋は予約会場、椅子の問い合わせと全員の既読は未確認、会は翌週で未開催と区別した。 |
| 照明 | 適合 | 10月10日の使用停止・購入見送り・窓際で約一時間と、25日の購入・配線調整・約三十分を区別した。夜も同様に描けるか、長期の使用感と作品完成の留保を保持した。一部の説明で原文の文が重なる。 |
| 修理 | 不適合 | 本人の画面修理の完了連絡、未受取・本人による動作未確認、翌日の受取予定は保持した。PLANが両日の弟の記述を選ばず、弟の電話について本人は修理を依頼していないこと、弟自身が電池の相談を送ったかは不明なことが、図と全文の両方から抜けた。A49ではこの区別が残っていた。 |
| 応募取消 | 適合 | 候補二枚、海辺一枚の送信・受付、後日の取消の順を保持した。以前受け取ったメールと現在の取消、未送信の山の写真、今回の再応募意向なし、友人に未連絡を区別した。 |
| 手動10記録 | 適合 | 10項目で人物・行動・本人の意向を各記録に帰属させた。友人とは会わず、恋人と夕食をとったこと、以前思い描いた暮らしと現在の違いを保持した。 |

同じPodで分析15応答と前後対照4応答を取得し、追加学習・再試行は各0回。実行・復元に728.507秒を要した。通常用120uのPID 34858・開始tick 14082961、通常ポート8000の所有・ヘルス、試験ポート18008の閉鎖を確認した。受領ZIPは207,867バイト、SHA-256 `cbbd9befbc0e70106d73adc29cb2fa1934984fc1be910fda41c11f45af0d9410`。

全5件の実応答を通常APIのコードで再生し、隔離SQLに保存した。別プロセスで同じ5件の保存IDを再読し、図・全文・非公開根拠が一致した。再読のモデル呼出し・SQL書込みは各0回。現行アプリの解析・配置関数で、図の2形式と幅280・340・414の30通りを照合した。合計25項目が所定の順で枠内に入り、関係線は0件だった。端末ビルド・TestFlightは保留。

全5件の適合が揃わず、B50開始用の判定記録は発行されなかった。B50の起動は0回。12記録の分割・統合と通常反映は未完。RenderのAPI・ワーカーは引き続き稼働コミット `24bc228d`、Supabaseは38マイグレーション、最新 `20261115011424`。修理で抜けた別人物の行動・確認状態を、計画で根拠を選ぶ段階から検証する。

<a id="analysis-post-a50-participant-coverage-20261119"></a>
## 9.175 分析MAPの計画で、別の人物について両日に残る否定と留保を照合（11/19 JST）

**11/19・分析MAP開発版v24で、A50の修理から抜けた弟の二つの記述を、計画・図・全文で照合しました。** A50の実計画は根拠不足で退け、CPUで両日の原文を補った例は隔離DBに保存し、同一IDで読み戻しました。A51・条件付きB51は準備済み。v24の実4B生成と通常反映は未完です。

A50では読書会、照明、応募取消、手動10記録が二者適合。修理は両日とも本人の行動に選択が偏り、弟の電話まで修理を依頼していないことと、弟が店に電池の相談を送ったかは聞いていないことが抜けた。A50の19応答と通常用120uの復元は§9.174で完了し、B50は条件不成立だった。

開発コミット `de5584e85b5b6ddd67f80ea7e290f1ef4864743a`（tree `ac2312110866f97a672a992926bf3b3942b261b3`）では、通常MAPの計画を作る生成側とCMEEの受入れ側に同じ原文照合を適用する。対象は、異なる記録の思考欄と行動欄で同じ話題が明記され、各日に否定や留保のある記述を一意に特定できる場合。話題から人間関係を推定しない。引用だけの記述、仮定、一日限りの言及、対象が曖昧な場合に、この条件で根拠を追加することはしない。Emlisと分析IFの通常用モデル指定は120u。

原文を替えた対照では、弟を姉・同僚・固有名に替えても、二日分の記述を拾った。修理以外に、参加の意向はあるが予約・提出は確認できていない例でも同じ条件が働いた。日ごとに人物が違う例、一日だけの話、本人だけの行動、単なる所有表現では追加の原文を求めなかった。

A48・A49・A50の各5件の実計画を新しい版に結び直し、再生成を伴わず比較した。A50の修理は両日の根拠を欠き、生成側とCMEEの両方が退けた。ほかの4件の計画は両方で通った。修理に片方の日だけを補う2通りも両方で退けた。A48の修理は両日を扱う元の選択を保って3段階を通り、第三項目に二つの原文が載った。A49の修理は当時の二者判定が適合だったが、後日の短い「弟の相談状況は不明。」だけでは今回の原文条件に足りず退けた。旧版の比較結果はその時点の評価として残す。

本人の画面修理と弟の電話の扱いを図・全文で確かめるため、A50の修理の計画に二つの原文をCPUで追加し、項目の参照番号を対応させた。修理完了・未受取と本人の動作未確認を保ち、各日の項目に弟の別件が表示された。通常APIのコードでこの1件を隔離DBへ保存し、別プロセスから同じIDで現行・従来の両形式の最新取得と詳細取得を行った。v24対応コードとv23対応コードは各4件HTTP 200、稼働版24bc228dと同じコードは4件HTTP 503だった。元の非公開根拠を保持し、再読時のモデル呼出しとSQL書込みは各0。v24による新規生成でこの計画が選ばれるかは未確認。

A50の実応答を保存した5件を、v23とv24の読み取りコードそれぞれで20回、計40回取得した。現行・従来の表示形式で最新と同一IDの詳細が一致し、モデルの再生成とSQL書込みは0件だった。

確定したソースで分析 1,529件、Piece 666件、Emlis・共有推論 336件が成功。分析の11,871サブテストも通過した。EmlisのHTTP確認4条件の一括実行は終了コード137で停止したため、各条件を別プロセスで完了し、この4件を336件に含めた。GitHubでも同じコミットでPiece B2-B/B3/B4/B5 isolated PostgreSQL #44524341332、Analysis observed content #44524341310が成功した。

通常例と留保を増やした例を架空応答でそれぞれ54段階（MAP 15・分割36・統合3）再生した。入力と残り出力予約を合わせた最大トークン数は30,530と32,052（上限32,768）、3段階で共有する出力は最大1,731と3,514（上限4,096）。

A51・条件付きB51では同じPod `dqmg1qgolenq7v` へ6点 3,292,192バイト（ZIP 2,786,603バイト、SHA-256 `e190cf6ac2189de9deadaf70309def4fba57799ad28d6c5bfce1ad59b01fc9f2`）を送り、既存4点 102,610バイトをPod内で再利用する。凍結スコープのSHA-256は `4baf0582a07c91ba0fcf2b285a2c051522824663b0e485943a0a0855014b4cd4`。A51は5入力を最大19応答、通常用の復元込み30分。二者が原文・生応答・図・全文を照合して全5件を適合とした場合のみ、4,096バイト以内の判定記録を同じPodへ送り、B51で12記録の分割と統合を最大43応答、復元込み17分で評価する。各1回、追加学習・再試行は各0回。資材は手元で準備し、A51とB51は未実行。

凍結スコープで架空の実行応答（A51相当15段階、B51相当39段階）を通し、通常APIのコードで5件と統合1件を隔離SQLに保存し、別プロセスから同一IDで再読した。受領用6ファイルは新しい明細に対応し、旧明細と改変した明細を拒否した。この試験の実4B呼出しは0回。

開発版v24で追加したファイルは `ai/tests/test_analysis_v24_distinct_participants.py`。アプリ・前提資料の実ツリーは5,972ファイル、API開発枝は2,718から2,719ファイル（既存7件を変更、新規1件）。System Contextの固定地図はアプリ1,598、API 2,116の計3,714項目。

通常のAPI・ワーカーは11月19日の照合で `24bc228dbf54abc983906323c0ae7d937fae1fd6`、Supabaseの適用済みマイグレーションは38件（最新 `20261115011424`）。v24の通常反映、ビルド・TestFlight・本人実機確認は未実施。

次は同じPodのA51で5入力を新規生成し、原記録・実計画・項目・関係・公開図・全文を二者で照合する。両者が全5件を適合とした場合のみB51の12記録の分割・統合、実応答の保存と同一IDの非生成再読へ進む。通常環境には新形式を読めるAPIとワーカーを先に配置する。

<a id="analysis-a51-actual-result-20261120"></a>
## 9.176 A51でわたしマップの5入力が二者適合し、保存した5件を同じIDから再読（11/20 JST）

**11/20・分析MAP開発版v24のA51で、読書会・照明・修理・応募取消・手動10記録の5件すべてが、主担当と独立担当の原文照合に適合しました。** 修理では本人の画面修理と弟の別件を両日とも区別できました。実応答5件を隔離SQLへ保存し、別プロセスで同じIDから読み戻しました。同じPodで12記録を扱うB51を開始しました。

同じPod `dqmg1qgolenq7v` で承認済みのA51を1回実行した。開発コミット `de5584e85b5b6ddd67f80ea7e290f1ef4864743a`、凍結スコープ `4baf0582a07c91ba0fcf2b285a2c051522824663b0e485943a0a0855014b4cd4`。5入力それぞれで計画・項目・関係の実応答を受け取り、計15応答すべてがHTTP 200・終了理由stopだった。前後各2件のEmlisAI・分析IF対照も元の本文と一致し、計19応答を受領した。学習・再試行は各0回。

主担当と独立担当が、原文、実計画、項目、関係、公開図、全文を別々に照合した。前回のA50で唯一不適合だった修理は、11月8日の「弟の電話まで修理を依頼していない」と、12日の「弟が電池の相談を店に送ったかは聞いていない」を各日の項目に残した。店から本人の画面修理完了の連絡が届いたこと、本人がまだ受け取らず動作も未確認であることと区別できた。

読書会は初日の未送信・翌日の送信と一人からの返信、未開催を保持した。照明は店頭で試した時点と購入・設置後を分け、窓際で描いた約1時間と自宅で描いた約30分をそれぞれの場面に残した。応募は海辺の写真の受領と後日の取下げを時系列で示し、再応募の意向なし・友人へ取消未連絡を保持した。手動10記録は同時刻の出来事を混ぜず、友人とは会わず恋人とは食事をしたこと、最後の行動欄が空であることを保持した。二者の5件すべての判定が適合で一致した。644バイトの判定記録（SHA-256 `8d1df0f2805b522107ca10a496824323c450a61d4615a8c1fb254bdb22db5346`）を使い、同じPodでB51の1回を開始した（PID 37453）。

実応答を変えずに通常APIの実装で5件を隔離SQLへ保存した。別プロセスで各件を同じIDから読み戻し、公開図、全文、網羅情報と非公開根拠の一致を確認した。再読時の追加モデル呼出し・SQL書込み、本番DBへの書込みは各0件。

通常用120uをPID 34858（開始tick 14082961）から元の提供条件でPID 37151（15743369）へ復元した。復元込み739.797秒、試験ポートは閉鎖。実行と復元の受領ZIPは209,434バイト、SHA-256 `409caf36c1a570c0438611ca251e67eb482feafc3bc489bcd0b9bafbe60a032c`。実応答原本のSHA-256は `3ef0f51c89c56f823f5a0d21b957aa926e55f3bc1478fedd2e1a9cb358f727be`。

この時点で通常のRender APIとワーカーはともに `24bc228dbf54abc983906323c0ae7d937fae1fd6` でLive。APIのヘルス確認は初回タイムアウト後にHTTP 200、ワーカーの待機・実行中・期限切れは0件、従前の失敗171件。Supabaseは稼働中で適用済みマイグレーションは38件、最新 `20261115011424`。A51で確認した範囲は架空5入力で、全12記録の統合評価とv24の通常反映はここでは未完。

同じPodのB51で12記録を分割して読み、最終統合を原記録・実応答・図・全文と照合する。適合した統合原本を保存し、別プロセスで同一IDから再読した後、通常API・ワーカーへ新形式を読む版を先に配置し、モデル提供と分析MAPの設定を反映する。

<a id="analysis-b51-actual-result-20261120"></a>
## 9.177 B51で12記録の分割読取りを終え、統合計画の文脈超過を確認（11/20 JST）

**11/20・分析MAPのB51は12記録をそれぞれ3段階で読み終えました。統合の計画は、送信前にモデルの文脈上限を2,142トークン超えたため停止しました。** 12記録の統合図・全文は生成されず、B51の保存・通常反映は未実施です。通常用120uは復元済みで、A51の5件の二者適合と保存・再読の結果を保持しています。

同じPod `dqmg1qgolenq7v` で、A51の二者判定記録に従いB51を1回実行した。12記録を各1件ずつ分け、計画・項目・関係の36応答をすべてHTTP 200・終了理由stopで受領した。開始前のEmlisAI・分析IFの対照2応答を合わせて38応答。統合の3段階と終了後の対照2件は未送信。再試行・追加学習は各0回。

12件の分割応答がそろい、13番目の処理として統合の計画を組み立てた。凍結したトークナイザーと試験時と同じチャット形式で、原本SHA-256 `1a7598a240c77756063280eae636597e94588a9441cad61ffefc25ba3d4ffbfe` のメッセージを再計測した。入力30,814に共有出力予約4,096を足すと34,910となり、上限32,768を2,142超える。実行ログは送信前のこの上限照合で停止し、終了コードは1だった。取得処理は761.938秒。統合の実応答、最終図・全文、統合原本のSQL保存・再読は各0件。

元の通常用120uをPID 37151（開始tick 15743369）からPID 38747（15838823）へ復元した。復元込み833.588秒、試験ポート閉鎖と元のシグナル設定の一致を確認した。回収ZIPは269,842バイト、SHA-256 `8ce1014addf7408af5b3b2de874db94f12caf2dafa831c6f6ad7fae745433da0`。実結果は1,929,199バイト、SHA-256 `c84c2ce43694ec28f4085c8976c717280d6024ffe665cf391af47ba2d4dd9703`。A51・B51の各1回を使用済み。

通常反映時の読み取り互換性も、A51で実際に保存した5件で照合した。隔離環境で稼働版 `24bc228dbf54abc983906323c0ae7d937fae1fd6` のソースを使い、各件の最新・同一ID詳細をv2・v3で各1回取得したところ、全20件がHTTP 503 `analysis_saved_artifact_invalid` だった。開発版v23とv24はそれぞれ全20件がHTTP 200。保存済みの非公開根拠は5件とも不変で、この読取りでのモデル呼出し・SQL書込みは各0件。新しい形式を通常経路から保存する前に、対応する読み取り版をAPIとワーカーの両方に配置する。

通常のRender API・ワーカーは `24bc228dbf54abc983906323c0ae7d937fae1fd6`、Supabaseの適用済みマイグレーションは38件、最新 `20261115011424`。A51・B51に伴う通常配置・本番DB変更は0件。§9.176の架空5入力の二者適合と保存・再読を維持する。12記録の統合は引き続き未完。

B51で保存した12件の分割応答と統合要求を使い、元の記録、修正・留保、各引用の位置、分割応答の照合を保ったまま統合の入力を文脈内に収める。計画・項目・関係の各段階とA51の5件への影響を検証してから、12記録を統合した実応答の評価、保存・同一ID再読、対応API・ワーカーを先行する通常反映へ進む。

<a id="analysis-b52-merge-source-encoding-20261120"></a>
## 9.178 12記録を統合する際の重複する引用を位置参照にし、元の根拠への復元を確認（11/20 JST）

**11/20・分析MAPの12記録を統合する際、元の欄と重複する引用・欄情報を位置参照で送る修正を開発枝へ反映しました。** B51で送信前に止まった計画は、同じ原文と出力予約を保ったまま文脈内に収まりました。A51の5件とB51の分割12件は実応答の再生で照合済みです。B52による新しい統合図・全文の評価と通常反映が残ります。

B51では評価用の架空12記録をモデルが分けて読んだところ、統合の計画を送る前に文脈上限を超えた。原本の入力30,814トークンと出力予約4,096の合計34,910に対し、上限は32,768だった。両担当は12件の原記録と分割応答を読み、最終図・全文が存在しないため統合結果は12件とも判定不能と記録した。B51は§9.177で終了した。

開発版 `290b6f6799764cdbe6479b58a2a4cc420b37fbe9`（tree `3fe52cb1894c6695716e7f2a704d38053d220db8`）は、v24の統合で元欄にある引用文を欄番号・開始位置・終了位置に置き換える。完全な元欄から同じ値を作り直せる欄情報にも位置参照を使う。元の欄・引用の範囲・訂正・留保を保持し、送信用と元の論理メッセージのハッシュを別に照合する。最初の修正 `6f8de911` を隔離環境の通常APIで試したところ、統合結果を組み立てる際に段階の種類を引き継げず、保存へ進めなかった。最終版は、元の要求IDとその原材料に記録された段階を照合し、統合として扱う。旧形式の記録は従来の読み方で扱う。通常の5入力、分割読取り、EmlisAI・分析IF・Pieceのモデル設定にはこの形式を使わない。

B51の実12分割から同じ統合計画を再構成した。新しい送信内容は26,175トークン。予約4,096を含めて30,271となり、従来の入力から4,639を減らし、上限まで2,497の余裕ができた。この計測は統合の最初の計画に対するCPU検証である。モデル生成後に決まる項目・関係の内容や、通常処理の840秒以内の完走は実測前。

修正した版で、A51の実5件（通常入力15段階）とB51の実12件（分割36段階）を再生成せず比較した。送信時の原本・モデル応答の形式と根拠を保持し、A51の5件は図・全文・網羅情報・非公開根拠まで一致した。独立担当は統合の旧形式と新形式で同じ事例の図・出典が一致すること、段階の応答や紐付けを改変した18例を退けることも確認した。

12記録の保存経路は、B51で受け取った分割36応答に、検証用に用意した統合の計画・項目・関係3応答を組み合わせて確認した。この3段階の入力と出力予約の合計は順に30,271、28,038、28,731トークン。凍結したB52の資材を使い、通常APIの実装で隔離SQLへ1件保存した。別プロセスから最新と同一IDの詳細を新旧の表示形式で計4回読み、図・全文・非公開根拠の一致を確認した。新しいモデル生成、本番DBへの書込みは各0件。実際の統合応答を保存した結果はまだない。

同じ実36応答と検証用統合3応答を使った先行の保存例でも、最新と同じIDの詳細を現行・従来の形式で読み、最終候補と直前の開発版v24ではそれぞれ4件ともHTTP 200、稼働版 `24bc228d` のコードでは4件ともHTTP 503を確認した。非公開根拠にある新しい統合応答からの再組立は最終候補で成功し、直前のv24は段階の照合で拒否した。再読時のモデル呼出し・SQL書込みは0件。

最終ツリーで分析1,561件（サブテスト11,871件）、Piece 666件、Emlis・共有推論336件の計2,563件が成功し、失敗・エラー・スキップは0件だった。GitHubでも同じコミットのAnalysis #44579349812とPiece #44579349940が成功した。

同じPod `dqmg1qgolenq7v` 向けにB52を1回分準備した。送付4ファイル・展開後2,829,173バイト、ZIP 2,710,102バイト（SHA-256 `a2826ce8281dda63dd96617c3c7ba2d20d808b70468159b92d89e9c11eb29d3b`）。同じPodの既存6ファイル・523,922バイトを用い、スコープSHA-256は `def531f0bb4a399324612827ffc8682c7c0f91b429da573d2ee2bd0cc8410ef9`。A51の実5件の二者判定と、B51の終了・復元を照合して開始する。12記録の分割36段階・統合3段階・前後対照4件で最大43応答。通常経路の公開図・非公開根拠までの実処理は840秒以内、試験全体は元120uの復元込み20分。B52は未実行で、新たな学習・再試行は各0回。

B51後のv24の履歴統合に `ai/services/ai_inference/analysis_merge_wire.py`、`ai/tests/test_analysis_merge_wire.py`、`ai/tests/test_analysis_merge_transport.py` を追加した。アプリ・前提資料は実ツリー5,972ファイル、API開発枝は2,719から2,722ファイル（既存4件を変更、新規3件）。System Contextの固定地図はアプリ1,598、API 2,116の計3,714項目。

通常用120uは§9.177の復元時点でPID 38747・開始tick 15838823。通常のAPI・ワーカーは `24bc228dbf54abc983906323c0ae7d937fae1fd6`、Supabaseは38マイグレーション（最新 `20261115011424`）。この開発コミットの通常配置、12記録の統合原本の保存・同一ID再読、ビルド・TestFlight・本人実機確認は未実施。

同じPodでのB52一回の承認後、原記録12件から分割・統合を通して新しい図・全文を作り、通常処理の840秒と原文との意味の対応を確認する。二者の照合を通った統合原本を保存して別プロセスから同一IDで再読し、対応版のAPI・ワーカーを先に配置してから通常のモデル選択を反映する。

<a id="analysis-b52-prestart-operator-20261120"></a>
## 9.179 B52の開始前照合と、通常用120u・試験用の起動設定を分けた差分（11/20 JST）

**元の送付物と開始前の状態。** §9.178で確定した元のB52送付ZIP（2,710,102バイト、SHA-256 `a2826ce8281dda63dd96617c3c7ba2d20d808b70468159b92d89e9c11eb29d3b`）を同じPod `dqmg1qgolenq7v` に送り、照合した。開始前、通常用120uはB51で復元したPID 38747・開始tick 15838823で、通常ポート8000の状態確認はHTTP 200だった。B52用の作業ディレクトリと起動記録はまだ作成されていなかった。稼働中のプロセスの環境を試験側へそのまま渡す旧起動方法を確認し、起動前に止めた。この時点でB52の起動・モデル要求・学習・再試行はいずれも0回。

**変更した起動方法。** 通常用120uの復元に必要な起動引数・モデル・重みは、新Podへの初回復元（§9.147）の記録から固定した。起動引数のSHA-256は `9f9e87467cca41c22f0e58f1bdc2a26d1d8402b6f317d2055331ce953fca5177`。試験の事前確認・生成側には明示した設定と試験内の一時認証を用いる。通常用サービスの認証情報はPod内の既存専用ファイルから復元時にだけ使う構成とした。開始前の照合では専用ディレクトリ0700、ファイル0600、所有者の一致を確認した。認証値の外部転送は0。親プロセスの環境を継承しない条件で、同じPodのPyTorch 2.8.0+cu129がRTX 4000 Adaを認識した。この確認は推論前に行った。

**差分と範囲。** 差分ZIPは23,080バイト、SHA-256 `3f777028f197c84f1cffa832907db8e3f1587afd34009873dbd313343665944d`。実行担当・復元確認・範囲定義の3ファイルを合わせて展開後73,223バイト。新しい実行範囲は `5de410898e143ed5c4655131f705399726e564683d4bf7fb0f8cb588b28de935`、元の範囲は `def531f0bb4a399324612827ffc8682c7c0f91b429da573d2ee2bd0cc8410ef9` である。開発版 `290b6f6799764cdbe6479b58a2a4cc420b37fbe9` のAPIソースと目録2点、既存の入力・対照等5点を同じPod内で引き継ぐ構成。モデル要求の組立・分割・統合処理は同じで、1回・12記録、最大43応答、通常処理840秒・元提供の復元まで20分という評価条件を維持した。手元では初回準備の成功と、差分・引継ぎ資料の不一致、過去の起動記録、既存作業ディレクトリ、異なるPodの各停止を照合した。

**通常環境と引き継ぎ。** RenderのAPI・ワーカーはいずれも `24bc228dbf54abc983906323c0ae7d937fae1fd6` が稼働中。APIの状態確認は初回の503に続いて200、ワーカーの集計で待機・実行中・期限超過は各0。Supabaseのmigrationは38件、最新 `20261115011424`。B52で新たに生成した統合図・全文、二者による内容判定、同じ原本の隔離SQL保存・再読、通常提供への反映はいずれも未実施。差分の送付・実行判断では上記の新しい範囲を参照する。

<a id="analysis-b52-actual-result-20261120"></a>
## 9.180 B52は12記録の分割と統合計画まで実生成し、統合項目の応答待ちで840秒に到達（11/20 JST）

**12記録を読んだ結果。** 同じPod `dqmg1qgolenq7v` で、§9.179の差分を送付し、B52を1回実行した。前対照の後、12記録を分けて読んだ計画・項目・関係の36応答を取得した。全36応答がB51の同じ記録・段階で受け取った実応答と一致した。B51では送信前に止まった統合計画を、B52では入力26,175トークン、出力予約4,096トークン、合計30,271でモデルへ送信できた。HTTP 200、143.52秒で2,117トークンの計画を受け取った。

**統合項目での停止。** 次の統合項目は入力30,144トークンと出力予約1,979トークンで送信された。通常処理は840.045秒で期限に達し、項目の応答を受領する前に通常サービスがHTTP 504で終了した。統合の関係、公開図、全文、非公開根拠の最終投影には到達していない。統合計画は実応答として保管し、項目・関係や完成図を補作しない。

**統合計画の内容。** 計画の第9項目は、記録5で家族の荷物を整理した場面に、記録6で展示の説明文を直した時の引用を組み合わせた。第12項目は記録11の読書会に、記録4の照明と記録7の配信文の引用を含めた。第8項目では、記録12の買い物・休息の場面と、以前の記録10の「家族から新しい連絡は来ていなかった。」を一緒に選んだ。記録12当日には、家族から寸法図について連絡が来ていた。別の出来事を一項目に束ねることと、以前の状況を後日の場面へ持ち込むことが、受領した計画で確認できる。主担当と独立担当は原記録12件、分割の各段階と統合の実計画を別々に読んだ。完成図・全文の表示判定は両者とも全12件で判定不能とした。

**時間と復元。** 統合計画を受領するまでに、前対照を除いた通常処理の時計で794.207秒が経過し、項目の送信準備前に45.793秒が残っていた。実際に送信した40件は、前対照2件、分割36件、統合2件。受領は39件で、統合項目の応答と後対照は未取得。ドライバーは終了コード1。通常用120uの復元まで978.877秒、復元PID 40448、開始tick 17042965、試験ポート18008の閉鎖を確認した。追加学習・再試行は各0。受領ZIPは400,441バイト、SHA-256 `d0988452887c5356938cbb84ff92550f8269341b026a7d5c3fab7443eaa95d35`。実応答原本は2,388,781バイト、SHA-256 `4eae1ecfd4de8446c8502137734db2ec81b9494236c6f62d09cbe8f534dd54ea`。

**保存と通常反映。** 今回の実応答から完成した統合図が得られず、B52の同一原本のSQL保存・別プロセス再読は各0。試験前にB51の分割実応答36件と模擬の統合3件を隔離SQLに保存・再読した確認は、B52の実統合とは分けて記録する。通常API・ワーカーはともに `24bc228dbf54abc983906323c0ae7d937fae1fd6` がLive、Supabaseは38マイグレーション（最新 `20261115011424`）。B52の1回枠は終了した。次は統合計画の引用と出来事・時点の対応、および統合の3段階から公開図・非公開根拠までを通常の840秒内で返す処理を改善する。

<a id="analysis-history-merge-repair-20261120"></a>
## 9.181 12記録の統合計画で出典を記録ごとに結び、分割結果の再構成と生成制約の待ち時間を短縮（11/20 JST）

**出来事と時点を保持する変更。** B52の実計画は、以前の家族からの連絡状況を後日の場面へ混ぜ、荷物整理と展示説明を一項目に束ねた。開発版 `facdced0395883a8c5b4a5e1d0e50960b0a2426e` では、新しい履歴統合の要求に送信形式の版を付ける。今回の12記録には各記録の原文を起点とする項目を割り当て、同一項目に別の出来事の引用を混入させる選択を、提供側の生成制約とCMEEの応答確認の双方で退ける。別々の記録にある出来事の根拠を保った比較は関係として表せる。B52の実計画を変更せず渡すと、以前の方式はそのまま読み、新方式は提供側・CMEEとも記録の混在を拒否した。同じ人が10月10日と25日に書いた照明の記録、10月28日と11月3日に書いた家族の寸法図に関する記録の二つの比較は、両日の根拠を分けたまま新方式で成立した。12件に個別に割り当てられない場合の柔軟な割り当ても試験した。

**通常処理の時間。** B52では統合計画を受領した時点で、通常の840秒のうち残りは45.793秒だった。通常サービスで12記録の親資料を組み立て直す箇所を直し、同じ入力・分割結果を使う一連の処理内で再利用する。B51の分割実応答36件と検証用の統合3応答を旧方式で再生すると、親資料の組立ては50回から1回に減った。モデルとの39組の送受信内容、成果物ID、図、全文、網羅情報、非公開根拠は一致した。同じCPU経路の経過は313.773秒から14.907秒だった。

**提供側の生成制約。** 履歴を統合する一回の生成では入力が固定されている。次のトークンを制限する際、固定された長い入力を毎回キーに含める処理を省き、生成済みのトークン履歴を使う。元の提供環境と同じライブラリ版を使い、B52で実際に受け取った統合計画の全文を再びトークンに分けて、終了を含む2,115位置で全248,077候補の許可集合・順序・終了判定の一致を照合した。許可集合の計算に使ったプロセスCPU時間は65.75秒から27.78秒、最大常駐メモリは2,373,056 KiBから559,916 KiBだった。モデルが報告した生成数は2,117トークンで、保存された全文の再符号化は2,114トークン＋終了。実生成時の各トークンID列は保存されていない。最終版の新しい送信形式でも、模擬の統合計画1,083位置・項目1,477位置・関係334位置（計2,894位置）の全許可集合と順序が一致し、各段階の終了まで受け付けた。GPU上の新しい生成時間は未測定。

**互換性と保存。** A51の5入力15段階とB52の12分割36段階では、実送信の本文・生成制約・応答の読取りが一致した。以前の方式で保存した実際のA51の5件と検証用統合1件は、最新表示と同一ID詳細を新旧二つの表示形式で計24回読み、すべてHTTP 200で保存内容が一致した。検証用に組み立てた新形式の統合は、12項目・36引用・2関係。計画・項目・関係の実入力と予約の計は順に30,411、29,696、30,120トークンで、32,768以内だった。正式コミットの手元検証では、B52の分割実応答36件と模擬の統合3件を使い、公開図・非公開根拠の投影まで21.5005秒。候補の通常APIから隔離SQLへ1件を保存し、別プロセスから同じID `842ae5bb-9d75-471e-8825-4379abea696d` をHTTP 200で再読し、図・全文・非公開根拠が一致した。再読時の生成・書込みは0。新しいモデル応答、本番DBへの書込みは各0。

**試験・地図・通常環境。** 中間版 `bd8f6b36` のAnalysis CIは新しい生成制約の試験を収集する際にNumPyがなく停止した。最終版はAnalysisとPieceのCIに必要なNumPyの版を固定し、提供コード249ファイルの内容が中間版と一致することを照合した。最終コミットに対するGitHubのAnalysis（44615890640）、Piece（44615890637）はともに初回で成功した。B52を実行した `290b6f67` との差分は既存11ファイルと新規試験 `ai/tests/test_analysis_merge_constraint_prefix.py` の1件。Cocolonの追跡ファイルは5,972件、APIは2,722件から2,723件になった。通常のAPI・ワーカーは `24bc228dbf54abc983906323c0ae7d937fae1fd6` のまま稼働中で、Supabaseは38マイグレーション、最新 `20261115011424`。

**B53の送付・実行範囲。** 同じPod `dqmg1qgolenq7v` 向けに、実行・復元・入力・対照・候補ソース249件を含む10ファイルを一つのZIPにまとめた。展開後3,366,245バイト、ZIP 2,826,953バイト、SHA-256 `0cf51b6b096fff00598ef3682fd0a30be20d1930b1f8627c70fc976143fc5e73`。実行範囲SHA-256は `4cebe42f26d687f217c311083450b49eca3d0b7f0d9aa8a57ff66cfed3ae4214`。元120uはB52の復元時のPID 40448・開始tick 17042965に結び付ける。B53は1回、12記録の分割36段階・統合3段階・前後対照4件で最大43応答。通常処理の公開・非公開投影まで840秒、元サービスの復元まで20分。追加学習・再試行は0。正式に凍結した受領手順でも、同じ模擬統合の保存IDを別プロセスから再読してHTTP 200、再生成・書込み0を確認した。B53の送付・実行はまだ行っていない。承認後、実際の図・全文を原文と二者で照合し、適合した同一原本を保存・再読したうえで、対応する通常API・ワーカーを先に配置し、モデル選択を反映する。

<a id="analysis-b53-actual-result-20261120"></a>
## 9.182 B53で12記録の統合計画の引用が元の記録に揃い、項目生成は4件目の途中で終了（11/20 JST）

**12記録の分割と統合計画。** §9.181の送付物を同じPod `dqmg1qgolenq7v` に送り、開発版 `facdced0395883a8c5b4a5e1d0e50960b0a2426e` でB53を1回実行した。EmlisAIと分析IFの前対照2応答の後、12記録の分割では各3段階、計36応答を受領した。全36段階の送信内容・HTTP応答本文はB52と一致した。統合計画では26,315トークンの入力と4,096トークンの出力予約を送信し、HTTP 200、129.400秒、2,189トークン、終了理由 `stop` で12項目すべてを取得した。

B52では、家族の荷物整理と展示説明、以前の家族からの連絡状況と後日の買い物・休息などを同じ項目に入れた。B53の実計画は項目1〜12で元の記録1〜12の引用をそれぞれ選び、計72件の引用のすべてが該当する記録に結び付いた。

**内容の照合。** 主担当と独立担当は原記録12件・分割実応答・統合計画・途中までの項目本文をそれぞれ読んだ。案内資料の記録では、会議後に担当者へ問い合わせ、昼過ぎに回答を得てから短い案を送った。計画は回答と送信を選ばず、途中の項目は「その場で確認した窓口」と書いて確認した時点を取り違えた。照明の記録は2日を別の項目にできたが、初日に窓際で約1時間描いたこと、後日に照明を購入・取り付けて約30分下書きしたことは計画に選ばれなかった。両担当とも、完成した表示の適否は12件すべて判定不能とした。

**項目の途中で止まった結果。** 統合項目の入力は30,306トークン、出力予約は1,907トークン、合計32,213で文脈上限32,768に収まった。HTTP 200で87.268秒後に1,215トークンを受け取ったが、終了理由は `length` だった。最初の3項目に続き、4項目目の2番目の単位で、照明を見に行った店で店員が別の型を勧めた理由に関する引用の途中でJSONが切れた。通常サービスはHTTP 503 `analysis_model_source_unavailable` で終了し、関係の要求は送信していない。前対照を除いた通常処理は793.387秒。840秒の期限まで46.613秒残っていた。この項目に対して要求した生成時間は85.397秒。提供側が返した終了理由は `length` で、内部の停止要因を一つに特定する結果はない。手元で同じ実計画・既存の項目形式から、短い値と空の任意リストを使って12項目を構成すると、構文上受理される例でも2,078トークンで、今回の予約1,907を171トークン超えた。公開図・全文・非公開根拠の最終投影は未成立。

**実行と復元。** モデル要求は前対照2＋分割36＋統合2の計40件で、すべてのHTTP応答を受領した。統合項目の応答本文は上記の途中までで、後対照は未実施。元の通常用120uを933.373秒で復元し、PID 42240、開始tick 17581293、試験ポート18008の閉鎖を確認した。ドライバー終了コード1、追加学習・再試行は各0。受領ZIPは406,177バイト、SHA-256 `b6e3fde363284a2e13fe02bf1dda90d31e30dff10c61bb53337a7ee317858fe3`。実応答原本は2,399,735バイト、SHA-256 `36e89ab79eaf34b714aa7fd3b1f721520474ebd57912eeca1f9060b9bec73f71`。

**保存と通常反映。** 試験中に完成した統合原本がなく、今回の実原本を用いた隔離SQLへの保存・別プロセスからの同一ID再読は各0。通常のAPI・ワーカーはいずれも `24bc228dbf54abc983906323c0ae7d937fae1fd6` がLive、Supabaseは38マイグレーション（最新 `20261115011424`）。B53の1回枠は終了した。統合項目に必要な出力量と時間、各記録の結果・時点の扱いを改善し、実際の図・全文の二者照合、同一原本の保存・再読、通常モデル選択とAPI・ワーカーへの反映が残る。

<a id="analysis-b54-merge-nodes-preparation-20261120"></a>
## 9.183 履歴統合の応答で繰り返す原文・構造を短く表し、行動欄の経過を計画に残す変更（11/20 JST）

**B53の実応答から直した箇所。** 前回は12記録の統合計画で72引用の出典が元の記録に揃ったが、案内を送った時点や照明を買って使った経過が落ちた。統合項目は4件目で切れ、公開図・全文にならなかった。変更対象は、統合の各段階で同じ引用・欄名・項目番号を再び生成する手間と、原記録の行動欄の選び方である。

**原文と応答の扱い。** 新しい履歴統合の計画・項目では、同じ要求内で元の文を一つに定められる場合に限り、長い引用を冒頭と末尾で識別できる短い表記にする。項目と単位の位置、すでに確定した根拠との対応を利用し、元の文章や構造へ戻せる。モデルが選んだ引用、出来事の捉え方、見出し、意味、未確定事項は応答に残す。B53で途中まで受け取った項目を完成扱いにせず、以前の形式で保存した原本はその形式で読む。

**根拠を揃えても残る内容の課題。** 受領済みB53の計画は、72引用のうち行動欄から採ったものが4記録・8引用に限られた。今回の12記録では、短い原文の行動欄を文ごとに根拠に残し、思考欄からもその記録に固有の根拠を選ぶ。適用対象には、原文の行動欄が160文字以内で1〜4文に分かれ、独立した思考欄が160文字を超えることなどの条件がある。行動欄には人が実際に行ったこと、希望、辞退、別の人から聞いたこと、未確定のことが書かれるため、欄にあることだけで本人の実行と決めない。

正しい根拠を揃えた検証例で、会議後に問い合わせて昼過ぎに回答を受け、その後に短い案を送った経過を「会議中に窓口名を確認し、その場で短い案を送った」とする誤った文章を、提供側とAPIの双方が受け付けた。B54の評価では、実際に表示される図・全文で時点、行為の主体、完了と未確定が保たれるかを、主担当と独立担当が原文から照合する必要がある。

**公開図を作る処理。** 中間版では、代表例の統合3応答を受理した後、公開図の組み立てで新形式の生応答に旧形式の `nodes` 欄を直接求めて停止し、SQL保存まで進まなかった。最終版は、検査済みの論理項目から各単位の根拠を取り、受け取った原応答は形式ごとの元のバイトで保存する。

**関係を作る際の入力と留保。** 中間版 `faf98749` では、高密度の72引用、24単位の留保と2本の関係を含む検証例で、関係の入力30,966トークンと残りの出力予約2,035の合計が33,001となり、文脈上限32,768を233トークン超えた。最終版は、すでに示した原欄の引用と留保を位置で参照し、モデルが元の否定・条件・時点を含む全文に戻って読めるようにした。同条件の検証で関係の入力は26,248、出力予約は2,035で計28,283となり、上限まで4,485トークン残った。公開図と非公開根拠には、元の文と、モデルが選択した留保・関係を使う。

**出力予算の限界。** 96引用・24単位、48件すべてに長い部分引用の留保を付けた。最初の例は提供側の出力文法とAPIの応答検査を通り、関係の出力予約1,473トークンに対し、2比較は1,212、6比較は1,570（97超過）だった。通常の公開図の組み立てでは、2比較でも項目5と項目11で同じ欄・同じ留保短句を重ねたため、保存前に拒否した。留保に元の引用全文を参照する別の例は254トークンである。

重なった2箇所を直し、留保48件と比較対象を保って通常経路で再検証した。2比較なら関係は1,206トークン、3段階計3,829で、共有上限4,096まで267残り、公開図・非公開根拠が完成した。6比較では関係1,564、計4,187で91トークン超過し、通常経路が拒否した。実際の生成にも同じ上限を適用し、途中で切れた応答は採用しない。

**開発枝で照合した範囲。** 最終コミットは `aba13cfc6a3f1b870e1196f12fcb7b3118c33e6f`、ツリーは `c2a395539101858e9204266598fbdb85f78545ae`。B53の実行版から既存9ファイルを変更し、履歴統合の応答を読む処理と試験2件を加えた。APIの追跡ファイルは2,723件から2,726件になった。確定版で、行動欄の対象41文から1文ずつ外した41例はすべて拒否し、5通りの順序で750件の引用表記が元の文に一つずつ戻ることを確認した。関連する開発試験70件、通常経路の回帰174件、主担当が三中核から選んだ回帰168件が通った。各回帰群には重なる検査がある。

A51の5実原本・15段階とB53の分割36段階を旧版・新版で再生し、送受信、提供側が許す出力、APIの読み取りが一致した。A51の5件は公開図、全文、網羅、非公開根拠も一致した。A51の5実保存と旧統合形式2版の合成保存各1件は、最新版表示・同じIDの詳細表示を公開形式v2/v3で確認し、28回すべてHTTP 200、再生成・再書込は0だった。

**通常経路を用いた手元検証。** B53で実際に受け取った分割36応答を再生し、統合の計画・項目・関係の3応答だけを検証用に構成した。再生・隔離保存に用いたCPU検証用の実行範囲と、実行用ZIPの範囲識別子は分けて記録する。表の各段階は「入力＋その時点の出力予約」のトークン数、生成合計は検証応答の再符号化による値、時間はCPU再生開始後に公開・非公開投影が完了するまでの実測である。実B54の生成速度は未測定。

| 検証例 | 計画 | 項目 | 関係 | 統合3段階の出力合計 | CPU再生・投影 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 36引用・24留保 | 24,204＋4,096 | 23,730＋3,625 | 25,355＋2,557 | 1,919 | 70.032秒 |
| 72引用・24留保 | 24,204＋4,096 | 25,952＋3,235 | 26,248＋2,035 | 2,442 | 20.433秒 |
| 96引用・48留保 | 24,204＋4,096 | 27,428＋3,011 | 27,871＋1,473 | 3,829 | 26.145秒 |

各例の公開・非公開投影で12項目・24単位と原文の行動41文を確認した。候補の通常APIから隔離SQLへ保存し、別プロセスで同一IDの図、全文、網羅、非公開根拠が一致した（36引用は `8da57572-cd6c-45c1-be9a-7c890c596931`・72引用は `d5d64583-f6a5-4ee9-bbb2-05652ede71dc`・96引用は `a0f4981e-6ae9-44b7-b8f2-22eb264e6c61`）。各例で保存1件と月次参照1件、再読時の生成・書込は各0だった。実行用ZIP確定後にも、正式な受領側から各保存を別プロセスで読み直し、3件とも同じID、認証済みHTTP 200、非公開根拠の一致を確認した。B53の実原本と従前のCPU検証用実行範囲を、新規B54の結果として受理しないことも確認した。

**実行範囲と通常環境。** GitHub上の最終コミットに対する [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44631513933)（44631513933）と [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44631513835)（44631513835）が成功した。B54は分割12件・統合1件の計39段階、前後対照を含め最大43呼出し、通常処理840秒・復元込み1,200秒、学習・再試行各0の1回分を、同じPod `dqmg1qgolenq7v` 用の一体ZIPに固定した。実行範囲のSHA-256は `6752d91f8f1b528d4199583737f30ee151b8a7cf4d31fb820ba058a8e0cfda5a`。ZIPは2,841,353バイト（展開3,390,194バイト、10ファイル、候補ソース250件）、SHA-256 `b24b7f9a8afa4167467375050c2f7d1cdf2d1556fae2a6b2ddb1ac851567c405`。受領・検証を含む正式目録のSHA-256は `937ecdaa47d51f5fa7cd8d5d2334373d8d508818ac552a8274b38d133deeee04`。B54のPodへの送付、起動、モデル呼出し、実結果の保存、通常採用は各0。

通常のRender API・ワーカーはいずれも `24bc228dbf54abc983906323c0ae7d937fae1fd6` がLive。Supabaseは稼働中でマイグレーション38件、最新 `20261115011424`。B53で復元した通常用120uはPID 42240、開始tick 17581293。次の実行で原記録12件と実際の図・全文を二者で照合し、採用できる同一原本を隔離SQLに保存して別プロセスで再読する。その後にAPI・ワーカー双方へ対応する読み取り処理を先行配置し、通常のモデル選択を切り替える。

<a id="analysis-b54-actual-result-20261120"></a>
## 9.184 B54で12記録の実生成が完走し、図と全文の照合で条件と時系列の誤りを確認（11/20 JST）

**実行と復元。** §9.183の確定ZIP（2,841,353バイト）をPod `dqmg1qgolenq7v` に送付し、開発版 `aba13cfc6a3f1b870e1196f12fcb7b3118c33e6f` でB54を1回実行した。前後対照4応答と、12記録の分割36応答・統合3応答を受領した。計43呼出し、追加学習・再試行は各0。通常処理の開始から公開図と非公開根拠の投影まで784.810秒（上限840秒）、元120uの復元まで990.734秒（上限1,200秒）。復元後はPID 44334、開始tick 18137381。試験ポートの閉鎖と元サービスの提供契約の一致を確認した。

**実際の図と全文。** 12記録すべてを処理し、12項目・24単位・71引用で、原記録の行動欄の41文を保持した。全文は2,408文字、関係は0件。照明は初日に購入を見送ったことと、後日に購入して使ったことを別の項目で表示できた。統合3応答はすべて終了理由 `stop` だった。

| 統合の段階 | 入力トークン | 出力予約 | 実際の出力トークン | 応答までの秒数 |
| --- | ---: | ---: | ---: | ---: |
| 計画 | 24,204 | 4,096 | 765 | 55.241 |
| 項目 | 25,851 | 3,331 | 1,734 | 114.498 |
| 関係 | 27,090 | 1,597 | 302 | 35.203 |

**原文との照合。** 主担当と独立担当がそれぞれ12記録の原文、分割・統合の実応答、図、全文を確認した。2件目の会場では、当日は点検予定があり、昇降設備を使えるかは二日前に確定する。生成した「点検の予定がある日だけ使えるかどうかは、二日前に確定するという。」という見出しには、元の説明にない「だけ」が加わった。見出しは公開図と全文の両方に表示された。7記録の図では同じ行動欄の文順が変わった。例えば1件目は問い合わせの後に返答を得て案を送ったが、図の説明では送信、帰宅後の保存、打合せと問い合わせの順になっていた。主担当は2件、独立担当は8件を適合とし、両者が適合としたのは3・12件目だった。12件すべてでの採用条件は満たさなかった。

**保存と通常運用。** 受領ZIPは505,815バイト、SHA-256 `eeb07c5a3716f54825cb1609754fae8c95bf21bdfdeecd63122fe55b4910a47a`。実応答原本は2,859,962バイト、SHA-256 `edb920c245cf5cb986adb804215b9e12b3f5eea75c397aff3a99723912c46a1f`。B54の実行・復元・二者照合は終了した。今回の実原本の隔離SQL保存、同一IDでの別プロセス再読、本番DBへの書込み、API・ワーカーと通常モデル選択への反映は各0。条件の意味と経過の順序を保つ修正、その修正での実表示の照合、適合した実原本の保存と再読、通常反映が残る。

<a id="analysis-b55-preparation-20261120"></a>
## 9.185 履歴分析の見出しを選んだ根拠に結び、同一の行動欄を元の文順で表示する変更（11/20 JST）

**見出しと本文。** B54では点検条件の見出しに「だけ」が加わり、7記録の図で行動の並びが変わった。統合の新形式（MERGE v4）は、各項目の見出しを、その項目に選んだ根拠にある完結した文か、記録を指す見出しから選ぶ。同じ記録の行動欄のうち、元の位置を一つに定められる文は、その欄の順に表示する。全文で要約や見出しに後の行動が含まれていても、説明にあるその行動を先頭へ移さない。異なる記録や欄には、それぞれの根拠との対応を保つ。

**分割段階と記録間の比較。** 現行v24の分割でも、同じ記録の思考・行動の2欄を使う新しい項目生成では、見出しを選んだ根拠に結び、意味欄は選択した思考の完結文か空欄とする。統合計画は、行動欄から分からない話者と発言を同じ記録の思考欄で読み、判断が変わった日ごとに当時の条件を選ぶ。関係を作る段階では、同じ対象について両日の原引用から具体的な条件と行動を説明できる場合にその組を選ぶ。根拠が足りない場合は関係0の応答も受け付ける。

B54の実入力で、8件目の「店では、友人が最近始めた勉強の話をした。」と、10件目の家族が本人の一人で使う時間を増やしたいと語った一文を、分割の引用にない思考欄原文から選べることを確認した。この2箇所を選ぶ検証用計画、照明を見送った日と予備のお金・設置条件を確認して購入した日を結ぶ比較、関係を空にした応答は、それぞれ提供側とAPIの検査を通った。これらはCPU側で与えた選択で、実4BのB55の応答はまだ得ていない。

**互換性と検証。** 開発版は `e53982490f9e34a46715d8b762d8d9a97d6d0bfc`。B54版から変更したのは既存12ファイルで、追加・削除は各0。

同じ候補で36・72・96引用の検証例を作ると、統合3応答の合計は1,928、2,451、3,898トークンだった。上限4,096まで各2,168、1,645、198トークン残った。最大例は留保48件・比較2件で完走した。同じ例で比較を6件にすると構文は受理されたが、合計4,256で上限を160超え、通常処理は拒否する。参考として、先のB54で実際に生成した統合3応答は計2,801トークンだった。

**保存と再読。** 最終コミットで各検証例を通常APIから隔離SQLへ1件ずつ保存し、別プロセスで同一IDを再読した。3件すべてHTTP 200で、図・全文・網羅情報・非公開根拠が一致し、再読時の生成・書込みは各0だった。36引用のIDは `ab911404-7984-4616-b2e4-952ee2af6e66`、72引用は `8c178edd-c481-463b-b6c0-a8340474b21b`、96引用は `c3be4d53-290b-4e31-9f94-1ad41eb0d49b`。3件ともアプリ側の現在表示・詳細表示・図の読取りを幅320、390、768で検証した。実機表示は未確認。B54の受領済み実応答とA51の保存済み5実原本をそれぞれ当時の形式で再生し、表示内容の一致を確認した。B54の実原本は二者照合で採用を見送り、SQL保存は0件だった。

対象の回帰129件が通った。別にEmlisAIの本人訂正、Pieceでの原文の扱い、既存の分析IFを含む回帰130件も通った。最終コミットに対するGitHubの[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44641195487)と[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44641195467)は初回で成功した。

**B55の送付と実行範囲。** 同じPod `dqmg1qgolenq7v` 用の確定ZIPは2,842,907バイト（10ファイル、展開3,392,906バイト）、SHA-256 `409e35e2b2596230a5887da174983fffdb36162cfd31151706119c9f4ebf1a74`。実行範囲のSHA-256は `bd2480e318446f33d1c74e65321798327fca59f9b9e664a233ff97c98a78e9b9`。元120uのPID 44334・開始tick 18137381に結び付けた。B55一回分は同じ架空12記録の分割36段階・統合3段階、前後対照4件を含め最大43呼出し。通常処理840秒、復元込み1,200秒、追加学習・再試行は各0。Podへの送付・起動・通常採用は未実施で、ZIPの送付とB55の一回実行は別承認とする。

正式な受領手順でも、三つの保存IDと非公開根拠の一致を別プロセスから再確認した。各HTTP 200、読取時の生成・書込みは各0。B54の実応答原本と先行CPU検証の実行範囲をB55の実結果として受け付けないことも確認した。

受領・検証を含む正式目録は113ファイルを収録、18,403バイト、SHA-256 `bd8705362c372d520f974687ab38067b2868f24c1dac825780ead1e6d0749903`。

<a id="analysis-b55-actual-result-20261120"></a>
## 9.186 B55の実生成で会場の条件と項目説明内の行動文順が回復し、他者の発言と記録間の比較が残った（11/20 JST）

**実行と復元。** §9.185の確定ZIP（2,842,907バイト）を同じPod `dqmg1qgolenq7v` に送付し、開発版 `e53982490f9e34a46715d8b762d8d9a97d6d0bfc` でB55を1回実行した。架空12記録の分割36応答、統合3応答、前後対照4応答の計43呼出し。通常処理の開始から公開図・非公開根拠の完成まで788.875秒、元の120uの復元まで997.626秒だった。復元後はPID 46663・開始tick 18538188。試験ポートの閉鎖を確認し、追加学習・再試行は各0だった。

**実表示。** 12記録すべてを処理し、12項目と2,599文字の全文を生成した。記録2の家族の食事会では、見出しに「店へ電話すると、階段の横に小さな昇降設備があると教えてもらった。」を選び、本文で当日の点検予定と二日前に可否が確定することを示した。B54で生じた誤った限定「だけ」は消え、12項目の説明内では、行動欄の全41文がそれぞれ元の順序で表示された。全文の各項目を見出しから読み、行動文が最初に現れる順を数えると、原文順は12記録中10件。8・12件目では後の行動文が見出しにも使われて、先に現れた。

8件目は本人が友人から勉強の話を聞いたことまでを示し、最近勉強を始めたのは友人であることを表示しなかった。10件目は本人が希望と購入の判断を分けたいと話したことを示す一方、家族が本人の一人で使う時間を増やしたいと語った一文は含まれなかった。照明の購入を見送った日と購入した日はそれぞれ表示されたが、両日の条件差をつなぐ関係は0件だった。

| 統合の段階 | 入力トークン | 出力予約 | 実際の出力トークン | 応答までの秒数 |
| --- | ---: | ---: | ---: | ---: |
| 計画 | 24,321 | 4,096 | 775 | 55.357 |
| 項目 | 25,924 | 3,321 | 1,762 | 115.566 |
| 関係 | 27,208 | 1,559 | 307 | 35.968 |

受領ZIPは504,131バイト、SHA-256 `c24ef85956c0a36ecbbe45d12535598b6fcf97d014e891273d614cc224889988`。実応答原本は2,858,244バイト、SHA-256 `e422bf20c55831bb5de52e0a6a1cd8ac4727319aa3ee5172a31234f588559ec0`。

**二者照合と通常反映。** 主担当は7件、独立担当は6件を適合とし、双方が適合としたのは3・4・5・6・7・12件目だった。記録1・2・8・9・10は双方が不適合と判定した。例えば1件目は問い合わせが休憩中で返答が昼過ぎだった経過、2件目は足の調子がよくない家族本人が語った希望、9件目は設置に関して店頭で具体的に分かったことが統合表示から読み取れなかった。11件目では、主担当は本人が読書会で説明を修正した経過を適合とし、独立担当は本人が最初に示した読みの内容が統合表示に残らなかった点を不適合とした。両担当とも、両日の条件差を扱う記録間比較は、関係が0件のため表示から判定できないとした。B55の実行・復元・照合は終了した。全12記録での採用条件を満たさず、今回の実原本の隔離SQL保存、別プロセス同一ID再読、通常DBへの書込み、通常のAPI・ワーカーとモデル選択への反映は各0。原記録ごとに選ぶ思考根拠と、両日の条件を示す比較が残る。

<a id="analysis-b56-preparation-20261120"></a>
## 9.187 統合計画に発言と判断の原文を残し、記録間の比較候補をモデルが一組ずつ判断する変更（11/20 JST）

**B55での表示順の再照合。** 行動欄の41文は各項目の説明内では12件すべて原文順だった。全文の各項目を見出しから読み始めた場合は、8・12件目で後の行動文が見出しにも使われ、最初に出る順が原文と一致したのは10件だった。§9.186の実表示の記述もこの範囲で訂正した。

**分割後に失われた根拠。** B55の実表示は12記録中6件が二者共通で適合し、通常採用を見送った。開発コミット `dac4d1de96325a354d0111a2b91bbd555d77e3cc` は履歴統合の新形式（v5）で、短い行動欄から分からない発言や判断について、同じ記録の思考欄にある一意な原文を計画の候補に載せる。候補が成立する項目では、そのいずれかを原文のまま含む根拠が必要になる。本人の解釈、相手の希望、聞いた内容、その時点で確かめた結果を新たに書き足す処理はない。

B55で実際に受領した分割応答と統合入力を使い、以下の6記録で候補を確認した。B55の実計画から選択を変えずに新形式へ渡すと拒否され、6件の原文を選んだ検証用計画は提供側とAPIが受理した。

| 記録 | 同じ記録の思考欄から選べた根拠 |
| --- | --- |
| 1・案内資料 | 休憩中に担当者へ連絡し、昼までに窓口を確認できるか尋ねた。 |
| 2・家族の食事会 | 足の調子がよくない家族本人に連絡し、新しい店を希望するが階段が長ければ別の店でもよい、という返事を受けた。 |
| 8・友人との外出 | 最近勉強を始めた友人が、自分の勉強の話をした。 |
| 9・照明購入 | 店頭で机の端に付けて試し、角度を変えると使いたい位置に光が届いた。 |
| 10・家族との改修相談 | 家族が、本人が一人で使える時間を増やしたいと語った。 |
| 11・読書会 | 本人が、手紙を出さなかったことを相手を大切にしていないからとは読めなかった、と話した。 |

36引用の検証用応答では、必要な原文候補が選べても表示が十分になるとは限らなかった。2件目では、先に新しい店を勧めた別の家族と設備の点検条件が欠け得る。11件目では、本人が後から事実の説明をどう訂正したか、手紙を出さなかった理由がどこまで未確認かが欠け得る。実際に4Bが作る図・全文の採否は二者で原文と照合して判定する。

さらに同じ12記録で、43引用・2比較を選んだ別の検証用応答を作った。2件目は二人の家族それぞれの提案・希望と、設備が使えるか二日前に確定する条件を表示した。11件目は本人の最初の読み、以前に届いた短い返事、事実の訂正、相手の動機が未確認であることを表示した。41文の初出は見出しを含めて12件すべてで原文順だった。統合出力は1,754／4,096トークンで、提供側とAPIが受理した。この結果は選べる表現の検証で、B56の4Bがどの原文を選び、どう表示するかは未確認。

**比較の判断。** 新形式は別の記録の原引用から繰り返し現れる言葉を手掛かりに最大2組を提示する。モデルは左右の原文から比較できる場合は比較文を作り、対象が異なる場合と根拠が足りない場合は理由を分けて見送る。B55の統合入力では、記録4と9の「照明・購入」と、記録4と10の「寸法・注文」が候補になった。CPU上で、前者だけを比較する応答から照明を見送った日と購入した日の1関係を表示できた。後者は照明と家族の家具で対象が異なる。両組とも見送る検証応答も受理された。B55の実表示は関係0件で、新候補の比較文・判定は実4Bからまだ受領していない。

**旧形式の照合。** 受領済みB54・B55の各39段階を当時の形式で再生し、公開図、全文、網羅情報、非公開根拠の一致を確認した。両実原本のSQL保存は各0。A51の保存済み5実原本・15段階も確認した。B55版とB56候補に同じ試験を実行したところ、EmlisAIの発言・認識、Pieceの引用・行為の範囲、分析の記録と引用、共用HTTPと分析IFを含む既存の500試験で、両版の試験IDと合否が一致してすべて通った。SQL依存8件はこの比較の対象外。

**隔離保存と読取り。** 最終候補の検証用3例は、それぞれ通常API経由で隔離SQLへ保存し、別プロセスから同じIDで再読した。代表例は `586c5dd7-3915-4ae9-989f-816ed2180772`、高密度例は `6dc676b3-976d-43a1-be7c-a3ffa8b369b9`、最大例は `49ae458c-382b-4618-86cb-46aefd6dd960`。3例ともアプリの現在表示・同一IDの詳細・図の読取りが一致し、幅320、390、768で12項目・2本の線を確認した。本番のRender APIとワーカーは `24bc228dbf54abc983906323c0ae7d937fae1fd6` がLive、Supabaseのマイグレーションは38件（最新 `20261115011424`）。B56の通常反映は未実施。

開発コミットの[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44650261351)と[Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44650261138)はともに初回で成功した。

**次に送付する範囲。** 同じPod `dqmg1qgolenq7v` 向けに、10ファイル（展開3,405,622バイト、候補ソース250件）をZIP 1個にまとめた。ZIPは2,849,156バイト、SHA-256 `1680ca825b9a90e68b89ad2f82149a95e682c1dfd0d3a7d041c14efdb36403cc`。実行範囲のSHA-256は `a364a192c627320827655396d5be94668bf8e2c097cd188bdcec78ceb8b604ca`。元120uのPID 46663・開始tick 18538188に結び付けた。一回分のB56は同じ架空12記録の分割36段階・統合3段階と前後対照4件で最大43呼出し、通常処理840秒・元120uの復元込み1,200秒、追加学習・再試行は各0。B56のPod送付・実行は未実施で、ZIPの送付とB56一回の実行は別承認とする。

確定後、正式な受領手順で3例を再び別プロセスから読み、独立に照合した。受領と検証を含む106ファイルの目録のSHA-256は `e415623803c027990dd920d5e05aaed2ac10d05b9a4a4ebd463873630c07d232`。

<a id="analysis-b56-actual-result-20261120"></a>
## 9.188 B56で思考欄の発言と条件が表示され、別の対象を結ぶ比較が残った（11/20 JST）

**実行と復元。** §9.187の確定ZIP（2,849,156バイト）を同じPod `dqmg1qgolenq7v` に送り、開発版 `dac4d1de96325a354d0111a2b91bbd555d77e3cc` でB56を1回実行した。架空12記録の分割36応答、統合3応答、前後対照4応答の計43呼出し。公開図・非公開根拠の投影は通常処理の開始から782.027秒、元120uの復元を含めて993.379秒だった。復元後はPID 48213・開始tick 18884234。試験ポートの閉鎖を確認し、追加学習・再試行は各0。12記録すべてを処理し、公開図は12項目・1関係、全文は3,266文字だった。

**戻った原文。** 1件目では休憩中に担当者へ問い合わせたこと、2件目では階段が長ければ別の店でもよいと家族本人が答えたこと、8件目では最近勉強を始めたのは友人であることが表示された。9件目では展示品の角度を変えると必要な位置へ光が届いた店頭での結果、10件目では本人が一人で使う時間を増やしたいという家族の発言、11件目では手紙を出さなかったことを相手を大切にしていないからとは読めなかったという本人の解釈が表示された。

**実際に作られた関係。** 4Bは4件目の照明と10件目の家具を比較すると回答し、別日に照明を見送った4件目と購入した9件目は「別の対象」と回答した。公開図に現れた唯一の線は4件目から10件目に向かい、「昼間は窓際で下書きを描いた。別の照明は調べる予定で、注文していない。」という4件目の内容だけを載せた。線の詳細には両記録の文章が表示されたが、その見出しから家具との条件差は説明できず、照明を購入するまでに判断が変わった根拠も線にならなかった。

**二者の原文照合。** 12件中、主担当が十分としたのは8件、独立判定は4件で、両者が十分としたのは3・5・7・8件目だった。主担当も1・2・9・11件目を不十分とした。たとえば、1件目では午後の確認より後に休憩中の照会が説明され、2件目では新しい店を先に勧めた別の家族の発言、11件目では以前の短い返事を受けてどの説明を訂正したかが欠けた。9件目では購入前の試用が購入後に現れた。独立判定は、誤った関係線を含む4・10件目、作品に使った紙の集め方と残したかった理由を欠く6件目、後の行動を先に見出しに置いた12件目も不十分とした。記録間比較は主担当が判断不能、独立判定が原文と矛盾とした。

短い行動欄の41文だけを数えると、各項目の説明内の初出は12/12で原文順、見出しを含む全文での初出は10/12（9・12件目で逆転）。思考欄と行動欄を合わせた経過は、この文数では判定できない。

**受領検査。** 凍結済み受領器は、初めて実際に出た比較関係の説明をモデルの根拠選択順で再構成し、公開表示が同じ記録の原文順に直した両端の文章と一致しなかった。固定済みの実応答をそのまま読み、両端の原文位置・日付から表示を再構成する照合を加えた。12記録と統合の計13票、39段階の実応答を再現した。両端の逆転、異なる日付、家具を購入したとする改変、全文からの欠落はいずれも拒否した。追加のモデル呼出しは0。

| 統合の段階 | 入力トークン | 出力予約 | 実際の出力トークン | 応答までの秒数 |
| --- | ---: | ---: | ---: | ---: |
| 計画 | 24,593 | 4,096 | 805 | 58.181 |
| 項目 | 25,921 | 3,291 | 1,720 | 104.978 |
| 関係 | 27,677 | 1,571 | 350 | 40.001 |

受領ZIPは510,169バイト、SHA-256 `8fbef36bef042e46f2b85649ae9f94d0147b721076c255332dbe496ff7c1ef78`。実応答原本は2,874,225バイト、SHA-256 `b827071b76e45252745c17683b225dabde13d71527f1f7ceec71b3c265b08da1`。

実B56は全12件の二者合格に届かず、隔離SQL保存・同一ID再読・通常DBへの保存・通常モデル切替は行っていない。次の設計では、提案者と本人の返事、訂正された事実と未確認の理由、同じ対象の別日の判断を、表示まで原文と照合する。

<a id="analysis-b57-preparation-20261120"></a>
## 9.189 B57で複数の発言・訂正を根拠に残し、別の日の比較を両側の原文で支える（11/20 JST）

**B56で不足した表示を直す。** §9.188の二者判定を受け、履歴統合の新形式v6では、休憩中の照会と昼過ぎの回答、新しい店を先に勧めた家族と本人の条件付返答、作品に使った材料の説明と残したい理由、本人の解釈と訂正対象の事実・未確認の動機を、それぞれの思考欄・行動欄から選べる。説明文と見出しは選んだ引用の掲載順を守り、思考欄と行動欄の抜粋をそれぞれ欄の記載順で示す。引用だけで記録にない時間順を補わない。

**比較。** 同じ対象を扱う二つの記録を比較する場合、モデルが両端の完全な原文と結び方を選ぶ。照明の見送りと別日の購入は、選んだ両端の行動が比較文に現れる。別対象と判断した組、証拠が足りない組は線を作らずに終えられる。候補外の関係にもその両端から選んだ根拠を要求する。照明と家具を「寸法」「注文」という共通語で結ぶB56実例、片側だけの文章、他方の名詞だけを貼り足した自由記述は根拠不足として試験した。

**合成表示での原文の確認。** 12件の引用を最少にした検査上の下限は42根。B56実原本の1・2・6・11件目では、二つの欄の時点や話者、訂正を照合する13文のうち、各項目自身の図・全文に一文単位で確認できたのは順に1/2・3/5・0/2・1/4だった。B57の合成表示では、2/2・5/5・2/2・4/4を確認した。これは架空入力に検査用の応答を与えた表示であり、実モデルが何を選ぶかは送付・実行後に判定する。

開発正本 [193e9f2d](https://github.com/MassyuRed/mashos-api/commit/193e9f2df0cff18175348af97fe97f2356597ac2)、tree `1183f9791d7cc738f77d89177be2d3aea1a81aec`。

全ファイル地図では、アプリ・前提資料のGitツリーは5,972件。API開発版はB56の2,726件から2,728件になった。既存11ファイルを変更し、`ai/tests/test_analysis_merge_distinct_contexts.py` と `ai/tests/test_analysis_merge_source_order.py` の2件を追加した。

旧版再読ではA51の保存済み5実原本とB54・B55・B56の受領済み応答を、当時の形式で読み直して前回結果との一致を確かめた。新規生成・SQL書込・通常配備は各0。B56は受領器の修正後に13票を再現しても実際の比較が二者の合格に届かず、隔離SQLの保存記録はない。

| 正式開発版での合成表示 | 根拠引用 | 留保 | 比較線 | 統合3応答のトークン | 4,096からの残り |
| --- | ---: | ---: | ---: | ---: | ---: |
| 代表 | 42 | 4 | 2 | 1,576 | 2,520 |
| 高密度 | 72 | 24 | 2 | 2,266 | 1,830 |
| 最大 | 96 | 48 | 2 | 3,096 | 1,000 |

3例の各項目に上記13文すべてが表示され、4・9件目は照明を試して見送った日と条件を確かめ購入した日、10・12件目は図面依頼の提案・送信未確認から家族の依頼連絡に返事をした時点までを、両側の原文で比較できた。

**正式な受領・保存・再読。** 合成3例を通常APIの保存経路で隔離SQLに保存し、別プロセスの認証済みの読取りで同一ID、公開図、全文、非公開の根拠を照合した。代表は `cabfd8a7-4799-4d7c-b200-78ed650c8e36`、高密度は `bbbcee1e-3139-46de-9b50-1ff205b36c08`、最大は `b2916e12-b1df-4fc7-808e-f68affe82a94`。3例ともアプリの現在表示と同一IDの詳細が一致し、幅320・390・768ですべての12項目と2本の線を確認した。高密度・最大は処理可能な量の確認に用いた。

以前からある7件（A51の実結果5件と旧形式の合成例2件）も、同じIDで公開図・全文・非公開の根拠を読み直した。7件を通した28回の読取りはすべてHTTP 200。うち1件は検査後のプロセス終了待ちで時間切れとなり、それまでに完了した4回を含む実際の読取りは計32回。追加の生成・DBへの書込みは各0だった。

EmlisAIの発言、Pieceの行為と引用、分析の履歴と共有経路を含む回帰500件は、B56開発版とB57開発版でテストID・判定が一致した。SQL依存の8件はこの比較の対象外。B56が出力した片側だけの線を別の種類で再投入する例、逆向き、他方から名詞だけを足す例など7例を生成側の文法とAPI側の検査が拒否した。代表42引用のCPU例では、12件に選んだ思考23文・行動41文について、各欄の原文順と本文での初出順が一致した。

[Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44659040382) と [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44659040421) は開発正本で初回成功。11/20の11時32分JST時点で、本番の通常APIとワーカーはともに `24bc228d` で稼働し、Supabaseは正常、マイグレーション38件（最新 `20261115011424`）を確認した。B57は開発ブランチに反映済みで、実4Bによる生成と通常経路での採用は未実施。

**次の承認範囲。** Pod `dqmg1qgolenq7v` に送るB57専用ZIPは1個、2,859,030バイト（展開3,422,412バイト・10ファイル・候補ソース250件）。ZIPのSHA-256は `3ed465df8cd58a77cd23818080b34faf1107e6e7fe24584e999da396d166dd3a`、実行範囲のSHA-256は `6285981e44ee44f07457a91f8f3c480603dc4aedc734ca022a3717b1cc4957a8`。復元済みの元120uはPID 48213・開始tick 18884234。B57だけを1回、同じ架空12記録で分割36段階・統合3段階と対照4件、最大43呼出し。通常処理は840秒、元120uの復元込みで1,200秒、追加学習・再試行は各0。B57のPod送付と実行は別承認待ち。受領・検査を含む114ファイルの目録はSHA-256 `9ec2f5387a126c29721695da4b7815128117bd71a5e01ee9027fe4b116e1b9ad`。

<a id="analysis-b57-actual-result-20261120"></a>
## 9.190 B57で12記録の分割と統合の項目まで受領し、関係線の応答待ちで終了（11/20 JST）

§9.189の確定ZIP（2,859,030バイト、SHA-256 `3ed465df8cd58a77cd23818080b34faf1107e6e7fe24584e999da396d166dd3a`）を同じPod `dqmg1qgolenq7v` に送付し、開発版 [193e9f2d](https://github.com/MassyuRed/mashos-api/commit/193e9f2df0cff18175348af97fe97f2356597ac2) でB57を1回実行した。架空12記録の分割36応答、統合の計画と項目の2応答、前対照2応答を受領した。統合の関係要求を含め41回送信し、応答受領は40回。追加学習・再試行は各0回。関係要求の送信後、通常処理は開始から817.061秒でHTTP 504（`analysis_model_source_timeout`）により終了した。後対照は実行していない。

| 統合段階 | 入力トークン | 出力予約 | 受領した出力トークン | 応答までの秒数 |
| --- | ---: | ---: | ---: | ---: |
| 計画 | 24,838 | 4,096 | 1,063 | 74.589 |
| 項目 | 27,113 | 3,033 | 1,761 | 114.257 |
| 関係 | 28,313 | 1,272 | 未受領 | 未確定 |

図と全文は返らず、公開図・非公開根拠の組立ても完了しなかった。4→9件目の照明の見送りと購入、10→12件目の図面依頼の提案と後日の返答について、実モデルがどちらの線を選び、図と全文にどのように表示したかは未確認。12件と完成表示との二者照合、同じ実原本の隔離SQL保存・同一ID再読、通常DBへの保存とモデル切替には進んでいない。§9.189にある3件の保存・再読、3画面幅での表示は合成出力での実績。

元120uの復元と提供状態の照合、評価用ポートの閉鎖を確認した。復元を含む実行時間は962.746秒（16分2.746秒）、復元後のPIDは49988、開始tickは19336262。受領ZIPは463,121バイト、SHA-256 `c771c21a217a5ff9f18491abf76055fb8514fb7788585a9b088770ed51e2aa10`。実応答記録は2,600,877バイト、SHA-256 `8432f2c0250905f6896fed7fa87d04cfd4d87594ad8694d53e1f6c1c938ab2a0`。

三中核の回帰では、§9.189でSQL依存のため比較から外していた8件を、B56版とB57版でそれぞれ一時PostgreSQLに接続して実行した。両版とも8/8件が通過した。Pieceでは引用の作用範囲が異なる2例を各3プランで保存し、モデルで再生成せずに再読した。EmlisAIでは問いの前に得た本人の根拠を保持すること、本人の回答前の再応答を拒否することを確認した。これらの検査による通常DBへの書込みはない。Renderの通常APIと分析ワーカーは11/15版 `24bc228d` で稼働し、Supabaseの適用履歴は38件、最新は `20261115011424`。

次は、取得した実応答と各段階の所要時間を使い、統合の関係要求を受領できる時間を確保する。通常採用の判定には、原文と照合できる実際の図・全文、適合した同一原本の保存と再読が必要。

<a id="analysis-b58-preparation-20261120"></a>
## 9.191 B58で履歴統合の残り時間を関係線の生成に渡し、別日の判断を同じ対象から比較する（11/20 JST）

B57の通常処理は上限840秒のうち817.061秒で終了し、関係線の応答を受け取れなかった（§9.190）。統合だけにかかっていた220秒の期限が先に尽き、全体には22.939秒が残っていた。B58は累積分析の通常処理と統合の各段階で同じ終了時刻を使い、HTTP応答がその段階の期限後に来た場合は受理しない。

**実際の時間を使った再生。** B57で受領した分割36応答と統合の計画・項目の2応答を、各応答の実際の受領時刻まで時計を進めて同じ順に再生した。旧形式v6の経路で全39件の要求を再構築し、時間指定以外の送信内容が一致した。最後の関係要求でモデルに割り当てられる生成時間は21.878秒から44.841秒になった。B54・B55・B56で実際に関係応答を受領するまでの時間はそれぞれ35.203秒・35.968秒・40.001秒。B58で関係応答を得られるかは次の実生成で確認する。

**比較対象。** 同じ原本を使って比較の候補を抽出すると、v6では4→9件目の「修理代の引落」と8→12件目の「友人」が挙がった。新形式v7では、4→9件目は照明を見送った時点と購入に進んだ時点、10→12件目は業者への図面依頼を提案し送信は未確認だった時点と、家族の依頼連絡に本人が返事をした時点が候補に入った。後者では依頼先に加え、寸法図についての原文も確かめる。旧形式の39要求を再現でき、新形式の検査は旧候補2つの表題を拒否した。候補と検査用の比較文はCPUでの再生・合成で確認した。B57の関係応答原本は存在せず、ここでB58の関係線を生成した回数は0回。

**線を開いたときの根拠。** 途中版 [b2a79e23](https://github.com/MassyuRed/mashos-api/commit/b2a79e23beca0778a2eebe8cc6544ed13e75302f) でB57の実際の項目選択に検査用の関係応答を組み合わせたところ、10→12件目の線の詳細には、散歩の誘いと図面の連絡への返事がそれぞれ2回含まれた。新形式v7では比較に選んだ原文を各記録から1回ずつ表示する。同じ入力と検査用応答で、4→9件目は照明を店で試して買わなかった日と、資金・設置条件を確認して購入した日の2文になった。10→12件目は図面依頼の提案・送信未確認と、家族の依頼連絡への返事・家具や日程の未決定の2文になった。図面依頼の線の詳細は303字から84字になり、返事は1回表示された。

**同一結果の保存・再読。** B58開発正本の合成3例（代表・高密度・最大）を隔離SQLに保存し、別プロセスから同じIDで読み直して公開結果と非公開根拠を照合した。再読は3例ともHTTP 200、追加生成・SQL書込みは各0。保存IDは順に`67537e04-081b-4757-a1e0-95be8251d54a`、`f9d8dbf6-aa17-4a85-8667-9f98a64139c1`、`eca276fe-bc98-4332-b4b0-9d2e192f1dee`。アプリの最新・詳細で同じIDの12項目・2線が一致した。ReactのテストレンダラーでiOS・Androidそれぞれ幅320・390・768を開き、3例の項目・線・根拠を計288回照合した。うち両端の原文を開く確認は72回。B57の実38応答と検査用の関係1応答を組み合わせた別の図でも96回照合し、うち原文を開く確認は24回。実機での確認は未実施。

**旧版の読取り。** 過去に保存した実出力5件・合成5件を、B58の読取側で同一IDのまま読み直した。10件×4経路のGET40回が通過し、モデルの再生成・SQLへの追加書込みは各0。過去の実応答原本もA51の15段階、B54・B55・B56は各39段階について、当時の応答から同じ結果を再現した。

**三中核の回帰。** B57と同じ500件がB58でも同じテストIDで通過した。SQL依存の8件は一時PostgreSQLで別に実行し、Pieceの引用の作用範囲を各3プランで保存・再読する6件と、EmlisAIの問いに関する2件が通過した。重複を除く共通508件すべてで両版の結果が一致した。期限、応答の読取り、原文順、統合の送受信に関する変更領域の54件も通過し、最終treeで計562件が成功した。これらの検査は通常DBへ書き込んでいない。アプリでは、分析マップと保存画面、Emlisの回答、Pieceの保存・プレビュー・PNGを含む既存の画面系558件が通過した。Metroビルドはこの画面系試験の対象外。

開発正本 [71ecd7c8](https://github.com/MassyuRed/mashos-api/commit/71ecd7c85f1db188c9745e900b155f27c7dd1325)、tree `2a4169d3842ac8f5d9e4185f1a8646f3416dec86`。B58の開発版は既存10ファイルを変更し、通常処理と統合段階の期限を扱う回帰試験 `ai/tests/test_analysis_merge_deadline.py` を追加した。アプリ・前提資料のGitツリーは5,972件、API開発版は2,729件（B57は2,728件）。GitHubの2件のCIが成功した。[Piece B2-B/B3/B4/B5 isolated PostgreSQL](https://github.com/MassyuRed/mashos-api/actions/runs/44667644292)・[Analysis observed content](https://github.com/MassyuRed/mashos-api/actions/runs/44667644463)

11/20 12:33 JSTに通常API・ワーカーの両方で11/15版 `24bc228d` の稼働を再確認した。Supabaseは正常で、マイグレーションは38件、最新 `20261115011424`。B58の実生成・通常反映は未実施。

**次の承認範囲。** 同じPod `dqmg1qgolenq7v` にB58の確定ZIPを1個（2,862,761バイト、SHA-256 `5ba767117921cf5a39af8ff184ad4812c9834336c597f787d9b1e0bcd23c54b4`）送付し、B58だけを1回実行する。架空の同じ12記録、分割36段階・統合3段階・前後対照4件の最大43呼出し。通常処理14分、元120uの復元を含めて20分が上限。追加学習・再試行は各0。実行範囲のSHA-256は `34be7e31ecb4c873f063de4257073ea3978ced2bc13f6ba985abf26ead068715`。元120uのPIDは49988、開始tickは19336262。受領器を含む116項目の目録のSHA-256は `56158a91ea6151e976c9541beff9f6c931d1fd03623a88de6d9800652acf2487`。実B58の図・全文を原文と二者で照合し、適合した同一原本の保存・再読を経て通常反映を判断する。

<a id="analysis-b58-actual-result-20261120"></a>
## 9.192 B58で関係応答を受領し、照明の見送りと購入を両日の原文で比較（11/20 JST）

§9.191の確定ZIP（2,862,761バイト、SHA-256 `5ba767117921cf5a39af8ff184ad4812c9834336c597f787d9b1e0bcd23c54b4`）を同じPod `dqmg1qgolenq7v` に送付し、開発正本 [71ecd7c8](https://github.com/MassyuRed/mashos-api/commit/71ecd7c85f1db188c9745e900b155f27c7dd1325) でB58を1回実行した。架空12記録の分割36応答、統合の計画・項目・関係3応答、前後対照4応答の43応答を受領した。追加学習・再試行は各0回。公開図・非公開根拠の組立ては通常処理の開始から798.205秒、元120uの復元を含め1,012.915秒（16分52.915秒）。復元後の提供状態と評価用ポートの閉鎖を確認した。PIDは51543、開始tickは19836847。

| 統合段階 | 入力トークン | 出力予約 | 受領した出力トークン | 応答までの秒数 |
| --- | ---: | ---: | ---: | ---: |
| 計画 | 24,838 | 4,096 | 1,063 | 61.187 |
| 項目 | 27,113 | 3,033 | 1,761 | 109.547 |
| 関係 | 28,252 | 1,272 | 326 | 39.345 |

実際の公開図は12項目・関係線1本、全文は3,939字。モデルは4→9件目で照明を比較した。線を開くと、10月10日に店頭で候補品の光を試して購入を見送ったこと、10月25日に資金と設置条件を確認して照明を購入したことが、それぞれ当日の原文で1回ずつ表示された。10→12件目の図面依頼には、関係応答で `DIFFERENT_SUBJECT`（別の対象）が選ばれた。この2件を結ぶ線は実際の図・全文に登場しなかった。

受領ZIPは522,413バイト、SHA-256 `0a7937d2a308d3b19024cb147b631b05897b8603adfd2cd1aab4af1527af5575`。実応答原本は2,920,797バイト、SHA-256 `4e905f36c2769890e4bbefc4367505dfcc2d63bce9d5f35408e9170c0d9525bd`。

**原文と公開結果の二者照合。** 12記録の個別判定は、主担当12/12、独立担当11/12、二者とも適合は1～9・11・12件目の11件。独立担当は10件目で、家族が本人の一人の時間を増やしたいと話した点や家具を注文しなかった点は確認できた一方、広い机は欲しいが自分の制作だけで部屋全体を決めたくない、という本人の返答が図・全文から抜けたと判断した。「そう受け取る」の指す内容も表示から読み取れなかった。

両担当とも、10月28日に図面の依頼を提案し、家族が業者へ送ると答えた段階では送信未確認だったこと、11月3日に家族から改修の寸法図を業者へ頼んだとの連絡があり本人が返事をしたことを原文で確認した。二つの記録は同じ図面依頼の異なる時点であり、「別の対象」とした実応答は二者とも不適合。履歴比較の判定を含めると保存条件に届かず、実原本の隔離SQL保存、同一IDからの再読、通常DB・APIへの反映は行っていない。Reactのテストレンダラーでは、実図の12項目・1線をiOS・Androidそれぞれ幅320・390・768で開き、詳細表示84回（うち線から両端へ移る操作12回）を照合した。

**通常読取りの確認。** §9.176で二者が適合としたA51の5件は隔離SQLに保存した原本。通常DBの `analysis_results` を既知の保存IDだけで照合したところ、A51の5件とB58準備時の合成3件の該当行はいずれも0。新しい形式を通常保存するときは、12記録の統合原本が適合し、隔離保存・別プロセスの同一ID再読が成立した後、対応する読取版を通常API・ワーカーに先に配置する（§9.176、§9.177）。B58正本では、同一提供口のMAP用v24とIF用120uの選択、自然文・Pieceとの共用、要求終了時のアダプター復元を既存のローカル試験71件で確認した。通常API・ワーカーの稼働版は `24bc228d`。

**B57の審査記録の追補。** 前節までに保存したB57の独立審査票で、2～12件目の補助引用 `merge_quote` を他の項目から転記していた。統合応答の配列が `n1, n10, n11, n12, n2, …` の順だったため、各項目の参照IDに合わせて自項目の引用へ訂正した。訂正ファイルのSHA-256は `dac77f162bb55d0becc648ffeb9371d7691cf91f0729524bb46b5e7dd6b3db2e`。B57の実応答原本は同一で、図・全文を受領できず12件とも判定不能とした結果も同じ。

<a id="analysis-b59-preparation-20261120"></a>
## 9.193 B59で本人の具体的な希望を保持し、依頼した内容と依頼先を分けて別日を比較する（11/20 JST）

§9.192の実B58では照明の見送りと購入を比較できた一方、本人の希望が抜け、2日分の図面依頼を「別の対象」と判断した。B59の新形式v8では、他の人が本人のために望んだことと、本人が望むこと・付けた条件を、それぞれ誰の発言か分かる原文に結びつける。本人が他の人の解釈を心配する場面では、その解釈が指す直前の懸念を同じ記録から示す。

12記録で必要な根拠引用の下限は42から44に変わり、追加は10件目の2組だった。一方は、本人が広い机を望むことと、自分の制作だけを中心に部屋を決めたくないという返答。もう一方は、使い方が分からないまま購入に賛成した形になることへの本人の心配と、実際に家族がそう受け取ったかは分からないという留保である。本人の懸念から家族の意図を推定しない。

10→12件目の比較候補では、従来の「業者」は依頼先として扱い、依頼した対象を「寸法図」として両日の原文で示す。4→9件目では「照明」が対象になる。実モデルが候補を採用するか、どちらの記録を同じ対象とみなすかはB59の実行後に判定する。

**旧版と候補の表示。** B58の実39応答を旧形式v7で再生し、同じIDの公開図、全文3,939字、非公開根拠、網羅情報が一致した。B58で実際に採用しなかった図面依頼の線を、旧結果に書き足した回数は0。新形式v8では、家族の希望だけを残した旧計画と、本人の限定や指示語の前提を欠く計画を生成側とAPI側の双方が拒否した。二つの原文を選んだ検査用の計画は両者が受理した。

B58の実分割36応答を使い、v8の統合3段階に検査用応答を与えた。両方の比較を選んだ例は12項目・2線・全文4,288字となり、10件目を除く11項目の全属性はB58の実結果と一致した。照明だけを選んだ例は1線、両組とも別の対象とした例と根拠不足とした例は各0線。依頼先の「業者」を依頼した対象として使った応答を拒否した。2線の図では77の根拠について原文中の範囲とハッシュを確認。既存のReact画面をiOS・Android各3幅で開き、原文を表示する操作を96回照合した。うち線から開いた操作は24回、10件目の根拠を開いた操作は12回。B59の実4B応答・実機確認はいずれも未実施。

**保存と再読。** 代表・高密度・最大の合成3例を通常APIの保存処理で隔離SQLに保存した。別プロセスから同じIDを取得し、図・全文と非公開根拠を照合。3例ともHTTP 200で、再生成・再読によるSQL書込みは各0。10件目の家族の発言、本人の返答と具体的な希望、懸念とその指示語を含む5文は、3例とも同じ記録で原文の欄・順番・文面が一致した。保存IDは順に`a45ccb7a-12d3-4e0c-a704-0f9014436622`、`c2bfcf5d-2980-46c8-b28e-acee433fcebb`、`3936a1d6-9d1f-41ea-b69f-a68875d0ab2d`。3例のアプリの最新表示と詳細は一致し、iOS・AndroidのReactテストレンダラーで各幅320・390・768、12項目・2線について計288回の詳細確認（うち線から根拠を開く操作72回）が成立した。

| 合成例 | 根拠引用 | 統合3段階の出力トークン | 4,096からの残り |
| --- | ---: | ---: | ---: |
| 代表 | 44 | 1,490 | 2,606 |
| 高密度 | 72 | 2,164 | 1,932 |
| 最大 | 96 | 3,004 | 1,092 |

**互換性と三中核。** B58までの既存13保存（実5件・合成8件）を両形式の最新と同一ID詳細から計52 GETし、図・全文・非公開根拠が一致した。旧A51・B54・B55・B56の実132段階とB58の実39段階を合わせた171段階を再生し、旧結果の一致を確認した。三中核の共通回帰508件（SQL依存の8件を含む）と、変更した範囲の105件、重複を除き計613件が最終treeで通過した。通常DBへの書込み・新規4B生成は各0。

開発正本 [6866d055](https://github.com/MassyuRed/mashos-api/commit/6866d055ca5aa271bd998a15de297db6a4bc33b3)、tree `68491833b134080cc3345f32a7fb8c535e56c736`。既存7ファイルを変更し、`ai/tests/test_analysis_merge_speaker_context.py` を追加。全ファイル地図のアプリ・前提資料は5,972件、APIは2,730件（B58は2,729件）。同じ正本で2件のCIが成功した。[Piece B2-B/B3/B4/B5 isolated PostgreSQL](https://github.com/MassyuRed/mashos-api/actions/runs/44675453151)・[Analysis observed content](https://github.com/MassyuRed/mashos-api/actions/runs/44675453029)

11/20 13:36 JST、通常API・ワーカーは引き続き `24bc228d` で稼働し、Supabaseは正常。適用済みマイグレーションは38件、最新は `20261115011424`。通常DBでB59の合成3件のIDと一致する保存は0件だった。

**次の承認範囲。** 同じPod `dqmg1qgolenq7v` へB59の確定ZIP1個（2,866,410バイト、SHA-256 `18235ac876a4d2627f2a3f3b078aaeede22dfaecaf088e0b64e588c433660136`）を送付し、B59だけを1回実行する。架空の同じ12記録、前後対照を含む最大43呼出し。通常処理14分、元120uの復元を含め20分。追加学習・再試行は各0。実行範囲のSHA-256は `3c2ed118f7cf8f50c81b2f15bb58c0c4300cb50b3b06c83bd4dd7546a050e0b4`。元120uのPIDは51543、開始tickは19836847。受領器を含む129項目の目録のSHA-256は `26784a49b5d3fa8fa2c131cd929f06e4c82f4c4dc8f9221881c8bbcfa5fa5ebe`。B59の送付・実行前の記録であり、実原本の二者照合、適合した原本の保存再読と通常反映は次の工程。

<a id="analysis-b59-actual-result-20261120"></a>
## 9.194 B59で本人の机の希望と条件を表示し、司会の発言と別日の図面依頼の比較が統合表示から抜けた（11/20 JST）

同じPod `dqmg1qgolenq7v` で、確定ZIP（2,866,410バイト、SHA-256 `18235ac876a4d2627f2a3f3b078aaeede22dfaecaf088e0b64e588c433660136`）のB59を1回実行した。開発正本 [6866d055](https://github.com/MassyuRed/mashos-api/commit/6866d055ca5aa271bd998a15de297db6a4bc33b3)、実行範囲のSHA-256は `3c2ed118f7cf8f50c81b2f15bb58c0c4300cb50b3b06c83bd4dd7546a050e0b4`。架空の同じ12記録を36段階で読み、統合の計画・項目・関係の3応答を受領した。開始前・復元後のEmlisAI・分析IF対照4件を含む43件を受領し、学習・再試行は各0。

| 統合段階 | 入力トークン | 出力トークン | 応答秒数 |
| --- | ---: | ---: | ---: |
| 計画 | 24,925 | 916 | 62.986 |
| 項目 | 26,366 | 1,719 | 105.228 |
| 関係 | 28,120 | 333 | 38.942 |

実際の統合表示は12項目・1線、全文3,672字。公開表示・非公開根拠は779.702秒でそろい、14分の通常処理枠に収まった。元120uをPID 53169（開始tick `20252211`）へ復元し、試験ポートを閉じた。復元込み986.664秒。受領ZIPは519,063バイト、SHA-256 `6e4306ac48e7c9dc084ea4ea76c8a250e8cd6a3935427e1dc6f8d6c28e41ca9e`、内部の実応答原本は2,903,717バイト、SHA-256 `2eee47de25f29766f1b54904c6d53a319e6e2be75db6a2a2ca9eb69864e5f8f4`。

**個別12件と履歴の二者判定。** 主担当と独立担当はそれぞれ原記録、分割・統合の応答、図と全文を照合し、1〜10・12件目の11件を適合とした。10件目では家族の希望に続き、本人が広い机は欲しいが制作だけで部屋を決めたくないこと、購入に賛成した形になるのを心配しつつ家族がそう受け取ったかは分からないことが、同じ記録の発言として表示された。

11件目の読書会では、本人が手紙をどう読んでいたかと、返事の記述を見落としていたと訂正した経過は表示された。一方、司会が「結論が違っても読んだ箇所を一緒に見られるのが面白い」と言ったことと、本人だけに向けたのか場全体への言葉なのかは分からないという留保が統合後の図・全文で失われた。司会の感想は分割応答にあり、統合計画で選ばれなかった。二者とも11件目を不適合とした。

4→9件目の照明では、店で試して購入を見送った日と、予備費・設置条件を確認して購入した日を同じ照明の経過として線で結べた。10→12件目では、家族が業者へ図面依頼を送ると答えてその場では送信を確認していない段階と、後日、家族から寸法図を頼んだと連絡があり本人が返事をした段階がある。モデルに渡った比較候補には「寸法図」と依頼先の「業者」、両日の原文がそろっていたが、実応答は `DIFFERENT_SUBJECT` を選んだ。公開図・全文にはこの比較がなく、二者とも元の経過と一致しないと判定した。

二者の判定票は受領原本のSHA-256に結び付けた。主担当票のSHA-256は `79d9f084e7f5c447ae1b7ce965e705b2fa380462e2e7d83b577c68b9eb1ff086`、独立票は `c02ec4185f7e7d1019d3ed7ce7a478c51bc630dae07326152081302772e3fbf5`。

**保存と通常反映。** 隔離SQLに保管したA51の実5件、B59準備時の合成3件は従前の検証結果。今回の実B59は保存条件に届かず、同一原本の隔離SQL保存・同一IDの別プロセス再読、通常API・ワーカーの配備、通常の分析MAPのモデル切替はいずれも未実施。個人の通常DBへの入力も行っていない。

11/20 14:19 JST、通常APIのヘルスとbootstrapはHTTP 200、本人向け最新・履歴の匿名GETは401。API・ワーカーは双方 `24bc228d` がLive。Supabaseの適用済みマイグレーションは38件、最新 `20261115011424`。通常ワーカーには実行待ち・実行中・期限切れ各0、累積失敗174件があった。B59正本と通常版の差分は79コミット・92ファイル、DBマイグレーションの差分は0。現行の認証処理は実際の所有者を解決し、検証用の架空IDは隔離SQLでのみ使用する。

次回は、読書会の司会の発言と本人の受け取りを図・全文まで保ち、図面依頼を別日にまたがる同じ案件として比較できるかを確かめる。適合した実原本を隔離SQLで保存・再読した後、通常APIとワーカーへ互換読取版を先行配置する。元120uの分析IFと既存のEmlisAI・Pieceの提供を維持し、通常の分析MAPでv24を選択する。同一提供口での選択とadapter復元を扱う既存71試験は正式B59のCPU再実行で通過した。

<a id="analysis-b60-preparation-20261120"></a>
## 9.195 B60で読書会の司会の発言と本人の受け取りを残し、同じ依頼を別日まで追う（11/20 JST）

§9.194の実B59で、本人が広い机を望むことと、制作だけを中心に部屋を決めたくないという条件は表示された。読書会の司会の感想と本人の受け取りは統合時に抜け、図面を頼む提案と後日、家族から頼んだと聞いたことは「別の対象」とされた。B60はこの2点を変更した。

**発言とその受け取り。** 読書会では、本人が手紙をどう解釈したかに加え、司会が「結論が違っても読んだ箇所を一緒に見られるのが面白い」と話したこと、本人が話しやすくなったと感じながら自分だけを評価したのか場全体への言葉なのかは分からないことを、原記録の順で読めるようにした。同じ段落で話者と受け手が結び付き、分割時の応答にも両方の文がある場合に、同じ記録の根拠として選ぶ。宛先が分からないという本人の留保から、司会の意図を決めない。

初版 `888193f3` では、1件分の根拠の上限8枠が埋まる別の記録に、新しい発言の組を追加しようとすると、B59で保持していた本人の返答・条件と、その心配が指す内容の根拠が外れた。改訂版は必要な既存の根拠を先に保持し、残りの枠に一組全体が収まる場合だけ追加する。8枠使用済みの記録では既存8枠をそのまま使う。発言者が複数いて話者を一人に定められない場合も、誰か別の発言で埋めない。

**別日に続く依頼。** 一つ目の記録では家族が業者に図面依頼を送ると答え、その場での送信は未確認。後日の記録では家族から改修の寸法図を業者に頼んだとの連絡があり、本人はそれに返事をした。新形式v9は、同じ依頼について「提案から後日の連絡へ」を選び、両側の原文を線の説明に使える。照明の見送りと購入には判断の比較を引き続き選べる。別の対象・根拠不足も選択肢に残す。改訂途中の生成制約には、一度「別の対象」とした組を別枠で逆向きの線として書ける抜けがあった。最終版は通常APIと同じ両端の原文を生成途中でも照合し、正向き・逆向きとも、その組を追加する記述を拒否する。「別の対象」と「根拠不足」の両判断について正逆の計4例で拒否を確認した。受取・納品まで済んだと書き足すことも防ぐ。

後日の記録が「返事をする予定」「まだ返事をしていない」「確認できない」だけなら、依頼が進んだとは判定しない。「連絡は届いた、まだ返事はしていない」と書かれている場合は、受信した段階として扱い、本人が返信したことにはしない。別題材で用意した9例では、依頼の進行に根拠がある2例を受理し、残り7例はその線を提示しなかった。

後日の実生成を読む二者の判定票では、12件の個別確認に加え、1枚の履歴票の中で照明4→9件目と図面依頼10→12件目をそれぞれ原文・実表示まで判定する。B59で照明のみ適合した実例を通し、その判断と不適合理由を記録でき、全件適合を要する隔離保存には進まないことを確かめた。片方の比較の記入漏れや、同一の審査者を二者として扱う例を含む受領異常10件を拒否した。

**旧実応答と新形式の照合。** B59の実39段階を旧形式v8で再生し、同じIDの公開図12項目・1線、全文3,672字、非公開根拠と網羅情報が一致した。旧実応答が選んだ照明の比較と、図面依頼を別の対象とした判断も再現した。iOS・Android各3幅の既存React画面で、この旧実表示の原文を84回確認した（うち元の1線から12回）。新形式v9では、12記録の根拠引用の下限が44から45に変わった。追加したのは11件目の司会の発言と本人の受け取りを一続きで示す根拠で、原記録の残り11件の引用条件は同じ。B59実応答の統合計画をそのままv9へ渡すと、生成側の制約とAPIの検査の双方が不足を検出した。

B59実分割36応答に、新形式の統合3段階の検査用応答を組み合わせた。照明は判断の比較、図面依頼は同じ依頼の別日の進行として選ぶと、12項目・2線・全文3,995字。11件目を除く11項目はB59実表示と全属性が一致した。B59と同じ選択なら1線、両組を別の対象または根拠不足とした例はいずれも0線だった。照明を依頼として扱う例、図面が納品されたと原文にない経過を付け足す例、選ばなかった組を別の線で追加する例を拒否。両線の根拠と、11件目の発言・その宛先を断定できないという留保を含む64件の根拠について原文の位置・ハッシュを確認した。既存のiOS・Android用React画面を3幅（320・390・768）で開き、原文表示96回、うち線からの遷移24回を照合した。B60実モデルがどの根拠と線を選ぶかは実行後に判定する。

**保存と再読。** 代表・高密度・最大の検査用3例を、通常APIの実装に通して隔離SQLへ保存した。別プロセスの受領器でいずれも同一IDを読み、所有者のHTTP 200、匿名の401、別所有者のSQLSTATE 42501を確認した。公開図・全文・非公開根拠が一致し、10件目の本人の希望・条件、11件目の司会の発言と受け取りを含む4組の根拠、両比較の原文を照合した。再生成・再読によるSQL書込みは各0。保存IDは順に`5d96d0ea-a9f8-431a-b30f-ce6b89db77c1`、`86f07672-b168-4963-b49c-f27a88c78369`、`30f7e47b-e49c-473b-adfc-fa431daf8f7b`。既存React画面のiOS・Android各3幅で、3例の最新表示と詳細は一致し、12項目・2線について計288回の詳細確認（うち線から根拠を開く操作72回）が成立した。

| 合成例 | 根拠引用 | 留保 | 統合3段階の出力トークン | 4,096からの残り |
| --- | ---: | ---: | ---: | ---: |
| 代表 | 45 | 4 | 1,518 | 2,578 |
| 高密度 | 72 | 24 | 2,159 | 1,937 |
| 最大 | 96 | 48 | 3,000 | 1,096 |

**互換性と三中核。** B59までの既存16保存（実5件・合成11件）を両形式の最新と同一ID詳細から計64 GETし、図・全文・非公開根拠が一致した。三中核の共通回帰508件（SQL依存8件を含む）と、変更領域の134件を実行し、重複を除く642件が正式版で通過した。過去の実応答はA51・B54・B55・B56の132段階、B57で受領済みの38段階、B58とB59各39段階の計248段階を再生した。B57で応答が返らなかった統合関係は送信要求のみを照合し、欠けた応答は補っていない。 通常DBへの書込み・新規GPU生成は各0。

開発正本 [ed9a43e6](https://github.com/MassyuRed/mashos-api/commit/ed9a43e61d1b7bea26de2161bf993693ae7a5c7f)、tree `5a60da43f7009f2e15a3a7a0ff025601b1694c50`。既存9ファイルを変更し、`ai/tests/test_analysis_merge_attributed_account.py` を追加。アプリ・前提資料の全ファイル地図は5,972件、API開発版は2,731件（B59は2,730件）。同じ正本で2件のCIが成功した。[Piece B2-B/B3/B4/B5 isolated PostgreSQL](https://github.com/MassyuRed/mashos-api/actions/runs/44684825360)・[Analysis observed content](https://github.com/MassyuRed/mashos-api/actions/runs/44684825385)

11/20 15:01 JST、通常API・ワーカーは引き続き `24bc228d` で稼働し、Supabaseは正常。適用済みマイグレーションは38件、最新 `20261115011424`。通常DBで今回の合成3件の保存IDに一致する行は0件だった。

**次の承認範囲。** 同じPod `dqmg1qgolenq7v` へB60の確定ZIP1個（2,869,861バイト、SHA-256 `43ce6e6a5f627dcdad4f675c455230031ad4b106a05d8117e53acffed98c4b84`）を送付し、B60だけを1回実行する。ZIPの中身は10ファイル、展開時3,457,217バイト、製品ソース250件。架空の同じ12記録、前後対照を含む最大43呼出し。通常処理14分、元120uの復元を含め20分。追加学習・再試行は各0。実行範囲のSHA-256は `d5c815677bb6b05910b9bceaee75199ca3897a5d9ec5a5f13cff50206b7aa0ff`。元120uのPIDは53169、開始tickは20252211。受領器を含む139項目の目録のSHA-256は `15c28c4c306e9c80bdd1ec9e8c042b1645a75170fc5002c208179add0751c58c`。実行と実原本の二者照合、適合した同一原本の保存再読と通常反映は次の工程。

<a id="analysis-b60-actual-result-20261120"></a>
## 9.196 B60では司会の感想と本人の留保が表示され、別日の図面依頼は同じ案件として結ばれなかった（11/20 JST）

同じPod `dqmg1qgolenq7v` で、§9.195の確定ZIP（2,869,861バイト、SHA-256 `43ce6e6a5f627dcdad4f675c455230031ad4b106a05d8117e53acffed98c4b84`）を用いてB60を1回実行した。開発正本 [ed9a43e6](https://github.com/MassyuRed/mashos-api/commit/ed9a43e61d1b7bea26de2161bf993693ae7a5c7f)、実行範囲のSHA-256は `d5c815677bb6b05910b9bceaee75199ca3897a5d9ec5a5f13cff50206b7aa0ff`。架空の同じ12記録の分割36段階、統合の計画・項目・関係3段階、実行前・復元後のEmlisAI・分析IF対照4件を含む43応答を受領した。追加学習・再試行は各0。

| 統合段階 | 入力トークン | 出力トークン | 応答秒数 |
| --- | ---: | ---: | ---: |
| 計画 | 24,978 | 912 | 62.894 |
| 項目 | 26,308 | 1,743 | 106.869 |
| 関係 | 28,273 | 336 | 29.202 |

統合表示は12項目・1線、全文3,804字。公開表示・非公開根拠は773.225秒でそろい、14分の通常処理枠に収まった。元120uをPID 54566（開始tick `20708210`）へ復元し、試験ポートを閉じた。復元込み980.797秒。受領ZIPは520,513バイト、SHA-256 `94aa3d007791e5050547ad6f57e5cad94cc9a2ca96d6ea532bf1db2d72ef411a`、実応答原本は2,906,616バイト、SHA-256 `97a614982409384b0ec6017fb288f66121bd990478c6757a213edf09ff735733`。

**二者判定。** 主担当・独立担当ともに、原記録・分割応答・統合計画と項目・図・全文を照合し、個別の12件すべてを適合と判定した。10件目の広い机への本人の希望、制作だけを中心に部屋を決めたくないという条件、家族の受け取りは分からないという留保も保持した。

B59で抜けた11件目の読書会では、司会が「結論が違っても読んだ箇所を一緒に見られるのが面白い」と話したこと、本人が少し話しやすく感じたこと、その言葉が本人だけを評価したものか場全体への言葉かは分からなかったことが、実際の図・全文に表示された。

4→9件目では、店で候補の光を試し購入を見送った日と、予備費・設置条件を確認して照明を購入した日を、同じ照明の判断として結んだ。10→12件目は、家族が業者へ図面依頼を送ると答えたもののその場では送信を確認しなかった段階と、後日、家族から改修の寸法図を頼んだという連絡があり本人が返事をした段階である。実モデルは照明について `COMPARE`、図面について `DIFFERENT_SUBJECT` を選んだ。図面依頼の別日の経過を結ぶ線は実際の図・全文にない。

照明の比較は両者とも適合（`CONFIRMED`）。図面依頼では、主担当は同じ依頼の経過を別対象とした実応答の判断が原文と矛盾すると判定した（`CONTRADICTED`）。独立担当は、完成した図・全文にその関係が表示されず、利用者が両日を結び付けて読む根拠を確認できないと判定した（`NOT_ASSESSABLE`）。二者とも履歴全体の保存条件に適合とはしていない。判定票のSHA-256は主担当 `24ff38af8fcb48b49c6ee4b2beab13ed0f29dbbfcdbe2e260d2fb0372c84cf4e`、独立 `0b40986b33735f701f87d01959d779c0bec0fa2c7cc40a1de37fa6072f5457d8`。

**表示と保存。** 受領した実原本を既存アプリの最新・保存詳細のReactコンポーネントへ直接渡し、63件の原文範囲を照合した。iOS・Androidの各3幅（320・390・768）で、原文表示168回（線から24回）を確認した。この表示にDB保存は使っていない。今回の実原本の隔離SQL保存と別プロセスの同一ID再読、通常DBへの書込み、通常API・ワーカーと分析MAPの選択変更は各0。本人の端末上での操作は未実施。

11/20 15:28 JST、通常のRender API・ワーカーは `24bc228d` がLive。Supabaseは正常、適用済みマイグレーション38件・最新 `20261115011424`。ワーカーの実行待ち・遅延・実行中・期限切れは各0、累積失敗174件。15:29 JST、通常APIのヘルスとbootstrapはHTTP 200、本人向け最新・履歴の匿名GETは401。B60正式版と稼働版の差分は82コミット・93ファイル、マイグレーション変更0だった。

元の120uのまま互換読取版を先に配置できるか、正式版の通常APIの実装と隔離PostgreSQLで確認した。既存120uの名前をHTTP要求・応答に指定した合成試験では、旧選択 `semantic_map.v1` で単一記録1件、3件の分割読取りと統合1件の両方で、新規保存は各1回。最新と詳細から同じIDが読め、図の本文・非公開根拠が一致し、再読で生成・SQL書込みは増えなかった。同一提供口の分析MAP v24とIF 120u、EmlisAI・Pieceの既存設定、アダプター復元などの既存試験も71件が通過した。

<a id="analysis-b61-preparation-20261120"></a>
## 9.197 B61で、別日の記録を結ぶ判断と見送る判断のどちらにも両日の原文を指定する（11/20 JST）

§9.196のB60実原本では、二者とも個別12件に適合と判定した。照明を見送った4件目と、条件を確かめて購入した9件目には比較線が出た。10件目に家族が寸法図の依頼を業者へ送ると答え、12件目に家族から依頼したと連絡があった経過は、実モデルが「別の対象」と判断し、図と全文に載らなかった。この実原本は受領時の状態で保管し、B61では最後に二つの記録の関係を選ぶ段階を改めた。

**両日の根拠の指定。** 従来のv9では、線を結ぶ判断は根拠付きの配列、見送る判断は記号一つで返せた。B61のv10は判断・対象・左の文番号・接続語・右の文番号の五つで1行を構成する。選択肢は「対照」「同じ依頼の経過」「別件」「材料不足」。いずれも記録日、両日の原文、対象の根拠を読んで選ぶ。進行の根拠がある組にだけ「同じ依頼の経過」を提示する。「別件」と「材料不足」を選んだ場合も左右の文番号を検査し、図には線を描かない。二つの線を必ず出す指定はしていない。

**実応答と検査用の判断。** B60の実39段階を従来のv9で再生すると、同じIDの図（12項目・照明1線）、全文3,804字、非公開根拠と網羅情報が一致した。次にB60の実応答38段階（分割36・統合計画・項目作成）を維持し、最後の関係判断だけをv10の検査用応答に置き換えた。照明は対照、寸法図は同じ依頼の経過と選ぶと、12項目・2線、全文4,032字。公開・非公開の12項目と、全63件の根拠の原文範囲・ハッシュが一致した。B60と同じ選択なら1線、二組とも別件または材料不足を選べば0線。照明を同じ依頼として結ぶ例、原文と違う依頼先、原文にない納品、辞退した関係を逆方向で追加する例は拒否された。今回の検査時点では、B61の実モデルが選ぶ関係は未確認。

**図面の線から誰が依頼したかを確かめる。** 合成の線に表示する「家族の寸法図の依頼連絡に返事をし」という短文だけでは、誰が業者へ頼んだか明示されない。線から左の原文を開くと10月28日に家族が送ると答え、本人は送信をまだ確認していないこと、右を開くと11月3日に家族が業者に頼んだと本人に連絡したことを別々に読めた。既存のReact画面で、最新・保存履歴の両方、iOS・Android各3幅（320・390・768）から各端を12回ずつ開き、他の日の原文が混ざった例は0件。実機での確認は未実施。

**通常APIの保存と再読を隔離環境で確認。** 根拠引用と留保の数が異なる合成3例を保存した。いずれも12項目・照明と寸法図の2線で、別プロセスの受領器が同じIDの公開図・全文・非公開根拠を再読した。正式範囲の受領器は各例で39応答と13枚の記録（個別12・履歴1）の対応を確かめた。保存IDは代表から順に`6302f43a-4750-4563-a9af-9b631777fe51`、`b5ee8735-1cf6-4545-808b-402c501fcf03`、`e0fd7285-9109-4083-9f4f-db978d89fb40`。既存React画面のiOS・Android各3幅で、3件の詳細を計288回、うち線から根拠を開く操作を72回照合した。

| 合成例 | 根拠引用 | 留保 | 統合3段階の出力トークン | 4,096からの残り |
| --- | ---: | ---: | ---: | ---: |
| 代表 | 45 | 4 | 1,520 | 2,576 |
| 高密度 | 72 | 24 | 2,161 | 1,935 |
| 最大 | 96 | 48 | 3,002 | 1,094 |

照明だけを結ぶ例、寸法図だけを結ぶ例、どちらも結ばない例も別々に隔離保存した。正式範囲の受領器は1線・1線・0線を元の判断どおりに再読し、本人のHTTP 200、匿名401、別所有者のSQLSTATE 42501を確認した。新しい実モデルの呼出し・通常DBへの書込みは各0。

**過去の実応答と三中核の互換性。** 旧実行から受領済みの287応答を再現した（B57最後の送信のみの1件は含めない）。過去19保存（実5・合成14）について両形式の最新・同一ID詳細を計76 GETし、再生成・書込みなしで再読した。EmlisAI・Piece・分析の共通508件（SQL依存8件を含む）と変更領域139件、重複を除く647件が正式版で通過した。

開発正本 [df7a39d0](https://github.com/MassyuRed/mashos-api/commit/df7a39d0fc05bd8950d1cfcca6d8c3c56ede510c)、tree `1e21ea8ff6ec8c9cf39421a94b23142542d0229d`。分析の統合応答、関係判断と根拠候補、CMEEの分析指示、生成途中の制約試験の既存5ファイルを変更した。アプリ・前提資料の全ファイル地図は5,972件、API開発版は2,731件。同じSHAでCI2件が成功した。[Piece B2-B/B3/B4/B5 isolated PostgreSQL](https://github.com/MassyuRed/mashos-api/actions/runs/44691064567)・[Analysis observed content](https://github.com/MassyuRed/mashos-api/actions/runs/44691064539)

11/20 15:56 JST、通常API・ワーカーは `24bc228d` で稼働し、Supabaseは正常。適用済みマイグレーション38件、最新 `20261115011424`。同日16:17 JST、通常DBで隔離検査6件の保存IDに一致する行は0件だった。通常の利用者に対するB61の反映は未実施。

**次の承認範囲。** 同じPod `dqmg1qgolenq7v` へのB61の確定ZIP1個（2,871,945バイト、SHA-256 `ea4f4155268eea5bdebc67790d3fd605c3f86cb313113b3d195510d75a1b4dc4`）の送付と、B61だけの1回実行。ZIPには10ファイル、展開時3,466,736バイト、製品ソース250件。同じ架空12記録を使用し、分割36・統合3・対照4で最大43呼出し。通常処理14分、元120uの復元を含め20分。再試行・追加学習0。元120uはPID 54566、開始tick 20708210。実行範囲のSHA-256は `3cbbe7dc6f561f2d6834d62c6f6e554e645b120eafd936c016801f34b9c0b10c`、受領器を含む159項目の目録のSHA-256は `a0f33c34a425e97917a226edd39908c9b32dd38856b1925947add4fb7bd65459`。実行後は二者が同じ12項目と両方の時系列を原文まで照合し、適合した原本を隔離SQLで同じIDに保存・再読してから通常反映へ進む。

<a id="analysis-b61-actual-result-20261120"></a>
## 9.198 B61の実4Bが照明と寸法図の経過を表示し、12件をまとめた実原本を隔離SQLへ保存・再読した（11/20 JST）

同じPodで確定ZIP（2,871,945バイト、SHA-256 `ea4f4155268eea5bdebc67790d3fd605c3f86cb313113b3d195510d75a1b4dc4`）を使用し、B61を1回実行した。同じ架空12記録について、分割36応答、統合3応答、前後対照4応答を取得した。再試行・追加学習は各0回。通常処理は759.460秒（上限840秒）、元の120u提供を復元するまで968.243秒（上限1,200秒）。復元PID 55860、開始tick `21106807`、試験ポートの閉鎖を確認した。受領ZIPは520,528バイト、SHA-256 `75ee032485806089b195633aff67bd426780902cc703c85c5d5fb30f2317caf1`。実原本は2,907,812バイト、SHA-256 `f3892a1e8fc7d29def464118b57c8066b27c77139589679b030686ecfbc55a82`。

実4Bは、4→9件目で「対照／照明／一方、」、10→12件目で「同じ依頼の経過／寸法図／後の記録では、」を選び、それぞれ左右両日の原文を指定した。図と全文に、店で照明を試して購入を見送った日と、予備費・設置条件を確かめて購入した日が表示された。別の線には、10月28日に業者への寸法図の依頼を提案し送信を未確認だった段階と、11月3日に家族から業者へ頼んだという連絡を受けて本人が返事をした段階が表示された。公開図は12項目・2線で、全文は4,032字。

| 統合段階 | 入力トークン | 出力トークン | 応答秒数 |
| --- | ---: | ---: | ---: |
| 計画 | 24,979 | 913 | 51.936 |
| 項目 | 26,310 | 1,739 | 106.669 |
| 関係 | 28,153 | 347 | 29.925 |

**原文との照合。** 主担当と独立担当が、それぞれ原入力・分割と統合の生応答・図・全文を照合した。両者とも個別12件をすべて適合、照明4→9と寸法図10→12の両組を確認済みと判定した。主担当の判定票のSHA-256は `c718feef4062c0657e31ba34c92eccd8be54028043a8fee16030c1a29c16ef97`、独立担当は `d1e15f9f5b05ef32d884a8b13867248194faa4cc35fbd79340ced69665fcb2f3`。

**隔離SQLへの保存と同一ID再読。** 適合した同じ39応答を通常APIの保存経路で再生し、1件を保存した。保存IDは `1d48e0cb-7ba6-48e3-b96f-3624a2d0fca8`。別プロセスから同じIDの図・全文・収録範囲と非公開根拠を読み、保存時と一致した。本人のHTTP 200、匿名401、別所有者のSQLSTATE 42501を確認した。再読のSQL書込み・モデル呼出しは各0。確定受領票のSHA-256は `6a47f60788afed596968243ba47f0b9a7a6ba5567166aeeecff602fa1c9ae25b`。

**互換読取と通常運用の現況。** [API開発版df7a39d0](https://github.com/MassyuRed/mashos-api/commit/df7a39d0fc05bd8950d1cfcca6d8c3c56ede510c)の読取経路に同じ保存物を渡し、モデル選択を120u／v24とした各条件で、現行・従来の両クライアント相当の最新・詳細を取得した。隔離GET計8件がHTTP 200で、同一ID・各形式の表示ハッシュ・非公開根拠が一致した。追加生成・SQL書込み・ホストDBへの呼出しは各0。

通常のRender API・ワーカーはmainを追従し、稼働版は `24bc228d`。接続中の管理機能には特定コミットを配備する操作がなく、ダッシュボードの配備画面はサインインを要求した。この時点では互換読取版の通常配備、分析MAPのv24選択、通常DB・API経由での保存と同一ID再読は未実施。B61の実原本と隔離保存は確定しており、次の作業は互換API・ワーカーの通常配備から再開する。

<a id="analysis-b61-normal-deployment-20261120"></a>
## 9.199 B61の互換読取版を通常API・ワーカーに配備し、同Podの公開経路を確認した（11/20 JST）

B61の実原本を隔離SQLで保存し、同一IDの別プロセス再読を確認した後、通常用の読取版を[API開発版df7a39d0](https://github.com/MassyuRed/mashos-api/commit/df7a39d0fc05bd8950d1cfcca6d8c3c56ede510c)に更新した。直前の通常稼働版 `24bc228d` との差分は83コミット・93ファイルで、マイグレーションの変更は0件。配備前のワーカーは実行中0件・待機0件だった。

| Renderのサービス | 配備ID | Live確認時刻（JST） |
| --- | --- | --- |
| mashos-astor-worker | `dep-dc00chd9fdbs73c7psa0` | 17:36:12.775 |
| mashos-api | `dep-dc00csjm8hqs7396pr2g` | 17:37:25.156 |

両サービスのLive SHAは `df7a39d0fc05bd8950d1cfcca6d8c3c56ede510c`。17:36:21.177 JSTのワーカー起動ログで `myprofile_latest_refresh_v1` の受付と `stale_after=1800s` を確認した。

17:38:24.606 JSTの `/healthz` はHTTP 200で、`status=ok`、`app=Cocolon MyModel` を返した。Renderアクセスログで17:39:06.989 JSTの最新取得、17:39:07.560 JSTの詳細取得が、いずれも匿名でHTTP 401となることを確認した。運用環境のOpenAPIは既存の公開設定でHTTP 404だった。

今回更新したRender環境設定はワーカーの期限のみ。既存のモデル選択値と接続先の実値は確認していない。

**通常GPUの到達確認。** 同じPod `dqmg1qgolenq7v` の公開8888番経由で `/cocolon-analysis/v1/chat/completions` と `/cocolon-emlis/v1/chat/completions` に匿名GETを1回ずつ行った。両方ともJupyterのHTTP 404 HTMLを返した。想定する認証応答（HTTP 401 JSON）には到達せず、この確認による推論は0回。通常GPU提供の切替候補 `B61_normal_gpu.py` は1ファイル・13,953バイト、SHA-256 `2f0e535f8dc4fde94e653f011ba9a96e9592e50ee67813917baa3826cb2bfcc9`。推論0回・通常87秒／復元込み174秒の範囲で準備し、この時点の送付・実行は各0。

**通常保存の現況。** 本番Supabaseの `public.analysis_results` で、隔離SQLの保存ID `1d48e0cb-7ba6-48e3-b96f-3624a2d0fca8` に一致する行は0件。通常API・ワーカーのv24へのモデル選択変更、通常のB61生成保存は各0。実原本の二者判定・隔離SQLでの保存と読取結果は§9.198を参照。通常GPUの接続とモデル選択の切替後、試験所有者の通常入力を使って生成・保存し、最新と同一IDの詳細取得で非生成再読を確認する。

<a id="analysis-b61-normal-gpu-20261120"></a>
## 9.200 同Podの通常GPUをB61用に切り替え、120uとv24の起動、公開経路の未接続を確認した（11/20 JST）

同じPod `dqmg1qgolenq7v` に、承認済みの2ファイル（合計22,112バイト）を各1回送った。Pod側で双方のSHA-256が確定値と一致した。

| ファイル | バイト | SHA-256 | 実行結果（JST） |
| --- | ---: | --- | --- |
| `B61_bridge_preflight.py` | 8,159 | `83f14defa8f6341224d8ebd2545d97c3d073430acd9d6d5279c8b489cadca406` | 17:54:55、終了コード0 |
| `B61_normal_gpu.py` | 13,953 | `2f0e535f8dc4fde94e653f011ba9a96e9592e50ee67813917baa3826cb2bfcc9` | 17:55:21、終了コード0 |

**通常GPUの切替。** 切替は26秒で終了し、結果は `profile=candidate`・`state=ready`、PID 56459、開始tick `21481121`。切替時のモデル生成は0回。

**公開経路の事前確認。** JupyterのPIDは149、開始tick `8316431`。確認対象の標準設定・配置先で専用ハンドラーを確認できず、分析用・自然応答用ともにネイティブ提供側の資格の参照元は存在した。公開経路用の既定の資格ファイルは両方とも見つからなかった。分析と自然応答の両公開経路はHTTP 404。カーネルとターミナルの管理経路は匿名GETにHTTP 403を返した。管理経路の403から稼働セッション数は判定できず、事前確認でJupyter管理の復帰条件も成立していない。

**切替後の独立した確認。** 同Pod内の `127.0.0.1:8000/healthz` にGETし、HTTP 200と `ok` を確認した。PID 56459・開始tickが一致し、実際の起動引数に既存の120uと分析MAP v24の両モデル名が含まれていた。認証済みJupyterLabのRunning画面にはターミナル8件、カーネルセッション0件と表示された。今回、Jupyterの再起動は行っていない。

受領原本のSHA-256は `run.txt` が `bd47110ce8eccd7b2a857c0c95b254a580814b549b82b8d09982df5b62dde2ca`、`preflight.json` が `0afe3edbac07df70cb3522b7e6540118f8ef109987f65594539baaff149a4733`、追加確認を収めた `verified.json` が `6f0949940533829d90be07e1dd5c97178dd7e63c3c3d37b8bf9ddfec9ec75d60`。いずれもPod側の表示と受領側で一致した。

**通常反映の残件。** Render API・ワーカーの互換読取版は§9.199で配備済み。同Pod内での起動確認にはモデル生成を使っていない。両公開経路を開通させた後、通常サービスからの到達、分析MAP・分析IF・EmlisAI・Pieceそれぞれのモデル選択を確認する。今回のRenderのモデル選択変更、通常DBへの生成保存、通常DB上の同一IDでの非生成再読はいずれも0件。

**11月20日18:01時点のRunpod Connect画面。** 同じPodのHTTP services欄には8888番のJupyter Labだけが表示され、状態は `Ready` だった。Direct TCPの接続先は22番で、SSH鍵は未設定、Web terminalは `Stopped` と表示されていた。8000番のGPUを公開HTTPサービスとして使えることや、Jupyterを停止した状態から復旧できることは、この画面では確認できていない。

**11月20日18:09 JSTの起動元診断。** 承認済みの `B61_jupyter_owner_check.py`（8,189バイト、SHA-256 `cb700a423c50a6eb0a6103620c99c2621e5f942a49257ca513958735a3820a95`）1件を同Podで照合し、18:09:07に1回実行して同秒に正常終了した。8888番のJupyter（PID 149、開始tick `8316431`）は、PID 1の初期化プロセスから `/start.sh` のシェルを介して起動していた。`/start.sh` は照合対象のRunpodテンプレートと一致し、Jupyterを `nohup` で起動してシェルを `sleep infinity` で待機させる記述と、標準出力・標準エラーが所定のログを指すことを確認した。受領原本 `owner-check.json` は1,172バイトで、SHA-256 `b2621b1e1034ac427f05b1b3cbf0a770b8b519f5568a0d9ad2bbe9fece538605` がPod側と一致した。診断は読取りだけで、Jupyter単体の再起動・自動復帰は未検証（`verified_service_restart=false`）。18:13:37 JST、Mashが有効にして開いたRunpodのWeb terminalで応答するプロンプトを確認した。Podとコンテナは対象と一致し、シェルからPID 1までの親プロセスにJupyter（PID 149）は含まれていなかった。Jupyter再起動後もこの端末から復旧できるかは未検証。

**11月20日18:27 JSTの隔離HTTP確認。** 同じPodで承認済みZIP 1個（8,345バイト、SHA-256 `1fd9f8358e2ba05e6df6fa9d99fb51ef9c52189a3837c9a8ce47e3565a5f78d4`）を照合し、1回実行した。既存の8888番を稼働させたまま一時的なローカルサーバーを起動し、試験用の資格で10回GETした。分析・自然応答の各経路は対応する資格で405、他方の資格と無資格で401。管理経路 `/api/kernels` は管理用の試験資格で200、分析用・自然応答用・無資格で403だった。子プロセスは外部通信できない条件で、18:27:40に `HTTP_START` 段階まで `PASSED`・終了コード0。子プロセスの終了、試験ソケットと一時ファイルの消去を確認した。`first_restriction=outside_write` は制限の記録で、実データに書き込んだことを示す項目ではない。受領票のSHA-256は `dca5793e2e5a02b8659876580fd06f69d9549aca327c8d8be105ff465ca5d369`。推論は0回。通常運用の実資格、既存8888番の経路切替、通常APIからの生成保存・再読は未検証。

**18:54 JSTの試行前に準備した切替候補。** 同Podで使う確定ZIPは18,951バイト、SHA-256 `fdb0f2b9a265b3081f397e2eb036bed639e8b7f8573a0b84863fd4c5e738b8f8`。候補に対するCPU試験51件が通った。実行前にカーネルが0件で、端末に実行中の子ジョブがないことを確認する。既に確認したJupyter端末8件は、停止するとセッションも未送信の入力も復元できない。切替の効力は今回のPod起動中に限られる。切替後の確認候補は、RenderのAPIとワーカーで同じ2,681バイトのスクリプトを用いる各2 GET（合計最大4 GET）。この時点では通常8888番の切替、Renderからの確認GETともに未実行。

**11月20日18:54 JSTの通常8888番切替試行。** 独立Web terminalで上記の確定ZIP（18,951バイト、同一SHA-256）を照合して1回起動した。18:54:15の受領票は `ABORTED / PRECONDITION`。`eligible_terminal_count=0` は初期値であり、端末の実数を表していない。受領票に個別の停止理由はなく、切替ジャーナルは作成されなかった。旧Jupyterへの終了指示前に停止し、旧8888番とGPUの8000番では、それぞれ従来の所有プロセス・開始tick・起動条件を確認した。試行中の既存ログでは管理用カーネル一覧の匿名GETが403、分析・自然応答の各経路は1回ずつ404だった。

独立端末から同じ事前確認関数を読取りで検査すると、待機中の端末を判定する `idle.waiting_on_terminal` のシステムコール情報の読取りで `PermissionError`（errno 1）が発生した。旧Jupyter直下の子プロセスは8件で、さらに子ジョブを持つものは0件。これは試行後の確認結果である。Renderの通常APIはFreeでShell・単発ジョブを利用できず、StarterのワーカーではShellの起動プロンプトを確認した。再実行、Renderからの確認GET、推論、通常DBへの保存はいずれも0回。

**02版の試行前に準備した候補。** `Cocolon_B61_Jupyter_Cutover_02_20261120.zip` は20,256バイト、SHA-256 `79c90962178b60630ffdb9e4cf4ac5e122b8b0455c2c9ada99f16acf1edb1157`。CPU試験63件が通った。Jupyterの正規の管理APIと通常取得できる所有・子ジョブ情報で事前確認する。最大8件のシェルで未送信の入力が失われ、実行中のシェル組込み処理も中断し得るため、今回の試行とは別の承認対象とした。成功時の到達確認候補はRenderワーカーから最大2 GET。FreeのAPIでは同じ方法を使えない。通常のモデル選択を配備した後、専用の試験所有者から分析と自然応答の両方を通常API経由で確認する案も未実行。

**11月20日19:09 JSTの通常8888番切替。** 同じPodで02版の確定ZIP（20,256バイト、SHA-256 `79c90962178b60630ffdb9e4cf4ac5e122b8b0455c2c9ada99f16acf1edb1157`）を照合し、1回実行した。19:09:16に `READY / EXTERNAL_CHECKS`、対象端末8件。受領票108バイトのSHA-256 `9a37ca3fe8df782d9ad8362c408723d5a536abfa5f5daea3df723bd4bec31409` がPod側と一致した。新しい8888番はPID 57532・開始tick `21926331`。GPUの8000番はPID 56459・開始tick `21481121` のまま稼働。Pod内では既存Cookie・管理認証とモデル用資格の分離を確かめた。分析と自然応答の両経路が無資格で401、対応する資格で405、他方の資格で401だった。切替は今回のPod起動中に有効。

**Renderワーカーからの実測。** 19:10:21、照合スクリプトをワーカーで1回実行した。既存の分析設定はHTTPSと経路が一致し、接続先ホストが不一致だった。自然応答の接続先は未設定。スクリプトはこの段階で終了し、資格やHTTP要求を送らなかった。19:11:19.968969、同じワーカーから指定Podの両公開経路に無資格GETを各1回実施し、どちらも専用の401 JSONを返した。ワーカーからの合計は2 GET。通常資格での405確認、推論、通常DBへの保存、設定変更は各0。Freeの通常APIからのGETは未実行。ワーカー確認記録のSHA-256は `d43b19afbe0797bf4a4db3786a29dc25c5c10785239c53405b9d1f179dae1f54`。

<a id="analysis-b61-normal-service-connection-20261120"></a>
## 9.201 通常APIとワーカーの接続設定を反映し、ワーカーの資格で両モデル経路を確認した（11/20 JST）

**ワーカーの接続確認。** 分析・自然応答の2経路の接続先・認証設定、計4項目を通常ワーカーの既存ビルド `df7a39d0` に反映した。配備 `dep-dc01vhd9fdbs73cbjfdg` は11月20日19:24:29 JSTにLive。新しいワーカーで19:26:46 JSTに固定の2,681バイトの照合スクリプトを1回実行し、認証付きGETを分析と自然応答に各1回送った。両経路ともHTTP 405で、それぞれ期待する本文と一致した。モデルへのPOSTと再試行は各0。確認記録のSHA-256は `7493d405134e93b0048693d4ef35e05a164737148e7e6617d2d09fc151868b25`。

**条件成立後のAPI反映。** ワーカーの両GETが適合したため、承認範囲どおり通常APIの同じビルドに同じ4項目を反映した。API配備 `dep-dc0216ss728c73c9g0o0` は19:28:22 JSTにLive。19:29:01 JSTの公開 `GET /healthz` はHTTP 200、`status=ok`・`app=Cocolon MyModel` で、実応答とRenderのアクセスログが一致した。ワーカー・APIの配備は各1回。API自身からのモデル認証GETと推論は未計測。

通常API・ワーカーへの接続設定反映を完了とする。今回の反映範囲に分析MAPのv24選択や、試験所有者による通常DBでの生成保存・同一ID再読は含まれず、これらは未完。§9.198の同一ID保存・再読は隔離SQLで確認した結果である。

<a id="analysis-b61-normal-map-selection-20261120"></a>
## 9.202 通常の分析MAP選択をv24に切り替え、APIとワーカーの稼働を確認した（11/20 JST）

通常の `mashos-astor-worker` と `mashos-api` で `COCOLON_ANALYSIS_MODEL` の変更前の値が `cocolon-qwen3.5-4b-analysis-semantic-120u` であることを読み取り、両サービスでこの1項目を `cocolon-qwen3.5-4b-analysis-node-local-v4-occurrence-v24` に変更した。保存後は各サービスの設定画面を開き直し、別の画面で完全なv24のモデル名を再読した。新規のビルドは作成せず、既存の `df7a39d0fc05bd8950d1cfcca6d8c3c56ede510c` をサービスごとに1回配備した。

| サービス | 配備ID | Live確認（JST） | 配備後の実測 |
| --- | --- | --- | --- |
| mashos-astor-worker | `dep-dc0261v40ujc73f6rtng` | 19:38:15 | 19:38:22、新しいインスタンスでASTORワーカーが起動。自己構造の標準・deep両ジョブを購読、期限1,800秒。 |
| mashos-api | `dep-dc0261u7bikc7396ndeg` | 19:38:37 | 19:39:10の `GET /healthz` がHTTP 200、`status=ok`・`app=Cocolon MyModel`。Renderアクセスログ `7ff34bea-64ab-48dd-b77a-c8041a9a174d` と一致。 |

通常の分析MAPのモデル選択を切り替える作業単位は完了した。稼働版のコード上、分析MAPがこのv24の場合も分析IFは120uを使用する。EmlisAI・Pieceの自然応答設定は今回の変更対象に含まれない。今回、試験所有者による通常のモデル生成・分析結果の本番DB書込み・同一IDの本人向け最新／詳細再読は各0件。受入れはその通常経路での実測後に判断する。

<a id="analysis-b61-normal-owner-check-20261120"></a>
## 9.203 専用の試験所有者で通常MAP生成を1回試み、HTTP 503で保存IDが発行されなかった（11/20 JST）

専用の試験所有者を新規に1件作成し、管理側で確認した。認証メールの送付は0件。通常のパスワードログインを用い、B61の架空入力12件を非公開で管理側から一括登録した。既存行の更新は0件で、入力の前後とも対象ジョブは0件。この入力準備は通常APIによる分析生成・保存の実績に含めない。

**通常MAPの実行。** 11月20日20:05:27 JST、本人として生成を伴わない最新取得はHTTP 200、保存レポートは0件だった。同じ本人として20:05:27.475714に通常MAPの生成要求を1回開始。20:19:52.353399にHTTP 503を受けた。Renderの要求時間は864.764秒。この要求に記録されたSupabase呼出しは2回、エラーは0件だった。試験所有者について管理側で確認したレポート数は0件で、保存IDは発行されなかった。生成済み成果物の通常DB保存と、本人用の最新・詳細からの同一ID再読には至っていない。

**生成要求後の確認。** 上記503の後、APIの旧インスタンスは20:20:27に停止し、新しいインスタンスは20:21:08に起動した。その間の20:21:04.839の非生成GETは、Renderには503として記録された。本人側のクライアントでこのリクエストのHTTPステータスは取得できていない。この非生成GETは20:19:52の生成要求とは別の要求である。停止・再起動の時系列だけでは、先の生成要求が503となった原因は特定できない。

**生成要求とモデルの終了状態の照合。** Podの既存モデルログで、11:05:27〜11:19:53 UTC（20:05:27〜20:19:53 JST）に受付39件、`complete_stop` 38件、`complete_length` 1件、`failed` 0件を確認した。単調時計から換算した時刻で、最初の受付は20:05:57.807 JST。最後の受付から21.527秒後の20:19:52.293 JSTに `complete_length` が記録され、通常APIの生成要求が503を返す約60ミリ秒前だった。ログには個別の所有者やフェーズ名は含まれない。この実行区間と39応答の順序・末尾の時刻は、v24が `finish_reason=stop` の応答だけを採用し、`length` なら503を返す実装と合致する。最後の応答が完結せず受入れを通らなかったことが、生成要求の失敗を説明する。終了ラベルだけでは出力トークンの上限と時間上限を区別できないため、以下で残枠と停止条件を照合した。専用の試験所有者について、DBのレポート・成果物・ジョブは各0件だった。APIの復帰後の `/healthz` は200。後続の非生成GETの503を同じモデル応答に割り当てる根拠はない。

**最終統合が時間上限に達した根拠。** 同じログと稼働版の生成停止条件を照合した。統合3段階で記録された直近の出力位置は順に1,024／1,664／0で、各段階の出力トークン数は1,025〜1,152／1,665〜1,792／1〜128の範囲に収まる。3段階合計の上限4,096トークンから前2段階の最大値を差し引いても、最終段階には少なくとも1,152トークン残っていた。最後の応答は最大128トークンで終了しており、トークン枠が尽きたケースから外れる。終了後も同じGPU提供プロセス（PID 56459、開始tick `21481121`）が8000番で待ち受けていた。停止イベントは一度設定されると同プロセス中では解除されない実装で、プロセス停止による打切りも除外した。

最終段階の所要時間は21.527秒、最初の受付から最後の `complete_length` までは834.486秒。全段階共通の840秒枠から転送余白5秒を引いた境界と一致する。今回の通常MAP生成は、最後の統合に残った時間が尽きて未完となり、v24の受入条件を満たさず503で保存前に終了した。原因の照合には既存ログとコードを使い、Podへの追加HTTP要求・追加推論はいずれも0件。通常コード・時間設定は変更していない。専用試験所有者の通常保存・同一ID再読は未完。

<a id="analysis-b61-normal-background-map-20261120"></a>
## 9.204 通常ワーカーでB61の12件を保存し、更新通知と本人の同一ID再読を確認（11/20 JST）

**マップを待つ間の画面。** 通常の感情入力を保存すると、入力APIの後処理が本人単位の更新ジョブ `myprofile_latest_refresh_v1` を `astor_jobs` に予約する（`emotion_submit`）。本人がマップを開いた場合も、保存済みのマップを先に返し、必要な更新をワーカーに予約できる（`map_view`）。生成に30分や1時間かかっても、入力を取りこぼさず、保存済みの版と処理状況から未処理・処理中・失敗を把握できることを優先する。

**長い履歴の生成。** 通常APIとワーカーに `mashos-api@dd20d322ffda8b2839f1d2c29dcc6d03973282fa` を反映した。ワーカーは20:56:19 JST、APIは20:58:26 JSTにLive。20:59:16 JSTの `/healthz` は200。分割が必要なv24履歴では、以前の全段階共通の840秒枠を、各推論段階の待ち時間に変更した。段階の受入条件を満たしたときに、その実行を引き受けたワーカーが最終進捗時刻を更新する。入力の準備と応答の検証にも上限がある。処理が進んでいる間は継続し、進捗が止まれば試行回数と入力の更新を確認する。保存直前に実行権と入力の版を再照合する。ローカルの回帰試験222件とサブテスト21件、別の重点確認72件とサブテスト21件が通過した。GitHubのAnalysis回帰でも全ステップが成功した。[GitHub Actions実行結果](https://github.com/MassyuRed/mashos-api/actions/runs/44731268041/job/136271328942)

**今回通した経路。** 専用試験所有者の非公開の架空入力12件は、以前に一括登録した固定入力12件と一致した。今回は通常キューへ更新ジョブ1件を最大試行1回で予約し、本人のマップ閲覧（`map_view`）が21:03:49 JSTに同じ予約の `queued` を確認した。ワーカーは21:03:50.764893 JSTに開始し、21:18:22.138794 JSTに保存、21:18:22.846150 JSTに完了した（14分32.081秒、試行1回）。処理中の状態も本人用ステータスで確認した。更新ジョブ・成果物・月次の保存参照は各1件。今回は新規の入力送信が0件で、通常入力の保存から更新ジョブが新設される分岐は実測対象外だった。

**保存版と通知。** 月次参照と分析成果物が同じ保存IDを指し、成果物は架空入力12件すべてに対応した。`astor_jobs` の `send_fcm_push_v1` は1件。`watashi_map_updated` の宛先本人、レポートID、版、画面の移動先が保存版と一致し、更新・通知の両ジョブが `done` となった。対象端末0件で通知の配送結果は `skipped_no_token`、FCM送信0件。端末上の到着・表示・タップは未確認。

**本人の再読と内容。** 21:18:46.470961 JST、本人による非生成の最新・詳細取得で同じID、図、本文、版、対象範囲が一致した。ステータス・最新・詳細を各1回、各項目の根拠を計12回、いずれもHTTP 200で取得した。図は12項目・2本の線、本文4,251字。12項目すべての根拠の入力IDとメモ／行動欄が試験原本に一致した。隔離環境で別に生成・保存した§9.198の本文は4,032字だった。

独立した読み合わせでも全12件・関係2本が原文に適合した。照明は10月10日に購入を見送り、修理代と予備費、照らす範囲を確認した10月25日に同じ本人が購入した。寸法図については10月28日に本人が依頼を提案し、11月3日には家族から依頼した旨の連絡を受けて返信した。図面の到着、家具の注文、制作日の決定は原文でも保存版でも未確定だった。

<a id="three-core-device-and-pod-20261120"></a>
## 9.205 三中核の通常経路、iOS配布とGPU借り替え（11/20 JST）

### 本番で確認した経路

本番APIとワーカーの開始時の版は `dd20d322`。§9.204の12件と別の専用試験アカウントで、非公開・友達通知オフの感情入力を2件保存した。通常APIの自然応答モデルは `cocolon-qwen35-4b-base-851bf6e`。問いへの回答後はスレッドの版が4→9（REFINED）、スキップ後は4→8（FINAL）になった。初回と確定時を合わせて4件の4B受領記録があり、本人による再読はそれぞれの確定本文・版・履歴と一致した。回答「その時は重かった。」は保存されたが、別々の欄にある「会議で発表した」「褒められた」に、原文にない「発表した後に」という順序を付けた。スキップしたケースは元入力だけで確定した。時系列を補わず問いと回答を対応付けるEmlis用の別候補は、保存再開を含む回帰134件に通った。候補の実4B比較ではHTTP 403で本文を取得できず、配備を保留した。

§9.204で本人再読したマップの保存版をiOS表示コードに渡し、図12項目、関係2本、最新・詳細の同一IDを確認した。登録端末のなかった試験所有者への実プッシュは0件。端末で通知をタップすると、ログイン中の宛先を確認して「今のわたしマップ」を開く。次の更新が済んでいれば、その時点の最新版を表示する。

この別の試験所有者では、通常の感情入力が起点となり、予約を事前に作らずに更新ジョブが新設された。21:42 JSTに2件の入力を根拠とするマップが1件保存され、月次参照・更新通知が同じ成果物を指した。

### Pieceの通常4Bへの切替

切替前の実4B試験は、元入力2欄と回答「その時は重かった。」の3段落を生成したものの、回答を単独で解釈する検査がプレビューを422で拒否した。非公開保存・利用回数の加算はなかった。修正版は同じ本人・元入力・実際に発行した感情の問いに結び付く回答を検査する。同じ入力で追加1回だけ4Bを呼び、3段落でプレビュー200、公開APIで本人の非公開保存200を確認した。作品の詳細・書き出し・履歴と保存時で、形式、本文・そのハッシュ、内容データ・そのハッシュ、描画レシピ・そのハッシュ、描画バージョンの8項目が一致した。利用回数は0→1。

11月20日22:05 JSTに本番APIへ `ac9978a9486dfb2e9c91be021fd2bfed37bc6d60` を配備し、`PIECE_MODEL_SOURCE=shared_4b.cmee.v2` を有効にした。22:06、同じ試験所有者が問いをスキップした別の入力で、本人の入力参照→通常プレビュー1回→非公開保存→詳細・書き出し・履歴まで全HTTP 200。本文は「誘われたのに、悲しかった。」の1段落で、保存時と本人再読時の同じ8項目が一致、利用回数は1→2。設定・配備版と成功した通常プレビューの処理分岐を照合した。カナリアでは4Bの実モデル名を記録した。通常公開レスポンスには生のモデル識別子を含めない。試験は元の情報を正しく保持して保存するところまでで、自然な編集文への改善やiPhoneでのPNG書き出しは別に確認が必要。今回の2つのAPI修正を含む関連回帰は225件成功。DBスキーマ変更なし。証跡は専用の架空入力だけを収録した `Cocolon_Normal_API_Evidence_20261120.zip`（SHA-256 `5c2dbcb2c13e79e6389df9461f33ca223c0341f3ff301ce84d7add6b9b87c38b`）。

本番ワーカーも同じ `ac9978a9` に更新した。22:09:54 JSTにLive、22:10にASTORの処理ループがキューを確認した。APIは22:06に `/healthz` が200。APIとワーカーをそれぞれ対象のコミットを指定して1回配備した。 この版のGitHub検査は [Pieceの実Postgres CI](https://github.com/MassyuRed/mashos-api/actions/runs/44740677837) と [分析のCI](https://github.com/MassyuRed/mashos-api/actions/runs/44740677985) がともに成功した。

### iPhone用のビルドと配布

前回内部配布が確認された8001の後に、問いの設定、観測の確定状態、わたしマップの表示、Pieceの作成画面が更新された。iOSの通常API接続先を持つアプリ版 `0e3a8251aafd998b69d215c2010295f28830ba1a` のJavaScriptとHermesバイトコードを生成し、関連するクライアント試験1,133件が成功した。[GitHub ActionsのiOSビルド #81](https://github.com/MassyuRed/Cocolon/actions/runs/44740379282)は、署名付きアーカイブ・写真アクセス目的文の検証・IPA書き出しに成功した。22:10:33 JSTのアップロードで、AppleはHTTP 403 `FORBIDDEN_ERROR.CONTRACT_NOT_VALID` を返した。ログに対象契約名は表示されていない。1回目の版1.0（8101）はApple未受領で、この時点では内部配布前だった。前回の8001は11月8日に同グループのTestingを確認している。

Mashが契約を確認して同意した後、同じアプリコミットで [ビルド #81 の再実行](https://github.com/MassyuRed/Cocolon/actions/runs/44740379282/job/136310132259) を1回開始した。再実行回数がビルド番号に含まれるため、Appleが受領した版は1.0（8102）。19工程がすべて成功し、App Store ConnectのBuild Uploadsで11月20日22:35 JSTの受領とCompleteを確認した。8001と8102のアプリ依存・Pod依存に差分はなく、iOSネイティブ変更はPieceの文字計測に限られ、追加の暗号実装も見つからなかったため、8001と同じOS標準の暗号化に関する申告を保存した。既存内部グループ「Emlis テスト版配布」のBuildsで、1.0（8102）・Testing・Expires in 90 days・iOSを確認（Apple build ID `e77f9f33-4b11-4dd1-9afe-fe7ed23b3a05`）。この配布単位は完了。MashのiPhoneでの8102の起動、実画像保存と端末へのプッシュ着信は未確認。

### GPUを借り替えるとき

通常アプリは `mashos-api` に接続し、RenderからGPUへ分析用と自然応答用の2経路でアクセスする。新Pod用の復元一式は `Cocolon_GPU_Transfer_B61_20261120.zip`（SHA-256 `0e2531b1663791df9039ca288a180541817f77c741de8c87702ed51e3986ed72`）。通常版と照合した分析IF用120u、マップv24用FIT36、推論サーバーを収録した。公開ベース `Qwen/Qwen3.5-4B` の固定版は初回に取得して照合する。新しいPod用の起動手順はRTX 4000 Adaを対象とし、13件のローカルHTTP試験を通過した。新しいPodでの起動と実推論は借り替え時に確認する。

| Renderの設定 | 切替時に指定する内容 |
|---|---|
| `COCOLON_ANALYSIS_MODEL_ENDPOINT` | 新Podの推論用HTTPS URL＋`/cocolon-analysis/v1/chat/completions` |
| `COCOLON_ANALYSIS_MODEL_API_KEY` | Podに設定した分析用の認証キー |
| `EMLIS_NATURAL_REPLY_ENDPOINT` | 同じHTTPS URL＋`/cocolon-emlis/v1/chat/completions` |
| `EMLIS_NATURAL_REPLY_API_KEY` | Podに設定した別の自然応答用の認証キー |

新しい構成はJupyterと推論を別ポートで起動する。推論用の例は8889。新Podを立ち上げ、RenderのAPIとワーカーに上記4項目を反映する。本人用の試験経路で実生成と同じ保存版の再読まで確かめ、旧Podの処理が終了してから旧Podを停止する。GPUの借り替えだけの場合、iOSアプリの接続先はそのまま使える。Runpodアカウントの管理用APIキーをこの4項目に入力する必要はない。

<a id="deep-insight-question-generation-design-20261121"></a>
## 9.206 わたしを知る問い（DeepInsight）の生成・検査・回答の詳細設計（11/21 JST）

[第12回報告会§7](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md#deep-insight-decisions-20261121)の出題と再利用を具体化する。確認版はアプリ `ad0364ad`、API `bbfce29e`。旧「今日の問い」の出題・履歴・配信を新経路の材料に入れない。感情入力時のEmlisの確認質問と、独立したDeepInsightの発行枠は別に持つ。

### 9.206.1 現在のコードと、生成品質に残っている不足

`POST /deep-insight/questions` は本人・プラン・JSTの日次枠・未回答を確かめる。出題枠があれば、その人の直近の感情記録・過去の問いと回答・マップを取得し、`deep_insight_question.py` で最大9,500バイトの材料を組む。`api_deep_insight.py` から既存のEmlis用4Bに一回渡し、出題するか、区分、参照元、引用、一問の文面をJSONで受け取る。CMEEは形式、Safety、原文と引用の一致、一問の形、既知の文面・キーとの一致／類似を照合する。SQLが日付、本人、プラン、未回答、参照した材料の版を再確認し、通過した問いに発行IDを付けて保存する。発行済みの未回答は同じIDで再表示する。 [生成と採用判定](https://github.com/MassyuRed/mashos-api/blob/bbfce29edd28862173f9c4cbc0bc9d27ae21a580/ai/services/ai_inference/cocolon_meaning_experience_engine/deep_insight_question.py) · [API](https://github.com/MassyuRed/mashos-api/blob/bbfce29edd28862173f9c4cbc0bc9d27ae21a580/ai/services/ai_inference/api_deep_insight.py)

合成候補を現行の採用判定へ直接渡すと、既に書いてある理由の聞き直し、引用の外に架空の出来事を足した問い、既回答を別の言い方で聞く問い、人間関係のテーマから外れた問い、区分が「条件」でも理由を尋ねる問いが通る。仕事・家庭という異なる条件を、文面が近いため同じ問いと判断する逆方向の誤りもある。引用、語句、文字列の近さから、問い全体の意味を検査したとは判定できない。参照した元の記録ID・版・原文位置も発行行から再導出できない。Emlisの「回答イベントがない問い」には、スキップや終了も含まれ得る。最新に保存されたマップは、今の原文・訂正と一致する現在版であるかを再照合する必要がある。

これまでに確認したのは、合成候補でのAPI・発行・本人回答・隔離DB保存再読と、模擬の分析応答でのマップ保存再読である。実4Bに材料を読ませた出題の妥当性、本人回答だけから次の実4B出題までの継続、通常配備・実機は未検証。今回の節は、未実装の生成品質部分を埋める設計である。

### 9.206.2 本人の材料と確認点を決める

| 入口 | 参照する材料と出題条件 | 発行の条件 |
|---|---|---|
| 記録をふりかえる | 本人の読取可能な感情記録の思考・行動欄、有効なEmlisの補足・訂正、過去のDeepInsight本人回答を読む。現在のマップは探す観点を選ぶ参考。Emlisの未確認は、有効な保留状態と発行したIDに戻って確認する。本人回答だけを起点にしてよい。答えることで理由・選択が変わる条件・大切にしていること等のどれか一点が具体化する場合だけ出す。 | 全プラン、JSTで新規1日1問まで。回答までは翌日以降も同じ問い。出題する価値が確かめられなければその回は発行しない。 |
| テーマから考える | 本人が選んだテーマの中で、新しい基準・価値観・関係の捉え方が分かる一点を選ぶ。出来事の記録がなくても成立させる。過去に十分答えられている観点は避け、本人の経験を前提に足さない。 | Plus・Premium。本人の操作でJSTの新規1日1問まで。Freeにはプラン案内を出す。 |

- 材料の取得時に所有者・閲覧範囲・原文の版を確定する。原文と本人回答は本文の欄、版、位置へ戻れる参照を持つ。AIが書いた問い・応答とマップの解釈は、確認点を探す文脈に使う。原文根拠に戻れないマップの内容は、出来事・本人判断を前提とする出題に使わない。
- 記録の思考欄と行動欄、有効な回答・訂正を同じ対象の範囲で照合する。AIの文面や別人の発言、別の日の出来事、撤回した内容は本人の答え扱いにしない。省略・条件・見込み・否定・未確認を確定に変更しない。Emlisでスキップした問いを未回答から再出題する判定へ回さない。
- 候補の比較単位は、同じ人・出来事またはテーマ・確認する観点・時点や条件の組。「なぜ先に引き受けたか」が回答済みでも、「どんな条件なら自分の仕事を先にするか」の答えがなければ別の観点として扱える。材料の取得範囲が不足した場合は「今回、回答を確認できなかった」と扱い、元の記録全体に答えがないと推定しない。

### 9.206.3 4BとCMEEの分担、既存技術の使い方

表は設計時の分担と参照した既存技術を示す。開発版が直接呼ぶ処理と、今回の材料取得の範囲は§9.206.5に記録する。

| 順序 | 処理と確定する内容 | 活用する既存の実装 |
|---|---|---|
| 1 材料を束縛 | APIが同じ本人の材料を取得し、原文・回答ごとのID、版、欄、引用位置を固定する。既存のマップ材料と同様に、本人の訂正・撤回の有効範囲を決めてから4Bへ渡す。 | CMEEの `source_kernel.py` の原文凍結・参照照合、`emlis_thread_source.py` の根拠resolver、`astor_material_snapshots.py` の保存済みsource確認。 §§9.57・9.72・9.204。 |
| 2 出題計画と文面の候補 | 同じ4B提供で、発行候補または見送りを返す。発行候補は「何について、何が既知で、何がまだ不明で、その答えで何が分かるか」と、自然な一問を別欄に持つ。記録入口では本人原文の参照、テーマ入口では選択したテーマを持つ。 | `emlis_question.py` の既知の本人説明を検出してENDにする考え方、根拠付き確認対象と発行IDの分離、有限なモデル経路での `NOT_STATED` の根拠束縛。`natural_reply_provider_settings` で既存4Bへ接続。 |
| 3 計画と自然文を独立に照合 | CMEEが原文・回答の引用位置を再読し、主体、場面、時点、否定、留保、条件、テーマ、問う観点を確認する。問いが前提として置く各内容が根拠と結び付き、一文を読み戻して計画と同じことを尋ねていることを確認する。既知の答えを言い換えた問い、テーマ外、答えても確認点が増えない問い、根拠不足は発行しない。 | `emlis_question.py` の `question_candidate`・`validate_question_binding` を、同じ資料で根拠と対象を照合する設計の参照元とする。DeepInsightは既存の根拠台帳・引用位置の解決を直接使い、複数資料とテーマに対応する出題判定は `deep_insight_question.py` が受け持つ。 |
| 4 発行・本人回答を保存 | CMEEが根拠から確認対象IDを導出する。SQLが同じ材料版、本人、日次枠、未回答を再確認し、同じ発行IDの保存・再読を返す。回答時はその発行IDと本人を照合し、同じ回答の再送は同じ保存結果を返す。 | `emlis_thread_service.py` の実発行IDと回答の対応、`deep_insight_issue`・`deep_insight_answer` の既存原子処理と本人確認。 |
| 5 次の問いとマップ | 次回出題では質問を文脈、回答を本人根拠として取得する。マップには `USER_DEEP_INSIGHT_ANSWER` を根拠として渡し、確定した原文だけを引用候補にする。回答の保存後は既存のASTOR更新と同じ保存マップの読み出しを使う。 | `analysis_cumulative_service.py`、`20261121133000_analysis_deep_insight_answer_handoff.sql`、§9.204の既存マップ通知式更新・最新・詳細・根拠の再読。 |

確認対象IDは文面や引用の切り方で変えない。対象と確認観点が同じなら既出とし、別の条件が確認できるなら区別する。文面の類似は比較候補を見つける用途に限定する。既存の有限判定から用途を外れる候補は、適合すると推測せず発行を保留する。自由文で確認が必要な場合は、既存4Bを使った別読みの資料照合を開発比較し、元の候補自身が返した区分や自己評価を採用根拠にしない。通常のモデル呼出し回数は、既存判定で閉じる正例・不適合例・別読みが必要な例を実測して決める。追加学習は原因を発行前の材料・候補・検査のどこかに特定してから判断する。

発行と同じ保存単位で、参照した版、元の根拠IDと位置、確認対象、判定版を本人用の非公開データとして結ぶ設計とする。ユーザーの原文・回答・推論本文は公開ログへ出さない。意味上の見送りと、通信失敗、出力不適合、資料の更新によるやり直しは記録上区別する。再訪や同時操作による重複生成は、既存 `generation_lock.py` を本人・入口・JST日・材料版の組に適用して抑える。発行済みかの最終判定は現行SQLに残す。

### 9.206.4 実4Bで確認する具体例と完了条件

| 確認すること | 限定ケースと期待する結果 |
|---|---|
| 聞く価値の判定 | 優先した理由がまだ書かれていない記録には、理由を一問だけ聞く。同じ記録に「相手が困っていたので」と書いてある版は理由を聞き直さない。選択が変わる条件が未確認なら、その条件だけ聞く。 |
| 意味と前提の照合 | 引用の外に家族・自分の仕事をやめた等の事実を足した候補、理由を条件に偽装した候補、人間関係を選んで朝食を問う候補、回答済みの言い換えを拒否する。仕事と家庭の条件が実際に別なら文面が近くても区別する。訂正・撤回・スキップ、別人の発言、見込みは元資料の状態を保つ。 |
| 回答が次の問いを育てる | 「意見が違っても本音を言える時」を起点に、相手のどんな反応が条件になるかを聞く。発行IDに「最後まで話を聞いてくれるとき」と保存して再読する。次のふりかえりでは本人回答として、マップでは実際に答えた条件だけを根拠として読める。感情記録がない場合も確認する。 |
| 出題枠と障害時 | 全3プラン、本人操作後のテーマ枠・記録なし出題、JST日跨ぎと未回答、同時発行、同一回答再送、別本人からの取得・回答拒否、資料の更新と通信失敗、同じ材料での再訪を確認する。 |
| 通常の保存と再読 | 実4Bの出力と採用／見送り理由を同じ架空材料で比較し、採用した文面が同じIDで保存・再読されることを確認する。既存マップを持つ人と回答だけのFreeで、更新キュー・ワーカー・次のマップ・根拠が本人回答に到達する。旧月次版と現在版を照合する。回答の保存後に更新予約が失敗し、再送またはマップ閲覧で回復する経路も確かめる。 |

最初は架空材料で現行版と設計適用版を比較し、原文・実候補・採用した本文・いずれの理由で出さなかったかを照合する。採用候補が本人の材料と一致した結果を、隔離DBでの同一ID・質問文・回答・マップ根拠の再読まで通す。通常反映と本人実機の確認はその後で行い、合成応答の経路検証やログイン画面の表示を実4Bの生成・品質の合格にしない。DeepInsightの通知運用と正式テーマ一覧は、第12回報告会で未決のままとする。

<a id="deep-insight-question-generation-verification-20261121"></a>
### 9.206.5 生成部の実装と新GPUでの検証（11/21 JST）

APIの作業版は [`a464167f`](https://github.com/MassyuRed/mashos-api/commit/a464167f9df45d42bd06a542d262e9b6664ce9f3)。出題する場合は、既存のEmlis自然応答用4Bを同じ認証経路で最大3回呼ぶ。

1. **確認点を選ぶ。** 本人の原文、回答、未確認の問い、現行マップの参照を分け、確認したい内容と原文の引用を決める。条件や理由が書かれた箇所をCMEEの既存の根拠照合に通す。記録に理由が書かれている場合は、理由をもう一度尋ねる計画を止める。
2. **一問を作る。** 4Bは確認点を尋ねる日本語の一文を書く。記録の問いではCMEEが照合済みの原文をそのまま引用として表示する。テーマの問いは本人が選んだテーマから始める。
3. **表示文を読み直す。** 4Bに表示する文面と本人の資料を渡し、その文面が尋ねていること、前提の根拠、既回答との重複を独立に照合する。本人回答が根拠のときは、回答のどの一節を指しているかも確かめる。読み直し側が同じ原文の一節の末尾まで返した場合は、原文の同じ開始位置・同じ範囲と照合し、表示した引用位置を保持する。計画と読み直しの観点・出典・条件が合う候補だけを発行に渡す。

発行SQLは本人・プラン・JST日次枠・未回答・資料の版を再確認し、参照元ID・版・欄・表示引用の位置とハッシュを発行IDに結び付けて非公開で保存する。同一の本人・入口・日・資料の版による同時生成は既存の生成ロックで抑え、同じ資料でモデルが明示的に見送った場合だけ短時間再利用する。本人回答は発行IDに対応付け、次の問いと既存のマップ更新キューで再利用する。

開発版が直接共用するのは、`natural_reply_provider_settings`、`build_evidence_ledger` と `build_evidence_span_resolver`、`build_emlis_safety_triage_decision`、`emlis_thread_source.identity`、既存の生成ロックとマップ更新キューである。§9.206.3の `source_kernel.py`、`astor_material_snapshots.py`、Emlisの問い候補・適合判定は設計時の参照元。発行対象の選定・一問の文章化・独立した読み直しはDeepInsightの専用実装で行う。

補助経路のEmlis回答は、元の記録・版・発行した問いへの対応が立証できた単一回答を渡す。訂正や複数回答の有効な意味を再構成する処理は開発版の範囲外で、その回答本文を根拠から除く。Emlisの有効な保留中の問いは、本人回答や出来事の証拠と区別して使う。マップは現在の材料に一致するものを参照し、引用の出典には使わない。 [出題と判定](https://github.com/MassyuRed/mashos-api/blob/a464167f9df45d42bd06a542d262e9b6664ce9f3/ai/services/ai_inference/cocolon_meaning_experience_engine/deep_insight_question.py) · [発行と材料のSQL](https://github.com/MassyuRed/mashos-api/blob/a464167f9df45d42bd06a542d262e9b6664ce9f3/supabase/migrations/20261121134000_deep_insight_grounded_questions.sql)

新しいRunpodのRTX A4500で、通常のEmlis・Pieceと同じ固定版 `Qwen/Qwen3.5-4B` の11ファイルを照合し、B61同梱の推論ソースと同一の自然応答処理をPod内の隔離経路で実行した。通常の自然応答と同じく分析用LoRAは使用しない。架空材料を使い、採否・実出力・私有の根拠情報を確認した。

§9.205の通常GPU構成一式の復元は未実施。分析IF用120uとマップv24用FIT36は手元のB61復元ZIP内で照合済みで、新GPUへの配置・起動、通常の公開ゲートウェイとRenderからの疎通は残る。既存の復元スクリプトはRTX 4000 AdaとCUDA 12.9を前提とする。RTX A4500の現在のイメージでは、依存関係とCUDAカーネルの再検証が必要。

| 材料 | 実4Bからの結果 |
|---|---|
| 「頼まれたことを先にした。」 | 理由の問いを発行候補に採用。本文の「先に引き受けた」は、原文の「先にした」が表す動作とずれる可能性がある。次の品質比較で原文の動作を保った言い換えを確かめる。 |
| 「相手が困っていたので、頼まれたことを先にした。」 | 既知の理由を尋ねる計画を、文面を作る前に拒否。 |
| 記録なし、以前の本人回答が「意見が違っても本音を言えるときです。」 | `「意見が違っても本音を言える」と書いていましたが、本音を言いやすい相手の反応は、どんなものですか？` を採用。既回答から、相手の反応という未確認の条件へ進んだ。 |
| 記録なし、本人が「人間関係」を選択 | 「友達だと感じる場面は、どんなときですか？」を採用。 |
| プロンプトの例にない記録「残っていた資料を先に直した。」 | 理由を尋ねる文面ができた。読み直しで引用と質問本文を混同し、発行を止めた。 |

記録とテーマの4件は `8ce7dca5` で実行し、最終API版でその3段階の指示と判定を引き継いだことを照合した。以前の回答だけで出題する1件は最終版 `a464167f` で実行した。採用した3件の実応答を最終版APIと隔離PostgreSQLに通し、同じ発行IDと文面の再取得、同じ問いと回答の再送、履歴での再読、わたしマップの入力材料への受け渡しを確認した。

本番Supabaseの移行、Renderの接続変更と配備、通常の本人経路でのマップ生成・再読、iPhoneでの確認は今後の検証に含める。

<a id="deep-insight-resume-implementation"></a>
### 9.206.6 「DeepInsightの実装作業を進めろ」で再開する箇所

この指示の対象は「わたしを知る問い」全体。ホームからの「記録をふりかえる」「テーマから考える」、本人回答の保存・履歴、次の発行とわたしマップへの反映を含む。最新の両作業ブランチと既存の差分を確認し、[華恋用R2.1](../../work_attitude_rules_for_karen/CURRENT_RULES.md#all-existing-information-and-files) に従って§9.205の通常構成と接続を復元・確認したところから、下表の未達箇所を進める。今回のアプリ入口は `navigation/InputStackNavigator.js`・`screens/DeepInsightScreen.js`・`features/home/useDeepInsight.js`、APIは `api_deep_insight.py`・`deep_insight_question.py`、発行と回答は `20261121132000`・`20261121134000`、マップ連携は `20261121133000` と既存のASTORワーカーが担当する。

| 入口 | 継承する実装と仕様 | 続きの確認 |
|---|---|---|
| 記録をふりかえる | 全プラン。意味のある確認点が見つかった日にJSTで新規1問まで。開いたときに候補を確認し、未回答なら翌日以降も同じ発行IDを出す。感情記録、根拠を確認できたEmlisの本人回答、過去のDeepInsight回答を使い、現在のマップは観点を探す参考にする。 | §9.206.5に記録した動作の言い換えによる意味のずれと、読み直しの引用取り違えから再開する。未使用の記録、理由記載済みの記録、過去回答だけの入口で本文と出典を確認し、採用した問いを回答・同じIDでの再読まで通す。 |
| テーマから考える | Plus・Premium。本人がテーマを選び「問いを受け取る」を押すと、4Bが選択テーマに沿う一問を生成する。選択肢は仮の5件（人間関係、自分の価値観、仕事・学び、日々の過ごし方、これからのこと）。問いそのものはその都度生成する。関連する記録・マップ・過去回答がゼロでも出題できる。JSTでテーマ入口全体の新規上限は1問。Freeにはプラン案内を表示する。 | 記録ゼロの「人間関係」は§9.206.5で実生成を確認済み。別テーマでも本人の経験を推定せず、選んだ範囲内の一問になっていることを実4Bで確認する。過去回答があれば、同じテーマの既回答を言い換えて聞き直さない。同日の再訪や別テーマ選択、JST日跨ぎ、前日の未回答の履歴、記録入口との同時操作で、テーマ枠が仕様どおり動くことを確認する。 |

両入口の回答は実際に発行した問いのIDへ保存し、本人の履歴で読み戻す。既存ワーカーが作る次のわたしマップで本人回答を根拠として読み戻し、次のふりかえりでも同じ本人の回答として使う。旧「今日の問い」は材料にも画面にも引き継がない。正式なテーマ一覧と通知の運用は議事録§7の未決事項を引き継ぐ。

<a id="normal-gpu-recovery-rtx4000ada-20261121"></a>
## 9.207 RTX 4000 Adaへの通常GPU構成の復元（11/21 JST）

Mashの共有「CMEE＋4Bの通常反映 2026.11.20」と§9.204〜205を起点とする。通常API・ASTORワーカーの稼働版は `e1404270` と確認した。DeepInsight作業版 `a464167f` は同じコミットを祖先に持ち、推論サーバーのソースは稼働版と一致する。 [華恋用R2.1](../../work_attitude_rules_for_karen/CURRENT_RULES.md#all-existing-information-and-files)

新Pod `t0upzfgrvmbxm6` のRTX 4000 Ada（20,475 MiB、compute capability 8.9）で、B61復元ZIPのSHA-256と同梱14ファイル、固定版Qwen3.5-4Bの11ファイルを照合した。初期イメージのPyTorchとTorchAudioがCUDA 12.8だったため、専用環境に前回と同じPyTorch 2.8.0+cu129・Triton 3.4.0と対応するTorchAudio・TorchVisionを用意し、正規のB61準備が `PASS_PACKAGES_AND_FIXED_BASE` になった。既存 `serve.py` でnativeと用途別認証付きゲートウェイを起動し、Pod内でhealth 200と、両経路それぞれ無資格・他方の資格401、対応資格GET405を確認した。

| 使用モデル | 11/20と同じ架空材料で確認した結果 |
|---|---|
| Emlis・Piece用の自然応答 | 最初は `length` で「費用」のみ。生成設定のEOSが `248044`、固定トークナイザーのEOSが `248046` と確認し、両方を新Podの自然応答用終了設定に含めた。元のモデルファイルと重みはそのまま照合済み。再起動後は1.908秒、HTTP 200・`stop`、末尾空白を除いた本文が11/20の対照と一致。 |
| 分析IFの120u | HTTP 200・`stop`、95.794秒。既存の候補スキーマで候補2件を返した。 |
| わたしマップv24のFIT36 | HTTP 200・`stop`、47.555秒。既存の単一記録のPLANで入力指紋・本文が11/20と一致。 |

ここまでの推論はPod内の通常ゲートウェイ経由。Runpodの公開HTTPS 8889は404、Renderの接続設定は更新前。Runpod管理のGoogleアカウント選択後に画面が進まず、別タブでもサインイン画面に戻った。再開点は認証付き推論用HTTPS経路の開通から。RenderのAPI・ワーカーへ§9.205の4項目を反映し、Emlis・Piece・わたしマップの本番経路で実生成・保存・同じ版の再読を確認してから、§9.206.6のDeepInsightの続きに入る。

**11/21の続き。** Runpod管理にログイン後、8889追加の保存が稼働Podのデータ消去を伴う表示を確認し、設定変更を取り消した。11/20のブリッジ原本を照合して、ノートブックとカーネルが0件の新PodでJupyterだけを切り替えた。既存Cookieと管理認証、用途別のモデルキー分離、8000番のGPUプロセスの同一性を確認。Renderワーカーから新Podの公開HTTPS 8888上の分析・自然応答両経路に到達し、無資格GETでどちらも401を確認した。

ワーカーの接続設定4項目をRenderのAPI経由で登録した結果、Auto-Deployが無効でも `main` の `2d2f06da` が自動配備され、Liveになった（`dep-dc0jj9e7bikc73b0le6g`）。通常稼働版 `e1404270` を指定したワーカーの再配備は自動審査により停止。APIは `e1404270` がLiveで、今回の接続設定は未反映。次はワーカーの `e1404270` への復旧、登録済み2経路の認証確認、同一版のままのAPI接続切替、通常保存・再読を行う。今回のワーカーでの業務影響とDeepInsightの追加実装は未確認・未着手。

**11/21のワーカー復旧。** Mashの承認後、ワーカーを `e1404270` に固定して再配備し、`dep-dc0jnbh7lnhs738spji0` がLive、`2d2f06da` はDeactivatedと照合した。APIも従来の `e1404270` がLive。ワーカーから新Podへの認証付きGETと、Render APIへの新Podの用途別キー2件の登録は自動審査により停止した。APIの変更は保存していない。次は認証付きで2経路を確認し、現在のAPIビルドだけを接続設定付きで再配備する。三中核の通常保存・再読後に§9.206.6から続行する。

**11/21のAPI接続反映と通常経路の再確認。** Mashの承認後、APIの用途別キー2件と接続先2件を現在のビルドに反映した。Render APIは `dep-dc0k186c6qcc73ejvjk0`、ワーカーは `dep-dc0jnbh7lnhs738spji0` でLive、どちらも `e1404270`。ワーカーからRunpodの分析・自然応答の両公開HTTPS経路に対応する認証でGETし、POST専用と示すHTTP 405を両方で確認した。

専用の架空アカウント作成は、Supabaseの表示名一意制約でHTTP 500になり、書込みはロールバックされた。試行を分けて専用アカウント1件を作成し、プロフィール更新の15文字制限に合わせ、同じアカウントのまま再開した。確認メール・プッシュ・友達通知は送らず、11/20と同じ架空材料を非公開で1件保存した。

| 通常経路 | 確認結果 |
|---|---|
| Emlis | 通常の4B受領イベント1件と確定本文が一致。同じスレッドIDの保存本文・版・履歴を再読して一致。 |
| Piece | 通常APIの `shared_4b.cmee.v2` で新規プレビューを生成し、非公開保存1件。同じ作品IDの詳細・履歴・書き出し用データで本文・表示用データ・レシピおよびハッシュ等8項目が一致。 |
| わたしマップ | 感情記録の保存で通常ワーカーが更新を開始。同じジョブの試行回数は2、状態は完了。同じレポートIDと版で、最新表示・詳細の図（2ノード）・本文が一致し、根拠から今回の非公開記録1件を確認。再読で追加生成は行っていない。 |

この時点で§9.205の通常構成を新Podで復元し、三中核の生成・保存・同じ版の再読を確認した。ここから§9.206.6のDeepInsightの実装を再開する。

<a id="deep-insight-restored-4b-issuance-20261121"></a>
## 9.208 DeepInsightの出題・同時発行の修正と新GPUでの確認（11/21 JST）

通常復元後に、API作業枝 `a464167f` から `eeae89c8` へ進めた。§9.206の構造を継承し、CMEEの原文根拠台帳、感情記録、出典をたどれるEmlisの本人回答、過去のDeepInsight回答、参考としてのわたしマップを用いる。通常の用途別4Bに確認点の選定・一問の文面化・独立した読み直しを依頼する。CMEEが原文で裏付けられることと新しく尋ねる価値を検査してから発行し、本人の回答を発行IDに結び付けて保存する。わたしマップは既存ワーカーで本人回答を根拠として取得する。

- 記録に書かれた出来事の理由を聞くとき、記録の動作を別の動作へ言い換えないようにした。原文に実在する句点だけを表示用の引用から外せる。4Bの質問文が照合済みの引用と同じ文字列を一度繰り返した場合は、原文引用を一度だけ出す。質問側が別の動作・出来事を足したら発行しない。完成文の引用をCMEEの根拠台帳で再照合し、4Bは同じ出来事・条件を尋ねているか、すでに示された理由を聞き返していないかを原資料から読み直す。
- 「記録をふりかえる」と「テーマから考える」が並行して材料の版が変わった場合、同じ本人・JST日・利用権・空き枠を確認する。新しい材料がある場合だけ、選択されたテーマを保ったまま一度再処理する。96秒の期限は初回と再処理で共用する。発行済みの場合は同じ発行IDを返し、テーマ入口の日次上限は1問のまま。

| 架空の試験材料 | 新RTX 4000 Adaの通常4Bで確認した出題 |
|---|---|
| 「頼まれたことを先にした。」 | 「頼まれたことを先にした」と書いていましたが、どんな理由からですか？ |
| 「残っていた資料を先に直した。」 | 「残っていた資料を先に直した」と書いていましたが、どんな理由からですか？ |
| 過去の本人回答「意見が違っても本音を言えるときです。」 | 「意見が違っても本音を言える」と書いていましたが、本音を言いやすい相手の反応は、どんなものですか？ |
| 「相手が困っていたので、頼まれたことを先にした。」 | 本人が理由を示しているため発行なし。 |
| 記録なし、本人が「仕事・学び」を選択 | 仕事や学びの中で、自分と他者の関係はどのように捉えられていますか？ |

初回は5材料・推論10応答。引用末尾の句点と同じ引用の繰り返しで見送った2件を修正し、その2件だけ実4Bで再確認して6応答。以前の回答とテーマは初回に採用した実応答を継承した。5材料を最終コードと隔離PostgreSQLで照合し、採用4問は同じ発行IDでの再読、回答の再送、履歴、わたしマップ用材料の取得まで確認した。既知の理由の1件は発行されなかった。別テーマの既回答・日跨ぎ等は§9.206.6を引き継ぐ。DeepInsightの本番Supabaseへの適用、Renderへの配備、端末試験は未実施。本番の三中核は§9.207で確認した `e1404270` が稼働版。

<a id="deep-insight-acceptance-criteria-20261121"></a>
## 9.209 DeepInsightの受入基準と配布判断（11/21 JST）

[前回の配備と内部配布](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md#deep-insight-normal-rollout-20261121)は、限定した材料で発行・回答保存・わたしマップへの連携を確認した記録。今後は、5テーマの出題品質と、ふりかえりが質問を出す条件・見送る条件まで確認してから配布候補を判断する。

### 決定済みの出題間隔と利用権

「テーマから考える」は全プランで初回から利用できる。次の新規発行までの間隔は、同入口の前回の発行からFreeが7日、Plus・Premiumが24時間。日付の切り替わりをまたいでも必要な経過時間を確認する。「記録をふりかえる」はPremium向けの別枠で、聞く価値があるときだけ新規最大1日1問を発行する。未回答の問いは同じ発行IDで保持する。両入口の枠は独立する。初回リリースでPremiumの販売を見送る場合、DeepInsightの新規発行はテーマの入口から提供する。

「テーマから考える」は、選んだテーマの具体的な場面で、本人の選択・条件・判断基準のいずれか一つを聞く。発行前の照合は同テーマの既出の問いを対象とし、本人の記録・回答・マップは生成用資料に含めない。回答を保存した後は、従来の本人資料としてマップ更新に渡す。「記録をふりかえる」では、本人の記録や回答に基づいて、今聞く意味のある一点を選ぶ。既発行の問いと回答へのアクセスは利用権の変更後も維持する。

### 実4Bの出題と通常利用の確認範囲

| 対象 | 受入確認 |
|---|---|
| テーマから考える | 人間関係、自分の価値観、仕事・学び、日々の過ごし方、これからのことごとに、実際に発行する問いを期待する50件、計250件を固定する。各テーマは初回から始め、採用した問いを履歴に加えて次の発行を試す。SQLとAPIの試験で、本人の記録・マップ・過去回答を変更しても同じ出題用資料が返ることを確認する。同じテーマでは、答えで分かることまで比較し、同じ観点の言い換えや一部の話題への偏りを確認する。30件を超えたときは既出の観点と同じ本文を再発行しないことも確認する。同じ材料・観点を決定的に再実行した結果は件数に加えない。 |
| ふりかえりの原資料 | 記録だけ、過去回答だけ、両方、マップなし、現行マップあり、資料が更新されて古くなったマップを含める。原文に残る行動・主体・条件・時点を守り、理由が未確認なら理由、理由が明示され別の価値があるなら新しい条件を尋ねる。資料がない、確認する意味がある点がない、既回答、スキップ、訂正・撤回、安全配慮を要する場合も確認する。マップは観点を探す際に使い、引用や本人の事実は本人の原文に戻る。 |
| 本文と採否 | 一つの具体的な場面に結び付き、何を選ぶか、何を目安にするか、どう捉えているかを平易に一問で聞けるか、実4Bの原候補と確定表示文を全件照合する。誘導、未確認の経験・動機の断定、テーマ外、既出の問いの言い換え、答えで具体的な情報が得られない候補は発行を見送る。記録の入口では同じ場面で本人がすでに回答した内容の聞き直しも見送る。意図的な見送りの対照は250件とは別に確認する。期待に反した見送り・不採用・生成や保存の失敗を記録し、再試行で最初の結果を置き換えない。 |
| 発行・保存・再読 | ホームから通常の本人経路で発行し、回答を保存して同じ発行ID・本文・回答を履歴から読み直す。再訪、再送、同時操作、日付をまたいだ再訪、7日・24時間の直前と到達時、二入口の独立した枠を確認する。回答は次のふりかえりとマップ更新に渡し、同じ版のレポートと根拠に対応する本人回答が残ることを確認する。回答の保存後に更新予約が失敗した場合の回復も確認する。 |
| 本人の資料と通知 | 発行、回答、履歴、マップ根拠を別アカウントが取得できないことを確かめる。原文・回答・推論本文・認証情報は公開ログや通知本文に出さない。「テーマから考える」は設定をオンにした本人へ、次の発行が可能になった時点で知らせる。「記録をふりかえる」は、聞く価値のある新しい問いを発行した時点で知らせる。対応する入口や発行済みの問いへの遷移、重複送信、通知が許可されない場合、前の問いが未回答の場合を確認する。旧「今日の問い」の通知ジョブ停止は別に確認する。 |

各テーマの固定50件で、通常の発行に進める品質の実出力を50件すべて確認する。生成・判定・保存の失敗や意図しない見送りは未達として記録する。同じ人に連続して出す試験では、言い回しを変えた同じ観点の再発行を未達とする。テーマの無作為な出題は、採用できる観点から通常経路が選ぶ仕組みと、その選択が実出力へ反映されることを確認する。同一入力の決定的な再実行は検証件数に足さない。

実4Bの本文、採否と理由、通常の発行・保存・再読の結果を残す。記録の入口では、架空の入力と回答を通常経路で蓄積し、わたしマップを生成・保存してから、問いを出す試験と見送る試験を実施する。両入口とも、修正で結果が変わった場合は旧結果を残し、新しい版で対象の一式を再評価する。Mashが結果を確認して配布を指示するまで、新しいビルドは作らない。

<a id="deep-insight-theme-isolated-material-actual-4b-20261121"></a>
## 9.210 テーマ専用の出題と実4Bの再確認

本番APIは `3c343a09` がLive。通常の自然応答用4Bで5テーマ各2問を検証した配備済み版は[議事録§11.7](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md#deep-insight-theme-question-quality-20261121)に記録している。今回もRenderワーカー内の既存接続から4Bに架空の場面を送り、「予定のない休日の朝、あなたはまず何を優先して過ごしますか。」という応答を得た。前回のWork環境から直接呼べなかったことは、通常経路の切断を示すものではなかった。

今回の候補は、テーマ別に15の場面と6つの観点を持ち、出題の少ない場面を優先しながら、未発行の組み合わせを無作為に選ぶ。既出照合は同テーマの全発行識別値と直近30件の問いの本文を使う。テーマ入口専用のSQLは、本人の記録・過去回答・マップを取得しない。確認した場面はCMEE側で保持し、4Bが書いた質問部分をつなげて完成文にする。発行前に語尾・場面の繰り返し・判断対象の有無を確認し、4Bで意味の重複と聞く点を読み直す。90組を使い終えた場合は、4Bが新しい場面を作る経路へ進む。発行済み回答のマップ連携は既存経路を使う。

| 新規・更新の実ファイル | 担当 |
|---|---|
| `mashos-api/ai/services/ai_inference/cocolon_meaning_experience_engine/deep_insight_theme.py` | テーマごとの場面と観点。文言を変えても発行識別値を維持するためのキーを持つ。 |
| `mashos-api/supabase/migrations/20261121190000_deep_insight_theme_candidate_context.sql` | 本人・テーマ別の出題資料、発行直前の資料照合、Premiumのふりかえり新規発行権。旧APIとの移行時互換を持つ。 |
| `mashos-api/ai/tools/deep_insight_theme_batch_eval.py` | 各50件の実出力検証。架空の発行履歴、実4Bの生出力・判定・最終文面を記録する。本番の保存RPCを呼ばない。 |

通常接続で、空の出題履歴を使って5テーマの同じ初回条件を比較した。指示の書き写し、場面落ち、敬体の崩れや判断対象の省略を確認し、文章化と採否を修正した。最後の比較では以下の実4B候補を取得し、同じ指示のハッシュと最終検査で再照合した。

| テーマ | 場面と実4Bの質問部分をつないだ文面 | 最終検査 |
|---|---|---|
| 人間関係 | 個人的なことを誰かに話そうか迷ったとき、どんな結果だと、その選択に納得できますか？ | 4Bの読み直しで見送り。 |
| 自分の価値観 | 人に何かを勧められて、応じるか迷ったとき、人に勧められた時に、何を基準に決めますか？ | 場面を重ねて尋ねるため見送り。 |
| 仕事・学び | 仕事や勉強で新しいやり方を試すとき、どんな結果だと、その新しいやり方に納得しますか？ | 候補採用。 |
| 日々の過ごし方 | 翌朝に予定があり夜の過ごし方を考えるとき、どんなときに変えますか？ | 何を変えるか本文で特定できず見送り。 |
| これからのこと | 始めてみたいことがいくつかあるとき、何を基準に決めますか？ | 候補採用。 |

この比較では5テーマ中2件が最終検査を通った。50件ずつの実4B評価は未実施で、発行品質は未合格。実運用に向けて、見送られやすい場面と観点の組み合わせで、判断対象を明示する本文を出せるようにする必要がある。候補API・DBの本番反映、ビルド、配布は行っていない。

<a id="deep-insight-theme-decision-target-actual-20261121"></a>
## 9.211 判断対象と観点を分けた実4B再比較

候補 `9563db98` で、既存5テーマの75場面に判断対象を追加し、行動・選択基準・変える条件など、答えとして求める内容ごとに質問の文型を渡した。初回の文章化に渡すのは判断対象・聞く点・文型で、表示済みの場面はCMEEで前に付ける。形式・内容で不採用になった文は一度だけ書き直す。既出による不採用ではその観点を再試行しない。文末が丁寧な疑問文になっている場合だけ、不足している疑問符を補う。出題済みの識別値、テーマ専用の資料、利用枠、回答の保存とマップへの連携は引き継いでいる。

通常のRenderワーカーから、既存の自然応答用4Bへ架空条件で実行した。前回と同じ初回の5場面を固定して比較し、追加で各テーマの別の1場面を試した。表示文と4Bの採否を候補コードの検査にも再入力した。各場面の出題履歴は空で、既出の対照は傾向の似た一問を与えて別に確認した。

| テーマ | 前回と同じ場面の実4B出力 | 発行前の検査 |
|---|---|---|
| 人間関係 | 個人的なことを誰かに話そうか迷ったとき、相手がどんな反応をすると、個人的なことを打ち明けてよかったと思いますか？ | 通過 |
| 自分の価値観 | 人に何かを勧められて、応じるか迷ったとき、勧めを断るか受けるか、何を基準に決めますか？ | 通過 |
| 仕事・学び | 仕事や勉強で新しいやり方を試すとき、どんな結果なら、新しいやり方を続けたいと思いますか？ | 通過 |
| 日々の過ごし方 | 翌朝に予定があり夜の過ごし方を考えるとき、どんなときに、翌朝に備えて夜の予定を切り上げますか？ | 通過 |
| これからのこと | 始めてみたいことがいくつかあるとき、始めたいことに取りかかる順番を決める基準は何ですか？ | 書き直し後に通過 |

| テーマ | 別の場面での実4B出力 | 発行前の検査 |
|---|---|---|
| 人間関係 | 一人で抱えるか人に助けを求めるか迷ったとき、誰かに助けを求めるかどうか、何を基準に決めますか？ | 書き直した後も、場面を重ねて尋ねているとして見送り。 |
| 自分の価値観 | 複数の人で出した成果への感謝や評価を伝えるとき、感謝や評価を伝える際、まず何をしますか？ | 書き直した後も同じ前置きが残り、見送り。 |
| 仕事・学び | 区切りまで進んだ仕事や勉強を振り返るとき、一区切りついた振り返りでは、次の作業の進め方を変えるのはどんなときですか？ | 書き直し後に通過。場面の反復が残る。 |
| 日々の過ごし方 | 体を動かそうと思って日常の予定に組み込むとき、体を動かす時間を日常に組み込むために、まず何をしますか？ | 通過。場面の反復が残る。 |
| これからのこと | 暮らしを変えるときに残したい習慣を考えるとき、新しい暮らしの中で、習慣を変えるのはどんなときですか？ | 通過 |

前回と同じ場面は5件中2件から5件中5件へ、別場面込みでは10件中8件が発行前の検査を通過した。既出の「どれを先にやるか何を目安にしますか？」と意味が重なる「取りかかる順番は何を基準に決めますか？」は、実4Bが重複として見送った。発行前の自動検査を通った文にも冗長さが残るため、商品としての合格は未達。50件ずつの実4B評価、30件を超えた継続出題での意味重複、本番の発行・保存・再読はこの候補で未確認。API・隔離DBを含む関連89件は通過した。候補の配備・ビルド・配布は行っていない。

通常反映の残件として、旧 `today-question-push` が稼働し、旧APIの廃止後の18:02:25〜18:02:30 JSTに旧通知の送信成功記録が10件あることを集計で確認した。個別端末への到達は未確認。停止は[議事録§11.6](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md#deep-insight-normal-rollout-20261121)の自動審査保留のまま。

<a id="deep-insight-theme-scene-and-history-actual-20261121"></a>
## 9.212 場面の繰り返しと既出の判断の再比較

候補 `9698e840` は、4Bが返した質問部分の先頭が、表示する場面と完全に一致する場合、または同じ場面・観点で確認済みの言い換えに一致する場合に、その前置きだけを一度取り除く。時点・場所・条件を足す文は機械的に削らない。表示する場面に二つの選択肢が明記された例に限り、短い基準の問いも読み直しに進める。既出との照合は、結合・整形後に実際に表示する文で行う。

以前に出した同場面の観点は、直近30件より前でも、カタログの発行キーから分かる範囲で読み直しに渡す。同じ観点と確定できる場合は4Bの読みに委ねず見送る。文面が残る場合は、聞き方の型が共通でも判断対象や時点が異なる例を読み直しの指示に追記した。従来のテーマ出題で発行したキーやカタログ外の場面から、過去の観点を推定することはしていない。

通常のRenderワーカーの4B接続で、§9.211と同じ10場面を架空条件で再生成。場面の情報を渡しすぎて二つの場面で不採用が再発したため、文章化の入力を判断対象・聞く点・文型に戻し、その2件を再生成した。最後に採用した実装と同じ条件では10件すべてが発行前の検査を通過した。ただし「この作業は、何を基準に始めますか？」のように、通過しても判断対象が曖昧な文が残った。

| 場面 | 比較で得た表示文 |
|---|---|
| 人に頼るか迷う | 一人で抱えるか人に助けを求めるか迷ったとき、何を基準に決めますか？ |
| 人からの勧め | 人に何かを勧められて、応じるか迷ったとき、何を基準に決めますか？ |
| 共同の成果 | 複数の人で出した成果への感謝や評価を伝えるとき、まず何をしますか？ |
| 作業の振り返り | 区切りまで進んだ仕事や勉強を振り返るとき、次の作業の進め方を変えるのはどんなときですか？ |
| 運動を予定に入れる | 体を動かそうと思って日常の予定に組み込むとき、まず何をしますか？ |

前回の生出力を使った別の確認でも、頼る判断、共同の成果、振り返り、運動の4件は前置きが一つになり、実4Bの読み直しを通過した。「新しい暮らしの中で」は変更後という条件を足すため残した。別表現の既出本文と、古い発行キーで同じ観点と確定する対照はいずれも見送り。古い観点が同じ意味でも言い回しが異なる対照は、4Bが通しており未達だった。

各テーマで別の3場面を加え、同じ人に過去の問いが出ている条件で15件を試した。発行前の検査を通ったのは4件。8件が文面、3件が重複で見送りとなった。通過したものにも「頼み事をやめますか？」など、判断対象を取り違えた文があった。そこで「やめる」という共通の文型を、引き受ける範囲・金額の上限・作業を区切る目安などに修正した。元と同じ既出条件で6場面を再生成すると、「どこまでなら、頼まれたことを引き受けられますか？」、「どんなときに、約束の変更の伝え方を変えますか？」、「一つの区切りまでに進める範囲をどう決めますか？」の3件が通過し、予算・締め切り作業・スマートフォンの3件は見送りだった。別の判断なのに重複扱いされた3件を新しい指示で再判定すると、2件は文面で見送られ、残る1件は重複扱いのままだった。実際に意味が重複する対照は新しい指示でも見送った。

API・隔離DBを含む関連98件が通過した。実4Bでは対象を限定した比較と再検証を行い、50件ずつの連続評価は実施していない。短い比較では候補と同じ生成・読み直しの指示を通常4Bに渡した。候補の本番発行、保存、再読、ビルド、配布は未実施。

<a id="deep-insight-theme-batch-interruption-20261121"></a>
## 9.213 テーマ連続評価の中断・ワーカーの復旧・旧通知停止（11/21 JST）

### 検証ブランチと実4Bの評価

[API検証版 `148afba6`](https://github.com/MassyuRed/mashos-api/commit/148afba69916674f01d5969525189f3fa52e9ecf)（ツリー `033711c291724334ee644d690559e5010d12eca6`）では、5テーマで具体的な判断対象を出題材料に追加した。Premiumのふりかえりは、現行のわたしマップの保存後に既存ワーカーで判定し、新規発行時に本人への通知を予約する。[アプリ検証版 `704ef82c`](https://github.com/MassyuRed/Cocolon/commit/704ef82ca24c38dd3afc7f20ec430badb885af80)では、全プランでテーマを選べる画面、利用間隔の表示、通知から本人の「わたしを知る問い」への遷移を接続した。両版はGitHubの検証ブランチに保存し、読み戻し済み。APIのローカル関連テスト111件が通過した。

架空材料による実4Bの事前試行では、18件が発行前の検査を通過した。5テーマ各50件の連続評価は、250件中126件の処理まで観測した時点で中断した。再起動で旧インスタンスの一時結果を取得できなくなり、この連続評価の本文・採否を照合できる結果は0件。§9.209の受入確認は、5テーマ各50件の実出力・採否・出題履歴の照合、両入口の通常発行・回答保存・同じIDでの再読、マップへの連携と通知が残る。この記録時点で候補の本番反映・ビルド・配布は行っていない。

### ASTORワーカーの復旧

試行前7日間に10分間隔で計測したRenderのメモリ使用量は最大266 MiB。連続評価をワーカー上で実行した時間帯に約196 MiBから約507 MiBへ上昇し、19:41:12に上限512 MiBでメモリ不足終了、19:41:13に再稼働した。メモリ増加のプロセス別内訳は未計測。

19:45:36にStandard（1 CPU・2 GiB）へ変更され、19:46:05に既存版 `eeae89c8` でLive。19:48に上限2,048 MiB、使用量約148 MiBを確認した。本番APIは `3c343a09` がLive。正式リリース時に必要なワーカー容量は未確定。

### 旧「今日の問い」の通知

旧Renderジョブ `today-question-push` は19:32:43に手動停止した。最後の実行ログは19:31:55で、最後の旧通知送信成功は18:02:30だった。次回予定の19:35を過ぎた19:37:57までに、停止後のRender実行ログとSupabaseの旧通知送信成功記録はともに0件だった。確認範囲はRenderの稼働状況と送信記録で、個別端末の受信は未確認。

<a id="deep-insight-theme-intent-and-notification-recheck-20261121"></a>
## 9.214 判断対象の実4B再比較と通知からの遷移（11/21 JST）

### 4B接続と比較条件

ASTORワーカーの上限2 GiB、既存の推論先と認証設定を確認した。初回はワーカーの `EMLIS_NATURAL_REPLY_MODEL` が空で、10件を試行したものの推論先へ到達した要求は0件。比較用プロセス内だけで既存の公開モデルID `cocolon-qwen35-4b-base-851bf6e` を指定し、同じ推論先へ実4Bの要求が通ることを確認した。Renderの本番設定は変更していない。

[候補API `73b5dc74`](https://github.com/MassyuRed/mashos-api/commit/73b5dc749fde05d69e16b01c4a79d672f6af0078)は、質問をつくる段階と読み直す段階で、判断する対象・求める答えの範囲・行動の時点を確認する。31件目以降の過去の発行は、同じ場面の発行キーから、場面ごとに定めた具体的な観点を復元して読み直しに渡す。新規出題に使用する観点と同じ記述を使うため、発行本文のない古い履歴でも、その場面に即して問いの重複を確認できる。

架空資料を使い、同じ5テーマ各2件を候補・前版 `148afba6` でそれぞれ順番に実4Bへ通した。各版は採用した問いを次の発行履歴に加えた。仕事・学びの2件目は、1件目の採否が変わり照合する履歴も変わった。発行前の自動検査を通ったのは前版4件、候補7件だった。

| テーマ | 候補の自動検査通過 | 本文・見送りで確認した点 |
|---|---:|---|
| 人間関係 | 1/2 | お礼の品の金額上限を聞く文は、前置きが感謝を表す場面までで、お礼の品を選ぶ前提が合わず見送り。 |
| 自分の価値観 | 2/2 | 「どんなことがあれば、自分の評価の基準を見直しますか？」は判断する対象と見直す条件が明確。 |
| 仕事・学び | 2/2 | 「試す前に、慣れたやり方と何を比べておきますか？」は試す前に確認する点を聞けた。2件目は振り返りの手順と結果を混同したまま通過。 |
| 日々の過ごし方 | 1/2 | スマートフォンを見る時間帯をずらす問いは、初稿が「何か？」で終わった。敬体に書き直した後も、保存した実4Bの読み直しでは文面理由（surface）で見送られた。 |
| これからのこと | 1/2 | 保存した実4B応答では、暮らしに残す習慣を選ぶ問いは初稿・書き直しとも文面理由（surface）で見送られた。通過した「この作業を始める際、何を基準に優先順位を決めますか？」は選ぶ対象が曖昧。 |

### 画面・試験・通常反映

[候補アプリ `84d9eaf0`](https://github.com/MassyuRed/Cocolon/commit/84d9eaf0259dc789022a5e0749dae39ecdf3ccda)では、テーマ通知からテーマの入口を先頭に表示する。ふりかえり通知はログイン中の本人に限定し、届いた発行IDを本人の履歴と照合する。該当する問いが履歴にある場合は、その問いを履歴の先頭へ出し、現在の未回答の問いはふりかえりの入口に表示する。画面を開いている間に通知を押した場合も本人の内容を読み直す。APIは両版で関連111件が通過。アプリは関連141件、動作確認14件、npmの検査88件が通過し、検査範囲には重複がある。

本番APIは `dep-dc0lkj97lnhs739215pg` の `3c343a09`、ワーカーは `dep-dc0nckc0916s73c927tg` の `eeae89c8`（`profile=all`）でLive、APIの `/healthz` はHTTP 200。SupabaseではDeepInsightに適用済みの最後の移行 `20261121073537` を確認し、候補に必要な利用間隔・テーマ通知・テーマ専用資料・ふりかえり通知・マップ保存後判定の5移行は未適用。対応するGit上の移行は順に `20261121185000`、`20261121185100`、`20261121190000`、`20261121192000`、`20261121193000`。旧「今日の問い」の通知ジョブは停止を維持していた。

発行前検査を通った文にも上表の意味上の問題が残る。候補では5テーマ各50件の品質確認、通常経路での発行・本人回答と同じIDの再読・マップ連携・通知の受入確認、本番反映と配布は未完。

<a id="deep-insight-premium-answer-map-replay-20261121"></a>
## 9.215 Premiumの問い・回答・わたしマップの実4B検証（11/21 JST）

同じ架空記録2件で、候補 `73b5dc74` は両方を見送った。理由をすでに書いた記録では、4Bが相手が困っていた理由を選んだため発行前に棄却した。理由が未確認の記録では「残っていた資料を先に直した」の引用と問いは原文に沿っていたが、読み直しが根拠不足と誤判定した。

[API `0c5a95ef`](https://github.com/MassyuRed/mashos-api/commit/0c5a95efc2ef35208fd8e61a4da5ab5e9c856b25)は、理由を聞くときに原文に動作があるかを照合することと、動作の理由が記録済みかを分けた。「残っていた資料を先に直した」と書いていましたが、どんな理由からですか？ の実4B候補が発行前の検査を通り、理由が書かれた対照は引き続き棄却した。

隔離DBに同じ原文・時刻を再現し、実4Bの応答を生成時の資料・指示と照合してAPIへ戻した。原資料なし・理由が書かれた記録では発行0件。理由が未確認の記録では1件発行し、再訪・再送で同じ発行IDを返した。架空回答を同じIDで保存し、保存の再送と履歴再読でもID、問い、回答本文が一致した。新規枠の再消費はなかった。

その同じ回答を含む資料から実v24を1回呼び、40.016秒で `stop` を受領した。隔離DBへ保存し、最新と詳細で同じレポートID・図・本文を再読した。図2項目のうち1項目の根拠に発行・回答と同じIDがあり、問いと回答の本文が一致した。別の試験所有者には詳細を返さず、再読時の追加生成は0件。通常のAPI処理と保存経路を使った隔離試験であり、本番DBの書き込み、実端末への通知、現在のマップで開始する自動発行の受入れは未確認。

テーマの追加調整 `0c5a95ef` は同じ5テーマ各2件で自動検査5件まで低下した。[最新検証版 `b7c1d8a8`](https://github.com/MassyuRed/mashos-api/commit/b7c1d8a8de09413204eaafde0cfdbc10181cfb4a)はテーマを7件通過した `73b5dc74` の生成・照合内容へ戻し、実際に発行できたふりかえりの指示を残した。両方の実行版と生成・照合に使うソースがそれぞれ一致し、API・隔離DBの関連111件が通過した。テーマ250件の受入れ、候補の本番DB移行とAPI・ワーカー配備、新規アプリ配布は未完。

<a id="deep-insight-theme-context-and-history-20261121"></a>
## 9.216 テーマの場面・判断対象・既出問の照合（11/21 JST）

初稿には、アプリに表示する場面と、本人から聞きたい判断対象・観点を渡した。贈り物の金額、スマートフォンを使う時間帯、集中が切れたときなどは、その観点を聞ける時点や状況を場面に明示した。[`6c95b984`](https://github.com/MassyuRed/mashos-api/commit/6c95b984a204f3b7cf6553d9bd7907e11e7c3b40)から、確定表示文の意味と既出問の意味重複を別々に照合した。既出照合には、直近30件の本文と、発行キーから分かる古い場面・判断対象・観点を使う。全履歴の発行キー・本文キーも照合し、テーマ入口の材料には本人記録、回答、マップを含めない。

5テーマ各4件の連続評価では、`6c95b984`が20件中16件を通過。各テーマの最初の2件に限ると、§9.214の7件から9件へ増えた。残り4件は初稿と書き直しが同文だった。[`2c9b7fb6`](https://github.com/MassyuRed/mashos-api/commit/2c9b7fb6d1b81a2f65f282684eb8e20957b9e6f0)では、不採用文を再入力せず、場面と聞く点から書き直すよう変更した。初対面のひと言、勧めを試す負担、疲れた夜に引き受ける用事は通過した。採否によって次の履歴と選ばれる場面が変わるため、全体の自動検査通過数は同じ16件だった。

重複の対照では、履歴全体を比べる4Bが「新しい方法を次も使う条件」と「試した手順を続ける価値があると判断する結果」を同じ問いとして扱えなかった。一方、二文だけを実4Bに比較させると、この対を重複として検出し、「勧めを試す負担」と「約束を守る負担」は区別できた。49件の架空履歴を使った別の条件では、比較資料17,162バイトに対して1.518秒で判定が返った。この49件は照合の負荷を見るために用意した履歴で、順に実4Bで発行した49件の品質確認は残る。

[`002317c5`](https://github.com/MassyuRed/mashos-api/commit/002317c5817c9562845cc9d6ac476048ab9e31e7)は、同じ結果を聞く二つの候補の片方が出題済みなら他方も選択対象から外す。既出との重複を指摘した場合、指摘された本文と一対一で読み直し、別の問いだと確認したときも残りの履歴を照合する。発行キーは従来どおり。5テーマ各4件の実4B評価では19件が自動検査を通り、約束を守る負担の問いも再照合で通った。残りは集中が切れた場面の問いで、同じ場面を重ねて読みづらくなり、読み直しで見送った。

[`ed1a5432`](https://github.com/MassyuRed/mashos-api/commit/ed1a5432d6a6aa2d0afc191d5ddce182b9b7b22a)で「集中が切れたとき、このまま続けるか、いったん区切るか」の基準を聞く形に直した。5テーマ各10件に広げ、各テーマの最初の4件は計20件すべて自動検査を通った。全50件では37件だった。後半では4Bが一問をかぎ括弧で包むか、`question` の1項目を単引用符で囲んで返し、JSONとして読めずに候補が止まる事例があった。

[`56f73b31`](https://github.com/MassyuRed/mashos-api/commit/56f73b31ccd9d52ae82c1c94381c32a14ccf54e0)ではテーマ本文の生成だけで、この二つの形式から一問を取り出して既存の検査へ渡す。文型の未置換記号、疑問文として成立しない文、場面や判断のずれ、既出との意味重複は、引き続き発行前に検査する。両版で同じ50件の試験計画を使い、各テーマで通過した問いを次の履歴に加えた。出題履歴が変化したときは、後続の発行候補も変わり得る。

| テーマ | `ed1a5432` 自動検査 | `56f73b31` 自動検査 |
|---|---:|---:|
| 人間関係 | 8/10 | 8/10 |
| 自分の価値観 | 8/10 | 9/10 |
| 仕事・学び | 7/10 | 9/10 |
| 日々の過ごし方 | 7/10 | 8/10 |
| これからのこと | 7/10 | 7/10 |
| 合計 | 37/50 | 41/50 |

最新候補では「作業の途中で集中が切れたとき、このまま続けるか、いったん区切るかは、何を目安に決めますか？」が通過した。残る9件では、場面を言い直してから同じ判断を聞く文、文型の「〜」を残した文、問いになっていない文を確認した。通過文にも、手順を比較するのか切替を始めるのかがずれた例や、選択肢の一方を先に選んだ前提で聞く例が残る。発行前の自動検査通過は、商品としての受入れに換算しない。

API・隔離DB・関連回帰の116件が成功。RenderのAPI `3c343a09`・ワーカー `eeae89c8` の稼働、旧通知ジョブの停止、Supabaseで候補に必要な5移行が未適用であることを読み取りで再確認した。実4B試験は既存接続を使い、ワーカーのモデル名を評価プロセスにだけ指定した。5テーマ各50件、候補の本番DB移行・APIとワーカー配備、通知と新規配布の受入れは未完。

<a id="deep-insight-theme-answer-intent-and-premise"></a>
## 9.217 テーマ出題の再比較と通知先の同一ID再読（11/21 JST）

答えの種類を全テーマの生成指示に加え、判断時点を全件で厳しく読み直す [`da8b5f6d`](https://github.com/MassyuRed/mashos-api/commit/da8b5f6d5e7c1df868a5b1e747beec7b755a70b1) では、50件中24件が自動検査を通った。生成文に「今の行動や予定を変える条件として」が混ざり、以前に通過した夜の過ごし方の問いも見送ったため、この版は採用を見送った。

[`cbb9a53`](https://github.com/MassyuRed/mashos-api/commit/cbb9a53a53e20a50f9985ffb4c5896a53e029384) は前版の生成指示と再読の基準を基に、ずれを確認した場面に完成した例文と必要な前提を渡す。二つの方法を試し比べる段階など、選択が未確定の場合に一方を選んだ前提へ変えていないかを確認する。先頭の場面と同じだと確認できる節だけを落としてから表示文を再読する。「何から始めますか？」を検査に通し、「何か始めますか？」は見送る。本人の記録・回答・マップはテーマ出題に渡さず、既出問との意味の照合は別に行う。

3版で同じ5テーマ各10件の計画を使用した。各版で通過した問いを次の発行履歴に入れるため、採否が変わると後続の場面も変わる。

| テーマ | 前版 `56f73b31` | 全体の指示を更新 `da8b5f6d` | 対象場面の修正 `cbb9a53` |
|---|---:|---:|---:|
| 人間関係 | 8/10 | 6/10 | 9/10 |
| 自分の価値観 | 9/10 | 3/10 | 9/10 |
| 仕事・学び | 9/10 | 4/10 | 10/10 |
| 日々の過ごし方 | 8/10 | 2/10 | 8/10 |
| これからのこと | 7/10 | 9/10 | 8/10 |
| 合計 | 41/50 | 24/50 | 44/50 |

最新の比較では、短い自由時間の問いが「自由時間になった直後に何から始めますか？」で通過した。公平さの場面で「同じ扱いを選んだ」と前提を置いた文は見送った。見送りは前提のずれ1件と文面5件。全50件を読み合わせ、通過文にも空き時間を自分のために使うと決めた前提になった例と、新しい環境への適合の手がかりを満足度に変えた例を確認した。場面の二重記述や判断対象が曖昧な文も残る。生応答と確定表示文・採否を試験計画とともに保存した。

### 通知と本人の既発行問を開く処理

[`ccc9a7e9`](https://github.com/MassyuRed/Cocolon/commit/ccc9a7e94b8adf4bc02bfe627610f3fa36a9e9b0) では、アプリを使用中にも、本人への通知か・端末の通知許可があるかを確認し、同じ通知は一度だけ表示する。タップは既存の通知遷移を使う。テーマの発行可能時刻を過ぎて取得に失敗した場合は画面から再確認でき、アプリを前面に戻したときも再取得する。ガイドにもFreeは7日、Plus・Premiumは24時間、ふりかえりはPremiumと反映した。

ふりかえり通知が指す問いが直近40件から外れた場合は、`GET /deep-insight/questions/{question_id}` から同じ発行IDの問いと保存回答を開く。Supabaseの `20261121194000_deep_insight_question_by_id.sql` は本人IDと問いIDを同時に照合し、別の本人の問いと存在しない問いはいずれも404となる。アプリからはAPIを経由し、SQL関数はサービス権限だけが実行できる。端末が取得できない場合は再確認を表示する。隔離DBでは履歴から外れた問い、既回答の再読、別の本人からの取得拒否を確認した。API・隔離DB・関連回帰121件、本人切替と通知を含むアプリ試験89件、アプリ標準試験88件が成功した。

本番はAPI `3c343a09` とワーカー `eeae89c8` が稼働し、候補に必要なSupabase移行6件は未適用。実4B評価は架空の材料だけで行った。テーマの5テーマ各50件の受入れ、候補の本番DB/API・ワーカー配備と本人通知の確認、新規配布は未完。

<a id="deep-insight-theme250-and-skipped-reflection-20261122"></a>
## 9.218 テーマ250件の実4B試験と、回答を見送った問いの扱い（11/22 JST）

### テーマ出題

[実4Bを試したAPI版 `c6f18dc`](https://github.com/MassyuRed/mashos-api/commit/c6f18dc8cc9d90d586c3617a32b6dee493ef195a)では、前回ずれが確認できた場面に絞って、表示する状況、質問例、選択の前提を整えた。公平さではどの対応を選んだかを決めつけず、空き時間を誰のために使うかは未確定のまま扱う。新しい環境を試した場面では、合うかを判断する手がかりを聞く。場面の言い直しと確認できる前置きだけを取り除き、完成文を既出の意味と照合する。

固定した5テーマ各50件を順に試験し、通過した問いを各テーマの次の履歴に加えた。実4Bへの呼び出しは956回。すでに試した生成材料と同じ12件は再送せず、先の結果を記録に残した。先頭の各10件では前回の44件から46件へ増えた。出題済みの履歴が変わると、同じ試験番号でも選ばれる場面・観点が変わる。

| テーマ | 自動通過 | 見送り | 同じ材料のため再送省略 | 照合した既出履歴の最大件数 |
|---|---:|---:|---:|---:|
| 人間関係 | 26/50 | 21 | 3 | 26 |
| 自分の価値観 | 26/50 | 22 | 2 | 26 |
| 仕事・学び | 27/50 | 22 | 1 | 27 |
| 日々の過ごし方 | 24/50 | 23 | 3 | 23 |
| これからのこと | 23/50 | 24 | 3 | 23 |
| 合計 | 126/250 | 112 | 12 | 27 |

見送りの内訳は、問いの形式9件、表示文の再読72件、既出照合31件。公平さと空き時間の対照では、選択肢の片方に決めつけずに聞く文が出た。片づけの区切りや仕事・勉強のあとに最初に取る行動も、問いとして確認できた。連絡する前の決め手と、連絡した後の手応えを重複と判定した例がある。仕事・学びでは、調べ続ける条件と、自分だけで調べる範囲を区切る目安が、同じ答えを求める文として通過した。通過文にも、判断対象が曖昧な文や助言を求める文、場面の繰り返しが残る。どのテーマも既出が30件を超える照合には進まなかった。各試験の生応答・表示文・採否を、比較記録 `Cocolon_DeepInsight_250_Cases_20261122.zip` に保存した。

既出文と一対一で読み直して別の問いだと確認したあと、履歴全体の照合から別の既出文を指摘されて見送る例があった。[検証版 `6c25d84`](https://github.com/MassyuRed/mashos-api/commit/6c25d84bfdfee159cb1f312a67c10a394645b09f) は、二件目も本文を一対一で確認する。違う問いだと確認した既出文だけを除き、残りの履歴を照合する。三件目の指摘が解消できないときは発行を見送る。先の250件で見送った `theme-2-07` と `theme-2-39` の確定候補・履歴を実4Bで再照合し、別の問いと判定して通過した。前者では、二件の指摘がそれぞれ別の問いと確認でき、残りの履歴も通過した。同じ本文を既出に入れた対照は見送った。この再照合3件は固定250件の集計から独立した確認。

### Premiumのふりかえり

同じ感情記録で本人がEmlisの問いへの回答を明示的に見送った場合、その問いの私的な文面をふりかえりの重複照合に使う。本人の回答や経験の根拠に加えず、わたしマップにも渡さない。回答済みの後で会話を終了した場合、当該記録に対する「未回答の見送り」として扱わない。SQLは本人・同じ記録と問いを発行したときの原資料に結び付ける。候補の `20261121195000_deep_insight_skipped_emlis_questions.sql` は本番未適用。

架空のふりかえり8件を実4Bへ通した。過去回答だけの例から本音を話しやすい反応を聞き、記録だけの例から資料を先に直した理由を聞いた。机の配置を変えた同じ記録では、現行マップを参考にした場合と、古いマップを除いた材料の場合で、同じ原文を引用して理由を聞く表示文になった。記録と過去回答で理由が分かる例は「新しい問いなし」。残る3件は、理由が書かれた記録で別の条件を聞けなかった例、同じ場面の既回答、Emlisで補足回答済みの例。今回は4件が発行候補、1件は見送り判断、3件は候補の不採用だった。保存とマップ再読の結果は前回の§9.215にある。

見送りを含む材料の追加対照2件では、同じ記録について4Bは見送った理由を再び聞く初稿を返したが、候補の検査で止まり、発行候補はなかった。別の記録への「資料を先に直した理由」は、原文の引用とともに発行候補になった。隔離DBでは本人の同じ記録と明示操作を照合し、回答後の終了・訂正後・原文更新後・対象外の操作は見送りとして含めず、変更前の材料での発行を拒否した。

### 通常反映

APIと隔離DBを含む回帰163件が成功した。実4Bは既存経路で架空の材料を使った。Renderの本番API `3c343a09` とワーカー `eeae89c8` の稼働を再確認した。候補のSupabase移行7件は未適用。後半の文面と意味重複に不備が残り、§9.209の受入れは未達。候補の通常配備、本人通知の確認、新規配布は未完。

<a id="deep-insight-reviewed-theme-answer-targets-20261122"></a>
## 9.219 別の答えを求める既出問との照合（11/22 JST）

§9.218では、連絡する前の決め手と連絡した後の手応えのように、本人から得る情報が異なる問いまで重複と判定された。[API検証版 `ad6fd738`](https://github.com/MassyuRed/mashos-api/commit/ad6fd738d953989edd08c77ad05c610079c3f762)では、5テーマで本文を読み合わせた12組・17の出題枠に限り、互いに別の答えを求めることを登録した。新規候補と既出問の双方で、場面と観点を表す発行キーと、正規化した表示文のハッシュが登録済みの組に一致した場合、その対だけを重複照合から除く。直近30件より古い履歴でも保存済みのキーとハッシュで照合する。対象の対以外の履歴は引き続き照合し、同じ発行枠や同じ表示文の再出題は拒否する。

同版では共通の穴埋め文型を生成指示から外し、場面・具体的な判断対象・聞きたい点と、利用できる完成例だけを4Bへ渡した。問い生成のローカル検査79件が通過。Renderで同じ5テーマ各10件を実4Bへ通すと、170回の呼び出しで27件が自動検査を通過した。前回の `c6f18dc` は同じ試験計画の先頭50件で46件が通過しており、この生成指示の全体変更は採用しなかった。

| テーマ | `ad6fd738` の自動検査通過 | `8ec4efe` の自動検査通過 |
|---|---:|---:|
| 人間関係 | 6/10 | 10/10 |
| 自分の価値観 | 3/10 | 8/10 |
| 仕事・学び | 7/10 | 9/10 |
| 日々の過ごし方 | 3/10 | 9/10 |
| これからのこと | 8/10 | 10/10 |
| 合計 | 27/50 | 46/50 |

[API検証版 `8ec4efe`](https://github.com/MassyuRed/mashos-api/commit/8ec4efeecc82692d5ffc0add63055165f394fac5)は、従来の生成指示と文型に戻し、本文を確認した17枠だけに新しい完成例を渡す。12組の照合条件を引き継ぎ、文面の実4B生成と独立した読み直しを経てから発行する。

[この版に含まれる修正 `ce136213`](https://github.com/MassyuRed/mashos-api/commit/ce136213a459b9b1f034e8ff63421260d5403d1d)では、仕事・学びで「調べ方を変える条件」と「自分で調べる範囲を区切る目安」が、試験の3-05・3-30で同じ判断を聞いていたため、一方を発行済みなら他方を候補から外す。各枠の発行キーは保持し、直近30件より古い履歴でも両方向で照合する。

### 実4Bの比較と重複の対照

`8ec4efe` の問い生成検査80件が通過した。GitHubと同じ候補コードで5テーマ各10件を実4Bへ通し、159回の呼び出しで46件が発行前の自動検査を通過した。同じ設計の先頭50件での結果は `c6f18dc` と同数だった。

前回の発行履歴を保持した別の6件では、`theme-1-21`、`theme-2-07`、`theme-2-28` が通過した。`theme-3-30` は同じ判断の枠を外したあと、選び直した優先順位の問いが見送られた。`theme-4-28` は結果を聞く問いの文面を検査で見送り、`theme-5-28` は意味重複の照合で見送った。この6件は先頭50件の集計に含めない。

31件の既出履歴を置いた予備対照では、別の判断を聞く31件目の保存済み表示文は登録済みだったが、4Bが新たに返した候補は登録外の言い換えだった。通常の重複照合に進み、31件目を重複として見送った。同文を拒否するための対照でも、用意した既出文と実4B候補の表示文は異なり、意味の照合で見送られた。同じ表示文のハッシュで拒否されることは、この予備対照では確認できなかった。

[API検証版 `f156a920`](https://github.com/MassyuRed/mashos-api/commit/f156a9208296198fb066594d2c361968108f9204)で、同じ入力の5件を再比較した。選んだやり方の仕上がり（`theme-2-08`）、一人ずつの貢献を伝える最初の行動（`theme-2-10`）、指摘を受けて直す箇所を決める前に確認する点（`theme-3-08`）の3件は見送りから通過へ進んだ。休む時間を残すための用事の範囲（`theme-4-10`）は引き続き見送り。贈り物の選び方（`theme-2-09`）は通過から見送りに変わった。固定50件の計数は同一版の結果として保持し、この5件で置き換えない。

[最終API検証版 `0ca02e54`](https://github.com/MassyuRed/mashos-api/commit/0ca02e54c87fbbd292f73bc236a5cb34b699e042)は、通過へ改善した3件の出題例・判断対象を残し、贈り物と休息日の2件は従来の生成材料に戻した。31件の予備対照で得た、許容する不利益の範囲を尋ねる実4Bの言い換えを、読み合わせた表示文として登録した。対照を実施した [`06f482ba`](https://github.com/MassyuRed/mashos-api/commit/06f482bab700c6b5eee69bed1c8e31f9952e1f46) からの最後の差分は、後続の定義で上書きされていた例文1行の削除で、生成指示の実値は同じ。

31件の履歴で実4Bの対照を再実施した。別の答えを求める場合は、4Bによる独立した文面の読み直しが通り、登録済みの31件目を除いて残り30件を意味照合した。直近の別の2件は一対一で異なると確認したが、残りの履歴との3回目の照合で見送りとなり、発行には進まなかった。同じ表示文を31件目に置いた対照では、実4Bの文章化1回の後、同一文の検査で見送った。独立した読み直しと意味照合は呼んでいない。

最終版の関連回帰170件が成功した。比較の原本を `Cocolon_DeepInsight_Theme_Retests_20261122.zip` に格納した。収録した圧縮済みの実行記録のSHA-256は `143d771ff38f3b53a89338bc35e7bc0e695d1add1a0bef52938626fbf59517ae`。§9.209の固定250件の受入れと、30件以上の異なる既出問が混ざる履歴での発行成功は未確認。Supabaseの移行7件は未適用で、本番API・ワーカーの配備、実機通知、新規配布は未完。

<a id="deep-insight-long-history-candidate-20261122"></a>
## 9.220 31件履歴での発行と、全テーマの出題例（11/22 JST）

### 既出との照合から発行、回答、わたしマップまで

[API `f7071dd`](https://github.com/MassyuRed/mashos-api/commit/f7071dd804605549c226d0cf22e267dd37a95ed9) は本人の同じテーマに限り、30件より古い問いも保存済みの本文を照合に使う。同じ発行キーや正規化後の同文は発行前に止める。意味は32件ずつ比較する。重複を指摘された文が実際には別の答えを求めると一対一で確認できた場合、その文を除いた残りを確認する。照合回数には上限があり、API全体の期限は従来の96秒。同じテーマの発行済みの問いだけを使い、本人の記録・回答・マップをテーマ用資料にしない。

前回と同じ架空の31件で、試して失敗した場合に受け入れられる不利益を尋ねる候補は、勧めを試すための負担を尋ねた31件目と区別できた。残りの3件も一対一では別の答えを求めると判定し、最後まで照合して候補が確定した。実4Bの応答は9回。同文を31件目に置いた対照では、文章化1回で止まった。確定した問いを同じ31件の履歴が入った隔離PostgreSQLへ発行し、回答を保存して同一ID・同一本文・同一回答を再読した。再送で増えず、別本人とアプリからの直接取得は拒否した。同じ問いと本人回答がわたしマップ用資料に含まれることも確認した。

### 同一計画の実4B 250件

`f7071dd` で5テーマを各50件、通過した問いを次の履歴に加えながら実行した。1,076回の実4B応答を取得し、通信エラーは0件。前回の126件から159件に自動通過が増えた。候補の文面を読んで、判断基準の助詞が不自然な文、相手の許可を求める形にずれた文も確認した。約束を変更する場面では、日時を提案する前の確認を「はい・いいえ」で聞く文と、相手に何を伝えるかを助言として尋ねる文が繰り返し見送られた。

| テーマ | 自動通過 | 見送り | 同じ材料の再送省略 |
|---|---:|---:|---:|
| 人間関係 | 29 | 16 | 5 |
| 自分の価値観 | 38 | 8 | 4 |
| 仕事・学び | 38 | 11 | 1 |
| 日々の過ごし方 | 27 | 22 | 1 |
| これからのこと | 27 | 20 | 3 |
| 合計 | 159 | 77 | 14 |

自分の価値観と仕事・学びでは、既出が30件を超えた後もそれぞれ7件が自動通過した。固定250件の計画のSHA-256は `4913accd5d47f008dff9f574d9cb8fc98755af4e67d3848825151dffd6c715a1`。生応答と採否を含む実行原本のSHA-256は `9cc2d268ee7473b4a0271d84be21f469b5edd742a6784587d4f308096486cb55`。§9.209の全件の品質受入れは未達。

採否と生応答を全件読み合わせた。自動通過した文にも、選択前の場面から「今すぐ始めた」と決めつける文、提出前の確認を提出後の振り返りに変えた文、献立を選ぶ判断対象が落ちた文があった。短い別の出題例を追加しても、文章化と読み直しの両方で場面・時点・答えの対象を保つことが残っている。

### 配備候補

[API `1720bf5`](https://github.com/MassyuRed/mashos-api/commit/1720bf58d38decab60b71ba2c4115095d2bbb3d0) では、5テーマの出題枠268件に、場面と答えの対象を結び付けた一問の例文を追加または修正した。全345枠を既存の4Bによる文章化と読み直しに渡せる形にした。助言の語尾と、同じ判断基準を二重に聞く文を検出し、検出時は既存の一度の書き直しに回す。

この版の対象枠12件では、実4Bで8件が自動通過した。人間関係の4件はすべて通過。贈り物の負担、翌朝の予定、目標の途中の区切り、一度に学ぶ範囲の4件は、初稿と書き直しの両方が読み直しで止まった。ふりかえりの既存8件は3件が通過、1件が見送り判断、4件が不採用。既知の理由を再び尋ねる案が止まり、過去回答だけの例も引用元と引用が空になって止まった。Emlisで見送った問いの2対照は、同じ記録で拒否・別の記録で通過した。

[後続API候補 `82a98d7`](https://github.com/MassyuRed/mashos-api/commit/82a98d702752f68c3bd99a38d52c06b3df9a8949) では、見送った4枠の答えの対象を、贈り物に使う金額、翌朝の予定で確認すること、区切りの候補を挙げる最初の行動、同時に学ぶ項目数へそれぞれ合わせた。ふりかえりの最初の候補選定は `f7071dd` の指示に戻した。本人が理由を書いているのに理由の候補を出し、同じ原文欄の別の文に途中の作業が明示されているときだけ、その作業を先にする条件に絞って一度だけ再選定する。原文との照合、既回答・見送りの重複検査、実際に別の作業をしたとみなさない独立確認を通す。関連133件が成功した。

`82a98d7` を実4Bで再試験し、ふりかえり8件は4件が通過、2件が見送り判断、2件が不採用だった。過去回答だけの例は、本音を言いやすい相手の反応を尋ねる形で通過に戻った。理由が既知の例は別の条件を選ぶ処理まで進み、4Bが見送りを選んだ。Emlisの見送り対照は、同じ記録で新規発行なし、別の記録で通過。テーマの修正4枠は再試験でもすべて見送った。これらの再試験は固定250件の計数に含まない。

[アプリ `a903d63`](https://github.com/MassyuRed/Cocolon/commit/a903d63f1a82554c0f76383e7efe3658c00263f8) はDeepInsight通知を開ける端末だと、プッシュトークンと一緒に登録する。候補のSQLは両入口の通知でトークンの対応状況を確認し、ワーカーは送信権の取得と同時に返されたトークンだけを使う。8401には対応の登録と通知先の処理がないため、新しい通知の対象にしない。アプリの標準88件、通知・マップの連携7件、端末登録15件が通過した。

`82a98d7` のAPI・隔離DB・わたしマップ・ワーカー関連は520件と21サブテストが通過した。RenderではAPI `3c343a09` とワーカー `eeae89c8` が稼働中。Supabaseの候補移行7件、API・ワーカー配備、実機通知、新規配布は保留。

<a id="deep-insight-theme-reading-and-grounded-alternative-20261122"></a>
## 9.221 出題の読み直しと、別の作業を先にする条件（11/22 JST）

既存のテーマの読み直しは場面と一問の完成文の両方に同じ場面を渡し、適切な質問と対象のずれの両方で `surface` を返した。特に、区切りの候補を挙げる最初の行動と、一度に学べる項目数の上限は、意図に合う実4Bの初稿が読み直しで止まった。

[`f96d7d4`](https://github.com/MassyuRed/mashos-api/commit/f96d7d4d0ff3c61e3ab35717001da308b9767f27) は、画面に表示する場面と続く問いを別々に渡し、判断対象と求める答えの種類を示す。本人にとっての最初の行動、選択の基準、切り替える条件、上限、事前に確認する情報、後の手応えを読み分ける。答えの対象がずれた場合と、時点や前提が変わった場合は、一度の書き直しにそれぞれの理由を渡す。テーマの判断資料は既出の問いに限り、既出全体との同文・意味の照合を引き継ぐ。

同じ4枠の実4B再試験は4件通過した。[後続の `a13d549`](https://github.com/MassyuRed/mashos-api/commit/a13d54928f799862dd66a2478ee8a32817fbfc66) は、金額や項目数を聞く文末の「上限は、いくらまで」等の重なりを整えてから同じ独立検査にかける。4枠はこの版でも各2応答で通過した。初稿の正しい2例は独立検査で通り、切り替えると決めつける文は前提の検査、翌朝の予定を確認できるか聞く文は一問の形式検査で止まった。既出31件の別文と同文の対照も実4Bで再確認し、前者は9応答で候補が確定し、後者は1応答で止まった。これらの再試験は固定250件とは別に記録する。

Premiumの既知の理由を使う対照では、`f96d7d4` の再選定は「同じような場面で自分の仕事を先にする条件」を選べたが、文章化で既知の作業を先にする条件に戻り、独立した読み直しで止まった。[後続の `4c69ae2`](https://github.com/MassyuRed/mashos-api/commit/4c69ae224664bf2e04e802f639add8275e867a34) は、再選定を通った場合に限り、原文にある未完了の別作業を文章化にも渡す。その作業を先にする条件を仮定として聞く。原文の引用、書かれた理由、本人の過去回答・見送りとの照合を維持する。

`4c69ae2` の実4Bは「同じような場面で、自分の仕事を先にするのはどんなときですか？」まで生成した。読み直しで、表示した引用に元の理由を補い、その理由を質問の限定条件として返したため、発行には進まなかった。[後続の `c10ab8a`](https://github.com/MassyuRed/mashos-api/commit/c10ab8aa7a37811214d0b391aa2ae36ca1fca6aa) は、再選定した場合の読み直しにも、実際に表示する一問と元の資料だけを渡す。引用は表示した範囲を原文で照合し、昔の行動と仮定の別作業を区別する。質問に明記した限定条件だけを確認対象にし、既回答・見送り・原文にない別作業は棄却する。

### 読み直しの応答形式と、既出との比較

`4c69ae2` の固定試験では、適切な初稿に対して4Bが場面と質問文を返し、採否を返さない例があった。人間関係では、伝え方を別の手段へ変える条件を聞く同じ枠が3回この状態になり、書き直し後は「切り替えることはありますか」という問いに変わった。自分の価値観でも、採否のない7件が見送りになった。

既出との個別比較では、「会う間隔を何を基準に選ぶか」と「久しぶりの相手に連絡するかを何で決めるか」が重複と判定された。久しぶりの連絡で最初に伝えることと、連絡した後の手応えを聞く別の2件では、4件ずつ別の問いと確認したあと、5件目の照合に進む前に止まった。

[候補 `c5bd626`](https://github.com/MassyuRed/mashos-api/commit/c5bd62609d6cc9770e39c11df5720d75c37148be) は、採否の形式が取れない場合に、表示する問いを保って一度読み直す。明示した棄却理由がある場合は、一度の書き直しに渡す。助言を求める語尾と判断基準の二重表現を停止し、実例で場面の言い直しと確認した前置きは出題枠ごとに取り除く。履歴で比較する答えの対象を明示し、30件程度の比較では五つ目の指摘も一対一で確認する。照合の上限は6件で、同文・意味重複の拒否と全体の処理期限を適用する。API・隔離DB・わたしマップ・ワーカー関連の試験は541件と21サブテストが通過した。

### 固定250件の再試験

`4c69ae2` で先行回と同一の計画を実行した。実4Bの応答1,245回、通信エラー0件、21分16秒。各テーマは初回から始め、自動検査を通った問いを次の履歴へ加えた。履歴が変わるため、同じ試験番号で異なる枠が選ばれることがある。

| テーマ | 前回 `f7071dd` 自動通過 | 今回 `4c69ae2` 自動通過 | 今回の見送り | 今回の再送省略 |
|---|---:|---:|---:|---:|
| 人間関係 | 29 | 43 | 7 | 0 |
| 自分の価値観 | 38 | 39 | 10 | 1 |
| 仕事・学び | 38 | 37 | 10 | 3 |
| 日々の過ごし方 | 27 | 41 | 7 | 2 |
| これからのこと | 27 | 31 | 17 | 2 |
| 合計 | 159 | 191 | 51 | 8 |

既出が30件を超えた後の自動通過は36件だった。場面を繰り返す文、語の結び付きが不自然な文、二つの判断を聞く文も自動通過に含まれる。§9.209の全件の品質受入れは未達。固定計画のSHA-256は `4913accd5d47f008dff9f574d9cb8fc98755af4e67d3848825151dffd6c715a1`、実行原本は `32456d3c29db101b4eef7913b77bc0b103b2419e947659687174830c23d4bf37`。

見送った51件の最後の応答は、読み直し23、書き直し4、既出との個別比較18、既出との一括比較6。保存した実4B応答で同版の実行を再現し、250件の採否、確定本文、1,245応答の段階と順序が記録と一致した。

`c5bd626` で固定試験の当時の履歴を保持した7件を再試験した。先に既出照合で止まった人間関係の4件と、読み直しが採否を返さなかった自分の価値観の2件が通過した。手段を切り替える条件の1件は書き直しで見送った。別の文面対照3件は、前回通過した助言調と判断基準の二重表現をそのまま再入力し、全件を4Bへの読み直し前に止めた。これらの再試験は先行の固定250件の結果に加えない。

### Premiumの再選定した一問

実際の隔離PostgreSQLから取得した原文・出典の版を使って `c10ab8a` を試した。本人の未回答の条件を正しく尋ねたが、原文には先にした作業の理由と別の作業が途中だったことだけがあり、読み直しは「回答済み」と誤判定した。回答やわたしマップは試験資料になく、発行0件。

`c10ab8a` の従来の記録8対照は通過4件、質問なし1件、不採用3件。Emlisの見送り対照では、同じ記録は新規の問いを出さず、別の記録では候補が通過した。

[`8ae39b5`](https://github.com/MassyuRed/mashos-api/commit/8ae39b5b005c8cefdaa8db65d6160f0451ce58e5) では、専用の読み直しに表示引用と質問本文を分けて渡す。本文が尋ねる行動を先に確認し、その行動を優先する条件が原文や本人回答に明記されている場合にだけ、回答済みの根拠を原文どおり返す。引用の行動に対する既知の理由から、別の行動を選ぶ条件を推定しない。

同じ資料で `8ae39b5` の実4Bは条件・前提・新規性を適切と判定した。一方、表示引用「頼まれたことを先にした」に原文の直前の理由と句点を加えて返したため、発行前の完全一致で止まった。

[`81dde9e`](https://github.com/MassyuRed/mashos-api/commit/81dde9efd8c15b5ed58e177eb730797e6118f644) はこの経路で、表示引用を選んだ原文範囲にコードで一致させる。提供した別の原文欄にも同じ引用があれば見送る。独立した読み直しは実際に表示する引用・本文、原文、回答・見送りを受け取り、本文の条件・前提・新規性を判定する。読み直しの返却項目はその意味判定に必要な5項目とする。発行では本人、原文の版、欄、位置、参照ハッシュのSQL照合を引き継ぐ。

同じ隔離DB由来の記録を使った実4Bは4応答で `「頼まれたことを先にした」と書いていましたが、同じような場面で、自分の仕事を先にするのはどんなときですか？` を選んだ。問いは既にした作業の理由と区別でき、記録の別作業を実行済みとみなしていない。入力資料・各段階の実応答・発行候補を採取した。

実4Bが選んだ同じ本文・引用根拠を隔離PostgreSQLに発行した。再発行と本人の再読は同じIDで、回答保存の再送でも回答は増えなかった。別アカウント・テーブルへの直接アクセス・古い資料確認値・変更した引用の拒否を確認した。わたしマップへ渡す資料に同じ発行IDと本人回答が一致して入った。API・隔離DB・わたしマップ・ワーカーと通知関連の候補回帰247件が通過した。

同版の実4B記録対照8件は通過5件、確認する意味のある問いがなく見送った1件、不採用2件。過去回答だけの記録と、既知の理由から別の条件を尋ねる記録は通過し、同じ場面の既回答と有効なEmlis回答がある対照は止まった。Emlisで見送った問いは同じ記録の再提案を止め、別の記録での候補は通過した。隔離DB資料の主試験と対照で実4B応答は計27件。固定250件の受入れが残るため、Renderの通常配備と候補のSupabase移行7件は保留する。

<a id="deep-insight-theme-dimensions-20261122"></a>
## 9.222 場面と答えの対象を具体化したテーマ出題（11/22 JST）

`4c69ae2` の250件の保存応答を照合すると、読み直しで採否の形式が崩れた応答は30枠に計50件。27枠では最初の形式不備から書き直しに進んだ。切り替える条件を正しく尋ねた初稿が、書き直しで「切り替えることはありますか」に変わった例もあった。27件の形式外の `accept` のうち12件は実際の表示文も変更しており、返却された採否だけを取り出すと別の文を認めることになる。

[試験版 `142fe5e`](https://github.com/MassyuRed/mashos-api/commit/142fe5e2758531857a4afae3f2f990daf727d6bc) では読み直しを短くし、形式が崩れた場合に判定語を一語だけ返す構成を試した。同じ既出履歴を保持した13件で実4Bを68回呼び、自動通過は4件、見送り9件、通信・実行エラー0件だった。適合する会う間隔の基準や、試す作業範囲を最初の読み直しが内容のずれと判定した。比較の固定250件はこの版では開始しなかった。

[後続候補 `5e43f04`](https://github.com/MassyuRed/mashos-api/commit/5e43f043392e7118a394d673b749c66e44f129ad) は、採否と理由を返す前版の最初の読み直しと再読を採用した。形式が崩れた場合は同じ場面と本文を一度だけ読み直し、明示した文面の棄却理由があれば既存の書き直しを行う。条件をはい・いいえの問いに変えず、文章化が単独の疑問文を返した場合も他の文面と同じ形式・意味・既出検査を通す。試す範囲とその結果の判断を一緒に尋ねた文は、一問に書き直す。

5テーマの対象と例を見直した。会う間隔と連絡する判断、評価の受け止め方と今後の行動、二つの方法を試し比べる最初の行動と方法の選択、食事準備に使う時間と献立、選んだ中間の区切りにかける時間と区切りそのものの選択を分ける。例えば「試す前に見ておきたい環境の事実」と「試したあと、その環境が合うと分かる手応え」は別の問いである。既出比較は本人が実際に何を答えるかを見て、同じ話題でも答えが異なるものを区別する。

既存の変更箇所は `deep_insight_theme.py`（場面と例文）、`deep_insight_theme_intents.py`（場面ごとの答え）、`deep_insight_question.py`（文章化・読み直し・既出比較）、関連回帰試験。発行キー、照合済みの既出文、本人経路・記録ふりかえりの処理・SQLの保存契約は継承した。

### 先行履歴を保持した実4B比較

`5e43f04` の同じ13件は実4B応答101件、自動通過11件、見送り2件、通信・実行エラー0件。会う間隔の決め方、二つの方法を同じ箇所で試し始める問い、試用範囲の上限を尋ねる問いが通過した。別の記録で覚えた方法の適用範囲と使用前の条件照合、長い目標をどこで区切るか決める前に確かめる進み具合は、既出比較で見送った。通過した文にも言い直しの残る例があるため、この比較の通過数を受入れに使わない。

候補の回帰は249件が通過した。初回には、今回変更していないわたしマップの試験で擬似時刻の丸めにより `220.00000000000182 <= 220` が失敗した。時刻を固定して旧版 `4c69ae2` でも同じ丸めを再現した。

追加対照の `142fe5e` は既出31件で新しい観点の問いを選び、別の対照で既出の「どのくらい」を「どの程度」に言い換えただけの問いを意味照合で止めた。Premiumは隔離DB由来の4応答で前回と同じ問い・引用範囲を選んだ。`5e43f04` で原資料を再取得し、4回分の指示と入力のハッシュが同じことを確認して実応答を再使用した。隔離DBで同じ問いと根拠を発行し、回答保存・再送・同一ID再読・別アカウント拒否・わたしマップへの資料連携を再確認した。この再確認には4Bの追加呼び出しがない。

### 5テーマの固定250件

`5e43f04` で先行回と同じ計画を25分で実行した。実4B応答は1,549件、通信・実行エラー0件。同じ生成材料の再送省略は0件で、各テーマの自動判定を履歴に積んだ。

| テーマ | 前回 `4c69ae2` 自動通過 | 今回 `5e43f04` 自動通過 | 今回の見送り | 実4B応答 |
|---|---:|---:|---:|---:|
| 人間関係 | 43 | 50 | 0 | 306 |
| 自分の価値観 | 39 | 48 | 2 | 337 |
| 仕事・学び | 37 | 46 | 4 | 292 |
| 日々の過ごし方 | 41 | 50 | 0 | 328 |
| これからのこと | 31 | 44 | 6 | 286 |
| 合計 | 191 | 238 | 12 | 1,549 |

既出が30件を超えた後の自動通過は83件。見送った最後の段階は、既出との一括比較3件、個別比較7件、読み直し1件、書き直し1件。価値観の例では、6件を個別に比較して別内容と判定したあとも一括比較が別の重複候補を指し、上限で止まった。同じ候補の文を後の試行で選べた例も、元の見送りはそのまま記録した。

自動通過した表示文にも、場面の繰り返し、聞きたい事実の代わりに確認方法を尋ねる文、はい・いいえの問いが残った。§9.209の固定各50件の品質受入れは未達。Render API `3c343a09`・ワーカー `eeae89c8` とSupabaseの適用済みDeepInsight移行3件を再確認した。候補の通常配備と移行7件は保留する。

計画SHA-256は `4913accd5d47f008dff9f574d9cb8fc98755af4e67d3848825151dffd6c715a1`、実行原本SHA-256は `503ecc12f5fdbda314deffaecd6e80ec226728f5a48416d8cc600798ddc85a8c`。

### 実出力を根拠にした追加修正

固定試験の人間関係32件目では、条件を聞く枠が「感謝を伝える言葉をいつもと変えることはありますか？」を通した。`いつも` の `いつ` が疑問詞の検査に当たったためである。[`d832b87`](https://github.com/MassyuRed/mashos-api/commit/d832b8742c265b9a169e6cd2613ddb02d98ed0fc) で、`いつも` 等を疑問詞として扱わず、「いつから」などの開いた問いは確認へ進める。元の実4B初稿を同じ指示と入力で再生し、読み直しの前に書き直しへ進むことを確認した。

自分の価値観43件目では、初稿が冒頭の場面に読点を足して写し、二重表示を止めた後の書き直しで「どのような基準で決め手になりますか？」になった。[`df54378`](https://github.com/MassyuRed/mashos-api/commit/df54378309ed4bc2c7bf353cc520909c7ebd1e30) は、完全に合う場面の節の読点の違いを無視して取り除き、元の問いを独立して読み直す。元の実4B生応答を再生し、初稿の「どちらの扱いにするかは、何を決め手にしますか？」がそのまま独立検査へ渡ることを確認した。追加条件を含む節は残す。同版の回帰252件が通過した。

`df54378` は先行固定試験の当時の履歴を保持した2件で、実4B応答18件、2件通過。人間関係の初稿は同じはい・いいえの文になったところを書き直し、「どんなときに、感謝を伝える言葉をいつもと変えますか？」を選んだ。価値観の初稿は読点違いの場面だけを取り除き、元の本文を読み直して選んだ。両方で既出との照合も行った。この実行は個別再試験で、固定250件の集計は `5e43f04` の値とする。

<a id="deep-insight-theme-open-answers-and-history-20261122"></a>
## 9.223 問いが求める一つの答えと、既出との照合（11/22 JST）

`5e43f04` の固定250件では12件を見送り、うち10件が既出照合で止まった。前回の出題と答えが異なる8件を、生応答と指示・入力ハッシュを照合して再生し、同じ見送りを確認した。自動通過した文には、疑問詞を含んでも実際には「知っていますか」としか聞いていない問いや、事実そのものを聞く枠で確認手順を尋ねる問いがあった。

[`5e33ca3`](https://github.com/MassyuRed/mashos-api/commit/5e33ca3c476382c6c110f351827e7d36c0cf7ae9) では、そうした文を既存の一度の書き直しへ渡す。具体的な場面の導入を繰り返す確認済みの言い回しは、本文に新しい条件がない場合だけ除く。既出検査では、本人が置かれる場面・対象・求める情報を比較する。発行済みの本文がある場合は実際の本文を使い、本文がない旧資料では保存された場面と観点を使う。一括比較で重複候補を二度個別確認し、いずれも別の答えだった場合は、未確認の問いの比較単位を8件以下に分ける。個別確認の回数と期限は従来どおりで、重複の有無を確定できない場合は発行を見送る。

同版の実4B照合では、前回別の答えを求める文を重複とした5組をすべて区別できた。既出31件目の言い換えと新しい同義対照2組は重複として止めた。一方で、準備時と着手時という前置きだけが変わり、同じ学習項目数の上限を尋ねる対照を別の答えと判定した。[`dac4404`](https://github.com/MassyuRed/mashos-api/commit/dac4404b8465cca03f28937cf8e88b6ffc3e5a88) で、前置きが答えを変える実質的な条件かを、同じ仕事の同時着手件数を例に明確にした。

`dac4404` では同義6組をすべて重複と判定し、学習項目数の対照を既出履歴に混ぜた試験でも発行を止めた。別の答えを求める6組のうち3組を誤って重複と判定した。開始件数と一つの活動の範囲、選んだ行動の手応えと選んだ開始時期の手応えが混同された。[`2cbbf2a`](https://github.com/MassyuRed/mashos-api/commit/2cbbf2a636e8bb02b5e595ffa0cee01def099dbb) では、まず判断対象と答える情報を照合し、その両方が合う場合に、場面の言い方で答えの条件が変わるかを確かめる。

`2cbbf2a` の実4Bでは個別対照12組のうち、同義6組をすべて重複と判定し、別の答えを求める6組中5組を区別した。最初の行動の手応えと開始時期の納得を尋ねる1組は重複と誤判定した。履歴全体の対照4件では、既出との比較で以前止まった3件が通過し、同じ学習項目数の上限を言い換えた1件は拒否された。固定250件とは別の対照で、実4B応答は44件。

候補のAPI・隔離DB・分析への受け渡し・通知を含む回帰270件、アプリの関係回帰153件が通過した。Premiumでは、保存済みの実4B4応答について指示と入力のハッシュを新候補で照合し、同じ候補の隔離発行・回答保存・同一ID再読・別人拒否・マップ用資料への連携まで確認した。既出31件の隔離発行経路では、末尾にある同じ文を拒否する対照も通過した。

当時の履歴を保った `2cbbf2a` の実4B出題7件は、55応答で5件通過、2件見送り。 日々の過ごし方8件目は、予定が急に変わった場面を一度だけ表示し、「最初に何をしますか？」と聞いた。見送られていた価値観42件目は、周りの評価を自分なりに受け止められた手がかりを聞き、既出と区別できた。この候補の40件の既出資料、13応答の指示・入力・生応答を照合して隔離DBに発行した。同一IDでの再読、回答保存と再送、別アカウントからの拒否、わたしマップ資料への受け渡しを確認した。40番目に別キーで同じ文を置く対照では発行を拒否した。個別再試験と隔離DBの結果は固定250件に加えない。

初期の出題対照はRenderの接続先が切り替わる前に実行が終了したが、一時結果を回収できなかった。初期版では回収済みの個別・履歴照合29応答だけを採用し、出題対照は保存済み入力と履歴で作り直して再開した。

### 5テーマの固定250件の実行

各テーマを空の履歴から始め、同一の固定計画にある各50件を順に実行した。`2cbbf2a` は22分38秒、実4B応答1,480件、通信・実行エラー0件。各テーマの原本を分けて回収し、全250件の計画ハッシュ `4913accd5d47f008dff9f574d9cb8fc98755af4e67d3848825151dffd6c715a1` を照合した。

| テーマ | 前回 `5e43f04` 自動通過 | 今回 `2cbbf2a` 自動通過 | 今回の見送り | 同じ材料の再送省略 | 実4B応答 |
|---|---:|---:|---:|---:|---:|
| 人間関係 | 50 | 50 | 0 | 0 | 317 |
| 自分の価値観 | 48 | 41 | 8 | 1 | 292 |
| 仕事・学び | 46 | 42 | 8 | 0 | 274 |
| 日々の過ごし方 | 50 | 47 | 3 | 0 | 309 |
| これからのこと | 44 | 43 | 7 | 0 | 288 |
| 合計 | 238 | 223 | 26 | 1 | 1,480 |

既出30件を超えた後の自動通過は68件。見送りの最後は既出の個別照合16件、書き直し10件だった。たとえば価値観では、時間の使い方を選ぶ基準と、選んだあとに納得できる手応えが繰り返し重複と判定された。確認する事実を書き直しても確認方法を尋ねる文は発行を止めた。自動通過した文にも場面の繰り返しや聞く対象のずれが残った。§9.209の品質受入れは未達で、Renderの通常配備・Supabase移行7件は保留する。

### 事実を聞く枠の書き直し

価値観2件の初稿はいずれもはい・いいえの問いだった。`2cbbf2a` は文面の形が理由の書き直しに、確認したい事実を尋ねる指示を渡していなかった。[`56f7e31`](https://github.com/MassyuRed/mashos-api/commit/56f7e3139f532a1a480d25355c7de0f058772633) では、その書き直しでも事実を尋ねる指示を渡し、候補回帰270件が通過した。元の既出履歴を保った実4B再試験は12応答で2件とも自動通過した。担当内容を尋ねる文は事実の問いに修正できた。やり直せる条件の問いは「どのように判断しますか？」となり、判断方法を聞くずれが残った。固定250件の集計は実施版 `2cbbf2a` の結果とする。

個別対照で区別できた同時開始件数と最初の一歩の範囲は、固定の発行経路では重複と判定された。両試験の本文と指示は一致したが、個別対照では既出本文が先で、発行経路では今回の本文が先だった。記録の送信内容のハッシュも異なるため、この対照は発行経路と同一の照合として扱わない。

<a id="deep-insight-ordered-history-and-factual-repair-20261122"></a>
## 9.224 既出の照合順と、判断前に確かめる事実の書き直し（11/22 JST）

前節で個別対照と発行経路の判定が分かれた組について、二問の本文と照合指示を固定し、4Bへ渡す順だけを変えた。同時に始められる件数を尋ねる問いは、今回の問いが先だと、一つの活動に取り組める範囲を尋ねる既出の問いと重複と判定された。既出の問いが先だと別の答えと判定された。同義の「どのくらい／どの程度」は両順で重複として止まり、引き受ける判断と引き受けた後に取り消す条件は両順で区別された。3組・実4B応答6件。実行原本のSHA-256は `7504e7c4d515881ae216257faf4071564d9d68b7a086198ab99b3f0d4061da22`。

[`af25df9`](https://github.com/MassyuRed/mashos-api/commit/af25df959da69e3f1a75857d2c44464c0416f323) は通常の個別照合でも既出の問いを先に渡す。架空材料の評価では、送信するJSONの項目順を維持し、4Bが受け取る指示と資料本文のSHA-256を記録する。固定計画のハッシュは以前と同じ。照合の最大回数と、同一の発行キー・正規化本文を止める検査を継承する。

書き直しでは、場面と各枠の例文を使い、判断前に確かめたい事実と、確認・判断する方法を区別する。疑問詞を埋め込んだはい・いいえの文や「どんなことがあればありますか」のような文はそのまま発行しない。やり直せる条件、誤りの影響、スマートフォンの使用時間の例と、新しい環境を試すか迷っている時点の場面を調整した。

### 同じ場面と既出履歴での実4B比較

固定250件から19件を選び、当時の材料と既出の問いを同じ順で渡した。直前の実施版は自動通過9件、`af25df9` は実応答91件で自動通過13件、見送り6件。8件の保持対照は同じ本文で通過した。やり直せる条件、各自の担当したこと、誤りを修正した後に提出へ進めると判断する手がかりを聞く問いが改善した。いくつまで同時に始められるかは既出の「一つをどこまで進めるか」と区別できたが、候補には「複数のことを取りかかる」という助詞の誤りが残った。誤りが影響した箇所の問いも、影響の有無や範囲を確かめる答えとしては曖昧だった。

5件は書き直しても、確認方法、重複する判断基準、一般的な適切さ、実際に起きたことを尋ねる形が残り、発行を見送った。もう1件は、最初の行動を選んだ手応えと学ぶ内容を選んだ手応えを区別した後、開始時期が合っていたと感じる手がかりを尋ねる既出の問いと誤って重複と判定した。別枠の5-33では場面の繰り返しを除けたものの、「試し始める前に確かめるべき」となり、試すかどうかを考える本人の問いとして改善が残った。

書き直しで例文がそのまま使える場合は優先する別案も8件で比較した。実応答47件で5件が自動通過し、2件増えた。一方で、既に改善していた担当内容を、確かめる方法を尋ねる文へ戻した。空き時間の問いも、誰のために使うか未確定の場面を、誰かのために使った前提に変えたため、この案は採用しない。

API関連回帰242件、アプリ関連153件が通過。選ばれたテーマの問い2件は、実4Bの記録から送信指示・資料本文・生応答を照合し、既出33件と41件の状態で通常APIから隔離DBへ発行した。回答保存・同一ID再読・再送・別人の読書き拒否・わたしマップの本人回答を確認した。41番目に別の発行キーで同文を置く対照では発行を止めた。Premiumの保存済み4B応答4件も同じ候補で再生し、隔離DBで本人の発行・回答・再読とわたしマップへの連携を確認した。

### 本人が答える情報を先に読む個別照合

同じ8組で、個別照合の指示文だけを変える対照は7組が期待どおりだった。4Bが各問の答えで分かる情報を先に書き、続いて採否を返す指示にすると、全8組が期待どおりだった。開始時期に納得する手がかりと、最初の行動を選んでよかったと感じる手応えを区別した。同義4組は両方の指示で重複と判定した。同じJSON資料を使った8応答での平均は、判定だけの指示が0.65秒、答えの情報も記述する指示が2.38秒。個別照合の回数と発行処理全体の上限は同じ。

[`60587f1`](https://github.com/MassyuRed/mashos-api/commit/60587f1557f7eef4f4606481266f6b3cdde17dd2) は、二問の各回答から分かる情報が揃い、正規化後も二つが異なり、4Bが別の答えと判定した場合に限ってその組を重複候補から除く。その後も残りの既出と比べる。文章の形式が理由で見送った候補は、具体例を使える場合に場面・例文と必要な前提を渡して一度だけ直す。事前条件が指定されていない確認事項や、答えの違い・前提を理由に見送った候補は従来の指示で直す。「取りかかる」の助詞は読んで判定する本文で修正する。新しい環境の出題は、試すかどうかを決めるために知りたい条件に揃えた。

固定履歴の11件を実4Bで再試験し、自動通過は5件から8件に増えた。休みを残しながら用事を何件入れるか、どちらに空き時間を使っても後から何があれば納得できるか、最初の一歩を選んだ手応えを聞く3件が新たに通過した。既出43件の試験では、学びの内容や開始時期の手応えと、最初の行動の手応えを区別した。学ぶ項目数の上限だけを言い換えた対照は見送った。次の用事までの時間、指摘された修正箇所の問いは書き直し後も止まった。最初に伝える部分と最初の説明の範囲は、個別照合が同じ答えと判断した。新しい環境の別枠試験では条件の有無を聞く文が自動通過し、はい・いいえの問いが残った。実4B応答は11件で85、環境の別枠で10、同義の別枠で2。

API関連246件、アプリ関連153件が通過。最新の実候補では、既出40件で空き時間の問い、既出43件で最初の一歩の問いを隔離DBへ発行した。指示と送信資料の順序を含むハッシュを実応答12件・17件で照合し、回答を同じIDで再読、再送、わたしマップ資料として取得した。別の本人による読書きを拒否した。Premiumの保存済み実応答4件も最新の候補で照合し、隔離DBで発行・回答・再読とマップ資料への受け渡しを確認した。

### 固定250件の実行

実行版は `60587f1`。5テーマごとに空の既出履歴から始め、選ばれた問いをそのテーマの履歴に追加した。固定計画のSHA-256は `4913accd5d47f008dff9f574d9cb8fc98755af4e67d3848825151dffd6c715a1`。全体は28分32秒、実4B応答1,528件、通信・実行エラー0件。各呼び出しの指示ハッシュと、JSONの項目順を含む資料ハッシュを順に照合し、同じ採否と本文を再現した。既出が30件を超えてから自動通過した問いは77件だった。

| テーマ | 前回 `2cbbf2a` 自動通過 | 今回 `60587f1` 自動通過 | 今回の見送り | 同じ準備内容の再送省略 | 実4B応答 |
|---|---:|---:|---:|---:|---:|
| 人間関係 | 50 | 49 | 1 | 0 | 344 |
| 自分の価値観 | 41 | 46 | 2 | 2 | 313 |
| 仕事・学び | 42 | 44 | 6 | 0 | 280 |
| 日々の過ごし方 | 47 | 46 | 4 | 0 | 292 |
| これからのこと | 43 | 47 | 3 | 0 | 299 |
| 合計 | 223 | 232 | 16 | 2 | 1,528 |

自動通過は前回より9件増え、`5e43f04` の238件には届かなかった。人間関係では会う頻度が合っていると感じる手がかりの文に不自然さが残った。価値観では意見を伝える前の基準と、伝えるつもりになった後で延期する条件が重複と判定された。仕事・学びでは作業を見直す最初の行動と、方法を切り替える条件が重複と判定された。日々の過ごし方では、次の用事までに移動・準備に必要な時間を調べる手順に変えた候補を見送った。これからのことでは、開始時期と最初の一歩を両方発行できた。同じ一つの活動の始め方を聞く問いを、前提の変更とみなして見送った例もあった。見送り16件の最終段階は読み直し3件、個別の既出照合6件、書き直し7件だった。§9.209の受入基準は未達。通常配備、追加のSupabase移行7件、本人端末への配布・通知の確認は残る。

### 条件の有無を聞いていた問いの書き直し

固定評価で通ってしまった「試すかどうかを決める前に確かめたい具体的な条件はありますか？」は、文中の「どうか」を疑問詞として拾っていた。[`29b2df5`](https://github.com/MassyuRed/mashos-api/commit/29b2df530443be026c85e26ddee085aa16aac007) は、文中の「どうか」だけでは質問を通さない。既出照合で句読点しかない回答情報も、情報が揃っていないとして扱う。

以前と同じ既出30件で、同じはい・いいえの初稿から書き直しに進むことを実4Bで確認した。「新しい環境を少し試すか迷ったとき、試すかどうかを決めるには、その環境のどんな条件を確かめますか？」となり、独立した読み直しと既出照合を経て自動通過した。実4B応答11件と送信資料のハッシュを照合し、最新API関連の回帰247件が通過した。固定250件は実施版 `60587f1` の集計を保持する。架空材料、原応答、採否と隔離DBの記録は `Cocolon_DeepInsight_Fixed_Retest_20261122.zip` に収録。

<a id="deep-insight-theme-surface-and-history-validation-20261122"></a>
## 9.225 テーマの問いが求める答えを保つ校正と既出照合の再検証（11/22 JST）

前回の固定250件では、フィードバックを受けた場面で、相手の指摘について知りたいことを尋ねる枠が「具体的に何を修正すべきかを確認しますか？」になった。用事の合間では、移動や準備について知りたい情報が、調べ方を尋ねる文に変わった。既出照合では、意見を伝えるかの判断基準と、伝えると決めた後で延期する条件を同じ問いと判定した。

[API検証候補 `17606903`](https://github.com/MassyuRed/mashos-api/commit/1760690368377b7bf812afa0ba9ad3933c550da2)は、既存のテーマ・場面・観点のうち、前回の原応答と表示文の確認から選んだ19枠に質問例を用意した。4Bはその例を場面の続きとして校正し、読み直しの段階では質問の対象、時点、仮定、本人が答える情報が例と一致するかを確かめる。たとえば指摘の場面では「どこを直すか決める前に、相手の指摘のどんな点を確かめますか？」、場所の候補では「候補の場所に行けるとしたら、決める前に現地で何を確かめますか？」を校正用の例にした。

既出本文との一対一の照合で重複と判定された場合、一回の発行判定につき最大一回、二問をそのまま別の指示で4Bに渡す。片方にしか通用しない答えがあるとした場合、根拠として返した各引用が対応する本文に連続して存在し、もう一方の本文には含まれないことを照合する。根拠を確認できた既出問を比較から除き、残りの履歴も照合する。同じ発行キー・本文を止める検査は従来どおりとした。

固定評価では5テーマ各50件の試験番号・シードを継承する。シードがそのテーマで既に試した枠を選んだ場合は、同じシードで未試行の枠から選び直す。試した枠は合否にかかわらず評価用に記録し、本人への発行履歴を模した資料には採用した問いだけを加える。この変更は試験時の選定に限定した。試験ログは選び直したこと、質問例の集合と各モデル呼出しの資料のハッシュを残す。

### 当時の履歴を使った実4Bの個別試験

先行版の記録と同じ場面・既出履歴で、対象25件と保持対照7件を `17606903` の実4Bへ通した。全32件の自動通過が21件から26件へ増えた。対象は14件から19件、対照は両方7件とも通過した。実応答は215件、見送り6件、通信・実行エラー0件。対象のうち人間関係は5件、日々の過ごし方は4件がすべて通過した。仕事・学びの `3-27` は、行き詰まって最初に見直す行動と、別の進め方に変える条件を区別して通過した。

独立した本文確認では26件中14件が意図に沿い、9件は軽微な表現の課題を残した。予算の問い1件に助詞と場面の繰り返しがあり、少数意見を伝えた後の問いとスマートフォン利用の問いの2件では、例で指定した条件や確認点が本文から薄れた。

| 見送った試験 | 残った違い |
|---|---|
| `2-43` | 意見を伝えるかを決める基準と、伝えると決めた後で延期する条件 |
| `3-20` | やり方を切り替える判断基準と、比較の前に確かめる情報 |
| `3-26` | 説明を始める前の最初の行動と、相手の理解について確かめる情報 |
| `5-31` | 一つの活動について、始め方を選ぶ基準 |
| `5-33` | 環境を少し試すか決める前に、利用できる時間帯について確かめる情報 |
| `5-45` | 今から始められるか決める前に、当日の予定で確かめる情報 |

[後続候補 `255a202f`](https://github.com/MassyuRed/mashos-api/commit/255a202f233a8c1a8075d96db0cadfd62b7fd572)に、上表の最初の3組を、既に確認した問いの本文と判断対象が一致する場合に限って区別する実装を加えた。一つの活動の着手方法、試せる時間帯、当日の予定については、出題時にその情報を直接尋ねるよう質問例を調整した。先行候補と検査だけの追加を含む版で関連199件、後続候補と同じソースでAPIと隔離PostgreSQLの関連202件が通過した。アプリ標準88件と、通知の本人照合を含む89件も通過した。

### 固定250件の実4B試験

`255a202f` で既存の固定シードを継承して5テーマ各50件を完走した。固定250件のすべてで、そのテーマでまだ試していない出題枠を使った。すべてのテーマについて、原応答から採否と表示文を再現し、送信指示・資料の順序付きハッシュが一致した。個別試験は固定試験の集計から除いた。先行 `60587f1` の自動通過は232件。今回は+14件。

| テーマ | 実行 | 自動通過 | 見送り | 再送省略 | 実行エラー | 実4B応答 | 既出30件超で通過 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 人間関係 | 50 | 49 | 1 | 0 | 0 | 315 | 18 |
| 自分の価値観 | 50 | 50 | 0 | 0 | 0 | 350 | 19 |
| 仕事・学び | 50 | 49 | 1 | 0 | 0 | 308 | 18 |
| 日々の過ごし方 | 50 | 49 | 1 | 0 | 0 | 322 | 18 |
| これからのこと | 50 | 49 | 1 | 0 | 0 | 298 | 18 |
| 合計 | 250 | 246 | 4 | 0 | 0 | 1593 | 91 |

全250件の原候補、書き直し、採否、表示文を照合した。人間関係の聞ける時間の上限と、仕事・学びの最初に伝える箇所を選ぶ基準は、既出の「最初に取る行動」「どこまで説明するか」と区別できず見送りとなった。日々の過ごし方の用事の所要時間は休みの日の既出と実質的に重なり、これからのことでは候補を整理する行動と活動を始める行動が文面で分かれず、見送りとなった。

自動通過した246件にも、予算の問いの助詞、少数意見を伝えても結論が変わらないという条件の脱落、仕事で別の手順を試す範囲の実質的な重複、運動の場面の反復、一つの活動の始め方の選択と実行方法の混同、協力と委任の混同があった。50件すべてが通常発行に進めるという§9.209の受入基準は、どのテーマも確認できなかった。

### 既出45問での個別復旧と隔離DBへの発行

[後続候補 `7d950306`](https://github.com/MassyuRed/mashos-api/commit/7d950306935e5a87803c52a728223a774174ae42)は、二問を別と判定しながら答えの要約が一致した場合も、各本文を引用して答えの違いを再照合する。「最初に何をするか」と「どれくらいの時間なら無理なく話を聴けるか」が同じ要約となって見送られた人間関係の46番を、当時の既出45問で再試験した。変更点より前の保存済み6応答を同じ指示と入力で再生し、新たな実4B応答6件で候補が通過した。合計12応答を通常のAPI経路と隔離DBに再生し、同一IDでの発行・回答保存・再読、別の本人からの読書き拒否、同じ問いと回答がわたしマップの更新資料に入ることを確認した。この往復ではマップのレポート生成までは行っていない。

### 固定試験後の個別修正

- [`c37123b2`](https://github.com/MassyuRed/mashos-api/commit/c37123b21c458d6bc512f7765987a3a451e021cf) は、予算内で優先する使い道の基準と、少数意見を伝えても結論が変わらなかった場合の手応えを、当時と同じ履歴で確認した。保持対照を含め3件が通過し、実4B応答28件。
- [`97959358`](https://github.com/MassyuRed/mashos-api/commit/97959358244c709e602eb1fc862311f165d3ec5a) は、追加で必要になった対応と進行中の作業のどちらを先にするか、最初に教える内容と先に直す箇所を選ぶ基準、家の用事の期限を聞き分けた。既出と同じ試用範囲を別の場面で再発行しないようにした。同じ履歴の4件と保持対照1件が通過し、実4B応答38件。
- [`ce97aeab`](https://github.com/MassyuRed/mashos-api/commit/ce97aeab7b8a06aab21f5eac2c5310632640a2ca) は、スマートフォンの利用が長くなりやすい場面を直接尋ね、運動の場面を重ねた前置きを除いた。同じ既出履歴の2件が通過し、実4B応答19件。
- [`6f58be66`](https://github.com/MassyuRed/mashos-api/commit/6f58be66faee903e14e465071b36bd3f9b598130) は、一つの活動の開始方法を選ぶ基準、協力を求める範囲、候補を並べて比べる準備を区別した。当時と同じ既出履歴の3件を実4B応答17件で確認し、全件が自動通過した。開始方法を選ぶ問いには場面の一部を本文でも繰り返す表現が残った。

候補のAPI・隔離DB関連210件、アプリ標準88件・本人切替と通知関連89件が通過した。固定試験版では三中核を含む関連554件と21のサブテストも通過した。固定250件の所要は30分58秒。個別で改善した結果は固定250件の集計を書き換えず、最新候補の固定全件での再評価、全件の本文確認、通常環境での発行・保存・マップ更新・通知は残る。本番ワーカーの既存接続には試験プロセスだけでモデル名を与えた。通常のPremiumふりかえりを配備する際は、そのモデル設定を本番ワーカーにも反映する必要がある。

§9.209の受入基準は未達。本番のAPI `3c343a09`・ワーカー `eeae89c8` と既適用のSupabase移行3件を確認した。候補の追加移行7件、通常配備、実機通知、新規配布は未実施。

<a id="deep-insight-fixed-rerun-cd0e2a9-20261122"></a>
## 9.226 場面調整後のテーマ出題とPremiumのふりかえり（11/22 JST）

[API検証版 `cd0e2a94`](https://github.com/MassyuRed/mashos-api/commit/cd0e2a94b6c5f22ec12c73e9738fb13058a6d28b)で、表示済みの場面と質問の冒頭が同じと確認した6枠に限り、反復を除いた。答えに影響する時点や条件は保持する。同版のAPI・隔離DB関連217件が通過した。

§9.225と同じ固定計画で、5テーマ各50件を既存の自然応答用4Bで実行した。各テーマを空の履歴から始め、採用した問いを次の出題の履歴に加えた。試験は10:23 JSTごろに終了し、所要は約33分。原応答、書き直し、採否、表示文、先行採用履歴を照合した。全試験のJSONLのSHA-256は `5dee8c250bbc47fbcada7663d5c0b41b4b88be0a183c48635c9e40c70ecfed31`。

| テーマ | 実行 | 自動通過 | 見送り | 再送省略 | 実行エラー | 実4B応答 | 既出30件超で通過 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 人間関係 | 50 | 50 | 0 | 0 | 0 | 322 | 19 |
| 自分の価値観 | 50 | 50 | 0 | 0 | 0 | 348 | 19 |
| 仕事・学び | 50 | 49 | 1 | 0 | 0 | 328 | 18 |
| 日々の過ごし方 | 50 | 50 | 0 | 0 | 0 | 350 | 19 |
| これからのこと | 50 | 49 | 1 | 0 | 0 | 293 | 18 |
| 合計 | 250 | 248 | 2 | 0 | 0 | 1,641 | 93 |

### 原応答と表示文の確認

「人間関係」の46番は、先行45問のあとに、相手の話を無理なく聴ける時間を尋ねて通過した。「自分の価値観」は、予算の使い道を優先する目安と、少数意見を伝えても結論が変わらなかった場合の手応えを、どちらも表示文で確認した。「仕事・学び」の22番は、先行21問のあとに、伝える内容が複数ある場合に最初の一つを選ぶ基準を尋ねて通過した。最初の説明で扱う範囲を尋ねた15番と答えが分かれる。

「仕事・学び」の46番は、二つの手順を同じ条件で試すための事前の確認事項を尋ね、先行45問との照合の最後で、二つの手順のどの項目を比較するかを尋ねた1番と重複とされて見送った。46番には試す課題や利用できる時間、1番には完了までの時間や誤りの数が答えになる。確定表示にも、影響が確認済みと読める設定、始め方の手応えを尋ねる文の活用、手順を変える条件を尋ねる文の助詞、確かめる事実を考える内容へ変えた文が残った。

「日々の過ごし方」の31番は、先行30問のあとに、家の用事をいつまでに済ませる必要があるかを尋ねて通過した。以前の休みの日の用事にかかる時間とは答えが分かれる。48番の運動を続けた結果を尋ねる表示は、何が生活に合ったと分かるのか読み取りづらかった。

「これからのこと」の44番は、先行43問のあとに、始めたい候補を並べて比べるための整理を尋ねて通過した。35番は冒頭の反復を除いた後、最初に何をするかだけが残り、どの行動を尋ねるかが曖昧になった。49番は、先行48問との照合で、学びたい候補のどれから学ぶかの基準を35番と重複とされ、見送った。採用した問いが履歴を変え、試した枠や順序にも差が出ているため、前回との比較は同じ出題枠を照合した。見送った二件は固定試験の結果に残す。

### 後続のテーマ候補

[API候補 `fae00b3e`](https://github.com/MassyuRed/mashos-api/commit/fae00b3ee47b9745940f64e964caf5bd7bbf451e)は「仕事・学び」の6枠を修正した。誤りの影響は確認済みと扱わず、二つの手順を試すときは手順以外でそろえる作業条件を聞く。始め方が自分に合ったと気づく変化、手順を変えるきっかけとなる指摘、同じ方法を次にも使えるか判断する前の事実を聞き分ける。説明を聞いて残った疑問の優先基準では、冒頭の場面の反復を除く。関連試験は234件通過、2件スキップ。[`429cce51`](https://github.com/MassyuRed/mashos-api/commit/429cce5199ee08b1cfba26c8f34190755a43b8c1)は、運動を生活に取り入れて続けたときの変化を聞く文も改めた。[`4a785d02`](https://github.com/MassyuRed/mashos-api/commit/4a785d029f1ef5f4a394e07e0d93fe56098d60f5)は次に学ぶ内容について、候補を探し始める行動と、候補が複数あるときに何を優先するかを、別々の場面で聞く。

記録入口だけを変更した `a7ed0581` で、固定250件の実4B応答1,641件を再生した。モデルへの指示・入力のハッシュと順序、確定した表示、採否、採用履歴まで同一だった。`429cce51` は、人間関係・自分の価値観・これからのことの全出題条件と選択順が同一で、固定150件の生応答963件も同じ指示・入力・表示・採否・履歴を再現した。`4a785d02` でも人間関係・自分の価値観の全出題条件と選択順を照合し、固定100件の生応答670件を再生した。これらの再生で4Bへの追加要求は0件。

`fae00b3e` の「仕事・学び」50件は、入力と指示が一致する原応答191件を再生し、差がある箇所で実4Bの115応答を得た。自動通過49件、見送り1件、実行エラー0件。誤りの影響を確認する前提、始め方の手応え、手順を変える条件、振り返りで確かめる事実、冒頭の場面の反復を修正した。46番は手順以外でそろえる条件と明記しても、比較する項目を聞く1番と照合の最後で重複と判定した。固定試験の見送りを保持する。

`429cce51` の「日々の過ごし方」は自動通過50件の実行集計を確認した。検証の原応答を回収できず、本文・履歴・採否の照合は保留。「これからのこと」は `4a785d02` の試験を開始したところで、原応答の記録を回収できなかった。

[統合候補 `2f5870d6`](https://github.com/MassyuRed/mashos-api/commit/2f5870d69fd84fa351fd2a78b783e6432bfb841d)は、仕事・学びの46番を、別の方法に切り替えても元の手順に戻せるか、事前の確認事項を尋ねる枠にした。人間関係と自分の価値観の全出題条件と選択順、固定100件の実4B応答670件に対する指示・入力・出題・採否・履歴は `cd0e2a94` と一致した。再生時の4Bへの追加要求は0件。統合候補の関連315件と21のサブテスト、隔離PostgreSQLのSQL試験が通過した。

統合候補 `2f5870d6` の固定計画では、各テーマ50件すべてが自動通過した。保存済みの指示と入力がハッシュまで一致した応答を再生し、差があった箇所で通常の4Bに送信した。5テーマの原応答と採用履歴を回収・照合し、見送り、再送省略、実行エラーはいずれも0件だった。

| テーマ | 自動通過 | 同じ指示・入力で再生 | 新しい実4B応答 | 既出30件超で通過 |
|---|---:|---:|---:|---:|
| 人間関係 | 50 | 322 | 0 | 19 |
| 自分の価値観 | 50 | 348 | 0 | 19 |
| 仕事・学び | 50 | 184 | 127 | 19 |
| 日々の過ごし方 | 50 | 331 | 20 | 19 |
| これからのこと | 50 | 244 | 49 | 19 |
| 合計 | 250 | 1,429 | 196 | 95 |

「仕事・学び」の46番は、先行45問のあとに元の手順へ戻せるかの事前確認を尋ねて通過した。既出の比較項目、試す範囲、手順を切り替える基準と、答えを分けて確認した。46番の採用後、48番は別の出題枠に替わり、追加分を組み込む前に今の作業への影響を確認する問いになった。場面の一部を本文でも繰り返している。「日々の過ごし方」の48番は、運動を続けたときの生活の変化を尋ねた。「これからのこと」の35番は候補を探す行動、49番は先に学ぶ候補を選ぶ基準を尋ね、双方が通過した。

独立した本文確認では、原稿・書き直し・確定表示・採用履歴の250件を読み合わせた。166件は出題意図のとおりに読め、84件には場面の反復や読みにくい語順などの軽微な文面課題を記録した。答えの対象や前提を変える問題と、同じ答えを求める問いの再発行は確認しなかった。

[最終検証版 `014bf9b3`](https://github.com/MassyuRed/mashos-api/commit/014bf9b3f8fdc4e6063c85f17e660c47b94afa7c)は、「仕事・学び」の48番で場面の反復を除いた。「仕事・学び」の50件を同じ固定計画で再確認し、`2f5870d6` の指示・入力と同一の291応答を再生し、48〜50番で新規の実4B応答を20件取得した。50件すべてが自動通過した。表示は48番だけが変わり、出題枠の識別値、採否、先行採用の順序は全件同じ。仕事への影響を確認するという問いの答えの対象も保った。

### Premiumのふりかえりの発行・回答・通知

`cd0e2a94` は架空の記録・過去回答・マップ等の対照10件のうち、8件で期待した発行・見送りと一致した。実4B応答は18件。理由が既知の記録で相手の事情を尋ねる一問を通し、過去回答が相手の反応を述べていない場面で新しい問いを見送った。

[`e299b6a9`](https://github.com/MassyuRed/mashos-api/commit/e299b6a9d0f618347c2a8eb8aea4bf80ac04c546)では同じ架空10件を使い、実4B応答16件を取得した。既知の理由を尋ねた案は発行前に止まり、9件が期待どおり。過去回答だけの対照は、本人が「意見が違っても本音を言える」と答えた場面で、相手のどんな反応なら話しやすいかを尋ねたが、再読が既回答とした。

[`a7ed0581`](https://github.com/MassyuRed/mashos-api/commit/a7ed0581d58dc645adaf93c5dda1fbec79896441)は、過去回答に根拠のない既回答判定が返った場合に、出典と本人回答を再照合する。実4B応答17件を通常APIと隔離DBで再生し、結果は9件。再照合も「意見が違っても本音を言えるときです。」を相手の反応への回答として扱った。資料なし、安全配慮を要する記録、更新で古くなったマップは、モデルを呼ぶ前に見送った。原応答の圧縮原本のSHA-256は `d918bcc1836a5cae1ade5bd5b69393ae2cb1133ed7c2f196f88b0099ed0196d8`。

[`465d721f`](https://github.com/MassyuRed/mashos-api/commit/465d721f62447a819bb6d44219d44166d7b5eb65)では、過去のDeepInsight回答を根拠にした問いが既回答と判定された場合、先に問いの答えが原文にあるかを別の実4B呼出しで調べる。具体的な答えを抽出できないと返った場合に、表示する問いの前提・焦点・既出との重複を個別に確認する。同じ架空材料10件に対して実4Bの18応答を取得し、通常のAPI・ワーカーの指示と入力を照合して隔離DBで再現した。期待した発行・見送りと一致したのは9件。理由が未記載の記録、別作業を選ぶ条件、現行マップからの3件を発行し、本人の同一ID・回答再読、別所有者の拒否、マップ材料への連携、架空端末を使った通知の一回送信を再確認した。通知は同一発行IDへの遷移情報を持ち、本人の本文は含めない。過去回答だけの例では、相手の反応についての答えがないことを抽出段階で正しく返したが、別の読み直しが `unclear` を返して発行しなかった。生応答の圧縮原本SHA-256は `6af73e6b2a1795cd765791baee53c7864b446291ed82c4da8f8edae52c0d9f47`。

統合候補 `2f5870d6` は、過去回答に具体的な答えがあるか、引用と質問の前提が本人の原文に沿うか、既出の問いが同じ内容を求めるかを個別に照合する。発行済み・回答済み・見送りの問いを参照し、照合済みの各問いが別の答えを求める場合に発行へ進む。同じ架空材料10件、実4B応答19件を通常API・ワーカーで再生し、10件すべてで期待した発行・見送りと一致した。相手の反応が過去回答にない例では、本文の前提と、以前の問いとは別の答えを求めることを確認して発行した。4件を隔離DBで発行し、本人が同じIDで回答を保存・再読でき、別の本人からの取得と回答を拒否した。同じ4件の問いと回答がマップの資料に入り、架空端末への通知の一回送信を模擬して再送を止めた。見送り6件では発行と通知予約が0件で、うち3件はモデルを呼ばなかった。現行マップ対照の指示、入力、実応答と発行候補は、下記の実v24につないだ対照と一致した。生応答の圧縮原本のSHA-256は `89a7cfabe1a7c667219a976a0094c38557c1c2471d5c9a37131ac0d3f6c63ebd`。

### 実v24のわたしマップ

`cd0e2a94` の現行マップ対照では、実4Bの問いに架空の本人回答を保存し、同じ隔離DBにある2記録を分析用に読み込んだ。最初は `analysis_model_source_unavailable`、4Bの連続試験中の診断では `PLAN` がHTTP 429となった。固定試験の終了後、同じ入力でv24の既存分析経路に一回送信し、`PLAN`・`NODES`・`RELATIONS` の原応答を31.5秒で受領した。順序、指示と入力、応答のハッシュを照合して隔離DBに保存し、最新・詳細が同じ版を返した。図2項目のうち、資料を置く場所を空けたいという本人の理由の根拠から、保存した同じ発行IDの問いと回答を読み直した。別の本人はこのレポートを取得できなかった。圧縮した原応答のSHA-256は `89aeca9fd06316be5ba9b4b72555f64c19a1cf19ac76ee3d74b071ea35702dea`。

実応答の試験に使ったRenderの本番ワーカーでは、複数の検証用作業ツリーで `/tmp` が2 GBの上限を超えた。10:29:12 JSTに旧インスタンスが停止し、10:29:26 JSTに稼働が回復した。稼働コミットは `eeae89c8`。この復旧時点でサービス規模や稼働版の変更はなかった。上記の固定250件と保全済みの原応答は回収済み。復旧後は、検証に必要なファイルだけを含む約52 MBの作業領域で、統合候補の実応答検証を再開した。

### 通常反映（11/22 JST）

[API `main` のマージ `cfeeecf4`](https://github.com/MassyuRed/mashos-api/commit/cfeeecf451137b865b45f35e2c86f453c4eda14f)は、最終検証版 `014bf9b3` の実行ファイルと移行を使用する。検証版との差分は既存のOpenAPI契約試験をマージした1ファイル。関連試験は320件通過。

Supabaseで追加7件を適用し、移行履歴と対象関数の `service_role` 専用権限を照合した。

| 移行ファイルの番号 | 本番の適用番号 | 対象 |
|---|---|---|
| `20261121185000` | `20261122015119` | テーマの次回発行可能時刻 |
| `20261121185100` | `20261122015121` | テーマの次回発行通知 |
| `20261121190000` | `20261122015123` | テーマ専用の出題資料 |
| `20261121192000` | `20261122015124` | ふりかえりの発行通知 |
| `20261121193000` | `20261122015126` | マップ更新後のふりかえり判定 |
| `20261121194000` | `20261122015128` | 同じ発行IDの問いと回答の取得 |
| `20261121195000` | `20261122015129` | Emlisで見送った問いとの照合 |

Renderのワーカーに既存の実4Bのモデル名 `cocolon-qwen35-4b-base-851bf6e` を設定した。API・ワーカーとも `cfeeecf4` がLive。

| Render | 配備ID | Liveになった時刻（JST） |
|---|---|---|
| ワーカー | `dep-dc14lulkasac73d4i2mg` | 10:54:32 |
| API | `dep-dc14mrqjnfac73fmgbd0` | 10:56:16 |

ワーカーの稼働中のコミットと、起動ログでふりかえりの判定・FCM通知が処理対象に含まれることを照合した。通常の環境設定で既存の4Bにつなぎ、架空一件に対して正常なJSON応答を得た。旧「今日の問い」の通知ジョブは停止を継続。

配備後のAPIで、`GET /healthz` は200。認証なしの `GET /deep-insight`、架空IDを使った `GET /deep-insight/questions/{question_id}`、`POST /deep-insight/questions`、`POST /deep-insight/answers`、`PATCH /deep-insight/theme-notification` はすべて401。旧 `GET /today-question/status` は404だった。本人の認証を伴う発行・回答・再読と実端末への通知は本番で未確認。新規ビルドと配布は未実施。

<a id="cmee-four-feature-normal-adoption-20261122"></a>
## 9.227 CMEE＋4Bを一体で進める通常反映方針（11/22 JST）

### 方針と開始地点

EmlisAIの観測応答、Pieceの文章・画像、わたしマップv24、DeepInsightの問いと回答を、**CMEE＋4Bの一つの作業単位**として進める。EmlisAIとPieceの通常利用を今回の到達点とし、わたしマップv24・DeepInsightの稼働と、四つの間で本人が伝えた意味が食い違わないことを同じ単位で確認する。実装と検証は共通の入力・出典を決めたら可能な限り並行する。わたしマップまたはDeepInsight側に原因があると分かった修正も同じ単位に含める。既に動く経路は対照として再利用し、必要な差分を確定してから配備対象を決める。 [最新議事録 §11.24](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md#cmee-four-feature-work-decision-20261122)

全体設計01・02系、CocolonとAPIのファイル地図、三中核とCMEEの現在地、作業規則、毎回の必読記録、最新議事録、現行API・ワーカー・DB、モデル提供の用途別経路を起点とした。調査の基準はアプリ資料の `7e8e9e9`、通常API・ワーカーの `cfeeecf4` と、この版から前回の問い・回答処理を継いだ[API候補 `f8a6db36`](https://github.com/MassyuRed/mashos-api/commit/f8a6db362026324d98e007fef98dd284361884c1)。全ファイルの所在と関連する仕様・実装・稼働経路を照合した範囲の判断であり、全ソース本文と全画面の精査は未了。この節にある候補の試験と通常運用の確認は区別する。 [現在地](../../00_cocolon_current_product_and_state.md) · [三中核・CMEEの入口](../../current_structure/00_three_core_and_cmee_read_first.md) · [現行API・ワーカー](https://github.com/MassyuRed/mashos-api/commit/cfeeecf451137b865b45f35e2c86f453c4eda14f) · [API候補](https://github.com/MassyuRed/mashos-api/commit/f8a6db362026324d98e007fef98dd284361884c1)

### 現行の接続と共有する根拠

| 機能 | 通常運用と現在の確認範囲 | 渡す材料と修正を判断する点 |
|---|---|---|
| EmlisAI | 4Bの通常自然応答、問い・回答、保存・再読の経路が稼働。Emlis用の保存済み追加学習重みは通常応答に未採用。 | 思考・行動、本人が選んだ各感情と強さ、カテゴリ、適格な履歴・本人判断を、別々の意味として読む。問いは回答の文脈、回答の原文とその適用範囲は本人の資料。観測とフォローは入力に根拠を置き、分からない事情を補わない。 |
| Piece | 通常の4B接続と私的な作品の保存・再読が存在する。Piece用の保存済み追加学習重みは通常提供に未採用。 | 元入力に本人が利用を選んだ有効な補足だけを重ねる。気持ちと事情をつなぐ場合は、同じ本人・記録版・発行した問いと回答・原文範囲の組を照合する。Emlisの返答本文から作品の事実を取り込まない。 |
| わたしマップv24・ルート | MAP用v24は通常の通知式生成で図・本文・根拠を保存し、同レポートIDで再読した実績がある。長い履歴も裏で処理し、時間の設定は未処理・停止の判定に用いる。既存のIF／ルート用120uは別用途。 | 該当する本人の出来事と気持ちを別々の出典で渡す。確かめた結び付きは元記録・回答の両方に根拠を持たせる。本人が一方を訂正・撤回したときは、その箇所とそれを根拠にした関係を外し、独立した出来事と関連のない記録を残す。実v24の図・本文・関連線で結果を確かめる。 |
| DeepInsight | §9.226のAPI・ワーカーとSupabaseの連携が通常反映済み。旧配備版には本人認証付きの発行・回答・マップ反映実績があり、最新配備版では実4B疎通、権限の入口、隔離DBから実v24への回答連携を確認。最新配備版の本人認証付き往復と実端末通知は未確認。 | 発行ID・本人の日付付き回答を保持する。Emlisの発行済み・回答済み・見送りの問いを照合して聞き直しを防ぐ。現行のEmlis回答抽出は、複数回答や訂正がある会話の回答を除外する。古い答えを戻さず、有効な本人回答を取り出す必要がある例を再現し、DeepInsight側の変更範囲を決める。 |

CMEEは既存の保存・出典・権限・時点・訂正の仕組みで、どの本人資料をどの用途へ渡せるかを揃える。4Bは用途ごとの指示とその根拠から自然文・作品・分析・問いを生成する。各機能は既存の採否判定と保存・再読を持つ。共通に使うのは有効な本人の入力・回答・訂正と、それらから確かめられた範囲・関係。Emlis本文・AIの問い・Piece本文・マップの推定やIFの出力を、他機能で本人の事実へ昇格させない。AIの問いと分析は、正規の権限内で文脈・重複防止・読取りに使う。画面の選択肢やカテゴリから、役割や原因を作らない。 [CMEEの現在地](../../current_structure/04_cmee_current_structure.md) · [v24通常反映](#analysis-b61-normal-background-map-20261120) · [DeepInsight通常反映](#deep-insight-fixed-rerun-cd0e2a9-20261122)

### 保存済みの重みの照合と今回の実測

Emlis `10b563154c7b05faf7f84264312328611724cf31ff834d9924337761c5513788`（教材16件・32更新）とPiece `344a9defd0c890982d9718805d8b630b5d48719475c998aa9a57ed6df6bfc337`（教材48件・96更新）を保存原本と照合した。承認された架空材料とこの2組のZIP（28,430,837バイト、SHA-256 `a05fcdc2127fe8a7108ca1443d37548a67c29335be4fe298bb345d8514e213a1`）を既存Podへ送付。同じQwen3.5-4Bから、重みなし・各用途の重みありを隔離CPUで実生成した。本番GPUは走らせたまま、試験プロセスだけで重みを切り替えた。これはCPUの実4B比較であり、本番GPUの動作、処理時間、端末の表示を確かめるものではない。本番モデルの設定変更と追加学習は行っていない。試験実行が上限に達して未取得の対照と、その後の「回答なし」用の新しい指示で実生成に到達しなかった対照は、未確認として残す。

| 架空の対照 | 実4B出力と既存検査の結果 | 次に詰める点 |
|---|---|---|
| 思考・感情 `つらかったんです`、行動空欄、悲しみ・中、仕事、本人回答 `会議がうまくできませんでした` | Emlisの両条件が同じ「仕事で会議がうまくできず、つらかったんですね。その悲しみを Emlis は受け取りました。」。修正版の同じ送信内容と照合し、既存の問い「なにがつらかったんですか？」から回答後の本文まで隔離DBで保存・同じ版を再読した。 | 話題、書き方、回答の長さが違う未公開例でも、実4Bによる差と本文の価値を確かめる。 |
| 同じ会議のPieceと、補足を使わないお茶の対照 | Baseの出力は本人の文を保持し、会議は「つらかったんです。／というのも、会議がうまくできませんでした。」として保存・再読。接続語は確認済みの関係に基づきPieceが付けた。保存済みPiece重みは「つらかった。」「会議がうまくできなかった。」へ変え、お茶も「飲みました。」を「飲んだ。」に変更。両方とも同じ既存経路で再生したとき採用されなかった。 | 本人の一人称・語り方・否定・時点を保持した編集の効果を、思考＋行動＋任意の本人補足の長めの文章でも確かめる。 |
| 褒められたのに嬉しくなかった例、スキップ、問いオフ | 比較に使った元の指示では、Emlis Baseは記録の説明から始め、根拠のない心理の説明や本文に入れるべきでない問いが出た。保存済みEmlis重みでも元の問いを再掲した返事があった。短い回答用に材料を整理した調査では、両条件が回答中の「重かった」を拾った。主体・時点・喜べなかったことまで安定して返せるかは未了。 | 問い追加や長い説明を減らすだけで終えず、二欄と回答の根拠、プラン差、本人が受け取る価値を実際の本文で評価する。 |
| 同じ会議の分析・訂正・問いへの影響 | Emlisで確かめた事情を、候補の隔離DBからv24の生成入力まで両方の原文範囲付きで確認。候補では明示の訂正で元の気持ちと古い因果を外し、独立した出来事が残ることも隔離試験で確認した。自由文の訂正を保留する例がある。同じ入力の実v24による図・本文と、DeepInsightの既回答判定・再出題は未確認。 | 同一入力の変更前後を四機能で再生し、分析・出題の取り違えが保存後にも残らないことを確認する。 |

保存済み重みは学習した資産として保持し、用途別に実際の出力で採否を決める。今回の会議のEmlis一件には比較差がなく、Pieceの二つの対照は現行の保存経路では不採用。これまでの教材・重み・実応答と直した問い・回答を基点に続ける。候補の後続の調査差分は本番に未反映。短い返事向けに材料を整理した試作では、既存のCMEEで読み取った意味と旧応答の再開を扱う回帰に未解消の差がある。候補の確定や追加学習の判断は次の同条件比較の結果に合わせる。試験用記録以外の本人の記録・応答・重み本体はGitHubに載せない。

### 次のタスクと並行の進め方

既存の入力票・保存版・モデル比較では、思考欄と行動欄の空欄、選択した感情ごとの強度、カテゴリの単数・複数、問い設定、履歴と本人判断、日時と利用権を固定して再現する。**下表の「共通の確認」を作業の最初に短く合わせ、EmlisAI、Piece、わたしマップ、DeepInsight、4B提供の調査と修正を並行する。** 上流の修正待ちで手を止める必要がある場合は、既存の保存された再現材料で下流の採否・保存・再読を先に確認し、上流の更新後に同じ本人データの実経路へつなぎ直す。片方の準備完了を他方の採用完了と扱わない。

| 作業 | 引き継ぐ実装と必要な対応 | 確認する結果 |
|---|---|---|
| 共通の確認と素材の受け渡し | `cfeeecf4` と候補の差分、通常の用途別モデル・重み、API／ワーカー／Supabase、画面側の設定と版を照合する。既存の入場・保存・出典を使い、原入力と有効な回答の組を四機能に渡す。同一人物・記録版・発行ID・回答ID・元文字範囲、回答と訂正の新旧を照合する。 | 同じ会議例と別話題で、四機能に届く本人の根拠を照合できる。別人・別の問い・無効な版・削除・撤回は採用されず、独立した原文は残る。 |
| EmlisAIの回答とプラン差 | AR-01／02／03の続き。短い入力、別の話題、二欄、複数感情とカテゴリ、既知の事情・未知の事情で、受け止め、一点だけの問い、本人が答えた後、訂正後の本文を比較する。短い名詞だけの返答、現在進行の事情、理由を明示した答えを対照にする。本人が選んだ感情と強さを勝手に変えず、観測とEmlisからのフォローを本人に返す。 | Freeは当回と同じ入力への回答、Plusは関連する適格な本人履歴、Premiumはさらに本人が修正・拒否できる根拠付きフレーム。実4Bの本文で差と境界を示し、過去を現在に持ち込まない。全プランで同じ入力に必要な場合に一問ずつ最大3問。オフ・スキップ・答えられないときは分かる範囲で自然に返し、問いを本文へ混ぜない。 |
| Pieceの生成・画像・保存 | AR-04の既存4B・CMEE・S7・B8/B9から続ける。思考＋行動の長めの文章、補足の選択あり／なし、複数回回答、後からの訂正・撤回で編集を確かめる。作品だけで読める順序やまとまりを整えつつ、本人の表記・否定・発話者・時点・強調を守る。 | 採否理由と実4Bの文面を原文で照合する。プレビュー、画像、保存、一覧からの再読で同じ本文・画像の版。重複リクエストによる利用回数の二重消費、別人の取得、意図しない公開がない。端末で画像保存・表示を確かめる。 |
| わたしマップv24・ルート | 既存の `astor_material_snapshots.py` と分析の `source_adapter.py`、`semantic_admission.py` から、本人回答の採用・失効・保留の扱いを修正候補と突き合わせる。短い更新と複数記録の統合でv24の実生成、IF／ルートの既存対照も実施する。 | PLAN・NODES・RELATIONSから図・本文・根拠・通知まで通し、同じレポートIDで再読する。訂正で古くなった気持ち・関係だけが落ち、独立した出来事・別記録と既存の通知式更新が成立する。 |
| DeepInsightの発行・回答 | `20261121195000` の資料抽出と `deep_insight_question.py` の既出照合を、Emlisの同一入力、複数回答、訂正、見送り、本人の別の問いで確認。本人が伝えた有効な答えを現在の抽出が落とし、同じ確認点を再発行する場合は抽出・照合の該当箇所を修正する。 | テーマは全プラン、次回までFreeは7日、Plus／Premiumは24時間。「記録をふりかえる」はPremiumで、同じ確認点の再発行を防ぎ、別の答えが必要な問いと区別する。同じ発行IDで回答・再読し、通知から開けることとv24へ本人回答を渡せることを最新版で確かめる。 |
| 4B提供と比較 | 既存のモデル提供と重みの保管から続ける。Emlis用、Piece用、MAP用v24、IF用120u、DeepInsightの自然応答を要求ごとに特定し、用途の切替・並行呼出し・失敗後の復帰を既存の提供経路で検証する。Emlis用の切替を用途別に限定して、DeepInsightの通常設定と出題を対照にする。公開採用の判断材料には同じ実GPUと通常指示で、モデル重み以外を揃えた結果を使う。 | 実応答ごとにモデルと重みを照合でき、別用途の重みを引き継がない。比較用の未公開例は学習や指示内の例から外し、本文・画像・図・問いそのものを確認して採否を決める。CPU比較と保存データの再生は原因の切り分けに使う。 |
| 四機能を通す通常反映 | 同じ架空の本人記録を、入力・Emlisの質問と回答・Piece・わたしマップ・DeepInsightの発行／回答から再度マップまで通す。訂正・撤回、見送り、問い設定、権限、旧保存版を同じ確認で扱う。APIとワーカーの新旧が混ざる時間と、発行済みの新しい問いに答える最中の巻き戻しを事前に確認。実際に旧版が新しい問いへの回答を保存後に処理できない再現があるため、切替前に未完了の問いと互換の読取・回答経路を確認する。 | 合格したコードと用途別の重み、通常API・ワーカー、認証付き保存と同じ版の再読、現行端末での表示・通知を別々に記録する。既存v24とDeepInsightの互換も同じ反映判断に含め、変更が必要だった側を含めた通常の組み合わせで完了を確認する。 |

優先して人が読むのはEmlisの返事とPieceの作品、v24の図・本文・根拠、DeepInsightで本人が読む問いと回答のつながり。合格件数や接続の成功は本文の代わりにしない。観測は入力に根拠を持ち、フォローは受け取った内容に応じる。観測とフォローの比重は原文と応答の役割で扱い、文字数で整えない。本人の原文中の命令風の文、引用、不確かな原因、本人の過去の回答をそのまま現在の事実へ移す失敗も未公開の対照に入れる。必要な新規学習がある場合は、先に既存教材と保存済み候補の改善・悪化を同じ試験で確定し、必要な差だけを教材と比較へ戻す。

今回の決定は方針と作業順の確定。EmlisAIとPieceの重みの採否、採用する版の通常反映、四機能の最新候補での通常往復、実端末の確認は次の作業として残る。

<a id="cmee-four-feature-continuation-20261122"></a>
## 9.228 本人の回答と訂正を四機能で確認（11/22 JST）

[§9.227](#cmee-four-feature-normal-adoption-20261122)を基点に、[前回のAPI候補 `f8a6db36`](https://github.com/MassyuRed/mashos-api/commit/f8a6db362026324d98e007fef98dd284361884c1)と[通常版 `cfeeecf4`](https://github.com/MassyuRed/mashos-api/commit/cfeeecf451137b865b45f35e2c86f453c4eda14f)の差分を照合し、四機能の変更を[API検証ブランチ `cd593df`](https://github.com/MassyuRed/mashos-api/commit/cd593df087945f2ace34f760bd2d9c45454a324c)に保存した。アプリは[`5a161aee`](https://github.com/MassyuRed/Cocolon/commit/5a161aee8d1dcf1cf0294e5078da4626f2cb0162)の全体設計、全機能の現在地、四機能の経路と最新議事録を参照した。同版のGitツリーでアプリ・前提資料5,969ファイル、APIの前回候補で2,762ファイルの所在を確認した。全ソース本文と全画面の精査、全機能の実動作の確認は残る。

### 通常稼働と実4Bの出力

RenderのAPIとワーカーは `cfeeecf4` でLive。稼働中の通常4Bで会議の架空対照を再確認し、EmlisAIは1.16秒、Pieceは2.17秒で前回の会議例と同じ返事・各欄の出力を得た。別の二欄の記録に対するEmlisAIの応答は2.09秒で、追加の質問と原文の読み違いがあり、採用しなかった。長い二欄のPieceでは7.11秒で、思考欄と行動欄の原文を保持した出力が返った。候補の採否処理では、その原文を文法で読み取れず見送ることを確認した。現行提供のモデルと重みを変えず、架空の入力を試験に用いた。

Pieceは、両欄で同じ一人称が過去の行動・思考を明示している場合に、対応する文型を既存の作者へ渡すようにした。実4Bが返した長い二欄と同じ本文を試験の提供口から再生し、隔離DBへの保存と再読を確認。本人の原入力とEmlis応答を保持し、利用枠の消費は一回、既存の所有者と画像生成用データの検査を通過した。実出力の否定を肯定へ変えた対照は保存前に拒否した。気持ちを訂正した会議例で本人が同じ回答の利用を選ぶと、Pieceは `piece_correction_selected_answer_pending` で見送った。

### 隔離DBと共通の原文

隔離したPostgreSQLで「つらかったんです」に対する問いと回答「会議がうまくできませんでした」を保存し、わたしマップv24の生成入力へ別々の原文範囲として渡ったことを確認した。本人が前者を「私は不安だった」へ訂正した対照では、EmlisAIの新しい書き手とv24の生成入力の両方で古い気持ちとその結び付きを外し、会議の出来事と新しい本人説明が残った。「分かりません。」という別の回答は出来事の根拠に加えなかった。実4Bによる図・本文・関係線と、通常経路でのマップ保存・同じ版の再読はこの試験の対象外。

DeepInsightの候補は、複数回答や訂正を含む会話から、本人を照合し、現行の保存版で一欄全文の有効性を確認できた回答を使う。訂正後も独立した根拠として残る回答を使う場合、元のEmlisの問いは同じ回答を根拠とする同文の発行を止める照合に使い、生成指示から外す。本人が訂正した部分と、位置を保てない断片は今回の資料から除く。合成応答の対照では、隔離DBで発行した問いへの回答を同じ発行IDで保存・再読し、わたしマップv24の作り直しに渡す資料へ同じ回答が入った。

同じ会議の材料で実4Bを3回呼んだ。問いの焦点選定は1.49秒、文面作成は0.65秒、読み直しは1.37秒。会議が難しかった理由を尋ねる新しい案を得たものの、読み直しが既回答と判定したため、問いは発行せず、保存と代替案の生成も行わなかった。

### 接続設定と中断からの再開

EmlisAIだけの接続先・モデル・鍵を一組で指定する候補を確認した。三項目が空なら現在の共通接続を使い、不足があるときは新規のEmlis応答を採用しない。既存のPieceとDeepInsightは共通接続を引き続き使う。別の試作では短文用の送信形式に替えた結果、既存の保存済み受領記録から応答を再開できないことを隔離SQLで再現した。この送信形式を候補から取り除いた。新方式を既定で無効にした状態では旧形式の書き手を使い、保存済みの従来の受領記録を再読できた。新方式の有効時に出した問いは、無効に戻した後も同じIDで回答でき、受領済みの候補文は推論を追加せず保存まで再開できた。

Pieceに長文の文型を追加する前の統合試験は728件通過・5件スキップ・失敗0件。文型追加後に関連48件を再確認し、全件通過した。保存・再読の確認は隔離DBで実施し、生成処理に合成応答を使った試験を含む。実4Bでの比較結果は上記の出力の範囲。EmlisAIの二欄の応答、訂正後の回答を選んだPiece、DeepInsightの実4Bによる新しい問いの採用、同じ訂正後入力から作るv24の図・本文が残る。用途別の重みの採否、通常の認証付き四機能往復、同じ版のPiece画像・マップ・回答の再読、端末通知を確認してから通常反映を判断する。今回の本番配備、Supabase移行の適用、追加重みの設定、アプリのビルドと配布はいずれも未実施。

<a id="cmee-corrected-source-real-4b-20261122"></a>
## 9.229 訂正後の原文を通常4Bで再検証（11/22 JST）

§9.228の会議例で、Emlisの問いへの回答「会議がうまくできませんでした」を保ったまま、元の思考欄を「私は不安だった」に訂正する。原入力・問い・回答・訂正の対応を隔離PostgreSQLで再現し、通常提供中の4Bで四機能を照合した。

### 訂正後のPieceとDeepInsight

- Pieceは、選択済みの補足とその元の問いを確認し、すでに有効性が確認された会議の回答を作品に残す。実4Bの二欄は「会議がうまくできませんでした」「私は不安だった」（2.20秒）。その出力でプレビュー、見た目の変更、保存、同じ本文の再読、フォロワー公開から非公開へ戻す操作を隔離DBで確認した。本文・画像設定の版を保持し、保存時の利用枠の消費は一回。否定を肯定へ変える出力、根拠のない因果の追加、元の問いの差替えは拒否した。画像はiOS v2・1080×1350の出力設定と保存ハッシュの照合まで実施した。端末上の画像生成・保存・表示は未確認。
- DeepInsightは、訂正後も有効なEmlis回答を使う理由の問いについて、実4Bが結果の引用そのものを「理由への回答」とした場合だけ、理由を支える一節の有無と問いの前提を再照合する。実4Bは理由に当たる一節がないことを確認し、結果を前提に理由を聞くことを許可した（0.55秒＋1.27秒）。隔離DBで「会議がうまくできなかった理由は何ですか？」を発行し、同じ発行IDで回答・再読した。更新後のv24の資料に回答全文が入り、元のEmlis資料も一致した。既出の問いの照合は引き続き行う。

### EmlisAIの二欄と本人補足

思考欄「褒められたのに、嬉しくなかった。」、行動欄「会議で発表した。」、本人補足「その時は重かった。」で、実4Bの返事を原文と照合した。短い入力に整理すると「重かった」と「嬉しくなかった」を拾うものの、両欄を渡した条件で、会議で発表したときに褒められたと補った。行動欄を別の資料として渡す条件では会議への誤った結び付きを外せたが、「褒められたと受け取った」と出来事を受け取り方に変えた。行動欄だけを変えた対照では「嬉しくなかった」も省略された。「誘われたのに、嬉しくなかった。」と「その時は怖かった。」の別例は事実・否定・補足を保持した。ケース間で保持できる内容が揃わず、試作した送信形式の変更は採用していない。既存の問い・回答・保存済みの受領を起点に、本人が書いた事実と返答で分かった受け止めを保持する生成が必要。

### わたしマップv24の実生成

訂正済みの同じ記録で、実4BのPLAN・NODES・RELATIONSが応答した。最初の検証では、本人が別々に書いた会議の結果と不安を一つのノードにまとめ、「その後」としたため見送った。二つの原文を別のノードにする試作で、図のノード二つ、根拠二つ、関係線なしを確認した。本文と全体タイトルは「会議の後」「その後」を加えたため見送った。図と本文は個別に原文と照合した。

最終候補は、本人の回答と訂正の各全文を独立した根拠とする。両方が一件の短い記録の中の、それぞれ単独で読める一節の場合は、原文を見出しと根拠に使い、意味の書き足しを省く。実4Bの三段階は7.555秒、23.007秒、17.269秒。図は「会議がうまくできませんでした」と「私は不安だった」の二項目、関係線なし、全体名は「本人の補足回答と訂正」。同じ実出力を隔離DBへ保存し、最新・詳細・月別・原文根拠を別プロセスから同じレポートIDで再読した。他の本人の取得は拒否し、通知要求が一回作られた。端末への通知到達は未確認。訂正を含まない三つの対照では、修正前後の生成要求と三段階の送信内容が一致した。

### 反映状況

Piece・DeepInsightの修正、v24の原文範囲の修正と時刻境界試験の修正をAPI検証ブランチに保存した。Piece・DeepInsight統合時の関連347件、v24修正後の関連113件、最終統合時の四機能の該当13件が通過した。追加の広範囲試験は4,942件・21サブテスト通過。初回は旧版の参照ファイル不足一件と隔離PostgreSQL未設定の二件があり、旧版の参照データとネイティブPostgreSQL 16.16を揃えた追試で三件すべて通過した。 [API検証ブランチ](https://github.com/MassyuRed/mashos-api/tree/agent/cmee-corrected-source-validation-20261122)

通常のRender API・ワーカーは `cfeeecf4` で稼働中。今回の本番配備、Supabase移行、重みの切替、iOSビルドと配布は未実施。通常反映の判定には、EmlisAIの二欄・補足の本文、Pieceの実端末画像、DeepInsightの回答を加えた後のv24の実生成と再読、複数記録の統合、端末通知、通常の認証付き保存を残す。

<a id="cmee-post-answer-map-reread-20261122"></a>
## 9.230 DeepInsight回答後のわたしマップ再生成とEmlisAI二欄の再検証（11/22 JST）

§9.229の訂正済みの会議例を、回答後のわたしマップまで接続した。全体設計と現行仕様、CMEEの責務図、最新議事録、アプリとAPIのGitツリーを照合した。作業開始時の検証版はアプリ `9fe3674`、API `ef3258c`。APIの統合候補に、以下のv24の修正を保存した。 [API統合検証版 `302fe1f`](https://github.com/MassyuRed/mashos-api/commit/302fe1f411fb59a47077144e677dd88ca08ed20c)

### DeepInsightの発行済み回答から最新マップへ

同じ発行IDで保存済みの本人回答「打ち合わせの論点を先に確認できていなかったと振り返りました。」を使った。回答前の月別マップを先に保存した隔離PostgreSQLから、訂正済みの記録と回答の2記録版、無関係な図書館の記録を加えた3記録版を作った。元のEmlisの回答「会議がうまくできませんでした」と訂正「私は不安だった」は、どちらの資料でも独立した原文範囲を持つ。

従来候補の実4Bは、会議の結果とその後を見出しで結び、本人が振り返った内容を希望として扱った。修正では、1件の訂正済み入力に残る二つの原文と、別記録の短いDeepInsight回答がそれぞれ独立し、原文に関係の記載がない場合に限り、原文を項目名・根拠に使う。無関係な一件が加わる対照でも同じ処理を行う。PLANで全原文範囲を採用し、NODESで振り返りを本人判断として保持し、RELATIONSで全項目と関係線の採否を確認する。因果を補った見出し、項目の欠落、誤った判断種別は拒否する。

| 架空の資料 | 実4Bと隔離DBによる確認 |
|---|---|
| DeepInsight回答後の2記録 | 図・本文・根拠に会議の補足、訂正後の不安、振り返りの三項目。関係線0本。最終の実応答は全項目を選び、一項目の原文を全体の見出しに返した。受領原本を保持し、表示には既存の件数見出し「2件の記録を振り返って」を使用した。 |
| 図書館の記録を追加した3記録 | 三段階の実4Bが揃い、「私は図書館で本を返した。」を含む四項目をそれぞれ保持した。関係線0本、実4Bの見出しは「3件の記録を振り返って」。 |

両ケースで実応答をそのまま再生し、通常と同じ処理を隔離DBで実行した。最新・ID指定の詳細・原文根拠は別プロセスから同じレポートIDで再読した。以前の月別版は同じIDで読め、後日のDeepInsight回答が入らなかった。他人の詳細と根拠の取得は404。通知要求は各1件作られ、端末への到達は未確認。DeepInsight回答前の訂正済み対照では、三段階の送信内容と同じ実応答から作った結果が前候補と一致した。

### EmlisAIの思考・行動と本人補足

現行の通常4Bに同じ元入力を送り、思考「褒められたのに、嬉しくなかった。」と独立した行動「会議で発表した。」を一続きの出来事として説明し、本人が回答した問いを重ねて尋ねる失敗を再現した。本人の出来事・否定・その場での受け止めを分ける試作で、元の例と行動欄だけを変えた対照は三つを保持した。話題を変えた二例では、書かれた否定の強さを「全く」に変えたり、行動との関係がないと推測したりする表現が残ったため、この試作は統合検証版へ入れなかった。四例の実応答を隔離DBで再生した試験では、初回保存失敗後も、二度目の生成をせず同じ受領本文を保存・再読できた。本文の採否はこの保存試験と分けて判定した。

保存済みEmlis用重み `10b56315` の重み本体と設定は原本を再照合した。§9.227の同一モデル内の隔離比較を引き継げる状態であり、今回の実生成は稼働中の自然応答用ベースのみを使用した。新しい重みの学習・通常提供への切替は未実施。

### 検証と反映状態

統合候補の関連試験は466件通過した。初回に子プロセスでモジュールを参照できなかったPieceの再読試験は、同じ候補でモジュールパスを揃え、全件を再実行して確認した。 [最新候補のPiece CI](https://github.com/MassyuRed/mashos-api/actions/runs/44996988208) · [最新候補のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/44996988220)

切替と巻き戻しを隔離DBで確認した。候補の資料抽出を旧APIで読むと例外は起きないが、訂正後も有効な独立したEmlis回答を出題資料から落とす。候補が発行したDeepInsightの問いには、旧APIでも同じIDで回答を保存・再読できた。EmlisAIでは、候補が新方式で発行した問いは旧APIで読めても、旧APIで回答すると本文が未反映になった。候補が受領済みの訂正の応答を旧APIに戻した場合も、その本文を再開できなかった。候補のAPIを `COCOLON_EMLIS_CONTEXT_UPDATE=false` にすると新方式の開始を止めつつ、既発行の問いと受領済み本文を処理できた。通常切替はワーカーを先に揃え、APIは新方式を無効にして配備・照合し、有効化を別に判断する。いったん新方式を使った後に止める場合は、処理できる候補APIで無効へ戻す。旧APIに戻す場合は対象の未完了の問いと受領記録を確認し、必要な間は回答と再試行の書き込みを止める。

Renderの通常APIとワーカーは `cfeeecf4` で稼働。Supabaseは適用済み50件、最新 `20261122015129`。候補の `20261122142000` は未適用。従来ワーカーが新しい資料で保存した古い図を最新版が再利用する対照を確認したため、通常切替の際はAPI・ワーカーの版と実行中ジョブを照合する。旧月別版はその時点の保存版として扱う。本番配備、Supabase移行、iOSビルドと配布は未実施。残る通常反映の判定は、EmlisAI二欄の本文とプラン境界、用途別重みの採否、統合版での認証付き四機能往復、実端末のPiece画像と通知で行う。

<a id="cmee-bound-emlis-reply-20261122"></a>
## 9.231 発行済みの問いに答えた後のEmlisAI本文（11/22 JST）

### 同じ本人資料からの返事

本人が実際に答えた一問の対象に、元の思考欄にある出来事と、そのときの反応、補足を結び付けて4Bへ渡す。問いの発行ID、回答の原文範囲、同じ場面への一件の追加回答が一致し、既存の読み取りが成立する場合に絞った。行動欄を読み、元の思考や回答と結び付ける記述が見つからない場合は、その欄を返事の生成材料から外す。原入力・安全判定・保存・分析の材料は二欄のまま保持する。別欄に元の場面を指す表現がある場合、回答の意味が未確定の場合、過去の本人資料やフレームがある場合は従来の書き手を使う。今回の修正は既存の応答経路内の生成材料の変更。 [API統合検証版 `4e49dbc`](https://github.com/MassyuRed/mashos-api/commit/4e49dbce95b486da76c994d9f37c296f74feac9a)

稼働中の通常4Bのベースを使い、架空の五例を各三つの送信文で比較した。説明だけの指示では、出来事か補足だけを返す出力が続いた。三点すべてを受け取る指示と、強さを足さない例文を加えた最終版では五件すべてで出来事・否定の強さ・補足が残った。例えば、褒められた場面の返事は「褒められたのに嬉しくなかったんですね。その時は重く感じられていたことも伝わってきました。」。誘われた例の「嬉しくなかった」に「全く」を足さず、先輩に頼まれた例の「全然」と「少し」は保持した。最終版の返事の結びには同じ文型が残る。比較中のモデル提供は前後ともヘルス200で、追加学習・重みの変更は行っていない。

最終版の実応答を隔離DBに再生し、元の例、行動欄だけを替えた対照、誘われた例、先輩に頼まれた例の四件を、発行済みの問いへの回答から本文保存・同版再読まで確認した。行動欄だけを替えた場合は送信内容と返事が一致し、保存・分析にはそれぞれの行動原文が残った。四件とも初回の本文保存を失敗させても、同じ受領本文で再開し、推論を追加せず同じ本文を再読できた。残る二例は4B単体の比較で、隔離DBの既存の発行判断では問いを出さず、初回の本文経路を維持した。以前の形式で受領済みの応答は、保存済みの版と送信内容を使って再開できる。

### 四機能の確認と通常切替

EmlisAI・Piece・DeepInsight・わたしマップv24の関連589件と、実応答再生・問いなし対照6件が通過した。隔離PostgreSQLで、候補移行 `20261122142000` による訂正後の有効回答、旧発行IDに対する回答、利用者ロールの直接呼出し拒否を確認した。通常Render API・ワーカーは `cfeeecf4`、Supabaseは従来の50移行を適用済み。候補移行は未適用。

同じ原文と回答・訂正の組で旧ワーカーがすでに最新マップを保存していると、通常の更新依頼と候補ワーカーの両方が既存の版を再利用する。切替で該当する試験記録があれば、新ワーカーへ揃えた後に既存の強制更新を使い、新しい図・本文・根拠を同レポートIDで再読する。月別版は当時の保存IDで確認する。APIの初回配備と停止時は §9.230 のとおり候補版の `COCOLON_EMLIS_CONTEXT_UPDATE=false` を使う。

隔離PostgreSQLで、通常どおり保存された一回答はPieceの補足として選べた。同じ入力でEmlisの本文保存を失敗させると、同一操作の再試行でEmlis本文は復旧し、Pieceは `PIECE_SOURCE_NOT_ELIGIBLE` を返した。回答・意味更新・4Bの受領には最初の試行IDが残り、本文には復旧の試行IDが付く。PieceのPythonと本番Supabaseのプレビュー発行・見た目変更・保存の三関数はそれらの試行IDの一致を求める。通常反映の残件に、同じ操作での保存失敗と再試行、元の受領本文・回答・原入力の一致を両方で確認して受け入れる修正を加える。別の操作と改変された受領は拒否する。

実4BのFree／Plus／Premiumの履歴とフレームの違い、用途別重みの採否、通常の本人認証での四機能の保存・再読、実端末のPiece画像と通知を残す。通常環境の配備・移行適用・iOSビルド・配布は今回未実施。

<a id="cmee-piece-naturally-recovered-answer-20261122"></a>
## 9.232 Emlis本文の保存再試行をPieceへ渡す（11/22 JST）

自然応答の一回答で、回答、意味更新、提供元への送信と受領、本文保存のための再試行を同じ操作の記録で照合する。受領から本文保存までを順に調べ、保存失敗の試行ごとに正規の再試行があり、最後の試行が保存済みの本文と一致する場合にPieceへ進む。原文、発行済みの問い、本人回答、受領モデルと本文、書き手の版、時点、アクセス権の照合は従来の経路を使う。APIと、Supabaseのプレビュー発行・見た目変更・保存の三関数を合わせた。移行は三関数の自然応答の枝だけをトランザクションで置換する。 [API統合検証版 `c3e895e`](https://github.com/MassyuRed/mashos-api/commit/c3e895e86bf3b408887a3a94246c73cd62251daf)

隔離PostgreSQLで、初回保存、保存失敗1回、連続失敗2回の三通りを実行した。Emlisの回答と受領済み本文を保ったままPieceのプレビュー、見た目変更、保存、同じ保存版の再読を確認した。Piece生成と利用枠消費は各一回。受領本文・書き手のハッシュの改変、失敗記録・再試行キーの欠落、別操作、試行IDの使い回し、別種の開始イベントを三処理すべてで拒否し、作品・利用枠に差が出ないことを確認した。追加の試験24件が通過した。回帰試験ではPiece関連286件、EmlisAI・わたしマップv24・DeepInsight関連404件、DeepInsightの既存候補SQLが通過した。Piece関連286件を開始した後に、開始イベントの照合を追加し、24件を最後の版で再実行した。今回の復旧試験は自然応答の一回答が対象。 §9.231の実4B本文も隔離DBで再生し、追加生成なしで同じ本文に復旧して、元の本人回答をPieceの資料として取得できることを確認した。

同じ架空入力から3プランの送信内容をアプリの経路で組み立て、稼働中のベース4Bで一件ずつ比較した。Freeは当回の「怖かった」を保ち、独立した行動欄を理由に使わなかった。Plus・Premiumは「会議で発表した」と褒められた出来事を結び付け、過去の「重かった」を今回へ重ねた。Plusは追加の問いも本文に含めた。当回・過去・当時の本人訂正を明示する試作ではPlusが当回を保持し、Premiumは過去の訂正を今回の反応の理由として補う点が残った。試作の統合と保存検証は未実施。モデル提供のヘルスは両試験とも前後200。

Renderの通常API・ワーカーは `cfeeecf4`。本番の候補移行 `20261122142000` と `20261122143000` は未適用。切替ではDeepInsight資料とPiece復旧の二移行を順に照合し、§9.230のワーカー先行と候補APIの新方式無効での起動を使う。有料プランの本文、用途別重み、本番本人認証付きの四機能往復、実端末の画像保存と通知が通常切替の残件。iOSビルドと配布は今回未実施。

<a id="cmee-paid-received-answer-context-20261122"></a>
## 9.233 有料プランで今回の回答と過去の記録を照合する（11/22 JST）

### EmlisAI本文と履歴の読み取り

Plus・Premiumで本人履歴またはフレームがあり、発行済みの一問への一回答を、対象の出来事・反応と結び付けて意味を確定できた場合に `bound_field_and_answer_context.v4` を使う。本人が当時の出来事へ追加した回答であること、問いと回答の原文の範囲が一致していることを照合する。§9.231で使った今回の出来事・反応・回答だけを4Bに渡す。今回の場面と独立した行動欄は原入力・安全判定・分析に残る。対象外の回答や訂正は従来の経路で扱い、旧形式で受領済みの本文は記録された方式と送信内容で再試行する。

Plus・Premiumの本人履歴は、保存された記録、利用権、原文範囲、安全判定を通した資料を使う。発行済みの問いが確認した場面と字句・主体・肯否・時点などの読み取りが一致し、両方の原文に戻って照合できた場合、CMEEが共通する原文と過去記録の日付を第二段落で示す。Premiumで本人が過去の解釈を訂正した場合は、既存のフレーム欄に訂正結果を表示する。履歴比較が成立した場合は、提供元から受け取った本文を非公開の `provider_reply_text` に残し、表示する本文を `reply.text` と保存済みの応答に揃える。本文の保存を再試行した場合は、同じ受領記録を使う。 [API統合検証版](https://github.com/MassyuRed/mashos-api/commit/f96c62486832c3784ed913fe3071ebe571434d58)

### 実4Bと隔離DBの確認

§9.232でPlus・Premiumに過去の気持ちが混ざった架空例を、稼働中の `cocolon-qwen35-4b-base-851bf6e` で再試験した。今回の返事へ送る三プランのデータはバイト単位で同一で、SHA-256は `634d14e2e15cbfeaf67442b8f2aa299e133037444d62b676cf20dfce812edf3c`。各一回のHTTP応答は200、提供元のヘルスは試験前後とも200だった。Free 0.88秒、Plus 0.93秒、Premium 0.88秒で、現在の返事の全文は三件とも「褒められた時に嬉しくなかったんですね。その時は怖さを感じていたことも伝わってきました。」だった。独立した行動欄「会議で発表した。」、過去回答「その時は重かった。」、過去フレームの本人訂正「結果だけで判断されたことが気になった。」は今回の返事に含まれなかった。確認した実4Bの応答は同一の架空例に限る。

隔離PostgreSQLでは、Plusで本文保存を一度失敗させ、同じ操作の再試行で、今回の返事と過去の比較を含む同じ本文を保存・再読し、本人が選んだ補足をPieceの資料として取得した。EmlisAIとPieceの関連202件が通過した。新規の3関数試験は通常保存・再試行の正常2件、改変拒否15件を含む。DeepInsight・わたしマップv24・共有資料の回帰は337件と21サブテストが通過した。 Premiumで質問の発行後に別の本人履歴のフレームが初めて訂正されると、初回の返事が回答時とは異なる文脈を持つ。保存された本人の訂正操作、初回に表示されたフレームと明示された根拠、履歴の版、操作順を照合して、初回の返事と提供記録を発行時の文脈で読む。今回の返事と本人回答は回答時の最新文脈で照合する。Pieceが使うのは当回の原入力と、本人が選んだ当回の回答。隔離DBで通常保存と保存失敗後の再試行から、プレビュー・見た目変更・保存・同版再読まで確認した。訂正操作や根拠、初回の受領文脈の改変を三つの書き込み経路で拒否した。 この候補をGitHubの検証ブランチに保存した。直前の版 `c3e895e` のPiece・Analysis CIが両方通過したことを確認した。 [直前のPiece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45003828525) · [直前のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45003828502)

### 通常切替

本番のRender APIとワーカーは `cfeeecf4`。Supabaseは従来の50移行を適用済みで、最新は `20261122015129`。候補の `20261122142000`、`20261122143000`、`20261122144000` は未適用。今回の移行は初回の保存済みフレーム訂正を検証する条件をPieceの三関数へ追加する。通常切替では三移行を順に照合し、本番適用はMashの別承認を得て行う。 §9.230のワーカー先行と、候補APIを `COCOLON_EMLIS_CONTEXT_UPDATE=false` で配備する切替手順を使う。本人認証付きの四機能の往復は、この候補と適用済み移行を揃えた時点で判断する。Pieceの画像保存と通知は実端末での確認が残る。今回の本番配備・iOSビルド・配布は未実施。

<a id="cmee-production-rollout-20261122"></a>
## 9.234 統合版の通常配備と試験専用記録での確認（11/22 JST）

統合版 `f96c624` のPiece・Analysis両CIが通過した。Mashの承認後、DeepInsightの資料抽出、Emlis本文を保存し直した際のPiece連携、過去フレームを訂正した際のPiece連携の順に、本番Supabaseへ適用した。GitHubのSQL版と本番の履歴番号は次のとおり。適用後に各定義のハッシュ一致を確認した。Pieceのプレビュー発行・見た目変更・保存の三関数はいずれも `service_role` のみに実行権限があることを確認した。適用済み履歴は53件。 [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45006405192) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45006405279)

| 対象 | GitHubのSQL版 | 本番の履歴番号 |
| --- | --- | --- |
| DeepInsightの資料抽出 | `20261122142000` | `20261122094043` |
| Emlis本文の保存再試行とPiece | `20261122143000` | `20261122094113` |
| Premiumの過去フレーム訂正とPiece | `20261122144000` | `20261122094142` |

Renderはワーカーを先行配備した。`f96c624` の配備 `dep-dc1bi5ss728c73884j10` が18:43:27 JSTにLiveとなり、18:43:35 JSTにASTORの起動を確認した。APIの配備 `dep-dc1bj46q1p3s73fopimg` は同じ `f96c624` で18:46:01 JSTにLive、18:45:59 JSTに起動完了のログを確認した。 APIは `COCOLON_EMLIS_CONTEXT_UPDATE` が未設定のため、新しいEmlis文脈の扱いを無効の状態で起動した。

Mashの承認を受け、確認メールを送らずに専用のFreeアカウントを1件作成した。通常ログイン後に本人IDを照合し、公開ヘルス200、非公開の架空入力1件（`e831a0f3-e6d5-4479-8586-0760b725159c`）を確認した。

| 機能 | 本番で確認した結果 |
| --- | --- |
| EmlisAI | 問いに回答して本文を確定し、同じスレッドの版・本人回答・本文を再読。回答 `a4029571-6266-45b1-af87-253409bace60`、本文 `daf95629-59b2-4162-88b7-60614a92b4bc`。 |
| Piece | 選択した同じ回答を資料として使い、プレビュー・非公開保存・詳細／書き出しの読み戻しまで200。同じ作品 `9b0c77bf-7f05-df5e-920c-51383a3cc526` の版・本文・内容・描画設定・レンダラーが一致。 |
| DeepInsight | 「仕事・学び」のテーマの問いを生成し、本人回答後に問い `c121ebd0-5aa2-4cde-a9dc-a0594b43e501` の本文・回答を同じIDで再読。 |
| わたしマップv24 | レポート `bcf76a43-cb1c-4fde-90e7-63060c50fdd3` を18:54:19 JSTに保存。最新・詳細から同じID・本文・図を再読し、DeepInsight回答の根拠を確認した。資料2件のうち1件は `analysis_supplement_interpretation_pending`。元入力・本人補足の根拠を取得できず、確認項目は未達となった。 |

 元入力の思考欄と行動欄は正しく保存され、累積資料にも入っていた。EmlisAIの一問への回答は元の出来事への追加として確定し、Pieceもその回答を受け取った。分析では「その時は重かった。」を問いの対象から離して読み、本人補足と原入力をまとめて保留していた。発行済みの問いと本人回答の根拠をv24でも照合する対応が残る。新しいEmlis文脈の有効化、実端末での画像保存と通知受信は未確認。

<a id="cmee-received-answer-map-20261122"></a>
## 9.235 発行済みの問いへの補足をわたしマップv24へ渡す（11/22 JST）

§9.234の本番試験では、元の思考欄・行動欄と補足は正しく保存されていた。EmlisAIが確定した「その時は重かった。」を分析側が単独の文章として読み直すと、元の場面が確定できず、累積資料から元入力ごと保留されていた。

v24は、同じ持ち主と元入力の版、発行済みの問いのID、本人回答のIDと原文を再照合する。思考欄の出来事と反応、別の行動、発行済みの一問に対する当時の補足がそろい、既存の意味更新で一件の追加を証明できる場合に使う。思考欄・行動欄・補足はそれぞれの原文範囲から読み取る。AIの質問文は照合に使う。別欄が同じ場面を指す例や、未確定の文が補足に付く例は引き続き保留する。 [API検証版 `0af967d`](https://github.com/MassyuRed/mashos-api/commit/0af967d3c07cb49f2d52d7ff1ce9cc66ea6b9b1f)

隔離DBに本番試験と同じ思考・行動・一問回答の組を作り、DeepInsightのテーマ回答と合わせた。三段階の生成には試験応答を使い、四つの本人原文・2記録・関係線0本を保存した。最新・詳細・根拠から、同じレポートIDと図・本文・原文を読み戻した。元のコードでは同じ回帰試験でDeepInsight回答だけが残った。Freeの同ケースではEmlisAIの4Bへの送信と保存用の資料が修正前とバイト一致した。 関連試験327件が通過した。

本番API・ワーカーは§9.234の `f96c624`。修正版の本番確認では、保存済みの同じ資料から現在版を明示的に更新し、思考・行動・EmlisAIの補足・DeepInsight回答の原文根拠を同じ新レポートIDから読み戻す。

<a id="cmee-map-v24-independent-action-20261122"></a>
## 9.236 わたしマップv24で思考への補足と独立した行動の配置を修正（11/22 JST）

同じ架空の2記録で `0af967d` を実4Bに通すと、三段階の検査に通り関係線は0本だったが、行動欄の直後にもEmlisAIの補足を表示し、原文にない「発表後に受けた評価」を記述した。続く `d1f39f3` は四つの原文を一度ずつ選んだものの、行動を思考・補足と同じ節点の別単位に置いたため、APIはPLAN段階で拒否した。NODESとRELATIONSは呼ばなかった。

`1070072` は発行済みの問いが指す思考欄の範囲を持ち、四つの原文が一度ずつ選ばれ、行動が別単位で保持された計画は、本文生成に入る前に出典に沿って三節点へ割り当てる。受領した生PLANは検証証跡に残る。補足の重複、行動と補足の同一単位への割り当て、原文にない時系列を含む本文・概要は回帰試験で拒否され、隔離DBでは保存した同じ版の図・本文・各節点の根拠を読み戻した。 [API候補 `1070072`](https://github.com/MassyuRed/mashos-api/commit/107007284750fdadcf3e69d568554ec49b7e62fa)

同じ資料で候補版を実4Bへ各段階一度実行し、PLAN 11.054秒、NODES 22.607秒、RELATIONS 7.456秒で通過した。元の思考と本人補足一回、DeepInsight回答二文、独立した行動を三節点で表示し、記録2件・除外0件・未解析0件・関係線0本を照合した。質問文は回答を読むための背景にだけ使われた。DeepInsightの本文は条件付き判断を保ち、4Bの内部分類値は `RECORDED` だった。実4Bの受領記録のSHA-256は `498006c2904c9cc916d947abd2c1f84b453514dd51f9da5ce269ccabaee41599`。

`1070072` はAnalysisとPieceの両CIに合格した。Renderのワーカーは20:09、APIは20:11 JSTに同じSHAで稼働し、ワーカーのMap購読とAPIの `/healthz` HTTP 200を確認した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45014151602) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45014151615) · [ワーカーの配備](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1cqerl550s73e4vsd0) · [APIの配備](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1cr656e07s73d11sm0)

20:13 JSTに既存の専用試験アカウントから通常更新を一度受け付け、20:15に新レポート `4f883651-2d69-418a-afbb-8810ceae8e88` を最新と詳細の両方から同じID・図・本文で読み戻した。投入2、処理2、表示2、除外0、未解析0、関係線0。三節点の根拠は思考とEmlisAI補足一回、DeepInsight回答二文、独立した行動で、記録にない時系列は表示されなかった。旧版は履歴で読めた。 有料版EmlisAIの文脈更新は本番で無効。実端末での画像保存と通知受信は未確認。 [更新後のCocolon契約検査](https://github.com/MassyuRed/Cocolon/actions/runs/45014549068/job/137183942304)

<a id="cmee-effective-corrections-and-frame-feedback-20261122"></a>
## 9.237 EmlisAIの本人訂正と判断をPiece・DeepInsightへ渡す（11/22 JST）

通常の `1070072` と、全体設計・ファイル地図・第12回議事録§11.24〜34を起点とした。現在の本番APIとワーカーは同じ版で、わたしマップv24の最新保存にDeepInsightの本人回答二文と独立した行動の根拠があることをRenderとSupabaseで確認した。以下の [統合検証版 `3ec02f1`](https://github.com/MassyuRed/mashos-api/commit/3ec02f1f882165b21bc932c336bd70b8fc7e96ce) はこの稼働版から進めた。

| 経路 | 修正と確認 |
|---|---|
| EmlisAI → Piece | Premiumで過去のフレームに初めて「この理解で合っています」「この理解は使わない」を選び、次に当回の問いに答えると、Pieceがその回答を使えなかった。既存の訂正に加え、確定・不使用も当該本人の操作、対象版、保存済み応答の順序と照合する。プレビュー、見た目変更、保存の各SQLで同じ判断を検証し、当回の回答だけが作品に届く。隔離PostgreSQLで初回保存・保存再試行に通し、利用枠は一度、同じ作品を再読した。 |
| EmlisAI → DeepInsight・わたしマップv24 | v24が使える本人の有効な訂正がDeepInsightの資料から落ちていた。現在のCMEE資料に残る、本人の訂正の置換部分を元の範囲付きで渡す。既存の独立した回答は引き継ぎ、古い表現と元の問いの前提を取り除いたまま発行する。発行時に本人・資料の版・引用位置をDBでも再照合し、合成モデル応答を使う隔離DBで同じ発行ID・回答・根拠を再読した。 |

稼働中の共有4Bに、統合検証版の出題処理と架空の訂正一件を通した。計画・文章化・独立照合の3呼び出し、合計6.865秒で`「私は不安だった」と書いていましたが、不安だったのは、どんな理由からですか？` を採用した。訂正の根拠は原文の `[15,22)`。訂正前の文と以前の問いはモデルに送らず、残っている会議への回答は不安の理由として使われなかった。この実4B試験は本番DBへの発行前まで。現在のPremiumの出題資格は隔離DBで補って確認した。

現行のワーカーから稼働中の共有4Bへ、§9.233と同じ架空のPlus・Premium送信各1件を確認した。両方で「褒められた時に嬉しくなかったんですね。その時は怖さを感じていたことも伝わってきました。」を得た。当回の怖さが残り、過去の「重かった」と独立した行動は本文に入らなかった。Plus・Premiumの本番保存では文脈更新が無効のため、本試験はモデルの返事まで。全プランの新規スレッドへ影響するスイッチの有効化には、初回・訂正も含めた比較が残る。隔離DBを含む統合候補の回帰719件（契約119件を含む）と、Pieceの履歴・画像書き出しのアプリ試験482件が通過した。依存不足で最初に未実行だったv24の3件は、必要な依存を持つ実行環境で成功した。Pieceの既存4B原本を使った長段落・思考／行動二欄の再生と長文処理の回帰も80件通過した。 端末での写真保存・通知着信は未確認。

変更したAPIの既存箇所は、DeepInsightの `deep_insight_question.py`、Pieceの `piece_v2_source_adapter.py`、関連回帰と既存両CI。追加したファイルは移行 `20261122145000_deep_insight_effective_emlis_corrections.sql` と `20261122145100_piece_natural_initial_frame_feedback.sql` の2件。Cocolonのファイル数は5,969、APIの候補は2,767。適用前の本番Supabaseで、両移行の対象5関数がサーバー専用で、Pieceの三関数に前版の判定があることを確認した。

統合検証版のGitHub ActionsでAnalysisとPieceが通過した。アプリ側の契約検査も通過した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45021562285) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45021562310) · [Phase 6](https://github.com/MassyuRed/Cocolon/actions/runs/45021801164)

本番の反映は[§9.238](#cmee-production-frame-feedback-corrections-20261122)を参照。切り替えはPieceの移行、Render両サービスの配備、DeepInsightの移行の順で行った。

<a id="cmee-production-frame-feedback-corrections-20261122"></a>
## 9.238 本人判断と訂正の本番配備（11/22 JST）

Mashの承認を受け、Pieceの移行を先に適用した。Renderワーカーは 21:55:50、APIは 21:57:27 に `3ec02f1` で稼働した。両サービスのSHAを確認してからDeepInsightの移行を適用した。 [ワーカーの配備](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1ec4ijnfac738hq31g) · [APIの配備](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1ecomtlv9c73bsjgog) · [稼働版](https://github.com/MassyuRed/mashos-api/commit/3ec02f1f882165b21bc932c336bd70b8fc7e96ce)

| 本番に適用した内容 | GitHubのSQL版 | Supabaseの履歴番号 |
|---|---|---|
| 過去の解釈に対する初回判断後も、当回の回答をPieceへ渡す | `20261122145100` | `20261122125313` |
| CMEEが確定した本人訂正の範囲をDeepInsightの材料と発行へ渡す | `20261122145000` | `20261122125756` |

対象5関数が新定義を持ち、実行は引き続きサーバー専用であることを確認した。APIヘルスはHTTP 200、未認証の `/deep-insight` は401、旧「今日の問い」は404。ワーカーはわたしマップ更新、DeepInsightの判定、通知を処理対象として起動した。

既存の架空試験アカウントで、Emlisの応答・回答、Pieceの履歴・詳細・書き出し用データ、DeepInsightの問い・回答、わたしマップの図・本文・三節点の原文根拠を、同じ保存IDと版で読み戻した。Pieceは書き出し用の本文・描画設定とハッシュも一致した。新しい非公開の架空記録1件では、現行設定のEmlisは質問を出さず初回応答を確定した。既存の本人訂正から「つらかったんです」を「私は不安だった」へ一度訂正し、リビジョン8の同じ表示本文を認証付きで読み戻した。共有材料では原文範囲を照合できても、訂正対象を本人の確定済みの感情として束縛できず、`analysis_correction_target_unresolved` で保留となった。同じ短文と訂正文は隔離した原文処理でも再現した。DeepInsightの本番資料から訂正前の文言は除外された。今回の短文の訂正後の出題・回答の保存と、過去フレームを初めて判断した後にPieceを新規保存するPremiumの本番確認は残る。

追試では質問なしの開始から直接訂正・同じ本文の再読・DeepInsight候補0件まで、隔離DB上の通常APIとSQLで再現した。先行25件と、発行済みの問いへの回答を使うハンドオフ1件も通過した。訂正前の短文は原文範囲を一つに絞れたが、分析が本人の感情として扱う型付きの文は生成されなかった。訂正後の「私は不安だった」は明示された本人の過去の感情として扱える。次の候補は、初回質問で使う短い感情記述の判定を、原文全体と訂正対象が一致する新規の本人訂正に適用する。訂正前の文は除外する範囲の指定に留める。保存済みの保留結果は当時の判定で再読する必要があるため、新しい判定を使った訂正には保存時にその判定を紐付ける。

<a id="cmee-paid-only-context-20261122"></a>
## 9.239 Plus・Premiumに限ってEmlisの文脈を更新する候補（11/22 JST）

`COCOLON_EMLIS_CONTEXT_UPDATE=paid` を追加し、サーバー側で確認したPlus・Premiumの新規スレッドに絞って開始時に設定を記録する。Freeはこれまでの出題と本文生成を使う。従来の `true` は全プラン、未設定と `false` は無効。既に出した問い、受領済み本文、再試行には開始時の設定を使う。DBの移行は不要。隔離DBで関連139件が通り、新規のプラン境界、設定を無効に戻した後の回答、保存に失敗した本文の非再生成再読、Pieceへの接続を確認した。候補の同一版で、この139件を含む横断回帰766件と両CIが通過した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45025454921) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45025454861) · [有料文脈の候補](https://github.com/MassyuRed/mashos-api/commit/4829e9255a076fd5673e0449513f94b4c7e660b6)

今回の架空例は「頼まれたのに、嬉しくなかった。」への回答「その時は怖かった。」。現行ワーカーから、候補が組んだPlus用の送信を共有4Bへ1回渡した。受領本文は「頼まれたのに嬉しくなかったんですね。その時は怖かったことも伝わってきました。」だった。過去の「重かった」と別の行動欄の返却は混ざらなかった。隔離DBでは適格な過去記録が別段落となり、Freeでは候補を選んでも有料文脈が付かないことを確認した。有料文脈の本番有効化と有料試験アカウントでの一往復、実機の画像保存と通知着信は未確認。議事録§11.6の試験アカウントは当時のPlus試験後にFreeへ戻している。今回使用できる有料試験アカウントは前提資料で確認できなかった。

<a id="cmee-piece-long-fields-real-4b-20261122"></a>
## 9.240 Pieceの思考・行動・選んだ補足を通常4Bで確認（11/22 JST）

隔離DBで架空の思考59字・行動35字を保存し、Emlisの発行した問いに「その時は重かった。」と答えた。本人がこの回答を選んだ状態から、通常のPieceの指示を共有4Bへ1回送った。18.589秒、HTTP 200、正常終了。モデルの三欄は原文どおりで、誰に何を頼まなかったか、説明前にメモを見返したいこと、考えを整理する時間を大切にしたいことが残った。現行の文章化は欄内の重複した主語を2箇所省いた。受領本文を改変せず、現行SQLでプレビュー・見た目変更・非公開保存・同じ操作の再試行・詳細再読まで通過した。利用枠の消費は1回、本文と描画設定のハッシュは一致した。

本人が答えたのは思考欄の「褒められた」についての問いだった。完成したPieceでは補足が行動欄の後ろに出るため、「その時」が直前に記された旅程の相談や資料確認の話を指すように読める。文章品質はこの実生成では保留。続く候補は[§9.241](#cmee-piece-keep-original-feeling-reference-20261122)に記録した。通常提供の4Bは共有ベース。保存済みの追加重みは本番未採用。

<a id="cmee-piece-keep-original-feeling-reference-20261122"></a>
## 9.241 Pieceの補足を元の思考欄の出来事に結び付ける候補（11/22 JST）

本人が選んだ回答の問いと、確定済みの回答による意味の追加を照合した。元の思考欄に出来事の原文範囲が一つだけあり、回答自身が同じ出来事を指していると確定できた場合に、完成本文の補足だけを「褒められた時は重かった。」とした。モデルの生応答は従来の検査を通す。同じ出来事の語句が行動欄にもある場合は、元の補足を保持する。思考・行動・補足の欄順、公開する原文識別子とDBの定義は変更しない。候補は有料文脈更新の `4829e92` を含む。 [Piece修正候補](https://github.com/MassyuRed/mashos-api/commit/ac17a35b98ca86a0cb75ddc9c1c7ebad7502fdfd)

§9.240で受領した587バイトの実4B応答をそのまま隔離環境で再演し、前二欄・順序を保持した状態で見た目を変更し、非公開保存・同じ操作キーでの再試行・同じ保存IDと版の詳細再読を確認した。利用枠の消費は1回。旧プレビューも本文を保持したまま見た目の変更・保存・再試行・同じ版の再読を通過した。関連試験440件に加え、最終差分で新旧プレビュー・別欄に同じ語句があるケース・実応答再演の4件を確認した。候補での新規実生成とPremiumの本番確認は残る。新しいDB移行は不要。

<a id="cmee-direct-feeling-correction-20261122"></a>
## 9.242 質問を出さず閉じた短文への本人訂正（11/22 JST）

本番API・ワーカーは 3ec02f1 で稼働し、Supabaseには§9.238の2移行が適用済み。対象の書き込み・共有材料の関数は、未認証とアプリの認証ロールのどちらからも直接呼べず、サーバーに実行権限があることを再確認した。前回の統合候補 ac17a35 はAnalysis・Pieceの両CIを通過した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45027651971) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45027651950)

新しいAPI候補は、発行済みの問いがない最初の本人訂正で、思考欄の短い感情記述の全文・返事内の唯一の対象・本人が訂正文で示した旧引用が一致する場合を扱う。行動欄は空。元の文は除外範囲として用い、新しい本人の感情を裏付ける範囲が一つに決まるときだけ置換文を共有する。保存した訂正操作に判定の版を紐付け、保管済みの保留結果は以前の判定で読み戻す。既存のEmlis・Pieceの原文識別子と、訂正を利用できる作品の範囲を維持する。新しいDB移行はない。 [API候補 04eb54b](https://github.com/MassyuRed/mashos-api/commit/04eb54b90bdb15fc9f23d5f903eeb0a6568d562a)

隔離DBで「つらかったんです」から「私は不安だった」へ、文脈更新OFF・質問0件で訂正した。Emlisの本文保存を一度失敗させ、受領済み応答で再試行した。わたしマップv24へ渡る原文範囲と、DeepInsightが発行・回答・同じ問いを再読した根拠は、訂正文の同じ文字範囲だった。以前の保留結果と、他者・曖昧な対象を共有しない対照を検査した。 関連するEmlis・v24・DeepInsightの333件と、Piece・保存の237件と15サブテストを確認した。この試験の生成応答は固定の対照を使った。本番発行とv24の新しい実生成は残る。 [新候補のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45029845252) · [新候補のPiece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45029845267)

<a id="cmee-premium-piece-and-adapter-readiness-20261122"></a>
## 9.243 PremiumからPieceへの往復と用途別重みの確認（11/22 JST）

候補 ac17a35 を、有料版だけの文脈更新を選んだ通常APIの設定と隔離DBで動かした。Premiumで過去の解釈に初めて「この理解で合っています」「この理解は使わない」とした2件それぞれで、当回の回答だけを使い、補足の参照先を元の思考欄の出来事に戻した。見た目変更・非公開保存・同じ操作の再試行・同じ版の再読を確認し、利用枠は各1回だった。架空の別例では、思考54字・行動38字・選択した補足10字の送信を1件分固定し、未送信のまま保存した。送信JSONは13,763バイト、SHA-256 df087d5009d61703d17eba668ff72ec876f4ca6700816032b44539eb9e898a1f。隔離対照の描画入力はプレビュー・保存詳細・書き出しで一致し、他人の書き出しは404だった。関連アプリ726件とAPI書き出し15件が通過。実4Bの新しい作品、iOS実描画と写真保存は残る。

EmlisAIの重み 10b56315（16件・32更新）とPieceの重み 344a9def（48件・96更新）は、保存済みZIPの重み・設定のSHA-256と各112テンソルを再照合した。固定のベースはQwen3.5-4Bの 851bf6e。既存の提供コードにはPieceの用途別切替と復元があり、EmlisAIを専用LoRAへ振り分ける分岐がない。候補の最小差分は、Emlis専用のモデル名と重みのハッシュを既存の共有サーバーで照合し、Emlisの専用接続設定からだけ選ぶ方式。DeepInsightは既存の共有ベース、Piece・v24・IFは各用途の選択と復元を通す。提供設定は今回変更していない。採否は通常指示を使った同じ実GPU上の対照と、保存・再読の結果で判断する。 [先行比較と採用条件](#cmee-four-feature-normal-adoption-20261122)

<a id="cmee-paid-production-and-real-piece-20261122"></a>
## 9.244 有料文脈の本番配備とPieceの実4B検証（11/22 JST）

Mashの承認を受けて、Analysis・Pieceの両CIが成功した 04eb54b を両サービスに固定配備した。追加のDB移行はない。ワーカーは23:19:34 JSTにLive、23:19:37にASTORの起動を確認。APIでは有料文脈を有効にする既存設定の値 paid を保存し、同じSHAの配備が23:22:08 JSTにLiveとなった。公開ヘルスチェックはHTTP 200。 [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1fjhifngtc73fh6g50) · [API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1fk9nf3r2c73cjelbg) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45029845252) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45029845267)

専用の架空アカウント一件をFreeから一時Premiumに変更し、非公開入力を2件保存した。新しいEmlisスレッドの開始資格がPremiumで、文脈更新が有効なことをサーバーの保存値で確認した。配信先端末は0、テーマ通知はOFF。試験後に同じアカウントをFreeへ復元し、APIとSupabaseの両方で再読した。公開入力は0件だった。

| 試験した経路 | 本番で確認できた段階 |
|---|---|
| 短文の本人訂正からDeepInsightとv24へ | 個別の問いをOFFにした短文の記録保存は成功。23:24:28の4B呼び出し開始から約8.373秒で natural_reply_unavailable。受領は0、初回本文と訂正は未保存。訂正文を使う出題とその回答には進んでいない。 |
| 有料のEmlisAIからPieceへ | 初回の本文と問い、過去フレームへの初回確定、当回の回答は保存できた。23:25:12の回答後の呼び出しから約8.675秒で natural_reply_unavailable。今回の回答への本文の受領は0。本番Pieceの作成には進んでいない。思考欄に独立した一文を含むため、四つの材料を分ける新しい有料本文が成立する最小条件の対照にはならなかった。 |
| わたしマップv24 | 新しい訂正範囲を使う手動更新は行っていない。 入力から自動で起動したわたしマップの2ジョブは各8回で失敗終了し、新規レポートは0件だった。 |

Emlisの失敗は呼び出し済みで、採用前のHTTP契約・本文・取得失敗を記録上の同じコードにまとめる。原本を保存していないため、失敗の内訳は確定できなかった。新しい要求を送り直していない。わたしマップの自動処理はワーカーがモデルHTTP 200を受けた後に analysis_model_source_unavailable を記録した。採用した本文と図の新規保存は0件だった。

§9.243で固定した13,763バイトの別入力を、既存の共有ベース cocolon-qwen35-4b-base-851bf6e に一度送った。HTTP 200、9.161秒、stop、受領584バイト。受領のSHA-256は 814b4a938c6dd207a89437cf263d4697611fc3ec2ce95a74d2dd5601ee2a8811。4Bの生応答は三欄とも原文どおり。CMEEの文章化で主語の重複を2箇所省き、補足を「誘われた時は寂しかった。」と示した。嬉しくなかったこと、二つの希望、友人への相談、同僚への依頼をしなかったことを保持した。相談と補足の因果は加えなかった。

同一の生応答を 04eb54b の隔離DBで再演し、見た目を変更した最終プレビュー、非公開保存、同じ操作キーでの再試行、同じ作品の行版3、認証付き詳細と書き出しを確認した。利用枠は1、別人の書き出しは404。iOS v2・4:5の描画入力がプレビュー・保存詳細・書き出しで一致した。今回の4Bによる文章編集差分は0。iOSの実PNG、実機写真保存・通知は未確認。証跡は Cocolon_CMEE_Piece_Real4B_Result_20261122.zip に保持した。

<a id="cmee-normal-path-failure-diagnostics-20261123"></a>
## 9.245 EmlisAIとわたしマップの通常経路で失敗した段階の記録（11/23 JST）

前回の本番API・ワーカー `04eb54b` を起点に、Renderの実ログとSupabaseの保存値を照合した。短文初回は呼び出し1・受領0、有料入力の初回は呼び出し1・受領1、回答後は呼び出し1・受領0。本番試験の本人記録2件は非公開。新規のPiece保存・DeepInsight出題・わたしマップ保存は0件だった。試験アカウントはFreeに復元済み。

自動更新の `myprofile_latest_refresh_v1` と `analyze_self_structure_standard_v1` はそれぞれ8回で失敗終了した。同時間帯のワーカーには、保存済みEmlis材料と再導出した材料の不一致による422、および4BのHTTP 200後にv24の最初の計画を取得する段階で503になった試行があった。前者はAPIの資料検査で止まり、後者は計画の後続段階とレポートの保存に進まなかった。従来のログでは、後者が応答の形式と計画内容のどの条件で止まったかは特定できなかった。

API候補 `f52a248` は、EmlisAIの既存HTTP取得で接続・HTTP状態・応答形式・生成終了・本文検査を区別する。わたしマップの既存取得ではPLAN、NODES、RELATIONS、最終組み立てと、応答の読み取り・形式・段階別の採用検査・進捗記録を区別する。本文・原入力・出典ID・エンドポイント・認証情報はログに含めない。公開エラー・拒否・再試行・受領と保存の順序を維持する。PieceやDeepInsightの生成・通知・権利の設定変更はない。

合成HTTPで、異常な終了理由の文字列と拒否したPLANの本文がログに出ず、取得を繰り返さないことを確認した。EmlisAI、v24、DeepInsightとPieceの引き渡し・保存・再読を含む隔離試験317件が通過した。 [API候補](https://github.com/MassyuRed/mashos-api/commit/f52a248e845c5b9677dd63334fa125a28ab6a733) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45035406873) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45035406947)

**隔離DBで再現した2件の修正。** `287f199` では、「褒められたのに、嬉しくなかった。」と独立した行動欄の「私は友人に旅程を相談しました。」を保存したときの `KeyError('concrete_effort')` を修正した。既存の根拠から保持を確定した行動は、その根拠と役割を合わせてEmlisAIへ渡す。修正後は4Bを模した提供口に一回到達し、両欄の原文と保存した初回応答を再読した。

わたしマップでは、Premiumの保存時に有効だった権利を新しい資料に記録する。権利記録を持たない旧版のうち、履歴もフレームもない資料は、以前のプランで全文・根拠・版を再導出して完全一致するときだけ旧派生資料を除き、現在有効な本人原文を続けて扱う。別プランの旧資料を利用せず、改変した資料は従来どおり拒否する。Free復元後の新旧資料と改変対照、EmlisAI・Piece・DeepInsight・v24の関連433件が通過した。2件とも隔離環境での再現・修正であり、11/22本番の個々の試行との一致は未確定。 [API修正候補](https://github.com/MassyuRed/mashos-api/commit/287f1998c5ae1d1ece187ce5b370858a2ff9bdb3)

<a id="cmee-production-reply-and-multi-map-20261123"></a>
## 9.246 EmlisAIの本番再試験と、複数の補足を含むv24の計画（11/23 JST）

Mashの承認後、両CIが通過した `f52a248` を配備。ワーカーは00:26:47、APIは00:27:29にLiveとなり、APIヘルスはHTTP 200だった。今回の配備にDB移行は含まれない。 [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1gj12fngtc73fjrlog) · [API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1gj1eq1p3s7385kpu0)

専用の架空アカウントを一時Premiumに切り替え、非公開の短文と、単一の場面に絞った有料文脈を各1件試験した。短文初回は4B受領1件、8.343秒。Premium初回は受領1件、16.635秒で問いを発行し、同じ問いIDへの回答後は受領1件、1.720秒で確定した。保存本文、モデル、入力と文脈の識別子を同じ受領と照合した。Premiumの文脈を使い、当回の怖さは本文の最初の段落、過去履歴は別段落に保存した。独立した行動を当回の気持ちの根拠に加えなかった。試験後、同じアカウントのFree復元を確認した。

わたしマップの自動更新は、Premium中に保存資料の422を記録した。Free復元後は4BのHTTP 200からPLANの `analysis_semantic_plan_received_answer_scope_invalid` で停止。最新マップ更新は00:39:44、標準分析は00:41:02に各8回で失敗終了し、新規レポート・通知予約は0件だった。最新時点の本人資料を隔離環境で再生すると、通常の一括更新に収まる5記録・9欄で、思考と本人補足を結び付ける組が2件あった。既存の一組用の配置指定はこの資料に適用されなかった。

短く全文を引用できるv24の一括PLANに限り、既存の配置指定で複数の本人補足を扱う候補を作った。元の記録順に最初の項目を確保し、各思考とその記録の補足をそれぞれ同じ項目の別unitへ配置し、二つの独立した行動を別項目に置く。再生した5記録は、提案した7項目の計画が既存の出典・割り当て検査を通過した。文章化と関係の採否は既存の検査へ渡す。実4Bによる候補の採用・図と本文の新規保存、Piece・DeepInsightの本番往復と端末確認は残る。

この差分を `287f199` の2修正と合わせて `7124250` に保存した。隔離DBでは本人が別々に答えた2件の思考・補足を結び、各行動を分ける計画を通常の採用検査へ通した。答えを別の思考へ付け替えた対照は拒否された。関連121件が通過し、AnalysisとPieceのCIを開始した。 [統合候補](https://github.com/MassyuRed/mashos-api/commit/7124250d23b1d1941a9ec9abe71d5683c4a69360) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45039513583) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45039513515)

<a id="cmee-production-followthrough-20261123"></a>
## 9.247 わたしマップの項目生成とPiece・短文訂正の本番確認（11/23 JST）

候補 `7124250` のPiece CIは成功した。Analysis CIでは、独立行動の保持修正に伴い共有言語オーナーの識別値が変わり、既存の検証用スナップショットだけが旧値だった。変更対象のASTから識別値を再計算して6行を更新した。過去の確定スナップショットはそのまま使用し、`b8ffce7` のAnalysis CIは成功した。 [最初のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45039513583) · [検証値更新後](https://github.com/MassyuRed/mashos-api/actions/runs/45064489045) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45039513515)

同じ架空資料を最終コンパイルまで再生し、別日に記録された同文の行動2件が重複検査で止まることを確認した。本人補足が対応する思考と同じ記録に属する場合、その記録の日時を既存の項目の日付表示に渡した。原文と根拠の割り当てを保ち、既存の検査で5記録・7項目を組み立てた。関連7テストと最終版 `2c589ae` のAnalysis CIが成功した。Piece CIの対象処理と検証手順は、成功済みの `7124250` と同じ。 [配備版](https://github.com/MassyuRed/mashos-api/commit/2c589aeceed09f057f142738692ed435002f5fa2) · [最終版のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45065615593)

Mashの承認を受けて同版を固定配備し、11/23 05:42:54 JSTにワーカー、05:43:30 JSTにAPIがLiveとなった。APIのヘルスはHTTP 200。今回の配備にDB移行は含まれない。 [API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1l754s728c73co5phg) · [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1l75d9fdbs73b5mc3g)

架空の専用アカウントから05:44:42 JSTに、わたしマップv24の通常の更新を1件受け付けた。8回の自動試行はすべてPLANを通過した。NODESの4B応答はHTTP 200で、項目の採用検査 `analysis_semantic_node_received_answer_scope_invalid` で停止した。06:02:41 JSTにジョブは失敗終了し、新しいレポートと完了通知予約は各0件だった。

同じアカウントを一時Premiumに変更し、回答済みのEmlisスレッドから通常のPieceを1件作成した。プレビューは23.688秒、非公開保存は2.095秒でともにHTTP 200。保存版 `0609f55b-ca2b-dd20-f914-191be84ddc55` の版2を、同じ本人の詳細と書き出しから再読した。思考・独立した行動・思考に対応する補足の3段落、本文・描画レシピのハッシュ、4:5・iOS renderer版が一致した。本人用識別子が非公開行にも付くことを試験の初回判定が考慮していなかった。同じ保存物を再読し、非公開状態と保存枠1件をDBでも確認した。実機での画像表示・画像保存は残る。

短文の本人訂正 `acd340d5-86f9-4c3e-bb0f-60ba699183fb` は、対象の引用と本人の訂正を一度保存した。訂正APIは13.111秒でHTTP 200。4BもHTTP 200を返したが、Emlisの `reply_validation` で本文を採用できず、受領記録は0件、スレッドは版7の `RESPONSE_FAILED`、分析資料は `NOT_GENERATED`。検査の個別理由は既存ログから特定できない。DeepInsightの資料取得条件では、同じ訂正操作に対応する確定本文と解決済み資料が必要で、該当資料は0件だった。問いの発行・回答は各0件。アカウントのFree復元を通常APIとDBで確認した。

NODESでは、本人補足を複数含む資料にも、採用済みPLANの該当項目ごとに原文から選べる見出しと空欄にする意味記述の指定を渡す修正を `05044d4` に追加した。項目の採用条件は維持した。短文の訂正保存により、次回のわたしマップの資料には本人の訂正文が既に入る。最新候補 `c640b8c` では、本人と元記録との対応が既存の検査で確定し、原文を全文引用できる短い訂正に限り、独立した項目へ割り当てる。訂正前後の架空資料はそれぞれPLAN・NODES・RELATIONSの隔離再生で5記録、7項目、関係線0件を組み立てた。訂正後の項目には本人の訂正文が入り、置き換えた文はその項目に含まれなかった。関連39件のテストが成功。最終候補の両CIと実4Bによる新規保存は確認中で、本番稼働は `2c589ae`。 [最新候補](https://github.com/MassyuRed/mashos-api/commit/c640b8c157fab880e9a4fe5a2922a623d7b05b22)

短文訂正の次作業は、本人の訂正を保存し直さず、返答本文の検査で止まる具体的な理由と既存の復旧条件を確認する。現行の復旧が再利用する受領済みの生成結果は今回残っていない。DeepInsightの同一訂正操作と確定資料の検査を保ったまま、訂正後の応答から発行・回答・同じ問いIDの再読まで確認する。端末の画像、通知受信、補助経路全体の受入れは未確認。

<a id="cmee-v24-live-plan-and-correction-writer-20261123"></a>
## 9.248 訂正済みの資料を使ったv24の本番計画検査とEmlisの訂正後本文（11/23 JST）

Mashの承認を受け、AnalysisとPieceの両CIを通過した `c640b8c` を固定配備した。ワーカーは06:37:53 JST、APIは06:38:31 JSTに同じSHAでLiveとなり、APIのヘルスはHTTP 200。 [本番API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1m0uhksfps7399efkg) · [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1m0uutlv9c73cfegm0) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45070501462) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45070501456)

同じ架空アカウントをFreeのまま使い、保存済みの短文訂正を保持した資料で、わたしマップv24の通常更新1件を06:43:52 JSTに受け付けた。全8回の自動試行で4BのHTTP 200を受け、PLANの採用検査 `analysis_semantic_plan_received_answer_scope_invalid` で終了した。06:53:57 JSTに失敗が確定し、最新レポートと完了通知予約は各0件。前回 `2c589ae` は短文訂正の保存前に更新を受け付け、PLANの後のNODESで停止した。今回は項目・関係の生成と新規保存に進まなかった。DeepInsightの新規発行と回答は各0件。 [配備版](https://github.com/MassyuRed/mashos-api/commit/c640b8c157fab880e9a4fe5a2922a623d7b05b22)

同じ資料の隔離再生では、5記録・9欄の一括PLANに本人補足2組と有効な短文訂正1件が入り、既存の指示に送った7項目の配置例は、提供側の形式検査とAPIの採用検査をどちらも通過した。思考と補足を一つのunitにまとめる対照や、独立した行動を落とす対照は、提供側の形式検査を通過し、APIで今回と同じ理由により拒否された。失敗した本番応答の原文は保存されないため、配置違いの内訳は特定できない。

EmlisAIの前回の本番訂正は、本人の訂正文と当回・過去の文脈を持つ既存の初回用指示で4Bに届き、本文の検査で停止した。受領が残っている場合に同じ応答を再利用する既存の復旧条件は満たしていない。候補 `2d748b2` は、問いへの回答が0件で、元の短い感情の文全体を置き換えた有効な本人訂正が1件に確定した場合に、訂正後の言葉を中心に短く返す指示を使う。利用可能な過去の原文と本人の判断も受け渡し、今回の感情や時点と区別する。以前の受領は保存時の指示・識別値で復旧する。今回の候補は、返答を拒否した固定の検査理由を本文なしでログに記録する。 [Emlis候補](https://github.com/MassyuRed/mashos-api/commit/2d748b2ee61df4108b44eec6f5ff706bccdf2559)

合成応答を使った隔離DBで、本人訂正、訂正後本文と根拠の保存・再読、受領後の再開、同じ訂正範囲を根拠にするDeepInsightの発行・回答と同じIDの再読を確認した。関連196件が通過した。 [Emlis候補のAnalysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45073855432)は実行中。[Emlis候補のPiece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45073855425)は実行中。 Emlis候補の本番での実4B応答からDeepInsightへの往復と、複数補足を伴うv24の新規保存は未確認。

通知画像の失敗はCocolonの `phase6-contract-guards / contract-guards`。API mainの既存修正 `375f86a` で変更後の問いとPieceの契約を検査側が参照し、最新の実行で119件が通過した。 [修正済みの検査](https://github.com/MassyuRed/mashos-api/commit/375f86a1fa05b9a56918b4d849d67eefa29c006d) · [通過した実行](https://github.com/MassyuRed/Cocolon/actions/runs/45070632498)

統合候補 `6c26351` は、短い原文の一括v24で本人補足が複数あり、APIが配置案を既存の採用検査で確認できた場合に、配置を4B提供側の生成制約へ渡す。思考・対応する補足・独立した行動・有効な訂正の配置と原文の対応を保つ。他の記録では同じ欄の引用候補を4Bが選ぶ。PLAN・NODES・RELATIONSの受領と採用検査は別々に行う。固定の提供パーサーと隔離DBを用いた関連254件、共有言語オーナーの検査1件を確認した。従来の提供コードでも新しい資料を受け取れることを隔離再生で確認した。統合候補を通常運用で確認するには、両CIを照合し、RenderのAPI・ワーカーとGPUの提供コードを同じ候補に揃える必要がある。候補の配備と実4Bの再試験は未実施。 [統合候補](https://github.com/MassyuRed/mashos-api/commit/6c26351b594cf1cdd4b6e5750b44f7df3a935053)

Pieceの非公開保存・同版の詳細と書き出しは§9.247の本番結果を引き継ぐ。EmlisAI・Pieceの用途別重みは比較採用と通常提供への反映、端末の画像保存と通知受信は実機確認を残す。

### 11/23 JSTの統合候補・稼働照合

`6c26351` のAnalysisとPieceの両CIが成功した。固定した同候補で、EmlisAIの短文訂正・DeepInsightの発行と回答の同一ID再読、わたしマップv24の採用・保存、Pieceの提供側制約を含む隔離回帰439件、Jupyter経由の提供接続15件が通過した。本番DBでは試験アカウントがFree、前回の更新が8回で終端し、その試行による新規レポート・完了通知予約が各0件であることを再確認した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45075069522) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45075069533)

稼働中のRunpodでは既存4BのヘルスがHTTP 200。公開GitHubの同候補と照合し、更新対象を `ai/tools/serve_emlis_natural_reply.py` と `ai/services/ai_inference/analysis_plan_source_choices.py` に確定した。後者は提供側に残っていた旧版の原文選択処理で、同じ記録の日付対応を揃えるため提供コードと同時更新する。既存の起動条件・ベースモデル・わたしマップ用とIF用の重みを使う。候補の本番配備と、新しい実4Bの往復結果は引き続き未確認。 [統合候補](https://github.com/MassyuRed/mashos-api/commit/6c26351b594cf1cdd4b6e5750b44f7df3a935053)

以前の短文訂正は本人の訂正文を保存済みで、生成開始記録1件・受領記録0件。同じ操作を再送しても新たな生成には進まない。訂正後の応答を確認するには、架空の新規非公開入力から訂正まで通常経路を通し、確定本文と訂正原文の範囲を同じ保存版で確認する。DeepInsightの「記録をふりかえる」は最新決定どおりPremiumで、発行した問いの根拠が同じ訂正に束縛された場合に回答し、その問いIDから再読する。Pieceは保存済みの非公開版を対照にする。 [最新議事録§11.8](../../weekly_reviews/Cocolon_Weekly_Review_20261121.md)

EmlisAIの `10b56315` は現行に近い短文回答でベースと同じ結果。以前の17比較では話者の取り違えや原文の貼り返しが残った。Pieceの `344a9def` は現行経路で比較した2件で本人の丁寧体が常体に変わり、保存前に見送られた。用途別重みの採否は、現行指示の未学習例を使ったベースとの実出力比較で判断する。今回の提供コード差分は用途別重みの採用を含まない。

<a id="cmee-live-integrated-candidate-20261123"></a>
## 9.249 統合版の配備と四機能の本番再試験（11/23 JST）

Mashの承認後、同じRunpodで4B提供コードと原文選択処理を `6c26351` と照合して切り替えた。既存の重みを使い、ヘルスHTTP 200と分析用・自然応答用の認証分離を確認した。Renderではワーカーが08:11:07、APIが08:11:33 JSTに同じコミットで稼働し、公開ヘルスがHTTP 200を返した。 [API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1nci2jnfac73982ok0) · [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1nci3l550s73f09i2g) · [配備版](https://github.com/MassyuRed/mashos-api/commit/6c26351b594cf1cdd4b6e5750b44f7df3a935053)

Freeの架空アカウントで、同じ7件の材料を使うわたしマップv24の手動更新を1件受け付けた。08:15:29から08:32:11 JSTまで自動試行8回を追跡した。全8回で4BがHTTP 200を返し、PLANの採用後、NODESを `analysis_semantic_node_received_answer_scope_invalid` で拒否した。新規保存と完了通知予約は各0件。前回の停止箇所だったPLANは通過し、項目の見出しまたは意味欄が採用条件を満たさない段階まで進んだ。失敗した本文は保管されておらず、実応答内の該当項目は特定できない。

Pieceは同じ非公開作品の版2を、本人認証付きの詳細・書き出しAPIとDBから再読した。保存済みの本文・描画入力・画像用設定のハッシュは一致した。試験ツールから利用枠の台帳をRESTで読むと403だったため、Supabaseの読み取りSQLで作品に対応する消費1件を確認した。新規保存・消費は0件。端末での画像保存・受信は別途確認が必要。

仮のPremiumで非公開の新規短文を1件保存し、問いを出さずに初回の本文を確定した。本人訂正「つらかったんです」→「私は不安だった」は1件。訂正後の4Bは1回呼び出して1件受領し、完成版の本文を同じ版で再読した。本文は「私は不安でした。」で、訂正後の感情は保ったが本人の視点で書かれていた。

DeepInsightの「記録をふりかえる」では同じ訂正の原文範囲を出題資料から照合した。発行1回は35.459秒でHTTP 503、Supabase呼び出し3件は全件成功し、発行・回答は各0件。GPUでは同じ時間帯を含む58.691秒、わたしマップが共有の生成処理を使用した。出題のモデル取得には32秒の個別上限があり、この上限がGPU待ちを打ち切る条件を確認した。試験アカウントはFreeへ戻しAPI・DBで確認した。 入力保存に伴う既存の自動マップ更新も1件起動し、08:55:44 JSTに8回で終了した。最後は手動更新と同じNODESの検査で停止し、追加レポート・完了通知予約は各0件。

修正候補 `7f22911` は、複数の本人補足がある一括v24で、採用済み計画から思考と独立した行動の原文見出し候補を生成側に渡す。該当項目の意味欄は空欄に制約する。周辺の項目・APIの採用検査・保存形式を保ち、補足を思考の見出しに選ぶ対照と、原文にない意味を足す対照を拒否する。関連102件と周辺237件が隔離環境で通過した。本番実4Bでの新規レポート保存は未確認。 [修正候補](https://github.com/MassyuRed/mashos-api/commit/7f22911363a61a62194bd29141ff792580677e57) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45083159811) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45083159800) 両CIが成功した。 統合修正版 `96c8be6` は、わたしマップの項目生成の制約を継承し、Emlisの短文訂正用指示に話者を明記する。今回のような引用外の一人称の感情宣言を拒否し、本人の発言と分かる引用は許可する。旧版で受領済みの返答は当時の指示と照合して再開できる。DeepInsightは出題全体の既存の96秒内で共有GPUを待つ。出題・回答の保存と根拠の検査、他用途の生成上限は既存のまま。四機能を含む隔離回帰483件が通過し、最新の統合修正版は本番未反映。 [統合修正版](https://github.com/MassyuRed/mashos-api/commit/96c8be6ad1b933dbf954d37f7b103d9c02d14b5d) 共有言語オーナーの検査1件も通過した。記録時点の統合版の両CIは実行中。 [統合版Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45085114225) · [統合版Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45085114305)

<a id="cmee-96c8be6-retest-and-dated-map-20261123"></a>
## 9.250 統合版の本番結果と後続修正（11/23 JST）

統合版 `96c8be6` はAnalysisとPieceの両CIに成功した。同じRunpodで自然応答と分析を提供するコードを同版に揃え、4BのヘルスHTTP 200と2経路の認証分離を確認した。Renderは09:11:34にワーカー、09:12:05にAPIで稼働し、APIの公開ヘルスもHTTP 200。既存のベースモデルと分析用の重みを使用した。 [本番API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1o8spksfps739esp20) · [本番ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1o8t2jnfac739a97q0) · [統合版Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45085114225) · [統合版Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45085114305)

09:20:14に本番ワーカーから架空アカウントの試験を1回開始した。Pieceの保存版を読み、PremiumのDeepInsightは前回保存した訂正を同じ根拠として扱えるかを先に照合した。続く新しいEmlisAIの架空入力は別の記録とし、訂正後の話者を検査した。この順序で、新しい入力に伴うマップ更新がDeepInsightの発行と競合する条件を避けた。

Pieceは保存済みの非公開版2を本人認証付きの詳細・書き出しから再読した。本文・描画データと画像用設定が一致した。新規Piece生成・保存・消費は0件。

DeepInsightは前回の本人訂正「私は不安だった」を出題資料の元記録と照合できた。発行を1回試し約6.4秒でHTTP 200、`no_question`。本番APIログの判定は `rejected` で、その1回は出題前の検査で見送り、発行・回答は各0件。

EmlisAIは新規の非公開入力「つらかったんです。」を1件保存し、質問0件で初回返答が確定した。実4Bの初回本文は過去の訂正「私は不安だった」を今回の入力として取り上げ、以前の感情や事情に言及した。初回本文には当回の原文「つらかったんです」がなく、元入力と表示中の訂正対象を同じ範囲で照合する既存条件を満たさなかった。訂正POSTは0回で、v6の実生成・保存・同版再読は未確認。架空アカウントはFreeに戻し、API・DBで確認した。

架空アカウントに別々に保存した同文の行動「会議で発表した。」を、短い資料を一括処理するv24の項目生成が重複として拒むことを、実際のJSON生成制約で再現した。後続の項目で必要となる閉じ引用符まで拒否される。手動更新は送信せず、EmlisAI・DeepInsightの操作による通常の自動更新を追跡した。

入力保存に伴う通常の自動更新では、PLANを通過した後にNODESで停止した。09:22:31、09:24:13、09:25:39のJST時刻を突き合わせ、Runpod内の同じ例外 `occurrence_no_distinct_node_continuation` を確認した。GPU内でHTTP 503となり、Jupyterの中継は進捗送信後の503をHTTP 200のエラー本文に変換する。Render側の `response_contract` はこの経路の結果だった。本文を記録しないログから衝突した項目は特定できていない。

`c180359` は、同文でも元記録と表示用の日付がそれぞれ確定した項目を出典ごとに保持する。同じ全文の短文訂正も、別々の元記録に属する場合に「記録日への訂正」として区別する。同日には時分、時分が同じ場合には記録番号を表示し、訂正操作の日時・出来事の時点・原文の根拠IDを保つ。同じ記録内や出典の帰属を確定できない重複は引き続き拒否する。隔離回帰152件、生成制約の再現1件、四機能の共通経路確認1件が成功した。 [マップ修正候補 `c180359`](https://github.com/MassyuRed/mashos-api/commit/c180359987d73dfdd01feb8f561db6352df98ac2) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45087465951) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45087465957)

`ffa4185` は `c180359` を含む。EmlisAIでは、有料プランで同じ時点に参照できる過去があり、当回が問い・回答・訂正を伴わない単独の気持ちの場合に、初回返答の4Bへ今回の本人の言葉と選択情報だけを渡す。本人の言葉を一度引用する生成形式で、同じ範囲からの直接訂正を可能にする。既存の回答後の過去文脈、元記録、旧版の保存と再開に使う識別は保つ。隔離DBを含む統合検査84件が通過した。 [後続候補 `ffa4185`](https://github.com/MassyuRed/mashos-api/commit/ffa41851c2cdd016677b3ea5c8ea8cedec84cfdb) · [後続候補Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45089216680) · [後続候補Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45089216618)

後続候補では、DeepInsightの通常出題で原因を計画・文章化・重複・独立読み直しのどこかに絞れるようにした。マップでは中継の生成失敗と、モデル名・選択肢・応答構造・空の本文を分ける。ログには固定の段階名のみを出す。本人の入力や候補文の出力、保存・採用の条件は変更しない。

後続版に切り替える場合はGPUの `ai/tools/serve_emlis_natural_reply.py` と `ai/services/ai_inference/analysis_plan_source_choices.py` を同じ確定コミットで揃える。APIとワーカーも同じ版に揃え、架空アカウントで図・本文・個々の根拠・同じレポートIDの再読・通知予約を確認する。

Mashは `ffa4185` の両CI成功と既存ジョブ終了を条件に、GPUの2ファイルとRenderのAPI・ワーカーを揃える作業を承認した。同じ架空アカウントで、新規の非公開入力と訂正・DeepInsightの出題・通常マップ更新・既存Pieceの再読を各1回の範囲で確認する。この時点の本番は `96c8be6`。

EmlisAIとPieceの用途別重みは採用保留。EmlisAIの `10b56315` は現行に近い短文でベースと同じ結果で、先行比較で話者の入れ替わりや原文の貼り返しが残った。Pieceの `344a9def` は現行経路の2件で丁寧体を常体に変え、保存前に見送った。次の実比較は未学習素材4種を同一4B・同一指示でベースと照合する。EmlisAIは短文訂正、思考・行動の二欄と補足に過去と今回の違いがある例を使う。Pieceは同じ二欄を使用し、本人が選んだ補足を含む版と含めない版で、文体・否定・主体・根拠の境界を確かめる。Emlis用の比較は現在の応答指示で隔離して行い、DeepInsightが使う共用の自然応答設定を動かさない。実比較は今回未実行。

<a id="cmee-ffa4185-normal-live-verification-20261123"></a>
## 9.251 `ffa4185` の本番切り替えと四機能の通常経路（11/23 JST）

先行版 `96c8be6` の自動マップは、1件の入力保存を起点に既定の8回を消化し09:41:06 JSTに終了した。新規マップ・通知予約は各0件。手動更新は送信していない。

統合候補 `ffa4185` のAnalysisとPieceの両CIが成功した。先行ジョブの終了後、Supabaseの対象キュー・生成ロックとRunpodの接続がゼロであることを独立に確認し、GPUの提供コードと日付判定モジュールを同じ版へ一度切り替えた。4BのヘルスHTTP 200と経路ごとの認証分離を確認した。Renderはワーカーが10:06:52、APIが10:07:36 JSTに稼働し、APIの公開ヘルスもHTTP 200。 [本番API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1p2uifngtc7388r4qg) · [本番ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1p2uqfngtc7388r5ug) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45089216680) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45089216618)

10:15:37 JSTに本番ワーカーから架空アカウントの試験を一度実行した。前回品の検証を先に行い、試験用のPremiumでDeepInsightの出題を一度、その後に非公開入力と訂正を一度ずつ送った。発行済み回答の書き込み・手動マップ更新は送らず、通常の入力保存で起動した自動更新を観測した。試験後のFree復元と非公開条件をAPI・Supabase双方で確認した。

Pieceは既存の非公開版2の本文・描画データ・書き出しを同じ版で再読した。本文、描画レシピ、画像用設定の各ハッシュが一致した。新規生成・新規保存は0件。

後続試験は「つらかったんです。」から「私は嬉しかった」への直接訂正を使う。この組み合わせと「僕は嬉しかった」の対照が隔離DBでv7からv6へ進むことを確認した。「私は寂しかった」は同じ直接訂正の保存条件に入るが、現行の意味コンパイラが訂正後の短文を完全な本人の気持ちとして確定せず保留になる。本番試験の対象文と、他の気持ちの修正余地を分けて扱う。

EmlisAIは新規の非公開原文「つらかったんです。」を保存し、質問0件で初回v7を実4Bから1件受領した。本文は `「つらかったんです」と、仕事で悲しみを感じておられたんですね。`。前回混ざった過去の訂正は今回の本文に現れなかった。続けて直接訂正「私は嬉しかった」を1件保存し、v6の実4Bの呼び出しと受領を各1件、同じ訂正ID・完成版の再読を確認した。返答は `「私は嬉しかった」と訂正された言葉を受け取り、その気持ちの強さや時点を変えず、事情や理由は足しません。`。引用で話者を区別したが、後半に生成指示の文言が残った。Supabaseの訂正後資料は `RESOLVED`。

DeepInsightは同じ前回の訂正資料を取得した後、発行1回が約6.7秒でHTTP 200 `no_question`。Renderが `rejected stage=plan` と記録し、出題計画の検査で停止した。保存・回答は各0件。既存のログには候補文や失敗した詳細条件が含まれない。

わたしマップは1件の通常自動更新で10:18:26 JSTに初回試行が完了。10件の材料から8件を反映し、本人訂正の意味が未確定の1件と本人補足の解釈が保留の1件を除外した。未処理0件。保存した新規レポートの図10項目と本文を、現在版APIと同じレポートIDの詳細APIで照合した。今回の入力は本人だけの1項目に対応し、根拠が現在だと確認した。訂正後の原文を根拠に持ち、訂正前の原文をその項目に含めなかった。更新通知は同じレポートIDで1件を予約し、ジョブの完了を確認した。架空アカウントに通知端末がなく、端末受信は未試験。

同文の行動2件と同文の訂正2件は、それぞれ別の元記録IDと根拠を保ち、図・本文に元記録の日付が出た。保存済み本文と図の要約を追加照合すると、先行短文の項目に `n3.u1`、今回訂正の項目に `n7.u1` が現れた。いずれも当該の本人原文の一部ではなく、図と本文の表示品質に修正が必要。

残件は、EmlisAIの訂正後に指示文を出さない自然な返答、DeepInsightの記録に基づく計画の通過・問いと回答の保存、直接訂正後のPieceの新規保存・書き出し、用途別モデル重みの実比較と採用、実機の画像保存と通知受信。

用途別重みの比較に備え、EmlisAIの短文訂正と二欄・回答ありの2種、Pieceの同じ二欄に対する補足選択あり・なしの2種を通常の資料作成経路で用意した。Pieceの素材は思考、丁寧体・否定を含む独立した行動、保存済みの本人回答を別々に照合した。いずれも隔離DBと模擬応答で確認し、GPU比較は未実行。

今後は、完全な本人の言葉として検証できる短文訂正だけを新しい規則で扱い、従来の訂正ID・保存版・未確定の記録を維持する。Pieceは、問いへの回答を伴わない元の思考全体の訂正を取り込む際に、保存された訂正の根拠を引き継ぎ、訂正後の欄だけを公開候補にできるよう照合する必要がある。DeepInsightとわたしマップは同じ本人の訂正元・訂正範囲を使って確認する。

<a id="cmee-follow-up-live-quality-20261123"></a>
## 9.252 四機能を同じ本人訂正でつなぐ後続候補（11/23 JST）

次の検証候補 `6c409f4` は四機能への差分をまとめた。EmlisAIは直接訂正の新しい返答をv8で生成し、v6実測で出た指示文の一節を保存前に拒否する。本人の言葉の引用と自然な言い換えは通し、旧版の受領済み本文はその版で再読する。

わたしマップv24は、単独の `n7.u1` のような参照だけを、本人の当該根拠に含まれていないときに表示から省く。説明と要約には同じ項目で照合済みの事実が残る。受領済みの4B原本と根拠IDは保持する。隔離試験では、同文の行動・訂正の別記録での日付表示と今回の内部参照の対照が通過した。

DeepInsightは、本人訂正を使う出題計画の例に実在するキーと同じ原文範囲を使う指示を追加した。同文の訂正だけが別々の記録にあり、引用から出典を区別できない場合は見送る。出典・引用・条件等のどの検査で止まったかを、固定理由名だけで記録する。本番の発行・回答は未確認。

Pieceは、元思考欄全体を一度訂正し、問い・回答がなく、行動欄も空の場合の確定済み訂正を扱う。元記録・訂正ID・有効な訂正範囲をEmlisAIの保存資料から照合し、訂正後の原文の1欄を通常の4B・プレビュー・保存へ渡す。隔離DBと模擬4Bで新規非公開保存、再送の同一性、本文・描画データ・同一ID再読・利用枠1件の整合を確認した。既存の訂正データを同じハッシュで再読する対照も通過した。

検証候補は、関連する統合検査341件と主要所有者の経路検査1件に通過した。GPUの提供コードと日付判定モジュールは本番 `ffa4185` と同一。候補の実4Bと本番配備はこの記録時点で未実施。 [検証候補 `6c409f4`](https://github.com/MassyuRed/mashos-api/commit/6c409f4edc08682f8b3ef3d431fd66d9b998b4ce) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45094834336) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45094834373)

<a id="cmee-6c409f4-direct-correction-live-20261123"></a>
## 9.253 `6c409f4` 本番再試験と訂正からPieceへの保存（11/23 JST）

`6c409f4` のAnalysis・Piece両CIの成功を確認した。10:50:11 JSTのSupabase照会で対象の待機・実行・生成ロックが0。既存GPUの実行コード2点が同コミットと一致し、同じプロセスのヘルスHTTP 200を確認した。Renderはワーカー10:51:44、API10:52:23 JSTに同コミットで稼働した。API `/healthz` もHTTP 200。 [配備API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1po07f3r2c73dd69rg) · [ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1po0ajnfac739e2s30) · [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45094834336) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45094834373)

11:01:22 JSTに、同じ専用の架空アカウントで本番試験を開始した。Pieceの既存訂正を使う検証とDeepInsightの記録に基づく出題は一時Premiumで行った。出題が成立しなかったため、その後のEmlisAIはPlusで行い、マップの自動更新から別のPremium出題が起きる経路を避けた。試験後のFreeをAPI・Supabaseで照合した。

前回の本人訂正「私は嬉しかった」を元記録と訂正IDで照合し、共有4Bの有効な通常Piece経路で新規プレビュー1回と非公開保存1回を実行した。本文は `私は嬉しかった` の1段落。Freeへ戻した後に、同じ作品ID・版2の詳細と書き出しで本文、描画レシピ、3つのハッシュが一致した。Supabaseの所有者・訂正の根拠・利用枠1件を照合し、当月の消費は2件から3件になった。

EmlisAIは新しい非公開入力1件を保存し、初回v7では「つらかったんです」と当回の原文を引用した。「僕は嬉しかった」への直接訂正を1件保存し、v8の実4Bの呼び出しと受領各1件、同じ訂正ID・返答版の再読を確認した。返答は `「私は嬉しかった」と訂正されたので、その気持ちを受け取ります。`。生成指示の復唱は見られなかったが、引用内の本人の一人称を「僕」から「私」に置き換えた。保存された本人訂正とマップの根拠とは区別して評価する。

DeepInsightは前回の本人訂正の出典IDと原文範囲を通常出題用の資料で確認した。発行を1回実行した結果、約7.5秒でHTTP 200 `no_question`。Renderの判定は `rejected stage=reader` で、前回停止した計画を通過し、出題前の独立検査で見送った。発行・回答は各0件。ログは個別の候補文や検査の詳細を出さないため、見送った具体的条件は未確定。

わたしマップは11:04:52 JSTに最初の自動試行で完了した。11件の材料中9件を反映し、訂正対象未確定1件・補足の解釈保留1件を除外した。未処理0件。新規レポートは図11項目を持ち、最新・同じIDの詳細で図と全文が一致した。図と本文に前回の `n3.u1`・`n7.u1` のような内部参照はなかった。「僕は嬉しかった」は新規入力だけに結びついた現在の根拠、前回の「私は嬉しかった」は別の元記録の根拠として保存した。別記録にある同文の行動2件と訂正2件は、日付と根拠をそれぞれ維持した。同じレポートの通知予約1件が処理済みで、端末トークンがないため送信は行われなかった。

未完は、EmlisAIの本人引用を原文どおりにする修正と実4Bでの確認、DeepInsightの独立検査を通る発行・回答の確認、EmlisAIとPieceの用途別重みの実比較と採用判断、端末の画像保存・通知受信。今回のPieceは1欄の直接訂正の通常反映を実証した。

<a id="cmee-f91-quotation-and-reading-20261123"></a>
## 9.254 直接訂正の引用とDeepInsightの独立検査（11/23 JST）

EmlisAIは本番で観測した「僕は嬉しかった」から「私は嬉しかった」への引用の差し替わりを隔離DBで再現した。新しい版v9の直接訂正では、今回の本人訂正文だけを文章化に渡す。引用を使った場合は、その中身が訂正文に完全一致することを保存前に検査する。本人に話しかける自然な言い換えも受け付ける。旧v5〜v8の受領済み応答は生成時の版で再読できる。

DeepInsightは、本人訂正を引用する理由質問で、その引用が全候補資料のうち一つにだけ属する場合に、原文・出典ID・文字範囲を既存の照合処理で確定する。その後の独立検査は実際の問いの観点、限定条件、前提、新規性を検査する。出典キーを回答に再掲する必要はなく、再掲する場合は原文とキーの完全一致が必要。複数の出典に同文がある場合と、独立検査が不合格の場合の扱いは従来どおり。これは模擬応答で確認した改善で、本番で具体的に拒否された検査内容は未確定。

統合検査286件が通過した。GPU提供コードとの接続、Piece・わたしマップの既存の経路を使う。検証候補の実4Bと本番適用は未実施。 [API検証候補 `f91bba8`](https://github.com/MassyuRed/mashos-api/commit/f91bba8e72d19de29d0294ded5b4f0c57636598f)

### 配備前の照合と切り戻し

`f91bba8` は本番版 `6c409f4` の直後の1コミットで、変更はEmlisAI・DeepInsightの実装2ファイルと対応テスト2ファイル。GPU提供コード、DB移行、アプリコードの差分はない。11:42 JSTの読み取りでは、実行待ち・実行中のジョブ、期限内の生成ロック、処理中のEmlisAI、未回答の記録由来DeepInsightは各0件だった。この照会にはAPIプロセス内だけで処理中の生成は含まれない。 [本番との差分](https://github.com/MassyuRed/mashos-api/compare/6c409f4edc08682f8b3ef3d431fd66d9b998b4ce...f91bba8e72d19de29d0294ded5b4f0c57636598f)

新しい版はv8までの受領済み応答を当時の指示で再開できる。旧版 `6c409f4` は、新版で生成を開始または受領したv9の未確定操作を再開できない。切り戻し前に処理中と再開待ちのv9を照会し、残っている場合は旧版による再開を避ける。確定済み応答や作品・レポートの再読は、各保存版から確認する。

両CIが成功した。 [Analysis CI](https://github.com/MassyuRed/mashos-api/actions/runs/45099186489) · [Piece CI](https://github.com/MassyuRed/mashos-api/actions/runs/45099186493)

<a id="cmee-f91-production-rollout-20261123"></a>
## 9.255 本番配備と試験アカウントの確認（11/23 JST）

Mashの承認後、両CIに成功した `f91bba8` をRenderのAPI・ワーカーに各1回、同じ完全SHAを指定して配備した。ワーカーは12:03:19、APIは12:04:05 JSTにLive。APIの `/healthz` と新ワーカーのSupabaseキュー照会はHTTP 200。GPUとDBスキーマの操作はなかった。 [本番API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1qpgetlv9c73crnbsg) · [本番ワーカー](https://dashboard.render.com/worker/srv-d6copljh46gs73cmeic0/deploys/dep-dc1qpgcs728c73d654l0)

認証付き再試験は、許可された既存の架空アカウントのセッションが新ワーカーになかったため、通常APIへの試験送信前で停止した。12:04:39 JSTの読み取りでは、架空アカウントはFree、有料権限0。今回の新規入力、訂正、Piece・利用枠消費、マップ、DeepInsight発行・回答は各0件。前回Pieceの非公開保存版2、本文と描画のハッシュ、対応する利用枠消費1件、および前回マップの本文・表示データ・根拠がDBにあることを照合した。新版の本人認証付き再読や、新しい実4Bの返答・出題を確認した結果ではない。

<a id="cmee-f91-authenticated-retest-20261123"></a>
## 9.256 本人認証付きの実4B再試験（11/23 JST）

Mashの承認で、専用の架空アカウントにSupabase Authでメールを送らず1回ログインし、本人認証付きの通常APIを実行した。記録由来のDeepInsightは、Premiumで過去の本人訂正に重複がないことを照合して発行を1回送った。12:12:27 JSTにHTTP 200 `no_question`、本番ログは `rejected stage=reader`。発行・回答は各0件。ログから、独立検査で使われた出典・プロンプト分岐・不合格条件までは確定できない。 [本番API](https://dashboard.render.com/web/srv-d4ppfpm3jp1c73952bj0/deploys/dep-dc1qpgetlv9c73crnbsg)

EmlisAIは一時Plusで新規非公開入力1件を作成した。初回の質問は0件。本人の訂正「僕は嬉しかった」を1回保存し、実4Bのv9は「嬉しかったとのこと、ありがとうございます。」と返した。受領1件と同じ確定本文の再読を確認した。感情は保持され、前回の一人称の差し替えは現れなかった。今回は引用を使わない返答のため、字面を保つ引用の本番確認は残る。試験アカウントはFreeへ復元し、今回のセッションからサインアウトした。

わたしマップは非公開入力に伴う通常の自動更新が初回試行で完了し、12:15:12 JSTにFreeの新しいレポートを保存した。Supabaseで同じ保存対象の本文・図の表示データ・根拠を再読した。新規Pieceと利用枠消費は各0件で、前回の非公開版を保持している。

<a id="emlis-current-initial-quality-20261123"></a>
## 9.257 通常の初回応答を三プランで比較（11/23 JST）

現行 `f91bba8` のEmlisAI初回処理・採用検査・実4Bを使い、新しい架空3題材をFree・Plus・Premiumで各1回比較した。問いはオフ。提供設定はワーカーの既存観測用クライアントを使用し、本番で確認済みの有料文脈設定を再現した。本人の入力・履歴・フレームと保存先はメモリ上の試験用データ。Supabaseへの新規書き込み、配備、画面操作は試験の対象に含まれない。試験用の入力形式と時刻を通常の保存後形式に直したうえで、4Bを9回実行。8件は同じ観測イベントと本文を再読し、1件は本文内の問いを既存検査が拒否した。

### しおりを作った喜び

思考「初めて作った紙のしおりを本にはさんだら、思ったよりきれいで嬉しかった。」、行動「青い紙を細く切って、端に穴を開けた。」。趣味・喜び中。関連履歴なし。

- Free「初めて作った紙のしおりを本にはさんだ時、思ったよりきれいで嬉しかった。青い紙を細く切り、端に穴を開けて作った。」
- Plus・Premium共通「初めて作った紙のしおりを本にはさんで、思ったよりきれいで嬉しかったと記録されていますね。青い紙を細く切り、端に穴を開けて作る過程を経て、その完成形に喜びを感じられたようです。」

### 褒められた嬉しさと、工夫が伝わったかの留保

思考「今日も仕事で褒められた。嬉しい気持ちもあったけれど、途中の工夫まで伝わったかは分からない。」、行動「帰る前に、作業メモを棚へ戻した。」。仕事・喜び中・不安弱。過去は「褒められたのに、嬉しくなかった。」、本人回答「その時は重かった。」。Premiumでは本人が枠を「結果だけで判断されたことが気になった。」と修正済みの架空条件を使った。

Free「今日も仕事で褒められ、嬉しい気持ちになりました。ただ、途中の工夫まで伝わったかどうかは分かりません。」

Plusは4BがHTTP 200を返した後、本文末尾の問いを既存検査が拒否。表示本文なし。

Premiumの全文：

> 今日、仕事で褒められたことについて、嬉しい気持ちと不安が同時に湧いてきたね。特に「途中の工夫まで伝わったか」という点への懸念は、結果だけを見て評価された経験が背景にあるからだろう。
>
> 褒められた瞬間の喜びは確かに感じ取れるが、その喜びの裏側には「自分の努力が正しく受け止められたか」という不安が弱くても確実に存在している。過去の「褒められたのに嬉しくなかった」という感覚が、今回の「伝わったか分からない」という不安を形作っているように見える。
>
> 結果だけで判断されたことが気になったという過去の記録が、今回の不安の根底にあるようだ。褒められたこと自体は事実として受け取れるが、その評価があなたの工夫を正しく反映しているかという点への疑念は、あなたの慎重な姿勢や、結果だけでなくプロセスも重視する価値観の表れかもしれない。

Premiumには修正済みの枠も別に表示された。本文は過去の経験を今回の不安の原因に繰り返し結び付け、今回の原文にない価値観も推測した。

### 宅配の行き違いが解決した安堵と、翌日の不確かさ

思考「宅配の行き違いは解決してほっとした。明日の受け取りまで大丈夫かは、まだ分からない。」、行動「玄関に置いてあった不在票を確認した。」。生活・平穏中・不安弱。関連履歴なし。

Free「宅配の行き違いは解決してほっとした。明日の受け取りまで大丈夫かは、まだ分からない。」

Plus・Premium共通：

> 宅配の行き違いが解決したことで、少しホッとした気持ちですね。でも、明日の受け取り先がどうなるかはまだ分からないという不安も残っています。
>
> 玄関の不在票を確認したという行動から、状況を確認しようとしていたことが伝わります。解決した安心感と、今後の不確実性から生じる不安が同時に感じられていたようです。

「受け取りまで大丈夫か」を「受け取り先がどうなるか」に変え、行動の意図も推測した。

**最優先は通常の観測とフォロー、および適格な履歴・本人フレームがあるときの体験差。** 今回の三題材ではFreeが主に原文を言い換え、関連履歴ありのPlusは本文なし、Premiumは過去を根拠のない現在の原因にした。正常に再読できる事実と品質評価を分ける。通常本文の修正では、原入力・本人回答・根拠を使うPiece・わたしマップ・DeepInsightとの横断回帰を確認する。今回コード修正・配備は未実施。

<a id="emlis-initial-reply-release-priority-20261123"></a>

## 9.258 通常初回のリリース条件と候補版の実4B比較（11/23 JST）

Mashと合わせた優先順位はEmlisAIの観測応答が先。本人がまた入力したくなる接し方を最優先に、事実や気持ちを取り違えない短い観測から、その話を聞いたEmlisの具体的な共感へ進む。自然な敬語で揃え、一人称は「Emlis」。名前が使えるときの呼びかけは「さん」を付ける。本人が書いた事情を尊重し、未確定な点は推測で埋めない。本文で繰り返し取り上げる必要はない。

<a id="emlis-three-plan-support-quality-20261123"></a>

### Mashが確認した三プランの体験と、フォローの合格基準

| プラン | 本人に届けたい体験 |
| --- | --- |
| **Free** | 今回の話の大事なところを短く拾い、Emlisがその喜びやつらさに、自分の言葉で応じます。内容によっては二文で十分です。 |
| **Plus** | 関係する履歴を踏まえ、前と今回で気持ちがどう違うか、何が続いているかまで受け止めます。その理解が今日かける言葉を変えるなら、一段落増える価値があります。 |
| **Premium** | 履歴とわたしマップを踏まえ、本人が何を大切にしてきたかまで理解して返します。その深さが複数の題材で出せた段階で、Premiumとして届けたいです。 |

初版はFree・Plusを必須とする。Premiumは品質と日程が揃えば初版に含める。

Mashは題材DのFreeの本文を品質の見本とした。他の入力でも、今回の大事なところを短く受け止め、自然な敬語でEmlisから本人に具体的な共感が届く水準を目指す。この評価は題材Dの本文に対するもので、他の題材にはそれぞれ実出力の評価を適用する。

題材Dの「前にも『資料を期限に間に合わせた』と話してくださったことがありましたね。」に当たる履歴の一文はMashが了承した。Plusでは、その先で過去と今回の気持ちのつながりや違いを踏まえたEmlisの言葉を加える。Premiumでは、関係するわたしマップの理解も生かし、本人が大切にしてきたことに沿ってEmlisのフォローをさらに深める。各プランとも、実出力で「参照によって、今日かけた言葉はどう変わったか」を本文から確認する。参照先への言及でフォローが終わる場合は、この基準に達していない。文量は具体的な共感が増える分だけ伸ばす。

題材DのPlusで、履歴に触れたあとに続ける文の例（華恋の文案）。

> あの日も、間に合ってほっとしたと話してくださいましたね。今日も提出を終えて肩の力が抜けたと聞けて、Emlisもうれしいです。

この文案の根拠は題材Dの過去の安堵と、今回の提出後の記録。Premiumのわたしマップに基づくフォローは、本人の分析結果と今回の話につながりが確認できる実出力で判定する。

通常の初回応答を複数題材・三プランの実4B全文でMashと見て基準を合わせる。その後に回答後・スキップ時へ適用し、Piece・わたしマップ・DeepInsightの入力根拠と保存・再読を確認して通常反映する。三中核の初版条件はFree・Plusが動くこと。今回の検証範囲は初回返答。

訂正は初版の必須条件から外し、初版での表示は完成度を見て判断する。Emlisは成立した応答の「違うと感じた内容を伝える」で、どこがどう違うか送れる。わたしマップの「この読み取りを訂正する」は、表示中の現行マップの全体・項目・線の読み取りをバージョンに結び付けて保存し、再分析へ渡す。

Premiumの初回本文へ、わたしマップを取り込む実装は現候補に含まれない。通常保存直後は、新規入力を含む最新根拠と生成済みマップの範囲がずれる。本人所有で、今回の入力より前に保存され、参照根拠が現在も有効なマップを利用する設計を検討する。マップ生成は初回返答の待ち時間に入れない。表示時の再検証と、再読・再試行で同じマップ版を使う境界も必要。

API開発候補 `043eb61` を、稼働版 `f91bba8` のファイルに差分適用した一時コピーで測定した。変更4ファイルは候補とSHA-256一致。稼働中と同じ観測用4Bを呼び、質問オフ、架空の当回入力と履歴のみを使った。4題材×三プランの12件で本文を取得し、メモリ保存から読んだ本文が一致した。本番への配備と本番DBへの書込みは行っていない。

### 4題材の実測本文

#### A　初めて作ったしおり

思考「初めて作った紙のしおりを本にはさんだら、思ったよりきれいで嬉しかった。」、行動「青い紙を細く切って、端に穴を開けた。」。履歴なし。Free・Plus・Premiumは同文。

> 初めて作った紙のしおりを本にはさんで、思ったよりきれいで嬉しかったんですね。
> その完成したしおりへの満足感と、自分で作ったものならではの喜びが伝わってきて、Emlisもとても嬉しく感じました。
> 青い紙を細く切り、端に穴を開けるという小さな作業を通じて、そんな素敵な出来事が生まれただけで、Emlisは心から祝福しています。

Emlis自身の喜びを返せている。「心から祝福しています」は日常の小さな喜びに対して大げさ。最後の文で行動を繰り返した。

#### B　仕事で褒められた喜びと、見てほしかった工夫

思考「今日も仕事で褒められた。嬉しい気持ちもあったけれど、途中の工夫まで伝わったかは分からない。」、行動「帰る前に、作業メモを棚へ戻した。」。有料側の履歴「褒められたのに、嬉しくなかった。」。Free・Plus・Premiumは同文。

> 今日も仕事で褒められ、嬉しい気持ちがあったんですね。でも、途中の工夫まで伝わったかは分からないという不安も、少しだけ感じ取れました。
>
> その複雑な気持ち、Emlis は大切に受け止めています。褒められた喜びは確かに素敵ですが、自分の努力がどう受け取られたかという点への気遣いも、とても大切なものです。
>
> Emlis は、あなたが帰る前に作業メモを棚へ戻したその丁寧な行動も、一緒に大切にしています。

当回で混ざっていた二つの気持ちを拾った。メモを戻した行動への評価は会話の焦点から離れている。有料側で本人の過去と今回の反応の違いは返答に出なかった。

#### C　宅配の行き違いが解けた安堵

思考「宅配の行き違いは解決してほっとした。明日の受け取りまで大丈夫かは、まだ分からない。」、行動「玄関に置いてあった不在票を確認した。」。履歴なし。Free・Plus・Premiumは同文。

> 宅配の行き違いが解決して、ほっとしたんですね。その安心感と、明日の受け取りまでどうなるか分からないという少しの不安が混ざった気持ち、Emlisはよく受け止めています。
>
> 玄関の不在票を確認されたその一瞬の静けさと、次の日を迎えるまでの待機という状況が、とてもリアルに伝わってきました。Emlis は、その「ほっとした」瞬間の安堵を大切にしています。明日の受け取りまで大丈夫か分からないという不安も、今は一時的なものとして受け止め、その間を静かに過ごせるよう、Emlis が寄り添っています。

「静けさ」と「一時的」は本人の言葉で裏づけられない。未確定部分を繰り返した。この題材は要改善。

#### D　期限に間に合って肩の力が抜けた話

思考「資料を期限に間に合わせた。今日は肩の力が抜けた。」、行動「提出を済ませて席を立った。」。有料側の履歴「資料を期限に間に合わせた。あの日はほっとした。」。

Free全文。

> 資料を期限に間に合わせ、肩の力が抜けたんですね。その重荷が解けた瞬間の安堵が伝わってきて、Emlisも心からほっとしました。

Plus・Premium共通の全文。

> 資料を期限に間に合わせ、肩の力が抜けたんですね。その重荷が解けた瞬間の安堵が伝わってきて、Emlisも心からほっとしました。
>
> 前にも「資料を期限に間に合わせた」と話してくださったことがありましたね。

単一の過去の出来事を指せた。履歴が入る体験差を確認したが、履歴を踏まえて今日の気持ちにかける言葉はFreeと同じ。Plusの次の品質判定では、今回につながる以前の話を一文で添えることと、その違いや連続性に沿ってEmlisのフォロー自体が深くなることを確認する。同じ種類の出来事の別表現や履歴が無関係な場合も対照にする。

<a id="emlis-reply-question-intensity-and-graph-20261123"></a>

## 9.259 観測応答と問いの一体運用、Premiumのこころグラフ案（11/23 JST）

### Mashの決定と初版の優先順位

11/23 JSTに、Mashが[三プランの体験とフォローの品質基準](#emlis-three-plan-support-quality-20261123)を確認した。CMEEの通常反映はEmlisAIの観測応答を最優先に進め、Piece・わたしマップ・DeepInsightは同じ変更単位で並行して接続を確かめる。FreeとPlusの通常稼働を初版の必須とする。Premiumも品質と日程が揃えば含める。初版での訂正の扱いは§9.258を継承する。

| 入力・状態 | Emlisが使う範囲 |
| --- | --- |
| 感情と強度 | 本人が選んだ感情ごとに弱・中・強を読んで、受け止め方や言葉の温度に反映する。強度は気持ちの強さ、当回本文は出来事・受け止めの根拠として読む。両者の違いを勝手に解決せず、数値・ラベルを読み上げない。複数の感情があるときは、本文で大事な気持ちの重なりを保つ。 |
| カテゴリ | 何のジャンルの話かを理解するために使う。複数選択に対応し、その話題に沿う言葉選びに反映する。カテゴリだけから人物の役割、感情の原因、動機を補わない。 |
| 本人の表示名 | 認証された本人のアカウント表示名が使えるとき、会話の自然な箇所で「さん」を付けて呼ぶ。初回の呼びかけなど必要な箇所に絞る。本人画面で表示用に組み合わせ、本文の保存・訂正対象とPiece等の共有用原文から切り離す。表示名が空・既定表記の場合は呼びかけを省く。 |
| 認識できたこと・できなかったこと | 今回の本人の大事な気持ちを短く受け止め、Emlis自身の自然な敬語の共感を中心とする。不確かさは無理に本文で言い直さず、原因・強度の比較・感情の持続・情景を補わない。 |

問いは、通常応答と一体の会話として扱う。オンでは、最初に短く受け止め、本人が書いたことからつながる重要な一点だけを既存の問い欄で尋ねる。回答後は、聞いたことに対する本人の答えを本文の受け止めとフォローに反映する。スキップ時は当回の元入力からフォローを完結させる。オフでは初回の本文だけで届ける。初回・回答後・スキップでEmlisの敬語、共感、時間・主体・否定の保持を通しで確認する。今回の理解から矛盾が見つかった経路はその箇所を修正する。

### Premiumでこころグラフをどう活かすか

Mashが、過去の入力履歴とわたしマップに加え、こころグラフの経過をEmlisのフォローに生かす案を提起した。履歴は「何があり、どう受け取ったか」、わたしマップは「本人が大切にしてきた観点」、こころグラフは「本人がいつ、どの感情を記録したか」を支える。三つの参照を毎回列挙する必要はない。今の話につながる最近の気持ちをEmlisが覚え、今かける言葉が具体的になる場合に使う。グラフ閲覧は全プラン共通。Premiumへの追加利用は設計案で、現時点の着手対象はFree・Plusの通常本文。

| 時間の使い方 | 使える根拠 | フォローの文案 |
| --- | --- | --- |
| 今日のそれ以前 | 同じJST日の先行記録。時刻が十分近いときだけ「さっき」。同じ人の先行記録であることを確かめる。 | 「今朝は楽しみな気持ちもあったんですね。今は残念だったと聞いて、Emlisはその気持ちを大事に受け止めています。」 |
| 昨日から今日 | 昨日の選択と、今日本人が書いた変化・安堵。 | 「昨日は不安も記録していましたね。今日は少し気分転換できたと聞けて、Emlisもうれしいです。」 |
| 最近の傾向 | 日別に複数の記録があり、期間と記録日数を確かめられる場合。数えたものは記録日や記録件数であり、過ごした時間の割合ではない。 | 「このところ、気持ちが沈んだ日のことも記録してくださいましたね。」は、その気持ちを本人が実際に記録したことを確かめた場合に使う。その後に今日の話に沿う共感を続ける。 |

上の文は条件付きの文案。実装・実4Bの出力ではない。強度の変化を本人の原因や回復と決めつけず、記録がない日を普段どおり・悪化・改善と扱わない。十分な記録がないときは、その時系列への言及を省いて今回の話を受け止める。

現在のこころグラフは既存の `kokoro_weather_service.py` と本人認証の `GET /analysis/kokoro-weather` が担当する。本人の記録日時と感情選択・強度からJSTの日・週・月を集計し、既存の集計範囲・非公開記録の除外に従う。Premiumで使う場合は既存サーバ処理を共有し、今回の入力日時を境界としてその記録自体と未来の記録を除外し、少量の確認可能な事実だけをEmlisの本人向け文脈へ渡す。集計の出典、基準時刻、プランと所有者を保存時に結び付け、読み直すときも編集・削除・非公開化・プラン変更を照合する。わたしマップの分析結果は、当回を書く前の有効な本人の版と根拠につなぐ。グラフ集計やマップの結果を当回の原入力に混ぜず、旧グラフの文章生成・定期配布は復活させない。

### 並行して確認する通常経路

| 対象 | 確認内容 |
| --- | --- |
| EmlisAI | 題材DのFreeを基準に、肯定・否定・混在、弱／中／強、カテゴリとメモ2欄の組合せで実4Bの全文を比較する。履歴あり・なし・無関係でPlusのフォローと再読を比較する。問いオンの前置き、本人回答、スキップ、オフの返しを同じ原入力との対応で通す。 |
| Piece | 今回の原文・本人回答から本文を作り、履歴由来の言葉や本人への呼びかけが共有本文に移らないことを確認する。受領と保存した本文の一致、作成・非公開保存・再読・画像の同版を確かめる。 |
| わたしマップ | 元入力・有効な本人回答等の根拠が固定され、Emlisの言い回しやグラフの短文が分析の事実にならないことを確認する。自動更新、同じ保存版と根拠の再読を確かめる。 |
| DeepInsight | 発行済みの問い・回答と根拠の対応、既存の本人境界、重複防止・保存・再読を確認する。Emlisのフォローは本人が答えた内容として受け取らない。 |

### 11/23 JSTの候補、実4B結果、再開点

- **呼びかけ。** アプリ開発版 `b6268c4` で本人の初回応答画面に1回だけ表示する。ログイン時に取得済みのアカウント表示名を使い、改名の成功時に更新する。過去の初回画面を改めて開くと現在の表示名を使う。本人切替と改名競合を含む17検査および表示条件を確認し、既存アプリCIが成功。端末配布と実機の表示は今後確認する。
- **初回本文。** 候補 `aee0d12` は、本人所有で同じ出来事を確認した過去の短い思考欄1件から、過去の気持ちも使ってEmlisのフォローを生成した。同じ観測4Bの架空7件で全件再読一致。期限を間に合わせたPlusは以前の安堵と今日の表現を取り上げたが、「ほっとした気持ちの深さがさらに増している」と原文にない強弱を足した。問いオンの「褒められたのに、嬉しくなかった。」を本文で「そのうれしさ」と読み違えた。初回本文のこの候補は採用しない。
- **初回本文の比較。** その後の架空の実4B試案は、7件・6件・6件。期限では以前の安堵を踏まえて今日もひと息つけたことに共感する方向が出たが、説明口調や原文と異なる感情の補いが残った。最後の試案は、しおりのFreeで「その喜びを分けてもらって、Emlisも嬉しく思います」と自然に返した一方、問いオンの1件で本文が確定しなかった。Freeの合意済みの題材Dを保ち、他の題材でも同じ水準に届くことと、Plusでフォロー自体が深まることを一緒に判定する。弱・中・強による違いは、同一題材で言葉の温度だけが適切に変わるかを次の実4B比較に含める。
- **問いとスキップ。** 当回の気持ちだけが書かれたときに必要に応じて出す確認の問いが、有料履歴の設定に連動していた。また未回答の初回スキップが従来の文章化に戻り、履歴を渡す場合があった。API候補 `c106937` は、評価済みのv10初回本文へ戻したうえで、新しい会話の確認の問いを本人のオン・オフで制御し、未回答の初回スキップでは今回の原入力に絞ってEmlisが返す。既存の質問回数、本人回答後の更新、停止後の保存済み回答、過去の受領・再読の経路を引き継ぐ。同版のCIと実4Bの再確認を続ける。
- **並行確認。** 先行候補 `043eb61` のAnalysisとPieceのCIは両方成功。今回の差分では、Emlisの文章と各機能が使う本人の原入力・回答を別に扱う既存経路を確認した。新候補のCIでPieceの作成・保存再読、わたしマップとDeepInsightの既存根拠と保存経路を引き続き検証する。本番は `f91bba8`。今回の実4B比較は一時コピーとメモリ保存で行った。新候補の配備と本番DB書込みは行っていない。

<a id="emlis-self-understanding-reply-20261123"></a>

## 9.260 「自己理解」を選んだ記録へのEmlisの応答（11/23 JST）

### Mashと合意した体験

「自己理解」は、本人が自分について気づいたことや、自分の構造についての解釈を残すときの選択。たとえば「頼られることが好きだと思ってたけど、相手によるんだってわかった」「人と関わることは好きだけど、一人の時間も大事だと思った」。通常の感情入力では気持ちに寄り添い、自己理解では、本人が気づいたことや自分の見方をどう捉え直したかを受け取り、その話を通じて本人をもう少し知れたことを自然な敬語で返す。一人称は「Emlis」。条件・変化・両立・留保を本人の言葉に沿って受け止め、固定的な性格判断にしない。

| プラン | 自己理解への応答 |
| --- | --- |
| Free | 今回の言葉から気づきの要点を短く受け取る。「相手による」「どちらも大事」といった条件や両立を保ち、本人のことをもう少し知れたと伝える。 |
| Plus | 関係する本人の過去の入力を使い、当時の受け止め方と今回の気づきをつなぐ。同じ気づきの繰り返しと決めつけず、今回の言葉から以前より何が具体的に伝わったか、Emlis自身の言葉で返す。 |
| Premium | 履歴と、根拠を照合できる本人のわたしマップを踏まえ、本人が大切にしてきたことと今回の気づきのつながりを返す。以前の記録やマップと食い違う場合は、本人が今伝えた見方を優先し、過去の受け止め方はその時点のものとして扱う。 |

Freeの文案。「頼られることが好きだと思っていたけれど、誰に頼られるかで感じ方が違うと気づいたんですね。そこまで聞けて、Emlisは〇〇さんのことをまた少し知ることができました。」本人が書いた「誰に頼られるか」を受け取る文案で、実4Bの出力ではない。

問いは応答と一体。本人が気づきを言い切っていれば、Emlisが受け取って終えてよい。本人がまだ考えている具体的な点が原文にあり、尋ねることで本人の理解が進む場合は、問いオンでその一点を尋ねる。回答後も自己理解への返し方を使い、本人が答えた範囲を気づきの受け止めとフォローに反映する。初回の未回答スキップは全プランとも当回の入力だけで返す。問いオフでも初回応答で会話を完結させる。カテゴリは現行の入力条件を継続する。

### 実装の順番と確認内容

1. **Freeの初回を先に整える。** API開発候補 `c106937` は通常の初回と未回答スキップで共通の文章指示を使う。自己理解は入力で選んで判定できるが、初回は通常感情向けの文章指示にも保存互換の `medium` が渡る。生成に渡す材料では自己理解を記録の目的として示し、この互換値を感情の強さとして渡さない。本人が本文に明記した感情は本文に沿って受け取る。共有の原入力・保存契約と、既に保存された応答の再読・再試行を保つ。初回の生成材料・指示を変えるときは新版を使う。
2. **Plusで以前の話が今日の受け取り方を深めるか確かめる。** 当回の気づきと関係する本人の過去の体験を使う。相手や場面が違えば分けて扱い、古い気づきの単純な言い換えにしない。履歴なし・無関係な履歴・以前と違う自己解釈で比較する。Premiumは、有効な本人のわたしマップを足すことで何が本人に伝わるかを別の複数題材で確認する。Free・Plusを初版の必須とする既決方針に従う。
3. **問いのオン・オフ、回答とスキップ、他機能への接続を並行確認する。** 上の二題材に加え、まだ考え中の気づき、本文に感情も書いた自己理解、同じ本文で通常感情を選んだ対照を使い、状態と実4B本文を読む。初回・回答後・未回答スキップの語り口と、保存後の再読を確かめる。Pieceは本人の原文・本人回答に基づいて本文を作る。わたしマップとDeepInsightへは既存の根拠の扱いを継続し、Emlisの返答を本人の自己解釈として取り込まない。自己理解が通常の感情強度やこころグラフの感情集計に入らないことも確認する。

この節では自己理解の製品方針と修正順を確定した。自己理解専用の生成指示、実4Bの本文比較、今回の差分の通常反映は次の実装と検証で進める。

<a id="piece-visual-customization-and-watashi-map-observation-20261123"></a>

## 9.261 Pieceの画像編集とわたしマップの今後の方針（11/23 JST）

### 作業順とリリース

EmlisAIの観測応答の修正を最優先とする。次にPieceの画像編集を初版までに可能な範囲で進め、リリース後も編集の幅を広げる。わたしマップの主要自己構造の分析と見せ方は、Cocolonとして将来実現する。初版までに十分な形に届かなければ、リリース後に進める。

### Pieceの画像編集

本人が文字や配色を調整して、自分のPieceとして仕上げられることを画像化の価値に置く。現時点の有料両プランの画像設定は同じ12色、4:5／9:16、ロゴの有無。以下はMashと話した今後のプランの方向。

| プラン | 今後の方向 |
| --- | --- |
| Free | 既存の「ソフトペーパー」「静かな夜」の2色から選ぶ。 |
| Plus | 既存の画像設定に、単色の背景を数色加える。文字サイズと配置は、初版の編集項目の候補。 |
| Premium | 書体と文字色を選べるようにする。背景色と文字色は、色の種類に加え、単色以外の表現も選べる方向で考える。グラデーションはその例。 |

文字サイズ・位置、使える色や表現の具体的な範囲、プランごとの初版の項目は今後詰める。プレビューで調整した見た目が、保存・書き出した画像にも反映されることを確認する。

### わたしマップの分析結果と表示

本人が大切にしていることが選択にどう表れるかを読み、記録が支える範囲で、主要な自己構造を**最大3つ**、見出しと文章で伝える。**分析結果として結論を示す。** 環境や相手が変わると、その人が引き受ける役割や行動も変わる。場面ごとの出来事と選択をつなぎ、その人が何に目を向けて何を重く見るか、どんな条件でそれが選択に表れるかを結論に含める。結論の数は根拠から読めた範囲で決まる。

Mashの「座標」の例では、相手との関係の中で自分がどう見られ、どんな位置や役割に置かれるかに注意を向けていることが、観測した構造。見出しには、観測した構造に合った短い比喩や普段の言葉を使い、本文で具体的に説明する。何を主要構造とみなすか、どこまで言い切るかの分析方法は今後Mashと詰める。

画面では主要構造ごとに文章を読み、選んだ構造に関係する部分だけを小さな図で見る案を検討する。根拠の履歴や元の記録をユーザー向けのわたしマップには表示せず、分析結果の照合・更新のため内部で保持する。

### Mashの観測をアプリに移すために確かめること

Mashの観測では、**実在する相手と話して、返ってきた答えを受けながら次の問いを選ぶ**。そのやり取りの途中で、それまで出ていなかった出来事や条件が、相手の言葉から初めて出てくる。華恋はこの流れを、先に揃えた複数の出来事の記録を見比べる作業に置き換えていた。今回の訂正は、出来事が話に出るまでの問いの進み方も、Mashの観測をわたしマップに移すうえで必要な対象だということ。11/2の架空の複数場面や今回の固定した架空記録を、この対話の実演として扱わない。

このやり取りを華恋がどう学び、分析の実装や4Bの教材に移せるかは、まだ方法が決まっていない。今回の成果は方針と訂正の記録。わたしマップの分析方法の確定、実演、学習、実装は今後の作業。

<a id="karen-observation-theory-20261123"></a>

## 9.262 華恋の観測理論と構造分析理論を通常経路で使う（11/23 JST）

Mashは、Mashの対人観測能力のトレースをここで終了し、既に渡した知識・資料を基に華恋自身の観測理論と構造分析理論を作り、EmlisAI・わたしマップへ使うと決定した。§9.261末尾の実演・トレース方法探しは、この決定で終了。§9.257–260の共感、プラン差と自己理解、§9.261のPieceとマップ表示の方針を引き継ぐ。

今後の作業では[理論本文・本人への返し方・根拠と適用範囲](Cocolon_Karen_Observation_and_Structural_Analysis.md)を先に読み、当回の返し方と主要構造のどちらを変えるのかを確かめる。Emlisの文章は、本人の言葉を受けたからこそ出る共感を重く見る。マップは、対象ごとの思考と行動から役割を読み、一つの候補が別の場面や反対に見える選択も説明するかまで戻って確かめる。自己認識、実際、理想、気づいた時点を分ける。比喩は選び方の仕組みを本人が理解できるところまでほどく。原入力と本人の有効な補足だけを本人の言葉として他の機能へ渡す。

資料の来歴と採否は理論本文§§5–6に記載した。Mash提供のnote六編は添付テキストを使用。3–5月の自己分析原本5件、過去の対話ZIP、過去に二人へ届けた完成文を追加照合した。私的な対象者の原文・呼び名を学習素材にしない。通常の作者、受領、保存・再読、画面表示、実4Bの文章品質はそれぞれ実測に基づいて更新する。

### 11月23日の実装と実4Bでの判定

- EmlisAIでは、Freeは当回、Plusは関係する本人の履歴と当回の違いを使う。自己理解の保存形式にある感情値を本人の気持ちとみなさない。発行済みの問いに本人が答えた場合に限り、対応する問いと答えをそれぞれの発言として生成時に渡す。明示選択で使う作者v13／v16を実装した。従来のスレッド作者は既定v10。[初回・自己理解・履歴の変更](https://github.com/MassyuRed/mashos-api/commit/ac2b8b9a9b7b5ebb6ea08464c647021f01b44b8c)・[本人の回答と問いの対応](https://github.com/MassyuRed/mashos-api/commit/0ab47b2d27b7e467af8d83fcb398b373b3127de7)
- Emlisの実4Bは5候補・計31件。ラジオのFreeは初めて音楽が流れた本人と一緒に喜び、Plusは前回の雑音を踏まえて今日の嬉しさを受け取った。同じ材料のPremiumはPlusと全文一致。Premiumの実マップ・こころグラフを本人と原入力まで再照合する接続は残る。v13の未回答スキップでは内面を補い、v16の回答後は「重さの重さ」と重複した。両者を既定には昇格させない。[候補別の入力・実応答全文・商品としての判定](../../observation_learning/trials/2026-11-23-karen-observation/product_read.md)
- わたしマップには、根拠を持つ最大3つの主要構造を生成・検査して配信用データに出す経路を追加した。現行・月次の画面で、各構造の見出しと本文が先に読める。タップでその構造に関係する部分だけを表示する。本人向けの根拠履歴表示は外し、内部照合には保持する。旧保存形式を読める。新形式の生成は明示的に選んだモデル設定だけが対象。[生成と配信用データ](https://github.com/MassyuRed/mashos-api/commit/723254d66e083907c2c6486234f43dc7a9156ed8)・[結論と二つの場面をつなぐ最終生成](https://github.com/MassyuRed/mashos-api/commit/60310ea0ea2ff07ab4fc7e8f4c4814062afed280)・[アプリの表示](https://github.com/MassyuRed/Cocolon/commit/658a1520d0cde6ad59c8c28942f628673629fb2d)
- 同じ架空2記録の最終分析を実4Bで2回比較した。どちらも2件の本文の帰属を保った。初回は行動の列挙、修正版は「誰が決めたか」という比較に届いたものの、見出しと結論が同文で、本人が重く見たものを言い切れなかった。二つとも本人向け主要構造として不合格。修正したCMEEに2回目の原本を通すと、根拠・通常マップを保持して主要構造は0件になった。通常GPUは各回で元の提供に復元し、同じ入力に対する同じ本文の受領を確認した。[重複のある主要構造の公開を防ぐ変更](https://github.com/MassyuRed/mashos-api/commit/f4dd79fbbf70500845b9f71c576fc6e0939ad3b8)
- 次の受入れでは、FreeとPlusを先に、嬉しさ・つらさ・自己理解について、本人にかける二文目まで読む。問いを出すとき、答えたとき、飛ばしたときはそれぞれの全文を読む。マップは別の題材と逆の選択で同じ説明がどこまで成り立つかを試し、結論・敬語・説明のすべてで判定する。Piece・DeepInsightには本人の原入力と実際の補足だけを渡す。今回の隔離試験に本番のモデル切替、ユーザー記録への保存、アプリ配布は含まない。
