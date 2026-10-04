# CMEE V1-D / V1-E — Analysis Observed / IF Route 詳細設計

- document id: `cocolon.cmee.v1d_v1e.analysis_route.detailed_design`
- lifecycle: `DETAILED_IMPLEMENTATION_DESIGN_CANDIDATE`
- observed-route runtime state: `SPECIFIC_DEVELOPMENT_API_DEPLOYED`; u102〜u117 content correctionは未配置
- IF-route runtime state: `NOT_IMPLEMENTED`
- Analysis activation: `STORAGE_APPROVED_AND_APPLIED_2026_10_04_JST`; API315f5b5…配置済み、Mashが6201実機確認OKを報告
- API source effect: V2保存・read分岐実装、default off
- DB effect: dedicated table 1 / migration 20261003204421 applied
- production runtime activation effect: 指定開発配置のみ。global cutover/正式公開は未完了
- RN source effect: versioned safe DTO receiver / renderer implemented; 6201送信済み、実機OKはMash報告

---

## 0. Product result

分析構造のCMEE connectionは、期間sourceから現在よく通る自己構造routeを根拠付きで形にし、希望時だけ観測routeとは別identityのIF routeを作る。

```text
period source set
-> event frames and evidence graph
-> evidence-bound observed route
-> protective / burden annotations and unknown gaps
-> text + visual projection
-> ObservedSelfStructureMap

ObservedSelfStructureMap + user-owned branch intent
-> separate HypotheticalScenarioGraph candidate set
-> parallel IF route artifacts
-> optional SavedRouteIntent
```

current Watashi Mapのfixed presentation routeをtruth graphへ昇格しない。IFは未来予測、正解、命令、最適化ではない。

## 1. Activation boundary

**2026-10-04 u117 candidate**（§3.18）：等長の直前期間との比較を、既存の保存・latest/history/detail APIへ接続する候補を実装。両期間の訂正/削除/補足/保持期限を保存・読出しへ反映する。関連173検査・548 subtests、隔離DB58項目、RN13検査、3保存本文の一致を確認。SQLは未適用、比較は既定OFF、u102〜u117未配置。指定API315f5b5…/TestFlight6201実機OKはMash報告として継承する。

2026-10-03 u94更新：latest weekly §6.6〜6.10に沿い、offline source→部分graphに補足の明示引用訂正・撤回と本人向けsafe text／visual projectionを追加した。RNに閉じたDTOのvalidatorと専用renderer、latest／viewerのversion dispatchを実装。合成入力のbackend26検査、実RN componentを使う11検査、旧表示互換2検査PASS。全追加・変更fileの正本は`current_structure/03_analysis_current_structure.md` §4.5。u95で認証済みsaved period loader→ASTOR明示V2生成entryを追加し、13検査＋既存26検査PASS。u96/u97で専用保存と既存API接続を実装し、承認済みtableを実DBへ適用・照合した。稼働API配信・実ユーザー入力での実行・実機は未実施。

専用保存先のMash判断はu96で承認され、§15.1.2の実装・DB適用まで完了した。次は指定API版の開発配置と本人入力から開発画面で読む一往復を進める。原文節を含むprivate previewを公開DTOへ昇格しない。IF／SavedRouteIntent／外部exportはHOLD。以下の旧順序は設計時の履歴であり、Emlis/Pieceの文章品質全体完了をV1-D開始の待機条件に戻さない。

設計時の順序：

1. Emlis V1-A actual proof
2. V1-B Emlis Question operational proof
3. V1-C Piece visual operational proof
4. V1-D observed routeのimplementation / migration approval
5. observed mapのProduct Read / lifecycle proof
6. V1-E IF routeの別implementation / safety approval

設計のみの旧段階を越えてRN/API sourceを変更し、専用DB schemaを適用した。稼働API配置・global cutoverは未実施。

## 2. Source model

`SourceEnvelope`へ入れてよいのはauthentic input materialだけである。

```text
ORIGINAL_INPUT
SUPPLEMENTAL_ANSWER
PERIOD_METADATA
USER_CORRECTION
SIMULATION_SESSION_MATERIAL
```

`PERIOD_RECORD_IDENTITY`は本文を持つ`SourceEnvelope` roleではなく、`AnalysisSourceSet.members[].member_role`のmembership metadataである。record childの`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`だけをmeaning-bearing SourceEnvelopeにする。

period source-set memberはsaved record identityを持ち、そのchild commitmentとして`ORIGINAL_INPUT`とoptional `SUPPLEMENTAL_ANSWER`を別`SourceEnvelope`でfreezeする。question decision / option / skip等のcontrol lineageとEmlis visible bodyはmeaning source 0である。

次はsource roleではなくderived artifact / lineage refである。

```text
AnalysisClaimRef
ObservedSelfStructureMapRef
IfScenarioArtifactRef
SavedRouteIntentRef
```

`observed_analysis_claim`、`simulated_route_material`、`saved_route_intent`をsource namespaceへ戻さない。simulation-session materialはobserved period sourceへ混ぜない。

Analysis lifecycle ownerがDBからowner-authenticated saved recordを取得してrequest-local private materialを渡す。CMEEはsourceをadmitするだけで、DB read policy、DB owner、storage writeを持たない。

