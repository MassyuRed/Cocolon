# EmlisAI u340 — 異なる原文時点へ同時性を足さない

作業日：2026-10-18。開始原本：mashos-api `d28e7bc079c3a8bceb30f94d539f416625a12e39`、Cocolon `6bc4a9fcf9b58b690ca016f79ac229bfe1896d21`。既存PR3／30の継続。

## 作業前の範囲固定

- 目的／current route：最新weekly20261017 §3の初回理解・返答・問い・更新・保存を一体で修復する方針に接続し、正本06 §u331で未解消の「昨日／今日を同時にする」Observationを修復する。
- exact work：既存u331の完全原文・本人二対象・明示contrast証明が成立し、既存time_scopeがpast／presentに分かれる場合に、既存「一方で」文法で両端を保持する。独立本文readerも同時性・因果・両端改変を拒否する。
- scope：LEVEL_2、current userのEmlisAI残件作業指示とRule18既存設計内の可逆source／test／document反映。u339の限定拡張承認は流用しない。意味・選択・問い・schemaの追加なし。
- owner／環境：root華恋が編集・実行・判断・GitHub反映を担当する。同Workの担当は読取補助のみ。実行環境は本会話のWorkであり、別model Pro／Ultra正式審査の実施・model認証を主張しない。
- 変更予定exact production paths：`ai/services/ai_inference/emlis_ai_grounded_observation_plan.py`、`ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py`、`ai/services/ai_inference/emlis_ai_grounded_observation_gate.py`。
- test／証拠：新規`ai/tests/test_cmee_emlis_separate_time_contrast.py`、開始原本から取得する`ai/tests/fixtures/cmee_emlis_u339_separate_time_contrast_v1.json`。既存u330比較fixture・旧assertionは保持する。current shared-owner identity fixtureは必要時だけ既存検査に従い再導出する。
- documentation paths：本監査、weekly20261017、全体設計01／file地図01A、current structure01、正本06、API handoff。新production owner・公開経路なし、`STRUCTURE_MAP_DELTA_NONE`。
- completion：現行実本文を主担当が読み、原文時点・二対象・否定／程度・対比を保持。意味／checkpoint／selected不変、END不変。関連する実質問の更新を回帰対照とし、保存済み新旧本文の非再生成GET／startを確認。GitHub反映後にchanged paths・本文・headを再取得する。
- STOP／禁止：新source認識・actor／time契約拡張、全contrast一括置換、凍結基準変更、API／DB／Safety／費用／依存追加、merge／deploy／本番データ操作。原文資格を拡張しないと直らない範囲は未解消として分離する。
- 商品判定：E01の時点誤提示の局所修復が今回の到達点。機械検査と本文読解を分け、商品全体完成／受入れへ昇格しない。今回は修復本文と境界例を主担当が読解する。今回の検証結果を正式Product Readの開始承認としない。

## 作業結果

開始時の実出力は「昨日は友達と話せて嬉しかった」と「今日は疲れている」が、異なる向きのまま同時にあります。意味核はpast／present、明示contrastのままであり、Receptionは既に両時点を保持していた。


## u340 — 原文の昨日／今日に「同時」を足す表示を修復（2026-10-18）

最新weeklyと正本06 §u331の未解消例を実出力で再確認し、既存の本人二対象・完全原文・明示contrastが証明され、past／presentと原文時間prefixが一致する場合だけ、Observationを既存「一方で」文法へ修復した。意味認識・checkpoint・plan・selected・Reception・問いは不変。new source／契約／enumの追加ではなく、認識済みの時点を表示で潰さない修正である。u339の過去不明拡張承認は流用していない。

実本文は「昨日は友達と話せて嬉しかった」の一方で「今日は疲れている」とあります。開始原本d28e7bcの合成12例中5例で修復、7例は全artifact／問い／reasonを含め不変。12例のcheckpoint／plan／selectedまたは同じ停止は不変。対象5例のQ1／Q3一致と同じ旧checkpointからの修復本文を確認した。保存済み完成本文は再生成しない。

