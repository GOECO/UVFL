
export interface TestIdentity {
  id: string;
  name: string;
  roleId: string;
  kycTier: 1 | 2 | 3;
  isoCode: string;
  balanceUSDT: number;
  balanceGOLD: number;
  teeDevice: string;
  status: 'ACTIVE' | 'HIBERNATED';
}

export const sandboxService = {
  getTestIdentities(): TestIdentity[] {
    return [
      { id: 'TEST-CREATOR-01', name: 'Alpha Creator', roleId: 'R-01', kycTier: 1, isoCode: 'VN', balanceUSDT: 5000, balanceGOLD: 0, teeDevice: 'SIM-HW-001', status: 'ACTIVE' },
      { id: 'TEST-VALIDATOR-01', name: 'Beta Validator', roleId: 'R-02', kycTier: 2, isoCode: 'SG', balanceUSDT: 1000, balanceGOLD: 100, teeDevice: 'SIM-HW-042', status: 'ACTIVE' },
    ];
  },

  provisionIdentity(data: Partial<TestIdentity>): TestIdentity {
    return {
      id: `TEST-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      name: data.name || 'Anonymous Tester',
      roleId: data.roleId || 'R-01',
      kycTier: data.kycTier || 1,
      isoCode: data.isoCode || 'VN',
      balanceUSDT: data.balanceUSDT || 0,
      balanceGOLD: data.balanceGOLD || 0,
      teeDevice: `SIM-TEE-${Math.floor(Math.random() * 999)}`,
      status: 'ACTIVE'
    };
  }
};
