# Qwen3.5-9B / Runpod M1 — 4場面の実出力と診断

2026-10-23 JST。取得はMashがRunpodで実行し、華恋が受領原本・全4入力・全4本文を照合した。これはM1の未接続proxy試験であり、CMEE統合P6/M2・追加学習・正式Product Readではない。

## 実行事実

- 実要求：19:23:13.933〜19:24:44.715 JST。各4IDを1回、4応答を取得。追加要求／再試行0。
- 入力：Cocolon `371bac4346c0edce33b51d2dcc393cab7d4d0281` の [task_inputs.jsonl](../../model_selection/2026-10-22-three-core/task_inputs.jsonl)、blob `6aaa369c9c31388325d0e1203627b355ebb87d61`。受領した全4request.messagesをGitHub原本の該当4行と照合し完全一致。他16場面、review_guide、case_indexをモデルへ渡していない。
- モデル：`Qwen/Qwen3.5-9B`。原本に記録されたrevision `c202236235762e1c871ad0ccb60c8ee5ba337b9a`。A40 46068MiB、driver 595.91.07、vLLM 0.32.0、PyTorch 2.13.0+cu132。応答fingerprintは `vllm-0.32.0-4b1bef00`。
- 起動設定の記録：BF16・量子化なし・text-only・context8192・同時1・VRAM0.80・eager。/v1/modelsはモデル名・context8192を確認できるが、全実引数・実重みhashをAPI応答だけで独立証明したものではない。
- sampling：temperature0、top_p1、top_k-1、min_p0、presence/frequency penalty0、repetition_penalty1、seed20261023、thinking無効、JSON object、非stream。seed固定を完全な再現性の実証とはしない。
- 全件HTTP200、finish_reason=stop、JSON構文有効、refusal/reasoning=null。raw_response→response→parsed_outputの全件一致を再確認。出力上限による打切りなし。

| ID | 入力token | 出力token | 上限 | 要求秒 | 状態 |
|---|---:|---:|---:|---:|---|
| E02-0 | 491 | 149 | 1024 | 14.371 | OUTPUT_AVAILABLE |
| E02-B | 566 | 184 | 1024 | 6.182 | OUTPUT_AVAILABLE / 固定補足probe |
| P01-N | 513 | 235 | 1024 | 7.793 | OUTPUT_AVAILABLE |
| A02-P1 | 803 | 1864 | 3072 | 62.261 | OUTPUT_AVAILABLE |
| 合計 | 2373 | 2432 | — | 90.607 | 4応答・計4805token |

90.607秒は要求時間の合計、原本の開始〜終了は90.782081秒。インストール・download・model load・待機を含むGPU総稼働時間や課金額ではない。画面では起動前残高$5.15・A40 GPU単価$0.59/h、Container50GB・Volume50GB /workspaceの設定を確認した。現残高・総消費・Stop完了は未確認。Stopを案内済み。旧DeepInfra4回/50円をGPU予算として流用しない。

## 本文の診断 — 取得成功と品質を分離

華恋と2読取補助が入力／本文を確認し、華恋が統合した。生成元を伏せたblind A/B、Mashによる正式human Product Read、一般入力の採用評価ではない。次表は合計点による自動採否ではなく、今回の明白な不足の診断である。

