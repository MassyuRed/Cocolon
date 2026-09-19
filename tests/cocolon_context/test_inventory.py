from __future__ import annotations

import importlib.util
import json
import pathlib
import subprocess
import sys
import tempfile
import unittest

TOOL = pathlib.Path(__file__).parents[2] / "tools" / "cocolon_context_inventory.py"
spec = importlib.util.spec_from_file_location("inventory", TOOL)
assert spec and spec.loader
inventory = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = inventory
spec.loader.exec_module(inventory)

def cmd(*args: str, cwd: pathlib.Path) -> str:
    return subprocess.check_output(args, cwd=cwd, text=True).strip()

def make_repo(root: pathlib.Path, name: str, files: dict[str, bytes]) -> pathlib.Path:
    repo = root / name
    repo.mkdir()
    cmd("git", "init", "-q", cwd=repo)
    cmd("git", "config", "user.email", "test@example.invalid", cwd=repo)
    cmd("git", "config", "user.name", "test", cwd=repo)
    for path, data in files.items():
        target = repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    cmd("git", "add", ".", cwd=repo)
    cmd("git", "commit", "-q", "-m", "initial", cwd=repo)
    return repo

def profiles(path: pathlib.Path, first: pathlib.Path, second: pathlib.Path, *, ancestor: bool = False) -> pathlib.Path:
    head1 = cmd("git", "rev-parse", "HEAD", cwd=first)
    head2 = cmd("git", "rev-parse", "HEAD", cwd=second)
    cocolon = {"repository": "example/Cocolon", "checkout_ref": "SELF", "role": "rn"}
    cocolon["expected_ancestor" if ancestor else "expected_head"] = head1
    value = {"schema_version": inventory.PROFILE_SCHEMA, "profiles": {"fixture": {"purpose": "test", "repositories": {"Cocolon": cocolon, "mashos-api": {"repository": "example/mashos-api", "checkout_ref": "main", "expected_head": head2, "role": "api"}}}}}
    path.write_text(json.dumps(value), encoding="utf-8")
    return path

class InventoryTests(unittest.TestCase):
    def test_complete_population_and_untracked_exclusion(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            a = make_repo(root, "Cocolon", {"App.js": b"x\n", "assets/pixel.bin": b"\x00\x01"})
            b = make_repo(root, "mashos-api", {"api.py": b"y\n", "README.md": b"z\n"})
            (a / "untracked.tmp").write_text("no")
            p = profiles(root / "profiles.json", a, b)
            out = root / "out"
            manifest = inventory.build(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)
            self.assertEqual(manifest["total_tracked_entries"], 4)
            rows = [json.loads(x) for x in (out / "files.jsonl").read_text().splitlines()]
            self.assertEqual(len(rows), 4)
            self.assertNotIn("untracked.tmp", {r["path"] for r in rows})
            inventory.verify(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)

    def test_tamper_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            a = make_repo(root, "Cocolon", {"App.js": b"x\n"})
            b = make_repo(root, "mashos-api", {"api.py": b"y\n"})
            p = profiles(root / "profiles.json", a, b)
            out = root / "out"
            inventory.build(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)
            (out / "files.jsonl").write_text("{}\n", encoding="utf-8")
            with self.assertRaises(inventory.InventoryError):
                inventory.verify(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)

    def test_expected_ancestor_allows_stacked_branch(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            a = make_repo(root, "Cocolon", {"one.txt": b"1\n"})
            b = make_repo(root, "mashos-api", {"api.py": b"y\n"})
            p = profiles(root / "profiles.json", a, b, ancestor=True)
            (a / "two.txt").write_text("2\n")
            cmd("git", "add", "two.txt", cwd=a); cmd("git", "commit", "-q", "-m", "second", cwd=a)
            inventory.build(p, "fixture", {"Cocolon": a, "mashos-api": b}, root / "out")

    def test_verify_uses_locked_source_after_generated_commit(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            a = make_repo(root, "Cocolon", {"App.js": b"x\n"})
            b = make_repo(root, "mashos-api", {"api.py": b"y\n"})
            source = cmd("git", "rev-parse", "HEAD", cwd=a)
            p = profiles(root / "profiles.json", a, b, ancestor=True)
            out = a / "Cocolon_前提資料/system_context/current/fixture"
            inventory.build(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)
            cmd("git", "add", "Cocolon_前提資料/system_context/current/fixture", cwd=a)
            cmd("git", "commit", "-q", "-m", "generated", cwd=a)
            self.assertNotEqual(source, cmd("git", "rev-parse", "HEAD", cwd=a))
            inventory.verify(p, "fixture", {"Cocolon": a, "mashos-api": b}, out)

if __name__ == "__main__":
    unittest.main()
