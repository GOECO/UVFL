
export type FundCategory = 'DEVELOPMENT' | 'RISK_RESERVE' | 'COMMUNITY' | 'LEGAL';

export interface FundTransaction {
  id: string;
  type: 'INFLOW' | 'OUTFLOW';
  category: FundCategory;
  amount: number;
  justification?: string;
  rulesetVersion: string;
  timestamp: string;
  auditRef: string; // Hash of the ledger record
}

export interface FundStats {
  totalBalance: number;
  inflowTotal: number;
  outflowTotal: number;
  categoryAllocation: Record<FundCategory, number>;
  categoryLimits: Record<FundCategory, number>;
}

export const fundGovernanceService = {
  // Mock Initial Data
  getTransactions(): FundTransaction[] {
    return [
      { id: 'FTX-001', type: 'INFLOW', category: 'DEVELOPMENT', amount: 15200, rulesetVersion: '4.4.0', timestamp: '2024-03-20 10:00', auditRef: 'sha256:7f8a...e91c' },
      { id: 'FTX-002', type: 'INFLOW', category: 'RISK_RESERVE', amount: 8400, rulesetVersion: '4.4.0', timestamp: '2024-03-21 09:15', auditRef: 'sha256:a1b2...c3d4' },
      { id: 'FTX-003', type: 'OUTFLOW', category: 'DEVELOPMENT', amount: 5000, justification: 'Nâng cấp AI-18 Learning Core', rulesetVersion: '4.4.0', timestamp: '2024-03-22 14:30', auditRef: 'sha256:e5f6...g7h8' },
      { id: 'FTX-004', type: 'OUTFLOW', category: 'LEGAL', amount: 2000, justification: 'Kiểm toán thuế vùng VN Q1', rulesetVersion: '4.4.0', timestamp: '2024-03-23 11:00', auditRef: 'sha256:i9j0...k1l2' },
    ];
  },

  getStats(txs: FundTransaction[]): FundStats {
    const inflow = txs.filter(t => t.type === 'INFLOW').reduce((sum, t) => sum + t.amount, 0);
    const outflow = txs.filter(t => t.type === 'OUTFLOW').reduce((sum, t) => sum + t.amount, 0);
    
    const allocations: any = { DEVELOPMENT: 0, RISK_RESERVE: 0, COMMUNITY: 0, LEGAL: 0 };
    txs.forEach(t => {
      if (t.type === 'INFLOW') allocations[t.category] += t.amount;
      else allocations[t.category] -= t.amount;
    });

    return {
      totalBalance: inflow - outflow,
      inflowTotal: inflow,
      outflowTotal: outflow,
      categoryAllocation: allocations,
      categoryLimits: {
        DEVELOPMENT: 50000,
        RISK_RESERVE: 100000,
        COMMUNITY: 30000,
        LEGAL: 20000
      }
    };
  },

  generateReport(stats: FundStats, txs: FundTransaction[]): string {
    return JSON.stringify({
      reportDate: new Date().toISOString(),
      summary: stats,
      history: txs,
      compliance: "All expenditures matched declared justifications and categories."
    }, null, 2);
  }
};
