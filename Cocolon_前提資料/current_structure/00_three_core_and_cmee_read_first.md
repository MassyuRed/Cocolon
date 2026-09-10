---
doc_id: cocolon_three_core_and_cmee_current_structure_entry
title: "三大中核構造とCMEE — Current Structure Read First"
revision_date: "2026-08-15 JST"
document_role: "CURRENT_STRUCTURE_ROUTING_OWNER"
effective_when: "MERGED_TO_COCOLON_MAIN"
publication_state: "DRAFT_PR_CANDIDATE_UNTIL_MERGED"
decision_owner: "Mash"
operational_owner: "Karen"
implementation_effect: 0
automatic_progression: false
---

# 三大中核構造とCMEE — Current Structure Read First

> 2026-09-10 Q1更新：Mashの添付「CMEE Question System Technical Design」v1.1とQ1実装指示により、現在の開発順は **Q1（Free相当の純粋処理・実本文一往復）→Q2（保存・API・RN）→Q3（有料の履歴・後続round）→Q4（商品確認・公開判断）** です。単独応答100件またはRound 0のProduct Read PASSをQ1開始条件にしません。過去のNON_PASS・未解決品質・公開条件は保持します。Q1はdisabled実装・検証中で、Q2以降／商品PASS／公開は未成立です。現在の再開先はAPI既存handoffと本設計のQ1追補です。

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
| EmlisAI構造 | [01_emlis_ai_current_structure.md](01_emlis_ai_current_structure.md) | 入力を「読まれた形」の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める | production観測／受け取りはCURRENT_ACTUAL。問い／refined observationはDESIGNED_NOT_IMPLEMENTED |
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
