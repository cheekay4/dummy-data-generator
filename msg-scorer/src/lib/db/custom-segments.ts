import { createAdminClient } from '@/lib/supabase/admin';
import { type AudienceSegment } from '@/lib/types';

export interface CustomSegment {
  id: string;
  user_id: string;
  name: string;
  segment: AudienceSegment;
  created_at: string;
}

export async function getCustomSegments(userId: string): Promise<CustomSegment[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('custom_segments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as CustomSegment[];
}

export async function saveCustomSegment(
  userId: string,
  name: string,
  segment: AudienceSegment,
): Promise<CustomSegment | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('custom_segments')
    .insert({ user_id: userId, name, segment })
    .select()
    .single();
  return data as CustomSegment | null;
}

export async function deleteCustomSegment(id: string, userId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('custom_segments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
}
