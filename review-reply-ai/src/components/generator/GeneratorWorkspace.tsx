'use client'

import { useGeneratorStore } from '@/stores/generatorStore'
import ReviewInput from './ReviewInput'
import StarRating from './StarRating'
import PlatformSelect from './PlatformSelect'
import BusinessTypeSelect from './BusinessTypeSelect'
import ToneSelector from './ToneSelector'
import ShopProfile from './ShopProfile'
import SubmitButton from './SubmitButton'
import ReplyResults from '@/components/results/ReplyResults'

export default function GeneratorWorkspace() {
  const { step, error } = useGeneratorStore()

  return (
    <section id="generator" className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">口コミ返信を生成する</h2>
          <p className="text-stone-500 text-sm">口コミを貼り付けて、業種とトーンを選ぶだけ</p>
        </div>

        {step === 'result' ? (
          <ReplyResults />
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <ReviewInput />
            <StarRating />

            <div className="grid sm:grid-cols-2 gap-4">
              <PlatformSelect />
              <div /> {/* spacer */}
            </div>

            <BusinessTypeSelect />
            <ToneSelector />
            <ShopProfile />

            <div className="border-t border-stone-100 pt-4">
              <SubmitButton />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
