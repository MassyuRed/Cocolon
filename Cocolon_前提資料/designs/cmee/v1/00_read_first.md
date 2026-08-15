# CMEE V1 詳細設計 — Read First

- document id: `cocolon.cmee.v1.detailed_design.read_first`
- revision date: `2026-08-15 JST`
- decision owner: `Mash`
- technical design owner: `Ultra華恋`
- architecture parent: [Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md](../Cocolon_MeaningExperienceEngine_V1_FinalTechnicalDesign_ProReviewApplied_20260815.md)
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- effective when: `MERGED_TO_COCOLON_MAIN_AS_DESIGN_OWNER`
- implementation approval: `NOT_GRANTED_BY_THIS_SUITE`
- dependency / production / test / runner / API / DB / RN effect: `0`
- Cycle001 restart effect: `0`
- L3-R route selection: `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`
- L3-R packet state: `L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP`
- automatic progression: `false`

---

## 0. このsuiteの役割

このdirectoryは、CMEEの上位技術設計を、実装者がsource、contract、module、failure、test、cutoverの順に追える詳細設計へ落とした正本候補である。

起点は旧G0–G10の補助経路ではなく、次の商品job exact3とする。

1. EmlisAI: 入力を「読まれた形」の観測へ変え、必要な場合だけ一点を問い、回答分だけ観測を深める。
2. Piece: 保存済み入力の意味を、本人の表現として他者へ共有できるcanonical textと画像artifactへ変える。
3. 分析構造: 期間sourceから現在の自己構造routeを根拠付きで形にし、観測と分離したIF routeを扱う。

CMEEは三商品へ共通する意味保持・artifact生成のtechnical coreである。独立したuser-facing商品、第四の商品中核、共通voice、万能text generatorではない。

## 1. 読む順 exact7

1. 本file
2. [01_shared_kernel_and_runtime_contracts.md](01_shared_kernel_and_runtime_contracts.md)
3. [05_json_schema_and_versioning.md](05_json_schema_and_versioning.md)
4. 実装対象coreの詳細設計
   - [02_emlis_v1a_detailed_design.md](02_emlis_v1a_detailed_design.md)
   - [03_piece_v1c_detailed_design.md](03_piece_v1c_detailed_design.md)
   - [04_analysis_v1d_v1e_detailed_design.md](04_analysis_v1d_v1e_detailed_design.md)
5. [06_implementation_order_migration_and_verification.md](06_implementation_order_migration_and_verification.md)
6. `../../../current_structure/04_cmee_current_structure.md`
7. 対象coreのcurrent structure mapとactual source / contract / test

このsuiteだけでcurrent実装状態を決めない。current structure mapを地図、GitHubのactual source / testを現物として両方確認する。

## 2. 文書別authority

| File | Owns | Does not own |
|---|---|---|
| `00_read_first.md` | 読み順、lifecycle、suite全体の非影響 | runtime contract詳細 |
| `01_shared_kernel_and_runtime_contracts.md` | shared logical architecture、ports、pipeline、failure | core固有商品判断 |
| `02_emlis_v1a_detailed_design.md` | Emlis observation vertical、question lifecycle、Cycle境界 | Piece / Analysis activation |
| `03_piece_v1c_detailed_design.md` | share artifact、visual spec、identity、clean cutover | renderer implementation / DB activation |
| `04_analysis_v1d_v1e_detailed_design.md` | observed route、IF graph、projection、identity | current Watashi Mapの無承認置換 |
| `05_json_schema_and_versioning.md` | canonical draft schemas、identity、versioning | production schema registration |
| `06_implementation_order_migration_and_verification.md` | work packet順、entry / exit / STOP、migration | 実装開始authority |

## 3. Fixed architecture decisions

1. outer hostは`ai/services/ai_inference/cocolon_meaning_experience_engine/`をexact1推奨とする。
2. current `cocolon_text_generation_core`はdownstream guard subsystemとして保持し、CMEE全体へ昇格しない。
3. first implementationはEmlis sourceからactual observation candidateまでのvertical sliceであり、空package / schema-only / adapter-onlyを完成扱いしない。
4. active generation ownerはcoreごとにexact1とし、cutover時のparallel active owner、fallback、mirror routeは0とする。
5. shared APIの詳細fieldはEmlisだけでfinal freezeせず、第2 actual coreで共通昇格を判定する。
6. Piece / Analysisのdesign contractは先に固定してよいが、runtime moduleは各phaseの別承認まで作らない。
7. machine PASS、human Product Read、actual-device PASS、runtime readiness、Cycle acceptanceを相互変換しない。
8. user source、provisional meaning、hypothesis、simulation、saved intentを型で分離する。
9. original sourceをuser correctionやsupplemental answerでretroactive mutationしない。
10. API / DB / RLS / RN / public routeはcore lifecycle ownerに残し、CMEE packageの初期実装で変更しない。

