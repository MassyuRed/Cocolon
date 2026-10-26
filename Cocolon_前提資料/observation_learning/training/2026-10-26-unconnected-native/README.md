# 10/26 — 未接続の既存6教材とCMEE受理範囲／一括接続案

状態：**CPU原入力範囲照合完了。4題材の接続契約拡張はPROPOSED・未実装・未承認。** 追加学習・モデル生成0。旧45779とGPU稼働を保持する。

## 今回確定したこと

開始Cocolon PR30 `8eeb8e4c5577cc00fab53b3de413a894172ac5e1`、API PR3 `4002b4577838d1ed6671278a19585b61e7ccd10e`。添付引継ぎ、全機能00全文、作業rule・恒久incident・Karen-Diary、全体01／01A/B/Cの構造導線、三core入口／CMEE map、学習目的、最新weekly§49〜53、旧Free9と実APIを確認した。System Contextの索引timeoutを継承し、fresh原本を直接読み、新indexは起動していない。全repoの全blobを意味監査したとは扱わない。

旧Free9は6つの原入力からなる9行。Jupyter直接のCPUで原入力を既存P1へ投影し、全9行の元fieldを保持したまま、実`_model_source_roles`を一回ずつ確認した。原入力scope内3行（UDON1／CHAIR2）、範囲外6行（BOOK2／SHOP2／REPOT1／KNIT1）。範囲外6行は全て`UNSUPPORTED / model_repair_reuse_source_out_of_scope`。

**これは原入力のscope照合だけ。** AFTERの3行も原入力のみを調べた。同じ原入力を重複計上して6題が9題になったとは扱わず、回答・実pending・prior・意味候補・本文の検証を実施したとは言わない。scope内3行も意味／本文成功3件ではない。旧chair訂正の動作確認は前回までの別evidenceである。

実CPUは2.1953284275秒、exit0。一回のscript実行。最初のlauncherは存在しない`python/bin/python3`を指定し、child起動前に失敗した。実配置を確認して既存system Python3.12＋private依存directoryを使用。追加依存・API変更0。実行前に初回control（pendingなし、issued0、asked target0、stop false、limit1）を確認した。実行runner SHA256 `2ba5e43504e4d76f2f3e45200f36d9683b59442ffeee0990e9d13f9c1e559100`。

固定Free9原本44,875bytes／SHA256 `b3115af6a79bb39467517d49f92c94ee7a1019c168f3cf74e078c9960e18bd82`。結果原本20,670bytes／SHA256 `25a068199652a80da7d286ff7bc7e2a9b0bef897ad5cdeea1f0089001e0ceaee`。実API／native9原本／旧adapter3fileの前後hashを照合し不変。結果のDownload待機はtimeoutになったが、到着した実fileを一回だけ回収し、runner／入力hashと全9結果を照合した。再download・CPU再実行0。

| 元教材 | 行数 | 現nativeへ接続する際の不足 |
|---|---:|---|
| 本返却 BOOK | 初回＋説明回答後2 | 気がかりの対象の未記載→一回答による具体化。原行動と気がかりを残す説明追加 |
| 友人の開店 SHOP | 初回＋説明回答後2 | 喜びと本人の感覚、共有した過去との距離、共同準備・約束の明示否定、説明追加 |
| 植え替え REPOT | 初回1 | 叔父が説明し本人が最後まで聞く主体・受領行動、やり方の理解と安心 |
| 編み物 KNIT | 初回1 | 行動、面倒さ、少しの寂しさ、その二つの関係を本人が分からないと述べた不明 |

現nativeの意味採用は修理／再使用と食事／落ち着きに限定される。自然本文の独立readerも同じ2系統の有限文法であり、引用形式を揃えたり追加学習したりするだけでは上表6行を受理できない。原文への引用一致だけで一般日本語の正しい意味や本文を認定しない。旧`emlis_candidate_snapshot.v1/v2`の受理実績を、4Bの`emlis_model_proposal.v1`の対応範囲へ流用しない。

`proposed_surface_targets.json`は、原source bundleと旧target、華恋による別の本文候補を併記する。native packetではなく、学習済み・CMEE採用済み・Mash完成gold・正式Product Readとは扱わない。BOOK／SHOPの元完成文は華恋編集、REPOT／KNITは華恋の架空補充。実問いの由来と完成応答の由来を混同しない。

旧REPOTの「最後まで説明を聞いた後の、その安心」は別field間の時系列追加、旧KNITの「うまく結び付けられなくても」は本人の不明を能力不足へ寄せる懸念があるため、別候補では除いた。SHOPの「優しさ」は華恋の評価としての旧文に残し、新候補へ本人属性として継承しない。旧教師・実対話の原文は変更していない。

<a id="six-row-native-proposal"></a>
## 具体案 — 既存6行／4題材を一つの限定単位で接続する

