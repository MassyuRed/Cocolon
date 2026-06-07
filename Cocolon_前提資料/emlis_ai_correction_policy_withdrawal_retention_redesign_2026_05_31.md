# Cocolon EmlisAI 是正方針・撤回保持再設計・実装順

作成日: 2026-05-31  
対象: Cocolon / EmlisAI / mashos-api / RN contract  
成果物種別: 設計書。コード変更、patch作成、実装zip作成は行わない。  
実装扱い: 本資料内にJSON / schema案を含める。ただし、実ファイル化は実装段階で現物コード・既存schema配置・既存Guard・既存test結果を見て判断する。  
作業姿勢: 以後、実装前に必ず「確認済み / 未確認 / 書かれていない / 推測禁止 / 次に実行すべきこと」を分ける。  

---

## 0. 確認状態

### 0.1 今回確認した最新版zip

```text
/mnt/data/Cocolon_5(22).zip
/mnt/data/mashos-api_5(47).zip
/mnt/data/Cocolon_前提資料(161).zip
```

展開後の主な確認対象:

```text
frontend:
  /mnt/data/premise_update/front/Cocolon

backend:
  /mnt/data/premise_update/back/mashos-api

premise:
  /mnt/data/premise_update/premise/Cocolon_前提資料

emlis implemented docs:
  /mnt/data/premise_update/emlis_docs/EmlisAIの実装済み資料
```

確認方法:

```text
- md / txt は本文を直接確認。
- docx は word/document.xml から本文抽出済みtextを確認。
- backend py / config json / frontend js は該当実ファイルを確認。
- EmlisAI是正判断に直接関係する資料とコードを優先確認。
```

ここで「全ファイルを1行ずつ精読した」とは言わない。  
本資料の判断根拠に使うのは、以下の直接関係ファイルである。Phase20-12〜20-15差分更新では、post-final gate recoveryとGate Recovery surface bindingに関係する実ファイルを追加確認する。

### 0.2 主な確認済み資料

```text
Cocolon_前提資料/cocolon_thought_material_for_karen.md
Cocolon_前提資料/work_attitude_rules_for_karen/00_read_first.txt
Cocolon_前提資料/work_attitude_rules_for_karen/05_forbidden_unrequested_completion_and_structure_addition.txt
Cocolon_前提資料/work_attitude_rules_for_karen/99_integrated_paste_each_time.txt
EmlisAIの実装済み資料/Cocolon_EmlisAI_観測返答_商品品質実装設計書_実装順_2026-05-20.docx
EmlisAIの実装済み資料/Cocolon_Emlis観測専用辞書_設計定義_華恋用_2026-05-21.md
EmlisAIの実装済み資料/emlis_ai_state_answer_human_follow_definition_2026_05_26.md
EmlisAIの実装済み資料/Phase18系設計資料
Phase19 実装済み backend / RN 差分
```

