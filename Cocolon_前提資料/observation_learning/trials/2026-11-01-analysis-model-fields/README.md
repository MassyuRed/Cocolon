# Analysis — 最小field接続と実4B probe

**最新：11/2、実4Bの新field-kinds受理・file再読4/4は[実結果](#field-kinds-gpu4-result-20261102)に保持。その次の根拠付き意味単位は[CPU設計案](#semantic-units-cpu-design-20261102)まで具体化。新受口・意味採用は未実装、GPU追加0。旧v1受理0/4も履歴保持。**

2026-11-01 JST。開始原本：Cocolon PR30 `1c66add4fdf8f5ded18f7443d6b91b1771998244`、API PR3 `36713940ea82e217fab8a7c0a738a33f21df1c4d`。Mashの分析残件開始とweekly§45.4に従う。Codex Work/GPT-6、root華恋が実装/統合/反映、別文脈agentはread-only監査のみ。独立Pro/Ultra又はhuman品質受入れとは呼ばない。System Context最新cacheは未成立のまま、fresh原本fallbackを使用。

## 11/1時点で成立したこと（CPU準備の履歴）

新private `analysis_model_fields.v1` で完全な本人原入力fieldを要求し、受信JSON→既存ObservedGraph→唯一realizer→通常累積projection/private根拠→隔離SQL commit/readへ通す最小接続。実4B・新学習・稼働APIへの有効化はまだ0。

モデルが返すのは各fieldの五種node又はUNRESOLVEDという分類候補。全文quoteを原sourceから再束縛し、部分引用、原文変更、owner/版/guard違い、欠落/重複/余分、bool座標、自由label/原因等を拒否。finish_reasonはstopだけを許可。新typed quoted fieldは主体・否定・時点・留保を全文に保持し、独立して解決済みの命題へしない。省略主体を本人へ補わず、分類自体の正しさを検査済みとはしない。

新armの本人限定表示は末尾「（原文・分類候補）」を付ける。旧finite safe_projectionの原文非コピー保証を保ち、新profileだけの明示原文引用表示とする。全対象はunparsedに残し、mappedは可視候補nodeを持つrecord数に過ぎない。関係/因果/同義統合/反復推定は加えない。全UNRESOLVEDのrecordはcoverageへ残し、他recordへ結ぶ空gapを作らない。

比較・適格補足/訂正ありは明示UNSUPPORTED。古い原入力版に属するANSWERは既存source adapterに従って利用せず、stale件数を保持。完全sourceの既存Safety検査を維持する。通常ensureはmodel_inputを渡さず旧経路のまま。新API/DTO shape/DB/RN/依存/本番設定変更なし。

## CPU確認と限界

最終対象10file：**785 passed / failed0 / skipped0、95.91秒**。新profile33＋旧分析/累積/補足/P5の752。既存Pydantic非推奨warning1。別の反復検査/本文採取/subtestsは加算しない。最終test環境分岐を整えた新33も3.75秒/FAIL0/SKIP0で再実行成功。785へ重複加算しない。

実compilerの従来結果ではmapなしの架空2record・3fieldに合成候補を与えると、正常な既存safe projectionを作り、2可視record/未解析2を維持。通常private evidence allowlistへ新raw本文を足さず、隔離PGliteの実累積SQLへ保存した同じ文章/図/IDを、Engine.generate禁止状態でcurrentとmonthlyから再読した。元入力削除による派生物purgeも確認。合成候補を実4B生成、一般読解成功、本人実機又は商品受入れへ換算しない。

read-only監査で見つかった空refs gap、finish未検査、stale件数固定の3点を修正。新補助systemや旧assertion緩和は追加していない。全量分割、subclause意味、一般補足/訂正、複数recordの根拠ある関係/共通点、IF/Saved、常時提供/原価は残件。

## 11/1時点の実4B一回の具体案（11/2実行済み）

GPU準備前の計画で、実行0。`probe_requests.json`の架空AF01/AF02を使い、固定baseと保存fit38を各一回、**2入力×2条件=最大4生成・追加学習0・再試行0**で比較する。これはschemaと原文保持の機構probeで、盲検品質評価や新教師ではない。入力はCPU確認で既見、モデルの新出力はまだない。

- model：`Qwen/Qwen3.5-4B`、固定revision `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a`。base条件はadapterなし。保存fit38条件はweights SHA256 `ad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a`、config SHA256 `ef4b1aef621fb4e234ce6a05601efb62a987c3cf5d40f3995ca1b72200bab145`。旧不採用candidateの再開/学習/製品採用はしない。
- 既存API `ai/tools/serve_emlis_natural_reply.py`の検証済みload_generatorを使う。BF16/SDPA、non-thinking、greedy、context8192/max2048、要求各23秒。実tokenizerで全入力を確認し、超過時は切捨てず停止。既存pinsを保持し、学習を有効化しない。
- 推奨環境：Runpod RTX A5000等24GB×1枚、Jupyter接続可能。現存停止Podの再利用が可能ならそれを使う。新たなGPU作成/再起動/チャージを華恋が先行しない。
- 上限：モデル読込/推論process合計最大1800秒。各条件でAF01→AF02を一回ずつ、両条件のraw/finish/時間を回収して終了。形式不正は補修/再生成しない。実4Bが全てUNRESOLVEDならそれも原結果として読む。
- 単価はレンタル画面で確定。GPU単価$0.60/h以下の場合、1800秒のprocess按分は最大$0.30。準備/取得/待機/回収/継続保持/保存/通信/税等を含む請求総額ではない。公式A5000紹介ページは24GB/$0.27/hからを表示するが、空き/現Pod単価/総額を保証しない（2026-11-01確認： https://www.runpod.io/gpu-models/rtx-a5000 ）。
- 接続：probeのmessagesをそのままモデルへ渡し、実rawとfinish_reasonをAnalysisModelFieldsInputへ渡す。固定snapshotからprepare_cumulative_model_fieldsを再導出し、dataclasses.replace(prepared,raw=actual_raw,finish_reason=actual_finish)→build_cumulative_map(...,model_input=...)。実raw/metadataと同じprojection/private/textを回収し、保存再読と分類の内容を主担当が確認する。モデル生成本文を本人原入力へしない。
- 回収物：4call以下の実raw/finish/時間/モデル・adapter identity、各JSON採否/理由、同じ図/文章/coverage、保存再読結果。資格情報/本人データは使用しない。終了時は所有する推論processを停止してGPU processを確認し、Pod自体のStop/削除/継続保持はMashの指示を優先する。

最小CPU準備は終了し、次はGPUを用意して実出力確認へ進む。大きな意味解析機構を先に作り切る追加段階は置かない。実4Bを呼ぶまでは接続品質/一般理解の成立を報告しない。

API反映commit：`59489814a924eec29f4ee61386e6daa3bec1a49a`（既存PR3、製品5＋test1）。

GitHub反映後、API6file/前提資料13fileの全内容・blobと、両commitの親/変更path/両Draft headを読み戻し照合。既存Analysis CI [41301298465](https://github.com/MassyuRed/mashos-api/actions/runs/41301298465)は全工程success（job124832571851）。追加のlocal shared owner identity検査はexportにai/toolsがないためcollection不可であり、local785の失敗へ混ぜず、full checkoutのCIでは同じ共有owner identity検査もsuccess。通常分析・合成本文・累積API/Q3・月次rank/immutable再読/source削除SQLを含む全工程成功を確認した。


<a id="gpu4-result-20261102"></a>
## 11/2 — 実4Bの4生成と実受口の結果

2026-11-02 JST、Mashが用意したRunpod/Jupyterから、固定AF01/AF02×base/保存fit38を各一回、全4生成で終了。API `59489814a924eec29f4ee61386e6daa3bec1a49a`、要求原本Cocolon `efeab671a2ec06c6810c025dc0ab3438099d6b56`。追加学習/再試行/raw補修0。全4件stop、13.314〜21.026秒、モデル読込＋推論77.111162秒。RTX PRO4000 Blackwell（nvidia-smi表示24467MiB）、$0.58/h表示、処理按分約$0.012423（準備/取得/待機/回収/継続保持/保存/税等を含む請求総額ではない）。

固定snapshotからprepareを再導出してmessages完全一致を確認し、実raw/finishを既存buildへ渡すと**受理0/4**。AF01は両条件ともrequest_ref内の`58`一回脱落で`analysis_model_packet_binding_invalid`。AF02は両条件とも全文end不一致で`analysis_model_field_invalid`。独立照合では全6fieldのendが不正だった。artifact/図/文章/SQL保存0で、同図・文章の保存再読は未到達。拒否receipt/rawの保存・生成禁止再読だけを確認し、CPU合成候補のSQL成功を実rawの成功へ換算しない。

| 条件/入力 | rawのend | 原sourceの正しいend | 実受口の結果 |
|---|---|---|---|
| base AF01 | 36 / 30 | 34 / 23 | request_ref不一致で拒否 |
| fit38 AF01 | 30 / 25 | 34 / 23 | request_ref不一致で拒否 |
| base AF02 | 30 | 26 | field不正で拒否 |
| fit38 AF02 | 24 | 26 | field不正で拒否 |

全quote/field_ref/source_set_refは一致し、原文の否定/昨日・今日/留保/絵文字を文字上保持。AF01 memoの分類はbase=ATTENTION_OR_THOUGHT、fit38=IMMEDIATE_RESULT_OR_AFTERMATHで異なる。分類妥当性・複合内容の扱い・一般意味理解を合格としない。既見の架空機構probeで、盲検評価/教師/本人商品受入れではない。

実行前runnerのtoken数記録に誤りがあり、len(BatchEncoding)を測って両入力2と記録した。事前監査も見落としたため、その数値確認のclaimを撤回。元runner/reportは改変せず保存。既存loaderは全生成直前にinput_ids.shape[-1]+2048<=8192とtruncation=Falseを正しく実施。追加生成0のtokenizer-only確認でAF01=539、AF02=453と補足訂正した。

全raw/finish/時間、runner/要求、固定モデルcache11fileのhash、重みidentity、実consumerの拒否理由・code、token訂正、終了状態はprivate原本 `cocolon-analysis-fields-gpu4-result-20261102.zip` に保全。Library ID `libfile_8f77ee004bb081918fffa4f1ce6ba320`、20,502bytes、SHA256 `de5439f85064c4877abc8e6d64c2cbcd410f3a2d1bf0d1dcf660b0eb0743e943`。body-full rawや資格情報をpublic GitHubへ置かない。ローカルconsumerで使ったAPI ai/2450blobは固定GitHub treeと欠落0/不一致0。回収rawの各SHAと要求/runner bytesも一致。

推論process終了/run.exit=0、nvidia-smi compute-apps空を確認。PodのStop/削除/再起動0、PodはMashの管理下で稼働維持（停止まで課金継続）。以後は接続済みJupyterを直接使う。通常API有効化/本番DB/Render/RN build/製品source/受口契約変更0。Codex Work/GPT-6のroot華恋が実行・統合、別文脈agentはread-only監査のみでPro/Ultra/human品質受入れとは呼ばない。

primary=BLOCKER_NARROWED、商品credit0。現在の阻害点は、source側で決定できる文字位置・長い参照をモデルへ再転記させる入出力。次の一作業は、この再転記責務を外す最小の入出力案をCPUで具体化すること。旧v1 rawを補修して受理せず、意味分類/混在fieldの未解決も維持。現4生成probeは閉鎖し、追加生成/学習/通常有効化へ自動進行しない。STRUCTURE_MAP_DELTA_NONE（既存受口の実行・観測結果のみ）。


<a id="field-kinds-cpu-20261102"></a>
## 11/2 — 番号と分類だけを受けるCPU接続（実装時点の履歴、後続で新GPU確認済み）

前回の実4Bは全4rawが位置/参照の転記で拒否された。Mashの本ターン「分析構造の残件作業を続けて」を、直前に説明したCPU側の入出力見直しへの継続指示として扱い、具体設計→限定実装→検証を行った。旧4callの承認/失敗rawは閉鎖のまま再利用しない。新private受理契約の追加であり、旧v1 rawを補修して通したという変更ではない。

### モデルと実行側の責務

新profile `analysis_model_field_kinds.v1`、入力schema `cocolon.cmee.analysis_model_field_kinds.v1`。モデルに渡す材料は全非空fieldの整数番号、元field_path、元textだけ。source_set_ref/field_ref/request_ref/文字座標/全文再コピーをモデル出力の責務から外した。原文、根拠、位置、owner/版/集合は既存sourceから再導出する。

モデルrawのclosed shapeは次だけ。各fieldの内容全体を既存五種node_kind又はUNRESOLVEDの候補へ分類する。混在、主体、範囲を判断できない場合はUNRESOLVEDと指示する。

```json
{"fields":[{"field":1,"node_kind":"UNRESOLVED"},{"field":2,"node_kind":"ACTION_OR_NONACTION"}]}
```

これは合成の形式例で、実モデル出力/正解教師ではない。番号は入力順1..Nのstrict int、全件数/順序/番号を完全一致させる。bool/float/string番号、欠落/重複/並替え/余分なkey/未知kind/重複JSON key/nonfinite/コードフェンスを拒否。旧v1へ自動fallbackせず、部分受理、sort、補完、位置修正、旧packetへの再組立てをしない。

ordinalだけのrawは別requestに対する由来を自己証明できない。そのため、信頼する一つのoffline実行側が、**call前**に新profileを含むfull request_refと、実際のsystem/user2messages（role/content/順序を含む）のcanonical UTF-8 SHA256を固定し、返った元rawのUTF-8 SHA256/finish/rawを同じresponse記録へ保持する。受口は再導出したsource/guard/request_ref/messagesとresponse binding、raw hash、stopを照合した後にJSONを読む。metadataをconsume時に別rawへ後付けして実callと呼ばず、raw単独の取込みは認めない。これはtrusted callerの対応付けであり、悪意あるPython callerによるmetadata丸ごと偽造を防ぐ署名/自己認証ではない。

### 実型・接続・互換

- 新private型2：`AnalysisModelFieldKindsInput(request, source_guard, request_ref, response=None)`、`AnalysisModelFieldKindsResponse(request_ref, messages_sha256, raw_sha256, finish_reason, raw)`。ともにfrozen/slots/repr=False。
- 既存semantic_admission.pyのprepare/new readerが、既存_model_fields_sourceの全source/Safety/空field/owner/版を再利用。新profileをrequest_refに含め、旧v1のref/messages/厳密拒否は維持する。
- v1/new readerは各々のstrict受信後だけ、同じ `_realize_model_field_kinds` で既存ObservedQuotedField→ObservedGraph→唯一realizerへ接続する。新semantic graph型、作者、storage ownerは作らない。
- Engineは新exact input型だけを明示dispatch。累積serviceの新prepareと既存buildの明示model_inputだけが使う。通常ensure/HTTP/旧finite/P5を自動切替しない。
- 全対象unparsed、関係0、polarity/modality/temporal_scopeはAS_WRITTEN_UNRESOLVED、可視labelは原文・分類候補。全UNRESOLVEDはmapなしでcoverageへ残す。補足/訂正/比較はこのprofileではUNSUPPORTED、通常の旧補足経路は保持。
- 原文の否定/時点/留保/絵文字が表示へ残るのはsource再投影の保証で、モデルが意味を理解した実証ではない。分類の妥当性、複合fieldの扱い、複数記録の根拠ある関係、一般補足訂正、IF/Saved、通常提供は残件。

### CPU検証と反映

API commit `f7a1389679f15dbb9f24c40c0c5ac0058423c106`。製品exact3：`ai/services/ai_inference/analysis_cumulative_service.py`、同`cocolon_meaning_experience_engine/engine.py`、同`cores/analysis/semantic_admission.py`。新test1：`ai/tests/test_analysis_model_field_kinds.py`。全4fileのremote全文/blob・親/変更path・branch headを照合した。intent_compiler/realizer/DB/RN/公開API/依存定義/稼働設定の変更0、追加CIはskip指定。

最終の重複しない対象は**819 PASS/FAIL0/SKIP0＝新34＋旧785**。既存の共有owner identityは別1 PASS/194 deselected、合計820 distinct。最初の新34は最終新34へ置換し、重複keyだけの4再確認やsubtestsを加算しない。初期6file665 PASS、最終new34＋別legacy148の5file182 PASS、job6 PASS。追加legacyの最初は親cwdでai import不可、owner検査の最初はCI指定PYTHONPATH欠落でtools import不可となり各collection/実行0。既存API root/CIのpath設定へ直し、製品/旧testの変更なしで必要対象を完了。既存Pydantic root_validator非推奨warning1種類を保持する。

同件数別requestのresponse全体/元rawだけの差替え、messages hash/request_ref、owner/版/guard、型/番号/JSON/finish、Safety/補足/比較、旧v1/default/P5を確認。正常な3field packetへ同値の重複keyだけを追加する対照も、JSON readerで拒否する。合成callから実graph/text/private evidenceを作り、隔離PGliteの実累積SQL commit→生成禁止のcurrent/monthly同一文章/図/ID再読、原source削除purgeを確認した。本人DB/実Auth/実4Bではない。

新artifactが成立した合成例は2可視record/2node/edge0/unparsed2。未加工のCPU例は[CPU example](field_kinds_cpu_example.json)、対象/環境失敗/件数は[CPU result](field_kinds_cpu_results.json)。これらは公開済み架空sourceに対するCPU機構検査であり、モデル出力/教師/品質受入れへ転用しない。

root華恋/Codex Work GPT-6が実装・読解・反映、別文脈agentはread-only監査のみ。Pro/Ultra/human品質受入れとは呼ばない。System Context最新cacheは未成立のままでfresh原本fallbackを使用。STRUCTURE_MAP_DELTA_PRESENT（新明示private model wire/typed inputと既存graph接続）、限定TECHNICAL_CREDIT、商品credit0/正式0/3/管理54.50％据置。

### 新実4B一回の具体案（CPU準備時点、後続の承認で実行済み）

[固定要求2件](field_kinds_probe_requests.json)と[one-shot runner](field_kinds_probe.py)を保存した。AF01/AF02のowner/snapshot/原文は前回と同じ既見の架空例、指示/受口だけを新形式へ変える。base/保存fit38各2件、**新4生成・学習0・再試行0、process最大600秒**。これは旧runの再開ではない。単価$0.60/h以下ならprocess按分最大$0.10、準備/回収/保持/税等別。前回確認単価$0.58/hなら最大約$0.0967だが現在のPod状態/単価は今回未再照会。Podの再起動/停止/新規レンタル/課金操作はしない。

固定Qwen3.5-4B/revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a、保存fit38 SHA ad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a/config ef4b1aef621fb4e234ce6a05601efb62a987c3cf5d40f3995ca1b72200bab145、既存load_generator/pins/BF16/SDPA/non-thinking/greedy/context8192/max2048/各23秒を保持。tokenは実input_ids.shape[-1]で測定し切捨てない。600秒SIGALRMはimport/tokenizer/model読込/推論を含むhard bound、各23秒は既存StoppingCriteria期限。新out必須で上書き/二重実行しない。

runnerはcall前のrequest/messages記録→元raw/finish/response保管→新受口→同artifact/projection/text/private/coverageを回収する。成立時の再読は同一process内file＋既存validatorで、cold再開や実SQL保存と呼ばない。固定synthetic guardをSQL guardへ書換えない。全件拒否/全UNRESOLVEDもそのまま記録し、再生成しない。終了後はrootが外側で所有process/GPU不在と原本回収を確認。Pod停止/削除はMash指示に従う。GPUは本ターン実行0で、次の新実行指示から行う。


<a id="field-kinds-gpu4-result-20261102"></a>
## 11/2 — 新field-kinds形式の実4Bは受理・ファイル再読4/4

MashはCocolon `c0859cfbfbb59f24a608c713cde28dbd525c8945` の[具体案](#field-kinds-cpu-20261102)（追加学習なし・新4生成・process最大600秒・単価$0.60/h以下なら按分$0.10以内、準備/保持等別）へ「進めていいよ」と明示承認。API `f7a1389679f15dbb9f24c40c0c5ac0058423c106` と固定runner/要求を変えず、一回だけ実行した。旧v1 runの再開・raw補修ではない。この承認の4callは消費済み、probeは閉鎖。追加生成/学習/通常有効化へ自動進行しない。

接続済みの同一Pod/Jupyterへ直接接続。実行前のCPU preflightでrunner/要求SHA、f7a13896の製品3blob、両入力の実messages/request_ref、model pins、fit38 identityを確認した。probe用venvに既存API依存が不足したため、CPU検証時と同じfastapi0.162.0/httpx0.28.1/jsonschema4.26.0/pydantic2.14.1を導入してから実行。製品依存定義の変更は0、model pinsは不変。固定base revision851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0aと保存fit38（weights ad8b89e8974df9bfe7e804b8f67bbaac59e6cbb37042c3254fb58ffb64230d0a/config ef4b1aef621fb4e234ce6a05601efb62a987c3cf5d40f3995ca1b72200bab145）を既存loader/BF16/SDPA/non-thinking/greedy/context8192/max2048で使用した。

2026-11-02 07:41:41〜07:42:03 JST（UTC11/1 22:41:41〜22:42:03）、RTX PRO4000 Blackwell/24467MiB、torch2.8.0+cu128/CUDA12.8。import/tokenizer/model読込/推論/consumer/fileを含む**process21.510225秒**、exit0、実4生成・追加学習0・再試行0・raw補修0。全件finish=stop。実input_ids.shape[-1]はAF01=251、AF02=221、切捨て0。前回の旧runnerのtoken数誤記とは別の正常計測であり、旧記録は書換えない。

| 条件/入力 | 生成秒 | 新受口 | artifact/同ファイル図・文章再読 | node/edge/未解析record |
|---|---:|---|---|---|
| base AF01 | 2.532383 | RETURNED | 作成 / MATCHED | 2 / 0 / 1 |
| base AF02 | 1.224108 | RETURNED | 作成 / MATCHED | 1 / 0 / 1 |
| fit38 AF01 | 2.021466 | RETURNED | 作成 / MATCHED | 2 / 0 / 1 |
| fit38 AF02 | 1.425042 | RETURNED | 作成 / MATCHED | 1 / 0 / 1 |

call前messages/request_ref/guardとcall後raw SHA/finishの外部対応を独立再計算し、元raw/response/reportのhash一致を確認。各callは別artifact IDを持ち、それぞれ同ID/図/本文/private根拠/coverageのfile再読に成功した。GPU runner内の同一process再読に加え、回収後は別local processでMeaningExperienceEngine.generateを禁止し、保存済みactual artifactの同じID/図/本文/coverageとcall bindingを再確認（4 MATCHED/新model call0/Engine.generate0）。これは保存artifactの再読であり、cold meaning checkpoint再開や実SQL保存ではない。**今回の実4B由来SQL commitは0**。前項CPU合成候補の隔離SQL成功を混ぜない。

base/fit38は同一入力にbyte一致のrawを返した。AF01はmemo=ATTENTION_OR_THOUGHT、action=ACTION_OR_NONACTION、AF02はmemo=IMMEDIATE_RESULT_OR_AFTERMATH。分類候補としては粗く妥当だが、AF01の否定された後悔と他者の考えの不明、AF02の昨日/今日・解決/感情を意味単位へ分けていない。疲労と拒否の理由を解決済み因果とも扱わない。全recordはsource/processed/mapped/unparsed各1、excluded0、polarity/modality/temporal_scope=AS_WRITTEN_UNRESOLVEDのまま。否定/留保/時点/絵文字の保持はsource再投影による保証で、モデルの意味理解成功とは数えない。既見の架空2入力×2条件の機構probeであり、教師/盲検評価/一般品質受入れではない。fit38優位性も示していない。旧形式0/4→新形式4/4は入出力設計変更の実接続結果で、学習改善・旧rawの修復・旧受口の緩和ではない。

今回Jupyterを直接使ったため料金UIは再照会せず、同じPodで前回確認した$0.58/hを参照。実処理按分は同単価で約$0.00347、上限単価$0.60/hで約$0.00359。請求総額ではなく、準備/待機/回収/継続保持/保存/通信/税等は別。所有する推論processとnvidia-smi compute-appsが空であることを終了後に確認。Pod Stop/削除/再起動/新規レンタル/チャージ0、PodはMash管理下で稼働維持。今回のGPU処理は完了し、原本も保全済みなので停止可能。

全4callのactual request/messages/raw/finish/response/artifact/report/logと終了状態、別processの生成禁止再読をprivate原本 **`cocolon-analysis-field-kinds-gpu4-result-20261102.zip`** に保全。Library ID `libfile_83a4d737bd9481919f42efd0f3d039ff`、25,782bytes、SHA256 `5b04337c50de872df6c19f67e1be68d8c4c3748aa23788292d91fe738e33afac`、27member。保存先から別pathへ読み戻し、全bytes/CRC/manifestを照合。body-full raw/artifact、資格情報、重みはpublic GitHubへ置かない。ZIP内は資格情報/重み/screenshotなし、repo-backed runner/要求は重複収録せず固定参照/hashを記録。runner SHA256 c7d66260ce76a426e7fd414e503d4a166da85dfb26ed1f987259e756d4e9a0c4、要求218be91fc4fa10ed2349fb8a52360f552494167a328cadf2333a9cf30cd60044を実回収bytesと照合済み。旧v1のprivate失敗原本も変更0。

root華恋/Codex Work GPT-6が実行・元出力読解・統合・反映し、別文脈agentはread-only監査のみ。Pro/Ultra/human品質受入れとは呼ばない。System Context最新cacheは未成立のままfresh原本fallback。primary=TECHNICAL_CREDIT（実4B→新受口→既存候補graph/text→同ファイル再読）、商品credit0/正式0/3/管理54.50％据置。製品source/型/契約/DB/通常有効化/Render/RN build変更0、両PRはDraft/open/unmergedを維持。STRUCTURE_MAP_DELTA_NONE（今回は既存実装の実行観測と資料差分のみ）。

次の一作業は、既存source/graph所有者の中で**field全体の一分類から根拠付き意味単位へ分けるCPU設計**。主体/否定/時点/留保を保ち、不明を確定しない。原文に明記された理由/時間差と、推測の因果/性格/別recordの関係を区別する。受口・保存checkerの増築を次の主成果にせず、今回2例は残件の説明材料として扱い、固定教師や一般品質の合格例へ転用しない。


<a id="semantic-units-cpu-design-20261102"></a>
## 11/2 — 全文文脈を併記する意味候補のCPU設計（未実装）

Mashの「分析構造の残件作業を続けて」により、実4B接続後のwhole-field一分類という不足へ戻った。既存の部分EvidenceRef、P5の全文group/意味unit/従属scope、通常ObservedPropositionとrealizerの検査を確認。意味型の資産はあるが、現在の全文専用field-kindsや有限P5へ一般部分意味をそのまま採用する受口はない。

[具体案・private wire・表示条件・exact変更path・実装順](../../../designs/cmee/v1/04_analysis_v1d_v1e_detailed_design.md#analysis-model-units-proposal-20261102)を既存Analysis設計へ保存。新private analysis_model_units.v1で原文quoteを選び、sourceが一意な位置を導出する案。親scopeと否定/不明/時点/修飾の候補を保持し、元field全文を部分候補と必ず同時表示する。本人記載の不明は独立carrierで、通常path node/UnknownGapへ変換しない。主体未解決、全record未解析、route0、通常ObservedGraph/safe projection/HTTP/RN非接続を維持する。

[CPU説明例](semantic_units_cpu_example.json)は華恋の手設定で、実モデル出力/教師/凍結評価ではない。既存source prepareから架空AF01/AF02の3fieldを取得し、9unit（path候補3、不明候補1、従属scope5）と7qualifierの全16引用で、元fieldのscalarと元envelope UTF8範囲・quote一致を確認。全文と残範囲を残す。主体の既定値は未解決へ修正し、候補欠落を原文の主体省略へ読み替えない。根拠の機械的一致を意味成功に数えない。新reader/Engine.generate/model call/学習/SQL0、製品source/test変更0。

次の候補はAPI既存製品5＋新test1へCPU実装し、合成候補→全文併記のprivate graph/text→同file非生成再読まで一単位で検証するもの。GPU・追加学習・DB・通常有効化は含めない。これはprivate契約追加なのでRule18§11.3のLEVEL_3で別承認対象。前回GPU4callは消費・閉鎖のまま。今回primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％据置、STRUCTURE_MAP_DELTA_NONE（提案と説明用CPU例のみ）。
