# 2026-10-28 — named入力内のprior表記統一と一回の実学習

状態：CLOSED_NOT_ADOPTED_NO_RETRY。今回の一回は実行・回収・Pod外検証まで終了。旧named9/named13も閉鎖・消費済みのまま保持する。

今回の目的は、BOOK/SHOPの回答後に、旧形式の採用済み解釈と新named出力指定が同居する実入力を修復し、既存の意味・引用・全更新・本人本文を実4BからCMEEへ渡せるかを確かめること。観測会を増やさず、出所付き既存教師を使う。

PR30 `ecc42b9f8be5342bdd9c4a8318ff08208f8f0c92` の全機能00・全体01/01A/B/C・current maps・全treeと最新weekly§88、work rules00/CURRENT_RULES/18、恒久incident、Karen-Diaryの指定入口を確認した。System Context追跡currentは8月snapshotであり使用しない。実行環境はCodex Work/GPT-6とJupyterのA5000。Pro/Ultra/human独立受入れを偽って名乗らず、別文脈agentはread-only補助に限定。rootが単独write/execution owner。

## 最終結果と保全

9更新→新b8bcb6f9別保存→112F32・3,833,856parameter完全一致/no-grad reload→各1生成を503.122286485秒、GPU処理按分$0.0391317334で完了。GPUexit0、deadline/OOM/非有限なし。元284f/d431/旧9ba8は不変、今回の新重みは通常不採用。原run/planのpending/authorized表示は実行時原本として凍結し、result_summary.jsonが最終閉鎖を所有する。

BOOKはprompt4382/3712token/159.155233秒/EOSなし、SHOPは4534/2539/107.492539秒/EOSあり。実receiverはTOKEN_LIMIT/INVALID_FORMAT→両REJECT/semantic_receipt_not_validated。旧key7種の混在は両rawから消え、BOOKの元4meaning保持には局所前進。ただし両rootのv入れ子、BOOK ur反復、SHOPの原入力への回答引用誤帰属/ADD0とproseの一人称string化が残り、全7・8更新/本人本文は未成立。[全raw読解](reading_review.md)で入力・prior・教師・実出力を全文比較した。実拒否と静的所見を分離し、意味readerのUNSUPPORTEDと混同しない。

全150payload+manifest/151memberの原本は16,176,277bytes、SHA256 ccf8352a5451559b4279e1ae2bdbdbd3c309b6818ed19bb9fe13904056fb6f04。Pod外で全CRC/hash/size、CPU ZIP同一、112tensorの初期/reload形状・F32・有限性を照合。追加重みSHA256 b8bcb6f9cc539c28c2412f0d0810dcae29dd1f225cea176682f3fc7a5772d9b3。Library libfile_51752dcc98948191bc630d38f7002589 version0へ別保全済み。元4B全base重みはこのarchiveに含まず、移行には固定base revisionも必要。

primary=BLOCKER_NARROWED。新観測会を要する教材不足は今の不具合には認められない。次は既存promptのroot型・prior/出力namespace・prose/updatesの型義務と完成教師の提示差へ戻る。同条件GPU反復、追加call、reader緩和やraw補修はしない。今回の新unitも消費済みで、次runの自動開始false。商品0/正式0/3/54.50％、未知/通常service/本人端末の合格なし、GPU保持/Stop等0。

## 修正と確認済み事実

API `c4e1ccb2768425d150c5848e9232e849dd3dc964`（親a8be7a9b）の2pathだけを変更し、remote全文/変更集合を照合済み。

- `ai/services/ai_inference/cocolon_meaning_experience_engine/model_candidate_source.py`：モデル向けprior copyを既存named表記へ可逆投影。role metadataもtime/mode/exprに統一。保存prior、native意味/本文、receiver、wire、通常経路は不変。
- `ai/tests/test_cmee_named_reference_candidate.py`：BOOK/SHOPのdecoder往復、全candidate/引用/ID/順序、material/保存bytes/quote経路不変、再現性の2検査を追加。

Jupyter CPU27.629086929秒、同7fileの349成功/失敗0/skip0、SQL12対象外。最初の検査起動は既存DB遮断stubを引き継がずsupabase_client未解決の収集error2で停止。実DB通信0のまま失敗code/logを別保存し、既存run_cpu_testsのDB遮断方式へ合わせて最終349成功。新依存追加0。

実15入力中の変更はBOOK/SHOPだけで、ほか13入力と全assistant教師/EOS tokenは不変。priorの意味・引用はdecoder往復2/2完全一致。BOOK prompt4422→4382、target2913、cap3712で8094/8192。SHOP4586→4534、target3238、cap3584で8118/8192。全15のmask/EOS/context、元284fの112F32有限性をCPU確認。学習順の総token57700/長二乗和398328382。CPU時model load/forward/学習/生成/SQL0、CUDA未初期化。旧347成功/合成coldを今回の実生成成功へ換算しない。

CPU原本151841bytes/SHA256 `52f089de1b4ed714f92ff52345af538ab4d3f2f5e7cb4835aa4228575074bb2d`、26payload＋manifest。Pod外で全CRC/hash/sizeを照合済み。実行前API source manifestのtest1行のhash同期漏れもモデル起動前validateで検出し、同一の検証済みtest blobへ記録だけ同期。生成/学習開始前の不一致であり、未照合の実行はしていない。

## この一回の範囲

今回のMash継続指示とRule18§11.3既存method内技術修正に結び付く新しい一回。旧枠のreuse/reactivationではない。DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、既存設計の内部投影修正はLEVEL_2相当。目的・受入れ・wire/reader・全更新数・品質・public/privacy境界は変えない。

保存284f（元d431/元runを不変保持）から新AdamW/LR5e-5、chair01初回→BOOK→SHOP→chair01訂正→BOOK→SHOP→daily01→BOOK→SHOPの9更新。旧3は元CE/new2は既存adaptive15/gamma2、assistant全文＋EOS。optimizer途中再開ではない。別保存→112F32完全一致/no-grad reload→BOOK/SHOP各1生成。before0/after最大2、温度0、cap3712/3584、context8192、各180秒。

最大600秒（外590＋kill10）、既存A5000$0.28/h、処理按分上限$0.047。準備/CPU/回収/保持/保存/通信/税等別。短縮から完走は保証しない。失敗でも追加/途中重みと全raw/logを回収する。期限/非有限/OOM/意味・本文不成立でこの一回を終了し、retry/上限延長/追加call/LR探索/reader緩和/意味補修/次run自動開始をしない。GPU保持/Stop/restart/delete/管理API0。

実生成はBOOK TOKEN_LIMIT、SHOP INVALID_FORMATで意味/本人本文0/2・採用snapshot0、cold保存再読は対象なし。成功条件は既知2件の実rawを無補修で受領し全意味/全7・8更新/本人本文と保存cold再読まで成立すること。有限既知2件を、旧9回帰/全15新評価/未知一般化/動的thread/実service-SQL/本人端末/他core/商品受入れへ拡大しない。

STRUCTURE_MAP_DELTA_NONE（既存モデル向けcopyの内部表記のみ、責務/型/wire/reader/通常接続不変）。商品0/正式0/3/54.50％、candidate_ready=false/automatic_progression=false。今回DBはSupabase project ACTIVE_HEALTHYのread-only一覧確認のみ、本人row取得0。Renderはworkspace未選択で初回readがエラーのためサービス状態未照会、変更0。本作業のGPUはRunpodであり、Render設定を必要としない。