### 0.3 主な確認済み実ファイル

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_shared_reception_evidence.py
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/config/emlis_reception_assistance_dictionary.v1.json
mashos-api/ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
mashos-api/ai/tests/helpers/emlis_ai_phase19_public_feedback_matrix.py
mashos-api/ai/tests/test_emotion_submit_phase19_public_feedback_boundary_e2e.py
mashos-api/ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_surface_phase20_15.py
Cocolon/tests/rn-screen-contracts.test.js
```

---


### 0.4 前提資料反映状態

本資料は、2026-05-31時点で必読前提資料として追加され、2026-06-01時点では `Cocolon_前提資料(161).zip` を基準に、最新実ファイル `Cocolon_5(22).zip` / `mashos-api_5(47).zip` でPhase20-0〜20-15実装反映状態まで追記済みの正本として扱う。
EmlisAIに関する設計・診断・実装・前提資料更新では、`cocolon_thought_material_for_karen.md`、`emlis_ai_state_answer_human_follow_definition_2026_05_26.md`、`cocolon_environment_state_output_observation_structure_design_2026_05_25.md` と同時に読む。

## 1. この設計書の結論

Phase19のA/C/D個別復旧路線は、本線として停止する。

Phase19で行ったことは、EmlisAIを「入力に返る観測応答」へ戻す修正ではなく、A/C/Dの実機入力を通すために、低情報repair、`self_understanding_learning_shift`、`relationship_gratitude_recovery` などの個別route / feature / surfaceを増やした修正である。

これはCocolonとEmlisAIの本来目的に反する。

本来のEmlisAIは、Cocolonでユーザーが感情・思考・行動・カテゴリを置いた直後に、その入力をただ保存して終わらせず、入力内の状態・関係・揺れ・箱詰めのされ方を観測し、ユーザー本人が自分を見返せる言葉として返す即時観測応答である。

したがって、是正方針は次で固定する。

```text
1. Phase19のA/C/D個別通過を成功扱いしない。
2. A/C/D exact fixture は失敗再現・回帰確認として保持する。
3. C/D専用mode・cue・完成surfaceは撤回または隔離対象にする。
4. Aのlow-information repairは、A専用ではなく汎用低情報応答へ再設計する。
5. Bの safety_blocked 非表示固定は撤回し、自己否定安全応答と緊急安全境界を分ける。
6. Gateは沈黙装置ではなく、安全・短縮・限定・再生成へ回す品質境界として再設計する。
7. EmlisAIを、passed-only表示システムから、入力へ応答に向かう観測返答機能へ戻す。
```

---

## 2. 根拠となる前提資料

### 2.1 Cocolonは文字列処理サービスではない

`cocolon_thought_material_for_karen.md` では、Cocolonは画面・API・DB・AI応答の集合ではなく、ユーザーの自己情報・他者情報・感情・思考・役割・言葉の箱詰め工程を観測する構造であると定義されている。

確認箇所:

```text
cocolon_thought_material_for_karen.md:16-17
cocolon_thought_material_for_karen.md:21-24
cocolon_thought_material_for_karen.md:29
```

中心文:

```text
Cocolonは、ユーザーの入力を文字列として処理するサービスではなく、
その言葉がどの情報をどの箱に詰めて出されたのかを観測し、
ユーザー本人の辞書に近づくためのサービスである。
```

このため、EmlisAIを「入力分類」「Gate通過」「テンプレ共感」「診断ラベル」に寄せることは、Cocolonの思想に反する。

### 2.2 EmlisAIの役割

`cocolon_thought_material_for_karen.md` では、EmlisAIは以下のように定義されている。

確認箇所:

```text
cocolon_thought_material_for_karen.md:111
cocolon_thought_material_for_karen.md:122-126
cocolon_thought_material_for_karen.md:179-196
```

要点:

```text
EmlisAI = 入力直後の観測返答。
ユーザー入力を整理し、状態を言語化し、自己情報を「読まれた形」として返す出口。
```

実装上の順序:

```text
現在入力を読む
↓
言葉の表面ではなく、箱詰め工程を観測する
↓
ユーザーの辞書に近い意味構造を作る
↓
返答候補を作る
↓
一般論・テンプレ・破綻・過剰断定を確認する
↓
ユーザーの入力に基づいた自然文として返す
```

この順序に照らすと、Phase19のC/D専用mode追加は、入力の箱詰め工程を読む前に、入力例に近い語彙をrouteへ押し込む構造であり、是正対象である。

### 2.3 低情報入力もEmlisの観測である

`cocolon_thought_material_for_karen.md` では、低情報入力についても、EmlisAIは無理に深く観測してはいけないが、返答自体はEmlisの観測として扱うとされている。

確認箇所:

```text
cocolon_thought_material_for_karen.md:803-819
```

要点:

```text
低情報入力では、わかったふりをしない。
ただし、その返答は「観測前の確認」ではなく、Emlisの観測として扱う。
観測しているのは、出来事の内容ではなく、まだ詳細化されていない重さや、言葉にする前の無理さである。
```

したがって、Aのような短文疲労入力は「無応答」ではなく、汎用低情報観測として返るべきである。

### 2.4 テンプレ化の判断基準

`cocolon_thought_material_for_karen.md` では、テンプレはユーザーの箱詰め工程を見ずに、それっぽい返答を返す構造であり、Cocolon体験を壊すとされている。

確認箇所:

```text
cocolon_thought_material_for_karen.md:431-458
cocolon_thought_material_for_karen.md:780-801
```

重要点:

```text
テンプレ化の判断基準は、禁止語リストではない。
観測語彙が、入力整理・状態言語化・関係構造に接続されているかを見る。
```

このため、固定文ではなくても、case専用route、feature cue一致、mode別完成surface、分類外入力が無応答になる構造はテンプレ化として扱う。

### 2.5 作業姿勢資料の禁止事項

`work_attitude_rules_for_karen/00_read_first.txt` では、確認していないものを確認したように言わない、前提資料・実ファイル・ログを確認できない状態でCocolon判断を出さない、事実と推測を分ける、というルールがある。

確認箇所:

```text
00_read_first.txt:8-17
00_read_first.txt:21-28
00_read_first.txt:32-44
00_read_first.txt:58-66
```

`05_forbidden_unrequested_completion_and_structure_addition.txt` には、以下が明記されている。

確認箇所:

```text
05_forbidden_unrequested_completion_and_structure_addition.txt:24-38
05_forbidden_unrequested_completion_and_structure_addition.txt:43-48
```

重要点:

```text
EmlisAIをテンプレ共感文に逃がすことは禁止。
例文はruntime条件にしない。テストケースとして扱う。
```

Phase19のC/D feature cueは、今回のC/D入力例に近い語彙をruntime条件化しているため、この禁止事項に抵触する。

---

## 3. 根拠となる実装済み資料

### 3.1 2026-05-20 時点で「無応答にしない」は明記済み

`Cocolon_EmlisAI_観測返答_商品品質実装設計書_実装順_2026-05-20.docx` では、現行契約のfail-closedは正しいが、低情報・曖昧入力が `rejected / unavailable / 空本文` に落ちるとユーザー期待と衝突すると整理されている。

確認箇所:

```text
観測返答_商品品質実装設計書_2026-05-20.docx:82-90
観測返答_商品品質実装設計書_2026-05-20.docx:113-120
観測返答_商品品質実装設計書_2026-05-20.docx:443-444
観測返答_商品品質実装設計書_2026-05-20.docx:739-747
観測返答_商品品質実装設計書_2026-05-20.docx:777-789
観測返答_商品品質実装設計書_2026-05-20.docx:867-885
```

重要点:

```text
情報が足りないときも「応答なし」にせず、見えている範囲を観測し、不明な部分は質問にする。
応答しないのではなく、内容に応じた観測へ切り替える。
通常入力で comment_text が空になる経路は、safety / infrastructure を除き、設計上の失敗と扱う。
always_display_rate: safety/infraを除く通常入力でpassed本文が返る割合 = 100%。
low_info_observation_rate: low情報判定入力で低情報観測が表示される割合 = 100%。
低情報入力を「応答なし」にしていない。
低情報入力を無応答にしない。
```

この資料により、全入力応答contractは新規発想ではなく、既に5/20時点でEmlisAI商品品質のExit条件だったと判断する。

### 3.2 Emlis観測専用辞書は完成文テンプレではない

`Cocolon_Emlis観測専用辞書_設計定義_華恋用_2026-05-21.md` では、Emlis観測専用辞書は思考内容、行動内容、感情選択、感情の強さ、カテゴリ選択の入力束を見るものだと定義されている。

確認箇所:

```text
Emlis観測専用辞書_設計定義_2026-05-21.md:19-33
Emlis観測専用辞書_設計定義_2026-05-21.md:63-68
Emlis観測専用辞書_設計定義_2026-05-21.md:190-200
Emlis観測専用辞書_設計定義_2026-05-21.md:662-711
```

重要点:

```text
EmlisAIは、メモ本文単体を読んで返答してはいけない。
感情選択、感情の強さ、カテゴリ選択、思考内容、行動内容をまとめて見る。
Emlis観測専用辞書の非目的は、完成文テンプレ集、一般共感文集、診断辞書、人格分類。
辞書は表示する完成文を固定で持たない。
低情報入力とは短文ではなく、入力束を見ても出来事・対象・原因・関係・差分がまだ取れない状態である。
```

この資料により、C/D専用modeに完成surfaceを持たせるPhase19方針は、辞書の非目的に反する。

### 3.3 状態回答と人間的フォロー

`emlis_ai_state_answer_human_follow_definition_2026_05_26.md` では、EmlisAIが返すべきものは行動指示ではなく、今の自分がどんな環境で、どんな状態になり、何を出力しているのかの状態回答だとされている。

確認箇所:

```text
状態回答と人間的フォロー_2026-05-26.md:21-67
状態回答と人間的フォロー_2026-05-26.md:464-519
```

重要点:

```text
観測ゼロにしない。
慰めだけにしない。
行動指示にしない。
診断・人格断定・原因断定にしない。
自己否定では、感じていることは受け止めるが、自己否定の内容をユーザー自身の事実として扱わない。
```

この資料により、Bを単純に `safety_blocked = 非表示固定` にする方針は狭すぎる。  
安全境界を通常観測へ変換してはいけないが、自己否定・自傷隣接をすべて無応答に潰すのも、EmlisAIの状態回答と人間的フォローに反する。

---

## 4. 現行コード上のズレ

### 4.1 Phase19由来のC/D feature cue

確認ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_shared_reception_evidence.py
```

確認箇所:

```text
emlis_ai_shared_reception_evidence.py:101-129
emlis_ai_shared_reception_evidence.py:166-230
```

現在、以下のfeature family / cueがruntimeに存在する。

```text
self_understanding_learning_shift:
  疑問の対象
  人について考えすぎ
  人への興味
  人との話し方
  すぐに行動
  勇気
  日常
  傷
  汚れ
  メモ
  進歩
  大丈夫

relationship_gratitude_recovery:
  彼氏と別れ
  別れた
  関係の終わり
  友達
  変わらず
  優しく
  優しさ
  私のために怒って
  怒ってくれて
  感謝
  区切り
  返していきたい
  別の形で
```

これはC/D実機入力に近い語彙をruntime条件にしており、`例文はruntime条件にしない` という前提資料に反する。  
本線から撤回、または汎用辞書構造へ再設計する。

### 4.2 Phase19由来のmode priority

確認ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
```

確認箇所:

```text
emlis_ai_reception_mode_resolver.py:48-49
emlis_ai_reception_mode_resolver.py:140-159
emlis_ai_reception_mode_resolver.py:395-406
```

現在、以下のmodeが本線priorityに入っている。

```text
MODE_SELF_UNDERSTANDING_LEARNING_SHIFT
MODE_RELATIONSHIP_GRATITUDE_RECOVERY
```

これは、入力の箱詰め工程を汎用に読む前に、Phase19のC/D回復用modeへ寄せる構造になっている。  
本線から撤回し、汎用response_kind / material relation / sentence planへ吸収する。

### 4.3 Mode別完成surface文

確認ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
```

確認箇所:

```text
emlis_ai_complete_surface_realizer.py:1799-1909
```

現在、以下の関数がmode別surface文を直接返している。

```text
_learning_shift_surface_text_for_line(...)
_relationship_gratitude_surface_text_for_line(...)
```

これは、文面が一字一句A/C/D固定でなくても、modeに紐づいた完成文bankに近い。  
Emlis観測専用辞書の「辞書は完成文を固定で持たない」「観測材料をSurface Realizerへ渡す」という方針に反するため、撤回または汎用surface generatorへ再設計する。

### 4.4 Phase19 low-information repair ownership

