'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isImmersive =
    (pathname.startsWith('/interview/') && pathname !== '/interview/new') ||
    pathname.startsWith('/manual/')

  return (
    <>
      {!isImmersive && <Header />}
      <main>{children}</main>
      {!isImmersive && <Footer />}
    </>
  )
}
