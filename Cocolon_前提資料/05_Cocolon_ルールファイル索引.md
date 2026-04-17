---
doc_id: cocolon_rule_file_index
title: "Cocolon ルールファイル索引"
revision_date: "2026-04-17"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
file_counts:
  Cocolon: 133
  mashos-api: 238
purpose: "見落とすと設計誤読しやすい rule file / policy file / behavior file を索引化する"
---

# 1. 先に結論

**rule file がある変更は、画面の見た目より rule file を先に読む。**

# 2. 文書としての rule files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/docs/API_CONTRACT_POLICY.md` | public route / request / response / unread / startup payload を触る時 | breaking change / additive-only 違反 |
| `mashos-api/ai/docs/PUBLIC_API_REGISTRY.md` | public mobile-facing route を増減・ rename・置換する時 | route 追加漏れ / 互換漏れ |
| `mashos-api/ai/docs/NATIONAL_ALIGNMENT_AUDIT_PHASE5.md` | RN/API 境界や contract 運用を触る時 | display-only 原則や contract enforcement の見落とし |
| `mashos-api/ai/docs/TUTORIAL_STABILITY_REDESIGN.md` | tutorial の target / overlay / scroll / proxy press を触る時 | 実機差によるズレ / タップ抜け |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE3.md` | env / release-check / public/private config を触る時 | release env 不整合 |
| `Cocolon/SUBSCRIPTION_RELEASE_PHASE4.md` | live console 確認や store product 設定に触る時 | Apple/Google console 側の live mismatch |
| `mashos-api/ai/docs/iap_subscription_update.md` | IAP runtime / bootstrap / subscription sales copy を触る時 | 片側だけの課金設定変更 |

# 3. コードとしての rule files

| path | いつ必須か | 何を防ぐか |
|---|---|---|
| `mashos-api/ai/services/ai_inference/api_contract_registry.py` | public route 変更時 | contract registry 更新漏れ |
| `mashos-api/ai/services/ai_inference/middleware_api_contract.py` | public response metadata を触る時 | header contract drift |
| `mashos-api/scripts/check_no_direct_supabase.py` | RN data access を触る時 | RN での direct Supabase / raw fetch 回帰 |
| `mashos-api/ai/tests/contract/*` | route / response / registry / header 変更時 | contract drift の未検出 |
| `mashos-api/ai/services/ai_inference/publish_governance.py` | visible / READY / retention / publish state を触る時 | RN 側だけ直して真因を外す |
| `mashos-api/ai/services/ai_inference/startup_snapshot_store.py` | startup badge / popup / light summary を触る時 | App.js と backend section の不整合 |
| `mashos-api/ai/services/ai_inference/astor_material_snapshots.py` | derived data 材料範囲を触る時 | snapshot 起点の見落とし |
| `mashos-api/ai/services/ai_inference/astor_worker.py` | generate / inspect / refresh / analyze を触る時 | worker fan-out 見落とし |
| `mashos-api/ai/services/ai_inference/generation_lock.py` | 重複実行や enqueue を触る時 | race / duplicate generation |

# 4. rule の核 excerpt

## 4-1. API contract policy
```md
# Cocolon Public API Contract Policy

Policy version: `2026-03-20.mymodel-qna-unread-status.v1`

## Core rules

1. RN is display-only.
2. Existing requests are additive-only.
3. Existing responses are additive-only.
4. Breaking changes require a new endpoint or version.
5. The server absorbs compatibility for older builds.
6. Every public API response carries policy metadata headers.
7. Compatibility must be guarded by automated tests.
8. Deprecated public routes must declare their replacement route/version when one exists.

## Why this policy exists

This policy revision adds `/mymodel/qna/unread-status` so MyModel Home unread
aggregation stays server-owned across the viewer's accessible reflections, while existing
v1 routes remain additive-only and backward compatible.
```

## 4-2. direct Supabase / raw fetch guard
```python
#!/usr/bin/env python3
from __future__ import annotations

import os
import re
import sys
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_PATTERNS: Sequence[Tuple[str, re.Pattern[str]]] = (
    ("supabase.from(", re.compile(r"\bsupabase\.from\s*\(")),
    ("supabase.rpc(", re.compile(r"\bsupabase\.rpc\s*\(")),
    ("supabase.channel(", re.compile(r"\bsupabase\.channel\s*\(")),
    ("raw fetch(", re.compile(r"(?<![\w$.])fetch\s*\(")),
)
SOURCE_SUFFIXES = {".js", ".jsx", ".ts", ".tsx"}
RN_ROOT_ENV_VARS = ("COCOLON_RN_ROOT", "RN_ROOT")


def _looks_like_rn_root(path: Path) -> bool:
    return (
        path.is_dir()
        and (path / "App.js").is_file()
        and (path / "lib").is_dir()
        and (path / "screens").is_dir()
    )



def _iter_candidate_rn_roots() -> Iterable[Path]:
    seen: set[str] = set()

    def _yield(path: Path) -> Iterable[Path]:
        try:
            resolved = path.resolve()
        except FileNotFoundError:
            resolved = path.absolute()
        key = str(resolved)
        if key in seen:
            return
        seen.add(key)
        yield path

    for env_name in RN_ROOT_ENV_VARS:
        value = os.environ.get(env_name)
        if value:
            yield from _yield(Path(value).expanduser())

    anchors = [ROOT, ROOT.parent, *ROOT.parents[:2]]
    candidate_names = ("cocolon-mvp", "RN(アプリ側)")
    for anchor in anchors:
        yield from _yield(anchor)
        for name in candidate_names:
            yield from _yield(anchor / name)
```

## 4-3. National Alignment Audit
```md
# National Alignment Audit — Phase 5

## Alignment target

This phase translates the national architecture direction into enforceable runtime policy:

- RN remains display-oriented.
- Public behavior is governed at the API boundary.
- Compatibility for older builds is preserved at the server boundary.
- Observability and policy metadata are emitted on every public response.

## What Phase 5 adds

1. A public API contract registry for v1 mobile-facing routes.
2. Runtime response headers for policy version, request ID, contract ID, and deprecation metadata.
3. Automated compatibility tests for legacy `/emotion/submit` behavior.
4. Guardrails against RN direct Supabase regressions.
5. Documentation that makes the contract policy auditable.

## What is aligned now

- RN direct table reads/writes are guarded against regression.
- Public contract ownership is explicit and centralized.
- Compatibility policy is testable instead of implicit.
- The backend can evolve internal tables and logic without forcing a mobile rebuild, as long as the public contract stays additive.

## Remaining gaps after Phase 5

```

# 5. 見落としやすい対応表

| 変更内容 | 先に読むもの |
|---|---|
| API path rename | `API_CONTRACT_POLICY.md`, `PUBLIC_API_REGISTRY.md`, `api_contract_registry.py`, `tests/contract/*` |
| response shape 変更 | 同上 |
| Input の derived state 変更 | `astor_material_snapshots.py`, `astor_worker.py`, `publish_governance.py` |
| unread / badge / startup popup | `startup_snapshot_store.py`, `api_app_bootstrap.py`, `App.js` |
| tutorial step 追加 | `TUTORIAL_STABILITY_REDESIGN.md`, `TutorialOverlay.js` |
| RN data access 変更 | `check_no_direct_supabase.py`, `lib/apiClient.js` |
| subscription product / env 変更 | `SUBSCRIPTION_RELEASE_PHASE3.md`, `SUBSCRIPTION_RELEASE_PHASE4.md`, `api_subscription.py`, `subscription_*` |

# 6. いまの注意

今回の current code では、**public UI 名が新しくても public API canonical と storage canonical は旧名を多く残している**。  
そのため visible 名変更の作業でも、contract / governance / worker 側の rule files を見落とさないこと。
