> **2026-10-30最終：** Mashの「『4B学習＋CMEE接続』を続けて。」に基づき、この限定案を新しい一回として実施。CPU全通過後の非学習2生成は両TOKEN_LIMIT、意味/本人本文0/2・不採用閉鎖。[実結果・原本](syntax2b_result_20261030/README.md)。再実行/次runの承認はない。以下は92a83d97の承認前提案本文の履歴で、「未承認・未実装」は当時の状態。

# 追加token12個のbyte対応修正 — 新しい一回の提案

2026-10-30 JST。status=PROPOSED_NOT_APPROVED。今回の[CPU停止](cpu_stop_20261030/README.md)は閉鎖済み。以下はその再起動ではなく、新しい一回の限定提案で、実装・CPU再実行・GPU処理は未着手。

目的は元の構文支援案と同じ。追加学習せず、既存構文・型だけを支えた4BがBOOK/SHOPの意味と本人本文を自律生成し、既存CMEEの採用・同一保存再読へ達するかを確かめる。構文成功を意味・本文成功へ換算しない。現在の停止は華恋のtokenizer対応不足で、追加観測会を必要とする根拠ではない。修正しない場合はCPU未通過のためGPUへ進めない。

## 最小修正とCPU条件

既存syntax2.pyのtoken→byte対応とそのCPU検査だけを修正する。BPE vocabの既存ByteLevel逆変換は維持し、非special追加ID248058〜248069の12個を実tokenizer/ByteLevel decoderに従って扱う。runnerは新しい出力先・source hash・syntax2b.py/plan2b.jsonへのファイル参照の同期だけ。旧plan.json/syntax2.pyを読む経路を残さない。新dependency/service/receiver/意味型/prompt/正解値/学習は追加しない。

1. 12個のID/content/special/normalized/lstrip/rstrip/single_wordを実metadataに照合する。全てfalseという前回値を無条件に信用しない。
2. ByteLevel逆変換と実decoderの実装規則から、追加token単独・連結時の正確なbytesを確定する。実decoderが返すUnicode文字列からbytesを復元しない。ByteLevelの全256byte tokenをそれぞれ前後に連結した列で、その確定bytesをdecoderのUTF8規則で文字列化した結果と、実decoder出力が一致することを確認する。不完全UTF8でU+FFFDが生じても、それを元bytesの証拠にはしない。正確な連結bytesを確定する根拠が成立しなければ中止する。
3. tokenをspecial扱いして除外したり、先頭空白・padding・Unicode replacementで埋めない。JSON文字列内の通常文字列として許されるmarkerは拒否せず、JSON構文外ではparserに従って拒否する。特殊tokenは引き続き完全root後のEOSだけ許す。
4. 元のCPU全条件を省略せず実行する。元教師全token prefix、Unicode/escape/境界/複数記号、EOS、教師外の型適合変異、保存rawの最初不正token、同metadataのCMEE教師正対照と意味誤り負対照、installed LogitsProcessor、構築/全CPU/mask速度を確認する。

CPU構築60秒・一式300秒以内、実測平均mask×各capが20秒以内の見込みという元条件を維持。失敗・未確認ならGPU0で終了。旧syntax2のsourceと失敗原本は上書きせず、新sourceは同directoryのsyntax2b.py/run_syntax2b.py/plan2b.jsonへ分離する。新Jupyter rootはpack=/workspace/cocolon_syntax2b_pack_20261030、CPU=/workspace/cocolon_syntax2b_cpu_20261030、GPU=/workspace/cocolon_syntax2b_run_20261030。旧root/lock/reportを再利用しない。書込前にfresh head・対象不存在を確認する。

## CPU全通過時だけの一回

保存114466411f36f0eef7a2dceaec7f5190544ac8545eb6b2f6a3d0446b70f90b66と固定base851bf6e8、元eval_inputs11先頭2件の完全同一promptを使う。非学習1load・0更新・BOOK/SHOP各1生成、旧9再生成0。context8192、caps3712/3584、各180秒、全process590秒＋kill10秒=最大600秒。GPU処理按分最大$0.047（同Podの履歴$0.28/h、live単価再照会なし）。CPU準備・親外CMEE・回収・保持・保存・通信・税等は別。追加cap/期限/生成/再試行/fallback/repair/次runは0。

未修復raw/token IDs/finish/EOSを既存receiver/CMEEへ渡し、receipt replayと、成立した全snapshotだけ別process保存再読で全outcome一致を確認する。rootが両raw・成立した全本人本文・引用/意味/更新/参照を原材料と照合する。両意味/本人本文/coldが2/2でも既知FITの限定結果で、一般品質・商品採用とはしない。

同Pod vgkm402msgroiuへJupyter直接接続。GPUはMashの停止指示まで保持し、管理console/API・Stop/restart/delete0。source/入力/重み不一致、byte照合不成立、空mask、OOM、非有限値、各/全期限、CPU条件未達は中止。条件を弱めず、一回を閉じる。商品0/正式0/3/54.50％、candidate_ready=false、automatic_progression=false。

## 新しい承認が必要な理由

元の承認は「CPU不成立時はGPUを実行せず終了」「一回、retryなし」。今回exit1で終えているため、内部修正だけを理由に再承認を求めるのではなく、閉鎖後の新しいCPUと条件付きGPU一回を承認対象にする。[Rule18 §11.3](../../../../../../work_attitude_rules_for_karen/18_chat_work_environment_selection_rule_2026_08_06.txt)のstanding delegation外には `closed or consumed single-use authorityのreuse / retry / reactivation / repair` が明記されている。旧承認を再利用しない。

同じprompt小修正、cap増加、追加学習は今回のtokenizer実装不足を直さない。最小の追加token対応と元のCPU全条件を保つこの一案を推奨する。未承認のため実行しない。root単一writer/executor/judge、補助read-only。正式Pro/Ultra/human共同承認済みとは称さない。
