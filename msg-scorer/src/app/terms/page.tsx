import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'MsgScore の利用規約です。',
  alternates: { canonical: 'https://msgscore.jp/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-16 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto prose prose-stone">
        <h1 className="font-outfit font-bold text-3xl text-stone-900 mb-8">利用規約</h1>
        <p className="text-stone-500 text-sm mb-8">最終更新日: 2025年6月1日</p>
        <p className="text-stone-600">
          本利用規約は、MsgScore（以下「本サービス」）のご利用条件を定めるものです。
          詳細な規約は準備中です。ご不明な点はお問い合わせください。
        </p>
      </div>
    </main>
  );
}
