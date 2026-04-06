export interface MermaidTemplate {
  id: string;
  label: string;
  code: string;
}

export const TEMPLATES: MermaidTemplate[] = [
  {
    id: "flowchart",
    label: "フローチャート",
    code: `graph TD
  A([注文受付]) --> B{在庫確認}
  B -- あり --> C[決済処理]
  B -- なし --> D[入荷待ちメール送信]
  C --> E{決済成功?}
  E -- はい --> F[発送準備]
  E -- いいえ --> G[エラー通知]
  F --> H([完了])`,
  },
  {
    id: "sequence",
    label: "シーケンス図",
    code: `sequenceDiagram
  actor ユーザー
  participant サーバー
  participant DB

  ユーザー->>サーバー: ログインリクエスト
  サーバー->>DB: ユーザー情報取得
  DB-->>サーバー: ユーザーデータ
  サーバー-->>ユーザー: 認証トークン発行`,
  },
  {
    id: "er",
    label: "ER図",
    code: `erDiagram
  USERS {
    int id PK
    string name
    string email
  }
  ORDERS {
    int id PK
    int user_id FK
    date order_date
    int total
  }
  USERS ||--o{ ORDERS : "注文する"`,
  },
  {
    id: "gantt",
    label: "ガントチャート",
    code: `gantt
  title プロジェクトスケジュール
  dateFormat YYYY-MM-DD
  section 設計
    要件定義     :a1, 2026-04-01, 5d
    UI設計       :a2, after a1, 3d
  section 開発
    フロントエンド :b1, after a2, 7d
    バックエンド   :b2, after a2, 7d
  section テスト
    結合テスト    :c1, after b1, 3d
    リリース      :milestone, after c1, 0d`,
  },
  {
    id: "class",
    label: "クラス図",
    code: `classDiagram
  class Animal {
    +String name
    +int age
    +makeSound() void
  }
  class Dog {
    +fetch() void
  }
  class Cat {
    +purr() void
  }
  Animal <|-- Dog
  Animal <|-- Cat`,
  },
];
