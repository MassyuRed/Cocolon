# 日常3件の引用・関係・受け取り — 次の有限学習候補

状態：**12更新・FIT9終了／意味7/9・本文6/9／別ID保存再読は条件未成立で未実施**。2026-10-25 JST。

Mashの「処理落ちしているから、続きから再開して」を受領し、current Cocolon0a83a437/APIbd356566と§38終了記録を照合した。前18更新・FIT9は完了済み、chair6/6・daily0/3、別IDの保存再読call0。終了したplanと未使用のholdout枠を再開しない。

目的は日常の短い食事記録から、意味と本人向けの受け取りを既存CMEEへ採用できるようにすること。原文引用/座標/参照、帰宅の二作用域と受け取りの未適合を直す。既存teacher・prompt・API・reader・schema・採用条件は全て保持する。新しい観測会は今回不要。

## 具体的な一案

開始重みは前18更新で保存した5f0e51e9fbd5c94ba7bd213b033397dcc0982c19853819c1966afc8ece5613ed。既存の凍結9行をそのまま読み、chair6を各1回の全文assistant JSON＋EOS、daily3を各2回の重点lossで計12更新とする。新AdamW/LR5e-5、LoRA既存32tensor、固定base/tokenizer、context8192/prompt5632/completion2560。初回9行をseed20261024でshuffleし、続いてdaily3だけ同じrngでshuffleする。

重点範囲は、evidence表全文、各claimのtext/predicate.surface、全claim内evidence_indexes、relations配列全文、surface_proposal全文。daily1件につき38個の重ならないJSON value区間。関係配列とsurfaceを全文含めることで、欠落したreturn→eat、claimの『ら』混入、参照の誤配線、受け取りの脱落も対象にする。原JSON全体・metadata・EOSは入力に残し、範囲外labelは-100。dailyのEOSは既に全3出力で成立しているためlossへ追加しない。

旧focused_fit6のJSON位置探索・token boundary syntax-only確認・疎label・loss_start/logits_positions方式を同じ学習script内で再利用する。新checker/依存/サービスは追加しない。旧focusのevidence＋索引だけを再実行しても今回の関係/本文不適合を覆えないため、その旧maskは使わない。疎maskを連続assistant専用teacher_lossへ渡さず、chairだけ既存teacher_loss、dailyは旧focusと同じtail loss式を使う。

旧76309b86も候補5f0e51e9も不変で保持する。5f0候補の再利用は新candidateの開始点であり、current採用へ昇格したという意味ではない。前18更新時のdaily NLL低下約0.12〜0.13→0.038を引き継ぐ理由とし、学習効果は未実測。chair rehearsalは退行抑制策で互換成功の保証ではない。

## 実行・検証・終了条件

新12更新・保存/非学習reload・FIT9を一回だけ1800秒、記録単価$0.26/h按分$0.13以内。before新生成0、旧保存FIT9を比較に使用する。daily重点NLLとchair全文NLLは別の指標として保存し、混ぜた改善率を出さない。既存consume_fit_raw.pyで原raw9を無補修で消費し、chair6の意味/本文/実問い/訂正3更新とdaily3採用を全件照合する。

全9件の意味/本文が成功した場合だけ、未実施だった原うどん/雑炊の学習外2identityで初回各1call→実service/隔離SQL保存/GET-start非生成再読を別scriptで一回確認する。別枠最大2call/900秒/$0.065。失敗したmodelの同要求再call、追加更新、LR探索、教材化、raw修復、reader緩和はしない。OOM/非有限/長さ/期限/不採用は結果と重みを回収して終了する。GPUはSTOP/再起動/削除しない。

process計45分/$0.195の按分枠は、準備/回収/継続保持/税等を含む実請求総額ではない。既存Podのみ。新Pod/charge/install/本番/実Auth/本人DB/Render/Supabase/RN/merge/deploy/商品受入れは含まない。成功でも2family内FITと語彙/IDの有限確認であり、一般品質・商品credit・正式0/3・54.50％を更新しない。

## この時点の検証と承認境界

stdlib CPUで凍結teacher9行とmanifest全fileのsize/hash・source hashを確認し、daily38区間×3を完全なJSON valueとして導出した。原teacher変更0、model/GPU/学習0。character区間を確認後、公開source2adf549cの同じrunnerでBPE tokenも実測済み。実tokenizerのoffset/full token列一致、全区間coverage、token境界の追加部分がsyntaxだけであること、prompt/範囲外/EOSのlabel除外は--tokenize-onlyで既存cacheへ確認済み。stubや1文字=1tokenの代替結果を実測と呼ばない。

CPU候補準備とGitHub保存は現行再開指示の可逆的な具体化。新GPU12更新は、消費済み18更新一回のscope外なので、planのgpu_run_authorized=false、status=PROPOSED_AWAITING_NEW_FINITE_RUN_APPROVALのまま。旧planの再開や自動追加試行として実行しない。Rule18§11.3の『既に説明したbounded scopeから作業が広がる』とallowed effect/STOP境界を根拠に、新しい有限一回の判断を具体化してから求める。current実環境はCodex Work/GPT-6、root華恋が実装/実行/統合/反映owner、別文脈agentは読み取り意見のみ。Pro/Ultraやhuman acceptanceを装わない。

