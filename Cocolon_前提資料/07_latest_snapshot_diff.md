

## 2026-07-29 Recovery Epoch003 post-D2 remediation D2 targeted GREEN snapshot

### Confirmed facts

Authority:

```text
NLS_V3_STEP11_CYCLE001_RECOVERY_EPOCH003_POST_P0_PARENT_ADDENDUM_POST_D2_REMEDIATION_D2_ACTUAL_UNCLASSIFIED_IMPORT_EXACT3_AND_VERSIONED_CURRENT_STRICT_PREFLIGHT_CONNECTION_IMPLEMENTATION_AND_TARGETED_GREEN_ONLY
```

Fixed entry:

```text
Cocolon:
2bf173c50f72a533a3e635c307f3127cdb2d8059

mashos-api commit / tree:
1bcadf0b02e79ba935b01dc4d65c85e0cdd77d2b
4b682b8b5c55d3ad3b82db7da45cf2a971372355
```

Approved exact5 was implemented and published:

```text
mashos-api commit:
1c3bdd73df68699cbc14b3ccc41c94149f0b6255

tree:
1be763a89c82a40a97e0696e1639a3474c45d806
```

The source-level remediation narrowed import fallback exception handling
without changing the scanners or lock. The versioned current verifier,
preflight v1, and parent v1 were added while historical source hashes
remained unchanged.

Frozen exact1:

```text
blob:
f705b5296088c15accc76eb629bac637d16c714a

raw:
cda6119f9dc85fd386eb2447f1c85d8e250b973388866dad2fff6855d342311a

ordered exact8 hash:
22c217b28ae1916ac7817dcfa091ea107a85e483ce5959241e44200c6c9a79de
```

Targeted outcome:

```text
collected 8
passed 8
failed 0
error 0
unexpected pytest error 0
owner / independent manifest exact equal
unclassified 0
unresolved dynamic import 0
all exact14 effects 0
```

The first same-path execution capture had no terminal record and receives
zero outcome credit. The permitted unchanged-path rerun produced the
credited terminal GREEN above. Other pytest selections remained zero.

Receipt external identity:

```text
cf4d707e9e2cb0c89a4775ce72be99fd901c4842033cb9ca00b20d2f29ae58f9
```

The earlier unauthorized test selection remains a visible non-credit
deviation and was not rerun, rewritten, or concealed.

### Inference

The targeted exact8 and postfetch support closure of the actual-import and
versioned current-strict remediation. They do not establish operational
parent success, P2, Product Read, Cycle001 acceptance, or final issuance.

### Karen's opinion

The current evidence supports a hard stop at targeted GREEN. Final issuance
must remain a separate Mash decision; automatic continuation would be an
authority violation.

### Current state

```text
RECOVERY_EPOCH003_POST_D2_REMEDIATION_D2_TARGETED_GREEN_POSTVERIFIED_FINAL_ISSUANCE_NOT_AUTHORIZED_AUTHORITY_STOP
```

Still prohibited:

```text
reference / operational runtime materialization
reference observation / OperationalAdmission publication
Candidate / Event1 / Readiness / Failure publication
source-baseline lock
Reservation / Attempt / formal exact134
P2 / Product Read / Cycle001 acceptance
final issuance
automatic progression
```
