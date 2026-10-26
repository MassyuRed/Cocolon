# 4B：共通指示だけの非学習旧新比較結果

2026-10-26 JST。**一回終了・4生成完了。改善共通指示は不採用、追加学習0、CMEE／商品未採用。** Jupyter実tokenizerのCPU確認は完了。商品品質改善の実証ではない。

## 目的と選んだ一手

[前回raw2](../../trials/2026-10-26-generalization-probe2/README.md#generalization-eval2-final-result)は、基本出来事の一部を保ったが、受け取りが第三者向け解説となり、未記載の心理説明を補った。直ちに追加学習を重ねず、**現在の45779を固定し、共通task_instruction一箇所だけの変更で直せる範囲を先に比較する。** 重み更新と指示変更を混ぜず、追加学習が必要かを決めるための最小の同条件比較とする。一般入力のCMEE採用条件を変える案ではない。

| 入力 | 由来・扱い | 同じ入力での比較 |
|---|---|---|
| FT-UDON-INITIAL | 既存Free9教師の本人source。華恋編集の教師候補で、Mash完成応答／商品合格ではない。現在のnative学習でも同じ夕食familyを使用済み | 元の汎用指示1回＋改善指示1回。元assistant教師は送信しない |
| EFREE-E05 | 既読の開発用評価。昨日の申込みの喜びと、今日の参加意向／取消の迷い。学習対象へ移さない | 元の汎用指示1回＋同じ改善指示1回。review期待は送信しない |

両方とも既知材料であり、未知への一般化試験ではない。E01／E03／A03の再提示・学習転用0。撤回済みOBS-20261024-002も使わない。前回rawを正解へ転用せず、旧9教師／native quote9教師・元評価は不変。

## 既存教示と今回の変更

- [OBS-20261022-002 D05〜D07](../../sessions/2026/OBS-20261022-002/01_dialogue.md#d05)：事実を事実として捉えることも観測。短い日常を受け取りだけで終える認識へのMashの肯定。
- [同ノート§7](../../sessions/2026/OBS-20261022-002/02_learning_notes.md)：D05応答案にある「食べたくなって」「温まれた」は入力未明示として継承しない。
- [一般教示T-OWN-CRITERIA／T-EXPERIENCE](../2026-10-23-pilot-prep/teaching_reference.jsonl)：本人の理由・基準を勝手に決めず、自分の価値観の持込みを点検するMash逐語。一般教示と本人sourceを混同しない。
- 本人向けの自然さ／意味保持は既存の全体00・Emlis／CMEE設計の要求を維持する。新しい商品品質条件、固定の称賛・語尾、名詞別regex、JSON限定を追加しない。

[共通指示全文](common_instruction.txt)は元指示へ、(1)主体／時点／肯否／程度／迷いの保持、(2)Emlisから本人へ直接返す自然な受け取り、(3)未記載原因・以前の状態・回復等の補完禁止、(4)短文に深読み／問いを強制しない、を追記した華恋の候補である。例文・教師・今回2入力の期待語を含めない。入力の題材や感情ごとに指示を変えない。旧新版はsystem／source_bundle／cmee_task_context／出力欄・質問予算が同一で、task_instructionだけが変わることをrunner内で確認する。

### 学習targetの扱い

旧Free9のassistant targetは上書きしない。今回の先行比較は非学習なので新teacherも作らない。指示だけの効果を実rawで読んだ後に、必要なら既存の原対話から自然な受け取りtargetを別候補として具体化する。教示の承認を完成応答・学習効果の承認へ拡大しない。この比較だけでPiece／Analysisの完成教師不足は解消しない。今回の比較準備に新観測会は不要。

<a id="instruction-pair4-proposal"></a>
## 承認・実行済みの一回案：非学習・2入力×旧新版、最大4生成

[plan](instruction_pair4.plan.json)／[runner](run_instruction_pair4.py)／[4入力](instruction_pair4_cases.jsonl)。元の汎用入力sourceはCocolon `92283c1f37e5211f08e241b79fbb4dfa80b3fb2c`、APIは`4002b4577838d1ed6671278a19585b61e7ccd10e`で不変。runner SHA256 `546c5f9e6e7ca97cc576445ae361a22ce8d3129d4c55fbf6e8ff5844555c9077`、cases `937eb2137f11542a0048f044eea057edfa3f90e8a4ea5aba3a40e91928dc04b0`。元data fileのblobは各caseのmetadataに固定。元system／user messagesは旧版で完全一致、新版は共通task_instructionだけの差分。

1. 固定Qwen3.5-4B revision851bf6e8と保存adapter45779を一度だけ非学習load。32tensor有限、全parameter非学習、前後adapter全3fileの不変を確認。旧helper2f659／依存4pinは保持する。
2. UDON旧→E05旧→UDON新→E05新の順。各生成は独立したsystem＋userだけで、前の応答を引き継がない。最大4call、追加学習0、retry0。nonthinking／greedy／beams1、context8192／max_new2560は両条件同じ。
3. CPU原本のmessages hash／実token列と起動時の再導出を照合。入力切捨て／不一致ではmodel load前に停止。
4. tokenizer再確認・model load・推論を含むGPU処理単位は合計600秒。各生成は180秒または残時間。期限・OOM・例外・非EOSで後続を止める。4call上限／全体上限を延長しない。JSON解析失敗だけでは止めず、生文章として読む。
5. 全raw／実入力・token／EOS・停止理由／所要／重みidentityを回収・GitHub保全する。華恋が全4本文を読む。入力固有の受け取り、意味／時点／迷いの保持、未記載説明、問いの必要性を旧新版で対にして確認する。本文完全一致やNLLで品質判定しない。旧から劣化した点も記録する。
6. CMEE採用／実service／SQL0、通常アプリ／API／DB／RN／reader／問い契約は変更0。新指示を本番へ反映せず、自動追加学習・追加生成・次試行へ進まない。前回raw2等の閉鎖済み承認を流用しない。

**上限600秒／処理按分$0.043334（約$0.0434）**、記録$0.26/h。準備／回収／保持／保存／税等は別で、請求総額の上限ではない。既存GPUは稼働保持、Stop／再起動／削除／新Pod／Runpod管理API／管理console／GPU一覧操作0。

## 作業開始・境界

| 項目 | 固定内容 |
|---|---|
| product_destination | 本人の意味を落とさず、解説ではなく自然な受け取りとして返す |
| current_gate_or_subgate | raw2後の説明調／未記載補完に対する共通指示の比較 |
| exact_work | 既存2材料の旧新4messagesと非学習runner／planをCPUで具体化 |
| scope_classification | 可逆準備とGitHub保存は続行指示の範囲。新GPU4callはRule18§11.3 LEVEL3・別承認前 |
| approval_or_delegation_basis | Mashの4B学習＋CMEE接続の続行／Jupyter直接／必要な資料差分更新指示。新GPUは未承認 |
| execution_owner | root華恋一人、Codex Work／system表示GPT-6。別agentはread-only補助。正式Pro／Ultra／human Product Readではない |
| success_credit | CPUで同条件比較の実行可能性だけ確認。商品0／正式0/3／54.50％ |
| completion_condition | 共通差分と元sourceを照合し、Jupyter実tokenizer原本・全sourceをGitHubから読み戻す |
| stop_condition | source／helper／重み不一致、切捨て、未承認GPU、scope拡大、反映不明 |
| prohibited_scope | 学習、旧試行再起動、意味採用／reader緩和、本番・本人DB・GPU lifecycle・依存追加 |
| next_product_read_or_mash_decision_point | 同じ保存重みで最大4生成／600秒・上限費用への判断。Product Readは今回到達しない |
| current_source_test_receipt | 前回raw2結果、元generic9／既読eval6、現在45779／旧helper、pair差分確認 |
| current_docs_and_heads | 全体00全文・恒久incident・規則・最新weekly§50、全体01／地図01A/B/Cの差分、current00/01/04。開始92283c1f／API4002b。System Context索引timeoutは再実行せずfresh原本を直接読む |
| affected_current_structure_maps | Emlis01／CMEE04。STRUCTURE_MAP_DELTA_NONE：製品責務・接続・型・契約・採用条件は不変 |


## Jupyter実CPU結果・回収

配置source `591dab592719dabfaa2e9964333363d9234b1aad`の4fileをGitHubから取得し、事前SHA256に完全一致させた。CPUでは`CUDA_VISIBLE_DEVICES=''`／offlineを固定。単一起動5.447829秒、exit0、stderr空。既存Python /usr/local/bin/python、transformers5.19.0／peft0.21.2／accelerate1.15.0／safetensors0.8.0で追加依存0。

| 入力 | 旧指示tokens | 新指示tokens | 生成枠を含む最大 |
|---|---:|---:|---:|
| FT-UDON-INITIAL | 428 | 668 | 3228 / 8192 |
| EFREE-E05 | 444 | 684 | 3244 / 8192 |

切捨て0、元system／source／質問予算はpair内同一、task_instructionだけ共通240token増。旧版messagesはGitHub原行のsystem/userと完全一致。実token列とmessages hashを[CPU原本](instruction_pair4_cpu_preflight.json)へ保存。[CPU起動記録](cpu_launch.json)／[回収manifest](cpu_recovery_manifest.json)。source4＋CPU原本＋起動記録の6payload／manifest込み7memberを、回収archive11,271bytes／SHA256 `3602ea5717534f0873e2f36ea58db2ccd41c8dbfa7307e43703dea93a4af7944`からPod外で全bytes/hash照合し、配置4fileも完全一致。新モデルload／forward／生成／追加学習／SQL／CMEE採用0、plan PROPOSED/falseのまま。

read-only別文脈レビューで原messages／単一差分／教師・guide非混入／4call上限／停止／非採用を確認し、root華恋がactualと照合した。正式Pro／Ultra／human Product Readではない。ブラウザfilechooserの一回timeoutで配置効果0となったため、固定GitHub sourceの通常取得へ切替。コマンド構築の構文エラー1回はUI実行前で、Pod/file/child/model効果0。CPU処理と回収は各一回、再実行・再download0。

今回のprimaryは限定TECHNICAL_CREDIT（既存2入力の単一指示差分とCPU実行可能性だけ）。商品0／正式0/3／54.50％、STRUCTURE_MAP_DELTA_NONE。次は上記一回案へのMash判断だけで、追加学習や試行の連鎖へ進まない。結果の前後本文で効果がなければ、それも記録し、同じ指示の反復調整・再試行を自動追加しない。承認された場合、原proposed planを保全してstatus／gpu_run_authorizedだけ変更し、root一人が一回実行・全4本文診断・原本回収・GitHub読み戻しまで担う。


## 10/26：一回実行のMash承認・実行前checkpoint

Mashは7b90e5e2の具体案「追加学習なし・既知2入力×旧新の最大4生成・最大600秒／処理按分約$0.0434（保持等別）」に「進めていいよ。」と明示承認。原proposedを無変更で保全し、planのstatus／gpu_run_authorizedだけを変更した。runner546c5f9e・cases937eb213・共通指示・重み45779・旧helper2f659・上限／停止は不変。root華恋がJupyter直接で一回実行し、全4本文比較・原本回収・GitHub反映・読み戻しまで担う。各段階の再承認は不要。新teacher／学習／CMEE採用／reader緩和／製品変更／旧試行の承認再利用0。実行前の新model load／forward／生成／SQL0。


<a id="instruction-pair4-final-result"></a>
## 最終結果：4生成完了、局所改善はあるが内容忠実性が悪化し新指示は不採用

承認source `2674108abf970dc9ee28f4a38b5a28d70b34a976`からJupyter直接で一回起動、PID665996。runner546c5f9e／cases937eb213／原system・本人source／旧helper2f659／固定base revision／45779／生成条件を維持した。変更はpair内の共通task_instructionだけ。追加学習／再試行0、4call完了、全4EOS／時間停止0。

| 項目 | 実結果 |
|---|---|
| GPU処理 | 33.753485秒。最終記録込み33.758841秒 |
| 処理按分 | 記録$0.26/hで約$0.00243814（約$0.00244）。準備／回収／保持／保存／税等別。600秒／$0.043334内、請求総額ではない |
| token | UDON旧428→121、新668→158。E05旧444→103、新684→122（各input→output）。切捨て0 |
| 生成時間 | UDON旧6.693145秒、新7.896929秒。E05旧5.165820秒、新6.118570秒 |
| identity | actual messages／token列はCPU原本と一致。全parameter非学習・loaded32tensor有限。保存adapter全3file前後不変 |
| 形式／接続 | 全4が欄付き文章、strict JSON解析失敗はmetadataのみ。CMEE意味／本文採用0、実service／SQL0、製品設定変更0 |

[実run](run/run.json)／[実入力とtoken](run/actual_inputs_and_token_ids.json)／[UDON旧raw](run/case1_raw.jsonl)／[E05旧raw](run/case2_raw.jsonl)／[UDON新raw](run/case3_raw.jsonl)／[E05新raw](run/case4_raw.jsonl)／[loaded tensor](run/loaded_adapter_finite_tensors.json)／[run manifest](run/file_manifest.json)／[起動記録](instruction_pair4_launch.json)／[原log](instruction_pair4_launch.log)／[内容診断](content_diagnosis.json)。rawは補修していない。

### 本文の旧新比較

| 入力 | 旧指示 | 改善指示の実結果 | 判定 |
|---|---|---|---|
| 夕食・うどん | 観測は「本人が…述べており」、受け取りは「本人の平穏と弱めの喜び…連動して現れたと受け取れる」で第三者向け解説。「その後に」という原sourceにない記述順序も付ける | 本人向けには変わったが、受け取りは「帰ってからうどんを作って食べたのですね。あたたかいおにぎりが、心も体もほっとしたのよ。」。食べ物を取り違え、未記載の身体状態も補った | **内容忠実性が明確に悪化**。自然な口調への変化で相殺できない |
| 昨日の申込・今日の迷い | 昨日／今日と未決の迷いは残るが、今も「出たい」という意向が落ち、受け取りはほぼ観測の反復 | 「出たい気持ち」を保持し本人へ話す形になる。ただし「本当によかったね」は称賛寄り。「昨日の大会への申し込み」「今日の日程」は申込／確認の時点と大会日程の修飾が曖昧 | **局所改善はあるが、十分な自然さ・品質は未達**。大会が昨日／今日だったと確定して誤読した、とまでは断定しない |

新2件のupdate_note「本人の記述と一致」は検証根拠ではなく、UDONでは本文とも矛盾する。根拠欄に原文を並べても、おにぎりや身体状態が出典付きになるわけではない。E05は両条件とも取消の迷いを一般的な参加迷いへ丸めているが、未決状態は保った。両入力の問いなしは妥当。unknowns:なしだけを独立失敗とせず、実本文の迷い保持を読む。厳密JSONは元指示で必須ではないため、解析失敗を今回の内容品質失敗へ数えない。

root華恋と別文脈read-only読解は、本人向け口調／意向保持の局所改善と、UDONの内容忠実性の悪化・新指示不採用で一致した。正式Pro／Ultra／human Product Readではない。今回2件は既知材料の一回比較であり、4B全般の限界や全指示改善の不可能、未知への一般化を結論しない。

### 回収・一回の終了・次の一作業

archive22,347bytes／SHA256 `f6bbea85ddba3ef29ae89bf04209617fc7aa653071da53e99fe2d9c21496af4e`。18payload＋manifestの全19memberをPod外で検証、全payloadのbytes/hash、run manifest7対象、raw4本文hash／output token数、actual／CPU token列、32tensor有限性、元source／proposed→authorizedの2field差分を照合。[recovery manifest](recovery_manifest.json)のrun/*は同名directory、source/*は本pack rootの同名fileに対応する。配置済みの不変source／plan／CPU原本は重複改変しない。CPU段階のcpu_recovery_manifest.json／cpu_launch.jsonが参照する当時のplanは、今回保全したinstruction_pair4.proposed.jsonへ対応する。現authorized planと混同せず、その対応で旧CPU manifest6対象も全文bytes/hash照合した。初回のarchive SHA転記を誤ったが、Podの16桁分割表示とdownload済み実bytesを再照合し訂正。原本作成・download・モデル起動の再実行0。

**この改善指示は採用せず、一回を閉鎖する。** 現45779と既存製品の指示・採用条件は不変。長い指示追加の再試行を連鎖させず、次は既存の華恋編集generic教師とactual native学習入力の差へ戻り、本人向け受け取りとsource保持を同時に教える最小案をCPUで具体化する。既存FT-UDONには原入力／元prompt／未記載の身体状態を補わないtargetがあるが、Mash完成応答／商品品質承認済みgoldへ格上げしない。E05／E01／E03／A03・今回のraw・撤回読書会は教師へ転用しない。新観測会は今の基本欠陥を扱うためには不要。次の学習や生成を自動開始しない。

primary BLOCKER_NARROWED、商品0／正式0/3／54.50％、STRUCTURE_MAP_DELTA_NONE（製品責務・接続・型・契約不変）。GPUは稼働を保持、終了時A4500／20,470MiB／使用1MiB。管理console／GPU一覧／Runpod管理API／Stop／再起動／削除／新Pod／charge／依存追加／Render／Supabase／本人DB／通常application／公開API／DTO／RN／merge／deploy0。
