---
document_id: COCOLON_SYSTEM_CONTEXT_ULTRA_OPERATOR_NEEDS_AND_CMEE_ACTUAL_USE_GAP_20260821
title: "Cocolon System Context — Ultra Operator Needs / CMEE Actual Use Gap"
created_at: "2026-08-21 JST"
decision_owner: "Mash"
execution_owner: "Ultra華恋"
document_role: "STEP1_ULTRA_OPERATOR_NEEDS_AND_STEP2_ACTUAL_USE_AUDIT"
normative_status: "AUDIT_RESULT_INPUT_FOR_STEP3_NOT_TECHNICAL_DESIGN"
scope_classification: "ROUTINE_SINGLE_OWNER_SCOPE_LEVEL_1"
primary_outcome: "AUDIT_RESULT_CAPTURED__STEP1_STEP2_INPUT_NARROWED"
current_system_context_pr: 31
system_context_head_audited: "bd3b6f9ab846f97edb2178a5623165b1927649d7"
system_context_material_source_audited: "d068856e35086cd301c1eaf46b3e5cc27dc1f88c"
current_cmee_design_pr: 30
cmee_step10_head_audited: "ce2b9beca61c2293ed2828a8caf964392f8eb9f4"
mashos_api_cmee_head_audited: "06ce311b3ea728b06f83439d268a34bed917c01c"
github_effect: "EXACT1_NEW_DOCUMENT_ON_SEPARATE_STACKED_DRAFT_PR"
github_permission_basis: "CURRENT_USER_REQUEST_WITH_GITHUB_PLUGIN__RULE18_LEVEL1_STANDING_DELEGATION"
implementation_effect: 0
test_runtime_effect: 0
product_effect: 0
product_credit: 0
technical_credit: 0
structure_map_delta: "STRUCTURE_MAP_DELTA_NONE"
automatic_progression: false
---

# Cocolon System Context — Ultra Operator Needs / CMEE Actual Use Gap

## 0. 結論

これは、`Cocolon_SystemContext_EnhancementPlan_ProUltraJoint_20260821(5).md`の次の二つだけを実施したUltra華恋の独立監査結果である。

1. **Step 1 — Ultra Operator Needsの独立抽出**
2. **Step 2 — 最近のCMEE既存資産継承を実例にしたSystem Context実使用監査**

結論は次のとおりである。

- 現行System Contextは、全tracked file inventory、symbol／reference／import、RN／API／backend／test route、exact ref／blob、task selection、same-ref／changed-ref prepareを実作業で使える水準まで成立させている。
- 一方、Ultra華恋が設計・実装判断へ入る直前に必要な、**canonical task-owner branchとのfreshness、責任単位のowner／lifecycle／supersession、machine発見とoperator入力のprovenance、必読資料の充足、役割別の短い判断面、protected scope、external／private asset locator**は不足していた。
- 2,016 fileを選択しても、CMEEのactual判断に必要だった資料exact 7は未選択であり、逆に少なくともfont binary exact 1は今回のoperator判断には不要だった。file数の大きさはtask completenessを保証しない。
- PR #31のStep 5はcurrent headで完了済みであり、今回`CURRENT_STEP5_BUG`は確認していない。PR #30のStep 10 owner headを見ないまま全PASSになる問題は、現行Step 5 contract違反ではなく、**canonical task-owner refをtask contextへ持たない`TASK_CONTEXT_GAP`**である。
- Pro華恋の固有needsは本書で代筆していない。shared needsは、Ultra側actual evidenceから双方が同じ事実母集団を必要とする範囲だけを記録した。
- 本書は強化機能のtechnical design、V1 scope決定、実装、test変更、既存generated output更新を行わない。Step 3へは自動進行しない。

`primary_outcome=AUDIT_RESULT_CAPTURED__STEP1_STEP2_INPUT_NARROWED`は、Step 3前に必要だったactual gapと要求入力を根拠付きで限定した意味であり、blocker解消、商品・実装・technical completionのcreditではない。

---

## 1. 作業境界

### 1.1 実施したこと

- Karen-Diaryのcurrent entry、華恋用current rules、mandatory incident、Cocolon System Context current owner、PR #31 actual、CMEE／三大中核構造current map、PR #30 Step 10 exact14、mashos-api CMEE current headをfresh確認した。
- current standard entryをactualに実行した。
- `selected_files.jsonl`、`full_text_read_order.md`、task／workspace profiles、prepare summary、route graph、current owner front matter、PR間commit関係を照合した。
- read-only subtask exact 3へ分け、System Context actual、CMEE use gap、Ultra／subagent coordinationを独立確認した。final判断と本文統合はUltra華恋が行った。
- current user requestのGitHub plugin指定とRule 18 LEVEL 1 standing delegationをpermission basisとし、GitHub反映対象を本書exact 1へ固定した。既存PR #31のterminal sealを変更しないよう、そのheadをbaseにしたseparate stacked Draft PRだけを許可した。

### 1.2 実施していないこと

