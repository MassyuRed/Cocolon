# EmlisAI u325 — 選択済みの不明対象を受け取り本文へ戻す

記録：2026-10-18 JST／華恋。API baseline `0f78a0e25dd74a40aaedb28327658799ee1aa43b`、Cocolon baseline `aad0de61a11c8cf6ec6374912e6598d0a7e843f9`。合成入力のみ。PR3／PR30はDraft/open/unmerged・未配置。

API反映commit：`8df8bdb1d0076fe6c7895b7c423aa144182af4e6`。9 changed blobsをlocal treeと照合して既存PR3 branchへ反映。

## 修復した範囲

原04「なんだかしんどい。何が嫌なのか、自分でもよくわからない。」の選択済み意味には、本人のしんどさと、嫌な対象を本人もよく分からないことの両方が残っていた。しかしReceptionは「その反応を背景に、今ここに置かれた言葉を小さくせずに受け止めています。」となり、具体的な対象を消していた。

既存のLIMITED／ATTENTION／MATERIAL_WEIGHT・RECEIVE_AS_MATERIALを維持し、両方の選択済み対象を有限文で表す。現行は「なんだかしんどくて、何が嫌なのか、ご自身でもよくわからないのですね。」。嫌な対象をしんどさの原因と認定せず、「何が」を「なぜ／その理由」へ読み替えず、原文にない「まだ」を足さない。理由不明のu324 groupとは別の文法証明を使う。

主担当が下記10件の未加工全文を読んだ。対象・SELF・程度・否定・現在時点の欠落は修復できたが、Observationは引用中心、Receptionも原文に近い受け取りである。E04の入力固有の深い受容、E05の問い、初回一体単位の完成とは判定しない。10件すべてquestionなし／ENDであり、新しい問い・主観的判断・原因・助言は追加しない。

## 前提確認と境界

Cocolon前提ルール／CURRENT_RULES／Rule18、ProductNeglect必読監査、全体設計図01・01A・01B・01C、全ファイル地図02・02A・02B・02C、current_structureのEmlisAI／CMEE、最新weekly20261017のu324残件を確認した。直前u324の同一sessionで読んだ全体索引・主要経路と、今回のGitHub最新head・変更対象の現物を照合した。全ファイル本文の逐語精読を新たに完了したという記録ではない。System Context補助prepareは関連repo配置不足のため、既存の原本直接参照を継続した。

Mashの残件継続指示と既存設計内の修復委任で実施。主担当のみ編集・GitHub反映、同Work補助は前提／意味選択／構造のread-only照合。正式別modelのPro／Ultra評価ではない。InputScreen→useEmlisThread→API→Service→CMEE→保存DTO→Modalの経路を維持。公開API・DB schema・migration・製品依存関係・RN製品file・意味型・関係型・問い種類は変更しない。STRUCTURE_MAP_DELTA_NONE。既存5製品file内の修復と、新規の歴史fixture所在を追跡する。

## 実装と意味の同一性

- 完全なmemo二文を原文field全体で証明する。既存の現在SELF・negative・explicitな感情核と、不明の対象を持つ認識核を対象とし、既存Moveがその2核をtarget/supportに選んでいる場合だけ参照形式を明示にする。核・辺・重要度・Move数・対象選択・subjective propositionは変更しない。
- ThreadEvidenceSpanResolverに、既存qualified evidenceのfield UTF8範囲を読むread-only methodを追加した。raw fieldは元値のまま読み、既存入力normalizerでledgerと同じ座標へ揃えてからsource範囲を照合する。HRと独立readerも、span外の句読点・別文を含む全fieldを再照合する。明示参照の別経路でsource証明を迂回しない。source形式・Evidence IDを増やさない。
- IRは2核のslotとprofileを保持し、原文順の有限節へ実現する。「私」等は「あなた」、「自分／自分自身」は「ご自身」、「私自身」は「あなた自身」として受け手を保つ。readerは作者を呼ばず、有限接続と受け手を元へ戻し、両原文を完全一致で検査する。
- u324実engineの10件から完全checkpoint、核・辺hash、selected内容hash、公開本文とquestion decisionを凍結した。現在のcheckpoint・核・辺・選択内容は同一。参照方式を含むgrounding_refとselected input_refは正しく更新されるため、これら2個まで不変とは主張しない。projection preimage／subjective seal／全decisionとbindingを含む残りのselected内容は同一である。旧意味のfallbackを増やす必要はない。

