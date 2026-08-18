# 触診部位同定トレーナー（肩関節・上腕）

理学療法士・作業療法士・柔道整復師・鍼灸師の養成校学生向けの**体表解剖学習支援ツール**。
AI が演じる模擬患者への問診 → 3D 人体モデル上での触診部位の指定 → 責任筋・支配神経の解答 → 講評、という約5分のセッションで「体表のどこに・何が・どの深さで存在するか」の空間的知識を練習します。

> **本ツールが訓練するのは触診部位の空間的知識であり、指の触覚・触診技術そのものは訓練できません。**
> また本ツールは**教育用ソフトウェアであり医療機器ではありません**。診断・治療・受診判断には使用できません。症例はすべて架空です。

## セットアップ

```bash
npm install
npm run data:download   # BodyParts3D データ取得（約140MB、初回のみ）
npm run data:convert    # OBJ → GLB (Draco) 変換
npm --workspace @palpation/app run data:publish   # メッシュを public/ に配置
```

`packages/app/.env.local` に `ANTHROPIC_API_KEY` を設定（問診・講評に必要）。

## 起動

```bash
npm --workspace @palpation/app run server   # LLM API サーバー (:8787)
npm --workspace @palpation/app run dev      # UI (:5173)
```

## テスト・品質

```bash
npm test        # 78テスト（決定論性・リーク防止・原価などを保証）
npm run lint
npm run build
```

## 構成とライセンス

- `packages/anatomy-data/` — BodyParts3D 由来メッシュの変換パイプライン。**CC BY 4.0**（詳細: ATTRIBUTION.md）。形状は無改変
- `packages/app/` — アプリ本体（症例DB・採点・UI・LLM統合）。プロプライエタリ
- 設計判断の記録: `DECISIONS.md` / フェーズ0検証: `PHASE0-VERIFICATION.md`

## 重要な設計原則（仕様書より）

- 採点は決定論（L1: 座標・FMA集合 / L2: 問診カバレッジ）。LLM は講評コメントのみで、スコアに関与しない
- LLM は解剖学的事実を生成しない。事実は構造事実テーブル（`getStructureFacts`）からの引用のみ
- 患者役 LLM には症例の `public` のみを渡し、`truth`（正解）は型レベルで遮断
- 実行時モデル: 患者役 = Haiku / 講評 = Sonnet（Fable・Opus は使用しない）

## 現状の制約（レビュー前）

- 症例のランドマーク座標・用語・事実データは全件 `reviewStatus: "draft"`。**解剖学教員によるレビューが承認の前提**
- 3D 表示に神経メッシュはありません（BodyParts3D に存在しないため。神経の解答は選択式）
