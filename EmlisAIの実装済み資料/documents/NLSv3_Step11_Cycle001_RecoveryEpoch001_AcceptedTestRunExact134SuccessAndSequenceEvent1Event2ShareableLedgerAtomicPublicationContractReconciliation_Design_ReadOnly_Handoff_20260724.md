# NLS v3 Step 11 Cycle 001 accepted exact134 / sequence ledger / atomic publication reconciliation design handoff

作成日: 2026-07-24 JST  
承認authority: `NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_DESIGN_READ_ONLY`  
開始点: Karen-Diary `700f749f5149cac1f8bd4bab8a364d524a56985b` / Cocolon `3d91614c5beb73a78b2ebc96b696563ec2f6de4e` / mashos-api `78276950d0d7650968fe938bc63a6e13455a8d6c`  
本文境界: `BODY-FREE / SHAREABLE`  
状態: `DESIGN FROZEN / RED NOT AUTHORIZED / AUTHORITY STOP`

## 1. 確認済み事実

- accepted-run owner / independent verifierはfull exact134 successを
  fail-closedで強制せず、整合したfailure runを`accepted=true`にできる。
- Step receipt側は134/134、all-zero、exit0、全PASSEDを別途要求するため、
  false acceptedが直ちにall11へ進むわけではない。
- current event 1はparent §10のstate、timestamp、prior identity、
  evidence artifact path/blobを欠く。
- current all11は`STAGED_NOT_PUBLISHED`だけで、event 2 / Git publisherはない。
- current formal proof candidateは`nls_v3_rc_0034`である。
  legacy source-baseline manifestの`nls_v3_rc_0032`をcurrent eventへ使わない。
- current connectorでblob/tree/commit作成とnon-force ref updateは見えるが、
  base tree SHA取得とexpected-old-SHA leaseを含むformal CAS routeは
  まだ実証していない。
- Mash共有localのDetailed Design / Step 11 Plan / long-term roadmapは
  SHA-256 `6aa3fb79…` / `31682e71…` / `04fb9e4e…`で確認済みで、
  Plan / roadmapは補助資料、Detailed Design / Recovery parentがnormative
  precedenceである。
- event 1 / event 2、accepted run、successful Step receiptは未作成である。
- source baselineは`UNLOCKED`、formal exact134は未実行、
  Cycle 001は`NOT_ACCEPTED`である。

## 2. 固定した設計

1. `accepted=true`はexact134全PASSED、全非成功count 0、exit0、
   timeout false、full provenance成立時だけ。
2. failureは別のbody-free run-attempt STOPとして残し、accepted receiptを
   発行しない。
3. run前にimmutable one-shot reservationを公開し、crash時も同じ
   authority/challengeを再実行しない。一つのformal authority tokenから
   challenge違いの二件目も作らない。
4. attempt v2 / accepted v2 / source-baseline receipt v2 / all11 v2 /
   atomic manifest v2のexact keyset、型、hash階層を固定した。
5. event 1 / 2は共通sequence-event v2 schemaでparent §10を満たす。
6. eventのartifact path/blobはtransition evidenceを参照する。
   event自身のblobは埋めず自己参照を避ける。
7. P0は既存parent doc blob `3333ae29…`とreceipt blob `bdfbd559…`を
   `LEGACY_IMMUTABLE_P0_ANCHOR` genesis descriptorにし、新しいevent0
   wrapperを作らない。
8. event1はexact2、event2はaccepted / Step exact11 / all11 /
   atomic manifest / event2のexact15をsingle Git tree / commit /
   expected-old-SHA leaseで公開する。
   supporting exact14のpath family / role / schema / logical hash fieldも
   literal固定する。
9. unreachable candidateはpublishedではない。main ref updateとpost-fetch
   完了後だけ`PUBLISHED_ATOMIC`を成立させる。
10. logical artifact SHA、raw file SHA、Git blob SHAを別identityとして
    再計算する。timestampは記述値で、順序authorityはGit ancestry /
    ordinal / prior identityである。
11. base tree / expected-old-SHA CAS capabilityがfuture formal入口で
   確認できなければ
   event1前STOPとし、sequential Contents APIへfallbackしない。

## 3. 推測

targeted exact36 GREENからformal runnerは実行可能と推測する。
ただしformal exact134は未実行であり、GREEN、accepted、またはreceipt
発行可能とは推測しない。

## 4. 華恋の意見

acceptedという名前を完全成功へ一致させ、failureを別artifactとして残す方が、
運用判断でfailureを成功へ読み替える余地を閉じられる。

また、既存P0を後から作り直さずimmutable anchorとして用いること、
exact bundleを一つのunreachable commitへ組み一回のref updateでだけ
可視化することが、Recovery Epoch 001の順序責任に合う。

## 5. 未確認

- causal RED / implementation / targeted GREEN;
- event1 / event2 v2 actual publication;
- formal exact134 result;
- accepted receipt / successful Step exact11 / all11;
- P2 / fresh batch / broad regression;
- exact100 / Product Read / correction / B6;
- Cycle 001 acceptance。

## 6. next authority

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_ACCEPTED_TEST_RUN_EXACT134_SUCCESS_AND_SEQUENCE_EVENT1_EVENT2_SHAREABLE_LEDGER_ATOMIC_PUBLICATION_CONTRACT_RECONCILIATION_RED_FREEZE_ONLY
```

この候補はone-shot reservation、exact134 fail-closed、literal v2 schemas、
event ordering、exact bundle、expected-old-SHA publicationのcausal REDだけを
扱う。implementation、GREEN、formal token、event、receipt、P2以降へ
自動進行しない。

Reserved future formal P1 token:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH001_SOURCE_BASELINE_AND_STEP0_10_COMPLETION_RECEIPT_GENERATION_AND_VERIFICATION_RETRY004_ONLY
```

reservedであり、承認済み・activeではない。

STOP. Separate approval required.