## 検証

| 集合 | 最終結果 | 範囲 |
|---|---|---|
| source_scope | 292 passed | 既存232＋追加60。新本文／旧checkpoint同一性10、本文意味改変23、同義語尾2、source対象外15、IRと失効6、空白正規化4 |
| Q3 feeling_reason対照 | 48 passed／既存3 failed／905 deselected | u324と同じ3件。旧名詞句を期待するassertionを変更・削除・skipしていない |
| Q2/Q3 application | 54 passed／既存Pydantic warning 1 | 別file集合、実migration／RPCを隔離PGliteで実行 |
| 現行shared-owner identity | 1 passed | 現行fixtureを実sourceで更新。過去の歴史identity fixtureは不変 |
| 実service／版間保存 | 6ケース成功 | 現行free／plus／premium、旧完成、旧checkpoint前／後中断 |
| RN実API client／hook／Modal | 上の実DTO6件の完全一致表示・close/reopen成功 | native部品stub。実機・本番通信ではない |

対象外は理由不明、他者主体、他者報告、引用、仮定、過去、疑問末尾、別の第三文、単独不明。既にexplicitのMoveを与えても新IRへ入らないことを確認した。本文の対象変更、本人・格の変更、程度欠落、否定反転、時点変更、因果／対比への変更、片核削除を作者禁止の読取で拒否する。逆slotの原04も両核を復元する。IR marker重複・slot偽装・profile変更・不明object／owner変更・片核失効も拒否する。

反映前レビューで、先頭の半角空白だけで本文側のsource証明が外れる不一致を実測した。raw fieldとnormalized ledgerの座標差を既存normalizerで修復し、半角／全角の先頭、末尾、文間空白4件で実生成と独立inverseを確認した。

初回の追加試験では、意味内容だけでなく参照方式由来のgrounding_ref／input_refまで同一と置いた検査8件が失敗した。u324と現行の構造差を照合し、この2参照だけが更新され、decision・seal・semantic mapping等は同一であることを確認した。fixtureは修正前worktreeから再取得し、変化すべき2参照と不変の内容を別々にassertした。既存testの期待を緩めたものではない。

旧版の実engineを別worktreeで保存serviceへ接続した。旧完成本文は汎用表現を含む原文のまま、GET/startを作者禁止で完全一致確認。MEANING_UPDATE保存前／保存後OBSERVATION commitに一度だけ一時DB rollbackを起こし、現行retryで具体的な本文を保存した。保存後ケースは同じmeaning event IDを維持する。意味不変なので、u324の意味変更互換とは挙動が異なる。その後のGET/startとUI再表示はすべて保存本文と一致する。

原04では現行の問い選択がENDであり、正規発行済み質問を伴う回答更新はこの入力では発生しない。架空の質問・回答を作ってADD／REVISE／WITHDRAWのpublic成功とは扱わない。既存更新時／focus再構築時にも同じ参照判定を適用し、片核失効時のgroup不成立を確認した。Q2/Q3の既存回答更新検査は上記application集合で通過しているが、この10件の全回答更新実機確認ではない。

試験環境はu324と同じ隔離Python3.12.14／pytest8.4.1／Pydantic2.13.5／FastAPI0.115.12／httpx0.28.1／PGlite0.5.8、React/renderer18.3.1と既存Babel7系。製品requirements/packageは変更しない。既知3失敗は `test_feeling_reason_body_inverse_rejects_loss_rebinding_or_closed_reason_without_author_replay` と `test_feeling_reason_group_keeps_explicit_objects_without_a_supplementary_action[False/True]`。元10／固定100や、過去の別失敗集合4／17／16／20を全再評価したとは扱わない。

## 未加工本文10件

### 1. なんだかしんどい。何が嫌なのか、自分でもよくわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、自分でもよくわからない」があります。

