import ScoringWorkspace from '@/components/scoring/ScoringWorkspaceClient';

export const metadata = {
  title: 'スコアリング | MsgScore',
  description: '配信先セグメントを設定して、メルマガ・LINE配信文の効果をAIが予測。無料で1日5回まで利用できます。',
};

export default function ScorePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">スコアリング</p>
          <h1 className="font-outfit font-bold text-2xl text-stone-900">
            配信文をAIが評価する
          </h1>
        </div>
        <ScoringWorkspace />
      </div>
    </div>
  );
}
