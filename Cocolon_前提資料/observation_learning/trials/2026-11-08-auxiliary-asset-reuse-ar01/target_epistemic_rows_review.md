# AR-01 行形式の意味候補と、CMEE明記状態から実本文への比較

2026-11-09 JST。詳細設計§11.2／weekly第10回§30を継承。**実モデルの意味候補は行形式でも4件すべて拒否。別比較としてCMEEの有限原文読取を既存作者へ渡す4本文を取得し、状態を保持して渡しても本文で依頼者／受け手が反転する残件を確認した。通常不採用、AR-01継続中。** Primary outcomeは`BLOCKER_NARROWED`、新商品品質creditは0。

## 今回の実装と旧資産の利用

基準APIは`c6555fd5b81cd4ecda1bafdec60aa311c9e7feea`。前回研究patchを別copyへ継承し、通常defaultは変えていない。全体図・全ファイル地図の01／01A〜C、三中核入口・Emlis／CMEE map、最新現在地・weekly・詳細設計と、実sourceを照合した。全tree所在と全blob意味読解を同一視しない。

旧`named_reference_wire.decode`は旧意味＋本文schema固定、`fixed_rows_reference_wire.accepts_material`はBOOK／SHOPの特定回答source固定であり、条件を緩めて今回へ流用しない。回収したのは厳密JSON読取・固定cell型検査・alias解決・quote位置照合の部品である。

| 現owner | 今回の変更・再利用 |
|---|---|
| `natural_reply_epistemic.py` | 明示研究format `cocolon.cmee.target_epistemic_rows.v1`。全原欄の住所表を作り、モデルに欄・対象引用・根拠文引用・状態・originの5セルを選ばせる |
| 同decoder | `named_reference_wire.loads`／`decode_atoms`、`fixed_rows_reference_wire.strings`と既存quote compilerを再利用。core／schema／内部claim ID／evidence番号だけを機械復元し、意味値は補修しない |
| `preparation.receive_candidate` | 新formatを明示した場合だけ専用decode。実raw／finish／formatを保持し、原欄の位置照合後も未採用候補のまま |
| `ModelCandidateSource` | 対象認識profileとの組合せを限定。既存の一回呼出し・token／期限・実raw受領を維持 |
| `natural_reply_epistemic.prepare_source_status_snapshot` | 既存`source_status_witnesses`の明記状態を同じ候補契約へ変換し、既存受領・snapshot再開・単一natural作者へ渡す明示offline比較用pure接点 |

住所表はmemo／memo_actionの両方を含む。正解の欄・対象・状態・件数・quoteをgeneratorへ渡さない。decoderは誤欄から別欄を検索せず、全文targetを正しい部分へ切り直さず、欠けたrowや状態を補わない。旧quote／named／fixed-rowの適格条件も維持。独立source reviewが隠れた意味補修・条件緩和なしを確認した。

最終sourceは**434 PASS、18.21秒、既存warning1**。三状態・二欄、誤target／statement／state／origin、source資格、raw再開、既存境界・application／SQLを検証した。行形式だけの版は427 PASSで、その後のnative helperも同じ関連suiteで再検証。合算を成果件数にしない。

## 実比較と出所の分離

承認済み架空16のうち、前回と同じ対象4入力を原文・選択値・日時・参照不変で使用。前回actual18の基準4実本文を比較対象として再利用し、基準の再生成は0。非対象を含む元8入力の通常材料・SYSTEM・参照が前回と全一致することを確認した。今回のモデル呼出しは次の8回だけ。

| 段階 | 新しいモデル呼出し | 実結果 |
|---|---:|---|
| 行形式の意味候補 | 4 | 全HTTP200／stop、13.755983743118122秒。全INVALID_FORMAT、モデル意味採用0・モデル採用由来本文0 |
| CMEE原文由来の限定状態を渡す本文 | 4 | 全HTTP200／stop、8.656390697928146秒。4snapshot・計7対象状態を渡した実本文を取得 |

累計比較処理は**22.412378秒**、max8call／240秒内。転送・CPU検査・読解は比較処理時間へ含めない。実tokenizer最大1058input、切詰めなし。モデルraw／候補row／本文の修補・再生成retryは0。

行形式4rawは裸識別子、未定義値、cell欠落等でJSON不成立。さらにtarget全文化・根拠節欠落・依頼節からの未決定追加があり、引用符だけを直しても意味は成立しない。同じ自由JSON／row指示の追加試行を終了した。

次の4本文は別手法である。CMEEが既存の有限readerを同じ4原入力へ適用し、明記された状態だけを候補契約へ写して作者へ渡した。入力別の正解表・新語彙規則・評価goldは追加していない。