確認ファイル:

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
```

現在、Aのような短文疲労入力を通すために、Complete Initial下の低情報repair ownershipが追加されている。  
低情報応答そのものは必要である。  
ただし、A専用の「短文疲労compact signal」ではなく、入力束から材料量を判定する汎用low-information routerへ再設計する。

### 4.5 RN Phase19 exact fixture

確認ファイル:

```text
Cocolon/tests/rn-screen-contracts.test.js
```

Phase19のA/C/D exact payload / commentText fixtureは、RN productionを変えずにpayload表示条件を固定する目的では有用だった。  
ただし、exact commentTextをRN contractの期待として持つのは、EmlisAIの生成応答としては不適切である。  
今後は、RN contractは以下のみを見る。

```text
input_feedback.comment_text が非空なら本文表示できる。
input_feedback.emlis_ai.observation_status == passed なら「Emlisの観測」を開く。
non-passed / safety emergency / infra は表示しない、または別導線へ回す。
observation_text / reception_text / diagnostic_summary / internal mode名を表示源にしない。
```

---

## 5. 失敗原因

### 5.1 `passed + comment_text` を目的化した

`passed + comment_text` は、RNに安全に表示するためのpublic contractである。  
しかし、EmlisAIの目的ではない。

本来の問い:

```text
この入力に対して、EmlisAIは何を観測し、どう返すべきか。
```

私が実際に優先した問い:

```text
どうすれば observation_status == passed になるか。
どうすれば comment_text が非空になるか。
どうすればRN modalが開くか。
```

この時点で、目的と手段が逆転していた。

### 5.2 fail-closedを商品挙動にしてしまった

初期のfail-closedは、壊れた文や根拠なし文を出さないための安全足場として必要だった。  
しかし、2026-05-20時点で、低情報・曖昧入力は「応答しない」のではなく「内容に応じた観測へ切り替える」と整理されていた。

それにもかかわらず、私はfail-closedを商品挙動の中心にし、Gateで落ちたものを `rejected / unavailable / empty_comment_text` に落とす構造を維持してしまった。

### 5.3 固定文だけをテンプレと誤認した

固定文でなくても、以下はテンプレである。

```text
case専用route
feature cue一致だけで決まるsurface
mode別完成surface
入力例語彙をruntime条件にする実装
分類外入力が無応答になる構造
```

Phase19は、この構造テンプレを増やした。

### 5.4 fixtureを回帰確認ではなく実装目標にした

A/C/D/Bの実機入力は、失敗再現fixtureとしては必要である。  
しかし、私はそれを `Aを通す / Cを通す / Dを通す / Bを止める` という実装目標にした。

これは、`例文はruntime条件にしない。テストケースとして扱う。` に反する。

---

## 6. EmlisAI是正方針

### 6.1 最上位方針

```text
EmlisAIは、safety / infrastructure を除く通常入力に対して、原則として観測応答へ向かう。
低情報入力も無応答にしない。
Gateは、返答を消すためではなく、安全・短縮・限定・再生成へ回すために使う。
```

### 6.2 EmlisAIの応答種別

内部応答種別を設計する。  
public statusをすぐ増やすかは実装段階で判断するが、内部判断は `passed / rejected / unavailable` だけに依存させない。

内部response kind案:

```text
normal_observation
low_information_observation
limited_grounding_observation
self_denial_safe_state_answer
safety_support_required
safety_blocked_emergency
infrastructure_error
```

意味:

| response_kind | 意味 | public扱い案 |
|---|---|---|
| `normal_observation` | 入力材料が十分あり、状態観測 + フォローを返す | `passed + comment_text` |
| `low_information_observation` | 材料が薄いが、見えている範囲を返す | `passed + comment_text` |
| `limited_grounding_observation` | 深い断定はできないが、限定観測を返す | `passed + comment_text` |
| `self_denial_safe_state_answer` | 自己否定を事実化せず、安全に状態回答する | `passed + comment_text` または専用内部kind。実装段階でSafetyと調整 |
| `safety_support_required` | 通常観測では扱えないが、安全導線が必要 | Emlis観測とは別導線を設計 |
| `safety_blocked_emergency` | 明確な緊急安全境界 | 通常観測では表示しない。別安全応答 |
| `infrastructure_error` | 生成失敗・timeout等 | 観測として嘘を返さない |

### 6.3 Gateの新しい扱い

Gate failure時は、まず以下の順に縮退する。

```text
1. surface短縮
2. 根拠範囲の限定
3. 断定強度の低下
4. 文数削減
5. relation depth削減
6. low_information_observation への再ルーティング
7. self_denial_safe_state_answer への再ルーティング
8. safety_blocked_emergency / infrastructure_error への終了
```

`Gate failed => empty_comment_text` は最後の安全境界 / infra境界に限定する。

### 6.4 テンプレ判定の新定義

以下は今後テンプレとして扱う。

```text
固定文
固定fallback
role別完成文map
case_id専用route
input example語彙のruntime条件化
feature cue一致だけで決まるsurface
modeごとの完成文
fixture通過のためだけのsurface
分類外入力が無応答になる構造
```

判定基準:

```text
入力整理、状態言語化、関係構造、根拠span、内部問いへの回答に接続しているか。
```

---

## 7. 撤回対象

撤回とは、即時雑削除ではなく、**本線設計として採用しない** という意味である。  
実装段階では `delete / quarantine / generalize` に分ける。

### 7.1 Phase19 A/C/D個別route方針

撤回対象:

```text
A専用に近い complete_initial_low_information_repair_ownership
C専用に近い self_understanding_learning_shift
D専用に近い relationship_gratitude_recovery
```

理由:

```text
A/C/D exact fixtureを通すための個別分類とsurface追加に寄っているため。
```

### 7.2 C/D専用feature cue

撤回対象:

```text
emlis_ai_shared_reception_evidence.py の
self_understanding_learning_shift / relationship_gratitude_recovery 系cue
```

扱い:

```text
delete候補:
  入力例の語彙に強く寄りすぎているcue。

quarantine候補:
  Phase19失敗再現・比較用に保持するがruntimeから外すcue。

generalize候補:
  汎用の relation / event / state / boundary feature へ抽象化可能なもの。
```

### 7.3 C/D専用mode priority

撤回対象:

```text
MODE_SELF_UNDERSTANDING_LEARNING_SHIFT
MODE_RELATIONSHIP_GRATITUDE_RECOVERY
```

扱い:

```text
runtime priorityから外す。
汎用response_kind / relation-feature / sentence-planへ吸収できる要素だけ残す。
```

### 7.4 mode別完成surface文

撤回対象:

```text
_learning_shift_surface_text_for_line(...)
_relationship_gratitude_surface_text_for_line(...)
```

理由:

```text
Surface Realizerがmode別完成文bankへ寄っている。
入力根拠から文を組み立てる構造ではない。
```

### 7.5 Bを一律非表示固定したPhase19方針

撤回対象:

```text
B = safety_blocked = input_feedback absent = RN modal false
```

理由:

```text
緊急安全境界と自己否定安全応答を分けていないため。
自己否定を通常観測で上書きしてはいけないが、自己否定安全応答まで無反応にするのは誤り。
```

---

## 8. 保持対象

### 8.1 A〜D exact fixture

保持する。  
ただし意味を変える。

```text
誤った意味:
  A/C/Dを通せば合格。

正しい意味:
  無応答・case専用route・safety境界破壊が再発していないかを見る回帰fixture。
```

### 8.2 public feedback boundary tests

保持する。

理由:

```text
passed + comment_text のpublic表示境界、comment_text missing時の非表示、raw meta非混入確認は必要。
```

ただし、A/C/D exact文一致を期待してはいけない。

### 8.3 RN production code未変更方針

保持する。

理由:

```text
RN表示契約は既に安定しており、軽く変更すると破壊が大きい。
backend側でまずEmlisAI応答を是正する。
```

### 8.4 Safety / Grounding / Template / Visible quality guard

保持する。

ただし役割を変更する。

```text
保持する役割:
  危険文・根拠なし文・破綻文・テンプレ文を止める。

撤回する役割:
  落ちたら即無応答にする。
