# CMEEと学習済AIの分担案・三中核の比較試験

作成：2026-10-22 JST／華恋。10/23現在：**P1〜P5の限定内部準備を維持。[Runpod 9B M1](../../trials/2026-10-23-qwen9b-m1/README.md)は4件取得・全本文診断まで完了。出力に重大不足があり、P6統合・追加学習は未実施。**

**現在の再開先は[latest weekly R](../../../weekly_reviews/Cocolon_Weekly_Review_20261017.md#20261023-qwen9b-runpod-m1-results)と[Runpod M1実結果](../../trials/2026-10-23-qwen9b-m1/README.md)。** 以下の日付付き内部実装記録と旧API案は履歴。Emlis profile2・Piece P4・Analysis P5の限定offline実装を維持し、M1の実出力をそのまま商品合格へ昇格しない。

10/22にMashの「わかった、作って」により、具体的な入力・作らせる結果・比較方法を作成した。学習済AI＋CMEE接続は既決。本書で提案する責務の詳細、試験条件、候補の採用は、製品実装・契約変更・商品合格として確定しない。10/22作成時点は推論・GPU起動・追加学習・課金資源取得・API/DB/配置・本番設定の変更0。10/23のC0実行と後続承認は下記へ区別して記す。

> 2026-10-23 Mash決定：Plus980円／Premium1,980円が価格上限、27B除外。[小型AI再選定](2026-10-23-small-model-reselection.md)をcurrentとする。後続の残高利用希望でRunpod優先となり、M1は各1回・4応答取得済み。旧DeepInfra4回/50円はAPI向けの履歴で、Runpod GPU予算へ流用しない。価格／quota／製品採用は変更0、P6統合と追加学習は未実施。


> 2026-10-23実行：Mashの「進めて」を受け、[現CMEE側の4場面](../../trials/2026-10-23-current-four/README.md)を正規offline入口で確認。Emlis初回本文あり／問いなし、補足は実pendingなしでN/A、Piece・Analysisは実理由付きUNAVAILABLE。9B APIは認証未完了・推論0、両条件比較は未完。Mashの続く質問を受け、同記録§2へモデル選定前に進められるsource投影・未採用候補・意味admission・回答更新・三core接続の先行準備を具体化した。任意LLM候補の受け口は現Engineに未実装。

## 1. 今回できたものと、最初に出す結果

| ファイル | 用途 | モデルへの渡し方 |
|---|---|---|
| 本書 | 分担案、比較条件、現コードとの対応、最初の実行単位 | 手順書。全体をモデルへ投入しない |
| [task_inputs.jsonl](task_inputs.jsonl) | 20場面のモデル可視入力。各行に完全な`messages` | **対象IDの一行のmessagesだけ**を渡す。他行・未来回答を含めない |
| [case_index.json](case_index.json) | 場面の由来・独立性、現方式の制限、最初の4場面 | 実行者用。採点側の情報として扱う |
| [review_guide.md](review_guide.md) | 保持すべき意味、してはいけない昇格、比較記録欄 | 採点者用。prompt・手本・検索対象に含めない |

最初の比較対象は次の4場面。下表は期待する役割で、実出力は[C0実行記録](../../trials/2026-10-23-current-four/README.md)へ分離して保存済み。M1の実結果は上記Runpod記録へ分離済み（4応答取得、本文の重大不足あり）。

| ID | 実際の材料 | 最初に見たい結果 |
|---|---|---|
| E02-0 | 喜び・中。「うれしかったけど、どこがうれしかったかはまだ曖昧。」／打合せで後輩に説明を任せて最後まで聞いた | 嬉しさの理由を先取りせず、入力を受け取り、問いを出すなら意味が分かれる一点を問う |
| E02-B | 同じ原入力＋本人補足「自分が口を挟まずに済んだからではなく、自分が思いつかなかったやり方を知れたのが嬉しかった」 | 本人の説明を取り込み、自己抑制・後輩の成長等を中心に固定しない |
| P01-N | 同僚の資料を一緒に直し、嬉しさと帰宅の遅れが併存。後悔とは言っておらず、次回は余裕次第 | 喜び・負荷・後悔の否定・次回の条件を保った、本人の声の独立したPiece本文 |
| A02-P1 | 連絡係・道具係・買い物についての次期3記録 | 明記された役割・手順・結果を区別し、不明な他者の反応や人格を埋めない文章＋図の候補 |

既存CMEEのoffline入口とQwen3.5-9B APIの指示上の代用試験で各最大4出力、最初の上限は8リクエスト相当。現方式に実pending questionがなければE02-Bのthread更新はN/Aとして記録し、仮の問いを作らない。再試行や残り16場面の自動実行はこの上限へ混ぜない。各出力の全文、欠落・未対応、可視材料、時間を一つの比較表へ残すところまでを、次の小さな実行単位とする。

## 2. CMEE・モデル・アプリの分担案

モデルを意味理解にも使い、既存CMEEの原入力・意味・根拠・問い更新の資産へ接続する。モデルに最終文の言い換えだけをさせる案ではない。

| 処理 | CMEEと既存ownerへ残す責任 | モデルへ担わせる候補 | 比較で確かめる結果 |
|---|---|---|---|
| 材料の準備 | 原入力の凍結、本人・期間・source役割、適格履歴、core別採用条件 | 渡された日本語の主体・時点・肯否・関係の読み | 許可されたsourceだけを使い、発話と生成解釈を混同しない |
| 意味・観測 | 既存観測知識の供給、根拠照合、意味候補の採用/保留、不明・不一致の保持 | 注目点、複数の読み、不足情報、意味構造の候補 | 断定できるものと仮説を分け、単語の置換を越えて入力の関係を読む |
| 問い | 問いの必要性・焦点・既質問・残数・本人続行を扱う既存状態 | 何を確かめれば読みが変わるか、問いと終了の候補 | 本人にしか分からない一点を問う。既に答えた内容を繰り返さない |
| 回答後の更新 | 原入力と独立補足の束縛、ADD/REVISE/WITHDRAW、checkpoint・依存・履歴 | 回答によって何を残し/変え/捨てるかの候補、更新後の本文 | 訂正対象を限定して更新し、撤回を過去artifactから復活させない |
| Emlisの文章 | 観測と受け取りの責務、意味と本文の一致、plan別source/問い上限 | 入力に即した観測と人間的な受け取り、自然な問い | 短文には短く返せる。全入力に深読みや問いを強制しない |
| Piece | source許可、意味検査、canonical text採用、format適格性、既存recipeと保存同一性 | 本人の核が第三者へ伝わる文章・意味/format候補 | Emlisの声や助言に変えず、原文にない決意を付け足さない |
| Analysis | 期間source、根拠付きnode/edgeの採用、注記・比較・保存、観測とIFの分離 | 期間の構造・差分の候補、説明文、条件付きIF候補 | 場面/役割/選択を扱い、性格診断や他者の未来予測へ変えない |
| 表示・運用 | rendererの実測/fit/bitmap、API/保存/公開/削除、認証、quota、課金 | 上記の商品内容に必要な生成 | モデルの自己申告を権限・本人同意・画像成功・商品合格にしない |

これは責任の置き場所の案であり、現CMEEがモデル候補の意味を一般的に検証できるとの主張ではない。有限な意味型・逆検査に載らない候補は、捨てて無かったことにせず「接続未対応」として本文とともに記録する。どの型・検査・更新へ写すかは実adapterの技術設計と実装で扱う。本書のために第二の生成Engineやcheckerを作らない。

## 3. 比べる条件と、得られる証拠

| 条件 | 実行内容 | 言えること／言えないこと |
|---|---|---|
| C0：current_engine_baseline | 固定API SHAの実CMEE offline入口。既存contractへ忠実にfixtureを束縛 | 現方式の本文・問い・構造・status/reason。未対応も製品到達範囲として残す |
| M1：small_model_contract_prompt_proxy | task_inputsのmessagesを固定した既製Qwen3.5-9B APIへ渡す。共通task cardは既存方針の投影 | **未接続の代用試験**。自然な意味理解・候補生成の能力を見る。CMEE意味採用・checkpoint・保存成功の証拠ではない |
| M0：small_model_standalone（原因比較用） | M1と同じモデル・source・task・設定から`cmee_task_context`だけを外す | 指示上の共通方針を添える差を見る。手本追加や重み学習の効果とは呼ばない。初回8出力には含めない |
| M2：integrated_model_candidate | 将来、実adapterで意味候補→既存CMEE採用/問い更新→core artifactへ接続 | 本統合の評価。**未実装・未実行**で、M1をM2へ改称しない |
| T1：追加学習版 | 将来、教材を確定して重みを更新し、未使用の事例群で学習前と比較 | 育成による改善。今回0。手本添付の推論成功を追加学習成功へ換算しない |

最初はC0対M1。M0・手本有無・T1・別モデルを同時に増やさない。C0/M1の結果は「現方式に対する候補の出力能力」であり、「統合済みモデル間の優劣」ではない。

元の27B8出力は、Emlis向け架空長文2題の手本有無比較。回答内容が条件間で異なる例があり、後半差を手本の効果だけに帰属できない。三中核適性・学習効果・本番原価は未確認のまま。

## 4. 入力の具体像と、見せる情報

`task_inputs.jsonl`には20個の独立した入力を保存した。採点内容は別fileへ分離。原入力はUI由来の思考・行動・感情・強さ・カテゴリ・時刻を保ち、sourceは架空本人のものだけを使う。実user DBから取得しない。

| 群 | ID | 材料と出力の役割 |
|---|---|---|
| 事実の受け取り | E01-0 | 郵便物を片付け「机の端が使える」。小さな事実の観測 |
| 読み・補足・訂正/撤回 | E02-0/A/B/C/W | 後輩の説明を最後まで聞いた嬉しさ。A/Bは別の説明、Cは嬉しさの訂正、Wは表現の撤回。各枝は独立 |
| 主体・時点・否定 | E03-0 | 昨日は引受け、今日は断って安堵。過去と現在を保つ |
| 履歴とplan差 | E02-PLUS/PREMIUM | 同じ当回入力と同じ2履歴。Free対照はE02-0。両有料版へ根拠付きhistory_connections、Premiumへ修正可能なinterpreted_frameの責務を指示し、成立しない場合は空/nullを許す。3往復やframe操作の実経路まではこのsnapshotで検証しない |
| Piece | P01-N/R | 同僚の資料修正、嬉しさと負荷、後悔の否定、次回の条件。Rだけopt-in補足を別sourceで渡す |
| 既存教示の転用 | A01-P0/P1/C/IF | 予定変更を言わなかった期と相談した期。相談後も予定通りを本人が選んだ記録を含む |
| 新規の期間構造 | A02-P0/P1/C | 連絡係/道具係という明示役割、手順の変更、結果と未確認、別の買い物記録を持つ各3件 |
| 構造が不足する期間 | A03-SPARSE | E01の一記録。全node・人格・期間変化を無理に作らない |
| 接続制限 | A04-TWO-ANSWERS | 一原入力に補足2件。現方式の拒否と、新候補が読む能力を別に記録 |

各行の原入力へ未来の本人補足、隠れた人物設定、期待する解釈を入れていない。例えばE02-0へE02-A/B/C/Wを見せない。A/B/C/Wのいずれにも他の枝を見せない。C/Wでも元記録を改竄せず、訂正/撤回を別sourceにして扱う。C/Wを受けた後、入力時に選ばれた喜びを理由に撤回された嬉しさを現在の本人事実へ戻さない。元の感情選択・入力件数をモデルが書き換えることもしない。

E02の各枝は**固定補足による更新能力のprobe**。モデルが実際に出した問いへの回答とは限らない。特にBは否定を含む別説明であり、全モデルが初回に自己抑制を主張したという意味ではない。実対話を確認するときは各armの実際の問いを記録し、言っていない仮説への反論を作らない。C0がENDならthread更新はN/A。M1の補足snapshotだけを得ても、実thread更新成功へ数えない。A/B/C/Wは1問への回答後という固定の予算条件で残数0とし、二問目を出さない。当回初回は残数1、Premium初回は全体残数3・一度の出力は最大1問。実際の発行状態をこのfixtureの設定で偽造しない。

## 5. 教材・評価の分離

| 分類 | 今回の割当 | 評価の解釈 |
|---|---|---|
| known/demonstration | [既存観測会](../../README.md)の展示会・旅行・夕食・本返却、既存お手本、既存27Bの完走/マグ | 教材・既知再確認。新規一般化成績へ含めない。初回M1にはお手本を追加しない |
| known_derived_transfer | A01の4場面 | 旅行/予定の教示と短い夕食教材を転用。未知事例として数えない |
| heldout_candidate | 15場面、5事例family | 今回初めて評価用に作った候補。学習/手本に未使用かを実行前に確認する。モデルの事前学習へ未出とは保証しない |
| boundary_only | A04の1場面 | 接続上限。自然文の商品品質の平均へ混ぜない |

同じE02の枝・plan違い、P01のsource違い、A02の期間違いを独立した人物例として水増ししない。E01とA03も同じfamily。heldout_candidateは5事例familyであり、15種類の独立未知例ではない。一度手本・SFT・修正用例へ使ったfamilyは、その後の未知評価から外す。同じ話の名詞置換を未知の追加へ数えない。

本fixtureの期待は**華恋の比較案・Mash未確認**。Mashの実演、正解の心理、商品合格、実userの需要として保存しない。既存教材でも、華恋の講評や仮定の回答をMashが実際に訂正した実演へ昇格しない。

## 6. 現物への束縛と、未対応を隠さない方法

API prefixは`ai/services/ai_inference/`。本書のモデル出力欄は**offline比較用**で、既存public APIや保存schemaを変更しない。

| core | 現方式の入口・材料 | 比較での扱い |
|---|---|---|
| Emlis | `MeaningExperienceEngine.generate(GenerationRequest)`の実thread分岐、`emlis_thread_engine.generate_emlis_thread`。原入力を`source_kernel`、補足を`emlis_thread_source`と`emlis_answer_update`の実contractへ束縛 | 初回のstatus/body/問い/根拠/checkpointをそのまま採る。補足枝は実pending questionとcheckpointを複製した独立枝に束縛できる場合だけ。ENDや有限意味未対応を通すために問い・本文・原入力を創作しない |
| Piece | `piece_v2_generation.generate_piece_candidate(PieceSourceSnapshot, authenticated_owner_id, tier, requested_format)`→Engine→`piece_v1c` | 原入力の7fieldを`piece_v2_source_adapter`の正規投影へ渡す。`memo_action`を手動で別文章へ書き換えない。status/reason、`piece_text`/`content_payload`、format/eligible formatsを採る。recipeは`piece_v2_visual.build_visual_recipe`の別段階 |
| Piece補足 | `piece_source.build_piece_source_meaning`は現在original＋normal/pre_questionのみ。refinedは`source_role_or_stage_not_yet_supported` | P01-RはC0未対応。補足をoriginal_textへ連結して対応済みにしない。M1だけ成功してもrefinedの本統合成功ではない |
| Analysis観測 | `cores/analysis/source_adapter.AnalysisSavedRecord`の原JSON＋`AnalysisObservedMapRequest`→Engine→`generate_observed_map` | 各recordは`id,created_at,memo,memo_action,category,emotions,emotion_details`の7field。架空ownerとrecord versionをrequestで束縛。自然文を現方式の認識語彙へ書き直さない。本文・graph・status/reasonを採る |
| 期間比較 | 現在期requestの`comparison_previous_request`に前期requestを渡す既存pure入口 | 保存service/RPCを呼ばずに候補比較。各期間の境界、件数、原record IDを保つ。生成成功は未確認 |
| IF/Saved | 設計04 §10/11・schema05 §7/9.6に存在。Engineにruntime分岐なし | C0はNOT_IMPLEMENTED。M1のA01-IFはraw根拠を足場にした設計能力probe。本統合では観測mapの保存identityと本人指定分岐の束縛を要する |
| 複数ANSWER | pureの`freeze_analysis_sources`も補足2件以上で`analysis_supplement_cardinality`、保存loaderは`analysis_multiple_answers_not_supported` | A04で別記録。2件を1件へ潰す/最後だけ選ぶ/原入力へ連結することで公平な比較に見せない |

emotion_details等のwire表現は正規ownerへ合わせ、原文・意味・強さを保持する。fixtureの可視7field以外のowner/version等は実行者が比較用IDから束縛する。Fixture shapeとnative request shapeは同一と装わない。sourceの許可範囲が異なる場合は「同一条件」の結果へ合算しない。

保存・API・実Authを伴う`analysis_observed_service.generate_saved`や通常Piece preview APIはこのoffline比較に使わない。pure入口成功はDB・認証・本人履歴往復の成功ではない。10/22作成時点では呼出しコード／adapter未作成。10/23にC0のfixture bindingを実装・保存したが、任意モデル候補のadmission adapterは未実装。

## 7. 比較の実施手順

1. Cocolon/APIのfresh refを記録し、今回固定点からの対象source差分を確認する。モデルは実取得元、revision、精度、推論設定、context上限を記録する。自己管理ならファイル名／hash／backend版も採る。公開APIが返さない情報は未確認とし、架空のhashやrevisionを補わない。モデル名だけを同一性にしない。
2. 最初の4IDをfreezeする。モデルへ渡すのは該当行のmessagesだけ。review_guide、case_index、他行、全体README、原文を読むためのGitHub検索機能をモデルへ与えない。試験内でtool/RAGを使わない。
3. M1は重み・prompt・sampling・context/output上限を固定して各1回。温度0を第一案とし、未対応なら最小の対応設定を記録する。未取得のseed決定性を主張しない。長さ上限はEmlis1024/ Piece1024/ Analysis3072生成tokenを案とする。切れたらTRUNCATEDとして保存し、同条件の失敗を黙って再生成しない。
4. C0は保存済み4場面を再利用し、新セッションだけを理由に再生成しない。source変更で必要な再検証は範囲を特定する。当初の実行手順は同じ可視sourceを既存pure contractへ束縛して各1回。必要なfixture bindingが未作成ならNOT_RUN_ADAPTER_REQUIRED、実行環境不備はINFRA_ERROR。本文が出ない実能力制約はUNAVAILABLE等の実status/reasonも残す。
5. 生成元を伏せたA/Bで本文を読む。原文sourceは採点者へ見せる。Pieceの第三者理解では、最初にPieceだけから内容を説明できるか見て、その後に原入力と照合する。すべての根拠と失敗を両条件へ同じ基準で記録する。
6. 最初の4場面の結果から、残りのどの場面で追加確認する必要があるかを選ぶ。2条件に共通して出力がある行だけの比較と、20行全体に対する到達範囲を両方示す。出力できない行を消して成績を良く見せない。

入力を取り出すだけの例（推論やネットワークは発生しない）：

```bash
python3 - <<'PY'
import json
from pathlib import Path
case_id = 'E02-0'
rows = [json.loads(line) for line in Path('task_inputs.jsonl').read_text(encoding='utf-8').splitlines()]
matches = [row for row in rows if row['case_id'] == case_id]
assert len(matches) == 1
print(json.dumps(matches[0]['messages'], ensure_ascii=False, indent=2))
PY
```

## 8. 選定・育成へ進む判断

最初の試験は少数の能力確認であり、モデル採用の最終証明ではない。core別の意味保持・自然さ・問い/更新・伝達性・構造の根拠と到達範囲を示し、平均点だけで弱いcoreを隠さない。重大な根拠破壊/訂正無視/他者内心の断定を、他の良文で相殺しない。短い事実に短く受け取る出力は、深さや問いがないだけで失敗にしない。

| 観測した結果 | 次の判断 |
|---|---|
| 自然な入力で意味を保ち三coreの候補に改善が見える | M2で既存CMEEへ接続する最小の責務・artifact比較を具体化する |
| 意味は読めるが現型・検査へ写せない | モデルの言語能力と統合の不足を分け、実adapterの変更箇所を特定する |
| 問い/更新に一貫した不足がある | その不足を埋めるMashの実演を観測会で得て、教材と評価familyを分ける |
| 指示だけでは改善せず、学習を試す根拠がある | 学習用weight・商用/改変/配布条件、教材の役割、SFT/LoRA等の方法と小規模上限を決め、学習前後を別事例で比較する |
| 三coreの重要意味を繰返し壊す | 9B候補を採用せず、4B等の次候補を少数に絞る。場面専用の正解文を足し続けない |

採用前にはモデルの実ライセンスと追加学習/商用/派生物の条件、学習に使う素材の権利、実配置の資源を確認する。27BはMash決定で候補外。自己hostが最安、追加学習で必ず改善する、一本のモデルで全coreを賄えるとは事前に決めない。API方式/自己host方式の費用・速度は実条件で比較する。

費用計算ではFreeの初回/任意1回答、Plusの適格履歴と1回答、Premiumの最大3問とframe操作を含める。Piece生成と期間Analysisの利用回数も別に積算する。入力保存・preview再読・exportをモデルの新規生成回数と混同しない。

- API案：`月額生成費 = Σ(core×planごとの月回数 × 実測入力/出力token × 当該料金)`。保存/queue等の費用は別。
- 自己host案：GPU保持時間、ロード/idle、実処理時間、同時処理、保存/転送/運用を含む月費用を利用量別に算出。1リクエストの推論秒だけを運用原価にしない。
- 速度：初回応答、問い、回答後更新、Piece本文、期間Analysisの時間・token、load時間、実batch条件を別に記録。少数4件の最大をp95と呼ばない。

10/23のM1上限は**最大4リクエスト／利用消費50円、承認済み未実行**。認証・残高と実行時単価を確認し、追加チャージや再試行で上限を広げない。固定GPUなし。残り16場面・新規有料資源はこの上限へ混ぜず、具体化して別に扱う。10/22作成時の有料実行上限0は、後続のMash指示でこの限定比較へ更新された。

## 9. 10/22提案作成時の確認点・根拠・完了（履歴）

現行の実績・承認・未着手状態は本書先頭と[10/23計画](../../../weekly_reviews/Cocolon_Weekly_Review_20261017.md#20261023-cmee-model-preparation)を優先する。以下を現在の試験未承認・C0未実行へ戻す根拠にしない。

- Cocolon PR30：`5d14a2930dc21a66578d577b7238585c903b807a`。API PR3：`a536e50ee284785f585ac73329ef2947dca8bba9`。両方open/draft。新しい配置確認はしていない。
- [全体現在地](../../../00_cocolon_current_product_and_state.md)、[10/20方針を含む週次](../../../weekly_reviews/Cocolon_Weekly_Review_20261017.md)、既存観測教材と27B8出力の記録へ接続。
- 詳細仕様：CMEE v1のEmlis02、Piece03、Analysis04、schema05、実装順06。現物：上記各入口、`emlis_thread_source`/`emlis_answer_update`/`emlis_question`、Pieceのsource/visual、Analysisのsource_adapter/observed_route_realizer、保存loader。
- この案の期待・役割配分の具体化は華恋の提案。Mashが承認したのは案の作成であり、モデル採用、runtime変更、有料試験や商品合格ではない。
- 完了：分担、可視入力、評価側の意味条件、比較手順、未対応、最初の4場面、次の判断を保存。モデル出力・速度・費用・商品改善の実証は未実行。STRUCTURE_MAP_DELTA_NONE（提案段階、実owner/製品接続変更0）。ADMINISTRATIVE_ONLY、product_credit=0。
