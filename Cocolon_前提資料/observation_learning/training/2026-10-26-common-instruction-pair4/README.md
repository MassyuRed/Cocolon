# 4B：本人向けの受け取りと意味保持を共通指示だけで比較する一回案

2026-10-26 JST。**PROPOSED／GPU未承認・未実行。** CPU実tokenizer確認はこのsource配置後にJupyter直接で行う。商品品質改善の実証ではない。

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
## 新一回案：非学習・2入力×旧新版、最大4生成

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

