from __future__ import annotations

import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from tools.cocolon_context_publish_transport import (
    PublicationTransportError,
    materialize_outputs,
    pack_outputs,
    verify_outputs,
)


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, sort_keys=True) + "\n", encoding="utf-8")


class NestedPublicationTransportTests(unittest.TestCase):
    def _workspace(self, root: Path) -> tuple[Path, Path, bytes, bytes]:
        workspace = root / "workspace"
        task = workspace / "task_context/cmee"
        code = (b'{"row":1}\n' * 40)
        closure = (b'{"edge":1}\n' * 40)
        workspace.mkdir(parents=True)
        (workspace / "files.jsonl").write_bytes(b"{}\n")
        write_json(workspace / "manifest.json", {"output_sha256": {"files.jsonl": sha(b"{}\n")}})
        (workspace / "code_index").mkdir()
        (workspace / "code_index/references.jsonl").write_bytes(code)
        write_json(workspace / "code_index/code_index_manifest.json", {"output_sha256": {"references.jsonl": sha(code)}})
        (workspace / "route_graph").mkdir()
        (workspace / "route_graph/routes.jsonl").write_bytes(b"[]\n")
        write_json(workspace / "route_graph/route_graph_manifest.json", {"output_sha256": {"routes.jsonl": sha(b"[]\n")}})
        task.mkdir(parents=True)
        (task / "closure_edges.jsonl").write_bytes(closure)
        write_json(task / "context_manifest.json", {"output_sha256": {"closure_edges.jsonl": sha(closure)}})
        return workspace, task, code, closure

    def test_nested_transport_is_independently_owned_and_materializable(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            workspace, task, code, closure = self._workspace(Path(td))
            task_result = pack_outputs(task, 64)
            root_result = pack_outputs(workspace, 64)
            self.assertEqual(task_result["transport_kind"], "TASK_CONTEXT")
            self.assertEqual(root_result["transport_kind"], "WORKSPACE")
            self.assertGreater(task_result["transport_part_count"], 1)
            self.assertGreater(root_result["transport_part_count"], 1)
            self.assertEqual(verify_outputs(workspace)["verification"], "PASS")
            self.assertEqual(verify_outputs(task)["verification"], "PASS")
            materialized = materialize_outputs(task, Path(td) / "materialized")
            self.assertEqual((materialized / "closure_edges.jsonl").read_bytes(), closure)

    def test_task_part_tamper_is_rejected_without_becoming_parent_part(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            workspace, task, _, _ = self._workspace(Path(td))
            pack_outputs(task, 64)
            pack_outputs(workspace, 64)
            part = next(task.glob("closure_edges.jsonl.part*"))
            part.write_bytes(part.read_bytes() + b"x")
            with self.assertRaises(PublicationTransportError):
                verify_outputs(task)
            # Parent transport deliberately ignores parts owned by nested task.
            self.assertEqual(verify_outputs(workspace)["verification"], "PASS")

    def test_undeclared_parent_part_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            workspace, task, _, _ = self._workspace(Path(td))
            pack_outputs(task, 64)
            pack_outputs(workspace, 64)
            (workspace / "rogue.jsonl.part0000").write_bytes(b"rogue\n")
            with self.assertRaises(PublicationTransportError):
                verify_outputs(workspace)

    def test_repack_requires_regenerated_canonical_outputs(self) -> None:
        with tempfile.TemporaryDirectory() as td:
            workspace, task, _, _ = self._workspace(Path(td))
            pack_outputs(task, 64)
            part = next(task.glob("closure_edges.jsonl.part*"))
            part.unlink()
            with self.assertRaises(PublicationTransportError):
                pack_outputs(task, 64)


if __name__ == "__main__":
    unittest.main()