## 3. Proposed future module topology

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/__init__.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/source_adapter.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/intent_compiler.py
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/observed_route_realizer.py
```

V1-Eで初めてmaterializeする候補:

```text
ai/services/ai_inference/cocolon_meaning_experience_engine/cores/analysis/if_route_realizer.py
```

event framing、route induction、annotation、period comparisonは`intent_compiler.py`のAnalysis-owned責任として最初のverticalで閉じ、必要性をactual codeで示した場合だけ分割する。第1phaseでIF empty stubを置かない。exact pathはV1-D / V1-EそれぞれのPhase fit-gapで再固定する。

### 3.1 Current owner integration disposition

| Repository | Current / proposed path | V1-D disposition |
|---|---|---|
| mashos-api | `ai/services/ai_inference/astor_material_snapshots.py` | `SAVED_PERIOD_LOADER_IMPLEMENTED_READ_ONLY`: 認証・tier・元入力／補足・生成後再確認 |
| mashos-api | `ai/services/ai_inference/analysis_engine_adapter.py` | `KEEP_MATERIAL_NORMALIZATION_PREIMAGE_ONLY / NOT_GRAPH_ORCHESTRATION_OWNER` |
| mashos-api | `ai/services/ai_inference/astor_self_structure_report.py` | `EXPLICIT_READ_ONLY_V2_ENTRY_IMPLEMENTED`: u95内部preview。保存lifecycleはanalysis_observed_serviceへ分離、cutover未実施 |
| mashos-api | `ai/services/ai_inference/watashi_map_service.py` | `HISTORICAL_V1_GENERATOR / RETIRE_ACTIVE_AT_V1D_CUTOVER` |
| mashos-api | `ai/services/ai_inference/analysis_report_validity_gate.py` | `KEEP_PUBLISH_VALIDITY_GUARD / NOT_MEANING_OR_ROUTE_AUTHORITY / EXTEND_FOR_V2_IDENTITY` |
| mashos-api | `ai/services/ai_inference/api_analysis_reads.py` | `MUST_MAP_BEFORE_CUTOVER`: tier / access / unread / refresh semanticsを保護 |
| mashos-api | `ai/services/ai_inference/api_analysis_reports.py` | `MUST_MAP_BEFORE_CUTOVER`: report familyとのversion / identity境界を固定 |
| mashos-api | `ai/services/ai_inference/api_self_structure.py` | `IMPLEMENTED_DEFAULT_OFF`: latest/status/monthly V2保存read分岐 |
| mashos-api | `ai/services/ai_inference/analysis_observed_service.py` / `report_artifact_read_service.py` / `api_report_reads.py` | `IMPLEMENTED_DEFAULT_OFF`: immutable保存、safe読取、旧履歴統合、unread同一ID |
| mashos-api | `ai/services/ai_inference/api_self_structure_reports.py` | `DELEGATES_TO_UPDATED_READ_SERVICE`: existing route/response shape保持 |
| Cocolon RN | `components/selfStructure/WatashiMapRenderer.js` | `KEEP_HISTORICAL_V1_READ_RENDERER` |
| Cocolon RN | `components/selfStructure/watashiMapFormatters.js` | `KEEP_V1_FORMATTER / DO_NOT_INTERPRET_V2_AS_V1` |
| Cocolon RN | `screens/AnalysisSelfStructureScreen.js` | `REVIEWED_EXISTING_CALLER`: v2受信はgenerate／viewer側 |
| Cocolon RN | `screens/AnalysisContentFirstScreen.js` | `REVIEWED_EXISTING_EMBEDDED_GENERATE_CALLER` |
| Cocolon RN | `screens/analysis/useAnalysisSelfStructureActions.js` | `MUST_MAP_BEFORE_CUTOVER`: generation / refresh / navigation actionをV2 identityへ接続 |
| Cocolon RN | `screens/SelfStructureReportGenerateScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: 有効DTO／許可modeのみ既読。API source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportViewerScreen.js` | `VERSION_RECEIVER_IMPLEMENTED`: private／未知／不正JSONを旧本文へ戻さない。保存identity lifecycle source接続済み・稼働未配置 |
| Cocolon RN | `screens/SelfStructureReportHistoryScreen.js` | `EXISTING_UUID_READER_REUSED`: V2 UUIDを同じhistory/detailで使用 |
| Cocolon RN | `components/selfStructure/watashiMapAccessPolicy.js` | `KEEP_ACCESS_OWNER / VERIFY_SAFE_V2_PROJECTION` |
| Cocolon RN | `lib/compat/legacyWireContracts.js` | `MUST_MAP_BEFORE_CUTOVER`: v2をv1 aliasへsilent変換しない |
| Cocolon RN | `components/selfStructure/WatashiMapV2Renderer.js` | `IMPLEMENTED_SAFE_V2_RENDERER_SOURCE_ONLY` |
| Cocolon RN | `components/selfStructure/watashiMapV2Contract.js` | `IMPLEMENTED_CLOSED_DTO_AND_TEXT_GRAPH_MODEL` |
| Cocolon RN | `components/selfStructure/WatashiMapRouteGraph.js` | `NOT_MATERIALIZED`: 現段階のgraphはV2Renderer内。分割の必要性待ち |
| Cocolon RN | `tests/analysis-watashi-map-v2-contracts.test.js`、`tests/fixtures/analysis-watashi-map-v2-synthetic.json` | `IMPLEMENTED_SYNTHETIC_BACKEND_TO_RN_TEST` |

V1-D Phase fit-gapはfresh caller / writer / reader graphとexact filenamesを再確認し、上表からのdeltaをapprovalへ出す。V1-EのIF source、storage、API、RN filesは別approvalまでmaterialize 0である。

### 3.2 u94 implementation limits

引用付き補足の対象occurrenceは親recordの完全節へ一意にbindし、元の主体／伝聞／疑問scopeを検証してから集約前に撤回・置換する。answerのnew clauseは元answerのfield/hash/scalar/byteを保持するparser viewで、派生文を新sourceにしない。元の否定・願望は置換へ継承しない。未解釈の補足は期間全体をUNAVAILABLEとする。

safeラベルは格を持つ名詞項と有限述語の型から再構成する。現段階は9動詞と限定名詞grammarの明示本人節のみで、任意の修飾／時点接頭句／複文は未対応。意味を削ってsafe化しない。生成不可を将来のlifecycle callerが扱う必要がある。annotations／conflict／期間比較と順序線のpositive cohortは未完了。

safe projectionは認証された本人向けのSELF_ONLY商品表示で、匿名telemetryではない。意味項としてsource-bound名詞を保つが、原bodyやprivate source/evidence識別子は含めない。unknown／注記／競合は対象refを保持して図と文章へ出し、ラベルだけの重複排除で対象を消さない。端末側のtier検査は認証・server access policyの代用ではない。

### 3.3 u102 通常補足と同一意味の集約

既存intent_compiler内で、引用訂正/撤回以外の通常補足も、共有semantic frameと既存の完全節grammarが全文を解釈できる場合に採用する。元回答のexact scalar evidenceが全文を覆うことを確認し、未解釈/訂正混在を部分採用しない。親recordを同じ一機会とし、質問/生成文はsourceへ入れない。矛盾する同一候補の記述はどちらかへ決めずUNAVAILABLEを保持する。

同じSELF主語・格/名詞・述語・極性・modality・時点は、格の語順や丁寧語の違いで分割しない。全evidenceを保持し、record件数と共起は独立記録を基準にする。関係・順序・原因を追加回答から推測しない。既存26＋追加7＝33検査PASS、合成生成本文3組を確認。通常日本語全般/複数補足/annotations/期間比較/IFの完成ではなく、API/DB/DTO/RN契約は不変。

### 3.4 u103 明示された記録内順序の限定実装

既存有限節の接頭辞「その後」「それから」を型と元evidence位置に保持する。同一source/fieldに隣接する完全SELF過去fact節で、間が文末区切り/空白だけの場合に限りOBSERVED_ORDERを作る。接続語もsafe表示で区別する。否定を保持し、希望は行動順序にしない。単なる列挙/共起/保存時刻は順序の根拠にせず、因果関係を表示しない。

順序の両端はevidence occurrenceで区別し、A→B→Aを3node/2edgeとして保つ。別recordの順序は集約せず、順序外の同一意味集約だけをu102から継承する。未解釈の中間節、別field/source、元入力と補足、撤回/置換箇所を橋渡ししない。通常補足内で成立する順序は元answerの出典へbindする。成立pairの不足表示だけを解消し、接続先不明はunknownのまま。

§3.2の順序positive未完了をこの限定範囲で更新する。vertical42/storage10/saved period13/API6＝71 PASS、A→B→Aの保存・再読取と既存RN contract/view modelの本文一致を確認。新規API/DTO/DB/RN契約なし。一般時点表現/任意複文、複数記録での反復route解釈、annotations/conflict/期間比較/IFは未完了。未配置sourceの技術成立であり、正式商品受入れではない。

### 3.5 u104 今日/昨日のsource-bound解釈

既存の完全SELF有限節に付く単一接頭辞「今日」「昨日」を、relative_dayとsource_partsへ保持する。有限述語のpast/current_input、極性、fact/wishを上書きせず、「昨日＋現在の希望」は保留する。safe表示は「この記述時点の今日/昨日」とし、閲覧当日や推定した年月日に変換しない。

日語付き観測はsource envelope＋明示日で分離し、同一source/同日の文法上同一内容だけをu102方式で集約する。順序参加節はu103のoccurrence分離を優先する。原入力のcreated_atを補足の記述日時へ流用しない。原入力と回答では異なる日語でも同じ実日を指す可能性があるため、対立する候補を日語だけで通さない。同一回答内の明示今日/昨日だけは別日として区別する。

日語だけから順序edgeを作らず、後続節へ日を暗黙継承しない。引用訂正/撤回は日語を含む完全節へbindし、置換後の日は回答出典から解釈し直す。vertical50/storage11/saved period13/API6＝80 PASS、RN契約とbackend本文の一致を確認。§3.2の時点未対応をこの限定範囲で更新する。一般日時、主語後の日修飾、複数修飾/複文、annotations/conflict/比較/IFは残る。契約変更なし、source未配置。

### 3.6 u105 可能性の補文と現在の認識host

共有Stage1の_source_current_cognition/_partsが認定する現在の認識のうち、明示SELF・背景なし・可能性補文・現在の思う/考えるhostをAnalysisへ接続する。共有parserの広い文字列slotをそのままsafe化せず、内側も既存9動詞と格付き名詞grammarで完全に解釈する。補文限定inventoryは同じ動詞の過去/否定過去と辞書形/否定形を扱い、主文grammarは拡張しない。

内部possible_contentはactor=UNSPECIFIED、modality=possibilityであり、省略された行為主体を本人と推測しない。外側はSELF・neutral/fact/current_inputの認識で、ATTENTION_OR_THOUGHTとして表示する。内側の否定・時制・対象と外側hostの継続/非意図性を集約とsafe表面へ保ち、実行済み事実や結果へ昇格しない。内側過去形から順序edgeを作らない。

認定済み認識の完全範囲だけを可能性拒否の例外にし、同fieldにある別の確定行動を失わない。未認定/未解釈の可能性scope、他者・引用・条件・否定/過去hostは保留する。通常補足は全文解釈を要求し、引用訂正/撤回では外側/内側の旧scopeを置換後へ継承しない。補足が単なる可能性なら、元の確定記述を勝手に訂正せず別の考えとして保持する。

vertical58/storage12/saved period13/API6＝89 PASS、既存RN契約との文章一致を確認。保存serializerのallowlistと閉じたDTOは変更せず、旧artifact読取を再解釈しない。一般認識/過去host、任意の補文、場面/役割/結果の接続、annotations/conflict/比較/IFは残る。新規owner/契約/配置効果なし。

### 3.7 u106 現在の未成立結果

共有_final_source_unfinished_result_nucleiが認定する単一memo完全節を消費する。explicit/explicit_current_input/required/event、negative/fact、現在の時点、present_unfinishedのmarker、部分投影/依存関係なしを揃え、同共有完全節helperとAnalysisの既存名詞/の連結・は/が/も・見つかる/決まる/定まるの現在否定状態の解析を両方要求する。疑問名詞、未解釈接頭辞/修飾/複文、過去/肯定/二重否定/引用/伝聞/条件を切り落として通さない。

actorはUNSPECIFIEDであり共有frameのcurrent_user既定値を本人の行為へ昇格しない。result_state=NOT_YET、名詞/助詞、否定、current_inputと元scalar/UTF-8証拠を保持し、IMMEDIATE_RESULT_OR_AFTERMATHへ接続する。safe表示は「まだ〜っていない（この記述時点）」。未実行・失敗・原因・順序・永続的不可能を作らず、解釈可能な結果だけを不足表示から除く。

集約は同じ内容の丁寧語だけを束ね、助詞/名詞/述語を区別。通常補足/訂正/撤回と元出典を既存経路で保持。期間内の共起は無方向、現在結果を過去行動の順序へ混ぜない。保存serializerとDTOは変更せず、内部型は非公開。vertical65/storage13/saved period13/API6＝97 PASS、合成6本文と既存RN本文が一致。共有ownerの変更0、未配置。一般結果・場面/役割・複文/比較/IFの完成ではない。

### 3.8 u107 過去行動の後の有限変化

同一memo spanの完全なSELF過去行動＋後/あと（に）読点＋名詞の有限変化に限定する。共有Stage1のaction/change 2核、explicit/required/explicit_current_input・fact/past、action_before_change、source_fragmentのexact範囲とrequired user_stated_relation/typed_projection:perfective_action_before_bounded_changeを要求する。同じmarkerは夢/伝聞の長いhostにも付くため、全文を両端と接続語で完全に解釈できなければaction片側も採用しない。

左端は既存の有限動詞/格と明示SELF、肯定の過去factだけ。右端は既存名詞/の連結・は/が/もと減った/増えた/変わった/戻ったを型付けし、result_state=BOUNDED_CHANGE、actor=UNSPECIFIED、positive（文法上の肯定）/fact/pastとして結果nodeへ置く。名詞の所有者を本人と補わず、増減を改善/悪化と評価しない。両端の疑問名詞（何/誰/幾）は保留。safe labelは「疑問が減った（記録された変化）」等に再構成する。

shared action_supports_changeを因果として輸入せず、実際の後接続を根拠に既存OBSERVED_ORDERだけを作る。接続語を含む元の全文evidenceをedgeへ加え、各端点もexact scalar/UTF-8/hashを維持する。両端をoccurrenceとして分離し、反復した行動を一つにまとめない。通常補足は両端の解釈成立時だけconnectorを含む全文を被覆する。訂正/撤回は元の完全な2節span全体を対象にし、部分引用へ広げない。置換後の証拠は回答原文へ戻す。

vertical71/storage14/saved period13/API6＝104 PASS、合成6本文と既存RN表示が一致。保存DTO/serializer、API/RN/共有ownerを変更せず旧artifactを再生成しない。たら/てから/3節、右端feeling、否定行動のpair、共有側が2核化しない進んだ、一般日本語/比較/IFは対象外。u106/u107は当初の自動審査停止後、Mashの明示公開許可を受けPR3/PR30へ反映・照合済み。新規owner/契約/配置効果なし。

### 3.9 u108 「てから」の依存時制と完全な過去結果

既存9動詞のte活用（書いて/調べて/試して/見て/作って/残して/記録して/メモして/続けて）は、通常の主文_propositionには加えない。専用の内部解析ではtemporal_scope=dependentとして、原文のte形・格・明示SELFと全source partsを保持する。原文を過去形へ置換した仮想証拠を作らない。

_action_change_pairでu107の共有2核/required typed relation/exact範囲と、右端の4述語のpast fact、実際のから接続を全て確認した場合だけ左端をpastへ束縛し、private dependent_form=TE_BEFORE_PAST_CHANGEを付ける。各consumerはfragmentから同じ解釈を受け取り、単独teの再解析で意味を作り直さない。safe側はte原文の再解析に加え、その行動からpastの結果へ向かうOBSERVED_ORDERと、同一envelope/field/spanの両端およびexact全文evidenceを要求する。marker単独、別記録、順序なしでは実行済み表示へ変換しない。

補足全文の被覆、全文引用訂正/撤回、元回答座標と反復occurrenceをu107経路で維持。単独teへの置換は旧結果を返さず保留。夢/3節/非過去/否定/他者/疑問名詞を切り落として通さない。未対応の願望は既存private ATTENTIONが残り得るが、実行済み行動・順序・safeラベルとして出さない。従属形は意味上の別の出来事を増やす集約keyにはせず、既存のevidence occurrenceで区別する。

vertical76/storage15/saved period13/API6＝110 PASS。6合成本文と既存RN本文が一致。新private fieldはserializerのallowlistから外れ、保存DTO/API/RN/共有ownerの変更なし。既存「てから」拒否1例は今回のpositive cohortへ移し、他の保留期待は維持。未配置。たら/3節/右端feeling/一般場面/役割/比較/IFの解釈は未完了。

### 3.10 u109 行動後の過去感情

既存の共有action/change完全pairを消費する同じcompiler/realizer内で、右端の安心した/安心しました・落ち着いた・嬉しかった/うれしかったを有限形として解釈する。明示本人主語はSELF、省略主語はUNSPECIFIEDを保つ。Analysisの結果型はPAST_FEELING/feeling/past。共有側で安心はfact、他3lemmaはfeelingとなるwitnessを正確に照合し、一律factへ変更しない。

元全文2核・required relation・exact範囲・明示接続の条件を維持する。safeラベルは型から「〜（記録された気持ち）」と再構成し、本人の実行、改善/悪化評価、原因へ昇格しない。te形の実行表示は同一source/field/spanの自身の順序線と右端過去結果・元全文証拠が必要。PAST_FEELINGは既存結果nodeへ投影する内部型で、公開DTO/DB/RN契約へfieldを追加しない。

補足全文、全文引用訂正/撤回、反復episode、保存後の再生成なしを既存経路で維持。共有未認定形（ほっとした/落ち着きました）、程度修飾、否定、夢/伝聞/推測、単独感情、たら/3節はこの解釈を許可しない。関連116検査・6合成出力の既存RN本文一致を確認。一般感情理解・商品受入れ・稼働配置は未完了。

### 3.11 u110 明示された本人の過去の所在

既存compiler/realizerで「私/僕/わたし/自分は＋既存名詞句＋に＋いた/いました/いなかった/いませんでした」の完全節だけをSCENEへ接続する。内部scene_state=PAST_PRESENCE、actor=SELF、modality=fact、time=pastを保つ。共有側はrequired/explicit/current_input scope、memo単独span、event predicate/current_user/fact、肯定neutralまたは否定negative、past/current_input時制が必要。fragment/range/dependency付き核は対象外。shared actor既定値やni格単独から所在を推論しない。pastは全文有限形から読む。

ledgerの全文span一致に加え、parser field上の前後が句点/改行/field端に接することを確認する。72字超の読点・固定長分割や関係prefixで切られた断片を、夢/修飾から独立した事実にしない。全文訂正時のparser viewは既存の対象証明を継承し、証拠scalar/UTF-8は原回答のまま保つ。

表示は「職場にいた／いなかった（記録された場面）」等を型から再構成。行動・勤務・所属・役割・因果は補わない。後続する本人過去行動の「その後/それから」は既存明示順序の条件だけで接続する。通常補足の完全解釈、同じ所在の反対極性の保留、全文訂正/撤回、独立記録件数、保存後の再生成なしを維持する。公開DTO/DB/RNに内部型を追加しない。

今日/昨日/その後付き所在、現在/未来/願望、他者/疑問名詞/夢/引用/伝聞/推測/未解釈修飾、memo_actionは対象外。ROLEは未実装。関連124検査・305 subtests、6合成本文の既存RN一致を確認。一般場面理解・商品受入れ・稼働配置は未完了。

### 3.12 u111 明示された本人の過去の担当

既存compiler/realizerで「私/僕/わたし/自分は＋既存名詞句＋を＋担当した/担当しました/担当しなかった/担当しませんでした」を完全解釈し、内部role_state=PAST_RESPONSIBILITY、SELF/fact/pastと正負をROLEへ投影する。担当関係は述語が根拠であり、名詞の職業/肩書き分類表や「私はNです」から推測しない。safe表示は「〜を担当した／担当しなかった（記録された担当）」で、恒久身分・能力・責任感・担当対象の実行完了を補わない。

u110の共有generic event witnessと文境界処理を共通化。explicit/current_input claim scope、memo単独span、event predicate/current_user/fact、対応する極性、past/current_input時制、fragment/dependencyなし、完全な本人有限節と元scalar/UTF-8証拠が必要。ROLEだけretention=required/shouldを許可する。共有保持ownerは4節以上で普通の明示本文をshouldへ下げており、grounding/claim scope/certaintyとは独立している。共有retentionを書き換えず、optional断片は拒否し、SCENEのrequired条件も変えない。

場面/役割/考え/行動/結果を同じ記録から残しても、段階の順序を自動生成しない。後続「その後/それから＋本人過去行動」や既存action/change pairだけが既存の明示順序へ接続する。補足全文・同じ担当の反対極性保留・全文訂正/撤回・独立記録件数・正負別node・保存後の同一文章/図を維持。内部型はDB/公開DTO/RNへ追加しない。

前置時点、現在/未来/願望/可能、他者/疑問/引用/伝聞/推測/夢/未解釈修飾、memo_actionは対象外。「記録を担当した」のような名詞keyword由来のshared actionも今回保留。関連129検査・359 subtests、6合成本文の既存RN一致を確認。一般ROLE理解、注記/比較/IF、商品受入れと稼働配置は未完了。


### 3.13 u112 同じ原入力内の肯定・否定と未確定な機会

既存のconflict_badges契約へ、同じ原入力source/field/相対日にある、完全命題が同じSELF過去factの正負を接続する。対象は既存SCENE/ROLE/ACTION_OR_NONACTION。元の記録を同じ機会だと断定せず、真偽を選ばず、両nodeを対象とした未確定表示にする。別record/field/day/対象、明示順序参加、接続語、従属形、願望/認識は除外する。通常補足の正負不一致は従来どおり保留し、引用訂正/撤回の除外を比較より先に適用する。

ObservedConflictはtarget_refs・exact evidence_refs・閉じたreasonを持つAnalysis内部型。private保存は証拠位置とhash等のallowlistだけで、原文/名詞/propositionを加えない。safe DTOは既存conflict_ref/target_refs/visible_labelだけ。本文は同じDTOから組み、既存RNと一致させる。保存validatorは非空badgeの形・2対象・重複・表示文を確認し、旧空badgeの読取時再生成は行わない。DB/DTO/RN契約変更なし。

135検査・379 subtestsと既存RN11検査PASS、6合成出力の同じ本文/identity/順序/badge件数を確認。Auth/DB I/Oは合成で、今回の修正版は未配置。§3.2のconflict未接続をこの限定範囲で更新する。一般的矛盾・注記・期間比較・IFの完成ではない。

### 3.14 u113 希望と明示された現在負荷の非連続注記

§8のSOURCE_EXPLICIT_ANNOTATIONを最小範囲で接続。既存願望grammarのSELF/current/positive/wishと、明示SELFのつらい/苦しい（です形含む）が一文で対比される場合に限る。shared exact2、finite contrast feeling、contrast relation、元文の完全境界と接続語を照合する。negative極性だけで負荷を推測しない。負荷をroute node/順序edge/因果へせず、対象の希望nodeにBURDENを付ける。

Analysis内部ObservedAnnotationは対象、原文両端と対比全文の3 evidence、SOURCE_EXPLICIT_ANNOTATION、原因/継続期間の未確定、禁止昇格、更新refを保持する。同一対象/同一述語のbadgeは集約するが各source証拠を残す。型付き負荷核だけを消費し、他の未知scopeを消さない。通常補足の全文coverageと全文訂正/撤回へ同じ完全pair証明を使う。撤回されたsourceだけを除外し、別記録の注記を消さない。

safe DTOは既存annotation_ref/target_ref/kind/visible_labelのみ。原節/述語/対象/3証拠を照合して表示文を再構成し、既存RNと同じ順で本文へ含める。private保存はraw/source_labels/predicate_lemmaを含めない。保存validatorはBURDEN/既存thought対象/閉じた表示文/重複/shapeを確認し、旧空注記も読取時再生成しない。DB/DTO/RN契約変更なし。

関連143検査・447 subtests、既存RN11、6合成本文/identity/注記target一致。Auth/DBは合成、未配置。PROTECTIVE・解釈仮説・一般の負荷理解・期間比較・IFは対象外。複数記録で重複する既存未確定表示は別の具体的改善候補として残す。

### 3.15 u114 同一未確定表示の期間集約

同じnodeへ集約された複数記録から、対象/不足範囲/理由が同じ未確定項目を繰り返し表示しない。ObservedGraphとprivate保存は全gapを保ち、生成時のprivate/safe projectionだけで順序付きbetween_node_refs・missing_scope・reason_codeの完全一致を初出gap_refへまとめる。ラベルだけのdedupeは禁止を維持し、別対象・別理由・対象順の差を消さない。

safe DTOの構造、文章/図の単一artifact、元の証拠と記録件数を変更しない。_text_from_visualや保存readへこの集約を適用しないため、旧保存artifactは旧本文/DTO/identityのまま読める。欠番のあるgap_refは既存API/RN contract内。原graphの再解釈、旧保存の書換えは行わない。

2記録の同じ希望でvisible8→4/private8保持を確認。別対象/未読内容、理由/対象順、新規保存再読取、旧保存互換を含め関連148検査・447 subtests、既存RN11 PASS。新規3＋旧保存形式1の本文/identity/unknown対象をRNと照合。Auth/DBは合成、修正版未配置。§3.14で残した重複表示の不足をこの範囲で解消する。

### 3.16 u115 明示された現在の保護意向

明示SELF（私/僕/わたし/自分）は＋既存名詞句＋を＋守りたい/守りたいですを全文解析する。共有explicit/current-input/requiredまたはshould、wish nucleus、current_user/positive/wish/current_inputとoperator:wishを要求。共有predicate_kindはwish、または名詞「気持ち」等でoperator:feelingも存在するfeelingに限定する。文の一部、他者発言/伝聞/夢の未解決な帰属、否定/過去/推測/未解釈修飾/複文、memo_actionからこの意向を作らない。共有意味ownerや一般の守る活用文法は変更しない。

希望nodeと同じ全文証拠でPROTECTIVE / SOURCE_EXPLICIT_ANNOTATIONを作り、対象別に集約して全記録と更新refを保持する。原文にない保護成果、他の行動の動機、原因、性格、診断、route順序へ変換しない。通常補足と完全引用訂正/撤回は既存のsource更新を通し、撤回された原spanを再利用しない。

safe表示は対象nodeを「家族を守ることへの希望」等、注記を「守りたいという意向の記録です。実際に守れているかは確定していません。」とする。RN見出しは「守る対象」。realizerは対象の完全希望形・意味・同一全文証拠、保存validatorは希望対象と規定表示を照合する。既存4key annotation DTO、単一artifactの文章/図、private evidence分離、旧保存readを維持。別対象のBURDENとの共存は可能だが、一般的な保護行動や複文の保護意向の解釈は未実装。

関連156検査・509 subtests、RN12 PASS。6合成本文の全文読取とbackend/RN本文・identity・node順・注記target照合、実生成→合成RPC commit→再生成なしreadを確認。Auth/DB I/Oは合成、修正版未配置。一般の注記/期間比較/IFの完了や商品受入れへ換算しない。

### 3.17 u116 同じ条件の二期間を比較する開発preview（当時の履歴）

内部AnalysisObservedMapRequestにoptional comparison_previous_requestを追加し、既存engine.generate入口で同じruntime/policyの現在/前期間を独立生成する。生成済み保存本文/DTOや旧policyのartifactを入力として再解釈しない。別owner、入れ子比較、不正/空/安全に表示できない前期間は拒否/UNAVAILABLE。現在artifactを初めて外へ返す前に§9.1のtyped PeriodComparisonをinline保持し、前artifactもprivate outcome.previous_artifactへ保持する。既存公開DTOへ前artifact ref/source locatorを流さない。

COMPARABLEはUTC正規化した等長の直前隣接半開区間に限定。長さ違い、逆順、重複、非隣接、同一included record identityの再使用はNOT_COMPARABLE・理由あり・change_claims0。changeは既存4kind、両artifact/source-set refと差分を支えるevidence IDを持つ。nodeは命題の対象/格/述語/型/極性/様相/時制/相対日・明示接続、edgeは方向付き順序または無方向共起、注記はkind/対象意味/述語、不一致は対象意味集合を比較する。ID、source位置、丁寧形、成立pastへ解決済みのte依存形、記録件数差そのものを差分にしない。

unknownは仮anchorや表示用の隣接pairから偽差分を作らず、不足scope/reasonの種類集合に限定する。明示先行欠落だけは実際にその記述へ結び付くため対象意味も比較する。原graphの対象/全証拠は保持し、未読内容全体や反復頻度を比較済みとはしない。差分なしの説明は「今回比較した記述内容では差分を検出していません」とし、本人の状態が不変とは言わない。差分ありも記録上の違いとし、改善/悪化/原因/達成へ変換しない。

ASTOR既存prepare_saved_analysis_observed_mapは任意の前期間boundsを同じauth/report_modeで読み、両source snapshotを既存recheckで再確認してからsafe本文/DTOを返す。これは認証付きread-only開発entryで、公開HTTP routeや保存writerを追加しない。RNは既存比較3keyの4kind/理由をカードと同一本文へ表示。NO_PREVIOUSでは旧本文を変えない。

関連166検査・541 subtests、RN13 PASS。両期間の原入力/補足/権限変化で結果を保留し、6合成本文のbackend/RN一致を確認。Auth/DB I/Oは合成、未配置。現在の保存guard/read/無効化は当該一期間だけを守るため、保存validatorのNO_PREVIOUS限定は維持する。比較の永続保存/API接続には前期間の訂正/削除/期限切れも反映する依存処理が必要であり、previewの二度読みで保存競合を閉じたとは扱わない。

### 3.18 u117 比較のimmutable保存と既存APIへの接続候補

既存analysis_observed_artifacts一表のまま、直前等長期間を内部導出するcomparison_snapshot RPCを追加。単一statementで両source集合を取得し、両guardを比較専用namespaceへ結合する。既存commitは元のREAD COMMITTED/auth→source table lock内で再確認、readは両期間の鮮度・tier・保持期限を確認し保存済本文を返す。無効化triggerは前期間の原入力/補足の追加・変更・削除も対象にする。旧単期guard/行/RPC署名/public DTOは維持する。

private-evidence.v2はcurrentのallowlisted graph/source_membersにcomparison_dependencyとtyped比較、previous_evidenceをinlineで加える。前artifact/source-set参照を同一行で解決でき、原文/命題/visible labelをprivateへ追加しない。current/previousの公開投影を混在させず、API/RNは既存比較3keyだけを扱う。空前期間はNO_PREVIOUSでも依存を保持し、後日追加で失効する。前期間に実記録があるが生成不能の場合は失敗を保つ。

前期間だけが保持期限外のときは明示comparison_eligible=falseとし、現在の単期分析を利用可能にする。保存済比較の期限切れはguard不一致で非表示。一般の認可/通信/生成エラーから単期へfallbackしない。等長計算はUTCに限定し、既存単期guardのsession timezone契約は変更しない。

serviceの比較生成flagはCOCOLON_ANALYSIS_PERIOD_COMPARISON_MODE、developmentだけ有効、既定off。新migration20261004041627は未適用で、稼働DB/API/端末への効果0。対応SQL→対応API→有効化の順で個別対象の判断が必要。flag offは新規比較生成の停止で、旧API版の比較read互換を保証しない。関連173検査・548 subtests、隔離PGlite58項目、RN13検査、3保存本文の一致を確認。live DBや独立同時接続での競合・実機の商品受入れは未検証。全file/責務はcurrent03 §4.23、実行記録は06/API handoff末尾u117。

## 4. Period source-set freeze

`AnalysisObservedMapRequest`:

```text
request_id
authenticated_owner_scope
period_start / period_end
members[]:
  saved_record_ref
  saved_record_version
  member_role = PERIOD_RECORD_IDENTITY
  source_commitment
  inclusion_status
  inclusion_or_exclusion_reason
  child_source_envelope_refs[]:
    ORIGINAL_INPUT exact1
    optional SUPPLEMENTAL_ANSWER exact1
