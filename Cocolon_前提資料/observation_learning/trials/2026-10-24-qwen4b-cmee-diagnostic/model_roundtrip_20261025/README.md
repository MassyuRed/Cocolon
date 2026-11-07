# 実モデルから実CMEEの問い・訂正・再生成へのoffline一往復

**完了・再実行不可。既知架空chair1題/2段階だけ。** 結果 `OFFLINE_KNOWN_ROUNDTRIP_COMPLETE_NOT_PRODUCT_ACCEPTED`、172.4916563341394秒。新しい実モデル呼出しstarted2/completed2、両段階で意味・本文あり。初回の実semantic_snapshot/実questionを使って訂正入力を組み、訂正3更新と最終question=null/ENDまで確認した。

source `5f618f2f9433e7100ff4b2b6d586dabb91c13ef5`、script SHA256 `007233cdf80f3372c5417f949bc1997bb1be3f8308afc3d97a1ac6b0fc51b4ac`、API `7a4dc32c07f8c8a30609e8345207c6a9c831de23`。既存A4500/Pod y0eb0w0qn6nks0、Qwen3.5-4B revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、保存adapter `9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835`。非学習reload、更新0/optimizerなし/trainable parameter0、最大900秒/呼出し2、retry0。閉じた旧診断/学習planを再開しない独立確認として実行した。

## 実際に通した流れ

1. 既存verifierのnative初回requestを作り、prior=Noneから実builderでmodel messagesを作成。既存runnerのevaluateで新生成し、無補修rawを実consume_rawへ渡す。
2. 初回に本文/意味とQUESTION_PENDINGを得た場合に限り、実question全体が既存の架空本人訂正scenarioのpendingと一致することを検査。不一致なら次の呼出しをせず失敗として閉じる。
3. 実初回semantic_snapshotをcase2のpriorへ入れ、本人役の既存訂正文からrequest/messagesを構築。同じmodel instanceで2回目を新生成し、actual priorを使って実consume_rawへ渡す。
4. 両段階の四meaning key・本文/outcomeを既知FITと照合し、元fixture/adapter全3file不変を検査。

| 段階 | input/output tokens | 実CMEE |
|---|---|---|
| 初回 | 1995 / 1095、stop/EOS・JSON成功 | MEANING_AND_BODY_AVAILABLE、QUESTION_PENDING/PRE_QUESTION、ASK |
| 訂正 | 5018 / 1878、stop/EOS・JSON成功 | MEANING_AND_BODY_AVAILABLE、GENERATED/REFINED、3更新、question=null/END |

実問いのprompt_privateは『「全部一人で直せたこと」がなぜ嬉しかったのですか？』。全dictはinitial_cmee.jsonに保持する。新しい人間の観測会回答ではなく、既存架空scenarioの訂正を使った。snapshot_ref/meaning_packet/native_bindings/prior_refは各段階で既知FIT版と一致。訂正snapshot.prior_snapshotは実初回snapshot全payloadと一致し、非対象のrepair/usable_again/joyは保持された。accepted_update_refs/answer_update.updatesは各3、CLAIM修正・RELATION修正・GAP解消に対応する。独立read-only reviewでも照合済み。

モデルへ送ったmessagesは各system/user2通。teacherをassistant targetとして送らず、raw_substitution=false。両実raw_textは先のLR5 FITと一致したが、保存rawを流用した結果ではなく、今回の新規2generateである。LR5のactual_prior_chain.jsonのCPU replayとは別計上。

## 本文の確認

初回観測は「ぐらついていた椅子を直し、また座れるようになったのですね。」、受け取りは「全部一人で直せたことが、うれしかったのですね。また座れるようになったと聞けて、私もうれしいです。」。

訂正後の観測は「友人に手順を教わり、一緒に椅子を直したのですね。」、受け取りは「捨てずにまた使えるようになったことが、うれしかったのですね。またその椅子に座れるようになって、よかったですね。」。更新記録は「共同修理と、また使えることへの喜びへ訂正しました。」。

## 原本と回収

run.jsonは固定identity・条件・2call・結果・重み/fixture不変を所有。initial/correctionのmessages.json・raw.jsonl・cmee.jsonが各実入力/無補修出力/採否と意味/本文/問いを保持する。attempt.json、SOURCE_COMMIT、file_manifest.json、integrity.jsonを同封/記録。実行sourceはpack/roundtrip_check/run_roundtrip.pyに存在し、archive内実sourceもそのSHA256と一致。

archive `c7544154321f283ff1fff6ef6d144b2e2e768f5b59c2fcfc940fc6404fa72a13`/42,694bytes、全11member（manifest10対象+manifest自身）をPod外回収し、size/hash/安全pathを照合した。GitHubには全実データを保存。重みbinaryはこのarchiveに含めず[LR5の保管済みarchive](../reception_fit4_lr5_20261025/README.md)を参照する。

## 確認範囲と次

これは実native request→model messages→2つの実raw→既存CMEE consume_rawを順に通した、同一processの既知offline一往復である。通常async ModelCandidateSource/service、Auth/SQL/HTTP、RN/本人端末、保存後の中断再開/再読は呼んでいない。一般自由文や他coreの実4B、商品品質へ拡張しない。

次は既存private注入境界とservice保存・中断再開責務を照合し、実出力を保存再読へ渡す明示offline確認を準備する。teacher/prompt/意味schema/reader/採用条件/通常application/DTO/DB/RN/三core責務変更0。今回の問題には観測会不要。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、商品credit0/正式0/3/54.50％据置。GPU停止/再起動/削除/新Pod/charge/新依存/Render/Supabase/merge/deploy0、指示まで既存GPUを保持する。全機能00/weekly§33が現在の進行owner。
