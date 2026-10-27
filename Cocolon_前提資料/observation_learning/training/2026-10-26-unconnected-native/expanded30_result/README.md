# expanded30 一回の停止結果 — 30更新と保存完了、再読込・15件は未実施

状態：**RUN_CLOSED_STOPPED_BEFORE_INFERENCE_RELOAD**。この承認・output・残時間は再利用しません。新109c重みの品質は未測定で、通常有効化へ進めません。

Mashは具体案2bb10230f2bb961422513b31d6c6418ecbc3b262の「30更新→保存・再読込→15件確認、最大45分・処理按分$0.21（準備・回収・保持等別）」へ「進めていいよ。」と明示承認。承認3fieldだけを反映・読戻したsource **bd5d169ad457fc440bf01d1876cb40d697ce6847**、既存A5000/Pod bkj4qvnhwtdqc2のJupyter直接でroot華恋がPID **127012** を一回起動しました。

## 到達点と未実施

- 同15×2pass・同30順序、全文assistant/EOS平均CE、LR1e-5で **30/30更新と別adapter保存を完了**。旧1d32を保持したCPU初期値から、同8層のq/k/v/o＋MLP56module/112F32/3,833,856parameterを学習しました。
- **406.63698646391276秒（6分46.637秒）、処理按分$0.03162732116941544**。最大2700秒/$0.21内。準備・CPU確認・回収・保持・保存・通信・税等は別です。
- 保存後、非学習reloadの前段検査で `adapter_config_scope_changed` となり停止。新modelの実base読込、非学習reload、生成15件はいずれも未実施。model call開始/完了0、raw0です。
- reportの `base_model_loads_started=2` はstage開始意図で、tracebackは2回目の `r.load_base()` より前です。**実base読込は学習用1回**。カウンタを実読込2回の証拠にしません。
- EOS/strict JSON/意味採用/本文成立は **未測定**。0/15の品質失敗と数えません。rawがないためCMEE採否/cold-fileは実行0、15本文を読んだとは報告しません。
- retry・追加更新・再生成・後続GPU試行0。旧run.json、保存config、重み、承認planはbytes不変で閉鎖。AUTHORIZED_ONCE_BOUNDは当時の一回原本で、新しい許可ではありません。

[run.json](run.json)、[training.jsonl](training.jsonl)、[result_summary.json](result_summary.json)、[起動・実log](execution/)に原本と最終区分があります。

## 停止原因

PEFT v0.21.2はtarget名が20件以上の場合、同じmoduleを選択する短いsuffix集合へ最小化します。旧16moduleは閾値未満、今回56moduleは28suffixへ短縮されました。保存されたconfigと初期configの差は `target_modules` だけです。base名/r/α/dropout等は同一です。

私が追加した検査はrawな名前集合の完全一致を要求していたため、PEFTの正常な短縮を範囲変更と誤判定しました。保存された112tensorの破損や、4Bの品質失敗を確認したものではありません。根拠は固定PEFT [最小化処理](https://github.com/huggingface/peft/blob/v0.21.2/src/peft/tuners/tuners_utils.py)（inject_adapterとcheck_target_module_exists）と、原trace/config、後続の実CPU再現です。

## 重みと原本の保全

保存weights **109c3dda16b19d2f110d6f8e2ded07f47e981b9690970ca95b9046780bffb85a**。config **fb43a10298bdf9965a8ab4c541cb517372928afd7dd97d0b210bf0c5b4f45b2e**。Pod外で全112F32/3,833,856parameterの全要素有限・初期と全key/shape一致・112tensorすべて変化・新40Bすべて非zeroを確認。30logの順序とloss/gradient有限も照合しました。旧1d32と拡張非学習初期値の完全一致、新40Bzeroも、回収した双方のweightsからPod外で独立に確認しました。

元1d・拡張初期値・固定source・保存adapterは不変、worker終了、GPUはA5000/1MiB/24564MiBで稼働保持。[外部照合](external_verification.json)に範囲を記録します。今回停止後に別の「早期回収」は作っていません。

最終archive **26,078,179bytes / SHA256 6bb5da2dabdfea49173a0697a5d17460d1419e55ff6c7d1d53d1f5dcdef6c5fc**、全55payload＋manifest/56memberを照合し、[保存重み・停止原本・CPU再開準備version0](https://chatgpt.com/library?file_id=libfile_d93ea0ff6e7c819185b62a0e25725850&account_id=personal)へ保全済み。[final_recovery.json](final_recovery.json)/[全manifest](final_manifest.json)に転送archiveとCPU archiveの別identityも保持します。base4B全重み・optimizer/RNGは非同梱でstrict optimizer resumeではありません。

## 次の最小作業

[追加学習0・保存済み109c重みの非学習reload→同15件確認](../expanded15_recovery_preparation/README.md)だけを準備しました。実CPU6.428339秒で旧guard失敗を再現し、実構造への28suffix→56解決、小CPU PEFT保存/reload112一致、誤った対象/r/αの拒否、入力/prior15、pending時output前拒否を確認。元config/weights/STOPは変更していません。実4B再読込は未検証で、新しい有料一回は別承認前です。30更新を繰り返す案ではありません。

新観測会は今は不要です。今回の不足は教材不足でなく保存設定の照合不整合です。通常API/CMEE reader/意味型/DTO/DB/RN/Render/Supabase/本人DB/依存/モデル選定/merge/deploy変更0。STRUCTURE_MAP_DELTA_NONE。primary=BLOCKER_NARROWED、CPU修正だけ限定TECHNICAL_CREDIT、**商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false**。GPU Stop/restart/deleteは0です。
