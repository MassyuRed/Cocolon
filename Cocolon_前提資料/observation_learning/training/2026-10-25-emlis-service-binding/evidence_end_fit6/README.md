# 根拠表と参照に重点を置く6更新候補

FIT12と実service ID01は終了し、再実行しません。実原本では引用座標だけでなく、必要な根拠行の欠落と範囲外参照もありました。同じ凍結6教師・同じ意味/本文を保ち、根拠表全文とcandidate内evidence_indexesの値へlossを絞る別candidateです。endだけの学習案はGPU実行せず、この範囲へ補正しました。

開始は回収照合済みadae463b…、新AdamW/LR5e-5、6行を1pass/6更新。全文context/EOSは保持し、選択外valueはlossから除きます。BPE境界は構文記号だけの丸めを許し、別の意味valueへの漏れを拒否します。before/after選択NLLは前の全文NLLとは別指標です。保存/非学習reload後、同6入力FITを一度だけ生成し、raw補修なしでCMEEへ渡します。

評価ID02はtraining6行と終了済みID01からUUID/日時を分けたfresh identityです。本人入力の言語内容は既知chairのまま、gold/priorを入れず、実serviceの問いとactual priorを使います。新重みhash固定後に最大2callを一度実行します。通常application/実DB/Render/API/reader/RN/merge/deploy変更0。2560/5632/8192、attempt180秒/source150秒を維持。学習最大30分/按分$0.13、評価最大15分/$0.065、GPU継続保持/準備/回収/税別。GPUはSTOP/再起動/削除しません。一般観測品質や商品受入れではありません。

## 最新実結果

重点6更新・保存/非学習reload後、凍結同6入力の意味/本文は5/6→6/6。fresh ID02の実model2call/隔離SQL30RPCで、初回/訂正後の保存・意味保存後中断/明示再開・GET/start/同key回答の非生成再読まで成立しました。元12更新・ID01の不採用は保持し、それぞれの有限planは終了・再実行しません。本文の新しい自然さや一般言語品質の証明には数えません。詳細は最新weekly§36とtrial/2026-10-25-service-binding、重み76309b86…はPod外回収/32tensor照合/保持済み。GPUは稼働保持します。
