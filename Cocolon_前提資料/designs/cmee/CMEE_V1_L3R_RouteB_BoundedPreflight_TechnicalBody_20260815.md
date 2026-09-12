# CMEE V1 L3-R Route B Bounded Preflight Technical Body v1

## 0. Body identity and current state

| Field | Exact value |
|---|---|
| `body_id` | `CMEE_V1_L3R_ROUTE_B_BOUNDED_PREFLIGHT_TECHNICAL_BODY` |
| `body_version` | `1.0.0` |
| `body_date_jst` | `2026-08-15` |
| `body_canonical_sha256` | `4948bd4d0db491b29021a035af5d596776c86908301b5f49aeff15b2b8418901` |
| `canonicalization` | UTF-8、LF。上記hash値だけをASCII `0` exact64へ置換したファイル全bytesをSHA-256する |
| `proposal_state` | `PROPOSED_INACTIVE_NOT_APPROVED` |
| `necessity_class` | `OBSERVED_BLOCKER_MINIMAL_FIX` |
| `approval_owner` | `Mash` |
| `repository` | `MassyuRed/Cocolon` |
| `current_pr` | Draft / open / unmerged PR `#30` |
| `current_pr_head` | `8f9eed6879ce1311b68d8046d3c5868140d549d7` |
| `current_state` | `ROUTE_B_SELECTED_BOUNDED_PREFLIGHT_NOT_AUTHORIZED_STOP` |
| `route_id` | `ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION` |
| `route_contract_id` | `cocolon.cmee.v1a.acceptance.route_b.v1` |
| `P0_execution_at_body_creation` | `0` |
| `automatic_progression` | `false` |

このbodyは承認候補であり、作成・提示だけではL3-R承認、P0実行、dependency採用、実装開始のいずれにもならない。

## 1. Decision request

Mashへ求めるLEVEL_3判断はexact1である。

> このbodyのcanonical SHA-256に固定されたRoute B contract、docs-only L3-R reflection、KWJA exact1候補のP0 bounded preflight exact1を承認するか。

承認時に許可されるのは次のexact2だけである。

1. PR #30上で、このbodyとRoute B contractをdocs-onlyでdurable reflectionする。
2. reflectionのfresh verification後、§9–§13に固定したP0をexact1回実行し、body-free result exact1と最小state syncを同じDraft PRへ反映する。

承認しない場合のterminalは `L3R_TECHNICAL_BODY_NOT_APPROVED_STOP`。現在のprovider admission `NO_SAFE_CMEE_V1A_CANDIDATE_STOP`、P0実行0、実装0を維持する。

## 2. Purpose, blocker, and product effect

### 2.1 Purpose

Route Bを「parserが正しい意味を決める経路」ではなく、「parser proposalを暫定のまま隔離し、source-explicitな限定観測、user-sovereignな一点補足、または明示的UNAVAILABLEで閉じる経路」としてexactに固定する。そのうえで、Emlis V1-Aの最初のoffline candidateとしてKWJAのprovider/resource/platform実現可能性だけを、一回限りのP0で測る。

### 2.2 Observed blocker

- current contractを満たす日本語predicate / argument authority exact1は未確認。
- current schemaにはRoute B per-owner disposition、original-input lifecycle全体の質問budget、supplemental graph lineageのexact contractがない。
- GiNZA current candidateは`spacy==3.7.6`がyankedで、`sudachidict_core==20260723`のartifact closureも未確認であり、そのままの実行候補にはできない。
- KWJAはpredicate-argument structureを含むproposal capabilityを公式に持つが、Cocolonでのpackage/resource closure、CPU resource cost、offline behavior、license/provenanceは未測定。

### 2.3 Product effect ceiling

| Axis | Effect from L3-R / P0 |
|---|---:|
| Route B contractの明確化 | `BLOCKER_NARROWED` |
| provider/resource/platform evidence | P0 terminalでのみbody-free evidence |
| Emlis Product Credit | 0 |
| Piece / Analysis behavior | 0 |
| implementation credit | 0 |
| dependency adoption | 0 |
| production / API / DB / RN effect | 0 |
| Cycle001 credit / restart / acceptance | 0 |
| merge / ready / release | 0 |

P0がPASSしてもterminalは `P0_PASS_EVIDENCE_READY_L3I_NOT_AUTHORIZED_STOP`。L3-I、I1、実装、Cycle再入場へ自動進行しない。

## 3. Scope and authority boundary

### 3.1 In scope

- CMEE V1-Aの最初のvertical `EMLIS_AI / OBSERVE_AND_CLARIFY`だけ。
- shared provider proposal、Route B owner disposition、Emlis sufficiency resolutionのcontract semantics。P0でのresolver実行・評価は0。
- synthetic/private-free exact12 corpusでのoffline provider preflight。
- official package/resource acquisition identity、transitive closure、license/provenance、platform、installed bytes、cold load、peak RSS、latency、output capability、provider-declared warning / field omission / OOV挙動の測定。

### 3.2 Out of scope

