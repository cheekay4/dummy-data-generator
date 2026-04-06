/** 新制度の控除額計算（1区分あたり最大4万円） */
function calcNewSystemDeduction(premium: number): number {
  if (premium <= 0) return 0;
  if (premium <= 20_000) return premium;
  if (premium <= 40_000) return Math.floor(premium * 0.5 + 10_000);
  if (premium <= 80_000) return Math.floor(premium * 0.25 + 20_000);
  return 40_000;
}

/** 旧制度の控除額計算（1区分あたり最大5万円） */
function calcOldSystemDeduction(premium: number): number {
  if (premium <= 0) return 0;
  if (premium <= 25_000) return premium;
  if (premium <= 50_000) return Math.floor(premium * 0.5 + 12_500);
  if (premium <= 100_000) return Math.floor(premium * 0.25 + 25_000);
  return 50_000;
}

/** 新旧両方ある場合の1区分の控除額（有利な方を自動選択） */
function calcCategoryDeduction(
  newPremium: number,
  oldPremium: number
): { deduction: number; method: "new_only" | "old_only" | "combined" } {
  if (newPremium <= 0 && oldPremium <= 0) {
    return { deduction: 0, method: "new_only" };
  }
  if (oldPremium > 0 && newPremium <= 0) {
    return { deduction: calcOldSystemDeduction(oldPremium), method: "old_only" };
  }
  if (newPremium > 0 && oldPremium <= 0) {
    return { deduction: calcNewSystemDeduction(newPremium), method: "new_only" };
  }

  // 新旧両方ある場合: 旧制度のみ vs 新旧合算（上限4万円）の有利な方
  const oldOnly = calcOldSystemDeduction(oldPremium);
  const combined = Math.min(
    calcNewSystemDeduction(newPremium) + calcOldSystemDeduction(oldPremium),
    40_000
  );

  if (oldOnly > combined) {
    return { deduction: oldOnly, method: "old_only" };
  }
  return { deduction: combined, method: "combined" };
}

/** 全体の控除額（3区分合計、上限12万円） */
export function calcLifeInsuranceDeduction(params: {
  generalNew: number;
  generalOld: number;
  medicalNew: number;
  pensionNew: number;
  pensionOld: number;
}): {
  total: number;
  general: number;
  generalMethod: string;
  medical: number;
  pension: number;
  pensionMethod: string;
} {
  const general = calcCategoryDeduction(params.generalNew, params.generalOld);
  const medical = calcNewSystemDeduction(params.medicalNew);
  const pension = calcCategoryDeduction(params.pensionNew, params.pensionOld);

  const total = Math.min(general.deduction + medical + pension.deduction, 120_000);

  const methodLabel: Record<string, string> = {
    new_only: "新制度のみ",
    old_only: "旧制度のみ",
    combined: "新旧合算",
  };

  return {
    total,
    general: general.deduction,
    generalMethod: methodLabel[general.method],
    medical,
    pension: pension.deduction,
    pensionMethod: methodLabel[pension.method],
  };
}
