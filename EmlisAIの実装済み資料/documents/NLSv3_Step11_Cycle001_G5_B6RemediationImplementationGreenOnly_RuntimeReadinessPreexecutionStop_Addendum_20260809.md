# NLS v3 Step11 Cycle001 G5 B6 Remediation Implementation GREEN-only — Runtime Readiness Preexecution STOP Addendum

Date: 2026-08-09

## 1. disposition

This is the body-free durable record of a preexecution STOP inside G5. It is not a GREEN result, Product Read result, Cycle001 acceptance result, or permission to retry.

```text
G4 additive correction: CLOSED_CONSUMED_CAUSAL_RED_PASS
G5 direct Mash approval: RECEIVED_EXACT1
G5 activation / consumption: 1 / 1
G5 runtime readiness: NOT_READY_VERSION_PROBE_FAILED
G5 target invocation: 0
G5 machine GREEN credit: 0
G5 production GitHub write: 0
G6 Product Read: SEPARATE_APPROVAL_REQUIRED / NOT_STARTED
Cycle001: NOT_ACCEPTED
automatic progression: false
```

The single-use G5 authority activated only after the corrected G4 exact6 was postverified on Cocolon. The implementation/readiness work consumed that authority. The failed version probe cannot be rolled back or reused.

## 2. durable G5 entry

Fresh GitHub reads established this entry before any G5 production publication:

```text
mashos-api main:
  b0a8c70e5cec08581678b98f2e21571d17674d91

Cocolon main:
  c796b0eead99072694062ad4250b6ff17d3511f8

protected test:
  ai/tests/test_emlis_nls_v3_s11_rc0031_forward_inverse_independence.py
  blob 25f302a35d9e00df96f69d2eca26cc3caccc0e35
  SHA-256 22d59c362210b7020eddf34c43bfbd74f0c83cd78e9c8326ab03abe12fe5f5d6
  bytes 432022

production preimage:
  ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
  blob 1c19b6c293e20a9094b9180fded8c167daaaf5eb
  SHA-256 22295885af5c25d1738988a06846b3c70ab86f8d1ee88a6e6db7767e8774cd39
  bytes 548866

corrected ordered exact24 SHA-256:
  ea5f4afb819210eac771db02287c02475afb19cf9cff0408c7ce3dd866df10b9
```

Cocolon `c796b0e` contains the corrected G4 Addendum, body-free Receipt, Handoff, and append-only Plan/07/08 exact6 with prepared remote blobs. Its compare is ahead1 from `6fb07ae`, changed-path exact6, unauthorized0, deletions0, renames0.

## 3. approved implementation boundary and prepared candidate

The G5 boundary remained the G3/G4-frozen Natural Surface path exact1. Only the bodies of these exact3 symbols were eligible:

```text
_rc0031_rt_cluster
_step11_rc0031_product_render_cluster
_step11_rc0031_build_owner_role_inflected_typed_recomposition_candidate
```

The first 537842 production bytes, `_rc0031_rt_plan`, signatures, constants, marker, top-level function sequence, and the body-only masked remainder remained frozen. The protected test, fixtures, cases, Catalog, Grounded Lexicalization, Reception/relation/source authorities, Parser, Matcher, Hard Gate, API, DB, RN, and public/shared runtime remained unchanged.

A local, unpublished implementation candidate was prepared and independently statically audited:

```text
candidate bytes: 547665
candidate LF: 14350
candidate SHA-256:
  af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088
candidate Git blob:
  f10ce7948e5570ee8ad27ee2af00a9caf3867d49
candidate suffix: 9823 <= 11090
immutable prefix: exact
body-only masked remainder: exact
changed production path: exact1
changed symbol bodies: exact3
protected test blob: unchanged
static hard blocker: 0
```

The candidate structurally implements declared-head-first realization, stable typed non-head attachment, all-four direct dimension mappings at the head locus, modifier conservation at the declared head, role/kind fail-close consumption, and integrated Observation/Reception rerendering from one plan without reading the pre-rendered tail. This is design/static evidence only. It received no machine GREEN credit and was not written to GitHub production.

