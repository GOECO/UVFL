
export type ProviderType = 'BANK' | 'E_WALLET' | 'CRYPTO';
export type RampStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';

export interface PaymentProvider {
  id: string;
  name: string;
  type: ProviderType;
  countries: string[]; // ISO Codes
  supportedAssets: ('USDT' | 'NATIONAL')[];
  fee: {
    provider: number; // %
    system: number;   // %
  };
  status: RampStatus;
}

export interface RampRule {
  kycLevel: number;
  dailyLimit: number;
  monthlyLimit: number;
  requireApproval: boolean;
}

export interface TransactionLog {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  asset: 'USDT' | 'NATIONAL';
  currency: string;
  providerId: string;
  totalFee: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  timestamp: string;
  auditHash: string;
}

export const paymentGatewayService = {
  getProviders(countryIso: string): PaymentProvider[] {
    return [
      { 
        id: 'P-VN-001', name: 'Vietcombank Direct', type: 'BANK', countries: ['VN'], 
        supportedAssets: ['NATIONAL'], fee: { provider: 0.1, system: 0.2 }, status: 'ACTIVE' 
      },
      { 
        id: 'P-VN-002', name: 'MoMo Business', type: 'E_WALLET', countries: ['VN'], 
        supportedAssets: ['NATIONAL'], fee: { provider: 1.5, system: 0.5 }, status: 'ACTIVE' 
      },
      { 
        id: 'P-GL-003', name: 'Binance Pay On-Ramp', type: 'CRYPTO', countries: ['VN', 'SG', 'DE'], 
        supportedAssets: ['USDT'], fee: { provider: 0.5, system: 1.0 }, status: 'MAINTENANCE' 
      }
    ];
  },

  getRampRules(countryIso: string): RampRule[] {
    return [
      { kycLevel: 1, dailyLimit: 1000, monthlyLimit: 5000, requireApproval: false },
      { kycLevel: 2, dailyLimit: 10000, monthlyLimit: 50000, requireApproval: true },
      { kycLevel: 3, dailyLimit: 100000, monthlyLimit: 500000, requireApproval: true },
    ];
  },

  getTransactionLogs(): TransactionLog[] {
    return [
      { 
        id: 'TXN-77821', userId: 'USER-7782', type: 'DEPOSIT', amount: 5000, asset: 'USDT', currency: 'USDT',
        providerId: 'Binance Pay', totalFee: 75, status: 'COMPLETED', timestamp: '2024-03-25 09:20', 
        auditHash: 'sha256:7f8a...e91c' 
      },
      { 
        id: 'TXN-77822', userId: 'USER-7782', type: 'WITHDRAW', amount: 15000000, asset: 'NATIONAL', currency: 'VND',
        providerId: 'Vietcombank', totalFee: 45000, status: 'PENDING', timestamp: '2024-03-25 10:45', 
        auditHash: 'sha256:a1b2...c3d4' 
      }
    ];
  },

  getProviderPerformance(): any {
    return [
      { provider: 'Vietcombank', volume: 85200, successRate: 99.8, avgTime: '2m' },
      { provider: 'MoMo', volume: 42100, successRate: 98.5, avgTime: '15s' },
      { provider: 'Binance Pay', volume: 124000, successRate: 94.2, avgTime: '12m' }
    ];
  }
};
