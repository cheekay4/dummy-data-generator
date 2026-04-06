// affiliate-data.ts — 全ページのアフィリエイトテキストリンク定義
// もしもアフィリエイト + A8.net の承認済み案件

// --- もしも案件URL定数 ---
const MOSHIMO = {
  shinServer: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440080&p_id=4942&pc_id=13183&pl_id=65061',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440080&p_id=4942&pc_id=13183&pl_id=65061',
  },
  zeroKeiri: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440078&p_id=6729&pc_id=19230&pl_id=85867',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440078&p_id=6729&pc_id=19230&pl_id=85867',
  },
  onamae: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440095&p_id=109&pc_id=109&pl_id=2746',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440095&p_id=109&pc_id=109&pl_id=2746',
  },
  lolipop: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440097&p_id=16&pc_id=16&pl_id=14954',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440097&p_id=16&pc_id=16&pl_id=14954',
  },
  conohaGame: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440081&p_id=4936&pc_id=13170&pl_id=76982',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440081&p_id=4936&pc_id=13170&pl_id=76982',
  },
  conohaVps: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440088&p_id=2540&pc_id=5631&pl_id=49269',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440088&p_id=2540&pc_id=5631&pl_id=49269',
  },
  winserver: {
    click: 'https://af.moshimo.com/af/c/click?a_id=5440083&p_id=1293&pc_id=2114&pl_id=92627',
    impression: 'https://i.moshimo.com/af/i/impression?a_id=5440083&p_id=1293&pc_id=2114&pl_id=92627',
  },
} as const;

// --- A8案件URL定数 ---
const A8 = {
  freee: {
    click: 'https://px.a8.net/svt/ejp?a8mat=4AXEWG+32QO2I+3SPO+9FL80Y',
    impression: 'https://www17.a8.net/0.gif?a8mat=4AXEWG+32QO2I+3SPO+9FL80Y',
  },
  moneyforward: {
    click: 'https://px.a8.net/svt/ejp?a8mat=4AXEWG+36WPAY+4JGQ+BZ8OY',
    impression: 'https://www14.a8.net/0.gif?a8mat=4AXEWG+36WPAY+4JGQ+BZ8OY',
  },
  yayoi: {
    click: 'https://px.a8.net/svt/ejp?a8mat=4AXEWG+5HNYE2+35XE+609HU',
    impression: 'https://www11.a8.net/0.gif?a8mat=4AXEWG+5HNYE2+35XE+609HU',
  },
} as const;

// --- ページ別テ��ストリンクデータ型 ---
interface TextLinkData {
  label: string;
  items: {
    text: string;
    clickUrl: string;
    impressionUrl: string;
    badge?: string;
  }[];
}

