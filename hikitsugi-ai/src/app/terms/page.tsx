import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '利用規約 | 引き継ぎAI',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[22px] font-bold text-neutral-900 mb-8">利用規約</h1>
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6 text-[14px] text-neutral-600 leading-[1.85]">
          <p>引き継ぎAI（以下「本サービス」）をご利用いただく前に、以下の利用規約をお読みください。</p>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">第1条（利用資格）</h2>
            <p>本サービスは、適法に事業を営む個人・法人が利用できます。未成年者が利用する場合は保護者の同意が必要です。</p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">第2条（禁止事項）</h2>
            <p>以下の行為を禁止します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>法令または公序良俗に反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーに不利益を与える行為</li>
              <li>第三者の著作権・個人情報を侵害する行為</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">第3条（免責事項）</h2>
            <p>本サービスが生成するコンテンツの正確性・完全性について保証しません。生成されたマニュアルの利用は自己責任でお願いします。</p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">第4条（サービスの変更・終了）</h2>
            <p>当サービスは、予告なくサービス内容の変更・終了を行う場合があります。</p>
          </div>

          <p className="text-[12px] text-neutral-400">最終更新: 2026年3月</p>
        </div>
      </div>
    </div>
  )
}
