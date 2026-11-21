# AR-01 対象別の認識状態を意味採用へ通す研究実装と実18生成

2026-11-09 JST。詳細設計§11.2・weekly第10回§29を継承。未記載を未決定へ変えてしまう実測問題に対し、旧資産を使う独立した意味採用から、現在の自然文作者へ渡す接点を実装・実検証した。**研究実装は368局所検証を通ったが、実モデルの意味候補は6件とも受領段階で拒否され、通常不採用。対象本文の改善は未実証、AR-01は継続中。** Primary outcomeは`BLOCKER_NARROWED`。商品品質creditは0。

## 実装と再利用した能力

API基準は`MassyuRed/mashos-api`の`c6555fd5b81cd4ecda1bafdec60aa311c9e7feea`。前回不採用の依頼役割ラベルpatchからは作らず、この基準sourceの別copyを使用した。

| 現接点／旧資産 | 今回の研究利用 |
|---|---|
| `preparation.prepare_emlis`／native source identity／`receive_candidate` | 原欄とrequestを保持し、実raw・finish・model情報から候補を受領。受領を意味採用と混同しない |
| `emlis_ai_evidence_ledger_service._split_source_text` | 既存の原文節境界を使用 |
| `emlis_ai_grounded_observation_plan._top_level_text` | 既存の引用除外を位置を保ったまま使用 |
| `emlis_semantic_admission.prepare_model_snapshot`／厳密receipt再検証 | 明示研究profileだけ、新しい有限の対象／状態検査へdispatch。既存profileは維持 |
| 新研究補助`natural_reply_epistemic.py` | 本人が明記した対象句・NOT_RECORDED／UNDECIDED／NOT_KNOWN・対象引用・根拠文を別に照合し、source付きsnapshotを作る |
| `ModelCandidateSource` | 同じ一回呼出し・token／deadline・raw受領を使用。新profileは明示opt-in、既存呼出しは維持 |
| `natural_reply.prepare_natural_reply` | 採用snapshotを原sourceから再検証して対象別状態だけを既存単一作者へ投影する研究引数。既定は`None`、通常材料・SYSTEMは維持 |

対象句の参照・根拠文の参照・状態を保存し、再開時はrawと全束縛を再検査する。原欄にない情報を不明と推定しない。本人の訂正・引用内の発言・疑問形・改行で継続する否定・修飾等は今回の有限scopeから除外。裸の人物topicや文書を書いていない動作を、未記載情報へ誤変換しないための限定も検証した。新しい一般日本語parser、依頼イベント全体の参照解決、全役割／全意味採用を完成したとはしない。

独立担当が主体混同・疑問符・改行継続を指摘し、rootが因果箇所を修正した。研究source4pathの差分は[patch](target_epistemic_source_candidate.patch)、基準Git blob preimageと一致を確認し、別rootへ適用して最終sourceのbytes一致まで確認した。評価入力を含むtest・runner・比較材料はprivateへ分離した。

## 実行した比較

前回承認済みの架空16入力から、原文・選択値・日時・参照を変えず8入力を選んだ。前回の16入力・32callを再実行したものではない。意味採用対象4入力と対照4入力。新private sourceは追加していない。

| 段階 | 新生成 | 実結果 |
|---|---:|---|
| 通常基準本文 | 8 | 全HTTP200／stop |
| 初回意味候補 | 4 | 全`INVALID_FORMAT`、意味採用0 |
| 非対象control本文 | 4 | 全HTTP200／stop、材料・本文とも基準とbyte一致 |
| flat出力形式の最小修正後、未記載／未決定の2入力 | 2 | 全HTTP200／stop、両方`INVALID_EVIDENCE`、意味採用0 |
| 意味採用した対象の候補本文 | 0 | 採用なしのため生成せず。基準本文や合成意味で埋めない |

合計**18 unique生成**。当初max20call／比較処理240秒を維持し、3比較processの累計は**83.68176182289608秒**。転送・CPU梱包修正・読解の待ち時間はこの比較処理時間に含まない。実tokenizer最大680input、切詰めなし。2回の意味生成版は別messages／source SHA／phaseとして保持し、旧rawの修補・差替えは0。

途中、転送closureに`emlis_semantic_admission`がなくCPU preflightで検出、新生成0で補完した。続いて`fixed_rows_reference_wire`の遅延importが漏れ、基準8＋意味1を得た21.600969秒で停止した。元complete／9rawは不変保全し、同rawの0生成再受領で不足部品を特定・補完。その9件を再生成せず、未取得7件だけを継続した。累計16件／63.585534秒の後、観測済み形式不成立に対するflat記述修正を残4call枠で2意味候補＋採用時のみ最大2本文に限定し、実際は2意味候補で終了した。packaging失敗を成功履歴へ上書きしていない。

## 全文読解と採否

root・独立担当が8入力の原欄／選択値・12実本文・6実意味候補をすべて読解した。短い正常な受取りを、書かれていない項目の省略だけで失敗にしない。対照のbyte一致を意味合格へしない。

