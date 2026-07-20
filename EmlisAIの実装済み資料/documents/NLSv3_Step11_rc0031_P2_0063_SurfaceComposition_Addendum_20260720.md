# NLSv3 Step11 rc0031 P2 0063 共通Surface composition改訂補遺

- 作成日: 2026-07-20
- 対象: Revised Cycle / Step11 / Cycle001 / rc0031 / P2
- 状態: Mash明示承認済みの設計補遺・RED先行検証
- 本文取扱い: body-free。入力本文、候補本文、可視出力本文を記録しない

## 1. 目的

P2を未完成のままfreezeせず、`0063`を `S=10 / R=1 / exact reuse=0` のまま、既存resource `4 / 2 / 4 / 2` 内で通せる共通Surface compositionを定義する。

この改訂は意味を落とすための圧縮ではない。複数のtyped semantic atomが同じownerを介して一つの命題を構成する場合に限り、atomごとの独立した意味責任を残したまま、共通の主語・対象・関係endpointを共有して自然な文法単位へ合成する。

## 2. 確認した事実

1. `0063`のforward authorityは、construction 6件、relation 4件、semantic link 0件、explicit unknown 0件であり、`S=10`である。
2. required Receptionは1件であり、`R=1`である。
3. 現在のbody-only独立確認で認められるexact reuseは0件である。
4. 既存P2 packerはatom数をそのままvisible clause数として扱うため、2件までのpackしか作れず、公開candidate collectionは `STEP11_RC0031_NO_VALID_FORWARD_CANDIDATE` で閉じる。
5. `0063`の第2 base candidateは、body-free resource上、observation groupが3つ、各groupの既存unit数が2件である。したがって、各groupに最大2件、全体で最大6件の追加composition unitを置ける。
6. `0063`のowner graphは5 ownerを4 relationが結ぶ連結経路である。constructionのowner分布は `1 / 1 / 1 / 1 / 2` である。
7. construction owner分布には同一ownerの2件が含まれる。そのownerをendpointに持つnon-construction headは1件だけであるため、source ownerと修飾対象ownerの一致、および1 head内の修飾対象owner一意性を守ると4 compositionにはできない。
8. 全合法unitをbody-freeでexact-coverした最小値は5である。正本witnessのatom数は `2 / 2 / 2 / 3 / 1`、3 groupへの追加unit数は `2 / 1 / 2`、既存unit込みでは `4 / 3 / 4` である。
9. compact compositionはatom数が3でもvisible clause 1、independent compositionは最大2 atom・最大2 visible clauseである。complexityはatom数、distinct owner数、visible clause数の最大値であり、最終resource peakは `4 / 2 / 4 / 1` である。
10. 先行RED nodeは24-node collectionの1 nodeを置換しており、collection denominatorは24のままである。

## 3. 推測

1. 既存P2の失敗原因は意味量そのものではなく、`1 atom = 1 visible clause` とした実現単位の置き方にある。
2. constructionとnon-construction headが同じendpoint ownerを共有するとき、constructionをそのendpointの非終止名詞句modifierとし、headだけを有限述語にすることで、意味atomを落とさずvisible clause 1へ合成できる。
3. 第1 base candidateを無理に通す必要はない。公開collectionが第2 base candidateから少なくとも1件の正当なcandidateを作れれば、既存の複数base候補からfail-closedで選ぶ契約を維持できる。

## 4. 華恋の意見

この改訂を認める条件は、表示上短く見えることではなく、10 atomが全て一度だけ本文責任へ結び付いていることだと考える。resource値だけを小さく自己申告する実装、非連結atomを一つに詰める実装、P3の未証明reuseへ逃がす実装は採用しない。

また、第1 base candidateまで通すためにresourceを広げる必要はない。現行契約内で成立する第2 base candidateを公開candidateとして残す方が、P2の役割とfail-closed境界に整合する。

## 5. Authorityと変更境界

### 5.1 入力authority

- rc0031 P1 fixtureとそのbody-free denominator
- rc0027 base candidateのfreeze済みAST・Surface realization plan
- grounded lexical successorとrc0028 typed lexical atom specs
- rc0031 experiment Surface catalogの単一fragment authority
- required Reception opportunity

### 5.2 変更してよい範囲

- rc0031 P2のforward planner、typed AST composition、canonical renderer、candidate revalidation
- rc0031 P2 mutation test内の`0063` RED契約
- このbody-free設計補遺

### 5.3 変更禁止

- P1 fixture
- P1のclosed code、control、attack
- production runtime接続
- P3 Parser / Independent Matcher
- exact reuse authority
- resource `4 / 2 / 4 / 2`
- catalog denominatorおよびrealization alternative数
- freeze済みpredecessor bytes
- case ID、control ID、review familyを使う分岐

P2 sourceには将来のcomposition境界名だけをplaceholderとして残せるが、P3 Parser / Independent Matcherとreuse authorityは実装しない。public/privateのいずれでも、shape-validなnon-empty reuseは `STEP11_RC0031_P3_EXACT_REUSE_NOT_AVAILABLE`、malformed envelopeは `STEP11_RC0031_VERIFIED_REUSE_COMPOSITION_INVALID` で必ず拒否する。

## 6. 共通composition algorithm

### 6.1 Atom graph

1. typed semantic atomをnodeとする。
2. construction nodeはその単一source ownerへ接続し、修飾できるのは同じownerをendpointに持つheadだけとする。
3. relation nodeはdirectionを保持したfrom/to ownerへ接続する。
4. composition内の全nodeは、共有ownerを介して一つの連結成分でなければならない。
5. relationのtype、direction、endpointは合成後も変更しない。