- Pro華恋のOperator Needsの再作成・代筆。
- enhancement requirements／V1 boundaryの共同確定。
- initial／final technical design。
- source、test、profile、generator、generated current outputの変更。
- product／contract／acceptance／Safety／privacy／public boundaryの変更。
- PR #30／#31のmerge、rebase、ready化、既存sealの変更。

### 1.3 Scope classification

本作業は、既決のStep 1／2をsingle ownerがread-only監査し、結果exact 1だけをdurable化するため、`ROUTINE_SINGLE_OWNER_SCOPE / LEVEL_1`とした。

Step 3以降でSystem Contextの管理方法、機能範囲、metadata modelまたは自動化境界を決める作業は、本書の範囲外であり、計画どおり別の共同判断対象である。

---

## 2. Evidence ledger

| Evidence | Actual identity / fact | この監査での使用 |
|---|---|---|
| E01 | `MassyuRed/Cocolon` Draft PR #31、head `bd3b6f9ab846f97edb2178a5623165b1927649d7`、material source `d068856e35086cd301c1eaf46b3e5cc27dc1f88c` | 現行System Context Steps 1–5のactual |
| E02 | PR #31 standard entry: `STEP5_COCOLON_STANDARD_ENTRY_CONNECTED` / `COCOLON_SYSTEM_CONTEXT_STEPS1_TO_5_COMPLETE` | current Step 5 bugの有無 |
| E03 | 2026-08-21 JST local standard entry `python3 -m tools.cocolon_context prepare --workspace cmee_working --task cmee --external-workspace-root ..`、`SAME_REF_REUSE`、`remote_verified=true`。receipt path `Cocolon_前提資料/system_context/current/cmee_working/prepare_summary.json`、SHA-256 `c8b611e78ec121464c5d0d4f589ddbbf0396fcbdc192d508fec0a393d4f81534` | operatorが現在使う入口のactual実行 |
| E04 | selected `2,016`、closure edge `759,989`、selected source bytes `60,279,123`、full-text read order `6,063,151` bytes | 出力量と読む負荷 |
| E05 | `CURRENT_OWNER 14 / MUST_READ_FULL 53 / RELEVANT_HISTORICAL 36 / REFERENCE_AS_NEEDED 1,913` | role別・段階別outputの不足 |
| E06 | `task_profiles.json` / `workspace_profiles.json` | selection、classification、external review、ref bindingのactual |
| E07 | `selected_files.jsonl`と各資料front matter | lifecycle／owner誤分類、選択理由、不要選択 |
| E08 | `MassyuRed/Cocolon` Draft PR #30、Step 10 head `ce2b9beca61c2293ed2828a8caf964392f8eb9f4`、changed path exact 14 | CMEE canonical owner側の最新actual |
| E09 | PR #31 headとPR #30 headはmerge base `d29042f44e882110514b74dcc6a1b3f31ec746e6`でdiverged。PR #30 head側にStep 10 commit exact 1が固有 | sibling owner freshness gap |
| E10 | CMEE final design／detail suite／current structure／roadmap | design、actual、history、supersessionのmanual復元 |
| E11 | `MassyuRed/mashos-api@06ce311b3ea728b06f83439d268a34bed917c01c`とexternal Cycle001 `MassyuRed/mashos-api@958c1b53f5b5894691e0b10e2d991fb8236d9f6f` | actual source／test／protected boundary |
| E12 | current rulesが`08_cycle001_current_state.md`をcurrent navigation ownerとする一方、task outputは`RELEVANT_HISTORICAL`と分類 | responsibility-level lifecycle gap |
| E13 | body-free locator: `MassyuRed/Karen-Diary@main:knowledge/mash_structural_knowledge/Mash_Human_ActionPrompt_Will_And_Self_Structure_20260817.md`、blob `439d813cf2f5df4fc6c761c107f5b451a2bc2b97`、`cocolon_status=NOT_DIRECT_CANONICAL_SPEC__DISPOSITION_REQUIRED_BEFORE_ADOPTION`、`automatic_cocolon_adoption=false`。本文は本書へ複製していない | private locator／adoption boundary |
| E14 | この監査でUltra華恋がread-only subagent packet exact 3を手作業で作成 | subagent packet負荷のcurrent-session actual |
| E15 | durable evidence上、今回以前のPro／Ultra重複再確認回数は確定できない | duplicate claimの過大化防止 |
| E16 | historical causal fix commit `d068856e35086cd301c1eaf46b3e5cc27dc1f88c`（`fix(system-context): exclude partial-scope unmatched rows`）は`tools/cocolon_context_prepare.py`と`tests/cocolon_context/test_prepare.py` exact 2だけを変更 | causal source／testとgenerated impactの分離 |

### 2.1 `CURRENT_OWNER 14`とStep 10 exact14のset delta

countは両方14だが、集合差は次である。

| Set | Exact path / count |
|---|---|
| Step 10 exact14だけ | `Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md` exact 1 |
| System Context `CURRENT_OWNER 14`だけ | `Cocolon_前提資料/designs/cmee/NLSv3_to_CMEE_Disposition_Phase1_20260817.md` exact 1 |
| 共通 | current structure exact5＋final design parent exact1＋detail suite exact7 = exact13 |