- Piece、分析構造、V1-B以降、production source、product UI、API、DB、React Native。
- requirements/lock/source/test/runnerの実装bytes。
- persistent checker、controller、registry、dashboard、monitor、CI gate、service、daemon。
- GiNZAとの比較、provider family benchmark、alternate provider/model/version substitution。
- user input、Cycle001 input、Product Read fixture、expected text、question decisionの利用。

### 3.3 Namespace and retained contract

`CMEE_L3R_ROUTE_B_V1`はPR #29のCycle Route U / Route Cと別namespaceである。L3-RはPR #29、`08_cycle001_current_state.md`、P1–P7、`245 required + 6 active = 251`、Step1/2/3を変更しない。Cycle適用にはI2後のseparate C0 LEVEL_3とfresh `08`判断が必要である。

次は維持する。

- required / active denominatorの全件保持。
- raw replay、fixed/generic empathy、legacy fallback、mirror routeの禁止。
- one-best、score、first/last/nearest heuristic、empty ambiguity list、candidate consensus、Product Readをmeaning authorityにしない。
- original sourceの不変性。
- machine PASS、Product Read、actual-device、runtime、Cycle creditの分離。

変更候補はexact1だけである。Step1の「全ownerをformal attachment一意に閉じる」中間gateを、Route Bではuser-sovereign typed disposition gateへ置換できるようにする。ただしCycle001への適用はこのbodyでは0である。

## 4. Route B acceptance contract

### 4.1 Contract identity

```text
contract_id = cocolon.cmee.v1a.acceptance.route_b.v1
route_id = ROUTE_B_PROVISIONAL_ATTACHMENT_WITH_USER_SOVEREIGN_RESOLUTION
first_vertical = EMLIS_OBSERVATION_OFFLINE_CANDIDATE_ONLY
provider_authority_ceiling = PROVISIONAL_ONLY
runtime_network = 0
runtime_storage_write = 0
runtime_secret = 0
fallback = 0
automatic_retry = 0
automatic_progression = false
```

### 4.2 Owner universe and exact coverage

source adapter / core obligation ownerはprovider実行前に次をsource versionとobligation versionへbindする。

```text
required_owner_refs[]
active_optional_owner_refs[]
credit_only_owner_refs[]
owner_universe_digest
```

`U = required_owner_refs ∪ active_optional_owner_refs`とする。resolver出力`D`は次をすべて満たす。

```text
set(D.meaning_owner_id) = U
len(D) = len(U)
duplicate_owner_count = 0
missing_owner_count = 0
denominator_shrink = 0
```

`credit_only_owner_refs`はrequired / active欠落の代替creditにならない。provider omissionはowner omissionに変換せず、当該ownerを`MISSING_OR_INVALID / NOT_VISIBLE_UNRESOLVED`として保持する。

### 4.3 Per-owner disposition

```text
RouteBOwnerDisposition
  meaning_owner_id
  owner_class = REQUIRED | ACTIVE_OPTIONAL
  provider_resolution = UNIQUE | AMBIGUOUS | UNRESOLVED | MISSING_OR_INVALID
  attachment_admission = PROVISIONAL_ONLY | UNRESOLVED | UNAVAILABLE
  visible_authority =
      SOURCE_EXPLICIT |
      SUPPLEMENTAL_USER |
      NONE
  route_b_disposition =
      SOURCE_EXPLICIT_VISIBLE |
      SUPPLEMENTAL_USER_VISIBLE |
      UNKNOWN_PRESERVED_LIMITED |
      CLARIFICATION_TARGET |
      NOT_VISIBLE_UNRESOLVED |
      SEPARATE_SAFETY
  visible_claim_refs[]
  evidence_refs[]
  target_unknown_ref?
  reason_codes[]
```

Cross-field invariants:

- positive visible claimを持てるのは`SOURCE_EXPLICIT_VISIBLE`または`SUPPLEMENTAL_USER_VISIBLE`だけ。
- `UNKNOWN_PRESERVED_LIMITED`は未知の明示にだけ使い、predicate / argument / relation / cause / polarity / modality / timeを肯定しない。
- `CLARIFICATION_TARGET`はoriginal-input lifecycle全体で最大exact1。
- required ownerが`NOT_VISIBLE_UNRESOLVED`で、意味のあるsafe artifactも作れなければglobal outcomeは`UNAVAILABLE`。
- ambiguous must-keep ownerのomit、duplicate、denominator shrinkによるLIMITED成功は禁止。

### 4.4 Responsibility separation

| Owner | Responsibility | Not authority for |
|---|---|---|
| source adapter / core obligation owner | owner universe、source identity、required/active/credit-onlyを固定 | parser proposalの正しさ |
| KWJA provider adapter | source-bound candidate proposalを生成 | visible meaning、FORMAL_CLOSED、product sufficiency |
| shared sealer | provider/resource/config/source/range/digestをbindし、countsを再計算 | semantic candidate選択 |
| independent assessor | identity、set equality、hard-invalid、coverageを検証 | 第二のmeaning authority、別service/process |
| Emlis sufficiency resolver | typed dispositionからGENERATED/LIMITED/QUESTION_PENDING/UNAVAILABLEを選択 | source採用、user answerの生成 |
| Emlis core owner | 何を言うか、voice、Reception、Product Read | provider confidenceのauthority化 |
| caller-supplied supplemental source | target unknown exact1をuser-owned evidenceで補足 | 他unknown、provider全体のformal化 |

