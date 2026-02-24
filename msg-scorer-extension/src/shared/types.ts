export type Channel = 'email-subject' | 'email-body' | 'line';

export type ConversionGoal = 'purchase' | 'click' | 'signup' | 'visit' | 'inquiry';

export interface AudienceSegment {
  totalRecipients: number;
  conversionGoal: ConversionGoal;
  gender: { female: number; male: number; other: number };
  ageDistribution: {
    under20: number;
    twenties: number;
    thirties: number;
    forties: number;
    fifties: number;
    sixtiesPlus: number;
  };
  attributes: {
    deviceMobile: number;
    existingCustomer: number;
  };
  presetName?: string;
}

export interface ScoreAxis {
  name: string;
  score: number;
  feedback: string;
}

export interface ScoreResult {
  totalScore: number;
  axes: ScoreAxis[];
  improvements: string[];
  ngWordsFound?: string[];
}

export interface StorageData {
  extensionToken: string;
  tokenValid: boolean;
  tokenPlan: string | null;
  usageCount: number;
  usageDate: string;
  lastChannel: Channel;
  lastPreset: string;
}
