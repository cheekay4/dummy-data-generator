import type { Metadata } from 'next';
import { AgentCardWorkspace } from './_components/AgentCardWorkspace';

export const metadata: Metadata = {
  title: 'A2A エージェントカード ジェネレーター',
  description: 'AIエージェントの名刺（Agent Card）をブラウザ上で作成・検証。A2Aプロトコル v1.0準拠。データ外部送信なし。',
  openGraph: {
    title: 'A2A エージェントカード ジェネレーター',
    description: 'AIエージェントの名刺（Agent Card）をブラウザ上で作成。A2Aプロトコル v1.0準拠。',
    url: 'https://agentjuku.com/tools/agent-card',
    siteName: 'agentjuku',
    locale: 'ja_JP',
    type: 'website',
  },
  alternates: {
    canonical: 'https://agentjuku.com/tools/agent-card',
  },
};

export default function AgentCardPage(): JSX.Element {
  return <AgentCardWorkspace />;
}