### 4.5 Provisional representation decision

Route Bではprovider由来のprovisional node / edgeを`GroundedMeaningGraph`へ入れない。provider proposalはrequest-local `JapaneseAttachmentCandidateSet`と`JapaneseAttachmentAdmission`にだけ保持する。

- `closure_status = PROVISIONAL_ONLY`。
- `candidate_set_completeness = NOT_PROVED`。
- `open_slot_denominator_state = NOT_ESTABLISHED`。
- Route B proposalから`FORMAL_DERIVED`または`FORMAL_CLOSED`を生成しない。
- visible graphに置けるpositive semanticsは`SOURCE_EXPLICIT`、target exact1の`USER_CONFIRMED / USER_CORRECTED`、または将来別契約でformal closureしたevidenceだけ。
- one-best、score、候補順、empty ambiguity、returned-candidate consensusはvisible authorityにならない。
- provisional proposalはdiagnosticとclarification target候補の算出にだけ使える。question textやselectorそのものはsemantic sourceではない。

この決定により、L3-Rでは`PROVISIONAL_DERIVED_NOT_VISIBLE_AUTHORITY`のgraph enumを追加しない。

### 4.6 EngineOutcome cross-field contract

| Outcome | Exact condition |
|---|---|
| `GENERATED` | 全required visible dutyがSOURCE_EXPLICITまたはtarget-exact user evidenceだけで成立し、残存unknownがvisible claimへmaterialでない。unresolved required duty exact0 |
| `LIMITED` | 入力固有でsource-boundなmeaningful Observation exact1以上とbound Receptionがあり、残るunknownを明示する。質問なし |
| `QUESTION_PENDING` | 上記LIMITEDを`PRE_QUESTION`として保持し、materialでuser-resolvableなsemantic unknown exact1へClarificationRequest exact1をbindする |
| `UNAVAILABLE` | safeでmeaningfulなvisible claimがない。artifact / question / fallbackはnull |
| `REJECTED` | source role、version、lineage、privacy、contract identityがhard-invalid |
| `SEPARATE_SAFETY` | high-care materialをEmlis Observationへ混入せず、既存separate ownerへ渡す |

`LIMITED`をraw replay、generic empathy、fixed template、main meaningを落とした薄い要約で成立させない。`QUESTION_PENDING`をquestion-onlyで成立させない。provider failure時にfixed empathyやlegacy outputへfallbackしない。

### 4.7 One-clarification lifecycle

```text
original_input_lifecycle_ref
clarification_ordinal = 1
target_unknown_ref
target_source_range_ref
clarification_budget_before = UNUSED
clarification_budget_after = CONSUMED
max_request_count_per_original_lifecycle = 1
max_answer_count = 1
```

- lifecycle refはcanonical original `SourceEnvelope` identityへbindする。
- budgetはrequest発行時に消費し、retry、regeneration、skip、expiry、invalid/ambiguous answerで復活しない。
- re-ask、second unknown、question rally、`REFINED` stageからの再質問は0。
- 問いは自然なsemantic difference exact1を尋ね、parser用語、annotation選択の強要、leading question、網羅候補の提示を避ける。
- `skip`、`このまま観測`、`分からない`を許可する。
- answerが曖昧、skip、unknownなら再質問せず、元のLIMITEDまたはUNAVAILABLEで閉じる。
- question、question decision、fixture、expected text、Product Readはsemantic sourceにならない。

### 4.8 Supplemental answer and immutability

真正なanswerだけをcaller-supplied private `SUPPLEMENTAL_ANSWER` `SourceEnvelope` exact1として受ける。

```text
source_role = SUPPLEMENTAL_ANSWER
parent_source_refs = [canonical original source ref]
target_unknown_ref = clarification target exact1
```

- original bytes、digest、version、attachment set/admission、original graphをin-place変更しない。
- new graph version / deltaは`parent_graph_ref`と`refinement_target_ref`を持つ。
- answerが変更できるのはtarget unknown exact1だけで、`USER_CONFIRMED`または`USER_CORRECTED`へする。
- 他owner、他unknown、parser ambiguity、open-slot denominatorへ一般化しない。
- provider proposalをretroactiveに`FORMAL_DERIVED / FORMAL_CLOSED`へ変えない。
- skip / controlとしてのunknownではSupplemental SourceEnvelopeを作らない。
- authenticated caller identity / lineage mismatchは`REJECTED`。

### 4.9 Failure, ambiguity, OOV, and privacy

Reason codes:

```text
PROVIDER_IDENTITY_MISMATCH
RESOURCE_LOCK_MISMATCH
PROVIDER_OUTPUT_INVALID
REQUIRED_OWNER_MISSING
ATTACHMENT_AMBIGUOUS
ATTACHMENT_UNRESOLVED
OOV_UNRESOLVED
NO_MEANINGFUL_GROUNDED_CLAIM
CLARIFICATION_BUDGET_CONSUMED
SUPPLEMENTAL_LINEAGE_MISMATCH
PRIVATE_BOUNDARY_VIOLATION
```

