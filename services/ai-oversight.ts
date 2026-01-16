
export type AIStatus = 'ACTIVE' | 'WARNING' | 'IDLE';

export interface AIAlert {
  id: string;
  sourceId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  timestamp: string;
}

export interface AIRelationship {
  from: string;
  to: string;
  type: 'DATA_FLOW' | 'VALIDATION' | 'DEPENDENCY';
}

export const aiOversightService = {
  getAlerts(): AIAlert[] {
    return [
      { id: 'AL-001', sourceId: 'AI-06', severity: 'MEDIUM', message: 'HS Code mapping for VN profile shows 12% ambiguity.', timestamp: '3m ago' },
      { id: 'AL-002', sourceId: 'AI-13', severity: 'HIGH', message: 'Ledger discrepancy detected in Block #148201.', timestamp: '10m ago' },
      { id: 'AL-003', sourceId: 'AI-18', severity: 'LOW', message: 'New evolution proposal generated for Cycle 13.', timestamp: '1h ago' },
    ];
  },

  getRelationships(): AIRelationship[] {
    return [
      { from: 'AI-01', to: 'AI-05', type: 'DEPENDENCY' },
      { from: 'AI-05', to: 'AI-06', type: 'DATA_FLOW' },
      { from: 'AI-06', to: 'AI-08', type: 'VALIDATION' },
      { from: 'AI-08', to: 'AI-13', type: 'VALIDATION' },
      { from: 'AI-09', to: 'AI-18', type: 'DATA_FLOW' },
    ];
  },

  getAIAgentStatuses(): Record<string, AIStatus> {
    const statuses: Record<string, AIStatus> = {};
    for (let i = 1; i <= 18; i++) {
      const id = `AI-${i.toString().padStart(2, '0')}`;
      if (id === 'AI-06' || id === 'AI-13') statuses[id] = 'WARNING';
      else if (id === 'AI-16' || id === 'AI-18') statuses[id] = 'IDLE';
      else statuses[id] = 'ACTIVE';
    }
    return statuses;
  },

  getActivityLogs(agentId: string) {
    return [
      { time: '10:45:01', action: 'Scanning ledger shards', result: 'SUCCESS' },
      { time: '10:44:55', action: 'Validating hash chain continuity', result: 'SUCCESS' },
      { time: '10:44:12', action: 'Inference run on tax rules', result: 'FLAGGED' },
    ];
  }
};