source_set_version
dedupe_policy_version
comparability_policy_version
analysis_policy_version
locale = ja-JP
```

source adapter minimum duties:

- same-owner entitlement
- period inclusion / exclusion reason
- record version freeze
- duplicate detection
- source ordering evidence
- privacy class
- conflict / missing source preservation
- Piece / Emlis bodyとsimulation outputのsource mixing拒否

`members[]`はparallel arrayにせず、record identity / version / membership role / commitment / include-exclude reason / child envelope refsを一objectへ束ねる。`PERIOD_RECORD_IDENTITY`はSourceEnvelope roleではない。included recordのoriginal / supplemental childだけを別meaning-bearing SourceEnvelope refとして持つ。

一件の記録を傾向へ昇格しない。record countだけでroute edgeを作らない。

## 5. Event frame

各recordから次のtyped frameを作る。

```text
scene
role
attention_or_thought
action_or_nonaction
immediate_result_or_aftermath
participants
temporal_scope
polarity / modality
unknown fields
source evidence refs
conflict refs
```

欠けたstepをfixed labelやgeneric resultで補わない。partial frameはvalid resultである。

## 6. `GroundedMeaningGraph` and `HypotheticalScenarioGraph`

`GroundedMeaningGraph`はsource-grounded observed / derived / user-confirmed / user-corrected / unknown / conflictだけを持つ。

```text
epistemic_state:
  SOURCE_EXPLICIT
  FORMAL_DERIVED
  USER_CONFIRMED
  USER_CORRECTED
  UNKNOWN
  CONFLICT
