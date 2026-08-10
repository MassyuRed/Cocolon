# NLSv3 Step11 Cycle001 G3 — post-G6 shared structural correction failure localization and remediation design V1

- Date: 2026-08-10
- Decision owner: Mash
- Operation owner: Karen
- Authority: `NLS_V3_STEP11_CYCLE001_G3_RETURN_AFTER_G6_REJECT_SHARED_STRUCTURAL_CORRECTION_FAILURE_LOCALIZATION_AND_REMEDIATION_DESIGN_READ_ONLY_V1`
- Scope: G6 REJECT後の新しいG3 failure localization / remediation design read-only exact1
- State: `G3_POST_G6_SHARED_STRUCTURAL_CORRECTION_REMEDIATION_CONTRACT_FROZEN_READ_ONLY`
- Automatic progression: false
- Body-free / public-safe: true / true

## 1. Entry、drift、evidence availability

activation前のfresh確認は成立した。

```text
Cocolon main / tree:
de75848b0579dd91c365de0e4763ab5834cd9555 /
7848a797fd09cf853bf2c5809d364b91b6c6a691

mashos-api main / tree:
45bf98f9034261d3adb3e808d6d759f2334e2d25 /
23f1684ed5430cafef955d7af9fc6bde75a4c62f

production blob:
f10ce7948e5570ee8ad27ee2af00a9caf3867d49

protected-test blob:
c302dd99e143967fed6edd65b429373e87453fc6
```

current source identityは次のとおりである。

| role | repository path | bytes | LF | SHA-256 | Git blob |
|---|---|---:|---:|---|---|
| production | `ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py` | 547,665 | 14,350 | `af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088` | `f10ce7948e5570ee8ad27ee2af00a9caf3867d49` |
| protected test | `ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py` | 431,357 | 11,311 | `c9b27c1ec9cb7c0288a837828e9c1d9b011b0876aaa62347beb5633d6ff5a6d7` | `c302dd99e143967fed6edd65b429373e87453fc6` |

Cocolon `main`はG6 publication commitそのものであり、mashos-api `main`はG5
publication commitそのものである。G3〜G6のversioned evidence、Plan、07、08、
production、protected testに後発変更はなく、未分類driftは0だった。旧G3とinitial
G4には独立した`Result` fileはなく、それぞれtechnical AddendumがResult ownerである。
これは既存の凍結命名であり、欠落driftではない。

添付Planはcurrent mainより古いread-only reference copyだったため、write preimageには
使用していない。current mainの1,193,627-byte Planを正本preimageにした。

G6 private bodyはcurrent Work sessionへidentity付きで保持されていない。G6 Receiptが
`in_memory_review_only`、packet未作成・未永続化を記録しているため、保持を推測せず、
fresh generation、再読、Product Read再実行を0とした。本設計はbody-free G6 evidence、
current source/test、G5 diffだけで一つのbounded ownerへ閉じた。

## 2. Immutable historical facts

次を遡及変更しない。

```text
prior G3/G4/G5/G6:
CLOSED_HISTORICAL_EVIDENCE

G5:
G5_GATE_C_EXACT24_GREEN_PRODUCTION_PUBLISHED_CLOSED
24 PASS / 0 FAIL

G6:
G6_B6_REPRESENTATIVE_PRODUCT_READ_RECHECK_REJECTED_CLOSED
candidate PASS/MINOR/MAJOR/BLOCKER = 0/2/8/0
unique   PASS/MINOR/MAJOR/BLOCKER = 0/2/6/0
former-MAJOR cases/contexts <= MINOR = 0/5, 0/7
controls not worse = 1/3
new MAJOR control = 1
```

G5 machine GREENとpublicationは成立事実として保持する。G6 REJECTを用いてG5を
遡及無効化せず、G5 GREENをProduct Read PASSへ変換もしない。G6 severity、failed
axes、closed reason codesも変更しない。G6でcurrent private builderがexact10全てへ
到達したため、`BUILDER_NOT_REACHED`、`FINAL_BUILDER_NOT_INVOKED`、
`G5_PRODUCTION_NOT_USED`は原因候補へ戻さない。

## 3. G3 → G4 → G5 → G6 body-free crosswalk

