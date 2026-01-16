
export interface FreezeEvent {
  id: string;
  type: 'FREEZE' | 'THAW';
  reason: string;
  actor: string;
  timestamp: string;
  evidenceHash: string;
}

export interface EmergencyState {
  isFrozen: boolean;
  activeFreezeId?: string;
  reason?: string;
  startTime?: string;
}

// Giả lập trạng thái toàn cục (Trong thực tế sẽ dùng Store hoặc Backend)
let globalEmergencyState: EmergencyState = {
  isFrozen: false
};

export const emergencyService = {
  getEmergencyState(): EmergencyState {
    return globalEmergencyState;
  },

  getFreezeHistory(): FreezeEvent[] {
    return [
      { 
        id: 'FRZ-9901', 
        type: 'FREEZE', 
        reason: 'AI-13: Reconciliation mismatch > 500 USDT in Block #148201', 
        actor: 'SYSTEM_AUTO', 
        timestamp: '2024-03-22 14:30',
        evidenceHash: 'sha256:7f8a...e91c'
      },
      { 
        id: 'THW-9901', 
        type: 'THAW', 
        reason: 'Root cause identified: Double-entry bug in regional VN node. Patch applied.', 
        actor: 'ADMIN_CORE', 
        timestamp: '2024-03-22 16:00',
        evidenceHash: 'sha256:a1b2...c3d4'
      }
    ];
  },

  activateFreeze(reason: string, actor: string): string {
    const id = 'FRZ-' + Math.random().toString(16).slice(2, 6).toUpperCase();
    globalEmergencyState = {
      isFrozen: true,
      activeFreezeId: id,
      reason,
      startTime: new Date().toISOString()
    };
    console.warn(`[EMERGENCY] System Frozen by ${actor}. Reason: ${reason}`);
    return id;
  },

  deactivateFreeze(reason: string, actor: string) {
    globalEmergencyState = { isFrozen: false };
    console.log(`[EMERGENCY] System Thawed by ${actor}. Resolution: ${reason}`);
  }
};