| 場面 | 実際に保持した部分 | 明白な不足 |
|---|---|---|
| E02-0 | 任せて最後まで聞いた行動・選択喜びを扱い、問いなしを選んだ | 本人は「どこがうれしかったかはまだ曖昧」なのにReceptionで「役割を全うした達成感」「後輩の成長を見守れる安心感」を断定。unknownsでは理由不明として内部矛盾。「後輩に説明を任せた」を「後輩への説明を任せた」へ変え、対象の格も崩れる |
| E02-B | 自分になかったやり方を知れた喜びをReceptionへ反映。問い残数0を保持 | update_noteが「口を挟まずに済んだことから…へ」と旧理由を創作。旧原入力は理由不明であり、その旧理由はない。否定理由内の口出し抑制をObservationの確定事実へ採用。「どのやり方かが書かれていない」を本人の対象理解がまだ曖昧という状態へ変える |
| P01-N | 喜び・帰宅遅れ・後悔の否定・次回の余裕条件を保つ | canonical_textは原memoと完全一致。memo_action「頼まれて同僚の発表資料を一緒に直した」が本文・根拠から全欠落し、第三者へ誰の何を手伝ったか伝わらない。単独で伝わる文章形成成功にはしない |
| A02-P1 | 三記録の主な行動・結果・選択感情を17node／14edgeへ出力 | 面倒さ→不安の因果を創作し、明示unknownを落としunknowns=[]。最終返事を待つ記録を全体narrativeで任務完了へ昇格。未回答を残したい意向も欠落。買い物を明示第三役割へ追加し、結果・選択感情を未明示の因果で結ぶ |

### Analysisの具体差

- 原文の「メモを作るのが少し面倒」と選択「不安」を、「面倒さから不安が生じた」および `N17→N16 caused` へ変換。原因は本人が明示していない。
- 原文の「使いやすかったかは聞いていない」が本文・unknownsから消える。
- 「まだ返事のない人がいることも残したかった」「最終の返事を待った」があるのに、全体を「平穏な心境で任務を完了した」とする。
- 案内→待ち時間短縮→平穏、数の記録・照合→全返却→平穏、購入成功→平穏を因果化。時系列・観測結果・本人が選んだ感情を、明示因果と混同する。
- 数の照合は返却後の行為でもあるが、全体を「事前の準備により期待通り完了」とまとめる。
- node/edgeのevidenceはrecord ID止まりで、指定されたfield参照がない。Emlisのgrounded_pointsも文字列列／object列が不統一。JSON構文成功を型・意味の適合とはしない。

E02-Bは原入力＋固定補足を独立に渡したsnapshot probeである。E02-0のモデル出力を次requestへ足していない。C0原E02-0は実pendingなしENDなので、その実thread更新はN_A_NO_ACTUAL_PENDING_QUESTIONのまま。M1補足出力を実threadの回答更新成功へ昇格しない。

## 原本・保存と次の範囲

- [qwen9b_m1_results.json](qwen9b_m1_results.json) はMashから受領した53,178 bytesを変更せず保存。SHA-256 `c7830eedcb46f1a2b0b2365d1bb19c8241d6fd123e1001e18be23fcf5a9c7765`。request全文、raw応答本文全文、構造化応答、parsed output、計測・環境記録を含む。材料は既存の架空fixture。秘密値・実ユーザー本文を追加していない。
- C0/P1〜P5の旧原本・期待・実出力は変更0、今回再生成0。既存C0の本文1/N_A1/未対応2と、新P1〜P5の限定内部実装を混同せず、単純な勝敗や正式受入れへ換算しない。
- 今回の固定4場面・設定の出力は、そのまま採用できる品質ではない。9Bの全用途やCMEE接続／追加学習後の品質までは確定しない。
- 次のP6/M2は、保存した候補と現admission／private意味型の対応を確認し、根拠のない補完や欠落を採用しないoffline評価。rawを手修正してモデル成功にせず、JSONを返しただけで既存意味snapshotへ適合したとも扱わない。今回は未着手。
- 追加推論、prompt改変後の再試行、他モデル、追加学習、通常アプリ接続、Render／Supabase変更、API／DTO／RN／product source変更、merge／deployは0。

今回のGitHub反映は既存試験の受領・診断を残すRule18 LEVEL_1の限定記録。execution ownerは華恋、補助担当は読取のみ。原本・診断README・全機能00・全file地図01A・比較入口／小型再選定・weeklyを同一変更単位で同期する。STRUCTURE_MAP_DELTA_NONE（資料所在のみ、製品runtime／意味型／接続変更なし）。primary=TECHNICAL_CREDIT（M1実取得のみ）、product_credit=0、PRODUCT_NOT_CLEAR、正式Product Read0/3、candidate_ready=false、automatic_progression=false。
