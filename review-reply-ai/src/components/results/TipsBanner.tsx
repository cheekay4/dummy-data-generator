interface Props {
  tips: string
}

export default function TipsBanner({ tips }: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
      <span className="text-amber-500 text-lg mt-0.5">💡</span>
      <p className="text-sm text-amber-800 leading-relaxed">{tips}</p>
    </div>
  )
}