```

IFは別graphである。

```text
HypotheticalScenarioGraph
  scenario_graph_id
  scenario_graph_version
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  scenario_nodes[]
  scenario_edges[]
  unmodelled_factors[]
  status
```

observed graphをIF nodeでmutationしない。IF graphのstepはoriginを必須とする。

```text
OBSERVED_ANCHOR
USER_CHOICE
SIMULATED_EXTENSION
UNKNOWN
```

## 7. Observed route model

### 7.1 Path nodes

Observed route pathのnode kindは次だけである。

```text
SCENE
ROLE
ATTENTION_OR_THOUGHT
ACTION_OR_NONACTION
IMMEDIATE_RESULT_OR_AFTERMATH
```

protective、burden、unknownはpath nodeへ混ぜない。

### 7.2 Observed edges

```text
OBSERVED_ORDER
REPEATED_COOCCURRENCE
```

- `OBSERVED_ORDER`: same-record等のexplicit order evidenceがある。
- `REPEATED_COOCCURRENCE`:複数sourceで一緒に現れるが、direction / causalityを主張しない。

共起を矢印因果へ変換しない。

`SOURCE_EXPLICIT` / `FORMAL_DERIVED` claimと上記edgeにはexact evidence refsを必須とする。evidenceなしobserved claimを`UNKNOWN`で代替しない。

### 7.3 Unknown gap

`UNKNOWN_GAP`は別identityで、次を持つ。

```text
gap_id
between_node_refs[]
missing_scope
reason_code
source_set_ref
```

unknownはobserved factではなく、足りない範囲を示す非矢印markerである。

## 8. Protective / burden annotations

protectiveとburdenはroute pathではなくnon-sequential annotation claimである。

```text
AnalysisAnnotationClaim
  annotation_id
  kind = PROTECTIVE | BURDEN
  target_node_or_edge_ref
  annotation_state = SOURCE_EXPLICIT_ANNOTATION | EVIDENCE_BOUND_INTERPRETIVE_HYPOTHESIS
  evidence_refs[]
  uncertainty
  alternative_explanations[]
  forbidden_promotions[]
