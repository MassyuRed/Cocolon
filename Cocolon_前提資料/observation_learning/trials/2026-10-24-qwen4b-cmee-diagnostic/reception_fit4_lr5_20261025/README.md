# 受け取りloss4更新・学習率だけの比較 — 既知FIT意味/本文2/2

**完了・再実行不可。** source `9778aedad5e7081e540a5ce5287ea869d3e04aea`、API `7a4dc32c07f8c8a30609e8345207c6a9c831de23`。実行244.0810161260888秒、4update/保存・非学習reload後の新生成2回。元a8baf0から学習率だけ1e-5→5e-5へ変更し、既知FITの意味2/2を保ち本文1/2→2/2へ進めた。新重みは既知FIT/offline用の選択候補で、商品受入れではない。

Mashの今回の継続指示、fresh PR30 eff740/API7a4dc32、全機能00全文・work rules/必読incident・全体設計01/全file地図01A・CMEE current04・最新weekly§32・観測学習の意図/用途/前提と実codeを確認して進めた。Codex Work/GPT-6、root華恋が単一実行/統合/反映owner、補助agentはread-only review。System Context未生成はfresh原本fallbackで補い、長時間再索引を反復しない。

## 条件と実結果

不採用e3743dの同prefix1forward比較はgap0.75→0.375、teacherはrank2のまま（branch_compare_fit4_20261025）。局所改善は生成改善の保証ではない。この実測を受け、**元a8baf0から**LRだけを変えた新しい一回candidateを作った。e3743dからの続行や旧plan再実行ではない。

全文input/全teacher/EOSを保持し、reception25/24tokenのlabels以外を-100にする同じloss。4step[0,1,0,1]、AdamW5e-5/weight_decay0/clip1、seed20261024/BF16/SDPA、既存LoRA q/v16module/32tensor、context8192/greedy/maxnew2048。teacher/prompt/意味schema/reader/採用条件は変更0。process1800秒以内、retry0。実planはactual_plan.json、学習コードはpack/reception_fit4_lr5/continue_fit.py。

beforeは元a8baf0の実rawを再利用したもの。新生成はafter2件だけで、初回1095/訂正1878token・JSON/stop成功。初回raw_text不変、訂正raw_text変化。既存consume_rawで意味2/2・本文2/2、初回QUESTION_PENDING/実問い、訂正GENERATED/3更新。両parsed packetのsurface以外の意味/根拠/参照は前後同一。peak allocated12.606467247009277/reserved13.697265625GiB。

| reception NLL | before | after |
|---|---|---|
| 初回 | 0.05817059427499771 | 0.016582781448960304 |
| 訂正 | 0.09130503982305527 | 0.0404110811650753 |

このloss低下だけで成功とは扱わず、以下の実consumer本文を確認した。

- 初回観測：ぐらついていた椅子を直し、また座れるようになったのですね。
- 初回受け取り：全部一人で直せたことが、うれしかったのですね。また座れるようになったと聞けて、私もうれしいです。
- 訂正観測：友人に手順を教わり、一緒に椅子を直したのですね。
- 訂正受け取り：捨てずにまた使えるようになったことが、うれしかったのですね。またその椅子に座れるようになって、よかったですね。
- 更新記録：共同修理と、また使えることへの喜びへ訂正しました。

## actual priorと実モデル一往復の区別

actual_prior_chain.jsonは、この実初回semantic_snapshotから作った訂正messages/実questionが固定版と全一致し、そのactual priorで保存rawを再消費して四meaning key/本文/outcomeが一致した**CPU replay**。実モデルの逐次往復へ加算しない。その後の別scopeの新生成2callは[model_roundtrip_20261025](../model_roundtrip_20261025/README.md)が所有し、既知offline一往復は完了している。

## 重みと回収

選択候補 `9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835`。旧a8baf0/e3743dは保存保持。archive `8aef1b0829ac75bc1bdb2f3fb755323f03dce343b274f332f1d89d7efca2c6ea`、3,522,063bytes。全27member/size/hash・32F32tensor有限性をPod外照合し、Pod側で受領hashとの比較もTrue。元4B全重み/optimizer/RNGは含まず、厳密途中resumeではない。

[重みarchive](https://chatgpt.com/library?file_id=libfile_0ce9c648e89c8191acf7aabfa5a56b01&account_id=personal)へ保管済み。file_manifestはarchive内の原本を保持し、integrity.jsonは回収後の照合と保管identityを記録する。GitHubには重みbinaryを置かず、run/前後raw/前後NLL/前後CMEE/actual_prior_chain/comparison/manifest/integrity/consumer_provenance/actual_plan/SOURCE_COMMIT/trainingを保存する。

## 限界と現在地

既知架空chair1題の初回と訂正だけで、未知例/通常アプリ/本人保存再読/三coreの一般品質は未成立。元18候補/9教師/eval不変、Piece/Analysis完成教師0。今回の問題には観測会不要。次は既存private注入境界とservice保存・中断再開を照合し、明示offlineの保存再読確認を準備する。

GPU停止/再起動/削除/新Pod/charge/新依存/Render/Supabase/merge/deploy0、指示まで稼働保持。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、商品credit0/正式0/3/54.50％据置。現在の進行ownerは全機能00/weekly§33。
