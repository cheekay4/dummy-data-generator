'use client'

interface Props {
  samples: string[]
  onChange: (samples: string[]) => void
  maxSamples?: number
}

export default function TextSampleInput({ samples, onChange, maxSamples = 5 }: Props) {
  function updateSample(index: number, value: string) {
    const next = [...samples]
    next[index] = value
    onChange(next)
  }

  function addSample() {
    if (samples.length < maxSamples) {
      onChange([...samples, ''])
    }
  }

  function removeSample(index: number) {
    if (samples.length <= 2) return
    onChange(samples.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-stone-700 mb-1">過去に書いた文章を2〜5件貼り付けてください</p>
        <p className="text-xs text-stone-400">
          口コミ返信・お客様へのメール・LINEメッセージなど、何でもOKです
        </p>
      </div>

      {samples.map((sample, i) => (
        <div key={i} className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-stone-500">サンプル {i + 1}</label>
            {samples.length > 2 && (
              <button
                onClick={() => removeSample(i)}
                className="text-xs text-stone-300 hover:text-red-400 transition-colors"
              >
                削除
              </button>
            )}
          </div>
          <textarea
            value={sample}
            onChange={(e) => updateSample(i, e.target.value)}
            placeholder={i === 0 ? 'ご来店ありがとうございます。パスタを気に入っていただけて、スタッフ一同…' : ''}
            rows={3}
            maxLength={1000}
            className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <div className="flex justify-between mt-1">
            <p className={`text-xs ${sample.trim().length > 0 && sample.trim().length < 30 ? 'text-red-400' : 'text-stone-300'}`}>
              {sample.trim().length > 0 && sample.trim().length < 30 ? '30文字以上入力してください' : ''}
            </p>
            <p className="text-xs text-stone-300">{sample.length}/1000</p>
          </div>
        </div>
      ))}

      {samples.length < maxSamples && (
        <button
          onClick={addSample}
          className="w-full border-2 border-dashed border-stone-200 hover:border-amber-300 text-stone-400 hover:text-amber-500 py-3 rounded-xl text-sm transition-colors"
        >
          ＋ もう1件追加する（最大{maxSamples}件）
        </button>
      )}

      <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
        ✅ 最低2件で分析可能。多いほど精度が上がります
      </p>
    </div>
  )
}