```

direct source statementとinterpretive hypothesisを分ける。`INTERPRETIVE_HYPOTHESIS` edgeはannotation graphだけに存在し、observed route edgeへ入れない。

## 9. `ObservedSelfStructureMap`

```text
ObservedSelfStructureMapPayload
  kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  wire_kind = watashi.map.v2
  source_set_ref
  period
  route_graph
  annotation_claims[]
  unknown_gaps[]
  conflict_refs[]
  comparison_availability = NO_PREVIOUS | COMPARISON_PRESENT
  period_comparisons[] = exact0..1, canonical payload内へinline
  text_projection_ref
  visual_projection_ref

ObservedSelfStructureMap = GenerationArtifactBundle<ObservedSelfStructureMapPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_OBSERVED_SELF_STRUCTURE_MAP
  epistemic_partition = OBSERVED
  semantic_graph_ref
  experience_plan_ref
  primary_artifact = ObservedSelfStructureMapPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

各period artifactは別identityである。latest pointer、history item、detail、text、graphは同じcanonical `artifact_id@version`へresolveする。comparison objectも同じimmutable stored artifactに含め、別のunresolved private locatorへ逃がさない。

### 9.1 Period comparison

```text
PeriodComparison
  comparison_id
  current_artifact_ref
  current_source_set_ref
  previous_artifact_ref
  previous_source_set_ref
  comparability_state = COMPARABLE | NOT_COMPARABLE
  reason_codes[]
  change_claims[]:
    change_kind = ROUTE_EVIDENCE_CHANGED
                | ANNOTATION_EVIDENCE_CHANGED
                | UNKNOWN_SCOPE_CHANGED
                | CONFLICT_STATE_CHANGED
    current_ref
    previous_ref
    evidence_refs[]
```