Dispositionはmigration inputとして重要だが`REVIEWED_NONAUTHORITY / design_authority:false`であり、Step 10 write targetではなかった。Emlis long-term roadmapはStep 10側のproduct roadmap ownerだった。この差は、count一致を責任owner一致へ換算できないactual exampleである。

### 2.2 Current output size

現行CMEE task contextのactualは次である。

| Read classification | Files | Source bytes |
|---|---:|---:|
| `CURRENT_OWNER` | 14 | 478,805 |
| `MUST_READ_FULL` | 53 | 1,555,111 |
| `RELEVANT_HISTORICAL` | 36 | 511,105 |
| `REFERENCE_AS_NEEDED` | 1,913 | 57,734,102 |
| **Total** | **2,016** | **60,279,123** |

selection reasonは60,759件あり、一つのfileに最大1,850 reasonが付く。graph closureとしては有用だが、Ultraが「今回変更してよいowner、守るtest、未解決、最初に読むexact surface」を短時間で得るoperator outputとしては過大である。

### 2.3 今回使ったactual task example

一つの実例は`CMEE-ACTUAL-001`である。

- Cycle001 workspaceのNLSv3 visible inverse recovery source exact 1とprotected audit test exact 1を、CMEEの既存資産継承候補として照合した。
- System Contextは、別workspaceのcommit、blob、path、symbolをexactに検証し、CMEE design evidenceと同じfindingへ接続できた。
- actual dispositionは、**source全体を現役CMEE subengineとしてwrap／promoteせず、usableなsymbol-level migration sourceとprotected test vectorだけを保持する**というものだった。
- ただし、external exact2、symbols、conclusion、disposition、required actionは`task_profiles.json.actual_review`へoperatorが先に記述していた。したがって、System Contextが独立にassetの採否を発見したとはclaimしない。成立したのは、operator assertionのexact identity検証と一貫した再出力である。

この実例から、asset discovery件数を増やすことより、`何をmachineが見つけたか / operatorが与えたか / exactにverifyできたか / final judgmentは誰が行ったか`を分離する必要が明確になった。

### 2.4 Protection surfaceのmanual統合example

現行task profileのprotected test exact6と、external Cycle001 actual reviewのprotected audit exact1は別経路にある。

| Repository / ref | Exact protected evidence path | 根拠とwrite boundary |
|---|---|---|
| `MassyuRed/mashos-api@06ce311b3ea728b06f83439d268a34bed917c01c` | `ai/tests/contract/test_emlis_ai_contracts.py` | `task_profiles.json` category `protected_tests`。関連evidenceであり変更許可ではない |
| same | `ai/tests/contract/test_new_national_core_emlis_contracts.py` | same |
| same | `ai/tests/test_emlis_ai_observation_current_display_contract.py` | same |
| same | `ai/tests/test_cmee_v1a_i1sx_contracts.py` | same |
| same | `ai/tests/test_cmee_v1a_i1sx_vertical.py` | same |
| same | `ai/tests/test_cocolon_text_generation_core_boundary.py` | same |
| `MassyuRed/mashos-api@958c1b53f5b5894691e0b10e2d991fb8236d9f6f` | `ai/tests/test_emlis_nls_v3_s11_cycle001_product_recovery_v3.py`、blob `056d7fa3e0d85ccb56d974c97f7fb95b757ebc8f` | `CMEE-ACTUAL-001` protected test vector／review-only external asset。CMEEから変更・呼出し・wrapするauthorityは0 |

---

## 3. `PRO_OPERATOR_NEEDS`

```text
PRO_OPERATOR_NEEDS = NOT_REAUTHORED_BY_ULTRA
```

本書はPro華恋が計画に書いた候補をUltraの正式意見へ変換しない。Pro固有のproduct／intent／説明上のneedsはPro華恋が独立して所有する。

本書の`SHARED_NEEDS`は、Proの主観を代筆したものではなく、同じcanonical factsを共有しなければPro／Ultraの役割分離自体が成立しない、actual technical evidence由来の共通条件だけである。

---

## 4. `ULTRA_OPERATOR_NEEDS`

actorは全row `ULTRA`である。priorityはStep 3へ渡す推薦値であり、V1採用・technical design・implementation authorityではない。

