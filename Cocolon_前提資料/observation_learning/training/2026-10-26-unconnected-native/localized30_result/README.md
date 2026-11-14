# localized30実行結果 — 完結性は改善、本文成立は増えず

状態：**RUN_CLOSED_REJECTED_CANDIDATE**。承認された一回は完了・回収済みです。新adapter **937233a0** は通常不採用。追加学習・生成・再試行へ自動進行しません。

Mashが[proposal1cfc0f83](https://github.com/MassyuRed/Cocolon/blob/1cfc0f838186574c6cbc870e7b94f6706dab39aa/Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/localized30_preparation/README.md)の「同15教材30更新→保存・非学習再読込→15件確認、最大45分・処理按分$0.21（準備・回収・保持等別）」へ「進めていいよ。」と明示承認。必読商品原本・永久incident・全体設計と全file地図の導線・最新weekly§75・承認案を確認し、既存Pod bkj4qvnhwtdqc2/RTX A5000のJupyterへ直接接続してroot華恋が実行しました。

## 実行と到達点

実モデルsource **d54ea1db19ab8fb3c3a57fc07b5a20566f245591**、GPU wrapper PID **194923**、固定API **a4b91b4788b2fb29483a4c77869c91b36402ae9f**。Qwen3.5-4B/revision851bf6eと保存109cの全112F32/3,833,856parameterを照合して開始しました。

同15教師を各2回・固定順序で**30更新**。旧9は既存全文CE、新6は全文CEに加えて既知198target位置だけ相対16倍、計396重点token exposure。LR1e-5/seed20261024/clip1/AdamW weight_decay0、fresh optimizerです。教師本文・target token列・EOS・生成capは不変、新しい教材/題材0。promptは既存unknown_id制約1項目の教示だけを加えています。指示とlossを同時に変えているため、結果を一方だけの効果へ帰属しません。

新directoryへ保存後、同OS process内の新model objectへ**非学習reload**し、112tensor全key/shape/値一致と全parameter no-gradを確認。空assistantから各1回、15件を自由生成しました。全15が元cap内にEOS到達し、timeout/OOM/モデル再試行0。変更されたtensorは112です。

GPU処理は **1524.4009482470574秒（25分24.401秒）×$0.28/3600＝$0.11856451819699337**。最大2700秒/$0.21以内です。準備・CPU・回収・保持・保存・通信・税等は別で、総請求額ではありません。[run.json](run.json)/[training.jsonl](training.jsonl)を原本のまま保存しています。runのstatusは`RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEW`の当時値を保ち、最終閉鎖・判定は[result_summary.json](result_summary.json)が所有します。

## 同15件の結果

| checkpoint | EOS | strict JSON | 意味採用 | 本文成立 | 新6本文 |
|---|---:|---:|---:|---:|---:|
| 初期1d218763 | 15 | 15 | 11 | 9 | 0 |
| 初期として読んだ109cの前回評価 | 12 | 12 | 11 | 9 | 0 |
| 今回937233a0 | 15 | 14 | 11 | 9 | 0 |

旧9はEOS/strict JSON/意味/本文が各9/9。全9の**raw_text bytesは前回109cと同一**、parsed packetは凍結教師の全値と一致し、実CMEE本文・問い・訂正全3更新を維持しました。record全体はadapter metadata等が違うため同一fileではありません。[case_comparison.json](case_comparison.json)に比較を残しています。

新6はEOS6/6、strict JSON5/6、意味2/6、本文0/6です。以前打切りだったBOOK回答後・SHOP回答後・KNITが最後まで出る局所改善はありました。しかし、必要な意味・全更新・本人向け本文を同時に保てず、通常候補の採用条件を満たしません。

| 新6件 | 出力token | 実CMEE採否 | 本文 |
|---|---:|---|---|
| BOOK初回 | 1055 | HOLD / model_v3_unknown_not_source_bound | なし |
| BOOK回答後 | 2638 | INVALID_FORMAT → REJECT / semantic_receipt_not_validated | なし |
| SHOP初回 | 1095 | 意味採用 / model_surface_not_validated | なし |
| SHOP回答後 | 2717 | INVALID_EVIDENCE → REJECT / semantic_receipt_not_validated | なし |
| REPOT | 962 | 意味採用 / model_surface_not_validated | なし |
| KNIT | 991 | UNSUPPORTED / model_evidence_out_of_scope | なし |

旧9は椅子初回/訂正の各3IDとうどん3IDという2言語family、新6は4言語familyです。15独立題材や未知入力ではありません。回答後priorは凍結教師採用snapshot由来であり、実生成した初回からの動的thread成功ではありません。

## 固定CMEE・保存再読

CPU consumer PID **203548**、**101.88006124206681秒**。全raw15を補修せず同じreaderへ通し、意味11・本文9。採用snapshot11の保存・別process再開・完成file再読は**11/11の全outcome一致、失敗0**でした。この11には**本文なしのSHOP初回とREPOTの2件**を含み、本文11完成ではありません。後段の新モデルcall/学習/SQL0、service_saved_roundtrip=false、dynamic_prior=falseです。

[diagnosis/summary.json](diagnosis/summary.json)と[全15case](diagnosis/cases/)に完全診断をmetadata＋caseへ値不変で分割し、再組立て一致を確認しました。saved/completed/cold各11原本も保存しています。元のdiagnosis.jsonは1,371,768bytesで、重み入り原本ZIPにbytes不変で含まれます。採否より後段へ到達しなかったcaseの静的本文所見を、実際の本文reader拒否理由として扱いません。

## 全本文・問い・全更新を読んだ所見

[root読解](reading_reviews/root.json)、[BOOK/SHOP全件](reading_reviews/body_review.json)、[identity・旧9・REPOT/KNIT](reading_reviews/identity_review.json)を保存しました。補助はread-onlyで、正式Pro/Ultra/human Product Readへ換算しません。

- **旧9**：椅子の修理/再利用の喜び、訂正後の共同修理・喜びの対象変更・GAP解消の3更新、うどんの帰宅/調理/食事と少しの落着きを維持。椅子の喜び/再利用の反復や処理説明的な訂正文は残り、新しい文章の深さを示す結果ではありません。
- **BOOK初回**：4claim/2relation/6quoteとunknown内容4fieldは教師どおりですが、日本語unknown_idはASCII契約へ不適合のまま。自分の同じIDへの参照整合と契約不適合は分けます。旧観測案の未記載の安心感と本文内質問は消えた一方、受け取りの「『大丈夫』って言って、その本を返した」「その後のこと、まだ聞けていない」は発話側/返却側を混同し、未記載経験を足しています。
- **BOOK回答後**：EOSまで閉じても、`candidate.schema_version`にsemantic proposal版とquote wire版を二重出力しstrict拒否。重複はunknownsではありません。教師7更新に対してADD1のみ、INVALIDATE_GAPなし。13引用へのstart付与・原文役割/時点/参照不整合・範囲外13〜16が残り、update_noteは説明済みの気がかりを「未記載」へ戻しています。本文bindingと文内容も一致せず、受け取りはほぼ本人回答の一人称復唱です。重複packetは原文読解だけを行い、修復・再採否0です。
- **SHOP初回**：喜びと主観的な置いていかれた感じは意味採用。IDは合法な別名で、教師IDとの文字列差を誤りに数えません。観測の「开店」「…のですか」という本文内質問、旧109cと同じ受け取りの復唱が残り、本文不成立です。
- **SHOP回答後**：EOS/strict JSONと6relationまで出しましたが、引用には原文にない英語3行と誤sourceがあり、INVALID_EVIDENCE。教師8更新に対してADD1だけ、GAP解消なし。17引用に参照17/18、update_refs[0,1]に実更新1という不整合も残ります。否定・時点の根拠がずれ、受け取りは本人の「と感じた」を事実に近づけ、喜びを落としています。途中の「8更新」というユーザー向け報告は期待値との取り違えとして訂正済みです。
- **REPOT**：意味4claim/2relationは採用しても、「叔父に植え替えの手順を説明し」で教わった側が説明側へ反転。旧「聞かせた」は「聞けて」に変わったものの本文不成立です。「安心できよかった」も不自然です。
- **KNIT**：EOS・短い合法IDへ改善し、旧system逐語露出と数字長反復は消えました。実拒否はmodel_evidence_out_of_scope。4引用がそれぞれrole anchorへ末尾句点を足した差を含みます。本文2欄は完全同文で、未記載の作者の安心と「不明さを保持します」という処理説明が残ります。静的kind差を実拒否原因へ置き換えません。

次は、**既存教師で長い意味・全更新・根拠・自然本文を同時に保持する学習設計をCPU準備から見直す**段階です。同じ回数/LRだけの有料反復、reader緩和、正解prefix評価、出力補修へ自動進行しません。既存教材でのFIT不足が残り、教材不足を原因と確定していないため、**今は新観測会を必要条件にしません**。

## 事前拒否と実モデル一回の区別

最初の承認commit ef3bf3dfでは、plan全体のJSON再直列化で`gradient_clip:1.0`を整数1へ崩しました。最初のwrapper PID193723は`local_plan_scope:gradient_clip`型検査で拒否され、output作成・CPU準備・実4B読込・更新・生成の前に停止しました。原案の形式を保持し、status/gpu_run_authorized/approval_basisの3項目だけを変えたd54ea1dbへ修正し、fresh GitHub読戻し後に承認済みの実モデル一回を開始しました。

**wrapper起動2・事前拒否1・実モデルrun1・モデル再試行0**。両launch/logと0効果の事前拒否記録を[execution/](execution/)へ保存しました。元案からの学習条件・時間・予算拡張はありません。失敗要求のモデル再callやGPU再起動でもありません。

## 重み・原本の保存と閉鎖

新重みSHA256 **937233a0d2f89425bf42abf971f4e37662bb2db8c6fddaf3fe5884349e1d95bd**。Pod外でもsaved112F32/3,833,856全要素有限、30更新順序/有限勾配/396重点、15raw identity、元source/初期109c不変を照合しました。

重み入り原本は**15,171,902bytes / SHA256 d77f865ef019c6cd69988733ac4dcb13b808292157660057497590b1c7ad6a20**、全**82payload＋manifest/83member**。CRC・全size/hashを照合し、[保存重み・全runtime原本version0](https://chatgpt.com/library?file_id=libfile_93e16ba81d5c8191986438057de80a9a&account_id=personal)へ保全しました。[archive_identity.json](archive_identity.json)、[全manifest](runtime_archive_manifest.json)、[外側照合](external_verification.json)にidentityを記録。root/補助読解はGitHubのreading_reviewsが所有し、凍結runtime ZIPの中身とは区別します。base全重み・optimizer/RNG stateは非同梱で、厳密optimizer途中再開ではありません。

[GitHub反映集合](repo_payload_manifest.json)に今回の全反映pathとbytes/hashを記録します。

元109c・旧runは不変、当該一回/出力/承認枠は閉鎖済み。GPUは稼働保持しStop/restart/delete0。今回の実行でAPI source/採用reader/意味型/wire/DB/DTO/RN/Render/Supabase/本人DB/価格/依存/モデル選定/merge/deployは変更0。STRUCTURE_MAP_DELTA_NONE、限定TECHNICAL_CREDIT、**商品0/正式0/3/54.50％/PRODUCT_NOT_CLEAR/candidate_ready=false/automatic_progression=false**。未知一般化・通常serviceの保存再読・本人端末・Piece/Analysis品質は今回の成功へ加算しません。