`NOT_COMPARABLE`では`change_claims` exact0、reason exact1以上とする。`COMPARABLE`でも差分を改善、悪化、原因、達成へ自動昇格しない。

previous artifactがない初回は`comparison_availability=NO_PREVIOUS`、`period_comparisons` exact0とする。safe projectionも`NO_PREVIOUS`を明示し、架空のprevious / change claimを作らない。

## 10. IF route

### 10.1 Request

```text
AnalysisIfRouteRequest
  base_observed_map_ref
  base_route_ref
  branch_point_id
  branch_intent_source_ref
  constraint_source_refs[]
  requested_candidate_count = 1..3
  analysis_if_policy_version
```

branch point / intent / constraintが足りない場合、Analysis ownerが`ClarificationRequest`を決める。Emlis question policyを流用しない。answerはsimulation-session sourceであり、period observed sourceへ入れない。

### 10.2 Scenario candidates

Analysis ownerはmeaningの異なるscenarioを1–3含む`IfScenarioCandidateSet`をexact1作れる。

- candidate間をsuccess / improvement / likelihoodでrankしない。
- best routeを自動選択しない。
- 1–3を並列提示する。
- required conditions、frictions、unknown、unmodelled factorsを表示する。
- result probability、future guarantee、optimality scoreを生成しない。

CMEE comparatorが選べるのは、同じscenario graphの`RealizationCandidateSet`だけである。意味の異なるscenarioをsurface qualityで一つへ選ばない。

### 10.3 IF scenario set artifact

