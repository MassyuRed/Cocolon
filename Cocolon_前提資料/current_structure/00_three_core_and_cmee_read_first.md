---
doc_id: cocolon_three_core_and_cmee_current_structure_entry
title: "三大中核構造とCMEE — Current Structure Read First"
revision_date: "2026-09-11 JST"
document_role: "CURRENT_STRUCTURE_ROUTING_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
decision_owner: "Mash"
operational_owner: "Karen"
implementation_effect: 0
automatic_progression: false
---

> 2026-09-11 Q4現在地：修正版v1.2に従い、公開用mode・単一生成owner・旧client/保存版互換・停止復旧・bootstrap/RN統合を実装し、API163件とRN56件を確認した。初回の不自然な名詞化と肯定的回答/当時訂正の本文不成立を修正。保存済み公開合成22ケースと既存100件を全読した。本文の長い再掲と定型性は引き続き改善対象で、商品NOT_CLEAR、公開未実施。Q4の実装・検証・具体的残件は正本06とAPI既存handoffの末尾Q4節。実DB・端末・実課金・Mash正式判断・公開は別資料で扱い、その未実施をコード進行の停止条件にしない。

> 2026-09-11 Q3時点の記録：添付修正版Technical Design v1.2に従い、Q2のコード実装完了からQ3へ進めた。Plusの適格本人履歴、Premiumの本人続行による最大3問と確認・修正・否定できる解釈フレーム、限定条件のLayer3を保存・API・RNまで実装した。Q3のコード実装は完了し、次の実装単位はQ4の統合・実本文確認・互換性・公開接続準備。実DB適用、端末・実課金確認、Mashの正式商品判断、公開操作は別作業として未実施。default OFF、商品NOT_CLEAR、Draft/open/unmergedを維持する。以下の旧Q1/Q2段落・Product Read待ちの順序は当時の履歴であり、Q3/Q4のコード進行を止める現行条件ではない。現在の進行ownerは本系列の`06_implementation_order_migration_and_verification.md`末尾Q3節とAPI既存handoff末尾Q3節。

## 2026-09-11 Q2履歴 — 保存・API・入力/履歴の一往復

Q1 pure53件を確認後、Q2 development applicationをdefault OFFで実装。稼働DB適用と端末の開発アプリ確認は残るためQ2完了・商品PASS・公開とはしない。実装/確認の現在ownerはAPI既存handoffのQ2節と `ai/docs/EMLIS_Q2_DEVELOPMENT.md`。以下のQ1記録はQ1時点の効果を示す。

追加/変更fileと他core・国家・旧経路との接続は [EmlisAI current mapのQ2節](01_emlis_ai_current_structure.md) に集約する。Q1の純粋作者、Q2の保存と画面、Q3の有料拡張、Q4の商品/公開判断を分ける。




# 三大中核構造とCMEE — Current Structure Read First

> 2026-09-10 Q1更新：Mashの添付「CMEE Question System Technical Design」v1.1とQ1実装指示により、現在の開発順は **Q1（Free相当の純粋処理・実本文一往復）→Q2（保存・API・RN）→Q3（有料の履歴・後続round）→Q4（商品確認・公開判断）** です。単独応答100件またはRound 0のProduct Read PASSをQ1開始条件にしません。過去のNON_PASS・未解決品質・公開条件は保持します。Q1はdisabledで意味・実本文一往復と必要回帰の確認済みで、Q2以降／商品PASS／公開は未成立です。現在の再開先はAPI既存 `CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` のQ1節、正本 `02_emlis_v1a_detailed_design.md` の「2026-09-10 Q1」、`05_json_schema_and_versioning.md` の「Emlis thread v1 profile」です。

## 2026-09-10 Q1現在地 — Emlisの一往復を共通本文経路へ接続

Q1は、今回の入力を読んだ初回観測とフォローを先に返し、本人がどう受け取ったかの重要な一点だけを問い、別sourceの本人回答で意味と本文を更新する開発単位である。単独応答の全面Product Read PASSは開始条件にしない。Emlisの商品品質判定は引き継ぎ、Q1の機械検証を商品PASSへ換算しない。

