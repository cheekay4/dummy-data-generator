import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | MyReplyTone',
  description: 'MyReplyTone（AI口コミ返信ジェネレーター）の特定商取引法に基づく表記。販売事業者、販売価格、支払方法、解約方法等。',
}

export default function TokushohoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">特定商取引法に基づく表記</h1>
      <p className="text-stone-400 text-sm mb-10">最終更新: 2026年3月1日</p>

      <div className="space-y-6 text-stone-600 text-sm leading-relaxed">
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
              <a href="mailto:tools24.riku@gmail.com" className="text-amber-600 hover:text-amber-700 underline">tools24.riku@gmail.com</a>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">販売価格</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">Proプラン: 月額390円（税込）</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">支払方法</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">クレジットカード（Stripe決済）</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">支払時期</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">申込時に初回課金、以降毎月自動更新</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">サービス提供時期</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">決済完了後、即時利用可能</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">返品・キャンセル</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">デジタルサービスのため返品不可。マイページからいつでも解約可能。解約後は次の課金日をもってFreeプランに移行します。</dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-bold text-stone-800">動作環境</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">モダンブラウザ（Chrome, Safari, Firefox, Edge 最新版）</dd>
          </div>
        </dl>
      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