| pain_point_id | actual task example | current manual action / 消費・誤りの危険 | 望むSystem Contextの動作 | 自動化してよい範囲 | 自動化してはいけない範囲 | gap class | priority / evidence |
|---|---|---|---|---|---|---|---|
| UON-01 | PR #31はSELF refでfreshだが、CMEE owner側PR #30 Step 10 exact14を含まず全PASS | sibling PRとmerge base、head固有commit、changed pathsを別途比較する。古いtask premiseをfreshと誤認し得る | workspace refだけでなく、taskごとのcanonical owner refと比較し`STALE_RELATIVE_TO_CANONICAL_OWNER_BRANCH`を表示 | ref、ancestor、changed-path差分、未包含commitの提示 | auto merge／rebase／owner選択／staleの黙認 | `TASK_CONTEXT_GAP` | P0 / E01,E08,E09 |
| UON-02 | `CURRENT_OWNER` exact14のcountは同じでも、System Context setとCMEE Step 10 exact14 setは別物 | path集合と各責任を人手で照合する。count一致をowner一致と誤認し得る | product、current structure、design、actual source、test、navigation、historyを**責任単位**で表示 | metadata抽出、conflict／missing／duplicate表示 | 正本の推測統合、責任の自動移譲 | `PREMISE_MANAGEMENT_GAP` | P0 / E06–E10 |
| UON-03 | `NLSv3_to_CMEE_Disposition...md`はfront matter上`REVIEWED_NONAUTHORITY / design_authority:false`だが`CURRENT_OWNER`選択 | front matterとprofile classificationを人手で突合する。nonauthorityを実装ownerと誤読し得る | lifecycle、publication state、authority、effective condition、supersedes／superseded_byを別fieldで示す | front matter抽出、矛盾可視化、manual overlay provenance | authorityの自動付与、Draftのcurrent化 | `PREMISE_MANAGEMENT_GAP` | P0 / E06,E07 |
| UON-04 | `CMEE-ACTUAL-001`のpath／blob／symbol／結論／dispositionはprofileにoperatorが記入した後、toolがverify／再出力 | machine独立発見かmanual assertionかをprofileとoutputから再構成する。tool発見を過大評価し得る | `MACHINE_DISCOVERED`、`MANUAL_PROFILE_ASSERTION`、`OPERATOR_SUPPLIED_CONCLUSION`、`VERIFIED_EXTERNAL_ASSET`をclaim単位で表示 | path／blob／symbolの機械検証とprovenance保持 | operator conclusionをmachine conclusionへ昇格 | `TASK_CONTEXT_GAP` | P0 / E06 |
| UON-05 | 2,016 file／約60 MBを選択し、font binaryまで入る一方、必読資料exact 7を外した | overview、read order、profile、原本を往復し読む集合を人手で再縮約する。能力が探索と除外に消費される | `DECISION_SURFACE`、`MUST_READ_FULL`、`REFERENCE_ON_TRIGGER`、`EXCLUDED_WITH_REASON`へ段階化し、budget超過を表示 | selection reason圧縮、bytes／理由数budget、trigger付き参照 | 不明影響を`NO_IMPACT`と推測、原本読了の代替 | `TASK_CONTEXT_GAP` | P0 / E04,E05,E07 |
| UON-06 | Piece／Analysis roadmap、mandatory Piece entry／manifest、Emlis current roadmap等exact 7がtreeにあるが未選択 | current mapや設計引用から不足を手作業で発見する。category PASSでもproduct premise欠落が残る | task categoryを「最低source-like件数」でなく、required owner identity／responsibility／entry chainで充足判定 | required identityの存在、selection、freshness、read-order inclusion検証 | required sourceをfilename近似だけで決定 | `TASK_CONTEXT_GAP` | P0 / E06,E07,E10 |
| UON-07 | final designがlocal upload名を引用し、Analysis mapはdurable roadmap未発見と記すが、後続treeにはdurable pathがある | design、current map、tree、Git historyを人手で比較する。stale説明がcurrentへ残る | decision→design section→durable source→actual source／testのdriftを根拠付き表示 | path existence、rename、stale ref、section linkの検出 | 文書の自動修正、Mash判断の補完 | `PREMISE_MANAGEMENT_GAP` | P1 / E08–E10 |
| UON-08 | Step 5 changed-ref proofではsource seed 1から1,826 paths、127 RN calls、206 routesまで広がった | 巨大generated deltaからactual changed rowsとmanual review対象を抽出する。周辺noiseへ設計能力が消費される | direct／probable／unchanged／manual-review impactと、最小readback surfaceを短く提示 | reverse dependency、route／test／document impactの計算 | unknownをno-impact化、protected ownerの変更許可化 | `TASK_CONTEXT_GAP` | P1 / E02–E04 |
| UON-09 | Cocolon内protected test exact6とexternal Cycle001 protected test exact1を別々に確認 | allowed／protected／forbidden／review-onlyを複数ownerから統合する。関連fileを変更可能と誤認し得る | file／symbol／routeごとにowner、usage、changeability、required approval、write targetを示す | protected marker、test contract、workspace write policyの集約 | protected変更の自動承認、関連性からwrite許可を推定 | `ROLE_SPECIFIC_OUTPUT_GAP` | P0 / E10,E11 |
| UON-10 | local plan、Pro review、private Karen-Diary knowledge、別workspace assetがinventory denominator外 | 所在、取得可否、privacy、canonical status、adoption stateを会話／Library／private repoから再構成 | body-free external asset registryとしてlocator、availability、privacy、canonicality、expected hash／ref、adoption stateを表示 | identityと取得状態の管理、missing／changed表示 | private bodyのpublic copy、未採用knowledgeの自動採用 | `EXTERNAL_ASSET_GAP` | P1 / E11,E13 |
| UON-11 | historical Step 5 failureはsource/test exact2の因果修正に対しgenerated deltaが大きかった | test／log toolが確定した最初の因果failureと、System Context owner／impactを人手で再接続 | 既に生成されたcausal result、stage、invariant、minimal source／test、noise、not-runをowner／impact面へcompactに相関表示 | produced result／log locator／changed-path／ownerのread-only相関 | log取得、因果failureの確定、test実行、自動fix、retry | `FUTURE_HOLD` | P1 / E16 |
| UON-12 | material source→generated candidate→remote workflow→final carrier headをPR bodyから再構成 | session再開ごとにhead、tree、workflow、material source、external refsを再確認 | short restart packetとしてcurrent head、material source、workflow、external refs、dirty／stale reasonを一面化 | GitHub read-only verificationとidentity chain表示 | GitHub mutation、workflow rerun、completion claimの自動化 | `ROLE_SPECIFIC_OUTPUT_GAP` | P1 / E01–E03 |
| UON-13 | この監査でread-only subagent exact3へpurpose、対象、禁止範囲、返却形式を手作業で分割 | packet準備とcoverage統合へ能力を使う。重複・欠落・scope逸脱の危険がある | purpose、questions、exact refs、files／symbols、selection reason、prohibited inference／write、expected output、coverage overlap、handbackを生成 | read-only packet案とcoverage map | subagent生成・model選択・実行・final採否 | `SUBAGENT_COORDINATION_GAP` | P1 / E14 |