```

### 8.5 Evidence / Relation / SentencePlan / Surface Parts

保持する。

理由:

```text
Emlis観測専用辞書の方針と合っている。
ただし、完成文bank化してはいけない。
```

---

## 9. 再設計対象

### 9.1 Internal Response Contract

再設計する。

現状:

```text
passed / rejected / unavailable / safety_blocked 中心。
```

是正後:

```text
response_kind中心。
public statusは互換のために使うが、内部判断の中心にしない。
```

### 9.2 Safety Triage

再設計する。

必要な分類:

```text
safe_observation
self_denial_safe_state_answer
safety_support_required
safety_blocked_emergency
```

禁止:

```text
自己否定・自傷隣接を全部safety_blockedで非表示にする。
safety_blockedを通常観測としてpassedへ変換する。
```

### 9.3 Low Information Router

再設計する。

現状:

```text
文字数・文数・特定語彙・A型compact signal中心。
```

是正後:

```text
入力束から、出来事・対象・関係・差分・行動・時間・感情方向・カテゴリ方向・未確定slotを読む。
```

### 9.4 Gate Recovery Loop

再設計する。

現状:

```text
Gate failure -> rejected / unavailable / empty_comment_text になりやすい。
```

是正後:

```text
Gate failure -> 短縮 / 限定 / 再生成 / low-info / self-denial-safe / safety emergency / infra の順で処理する。
```

### 9.5 Surface Realizer

再設計する。

現状:

```text
mode別完成文に寄っている箇所がある。
```

是正後:

```text
SourceAnchor / EvidenceSpan / RelationUnit / SentencePlan / TonePolicy / BoundaryPolicy から自然文を組み立てる。
```

### 9.6 QA / Metrics

再設計する。

主指標:

```text
always_display_rate
low_info_observation_rate
unsupported_assertion_count
template_repeat_rate
blind_qa_fatal_count
self_denial_safe_response_rate
emergency_safety_not_overridden_count
```

A/C/D exact greenは主指標ではない。

---

## 10. JSON / schema案

以下は設計案である。  
実ファイル化するか、Python dataclass / TypedDict / Pydantic model / existing meta dict にするかは、実装段階で現物コードを見て判断する。

### 10.1 Internal Response Contract schema案

```json
{
  "$id": "cocolon.emlis.internal_response_contract.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "response_kind": {
      "enum": [
        "normal_observation",
        "low_information_observation",
        "limited_grounding_observation",
        "self_denial_safe_state_answer",
        "safety_support_required",
        "safety_blocked_emergency",
        "infrastructure_error"
      ]
    },
    "public_observation_status": {
      "enum": ["passed", "rejected", "unavailable", "safety_blocked"]
    },
    "comment_text_required": { "type": "boolean" },
    "public_input_feedback_allowed": { "type": "boolean" },
    "reason": { "type": "string" },
    "safety_triage_kind": {
      "enum": [
        "safe_observation",
        "self_denial_safe_state_answer",
        "safety_support_required",
        "safety_blocked_emergency",
        "not_evaluated"
      ]
    },
    "grounding_scope": {
      "enum": ["current_input_only", "current_input_plus_allowed_user_fact", "none"]
    },
    "repair_attempts": {
      "type": "array",
      "items": { "$ref": "#/$defs/repair_attempt" }
    }
  },
  "required": [
    "response_kind",
    "public_observation_status",
    "comment_text_required",
    "public_input_feedback_allowed",
    "reason",
    "safety_triage_kind",
    "grounding_scope",
    "repair_attempts"
  ],
  "$defs": {
    "repair_attempt": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "attempt_index": { "type": "integer", "minimum": 0 },
        "repair_kind": {
          "enum": [
            "surface_shorten",
            "grounding_narrow",
            "assertion_soften",
            "sentence_count_reduce",
            "relation_depth_reduce",
            "low_information_reroute",
            "self_denial_safe_reroute",
            "safety_emergency_exit",
            "infra_exit"
          ]
        },
        "from_gate": { "type": "string" },
        "result": { "enum": ["passed", "failed", "not_run"] }
      },
      "required": ["attempt_index", "repair_kind", "from_gate", "result"]
    }
  }
}
```

### 10.2 Input Material Bundle schema案

```json
{
  "$id": "cocolon.emlis.input_material_bundle.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "thought_text": { "type": "string" },
    "action_text": { "type": "string" },
    "emotion_labels": { "type": "array", "items": { "type": "string" } },
    "emotion_intensities": { "type": "array", "items": { "type": "string" } },
    "category_labels": { "type": "array", "items": { "type": "string" } },
    "visible_material_slots": {
      "type": "array",
      "items": {
        "enum": [
          "event",
          "target",
          "emotion_direction",
          "relationship",
          "action",
          "change",
          "time",
          "value",
          "unresolved_weight"
        ]
      }
    },
    "unknown_slots": {
      "type": "array",
      "items": {
        "enum": [
          "event",
          "target",
          "cause",
          "relationship",
          "duration",
          "user_intent",
          "next_action",
          "impact"
        ]
      }
    },
    "material_quality": {
      "enum": ["eligible", "low_information", "limited_grounding", "safety_triage_required"]
    }
  },
  "required": [
    "thought_text",
    "action_text",
    "emotion_labels",
    "category_labels",
    "visible_material_slots",
    "unknown_slots",
    "material_quality"
  ]
}
```

### 10.3 Safety Triage schema案

```json
{
  "$id": "cocolon.emlis.safety_triage.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "safety_triage_kind": {
      "enum": [
        "safe_observation",
        "self_denial_safe_state_answer",
        "safety_support_required",
        "safety_blocked_emergency"
      ]
    },
    "normal_observation_allowed": { "type": "boolean" },
    "safe_state_answer_allowed": { "type": "boolean" },
    "public_emlis_observation_allowed": { "type": "boolean" },
    "requires_separate_safety_surface": { "type": "boolean" },
    "blocked_reason": { "type": ["string", "null"] },
    "must_not_accept_identity_claim_as_fact": { "type": "boolean" }
  },
  "required": [
    "safety_triage_kind",
    "normal_observation_allowed",
    "safe_state_answer_allowed",
    "public_emlis_observation_allowed",
    "requires_separate_safety_surface",
    "blocked_reason",
    "must_not_accept_identity_claim_as_fact"
  ]
}
```

### 10.4 Gate Recovery Event schema案

```json
{
  "$id": "cocolon.emlis.gate_recovery_event.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "gate_name": {
      "enum": [
        "visible_surface_acceptance_gate",
        "grounding_gate",
        "template_gate",
        "safety_gate",
        "runtime_surface_gate"
      ]
    },
    "failure_reasons": { "type": "array", "items": { "type": "string" } },
    "recovery_policy": {
      "enum": [
        "shorten_surface",
        "narrow_grounding_scope",
        "soften_assertion",
        "reduce_relation_depth",
        "reroute_low_information",
        "reroute_self_denial_safe_state_answer",
        "exit_safety_emergency",
        "exit_infra"
      ]
    },
    "comment_text_must_not_be_emptied_yet": { "type": "boolean" },
    "final_exit_allowed": { "type": "boolean" }
  },
  "required": [
    "gate_name",
    "failure_reasons",
    "recovery_policy",
    "comment_text_must_not_be_emptied_yet",
    "final_exit_allowed"
  ]
}
```

### 10.5 Phase19 Diff Review schema案

```json
{
  "$id": "cocolon.emlis.phase19_diff_review.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "file_path": { "type": "string" },
    "symbol_name": { "type": "string" },
    "introduced_for_phase19_case": {
      "enum": ["A", "B", "C", "D", "boundary", "unknown"]
    },
    "current_decision": {
      "enum": ["delete", "quarantine", "generalize", "retain"]
    },
    "reason": { "type": "string" },
    "replacement_design": { "type": ["string", "null"] },
    "requires_test_update": { "type": "boolean" }
  },
  "required": [
    "file_path",
    "symbol_name",
    "introduced_for_phase19_case",
    "current_decision",
    "reason",
    "replacement_design",
    "requires_test_update"
  ]
}
```

### 10.6 QA Matrix schema案

```json
{
  "$id": "cocolon.emlis.response_contract_qa_matrix.v1",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "case_id": { "type": "string" },
    "input_family": {
      "enum": [
        "normal_eligible",
        "low_information_short",
        "low_information_ambiguous",
        "limited_grounding_long",
        "self_denial_non_emergency",
        "safety_emergency",
        "mixed_emotion_relationship",
        "emotion_category_mismatch",
        "action_only_specific",
        "thought_only_abstract"
      ]
    },
    "expected_response_kind": { "type": "string" },
    "expected_public_feedback": { "type": "boolean" },
    "must_not": {
      "type": "array",
      "items": {
        "enum": [
          "empty_comment_text",
          "raw_input_echo",
          "unsupported_assertion",
          "diagnosis",
          "personality_label",
          "fixed_template",
          "case_specific_route",
          "safety_overwrite",
          "advice_first"
        ]
      }
    },
    "quality_assertions": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": [
    "case_id",
    "input_family",
    "expected_response_kind",
    "expected_public_feedback",
    "must_not",
    "quality_assertions"
  ]
}
```

---

## 11. 実装順

以下をPhase20として実装する。  
ただし、各Phaseでは「修正必要箇所のみ修正し、新規・修正ファイルのみzip化」の運用を継続する。

---

## Phase20-0: 現状棚卸しとPhase19差分分類

### 目的

Phase19で入った差分を、`delete / quarantine / generalize / retain` に分類する。  
このPhaseではproduction挙動を変えない。分類とテスト保護だけを行う。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_shared_reception_evidence.py
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/config/emlis_reception_assistance_dictionary.v1.json
Cocolon/tests/rn-screen-contracts.test.js
mashos-api/ai/tests/test_emotion_submit_phase19_real_device_abcd_public_feedback_e2e.py
mashos-api/ai/tests/test_emotion_submit_phase19_public_feedback_boundary_e2e.py
```