## 4. Gate A continuity discovery

Past G4 readiness was not inherited. Read-only Gate A found the declared locator and matched only the entrypoint/interpreter/pytest-package identity subset:

```text
entrypoint bytes / SHA-256:
  225 / 2abdd39dfcbff819df1a26f24d352724759e67317362ed43c3ce2624433ee321

resolved interpreter bytes / SHA-256:
  27816648 / 9ed008e5a8685235361f0c53771b520ab082dd99a877ad2fd796a93fa4c0b488

pytest package init bytes / SHA-256:
  5373 / 66993a5e3905005e0981159b4794d10b1adacf341a58a44d696ad2c4442dcdc6

runtime mutation / install / repair / acquisition / network:
  0 / 0 / 0 / 0 / 0
```

Because no manifest/lock/projection owner or observation-chain identity was defined by the G4 Receipt, Gate A remained `CURRENT_CONTINUITY_UNVERIFIED` with typed reason `REQUIRED_MANIFEST_LOCK_PROJECTION_IDENTITY_NOT_DEFINED_STOP`. Same-instance continuity credit is0; READY is not established.

## 5. Gate B version-probe incident

One exact declared pytest-entrypoint launch was issued for `--version` with a sanitized policy. The public policy identity records removed/fixed classes rather than the session-local locator:

```text
environment-policy SHA-256:
  8218428ed34a4e2c28c0048efd798da64323869ed128e081d04b834048647ceb

path-free argv SHA-256:
  d2e277d5a2158a171dccc02f1729eb25583fb2d412695e7ebec94a79323cf893

version probe count / exit:
  1 / 1

stdout SHA-256:
  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

stderr SHA-256:
  fbd03d6585ff6a883505370765ac5630a7993b76bbaa86327fe1a0c01ca13241

safe direct signature:
  PYTEST_MODULE_IMPORT_UNAVAILABLE
```

The direct observation is limited to this: under the launched policy, the declared entrypoint could not import `pytest` and raised `ModuleNotFoundError`. The G4 record did not freeze a reusable G5 import-path/environment-policy binding. Whether a particular import-path value is required is not proved here and must not be inferred as the final root cause without a separately authorized static recovery design.

The launch consumed the single-use version-probe authority even though it failed. It is not retried, rematerialized, repaired, or redirected.

## 6. closed counters and zero effects

```text
Gate A read-only discovery: 1
Gate B pytest version probe: 1
Gate B role probe: 0
direct role load / public API call / role effect: 0 / 0 / 0
Gate C admission / target invocation: 0 / 0
ordered exact24 execution: 0
full exact52 / exact100: 0 / 0
retry / fallback / interpreter switch: 0 / 0 / 0
rematerialization / install / repair / acquisition / network: 0 / 0 / 0 / 0 / 0
production GitHub commit / protected-test change / fixture change: 0 / 0 / 0
raw private-body read / export: 0 / 0
G6 Product Read / Cycle001 acceptance: 0 / 0
```

The corrected G4 `22 PASS / 2 CAUSAL_RED` credit and remote bytes are unchanged. No G5 result supersedes them. The two frozen RED signatures remain the current machine projection because G5 target execution did not occur.

## 7. nonreuse and next authority

This failed Gate B authority is closed and nonreusable. A second version probe would be a new pytest process and is prohibited without a new, explicit Mash authority. The current G5 instruction does not silently authorize retry, fallback, interpreter switch, installation, repair, rematerialization, or environment-policy rebinding after failure.

A future action must first receive explicit Mash approval for read-only Gate A identity completion. That authority may derive the missing manifest/lock/projection and observation-chain identities, but version probe, role probe, target, mutation, install, repair, rematerialization, acquisition, and network remain0. Only after Gate A determines an allowed runtime instance/recovery class may another explicit Gate B authority bind the resulting candidate and environment policy. Gate B must stop at READY. Gate C target execution then requires another explicit Mash authority.

Until that separate authority is granted and durably closed:

