"""CPU regression checks using the pinned real Qwen tokenizer; no model weights."""
from collections.abc import Mapping
from pathlib import Path
import unittest

from transformers import AutoTokenizer, __version__

from run_pilot import CONTEXT, MAX_NEW, MODEL, PINS, REVISION, chat_token_ids, encode_training, validate_data


class TokenizationRegression(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if __version__ != PINS["transformers"]:
            raise RuntimeError("Run with the pinned Transformers version")
        cls.tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
        cls.examples, cls.evaluation = validate_data(Path(__file__).resolve().parent)

    def test_old_default_reproduces_wrong_prefix_comparison(self):
        messages = self.examples[0]["messages"]
        prompt = self.tokenizer.apply_chat_template(messages[:-1], tokenize=True, add_generation_prompt=True, enable_thinking=False)
        full = self.tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=False, enable_thinking=False)
        self.assertIsInstance(prompt, Mapping)
        self.assertIsInstance(full, Mapping)
        self.assertNotEqual(full[:len(prompt)], prompt)
        self.assertEqual(full["input_ids"][:len(prompt["input_ids"])], prompt["input_ids"])

    def test_all_nine_completion_masks_and_end_tokens(self):
        for example in self.examples:
            with self.subTest(example=example["id"]):
                item, prefix = encode_training(self.tokenizer, example["messages"])
                self.assertEqual(item["labels"][:prefix], [-100] * prefix)
                self.assertEqual(item["labels"][prefix:], item["input_ids"][prefix:])
                self.assertGreater(len(item["input_ids"]), prefix)
                self.assertLessEqual(len(item["input_ids"]), CONTEXT)
                suffix = self.tokenizer.decode(item["labels"][prefix:], skip_special_tokens=False, clean_up_tokenization_spaces=False)
                self.assertEqual(suffix, example["messages"][-1]["content"].strip() + "<|im_end|>\n")

    def test_all_six_eval_input_shapes_and_context_limits(self):
        for case in self.evaluation:
            with self.subTest(case=case["case_id"]):
                ids = chat_token_ids(self.tokenizer, case["messages"], generation_prompt=True)
                self.assertIsInstance(ids, list)
                self.assertTrue(all(isinstance(token, int) for token in ids))
                self.assertLessEqual(len(ids) + MAX_NEW, CONTEXT)


if __name__ == "__main__":
    unittest.main(verbosity=2)