### 4.1 Ultra側の最小判断

Ultra側で最優先なのは「検索対象をさらに増やすこと」ではない。

```text
fresh canonical task-owner ref
+ responsibility / lifecycle / authority
+ machine/manual claim provenance
+ required premise completeness
+ bounded Ultra decision surface
+ protected / allowed / forbidden scope
```

を、現行inventory／graphの上へ一貫して載せることである。

これはStep 3の採用決定やdata model設計ではなく、Step 1で得たactual requirement inputである。

### 4.2 `SUBAGENT_COORDINATION_NEEDS`

このsectionはcurrent監査でUltra華恋が実際に作成したread-only packet exact3を記録する。System Contextがpacketを生成した実績ではなく、**System Contextにpacket outputがないためUltraが手作業で作った実績**である。

| packet_id | purpose / primary exact input | prohibited inference / effect | expected handback | current coverage result |
|---|---|---|---|---|
| SCP-01 | 現行System Contextのoutput size、selection、classification、prepare actualを監査。`MassyuRed/Cocolon@bd3b6f9ab846f97edb2178a5623165b1927649d7`の`workspace_profiles.json`、`task_profiles.json`、`selected_files.jsonl`、`prepare_summary.json` | CMEE product判断、source／test変更、GitHub write 0 | verified counts、過大selection、owner／lifecycle／provenance gap | exact countsとfont exact1を返却。CMEE dispositionは扱わない |
| SCP-02 | 最近のCMEE継承actualを監査。`MassyuRed/Cocolon@ce2b9beca61c2293ed2828a8caf964392f8eb9f4`のStep 10 exact14、current structure、final design、Piece／Analysis／Emlis source chain | Pro固有needの代筆、implementation、write 0 | selected／missed asset、manual lifecycle／drift、duplicate evidence有無 | missing exact7、set delta、driftを返却。System Context内部実装は扱わない |
| SCP-03 | Ultra／subagent operator needを独立抽出。PR #31／#30 exact refs、Rule 18、current task profiles | Pro結論への従属、authority生成、Step 3設計、write 0 | Ultra needs、automation boundary、subagent packet fields、not-scope | canonical ref、scope、restart、packet needを返却。final採否はUltraへhandback |

coverage overlapはPR #30／#31 identityとexact14 setを相互検証するためのdeliberate read overlapだった。duplicate execution／writeは0である。今回以前のsubagent overlap／omission incident、またはexact3 packetによる定量削減はdurable evidenceがないためclaimしない。

---

## 5. `SHARED_NEEDS`

| shared_need_id | actual task example | 共通して必要な状態 | System Context境界 | evidence |
|---|---|---|---|---|
| SHN-01 | Pro／Ultraが同じCMEEを見てもPR #30／#31の基準refが違えば結論がずれる | 同一manifestへbindされたcanonical task-owner refs | 判断はrole別でも、事実母集団を分けない | E01,E08,E09 |
| SHN-02 | `CURRENT_OWNER`という一語ではDraft、nonauthority、navigation、actual ownerを区別できない | responsibility、lifecycle、authority、publication、supersessionの共通語彙 | owner conflictを黙って統合しない | E06,E07,E12 |
| SHN-03 | 2,016 selected-file order（`CURRENT_OWNER` 14、`MUST_READ_FULL` 53、historical 36、trigger参照1,913）は、そのままでは重い | role別outputの前に共通の短いdecision surfaceとselection explanation | 原本を不要にせず、必要理由から辿れる | E04,E05 |
| SHN-04 | `CMEE-ACTUAL-001`のようにmanual conclusionとmachine verificationが混在 | claimごとのprovenanceとverified範囲 | machine factとhuman judgmentを混ぜない | E06 |
| SHN-05 | local／private／other-workspace資料がtaskの成立に必要 | body-free locator、availability、privacy、canonical／adoption state | private本文はpublic graphへ複製しない | E11,E13 |

