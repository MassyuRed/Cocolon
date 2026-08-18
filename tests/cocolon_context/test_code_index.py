from __future__ import annotations

import importlib.util
import pathlib
import sys
import unittest

TOOL = pathlib.Path(__file__).parents[2] / "tools" / "cocolon_context_code_index.py"
spec = importlib.util.spec_from_file_location("code_index", TOOL)
assert spec and spec.loader
code_index = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = code_index
spec.loader.exec_module(code_index)


class CodeIndexTests(unittest.TestCase):
    def test_python_symbols_and_imports(self) -> None:
        symbols, refs = code_index.py_parse(
            "x.py",
            "import os\nfrom a import b\nclass C:\n    pass\ndef f():\n    pass\n",
        )
        self.assertEqual({row["name"] for row in symbols}, {"C", "f"})
        self.assertTrue(any(row["target"] == "os" for row in refs))
        self.assertTrue(any(row["target"] == "a.b" for row in refs))

    def test_js_symbols_and_imports(self) -> None:
        symbols, refs = code_index.js_parse(
            "import x from './a';\nconst f = () => 1;\nclass C {}\n"
        )
        self.assertEqual({row["name"] for row in symbols}, {"f", "C"})
        self.assertEqual(refs[0]["target"], "./a")

    def test_relative_resolution(self) -> None:
        self.assertEqual(
            code_index.resolve_relative("screens/X.js", "../lib/a", {"lib/a.js"}),
            "lib/a.js",
        )

    def test_generic_symbols(self) -> None:
        symbols, _ = code_index.generic_parse("class Foo {}\nfunc bar() {}\n")
        self.assertEqual([row["name"] for row in symbols], ["Foo", "bar"])


if __name__ == "__main__":
    unittest.main()