### 実装内容

```text
1. Phase19由来のsymbolsを一覧化する。
2. 各symbolを delete / quarantine / generalize / retain に分類する。
3. runtime本線に残っているA/C/D専用routeを特定する。
4. exact fixtureは回帰fixtureとして再定義する。
5. RN exact commentText期待を、shape / behavior期待へ変更する準備を行う。
```

### 受け入れ条件

```text
- Phase19差分一覧がテストまたはdocstringで追える。
- 削除はまだしない。
- production挙動変更なし。
- 次Phaseで安全に撤回できる対象が明確になっている。
```

---

## Phase20-1: Internal Response Contract追加

### 目的

`passed / rejected / unavailable` 中心ではなく、内部response_kind中心の設計へ移行する土台を作る。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/services/ai_inference/emotion_submit_service.py
新規候補: mashos-api/ai/services/ai_inference/emlis_ai_response_contract.py
新規候補: mashos-api/ai/tests/test_emlis_ai_response_contract.py
```

### 実装内容

```text
1. Internal response_kind enum相当を追加する。
2. public observation_status とのmappingを定義する。
3. comment_text_required / public_input_feedback_allowed をresponse_kindから判定するhelperを作る。
4. 既存public contractは壊さない。
5. まだRN productionは変更しない。
```

### 受け入れ条件

```text
- normal_observation / low_information_observation / limited_grounding_observation は public passed + comment_text を目指す。
- safety_blocked_emergency は通常Emlis観測へ変換されない。
- infrastructure_error はEmlis観測本文を偽装しない。
- 既存public feedback meta testsが通る。
```

---

## Phase20-2: Safety Triage再設計

### 目的

自己否定・自傷隣接・緊急安全境界を一律 `safety_blocked` で無反応にしない。  
ただし、危険入力を通常観測へ変換しない。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_reception_mode_resolver.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_safety_* または既存Safety関連ファイル
新規候補: mashos-api/ai/services/ai_inference/emlis_ai_safety_triage.py
新規候補: mashos-api/ai/tests/test_emlis_ai_safety_triage_response_contract.py
```

### 実装内容

```text
1. self_denial_safe_state_answer と safety_blocked_emergency を分ける。
2. B相当の入力が本当にemergencyか、自己否定安全応答かを切る。
3. 自己否定安全応答では、自己否定内容を事実として受け入れない。
4. 緊急安全境界では通常Emlis観測を出さない。
5. safety_support_required / emergency 用の別導線は設計対象に残す。
```

### 受け入れ条件

```text
- 自己否定非緊急入力が無条件でinput_feedback absentにならない。
- 緊急安全境界がpassedに変換されない。
- 自己否定を人格事実として扱わない。
- 既存Safety Gateを緩めない。
```

---

## Phase20-3: Input Material Bundle / Eligibility Router再設計

### 目的

入力を文字数やcase語彙で判定せず、思考内容・行動内容・感情・カテゴリの束から材料量と観測可能範囲を判断する。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_shared_reception_evidence.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
mashos-api/ai/services/ai_inference/emlis_ai_current_input_bundle.py または相当箇所
新規候補: mashos-api/ai/services/ai_inference/emlis_ai_input_material_bundle.py
新規候補: mashos-api/ai/services/ai_inference/emlis_ai_observation_eligibility_router.py
```

### 実装内容

```text
1. thought / action / emotion / category をbundle化する。
2. visible_material_slots / unknown_slots を算出する。
3. material_quality を eligible / low_information / limited_grounding / safety_triage_required に分ける。
4. A専用compact signalを汎用low-information判定へ移行する。
5. C/D専用cueをruntime判定から外し、汎用relation材料に再分類する。
```

### 受け入れ条件

```text
- 短文でも、感情・カテゴリから見える範囲を返せる。
- 長文でも、関係・対象が曖昧なら断定を弱める。
- 低情報 = 短文 ではなく、入力束の材料不足として判定する。
- A exact fixtureがcase専用routeなしでlow_information_observationへ行く。
```

---

## Phase20-4: 汎用Low Information Observation復旧

### 目的

低情報入力を無応答にしない。  
見えている範囲と見えていない範囲を分け、ユーザー主導で追加を促す。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_low_information_observation_composer.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
```

### 実装内容

```text
1. visible_material_slots から低情報surfaceを組み立てる。
2. unknown_slots から質問または追加促しを作る。
3. 質問だけで終わらせない。
4. 深い背景・人格・関係・原因を補完しない。
5. Gateを通る最低品質を満たす。
```

### 受け入れ条件

```text
- A exact fixtureがpassed + comment_textになる。
- A以外の短文variantでも応答する。
- raw input echoだけにならない。
- fixed fallbackではない。
- low_info_observation_rate 100%を目標にできる。
```

---

## Phase20-5: Gate Recovery Loop再設計

### 目的

Gate failure時に非表示で終わらず、短縮・限定・再生成・低情報/安全応答へ回す。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_visible_surface_acceptance_gate.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_observation_display_repair_integration.py
mashos-api/ai/services/ai_inference/emlis_ai_reply_service.py
新規候補: mashos-api/ai/services/ai_inference/emlis_ai_gate_recovery_loop.py
```

### 実装内容

```text
1. Gate failure reasonを分類する。
2. surface skeleton / repeated tail は文面修復へ回す。
3. grounding failure は根拠範囲縮小へ回す。
4. overclaim は断定弱化へ回す。
5. material不足はlow-informationへ回す。
6. self-denialはsafe-stateへ回す。
7. emergency/infraのみ最終的にcomment_text absentを許す。
```

### 受け入れ条件

```text
- Gate failureの第一反応がempty_comment_textではない。
- C/Dのような長文入力がcase専用modeなしでlimited/normal observationへ復旧できる。
- Gate閾値自体は緩めない。
```

---

## Phase20-6: Generic SentencePlan / Surface Realizer再設計

### 目的

mode別完成surfaceを撤回し、入力根拠・関係・sentence planから自然文を作る。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emlis_ai_complete_surface_realizer.py
mashos-api/ai/services/ai_inference/emlis_ai_two_stage_section_surface_plan.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_sentence_planner.py
mashos-api/ai/services/ai_inference/emlis_ai_complete_tone_policy.py
```

### 実装内容

