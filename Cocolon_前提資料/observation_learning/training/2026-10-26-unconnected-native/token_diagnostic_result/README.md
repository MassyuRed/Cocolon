# 保存109c・15教材の語単位診断 — 一回完了

状態：**DIAGNOSTIC_COMPLETE_NO_GENERATION_NO_ADOPTION / ONE_RUN_CLOSED**。Mashが具体案d5a3d644へ「進めていいよ。」と承認し、source `53984cdf58f745b1f891b1da2b9bc36145623884`・Jupyter直接/PID171619で一回実行しました。追加学習0・新規生成0、15教材各1forward、再試行0。**28.46961408201605秒、処理按分$0.002214303099946119**で900秒/$0.07内です。準備・CPU確認・回収・保持・保存・通信・税等は別です。

同Qwen3.5-4B/revision851bf6e・同15教材/入力/教師/readerを固定し、保存109cの112F32/3,833,856parameterを非学習load、全値一致/no-gradで測定しました。source/base metadata/adapter payload hashは不変、全base shard再hashは今回未実施です。全結果は[summary](result_summary.json)、[実run](run.json)、[reload](reloaded_tensors.json)、[外側照合](external_verification.json)へ保存しています。

## 実測から分かったこと

旧9件は15,421target token全てtop1一致。新6件は10,716中203token不一致です。これは**正解prefixを毎回与えた既知教材の選択診断**で、自然な観測の成功率ではありません。

| 新教材 | target token | top1不一致 | 最初の不一致位置（0始まり） | 主な残差 |
|---|---:|---:|---:|---|
| BOOK初回 | 1038 | 15 | 577 | ID制約・本文/受け取り |
| BOOK回答後 | 3178 | 62 | 656 | 引用範囲・binding・根拠/参照・全更新・本文 |
| SHOP初回 | 1082 | 15 | 596 | 合法ID別名の逐語差と、別途本文/受け取り |
| SHOP回答後 | 3561 | 87 | 744 | 根拠index・否定scope・binding・全更新/更新説明 |
| REPOT | 961 | 2 | 761 | 本文の主客と受け取り表現 |
| KNIT | 896 | 22 | 118 | 引用句点・binding・不明・受け取り |

本文3欄（observation/reception/update_note）は380token中115不一致、30.26％です。全体の1.89％不一致に比べて集中し、新6件のNLL総和の59.65％を占めます。380にはnullのupdate_note4tokenも含み、自然文string値区間だけなら376tokenです。新6の外枠JSON_STRUCTURE386tokenとEOS6tokenは全てtop1一致でした。BOOK回答/SHOP回答/KNITの教師長3178/3561/896は従来3712cap内です。上限延長だけ・EOS学習だけで解決する根拠はありません。

REPOTの位置761は正解「してもら」rank3/logit16.625に対し「し」19.0を選びます。959/961一致でも主客が反転し、平均正解率では観測品質を表せません。位置779の「できて」→「した」は別の表現差です。正解prefixへ戻した後の「聞いた」は今回誤選択なしで、既存自由生成の後続「聞かせた」まで独立に弱いと断定しません。

BOOK回答の根拠6→1、参照配列の早い閉じ、SHOP回答の否定根拠8→7などは正解文脈下でも選択が弱く、更新・本文bindingの局所誤差も残ります。203不一致中4件は正解competition rank1の同点argmax違いですが、主客や一部根拠は明確なlogit差があり、全てをBF16丸めへ帰属しません。top5の値はlogitで確率ではなく、summaryに必要例のexp(-NLL)を別記しました。

全新6で今回最初の誤token位置は既存自由生成の最初の逐語分岐位置と一致し、選ばれたtokenは5/6一致しました。BOOK初回は今回remaining、既存rawは「気が」で、同じ誤tokenの再現ではありません。最初の逐語分岐を、最初の意味誤りや後続反復の原因確定へ置き換えません。今回、誤ったprefixからの回復は測っていません。

## ID制約と観測内容を分ける

固定API `6b043880` の `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_semantic_admission.py:1275–1290` はunknown_idへ `[A-Za-z0-9_.-]{1,64}` とID非衝突を要求します。回収したBOOK初回rawはkind/target_claim_refs/description/evidence_indexesの4fieldが教師と全値一致、問い参照も自分のIDと整合、claim/relationとの衝突もありません。日本語ID「気がかりの対象は未記載」だけが制約不適合です。従来のunknown_not_source_boundを、内容理解の誤りと一括りにはできません。

SHOP初回のmissing_reasonは合法ASCII別名で、同4fieldと参照が整合し、前回意味採用済みです。教師missing_explanationとの逐語差だけを意味誤りへ数えません。既存messagesにはASCII/64制約の明示がなく、**既存readerを変えず、出力条件へこの制約を明記することを次の最小修正として優先**します。ただしBOOK/SHOP本文・回答後全更新・KNIT反復も直るとは扱いません。今回入力・教師・readerは変更していません。

別に残る学習設計の候補は、全packet/旧9を保つ全文CEを残し、主客・本文・根拠・binding・全更新の局所的に弱いtokenへ損失を配分することです。先のS/F/U群平均balanced30の同じ再試行とは分け、係数/更新数/改善効果は未決・未測定とします。追加学習・新規生成・追試には自動進行していません。新観測会は今は不要です。既存教師への適合不足を、教材不足や4Bの能力上限と断定しません。

## 原本・保全と現行状態

[diagnostic_evidence_20261027.zip](diagnostic_evidence_20261027.zip) は1,032,831bytes、SHA256 `d2b94c69157c0976e6835f3e571d3b271979649ad66cec7519c500ddc29b7fae`。全44payload＋manifest=45memberをCRC/size/SHA256でPod外照合しました。[manifest](manifest.json) に全identityがあります。全15token report、実run/reload、source5＋準備CPU、凍結教材4、既存raw15、実launch/logを含みます。各case完全reportはZIPのrun/に保存し、summaryは全field/誤位置/必要例への索引です。重みは今回不変の既保存109cを参照し、adapter/base/optimizerはZIP非同梱です。

worker終了、Jupyter read-only nvidia-smiでA5000/1MiB/24564MiB、GPU稼働保持・Stop/restart/delete0を確認しました。一回閉鎖、承認枠再利用0。全体00・観測入口・training入口・file地図01A・weekly§74を同単位更新。**BLOCKER_NARROWED**と診断の限定TECHNICAL_CREDITのみです。通常生成の意味11/15・本文9/15・新6本文0/6、109c通常不採用、商品0/正式0/3/54.50％は不変。API/DB/RN/Render/Supabase/通常app/依存/価格/モデル選定/merge/deploy0、STRUCTURE_MAP_DELTA_NONE、candidate_ready=false、automatic_progression=false。実行環境はCodex Work/GPT-6系、root単一writer/実行owner、補助は読取レビューで、正式Pro/Ultra/human受入れではありません。