**目的：** 4Bへ教える入力・意味候補・本人向け本文を、実CMEEの採用・問い・説明追加・保存再読へ揃える。修理／食事の同じ2題に更新数・LR・maskを重ねる工程から、既存の別題材を使える工程へ進める。

**今回の判断対象は接続実装とCPU検証。GPU学習・モデル読込・forward・生成は含まない。** 追加の外部service・依存・新Pod・チャージ・本番操作なし。GPU保持料金は継続する。CPU検証結果と教材長が確定してから、必要な学習の量・時間・費用を具体化する。過去の一回GPU承認を再使用しない。

### 採用範囲と意味・問い・更新

| 対象 | 採用する意味と本文 | 問い・回答・保存までの完成条件 |
|---|---|---|
| BOOK初回 | 返却遅延、謝罪、「大丈夫」という言葉の被受領、少し残る気がかり。原文の対置を保持。話者や友人の実感を未記載から補わない | 気がかり対象は`NOT_STATED`。本人が「分からない」と述べた不明にしない。Mash実問「何が気になりますか？」を実pendingとして発行 |
| BOOK一回答 | 週末に返すと言った本人、遅れると分かった時の無連絡、返却済、あの時一言伝えておけばという振返りと現在の気がかり | 実pending＋初回の採用済priorに回答全文を束縛。説明追加で元行動・気がかりを失効させず、説明で埋まった未記載対象だけを解消。現在を当時へ固定しない。Free一問後END |
| SHOP初回 | 開店を知ったこと、お祝い送信、喜びと「少し置いていかれた気がした」という本人の感覚。感覚を実際の置去りeventへ変えない | 理由は`NOT_STATED`。実問 `「少し置いていかれた気がした」のはなぜですか？` を元引用のまま発行 |
| SHOP一回答 | 昔二人で未来を話したこと、共同準備と約束の明示否定、友人側での現実化という本人知覚、あの頃から離れたような寂しさ。喜びは残す | 実pending＋同priorへの説明追加。誤った仮説の訂正を捏造しない。過去・本人知覚・否定・距離の方向を保持。Free一問後END |
| REPOT初回 | 説明する叔父／受け取って最後まで聞く本人。二行動、やり方が分かったことと安心、元fieldの記載上の接続 | 問いなしEND。別fieldをまたぐ時系列・新たな理由・叔父の意図を加えない。主客を逆転しない |
| KNIT初回 | 見本をほどく行動、面倒さ、少しの寂しさ、二つの関係についての本人明示不明 | `PERSON_STATED`を面倒さと寂しさの2対象へ束縛。因果・解消・能力不足へ変えず、問いなしEND。二つの受け止めと、その関係の不明を同じ保存本文へ残す |

BOOK／SHOPは、元材料を誤りとして取り替える修理訂正とは違う。現`_model_updates`の3訂正固定、`_model_checkpoint`の全target失効・全回答ORIGINAL_OCCASION固定を新題材へ流用しない。説明の追加、解消した未記載対象、変わらないclaim、過去の経験と現在の回答時点を区別する。従来のchair訂正3更新と全旧snapshotは同じ結果を維持する。

### 実装ownerと型・版の差分

新しい常設subsystemや第二作者は作らず、既存のprivateモデル入力→receipt→意味採用→実問い／更新→同snapshot本文→保存再読を使う。変更する製品ownerはAPI `ai/services/ai_inference/` 配下の以下に限定する。

| owner | 変更責任 |
|---|---|
| `cocolon_meaning_experience_engine/emlis_semantic_admission.py` | 4題材に必要なsource役割・原格・主体・時点・肯否・modality・記載関係・不明を採用。説明追加を訂正から分離し、失効refと追加refを分ける。再開時に完全source/priorから再導出 |
| `cocolon_meaning_experience_engine/model_candidate_source.py` | 新題材の段階に合うOUTPUT_SPEC。BOOKへchair4roleを要求しない。旧chair／dailyのmodel messagesはbytes不変 |
| `cocolon_meaning_experience_engine/emlis_question.py` | BOOKの気がかり対象、SHOPの本人感覚の理由の焦点と実pending。元引用・本人回答との再束縛、Free0..1、REPOT／KNITのEND |
| `emlis_ai_grounded_observation_gate.py` | 別のsource読解から、本文の主体・肯否・時点・本人知覚・不明・関係・各節coverageを照合。参照一致だけで自由文を通さない。新たな物語や因果の補完を拒否 |

既存CandidateReceipt、ModelPreparedMeaning、EmlisQuestionDecisionV1、回答・artifact dataclass、quote compilerを再利用する。外側のmodel wire／公開DTO／API／DB／RNの形は変更しない。新4題材のprivate source-derived admission/adapter版を`3`に分離し、旧chair`1`／daily`2`の再導出と旧完成本文を維持する。新しい不明種別・問い焦点・説明追加の意味値と、独立本文readerの受理範囲は、この案で承認を求める**契約差分**である。必要な値は上表の意味に限定し、一般日本語・任意多段・Plus/Premium履歴・他coreへ自動拡張しない。

