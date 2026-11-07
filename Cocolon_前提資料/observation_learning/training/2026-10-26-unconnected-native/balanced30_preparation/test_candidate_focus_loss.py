"""Deterministic CPU checks; synthetic tokenizers, no model/runtime imports."""

import copy
import json
import math
import unittest

from candidate_focus_loss import build_focus_token_weights, parse_focus_spans


class CharacterTokenizer:
    eos_token_id = 1

    def __call__(self, text, *, add_special_tokens, return_offsets_mapping):
        assert add_special_tokens is False and return_offsets_mapping is True
        return {"input_ids": [ord(char) + 10 for char in text],
                "offset_mapping": [(index, index + 1) for index in range(len(text))]}

    def decode(self, ids, *, skip_special_tokens, clean_up_tokenization_spaces):
        assert skip_special_tokens is False and clean_up_tokenization_spaces is False
        return "".join("<|im_end|>" if index == 1 else chr(index - 10) for index in ids)


def source_text(*, updates=None, observation='雪の説明を「最後まで」聞いた。',
                reception='文字列に \\"引用\\" と改行\\nを残す。', update_note=None):
    value = {
        "schema_version": "quote.v1",
        "candidate": {
            "claims": [{"claim_id": "g", "subject": "叔父", "predicate": "説明する"}],
            "relations": [{"source": "g", "target": "listen"}],
            "unknowns": [{"description": "二つの関係は分からない"}],
            "conflicts": [],
            "question_proposal": None,
            "surface_proposal": {
                "bindings": [{"claim_refs": ["g"], "update_refs": [0] if updates else []}],
                "observation": observation,
                "reception": reception,
                "update_note": update_note,
            },
            "updates": [] if updates is None else updates,
        },
        "evidence_quotes": [{"quote": "叔父が説明し、最後まで聞いた。"}],
    }
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def encoding(tokenizer, text):
    prompt = [7, 8, 9]
    text_ids = tokenizer(text, add_special_tokens=False, return_offsets_mapping=True)["input_ids"]
    ids = prompt + text_ids + [tokenizer.eos_token_id, ord("\n") + 10]
    return {"input_ids": ids, "labels": [-100] * len(prompt) + ids[len(prompt):]}, len(prompt)


