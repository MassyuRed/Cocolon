# 汎用column-record carrier CPU比較 — 不採用候補

追加GPU/モデルload/forward/学習/生成なし。compare_carrier_cpu.pyは各objectの列名を15shapeへまとめ、全値をrecord配列へ明示する比較専用encoder/decoder。全2教師のJSON全値・順序をbyte完全復元、同じ既存CMEE教師outcome一致、recordの値数不一致1例の拒否を確認（列定義改変や意味的欠落全般の検証ではない）。CPU13.304903秒。

単独outputの実tokenはBOOK2911→2828（2.85％減）、SHOP3236→3141（2.94％減）。EOS/chat framingを含まない文字列同士の比較で、元学習token2913/3238や生成capとは分ける。wrapper/header負担により削減が小さく、現案を新GPU学習や通常接続へ推奨しない。モデルの能力改善・未知一般化の証明0、商品0。

source/完全comparison.json/全2carrier/全2roundtrip/cpu.logはこのfolder、全CRC/hashを確認した原本ZIP67031bytes/SHA83153407df506405e40e97e90986f1afefb48dd12f21ae9ad60485baf1543ce0。汎用比較から通常型/decoder/reader/input spec/contractへ接続していない。

次の検討は、全leaf値/明示参照名を保つ固定型の行形式等で汎用wrapperを減らす具体仕様候補。元named全値復元/同じCMEE教師結果/入力を含む実tokenを先に比較し、有効な削減がなければ採用しない。具体仕様・学習/評価/費用は未固定、実装/新GPUは未実行。新方式の有効化や契約変更をこの比較成功から自動開始しない。