検証は既存model proposal／daily calm／quote evidence／Q2-Q3 serviceの同family testを拡張する。検証fixtureはAPIの`ai/tests/fixtures/`で所有し、新6行のnative教材候補はCocolonの当directoryへ追加する。API testがCocolonの作業directoryへ直接依存する構造にしない。既存の凍結教師・失敗raw・評価入力は書き換えない。独立した未知評価やE05/E01/E03/A03、撤回読書会を新教師へ混入しない。

### 同じ実装単位内で行う検証・終了条件

1. 原source全文と元field・カテゴリ・感情強さを保持し、新6行をquote→receipt→意味採用→実本文へ通す。完成応答候補は全件本文として読み、余分な原因・相手意図・人物評価・時系列・能力評価・説明コピーを除く。単なる形式成功で終了しない。
2. BOOK／SHOPは、初回が本当に発行した問いと同priorを用いて一回答へ進み、元意味を落とさず説明を追加しENDへ到達させる。架空pending・完成本文を本人sourceとする迂回・修理訂正への偽装は禁止。
3. 同じprivate serviceと隔離SQL/RPC fixtureで、6状態の保存／GET、意味保存後の本文中断→同snapshot再開、完成後の再生成禁止再読を確認する。実Supabaseや本人rowを使わず、既存30秒通常／明示offline180秒とCAS・期限拒否を維持する。
4. 原文引用が正しくても、主客反転・現在/過去混同・共同準備/約束の否定脱落・感覚の事実化・距離逆転・不明対象脱落・因果追加・回答target違いを拒否する。新しい語彙・文章を無条件許可する検査緩和はしない。
5. 既存chair初回／3訂正更新・daily・quote不正拒否・旧完成非生成再読を比較し、意味/snapshot/本文/問い/model messagesの旧結果を保持する。対象testのみを適切に実行し、全suite成功や本人端末成功へ換算しない。
6. 既存native9は不変で、新6行を別候補として作る。実tokenizer・EOS・切捨てなし・context8192内をCPU確認する。prompt/targetが枠へ収まらなければ、情報を削って収めず停止し差分を示す。
7. 6行の意味／本文／問い／保存再読と旧互換が成立した時点で、このCPU実装単位を終了し、actual本文・差分・失敗をGitHubへ反映して読み戻す。新4B学習・推論・Product Read・通常有効化は自動開始しない。

成功はこの4題材の限定接続と、利用者へ返す本文候補の成立まで。6行を6つの独立未知familyとは呼ばず、元言語6family（旧2＋新4）の限定技術検証として扱う。三中核の完成・一般日本語・未知一般化・正式商品受入れは別。本文が残り続けて低品質なら、machine成功でも商品credit0のまま理由と未完を残す。

期間は実装＋上記CPU検証の一作業単位。追加のmodel処理費0、GPU保持等は継続。想定外の新型・owner・依存・公開/本人DB変更、元情報の削減、検査緩和、旧互換不一致が必要になった時点で範囲を広げず停止する。失敗結果を上書きせず、同じ閉鎖試行を再起動しない。

### 判断理由と承認地点

原材料は既にあり、今回の基本的な意味／自然な受け取りのための新しい観測会は不要。1題材ずつ名詞固定文法を追加し続ける案は、同じ反復が続くため採らない。4題材に共通する主体・時点・否定・本人知覚・説明追加・対象付き不明を、既存責任分離の中でまとめて接続する。一方、全generic出力を引用一致だけで受理する汎用化も、意味忠実性を保証しないため採らない。

この案はRule18 §11.3 LEVEL_3「商品目的、商品体験、method family、contract、acceptanceまたは品質条件を追加、変更、置換または弱化する」に該当するprivate採用契約の追加である。既承認の4B＋CMEE方針を再確認するのではなく、**上記6行／4題材の意味・問い・説明追加・本文・保存再読に限る実装**への判断を求める。承認前の製品変更・native採用0。形式統一済みnative9の学習を先に再試行しない。

## 実行と記録の境界

root華恋／Codex Work／GPT-6が単一実行・writer。別文脈2agentはread-only原本／code review補助で、正式Pro／Ultra／human受入れではない。今回のprimaryは`BLOCKER_NARROWED`、商品0／正式0/3／全体54.50％据置。`STRUCTURE_MAP_DELTA_NONE`（現製品責務・型・接続・採用条件不変、提案のみ）。

実行したのは上記原入力scopeのCPU照合と別本文候補・具体案・関連現在地の記録だけ。4B重み読込／forward／学習／生成／SQL／新依存／Render／Supabase／本人DB／通常application／公開API・DTO・RN／merge／deploy0。管理console／GPU一覧／管理API／Stop／再起動／削除／新Pod／チャージ0。終了時Jupyterのread-only nvidia-smiでRTX A4500／20,470MiB／使用1MiBを確認。GPU稼働は維持し、継続保持料金をモデル処理0と混同しない。
