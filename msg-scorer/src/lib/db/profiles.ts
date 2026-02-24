import { createAdminClient } from '@/lib/supabase/admin';
import { type Plan } from '@/lib/plan';

export async function getProfile(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data as {
    id: string;
    email: string;
    plan: Plan;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    custom_ng_words: string[];
    extension_token_hash: string | null;
    created_at: string;
    updated_at: string;
  } | null;
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const profile = await getProfile(userId);
  return (profile?.plan as Plan) ?? 'free';
}

export async function updateProfilePlan(
  userId: string,
  plan: Plan,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
) {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = { plan };
  if (stripeCustomerId) updates.stripe_customer_id = stripeCustomerId;
  if (stripeSubscriptionId) updates.stripe_subscription_id = stripeSubscriptionId;
  await supabase.from('profiles').update(updates).eq('id', userId);
}

export async function getProfileByStripeCustomerId(customerId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();
  return data;
}