```text
IfRouteSimulationPayload
  kind = ANALYSIS_IF_ROUTE_SIMULATION
  wire_kind = watashi.if-route.v1
  scenario_artifact_ref
  base_observed_map_ref
  base_route_ref
  branch_point_id
  scenario_graph_ref
  branch_intent_source_ref
  condition_refs[]
  unmodelled_factor_refs[]
  text_projection_ref
  visual_projection_ref
  scenario_display_label

IfScenarioCandidateSetPayload
  kind = ANALYSIS_IF_SCENARIO_SET
  wire_kind = watashi.if-route-set.v1
  candidate_set_id
  base_observed_map_ref
  base_route_ref
  scenarios[] = IfRouteSimulationPayload, exact1..3
  display_order[] = scenario_artifact_ref exact set
  selection_policy = PARALLEL_NOT_RANKED

IfScenarioCandidateSet = GenerationArtifactBundle<IfScenarioCandidateSetPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_IF_SCENARIO_SET
  epistemic_partition = HYPOTHETICAL
  semantic_graph_ref = candidate_set_id
  experience_plan_ref
  primary_artifact = IfScenarioCandidateSetPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

scenario candidateの意味identityはcandidate set内で保ち、Bundleの`companion_artifacts`へ曖昧に並べない。全scenarioは同一`base_observed_map_ref` / `base_route_ref`へbindする。`display_order`は表示順でありrankではない。

branch point / intent / constraint不足時は`EngineOutcome(status=QUESTION_PENDING, artifact_bundle=null, clarification_request=...)`を返し、空の`HypotheticalScenarioGraph`やIF artifactを作らない。

## 11. `SavedRouteIntent`

userが明示保存した関心方向は、IF artifactともobserved mapとも別identityである。

```text
SavedRouteIntentPayload
  kind = ANALYSIS_SAVED_ROUTE_INTENT
  wire_kind = watashi.saved-route-intent.v1
  source_scenario_set_ref
  selected_scenario_ref
  selection_source_ref
  user_note_source_ref?
  saved_at

SavedRouteIntent = GenerationArtifactBundle<SavedRouteIntentPayload>
  artifact_id
  artifact_version
  artifact_kind = ANALYSIS_SAVED_ROUTE_INTENT
  epistemic_partition = USER_SAVED_INTENT
  semantic_graph_ref = selected scenario graph
  parent_artifact_refs includes source scenario set
  source_commitments includes user selection source + optional note only
  experience_plan_ref
  primary_artifact = SavedRouteIntentPayload
  realization_trace_ref
  quality_report_ref
  lifecycle_bindings
```

SavedRouteIntentは`ANALYSIS_SAVE_ROUTE_INTENT` operationでCMEEがcompileし、Analysis lifecycle serviceがauth、retrieval、persistence、read accessを所有する。userがscenarioを選択した操作を`SIMULATION_SESSION_MATERIAL` SourceEnvelope exact1としてcommitし、optional noteも別sourceにする。scenario set / simulation / scenario graphはderived parentでありsource commitmentではない。`selected_scenario_ref`はsource set member exact1でなければREJECTする。

saved intentをobservedへ自動昇格しない。後続記録との比較をachievement / failure / causal proofへしない。

## 12. Text / visual projection

CMEE shared graph projection protocolはsemantic edgeを発明しない。Analysis compilerが作ったtyped graphを表示planへ投影するだけである。

`AnalysisVisualPlan`:

```text
projection_id
projection_of = artifact_id@version
node_specs[]
edge_specs[]
lane_specs[]
group_specs[]
evidence_badges[]
unknown_badges[]
branch_markers[]
style_tokens:
  theme_ref
  layout_policy_ref
  accessibility_policy_ref
