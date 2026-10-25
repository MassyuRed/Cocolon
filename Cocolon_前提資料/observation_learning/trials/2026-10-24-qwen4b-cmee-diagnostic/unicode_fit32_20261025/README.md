# 全文字座標を含む新入力への32更新

**実CMEE：意味0/2→2/2、本文0/2→1/2。** 初回は本文と実問いまで成立。訂正後の意味・根拠・参照・3更新も成立したが、受け取り第2文が既存の本文読取を通らず、本文は未提供。

source `4ad759792b8cfd820f44d72b233eb853a354ecb7`、API `a3e82f0e2156f9142ca37878425eb0a4b6046761`、run `20261025-043032-a3fef235`。保存ce644から新optimizerで同2target×16周/32update、792.243856668秒。教師加重NLL **0.089365729606→0.002610727951**。初回1995→1095token/訂正5018→1876token、両方JSON/stop。beforeは同messagesの直前実raw2をbyte再利用し、新生成はafter2だけ。厳密なoptimizer/RNG途中再開ではない。

全18根拠（初回6/訂正12）のsource/field/整数座標/bounds/quote一致を確認。初回packetは教師と解析後全一致、訂正もsurface以外の意味/根拠/参照/3更新は教師と一致。旧solo/旧喜び理由/unknownを正しく更新し、未変更のrepair/result/joyを保持した。採用条件・reader・原raw・教師本文は変更していない。

訂正の唯一の差分：teacher第2文「またその椅子に座れるようになって、よかったですね。」に対し、実生成は「またその椅子に座れるようになったのですね。」。結果に対するEmlisの反応が結果の再確認へ変わり、独立readerでmodel_surface_sentence_not_read、実outcomeはmodel_surface_not_validatedとなる。意味の成功だけで本文成功にしない。続く受け取り説明一節の追加候補は非学習確認で意味1/2・本文0/2へ退行し不採用となった。API7a4dc32で本学習時のexact入力へ戻し、以前の本raw2のCPU再消費で2/2・1/2と全result一致を確認した（新生成ではない）。[候補の失敗と復元](../reception_instruction_20261025/README.md)。追加32更新/readerの採用緩和はしていない。

新adapter `a8baf0d310283fd0500e86887e64723e4734693ac48b7f2ddfad7cc07e6a3ea6`。archive `439547199bccdb625c41a961639dbfa1d774711b26893cf7fccee7497607133c`、全24memberのsize/hash、32 F32 tensor有限性、元ce644と新adapterの3file前後hashをPod外照合した。追加重みarchiveは永続保管済み（libfile_92793ab0520c81918d3cab3790583684）。元4B全重み/optimizer/RNGは含まない。

CPU69/pack13は限定検証（38subtestsを加算しない）。新固定plan受理/6変異拒否、実tokenizer全context/教師/EOS保持。画像監視中のNLL転記0.0061は誤読で、上記は回収JSONから自動計算した値。GPU/学習の再実行はしていない。表示$0.26/hの本process按分約$0.057218は準備/回収/継続保持/税等を含む請求総額ではない。

公開済み架空chair2入力だけで、未知評価・実model初回から動的に作った訂正入力・service保存往復・通常application・商品受入れではない。本人DB/Private diary/credentialの取得・送信0。formal0/3/54.50％、商品credit0を維持。GPU停止/再起動/削除/新Pod/charge/新依存/Render/Supabase/merge/deploy0。同runをCOMPLETED_NOT_REPLAYABLEへ閉じ、原実planは本folderに保持する。
