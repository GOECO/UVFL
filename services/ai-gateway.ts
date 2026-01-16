
export type AIProviderId = 'GOOGLE_GEMINI' | 'OPENAI_GPT' | 'ANTHROPIC' | 'LOCAL_LLAMA';
export type AIRouteTask = 'GENERAL_CHAT' | 'LEDGER_ANALYZE' | 'TAX_COMPLIANCE' | 'SECURITY_RECON' | 'EMBEDDING';

export interface AIProvider {
  id: AIProviderId;
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latency: number;
  costPer1k: number; // USD
  priority: number;
}

export interface RoutingRule {
  task: AIRouteTask;
  primaryProvider: AIProviderId;
  fallbackProvider: AIProviderId;
  maxTokens: number;
}

export interface PromptTemplate {
  agentId: string;
  name: string;
  version: string;
  systemInstruction: string;
  isLocked: boolean;
}

export interface BudgetLimit {
  scope: 'COUNTRY' | 'MODULE' | 'GLOBAL';
  targetId: string; // e.g., 'VN' or 'AI-06'
  dailyLimit: number;
  currentSpend: number;
}

export interface AIUsageRecord {
  timestamp: string;
  agentId: string;
  provider: AIProviderId;
  task: AIRouteTask;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  status: 'SUCCESS' | 'FALLBACK' | 'FAILED';
}

export const aiGatewayService = {
  getProviders(): AIProvider[] {
    return [
      { id: 'GOOGLE_GEMINI', name: 'Google Gemini 1.5 Pro', status: 'ONLINE', latency: 420, costPer1k: 0.0035, priority: 1 },
      { id: 'OPENAI_GPT', name: 'OpenAI GPT-4o', status: 'ONLINE', latency: 650, costPer1k: 0.015, priority: 2 },
      { id: 'LOCAL_LLAMA', name: 'Sovereign Llama 3', status: 'ONLINE', latency: 110, costPer1k: 0.0001, priority: 3 },
    ];
  },

  getRoutingRules(): RoutingRule[] {
    return [
      { task: 'TAX_COMPLIANCE', primaryProvider: 'OPENAI_GPT', fallbackProvider: 'GOOGLE_GEMINI', maxTokens: 2048 },
      { task: 'GENERAL_CHAT', primaryProvider: 'GOOGLE_GEMINI', fallbackProvider: 'LOCAL_LLAMA', maxTokens: 1024 },
      { task: 'SECURITY_RECON', primaryProvider: 'GOOGLE_GEMINI', fallbackProvider: 'OPENAI_GPT', maxTokens: 4096 }
    ];
  },

  getBudgets(): BudgetLimit[] {
    return [
      { scope: 'MODULE', targetId: 'AI-06 (Compliance)', dailyLimit: 50, currentSpend: 12.4 },
      { scope: 'MODULE', targetId: 'AI-13 (Security)', dailyLimit: 100, currentSpend: 45.8 },
      { scope: 'COUNTRY', targetId: 'Vietnam (VN)', dailyLimit: 200, currentSpend: 155.2 },
    ];
  },

  getUsageLogs(): AIUsageRecord[] {
    return [
      { timestamp: '2024-03-25 14:20:01', agentId: 'AI-13', provider: 'GOOGLE_GEMINI', task: 'SECURITY_RECON', tokensIn: 1500, tokensOut: 600, cost: 0.007, status: 'SUCCESS' },
      { timestamp: '2024-03-25 14:18:30', agentId: 'AI-06', provider: 'OPENAI_GPT', task: 'TAX_COMPLIANCE', tokensIn: 800, tokensOut: 300, cost: 0.016, status: 'SUCCESS' },
    ];
  },

  getTemplates(): PromptTemplate[] {
    // Demo 2/18 agents
    return [
      { agentId: 'AI-01', name: 'Product Architect', version: '1.2.0', systemInstruction: 'You are the UVFL Product Architect...', isLocked: true },
      { agentId: 'AI-06', name: 'Compliance Expert', version: '2.4.1', systemInstruction: 'Strict tax analyzer for HS codes...', isLocked: false },
    ];
  },

  maskPII(text: string): string {
    return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL_MASKED]")
               .replace(/ID-[0-9]{6,}/g, "[ID_MASKED]");
  }
};
