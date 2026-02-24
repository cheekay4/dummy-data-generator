import { redirect } from 'next/navigation';

// /history は /mypage にリダイレクト（後方互換のため維持）
export default function HistoryPage() {
  redirect('/mypage?tab=history');
}
