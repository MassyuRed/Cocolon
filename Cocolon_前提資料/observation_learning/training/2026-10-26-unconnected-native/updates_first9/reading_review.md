# 更新先行の実raw全文読解 — 2026-10-28

rootが原source・採用済みprior・凍結教師・新raw2件を全文照合し、別文脈read-only補助がBOOK/SHOPを分担確認した。正式Pro/Ultra/human受入れを代替せず、raw補修0。BOOKの実採否と、SHOP打切り前の静的欠陥を区別する。

| 項目 | BOOK | SHOP |
|---|---|---|
| prompt/completion | 4387/2698 | 4539/3584 |
| 秒/終了 | 118.991914/EOSあり・stop | 161.899000/EOSなし・length |
| 原出力 | 完結JSON、重複object keyなし | observation文字列途中で打切り |
| q/claim/relation/updates | 11/10/7/7 | 15/11/6/8（静的完結部分） |
| qの指定source/field一意完全一致 | 11/11（同位置の別ID重複あり） | 14/15 |
| 日本語本文欄 | observation/reception/update_noteの3欄あり | observation未閉鎖、残る2欄未到達 |
| 実receiver→admission | CANDIDATE_UNREVIEWED→REJECT/model_evidence_collection_invalid | TOKEN_LIMIT→REJECT/semantic_receipt_not_validated |

位置一致や配列数を意味・本文成功にしない。意味/本文0/2・採用snapshot0、cold対象なし。新3e72b65bは通常不採用。

## BOOK

元入力は本の返却遅延と謝罪、友人の「大丈夫」と残る気がかり。回答は自分から週末返却を言っていたのに、遅れると分かった時点で連絡しなかったこと、本は返したが一言伝えておけばという思いがまだ気になる、という説明。

平坦root/s0/s1/p0は正しく、元4claimの本文・軸は保持。今回はupdates7と本人本文3欄まで完結し、前回ur metadata463反復は消失した。一方q.no_contact/q.late_awareness/q.answer_explains_targetの3IDが同じ「遅くなると分かった時点」（回答scalar21..32）へ重なる。実decoded evidence11行/一意9行で、未変更readerのemlis_semantic_admission.py::_model_v3_packet（1225〜1226の同一根拠行禁止）で実REJECTした。q.idが一意でも原根拠行が一意であることを意味しない。重複除去でrawを補修しない。

- self_statementは回答一文全体をREPORTED_STATEMENTへ割り当て、発言/認知/無連絡を分離できていない。
- no_contactは無連絡の句ではなく時点句をNEGATED EVENTへ誤対応。無連絡は長いself_statement内にあるが専用意味へ保持できていない。
- returnedは正しい「本は返した」へ改善。counterfactualも正句/COUNTERFACTUAL_APPRAISALへ改善したが、ANSWER_TIMEではなく過去一般。continuing_concernは正句/ANSWER_TIME、late_awarenessは時点句を本体にする。
- action_linkの根拠は無関係な回答一文。memo_link/returned_concession/concern_contentは接続scope不足。awareness_timeは反実句を根拠へ誤用。answer_explains_targetはremaining_concern→no_contactではなくno_contact→no_contactの自己辺。

ADD6→INVALIDATE_GAP1、全prior=@p0/target=UNKNOWN・missing_explanation、一意$id→ur7参照は実在する。しかしADD順はself→no_contact→returned→counterfactual→continuing→lateで、教師のself→late→no_contact→returned→counterfactual→continuingと異なる。replaceがclaimのみで、no_contactの附属3relationとcontinuingの附属2relationを欠く。GAP根拠も時点の断片。意味の全7更新成立ではない。

本文3欄は原入力/回答断片の列挙・復唱である。receptionは「…本は返した、一言…まだ気になっています、遅くなると分かった時点。」、update_noteもほぼ同じ列挙。本人向けの自然な受け取りや、説明追加で何が分かったかの応答にならない。reception/update_noteのcrへrelation ID answer_explains_targetを混入し、rrのstatement_concessionも重複。BOOKの完結を商品品質成功へ換算しない。

## SHOP

元入力は昔からの友人の開店へ祝いのメッセージを送り、うれしい一方で少し置いていかれた気がした記録。回答は昔二人で店の話をしたが、共同準備・約束はないこと、友人側では二人で話した未来が現実になったという本人知覚、喜びと当時から少し離れたような寂しさである。

旧4claimの本文・軸を保持し、11claim一意で前回のfelt_distance重複や後半roleずれは改善。新7roleとupdates8まで到達する。q.answer_concessionだけは原入力memoの「うれしかったけど、少し置いていかれた気がした」を回答sourceへ誤帰属し、指定source/field一致は14/15。

perceived_realization/felt_distanceはPERSON_PERCEPTIONと開店時exprを保つが、time.evが時点句でなく自身の句。answer_joyは「うれしいのに」で時点句なし、sadnessも時点句なし。両NEGATEDの根拠も共有否定文全体ではなく各部分句。

relations6には新出力qにないprior_q4/q5/q0を流用。answer_concession.fromはanswer_joyではなくopening_known、answer_explains_target.fromはfelt_left_behindではなくanswer_joy。scopeも不足する。

更新8は7ADD→INVALIDATE_GAP、8一意$id、全target/priorは対応する。しかしperceived_realization/felt_distance/answer_sadnessの3ADDで附属relationと根拠が欠け、GAP.evは距離句でなく時点句。prose.binds3で前回14binding反復は消えたが、rrへupdate IDを誤用し、update_note.crへrelation ID、urへ未定義answer_explains_target_addを入れている。

observationは「そのように」249回（冒頭2文の各1回＋反復部247回）を出力し、文字列途中で打切り。reception/update_noteの日本語欄は0。本人知覚の留保を落とす文もある。これらは静的読解であり、実semantic readerが各項目を判定したとはしない。実receiverは長さ優先TOKEN_LIMITである。

## 判定と次の候補

新3e72b65bは通常不採用、原284f/d431/旧候補を保持。今回の順序変更＋同一範囲学習で実更新7/8へ進み、BOOKは完結したが、順序変更単独の因果実証でも一般能力の改善証明でもない。primary=BLOCKER_NARROWED、商品0/正式0/3/54.50％据置。

次に扱うべき箇所は既存教師の原根拠共有/role対応、関係を含む全更新と参照namespace、本人本文の復唱/反復である。q.idの一意性と原根拠の一意性を混同せず、教師に存在する対応を実4Bが出せる学習設計へ戻る。追加観測会が必要な教材不足は今回確認していない。未承認のreader緩和・raw重複除去・上限延長・同条件GPU反復へ進めない。この一回は閉鎖、次run自動開始false。
