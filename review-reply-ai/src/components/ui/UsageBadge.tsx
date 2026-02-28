'use client'

interface Props {
  remaining: number
  plan: 'trial' | 'free' | 'pro'
}

export default function UsageBadge({ remaining, plan }: Props) {
  if (plan === 'pro') {
    return (
      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
        ✨ Pro · 無制限
      </span>
    )
  }

  const limit = plan === 'free' ? 5 : 3
  const isEmpty = remaining <= 0

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      isEmpty ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-500'
    }`}>
      {isEmpty ? '本日の利用回数を使い切りました' : `本日あと${remaining}回（無料）`}
    </span>
  )
}
