from pathlib import Path

path = Path("tools/cocolon_context_routes.py")
text = path.read_text(encoding="utf-8")

old_import = "import base64\n"
new_import = "import argparse\nimport base64\n"
if text.count(old_import) != 1:
    raise SystemExit("loader argparse import preimage mismatch")
text = text.replace(old_import, new_import, 1)

old_base_main = "_base_main = main\n"
if text.count(old_base_main) != 1:
    raise SystemExit("loader base main preimage mismatch")
text = text.replace(old_base_main, "", 1)

old_guard = '''if __name__ == "__main__":
    _base_main()
'''
new_guard = '''def _parse_repo_roots(values: list[str]) -> dict[str, Path]:
    roots: dict[str, Path] = {}
    for value in values:
        key, separator, raw_path = value.partition("=")
        if not separator or not key or not raw_path:
            raise RouteGraphError(f"invalid --repo value: {value!r}")
        if key in roots:
            raise RouteGraphError(f"duplicate --repo key: {key}")
        roots[key] = Path(raw_path).resolve()
    return roots


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    build_parser = subparsers.add_parser("build")
    build_parser.add_argument("--inventory", required=True, type=Path)
    build_parser.add_argument("--repo", action="append", default=[], required=True)
    build_parser.add_argument("--code-index", required=True, type=Path)
    build_parser.add_argument("--rn-helper", required=True, type=Path)
    build_parser.add_argument("--output", required=True, type=Path)

    verify_parser = subparsers.add_parser("verify")
    verify_parser.add_argument("--inventory", required=True, type=Path)
    verify_parser.add_argument("--code-index", required=True, type=Path)
    verify_parser.add_argument("--output", required=True, type=Path)

    args = parser.parse_args(argv)
    if args.command == "build":
        summary = build_route_graph(
            args.inventory,
            _parse_repo_roots(args.repo),
            args.code_index,
            args.rn_helper,
            args.output,
        )
    else:
        summary = verify_route_graph(args.inventory, args.code_index, args.output)
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
'''
if text.count(old_guard) != 1:
    raise SystemExit("loader CLI guard preimage mismatch")
text = text.replace(old_guard, new_guard, 1)
path.write_text(text, encoding="utf-8")
