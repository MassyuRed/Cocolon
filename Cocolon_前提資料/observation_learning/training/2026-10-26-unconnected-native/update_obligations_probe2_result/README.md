# 更新義務指示を具体化した非学習2件 — 実行終了、CMEE意味・本文0/2

2026-10-28 JST。**CONSUMED_COMPLETE_NOT_ADOPTED**。Mashの「進めていいよ」を受領し、[準備候補](../update_obligations_preparation/README.md)の一回だけをJupyterで実行した。追加学習0、保存d431の非学習load1、BOOK/SHOP回答後を各1生成。両方EOS、strict JSONは1/2、未変更CMEEの意味採用0/2・本文成立0/2。更新義務の列挙だけでは意味・本文の不成立は解消しなかった。新観測会は現不具合の解消には不要。

## 実行と費用

- Pod94a06hhxu51uy4／NVIDIA RTX A5000、固定Qwen/Qwen3.5-4B revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`、保存adapter `d431a07ce227c05e81eca5afb9461d91cf8101d50af0d27ec1a81844ce8ac684`。CPUで確認した同じ入力・112重み・依存を使用した。
- 実source commit `8065009526cd6a1ddd42155ab050dbe0666d43ca`、API reader `64c6cb1a41620fd2d7690e0b6f1af30ae0e624a4`。API製品source自体は変更0、別copyの更新指示候補を使用した。
- [承認記録](approval.json)・[承認済plan](runtime/probe2.plan.json)の条件：学習0/load1/最大2call、各生成180秒、全体600秒、cap3712/context8192、$0.047処理按分上限、retryなし。前回のconsumed planは再利用していない。
- [実run](run/run.json)：291.55770153400954秒（約4分52秒）、$0.022676710119311858処理按分。$0.28/時から算出した処理時間分であり、準備・CPU・回収・保持・保存・通信・税等を含む総請求額ではない。
- BOOK入力4235/出力3108token、生成136.25370521401055秒。SHOP4401/3345token、146.3468665550463秒。EOS2、時間停止0、出力cap停止0、学習・optimizer・新重み保存・retry0。
- [実load112tensor](run/loaded_tensors.json)と前後adapter3fileのhashが一致。非学習読込時requires_grad=false、保存重み不変。
- [未変更CMEE CPU結果](run/cmee/diagnosis.json)：1.8747465109918267秒、追加model呼出0、意味0/2・本文0/2。採用snapshot0のためcold-file再読は対象なしであり、cold成功0/2という新しい失敗試験ではない。GPU/CMEE子process exitはいずれも0で、exit0を品質成功にしない。

## 全件の原文比較

| 対象 | 前回 → 今回 | 実CMEEの結果 | 残る不成立 |
|---|---|---|---|
| BOOK回答後 | 原欄にない引用3を含むINVALID_EVIDENCE → JSON成立・13引用の位置確認成立。ADD1だけ → 6ADD＋INVALIDATE_GAPの7列挙 | CANDIDATE_UNREVIEWEDの後、UNSUPPORTED / model_evidence_out_of_scope | 引用配列0..12に対してrelationは13..16を参照。ADDに各新relationの添付なし。no_contactのkind、反実仮想/現在懸念の時点にも教師差。本文で分かっていたことを気づかなかったことへ反転 |
| SHOP回答後 | 前回の有効JSON＋ADD1 → EOS終了だがstrict parse失敗。文字列上は7ADD＋INVALIDATE_GAPの8列挙 | INVALID_FORMATの後、REJECT / semantic_receipt_not_validated | candidateを閉じずevidence_quotes/別schema_versionを続ける誤階層・duplicate schema key・外側object未閉鎖。更新の前4項目が旧/新relationだけで、必要な新claim7役割を保持しない。引用index/否定scope/本人の知覚の扱いも未成立 |

BOOKの各claimには正しい自己引用が増えたが、relationには必要な全source quoteを作らず、存在しないindexを継続した。7という件数が合っても、新roleに付属するrelationと根拠を一緒に追加できていない。gap解消も存在しないindex16を参照し、空配列であるべきreplacement_refsにanswer_explains_targetを残している。

BOOK observationの「遅いこと自体に気づかなかった」は、本人の「遅くなると分かった時点で連絡しなかった」という説明と逆である。receptionは出来事と後悔と継続懸念を列挙して「全部受け取っています」と結び、update_noteは原入力と回答の長い再掲になっている。単に参照番号を直しても本人向け本文は成立しない。

SHOPはJSONとして採用できないため、有効候補へ修復・再parseしてCMEEへ渡していない。原文字列として読むと、ADDはaction_link/past_reference/answer_concession/distance_link/perceived_realization/answer_joy/felt_distanceで、shared_talk・no_joint_preparation・no_promise・answer_sadnessの新claim追加が欠ける。13..18等の参照は15引用の範囲や対応と一致しない。共同準備と約束の否定は完全文のscopeが不足し、distanceの引用では「少し離れてしまったようで」が落ちる。GAP解消のreplacement_refsも非空。15引用は原欄内の一意な文字列だが、誤階層のため受領成功ではない。

SHOP observationは当初の喜びに戻り、回答後に明らかになった喜びと寂しさの読みを統合していない。receptionの「と理解し」は本人の「と感じました」を置き換え、知覚の留保が弱くなる。update_noteには準備/約束の否定だけが残り、8更新全体に対応する説明ではない。

前回の実結果は[prior quote probe](../prior_quote_probe2_result/README.md)。両回とも同じd431・固定base・BOOK/SHOP回答後で、今回の差はupdates指示の具体化だけ。全15の新モデル評価、旧9回帰、新initial4件、実initialからの動的thread、未知入力、Piece/Analysis、通常service/本人端末の合格へ広げない。

## 判断と再開先

本候補は通常採用しない。**更新数の指示は出力の列挙を増やしたが、根拠との対応・関係付き更新・本人の意味を保つ本文を改善する十分条件ではなかった。** これはこの既知2件の比較で確認した限界で、4B全体の育成不能や未知入力性能を示さない。

次は既存教師と今回rawの差を使い、①claim/relationが実際の引用へ一貫して戻ること、②新roleと付属relationを一緒に更新すること、③分かっていたことの否定反転や知覚の断定化を避けることを、学習内容・出力負担の両面から見直す。CMEEの採用条件を緩めたり、生成rawを後から補修して成功へ変えたりしない。新しい入力候補・追加学習・別推論を今回の残時間で自動実行しない。同方式の指示追加probeや同じ30更新の反復を直ちに推奨する根拠はない。

教師は必要な引用・全更新・自然本文を既に持つため、現不具合を教材不足と決め付けてMashへ新観測会を求めない。別途進行中の観測材料収集の価値とは区別する。

## 原本保全・影響範囲

[原本ZIP](runtime_originals.zip)は58,899 bytes、19members（18payload＋manifest）、SHA256 `c7c0d1578599c7ae693258eddb979b26787abbb01657aeb895b016dcac0a015d`。[全member manifest](archive_manifest.json)のbytes/hashとCRC、実source/checker/CPU結果/eval入力の準備原本との同一性、承認済planの同一性、adapter前後3hashをPod外で確認した。ZIPと抽出payloadは同一bytesを保全し、runの「CMEE/body review待ち」という生成終了時statusも後から書き換えない。最終判断は[終了記録](receipt.json)に分けた。

`run/`はload記録・生出力2・未変更CMEE結果。`runtime/`は実plan・runner・consumer・既存CPU checker/結果・復元manifest・実eval入力。`logs/`はGPUとCMEEのstdout/stderr・exit。adapter重み本体は前の正規保全fileで保持し、GitHubへ再複製しない。

本作業はCodex Work/GPT-6で実行し、補助の原文監査と分担文書をrootが統合した。正式な別Pro/Ultraまたはhuman Product Readではない。primary_outcome=BLOCKER_NARROWED、商品0・正式0/3・管理54.50％、candidate_ready=false・automatic_progression=false。pytest0・production SQL0、通常API/DB/RN/DTO/Render/Supabase/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE（別copy入力の診断と原本追加、商品責務/型/wire/reader不変）。GPUのStop/restart/delete/新Pod/charge/管理console/API操作0、保持指示を継続する。
