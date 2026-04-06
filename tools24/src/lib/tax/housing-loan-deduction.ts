export type HousingType =
  | 'certified'          // 認定住宅（認定長期優良住宅・認定低炭素住宅）
  | 'zeh'                // ZEH水準省エネ住宅
  | 'energy_efficient'   // 省エネ基準適合住宅
  | 'general_new'        // その他の新築（2023年末までに建築確認済みの経過措置物件）
  | 'certified_used'     // 中古住宅（認定住宅等）
  | 'general_used';      // 中古住宅（その他）

export interface HousingLoanParams {
  moveInYear: number;       // 入居年（2022〜2025）
  housingType: HousingType;
  yearEndBalance: number;   // 年末残高
  controlYear: number;      // 控除何年目（1〜13）
}

// 借入限度額テーブル（円）
function getBorrowingLimit(moveInYear: number, housingType: HousingType): number {
  if (moveInYear <= 2023) {
    // 2022〜2023年入居
    switch (housingType) {
      case 'certified':        return 50_000_000;
      case 'zeh':              return 45_000_000;
      case 'energy_efficient': return 40_000_000;
      case 'general_new':      return 30_000_000;
      case 'certified_used':   return 30_000_000;
      case 'general_used':     return 20_000_000;
    }
  } else {
    // 2024〜2025年入居
    switch (housingType) {
      case 'certified':        return 45_000_000;
      case 'zeh':              return 35_000_000;
      case 'energy_efficient': return 30_000_000;
      case 'general_new':      return 20_000_000; // 経過措置（2023年末までに建築確認済み）
      case 'certified_used':   return 30_000_000;
      case 'general_used':     return 20_000_000;
    }
  }
}

function getControlPeriod(housingType: HousingType, moveInYear: number): number {
  // 中古: 10年
  if (housingType === 'certified_used' || housingType === 'general_used') return 10;
  // 2024以降のその他新築（経過措置）: 10年
  if (housingType === 'general_new' && moveInYear >= 2024) return 10;
  // 新築系: 13年
  return 13;
}

export function calcHousingLoanDeduction(params: HousingLoanParams): {
  deduction: number;
  applicableBalance: number;
  borrowingLimit: number;
  controlPeriod: number;
  isFirstYear: boolean;
  remainingYears: number;
} {
  const borrowingLimit = getBorrowingLimit(params.moveInYear, params.housingType);
  const applicableBalance = Math.min(params.yearEndBalance, borrowingLimit);
  const controlPeriod = getControlPeriod(params.housingType, params.moveInYear);

  if (params.controlYear > controlPeriod || applicableBalance <= 0) {
    return {
      deduction: 0,
      applicableBalance: 0,
      borrowingLimit,
      controlPeriod,
      isFirstYear: params.controlYear === 1,
      remainingYears: 0,
    };
  }

  // 控除額 = 対象残高 × 0.7%（100円未満切捨て）
  const deduction = Math.floor((applicableBalance * 0.007) / 100) * 100;

  return {
    deduction,
    applicableBalance,
    borrowingLimit,
    controlPeriod,
    isFirstYear: params.controlYear === 1,
    remainingYears: controlPeriod - params.controlYear,
  };
}

// 借入限度額一覧（SEOコンテンツ用）
export interface LimitTableRow {
  housingType: HousingType;
  label: string;
  limit2022_2023: number;
  limit2024_2025: number;
  period2022_2023: number;
  period2024_2025: number;
}

export const LIMIT_TABLE: LimitTableRow[] = [
  {
    housingType: 'certified',
    label: '認定住宅（認定長期優良・認定低炭素）',
    limit2022_2023: 50_000_000,
    limit2024_2025: 45_000_000,
    period2022_2023: 13,
    period2024_2025: 13,
  },
  {
    housingType: 'zeh',
    label: 'ZEH水準省エネ住宅',
    limit2022_2023: 45_000_000,
    limit2024_2025: 35_000_000,
    period2022_2023: 13,
    period2024_2025: 13,
  },
  {
    housingType: 'energy_efficient',
    label: '省エネ基準適合住宅',
    limit2022_2023: 40_000_000,
    limit2024_2025: 30_000_000,
    period2022_2023: 13,
    period2024_2025: 13,
  },
  {
    housingType: 'general_new',
    label: 'その他の新築（経過措置）',
    limit2022_2023: 30_000_000,
    limit2024_2025: 20_000_000,
    period2022_2023: 13,
    period2024_2025: 10,
  },
  {
    housingType: 'certified_used',
    label: '中古住宅（認定住宅等）',
    limit2022_2023: 30_000_000,
    limit2024_2025: 30_000_000,
    period2022_2023: 10,
    period2024_2025: 10,
  },
  {
    housingType: 'general_used',
    label: '中古住宅（その他）',
    limit2022_2023: 20_000_000,
    limit2024_2025: 20_000_000,
    period2022_2023: 10,
    period2024_2025: 10,
  },
];