class FocusLossTests(unittest.TestCase):
    def setUp(self):
        self.tokenizer = CharacterTokenizer()

    def test_unicode_escaped_strings_preserve_exact_source_intervals(self):
        text = source_text(observation='雪と"二重引用"、改行\n、バックスラッシュ\\、絵文字🌸。')
        spans = parse_focus_spans(text)
        surface = json.loads(text)["candidate"]["surface_proposal"]
        self.assertEqual([json.loads('"' + text[start:stop] + '"')
                          for start, stop in spans["F"]],
                         [surface["observation"], surface["reception"]])
        self.assertIn('\\"二重引用\\"', text[spans["F"][0][0]:spans["F"][0][1]])
        self.assertIn("\\n", text[spans["F"][0][0]:spans["F"][0][1]])
        self.assertIn("🌸", text[spans["F"][0][0]:spans["F"][0][1]])

    def test_semantics_contains_surface_bindings_but_not_surface_values(self):
        text = source_text()
        spans = parse_focus_spans(text)
        values = [text[start:stop] for start, stop in spans["S"]]
        self.assertEqual(len(values), 7)
        self.assertTrue(any('"claim_refs"' in value for value in values))
        self.assertFalse(any("雪の説明" in value for value in values))

    def test_empty_updates_and_null_update_note_are_inactive(self):
        text = source_text()
        encoded, prefix = encoding(self.tokenizer, text)
        result = build_focus_token_weights(self.tokenizer, encoded, prefix, text)
        self.assertEqual(result["groups"]["U"], [])
        self.assertEqual(result["stats"]["active_groups"], ["S", "F"])
        self.assertEqual(result["stats"]["focus_component_mass_by_group"],
                         {"S": .25, "F": .25, "U": 0.0})
        self.assertEqual(len(result["stats"]["char_spans"]["F"]), 2)

    def test_nonempty_updates_and_update_note_are_weighted(self):
        text = source_text(updates=[{"operation": "ADD", "target_ref": "missing"}],
                           update_note="対象の説明が加わったのですね。")
        encoded, prefix = encoding(self.tokenizer, text)
        result = build_focus_token_weights(self.tokenizer, encoded, prefix, text)
        self.assertEqual(result["stats"]["active_groups"], ["S", "F", "U"])
        self.assertEqual(len(result["stats"]["char_spans"]["F"]), 3)
        self.assertTrue(result["groups"]["U"])
        self.assertAlmostEqual(result["stats"]["focus_component_mass_by_group"]["U"], 1 / 6)

    def test_coefficients_match_direct_mean_objective_and_sum_to_one(self):
        text = source_text(updates=[{"operation": "ADD"}])
        encoded, prefix = encoding(self.tokenizer, text)
        result = build_focus_token_weights(self.tokenizer, encoded, prefix, text)
        weights = result["weights"]
        ce = [math.log1p(index % 19) for index in range(len(weights))]
        weighted = math.fsum(weight * value for weight, value in zip(weights, ce))
        means = [math.fsum(ce[index - prefix] for index in result["groups"][name])
                 / len(result["groups"][name]) for name in result["stats"]["active_groups"]]
        direct = .5 * math.fsum(ce) / len(ce) + .5 * math.fsum(means) / len(means)
        self.assertAlmostEqual(weighted, direct, places=13)
        self.assertAlmostEqual(math.fsum(weights), 1, places=14)
        self.assertTrue(all(value > 0 for value in weights))
        self.assertEqual(len(weights), len(encoded["input_ids"]) - prefix)

    def test_prompt_ids_and_labels_unchanged_eos_and_newline_full_only(self):
        text = source_text(updates=[{"operation": "ADD"}])
        encoded, prefix = encoding(self.tokenizer, text)
        original = copy.deepcopy(encoded)
        result = build_focus_token_weights(self.tokenizer, encoded, prefix, text)
        self.assertEqual(encoded, original)
        self.assertEqual(encoded["labels"][:prefix], [-100] * prefix)
        self.assertTrue(all(index >= prefix for group in result["groups"].values() for index in group))
        base = .5 / len(result["weights"])
        self.assertEqual(result["weights"][-2:], [base, base])
        self.assertEqual(result["stats"]["full_component_mass"], .5)
        self.assertAlmostEqual(result["stats"]["focus_component_mass"], .5)

    def test_a_token_intersecting_two_groups_is_rejected(self):
        text = source_text(updates=[{"operation": "ADD"}])

        class MergedTokenizer(CharacterTokenizer):
            def __call__(self, value, **kwargs):
                return {"input_ids": [777], "offset_mapping": [(0, len(value))]}

            def decode(self, ids, **kwargs):
                return text + "<|im_end|>\n"

        tokenizer = MergedTokenizer()
        encoded, prefix = encoding(tokenizer, text)
        with self.assertRaisesRegex(ValueError, "token_crosses_focus_groups"):
            build_focus_token_weights(tokenizer, encoded, prefix, text)

    def test_crossing_plain_gap_and_one_group_selects_by_intersection(self):
        text = source_text()
        start, end = parse_focus_spans(text)["F"][0]

        class BoundaryTokenizer(CharacterTokenizer):
            def __call__(self, value, **kwargs):
                result = super().__call__(value, **kwargs)
                # Synthetic subword touches the preceding quote and one
                # content character; intersection still selects F.
                result["offset_mapping"][start] = (start - 1, start + 1)
                return result

        tokenizer = BoundaryTokenizer()
        encoded, prefix = encoding(tokenizer, text)
        result = build_focus_token_weights(tokenizer, encoded, prefix, text)
        self.assertIn(prefix + start, result["groups"]["F"])

    def test_duplicate_keys_at_any_depth_are_rejected(self):
        text = source_text().replace('"claim_id":"g"', '"claim_id":"g","claim_id":"other"')
        with self.assertRaisesRegex(ValueError, "duplicate_json_key:claim_id"):
            parse_focus_spans(text)

    def test_empty_offset_inside_value_has_no_focus(self):
        text = source_text()
        start, end = parse_focus_spans(text)["F"][0]

        class EmptyOffsetTokenizer(CharacterTokenizer):
            def __call__(self, value, **kwargs):
                result = super().__call__(value, **kwargs)
                result["offset_mapping"][start + 1] = (start + 1, start + 1)
                return result

        tokenizer = EmptyOffsetTokenizer()
        encoded, prefix = encoding(tokenizer, text)
        result = build_focus_token_weights(tokenizer, encoded, prefix, text)
        self.assertNotIn(prefix + start + 1, result["groups"]["F"])
        self.assertEqual(result["weights"][start + 1], .5 / len(result["weights"]))

    def test_decoded_duplicate_keys_are_rejected(self):
        text = source_text().replace('"claim_id":"g"', '"claim_id":"g","claim_\\u0069d":"other"')
        with self.assertRaisesRegex(ValueError, "duplicate_json_key:claim_id"):
            parse_focus_spans(text)

    def test_original_token_ids_mismatch_is_rejected(self):
        text = source_text()
        encoded, prefix = encoding(self.tokenizer, text)
        encoded["input_ids"][prefix] += 1
        encoded["labels"][prefix] += 1
        with self.assertRaisesRegex(ValueError, "full_teacher_prefix_mismatch"):
            build_focus_token_weights(self.tokenizer, encoded, prefix, text)

    def test_nonmasked_prompt_and_changed_target_labels_are_rejected(self):
        text = source_text()
        encoded, prefix = encoding(self.tokenizer, text)
        for index, value in [(0, encoded["input_ids"][0]), (prefix + 2, -100)]:
            changed = copy.deepcopy(encoded)
            changed["labels"][index] = value
            with self.assertRaisesRegex(ValueError, "prompt_or_target_labels_changed"):
                build_focus_token_weights(self.tokenizer, changed, prefix, text)

    def test_eos_must_remain_in_tail(self):
        text = source_text()
        encoded, prefix = encoding(self.tokenizer, text)
        encoded["input_ids"][-2] = encoded["labels"][-2] = 2
        with self.assertRaisesRegex(ValueError, "assistant_eos_not_unique_in_template_tail"):
            build_focus_token_weights(self.tokenizer, encoded, prefix, text)

    def test_empty_strings_do_not_activate_surface_group(self):
        text = source_text(observation="", reception="")
        encoded, prefix = encoding(self.tokenizer, text)
        result = build_focus_token_weights(self.tokenizer, encoded, prefix, text)
        self.assertEqual(result["groups"]["F"], [])
        self.assertEqual(result["stats"]["active_groups"], ["S"])
        self.assertEqual(result["stats"]["focus_component_mass_by_group"]["S"], .5)

    def test_nonstring_surface_trailing_data_and_nonfinite_rejected(self):
        bad = source_text().replace('"update_note":null', '"update_note":true')
        with self.assertRaisesRegex(ValueError, "surface_value_type:update_note"):
            parse_focus_spans(bad)
        with self.assertRaisesRegex(ValueError, "json_trailing_data"):
            parse_focus_spans(source_text() + " true")
        bad = source_text().replace('"question_proposal":null', '"question_proposal":NaN')
        with self.assertRaisesRegex(ValueError, "nonfinite_json_constant"):
            parse_focus_spans(bad)


if __name__ == "__main__":
    unittest.main()
