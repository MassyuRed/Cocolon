# AR-01 — 依頼の役割結合と本文優先度の実比較

2026-11-09 JST。weekly第10回§31の「頼まれた人を依頼者の不明へ変える」残件を継承。旧finite role readerの能動・受動／格と、旧content selectionの意味保持と表示選択を分ける責務を、現単一natural作者へ接続して実本文まで比較した。**新8本文を取得したが方向反転が残り、通常不採用。AR-01は未完了。**

## 回収・改修した責務

- 既存`natural_reply_meaning._clauses/_FORMS/_participant`を使い、正の過去factである頼むeventを依頼者と頼まれた人の別slotへ導出。同じeventの対象付き状態とslotを束縛し、省略人物はUNSTATEDのまま保つ。評価対象名／正解表はgeneratorへ注入しない。
- 単一event・原文節の全被覆という限定。純粋受動の「頼まれた人」をsubject gapと読む有限解釈であり、相対節一般の参照解決ではない。能動／受動の誰が・誰に・誰からを対照し、曖昧な能動の「頼んだ人」、修飾された関係節、未対応依頼対象、未読節、複数依頼、既知人物と未記載対象の矛盾はHOLDする。空いているslotへ割り当てない。
- 明記状態の旧snapshot文字列をそのまま持つ版付きrole snapshotを追加。再開時に原文から全roleを再導出し、再hash済み改竄も拒否。既存status-only snapshotを黙ってrole版へ昇格しない。
- 旧`emlis_ai_content_selection_v3`から、意味inventoryを変えず別の参照planで表示を選び、非選択意味も保持する責務を回収。旧実装はrequired unknownをselectedにする。今回のNOT_RECORDED=context_onlyは現natural仕様へ合わせた研究用改修であり、旧policyの直接流用ではない。
- 追加variantでは全原文・role・状態を保持し、event／status位置を参照するforeground/context_only planだけを追加。context_onlyでも推測禁止は有効、foregroundも全件再掲義務ではない。planと専用SYSTEMを同時変更したため、plan単独の因果効果は分離していない。

nativeの状態7・依頼event4・状態→受け手slot結合3は同じ4sourceから導出。providerはCMEE_NATIVE_FINITE_WRITTEN_STATE、model/revision/usageはnull、stopはadapter完了標識。モデルraw／モデル意味採用／独立した一般意味判定ではない。同じrole snapshotを2phaseで使い、意味成功8件とは数えない。

## 実モデルの本文比較

同じ既使用架空4入力を各variantで1回ずつ実行。前回のnative state-only実4本文を基準として再利用し、新基準生成は0。原入力全項目・旧4本文・新8本文・各snapshotをrootと独立担当が全文比較した。

| 群 | 役割結合4本文 | 役割＋優先度4本文 |
|---|---|---|
| NI | 既知依頼者を述べながら、頼まれた人の未記載を依頼者の未記載へ反転 | 表面差のみで同じ矛盾が残る |
| KARA | 依頼者・依頼成立・承諾未記載を保つ短い言換え。受け手の再掲省略は正常 | 基本意味を保持するが依頼説明が重複 |
| EXPLICIT_SELF | 本人への依頼・承諾未決定を保持 | 今日未決定と不安を保持する一方、一人称的な感情再述で語り手が曖昧 |
| TRANSFER06 | 受け手→依頼者の反転に加え、未記載→未決定へ変化 | role版と本文byte同一、同じ二重の誤り |

新8本文に確認質問はない。context_onlyの対象に言及したこと自体を失敗とはせず、実際の対象／状態反転を失敗理由とする。短い受取り・適切な省略・一度の言換えを失敗にしない。通常不採用、商品品質credit0。全条件の一般化、blind評価、Mash正式受入れは成立していない。

## 実行と局所検証

| 項目 | 実測／限定 |
|---|---|
| 新規生成 | role4＋priority4＝8、各HTTP200／stop、retry0 |
| 比較処理 | role7.037911800900474秒＋priority7.434972285991535秒＝14.472884086892009秒。後phaseの累積時計14.472885576775298秒（集計時点差）。8call／240秒内、転送・CPU・読解待ちは含めない |
| 実tokenizer | role最大1247input、priority最大1212input、切詰めなし。source closure各93file |
| source整合 | 通常8入力のmessages・source ref不変。旧4status snapshot不変。priority falseのrole4messages不変。plan以外の材料とrole snapshotは両phaseで同一 |
| 局所検証 | role483 PASS／19.51秒の後、最終priority sourceで491 PASS／22.24秒・既存warning1。足し算で合格数を増やさない |
| 最初の転送 | role CPU事前検査で既存reader moduleの梱包漏れを検出し生成0で停止。未改変の依存1fileと更新manifestを補完後、12材料の実tokenizer検査を通して4生成。失敗logも保全 |
| 提供状態 | 学習／新load／server再起動0。同PID26784・serving source・Analysis adapter/config不変、終了health200。総請求額は未測定 |

## 保存・再読と品質を分ける

新8実本文を既存prepare／SelfHosted provider／service＋隔離PGliteへ通し、全FINAL保存・同／新serviceの非生成GET一致。既存providerの外側空白除去以外の本文修補0、新生成／実DB要求0。GET時provider／意味採用／Engine／reader／prepare0、USER sourceとGETのthread/events不変。通常の独立Safety・provider guard・保存を置換しない。

各phase4件のうちpayload1件はcaptureと一致、3件は既存SQL投影で架空user_id metadataが落ちるためtarget_refだけ異なる。同rawを再受領・role意味再導出し、意味値・原文根拠は不変。変更後payloadで新たに実生成したとはしない。source refsは新8中2一致／投影差6。role snapshotのpure再開とprivate保存を、通常threadのmeaning checkpoint永続化へ換算しない。保存reader report全8は一般意味未判定・全文coverage=false。

## 確定した故障範囲と次作業

この4入力では、原文・7状態・4event・3受け手束縛が実HTTP材料へ対応し、完成rawですでに対象／状態が崩れる。SQL／再読／UIが初めて作った誤りではなく、現単一作者への意味投影後から完成本文までの境界に問題が残る。ただし、補助情報を読まない理由、容量、学習、表現形式のどれが原因かは未確定。今回だけでcontent plan一般を無効とはしない。

同種の役割label／SYSTEM追加周回は止める。次は既存meaning ownerと現作者の間で、依頼方向・対象付き状態・語り手を自然な短文へ実現する責務を改修する。能動／受動・明記／省略・未記載／未決定を分ける原文付き対照、既成功control、別題材評価を使う。今回の失敗rawを採用教師へ自動変換せず、未知原因を断定しない。一般意味候補生成・AR-01は未完了、AR-02を一般AR-01完成の全面待ちにはしないが今回は未着手。

## 保存範囲・通常への影響

[本文なし集計](request_role_binding_summary.json)／[研究source patch](request_role_binding_source_candidate.patch)。patchはAPI作業source c6555fd5の確認済みGit blob preimageへ適用し、最終5sourceとbyte一致を確認。role-only実行版・priority版の別manifest、全messages/raw/receipt/snapshot、比較全文・SQL・tests/runnerは同private artifactの準備version0から結果version1へ保全済み（49member／253065bytes）。

APIはc6555fd5、通常採用false、Render配置／実Supabase／RN/build／通常model設定変更0。研究patch保全のみでSTRUCTURE_MAP_DELTA_NONE。新独立controller／承認chain／第二の通常作者／raw修補を追加しない。primary BLOCKER_NARROWED、必要全資産活用・AR-01〜08・本人端末／正式受入れは未完了。