## 4. Japanese linguistic provider recommendation state

officialに確認できた日本語parser / PAS候補は、morphology、dependency、predicate / argument proposalを返せても、current contractが要求する次を保証しない。

```text
complete candidate set
zero / omitted argumentを含むformal open-slot denominator
required / active owner全件のunique governing attachment
statistical one-bestをuser meaning authorityへできる根拠
```

したがって、GiNZA、spaCy Japanese、KWJA等を`FORMAL_CLOSED` authorityとして選定済みにしない。設計上は`PROVISIONAL_ONLY` candidate producer候補である。

current Phase 0 terminalは次とする。

```text
NO_SAFE_CMEE_V1A_CANDIDATE_STOP
```

route候補は次のexact2であり、2026-08-15 JSTのMash LEVEL_3判断でRoute Bを選択した。

1. `ROUTE_A_FORMAL_CLOSED_ATTACHMENT_AUTHORITY`: current formal closureを満たす別authorityを提示する。
2. `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION`: provisional analysisをlimited observation / user clarification / unavailableへ明示的にbindするよう受入契約を変更する。

Mashはroute directionに加えて、`CMEE_V1_L3R_ROUTE_B_BOUNDED_PREFLIGHT_TECHNICAL_BODY` v1.0.0（canonical SHA-256 `4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901`）を承認した。provider / resolver責任、Route B cross-field semantics、KWJA exact1候補、temp path、categorical ceiling、network / storage / secret effect、failure / ambiguity / OOV、privacy、retry、post-preflight境界は同bodyへ固定され、L3-R exitは成立した。P0 exact1はdocs reflectionのfresh verification後にactivateされ、`P0_ACTIVATION_PRECONDITION_STOP`でterminalとなった。

approval orderは`L3-R route + bounded preflight authorization -> P0 measured evidence -> L3-I dependency/resource/I1 exact allowlist -> I1`である。いずれのrouteでもwheel / model / transitive lock、resource identity、license、installed size、max RSS、latency、CPython / OS / architecture、runtime network 0をP0 evidence後のL3-Iでfresh固定する。one-best arc、model score、Product Read、first / last / nearest heuristicはambiguityを消すauthorityにならない。

## 5. Runtime entrypoint target

outer public entryはexact1とする。

```python
MeaningExperienceEngine.generate(
    request: GenerationRequest,
) -> EngineOutcome
```

requestは`core_id + product_job`のdiscriminated unionである。V1-Aでadmitするのは`EMLIS_AI / OBSERVE_AND_CLARIFY`のObservation sliceだけである。Piece / Analysis callable、dynamic provider registry、empty handlerをproduction packageへ先行作成しない。

canonical internal / schema enum:

```text
core_id:
  EMLIS_AI | PIECE | ANALYSIS

product_job:
  OBSERVE_AND_CLARIFY | EXPRESS_AND_SHARE | MAP_AND_EXPLORE
```

V1-Aのactual admitted sub-jobは`OBSERVE_AND_CLARIFY`内のObservation sliceである。Piece formatのcanonical wire valueはexisting V2 contractへ合わせて`short_essay | quote | declaration`とし、uppercase Python enumを使う場合はserializerでexact mappingを一つだけ持つ。

## 6. State axes

current orthogonal state:

```text
document_lifecycle = DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE
route_selection = ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
l3r_state = L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP
provider_admission = NO_SAFE_CMEE_V1A_CANDIDATE_STOP
runtime_state = NOT_IMPLEMENTED
production_state = NOT_CONNECTED
cycle_state = NOT_REOPENED
next_decision = REMAIN_STOPPED_OR_NEW_MASH_LEVEL3_COMPLIANT_EXECUTOR_BODY
automatic_progression = false
```

future target states:

```text
CMEE_V1A_EMLIS_OBSERVATION_CANDIDATE_READY_DISABLED_NOT_ADMITTED
CMEE_V1A_CYCLE001_PROVEN
CMEE_V1A_EMLIS_OBSERVATION_PRODUCTION_OPERATIONAL
CMEE_V1B_EMLIS_QUESTION_OPERATIONAL
CMEE_V1C_PIECE_VISUAL_OPERATIONAL
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
CMEE_V1_THREE_CORE_OPERATIONAL
```

target listはautomatic transitionではない。design merge、preflight、dependency / implementation、Cycle再入場、production、Piece / Analysis activationはそれぞれ別判断である。