// ===== Webツール 6本 =====
export const affiliateWebTools: Record<string, TextLinkData> = {
  '/mojibake-fixer': {
    label: '文字化けを根本解決',
    items: [
      { text: 'サーバーの文字コード設定を見直す → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
    ],
  },
  '/favicon-generator': {
    label: 'サイト公開に必要なもの',
    items: [
      { text: '独自ドメインを取得 → お名前.com', clickUrl: MOSHIMO.onamae.click, impressionUrl: MOSHIMO.onamae.impression },
      { text: 'サイトを公開 → ロリポップ！レンタルサーバー', clickUrl: MOSHIMO.lolipop.click, impressionUrl: MOSHIMO.lolipop.impression },
    ],
  },
  '/digital-stamp': {
    label: 'ペーパーレス化をもっと進める',
    items: [
      { text: '経理も丸投げ → ゼロ経理 月3,980円から', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression, badge: '高単価' },
    ],
  },
  '/webp-converter': {
    label: 'サイト速度をさらに改善',
    items: [
      { text: '高速サーバーに移行 → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
      { text: 'WordPress対応 → ロリポップ！', clickUrl: MOSHIMO.lolipop.click, impressionUrl: MOSHIMO.lolipop.impression },
    ],
  },
  '/minify-tools': {
    label: '開発環境をもっと快適に',
    items: [
      { text: '高速レンタルサーバー → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
      { text: 'VPSで自由な環境を → ConoHa', clickUrl: MOSHIMO.conohaGame.click, impressionUrl: MOSHIMO.conohaGame.impression },
    ],
  },
  '/zenkaku-hankaku': {
    label: 'データ整理をもっと楽に',
    items: [
      { text: '経理データの整理も丸投げ → ゼロ経理', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression },
    ],
  },
};

// ===== 開発者ツール 6本 =====
export const affiliateDevTools: Record<string, TextLinkData> = {
  '/dev/json-formatter': {
    label: 'API開発環境',
    items: [
      { text: 'APIサーバーを構築 → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
      { text: '開発用VPS → ConoHa', clickUrl: MOSHIMO.conohaVps.click, impressionUrl: MOSHIMO.conohaVps.impression },
    ],
  },
  '/dev/regex-tester': {
    label: 'スキルアップ',
    items: [
      { text: '実践で学ぶ → レンタルサーバーで環境構築', clickUrl: MOSHIMO.lolipop.click, impressionUrl: MOSHIMO.lolipop.impression },
    ],
  },
  '/dev/dummy-data-generator': {
    label: 'テスト環境',
    items: [
      { text: 'テスト環境を構築 → ConoHa VPS', clickUrl: MOSHIMO.conohaVps.click, impressionUrl: MOSHIMO.conohaVps.impression },
      { text: '本番環境 → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
    ],
  },
  '/dev/cron-expression-builder': {
    label: 'Cronを動かすサーバー',
    items: [
      { text: 'VPSでCronジョブを実行 → ConoHa', clickUrl: MOSHIMO.conohaVps.click, impressionUrl: MOSHIMO.conohaVps.impression },
      { text: 'Windowsサーバー → Winserver', clickUrl: MOSHIMO.winserver.click, impressionUrl: MOSHIMO.winserver.impression },
    ],
  },
  '/dev/wareki-converter': {
    label: '業務効率化',
    items: [
      { text: '経理業務を丸投げ → ゼロ経理', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression },
    ],
  },
  '/dev/encode-decode': {
    label: 'セキュリティ強化',
    items: [
      { text: 'SSL対応サーバー → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
    ],
  },
};

// ===== 確定申告ツール 9本 =====
export const affiliateKakuteiTools: Record<string, TextLinkData> = {
  '/kakutei/income-tax': {
    label: 'この結果を活かすなら',
    items: [
      { text: 'freee会計で確定申告を簡単に → 無料で始める', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression, badge: '人気' },
      { text: '経理を丸投げ → ゼロ経理 月3,980円', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression, badge: '高単価' },
    ],
  },
  '/kakutei/medical': {
    label: '医療費控除の申請に',
    items: [
      { text: 'freee会計なら医療費控除も自動計算', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
      { text: 'マネーフォワード確定申���で申請', clickUrl: A8.moneyforward.click, impressionUrl: A8.moneyforward.impression },
    ],
  },
  '/kakutei/furusato': {
    label: 'ふるさと納税をもっと活用',
    items: [
      { text: '控除額を最大化 → freee会計で管理', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
    ],
  },
  '/kakutei/side-job': {
    label: '副業の確定申告を楽に',
    items: [
      { text: 'やよいの青色申告オンラインで簡単申告', clickUrl: A8.yayoi.click, impressionUrl: A8.yayoi.impression, badge: '初年度無料' },
      { text: '経理を丸投げ → ゼロ経理', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression },
    ],
  },
  '/kakutei/life-insurance': {
    label: '保険料の節税',
    items: [
      { text: 'freee会計で控除額を自動計算', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
    ],
  },
  '/kakutei/housing-loan': {
    label: '住宅ローンの見直し',
    items: [
      { text: 'freee会計でローン控���の申告', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
    ],
  },
  '/kakutei/furusato-tracker': {
    label: '確定申告���時に',
    items: [
      { text: 'freee会計でまとめて申告', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
    ],
  },
  '/kakutei/checklist': {
    label: 'チェック完了！次のステップ',
    items: [
      { text: 'freee会計でe-Tax提出 → 無料で始める', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression },
      { text: '経理が面倒なら → ゼロ経理に丸投げ', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression },
    ],
  },
  '/kakutei/etax-guide': {
    label: 'e-Tax提出をもっと簡単に',
    items: [
      { text: 'freee会計ならe-Tax連携で一発提出', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression, badge: 'おすすめ' },
    ],
  },
};

// ===== ガイド記事 5本 =====
export const affiliateGuides: Record<string, TextLinkData> = {
  '/guide/kakutei-beginners': {
    label: '確定申告を始めるなら',
    items: [
      { text: 'freee会計で簡単に → 無料で始める', clickUrl: A8.freee.click, impressionUrl: A8.freee.impression, badge: '人気' },
      { text: '経理を丸投げ → ゼロ経理 月3,980円', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression },
    ],
  },
  '/guide/csv-mojibake': {
    label: '文字コード問題を根本解決',
    items: [
      { text: 'DB文字コード設定も安心 → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
      { text: 'WordPress対応 → ロリポップ！', clickUrl: MOSHIMO.lolipop.click, impressionUrl: MOSHIMO.lolipop.impression },
    ],
  },
  '/guide/webp-seo': {
    label: 'サイ���速度をさらに改善',
    items: [
      { text: '高速SSDサーバー → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
      { text: '独自ドメインも取得 → お名前.com', clickUrl: MOSHIMO.onamae.click, impressionUrl: MOSHIMO.onamae.impression },
    ],
  },
  '/guide/json-api-debug': {
    label: 'API開発環境',
    items: [
      { text: 'APIサーバーを構築 → ConoHa VPS', clickUrl: MOSHIMO.conohaVps.click, impressionUrl: MOSHIMO.conohaVps.impression },
      { text: '本番環境 → シンレンタルサーバー', clickUrl: MOSHIMO.shinServer.click, impressionUrl: MOSHIMO.shinServer.impression },
    ],
  },
  '/guide/digital-stamp-remote': {
    label: 'ペーパーレス経理',
    items: [
      { text: '経理も丸投げ → ゼロ経理 月3,980円', clickUrl: MOSHIMO.zeroKeiri.click, impressionUrl: MOSHIMO.zeroKeiri.impression, badge: '高単価' },
    ],
  },
};

// ===== 全データ統合（パスで検索用） =====
export const allAffiliateData: Record<string, TextLinkData> = {
  ...affiliateWebTools,
  ...affiliateDevTools,
  ...affiliateKakuteiTools,
  ...affiliateGuides,
};

// --- ヘルパー関数 ---
export function getAffiliateData(pathname: string): TextLinkData | undefined {
  return allAffiliateData[pathname];
}
