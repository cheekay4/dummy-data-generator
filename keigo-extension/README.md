# 敬語メールライター Chrome拡張

Gmail・Outlook Web上でメール作成しながら、そのまま敬語変換できるChrome拡張。
[keigo-tools.vercel.app](https://keigo-tools.vercel.app) のバックエンドを利用。

## 機能

- Gmail / Outlook Web の作成ツールバーに「✉敬語」ボタンを挿入
- クリックするとShadow DOMのインラインUIが展開（シーン・相手・丁寧さを設定→変換）
- 変換結果を「本文に貼り付け」ボタンで直接挿入可能
- 無料: 3回/日（chrome.storage.localで管理）
- Pro: ライセンスキー入力で無制限（ポップアップの歯車アイコンから設定）

## ローカル開発手順

```bash
npm install
npm run generate-icons   # icons/icon16.png, icon48.png, icon128.png を生成
npm run build            # dist/ と popup/ にビルド
```

その後:
1. Chrome で `chrome://extensions` を開く
2. 右上「デベロッパーモード」を有効化
3. 「パックされていない拡張機能を読み込む」→ `keigo-extension/` フォルダを選択

ウォッチモード（変更を検知して自動ビルド）:
```bash
npm run watch
```

## Chrome Web Store 公開手順

```bash
npm run zip   # keigo-extension.zip を生成
```

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/) にアクセス
2. 「新しいアイテムを追加」→ keigo-extension.zip をアップロード
3. ストア掲載情報（説明・スクリーンショット等）を入力
4. プライバシーポリシーURL（keigo-tools.vercel.app/privacy）を設定
5. 審査提出

## keigo-tools側の要件

本拡張が動作するには keigo-tools に以下が実装済みであること:
- `/api/generate`: CORS ヘッダー（`Access-Control-Allow-Origin: *`）+ `X-License-Key` ヘッダー対応
- `/api/verify-license`: ライセンスキーのStripe検証エンドポイント

## 環境変数

拡張自体に環境変数は不要。APIエンドポイントはソースにハードコード:
```
API_BASE = 'https://keigo-tools.vercel.app'
```

## Proライセンス取得方法

1. [keigo-tools.vercel.app/pricing](https://keigo-tools.vercel.app/pricing) でProプランを購入
2. 購入後、登録メールアドレス宛にライセンスキーが送信される
3. 拡張のポップアップ → 歯車アイコン → ライセンスキーを入力して保存
4. キーを紛失した場合は [/account](https://keigo-tools.vercel.app/account) で再確認可能
