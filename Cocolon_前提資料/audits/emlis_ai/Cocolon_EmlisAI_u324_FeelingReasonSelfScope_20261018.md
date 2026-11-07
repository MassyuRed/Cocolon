# EmlisAI u324 — 現在の感情と本人の理由不明を保持する

記録：2026-10-18 JST／華恋。API baseline `a1925d5d761b397aee9f939fc42a1d9305c4a19f`、Cocolon baseline `9d0f5bed6b0dd517d20656d94114b83c6e8dec0a`。実装commit `0f78a0e25dd74a40aaedb28327658799ee1aa43b`。合成入力のみ。PR3／PR30はDraft、未merge・未配置。

## 今回直したこと

「なんだかしんどい。その理由はまだ分からない」「少し怖い。その理由は自分でもまだ分からない」で本文が出ず、「なぜそう感じるのか、私にもよく分からない」では感情と不明の対象がReceptionから落ちて汎用文になる不具合を修復した。既存の「現在の本人の感情＋その感情の理由が不明」という二節の意味を、自然な修飾語・明示SELFでも保持する。

主担当が下記7件の未加工全文を読んだ。感情・不明の対象・程度・否定・現在時点は保持された。内容は依然として原文に近い受け取りであり、入力固有の深い受容や有益な問いが完成したとは判定しない。今回7件はLIMITED／questionなし／ENDであり、理由を補完したり、新しい問いを発行したりしない。

## 開始時の確認と実施範囲

Cocolonの前提ルール、CURRENT_RULES、委任・GitHub継続ルール、必読のProductNeglect監査、全体設計図01／01A／01B／01C、全ファイル地図02／02A／02B／02C、current_structureのEmlisAI／CMEE、最新weekly20261017とu318〜u323の現在地を確認した。地図の全体索引・主要経路と今回の実装現物を照合し、全ファイル本文の逐語読了とは扱っていない。System Context prepareは関連repo配置不足で不成立のため、許可された原本直接参照で継続した。補助生成物の修理は今回の作業に含めない。

主担当だけが編集・公開操作を行い、同Work補助は前提／構造／実装差分の読取り確認のみ。正式別modelのPro／Ultra評価ではない。Mashの残件継続指示と既存設計内の修復範囲で実施した。

InputScreen → useEmlisThread → 専用API → EmlisThreadService → CMEE → 保存DTO → Modalの経路を維持。製品変更は既存6owner内。意味型・関係型・問い種類・公開API・DB schema・migration・RN製品ファイル・製品依存関係の追加変更はない。STRUCTURE_MAP_DELTA_NONE。新しい歴史fixtureの所在だけ01Aへ追記する。

## 原因と修復

1. source側の有限節確認が「なんだか／何だか」、理由不明節の「自分でも／私にも／自分には」等を認識しなかった。完全な二文・唯一の先行感情・同じmemoの原文範囲・現在SELF・否定された認知述語を確認した場合だけ、既存の二節groupへ接続した。
2. 「自分でも」の語彙判定で付いた自己評価・埋込み対比を、その完全な理由不明節に限り不確定認知へ修復した。短い状態への旧分類が二節の選択を妨げる場合は、現行で新たに証明した組だけlimited_groundingへ戻す。旧方式で既に認識していた入力の分類は変えない。
3. ObservationとReceptionで、原文の私／僕／俺等は受け手の「あなた」、自分は「ご自身」に対応させる。独立readerは可視の受け手を原文のSELFスロットへ戻して全文照合する。作者の再実行を正解扱いしない。語彙保持確認も、この全文復元が成立した二節だけを認める。
4. 現行sourceで意味が変わる入力の旧checkpointは、u323の完全なsource解釈を再導出して照合する。新しい意味へ古いIDを付け替えない。より古い既存fallbackも累積legacy指定を引き継ぐ。

他者・報告・引用・仮定・過去・疑問末尾・複数感情・別の理由対象は、このgroupへ入れない。元04の「何が嫌なのか、自分でもよくわからない」は理由不明と同義ではなく対象外で、汎用Receptionの残件を維持する。SELF内部の空白や「自分自身／私自身」等の追加表現も今回の範囲外。