- provider/resource mismatch、crash、invalid payloadは`UNAVAILABLE`、fallback 0、automatic retry 0。
- OOV、固有名、未知語はliteral source spanとして`SOURCE_EXPLICIT`保持できるが、lemma、normalization、relation、meaningを推測しない。
- provider omission / OOVがvisible claimにmaterialならLIMITED、一点確認、またはUNAVAILABLEへ閉じる。
- OOV解決のruntime download、network dictionary、user dictionaryは0。
- providerが返した候補が全一致してもcandidate completenessの証明にはならない。

Body-full / public禁止:

- original input、supplemental answer、question prompt、raw parser output。
- surface / lemma / token / scalar / UTF-8 range、attachment candidate、private provenance/path。
- user/source/graph identityや識別可能なparaphrase。

Public-safe:

- anonymous counts、reason code、schema / contract / provider / resource / policy identity。
- package/resource filenames、SHA-256、bytes、license identity、platform、aggregate timing/resource metrics。

P0 corpusはsyntheticでprivate/user input exact0。それでもraw parse dumpは永続化しない。

### 4.10 Schema semantics frozen by this body

実際のschema file bytesはL3-I / I1後まで作らないが、次のsemantic deltaを固定する。

| Schema candidate | Frozen delta |
|---|---|
| `JapaneseAttachmentAdmission v1alpha2` | owner universe identity、required/active exact coverage、`RouteBOwnerDisposition[]` |
| `GroundedMeaningGraph v1alpha2` | `parent_graph_ref`、`refinement_target_ref`。provisional epistemic enum追加なし |
| `ClarificationRequest v1alpha2` | original lifecycle ref、ordinal exact1、lifecycle-wide consumed budget、target range/ref |
| `EngineOutcome v1alpha2` | 上記version参照、refined再質問禁止、owner dispositionとglobal outcomeの一致 |
| `SourceEnvelopeMeta` | existing `parent_source_refs`を利用し、shape変更なし |

field semantics、enum、cross-field invariantを後工程で変える場合、このL3-R approvalを流用せず再判断する。

## 5. Preflight candidate exact1

### 5.1 Selection

| Field | Exact candidate |
|---|---|
| provider | `KWJA` |
| provider version | `2.5.1` |
| provider tag | `ku-nlp/kwja@v2.5.1` |
| provider tag commit | `140817f9294cf32cf718e6b1cc32cb08c9f081ae` |
| provider wheel | `kwja-2.5.1-py3-none-any.whl` |
| provider wheel SHA-256 | `37d74467b47a2f50b849bc71bea0a33f40290366ff17c67f839c0eba73f0f118` |
| direct package constraints | `kwja==2.5.1`, `torch==2.7.1+cpu` |
| Python ABI | `CPython cp312` |
| platform family | Linux `x86_64`, glibc compatible with `manylinux_2_28` |
| model size | `base` |
| tasks | `char,word` |
| device | `cpu` |
| num workers | `0` |
| torch compile | `false` |
| char batch | `1` |
| word batch | `1` |
| provider/model alternatives | exact0 |

`base`はKWJA公式defaultで、`word`はmorphology、dependency、PAS、bridging/coreference proposalを提供する。`char`はsentence/word segmentationとnormalizationを提供する。`typo`と`seq2seq`はこのP0に含めない。必要capabilityが`char,word`で得られなければ修理・task追加をせずSTOPする。

KWJA CLI / writerがNFKC等のnormalizationを行うため、provider出力の位置情報をoriginal source range authorityとして使わない。P0ではoriginal UTF-8 bytesとnormalized textの差分を測り、Route B source alignmentはcanonical source adapterが別途保持するoriginal rangeをauthorityとする。

Primary references:

- `https://github.com/ku-nlp/kwja/releases/tag/v2.5.1`
- `https://github.com/ku-nlp/kwja/blob/v2.5.1/pyproject.toml`
- `https://github.com/ku-nlp/kwja/blob/v2.5.1/README.md`
- `https://github.com/ku-nlp/kwja/blob/v2.5.1/src/kwja/cli/utils.py`
- `https://download.pytorch.org/whl/cpu/torch/`
- `https://pypi.org/project/kwja/2.5.1/`

### 5.2 Resource identity exact2

```text
https://lotus.kuee.kyoto-u.ac.jp/kwja/v2.4/char_deberta-v2-base-wwm.ckpt
https://lotus.kuee.kyoto-u.ac.jp/kwja/v2.4/word_deberta-v2-base.ckpt
```

KWJA 2.5.xのofficial version mapがcheckpoint resource `v2.4`へ対応する。P0で各URLのfinal resolved URL、filename、HTTP status、bytes、SHA-256、license/provenance evidenceを記録する。

Checkpoint hparamsが参照するfoundation-model identityは次のexact2 revisionへ固定する。

```text
ku-nlp/deberta-v2-base-japanese-char-wwm@29498bbcaa6e3220d9e74345cd6d963e7c00fee4
ku-nlp/deberta-v2-base-japanese@833680905d7c57dbc7914dd33707a9fe1b20c60d
```

