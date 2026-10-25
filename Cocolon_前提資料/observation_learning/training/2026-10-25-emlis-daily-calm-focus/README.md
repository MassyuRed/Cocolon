# 日常3件の引用・関係・受け取り — 次の有限学習候補

状態：**CPU候補準備中／GPU未承認・未実行**。2026-10-25 JST。

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

stdlib CPUで凍結teacher9行とmanifest全fileのsize/hash・source hashを確認し、daily38区間×3を完全なJSON valueとして導出した。原teacher変更0、model/GPU/学習0。現段階はcharacter区間のみで、BPE tokenの実測は未実施。実tokenizerのoffset/full token列一致、全区間coverage、token境界の追加部分がsyntaxだけであること、prompt/範囲外/EOSのlabel除外は--tokenize-onlyで既存cacheへ確認する。stubや1文字=1tokenの代替結果を実測と呼ばない。

CPU候補準備とGitHub保存は現行再開指示の可逆的な具体化。新GPU12更新は、消費済み18更新一回のscope外なので、planのgpu_run_authorized=false、status=PROPOSED_AWAITING_NEW_FINITE_RUN_APPROVALのまま。旧planの再開や自動追加試行として実行しない。Rule18§11.3の『既に説明したbounded scopeから作業が広がる』とallowed effect/STOP境界を根拠に、新しい有限一回の判断を具体化してから求める。current実環境はCodex Work/GPT-6、root華恋が実装/実行/統合/反映owner、別文脈agentは読み取り意見のみ。Pro/Ultraやhuman acceptanceを装わない。

STRUCTURE_MAP_DELTA_NONE。製品owner/意味/保存責務の変更はなく、既存学習方式の内部loss対象候補だけ。System Context最新索引は未完成のためfresh原本を直接参照。全機能00全文、恒久incident、current rule/Rule18、全体01/全file地図01A/B/Cの導線、観測学習目的、最新weekly§38、実raw/teacher/sourceを照合した。全blob意味読了とは主張しない。
