export type ProductId = 'msgscore' | 'review-reply-ai';

export interface ProductConfig {
  id: ProductId;
  name: string;
  url: string;
  priceFree: string;
  pricePro: string;
  tagline: string;
  senderSignature: string;
}

export const PRODUCTS: Record<ProductId, ProductConfig> = {
  msgscore: {
    id: 'msgscore',
    name: 'MsgScore',
    url: 'https://msgscore.jp',
    priceFree: '無料（5回/日・登録不要）',
    pricePro: '月980円',
    tagline: 'メール・LINE配信文をAIが採点し、開封率・CTRの改善ポイントがわかるツール',
    senderSignature: `Riku\ntools24.riku@gmail.com\nhttps://msgscore.jp`,
  },
  'review-reply-ai': {
    id: 'review-reply-ai',
    name: 'AI口コミ返信ジェネレーター',
    url: 'https://myreplytone.com',
    priceFree: '無料（5回/日・登録後）',
    pricePro: '月390円（1日13円）',
    tagline:
      'Google マップ・食べログなどの口コミに、あなたらしいAI返信を数秒で自動生成するツール',
    senderSignature: `Riku\ntools24.riku@gmail.com\nhttps://myreplytone.com`,
  },
};

export function getProduct(productId: ProductId): ProductConfig {
  return PRODUCTS[productId];
}