両model cardの表示licenseは`CC-BY-SA-4.0`である一方、KWJAのMIT表示は明示上softwareに対するものだけである。これをcheckpoint固有licenseへ黙示適用しない。

Checkpoint bytes取得前に、次のhard gateを満たす。

```text
checkpoint_specific_license_evidence = PASS
publisher_integrity_evidence = exact1(PUBLISHER_MANIFEST_SHA256,
                                      VERIFIED_SIGNED_CHECKSUM,
                                      PINNED_PUBLISHER_REPO_MAPPING)
```

`checkpoint_specific_license_evidence=PASS`にできるのは、publisher-controlledなimmutable documentがresource version `v2.4`とexact checkpoint filename exact2を対象に含め、適用license identifierまたはlicense textを明示する場合だけ。

`publisher_integrity_evidence`の許容形は次のexact3だけである。

1. `PUBLISHER_MANIFEST_SHA256`: official publisherのimmutable manifestがexact filename、SHA-256、bytesを対応付ける。
2. `VERIFIED_SIGNED_CHECKSUM`: exact filenameとSHA-256を含むchecksum manifestのsignatureが検証でき、signing key fingerprintとpublisher ownershipがpinned official publisher sourceに明示される。
3. `PINNED_PUBLISHER_REPO_MAPPING`: publisherのpinned immutable repository commit内のfileがresource version、exact filename、SHA-256を対応付ける。

次は単独でも組合せでもPASS evidenceにしない。

- TLS成功、official domain、HTTP header / ETag。
- P0がdownload後に自計測したSHA-256。
- KWJA `2.5.x -> resource v2.4` version map。
- KWJA software MIT表示、HF foundation-model cardのlicense表示。
- HF revision、asset hash、mutable page、unsigned checksum。

Gate前に許可するresource通信は、pinned official metadata/manifestのGET/HEAD、exact checkpoint URLのHEAD、§6.1のHF asset exact setだけ。checkpoint bodyは取得しない。gateが成立しなければ`P0_LICENSE_OR_PROVENANCE_UNRESOLVED_STOP`。

Gate成立後に限りexact checkpoint bodyを取得し、self-measured SHA-256をpublisher evidenceのSHA-256とexact一致させる。不一致は`P0_RESOURCE_IDENTITY_STOP`。一致してもself-measured SHAをpublisher verificationとは呼ばない。

Upstream loaderがcheckpointを`torch.load(..., weights_only=False)`で読むため、このgateはhard preconditionである。

### 5.3 Package resolver boundary

- direct package constraintsは上記exact2。
- `kwja==2.5.1` metadataの`torch>=2.4,<2.8`に対し、CPU wheelを`torch==2.7.1+cpu`へ固定する。
- prerelease、source distribution、VCS dependency、editable install、system packageは0。
- resolverは一回だけbinary-only transitive closureを解く。
- P0で全transitive package name/version、wheel filename、origin URL、SHA-256、licenseを記録する。
- resolver conflict、binary wheel欠落、source build要求、unapproved host、unknown resultはSTOP。version substitutionやconstraint緩和はしない。
- P0 resultはcandidate closure evidenceでありlock/adoptionではない。exact lockは別L3-Iで判断する。

## 6. Acquisition, network, storage, and secret boundary

### 6.1 Allowed acquisition endpoints

HTTPS exact host allowlist:

```text
pypi.org
files.pythonhosted.org
download.pytorch.org
download-r2.pytorch.org
lotus.kuee.kyoto-u.ac.jp
huggingface.co
cas-bridge.xethub.hf.co
```

- package/resource acquisition phaseだけnetworkを許可する。
- HF acquisitionは次のinitial request URL exact11だけ。

```text
https://huggingface.co/ku-nlp/deberta-v2-base-japanese-char-wwm/resolve/29498bbcaa6e3220d9e74345cd6d963e7c00fee4/README.md
https://huggingface.co/ku-nlp/deberta-v2-base-japanese-char-wwm/resolve/29498bbcaa6e3220d9e74345cd6d963e7c00fee4/config.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese-char-wwm/resolve/29498bbcaa6e3220d9e74345cd6d963e7c00fee4/special_tokens_map.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese-char-wwm/resolve/29498bbcaa6e3220d9e74345cd6d963e7c00fee4/tokenizer_config.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese-char-wwm/resolve/29498bbcaa6e3220d9e74345cd6d963e7c00fee4/vocab.txt
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/README.md
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/config.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/special_tokens_map.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/spm.model
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/tokenizer.json
https://huggingface.co/ku-nlp/deberta-v2-base-japanese/resolve/833680905d7c57dbc7914dd33707a9fe1b20c60d/tokenizer_config.json
```

- `cas-bridge.xethub.hf.co`は上記exact requestへのHTTP redirect responseとしてだけ許可し、standalone requestは0。
- 追加asset、revision、query selector、model weight (`model.safetensors` / `pytorch_model.bin`)、redirect hostはSTOP。
- redirectsは上記host内だけ。新hostはSTOP。
- user body、supplemental source、fixture outputをnetworkへ送らない。
- measurement phaseはnetwork exact0。network attemptを検知した時点でSTOP。
- external API、telemetry、unlisted model hub / revision、additional model weight、dictionary downloadは0。

