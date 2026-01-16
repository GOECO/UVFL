
export type KeyCategory = 'AI_PROVIDER' | 'PAYMENT' | 'EXTERNAL_INFRA' | 'INTERNAL';
export type KeyEnvironment = 'PROD' | 'STAGING' | 'DEV';

export interface APIKey {
  id: string;
  name: string;
  category: KeyCategory;
  environment: KeyEnvironment;
  maskedValue: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  dailyBudget: number; // Trong đơn vị USD hoặc V
  currentUsage: number;
  rateLimit: number; // requests per minute
  lastRotated: string;
  expiryDate: string;
}

export interface KeyAuditLog {
  timestamp: string;
  keyId: string;
  service: string;
  status: 'SUCCESS' | 'RATE_LIMITED' | 'UNAUTHORIZED';
  latency: number;
}

export const apiKeyService = {
  getKeys(): APIKey[] {
    return [
      {
        id: 'KEY-AI-001',
        name: 'Gemini 3 Pro Main',
        category: 'AI_PROVIDER',
        environment: 'PROD',
        maskedValue: 'AIza...7Xq9',
        status: 'ACTIVE',
        dailyBudget: 500,
        currentUsage: 124.5,
        rateLimit: 1000,
        lastRotated: '2024-02-15',
        expiryDate: '2024-08-15'
      },
      {
        id: 'KEY-PAY-042',
        name: 'Stripe Gateway VN',
        category: 'PAYMENT',
        environment: 'PROD',
        maskedValue: 'sk_live...88p2',
        status: 'ACTIVE',
        dailyBudget: 1000,
        currentUsage: 45.2,
        rateLimit: 100,
        lastRotated: '2024-01-10',
        expiryDate: '2025-01-10'
      },
      {
        id: 'KEY-EXT-108',
        name: 'Binance Oracle Feed',
        category: 'EXTERNAL_INFRA',
        environment: 'PROD',
        maskedValue: 'bin_...k2L1',
        status: 'ACTIVE',
        dailyBudget: 50,
        currentUsage: 48.9, // Sắp vượt ngưỡng
        rateLimit: 60,
        lastRotated: '2024-03-01',
        expiryDate: '2024-09-01'
      },
      {
        id: 'KEY-DEV-999',
        name: 'Test Mock Key',
        category: 'INTERNAL',
        environment: 'DEV',
        maskedValue: 'test_...demo',
        status: 'EXPIRED',
        dailyBudget: 0,
        currentUsage: 0,
        rateLimit: 9999,
        lastRotated: '2023-12-01',
        expiryDate: '2024-03-01'
      }
    ];
  },

  getAuditLogs(): KeyAuditLog[] {
    return [
      { timestamp: '2024-03-25 11:20:01', keyId: 'KEY-AI-001', service: 'AIOversight', status: 'SUCCESS', latency: 450 },
      { timestamp: '2024-03-25 11:19:45', keyId: 'KEY-EXT-108', service: 'AssetEngine', status: 'SUCCESS', latency: 120 },
      { timestamp: '2024-03-25 11:18:30', keyId: 'KEY-EXT-108', service: 'AssetEngine', status: 'RATE_LIMITED', latency: 15 },
    ];
  },

  async rotateKey(id: string): Promise<boolean> {
    console.log(`[Vault] Rotating Key ${id}... New hash generated.`);
    return true;
  }
};
