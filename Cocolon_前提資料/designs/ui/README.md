# Cocolon UI — Material方向の設計

決定日：2026-11-06 JST。決定者：Mash。設計・実装担当：華恋。

**「優しく、迷わず使えて、言葉は丁寧に読める」Material寄りのCocolon。**

**全画面を例外なく統一することはMashの確定指示。** 実装・保存は画面群ごとに区切り、全画面の仕上げと全体確認まで進める。

- [採用方針・具体設計・画面対応・実装状況](material-ui-design.md)
- [全画面・モーダル・起動／認証の対応表](material-ui-design.md#14-全画面の具体設計)
- [実装の区切り方と全体の完了条件](material-ui-design.md#15-実装の進め方と完了条件)
- [比較プレビュー：3案 × ホーム・分析・Piece・設定](previews/three-directions-four-screens.html)
- [プレビューの編集元](previews/three-directions-four-screens.source.html)
- [決定の議事録](../../weekly_reviews/Cocolon_Weekly_Review_20261031.md#material-ui-decision-20261106)

プレビューHTMLはダウンロードしてブラウザで開く。GitHubの通常のファイル画面では動作しない。上部で画面を切り替え、案の切替でMaterialを選べる。単体表示用には切替処理を同梱しているが、アイコン等はバージョン固定CDNを参照するため完全オフラインではない。アプリ本体・ログイン・DBとは接続していない。

比較時点のプレビューを変更せず保管した。入力、分析、金額、残枠、履歴、月次比較は説明用の架空データ。デモの操作成功・配色4種・ロゴ切替・設定画面の統合を、そのまま製品仕様・権限・実装済みの証拠にしない。

この資料の対象は操作画面のUI。AIの意味処理、分析の成立条件、Piece保存画像のrenderer・recipe、購入・通知・公開・削除の契約は各既存ownerに従う。

