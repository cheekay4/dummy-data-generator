'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { CheckCircle2, X } from 'lucide-react'

function SuccessToast() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setShow(true)
      const t = setTimeout(() => setShow(false), 5000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2.5 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-lg text-[13px]">
        <CheckCircle2 size={16} className="text-emerald-400" />
        Proプランへのアップグレードが完了しました
        <button onClick={() => setShow(false)} className="ml-1 text-neutral-400 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  return (
    <Suspense>
      <SuccessToast />
    </Suspense>
  )
}