---

## 6. `NOT_SYSTEM_CONTEXT_SCOPE`

| scope_id | System Contextへ移さないこと | actual task example / evidence | 理由 / boundary |
|---|---|---|---|
| NSC-01 | Mashのnormative decision、product purpose、method family、contract、acceptanceの決定 | Step 10 final design／Rule 18はMashをdecision ownerとし、`current authorized next implementation=NONE`を保持 | fact retrievalは支援できるがdecision ownerを代替しない |
| NSC-02 | Pro／Ultraのfinal judgment、actual asset disposition、採用／非採用 | `CMEE-ACTUAL-001`ではexternal exact2をverifyした後も、symbol-level継承／wrapper非継承のtechnical judgmentが別に必要だった（E06,E11） | System Contextはevidenceを揃え、判断主体にはならない |
| NSC-03 | human Product Readと本文理解 | `Cocolon_前提資料/current_structure/04_cmee_current_structure.md`はmachine greenとprivate human Product Read `EVALUATED_FAIL_STOP`を分離 | file selectionや要約は、本文を読んだ商品品質判断の代替にならない |
| NSC-04 | 原本本文の第二正本化 | current taskはCocolon design、`mashos-api` source／test、private Karen-Diary bodyを各ownerから読んだ（E10,E11,E13） | 前提資料、design、source、test、private knowledgeは元ownerに残す |
| NSC-05 | subagentの生成、model選択、実行制御、最終統合 | current監査のSCP-01〜03はUltraが手作業で起動・統合し、全packet write 0 | packet生成は支援範囲だがorchestratorにはしない |
| NSC-06 | CI／test runner／log system／GitHub writeの再実装 | current standard entryはPython tool、remote identity確認はGitHub、historical causal fixはsource／test toolchainで成立（E01,E03,E16） | identity／結果参照はできるが、実行・retry・mutationは各toolの責任 |
| NSC-07 | owner conflictの自動解消、auto merge／rebase、自動文書修正 | PR #31とPR #30はmerge base `d29042f44e882110514b74dcc6a1b3f31ec746e6`でdivergedし、本監査は比較だけを行った（E09） | visibilityは支援するがauthorityとrepository historyを変更しない |
| NSC-08 | private bodyのpublic copy、未採用Karen-Diary knowledgeの自動採用 | E13のprivate recordはbody-free locatorと`automatic_cocolon_adoption=false`だけを記録 | locatorとadoption stateだけを扱い、privacy／disposition ownerを守る |

---

## 7. `ACTUAL_USE_GAP_MATRIX`

### 7.1 System Contextだけで成立したこと

| gap_id | 観測 | actual evidence | 分類 | 判断 |
|---|---|---|---|---|
| AUG-01 | 全3,709 tracked fileとblob identityをinventory化し、code-capable surfaceのsymbol／reference／import、および検出されたRN／API／backend／test routeへ到達できた | E01–E04 | `NOT_A_TOOL_PROBLEM` | 現行能力として保持。全fileにsymbol／route coverageがあるとはclaimしない |
| AUG-02 | CMEE関連design、Emlis source／test、shared core surface、external Cycle001 asset identityを同一task outputへ集めた | E03,E06,E11 | `NOT_A_TOOL_PROBLEM` | asset reachabilityとidentity verificationは有効 |
| AUG-03 | `CMEE-ACTUAL-001`の外部path／blob／symbolをverifyし、unincorporated findingとして再出力した | E06 | `TASK_CONTEXT_GAP` | verificationは有効。ただし結論自体はmanual profile assertionであり、独立machine discoveryではない |
| AUG-04 | same-ref reuse、remote verification、fresh source identityをstandard entryから確認できた | E01–E03 | `NOT_A_TOOL_PROBLEM` | current Step 5 bugなし |

### 7.2 Manual readで追加発見したこと

| gap_id | manual discovery | System Contextが足りなかった点 | 分類 | 根拠 |
|---|---|---|---|---|
| AUG-05 | PR #30 Step 10 head `ce2b9beca61c2293ed2828a8caf964392f8eb9f4`のexact14 | `SELF`＋expected ancestorだけではcanonical sibling ownerのlatestを要求しない | `TASK_CONTEXT_GAP` | E08,E09 |
| AUG-06 | System Contextの`CURRENT_OWNER 14`とStep 10 exact14はcountだけ同じ別集合 | owner responsibility／expected exact setがない | `PREMISE_MANAGEMENT_GAP` | E06,E08 |
| AUG-07 | Piece roadmap／image export design、Analysis roadmap／simulation design、Piece mandatory entry／manifest、Emlis current roadmap exact7 | category PASSがrequired document identity／entry chainを保証しない | `TASK_CONTEXT_GAP` | E06,E07,E10 |
| AUG-08 | Dispositionは`REVIEWED_NONAUTHORITY`、structure mapはmergeまでDraft、`08`はcurrent navigation owner | path-glob classificationがfront matter responsibility／effective conditionを表さない | `PREMISE_MANAGEMENT_GAP` | E07,E12 |
| AUG-09 | final design §24にlocal upload名が残り、Analysis mapに「durable同名owner未発見」が残る | design↔durable actualのdriftを出さない | `PREMISE_MANAGEMENT_GAP` | E08–E10 |
| AUG-10 | historical lifecycle最大一回のRoute B clarificationとplan別Free／Plus `0..1`、Premium `0..3`をsection単位で区別 | decision／supersession lineageをfile単位selectionだけでは復元できない | `PREMISE_MANAGEMENT_GAP` | E10 |
| AUG-11 | material source、generated candidate、workflow、final carrier headの関係 | restart／remote lifecycle summaryがtask outputにない | `ROLE_SPECIFIC_OUTPUT_GAP` | E01–E03 |
| AUG-12 | internal protected exact6とexternal Cycle001 protected exact1の統合境界 | related testとallowed-to-changeを分けるUltra viewがない | `ROLE_SPECIFIC_OUTPUT_GAP` | E10,E11 |