## 最終検証

| 集合 | 結果 | 読み方 |
|---|---|---|
| source_scope全件＋Q3 feeling_reason関連 | 284 passed / 3 failed / 901 deselected、33.27s | baselineは226 passed / 同じ3 failed / 901 deselected、33.26s。追加58件はすべて成功 |
| 追加58件の内訳 | 本文7、対象外19、Observation/Reception意味改変20、同義語尾2、旧checkpoint4、SQL保存再表示6 | 上の284に含む。別加算しない |
| Q2/Q3 application | 54 passed / 1既存Pydantic warning、107.86s | 上とは別file集合。実migration/RPCを隔離PGliteで実行 |
| 現行shared-owner identity | 1 passed | 現行fixtureだけ実sourceから更新。歴史fixtureは変更しない |
| 実serviceの版間確認 | 6ケース成功 | 現行3プラン、旧完成1、旧中断2。下記参照 |
| 現行RN実API client／hook／Modal | 上の実DTO6件を完全一致表示、close/reopen成功 | native部品stub。実機・本番通信の確認ではない |

残った既存3失敗は `test_feeling_reason_body_inverse_rejects_loss_rebinding_or_closed_reason_without_author_replay` と `test_feeling_reason_group_keeps_explicit_objects_without_a_supplementary_action[False/True]`。旧名詞句を期待する保持assertionで、同じ修正前commit・同じ環境でも再現した。既存期待値の変更・削除・skip追加は0。初回の試験で不足したhttpxは隔離test環境へ補い、上記最終集合を両版で再実行した。依存不足の途中失敗を製品失敗へ数えない。

試験環境：Python3.12.14、pytest8.4.1、Pydantic2.13.5、FastAPI0.115.12、httpx0.28.1、PGlite0.5.8。RNは既存test-toolsのReact／renderer18.3.1、Babel core7.25.2／preset-react・commonjs7.25.9。製品requirements/packageは変更しない。pytestは既存の隔離実行方式（`PYTEST_DISABLE_PLUGIN_AUTOLOAD=1`、`-p no:cacheprovider -c /dev/null --noconftest`、`Q2_PGLITE_MODULE`指定）を使用した。

旧版の実engineをa1925d5dの別worktreeで動かして保存処理へ接続した。旧完成本文は欠落のある汎用文も含めGET／startで作者禁止の完全一致。旧初回処理のMEANING_UPDATE保存前に明示的な一時DB rollbackを発生させた場合、現行retryが新しい意味と本文を生成。旧checkpoint保存後のOBSERVATION commit rollbackでは同一meaning eventを維持し、旧意味の汎用本文を生成・保存した。どちらもその後のGET／startは作者禁止で一致する。旧checkpoint側が自動で新本文へ改善したとは扱わない。

新fixture `ai/tests/fixtures/cmee_emlis_u323_feeling_reason_checkpoint_v1.json` は修正前に取得した4件の完全checkpoint・核辺hash・公開結果。新規3件と既存認識済み対照1件を含み、旧結果はUNAVAILABLE2件／LIMITED2件。現行で全項目一致を検査した。

## 実出力全文

### 1. なんだかしんどい。その理由はまだ分からない。

```text
見えたこと：
今の入力では、「なんだかしんどい」までが確かに見えます。
その理由はまだ分からないのですね。

Emlisから：
なんだかしんどくて、その理由はまだ分からないのですね。
```

状態：LIMITED／question=null／END。

### 2. 少し怖い。その理由は自分でもまだ分からない。

```text
見えたこと：
今の入力では、「少し怖い」までが確かに見えます。
その理由はご自身でもまだ分からないのですね。

Emlisから：
少し怖くて、その理由はご自身でもまだ分からないのですね。
```

状態：LIMITED／question=null／END。

### 3. 少し怖い。なぜそう感じるのか、私にもよく分からない。

