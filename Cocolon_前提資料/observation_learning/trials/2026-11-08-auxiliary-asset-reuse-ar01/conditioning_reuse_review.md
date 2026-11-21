# AR-01 関係束縛・旧教材の利用と、初回本文への質問混入の修復

2026-11-08 JST。実装はAPI [c6555fd5](https://github.com/MassyuRed/mashos-api/commit/c6555fd5b81cd4ecda1bafdec60aa311c9e7feea)。**生成の研究4版は通常不採用、AR-01は継続中。** 新たな確認質問の保存抜けだけを修復した。実本文の意味品質全体を合格にしていない。

## 実4Bで比較したこと

前回の通常語順補助6構成を引き継ぎ、同じ6既使用development sourceを固定した。4件は構文開発時に既知の対照、2件は既存教師source診断で、未知blind評価ではない。

| 変更 | 新生成 | 実loop秒 | 結果 |
|---|---:|---:|---|
| 元SYSTEMと通常語順補助へ、別命題・感情時点の関係指示を追加 | 6 | 9.508418 | 未記載原因を外す例はあるが、感情時点・記録説明の残存と退行 |
| 簡潔なSYSTEM・補助なし | 6 | 下段と合わせ17.665428 | 人物混入、因果・対比・感情時点、質問が残る |
| 同じ簡潔なSYSTEM・通常語順補助あり | 6 | 上段と合わせ17.665428 | 受動／可能の不自然さ、命題破損、未記載反応 |
| 元SYSTEM＋別の既存教師3組を文脈内で提示 | 6 | 9.972725 | 第三者の方向を保持する一方、一人称の移動、未記載目的の問い等 |

計24実生成、実loop37.146571秒／HTTP累計36.958948秒、全HTTP200／stop。既存教師T03・D03B・D05Aの原本とtargetを変更せず回収し、現在の入力とは別の架空教材と明示してSYSTEMへ置いた。Mashの採用済み実演ではない。今回の評価6source・24出力・判定を教師targetへ変えていない。簡潔版の補助有無は同じSYSTEMで比較し、他の版とのjoint変更を単独因果へ換算しない。

rootは全24本文を原入力へ戻って読み、独立AI担当も全24＋旧通常語順6本文を照合した。短く正しい一度の言換えは許容する。選択感情自体は原入力にあるため、それを新規捏造と一括しない。原文が結び付けていない場面・時点・期間へ感情を付ける誤り、語り口の弱さ、明確な意味変更を区別する。4版とも通常採用不可。品質PASS率・一般化の合格は出さない。

学習更新0、新model load0、provider retry0。同提供PID／元server source／Analysis adapter weight・configの前後一致、health200、実tokenizerの無切詰めを確認。全レンタル時間・請求額は未測定。通常の生成設定・元SYSTEM・材料は変えていない。

## 実際に直した保存前の抜け

今回の2応答が、疑問符なしの確認質問を含んだ。既存validate_replyは疑問符だけを拒否していたため、元validatorの隔離SQL再生では24件すべてFINAL保存された。これは「初回本文には確認質問を含めず、問いは別処理で決める」既存責務からの抜けである。

旧grounded ownerの`_top_level_text`を現在の`natural_reply.py::validate_reply`内で再利用し、top-levelの「でしょうか／ですか／ますか」に句点・改行・末尾等が続く有限形を拒否する。引用された発話を質問生成と混同せず、壊れた括りは一致語尾を隠す手段にしない。一般的な日本語の質問意図を完全判定する機能ではなく、口語・別文型等は未対応。本文の書換え、再生成、代替provider、retryは追加しない。

API変更はnatural_reply.pyと既存application testの2path。新13ケースを加え、meaning111＋cognition47＋budget21＋application71＝250 PASS。引用内発話、平叙文、既存受領／失敗／保存境界を確認した。PGlite0.5.8の実隔離SQLを使用し、既存Pydantic非推奨警告1件。CI結果は最新weekly§24へ記録する。

## 同じ24原本の保存前後比較

実provider class＋既存_process_natural＋隔離PGliteへ、保存済みHTTP応答を同じraw／system／user／requestのまま各1回だけ渡した。旧validator24 FINAL→修正版22 FINAL／2拒否。受理22の保存本文hashは前後一致し、拒否2件はartifact／receipt0・RESPONSE_FAILED／UNAVAILABLE・can_retry=false。全24件で同／新service GETの同一結果と、provider／reader／Engine再実行0、SQL event不変、USER source不変を確認。新生成／実HTTP／実DB操作／自動retry0。

capture originalのuser_idを通常SQL parent-source projectionが省くため、全24で両source参照は異なる。両参照を保持し、各原本から再計算した。研究内のprepare／SYSTEM差替えで実captureを再現しており、通常設定の変更やsource参照の偽装ではない。

新22保存reportは未判定19／範囲内非衝突3・衝突0、全37節のparsed／checked3・未照合34。全文coverageは全件false。保存成功、2件の契約拒否、有限非衝突を商品意味品質へ換算しない。

## 現在の適用と次作業

**STRUCTURE_MAP_DELTA_NONE：既存natural受領owner内の有限検査修正。新しいpath・型・作者・wire・DB schema・保存owner・lifecycleはない。** 全体設計図・file地図・current Emlis／CMEE mapを確認し、今回は地図の新owner追加を行わない。今回のRender配置・実Supabase・RN／build・通常model変更0、本人端末／正式受入れは未実施。候補c6555fd5は未配置。

全capture、旧教材原本・実messages、原文対応の全判断、修正前後SQL再生script／結果、前後sourceを非公開の`Cocolon_CMEE_AR01_Conditioning24_20261108.zip`へ保全した。公開資料へ私的本文を転載しない。

次は追加promptの同周回を止め、評価6sourceとは別の既存教師sourceから、記録者・第三者・語り手・感情時点・理由の対応を保つ本人宛本文の対照を回収し、既存学習ownerの単一候補比較へつなぐ。評価入力／生成物／判定を教師化しない。新しい学習方式を動作未確認のまま既存runtimeで実行可能とせず、質問拒否の成功を文章の意味修復へ代用しない。AR-01全体、AR-02〜08、全必要資産の活用は未完了。