```text
G5: PREEXECUTION_STOP_RUNTIME_NOT_READY
implementation publication: 0
machine GREEN: 0
next action: WAIT_FOR_EXPLICIT_GATE_A_IDENTITY_COMPLETION_APPROVAL
G6: NOT_STARTED
Cycle001: NOT_ACCEPTED
automatic progression: false
```

## 8. GitHub closure rule

This STOP checkpoint consists of this Addendum, one body-free Receipt, one Handoff, and append-only Plan/07/08 updates. It is durable only when the new3 and modified3 prepared bytes are all on Cocolon `main`, their changed-path union is exact6 with unauthorized0/deletion0/rename0, and latest `main` contains every artifact. Publication records the STOP; it does not authorize recovery or G5 production publication.

## 9. lossless unpublished candidate bundle

The static candidate is retained here as an exact, public-safe, lossless unified patch rather than as a production publication. The patch material is 10248 bytes / 256 LF / CR0 / final-LF, SHA-256 `a7a9c66578972c437e9fa711cbb3d3e9ccaf0702024bf80d0e4f54c131a66b86`.

Reconstruction is permitted only for a separately approved recovery: start from exact production preimage blob `1c19b6c293e20a9094b9180fded8c167daaaf5eb`, extract the bytes between the following fence without the fence, require exact patch SHA/bytes/LF, apply without fuzz, 3-way merge, reject output, or whitespace correction, and require resulting blob `f10ce7948e5570ee8ad27ee2af00a9caf3867d49` / SHA-256 `af6f0a818b822381e6b03395b1d1250799d0a1465ac56a9c578eacf3c7e16088`. Any preimage or postimage mismatch is STOP.

