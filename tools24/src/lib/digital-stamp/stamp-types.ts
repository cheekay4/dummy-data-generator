export type StampType = 'maru-sei' | 'maru-full' | 'kaku' | 'date';
export type FontStyle = 'mincho' | 'kaisho' | 'tensho';
export type WearIntensity = 'none' | 'light' | 'strong';

export interface StampOptions {
  type: StampType;
  sei: string;
  mei: string;
  companyName: string;
  upperText: string;
  date: string;
  dateFormat: 'iso' | 'wareki' | 'japanese';
  color: string;
  size: number;
  lineWidth: number;
  fontStyle: FontStyle;
  wear: WearIntensity;
  rotation: number;
}

export const DEFAULT_OPTIONS: StampOptions = {
  type: 'maru-sei',
  sei: '田中',
  mei: '',
  companyName: '株式会社サンプル',
  upperText: '承認',
  date: new Date().toISOString().slice(0, 10),
  dateFormat: 'japanese',
  color: '#C13B2C',
  size: 300,
  lineWidth: 2,
  fontStyle: 'mincho',
  wear: 'none',
  rotation: 0,
};

export const PRESET_COLORS = [
  { name: '朱色', value: '#C13B2C' },
  { name: '赤', value: '#D32F2F' },
  { name: '青', value: '#1565C0' },
  { name: '黒', value: '#212121' },
  { name: '緑', value: '#2E7D32' },
];
