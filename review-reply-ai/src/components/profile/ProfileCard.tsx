'use client'

import { mapToDISC, DISC_LABELS } from '@/lib/constants'
import PersonalityRadar from './PersonalityRadar'
import type { ReplyProfile } from '@/lib/types'

interface Props {
  profile: ReplyProfile
  onEdit: () => void
  onDelete: () => void
}

export default function ProfileCard({ profile, onEdit, onDelete }: Props) {
  const disc = profile.disc_type ?? mapToDISC({
    agreeableness: profile.agreeableness,
    extraversion: profile.extraversion,
    conscientiousness: profile.conscientiousness,
    openness: profile.openness,
  })
  const discLabel = DISC_LABELS[disc]

  return (
    <div className="border border-stone-200 rounded-2xl p-5 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-stone-800">{profile.profile_name}</h3>
          <p className="text-xs text-amber-600 mt-0.5">{discLabel.name.split('（')[0]}</p>
        </div>
        {profile.is_default && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            デフォルト
          </span>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <PersonalityRadar
          agreeableness={profile.agreeableness}
          extraversion={profile.extraversion}
          conscientiousness={profile.conscientiousness}
          openness={profile.openness}
          size={140}
        />
      </div>

      <div className="space-y-1 text-xs text-stone-500 mb-4">
        {profile.business_type && <p>業種: {profile.business_type}</p>}
        {profile.shop_name && <p>店名: {profile.shop_name}</p>}
        {profile.speaking_style && (
          <p className="line-clamp-1">クセ: {profile.speaking_style}</p>
        )}
        <p className="text-stone-400">
          作成方法: {profile.creation_method === 'text_learning' ? 'テキスト学習' : '性格診断'}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 border border-amber-300 hover:border-amber-400 text-amber-600 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          編集
        </button>
        <button
          onClick={onDelete}
          className="border border-stone-200 hover:border-red-300 hover:text-red-500 text-stone-400 px-3 py-2 rounded-lg text-xs transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  )
}
