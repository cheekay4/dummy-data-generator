import type { AgentCard } from './schema';

type PresetValue = Omit<AgentCard, 'capabilities'> & {
  capabilities: {
    streaming: boolean | null;
    pushNotifications: boolean | null;
    extendedAgentCard: boolean | null;
    extensions: never[];
  };
};

interface Preset {
  id: string;
  label: string;
  description: string;
  value: PresetValue | null;
}

export const presets: Preset[] = [
  {
    id: 'booking',
    label: '予約管理エージェント',
    description: '飲食店・美容室・クリニックの予約受付',
    value: {
      name: '予約管理エージェント',
      description: '予約の受付・空き確認・キャンセル対応を自動で行います',
      version: '1.0.0',
      supportedInterfaces: [{
        url: 'https://example.com/a2a',
        protocolBinding: 'JSONRPC',
        protocolVersion: '1.0',
      }],
      capabilities: { streaming: false, pushNotifications: false, extendedAgentCard: false, extensions: [] },
      defaultInputModes: ['text/plain'],
      defaultOutputModes: ['text/plain'],
      skills: [{
        id: 'booking-manage',
        name: '予約管理',
        description: '空き時間の確認、予約の作成・変更・キャンセルを行います',
        tags: ['予約', 'スケジュール'],
        examples: ['明日の14時に予約できますか？', '予約をキャンセルしたい'],
      }],
      provider: { organization: '', url: '' },
      documentationUrl: '',
      iconUrl: '',
    },
  },
  {
    id: 'customer-support',
    label: 'カスタマーサポート',
    description: '問い合わせ対応・FAQ回答',
    value: {
      name: 'カスタマーサポートエージェント',
      description: 'お客様からの問い合わせに自動応答し、FAQの検索・回答を行います',
      version: '1.0.0',
      supportedInterfaces: [{
        url: 'https://example.com/a2a',
        protocolBinding: 'JSONRPC',
        protocolVersion: '1.0',
      }],
      capabilities: { streaming: true, pushNotifications: false, extendedAgentCard: false, extensions: [] },
      defaultInputModes: ['text/plain'],
      defaultOutputModes: ['text/plain', 'application/json'],
      skills: [{
        id: 'faq-answer',
        name: 'FAQ回答',
        description: 'よくある質問に対して適切な回答を検索・提示します',
        tags: ['FAQ', 'サポート', '問い合わせ'],
        examples: ['返品の手続きを教えてください', '送料はいくらですか？'],
      }, {
        id: 'ticket-create',
        name: 'チケット作成',
        description: '解決できない問い合わせをサポートチケットとして登録します',
        tags: ['チケット', 'エスカレーション'],
        examples: ['担当者に繋いでください', '問い合わせ番号を発行してほしい'],
      }],
      provider: { organization: '', url: '' },
      documentationUrl: '',
      iconUrl: '',
    },
  },
  {
    id: 'sales',
    label: '営業・見積もり',
    description: '見積もり作成・商品案内',
    value: {
      name: '営業アシスタントエージェント',
      description: '商品の案内、見積もり作成、在庫確認を自動で行います',
      version: '1.0.0',
      supportedInterfaces: [{
        url: 'https://example.com/a2a',
        protocolBinding: 'JSONRPC',
        protocolVersion: '1.0',
      }],
      capabilities: { streaming: false, pushNotifications: true, extendedAgentCard: false, extensions: [] },
      defaultInputModes: ['text/plain', 'application/json'],
      defaultOutputModes: ['text/plain', 'application/json'],
      skills: [{
        id: 'quote-generate',
        name: '見積もり作成',
        description: '商品・サービスの見積書をリアルタイムで生成します',
        tags: ['見積もり', '営業', '価格'],
        examples: ['Aプラン10ライセンスの見積もりを作成してください', '年間契約の割引はありますか？'],
      }, {
        id: 'product-recommend',
        name: '商品レコメンド',
        description: '顧客の要件に基づいて最適な商品・プランを提案します',
        tags: ['レコメンド', '提案', '商品'],
        examples: ['小規模チーム向けのプランを教えてください'],
      }],
      provider: { organization: '', url: '' },
      documentationUrl: '',
      iconUrl: '',
    },
  },
  {
    id: 'data-analysis',
    label: 'データ分析',
    description: 'レポート生成・データクエリ',
    value: {
      name: 'データ分析エージェント',
      description: 'データベースへのクエリ実行、レポート生成、統計分析を行います',
      version: '1.0.0',
      supportedInterfaces: [{
        url: 'https://example.com/a2a',
        protocolBinding: 'HTTP+JSON',
        protocolVersion: '1.0',
      }],
      capabilities: { streaming: true, pushNotifications: false, extendedAgentCard: false, extensions: [] },
      defaultInputModes: ['text/plain', 'application/json'],
      defaultOutputModes: ['application/json', 'text/plain'],
      skills: [{
        id: 'report-generate',
        name: 'レポート生成',
        description: '指定された期間・条件でデータレポートを生成します',
        tags: ['レポート', '分析', 'データ'],
        examples: ['先月の売上レポートを作成してください', '日別のアクセス数を集計して'],
      }, {
        id: 'data-query',
        name: 'データクエリ',
        description: '自然言語での質問をデータクエリに変換して結果を返します',
        tags: ['クエリ', 'SQL', '検索'],
        examples: ['東京都の顧客数は？', '最も売れている商品トップ5を教えて'],
      }],
      provider: { organization: '', url: '' },
      documentationUrl: '',
      iconUrl: '',
    },
  },
  {
    id: 'empty',
    label: '空のテンプレート',
    description: 'すべて自分で入力',
    value: null,
  },
];
