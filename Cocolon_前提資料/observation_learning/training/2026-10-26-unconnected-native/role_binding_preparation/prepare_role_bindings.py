"""Project 13 bounded offline targets from the existing four A/B teachers.

Standard library only. Does not load a model, train, connect, or admit candidates.
All outputs are teaching projections, never complete named-wire candidates.
"""
import argparse
import copy
import hashlib
import json
from pathlib import Path

CASES = ("FT-BOOK-AFTER-ANSWER", "FT-SHOP-AFTER-ANSWER")
ROLE_SELECTION = {
    CASES[0]: (("claim", "no_contact"), ("relation", "statement_concession"),
               ("relation", "returned_concession")),
    CASES[1]: (("claim", "perceived_realization"), ("claim", "answer_joy"),
               ("claim", "felt_distance")),
}
ADD_SELECTION = {
    CASES[0]: ("no_contact", "continuing_concern"),
    CASES[1]: ("perceived_realization", "felt_distance", "answer_sadness"),
}
CORDER = ("claims", "conflicts", "core", "question", "relations", "schema",
          "unknowns", "updates", "prose")


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def require(condition, reason):
    if not condition:
        raise ValueError(reason)


def evidence_ids(value):
    """Include nested time/mode/polarity/subject evidence, not just root ev."""
    found = set()
    if isinstance(value, dict):
        for key, item in value.items():
            if key == "ev":
                require(isinstance(item, list) and all(isinstance(v, str) for v in item), "bad_ev")
                found.update(item)
            else:
                found.update(evidence_ids(item))
    elif isinstance(value, list):
        for item in value:
            found.update(evidence_ids(item))
    return found


def one(items, key, value):
    matches = [item for item in items if item[key] == value]
    require(len(matches) == 1, "nonunique_target:" + value)
    return copy.deepcopy(matches[0])


def row(source, case_id, kind, identity, target, *, meaning=None, history=None):
    prompt = json.loads(source["messages"][-2]["content"])
    original = copy.deepcopy(prompt)
    old_spec = prompt["output_spec"]
    spec = {"preservation": "Return only the local teaching projection; do not add observations or repair missing values."}
    spec["output_types"] = (
        "Offline local teaching projection only; not a complete wire candidate. "
        "Return only the requested subtree in the stated output_keys. "
        "Preserve original identities, source fields, negation, modality, time and references."
    )
    spec["output_keys"] = list(target)
    spec["local_task"] = {"kind": kind, "identity": identity}
    prompt["output_spec"] = spec
    prompt["model_output_format"] = "OFFLINE_LOCAL_BINDING_PROJECTION_V1"
    prompt["training_task"] = kind
    prompt.pop("given_meaning", None)
    if meaning is not None:
        prompt["given_meaning"] = copy.deepcopy(meaning)
    if history is not None:
        require(all(u["op"] == "ADD" for u in history), "tail_history_contains_nonadd")
        prompt["given_updates"] = copy.deepcopy(history)
    if kind == "ROLE_TO_EVIDENCE":
        require(meaning is None and history is None and "given_meaning" not in prompt, "role_gold_leak")
        key = "clause_roles" if identity in old_spec["clause_roles"] else "written_links"
        spec[key] = {identity: copy.deepcopy(old_spec[key][identity])}
        spec["axes_requirements"] = old_spec["axes_requirements"]
        spec["coordinates_requirements"] = old_spec["coordinates_requirements"]
        spec["references_requirements"] = "ev refers to output q.id names. Preserve the requested semantic identity and any endpoint/scope IDs in its supplied role definition. This is a partial teaching object; endpoint claims are not separately emitted."
        spec["local_rule"] = "Emit q containing only all evidence referenced anywhere in the one requested original claim/relation, in original quote order, plus that one item under c. Do not output other meaning items."
    elif kind == "CLAIM_TO_ATTACHED_ADD":
        spec["references_requirements"] = "ev refers to given_meaning.q.id names. replace keeps the claim and attached relation IDs from given_meaning; prior uses its snapshot alias. Keep the native kinds; do not use relation IDs as update IDs."
        spec["local_rule"] = "Emit c.updates with exactly the one ADD introducing the requested claim. Keep its entire replace list, including attached relation IDs, and its original ev. Do not emit a separate relation ADD or a GAP. given_meaning is teaching context, not new person source."
    elif kind == "END_UPDATES_AND_PROSE":
        for key in ("prose_requirements", "question_requirements"):
            spec[key] = copy.deepcopy(old_spec[key])
        spec["references_requirements"] = "ev refers to given_meaning.q.id names. cr/rr/ur keep their distinct kinds. ur may refer to the supplied completed ADD history and the single output GAP update; do not emit the supplied history again."
        spec["local_rule"] = "given_updates contains all completed ADDs. Emit c.updates with the one final INVALIDATE_GAP only, followed by c.question and c.prose. Do not repeat any ADD, repeat the GAP, or alter prose binds. given_meaning/given_updates are teaching context, not person source. End the answer after the JSON object."
    for key in ("material", "prior_adopted_interpretation", "request_ref", "semantic_profile"):
        require(prompt[key] == original[key], "source_or_prior_changed:" + key)
    output = {
        "id": "LOCAL-" + kind + "-" + case_id + "-" + identity,
        "messages": [copy.deepcopy(source["messages"][0]),
                     {"role": "user", "content": compact(prompt)},
                     {"role": "assistant", "content": compact(target)}],
    }
    return output