```text
1. _learning_shift_surface_text_for_line をruntime本線から外す。
2. _relationship_gratitude_surface_text_for_line をruntime本線から外す。
3. relation_unit / material_slot / tone_policy / boundary_policy からsurfaceを生成する。
4. 「見えています」「受け取れます」などの観測語が関係構造へ接続しているか検査する。
5. 完成文ではなく、sentence plan断片 + surface ruleで作る。
```

### 受け入れ条件

```text
- C exact fixtureがself_understanding_learning_shiftなしで返る。
- D exact fixtureがrelationship_gratitude_recoveryなしで返る。
- exact文一致ではなく、品質assertionで確認する。
- mode別完成文bankが減る。
```

---

## Phase20-7: Public Boundary / RN Contract整理

### 目的

RN productionを壊さず、EmlisAIの新内部contractがpublic responseへ正しく接続することを確認する。

### 対象候補

```text
mashos-api/ai/services/ai_inference/emotion_submit_service.py
mashos-api/ai/services/ai_inference/emlis_ai_public_feedback_meta.py
mashos-api/ai/tests/test_emotion_submit_phase19_public_feedback_boundary_e2e.py
mashos-api/ai/tests/test_emlis_ai_post_final_gate_recovery_phase20_13.py
mashos-api/ai/tests/test_emlis_ai_gate_recovery_surface_phase20_15.py
Cocolon/tests/rn-screen-contracts.test.js
```

### 実装内容

```text
1. normal / low / limited は passed + comment_text としてpublic responseへ接続する。
2. emergency safety / infra はEmlis観測として偽装しない。
3. internal response_kind / mode名 / evidence本文をpublicへ出さない。
4. RN exact commentText fixtureをshape / behavior contractへ変更する。
```

### 受け入れ条件

```text
- RN production code変更なし。
- input_feedback.comment_text / observation_status 契約維持。
- observation_text / reception_text / diagnostic_summaryを表示源にしない。
- exact generated textに依存しないcontract testへ移行。
```

---

## Phase20-8: QA Matrix再構築

### 目的

A/C/D exactを通すだけのQAから、入力群全体の応答品質QAへ移行する。

### 追加fixture families

```text
normal_eligible
low_information_short
low_information_ambiguous
limited_grounding_long
self_denial_non_emergency
safety_emergency
mixed_emotion_relationship
emotion_category_mismatch
action_only_specific
thought_only_abstract
```

### 実装内容

```text
1. exact fixtureは残すが、text一致を期待しない。
2. familyごとのresponse_kindを確認する。
3. empty_comment_textをfatal化する範囲を明確にする。
4. unsupported_assertion / diagnosis / personality_label / fixed_template をfatalにする。
5. blind QA相当の読感assertionを追加する。
```

### 受け入れ条件

```text
- safety/infra除く通常入力 always_display_rate 100%を目標にできる。
- low_info_observation_rate 100%を目標にできる。
- template_repeat_rateが増えない。
- unsupported_assertion_count 0。
```

---

## Phase20-9: Phase19撤回実装

### 目的

Phase20-0で分類したPhase19差分を、実際に削除・隔離・汎用化する。

### 実装内容

```text
1. delete対象をruntimeから削除する。
2. quarantine対象をdiagnostic/test fixtureへ移す。
3. generalize対象を汎用relation/material/sentence planへ吸収する。
4. Phase19 test名・expectationを是正後の意味へ変える。
```

### 受け入れ条件

```text
- production codeにPhase19 C/D専用modeが残らない。
- A/C/D exact fixtureは汎用contractでgreen。
- Bは緊急安全境界か自己否定安全応答かを正しく分類。
- 既存Phase18 / TwoStage / PublicFeedback / RN testsが通る。
```

---

## Phase20-10: 実機再確認

### 目的

ローカルtest green後に、実機でEmlisAIが「入力に返る」体験へ戻っていることを確認する。

### 確認観点

```text
A:
  低情報観測として返る。
  深い背景補完なし。
  無応答ではない。

B:
  緊急安全境界か自己否定安全応答かを適切に扱う。
  自己否定内容を事実化しない。
  通常観測で危険を上書きしない。

C:
  C専用modeなしで、入力束の関係・変化・行動を読んで返る。
  surface skeleton / repeated tailにならない。

D:
  D専用modeなしで、関係・感情・友人支援・区切り・返したい意図を根拠内で扱う。
  元彼評価・怒り増幅・悲しみ消去・アドバイス化をしない。
```

保存するログ:

```text
request id
response_kind
public observation_status
comment_text presence
safety_triage_kind
material_quality
visible_material_slots
unknown_slots
gate recovery attempts
public input_feedback presence
RN modal opened
```

---

## 12. 実装時に触ってはいけないもの

```text
DB physical schema
API route追加
RN production UI
public keyとしての observation_text / reception_text 追加
外部AIサービス前提
fixed fallback
case_id runtime condition
Phase名 runtime condition
safety emergency を passed にする処理
診断・人格断定・原因断定
```

---

## 13. 実装時の停止条件

以下が1つでも出たら、実装を止める。

```text
1. fixtureを通す以外の価値説明ができない。
2. EmlisAIの目的を説明できない。
3. 前提資料と実装方針が衝突している。
4. case専用route / feature / surfaceを追加しようとしている。
5. Gate failure後が非表示だけになっている。
6. 自己否定入力を全部safety_blockedへ潰している。
7. mode別完成文が増えている。
8. exact commentTextをQA合格条件にしている。
9. 確認していないファイルを確認済み扱いしそうになっている。
```

---

## 14. 今後の作業姿勢

### 14.1 実装前に必ず出す

```text
確認済み:
  実際に開いた資料・実ファイル・ログ。

未確認:
  存在は知っているが、まだ本文やコードを確認していないもの。

書かれていない:
  資料・コードにないもの。

推測禁止:
  根拠なしに決めてはいけないもの。

次に実行すべきこと:
  実装前に何を確認し、何を変更するか。
```

### 14.2 成果の定義

以下だけでは成果と呼ばない。

```text
pytestが通った
fixtureがgreenになった
Gateを緩めていない
RN contractを壊していない
```

EmlisAIで成果と呼べるのは、以下が成立したときである。

```text
入力に返る。
読まれた形になる。
根拠外断定しない。
テンプレ共感で終わらない。
低情報を無応答にしない。
自己否定を事実化しない。
安全境界を通常観測で上書きしない。
```

### 14.3 設計用語へ逃げない

`Gate / Composer / Surface / mode / schema` は説明道具であり、目的ではない。  
今後は必ず以下を説明する。

```text
この変更で、ユーザーに何が返るのか。
この変更で、Cocolonの何が守られるのか。
この変更で、入力がどう読まれるのか。
```

---

## 15. 最終合格ライン

Phase20の最終合格は、次である。

```text
1. safety / infrastructure を除く通常入力で、EmlisAIが原則として応答する。
2. 低情報入力が無応答にならない。
3. Gate failureが沈黙ではなく、短縮・限定・再生成・低情報・安全応答へ回る。
4. 自己否定入力を、緊急安全境界と安全な状態回答に分けられる。
5. C/D専用mode・cue・完成surfaceを本線から撤回できている。
6. A/C/D exact fixtureは、case専用routeなしでgreenになる。
7. RN public contractを壊さない。
8. 固定fallback・完成文テンプレ・runtime例文条件がない。
9. EmlisAIが、入力直後の観測返答として成立している。
```

---

## 16. 2026-06-01 実装反映: Phase20-0〜20-10 current state

本資料の是正方針は、最新実ファイル `mashos-api_5(47).zip` / `Cocolon_5(22).zip` でPhase20-0〜20-15として実装反映済みである。ここから先は、本資料のPhase20実装順を「未実装の予定表」ではなく、実装済みの撤回保持再設計境界として読む。

### 16.1 確認した最新実ファイル

```text
premise: Cocolon_前提資料(161).zip
frontend: Cocolon_5(22).zip
backend: mashos-api_5(47).zip
frontend file count: 217
backend file count: 738
total: 955
```

### 16.2 実装済みPhase20の読み方