```diff
diff --git a/ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py b/ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
index 1c19b6c293e20a9094b9180fded8c167daaaf5eb..f10ce7948e5570ee8ad27ee2af00a9caf3867d49 100644
--- a/ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
+++ b/ai/services/ai_inference/emlis_ai_step11_natural_surface_v3.py
@@ -14185,62 +14185,72 @@ def _rc0031_rt_cluster(
     v, *, c, g, m, s,
 ):
     refs, nuclei, cs, rs, links, unknowns = m
+    morphology = c["clause_morphology"]
+    roles = c["owner_role_particle_patterns"]
+    kinds = c["owner_kind_inflection_patterns"]
+    kind_by_nucleus = {
+        str(alias): str(row.kind)
+        for row in s.base_snapshot.nuclei
+        for alias in (row.source_id, row.actual_source_id)
+    }
     frags = {}
     for atom_id, owner in zip(
         v.construction_modifier_atom_ids,
         v.construction_modifier_target_owner_ids,
         strict=True,
     ):
-        atom = cs.get(str(atom_id))
-        fragment = (
-            c["construction_predicate_fragments"].get(
-                atom.construction_code
-            )
-            if atom is not None else None
-        )
-        if fragment is None:
-            raise Step11NaturalSurfaceError(_RC0031_E)
+        atom = cs[str(atom_id)]
+        fragment = c["construction_predicate_fragments"][
+            atom.construction_code
+        ]
         frags.setdefault(str(owner), []).append(str(fragment))
-    clauses = []
-    times = []
+    rows = []
     for atom_id, family, owners in zip(
         v.source_atom_ids, v.semantic_families,
         v.source_atom_owner_ids, strict=True,
     ):
-        if str(family) == "construction":
+        family = str(family)
+        if family == "construction":
             continue
         owner_ids = tuple(str(owner) for owner in owners)
+        if family in {"relation", "semantic_link"}:
+            for suffix in ("_from", "_to"):
+                morphology[roles[family + suffix]]
+        elif family == "explicit_unknown":
+            if roles[family] != "unknown_topic_particle":
+                raise Step11NaturalSurfaceError(_RC0031_E)
+        else:
+            raise Step11NaturalSurfaceError(_RC0031_E)
+        for owner in owner_ids:
+            kind = kind_by_nucleus[str(nuclei[owner])]
+            if kinds[kind] != "grounded_referent_uninflected":
+                raise Step11NaturalSurfaceError(_RC0031_E)
         referents = dict(refs)
         if str(atom_id) == str(v.head_source_atom_id):
-            for owner, rows in frags.items():
+            for owner, fragments in frags.items():
                 if owner not in owner_ids:
                     raise Step11NaturalSurfaceError(
                         _RC0031_E
                     )
-                referents[owner] += "".join(rows)
+                referents[owner] += "".join(fragments)
         temporal, modality, polarity, scope = (
             _step11_rc0031_product_source_dimensions(
-                str(atom_id), str(family), owner_ids,
+                str(atom_id), family, owner_ids,
                 successor_snapshot=s,
                 rc0031_nucleus_by_owner=nuclei,
             )
         )
-        times.append(str(g["temporal_scope_cues"].get(
-            temporal, g["temporal_scope_cues"]["unknown"]
-        )))
-        clauses.append(
-            str(g["referent_scope_cues"].get(
-                scope, g["referent_scope_cues"]["unknown"]
-            ))
-            + str(g["modality_cues"].get(
-                modality, g["modality_cues"]["unknown"]
-            ))
-            + str(g["polarity_cues"].get(
-                polarity, g["polarity_cues"]["unknown"]
-            ))
-            + _step11_rc0031_render_semantic_clause(
+        cues = "".join((
+            str(g["temporal_scope_cues"][temporal]),
+            str(g["modality_cues"][modality]),
+            str(g["polarity_cues"][polarity]),
+            str(g["referent_scope_cues"][scope]),
+        ))
+        rows.append((
+            str(atom_id), cues,
+            _step11_rc0031_render_semantic_clause(
                 source_atom_id=str(atom_id),
-                semantic_family=str(family),
+                semantic_family=family,
                 catalog=c,
                 referent_by_owner=referents,
                 owner_ids=owner_ids,
@@ -14248,37 +14258,44 @@ def _rc0031_rt_cluster(
                 relation_by_id=rs,
                 link_by_id=links,
                 unknown_by_id=unknowns,
-            )
-        )
-    if (
-        not clauses
-        or len(clauses) > 3
-        or v.visible_clause_count != (1 if len(clauses) <= 2 else 2)
-    ):
+            ),
+        ))
+    head = tuple(row for row in rows
+        if row[0] == str(v.head_source_atom_id))
+    if (len(head) != 1 or not 1 <= len(rows) <= 3
+        or v.visible_clause_count != (1 if len(rows) <= 2 else 2)):
         raise Step11NaturalSurfaceError(_RC0031_E)
-    common = len(set(times)) == 1
-    if not common:
-        clauses = [x + y for x, y in zip(times, clauses, strict=True)]
-    if len(clauses) <= 2:
-        text = g["atom_joiners"][0].join(clauses)
-    else:
-        text = (
-            g["atom_joiners"][0].join(clauses[:2])
-            + g["clause_join"]
-            + g["atom_joiners"][1].join(clauses[2:])
-        )
-    return (times[0] if common else "") + text
+    ordered = head + tuple(row for row in rows if row is not head[0])
+    text = head[0][1] + head[0][2]
+    for index, row in enumerate(ordered[1:]):
+        if index:
+            text += str(g["clause_join"])
+        text += str(morphology["within_sentence_clause_join"]) + row[2]
+    return text
 _RC0031_C0 = _step11_rc0031_product_render_cluster
 def _step11_rc0031_product_render_cluster(v, **kw):
-    if "m" not in kw:
-        return _RC0031_C0(v, **kw)
-    c = kw["c"]
+    if "m" in kw:
+        c, g, m, s = kw["c"], kw["g"], kw["m"], kw["s"]
+    else:
+        c = kw["rc0031_catalog"]
+        if type(c) is dict:
+            return _RC0031_C0(v, **kw)
+        g, s = kw["rc0031_grammar"], kw["successor_snapshot"]
+        m = (
+            kw["rc0031_referent_by_owner"],
+            kw["rc0031_nucleus_by_owner"],
+            kw["rc0031_construction_by_id"],
+            kw["rc0031_relation_by_id"],
+            kw["rc0031_link_by_id"],
+            kw["rc0031_unknown_by_id"],
+        )
     if (not v.head_source_atom_id
-        or len(v.construction_modifier_atom_ids) != len(v.construction_modifier_target_owner_ids)
+        or len(v.construction_modifier_atom_ids)
+        != len(v.construction_modifier_target_owner_ids)
         or len(c["owner_role_particle_patterns"]) != 8
         or len(c["owner_kind_inflection_patterns"]) != 12):
         raise Step11NaturalSurfaceError(_RC0031_E)
-    return _rc0031_rt_cluster(v, **kw)
+    return _rc0031_rt_cluster(v, c=c, g=g, m=m, s=s)
 def _step11_rc0031_build_owner_role_inflected_typed_recomposition_candidate(
     value, *, successor_snapshot, lexical_atom_specs,
     reception_focus_authority, plan, resolver, inventory_result,
@@ -14306,73 +14323,12 @@ def _step11_rc0031_build_owner_role_inflected_typed_recomposition_candidate(
             successor_snapshot=successor_snapshot,
             lexical_atom_specs=lexical_atom_specs,
         )
-        maps = (
-            {row[0]: row[3] for row in rows},
-            {row[0]: row[1] for row in rows},
-            {
-                str(row.construction_instance_id): row
-                for row in v.construction_atoms
-            },
-            {
-                str(row.experiment_relation_id): row
-                for row in v.relation_atoms
-            },
-            {
-                str(row.source_semantic_link_id): row
-                for row in v.semantic_link_atoms
-            },
-            {
-                str(row.source_unknown_id): row
-                for row in v.explicit_unknown_atoms
-            },
-        )
-        sep = grammar["section_separator"]
-        base = v.base_candidate.final_utf8_bytes.decode(
-            "utf-8", errors="strict"
-        )
-        injected = v.rendered_surface.utf8_bytes.decode(
-            "utf-8", errors="strict"
-        )
-        if base.count(sep) != 1 or injected.count(sep) != 1:
-            raise Step11NaturalSurfaceError(_RC0031_E)
-        lines = base.split(sep, 1)[0].split("\n")
-        rec = injected.split(sep, 1)[1]
-        suffix = catalog["clause_morphology"]["sentence_suffix"]
-        for binding in p.proposition_clause_bindings:
-            group = binding.sentence_group_ordinal
-            if (
-                not 1 <= group < len(lines)
-                or not lines[group].endswith(suffix)
-            ):
-                raise Step11NaturalSurfaceError(
-                    _RC0031_E
-                )
-            cluster = _step11_rc0031_product_render_cluster(
-                binding,
-                c=catalog,
-                g=grammar,
-                m=maps,
-                s=successor_snapshot,
-            )
-            lines[group] = (
-                lines[group][:-len(suffix)] + grammar["clause_join"]
-                + cluster + suffix
-            )
-        body = ("\n".join(lines) + sep + rec).encode(
-            "utf-8", errors="strict"
-        )
-        out = replace(
-            v.rendered_surface,
-            utf8_bytes=body,
-            sha256=hashlib.sha256(body).hexdigest(),
-            proposition_clause_count=sum(
-                row.visible_clause_count
-                for row in p.proposition_clause_bindings
-            ),
-            semantic_atom_count=sum(
-                len(row.source_atom_ids)
-                for row in p.proposition_clause_bindings
-            ),
+        out = _step11_rc0031_product_render(
+            v, p,
+            successor_snapshot=successor_snapshot,
+            rc0031_catalog=__import__("types").MappingProxyType(catalog),
+            rc0031_grammar=grammar,
+            rc0031_owner_rows=rows,
         )
         identity = _step11_rc0031_candidate_identity(
             base_candidate_id=v.base_candidate.candidate_id,
```