| prior G3 frozen requirement | final G4 machine assertion | G5 actual implementation fact | G6 failure evidence | gap |
|---|---|---|---|---|
| accepted planからone-passでobservation / Receptionを統合し、already-rendered tailへappendしない | corrupted predecessor `rendered_surface`を無視して再buildできる`stale-tail closure` | final builderはlegacy `_step11_rc0031_product_render`を選択した。同関数は`base_candidate.final_utf8_bytes`をobservation / Receptionへsplitし、completed observation line末尾へ`clause_join + cluster`をappendし、Reception linesを別枠で再結合する | axes 1/8/10/12、main dominance8、typed density8、depth overshoot8、immediate-observation8 | 旧G3 behavior gapは未証明。G4がbase final-body independenceを証明せず、G5がlegacy rendererを選択した |
| `owner_role_particle_patterns` / kind mappingをactual realizationへ使い、count-checkだけを禁止 | valid mutationをoutput差**または例外**でcreditし、missing mappingをfail-close | role値は`morphology[roles[key]]`で存在確認するが戻り値を描画に使わない。kind exact12は全て同じidentity inflectionで、単一sentinel一致guardとして保持される | axes 1/2/8/12、owner-role grammatical join MAJOR7 | 旧G3 RED specがvalid/invalid mutation domainを分離せず、G4がrole positive realizationを例外感度で代替。kindはcausal gapでなくcoverage / fail-close preserve boundary |
| root/head exact1をmain finiteにし、other finiteをtyped subordinate/complementとして保持 | declared-head-first12、typed separator後のpiece数、atom counter | headを先頭へ置くがdependentは同じsemantic-clause rendererのfull predicateをgeneric `within_sentence_clause_join`でpeer接続する | axes 1/2/8/10/12、main8、relation/temporal7、density8 | position / separator proxyで文法階層を代替 |
| temporal/modality/polarity/referent scopeをroot/roleへcoordinateし、atom-local bundle反復を防ぐ | source dimension count、選択head exact1への4-registry mutation、missing-key fail-close |全rowのdimension cueを計算するが、visible textへ使うのはhead row cueだけ。dependent row cueは計算後に捨てる | axes 2/8/10/12、relation/temporal7、immediate-observation8 | authority readとbody locus equivalenceが未接続 |
| planをplacement graph、accepted Reception authorityをtyped companion inputとしてinput-specificに統合描画 | focus authority shape、direct/validator equality、target/support/act mutation、injection counts | accepted target/support/actを共通frameで別Reception lineへ描画する。focus selection / specificityとaspect congruenceのbody上の因果接続、observationとの一体化を証明しない | axis6は9/10、axis8は10/10、Reception MAJOR8 | authority connectionをspecific/natural realizationと誤同一視し、planとauthorityの型上の責務も分離しなかった |
| resource boundsとcase-agnostic variation | plan metadata maxima、selector0 |異なるtyped scheduleにも同じcue配置・generic join frameを反復 | axis9 MAJOR3、axes8/10/12 | actual-body budget / structural variation oracle不足 |
| semantic/safety preservation | atom/owner/modifier/authority conservation | boundaryを保持 | axes3/4/5/7/11 preserved、BLOCKER0 | gapなし。次iterationでもimmutable |

G4の`_g4_b6_call_matches(..., mode="e")`は呼出しが例外でもtrueを返す。
そのため「validな構造値を正常bodyへpositive realizationした」ことと「値をguardとして
参照し、変えられたら例外にした」ことを区別できなかった。また`tail_closed`は直前の
candidate `rendered_surface`を再利用しないことだけを証明し、意味を持つ
`base_candidate.final_utf8_bytes`へのlate spliceを禁止していなかった。

## 4. Localization

### 4.1 Broken layer

```text
FINAL_B6_PLAN_OWNED_INTEGRATED_NATURAL_LANGUAGE_SURFACE_REALIZATION
```

single production ownerは次である。

```text
MassyuRed/mashos-api
ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
```

Catalog、Grounded Lexicalization、Reception focus authority、relation/source
authorityはaccepted structured inputを供給している。G6で保たれたaxes3/4/5/7/11と
current source diffに照らし、competing ownerへ分散する根拠はない。

