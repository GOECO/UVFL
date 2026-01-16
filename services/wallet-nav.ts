
import { AssetType, FXSnapshot } from './asset-engine';

export interface WalletBalance {
  asset: AssetType;
  available: number;
  locked: number;
  currency: string;
}

export interface UserWallet {
  userId: string;
  userName: string;
  countryIso: string;
  balances: WalletBalance[];
  lastUpdate: string;
}

export interface SystemReserve {
  fundName: string;
  balances: WalletBalance[];
}

export interface NAVSnapshot {
  timestamp: string;
  totalNAV: number;
  userTotal: number;
  systemTotal: number;
  reconciliationStatus: 'SYNCED' | 'DISCREPANCY';
}

export const walletNavService = {
  getUserWallets(): UserWallet[] {
    return [
      {
        userId: 'USER-7782',
        userName: 'Nguyen Van A',
        countryIso: 'VN',
        balances: [
          { asset: 'USDT', available: 1240.50, locked: 0, currency: 'USDT' },
          { asset: 'GOLD', available: 42.15, locked: 5, currency: 'Grams' },
          { asset: 'NATIONAL', available: 15000000, locked: 0, currency: 'VND' },
          { asset: 'REWARD', available: 850, locked: 0, currency: 'V' }
        ],
        lastUpdate: '2024-03-25 10:45'
      },
      {
        userId: 'USER-1024',
        userName: 'Sato Kenji',
        countryIso: 'JP',
        balances: [
          { asset: 'USDT', available: 5000, locked: 200, currency: 'USDT' },
          { asset: 'GOLD', available: 120, locked: 0, currency: 'Grams' }
        ],
        lastUpdate: '2024-03-25 10:30'
      }
    ];
  },

  getSystemWallets(): SystemReserve[] {
    return [
      {
        fundName: 'UVFL System Fund',
        balances: [{ asset: 'USDT', available: 450000, locked: 0, currency: 'USDT' }]
      },
      {
        fundName: 'Risk Reserve',
        balances: [
          { asset: 'USDT', available: 1200000, locked: 0, currency: 'USDT' },
          { asset: 'GOLD', available: 5000, locked: 0, currency: 'Grams' }
        ]
      }
    ];
  },

  calculateNAV(balances: WalletBalance[], snapshot: FXSnapshot): number {
    return balances.reduce((sum, b) => {
      let valInFiat = 0;
      if (b.asset === 'NATIONAL') valInFiat = (b.available + b.locked);
      else if (b.asset === 'USDT') valInFiat = (b.available + b.locked) * snapshot.rates['USDT/FIAT'];
      else if (b.asset === 'GOLD') valInFiat = (b.available + b.locked) * snapshot.rates['GOLD/FIAT'];
      else if (b.asset === 'REWARD') valInFiat = (b.available + b.locked) * snapshot.rates['REWARD/FIAT'];
      
      // Quy đổi về đơn vị chuẩn (V) bằng cách chia cho tỷ giá REWARD/FIAT
      return sum + (valInFiat / snapshot.rates['REWARD/FIAT']);
    }, 0);
  },

  getNAVHistory(): NAVSnapshot[] {
    return [
      { timestamp: '2024-03-25 10:00', totalNAV: 4250000, userTotal: 2500000, systemTotal: 1750000, reconciliationStatus: 'SYNCED' },
      { timestamp: '2024-03-25 09:00', totalNAV: 4248500, userTotal: 2498500, systemTotal: 1750000, reconciliationStatus: 'SYNCED' },
      { timestamp: '2024-03-25 08:00', totalNAV: 4242000, userTotal: 2492000, systemTotal: 1750000, reconciliationStatus: 'SYNCED' },
    ];
  }
};