| Phase | 実装後の扱い | 主な実ファイル |
|---|---|---|
| Phase20-0 | Phase19差分はtest-only inventoryで分類済み。production挙動はこの段階では変えない。 | `tests/helpers/emlis_ai_phase20_phase19_diff_inventory.py`, `test_emlis_ai_phase20_phase19_diff_inventory.py` |
| Phase20-1 | Internal Response Contractを追加し、`response_kind` を内部判断の中心にした。 | `emlis_ai_response_contract.py` |
| Phase20-2 | Safety Triageを再設計し、自己否定安全応答と緊急安全境界を分けた。 | `emlis_ai_safety_triage.py`, `emlis_ai_self_denial_safe_state_answer.py` |
| Phase20-3 | Input Material Bundle / Eligibility Routerを追加し、文字数・case cueではなく入力束で材料量を読む。 | `emlis_ai_input_material_bundle.py`, `emlis_ai_observation_eligibility_router.py` |
| Phase20-4 | 汎用Low Information Observationを復旧し、見えている範囲とunknown slotsから返す。 | `emlis_ai_low_information_observation_composer.py` |
| Phase20-5 | Gate Recovery Loopを追加し、Gate failureを短縮・限定・断定弱化・低情報/安全応答へ回す。 | `emlis_ai_gate_recovery_loop.py` |
| Phase20-6 | Generic SentencePlan / Surfaceへ移し、C/D専用完成surfaceをruntime本線から撤回した。 | `emlis_ai_complete_surface_realizer.py`, `emlis_ai_two_stage_section_surface_plan.py` |
| Phase20-7 | Public Boundary / RN Contractを整理し、internal response contractをpublic表示sourceへ出さない。 | `emlis_ai_public_feedback_meta.py`, `emotion_submit_service.py`, `Cocolon/tests/rn-screen-contracts.test.js` |
| Phase20-8 | QA Matrixを追加し、exact generated text一致ではなくfamily品質とfatal条件で見る。 | `emlis_ai_response_contract_qa_matrix.py` |
| Phase20-9 | Phase19 C/D専用mode・cue・完成surfaceをproduction本線から撤回し、汎用materialへ吸収した。 | `emlis_ai_shared_reception_evidence.py`, `emlis_ai_reception_mode_resolver.py`, `config/emlis_reception_assistance_dictionary.v1.json` |
| Phase20-10 | 実機再確認でAだけEmlis観測が出なかった問題を、低情報material成立時のscope-only blocker扱いとして修正した。 | `emlis_ai_observation_display_repair_integration.py`, `test_emlis_ai_phase20_10_real_device_recheck.py` |
| Phase20-11 | Mash様の実機確認によりABCD全件でRN modal「Emlisの観測」が表示されたことを資料同期として記録した。 | 資料同期のみ。production RN UI / DB / API / public response key変更なし。 |
| Phase20-12 | 旧fail-closed説明コメントを、displayable response kindではbounded repair / recoveryを通す説明へ更新した。 | `emlis_ai_reply_service.py` |
| Phase20-13 | final pre-return gate後にdisplayable response kindが空白へ戻らないことをregression testで固定した。 | `test_emlis_ai_post_final_gate_recovery_phase20_13.py` |
| Phase20-14 | post-final gate recoveryを実装し、normal / low_information / limited_groundingを空白終了させず、safety / infraは通常観測へ偽装しない境界を追加した。 | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py` |
| Phase20-15 | Gate Recovery surface binding meta / repetition QAを追加し、fixed fallback化をmaterial / family単位で検出できるようにした。 | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` |

### 16.3 A/B/C/D fixtureの実装後の意味

```text
A:
  low_information_observation の回帰fixture。
  A専用routeではなく、入力束のmaterial_quality=low_informationから復旧する。
  Phase20-10でscope-only blockerによる実機非表示を修正済み。

B:
  self_denial_safe_state_answer / safety triage の回帰fixture。
  自己否定内容を本人の事実として確定しない。
  緊急安全境界は通常観測としてpassed化しない。

C / D:
  generic sentence plan / generic relation material の回帰fixture。
  self_understanding_learning_shift / relationship_gratitude_recovery の専用mode・cue・完成surfaceでは通さない。
```

### 16.4 public / RN contractの実装後の固定境界

```text
public visible body:
  input_feedback.comment_text

public display status:
  input_feedback.emlis_ai.observation_status

RN modal title:
  Emlisの観測

RN open condition:
  observation_status == passed && commentText non-empty

publicへ出さないもの:
  response_kind
  safety_triage_kind
  material_quality
  visible_material_slots / unknown_slots
  internal_response_contract
  repair_attempts
  diagnostic_summary body
  observation_text / reception_text public key
```

### 16.5 実装後も禁止のままのこと

```text
DB physical schema変更
API route追加
RN production UI変更
public response key追加
C/D専用mode・cue・完成surfaceの復活
A低情報のcase専用route化
exact commentText一致をQA合格条件にすること
Gate recoveryのfixed fallback化
self_denialを人格事実として扱うこと
safety emergencyを通常Emlis観測としてpassed化すること
```

### 16.6 Phase20-11 / Mash実機確認: Phase20 ABCD全件表示

2026-06-01時点で、Mash様から次の実機確認が共有された。

```text
確認者: Mash様
確認日: 2026-06-01 JST
確認対象: Phase20にあるA/B/C/Dサンプル入力
確認内容: A/B/C/DすべてでRN modal「Emlisの観測」が表示された
確認範囲: 表示有無の確認
記録しないもの: raw input本文 / comment_text本文 / 実レスポンスJSON本文 / スクリーンショット本文
```

この確認の扱いは次で固定する。

```text
- Phase20-10でA低情報入力のscope-only blockerを修正した後、ABCDすべてでEmlisの観測表示を確認済みとして読む。
- この確認は、実機表示有無の確認であり、文章品質・読感品質・商品品質の最終合格ではない。
- ABCDは回帰fixtureであり、runtime case専用route、case専用mode、case専用cue、完成文テンプレ、exact commentText一致の根拠にしない。
- A-only blocker fixは履歴として残すが、最新状態はABCD全件表示確認済みと読む。
```

このPhase20-11は資料同期と実機確認記録だけであり、production RN UI、DB physical schema、API route、public response key、public observation_status enumは変更しない。

以上を、Phase20後のEmlisAI作業のcurrent stateとして固定する。


## 17. 2026-06-01 実装反映: Phase20-12〜20-15 Display Reliability Hardening current state

最新実ファイル `mashos-api_5(47).zip` / `Cocolon_5(22).zip` では、Phase20-11までの資料同期に加えて、Phase20-12〜20-15の表示信頼性補強が実装済みである。これはPhase20をやり直すものではなく、Phase20の撤回保持再設計後に残る「最後に空白へ戻る穴」と「Gate Recovery surfaceのfixed fallback化リスク」を塞ぐ補強として読む。

### 17.1 確認した最新実ファイル

```text
premise: Cocolon_前提資料(161).zip
frontend: Cocolon_5(22).zip
backend: mashos-api_5(47).zip
frontend file count: 217
backend file count: 738
total: 955
```

### 17.2 実装済み補強の読み方

| Phase | 実装後の扱い | 主な実ファイル |
|---|---|---|
| Phase20-12 | 旧fail-closed説明コメントを修正した。Gateを緩めるのではなく、displayable response kindではbounded repair / recoveryを通す説明へ更新した。 | `emlis_ai_reply_service.py` |
| Phase20-13 | final pre-return gate後に通常入力が空白へ戻らないことをregression testで固定した。 | `test_emlis_ai_post_final_gate_recovery_phase20_13.py` |
| Phase20-14 | post-final gate recoveryを実装した。normal / low_information / limited_groundingは一回だけ回復対象にし、self_denial_safe_state_answerは既存safe branchを優先し、safety / infraは通常観測へ偽装しない。 | `emlis_ai_reply_service.py`, `emlis_ai_gate_recovery_loop.py` |
| Phase20-15 | Gate Recovery surface binding meta / repetition QAを追加した。本文・raw input・comment_text bodyを保存せず、material slots / relation family / surface familyでfixed fallback化を検出する。 | `emlis_ai_gate_recovery_loop.py`, `test_emlis_ai_gate_recovery_surface_phase20_15.py` |