### 4.2 Common structural cause

```text
accepted typed plan / authority is consumed as validation, counting, and order
metadata, but is not the sole grammatical owner of the visible surface;
already-completed base prose and generic peer-clause / Reception frames remain
the actual serializer owners.
```

closed classificationはexact3である。旧G3 required behavior / windowの不足は証明されず、
historical verdictを再分類しない。旧G3側のgapはRED specにおけるvalid/invalid mutation domainの
未分離だけに限定する。

```text
PRIOR_G3_RED_SPEC_VALID_MUTATION_DOMAIN_GAP
G4_BASE_FINAL_BODY_LATE_SPLICE_AND_POSITIVE_REALIZATION_ORACLE_IMPLEMENTATION_GAP
G5_LEGACY_RENDERER_SELECTION_AND_VALIDATION_GUARD_SUBSTITUTION
```

これはcase、family、sample本文、固有語、fixture phrase、expected final textに依存しない。

## 5. Bounded future production owner

future G5で変更可能なproduction pathはexact1のままとする。

```text
ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
```

旧G3/G4/G5のrun creditはreuseしないが、current productionで再確認できる同じbounded
B6 suffixを新iterationのfresh preimage boundaryとして採用する。旧windowで別実装が
不可能だったとは判定しない。shared legacy `_step11_rc0031_product_render`はimmutableの
ままにし、final private builderの同関数direct callと、verified exact-reuse binding以外の
`base_candidate.final_utf8_bytes` semantic consumptionをexact0にする。pre-final exact2は
mutable wrapperのruntime lookupがあるためwindowだけでは不変にならず、下記G4 controlで
behavioral preservationを証明する。

current sourceのimmutable prefixとbounded suffixは次である。

```text
prefix bytes / LF:
537842 / 14085
prefix SHA-256 / Git-blob-form SHA-1:
18ad33095754c0132d22a7f2e004f00d5e1655a825e366ade5778adb1bc134d4 /
478454a1c5fb5b15e0c281ae93a63aa058bf8e26

current suffix bytes / maximum replacement suffix bytes:
9823 / 11090

current mutable-body aggregate / fixed non-body suffix / future body aggregate cap:
6051 / 3772 / 7318
```

future mutable function body exact3は次だけである。definition lineはcurrent preimageの
識別補助であり、future line number contractではない。

| symbol / occurrence | current def line | body bytes / LF | body SHA-256 |
|---|---:|---:|---|
| `_rc0031_rt_cluster` | 14184 | 3,459 / 88 | `5435452f561ac3d7ad0b0ef7b79799d1cb98fe6d4811941225b2cef591f91791` |
| second top-level `_step11_rc0031_product_render_cluster` after the B6 marker | 14276 | 879 / 22 | `bc85319c4a311072b811f3b970bde3bb1376ff1773fb7d1576e81918049dc283` |
| `_step11_rc0031_build_owner_role_inflected_typed_recomposition_candidate` | 14299 | 1,713 / 47 | `4505db38c95bf3ce434e7e1aaaa03947dacc726b83c6ad1a1c42c516fdc9fb15` |

既存のbody-only canonical maskでexact3 body以外を固定したcurrent residualは3,946 bytes /
111 LF / SHA-256
`c448d8f514669a7b0379e3a85b79fc5aabf29d00cbe002725592f74e9f60fc1d`である。
future G5はmarker、function名、signature、definition occurrence、top-level sequence、
`_rc0031_rt_plan`、masked residualを変えず、suffixを11,090 bytes以内、case/review-family/
coverage-family/input/fixture/proper-noun/expected-answer selectorを0に保つ。semantic familyを
typed structural dispatchへ使うことはoverfit selectorに数えない。Catalog、authority、
dataclass、public export、他symbolはimmutableである。
7,318-byte body aggregate内で全required behaviorを実装できることは本read-only G3では
未実装・未証明である。future G5 activation前にstatic feasibility preflightを必須とし、
不成立ならwindowを拡張せずtyped STOPしてnew design authorityへ戻る。

