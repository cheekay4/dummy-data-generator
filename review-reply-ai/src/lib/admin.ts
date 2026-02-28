import { createClient } from '@/lib/supabase/server'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email)
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