初回4候補は入力の`output_shape`を出力へ写し、根拠配列の階層を誤った。3件は状態候補も空。明示未決定の1件は状態名が原文と合う一方、日本語claim ID・不正field path・全文target等で採用不能だった。

flat記述への変更でroot階層とASCII識別子は改善した。しかし、未記載入力ではaction欄の依頼文をmemo欄の根拠として指定し、承諾と受け手の対象を抽出できなかった。明示未決定入力ではtargetを状態記述込みの全文にし、statement根拠には別欄の依頼文を選んだ。両方とも`core`へ原文を入れる誤りもあった。**形式だけを原因と確定できず、原欄→対象→状態根拠の対応が未成立と狭まった。** 全6候補はreceipt層で拒否され、新しい意味validatorへ実候補が通った成功例は0。合成packetを含む368局所検証を実意味採用成功へ換算しない。

| 本文の開発入力ID | 今回の所見 |
|---|---|
| NI | 基準のみ。依頼は保持するが、選択値・時刻を列挙する台帳的な返答。対象候補本文なし |
| KARA | 基準のみ。依頼と承諾記載がないことを述べる短い受取り。対象候補本文なし |
| EXPLICIT_SELF | 基準のみ。本人が依頼を受け、今日は承諾を決めていないことと弱い不安を保持 |
| CORRECTION | 対照前後同一。同僚への訂正を述べながら、承諾の対象を本人へ移す誤りが残る |
| TRANSFER06 | 基準のみ。未記載を未決定へ変える誤りが残る。対象候補本文なし |
| NEW01 | 対照前後同一。承諾済みは保持するが、未記載の仕事の追加と一人称的な貼返しが残る |
| NEW02 | 対照前後同一。平穏と頼まれなかったことを保持する正常な短い受取り |
| NEW04 | 対照前後同一。依頼と驚きを保つ自然な短い受取り |

同promptの追加試行は終了。通常採用、一般化、Mashの正式受入れ、商品品質改善の成立は主張しない。

## 保存・再読・提供状態

実本文12件（基準8＋control4）だけを、実prepare・現provider・既存service・隔離PGliteへ一回ずつ再生し、12件すべてFINAL保存、同／新serviceのGET本文一致を確認。providerの既存外側`strip()`後の本文hash一致、語句書換え0、retry0、実DB要求0。GETはprovider／reader／Engine／prepareに加え新意味採用／受領の呼出しも0。USER sourceとGET時のthread/events不変、private reportはDTOへ出ない。

12本文の生成payloadは全capture一致。source参照は1一致・11件に既存SQL親sourceが架空`user_id`を含めないmetadata投影差があり、両参照を保持。実意味snapshotが採用された例はないため、SQLへのsemantic再束縛成功は0件。対象4候補本文は未生成のまま。reader12reportは全未判定、23節checked0、全文coverage=false。保存を意味品質へ換算しない。

最終sourceで関連**368 PASS、17.46秒、既存warning1**。対象／状態の独立検査・誤根拠拒否・raw再開・source変更・既存model境界・natural application／SQLを含む。GPU実候補の成功を代替しない。

学習・新model load・provider retry・共有server再起動は0。同PID26784、serving source`f95fc7ce…`、Analysis adapter/configは前後一致、最終health HTTP200。総請求額は未測定。API sourceはc6555fd5のまま、Render配置・実Supabase・RN/build・通常model設定の変更0。

## 保全と次の一作業

3つのPod出力ZIPはCRC・全manifest memberのbytes/hashを確認。入力pack／source manifest／runnerは凍結材料と一致し、元9captureと継続記録先頭9captureも完全一致。private原本は`Cocolon_CMEE_AR01_TargetEpistemic_Actual18_20261109.zip`（58member／208,879bytes、SHA256`6576b251488dab1296ffec8fee509c808a2b96c60109e9df723444cbe9d595c8`）へ保存。全入力・messages・18raw・受領／拒否・旧失敗記録・2版patch・独立／root全文読解・test／runner・SQL原本を含む。

Library file IDは`libfile_fde3_f-1ce505b2a50881919c979afb1e758874_2f7470f963808191aaebf050935e72de`、version0。保存後readでidentity／version／208,879bytesを確認。準備時点の旧artifactも上書きしていない。

次は、**既存の意味候補契約・符号化部品を使い、モデルの原欄・対象句・根拠節の選択を成立させ、現在の意味採用→単一自然文作者へ通す改修**。新しい意味goldを実応答へ注入せず、raw修補や同じ自由JSON指示の反復で代替しない。今回の限定読取りを一般的な主体／対象束縛の完成として扱わない。

`STRUCTURE_MAP_DELTA_NONE`：保全するのは通常不採用の研究source差分で、active APIのowner／module／型／wire／保存責務は追加していない。AR-01、AR-02〜08、必要な全資産の活用、本人端末／正式受入れは未完了。AR-02を一般AR-01完成の全面待ちにはしないが、今回の着手は主張しない。