Emlisから：
なんだかしんどくて、何が嫌なのか、ご自身でもよくわからないのですね。
```

### 2. なんだかしんどい。何が嫌なのか、自分でもはっきり分からない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、自分でもはっきり分からない」があります。

Emlisから：
なんだかしんどくて、何が嫌なのか、ご自身でもはっきり分からないのですね。
```

### 3. なんだかしんどい。何が嫌なのか私にもまだわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか私にもまだわからない」があります。

Emlisから：
なんだかしんどくて、何が嫌なのかあなたにもまだわからないのですね。
```

### 4. なんだかしんどい。どこが嫌なのか、自分でもよくわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「どこが嫌なのか、自分でもよくわからない」があります。

Emlisから：
なんだかしんどくて、どこが嫌なのか、ご自身でもよくわからないのですね。
```

### 5. なんだかしんどい。何が不安なのか、自分でもよくわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何が不安なのか、自分でもよくわからない」があります。

Emlisから：
なんだかしんどくて、何が不安なのか、ご自身でもよくわからないのですね。
```

### 6. なんだかしんどい。何がつらいのか、私にもまだわからない。

```text
見えたこと：
今は、「なんだかしんどい」という感覚や状態が前に出ています。
今回の中心には、「何がつらいのか、私にもまだわからない」があります。

Emlisから：
なんだかしんどくて、何がつらいのか、あなたにもまだわからないのですね。
```

### 7. 少し怖い。何が怖いのか、私にもまだ分からない。

```text
見えたこと：
今は、「少し怖い」という感覚や状態が前に出ています。
今回の中心には、「何が怖いのか、私にもまだ分からない」があります。

Emlisから：
少し怖くて、何が怖いのか、あなたにもまだ分からないのですね。
```

### 8. 私は少し怖い。何が嫌なのか、自分でもまだよく分からない。

```text
見えたこと：
今は、「私は少し怖い」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、自分でもまだよく分からない」があります。

Emlisから：
あなたは少し怖くて、何が嫌なのか、ご自身でもまだよく分からないのですね。
```

### 9. 少し怖い。何が嫌なのか、自分自身でもよくわからない。

```text
見えたこと：
今は、「少し怖い」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、自分自身でもよくわからない」があります。

Emlisから：
少し怖くて、何が嫌なのか、ご自身でもよくわからないのですね。
```

### 10. 少し怖い。何が嫌なのか、私自身にもまだ分からない。

```text
見えたこと：
今は、「少し怖い」という感覚や状態が前に出ています。
今回の中心には、「何が嫌なのか、私自身にもまだ分からない」があります。

Emlisから：
少し怖くて、何が嫌なのか、あなた自身にもまだ分からないのですね。
```

## source identityと残件

language `905f4a3aa5a4e3464ed3f73a0ce536c65eb85e3361eaa753adb76830c41fadf2`、runtime `44ebfd4a4a886e012bcf55c2aa7d72d9b7bbc1395fb61f61511098b359fd910c`。

| 製品ファイル | SHA-256 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | `a1664ee3ae1dece49f40f2bd699846cad1be55e80f7fb60888b4e48e9634ea3d` |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | `33784a974aba76906317cbd5406bb650155f10d59f2e0bb39d9504707f0da421` |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | `5f15427b9e2f6a79f2c5a0f7069d048b558413f30aa41b6a86471fd3c392694b` |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | `70b0f607f6469c49cafc844afc49ab20534976ed333d85a9ca6799aef95ac5a5` |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_thread_source.py` | `2b2c590d76fa72cac8ee559d5076254dd20fc29d12bbdb34ae65317e67400651` |

次は、単独の不明対象に対する「まだ分からないこと」への縮約と、独立した行動を併記した時に受け取りがその行動だけへ移る残件を、実際の選択責任から確認する。今回の対象を持つ受け取りの復元だけでは、深い受容・有益な問い・E04/E05は完成していない。E06の範囲外、E01の別誤認、E07〜E09も維持する。

PRODUCT_NOT_CLEAR、初回一体単位未完了、正式0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置。10/20方式判断、10/31管理線、12/18公開目標、Piece／Analysis主枠、既存53.25%は再評価しない。