| 実装owner（mashos-api / ai/services/ai_inference） | 責任 |
|---|---|
| `cocolon_meaning_experience_engine/engine.py` | 既存single callableのEmlis thread版分岐と純粋`prepare_emlis_update`。旧単独入力経路を維持。 |
| `.../emlis_thread_contracts.py`・`emlis_thread_source.py` | Free固定source集合、原source不変、独立回答envelope、元field／scalar／UTF-8へ戻るqualified evidence。 |
| `.../emlis_question.py` | sourceに結びついた一問の必要性・焦点・既質問／終了を純粋判定。質問文を意味根拠にしない。 |
| `.../emlis_answer_update.py` | ADD／REVISE／WITHDRAW、時点、訂正対象・依存先・未確定部分を本文前に検証。 |
| `.../emlis_thread_projection.py` | 検証済み意味を既存IM03、選択意味、Receptionへ渡す。対象関係はthread版ABOUT_TARGETで保持。 |
| `.../emlis_thread_surface.py`・`emlis_thread_engine.py` | 既存Human Reception作者・Sentence Surface・独立逆検証を使用。本文失敗でもcheckpointを保持し、旧本文を現在へ付け替えない。 |
| 既存`emlis_ai_grounded_observation_plan.py`・`emlis_ai_grounded_human_reception.py`・`emlis_ai_grounded_sentence_surface.py`・`emlis_ai_grounded_observation_gate.py` | source文法、本文作者、二節構造、関係・時点の独立照合。別の本文rendererを作らない。 |

国家システム・課金・入力件数・永続化への効果はQ1で0。runtimeはOFFLINE_CANDIDATEのまま、productionの`emlis_ai_reply_service`、公開I5、API、DB、RNへまだ配線しない。`TodayQuestion`は別機能のまま、Piece／Analysisのsource許可を拡張しない。回答は新しい原入力件数にも国家eventにも数えない。訂正済み解釈を過去artifactから復活させない下流利用規則は設計として保持し、Q2以降で実データ経路へ接続する。

検証は `ai/tests/test_cmee_emlis_q1_thread.py` が新しい一往復と逆検証を担当する。`ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` は変更した共有9ownerの固定test snapshotであり、旧IM03 receipt・runnerを上書きせず、thread全体の品質証明にも使わない。

全ファイル地図の既存各familyと旧経路の役割は保持する。新ownerは上表の7ファイルに限定し、共通Stage1候補・投影・HRの責任を継承する。保存・再読込・画面までのアプリ完成はQ2、履歴／プラン差はQ3、Mashの商品確認・公開はQ4であり、今回は成立したと扱わない。


## 0. この入口が必要な理由

これまでの前提資料には、三大中核構造に関する情報そのものは多く残っていた。
しかし、EmlisAIはroadmap、Cycle資料、alignment、実装資料へ分散し、Pieceは専用資料がある一方でcurrent実装状態とのずれがあり、分析構造は専用のcurrent structure ownerがなかった。
CMEEは設計候補がlocal artifactに留まり、GitHub上のdurable ownerがなかった。

その状態では、作業のたびに巨大な追記資料と実ファイルから全体像を再構成する必要があり、次の事故を起こしやすい。

- 商品目的と直接関係しない補助経路を主経路へ昇格する。
- historical、current actual、designed futureを混同する。
- 一つのfileだけを直し、その変更がどの商品flowへ接続するかを見失う。
- 既に別ownerが持つ責任を重複実装する。
- machine GREENや再現性証明を商品品質の代用にする。

このdirectoryは、これを防ぐためのcurrent構造図である。新しいchecker、Gate、Receipt、進行authorityではない。

## 1. 最初に読むexact4

| 構造 | Current structure map | 商品target | Current stateの要点 |
|---|---|---|---|
| EmlisAI構造 | [01_emlis_ai_current_structure.md](01_emlis_ai_current_structure.md) | 入力を「読まれた形」の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める | production観測／受け取りはCURRENT_ACTUAL。問い／refined observationはQ1〜Q3コード実装済み、Q4統合が次。環境適用・商品判断は別作業 |
| Piece構造 | [02_piece_current_structure.md](02_piece_current_structure.md) | 保存済み入力を、他者が単独で受け取れるcanonical textと画像artifactへ変える | current user-visibleはold Q&A。Piece V2はCODE_DISABLED／DESIGNED_NOT_IMPLEMENTED |
| 分析構造 | [03_analysis_current_structure.md](03_analysis_current_structure.md) | 蓄積入力から現在の自己構造routeを根拠付きで示し、観測routeと分離したIF routeを扱う | current Watashi Mapはpresentation-oriented。evidence graph／IF routeはDESIGNED_NOT_IMPLEMENTED |
| CMEE | [04_cmee_current_structure.md](04_cmee_current_structure.md) | exact3の商品に共通するsource・意味・plan・realization・traceを持つ共有生成中枢 | DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE／NO_SAFE_CMEE_V1A_CANDIDATE_STOP／NOT_IMPLEMENTED／NOT_PRODUCTION_CONNECTED |