Candidate file properties after reconstruction are bytes547665 / LF14350 / CR0 / final-LF / mode100644. This bundle is evidence preservation only. It grants no authority to apply, execute, or publish the candidate.

## 10. reproducible Gate A and launch materials

The Gate A discovery scope was the single prior-G4 declared isolated runtime locator; global locator search was0 and candidate count was1. The public locator material is relative and path-free:

```text
discovery scope: DECLARED_PRIOR_G4_RUNTIME_ROOT_EXACT1
locator strategy: DECLARED_LOCATOR_ONLY
relative entrypoint: bin/pytest
entrypoint type / mode: regular file / 0755
entrypoint control: shebang exact1
relative pytest control: pytest/__init__.py
interpreter control: shebang-resolved declared primary-runtime Python 3.12 executable
manifest / lock / projection owner: NOT_DEFINED_BY_G4_RECEIPT
persistence class: SESSION_LOCAL
recovery class: NOT_ESTABLISHED
instance class: UNKNOWN
matched static identity subset count: 3
same-instance continuity credit: 0
typed reason: REQUIRED_MANIFEST_LOCK_PROJECTION_IDENTITY_NOT_DEFINED_STOP
candidate count / global search: 1 / 0
```

The missing manifest/lock/projection owner is recorded as a continuity gap; it is not silently treated as VALID. Gate A therefore stopped at `CURRENT_CONTINUITY_UNVERIFIED`. The subsequent already-consumed probe remains invalid/noncredit and is not rolled back.

