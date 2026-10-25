# 学習率だけを変える受け取り4更新の一回比較

Mashの新しい継続指示に基づくOBSERVED_BLOCKER_MINIMAL_FIX。fresh PR30 eff740/API7a4dc32、全機能00を全文、必読incident/work rules、全体設計01/全file地図01A、CMEE current04、weekly§32、観測学習意図/用途/前提と実codeを確認。Codex Work/GPT-6、root華恋が単一実行/統合/反映owner、補助agentは読取review。System Context未生成は保持し、既存fresh原本fallbackを使用する。

指定された保存e3743dの同じprefix1forward（生成0/学習0、10.957347936555743秒）で、actual-minus-teacher gapが0.75→0.375へ縮小、teacher順位は未逆転、argmaxは記録生成と一致した。原本はbranch_compare_fit4_20261025/result.json。受け取りlossの方向はこの箇所でteacher優位へ近づいたが、4update/lr1e-5では選択に不足した、という局所実測として扱う。モデル一般の能力/学習率応答の線形性を主張しない。

次は**元a8baf0から**、loss・入力・教師・4step[0,1,0,1]を固定し、LRだけ1e-5→5e-5へ変えた一回candidate。既存family内の内部学習parameter比較。e3743dの不採用は維持し、閉じたplanの再実行/延長/途中resumeにしない。全文入力/全teacher/EOSを保持、同じreception25/24tokenだけをlabelsにする。意味/schema/reader/採用条件を緩めず、新teacher/prompt/evalを作らない。独立reviewはgap縮小時の一変数比較として整合を確認した。

既存LoRA q/v16module/32tensor、AdamW5e-5/weight_decay0/clip1/seed20261024/BF16/SDPA、context8192/greedy/maxnew2048、4updateだけ。保存→非学習reload→同FIT2の新生成各1回。beforeは同a8baf0実raw2をbyte再利用。既存実CMEEで意味/本文2/2・初回実問い・訂正3更新と未変更repair/result/joyを保つことが候補の限定成功条件。loss・token順位だけを成功にしない。退行/失敗/1800秒で打切り、追加更新/再試行0。

同保持中A4500のみ、1800秒/$0.26h按分上限$0.13、保持/準備/回収/税を含む請求hard capではない。原adapterを保持、新adapterは別保存し、重み/設定/全raw/実planを回収しPod外24member以上/32tensor有限性/hashを確認して保管する。元4B全重み/optimizer/RNGは同梱しない。公開済み架空chair2例のみ。本人DB/private Diary/credential取得送信0。Stop/再起動/削除/新Pod/charge/新依存/Render/Supabase/通常有効化/merge/deploy0。今回観測会不要、Windows/Mac未選定。STRUCTURE_MAP_DELTA_NONE、商品0/正式0/3/54.50％を維持。
