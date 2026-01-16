
export interface PayoutMatrix {
  f1: number;
  f2: number;
  f3: number;
  fund: number;
  total: number;
}

export interface RuleSet {
  version: string;
  ceiling: number;
  matrices: {
    full: PayoutMatrix;
    partial: PayoutMatrix;
  };
  promotion: {
    f3_to_f2: { revenue: number; customers: number; valQuality: number };
    f2_to_f1: { directRevenue: number; cycles: number };
  };
  royalty: {
    f1_bonus: number;
    old_f2_bonus: number;
    source: string;
  };
}

export const rulesetService = {
  getLatestRuleSet(): RuleSet {
    return {
      version: 'v4.4.0',
      ceiling: 30.0,
      matrices: {
        full: { f1: 8.0, f2: 8.5, f3: 11.0, fund: 2.5, total: 30.0 },
        partial: { f1: 12.0, f2: 15.5, f3: 0, fund: 2.5, total: 30.0 }
      },
      promotion: {
        f3_to_f2: { revenue: 5500, customers: 20, valQuality: 96 },
        f2_to_f1: { directRevenue: 2500, cycles: 2 }
      },
      royalty: {
        f1_bonus: 1.0,
        old_f2_bonus: 1.0,
        source: 'New F2 production share'
      }
    };
  },

  simulateScenario(amount: number, type: 'FULL' | 'PARTIAL'): any {
    const rs = this.getLatestRuleSet();
    const m = type === 'FULL' ? rs.matrices.full : rs.matrices.partial;
    return {
      f1_payout: (amount * m.f1) / 100,
      f2_payout: (amount * m.f2) / 100,
      f3_payout: (amount * m.f3) / 100,
      fund_payout: (amount * m.fund) / 100,
      total: (amount * m.total) / 100
    };
  }
};
