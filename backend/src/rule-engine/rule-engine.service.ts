
import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleEngineService {
  // RuleSet v4.4.0 Matrix
  private readonly MATRICES = {
    FULL: { F1: 0.08, F2: 0.085, F3: 0.11, FUND: 0.025, TOTAL: 0.30 },
    PARTIAL: { F1: 0.12, F2: 0.155, F3: 0, FUND: 0.025, TOTAL: 0.30 }
  };

  private readonly PROMOTION_RULES = {
    F3_TO_F2: { minRevenue: 5500, minCustomers: 20, minQuality: 96 },
    F2_TO_F1: { minDirectRevenue: 2500, minCycles: 2 }
  };

  /**
   * Tính toán phân bổ giá trị theo RuleSet v4.4.0
   */
  calculateDistribution(amount: number, hasF3: boolean) {
    const matrix = hasF3 ? this.MATRICES.FULL : this.MATRICES.PARTIAL;
    
    return {
      f1Share: amount * matrix.F1,
      f2Share: amount * matrix.F2,
      f3Share: hasF3 ? amount * matrix.F3 : 0,
      systemFund: amount * matrix.FUND,
      ceilingMet: true,
      rulesetVersion: '4.4.0'
    };
  }

  /**
   * Tính toán thù lao Royalty (Truyền thừa)
   */
  calculateRoyalty(newF2Production: number) {
    const ROYALTY_RATE = 0.01; // 1%
    return {
      f1Bonus: newF2Production * ROYALTY_RATE,
      oldF2Bonus: newF2Production * ROYALTY_RATE,
      note: "Deducted from system liquidity buffer, maintaining 30% ceiling."
    };
  }

  /**
   * AI-14: State Machine Renewal Logic
   */
  computeNewRole(currentRole: string, metrics: { revenue: number, count: number, quality: number, cycles: number }) {
    if (currentRole === 'GUIDE') return 'GUIDE'; // Bậc cao nhất

    if (currentRole === 'OPERATOR') {
      if (metrics.revenue >= this.PROMOTION_RULES.F2_TO_F1.minDirectRevenue && 
          metrics.cycles >= this.PROMOTION_RULES.F2_TO_F1.minCycles) {
        return 'GUIDE'; // Thăng lên Guide (F3/F1 mix)
      }
      return metrics.quality >= 90 ? 'OPERATOR' : 'CREATOR';
    }

    if (currentRole === 'CREATOR') {
      if (metrics.revenue >= this.PROMOTION_RULES.F3_TO_F2.minRevenue && 
          metrics.quality >= this.PROMOTION_RULES.F3_TO_F2.minQuality) {
        return 'OPERATOR';
      }
      return 'CREATOR';
    }

    return 'CREATOR';
  }
}
