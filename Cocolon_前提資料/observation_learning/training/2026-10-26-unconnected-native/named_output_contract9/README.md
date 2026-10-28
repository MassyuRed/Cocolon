# 2026-10-28 — named出力の型・参照namespace提示修復

状態：CPU_VERIFIED_ONCE_RUN_NOT_YET_STARTED。この新unitはMashの「4B学習＋CMEE接続を続けて」に結び付く。旧named13/named9/named_prior_projection9は閉鎖・消費済みのまま。今回もsingle execution ownerはroot華恋、read-only補助2文脈は独立Pro/Ultra/human受入れを代替しない。実環境はCodex Work/GPT-6とJupyter/A5000。

## 目的・範囲・完了

商品への接続先は、BOOK/SHOPの本人回答を取り込んだ全意味・全7/8更新・自然な本人向け本文を、実4Bのrawから無補修でCMEEへ渡すこと。current未完了は§89のroot.v入れ子、BOOK参照反復、SHOP本文型/回答source/更新不全。必要性はDIRECT_PRODUCT_OR_ACCEPTANCE_WORK、既存method内の最小提示修復はLEVEL_2相当。Mashの新継続指示・Rule18§11.3既存envelope内の技術判断で、旧一回枠を再開しない。

fresh PR30 4ba6f23fとAPI c4e1ccb2、全機能00全文、全体01/01A/B/Cとcurrent00/01/04、全tree（4142/2527、truncated=false）、最新weekly§89、観測学習の目的/用途、work rules00/CURRENT_RULES/18、恒久incident全文、Karen-Diary指定入口を確認。System Contextの8月snapshotは使用せず原本を直接読む。

意味・教師・decoder・採用reader・保存prior・通常経路は不変。API修正は1739a6bfe05186fa6f39bfa6a40259ed60f1579cのsource/test2pathのみ、remote全文/親/変更集合を照合済み。
- model_candidate_source.py::_named_reference_messages：説明keyを*_requirementsへ分離し、文字列説明と出力object/arrayの同名衝突を除去。最後に新出力のv/a/q/c見本、原入力/回答/priorのs0/s1/p0、ADDと最後のINVALIDATE_GAPを別shape、prose objectとur/prior namespaceを明示。重複alias辞書/説明は省き、正解引用・意味・本文を埋めない。更新数はrole数－既存claim数＋gapで、任意claim IDに依存しない。
- test_cmee_named_reference_candidate.py：既存prior往復に加え、固定2の型/namespace/全7・8更新の未変更fixture通過、任意prior IDへの改名でも同じ更新数を要求する確認。fixture/旧肯定否定検査を変更しない。

完了条件は、新しい一回で9更新→別保存→112F32完全一致no-grad reload→BOOK/SHOP各1生成を実施し、全raw/意味/本文を読解、採用時だけ同snapshot保存cold再読まで確かめて原本を保全すること。意味/本文不成立・期限/OOM/非有限で一回を閉じる。retry/reader緩和/raw補修/上限延長/次run自動開始なし。商品受入れ、一般化、未知入力、旧9自由生成回帰、本人端末、他core完成へ拡大しない。

## CPU実結果・失敗履歴

Jupyter CPU28.143074525秒、pytest20.652924898秒、同7file **351 passed/FAIL0/ERROR0/SKIP0**、実SQL12対象外。実DB通信/新依存0。変更prompt2だけ、他13入力・全15assistant教師/EOS token/mask不変、prior意味/引用往復2/2、初期284fの112F32有限性を確認。CPU model load/forward/学習/生成/SQL0、CUDA未初期化。
- BOOK prompt4382→4379、target2913、cap3712、合計8091/8192。
- SHOP4534→4531、target3238、cap3584、合計8115/8192。
- 9系列総token57682/長二乗和398057230。600秒内の完走保証ではない。

CPU起動前の参照BASE/OLD置換誤り、fetch内容をapply_patch転送した際の末尾LF1追加を順に検出し、いずれもROOT作成/モデル起動前に停止。原本preimageをd181b4e7に一致させた。提示初版はcontext超過でCPU停止し、旧root/pack/code/logを_v3として保持。重複する仕様説明を省いて枠内へ修復後に上記351成功。read-only reviewでrole名と任意claim IDの同一視も検出し、ID非依存のcountへ直した。旧make_payload.pyは置換順誤りを持つ作成途中scriptで、再利用しない。実行packの既検証runner/consumer/prepareだけが実行正本。

CPU原本202368bytes、SHA256 38a8bb49a103457788e78a0a5f0e75c3681e47a3fb96f703e33b19459b2341f2、34payload+manifest/35member。Pod外で全CRC/hash/size、実source/testとremote API1739a6bfのbytes一致を照合。CPU archive内api manifestはcommit反映前のc4e1 parentを示す実行時原本、別の最終api_source_manifest.json/planが1739a6bfの同source bytesに束縛する。

## 新しい一回の固定条件

原284fから新AdamW/LR5e-5、旧3各1＋named回答後2各3の9更新。順序はchair01初回→BOOK→SHOP→chair01訂正→BOOK→SHOP→daily01→BOOK→SHOP。旧3元CE/new2既存adaptive15/gamma2、assistant全文＋EOS。元d431/284f/9ba8/b8bc・凍結15/旧helper/loss/旧runは不変。optimizer途中再開ではない。

別保存→112F32・3,833,856parameter完全一致/no-grad reload→既知各1生成。before0、after最大2、温度0、context8192、cap3712/3584、各180秒。新root/pack/run/resultはcocolon_namedoutput9_*_20261028だけ。最大600秒（外590+kill10）、既存A5000$0.28/h、処理按分上限$0.047、準備/CPU/回収/保持/保存/通信/税別。GPU保持、Stop/restart/delete/管理API0。失敗時も新または途中重みとraw/logを回収。通常app/API/DTO/DB/RN/Render/Supabase/merge/deploy/価格quota変更0。

STRUCTURE_MAP_DELTA_NONE：モデル向けcopyの提示だけでowner責務/型/wire/receiver/通常接続は不変。正式商品0/3/54.50％、candidate_ready=false/automatic_progression=false、新観測会は現在の形式/更新不備には不要。今回の実GPU結果・採用結果はまだ未実行であり、CPU成功を実モデル成功へ換算しない。
