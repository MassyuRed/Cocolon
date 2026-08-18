from __future__ import annotations

import hashlib
import importlib.util
import json
import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).parents[2]
TOOL = ROOT / "tools" / "cocolon_context_publish_transport.py"
spec = importlib.util.spec_from_file_location("publication_transport", TOOL)
assert spec and spec.loader
publication_transport = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = publication_transport
spec.loader.exec_module(publication_transport)


def digest(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def make_outputs(root: pathlib.Path) -> bytes:
    (root / "code_index").mkdir(parents=True)
    (root / "route_graph").mkdir()

    files = root / "files.jsonl"
    files.write_text('{"path":"a"}\n', encoding="utf-8")

    reference_bytes = b"".join(
        (
            json.dumps(
                {"index": index, "value": "x" * 32},
                sort_keys=True,
            )
            + "\n"
        ).encode("utf-8")
        for index in range(24)
    )
    references = root / "code_index/references.jsonl"
    references.write_bytes(reference_bytes)

    symbols = root / "code_index/symbols.jsonl"
    symbols.write_text('{"symbol":"a"}\n', encoding="utf-8")

    route_summary = root / "route_graph/route_graph_summary.json"
    route_summary.write_text('{"edge_count":1}\n', encoding="utf-8")

    (root / "manifest.json").write_text(
        json.dumps(
            {"output_sha256": {"files.jsonl": digest(files)}},
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    (root / "code_index/code_index_manifest.json").write_text(
        json.dumps(
            {
                "output_sha256": {
                    "references.jsonl": digest(references),
                    "symbols.jsonl": digest(symbols),
                }
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    (root / "route_graph/route_graph_manifest.json").write_text(
        json.dumps(
            {
                "output_sha256": {
                    "route_graph_summary.json": digest(route_summary)
                }
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    return reference_bytes


def transport_bytes(root: pathlib.Path) -> dict[str, bytes]:
    return {
        path.relative_to(root).as_posix(): path.read_bytes()
        for path in sorted(root.rglob("*"))
        if path.is_file()
        and (
            path.name == publication_transport.MANIFEST_NAME
            or publication_transport.PART_RE.search(path.name)
        )
    }


class PublicationTransportTests(unittest.TestCase):
    def test_pack_and_verify_preserve_logical_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            original = make_outputs(root)
            result = publication_transport.pack_outputs(
                root,
                max_part_bytes=180,
            )
            self.assertEqual(result["verification"], "PASS")
            self.assertEqual(result["transported_logical_file_count"], 1)
            self.assertFalse(
                (root / "code_index/references.jsonl").exists()
            )
            manifest = json.loads(
                (root / publication_transport.MANIFEST_NAME).read_text(
                    encoding="utf-8"
                )
            )
            record = manifest["logical_files"][0]
            reconstructed = b"".join(
                (root / part["path"]).read_bytes()
                for part in record["parts"]
            )
            self.assertEqual(reconstructed, original)
            self.assertEqual(
                hashlib.sha256(reconstructed).hexdigest(),
                record["logical_sha256"],
            )
            verified = publication_transport.verify_outputs(root)
            self.assertEqual(verified["verification"], "PASS")

    def test_pack_is_byte_exact_deterministic(self) -> None:
        with tempfile.TemporaryDirectory() as left_raw, tempfile.TemporaryDirectory() as right_raw:
            left = pathlib.Path(left_raw)
            right = pathlib.Path(right_raw)
            make_outputs(left)
            make_outputs(right)
            publication_transport.pack_outputs(left, max_part_bytes=180)
            publication_transport.pack_outputs(right, max_part_bytes=180)
            self.assertEqual(transport_bytes(left), transport_bytes(right))

    def test_part_tamper_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = pathlib.Path(raw)
            make_outputs(root)
            publication_transport.pack_outputs(root, max_part_bytes=180)
            part = sorted(
                (root / "code_index").glob("references.jsonl.part*")
            )[0]
            part.write_bytes(part.read_bytes() + b"x")
            with self.assertRaises(
                publication_transport.PublicationTransportError
            ):
                publication_transport.verify_outputs(root)


if __name__ == "__main__":
    unittest.main()
