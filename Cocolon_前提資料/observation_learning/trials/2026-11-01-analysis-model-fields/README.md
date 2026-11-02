# Analysis — 最小field接続と実4B probe

**最新：11/2、固定32教材の追加128更新が完走。学習済み4/4が教示JSONと一致、開発6/8で原文外引用/不明親とqualifier粗化が残り通常未採用。[全重み・原本71fileの回収/最終結果/次の再開点](#analysis-fixed32-result-20261102)。完了済みrunの再実行はしない。**

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


<a id="semantic-units-implemented-20261102"></a>
## 11/2 — 全文文脈付き意味候補をCPU実装、実4Bへ継続

Mashは本セッションで、分析残件に必要な作業、GPU利用、途中GitHub反映を承認し、細かい区切りで停止せず継続するよう明示した。§50のprivate契約実装待ちはこの新指示で解消。旧4callの消費/閉鎖は維持し、新要求へ過去の実行回数を流用しない。Codex Work/GPT-6のroot華恋が唯一の実装/write担当、別文脈agentはread-only監査。Pro/Ultra/human受入れとは呼ばない。START_ALLOWED：未完了はwhole-fieldでは否定/不明/時点/従属内容を分けられないこと、DIRECT_PRODUCT_OR_ACCEPTANCE_WORK。今回の完了は合成候補の全文併記/同file再読と実4B出力の内容確認まで。引用不一致・不完全生成・想定外の通常稼働影響は採用せず、原出力を保存して原因へ戻る。通常有効化や品質条件の緩和を成功の代わりにしない。

API commit `fa995a4462bfab0deeafbfd602a5ae803fb0fcb5`。既存製品5＋新test1、旧test/fixture/依存定義変更0。変更6fileのremote全文/blob、親、changed pathsとbranch headを照合した。通常build/ensure/model_input・safe_projection・累積DB保存へ自動接続しない明示private候補arm。

- semantic_admission：新input/response、strict全field/5key unit/2key qualifier、trusted request/messages/raw/finish対応、重なる出現も含む逐語quote一意性とscalar/元envelope UTF8再束縛。
- intent_compiler：immutable候補graph/field/unit/qualifier。WRITTEN_UNKNOWNは通常UnknownGap/path nodeにしない。親は同field内・最大2段、UNKNOWN_CONTENTの根は本人記載不明。主体とpolarity/modality/時点は未解決のまま、route edge0。
- observed_route_realizer：既存唯一作者のprivate armでfield全文を各一回、未検証の部分候補と同じ文章/図へ併記。否定を落とした「後悔」だけの候補でも原全文を省けない。未割当範囲と絵文字を保持。
- engine：新exact input型だけのoffline dispatch。analysis_cumulative_service：新prepare/buildとcaller管理fileのserialize/reload。service全coverage（古い補足の除外件数を含む）も同fileでfresh照合する。

最終対象 **860 PASS/失敗0/skip0、140.22秒**（新41＋旧819）。旧finite/P5/field/field-kinds/累積/保存/複数補足/API/job、既存PGliteの合成SQLを含む。新unit候補自体のSQL commit0。既存warning1。先行new40とpartial112/skip3は最終件数へ重複加算しない。最初の部分回帰はPGlite設定flagなしでSQL3件skip、最終は既存dependencyを設定して全件実行。runtimeは再発見したCPython3.12.14/pytest8.4.1/既存依存で、旧固定環境や実DB検証の成功とは呼ばない。

[CPU実出力](semantic_units_cpu_implemented_example.json)は公開済み架空2record/3fieldの手設定9unit＋7qualifierによる機構検査。[結果](semantic_units_cpu_results.json)。全record unparsed・mapped0・route0。file再読はEngine.generate/compile/realize入口を禁止し、保存ID/graph/text/diagram/全coverageを一致確認。validatorは期待表現を決定的に再計算して比較するため、「作者内部処理を全て0」とは主張しない。新生成した本文を保存値へ置換せず、保存本文/図を返す。意味分解の一般品質、モデル理解、教師、盲検、本人受入れへ換算しない。

次は[新要求](semantic_units_probe_requests.json)と[runner](semantic_units_probe.py)の新4call。base/保存fit38各AF01/AF02、追加学習0、raw補修/自動再試行0、process（import/読込込み）最大600秒、各要求23秒、固定model/revision/adapter/BF16/SDPA/nonthinking/greedy/context8192/max2048を保持。実input_ids.shape[-1]を記録し切捨てない。同Pod表示$0.58/hなら600秒按分上限約$0.0967、準備/待機/回収/保持/保存/税等別。新レンタル/チャージ/Pod操作は行わず、既存Jupyterへ直接接続。全raw/finish/request/response/candidateと失敗理由を回収し、rootが本文を読む。通常map/DB/RNへ未検証候補を採用しない。

STRUCTURE_MAP_DELTA_PRESENT、primary=限定TECHNICAL_CREDIT（CPU候補保持/全文表示/file再読）。商品credit0・正式0/3・管理54.50％据置。System Context最新cache未成立のfresh原本fallbackを使用。今回の継続指示は分析残件を進める権限であり、自己採点による商品受入れではない。


<a id="semantic-units-gpu4-and-clarified-20261102"></a>
## 11/2 — 実4B意味分解は1/4受理、指示を版分離して修正

CPU実装API fa995a44／要求・runner Cocolon dd30e782から新4callを完了。[body-free実結果](semantic_units_gpu4_results.json)。base AF01/AF02、保存fit38 AF01/AF02の順。実生成は17.830905/4.074274/23.022457/23.026012秒、process82.532446秒。base AF01はstopでもcode fence付きJSONで拒否、他にもREASON_MARKERをnode_kindへ入れる等のcarrier混同。base AF02は受理/全文併記graph/文章/同file再読まで成立したが、全文をSCENE1unitとして昨日/今日/否定を同unitに置いており、意味分解品質は未成立。fit38両件は分類語/同文反復でlengthとなり拒否。受口や既存assertionを緩めず、raw補修0/学習0/通常採用0/新candidate SQL0。

初回起動はadapter引数の階層誤りで6.697189秒/生成0の停止。rootの指定誤りを実配置へ修正し、新output directoryで上の新4callを実行した。初回失敗原本も保持し、成功扱いにしない。配置時の既存test1copy差はGitHub原本へ同期し、対象text source2134fileのSHA差0を確認してから実行。GPU process終了後compute-apps空、Pod自体はMashのレンタル状態を維持。process単価$0.58/h換算は実4call約$0.01330、初回生成0の停止込み約$0.01438、準備/回収/待機/継続保持/保存/税等別で請求総額ではない。

private原本 `cocolon-analysis-units-gpu4-20261102.zip`、Library `libfile_759a1028cb2c819199cf421a84a82aba`、133342bytes、SHA256 `cbbad3afbc98d6bf28e07fe91e61e4ee05de538d3154532e0cc8ed00a7fdd8d4`、24member。全CRC/member hashとGPU側request/runner・保存payloadを回収照合。原rawをpublicへ転載しない。別local processのEngine.generate禁止下でも旧base AF02同candidate ID/図/文章/coverageを再読成功。validator内の期待表現再計算は維持し、新モデルcall0。

### 原出力からの修正と、次の新2call

実sourceの受理条件は保持し、指示のA独立分類/B本人記載不明/C従属内容を明記し、列挙した全kindを出さないこと、fence禁止、不明と単純否定を分けることを説明した。別の架空3例でwireを実演するが、教師/盲検/凍結評価や今回入力の事実へ混ぜない。fit38反復の原因を学習と断定しない。

API `cddf185594b5eeffcf72a92dcc2a2c5a44ff8b4c`、既存semantic_admission/service＋同testの3file。new private `instruction_version`はbaseline.v1/clarified.v1だけ。既定baselineのmessages/ref/state.v1は不変。clarifiedだけrefへ版を加え、state.v2に版を保存。旧rawを新指示扱いにするfallbackなし。異版response/再読は拒否。最終対象113 PASS/失敗0/skip0、15.87秒（旧860と重複加算しない）。旧実base AF02の保存payloadを現コードで生成禁止再読した。全変更3blobのremote全文とheadを照合済み。

次は[clarified新要求](semantic_units_clarified_probe_requests.json)/[runner](semantic_units_clarified_probe.py)で、同じbaseのAF01/AF02を新2call、学習0/process300秒/各23秒。これは先の4callの再開/旧raw修正ではなく、新版指示と旧base指示の比較。上限process按分$0.04834（同Pod表示$0.58/h、保持等別）。rootが全raw/文章/図を読み、明白な不足をMashへ確認依頼せず修正する。baseの分解が進めばfit38の同条件比較・別題材へ続ける。通常map/DB/RNへ未検証候補を自動投入しない。必要作業/GPU/途中反映はMashの本セッション指示で承認済み。

primary=BLOCKER_NARROWED（実モデルのcarrier混同/列挙反復を確認）、商品0/正式0/3/54.50％据置。指示版/保存版差分はSTRUCTURE_MAP_DELTA_PRESENT、通常稼働/公開API/DTO/DB/RN/依存定義/Render/merge変更0。


<a id="analysis-teaching8-plan-20261102"></a>
## 11/2 — 指示修正版も0/2、分析専用8教材の隔離16更新へ

clarified base新2callはprocess48.970337秒/exit0、AF01は15.368168秒/stopだが原文にないqualifierと親を持つWRITTEN_UNKNOWN等がありquote不一致で拒否、AF02は23.010650秒/lengthで同じ「解けて」unitとNEGATIONを反復した。受理0/2、artifact/file再読0。fenceは外れ、感情/不明/理由の候補を選び始めたが、正しいscope/qualifierの実用品質には未到達。既存parser・品質条件・旧結果を緩めない。[実結果](semantic_units_clarified2_results.json)。

private全原本は `cocolon-analysis-units-clarified2-20261102.zip`、Library `libfile_566fc5131b848191849a3747bbbd7d64`、124432bytes/SHA256 `604a18f7cea55d642ed146f974a70fee5fd538c8230a4a0c3051759a170de06c`/13member。全CRC/hashを回収照合済み。単価$0.58/hの実process按分約$0.00789、保持/準備等別。通常採用0/追加学習0、先の4call/新2callはそれぞれ閉鎖。指示だけの第三試行へは進めない。

### 新しい最小の学習単位

Mashの本セッションの必要作業/GPU利用/途中反映承認に基づき、[新8教材＋実行plan](semantic_units_teaching8_plan.json)と[限定runner](semantic_units_teaching8_run.py)を作成。API/通常製品sourceはcddf1855のまま。新production file/依存なし。root単独実装/write、agentはread-onlyの意味/実行scope監査のみ。

新8件はroot作成の架空protocol教材で、Mashの観測会教師・旧評価・正式正解ではない。8assistant targetを全て現受口へ再束縛し、全文/否定/時点/主体候補/不明/親scopeがgraphへ保持されることをCPUで確認した。別文脈監査でも修正必須の意味誤りは未検出。原入力と教師/モデル出力の区分は保持する。旧9/19教材・AF01/AF02・UV03/UV12を新assistant targetやuser教材へ転用しない。旧3demoは同じclarified systemの条件文脈に含まれ、prompt全体をloss -100でmaskする。直接の教師target/更新lossとして数えるのは新8件だけであり、「旧demoが学習時入力にも存在しない」とは主張しない。

- 固定Qwen3.5-4B/revision851bf6e、BF16/SDPA、local cache/offlineを維持。
- fresh baseに保存fit38のconfig（SHA ef4b1aef…、rank8/alpha16/target56）だけを適用し、新random LoRA/B=0を作る。旧fit38 weightsを初期値として読まない。trainable112tensor/3,833,856paramsを確認。旧adapter/base/通常提供は書換0。
- 新8件を固定順で各2回＝16update、batch1/accum1/LR5e-5/weight_decay0/clip1。full contextを保ち、prompt mask、assistant全token/EOS/末尾改行のfull CE、旧来のP-1 tail loss windowを維持。tokenizerでprefix/終端/context8192を確認し、切捨て0。
- 更新前/後の各8NLLは適合測定のみ。NLL低下を意味/品質成功へ換算しない。hostのtorch未導入により新CPU gradient比較は未実行で、runnerがモデル読込前にCPU tensorでfull/tail CEと全grad一致を検証する。失敗ならmodel load/update0で停止する。
- 学習に全文を使わない評価4入力はAF01/AF02/UV03/UV12。AF2入力の旧clarified実rawはimmutable SHA/request_ref/messages hash照合の上でbeforeへ再利用し、再生成しない。UV2入力だけ新before2call、保存adapterの全112tensor一致/有限性と非学習reload後に新after4call。計新6call以内、各23秒/context8192/max2048/nonthinking/greedy。近い構文と語句は共有するため、独立盲検/一般意味理解の実証とは呼ばない。
- process最大900秒、外側timeoutのTERM890秒＋kill grace10秒で上限を担保する。Python内alarmだけをhard boundとは呼ばない。同単価$0.58/hでprocess按分上限$0.145、準備/回収/待機/保持/保存/税等別。新レンタル/チャージ0、同Jupyterで実行する。
- 新output directory一回、旧失敗raw補修/自動rerunなし。全raw/finish/前後loss/update counter/保存重み/同file再読を回収。重みは新しいprivate原本へ保存し、rootが全4入力の前後本文を読んで候補採否を判断する。通常採用や本人商品受入れは自動生成しない。

この段階のGPU学習/更新は未実行。primary=BLOCKER_NARROWED（指示だけでは安定しない内容を確認し、別の直接改善を具体化）、商品0/正式0/3/54.50％据置。STRUCTURE_MAP_DELTA_NONE（今回新しい商品source/contract接続なし、隔離学習計画/runnerのみ）。


<a id="analysis-teaching8-result-and-teaching16-plan-20261102"></a>
## 11/2 — 新8教材16更新は完走、AF02の部分改善と残る意味誤り

§53の計画を同Jupyterの隔離directoryで一回実行。fresh base＋新LoRA、全8教師×2回16update/16 training forward、前後測定16forward、新生成6call、process106.824711秒/exit0。prompt全mask、assistant全target/EOS/改行保持を実tokenで確認し、model load前のCPU full/tail CEと全grad一致も成功。全112tensor/3,833,856paramsが更新され、保存した有限112tensorは実modelと一致、既存loaderの非学習再読も一致。peak allocated9.172043GiB/reserved9.824219GiB。平均unweighted NLL0.172905880→0.097103359、8件全て低下したが自由生成の品質判定には代用しない。

学習前4入力は受理0/4（AF2は旧clarified rawをref/messages/SHA一致で再利用、UV2だけ新生成）。学習後は全4stop、構造受理/同file再読2/4。rootが全rawを読み、次のように区別した。

| 入力 | 実出力の意味読解 | 判断 |
|---|---|---|
| AF01 | 後悔/内容/不明/理由を分け始めたが、未知内容の親が不明rootでなく別の従属unit。肯定の『断った』にNEGATION、後悔の否定qualifier欠落 | 構造拒否・未採用 |
| AF02 | 『うれしい』結果→『今日は解けて』te文脈→『昨日は分からなかった問題』連体内容の3unit。昨日/今日/不明表現も対応scopeへ保持 | 全文一分類/反復から意味ある部分改善。ただし近いprompt例あり、一般品質の受入れではない |
| UV03 | 同僚の発話を独立思考へ出し、本人の主体と混同。引用符/助詞を不明内容へ分割して10unit | 構造拒否・未採用 |
| UV12 | 『休みたい』を結果、『まだ決めていない』を理由scopeへ誤接続 | 構造受理されても意味は不適格 |

[機械結果とroot読解](semantic_units_teaching8_results.json)。保存AF02/UV12は現APIでEngine.generate禁止の別local再読も一致。新実SQL/通常map/RNへの採用0。4入力はいずれも学習user/targetに完全同一文を使わないが、教師/既存system3demoと近い構文・語句を共有するため、独立盲検や一般言語理解の証明と呼ばない。

新adapter SHA256 `298403b3705f444ff6c69829af2827520ce8b50cdf1f98359fa2645189b5f2c5`、config `2abb4ea7064b01f4ee6d1d2da4b2ae048c9212d8ece49f94193e78c8b9ea2ae7`。全raw/実messages/response/encoded token/更新記録/重みをprivate34member archiveへ保存し、CRCとmanifest全SHAを照合済み。`cocolon-analysis-teaching8-result-20261102.zip`、Library `libfile_19891a6e03108191bfe496b202ae7c98`、14356049bytes/SHA `19d8309c07e972d043f06781f788f7170dd7042cb6396d853d065ddea35e483c`。終了後GPU compute-apps空、旧fit38 weights/config不変。単価$0.58/hの実process按分約$0.01721、準備/回収/保持/税等別。

### 次の隔離継続：追加8教材を合わせた16件・32更新

[新16件plan](semantic_units_teaching16_plan.json)/[runner](semantic_units_teaching16_run.py)は先の8教材を変更せず、新8件を追加する。unknown親番号と内容、肯定行動と文法否定、報告発話の主体、願望/未決、明記のない理由を交差したroot架空protocol教材で、Mashの教師/正式評価ではない。全targetを現source/受口へCPU再束縛済み。別の新outputに先の隔離Analysis adapterだけを初期値として読み、全112tensor一致を確認する。旧fit38/初回Analysis重み/通常提供を上書きしない。

全16件各2回32update、batch1/accum1/LR5e-5/clip1、既存 `named_reference9_preparation/adaptive_loss.py`（SHA5852c69d…）の全target誤り重みCEをそのまま使う。detached current CEから正の重み1..16を作って正規化し、target/EOS/改行を一つも除外しない。比較NLLはunweightedで別記録。CPU full/maskedとtailのloss/全grad一致をweighted/unweighted両方で実行前確認する。

開発で既見のAF/UV4件は前runの実after rawをref/messages/SHA照合でbeforeへ再利用する。新診断NV01〜04はunknown/発話/願望/時点の別題材、正解教師として未使用。新4before＋8after＝12call以内、model load3回、process900秒（外TERM890+kill10）/同単価按分上限$0.145、各23秒/greedy/nonthinking/max2048/context8192。全raw/finish/保存重みを回収し、受理数と内容妥当性を分けてrootが読む。これは開発試行で、独立盲検/通常採用を自動成立させない。教材追加・更新数・loss重みを同時に変えるため、改善しても継続候補全体の効果でありweighted CE単独の寄与とは断定しない。必要作業は本セッションのMash指示で承認済み。

この記録時点は追加32update未実行。API cddf1855/製品契約/通常提供不変。限定TECHNICAL_CREDIT（AF02の部分改善を実raw確認）/正式0/3/管理54.50％据置、STRUCTURE_MAP_DELTA_NONE。


<a id="analysis-teaching16-result-and-teaching32-plan-20261102"></a>
## 11/2 — 追加32更新の構造7/8と、まだ残る意味の取り違え

先のAnalysis隔離adapterを全112tensor一致で読み、新16教材×2回32update/32training forward、前後NLL32measurement forward、新4before＋8after=12callを一回実行した。process189.266787秒/exit0。更新/保存された112tensorは全て有限で元modelと一致し、非学習loaderで再読。full/tail loss/全grad一致と全target正重みをweighted/unweighted両方で実確認。平均unweighted NLL0.129117022→0.048250019、16件全て低下。peak allocated9.169629GiB/reserved9.814453GiB。旧fit38/初回Analysis重み不変、終了後GPU compute-apps空。

構造受理は8開発入力のbefore5/8→after7/8、全stop、成立7fileの非生成再読一致。ただしrootとread-only監査で全rawを読み、意味7/8とは扱わない。

| 入力 | 変化と残る不足 |
|---|---|
| AF01 | unknownの親と後悔の否定、肯定行動の偽否定は修正。『疲れていたので』の理由markerを原文にない『てから』へ創作し、全体拒否 |
| AF02 | 前runとraw byte一致、3unitの部分改善を保持。今回新しい改善として加算しない |
| UV03 | 発話行為/話者を選べたが、内容に報告述語も含む。『まだ気になる』をWRITTEN_UNKNOWNへ誤分類 |
| UV12 | 願望が思考になり、未決を理由にする捏造は消えた。未決をWRITTEN_UNKNOWNへ誤分類、時点/修飾の区別も粗い |
| NV01 | 根は受理されたが、約束/返事/これでよかったかの内容対象が候補から欠落。元全文には残る |
| NV02 | 父の発話を行動へ寄せたが、本人の『少し』を父側へ誤接続。本人の明示主体も候補から欠落 |
| NV03 | 願望/未決を思考として選び、非行動/結果へはしない。今日を修飾kindにする分類の粗さ、否定/まだのscope不足 |
| NV04 | 朝/夜→安心の既存分解を保ち、前beforeで欠けた『なぜ読めたか』を正しい不明rootへ追加 |

[全機械結果＋root読解](semantic_units_teaching16_results.json)。これらは同一語句/近い構文を共有する開発題材で、独立盲検/本人受入れではない。教材料・更新数・loss重みを合わせた候補の効果であり、weighted CE単独の寄与とは断定しない。通常採用0、意味を読み解けない構造を通すための受口緩和/原raw補修0。

全raw/要求/encoded/更新記録/新重みを63member private archiveへ保全、CRC/manifest全SHA一致。`cocolon-analysis-teaching16-result-20261102.zip`、Library `libfile_67afad9213d081918ae79bd03912e152`、14435739bytes/SHA `145831684063f87d9923d7cebd0e5852c820114fbe88d325794e83ef6a44027c`。新weights `590dc0a3632af91f924c9ed7910f20dca3998f261081a2f2974e038558d93943`、config `9f5859a9bbe475bf3cc3bf7a2d15d374c8bf4c9cfb57926c375671783724ef05`。同単価の実process按分約$0.03049、準備/回収/保持/税等別。

### 新32教材・64更新：まだ/不明/未決、話者、複数fieldへの直接改善

[32教材plan](semantic_units_teaching32_plan.json)/[runner](semantic_units_teaching32_run.py)は旧16をJSON不変で保持し、新root架空16教材を追加。『まだ気になる』『まだ分からない』『まだ決めていない』を区別し、引用内容と発話述語の境界、本人の少し/話者、対象付き不明、ので/からの逐語markerを教える。AT29はmemo＋memo_action、AT30は2recordで、同field局所親番号/全field順を保持。emoji、ROLEも含む。全32targetを現受口/sourceへCPU再束縛済み。本人教師/正式評価ではない。

初期値は先のAnalysis継続adapterだけ、別新outputへ64update（全32×2回）。全target/EOS/改行、既存weightedCE/LR5e-5/clip1を保持、比較NLLはunweighted。model load2、8開発入力の実before rawをref/messages/SHA照合で再利用し、新after8＋学習済み教師AT17/19/21/29の自由生成4＝12call以内。後4件はTRAINED_REHEARSALとして別集計し、転移/未使用/盲検へ加えない。

**停止条件：** 学習済み教師の自由生成でも教えたcarrier/話者/qualifier作用域を保てない場合、さらに件数だけ倍増/再runせず、学習と推論の重み/入力/target/生成条件の一致および教材設計を点検する。NLL低下でこの条件を置換しない。新12題材の追加診断は準備したが、本候補の意味不足が明白なので未実行とし、改善に戻った。

同Jupyterで一回、process900秒（外TERM890+kill10）/各23秒/context8192/max2048、同単価按分上限$0.145、準備/保持等別。旧重み/本番/DB/RNを上書きしない。本記録時点は64update未実行。Mashの本セッション継続承認内、API cddf1855不変、商品受入0/正式0/3/54.50％据置、STRUCTURE_MAP_DELTA_NONE。


<a id="analysis-teaching32-result-and-alignment-20261102"></a>
## 11/2 — 64更新と教師自由生成を完了、教材数拡大を止めて局所予測へ戻る

新32教材×2回64update/64training forward、同32教材の前後NLL64measurement forward、開発8＋学習済み自由生成4の12callはprocess234.434020秒/exit0で完走。全112tensor更新/有限保存/非学習reload一致、旧重み不変、GPU終了後compute-apps空。平均unweighted NLLは**同じ今回32件の中で**0.072220150→0.024621478、全32低下。前の16教材平均と同一母集団として比較しない。peak allocated9.293182GiB/reserved10.244141GiB。

開発8の構造受理はbefore7/8→after6/8へ減少。学習済みREHEARSAL4は構造3/4、AT17/19/21は教えたJSON内容と一致し、AT29は不成立。前後全rawをrootとread-only監査が読み、改善と退行を区別した。

| 入力 | 内容の判断 |
|---|---|
| AF01 | 依然拒否。原文外modifier/理由marker『てから』に加え、内容対象へ後悔述語が混ざる |
| AF02 | 今日/昨日/結果の3unitは保持。不明表現がEPISTEMICから単純NEGATIONへ粗化し、一方向の改善とはしない |
| UV03 | 他者の発言行為/引用内容/本人の気掛かりを区別。不明への誤昇格は消えた。『気に』の余分なmodifierは残る |
| UV12 | 願望と未決が独立した思考、今日/否定/まだも対応scopeへ。局所的な内容改善を確認 |
| NV01 | 対象語をEXPLICIT_ACTORへ誤分類、不明内容を独立結果へ昇格し、carrierも不正。退行 |
| NV02 | 本人の主体と少しのscopeは修正。一方『大丈夫だ』の『だ』をNEGATIONへ誤分類 |
| NV03 | 願望と未決が思考、今日/否定/まだが整合。局所改善 |
| NV04 | 朝/夜→安心と理由不明/対象の部分分解を維持 |
| REHEARSAL_AT17/19/21 | 学習済みJSONと同値。転移や盲検として数えない |
| REHEARSAL_AT29 | 教えた独立願望を未決rootのCONTENTへ変え、重複する『部屋』を引用して拒否。教えた2field教材自体が未適合 |

[実結果と全root読解](semantic_units_teaching32_results.json)。通常採用0。構造6/8やNLL低下を品質受入れに換算しない。計画の停止条件を適用し、さらに教師数だけを倍増することも新12題材の生成を進めることも止め、入力/重み/target/推論の一致と局所誤りを点検する。

全raw/要求/encoded/重みをprivate66member archiveへ保全、CRC/manifest全SHA一致。`cocolon-analysis-teaching32-result-20261102.zip`、Library `libfile_53338dfcb1a881919440812b7c9f7bd3`、14427639bytes/SHA `e36490c680d80e8e235056107de2b8efcb719cbfb662322abd0ae2adf42bdb39`。新weights `02dfa43f0e848da2d3e2c9bf1e519e76a8e8dfa74e59c855dfee892259e911a7`、config `ad2ff18a05a8b901db0f04a74cacaf3c1360cf342ae07b473b176885bdb3bba5`。同単価の実process按分約$0.03777、準備/回収/保持/税等別。回収準備で実run完了前のassertが一度停止したが学習/生成を再実行せず、完了後に原本を回収した。確認コマンドのUI入力途中タイムアウトも学習runの再実行にはしていない。

### 追加学習なし・生成なしの少数forward診断

保存済み資料のCPU照合で、全4REHEARSALのtrain/eval/実送信messages/request_ref、保存prompt/全input IDs/全maskとtarget列の対応を確認。AT17/19/21はJSON内容一致、AT29だけ不一致。既存loaderは非学習で全112重み一致を検証、dropout0、BF16/SDPA/固定revision/nonthinking/chat templateも同じ。主な実行差はtrainer測定のuse_cache=False/gradient-checkpointing設定と、生成のuse_cache=Trueであり、現段階で原因とは断定しない。

[非学習plan](semantic_units_alignment_plan.json)/[診断runner](semantic_units_alignment_probe.py)は同じ既存serving loaderが読み込んだmodel/tokenizerを使い、4教師targetのNLL/各token誤りを調べる。AT29の最初の分岐を全teacher-prefixと短prefixのcache False/Trueのprefill（逐次cache生成の再現ではない）で比較し、引用『部屋を』近傍の確率/順位も記録する。**計6forward/新生成0/更新0**、300秒（外TERM290+kill10）/同単価按分上限$0.04834、別output一回。元rawから再tokenizeした列は局所診断だけに使い、元生成token列の完全回収とは呼ばず、raw受口へ補修して戻さない。

この記録時点で6forward診断は未実行。必要作業は本セッションのMash指示内。API cddf1855/本番/DB/RN不変、正式0/3/54.50％据置、STRUCTURE_MAP_DELTA_NONE。


<a id="analysis-alignment-result-and-fixed32-plan-20261102"></a>
## 11/2 — 経路のずれではなく局所未適合、同じ32教材を固定した追加128更新へ

非学習診断は6forward/新生成0/更新0、process11.666034秒/exit0で完了。modelは既存serving loaderの非学習・全112tensor一致済みモデルそのもの。4教師のmessages/ref/全input IDs/prompt prefix/mask/assistant全target/EOS/改行が保存trainingと一致した。serving NLLと保存after NLLの差は−1.7〜−6.5e-6程度。model.training=False/全requires_grad=False/LoRA dropout0/gradient checkpointing=False、top config use_cacheなし/text_config=Trueを実読取した。

AT17/19/21はteacher-prefix top1が全157/110/99target tokenで正しく、実自由生成も教示JSONと一致。AT29だけ**210/214**で、平均NLL0.04610が局所誤りを隠していた。

- 最初のraw再tokenize分岐index25（qualifiers開始）で、教師側tokenは確率16.35％/順位2、実raw側は83.06％/順位1。実rawでは独立願望でなく未決を先に選び、願望をその従属へ変えていた。
- 同じ短prefixのprefillでも教師側18.13％/raw側81.25％、cache False/Trueの順位/確率は同じ。これは逐次cache生成の再現ではない。
- 教えた一意引用『部屋を』の『を』は14.62％/順位2、引用を閉じるtokenが84.16％/順位1。実rawの曖昧な『部屋』と対応するteacher-prefix上の局所未適合を確認した。

この4例の範囲では入力/重み経路不一致を示す証拠はなく、局所未適合が平均値に隠れたと読む。全ての経路差/逐次cache差を否定したとは言わない。raw再tokenizeは元生成token列の完全回収ではない。[全結果](semantic_units_alignment_results.json)。rootとread-only監査でこの解釈を照合。

初回は記録用のtop config.use_cache参照がAttributeErrorとなり、8.954900秒/0forward/0生成/0更新で終了。optional getattr/text_configの読取へ修正し、旧source/report/logを保持して別result-fixedへ実行した。原本11member `cocolon-analysis-alignment-result-20261102.zip`、Library `libfile_4ed46a2a16948191857b075c6ae63414`、18434bytes/SHA `5d978a0022c34e23ccb1617e41132061408b4f61ac17254fa8de733edab44cf6`。CRC/manifest全SHA一致、終了後GPU compute-apps空/adapter不変。修正版実process按分約$0.00188、初回約$0.00144、保持/準備等別。

### 固定32教材の追加適合を一候補だけ比較

[固定32 plan](semantic_units_fixed32_plan.json)/[runner](semantic_units_fixed32_run.py)。教師/全messages/targetsは先の32教材とJSON完全同一、追加教材0。先の保存Analysis重み02dfa43f…から別new outputへ、既存full-target weighted CE/LR5e-5/clip1を保って各4回128update。32順と逆順を交互にし、対象/EOS/改行を除外しない。前後の同32NLL各1回＝64measurement forward、model load2。これは素材を増やす試行ではなく、局所的な教師自身の未適合を減らせるかを見る。

前runのDEV8＋REHEARSAL4の全12rawをref/messages/SHA照合でbeforeへ再利用、新after12だけ生成。AT29の独立願望/未決と一意引用、学習済み4全体、AF02の不明表現/NV01の誤昇格を含む開発8全体を読む。AT29だけ直れば採用とはせず、JSONのkey順だけの差を意味失敗にもしない。追加更新で未使用入力が改善する保証はなく、一般品質/盲検/本人受入れへ転用しない。

process900秒（外TERM890+kill10）/12新call/各23秒/context8192/max2048、同単価按分上限$0.145、保持/準備等別。失敗時にepoch自動追加/教材増量を繰返さず、局所分岐を読んでtarget/objective/表現の見直しへ戻る。重み初期/保存の全112一致/有限性と元adapter不変、全raw回収を維持。本記録時点で追加128update未実行、今回のMash継続承認内。API cddf1855/通常map/DB/RN不変、正式0/3/54.50％据置、STRUCTURE_MAP_DELTA_NONE。


<a id="analysis-fixed32-result-20261102"></a>
## 11/2 — 固定32教材の追加128更新を完了、学習済み4件一致と残る転移不足

前の32教材/messages/targetを完全不変で各4回128update、同32前後NLL64measurement forward、保存非学習reload後のDEV8＋学習済み4の新12生成を一回完走。process324.174446秒/exit0、全12stop。全112tensor更新/有限保存/非学習112一致、元adapterと旧fit38不変。peak allocated9.293182GiB/reserved10.244141GiB。全assistant target/EOS/改行とprompt mask、weighted/unweighted full-tail loss/grad一致を維持。

同32件の平均unweighted NLL0.024621478→0.005012718。31件低下、AT15だけ0.015241444→0.026874892へ増加した。平均値だけで全面改善としない。

**学習済みREHEARSAL4件は全て教示JSONと同値**。AT29は『引っ越したい』と『時期はまだ決めていない』が独立した思考へ戻り、行動側の一意引用『部屋を』も回復した。rootとread-only監査で全12raw/元sourceを読み、元raw SHA12件、教示JSON4件の一致を確認した。これは局所未適合の診断に対応する教師自由生成の回復であり、盲検/一般品質/本人受入れではない。

| 開発入力 | 内容の判断 |
|---|---|
| AF01 | 拒否継続。『てはいない』を原文外『ていない』、存在しない『相手の』modifierへ。理由marker『ので』は回復したが全体を補修しない |
| AF02 | 前runとbyte一致。時点/結果の3unitは保持、不明表現を単純NEGATIONにする粗化も残る |
| UV03 | 前runとbyte一致。発話者/引用/本人思考は保持、『気に』の余分なmodifierも残る |
| UV12 | 願望/未決を独立思考として保持。ただし願望内の否定と未決全文をmodifierへ置くscopeの粗さ |
| NV01 | 対象語の主体化は減ったが、不明内容の親がunit3の思考でunit4の不明rootへ届かず拒否。待つ行動も思考へ分類 |
| NV02 | 父の発言/引用内容/本人の心配と少しが整合し、『だ』への偽否定が消えた局所改善 |
| NV03 | 願望/未決/今日/否定/まだは保持、『たい』の余分なmodifierが増えた |
| NV04 | 前runとbyte一致。朝/夜→安心、理由不明と内容対象を保持 |

DEVの構造受理は6/8で据置、REHEARSALは3/4→4/4。成立10candidateは同file再読成功。別local processでもEngine.generate/compile entry/realizer entryを禁止し、同candidate ID/coverage10件の再読を確認した。期待表現をvalidator内で再計算することと、新model call/作者entryを再実行しないことは区別する。実4B由来の通常SQL保存/HTTP/DB/RN採用0、全record未解析/route0/主体は未解決、polarity/modality/temporal_scopeはAS_WRITTEN_UNRESOLVEDを維持。途中で再読用の旧scratch venvが失われていたため、同Python3.12.14/Pydantic2.14.1/FastAPI0.162.0等の隔離環境を復元して10件を確認。最初の旧path起動失敗は実行0で、既存860回帰の再実行/再加算ではない。

[全機械結果とroot読解](semantic_units_fixed32_results.json)。通常未採用。AF01/NV01の拒否だけでなく、受理された候補のqualifier意味も未完成のため、入出力を緩めたりrawを直して通すことはしない。追加epoch/教材増量を自動で続けず、次はこの固定実rawを基に逐語引用選択と不明rootへの意味接続を分け、既存32と異なる近接対照/出力表現の最小差分をCPUで検討する。旧評価の完全同一文を新教師へ転用せず、通常graph/DB/RNへの橋渡しは意味候補の妥当性と既存owner境界を保って別段階とする。

### 全重み/原本の回収と再開点

全71member（manifest対象70）のCRC/全SHAを照合し、先に通常JSON表示から保全したreport/全12rawとも一致した。private原本 `cocolon-analysis-fixed32-result-20261102.zip`、Library `libfile_609f1e617a688191aadbdb5e8f988a4f`、14435522bytes/SHA `537b9880e120b9624cf9df38e4707be546433e0b479416f9dd40935895cc3d4a`。最終重みSHA `09b3a1f6beb825e07d82e9d23cce2e69c2099d18041537e38fe5eb8c0c0333f5`、config `047a624c7610132ebfa621642342760060446ed9360dab4ca8e1741ea016738b`。元32教材適合前の02dfa重みも別private原本へ保持。保存対象は全112adapter tensorで、baseはplan記載の固定model/revisionから再読する。

転送APIがfail/timeoutを返し、分割/小metadata/再接続でも同じ通知だったため、学習を再実行せず通常HTTP JSON表示からまず12rawを保全。review JSON63583bytes/SHA0f75eb8c…、review private11904bytes/SHA916abd7a…/Library libfile_11ed9ed757a08191b7d9b58c7949707f。後に共有保存先の実ファイルをsize+SHAで検索すると、元ZIPと一致する完了済みファイルが存在していた。これを取得してCRC/manifestを検証し、**重みを含むPod外回収も完了**した。失敗通知だけで未転送と確定せず、実ファイルを独立照合した。内部ブラウザdownloads画面はURL policyで開けず、そこを迂回して閲覧せず、通常ファイル表示/共有成果物照合で完了した。保存/学習/生成/受口の再試行やraw補修はしていない。

この作業ブロックでは意味単位wireのCPU実装/860対象PASS、版分離113対象PASS（前者と重複あり）、実4Bの新48生成、分析用の16＋32＋64＋128＝240更新、局所診断6forwardを実施。新datasetはroot架空の32例で、既存9/19行教材・通常重み・正式評価は不変。初回のadapter階層指定失敗0生成とmetadata参照失敗0forwardも原本保持。各runの按分額は処理範囲だけで、準備/回収/保持/通信/税等を含む請求額ではない。今回128runの同単価process按分は約$0.05223。

API sourceはcddf1855のまま、rootが全実装/write/実行/全raw統合、別agentはread-only監査のみ。Render/本番/DB/RN/通常有効化/mergeなし、Pod Stop/再起動/削除/追加チャージ0。最終の所有model processは終了。必要作業はMashの本セッション指示で承認済み、次の再開もGitHubの固定資料とprivate重み/原本から行い、完了済みrunを二重に実行しない。正式0/3/54.50％据置、限定TECHNICAL_CREDIT（教師自由生成適合/局所改善と原本回収）、STRUCTURE_MAP_DELTA_NONE（本結果記録の差分。§51の新wire実装PRESENTは保持）。


<a id="analysis-quote-first-probe-20261102"></a>
## 11/2 — 引用先行の版分離・同保存重み12生成の比較準備

Mashは分析残件に必要な実装・GPU利用・途中GitHub反映と区切りを跨ぐ継続を明示承認。Codex Work/GPT-6のrootが実装/実行/write owner、別agentはread-only監査。最新全機能原本を全文、全体設計01のflow/01A–C全file地図の対象owner、fresh tracked tree、三core地図、最新weekly§45〜58、前回12raw/32教師を確認。System Context最新cacheは索引timeoutのままfresh原本fallback。

DIRECT_PRODUCT_OR_ACCEPTANCE_WORK：未学習入力の逐語引用・不明親の転移不足が未完了。32教師には「てはいない」の否定引用、同field親4のUNKNOWN_CONTENTが0。これは誤りの因果確定ではない。targetのcanonical順はnode_kind/parent/qualifiers/quote/scope_roleであり、quote選択が後になる表現を小さく比較する。旧DEV完全同一文を教師へ移さず、epochだけの反復を再開しない。

API `1561526b972bbaba2b77561f57b9a945fdabd9f6`で新指示`quote_first.v1`を既存ownerに追加。元3demo/意味/5key/受口は不変、unit出力をquote→scope_role→node_kind→parent→qualifiers、qualifierをquote→kindの順に示す。助詞を抜かない逐語引用と実不明root番号を指示。baseline/clarifiedのmessages/ref/state互換は保持、新版は既存state.v2と版付きrefへ分離。旧raw補修/親の自動付替え/受理条件緩和なし。CPU対象112 PASS、2 SQL検査はWASM未設定でSKIP、既存非推奨warning1。pytest欠落を検出した最初の実行はcollection0、8.4.1を復元後の実結果であり旧860へ加算しない。

実装順：版分離と再読/異版拒否→CPU確認→同保存09b3/config047aの新指示12生成→全raw/同file再読の内容比較→必要時のみ別題材の少数対照を作る。[要求](semantic_units_quote_first_requests.json)/[runner](semantic_units_quote_first_probe.py)。既見DEV8＋学習済REHEARSAL4で、新12call以内、追加学習0、loader1回、process600秒（外TERM590+kill10）、各23秒、nonthinking/greedy/max2048/context8192。単価表示$0.58/hのprocess上限$0.096667、準備/回収/待機/保持/通信/税等別。入力切捨て/raw補修/自動再試行なし。原32教材/旧重み/通常提供は不変。全raw/finish/同artifact/privategraph/全文/保存fileを回収し、rootが読む。引用不一致/打切り/意味退行は候補不採用とし原因へ戻る。通常map/DB/RN/HTTP有効化/Render配置/mergeなし。

Supabaseはproject metadataだけを読取しACTIVE_HEALTHY、本人row/SQL変更0。Renderはworkspace未選択で本作業には不要、選択/service操作0。GPUは既存同Pod RTX PRO4000/$0.58/h、所有model processなしを確認。Pod作成/再起動/Stop/削除/追加チャージ0。通常map品質・正式0/3・54.50％据置。新指示版のためSTRUCTURE_MAP_DELTA_PRESENT（既存owner/意味wireのまま明示offline版を追加）。この節のGPU比較は準備段階で未実行、後続結果へ更新する。
