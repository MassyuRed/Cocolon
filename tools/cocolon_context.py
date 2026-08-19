"""Public CLI for Cocolon System Context.

``context`` remains the Step 4 task compiler.  ``prepare`` is the Step 5
standard entry that resolves freshness and reuses or refreshes Steps 1-4 before
returning the task context and full-text read order.
"""
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Sequence

from tools.cocolon_context_prepare import cli as prepare_cli
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

    prepare = subparsers.add_parser(
        "prepare",
        help="resolve, verify or refresh Steps 1-4 through the standard entry",
    )
    prepare.add_argument("--workspace", required=True)
    prepare.add_argument("--task", required=True)
    prepare.add_argument("--repo-root", type=Path, default=Path.cwd())
    prepare.add_argument("--system-context-root", type=Path)
    prepare.add_argument("--external-workspace-root", type=Path)
    prepare.add_argument("--remote-verified", action="store_true", help=argparse.SUPPRESS)
    prepare.add_argument("--fresh-clone-verified", action="store_true", help=argparse.SUPPRESS)
    prepare.add_argument(
        "--non-code-incremental-verified",
        action="store_true",
        help=argparse.SUPPRESS,
    )
    prepare.add_argument("--verify-only", action="store_true")
    prepare.add_argument("--require-remote-verified", action="store_true")
    prepare.add_argument("--max-part-bytes", type=int, default=90_000_000)
    return parser


def _run_context(args: argparse.Namespace, parser: argparse.ArgumentParser) -> int:
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
        else system_context_root / "current" / args.workspace / "task_context" / args.task
    )
    try:
        result = compile_task_context(
            repo_root=repo_root,
            system_context_root=system_context_root,
            workspace=args.workspace,
            task=args.task,
            task_profiles_path=task_profiles,
            manual_overlay_path=args.manual_overlay.resolve() if args.manual_overlay else None,
            output_dir=output,
            remote_verified=False,
        )
    except ContextCompileError as exc:
        parser.error(str(exc))
    print(result.context_fingerprint)
    print(result.status)
    print(result.output_dir)
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "context":
        return _run_context(args, parser)
    forwarded = ["--workspace", args.workspace, "--task", args.task, "--repo-root", str(args.repo_root)]
    if args.system_context_root:
        forwarded.extend(("--system-context-root", str(args.system_context_root)))
    if args.external_workspace_root:
        forwarded.extend(("--external-workspace-root", str(args.external_workspace_root)))
    if args.remote_verified:
        forwarded.append("--remote-verified")
    if args.fresh_clone_verified:
        forwarded.append("--fresh-clone-verified")
    if args.non_code_incremental_verified:
        forwarded.append("--non-code-incremental-verified")
    if args.verify_only:
        forwarded.append("--verify-only")
    if args.require_remote_verified:
        forwarded.append("--require-remote-verified")
    forwarded.extend(("--max-part-bytes", str(args.max_part_bytes)))
    return prepare_cli(forwarded)


if __name__ == "__main__":
    raise SystemExit(main())
