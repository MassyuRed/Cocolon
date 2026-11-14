# 全文字Unicode位置提示：保存32更新adapterの非学習FIT2

**結果：意味採用0/2、本文0/2。** 2件ともJSON/stopだが、入力投影で改善したとは判定できない。追加学習0、raw補修0、GPU停止0。

source Cocolon `5c26c06f6862993f191fc51c40f8c162dc27074b`、API `a3e82f0e2156f9142ca37878425eb0a4b6046761`。Qwen3.5-4B固定revision、保存adapter `ce644a5ba57dfcb9c8df047000cf45ba9ab32c1d09321d8a8da0f5a73fd6b0f4`、同A4500。元の公開済み架空chair2入力と保存prior、教師本文は不変。全原文の各文字を[start,end,char]へ機械表示し、意味型/参照/訂正根拠/本文sectionの説明を既存consumerへ合わせた。採用条件は変更していない。

| 項目 | 実結果 |
|---|---|
| process | 212.4523757994175秒、モデル2呼出、更新/optimizer0 |
| 初回 | input1995 / output1783、stop/JSON。evidence0/9有効、全start/endが文字列、8claim全kindが時点型。不必要なguidance/joint/reuseが初回へ混入 |
| 訂正後 | input5018 / output1968、stop/JSON。evidence9/11が原文slice一致（原根拠の重複2を含む）、補足2根拠は不一致 |
| CMEE | 両方INVALID_EVIDENCE、意味/本文0/2、same saved priorの固定FITで動的一往復ではない |
| 重み | trainable0、32tensor有限、元adapter3file hash前後一致、新重み生成なし |
| 回収 | archive全13memberのsize/hashをPod外照合、raw/script/plan/dataが固定sourceと一致 |

訂正宣言は句点込み0..22で原文sliceには合うが、意味側が求めるanchorは末尾句点を含まないため、この一致だけで意味を採用できない。訂正後には旧solo/unknownが残り、共同修理/再使用のclaim index11/12、relation13/14/15、update_refs10/11/12/14が配列範囲外。必要3更新に対して説明用target_kindを直写した1件だけ。relation IDがclaim_refsへ混入し、受け取りは原文の復唱/反復に留まる。全rawを独立2agentとrootが確認し、Mashへこの低品質本文のreviewは求めない。

前32更新後の入力は1409/3526tokenだった。今回の1995/5018tokenへの入力変更は学習に未使用なので、この比較だけでは文字位置表の不適合と新入力への未適合を分離できない。次は同messages/同targetを固定しce644から新optimizer32update一回、beforeは本raw2をbyte再利用、after2のみを生成する。追加prompt変更/旧計画再開/失敗後の自動増量はしない。一般入力・三中核・商品受入れではなく、既知2例の適合試験に限定する。

archive SHA256 `8e776b7f0169af1b9b24467419b336299e30bc1519f73472e630a0e8bb8cb215`。最初の照合は画面のhash末尾の転記を誤って停止した。Pod上でhashを前後32桁に分けて再読し、受領済み同archiveと完全一致を確認。再download/再生成は0。別のCPU provenance確認初稿もfictitious flagのnestを誤ってKeyErrorで止まったが、実際のtop-level flagと原OBSの架空明記・同native/prior/system/targetを再確認した。私的本人DB/diary/credentialの取得・送信0。

全状態/最新weekly§31/観測入口/学習pack/mapと同じ単位で更新。STRUCTURE_MAP_DELTA_NONE、正式0/3・54.50％据置。GPUを停止/再起動/削除せず保持する。表示$0.26/hの本process按分約$0.015344は、準備/回収/継続保持/税等を含む請求総額ではない。
