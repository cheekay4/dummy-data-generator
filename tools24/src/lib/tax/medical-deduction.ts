/** 医療費控除の計算 */
export function calcMedicalDeduction(
  totalMedicalExpense: number,
  insuranceReimbursement: number,
  totalIncome: number
): { deduction: number; threshold: number; netExpense: number } {
  // 実質負担額
  const netExpense = Math.max(0, totalMedicalExpense - insuranceReimbursement);

  // 足切り額: 総所得200万円未満なら総所得の5%、200万円以上なら10万円
  const threshold = totalIncome < 2_000_000
    ? Math.floor(totalIncome * 0.05)
    : 100_000;

  // 控除額（上限200万円）
  const deduction = Math.min(
    Math.max(0, netExpense - threshold),
    2_000_000
  );

  return { deduction, threshold, netExpense };
}
