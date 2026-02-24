export type Plan = 'free' | 'pro' | 'team_s' | 'team_m' | 'team_l' | 'team_pro';

export interface PlanLimits {
  dailyScores: number;      // -1 = unlimited
  historyDays: number;      // -1 = unlimited
  customSegments: number;
  csvExport: boolean;
  preview: boolean;
  scoreTrend: boolean;
  teamFeatures: boolean;
  teamProFeatures: boolean; // CSV import / Slack / API keys
}

const TEAM_PLANS: Plan[] = ['team_s', 'team_m', 'team_l', 'team_pro'];

export function getPlanLimits(plan: Plan): PlanLimits {
  if (plan === 'pro' || TEAM_PLANS.includes(plan)) {
    return {
      dailyScores:       -1,
      historyDays:       -1,
      customSegments:    plan === 'team_pro' ? 20 : 10,
      csvExport:         true,
      preview:           true,
      scoreTrend:        true,
      teamFeatures:      plan !== 'pro',
      teamProFeatures:   plan === 'team_pro',
    };
  }
  return {
    dailyScores:       5,
    historyDays:       7,
    customSegments:    0,
    csvExport:         false,
    preview:           false,
    scoreTrend:        false,
    teamFeatures:      false,
    teamProFeatures:   false,
  };
}

/** Team Pro（自動化・連携）機能を持つプランか */
export function isTeamPro(plan: Plan): boolean {
  return plan === 'team_pro';
}

export const TEAM_PLAN_SEATS: Record<string, number> = {
  team_s:   5,
  team_m:   10,
  team_l:   30,
  team_pro: 30,
};

export const TEAM_PLAN_LABELS: Record<string, string> = {
  team_s:   'Team S',
  team_m:   'Team M',
  team_l:   'Team L',
  team_pro: 'Team Pro',
};