The exact public-safe environment-policy canonical material, in order and with final LF, is:

```text
PYTEST_ADDOPTS=REMOVED
PYTEST_PLUGINS=REMOVED
PYTHONPATH=REMOVED
PYTEST_DISABLE_PLUGIN_AUTOLOAD=FIXED_ENABLED
PYTHONDONTWRITEBYTECODE=FIXED_ENABLED
WORKING_DIRECTORY_CLASS=NON_REPOSITORY_TEMP_ROOT
```

Its SHA-256 is `8218428ed34a4e2c28c0048efd798da64323869ed128e081d04b834048647ceb`. The path-free ordered argv material is `ENTRYPOINT_SHA256=2abdd39dfcbff819df1a26f24d352724759e67317362ed43c3ce2624433ee321\\nARG=--version\\n`, SHA-256 `d2e277d5a2158a171dccc02f1729eb25583fb2d412695e7ebec94a79323cf893`.

Raw stderr was181 bytes /4 LF/CR0/final-LF/SHA-256 `fbd03d6585ff6a883505370765ac5630a7993b76bbaa86327fe1a0c01ca13241`. It included a session-local locator and is not durably published. The durable sanitized projection is exactly `PYTEST_MODULE_IMPORT_UNAVAILABLE\\n`, 33 bytes /1 LF/CR0/final-LF/SHA-256 `a3a90b56197a94f222caabef85ce8d491c4b6d193e330af79faf07fbf145ba69`. Because the failed authority is closed/nonreusable and the raw locator supplies no authorized recovery route, no private durable locator is retained or required by this STOP record.

## 11. separated authority lifecycles

```text
G5 umbrella implementation authority:
  approval / activation / consumption: 1 / 1 / 1
  state: CLOSED_CONSUMED_PREEXECUTION_STOP
  retry / reuse / reactivation: 0 / 0 / 0

Gate B version-probe authority:
  approval / activation / consumption: 1 / 1 / 1
  state: CLOSED_CONSUMED_INVALID
  version probe / role probe: 1 / 0
  retry / reuse / reactivation: 0 / 0 / 0

future Gate A identity-completion authority:
  approval / activation / consumption: 0 / 0 / 0
  state: EXPLICIT_MASH_APPROVAL_REQUIRED

future Gate B recovery authority:
  approval / activation / consumption: 0 / 0 / 0
  state: BLOCKED_BY_GATE_A_IDENTITY_COMPLETION_AND_EXPLICIT_MASH_APPROVAL

Gate C target-execution authority:
  approval / activation / consumption: 0 / 0 / 0
  state: EXPLICIT_MASH_APPROVAL_REQUIRED_AFTER_FRESH_READY

G6 authority:
  approval / activation / consumption: 0 / 0 / 0
  state: SEPARATE_APPROVAL_REQUIRED_NOT_STARTED
```

A future READY result cannot reuse this G5 umbrella authority to launch the target. Gate A identity completion, any later Gate B recovery, and post-READY Gate C target execution each require their own explicit Mash authorities.
