# 根拠表と参照に重点を置く6更新候補

FIT12と実service ID01は終了し、再実行しません。実原本では引用座標だけでなく、必要な根拠行の欠落と範囲外参照もありました。同じ凍結6教師・同じ意味/本文を保ち、根拠表全文とcandidate内evidence_indexesの値へlossを絞る別candidateです。endだけの学習案はGPU実行せず、この範囲へ補正しました。

開始は回収照合済みadae463b…、新AdamW/LR5e-5、6行を1pass/6更新。全文context/EOSは保持し、選択外valueはlossから除きます。BPE境界は構文記号だけの丸めを許し、別の意味valueへの漏れを拒否します。before/after選択NLLは前の全文NLLとは別指標です。保存/非学習reload後、同6入力FITを一度だけ生成し、raw補修なしでCMEEへ渡します。

評価ID02はtraining6行と終了済みID01からUUID/日時を分けたfresh identityです。本人入力の言語内容は既知chairのまま、gold/priorを入れず、実serviceの問いとactual priorを使います。新重みhash固定後に最大2callを一度実行します。通常application/実DB/Render/API/reader/RN/merge/deploy変更0。2560/5632/8192、attempt180秒/source150秒を維持。学習最大30分/按分$0.13、評価最大15分/$0.065、GPU継続保持/準備/回収/税別。GPUはSTOP/再起動/削除しません。一般観測品質や商品受入れではありません。