このpacketは**モデル出力ではない**。providerは`CMEE_NATIVE_FINITE_WRITTEN_STATE`、model／revision／usageはnull。受領protocolの`stop`はnative adapter完了標識で、モデルfinish観測ではない。deriveとvalidatorは同じwitnessを共有するので、独立した意味判定の成功でもモデル意味採用成功でもない。拒否時の通常fallbackには接続せず、明示した研究比較として固定した。

## 全文比較と採否

root・独立担当は4原入力の全項目、行形式4raw、native4snapshot（7対象状態）、前後8実本文を全文確認した。snapshotは未記載6対象＋未決定1対象を原文どおり保持。実入力の明示不明NOT_KNOWNは今回の4件に含まれず、局所検証と区別する。

| 入力ID | 実本文の結果 |
|---|---|
| NI | 選択値・時刻のメタ列挙は減るが、頼まれた人を誰に頼まれたかへ変え、既知の依頼者を未記載化 |
| KARA | 依頼成立・依頼者、受け手と承諾の未記載を保持。末尾は選択された平穏から受容態度へ少し読み足す |
| EXPLICIT_SELF | 本人への依頼・未決定・弱い不安を保持。正常範囲の短い言換え |
| TRANSFER06 | 未記載→未決定の追加は消えるが、誰が頼まれたかを誰が頼んだかへ変え、既知の依頼者を未記載化 |

全4本文に確認質問の混入はない。局所差があっても、より基本的な役割対象の矛盾が残るため**通常不採用**。構文を簡潔にしたこと、native状態の保持、本文保存を商品意味品質へ換算しない。blind一般化・Mash正式受入れも未成立。

## 保存・再読と実行環境

旧基準4＋新native本文4を、現prepare／provider／service＋隔離PGliteへ再生し、8件すべてFINAL保存・同／新serviceのGET一致を確認。既存outer strip後の本文hash一致、語句書換え0、実DB要求0、生成0、retry0。USER source・GET thread/events不変。GET provider／reader／Engine／prepare／意味採用・受領も0。private reportは公開DTOに出ない。

native packet4件は同じrawをSQLの既存親source投影へ再受領・再採用した。packet／意味値は同一、metadata由来のtarget／statement参照だけ再導出し、ID文字列を直接置換していない。基準payload4はcapture一致。native本文payloadは1一致、3件は架空user_idを既存SQL投影が含めないためtarget_refだけ異なる。**この3件を変更後payloadで実生成済みとはしない**。同じ実本文rawを再導出payloadに対してMockTransportで返す保存互換の確認である。SQL投影を変えてcaptureへ合わせていない。

source参照は基準＋native合計2一致／metadata投影差6。snapshotのpure再開とprivate保全は確認したが、通常threadのmeaning checkpointへnative snapshotを永続化した実証ではない。reader8reportは全未判定、18節checked0、全文coverage=false。

学習・新load・provider retry・共有server再起動0。同PID26784、serving source `f95fc7ce…`、Analysis adapter/configは前後一致、health HTTP200。総請求額は未測定。API sourceはc6555fd5、Render配置・実Supabase・RN/build・通常model設定の変更0。

## 保全と次の一作業

両Pod ZIPのCRC・全memberのbytes/hashを確認し、pack／source manifest／runnerを凍結入力と照合。全private入力・messages・旧基準4raw・今回8raw・native候補／snapshot・root／独立読解・SQL・test／runnerを、既存artifact `Cocolon_CMEE_AR01_TargetEpistemicRows_20261109.zip` のversion1へ保全した。47member／204839bytes、SHA256 `f999733a9e9c196673ccc43d98c16567af9e14efb66483970118d5b0abcbcb00`。準備version0は保持。

Library IDは`libfile_fde3_f-5cffeb6bae608191b823c2dde1ed0ede_2f7470f963808191aaebf050935e72de`。研究source5pathの[patch](target_epistemic_rows_source_candidate.patch)はc655 Git blob preimageへ適用し、最終source bytes一致を確認した。入力を含むtestや評価原文は公開patchに含めない。

次は**既存meaning ownerで依頼者／頼まれた人の能動・受動の方向を別命題として保持し、対象付きの認識状態とともに現単一作者へ渡す改修**。状態だけのliteral targetでは作者が方向を崩すという実結果から進める。形式指示の周回、rawの修補、native候補をモデル成功へ換算する方法へ戻らない。

`STRUCTURE_MAP_DELTA_NONE`：通常不採用の研究patch保全であり、active APIのowner／profile／wire／保存責務は追加していない。AR-01・AR-02〜08・必要全資産の活用・本人端末／正式受入れは未完了。AR-02を一般AR-01完成の全面待ちにはしないが、今回の着手は主張しない。