immutable shared `_step11_rc0031_product_render`のcurrent call siteはexact3である。ただし同関数は
mutable second wrapperをruntime lookupするため、pre-final exact2 callersのidentity、schema、
behaviorはwindowだけでは自動不変にならない。wrapperのcurrent `type(c) is dict` branchから
immutable `_RC0031_C0`へのdelegateをbehavior predicateとして凍結し、pre-final exact2の
differentialをfuture G4 versioned helper / new ordered-exact24 controlで証明する。final private builderからshared rendererへの
direct call countをexact0にし、verified exact-reuse binding以外の
completed base semantic-body consumptionをexact0にする。direct-call AST0だけではcreditせず、
final visible bodyのpre-rendered body noninterferenceを証明する。

## 6. Required future behavior

1. accepted `surface_realization_plan`をvisible surfaceの唯一のstructural placement /
   ownership graphにし、accepted `reception_focus_authority`をReception focus/aspectを供給する
   joint typed realization inputにする。planに存在しないfocus/aspect fieldを捏造しない。
2. verified exact-reuse binding以外ではcompleted base semantic textをcopy/appendしない。
   header/layoutの利用をsemantic tail reuseとしてcreditしない。
3. 各bindingでroot/headをexact1のmain finite ownerにし、other finite exact4をrelation
   direction / owner role付きのsubordinateまたはcomplementとしてexact1接続する。
4. semantic atom38、family22/13/1/2、reuse1をlatent planとvisible ownership mappingの
   双方でomit0/duplicate0/unowned0にする。`1 atom = 1 peer full clause`は要求しない。
5. owner grammatical-head24、modifier22、locus20、multiplicity18x1+2x2、maximum depth2を
   保ち、modifierをdeclared owner locus以外へ移さない。
6. `owner_role_particle_patterns`のvalid alternateはcloned catalog + clause morphology上に
   存在するgrammar-valid alternate key/valueとし、同じrelation direction / owner authorityを
   保ってaffected locusを事前固定する。例外でなくvalid renderを完了し、そのlocusだけを
   変える。missing/invalid mappingのfail-closeは別に
   証明する。kind exact12はcurrent contract上すべて同じidentity inflectionであるため、
   存在guardをproduct variationと数えず、owner24 coverageとmissing fail-closeだけを保つ。
7. temporal scope、modality、polarity、referent scopeを全source atomからowned
   root/dependent locusへequivalence-classとしてcoordinateする。collision-freeでschema-validな
   alternateはrender成功 + owned-locus deltaを必須にする。predeclared invalid / typed collision
   だけをfail-close creditにし、両domainを混同しない。dependent dimensionのsilent dropと
   atom-local full-bundle反復をともに0にする。
8. Reception11 / rebuild6はplan placementとaccepted authorityをjoint typed inputとして描画する。
   authority-validator PASS、existing owner、distinct/disjoint/bound内、registered actである
   controlled target / visible-support / effective-act alternateだけにrender成功 + local deltaを
   要求する。focusはowner selectionとspecificityへのcausal connection、aspectはcongruenceと
   effective-act nonpromotion invariantを証明し、constant `focus_basis`やalways-true accepted
   `aspect_congruent`へ存在しないlexical alternateを要求しない。
9. actual bodyからindependent finite、typed dependent、connector/cue repetition、owned /
   unowned residueを測り、plan resource maxima `(2,4,2,4)`とcluster `<=13` / load `<=4`を
   同時に満たす。structural scheduleの差はcase selectorでなくrole/direction/dimension/
   attachmentからsurface signatureへ伝える。
10. shared rendererのpre-final exact2 callersについて、dict catalogをimmutable `_RC0031_C0`へ
    delegateするcurrent dispatch、output schema、candidate identity、semantic/resource/privacy/
    runtime-disconnected behaviorを保持するdifferentialを必須にし、remediation credit0とする。
    final private builderのlegacy renderer direct call、verified exact-reuse binding以外の
    completed base semantic-body consumption、late-tail spliceをexact0にする。direct-call AST0
    だけをGREENにしない。
11. axes3/4/5/7/11、relation endpoint/direction、unknown non-invention、self-denial
    non-adoption、visible/Reception distinction、question-needed ambiguity、Safety、privacy、
    private/experimental/runtime-disconnected boundaryを保持する。

