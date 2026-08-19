"""Public CLI for Cocolon System Context.

Step 4 intentionally exposes one public controller.  The implementation lives in
``tools.cocolon_context_task`` so the existing inventory/code-index/route
families are reused rather than duplicated.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Sequence

from tools.cocolon_context_task import ContextCompileError, compile_task_context


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="python3 -m tools.cocolon_context")
    subparsers = parser.add_subparsers(dest="command", required=True)

    context = subparsers.add_parser(
        "context",
        help="compile a task-scoped, manifest-bound System Context",
    )
    context.add_argument("--workspace", required=True)
    context.add_argument("--task", required=True)
    context.add_argument("--repo-root", type=Path, default=Path.cwd())
    context.add_argument(
        "--system-context-root",
        type=Path,
        help="defaults to <repo-root>/Cocolon_前提資料/system_context",
    )
    context.add_argument("--task-profiles", type=Path)
    context.add_argument("--manual-overlay", type=Path)
    context.add_argument("--output", type=Path)
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command != "context":  # pragma: no cover - argparse guards this
        raise AssertionError(args.command)

    repo_root = args.repo_root.resolve()
    system_context_root = (
        args.system_context_root.resolve()
        if args.system_context_root
        else repo_root / "Cocolon_前提資料" / "system_context"
    )
    task_profiles = (
        args.task_profiles.resolve()
        if args.task_profiles
        else system_context_root / "task_profiles.json"
    )
    output = (
        args.output.resolve()
        if args.output
        else system_context_root
        / "current"
        / args.workspace
        / "task_context"
        / args.task
    )

    try:
        result = compile_task_context(
            repo_root=repo_root,
            system_context_root=system_context_root,
            workspace=args.workspace,
            task=args.task,
            task_profiles_path=task_profiles,
            manual_overlay_path=(
                args.manual_overlay.resolve() if args.manual_overlay else None
            ),
            output_dir=output,
            remote_verified=False,
        )
    except ContextCompileError as exc:
        parser.error(str(exc))

    print(result.context_fingerprint)
    print(result.status)
    print(result.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