最終の限定検査集合は404 passed／2 failed／skip0、current identity別1 pass。重複除外405 passed／2 failed（新72 pass＋関連332 pass＋identity1 pass）。2件は、u330の誤った同時表現との一致要求distinct_times（今回の修復による既存比較との不一致）と、u333修復以前の停止期待explicit_self（既知）。歴史fixture・旧assertionは変更、xfail、skipしていない。途中の広すぎる回帰集合は中断し、成功数へ加算しない。全suite GREENではない。

実service＋隔離PGlite SQL/RPCの当該12ケース（肯定／否定×3tier×現在／合成旧完成）で保存後GET／startの全DTO一致を生成禁止engineで確認。同じ12DTOを現行API client／hook／Modalへ通しclose/reopen各2回、本文・original・timeline・質問／回答欄なしを確認した。旧完成は開始原本の実本文と完全一致する旧rendererを現行service内で局所再現した合成検査であり、本番旧DBや中断retryの証明ではない。HTTP／Auth／nativeはstubで本人実機ではない。

STRUCTURE_MAP_DELTA_NONE。既存production3file内の表示資格・作者・本文readerのみ。new test1／開始原本fixture1、current owner identityを更新。原文資格は作者とreaderが共有し、readerは作者を呼ばず最終本文の両端・時点・対比・追加文を照合する。資格判定まで独立実装という主張はしない。Analysisが既存OP builder等を参照する依存はあるが、今回helperはEmlis Surface／Gateからのみ使用し、共通builderは変更していない。

必要性=DIRECT_PRODUCT_OR_ACCEPTANCE_WORK、primary outcome=TECHNICAL_CREDIT。PRODUCT_NOT_CLEAR／初回一体単位未完了／正式0/3／candidate_ready=false／automatic_progression=falseを維持。対象外の「とても」・逆順・他者・同日／時点不明・一部pairの旧表示や未提供、E04深さ／E05問い／E06〜E09は残る。次は同じ時点欠陥の資格外例について、意味認識・参照証明・表示のどこが不足するかを原文単位で確認する。別の資格／契約変更へ自動拡張しない。10/20方式判断、10/31管理線、12/18目標、Piece/Analysis主枠53.25％は不変。Draft/open/unmerged・未配置。

詳細・実本文・残件：[u340監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u340_SeparateTimeContrast_20261018.md)。

## 正確なファイル差分
新production owner／公開経路なし。01B／01Cの責務追加なし。Analysisの既存OP依存は維持し、既存builderは変更しない。

| mashos-api exact path | 今回の責務 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | 既存u331二対象のsource証明を再利用し、原文prefixと既存past／presentが一致するrequired contrastのみ表示義務に指定。認識・選択・builder不変 |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | 適格な単一対比行を完全原文2対象＋既存「一方で」文法で表示 |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | 同じ対象の最終本文を作者なしで読む。原文両端・順序・一文全体を照合し同時性／因果／追加主張を拒否 |
| `ai/tests/test_cmee_emlis_separate_time_contrast.py` | 新72検査。12原本比較・Q1／Q3・checkpoint・作者禁止変異・資格偽装・同endpoint余剰辺・SQL保存 |
| `ai/tests/fixtures/cmee_emlis_u339_separate_time_contrast_v1.json` | 無変更d28e7bcから実行取得した12合成record。旧意味・旧本文の変更しない比較資料 |
| `ai/tests/fixtures/cmee_emlis_q1_shared_owner_identity_v1.json` | 最終sourceからcurrent identityのみ再導出。歴史identityは変更しない |
| `ai/docs/CMEE_V1A_I1SX_CurrentStateAndNextWorkHandoff_20260816.md` | 今回結果と資格外残件の再開位置 |

