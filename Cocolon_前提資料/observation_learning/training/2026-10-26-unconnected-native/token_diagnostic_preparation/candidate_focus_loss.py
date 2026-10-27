"""CPU-only, source-preserving loss weights for frozen assistant JSON.

No model is imported or loaded. ``groups`` uses absolute positions in the
unchanged full chat input; ``weights`` aligns with targets at ``prefix:``.
The objective is .5 * mean(full assistant/EOS CE) plus .5 times the equal
mean of active semantic (S), natural-language value (F), and update (U) CEs.
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from typing import Any


GROUPS = ("S", "F", "U")


def _require(condition: bool, reason: str) -> None:
    if not condition:
        raise ValueError(reason)


@dataclass(frozen=True)
class _Node:
    start: int
    end: int
    kind: str
    value: Any


def _reject_constant(value: str) -> None:
    raise ValueError("nonfinite_json_constant:" + value)


class _SpanParser:
    """Recursive JSONDecoder walk retaining original serialized value spans."""

    def __init__(self, text: str):
        self.text = text
        self.decoder = json.JSONDecoder(parse_constant=_reject_constant)

    def _ws(self, at: int) -> int:
        while at < len(self.text) and self.text[at] in " \t\r\n":
            at += 1
        return at

    def parse(self, at: int = 0) -> _Node:
        at = self._ws(at)
        _require(at < len(self.text), "json_value_missing")
        start = at
        if self.text[at] == "{":
            values: dict[str, _Node] = {}
            at = self._ws(at + 1)
            if at < len(self.text) and self.text[at] == "}":
                return _Node(start, at + 1, "object", values)
            while True:
                _require(at < len(self.text) and self.text[at] == '"', "json_object_key_required")
                key, at = self.decoder.raw_decode(self.text, at)
                _require(isinstance(key, str) and key not in values, "duplicate_json_key:" + str(key))
                at = self._ws(at)
                _require(at < len(self.text) and self.text[at] == ":", "json_colon_required")
                child = self.parse(at + 1)
                values[key] = child
                at = self._ws(child.end)
                _require(at < len(self.text), "json_object_unclosed")
                if self.text[at] == "}":
                    return _Node(start, at + 1, "object", values)
                _require(self.text[at] == ",", "json_object_separator_required")
                at = self._ws(at + 1)
        if self.text[at] == "[":
            values = []
            at = self._ws(at + 1)
            if at < len(self.text) and self.text[at] == "]":
                return _Node(start, at + 1, "array", values)
            while True:
                child = self.parse(at)
                values.append(child)
                at = self._ws(child.end)
                _require(at < len(self.text), "json_array_unclosed")
                if self.text[at] == "]":
                    return _Node(start, at + 1, "array", values)
                _require(self.text[at] == ",", "json_array_separator_required")
                at = self._ws(at + 1)
        value, end = self.decoder.raw_decode(self.text, at)
        if isinstance(value, float):
            _require(math.isfinite(value), "nonfinite_json_number")
        kind = "string" if isinstance(value, str) else "scalar"
        return _Node(start, end, kind, value)


def _member(node: _Node, key: str, kind: str | None = None) -> _Node:
    _require(node.kind == "object" and key in node.value, "required_json_member:" + key)
    child = node.value[key]
    _require(kind is None or child.kind == kind, "json_member_type:" + key)
    return child


def parse_focus_spans(assistant_text: str) -> dict[str, list[tuple[int, int]]]:
    """Return exact raw character intervals, never a reserialized copy.

    S contains complete serialized values for claims, relations, unknowns,
    conflicts, question_proposal, surface bindings, and evidence_quotes.
    F contains only raw string contents (excluding quote delimiters) for the
    three user-facing fields; escapes stay as written. Null/empty fields do
    not activate F. U is the complete updates value only when nonempty.
    """
    _require(isinstance(assistant_text, str) and bool(assistant_text), "assistant_text_required")
    _require(assistant_text == assistant_text.strip(), "assistant_outer_whitespace_mismatch")
    parser = _SpanParser(assistant_text)
    root = parser.parse()
    _require(parser._ws(root.end) == len(assistant_text), "json_trailing_data")
    candidate = _member(root, "candidate", "object")
    spans: dict[str, list[tuple[int, int]]] = {name: [] for name in GROUPS}
    for key in ("claims", "relations", "unknowns", "conflicts"):
        node = _member(candidate, key, "array")
        spans["S"].append((node.start, node.end))
    question = _member(candidate, "question_proposal")
    _require(question.kind == "object" or question.value is None, "question_proposal_type")
    spans["S"].append((question.start, question.end))
    evidence = _member(root, "evidence_quotes", "array")
    spans["S"].append((evidence.start, evidence.end))
    surface = _member(candidate, "surface_proposal", "object")
    bindings = _member(surface, "bindings", "array")
    spans["S"].append((bindings.start, bindings.end))
    for key in ("observation", "reception", "update_note"):
        node = _member(surface, key)
        _require(node.kind == "string" or node.value is None, "surface_value_type:" + key)
        if node.kind == "string" and node.end > node.start + 2:
            spans["F"].append((node.start + 1, node.end - 1))
    updates = _member(candidate, "updates", "array")
    if updates.value:
        spans["U"].append((updates.start, updates.end))
    for name in GROUPS:
        spans[name].sort()
    indexed = sorted((start, end, group) for group in GROUPS for start, end in spans[group])
    for (_, end, _), (start, _, _) in zip(indexed, indexed[1:]):
        _require(end <= start, "focus_character_spans_overlap")
    return spans


def build_focus_token_weights(tokenizer: Any, encoded: dict, prefix: int,
                              assistant_text: str) -> dict:
    """Bind span-intersecting tokenizer offsets to existing helper encoding.

    A token may touch value delimiters or a same-group gap, as with ordinary
    BPE tokens, but touching two different groups is rejected. Every target
    retains a positive .5/full_count coefficient. EOS and template newline
    have only that full coefficient. The input IDs and labels are not edited.
    """
    spans = parse_focus_spans(assistant_text)
    ids, labels = encoded.get("input_ids"), encoded.get("labels")
    _require(isinstance(ids, list) and isinstance(labels, list) and bool(ids)
             and len(ids) == len(labels)
             and all(type(value) is int and value >= 0 for value in ids)
             and all(type(value) is int for value in labels), "encoded_shape_invalid")
    _require(type(prefix) is int and 0 < prefix < len(ids), "prefix_invalid")
    _require(labels[:prefix] == [-100] * prefix and labels[prefix:] == ids[prefix:],
             "prompt_or_target_labels_changed")
    tokenized = tokenizer(assistant_text, add_special_tokens=False, return_offsets_mapping=True)
    text_ids, offsets = tokenized["input_ids"], tokenized["offset_mapping"]
    _require(isinstance(text_ids, list) and bool(text_ids) and len(text_ids) == len(offsets),
             "token_offsets_shape_invalid")
    _require(ids[prefix:prefix + len(text_ids)] == text_ids, "full_teacher_prefix_mismatch")
    _require(prefix + len(text_ids) < len(ids), "assistant_end_tokens_missing")
    eos = getattr(tokenizer, "eos_token_id", None)
    _require(type(eos) is int and eos not in text_ids and ids[prefix + len(text_ids):].count(eos) == 1,
             "assistant_eos_not_unique_in_template_tail")
    suffix = tokenizer.decode(ids[prefix:], skip_special_tokens=False,
                              clean_up_tokenization_spaces=False)
    _require(suffix == assistant_text + "<|im_end|>\n", "assistant_completion_suffix_mismatch")
    groups: dict[str, list[int]] = {name: [] for name in GROUPS}
    for index, offset in enumerate(offsets):
        _require(isinstance(offset, (tuple, list)) and len(offset) == 2
                 and all(type(value) is int for value in offset), "token_offset_invalid")
        start, end = offset
        _require(0 <= start <= end <= len(assistant_text), "token_offset_out_of_bounds")
        touched = [name for name in GROUPS
                   if end > start and any(start < stop and end > begin for begin, stop in spans[name])]
        _require(len(touched) <= 1, "token_crosses_focus_groups")
        if touched:
            groups[touched[0]].append(prefix + index)
    for name in GROUPS:
        _require(not spans[name] or bool(groups[name]), "focus_group_has_no_tokens:" + name)
        # Require every nonempty source interval to be represented. This is
        # compatible with byte-fallback offsets that overlap one another.
        for begin, stop in spans[name]:
            _require(any(offsets[index - prefix][1] > offsets[index - prefix][0]
                         and offsets[index - prefix][0] < stop
                         and offsets[index - prefix][1] > begin for index in groups[name]),
                     "focus_span_has_no_tokens:" + name)
    active = [name for name in GROUPS if groups[name]]
    _require(bool(active), "no_active_focus_groups")
    count = len(ids) - prefix
    full_coefficient = 0.5 / count
    weights = [full_coefficient] * count
    for name in active:
        bonus = 0.5 / len(active) / len(groups[name])
        for absolute in groups[name]:
            weights[absolute - prefix] += bonus
    _require(all(math.isfinite(value) and value > 0 for value in weights), "focus_weights_invalid")
    _require(math.isclose(math.fsum(weights), 1.0, rel_tol=0, abs_tol=1e-12),
             "focus_weights_not_normalized")
    tail = list(range(prefix + len(text_ids), len(ids)))
    _require(all(weights[index - prefix] == full_coefficient for index in tail),
             "template_tail_focus_forbidden")
    return {
        "weights": weights,
        "groups": groups,
        "stats": {
            "char_spans": {name: [list(span) for span in spans[name]] for name in GROUPS},
            "group_token_counts": {name: len(groups[name]) for name in GROUPS},
            "active_groups": active,
            "full_target_tokens": count,
            "assistant_json_tokens": len(text_ids),
            "template_tail_tokens": len(tail),
            "template_tail_indices": tail,
            "full_component_mass": count * full_coefficient,
            "focus_component_mass": math.fsum(weights) - count * full_coefficient,
            "focus_component_mass_by_group": {
                name: 0.5 / len(active) if name in active else 0.0 for name in GROUPS},
            "full_coefficient_per_token": full_coefficient,
            "coefficient_sum": math.fsum(weights),
            "prompt_tokens": prefix,
            "prompt_labels_unchanged": True,
            "completion_ids_exact": True,
            "eos_full_only": True,
        },
    }