## 6.1 Parent contract refinement

本suiteの`05_json_schema_and_versioning.md`は、parent §6.6のstatus shapeを次の二層へ詳細化する。

- `GenerationArtifactBundle`: visible artifactが存在する`GENERATED | LIMITED`だけ。
- `EngineOutcome`: `GENERATED | QUESTION_PENDING | LIMITED | REJECTED | UNAVAILABLE | SEPARATE_SAFETY` exact6。`QUESTION_PENDING`はtyped clarificationと、core policyに応じたoptional artifact bundleを持てる。
- non-generated resultをempty `GenerationArtifactBundle`で表現しない。
- parent / Piece entryの`new Piece safe-disable`は、V1-C初回cutover前に別承認・pre-admitするsingle-owner `PIECE_V2_SAFE_UNAVAILABLE_ROLLBACK_TARGET`へ具体化する。generic feature flag、dual-run、旧Q&A restorationではない。

このrefinementはparentのproduct intentを変えず、同名typeの曖昧さを解消する。詳細suiteがdesign ownerとしてadoptされる場合、このstatus fieldに限り05をimplementation schema authorityとする。

## 7. Product-causal admission — human checklist only

新module、field、dependency、test、signalは、PR説明内で次を説明できる場合だけadmitする。

1. actual consumer core
2. product job
3. quality criterion ID
4. observed gap
5. user-visible artifactへ効く因果
6. 次のactual run / Product Read / device proof
7. stop / retire condition

この確認専用のchecker、schema、Gate、Receipt、dashboard、authority chainを作らない。

## 8. Privacy and evidence boundary

- runtime source body、generated body、user correction、Product Read本文はprivate body-fullである。
- public GitHubとbody-free telemetryへraw input / output、identifiable paraphrase、case ID、private locator、keyを出さない。
- source body hash、source commitment digest、visible text hashはprivateであり外へ出さない。承認済みのnon-user-correlating provider / schema / artifact identity hash、anonymous count、reason code、body-free contract resultだけをpolicy範囲で外へ出せる。
- internal `body_locator_private`はpublic serialization対象外である。
- CMEEは新しいpublic telemetry DB、log service、dashboardを作らない。

## 9. Completion and STOP

本suiteの完成は、Markdown exact7がGitHubへ存在するだけではない。次を満たす必要がある。

- exact7相互linkが解決する。
- shared / Emlis / Piece / Analysisのauthority重複がない。
- schema draftと文章contractが一致する。
- implementation順にentry / exit / STOPがある。
- current CMEE structure mapが同じwrite unitで同期する。
- remote bytesとchanged pathsをpostverifyする。

本suiteのprimary outcomeは`BLOCKER_NARROWED`である。Route B selectionとbounded preflight technical body v1.0.0の承認によりL3-Rは成立した。P0 exact1はactivation preconditionでterminalとなり、current stateは`L3R_ROUTE_B_APPROVED_P0_TERMINAL_ACTIVATION_PRECONDITION_STOP`である。これはproduct / implementation creditではなく、商品出力、Product Read、runtime readiness、Cycle creditは増えない。

## 10. Approved L3-R identity and activation boundary

Canonical body:

[CMEE V1 L3-R Route B Bounded Preflight Technical Body v1](../CMEE_V1_L3R_RouteB_BoundedPreflight_TechnicalBody_20260815.md)

```text
approval_token = CMEE_V1_L3R_ROUTE_B_TECHNICAL_BODY_V1_APPROVED
body_version = 1.0.0
body_canonical_sha256 = 4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901
P0 = CONSUMED_EXACT1_P0_ACTIVATION_PRECONDITION_STOP
implementation_approval = 0
automatic_progression = false
```

P0はcanonical bodyのactivation Gateでterminalとなった。dependency、requirements、lock、source、test、runner writeは0で、separate L3-Iは未承認のままである。

## 11. P0 body-free terminal

[CMEE V1 P0 KWJA 2.5.1 Base Body-Free Result](../CMEE_V1_P0_KWJA251_Base_BodyFree_Result_20260815.json)

```text
terminal = P0_ACTIVATION_PRECONDITION_STOP
authority = CONSUMED_TERMINAL
platform_tuple = NOT_RECORDED_BY_P0
temp_root_created = 0
network / acquisition / install / load / inference = 0
Route B disposition / sufficiency = NOT_EVALUATED_IN_P0
L3-I / implementation / Cycle001 = NOT_AUTHORIZED
automatic_progression = false
```

このterminalはKWJA capability、license/provenance、resource cost、Route B product sufficiencyのFAILではない。current executorのactivation precondition不成立で後段を未実行のまま閉じた結果である。
