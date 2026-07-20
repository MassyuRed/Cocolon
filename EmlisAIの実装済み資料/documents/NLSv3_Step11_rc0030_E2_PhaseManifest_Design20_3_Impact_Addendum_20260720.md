# NLS v3 Step 11 rc0030 — E2 Phase-manifest 設計20.3影響範囲補遺

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E2 manifest successor`  
proposed predecessor: `Mashがexact 3を反映したGitHub commit SHA`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 0. 結論

Phase B exact 3の機能acceptanceはGREENとなった。次はE3ではなく、P5 historical manifestから
E2 integrated synchronization manifestへのphase successorを作る必要がある。

本補遺は実装authorityではない。Mashがexact 3をGitHubへ反映し、そのcommit SHAをformal
predecessorとして固定したうえで§8を明示承認するまで、manifest関係fileを変更しない。

## 1. 確認した事実

1. rc0030 exact18は全工程のclosed maximum allowlistである。
2. P5 current phaseは`P5_CARDINALITY_REGRESSION`である。
3. 承認済みlater phase orderは`E2 -> E3 -> E4`である。
4. E2 pathはexact18 index 10
   `ai/tests/test_emlis_nls_v3_s11_rc0030_e2_integration.py`である。
5. E2 Phase B exact 3はMatcher、Hard Gate、E2 testだけを変更し、manifestは不変にした。
6. E2 integrationは13 / 13 PASS、control / runtimeは16 / 16 PASSである。
7. P5 generated manifestはP5時点のowner hashとindex 10 reserved状態を固定しているため、E2
   current bytesをそのままP5 closureへ適用してはならない。

## 2. proposed successor authority

### 2.1 modify exact 4

1. index 1  
   `ai/services/ai_inference/emlis_ai_rc0030_surface_planning_experiment_dependency_manifest_v3.py`
2. index 4  
   `ai/tools/emlis_nls_v3_rc0030_surface_planning_dependency_manifest.py`
3. index 6  
   `ai/tests/fixtures/emlis_nls_v3/cycle_001/cycle001_dependency_manifest_rc0030_surface_planning_experiment.json`
4. index 18  
   `ai/tests/test_emlis_nls_v3_s11_rc0030_dependency_closure.py`

new repository pathは0とする。index 10 E2 testはactivated/hash-bound inputであり、このphaseでは
追加変更しない。

### 2.2 manifest successor責任

1. manifest phaseを`E2_INTEGRATED_SYNCHRONIZATION`へ進める。
2. exact 3 GitHub commitをphase predecessorとして固定する。
3. exact18 closed maximumを維持する。
4. P5 active pathにindex 10だけを追加activateする。
5. index 5、16、17をreserved-and-required-absentに維持する。
6. exact 4 modified ownerのcurrent full-file hashとfrozen rc0029 prefixを固定する。
7. E2 testを含むactive new pathのhash、import closure、unexpected path 0を固定する。
8. generated manifest自身を自身のhash集合から除外し、external body-free receiptでbindする。
9. P5 manifest file / artifact / source closure / source countをimmutable predecessorとして保持する。
10. deterministic buildとtool `--check`を一致させる。

## 3. 変更禁止

- Phase B exact 3のsemantic logic
- shared Matcher、shared Step 9全20 owner
- Natural Surface、Parser、catalog、Grounded Lexicalization、runtime、selector
- fixture corpus、resource bound、exact18 maximum
- rc0027〜rc0029、E1b、shared/public route
- P3 / P4 / P5 historical receiptとhistorical full-file hashの上書き
- E3 index 5 / 16、E4 index 17の早期activation
- case / family / failure-code固有production branch
- skip、xfail、hash checkの一般的な無効化

## 4. acceptance

1. E2 manifest deterministic rebuildがexact一致する。
2. dependency closure 5 / 5がcurrent E2 phaseとしてPASSする。
3. manifest tool `--check`がPASSする。
4. exact18 maximum、active / reserved partition、source file countがexactである。
5. exact 3 GitHub predecessorとcurrent owner hashがbody-freeに固定される。
6. E2 integration 13 / 13、control / runtime 16 / 16、retained rc0029 attackが非回帰である。
7. E3 / E4 fileは存在させず、E3 / E4は開始しない。
8. new path 0、semantic production change 0である。

## 5. historical stage-lockの扱い

P3 frozen full-file hashはP3時点のhistorical commitmentであり、後続P5 / E2 suffix bytesへ更新しない。
P5 manifestもclean predecessor上のhistorical closureとして保持する。E2 current closure testで両者を
phase-qualified predecessorとしてbindし、current E2 bytesと混同しない。

## 6. 再STOP条件

次のいずれかが必要なら変更前に停止し、追加影響範囲を提示する。

1. exact 4以外のmanifest owner変更
2. index 10 E2 testまたはexact 3 production logicの再修正
3. exact18外pathまたはnew version owner
4. E3 / E4早期activation
5. resource、public route、shared owner変更
6. secure materialまたはMash側の追加入力

## 7. 後続順序

1. exact 3 GitHub反映とcommit SHA固定
2. 本補遺承認
3. exact 4 E2 manifest successor
4. E2 full closure GREEN
5. E3代表8件machine + Product Read
6. E3通過後だけE4 frozen 100
7. 別authorityでformal candidate化とCycle 001 evidence finalization

## 8. 次の明示承認文

> rc0030 E2 Phase B exact 3 GREENを承認する。GitHub commit `<EXACT3_GITHUB_COMMIT_SHA>`をE2 manifest predecessorとして、設計20.3 E2 Phase-manifest補遺のexact 4 successorを実装する。変更対象はmanifest service index 1、manifest tool index 4、generated manifest index 6、dependency closure test index 18だけとし、E2 test index 10を追加activateする。exact18 closed maximumを維持し、reserved-and-required-absentをindex 5、16、17とする。Phase B exact 3、shared Matcher、Step 9全20 owner、Natural Surface、Parser、catalog、Grounded Lexicalization、runtime、selector、rc0027〜rc0029、E1b、shared/public、resource boundを不変にする。E2 manifest全GREEN後だけE3へ進み、既存authority外が必要なら変更前にSTOPして影響範囲を提示する。

## 9. 華恋の意見

manifest mismatchを理由にPhase B修復を戻すべきではない。Phase Bのsemantic evidenceとphase closureは
別ownerであり、exact 3 commitをpredecessor化してからexact 4 manifest successorを作る方が、
履歴と責任を混同しない。

