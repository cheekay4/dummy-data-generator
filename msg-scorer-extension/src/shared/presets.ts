import type { AudienceSegment } from './types';

export const AUDIENCE_PRESETS: Record<string, AudienceSegment> = {
  'ec-general': {
    totalRecipients: 15000,
    conversionGoal: 'purchase',
    gender: { female: 55, male: 42, other: 3 },
    ageDistribution: { under20: 5, twenties: 20, thirties: 25, forties: 25, fifties: 15, sixtiesPlus: 10 },
    attributes: { deviceMobile: 70, existingCustomer: 60 },
    presetName: 'EC全体',
  },
  'young-women-ec': {
    totalRecipients: 5000,
    conversionGoal: 'purchase',
    gender: { female: 85, male: 12, other: 3 },
    ageDistribution: { under20: 10, twenties: 60, thirties: 25, forties: 3, fifties: 1, sixtiesPlus: 1 },
    attributes: { deviceMobile: 90, existingCustomer: 40 },
    presetName: '20代女性向けEC',
  },
  'btob-lead': {
    totalRecipients: 3000,
    conversionGoal: 'inquiry',
    gender: { female: 30, male: 65, other: 5 },
    ageDistribution: { under20: 0, twenties: 10, thirties: 30, forties: 35, fifties: 20, sixtiesPlus: 5 },
    attributes: { deviceMobile: 40, existingCustomer: 20 },
    presetName: 'BtoBリード',
  },
  'family': {
    totalRecipients: 7000,
    conversionGoal: 'signup',
    gender: { female: 65, male: 32, other: 3 },
    ageDistribution: { under20: 2, twenties: 10, thirties: 40, forties: 35, fifties: 10, sixtiesPlus: 3 },
    attributes: { deviceMobile: 80, existingCustomer: 50 },
    presetName: 'ファミリー層',
  },
  'senior': {
    totalRecipients: 8000,
    conversionGoal: 'visit',
    gender: { female: 55, male: 42, other: 3 },
    ageDistribution: { under20: 0, twenties: 0, thirties: 5, forties: 10, fifties: 30, sixtiesPlus: 55 },
    attributes: { deviceMobile: 45, existingCustomer: 80 },
    presetName: 'シニア層',
  },
};

export const PRESET_KEYS = Object.keys(AUDIENCE_PRESETS);