## 7. Future G4 causal RED owner

future RED test ownerはexact1である。

```text
ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
```

current全431,357 bytesをimmutable prefixとし、SHA-256
`c9b27c1ec9cb7c0288a837828e9c1d9b011b0876aaa62347beb5633d6ff5a6d7`、Git blob
`c302dd99e143967fed6edd65b429373e87453fc6`をpinする。future G4はversioned marker
`# rc0031 post-G6 shared structural correction causal RED-only v1`以下へ24,000 bytes以内を
appendする。prefix内のstatic-test-count52 freezeを変えないためnew static `test_` definitionは0、
versioned classへのdynamic assignmentでnew collected node exact2を作る。existing causal exact2は
意味もbodyも変更せず、新lifecycleのordered exact24からだけ除外する。旧G4 run/helper/cache
creditはreuseせず、新G4 lifecycleでfresh evidenceを作る。

ordered exact24 ID+LF materialはfirst22 historical controls + new exact2で、24 distinct /
3,575 bytes / 24 LF / SHA-256
`b3ac62fee89d554a2e30e507cfc211cb157130553a9eb7c8d42b762a53c6b0ef`である。new exact2は
次のversioned node IDsである。

```text
ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py::TestRc0031P3PostG6SharedStructuralCorrectionCausalRedOnlyV1::test_rc0031_p3_post_g6_owned_root_typed_dependent_surface_realization_is_proved_or_red_v1

ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py::TestRc0031P3PostG6SharedStructuralCorrectionCausalRedOnlyV1::test_rc0031_p3_post_g6_integrated_reception_product_surface_realization_is_proved_or_red_v1
```

new causal reason codesは次のexact2である。

```text
OWNED_ROOT_TYPED_DEPENDENT_SURFACE_REALIZATION_NOT_PROVED
INTEGRATED_RECEPTION_PRODUCT_SURFACE_REALIZATION_NOT_PROVED
```

G4 oracleはexisting exact10 / bindings12 / atoms38 / Reception11だけを使い、次を拘束する。
current `_g4_b6_freeze_is_exact`へpositive creditを与えず、full431,357-byte test prefix、
new append cap、上記new ordered list、production exact3 window、masked residual、selector0を
検査するversioned replacement freeze helperを使う。append24,000-byte feasibilityはG3では
未実装・未証明であり、G4 activation前preflightで不成立ならtyped STOPとする。

- valid structural mutationはrender成功 + expected owned-locus deltaを必須とし、例外を
  positive consumption creditにしない。
- missing / predeclared invalid / typed-collision mutationだけをfail-close creditにする。
- full exact10でroot/main、typed dependent、role/direction/dimension equivalence、
  atom-to-visible ownership、authorized reuse、verified exact-reuse以外のpre-rendered body
  noninterference、actual-body budgetを証明する。direct-call AST0だけをcreditしない。
- pre-final exact2 callerのdict→immutable `_RC0031_C0` dispatch、output schema、candidate
  identityとsemantic/resource/privacy boundaryをversioned appended helper / new exact2の
  mandatory non-causal-regression conjunctとしてpreserveする。failureをcausal REDに混入しない。
- Reception plan placement + accepted authority joint-input consumptionを証明する。controlled
  target/support/actはlocal differential、focusはselection/specificity causality、aspectは
  congruence/effective-act nonpromotion invariantとして分離する。
- G4実行前にowned-locus delta、surface equivalence/signature、actual-body budget、typed
  attachment、Reception causalityのmachine evidence schema、denominator、thresholdをversioned
  helper内へfreezeする。未定義・実装不能ならactivateせずtyped STOPする。
- raw phrase、case ID、family selector、fixture phrase、proper noun、expected answer、fixed
  final text、human severity hard-codeを使わない。
- symbol存在またはunconditional failureだけのREDを禁止する。

current production blob `f10ce7948e5570ee8ad27ee2af00a9caf3867d49`に対するrequired
projectionは`22 PASS / 2 CAUSAL_RED / 0 UNEXPECTED / 0 ERROR`、focused exact2は
`2 CAUSAL_RED`である。future G5 GREENは同じordered exact24で`24 PASS / 0 FAIL`、
focused exact2で`2 PASS`を必要とする。machine GREENはG6 Product Readを代替しない。
historical full52、append後whole-file full54、ordered exact24外whole collectionはこのlaneで
実行しない。

