import { createClient } from '@/lib/supabase/server'

const ALLOWED_ADMIN_EMAILS: readonly string[] = [
  'cheekay.no.4@gmail.com',
  'tools24.riku@gmail.com',
] as const

export function isAdminEmail(email: string): boolean {
  return ALLOWED_ADMIN_EMAILS.includes(email)
}

export async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email ?? '')) return null
  return user
}

export async function requireAdminApi() {
  const user = await getAdminUser()
  if (!user) return null
  return { userId: user.id, email: user.email! }
}
