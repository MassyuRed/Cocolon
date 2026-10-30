# 同じ19行を2周する適合確認案 — 2026-10-30 JST

状態：Mashが保存b5eの実験用初期値・38更新・3時点適合測定・保存再読→新2件→既存CMEE/保存再読→全成功時のみ旧9、最大45分/処理按分$0.21・再試行なしの一回を明示承認。Jupyter CPU準備済み（実0.371018065秒・exit0）。直前のaligned19は19更新・保存再読・7生成、意味/本人本文0/2・saved/cold0・旧9NOT_RUNで不採用閉鎖。承認を再利用しない。

## 確認したことと判断

全体現在地・最新weekly§129・学習の目的・全app設計と全file地図・実7raw/全教師と学習コードを確認した。指示と教師のrow contract矛盾、assistant/EOS/maskの抜け、未学習tensorや旧重みの誤再読は見つからない。Jupyterの実installed transformers5.19.0をstdlibだけで読み、modelがhidden statesを切ってからloss側でlabelsを一回shiftすることと、固定helperの先行logitを含む窓が対応することを確認。model source SHAaac2a1bc/loss source SHA83db16b2は既回収版と一致した。数値的なfull/tail loss・backward同値試験は今回行っていない。

既存lossは各更新前・異なる途中重みでの値で、最終重みで全19行を測っていなかった。S5の更新前lossはBOOK0.73331/SHOP0.86623、旧9は0.00133〜0.00338だが、これを最終適合や前後改善として比較しない。学習不足と、教師前段/自由生成前段の差をまだ切り分けていない。

推奨は、現19行・比率・順序・教師・指示・loss/optimizerを保ち、2周＝38更新とする一回。開始・19更新後・保存/非学習再読後の同じ19行NLLを記録する。lossは学習状況の診断であり、意味/本文の合否や新しい品質閾値にしない。最後の実生成→既存CMEE/保存/coldで従来どおり判定する。2周で成功する証拠はまだない。

S5だけの反復はS1の欠落引用やBOOK S2を残す。指示追加は既存contractとの矛盾がないため採らない。失敗した実前段へ元の後段正解をそのまま付けると、欠けたq_extra_8/q_extra_11等を参照する教師となり不整合を作るため行わない。教師前段は元の完全なgoldに限り、評価では自分の実前段だけを使う。必要な正しい教師は既存なので、この不成立を補う観測会は不要。

## 明示承認された一回

- 失敗・不採用の保存b5e重みを、この隔離実験の初期値としてのみ使用する用途を含め、新承認を求める。製品採用/自動初期値採用/閉鎖承認の継承ではない。
- 同19行を同じinterleaved順序で2周＝38更新。全行の回数比率、完全assistant+EOS CE、112F32 LoRA、AdamW5e-5/clip1/seed20261024を保持。新教師、token/example weighting、prompt/target改変なし。
- 開始前・19更新後・38更新後の保存非学習reloadで、同19行の教師条件NLLを各1回（最大57非学習forward）記録。既存measure_nll/teacher_lossを再利用し、最初の2測定後は元のtrain modeへ戻す。評価は同じcheckpoint内で全行を測り、学習中の異なる重みの値をまとめて最終値にしない。
- 新2件は各最大5call、実直前出力だけで5段生成し、13pathを機械結合して既存CMEE・保存再読へ渡す。意味/本人本文/coldが2/2の場合だけ旧9件を実生成し確認。最大2load/38update/57教師評価forward/19自由生成。
- 全処理最大45分、前回単価$0.28/hで処理按分最大$0.21。教師評価57forward・学習・保存再読・生成・CMEE CPUも同じdeadline内。親2690秒＋kill猶予10秒。一回のみ、追加周回/修復/再試行/自動延長なし。準備/回収/保持/保存/通信/税等別、現在単価は未照会。
- どの終了理由でも部分/完成重み・全NLL/学習log・全raw/tokenIDs/messages/承認/source/CMEE保存証拠を回収する。成功時もrootが全実本文を読み、機械結果をhuman Product Readへ換算しない。

[approved_plan.json](approved_plan.json)で今回の明示承認をexact proposal SHA51573dba・launcher SHAへ結ぶ。別承認の再利用はしない。model load前に一致とfresh OUT/一回lockを確認する。実行しない場合は現在の不採用b5eと最終適合未測定の状態で止まる。通常source/receiver/意味型/API/DB/RN/Render/Supabase/依存/merge/deployは変更しない。GPU停止/再起動/削除・Runpod管理画面/API操作なし。商品0・正式0/3・54.50％・candidate_ready/automatic_progression=false。

## 全fileの責務

| file | 責務 |
|---|---|
| approved_plan.json | Mashの今回の一回承認とexact proposal/launcher SHA。終了後は閉鎖し再利用しない |
| proposal.json | 初期b5e限定用途・同19×2の38順・3測定57forward・固定cap/上限・source SHAの未承認案 |
| prepare_fit38.py | stdlibで既準備encoded19/labels/messages/教師/EOSを不変再利用し、38順/全行2回/実installed source/初期重みと凍結原本を確認。tokenizer/model/forwardなし |
| prompt_source_index.py | 直前と同じ現5段builder・actual前段chain原本 |
| run_fit38_once.py | 新承認一致後の38更新・既存measure_nllの0/19/38測定・保存非学習再読・新2→CMEE/cold→条件付き旧9 |
| launch_fit38_once.py | fresh OUT/exclusive lock/direct timeout親2690秒＋kill10秒・上限付き一回起動 |
| export_fit38.py | 終了後の全原本/部分・完成重み回収。GPU情報はbest-effort timeout10秒、ZIPはpartial保持 |
| result_20261030/ | CPU準備後の実log/exit/同一性/実installed loss sourceと原本を保持する場所。新学習/自由生成成功の証拠ではない |

root華恋が単一writer/executor/judge、補助はread-only静的照合。実環境Codex Workで正式Pro/Ultra/human authorityを申告しない。STRUCTURE_MAP_DELTA_NONE（通常構造/受信責務不変）。


[実CPU原本・回収照合・全file地図](result_20261030/README.md)。全19encoded/教師/EOS/mask不変・各2回38順・実installed loss source一致・266frozen不変を確認。model/forward/学習/生成/新CMEE0。CPU成功を適合改善やCMEE採用へ数えない。