```text
見えたこと：
今の入力では、「少し怖い」までが確かに見えます。
なぜそう感じるのか、あなたにもよく分からないのですね。

Emlisから：
少し怖くて、なぜそう感じるのか、あなたにもよく分からないのですね。
```

状態：LIMITED／question=null／END。

### 4. なんとなく寂しい。どうしてそう感じるのか、自分でもはっきりわからない。

```text
見えたこと：
今の入力では、「なんとなく寂しい」までが確かに見えます。
どうしてそう感じるのか、ご自身でもはっきりわからないのですね。

Emlisから：
なんとなく寂しくて、どうしてそう感じるのか、ご自身でもはっきりわからないのですね。
```

状態：LIMITED／question=null／END。

### 5. 私はつらい。その理由が自分にはわからない。

```text
見えたこと：
今の入力では、「私はつらい」までが確かに見えます。
その理由がご自身にはわからないのですね。

Emlisから：
あなたはつらくて、その理由がご自身にはわからないのですね。
```

状態：LIMITED／question=null／END。

### 6. 僕は少し怖い。その理由は僕にもまだ分からない。

```text
見えたこと：
今の入力では、「僕は少し怖い」までが確かに見えます。
その理由はあなたにもまだ分からないのですね。

Emlisから：
あなたは少し怖くて、その理由はあなたにもまだ分からないのですね。
```

状態：LIMITED／question=null／END。

### 7. 何だか重い。その理由は俺にも分からない。

```text
見えたこと：
今の入力では、「何だか重い」までが確かに見えます。
その理由はあなたにも分からないのですね。

Emlisから：
何だか重くて、その理由はあなたにも分からないのですね。
```

状態：LIMITED／question=null／END。

## source identityと次の作業

現行language identity `89f5dac72ea36bf6085e4feabab7cbcf895621c414a78f3b0c26bd89ba300b34`、runtime identity `a6f1c5a21e6c5705fcd0f49072ff0924d86f18b1458a98869c1bf89060ac1f14`。これはshared ownerの検査値であり製品受入れ判定ではない。

| 製品ファイル | SHA-256 |
|---|---|
| `ai/services/ai_inference/emlis_ai_grounded_observation_plan.py` | `c2f6512f0ead4624a948660dc3d869c28a49e4e86d10ba806f9d5b000b036a04` |
| `ai/services/ai_inference/emlis_ai_grounded_human_reception.py` | `ad76b366d2494d2e604a96b2450ef2ee6591ab80a898be750038dcf2e75ad7f5` |
| `ai/services/ai_inference/emlis_ai_grounded_sentence_surface.py` | `13895b91a0739d13dd452af778108c517fda53c0f37765cfb9098d2900806c47` |
| `ai/services/ai_inference/emlis_ai_grounded_observation_gate.py` | `4d7e689018279711e80fc2d9bac2a59340b6726b8f791c854dcd34a1c861afb3` |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_question.py` | `8bf8af71e18dfb2eddacb657a4b957d80b3dca36a3c9171d29fa197ca232ad11` |
| `ai/services/ai_inference/cocolon_meaning_experience_engine/emlis_answer_update.py` | `89036d6547ce8c4a8ab22399d4d22954128c6ebbea4237f69fb53dde8652ce46` |

次はE04の残る入力固有の受け取りを、元04の「不明の対象」と「理由不明」を混同せず、自然変種・更新・保存本文まで確認して改善する。E05の問い、E06の範囲外の訂正撤回、E01の別誤認、E07〜E09は未解消。今回の7件だけでE04や初回一体単位を完了にしない。元10／固定100の全再実行、過去の別失敗集合4／17／16／20の横断再評価は実施していない。

PRODUCT_NOT_CLEAR、初回一体単位未完了、正式0/3、candidate_ready=false、automatic_progression=false、Draft/open/unmerged・未配置を維持。10/20方式判断、10/31管理線、12/18公開目標、Piece／Analysis主枠、既存53.25%は再評価していない。
