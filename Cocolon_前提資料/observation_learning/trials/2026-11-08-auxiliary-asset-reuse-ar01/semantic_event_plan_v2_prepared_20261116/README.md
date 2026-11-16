# Event-plan v2：原文の留保と一度だけ指定する読みの根拠（11/16・実4B未実行）

A8原本の送信者／宛先逆転、本人判断の不明化、達成済み満足の希望化、reading根拠の二重指定を、既存作者・native・compiler内で修復する候補です。商品owner／公開watashi.map.v3／DB／RN／唯一realizerは増やしません。実4Bの品質改善・実同raw保存再読・通常反映は未確認です。

API sourceは80d94db7833e9fa0039ac581fb73151b0767dda4、tree3310733b7ab42c4a9e670eb76b31e2f695fcdd1c。PROFILE=semantic_map.event_plan.v2、private schema=cocolon.analysis.semantic_map.event_plan.model.v2、alias=cocolon-qwen3.5-4b-analysis-event-plan-v2です。旧v1 rawを変換・再束縛せず、v1の拒否条件も緩めません。

- eventは原文からRECORDED／PERSON_JUDGMENT／PERSON_WISH／DECIDED_PLANを選んでfactを生成します。これはモデルの未評価解釈で、真偽認定ではありません。
- unknownsは同eventの根拠内・同fieldの一意な原文引用です。主体文脈を含めた最大240字をそのまま表示し、疑問文へ言い換えません。訂正根拠は説明全文のままです。
- readingのevent_refsを一度指定し、項目・線・概要は表示するe/rのunit_refsを順に選びます。根拠はcompilerが引き継ぎ、未選択の事実文は表示へ自動追加しません。公開の根拠・未知・文字数・権利・source境界は維持します。
- 既定Analysis／IF120u・自然Emlis／Pieceの元profileを保持します。exact alias2だけがv2を選択し、IFは元120uへ分離します。通常設定はまだ変更していません。

## 確定した新しい一回

execution_scope.json SHA256 b53ac4d90b45631608451c47dc1163265af0b53498bdabdf241d1d0c8743c6fd。初期9file合計3,133,443byteです。全8payloadはscope内のファイル名・bytes・SHAで固定し、scope自身も上記SHAへ固定します。current_api_sources.zipは公開API commitの247完全file（12,593,607byte）をbyte一致で格納する既存Pod用の転送物です。このsource正本・manifest・決定的builderから再構築し、ZIP SHA06f8e7f507b4f0d18ab6180d21c9b57b4139d9499ef4539bf1d5d01ae7775badが一致しなければ送付しません。

A9：既存Pod f1lle4xwq3wjlnへ送付し、架空5件＋候補内の前後4対照、最大9応答・停止復元込み1800秒、一回、学習／retry0。rootは/workspace/semantic-event-plan-v2-diagnostic-20261116-once。既存A8 input_cases／controlsの全byteを保持し、raw／図／本文を5件すべて原入力と独立全文照合します。

B9：A9全5の意味照合が適切な場合だけ、4KB以内のA9結果SHA・5rawSHA・root／独立reviewerラベルを同Podへ追加して実行します。全12原記録を既存plannerが導出した6LEAF＋MERGE、前後4対照、最大11応答・停止復元込み1020秒、一回、学習／retry0。rootは/workspace/semantic-event-plan-v2-full12-20261116-once。6分割は強制せず全messagesから導出し、scopeと違えば元提供停止前に拒否します。MERGEの実token数は新LEAF原本からPOST前に確認します。GPU runnerはSQL保存しません。

両方とも同Pod内の既存認証・元argv/env/cwdの復元だけに既存鍵を使い、秘密値を送付・出力・外部保存しません。直前の元120u PID136765/start237021687はA8復元原本の最終値で、停止前に現実体を再確認します。両上限は復元余白を含み、未使用枠・旧A8/B8を再利用しません。新scopeは未承認／未送付／未実行です。

## 検証と保存への接続

回帰824件、現行source／保存前照合51件、runner15件、抽出247fileのfresh importを確認しました。件数は重複を含むため加算しません。初期の旧汎用parser10失敗と合成fixture1失敗は記録し、schema markerのoptional参照と既存網羅順に沿うfixtureへ修正しました。指示文4913→3436byteは原入力を削らず重複説明を整理したものです。

新しく作った明示CPU合成7応答で、一回SQL保存・月次参照1件・別processでservice/current/detail/month/HTTPの同ID・図・本文・coverage/private一致を確認しました。実4B・tokenizer・hosted DBの呼出しは0で、意味品質／本人受入れではありません。

event_plan_same_raw_finalize.pyは新B9 exact alias/profile/unitと全7の完結raw・plan・guard・as_ofを確認し、root＋独立者の全文意味reviewが同結果／raw／projection／textへ束縛されている場合にだけ既存checkpointの専用forkを開きます。wireは実httpx送信bytesのままreplayし、一回保存後に別processで非生成再読します。旧rawの転記や後付け根拠、失敗rawの修補は行いません。

現通常API／workerは24bc228d Live・autoDeploy off、DB38migration／最新20261115011424。新migration／RN変更／build／TestFlight／本人実機はありません。適切な新全12実結果→同raw保存再読→互換native→worker stale1800のSave-only→exact新commit worker/API→map alias2（IF120u維持）の通常反映まで同じ未完単位です。§9.98／11.2／12を再開正本とし、未評価候補を通常採用しません。
