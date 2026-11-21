# AR-01：依頼者・未記載の受け手を分ける候補の24実比較

2026-11-09 JST。**候補は通常不採用。APIはc6555fd5のまま、AR-01は継続中。** 保存・再読込の成功と本文の意味品質を分けて記録する。

## 今回回収・改修した責務

詳細設計§9 AR-01／D07・D08・D12・D16に沿って、既存の原文witnessから「依頼した人」と「依頼を受けた人」を分けて現在の単一本文作者へ渡す限定候補を作った。旧Evidence Ledger／Grounded Observation Planの原文分割・引用外判定を使う現在のfinite readerを起点に、肯定・過去・事実の受動「頼む」、CURRENT、受け手UNSTATEDの既存witnessだけを研究用補助へ投影した。通常の補助OFF、原文・参照・SYSTEM、引用／訂正／補足等の除外は維持した。新parser・作者・controller・型の追加、出力の書換えはない。

旧v3も同種の未記載受け手へ一般的な行為者／相手を渡して失敗している。今回の依頼役割名への限定投影を、未試行の新能力や意味採用の完成と扱わない。これは**旧失敗に近い仮説を実比較で棄却した記録**である。

候補のsource2pathは[研究用patch](request_roleframe_source_candidate.patch)に保存する。API通常sourceへ適用しない。patchはc6555fd5のpreimageから適用可能で、適用後は実比較のsource SHAと一致する。テスト差分には既存の架空開発入力が含まれるためprivate保存とし、公開patchから分離した。入力を後から変えて検証済みにする操作は行っていない。

## 実行と比較範囲

| 項目 | 実結果 |
|---|---|
| source | 新しい架空6件＋既使用役割対照6件。教師targetなし・学習なし |
| 実モデル比較 | 同12source×補助OFF／候補ON＝24新生成、全HTTP200／stop |
| 時間 | HTTP比較loop45.165514秒。請求額・レンタル総時間は未測定 |
| 制御 | 対象3組だけmessages／本文変化、非対象9組は両方byte一致 |
| 原本 | 全12で原source／参照不変。候補でも通常OFFのmessagesはbaseline一致 |
| token | 実tokenizer最大1118input token、truncationなし。bytesをtoken数へ換算しない |
| 負荷・提供 | 学習0・新load0・retry0・pause／復元0。同PID26784・server source・Analysis重み不変、health200 |
| CPU検証 | 267 PASS＝meaning126／cognition47／budget23／application71。17.09秒、既存warning1、PGlite0.5.8 |

実GPUはRTX4000 Ada Generation／20475MiB、自然文は既存のQwen3.5-4B baseを使用。Analysis adapterも変更していない。新6件は二欄の完全一致では旧教師36／評価26／診断8と重ならないが、同じ意味失敗の近傍でありblindな一般化試験ではない。旧6件は既使用の開発対照である。

## 全文読解と不採用理由

rootと独立担当が全12source・24本文を読んだ。依頼があったことを述べた直後に依頼成立を未記載とする、明記された依頼者を未記載へ移す、受け手の未記載を承諾した人物の未記載へ変える誤りが残った。選択感情がEmlis側の受け取り方へ移る曖昧さもある。**依頼者known・受け手NOT_STATED・承諾NOT_STATEDを別対象のまま本文へ保てていないため通常不採用。**

変化しない9組も意味合格9件ではない。引用話者から物品の渡し手を発明する、同僚が依頼されたのに本人の承諾へ移す、受動の希望を能動へ反転する、返却の意向を決定へ強める、未記載の安心を追加する既存誤読がある。一方、範囲内で自然な受取りを保つ短い返答もあり、短さや全事実の再掲不足だけを失敗理由にはしない。独立AI読解はMashの正式受入れではない。

## 同じ24本文の保存・再読込

実HTTPのrawだけを、変更前12／候補12の別processで現provider・既存`_process_natural`・隔離PGliteへ一回再生した。候補phaseは候補の実prepareを研究context内で呼び、capture materialやSYSTEMを直接注入していない。全24で実capture payload一致、FINAL保存・同／新service GET一致、既存outer strip後の本文hash一致。語句書換え0、USER sourceとGET thread／events不変。GET時provider／reader／Engine0、新生成・retry・実Supabase要求0。context退出後は通常OFFへ戻る。

source参照はcapture／SQLで12一致、user_id投影差12は両参照を保持して各再計算した。readerは全24 UNASSESSED、50節のparsed／checkedは0、全文coverage=false。**保存されたことを意味合格・reader完成へ換算しない。**

## 保管と次の実装先

[本文なし集計](request_roleframe_summary.json)とsource-only研究patchを既存trialへ保存。全入力・実messages・24raw・全読解・tokenizer・SQL・privateテスト差分はprivate成果物へ保持する。Pod出力ZIP50,238bytesのSHAは`c35cdd9944172afa65b7ea76454052d16ef843e1071c38be0fd3272f6ab31957`、CRCと全13memberの原bytes／hashを回収時に照合した。GitHubのsource moduleをprivate ZIPへ複製せず、既存commit＋公開patchの再構築先とhashを残した。

次は役割名の追加promptや今回と同じ学習周回へ戻らず、既存`preparation.prepare_emlis`／`receive_candidate`→`emlis_semantic_admission.prepare_model_snapshot`／`_model_meaning_packet`→現`natural_reply`の単一作者、という意味採用と本文生成の接続を改修する。依頼者・受け手・承諾を別claim／refに結び、原文位置の一致だけで意味対象の束縛成功としない。

旧`native_bindings_v2`のsource／case／person_stated_unknowns分離と`emlis_stage1_response.project_direct_argument_bindings`のpropositionへの対応付けを部品回収先にする。ただし前者の限定grammarや後者のSELF感情に限る範囲を超えて全関係読解として採用しない。旧BOOK／SHOP専用説明・全文文字位置表・固定三欄rendererを通常naturalへ復帰させない。これは具体的な次の改修先であり、現4Bの遂行を実証済みとはしない。

今回Render配置・実DB・RN/build・通常model設定変更0。**STRUCTURE_MAP_DELTA_NONE**：拒否した研究patchの保管のみでactive API・作者・型・wire・保存責務の差分なし。AR-01・AR-02〜08・必要全資産活用・通常意味品質・本人端末／正式受入れは未完了。AR-02は設計どおりAR-01の一般品質完成を待つ前提にはしないが、今回は未着手である。
