// Phase 1-B で実装
import { PredictedImpact, ConversionGoal } from './types';

export function calculateImpact(
  _totalRecipients: number,
  _totalScore: number,
  _conversionGoal: ConversionGoal,
  _avgOpenRate?: number,
  _avgCtr?: number,
): { current: PredictedImpact; improved: PredictedImpact } {
  throw new Error('Not implemented in Phase 1-A');
}
