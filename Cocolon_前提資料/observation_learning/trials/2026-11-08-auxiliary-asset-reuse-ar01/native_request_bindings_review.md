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