### 7.3 Selectedされたが今回のoperator判断に不要だったfile

| gap_id | file | selection actual | 分類 | 判断 |
|---|---|---|---|---|
| AUG-13 | `assets/fonts/SpaceMono-Regular.ttf`（repository: `Cocolon`） | 93,252 bytes、`ASSET`、graph distance 3、closure referenceだけで`REFERENCE_AS_NEEDED` | `TASK_CONTEXT_GAP` | graphから削除すべきとは決めない。初期operator packetから外し、trigger時だけ参照する候補 |

`REFERENCE_AS_NEEDED` 1,913件すべてを不要とは判定していない。actualに不要と確定できた具体例exact 1だけを記録した。

### 7.4 Selectedされなかったが今回必要だったfile

次のexact 7はaudited treeに存在したが、CMEE `selected_files.jsonl`にはなかった。

| gap_id | required path | actual need | necessity evidence at audited refs | 分類 |
|---|---|---|---|---|
| AUG-14 | `Cocolon_Piece/roadmap/Cocolon_Piece_ProFirst_ChatWork_Roadmap_20260807_CleanCutover_Revised.md` | Piece product／current-future premise | CMEE final design §24のPiece roadmap sourceと、Analysis roadmapのcross-core source ledgerからactual Piece境界確認に使用 | `TASK_CONTEXT_GAP` |
| AUG-15 | `Cocolon_Piece/design_sources/Cocolon_Piece_Card_Image_Export_Redesign_DesignNote_20260707.md` | Piece existing technical assetの実体確認 | AUG-14 roadmapのdesign-source ledgerがimage export redesignを既存Piece technical inputとして参照 | `TASK_CONTEXT_GAP` |
| AUG-16 | `Cocolon_Analysis/roadmap/Cocolon_Analysis_ProFirst_CurrentActual_ProductQualityClosure_Roadmap_20260807.md` | Analysis product／current actual premise | CMEE final design §24のAnalysis roadmap source。`current_structure/03_analysis_current_structure.md`の「durable同名owner未発見」がstaleかをactual確認 | `TASK_CONTEXT_GAP` |
| AUG-17 | `Cocolon_Analysis/simulation/Cocolon_WatashiSimulation_RouteBranch_DesignNote_20260708.md` | Analysis route／future boundary確認 | AUG-16 roadmapのsource ledgerがWatashiSimulation route branch designを参照し、current／future分離の原本確認に使用 | `TASK_CONTEXT_GAP` |
| AUG-18 | `Cocolon_Piece/00_read_first.md` | Piece mandatory navigation | `current_structure/02_piece_current_structure.md` responsibility tableが`CURRENT_PRODUCT_OWNER`、CMEE final designもread sourceとして指定 | `TASK_CONTEXT_GAP` |
| AUG-19 | `Cocolon_Piece/manifest.json` | Piece mandatory owner／read entry | `current_structure/02_piece_current_structure.md` responsibility tableがPiece machine routingの`CURRENT_PRODUCT_OWNER`と指定 | `TASK_CONTEXT_GAP` |
| AUG-20 | `Cocolon_前提資料/Cocolon_EmlisAI_longterm_roadmap_CURRENT.md` | Step 10 exact14のproduct roadmap owner | `current_structure/01_emlis_ai_current_structure.md`がstable product destinationの`CURRENT_PRODUCT_OWNER`と指定し、Step 10 setだけに含まれる | `TASK_CONTEXT_GAP` |

### 7.5 Pro／Ultra重複再確認

| gap_id | 観測 | 分類 | 判断 |
|---|---|---|---|
| AUG-21 | 今回以前にPro／Ultraが同じstable identityを何回重複reviewしたかを示すdurable evidenceは確認できない | `NOT_A_TOOL_PROBLEM` | `PRO_ULTRA_DUPLICATE_RECHECK = NOT_ESTABLISHED_FROM_DURABLE_EVIDENCE`。削減効果を捏造・推定しない |
| AUG-22 | CMEE Step 10 exact14はPro reviewをexactly once消費し、second review不要と記録 | `NOT_A_TOOL_PROBLEM` | 既存non-duplication contractとして保持。System Context強化の効果として二重計上しない |

