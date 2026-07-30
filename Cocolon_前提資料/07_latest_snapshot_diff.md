
## 2026-07-30 Recovery Epoch003 remediated final pre-Event1 v2 issuance

### Authority and fixed entry

Mash approved only:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATED_FINAL_PRE_EVENT1_REFERENCE_RUNTIME_OBSERVATION_AND_OPERATIONAL_ADMISSION_V2_ISSUANCE_ONLY
```

```text
Cocolon commit / tree:
a15c7a087c6ae8fcaf3043349429d4308e967241
92457f97b54330166e5d7ce76782962cd40f5e74

mashos-api commit / tree:
97e8dd4d7021b8a1781d534aaa603f71dffa41b9
cd3fc3da0976bbbcb708319e4bc8cbbb6a73ec19

D2 receipt external identity:
97f62f881ac8035bb8fcba15d153ca38637bc659196a74f5f0f0e4849a4686c6
```

### Confirmed facts

The owner and independent PRESTART derivations reread the historical
exact6 from actual Git and both returned `VALID` with this core:

```text
519359777b7efc56b79d9422ba6f312913f97a490dc290c20c18ab42dfbd8ef5
```

The verified offline exact46 runner was used without network acquisition.
The versioned materializer was invoked once and succeeded once:

```text
runtime root identity:
53091c99c40f960699521c1c4a089120a05352a391cbcd29d08890b1613727e7

runtime materialization:
78aa42eed88a292bcd3979583a4b30ba6c8f5518644c8d9922d38560a934b665
```

Reference Runtime Observation:

```text
commit / tree:
26b4d3746648c48b137103e4a8f22f7c98e1e9fa
11d897eef32818ad963b6ef9278fc3a61464a376

blob / raw / logical / external:
59623e9baba5f76bb9e80df4ca0cddd18f8320e4
bd3180d55f756c7b0605bf0862641e22a9cea3f4325babc8802803d2b8530371
0fd0c012d788c790b31fab275a6bcc6180bc544736aaac4dd72d2a42cea46a00
190cb3cf0749cf8fcdd9ddc9fdfdd8e47dffb03e35a74c74472e788bab204864
```

At that commit, PRESTART and POST_REFERENCE owner/independent exact4 all
returned `VALID` with the same historical core.  The complete predecessor
and closures were:

```text
predecessor exact8:
c5db068bb6683ef2a8359b51a7f16190027c17e97f70752ddace53e0af04d071

source closure:
80e18e75604c72c78701384f127839aee1ef152a7788622d2824e8678137fe97

bootstrap closure:
a6c19b645fede8d9a508235e63babd7299d96194d88b5f7aeb3b7a7feedae571
```

OperationalAdmission v2:

```text
commit / tree:
3a0cf9dab6f81711a3754367796095e36109c657
bb775f5ded47cf09eb1278d1df9cd2f53a433c4e

blob / raw / logical / external:
c58e29b982a89bf2aefa008fc3276431b5e8cac2
26db0957e0582e4fbcc7fcd5ffdefb98a198fb0c1abe2a13aa6159c63a73b280
e3e53e2d446cdac7332b0caebb8dcd3ef5eff103502cc6eebfffbc2ffece5676
80af08a59a37eacdcb38e2c1004e01dcf85e26fac11f75a56e8adb79d92abcd8
```

Reference and OA each added exactly one path.  Independent strict
prepublication and postfetch validation returned zero issues.  Parent v2
phase 1 and phase 2 both returned `PROVED`, with zero issues and exact2
completed phases.

The first local parent invocation was non-credit because Git's textual
path output quoted the Japanese path.  It caused no effect.  Only the
clone-local `core.quotePath=false` display setting was fixed, and the
phases were rerun successfully without changing tracked bytes or
identities.

Closure evidence:

```text
Result commit / tree / raw:
abb4b25fd885729364802cd77c6acb7757672a00
f2c5c4a82d7e695ff00c6f602d4347aea76b7414
b94f8ce41f2840facfb8ea3fd74762776d2c2b650c5f8a98fb23052492869b09

Receipt commit / tree / raw:
b8e39ea696e337bcafd166df2cab3f27b1f0796c
6f9593f82b525d92abfc8fc7ceea98dd39e41e28
d231e4b863e5b6df8ec86144bd2a79c95ac9feedd3e47d1e5df2b7045536e22f

Receipt logical / external identity:
15a455414a281b330ae815d51811085df141e4dbab7a22f85b41967fe3f7e6b5
2c52bb50256bdf4c9bf456f33925f4bc868ecbef3001032f08290853f2f73c94

Handoff commit / tree / raw:
36ccd48e7792fecf88189f6dd40ee3845d50e8b9
a4dc13631261f5350ff46d2c791a9a3e4f7fb6d1
22e35dfb29ad743aca74f49e43f71fc355f2df26e75be323903af95a0ed3522b
```

Three read-only independent audits returned blocker exact0.  Karen retained
all materialization, publication, postfetch, and final judgment.

### Inference

The exact4 historical-core equality, actual-source reconstruction, and
strict pre/post publication checks establish a connected pre-Event1
evidence chain from the frozen historical receipt bytes through the
observed reference runtime to OA v2.  They do not establish Event1 or an
operational runtime.

### Karen's opinion

The predecessor remediation has now moved from a targeted-GREEN
implementation claim to positive operational evidence without rewriting
historical bytes or weakening the canonical loader.  The next boundary is
the deliberately absent Event1 v2 connection, so stopping here is
necessary.

### Effect boundary and current stop

```text
reference materialization / reference publication / OA publication:
1 / 1 / 1

operational runtime / Candidate / Event1:
0 / 0 / 0

Readiness / Failure / Reservation / Attempt / formal exact134:
0 / 0 / 0 / 0 / 0

formal collection / test execution / pytest.main:
0 / 0 / false

source baseline:
UNLOCKED

P2 / Product Read / Cycle001 acceptance:
NOT_STARTED / NOT_STARTED / NOT_ACCEPTED

state:
RECOVERY_EPOCH003_PRESTART_PREDECESSOR_CANONICAL_BYTES_REMEDIATED_FINAL_PRE_EVENT1_REFERENCE_RUNTIME_OBSERVATION_AND_OPERATIONAL_ADMISSION_V2_ISSUED_POSTVERIFIED_EVENT1_CONNECTION_NOT_AUTHORIZED_AUTHORITY_STOP

automatic progression:
false
```

No Event1 token was issued.  A v2 Event1 connection requires a separate
design and explicit Mash authority.
