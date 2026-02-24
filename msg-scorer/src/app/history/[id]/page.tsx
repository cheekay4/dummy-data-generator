import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getHistoryById } from '@/lib/db/score-history';
import Link from 'next/link';
import HistoryDetailClient from './HistoryDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const record = await getHistoryById(id, user.id);
  if (!record) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/history" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          ← 履歴一覧
        </Link>
      </div>

      <HistoryDetailClient record={record} />
    </div>
  );
}