### 7.6 Subagent packet作成

| gap_id | 観測 | 手作業 | 分類 | 判断 |
|---|---|---|---|---|
| AUG-23 | current監査でSystem Context audit、CMEE use gap、Ultra coordinationのread-only packet exact3を使用 | purpose、refs、対象、禁止範囲、返却形、coverage境界をUltraが作成し、最終統合も手作業 | `SUBAGENT_COORDINATION_GAP` | current-session actual。過去の重複incidentや定量削減を遡及主張しない |

### 7.7 External／private asset

| gap_id | asset | 現行denominator外の状態 | 分類 | 必要な境界 |
|---|---|---|---|---|
| AUG-24 | operator supplied enhancement plan | local／Library由来、PR #31 inventory外 | `EXTERNAL_ASSET_GAP` | body-free locator、availability、canonical status |
| AUG-25 | CMEE Pro review／integrated proposal original bytes | Step 10 designにidentity／SHAはあるが、task contextにretrieval ownerがない | `EXTERNAL_ASSET_GAP` | identityとretrieval state。本文の複製不要 |
| AUG-26 | E13のprivate Karen-Diary body-free locator | workspace profilesのCocolon／mashos-api denominator外。CMEE relationship=`structural knowledge candidate / not direct canonical spec`、availability=`private locator verified`、adoption owner=`Mash`、automatic adoption=`false` | `EXTERNAL_ASSET_GAP` | privacy、availability、adoption state。public body copy禁止 |

### 7.8 Current Step 5 bug / future hold

| gap_id | 観測 | 分類 | 判断 |
|---|---|---|---|
| AUG-27 | current headでStep 5 standard entry、same-ref、remote verification、terminal claimが成立 | `NOT_A_TOOL_PROBLEM` | `CURRENT_STEP5_BUG = 0` |
| AUG-28 | canonical sibling owner freshnessはcurrent Step 5 contractに未定義 | `TASK_CONTEXT_GAP` | historical Step 5 bugへ誤分類しない。enhancement input |
| AUG-29 | log取得、test実行、first causal failureの確定 | `NOT_A_TOOL_PROBLEM` | CI／test／log toolingの責任であり、System Context機能候補にしない |
| AUG-30 | 既に生成されたcausal result／log locator／changed pathsとSystem Context owner／impactのcompact相関表示 | `FUTURE_HOLD` | current bug修正ではない。Step 3以降でread-only integrationの必要性だけを判断 |
| AUG-31 | subagent orchestration、CI execution、GitHub mutationのSystem Context内実装 | `NOT_A_TOOL_PROBLEM` | `NOT_SYSTEM_CONTEXT_SCOPE`を維持する。System Contextは実行主体にならない |

---

## 8. Step 3へ渡す未採用input

以下はStep 1／2から得たpriority recommendationであり、requirements確定、V1 scope、data modelまたはtechnical designではない。

### P0 input

1. canonical task-owner branch／refに対するfreshness。
2. responsibility-level owner／lifecycle／authority／supersession。
3. machine／manual／operator conclusion／external verificationのclaim provenance。
4. required premise identityとmandatory entry chainによるcompleteness。
5. bytes／reason／stageを持つbounded selectionとUltra decision surface。
6. allowed／protected／forbidden／review-only scopeの統合表示。
7. 同じmanifestへbindされたrole-specific output。

### P1 input

1. design→actual→test→decision drift。
2. compact change impactとminimal readback surface。
3. external／private assetのbody-free locator。
4. short restart／remote lifecycle packet。
5. Ultra subagent read-only packetとcoverage map。
6. causal failureとnoiseのcompact diagnostic。

### `NOT_SYSTEM_CONTEXT_SCOPE` / `STEP3_DECISION_PENDING`

- 原本本文の移行・複製。
- owner／authority／Mash判断の自動決定。
- auto merge／rebase／fix／retry／write。
- subagent orchestration system化。
- private bodyのpublic化。

---

## 9. Completion / STOP

```text
STEP1_ULTRA_OPERATOR_NEEDS_COMPLETE
STEP2_CMEE_ACTUAL_USE_AUDIT_COMPLETE

PRO_OPERATOR_NEEDS_REAUTHORED = 0
SHARED_NEEDS_ULTRA_EVIDENCE_BOUND = 1
ACTUAL_USE_GAP_MATRIX_COMPLETE = 1
CURRENT_STEP5_BUG = 0

ENHANCEMENT_REQUIREMENTS_CONFIRMED = 0
V1_SCOPE_CONFIRMED = 0
INITIAL_TECHNICAL_DESIGN = 0
IMPLEMENTATION = 0
TEST_RUNTIME_EFFECT = 0
PRODUCT_EFFECT = 0
PRODUCT_CREDIT = 0
TECHNICAL_CREDIT = 0
STRUCTURE_MAP_DELTA_NONE

AUTOMATIC_PROGRESSION = false
STOP_BEFORE_STEP3
```