CMEEは技術上first-classに育てる共有Engine targetであるが、独立したuser-facing商品目的を持たないため、商品構造上の「第四の中核」ではない。商品中核はEmlisAI／Piece／分析構造のexact3である。

## 2. 読む順

作業開始時は次の順で読む。

1. ../work_attitude_rules_for_karen/00_read_first.txt
2. ../work_attitude_rules_for_karen/CURRENT_RULES.md
3. ../work_attitude_rules_for_karen/09_work_start_checklist.txt
4. 本file
5. 変更対象のcurrent structure map exact1以上
6. mapが指定するproduct/design owner
7. mapが指定する実際のsource、contract、test、RN、API、DB owner
8. Cycle001の場合だけ、Draftを含むfreshな../08_cycle001_current_state.md

CMEEの詳細設計へ入る場合は、04 mapから [CMEE V1 詳細設計 — Read First](../designs/cmee/v1/00_read_first.md) を開き、shared／schema／対象core／実装順の順で読む。

前提資料だけで実装事実を決めない。前提資料を地図、GitHubの実ファイルを現物として両方確認する。

## 3. Authorityの優先関係

このmap群は「どこを読めば全体を復元できるか」のownerであり、商品仕様やcurrent actionを勝手に変更しない。

1. Mashのcurrentな明示指示
2. 各mapに記載されたproduct／design canonical owner
3. current actual source、contract、protected test
4. Cycle001の作業選択に限り、freshな08_cycle001_current_state.md
5. 本current structure map
6. historical、audit、Receipt、Handoff、旧Plan

相違がある場合、mapに都合よく現物を読み替えない。相違をcurrent mapへ記録し、product ownerまたはMash判断が必要なscopeを示す。

## 4. 「構成ファイル」の意味

各mapはrepository内の全blobを列挙しない。次のarchitecture-level ownerをcurrentなpathまたはpath familyとして列挙する。

- user-visible entryとproduct route
- source／meaning／plan／realizationのowner
- API、DB contract、RN consumer
- safety、privacy、lifecycleのowner
- acceptanceを拘束する代表protected tests
- current design、future design、historyのowner

同じ責任の細分fileはpath familyで束ねる。新しいarchitecture ownerが表にないpathへ作られた場合、その変更と同じwrite unitでmapへ追加する。

## 5. Current／Designed／Historicalを混ぜない

| lifecycle | 意味 |
|---|---|
| CURRENT_ACTUAL | current mainで実在し、active production／product経路を構成する |
| CURRENT_PRODUCT_OWNER | 商品目的・保護条件のcurrent owner。実装済みとは限らない |
| CURRENT_WORKING_DRAFT | unmerged Draftでのみ成立するworking current／navigation。main、production、acceptedへ数えない |
| ACTIVE_OFFLINE_WIP | mainまたはDraftに実在するがproduction public routeへ未接続の実験／Cycle経路 |
| DORMANT_OR_PARTIAL | fileまたは部分contractは存在するがcanonical active call chainへ未接続 |
| DESIGNED_NOT_IMPLEMENTED | 将来design。runtime、API、DB、RN effectはまだない |
| EXPERIMENTAL_OR_DRAFT | disabled、private、Draft、test-only等。production ownerではない |
| HISTORICAL_REFERENCE | 経緯・失敗知識・再利用候補。current next actionを所有しない |
| SHARED_SUBSYSTEM | 複数coreが使う既存subsystem。CMEE全体または商品目的ownerとは限らない |

各mapのLEGACY、CODE_DISABLED、PROTECTED_TEST等のsuffixはこのlifecycleを狭くする補助分類である。「設計がある」「testがある」「Draftがある」を、「稼働している」「商品合格した」へ変換しない。

## 6. Mapの更新契約

次のいずれかを変更するworkは、影響するmapを同じGitHub write unitで更新する。

- 商品目的、user-visible flow、core間の責任境界
- component責任、active owner path、entry point
- API、DB、RN、public contract、artifact lifecycle
- current／future／historical status
- 新しい共通化、旧ownerのretirement、active duplicateの解消
- 守るべきmeaning、safety、privacy、Product Read条件

