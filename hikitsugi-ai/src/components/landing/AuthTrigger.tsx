'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthModal from '@/components/auth/AuthModal'

function AuthTriggerInner() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('auth') === '1') {
      setShow(true)
    }
  }, [searchParams])

  if (!show) return null
  return <AuthModal onClose={() => setShow(false)} />
}

export default function AuthTrigger() {
  return (
    <Suspense>
      <AuthTriggerInner />
    </Suspense>
  )
}
