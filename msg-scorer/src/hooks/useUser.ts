'use client';
import { useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            setIsPro(data?.plan === 'pro');
          });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setIsPro(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isPro };
}