詳細：[u340監査](https://github.com/MassyuRed/Cocolon/blob/agent/three-core-cmee-current-structure-20260815/Cocolon_前提資料/audits/emlis_ai/Cocolon_EmlisAI_u340_SeparateTimeContrast_20261018.md)。

## 検証記録と読解

Python 3.12.14／pytest 8.4.1、PGlite 0.5.8を既存scratch依存から使用。product依存追加なし。`PYTHONDONTWRITEBYTECODE=1 PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`、`--noconftest -p no:cacheprovider`。新moduleとcontrast_reference／past_unknown全体、source_scopeの短対比・過去現在・独立reader、relief_cognitionの現行選択・旧checkpoint・訂正撤回、detached_observationの部分撤回・保存、Q3の3roundとtier境界を限定実行した（404 pass／2 fail、270.22秒）。current identity既存検査は1 pass（28.24秒）。

初回の新テストでJSON配列とPython tupleの比較、artifact.textがpropertyであることを取り違えたテスト側18失敗を確認して修正した。製品期待は緩和せず、次の最終集合で再確認した。読取レビューで同endpointのoptional辺を資格に混ぜる余地を見つけ、証明したrequired・user_stated contrastに限定し3変異検査を追加した。旧比較distinct_timesは修復前の誤表示要求としてそのまま失敗を保存し、現在の正確な全文は新testで検査する。

current language identity：`dccd7ae7e884bcf18f4c4709a21d51883c6e15363ffb6094abe0d8bd2d06ff79`。runtime identity：`d98aee5630e2778b522c1c82d10ad9a303398e1c5150bf2e5710daf3c9a6734f`。

主担当は全12現行出力を読解した。対象5例は時点と二対象を失わず、否定を肯定へ変えず、因果・同時性を加えていない。Receptionは原文反復が長く、E04の深さ全体の合格ではない。以下は合成入力の実本文である。

### past_today

入力：昨日は友達と話せて嬉しかった。でも、今日は疲れている。

Observation：

```text
「昨日は友達と話せて嬉しかった」の一方で「今日は疲れている」とあります。
```

Reception：

```text
昨日は友達と話せて嬉しかったことと今日は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_now

入力：昨日は友達と話せてうれしかった。ただ、今は疲れている。

Observation：

```text
「昨日は友達と話せてうれしかった」の一方で「今は疲れている」とあります。
```

Reception：

```text
昨日は友達と話せてうれしかったことと今は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### negative

入力：昨日は友達と話せて嬉しくなかった。でも、今日は疲れている。

Observation：

```text
「昨日は友達と話せて嬉しくなかった」の一方で「今日は疲れている」とあります。
```

Reception：

```text
昨日は友達と話せて嬉しくなかったことと今日は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### past_also

入力：昨日も友達と話せて嬉しかった。でも、今日も疲れている。

Observation：

```text
「昨日も友達と話せて嬉しかった」の一方で「今日も疲れている」とあります。
```

Reception：

```text
昨日も友達と話せて嬉しかったことと今日も疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### punctuation

入力：昨日は友達と話せて嬉しかった。ただ今日は疲れている。

Observation：

```text
「昨日は友達と話せて嬉しかった」の一方で「今日は疲れている」とあります。
```

Reception：

```text
昨日は友達と話せて嬉しかったことと今日は疲れていることの両方を、その違いも含めて小さくせずに受け止めています。
```

### 不変の7対照と残件

| case | 原文 | 残る結果 |
|---|---|---|
| degree | 昨日は友達と話せてとても嬉しかった。でも、今日は疲れている。 | 旧「同時」表現を維持。今回の修復資格外 |
| same_time | 今日は友達と話せて嬉しかった。でも、今は疲れている。 | 旧「同時」表現を維持。今回の修復資格外 |
| no_time | 友達と話せて嬉しかった。でも、疲れている。 | 旧「同時」表現を維持。今回の修復資格外 |
| past_tense_only | 友達と話せて嬉しかった。でも、疲れた。 | 旧「同時」表現を維持。今回の修復資格外 |
| reverse | 今日は疲れている。でも、昨日は友達と話せて嬉しかった。 | 本文未提供 |
| unproved_pair | その時は楽しかった。でも、今は疲れている。 | 旧「同時」表現を維持。今回の修復資格外 |
| other | 昨日は友達が嬉しかった。でも、今日は疲れている。 | 旧「同時」表現を維持。今回の修復資格外 |

これらの不変は互換比較の結果であって、正しい時点理解の認定ではない。とくにdegreeは既存参照証明のtopic除外に「とても」が入り、原文を具体的に受け取る資格から外れる。逆順は既存本文未提供。その原因を未解消のまま隠さず次の読取位置とする。
