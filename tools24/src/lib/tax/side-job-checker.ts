import { calcEmploymentIncome, calcIncomeTax } from "./income-tax";

export type SideJobType =
  | "freelance"    // フリーランス・業務委託
  | "part_time"    // アルバイト・パート
  | "stock"        // 株式・投資信託
  | "crypto"       // 仮想通貨
  | "real_estate"  // 不動産
  | "retired"      // 年の途中で退職
  | "other";       // その他

export interface SideJobResult {
  needsFiling: boolean;
  reason: string;
  sideJobIncome: number;
  estimatedTax: number;
  incomeType: string;
  tips: string[];
}

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

export function checkSideJob(params: {
  salary: number;
  sideJobType: SideJobType;
  sideJobRevenue: number;
  sideJobExpenses: number;
  sideJobWithholding: number;
}): SideJobResult {
  const sideJobIncome = Math.max(0, params.sideJobRevenue - params.sideJobExpenses);
  const threshold = 200_000;

  let needsFiling = false;
  let reason = "";
  let incomeType = "";
  const tips: string[] = [];

  // 所得区分と判定
  switch (params.sideJobType) {
    case "freelance":
      incomeType = "雑所得 または 事業所得";
      if (sideJobIncome > threshold) {
        needsFiling = true;
        reason = `副業所得（${fmt(sideJobIncome)}円）が20万円を超えているため、確定申告が必要です。`;
        tips.push(
          "開業届を税務署に提出すると、青色申告を選択でき、最大65万円の特別控除が受けられます。節税効果が大きいため、継続的な副業の場合は検討を。"
        );
      } else {
        needsFiling = false;
        reason = `副業所得（${fmt(sideJobIncome)}円）が20万円以下のため、所得税の確定申告は不要です。`;
      }
      break;

    case "part_time":
      incomeType = "給与所得（アルバイト・パート）";
      if (params.sideJobRevenue > threshold) {
        needsFiling = true;
        reason = `アルバイト・パートの給与収入（${fmt(params.sideJobRevenue)}円）が20万円を超えているため、確定申告が必要です。`;
      } else {
        needsFiling = false;
        reason = `アルバイト・パートの給与収入（${fmt(params.sideJobRevenue)}円）が20万円以下のため、所得税の確定申告は不要です。`;
      }
      break;

    case "stock":
      incomeType = "譲渡所得（株式・投資信託）";
      needsFiling = false;
      reason =
        "特定口座（源泉徴収あり）での取引であれば、申告不要制度を選択できます。ただし、損益通算や損失の繰り越し控除を行う場合は確定申告が必要です。";
      tips.push(
        "損失が出た場合、確定申告することで翌年以降3年間の損失繰り越しができます。特に損失が大きい年は申告を検討してください。"
      );
      break;

    case "crypto":
      incomeType = "雑所得（仮想通貨）";
      if (sideJobIncome > threshold) {
        needsFiling = true;
        reason = `仮想通貨の売却益（${fmt(sideJobIncome)}円）が20万円を超えているため、確定申告が必要です。`;
        tips.push(
          "仮想通貨の利益は総合課税の雑所得として扱われ、株式のような分離課税や損失繰り越しの優遇はありません。他の所得と合算して税率が決まります。"
        );
      } else {
        needsFiling = false;
        reason = `仮想通貨の売却益（${fmt(sideJobIncome)}円）が20万円以下のため、所得税の確定申告は不要です。`;
      }
      break;

    case "real_estate":
      incomeType = "不動産所得";
      if (sideJobIncome > threshold) {
        needsFiling = true;
        reason = `不動産所得（${fmt(sideJobIncome)}円）が20万円を超えているため、確定申告が必要です。`;
        tips.push(
          "不動産所得は経費を多く計上できます。固定資産税、管理費、修繕費、減価償却費、ローン利息などを漏れなく計上しましょう。"
        );
      } else {
        needsFiling = false;
        reason = `不動産所得（${fmt(sideJobIncome)}円）が20万円以下のため、所得税の確定申告は不要です。`;
      }
      break;

    case "retired":
      incomeType = "給与所得（退職後）";
      needsFiling = true;
      reason = "年末調整を受けていないため、確定申告で所得税の精算が必要です。";
      tips.push("退職金がある場合、『退職所得の受給に関する申告書』を提出済みなら退職金への追加課税はありません。");
      tips.push("源泉徴収で払い過ぎた税金が戻る（還付される）可能性が高いです。");
      tips.push("退職した会社の源泉徴収票が必要です。届かない場合は会社に請求してください。");
      tips.push("再就職して年末調整を受けた場合は、確定申告は不要な場合があります。");
      break;

    case "other":
    default:
      incomeType = "雑所得";
      if (sideJobIncome > threshold) {
        needsFiling = true;
        reason = `副業所得（${fmt(sideJobIncome)}円）が20万円を超えているため、確定申告が必要です。`;
      } else {
        needsFiling = false;
        reason = `副業所得（${fmt(sideJobIncome)}円）が20万円以下のため、所得税の確定申告は不要です。`;
      }
      break;
  }

  // 共通tips
  tips.unshift(
    "所得税の申告が不要な場合でも、住民税（市区町村税）の申告は金額を問わず必要です。お住まいの市区町村役所に申告してください。"
  );

  if (params.sideJobType !== "stock") {
    tips.push(
      "経費を正しく計上すると副業所得を減らせます。通信費、交通費、書籍代、消耗品費など副業に関連する支出の領収書は必ず保管しましょう。"
    );
  }

  tips.push(
    "会社に副業収入を知られたくない場合は、確定申告書の第二表で「住民税・事業税に関する事項」の給与以外の所得に係る住民税の徴収方法を「自分で納付（普通徴収）」に設定してください。"
  );

  // 追加税額概算（本業の課税所得に副業所得を加算した場合の増分）
  const employmentIncome = calcEmploymentIncome(params.salary);
  // 本業だけの場合の課税所得（社会保険料15%・基礎控除48万円で簡易計算）
  const approxDeductions = Math.floor(params.salary * 0.15) + 480_000;
  const baseTaxableIncome = Math.max(0, employmentIncome - approxDeductions);
  const { rate: marginalRate } = calcIncomeTax(baseTaxableIncome + sideJobIncome);
  const grossAdditionalTax = Math.floor(sideJobIncome * marginalRate);
  const estimatedTax = Math.max(0, grossAdditionalTax - params.sideJobWithholding);

  return {
    needsFiling,
    reason,
    sideJobIncome,
    estimatedTax,
    incomeType,
    tips,
  };
}