### 6.2 Exact temporary root

```text
/tmp/cocolon-cmee-v1a-p0-kwja251-base/
```

activation時に不存在であることを確認する。存在していれば再利用・削除せず`P0_ACTIVATION_PRECONDITION_STOP`。

Allowed children exact:

```text
venv/
wheelhouse/
pip-cache/
kwja-cache/
hf-home/
config/
corpus/
output/
evidence/
tmp/
pycache/
body-free/
```

`HOME`、`XDG_CACHE_HOME`、`KWJA_CACHE_DIR`、`KWJA_CONFIG_FILE`、`HF_HOME`、`TMPDIR`、Python/pip cache、pycacheをこのroot配下へbindする。repository、workspace、shared cache、system locationへのwriteは0。secret、credential、paid serviceは0。

load / measurementは環境変数だけでなくOS / runner側で次を強制できる場合に限る。

```text
egress = DENY
environment_secret_count = 0
filesystem_write_allowlist = [/tmp/cocolon-cmee-v1a-p0-kwja251-base/]
repository_read = DENY
repository_write = DENY
home_read = DENY
home_write = DENY
child_process_creation = DENY
privilege_escalation = DENY
```

read可能範囲はP0 rootと、承認済みinterpreter / venvの実行に不可欠なsystem runtime filesだけへ限定する。強制不能なら`P0_ISOLATION_NOT_ENFORCEABLE_STOP`。`HF_HUB_OFFLINE=1`、`TRANSFORMERS_OFFLINE=1`は併用するが、安全境界の代替にはしない。

## 7. Resource and workload ceilings

| Ceiling | Exact value |
|---|---|
| provider stack | 1 |
| disposable environment | 1 |
| active provider process | 1 |
| execution concurrency | 1 |
| synthetic cases | 12, sequential |
| cold load | 1 |
| measured run | 1 |
| CPU | allowed, thread ceiling 1 |
| GPU / MPS | 0 |
| daemon / service / container | 0 |
| system package / source build | 0 |
| same-URL artifact acquisition retry | maximum 1 |
| install / load / inference / case retry | 0 |
| fallback / substitution / repair helper | 0 |
| expected wall time | 30–60 minutes |
| hard wall-clock stop | 90 minutes from first acquisition effect |
| new paid cost | 0 |
| Mash operation during P0 | 0 |

`OMP_NUM_THREADS`、`MKL_NUM_THREADS`、`OPENBLAS_NUM_THREADS`、`NUMEXPR_NUM_THREADS`は`1`、`TOKENIZERS_PARALLELISM=false`へ固定する。

installed bytes、RSS、cold load、p50/p95をL3-Rでrelease thresholdとして捏造しない。測定値はL3-I判断材料である。OOM、timeout、90分超過、materially infeasibleなresource挙動はcause-specific STOP。

## 8. Synthetic corpus exact12

case IDとtextを固定する。expected parse、expected answer、selectorは置かない。

| ID | Coverage | Synthetic text |
|---|---|---|
| `P0-JA-01` | explicit subject / topic / case | `私は友人に手紙を渡した。` |
| `P0-JA-02` | omitted subject / argument | `昨日、ようやく伝えた。` |
| `P0-JA-03` | coordination | `嬉しかったけれど、不安も残っている。` |
| `P0-JA-04` | quotation | `「大丈夫」と言われても、まだ迷いがある。` |
| `P0-JA-05` | relative clause | `昨日話した友人から返事が来た。` |
| `P0-JA-06` | passive | `予定を急に変えられて、戸惑った。` |
| `P0-JA-07` | causative | `母は子どもを早く寝かせた。` |
| `P0-JA-08` | negation + modality | `明日は行けないかもしれない。` |
| `P0-JA-09` | time scope | `先週は不安だったが、今は少し安心している。` |
| `P0-JA-10` | zero anaphora | `連絡したら、すぐ来てくれた。` |
| `P0-JA-11` | attachment ambiguity | `昨日見た友人の写真を机に置いた。` |
| `P0-JA-12` | OOV + emoji + full-width space + CRLF | `ココロンΞ　は未知語🙂です。<CR><LF>` |

`P0-JA-12`のcanonical bytesはUTF-8 text `ココロンΞ　は未知語🙂です。`の直後にbytes `0D 0A`を置く。表中の`<CR><LF>`文字列を入力しない。

corpusはsynthetic/private-freeであり、Cycle001 denominator、Product Read、acceptance fixtureへ転用しない。gold attachment、gold one-best、accuracy thresholdを置かない。

## 9. Future activation and durable L3-R reflection

この§はMashがbody hashを承認した後にだけ有効になる。現在は実行しない。

### 9.1 Fresh admission

- PR #30のDraft/open/unmerged、head、target blobをfresh fetchする。
- head advanceだけではSTOPしないが、target path conflictまたはunknown resultはSTOP。
- force update、history rewrite、merge、ready化は0。
- PR #29と`08_cycle001_current_state.md`はread-onlyかつchanged path exact0。

