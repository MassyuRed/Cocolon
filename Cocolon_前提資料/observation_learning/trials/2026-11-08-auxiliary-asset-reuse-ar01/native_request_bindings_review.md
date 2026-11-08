# AR-01：native依頼対象bindings候補を32実比較、通常不採用

2026-11-09 JST。前段の転送拒否後、Mashが準備済み架空16入力・比較材料・研究コードの既存Runpod Jupyter宛転送と、最大32応答／比較240秒を明示承認した。同じ凍結ZIPのSHAを照合して転送し、既存warm提供を変更せず比較を一回だけ実施した。

## 実比較と採否

同16source×通常OFF／候補ONの32実返答、全HTTP200／stop、比較loop **53.200080秒**。実tokenizer最大998 input token、切詰めなし。対象5組だけmessages／本文変化、対照11組は両方byte一致。全16で通常OFFのmessages・原文・source参照は前段baselineと一致。学習0・新load0・retry0。RTX4000 Ada／20475MiBを実読、同PID26784・server source・Analysis adapter/config不変、最終health200。レンタル総時間・請求額は未測定。

rootと独立担当が全16source・32本文を全文比較した。未記載の依頼受け手／承諾を「未決定」へ変えるNIの誤読が残る。既使用TRANSFER06では不要な未決定断定を除去できた。NEW04は自然な本人宛の言換え。NEW01は明記承諾を保持し、本人宛化・未記載の仕事内容の除去が見られる一方、本文へ不要な確認質問を追加した。**限定改善はあるが候補は通常不採用。** 不変11組にも引用話者からの渡し手発明、承諾対象の人物ずれ、受動希望の反転、意向の確定化、未記載の感情／動機追加が残る。不変を合格とせず、短い受取り・妥当な省略自体は失敗にしない。

これは既使用12＋架空新4の開発比較で、blind一般化・通常意味品質合格・AR-01完了・Mash正式受入れではない。source→bindingsの実装と入力投影は確認済みだが、receive_candidate／prepare_model_snapshot／_model_meaning_packetの汎用意味採用改修は実現していない。

## 同じ実rawの保存・再読

baseline／candidateを別processにして、全32実captureだけを現provider＋実prepare・既存service＋隔離PGliteへ一回再生。HTTP payload／messages／原source／実response／rawはcaptureと一致。baseline16＋candidate15の **31本文をFINAL保存し、同／新service GETで同一本文を再読**。NEW01の質問入りcandidate1件は既存providerが拒否し、本文不保存・再生成／retry不可・同／新serviceの拒否状態一致。existing outer strip以外の語句書換え0。USER sourceとGET前後thread/events不変、GET provider／reader／Engine／prepare実行0、実Supabase要求0。

capture／SQL参照は12一致、20は既存SQL親sourceが架空captureのuser_idを投影しないため異なる。両実参照を保持し、同一へ上書きしていない。reader31保存reportは30未判定・1有限範囲内非衝突、61節中checked1／全文coverage=false。**保存や有限reader結果を意味合格へ換算しない。** 前段292 CPU PASSは同source SHAの継承で、今回再実行して数を増やしていない。

## 保全と次の実装先

[本文なし集計](native_request_bindings_summary.json)と[同一の研究source差分](native_request_bindings_source_candidate.patch)。公開patchは不変で、API c655の正しいGit blob preimageからの両postimage再構築確認を継承する。実source／messages／32raw・全読解・tokenizer・SQL再生・native/model refsはprivateに保存：
`Cocolon_CMEE_AR01_NativeRequestBindings_Actual32_20261109.zip`、
Library ID `libfile_fde3_f-a751c8c4a7c48191982a04d6e5447557_2f7470f963808191aaebf050935e72de`、194,287bytes、SHA256 `90e9fc69fae88176f25e85ac20bc613eba11d0ff453aba2f5e81b1866595133c`。
Pod出力ZIP32,422bytes／SHA `77a5170a7b341966eb5602107909d45889815edb28f02a1b5f359d80e4bfcbb9` のCRCと原9member全bytes/hash一致。以前のprepared束は実行前の履歴として保持する。

転送承認blockerは解消、今回の32callは完了しており再起動しない。次は同じ役割ラベル／prompt追加を重ねず、既存model意味採用で「本人が未記載と述べた対象」と「まだ決めていない判断」を別命題・別対象へ束縛し、原source／未知／modalityを現natural作者へ保持する接続を実装する。有限補助が生成材料へ入ることだけを、その接続の完成へしない。新質問は現guardで拒否済みで、今回の失敗本文を自動修復・再試行しない。

primary outcomeは **BLOCKER_NARROWED**。通常API c6555fd5・通常OFF・採用falseを維持し、今回Render配置／実DB／RN／build変更0。**STRUCTURE_MAP_DELTA_NONE**：研究patchはactive APIへ適用しておらず、active作者・型・wire・保存責務は変わらない。AR-01・AR-02〜08・必要全資産活用・本人端末／正式受入れは未完了。AR-02はAR-01一般品質完成の全面待ちにはしないが、今回は未着手。

