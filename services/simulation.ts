
export interface SimulationScenario {
  f1Count: number;
  f2Count: number;
  f3Count: number;
  avgRevenue: number;
  validationRate: number;
  rulesetVersion: string;
}

export interface SimulationResult {
  totalRevenue: number;
  distributedAmount: number;
  systemFund: number;
  royaltyPayout: number;
  effectiveRate: number; // Tỷ lệ thực tế (phải <= 30%)
  demotionForecast: number;
  isViolation: boolean;
}

export const simulationService = {
  calculate(scenario: SimulationScenario, matrix: any): SimulationResult {
    const totalRevenue = (scenario.f1Count + scenario.f2Count + scenario.f3Count) * scenario.avgRevenue;
    
    // Tính toán thù lao cơ bản
    const f1Total = totalRevenue * (matrix.f1 / 100);
    const f2Total = totalRevenue * (matrix.f2 / 100);
    const f3Total = totalRevenue * (matrix.f3 / 100);
    const fundTotal = totalRevenue * (matrix.fund / 100);
    
    // Mô phỏng Royalty (giả định 5% F3 thăng tiến lên F2 mỗi chu kỳ)
    const promotionCount = Math.floor(scenario.f3Count * 0.05);
    const royaltyPayout = promotionCount * scenario.avgRevenue * 0.02; // 2% royalty (1% F1, 1% Old F2)
    
    const distributedAmount = f1Total + f2Total + f3Total + royaltyPayout;
    const effectiveRate = (distributedAmount / totalRevenue) * 100;
    
    // Dự báo demotion (nếu validationRate < 90%)
    const demotionForecast = scenario.validationRate < 90 ? Math.floor(scenario.f2Count * 0.15) : 0;

    return {
      totalRevenue,
      distributedAmount,
      systemFund: fundTotal,
      royaltyPayout,
      effectiveRate,
      demotionForecast,
      isViolation: effectiveRate > 30.0
    };
  },

  getAvailableRuleSets() {
    return [
      { id: 'v4.4.0', label: 'Current Mainnet (v4.4.0)', matrix: { f1: 8.0, f2: 8.5, f3: 11.0, fund: 2.5 } },
      { id: 'v4.5.0-draft', label: 'Experimental Draft (v4.5.0)', matrix: { f1: 9.0, f2: 9.0, f3: 9.5, fund: 2.5 } }
    ];
  }
};