accessibility_linear_order[]
text_fallback_ref
```

V1-D observed mapでは`branch_markers` exact0でよい。V1-E scenarioではbranch point / user-selected branchを`branch_markers`で明示する。`group_specs`はvisual groupingだけを表し、semantic edgeやscenario rankを作らない。

visual semantics:

- observed route: solid + label
- simulated route: clearly labelled dashed + icon
- unknown gap: broken / dotted + unknown label
- user-selected branch: explicit marker
- 色だけに依存しない

RN rendererはAnalysis product ownerである。text / graph / accessible linear viewは同じcanonical artifactへresolveする。

canonical stored `watashi.map.v2` artifactはprivateで、exact evidence / source refsを保持する。API / RNへはaccess ownerがversioned safe projectionを作り、`projection_of = artifact_id@version`、visible node / edge / badge、anonymous evidence count、unknown / conflict / period comparison stateだけを渡す。raw body、private source ID、private evidence locator、source digestはprojection 0である。latest / history / detailが同じcanonical identityへresolveすることは、private stored JSONと全audience向けprojection bytesが同一であることを意味しない。

projectionでも`OBSERVED_ORDER`だけが`from_ref / to_ref`を持つ。`REPEATED_COOCCURRENCE`はunordered `endpoint_refs[]`で表し、矢印化しない。annotation / unknown / conflictはvisible labelだけのstring listにせず、safeな`target_ref` / `between_node_refs`を保持してgraph上の対応を失わない。

V1-E safe projectionは`watashi.if-route-set.v1`、SavedRouteIntent safe projectionは`watashi.saved-route-intent.v1`を使う。IF projectionはscenario origin、required condition、friction、unmodelled factorを保ち、rank / score / probabilityを持たない。SavedRouteIntent projectionはowner-authorized exact1で、選択scenarioとoptional noteだけを返す。どちらもobserved safe projectionへ混ぜない。

## 13. Safety and epistemic gates

hard reject:

- unsupported diagnosis / personality / hidden cause
- one record -> trend
- cooccurrence -> causal order
- observed / simulated / saved identity mixing
- protective / burden -> fact promotion
- future / probability / optimality claim
- filler step / generic result
- evidence ref absent observed claim / edge
- hidden conflict / insufficient data
- high-care IF without required confirmation
- Piece / Emlis voice or body reuse

valid failure resultはpartial map、unknown gap、conflict表示、IF unavailableである。fixed four-step fallbackへ戻さない。

## 14. Verification

V1-D proposed tests:

```text
ai/tests/test_cmee_analysis_v1d_source_adapter.py
ai/tests/test_cmee_analysis_v1d_intent_compiler.py
ai/tests/test_cmee_analysis_v1d_observed_route_realizer.py
ai/tests/test_cmee_analysis_v1d_vertical.py
ai/tests/test_cmee_analysis_v1d_negative_contracts.py
```

V1-E proposed tests:

```text
ai/tests/test_cmee_analysis_v1e_if_route_realizer.py
ai/tests/test_cmee_analysis_v1e_identity_separation.py
ai/tests/test_cmee_analysis_v1e_negative_contracts.py
```

machine acceptance:

- visible observed claim / edge evidence ref coverage 100%
- filler step / result 0
- observed graph simulation mutation 0
- simulated step origin label 100%
- future / causal / diagnosis / personality / optimality assertion 0
- text / visual / pointer / history identity mismatch 0
- unknown / conflict concealment 0
- safe projectionのraw body / private source ID / private evidence locator / source digest leakage 0
- policy-external projection read 0

Human Product Read:

- 観測・仮想・unknownを区別できる。
- 現在のrouteとして読めるが、人格診断に見えない。
- protectiveとburdenが原因断定に見えない。
- IFが正解や予測として押し付けられていない。
- actual RN表示でroute / branch / evidence / unknownが読める。

## 15. Migration and cutover

### 15.1 Stored artifact and wire identity

V1-D first storage candidateはcurrent self-structure report familyへimmutable `watashi.map.v2` JSONをadditive保存する。

```text
wire kind = watashi.map.v2
stored raw user body = 0
stored evidence refs = required
stored artifact_id@version = canonical
latest pointer / history item / detail / text / graph = same stored artifact
view-time meaning or route regeneration = 0
API / RN = audience-authorized safe projection_of canonical artifact
```

implementation前にfresh DB row contract、payload bytes、read/write latency、index / history cost、retention、RLS / accessをpreflightする。current table boundary内で成立しない場合、evidenceを落として通さず`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`とし、child tableまたはdedicated artifact storageをseparate Mash decisionへ出す。

existing tier、access、unread、dirty / refresh semanticsをregression gateに含める。historical `watashi.map.v1`はread-only version dispatchで既存rendererへ渡す。global V1-D activationがOFFの間はv1 generationを選べるが、V1-D active requestの失敗からv1へper-request fallbackしない。v2 payloadをv1 shapeとして解釈しない。

V1-Eのfirst storage candidateは、Analysis lifecycle ownerが`watashi.if-route-set.v1`と`watashi.saved-route-intent.v1`をobserved mapとは別artifact kind / namespaceでimmutable保存する。parent observed map、scenario set、selected scenarioのversion refを固定し、view-time regeneration 0とする。DB / RLS / payload size / latency / retention / read-policy preflightで安全に分離できなければ`NO_SAFE_ANALYSIS_V1E_STORAGE_STOP`とし、observed `watashi.map.v2`へ混ぜて通さない。

V1-E safe projectionはcanonical IF / Saved identityからAnalysis access ownerが生成する。IF / SavedのAPI / RN pathとstorage exact ownerはV1-E separate approvalでfresh固定し、それまでmaterialize 0である。

### 15.1.1 u95 actual storage fit-gapと別判断候補（当時未承認、u96承認済み）

2026-10-03にSupabase `cocolon-project` のcatalog／columns／constraints／grants／policies／view定義だけをread-only確認した。ユーザー行・入力本文は読んでいない。

- `myprofile_reports`はRLS enabled、authenticatedのown SELECT policyがあり、content_jsonを含む本人行の直接読取が可能。safe API serializerを通さずprivate evidenceを取得できてしまう。
- `self_structure_reports`は同tableの全列view、security_invoker=true、service_role SELECTのみ。viewが限定されても基底tableの本人direct SELECTは残る。
- uniqueは`(user_id,report_type,period_start,period_end)`、期間列はdate。既存latest writerは固定1970期間へmerge-upsert、monthly writerも同uniqueへupsert／旧schema行削除を行う。private immutable versionの格納先にはそのまま使えない。
- `emotions`のcreated_atはtimestamp without time zone、既存saved-input ownerはUTCと定義。version／deleted_at列はなく、exact7field commitmentと実在本人行を使う。
- byte／latency／history costの実測や新schema validationは未実行。既に確認できたprivate read／immutabilityの不成立に対し、無関係な前段測定を増やさない。

従って現行tableへの格納は`NO_SAFE_ANALYSIS_V1D_STORAGE_STOP`。上の§15.1に従い、次の**1案をMashの別判断へ出す**。この段落は承認済みschemaへの変更ではなくreviewable proposalで、SQL／table／flagはまだ追加・適用していない。

| 候補 | 内容 |
|---|---|
| 保存先 | 同じSupabaseのbackend専用`analysis_observed_artifacts` table 1つ。外部service追加なし |
| identity／access | immutable artifact_id＋version、本人owner、期間、report mode。user削除へ連動、RLS enabled、anon／authenticated直接権限なし、service_roleのみ |
| 内容 | raw user body 0。closed serializerでcanonical evidence refs／source commitments／graph identityと、生成時のsafe projection／textを保存。`asdict(current artifact)`による原文label保存は禁止 |
| freshness／削除 | commit時に本人・tier・source set／version／補足revisionを同transactionで再照合。元記録・補足の変更／削除時は影響artifactを無効化／削除し、readでも検証。request-local再読取をatomic writeと扱わない |
| API | 既存self-structure latest／history／detailのV2分岐だけへ接続。同じ保存identityからsafe projectionを返し、view-time意味再生成0。Free履歴不可・Plus deep不可をserverでも実施 |
| legacy | 旧myprofile_reportsと旧rendererを履歴用に維持。MyProfile互換はcanonicalへdelegate。`/mymodel/infer`／cron／workerの旧builderにprivate metaを共通追加しない |
| 進め方 | この保存方式の判断後にmigration／serializer／保存RPCとAPI差分を実装・検証。現在のPR反映からDB適用・公開cutoverへ自動進行しない |

既存tableのdirect SELECT権限と全旧writerを変える方式より、分析専用の1 tableへ限定する方が変更範囲が小さいため推奨する。旧table全体の権限を黙って剥奪して設計条件を満たしたことにはしない。

### 15.1.2 u96/u97 承認済み保存実装・DB適用

Mashの同じDBへのserver専用table1追加承認により、上記案を実装した。実migration `20261003204421 / analysis_observed_artifacts`、source `supabase/migrations/20261003134440_analysis_observed_artifacts.sql`。14列・14制約・4 index・6関数・5 triggerを事後照合し、関数body全文一致。RLS有効、anon/authenticated直接権限0。private evidenceのsource refs/commitmentと既に生成したsafe text/projectionを保存し、原入力JSON/private node labelは保存しない。

新owner `analysis_observed_service.py` がSQL snapshot→既存CMEE→closed serializer→atomic commit→safe readを担当。DB guardはCMEE commitmentと別namespace。READ COMMITTED＋auth KEY SHARE NOWAIT＋4source表SHARE NOWAITで全cohort/tierを再照合する。生成はlock外。競合409・ACK不明503。source/補足変更・削除、account削除で関連artifactを除去し、read時も再照合。table lockは他user書込にも短く競合し得る。

既存latest/status/monthly/history/detail/unreadへ同じ保存identityを接続。読取で意味を生成し直さず、保存text/graphの一致を検証。旧履歴はaccess後に混在表示し、Free履歴とPlus deepをserverで拒否する。status/latestはmode＋期間で選別してからlimit。RN既読は表示したprojection_ofに固定。

`COCOLON_ANALYSIS_OBSERVED_MODE`はoff既定／read_only保存読取／development生成保存。稼働envは未変更。monthly include_secret=false/now_isoは未対応400。旧/mymodel・cron/workerは今回変更しておらず、下記global単一owner cutoverの完了ではない。

Python54、RN11＋旧互換2、隔離PGlite31項目PASS。実ユーザー入力の生成・稼働APIの保存往復・複数接続負荷・nativeは未確認。適用応答待ちの停止からの再開経緯、実権限、既知範囲、次の指定API開発配置は06/API handoff末尾u96/u97に記録。全file mapはAnalysis map §4.7。

### 15.2 One-owner cutover

V1-D activation packet:

```text
new observed-map generation owner exact1
current Watashi Map v1 generation owner active ingress 0
per-request silent fallback 0
dual-write / dual-render truth owner 0
```

old renderer / API shapeをcompatibility projectionとして使う場合も、truth generation ownerはexact1とする。安全なmigrationができなければ`NO_SAFE_ANALYSIS_V1D_CUTOVER_STOP`。

V1-E activationはV1-D後の別packetで行う。V1-DとIFを一度にactivateしない。

## 16. Completion

```text
CMEE_V1D_ANALYSIS_OBSERVED_ROUTE_OPERATIONAL
```

requires:

- period sourceからpartialを許すevidence-bound observed routeを作る。
- observed / annotation / unknown / conflict identityが分離する。
- latest / history / detail / text / visualがcanonical identityへ一致する。
- current generic fallback ownerがactive ingress 0になる。
- Product Readとactual RN proofを通過する。

```text
CMEE_V1E_ANALYSIS_IF_ROUTE_OPERATIONAL
```

requires:

- observed mapをmutationせず1–3 scenarioを作る。
- candidate set exact1内でsame base map / routeを持ち、表示順をrankへ昇格しない。
- scenarioをrank / optimal選択しない。
- observed / hypothetical / saved identityが分離する。
- user selection sourceとderived scenario parentを分離する。
- IF / Savedのseparate immutable storage / safe projectionを通過する。
- simulation safety / clarification / display proofを通過する。

V1-DまたはV1-Eをthree-core completionへ自動変換しない。
