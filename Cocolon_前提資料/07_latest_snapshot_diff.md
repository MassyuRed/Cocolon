
# 2026-07-26 current authority: actual environment first / guardian retirement

## Authority

```text
COCOLON_ACTUAL_ENVIRONMENT_FIRST_RULE_AND_GUARDIAN_RETIREMENT_IMPLEMENTATION_AND_GITHUB_REFLECTION_ONLY
```

本authorityのdecision ownerはMash様です。番人の打切りはMash様の判断であり、
華恋の独断で終了したものではありません。

## 確認した事実

```text
Cocolon H0:
5ff22c0c830b4a1f1c1c89049f2e6a1f822e292b

result commit:
the GitHub revision containing this checkpoint

actual environment:
Mash主体 / 華恋single writer / private repository / explicit approval

guardian workflow state before:
connectorではrepository metadataを取得不能

guardian workflow state after:
disabled_manually confirmed through GitHub repository UI before reflection

guardian production:
NEVER_ACTIVATED

guardian fresh suite:
CANCELLED_AT_3_OF_5

unreflected guardian overlay:
ABANDONED_NOT_TO_BE_REFLECTED

historical Issues / runs / branches / refs:
PRESERVED_NOT_RERUN_NOT_REUSED

retired open request Issues:
#10 / #11 retirement comment added and closed

Emlis current authority:
Recovery Epoch002 D1 causal RED frozen

D2:
NOT_STARTED_NOT_APPROVED

automatic progression:
false
```

番人workflow、Issue-driven publication、sandbox publication、guardian code、
policy、schema、diagnostic maintenanceをcurrent publication routeとして使いません。
先行する未反映guardian exact10 overlayは反映せず、破棄対象のまま固定します。

通常のGitHub反映には、HEAD確認、承認済みexact scope、force rewrite禁止、
一つの承認済みreflection checkpoint、postverification、結果不明時の
自動retry禁止だけを残します。これは番人の再利用ではありません。

番人maintenanceへ戻らず、本retirementをEmlisAI D2の自動承認へ変換しません。
D2は別のMash様明示承認が必要です。