STRUCTURE_MAP_DELTA_NONE。製品owner/意味/保存責務の変更はなく、既存学習方式の内部loss対象候補だけ。System Context最新索引は未完成のためfresh原本を直接参照。全機能00全文、恒久incident、current rule/Rule18、全体01/全file地図01A/B/Cの導線、観測学習目的、最新weekly§38、実raw/teacher/sourceを照合した。全blob意味読了とは主張しない。


## 実tokenizer結果（学習0・model0・CUDA0）

9行すべてencodeとoffset mappingが一致し、full teacherを保持。chair6は旧1374/2330/1374/2333/1364/2339 token、dailyは910/894/918 tokenを選択。各daily38個のJSON value区間を完全被覆し、76個の境界丸めは全てsyntaxだけ。prompt/非対象値/終端EOSのlabel=-100を確認した。maxprompt5045/fullcontext7378は既存上限内。部分lossをVRAM削減や品質成功と呼ばない。

実report token_mask_preflight.json SHA f7561fe504518429c7e9d7b929b77b8b91725fbf65caf132d2c97e4cf5e5bc97。launch/log/manifestも保存。回収archive1891af33f354442cf487dd7d8c4beee7afa4ac9975df88261387b5edb3955479、17,385bytes、全4memberをPod外hash/size照合。今回stdlibのcharacter候補確認はplan説明整合後の再導出を含め2回、実tokenizerは1回で成功し、追加学習/model/CUDAは各0。BPEfalseのcpu_focus_ranges.jsonは作成時の文字範囲結果であり、後続の実token reportへ改竄しない。

単一root華恋のsource/計数/既存方式照合と、別文脈agentの静的reviewに阻害不備なし。実学習の効果は未確認。GPUは実測終了後A4500/20470MiB/使用1MiB、STOP/再起動/削除0。追加学習や新model生成は未実施。今回primary outcome=ADMINISTRATIVE_ONLY、候補準備を品質/技術完了creditへ転用しない。全体00/観測入口/元daily入口/最新weekly/01Aだけを同期し、製品構造不変のcurrent01/04/共有01/schema05は更新不要と判断した。


## 明示承認後の実行checkpoint（FIT生成中・採否未確定）

Mashが提示済みの「追加12更新と、成功時の保存再読」へ「進めていいよ」と明示承認した。planのstatus/gpu_run_authorized/permission_basis/approval_basis/scope_classificationの5fieldだけを変更し、source150cbcbfc95777b1d839c8d2418550573bbaa641へ固定、全文読戻し照合。runner/teacher/learning条件は候補f916と同一。旧pending planのtokenizer結果は当時の原本として維持する。

Mashが候補f916の追加12更新と成功時の保存再読を明示承認。承認だけの5fieldを固定したplan/source150cbcbfで一回起動し、12更新と保存・非学習reloadを完了、FIT9生成/採否は進行中。新adapter affea8a7094832dfbac27343af87a9ad1b302f61616c19ead33d1dcc7bf59cc3、step12保存直後archive全18memberと32F32有限をPod外照合し保持。旧9teacher/prompt/APIbd356566/reader・旧18plan・旧重みは不変。FIT9/9成功後だけ別ID2件の実service保存再読へ進む。現段階で新daily採用成功とはしない。GPU稼働保持/STOP・再起動・削除0、本番/DB/Render/RN変更0、商品credit0・正式0/3・54.50％据置。

新process PID604760は一回だけ起動。新生成前のstep12archive9969861eded94c328c4d0ae720634d69fa185080a280c8bc59103a394bdb0dcf、3,517,892bytes、18memberのsize/hashと32F32有限をPod外で照合した。archive内runはADAPTER_SAVED_BEFORE_GENERATION/new_generations0で、FIT9完了記録とは別時点。base全重み/optimizer/RNGは含まない。[保存した追加重み](https://chatgpt.com/library?file_id=libfile_e35a9446a01481919d709e44df5e50bc&account_id=personal)。現在の採用重みへ昇格はしていない。

初回の実tokenizer結果とcandidateの学習条件を維持。12更新後のFIT原出力9行を未変更consumerで評価し、全9成功時だけ承認済み2callを実施する。まだ未確認の成功、一般言語品質、商品受入れは加算しない。元18更新planの再開/追加更新/LR探索/失敗model再call/原raw修復0。


## 今回の最終結果（上記実行中checkpointは履歴）

追加12更新・保存/非学習reload/FIT9を1037.960秒で完了。無補修rawは意味7/9・本文6/9、chair6/6を維持。dailyは意味1/3・本文0/3で、01/03の引用開始位置3整数と全3の受け取りが残る。全9成功条件未達のため別ID保存再読はcall0で終了。新affea8a7重み/32tensor/全archiveをPod外検証・保管したが昇格せず、旧重み/teacher/API/reader不変。追加更新/再call/補修0、同family二試行後の第三の自動試行を止める。新観測会不要、GPU稼働保持/STOP・再起動・削除0、本番/DB/Render/RN変更0、商品credit0・正式0/3・54.50％据置。

原本：[focus12 trial全結果・全raw・採否・比較](../../trials/2026-10-25-daily-calm-focus12/README.md)。planは実行時原本としてAUTHORIZED_ONCEのまま保持し、終了lifecycleはtrial closure.jsonで確認する。新eval_plan未作成・model/SQL起動0、固定したholdout source/fixtureは未使用。