### 9.2 Pre-P0 docs-only write set exact7

Create exact1:

```text
Cocolon_前提資料/designs/cmee/CMEE_V1_L3R_RouteB_BoundedPreflight_TechnicalBody_20260815.md
```

Modify exact6:

```text
Cocolon_前提資料/current_structure/04_cmee_current_structure.md
Cocolon_前提資料/designs/cmee/v1/00_read_first.md
Cocolon_前提資料/designs/cmee/v1/01_shared_kernel_and_runtime_contracts.md
Cocolon_前提資料/designs/cmee/v1/02_emlis_v1a_detailed_design.md
Cocolon_前提資料/designs/cmee/v1/05_json_schema_and_versioning.md
Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md
```

Reflection result state:

```text
L3R_ROUTE_B_APPROVED_P0_AUTHORIZED_NOT_STARTED
```

This write set is docs-only。requirements、dependency、lock、source、test、runner、runtime、API、DB、RN effectは0。remote exact7 bytes/hash、commit changed paths exact7、PR full path countをfresh verifyしてからP0へ進む。unknown write resultはP0を開始せずSTOP。

## 10. P0 procedure exact1 — not executed by this body creation

P0 ownerはexecution agent exact1。parallel/duplicate executionは0。

1. §9のdurable reflectionとfresh stateを確認する。
2. platform actual（CPython cp312、Linux x86_64、glibc、CPU）を記録する。ABI/platform不一致はSTOP。
3. exact temp rootが不存在であることを確認する。存在時は触らずSTOP。
4. exact rootとallowed childrenを作る。
5. load/measurementに必要なOS/runner egress deny、secret-free、write allowlistを強制できることを確認する。不能ならSTOP。
6. checkpoint bodyを取得せず、official metadata/manifest、checkpoint HEAD、HF asset exact11だけを取得し、§5.2のcheckpoint-specific licenseとpublisher integrity hard gateを判定する。未成立ならSTOP。
7. allowlisted endpointsからbinary-only package closureを取得し、各wheelのidentity、bytes、SHA-256、licenseを記録する。
8. gateで得たpublisher digestがある場合だけexact2 checkpoint bodyを取得し、final URL、bytes、candidate SHA-256をpublisher digestと照合する。不一致はSTOP。
9. packagesを`wheelhouse/`からoffline installする。install中network 0。
10. configを`base / cpu / char,word / workers0 / batch1 / torch_compile false`へ固定する。
11. OS/runner egress deny下でcold load exact1とsynthetic exact12のsequential run exact1を行う。
12. §11 evidenceを集計し、terminal exact1を決める。raw parse dumpはresultへ含めない。
13. body-free resultを生成し、private/raw bytesを含まないことを検証する。
14. terminalに関係なく、新規作成したexact temp rootだけを削除する。root外は削除しない。
15. §12のbody-free result/state syncだけをDraft PR #30へ反映し、fresh verifyする。
16. `automatic_progression=false`で停止する。

任意stepでSTOP条件が成立したら、残るacquisition / install / load / measurementを行わず、利用可能なbody-free reason/evidenceの生成、cleanup、state syncだけへ進む。

同一URL・同一artifactのacquisition failureだけ最大1回再試行できる。削除できるのはexact temp root内の当該partial fileだけ。install、load、inference、case retryは0。alternate version/provider/model/host、task追加、repair helperは新しいMash判断なしに行わない。

## 11. Evidence and P0 PASS contract

### 11.1 Evidence exact fields

- direct/transitive package names、versions、wheel filenames、origin URLs、SHA-256、bytes、licenses。
- checkpoint filenames、requested/final URLs、SHA-256、bytes、license/provenance identity。
- Python implementation/version、ABI、OS、arch、libc、CPU identity。
- exact config、environment boundary、thread/process/concurrency counts。
- installed bytes。
- cold load milliseconds。
- peak RSS bytes。
- exact12 per-case latency denominator、aggregate total、p50、p95。
- KNP parseability、nonempty output、source span correspondence。
- surface/token、morphology、lemma/inflection、dependency、PAS proposal availability counts。
- providerが明示したOOV、field omission、warning/error counts。
- original textとNFKC normalized textの差分有無。
- `route_b_owner_disposition_evaluation = NOT_EVALUATED_IN_P0`。
- `route_b_sufficiency_evaluation = NOT_EVALUATED_IN_P0`。
- runtime network attempts count、write-outside-root count、secret count。

### 11.2 PASS conditions

全条件を満たすときだけterminalを次とする。

```text
P0_PASS_EVIDENCE_READY_L3I_NOT_AUTHORIZED_STOP
```

Conditions:

