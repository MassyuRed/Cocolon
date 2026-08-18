#!/usr/bin/env python3
"""Generate and verify Cocolon's locked two-repository SCIP/syntax index."""
from __future__ import annotations

import pathlib
import sys
from typing import Sequence

TOOLS_DIR = pathlib.Path(__file__).resolve().parent
if str(TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(TOOLS_DIR))

from cocolon_context_index_common import *  # noqa: F401,F403,E402
from cocolon_context_index_syntax import *  # noqa: F401,F403,E402
from cocolon_context_index_scip_consume import *  # noqa: F401,F403,E402
from cocolon_context_index_scip_run import *  # noqa: F401,F403,E402
from cocolon_context_index_build import *  # noqa: F401,F403,E402


def add_common_build_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--profiles", required=True, type=pathlib.Path)
    parser.add_argument("--workspace", required=True)
    parser.add_argument("--inventory", required=True, type=pathlib.Path)
    parser.add_argument("--repo", action="append", required=True)


def cli(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    run_parser = sub.add_parser("run-scip")
    add_common_build_args(run_parser)
    run_parser.add_argument("--work", required=True, type=pathlib.Path)

    build_parser = sub.add_parser("build")
    add_common_build_args(build_parser)
    build_parser.add_argument("--scip-work", required=True, type=pathlib.Path)
    build_parser.add_argument("--output", required=True, type=pathlib.Path)

    verify_parser = sub.add_parser("verify")
    verify_parser.add_argument("--inventory", required=True, type=pathlib.Path)
    verify_parser.add_argument("--output", required=True, type=pathlib.Path)

    args = parser.parse_args(argv)
    try:
        if args.command == "run-scip":
            result = run_scip(args.profiles, args.workspace, args.inventory, repo_args(args.repo), args.work)
            print(canon(result).decode("utf-8"), end="")
            return 0
        if args.command == "build":
            result = build_index(
                profiles=args.profiles,
                workspace=args.workspace,
                inventory_path=args.inventory,
                repos=repo_args(args.repo),
                scip_work=args.scip_work,
                output=args.output,
            )
            print(canon(result).decode("utf-8"), end="")
            return 0 if result["completion_claim"] == "STEP2_SCIP_AND_SYNTAX_INDEX_CONNECTED" else 2
        result = verify_index(args.inventory, args.output)
        print(canon(result).decode("utf-8"), end="")
        return 0
    except CodeIndexError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(cli())
