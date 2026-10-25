# 実モデル2回を逐次接続する既知fixtureのoffline一往復

実行前。Mashの今回の「4B学習＋CMEE接続を続けて」に基づき、意味/本文2/2になった保存LR5重み9b845eced…を既存CMEEへ逐次接続する。前段の固定raw consumer成功と、実初回snapshot由来messages一致/保存raw再消費のCPU再現だけでは、実モデル2callを順に動かした事実にはならない。この差を閉じる直接接続確認。新provider/endpoint/engine/service/DB/rendererを作らず、既存build_model_messages、r.evaluate、verify_cmee.consume_rawと既存Engineを同一processで使用する。

root華恋が単一実行/編集/反映owner、補助agentはread-only review。Codex Work/GPT-6。既存4B/CMEE接続family内、CURRENT_RULESのOBSERVED_BLOCKER_MINIMAL_FIX/既存依頼の接続確認。全機能原本/work rules/incident/全体設計01/全file地図01A/current04/weekly§32と今回のLR5実結果を確認、System Contextは既知のfresh原本fallbackを使う。

固定base/revision/tokenizer、保存adapter9b845eced7738b32eb21cfe9193798a41ae58d6f439aac9a5731c68e96952835/API7a4dc32/元sft2caseとrunner/consumerのhashを固定。初回原入力→sourceからbuild_model_messages(req0,None)→新生成1→同実CMEEで意味/本文/QUESTION_PENDING→実questionと用意済みscenarioのpending全dict一致を確認する。不一致なら用意した回答を流用せず停止する。

一致した時だけ、元case2を不変に保ったcopyのpriorを実初回snapshotへ置き換え、同じ既存sourceからbuild_model_messages→新生成2→同consumerで意味更新/本文まで確認する。モデル入力はsystem/userだけでassistant教師0、保存rawによる置換0、原文/候補の補修0。意味/本文2/2・問い1件・訂正3更新・非対象meaningとsource bindingの保持を、採用済み固定実結果と比較する。初回/訂正のactual messages、raw、checkpoint/本文、call開始/完了を各段階へ保存。

新規folder/attempt x、生成最大2/学習0/optimizer0、900秒/表示$0.26h按分上限$0.065。これは保持/準備/回収/税を含む請求hard capではない。失敗/質問差/timeoutは後続呼出しなし、retry0、raw代用0。同保持A4500のみ、重み3hash不変を確認。Stop/再起動/削除/新Pod/charge/新依存/本人DB/Private Diary/credential/通常有効化/Render/Supabase/merge/deploy0。

使用する本人役の原入力/回答は既存公開済み架空chair fixtureだけで、新しい観測会は不要。これは既知fixtureでの明示offline一往復で、通常ModelCandidateSource/service/Auth/SQL/API/RN/端末を通ったと称さない。商品受入れ/未知評価/三中核品質へ昇格しない。STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/54.50％を維持する。