### 6.2 決定的partition

1. atomをsource authority順、semantic family順、stable atom ID順で固定する。
2. `construction_modified_head`はnon-construction headを正確に1件、construction modifierを1〜2件持つ。modifierのsource ownerはhead endpoint内にあり、同じhead内の修飾対象ownerは相互に異ならなければならない。
3. compactの`source_atom_ids`はmodifier authority順の後にhead IDを置き、最大3 atomとする。
4. `independent_clauses`はowner接続した最大2 atomとし、head IDとmodifier列を持たない。
5. 各unitのowner-ready groupは、その全ownerの導入group ordinalの最大値とする。割当groupはowner-ready未満へ戻さず、そこから後方でresourceを満たす最初のgroupへ決定的に遅延できる。
6. source順の早いheadが後続headの唯一のmodifierを奪わないよう、各headへowner一致modifierを最大1件ずつ先に配る。その後だけ、未使用の別endpoint modifierを2件目として配る。
7. group unit、visible clause、complexity、repeated joinerを追加のたびに実数で再計算する。
8. complexityは`max(atom数, distinct owner数, visible clause数)`とする。
9. 全atomを一度だけ割り当てられないbase candidateはfail-closeし、次のbase candidateを評価する。

### 6.3 Surface composition

1. catalogのpredicate fragmentとlexical referent以外から意味語を発明しない。
2. 13 construction fragmentは有限述語ではなく、exact endpoint referentの後ろへ一意に付ける非終止の名詞句suffixとする。
3. compactではdecorated endpointをrelation / semantic link / explicit unknown headの既存patternへ代入する。追加clause joinerは使わず、head 1件をvisible clause 1とする。
4. headと組にならないconstructionは、decorated endpointへ固定suffix `があります` を付けて独立clauseにする。
5. composition内の各atom ID、family、semantic key、direction、atom別owner列、mode、head、modifier、修飾対象owner、owner-ready groupをASTへ保持する。
6. independent compositionだけが既存within-sentence joinerを使い、2 atomの場合の反復は1とする。compact内部のjoiner反復は0である。
7. catalogへcomposition専用semantic keyや複数表現を追加しない。semantic key当たりのrealization alternativeは1のままとする。

## 7. Resourceの独立再計算

plannerのpeak自己申告はauthorityにしない。validatorとtestが次を別に再計算し、planの報告値と完全一致させる。

1. group unit数: 既存observation unit数 + composition unit数
2. grammatical visible clause数: 実際にrenderされた有限述語単位
3. grammatical complexity: 既存unit weight + `max(composition atom数, distinct owner数, visible clause数)`
4. repeated joiner: baseとcomposition内部に実際に現れる同一joinerの反復数
5. Reception complexity: target owner数 + support owner数

最終peakは順に `<= 4 / <= 2 / <= 4 / <= 2` でなければならない。

## 8. RED先行契約

同一のP2 mutation test nodeで、次を固定する。

1. base candidate denominatorは2。
2. 公開candidate collectionが少なくとも1件を返す。
3. `S=10`: construction 6、relation 4、その他0。
4. `R=1`。
5. exact reuseはplan・rendered countとも0。
6. 10 atomが重複なくexactly onceでclause bindingとchunk assignmentへ現れる。
7. 各compositionのatom owner graphが連結し、atom別owner列とcomposition owner集合がauthorityから再導出した値に一致する。
8. 少なくとも一つのcompositionで、atom数がvisible clause数より多いことを確認する。
9. exact 5-unit witnessとして、group別atom数が `2,2 / 2 / 3,1`、追加unit数が `2 / 1 / 2`、既存込みunit数が `4 / 3 / 4` であることを確認する。
10. resourceをbase planとcompositionから独立再計算し、報告peak `4 / 2 / 4 / 1`および上限`4 / 2 / 4 / 2`と一致させる。
11. atom別owner列を偽るfusion mutationと、peakを偽るresource mutationをpublic validatorが拒否する。

先行結果は意図したREDであり、exact failure codeは `STEP11_RC0031_NO_VALID_FORWARD_CANDIDATE` である。

## 9. 実装受入条件

1. 上記RED nodeがGREENになる。
2. P2全24 nodeがGREENになる。
3. P1 exact7が同じ `1 PASS / 6 intentional RED` で再freezeできる。
4. P1 fixture、closed code、control、attack、resource、denominatorのhash・件数にdriftがない。
5. frozen predecessor prefixとpredecessor behaviorにdriftがない。
6. `0063`のcandidateをpublic builderから生成・再生成・再検証できる。
7. false fusion、atom重複・欠落、relation endpoint/direction変更、resource過少申告がfail-closeする。
8. P3 Parser / Independent Matcher、reuse authority、import、runtime接続を開始していない。P2-owned placeholderもnon-empty reuseを全て拒否する。

## 10. Rollback / STOP条件

次のいずれかが起きた場合はP2をfreezeせず、composition変更を戻してSTOPする。

- 10 atomの一つでも欠落・重複する
- owner非連結のfusionが必要になる
- relation type、direction、endpointを変える必要がある
- exact reuseを1以上にする必要がある
- resourceまたはdenominatorの拡張が必要になる
- catalogへcase専用fragment、複数alternative、`0063`識別分岐が必要になる
- rendererの実形ではなくmetadata自己申告だけでresourceを通す
- P1、control、attack、predecessorへ回帰が出る

STOP時は未完成コードをfreezeせず、GitHub反映用ZIPを作成しない。