<details>
<summary>実行前の準備記録（転送承認前、履歴）</summary>

# AR-01：依頼節から役割別bindingsへの接点を準備、実4B比較は未実行

2026-11-09 JST。詳細設計§11.2とweekly§27を継承。全体現在地、全file地図01A–Cの全377基本見出しとfamily・関連差分、三中核入口、最新weekly、現API sourceを確認した。巨大な歴史追記の全意味読了や、今回未照会の本番稼働を主張しない。

## 実装した範囲

既存preparation.prepare_emlisのnative source identityと、既存finite witnessを既存emlis_semantic_admission内のpure関数へ接続。原文の肯定・過去・受動「頼む」で明記依頼者／省略受け手が読める節だけに、同一claim_refと別々のREQUESTER／RECIPIENT／ACCEPTANCE target_ref・source sliceを付ける。省略はOMITTED_IN_CLAUSE、承諾はNOT_ESTABLISHED_BY_REQUESTで、別節・別欄の記載を否定しない。本人が「不明」と述べた意味や新たな人物を作らない。原文位置照合は有限解釈後の完全性検査であり、意味採用の証明ではない。

現natural単一作者への研究opt-in投影を実装。native refと短いmodel refの対応はprivate束へ保存し、通常OFFのSYSTEM・原文・材料・参照を保持する。旧native_bindings_v2のsource／argument／unknown分離、project_direct_argument_bindingsの命題参照の考え方を限定回収したもので、旧grammarや固定作者を起動しない。

**これはsource→bindings→作者入力の接点の準備であり、receive_candidate／prepare_model_snapshot／_model_meaning_packetの汎用意味採用改修を完了したものではない。** 同じ有限reader由来の構造化補助であり、4Bが対象を正しく束縛すること、前回候補より意味品質が向上することは未実証。通常採用false、API sourceはc6555fd5のまま。

## 確認と未実行

| 項目 | 今回の事実 |
|---|---|
| 局所検証 | 292 PASS、18.02秒、既存warning1。既存250＋新20＋preparation22。初期の欠落helper／ledger復元と新test fixture import不備を直してからの最終結果 |
| 新20検査 | 二欄・明記人物・同一節3target、複数節／別sourceのref分離、別欄承諾の保持、引用／訂正／否定等の除外、過大補助の原文維持、通常OFF不変 |
| 保存 | 合成本文1件の実service＋隔離PGlite保存、同／新service GET本文一致。GETでprepare/provider禁止。実4B本文の保存試験ではない |
| 比較入力準備 | 既使用12＋架空新4、同16×OFF／ONの32callを凍結。新4も開発用でblind評価ではない。対象5材料変化／対照11不変、全16の通常OFF・原文参照不変 |
| 予算 | messages最大4771 UTF-8 bytes。実tokenizer preflight未実行で、bytesをtoken数に換算しない。計画は32call・最大240秒・学習／新load／retry0 |
| GPU | 既存Jupyter画面へ到達。ZIP uploadは自動承認レビューが送信内容／送信先の明示承認不足として拒否。転送・実call・提供変更0、別経路への回避0 |
| 公開差分 | source-only研究patch2pathを保存。c6555fd5の正しいGit blob preimageから適用し、両candidate SHA一致。公開本文に比較source／生成本文を含めない |

[研究source差分](native_request_bindings_source_candidate.patch)／[本文なし集計](native_request_bindings_summary.json)。
private prepared束は `Cocolon_CMEE_AR01_NativeRequestBindings_Prepared_20261109.zip`、
Library ID `libfile_fde3_f-4c9f1f8179c48191a307465e53f32943_2f7470f963808191aaebf050935e72de`、26,959bytes、SHA256 `149e2e38ff9f8425882e56aa90b1aa038832b32249cdb0fe22796786cc5abfc5`。
全架空source・両messages・native bindingsと投影対応・新test・比較runner・再構築手順を保存。実rawや比較結果は存在しない。公開source原本は複製せず既存commit＋研究patchを再構築先にする。

## 正確な再開点

Mashへ、準備した架空16入力・両比較messages・研究source差分／runnerを、既存 `https://f1lle4xwq3wjln-8888.proxy.runpod.net/lab` のJupyterへ転送して比較する明示承認を求める。送信承認後、同じ凍結候補の実tokenizer preflight、既存warm提供を変更しない32call比較、全source／前後本文の全文読解と独立レビュー、同実rawの保存・非生成再読へ進む。準備段階を実出力改善へ読み替えない。実品質が未達なら通常採用しない。

今回のprimary outcomeは限定TECHNICAL_CREDIT。商品品質creditは0。Render配置・実Supabase要求／変更・RN／build・通常API source変更0。**STRUCTURE_MAP_DELTA_NONE**：研究patch保管のみでactive作者・型・wire・保存責務は変えていない。AR-01・AR-02〜08・必要全資産活用・本人端末／正式受入れは未完了。AR-02をAR-01一般品質の全面完成待ちにはしないが、今回は未着手。


</details>