### 17.3 追加された内部名の扱い

```text
phase20_13_post_final_gate_recovery:
  final pre-return gate後の回復結果を示す内部meta。public response keyではない。

post_final_pre_return_gate:
  recovery context名。RN表示条件ではない。

phase20_15_gate_recovery_surface_binding:
  Gate Recovery surfaceとmaterial / relation / unknown slotの接続を示す内部meta。comment_text本文は含めない。

gate_recovery_surface_repetition_qa:
  surface family / closing family反復を検出するQA。exact本文一致QAではない。
```

### 17.4 変更していない境界

```text
production RN UI: 変更なし
/emotion/submit route: 変更なし
request / response key: 変更なし
DB physical schema: 変更なし
public observation_status enum: 追加なし
visible body: input_feedback.comment_text のみ
RN表示条件: observation_status == passed && commentText non-empty
```

### 17.5 実装後も禁止のままのこと

```text
- post-final recoveryを理由にGate / Grounding / Reader / Templateを緩める。
- safety_blocked_emergency / infrastructure_error / safety_support_requiredを通常Emlis観測としてpassed化する。
- phase20_13_post_final_gate_recovery / phase20_15_gate_recovery_surface_binding をpublic response keyやRN表示条件にする。
- Gate Recovery surface binding metaへraw input / generated candidate / comment_text bodyを入れる。
- fixed_fallback_used=falseだけを合格根拠にし、surface family / material bindingを見ない。
- ABCD exact text一致を合格条件にする。
```

### 17.6 確認したテスト

```text
py_compile:
  emlis_ai_reply_service.py
  emlis_ai_gate_recovery_loop.py
  test_emlis_ai_post_final_gate_recovery_phase20_13.py
  test_emlis_ai_gate_recovery_surface_phase20_15.py

pytest:
  test_emlis_ai_post_final_gate_recovery_phase20_13.py -> 5 passed
  test_emlis_ai_gate_recovery_surface_phase20_15.py + test_emlis_ai_gate_recovery_loop_phase20_5.py -> 17 passed
  Phase20 public boundary / QA matrix / real-device recheck targeted set -> 28 passed, 1 warning
```

warningは既存の Pydantic `root_validator` deprecation warningであり、本Phase20-12〜20-15差分とは直接関係しない。

以上を、Phase20後のEmlisAI作業のcurrent stateとして固定する。


## 18. 2026-06-06 実装反映: Normal Observation Public Recovery P0-P9 current state

最新実ファイル `Cocolon_10(13).zip` / `mashos-api_10(25).zip` では、Phase20で固定した「Gate failureを沈黙で終わらせない」方針のうち、通常・高情報量入力が `surface_grammar` / `relation_skeleton` / `visible_surface` 系で落ちる場合の復旧先として、`normal_observation_rebuild_candidate` が実装済みである。

### 18.1 実装済み補強の読み方

| Phase | 実装後の扱い | 主な実ファイル |
|---|---|---|
| P0/P1 | 通常観測rebuildを赤テストとsource kind / blockerで固定した。 | `test_emlis_ai_gate_recovery_normal_observation_rebuild_p8.py`, `emlis_ai_gate_recovery_public_constants.py` |
| P2/P3 | public boundaryとrecovery planでnormal rebuildをallowed public candidate lineageとして扱う土台を追加した。 | `test_emlis_ai_gate_recovery_public_boundary_decision.py`, `emlis_ai_gate_recovery_public_candidate_builder.py` |
| P4 | 通常観測rebuild builderを実装し、AI生成済みoriginal candidateがある通常入力だけを対象にした。 | `emlis_ai_gate_recovery_public_candidate_builder.py` |
| P5 | Gate Recovery loopへ接続し、既存Gateを通して採用する。 | `emlis_ai_gate_recovery_loop.py` |
| P6 | reply_service post-final経路でactual adopted candidate sourceを保持する。 | `emlis_ai_reply_service.py`, `emlis_ai_display_gate.py` |
| P7/P8 | ProductQuality / public feedback diagnostics / real-device regressionでnormal rebuildをpublic candidate lineageとして固定する。 | `emlis_ai_product_quality_measurement_event.py`, `emlis_ai_public_feedback_meta.py`, `test_emlis_ai_product_quality_normal_observation_rebuild_p7.py` |
| P9 | ローカル検証。実装変更なし。 | backend主要関連 `56 passed`、RN contract `36 passed` |

### 18.2 この実装で守る是正方針

```text
- Gate failure後の通常入力を、empty comment_text で終わらせない縮退先を持つ。
- ただし、Gate Recovery material surfaceをpublic本文にはしない。
- Gateを緩めず、再構築候補も既存Gateを通す。
- low_information / limited_grounding / self_denial / safety / infraを通常観測rebuildと混同しない。
- A/C/D/F/E/G等の実機・fixture caseをruntime条件にしない。
- public metaへraw input / original candidate body / comment_text bodyを出さない。
```

このため、P0〜P9はPhase20是正方針の置換ではなく、Phase20後に残っていた「情報量がある通常入力ほどSurface Gateで沈黙する」穴への追加補強として読む。


以上。


## 19. 2026-06-06 実装反映: Public Observation Recovery P0-P10 current state

最新実ファイル `Cocolon_11(8).zip` / `mashos-api_11(17).zip` では、Phase20是正方針とNormal Observation Public Recoveryの上に、Public Observation Recovery P0〜P10が実装済みである。

### 19.1 実装済み補強の読み方

| Phase | 実装後の扱い | 主な実ファイル |
|---|---|---|
| P0/P1 | 表示到達と商品surface成立を分け、要求surface familyを決める。 | `emlis_ai_public_observation_recovery_status.py`, `emlis_ai_public_surface_requirement.py` |
| P2/P3 | two_stage_requiredでplain normal rebuildを採用せず、product surface validationで検出する。 | `emlis_ai_gate_recovery_public_candidate_builder.py`, `emlis_ai_product_surface_validation.py` |
| P4/P5 | C系source unavailableを診断し、normal rebuildではなくcomplete initial surface recomposition laneで扱う。 | `emlis_ai_complete_initial_surface_availability.py`, `emlis_ai_complete_initial_surface_recomposition.py` |
| P6 | D / Phase17 / ProductVisible系をlabelled two-stage surfaceへ戻す。 | `emlis_ai_labelled_two_stage_surface_recomposition.py` |
| P7/P8 | public feedback inclusion summaryとpublic_surface_lineage / ProductQuality lineageをbody-freeに整理する。 | `emotion_submit_service.py`, `emlis_ai_public_feedback_meta.py`, `emlis_ai_product_quality_measurement_event.py` |
| P9 | Acceptance E2E対象の二段surface / positive-change / self-understanding / effort-paceを成立させる。 | `emlis_ai_complete_surface_realizer.py` |
| P10 | production logicを触らず、回帰検査用diagnostic traversalをboundedにする。 | `tests/helpers/emlis_ai_public_observation_recovery_p0.py`, `tests/helpers/emlis_ai_phase19_public_feedback_matrix.py` |

### 19.2 この実装で守る是正方針

```text
- Gate failure後の通常入力を、empty comment_text で終わらせない縮退先を持つ。
- source unavailableをnormal rebuildで読めたふりにしない。
- two_stage_requiredの入力をplain surfaceで成功扱いしない。
- public_reached / rn_visible / product_surface_validを同一視しない。
- Gate Recovery material surfaceをpublic本文にはしない。
- Gateを緩めず、再構築候補も既存Gateを通す。
- A/C/D/F/E/G等の実機・fixture caseをruntime条件にしない。
- public metaへraw input / original candidate body / candidate body / comment_text bodyを出さない。
```

このため、P0〜P10はPhase20是正方針の置換ではなく、Phase20後に残っていた「表示不達」と「表示はされるが商品surfaceではない」を同時に塞ぐ追加補強として読む。
