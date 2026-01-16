
import { GoogleGenAI } from "@google/genai";

export type AppStatus = 'PENDING_REVIEW' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
export type APIScope = 'read:ledger' | 'read:wallet' | 'write:record' | 'validate:record';

export interface DeveloperApp {
  id: string;
  name: string;
  developer: string;
  status: AppStatus;
  apiKey: string;
  scopes: APIScope[];
  dailyQuota: number;
  currentUsage: number;
  environment: 'SANDBOX' | 'PRODUCTION';
  createdAt: string;
}

export interface APIUsageMetric {
  timestamp: string;
  appId: string;
  endpoint: string;
  status: number;
  latency: number;
}

export const developerPlatformService = {
  getApps(): DeveloperApp[] {
    return [
      { 
        id: 'APP-771', name: 'ZaloPay Merchant Bridge', developer: 'VNG Corp', 
        status: 'ACTIVE', apiKey: 'uvfl_live_8f2a...102b', 
        scopes: ['read:ledger', 'write:record'], dailyQuota: 50000, currentUsage: 12450,
        environment: 'PRODUCTION', createdAt: '2024-01-15'
      },
      { 
        id: 'APP-102', name: 'ERP Compliance Module', developer: 'FPT Software', 
        status: 'PENDING_REVIEW', apiKey: 'uvfl_test_d4e1...f009', 
        scopes: ['read:ledger', 'read:wallet', 'validate:record'], dailyQuota: 10000, currentUsage: 0,
        environment: 'SANDBOX', createdAt: '2024-03-20'
      }
    ];
  },

  getUsageMetrics(): APIUsageMetric[] {
    return [
      { timestamp: '2024-03-25 15:45:01', appId: 'APP-771', endpoint: '/v1/records/create', status: 201, latency: 420 },
      { timestamp: '2024-03-25 15:44:30', appId: 'APP-771', endpoint: '/v1/ledger/query', status: 200, latency: 150 },
      { timestamp: '2024-03-25 15:40:12', appId: 'APP-102', endpoint: '/v1/auth/verify', status: 401, latency: 45 },
    ];
  },

  async generateDocsForEndpoint(endpoint: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the UVFL Open API Technical Writer. Generate a clean Markdown documentation snippet for the endpoint: ${endpoint}. 
        Include standard headers: X-UVFL-APP-ID, X-UVFL-SIGNATURE.
        Mention that every write operation requires a TEE proof hash according to UVFL Protocol v4.4.`
      });
      return response.text || "Documentation loading...";
    } catch (e) {
      return "Tài liệu kỹ thuật tạm thời ngoại tuyến do lỗi kết nối AI.";
    }
  }
};
