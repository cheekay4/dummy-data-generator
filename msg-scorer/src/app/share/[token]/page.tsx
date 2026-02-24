import { notFound } from 'next/navigation';
import { getByShareToken } from '@/lib/db/score-history';
import SharePageClient from './SharePageClient';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  const record = await getByShareToken(token);
  if (!record) notFound();

  return <SharePageClient record={record} />;
}
