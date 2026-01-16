
export type AssetType = 'USDT' | 'GOLD' | 'NATIONAL' | 'REWARD';

export interface FXSnapshot {
  id: string;
  source: string;
  timestamp: string;
  countryScope: string;
  rates: {
    'USDT/FIAT': number;
    'GOLD/FIAT': number; // theo unit của profile (gram/ounce)
    'REWARD/FIAT': number;
  };
  currency: string;
}

export interface ConversionRecord {
  id: string;
  fromAsset: AssetType;
  toAsset: AssetType;
  amount: number;
  result: number;
  snapshotId: string;
  timestamp: string;
}

export const assetEngineService = {
  getSnapshots(): FXSnapshot[] {
    return [
      {
        id: 'FXS-20240325-VN',
        source: 'Binance + SJC Oracle',
        timestamp: '2024-03-25 10:00:00',
        countryScope: 'VN',
        rates: {
          'USDT/FIAT': 25420,
          'GOLD/FIAT': 2150000, // VND per Gram
          'REWARD/FIAT': 1000
        },
        currency: 'VND'
      },
      {
        id: 'FXS-20240324-VN',
        source: 'Binance + SJC Oracle',
        timestamp: '2024-03-24 18:00:00',
        countryScope: 'VN',
        rates: {
          'USDT/FIAT': 25380,
          'GOLD/FIAT': 2145000,
          'REWARD/FIAT': 1000
        },
        currency: 'VND'
      }
    ];
  },

  calculateConversion(
    amount: number,
    from: AssetType,
    to: AssetType,
    snapshot: FXSnapshot
  ): number {
    if (from === to) return amount;

    // Quy đổi về trung gian là FIAT (National Currency)
    let amountInFiat = 0;
    if (from === 'NATIONAL') amountInFiat = amount;
    else if (from === 'USDT') amountInFiat = amount * snapshot.rates['USDT/FIAT'];
    else if (from === 'GOLD') amountInFiat = amount * snapshot.rates['GOLD/FIAT'];
    else if (from === 'REWARD') amountInFiat = amount * snapshot.rates['REWARD/FIAT'];

    // Từ FIAT sang đích
    if (to === 'NATIONAL') return amountInFiat;
    if (to === 'USDT') return amountInFiat / snapshot.rates['USDT/FIAT'];
    if (to === 'GOLD') return amountInFiat / snapshot.rates['GOLD/FIAT'];
    if (to === 'REWARD') return amountInFiat / snapshot.rates['REWARD/FIAT'];

    return 0;
  },

  getConversionLogs(): ConversionRecord[] {
    return [
      { id: 'CONV-001', fromAsset: 'USDT', toAsset: 'NATIONAL', amount: 100, result: 2542000, snapshotId: 'FXS-20240325-VN', timestamp: '2024-03-25 10:15' },
      { id: 'CONV-002', fromAsset: 'GOLD', toAsset: 'USDT', amount: 10, result: 845.79, snapshotId: 'FXS-20240325-VN', timestamp: '2024-03-25 10:20' },
    ];
  }
};
