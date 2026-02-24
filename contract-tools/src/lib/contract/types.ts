export type ContractType =
  | 'auto'
  | 'outsourcing'
  | 'nda'
  | 'sales'
  | 'lease'
  | 'employment'
  | 'license'
  | 'tos'
  | 'other';

export type PositionType = 'receiver' | 'orderer' | 'neutral';

export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

export interface KeyPoint {
  label: string;
  value: string;
}

export interface RiskItem {
  articleNumber: string;
  articleTitle: string;
  riskLevel: 'high' | 'medium' | 'low';
  excerpt: string;
  issue: string;
  suggestion: string;
  commonPractice: string;
}

export interface ArticleItem {
  number: string;
  title: string;
  riskLevel: RiskLevel;
  status: '要確認' | '注意' | '問題なし';
  summary: string;
}

export interface MissingClause {
  clause: string;
  importance: 'high' | 'medium';
  explanation: string;
}

export interface AnalysisResult {
  contractType: string;
  riskScore: number;
  summary: string;
  keyPoints: KeyPoint[];
  risks: RiskItem[];
  articles: ArticleItem[];
  missingClauses: MissingClause[];
}
