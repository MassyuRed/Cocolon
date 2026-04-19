---
doc_id: cocolon_current_snapshot_diff
title: "Cocolon 最新スナップショット差分"
revision_date: "2026-04-19"
source_repositories:
  - Cocolon
  - mashos-api
source_mode: "local_snapshot"
purpose: "今回の前提資料リベースと current snapshot の要点を固定する"
---

# 1. 今回の基準面

今回の前提資料は、**Cocolon_17.zip** と **mashos-api_19.zip** の現物を基準に、前提資料を repo 分割ではなく **Cocolon の system / flow 単位** でリベースした版です。

# 2. coverage 数

- total files: `405`
- `01` に記載した対象 files: `352`
  - Cocolon: `133`
  - mashos-api: `219`
- `02` に記載した国家システム対象 files: `303`
  - Cocolon: `98`
  - mashos-api: `205`
- main body から除外した files: `53`

# 3. 今回の structural change 要点

- `inventory` を廃止し、`01/02` 本文に coverage を持たせた
- `Home write` は `home_gateway` 前提で記述した
- `Home read` は `/home/state` 前提で記述した
- `read-side visibility` は `access_policy` 前提で記述した
- `ProfileCreate` を current public 名として扱い、`MyModelCreate` は canonical / legacy 文脈として扱い直した
- RN と backend を repo 別に分けず、同じ section に混ぜて記述した

# 4. 01 / 02 の対象外にした files

次の files は current app runtime-contract structure の main body から外した。  
ただし **未確認のまま捨てたのではなく、今回の対象外理由を持って除外**している。

- `Cocolon/.gitignore ` — meta / generated artifact, not current app structure source
- `Cocolon/crash_log.txt ` — meta / generated artifact, not current app structure source
- `Cocolon/libs_list.txt ` — meta / generated artifact, not current app structure source
- `Cocolon/patches/_react-native-svg+14.1.0.patch.archive ` — backup / hold / disabled patch artifact
- `Cocolon/patches/_react-native-webview+13.6.3.patch.hold ` — backup / hold / disabled patch artifact
- `Cocolon/patches/react-native-linear-gradient+2.6.2.patch.bak ` — backup / hold / disabled patch artifact
- `Cocolon/patches/react-native-reanimated+3.6.0.patch.disabled ` — backup / hold / disabled patch artifact
- `mashos-api/ai/data/config/astor_structure_dict.json ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/processed/features.json ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/processed/structure_dictionary.json ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/processed/summary.txt ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/README_ingest.txt ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/import_template.csv ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/logs.jsonl ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/schema.json ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/template.csv ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/raw/template.json ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/data/train/{{AI_NAME}}_interpret_train.jsonl ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/services/ai_inference/__pycache__/active_users_store.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/api_emotion_submit.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_account_status_enqueue.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_core.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_deep_insight.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_deep_insight_question_store.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_deep_insight_store.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_friend_feed_enqueue.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_global_summary_enqueue.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_global_summary_store.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_myweb_insight.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_patterns.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_ranking_enqueue.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/astor_structure_matcher.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/client_compat.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/deep_insight_strategy.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/subscription.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/subscription_store.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/__pycache__/supabase_client.cpython-313.pyc ` — cache artifact
- `mashos-api/ai/services/ai_inference/_samples/lora_load_example.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/services/analysis_engine/templates/README.md ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/services/examples/demo.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/services/structure_engine/extract.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/services/structure_engine/templates/summary.txt ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/data/raw/import_template.csv ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/data/train/{{AI_NAME}}_interpret_train.jsonl ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/training/README.md ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/training/requirements.txt ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/training/train_lora.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/tools/training/trainset_skeleton.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/training/README.md ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/training/build_dataset.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/training/eval.py ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/training/requirements.txt ` — sample / training / dataset artifact outside current app runtime-contract structure
- `mashos-api/ai/training/train_lora.py ` — sample / training / dataset artifact outside current app runtime-contract structure

# 5. current drift 候補

frontend 側に見える endpoint 文字列のうち、backend route 側に直接見えないものを列挙する。

- `/g, ` — callers: `Cocolon/screens/MyWebReportHistoryScreen.js`, `Cocolon/screens/MyWebReportViewerScreen.js`, `Cocolon/screens/SelfStructureReportGenerateScreen.js`, `Cocolon/screens/SelfStructureReportHistoryScreen.js`, `Cocolon/screens/SelfStructureReportViewerScreen.js`

# 6. これ以降の更新原則

- `01` は Cocolon 構造対象の全件 coverage を崩さない
- `02` は国家システム対象の全件 coverage を崩さない
- 新しい file を追加したら、必ず 01/02/07/manifest を同時更新する
- repo を分けて説明せず、RN と backend のつながりで説明する
