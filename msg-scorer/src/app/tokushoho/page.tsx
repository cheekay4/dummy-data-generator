import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | MsgScore',
  description: 'MsgScore（AIメール・LINE配信文スコアリング）の特定商取引法に基づく表記。販売事業者、販売価格、支払方法、解約方法等。',
  alternates: { canonical: 'https://msgscore.jp/tokushoho' },
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen pt-16 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-outfit font-bold text-2xl text-stone-900 mb-2">特定商取引法に基づく表記</h1>
        <p className="text-stone-400 text-sm mb-10">最終更新: 2026年3月2日</p>

        <div className="text-stone-600 text-sm leading-relaxed">
          <dl className="divide-y divide-stone-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">事業者名（屋号）</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">tools24</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">運営責任者</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">請求があった場合に遅滞なく開示します</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">所在地</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">請求があった場合に遅滞なく開示します</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">電話番号</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">請求があった場合に遅滞なく開示します</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">メールアドレス</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <a href="mailto:tools24.riku@gmail.com" className="text-indigo-600 hover:text-indigo-700 underline">tools24.riku@gmail.com</a>
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">販売価格</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                Freeプラン: 無料（1日5回まで）<br />
                Proプラン: 月額980円（税込）<br />
                Team Sプラン: 月額4,980円（税込 / 5名まで）<br />
                Team Mプラン: 月額8,980円（税込 / 10名まで）<br />
                Team Lプラン: 月額19,800円（税込 / 30名まで）<br />
                Team Proプラン: 月額39,800円（税込 / 30名まで）
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">商品代金以外の必要料金</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">なし（インターネット接続に必要な通信費はお客様のご負担となります）</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">支払方法</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">クレジットカード（Stripe決済）</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">支払時期</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">お申込み時にクレジットカードへ即時課金。以降、毎月同日に自動更新されます。</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">サービス提供時期</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">決済完了後、即時ご利用いただけます。</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">返品・交換・キャンセルについて</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                デジタルサービスの性質上、返品・交換はお受けしておりません。<br />
                サブスクリプションの解約はマイページからいつでも可能です。解約後は現在の課金期間の終了日まで有料プランの機能をご利用いただけ、その後Freeプランに移行します。<br />
                サービスの不具合によりご利用いただけなかった場合は、<a href="mailto:tools24.riku@gmail.com" className="text-indigo-600 hover:text-indigo-700 underline">tools24.riku@gmail.com</a> までご連絡ください。状況を確認のうえ、返金等の対応をいたします。
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="font-bold text-stone-800">動作環境</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">モダンブラウザ（Chrome, Safari, Firefox, Edge 最新版）。スマートフォン・タブレット対応。</dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">← トップページに戻る</Link>
        </div>
      </div>
    </main>
  );
}
