# NLS v3 Step 11 rc0030 — E3 Activation Proposal

作成日: 2026-07-20 JST  
対象: `Step 11 / Cycle 001 / rc0030 / E3 Machine + Product Read`  
proposed predecessor: `MashがE2 Phase-manifest exact 4を反映したGitHub commit SHA`  
文書状態: `IMPACT_SCOPE_PROPOSAL / AUTHORITY_NOT_YET_GRANTED`

## 1. 目的

E2 GREEN後のmonotonic activationとして、index 5 / 16だけを追加activeにし、代表8件のmachine
評価とProduct Readを行う。E4 index 17はreserved-and-required-absentのまま維持する。

本提案はE3実装authorityではない。MashがE2 exact 4をGitHubへ反映し、そのcommit SHAを
formal predecessorとして固定した明示承認を行うまで、E3 fileを作成しない。

## 2. proposed repository scope — exact 6

### NEW

1. index 5  
   `ai/tools/emlis_nls_v3_rc0030_surface_planning_bounded_experiment.py`
2. index 16  
   `ai/tests/test_emlis_nls_v3_s11_rc0030_e3_representative8.py`

### MODIFY

3. index 1 manifest service
4. index 4 manifest tool
5. index 6 generated phase manifest
6. index 18 dependency closure test

index 7 representative8 body-free fixture、E2 test、production exact4 owner、runtime、selector、catalogは
read-onlyとする。new pathはindex 5 / 16の2件だけで、exact18外pathは0とする。

## 3. E3 manifest target

- phase: `E3_MACHINE_AND_PRODUCT_READ`
- phase predecessor: Mashが反映したE2 exact4 GitHub commit
- exact18: unchanged
- active / hash-bound / reserved: `17 / 16 / 1`
- newly active: index 5 / 16
- reserved-and-required-absent: index 17だけ
- source file count: `225`
- E2 manifest file / artifact / source closure / file-list / countをimmutable predecessorとして保持
- current production ownerとE2 testのpredecessor pinを維持
- generated manifest自身はself-hash集合から除外

## 4. machine / Product Read acceptance

machine entry:

1. E2 integration、control、runtime、retained attack、current dependency closureがGREEN。
2. representative 8が`8 / 8 selected`。
3. Parser / Independent Matcher / Hard Gateがbody-only exact binding。
4. exception、missing、duplicate、unaccounted、resource overrunが0。
5. shared/public runtime接続、case / family / review branchが0。

Product Read acceptance:

1. former MAJOR 5件が全て`PASS`または`MINOR`。
2. control 0001 / 0002 / 0009が非悪化。
3. new `MAJOR / BLOCKER = 0`。
4. relation、unknown、self-denial、required meaningが非回帰。
5. main meaning、schema-free realization、chunk distribution、Reception naturalness、読感を全8件で確認。

1件でも未達ならE3 STOP証拠としてfreezeし、E4を開始しない。

## 5. 不変条件 / STOP

- shared Matcher、Step 9全20 owner、rc0027 default、rc0028 / rc0029 behaviorを変更しない。
- Natural Surface、Parser、Matcher、Hard Gate、catalog、runtime、selectorのsemantic logicを変更しない。
- exact18、resource bound、body-only recoverability、Independent Matcherを変更しない。
- E4 index 17を作成しない。
- Product Read本文や入力をreceiptへ保存せず、body-free verdictだけを残す。

production修復、exact18外path、resource拡張、secure material、または別ownerが必要なら実装前にSTOPし、
設計20.3の新しい影響範囲を提示する。

## 6. 次の明示承認文

> rc0030 E2 Phase-manifest successor GREENを承認する。GitHub commit `<E2_MANIFEST_GITHUB_COMMIT_SHA>`をE3 phase predecessorとして、設計20.3のclosed exact18とmonotonic activationに従い、index 5 bounded experiment toolとindex 16 E3 representative 8 testを新規作成し、manifest index 1 / 4 / 6 / 18をE3 phaseへ同期するexact 6でE3 machineを開始する。active / hash-bound / reservedを17 / 16 / 1とし、E4 index 17はreserved-and-required-absentに維持する。production semantic logic、shared Matcher、Step 9全20 owner、Natural Surface、Parser、Matcher、Hard Gate、catalog、runtime、selector、rc0027〜rc0029、E1b、shared/public route、resource boundを不変にする。machine 8 / 8 selected後だけ代表8件Product Readへ進み、former MAJOR 5件をPASS/MINOR、control 3件非悪化、新規MAJOR/BLOCKER 0とする。未達または既存authority外が必要ならE4を開始せずSTOPして影響範囲を提示する。
