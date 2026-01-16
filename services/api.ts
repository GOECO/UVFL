
/**
 * UVFL Global API Client Layer
 * Encapsulates all data fetching and mutation logic.
 */

export const apiClient = {
  // Value Management
  async getRecords() {
    // Mimic API delay
    await new Promise(r => setTimeout(r, 800));
    return [
      { id: 'REC-01', amount: 1200, asset: 'USDT', status: 'VALIDATED' },
      { id: 'REC-02', amount: 500, asset: 'GOLD', status: 'PENDING' },
    ];
  },

  async createRecord(data: { amount: number, asset: string }) {
    console.log('API: Creating value record...', data);
    return { success: true, id: 'REC-' + Math.random().toString(36).substr(2, 5).toUpperCase() };
  },

  // Network Stats
  async getNetworkHealth() {
    return {
      activeNodes: 8103,
      latency: 12,
      tps: 12482
    };
  },

  // Governance
  async getCountryConfig(isoCode: string) {
    return {
      iso: isoCode,
      vat: 10,
      kycLevel: 2
    };
  }
};