内部実装だけのbounded fixで構造差分がない場合、mapを無意味に更新しない。作業記録またはPR説明にSTRUCTURE_MAP_DELTA_NONEと理由を一行残す。

Map更新のためにmap checker、map Receipt、map専用manifest family、phaseごとのcopy、append-only incident section、path SHA chainを新設しない。履歴はGit historyを正本とし、各mapにはmilestoneへの短いpointerだけを残す。

## 7. Cross-core境界

- EmlisAI body／voiceをPieceまたは分析構造へ流用しない。
- Pieceのcanonical text／visual artifactをEmlisAI observationまたは分析claimのsourceにしない。
- 分析構造の推定、route、simulationをEmlisAIまたはPieceの観測factにしない。
- CMEEは共通言語・artifact生成primitiveを提供してよいが、core固有のsource採用、何を言うか、voice、artifact lifecycle、Product Readを奪わない。
- machine verification、human Product Read、runtime readiness、Cycle acceptanceは相互変換しない。

## 8. Last verified refs

この版の構造監査preimage:

    MassyuRed/Cocolon main
      de9c3d985053bbaaa7fc0d396e688cc2097ece40

    MassyuRed/Cocolon Draft PR #29
      0854e21f92f841fd2cfdcef08b9e3117fc93f96a
      OPEN / DRAFT / UNMERGED

    MassyuRed/mashos-api main
      a8ca4ddf7b7ae76bf7b3d73e74e3a5808d623428

    MassyuRed/mashos-api Draft PR #2
      958c1b53f5b5894691e0b10e2d991fb8236d9f6f
      OPEN / DRAFT / UNMERGED

このSHAを将来のcurrent事実として固定しない。次の作業はfresh headと実pathを再確認する。

## 9. この資料化のcredit

このworkは、current全体構造のowner不在／分散という観測済みblockerを最小補正するOBSERVED_BLOCKER_MINIMAL_FIX / DOCUMENTATION_NAVIGATION_ONLYであり、商品出力の改善creditではない。

    PRODUCT_CREDIT = 0
    TECHNICAL_PRODUCT_CREDIT = 0
    DOCUMENTATION_AND_NAVIGATION_CLOSURE = 1
    AUTOMATIC_PROGRESSION = false

CMEE実装、Piece V2 activation、Analysis IF route activation、Cycle001再開をこの資料化から自動で開始しない。

## 2026-09-11 Q3 — 有料履歴・逐次質問・解釈フレーム

Q3の変更ファイルと影響先は[01 EmlisAI current mapの末尾Q3節](01_emlis_ai_current_structure.md)を参照。

Emlisは「今回の入力を読んだ観測→重要な一点の任意質問→本人回答で観測を深める」体験を担当する。回答・続行・フレーム操作は元入力に所属し、国家の入力件数・課金event・通知・Astor queueを増やさない。原入力の保存と既存fanoutは`emotion_submit_service`、履歴の閲覧期限は既存`publish_governance`が所有する。Piece／Analysisの入力許可、TodayQuestionの回答schema、旧I5 public wireを拡張しない。共有CMEE→既存Human Reception作者→Sentence Surface→独立逆検証の順を継承し、外部生成AIや別本文rendererは追加しない。

Q1・Q2・Q3のコード実装を完了として記録し、次はQ4の実装統合、対象集合の初回/質問/回答後本文の確認と修正、旧client/保存版互換、公開用mode・単一生成ownerの接続準備、保存済み訂正を消さない停止・復旧のコードと検証へ進む。古いcandidate91単独修正ループやProduct Read PASS待ちへ戻さない。

実DB適用、端末・実課金の環境確認、Mashの正式商品判断、merge/deploy/公開切替は、API `ai/docs/EMLIS_DEPLOYMENT_AND_OPERATION_CHECKS.md`へ分離した未実施作業。これらが未実施という理由だけでQ3/Q4のコード作業を停止しない。機械成功・華恋の本文確認・Mashの商品合格・公開を相互に代用しない。


## 2026-09-11 Q4 — 現在の接続

Q4の変更file・直接変更しない影響ownerは[01 EmlisAI地図のQ4節](01_emlis_ai_current_structure.md)に集約。bootstrapでreader、server modeでwriterを選び、共有作者へ明示EMLIS_APPLICATIONを渡す。停止は保存済み本文と本人の訂正を保持するread_only。旧I5への単純切戻しを回復としない。原入力保存・国家dispatchと他中核の責務は分離したまま、実装/本文検証を既存PR3/30で継続する。
