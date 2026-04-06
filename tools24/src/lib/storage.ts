// 保存するデータの型定義
export interface TaxData {
  // 基本情報
  salary?: number;              // 給与収入
  employmentIncome?: number;    // 給与所得
  totalIncome?: number;         // 合計所得

  // 所得税シミュレーター結果
  incomeTax?: number;           // 所得税額
  incomeTaxRate?: number;       // 適用税率
  taxableIncome?: number;       // 課税所得

  // 医療費控除
  medicalDeduction?: number;    // 医療費控除額

  // ふるさと納税
  furusatoLimit?: number;       // 控除上限額

  // 副業
  sideJobIncome?: number;       // 副業所得
  sideJobRevenue?: number;      // 副業の収入（売上）
  sideJobExpenses?: number;     // 副業の経費
  needsFiling?: boolean;        // 確定申告が必要か

  // 生命保険料控除
  lifeInsuranceDeduction?: number; // 生命保険料控除額

  // 住宅ローン控除
  housingLoanDeduction?: number;   // 住宅ローン控除額

  // 年金
  pensionIncome?: number;          // 年金所得

  // メタ情報
  lastUpdated?: string;         // ISO日時文字列
}

// ふるさと納税 寄附管理
export interface FurusatoDonation {
  id: string;           // uuid
  date: string;         // YYYY-MM-DD
  municipality: string; // 自治体名
  amount: number;       // 寄附金額
  returnGift?: string;  // 返礼品メモ
  onestop: 'applied' | 'not_applied' | 'not_needed';
  certificate: 'received' | 'not_received';
}

const FURUSATO_KEY = 'kakutei-tools-furusato';

export function saveFurusatoDonations(donations: FurusatoDonation[]): void {
  try {
    localStorage.setItem(FURUSATO_KEY, JSON.stringify(donations));
  } catch {}
}

export function loadFurusatoDonations(): FurusatoDonation[] {
  try {
    const raw = localStorage.getItem(FURUSATO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const STORAGE_KEY = 'kakutei-tools-data';

export function saveTaxData(partial: Partial<TaxData>): void {
  const existing = loadTaxData();
  const updated = { ...existing, ...partial, lastUpdated: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('taxdata-updated'));
  } catch {
    // localStorage使えない場合は無視
  }
}

export function loadTaxData(): TaxData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearTaxData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