def project(raw):
    rows = [json.loads(line) for line in raw.splitlines() if line.strip()]
    require(len(rows) == 4, "expected_four_original_auxiliary_rows")
    by_id = {item["id"]: item for item in rows}
    require(len(by_id) == 4, "duplicate_rows")
    derived, proofs = [], []
    for cid in CASES:
        ar, br = by_id["AUX-A-" + cid], by_id["AUX-B-" + cid]
        a = json.loads(ar["messages"][-1]["content"])
        b = json.loads(br["messages"][-1]["content"])
        require(set(a) == {"v", "a", "q", "c"} and set(b) == {"c"}, "unexpected_teacher_root")
        require(not set(a["c"]) & set(b["c"]) and set(a["c"]) | set(b["c"]) == set(CORDER), "teacher_parts_incomplete")
        require(json.loads(br["messages"][-2]["content"])["given_meaning"] == a, "given_meaning_changed")
        full = {k: copy.deepcopy(a[k]) for k in ("v", "a", "q")}
        full["c"] = {k: copy.deepcopy(a["c"][k] if k in a["c"] else b["c"][k]) for k in CORDER}
        qids = [q["id"] for q in a["q"]]
        require(len(set(qids)) == len(qids), "nonunique_quote_id")
        for kind, identity in ROLE_SELECTION[cid]:
            field, key = ("claims", "cid") if kind == "claim" else ("relations", "rid")
            item = one(a["c"][field], key, identity)
            refs = evidence_ids(item)
            require(refs <= set(qids), "unresolved_evidence")
            quotes = [copy.deepcopy(q) for q in a["q"] if q["id"] in refs]
            target = {"v": a["v"], "a": copy.deepcopy(a["a"]), "q": quotes, "c": {field: [item]}}
            got = row(ar, cid, "ROLE_TO_EVIDENCE", identity, target)
            require(json.loads(got["messages"][-1]["content"]) == target, "role_target_changed")
            derived.append(got)
        updates = b["c"]["updates"]
        require([u["op"] for u in updates] == ["ADD"] * (len(updates) - 1) + ["INVALIDATE_GAP"], "not_single_final_gap")
        for identity in ADD_SELECTION[cid]:
            selected = [u for u in updates if u["op"] == "ADD" and identity in u["replace"]]
            require(len(selected) == 1 and len(selected[0]["replace"]) > 1, "attached_add_not_unique")
            target = {"c": {"updates": copy.deepcopy(selected)}}
            got = row(br, cid, "CLAIM_TO_ATTACHED_ADD", identity, target, meaning=a)
            require(json.loads(got["messages"][-1]["content"])["c"]["updates"] == selected, "add_changed")
            derived.append(got)
        tail = {"c": {"updates": [copy.deepcopy(updates[-1])],
                      "question": copy.deepcopy(b["c"]["question"]),
                      "prose": copy.deepcopy(b["c"]["prose"])}}
        got = row(br, cid, "END_UPDATES_AND_PROSE", "final", tail, meaning=a, history=updates[:-1])
        parsed = json.loads(got["messages"][-1]["content"])
        require(updates[:-1] + parsed["c"]["updates"] == updates, "tail_updates_changed")
        require(parsed["c"]["question"] == b["c"]["question"] and parsed["c"]["prose"] == b["c"]["prose"], "tail_body_changed")
        derived.append(got)
        proofs.append({"case_id": cid, "merged_teacher_sha256": digest(compact(full).encode()),
                       "original_ab_teacher_sha256": [digest(ar["messages"][-1]["content"].encode()), digest(br["messages"][-1]["content"].encode())],
                       "teacher_adds": len(updates) - 1, "teacher_final_gaps": 1,
                       "all_source_fields_prior_exact": True, "nested_ev_complete": True,
                       "selected_target_subtrees_exact": True, "tail_updates_and_body_reconstruct_exact": True})
    require(len(derived) == 13 and len({r["id"] for r in derived}) == 13, "projection_count")
    return derived, proofs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--source-sha256", required=True)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    raw = args.source.read_bytes()
    require(digest(raw) == args.source_sha256, "source_identity_mismatch")
    outputs, proof = project(raw)
    require(args.source.read_bytes() == raw, "source_mutated")
    args.out.mkdir(parents=True, exist_ok=False)
    payload = b"".join((compact(r) + "\n").encode() for r in outputs)
    (args.out / "auxiliary_train_messages.jsonl").write_bytes(payload)
    report = {"status": "STRUCTURAL_PROJECTIONS_READY_NOT_TOKENIZER_OR_GPU_READY", "source_sha256": digest(raw),
              "derived_sha256": digest(payload), "rows": 13, "role_tasks": 6, "attached_add_tasks": 5, "terminal_tasks": 2,
              "new_observations": 0, "cases": proof,
              "targets": [{"id": r["id"], "assistant_chars": len(r["messages"][-1]["content"]),
                           "assistant_sha256": digest(r["messages"][-1]["content"].encode())} for r in outputs],
              "tokenizer_checks": "NOT_RUN", "context_and_mask_checks": "NOT_RUN", "model_loads": 0,
              "training_updates": 0, "generations": 0, "cmee_admissions": 0, "sql_operations": 0,
              "gpu_run_authorized": False, "product_credit": 0, "automatic_progression": False}
    (args.out / "structural_check.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(compact({k: v for k, v in report.items() if k not in ("cases", "targets")}))


if __name__ == "__main__":
    main()
