# 帰属表示（ATTRIBUTION）

本パッケージは以下のデータに由来する:

- **BodyParts3D**, The Database Center for Life Science (DBCLS)
  - ライセンス: CC Attribution 4.0 International（配布元ライセンスページ 2025-02-25 更新版で確認。
    旧版データファイル内のヘッダには旧ライセンス CC-BY-SA 2.1 Japan の表記が残存するが、
    現行の配布条件は https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html に従う）
  - 出典: Mitsuhashi N, et al. BodyParts3D: 3D structure database for anatomical concepts.
    Nucleic Acids Res. 2009;37:D782-5. doi:10.1093/nar/gkn613
  - 取得元: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/（Release 4.0, obj_99）

## 加工内容

- OBJ → glTF/GLB へのフォーマット変換、および Draco 圧縮のみ
- **メッシュ形状の改変（retopology・分割・統合・スムージング等）は一切行っていない**
- 座標系は元データのまま（Z-up・mm・全構造共通ワールド座標）

## 構造ごとの由来

構造ごとの由来・FMA ID・元ファイル対応は `structures.json` の `attribution` フィールド、
および変換後の `dist/manifest.json` を参照。

## 用語データについて

日本語・英語・ラテン語の用語対応は本パッケージには含まれない
（アプリ側で Wikidata（CC0）由来の用語テーブルを管理する）。
