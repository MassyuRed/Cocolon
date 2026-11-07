# 10/26 — 既存教材のinterface再検討（Jupyter CPU完了）

Cocolon開始 `0c821cebcfd35c1aa8a8e405cd696bbcb5c6b7a6`、実行source `d28fc0048c853c17144f58b16261c1b5225bde2f`／API `4002b4577838d1ed6671278a19585b61e7ccd10e`。bridge13は不採用・閉鎖のまま。旧45779を保持する。

## 結果

既存教師9件を既存quote形式へ統一した候補を作成し、Jupyter直接のCPUで **9/9の意味・本文・問い・訂正内容が旧教師と一致**した。4Bの生成結果ではない。

- `native_quote_messages.jsonl`：新しい教材候補。chair6はcandidate全体／根拠行順を保ってstart/endのみ除き、既存quote schemaへ投影。daily3はmessages全体が旧教師と完全同一。
- 全78根拠行（chair54＋daily24）のsource/field内完全引用が一意で、既存compilerから元のcandidate/evidenceへ完全復元した。
- 既存build_model_messages→receive_candidate→意味採用→Engineの同snapshot本文再開まで、旧／quote各9教師を比較。meaning_packet、観測／受け取り／更新文、問い本文／ASK-END、answer_update全体／更新数が一致。chair初回3ASK、訂正3件は各3更新・問いなし、daily3は問いなし。
- chair訂正一件で不正3例を確認。根拠6/10/11欠落と配列外999参照はreceiptがCANDIDATE_UNREVIEWEDでも意味採用でHOLD/model_claim_axes_not_source_bound。存在しない引用はINVALID_EVIDENCE。受領通過を意味採用と混同しない。
- 実tokenizer・8192context／生成枠2560を確認。最大prompt3854、assistant/EOS2237、全文6085。切捨てなし、EOS保持。
- 実CPU15.6139088068秒。4B重み読込／forward／追加学習／モデル生成／SQL0、追加依存0。API/source/SFT/旧adapterのhashを前後照合。legacy helperは別postcheckに分離し、run_pilotは固定2f659078、verify_cmeeは6c042267。CPU probe内部には時間上限がなく、実所要を記録する。新GPU実行の時間上限を検証したものではない。

`cpu_review.json`は旧／quoteの全意味・本文と不正3結果、`three_stage_alignment.json`は既存generic3段階とnativeの対応／旧Free9教師の出所、`helper_postcheck.json`は補助source、`cpu_launch.log`は実起動結果、`recovery_manifest.json`／`recovery_verification.json`は回収照合を所有する。runner SHA256は012e2a8fdb747785ed939cf31cddca962e282e748bd5391bc8490a482e95ed01。

Jupyterの長い未完了入力を途中送信せず閉じ、Python構文エラーで効果前に終了してから固定GitHub source取得へ縮小した。最初の短い複数行入力も改行転送不備で効果前SyntaxError。実CPU childはPID688267の一回のみ、モデル起動0。完成archive27,224bytes／6member（5payload＋manifest）、SHA256 `3b1bfd25a3bd4d17c90a2048e4722ddf0ef16c33bdea9f341a7ec758c6ecef7c`を一回downloadし全payload照合。hashの画面転記誤りは実bytesから訂正、再download／CPU再実行0。終了時RTX A4500／20,470MiB／使用1MiB、GPU稼働保持。

## 教材として分かったこと

| 段階 | 本人sourceの対応 | generic／nativeの差 |
|---|---|---|
| UDON初回 | memo・action・カテゴリ・感情／強さが一致 | 観測・受け取り・更新文も一致。generic6欄とnative5claim／4関係／8引用は別責務 |
| chair初回 | 同じ原入力、同じ観測・実問い | 受け取り表現は異なる。「本人が不明と言った」ではなく、本人基準の詳しい理由が未記載 |
| chair訂正後 | 同じ原入力・本人訂正全文 | 観測は一致、受け取り／更新文は異なる。nativeには採用済priorと3更新／12根拠が必要 |

bridge13でgeneric教師に使ったのはUDON1だけ。chair generic2を追加するだけで成功すると推定しない。言語的に独立した話はchair＋udonの2題のまま。新候補を9題や未知評価へ数えない。

原Free9は華恋編集7／華恋架空補充2。UDON完成targetは華恋編集、chair初回はMashの実問いのみで完成応答なし。chair訂正後のMash D03は「修理することで、また椅子が使えることに喜びを感じたのですね」の一文で、完成応答全体や正式承認ではない。native chairはAPI手製model_packet/natural_packetが直接の出所。MashのUDON実演にある入力外の食欲／身体の温まりは本人事実へ継承しない。失敗raw・E05/E01/E03/A03・撤回読書会は教師にしない。

## 次の直接作業

**実CMEEへ渡すnativeの入力・意味候補・自然な本文を学習の基準とする。** generic6欄は比較用task cardであり、通常CMEE入口ではない。形式統一候補の実モデル適合は未実行。generic出力の改善だけを通常接続の改善へ換算せず、局所mask／LR／更新回数や同じ2題への反復を追加しない。

新しい観測会は今回の基本的な受け取り／原文保持には不要。まず既存教材の未接続例とnativeの受理範囲を対照し、利用者へ返す自然な本文の対象を定める。新しい言語family／採用範囲を実装する場合は具体差分を先に示す。自然な完成応答の広さ、独立未知評価、Piece／Analysis完成教師と本人端末は不足したまま。新有料実行のplan／承認は今回作成せず、GPU試行を自動開始しない。

## 実行・反映範囲

Mashの続行指示とRule18の可逆的な教材候補・結果記録のstanding delegationに対応。root華恋／Codex Work／GPT-6が単一実行・writer、別文脈2agentはread-only原本照合／code reviewで正式Pro／Ultra／human受入れではない。成功は既存教師の形式互換性のみ、限定TECHNICAL_CREDIT、商品0／正式0/3／54.50％据置。

対象は当directoryと全体現在地00／観測入口README／全file地図01A／最新weekly20261024の関連差分。旧教師・runner・consumer・製品source・admission・reader・契約・保存・公開API／DB／RNの変更0、STRUCTURE_MAP_DELTA_NONE。旧完成rawや閉鎖済みplanを変換・再起動しない。管理console／GPU一覧／管理API／Stop／再起動／削除／新Pod／charge／Render／Supabase／本人DB／通常application／merge／deploy0。GPU保持料金は継続し、CPU所要やモデル処理0と区別する。
