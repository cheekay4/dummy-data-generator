export type EmploymentStatus =
  | 'employee'          // 会社員（年末調整あり）
  | 'part_time_adjusted'  // パート（年末調整あり）
  | 'part_time_no_adjust' // パート（年末調整なし）
  | 'self_employed'     // 自営業
  | 'pensioner'         // 年金受給者
  | 'unemployed';       // 無職・その他

export type FilingStatus = 'required' | 'not_required' | 'recommended';

export interface FilingResult {
  status: FilingStatus;
  reasons: string[];
  recommendedTools: string[]; // ツールのパス配列
  tips: string[];
}

// 条件IDと説明のマッピング
const CONDITION_LABELS: Record<string, string> = {
  side_job: '副業の所得が20万円を超える',
  high_income: '給与の年収が2,000万円を超える',
  multi_employer: '2か所以上から給与をもらっている',
  medical: '医療費が年間10万円を超えた',
  furusato: 'ふるさと納税を6自治体以上にした（またはワンストップ未申請）',
  housing_loan: '住宅ローン控除を初めて受ける（1年目）',
  retired_no_adjust: '年の途中で退職し、年末調整を受けていない',
  investment: '株式や仮想通貨の利益がある（特定口座の源泉徴収ありを除く）',
  pension_high: '公的年金等の収入が400万円を超える',
  pension_other: '年金以外の所得が20万円を超える',
};

// 条件ごとのおすすめツール
const CONDITION_TOOLS: Record<string, string[]> = {
  side_job: ['/side-job', '/income-tax'],
  high_income: ['/income-tax'],
  multi_employer: ['/income-tax'],
  medical: ['/medical', '/income-tax'],
  furusato: ['/furusato', '/income-tax'],
  housing_loan: ['/housing-loan', '/income-tax'],
  retired_no_adjust: ['/income-tax'],
  investment: ['/income-tax'],
  pension_high: ['/income-tax'],
  pension_other: ['/income-tax', '/side-job'],
};

export function checkFilingNeed(
  employment: EmploymentStatus,
  conditions: string[]
): FilingResult {
  const noneSelected = conditions.includes('none');

  // 自営業・フリーランス → 常に必要
  if (employment === 'self_employed') {
    return {
      status: 'required',
      reasons: ['自営業・フリーランスの方は確定申告が原則必要です'],
      recommendedTools: ['/income-tax', '/side-job'],
      tips: ['青色申告を利用すると最大65万円の特別控除が受けられます'],
    };
  }

  // パート（年末調整なし） → 基本的に必要
  if (employment === 'part_time_no_adjust') {
    return {
      status: 'required',
      reasons: ['年末調整を受けていないため、確定申告が必要です'],
      recommendedTools: ['/income-tax'],
      tips: ['給与収入が103万円以下の場合は所得税がかからない可能性があります'],
    };
  }

  // 無職 → 収入がなければ不要
  if (employment === 'unemployed') {
    return {
      status: 'not_required',
      reasons: [],
      recommendedTools: [],
      tips: ['収入がない場合は確定申告は不要です。ただし、退職後に収入があった場合は申告が必要になることがあります'],
    };
  }

  // 年金受給者
  if (employment === 'pensioner') {
    const requiredConditions = conditions.filter(c =>
      ['pension_high', 'pension_other'].includes(c)
    );
    const recommendedConditions = conditions.filter(c =>
      ['medical'].includes(c)
    );

    if (noneSelected) {
      return {
        status: 'not_required',
        reasons: [],
        recommendedTools: [],
        tips: ['公的年金等の収入が400万円以下で、年金以外の所得が20万円以下の場合は申告不要です'],
      };
    }

    if (requiredConditions.length > 0) {
      const reasons = requiredConditions.map(c => CONDITION_LABELS[c]);
      const tools = [...new Set(requiredConditions.flatMap(c => CONDITION_TOOLS[c] ?? []))];
      return {
        status: 'required',
        reasons,
        recommendedTools: tools,
        tips: ['確定申告書を作成する際は、国税庁の「確定申告書等作成コーナー」が便利です'],
      };
    }

    if (recommendedConditions.length > 0) {
      return {
        status: 'recommended',
        reasons: recommendedConditions.map(c => CONDITION_LABELS[c]),
        recommendedTools: ['/medical', '/income-tax'],
        tips: ['医療費が10万円を超えた場合、還付申告により税金が戻る可能性があります'],
      };
    }

    return {
      status: 'not_required',
      reasons: [],
      recommendedTools: [],
      tips: [],
    };
  }

  // 会社員・パート（年末調整あり）
  if (employment === 'employee' || employment === 'part_time_adjusted') {
    if (noneSelected) {
      return {
        status: 'not_required',
        reasons: [],
        recommendedTools: [],
        tips: [
          '年末調整で税金の精算が済んでいます',
          '医療費が10万円を超えた場合は還付申告で税金が戻る可能性があります',
          'ふるさと納税（ワンストップ未申請分）がある場合も還付申告が必要です',
        ],
      };
    }

    // 必須申告条件
    const requiredConditionIds = ['side_job', 'high_income', 'multi_employer', 'retired_no_adjust', 'investment'];
    const requiredMatches = conditions.filter(c => requiredConditionIds.includes(c));

    // 還付申告推奨条件
    const recommendedConditionIds = ['medical', 'furusato', 'housing_loan'];
    const recommendedMatches = conditions.filter(c => recommendedConditionIds.includes(c));

    if (requiredMatches.length > 0) {
      const allMatches = [...requiredMatches, ...recommendedMatches];
      const reasons = allMatches.map(c => CONDITION_LABELS[c]);
      const tools = [...new Set(allMatches.flatMap(c => CONDITION_TOOLS[c] ?? []))];
      return {
        status: 'required',
        reasons,
        recommendedTools: tools,
        tips: ['申告期限は2026年3月16日（月）です'],
      };
    }

    if (recommendedMatches.length > 0) {
      const reasons = recommendedMatches.map(c => CONDITION_LABELS[c]);
      const tools = [...new Set(recommendedMatches.flatMap(c => CONDITION_TOOLS[c] ?? []))];
      return {
        status: 'recommended',
        reasons,
        recommendedTools: tools,
        tips: ['還付申告は5年間さかのぼって申告できます'],
      };
    }

    return {
      status: 'not_required',
      reasons: [],
      recommendedTools: [],
      tips: [],
    };
  }

  return {
    status: 'not_required',
    reasons: [],
    recommendedTools: [],
    tips: [],
  };
}
