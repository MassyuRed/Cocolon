# ordered30 一回の最終結果

状態：**RUN_CLOSED_REJECTED_CANDIDATE — 一回完了・新重みは通常不採用**。このoutput/plan/承認は再利用しません。

**現在の直接作業（10/27：ordered30一回完了、意味3/本文3へ退行・新候補不採用）：** 承認source5b115939/PID96980で初期1d・同30順序/全文CE/LR1e-5・教師JSONの生成順だけを変更し、30更新→保存/同process内の非学習reload→15生成を1482.907733秒/$0.115337処理按分で完了。EOS13/strict JSON8、意味/本文3/15（旧9各3・新6各0）で初期11/9から退行。固定CMEE無補修採否と別process cold3/3、CPU33.761113秒/追加モデル・SQL0。全61payload＋manifest/32F32有限/早期最終重み一致をPod外照合しversion2保全。新483d74b7は通常不採用、一回閉鎖/再起動不可。追加学習/再生成/新有料試行なし。新観測会は今は不要、原本ordered30_result/README・weekly§69、商品0/正式0/3/54.50％、GPU稼働保持。

## 実行範囲と実績

Mashが固定案[e94971f9](https://github.com/MassyuRed/Cocolon/blob/e94971f9b7552989fdd1fe3710a683b9e68662da/Cocolon_前提資料/observation_learning/training/2026-10-26-unconnected-native/ordered30_preparation/README.md)の「30更新→保存・非学習再読込→15件確認、最大45分/$0.21処理按分（準備・回収・保持等別）」へ「進めていいよ。」と承認しました。source **5b115939e2f05e47b0c3d8fef8ce54e9cf11068c**、既存Pod bkj4qvnhwtdqc2/A5000、Jupyter直接でroot華恋がPID96980を一回だけ起動しました。管理console/API操作・GPU Stop/restart/deleteは0です。

初期1d218763、同15件×同2pass/同30順序、全文assistant/EOS平均CE、LR1e-5、32LoRA、context8192、旧9 cap2560/新6 cap3712を固定。変更は教師assistant JSONのobject-key生成順だけで、parsed値・配列順・元教材・system/user・評価入力・凍結prior・CMEE reader/API6b043880は変更していません。30更新と別adapter保存、学習model参照解放後の**同OS process内の別model objectへの非学習reload**、同15生成を完了しました。別OS processは後続cold-file再読です。

処理 **1482.9077327260748秒（24分42.908秒）×$0.28/3600＝$0.11533726810091693**。最大2700秒/$0.21内、準備/CPU診断/回収/保持/保存/通信/税等は別です。15call開始/完了、before0、追加更新/再生成/retry0。CHAIR01初回2560とSHOP初回3712のtoken打切り2件、per-call timeout/OOM0。非EOSを補完・再生成していません。

[run.json](run.json)は実行原本status=RAW_COMPLETE_PENDING_CMEE_AND_CONTENT_REVIEWのまま保持します。最終判定は[result_summary.json](result_summary.json)、30更新の証拠は[training.jsonl](training.jsonl)、起動とlogは[execution](execution/)です。閉鎖のため実行原本statusを書き換えません。gpu30_ordered.plan.jsonのAUTHORIZED_ONCE_BOUNDは当時の一回承認原本で、新しい実行許可ではありません。

## 同じ15件での比較

| checkpoint | EOS | strict JSON | 意味採用 | 本文成立 | 新6本文 |
|---|---:|---:|---:|---:|---:|
| 初期1d218763 | 15 | 15 | 11 | 9 | 0 |
| 直前continuation30 dd1188e8 | 12 | 12 | 11 | 9 | 0 |
| 今回ordered30 483d74b7 | 13 | 8 | 3 | 3 | 0 |

JSONの通常構文として読めるものは12件ですが、重複keyを拒否するstrict JSONは8件です。EOS13をJSON13や本文13へ数えません。旧9はEOS8/JSON6/意味3/本文3、新6はEOS5/JSON2/意味0/本文0です。初期/直前の旧9意味/本文9/9から退行しました。

保存済みbaseline30原本の同caseに対応付けました。新baseline生成0。各caseのsource_path/blob SHA/raw SHA・同一性はresult_summaryとreading_reviewsにあります。成立DAILY3件のparsed packetは教師/両baseline全値一致ですが、同じ一language familyの異なるIDです。全15も旧2family/新4familyの既知FITであり、独立した15未知例や一般化評価ではありません。

| case | EOS | strict JSON | 意味 | 本文 | 実CMEE理由 |
|---|---|---|---|---|---|
| TRAIN-SERVICE-CHAIR-01-INITIAL | × | × | × | × | semantic_receipt_not_validated |
| TRAIN-SERVICE-CHAIR-01-CORRECTION | ○ | ○ | × | × | model_claim_coverage_invalid |
| TRAIN-SERVICE-CHAIR-02-INITIAL | ○ | × | × | × | semantic_receipt_not_validated |
| TRAIN-SERVICE-CHAIR-02-CORRECTION | ○ | ○ | × | × | model_evidence_out_of_scope |
| TRAIN-SERVICE-CHAIR-03-INITIAL | ○ | × | × | × | semantic_receipt_not_validated |
| TRAIN-SERVICE-CHAIR-03-CORRECTION | ○ | ○ | × | × | model_evidence_out_of_scope |
| TRAIN-DAILY-CALM-01-INITIAL | ○ | ○ | ○ | ○ | 採用・cold一致 |
| TRAIN-DAILY-CALM-02-INITIAL | ○ | ○ | ○ | ○ | 採用・cold一致 |
| TRAIN-DAILY-CALM-03-INITIAL | ○ | ○ | ○ | ○ | 採用・cold一致 |
| FT-BOOK-INITIAL | ○ | ○ | × | × | model_v3_unknown_not_source_bound |
| FT-BOOK-AFTER-ANSWER | ○ | × | × | × | semantic_receipt_not_validated |
| FT-SHOP-INITIAL | × | × | × | × | semantic_receipt_not_validated |
| FT-SHOP-AFTER-ANSWER | ○ | × | × | × | semantic_receipt_not_validated |
| FT-REPOT-INITIAL | ○ | ○ | × | × | model_evidence_out_of_scope |
| FT-KNIT-INITIAL | ○ | × | × | × | semantic_receipt_not_validated |

## 実CMEE・保存再読

consumer **105461**、固定source同一、完全API copy /workspace/cocolon_afteronly_api_20261027を明示し、新outputで一回だけ実行しました。**33.761113197077066秒**、無補修raw15、意味3/本文3、採用snapshot3の別process cold-file再読3/3、失敗0。今回cold3は全て本文ありで、本文なしoutcomeの加算は0です。追加model/学習/SQL0、service_saved_roundtrip=false、dynamic_prior=falseです。

[診断summary](diagnosis/summary.json)と[case原本の分割表現](diagnosis/cases/)に全caseを保存しました。GitHubでは大きな単一diagnosisをmetadata＋全caseへ値不変で分割し、元の完全diagnosis.json **1,316,408bytes/SHA256 8081f0f8b1e936b860818fc43d93563e1cbd90d826fec974adeaaafe8d12589c** は最終回収archiveへbytes不変で保存しています。saved/completed/cold各3原本も同folderにあります。分割をraw補修や再採用へ使っていません。

after回答のpriorは凍結教師由来で、生成初回からの動的threadではありません。実service/SQL/Auth/RN/本人端末/未知一般化/商品受入れは未確認です。

## 全件読解と不採用理由

rootとread-only補助agentで全原入力・教師・無補修raw・実本文を読解し、[旧9](reading_reviews/old9.json)/[新6](reading_reviews/new6.json)へcase別所見を保存しました。補助読解を正式Pro/Ultra/human受入れへ換算しません。

- 椅子初回：01は範囲外根拠の関係反復で未完結。02/03はschema重複・本文の誤配置・引用4に対するindex4/5で退行。
- 椅子訂正：01/02は共同修理/指導と全更新が欠落。03は自然文3節が教師一致でも、本人訂正の根拠と更新参照が崩れています。
- BOOK：初回は初期とraw同一で、未記載の安心と本文内の問いを補完。回答後はEOSになったもののschema重複、原文にない内部IDの引用、7更新→ADD1、回答済みなのに「対象は未記載」、本人一人称の復唱です。
- SHOP：初回は「そしてその後のこと」571回で未完結。回答後もEOSだけで構文未閉鎖、引用誤配置/根拠ずれ、8更新→ADD1、否定/譲歩/全更新を保てず本人一人称へ混線します。
- REPOT：引用6→2で根拠範囲外となり、初期で通った意味も不採用。説明の主客反転と本人一人称の受け取りが残ります。
- KNIT：反復/長いsystem指示露出が今回見られない局所差はありますが、schema重複、現在不明の過去化、復唱/本人一人称が残ります。未到達箇所もあるため指示漏出解消の証明にはしません。
- DAILY3：帰宅してうどんを作り食べ、温かいもので少し落ち着いた内容の本文が教師/両baselineと一致。問い/更新なし。ここだけの維持を全体改善へ数えません。

**この固定条件ではserialize順変更だけで、長い意味/更新packetと自然本文の同時保持を達成できませんでした。** 順序が唯一の原因、すべての順序学習方式の否定、4Bの能力上限確定とはしません。次は既存教師/原本から、根拠・全更新・役割・本文を同時に保てる学習設計を見直す段階です。同じ回数/LRだけの連続有料試行は自動追加しません。**今は新観測会を必要条件にしません。**

## 重み・全原本の保全

新weights **483d74b7d6796398b06f80b486228bec86658e8bcdc3d03c71cb5006d3b75de9**。初期1d/固定source/生成前後不変、早期最終重み一致、32F32 tensorの全要素有限をPod外でも確認しました。最終archive **3,692,028bytes / SHA256 12fd8b4482f259dea969fe94351fd92a3e00a760cc12d643dee8ca1f4abce167**、全61payload＋manifest/62memberのbytes/hashを照合し、[重み・全原本version2](https://chatgpt.com/library?file_id=libfile_00da515f0f7c8191a0886e28af4f923e&account_id=personal)へ保全しました。[final_recovery.json](final_recovery.json)/[全manifest](final_manifest.json)に識別値があります。GPU生成最終archive32payload＋manifestと、CPU後の転送archive56payload＋manifestも別identityで照合済みです。

早期version0/399.800995906秒/30更新/生成0、[early_run.json](early_run.json)/[early_recovery.json](early_recovery.json)は当時の原本として保持します。最終で書き換えません。base4B全重み・optimizer/RNG非同梱でstrict optimizer resumeではありません。

実行worker PID96980/105461はいずれも終了、GPUはA5000/1MiB/24564MiBで稼働保持。Stop/再起動/削除0。通常API/DTO/DB/RN/Render/Supabase/本人DB/merge/deploy/新依存変更0、STRUCTURE_MAP_DELTA_NONE。primary=BLOCKER_NARROWED、**商品0/正式0/3/54.50％/candidate_ready=false/automatic_progression=false**です。
