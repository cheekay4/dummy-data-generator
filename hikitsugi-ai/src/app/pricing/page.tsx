import type { Metadata } from 'next'
import PricingSection from '@/components/landing/PricingSection'

export const metadata: Metadata = {
  title: '料金プラン | 引き継ぎAI',
  description: '引き継ぎAIの料金プラン。無料プランで3件まで作成できます。Proプランは月額1,980円で無制限。',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-8">
      <div className="max-w-xl mx-auto px-4 pb-4">
        <h1 className="text-[20px] font-bold text-neutral-900 text-center mb-2">料金プラン</h1>
        <p className="text-[13px] text-neutral-500 text-center mb-0">いつでも解約できます</p>
      </div>
      <PricingSection />
    </div>
  )
}
