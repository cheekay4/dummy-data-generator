export type Scene = 'reply' | 'request' | 'apologize' | 'thanks' | 'check';
export type Recipient = 'superior' | 'client' | 'colleague' | 'other';
export type Tone = 'polite' | 'formal' | 'casual';

export interface GenerateRequest {
  text: string;
  scene: Scene;
  recipient: Recipient;
  tone: Tone;
}

export interface GenerateResponse {
  result: string;
  error?: string;
}

export interface StorageData {
  usageCount: number;       // 本日の使用回数
  usageDate: string;        // 'YYYY-MM-DD' 形式
  licenseKey: string;       // Proライセンスキー（未設定なら ''）
  licenseValid: boolean;    // ライセンス有効フラグ
  lastScene: Scene;         // 最後に選んだシーン（記憶用）
  lastRecipient: Recipient;
  lastTone: Tone;
  pendingText: string;      // Gmail/Outlookから渡されたテキスト
}