## 8. Future Product Read gate

future G6は同じfixed exact10 / exact8、同じ§18.4 exact12 axes、同じone-reviewer /
two-separated-pass contractを使う。PASS gateは次の積集合であり、弱化しない。

```text
candidate exact10 MAJOR/BLOCKER: 0
unique exact8 MAJOR/BLOCKER: 0
former-MAJOR: 5/5 cases and 7/7 contexts PASS-or-MINOR
controls: 3/3 not worse
new MAJOR control: 0
all eight current concern families at MAJOR: 0
axes3/4/5/7/11 preservation: true
privacy / denominator / authority / resource invariants: true
```

MINORを自動失格へ変更しない。fresh human Product ReadなしにG6 PASSまたはCycle001
acceptanceを宣言しない。

## 9. Regression risks and STOP conditions

| risk | required guard / STOP |
|---|---|
| compact化によるatom omission / relation neutralization | latent atom multisetとvisible ownership exact-onceが不一致ならSTOP |
| wrong root/head promotion | declared root/head exact1とfirst main finiteが一致しなければSTOP |
| valid mutationをexceptionで代替 | valid render成功がなければcausal GREENを与えずSTOP |
| dimension collapse / repetition | owned equivalence locus不一致、silent drop、full-bundle反復でSTOP |
| Reception authority drift | focus/target/support/act/aspectまたはvisible distinction変更でSTOP |
| product overfit | case/family/input word/proper noun/fixture/expected text selectorが1でもSTOP |
| hidden quality claim | raw body、quote、digest、key、private pathまたはhuman severity hard-code公開でSTOP |
| scope expansion | exact production/test owner外、Catalog/fixture/Parser/Matcher/API/DB/RN/Safety変更でSTOP |
| machine/product conflation | new GREENだけでG6/Cycle acceptanceを宣言したらSTOP |
| repository drift | pinned head/blob/preimageまたはfuture allowed windowがずれたらauthority非activate / STOP |

## 10. Performed / unperformed effects

```text
G3/G4/G5/G6 evidence read: performed
production/test/diff static read: performed
G6 private body read: 0
fresh exact10 generation / Product Read: 0 / 0
pytest / direct exact24 / full52 / exact100: 0 / 0 / 0 / 0
future whole-file full54 / ordered exact24外whole collection: 0 / 0
production / protected test / fixture / sample change: 0 / 0 / 0 / 0
mashos-api write: 0
G4 RED / G5 implementation / G6 rerun / G7: 0 / 0 / 0 / 0
Parser / Matcher / final inverse: 0 / 0 / 0
API / DB / RN / public / shared runtime / Safety change: 0
Cycle001 acceptance: 0
```

## 11. Durable reflection and terminal

GitHub write allowlistはCocolon exact6だけである。

1. 本Addendum NEW。
2. BodyFree Receipt NEW。
3. Handoff NEW。
4. ExecutionAndClosurePlan append-only MODIFY。
5. `07_latest_snapshot_diff.md` append-only MODIFY。
6. `08_cycle001_current_state.md` current-navigation MODIFY。

new3はprewrite `ABSENT`、modified3はcurrent main preimageを使用する。deletion0、rename0、
mashos-api write0である。exact6全てのprepared-byte equality、changed-path union exact6、
unauthorized0、latest-main inclusionをfresh確認した時点だけでdurable closureとする。

```text
G3_POST_G6_SHARED_STRUCTURAL_CORRECTION_REMEDIATION_CONTRACT_FROZEN_READ_ONLY
PRIOR_G3_G4_G5_G6_CLOSED_EVIDENCE_PRESERVED
NEXT_G4_RED_ONLY_SEPARATE_APPROVAL_REQUIRED
CURRENT_AUTHORITY_STOP
AUTOMATIC_PROGRESSION_FALSE
```

本G3は新iterationとしてapproval1、activation1、consumption1、classification1、close1、
retry0、reuse0、reactivation0で閉じる。旧G3〜G6のlifecycleを再openしない。