- package/resource/provider/config identityがexactに再現可能。
- checkpoint exact2のlicense evidenceとpublisher integrity evidenceが§5.2のhard gate exact条件を満たし、download後のSHA-256がpublisher digestへexact一致する。
- approved platformでbinary-only installが完了し、source build/system mutationが0。
- measurement network 0、write-outside-root 0、secret 0、private/user input 0。
- exact12すべてがcrash/invalid payloadなしでparseable proposalを返す。
- Route B candidateに必要なsource correspondence / normalization差分、morphology、lemma/inflection、dependency、PAS proposalのcapability evidenceが得られる。provider offsetをoriginal source authorityにはしない。
- providerが明示したwarning、field omission、OOV挙動を事実として記録し、one-bestをformal authorityへ昇格しない。ambiguity truth、owner coverage、Route B disposition、product sufficiencyはP0で判定しない。
- exact evidence fieldsがbody-free resultへlossなく要約できる。

PASSはaccuracy、meaning authority、Product Read、resource adoption、release threshold、production readiness、Cycle acceptanceを意味しない。

### 11.3 Cause-specific STOP

```text
P0_ACTIVATION_PRECONDITION_STOP
P0_ISOLATION_NOT_ENFORCEABLE_STOP
P0_PACKAGE_BINARY_CLOSURE_STOP
P0_RESOURCE_IDENTITY_STOP
P0_LICENSE_OR_PROVENANCE_UNRESOLVED_STOP
P0_ACQUISITION_NETWORK_SCOPE_STOP
P0_OFFLINE_RUNTIME_NETWORK_ATTEMPT_STOP
P0_PLATFORM_OR_RESOURCE_LIMIT_STOP
P0_PROVIDER_OUTPUT_CAPABILITY_STOP
P0_PRIVACY_OR_STORAGE_BOUNDARY_STOP
P0_RESULT_UNKNOWN_STOP
```

terminal exact1。STOP後のretry、fallback、substitution、partial PASS、creditは0。

## 12. Future body-free result reflection

P0 terminal後に許されるpublic reflectionはexact4 pathsまでである。

Create exact1:

```text
Cocolon_前提資料/designs/cmee/CMEE_V1_P0_KWJA251_Base_BodyFree_Result_20260815.json
```

Modify exact3:

```text
Cocolon_前提資料/current_structure/04_cmee_current_structure.md
Cocolon_前提資料/designs/cmee/v1/00_read_first.md
Cocolon_前提資料/designs/cmee/v1/06_implementation_order_migration_and_verification.md
```

Resultはterminal、anonymous counts、package/resource identity/hash/bytes/license、platform、aggregate resource/timing metrics、reason codesだけを持つ。raw parser output、corpus text再掲、private path/identityは持たない。Receipt chain、dashboard、registryを作らない。PRはDraft/open/unmergedを維持する。

## 13. Cleanup, retire, and unknown-result rule

- P0 terminalに関係なく、今回新規作成したexact temp rootを削除する。
- repository、workspace、shared cache、system pathを削除しない。
- cleanup不明は`P0_RESULT_UNKNOWN_STOP`として明示し、自動再実行しない。
- alternate candidate、version、model、resource、task、platformが必要なら、このbodyを流用せず新しいLEVEL_3 technical bodyとMash判断へ戻る。
- L3-R candidate body自体はP0 terminal記録後にretired。monitor、recurring job、standing authorityを残さない。

## 14. Post-P0 boundary

P0 PASS後も別Mash LEVEL_3 `L3-I`が必要である。L3-Iは少なくとも次をexactに固定する。

- direct/transitive versions、wheel filenames/hashes、resource filenames/hashes/license。
- supported platform、installed bytes、RSS、latencyの採否。
- repository path allowlist、requirements/lock、source、test、runner exact paths。
- runtime network/storage 0、I1 STOP、rollback/retire。

L3-I承認前のrequirements/lock/source/test/runner writeは0。I1、Product Read、actual-device、Cycle C0へのautomatic progressionはfalse。

## 15. Forbidden interpretations exact12

1. parser one-best / confidenceをtruthにする。
2. empty ambiguity listをresolvedにする。
3. returned-candidate consensusをcomplete denominatorにする。
4. owner omit / denominator shrinkを許す。
5. ambiguous must-keep ownerを落としてLIMITEDを成功させる。
6. generic/fixed empathy、raw replay、question-onlyをsafe outputにする。
7. original lifecycleで複数round質問する。
8. parser annotationをuserに選ばせる技術質問をする。
9. supplemental answerでoriginalまたは全graphを上書きする。
10. fixture / Product Read / expected textをuser answerやselectorにする。
11. `UNAVAILABLE` / `QUESTION_PENDING` / L3-R / P0をProductまたはCycle PASSへ換算する。
12. GiNZA、別KWJA version/model/task、fallback、mirror、production admissionへ黙示拡張する。

## 16. Joint recommendation and approval token

Joint recommendation:

```text
APPROVE_AS_BOUNDED_EVIDENCE_PACKET
```

理由：Route Bの意味主権を型で閉じ、provider exact1、environment exact1、synthetic exact12、offline measurement exact1へ比例的に限定している。P0はblocker evidenceだけを作り、実装・採用・商品creditへ進めない。

Mashが承認する場合のexact token:

```text
CMEE_V1_L3R_ROUTE_B_TECHNICAL_BODY_V1_APPROVED
```

承認はbody canonical SHA-256 exact1へbindする。tokenの提示がない限り、`P0_execution=0`、GitHub write=0、automatic progression=falseを維持する。
